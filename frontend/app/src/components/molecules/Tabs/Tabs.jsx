// Tabs.jsx - Sistema de pestañas avanzado
import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { INTERACTIVE_PROP_TYPES, extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import './Tabs.css';

/**
 * Componente Tabs - Molécula del Design System
 * 
 * Sistema de pestañas completo con múltiples variantes y orientaciones.
 * 
 * 🎯 Casos de uso:
 * - Series Detail Page: Episodios por temporada
 * - User Profile: Información, Configuración, Historial
 * - Admin Panel: Diferentes secciones de gestión
 * - Settings Page: General, Privacidad, Notificaciones
 * 
 * ✅ Múltiples variantes (line, pills, card)
 * ✅ Orientación horizontal/vertical
 * ✅ Iconos opcionales en cada tab
 * ✅ Estados disabled para tabs no disponibles
 * ✅ Scroll automático en overflow
 * ✅ Keyboard navigation completa
 * ✅ Accesibilidad WCAG 2.1 AA
 */
function Tabs(props) {
  // ✅ SISTEMA V2: Hook estándar para props del sistema de diseño
  const standardProps = useInteractiveProps(props, {
    componentName: 'Tabs',
    defaultSize: 'md',
    defaultVariant: 'primary',
    defaultRounded: 'md'
  });
  
  // Backward compatibility: manejar variant legacy
  let actualTabsVariant = props.tabsVariant || 'line';
  let actualVariant = standardProps.variant;
  
  // Si variant es legacy (line, pills, card), usarlo como tabsVariant y advertir
  if (props.variant && ['line', 'pills', 'card'].includes(props.variant)) {
    if (import.meta.env?.DEV) {
      console.warn(
        `Tabs: prop "variant='${props.variant}'" está deprecado. ` +
        `Usar "tabsVariant='${props.variant}'" para funcionalidad de tabs. ` +
        `La prop "variant" ahora es para variantes semánticas.`
      );
    }
    actualTabsVariant = props.variant;
    actualVariant = 'primary'; // Default para variante semántica
  }
  
  const {
    // ✅ SISTEMA V2: Props estándar del sistema de diseño
    size,
    rounded,
    disabled,
    loading,
    className,
    generateStyles,
    renderIcon,
    
    // Props específicas de Tabs
    tabs = [],
    activeTab = null,
    onTabChange = () => {},
    orientation = 'horizontal',
    scrollable = true,
    equalWidth = false,
    lazy = false,
    tabsClassName = '',
    contentClassName = '',
    
    // Props restantes para DOM
    ...restProps
  } = standardProps;
  
  // Usar las variantes procesadas
  const variant = actualVariant;
  const tabsVariant = actualTabsVariant;

  // ✅ SISTEMA V2: Extraer props DOM-safe
  const domProps = extractDOMPropsV2(restProps);
  
  // Referencias
  const tabsListRef = useRef(null);
  const activeTabRef = useRef(null);
  
  // Estado interno para activeTab si no se proporciona
  const [internalActiveTab, setInternalActiveTab] = useState(() => {
    if (activeTab !== null) return activeTab;
    const enabledTabs = tabs.filter(tab => !tab.disabled);
    return enabledTabs.length > 0 ? enabledTabs[0].id : null;
  });
  
  const currentActiveTab = activeTab !== null ? activeTab : internalActiveTab;
  
  // Estado para tracking de scroll
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Encontrar tab activo
  const activeTabData = tabs.find(tab => tab.id === currentActiveTab);
  
  // Handle tab change
  const handleTabChange = (tabId, tabData) => {
    if (disabled || tabData.disabled || loading) return;
    
    if (activeTab === null) {
      setInternalActiveTab(tabId);
    }
    onTabChange(tabId, tabData);
  };
  
  // Keyboard navigation
  const handleKeyDown = (event, tabId) => {
    const enabledTabs = tabs.filter(tab => !tab.disabled);
    const currentIndex = enabledTabs.findIndex(tab => tab.id === tabId);
    
    let nextIndex = -1;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
        break;
        
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
        break;
        
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
        
      case 'End':
        event.preventDefault();
        nextIndex = enabledTabs.length - 1;
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleTabChange(tabId, tabs.find(t => t.id === tabId));
        return;
        
      default:
        return;
    }
    
    if (nextIndex >= 0) {
      const nextTab = enabledTabs[nextIndex];
      handleTabChange(nextTab.id, nextTab);
      
      // Focus en el siguiente tab
      setTimeout(() => {
        const nextTabElement = tabsListRef.current?.querySelector(`[data-tab-id="${nextTab.id}"]`);
        nextTabElement?.focus();
      }, 0);
    }
  };
  
  // Scroll handling
  const updateScrollButtons = useCallback(() => {
    if (!scrollable || !tabsListRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, [scrollable]);
  
  useEffect(() => {
    if (scrollable) {
      updateScrollButtons();
      
      const tabsList = tabsListRef.current;
      if (tabsList) {
        tabsList.addEventListener('scroll', updateScrollButtons);
        return () => tabsList.removeEventListener('scroll', updateScrollButtons);
      }
    }
  }, [scrollable, tabs, updateScrollButtons]);
  
  // Scroll to active tab
  useEffect(() => {
    if (activeTabRef.current && scrollable) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: orientation === 'horizontal' ? 'center' : 'nearest'
      });
    }
  }, [currentActiveTab, orientation, scrollable]);
  
  // Scroll functions
  const scrollTabs = (direction) => {
    if (!tabsListRef.current) return;
    
    const scrollAmount = 200;
    const currentScroll = tabsListRef.current.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    tabsListRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };
  
  // Renderizar tab individual
  const renderTab = (tab) => {
    const isActive = tab.id === currentActiveTab;
    const isDisabled = disabled || tab.disabled;
    
    const tabClasses = [
      'tabs__tab',
      `tabs__tab--${tabsVariant}`,
      `tabs__tab--${size}`,
      isActive && 'tabs__tab--active',
      isDisabled && 'tabs__tab--disabled',
      loading && 'tabs__tab--loading'
    ].filter(Boolean).join(' ');
    
    const tabProps = {
      ref: isActive ? activeTabRef : null,
      className: tabClasses,
      onClick: () => handleTabChange(tab.id, tab),
      onKeyDown: (e) => handleKeyDown(e, tab.id),
      disabled: isDisabled,
      'data-tab-id': tab.id,
      'aria-selected': isActive,
      'aria-controls': `tabpanel-${tab.id}`,
      'aria-disabled': isDisabled,
      tabIndex: isActive ? 0 : -1,
      role: 'tab',
      type: 'button'
    };
    
    const tabContent = (
      <>
        {tab.icon && renderIcon(tab.icon, {
          className: 'tabs__tab-icon',
          size: size === 'lg' ? 'sm' : 'xs'
        })}
        <span className="tabs__tab-text">{tab.label}</span>
        {tab.badge && (
          <span className="tabs__tab-badge" aria-label={`${tab.badge} items`}>
            {tab.badge}
          </span>
        )}
        {loading && isActive && renderIcon('loader', {
          className: 'tabs__loading-icon', 
          size: 'xs'
        })}
      </>
    );
    
    return (
      <button key={tab.id} {...tabProps}>
        {tabContent}
      </button>
    );
  };
  
  // Renderizar contenido del tab activo
  const renderContent = () => {
    if (!activeTabData || !activeTabData.content) return null;
    
    // Lazy loading: solo renderizar el tab activo y los ya visitados
    if (lazy && !activeTabData.visited) {
      // Marcar como visitado (esto requeriría estado externo en implementación real)
      activeTabData.visited = true;
    }
    
    return (
      <div
        className={`tabs__content ${contentClassName}`}
        role="tabpanel"
        id={`tabpanel-${activeTabData.id}`}
        aria-labelledby={`tab-${activeTabData.id}`}
        tabIndex={0}
      >
        {typeof activeTabData.content === 'function' 
          ? activeTabData.content(activeTabData) 
          : activeTabData.content
        }
      </div>
    );
  };
  
  // Construir clases CSS
  const tabsClasses = [
    'tabs',
    `tabs--tabs-variant-${tabsVariant}`, // Variante específica de tabs (line, pills, card)
    `tabs--variant-${variant}`, // Variante semántica estándar (primary, secondary, etc.)
    `tabs--size-${size}`,
    `tabs--rounded-${rounded}`,
    `tabs--orientation-${orientation}`,
    scrollable && 'tabs--scrollable',
    equalWidth && 'tabs--equal-width',
    disabled && 'tabs--disabled',
    loading && 'tabs--loading',
    className
  ].filter(Boolean).join(' ');
  
  const tabsListClasses = [
    'tabs__list',
    tabsClassName
  ].filter(Boolean).join(' ');
  
  // Validar que hay tabs
  if (!tabs || tabs.length === 0) {
    return null;
  }
  
  return (
    <div {...domProps} className={tabsClasses}>
      <div className="tabs__header">
        {/* Scroll button left */}
        {scrollable && orientation === 'horizontal' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollTabs('left')}
            disabled={!canScrollLeft}
            className="tabs__scroll-button tabs__scroll-button--left"
            leftIcon="chevron-left"
            iconOnly
            aria-label="Scroll tabs left"
          />
        )}
        
        {/* Tabs list */}
        <div
          ref={tabsListRef}
          className={tabsListClasses}
          role="tablist"
          aria-orientation={orientation}
        >
          {tabs.map(renderTab)}
        </div>
        
        {/* Scroll button right */}
        {scrollable && orientation === 'horizontal' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollTabs('right')}
            disabled={!canScrollRight}
            className="tabs__scroll-button tabs__scroll-button--right"
            leftIcon="chevron-right"
            iconOnly
            aria-label="Scroll tabs right"
          />
        )}
      </div>
      
      {/* Tab content */}
      {renderContent()}
    </div>
  );
}

Tabs.propTypes = {
  // ✅ SISTEMA V2: Props estándar del sistema de diseño
  ...INTERACTIVE_PROP_TYPES,
  
  // Configuración básica
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      icon: PropTypes.string,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      disabled: PropTypes.bool,
      visited: PropTypes.bool
    })
  ).isRequired,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
  
  // Personalización visual específica de Tabs
  tabsVariant: PropTypes.oneOf(['line', 'pills', 'card']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  
  // Comportamiento
  scrollable: PropTypes.bool,
  equalWidth: PropTypes.bool,
  lazy: PropTypes.bool,
  
  // Props adicionales
  tabsClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  
  // Props deprecadas (con backward compatibility)
  variant: function(props, propName, componentName) {
    if (props[propName] && ['line', 'pills', 'card'].includes(props[propName])) {
      return new Error(
        `Warning: ${componentName}: prop "variant" con valores 'line', 'pills', 'card' está deprecado. ` +
        `Usar "tabsVariant" en su lugar para la funcionalidad de tabs. ` +
        `La prop "variant" ahora se usa para variantes semánticas (primary, secondary, success, warning, danger, neutral).`
      );
    }
  }
};

export { Tabs };