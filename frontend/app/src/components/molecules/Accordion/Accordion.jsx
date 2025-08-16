// Accordion.jsx - Componente de acordeón avanzado para secciones colapsables
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Button } from '../../atoms/Button/Button'; // Removido - no usado actualmente
import { Icon } from '../../atoms/Icon/Icon';
import { useStandardProps } from '../../../hooks/useStandardProps';
import { STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens/standardProps';
import './Accordion.css';

/**
 * Componente Accordion - Molécula del Design System
 * 
 * Sistema de acordeón completo para organizar contenido colapsable.
 * 
 * 🎯 Casos de uso:
 * - FAQ sections en Settings/Help
 * - Series Detail: Información adicional colapsable
 * - Admin Panel: Secciones de configuración avanzada
 * - Settings Page: Agrupación de opciones relacionadas
 * 
 * ✅ Single/multiple items abiertos
 * ✅ Animaciones smooth con CSS transitions
 * ✅ Iconos personalizables
 * ✅ Estados disabled/loading con sistema estándar
 * ✅ Contenido anidado
 * ✅ Keyboard navigation completa
 * ✅ Accesibilidad WCAG 2.1 AA
 * ✅ Sistema de diseño estándar integrado (size, variant, rounded)
 * ✅ Tokens automáticos y backward compatibility
 */
function Accordion(props) {
  // Extraer props específicas de Accordion antes del hook estándar
  const {
    // Configuración básica
    items = [],
    allowMultiple = false,
    defaultOpenItems = [],
    
    // Iconos personalizables
    expandIcon = 'chevron-down',
    collapseIcon = 'chevron-up',
    
    // Comportamiento
    animated = true,
    
    // Callbacks
    onItemToggle = () => {},
    onItemOpen = () => {},
    onItemClose = () => {},
    
    // Props adicionales específicas
    itemClassName = '',
    headerClassName = '',
    contentClassName = '',
    
    // Props legacy para backward compatibility
    variant: legacyVariant,
    
    ...remainingProps
  } = props;

  // Hook estándar para props del sistema de diseño
  const {
    size,
    variant,
    rounded,
    disabled,
    loading,
    className,
    tokens,
    // renderIcon, // No usado actualmente
    ...standardProps
  } = useStandardProps(remainingProps, {
    componentType: 'accordion',
    defaultSize: 'md',
    defaultVariant: 'neutral', // Neutral es más apropiado para acordeones
    defaultRounded: 'md'
  });

  // Mapeo de backward compatibility para variant
  const mappedVariant = React.useMemo(() => {
    if (legacyVariant) {
      const variantMapping = {
        'default': 'neutral',
        'bordered': 'primary',
        'separated': 'secondary',
        'minimal': 'neutral'
      };
      
      if (variantMapping[legacyVariant]) {
        console.warn(`[Accordion] Prop 'variant="${legacyVariant}"' está deprecado. Usa 'variant="${variantMapping[legacyVariant]}"' en su lugar.`);
        return variantMapping[legacyVariant];
      }
    }
    return variant;
  }, [legacyVariant, variant]);

  // Props DOM para el elemento raíz
  const domProps = extractDOMProps(standardProps);
  
  // Estado para items abiertos
  const [openItems, setOpenItems] = useState(() => {
    const initialOpen = new Set(defaultOpenItems);
    return Array.from(initialOpen);
  });
  
  // Referencias para animaciones
  const contentRefs = useRef({});
  const animationTimeouts = useRef({});
  
  // Toggle individual item
  const toggleItem = (itemId, itemData) => {
    if (disabled || loading || itemData.disabled) return;
    
    const isOpen = openItems.includes(itemId);
    let newOpenItems;
    
    if (isOpen) {
      // Cerrar item
      newOpenItems = openItems.filter(id => id !== itemId);
      onItemClose(itemId, itemData);
    } else {
      // Abrir item
      if (allowMultiple) {
        newOpenItems = [...openItems, itemId];
      } else {
        // Solo uno abierto a la vez
        newOpenItems = [itemId];
        
        // Cerrar otros items si estaban abiertos
        const previouslyOpen = openItems.filter(id => id !== itemId);
        previouslyOpen.forEach(id => {
          const prevItemData = items.find(item => item.id === id);
          if (prevItemData) {
            onItemClose(id, prevItemData);
          }
        });
      }
      onItemOpen(itemId, itemData);
    }
    
    setOpenItems(newOpenItems);
    onItemToggle(itemId, itemData, !isOpen);
  };
  
  // Keyboard navigation para headers
  const handleKeyDown = (event, itemId, itemData, itemIndex) => {
    if (disabled || loading) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusNextItem(itemIndex, 1);
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        focusNextItem(itemIndex, -1);
        break;
        
      case 'Home':
        event.preventDefault();
        focusItem(0);
        break;
        
      case 'End':
        event.preventDefault();
        focusItem(items.length - 1);
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleItem(itemId, itemData);
        break;
        
      default:
        return;
    }
  };
  
  // Focus management
  const focusNextItem = (currentIndex, direction) => {
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < items.length) {
      focusItem(nextIndex);
    } else if (direction > 0) {
      focusItem(0); // Wrap to first
    } else {
      focusItem(items.length - 1); // Wrap to last
    }
  };
  
  const focusItem = (index) => {
    const itemId = items[index]?.id;
    if (itemId) {
      const headerElement = document.querySelector(`[data-accordion-header="${itemId}"]`);
      headerElement?.focus();
    }
  };
  
  // Función para animar altura (memoizada para evitar warnings de dependencias)
  const animateHeight = React.useCallback((element, targetHeight, callback) => {
    if (!animated) {
      element.style.height = targetHeight;
      if (callback) callback();
      return;
    }
    
    element.style.height = targetHeight;
    
    const handleTransitionEnd = (e) => {
      if (e.target === element) {
        element.removeEventListener('transitionend', handleTransitionEnd);
        if (callback) callback();
      }
    };
    
    element.addEventListener('transitionend', handleTransitionEnd);
  }, [animated]);

  // Efecto para animaciones de altura
  useEffect(() => {
    // Capturar la referencia al inicio del efecto
    const timeouts = animationTimeouts.current;
    
    Object.entries(contentRefs.current).forEach(([itemId, contentRef]) => {
      if (!contentRef) return;
      
      // Limpiar timeout previo si existe
      if (timeouts[itemId]) {
        clearTimeout(timeouts[itemId]);
      }
      
      const isOpen = openItems.includes(itemId);
      
      if (isOpen) {
        // Abrir con animación
        const scrollHeight = contentRef.scrollHeight;
        
        if (!animated) {
          contentRef.style.height = 'auto';
        } else {
          // Establecer altura inicial si no está definida
          if (contentRef.style.height === 'auto' || !contentRef.style.height) {
            contentRef.style.height = '0px';
          }
          
          // Animar a la altura completa
          timeouts[itemId] = requestAnimationFrame(() => {
            animateHeight(contentRef, `${scrollHeight}px`, () => {
              // Reset a auto después de la animación para permitir contenido dinámico
              if (openItems.includes(itemId)) {
                contentRef.style.height = 'auto';
              }
            });
          });
        }
      } else {
        // Cerrar con animación
        if (!animated) {
          contentRef.style.height = '0px';
        } else {
          // Si está en auto, obtener la altura actual primero
          if (contentRef.style.height === 'auto') {
            const currentHeight = contentRef.scrollHeight;
            contentRef.style.height = `${currentHeight}px`;
          }
          
          // Animar a 0
          timeouts[itemId] = requestAnimationFrame(() => {
            animateHeight(contentRef, '0px');
          });
        }
      }
    });
    
    // Cleanup function
    return () => {
      Object.values(timeouts).forEach(timeout => {
        if (typeof timeout === 'number') {
          clearTimeout(timeout);
        } else {
          cancelAnimationFrame(timeout);
        }
      });
    };
  }, [openItems, animated, animateHeight]);
  
  // Renderizar item individual del acordeón
  const renderAccordionItem = (item, index) => {
    const isOpen = openItems.includes(item.id);
    const isDisabled = disabled || loading || item.disabled;
    
    const itemClasses = [
      'accordion__item',
      `accordion__item--variant-${mappedVariant}`,
      `accordion__item--size-${size}`,
      rounded && `accordion__item--rounded-${rounded}`,
      isOpen && 'accordion__item--open',
      isDisabled && 'accordion__item--disabled',
      loading && 'accordion__item--loading',
      itemClassName
    ].filter(Boolean).join(' ');
    
    const headerClasses = [
      'accordion__header',
      headerClassName
    ].filter(Boolean).join(' ');
    
    const contentClasses = [
      'accordion__content',
      !animated && 'accordion__content--no-animation',
      contentClassName
    ].filter(Boolean).join(' ');
    
    const buttonProps = {
      'data-accordion-header': item.id,
      className: 'accordion__button',
      onClick: () => toggleItem(item.id, item),
      onKeyDown: (e) => handleKeyDown(e, item.id, item, index),
      disabled: isDisabled,
      'aria-expanded': isOpen,
      'aria-controls': `accordion-content-${item.id}`,
      'aria-disabled': isDisabled,
      type: 'button'
    };
    
    // Determinar icono
    const currentIcon = isOpen ? collapseIcon : expandIcon;
    const iconRotation = isOpen ? 'rotate-180' : '';
    
    return (
      <div key={item.id} className={itemClasses}>
        {/* Header del acordeón */}
        <div className={headerClasses}>
          <button {...buttonProps}>
            {/* Icono izquierdo opcional */}
            {item.icon && (
              <Icon 
                name={item.icon}
                size={size === 'lg' ? 'md' : 'sm'}
                className="accordion__item-icon"
              />
            )}
            
            {/* Título */}
            <span className="accordion__title">
              {item.title}
            </span>
            
            {/* Subtítulo opcional */}
            {item.subtitle && (
              <span className="accordion__subtitle">
                {item.subtitle}
              </span>
            )}
            
            {/* Badge opcional */}
            {item.badge && (
              <span className="accordion__badge">
                {item.badge}
              </span>
            )}
            
            {/* Icono de expand/collapse */}
            <Icon 
              name={currentIcon}
              size={size === 'lg' ? 'md' : 'sm'}
              className={`accordion__toggle-icon ${iconRotation}`}
            />
          </button>
        </div>
        
        {/* Contenido colapsable */}
        <div 
          ref={ref => contentRefs.current[item.id] = ref}
          className={contentClasses}
          id={`accordion-content-${item.id}`}
          aria-labelledby={`accordion-header-${item.id}`}
          style={{ 
            overflow: 'hidden',
            height: animated ? undefined : (isOpen ? 'auto' : '0px'),
            transition: animated ? 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
          }}
        >
          <div className="accordion__content-inner">
            {typeof item.content === 'function' 
              ? item.content(item, isOpen) 
              : item.content
            }
          </div>
        </div>
      </div>
    );
  };
  
  // Construir clases CSS principales con sistema estándar
  const accordionClasses = [
    'accordion',
    `accordion--variant-${mappedVariant}`,
    `accordion--size-${size}`,
    rounded && `accordion--rounded-${rounded}`,
    disabled && 'accordion--disabled',
    loading && 'accordion--loading',
    !animated && 'accordion--no-animation',
    className
  ].filter(Boolean).join(' ');
  
  // Overlay para estado loading
  const loadingOverlay = loading && (
    <div className="accordion__loading-overlay">
      <div className="accordion__spinner" />
    </div>
  );

  return (
    <div 
      className={accordionClasses}
      role="group"
      aria-label="Accordion"
      aria-busy={loading}
      style={{
        position: 'relative',
        ...tokens.size,
        ...tokens.variant,
        borderRadius: tokens.rounded
      }}
      {...domProps}
    >
      {items.map(renderAccordionItem)}
      {loadingOverlay}
    </div>
  );
}

