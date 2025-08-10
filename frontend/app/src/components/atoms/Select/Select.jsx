// atoms/Select/Select.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { createStandardIconRenderer } from '../../../utils/iconHelpers';
import { validateStandardProps, STANDARD_PROP_TYPES } from '../../../tokens';
import './Select.css';

/**
 * Componente Select mejorado que sigue el sistema de diseño
 * Átomo base para campos de selección que mantiene 100% consistencia con Input
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} [props.options=[]] - Array de opciones {value, label, disabled?}
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del select
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante semántica (6 variantes estándar)
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} [props.value] - Valor controlado
 * @param {string} [props.defaultValue] - Valor por defecto (no controlado)
 * @param {function} [props.onChange] - Handler de cambio
 * @param {function} [props.onFocus] - Handler de focus
 * @param {function} [props.onBlur] - Handler de blur
 * @param {string} [props.placeholder] - Texto placeholder (primera opción)
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.required=false] - Si es requerido
 * @param {boolean} [props.autoFocus=false] - Si obtiene foco automáticamente
 * @param {boolean} [props.compact=false] - Padding horizontal reducido
 * @param {string|React.ReactNode} [props.leftIcon] - Icono a la izquierda del select (como Input)
 * @param {string|React.ReactNode} [props.rightIcon] - Icono a la derecha del select (reemplaza flecha automática)
 * @param {boolean} [props.loading=false] - Estado de loading con spinner
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.ariaDescribedBy] - ID del elemento que describe el select
 * @param {string} [props.ariaErrorMessage] - ID del mensaje de error
 * @param {string} [props.autoComplete] - Valor autocomplete
 * @param {React.Ref} ref - Referencia al elemento select
 */
const Select = forwardRef((props, ref) => {
  // ✅ VALIDAR PROPS ESTÁNDAR - Muestra deprecation warnings automáticamente  
  const validatedProps = validateStandardProps(props, 'Select');

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
    // Props específicas de Select
    options = [],
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    placeholder,
    required = false,
    autoFocus = false,
    compact = false,
    ariaLabel,
    ariaDescribedBy,
    ariaErrorMessage,
    autoComplete,
    ...restProps
  } = validatedProps;
  
  // ⚠️ DEPRECATED VARIANTS WARNING - Igual que Input
  if (props.variant === 'default' || props.variant === 'error') {
    console.warn(
      `Select: Las variantes "default" y "error" están deprecadas.
      Migración sugerida:
      - variant="default" → variant="primary"
      - variant="error" → variant="danger"
      
      Variantes estándar disponibles: primary, secondary, success, warning, danger, neutral`
    );
  }
  
  // Función para renderizar iconos usando el sistema centralizado
  const renderIcon = createStandardIconRenderer('select', size);

  // Determinar si necesitamos wrapper para iconos (como Input)
  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon);
  const needsWrapper = hasLeftIcon || hasRightIcon || loading;
  
  // Icono de flecha automático si no hay rightIcon personalizado
  const showDefaultArrow = !hasRightIcon && !loading;

  // Construir las clases CSS dinámicamente (igual que Input)
  const selectClasses = [
    'select-base',
    `select-base--${size}`,
    variant !== 'primary' && `select-base--${variant}`,
    rounded !== 'md' && `select-base--rounded-${rounded}`,
    compact && 'select-base--compact',
    hasLeftIcon && 'select-base--with-left-icon',
    hasRightIcon && 'select-base--with-right-icon',
    loading && 'select-base--loading',
    !needsWrapper ? className : '' // Solo agregar className al select si no hay wrapper
  ].filter(Boolean).join(' ');

  // Clases para el wrapper (cuando tiene iconos)
  const wrapperClasses = [
    'select-wrapper',
    `select-wrapper--${size}`,
    variant !== 'primary' && `select-wrapper--${variant}`,
    rounded !== 'md' && `select-wrapper--rounded-${rounded}`,
    disabled && 'select-wrapper--disabled',
    loading && 'select-wrapper--loading',
    needsWrapper ? className : '' // Agregar className al wrapper si existe
  ].filter(Boolean).join(' ');

  // Props adicionales para accesibilidad (igual que Input)
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
    autoComplete
  };

  // Select base element
  const selectElement = (
    <select
      ref={ref}
      className={selectClasses}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      autoFocus={autoFocus}
      {...accessibilityProps}
      {...validationProps}
      {...restProps}
    >
      {/* Opción placeholder si se proporciona */}
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      
      {/* Renderizar opciones */}
      {options.map((option, index) => {
        // Soportar string simple o objeto {value, label, disabled}
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        const optionDisabled = typeof option === 'object' ? option.disabled : false;
        
        return (
          <option
            key={`${optionValue}-${index}`}
            value={optionValue}
            disabled={optionDisabled}
          >
            {optionLabel}
          </option>
        );
      })}
    </select>
  );

  // Si no necesita wrapper, retornar solo el select con flecha
  if (!needsWrapper) {
    return (
      <div className="select-wrapper">
        {selectElement}
        
        {/* Flecha automática cuando no hay rightIcon personalizado */}
        {showDefaultArrow && (
          <div className="select-base__arrow" aria-hidden="true">
            {renderIcon('chevron-down')}
          </div>
        )}
      </div>
    );
  }

  // Retornar con wrapper para iconos (como Input)
  return (
    <div className={wrapperClasses}>
      {/* Icono izquierdo */}
      {hasLeftIcon && (
        <span className="select-wrapper__icon select-wrapper__icon--left">
          {renderIcon(leftIcon)}
        </span>
      )}
      
      {/* Select element */}
      {selectElement}
      
      {/* Icono derecho personalizado */}
      {hasRightIcon && (
        <span className="select-wrapper__icon select-wrapper__icon--right">
          {renderIcon(rightIcon)}
        </span>
      )}
      
      {/* Flecha automática cuando no hay rightIcon personalizado */}
      {showDefaultArrow && (
        <div className="select-base__arrow" aria-hidden="true">
          {renderIcon('chevron-down')}
        </div>
      )}
      
      {/* Spinner de loading */}
      {loading && (
        <span className="select-wrapper__spinner" aria-hidden="true">
          <svg className="select-wrapper__spinner-svg" viewBox="0 0 24 24">
            <circle 
              className="select-wrapper__spinner-circle" 
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

Select.displayName = 'Select';

Select.propTypes = {
  // ✅ PROPS ESTÁNDAR DEL SISTEMA
  ...STANDARD_PROP_TYPES,
  
  // ✅ PROPS ESPECÍFICAS DE SELECT
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool
      })
    ])
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  compact: PropTypes.bool,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  ariaErrorMessage: PropTypes.string,
  autoComplete: PropTypes.string
};

export { Select };