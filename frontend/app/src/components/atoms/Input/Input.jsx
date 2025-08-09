// atoms/Input.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { createStandardIconRenderer } from '../../../utils/iconHelpers';
import { validateStandardProps, STANDARD_PROP_TYPES } from '../../../tokens';
import './Input.css';

/**
 * Componente Input mejorado que sigue el sistema de diseño
 * Átomo base para campos de entrada de texto
 * 
 * @param {Object} props - Propiedades del componente
 * @param {'text'|'password'|'email'|'number'|'tel'|'url'|'search'|'date'|'time'|'datetime-local'} [props.type='text'] - Tipo de input
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del input
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante semántica (6 variantes estándar)
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} [props.value] - Valor controlado
 * @param {string} [props.defaultValue] - Valor por defecto (no controlado)
 * @param {function} [props.onChange] - Handler de cambio
 * @param {function} [props.onFocus] - Handler de focus
 * @param {function} [props.onBlur] - Handler de blur
 * @param {string} [props.placeholder] - Texto placeholder
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.readOnly=false] - Si es solo lectura
 * @param {boolean} [props.required=false] - Si es requerido
 * @param {boolean} [props.autoFocus=false] - Si obtiene foco automáticamente
 * @param {boolean} [props.compact=false] - Padding horizontal reducido
 * @param {string|React.ReactNode} [props.leftIcon] - Icono a la izquierda del input
 * @param {string|React.ReactNode} [props.rightIcon] - Icono a la derecha del input
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.ariaDescribedBy] - ID del elemento que describe el input
 * @param {string} [props.ariaErrorMessage] - ID del mensaje de error
 * @param {string} [props.autoComplete] - Valor autocomplete
 * @param {number|string} [props.maxLength] - Longitud máxima
 * @param {number|string} [props.minLength] - Longitud mínima
 * @param {string} [props.pattern] - Patrón regex para validación
 * @param {React.Ref} ref - Referencia al elemento input
 */
const Input = forwardRef((props, ref) => {
  // ✅ VALIDAR PROPS ESTÁNDAR - Muestra deprecation warnings automáticamente  
  const validatedProps = validateStandardProps(props, 'Input');

  const {
    // Props estándar del sistema
    size = 'md',
    variant = 'primary', 
    rounded = 'md',
    disabled = false,
    loading = false,
    className = '',
    leftIcon,
    rightIcon,
    // Props específicas de Input
    type = 'text',
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    placeholder,
    readOnly = false,
    required = false,
    autoFocus = false,
    compact = false,
    ariaLabel,
    ariaDescribedBy,
    ariaErrorMessage,
    autoComplete,
    maxLength,
    minLength,
    pattern,
    ...restProps
  } = validatedProps;

  // ⚠️ DEPRECATED VARIANTS WARNING
  if (props.variant === 'default' || props.variant === 'error') {
    console.warn(
      `Input: Las variantes "default" y "error" están deprecadas.
      Migración sugerida:
      - variant="default" → variant="primary"
      - variant="error" → variant="danger"
      
      Variantes estándar disponibles: primary, secondary, success, warning, danger, neutral`
    );
  }
  
  // Función para renderizar iconos usando el sistema centralizado
  const renderIcon = createStandardIconRenderer('input', size);

  // Determinar si necesitamos wrapper para iconos
  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon);
  const needsWrapper = hasLeftIcon || hasRightIcon || loading;

  // Construir las clases CSS dinámicamente
  const inputClasses = [
    'input-base',
    `input-base--${size}`,
    variant !== 'primary' && `input-base--${variant}`,
    rounded !== 'md' && `input-base--rounded-${rounded}`,
    compact && 'input-base--compact',
    hasLeftIcon && 'input-base--with-left-icon',
    hasRightIcon && 'input-base--with-right-icon',
    loading && 'input-base--loading',
    !needsWrapper ? className : '' // Solo agregar className al input si no hay wrapper
  ].filter(Boolean).join(' ');

  // Clases para el wrapper (cuando tiene iconos)
  const wrapperClasses = [
    'input-wrapper',
    `input-wrapper--${size}`,
    variant !== 'primary' && `input-wrapper--${variant}`,
    rounded !== 'md' && `input-wrapper--rounded-${rounded}`,
    disabled && 'input-wrapper--disabled',
    loading && 'input-wrapper--loading',
    needsWrapper ? className : '' // Agregar className al wrapper si existe
  ].filter(Boolean).join(' ');

  // Props adicionales para accesibilidad
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': (variant === 'danger' || props.variant === 'error') ? ariaErrorMessage : undefined,
    'aria-invalid': (variant === 'danger' || props.variant === 'error') ? 'true' : undefined,
    'aria-required': required ? 'true' : undefined
  };

  // Props de validación HTML
  const validationProps = {
    required,
    maxLength,
    minLength,
    pattern,
    autoComplete
  };

  // Input base element
  const inputElement = (
    <input
      ref={ref}
      type={type}
      className={inputClasses}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      {...accessibilityProps}
      {...validationProps}
      {...restProps}
    />
  );

  // Si no necesita wrapper, retornar solo el input
  if (!needsWrapper) {
    return inputElement;
  }

  // Retornar con wrapper para iconos
  return (
    <div className={wrapperClasses}>
      {/* Icono izquierdo */}
      {hasLeftIcon && (
        <span className="input-wrapper__icon input-wrapper__icon--left">
          {renderIcon(leftIcon)}
        </span>
      )}
      
      {/* Input element */}
      {inputElement}
      
      {/* Icono derecho */}
      {hasRightIcon && (
        <span className="input-wrapper__icon input-wrapper__icon--right">
          {renderIcon(rightIcon)}
        </span>
      )}
      
      {/* Spinner de loading */}
      {loading && (
        <span className="input-wrapper__spinner" aria-hidden="true">
          <svg className="input-wrapper__spinner-svg" viewBox="0 0 24 24">
            <circle 
              className="input-wrapper__spinner-circle" 
              cx="12" 
              cy="12" 
              r="10" 
              strokeWidth="2"
            />
          </svg>
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  // ✅ PROPS ESTÁNDAR DEL SISTEMA
  ...STANDARD_PROP_TYPES,
  
  // ✅ PROPS ESPECÍFICAS DE INPUT
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local']),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  compact: PropTypes.bool,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  ariaErrorMessage: PropTypes.string,
  autoComplete: PropTypes.string,
  maxLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pattern: PropTypes.string
};

export { Input };