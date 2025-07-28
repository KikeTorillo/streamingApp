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
 * @swagger
 * /movies:
 *   post:
 *     tags:
 *       - Películas
 *     summary: Crear nueva película
 *     description: |
 *       Crea una nueva película con archivo de video y portada.
 *       El procesamiento es asíncrono - retorna un taskId para monitoreo.
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
 *               - categoryId
 *               - releaseYear
 *               - video
 *               - coverImage
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la película
 *                 example: 'Película de Ejemplo'
 *               description:
 *                 type: string
 *                 description: Descripción de la película
 *                 example: 'Una película increíble sobre...'
 *               categoryId:
 *                 type: integer
 *                 description: ID de la categoría
 *                 example: 1
 *               releaseYear:
 *                 type: integer
 *                 minimum: 1900
 *                 maximum: 2030
 *                 description: Año de lanzamiento
 *                 example: 2024
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de video (.mp4, .avi, .mkv, etc.)
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de portada (.jpg, .png, .webp)
 *     responses:
 *       200:
 *         description: Película creada - procesamiento iniciado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   description: ID de la tarea para monitorear progreso
 *                   example: '1641234567890'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
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

/**
 * @swagger
 * /movies:
 *   get:
 *     tags:
 *       - Películas
 *     summary: Obtener lista de películas
 *     description: Retorna todas las películas disponibles en el sistema
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de películas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
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
      const movies = await service.find();
      res.json(movies);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     tags:
 *       - Películas
 *     summary: Obtener película por ID
 *     description: |
 *       Retorna una película específica por su ID, incluyendo información
 *       de subtítulos, resoluciones disponibles y metadatos completos.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la película
 *         example: 1
 *     responses:
 *       200:
 *         description: Película encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
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

/**
 * @swagger
 * /movies/by-hash/{hash}:
 *   get:
 *     tags:
 *       - Películas
 *     summary: Obtener película por hash de archivo
 *     description: |
 *       Retorna una película específica por su hash SHA256 de archivo.
 *       Usado principalmente por el reproductor para obtener metadatos
 *       sin exponer el ID interno de la película.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: Hash SHA256 del archivo de video
 *         example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
 *     responses:
 *       200:
 *         description: Película encontrada por hash
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
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
 * @swagger
 * /movies/search:
 *   get:
 *     tags:
 *       - Películas
 *     summary: Buscar películas por título
 *     description: |
 *       Busca películas que coincidan con el título proporcionado.
 *       La búsqueda es parcial e insensible a mayúsculas/minúsculas.
 *       Requiere mínimo 3 caracteres para realizar la búsqueda.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *         description: Título o parte del título a buscar (mínimo 3 caracteres)
 *         example: 'Matrix'
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Consulta muy corta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'La consulta debe tener al menos 3 caracteres.'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
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
 * @swagger
 * /movies/search-by-year-range:
 *   get:
 *     tags:
 *       - Películas
 *     summary: Buscar películas por rango de años
 *     description: |
 *       Busca películas lanzadas dentro de un rango de años específico.
 *       Incluye películas cuyo año de lanzamiento esté entre los valores
 *       'from' y 'to' (ambos inclusive).
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1900
 *           maximum: 2030
 *         description: Año de inicio del rango (inclusive)
 *         example: 2020
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1900
 *           maximum: 2030
 *         description: Año de fin del rango (inclusive)
 *         example: 2023
 *     responses:
 *       200:
 *         description: Resultados de búsqueda por rango de años
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 count:
 *                   type: integer
 *                   description: Número de películas encontradas
 *                   example: 15
 *                 range:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: integer
 *                       example: 2020
 *                     to:
 *                       type: integer
 *                       example: 2023
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
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
 * @swagger
 * /movies/{id}:
 *   patch:
 *     tags:
 *       - Películas
 *     summary: Actualizar película
 *     description: |
 *       Actualiza los datos de una película existente.
 *       Permite modificar título, descripción, categoría, año de lanzamiento
 *       y opcionalmente subir una nueva imagen de portada.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la película a actualizar
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
 *                 description: Nuevo título de la película
 *                 example: 'Título Actualizado'
 *               description:
 *                 type: string
 *                 description: Nueva descripción de la película
 *                 example: 'Descripción actualizada de la película'
 *               categoryId:
 *                 type: integer
 *                 description: Nuevo ID de categoría
 *                 example: 2
 *               releaseYear:
 *                 type: integer
 *                 minimum: 1900
 *                 maximum: 2030
 *                 description: Nuevo año de lanzamiento
 *                 example: 2023
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen de portada (opcional)
 *     responses:
 *       200:
 *         description: Película actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 * @swagger
 * /movies/{id}:
 *   delete:
 *     tags:
 *       - Películas
 *     summary: Eliminar película
 *     description: |
 *       Elimina una película del sistema de forma permanente.
 *       También elimina los archivos asociados (video, portada, subtítulos)
 *       del almacenamiento y todas las referencias relacionadas.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la película a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Película eliminada exitosamente
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
 *                   example: 'Película eliminada exitosamente'
 *                 deletedId:
 *                   type: integer
 *                   example: 1
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-01-01T00:00:00.000Z'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 * @swagger
 * /movies/progress/{taskId}:
 *   get:
 *     tags:
 *       - Películas
 *     summary: Obtener progreso de transcodificación
 *     description: |
 *       Consulta el estado y progreso de una tarea de procesamiento de video.
 *       Usado para monitorear el progreso de transcodificación después
 *       de crear una nueva película con POST /movies.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea de procesamiento retornado por POST /movies
 *         example: '1641234567890'
 *     responses:
 *       200:
 *         description: Estado de la tarea de procesamiento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskProgress'
 *             examples:
 *               processing:
 *                 summary: Tarea en procesamiento
 *                 value:
 *                   status: 'processing'
 *                   progress: 0
 *               transcoding:
 *                 summary: Tarea transcodificando
 *                 value:
 *                   status: 'transcoding'
 *                   progress: 45
 *               completed:
 *                 summary: Tarea completada
 *                 value:
 *                   status: 'completed'
 *                   progress: 100
 *               failed:
 *                 summary: Tarea fallida
 *                 value:
 *                   status: 'failed'
 *                   progress: 75
 *                   error: 'Error durante la transcodificación'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Tarea no encontrada'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
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
