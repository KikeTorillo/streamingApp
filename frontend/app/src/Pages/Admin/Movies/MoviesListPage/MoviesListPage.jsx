// ===== MOVIES LIST PAGE - COLUMNAS CORREGIDAS PARA BACKEND REAL =====
// src/Pages/Admin/Movies/MoviesListPage/MoviesListPage.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organisms/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { ContentImage } from '../../../../components/atoms/ContentImage/ContentImage';
import { useMovies } from '../../../../app/context/MoviesContext';
import { useMovieNavigation } from '../../../../hooks/useMovieNavigation';
import './MoviesListPage.css';

/**
 * MoviesListPage - REFACTORIZADO CON MOVIESCONTEXT
 * 
 * ✅ MIGRADO: Usa MoviesContext para gestión de estado
 * ✅ SIMPLIFICADO: Lógica centralizada en el contexto
 * ✅ BACKEND COMPATIBLE: Usa estructura real de movies table
 * ✅ MANTENIDO: Funcionalidad completa
 */
function MoviesListPage() {
  const navigate = useNavigate();
  const { navigateToPlayer } = useMovieNavigation();

  // ===== CONTEXTO DE PELÍCULAS =====
  const {
    movies,
    loading,
    error,
    deleting,
    loadMovies,
    refreshMovies,
    deleteMovie,
    formatMovieDate,
    getMovieCoverUrl,
    getMoviesStats
  } = useMovies();

  // ===== MANEJO DE SESIÓN EXPIRADA =====
  useEffect(() => {
    if (error === 'SESSION_EXPIRED') {
      navigate('/login');
    }
  }, [error, navigate]);

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

        // Usar función del contexto para construir URL
        const imageUrl = getMovieCoverUrl(coverImage);

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
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        const timeDisplay = formatMovieDate(getValue());
        
        // Determinar variante del badge basado en el texto
        let badgeVariant = 'neutral';
        if (timeDisplay === 'Hoy') {
          badgeVariant = 'success';
        } else if (timeDisplay === 'Ayer') {
          badgeVariant = 'warning';
        } else if (timeDisplay.includes('días') || timeDisplay.includes('sem')) {
          badgeVariant = 'info';
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

  // ===== FUNCIONES SIMPLIFICADAS =====

  const handleCreateMovie = () => {
    navigate('/admin/movies/create');
  };

  const handleEditMovie = (movie) => {
    navigate(`/admin/movies/edit/${movie.id}`);
  };

  const handleViewMovie = (movie) => {
    console.log('🎬 [MoviesListPage] Ver película:', movie);
    
    // Transformar datos de película para el hook de navegación
    const movieData = {
      ...movie,
      type: 'movie',
      _original: movie // Datos originales para el hook
    };
    
    navigateToPlayer(movieData);
  };

  const handleDeleteMovie = (movie) => {
    console.log('🗑️ [MoviesListPage] Solicitud de eliminación:', movie);
    
    // El contexto maneja toda la lógica de confirmación y mensajes
    deleteMovie(movie);
  };

  const handleRefresh = () => {
    refreshMovies();
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadMovies();
  }, []);

  // ===== ESTADÍSTICAS - USA FUNCIÓN DEL CONTEXTO =====
  const stats = getMoviesStats();

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Películas"
      headerActions={
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <Button
            variant="outline"
            size="sm"
            leftIcon="🔄"
            onClick={handleRefresh}
            loading={loading}
            disabled={loading}
          >
            Actualizar
          </Button>
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