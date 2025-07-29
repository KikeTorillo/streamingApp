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
 * - Sistema centralizado de logs heredado de BaseService
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Sistema centralizado de errores y logging
const BaseService = require('./BaseService');
const ErrorFactory = require('../utils/errors/ErrorFactory');
const { config } = require('../config/config');

// Servicios
const UserService = require('./usersService');
const service = new UserService();

/**
 * Clase que gestiona las operaciones de autenticación del sistema.
 * Extiende BaseService para usar el sistema centralizado de errores y logging.
 */
class AuthService extends BaseService {
  constructor() {
    super('AuthService'); // Inicializar BaseService con nombre del servicio
    
    this.logger.info('AuthService inicializado correctamente');
  }
  /**
   * Genera un token JWT a partir de los datos del usuario.
   * @param {Object} user - Objeto de usuario que contiene `id` y `role`.
   * @returns {Object} Un objeto con el payload y el token generado.
   */
  signToken(user) {
    try {
      this.logger.debug('Generando token JWT', { 
        userId: user.id, 
        userName: user.user_name, 
        role: user.role 
      });
      
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
      
      this.logger.info('Token JWT generado exitosamente', { 
        userId: user.id, 
        userName: user.user_name 
      });
      
      return { payload, token }; // Retorna tanto el payload como el token
    } catch (error) {
      this.logger.error('Error al generar token JWT', { 
        userId: user.id,
        userName: user.user_name,
        error: error.message 
      });
      throw ErrorFactory.internal('AUTH', 'TOKEN_GENERATION_FAILED', {
        operation: 'sign_token',
        userId: user.id
      });
    }
  }

