// ===== MODAL MOLECULE BASE CON <dialog> =====
// src/components/molecules/Modal/Modal.jsx

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Typography, useInteractiveProps, INTERACTIVE_PROP_TYPES, extractDOMPropsV2 } from '../../index.js';
import './Modal.css';

/**
 * Modal - Componente base para modales usando <dialog>
 * 
 * ✅ SISTEMA DE DISEÑO: Molécula base reutilizable con sistema estándar
 * ✅ MODERN HTML: Usa <dialog> nativo para mejor accesibilidad
 * ✅ ACCESIBILIDAD: Focus trap, ESC key, aria automático
 * ✅ RESPONSIVE: Adaptable a diferentes tamaños
 * ✅ REUTILIZABLE: Base para ProgressModal, EditModal, etc.
 * ✅ CONSISTENTE: Props estándar (size, variant, rounded, loading)
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} [props.isOpen=false] - Si el modal está abierto
 * @param {function} [props.onClose] - Callback para cerrar el modal
 * @param {React.ReactNode} [props.children] - Contenido del modal
 * @param {string} [props.title] - Título del modal (opcional)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del modal
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante semántica
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='xl'] - Radio de bordes
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.loading=false] - Estado de loading
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {boolean} [props.closeOnBackdrop=true] - Cerrar al hacer clic en backdrop
 * @param {boolean} [props.closeOnEscape=true] - Cerrar con tecla ESC
 * @param {Object} [props.closeButton] - Configuración del botón de cierre
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.ariaLabelledBy] - ID del elemento que hace de label
 * @param {string} [props.ariaDescribedBy] - ID del elemento que describe el modal
 * @param {function} [props.onOpen] - Callback al abrir el modal
 * @param {function} [props.onClosed] - Callback al cerrar completamente el modal
 */
function Modal(props) {
  // ✅ SISTEMA V2
  const standardProps = useInteractiveProps(props, {
    componentName: 'Modal',
    defaultVariant: 'neutral',
    defaultSize: 'md'
  });

  const {
    // Props estándar del sistema
    size = 'md',
    variant = 'primary', 
    rounded = 'xl',
    disabled = false,
    loading = false,
    className = '',
    
    tokens,
    ...restProps
  } = standardProps;
  
  // ✅ PROPS ESPECÍFICAS DE MODAL - Extraer directamente de props originales
  const {
    // Control básico
    isOpen = false,
    onClose = null,
    
    // Contenido
    children,
    title = null,
    
    // Configuración específica de Modal
    closeOnBackdrop = true,
    closeOnEscape = true,
    closeButton = {},
    
    // Accesibilidad
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    
    // Callbacks
    onOpen = null,
    onClosed = null
  } = props;
  
  const dialogRef = useRef(null);
  
  // Configuración del botón de cierre con valores por defecto del sistema
  const closeButtonConfig = {
    size: size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'sm', // Botón más pequeño que el modal
    variant: 'secondary', // Usar variante del sistema en lugar de ghost
    rounded: 'full',
    iconOnly: true,
    ...closeButton
  };
  
  // Efecto para abrir/cerrar modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    if (isOpen) {
      if (!dialog.open) {
        // Si no tiene onClose, usar show() para permitir interacción de fondo
        // Si tiene onClose, usar showModal() para modal verdadero
        if (onClose) {
          dialog.showModal();
        } else {
          dialog.show();
        }
        onOpen?.();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen, onOpen, onClose]);
  
  // Manejar cierre del modal
  const handleClose = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (onClose) {
      onClose();
    }
    onClosed?.();
  };
  
  // Manejar clic en backdrop
  const handleBackdropClick = (event) => {
    if (closeOnBackdrop && onClose && event.target === event.currentTarget) {
      handleClose(event);
    }
  };
  
  // Manejar tecla ESC
  const handleKeyDown = (event) => {
    if (closeOnEscape && onClose && event.key === 'Escape') {
      handleClose(event);
    }
  };
  
  // Manejar evento nativo de cierre
  const handleDialogClose = (event) => {
    if (onClose) {
      handleClose(event);
    }
  };
  
  // Clases CSS con sistema estándar
  const modalClasses = [
    'modal',
    `modal--${size}`,
    variant !== 'primary' && `modal--${variant}`,
    rounded !== 'xl' && `modal--rounded-${rounded}`,
    disabled && 'modal--disabled',
    loading && 'modal--loading',
    onClose ? 'modal--closable' : 'modal--non-closable',
    className
  ].filter(Boolean).join(' ');
  
  // ✅ PATRÓN ESTÁNDAR MOLECULES V2.0 - Props DOM filtering
  // 1. Usar extractDOMPropsV2 como base (filtra props del sistema de diseño)
  // 2. Pasar solo restProps (ya excluye props específicas del Modal arriba)
  const domProps = extractDOMPropsV2(restProps);
  
  // ✅ RENDERIZADO SIEMPRE: El <dialog> debe estar siempre en el DOM para que el ref funcione
  // La visibilidad se controla via showModal()/close() en el useEffect
  
  return (
    <dialog
      ref={dialogRef}
      {...domProps}
      className={modalClasses}
      style={props.style}
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      {/* Contenido del modal */}
      <div className="modal__content">
        {/* Header opcional */}
        {title && (
          <div className="modal__header">
            <Typography 
              as="h2" 
              size="lg" 
              weight="semibold" 
              className="modal__title" 
              id={ariaLabelledBy}
            >
              {title}
            </Typography>
            {onClose && (
              <Button
                {...closeButtonConfig}
                onClick={handleClose}
                aria-label="Cerrar modal"
                className="modal__close"
                disabled={disabled || loading}
                leftIcon="x"
              />
            )}
          </div>
        )}
        
        {/* Spinner de loading si está en estado loading */}
        {loading && (
          <div className="modal__loading" aria-hidden="true">
            <div className="modal__loading-spinner">
              <Icon name="loader" spinning />
            </div>
            <div className="modal__loading-overlay" />
          </div>
        )}
        
        {/* Contenido principal */}
        <div className="modal__body">
          {children}
        </div>
      </div>
    </dialog>
  );
}

Modal.propTypes = {
  // ✅ PROPS ESTÁNDAR DEL SISTEMA
  ...INTERACTIVE_PROP_TYPES,
  
  // ✅ PROPS ESPECÍFICAS DE MODAL
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.string,
  closeOnBackdrop: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  closeButton: PropTypes.object,
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string,
  'aria-describedby': PropTypes.string,
  onOpen: PropTypes.func,
  onClosed: PropTypes.func
};

export { Modal };