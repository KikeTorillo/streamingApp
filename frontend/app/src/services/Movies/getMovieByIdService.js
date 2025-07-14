// ===== GET MOVIE BY ID SERVICE - RESPUESTA ESTRUCTURADA =====
// src/services/Movies/getMovieByIdService.js

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Obtener película por ID - RESPUESTA ESTRUCTURADA
 * ✅ MANEJO DE ERRORES: Respuestas consistentes para diferentes estados
 * ✅ SESIÓN EXPIRADA: Detección y manejo de sesión expirada
 */
const getMovieByIdService = async (movieId) => {
    const { urlBackend } = environmentService();
    try {
        console.log('🎬 Obteniendo película ID:', movieId);
        
        const response = await axios.get(`${urlBackend}/api/v1/movies/${movieId}`, {
            withCredentials: true,
        });
        
        console.log('📥 Respuesta del backend:', response.data);
        
        // ✅ RESPUESTA ESTRUCTURADA
        return {
            success: true,
            data: response.data,
            message: 'Película obtenida exitosamente'
        };
    } catch (error) {
        console.error('💥 Error al obtener película por ID:', error);
        
        // ✅ MANEJO ESPECÍFICO DE ERRORES
        if (error.response?.status === 401) {
            return {
                success: false,
                message: 'session expired',
                error: true
            };
        }
        
        if (error.response?.status === 404) {
            return {
                success: false,
                error: 'Película no encontrada',
                code: 'MOVIE_NOT_FOUND'
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Error al obtener película',
            details: error.response?.data
        };
    }
};

const getMovieByHashService = async (fileHash) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/movies/by-hash/${fileHash}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener película por hash:', error);
        throw error;
    }
};

export { getMovieByIdService, getMovieByHashService };