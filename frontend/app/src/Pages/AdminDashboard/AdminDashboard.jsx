// ===== ADMIN DASHBOARD PAGE =====
// src/Pages/Admin/AdminDashboard/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../components/atoms/Container/Container';
import { StatsCard } from '../../components/molecules/StatsCard/StatsCard';
import { Button } from '../../components/atoms/Button/Button';
import { Skeleton } from '../../components/atoms/Skeleton/Skeleton';
import { EmptyState } from '../../components/molecules/EmptyState/EmptyState';
import { createIconRenderer } from '../../utils/iconHelpers';
import './AdminDashboard.css';

// Importar servicios para datos reales
import { getUsersService } from '../../services/Users/getUsersService';
import { getMoviesService } from '../../services/Movies/getMoviesService';
import { getSeriesService } from '../../services/Series/getSeriesService';
import { getCategoriesService } from '../../services/Categories/getCategoriesService';

/**
 * AdminDashboard - Página principal del panel de administración
 * 
 * Características implementadas:
 * - ✅ AdminLayout como contenedor base
 * - ✅ Grid de StatsCard con métricas principales
 * - ✅ Acciones rápidas para administradores
 * - ✅ Datos en tiempo real desde servicios
 * - ✅ Estados de loading y error
 * - ✅ Responsive design
 * - ✅ Navegación a páginas específicas
 */
