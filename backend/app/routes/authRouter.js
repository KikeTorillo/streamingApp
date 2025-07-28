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
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión de usuario
 *     description: |
 *       Autentica un usuario con email/username y contraseña.
 *       Genera un JWT token que se almacena en una HTTP-only cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: admin
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         headers:
 *           Set-Cookie:
 *             description: JWT token en HTTP-only cookie
 *             schema:
 *               type: string
 *               example: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; SameSite=Lax; Max-Age=86400
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sub:
 *                   type: integer
 *                   description: ID del usuario
 *                   example: 1
 *                 role:
 *                   type: string
 *                   description: Rol del usuario
 *                   example: admin
 *                 iat:
 *                   type: integer
 *                   description: Fecha de emisión del token (timestamp)
 *                   example: 1641234567
 *                 exp:
 *                   type: integer
 *                   description: Fecha de expiración del token (timestamp)
 *                   example: 1641320967
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
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
 * @swagger
 * /auth/registration:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registrar nuevo usuario
 *     description: |
 *       Registra un nuevo usuario en el sistema con rol predeterminado 'user'.
 *       Valida que el email y username sean únicos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email único del usuario
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Contraseña del usuario (mínimo 6 caracteres)
 *                 example: password123
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email o username ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: 'Conflict'
 *               message: 'El email o username ya está registrado'
 *               statusCode: 409
 *               timestamp: '2024-01-01T00:00:00.000Z'
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
 * @swagger
 * /auth/recovery:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Solicitar recuperación de contraseña
 *     description: |
 *       Envía un enlace de recuperación de contraseña al email proporcionado.
 *       Si el email existe, se genera un token temporal y se envía por email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario para recuperación
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email de recuperación enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Email de recuperación enviado'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-01-01T00:00:00.000Z'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: Email no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: 'Not Found'
 *               message: 'No existe un usuario con ese email'
 *               statusCode: 404
 *               timestamp: '2024-01-01T00:00:00.000Z'
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
 * @swagger
 * /auth/change-password:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Cambiar contraseña con token de recuperación
 *     description: |
 *       Cambia la contraseña de un usuario usando un token de recuperación válido.
 *       El token debe haber sido generado previamente mediante /auth/recovery.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de recuperación recibido por email
 *                 example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Nueva contraseña (mínimo 6 caracteres)
 *                 example: 'newPassword123'
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Contraseña actualizada exitosamente'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-01-01T00:00:00.000Z'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: 'Unauthorized'
 *               message: 'Token de recuperación inválido o expirado'
 *               statusCode: 401
 *               timestamp: '2024-01-01T00:00:00.000Z'
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
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Cerrar sesión de usuario
 *     description: |
 *       Cierra la sesión del usuario limpiando la cookie de autenticación.
 *       No requiere autenticación válida - permite logout con tokens expirados.
 *     responses:
 *       200:
 *         description: Logout exitoso
 *         headers:
 *           Set-Cookie:
 *             description: Cookie de autenticación eliminada
 *             schema:
 *               type: string
 *               example: access_token=; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout exitoso
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-01-01T00:00:00.000Z'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
