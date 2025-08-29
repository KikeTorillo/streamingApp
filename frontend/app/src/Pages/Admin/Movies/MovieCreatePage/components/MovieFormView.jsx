// ===== MOVIE FORM VIEW - VERSIÓN SIMPLIFICADA CON IMAGECROPFIELD =====
// src/Pages/Admin/Movies/MovieCreatePage/components/MovieFormView.jsx

import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DynamicForm } from '../../../../../components/molecules/DynamicForm/DynamicForm';
import { Container, Divider, Button, FlexContainer, Typography } from '../../../../../../design-system';
import { filterEmptyFields } from '../../../../../utils/formUtils';
import { getImageTypeInfo, selectFinalImage } from '../../../../../utils/imageUtils';

/**
 * MovieFormView - VERSIÓN REFACTORIZADA CON SISTEMA DE DISEÑO
 * ✅ SISTEMA DE DISEÑO: Usa Container, Divider, Badge según patrón de EditPage
 * ✅ CONSISTENCIA: Sigue misma estructura que MovieEditPage
 * ✅ FILTRO AUTOMÁTICO: Solo envía campos con valores válidos al backend
 * ✅ VALIDACIÓN: Verifica que campos requeridos tengan valores
 * ✅ IMAGECROPFIELD: Usa el nuevo componente para manejo de imágenes
 * ✅ UX MEJORADA: Información clara sobre campos opcionales
 */
