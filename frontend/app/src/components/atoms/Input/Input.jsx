// src/components/atoms/Input/Input.jsx - V2 COMPLETO
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import './Input.css';

/**
 * Input V2 - API LIMPIA SIN BACKWARD COMPATIBILITY
 * 
 * ✅ SISTEMA V2 PURO: useInteractiveProps + extractDOMPropsV2
 * ✅ RESPONSIVE NATIVO: Breakpoints automáticos  
 * ✅ ICONOS SIMPLIFICADOS: leftIcon/rightIcon únicamente
 * ✅ PERFORMANCE: Memoización y CSS-first con tokens
 * ✅ TYPE-SAFE: Validación automática en desarrollo
 * ✅ API LIMPIA: Solo props V2, sin props deprecadas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {'text'|'password'|'email'|'number'|'tel'|'url'|'search'|'date'|'time'|'datetime-local'} [props.type='text'] - Tipo de input HTML
 * @param {string} [props.value] - Valor controlado
 * @param {string} [props.defaultValue] - Valor por defecto (no controlado)
 * @param {string} [props.placeholder] - Texto placeholder
 * @param {boolean} [props.readOnly=false] - Si es solo lectura
 * @param {boolean} [props.required=false] - Si es requerido
 * @param {boolean} [props.autoFocus=false] - Si obtiene foco automáticamente
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del input
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante visual
 * @param {'none'|'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {'auto'|'full'|'fit-content'|'min-content'|'max-content'} [props.width='auto'] - Ancho del input
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.loading=false] - Estado de carga con spinner
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho
 * @param {function} [props.onChange] - Handler de cambio
 * @param {function} [props.onFocus] - Handler de focus
 * @param {function} [props.onBlur] - Handler de blur
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
const Input = forwardRef((props, ref) => {
  // ✅ V2 HOOK: Procesamiento completo de props
  const {
    // Props procesadas con defaults
    size, variant, rounded, width,
    leftIcon, rightIcon,
    
    // Tokens especializados
    tokens,
    
    // ✅ Sistema de iconos V2
    renderIcon,
    
    // Helpers de estado  
    isDisabled, isLoading,
    
    // Generadores
    generateStyles,
    
    // Meta información
    currentBreakpoint,
    
    // Debugging (solo desarrollo)
    _debug
  } = useInteractiveProps(props, {
    componentName: 'Input',
    defaultSize: 'md',
    defaultVariant: 'primary'
  });

  // Props específicas de Input (no procesadas por hook)
  const {
    type = 'text',
    value,
    defaultValue,
    placeholder,
    readOnly = false,
    required = false,
    autoFocus = false,
    onChange,
    onFocus,
    onBlur,
    ariaLabel,
    ariaDescribedBy,
    ariaErrorMessage,
    autoComplete,
    maxLength,
    minLength,
    pattern
  } = props;

  // ✅ V2 DEBUGGING: Solo en desarrollo
  if (import.meta.env?.DEV && _debug) {
    //console.log('Input V2 Debug:', {
    //  size, variant, width, tokens, currentBreakpoint, _debug
    //});
  }

  // ARIA Label inteligente
  const finalAriaLabel = ariaLabel;
  
  // Determinar si necesitamos wrapper para iconos
  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon);
  const needsWrapper = hasLeftIcon || hasRightIcon || isLoading;
  
  // Props adicionales para accesibilidad
  const accessibilityProps = {
    'aria-label': finalAriaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': variant === 'danger' ? ariaErrorMessage : undefined,
    'aria-invalid': variant === 'danger' ? 'true' : undefined,
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

  // ✅ GENERAR CLASES CSS TRADICIONALES (compatible con CSS actual)
  const inputClasses = [
    'input-base',
    `input-base--${size}`,
    `input-base--${variant}`,
    rounded !== 'md' && `input-base--rounded-${rounded}`,
    hasLeftIcon && 'input-base--with-left-icon',
    hasRightIcon && 'input-base--with-right-icon',
    isLoading && 'input-base--loading',
    isDisabled && 'input-base--disabled',
    !needsWrapper ? props.className : '' // Solo agregar className al input si no hay wrapper
  ].filter(Boolean).join(' ');

  // Clases para el wrapper (cuando tiene iconos)
  const wrapperClasses = [
    'input-wrapper',
    `input-wrapper--${size}`,
    `input-wrapper--${variant}`,
    rounded !== 'md' && `input-wrapper--rounded-${rounded}`,
    width === 'full' && 'input-wrapper--full-width',
    isDisabled && 'input-wrapper--disabled',
    isLoading && 'input-wrapper--loading',
    needsWrapper ? props.className : '' // Agregar className al wrapper si existe
  ].filter(Boolean).join(' ');

  // ✅ PROPS MODIFICADAS: reemplazar className original con combinada
  const propsWithFinalClassName = { 
    ...props, 
    className: needsWrapper ? wrapperClasses : inputClasses
  };

  // Input base element
  const inputElement = (
    <input
      {...extractDOMPropsV2(propsWithFinalClassName)}
      ref={ref}
      type={type}
      className={inputClasses}
      style={{
        // Aplicar algunos tokens V2 como fallback
        ...(tokens.width && { width: tokens.width }),
        ...generateStyles(),
        ...props.style
      }}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={isDisabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      {...accessibilityProps}
      {...validationProps}
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
      
      {/* Loading spinner */}
      {isLoading && (
        <span className="input-wrapper__spinner" aria-hidden="true">
          <svg className="input-wrapper__spinner-svg" viewBox="0 0 24 24">
            <circle 
              className="input-wrapper__spinner-circle" 
              cx="12" cy="12" r="10" strokeWidth="2"
            />
          </svg>
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// ✅ V2 PROPTYPES OPTIMIZADOS: Props Helpers System
Input.propTypes = {
  // ✅ PROPS HELPERS: Sistema centralizado (-80% código repetitivo)
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas de Input únicamente
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local']),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  ariaDescribedBy: PropTypes.string,
  ariaErrorMessage: PropTypes.string,
  autoComplete: PropTypes.string,
  maxLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pattern: PropTypes.string
};

// ✅ V2 DEFAULT PROPS: Minimales (hook maneja la mayoría)
Input.defaultProps = {
  type: 'text',
  readOnly: false,
  required: false,
  autoFocus: false
};

export { Input };