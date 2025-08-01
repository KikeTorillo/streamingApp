// src/services/Auth/logoutService.js

import { environmentService } from "../environmentService";

/**
 * Servicio para cerrar sesión de usuarios
 * Limpia la sesión local y notifica al backend para limpiar cookies
 * @returns {Promise<Object>} Respuesta estructurada del logout
 */
const logoutService = async () => {
    try {

        // 1. Obtener configuración del entorno
        const { urlBackend, apiKey } = environmentService();
        
        // 2. Configurar headers de la solicitud
        const myHeaders = new Headers();
        myHeaders.append("api", apiKey);
        myHeaders.append("Content-Type", "application/json");

        // 3. Configuración completa de la solicitud
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            redirect: "follow",
            credentials: 'include' // Importante para enviar cookies
        };

        // 4. Intentar notificar al backend para limpiar cookies
        try {
            const response = await fetch(`${urlBackend}/api/v1/auth/logout`, requestOptions);
            const data = await response.json();
            
            if (data?.success) {
                // Logout exitoso
            } else {
                // Error en logout pero continuamos
            }
        } catch {
            // No bloqueamos el logout local si el backend falla
        }

        // 5. Limpiar datos de sesión local (SIEMPRE ejecutar)

        // Limpiar todos los posibles lugares donde se almacena info de sesión
        sessionStorage.removeItem('sessionUser');
        localStorage.removeItem('sessionUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // 6. Redirigir al login después de un pequeño delay
        setTimeout(() => {

            window.location.href = '/login';
        }, 500);

        return {
            success: true,
            message: 'Logout completado exitosamente'
        };

    } catch {
        // Aunque haya error, ejecutar logout local de emergencia

        sessionStorage.removeItem('sessionUser');
        localStorage.removeItem('sessionUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirigir de todas formas
        setTimeout(() => {
            window.location.href = '/login';
        }, 500);

        return {
            success: false,
            error: 'Error durante logout',
            message: 'Sesión cerrada localmente por seguridad'
        };
    }
};

export { logoutService };