// ===== ADMIN LAYOUT COMPONENT =====
// src/components/templates/AdminLayout/AdminLayout.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AdminSidebar } from '../../organisms/AdminSidebar/AdminSidebar';
import { Button } from '../../atoms/Button/Button';
import './AdminLayout.css';

// Importar servicios para obtener contadores en tiempo real
import { getUsersService } from '../../../services/Users/getUsersService';
import { getMoviesService } from '../../../services/Movies/getMoviesService';
import { getSeriesService } from '../../../services/Series/getSeriesService';
import { getCategoriesService } from '../../../services/Categories/getCategoriesService';

/**
 * AdminLayout - Template base para el panel de administración
 * 
 * Características implementadas:
 * - ✅ Sidebar integrado con contadores dinámicos
 * - ✅ Header administrativo con breadcrumbs
 * - ✅ Área de contenido principal responsive
 * - ✅ Estados de loading para contadores
 * - ✅ Manejo de autenticación admin
 * - ✅ Responsive design completo
 * - ✅ Integración con servicios (SIN episodios)
 */
function AdminLayout({
  // Contenido principal
  children,

  // Configuración del header
  title,
  subtitle,
  // breadcrumbs = [],

  // Acciones del header
  headerActions,

  // Props del layout
  sidebarCollapsed = false,
  onSidebarToggle,

  // Props de customización
  className = '',
  variant = 'default', // 'default' | 'compact' | 'full'

  // Props adicionales
  ...restProps
}) {
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


  // ===== CLASSES CSS =====
  const layoutClasses = [
    'admin-layout',
    `admin-layout--${variant}`,
    isCollapsed ? 'admin-layout--collapsed' : '',
    className
  ].filter(Boolean).join(' ');

  // ===== SI NO HAY USUARIO, MOSTRAR LOADING =====
  if (!user) {
    return (
      <div className="admin-layout__loading">
        <div className="admin-layout__loading-content">
          <div className="admin-layout__spinner"></div>
          <p>Verificando acceso de administrador...</p>
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div className={layoutClasses} {...restProps}>

      {/* ===== SIDEBAR ===== */}
      <AdminSidebar
        isCollapsed={isCollapsed}  // Usar el prop correcto
        onToggleCollapse={handleSidebarToggle}
        counts={counts}
        loading={loadingCounts}
        error={countsError}
        currentPath={location.pathname}
      />

      {/* ===== ÁREA PRINCIPAL ===== */}
      <div className="admin-layout__main">
        {/* ===== HEADER ===== */}
        <header className="admin-layout__header">
          {/* Botón de menú móvil */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSidebarToggle}
            className="admin-layout__mobile-menu-button"
            aria-label={isCollapsed ? 'Abrir menú' : 'Cerrar menú'}
          >
            ☰
          </Button>

          {/* Título de página */}
          <div className="admin-layout__header-content">
            <div className="admin-layout__header-text">
              {title && <h1 className="admin-layout__title">{title}</h1>}
              {subtitle && <p className="admin-layout__subtitle">{subtitle}</p>}
            </div>

            {/* Acciones del header */}
            <div className="admin-layout__header-actions">
              {headerActions}
            </div>
          </div>
        </header>
        <main className="admin-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string
  })),
  headerActions: PropTypes.node,
  sidebarCollapsed: PropTypes.bool,
  onSidebarToggle: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'compact', 'full'])
};

export { AdminLayout };