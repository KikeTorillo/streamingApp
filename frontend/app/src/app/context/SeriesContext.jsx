// ===== SERIES CONTEXT - GESTIÓN CENTRALIZADA DE SERIES =====
// src/app/context/SeriesContext.jsx

import { createContext, useContext, useState } from 'react';

// Servicios de series
import { getSeriesService } from '../../services/Series/getSeriesService';
import { deleteSeriesService } from '../../services/Series/deleteSeriesService';
import { createSeriesService } from '../../services/Series/createSeriesService';
import { getSerieByIdService } from '../../services/Series/getSerieByIdService';
import { updateSeriesService } from '../../services/Series/updateSeriesService';

// Utilidades
import { filterEmptyFields } from '../../utils/formUtils';

// Hook para alerts
import { useAlertContext } from './AlertContext';

// ===== CONTEXTO =====
const SeriesContext = createContext();

/**
 * SeriesProvider - Proveedor del contexto de series
 * 
 * Centraliza toda la lógica de gestión de series:
 * - Estados de series, loading, errores
 * - Funciones CRUD principales
 * - Utilidades de formato y validación
 * - Manejo de sesión expirada
 * - Estadísticas de contenido
 */
function SeriesProvider({ children }) {
  // ===== HOOKS =====
  const { showDeleteConfirm, showSuccess, showError } = useAlertContext();
  
  // ===== ESTADOS PRINCIPALES =====
  const [series, setSeries] = useState([]);
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
  const [currentSeries, setCurrentSeries] = useState(null);
  const [loadingSeries, setLoadingSeries] = useState(false);

  // ===== FUNCIONES AUXILIARES =====

  /**
   * Formatear fecha de serie en formato español
   */
  const formatSeriesDate = (dateString) => {
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
    } catch (err) {
      return 'Fecha inválida';
    }
  };

  /**
   * Construir URL de imagen de portada
   */
  const getSeriesCoverUrl = (coverImage) => {
    if (!coverImage) return null;
    const cdnUrl = import.meta.env.VITE_CDN_URL || 'http://localhost:8082';
    return `${cdnUrl}/covers/${coverImage}/cover.jpg`;
  };

  /**
   * Obtener serie actual para edición (alias para compatibilidad)
   */
  const getCurrentSeries = () => {
    return currentSeries;
  };

  // ===== FUNCIONES PRINCIPALES =====

  /**
   * Cargar series desde el backend
   */
  const loadSeries = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📥 [SeriesContext] Cargando series...');
      const response = await getSeriesService();

      console.log('📋 [SeriesContext] Respuesta del backend:', response);
      
      const seriesData = Array.isArray(response) ? response : [];
      setSeries(seriesData);
      
      console.log(`✅ [SeriesContext] ${seriesData.length} series cargadas`);

    } catch (error) {
      console.error('💥 [SeriesContext] Error loading series:', error);
      setError(error.message || 'Error al cargar series');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refrescar lista de series
   */
  const refreshSeries = () => {
    console.log('🔄 [SeriesContext] Refrescando series...');
    loadSeries();
  };

  /**
   * Limpiar estado de series
   */
  const clearSeries = () => {
    console.log('🧹 [SeriesContext] Limpiando estado de series');
    setSeries([]);
    setError(null);
    setDeleting(null);
  };

  /**
   * Eliminar serie con validaciones completas
   */
  const deleteSeries = (seriesItem) => {
    console.log('🗑️ [SeriesContext] Iniciando eliminación de serie:', seriesItem);

    // ===== CONFIRMACIÓN CON ALERT PROVIDER =====
    showDeleteConfirm(
      seriesItem.title,
      async () => {
        await performDeleteSeries(seriesItem);
      },
      {
        title: 'Confirmar eliminación',
        confirmText: 'Eliminar serie',
        cancelText: 'Cancelar'
      }
    );
  };

  /**
   * Ejecutar eliminación de serie (función interna)
   */
  const performDeleteSeries = async (seriesItem) => {
    try {

      // ===== PROCESO DE ELIMINACIÓN =====
      setDeleting(seriesItem.id);
      console.log('🔄 [SeriesContext] Eliminando serie del backend:', seriesItem.id);

      const response = await deleteSeriesService(seriesItem.id);
      
      console.log('📥 [SeriesContext] Respuesta del servicio:', response);

      // ===== ACTUALIZAR ESTADO LOCAL =====
      setSeries(prevSeries => {
        const updatedSeries = prevSeries.filter(s => s.id !== seriesItem.id);
        console.log(`✅ [SeriesContext] Serie eliminada. Series restantes: ${updatedSeries.length}`);
        return updatedSeries;
      });

      console.log('✅ [SeriesContext] Serie eliminada exitosamente');
      
      // Mostrar mensaje de éxito con AlertProvider
      showSuccess(`Serie "${seriesItem.title}" eliminada exitosamente.`);

    } catch (error) {
      console.error('💥 [SeriesContext] Error deleting series:', error);
      
      let errorMessage = `Error al eliminar la serie "${seriesItem.title}".`;

      // Manejo específico de errores
      if (error.response?.status === 401) {
        console.log('🔒 [SeriesContext] Sesión expirada');
        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
      } else if (error.response?.status === 404) {
        errorMessage = 'La serie no existe o ya fue eliminada.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar esta serie.';
      } else if (error.response?.status === 409) {
        errorMessage = 'No se puede eliminar la serie porque tiene episodios asociados.';
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
    }
  };

  /**
   * Obtener estadísticas de series
   */
  const getSeriesStats = () => {
    const total = series.length;
    const thisWeek = series.filter(seriesItem => {
      const createdDate = new Date(seriesItem.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length;

    const withCategory = series.filter(seriesItem => seriesItem.category_name).length;
    const withEpisodes = series.filter(seriesItem => (seriesItem.episodes_count || 0) > 0).length;
    const totalEpisodes = series.reduce((sum, seriesItem) => sum + (parseInt(seriesItem.episodes_count) || 0), 0);

    return { 
      total, 
      thisWeek, 
      withCategory, 
      withEpisodes,
      totalEpisodes,
      withoutCategory: total - withCategory,
      withoutEpisodes: total - withEpisodes
    };
  };

  // ===== FUNCIONES CRUD FUTURAS =====

  /**
   * Crear nueva serie con validaciones completas
   */
  const createSeries = async (seriesData, onProgressCallback = null) => {
    try {
      console.log('🏗️ [SeriesContext] Iniciando creación de serie:', seriesData);
      setCreating(true);
      setError(null);
      setUploadProgress(0);
      setUploadStatus('uploading');

      // ===== RESETEAR ESTADOS DE PROGRESO =====
      setUploadProgress(0);
      setUploadStatus('uploading');

      // ===== PREPARAR DATOS =====
      console.log('📤 Datos originales:', seriesData);
      
      // Filtrar campos vacíos antes de enviar
      const filteredData = filterEmptyFields(seriesData);
      console.log('📤 Datos filtrados (sin campos vacíos):', filteredData);

      // ===== CONFIGURAR LISTENER DE PROGRESO =====
      const handleUploadProgress = (event) => {
        const { progress } = event.detail;
        // Upload toma 0-50% del progreso total
        const adjustedProgress = Math.round(progress * 0.5);
        setUploadProgress(adjustedProgress);
        
        let message;
        if (progress < 10) {
          message = 'Iniciando subida de la serie...';
        } else if (progress < 100) {
          message = 'Subiendo datos al servidor...';
        } else {
          message = 'Upload completado, validando datos...';
        }
        
        // Callback opcional para componentes que necesiten feedback
        if (onProgressCallback) {
          onProgressCallback(adjustedProgress, 'uploading', message);
        }
        
        console.log(`📤 [SeriesContext] Upload progreso: ${adjustedProgress}%`);
      };

      window.addEventListener('uploadProgress', handleUploadProgress);

      // ===== PROCESO DE CREACIÓN =====
      const result = await createSeriesService(filteredData);

      // ✅ Limpiar listener de upload
      window.removeEventListener('uploadProgress', handleUploadProgress);

      console.log('✅ Serie creada exitosamente:', result);

      // ✅ Cambiar a estado de procesamiento (continuar desde 50%)
      setUploadProgress(50);
      setUploadStatus('processing');
      
      const processingMessage = 'Procesando datos de la serie...';
      if (onProgressCallback) {
        onProgressCallback(50, 'processing', processingMessage);
      }

      // ✅ Marcar que está procesando
      setProcessing(true);

      const taskId = result?.taskId || result?.task_id || result?.id;

      // ===== ACTUALIZAR ESTADO LOCAL =====
      const newSeries = {
        id: result.id || result.data?.id,
        title: filteredData.title,
        category_name: 'Nueva serie', // Se actualizará cuando se recargue
        category_id: filteredData.categoryId,
        release_year: filteredData.releaseYear,
        cover_image: result.coverImage || result.cover_image,
        episodes_count: 0,
        created_at: new Date().toISOString(),
        ...result.data
      };

      setSeries(prevSeries => {
        const updatedSeries = [...prevSeries, newSeries];
        console.log(`✅ [SeriesContext] Serie agregada. Total series: ${updatedSeries.length}`);
        return updatedSeries;
      });

      // ===== COMPLETAR PROGRESO =====
      setUploadProgress(100);
      setUploadStatus('completed');
      setProcessing(false);
      
      if (onProgressCallback) {
        onProgressCallback(100, 'completed', 'Serie creada exitosamente');
      }

      // ===== RETORNAR RESULTADO =====
      return { 
        success: true, 
        data: newSeries,
        taskId: taskId,
        message: 'Serie creada exitosamente.',
        processing: false
      };

    } catch (error) {
      console.error('💥 [SeriesContext] Error creating series:', error);
      
      // ✅ Limpiar listener en caso de error
      if (typeof handleUploadProgress !== 'undefined') {
        window.removeEventListener('uploadProgress', handleUploadProgress);
      }
      
      // ===== MANEJO DE ERRORES =====
      let errorMessage = 'Error desconocido al crear la serie.';
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Datos inválidos en el formulario.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Sesión expirada. Inicia sesión nuevamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para crear series.';
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
   * Cargar serie por ID con datos completos
   */
  const loadSeriesById = async (seriesId) => {
    try {
      console.log('📥 [SeriesContext] Cargando datos de la serie ID:', seriesId);
      setLoadingSeries(true);
      setError(null);
      
      const seriesResponse = await getSerieByIdService(seriesId);
      
      console.log('📋 [SeriesContext] Respuesta serie:', seriesResponse);
      
      // ✅ Manejo de respuesta
      let seriesInfo = null;
      if (seriesResponse.success) {
        seriesInfo = seriesResponse.data;
      } else if (seriesResponse.id) {
        seriesInfo = seriesResponse; // Respuesta directa
      } else {
        throw new Error('Formato de respuesta inesperado del backend');
      }

      console.log('✅ [SeriesContext] Serie normalizada:', seriesInfo);
      
      setCurrentSeries(seriesInfo);
      
      return { 
        success: true, 
        data: seriesInfo,
        message: 'Serie cargada exitosamente' 
      };

    } catch (error) {
      console.error('💥 [SeriesContext] Error cargando serie:', error);
      setError(error.message || 'Error al cargar datos de la serie');
      
      return { 
        success: false, 
        error: error.message || 'Error al cargar datos de la serie' 
      };
    } finally {
      setLoadingSeries(false);
    }
  };

  /**
   * Actualizar serie existente
   */
  const updateSeries = async (seriesId, seriesData) => {
    try {
      console.log('✏️ [SeriesContext] Iniciando actualización de serie:', seriesId, seriesData);
      setEditing(true);
      setError(null);

      // ===== PREPARAR DATOS PARA EL BACKEND =====
      const updateData = {};
      
      // Filtrar solo los campos que tienen valores
      Object.keys(seriesData).forEach(key => {
        if (seriesData[key] !== undefined && seriesData[key] !== null && seriesData[key] !== '') {
          updateData[key] = seriesData[key];
        }
      });

      console.log('📤 [SeriesContext] Datos a actualizar:', updateData);

      // Si no hay cambios reales, no enviar
      if (Object.keys(updateData).length === 0) {
        return { 
          success: false, 
          error: 'No hay cambios para guardar' 
        };
      }

      const response = await updateSeriesService(seriesId, updateData);

      console.log('📥 [SeriesContext] Respuesta del backend:', response);

      // ===== MANEJO DE RESPUESTA =====
      if (!response || (response.error && !response.success)) {
        throw new Error(response?.error || 'Error al actualizar serie');
      }

      console.log('✅ [SeriesContext] Serie actualizada exitosamente');

      // ✅ ACTUALIZAR ESTADO LOCAL
      setSeries(prevSeries => {
        return prevSeries.map(seriesItem => {
          if (seriesItem.id.toString() === seriesId.toString()) {
            return { ...seriesItem, ...updateData };
          }
          return seriesItem;
        });
      });

      // ✅ ACTUALIZAR SERIE ACTUAL SI ESTÁ CARGADA
      if (currentSeries && currentSeries.id.toString() === seriesId.toString()) {
        setCurrentSeries(prevSeries => ({ ...prevSeries, ...updateData }));
      }

      return { 
        success: true, 
        data: response,
        message: 'Serie actualizada exitosamente' 
      };

    } catch (error) {
      console.error('💥 [SeriesContext] Error actualizando serie:', error);
      setError(error.message || 'Error al actualizar serie');
      
      return { 
        success: false, 
        error: error.message || 'Error al actualizar serie' 
      };
    } finally {
      setEditing(false);
    }
  };

  /**
   * Limpiar serie actual
   */
  const clearCurrentSeries = () => {
    console.log('🧹 [SeriesContext] Limpiando serie actual');
    setCurrentSeries(null);
    setLoadingSeries(false);
    setEditing(false);
  };

  /**
   * Obtener serie por ID desde estado local
   */
  const getSeriesById = (seriesId) => {
    console.log('🔍 [SeriesContext] Buscar serie por ID:', seriesId);
    return series.find(seriesItem => seriesItem.id.toString() === seriesId.toString()) || null;
  };

  // ===== VALOR DEL CONTEXTO =====
  const value = {
    // Estados principales
    series,
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
    currentSeries,
    loadingSeries,

    // Funciones principales
    loadSeries,
    refreshSeries,
    clearSeries,
    deleteSeries,

    // Funciones CRUD
    createSeries,
    updateSeries,
    getSeriesById,
    loadSeriesById,
    clearCurrentSeries,

    // Funciones de progreso
    resetCreationState,

    // Utilidades
    formatSeriesDate,
    getSeriesCoverUrl,
    getSeriesStats,
    getCurrentSeries,

    // Estados internos para funciones futuras
    setSeries,
    setDeleting,
    setError,
    setUploadProgress,
    setUploadStatus,
    setProcessing,
    setEditing,
    setCurrentSeries,
    setLoadingSeries
  };

  return (
    <SeriesContext.Provider value={value}>
      {children}
    </SeriesContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de series
 */
function useSeries() {
  const context = useContext(SeriesContext);
  if (!context) {
    throw new Error('useSeries debe usarse dentro de SeriesProvider');
  }
  return context;
}

export { SeriesContext, SeriesProvider, useSeries };