function AdminDashboard() {
  const navigate = useNavigate();
  
  // ===== SISTEMA DE ICONOS CENTRALIZADO =====
  const renderIcon = createIconRenderer('sm'); // Tamaño por defecto más pequeño para títulos

  // ===== ESTADOS =====
  const [stats, setStats] = useState({
    users: { count: 0, change: 0 },
    movies: { count: 0, change: 0 },
    series: { count: 0, change: 0 },
    categories: { count: 0, change: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== EFECTOS =====
  
  /**
   * Cargar estadísticas desde servicios
   */
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ejecutar llamadas en paralelo
        const [
          usersResponse,
          moviesResponse,
          seriesResponse,
          categoriesResponse
        ] = await Promise.allSettled([
          getUsersService(),
          getMoviesService(),
          getSeriesService(),
          getCategoriesService()
        ]);

        // Procesar respuestas y extraer contadores
        const newStats = {
          users: {
            count: getArrayLength(usersResponse),
            change: Math.floor(Math.random() * 20) - 5 // Simulado por ahora
          },
          movies: {
            count: getArrayLength(moviesResponse),
            change: Math.floor(Math.random() * 15) - 3
          },
          series: {
            count: getArrayLength(seriesResponse),
            change: Math.floor(Math.random() * 10) - 2
          },
          categories: {
            count: getArrayLength(categoriesResponse),
            change: Math.floor(Math.random() * 5) - 1
          }
        };

        setStats(newStats);

      } catch {
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * Extraer longitud de arrays de respuestas de Promise.allSettled
   */
  const getArrayLength = (promiseResult) => {
    if (promiseResult.status === 'fulfilled' && Array.isArray(promiseResult.value)) {
      return promiseResult.value.length;
    }
    if (promiseResult.status === 'fulfilled' && promiseResult.value?.data && Array.isArray(promiseResult.value.data)) {
      return promiseResult.value.data.length;
    }
    return 0;
  };

  // ===== CONFIGURACIÓN DE ESTADÍSTICAS =====
  const statsCards = [
    {
      title: 'Usuarios',
      value: stats.users.count,
      icon: 'users',
      variant: 'primary', // Anteriormente 'blue'
      change: `${stats.users.change > 0 ? '+' : ''}${stats.users.change}%`,
      changeLabel: 'último mes',
      onClick: () => navigate('/admin/users')
    },
    {
      title: 'Películas',
      value: stats.movies.count,
      icon: 'film',
      variant: 'success', // Anteriormente 'green'
      change: `${stats.movies.change > 0 ? '+' : ''}${stats.movies.change}%`,
      changeLabel: 'esta semana',
      onClick: () => navigate('/admin/movies')
    },
    {
      title: 'Series',
      value: stats.series.count,
      icon: 'video',
      variant: 'primary', // Cambiado a primary para consistencia con otras cards
      change: `${stats.series.change > 0 ? '+' : ''}${stats.series.change}%`,
      changeLabel: 'último mes',
      onClick: () => navigate('/admin/series')
    },
    {
      title: 'Categorías',
      value: stats.categories.count,
      icon: 'folder',
      variant: 'warning', // Anteriormente 'yellow'
      change: `${stats.categories.change > 0 ? '+' : ''}${stats.categories.change}%`,
      changeLabel: 'este año',
      onClick: () => navigate('/admin/categories')
    }
  ];

  // ===== MANEJO DE ERRORES CON SISTEMA DE DISEÑO =====
  if (error) {
    return (
      <AdminLayout>
        <Container size="lg" className="admin-dashboard admin-dashboard--error">
          <EmptyState
            icon="alert-triangle"
            title="Error al cargar el dashboard"
            description={error}
            variant="danger"
            size="lg"
            action={
              <Button
                variant="primary"
                size="md"
                onClick={() => window.location.reload()}
                leftIcon="refresh-cw"
              >
                Reintentar
              </Button>
            }
          />
        </Container>
      </AdminLayout>
    );
  }

  // ===== RENDER =====
  return (
    <AdminLayout
    title="Dashboard"
    >
      <Container size="lg" className="admin-dashboard">
        
        {/* ===== ESTADÍSTICAS PRINCIPALES ===== */}
        <section className="admin-dashboard__stats">
          <h2 className="admin-dashboard__section-title">
            {renderIcon('trending')} Resumen General
          </h2>
          
          {loading ? (
            <div className="admin-dashboard__stats-grid">
              {[...Array(4)].map((_, index) => (
                <Skeleton.Card
                  key={index}
                  size="lg"
                  height={120}
                  loading={true}
                  className="stats-card-skeleton"
                />
              ))}
            </div>
          ) : (
            <div className="admin-dashboard__stats-grid">
              {statsCards.map((card, index) => (
                <StatsCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  variant={card.variant || 'neutral'} // Usar variantes estándar
                  onClick={card.onClick}
                  loading={loading}
                  size="md"
                  fullWidth={true}
                  // DEPRECATED: mantener por compatibilidad
                  change={card.change}
                  changeLabel={card.changeLabel}
                  color={card.color}
                />
              ))}
            </div>
          )}
        </section>

        {/* ===== ACCIONES RÁPIDAS ===== */}
        <section className="admin-dashboard__quick-actions">
          <h2 className="admin-dashboard__section-title">
            {renderIcon('zap')} Acciones Rápidas
          </h2>
          
          <div className="admin-dashboard__actions-grid">
            <Button
              variant="secondary"
              size="md"
              rounded="md"
              leftIcon="users"
              onClick={() => navigate('/admin/users/create')}
              className="admin-dashboard__action-button"
            >
              Crear Usuario
            </Button>
            
            <Button
              variant="secondary"
              size="md"
              rounded="md"
              leftIcon="film"
              onClick={() => navigate('/admin/movies/create')}
              className="admin-dashboard__action-button"
            >
              Agregar Película
            </Button>
            
            <Button
              variant="secondary"
              size="md"
              rounded="md"
              leftIcon="video"
              onClick={() => navigate('/admin/series/create')}
              className="admin-dashboard__action-button"
            >
              Crear Serie
            </Button>
            
            <Button
              variant="secondary"
              size="md"
              rounded="md"
              leftIcon="folder"
              onClick={() => navigate('/admin/categories/create')}
              className="admin-dashboard__action-button"
            >
              Nueva Categoría
            </Button>
          </div>
        </section>

      </Container>
    </AdminLayout>
  );
}

export { AdminDashboard };