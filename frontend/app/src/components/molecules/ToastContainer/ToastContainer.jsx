// ===== TOAST CONTAINER MOLECULE =====
// src/components/molecules/ToastContainer/ToastContainer.jsx

import PropTypes from 'prop-types';
import { Toast } from '../../atoms/Toast/Toast';
import './ToastContainer.css';

/**
 * ToastContainer - Contenedor para gestionar múltiples toasts
 * 
 * ✅ POSICIONAMIENTO: Maneja diferentes posiciones en pantalla
 * ✅ STACKING: Apila múltiples toasts correctamente
 * ✅ GESTIÓN: Controla límite máximo de toasts
 * ✅ ANIMACIONES: Coordina animaciones entre toasts
 * ✅ RESPONSIVE: Adaptable a diferentes tamaños de pantalla
 */
function ToastContainer({
  // Lista de toasts
  toasts = [],
  
  // Posición global
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  
  // Configuración
  maxToasts = 5,
  gap = 'md', // 'sm', 'md', 'lg'
  
  // Eventos
  onRemoveToast = null,
  
  // Estilos
  className = '',
  
  ...restProps
}) {
  
  // Limitar número de toasts
  const visibleToasts = toasts.slice(0, maxToasts);
  
  // Calcular offset para cada toast
  const getToastOffset = (index) => {
    const gapSize = {
      sm: 8,
      md: 12,
      lg: 16
    }[gap];
    
    return index * (80 + gapSize); // Altura aproximada del toast + gap
  };
  
  // Manejar cierre de toast
  const handleRemoveToast = (toastId) => {
    if (onRemoveToast) {
      onRemoveToast(toastId);
    }
  };
  
  // Clases CSS
  const containerClasses = [
    'toast-container',
    `toast-container--${position}`,
    `toast-container--gap-${gap}`,
    className
  ].filter(Boolean).join(' ');
  
  // No renderizar si no hay toasts
  if (visibleToasts.length === 0) {
    return null;
  }
  
  return (
    <div 
      className={containerClasses}
      role="region"
      aria-label="Notificaciones"
      {...restProps}
    >
      {visibleToasts.map((toast, index) => {
        // Calcular posición del toast
        const offset = getToastOffset(index);
        const isBottom = position.includes('bottom');
        const offsetProperty = isBottom ? 'bottom' : 'top';
        
        return (
          <div
            key={toast.id}
            className="toast-container__item"
            style={{
              [offsetProperty]: `${offset}px`,
              zIndex: 9999 - index // Los más nuevos arriba
            }}
          >
            <Toast
              isOpen={toast.isOpen}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              position={position}
              autoClose={toast.autoClose}
              autoCloseDelay={toast.autoCloseDelay}
              action={toast.action}
              showCloseButton={toast.showCloseButton}
              onClose={() => handleRemoveToast(toast.id)}
              onAutoClose={toast.onAutoClose}
            />
          </div>
        );
      })}
    </div>
  );
}

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isOpen: PropTypes.bool,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    title: PropTypes.string,
    message: PropTypes.string,
    autoClose: PropTypes.bool,
    autoCloseDelay: PropTypes.number,
    action: PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    }),
    showCloseButton: PropTypes.bool,
    onAutoClose: PropTypes.func
  })),
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
  maxToasts: PropTypes.number,
  gap: PropTypes.oneOf(['sm', 'md', 'lg']),
  onRemoveToast: PropTypes.func,
  className: PropTypes.string
};

export { ToastContainer };