// ===== SERIES LIST PAGE - COLUMNAS CORREGIDAS PARA BACKEND REAL =====
// src/Pages/Admin/Series/SeriesListPage/SeriesListPage.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organisms/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { ContentImage } from '../../../../components/atoms/ContentImage/ContentImage';
import './SeriesListPage.css';

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
    getSeriesStats,
    getSeriesCoverUrl
  } = useSeries();

  // ===== CONFIGURACIÓN DE COLUMNAS CORREGIDAS =====
  const seriesColumns = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
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
      cell: ({ getValue, row }) => {
        const coverImage = getValue();
        const title = row.original.title;
        
        // Construir URL completa para la imagen usando el contexto
        const imageUrl = getSeriesCoverUrl(coverImage);
        
        return (
          <ContentImage
            src={imageUrl}
            alt={`Portada de ${title}`}
            aspectRatio="2/3"
            contentType="series"
            placeholder="📺"
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
      cell: ({ getValue }) => {
        const title = getValue();
        
        return (
          <div>
            <p>
              {title}
            </p>
            <Badge 
              variant="warning"
              size="xs"
              style="soft"
            >
              📺 Serie
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
      id: 'episodes_count',
      accessorKey: 'episodes_count',
      header: 'Episodios',
      cell: ({ getValue }) => {
        const count = getValue() || 0;
        
        return (
          <Badge 
            variant={count > 0 ? 'success' : 'neutral'}
            size="sm"
            style="soft"
          >
            📹 {count}
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
  }, []);

  // ===== ESTADÍSTICAS DESDE EL CONTEXTO =====
  getSeriesStats();

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Series"
      headerActions={
        <div className="series-list__header-actions">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateSeries}
            leftIcon="➕"
          >
            Agregar Serie
          </Button>
        </div>
      }
    >
      <div>
        {error && (
          <div className="series-list__error-container">
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
          data={series}
          columns={seriesColumns}
          loading={loading}
          onEdit={handleEditSeries}
          onView={handleViewSeries}
          onDelete={handleDeleteSeries}
          deleting={deleting}
          emptyTitle="No hay series registradas"
          emptyDescription="Comienza agregando tu primera serie"
          emptyIcon="📺"
          emptyAction={
            <Button 
              variant="primary" 
              onClick={handleCreateSeries}
              leftIcon="➕"
            >
              Agregar Primera Serie
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

export { SeriesListPage };