// ===== ADMIN DASHBOARD PAGE =====
// src/Pages/Admin/AdminDashboard/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/templates/AdminLayout/AdminLayout';
import { FlexContainer } from '../../components/atoms/FlexContainer/FlexContainer';
import { Typography } from '../../components/atoms/Typography/Typography';
import { StatsCard } from '../../components/molecules/StatsCard/StatsCard';
import { Button } from '../../components/atoms/Button/Button';
import { Skeleton } from '../../components/atoms/Skeleton/Skeleton';
import { EmptyState } from '../../components/molecules/EmptyState/EmptyState';
import { Icon } from '../../components/atoms/Icon/Icon';
import { Container } from '../../components/atoms/Container/Container';

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

  // Sistema de iconos manejado por los componentes

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
      <AdminLayout title="Dashboard - Error">
        <Container size="lg">
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

  // ===== RENDER - SOLO COMPONENTES DEL SISTEMA =====
  return (
    <AdminLayout title="Dashboard">
      <FlexContainer direction="row" gap="md">
        <Icon name="trending" size="md" />
        <Typography size="lg" weight="semibold">
          Resumen General
        </Typography>
      </FlexContainer>

      {loading ? (
        <FlexContainer justify="center">
          {[...Array(4)].map((_, index) => (
            <Skeleton.Card
              key={index}
              size="lg"
              height={120}
              loading={true}
            />
          ))}
        </FlexContainer>
      ) : (
        <FlexContainer direction="row" gap="lg" wrap="wrap" distribute>
          {statsCards.map((card, index) => (
            <StatsCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              variant={card.variant || 'neutral'}
              onClick={card.onClick}
              loading={loading}
              width="full"
            />
          ))}
        </FlexContainer>
      )}

      {/* ===== ACCIONES RÁPIDAS ===== */}
      <FlexContainer gap="md">
        <Icon name="zap" size="md" />
        <Typography size="lg" weight="semibold">
          Acciones Rápidas
        </Typography>
      </FlexContainer>


      <FlexContainer direction="row" gap="lg" wrap="wrap">
        <Button
          variant="secondary"
          size="md"
          leftIcon="users"
          onClick={() => navigate('/admin/users/create')}
        >
          Crear Usuario
        </Button>

        <Button
          variant="secondary"
          size="md"
          leftIcon="film"
          onClick={() => navigate('/admin/movies/create')}
        >
          Agregar Película
        </Button>

        <Button
          variant="secondary"
          size="md"
          leftIcon="video"
          onClick={() => navigate('/admin/series/create')}
        >
          Crear Serie
        </Button>

        <Button
          variant="secondary"
          size="md"
          leftIcon="folder"
          onClick={() => navigate('/admin/categories/create')}
        >
          Nueva Categoría
        </Button>
      </FlexContainer>
    </AdminLayout>
  );
}

export { AdminDashboard };