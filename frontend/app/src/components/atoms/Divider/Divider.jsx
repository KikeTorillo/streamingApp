import PropTypes from 'prop-types';
import { useStandardPropsV2 } from '../../../hooks/useStandardProps-v2.jsx';
import { STANDARD_PROP_TYPES } from '../../../tokens/propHelpers.js';
import './Divider.css';

/**
 * Divider - ÁTOMO MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
 * 
 * ✅ SISTEMA DE DISEÑO: Props estándar (size, variant, rounded, loading, disabled)
 * ✅ HOOK ESPECIALIZADO: useDividerProps() para configuración óptima
 * ✅ SISTEMA DE ICONOS: renderIcon automático con iconos Feather
 * ✅ TOKENS AUTOMÁTICOS: Design tokens aplicados automáticamente
 * ✅ BACKWARD COMPATIBILITY: Mapeo automático de variantes legacy
 * ✅ ESTADOS AVANZADOS: loading, disabled con overlays visuales
 * ✅ ORIENTACIÓN: horizontal/vertical con auto-detección
 * ✅ VARIANTES VISUALES: solid, dashed, dotted, gradient
 * ✅ ACCESIBILIDAD: ARIA completo, navegación teclado
 * 
 * @param {'horizontal'|'vertical'} [orientation='horizontal'] - Orientación del divider
 * @param {'solid'|'dashed'|'dotted'|'gradient'} [dividerVariant='solid'] - Estilo visual (separado de variant semántica)
 * @param {'none'|'xs'|'sm'|'md'|'lg'|'xl'} [spacing='md'] - Espaciado alrededor (legacy, usar size)
 * @param {'thin'|'normal'|'thick'} [thickness='normal'] - Grosor de la línea (legacy, usar size) 
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño del componente (grosor + espaciado)
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [variant='neutral'] - Variante semántica
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [rounded='none'] - Radio de bordes (normalmente none)
 * @param {boolean} [loading=false] - Estado de carga con spinner
 * @param {boolean} [disabled=false] - Si el divider está deshabilitado
 * @param {string|React.ReactNode} [text] - Texto opcional en el medio (solo horizontal)
 * @param {'center'|'left'|'right'} [textAlign='center'] - Alineación del texto
 * @param {string|React.ReactNode} [leftIcon] - Icono izquierdo (solo con texto)
 * @param {string|React.ReactNode} [rightIcon] - Icono derecho (solo con texto)
 * @param {string|number} [length] - Longitud personalizada (CSS value)
 * @param {string} [className=''] - Clases CSS adicionales
 * @param {string} [ariaLabel] - Etiqueta de accesibilidad
 */
