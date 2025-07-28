// routes/episodesRouter.js
const express = require('express');
const multiUpload = require('../middleware/upload');
const EpisodesService = require('../services/EpisodesService');
const service = new EpisodesService();
const { validatorHandler } = require('../middleware/validatorHandler');
const {
  createEpisodeSchema,
  getEpisodeSchema,
  getEpisodesSchema,
  updateEpisodeSchema,
} = require('../schemas/episodesSchema');
const { authenticateJwt, checkRoles } = require('./../middleware/authHandler');
const { completeInfoUser } = require('../middleware/completeInfoUser');
const router = express.Router();

// Estado global para rastrear el progreso de transcodificación
const progressMap = {};

/**
 * @swagger
 * /episodes:
 *   post:
 *     tags:
 *       - Episodios
 *     summary: Crear un nuevo episodio
 *     description: Crea un nuevo episodio para una serie con archivo de video
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - serieId
 *               - season
 *               - episodeNumber
 *               - title
 *               - description
 *               - video
 *             properties:
 *               serieId:
 *                 type: integer
 *                 description: ID de la serie padre
 *                 example: 1
 *               season:
 *                 type: integer
 *                 minimum: 1
 *                 description: Número de temporada
 *                 example: 1
 *               episodeNumber:
 *                 type: integer
 *                 minimum: 1
 *                 description: Número de episodio
 *                 example: 2
 *               title:
 *                 type: string
 *                 description: Título del episodio
 *                 example: "Segundo Episodio"
 *               description:
 *                 type: string
 *                 description: Descripción del episodio
 *                 example: "Descripción del segundo episodio"
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de video del episodio
 *     responses:
 *       200:
 *         description: Episodio enviado para procesamiento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   description: ID de la tarea para monitorear progreso
 *                   example: "1641234567892"
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
  validatorHandler(createEpisodeSchema, 'body'),
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

      //const body = req.body;
      //const newEpisode = await service.create(body);
      //res.status(201).json(newEpisode);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /episodes:
 *   get:
 *     tags:
 *       - Episodios
 *     summary: Obtener lista de episodios
 *     description: Devuelve lista de episodios con filtros opcionales por serie, temporada o número
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: serieId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de serie
 *         example: 1
 *       - in: query
 *         name: season
 *         schema:
 *           type: integer
 *         description: Filtrar por temporada
 *         example: 1
 *       - in: query
 *         name: episodeNumber
 *         schema:
 *           type: integer
 *         description: Filtrar por número de episodio
 *         example: 2
 *     responses:
 *       200:
 *         description: Lista de episodios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Episode'
 *             example:
 *               - id: 1
 *                 serieId: 1
 *                 serieTitle: "Breaking Bad"
 *                 season: 1
 *                 episodeNumber: 1
 *                 title: "Pilot"
 *                 description: "Primer episodio"
 *                 videoId: 2
 *                 fileHash: "episode_hash..."
 *                 duration: "00:58:00"
 *                 views: 150
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
  completeInfoUser,
  validatorHandler(getEpisodesSchema, 'query'),
  async (req, res, next) => {
    try {
      const { serieId, season, episodeNumber } = req.query;
      const episodes = await service.find(serieId, season, episodeNumber);
      res.json(episodes);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /episodes/{id}:
 *   get:
 *     tags:
 *       - Episodios
 *     summary: Obtener un episodio específico por ID
 *     description: Devuelve los detalles completos de un episodio incluyendo metadatos de video
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del episodio
 *         example: 1
 *     responses:
 *       200:
 *         description: Episodio encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Episode'
 *                 - type: object
 *                   properties:
 *                     availableResolutions:
 *                       type: array
 *                       items:
 *                         type: string
 *                         enum: ["480p", "720p", "1080p", "4k"]
 *                     availableSubtitles:
 *                       type: array
 *                       items:
 *                         type: string
 *                         enum: ["es", "en"]
 *             example:
 *               id: 1
 *               serieId: 1
 *               serieTitle: "Breaking Bad"
 *               season: 1
 *               episodeNumber: 1
 *               title: "Pilot"
 *               description: "Primer episodio de la serie"
 *               videoId: 2
 *               fileHash: "episode_hash..."
 *               duration: "00:58:00"
 *               views: 150
 *               availableResolutions: ["480p", "720p", "1080p"]
 *               availableSubtitles: ["es", "en"]
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T00:00:00.000Z"
 *       404:
 *         description: Episodio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Episodio no encontrado"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/:id',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getEpisodeSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log('📺 Obteniendo episodio por ID:', id);
      const episode = await service.findOne(id);
      
      if (!episode || episode.length === 0) {
        return res.status(404).json({ error: 'Episodio no encontrado' });
      }
      
      res.json(episode[0]);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /episodes/by-hash/{fileHash}:
 *   get:
 *     tags:
 *       - Episodios
 *     summary: Obtener episodio por hash de archivo
 *     description: Busca un episodio usando el hash SHA256 del archivo de video (usado por el reproductor)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: fileHash
 *         required: true
 *         schema:
 *           type: string
 *         description: Hash SHA256 del archivo de video
 *         example: "abc123def456..."
 *     responses:
 *       200:
 *         description: Episodio encontrado por hash
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 *             example:
 *               id: 1
 *               serieId: 1
 *               serieTitle: "Breaking Bad"
 *               season: 1
 *               episodeNumber: 1
 *               title: "Pilot"
 *               description: "Primer episodio"
 *               videoId: 2
 *               fileHash: "abc123def456..."
 *               duration: "00:58:00"
 *               views: 150
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/by-hash/:fileHash',
  authenticateJwt,
  async (req, res, next) => {
    try {
      const { fileHash } = req.params;
      console.log('🎬 Obteniendo episodio por hash:', fileHash);
      const episode = await service.findByFileHash(fileHash);
      res.json(episode);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /episodes/progress/{taskId}:
 *   get:
 *     tags:
 *       - Episodios
 *     summary: Obtener progreso de procesamiento de episodio
 *     description: Consulta el estado y progreso de una tarea de procesamiento de episodio
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea de procesamiento
 *         example: "1641234567892"
 *     responses:
 *       200:
 *         description: Estado de la tarea obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskProgress'
 *             example:
 *               status: "transcoding"
 *               progress: 45
 *               error: null
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Tarea no encontrada"
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
    
    console.log(`📊 Consultando progreso para taskId: ${taskId}`, task);
    
    // Si la tarea no existe, devolver un error 404
    if (!task) {
      console.log(`❌ Tarea no encontrada: ${taskId}`);
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    // Responder con el estado de la tarea
    console.log(`✅ Progreso de episodio encontrado:`, task);
    res.json(task);
  }
);

/**
 * @swagger
 * /episodes/{id}:
 *   patch:
 *     tags:
 *       - Episodios
 *     summary: Actualizar un episodio existente
 *     description: Actualiza los datos de un episodio, incluyendo la posibilidad de cambiar el archivo de video
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del episodio
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               serieId:
 *                 type: integer
 *                 description: Nuevo ID de serie
 *                 example: 1
 *               season:
 *                 type: integer
 *                 minimum: 1
 *                 description: Nueva temporada
 *                 example: 2
 *               episodeNumber:
 *                 type: integer
 *                 minimum: 1
 *                 description: Nuevo número de episodio
 *                 example: 5
 *               title:
 *                 type: string
 *                 description: Nuevo título del episodio
 *                 example: "Episodio Actualizado"
 *               description:
 *                 type: string
 *                 description: Nueva descripción del episodio
 *                 example: "Descripción actualizada del episodio"
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Nuevo archivo de video (opcional)
 *     responses:
 *       200:
 *         description: Episodio actualizado exitosamente
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
 *               title: "Episodio Actualizado"
 *               message: "Episodio actualizado exitosamente"
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
  validatorHandler(getEpisodeSchema, 'params'),
  validatorHandler(updateEpisodeSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updatedEpisode = await service.update(id, changes);
      res.json(updatedEpisode);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /episodes/{id}:
 *   delete:
 *     tags:
 *       - Episodios
 *     summary: Eliminar un episodio por ID
 *     description: Elimina permanentemente un episodio del sistema
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del episodio a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Episodio eliminado exitosamente
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
 *               message: "Episodio eliminado exitosamente"
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
  completeInfoUser,
  validatorHandler(getEpisodeSchema, 'params'),
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
 * Función para procesar el archivo y actualizar el progreso:
 * - Para episodios, se llama al método createEpisode del servicio
 * - Actualiza el progressMap con el estado actual
 */
async function processFile(taskId, fileInfo) {
  try {
    console.log(`🚀 Iniciando procesamiento de episodio para taskId: ${taskId}`);
    
    // Actualizar el progreso inicial
    progressMap[taskId].status = 'transcoding'; // Estado: "transcodificando"
    progressMap[taskId].progress = 0;

    // Llamar al servicio para crear el episodio con callback de progreso
    await service.create(fileInfo, (progress) => {
      console.log(`📊 Progreso del episodio ${taskId}: ${progress}%`);
      progressMap[taskId].progress = progress;
    });

    // Marcar como completado
    progressMap[taskId].status = 'completed';
    progressMap[taskId].progress = 100;
    
    console.log(`✅ Episodio procesado exitosamente para taskId: ${taskId}`);
    
  } catch (error) {
    console.error(`❌ Error procesando episodio para taskId ${taskId}:`, error);
    
    progressMap[taskId].status = 'failed';
    progressMap[taskId].error = error.message;
  }
}


module.exports = router;