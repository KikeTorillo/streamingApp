import PropTypes from 'prop-types';
import { Icon } from '../Icon/Icon';
import './Label.css';

/**
 * Label - Átomo de etiqueta standalone para formularios y elementos
 * 
 * Características:
 * - ✅ Indicadores required/optional visuales
 * - ✅ Variantes semánticas (default, primary, secondary, success, warning, danger)
 * - ✅ Tamaños estándar (xs, sm, md, lg, xl)
 * - ✅ Iconos opcionales (izquierdo/derecho)
 * - ✅ Tooltip informativo opcional
 * - ✅ Integración con inputs (htmlFor)
 * - ✅ Estados interactivos (hover, focus, disabled)
 * - ✅ Accesibilidad completa
 * - ✅ Responsive y modo oscuro
 * 
 * @param {React.ReactNode} children - Contenido de la etiqueta
 * @param {string} [text] - Alternativa a children para texto simple
 * @param {string} [htmlFor] - ID del elemento asociado (input)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño de la etiqueta
 * @param {'default'|'primary'|'secondary'|'success'|'warning'|'danger'} [variant='default'] - Variante visual
 * @param {boolean} [required=false] - Marca como requerido (asterisco rojo)
 * @param {boolean} [optional=false] - Marca como opcional (texto "opcional")
 * @param {string} [leftIcon] - Icono izquierdo (nombre de Feather Icon)
 * @param {string} [rightIcon] - Icono derecho (nombre de Feather Icon)
 * @param {string} [tooltip] - Texto de tooltip informativo
 * @param {boolean} [disabled=false] - Estado deshabilitado
 * @param {boolean} [bold=false] - Texto en negrita
 * @param {string} [className=''] - Clases CSS adicionales
 * @param {string} [ariaLabel] - Etiqueta de accesibilidad
 */
function Label({
  children,
  text,
  htmlFor,
  size = 'md',
  variant = 'default',
  required = false,
  optional = false,
  leftIcon,
  rightIcon,
  tooltip,
  disabled = false,
  bold = false,
  className = '',
  ariaLabel,
  onClick,
  ...restProps
}) {
  // Determinar contenido de la etiqueta
  const labelContent = children || text;

  // Generar clases CSS
  const labelClasses = [
    'label',
    `label--size-${size}`,
    `label--variant-${variant}`,
    required && 'label--required',
    optional && 'label--optional',
    disabled && 'label--disabled',
    bold && 'label--bold',
    (leftIcon || rightIcon) && 'label--with-icon',
    onClick && 'label--clickable',
    className
  ].filter(Boolean).join(' ');

  // Props de accesibilidad
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-disabled': disabled ? 'true' : undefined,
    'title': tooltip,
    ...restProps
  };

  // Props del elemento label
  const labelProps = {
    className: labelClasses,
    htmlFor: htmlFor,
    onClick: disabled ? undefined : onClick,
    ...accessibilityProps
  };

  return (
    <label {...labelProps}>
      {/* Icono izquierdo */}
      {leftIcon && (
        <Icon 
          name={leftIcon} 
          size={size === 'xs' ? 'xs' : size === 'sm' ? 'xs' : 'sm'} 
          className="label__icon label__icon--left" 
        />
      )}

      {/* Contenido principal */}
      <span className="label__text">
        {labelContent}
        
        {/* Indicador de requerido */}
        {required && (
          <span className="label__required" aria-label="Campo requerido">
            *
          </span>
        )}
        
        {/* Indicador de opcional */}
        {optional && !required && (
          <span className="label__optional" aria-label="Campo opcional">
            (opcional)
          </span>
        )}
      </span>

      {/* Icono derecho */}
      {rightIcon && (
        <Icon 
          name={rightIcon} 
          size={size === 'xs' ? 'xs' : size === 'sm' ? 'xs' : 'sm'} 
          className="label__icon label__icon--right" 
        />
      )}

      {/* Tooltip info */}
      {tooltip && (
        <Icon 
          name="info" 
          size="xs" 
          className="label__tooltip-icon" 
          title={tooltip}
          ariaLabel={`Información: ${tooltip}`}
        />
      )}
    </label>
  );
}

Label.propTypes = {
  /** Contenido de la etiqueta */
  children: PropTypes.node,
  
  /** Alternativa a children para texto simple */
  text: PropTypes.string,
  
  /** ID del elemento asociado (input) */
  htmlFor: PropTypes.string,
  
  /** Tamaño de la etiqueta */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  
  /** Variante visual de la etiqueta */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'danger']),
  
  /** Marca como campo requerido */
  required: PropTypes.bool,
  
  /** Marca como campo opcional */
  optional: PropTypes.bool,
  
  /** Icono izquierdo (nombre de Feather Icon) */
  leftIcon: PropTypes.string,
  
  /** Icono derecho (nombre de Feather Icon) */
  rightIcon: PropTypes.string,
  
  /** Texto de tooltip informativo */
  tooltip: PropTypes.string,
  
  /** Estado deshabilitado */
  disabled: PropTypes.bool,
  
  /** Texto en negrita */
  bold: PropTypes.bool,
  
  /** Clases CSS adicionales */
  className: PropTypes.string,
  
  /** Etiqueta de accesibilidad */
  ariaLabel: PropTypes.string,
  
  /** Handler de click (para labels clickeables) */
  onClick: PropTypes.func
};

export { Label };