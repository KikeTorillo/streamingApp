// src/services/UserPreferences/updateUserPreferencesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Actualizar preferencias de usuario
 * Endpoint: PUT /api/v1/user-preferences/{userId}
 * @param {number} userId - ID del usuario
 * @param {Object} preferences - Preferencias a actualizar
 * @returns {Promise<Object>} Preferencias actualizadas
 */
const updateUserPreferencesService = async (userId, preferences) => {
    const { urlBackend } = environmentService();

    // ⚠️ VALIDACIÓN: Detectar si hay contentId por error
    if (preferences && preferences.contentId) {

        return {
            success: false,
            error: 'contentId no permitido en preferencias generales',
            message: 'Error de implementación detectado'
        };
    }
    try {
        const response = await axios.put(
            `${urlBackend}/api/v1/user-preferences/${userId}`, 
            preferences,
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
                message: 'No tienes permisos para modificar estas preferencias'
            };
        }
        
        if (error.response?.status === 400) {
            return {
                success: false,
                data: null,
                error: 'Datos inválidos',
                message: error.response.data.message || 'Los datos proporcionados no son válidos'
            };
        }
        
        return {
            success: false,
            data: null,
            error: error.response?.data?.message || 'Error del servidor',
            message: 'Error al actualizar las preferencias'
        };
    }
};

export { updateUserPreferencesService };