function MovieFormView({
  // Propiedades homologadas con TMDBSearchView
  title = "🎬 Información de la Película",
  description = "Completa la información para agregar la película al catálogo",

  // Propiedades específicas del formulario
  fields = [],
  initialData = {},
  onSubmit,
  categoryOptions = [],
  loading = false,
  error = null,
  success = false,
  onChange,
  showBackButton = false,
  onBackToSearch
}) {
  // ===== ESTADOS =====
  const [currentFormData, setCurrentFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [formLoading, setFormLoading] = useState(loading);

  // ===== EFECTOS =====
  useEffect(() => {
    setCurrentFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    setFormLoading(loading);
  }, [loading]);

  /**
   * ✅ MEJORADO: Preview para URLs externas Y archivos del cropper
   */
  const updateImagePreview = useCallback((coverImageUrl, coverImage, coverImageFile) => {
    let newImagePreview = null;
    let newImageType = null;

    // Determinar nueva imagen y tipo sin cambiar estado aún
    if (coverImageFile && coverImageFile instanceof File) {
      newImagePreview = URL.createObjectURL(coverImageFile);
      newImageType = 'file';
    } else if (coverImageUrl && typeof coverImageUrl === 'string' && coverImageUrl.trim()) {
      newImagePreview = coverImageUrl;
      newImageType = coverImageUrl.includes('image.tmdb.org') ? 'tmdb' : 'url';
    } else if (typeof coverImage === 'string' && coverImage.trim()) {
      newImagePreview = coverImage;
      newImageType = coverImage.includes('image.tmdb.org') ? 'tmdb' : 'url';
    }

    // Solo actualizar si realmente cambió (evita loop infinito)
    setImagePreview(prevPreview => {
      if (newImagePreview !== prevPreview) {
        // Limpiar URL previa si existe
        if (prevPreview && prevPreview.startsWith('blob:')) {
          URL.revokeObjectURL(prevPreview);
        }
        return newImagePreview;
      }
      return prevPreview;
    });

    setImageType(newImageType);
  }, []);

  const imageData = useMemo(() => ({
    coverImageUrl: currentFormData?.coverImageUrl,
    coverImage: currentFormData?.coverImage,
    coverImageFile: currentFormData?.coverImageFile
  }), [currentFormData?.coverImageUrl, currentFormData?.coverImage, currentFormData?.coverImageFile]);

  useEffect(() => {
    updateImagePreview(imageData.coverImageUrl, imageData.coverImage, imageData.coverImageFile);
  }, [imageData.coverImageUrl, imageData.coverImage, imageData.coverImageFile, updateImagePreview]);

  // ===== CLEANUP DE URLs AL DESMONTAR =====
  useEffect(() => {
    return () => {
      // Limpiar URL de preview al desmontar para evitar memory leaks
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ===== FUNCIONES AUXILIARES =====



  /**
   * ✅ SIMPLIFICADO: Manejar envío del formulario con ImageCropField
   */
  const handleFormSubmit = (formData) => {
    // Filtrar campos vacíos
    const filteredData = filterEmptyFields(formData);

    // Usar utility para seleccionar la imagen final
    const finalCoverImage = selectFinalImage(filteredData);


    // Preparar datos para el servicio con nombres correctos
    const movieData = {
      title: filteredData.title,
      categoryId: filteredData.categoryId || filteredData.category_id,
      releaseYear: filteredData.releaseYear || filteredData.year,
      description: filteredData.description,
      video: filteredData.video || filteredData.video_file,
      coverImage: finalCoverImage,
      // Solo incluir email si tiene valor
      ...(filteredData.email && { email: filteredData.email }),
      // Solo incluir tmdb_id si tiene valor
      ...(filteredData.tmdb_id && { tmdb_id: filteredData.tmdb_id }),
      // Solo incluir media_type si tiene valor
      ...(filteredData.media_type && { media_type: filteredData.media_type })
    };

    // Los datos ya están filtrados, no necesitamos filtrar de nuevo
    const finalData = movieData;

    onSubmit?.(finalData);
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (newFormData) => {
    // Actualizar datos del formulario
    setCurrentFormData(newFormData || {});

    // Notificar cambios al padre
    onChange?.();
  };

  /**
   * ✅ SIMPLIFICADO: Renderizar información de la imagen actual
   */
  const renderImageInfo = () => {
    const imageInfo = getImageTypeInfo(imageType, 'movie-form-view');
    if (!imageInfo) return null;

    return (
      <div className={`movie-form-view__image-info ${imageInfo.bgClass}`}>
        <Typography variant="span" size="xs" weight="medium" className="movie-form-view__image-badge">{imageInfo.badge}</Typography>
        <Typography variant="span" size="sm" color="muted" className="movie-form-view__image-description">{imageInfo.description}</Typography>
      </div>
    );
  };

  // ===== RESOLUCIÓN DE CAMPOS CON OPCIONES DINÁMICAS =====
  const resolvedFields = fields.map(field => {
    if (field.name === 'categoryId' && categoryOptions.length > 0) {
      return {
        ...field,
        options: categoryOptions
      };
    }
    return field;
  });

  // ===== RENDER =====
  return (
    <Container variant="neutral" size="full">
      {/* ===== HEADER DEL FORMULARIO ===== */}
      <Container className="movie-form-view__header">
        <Typography variant="h3" size="md" weight="semibold" className="movie-form-view__title">
          {title}
        </Typography>
        <Typography variant="body" size="md" color="muted" className="movie-form-view__subtitle">
          {description}
        </Typography>
        {showBackButton && (
          <div className="movie-form-view__back-section">
            <Button
              onClick={onBackToSearch}
              variant="outline"
              size="sm"
              leftIcon="arrow-left"
            >
              Volver a búsqueda
            </Button>
          </div>
        )}
      </Container>

      <Divider variant="neutral" size="md" />

      {/* ===== PREVIEW DE IMAGEN (URLs y archivos) ===== */}
      {imagePreview && imageType && (
        <Container className="movie-form-view__preview-section">
          <FlexContainer direction="row" justify="between" align="center" className="movie-form-view__preview-header">
            <Typography variant="h4" size="sm" weight="medium" className="movie-form-view__preview-title">📸 Vista Previa de Portada</Typography>
            {renderImageInfo()}
          </FlexContainer>

          <Container className="movie-form-view__image-preview">
            <ContentImage
              src={imagePreview}
              alt="Vista previa de la portada"
              aspectRatio="2/3"
              contentType="movie"
              placeholder="🎬"
              rounded="md"
              showFallback={true}
              size="md"
              className="movie-form-view__preview-image"
            />
          </Container>

          <Divider variant="neutral" size="sm" />
        </Container>
      )}

      {/* ===== FORMULARIO DINÁMICO ===== */}
      <DynamicForm
        id="movie-create-form"
        fields={resolvedFields}
        onSubmit={handleFormSubmit}
        onChange={handleFormChange}
        initialData={currentFormData}
        loading={formLoading}
        disabled={formLoading || success}
        columnsPerRow={2}
        tabletColumns={1}
        mobileColumns={1}
        fieldSize="md"
        fieldRounded="md"
        submitText={success ? "✅ Guardado Exitosamente" : "Crear Película"}
        submitVariant={success ? "success" : "primary"}
        submitSize="md"
        submitIcon={success ? "check" : "plus"}
        validateOnBlur={true}
        validateOnChange={false}
        actions={[
          {
            key: 'cancel',
            type: 'button',
            variant: 'outline',
            text: 'Cancelar',
            onClick: () => window.history.back(),
            disabled: formLoading
          },
          {
            key: 'submit',
            type: 'submit',
            variant: success ? 'success' : 'primary',
            text: success ? 'Guardado Exitosamente' : 'Crear Película',
            loading: formLoading,
            disabled: formLoading || success,
            leftIcon: success ? 'check' : 'plus'
          }
        ]}
        className={`movie-form-view__form ${success ? 'movie-form-view__form--success' : ''}`}
      />

      {/* ===== NOTIFICACIONES ===== */}
      {success && (
        <Container className="movie-form-view__success">
          <FlexContainer direction="row" spacing="md" align="center">
            <div className="movie-form-view__success-icon">✅</div>
            <div className="movie-form-view__success-content">
              <Typography variant="h3" size="md" weight="semibold" color="success">¡Película creada exitosamente!</Typography>
              <Typography variant="body" size="md" color="muted">La película se ha agregado al catálogo correctamente.</Typography>
            </div>
          </FlexContainer>
        </Container>
      )}

      {error && (
        <Container className="movie-form-view__error-message">
          <FlexContainer direction="row" spacing="md" align="center">
            <div className="movie-form-view__error-icon">⚠️</div>
            <div className="movie-form-view__error-content">
              <Typography variant="h4" size="sm" weight="semibold" color="danger">Error al crear película</Typography>
              <Typography variant="body" size="md" color="muted">{typeof error === 'string' ? error : error.message || 'Ha ocurrido un error inesperado'}</Typography>
            </div>
          </FlexContainer>
        </Container>
      )}
    </Container>
  );
}

MovieFormView.propTypes = {
  // Propiedades homologadas con TMDBSearchView
  title: PropTypes.string,
  description: PropTypes.string,

  // Propiedades específicas del formulario
  fields: PropTypes.array,
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  categoryOptions: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  success: PropTypes.bool,
  onChange: PropTypes.func,
  showBackButton: PropTypes.bool,
  onBackToSearch: PropTypes.func
};

export { MovieFormView };