// ===== EPISODES CONTEXT - GESTIÓN CENTRALIZADA DE EPISODIOS =====
// src/app/context/EpisodesContext.jsx

import { createContext, useContext, useState } from 'react';

// Servicios de episodios
import { getEpisodesService } from '../../services/Episodes/getEpisodesService';
import { deleteEpisodeService } from '../../services/Episodes/deleteEpisodeService';
import { createEpisodeService } from '../../services/Episodes/createEpisodeService';
import { getEpisodeByIdService } from '../../services/Episodes/getEpisodeByIdService';
import { updateEpisodeService } from '../../services/Episodes/updateEpisodeService';

// Servicios de series para el selector
import { getSeriesService } from '../../services/Series/getSeriesService';

// Utilidades
import { filterEmptyFields } from '../../utils/formUtils';

// Hook para alerts
import { useAlertContext } from './AlertContext';

// ===== CONTEXTO =====
const EpisodesContext = createContext();

/**
 * EpisodesProvider - Proveedor del contexto de episodios
 * 
 * Centraliza toda la lógica de gestión de episodios:
 * - Estados de episodios, loading, errores
 * - Funciones CRUD principales
 * - Utilidades de formato y validación
 * - Manejo de sesión expirada
 * - Estadísticas de contenido
 * - Gestión de series padre
 */
