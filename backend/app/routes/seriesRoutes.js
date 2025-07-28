// routes/seriesRoutes.js
const express = require('express');
const multiUpload = require('../middleware/upload');
const SeriesService = require('../services/seriesService');
const service = new SeriesService();
const { validatorHandler } = require('../middleware/validatorHandler');
const {
  createSerieSchema,
  getSerieSchema,
  getSerieByTitleSchema,
  updateSerieSchema,
} = require('../schemas/seriesSchemas');
const { authenticateJwt, checkRoles } = require('./../middleware/authHandler');
const { completeInfoUser } = require('../middleware/completeInfoUser');
const router = express.Router();
// Estado global para rastrear el progreso de transcodificación
const progressMap = {};

/**
 * @swagger
 * /series:
 *   post:
 *     tags:
 *       - Series
 *     summary: Crear una nueva serie
 *     description: Crea una nueva serie con archivo de portada
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - categoryId
 *               - releaseYear
 *               - coverImage
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la serie
 *                 example: "Breaking Bad"
 *               description:
 *                 type: string
 *                 description: Descripción de la serie
 *                 example: "Un profesor de química se convierte en fabricante de metanfetaminas"
 *               categoryId:
 *                 type: integer
 *                 description: ID de la categoría
 *                 example: 1
 *               releaseYear:
 *                 type: integer
 *                 minimum: 1900
 *                 maximum: 2030
 *                 description: Año de lanzamiento
 *                 example: 2008
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen de portada
 *     responses:
 *       201:
 *         description: Serie creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   description: ID de la tarea para monitorear progreso
 *                   example: "1641234567890"
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
  checkRoles(['admin']),
  multiUpload,
  completeInfoUser,
  validatorHandler(createSerieSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newSerie = await service.create(body);
      res.status(201).json(newSerie);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /series:
 *   get:
 *     tags:
 *       - Series
 *     summary: Obtener lista de todas las series
 *     description: Devuelve una lista completa de series disponibles
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de series obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Series'
 *             example:
 *               - id: 1
 *                 title: "Breaking Bad"
 *                 description: "Un profesor de química se convierte en fabricante de metanfetaminas"
 *                 categoryId: 1
 *                 categoryName: "Drama"
 *                 coverImage: "abc123.jpg"
 *                 releaseYear: 2008
 *                 totalEpisodes: 62
 *                 totalSeasons: 5
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
  checkRoles(['admin','editor','user']),
  async (req, res, next) => {
    try {
      const series = await service.find();
      res.json(series);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /series/{id}:
 *   get:
 *     tags:
 *       - Series
 *     summary: Obtener una serie específica por ID
 *     description: Devuelve los detalles completos de una serie incluyendo sus episodios
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la serie
 *         example: 1
 *     responses:
 *       200:
 *         description: Serie encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Series'
 *                 - type: object
 *                   properties:
 *                     episodes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           season:
 *                             type: integer
 *                           episodeNumber:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           duration:
 *                             type: string
 *             example:
 *               id: 1
 *               title: "Breaking Bad"
 *               description: "Un profesor de química se convierte en fabricante de metanfetaminas"
 *               categoryId: 1
 *               categoryName: "Drama"
 *               coverImage: "abc123.jpg"
 *               releaseYear: 2008
 *               totalEpisodes: 62
 *               totalSeasons: 5
 *               episodes:
 *                 - id: 1
 *                   season: 1
 *                   episodeNumber: 1
 *                   title: "Pilot"
 *                   description: "Primer episodio"
 *                   duration: "00:58:00"
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
  validatorHandler(getSerieSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const serie = await service.findOne(id);
      res.json(serie);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /series/search:
 *   get:
 *     tags:
 *       - Series
 *     summary: Buscar series por título
 *     description: Busca series que coincidan con el título proporcionado
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *         description: Título de la serie a buscar (mínimo 3 caracteres)
 *         example: "Breaking"
 *     responses:
 *       200:
 *         description: Resultados de búsqueda encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   releaseYear:
 *                     type: integer
 *                   categoryName:
 *                     type: string
 *             example:
 *               - id: 1
 *                 title: "Breaking Bad"
 *                 releaseYear: 2008
 *                 categoryName: "Drama"
 *       400:
 *         description: Consulta muy corta o inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "La consulta debe tener al menos 3 caracteres."
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/search',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getSerieByTitleSchema, 'query'),
  async (req, res, next) => {
    try {
      const { title } = req.query; // Obtener el nombre y el tipo de contenido
      if (!title || title.length < 3) {
        return res
          .status(400)
          .json({ error: 'La consulta debe tener al menos 3 caracteres.' });
      }
      // Llamar al servicio con el tipo de contenido
      const results = await service.findByName(title);
      res.json(results); // Responder con los resultados de la búsqueda
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /series/{id}:
 *   patch:
 *     tags:
 *       - Series
 *     summary: Actualizar una serie existente
 *     description: Actualiza los datos de una serie, incluyendo la posibilidad de cambiar la imagen de portada
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la serie
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nuevo título de la serie
 *                 example: "Better Call Saul"
 *               description:
 *                 type: string
 *                 description: Nueva descripción de la serie
 *                 example: "Precuela de Breaking Bad centrada en Saul Goodman"
 *               categoryId:
 *                 type: integer
 *                 description: Nuevo ID de categoría
 *                 example: 2
 *               releaseYear:
 *                 type: integer
 *                 minimum: 1900
 *                 maximum: 2030
 *                 description: Nuevo año de lanzamiento
 *                 example: 2015
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen de portada (opcional)
 *     responses:
 *       200:
 *         description: Serie actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               id: 1
 *               title: "Better Call Saul"
 *               message: "Serie actualizada exitosamente"
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
  multiUpload,
  completeInfoUser,
  validatorHandler(getSerieSchema, 'params'),
  validatorHandler(updateSerieSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updatedSeries = await service.update(id, changes);
      res.json(updatedSeries);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /series/{id}:
 *   delete:
 *     tags:
 *       - Series
 *     summary: Eliminar una serie por ID
 *     description: Elimina permanentemente una serie y todos sus episodios asociados del sistema
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la serie a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Serie eliminada exitosamente
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
 *               message: "Serie eliminada exitosamente"
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
  checkRoles(['admin']),
  validatorHandler(getSerieSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await service.delete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
