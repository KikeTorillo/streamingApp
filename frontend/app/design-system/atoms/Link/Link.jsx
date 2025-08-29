import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useInteractiveProps, extractDOMPropsV2, INTERACTIVE_PROP_TYPES, Icon } from '../../index.js';
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

  // ✅ V2 PROPS DOM-SAFE: Usar extractDOMPropsV2 para filtrar props del sistema
  // Determinar contenido del enlace
  const linkContent = children || text;

  // ✅ LÓGICA MEJORADA: href vs to según contrato del plan
  // href = Enlaces externos o absolutos
  // to = Enlaces internos (React Router)
  // Uno de los dos debe estar presente
  
  const isExternalUrl = (url) => {
    if (!url) return false;
    return url.startsWith('http://') || 
           url.startsWith('https://') || 
           url.startsWith('mailto:') || 
           url.startsWith('tel:') ||
           url.startsWith('//'); // Protocol-relative URLs
  };

  // Auto-detectar si es enlace externo
  const isExternal = external || isExternalUrl(href) || isExternalUrl(to);

  // Determinar URL final y tipo de enlace
  const finalUrl = href || to;
  const shouldUseRouterLink = !isExternal && to && !href;

  // ✅ SEGURIDAD MEJORADA: Auto-configurar target y rel
  const finalTarget = target || (isExternal ? '_blank' : undefined);
  
  // Configurar rel de seguridad para enlaces externos con target=_blank
  let finalRel = rel;
  if (!finalRel && isExternal && finalTarget === '_blank') {
    // noopener: previene acceso a window.opener
    // noreferrer: previene envío del referrer header
    finalRel = 'noopener noreferrer';
  }
  
  // Si el usuario especifica target=_blank manualmente, asegurar rel seguro
  if (!rel && finalTarget === '_blank' && !finalRel) {
    finalRel = 'noopener noreferrer';
  }

  // Generar clases CSS manualmente
  const linkClasses = [
    'link',
    `link--${size}`,
    `link--${mappedVariant}`,
    `link--rounded-${rounded}`,
    underline && 'link--underline',
    (hasLeftIcon || hasRightIcon) && 'link--with-icon',
    (variant === 'inherit') && 'link--inherit', // Clase especial para variant inherit
    loading && 'link--loading',
    disabled && 'link--disabled'
  ].filter(Boolean).join(' ');

  // ✅ COMBINAR CLASES: Sistema + Usuario
  const finalClassName = [linkClasses, className]
    .filter(Boolean).join(' ');

  // ✅ PROPS MODIFICADAS: reemplazar className original con combinada
  const propsWithFinalClassName = { 
    ...props, 
    className: finalClassName 
  };

  // ✅ V2 PROPS DOM-SAFE: Props comunes filtradas y seguras
  const baseDOMProps = extractDOMPropsV2(propsWithFinalClassName);
  
  const commonProps = {
    ...baseDOMProps,
    target: finalTarget,
    rel: finalRel,
    'aria-label': ariaLabel,
    'aria-disabled': disabled || loading ? 'true' : undefined,
    'aria-busy': loading ? 'true' : undefined,
    'tabIndex': disabled || loading ? -1 : undefined,
    'data-component': 'Link'
  };

  // Función para renderizar el contenido con iconos V2
  const renderContent = () => (
    <>
      {leftIcon && renderIcon(leftIcon)}
      <span className="link__text">{linkContent}</span>
      {rightIcon && renderIcon(rightIcon)}
    </>
  );

  // ✅ RENDERIZADO MEJORADO: Flujo claro según tipo de enlace
  
  // Si está deshabilitado, siempre renderizar como span
  if (disabled) {
    return (
      <span {...commonProps}>
        {renderContent()}
      </span>
    );
  }

  // Si debe usar React Router Link (enlace interno con to)
  if (shouldUseRouterLink) {
    return (
      <RouterLink to={to} {...commonProps}>
        {renderContent()}
      </RouterLink>
    );
  }

  // Si tiene URL (externa o href), usar anchor tag
  if (finalUrl) {
    return (
      <a href={finalUrl} {...commonProps}>
        {renderContent()}
      </a>
    );
  }

  // Fallback: renderizar como span si no hay URL
  if (import.meta.env?.DEV) {
    console.warn('Link component: No "to" or "href" prop provided');
  }
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