import PropTypes from 'prop-types';
import './Divider.css';

/**
 * Divider - Átomo separador versátil para organizar contenido
 * 
 * Características:
 * - ✅ Orientación horizontal/vertical
 * - ✅ Variantes visuales (solid, dashed, dotted, gradient)
 * - ✅ Espaciado configurable (none, xs, sm, md, lg, xl)
 * - ✅ Texto opcional en el medio (solo horizontal)
 * - ✅ Colores semánticos del sistema
 * - ✅ Grosor configurable (thin, normal, thick)
 * - ✅ Responsive y accesible
 * 
 * @param {'horizontal'|'vertical'} [orientation='horizontal'] - Orientación del divider
 * @param {'solid'|'dashed'|'dotted'|'gradient'} [variant='solid'] - Estilo visual
 * @param {'none'|'xs'|'sm'|'md'|'lg'|'xl'} [spacing='md'] - Espaciado alrededor
 * @param {'thin'|'normal'|'thick'} [thickness='normal'] - Grosor de la línea
 * @param {'muted'|'light'|'primary'|'secondary'|'danger'} [color='muted'] - Color del divider
 * @param {string|React.ReactNode} [text] - Texto opcional en el medio (solo horizontal)
 * @param {'center'|'left'|'right'} [textAlign='center'] - Alineación del texto
 * @param {string|number} [length] - Longitud personalizada (CSS value)
 * @param {string} [className=''] - Clases CSS adicionales
 * @param {string} [ariaLabel] - Etiqueta de accesibilidad
 */
function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  spacing = 'md',
  thickness = 'normal',
  color = 'muted',
  text,
  textAlign = 'center',
  length,
  className = '',
  ariaLabel,
  style = {},
  ...restProps
}) {
  // Generar clases CSS
  const dividerClasses = [
    'divider',
    `divider--${orientation}`,
    `divider--variant-${variant}`,
    `divider--spacing-${spacing}`,
    `divider--thickness-${thickness}`,
    `divider--color-${color}`,
    text && orientation === 'horizontal' && 'divider--with-text',
    text && `divider--text-${textAlign}`,
    className
  ].filter(Boolean).join(' ');

  // Estilos dinámicos
  const dynamicStyles = {
    ...style,
    ...(length && {
      [orientation === 'horizontal' ? 'width' : 'height']: length
    })
  };

  // Props de accesibilidad
  const accessibilityProps = {
    role: text ? 'separator' : 'presentation',
    'aria-label': ariaLabel || (text ? `Separador: ${text}` : undefined),
    'aria-orientation': orientation,
    ...restProps
  };

  // Si es horizontal con texto
  if (orientation === 'horizontal' && text) {
    return (
      <div 
        className={dividerClasses}
        style={dynamicStyles}
        {...accessibilityProps}
      >
        <span className="divider__line divider__line--before"></span>
        <span className="divider__text">{text}</span>
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
    />
  );
}

Divider.propTypes = {
  /** Orientación del divider */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  
  /** Estilo visual del divider */
  variant: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'gradient']),
  
  /** Espaciado alrededor del divider */
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  
  /** Grosor de la línea */
  thickness: PropTypes.oneOf(['thin', 'normal', 'thick']),
  
  /** Color del divider */
  color: PropTypes.oneOf(['muted', 'light', 'primary', 'secondary', 'danger']),
  
  /** Texto opcional en el medio (solo para horizontal) */
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  
  /** Alineación del texto */
  textAlign: PropTypes.oneOf(['center', 'left', 'right']),
  
  /** Longitud personalizada del divider */
  length: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  /** Clases CSS adicionales */
  className: PropTypes.string,
  
  /** Etiqueta de accesibilidad */
  ariaLabel: PropTypes.string,
  
  /** Estilos CSS inline */
  style: PropTypes.object
};

export { Divider };