function EpisodesProvider({ children }) {
  // ===== HOOKS =====
  const { showDeleteConfirm, showSuccess, showError } = useAlertContext();
  
  // ===== ESTADOS PRINCIPALES =====
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ===== ESTADOS DE CREACIÓN =====
  const [creating, setCreating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, completed, error

  // ===== ESTADOS DE EDICIÓN =====
  const [editing, setEditing] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loadingEpisode, setLoadingEpisode] = useState(false);

  // ===== ESTADOS ESPECÍFICOS DE EPISODIOS =====
  const [selectedSerieId, setSelectedSerieId] = useState('');
  const [seriesData, setSeriesData] = useState([]);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [seriesError, setSeriesError] = useState(null);

  // ===== FUNCIONES AUXILIARES =====

  /**
   * Formatear fecha de episodio en formato español
   */
  const formatEpisodeDate = (dateString) => {
    if (!dateString) return 'No disponible';

    try {
      const date = new Date(dateString);
      const now = new Date();

      // Comparar solo las fechas (año, mes, día) ignorando horas
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const createdDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // Calcular diferencia en días
      const diffTime = today.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Hoy';
      } else if (diffDays === 1) {
        return 'Ayer';
      } else if (diffDays === -1) {
        return 'Mañana';
      } else if (diffDays > 1 && diffDays <= 7) {
        return `${diffDays} días`;
      } else if (diffDays > 7 && diffDays <= 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? '1 sem' : `${weeks} sem`;
      } else if (diffDays > 30 && diffDays <= 365) {
        const months = Math.floor(diffDays / 30);
        return months === 1 ? '1 mes' : `${months} meses`;
      } else if (diffDays > 365) {
        const years = Math.floor(diffDays / 365);
        return years === 1 ? '1 año' : `${years} años`;
      } else {
        return date.toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  /**
   * Formatear temporada y episodio (T1E5)
   */
  const formatSeasonEpisode = (season, episodeNumber) => {
    if (!season || !episodeNumber) return 'Sin información';
    return `T${season}E${episodeNumber}`;
  };

  /**
   * Obtener episodio actual para edición
   */
  const getCurrentEpisode = () => {
    return currentEpisode;
  };

  /**
   * Obtener serie seleccionada actual
   */
  const getSelectedSerie = () => {
    if (!selectedSerieId || !seriesData.length) return null;
    return seriesData.find(s => s.id.toString() === selectedSerieId) || null;
  };

  // ===== FUNCIONES PRINCIPALES =====

  /**
   * Cargar series disponibles desde el backend
   */
  const loadSeries = async () => {
    try {
      setSeriesLoading(true);
      setSeriesError(null);

      const response = await getSeriesService();
      const seriesList = Array.isArray(response) ? response : response?.data || [];

      setSeriesData(seriesList);

      if (seriesList.length === 0) {
        setSeriesError('No hay series disponibles. Ve a Administrar > Series para crear una.');
      }

    } catch (error) {

      setSeriesError(error.message || 'Error al cargar series');
    } finally {
      setSeriesLoading(false);
    }
  };

  /**
   * Cargar episodios desde el backend por serie
   */
  const loadEpisodes = async (serieId = null) => {
    const targetSerieId = serieId || selectedSerieId;
    
    if (!targetSerieId) {

      setEpisodes([]);
      return { success: true, episodes: [] };
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getEpisodesService({ serieId: targetSerieId });

      const episodesData = Array.isArray(response) ? response : [];
      setEpisodes(episodesData);

      return { success: true, episodes: episodesData };

    } catch (error) {

      setError(error.message || 'Error al cargar episodios');
      return { success: false, error: error.message || 'Error al cargar episodios' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refrescar lista de episodios
   */
  const refreshEpisodes = () => {

    loadEpisodes();
  };

  /**
   * Limpiar estado de episodios
   */
  const clearEpisodes = () => {

    setEpisodes([]);
    setError(null);
    setDeleting(null);
  };

  /**
   * Cambiar serie seleccionada
   */
  const changeSelectedSerie = (serieId) => {

    setSelectedSerieId(serieId);
    
    if (serieId) {
      loadEpisodes(serieId);
    } else {
      clearEpisodes();
    }
  };

  /**
   * Eliminar episodio con validaciones completas
   */
  const deleteEpisode = (episode) => {

    // ===== CONFIRMACIÓN CON ALERT PROVIDER =====
    const episodeTitle = episode.title || `T${episode.season}E${episode.episode_number}`;
    
    showDeleteConfirm(
      episodeTitle,
      async () => {
        await performDeleteEpisode(episode);
      },
      {
        title: 'Confirmar eliminación',
        confirmText: 'Eliminar episodio',
        cancelText: 'Cancelar'
      }
    );
  };

  /**
   * Ejecutar eliminación de episodio (función interna)
   */
  const performDeleteEpisode = async (episode) => {
    try {

      // ===== PROCESO DE ELIMINACIÓN =====
      setDeleting(episode.id);

      const response = await deleteEpisodeService(episode.id);

      // ===== ACTUALIZAR ESTADO LOCAL =====
      setEpisodes(prevEpisodes => {
        const updatedEpisodes = prevEpisodes.filter(e => e.id !== episode.id);

        return updatedEpisodes;
      });

      // Resetear estado de progreso
      setUploadProgress(0);
      setUploadStatus('idle');
      
      // Mostrar mensaje de éxito con AlertProvider
      showSuccess(`Episodio "${episode.title}" eliminado exitosamente.`);

    } catch (error) {

      let errorMessage = `Error al eliminar el episodio.`;

      // Manejo específico de errores
      if (error.response?.status === 401) {

        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
      } else if (error.response?.status === 404) {
        errorMessage = 'El episodio no existe o ya fue eliminado.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar este episodio.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      
      // Mostrar mensaje de error con AlertProvider
      showError(errorMessage);
    } finally {
      setDeleting(null);
      setUploadProgress(0);
      setUploadStatus('idle');
    }
  };

  /**
   * Obtener estadísticas de episodios
   */
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

    const selectedSerie = getSelectedSerie();

    return { 
      total, 
      thisWeek, 
      withDescription, 
      totalSeasons,
      bySeasons,
      withoutDescription: total - withDescription,
      selectedSerie: selectedSerie?.title || 'Ninguna'
    };
  };

  // ===== FUNCIONES CRUD FUTURAS =====

  /**
   * Crear nuevo episodio con validaciones completas
   */
  const createEpisode = async (episodeData, onProgressCallback = null) => {
    // ===== CONFIGURAR LISTENER DE PROGRESO =====
    const handleUploadProgress = (event) => {
      const { progress } = event.detail;
      // Upload toma 0-50% del progreso total
      const adjustedProgress = Math.round(progress * 0.5);
      setUploadProgress(adjustedProgress);
      
      let message;
      if (progress < 10) {
        message = 'Iniciando subida del episodio...';
      } else if (progress < 100) {
        message = 'Subiendo video al servidor...';
      } else {
        message = 'Upload completado, validando archivo...';
      }
      
      // Callback opcional para componentes que necesiten feedback
      if (onProgressCallback) {
        onProgressCallback(adjustedProgress, 'uploading', message);
      }

    };
    
    try {

      setCreating(true);
      setError(null);
      setUploadProgress(0);
      setUploadStatus('uploading');

      // ===== RESETEAR ESTADOS DE PROGRESO =====
      setUploadProgress(0);
      setUploadStatus('uploading');

      // ===== PREPARAR DATOS =====

      // Filtrar campos vacíos antes de enviar
      const filteredData = filterEmptyFields(episodeData);

      window.addEventListener('uploadProgress', handleUploadProgress);

      // ===== PROCESO DE CREACIÓN =====
      const result = await createEpisodeService(filteredData);

      // ✅ Limpiar listener de upload
      window.removeEventListener('uploadProgress', handleUploadProgress);

      // ✅ Cambiar a estado de procesamiento (continuar desde 50%)
      setUploadProgress(50);
      setUploadStatus('processing');
      
      const processingMessage = 'Analizando propiedades del video...';
      if (onProgressCallback) {
        onProgressCallback(50, 'processing', processingMessage);
      }

      // ✅ Marcar que está procesando
      setProcessing(true);

      const taskId = result?.taskId || result?.task_id || result?.id;

      // ===== ACTUALIZAR ESTADO LOCAL =====
      const newEpisode = {
        id: result.id || result.data?.id,
        title: filteredData.title,
        serie_name: 'Cargando...', // Se actualizará cuando se recargue
        serie_id: filteredData.serieId || selectedSerieId,
        season: filteredData.season,
        episode_number: filteredData.episodeNumber,
        description: filteredData.description,
        created_at: new Date().toISOString(),
        ...result.data
      };

      setEpisodes(prevEpisodes => {
        const updatedEpisodes = [...prevEpisodes, newEpisode];

        return updatedEpisodes;
      });

      // ===== RETORNAR RESULTADO CON TASK ID =====
      return { 
        success: true, 
        data: newEpisode,
        taskId: taskId,
        message: taskId ? 'Episodio creado. Procesando video...' : 'Episodio creado exitosamente.',
        processing: !!taskId
      };

    } catch (error) {

      // ✅ Limpiar listener en caso de error
      window.removeEventListener('uploadProgress', handleUploadProgress);
      
      // ===== MANEJO DE ERRORES =====
      let errorMessage = 'Error desconocido al crear el episodio.';
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Datos inválidos en el formulario.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Sesión expirada. Inicia sesión nuevamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para crear episodios.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Error del servidor. Intenta más tarde.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setUploadStatus('error');
      setError(errorMessage);
      setProcessing(false);
      
      // Callback opcional para errores
      if (onProgressCallback) {
        onProgressCallback(0, 'error', errorMessage);
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setCreating(false);
    }
  };

  /**
   * Monitorear progreso de procesamiento de video
   */
  const monitorProgress = (taskId, contentType = 'episodes', onStatusChange = null, onFinish = null) => {

    const checkProgress = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const endpoint = `${backendUrl}/api/v1/${contentType}/progress/${taskId}`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          timeout: 10000,
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Tarea no encontrada');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();

        let adjustedProgress = data.progress || 0;
        let status = data.status;
        let message = data.message;
        
        if (status === 'processing') {
          adjustedProgress = Math.max(adjustedProgress, 50);
          message = message || 'Procesando video...';
        } else if (status === 'transcoding') {
          adjustedProgress = Math.max(adjustedProgress, 60);
          message = message || 'Transcodificando video...';
        } else if (status === 'completed') {
          adjustedProgress = 100;
          message = message || 'Procesamiento completado';
        } else if (status === 'failed' || status === 'error') {
          message = data.error || message || 'Error desconocido';
        }
        
        setUploadProgress(adjustedProgress);
        setUploadStatus(status);
        
        if (onStatusChange) {
          onStatusChange(status, adjustedProgress, message);
        }
        
        if (status === 'completed') {

          setProcessing(false);
          setUploadStatus('completed');
          
          if (onFinish) {
            onFinish(true, null);
          }
          
          setTimeout(() => {
            loadEpisodes();
          }, 1000);
          
        } else if (status === 'failed' || status === 'error') {

          setProcessing(false);
          setUploadStatus('error');
          setError(message || 'Error en el procesamiento');
          
          if (onFinish) {
            onFinish(false, message || 'Error en el procesamiento');
          }
          
        } else if (status === 'processing' || status === 'transcoding') {
          setTimeout(checkProgress, 1000);
        }
        
      } catch (error) {

        setProcessing(false);
        setUploadStatus('completed');
        setUploadProgress(100);
        
        if (onFinish) {
          onFinish(true, null);
        }
        
        setTimeout(() => {
          loadEpisodes();
        }, 1000);
      }
    };
    
    setTimeout(checkProgress, 1000);
  };

  /**
   * Resetear estados de creación
   */
  const resetCreationState = () => {
    setCreating(false);
    setProcessing(false);
    setUploadProgress(0);
    setUploadStatus('idle');
    setError(null);
  };

  /**
   * Cargar episodio por ID con datos completos
   */
  const loadEpisodeById = async (episodeId) => {
    try {

      setLoadingEpisode(true);
      setError(null);
      
      const episodeResponse = await getEpisodeByIdService(episodeId);

      let episodeInfo = null;
      if (episodeResponse.success) {
        episodeInfo = episodeResponse.data;
      } else if (episodeResponse.id) {
        episodeInfo = episodeResponse;
      } else {
        throw new Error('Formato de respuesta inesperado del backend');
      }

      setCurrentEpisode(episodeInfo);
      
      return { 
        success: true, 
        data: episodeInfo,
        message: 'Episodio cargado exitosamente' 
      };

    } catch (error) {

      setError(error.message || 'Error al cargar datos del episodio');
      
      return { 
        success: false, 
        error: error.message || 'Error al cargar datos del episodio' 
      };
    } finally {
      setLoadingEpisode(false);
    }
  };

  /**
   * Actualizar episodio existente
   */
  const updateEpisode = async (episodeId, episodeData) => {
    try {

      setEditing(true);
      setError(null);

      const updateData = {};
      
      Object.keys(episodeData).forEach(key => {
        if (episodeData[key] !== undefined && episodeData[key] !== null && episodeData[key] !== '') {
          updateData[key] = episodeData[key];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return { 
          success: false, 
          error: 'No hay cambios para guardar' 
        };
      }

      const response = await updateEpisodeService(episodeId, updateData);

      if (!response || (response.error && !response.success)) {
        throw new Error(response?.error || 'Error al actualizar episodio');
      }

      setEpisodes(prevEpisodes => {
        return prevEpisodes.map(episode => {
          if (episode.id.toString() === episodeId.toString()) {
            return { ...episode, ...updateData };
          }
          return episode;
        });
      });

      if (currentEpisode && currentEpisode.id.toString() === episodeId.toString()) {
        setCurrentEpisode(prevEpisode => ({ ...prevEpisode, ...updateData }));
      }

      return { 
        success: true, 
        data: response,
        message: 'Episodio actualizado exitosamente' 
      };

    } catch (error) {

      setError(error.message || 'Error al actualizar episodio');
      
      return { 
        success: false, 
        error: error.message || 'Error al actualizar episodio' 
      };
    } finally {
      setEditing(false);
    }
  };

  /**
   * Limpiar episodio actual
   */
  const clearCurrentEpisode = () => {

    setCurrentEpisode(null);
    setLoadingEpisode(false);
    setEditing(false);
  };

  /**
   * Obtener episodio por ID desde estado local
   */
  const getEpisodeById = (episodeId) => {

    return episodes.find(episode => episode.id.toString() === episodeId.toString()) || null;
  };

  // ===== VALOR DEL CONTEXTO =====
  const value = {
    // Estados principales
    episodes,
    loading,
    error,
    deleting,

    // Estados de creación
    creating,
    processing,
    uploadProgress,
    uploadStatus,

    // Estados de edición
    editing,
    currentEpisode,
    loadingEpisode,

    // Estados específicos de episodios
    selectedSerieId,
    seriesData,
    seriesLoading,
    seriesError,

    // Funciones principales
    loadSeries,
    loadEpisodes,
    refreshEpisodes,
    clearEpisodes,
    deleteEpisode,
    changeSelectedSerie,

    // Funciones CRUD
    createEpisode,
    updateEpisode,
    getEpisodeById,
    loadEpisodeById,
    clearCurrentEpisode,

    // Funciones de progreso
    monitorProgress,
    resetCreationState,

    // Utilidades
    formatEpisodeDate,
    formatSeasonEpisode,
    getEpisodesStats,
    getCurrentEpisode,
    getSelectedSerie,

    // Estados internos para funciones futuras
    setEpisodes,
    setDeleting,
    setError,
    setUploadProgress,
    setUploadStatus,
    setProcessing,
    setEditing,
    setCurrentEpisode,
    setLoadingEpisode,
    setSelectedSerieId,
    setSeriesData,
    setSeriesLoading,
    setSeriesError
  };

  return (
    <EpisodesContext.Provider value={value}>
      {children}
    </EpisodesContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de episodios
 */
function useEpisodes() {
  const context = useContext(EpisodesContext);
  if (!context) {
    throw new Error('useEpisodes debe usarse dentro de EpisodesProvider');
  }
  return context;
}

export { EpisodesContext, EpisodesProvider, useEpisodes };