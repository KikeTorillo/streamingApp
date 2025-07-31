// ===== EPISODE EDIT PAGE - CON EPISODES CONTEXT =====
// src/Pages/Admin/Episodes/EpisodeEditPage/EpisodeEditPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../components/atoms/Card/Card';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import './EpisodeEditPage.css';

// Context
import { useEpisodes } from '../../../../app/context/EpisodesContext';

/**
 * EpisodeEditPage - CON EPISODES CONTEXT
 * 
 * ✅ CONTEXT CENTRALIZADO: Usa EpisodesContext para toda la lógica
 * ✅ CONSISTENCIA TOTAL: Mismo patrón que Movies/Series EditPage
 * ✅ CAMPOS EDITABLES: título, serie, temporada y número de episodio  
 * ✅ SISTEMA DE DISEÑO: Usa componentes con stories de Storybook
 * ✅ ESTADOS COMPARTIDOS: Loading, error, editing desde el contexto
 * ✅ FUNCIONES CENTRALIZADAS: loadEpisodeById, updateEpisode del contexto
 */
function EpisodeEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ===== ESTADOS LOCALES =====
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);

  // ===== CONTEXT =====
  const {
    // Estados principales
    currentEpisode,
    loadingEpisode,
    editing,
    error,
    
    // Estados de series
    seriesData,
    
    // Funciones
    loadSeries,
    loadEpisodeById,
    updateEpisode,
    clearCurrentEpisode
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
        leftIcon: '📺',
        helperText: 'Título del episodio que aparecerá en el catálogo',
        width: 'full'
      },
      {
        name: 'serieId',
        type: 'select',
        label: 'Serie',
        required: true,
        leftIcon: '📺',
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
        leftIcon: '📺',
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
        leftIcon: '#️⃣',
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
    try {

      // Cargar episodio y series usando el contexto
      const [episodeResult] = await Promise.all([
        loadEpisodeById(id),
        loadSeries()
      ]);
      
      if (episodeResult.success && episodeResult.data) {
        const episodeInfo = episodeResult.data;

        setInitialData({ 
          title: episodeInfo.title || '',
          serieId: episodeInfo.serie_id || '',
          season: episodeInfo.season || 1,
          episodeNumber: episodeInfo.episode_number || 1,
        });
      } else {

      }
      
    } catch (error) {

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

      // Si no hay cambios reales, no enviar
      if (Object.keys(updateData).length === 0) {
        alert('No hay cambios para guardar');
        return;
      }

      // Usar updateEpisode del contexto
      const result = await updateEpisode(id, updateData);

      if (result.success) {

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

      }

    } catch (err) {

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
    if (id) {
      loadEpisodeData();
    }
    
    // Limpiar episodio actual al desmontar
    return () => {
      clearCurrentEpisode();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ===== RENDER =====
  
  if (loadingEpisode) {
    return (
      <AdminLayout
        title="Editar Episodio"
        subtitle="Cargando datos del episodio..."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Episodios', href: '/admin/episodes' },
          { label: 'Editar' }
        ]}
      >
        <div className="episode-edit__loading">
          <div className="episode-edit__loading-spinner">⏳</div>
          <p>Cargando información del episodio...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !currentEpisode) {
    return (
      <AdminLayout
        title="Error"
        subtitle="No se pudo cargar el episodio"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Episodios', href: '/admin/episodes' },
          { label: 'Error' }
        ]}
      >
        <div className="episode-edit__error">
          <div className="episode-edit__error-icon">❌</div>
          <h2>Error al cargar episodio</h2>
          <p>{error}</p>
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
        { label: 'Admin', href: '/admin' },
        { label: 'Episodios', href: '/admin/episodes' },
        { label: currentEpisode?.title || 'Editar' }
      ]}
      headerActions={
        <div className="episode-edit__header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={editing}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => document.getElementById('episode-edit-form')?.requestSubmit()}
            loading={editing}
            disabled={!hasChanges || editing}
            leftIcon="💾"
          >
            {editing ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      }
    >
      <div className="episode-edit">
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <div className="episode-edit__success">
            <div className="episode-edit__success-icon">✅</div>
            <div className="episode-edit__success-content">
              <h3>¡Episodio actualizado exitosamente!</h3>
              <p>Los cambios se han guardado correctamente. Redirigiendo...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="episode-edit__error-message">
            <div className="episode-edit__error-icon">⚠️</div>
            <div className="episode-edit__error-content">
              <h4>Error al guardar</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* ===== INFORMACIÓN ACTUAL ===== */}
        <div className="episode-edit__current-info">
          <Card>
            <CardHeader>
              <CardTitle>📋 Información Actual del Episodio</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="episode-edit__info-grid">
                <div className="episode-edit__current-info-item">
                  <span className="episode-edit__current-info-label">ID:</span>
                  <span className="episode-edit__current-info-value">{currentEpisode?.id}</span>
                </div>
                <div className="episode-edit__current-info-item">
                  <span className="episode-edit__current-info-label">Título:</span>
                  <span className="episode-edit__current-info-value">{currentEpisode?.title}</span>
                </div>
                <div className="episode-edit__current-info-item">
                  <span className="episode-edit__current-info-label">Serie:</span>
                  <span className="episode-edit__current-info-value">
                    {currentSeries?.title || 'Sin serie'}
                  </span>
                </div>
                <div className="episode-edit__current-info-item">
                  <span className="episode-edit__current-info-label">Temporada:</span>
                  <span className="episode-edit__current-info-value">
                    <Badge variant="info" size="sm" style="soft">
                      T{currentEpisode?.season}
                    </Badge>
                  </span>
                </div>
                <div className="episode-edit__current-info-item">
                  <span className="episode-edit__current-info-label">Episodio:</span>
                  <span className="episode-edit__current-info-value">
                    <Badge variant="success" size="sm" style="soft">
                      E{currentEpisode?.episode_number}
                    </Badge>
                  </span>
                </div>
                <div className="episode-edit__current-info-item">
                  <span className="episode-edit__current-info-label">Duración:</span>
                  <span className="episode-edit__current-info-value">
                    {currentEpisode?.duration ? `${currentEpisode.duration} min` : 'No disponible'}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ===== FORMULARIO DE EDICIÓN ===== */}
        <div className="episode-edit__form-container">
          <Card>
            <CardHeader>
              <CardTitle>Editar Información</CardTitle>
              <p>Modifica los campos que necesites. Solo se enviarán los campos que cambies.</p>
            </CardHeader>
            <CardBody>
              {currentEpisode && (
                <DynamicForm
                  id="episode-edit-form"
                  fields={getEditFormFields()}
                  initialData={{
                    title: currentEpisode.title || '',
                    serieId: currentEpisode.serie_id || '',
                    season: currentEpisode.season || 1,
                    episodeNumber: currentEpisode.episode_number || 1
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
                  submitIcon="💾"
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
                      leftIcon: '💾'
                    }
                  ]}
                  className={`episode-edit__form ${success ? 'episode-edit__form--success' : ''}`}
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export { EpisodeEditPage };