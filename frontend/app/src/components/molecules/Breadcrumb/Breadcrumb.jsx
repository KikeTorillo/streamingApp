// Breadcrumb.jsx - Componente de navegación jerárquica
import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button';
import { useBreadcrumbProps } from '../../../hooks/useStandardProps';
import { extractDOMProps, STANDARD_PROP_TYPES } from '../../../tokens/standardProps';
import './Breadcrumb.css';

/**
 * Componente Breadcrumb Navigation - Molécula del Design System
 * 
 * Muestra la ruta jerárquica del usuario en la aplicación, permitiendo
 * navegación rápida a niveles superiores.
 * 
 * 🎯 Casos de uso:
 * - Admin Panel: "Admin / Users / Create User"
 * - Movie Detail: "Home / Movies / Action / Movie Title" 
 * - Settings: "Settings / Privacy / Data Management"
 * - Cualquier navegación jerárquica
 * 
 * ✅ Integración con React Router
 * ✅ Responsive automático con collapse
 * ✅ Múltiples variantes (default, simple, compact)
 * ✅ Overflow handling inteligente
 * ✅ Accesibilidad completa
 */
function Breadcrumb(props) {
  // Extraer props y aplicar sistema estándar
  const {
    // Configuración básica
    items = [],
    separator = '>',
    maxItems = 4,
    
    // Props estándar del sistema
    size, variant, rounded, disabled, loading, className,
    leftIcon, rightIcon,
    
    // Props específicos de Breadcrumb
    breadcrumbVariant = 'default', // Separar de variant semántica
    showHome = true,
    showIcons = true,
    
    // Comportamiento responsive
    collapseAt = 768,
    alwaysShowCurrent = true,
    
    // Navegación
    onItemClick = null,
    linkComponent = Link,
    
    // Personalización
    homeItem = {
      label: 'Inicio',
      to: '/',
      icon: 'home'
    },
    
    // Tokens y sistema integrado
    tokens, renderIcon,
    
    // Props DOM
    ...domProps
  } = useBreadcrumbProps(props);
  
  // Extraer solo props válidas para DOM
  const validDOMProps = extractDOMProps(domProps);
  
  // Estados internos memoizados
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  
  // Effect para responsive - memoizado
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determinar si debe colapsar
  useEffect(() => {
    const shouldCollapse = windowWidth < collapseAt || items.length > maxItems;
    setIsCollapsed(shouldCollapse);
  }, [windowWidth, collapseAt, items.length, maxItems]);
  
  // Preparar items finales con memoización optimizada
  const finalItems = useMemo(() => {
    let allItems = [...items];
    
    // Agregar home item si está habilitado
    if (showHome && (!allItems[0] || allItems[0].to !== homeItem.to)) {
      allItems.unshift(homeItem);
    }
    
    // Asegurar que los items tengan la estructura correcta
    return allItems.map((item, index) => ({
      id: item.id || `breadcrumb-${index}`,
      label: item.label || 'Sin título',
      to: item.to || null,
      icon: showIcons ? item.icon : null,
      isActive: index === allItems.length - 1, // El último es el activo
      ...item
    }));
  }, [items, showHome, homeItem, showIcons]);
  
  // Lógica de collapse con memoización optimizada
  const displayItems = useMemo(() => {
    if (!isCollapsed || finalItems.length <= 3) {
      return finalItems;
    }
    
    // Mostrar: [Primera] ... [Penúltima] [Actual]
    if (alwaysShowCurrent && finalItems.length > 3) {
      return [
        finalItems[0], // Primera
        { 
          id: 'collapsed', 
          label: '...', 
          isCollapsed: true,
          collapsedItems: finalItems.slice(1, -2) // Items ocultos
        },
        finalItems[finalItems.length - 2], // Penúltima
        finalItems[finalItems.length - 1]  // Actual
      ];
    }
    
    return finalItems.slice(0, maxItems);
  }, [finalItems, isCollapsed, alwaysShowCurrent, maxItems]);
  
  // Handler de click con useCallback para performance
  const handleItemClick = useCallback((item, event) => {
    if (disabled || loading || item.isActive || item.isCollapsed) {
      event?.preventDefault();
      return;
    }
    
    if (onItemClick) {
      onItemClick(item, event);
    }
  }, [disabled, loading, onItemClick]);
  
  // Renderizar item individual
  const renderBreadcrumbItem = (item) => {
    const isClickable = !item.isActive && !item.isCollapsed && item.to;
    
    const itemContent = (
      <span className="breadcrumb__item-content">
        {item.icon && renderIcon(item.icon, {
          className: 'breadcrumb__item-icon',
          'data-breadcrumb-icon': true
        })}
        <span className="breadcrumb__item-text">{item.label}</span>
        {loading && item.isActive && renderIcon('loader', {
          className: 'breadcrumb__loading-icon breadcrumb__loading-icon--spinning',
          'data-breadcrumb-loading': true
        })}
      </span>
    );
    
    if (item.isCollapsed) {
      return (
        <CollapsedDropdown
          key={item.id}
          items={item.collapsedItems}
          onItemClick={handleItemClick}
          linkComponent={linkComponent}
          size={size}
          disabled={disabled}
          renderIcon={renderIcon}
        />
      );
    }
    
    if (isClickable && !disabled) {
      const LinkComponent = linkComponent;
      
      return (
        <LinkComponent
          key={item.id}
          to={item.to}
          className={`breadcrumb__item-link ${item.isActive ? 'breadcrumb__item-link--active' : ''}`}
          onClick={(e) => handleItemClick(item, e)}
          aria-current={item.isActive ? 'page' : undefined}
        >
          {itemContent}
        </LinkComponent>
      );
    }
    
    return (
      <span
        key={item.id}
        className={`breadcrumb__item ${item.isActive ? 'breadcrumb__item--active' : ''}`}
        aria-current={item.isActive ? 'page' : undefined}
      >
        {itemContent}
      </span>
    );
  };
  
  // Construir clases CSS con sistema estándar y tokens
  const breadcrumbClasses = useMemo(() => [
    'breadcrumb',
    // Variante semántica estándar (para item activo)
    `breadcrumb--variant-${variant}`,
    // Variante funcional separada (para estilo visual general)
    `breadcrumb--breadcrumb-variant-${breadcrumbVariant}`,
    `breadcrumb--size-${size}`,
    rounded && `breadcrumb--rounded-${rounded}`,
    isCollapsed && 'breadcrumb--collapsed',
    disabled && 'breadcrumb--disabled',
    loading && 'breadcrumb--loading',
    className
  ].filter(Boolean).join(' '), [variant, breadcrumbVariant, size, rounded, isCollapsed, disabled, loading, className]);
  
  if (finalItems.length === 0) {
    return null;
  }
  
  return (
    <nav 
      className={breadcrumbClasses}
      aria-label="Breadcrumb navigation"
      aria-disabled={disabled}
      aria-busy={loading}
      style={{
        '--breadcrumb-size': tokens.size.fontSize,
        '--breadcrumb-spacing': tokens.size.spacing,
        '--breadcrumb-padding': tokens.size.padding,
        '--breadcrumb-rounded': tokens.rounded,
        ...validDOMProps.style
      }}
      {...validDOMProps}
    >
      <ol className="breadcrumb__list" role="list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          return (
            <li 
              key={item.id}
              className="breadcrumb__list-item"
              role="listitem"
            >
              {renderBreadcrumbItem(item)}
              
              {!isLast && !item.isCollapsed && (
                <span 
                  className="breadcrumb__separator"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Componente interno para mostrar items colapsados en dropdown
 */
function CollapsedDropdown({ 
  items, 
  onItemClick, 
  linkComponent: LinkComponent, 
  size, 
  disabled,
  renderIcon
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  const handleItemClick = (item, event) => {
    setIsOpen(false);
    onItemClick(item, event);
  };
  
  return (
    <div className="breadcrumb__collapsed-dropdown">
      <Button
        variant="ghost"
        size={size === 'lg' ? 'sm' : 'xs'}
        onClick={handleToggle}
        disabled={disabled}
        className="breadcrumb__collapsed-trigger"
        rightIcon={isOpen ? 'chevron-up' : 'chevron-down'}
      >
        ...
      </Button>
      
      {isOpen && (
        <div className="breadcrumb__collapsed-menu">
          <div className="breadcrumb__collapsed-list">
            {items.map((item) => (
              <LinkComponent
                key={item.id}
                to={item.to}
                className="breadcrumb__collapsed-item"
                onClick={(e) => handleItemClick(item, e)}
              >
                {item.icon && renderIcon(item.icon, {
                  className: 'breadcrumb__collapsed-item-icon',
                  'data-breadcrumb-collapsed-icon': true
                })}
                <span>{item.label}</span>
              </LinkComponent>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

CollapsedDropdown.propTypes = {
  items: PropTypes.array.isRequired,
  onItemClick: PropTypes.func.isRequired,
  linkComponent: PropTypes.elementType.isRequired,
  size: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  renderIcon: PropTypes.func.isRequired
};

Breadcrumb.propTypes = {
  // Props estándar del sistema de diseño
  ...STANDARD_PROP_TYPES,
  
  // Configuración básica
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
      icon: PropTypes.string,
      isActive: PropTypes.bool
    })
  ),
  separator: PropTypes.string,
  maxItems: PropTypes.number,
  
  // Variantes específicas separadas de variant semántica
  breadcrumbVariant: PropTypes.oneOf(['default', 'simple', 'compact']),
  showHome: PropTypes.bool,
  showIcons: PropTypes.bool,
  
  // Comportamiento responsive
  collapseAt: PropTypes.number,
  alwaysShowCurrent: PropTypes.bool,
  
  // Navegación
  onItemClick: PropTypes.func,
  linkComponent: PropTypes.elementType,
  
  // Personalización
  homeItem: PropTypes.shape({
    label: PropTypes.string,
    to: PropTypes.string,
    icon: PropTypes.string
  })
};

export { Breadcrumb };