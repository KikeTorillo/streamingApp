// src/components/atoms/FileInput/FileInput.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { useFileInputProps } from '../../../hooks/useStandardProps.jsx';
import { STANDARD_PROP_TYPES } from '../../../tokens/standardProps.js';
import "./FileInput.css";

/**
 * FileInput - ÁTOMO MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
 * 
 * ✅ SISTEMA DE DISEÑO: Props estándar (size, variant, rounded, loading, disabled)
 * ✅ HOOK ESPECIALIZADO: useFileInputProps() para configuración óptima
 * ✅ SISTEMA DE ICONOS: renderIcon automático con iconos Feather
 * ✅ TOKENS AUTOMÁTICOS: Design tokens aplicados automáticamente
 * ✅ BACKWARD COMPATIBILITY: Mapeo automático de variantes legacy
 * ✅ ESTADOS AVANZADOS: loading, disabled con overlays visuales
 * ✅ ACCESIBILIDAD: ARIA completo, focus management, keyboard support
 * ✅ RESPONSIVE: Mobile-first, área táctil adecuada
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.id] - ID único para el input
 * @param {string} [props.name] - Nombre del campo para formularios
 * @param {string} [props.accept] - Tipos MIME permitidos (ej: "image/*")
 * @param {boolean} [props.multiple=false] - Permite seleccionar múltiples archivos
 * @param {boolean} [props.required=false] - Si el campo es obligatorio
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del componente
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='neutral'] - Variante semántica
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {boolean} [props.loading=false] - Estado de carga con spinner
 * @param {boolean} [props.disabled=false] - Si el input está deshabilitado
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo (automático)
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho
 * @param {string} [props.text='Seleccionar archivo'] - Texto del botón
 * @param {string} [props.helperText] - Texto de ayuda
 * @param {string} [props.errorText] - Mensaje de error
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {function} [props.onChange] - Handler cuando se selecciona archivo
 * @param {function} [props.onFocus] - Handler cuando obtiene foco
 * @param {function} [props.onBlur] - Handler cuando pierde foco
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.ariaDescribedBy] - ID del elemento descriptivo
 */
