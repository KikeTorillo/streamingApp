// ===== EPISODE EDIT PAGE - HOMOLOGADA CON LAYOUT DE 2 COLUMNAS =====
// src/Pages/Admin/Episodes/EpisodeEditPage/EpisodeEditPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { Container } from '../../../../components/atoms/Container/Container';
import { Divider } from '../../../../components/atoms/Divider/Divider';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { Typography } from '../../../../components/atoms/Typography/Typography';

// Context
import { useEpisodes } from '../../../../app/context/EpisodesContext';

/**
 * EpisodeEditPage - HOMOLOGADA CON PATRÓN DE 2 COLUMNAS
 * 
 * ✅ HOMOLOGACIÓN: Layout moderno de 2 columnas como MovieEditPage/UserEditPage
 * ✅ CONSISTENCIA: Usa mismos componentes del sistema de diseño
 * ✅ SIMPLIFICIDAD: Lógica centralizada en EpisodesContext
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ VALIDACIONES: Según esquemas del backend
 */
function EpisodeEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ===== ESTADOS LOCALES =====
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [localError, setLocalError] = useState(null);

  // ===== CONTEXTOS =====
  const {
    // Estados principales
    currentEpisode,
    loadingEpisode,
    editing,
    error: contextError,
    
    // Estados de series
    seriesData,
    
    // Funciones
    loadSeries,
    loadEpisodeById,
    updateEpisode,
    clearCurrentEpisode,
  } = useEpisodes();


  // ===== CONFIGURACIÓN DEL FORMULARIO =====
  
  /**
   * Campos de edición - Solo campos permitidos para actualización
   * PERMITIDOS: title, serieId, season, episodeNumber
   */
  const getEditFormFields = () => {
    return [
      {
        name: 'title',
        type: 'text',
        label: 'Título del Episodio',
        placeholder: 'Ej: El inicio de todo',
        required: true,
        leftIcon: 'film',
        helperText: 'Título del episodio que aparecerá en el catálogo',
        width: 'full'
      },
      {
        name: 'serieId',
        type: 'select',
        label: 'Serie',
        required: true,
        leftIcon: 'film',
        helperText: 'Serie a la que pertenece este episodio',
        options: seriesData.map(serie => ({
          value: serie.id,
          label: serie.title
        })),
        width: 'full'
      },
      {
        name: 'season',
        type: 'number',
        label: 'Temporada',
        placeholder: 'Ej: 1',
        required: true,
        leftIcon: 'film',
        helperText: 'Número de temporada (debe ser mayor a 0)',
        width: 'half',
        validation: (value) => {
          if (value && (value < 1 || value > 50)) {
            return 'La temporada debe estar entre 1 y 50';
          }
          return true;
        }
      },
      {
        name: 'episodeNumber',
        type: 'number',
        label: 'Número de Episodio',
        placeholder: 'Ej: 1',
        required: true,
        leftIcon: 'list',
        helperText: 'Número del episodio en la temporada (debe ser mayor a 0)',
        width: 'half',
        validation: (value) => {
          if (value && (value < 1 || value > 999)) {
            return 'El número de episodio debe estar entre 1 y 999';
          }
          return true;
        }
      }
    ];
  };

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * Cargar datos del episodio usando el contexto
   */
  const loadEpisodeData = async () => {
    if (!id) {
      setLocalError('ID de episodio no proporcionado');
      return;
    }

    try {
      setLocalError(null);

      // Cargar series primero (función síncrona)
      await loadSeries();
      
      // Luego cargar el episodio
      const episodeResult = await loadEpisodeById(id);
      
      if (episodeResult.success && episodeResult.data && typeof episodeResult.data === 'object') {
        const episodeInfo = episodeResult.data;

        setInitialData({ 
          title: episodeInfo.title || '',
          serieId: episodeInfo.serie_id || '',
          season: episodeInfo.season || 1,
          episodeNumber: episodeInfo.episode_number || 1,
        });
        
      } else {
        setLocalError(episodeResult.error || 'Error al cargar datos del episodio');
      }
      
    } catch (error) {
      setLocalError(error.message || 'Error al cargar datos del episodio');
    }
  };

  // ===== FUNCIONES DE MANEJO =====
  
  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {

    // Verificar si hay cambios comparando con datos iniciales
    const hasRealChanges = initialData && (
      formData.title !== initialData.title ||
      parseInt(formData.serieId) !== initialData.serieId ||
      parseInt(formData.season) !== initialData.season ||
      parseInt(formData.episodeNumber) !== initialData.episodeNumber
    );
    
    setHasChanges(hasRealChanges);

  };

  /**
   * Manejar envío del formulario usando el contexto
   */
  const handleSubmit = async (formData) => {
    try {
      setLocalError(null);

      // Preparar datos para el backend (solo campos que cambiaron)
      const updateData = {};
      
      if (formData.title !== initialData.title) {
        updateData.title = formData.title.trim();
      }
      
      if (parseInt(formData.serieId) !== initialData.serieId) {
        updateData.serieId = parseInt(formData.serieId);
      }
      
      if (parseInt(formData.season) !== initialData.season) {
        updateData.season = parseInt(formData.season);
      }

      if (parseInt(formData.episodeNumber) !== initialData.episodeNumber) {
        updateData.episodeNumber = parseInt(formData.episodeNumber);
      }

      // Usar updateEpisode del contexto
      const result = await updateEpisode(id, updateData);

      if (result.success) {
        // Éxito
        setSuccess(true);
        setHasChanges(false);

        // Recargar datos actualizados
        setTimeout(() => {
          loadEpisodeData();
        }, 1000);

        // Redirigir después de un delay
        setTimeout(() => {
          navigate('/admin/episodes');
        }, 2500);
        
      } else {
        if (result.error === 'No hay cambios para guardar') {
          alert('No hay cambios para guardar');
        } else {
          setLocalError(result.error || 'Error al actualizar episodio');
        }
      }

    } catch (err) {
      setLocalError(err.message || 'Error al actualizar episodio');
    }
  };

  /**
   * Manejar cancelación
   */
  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm(
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir? ' +
        'Se perderán los cambios no guardados.'
      );
      if (!confirmCancel) return;
    }
    
    navigate('/admin/episodes');
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadEpisodeData();
    
    // Limpiar episodio actual al desmontar
    return () => {
      clearCurrentEpisode();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ===== RENDER =====
  
  // Usar estados del contexto y locales
  if (loadingEpisode) {
    return (
      <AdminLayout
        title="Editar Episodio"
        subtitle="Cargando datos del episodio..."
        breadcrumbs={[
          { label: 'Episodios', to: '/admin/episodes' },
          { label: 'Editar' }
        ]}
      >
        <div className="episode-edit__loading">
          <div className="episode-edit__loading-spinner">⏳</div>
          <Typography variant="body" size="md" color="muted">Cargando información del episodio...</Typography>
        </div>
      </AdminLayout>
    );
  }

  // Usar estados del contexto y locales
  const errorToShow = contextError || localError;
  if (errorToShow && !currentEpisode) {
    return (
      <AdminLayout
        title="Error"
        subtitle="No se pudo cargar el episodio"
        breadcrumbs={[
          { label: 'Episodios', to: '/admin/episodes' },
          { label: 'Error' }
        ]}
      >
        <div className="episode-edit__error">
          <div className="episode-edit__error-icon">❌</div>
          <Typography variant="h2" size="lg" weight="semibold" color="danger">Error al cargar episodio</Typography>
          <Typography variant="body" size="md" color="muted">{errorToShow}</Typography>
          <Button onClick={() => navigate('/admin/episodes')} variant="primary">
            Volver a la lista
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const currentSeries = seriesData.find(s => s.id === currentEpisode?.serie_id);

  return (
    <AdminLayout
      title={`Editar: ${currentEpisode?.title || `T${currentEpisode?.season}E${currentEpisode?.episode_number}`}`}
      subtitle={`${currentSeries?.title || 'Serie'} • Temporada ${currentEpisode?.season} • Episodio ${currentEpisode?.episode_number}`}
      breadcrumbs={[
        { label: 'Episodios', to: '/admin/episodes' },
        { label: currentEpisode?.title || `T${currentEpisode?.season}E${currentEpisode?.episode_number}` }
      ]}
    >
      <div className="episode-edit">
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <Container variant="success" className="edit-notification">
            <div className="edit-notification__icon">✅</div>
            <div className="edit-notification__content">
              <Typography variant="h3" size="md" weight="semibold" color="success">¡Episodio actualizado exitosamente!</Typography>
              <Typography variant="body" size="md" color="muted">Los cambios se han guardado correctamente. Redirigiendo...</Typography>
            </div>
          </Container>
        )}

        {errorToShow && (
          <Container variant="danger" className="edit-notification">
            <div className="edit-notification__icon">⚠️</div>
            <div className="edit-notification__content">
              <Typography variant="h4" size="sm" weight="semibold" color="danger">Error al guardar</Typography>
              <Typography variant="body" size="md" color="muted">{errorToShow}</Typography>
            </div>
          </Container>
        )}

        {/* ===== LAYOUT PRINCIPAL DE 2 COLUMNAS ===== */}
        <div className="episode-edit__layout">
          
          {/* ===== COLUMNA IZQUIERDA - INFORMACIÓN ACTUAL ===== */}
          <div className="episode-edit__sidebar">
            
            {/* Panel de información */}
            <Container variant="neutral" size="lg" className="info-panel">
              <div className="info-panel__header">
                <Typography variant="h3" size="md" weight="semibold" className="info-panel__title">
                  📋 Información Actual
                </Typography>
                <Badge variant="primary" size="sm">
                  ID: {currentEpisode?.id}
                </Badge>
              </div>

              <Divider variant="neutral" size="sm" />

              {/* Detalles actuales */}
              <div className="info-panel__details">
                <Typography variant="h4" size="sm" weight="medium" className="info-panel__subtitle">Detalles</Typography>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Título:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{currentEpisode?.title}</Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Serie:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{currentSeries?.title || 'Sin serie'}</Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Temporada:</Typography>
                  <span className="info-detail__value">
                    {currentEpisode?.season ? (
                      <Badge variant="primary" size="sm">
                        T{currentEpisode.season}
                      </Badge>
                    ) : 'No cargado'}
                  </span>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Episodio:</Typography>
                  <span className="info-detail__value">
                    {currentEpisode?.episode_number ? (
                      <Badge variant="success" size="sm">
                        E{currentEpisode.episode_number}
                      </Badge>
                    ) : 'No cargado'}
                  </span>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Duración:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">
                    {currentEpisode?.duration ? `${currentEpisode.duration} min` : 'No disponible'}
                  </Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Fecha de Estreno:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">
                    {currentEpisode?.release_date ? new Date(currentEpisode.release_date).toLocaleDateString('es-ES') : 'No disponible'}
                  </Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Estado:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{currentEpisode?.status || 'Desconocido'}</Typography>
                </div>
              </div>
            </Container>

          </div>

          {/* ===== COLUMNA DERECHA - FORMULARIO DE EDICIÓN ===== */}
          <div className="episode-edit__main">
            <Container variant="neutral" size="xl" className="edit-form-container">
              <div className="edit-form-container__header">
                <Typography variant="h3" size="md" weight="semibold" className="edit-form-container__title">
                  ✏️ Editar Información
                </Typography>
                <Typography variant="body" size="md" color="muted" className="edit-form-container__subtitle">
                  Modifica los campos que necesites. Solo se enviarán los campos que cambies.
                </Typography>
              </div>

              <Divider variant="neutral" size="md" />

              {/* Formulario principal */}
              <div className="edit-form-container__form">
                {currentEpisode && (
                  <DynamicForm
                  id="episode-edit-form"
                  fields={getEditFormFields()}
                  initialData={{
                    title: currentEpisode?.title || '',
                    serieId: currentEpisode?.serie_id || '',
                    season: currentEpisode?.season || 1,
                    episodeNumber: currentEpisode?.episode_number || 1
                  }}
                  onSubmit={handleSubmit}
                  onChange={handleFormChange}
                  loading={editing}
                  disabled={editing || success}
                  columnsPerRow={2}
                  tabletColumns={1}
                  mobileColumns={1}
                  fieldSize="md"
                  fieldRounded="md"
                  submitText={editing ? 'Guardando...' : 'Guardar Cambios'}
                  submitVariant="primary"
                  submitSize="md"
                  submitIcon="save"
                  validateOnBlur={true}
                  validateOnChange={false}
                  actions={[
                    {
                      key: 'cancel',
                      type: 'button',
                      variant: 'outline',
                      text: 'Cancelar',
                      onClick: handleCancel,
                      disabled: editing
                    },
                    {
                      key: 'save',
                      type: 'submit',
                      variant: 'primary',
                      text: editing ? 'Guardando...' : 'Guardar Cambios',
                      loading: editing,
                      disabled: !hasChanges || editing,
                      leftIcon: 'save'
                    }
                  ]}
                    className={`episode-edit__form ${success ? 'episode-edit__form--success' : ''}`}
                  />
                )}
              </div>
            </Container>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export { EpisodeEditPage };