// molecules/TextInput/TextInput.jsx - SISTEMA V2 COMPLETO
import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Input, Typography, FlexContainer, useInteractiveProps, extractDOMPropsV2, INTERACTIVE_PROP_TYPES } from '../../index.js';
import './TextInput.css';

/**
 * TextInput - Molécula del Sistema de Diseño V2
 * 
 *  SISTEMA V2 COMPLETO:
 * - useInteractiveProps con componentName
 * - INTERACTIVE_PROP_TYPES y extractDOMPropsV2
 * - Composici�n pura usando Input �tomo migrado
 * - Typography para labels y mensajes
 * - FlexContainer para layout
 * 
 * <� Funcionalidades:
 * - Label con indicador de requerido
 * - Helper text y mensajes de error
 * - Contador de caracteres opcional
 * - Estados de focus avanzados
 * - Accesibilidad WCAG completa
 * 
 * @param {Object} props - Props del componente
 * @param {string} [props.label] - Etiqueta del campo
 * @param {string} [props.helperText] - Texto de ayuda
 * @param {string} [props.errorText] - Mensaje de error (prioridad sobre helperText)
 * @param {boolean} [props.showCharCount=false] - Mostrar contador de caracteres
 * @param {boolean} [props.required=false] - Campo requerido
 * @param {React.Ref} ref - Referencia al elemento input
 */
const TextInput = forwardRef((props, ref) => {
  //  V2: Extraer props espec�ficas antes del hook
  const {
    // Props espec�ficas de TextInput
    label,
    helperText,
    errorText,
    showCharCount = false,
    required = false,
    
    // Props restantes para el hook V2
    ...restProps
  } = props;
  
  //  V2: Hook del sistema de dise�o
  const {
    size, variant, rounded, disabled, loading, className,
    ...standardProps
  } = useInteractiveProps(restProps, {
    componentName: 'TextInput',
    defaultSize: 'md',
    defaultVariant: 'primary',
    defaultRounded: 'md'
  });
  
  //  V2: Props DOM v�lidas
  const domProps = extractDOMPropsV2(standardProps);
  
  // Estado interno
  const [isFocused, setIsFocused] = useState(false);
  
  // Determinar variante final (error tiene prioridad)
  const finalVariant = errorText ? 'danger' : variant;
  
  // Handlers de eventos
  const handleFocus = (e) => {
    setIsFocused(true);
    restProps.onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    restProps.onBlur?.(e);
  };
  
  // IDs �nicos para accesibilidad
  const inputId = restProps.id || `textinput-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  const helperTextId = helperText ? `${inputId}-helper` : undefined;
  const errorTextId = errorText ? `${inputId}-error` : undefined;
  
  // ARIA describedby
  const describedByIds = [
    restProps['aria-describedby'],
    helperTextId,
    errorTextId
  ].filter(Boolean);
  
  // Contador de caracteres
  const currentLength = restProps.value?.length || 0;
  const maxLength = restProps.maxLength;
  const isNearLimit = maxLength && currentLength > maxLength * 0.8;
  const isOverLimit = maxLength && currentLength > maxLength;
  
  //  V2: Construir clases CSS
  const wrapperClasses = [
    'text-input',
    `text-input--size-${size}`,
    finalVariant !== 'primary' && `text-input--variant-${finalVariant}`,
    rounded !== 'md' && `text-input--rounded-${rounded}`,
    isFocused && 'text-input--focused',
    disabled && 'text-input--disabled',
    loading && 'text-input--loading',
    errorText && 'text-input--error',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={wrapperClasses}
      {...extractDOMPropsV2(restProps)}
    >
      {/* Label */}
      {label && (
        <Typography
          as="label"
          htmlFor={inputId}
          size={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'sm'}
          variant="neutral"
          weight="medium"
          className="text-input__label"
        >
          {label}
          {required && (
            <Typography
              as="span"
              size="inherit"
              variant="danger"
              className="text-input__required"
              aria-label="requerido"
            >
              {' *'}
            </Typography>
          )}
        </Typography>
      )}
      
      {/* Input */}
      <Input
        ref={ref}
        id={inputId}
        size={size}
        variant={finalVariant}
        rounded={rounded}
        disabled={disabled}
        loading={loading}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={describedByIds.length > 0 ? describedByIds.join(' ') : undefined}
        aria-invalid={errorText ? 'true' : undefined}
        className="text-input__input"
        // ✅ PROPS ESENCIALES QUE FALTABAN
        value={restProps.value}
        onChange={restProps.onChange}
        type={restProps.type}
        placeholder={restProps.placeholder}
        name={restProps.name}
        autoComplete={restProps.autoComplete}
        required={required}
        maxLength={restProps.maxLength}
        minLength={restProps.minLength}
        pattern={restProps.pattern}
        readOnly={restProps.readOnly}
        autoFocus={restProps.autoFocus}
        leftIcon={restProps.leftIcon}
        rightIcon={restProps.rightIcon}
        {...domProps}
      />
      
      {/* Footer con helper text, error y contador */}
      {(helperText || errorText || (showCharCount && maxLength)) && (
        <FlexContainer
          direction="row"
          justify="space-between"
          align="flex-start"
          gap="xs"
          className="text-input__footer"
        >
          {/* Helper text o error */}
          <div className="text-input__messages">
            {errorText && (
              <Typography
                id={errorTextId}
                size="xs"
                variant="danger"
                className="text-input__error"
              >
                {errorText}
              </Typography>
            )}
            {!errorText && helperText && (
              <Typography
                id={helperTextId}
                size="xs"
                variant="neutral"
                className="text-input__helper"
              >
                {helperText}
              </Typography>
            )}
          </div>
          
          {/* Contador de caracteres */}
          {showCharCount && maxLength && (
            <Typography
              size="xs"
              variant={isOverLimit ? 'danger' : isNearLimit ? 'warning' : 'neutral'}
              className="text-input__char-count"
            >
              {currentLength}/{maxLength}
            </Typography>
          )}
        </FlexContainer>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

TextInput.propTypes = {
  //  V2: Props est�ndar del sistema
  ...INTERACTIVE_PROP_TYPES,
  
  // Props espec�ficas de TextInput
  label: PropTypes.string,
  helperText: PropTypes.string,
  errorText: PropTypes.string,
  showCharCount: PropTypes.bool,
  required: PropTypes.bool
};

export { TextInput };