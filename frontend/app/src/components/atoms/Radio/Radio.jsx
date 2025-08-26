// components/atoms/Radio/Radio.jsx
import PropTypes from 'prop-types';
import { useId } from 'react';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import './Radio.css';

/**
 * Radio - ÁTOMO SISTEMA DE DISEÑO V2.0
 * 
 * ✅ SISTEMA DE DISEÑO: Props estándar + design tokens automáticos
 * ✅ VARIANTES: 6 variantes semánticas estándar + estados loading/disabled
 * ✅ ACCESIBILIDAD: ARIA completo + navegación por teclado
 * ✅ FORM INTEGRATION: Compatible con formularios y validación
 * ✅ GRUPOS: Soporte para grupos de radio con name común
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} [props.checked=false] - Estado del radio
 * @param {function} [props.onChange] - Función ejecutada al cambiar
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {string} [props.label] - Texto del label
 * @param {string} [props.helperText] - Texto de ayuda
 * @param {string} [props.error] - Mensaje de error
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del radio
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante semántica
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='full'] - Radio de bordes (full por defecto para círculo perfecto)
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo personalizado
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho personalizado
 * @param {string} [props.name] - Nombre del input (requerido para grupos)
 * @param {string|number} [props.value] - Valor del input (requerido)
 * @param {string} [props.id] - ID del input
 * @param {boolean} [props.required=false] - Si es requerido
 * @param {string} [props.className=''] - Clases adicionales
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.testId] - ID para testing
 */
function Radio(props) {
  // ✅ HOOK ESTÁNDAR V2: Sistema completo de props con tokens automáticos
  const standardProps = useInteractiveProps(props, {
    componentName: 'Radio',
    defaultSize: 'md',
    defaultVariant: 'primary',
    defaultRounded: 'full' // Círculo perfecto por defecto
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
    // Props específicas de Radio
    checked = false,
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
  const inputId = id || `radio-${generateId}`;
  
  // ✅ VALIDACIÓN: name y value son requeridos para radio buttons
  if (!name) {
    console.warn('⚠️ Radio: prop "name" es requerida para agrupar radio buttons correctamente');
  }
  if (value === undefined || value === null) {
    console.warn('⚠️ Radio: prop "value" es requerida para identificar radio buttons');
  }
  
  // ✅ ESTADOS COMPUTADOS para mejor legibilidad
  const isDisabled = disabled || loading;
  const hasError = Boolean(error);
  const showHelper = Boolean(helperText && !error);
  const showLeftIcon = Boolean(leftIcon);
  const showRightIcon = Boolean(rightIcon);
  
  // ✅ CLASES CSS V2: Sistema estándar + estados específicos
  const radioClasses = generateClassName('radio') + ' ' + [
    hasError && 'radio--error'
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'radio-container',
    `radio-container--${size}`,
    `radio-container--${variant}`,
    isDisabled && 'radio-container--disabled',
    loading && 'radio-container--loading'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="radio-wrapper">
        <input
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
          required={required}
          className={radioClasses}
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
        
        {/* ✅ RADIO VISUAL: Soporte loading con spinner */}
        <div className="radio-custom">
          {loading ? (
            <div className="radio-spinner" aria-hidden="true">
              <div className="radio-spinner-circle"></div>
            </div>
          ) : (
            <div 
              className="radio-dot" 
              aria-hidden="true"
            />
          )}
        </div>
        
        {/* ✅ LABEL: Soporte iconos personalizados */}
        {label && (
          <label htmlFor={inputId} className="radio-label">
            {showLeftIcon && (
              <span className="radio-label-icon radio-label-icon--left">
                {renderIcon(leftIcon)}
              </span>
            )}
            <span className="radio-label-text">
              {label}
              {required && <span className="radio-required">*</span>}
            </span>
            {showRightIcon && (
              <span className="radio-label-icon radio-label-icon--right">
                {renderIcon(rightIcon)}
              </span>
            )}
          </label>
        )}
      </div>
      
      {/* ✅ HELPER TEXT: Estados loading integrados */}
      {showHelper && (
        <div id={`${inputId}-helper`} className="radio-helper">
          {loading && <span className="radio-loading-text">Procesando... </span>}
          {helperText}
        </div>
      )}
      
      {/* ✅ ERROR MESSAGE: Mejor UX con animación */}
      {hasError && (
        <div id={`${inputId}-error`} className="radio-error">
          {error}
        </div>
      )}
    </div>
  );
}

// ✅ PROP TYPES V2: Sistema estándar + props específicas
Radio.propTypes = {
  // Props estándar del sistema de diseño V2
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas del Radio
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.string,
  name: PropTypes.string.isRequired, // Requerido para agrupación
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Requerido para identificación
  id: PropTypes.string,
  required: PropTypes.bool
};

export { Radio };