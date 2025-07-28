// categories.routes.js

const express = require('express'); // Framework para manejo de rutas y middleware
const CategoriesService = require('../services/categoriesService'); // Servicio personalizado para categorías
const service = new CategoriesService(); // Instancia del servicio de categorías
const { validatorHandler } = require('../middleware/validatorHandler'); // Middleware para validación de datos
const {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} = require('../schemas/categoriesSchemas'); // Esquemas de validación Joi para categorías
const { authenticateJwt, checkRoles } = require('../middleware/authHandler');
const router = express.Router(); // Creación del enrutador Express

/**
 * @swagger
 * /category:
 *   post:
 *     tags:
 *       - Categorías
 *     summary: Crear una nueva categoría
 *     description: Crea una nueva categoría para clasificar contenido
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *                 example: "Ciencia Ficción"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *             example:
 *               id: 16
 *               name: "Ciencia Ficción"
 *               updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
  '/',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /category:
 *   get:
 *     tags:
 *       - Categorías
 *     summary: Obtener lista de todas las categorías
 *     description: Devuelve una lista completa de categorías disponibles
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *             example:
 *               - id: 1
 *                 name: "Acción"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *               - id: 2
 *                 name: "Comedia"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *               - id: 3
 *                 name: "Drama"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/',
  authenticateJwt,
  checkRoles(['admin', 'user']),
  async (req, res, next) => {
    try {
      const categories = await service.find();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     tags:
 *       - Categorías
 *     summary: Obtener una categoría específica por ID
 *     description: Devuelve los detalles de una categoría específica
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la categoría
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoría encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *             example:
 *               id: 1
 *               name: "Acción"
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
  checkRoles(['admin', 'user']),
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await service.findOne(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /category/{id}:
 *   patch:
 *     tags:
 *       - Categorías
 *     summary: Actualizar una categoría existente
 *     description: Actualiza el nombre de una categoría existente
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la categoría
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre de la categoría
 *                 example: "Acción y Aventura"
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               id: 1
 *               name: "Acción y Aventura"
 *               message: "Categoría actualizada exitosamente"
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
  checkRoles(['admin', 'user']),
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updatedCategory = await service.update(id, changes);
      res.json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     tags:
 *       - Categorías
 *     summary: Eliminar una categoría por ID
 *     description: Elimina permanentemente una categoría del sistema
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la categoría a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
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
 *               message: "Categoría eliminada exitosamente"
 *               id: 1
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
  checkRoles(['admin', 'user']),
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const categoryDeletd = await service.delete(id);
      res.json(categoryDeletd);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
