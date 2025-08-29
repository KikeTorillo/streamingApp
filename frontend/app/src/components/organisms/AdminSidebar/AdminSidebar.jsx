// ===== ADMINSIDEBAR COMPONENT =====

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Icon, Badge, Avatar, useInteractiveProps, extractDOMPropsV2, FlexContainer, Typography } from '../../../../design-system';
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
  } = useInteractiveProps(props, {
    componentName: 'AdminSidebar',
    defaultSize: 'md',
    defaultVariant: 'secondary'
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
  const domProps = extractDOMPropsV2(propsForDOM);

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

  // ===== TAMAÑOS DE ICONOS DEFINIDOS =====
  // Usando Icon directo porque AdminSidebar es componente de aplicación
  const ICON_SIZES = {
    logo: 'md',
    main: 'sm',
    sub: 'xs'
  };

  // ===== CONFIGURACIÓN DE MENÚS =====
  const sidebarItems = [
    {
      id: 'dashboard',
      icon: 'trending',
      label: 'Dashboard',
      route: '/admin',
      badge: 0
    },
    {
      id: 'users',
      icon: 'users',
      label: 'Usuarios',
      route: '/admin/users',
      badge: userCount
    },
    {
      id: 'content',
      icon: 'film',
      label: 'Contenido',
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
        spacing="md"
        padding="lg"
        className="admin-sidebar__header"
      >
        {/* Brand */}
        {!isCollapsed && (
          <FlexContainer
            direction="row"
            align="center"
            spacing="md"
            className="admin-sidebar__brand"
          >
            <Icon
              name="settings"
              size={ICON_SIZES.logo}
              variant={variant}
              className="admin-sidebar__logo"
            />
            <FlexContainer direction="column" className="admin-sidebar__brand-text">
              <Typography variant="h2" size="md" weight="semibold" align="center" className="admin-sidebar__title">Admin Panel</Typography>
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
                  <Icon
                    name={item.icon}
                    size={ICON_SIZES.main}
                    variant={isActive ? 'primary' : variant}
                    className="admin-sidebar__item-icon"
                  />

                  {!isCollapsed && (
                    <>
                      <Typography
                        as="span"
                        size="sm"
                        weight="medium"
                        className="admin-sidebar__item-label"
                        align="center"
                      >
                        {item.label}
                      </Typography>

                      {/* Badge con contador */}
                      {item.badge > 0 && (
                        <Badge
                          variant={isActive ? 'primary' : 'secondary'}
                          size="xs"
                          className="admin-sidebar__badge"
                          aria-label={`${item.badge} elementos`}
                        >
                          {item.badge}
                        </Badge>
                      )}

                      {/* Flecha para submenús */}
                      {hasSubmenu && (
                        <Icon
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={ICON_SIZES.sub}
                          variant={variant}
                          className={[
                            'admin-sidebar__arrow',
                            isExpanded && 'admin-sidebar__arrow--expanded'
                          ].filter(Boolean).join(' ')}
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Descripción para accesibilidad */}
                {(!isCollapsed && item.description) && (
                  <FlexContainer
                    justify="center"
                    align="center"
                    padding="sm"
                    className="admin-sidebar__description-container"
                  >
                    <Typography
                      as="span"
                      id={`${item.id}-desc`}
                      size="xs"
                      color="muted"
                      align="center"
                      className="admin-sidebar__description"
                    >
                      {item.description}
                    </Typography>
                  </FlexContainer>
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
                          <Icon
                            name={subitem.icon}
                            size={ICON_SIZES.sub}
                            variant={isRouteActive(subitem.route, true) ? 'primary' : variant}
                            className="admin-sidebar__subitem-icon"
                          />
                          <Typography
                            as="span"
                            size="sm"
                            weight="medium"
                            className="admin-sidebar__subitem-label"
                          >
                            {subitem.label}
                          </Typography>

                          {/* Badge para subitem */}
                          {subitem.badge > 0 && (
                            <Badge
                              variant={isRouteActive(subitem.route, true) ? 'primary' : 'secondary'}
                              size="xs"
                              className="admin-sidebar__badge admin-sidebar__badge--small"
                              aria-label={`${subitem.badge} elementos`}
                            >
                              {subitem.badge}
                            </Badge>
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
          spacing="md"
          padding="lg"
          className="admin-sidebar__footer"
        >
          <FlexContainer
            direction="row"
            align="center"
            spacing="md"
            className="admin-sidebar__user-info"
          >
            <Avatar
              name="Administrador"
              size="sm"
              variant={variant}
              className="admin-sidebar__user-avatar"
            />
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
  style: PropTypes.object,
  area: PropTypes.string
};

export { AdminSidebar };