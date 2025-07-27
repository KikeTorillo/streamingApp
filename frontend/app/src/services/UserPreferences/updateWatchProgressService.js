// src/services/UserPreferences/updateWatchProgressService.js
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Actualizar progreso de reproducción de un contenido específico
 * Endpoint: PUT /api/v1/user-preferences/{userId}/watch-progress
 * @param {number} userId - ID del usuario
 * @param {string} contentId - ID del contenido (película o serie)
 * @param {Object} progressData - Datos del progreso
 * @param {number} progressData.position - Posición en segundos
 * @param {string} progressData.type - Tipo: 'movie' o 'series'
 * @param {number} [progressData.currentEpisode] - Episodio actual (solo para series)
 * @param {boolean} [progressData.completed] - Si se completó la reproducción
 * @returns {Promise<Object>} Preferencias actualizadas
 */
const updateWatchProgressService = async (userId, contentId, progressData) => {
    const { urlBackend } = environmentService();
    console.log('🔍 [updateWatchProgress] Enviando datos:', { userId, contentId, progressData });
    try {
        const payload = {
            contentId,
            position: progressData.position,
            type: progressData.type,
            ...(progressData.currentEpisode !== undefined && { currentEpisode: progressData.currentEpisode }),
            completed: progressData.completed || false
        };
        console.log('🔍 [updateWatchProgress] Payload final:', payload);

        const response = await axios.put(
            `${urlBackend}/api/v1/user-preferences/${userId}/watch-progress`, 
            payload,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        console.error('Error al actualizar progreso de reproducción:', error);
        
        // Manejar errores específicos
        if (error.response?.status === 404) {
            return {
                success: false,
                data: null,
                error: 'Usuario no encontrado',
                message: 'No se encontró el usuario especificado'
            };
        }
        
        if (error.response?.status === 403) {
            return {
                success: false,
                data: null,
                error: 'Sin permisos',
                message: 'No tienes permisos para modificar este progreso'
            };
        }
        
        if (error.response?.status === 400) {
            return {
                success: false,
                data: null,
                error: 'Datos inválidos',
                message: error.response.data.message || 'Los datos de progreso no son válidos'
            };
        }
        
        return {
            success: false,
            data: null,
            error: error.response?.data?.message || 'Error del servidor',
            message: 'Error al actualizar el progreso de reproducción'
        };
    }
};

export { updateWatchProgressService };