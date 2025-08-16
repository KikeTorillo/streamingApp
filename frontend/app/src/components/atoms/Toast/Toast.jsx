// ===== TOAST ATOM =====
// src/components/atoms/Toast/Toast.jsx

import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button/Button';
import { useToastProps } from '../../../hooks/useStandardProps';
import { STANDARD_PROP_TYPES } from '../../../tokens/standardProps';
import './Toast.css';

/**
 * Toast - Componente de notificación flotante
 * 
 * ✅ DESIGN SYSTEM: Consistente con sistema estándar
 * ✅ VARIANTES SEMÁNTICAS: 6 variantes estándar del sistema
 * ✅ AUTO-DISMISS: Desaparece automáticamente
 * ✅ ACCIONES: Botón opcional para acciones
 * ✅ ANIMACIONES: Entrada y salida suaves
 * ✅ POSICIONAMIENTO: Fixed, no afecta layout
 * ✅ ACCESIBILIDAD: ARIA roles y labels
 * ✅ ICONOS AUTOMÁTICOS: Iconos Feather integrados por variante
 */
function Toast({
  // Control básico
  isOpen = false,
  onClose = null,
  
  // Contenido
  title = '',
  message = '',
  
  // Auto-dismiss
  autoClose = true,
  autoCloseDelay = 4000,
  onAutoClose = null,
  
  // Acción opcional
  action = null, // { text: 'Ver', onClick: () => {} }
  
  // Configuración específica Toast
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  showCloseButton = true,
  
  // Props legacy para backward compatibility
  type = null, // DEPRECATED: usar variant
  
  ...restProps
}) {
  // Integrar sistema estándar
  const standardProps = useToastProps(restProps);
  const {
    size,
    variant: propVariant,
    rounded,
    disabled,
    loading,
    className,
    renderIcon,
    tokens
  } = standardProps;
  
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Mapeo backward compatibility: type → variant
  const finalVariant = type ? mapLegacyTypeToVariant(type) : propVariant;
  
  // Configuración por variante semántica estándar
  const variantConfig = {
    primary: {
      icon: 'info',
      iconClass: 'toast__icon--primary',
      containerClass: 'toast--primary'
    },
    success: {
      icon: 'check-circle',
      iconClass: 'toast__icon--success',
      containerClass: 'toast--success'
    },
    danger: {
      icon: 'x-circle', 
      iconClass: 'toast__icon--danger',
      containerClass: 'toast--danger'
    },
    warning: {
      icon: 'alert-triangle',
      iconClass: 'toast__icon--warning',
      containerClass: 'toast--warning'
    },
    neutral: {
      icon: 'info',
      iconClass: 'toast__icon--neutral',
      containerClass: 'toast--neutral'
    },
    secondary: {
      icon: 'alert-circle',
      iconClass: 'toast__icon--secondary',
      containerClass: 'toast--secondary'
    }
  };
  
  const config = variantConfig[finalVariant] || variantConfig.primary;
  
  // Manejar cierre con animación
  const handleClose = useCallback(() => {
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
  }, [onClose, onAutoClose]);

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
  }, [isOpen, autoClose, autoCloseDelay, handleClose]);
  
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
  
  // Clases CSS con sistema estándar
  const toastClasses = [
    'toast',
    config.containerClass,
    `toast--${position}`,
    `toast--size-${size}`,
    `toast--rounded-${rounded}`,
    isAnimating ? 'toast--visible' : 'toast--hidden',
    disabled && 'toast--disabled',
    loading && 'toast--loading',
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
        {/* Icono usando sistema estándar */}
        <div className={`toast__icon ${config.iconClass}`}>
          {renderIcon(config.icon, getIconSize(size), undefined, {
            'aria-label': finalVariant
          })}
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
              variant="neutral"
              size="xs"
              onClick={handleAction}
              className="toast__action-button"
            >
              {action.text}
            </Button>
          )}
          
          {showCloseButton && (
            <Button
              variant="neutral"
              size="xs"
              onClick={handleClose}
              className="toast__close-button"
              leftIcon="x"
              aria-label="Cerrar notificación"
            />
          )}
        </div>
      </div>
      
      {/* Barra de progreso para auto-close */}
      {autoClose && !disabled && (
        <div 
          className="toast__progress"
          style={{
            animationDuration: `${autoCloseDelay}ms`,
            backgroundColor: tokens.variant.color
          }}
        />
      )}
    </div>
  );
}

// ===== HELPER FUNCTIONS =====

/**
 * Mapear props legacy type a variant estándar
 */
function mapLegacyTypeToVariant(type) {
  const typeToVariantMap = {
    'success': 'success',
    'error': 'danger',
    'info': 'primary', 
    'warning': 'warning'
  };
  
  const mappedVariant = typeToVariantMap[type] || 'primary';
  
  // Deprecation warning en desarrollo
  if (typeof window !== 'undefined' && window.process?.env?.NODE_ENV === 'development') {
    console.warn(
      `Toast: La prop "type=${type}" está deprecada. ` +
      `Usar "variant=${mappedVariant}" en su lugar.`
    );
  }
  
  return mappedVariant;
}

/**
 * Obtener tamaño de icono basado en tamaño del toast
 */
function getIconSize(size) {
  const sizeMap = {
    'xs': 'xs',
    'sm': 'xs', 
    'md': 'sm',
    'lg': 'md',
    'xl': 'lg'
  };
  return sizeMap[size] || 'sm';
}

Toast.propTypes = {
  // Props estándar del sistema
  ...STANDARD_PROP_TYPES,
  
  // Props específicas de Toast
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  autoClose: PropTypes.bool,
  autoCloseDelay: PropTypes.number,
  onAutoClose: PropTypes.func,
  action: PropTypes.shape({
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
  showCloseButton: PropTypes.bool,
  
  // Props legacy (deprecated)
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning'])
};

export { Toast };
export default Toast;