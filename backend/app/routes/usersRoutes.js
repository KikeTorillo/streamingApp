// users.routes.js

const express = require('express'); // Framework para manejo de rutas y middleware
const UsersService = require('../services/usersService'); // Servicio personalizado para usuarios
const service = new UsersService(); // Instancia del servicio de usuarios
const { validatorHandler } = require('../middleware/validatorHandler'); // Middleware para validación de datos
// Importación de los esquemas de validación para usuarios
const {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} = require('./../schemas/usersSchemas');
const { authenticateJwt, checkRoles } = require('./../middleware/authHandler');
const router = express.Router(); // Creación del enrutador Express

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Crear un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema con rol específico
 *     security:
 *       - cookieAuth: []
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
 *               - roleId
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 example: "nuevousuario"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *                 example: "nuevo@mail.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "password123"
 *               roleId:
 *                 type: integer
 *                 description: ID del rol a asignar (1=admin, 2=editor, 3=user)
 *                 example: 2
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 3
 *               userName: "nuevousuario"
 *               email: "nuevo@mail.com"
 *               roleId: 2
 *               roleName: "editor"
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener lista de todos los usuarios
 *     description: Devuelve una lista completa de usuarios del sistema (solo admin)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - id: 1
 *                 userName: "admin"
 *                 email: "admin@mail.com"
 *                 roleId: 1
 *                 roleName: "admin"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *               - id: 2
 *                 userName: "editor"
 *                 email: "editor@mail.com"
 *                 roleId: 2
 *                 roleName: "editor"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/',
  authenticateJwt,
  checkRoles(['admin']),
  async (req, res, next) => {
    try {
      const users = await service.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener un usuario específico por ID
 *     description: Devuelve los detalles de un usuario específico
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               userName: "admin"
 *               email: "admin@mail.com"
 *               roleId: 1
 *               roleName: "admin"
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T00:00:00.000Z"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/:id',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags:
 *       - Usuarios
 *     summary: Actualizar un usuario existente
 *     description: Actualiza los datos de un usuario existente
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Nuevo nombre de usuario
 *                 example: "nuevonombre"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo email del usuario
 *                 example: "nuevoemail@mail.com"
 *               roleId:
 *                 type: integer
 *                 description: Nuevo ID de rol
 *                 example: 3
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userName:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               id: 2
 *               userName: "nuevonombre"
 *               message: "Usuario actualizado exitosamente"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.patch(
  '/:id',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updatedUser = await service.update(id, changes);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Usuarios
 *     summary: Eliminar un usuario por ID
 *     description: Elimina permanentemente un usuario del sistema
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario a eliminar
 *         example: 2
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *             example:
 *               message: "Usuario eliminado exitosamente"
 *               id: 2
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.delete(
  '/:id',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userDeleted = await service.delete(id);
      res.json(userDeleted);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
