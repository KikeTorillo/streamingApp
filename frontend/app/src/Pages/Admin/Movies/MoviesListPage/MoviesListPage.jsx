// ===== MOVIES LIST PAGE - COLUMNAS CORREGIDAS PARA BACKEND REAL =====
// src/Pages/Admin/Movies/MoviesListPage/MoviesListPage.jsx

import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organisms/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { Image } from '../../../../components/atoms/Image/Image';
import { FlexContainer } from '../../../../components/atoms/FlexContainer/FlexContainer';
import { Typography } from '../../../../components/atoms/Typography/Typography';
import { useMovies } from '../../../../app/context/MoviesContext';
import { useMovieNavigation } from '../../../../hooks/useMovieNavigation';

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
    deleteMovie,
    formatMovieDate,
    getMovieCoverUrl
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
        <Typography variant="span" size="xs" weight="medium" color="muted">
          #{getValue()}
        </Typography>
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
          <Image
            src={imageUrl}
            alt={`Portada de ${title}`}
            aspectRatio="portrait"
            loading="lazy"
            rounded="md"
            size="xs"
            style={{
              width: '60px',
              height: '80px',
              objectFit: 'cover'
            }}
          />
        );
      }
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Título',
      size: 250,
      cell: ({ getValue }) => {
        const title = getValue();

        return (
          <div>
            <Typography variant="body" size="sm" weight="medium">
              {title}
            </Typography>
            <Badge
              variant="primary"
              size="xs"
              appearance="soft"
              leftIcon="film"
            >
              Película
            </Badge>
          </div>
        );
      }
    },
    {
      id: 'category',
      accessorKey: 'category_name',
      header: 'Categoría',
      cell: ({ getValue }) => {
        const categoryName = getValue();

        return (
          <Badge
            variant="primary"
            size="sm"
            appearance="soft"
            leftIcon="folder"
          >
            {categoryName || 'Sin categoría'}
          </Badge>
        );
      }
    },
    {
      id: 'release_year',
      accessorKey: 'release_year',
      header: 'Año',
      cell: ({ getValue }) => (
        <Typography variant="span" size="sm" weight="normal">
          {getValue()}
        </Typography>
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
              appearance="soft"
            >
              {timeDisplay}
            </Badge>
            <Typography variant="div" size="xs" color="muted">
              {date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })} {date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
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

    // Transformar datos de película para el hook de navegación
    const movieData = {
      ...movie,
      type: 'movie',
      _original: movie // Datos originales para el hook
    };
    
    navigateToPlayer(movieData);
  };

  const handleDeleteMovie = (movie) => {

    // El contexto maneja toda la lógica de confirmación y mensajes
    deleteMovie(movie);
  };


  // ===== EFECTOS =====
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Películas"
      subtitle="Administración completa del catálogo de películas"
      breadcrumbs={[
        { label: 'Películas' }
      ]}
      headerActions={
        <FlexContainer spacing="sm">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateMovie}
            leftIcon="plus"
          >
            Agregar Contenido
          </Button>
        </FlexContainer>
      }
    >
        <DataTable
          data={movies}
          columns={movieColumns}
          loading={loading}
          error={error}
          onEdit={handleEditMovie}
          onView={handleViewMovie}
          onDelete={handleDeleteMovie}
          deleting={deleting}
          searchPlaceholder="Buscar películas por título, categoría o año..."
          pageSizeOptions={[10, 25, 50, 100]}
          pageSize={10}
          variant="primary"
          emptyTitle="No hay películas registradas"
          emptyDescription="Comienza agregando tu primera película al catálogo"
          emptyIcon="film"
          className={deleting ? 'movies-list__table--deleting' : ''}
        />
    </AdminLayout>
  );
}

// Memoizar página para evitar re-renders innecesarios
const MemoizedMoviesListPage = memo(MoviesListPage);

export { MemoizedMoviesListPage as MoviesListPage };