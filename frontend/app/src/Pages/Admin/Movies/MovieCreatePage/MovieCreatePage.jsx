// ===== MOVIE CREATE PAGE - VERSIÓN ACTUALIZADA SIN ORIGINAL_TITLE =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ===== LAYOUTS Y COMPONENTES =====
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { Button } from '../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../components/atoms/Card/Card';

// ===== COMPONENTES ESPECÍFICOS =====
import { TMDBSearchView } from '../../../../components/organisms/TMDBSearchView/TMDBSearchView';
import { MovieFormView } from './components/MovieFormView';

// ===== SERVICIOS Y HOOKS =====
import { createMovieService } from '../../../../services/Movies/createMovieService';
import { tmdbService } from '../../../../services/tmdb/TMDBService';
import { ProgressModal } from "../../../../components/molecules/ProgressModal/ProgressModal";
import { useUploadProgress } from "../../../../hooks/useUploadProgress";
import { useCategories } from "../../../../hooks/useCategories";
import { useFormNavigation } from "../../../../hooks/useFormNavigation";
import { filterEmptyFields } from '../../../../utils/formUtils';

// ===== ESTILOS =====
import './MovieCreatePage.css';

/**
 * MovieCreatePage - VERSIÓN ACTUALIZADA SIN ORIGINAL_TITLE
 * ✅ CAMPO REMOVIDO: original_title eliminado del formulario
 * ✅ FILTRO DE CAMPOS: Solo envía campos con valores al backend
 * ✅ INTEGRACIÓN TMDB: Conecta con la API real usando VITE_TMDB_API_KEY
 * ✅ BÚSQUEDA FUNCIONAL: Películas y series desde TMDB
 * ✅ FORMULARIO OPTIMIZADO: Campos correctos según el sistema de diseño
 * ✅ MANEJO DE ERRORES: Validaciones y estados de error mejorados
 * ✅ UX MEJORADA: Estados de carga, confirmaciones, navegación fluida
 */
function MovieCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS PRINCIPALES =====
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ===== ESTADOS DE FORMULARIO =====
  const [formLoading, setFormLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ===== HOOKS =====
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const {
    currentView,
    selectedItem,
    hasChanges,
    handleSelectFromTMDB,
    handleManualCreate,
    markAsChanged,
    resetNavigation
  } = useFormNavigation();

  // ===== ESTADO DE PROGRESO DE SUBIDA =====
  const { 
    progress, 
    status, 
    message, 
    error: progressError, 
    monitorProgress, 
    resetProgress,
    setProgress,
    setStatus,
    setMessage
  } = useUploadProgress();


  // ===== WRAPPER PARA NAVEGACIÓN CON RESET DE ERRORES =====
  const handleSelectFromTMDBWithReset = (item) => {
    handleSelectFromTMDB(item, 'movie');
    setSubmitError(null);
  };

  const handleManualCreateWithReset = () => {
    handleManualCreate();
    setSubmitError(null);
  };

  // ===== GENERACIÓN DE CAMPOS DEL FORMULARIO (SIN ORIGINAL_TITLE) =====
  const generateFormFields = () => {
    return [
      {
        name: 'title',
        type: 'text',
        label: 'Título *',
        placeholder: 'Ej: Avatar: El Camino del Agua',
        required: true,
        leftIcon: '🎬',
        helperText: 'Título principal que aparecerá en el catálogo'
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Descripción *',
        placeholder: 'Escribe una descripción atractiva del contenido...',
        required: true,
        rows: 4,
        leftIcon: '📝',
        helperText: 'Descripción que aparecerá en la página de detalles'
      },
      {
        name: 'releaseYear',
        type: 'number',
        label: 'Año de Estreno *',
        placeholder: new Date().getFullYear().toString(),
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 5,
        leftIcon: '📅',
        helperText: 'Año de estreno original'
      },
      {
        name: 'categoryId',
        type: 'select',
        label: (() => {
          if (categoriesLoading) return '⏳ Cargando categorías...';
          if (categoriesError) return '❌ Error al cargar categorías';
          if (categories.length === 0) return '📋 Sin categorías disponibles - Ve a Administrar > Categorías para crear una.';
          return `📋 Selecciona la categoría principal (${categories.length} disponibles)`;
        })(),
        placeholder: categoriesLoading ? 'Cargando categorías...' : 'Selecciona una categoría',
        required: true,
        leftIcon: '🏷️',
        options: categories.map(cat => ({
          value: cat.id,
          label: cat.name
        })),
        disabled: categoriesLoading || categories.length === 0,
        helperText: categoriesError || 'Categoría principal para organizar el contenido'
      },
      {
        name: 'coverImageUrl',
        type: 'text',
        label: 'URL de Portada',
        placeholder: 'https://ejemplo.com/imagen.jpg',
        leftIcon: '🔗',
        helperText: 'URL de la imagen de portada (opcional si subes archivo)'
      },
      {
        name: 'coverImageFile',
        type: 'image-crop',
        label: 'Archivo de Portada',
        aspect: 2/3,
        acceptedFormats: ['jpg', 'png', 'webp'],
        maxFileSize: '5MB',
        showPreview: true,
        previewDimensions: { width: 120, height: 180 },
        helperText: 'Sube una imagen para recortar como portada (formato póster 2:3)'
      },
      {
        name: 'video',
        type: 'file',
        label: 'Archivo de Video *',
        accept: 'video/*,.mkv,.avi,.mp4,.webm,.mov,.wmv,.flv,.m4v',
        required: true,
        leftIcon: '🎥',
        helperText: 'Archivo de video a subir (formatos: mp4, avi, mkv, webm, mov, wmv, flv, m4v)'
      }
    ];
  };

  // ===== GENERACIÓN DE DATOS INICIALES (SIN ORIGINAL_TITLE) =====
  const generateInitialFormData = (item) => {
    const baseData = {
      title: '',
      description: '',
      releaseYear: new Date().getFullYear(),
      categoryId: categories.length > 0 ? categories[0].id : '',
      email: '',
      coverImageUrl: '',
      coverImageFile: null,
      video: null,
      tmdb_id: null,
      media_type: 'movie'
    };

    // Si hay un item de TMDB, llenar con sus datos
    if (item) {
      return {
        ...baseData,
        title: item.title || item.name || baseData.title,
        description: item.overview || baseData.description,
        releaseYear: item.year || (item.release_date ? new Date(item.release_date).getFullYear() :
          item.first_air_date ? new Date(item.first_air_date).getFullYear() : baseData.releaseYear),
        coverImageUrl: item.poster_path || baseData.coverImageUrl,
        tmdb_id: item.id || item.tmdb_id || baseData.tmdb_id,
        media_type: item.type || item.media_type || (item.name ? 'tv' : 'movie')
      };
    }

    return baseData;
  };


  // ===== HANDLER DEL FORMULARIO CON FILTRO DE CAMPOS VACÍOS =====
  const handleFormSubmit = async (movieData) => {
    setFormLoading(true);
    setSubmitError(null);

    // ✅ NUEVO: Mostrar feedback inmediato durante el upload
    resetProgress();
    setProgress(0);
    setStatus('uploading');
    setMessage('Preparando archivos para subir...');

    // ✅ NUEVO: Escuchar eventos de progreso de upload
    const handleUploadProgress = (event) => {
      const { progress } = event.detail;
      // Upload toma 0-50% del progreso total
      const adjustedProgress = Math.round(progress * 0.5);
      setProgress(adjustedProgress);
      
      if (progress < 10) {
        setMessage('Iniciando subida del video...');
      } else if (progress < 100) {
        setMessage('Subiendo video al servidor...');
      } else {
        setMessage('Upload completado, validando archivo...');
      }
    };

    window.addEventListener('uploadProgress', handleUploadProgress);

    try {
      console.log('📤 Datos originales:', movieData);
      
      // Filtrar campos vacíos antes de enviar
      const filteredData = filterEmptyFields(movieData);
      console.log('📤 Datos filtrados (sin campos vacíos):', filteredData);

      const result = await createMovieService(filteredData);

      // ✅ Limpiar listener de upload
      window.removeEventListener('uploadProgress', handleUploadProgress);

      console.log('✅ Contenido creado exitosamente:', result);

      // ✅ Cambiar a estado de procesamiento (continuar desde 50%)
      setProgress(50);
      setMessage('Analizando propiedades del video...');
      setStatus('processing');

      // ✅ Marcar que está procesando, NO mostrar éxito aún
      setIsProcessing(true);
      resetNavigation();

      const taskId = result?.taskId || result?.task_id || result?.id;

      if (taskId) {
        monitorProgress(taskId, 'movies', null, (finished, err) => {
          if (finished) {
            // ✅ AHORA sí mostrar éxito cuando realmente termine
            setIsProcessing(false);
            setSuccess(true);
            setTimeout(() => {
              navigate('/admin/movies');
              resetProgress();
            }, 2000);
          } else if (err) {
            setIsProcessing(false);
            setSubmitError(err);
            resetProgress();
          }
        });
      } else {
        // ✅ Solo si no hay taskId (procesamiento inmediato)
        setIsProcessing(false);
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/movies');
        }, 2000);
      }

    } catch (err) {
      // ✅ Limpiar listener en caso de error
      window.removeEventListener('uploadProgress', handleUploadProgress);
      
      console.error('❌ Error al crear contenido:', err);

      let errorMessage = 'Error desconocido al crear el contenido.';
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Datos inválidos en el formulario.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Sesión expirada. Inicia sesión nuevamente.';
      } else if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para crear contenido.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Error del servidor. Intenta más tarde.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setSubmitError(errorMessage);
      setIsProcessing(false); // ✅ Limpiar estado de procesamiento
      resetProgress(); // ✅ Resetear progreso en caso de error
    } finally {
      setFormLoading(false);
    }
  };

  // ===== RENDER PRINCIPAL =====
  return (
    <AdminLayout>
      <Container size='lg'>
        <div className="movie-create-page">
          {/* Botón volver a películas */}
            <Button
              variant="outline"
              size="md"
              leftIcon="←"
              onClick={() => navigate('/admin/movies')}
            >
              Volver a Películas
            </Button>

          {/* Contenido principal */}
          {currentView === 'search' && (
            <TMDBSearchView
              onSelectItem={handleSelectFromTMDBWithReset}
              onManualCreate={handleManualCreateWithReset}
              contentType="all"
              title="🎬 Buscar en TMDB"
              description="Busca películas en The Movie Database para agregar a tu catálogo"
              placeholder="Ej: Avatar, Breaking Bad, Inception..."
              helperText="Busca por título, año o palabras clave"
              showManualCreate={true}
            />
          )}

          {currentView === 'form' && (
            <MovieFormView
              fields={generateFormFields()}
              initialData={generateInitialFormData(selectedItem)}
              onSubmit={handleFormSubmit}
              categoryOptions={categories.map(cat => ({ value: cat.id, label: cat.name }))}
              loading={formLoading || isProcessing}
              error={submitError}
              success={success && !isProcessing}
              hasChanges={hasChanges}
              onChange={markAsChanged}
              selectedItem={selectedItem} // ✅ AGREGAR: Para detectar si es manual o TMDB
            />
          )}

        </div>
      </Container>
      <ProgressModal
        isVisible={status !== 'idle'}
        progress={progress}
        status={status}
        message={progressError || message}
        size="lg"
      />
    </AdminLayout>
  );
}

export { MovieCreatePage };