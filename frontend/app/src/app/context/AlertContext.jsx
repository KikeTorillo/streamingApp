// ===== ALERT CONTEXT - GESTIÓN CENTRALIZADA DE ALERTS + TOASTS =====
// src/app/context/AlertContext.jsx

import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { AlertModal } from '../../components/molecules/AlertModal/AlertModal';
import { ToastContainer } from '../../components/molecules/ToastContainer/ToastContainer';
import { useAlert } from '../../hooks/useAlert';
import { useToast } from '../../hooks/useToast';

// ===== CONTEXTO =====
const AlertContext = createContext();

/**
 * AlertProvider - Proveedor del contexto de alerts y toasts
 * 
 * Centraliza toda la lógica de notificaciones:
 * - MODALES: Para confirmaciones que requieren decisión
 * - TOASTS: Para notificaciones de éxito/error/info
 * - API UNIFICADA: showDeleteConfirm() → Modal, showSuccess() → Toast
 * - RENDERIZADO: AlertModal + ToastContainer automáticos
 */
function AlertProvider({ children }) {
  const alertHook = useAlert();
  const toastHook = useToast();
  const { alertState, hideAlert } = alertHook;
  const { toasts, removeToast } = toastHook;

  // Combinar APIs de alert y toast en una sola interfaz
  const combinedValue = {
    // ===== API DE MODALES (para confirmaciones) =====
    ...alertHook,
    
    // ===== API DE TOASTS (para notificaciones) =====
    ...toastHook,
    
    // ===== OVERRIDE PARA USAR TOAST EN LUGAR DE MODAL =====
    // Estos métodos ahora usan Toast en lugar de Modal
    showSuccess: toastHook.showSuccess,
    showError: toastHook.showError,
    showInfo: toastHook.showInfo,
    showWarning: toastHook.showWarning,
    showSuccessWithRedirect: toastHook.showSuccessWithRedirect,
    showSuccessWithAction: toastHook.showSuccessWithAction,
    
    // Mantener showDeleteConfirm como Modal (requiere decisión)
    showDeleteConfirm: alertHook.showDeleteConfirm
  };

  return (
    <AlertContext.Provider value={combinedValue}>
      {children}
      
      {/* Modal para confirmaciones */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onConfirm={alertState.onConfirm}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        size={alertState.size}
      />
      
      {/* Toast container para notificaciones */}
      <ToastContainer
        toasts={toasts}
        position="top-right"
        onRemoveToast={removeToast}
      />
    </AlertContext.Provider>
  );
}

/**
 * Hook para usar el contexto de alerts
 */
function useAlertContext() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext debe usarse dentro de AlertProvider');
  }
  return context;
}

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { AlertProvider, useAlertContext };