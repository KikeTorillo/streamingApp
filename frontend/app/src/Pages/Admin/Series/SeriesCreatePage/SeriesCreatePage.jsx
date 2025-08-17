// ===== SERIES CREATE PAGE - USANDO CONTEXTO =====
// src/Pages/Admin/Series/SeriesCreatePage/SeriesCreatePage.jsx

import { useState } from 'react';

// ===== LAYOUTS Y COMPONENTES =====
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';

// ===== COMPONENTES ESPECÍFICOS =====
import { TMDBSearchView } from '../../../../components/organisms/TMDBSearchView/TMDBSearchView';
import { SeriesFormView } from './components/SeriesFormView';

// ===== CONTEXTO Y HOOKS =====
import { useSeries } from '../../../../app/context/SeriesContext';
import { Spinner } from "../../../../components/atoms/Spinner/Spinner";
import { useCategories } from "../../../../hooks/useCategories";
import { useFormNavigation } from "../../../../hooks/useFormNavigation";
import { useSuccessRedirect } from "../../../../hooks/useSuccessRedirect";

// ===== ESTILOS =====
import './SeriesCreatePage.css';

/**
 * SeriesCreatePage - USANDO CONTEXTO DE SERIES
 * ✅ CAMPO REMOVIDO: original_title eliminado del formulario
 * ✅ FILTRO DE CAMPOS: Solo envía campos con valores al backend
 * ✅ INTEGRACIÓN TMDB: Conecta con la API real usando VITE_TMDB_API_KEY
 * ✅ BÚSQUEDA FUNCIONAL: Películas y series desde TMDB
 * ✅ FORMULARIO OPTIMIZADO: Campos correctos según el sistema de diseño
 * ✅ MANEJO DE ERRORES: Validaciones y estados de error mejorados
 * ✅ UX MEJORADA: Estados de carga, confirmaciones, navegación fluida
 * ✅ CONTEXTO: Usa SeriesContext para toda la lógica de creación
 */
