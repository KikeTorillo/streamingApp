// ===== MODAL MOLECULE BASE CON <dialog> =====
// src/components/molecules/Modal/Modal.jsx

import { useEffect, useRef } from 'react';
import './Modal.css';

/**
 * Modal - Componente base para modales usando <dialog>
 * 
 * ✅ SISTEMA DE DISEÑO: Molécula base reutilizable
 * ✅ MODERN HTML: Usa <dialog> nativo para mejor accesibilidad
 * ✅ ACCESIBILIDAD: Focus trap, ESC key, aria automático
 * ✅ RESPONSIVE: Adaptable a diferentes tamaños
 * ✅ REUTILIZABLE: Base para ProgressModal, EditModal, etc.
 */
function Modal({
  // Control básico
  isOpen = false,
  onClose = null,
  
  // Contenido
  children,
  title = null,
  
  // Configuración
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  backdrop = true, // Mostrar backdrop
  closeOnBackdrop = true, // Cerrar al hacer clic en backdrop
  closeOnEscape = true, // Cerrar con tecla ESC
  
  // Estilos
  className = '',
  
  // Accesibilidad
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  
  // Callbacks
  onOpen = null,
  onClosed = null,
  
  ...restProps
}) {
  const dialogRef = useRef(null);
  
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
  
  // Clases CSS
  const modalClasses = [
    'modal',
    `modal--${size}`,
    onClose ? 'modal--closable' : 'modal--non-closable',
    className
  ].filter(Boolean).join(' ');
  
  // ✅ RENDERIZADO CONDICIONAL: Solo renderizar el <dialog> cuando isOpen es true
  // Esto evita problemas con el elemento <dialog> que puede interferir con otros controles
  if (!isOpen) {
    return null;
  }
  
  return (
    <dialog
      ref={dialogRef}
      className={modalClasses}
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      {...restProps}
    >
      {/* Contenido del modal */}
      <div className="modal__content">
        {/* Header opcional */}
        {title && (
          <div className="modal__header">
            <h2 className="modal__title" id={ariaLabelledBy}>
              {title}
            </h2>
            {onClose && (
              <button
                type="button"
                className="modal__close"
                onClick={handleClose}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            )}
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

export { Modal };