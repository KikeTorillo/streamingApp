/**
 * @file userPreferencesService.js
 * @description Servicio de preferencias de usuario refactorizado con sistema de errores centralizado
 * y logging estructurado. Maneja preferencias del video player y progreso de reproducción.
 * 
 * MEJORAS IMPLEMENTADAS:
 * - ErrorFactory para errores consistentes en español
 * - Logger estructurado para debugging
 * - Validaciones mejoradas con contexto
 * - Manejo de errores homologado
 * - Sistema centralizado de logs heredado de BaseService
 */

const pool = require('../libs/postgresPool'); // Pool de conexiones a PostgreSQL
const boom = require('@hapi/boom'); // Biblioteca para manejo de errores HTTP estructurados
const { updateTable } = require('./../utils/database/updateAbtraction'); // Función genérica para actualización de tablas

// Sistema centralizado de errores y logging
const BaseService = require('./BaseService');
const ErrorFactory = require('../utils/errors/ErrorFactory');

/**
 * Clase que gestiona las operaciones relacionadas con las preferencias de usuario.
 * Extiende BaseService para usar el sistema centralizado de errores y logging.
 */
class UserPreferencesService extends BaseService {
  constructor() {
    super('UserPreferencesService'); // Inicializar BaseService con nombre del servicio
    
    this.pool = pool; // Asigna el pool de conexiones
    this.pool.on('error', (err) => {
      this.logger.error('Error en el pool de PostgreSQL', { 
        error: err.message,
        operation: 'pool_connection'
      });
      // Considera reiniciar o notificar en producción
    });
    
    this.logger.info('UserPreferencesService inicializado correctamente');
  }

  /**
   * Obtiene las preferencias de un usuario por su ID.
   * Si no existen preferencias, crea unas por defecto.
   * @param {number} userId - ID del usuario.
   * @returns {Object} Preferencias del usuario.
   */
  async getUserPreferences(userId) {
    try {
      this.logger.info('Obteniendo preferencias de usuario', { userId });
      
      const query = `
        SELECT 
          id, user_id, volume, playback_rate, autoplay, muted,
          default_quality, preferred_language, subtitles_enabled, 
          forced_subtitles_only, auto_fullscreen, picture_in_picture_enabled,
          hotkey_enabled, watch_progress, created_at, updated_at
        FROM user_preferences 
        WHERE user_id = $1
      `;

      this.logger.debug('Ejecutando consulta de preferencias', { 
        userId,
        operation: 'get_user_preferences'
      });
      
      const result = await this.pool.query(query, [userId]);

      // Si no existen preferencias, crear unas por defecto
      if (!result.rows.length) {
        this.logger.info('No se encontraron preferencias, creando por defecto', { userId });
        return await this.createDefaultPreferences(userId);
      }

      this.logger.info('Preferencias obtenidas exitosamente', { 
        userId,
        hasPreferences: true
      });
      
      return result.rows[0];
      
    } catch (error) {
      // Si es un error de nuestro sistema, re-lanzarlo
      if (error.isBoom) {
        throw error;
      }
      
      // Para errores inesperados
      this.logger.error('Error al obtener preferencias de usuario', { 
        userId,
        error: error.message,
        operation: 'get_user_preferences'
      });
      throw ErrorFactory.internal('USER_PREFERENCES', 'GET_PREFERENCES_FAILED', {
        operation: 'get_user_preferences',
        userId
      });
    }
  }

