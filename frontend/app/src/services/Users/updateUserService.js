// ===== 5. UPDATE USER SERVICE CORREGIDO =====
// src/services/Users/updateUserService.js (REEMPLAZAR EL EXISTENTE)

import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Actualizar usuario - HOMOLOGADO
 * ✅ CORREGIDO: Agregar campos email, password y roleId para actualización
 */
const updateUserService = async (id, userData) => {
    const { urlBackend } = environmentService();
    
    // ✅ CORREGIDO: Incluir campos permitidos para actualización
    const updateData = {};
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.password) updateData.password = userData.password; // ✅ AGREGADO
    if (userData.roleId) updateData.roleId = userData.roleId;

    try {
        const response = await axios.patch(`${urlBackend}/api/v1/users/${id}`, 
            updateData,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );

        // ✅ MEJORADO: Respuesta estructurada
        return {
            success: true,
            data: response.data,
            message: 'Usuario actualizado exitosamente'
        };
    } catch (error) {

        // ✅ MEJORADO: Manejo específico de errores
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
                error: 'Usuario no encontrado',
                code: 'USER_NOT_FOUND'
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al actualizar usuario',
            details: error.response?.data
        };
    }
};

export { updateUserService };