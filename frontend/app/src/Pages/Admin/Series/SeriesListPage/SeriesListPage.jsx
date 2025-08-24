// ===== SERIES LIST PAGE - COLUMNAS CORREGIDAS PARA BACKEND REAL =====
// src/Pages/Admin/Series/SeriesListPage/SeriesListPage.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organisms/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { Image } from '../../../../components/atoms/Image/Image';
import { Typography } from '../../../../components/atoms/Typography/Typography';
// Contexto de series
import { useSeries } from '../../../../app/context/SeriesContext';

/**
 * SeriesListPage - CORREGIDO con columnas reales del backend
 * 
 * ✅ COLUMNAS REALES: Solo campos que existen en la base de datos
 * ✅ BACKEND COMPATIBLE: Usa estructura real de series table
 * ✅ INFORMACIÓN CORRECTA: No muestra datos que no vienen del servidor
 * ✅ FECHAS CORREGIDAS: Misma lógica que MoviesListPage
 * ✅ MIGRACIÓN: Usa AlertProvider en lugar de alert() nativo
 */
function SeriesListPage() {
  const navigate = useNavigate();

  // Los mensajes son manejados por el contexto internamente

  // ===== CONTEXTO DE SERIES =====
  const {
    series,
    loading,
    error,
    deleting,
    loadSeries,
    deleteSeries,
    getSeriesCoverUrl
  } = useSeries();

  // ===== CONFIGURACIÓN DE COLUMNAS CORREGIDAS =====
  const seriesColumns = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
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
      cell: ({ getValue, row }) => {
        const coverImage = getValue();
        const title = row.original.title;

        // Construir URL completa para la imagen usando el contexto
        const imageUrl = getSeriesCoverUrl(coverImage);

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
      cell: ({ getValue }) => {
        const title = getValue();

        return (
          <div>
            <Typography variant="body" size="sm" weight="medium">
              {title}
            </Typography>
            <Badge
              variant="warning"
              size="xs"
              appearance="soft"
              leftIcon="video"
            >
              Serie
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
      id: 'episodes_count',
      accessorKey: 'episodes_count',
      header: 'Episodios',
      cell: ({ getValue }) => {
        const count = getValue() || 0;

        return (
          <Badge
            variant={count > 0 ? 'success' : 'secondary'}
            size="sm"
            appearance="soft"
            leftIcon="film"
          >
            {count}
          </Badge>
        );
      }
    },
    {
      id: 'created_at',
      accessorKey: 'created_at',
      header: 'Fecha Agregada',
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
        let badgeVariant = 'secondary';

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
          badgeVariant = 'primary';
        } else if (diffDays > 1 && diffDays <= 7) {
          // Entre 2-7 días
          timeDisplay = `${diffDays} días`;
          badgeVariant = 'primary';
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

  // ===== FUNCIONES =====

  const handleCreateSeries = () => {
    navigate('/admin/series/create');
  };

  const handleEditSeries = (seriesItem) => {
    navigate(`/admin/series/edit/${seriesItem.id}`);
  };

  const handleViewSeries = (seriesItem) => {
    navigate(`/series/${seriesItem.id}`);
  };

  const handleDeleteSeries = (seriesItem) => {

    // El contexto maneja toda la lógica de confirmación y mensajes
    deleteSeries(seriesItem);
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadSeries();
  }, [loadSeries]);

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Series"
      subtitle="Administración completa del catálogo de series"
      breadcrumbs={[
        { label: 'Series' }
      ]}
      headerActions={
        <Button
          variant="primary"
          size="sm"
          onClick={handleCreateSeries}
          leftIcon="video"
        >
          Crear Serie
        </Button>
      }
    >

      <DataTable
        data={series}
        columns={seriesColumns}
        loading={loading}
        error={error}
        onEdit={handleEditSeries}
        onView={handleViewSeries}
        onDelete={handleDeleteSeries}
        deleting={deleting}
        searchPlaceholder="Buscar series por título, categoría o año..."
        pageSizeOptions={[10, 25, 50, 100]}
        pageSize={10}
        variant="primary"
        emptyTitle="No hay series registradas"
        emptyDescription="Comienza agregando tu primera serie al catálogo"
        emptyIcon="video"
        className={deleting ? 'series-list__table--deleting' : ''}
      />
    </AdminLayout>
  );
}

export { SeriesListPage };