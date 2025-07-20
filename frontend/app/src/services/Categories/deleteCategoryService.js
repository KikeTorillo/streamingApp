// ===== DELETE CATEGORY SERVICE - RESPUESTA ESTRUCTURADA =====
// src/services/Categories/deleteCategoryService.js

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Eliminar categoría por ID - RESPUESTA ESTRUCTURADA
 * ✅ MANEJO DE ERRORES: Respuestas consistentes para diferentes estados
 * ✅ SESIÓN EXPIRADA: Detección y manejo de sesión expirada
 */
const deleteCategoryService = async (id) => {
    const { urlBackend } = environmentService();
    try {
        console.log('🗑️ Eliminando categoría ID:', id);
        
        const response = await axios.delete(`${urlBackend}/api/v1/category/${id}`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        
        console.log('📥 Respuesta del backend:', response.data);
        
        // ✅ RESPUESTA ESTRUCTURADA
        return {
            success: true,
            data: response.data,
            message: 'Categoría eliminada exitosamente'
        };
    } catch (error) {
        console.error('💥 Error al eliminar categoría:', error);
        
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
                error: 'Categoría no encontrada',
                code: 'CATEGORY_NOT_FOUND'
            };
        }
        
        if (error.response?.status === 409) {
            return {
                success: false,
                error: 'No se puede eliminar la categoría porque tiene contenido asociado',
                code: 'CATEGORY_HAS_CONTENT'
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Error al eliminar categoría',
            details: error.response?.data
        };
    }
};

export { deleteCategoryService };