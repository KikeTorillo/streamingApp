// ===== USE TOAST HOOK =====
// src/hooks/useToast.jsx

import { useState, useCallback } from 'react';

/**
 * useToast - Hook para gestionar toasts
 * 
 * ✅ ESTADO: Gestiona lista de toasts activos
 * ✅ API SIMPLE: showToast(), removeToast(), clearToasts()
 * ✅ AUTO-CLEANUP: Limpia toasts automáticamente
 * ✅ UNIQUE IDS: Genera IDs únicos para cada toast
 * ✅ QUEUE: Maneja cola de toasts
 * 
 * @returns {Object} - { toasts, showToast, removeToast, clearToasts }
 */
function useToast() {
  const [toasts, setToasts] = useState([]);
  
  // Generar ID único para toast
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);
  
  // Mostrar nuevo toast
  const showToast = useCallback((options) => {
    const toastId = generateId();
    
    const newToast = {
      id: toastId,
      isOpen: true,
      type: options.type || 'info',
      title: options.title || '',
      message: options.message || '',
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      autoCloseDelay: options.autoCloseDelay || 4000,
      action: options.action || null,
      showCloseButton: options.showCloseButton !== undefined ? options.showCloseButton : true,
      onAutoClose: options.onAutoClose || null,
      createdAt: Date.now()
    };

    setToasts(prevToasts => {
      // Agregar nuevo toast al inicio de la lista
      const updatedToasts = [newToast, ...prevToasts];
      
      // Limitar máximo de toasts (mantener los 5 más recientes)
      if (updatedToasts.length > 5) {

        return updatedToasts.slice(0, 5);
      }
      
      return updatedToasts;
    });
    
    return toastId;
  }, [generateId]);
  
  // Remover toast específico
  const removeToast = useCallback((toastId) => {

    setToasts(prevToasts => {
      return prevToasts.filter(toast => toast.id !== toastId);
    });
  }, []);
  
  // Limpiar todos los toasts
  const clearToasts = useCallback(() => {

    setToasts([]);
  }, []);
  
  // Métodos de conveniencia para diferentes tipos
  const showSuccess = useCallback((message, options = {}) => {
    return showToast({
      type: 'success',
      message,
      autoClose: true,
      autoCloseDelay: 3000, // Success más rápido
      ...options
    });
  }, [showToast]);
  
  const showError = useCallback((message, options = {}) => {
    return showToast({
      type: 'error',
      message,
      autoClose: false, // Errores requieren atención manual
      ...options
    });
  }, [showToast]);
  
  const showInfo = useCallback((message, options = {}) => {
    return showToast({
      type: 'info',
      message,
      autoClose: true,
      autoCloseDelay: 4000,
      ...options
    });
  }, [showToast]);
  
  const showWarning = useCallback((message, options = {}) => {
    return showToast({
      type: 'warning',
      message,
      autoClose: true,
      autoCloseDelay: 5000, // Warnings necesitan más tiempo
      ...options
    });
  }, [showToast]);
  
  // Toast con acción (ej: redirección)
  const showSuccessWithAction = useCallback((message, actionText, actionCallback, options = {}) => {
    return showToast({
      type: 'success',
      message,
      action: {
        text: actionText,
        onClick: actionCallback
      },
      autoClose: false, // Con acción, mejor manual
      ...options
    });
  }, [showToast]);
  
  // Toast con redirección automática  
  const showSuccessWithRedirect = useCallback((message, onRedirect, options = {}) => {
    return showToast({
      type: 'success',
      message,
      autoClose: true,
      autoCloseDelay: options.redirectDelay || 2500,
      onAutoClose: onRedirect,
      ...options
    });
  }, [showToast]);
  
  return {
    // Estado
    toasts,
    
    // Métodos principales
    showToast,
    removeToast,
    clearToasts,
    
    // Métodos de conveniencia
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showSuccessWithAction,
    showSuccessWithRedirect
  };
}

export { useToast };