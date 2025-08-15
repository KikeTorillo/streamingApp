// ===== SERIES FORM VIEW - BASADO EN MOVIEFORMVIEW =====
// src/Pages/Admin/Series/SeriesCreatePage/components/SeriesFormView.jsx

import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DynamicForm } from '../../../../../components/molecules/DynamicForm/DynamicForm';
import { Container } from '../../../../../components/atoms/Container/Container';
import { Divider } from '../../../../../components/atoms/Divider/Divider';
import { Button } from '../../../../../components/atoms/Button/Button';
import { ContentImage } from '../../../../../components/atoms/ContentImage/ContentImage';
import { filterEmptyFields } from '../../../../../utils/formUtils';
import { getImageTypeInfo, selectFinalImage } from '../../../../../utils/imageUtils';
import './SeriesFormView.css';

/**
 * SeriesFormView - VERSIÓN REFACTORIZADA CON SISTEMA DE DISEÑO
 * ✅ SISTEMA DE DISEÑO: Usa Container, Divider según patrón de EditPage
 * ✅ CONSISTENCIA: Sigue misma estructura que SeriesEditPage y MovieFormView
 * ✅ FILTRO AUTOMÁTICO: Solo envía campos con valores válidos al backend
 * ✅ VALIDACIÓN: Verifica que campos requeridos tengan valores
 * ✅ OPTIMIZACIÓN: Elimina campos vacíos, null o undefined de la petición
 * ✅ UX MEJORADA: Información clara sobre campos opcionales
 */
function SeriesFormView({
  // Propiedades homologadas con TMDBSearchView
  title = "📺 Información de la Serie",
  description = "Completa la información para agregar la serie al catálogo",
  
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
   * ✅ ACTUALIZADO: Manejar envío del formulario con filtrado de campos vacíos
   */
  const handleFormSubmit = (formData) => {
    // Filtrar campos vacíos
    const filteredData = filterEmptyFields(formData);

    // Usar utility para seleccionar la imagen final
    const finalCoverImage = selectFinalImage(filteredData);


    // Preparar datos para el servicio con nombres correctos
    const seriesData = {
      title: filteredData.title,
      categoryId: filteredData.categoryId || filteredData.category_id,
      releaseYear: filteredData.releaseYear || filteredData.year,
      description: filteredData.description,
      coverImage: finalCoverImage,
      // Solo incluir email si tiene valor
      ...(filteredData.email && { email: filteredData.email }),
      // Solo incluir tmdb_id si tiene valor
      ...(filteredData.tmdb_id && { tmdb_id: filteredData.tmdb_id }),
      // Solo incluir media_type si tiene valor
      ...(filteredData.media_type && { media_type: filteredData.media_type })
    };

    // Los datos ya están filtrados, no necesitamos filtrar de nuevo
    const finalData = seriesData;
    
    onSubmit?.(finalData);
  };

  /**
   * ✅ SIMPLIFICADO: Manejar cambios en el formulario
   */
  const handleFormChange = (newFormData) => {
    // Actualizar datos del formulario
    setCurrentFormData(newFormData || {});
    
    // Notificar cambios al padre
    onChange?.();
  };

  /**
   * ✅ NUEVO: Renderizar información de la imagen actual
   */
  const renderImageInfo = () => {
    const imageInfo = getImageTypeInfo(imageType, 'series-form-view');
    if (!imageInfo) return null;

    return (
      <div className={`series-form-view__image-info ${imageInfo.bgClass}`}>
        <span className="series-form-view__image-badge">{imageInfo.badge}</span>
        <span className="series-form-view__image-description">{imageInfo.description}</span>
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
    <div className="series-form-view">
      <Container variant="neutral" size="xl" className="series-form-view__container">
        {/* ===== HEADER DEL FORMULARIO ===== */}
        <div className="series-form-view__header">
          <h3 className="series-form-view__title">
            {title}
          </h3>
          <p className="series-form-view__subtitle">
            {description}
          </p>
          {showBackButton && (
            <div className="series-form-view__back-section">
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
        </div>

        <Divider variant="neutral" size="md" />

        {/* ===== PREVIEW DE IMAGEN (URLs y archivos) ===== */}
        {imagePreview && imageType && (
          <div className="series-form-view__preview-section">
            <div className="series-form-view__preview-header">
              <h4 className="series-form-view__preview-title">Vista Previa de Portada</h4>
              {renderImageInfo()}
            </div>
            
            <div className="series-form-view__image-preview">
              <ContentImage
                src={imagePreview}
                alt="Vista previa de la portada"
                aspectRatio="2/3"
                contentType="series"
                placeholder="📺"
                rounded="md"
                showFallback={true}
                size="md"
                className="series-form-view__preview-image"
              />
            </div>
            
            <Divider variant="neutral" size="sm" />
          </div>
        )}

        {/* ===== FORMULARIO DINÁMICO ===== */}
        <div className="series-form-view__form">
          <DynamicForm
            id="series-create-form"
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
            submitText={success ? "Guardado Exitosamente" : "Crear Serie"}
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
                text: success ? 'Guardado Exitosamente' : 'Crear Serie',
                loading: formLoading,
                disabled: formLoading || success,
                leftIcon: success ? 'check' : 'plus'
              }
            ]}
            className={`series-form-view__form ${success ? 'series-form-view__form--success' : ''}`}
          />
        </div>


        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <div className="series-form-view__success">
            <div className="series-form-view__success-icon">✅</div>
            <div className="series-form-view__success-content">
              <h3>¡Serie creada exitosamente!</h3>
              <p>La serie se ha agregado al catálogo correctamente.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="series-form-view__error-message">
            <div className="series-form-view__error-icon">⚠️</div>
            <div className="series-form-view__error-content">
              <h4>Error al crear serie</h4>
              <p>{typeof error === 'string' ? error : error.message || 'Ha ocurrido un error inesperado'}</p>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

SeriesFormView.propTypes = {
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

export { SeriesFormView };
