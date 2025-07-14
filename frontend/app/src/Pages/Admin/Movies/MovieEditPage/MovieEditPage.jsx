// ===== MOVIE EDIT PAGE - SOLO CAMPOS PERMITIDOS =====
// src/Pages/Admin/Movies/MovieEditPage/MovieEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { Card, CardHeader, CardBody, CardTitle } from '../../../../components/atoms/Card/Card';
import { ContentImage } from '../../../../components/atoms/ContentImage/ContentImage';
import './MovieEditPage.css';

// Servicios
import { getMovieByIdService } from '../../../../services/Movies/getMovieByIdService';
import { updateMovieService } from '../../../../services/Movies/updateMovieService';
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';

/**
 * MovieEditPage - Página de edición de películas
 * 
 * ✅ CAMPOS EDITABLES: Solo portada, título, categoría y año
 * ✅ SISTEMA DE DISEÑO: Usa componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ VALIDACIONES: Según esquemas del backend
 */
function MovieEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ===== ESTADOS =====
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [movieData, setMovieData] = useState(null);
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
        label: 'Título de la Película',
        placeholder: 'Ej: Avengers: Endgame',
        required: true,
        leftIcon: '🎬',
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
        placeholder: 'Ej: 2019',
        required: true,
        leftIcon: '📅',
        helperText: 'Año en que se estrenó la película',
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
   * Cargar datos de la película desde el backend
   */
  const loadMovieData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Cargando datos de la película ID:', id);
      
      // Cargar película y categorías en paralelo
      const [movieResponse, categoriesResponse] = await Promise.all([
        getMovieByIdService(id),
        getCategoriesService()
      ]);
      
      console.log('📋 Respuesta película:', movieResponse);
      console.log('📂 Respuesta categorías:', categoriesResponse);
      
      // Manejar respuesta de la película
      let movieInfo = null;
      if (movieResponse.success) {
        movieInfo = movieResponse.data;
      } else if (movieResponse.id) {
        movieInfo = movieResponse; // Respuesta directa
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

      console.log('✅ Película normalizada:', movieInfo);
      console.log('✅ Categorías normalizadas:', categoriesData);
      
      // Configurar imagen preview actual
      if (movieInfo.cover_image) {
        const currentImageUrl = `${import.meta.env.VITE_CDN_URL || 'http://localhost:8082'}/covers/${movieInfo.cover_image}/cover.jpg`;
        setImagePreview(currentImageUrl);
      }
      
      setMovieData(movieInfo);
      setCategories(categoriesData);
      setInitialData({ 
        title: movieInfo.title || '',
        categoryId: movieInfo.category_id || '',
        releaseYear: movieInfo.release_year || new Date().getFullYear(),
        // coverImage no se incluye en initialData porque es un archivo
      });
      
    } catch (error) {
      console.error('💥 Error cargando datos de la película:', error);
      setError(error.message || 'Error al cargar datos de la película');
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

      const response = await updateMovieService(id, updateData);

      console.log('📥 Respuesta del backend:', response);

      if (!response || (response.error && !response.success)) {
        throw new Error(response?.error || 'Error al actualizar película');
      }

      // Éxito
      setSuccess(true);
      setHasChanges(false);
      
      console.log('✅ Película actualizada exitosamente');

      // Recargar datos actualizados
      setTimeout(() => {
        loadMovieData();
      }, 1000);

      // Redirigir después de un delay
      setTimeout(() => {
        navigate('/admin/movies');
      }, 2500);

    } catch (err) {
      console.error('💥 Error actualizando película:', err);
      setError(err.message || 'Error al actualizar película');
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
    
    navigate('/admin/movies');
  };

  // ===== EFECTOS =====
  useEffect(() => {
    if (id) {
      loadMovieData();
    } else {
      setError('ID de película no proporcionado');
      setLoading(false);
    }
  }, [id]);

  // ===== RENDER =====
  
  if (loading) {
    return (
      <AdminLayout
        title="Editar Película"
        subtitle="Cargando datos de la película..."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Películas', href: '/admin/movies' },
          { label: 'Editar' }
        ]}
      >
        <div className="movie-edit__loading">
          <div className="movie-edit__loading-spinner">⏳</div>
          <p>Cargando información de la película...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !movieData) {
    return (
      <AdminLayout
        title="Error"
        subtitle="No se pudo cargar la película"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Películas', href: '/admin/movies' },
          { label: 'Error' }
        ]}
      >
        <div className="movie-edit__error">
          <div className="movie-edit__error-icon">❌</div>
          <h2>Error al cargar película</h2>
          <p>{error}</p>
          <Button onClick={() => navigate('/admin/movies')} variant="primary">
            Volver a la lista
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Editar: ${movieData?.title || 'Película'}`}
      subtitle={`${movieData?.release_year || ''} • ${categories.find(c => c.id === movieData?.category_id)?.name || 'Sin categoría'}`}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Películas', href: '/admin/movies' },
        { label: movieData?.title || 'Editar' }
      ]}
      headerActions={
        <div className="movie-edit__header-actions">
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
            onClick={() => document.getElementById('movie-edit-form')?.requestSubmit()}
            loading={saving}
            disabled={!hasChanges || saving}
            leftIcon="💾"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      }
    >
      <div className="movie-edit">
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <div className="movie-edit__success">
            <div className="movie-edit__success-icon">✅</div>
            <div className="movie-edit__success-content">
              <h3>¡Película actualizada exitosamente!</h3>
              <p>Los cambios se han guardado correctamente. Redirigiendo...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="movie-edit__error-message">
            <div className="movie-edit__error-icon">⚠️</div>
            <div className="movie-edit__error-content">
              <h4>Error al guardar</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* ===== INFORMACIÓN ACTUAL ===== */}
        <div className="movie-edit__current-info">
          <Card>
            <CardHeader>
              <CardTitle>📋 Información Actual de la Película</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="movie-edit__info-grid">
                <div className="movie-edit__info-left">
                  <div className="movie-edit__current-info-item">
                    <span className="movie-edit__current-info-label">ID:</span>
                    <span className="movie-edit__current-info-value">{movieData?.id}</span>
                  </div>
                  <div className="movie-edit__current-info-item">
                    <span className="movie-edit__current-info-label">Título:</span>
                    <span className="movie-edit__current-info-value">{movieData?.title}</span>
                  </div>
                  <div className="movie-edit__current-info-item">
                    <span className="movie-edit__current-info-label">Categoría:</span>
                    <span className="movie-edit__current-info-value">
                      {categories.find(c => c.id === movieData?.category_id)?.name || 'Sin categoría'}
                    </span>
                  </div>
                  <div className="movie-edit__current-info-item">
                    <span className="movie-edit__current-info-label">Año:</span>
                    <span className="movie-edit__current-info-value">{movieData?.release_year}</span>
                  </div>
                </div>
                
                {/* Imagen actual */}
                <div className="movie-edit__info-right">
                  <div className="movie-edit__current-image">
                    <span className="movie-edit__current-info-label">Portada Actual:</span>
                    {imagePreview ? (
                      <ContentImage
                        src={imagePreview}
                        alt={`Portada de ${movieData?.title}`}
                        aspectRatio="2/3"
                        contentType="movie"
                        placeholder="🎬"
                        rounded="md"
                        showFallback={true}
                        style={{ maxWidth: '120px' }}
                      />
                    ) : (
                      <div className="movie-edit__no-image">
                        <span>🎬</span>
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
        <div className="movie-edit__form-container">
          <Card>
            <CardHeader>
              <CardTitle>Editar Información</CardTitle>
              <p>Modifica los campos que necesites. Solo se enviarán los campos que cambies.</p>
            </CardHeader>
            <CardBody>
              {movieData && (
                <DynamicForm
                  id="movie-edit-form"
                  fields={getEditFormFields()}
                  initialData={{
                    title: movieData.title || '',
                    categoryId: movieData.category_id || '',
                    releaseYear: movieData.release_year || new Date().getFullYear()
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
                  className={`movie-edit__form ${success ? 'movie-edit__form--success' : ''}`}
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export { MovieEditPage };