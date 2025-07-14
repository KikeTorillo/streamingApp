// ===== UPDATE EPISODE SERVICE - SOLO CAMPOS PERMITIDOS =====
// src/services/Episodes/updateEpisodeService.js

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Actualizar episodio - SOLO CAMPOS PERMITIDOS
 * ✅ CAMPOS PERMITIDOS: title, serieId, season, episodeNumber
 * ✅ RESPUESTA ESTRUCTURADA: Manejo consistente de respuestas del backend
 * ✅ VALIDACIÓN: Solo envía campos que han cambiado
 */
const updateEpisodeService = async (id, episodeData) => {
    const { urlBackend } = environmentService();
    
    console.log('📺 Actualizando episodio ID:', id, 'con datos:', episodeData);
    
    // Crear FormData solo con campos permitidos y que tienen valores
    const formData = new FormData();
    
    // ✅ CAMPOS PERMITIDOS PARA EDICIÓN
    if (episodeData.title && episodeData.title.trim() !== '') {
        formData.append("title", episodeData.title.trim());
    }
    
    if (episodeData.serieId) {
        formData.append("serieId", episodeData.serieId);
    }
    
    if (episodeData.season) {
        formData.append("season", episodeData.season);
    }
    
    if (episodeData.episodeNumber) {
        formData.append("episodeNumber", episodeData.episodeNumber);
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
        
        const response = await axios.patch(`${urlBackend}/api/v1/episodes/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        
        console.log('📥 Respuesta del backend:', response.data);
        
        // ✅ RESPUESTA ESTRUCTURADA
        return {
            success: true,
            data: response.data,
            message: 'Episodio actualizado exitosamente'
        };
    } catch (error) {
        console.error("💥 Error al actualizar episodio:", error);
        
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
                error: 'Episodio no encontrado',
                code: 'EPISODE_NOT_FOUND'
            };
        }
        
        if (error.response?.status === 403) {
            return {
                success: false,
                error: 'No tienes permisos para editar este episodio',
                code: 'FORBIDDEN'
            };
        }
        
        if (error.response?.status === 409) {
            return {
                success: false,
                error: 'Conflicto: Ya existe un episodio con estos datos',
                code: 'EPISODE_CONFLICT'
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Error al actualizar episodio',
            details: error.response?.data
        };
    }
};

export { updateEpisodeService };