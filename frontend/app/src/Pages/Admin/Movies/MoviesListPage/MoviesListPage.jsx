// ===== MOVIES LIST PAGE - COLUMNAS CORREGIDAS PARA BACKEND REAL =====
// src/Pages/Admin/Movies/MoviesListPage/MoviesListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organism/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { ContentImage } from '../../../../components/atoms/ContentImage/ContentImage';
import './MoviesListPage.css';

// Importar servicios
import { getMoviesService } from '../../../../services/Movies/getMoviesService';
import { deleteMovieService } from '../../../../services/Movies/deleteMovieService';
import { useMovieNavigation } from '../../../../hooks/useMovieNavigation';

/**
 * MoviesListPage - CORREGIDO con columnas reales del backend
 * 
 * ✅ COLUMNAS REALES: Solo campos que existen en la base de datos
 * ✅ BACKEND COMPATIBLE: Usa estructura real de movies table
 * ✅ INFORMACIÓN CORRECTA: No muestra datos que no vienen del servidor
 */
function MoviesListPage() {
  const navigate = useNavigate();
  const { navigateToPlayer } = useMovieNavigation();

  // ===== ESTADOS =====
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ===== CONFIGURACIÓN DE COLUMNAS CORREGIDAS =====
  const movieColumns = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      size: 60,
      cell: ({ getValue }) => (
        <span>
          #{getValue()}
        </span>
      )
    },
    {
      id: 'poster',
      accessorKey: 'cover_image',
      header: 'Portada',
      enableSorting: false,
      size: 80,
      cell: ({ getValue, row }) => {
        const coverImage = getValue();
        const title = row.original.title;

        // Construir URL completa para la imagen (igual que en MainPage)
        const imageUrl = coverImage ? `${import.meta.env.VITE_CDN_URL || 'http://localhost:8082'}/covers/${coverImage}/cover.jpg` : null;

        return (
          <ContentImage
            src={imageUrl}
            alt={`Portada de ${title}`}
            aspectRatio="2/3"
            contentType="movie"
            placeholder="🎬"
            rounded="md"
            showFallback={true}
          />
        );
      }
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Título',
      size: 250,
      cell: ({ getValue, row }) => {
        const title = getValue();
        const mediaType = row.original.media_type || 'movie';

        return (
          <div>
            <p>
              {title}
            </p>
            <Badge
              variant="info"
              size="xs"
              style="soft"
            >
              🎬 Película
            </Badge>
          </div>
        );
      }
    },
    {
      id: 'category',
      accessorKey: 'category_name',
      header: 'Categoría',
      size: 150,
      cell: ({ getValue, row }) => {
        const categoryName = getValue();
        const categoryId = row.original.category_id;

        return (
          <Badge
            variant="neutral"
            size="sm"
            style="soft"
          >
            📂 {categoryName || 'Sin categoría'}
          </Badge>
        );
      }
    },
    {
      id: 'release_year',
      accessorKey: 'release_year',
      header: 'Año',
      size: 100,
      cell: ({ getValue }) => (
        <span>
          {getValue()}
        </span>
      )
    },
    // ✅ DESCRIPCIÓN ELIMINADA - Esta columna ya no existe
    {
      id: 'created_at',
      accessorKey: 'created_at',
      header: 'Fecha Agregada',
      size: 140,
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        const now = new Date();

        // ✅ CORREGIDO: Comparar solo las fechas (año, mes, día) ignorando horas
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const createdDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        // Calcular diferencia en días de forma correcta
        const diffTime = today.getTime() - createdDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let timeDisplay;
        let badgeVariant = 'neutral';

        if (diffDays === 0) {
          // Mismo día = HOY
          timeDisplay = 'Hoy';
          badgeVariant = 'success';
        } else if (diffDays === 1) {
          // 1 día de diferencia = AYER
          timeDisplay = 'Ayer';
          badgeVariant = 'warning';
        } else if (diffDays === -1) {
          // Fecha futura (edge case)
          timeDisplay = 'Mañana';
          badgeVariant = 'info';
        } else if (diffDays > 1 && diffDays <= 7) {
          // Entre 2-7 días
          timeDisplay = `${diffDays} días`;
          badgeVariant = 'info';
        } else if (diffDays > 7 && diffDays <= 30) {
          // Entre 1-4 semanas
          const weeks = Math.floor(diffDays / 7);
          timeDisplay = weeks === 1 ? '1 sem' : `${weeks} sem`;
        } else if (diffDays > 30 && diffDays <= 365) {
          // Entre 1-12 meses
          const months = Math.floor(diffDays / 30);
          timeDisplay = months === 1 ? '1 mes' : `${months} meses`;
        } else if (diffDays > 365) {
          // Más de 1 año
          const years = Math.floor(diffDays / 365);
          timeDisplay = years === 1 ? '1 año' : `${years} años`;
        } else {
          // Fecha muy reciente (menos de 1 día)
          timeDisplay = date.toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric'
          });
        }

        return (
          <div>
            <Badge
              variant={badgeVariant}
              size="xs"
              style="soft"
            >
              {timeDisplay}
            </Badge>
            <div>
              {date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })} {date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        );
      }
    }
  ];

  // ===== FUNCIONES (mantienen la misma lógica) =====

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // ===== USAR DATOS REALES DEL BACKEND =====
      const moviesData = await getMoviesService();
      console.log('📥 Datos recibidos del backend:', moviesData);
      setMovies(moviesData || []);

    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Error al cargar las películas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = () => {
    navigate('/admin/movies/create');
  };

  const handleEditMovie = (movie) => {
    navigate(`/admin/movies/edit/${movie.id}`);
  };

  const handleViewMovie = (movie) => {
    console.log('🎬 Ver película:', movie);
    
    // Transformar datos de película para el hook de navegación
    const movieData = {
      ...movie,
      type: 'movie',
      _original: movie // Datos originales para el hook
    };
    
    navigateToPlayer(movieData);
  };

  const handleDeleteMovie = async (movie) => {
    const confirmMessage =
      `¿Estás seguro de que quieres eliminar "${movie.title}"?\n\n` +
      `⚠️ ADVERTENCIA: Esta acción eliminará permanentemente:\n` +
      `• El archivo de video y todos sus archivos asociados\n` +
      `• La imagen de portada\n` +
      `• Todos los datos de la película\n\n` +
      `Esta acción NO se puede deshacer.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(movie.id);

      console.log('🗑️ Eliminando película:', movie);

      const response = await deleteMovieService(movie.id);

      console.log('📥 Respuesta del servicio de eliminación:', response);

      console.log('✅ Película eliminada exitosamente');

      alert(`✅ Película "${movie.title}" eliminada exitosamente`);

      await loadMovies();

    } catch (error) {
      console.error('💥 Error al eliminar película:', error);

      let errorMessage = `Error al eliminar la película "${movie.title}".`;

      if (error.response?.status === 401) {
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      } else if (error.response?.status === 404) {
        errorMessage = 'La película no existe o ya fue eliminada.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar esta película.';
      } else if (error.response?.status === 409) {
        errorMessage = 'No se puede eliminar la película porque tiene datos asociados.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`❌ ${errorMessage}`);

    } finally {
      setDeleting(null);
    }
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadMovies();
  }, []);

  // ===== ESTADÍSTICAS MEJORADAS =====
  const getMoviesStats = () => {
    const total = movies.length;
    const thisWeek = movies.filter(movie => {
      const createdDate = new Date(movie.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length;

    const withCategory = movies.filter(movie => movie.category_name).length;
    const moviesCount = movies.filter(movie => !movie.media_type || movie.media_type === 'movie').length;
    const seriesCount = movies.filter(movie => movie.media_type === 'tv').length;

    return { total, thisWeek, withCategory, moviesCount, seriesCount };
  };

  const stats = getMoviesStats();

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Películas"
      headerActions={
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateMovie}
            leftIcon="➕"
          >
            Agregar Contenido
          </Button>
        </div>
      }
    >
      <div>
        {error && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: 'var(--space-lg)'
          }}>
            <Badge
              variant="danger"
              size="lg"
              icon="❌"
              style="soft"
            >
              {error}
            </Badge>
          </div>
        )}

        <DataTable
          data={movies}
          columns={movieColumns}
          loading={loading}
          onEdit={handleEditMovie}
          onView={handleViewMovie}
          onDelete={handleDeleteMovie}
          deleting={deleting}
          emptyTitle="No hay películas registradas"
          emptyDescription="Comienza agregando tu primera película o serie"
          emptyIcon="🎬"
          emptyAction={
            <Button
              variant="primary"
              onClick={handleCreateMovie}
              leftIcon="➕"
            >
              Agregar Primera Película
            </Button>
          }
          searchable
          searchPlaceholder="Buscar por título, categoría o año..."
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          variant="striped"
        />
      </div>
    </AdminLayout>
  );
}

export { MoviesListPage };