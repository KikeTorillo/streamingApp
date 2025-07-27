// userPreferencesService.js
// Servicio para gestionar las preferencias de usuario del video player

const pool = require('../libs/postgresPool'); // Pool de conexiones a PostgreSQL
const boom = require('@hapi/boom'); // Biblioteca para manejo de errores HTTP estructurados
const { updateTable } = require('./../utils/database/updateAbtraction'); // Función genérica para actualización de tablas

/**
 * Clase que gestiona las operaciones relacionadas con las preferencias de usuario.
 */
class UserPreferencesService {
  constructor() {
    this.pool = pool; // Asigna el pool de conexiones
    this.pool.on('error', (err) => {
      console.error('Error en el pool de PostgreSQL:', err);
      // Considera reiniciar o notificar en producción
    });
  }

  /**
   * Obtiene las preferencias de un usuario por su ID.
   * Si no existen preferencias, crea unas por defecto.
   * @param {number} userId - ID del usuario.
   * @returns {Object} Preferencias del usuario.
   */
  async getUserPreferences(userId) {
    const query = `
      SELECT 
        id, user_id, volume, playback_rate, autoplay, muted,
        default_quality, preferred_language, subtitles_enabled, 
        forced_subtitles_only, auto_fullscreen, picture_in_picture_enabled,
        hotkey_enabled, watch_progress, created_at, updated_at
      FROM user_preferences 
      WHERE user_id = $1
    `;

    const result = await this.pool.query(query, [userId]);

    // Si no existen preferencias, crear unas por defecto
    if (!result.rows.length) {
      return await this.createDefaultPreferences(userId);
    }

    return result.rows[0];
  }

  /**
   * Crea preferencias por defecto para un usuario.
   * @param {number} userId - ID del usuario.
   * @returns {Object} Preferencias creadas por defecto.
   */
  async createDefaultPreferences(userId) {
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

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Actualiza las preferencias de un usuario.
   * @param {number} userId - ID del usuario.
   * @param {Object} preferences - Preferencias a actualizar.
   * @returns {Object} Preferencias actualizadas.
   */
  async updateUserPreferences(userId, preferences) {
    console.log('🔍 [Backend] updateUserPreferences - userId:', userId, 'preferences:', preferences);
    
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

    console.log('🔍 [Backend] updateFields preparados:', updateFields);

    if (Object.keys(updateFields).length === 0) {
      throw boom.badRequest('No se proporcionaron campos válidos para actualizar');
    }

    // Usar función específica para actualizar por user_id
    const updatedPreferences = await this.updateUserPreferencesByUserId(userId, updateFields);
    
    console.log('🔍 [Backend] Preferencias actualizadas exitosamente');

    if (!updatedPreferences.length) {
      throw boom.notFound('No se pudieron actualizar las preferencias');
    }

    return updatedPreferences[0];
  }

  /**
   * Actualiza específicamente el progreso de reproducción de un contenido.
   * @param {number} userId - ID del usuario.
   * @param {string} contentId - ID del contenido (película o serie).
   * @param {Object} progressData - Datos del progreso.
   * @returns {Object} Preferencias actualizadas.
   */
  async updateWatchProgress(userId, contentId, progressData) {
    console.log('🔍 [Backend] updateWatchProgress - userId:', userId, 'contentId:', contentId, 'progressData:', progressData);
    
    // Obtener preferencias actuales
    const currentPreferences = await this.getUserPreferences(userId);
    
    // Actualizar el progreso en el objeto JSON
    const watchProgress = currentPreferences.watch_progress || {};
    
    watchProgress[contentId] = {
      position: progressData.position,
      type: progressData.type,
      ...(progressData.type === 'series' && { currentEpisode: progressData.currentEpisode }),
      timestamp: Date.now(),
      completed: progressData.completed || false
    };

    console.log('🔍 [Backend] watchProgress actualizado:', watchProgress);

    // Actualizar solo el campo watch_progress
    return await this.updateUserPreferences(userId, { watch_progress: watchProgress });
  }

  /**
   * Obtiene el progreso de reproducción de un contenido específico.
   * @param {number} userId - ID del usuario.
   * @param {string} contentId - ID del contenido.
   * @returns {Object|null} Progreso del contenido o null si no existe.
   */
  async getWatchProgress(userId, contentId) {
    const preferences = await this.getUserPreferences(userId);
    const watchProgress = preferences.watch_progress || {};
    
    return watchProgress[contentId] || null;
  }

  /**
   * Elimina las preferencias de un usuario.
   * @param {number} userId - ID del usuario.
   * @returns {boolean} True si se eliminaron correctamente.
   */
  async deleteUserPreferences(userId) {
    const query = 'DELETE FROM user_preferences WHERE user_id = $1 RETURNING *';
    const result = await this.pool.query(query, [userId]);

    if (!result.rows.length) {
      throw boom.notFound('Preferencias de usuario no encontradas');
    }

    return true;
  }

  /**
   * Migra datos de localStorage a la base de datos.
   * Útil para migrar preferencias existentes de usuarios.
   * @param {number} userId - ID del usuario.
   * @param {Object} localStorageData - Datos del localStorage.
   * @returns {Object} Preferencias migradas.
   */
  async migrateFromLocalStorage(userId, localStorageData) {
    // Obtener o crear preferencias del usuario
    let preferences = await this.getUserPreferences(userId);

    // Migrar progreso de watch si existe en localStorage
    if (localStorageData.watchProgress) {
      const migratedWatchProgress = {};
      
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

      // Actualizar preferencias con el progreso migrado
      preferences = await this.updateUserPreferences(userId, { 
        watch_progress: combinedWatchProgress 
      });
    }

    return preferences;
  }

  /**
   * Función específica para actualizar preferencias de usuario por user_id.
   * @param {number} userId - ID del usuario.
   * @param {Object} updateFields - Campos a actualizar (ya mapeados a snake_case).
   * @returns {Array} Array con el registro actualizado.
   */
  async updateUserPreferencesByUserId(userId, updateFields) {
    try {
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
        throw boom.badRequest('No hay campos válidos para actualizar');
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

      console.log('🔍 [Backend] Query SQL:', query);
      console.log('🔍 [Backend] Valores:', values);

      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error al actualizar preferencias por user_id:', error.message);
      throw boom.internal('Error al actualizar las preferencias de usuario');
    }
  }
}

module.exports = UserPreferencesService;