  /**
   * Crea preferencias por defecto para un usuario.
   * @param {number} userId - ID del usuario.
   * @returns {Object} Preferencias creadas por defecto.
   */
  async createDefaultPreferences(userId) {
    try {
      this.logger.info('Creando preferencias por defecto', { userId });
      
      const defaultPreferences = {
        user_id: userId,
        volume: 1.0,
        playback_rate: 1.0,
        autoplay: false,
        muted: false,
        default_quality: 'auto',
        preferred_language: 'es',
        subtitles_enabled: true,
        forced_subtitles_only: false,
        auto_fullscreen: false,
        picture_in_picture_enabled: true,
        hotkey_enabled: true,
        watch_progress: {}
      };

      this.logger.debug('Preferencias por defecto configuradas', { 
        userId,
        defaultPreferences: {
          volume: defaultPreferences.volume,
          playback_rate: defaultPreferences.playback_rate,
          preferred_language: defaultPreferences.preferred_language
        }
      });

      const query = `
        INSERT INTO user_preferences (
          user_id, volume, playback_rate, autoplay, muted,
          default_quality, preferred_language, subtitles_enabled,
          forced_subtitles_only, auto_fullscreen, picture_in_picture_enabled,
          hotkey_enabled, watch_progress
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        ) RETURNING *
      `;

      const values = [
        defaultPreferences.user_id,
        defaultPreferences.volume,
        defaultPreferences.playback_rate,
        defaultPreferences.autoplay,
        defaultPreferences.muted,
        defaultPreferences.default_quality,
        defaultPreferences.preferred_language,
        defaultPreferences.subtitles_enabled,
        defaultPreferences.forced_subtitles_only,
        defaultPreferences.auto_fullscreen,
        defaultPreferences.picture_in_picture_enabled,
        defaultPreferences.hotkey_enabled,
        JSON.stringify(defaultPreferences.watch_progress)
      ];

      this.logger.debug('Ejecutando inserción de preferencias por defecto', { 
        userId,
        operation: 'create_default_preferences'
      });
      
      const result = await this.pool.query(query, values);
      
      this.logger.info('Preferencias por defecto creadas exitosamente', { 
        userId,
        preferencesId: result.rows[0].id
      });
      
      return result.rows[0];
      
    } catch (error) {
      this.logger.error('Error al crear preferencias por defecto', { 
        userId,
        error: error.message,
        operation: 'create_default_preferences'
      });
      throw ErrorFactory.internal('USER_PREFERENCES', 'CREATE_DEFAULT_FAILED', {
        operation: 'create_default_preferences',
        userId
      });
    }
  }

  /**
   * Actualiza las preferencias de un usuario.
   * @param {number} userId - ID del usuario.
   * @param {Object} preferences - Preferencias a actualizar.
   * @returns {Object} Preferencias actualizadas.
   */
  async updateUserPreferences(userId, preferences) {
    try {
      this.logger.info('Actualizando preferencias de usuario', { 
        userId,
        preferencesKeys: Object.keys(preferences)
      });
      this.logger.debug('Datos completos de preferencias a actualizar', { 
        userId,
        preferences,
        operation: 'update_user_preferences'
      });
      
      // Verificar que el usuario tiene preferencias existentes
      await this.getUserPreferences(userId);

      // Preparar campos para actualización
      const updateFields = {};
    
    // Mapear campos camelCase a snake_case
    const fieldMapping = {
      'volume': 'volume',
      'playbackRate': 'playback_rate',
      'playback_rate': 'playback_rate', // Mantener snake_case por compatibilidad
      'autoplay': 'autoplay',
      'muted': 'muted',
      'defaultQuality': 'default_quality',
      'default_quality': 'default_quality', // Mantener snake_case por compatibilidad
      'preferredLanguage': 'preferred_language',
      'preferred_language': 'preferred_language', // Mantener snake_case por compatibilidad
      'subtitlesEnabled': 'subtitles_enabled',
      'subtitles_enabled': 'subtitles_enabled', // Mantener snake_case por compatibilidad
      'forcedSubtitlesOnly': 'forced_subtitles_only',
      'forced_subtitles_only': 'forced_subtitles_only', // Mantener snake_case por compatibilidad
      'autoFullscreen': 'auto_fullscreen',
      'auto_fullscreen': 'auto_fullscreen', // Mantener snake_case por compatibilidad
      'pictureInPictureEnabled': 'picture_in_picture_enabled',
      'picture_in_picture_enabled': 'picture_in_picture_enabled', // Mantener snake_case por compatibilidad
      'hotkeyEnabled': 'hotkey_enabled',
      'hotkey_enabled': 'hotkey_enabled', // Mantener snake_case por compatibilidad
      'watchProgress': 'watch_progress',
      'watch_progress': 'watch_progress' // Mantener snake_case por compatibilidad
    };

    // Filtrar y mapear campos que se están actualizando
    for (const [inputField, dbField] of Object.entries(fieldMapping)) {
      if (preferences.hasOwnProperty(inputField)) {
        // Convertir watch_progress a JSON si es un objeto
        if (dbField === 'watch_progress' && typeof preferences[inputField] === 'object') {
          updateFields[dbField] = JSON.stringify(preferences[inputField]);
        } else {
          updateFields[dbField] = preferences[inputField];
        }
      }
    }

      this.logger.debug('Campos preparados para actualización', { 
        userId,
        updateFields,
        fieldsCount: Object.keys(updateFields).length
      });

      if (Object.keys(updateFields).length === 0) {
        this.logger.warn('Intento de actualización sin campos válidos', { userId });
        throw ErrorFactory.badRequest('NO_VALID_FIELDS', {
          operation: 'update_user_preferences',
          userId
        });
      }

      // Usar función específica para actualizar por user_id
      const updatedPreferences = await this.updateUserPreferencesByUserId(userId, updateFields);
      
      this.logger.info('Preferencias actualizadas exitosamente', { 
        userId,
        updatedFieldsCount: Object.keys(updateFields).length
      });

      if (!updatedPreferences.length) {
        this.logger.error('No se pudieron actualizar las preferencias', { userId });
        throw ErrorFactory.notFound('PREFERENCES_UPDATE_FAILED', {
          operation: 'update_user_preferences',
          userId
        });
      }

      return updatedPreferences[0];
      
    } catch (error) {
      // Si es un error de nuestro sistema, re-lanzarlo
      if (error.isBoom) {
        throw error;
      }
      
      // Para errores inesperados
      this.logger.error('Error inesperado al actualizar preferencias', { 
        userId,
        preferences: Object.keys(preferences),
        error: error.message,
        operation: 'update_user_preferences'
      });
      throw ErrorFactory.internal('USER_PREFERENCES', 'UPDATE_PREFERENCES_FAILED', {
        operation: 'update_user_preferences',
        userId
      });
    }
  }

