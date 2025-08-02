// ===== EPISODES LIST PAGE - CON EPISODES CONTEXT =====
// src/Pages/Admin/Episodes/EpisodesListPage/EpisodesListPage.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organisms/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { Select } from '../../../../components/atoms/Select/Select';
import './EpisodesListPage.css';

// Context y servicios
import { useEpisodes } from '../../../../app/context/EpisodesContext';
import { getSeriesService } from '../../../../services/Series/getSeriesService';

/**
 * EpisodesListPage - CON EPISODES CONTEXT
 * 
 * ✅ MIGRADO A CONTEXT: Toda la lógica ahora está centralizada en EpisodesContext
 * ✅ CONSISTENCIA TOTAL: Sigue los mismos patrones que MoviesContext y SeriesContext
 * ✅ GESTIÓN DE SERIES: Manejo centralizado del selector de series
 * ✅ ESTADOS COMPARTIDOS: Loading, error, deleting unificados
 * ✅ FUNCIONES CRUD: Preparado para create, update, delete desde el contexto
 */
function EpisodesListPage() {
  const navigate = useNavigate();

  // ===== CONTEXT =====
  const {
    episodes,
    loading,
    error,
    deleting,
    selectedSerieId,
    seriesData,
    seriesLoading,
    seriesError,
    deleteEpisode,
    changeSelectedSerie,
    formatEpisodeDate,
    loadEpisodes,
    setSeriesData,
    setSeriesLoading,
    setSeriesError
  } = useEpisodes();

  // ===== CONFIGURACIÓN DE COLUMNAS CORREGIDAS =====
  const episodesColumns = [
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
      id: 'title',
      accessorKey: 'title',
      header: 'Título del Episodio',
      cell: ({ getValue }) => {
        const title = getValue();

        return (
          <div>
            <p>
              {title || 'Sin título'}
            </p>
          </div>
        );
      }
    },
    {
      id: 'serie_name',
      accessorKey: 'serie_name',
      header: 'Serie',
      cell: ({ getValue, row }) => {
        const serieName = getValue();
        const serieId = row.original.serie_id;

        return (
          <Badge
            variant="primary"
            size="sm"
            style="soft"
          >
            📺 {serieName || `Serie #${serieId}`}
          </Badge>
        );
      }
    },
    {
      id: 'season_episode',
      accessorKey: 'season',
      header: 'Temporada/Episodio',
      cell: ({ getValue, row }) => {
        const season = getValue();
        const episodeNumber = row.original.episode_number;

        return (
          <Badge
            variant="warning"
            size="xs"
            style="soft"
          >
            T{season}E{episodeNumber}
          </Badge>
        );
      }
    },
    {
      id: 'created_at',
      accessorKey: 'created_at',
      header: 'Fecha Agregada',
      cell: ({ getValue }) => {
        const dateString = getValue();
        const date = new Date(dateString);
        
        // ✅ USAR FUNCIÓN DEL CONTEXTO: formatEpisodeDate mantiene consistencia
        const timeDisplay = formatEpisodeDate(dateString);
        
        // Determinar variant del badge basado en el texto
        let badgeVariant = 'neutral';
        if (timeDisplay === 'Hoy') badgeVariant = 'success';
        else if (timeDisplay === 'Ayer') badgeVariant = 'warning';
        else if (timeDisplay === 'Mañana') badgeVariant = 'info';
        else if (timeDisplay.includes('días') || timeDisplay.includes('sem')) badgeVariant = 'info';

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

  const loadSeries = async () => {
    try {
      setSeriesLoading(true);
      setSeriesError(null);

      // ===== USAR DATOS REALES DEL BACKEND =====
      const seriesData = await getSeriesService();
      const seriesList = Array.isArray(seriesData) ? seriesData : seriesData?.data || [];

      setSeriesData(seriesList);

    } catch {

      setSeriesError('Error al cargar series');
    } finally {
      setSeriesLoading(false);
    }
  };

  const handleCreateEpisode = () => {
    if (selectedSerieId) {
      navigate(`/admin/episodes/create?serieId=${selectedSerieId}`);
    } else {
      navigate('/admin/episodes/create');
    }
  };

  const handleEditEpisode = (episode) => {
    navigate(`/admin/episodes/edit/${episode.id}`);
  };

  const handleViewEpisode = (episode) => {
    navigate(`/episode/${episode.id}`);
  };

  const handleDeleteEpisode = (episode) => {

    // El contexto maneja toda la lógica de confirmación y mensajes
    deleteEpisode(episode);
  };

  const handleSerieChange = (event) => {
    const serieId = event.target.value;

    changeSelectedSerie(serieId);
  };

  // ===== EFECTOS =====
  useEffect(() => {

    loadSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar al montar el componente

  // ✅ REFRESCAR EPISODIOS AL REGRESAR A LA PÁGINA
  useEffect(() => {
    // Si hay una serie seleccionada, refrescar la lista al montar/regresar
    if (selectedSerieId) {
      loadEpisodes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSerieId]); // Ejecutar cuando cambie la serie seleccionada

  // ✅ LISTENER PARA REFRESCAR AL REGRESAR DE OTRA PÁGINA
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Refrescar datos cuando la página vuelve a estar visible
      if (!document.hidden && selectedSerieId) {
        loadEpisodes();
      }
    };

    // Listener para cuando cambias de tab y regresas
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listener para cuando regresas con el botón atrás del navegador
    const handleFocus = () => {
      if (selectedSerieId) {
        loadEpisodes();
      }
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSerieId]);

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Episodios"
      headerActions={
        <div className="episodes-list__header-actions">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateEpisode}
            leftIcon="➕"
            disabled={!selectedSerieId}
          >
            Agregar Episodio
          </Button>
        </div>
      }
    >
      <div>
        {/* SELECTOR DE SERIES */}
        <div className="episodes-list__series-selector">
          <label
            htmlFor="serie-selector"
          >
            📺 Seleccionar Serie:
          </label>
          <Select
            id="serie-selector"
            value={selectedSerieId}
            onChange={handleSerieChange}
            disabled={seriesLoading || seriesError}
            placeholder='-- Selecciona una serie --'
            options={seriesData.map(serie => ({
              value: serie.id.toString(),
              label: `${serie.title} (${serie.release_year})`
            }))}
            size="md"
            variant="default"
          />
        </div>

        {seriesError && (
          <div className="episodes-list__error-container">
            <Badge
              variant="danger"
              size="lg"
              icon="❌"
              style="soft"
            >
              {seriesError}
            </Badge>
          </div>
        )}

        {error && (
          <div className="episodes-list__error-container">
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
          data={episodes}
          columns={episodesColumns}
          loading={loading}
          onEdit={handleEditEpisode}
          onView={handleViewEpisode}
          onDelete={handleDeleteEpisode}
          deleting={deleting}
          emptyTitle={selectedSerieId ? "No hay episodios" : "Selecciona una serie"}
          emptyDescription={selectedSerieId
            ? "Esta serie no tiene episodios registrados"
            : "Elige una serie del selector para ver sus episodios"
          }
          emptyIcon="📺"
          emptyAction={selectedSerieId ? (
            <Button
              variant="primary"
              onClick={handleCreateEpisode}
              leftIcon="➕"
            >
              Agregar Primer Episodio
            </Button>
          ) : null}
          searchable={episodes.length > 0}
          searchPlaceholder="Buscar por título de episodio..."
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          variant="striped"
        />
      </div>
    </AdminLayout>
  );
}

export { EpisodesListPage };