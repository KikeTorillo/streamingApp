// routes/movieRoutes.js
const express = require('express');
const multiUpload = require('../middleware/upload');
const MoviesService = require('../services/moviesService');
const service = new MoviesService();
const { validatorHandler } = require('../middleware/validatorHandler');
const {
  createMovieSchema,
  getMovieSchema,
  getMovieByHashSchema,
  getMovieByTitleSchema,
  searchMoviesByYearRangeSchema,
  updateMovieSchema,
} = require('../schemas/moviesSchemas'); // Asegúrate de tener el schema adecuado
const { authenticateJwt, checkRoles } = require('./../middleware/authHandler');
const { completeInfoUser } = require('../middleware/completeInfoUser');
const router = express.Router();
// Estado global para rastrear el progreso de transcodificación
const progressMap = {};

/**
 * Ruta para crear una pelicula
 */
router.post(
  '/',
  authenticateJwt,
  checkRoles(['admin']),
  multiUpload,
  completeInfoUser,
  validatorHandler(createMovieSchema, 'body'),
  async (req, res, next) => {
    try {
      // Puedes generar un taskId para seguimiento si lo requieres
      const taskId = Date.now().toString();
      progressMap[taskId] = { status: 'processing', progress: 0 };
      const fileInfo = req.body;
      // Procesar el archivo en segundo plano según el flujo correspondiente
      processFile(taskId, fileInfo);
      // Responder con el ID de la tarea
      res.json({ taskId });
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para obtener la lista de películas
router.get(
  '/',
  authenticateJwt,
  checkRoles(['admin','editor','user']),
  async (req, res, next) => {
    try {
      const movies = await service.find();
      res.json(movies);
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para obtener una película por ID (incluyendo info de subtítulos)
router.get(
  '/:id',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getMovieSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const movie = await service.findOne(id);
      res.json(movie);
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para obtener una película por hash (para el reproductor)
router.get(
  '/by-hash/:hash',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getMovieByHashSchema, 'params'),
  async (req, res, next) => {
    try {
      const { hash } = req.params;
      const movie = await service.findByFileHash(hash);
      res.json(movie);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Endpoint para buscar videos por nombre:
 * - Esta ruta maneja una solicitud GET para buscar videos cuyos nombres coincidan con una consulta.
 * - La consulta debe ser proporcionada como un parámetro de consulta (`title`).
 */
router.get(
  '/search',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getMovieByTitleSchema, 'query'),
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
 * Endpoint para buscar películas por rango de años:
 * - Esta ruta maneja una solicitud GET para buscar películas lanzadas en un rango de años específico.
 * - Los parámetros deben ser proporcionados como parámetros de consulta (`from` y `to`).
 * - Ejemplo: GET /movies/search-by-year-range?from=2020&to=2023
 */
router.get(
  '/search-by-year-range',
  authenticateJwt,
  checkRoles(['admin', 'editor', 'user']),
  validatorHandler(searchMoviesByYearRangeSchema, 'query'),
  async (req, res, next) => {
    try {
      const { from, to } = req.query;
      
      // Convertir strings a números (Joi ya validó que son números válidos)
      const fromYear = parseInt(from);
      const toYear = parseInt(to);
      
      const results = await service.searchByYearRange(fromYear, toYear);
      
      res.json({
        success: true,
        data: results,
        count: results.length,
        range: { from: fromYear, to: toYear }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ruta para actualizar una película.
 * Se espera recibir en el cuerpo de la solicitud:
 * { title, coverImage, releaseYear }
 */
router.patch(
  '/:id',
  authenticateJwt,
  checkRoles(['admin']),
  multiUpload,
  completeInfoUser,
  validatorHandler(getMovieSchema, 'params'),
  validatorHandler(updateMovieSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updatedMovie = await service.update(id, changes);
      res.json(updatedMovie);
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
  validatorHandler(getMovieSchema, 'params'),
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

/**
 * Endpoint para obtener el progreso de una tarea:
 * - Esta ruta maneja una solicitud GET para consultar el estado de una tarea específica.
 * - Devuelve el estado (`status`) y el progreso (`progress`) de la tarea.
 */
router.get(
  '/progress/:taskId',
  authenticateJwt,
  checkRoles(['admin']),
  (req, res) => {
    const { taskId } = req.params; // Obtener el ID de la tarea desde los parámetros de la URL
    const task = progressMap[taskId]; // Buscar la tarea en el mapa de progreso
    // Si la tarea no existe, devolver un error 404
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    // Responder con el estado de la tarea
    res.json(task);
  }
);

/**
 * Función para procesar el archivo y actualizar el progreso:
 * - Según fileInfo.contentType y la presencia de videoFilePath, se decide el flujo:
 *    • Para "movie": se llama a uploadMovie.
 *    • Para "series":
 *         - Si existe videoFilePath, se asume que es una subida de episodio.
 *         - Si NO existe videoFilePath, se asume creación de la serie.
 */
async function processFile(taskId, fileInfo) {
  try {
    console.log(`🎬 [${taskId}] Iniciando procesamiento de archivo:`, {
      title: fileInfo.title,
      videoPath: fileInfo.video,
      coverPath: fileInfo.coverImage,
      fileSize: fileInfo.video ? require('fs').statSync(fileInfo.video).size : 'N/A'
    });

    // Actualizar el progreso inicial
    progressMap[taskId].status = 'transcoding'; // Estado: "transcodificando"
    progressMap[taskId].progress = 0;

    await service.create(fileInfo, (progress) => {
      console.log(`📊 [${taskId}] Progreso: ${progress}%`);
      progressMap[taskId].progress = progress;
    });

    console.log(`✅ [${taskId}] Procesamiento completado exitosamente`);
    progressMap[taskId].status = 'completed';
    progressMap[taskId].progress = 100;
  } catch (error) {
    console.error(`❌ [${taskId}] Error en procesamiento:`, error.message);
    progressMap[taskId].status = 'failed';
    progressMap[taskId].error = error.message;
  }
}


module.exports = router;
