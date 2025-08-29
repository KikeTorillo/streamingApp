// Breadcrumb.jsx - Componente de navegación jerárquica
import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, Typography, FlexContainer, useInteractiveProps, extractDOMPropsV2, INTERACTIVE_PROP_TYPES} from '../../index.js';
import './Breadcrumb.css';

/**
 * Componente Breadcrumb Navigation - Molécula del Design System V2.0
 * 
 * ✅ SISTEMA V2.0: Hook estándar + Props API universal + CSS tokens + Átomos
 * ✅ UNIVERSAL: Navegación jerárquica para cualquier aplicación
 * ✅ RESPONSIVE: Collapse automático con dropdown inteligente
 * ✅ ACCESIBLE: ARIA completo + navegación por teclado
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
 * @param {Object} props - Props del componente
 * @param {Array} props.items - Array de items de navegación [{label, to, icon, id}]
 * @param {string} props.separator - Separador entre items (default: '>')
 * @param {number} props.maxItems - Máximo items antes de colapsar (default: 4)
 * @param {boolean} props.showHome - Mostrar item de inicio automático (default: true)
 * @param {boolean} props.showIcons - Mostrar iconos de items (default: true)
 * @param {number} props.collapseAt - Breakpoint para responsive collapse (default: 768)
 * @param {boolean} props.alwaysShowCurrent - Siempre mostrar página actual (default: true)
 * @param {function} props.onItemClick - Callback cuando se hace click en item
 * @param {Object} props.homeItem - Configuración del item home
 */
function Breadcrumb(props) {
  // ===== HOOK ESTÁNDAR V2.0 =====
  const standardProps = useInteractiveProps(props, {
    componentName: 'Breadcrumb',
    defaultSize: 'md',
    defaultVariant: 'neutral'
  });

  const {
    size, variant, rounded, disabled, loading, className,
    tokens, renderIcon, ...restProps
  } = standardProps;

  // ===== PROPS ESPECÍFICAS (desde props originales) =====
  const {
    // Configuración básica
    items = [],
    separator = '>',
    maxItems = 4,
    
    // Comportamiento
    showHome = true,
    showIcons = true,
    collapseAt = 768,
    alwaysShowCurrent = true,
    
    // Navegación
    onItemClick = null,
    
    // Personalización
    homeItem = {
      label: 'Inicio',
      to: '/',
      icon: 'home'
    }
  } = props;

  // ===== DOM PROPS FILTERING =====
  const domProps = extractDOMPropsV2(restProps);
  
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
      <FlexContainer 
        gap="xs" 
        align="center"
        className="breadcrumb__item-content"
      >
        {item.icon && renderIcon(item.icon, undefined, undefined, {
          className: 'breadcrumb__item-icon',
          'data-breadcrumb-icon': true
        })}
        <Typography 
          variant="body-sm"
          className="breadcrumb__item-text"
          truncate
        >
          {item.label}
        </Typography>
        {loading && item.isActive && renderIcon('loading', undefined, undefined, {
          className: 'breadcrumb__loading-icon breadcrumb__loading-icon--spinning',
          'data-breadcrumb-loading': true
        })}
      </FlexContainer>
    );
    
    if (item.isCollapsed) {
      return (
        <CollapsedDropdown
          key={item.id}
          items={item.collapsedItems}
          onItemClick={handleItemClick}
          size={size}
          disabled={disabled}
          renderIcon={renderIcon}
        />
      );
    }
    
    if (isClickable && !disabled) {
      return (
        <Link
          key={item.id}
          href={item.to}
          variant="neutral"
          className={`breadcrumb__item-link ${item.isActive ? 'breadcrumb__item-link--active' : ''}`}
          onClick={(e) => handleItemClick(item, e)}
          aria-current={item.isActive ? 'page' : undefined}
        >
          {itemContent}
        </Link>
      );
    }
    
    return (
      <Typography
        key={item.id}
        as="span"
        variant="body-sm"
        className={`breadcrumb__item ${item.isActive ? 'breadcrumb__item--active' : ''}`}
        aria-current={item.isActive ? 'page' : undefined}
      >
        {itemContent}
      </Typography>
    );
  };
  
  // ===== CSS CLASES MANUALES =====
  const breadcrumbClasses = [
    'breadcrumb',
    `breadcrumb--${size}`,
    `breadcrumb--${variant}`,
    rounded && `breadcrumb--rounded-${rounded}`,
    isCollapsed && 'breadcrumb--collapsed',
    disabled && 'breadcrumb--disabled',
    loading && 'breadcrumb--loading',
    className
  ].filter(Boolean).join(' ');
  
  if (finalItems.length === 0) {
    return null;
  }

  return (
    <FlexContainer 
      as="nav"
      className={breadcrumbClasses}
      aria-label="Breadcrumb navigation"
      aria-disabled={disabled}
      aria-busy={loading}
      style={{
        '--breadcrumb-size': tokens.size?.fontSize,
        '--breadcrumb-spacing': tokens.size?.spacing,
        '--breadcrumb-padding': tokens.size?.padding,
        '--breadcrumb-rounded': tokens.rounded,
      }}
      {...domProps}
    >
      <FlexContainer 
        as="ol" 
        role="list"
        gap="xs"
        wrap="wrap"
        align="center"
        className="breadcrumb__list"
      >
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          return (
            <FlexContainer 
              key={item.id}
              as="li"
              role="listitem"
              gap="xs"
              align="center"
              className="breadcrumb__list-item"
            >
              {renderBreadcrumbItem(item)}
              
              {!isLast && !item.isCollapsed && (
                <Typography 
                  as="span"
                  variant="body-sm"
                  className="breadcrumb__separator"
                  aria-hidden="true"
                >
                  {separator}
                </Typography>
              )}
            </FlexContainer>
          );
        })}
      </FlexContainer>
    </FlexContainer>
  );
}

