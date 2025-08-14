// ===== EDIT MODAL ORGANISM =====
// src/components/organisms/EditModal/EditModal.jsx

import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../molecules/Modal/Modal';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { Button } from '../../atoms/Button/Button';
import { useEditModalProps } from '../../../hooks/useStandardProps';
import { STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens';
import { createStandardIconRenderer } from '../../../utils/iconHelpers';
import './EditModal.css';

/**
 * EditModal - Organismo MIGRADO para editar campos de texto simples
 * 
 * ✅ SISTEMA DE DISEÑO: Usa componentes migrados (Modal, TextInput, Button)
 * ✅ PROPS ESTÁNDAR: size, variant, rounded, loading, disabled + hook useEditModalProps()
 * ✅ DESIGN TOKENS: Espaciado, colores y tipografía automáticos
 * ✅ SISTEMA ICONOS: Integración completa con renderIcon Feather
 * ✅ ESTADOS AVANZADOS: loading/disabled con overlays visuales
 * ✅ REUTILIZABLE: Para editar nombres, títulos, descripciones CRUD
 * ✅ VALIDATION: Maneja validación básica con iconos automáticos
 * ✅ ACCESIBILIDAD: ARIA completa + navegación teclado
 * ✅ BACKWARD COMPATIBILITY: 100% sin breaking changes
 * ✅ MOBILE-FIRST: Responsive con breakpoints automáticos
 * ✅ PERFORMANCE: Memoización automática y extractDOMProps
 */
function EditModal(props) {
  // ✅ HOOK ESPECIALIZADO - Props estándar + tokens automáticos
  const {
    // Props estándar del sistema
    size,
    variant,
    rounded,
    className,
    leftIcon,
    rightIcon,
    
    // Estados computados
    isDisabled,
    isLoading,
    
    // Control del modal (props específicas)
    isOpen = false,
    onClose = null,
    onSave = null,
    
    // Configuración del campo
    title = 'Editar',
    fieldLabel = 'Valor',
    fieldPlaceholder = 'Ingresa el valor',
    fieldType = 'text',
    
    // Valores
    initialValue = '',
    
    // Validación
    required = true,
    minLength = 1,
    maxLength = 255,
    pattern = null,
    
    // Estados heredados (para compatibilidad)
    error = null,
    
    // Textos de botones
    cancelText = 'Cancelar',
    saveText = 'Guardar',
    
    // Iconos legacy (mapeados automáticamente)
    icon = null,
    
    ...restProps
  } = useEditModalProps(props);
  
  // ✅ EXTRAER DOM PROPS - Solo pasar props válidas de DOM
  const domProps = extractDOMProps(restProps);
  
  // ✅ CREAR RENDERIZADOR DE ICONOS - Configurado para modal
  const renderIconHelper = createStandardIconRenderer('modal', size);
  
  // ✅ MAPEO ICONOS LEGACY - Compatibilidad automática
  const iconMappings = useMemo(() => {
    // Deprecation warning para prop icon legacy
    if (icon && import.meta.env?.MODE === 'development') {
      console.warn(
        `[EditModal] DEPRECATION WARNING: prop "icon='${icon}'" está obsoleta. ` +
        `Usa "leftIcon='${icon}'" en su lugar. ` +
        `Ver migración: https://docs.streaming-app.com/components/editmodal#migration`
      );
    }
    
    // Mapear icon legacy a leftIcon si no está definido
    const effectiveLeftIcon = leftIcon || icon;
    
    // Iconos automáticos por variante semántica
    const variantIcons = {
      primary: 'edit',
      secondary: 'edit',
      success: 'check-circle',
      warning: 'alert-triangle',
      danger: 'alert-circle',
      neutral: 'file-text'
    };
    
    return {
      leftIcon: effectiveLeftIcon || variantIcons[variant] || 'edit',
      rightIcon: rightIcon
    };
  }, [leftIcon, rightIcon, icon, variant]);

  // Estado local del valor
  const [value, setValue] = useState(initialValue);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationError, setValidationError] = useState(null);
  
  // Sincronizar valor inicial cuando cambie
  useEffect(() => {
    setValue(initialValue);
    setHasChanges(false);
    setValidationError(null);
  }, [initialValue]);
  
  // Detectar cambios
  useEffect(() => {
    setHasChanges(value !== initialValue);
  }, [value, initialValue]);
  
  // Limpiar al cerrar
  useEffect(() => {
    if (!isOpen) {
      setValue(initialValue);
      setHasChanges(false);
      setValidationError(null);
    }
  }, [isOpen, initialValue]);
  
  // Validar valor
  const validateValue = (inputValue) => {
    if (required && !inputValue.trim()) {
      return 'Este campo es obligatorio';
    }
    
    if (minLength && inputValue.length < minLength) {
      return `Mínimo ${minLength} caracteres`;
    }
    
    if (maxLength && inputValue.length > maxLength) {
      return `Máximo ${maxLength} caracteres`;
    }
    
    if (pattern && !new RegExp(pattern).test(inputValue)) {
      return 'Formato inválido';
    }
    
    return null;
  };
  
  // Manejar cambio de valor
  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    
    // Validar en tiempo real
    const error = validateValue(newValue);
    setValidationError(error);
  };
  
  // Manejar envío
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validar antes de enviar
    const error = validateValue(value);
    if (error) {
      setValidationError(error);
      return;
    }
    
    // Verificar si hay cambios
    if (!hasChanges) {
      handleClose();
      return;
    }
    
    // Llamar función de guardado
    if (onSave) {
      try {
        await onSave(value.trim());
      } catch {
        // El error se maneja en el componente padre
      }
    }
  };
  
  // Manejar cierre
  const handleClose = () => {
    if (hasChanges && !isLoading) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres cerrar? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }
    
    onClose?.();
  };
  
  // Generar ID único para accesibilidad
  const fieldId = `edit-field-${Date.now()}`;
  const errorId = `edit-error-${Date.now()}`;
  
  // Determinar si se puede guardar
  const canSave = hasChanges && !validationError && !isLoading;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size={size}
      variant={variant}
      rounded={rounded}
      disabled={isDisabled}
      loading={isLoading}
      className={className}
      closeOnBackdrop={!hasChanges && !isLoading}
      closeOnEscape={!hasChanges && !isLoading}
      aria-labelledby={fieldId}
      {...domProps}
    >
      <form onSubmit={handleSubmit} className={`edit-modal ${className}`}>
        {/* Overlay para estados loading/disabled */}
        {(isLoading || isDisabled) && (
          <div className="edit-modal__overlay">
            {isLoading && (
              <div className="edit-modal__overlay-content">
                {renderIconHelper('loader', 'lg')}
                <span>Guardando cambios...</span>
              </div>
            )}
          </div>
        )}
        
        {/* Campo de entrada */}
        <div className="edit-modal__field">
          <TextInput
            id={fieldId}
            label={fieldLabel}
            type={fieldType}
            value={value}
            onChange={handleChange}
            placeholder={fieldPlaceholder}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            pattern={pattern}
            size={size}
            variant={validationError ? 'danger' : variant}
            rounded={rounded}
            disabled={isDisabled || isLoading}
            loading={isLoading}
            error={validationError}
            leftIcon={iconMappings.leftIcon}
            rightIcon={iconMappings.rightIcon}
            aria-describedby={error ? errorId : undefined}
          />
          
          {/* Contador de caracteres */}
          {maxLength && (
            <div className="edit-modal__counter">
              {value.length}/{maxLength}
            </div>
          )}
        </div>
        
        {/* Error general */}
        {error && (
          <div className="edit-modal__error" id={errorId}>
            {renderIconHelper('alert-circle', 'sm')}
            <span className="edit-modal__error-message">{error}</span>
          </div>
        )}
        
        {/* Botones */}
        <div className="edit-modal__actions">
          <Button
            type="button"
            size={size}
            variant="secondary"
            rounded={rounded}
            onClick={handleClose}
            disabled={isLoading}
            leftIcon="x"
          >
            {cancelText}
          </Button>
          
          <Button
            type="submit"
            size={size}
            variant="primary"
            rounded={rounded}
            disabled={!canSave}
            loading={isLoading}
            leftIcon="save"
          >
            {saveText}
          </Button>
        </div>
        
        {/* Información de ayuda */}
        <div className="edit-modal__help">
          <p>
            {hasChanges ? (
              <>
                {renderIconHelper('edit', 'sm')}
                Tienes cambios sin guardar
              </>
            ) : (
              <>
                {renderIconHelper('info', 'sm')}
                Modifica el valor y presiona Guardar
              </>
            )}
          </p>
        </div>
      </form>
    </Modal>
  );
}

EditModal.propTypes = {
  // ===== PROPS ESTÁNDAR DEL SISTEMA =====
  ...STANDARD_PROP_TYPES,
  
  // ===== PROPS ESPECÍFICAS DE EDITMODAL =====
  // Control del modal
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  
  // Configuración del campo
  title: PropTypes.string,
  fieldLabel: PropTypes.string,
  fieldPlaceholder: PropTypes.string,
  fieldType: PropTypes.string,
  
  // Valores
  initialValue: PropTypes.string,
  
  // Validación
  required: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
  
  // Estados heredados (para compatibilidad)
  error: PropTypes.string,
  
  // Textos de botones
  cancelText: PropTypes.string,
  saveText: PropTypes.string,
  
  // Iconos legacy (mapeados automáticamente)
  icon: PropTypes.string
};

export { EditModal };