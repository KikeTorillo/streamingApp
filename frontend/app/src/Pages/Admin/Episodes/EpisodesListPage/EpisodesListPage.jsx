// ===== EPISODES LIST PAGE - COLUMNAS CORREGIDAS PARA BACKEND REAL =====
// src/Pages/Admin/Episodes/EpisodesListPage/EpisodesListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organisms/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { ContentImage } from '../../../../components/atoms/ContentImage/ContentImage';
import { Select } from '../../../../components/atoms/Select/Select';
import './EpisodesListPage.css';

// Servicios de episodios y series
import { getEpisodesService } from '../../../../services/Episodes/getEpisodesService';
import { deleteEpisodeService } from '../../../../services/Episodes/deleteEpisodeService';
import { getSeriesService } from '../../../../services/Series/getSeriesService';

/**
 * EpisodesListPage - CORREGIDO con columnas reales del backend
 * 
 * ✅ COLUMNAS REALES: Solo campos que existen en la base de datos
 * ✅ BACKEND COMPATIBLE: Usa estructura real de episodes table + JOIN con series
 * ✅ INFORMACIÓN CORRECTA: No muestra datos que no vienen del servidor
 * ✅ SELECTOR DE SERIES: Necesario porque los episodios requieren serieId
 * ✅ FECHAS CORREGIDAS: Misma lógica que MoviesListPage y SeriesListPage
 */
function EpisodesListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Estados para series
  const [series, setSeries] = useState([]);
  const [selectedSerieId, setSelectedSerieId] = useState('');
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [seriesError, setSeriesError] = useState(null);

  // ===== CONFIGURACIÓN DE COLUMNAS CORREGIDAS =====
  const episodesColumns = [
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
      id: 'title',
      accessorKey: 'title',
      header: 'Título del Episodio',
      size: 250,
      cell: ({ getValue, row }) => {
        const title = getValue();
        const season = row.original.season;
        const episodeNumber = row.original.episode_number;

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
      size: 200,
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
      size: 150,
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
          timeDisplay = 'Hoy';
          badgeVariant = 'success';
        } else if (diffDays === 1) {
          timeDisplay = 'Ayer';
          badgeVariant = 'warning';
        } else if (diffDays === -1) {
          timeDisplay = 'Mañana';
          badgeVariant = 'info';
        } else if (diffDays > 1 && diffDays <= 7) {
          timeDisplay = `${diffDays} días`;
          badgeVariant = 'info';
        } else if (diffDays > 7 && diffDays <= 30) {
          const weeks = Math.floor(diffDays / 7);
          timeDisplay = weeks === 1 ? '1 sem' : `${weeks} sem`;
        } else if (diffDays > 30 && diffDays <= 365) {
          const months = Math.floor(diffDays / 30);
          timeDisplay = months === 1 ? '1 mes' : `${months} meses`;
        } else if (diffDays > 365) {
          const years = Math.floor(diffDays / 365);
          timeDisplay = years === 1 ? '1 año' : `${years} años`;
        } else {
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

  const loadSeries = async () => {
    try {
      setSeriesLoading(true);
      setSeriesError(null);

      // ===== USAR DATOS REALES DEL BACKEND =====
      const seriesData = await getSeriesService();
      const seriesList = Array.isArray(seriesData) ? seriesData : seriesData?.data || [];
      console.log('📺 Series cargadas para selector:', seriesList.length);
      setSeries(seriesList);

    } catch (err) {
      console.error('Error loading series:', err);
      setSeriesError('Error al cargar series');
    } finally {
      setSeriesLoading(false);
    }
  };

  const loadEpisodes = async () => {
    if (!selectedSerieId) {
      setEpisodes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ===== USAR DATOS REALES DEL BACKEND =====
      const episodesData = await getEpisodesService({ serieId: selectedSerieId });
      console.log('📥 Episodios recibidos del backend:', episodesData);
      setEpisodes(episodesData || []);

    } catch (err) {
      console.error('Error loading episodes:', err);
      setError('Error al cargar los episodios');
    } finally {
      setLoading(false);
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

  const handleDeleteEpisode = async (episode) => {
    const confirmMessage =
      `¿Estás seguro de que quieres eliminar el episodio "${episode.title || `T${episode.season}E${episode.episode_number}`}"?\n\n` +
      `⚠️ ADVERTENCIA: Esta acción eliminará permanentemente:\n` +
      `• El archivo de video y todos sus archivos asociados\n` +
      `• Todos los datos del episodio\n\n` +
      `Esta acción NO se puede deshacer.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(episode.id);

      console.log('🗑️ Eliminando episodio:', episode);

      const response = await deleteEpisodeService(episode.id);

      console.log('📥 Respuesta del servicio de eliminación:', response);

      console.log('✅ Episodio eliminado exitosamente');

      alert(`✅ Episodio eliminado exitosamente`);

      await loadEpisodes();

    } catch (error) {
      console.error('💥 Error al eliminar episodio:', error);

      let errorMessage = `Error al eliminar el episodio.`;

      if (error.response?.status === 401) {
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      } else if (error.response?.status === 404) {
        errorMessage = 'El episodio no existe o ya fue eliminado.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar este episodio.';
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

  const handleSerieChange = (event) => {
    const serieId = event.target.value;
    setSelectedSerieId(serieId);
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadSeries();
  }, []);

  useEffect(() => {
    if (selectedSerieId) {
      loadEpisodes();
    } else {
      setEpisodes([]);
    }
  }, [selectedSerieId]);

  // ===== ESTADÍSTICAS =====
  const getEpisodesStats = () => {
    const total = episodes.length;
    const thisWeek = episodes.filter(episode => {
      const createdDate = new Date(episode.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length;

    const withDescription = episodes.filter(episode => episode.description).length;
    const bySeasons = episodes.reduce((acc, ep) => {
      acc[ep.season] = (acc[ep.season] || 0) + 1;
      return acc;
    }, {});
    const totalSeasons = Object.keys(bySeasons).length;

    return { total, thisWeek, withDescription, totalSeasons };
  };

  const stats = getEpisodesStats();
  const selectedSerie = series.find(s => s.id.toString() === selectedSerieId);

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
            options={series.map(serie => ({
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