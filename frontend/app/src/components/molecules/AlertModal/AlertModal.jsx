// ===== ALERT MODAL MOLECULE - MIGRADO AL SISTEMA ESTÁNDAR =====
// src/components/molecules/AlertModal/AlertModal.jsx

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../Modal/Modal';
import { Button } from '../../atoms/Button/Button';
import { validateStandardProps, STANDARD_PROP_TYPES } from '../../../tokens';
import { createStandardIconRenderer } from '../../../utils/iconHelpers';
import './AlertModal.css';

/**
 * AlertModal - Componente para confirmaciones y alertas críticas
 * 
 * ✅ SISTEMA ESTÁNDAR: Props estándar (size, variant, rounded, loading, disabled)
 * ✅ DESIGN TOKENS: Automáticos para spacing, colores, tipografía
 * ✅ SISTEMA DE ICONOS: Feather icons automáticos por variante
 * ✅ ACCESIBILIDAD: ARIA completo, navegación por teclado
 * ✅ CONFIRMACIONES: Para operaciones críticas (delete, permisos)
 * ✅ BACKWARD COMPATIBILITY: Mapeo automático de props legacy
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} [props.isOpen=false] - Si el modal está abierto
 * @param {function} [props.onClose] - Callback para cerrar el modal
 * @param {string} [props.type='info'] - Tipo de alerta (info, success, error, confirm, delete, permission)
 * @param {string} [props.title=''] - Título del modal
 * @param {string} [props.message=''] - Mensaje de la alerta
 * @param {function} [props.onConfirm] - Callback para confirmación
 * @param {string} [props.confirmText='Confirmar'] - Texto del botón confirmar
 * @param {string} [props.cancelText='Cancelar'] - Texto del botón cancelar
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='sm'] - Tamaño estándar
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant] - Variante semántica (auto por type)
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='xl'] - Radio de bordes
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.loading=false] - Estado de loading
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
function AlertModal(props) {
  // ✅ VALIDAR PROPS ESTÁNDAR - Muestra deprecation warnings automáticamente
  const validatedProps = validateStandardProps(props, 'AlertModal');

  const {
    // Props estándar del sistema
    size = 'sm',
    variant,
    rounded = 'xl',
    disabled = false,
    loading = false,
    className = '',
    
    // Control básico
    isOpen = false,
    onClose = null,
    
    // Tipo de alerta (determina variant automáticamente)
    type = 'info', // 'info', 'success', 'error', 'confirm', 'delete', 'permission'
    
    // Contenido
    title = '',
    message = '',
    
    // Confirmación (solo para type='confirm' o 'delete')
    onConfirm = null,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    
    // Configuración específica
    closeOnBackdrop = true,
    
    ...restProps
  } = validatedProps;
  
  // Función para renderizar iconos usando el sistema centralizado
  const renderIcon = createStandardIconRenderer('alert-modal', size);
  
  // ✅ CONFIGURACIÓN POR TIPO - Usando sistema de iconos Feather + variantes estándar
  const typeConfig = useMemo(() => ({
    info: {
      icon: 'info',
      variant: 'primary',
      defaultTitle: 'Información'
    },
    success: {
      icon: 'check-circle',
      variant: 'success', 
      defaultTitle: 'Éxito'
    },
    error: {
      icon: 'x-circle',
      variant: 'danger',
      defaultTitle: 'Error'
    },
    confirm: {
      icon: 'help-circle',
      variant: 'primary',
      defaultTitle: 'Confirmación'
    },
    delete: {
      icon: 'trash-2',
      variant: 'danger',
      defaultTitle: 'Eliminar'
    },
    permission: {
      icon: 'lock',
      variant: 'danger',
      defaultTitle: 'Permisos insuficientes'
    }
  }), []);
  
  const config = typeConfig[type] || typeConfig.info;
  
  // ✅ VARIANTE AUTOMÁTICA - Usa variant prop o auto por type
  const finalVariant = variant || config.variant;
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
  
  // ✅ CLASES CSS CON SISTEMA ESTÁNDAR
  const alertModalClasses = [
    'alert-modal',
    `alert-modal--${type}`,
    finalVariant !== 'primary' && `alert-modal--${finalVariant}`,
    disabled && 'alert-modal--disabled',
    loading && 'alert-modal--loading',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={modalTitle}
      size={size}
      variant={finalVariant}
      rounded={rounded}
      disabled={disabled}
      loading={loading}
      closeOnBackdrop={closeOnBackdrop}
      className={alertModalClasses}
      {...restProps}
    >
      <div className="alert-modal__content">
        {/* Icono y mensaje */}
        <div className="alert-modal__message">
          <div className="alert-modal__icon" role="img" aria-label={type}>
            {renderIcon(config.icon)}
          </div>
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
                size={size === 'xs' ? 'xs' : 'sm'}
                variant="outline"
                disabled={disabled || loading}
                onClick={handleCancel}
                className="alert-modal__button"
              >
                {cancelText}
              </Button>
              <Button
                size={size === 'xs' ? 'xs' : 'sm'}
                variant={finalVariant}
                disabled={disabled || loading}
                loading={loading}
                onClick={handleConfirm}
                className="alert-modal__button"
              >
                {confirmText}
              </Button>
            </>
          ) : (
            // Modo información: Solo OK
            <Button
              size={size === 'xs' ? 'xs' : 'sm'}
              variant={finalVariant}
              disabled={disabled || loading}
              loading={loading}
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

// ✅ PROPTYPES CON STANDARD_PROP_TYPES
AlertModal.propTypes = {
  // ✅ PROPS ESTÁNDAR DEL SISTEMA
  ...STANDARD_PROP_TYPES,
  
  // ✅ PROPS ESPECÍFICAS DE ALERT MODAL
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.oneOf(['info', 'success', 'error', 'confirm', 'delete', 'permission']),
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  closeOnBackdrop: PropTypes.bool
};

export { AlertModal };