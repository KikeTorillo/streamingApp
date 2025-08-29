// src/components/atoms/TextArea/TextArea.jsx - V2 COMPLETO
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useInteractiveProps, extractDOMPropsV2, INTERACTIVE_PROP_TYPES } from '../../index.js';
import './TextArea.css';

/**
 * TextArea V2 - Campos de texto multi-línea con sistema V2.0 completo
 * 
 * ✅ SISTEMA V2.0: useInteractiveProps + extractDOMPropsV2
 * ✅ RESPONSIVE NATIVO: Breakpoints automáticos  
 * ✅ ICONOS SIMPLIFICADOS: leftIcon/rightIcon únicamente
 * ✅ AUTO-RESIZE: Expansión automática de altura
 * ✅ PERFORMANCE: Memoización y CSS-first con tokens
 * ✅ TYPE-SAFE: Validación automática en desarrollo
 * ✅ API LIMPIA: Solo props V2, sin props deprecadas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.value] - Valor controlado
 * @param {string} [props.defaultValue] - Valor por defecto (no controlado)
 * @param {string} [props.placeholder] - Texto placeholder
 * @param {boolean} [props.readOnly=false] - Si es solo lectura
 * @param {boolean} [props.required=false] - Si es requerido
 * @param {boolean} [props.autoFocus=false] - Si obtiene foco automáticamente
 * @param {number} [props.rows=4] - Número de filas iniciales
 * @param {number} [props.minRows=2] - Mínimo de filas (con autoResize)
 * @param {number} [props.maxRows=10] - Máximo de filas (con autoResize)
 * @param {boolean} [props.autoResize=false] - Expansión automática de altura
 * @param {number} [props.maxLength] - Límite de caracteres
 * @param {boolean} [props.showCharCount=false] - Mostrar contador de caracteres
 * @param {'both'|'horizontal'|'vertical'|'none'} [props.resize='vertical'] - Control de redimensionamiento
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del textarea
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante visual
 * @param {'none'|'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {'auto'|'full'|'fit-content'|'min-content'|'max-content'} [props.width='auto'] - Ancho del textarea
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
const TextArea = forwardRef((props, ref) => {
  // ✅ V2 HOOK: Procesamiento completo de props
  const {
    // Props procesadas con defaults
    size, variant, rounded, width,
    leftIcon, rightIcon,
    
    // Tokens especializados
    tokens,
    
    // ✅ RENDERER DE ICONOS V2: Hook integrado
    renderIcon,
    
    // Helpers de estado  
    isDisabled, isLoading, isInteractive,
    
    // Debugging (solo desarrollo)
    _debug
  } = useInteractiveProps(props, {
    componentName: 'TextArea',
    defaultSize: 'md',
    defaultVariant: 'primary'
  });

  // Props específicas de TextArea (no procesadas por hook)
  const {
    value,
    defaultValue,
    placeholder,
    readOnly = false,
    required = false,
    autoFocus = false,
    rows = 4,
    minRows = 2,
    maxRows = 10,
    autoResize = false,
    maxLength,
    showCharCount = false,
    resize = 'vertical',
    onChange,
    onFocus,
    onBlur,
    ariaLabel
  } = props;

  // ===== LÓGICA DE AUTO-RESIZE =====
  
  // Calcular filas dinámicas para autoResize
  const calculateRows = (textValue) => {
    if (!autoResize) return rows;
    
    const lineCount = (textValue || '').split('\n').length;
    return Math.min(Math.max(lineCount, minRows), maxRows);
  };

  const currentValue = value || defaultValue || '';
  const dynamicRows = calculateRows(currentValue);

  // ===== LÓGICA DE CONTADOR DE CARACTERES =====
  
  const currentLength = currentValue.length;
  const showCounter = showCharCount && maxLength;
  const isNearLimit = maxLength && currentLength > maxLength * 0.8;
  const isOverLimit = maxLength && currentLength > maxLength;

  // ===== HANDLERS =====

  const handleChange = (e) => {
    // Para autoResize, ajustar dinámicamente
    if (autoResize && e.target) {
      const newRows = calculateRows(e.target.value);
      if (newRows !== dynamicRows) {
        // Force re-render with new rows
        e.target.rows = newRows;
      }
    }
    
    onChange?.(e);
  };

  const handleFocus = (e) => {
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    onBlur?.(e);
  };

  // ===== ARIA LABELS INTELIGENTES =====
  
  const textareaLabel = ariaLabel || (
    maxLength ? `Campo de texto, máximo ${maxLength} caracteres` : 'Campo de texto'
  );

  // ===== V2 DEBUGGING =====
  if (import.meta.env?.DEV && _debug) {
    console.log('TextArea V2 Debug:', {
      size, variant, width, autoResize, dynamicRows, tokens
    });
  }

  // ===== GENERAR CLASES CSS =====
  
  const textareaClasses = [
    'textarea',
    `textarea--${size}`,
    `textarea--${variant}`,
    rounded !== 'md' && `textarea--rounded-${rounded}`,
    width === 'full' && 'textarea--full-width',
    autoResize && 'textarea--auto-resize',
    resize !== 'vertical' && `textarea--resize-${resize}`,
    isLoading && 'textarea--loading',
    isDisabled && 'textarea--disabled',
    readOnly && 'textarea--readonly',
    (leftIcon || rightIcon) && 'textarea--with-icons',
    showCounter && 'textarea--with-counter'
  ].filter(Boolean).join(' ');

  const wrapperClasses = [
    'textarea-wrapper',
    (leftIcon || rightIcon) && 'textarea-wrapper--with-icons',
    showCounter && 'textarea-wrapper--with-counter'
  ].filter(Boolean).join(' ');

  // ✅ COMBINAR CLASES: Sistema + Usuario
  const finalClassName = [textareaClasses, props.className]
    .filter(Boolean).join(' ');

  // ✅ PROPS MODIFICADAS: reemplazar className original con combinada
  const propsWithFinalClassName = { 
    ...props, 
    className: finalClassName 
  };

  // ===== CONTENEDOR CON ICONOS =====
  const hasIcons = leftIcon || rightIcon;

  if (hasIcons) {
    return (
      <div className={wrapperClasses}>
        {/* Icono izquierdo */}
        {leftIcon && (
          <div className="textarea__icon textarea__icon--left">
            {renderIcon(leftIcon)}
          </div>
        )}
        
        {/* TextArea principal */}
        <textarea
          {...extractDOMPropsV2(propsWithFinalClassName)}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          rows={autoResize ? dynamicRows : rows}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          maxLength={maxLength}
          disabled={isDisabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={textareaLabel}
          aria-disabled={isDisabled}
          aria-busy={isLoading}
          style={{
            // Aplicar tokens específicos necesarios
            ...(tokens.width && { width: tokens.width }),
            resize: resize,
            ...props.style
          }}
        />
        
        {/* Icono derecho */}
        {rightIcon && (
          <div className="textarea__icon textarea__icon--right">
            {renderIcon(rightIcon)}
          </div>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="textarea__loading-spinner" aria-hidden="true">
            <svg className="textarea__spinner-svg" viewBox="0 0 24 24">
              <circle 
                className="textarea__spinner-circle" 
                cx="12" cy="12" r="10" strokeWidth="2"
              />
            </svg>
          </div>
        )}

        {/* Contador de caracteres */}
        {showCounter && (
          <div 
            className={[
              'textarea__char-count',
              isNearLimit && 'textarea__char-count--warning',
              isOverLimit && 'textarea__char-count--error'
            ].filter(Boolean).join(' ')}
            aria-live="polite"
          >
            <span className="textarea__char-current">{currentLength}</span>
            <span className="textarea__char-separator">/</span>
            <span className="textarea__char-max">{maxLength}</span>
          </div>
        )}
      </div>
    );
  }

  // ===== TEXTAREA SIMPLE (SIN ICONOS) =====
  return (
    <div className={wrapperClasses}>
      <textarea
        {...extractDOMPropsV2(propsWithFinalClassName)}
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        rows={autoResize ? dynamicRows : rows}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        maxLength={maxLength}
        disabled={isDisabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={textareaLabel}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        style={{
          // Aplicar tokens específicos necesarios
          ...(tokens.width && { width: tokens.width }),
          resize: resize,
          ...props.style
        }}
      />

      {/* Loading spinner */}
      {isLoading && (
        <div className="textarea__loading-spinner" aria-hidden="true">
          <svg className="textarea__spinner-svg" viewBox="0 0 24 24">
            <circle 
              className="textarea__spinner-circle" 
              cx="12" cy="12" r="10" strokeWidth="2"
            />
          </svg>
        </div>
      )}

      {/* Contador de caracteres */}
      {showCounter && (
        <div 
          className={[
            'textarea__char-count',
            isNearLimit && 'textarea__char-count--warning',
            isOverLimit && 'textarea__char-count--error'
          ].filter(Boolean).join(' ')}
          aria-live="polite"
        >
          <span className="textarea__char-current">{currentLength}</span>
          <span className="textarea__char-separator">/</span>
          <span className="textarea__char-max">{maxLength}</span>
        </div>
      )}
    </div>
  );
});

