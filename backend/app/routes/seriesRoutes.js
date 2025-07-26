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
 * Ruta para crear una serie
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

// // Ruta para obtener la lista de series
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
 * Ruta para obtener una serie específica por ID
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

// /**
//  * Endpoint para buscar videos por nombre:
//  * - Esta ruta maneja una solicitud GET para buscar videos cuyos nombres coincidan con una consulta.
//  * - La consulta debe ser proporcionada como un parámetro de consulta (`title`).
//  */
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

// /**
//  * Ruta para actualizar una película.
//  * Se espera recibir en el cuerpo de la solicitud:
//  * { title, coverImage, releaseYear }
//  */
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
 * Ruta para eliminar una película por su ID.
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
