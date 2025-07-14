// ===== MOVIE CREATE PAGE - VERSIÓN ACTUALIZADA SIN ORIGINAL_TITLE =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ===== LAYOUTS Y COMPONENTES =====
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { Button } from '../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../components/atoms/Card/Card';

// ===== COMPONENTES ESPECÍFICOS =====
import { TMDBSearchView } from '../../../../components/organism/TMDBSearchView/TMDBSearchView';
import { MovieFormView } from './components/MovieFormView';

// ===== SERVICIOS Y HOOKS =====
import { createMovieService } from '../../../../services/Movies/createMovieService';
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';
import { tmdbService } from '../../../../services/tmdb/TMDBService';
import { ProgressModal } from "../../../../components/molecules/ProgressModal/ProgressModal";
import { useUploadProgress } from "../../../../hooks/useUploadProgress";

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
  const [currentView, setCurrentView] = useState('search'); // 'search' | 'form'
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== ESTADOS DE FORMULARIO =====
  const [formLoading, setFormLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

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

  // ===== CARGAR CATEGORÍAS AL INICIO =====
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        console.log('📂 Cargando categorías...');
        const response = await getCategoriesService();

        const data = Array.isArray(response) ? response : 
                     response?.data ? response.data : 
                     response?.categories ? response.categories : [];

        console.log('📂 Categorías cargadas:', data);
        setCategories(data);

        if (data.length === 0) {
          setCategoriesError('No hay categorías disponibles. Ve a Administrar > Categorías para crear una.');
        }
      } catch (err) {
        console.error('❌ Error cargando categorías:', err);
        setCategoriesError('Error al cargar categorías. Verifica tu conexión.');
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // ===== HANDLERS DE NAVEGACIÓN =====
  const handleSelectFromTMDB = (item) => {
    console.log('🎬 Elemento seleccionado de TMDB:', item);
    setSelectedItem(item);
    setCurrentView('form');
    setHasChanges(false);
    setSubmitError(null);
  };

  const handleManualCreate = () => {
    console.log('✏️ Creación manual iniciada');
    setSelectedItem(null);
    setCurrentView('form');
    setHasChanges(false);
    setSubmitError(null);
  };

  const handleBackToSearch = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        '⚠️ Hay cambios sin guardar. ¿Estás seguro de que quieres volver? Se perderán los cambios no guardados.'
      );
      if (!confirmLeave) return;
    }

    setSelectedItem(null);
    setCurrentView('search');
    setHasChanges(false);
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
        type: 'file',
        label: 'Archivo de Portada',
        accept: 'image/*',
        leftIcon: '🖼️',
        helperText: 'Sube una imagen como portada (opcional si usas URL)'
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

  // ===== FUNCIÓN PARA FILTRAR CAMPOS VACÍOS =====
  const filterEmptyFields = (data) => {
    const filteredData = {};
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      // Solo incluir el campo si tiene un valor válido
      if (value !== null && value !== undefined && value !== '') {
        // Para archivos, verificar que sea un File válido
        if (value instanceof File) {
          filteredData[key] = value;
        }
        // Para strings, verificar que no estén vacíos después de trim
        else if (typeof value === 'string' && value.trim() !== '') {
          filteredData[key] = value.trim();
        }
        // Para números, verificar que sean válidos
        else if (typeof value === 'number' && !isNaN(value)) {
          filteredData[key] = value;
        }
        // Para otros tipos de datos válidos
        else if (typeof value !== 'string') {
          filteredData[key] = value;
        }
      }
    });
    
    return filteredData;
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
      setHasChanges(false);

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

          {/* Header */}
          <Card className="movie-create-page__header">
            <CardHeader>
              <CardTitle>
                {currentView === 'search' ? '🔍 Buscar Contenido' : '📝 Crear Contenido'}
              </CardTitle>
              <p className="movie-create-page__description">
                {currentView === 'search'
                  ? 'Busca películas y series en TMDB o crea contenido manualmente'
                  : selectedItem
                    ? `Creando: ${selectedItem.title || selectedItem.name || 'Contenido desde TMDB'}`
                    : 'Creando contenido manualmente'
                }
              </p>
            </CardHeader>

            {currentView === 'form' && (
              <CardBody>
                <Button
                  variant="ghost"
                  leftIcon="←"
                  onClick={handleBackToSearch}
                  disabled={formLoading}
                >
                  Volver a búsqueda
                </Button>
              </CardBody>
            )}
          </Card>

          {/* Contenido principal */}
          {currentView === 'search' && (
            <TMDBSearchView
              onSelectItem={handleSelectFromTMDB}
              onManualCreate={handleManualCreate}
              contentType="all"
              title="🎬 Buscar en TMDB"
              description="Busca películas y series en The Movie Database para agregar a tu catálogo"
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
              onChange={() => setHasChanges(true)}
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