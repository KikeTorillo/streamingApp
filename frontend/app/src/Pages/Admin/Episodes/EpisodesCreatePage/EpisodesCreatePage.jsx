// ===== EPISODES CREATE PAGE - CON EPISODES CONTEXT =====
// src/Pages/Admin/Episodes/EpisodesCreatePage/EpisodesCreatePage.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { ProgressModal } from "../../../../components/molecules/ProgressModal/ProgressModal";
import { useFormNavigation } from "../../../../hooks/useFormNavigation";
import { useSuccessRedirect } from "../../../../hooks/useSuccessRedirect";
import "./EpisodesCreatePage.css";

// Context
import { useEpisodes } from '../../../../app/context/EpisodesContext';

/**
 * EpisodesCreatePage - CON EPISODES CONTEXT
 * 
 * ✅ CONTEXT CENTRALIZADO: Toda la lógica en EpisodesContext
 * ✅ CONSISTENCIA TOTAL: Mismo patrón que MoviesContext y SeriesContext
 * ✅ PROGRESO INTEGRADO: Sistema de monitoreo desde el contexto
 * ✅ SIMPLICIDAD MÁXIMA: Código mínimo siguiendo principio KISS
 * ✅ MANTENIBILIDAD: Lógica centralizada y reutilizable
 */