  /**
   * Actualiza específicamente el progreso de reproducción de un contenido.
   * @param {number} userId - ID del usuario.
   * @param {string} contentId - ID del contenido (película o serie).
   * @param {Object} progressData - Datos del progreso.
   * @returns {Object} Preferencias actualizadas.
   */
  async updateWatchProgress(userId, contentId, progressData) {
    try {
      this.logger.info('Actualizando progreso de reproducción', { 
        userId,
        contentId,
        contentType: progressData.type,
        position: progressData.position
      });
      this.logger.debug('Datos completos del progreso', { 
        userId,
        contentId,
        progressData,
        operation: 'update_watch_progress'
      });
      
      // Obtener preferencias actuales
      const currentPreferences = await this.getUserPreferences(userId);
      
      // Actualizar el progreso en el objeto JSON
      const watchProgress = currentPreferences.watch_progress || {};
      
      watchProgress[contentId] = {
        position: progressData.position,
        type: progressData.type,
        // ✅ Mantener compatibilidad con series antiguas
        ...(progressData.type === 'series' && { currentEpisode: progressData.currentEpisode }),
        // ✅ Nuevos campos para episodios individuales
        ...(progressData.type === 'episode' && {
          seriesId: progressData.seriesId,
          episodeIndex: progressData.episodeIndex,
          seasonNumber: progressData.seasonNumber,
          episodeNumber: progressData.episodeNumber
        }),
        timestamp: Date.now(),
        completed: progressData.completed || false
      };

      this.logger.debug('Progreso de reproducción actualizado', { 
        userId,
        contentId,
        watchProgress: watchProgress[contentId],
        totalProgressEntries: Object.keys(watchProgress).length
      });

      // Actualizar solo el campo watch_progress
      const result = await this.updateUserPreferences(userId, { watch_progress: watchProgress });
      
      this.logger.info('Progreso de reproducción guardado exitosamente', { 
        userId,
        contentId,
        position: progressData.position
      });
      
      return result;
      
    } catch (error) {
      // Si es un error de nuestro sistema, re-lanzarlo
      if (error.isBoom) {
        throw error;
      }
      
      // Para errores inesperados
      this.logger.error('Error al actualizar progreso de reproducción', { 
        userId,
        contentId,
        progressData,
        error: error.message,
        operation: 'update_watch_progress'
      });
      throw ErrorFactory.internal('USER_PREFERENCES', 'UPDATE_WATCH_PROGRESS_FAILED', {
        operation: 'update_watch_progress',
        userId,
        contentId
      });
    }
  }

