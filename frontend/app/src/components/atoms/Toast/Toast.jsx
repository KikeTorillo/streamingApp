// ===== TOAST ATOM =====
// src/components/atoms/Toast/Toast.jsx

import { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import './Toast.css';

/**
 * Toast - Componente de notificación flotante
 * 
 * ✅ DESIGN SYSTEM: Consistente con Modal, Button, Badge
 * ✅ TIPOS: success, error, info, warning
 * ✅ AUTO-DISMISS: Desaparece automáticamente
 * ✅ ACCIONES: Botón opcional para acciones
 * ✅ ANIMACIONES: Entrada y salida suaves
 * ✅ POSICIONAMIENTO: Fixed, no afecta layout
 * ✅ ACCESIBILIDAD: ARIA roles y labels
 */
function Toast({
  // Control básico
  isOpen = false,
  onClose = null,
  
  // Tipo de toast
  type = 'info', // 'success', 'error', 'info', 'warning'
  
  // Contenido
  title = '',
  message = '',
  
  // Auto-dismiss
  autoClose = true,
  autoCloseDelay = 4000,
  onAutoClose = null,
  
  // Acción opcional
  action = null, // { text: 'Ver', onClick: () => {} }
  
  // Configuración
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  showCloseButton = true,
  
  // Estilos
  className = '',
  
  ...restProps
}) {
  
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Configuración por tipo
  const typeConfig = {
    success: {
      icon: '✅',
      iconClass: 'toast__icon--success',
      containerClass: 'toast--success'
    },
    error: {
      icon: '❌', 
      iconClass: 'toast__icon--error',
      containerClass: 'toast--error'
    },
    info: {
      icon: 'ℹ️',
      iconClass: 'toast__icon--info', 
      containerClass: 'toast--info'
    },
    warning: {
      icon: '⚠️',
      iconClass: 'toast__icon--warning',
      containerClass: 'toast--warning'
    }
  };
  
  const config = typeConfig[type] || typeConfig.info;
  
  // Manejar cierre con animación
  const handleClose = () => {
    setIsAnimating(false);
    
    // Esperar a que termine la animación antes de ocultar
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
      if (onAutoClose) {
        onAutoClose();
      }
    }, 300); // Duración de la animación CSS
  };

  // Manejar apertura y animaciones
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Pequeño delay para triggear la animación de entrada
      setTimeout(() => setIsAnimating(true), 10);
      
      // Auto-close
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      handleClose();
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose, onAutoClose]);
  
  // Manejar acción
  const handleAction = () => {
    if (action && action.onClick) {
      action.onClick();
    }
    handleClose();
  };
  
  // No renderizar si no está visible
  if (!isVisible) {
    return null;
  }
  
  // Clases CSS
  const toastClasses = [
    'toast',
    config.containerClass,
    `toast--${position}`,
    isAnimating ? 'toast--visible' : 'toast--hidden',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={toastClasses}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      {...restProps}
    >
      <div className="toast__content">
        {/* Icono */}
        <div className={`toast__icon ${config.iconClass}`}>
          <span role="img" aria-label={type}>
            {config.icon}
          </span>
        </div>
        
        {/* Mensaje */}
        <div className="toast__message">
          {title && (
            <div className="toast__title">
              {title}
            </div>
          )}
          <div className="toast__text">
            {message}
          </div>
        </div>
        
        {/* Acciones */}
        <div className="toast__actions">
          {action && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleAction}
              className="toast__action-button"
            >
              {action.text}
            </Button>
          )}
          
          {showCloseButton && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClose}
              className="toast__close-button"
              leftIcon="✕"
              aria-label="Cerrar notificación"
            />
          )}
        </div>
      </div>
      
      {/* Barra de progreso para auto-close */}
      {autoClose && (
        <div 
          className="toast__progress"
          style={{
            animationDuration: `${autoCloseDelay}ms`
          }}
        />
      )}
    </div>
  );
}

export { Toast };