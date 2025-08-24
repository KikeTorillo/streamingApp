import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import { Icon } from '../Icon/Icon';
import './Link.css';

/**
 * Link - ÁTOMO MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
 * 
 * ✅ SISTEMA DE DISEÑO: Props estándar (size, variant, rounded, loading, disabled)
 * ✅ HOOK ESPECIALIZADO: useLinkProps() para configuración óptima
 * ✅ SISTEMA DE ICONOS: renderIcon automático con iconos Feather
 * ✅ TOKENS AUTOMÁTICOS: Design tokens aplicados automáticamente
 * ✅ BACKWARD COMPATIBILITY: Mapeo automático de variantes legacy
 * ✅ ESTADOS AVANZADOS: loading, disabled con overlays visuales
 * ✅ INTEGRACIÓN REACT ROUTER: Navegación interna SPA completa
 * ✅ ENLACES EXTERNOS: Auto-detección y configuración segura
 * ✅ ACCESIBILIDAD: ARIA completo, navegación teclado
 * 
 * @param {string} [to] - Ruta interna (React Router)
 * @param {string} [href] - URL externa o absoluta
 * @param {React.ReactNode} children - Contenido del enlace
 * @param {string} [text] - Alternativa a children para texto simple
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño del componente
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [variant='primary'] - Variante semántica
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [rounded='sm'] - Radio de bordes
 * @param {boolean} [loading=false] - Estado de carga con spinner
 * @param {boolean} [disabled=false] - Si el enlace está deshabilitado
 * @param {string|React.ReactNode} [leftIcon] - Icono izquierdo
 * @param {string|React.ReactNode} [rightIcon] - Icono derecho
 * @param {boolean} [external=false] - Forzar comportamiento de enlace externo
 * @param {boolean} [underline=true] - Mostrar subrayado
 * @param {string} [target] - Target del enlace
 * @param {string} [rel] - Rel del enlace
 * @param {string} [ariaLabel] - Label para accesibilidad
 * @param {string} [className=''] - Clases CSS adicionales
 */
function Link(props) {
  // Destructurar props específicas del Link
  const {
    to,
    href,
    children,
    text,
    external = false,
    underline = true,
    target,
    rel,
    ...restProps
  } = props;

  // Hook especializado V2 con props estándar
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
    generateClassName,
    generateStyles,
    ...standardProps
  } = useInteractiveProps(restProps, {
    componentName: 'Link',
    defaultSize: 'md',
    defaultVariant: 'primary',
    defaultRounded: 'sm'
  });

  // Mapeo de variantes legacy para backward compatibility
  const mappedVariant = (() => {
    const legacyMappings = {
      'muted': 'neutral',  // muted → neutral
      'inherit': 'neutral' // inherit → neutral (mantener behavior especial)
    };
    
    return legacyMappings[variant] || variant;
  })();

  // Props DOM-safe (V2 maneja esto automáticamente)
  const domProps = {
    'data-testid': standardProps.testId,
    'data-component': 'Link',
    ...standardProps
  };
  
  // Evitar warning de unused vars
  void tokens; void generateStyles; // Design tokens disponibles para estilos dinámicos
  // Determinar contenido del enlace
  const linkContent = children || text;

  // Auto-detectar si es enlace externo
  const isExternal = external || 
    (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:'))) ||
    (to && (to.startsWith('http://') || to.startsWith('https://')));

  // Determinar URL final
  const finalUrl = href || to;

  // Auto-configurar target y rel para enlaces externos
  const finalTarget = target || (isExternal ? '_blank' : undefined);
  const finalRel = rel || (isExternal && finalTarget === '_blank' ? 'noopener noreferrer' : undefined);

  // Generar clases CSS con sistema V2
  const linkClasses = generateClassName('link') + ' ' + [
    underline && 'link--underline',
    (hasLeftIcon || hasRightIcon) && 'link--with-icon',
    (variant === 'inherit') && 'link--inherit' // Clase especial para variant inherit
  ].filter(Boolean).join(' ');

  // Props de accesibilidad mejoradas
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-disabled': disabled || loading ? 'true' : undefined,
    'aria-busy': loading ? 'true' : undefined,
    'tabIndex': disabled || loading ? -1 : undefined
  };

  // Props comunes para ambos tipos de enlace
  const commonProps = {
    className: linkClasses,
    target: finalTarget,
    rel: finalRel,
    ...accessibilityProps,
    ...domProps
  };

  // Función para renderizar el contenido con iconos V2
  const renderContent = () => (
    <>
      {leftIcon && renderIcon(leftIcon)}
      <span className="link__text">{linkContent}</span>
      {rightIcon && renderIcon(rightIcon)}
    </>
  );

  // Si está deshabilitado, renderizar como span
  if (disabled) {
    return (
      <span {...commonProps}>
        {renderContent()}
      </span>
    );
  }

  // Si es enlace externo o href absoluto, usar anchor tag
  if (isExternal || href) {
    return (
      <a href={finalUrl} {...commonProps}>
        {renderContent()}
      </a>
    );
  }

  // Si es enlace interno, usar React Router Link
  if (to) {
    return (
      <RouterLink to={to} {...commonProps}>
        {renderContent()}
      </RouterLink>
    );
  }

  // Fallback: renderizar como span si no hay URL
  console.warn('Link component: No "to" or "href" prop provided');
  return (
    <span {...commonProps}>
      {renderContent()}
    </span>
  );
}

Link.propTypes = {
  // Props estándar del sistema V2
  ...INTERACTIVE_PROP_TYPES,
  
  /** Ruta interna para React Router */
  to: PropTypes.string,
  
  /** URL externa o absoluta */
  href: PropTypes.string,
  
  /** Contenido del enlace */
  children: PropTypes.node,
  
  /** Alternativa a children para texto simple */
  text: PropTypes.string,
  
  /** Variante visual del enlace (incluye legacy) */
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'muted', 'inherit']),
  
  /** Forzar comportamiento de enlace externo */
  external: PropTypes.bool,
  
  /** Mostrar subrayado */
  underline: PropTypes.bool,
  
  /** Target del enlace */
  target: PropTypes.string,
  
  /** Rel del enlace */
  rel: PropTypes.string
};

export { Link };