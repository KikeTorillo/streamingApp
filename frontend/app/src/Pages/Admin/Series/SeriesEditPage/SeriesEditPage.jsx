// ===== SERIES EDIT PAGE - HOMOLOGADA CON LAYOUT DE 2 COLUMNAS =====
// src/Pages/Admin/Series/SeriesEditPage/SeriesEditPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { Container } from '../../../../components/atoms/Container/Container';
import { Divider } from '../../../../components/atoms/Divider/Divider';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { ContentImage } from '../../../../components/atoms/ContentImage/ContentImage';
import { Typography } from '../../../../components/atoms/Typography/Typography';

// Contexto
import { useSeries } from '../../../../app/context/SeriesContext';

// Hooks
import { useCategories } from '../../../../hooks/useCategories';

/**
 * SeriesEditPage - HOMOLOGADA CON PATRÓN DE 2 COLUMNAS
 * 
 * ✅ HOMOLOGACIÓN: Layout moderno de 2 columnas como MovieEditPage/UserEditPage
 * ✅ CONSISTENCIA: Usa mismos componentes del sistema de diseño
 * ✅ SIMPLIFICIDAD: Lógica centralizada en SeriesContext
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ VALIDACIONES: Según esquemas del backend
 */
function SeriesEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ===== CONTEXTO DE SERIES =====
  const {
    currentSeries,
    loadingSeries,
    editing,
    error: contextError,
    loadSeriesById,
    updateSeries,
    clearCurrentSeries,
    getSeriesCoverUrl
  } = useSeries();

  // ===== HOOKS =====
  const { categories, loading: categoriesLoading } = useCategories();

  // ===== ESTADOS LOCALES =====
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError] = useState(null);

  // ===== CONFIGURACIÓN DEL FORMULARIO =====
  
  /**
   * Campos de edición - Solo campos permitidos para actualización
   * PERMITIDOS: title, categoryId, releaseYear, coverImage (portada)
   */
  const getEditFormFields = () => {
    return [
      {
        name: 'title',
        type: 'text',
        label: 'Título de la Serie',
        placeholder: 'Ej: Breaking Bad',
        required: true,
        leftIcon: 'film',
        helperText: 'Título principal que aparecerá en el catálogo',
        width: 'full'
      },
      {
        name: 'categoryId',
        type: 'select',
        label: 'Categoría',
        required: true,
        leftIcon: 'folder',
        helperText: 'Selecciona la categoría que mejor describa el contenido',
        options: categories.map(cat => ({
          value: cat.id,
          label: cat.name
        })),
        width: 'half'
      },
      {
        name: 'releaseYear',
        type: 'number',
        label: 'Año de Estreno',
        placeholder: 'Ej: 2008',
        required: true,
        leftIcon: 'calendar',
        helperText: 'Año en que se estrenó la serie',
        width: 'half'
      },
      {
        name: 'coverImage',
        type: 'image-crop',
        label: 'Portada (Imagen)',
        aspect: 2/3,
        maxFileSize: '5MB',
        showPreview: true,
        previewDimensions: { width: 120, height: 180 },
        helperText: 'Sube una imagen para recortar como portada (formato póster 2:3)'
      },
    ];
  };

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * Cargar datos de la serie desde el contexto
   */
  const loadSeriesData = useCallback(async () => {
    if (!id) {
      setLocalError('ID de serie no proporcionado');
      return;
    }

    try {
      setLocalError(null);

      // Cargar serie usando el contexto
      const result = await loadSeriesById(id);
      
      if (result.success) {
        const seriesInfo = result.data;

        // Configurar imagen preview actual usando función del contexto
        if (seriesInfo.cover_image) {
          const currentImageUrl = getSeriesCoverUrl(seriesInfo.cover_image);
          setImagePreview(currentImageUrl);
        }
        
        setInitialData({ 
          title: seriesInfo.title || '',
          categoryId: seriesInfo.category_id || '',
          releaseYear: seriesInfo.release_year || new Date().getFullYear(),
          // coverImage no se incluye en initialData porque es un archivo
        });
        
      } else {
        setLocalError(result.error || 'Error al cargar datos de la serie');
      }
      
    } catch (error) {
      setLocalError(error.message || 'Error al cargar datos de la serie');
    }
  }, [id, loadSeriesById, getSeriesCoverUrl]);

  // ===== FUNCIONES DE MANEJO =====
  
  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {

    // Verificar si hay cambios comparando con datos iniciales
    const hasRealChanges = initialData && (
      formData.title !== initialData.title ||
      parseInt(formData.categoryId) !== initialData.categoryId ||
      parseInt(formData.releaseYear) !== initialData.releaseYear ||
      formData.coverImage // Si hay nueva imagen siempre es un cambio
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
      
      if (parseInt(formData.categoryId) !== initialData.categoryId) {
        updateData.categoryId = parseInt(formData.categoryId);
      }
      
      if (parseInt(formData.releaseYear) !== initialData.releaseYear) {
        updateData.releaseYear = parseInt(formData.releaseYear);
      }

      if (formData.coverImage && formData.coverImage instanceof File) {
        updateData.coverImage = formData.coverImage;
      }

      // Usar updateSeries del contexto
      const result = await updateSeries(id, updateData);

      if (result.success) {

        // Éxito
        setSuccess(true);
        setHasChanges(false);

        // Recargar datos actualizados
        setTimeout(() => {
          loadSeriesData();
        }, 1000);

        // Redirigir después de un delay
        setTimeout(() => {
          navigate('/admin/series');
        }, 2500);
        
      } else {

        if (result.error === 'No hay cambios para guardar') {
          alert('No hay cambios para guardar');
        } else {
          setLocalError(result.error || 'Error al actualizar serie');
        }
      }

    } catch (err) {

      setLocalError(err.message || 'Error al actualizar serie');
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
    
    navigate('/admin/series');
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadSeriesData();
    
    // Limpiar al desmontar el componente
    return () => {
      clearCurrentSeries();
    };
  }, [loadSeriesData, clearCurrentSeries]);

  // ===== RENDER =====
  
  // Usar estados del contexto y locales
  if (loadingSeries || categoriesLoading) {
    return (
      <AdminLayout
        title="Editar Serie"
        subtitle="Cargando datos de la serie..."
        breadcrumbs={[
          { label: 'Series', to: '/admin/series' },
          { label: 'Editar' }
        ]}
      >
        <div className="series-edit__loading">
          <div className="series-edit__loading-spinner">⏳</div>
          <Typography variant="body" size="md" color="muted">Cargando información de la serie...</Typography>
        </div>
      </AdminLayout>
    );
  }

  // Usar estados del contexto y locales
  const errorToShow = contextError || localError;
  if (errorToShow && !currentSeries) {
    return (
      <AdminLayout
        title="Error"
        subtitle="No se pudo cargar la serie"
        breadcrumbs={[
          { label: 'Series', to: '/admin/series' },
          { label: 'Error' }
        ]}
      >
        <div className="series-edit__error">
          <div className="series-edit__error-icon">❌</div>
          <Typography variant="h2" size="lg" weight="semibold" color="danger">Error al cargar serie</Typography>
          <Typography variant="body" size="md" color="muted">{errorToShow}</Typography>
          <Button onClick={() => navigate('/admin/series')} variant="primary">
            Volver a la lista
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Editar: ${currentSeries?.title || 'Serie'}`}
      subtitle={`${currentSeries?.release_year || ''} • ${categories.find(c => c.id === currentSeries?.category_id)?.name || 'Sin categoría'}`}
      breadcrumbs={[
        { label: 'Series', to: '/admin/series' },
        { label: currentSeries?.title || 'Editar' }
      ]}
    >
      <div className="series-edit">
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <Container variant="success" className="edit-notification">
            <div className="edit-notification__icon">✅</div>
            <div className="edit-notification__content">
              <Typography variant="h3" size="md" weight="semibold" color="success">¡Serie actualizada exitosamente!</Typography>
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
        <div className="series-edit__layout">
          
          {/* ===== COLUMNA IZQUIERDA - INFORMACIÓN ACTUAL ===== */}
          <div className="series-edit__sidebar">
            
            {/* Panel de información */}
            <Container variant="neutral" size="lg" className="info-panel">
              <div className="info-panel__header">
                <Typography variant="h3" size="md" weight="semibold" className="info-panel__title">
                  📋 Información Actual
                </Typography>
                <Badge variant="primary" size="sm">
                  ID: {currentSeries?.id}
                </Badge>
              </div>
              
              <Divider variant="neutral" size="sm" />
              
              {/* Portada actual */}
              <div className="info-panel__cover">
                <Typography variant="h4" size="sm" weight="medium" className="info-panel__subtitle">Portada</Typography>
                {imagePreview ? (
                  <ContentImage
                    src={imagePreview}
                    alt={`Portada de ${currentSeries?.title}`}
                    aspectRatio="2/3"
                    contentType="series"
                    placeholder="📺"
                    rounded="md"
                    showFallback={true}
                    size="md"
                  />
                ) : (
                  <div className="info-panel__no-image">
                    <span className="info-panel__no-image-icon">📺</span>
                    <Typography variant="span" size="sm" weight="normal" color="muted" className="info-panel__no-image-text">Sin portada</Typography>
                  </div>
                )}
              </div>

              <Divider variant="neutral" size="sm" />

              {/* Detalles actuales */}
              <div className="info-panel__details">
                <Typography variant="h4" size="sm" weight="medium" className="info-panel__subtitle">Detalles</Typography>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Título:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{currentSeries?.title}</Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Categoría:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">
                    {categories.find(c => c.id === currentSeries?.category_id)?.name || 'Sin categoría'}
                  </Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Año:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{currentSeries?.release_year}</Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Temporadas:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{currentSeries?.total_seasons || 0}</Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Episodios:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{currentSeries?.total_episodes || 0}</Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Estado:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{currentSeries?.status || 'Desconocido'}</Typography>
                </div>
              </div>
            </Container>

          </div>

          {/* ===== COLUMNA DERECHA - FORMULARIO DE EDICIÓN ===== */}
          <div className="series-edit__main">
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
                {currentSeries && (
                  <DynamicForm
                  id="series-edit-form"
                  fields={getEditFormFields()}
                  initialData={{
                    title: currentSeries.title || '',
                    categoryId: currentSeries.category_id || '',
                    releaseYear: currentSeries.release_year || new Date().getFullYear()
                    // coverImage no se incluye porque es un archivo
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
                      variant: 'secondary',
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
                    className={`series-edit__form ${success ? 'series-edit__form--success' : ''}`}
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

export { SeriesEditPage };