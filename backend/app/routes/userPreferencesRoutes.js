// userPreferencesRoutes.js
// Rutas para gestión de preferencias de usuario del video player

const express = require('express'); // Framework para manejo de rutas y middleware
const UserPreferencesService = require('../services/userPreferencesService'); // Servicio personalizado para preferencias
const service = new UserPreferencesService(); // Instancia del servicio de preferencias
const { validatorHandler } = require('../middleware/validatorHandler'); // Middleware para validación de datos
const { authenticateJwt, checkRoles } = require('./../middleware/authHandler'); // Middleware de autenticación

// Importación de los esquemas de validación para preferencias
const {
  getUserPreferencesSchema,
  getWatchProgressSchema,
  updateUserPreferencesSchema,
  updateWatchProgressSchema,
} = require('./../schemas/userPreferencesSchemas');

const router = express.Router(); // Creación del enrutador Express

/**
 * @route GET /preferences/:userId
 * @desc Obtiene las preferencias de un usuario específico
 * @access Autenticado (usuario propio o admin)
 */
router.get(
  '/:userId',
  authenticateJwt,
  validatorHandler(getUserPreferencesSchema, 'params'),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const requestUserId = req.user.id; // ID del usuario autenticado
      const userRole = req.user.role;

      // Verificar que el usuario solo acceda a sus propias preferencias (o que sea admin)
      if (parseInt(userId) !== requestUserId && userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para acceder a estas preferencias'
        });
      }

      const preferences = await service.getUserPreferences(parseInt(userId));
      
      res.json({
        success: true,
        data: preferences,
        message: 'Preferencias obtenidas exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route PUT /preferences/:userId
 * @desc Actualiza las preferencias de un usuario específico
 * @access Autenticado (usuario propio o admin)
 */
router.put(
  '/:userId',
  authenticateJwt,
  validatorHandler(getUserPreferencesSchema, 'params'),
  validatorHandler(updateUserPreferencesSchema, 'body'),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const requestUserId = req.user.id; // ID del usuario autenticado
      const userRole = req.user.role;
      const updateData = req.body;

      // Verificar que el usuario solo modifique sus propias preferencias (o que sea admin)
      if (parseInt(userId) !== requestUserId && userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para modificar estas preferencias'
        });
      }

      const updatedPreferences = await service.updateUserPreferences(
        parseInt(userId), 
        updateData
      );
      
      res.json({
        success: true,
        data: updatedPreferences,
        message: 'Preferencias actualizadas exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route PUT /preferences/:userId/watch-progress
 * @desc Actualiza el progreso de reproducción de un contenido específico
 * @access Autenticado (usuario propio o admin)
 */
router.put(
  '/:userId/watch-progress',
  authenticateJwt,
  validatorHandler(getUserPreferencesSchema, 'params'),
  validatorHandler(updateWatchProgressSchema, 'body'),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const requestUserId = req.user.id; // ID del usuario autenticado
      const userRole = req.user.role;
      const { contentId, position, type, currentEpisode, completed } = req.body;

      // Verificar que el usuario solo modifique su propio progreso (o que sea admin)
      if (parseInt(userId) !== requestUserId && userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para modificar este progreso'
        });
      }

      const progressData = {
        position,
        type,
        ...(currentEpisode && { currentEpisode }),
        completed: completed || false
      };

      const updatedPreferences = await service.updateWatchProgress(
        parseInt(userId),
        contentId,
        progressData
      );
      
      res.json({
        success: true,
        data: updatedPreferences,
        message: 'Progreso de reproducción actualizado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route GET /preferences/:userId/watch-progress/:contentId
 * @desc Obtiene el progreso de reproducción de un contenido específico
 * @access Autenticado (usuario propio o admin)
 */
router.get(
  '/:userId/watch-progress/:contentId',
  authenticateJwt,
  validatorHandler(getWatchProgressSchema, 'params'),
  async (req, res, next) => {
    try {
      const { userId, contentId } = req.params;
      const requestUserId = req.user.id; // ID del usuario autenticado
      const userRole = req.user.role;

      // Verificar que el usuario solo acceda a su propio progreso (o que sea admin)
      if (parseInt(userId) !== requestUserId && userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para acceder a este progreso'
        });
      }

      const progress = await service.getWatchProgress(parseInt(userId), contentId);
      
      res.json({
        success: true,
        data: progress,
        message: progress ? 'Progreso encontrado' : 'No hay progreso guardado para este contenido'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /preferences/:userId/migrate-localStorage
 * @desc Migra datos de localStorage al backend
 * @access Autenticado (usuario propio o admin)
 */
router.post(
  '/:userId/migrate-localStorage',
  authenticateJwt,
  validatorHandler(getUserPreferencesSchema, 'params'),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const requestUserId = req.user.id; // ID del usuario autenticado
      const userRole = req.user.role;
      const localStorageData = req.body;

      // Verificar que el usuario solo migre sus propios datos (o que sea admin)
      if (parseInt(userId) !== requestUserId && userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para migrar estos datos'
        });
      }

      const migratedPreferences = await service.migrateFromLocalStorage(
        parseInt(userId),
        localStorageData
      );
      
      res.json({
        success: true,
        data: migratedPreferences,
        message: 'Datos migrados exitosamente desde localStorage'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route DELETE /preferences/:userId
 * @desc Elimina las preferencias de un usuario (solo admin)
 * @access Admin solamente
 */
router.delete(
  '/:userId',
  authenticateJwt,
  checkRoles(['admin']),
  validatorHandler(getUserPreferencesSchema, 'params'),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      await service.deleteUserPreferences(parseInt(userId));
      
      res.json({
        success: true,
        message: 'Preferencias eliminadas exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;