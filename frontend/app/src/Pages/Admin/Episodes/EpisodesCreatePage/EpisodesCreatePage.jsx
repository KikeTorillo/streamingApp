// ===== EPISODES CREATE PAGE - CON EPISODES CONTEXT =====
// src/Pages/Admin/Episodes/EpisodesCreatePage/EpisodesCreatePage.jsx

import { useEffect } from 'react';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { ProgressModal } from "../../../../components/molecules/ProgressModal/ProgressModal";
import { Typography } from '../../../../components/atoms/Typography/Typography';
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
  const { markAsChanged, resetNavigation } = useFormNavigation();

  // ===== HOOK DE ÉXITO HOMOLOGADO =====
  const { triggerSuccess } = useSuccessRedirect('/admin/episodes');

  // ===== EFECTOS =====
  useEffect(() => {

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
        return `Serie * (${seriesData.length} disponibles)`;
      })(),
      placeholder: seriesLoading ? 'Cargando series...' : 'Selecciona la serie',
      required: true,
      leftIcon: 'video',
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
      leftIcon: 'film',
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
      leftIcon: 'list',
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
      leftIcon: 'edit',
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
      helperText: 'Descripción opcional del episodio',
      validation: {
        maxLength: { value: 1000, message: 'Máximo 1000 caracteres' }
      }
    },
    {
      name: 'video',
      type: 'file',
      label: 'Archivo de Video',
      accept: 'video/*',
      required: true,
      leftIcon: 'video',
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

      // Primero procesar campos numéricos que vienen como strings  
      const processedData = {
        ...formData,
        serieId: parseInt(formData.serieId),
        season: parseInt(formData.season),
        episodeNumber: parseInt(formData.episodeNumber)
      };

      // Usar createEpisode del contexto con callback de progreso
      const result = await createEpisode(processedData, () => {
        // Callback de progreso - manejado por el contexto
      });

      if (result.success) {

        // ✅ Limpiar navegación
        resetNavigation();

        if (result.taskId) {
          // ✅ Hay procesamiento asíncrono - monitorear progreso

          monitorProgress(
            result.taskId,
            'episodes',
            () => {
              // Callback de progreso para monitoreo
            },
            (finished, err) => {
              if (finished) {

                triggerSuccess('¡Episodio creado exitosamente!');
                resetCreationState();
              } else if (err) {

                resetCreationState();
              }
            }
          );
        } else {
          // ✅ Procesamiento inmediato completado

          triggerSuccess('¡Episodio creado exitosamente!');
          resetCreationState();
        }
      } else {
        // Error en creación - el usuario ya fue notificado por el contexto
      }

    } catch {
      // Error de red durante creación
    }
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Crear Nuevo Episodio"
      subtitle="Agregar un nuevo episodio a una serie existente"
      breadcrumbs={[
        { label: 'Episodios', to: '/admin/episodes' },
        { label: 'Crear Episodio' }
      ]}
    >
        {/* Mensaje de Error */}
        {error && (
          <div className="status-message status-message--error">
            <Typography variant="span" size="md" className="status-message__icon">⚠️</Typography>
            <div className="status-message__content">
              <Typography variant="strong" size="md" weight="semibold">Error al crear episodio</Typography>
              <Typography variant="span" size="sm" color="muted">{error}</Typography>
            </div>
          </div>
        )}

        {/* Header del Formulario */}
        <div className="form-header">
          <Typography variant="h2" size="lg" weight="semibold" className="form-title">
            Nuevo Episodio
          </Typography>
          <Typography variant="body" size="md" color="muted" className="form-description">
            Los episodios deben estar asociados a una serie existente. 
            Cada episodio se identifica por su temporada y número dentro de la serie.
            El archivo de video se procesará automáticamente después de la creación.
          </Typography>
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
          submitIcon="film"
          validateOnBlur={true}
          validateOnChange={false}
          showSubmit={uploadStatus !== 'completed'}
          className="episode-form"
        />

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