function SeriesCreatePage() {

  // ===== CONTEXTO DE SERIES =====
  const {
    creating,
    processing,
    uploadProgress,
    error: contextError,
    createSeries,
    resetCreationState
  } = useSeries();

  // ===== ESTADOS LOCALES =====
  const [progressMessage, setProgressMessage] = useState('');

  // ===== HOOKS =====
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const {
    currentView,
    selectedItem,
    hasChanges,
    handleSelectFromTMDB,
    handleManualCreate,
    markAsChanged
  } = useFormNavigation();

  // ===== HOOK DE ÉXITO HOMOLOGADO =====
  const { triggerSuccess } = useSuccessRedirect('/admin/series');

  // ===== WRAPPER PARA NAVEGACIÓN CON RESET DE ERRORES =====
  const handleSelectFromTMDBWithReset = (item) => {
    handleSelectFromTMDB(item, 'tv');
    resetCreationState(); // Reset del contexto
  };

  const handleManualCreateWithReset = () => {
    handleManualCreate();
    resetCreationState(); // Reset del contexto
  };

  // ===== GENERACIÓN DE CAMPOS DEL FORMULARIO (SIN ORIGINAL_TITLE) =====
  const generateFormFields = () => {
    return [
      {
        name: 'title',
        type: 'text',
        label: 'Título',
        placeholder: 'Ej: Breaking Bad, Game of Thrones...',
        required: true,
        leftIcon: 'video',
        helperText: 'Título principal que aparecerá en el catálogo'
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Descripción',
        placeholder: 'Escribe una descripción atractiva del contenido...',
        required: true,
        rows: 4,
        leftIcon: 'edit',
        helperText: 'Descripción que aparecerá en la página de detalles'
      },
      {
        name: 'releaseYear',
        type: 'number',
        label: 'Año de Estreno',
        placeholder: new Date().getFullYear().toString(),
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 5,
        leftIcon: 'calendar',
        helperText: 'Año de estreno original'
      },
      {
        name: 'categoryId',
        type: 'select',
        label: (() => {
          if (categoriesLoading) return 'Cargando categorías...';
          if (categoriesError) return 'Error al cargar categorías';
          if (categories.length === 0) return 'Sin categorías disponibles - Ve a Administrar > Categorías para crear una.';
          return `Selecciona la categoría principal (${categories.length} disponibles)`;
        })(),
        placeholder: categoriesLoading ? 'Cargando categorías...' : 'Selecciona una categoría',
        required: true,
        leftIcon: 'folder',
        options: categories.map(cat => ({
          value: cat.id,
          label: cat.name
        })),
        disabled: categoriesLoading || categories.length === 0,
        helperText: categoriesError || 'Categoría principal para organizar el contenido'
      },
      {
        name: 'coverImageFile',
        type: 'image-crop',
        label: 'Archivo de Portada',
        aspect: 2/3,
        maxFileSize: '5MB',
        showPreview: true,
        previewDimensions: { width: 120, height: 180 },
        helperText: 'Sube una imagen para recortar como portada (formato póster 2:3)'
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
      coverImage: '',
      tmdb_id: null,
      media_type: 'tv'
    };

    // Si hay un item de TMDB, llenar con sus datos
    if (item) {
      return {
        ...baseData,
        title: item.name || item.title || baseData.title,
        description: item.overview || baseData.description,
        releaseYear: item.year || (item.first_air_date ? new Date(item.first_air_date).getFullYear() :
          item.release_date ? new Date(item.release_date).getFullYear() : baseData.releaseYear),
        coverImage: item.poster_path || baseData.coverImage,
        tmdb_id: item.id || item.tmdb_id || baseData.tmdb_id,
        media_type: 'tv'
      };
    }

    return baseData;
  };

  // ===== CALLBACK PARA PROGRESO DEL CONTEXTO =====
  const handleProgressCallback = (_, __, message) => {

    setProgressMessage(message);
  };

  // ===== HANDLER DEL FORMULARIO USANDO CONTEXTO =====
  const handleFormSubmit = async (seriesData) => {
    try {

      setProgressMessage('Iniciando creación de la serie...');
      
      const result = await createSeries(seriesData, handleProgressCallback);

      if (result.success) {
        // ✅ Éxito - navegar de regreso al listado
        triggerSuccess('¡Serie creada exitosamente!');
        resetCreationState();
      } else {
        throw new Error(result.error || 'Error al crear serie');
      }

    } catch {

      // El error ya se maneja en el contexto
    }
  };

  // ===== RENDER PRINCIPAL =====
  return (
    <AdminLayout
      title="Crear Nueva Serie"
      subtitle="Agregar una nueva serie al catálogo multimedia"
      breadcrumbs={[
        { label: 'Series', to: '/admin/series' },
        { label: 'Crear Serie' }
      ]}
    >
      <Container size='lg'>
        <div className="series-create-page">
          {/* Contenido principal */}
          {currentView === 'search' && (
            <TMDBSearchView
              onSelectItem={handleSelectFromTMDBWithReset}
              onManualCreate={handleManualCreateWithReset}
              contentType="tv"
              title="Buscar Series en TMDB"
              description="Busca series en The Movie Database para agregar a tu catálogo"
              placeholder="Ej: Breaking Bad, Game of Thrones, The Office..."
              helperText="Busca series por título, año o palabras clave"
              showManualCreate={true}
            />
          )}

          {currentView === 'form' && (
            <SeriesFormView
              title={selectedItem ? `${selectedItem.title || selectedItem.name} (desde TMDB)` : "Crear Serie Manualmente"}
              description={selectedItem ? 
                "Completa la información adicional para la serie seleccionada de TMDB" : 
                "Completa toda la información para crear una nueva serie desde cero"
              }
              fields={generateFormFields()}
              initialData={generateInitialFormData(selectedItem)}
              onSubmit={handleFormSubmit}
              categoryOptions={categories.map(cat => ({ value: cat.id, label: cat.name }))}
              loading={creating || processing}
              error={contextError}
              hasChanges={hasChanges}
              onChange={markAsChanged}
            />
          )}

        </div>
      </Container>
      
      {/* Spinner overlay para procesos de subida */}
      {(creating || processing) && (
        <Spinner
          variant="primary"
          size="lg"
          message={progressMessage || `Progreso: ${uploadProgress}%` || 'Iniciando creación de la serie...'}
          overlay={true}
          spinnerVariant="circle"
        />
      )}
    </AdminLayout>
  );
}

export { SeriesCreatePage };