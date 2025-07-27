// src/services/UserPreferences/getWatchProgressService.js
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Obtener progreso de reproducción de un contenido específico
 * Endpoint: GET /api/v1/user-preferences/{userId}/watch-progress/{contentId}
 * @param {number} userId - ID del usuario
 * @param {string} contentId - ID del contenido (película o serie)
 * @returns {Promise<Object>} Progreso del contenido o null si no existe
 */
const getWatchProgressService = async (userId, contentId) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(
            `${urlBackend}/api/v1/user-preferences/${userId}/watch-progress/${contentId}`,
            {
                withCredentials: true,
            }
        );
        
        return {
            success: true,
            data: response.data.data, // Puede ser null si no hay progreso
            message: response.data.message
        };
    } catch (error) {
        console.error('Error al obtener progreso de reproducción:', error);
        
        // Manejar errores específicos
        if (error.response?.status === 404) {
            return {
                success: true, // No es error si no hay progreso guardado
                data: null,
                message: 'No hay progreso guardado para este contenido'
            };
        }
        
        if (error.response?.status === 403) {
            return {
                success: false,
                data: null,
                error: 'Sin permisos',
                message: 'No tienes permisos para acceder a este progreso'
            };
        }
        
        return {
            success: false,
            data: null,
            error: error.response?.data?.message || 'Error del servidor',
            message: 'Error al obtener el progreso de reproducción'
        };
    }
};

export { getWatchProgressService };