// molecules/TextInput.jsx - MIGRADO AL SISTEMA ESTÁNDAR
import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './TextInput.css';
import { Input } from '../../atoms/Input/Input';
import { validateStandardProps, STANDARD_PROP_TYPES } from '../../../tokens';

/**
 * TextInput - Molécula del sistema de diseño que extiende el átomo Input
 * 
 * ✅ MIGRADO AL SISTEMA ESTÁNDAR - Enero 2025
 * 
 * ARQUITECTURA:
 * ✅ Usa Input (átomo) del sistema estándar como base
 * ✅ Props estándar: size, variant, rounded, disabled, loading
 * ✅ Validación automática con validateStandardProps
 * ✅ STANDARD_PROP_TYPES integrado
 * ✅ Backward compatibility con deprecation warnings
 * 
 * FUNCIONALIDADES EXTENDIDAS:
 * ✅ Label integrado con requiredness visual
 * ✅ Helper text y error messages con ARIA
 * ✅ Character counter con límites visuales
 * ✅ Footer organizado con mensajes
 * ✅ Wrapper completo para formularios
 * ✅ Estados focus avanzados
 * 
 * @param {Object} props - Props del componente
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño estándar del sistema
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante estándar
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes estándar
 * @param {boolean} [props.disabled=false] - Estado deshabilitado estándar
 * @param {boolean} [props.loading=false] - Estado loading estándar
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo (sistema estándar)
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho (sistema estándar)
 * @param {string} [props.label] - Etiqueta del campo
 * @param {string} [props.helperText] - Texto de ayuda debajo del input
 * @param {string} [props.errorText] - Mensaje de error (prioridad sobre helperText)
 * @param {boolean} [props.showCharCount=false] - Mostrar contador de caracteres
 * @param {React.Ref} ref - Referencia al elemento input
 */
