// ===== EPISODE EDIT PAGE - SOLO CAMPOS PERMITIDOS =====
// src/Pages/Admin/Episodes/EpisodeEditPage/EpisodeEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../components/atoms/Card/Card';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import './EpisodeEditPage.css';

// Servicios
import { getEpisodeByIdService } from '../../../../services/Episodes/getEpisodeByIdService';
import { updateEpisodeService } from '../../../../services/Episodes/updateEpisodeService';
import { getSeriesService } from '../../../../services/Series/getSeriesService';

/**
 * EpisodeEditPage - Página de edición de episodios
 * 
 * ✅ CAMPOS EDITABLES: título, serie, temporada y número de episodio
 * ✅ SISTEMA DE DISEÑO: Usa componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ VALIDACIONES: Según esquemas del backend
 */
function EpisodeEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ===== ESTADOS =====
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [episodeData, setEpisodeData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [series, setSeries] = useState([]);

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
        options: series.map(serie => ({
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
   * Cargar datos del episodio desde el backend
   */
  const loadEpisodeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Cargando datos del episodio ID:', id);
      
      // Cargar episodio y series en paralelo
      const [episodeResponse, seriesResponse] = await Promise.all([
        getEpisodeByIdService(id),
        getSeriesService()
      ]);
      
      console.log('📋 Respuesta episodio:', episodeResponse);
      console.log('📂 Respuesta series:', seriesResponse);
      
      // Manejar respuesta del episodio
      let episodeInfo = null;
      if (episodeResponse.success) {
        episodeInfo = episodeResponse.data;
      } else if (episodeResponse.id) {
        episodeInfo = episodeResponse; // Respuesta directa
      } else {
        throw new Error('Formato de respuesta inesperado del backend');
      }

      // Manejar respuesta de series
      let seriesData = [];
      if (Array.isArray(seriesResponse)) {
        seriesData = seriesResponse;
      } else if (seriesResponse.success && Array.isArray(seriesResponse.data)) {
        seriesData = seriesResponse.data;
      }

      console.log('✅ Episodio normalizado:', episodeInfo);
      console.log('✅ Series normalizadas:', seriesData);
      
      setEpisodeData(episodeInfo);
      setSeries(seriesData);
      setInitialData({ 
        title: episodeInfo.title || '',
        serieId: episodeInfo.serie_id || '',
        season: episodeInfo.season || 1,
        episodeNumber: episodeInfo.episode_number || 1,
      });
      
    } catch (error) {
      console.error('💥 Error cargando datos del episodio:', error);
      setError(error.message || 'Error al cargar datos del episodio');
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNCIONES DE MANEJO =====
  
  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    console.log('📝 Cambios en formulario:', formData);
    
    // Verificar si hay cambios comparando con datos iniciales
    const hasRealChanges = initialData && (
      formData.title !== initialData.title ||
      parseInt(formData.serieId) !== initialData.serieId ||
      parseInt(formData.season) !== initialData.season ||
      parseInt(formData.episodeNumber) !== initialData.episodeNumber
    );
    
    setHasChanges(hasRealChanges);
    console.log('🔄 ¿Hay cambios?', hasRealChanges);
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError(null);

      console.log('📤 Enviando actualización:', formData);

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

      console.log('📤 Datos a actualizar:', updateData);

      const response = await updateEpisodeService(id, updateData);

      console.log('📥 Respuesta del backend:', response);

      if (!response || (response.error && !response.success)) {
        throw new Error(response?.error || 'Error al actualizar episodio');
      }

      // Éxito
      setSuccess(true);
      setHasChanges(false);
      
      console.log('✅ Episodio actualizado exitosamente');

      // Recargar datos actualizados
      setTimeout(() => {
        loadEpisodeData();
      }, 1000);

      // Redirigir después de un delay
      setTimeout(() => {
        navigate('/admin/episodes');
      }, 2500);

    } catch (err) {
      console.error('💥 Error actualizando episodio:', err);
      setError(err.message || 'Error al actualizar episodio');
    } finally {
      setSaving(false);
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
    } else {
      setError('ID de episodio no proporcionado');
      setLoading(false);
    }
  }, [id]);

  // ===== RENDER =====
  
  if (loading) {
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

  if (error && !episodeData) {
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

  const currentSeries = series.find(s => s.id === episodeData?.serie_id);

  return (
    <AdminLayout
      title={`Editar: ${episodeData?.title || `T${episodeData?.season}E${episodeData?.episode_number}`}`}
      subtitle={`${currentSeries?.title || 'Serie'} • Temporada ${episodeData?.season} • Episodio ${episodeData?.episode_number}`}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Episodios', href: '/admin/episodes' },
        { label: episodeData?.title || 'Editar' }
      ]}
      headerActions={
        <div className="episode-edit__header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => document.getElementById('episode-edit-form')?.requestSubmit()}
            loading={saving}
            disabled={!hasChanges || saving}
            leftIcon="💾"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
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
                  <span className="episode-edit__current-info-value">{episodeData?.id}</span>
                </div>
                <div className="episode-edit__current-info-item">
                  <span className="episode-edit__current-info-label">Título:</span>
                  <span className="episode-edit__current-info-value">{episodeData?.title}</span>
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
                      T{episodeData?.season}
                    </Badge>
                  </span>
                </div>
                <div className="episode-edit__current-info-item">
                  <span className="episode-edit__current-info-label">Episodio:</span>
                  <span className="episode-edit__current-info-value">
                    <Badge variant="success" size="sm" style="soft">
                      E{episodeData?.episode_number}
                    </Badge>
                  </span>
                </div>
                <div className="episode-edit__current-info-item">
                  <span className="episode-edit__current-info-label">Duración:</span>
                  <span className="episode-edit__current-info-value">
                    {episodeData?.duration ? `${episodeData.duration} min` : 'No disponible'}
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
              {episodeData && (
                <DynamicForm
                  id="episode-edit-form"
                  fields={getEditFormFields()}
                  initialData={{
                    title: episodeData.title || '',
                    serieId: episodeData.serie_id || '',
                    season: episodeData.season || 1,
                    episodeNumber: episodeData.episode_number || 1
                  }}
                  onSubmit={handleSubmit}
                  onChange={handleFormChange}
                  loading={saving}
                  disabled={saving || success}
                  columnsPerRow={2}
                  tabletColumns={1}
                  mobileColumns={1}
                  fieldSize="md"
                  fieldRounded="md"
                  submitText={saving ? 'Guardando...' : 'Guardar Cambios'}
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
                      disabled: saving
                    },
                    {
                      key: 'save',
                      type: 'submit',
                      variant: 'primary',
                      text: saving ? 'Guardando...' : 'Guardar Cambios',
                      loading: saving,
                      disabled: !hasChanges || saving,
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