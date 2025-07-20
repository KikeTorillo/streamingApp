// hooks/useAlert.jsx
import { useState, useCallback } from 'react';

/**
 * useAlert - Hook para manejo simple de modales de alerta
 * 
 * ✅ MIGRACIÓN: Reemplaza alert() con Modal
 * ✅ API SIMPLE: showAlert(), showConfirm()
 * ✅ CONSISTENCIA: Usa AlertModal del sistema
 * ✅ ESTADO: Maneja automáticamente isOpen
 * 
 * @returns {Object} - { showAlert, showConfirm, hideAlert, alertState, AlertComponent }
 */
const useAlert = () => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    size: 'sm',
    autoClose: false,
    autoCloseDelay: 3000
  });

  // Cerrar alert
  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Mostrar alert simple (info, success, error)
  const showAlert = useCallback((message, type = 'info', options = {}) => {
    const config = {
      isOpen: true,
      type,
      message,
      title: options.title || '',
      size: options.size || 'sm',
      autoClose: type === 'success' || options.autoClose,
      autoCloseDelay: options.autoCloseDelay || 3000,
      onConfirm: null
    };

    setAlertState(config);

    // Auto close para mensajes de éxito
    if (config.autoClose) {
      setTimeout(() => {
        hideAlert();
      }, config.autoCloseDelay);
    }
  }, [hideAlert]);

  // Mostrar confirmación
  const showConfirm = useCallback((message, onConfirm, options = {}) => {
    const config = {
      isOpen: true,
      type: 'confirm',
      message,
      title: options.title || '',
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      size: options.size || 'sm',
      autoClose: false,
      onConfirm: () => {
        onConfirm();
        hideAlert();
      }
    };

    setAlertState(config);
  }, [hideAlert]);

  // Métodos de conveniencia
  const showSuccess = useCallback((message, options) => {
    showAlert(message, 'success', options);
  }, [showAlert]);

  const showError = useCallback((message, options) => {
    showAlert(message, 'error', options);
  }, [showAlert]);

  const showInfo = useCallback((message, options) => {
    showAlert(message, 'info', options);
  }, [showAlert]);

  // Confirmaciones específicas
  const showDeleteConfirm = useCallback((itemName, onConfirm, options = {}) => {
    const message = `¿Estás seguro de que deseas eliminar "${itemName}"?`;
    const confirmOptions = {
      title: 'Confirmar eliminación',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      ...options
    };
    showConfirm(message, onConfirm, confirmOptions);
  }, [showConfirm]);

  const showPermissionError = useCallback((message = 'No tienes permisos para realizar esta acción', options) => {
    showError(message, { title: 'Permisos insuficientes', ...options });
  }, [showError]);

  return {
    // Estado
    alertState,
    
    // Métodos principales
    showAlert,
    showConfirm,
    hideAlert,
    
    // Métodos de conveniencia
    showSuccess,
    showError,
    showInfo,
    showDeleteConfirm,
    showPermissionError,
    
    // Alias para compatibilidad
    isOpen: alertState.isOpen
  };
};

export { useAlert };