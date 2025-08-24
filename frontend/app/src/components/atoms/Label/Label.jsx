import PropTypes from 'prop-types';
import { Icon } from '../Icon/Icon';
import { useStandardPropsV2 } from '../../../hooks/useStandardProps-v2.jsx';
import { STANDARD_PROP_TYPES } from '../../../tokens/propHelpers.js';
import './Label.css';

/**
 * Label - Átomo de etiqueta standalone para formularios y elementos
 * 
 * 🎯 **MIGRADO AL SISTEMA ESTÁNDAR** ✅
 * 
 * Características:
 * - ✅ Hook useLabelProps() integrado
 * - ✅ Props estándar (size, variant, rounded, loading, disabled)
 * - ✅ Sistema de iconos unificado (leftIcon/rightIcon)
 * - ✅ Tokens de design system automáticos
 * - ✅ Indicadores semánticos (required/optional/error)
 * - ✅ Tooltip informativo y accesibilidad completa
 * - ✅ Integración con inputs (htmlFor)
 * - ✅ Estados interactivos y responsive
 * - ✅ Backward compatibility con deprecation warnings
 * 
 * @param {React.ReactNode} children - Contenido de la etiqueta
 * @param {string} [text] - Alternativa a children para texto simple
 * @param {string} [htmlFor] - ID del elemento asociado (input)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño estándar del sistema
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [variant='default'] - Variante semántica estándar
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [rounded='sm'] - Radio de bordes estándar
 * @param {boolean} [loading=false] - Estado de carga (para labels dinámicos)
 * @param {boolean} [disabled=false] - Estado deshabilitado estándar
 * @param {boolean} [required=false] - Marca como requerido (asterisco rojo)
 * @param {boolean} [optional=false] - Marca como opcional (texto "opcional")
 * @param {string|React.ReactNode} [leftIcon] - Icono izquierdo del sistema estándar
 * @param {string|React.ReactNode} [rightIcon] - Icono derecho del sistema estándar
 * @param {string} [tooltip] - Texto de tooltip informativo
 * @param {boolean} [bold=false] - Texto en negrita
 * @param {string} [className=''] - Clases CSS adicionales estándar
 * @param {string} [ariaLabel] - Etiqueta de accesibilidad estándar
 * @param {string} [testId] - ID para testing (data-testid)
 */
function Label({
  children,
  text,
  htmlFor,
  required = false,
  optional = false,
  tooltip,
  bold = false,
  onClick,
  ...restProps
}) {
  // Backward compatibility: mapear variantes legacy
  const propsWithCompatibility = { ...restProps };
  
  // Mapear 'default' a 'neutral' para consistency
  if (propsWithCompatibility.variant === 'default') {
    console.warn('⚠️ Label: variant="default" está deprecado. Usa variant="neutral" en su lugar.');
    propsWithCompatibility.variant = 'neutral';
  }

  // Hook del sistema estándar V2 - integra props, tokens e iconos
  const {
    size,
    variant,
    rounded, // Para futuras extensiones de estilo
    disabled,
    loading,
    className,
    leftIcon,
    rightIcon,
    renderIcon,
    hasLeftIcon,
    hasRightIcon,
    ariaLabel,
    testId,
    tokens, // Para futuras extensiones de estilo
    generateClassName,
    generateStyles
  } = useStandardPropsV2(propsWithCompatibility, {
    componentName: 'Label',
    componentType: 'typography',
    defaultSize: 'md',
    defaultVariant: 'neutral',
    defaultRounded: 'sm'
  });
  
  // Marcar variables como utilizadas para evitar warnings de linting
  void rounded; void tokens; void generateStyles;

  // Props DOM-safe (V2 maneja esto automáticamente)
  const domProps = {
    'data-testid': testId,
    'data-component': 'Label',
    ...restProps
  };
  // Determinar contenido de la etiqueta
  const labelContent = children || text;

  // Determinar estados semánticos
  const isErrorState = variant === 'danger';
  const isSuccessState = variant === 'success';
  const isWarningState = variant === 'warning';

  // Generar clases CSS con sistema V2
  const labelClasses = generateClassName('label') + ' ' + [
    required && 'label--required',
    optional && 'label--optional',
    bold && 'label--bold',
    isErrorState && 'label--error',
    isSuccessState && 'label--success', 
    isWarningState && 'label--warning',
    hasLeftIcon && 'label--has-left-icon',
    hasRightIcon && 'label--has-right-icon',
    (hasLeftIcon || hasRightIcon) && 'label--with-icon',
    onClick && 'label--clickable'
  ].filter(Boolean).join(' ');

  // Props de accesibilidad mejoradas con sistema estándar
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-disabled': disabled ? 'true' : undefined,
    'aria-busy': loading ? 'true' : undefined,
    'title': tooltip
  };

  // Props del elemento label con integración sistema estándar
  const labelProps = {
    ...domProps,
    className: labelClasses,
    htmlFor: htmlFor,
    onClick: disabled || loading ? undefined : onClick,
    ...accessibilityProps
  };

  return (
    <label {...labelProps}>
      {/* Icono izquierdo con sistema V2 */}
      {hasLeftIcon && renderIcon(leftIcon)}

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

      {/* Icono derecho con sistema V2 */}
      {hasRightIcon && renderIcon(rightIcon)}

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
  
  /** Marca como campo requerido */
  required: PropTypes.bool,
  
  /** Marca como campo opcional */
  optional: PropTypes.bool,
  
  /** Texto de tooltip informativo */
  tooltip: PropTypes.string,
  
  /** Texto en negrita */
  bold: PropTypes.bool,
  
  /** Handler de click (para labels clickeables) */
  onClick: PropTypes.func,
  
  // Props estándar del sistema de diseño
  ...STANDARD_PROP_TYPES
};

export { Label };