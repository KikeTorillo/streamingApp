// src/components/molecules/FileInputField/FileInputField.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import './FileInputField.css';
import { FileInput, INTERACTIVE_PROP_TYPES, validateStandardPropsV2 } from '../../../../design-system';

/**
 * FileInputField - MOLÉCULA QUE EXTIENDE EL ÁTOMO FILEINPUT
 * Siguiendo exactamente el mismo patrón que TextInput
 * 
 * ✅ MIGRADO AL SISTEMA ESTÁNDAR - Enero 2025
 * ✅ ATOMIC DESIGN: Molécula que usa el átomo FileInput
 * ✅ CONSISTENCIA: Misma estructura que TextInput (label + campo + footer)
 * ✅ SISTEMA DE DISEÑO: Variables CSS del sistema + validateStandardProps
 * ✅ ACCESIBILIDAD: ARIA completo, labels asociados
 * ✅ BACKWARD COMPATIBILITY: Mapeo automático de variantes legacy
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.label] - Etiqueta del campo
 * @param {string} [props.helperText] - Texto de ayuda debajo del input
 * @param {string} [props.errorText] - Mensaje de error (sobrescribe helperText y variant)
 * @param {boolean} [props.required=false] - Si el campo es obligatorio
 * @param {boolean} [props.fullWidth=false] - Si ocupa todo el ancho disponible
 * @param {boolean} [props.compact=false] - Versión compacta con spacing reducido
 * @param {string} [props.className=''] - Clases CSS adicionales
 * 
 * // Props heredadas del átomo FileInput
 * @param {string} [props.id] - ID único para el input
 * @param {string} [props.name] - Nombre del campo para formularios
 * @param {string} [props.accept] - Tipos MIME permitidos
 * @param {boolean} [props.multiple=false] - Permite múltiples archivos
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del componente
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante estándar del sistema
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {string} [props.text='Seleccionar archivo'] - Texto del botón
 * @param {function} [props.onChange] - Handler cuando se selecciona archivo
 * @param {function} [props.onFocus] - Handler cuando obtiene foco
 * @param {function} [props.onBlur] - Handler cuando pierde foco
 */
function FileInputField(props) {
  // ✅ VALIDAR PROPS ESTÁNDAR - Sistema unificado con deprecation warnings
  const validatedProps = validateStandardPropsV2(props, 'FileInputField');
  
  const {
    // ✅ PROPS ESTÁNDAR DEL SISTEMA
    size = 'md',
    variant = 'primary',
    rounded = 'md',
    disabled = false,
    loading = false,
    className = '',
    leftIcon,
    rightIcon,
    
    // ✅ PROPS ESPECÍFICAS DE FILEINPUTFIELD
    label,
    helperText,
    errorText,
    required = false,
    fullWidth = false,
    compact = false,
    
    // Props heredadas del átomo FileInput
    id,
    name,
    accept,
    multiple = false,
    text = 'Seleccionar archivo',
    onChange = () => {},
    onFocus = () => {},
    onBlur = () => {},
    ariaLabel,
    ariaDescribedBy,
    ...rest
  } = validatedProps;
  // ⚠️ BACKWARD COMPATIBILITY WARNING
  if (props.variant === 'default' || props.variant === 'error') {
    console.warn(
      `FileInputField: Las variantes "default" y "error" están deprecadas.
      Migración sugerida:
      - variant="default" → variant="primary"  
      - variant="error" → variant="danger"
      
      Variantes estándar disponibles: primary, secondary, success, warning, danger, neutral`
    );
  }

  // Estados internos para manejo de focus (igual que TextInput)
  const [focused, setFocused] = useState(false);

  // Determinar el estado actual con mapeo de variantes legacy
  const hasError = Boolean(errorText);
  const mappedVariant = hasError ? 'danger' : (variant === 'default' ? 'primary' : variant === 'error' ? 'danger' : variant);
  const currentVariant = mappedVariant;

  // Generar IDs únicos si no se proporcionan
  const inputId = id || `file-input-field-${Math.random().toString(36).substring(2, 9)}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  /**
   * Manejador del evento onFocus
   */
  const handleFocus = (event) => {
    setFocused(true);
    onFocus(event);
  };

  /**
   * Manejador del evento onBlur
   */
  const handleBlur = (event) => {
    setFocused(false);
    onBlur(event);
  };

  // Construir clases CSS (siguiendo patrón TextInput)
  const wrapperClasses = [
    'file-input-field-wrapper',
    `file-input-field-wrapper--${size}`,
    `file-input-field-wrapper--${currentVariant}`,
    focused && 'file-input-field-wrapper--focused',
    disabled && 'file-input-field-wrapper--disabled',
    loading && 'file-input-field-wrapper--loading',
    hasError && 'file-input-field-wrapper--error',
    fullWidth && 'file-input-field-wrapper--full-width',
    compact && 'file-input-field-wrapper--compact',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {/* Label simple (sin icono, para evitar duplicación visual) */}
      {label && (
        <label 
          htmlFor={inputId} 
          className={`file-input-field__label ${required ? 'file-input-field__label--required' : ''}`}
        >
          {label}
        </label>
      )}

      {/* FileInput átomo - sin mensajes propios (los maneja la molécula) */}
      <FileInput
        id={inputId}
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        loading={loading}
        required={required}
        size={size}
        variant={currentVariant}
        rounded={rounded}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        text={text}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ariaLabel={ariaLabel || label}
        ariaDescribedBy={describedBy}
        // Sin helperText ni errorText para evitar duplicación
        helperText=""
        errorText=""
        {...rest}
      />

      {/* Footer con mensajes (igual que TextInput) */}
      <div className="file-input-field__footer">
        {/* Texto de ayuda */}
        {helperText && !hasError && (
          <div id={helperId} className="file-input-field__helper-text">
            {helperText}
          </div>
        )}

        {/* Mensaje de error */}
        {errorText && (
          <div id={errorId} className="file-input-field__error-text" role="alert">
            {errorText}
          </div>
        )}
      </div>
    </div>
  );
}

FileInputField.propTypes = {
  // Props específicas de la molécula
  label: PropTypes.string,
  helperText: PropTypes.string,
  errorText: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  compact: PropTypes.bool,
  
  // Props heredadas del átomo FileInput
  id: PropTypes.string,
  name: PropTypes.string,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  text: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  
  // Props estándar del sistema de diseño
  ...INTERACTIVE_PROP_TYPES,
  
  // Backward compatibility - variantes legacy (con deprecation warnings)
  variant: PropTypes.oneOf([
    // Nuevas variantes estándar
    'primary', 'secondary', 'success', 'warning', 'danger', 'neutral',
    // Variantes legacy (deprecadas)
    'default', 'error'
  ])
};

export { FileInputField };