/**
 * Componente interno para mostrar items colapsados en dropdown
 */
function CollapsedDropdown({ 
  items, 
  onItemClick, 
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
    <FlexContainer className="breadcrumb__collapsed-dropdown">
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
        <FlexContainer 
          className="breadcrumb__collapsed-menu"
          direction="column"
        >
          <FlexContainer 
            className="breadcrumb__collapsed-list"
            direction="column"
          >
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.to}
                variant="neutral"
                className="breadcrumb__collapsed-item"
                onClick={(e) => handleItemClick(item, e)}
              >
                <FlexContainer gap="sm" align="center">
                  {item.icon && renderIcon(item.icon, undefined, undefined, {
                    className: 'breadcrumb__collapsed-item-icon',
                    'data-breadcrumb-collapsed-icon': true
                  })}
                  <Typography variant="body-sm">{item.label}</Typography>
                </FlexContainer>
              </Link>
            ))}
          </FlexContainer>
        </FlexContainer>
      )}
    </FlexContainer>
  );
}

CollapsedDropdown.propTypes = {
  items: PropTypes.array.isRequired,
  onItemClick: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  renderIcon: PropTypes.func.isRequired
};

Breadcrumb.propTypes = {
  // ===== PROPS ESTÁNDAR V2.0 =====
  ...INTERACTIVE_PROP_TYPES,
  
  // ===== PROPS ESPECÍFICAS =====
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
  
  // Comportamiento
  showHome: PropTypes.bool,
  showIcons: PropTypes.bool,
  collapseAt: PropTypes.number,
  alwaysShowCurrent: PropTypes.bool,
  
  // Navegación
  onItemClick: PropTypes.func,
  
  // Personalización
  homeItem: PropTypes.shape({
    label: PropTypes.string,
    to: PropTypes.string,
    icon: PropTypes.string
  })
};

export { Breadcrumb };