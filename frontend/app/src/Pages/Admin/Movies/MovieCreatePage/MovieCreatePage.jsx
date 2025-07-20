// ===== MOVIE CREATE PAGE - VERSIÓN ACTUALIZADA SIN ORIGINAL_TITLE =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ===== LAYOUTS Y COMPONENTES =====
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { Button } from '../../../../components/atoms/Button/Button';

// ===== COMPONENTES ESPECÍFICOS =====
import { TMDBSearchView } from '../../../../components/organisms/TMDBSearchView/TMDBSearchView';
import { MovieFormView } from './components/MovieFormView';

// ===== SERVICIOS Y HOOKS =====
import { ProgressModal } from "../../../../components/molecules/ProgressModal/ProgressModal";
import { useCategories } from "../../../../hooks/useCategories";
import { useFormNavigation } from "../../../../hooks/useFormNavigation";
import { useMovies } from "../../../../app/context/MoviesContext";
import { useSuccessRedirect } from "../../../../hooks/useSuccessRedirect";

// ===== ESTILOS =====
import './MovieCreatePage.css';

/**
 * MovieCreatePage - VERSIÓN REFACTORIZADA CON MOVIESCONTEXT
 * ✅ REFACTORIZACIÓN: Toda la lógica migrada a MoviesContext
 * ✅ SIMPLICIDAD: Solo maneja UI y navegación
 * ✅ CONSISTENCIA: Usa estados centralizados del contexto
 * ✅ REUTILIZACIÓN: Lógica compartida entre componentes
 * ✅ INTEGRACIÓN TMDB: Conecta con la API real usando VITE_TMDB_API_KEY
 * ✅ BÚSQUEDA FUNCIONAL: Películas y series desde TMDB
 * ✅ FORMULARIO OPTIMIZADO: Campos correctos según el sistema de diseño
 * ✅ MANEJO DE ERRORES: Validaciones y estados de error mejorados
 * ✅ UX MEJORADA: Estados de carga, confirmaciones, navegación fluida
 */
function MovieCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS PRINCIPALES =====
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

  // ===== CONTEXTO DE PELÍCULAS =====
  const { 
    createMovie,
    monitorProgress,
    resetCreationState,
    creating,
    processing,
    uploadProgress,
    uploadStatus,
    error: contextError
  } = useMovies();

  // ===== HOOK DE ÉXITO HOMOLOGADO =====
  const { triggerSuccess } = useSuccessRedirect('/admin/movies');


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


  // ===== HANDLER DEL FORMULARIO SIMPLIFICADO =====
  const handleFormSubmit = async (movieData) => {
    setSubmitError(null);

    try {
      console.log('📤 [MovieCreatePage] Enviando datos al contexto:', movieData);
      
      // ✅ USAR FUNCIÓN DEL CONTEXTO (lógica migrada)
      const result = await createMovie(movieData);

      if (result.success) {
        console.log('✅ [MovieCreatePage] Película creada exitosamente:', result);
        
        // ✅ Limpiar navegación
        resetNavigation();

        if (result.taskId) {
          // ✅ Hay procesamiento asíncrono - monitorear progreso
          console.log('🔄 [MovieCreatePage] Iniciando monitoreo de progreso:', result.taskId);
          
          monitorProgress(result.taskId, 'movies', null, (finished, err) => {
            if (finished) {
              console.log('✅ [MovieCreatePage] Procesamiento completado');
              triggerSuccess('¡Película creada exitosamente!');
              resetCreationState();
            } else if (err) {
              console.error('❌ [MovieCreatePage] Error en procesamiento:', err);
              setSubmitError(err);
              resetCreationState();
            }
          });
        } else {
          // ✅ Procesamiento inmediato completado
          console.log('✅ [MovieCreatePage] Procesamiento inmediato completado');
          triggerSuccess('¡Película creada exitosamente!');
          resetCreationState();
        }
      } else {
        // ✅ Error del contexto
        console.error('❌ [MovieCreatePage] Error del contexto:', result.error);
        setSubmitError(result.error || 'Error desconocido al crear el contenido.');
      }

    } catch (err) {
      console.error('❌ [MovieCreatePage] Error en handleFormSubmit:', err);
      setSubmitError(err.message || 'Error desconocido al crear el contenido.');
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
              loading={creating || processing}
              error={submitError || contextError}
              hasChanges={hasChanges}
              onChange={markAsChanged}
              selectedItem={selectedItem} // ✅ AGREGAR: Para detectar si es manual o TMDB
            />
          )}

        </div>
      </Container>
      <ProgressModal
        isVisible={uploadStatus !== 'idle'}
        progress={uploadProgress}
        status={uploadStatus}
        message={contextError || (uploadStatus === 'uploading' ? 'Subiendo video...' : 
                uploadStatus === 'processing' ? 'Procesando video...' : 
                uploadStatus === 'completed' ? 'Procesamiento completado' : 
                'Preparando...')}
        size="lg"
      />
    </AdminLayout>
  );
}

export { MovieCreatePage };