  /**
   * Obtiene el progreso de reproducción de un contenido específico.
   * @param {number} userId - ID del usuario.
   * @param {string} contentId - ID del contenido.
   * @returns {Object|null} Progreso del contenido o null si no existe.
   */
  async getWatchProgress(userId, contentId) {
    try {
      this.logger.info('Obteniendo progreso de reproducción', { 
        userId,
        contentId
      });
      
      const preferences = await this.getUserPreferences(userId);
      const watchProgress = preferences.watch_progress || {};
      const progress = watchProgress[contentId] || null;
      
      this.logger.debug('Progreso de reproducción obtenido', { 
        userId,
        contentId,
        hasProgress: !!progress,
        position: progress?.position,
        operation: 'get_watch_progress'
      });
      
      return progress;
      
    } catch (error) {
      // Si es un error de nuestro sistema, re-lanzarlo
      if (error.isBoom) {
        throw error;
      }
      
      // Para errores inesperados
      this.logger.error('Error al obtener progreso de reproducción', { 
        userId,
        contentId,
        error: error.message,
        operation: 'get_watch_progress'
      });
      throw ErrorFactory.internal('USER_PREFERENCES', 'GET_WATCH_PROGRESS_FAILED', {
        operation: 'get_watch_progress',
        userId,
        contentId
      });
    }
  }

  /**
   * Elimina las preferencias de un usuario.
   * @param {number} userId - ID del usuario.
   * @returns {boolean} True si se eliminaron correctamente.
   */
  async deleteUserPreferences(userId) {
    try {
      this.logger.info('Eliminando preferencias de usuario', { userId });
      
      const query = 'DELETE FROM user_preferences WHERE user_id = $1 RETURNING *';
      
      this.logger.debug('Ejecutando eliminación de preferencias', { 
        userId,
        operation: 'delete_user_preferences'
      });
      
      const result = await this.pool.query(query, [userId]);

      if (!result.rows.length) {
        this.logger.warn('Intento de eliminar preferencias inexistentes', { userId });
        throw ErrorFactory.notFound('PREFERENCES_NOT_FOUND', {
          operation: 'delete_user_preferences',
          userId
        });
      }

      this.logger.info('Preferencias eliminadas exitosamente', { 
        userId,
        deletedPreferencesId: result.rows[0].id
      });
      
      return true;
      
    } catch (error) {
      // Si es un error de nuestro sistema, re-lanzarlo
      if (error.isBoom) {
        throw error;
      }
      
      // Para errores inesperados
      this.logger.error('Error al eliminar preferencias de usuario', { 
        userId,
        error: error.message,
        operation: 'delete_user_preferences'
      });
      throw ErrorFactory.internal('USER_PREFERENCES', 'DELETE_PREFERENCES_FAILED', {
        operation: 'delete_user_preferences',
        userId
      });
    }
  }

