// ===== ADMINSIDEBAR COMPONENT =====

import { useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { createIconRenderer } from '../../../utils/iconHelpers';
import { useStandardProps } from '../../../hooks/useStandardProps';
import { extractDOMProps } from '../../../tokens/standardProps';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Typography } from '../../atoms/Typography/Typography';
import './AdminSidebar.css';

/**
 * AdminSidebar - Navegación lateral para panel de administración
 * 
 * Características implementadas:
 * - ✅ Navegación colapsible 
 * - ✅ Menús y submenús expandibles
 * - ✅ Estados activos/hover
 * - ✅ Badges con contadores dinámicos
 * - ✅ Iconos centralizados con createIconRenderer
 * - ✅ Responsive (oculto en móvil)
 * - ✅ Consistente con sistema de diseño
 * - ✅ Accesibilidad completa
 */
function AdminSidebar(props) {
  // ✅ USAR HOOK ESTÁNDAR DEL SISTEMA
  const {
    variant,
    loading,
    className
  } = useStandardProps(props, {
    componentType: 'sidebar',
    defaultSize: 'md',
    defaultVariant: 'secondary',
    defaultRounded: 'none'
  });

  // ✅ EXTRAER PROPS ESPECÍFICAS DEL SIDEBAR
  const {
    // Estados del sidebar
    isCollapsed = false,
    onToggleCollapse,

    // Datos dinámicos para badges
    userCount = 0,
    movieCount = 0,
    seriesCount = 0,
    categoryCount = 0,
    episodeCount = 0,

    // Navegación
    onNavigate = null,

    // Error state
    error = null,

    // Props específicas que NO van al DOM
    currentPath,

    // Props adicionales
    ...restProps
  } = props;

  // ✅ EXTRAER ESTILO DESPUÉS para que esté disponible
  const { style, ...propsForDOM } = restProps;

  // ✅ FILTRAR PROPS PARA DOM (ya sin currentPath)
  const domProps = extractDOMProps(propsForDOM);

  // Hooks de router - siempre llamar hooks en el mismo orden
  const navigate = useNavigate();
  const location = useLocation();

  // Función de navegación con fallback
  const navigateToRoute = (route) => {
    try {
      navigate(route);
    } catch {
      // Fallback para Storybook
      if (onNavigate) {
        onNavigate(route);
      }
    }
  };

  const [expandedMenus, setExpandedMenus] = useState(new Set(['dashboard']));

  // ===== FUNCIONES DE RENDERIZADO DE ICONOS =====
  const renderMainIcon = createIconRenderer('sm', { default: 'sm' });
  const renderSubIcon = createIconRenderer('xs', { default: 'xs' });
  const renderLogoIcon = createIconRenderer('md', { default: 'md' });

  // ===== CONFIGURACIÓN DE MENÚS =====
  const sidebarItems = [
    {
      id: 'dashboard',
      icon: 'trending',
      label: 'Dashboard',
      route: '/admin',
      description: 'Panel principal con métricas generales',
      badge: 0
    },
    {
      id: 'users',
      icon: 'users',
      label: 'Usuarios',
      route: '/admin/users',
      description: 'Gestión de usuarios registrados',
      badge: userCount
    },
    {
      id: 'content',
      icon: 'film',
      label: 'Contenido',
      description: 'Gestión de películas, series y episodios',
      badge: movieCount + seriesCount,
      submenu: [
        {
          icon: 'film',
          label: 'Películas',
          route: '/admin/movies',
          badge: movieCount
        },
        {
          icon: 'video',
          label: 'Series',
          route: '/admin/series',
          badge: seriesCount
        },
        {
          icon: 'play',
          label: 'Episodios',
          route: '/admin/episodes',
          badge: episodeCount
        }
      ]
    },
    {
      id: 'categories',
      icon: 'grid',
      label: 'Categorías',
      route: '/admin/categories',
      description: 'Organización por géneros y categorías',
      badge: categoryCount
    }
  ];

  // ===== FUNCIONES DEL COMPONENTE =====

  // Verificar si una ruta está activa
  const isRouteActive = (route, exact = false) => {
    if (!route) return false;
    const activePath = currentPath || location.pathname;
    return exact ? activePath === route : activePath.startsWith(route);
  };

  // Toggle de menús expandibles
  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // Navegación con manejo de errores
  const handleNavigation = (route, event) => {
    if (!route) return;

    event?.preventDefault();

    navigateToRoute(route);
  };

  // Toggle del sidebar completo
  const handleSidebarToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  // Volver al home
  const handleBackToHome = () => {
    navigateToRoute('/');
  };

  // ===== CLASSES CSS =====
  const sidebarClasses = [
    'admin-sidebar',
    `admin-sidebar--${variant}`,
    isCollapsed && 'admin-sidebar--collapsed',
    loading && 'admin-sidebar--loading',
    error && 'admin-sidebar--error',
    className
  ].filter(Boolean).join(' ');

  // ===== RENDER PRINCIPAL =====
  return (
    <FlexContainer
      direction="column"
      justify="space-between"
      align="stretch"
      {...domProps} // ✅ Solo props válidas del DOM (ANTES para que no sobrescriba)
      className={sidebarClasses}
      role="navigation"
      aria-label="Navegación del panel de administración"
      style={style} // ✅ DESPUÉS para que tenga prioridad
    >

      {/* ===== HEADER DEL SIDEBAR ===== */}
      <FlexContainer
        direction="row"
        align="center"
        justify="space-between"
        gap="md"
        padding="lg"
        className="admin-sidebar__header"
      >
        {/* Brand */}
        {!isCollapsed && (
          <FlexContainer
            direction="row"
            align="center"
            gap="md"
            className="admin-sidebar__brand"
          >
            <span className="admin-sidebar__logo">
              {renderLogoIcon('settings')}
            </span>
            <FlexContainer direction="column" className="admin-sidebar__brand-text">
              <Typography variant="h2" size="md" weight="semibold" className="admin-sidebar__title">Admin Panel</Typography>
              <Typography variant="body" size="sm" color="muted" className="admin-sidebar__subtitle">StreamApp</Typography>
            </FlexContainer>
          </FlexContainer>
        )}

        {/* Toggle Button */}
        <Button
          variant="neutral"
          size="sm"
          onClick={handleSidebarToggle}
          className="admin-sidebar__toggle"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
          leftIcon={isCollapsed ? 'chevron-right' : 'chevron-left'}
          iconOnly
        />
      </FlexContainer>

      {/* ===== NAVEGACIÓN PRINCIPAL ===== */}
      <nav className="admin-sidebar__nav">
        <ul
          className="admin-sidebar__menu"
          role="menu"
          aria-label="Menú principal de administración"
        >
          {sidebarItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenus.has(item.id);
            const isActive = isRouteActive(item.route, item.route === '/admin');

            return (
              <li
                key={item.id}
                className="admin-sidebar__menu-item"
                role="none"
              >
                <button
                  className={[
                    'admin-sidebar__item',
                    isActive && 'admin-sidebar__item--active',
                    hasSubmenu && 'admin-sidebar__item--expandable'
                  ].filter(Boolean).join(' ')}
                  onClick={hasSubmenu ?
                    () => toggleSubmenu(item.id) :
                    (e) => handleNavigation(item.route, e)
                  }
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  aria-expanded={hasSubmenu ? isExpanded : undefined}
                  aria-describedby={!isCollapsed ? `${item.id}-desc` : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="admin-sidebar__item-icon">
                    {renderMainIcon(item.icon)}
                  </span>

                  {!isCollapsed && (
                    <>
                      <span className="admin-sidebar__item-label">
                        {item.label}
                      </span>

                      {/* Badge con contador */}
                      {item.badge > 0 && (
                        <span
                          className="admin-sidebar__badge"
                          aria-label={`${item.badge} elementos`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Flecha para submenús */}
                      {hasSubmenu && (
                        <span
                          className={[
                            'admin-sidebar__arrow',
                            isExpanded && 'admin-sidebar__arrow--expanded'
                          ].filter(Boolean).join(' ')}
                          aria-hidden="true"
                        >
                          {renderSubIcon('chevron-down')}
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Descripción para accesibilidad */}
                {!isCollapsed && (
                  <span
                    id={`${item.id}-desc`}
                    className="admin-sidebar__description"
                  >
                    {item.description}
                  </span>
                )}

                {/* Submenú */}
                {hasSubmenu && isExpanded && !isCollapsed && (
                  <ul
                    className="admin-sidebar__submenu"
                    role="menu"
                    aria-label={`Submenú de ${item.label}`}
                  >
                    {item.submenu.map((subitem, index) => (
                      <li
                        key={index}
                        className="admin-sidebar__submenu-item"
                        role="none"
                      >
                        <button
                          className={[
                            'admin-sidebar__subitem',
                            isRouteActive(subitem.route, true) && 'admin-sidebar__subitem--active'
                          ].filter(Boolean).join(' ')}
                          onClick={(e) => handleNavigation(subitem.route, e)}
                          role="menuitem"
                          aria-current={isRouteActive(subitem.route, true) ? 'page' : undefined}
                        >
                          <span className="admin-sidebar__subitem-icon">
                            {renderSubIcon(subitem.icon)}
                          </span>
                          <span className="admin-sidebar__subitem-label">
                            {subitem.label}
                          </span>

                          {/* Badge para subitem */}
                          {subitem.badge > 0 && (
                            <span
                              className="admin-sidebar__badge admin-sidebar__badge--small"
                              aria-label={`${subitem.badge} elementos`}
                            >
                              {subitem.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ===== FOOTER DEL SIDEBAR ===== */}
      {!isCollapsed && (
        <FlexContainer
          direction="column"
          gap="md"
          padding="lg"
          className="admin-sidebar__footer"
        >
          <FlexContainer
            direction="row"
            align="center"
            gap="md"
            className="admin-sidebar__user-info"
          >
            <div className="admin-sidebar__user-avatar">
              {renderMainIcon('user')}
            </div>
            <FlexContainer direction="column" className="admin-sidebar__user-details">
              <Typography variant="body" size="sm" weight="medium" className="admin-sidebar__user-name">Administrador</Typography>
              <Typography variant="body" size="xs" color="muted" className="admin-sidebar__user-role">Panel de Control</Typography>
            </FlexContainer>
          </FlexContainer>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleBackToHome}
            className="admin-sidebar__back-button"
            leftIcon="arrow-left"
          >
            Volver al inicio
          </Button>
        </FlexContainer>
      )}
    </FlexContainer>
  );
}

AdminSidebar.propTypes = {
  isCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  userCount: PropTypes.number,
  movieCount: PropTypes.number,
  seriesCount: PropTypes.number,
  categoryCount: PropTypes.number,
  episodeCount: PropTypes.number,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'dark', 'minimal']),
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onToggle: PropTypes.func,
  onNavigate: PropTypes.func,
  currentPath: PropTypes.string,
  style: PropTypes.object
};

export { AdminSidebar };