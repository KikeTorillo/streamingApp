// ===== ADMIN LAYOUT COMPONENT =====
// src/components/templates/AdminLayout/AdminLayout.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AdminSidebar } from '../../organisms/AdminSidebar/AdminSidebar';
import { Breadcrumb } from '../../molecules/Breadcrumb/Breadcrumb';
import { GridContainer } from '../../atoms/GridContainer/GridContainer';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Container } from '../../atoms/Container/Container';
import { Typography } from '../../atoms/Typography/Typography';
import { validateStandardProps, STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens/standardProps';
import { LAYOUT_TOKENS } from '../../../tokens/designTokens';

// Importar servicios para obtener contadores en tiempo real
import { getUsersService } from '../../../services/Users/getUsersService';
import { getMoviesService } from '../../../services/Movies/getMoviesService';
import { getSeriesService } from '../../../services/Series/getSeriesService';
import { getCategoriesService } from '../../../services/Categories/getCategoriesService';

/**
 * AdminLayout - Template base para el panel de administración
 * 
 * ✅ MIGRADO AL SISTEMA ESTÁNDAR DE DISEÑO ✅
 * 
 * Características implementadas:
 * - ✅ Props estándar del sistema (size, variant, rounded, loading, disabled)
 * - ✅ validateStandardProps con deprecation warnings integradas
 * - ✅ STANDARD_PROP_TYPES para consistencia
 * - ✅ Backward compatibility para variant='default' → 'primary'
 * - ✅ Sidebar integrado con contadores dinámicos
 * - ✅ Header administrativo con breadcrumbs
 * - ✅ Área de contenido principal responsive
 * - ✅ Estados de loading para contadores
 * - ✅ Manejo de autenticación admin
 * - ✅ Responsive design completo
 * - ✅ Integración con servicios (SIN episodios)
 * - ✅ Container del sistema estándar integrado
 */
function AdminLayout({
  // Contenido principal
  children,

  // Configuración del header
  title,
  subtitle,
  breadcrumbs = [],

  // Acciones del header
  headerActions,

  // Props del layout
  sidebarCollapsed = false,
  onSidebarToggle,

  // ===== PROPS ESTÁNDAR DEL SISTEMA =====
  size = 'xl',           // Tamaño del container principal ('xs', 'sm', 'md', 'lg', 'xl')
  variant = 'primary',   // Esquema de colores ('primary', 'secondary', 'success', 'warning', 'danger', 'neutral')
  rounded = 'lg',        // Radio de bordes ('sm', 'md', 'lg', 'xl', 'full')
  disabled = false,      // Deshabilitar interacciones
  loading = false,       // Estado de loading global
  className = '',        // Clases CSS adicionales

  // Props adicionales
  ...restProps
}) {
  // ===== VALIDAR PROPS ESTÁNDAR =====
  validateStandardProps({
    size, variant, rounded, disabled, loading, className,
    sidebarCollapsed, onSidebarToggle, title, subtitle, breadcrumbs, headerActions,
    ...restProps
  }, 'AdminLayout');

  // Mapear variant legacy con deprecation warning
  let finalVariant = variant;
  if (variant === 'default') {
    console.warn('AdminLayout: variant="default" está deprecada. Usar variant="primary" en su lugar.');
    finalVariant = 'primary';
  }

  // Extraer variantes de layout legacy (mantener compatibilidad)
  const layoutVariant = restProps.layoutVariant || (variant === 'compact' ? 'compact' : variant === 'full' ? 'full' : 'default');
  const navigate = useNavigate();
  const location = useLocation();

  // ===== ESTADOS =====
  const [isCollapsed, setIsCollapsed] = useState(sidebarCollapsed);
  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState({
    users: 0,
    movies: 0,
    series: 0,
    categories: 0
    // ❌ ELIMINADO: episodes: 0
  });
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [countsError, setCountsError] = useState(null);

  // ===== VERIFICAR AUTENTICACIÓN ADMIN =====
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('sessionUser');
    if (!sessionUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(sessionUser);

      // Verificar que sea admin (ajustar según tu sistema de roles)
      const isAdmin = userData.role === 'admin' ||
        userData.roleId === 1 ||
        userData.isAdmin === true;

      if (!isAdmin) {
        // Si no es admin, redirigir al inicio
        navigate('/');
        return;
      }

      setUser(userData);
    } catch (authError) {
      navigate('/login');
      void authError; // Evitar warning unused-vars
    }
  }, [navigate]);

  // ===== CARGAR CONTADORES EN TIEMPO REAL (SIN EPISODIOS) =====
  useEffect(() => {
    if (!user) return;

    const loadCounts = async () => {
      try {
        setLoadingCounts(true);
        setCountsError(null);

        // Cargar contadores en paralelo (SIN episodios)
        const [
          usersResponse,
          moviesResponse,
          seriesResponse,
          categoriesResponse
          // ❌ ELIMINADO: episodesResponse
        ] = await Promise.allSettled([
          getUsersService().catch(() => []),
          getMoviesService().catch(() => []),
          getSeriesService().catch(() => []),
          getCategoriesService().catch(() => [])
          // ❌ ELIMINADO: getEpisodesService().catch(() => [])
        ]);

        // Procesar respuestas y extraer contadores (SIN episodios)
        const newCounts = {
          users: getArrayLength(usersResponse),
          movies: getArrayLength(moviesResponse),
          series: getArrayLength(seriesResponse),
          categories: getArrayLength(categoriesResponse)
          // ❌ ELIMINADO: episodes: getArrayLength(episodesResponse)
        };

        setCounts(newCounts);
      } catch (countsLoadError) {
        setCountsError('Error al cargar contadores');
        void countsLoadError; // Evitar warning unused-vars
      } finally {
        setLoadingCounts(false);
      }
    };

    loadCounts();
  }, [user]);

  // ===== FUNCIÓN AUXILIAR PARA EXTRAER LONGITUD DE ARRAYS =====
  const getArrayLength = (promiseResult) => {
    if (promiseResult.status === 'fulfilled' && Array.isArray(promiseResult.value)) {
      return promiseResult.value.length;
    }
    return 0;
  };

  // ===== MANEJAR TOGGLE DEL SIDEBAR =====
  const handleSidebarToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onSidebarToggle) {
      onSidebarToggle(newCollapsed);
    }
  };

  // ===== MANEJAR LOGOUT =====
  // const handleLogout = () => {
  //   sessionStorage.removeItem('sessionUser');
  //   navigate('/login');
  // };


  // ===== CLASSES CSS CON SISTEMA ESTÁNDAR =====
  const layoutClasses = [
    'admin-layout',
    `admin-layout--${layoutVariant}`, // Layout variant (default, compact, full)
    `admin-layout--variant-${finalVariant}`, // Color variant del sistema estándar
    `admin-layout--size-${size}`, // Tamaño del sistema estándar
    `admin-layout--rounded-${rounded}`, // Radio del sistema estándar
    isCollapsed ? 'admin-layout--collapsed' : '',
    loading ? 'admin-layout--loading' : '',
    disabled ? 'admin-layout--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  // ===== SI NO HAY USUARIO O LOADING GLOBAL, MOSTRAR LOADING =====
  if (!user || loading) {
    return (
      <FlexContainer 
        direction="column" 
        align="center" 
        justify="center"
        className="admin-layout__loading"
      >
        <FlexContainer direction="column" align="center" spacing="md" className="admin-layout__loading-content">
          <Container className="admin-layout__spinner" />
          <Typography variant="body" size="md" color="muted">
            {loading ? 'Cargando panel de administración...' : 'Verificando acceso de administrador...'}
          </Typography>
        </FlexContainer>
      </FlexContainer>
    );
  }

  // Extraer solo props válidas para DOM
  const validDOMProps = extractDOMProps(restProps);

  // ===== RENDER PRINCIPAL =====
  return (
    <GridContainer
      {...validDOMProps}
      columns={isCollapsed ? `${LAYOUT_TOKENS.sidebar.widthCollapsed} 1fr` : `${LAYOUT_TOKENS.sidebar.widthExpanded} 1fr`}
      rows="min-content 1fr"
      areas={`
          "sidebar header"
          "sidebar main"
        `}
      spacing="none"
    >

      {/* ===== SIDEBAR ===== */}
      <AdminSidebar
        area="sidebar"
        isCollapsed={isCollapsed}
        onToggleCollapse={handleSidebarToggle}
        counts={counts}
        loading={loadingCounts}
        error={countsError}
        currentPath={location.pathname}
      />

      {/* ===== HEADER ===== */}
      <Container
        area="header"
        size="full"
        padding="md"
      >
        <FlexContainer
          direction="column"
          spacing="sm"
          padding="none"

        >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb
              items={breadcrumbs}
              size="sm"
              variant="neutral"
              showHome={true}
              showIcons={true}
              homeItem={{
                label: 'Admin',
                to: '/admin',
                icon: 'settings'
              }}
            />
        )}

        {/* Título y acciones */}
        <FlexContainer direction="row" justify="space-between">
          <FlexContainer direction="column">
            {title && (
              <Typography 
                variant="h1" 
                size="lg" 
                weight="bold"
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography 
                variant="body" 
                size="md" 
                color="muted"
              >
                {subtitle}
              </Typography>
            )}
          </FlexContainer>

          {/* Acciones del header */}
          {headerActions && (
            <FlexContainer direction="row" spacing="sm">
              {headerActions}
            </FlexContainer>
          )}
        </FlexContainer>
        </FlexContainer>
      </Container>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <Container
        area="main"
        size="full"
        spacing="lg"
      >
        {children}
      </Container>

    </GridContainer>
  );
}

AdminLayout.propTypes = {
  // Contenido y configuración
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    to: PropTypes.string
  })),
  headerActions: PropTypes.node,

  // Props del layout
  sidebarCollapsed: PropTypes.bool,
  onSidebarToggle: PropTypes.func,
  layoutVariant: PropTypes.oneOf(['default', 'compact', 'full']), // Layout específico (legacy)

  // ===== PROPS ESTÁNDAR DEL SISTEMA =====
  ...STANDARD_PROP_TYPES
};

export { AdminLayout };