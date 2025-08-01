// ===== SERIES EDIT PAGE - USANDO CONTEXTO =====
// src/Pages/Admin/Series/SeriesEditPage/SeriesEditPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../components/atoms/Card/Card';
import { ContentImage } from '../../../../components/atoms/ContentImage/ContentImage';
import './SeriesEditPage.css';

// Contexto
import { useSeries } from '../../../../app/context/SeriesContext';

// Servicios (solo para categorías)
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';

/**
 * SeriesEditPage - Página de edición de series
 * 
 * ✅ CAMPOS EDITABLES: Solo portada, título, categoría y año
 * ✅ SISTEMA DE DISEÑO: Usa componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ VALIDACIONES: Según esquemas del backend
 * ✅ CONTEXTO: Usa SeriesContext para toda la lógica
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

  // ===== ESTADOS LOCALES =====
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

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
        leftIcon: '📺',
        helperText: 'Título principal que aparecerá en el catálogo',
        width: 'full'
      },
      {
        name: 'categoryId',
        type: 'select',
        label: 'Categoría',
        required: true,
        leftIcon: '📂',
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
        leftIcon: '📅',
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
      }
    ];
  };

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * Cargar datos de la serie desde el contexto
   */
  const loadSeriesData = useCallback(async () => {
    try {

      // Cargar serie y categorías en paralelo
      const [seriesResponse, categoriesResponse] = await Promise.all([
        loadSeriesById(id),
        getCategoriesService()
      ]);

      if (!seriesResponse.success) {
        throw new Error(seriesResponse.error || 'Error al cargar datos de la serie');
      }

      // Manejar respuesta de categorías
      let categoriesData = [];
      if (Array.isArray(categoriesResponse)) {
        categoriesData = categoriesResponse;
      } else if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
        categoriesData = categoriesResponse.data;
      }

      // Configurar imagen preview actual usando función del contexto
      if (currentSeries?.cover_image) {
        const currentImageUrl = getSeriesCoverUrl(currentSeries.cover_image);
        setImagePreview(currentImageUrl);
      }
      
      setCategories(categoriesData);
      setInitialData({ 
        title: currentSeries?.title || '',
        categoryId: currentSeries?.category_id || '',
        releaseYear: currentSeries?.release_year || new Date().getFullYear(),
        // coverImage no se incluye en initialData porque es un archivo
      });
      
    } catch {
      // Error silencioso al procesar datos iniciales
    }
  }, [currentSeries?.category_id, currentSeries?.cover_image, currentSeries?.release_year, currentSeries?.title, getSeriesCoverUrl, id, loadSeriesById]);

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
      setSuccess(false);

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

      // Si no hay cambios reales, no enviar
      if (Object.keys(updateData).length === 0) {
        alert('No hay cambios para guardar');
        return;
      }

      const response = await updateSeries(id, updateData);

      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar serie');
      }

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

    } catch {
      // Error manejado por el contexto
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
    if (id) {
      loadSeriesData();
    }
    
    // Limpiar al desmontar el componente
    return () => {
      clearCurrentSeries();
    };
  }, [clearCurrentSeries, id, loadSeriesData]);

  // Efecto para actualizar datos cuando se carga la serie desde el contexto
  useEffect(() => {
    if (currentSeries) {
      // Configurar imagen preview actual usando función del contexto
      if (currentSeries.cover_image) {
        const currentImageUrl = getSeriesCoverUrl(currentSeries.cover_image);
        setImagePreview(currentImageUrl);
      }
      
      setInitialData({ 
        title: currentSeries.title || '',
        categoryId: currentSeries.category_id || '',
        releaseYear: currentSeries.release_year || new Date().getFullYear(),
      });
    }
  }, [currentSeries, getSeriesCoverUrl]);

  // ===== RENDER =====
  
  if (loadingSeries) {
    return (
      <AdminLayout
        title="Editar Serie"
        subtitle="Cargando datos de la serie..."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Series', href: '/admin/series' },
          { label: 'Editar' }
        ]}
      >
        <div className="series-edit__loading">
          <div className="series-edit__loading-spinner">⏳</div>
          <p>Cargando información de la serie...</p>
        </div>
      </AdminLayout>
    );
  }

  if (contextError && !currentSeries) {
    return (
      <AdminLayout
        title="Error"
        subtitle="No se pudo cargar la serie"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Series', href: '/admin/series' },
          { label: 'Error' }
        ]}
      >
        <div className="series-edit__error">
          <div className="series-edit__error-icon">❌</div>
          <h2>Error al cargar serie</h2>
          <p>{contextError}</p>
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
        { label: 'Admin', href: '/admin' },
        { label: 'Series', href: '/admin/series' },
        { label: currentSeries?.title || 'Editar' }
      ]}
      headerActions={
        <div className="series-edit__header-actions">
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
            onClick={() => document.getElementById('series-edit-form')?.requestSubmit()}
            loading={editing}
            disabled={!hasChanges || editing}
            leftIcon="💾"
          >
            {editing ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      }
    >
      <div className="series-edit">
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <div className="series-edit__success">
            <div className="series-edit__success-icon">✅</div>
            <div className="series-edit__success-content">
              <h3>¡Serie actualizada exitosamente!</h3>
              <p>Los cambios se han guardado correctamente. Redirigiendo...</p>
            </div>
          </div>
        )}

        {contextError && (
          <div className="series-edit__error-message">
            <div className="series-edit__error-icon">⚠️</div>
            <div className="series-edit__error-content">
              <h4>Error al guardar</h4>
              <p>{contextError}</p>
            </div>
          </div>
        )}

        {/* ===== INFORMACIÓN ACTUAL ===== */}
        <div className="series-edit__current-info">
          <Card>
            <CardHeader>
              <CardTitle>📋 Información Actual de la Serie</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="series-edit__info-grid">
                <div className="series-edit__info-left">
                  <div className="series-edit__current-info-item">
                    <span className="series-edit__current-info-label">ID:</span>
                    <span className="series-edit__current-info-value">{currentSeries?.id}</span>
                  </div>
                  <div className="series-edit__current-info-item">
                    <span className="series-edit__current-info-label">Título:</span>
                    <span className="series-edit__current-info-value">{currentSeries?.title}</span>
                  </div>
                  <div className="series-edit__current-info-item">
                    <span className="series-edit__current-info-label">Categoría:</span>
                    <span className="series-edit__current-info-value">
                      {categories.find(c => c.id === currentSeries?.category_id)?.name || 'Sin categoría'}
                    </span>
                  </div>
                  <div className="series-edit__current-info-item">
                    <span className="series-edit__current-info-label">Año:</span>
                    <span className="series-edit__current-info-value">{currentSeries?.release_year}</span>
                  </div>
                </div>
                
                {/* Imagen actual */}
                <div className="series-edit__info-right">
                  <div className="series-edit__current-image">
                    <span className="series-edit__current-info-label">Portada Actual:</span>
                    {imagePreview ? (
                      <ContentImage
                        src={imagePreview}
                        alt={`Portada de ${currentSeries?.title}`}
                        aspectRatio="2/3"
                        contentType="series"
                        placeholder="📺"
                        rounded="md"
                        showFallback={true}
                        style={{ maxWidth: '120px' }}
                      />
                    ) : (
                      <div className="series-edit__no-image">
                        <span>📺</span>
                        <p>Sin imagen</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ===== FORMULARIO DE EDICIÓN ===== */}
        <div className="series-edit__form-container">
          <Card>
            <CardHeader>
              <CardTitle>Editar Información</CardTitle>
              <p>Modifica los campos que necesites. Solo se enviarán los campos que cambies.</p>
            </CardHeader>
            <CardBody>
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
                  className={`series-edit__form ${success ? 'series-edit__form--success' : ''}`}
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export { SeriesEditPage };