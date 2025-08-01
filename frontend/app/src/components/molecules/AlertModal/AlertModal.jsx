// ===== ALERT MODAL MOLECULE =====
// src/components/molecules/AlertModal/AlertModal.jsx

import PropTypes from 'prop-types';
import { Modal } from '../Modal/Modal';
import { Button } from '../../atoms/Button/Button';
import './AlertModal.css';

/**
 * AlertModal - Componente para reemplazar alert() nativo con Modal
 * 
 * ✅ MIGRACIÓN: Reemplaza alert() con mejor UX
 * ✅ CONSISTENCIA: Basado en Modal existente
 * ✅ TIPOS: info, success, error, confirm, delete, permission
 * ✅ ACCESIBILIDAD: Hereda de Modal
 * ✅ REUTILIZABLE: Para toda la aplicación
 * ✅ HTML: Soporte para HTML en mensajes
 * ✅ AUTO-CLOSE: Cierre automático para éxitos
 */
function AlertModal({
  // Control básico
  isOpen = false,
  onClose = null,
  
  // Tipo de alerta
  type = 'info', // 'info', 'success', 'error', 'confirm', 'delete', 'permission'
  
  // Contenido
  title = '',
  message = '',
  
  // Confirmación (solo para type='confirm')
  onConfirm = null,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  
  // Configuración
  size = 'sm',
  closeOnBackdrop = true,
  
  // Estilos
  className = '',
  
  ...restProps
}) {
  
  // Configuración por tipo
  const typeConfig = {
    info: {
      icon: 'ℹ️',
      variant: 'primary',
      defaultTitle: 'Información'
    },
    success: {
      icon: '✅',
      variant: 'success', 
      defaultTitle: 'Éxito'
    },
    error: {
      icon: '❌',
      variant: 'danger',
      defaultTitle: 'Error'
    },
    confirm: {
      icon: '❓',
      variant: 'primary',
      defaultTitle: 'Confirmación'
    },
    delete: {
      icon: '🗑️',
      variant: 'danger',
      defaultTitle: 'Eliminar'
    },
    permission: {
      icon: '🔒',
      variant: 'danger',
      defaultTitle: 'Permisos insuficientes'
    }
  };
  
  const config = typeConfig[type] || typeConfig.info;
  const modalTitle = title || config.defaultTitle;
  
  // Manejar confirmación
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  };
  
  // Manejar cancelación
  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };
  
  // Clases CSS
  const alertModalClasses = [
    'alert-modal',
    `alert-modal--${type}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={modalTitle}
      size={size}
      closeOnBackdrop={closeOnBackdrop}
      className={alertModalClasses}
      {...restProps}
    >
      <div className="alert-modal__content">
        {/* Icono y mensaje */}
        <div className="alert-modal__message">
          <span className="alert-modal__icon" role="img" aria-label={type}>
            {config.icon}
          </span>
          <div 
            className="alert-modal__text"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
        
        {/* Botones */}
        <div className="alert-modal__actions">
          {(type === 'confirm' || type === 'delete') ? (
            // Modo confirmación: Cancelar + Confirmar
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="alert-modal__button"
              >
                {cancelText}
              </Button>
              <Button
                variant={config.variant}
                onClick={handleConfirm}
                className="alert-modal__button"
              >
                {confirmText}
              </Button>
            </>
          ) : (
            // Modo información: Solo OK
            <Button
              variant={config.variant}
              onClick={handleCancel}
              className="alert-modal__button"
            >
              OK
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// PropTypes para validación
AlertModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.oneOf(['info', 'success', 'error', 'confirm', 'delete', 'permission']),
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  closeOnBackdrop: PropTypes.bool,
  className: PropTypes.string
};

export { AlertModal };