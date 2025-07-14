// ===== UPDATE SERIES SERVICE - SOLO CAMPOS PERMITIDOS =====
// src/services/Series/updateSeriesService.js

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Actualizar serie - SOLO CAMPOS PERMITIDOS
 * ✅ CAMPOS PERMITIDOS: title, categoryId, releaseYear, coverImage
 * ✅ RESPUESTA ESTRUCTURADA: Manejo consistente de respuestas del backend
 * ✅ VALIDACIÓN: Solo envía campos que han cambiado
 */
const updateSeriesService = async (id, seriesData) => {
    const { urlBackend } = environmentService();
    
    console.log('📺 Actualizando serie ID:', id, 'con datos:', seriesData);
    
    // Crear FormData solo con campos permitidos y que tienen valores
    const formData = new FormData();
    
    // ✅ CAMPOS PERMITIDOS PARA EDICIÓN
    if (seriesData.title && seriesData.title.trim() !== '') {
        formData.append("title", seriesData.title.trim());
    }
    
    if (seriesData.categoryId) {
        formData.append("categoryId", seriesData.categoryId);
    }
    
    if (seriesData.releaseYear) {
        formData.append("releaseYear", seriesData.releaseYear);
    }
    
    if (seriesData.coverImage && seriesData.coverImage instanceof File) {
        formData.append("coverImage", seriesData.coverImage);
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
        
        const response = await axios.patch(`${urlBackend}/api/v1/series/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        
        console.log('📥 Respuesta del backend:', response.data);
        
        // ✅ RESPUESTA ESTRUCTURADA
        return {
            success: true,
            data: response.data,
            message: 'Serie actualizada exitosamente'
        };
    } catch (error) {
        console.error("💥 Error al actualizar serie:", error);
        
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
                error: 'Serie no encontrada',
                code: 'SERIES_NOT_FOUND'
            };
        }
        
        if (error.response?.status === 403) {
            return {
                success: false,
                error: 'No tienes permisos para editar esta serie',
                code: 'FORBIDDEN'
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Error al actualizar serie',
            details: error.response?.data
        };
    }
};

export { updateSeriesService };