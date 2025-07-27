// src/services/UserPreferences/getUserPreferencesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Obtener preferencias de usuario por ID
 * Endpoint: GET /api/v1/user-preferences/{userId}
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Preferencias del usuario
 */
const getUserPreferencesService = async (userId) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/user-preferences/${userId}`, {
            withCredentials: true,
        });
        
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        console.error('Error al obtener preferencias de usuario:', error);
        
        // Manejar errores específicos
        if (error.response?.status === 404) {
            return {
                success: false,
                data: null,
                error: 'Preferencias no encontradas',
                message: 'No se encontraron preferencias para este usuario'
            };
        }
        
        if (error.response?.status === 403) {
            return {
                success: false,
                data: null,
                error: 'Sin permisos',
                message: 'No tienes permisos para acceder a estas preferencias'
            };
        }
        
        return {
            success: false,
            data: null,
            error: error.response?.data?.message || 'Error del servidor',
            message: 'Error al obtener las preferencias'
        };
    }
};

export { getUserPreferencesService };