// ✅ V2 PROPTYPES: Sistema de props helpers
TextArea.propTypes = {
  // ✅ PROPS HELPERS: Sistema centralizado
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas de TextArea
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  rows: PropTypes.number,
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
  autoResize: PropTypes.bool,
  maxLength: PropTypes.number,
  showCharCount: PropTypes.bool,
  resize: PropTypes.oneOf(['both', 'horizontal', 'vertical', 'none']),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  ariaLabel: PropTypes.string
};

// ✅ V2 DEFAULT PROPS: Mínimos (hook maneja la mayoría)
TextArea.defaultProps = {
  readOnly: false,
  required: false,
  autoFocus: false,
  rows: 4,
  minRows: 2,
  maxRows: 10,
  autoResize: false,
  showCharCount: false,
  resize: 'vertical'
};

// ===== METADATA PARA DESARROLLO Y AI =====

/**
 * 🎯 TEXTAREA META - CONTEXTO SEMÁNTICO
 */
export const TextAreaMeta = {
  componentName: 'TextArea',
  componentType: 'form',
  category: 'atoms',
  
  // Casos de uso principales
  useCases: [
    {
      name: 'Comments & Reviews',
      description: 'Campos para comentarios, reseñas, feedback de usuarios',
      examples: ['Comentario del producto', 'Reseña del servicio', 'Feedback'],
      recommendedProps: { rows: 4, maxLength: 500, showCharCount: true, autoResize: true }
    },
    {
      name: 'Long Form Content',
      description: 'Contenido largo como descripciones, biografías',
      examples: ['Descripción del producto', 'Biografía del autor', 'Contenido del artículo'],
      recommendedProps: { rows: 6, autoResize: true, maxLength: 2000, showCharCount: true }
    },
    {
      name: 'Messages & Communication',
      description: 'Mensajes, correos, comunicación interpersonal',
      examples: ['Mensaje privado', 'Correo electrónico', 'Chat grupal'],
      recommendedProps: { rows: 3, autoResize: true, minRows: 2, maxRows: 8 }
    },
    {
      name: 'Code & Technical Input',
      description: 'Entrada de código, configuraciones, datos técnicos',
      examples: ['Snippet de código', 'Configuración JSON', 'SQL Query'],
      recommendedProps: { rows: 8, resize: 'both', variant: 'neutral' }
    }
  ],
  
  // Guidelines por variante
  variantGuidelines: {
    primary: 'Campos principales del formulario, entrada importante',
    secondary: 'Campos opcionales, información adicional',
    success: 'Campos con contenido validado correctamente',
    warning: 'Campos que requieren atención o revisión',
    danger: 'Campos con errores o contenido problemático',
    neutral: 'Campos técnicos, código, configuración'
  },
  
  // Guidelines por tamaño
  sizeGuidelines: {
    xs: 'Comentarios breves, notas pequeñas',
    sm: 'Formularios compactos, campos secundarios',
    md: 'Uso general, formularios estándar (DEFAULT)',
    lg: 'Campos importantes, contenido principal',
    xl: 'Editores principales, contenido hero'
  },
  
  // Características técnicas
  technicalFeatures: {
    autoResize: 'Expande automáticamente según el contenido',
    charCount: 'Contador visual con estados de advertencia',
    iconSupport: 'Iconos izquierdo/derecho como Input',
    accessibility: 'ARIA completo + screen reader support',
    responsive: 'Mobile-first con touch optimization'
  }
};

// Asignar displayName para depuración
TextArea.displayName = 'TextArea';

export { TextArea };