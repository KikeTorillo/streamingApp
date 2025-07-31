// ===== USE SUCCESS REDIRECT HOOK - MODAL VERSION =====
// src/hooks/useSuccessRedirect.jsx

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlertContext } from '../app/context/AlertContext';

/**
 * useSuccessRedirect - Hook para mensajes de éxito homologados con modal auto-close
 * 
 * ✅ MODAL CONSISTENTE: Usa AlertModal igual que eliminaciones
 * ✅ AUTO-CLOSE: Modal se cierra automáticamente y redirige
 * ✅ REUTILIZABLE: Un solo hook para todas las páginas de creación
 * ✅ CONFIGURABLE: Permite personalizar mensaje y delay
 * ✅ PRINCIPIO KISS: Usa infraestructura existente (useAlert)
 * 
 * @param {string} redirectPath - Ruta a la que redirigir después del éxito
 * @param {number} delay - Tiempo en ms antes de redirigir (default: 3000)
 * @returns {Object} - { triggerSuccess }
 */
function useSuccessRedirect(redirectPath, delay = 3000) {
  const navigate = useNavigate();
  const { showSuccess } = useAlertContext();

  /**
   * Activa el modal de éxito y programa la redirección
   * @param {string} successMessage - Mensaje personalizado de éxito
   * @param {Object} options - Opciones adicionales
   */
  const triggerSuccess = useCallback((successMessage = '¡Operación exitosa!', options = {}) => {
    const finalDelay = options.delay || delay;
    const shouldRedirect = options.redirect !== false;

    // Mostrar modal de éxito con auto-close
    showSuccess(successMessage, {
      title: options.title || '¡Éxito!',
      size: options.size || 'sm',
      autoCloseDelay: finalDelay,
      onAutoClose: shouldRedirect ? () => {

        navigate(redirectPath);
      } : undefined
    });
  }, [showSuccess, navigate, redirectPath, delay]);

  return {
    // Función principal
    triggerSuccess
  };
}

export { useSuccessRedirect };