  /**
   * Verifica las credenciales de un usuario para autenticación
   * @param {string} userName - Nombre de usuario
   * @param {string} password - Contraseña proporcionada por el usuario
   * @returns {Object} Datos del usuario autenticado (sin contraseña)
   * @throws {Error} Error si el usuario no existe o la contraseña es incorrecta
   */
  async getUser(userName, password) {
    try {
      this.logger.info('Iniciando proceso de autenticación de usuario', { userName });
      
      // Buscar usuario por nombre de usuario
      const user = await service.findByUserName(userName);
      if (!user) {
        this.logger.warn('Intento de login con usuario inexistente', { userName });
        throw ErrorFactory.unauthorized('USER_NOT_FOUND', { userName });
      }

      this.logger.debug('Usuario encontrado, verificando contraseña', { 
        userId: user.id, 
        userName 
      });

      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        this.logger.warn('Intento de login con contraseña incorrecta', { 
          userId: user.id, 
          userName 
        });
        
        // Log de seguridad por intento fallido usando el logger de BaseService
        this.logger.error('Intento de login fallido - contraseña incorrecta', {
          userId: user.id,
          userName,
          reason: 'invalid_password',
          operation: 'user_authentication'
        });
        
        throw ErrorFactory.unauthorized('INVALID_PASSWORD', { userName });
      }

      // Login exitoso
      this.logger.info('Autenticación exitosa', { 
        userId: user.id, 
        userName: user.user_name 
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
      this.logger.error('Error inesperado durante autenticación', { 
        userName,
        error: error.message 
      });
      throw ErrorFactory.internal('AUTH', 'USER_AUTHENTICATION_FAILED', { 
        operation: 'user_authentication',
        userName 
      });
    }
  }

  /**
   * Envía un enlace de recuperación de contraseña al correo del usuario
   * @param {string} email - Email del usuario que solicita recuperación
   * @returns {Object} Confirmación de envío del correo
   * @throws {Error} Error si el usuario no existe o si falla el envío
   */
  async sendRecoveryLink(email) {
    try {
      this.logger.info('Iniciando proceso de recuperación de contraseña', { email });
      
      // Buscar usuario por email
      const user = await service.findByEmail(email);
      if (!user) {
        this.logger.warn('Solicitud de recuperación para email inexistente', { email });
        throw ErrorFactory.unauthorized('USER_NOT_FOUND', { email });
      }

      this.logger.debug('Usuario encontrado para recuperación', { 
        userId: user.id, 
        email: user.email 
      });

      // Generar token de recuperación con expiración
      const payload = { sub: user.id, purpose: 'password_recovery' };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
      
      // Construir enlace de recuperación
      const link = `${config.urlFront}/resetpass?token=${token}`;
      
      // Guardar token en la base de datos
      await service.update(user.id, { recovery_token: token });
      this.logger.debug('Token de recuperación generado y guardado', { 
        userId: user.id,
        tokenExpiry: '15min' 
      });

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
      this.logger.debug('Enviando correo de recuperación', { 
        userId: user.id,
        email: user.email 
      });
      
      const emailResult = await this.sendEmail(mail);
      
      this.logger.info('Correo de recuperación enviado exitosamente', { 
        userId: user.id, 
        email: user.email 
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
      this.logger.error('Error durante envío de recuperación', { 
        email,
        error: error.message 
      });
      throw ErrorFactory.internal('AUTH', 'PASSWORD_RECOVERY_FAILED', { 
        operation: 'send_recovery_link',
        email 
      });
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
    try {
      this.logger.info('Iniciando proceso de cambio de contraseña');
      
      // Verificar el token JWT
      this.logger.debug('Verificando token JWT de recuperación');
      const payload = jwt.verify(token, config.jwtSecret);
      
      // Buscar al usuario por ID
      const user = await service.findOne(payload.sub);
      
      this.logger.debug('Usuario encontrado para cambio de contraseña', { 
        userId: user.id,
        userName: user.user_name 
      });
      
      // Validar que el token coincida con el almacenado
      if (user.recovery_token !== token) {
        this.logger.warn('Intento de cambio con token inválido o expirado', { 
          userId: user.id,
          userName: user.user_name 
        });
        throw ErrorFactory.unauthorized('INVALID_TOKEN', { 
          userId: user.id,
          operation: 'change_password' 
        });
      }
      
      // Encriptar la nueva contraseña
      this.logger.debug('Encriptando nueva contraseña', { userId: user.id });
      const hash = await bcrypt.hash(newPassword, 10);
      
      // Actualizar la contraseña y limpiar el token
      await service.update(user.id, { recovery_token: null, password: hash });
      
      this.logger.info('Contraseña cambiada exitosamente', { 
        userId: user.id,
        userName: user.user_name 
      });
      
      return { message: 'Contraseña cambiada exitosamente' };
      
    } catch (error) {
      // Si es un error de JWT o nuestro sistema, re-lanzarlo
      if (error.isBoom || error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        if (error.name === 'TokenExpiredError') {
          this.logger.warn('Intento de cambio con token expirado');
          throw ErrorFactory.unauthorized('TOKEN_EXPIRED', { 
            operation: 'change_password' 
          });
        }
        throw error;
      }
      
      // Para errores inesperados
      this.logger.error('Error inesperado durante cambio de contraseña', { 
        error: error.message 
      });
      throw ErrorFactory.internal('AUTH', 'PASSWORD_CHANGE_FAILED', { 
        operation: 'change_password' 
      });
    }
  }

  /**
   * Envía un correo electrónico utilizando nodemailer.
   * @param {Object} infoMail - Información del correo a enviar.
   * @returns {Object} Confirmación de envío del correo.
   */
  async sendEmail(infoMail) {
    try {
      this.logger.debug('Configurando transporter de email', { 
        host: 'smtp.gmail.com',
        port: 465,
        secure: true 
      });
      
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Servidor SMTP
        port: 465, // Puerto seguro
        secure: true, // Habilita SSL/TLS
        auth: {
          user: config.email, // Correo del remitente
          pass: config.passEmail, // Contraseña del remitente
        },
      });
      
      this.logger.debug('Enviando correo electrónico', { 
        to: infoMail.to,
        subject: infoMail.subject 
      });
      
      const result = await transporter.sendMail(infoMail);
      
      this.logger.info('Correo enviado exitosamente', { 
        to: infoMail.to,
        subject: infoMail.subject,
        messageId: result.messageId 
      });
      
      return { message: 'Correo enviado exitosamente' };
      
    } catch (error) {
      this.logger.error('Error al enviar correo electrónico', { 
        to: infoMail.to,
        subject: infoMail.subject,
        error: error.message 
      });
      throw ErrorFactory.internal('AUTH', 'EMAIL_SEND_FAILED', { 
        operation: 'send_email',
        recipient: infoMail.to 
      });
    }
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param {Object} body - Datos del usuario a registrar.
   * @returns {Object} Mensaje de confirmación.
   */
  async registerUser(body) {
    try {
      this.logger.info('Iniciando registro de nuevo usuario', { 
        userName: body.userName,
        email: body.email 
      });
      
      // Asignar rol de usuario normal por defecto
      body.roleId = 2;
      
      this.logger.debug('Delegando creación a UserService', { 
        userName: body.userName,
        roleId: body.roleId 
      });
      
      const user = await service.create(body);
      
      this.logger.info('Usuario registrado exitosamente', { 
        userId: user.id,
        userName: user.user_name,
        email: user.email 
      });
      
      return { message: 'Usuario registrado exitosamente' };
      
    } catch (error) {
      // Si es un error de nuestro sistema (como duplicate), re-lanzarlo
      if (error.isBoom) {
        throw error;
      }
      
      // Para errores inesperados
      this.logger.error('Error inesperado durante registro de usuario', { 
        userName: body.userName,
        email: body.email,
        error: error.message 
      });
      throw ErrorFactory.internal('AUTH', 'USER_REGISTRATION_FAILED', { 
        operation: 'register_user',
        userName: body.userName 
      });
    }
  }
  
  // Mantener el método anterior para compatibilidad hacia atrás
  async regiterUser(body) {
    this.logger.warn('Método regiterUser deprecado, usando registerUser', { 
      userName: body.userName 
    });
    return this.registerUser(body);
  }
}

module.exports = AuthService;