  /**
   * Migra datos de localStorage a la base de datos.
   * Útil para migrar preferencias existentes de usuarios.
   * @param {number} userId - ID del usuario.
   * @param {Object} localStorageData - Datos del localStorage.
   * @returns {Object} Preferencias migradas.
   */
  async migrateFromLocalStorage(userId, localStorageData) {
    try {
      this.logger.info('Iniciando migración desde localStorage', { 
        userId,
        hasWatchProgress: !!localStorageData.watchProgress
      });
      
      // Obtener o crear preferencias del usuario
      let preferences = await this.getUserPreferences(userId);

      // Migrar progreso de watch si existe en localStorage
      if (localStorageData.watchProgress) {
        const migratedWatchProgress = {};
        const contentIds = Object.keys(localStorageData.watchProgress);
        
        this.logger.debug('Migrando datos de localStorage', { 
          userId,
          contentCount: contentIds.length,
          contentIds,
          operation: 'migrate_local_storage'
        });
        
        // Transformar formato de localStorage al formato de BD
        for (const [contentId, progressData] of Object.entries(localStorageData.watchProgress)) {
          migratedWatchProgress[contentId] = {
            position: progressData.position,
            type: progressData.type || 'movie',
            ...(progressData.currentEpisode && { currentEpisode: progressData.currentEpisode }),
            timestamp: progressData.timestamp || Date.now(),
            completed: false
          };
        }

        // Combinar con progreso existente
        const currentWatchProgress = preferences.watch_progress || {};
        const combinedWatchProgress = { ...currentWatchProgress, ...migratedWatchProgress };

        this.logger.debug('Combinando progreso existente con migrado', { 
          userId,
          currentProgressCount: Object.keys(currentWatchProgress).length,
          migratedProgressCount: Object.keys(migratedWatchProgress).length,
          totalProgressCount: Object.keys(combinedWatchProgress).length
        });

        // Actualizar preferencias con el progreso migrado
        preferences = await this.updateUserPreferences(userId, { 
          watch_progress: combinedWatchProgress 
        });
        
        this.logger.info('Migración desde localStorage completada exitosamente', { 
          userId,
          migratedContentCount: contentIds.length
        });
      } else {
        this.logger.info('No hay datos de watchProgress para migrar', { userId });
      }

      return preferences;
      
    } catch (error) {
      // Si es un error de nuestro sistema, re-lanzarlo
      if (error.isBoom) {
        throw error;
      }
      
      // Para errores inesperados
      this.logger.error('Error durante migración desde localStorage', { 
        userId,
        localStorageData: Object.keys(localStorageData),
        error: error.message,
        operation: 'migrate_local_storage'
      });
      throw ErrorFactory.internal('USER_PREFERENCES', 'MIGRATE_LOCAL_STORAGE_FAILED', {
        operation: 'migrate_local_storage',
        userId
      });
    }
  }

  /**
   * Función específica para actualizar preferencias de usuario por user_id.
   * @param {number} userId - ID del usuario.
   * @param {Object} updateFields - Campos a actualizar (ya mapeados a snake_case).
   * @returns {Array} Array con el registro actualizado.
   */
  async updateUserPreferencesByUserId(userId, updateFields) {
    try {
      this.logger.debug('Actualizando preferencias por user_id', { 
        userId,
        updateFields: Object.keys(updateFields),
        operation: 'update_preferences_by_user_id'
      });
      
      // Construir las partes de la consulta dinámicamente
      const updates = [];
      const values = [];
      let paramIndex = 1;

      // Construir SET clause
      Object.entries(updateFields).forEach(([key, value]) => {
        updates.push(`${key} = $${paramIndex++}`);
        values.push(value);
      });

      if (updates.length === 0) {
        this.logger.warn('No hay campos válidos para la actualización SQL', { userId });
        throw ErrorFactory.badRequest('NO_VALID_UPDATE_FIELDS', {
          operation: 'update_preferences_by_user_id',
          userId
        });
      }

      // Agregar user_id al final de los valores
      values.push(userId);
      const userIdParamIndex = paramIndex;

      // Construir consulta final
      const query = `
        UPDATE user_preferences 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $${userIdParamIndex}
        RETURNING *;
      `;

      this.logger.debug('Ejecutando actualización SQL', { 
        userId,
        query,
        valuesCount: values.length,
        operation: 'update_preferences_by_user_id'
      });

      const result = await this.pool.query(query, values);
      
      this.logger.info('Actualización SQL ejecutada exitosamente', { 
        userId,
        updatedRows: result.rows.length,
        updatedFields: Object.keys(updateFields)
      });
      
      return result.rows;
      
    } catch (error) {
      // Si es un error de nuestro sistema, re-lanzarlo
      if (error.isBoom) {
        throw error;
      }
      
      // Para errores inesperados (SQL, conexión, etc.)
      this.logger.error('Error durante actualización SQL de preferencias', { 
        userId,
        updateFields: Object.keys(updateFields),
        error: error.message,
        sqlState: error.code,
        operation: 'update_preferences_by_user_id'
      });
      throw ErrorFactory.internal('USER_PREFERENCES', 'SQL_UPDATE_FAILED', {
        operation: 'update_preferences_by_user_id',
        userId,
        sqlError: error.code
      });
    }
  }
}

module.exports = UserPreferencesService;