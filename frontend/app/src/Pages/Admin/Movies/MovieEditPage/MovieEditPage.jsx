// ===== MOVIE EDIT PAGE - SOLO CAMPOS PERMITIDOS =====
// src/Pages/Admin/Movies/MovieEditPage/MovieEditPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { Container } from '../../../../components/atoms/Container/Container';
import { Divider } from '../../../../components/atoms/Divider/Divider';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { Image } from '../../../../components/atoms/Image/Image';
import { Typography } from '../../../../components/atoms/Typography/Typography';
// Hooks y contextos
import { useMovies } from '../../../../app/context/MoviesContext';
import { useCategories } from '../../../../hooks/useCategories';

/**
 * MovieEditPage - VERSIÓN REFACTORIZADA CON MOVIESCONTEXT
 * 
 * ✅ REFACTORIZACIÓN: Toda la lógica migrada a MoviesContext
 * ✅ SIMPLICIDAD: Solo maneja UI y navegación
 * ✅ CONSISTENCIA: Usa estados centralizados del contexto
 * ✅ REUTILIZACIÓN: Lógica compartida entre componentes
 * ✅ CAMPOS EDITABLES: Solo portada, título, categoría y año
 * ✅ SISTEMA DE DISEÑO: Usa componentes con stories de Storybook
 * ✅ BACKEND: Homologado con campos reales del backend
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ VALIDACIONES: Según esquemas del backend
 */
function MovieEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ===== ESTADOS LOCALES =====
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError] = useState(null);

  // ===== CONTEXTOS =====
  const {
    currentMovie,
    loadingMovie,
    editing,
    error: contextError,
    loadMovieById,
    updateMovie,
    getMovieCoverUrl,
    clearCurrentMovie
  } = useMovies();

  const { categories, loading: categoriesLoading } = useCategories();

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
        placeholder: 'Ej: 2019',
        required: true,
        leftIcon: 'calendar',
        helperText: 'Año en que se estrenó la película',
        width: 'half'
      },
      {
        name: 'coverImage',
        type: 'image-crop',
        label: 'Portada (Imagen)',
        aspect: 2 / 3,
        maxFileSize: '5MB',
        showPreview: true,
        previewDimensions: { width: 120, height: 180 },
        helperText: 'Sube una imagen para recortar como portada (formato póster 2:3)'
      },
    ];
  };

  // ===== FUNCIONES DE DATOS SIMPLIFICADAS =====

  /**
   * Cargar datos de la película usando el contexto
   */
  const loadMovieData = useCallback(async () => {
    if (!id) {
      setLocalError('ID de película no proporcionado');
      return;
    }

    try {
      setLocalError(null);

      // ✅ USAR FUNCIÓN DEL CONTEXTO
      const result = await loadMovieById(id);

      if (result.success) {
        const movieInfo = result.data;

        // ✅ USAR FUNCIÓN DEL CONTEXTO PARA PORTADA
        if (movieInfo.cover_image) {
          const currentImageUrl = getMovieCoverUrl(movieInfo.cover_image);
          setImagePreview(currentImageUrl);
        }

        // Configurar datos iniciales
        setInitialData({
          title: movieInfo.title || '',
          categoryId: movieInfo.category_id || '',
          releaseYear: movieInfo.release_year || new Date().getFullYear(),
          // coverImage no se incluye en initialData porque es un archivo
        });

      } else {
        setLocalError(result.error || 'Error al cargar datos de la película');
      }

    } catch (error) {
      setLocalError(error.message || 'Error al cargar datos de la película');
    }
  }, [id, loadMovieById, getMovieCoverUrl]);

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

      // ✅ MIGRADO: Preparar datos para el backend (solo campos que cambiaron)
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

      // ✅ USAR FUNCIÓN DEL CONTEXTO
      const result = await updateMovie(id, updateData);

      if (result.success) {

        // Éxito
        setSuccess(true);
        setHasChanges(false);

        // Recargar datos actualizados
        setTimeout(() => {
          loadMovieData();
        }, 1000);

        // Redirigir después de un delay
        setTimeout(() => {
          navigate('/admin/movies');
        }, 2500);

      } else {

        if (result.error === 'No hay cambios para guardar') {
          alert('No hay cambios para guardar');
        } else {
          setLocalError(result.error || 'Error al actualizar película');
        }
      }

    } catch (err) {

      setLocalError(err.message || 'Error al actualizar película');
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
    loadMovieData();

    // Cleanup al desmontar
    return () => {
      clearCurrentMovie();
    };
  }, [loadMovieData, clearCurrentMovie]);

  // ===== RENDER =====

  // ✅ USAR ESTADOS DEL CONTEXTO
  if (loadingMovie || categoriesLoading) {
    return (
      <AdminLayout
        title="Editar Película"
        subtitle="Cargando datos de la película..."
        breadcrumbs={[
          { label: 'Películas', to: '/admin/movies' },
          { label: 'Editar' }
        ]}
      >
        <div className="movie-edit__loading">
          <div className="movie-edit__loading-spinner">⏳</div>
          <Typography variant="body" size="md" color="muted">Cargando información de la película...</Typography>
        </div>
      </AdminLayout>
    );
  }

  // ✅ USAR ESTADOS DEL CONTEXTO Y LOCALES
  const errorToShow = contextError || localError;
  if (errorToShow && !currentMovie) {
    return (
      <AdminLayout
        title="Error"
        subtitle="No se pudo cargar la película"
        breadcrumbs={[
          { label: 'Películas', to: '/admin/movies' },
          { label: 'Error' }
        ]}
      >
        <div className="movie-edit__error">
          <div className="movie-edit__error-icon">❌</div>
          <Typography variant="h2" size="lg" weight="semibold" color="danger">Error al cargar película</Typography>
          <Typography variant="body" size="md" color="muted">{errorToShow}</Typography>
          <Button onClick={() => navigate('/admin/movies')} variant="primary">
            Volver a la lista
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Editar: ${currentMovie?.title || 'Película'}`}
      subtitle={`${currentMovie?.release_year || ''} • ${categories.find(c => c.id === currentMovie?.category_id)?.name || 'Sin categoría'}`}
      breadcrumbs={[
        { label: 'Películas', to: '/admin/movies' },
        { label: currentMovie?.title || 'Editar' }
      ]}
    >
      {/* ===== NOTIFICACIONES ===== */}
      {success && (
        <div className="movie-edit__success">
          <div className="movie-edit__success-icon">✅</div>
          <div className="movie-edit__success-content">
            <Typography variant="h3" size="md" weight="semibold" color="success">¡Película actualizada exitosamente!</Typography>
            <Typography variant="body" size="md" color="muted">Los cambios se han guardado correctamente. Redirigiendo...</Typography>
          </div>
        </div>
      )}

      {errorToShow && (
        <div className="movie-edit__error-message">
          <div className="movie-edit__error-icon">⚠️</div>
          <div className="movie-edit__error-content">
            <Typography variant="h4" size="sm" weight="semibold" color="danger">Error al guardar</Typography>
            <Typography variant="body" size="md" color="muted">{errorToShow}</Typography>
          </div>
        </div>
      )}
      <div className="info-panel__header">
        <Typography variant="h3" size="md" weight="semibold" className="info-panel__title">
          📋 Información Actual
        </Typography>
        <Badge variant="primary" size="sm">
          ID: {currentMovie?.id}
        </Badge>
      </div>

      <Divider variant="neutral" size="sm" />

      {/* Portada actual */}
      <div className="info-panel__cover">
        <Typography variant="h4" size="sm" weight="medium" className="info-panel__subtitle">Portada</Typography>
        {imagePreview ? (
          <ContentImage
            src={imagePreview}
            alt={`Portada de ${currentMovie?.title}`}
            aspectRatio="2/3"
            contentType="movie"
            placeholder="🎬"
            rounded="md"
            showFallback={true}
            size="md"
          />
        ) : (
          <div className="info-panel__no-image">
            <span className="info-panel__no-image-icon">🎬</span>
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
          <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{currentMovie?.title}</Typography>
        </div>

        <div className="info-detail">
          <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Categoría:</Typography>
          <Typography variant="span" size="sm" weight="normal" className="info-detail__value">
            {categories.find(c => c.id === currentMovie?.category_id)?.name || 'Sin categoría'}
          </Typography>
        </div>

        <div className="info-detail">
          <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Año:</Typography>
          <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{currentMovie?.release_year}</Typography>
        </div>

        <div className="info-detail">
          <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Duración:</Typography>
          <Typography variant="span" size="sm" weight="normal" className="info-detail__value">
            {currentMovie?.duration ? `${currentMovie.duration} min` : 'No disponible'}
          </Typography>
        </div>
      </div>
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
        {currentMovie && (
          <DynamicForm
            id="movie-edit-form"
            fields={getEditFormFields()}
            initialData={{
              title: currentMovie.title || '',
              categoryId: currentMovie.category_id || '',
              releaseYear: currentMovie.release_year || new Date().getFullYear()
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
            className={`movie-edit__form ${success ? 'movie-edit__form--success' : ''}`}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export { MovieEditPage };