function EpisodesCreatePage() {
  const navigate = useNavigate();

  // ===== ESTADOS LOCALES =====

  // ===== CONTEXT =====
  const {
    // Estados principales
    creating,
    processing,
    uploadProgress,
    uploadStatus,
    error,
    
    // Estados de series
    seriesData,
    seriesLoading,
    seriesError,
    
    // Funciones
    loadSeries,
    createEpisode,
    monitorProgress,
    resetCreationState
  } = useEpisodes();
  
  // ===== HOOKS =====
  const { hasChanges, markAsChanged, resetNavigation } = useFormNavigation();

  // ===== HOOK DE ÉXITO HOMOLOGADO =====
  const { triggerSuccess } = useSuccessRedirect('/admin/episodes');

  // ===== EFECTOS =====
  useEffect(() => {
    console.log('🚀 [EpisodesCreatePage] Componente montado, cargando series...');
    loadSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar al montar el componente

  // ===== CONFIGURACIÓN DEL FORMULARIO =====
  
  /**
   * Campos del formulario según schema del backend
   * Basado en: serieId, season, episodeNumber, title, description, video
   */
  const episodeFormFields = [
    {
      name: 'serieId',
      type: 'select',
      label: (() => {
        if (seriesLoading) return '⏳ Cargando series...';
        if (seriesError) return '❌ Error al cargar series';
        if (seriesData.length === 0) return '📺 Sin series disponibles - Ve a Administrar > Series para crear una.';
        return `📺 Serie * (${seriesData.length} disponibles)`;
      })(),
      placeholder: seriesLoading ? 'Cargando series...' : 'Selecciona la serie',
      required: true,
      leftIcon: '📺',
      options: seriesData.map(serie => ({
        value: serie.id,
        label: `${serie.title} (${serie.release_year || 'Sin año'})`
      })),
      disabled: seriesLoading || seriesData.length === 0,
      helperText: seriesError || 'Serie a la que pertenece este episodio',
      validation: {
        required: { value: true, message: 'Debes seleccionar una serie' }
      }
    },
    {
      name: 'season',
      type: 'number',
      label: 'Temporada *',
      placeholder: 'Ej: 1, 2, 3...',
      required: true,
      min: 1,
      max: 99,
      leftIcon: '🎬',
      helperText: 'Número de temporada (debe ser mayor a 0)',
      validation: {
        required: { value: true, message: 'La temporada es obligatoria' },
        min: { value: 1, message: 'La temporada debe ser mayor a 0' },
        max: { value: 99, message: 'Máximo 99 temporadas' }
      }
    },
    {
      name: 'episodeNumber',
      type: 'number',
      label: 'Número de Episodio *',
      placeholder: 'Ej: 1, 2, 3...',
      required: true,
      min: 1,
      max: 999,
      leftIcon: '🎭',
      helperText: 'Número del episodio dentro de la temporada',
      validation: {
        required: { value: true, message: 'El número de episodio es obligatorio' },
        min: { value: 1, message: 'El episodio debe ser mayor a 0' },
        max: { value: 999, message: 'Máximo 999 episodios por temporada' }
      }
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título del Episodio',
      placeholder: 'Ej: Piloto, El comienzo, La venganza...',
      leftIcon: '🏷️',
      helperText: 'Título específico del episodio (opcional)',
      maxLength: 255,
      validation: {
        maxLength: { value: 255, message: 'Máximo 255 caracteres' }
      }
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Describe brevemente lo que sucede en este episodio...',
      rows: 4,
      leftIcon: '📝',
      helperText: 'Descripción opcional del episodio',
      validation: {
        maxLength: { value: 1000, message: 'Máximo 1000 caracteres' }
      }
    },
    {
      name: 'video',
      type: 'file',
      label: 'Archivo de Video *',
      accept: 'video/*',
      required: true,
      leftIcon: '🎥',
      helperText: 'Archivo de video del episodio (formatos: MP4, AVI, MKV, etc.)',
      validation: {
        required: { value: true, message: 'El archivo de video es obligatorio' }
      }
    }
  ];

  /**
   * Datos iniciales del formulario
   */
  const initialData = {
    serieId: '',
    season: 1,
    episodeNumber: 1,
    title: '',
    description: '',
    video: null
  };

  // ===== FUNCIONES =====

  /**
   * Navegar de vuelta con confirmación si hay cambios
   */
  const handleGoBack = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }
    
    navigate('/admin/episodes');
  };

  /**
   * Detectar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    const hasData = Object.values(formData).some(value => {
      if (value instanceof File) return true;
      return value && value.toString().trim() !== '';
    });
    
    if (hasData) {
      markAsChanged();
    }
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      resetCreationState();
    }
  };

  /**
   * Enviar formulario usando el contexto
   */
  const handleSubmit = async (formData) => {
    try {
      console.log('📤 [EpisodesCreatePage] Enviando datos del episodio:', formData);

      // Primero procesar campos numéricos que vienen como strings  
      const processedData = {
        ...formData,
        serieId: parseInt(formData.serieId),
        season: parseInt(formData.season),
        episodeNumber: parseInt(formData.episodeNumber)
      };

      console.log('📤 [EpisodesCreatePage] Datos procesados:', processedData);

      // Usar createEpisode del contexto con callback de progreso
      const result = await createEpisode(processedData, (progress, status, message) => {
        console.log(`📊 [EpisodesCreatePage] Progreso: ${progress}% - ${status} - ${message}`);
      });

      if (result.success) {
        console.log('✅ [EpisodesCreatePage] Episodio creado exitosamente');
        triggerSuccess('¡Episodio creado exitosamente!');
        resetNavigation();

        // Si hay taskId, iniciar monitoreo
        if (result.taskId) {
          console.log('🔄 [EpisodesCreatePage] Iniciando monitoreo de progreso:', result.taskId);
          monitorProgress(
            result.taskId,
            'episodes',
            (status, progress, message) => {
              console.log(`📊 [EpisodesCreatePage] Estado: ${status} - ${progress}% - ${message}`);
            },
            (success, error) => {
              console.log('🏁 [EpisodesCreatePage] Proceso terminado:', { success, error });
              // La redirección ya está manejada por el hook useSuccessRedirect
            }
          );
        }
        // La redirección ya está manejada por el hook useSuccessRedirect
      } else {
        console.error('❌ [EpisodesCreatePage] Error al crear episodio:', result.error);
      }

    } catch (err) {
      console.error('💥 [EpisodesCreatePage] Error inesperado:', err);
    }
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Crear Nuevo Episodio"
      subtitle="Agregar un nuevo episodio a una serie existente"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Episodios', href: '/admin/episodes' },
        { label: 'Crear Episodio' }
      ]}
    >
      {/* CONTENEDOR PRINCIPAL */}
      <Container 
        size="lg" 
        variant="default"
        className={`${uploadStatus !== 'idle' ? 'episodes-create--loading' : ''}`}
      >
        
        {/* Header Actions */}
          <Button
            variant="outline"
            size="sm"
            leftIcon="←"
            onClick={handleGoBack}
            disabled={creating || processing || uploadStatus !== 'idle'}
          >
            Volver a Episodios
          </Button>


        {/* Mensaje de Error */}
        {error && (
          <div className="status-message status-message--error">
            <span className="status-message__icon">⚠️</span>
            <div className="status-message__content">
              <strong>Error al crear episodio</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Header del Formulario */}
        <div className="form-header">
          <h2 className="form-title">
            🎬 Nuevo Episodio
          </h2>
          <p className="form-description">
            Los episodios deben estar asociados a una serie existente. 
            Cada episodio se identifica por su temporada y número dentro de la serie.
            El archivo de video se procesará automáticamente después de la creación.
          </p>
        </div>

        {/* Formulario Dinámico */}
        <DynamicForm
          id="episode-create-form"
          fields={episodeFormFields}
          initialData={initialData}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
          loading={creating || processing || uploadStatus !== 'idle'}
          disabled={creating || processing || uploadStatus !== 'idle'}
          columnsPerRow={2}
          tabletColumns={1}
          mobileColumns={1}
          fieldSize="md"
          fieldRounded="md"
          submitText={
            uploadStatus === 'processing' ? "Procesando..." :
            uploadStatus === 'transcoding' ? "Transcodificando..." :
            creating ? "Creando Episodio..." : 
            "Crear Episodio"
          }
          submitVariant="primary"
          submitSize="md"
          submitIcon="🎬"
          validateOnBlur={true}
          validateOnChange={false}
          showSubmit={uploadStatus !== 'completed'}
          className="episode-form"
        />

        {/* Información adicional sobre episodios */}
        <div className="form-footer">
          <div className="info-card">
            <h4>💡 Consejos para crear episodios</h4>
            <ul>
              <li><strong>Orden correcto:</strong> Asegúrate de que la temporada y número de episodio sean correctos</li>
              <li><strong>Títulos descriptivos:</strong> Usa títulos únicos para cada episodio cuando sea posible</li>
              <li><strong>Archivos de calidad:</strong> Usa archivos de video en buena calidad (HD recomendado)</li>
              <li><strong>Formatos compatibles:</strong> MP4, AVI, MKV, MOV son los más recomendados</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h4>📊 Datos técnicos</h4>
            <ul>
              <li><strong>Serie:</strong> Debe existir una serie antes de crear episodios</li>
              <li><strong>Temporada:</strong> Número entero positivo (1-99)</li>
              <li><strong>Episodio:</strong> Número entero positivo (1-999)</li>
              <li><strong>Título:</strong> Opcional, máximo 255 caracteres</li>
              <li><strong>Video:</strong> Archivo requerido, se procesará automáticamente</li>
            </ul>
          </div>
        </div>

      </Container>

      <ProgressModal
        isVisible={uploadStatus !== 'idle'}
        progress={uploadProgress}
        status={uploadStatus}
        message={error || 'Procesando episodio...'}
        size="lg"
      />
    </AdminLayout>
  );
}

export { EpisodesCreatePage };