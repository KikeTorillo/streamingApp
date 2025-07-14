// auth.routes.js

const express = require('express');
const passport = require('passport');
const AuthService = require('./../services/authService');
const service = new AuthService();
const { validatorHandler } = require('./../middleware/validatorHandler');
const {
  loginSchema,
  changePasswordSchema,
  registrationSchema,
  recoverySchema,
} = require('./../schemas/usersSchemas');
const router = express.Router();

/**
 * @typedef {Object} LoginPayload
 * @property {string} token - Token JWT generado
 * @property {Object} payload - Payload decodificado del JWT (sub, role, iat, exp, etc.)
 */

/**
 * @route POST /api/v1/auth/login
 * @summary Autentica un usuario y genera un token JWT
 * @middleware passport.authenticate('local', { session: false })
 * @middleware validatorHandler(loginSchema, 'body')
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware
 * @returns {LoginPayload|Error} JSON con el payload del token en caso de éxito, o un error
 */
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  validatorHandler(loginSchema, 'body'),
  async (req, res, next) => {
    try {
      const userReq = req.user;
      const token = service.signToken(userReq);
      res
        .cookie('access_token', token.token, {
          httpOnly: true,
          secure: false, //Solo se envía por HTTPS cuando es true
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(token.payload);
    } catch (error) {
      next(error);
    }
  }
);



/**
 * @route POST /api/v1/auth/registration
 * @summary Registra un nuevo usuario con rol predeterminado 'user'
 * @middleware validatorHandler(registrationSchema, 'body')
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Object|Error} JSON con el usuario registrado o un error
 */
router.post(
  '/registration',
  validatorHandler(registrationSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      body.role = 'user';
      const rta = await service.regiterUser(body);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/v1/auth/recovery
 * @summary Envía un enlace de recuperación de contraseña al email proporcionado
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Object|Error} JSON con el resultado del envío o un error
 */
router.post(
  '/recovery',
  validatorHandler(recoverySchema, 'body'),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const rta = await service.sendRecoveryLink(email);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/v1/auth/change-password
 * @summary Cambia la contraseña de un usuario usando un token de recuperación
 * @middleware validatorHandler(changePasswordSchema, 'body')
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Object|Error} JSON con el resultado del cambio o un error
 */
router.post(
  '/change-password',
  validatorHandler(changePasswordSchema, 'body'),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const rta = await service.changePassword(token, newPassword);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/v1/auth/logout
 * @summary Cierra la sesión del usuario limpiando la cookie de autenticación
 * @description No requiere autenticación - el logout debe ser permisivo para permitir 
 *              cerrar sesión incluso con tokens expirados o inválidos
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware
 * @returns {Object|Error} JSON con confirmación de logout o un error
 */
router.post(
  '/logout',
  async (req, res, next) => {
    try {
      console.log('🚪 Procesando logout...');
      
      // Limpiar la cookie de autenticación
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: false, // Cambiar a true en producción con HTTPS
        sameSite: 'lax'
      });
      
      console.log('✅ Cookie de autenticación limpiada');
      
      // Respuesta de éxito
      res.json({
        success: true,
        message: 'Logout exitoso',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error en logout:', error);
      next(error);
    }
  }
);

module.exports = router;
