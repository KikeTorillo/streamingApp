// components/atoms/Checkbox/Checkbox.jsx
import PropTypes from 'prop-types';
import { useId } from 'react';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import './Checkbox.css';

/**
 * Checkbox - ÁTOMO MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
 * 
 * ✅ SISTEMA DE DISEÑO: Props estándar + design tokens automáticos
 * ✅ VARIANTES: 6 variantes semánticas estándar + estados loading/disabled
 * ✅ ACCESIBILIDAD: ARIA completo + navegación por teclado
 * ✅ BACKWARD COMPATIBILITY: API existente mantenida + deprecation warnings
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} [props.checked=false] - Estado del checkbox
 * @param {boolean} [props.indeterminate=false] - Estado indeterminado
 * @param {function} [props.onChange] - Función ejecutada al cambiar
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {string} [props.label] - Texto del label
 * @param {string} [props.helperText] - Texto de ayuda
 * @param {string} [props.error] - Mensaje de error
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del checkbox
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante semántica
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='sm'] - Radio de bordes
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo personalizado
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho personalizado
 * @param {string} [props.name] - Nombre del input
 * @param {string} [props.value] - Valor del input
 * @param {string} [props.id] - ID del input
 * @param {boolean} [props.required=false] - Si es requerido
 * @param {string} [props.className=''] - Clases adicionales
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.testId] - ID para testing
 */
function Checkbox(props) {
  // ✅ HOOK ESTÁNDAR V2: Sistema completo de props con tokens automáticos
  const standardProps = useInteractiveProps(props, {
    componentName: 'Checkbox',
    defaultSize: 'md',
    defaultVariant: 'primary',
    defaultRounded: 'sm'
  });
  
  const {
    // Props estándar del sistema
    size,
    variant,
    rounded,
    disabled,
    loading,
    leftIcon,
    rightIcon,
    className,
    renderIcon,
    tokens,
    generateClassName,
    generateStyles,
    // Props específicas de Checkbox
    checked = false,
    indeterminate = false,
    onChange,
    label,
    helperText,
    error,
    name,
    value,
    id,
    required = false,
    ariaLabel,
    testId,
    ...restProps
  } = { ...standardProps, ...props };
  // ✅ SSR-SAFE ID: useId() en lugar de Math.random()
  const generateId = useId();
  const inputId = id || `checkbox-${generateId}`;
  
  // ✅ ESTADOS COMPUTADOS para mejor legibilidad
  const isDisabled = disabled || loading;
  const hasError = Boolean(error);
  const showHelper = Boolean(helperText && !error);
  const showLeftIcon = Boolean(leftIcon);
  const showRightIcon = Boolean(rightIcon);
  
  // ✅ CLASES CSS V2: Sistema estándar + backward compatibility
  const checkboxClasses = generateClassName('checkbox') + ' ' + [
    hasError && 'checkbox--error',
    indeterminate && 'checkbox--indeterminate'
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'checkbox-container',
    `checkbox-container--${variant}`,
    isDisabled && 'checkbox-container--disabled',
    loading && 'checkbox-container--loading'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
          required={required}
          className={checkboxClasses}
          ref={(el) => {
            if (el) {
              el.indeterminate = indeterminate;
            }
          }}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-label={ariaLabel}
          aria-describedby={
            [
              showHelper && `${inputId}-helper`,
              hasError && `${inputId}-error`
            ].filter(Boolean).join(' ') || undefined
          }
          data-testid={testId}
          {...restProps}
        />
        
        {/* ✅ CHECKBOX VISUAL: Soporte indeterminate + estados loading */}
        <div className="checkbox-custom">
          {loading ? (
            <div className="checkbox-spinner" aria-hidden="true">
              <div className="checkbox-spinner-circle"></div>
            </div>
          ) : (
            <svg 
              className="checkbox-check" 
              viewBox="0 0 16 16" 
              fill="none"
              aria-hidden="true"
            >
              {indeterminate ? (
                <path 
                  d="M4 8h8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path 
                  d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                  fill="currentColor"
                />
              )}
            </svg>
          )}
        </div>
        
        {/* ✅ LABEL: Soporte iconos personalizados */}
        {label && (
          <label htmlFor={inputId} className="checkbox-label">
            {showLeftIcon && (
              <span className="checkbox-label-icon checkbox-label-icon--left">
                {renderIcon(leftIcon)}
              </span>
            )}
            <span className="checkbox-label-text">
              {label}
              {required && <span className="checkbox-required">*</span>}
            </span>
            {showRightIcon && (
              <span className="checkbox-label-icon checkbox-label-icon--right">
                {renderIcon(rightIcon)}
              </span>
            )}
          </label>
        )}
      </div>
      
      {/* ✅ HELPER TEXT: Estados loading integrados */}
      {showHelper && (
        <div id={`${inputId}-helper`} className="checkbox-helper">
          {loading && <span className="checkbox-loading-text">Procesando... </span>}
          {helperText}
        </div>
      )}
      
      {/* ✅ ERROR MESSAGE: Mejor UX con animación */}
      {hasError && (
        <div id={`${inputId}-error`} className="checkbox-error">
          {error}
        </div>
      )}
    </div>
  );
}

// ✅ PROP TYPES V2: Sistema estándar + props específicas
Checkbox.propTypes = {
  // Props estándar del sistema de diseño V2
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas del Checkbox
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool
};

export { Checkbox };