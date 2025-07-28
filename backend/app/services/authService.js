/**
 * @file AuthService.js
 * @description Servicio de autenticación refactorizado con sistema de errores centralizado
 * y logging estructurado. Maneja login, registro, recuperación de contraseña y JWT.
 * 
 * MEJORAS IMPLEMENTADAS:
 * - ErrorFactory para errores consistentes en español
 * - Logger estructurado para debugging
 * - Validaciones mejoradas con contexto
 * - Manejo de errores homologado
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Sistema de errores y logging mejorado
const ErrorFactory = require('../utils/errors/ErrorFactory');
const logger = require('../utils/logging/Logger');
const { config } = require('../config/config');

// Servicios
const UserService = require('./usersService');
const service = new UserService();

class AuthService {
  /**
   * Genera un token JWT a partir de los datos del usuario.
   * @param {Object} user - Objeto de usuario que contiene `id` y `role`.
   * @returns {Object} Un objeto con el payload y el token generado.
   */
  signToken(user) {
    const payload = {
      sub: user.id, // Identificador único del usuario
      role: user.role, // Rol del usuario
      userName: user.user_name, // Nombre de usuario para mostrar en UI
    };
    // Genera el token JWT usando la clave secreta y el payload
    const token = jwt.sign(
      payload,
      config.jwtSecret
      // Opcionalmente, se puede añadir una expiración (ej., '1h')
      //{ expiresIn: '1h' }
    );
    return { payload, token }; // Retorna tanto el payload como el token
  }

  /**
   * Verifica las credenciales de un usuario para autenticación
   * @param {string} userName - Nombre de usuario
   * @param {string} password - Contraseña proporcionada por el usuario
   * @returns {Object} Datos del usuario autenticado (sin contraseña)
   * @throws {Error} Error si el usuario no existe o la contraseña es incorrecta
   */
  async getUser(userName, password) {
    const authLogger = logger.child({ operation: 'user_authentication', userName });
    
    try {
      authLogger.info('Iniciando proceso de autenticación de usuario');
      
      // Buscar usuario por nombre de usuario
      const user = await service.findByUserName(userName);
      if (!user) {
        authLogger.warn('Intento de login con usuario inexistente', { userName });
        throw ErrorFactory.unauthorized('USER_NOT_FOUND', { userName });
      }

      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        authLogger.warn('Intento de login con contraseña incorrecta', { userId: user.id, userName });
        
        // Log de seguridad por intento fallido
        logger.security('failed_login_attempt', {
          userId: user.id,
          userName,
          ip: 'unknown', // Se puede obtener del request en el controller
          reason: 'invalid_password'
        });
        
        throw ErrorFactory.unauthorized('INVALID_PASSWORD', { userName });
      }

      // Login exitoso
      authLogger.info('Autenticación exitosa', { userId: user.id });
      logger.security('successful_login', {
        userId: user.id,
        userName,
        loginTime: new Date().toISOString()
      });

      // Limpiar datos sensibles
      delete user.password;
      delete user.recovery_token;
      
      return user;
      
    } catch (error) {
      // Si es un error de nuestro sistema, re-lanzarlo
      if (error.isBoom) {
        throw error;
      }
      
      // Para errores inesperados, crear error interno
      authLogger.error('Error inesperado durante autenticación', error);
      throw ErrorFactory.internal('USER_AUTHENTICATION', error, { userName });
    }
  }

  /**
   * Envía un enlace de recuperación de contraseña al correo del usuario
   * @param {string} email - Email del usuario que solicita recuperación
   * @returns {Object} Confirmación de envío del correo
   * @throws {Error} Error si el usuario no existe o si falla el envío
   */
  async sendRecoveryLink(email) {
    const recoveryLogger = logger.child({ operation: 'password_recovery', email });
    
    try {
      recoveryLogger.info('Iniciando proceso de recuperación de contraseña');
      
      // Buscar usuario por email
      const user = await service.findByEmail(email);
      if (!user) {
        recoveryLogger.warn('Solicitud de recuperación para email inexistente', { email });
        throw ErrorFactory.unauthorized('USER_NOT_FOUND', { email });
      }

      // Generar token de recuperación con expiración
      const payload = { sub: user.id, purpose: 'password_recovery' };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
      
      // Construir enlace de recuperación
      const link = `${config.urlFront}/resetpass?token=${token}`;
      
      // Guardar token en la base de datos
      await service.update(user.id, { recovery_token: token });
      recoveryLogger.info('Token de recuperación generado y guardado', { userId: user.id });

      // Preparar correo de recuperación
      const mail = {
        from: config.email,
        to: user.email,
        subject: 'Recuperación de contraseña - Streaming App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Recuperación de contraseña</h2>
            <p>Hola <strong>${user.user_name}</strong>,</p>
            <p>Has solicitado recuperar tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Recuperar contraseña
              </a>
            </p>
            <p><strong>Importante:</strong> Este enlace es válido por 15 minutos.</p>
            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              Este es un correo automático, por favor no respondas a esta dirección.
            </p>
          </div>
        `
      };

      // Enviar correo
      const emailResult = await this.sendEmail(mail);
      recoveryLogger.info('Correo de recuperación enviado exitosamente', { 
        userId: user.id, 
        email: user.email 
      });

      // Log de seguridad
      logger.security('password_recovery_requested', {
        userId: user.id,
        email: user.email,
        tokenExpiry: '15min'
      });

      return { 
        message: 'Correo de recuperación enviado exitosamente',
        email: user.email,
        expiresIn: '15 minutos'
      };
      
    } catch (error) {
      // Si es un error de nuestro sistema, re-lanzarlo
      if (error.isBoom) {
        throw error;
      }
      
      // Para errores inesperados (probablemente del servicio de email)
      recoveryLogger.error('Error durante envío de recuperación', error);
      throw ErrorFactory.internal('PASSWORD_RECOVERY', error, { email });
    }
  }

  /**
   * Cambia la contraseña del usuario utilizando un token de recuperación.
   * @param {string} token - Token de recuperación enviado al usuario.
   * @param {string} newPassword - Nueva contraseña proporcionada por el usuario.
   * @returns {Object} Mensaje de confirmación.
   * @throws {Error} Error si el token no es válido o no coincide.
   */
  async changePassword(token, newPassword) {
    const payload = jwt.verify(token, config.jwtSecret); // Verifica el token
    const user = await service.findOne(payload.sub); // Busca al usuario por ID
    if (user.recovery_token !== token) {
      throw boom.unauthorized('Token inválido o expirado'); // Lanza error 401 si no coincide
    }
    const hash = await bcrypt.hash(newPassword, 10); // Encripta la nueva contraseña
    await service.update(user.id, { recovery_token: null, password: hash }); // Actualiza la contraseña
    return { message: 'Contraseña cambiada exitosamente' }; // Retorna mensaje de éxito
  }

  /**
   * Envía un correo electrónico utilizando nodemailer.
   * @param {Object} infoMail - Información del correo a enviar.
   * @returns {Object} Confirmación de envío del correo.
   */
  async sendEmail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Servidor SMTP
      port: 465, // Puerto seguro
      secure: true, // Habilita SSL/TLS
      auth: {
        user: config.email, // Correo del remitente
        pass: config.passEmail, // Contraseña del remitente
      },
    });
    await transporter.sendMail(infoMail); // Envía el correo
    return { message: 'Correo enviado exitosamente' }; // Retorna confirmación
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param {Object} body - Datos del usuario a registrar.
   * @returns {Object} Mensaje de confirmación.
   */
  async regiterUser(body) {
    body.roleId = 2;
    const user = await service.create(body); // Crea el usuario en la base de datos
    return { message: 'Usuario registrado exitosamente' }; // Retorna mensaje de éxito
  }
}

module.exports = AuthService;
