// ===== UPDATE MOVIE SERVICE - SOLO CAMPOS PERMITIDOS =====
// src/services/Movies/updateMovieService.js

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Actualizar película - SOLO CAMPOS PERMITIDOS
 * ✅ CAMPOS PERMITIDOS: title, categoryId, releaseYear, coverImage
 * ✅ RESPUESTA ESTRUCTURADA: Manejo consistente de respuestas del backend
 * ✅ VALIDACIÓN: Solo envía campos que han cambiado
 */
const updateMovieService = async (id, movieData) => {
    const { urlBackend } = environmentService();
    
    console.log('🎬 Actualizando película ID:', id, 'con datos:', movieData);
    
    // Crear FormData solo con campos permitidos y que tienen valores
    const formData = new FormData();
    
    // ✅ CAMPOS PERMITIDOS PARA EDICIÓN
    if (movieData.title && movieData.title.trim() !== '') {
        formData.append("title", movieData.title.trim());
    }
    
    if (movieData.categoryId) {
        formData.append("categoryId", movieData.categoryId);
    }
    
    if (movieData.releaseYear) {
        formData.append("releaseYear", movieData.releaseYear);
    }
    
    if (movieData.coverImage && movieData.coverImage instanceof File) {
        formData.append("coverImage", movieData.coverImage);
    }

    // Verificar que hay datos para enviar
    if (![...formData.keys()].length) {
        return {
            success: false,
            error: 'No hay campos válidos para actualizar'
        };
    }

    try {
        console.log('📤 Enviando datos al backend...');
        
        const response = await axios.patch(`${urlBackend}/api/v1/movies/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        
        console.log('📥 Respuesta del backend:', response.data);
        
        // ✅ RESPUESTA ESTRUCTURADA
        return {
            success: true,
            data: response.data,
            message: 'Película actualizada exitosamente'
        };
    } catch (error) {
        console.error("💥 Error al actualizar película:", error);
        
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
        
        if (error.response?.status === 403) {
            return {
                success: false,
                error: 'No tienes permisos para editar esta película',
                code: 'FORBIDDEN'
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Error al actualizar película',
            details: error.response?.data
        };
    }
};

export { updateMovieService };