// Componente de conveniencia para un item individual
function AccordionItem({
  id,
  title,
  subtitle,
  content,
  icon,
  badge,
  disabled = false,
  defaultOpen = false,
  onToggle = () => {},
  className = '',
  ...restProps
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const handleToggle = () => {
    if (disabled) return;
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle(newState);
  };
  
  const itemData = {
    id: id || `accordion-item-${Date.now()}`,
    title,
    subtitle,
    content,
    icon,
    badge,
    disabled
  };
  
  return (
    <Accordion
      items={[itemData]}
      defaultOpenItems={defaultOpen ? [itemData.id] : []}
      onItemToggle={handleToggle}
      className={className}
      {...restProps}
    />
  );
}

Accordion.propTypes = {
  // Props del sistema de diseño estándar
  ...STANDARD_PROP_TYPES,
  
  // Configuración básica de Accordion
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
      icon: PropTypes.string,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      disabled: PropTypes.bool
    })
  ).isRequired,
  allowMultiple: PropTypes.bool,
  defaultOpenItems: PropTypes.arrayOf(PropTypes.string),
  
  // Iconos personalizables
  expandIcon: PropTypes.string,
  collapseIcon: PropTypes.string,
  
  // Comportamiento
  animated: PropTypes.bool,
  
  // Props legacy para backward compatibility (con deprecation warnings)
  variant: PropTypes.oneOf(['default', 'bordered', 'separated', 'minimal', 'primary', 'secondary', 'success', 'warning', 'danger', 'neutral']),
  
  // Callbacks
  onItemToggle: PropTypes.func,
  onItemOpen: PropTypes.func,
  onItemClose: PropTypes.func,
  
  // Props adicionales específicas de Accordion
  itemClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  contentClassName: PropTypes.string
};

AccordionItem.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  icon: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string
};

export { Accordion, AccordionItem };