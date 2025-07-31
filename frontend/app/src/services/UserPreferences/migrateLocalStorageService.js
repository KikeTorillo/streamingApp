// src/services/UserPreferences/migrateLocalStorageService.js
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Migrar datos de localStorage al backend
 * Endpoint: POST /api/v1/user-preferences/{userId}/migrate-localStorage
 * @param {number} userId - ID del usuario
 * @param {Object} localStorageData - Datos del localStorage a migrar
 * @param {Object} localStorageData.watchProgress - Progreso de watch del localStorage
 * @returns {Promise<Object>} Preferencias migradas
 */
const migrateLocalStorageService = async (userId, localStorageData) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.post(
            `${urlBackend}/api/v1/user-preferences/${userId}/migrate-localStorage`, 
            localStorageData,
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
                message: 'No tienes permisos para migrar estos datos'
            };
        }
        
        if (error.response?.status === 400) {
            return {
                success: false,
                data: null,
                error: 'Datos inválidos',
                message: error.response.data.message || 'Los datos de localStorage no son válidos'
            };
        }
        
        return {
            success: false,
            data: null,
            error: error.response?.data?.message || 'Error del servidor',
            message: 'Error al migrar los datos de localStorage'
        };
    }
};

/**
 * Obtener datos de localStorage para migración
 * @returns {Object} Datos del localStorage formateados para migración
 */
const getLocalStorageDataForMigration = () => {
    try {
        const watchProgress = localStorage.getItem('watchProgress');
        const parsedWatchProgress = watchProgress ? JSON.parse(watchProgress) : {};
        
        return {
            watchProgress: parsedWatchProgress
        };
    } catch (error) {

        return {
            watchProgress: {}
        };
    }
};

/**
 * Limpiar datos de localStorage después de migración exitosa
 * @param {Array} keys - Claves específicas a limpiar (opcional)
 */
const clearLocalStorageAfterMigration = (keys = ['watchProgress']) => {
    try {
        keys.forEach(key => {
            localStorage.removeItem(key);
        });

    } catch (error) {

    }
};

export { 
    migrateLocalStorageService, 
    getLocalStorageDataForMigration, 
    clearLocalStorageAfterMigration 
};