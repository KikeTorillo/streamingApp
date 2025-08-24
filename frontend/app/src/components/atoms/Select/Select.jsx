// src/components/atoms/Select/Select.jsx - V2 COMPLETO
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import './Select.css';

/**
 * Select V2 - API LIMPIA SIN BACKWARD COMPATIBILITY
 * 
 * ✅ SISTEMA V2 PURO: useInteractiveProps + extractDOMPropsV2
 * ✅ RESPONSIVE NATIVO: Breakpoints automáticos  
 * ✅ ICONOS SIMPLIFICADOS: leftIcon/rightIcon únicamente
 * ✅ PERFORMANCE: Memoización y CSS-first con tokens
 * ✅ TYPE-SAFE: Validación automática en desarrollo
 * ✅ API LIMPIA: Solo props V2, sin props deprecadas
 * ✅ CONSISTENCIA: 100% igual que Input V2
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} [props.options=[]] - Array de opciones {value, label, disabled?}
 * @param {string} [props.value] - Valor controlado
 * @param {string} [props.defaultValue] - Valor por defecto (no controlado)
 * @param {string} [props.placeholder] - Texto placeholder (primera opción)
 * @param {boolean} [props.required=false] - Si es requerido
 * @param {boolean} [props.autoFocus=false] - Si obtiene foco automáticamente
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del select
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante visual
 * @param {'none'|'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {'auto'|'full'|'fit-content'|'min-content'|'max-content'} [props.width='auto'] - Ancho del select
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.loading=false] - Estado de carga con spinner
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho (reemplaza flecha automática)
 * @param {function} [props.onChange] - Handler de cambio
 * @param {function} [props.onFocus] - Handler de focus
 * @param {function} [props.onBlur] - Handler de blur
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
const Select = forwardRef((props, ref) => {
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
    componentName: 'Select',
    defaultSize: 'md',
    defaultVariant: 'primary'
  });

  // Props específicas de Select (no procesadas por hook)
  const {
    options = [],
    value,
    defaultValue,
    placeholder,
    required = false,
    autoFocus = false,
    onChange,
    onFocus,
    onBlur,
    ariaLabel,
    ariaDescribedBy,
    ariaErrorMessage,
    autoComplete
  } = props;
  // ✅ V2 DEBUGGING: Solo en desarrollo
  if (import.meta.env?.DEV && _debug) {
    console.log('Select V2 Debug:', {
      size, variant, width, tokens, currentBreakpoint, _debug
    });
  }

  // ARIA Label inteligente
  const finalAriaLabel = ariaLabel;
  
  // Determinar si necesitamos wrapper para iconos
  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon);
  const needsWrapper = hasLeftIcon || hasRightIcon || isLoading;
  
  // Icono de flecha automático si no hay rightIcon personalizado
  const showDefaultArrow = !hasRightIcon && !isLoading;
  
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
    autoComplete
  };

  // ✅ GENERAR CLASES CSS TRADICIONALES (compatible con CSS actual)
  const selectClasses = [
    'select-base',
    `select-base--${size}`,
    `select-base--${variant}`,
    rounded !== 'md' && `select-base--rounded-${rounded}`,
    hasLeftIcon && 'select-base--with-left-icon',
    hasRightIcon && 'select-base--with-right-icon',
    isLoading && 'select-base--loading',
    isDisabled && 'select-base--disabled',
    !needsWrapper ? props.className : '' // Solo agregar className al select si no hay wrapper
  ].filter(Boolean).join(' ');

  // Clases para el wrapper (cuando tiene iconos)
  const wrapperClasses = [
    'select-wrapper',
    `select-wrapper--${size}`,
    `select-wrapper--${variant}`,
    rounded !== 'md' && `select-wrapper--rounded-${rounded}`,
    width === 'full' && 'select-wrapper--full-width',
    isDisabled && 'select-wrapper--disabled',
    isLoading && 'select-wrapper--loading',
    needsWrapper ? props.className : '' // Agregar className al wrapper si existe
  ].filter(Boolean).join(' ');

  // Clases simples para wrapper sin iconos (solo contenedor básico)
  const simpleWrapperClasses = [
    'select-wrapper',
    `select-wrapper--${size}`,
    width === 'full' && 'select-wrapper--full-width',
    !needsWrapper ? props.className : '' // Agregar className al wrapper simple
  ].filter(Boolean).join(' ');

  // ✅ PROPS MODIFICADAS: reemplazar className original con combinada
  const propsWithFinalClassName = { 
    ...props, 
    className: needsWrapper ? wrapperClasses : simpleWrapperClasses
  };

  // Select base element
  const selectElement = (
    <select
      {...extractDOMPropsV2(propsWithFinalClassName)}
      ref={ref}
      className={selectClasses}
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
      disabled={isDisabled}
      autoFocus={autoFocus}
      {...accessibilityProps}
      {...validationProps}
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
      <div className={simpleWrapperClasses}>
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

  // Retornar con wrapper para iconos
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
      
      {/* Loading spinner */}
      {isLoading && (
        <span className="select-wrapper__spinner" aria-hidden="true">
          <svg className="select-wrapper__spinner-svg" viewBox="0 0 24 24">
            <circle 
              className="select-wrapper__spinner-circle" 
              cx="12" cy="12" r="10" strokeWidth="2"
            />
          </svg>
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// ✅ V2 PROPTYPES OPTIMIZADOS: Props Helpers System
Select.propTypes = {
  // ✅ PROPS HELPERS: Sistema centralizado (-80% código repetitivo)
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas de Select únicamente
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
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  ariaDescribedBy: PropTypes.string,
  ariaErrorMessage: PropTypes.string,
  autoComplete: PropTypes.string
};

// ✅ V2 DEFAULT PROPS: Minimales (hook maneja la mayoría)
Select.defaultProps = {
  options: [],
  required: false,
  autoFocus: false
};

export { Select };