// ===== MOVIE FORM VIEW - VERSIÓN SIMPLIFICADA CON IMAGECROPFIELD =====
// src/Pages/Admin/Movies/MovieCreatePage/components/MovieFormView.jsx

import React, { useState, useEffect } from 'react';
import { DynamicForm } from '../../../../../components/molecules/DynamicForm/DynamicForm';
import { Card, CardBody } from '../../../../../components/atoms/Card/Card';
import { Button } from '../../../../../components/atoms/Button/Button';
import { ContentImage } from '../../../../../components/atoms/ContentImage/ContentImage';
import { filterEmptyFields } from '../../../../../utils/formUtils';
import { getImageTypeInfo, selectFinalImage } from '../../../../../utils/imageUtils';
import './MovieFormView.css';

/**
 * MovieFormView - VERSIÓN SIMPLIFICADA CON IMAGECROPFIELD
 * ✅ FILTRO AUTOMÁTICO: Solo envía campos con valores válidos al backend
 * ✅ VALIDACIÓN: Verifica que campos requeridos tengan valores
 * ✅ IMAGECROPFIELD: Usa el nuevo componente para manejo de imágenes
 * ✅ UX MEJORADA: Información clara sobre campos opcionales
 */
function MovieFormView({
  fields = [],
  initialData = {},
  onSubmit,
  categoryOptions = [],
  loading = false,
  error = null,
  success = false,
  hasChanges = false,
  onChange,
  selectedItem = null,
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
  useEffect(() => {
    const { coverImageUrl, coverImage, coverImageFile } = currentFormData;
    
    // Limpiar URL previa si existe
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    // Prioridad: 1. Archivo recortado (SIEMPRE tiene prioridad), 2. URL externa, 3. coverImage
    if (coverImageFile && coverImageFile instanceof File) {
      const fileUrl = URL.createObjectURL(coverImageFile);
      setImageType('file');
      setImagePreview(fileUrl);
    } else if (coverImageUrl && typeof coverImageUrl === 'string' && coverImageUrl.trim()) {
      setImageType(coverImageUrl.includes('image.tmdb.org') ? 'tmdb' : 'url');
      setImagePreview(coverImageUrl);
    } else if (typeof coverImage === 'string' && coverImage.trim()) {
      setImageType(coverImage.includes('image.tmdb.org') ? 'tmdb' : 'url');
      setImagePreview(coverImage);
    } else {
      setImagePreview(null);
      setImageType(null);
    }
  }, [currentFormData.coverImageUrl, currentFormData.coverImage, currentFormData.coverImageFile]);

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
        <span className="movie-form-view__image-badge">{imageInfo.badge}</span>
        <span className="movie-form-view__image-description">{imageInfo.description}</span>
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
    <div className="movie-form-view">
      <Card variant="elevated" className="movie-form-view__container">
        <CardBody padding="lg">
          {/* ===== BOTÓN DE VOLVER ===== */}
          {showBackButton && (
            <div className="movie-form-view__back-section">
              <Button
                onClick={onBackToSearch}
                variant="outline"
                size="sm"
                leftIcon="←"
              >
                Volver a búsqueda
              </Button>
            </div>
          )}

          {/* ===== PREVIEW DE IMAGEN (URLs y archivos) ===== */}
          {imagePreview && imageType && (
            <div className="movie-form-view__external-preview">
              {renderImageInfo()}
              <div className="movie-form-view__image-preview">
                <ContentImage
                  src={imagePreview}
                  alt="Vista previa de la portada"
                  placeholder="🎬"
                  className="movie-form-view__preview-image"
                />
              </div>
            </div>
          )}

          {/* ===== FORMULARIO DINÁMICO ===== */}
          <div className="movie-form-view__form">
            <DynamicForm
              fields={resolvedFields}
              onSubmit={handleFormSubmit}
              onChange={handleFormChange}
              initialData={currentFormData}
              columnsPerRow={2}
              submitText={success ? "✅ Guardado Exitosamente" : "💾 Guardar Contenido"}
              submitVariant={success ? "success" : "primary"}
              submitSize="lg"
              loading={formLoading}
              disabled={formLoading || success}
              fieldSize="md"
              validateOnChange={true}
            />
          </div>


          {/* ===== MENSAJE DE ERROR ===== */}
          {error && (
            <div className="movie-form-view__error">
              <div className="movie-form-view__error-icon">❌</div>
              <h4 className="movie-form-view__error-title">Error al guardar</h4>
              <p className="movie-form-view__error-message">
                {typeof error === 'string' ? error : error.message || 'Ha ocurrido un error inesperado'}
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export { MovieFormView };