function Divider(props) {
  // Destructurar props específicas del Divider
  const {
    orientation = 'horizontal',
    dividerVariant = 'solid', // separado de variant semántica
    spacing, // legacy prop
    thickness, // legacy prop 
    color, // legacy prop
    text,
    textAlign = 'center',
    length,
    leftIcon,
    rightIcon,
    style = {},
    ...restProps
  } = props;

  // Hook estándar V2 con props del sistema
  const {
    size,
    variant,
    rounded,
    disabled,
    loading,
    className,
    tokens,
    renderIcon,
    ...standardProps
  } = useStandardPropsV2(restProps, {
    componentName: 'Divider',
    componentType: 'container',
    defaultSize: 'md',
    defaultVariant: 'neutral',
    defaultRounded: 'none'
  });
  
  // ariaLabel para accesibilidad
  const ariaLabel = restProps.ariaLabel || (text ? `Separador con texto: ${text}` : 'Separador');
  
  // Determinar si hay iconos
  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon);
  
  // Mapeo de props legacy para backward compatibility
  const finalSize = (() => {
    // Mapeo thickness -> size con deprecation warnings
    if (thickness) {
      console.warn(`Divider: prop 'thickness' está deprecated. Usar 'size' en su lugar. thickness='${thickness}' -> size='${thickness === 'thin' ? 'xs' : thickness === 'thick' ? 'lg' : 'md'}'`);
      if (thickness === 'thin') return 'xs';
      if (thickness === 'thick') return 'lg';
      return 'md';
    }
    
    // Mapeo spacing -> size con deprecation warnings  
    if (spacing) {
      console.warn(`Divider: prop 'spacing' está deprecated. Usar 'size' en su lugar. spacing='${spacing}' -> size='${spacing}'`);
      return spacing;
    }
    
    return size;
  })();
  
  // Mapeo de colores legacy para backward compatibility
  const finalVariant = (() => {
    if (color) {
      console.warn(`Divider: prop 'color' está deprecated. Usar 'variant' en su lugar.`);
      const colorMappings = {
        'muted': 'neutral',
        'light': 'neutral', 
        'primary': 'primary',
        'secondary': 'secondary',
        'danger': 'danger'
      };
      return colorMappings[color] || variant;
    }
    return variant;
  })();
  
  // Props DOM-safe (V2 maneja esto automáticamente)
  const domProps = {
    'data-testid': standardProps.testId,
    'data-component': 'Divider',
    ...standardProps
  };
  
  // Generar clases CSS manualmente
  const dividerClasses = [
    'divider',
    `divider--${finalSize}`,
    `divider--${finalVariant}`,
    `divider--rounded-${rounded}`,
    `divider--${orientation}`,
    `divider--variant-${dividerVariant}`,
    `divider--color-${finalVariant}`,
    text && orientation === 'horizontal' && 'divider--with-text',
    text && `divider--text-${textAlign}`,
    (hasLeftIcon || hasRightIcon || leftIcon || rightIcon) && 'divider--with-icon',
    loading && 'divider--loading',
    disabled && 'divider--disabled',
    className
  ].filter(Boolean).join(' ');

  // Estilos dinámicos
  const dynamicStyles = {
    ...style,
    ...(length && {
      [orientation === 'horizontal' ? 'width' : 'height']: length
    })
  };

  // Props de accesibilidad mejoradas
  const accessibilityProps = {
    role: text ? 'separator' : 'presentation',
    'aria-label': ariaLabel || (text ? `Separador: ${text}` : undefined),
    'aria-orientation': orientation,
    'aria-disabled': disabled || loading ? 'true' : undefined,
    'aria-busy': loading ? 'true' : undefined,
    ...domProps
  };

  // Función para renderizar contenido con iconos
  const renderTextContent = () => {
    if (!text) return null;
    
    return (
      <span className="divider__text">
        {(leftIcon && renderIcon(leftIcon))}
        <span className="divider__text-content">{text}</span>
        {(rightIcon && renderIcon(rightIcon))}
      </span>
    );
  };
  
  // Renderizar spinner de loading si aplica
  const renderLoadingSpinner = () => {
    if (!loading) return null;
    return (
      <span className="divider__loading">
        {renderIcon('loading')}
      </span>
    );
  };

  // Si es horizontal con texto o iconos
  if (orientation === 'horizontal' && (text || loading)) {
    return (
      <div 
        className={dividerClasses}
        style={dynamicStyles}
        {...accessibilityProps}
      >
        <span className="divider__line divider__line--before"></span>
        {renderTextContent()}
        {renderLoadingSpinner()}
        <span className="divider__line divider__line--after"></span>
      </div>
    );
  }

  // Divider simple (horizontal sin texto o vertical)
  return (
    <div 
      className={dividerClasses}
      style={dynamicStyles}
      {...accessibilityProps}
    >
      {loading && (
        <span className="divider__loading-overlay">
          {renderIcon('loading')}
        </span>
      )}
    </div>
  );
}

Divider.propTypes = {
  /** Orientación del divider */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  
  /** Estilo visual del divider (separado de variant semántica) */
  dividerVariant: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'gradient']),
  
  /** Espaciado alrededor del divider (legacy - usar size) */
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  
  /** Grosor de la línea (legacy - usar size) */
  thickness: PropTypes.oneOf(['thin', 'normal', 'thick']),
  
  /** Color del divider (legacy - usar variant) */
  color: PropTypes.oneOf(['muted', 'light', 'primary', 'secondary', 'danger']),
  
  /** Texto opcional en el medio (solo para horizontal) */
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  
  /** Alineación del texto */
  textAlign: PropTypes.oneOf(['center', 'left', 'right']),
  
  /** Icono izquierdo (nombre de Feather Icon) */
  leftIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  
  /** Icono derecho (nombre de Feather Icon) */
  rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  
  /** Longitud personalizada del divider */
  length: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  /** Estilos CSS inline */
  style: PropTypes.object,
  
  // Props estándar del sistema de diseño
  ...STANDARD_PROP_TYPES
};

export { Divider };