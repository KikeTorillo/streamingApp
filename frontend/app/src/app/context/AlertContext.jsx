// ===== ALERT CONTEXT - GESTIÓN CENTRALIZADA DE ALERTS =====
// src/app/context/AlertContext.jsx

import { createContext, useContext } from 'react';
import { AlertModal } from '../../components/molecules/AlertModal/AlertModal';
import { useAlert } from '../../hooks/useAlert';

// ===== CONTEXTO =====
const AlertContext = createContext();

/**
 * AlertProvider - Proveedor del contexto de alerts
 * 
 * Centraliza toda la lógica de alerts:
 * - Estado de modales de confirmación
 * - Funciones showAlert, showConfirm, showSuccess, showError
 * - Renderizado automático del AlertModal
 * - Reemplazo de alert() y confirm() nativos
 */
function AlertProvider({ children }) {
  const alertHook = useAlert();
  const { alertState, hideAlert } = alertHook;

  return (
    <AlertContext.Provider value={alertHook}>
      {children}
      
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

export { AlertProvider, useAlertContext };