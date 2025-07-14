// ===== GET EPISODE BY ID SERVICE - RESPUESTA ESTRUCTURADA =====
// src/services/Episodes/getEpisodeByIdService.js

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Obtener episodio por ID - RESPUESTA ESTRUCTURADA
 * ✅ MANEJO DE ERRORES: Respuestas consistentes para diferentes estados
 * ✅ SESIÓN EXPIRADA: Detección y manejo de sesión expirada
 */
const getEpisodeByIdService = async (episodeId) => {
    const { urlBackend } = environmentService();
    try {
        console.log('📺 Obteniendo episodio ID:', episodeId);
        
        const response = await axios.get(`${urlBackend}/api/v1/episodes/${episodeId}`, {
            withCredentials: true,
        });
        
        console.log('📥 Respuesta del backend:', response.data);
        
        // ✅ RESPUESTA ESTRUCTURADA
        return {
            success: true,
            data: response.data,
            message: 'Episodio obtenido exitosamente'
        };
    } catch (error) {
        console.error('💥 Error al obtener episodio por ID:', error);
        
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
        
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Error al obtener episodio',
            details: error.response?.data
        };
    }
};

export { getEpisodeByIdService };