const TextInput = forwardRef((props, ref) => {
  // ✅ VALIDAR PROPS ESTÁNDAR - Sistema unificado con deprecation warnings
  const validatedProps = validateStandardProps(props, 'TextInput');
  
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
    
    // ✅ PROPS ESPECÍFICAS DE TEXTINPUT
    label,
    helperText,
    errorText,
    showCharCount = false,
    
    // Props básicas del input
    placeholder = '',
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    type = 'text',
    name,
    id,
    readOnly = false,
    required = false,
    autoFocus = false,
    width = 'auto',    // ✅ HOMOLOGACIÓN: Nueva prop estándar del sistema
    compact = false,
    onRightIconClick,
    onLeftIconClick,
    maxLength,
    minLength,
    pattern,
    autoComplete,
    ariaLabel,
    ariaDescribedBy,
    ariaErrorMessage,
    ...restProps
  } = validatedProps;

  // ⚠️ BACKWARD COMPATIBILITY WARNING
  if (props.variant === 'default' || props.variant === 'error') {
    console.warn(
      `TextInput: Las variantes "default" y "error" están deprecadas.
      Migración sugerida:
      - variant="default" → variant="primary"  
      - variant="error" → variant="danger"
      
      Variantes estándar disponibles: primary, secondary, success, warning, danger, neutral`
    );
  }

  // Estado interno para manejar focus
  const [isFocused, setIsFocused] = useState(false);
  
  // Determinar variante basada en error (error tiene prioridad sobre variant estándar)
  const currentVariant = errorText ? 'danger' : variant;
  
  // ✅ CONSTRUIR CLASES CSS DINÁMICAS - Sistema estándar
  const wrapperClasses = [
    'text-input-wrapper',
    `text-input-wrapper--${size}`,
    currentVariant !== 'primary' && `text-input-wrapper--${currentVariant}`,
    rounded !== 'md' && `text-input-wrapper--rounded-${rounded}`,
    width !== 'auto' && `text-input-wrapper--width-${width}`, // ✅ HOMOLOGACIÓN: width como sistema estándar
    isFocused && 'text-input-wrapper--focused',
    disabled && 'text-input-wrapper--disabled',
    loading && 'text-input-wrapper--loading',
    compact && 'text-input-wrapper--compact',
    className
  ].filter(Boolean).join(' ');

  // Clases adicionales para el Input del átomo (será manejado internamente por Input)
  const inputAdditionalClasses = [
    'text-input__input', // Clase específica para styling molecular
    leftIcon && 'text-input--with-left-icon',
    rightIcon && 'text-input--with-right-icon'
  ].filter(Boolean).join(' ');

  // Handlers de eventos
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // ✅ Los iconos serán manejados internamente por el Input del sistema estándar
  // No necesitamos renderIcon aquí, Input ya lo maneja con iconHelpers.js

  // IDs únicos para accesibilidad
  const inputId = id || name || `text-input-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9)}`;
  const helperTextId = helperText ? `${inputId}-helper` : undefined;
  const errorTextId = errorText ? `${inputId}-error` : undefined;
  
  // Construir aria-describedby
  const describedByIds = [
    ariaDescribedBy,
    helperTextId,
    errorTextId
  ].filter(Boolean);

  // Calcular datos del contador de caracteres
  const currentLength = value?.length || 0;
  const isNearLimit = maxLength && currentLength > maxLength * 0.8;
  const isAtLimit = maxLength && currentLength >= maxLength;

  // ✅ PROPS PARA INPUT DEL SISTEMA ESTÁNDAR
  const inputProps = {
    ref,
    id: inputId,
    type,
    name,
    value,
    defaultValue,
    onChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    placeholder,
    disabled,
    readOnly,
    required,
    autoFocus,
    maxLength,
    minLength,
    pattern,
    autoComplete,
    
    // ✅ PROPS ESTÁNDAR DELEGADAS
    size,
    variant: currentVariant,
    rounded,
    loading, // Delegamos loading al Input
    compact,
    leftIcon, // Input manejará los iconos con iconHelpers.js
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
    
    // Accesibilidad y clases
    className: inputAdditionalClasses,
    ariaLabel,
    ariaDescribedBy: describedByIds.length > 0 ? describedByIds.join(' ') : undefined,
    ariaErrorMessage: errorText ? errorTextId : ariaErrorMessage,
    
    // Resto de props
    ...restProps
  };

  return (
    <div className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId} 
          className={`text-input__label ${required ? 'text-input__label--required' : ''}`}
        >
          {label}
        </label>
      )}

      {/* ✅ INPUT DEL SISTEMA ESTÁNDAR - Maneja iconos internamente */}
      <Input {...inputProps} />

      {/* Footer con mensajes y contador */}
      {(helperText || errorText || (showCharCount && maxLength)) && (
        <div className="text-input__footer">
          <div className="text-input__messages">
            {/* Error text (prioridad sobre helper text) */}
            {errorText && (
              <span 
                id={errorTextId}
                className="text-input__error-text"
                role="alert"
                aria-live="polite"
              >
                {errorText}
              </span>
            )}

            {/* Helper text (solo si no hay error) */}
            {helperText && !errorText && (
              <span 
                id={helperTextId}
                className="text-input__helper-text"
              >
                {helperText}
              </span>
            )}
          </div>

          {/* Character count */}
          {showCharCount && maxLength && (
            <span 
              className="text-input__char-count"
              data-warning={isNearLimit && !isAtLimit}
              data-danger={isAtLimit}
              aria-label={`${currentLength} de ${maxLength} caracteres`}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

// Display name para debugging
TextInput.displayName = 'TextInput';

// ✅ PROPTYPES CON SISTEMA ESTÁNDAR
TextInput.propTypes = {
  // ✅ PROPS ESTÁNDAR DEL SISTEMA
  ...STANDARD_PROP_TYPES,
  
  // ✅ PROPS ESPECÍFICAS DE TEXTINPUT
  label: PropTypes.string,
  helperText: PropTypes.string,
  errorText: PropTypes.string,
  showCharCount: PropTypes.bool,
  
  // Props básicas del input
  placeholder: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local']),
  name: PropTypes.string,
  id: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  width: PropTypes.oneOf(['auto', 'full', 'fit-content', 'min-content', 'max-content']),
  compact: PropTypes.bool,
  onRightIconClick: PropTypes.func,
  onLeftIconClick: PropTypes.func,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  pattern: PropTypes.string,
  autoComplete: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  ariaErrorMessage: PropTypes.string
};

export { TextInput };