function FileInput(props) {
  // Destructurar props específicas del FileInput
  const {
    id,
    name,
    accept,
    multiple = false,
    required = false,
    text = 'Seleccionar archivo',
    helperText,
    errorText,
    onChange = () => {},
    onFocus = () => {},
    onBlur = () => {},
    ariaDescribedBy,
    ...restProps
  } = props;

  // Hook especializado con props estándar
  const {
    size,
    variant,
    rounded,
    disabled,
    loading,
    className,
    leftIcon,
    rightIcon,
    tokens,
    renderIcon,
    hasLeftIcon,
    hasRightIcon,
    ariaLabel,
    ...standardProps
  } = useFileInputProps(restProps);

  // Mapeo de variantes legacy para backward compatibility
  const mappedVariant = (() => {
    // Props específicas de error text override variant
    if (errorText) return 'danger';
    
    // Mapear variantes legacy a estándar
    const legacyMappings = {
      'default': 'neutral',
      'error': 'danger'
      // 'success' y 'warning' ya existen en el sistema estándar
    };
    
    return legacyMappings[variant] || variant;
  })();

  
  // Evitar warning de unused vars con void
  void tokens; // Design tokens disponibles para estilos dinámicos si se necesitan
  // Estado interno para controlar archivos seleccionados
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [focused, setFocused] = useState(false);

  // Estados computados
  const hasError = Boolean(errorText);
  const hasFiles = selectedFiles.length > 0;
  const currentVariant = mappedVariant;

  // Generar IDs únicos si no se proporcionan
  const inputId = id || `file-input-${Math.random().toString(36).substring(2, 11)}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  // Generar clases CSS con sistema estándar
  const wrapperClasses = [
    'file-input-wrapper',
    loading && 'file-input-wrapper--loading',
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'file-input',
    `file-input--${size}`,
    `file-input--${currentVariant}`,
    `file-input--rounded-${rounded}`,
    focused && 'file-input--focused',
    disabled && 'file-input--disabled',
    loading && 'file-input--loading',
    hasFiles && 'file-input--has-files'
  ].filter(Boolean).join(' ');

  // Handler de cambio de archivo
  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    onChange(e);
  };

  // Handler de foco
  const handleFocus = (e) => {
    setFocused(true);
    onFocus(e);
  };

  // Handler de blur
  const handleBlur = (e) => {
    setFocused(false);
    onBlur(e);
  };

  return (
    <div className={wrapperClasses}>
      {/* Input file que actúa como botón visualmente */}
      <div className={inputClasses}>
        {/* Input file oculto completamente */}
        <input
          ref={(input) => {
            if (input) {
              // Accesibilidad mejorada
              input.setAttribute('aria-label', ariaLabel || text);
              if (describedBy) {
                input.setAttribute('aria-describedby', describedBy);
              }
            }
          }}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          className="file-input__native-input"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* Label que actúa como botón visual */}
        <label htmlFor={inputId} className="file-input__button-overlay">
          {/* Icono izquierdo - sistema unificado */}
          {(hasLeftIcon || !hasFiles) && (
            <div className="file-input__icon">
              {hasFiles ? (
                renderIcon('check-circle') // Icono de éxito del sistema
              ) : hasLeftIcon ? (
                renderIcon(leftIcon)
              ) : (
                renderIcon('upload') // Icono upload por defecto
              )}
            </div>
          )}

          {/* Spinner de loading */}
          {loading && (
            <div className="file-input__spinner">
              {renderIcon('loader')}
            </div>
          )}

          {/* Texto del botón */}
          <span className="file-input__text">
            {loading ? (
              'Cargando...'
            ) : hasFiles ? (
              `${selectedFiles.length} archivo${selectedFiles.length !== 1 ? 's' : ''} seleccionado${selectedFiles.length !== 1 ? 's' : ''}`
            ) : (
              text
            )}
          </span>

          {/* Icono derecho */}
          {hasRightIcon && (
            <div className="file-input__icon file-input__icon--right">
              {renderIcon(rightIcon)}
            </div>
          )}

          {/* Indicador de requerido */}
          {required && (
            <span className="file-input__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>

      {/* Overlay de loading */}
      {loading && (
        <div className="file-input__loading-overlay">
          <div className="file-input__loading-content">
            {renderIcon('loader')}
            <span>Procesando archivo...</span>
          </div>
        </div>
      )}

      {/* Información de archivos seleccionados */}
      {hasFiles && !loading && (
        <div className="file-input__files-info">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-input__file-item">
              <div className="file-input__file-icon">
                {renderIcon('file')}
              </div>
              <span className="file-input__file-name">{file.name}</span>
              <span className="file-input__file-size">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Texto de ayuda */}
      {helperText && !hasError && !loading && (
        <div id={helperId} className="file-input__helper-text">
          {helperText}
        </div>
      )}

      {/* Mensaje de error */}
      {errorText && (
        <div id={errorId} className="file-input__error-text" role="alert">
          <div className="file-input__error-icon">
            {renderIcon('alert-circle')}
          </div>
          {errorText}
        </div>
      )}
    </div>
  );
}

FileInput.propTypes = {
  // Props específicas del FileInput
  id: PropTypes.string,
  name: PropTypes.string,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  text: PropTypes.string,
  helperText: PropTypes.string,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  ariaDescribedBy: PropTypes.string,
  
  // Props estándar del sistema de diseño
  ...STANDARD_PROP_TYPES,
  
  // Backward compatibility - variantes legacy (con deprecation warnings)
  variant: PropTypes.oneOf([
    // Nuevas variantes estándar
    'primary', 'secondary', 'success', 'warning', 'danger', 'neutral',
    // Variantes legacy (deprecadas)
    'default', 'error'
  ])
};

export { FileInput };