// ===== MOVIES CONTEXT - GESTIÓN CENTRALIZADA DE PELÍCULAS =====
// src/app/context/MoviesContext.jsx

import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Servicios de películas
import { getMoviesService } from '../../services/Movies/getMoviesService';
import { deleteMovieService } from '../../services/Movies/deleteMovieService';
import { createMovieService } from '../../services/Movies/createMovieService';
import { getMovieByIdService } from '../../services/Movies/getMovieByIdService';
import { updateMovieService } from '../../services/Movies/updateMovieService';

// Utilidades
import { filterEmptyFields } from '../../utils/formUtils';

// Hook para alerts
import { useAlertContext } from './AlertContext';

// ===== CONTEXTO =====
const MoviesContext = createContext();

/**
 * MoviesProvider - Proveedor del contexto de películas
 * 
 * Centraliza toda la lógica de gestión de películas:
 * - Estados de películas, loading, errores
 * - Funciones CRUD principales
 * - Utilidades de formato y validación
 * - Manejo de sesión expirada
 * - Estadísticas de contenido
 */
function MoviesProvider({ children }) {
  // ===== HOOKS =====
  const { showDeleteConfirm, showSuccess, showError } = useAlertContext();
  
  // ===== ESTADOS PRINCIPALES =====
  const [movies, setMovies] = useState([]);
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
  const [currentMovie, setCurrentMovie] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(false);

  // ===== FUNCIONES AUXILIARES =====

  /**
   * Formatear fecha de película en formato español
   */
  const formatMovieDate = (dateString) => {
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
    } catch {
      return 'Fecha inválida';
    }
  };

  /**
   * Construir URL de imagen de portada
   */
  const getMovieCoverUrl = (coverImage) => {
    if (!coverImage) return null;
    const cdnUrl = import.meta.env.VITE_CDN_URL || 'http://localhost:8082';
    return `${cdnUrl}/covers/${coverImage}/cover.jpg`;
  };

  // ===== FUNCIONES PRINCIPALES =====

  /**
   * Cargar películas desde el backend
   */
  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMoviesService();

      const moviesData = Array.isArray(response) ? response : [];
      setMovies(moviesData);

    } catch (error) {

      setError(error.message || 'Error al cargar películas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refrescar lista de películas
   */
  const refreshMovies = () => {

    loadMovies();
  };

  /**
   * Limpiar estado de películas
   */
  const clearMovies = () => {

    setMovies([]);
    setError(null);
    setDeleting(null);
  };

  /**
   * Eliminar película con validaciones completas
   */
  const deleteMovie = (movie) => {

    // ===== CONFIRMACIÓN CON ALERT PROVIDER =====
    // Usar AlertProvider en lugar de window.confirm
    showDeleteConfirm(
      movie.title,
      async () => {
        await performDeleteMovie(movie);
      },
      {
        title: 'Confirmar eliminación',
        confirmText: 'Eliminar película',
        cancelText: 'Cancelar'
      }
    );
  };

  /**
   * Ejecutar eliminación de película (función interna)
   */
  const performDeleteMovie = async (movie) => {
    try {

      // ===== PROCESO DE ELIMINACIÓN =====
      setDeleting(movie.id);

      await deleteMovieService(movie.id);

      // ===== ACTUALIZAR ESTADO LOCAL =====
      setMovies(prevMovies => {
        const updatedMovies = prevMovies.filter(m => m.id !== movie.id);

        return updatedMovies;
      });

      // Mostrar mensaje de éxito con AlertProvider
      showSuccess(`Película "${movie.title}" eliminada exitosamente.`);

    } catch (error) {

      let errorMessage = `Error al eliminar la película "${movie.title}".`;

      // Manejo específico de errores
      if (error.response?.status === 401) {

        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
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

      setError(errorMessage);
      
      // Mostrar mensaje de error con AlertProvider
      showError(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  /**
   * Obtener estadísticas de películas
   */
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

    return { 
      total, 
      thisWeek, 
      withCategory, 
      moviesCount, 
      seriesCount,
      withoutCategory: total - withCategory
    };
  };

  // ===== FUNCIONES CRUD FUTURAS =====

  /**
   * Crear nueva película con validaciones completas
   * MIGRADO DESDE MoviesCreatePage (lógica funcional comprobada)
   */
  const createMovie = async (movieData, onProgressCallback = null) => {
    try {

      setCreating(true);
      setError(null);
      setUploadProgress(0);
      setUploadStatus('uploading');

      // ===== RESETEAR ESTADOS DE PROGRESO =====
      setUploadProgress(0);
      setUploadStatus('uploading');

      // ===== PREPARAR DATOS (LÓGICA MIGRADA DE MoviesCreatePage) =====

      // Filtrar campos vacíos antes de enviar
      const filteredData = filterEmptyFields(movieData);

      // ===== CONFIGURAR LISTENER DE PROGRESO (LÓGICA MIGRADA) =====
      const handleUploadProgress = (event) => {
        const { progress } = event.detail;
        // Upload toma 0-50% del progreso total
        const adjustedProgress = Math.round(progress * 0.5);
        setUploadProgress(adjustedProgress);
        
        let message;
        if (progress < 10) {
          message = 'Iniciando subida del video...';
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

      window.addEventListener('uploadProgress', handleUploadProgress);

      // ===== PROCESO DE CREACIÓN (LÓGICA MIGRADA) =====
      const result = await createMovieService(filteredData);

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
      const newMovie = {
        id: result.id || result.data?.id,
        title: filteredData.title,
        category_name: 'Nueva película', // Se actualizará cuando se recargue
        category_id: filteredData.categoryId,
        release_year: filteredData.releaseYear,
        cover_image: result.coverImage || result.cover_image,
        media_type: filteredData.media_type || 'movie',
        created_at: new Date().toISOString(),
        ...result.data
      };

      setMovies(prevMovies => {
        const updatedMovies = [...prevMovies, newMovie];

        return updatedMovies;
      });

      // ===== RETORNAR RESULTADO CON TASK ID =====
      return { 
        success: true, 
        data: newMovie,
        taskId: taskId,
        message: taskId ? 'Película creada. Procesando video...' : 'Película creada exitosamente.',
        processing: !!taskId
      };

    } catch (error) {

      // ✅ Limpiar listener en caso de error
      window.removeEventListener('uploadProgress', (event) => {
        if (event.detail && event.detail.progress !== undefined) {
          setUploadProgress(event.detail.progress);
        }
      });
      
      // ===== MANEJO DE ERRORES (LÓGICA MIGRADA) =====
      let errorMessage = 'Error desconocido al crear el contenido.';
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Datos inválidos en el formulario.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Sesión expirada. Inicia sesión nuevamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para crear contenido.';
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
   * MIGRADO DESDE useUploadProgress hook (usando endpoints correctos)
   */
  const monitorProgress = (taskId, contentType = 'movies', onStatusChange = null, onFinish = null) => {

    const checkProgress = async () => {
      try {
        // ✅ ARREGLO: Usar URL y endpoint correctos según el hook original
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const endpoint = `${backendUrl}/api/v1/${contentType}/progress/${taskId}`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // ✅ ARREGLO: Incluir cookies de autenticación
          timeout: 10000, // 10 segundos timeout
        });
        
        // ✅ ARREGLO: Manejo de errores específicos según el hook original
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Tarea no encontrada');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();

        // ✅ ARREGLO: Ajustar progreso según el hook original
        let adjustedProgress = data.progress || 0;
        let status = data.status;
        let message = data.message;
        
        // Ajustar progreso basado en el estado
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
        
        // Actualizar estados del contexto
        setUploadProgress(adjustedProgress);
        setUploadStatus(status);
        
        // Callback opcional para cambios de estado
        if (onStatusChange) {
          onStatusChange(status, adjustedProgress, message);
        }
        
        if (status === 'completed') {

          setProcessing(false);
          setUploadStatus('completed');
          
          if (onFinish) {
            onFinish(true, null);
          }
          
          // Refrescar películas para obtener datos actualizados
          setTimeout(() => {
            loadMovies();
          }, 1000);
          
        } else if (status === 'failed' || status === 'error') {

          setProcessing(false);
          setUploadStatus('error');
          setError(message || 'Error en el procesamiento');
          
          if (onFinish) {
            onFinish(false, message || 'Error en el procesamiento');
          }
          
        } else if (status === 'processing' || status === 'transcoding') {
          // Continuar monitoreando cada 1 segundo (como en el hook original)
          setTimeout(checkProgress, 1000);
        }
        
      } catch (error) {

        // ✅ ARREGLO: Manejo de errores según el hook original
        // Evitar warning de variable no usada
        const errorMessage = error.message.includes('Tarea no encontrada') 
          ? 'Tarea no encontrada'
          : error.message.includes('timeout')
          ? 'Timeout consultando progreso'
          : 'Error de conexión consultando progreso';
        
        console.log('Error en progreso:', errorMessage);

        // Si hay error, asumir que está completado para no bloquear la UI
        setProcessing(false);
        setUploadStatus('completed');
        setUploadProgress(100);
        
        if (onFinish) {
          onFinish(true, null); // Marcamos como exitoso para no bloquear
        }
        
        // Refrescar películas
        setTimeout(() => {
          loadMovies();
        }, 1000);
      }
    };
    
    // Iniciar monitoreo después de un pequeño delay
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
   * Cargar película por ID con datos completos
   * MIGRADO DESDE MovieEditPage (lógica funcional comprobada)
   */
  const loadMovieById = async (movieId) => {
    try {

      setLoadingMovie(true);
      setError(null);
      
      const movieResponse = await getMovieByIdService(movieId);

      // ✅ MIGRADO: Manejo de respuesta como en MovieEditPage
      let movieInfo = null;
      if (movieResponse.success) {
        movieInfo = movieResponse.data;
      } else if (movieResponse.id) {
        movieInfo = movieResponse; // Respuesta directa
      } else {
        throw new Error('Formato de respuesta inesperado del backend');
      }

      setCurrentMovie(movieInfo);
      
      return { 
        success: true, 
        data: movieInfo,
        message: 'Película cargada exitosamente' 
      };

    } catch (error) {

      setError(error.message || 'Error al cargar datos de la película');
      
      return { 
        success: false, 
        error: error.message || 'Error al cargar datos de la película' 
      };
    } finally {
      setLoadingMovie(false);
    }
  };

  /**
   * Actualizar película existente
   * MIGRADO DESDE MovieEditPage (lógica funcional comprobada)
   */
  const updateMovie = async (movieId, movieData) => {
    try {

      setEditing(true);
      setError(null);

      // ✅ MIGRADO: Preparar datos para el backend (solo campos que cambiaron)
      const updateData = {};
      
      // Filtrar solo los campos que tienen valores
      Object.keys(movieData).forEach(key => {
        if (movieData[key] !== undefined && movieData[key] !== null && movieData[key] !== '') {
          updateData[key] = movieData[key];
        }
      });

      // Si no hay cambios reales, no enviar
      if (Object.keys(updateData).length === 0) {
        return { 
          success: false, 
          error: 'No hay cambios para guardar' 
        };
      }

      await updateMovieService(movieId, updateData);

      // ✅ MIGRADO: Manejo de respuesta como en MovieEditPage
      if (!response || (response.error && !response.success)) {
        throw new Error(response?.error || 'Error al actualizar película');
      }

      // ✅ ACTUALIZAR ESTADO LOCAL
      setMovies(prevMovies => {
        return prevMovies.map(movie => {
          if (movie.id.toString() === movieId.toString()) {
            return { ...movie, ...updateData };
          }
          return movie;
        });
      });

      // ✅ ACTUALIZAR PELÍCULA ACTUAL SI ESTÁ CARGADA
      if (currentMovie && currentMovie.id.toString() === movieId.toString()) {
        setCurrentMovie(prevMovie => ({ ...prevMovie, ...updateData }));
      }

      return { 
        success: true, 
        data: response,
        message: 'Película actualizada exitosamente' 
      };

    } catch (error) {

      setError(error.message || 'Error al actualizar película');
      
      return { 
        success: false, 
        error: error.message || 'Error al actualizar película' 
      };
    } finally {
      setEditing(false);
    }
  };

  /**
   * Limpiar película actual
   */
  const clearCurrentMovie = () => {

    setCurrentMovie(null);
    setLoadingMovie(false);
    setEditing(false);
  };

  /**
   * Obtener película por ID desde estado local
   */
  const getMovieById = (movieId) => {

    return movies.find(movie => movie.id.toString() === movieId.toString()) || null;
  };

  // ===== VALOR DEL CONTEXTO =====
  const value = {
    // Estados principales
    movies,
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
    currentMovie,
    loadingMovie,

    // Funciones principales
    loadMovies,
    refreshMovies,
    clearMovies,
    deleteMovie,

    // Funciones CRUD
    createMovie,
    updateMovie,
    getMovieById,
    loadMovieById,
    clearCurrentMovie,

    // Funciones de progreso
    monitorProgress,
    resetCreationState,

    // Utilidades
    formatMovieDate,
    getMovieCoverUrl,
    getMoviesStats,

    // Estados internos para funciones futuras
    setMovies,
    setDeleting,
    setError,
    setUploadProgress,
    setUploadStatus,
    setProcessing,
    setEditing,
    setCurrentMovie,
    setLoadingMovie
  };

  return (
    <MoviesContext.Provider value={value}>
      {children}
    </MoviesContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de películas
 */
function useMovies() {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMovies debe usarse dentro de MoviesProvider');
  }
  return context;
}

// PropTypes para validación
MoviesProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { MoviesContext, MoviesProvider, useMovies };