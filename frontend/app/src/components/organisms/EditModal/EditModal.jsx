// ===== EDIT MODAL ORGANISM =====
// src/components/organisms/EditModal/EditModal.jsx

import { useState, useEffect } from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { Button } from '../../atoms/Button/Button';
import './EditModal.css';

/**
 * EditModal - Organismo para editar campos de texto simples
 * 
 * ✅ SISTEMA DE DISEÑO: Usa Modal + TextInput + Button
 * ✅ REUTILIZABLE: Para editar nombres, títulos, descripciones
 * ✅ VALIDATION: Maneja validación básica
 * ✅ LOADING: Estados de carga durante la edición
 * ✅ ACCESIBILIDAD: Heredada del Modal base
 */
function EditModal({
  // Control del modal
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
  currentValue = '',
  
  // Validación
  required = true,
  minLength = 1,
  maxLength = 255,
  pattern = null,
  
  // Estados
  loading = false,
  error = null,
  
  // Textos de botones
  cancelText = 'Cancelar',
  saveText = 'Guardar',
  
  // Configuración del modal
  size = 'md',
  
  // Iconos
  icon = null,
  
  ...restProps
}) {
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
      } catch (err) {
        // El error se maneja en el componente padre

      }
    }
  };
  
  // Manejar cierre
  const handleClose = () => {
    if (hasChanges && !loading) {
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
  const canSave = hasChanges && !validationError && !loading;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size={size}
      closeOnBackdrop={!hasChanges && !loading}
      closeOnEscape={!hasChanges && !loading}
      aria-labelledby={fieldId}
      {...restProps}
    >
      <form onSubmit={handleSubmit} className="edit-modal">
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
            disabled={loading}
            error={validationError}
            leftIcon={icon}
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
            <span className="edit-modal__error-icon">⚠️</span>
            <span className="edit-modal__error-message">{error}</span>
          </div>
        )}
        
        {/* Botones */}
        <div className="edit-modal__actions">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={!canSave}
            loading={loading}
          >
            {saveText}
          </Button>
        </div>
        
        {/* Información de ayuda */}
        <div className="edit-modal__help">
          <p>
            {hasChanges ? (
              <>
                <span className="edit-modal__help-icon">📝</span>
                Tienes cambios sin guardar
              </>
            ) : (
              <>
                <span className="edit-modal__help-icon">💡</span>
                Modifica el valor y presiona Guardar
              </>
            )}
          </p>
        </div>
      </form>
    </Modal>
  );
}

export { EditModal };