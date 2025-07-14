// ===== SERIES EDIT PAGE - SOLO CAMPOS PERMITIDOS =====
// src/Pages/Admin/Series/SeriesEditPage/SeriesEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../components/atoms/Card/Card';
import { ContentImage } from '../../../../components/atoms/ContentImage/ContentImage';
import './SeriesEditPage.css';

// Servicios
import { getSerieByIdService } from '../../../../services/Series/getSerieByIdService';
import { updateSeriesService } from '../../../../services/Series/updateSeriesService';
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';

/**
 * SeriesEditPage - Página de edición de series
 * 
 * ✅ CAMPOS EDITABLES: Solo portada, título, categoría y año
 * ✅ SISTEMA DE DISEÑO: Usa componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ VALIDACIONES: Según esquemas del backend
 */
function SeriesEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ===== ESTADOS =====
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [seriesData, setSeriesData] = useState(null);
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
        type: 'file',
        label: 'Portada (Imagen)',
        accept: 'image/*',
        required: false,
        leftIcon: '🖼️',
        helperText: 'Nueva imagen de portada (opcional). Formatos: JPG, PNG, WebP',
        text: 'Seleccionar nueva portada',
        width: 'full'
      }
    ];
  };

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * Cargar datos de la serie desde el backend
   */
  const loadSeriesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Cargando datos de la serie ID:', id);
      
      // Cargar serie y categorías en paralelo
      const [seriesResponse, categoriesResponse] = await Promise.all([
        getSerieByIdService(id),
        getCategoriesService()
      ]);
      
      console.log('📋 Respuesta serie:', seriesResponse);
      console.log('📂 Respuesta categorías:', categoriesResponse);
      
      // Manejar respuesta de la serie
      let seriesInfo = null;
      if (seriesResponse.success) {
        seriesInfo = seriesResponse.data;
      } else if (seriesResponse.id) {
        seriesInfo = seriesResponse; // Respuesta directa
      } else {
        throw new Error('Formato de respuesta inesperado del backend');
      }

      // Manejar respuesta de categorías
      let categoriesData = [];
      if (Array.isArray(categoriesResponse)) {
        categoriesData = categoriesResponse;
      } else if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
        categoriesData = categoriesResponse.data;
      }

      console.log('✅ Serie normalizada:', seriesInfo);
      console.log('✅ Categorías normalizadas:', categoriesData);
      
      // Configurar imagen preview actual
      if (seriesInfo.cover_image) {
        const currentImageUrl = `${import.meta.env.VITE_CDN_URL || 'http://localhost:8082'}/covers/${seriesInfo.cover_image}/cover.jpg`;
        setImagePreview(currentImageUrl);
      }
      
      setSeriesData(seriesInfo);
      setCategories(categoriesData);
      setInitialData({ 
        title: seriesInfo.title || '',
        categoryId: seriesInfo.category_id || '',
        releaseYear: seriesInfo.release_year || new Date().getFullYear(),
        // coverImage no se incluye en initialData porque es un archivo
      });
      
    } catch (error) {
      console.error('💥 Error cargando datos de la serie:', error);
      setError(error.message || 'Error al cargar datos de la serie');
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
      parseInt(formData.categoryId) !== initialData.categoryId ||
      parseInt(formData.releaseYear) !== initialData.releaseYear ||
      formData.coverImage // Si hay nueva imagen siempre es un cambio
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

      console.log('📤 Datos a actualizar:', updateData);

      const response = await updateSeriesService(id, updateData);

      console.log('📥 Respuesta del backend:', response);

      if (!response || (response.error && !response.success)) {
        throw new Error(response?.error || 'Error al actualizar serie');
      }

      // Éxito
      setSuccess(true);
      setHasChanges(false);
      
      console.log('✅ Serie actualizada exitosamente');

      // Recargar datos actualizados
      setTimeout(() => {
        loadSeriesData();
      }, 1000);

      // Redirigir después de un delay
      setTimeout(() => {
        navigate('/admin/series');
      }, 2500);

    } catch (err) {
      console.error('💥 Error actualizando serie:', err);
      setError(err.message || 'Error al actualizar serie');
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
    
    navigate('/admin/series');
  };

  // ===== EFECTOS =====
  useEffect(() => {
    if (id) {
      loadSeriesData();
    } else {
      setError('ID de serie no proporcionado');
      setLoading(false);
    }
  }, [id]);

  // ===== RENDER =====
  
  if (loading) {
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

  if (error && !seriesData) {
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
          <p>{error}</p>
          <Button onClick={() => navigate('/admin/series')} variant="primary">
            Volver a la lista
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Editar: ${seriesData?.title || 'Serie'}`}
      subtitle={`${seriesData?.release_year || ''} • ${categories.find(c => c.id === seriesData?.category_id)?.name || 'Sin categoría'}`}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Series', href: '/admin/series' },
        { label: seriesData?.title || 'Editar' }
      ]}
      headerActions={
        <div className="series-edit__header-actions">
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
            onClick={() => document.getElementById('series-edit-form')?.requestSubmit()}
            loading={saving}
            disabled={!hasChanges || saving}
            leftIcon="💾"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
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

        {error && (
          <div className="series-edit__error-message">
            <div className="series-edit__error-icon">⚠️</div>
            <div className="series-edit__error-content">
              <h4>Error al guardar</h4>
              <p>{error}</p>
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
                    <span className="series-edit__current-info-value">{seriesData?.id}</span>
                  </div>
                  <div className="series-edit__current-info-item">
                    <span className="series-edit__current-info-label">Título:</span>
                    <span className="series-edit__current-info-value">{seriesData?.title}</span>
                  </div>
                  <div className="series-edit__current-info-item">
                    <span className="series-edit__current-info-label">Categoría:</span>
                    <span className="series-edit__current-info-value">
                      {categories.find(c => c.id === seriesData?.category_id)?.name || 'Sin categoría'}
                    </span>
                  </div>
                  <div className="series-edit__current-info-item">
                    <span className="series-edit__current-info-label">Año:</span>
                    <span className="series-edit__current-info-value">{seriesData?.release_year}</span>
                  </div>
                </div>
                
                {/* Imagen actual */}
                <div className="series-edit__info-right">
                  <div className="series-edit__current-image">
                    <span className="series-edit__current-info-label">Portada Actual:</span>
                    {imagePreview ? (
                      <ContentImage
                        src={imagePreview}
                        alt={`Portada de ${seriesData?.title}`}
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
              {seriesData && (
                <DynamicForm
                  id="series-edit-form"
                  fields={getEditFormFields()}
                  initialData={{
                    title: seriesData.title || '',
                    categoryId: seriesData.category_id || '',
                    releaseYear: seriesData.release_year || new Date().getFullYear()
                    // coverImage no se incluye porque es un archivo
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