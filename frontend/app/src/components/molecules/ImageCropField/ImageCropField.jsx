// src/components/molecules/ImageCropField/ImageCropField.jsx
import React, { useState, useCallback } from 'react';
import './ImageCropField.css';
import { useImageCropper } from '../../../hooks/useImageCropper';
import { FileInput } from '../../atoms/FileInput/FileInput';
import { Button } from '../../atoms/Button/Button';
import { ImageCropperModal } from '../ImageCropperModal/ImageCropperModal';

/**
 * ImageCropField - MOLÉCULA ESPECIALIZADA PARA RECORTE DE IMÁGENES
 * Combina FileInput + ImagePreview + ImageCropper usando el hook useImageCropper
 * 
 * ✅ ATOMIC DESIGN: Molécula que usa átomos (FileInput, Button) y otra molécula (ImageCropperModal)
 * ✅ HOOK INTEGRATION: Usa el hook useImageCropper para encapsular lógica
 * ✅ SISTEMA DE DISEÑO: Variables CSS del sistema, siguiendo patrones de TextInput/FileInputField
 * ✅ ACCESIBILIDAD: ARIA completo, labels asociados, keyboard navigation
 * ✅ RESPONSIVE: Adaptable a diferentes tamaños de pantalla
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.name] - Nombre del campo para formularios
 * @param {File|null} [props.value] - Archivo actual (controlado)
 * @param {function} [props.onChange] - Handler cuando cambia el archivo (file) => void
 * @param {string} [props.label] - Etiqueta del campo
 * @param {string} [props.helperText] - Texto de ayuda debajo del campo
 * @param {string} [props.errorText] - Mensaje de error (sobrescribe helperText y variant)
 * @param {boolean} [props.required=false] - Si el campo es obligatorio
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.fullWidth=false] - Si ocupa todo el ancho disponible
 * @param {boolean} [props.compact=false] - Versión compacta con spacing reducido
 * @param {string} [props.className=''] - Clases CSS adicionales
 * 
 * // Props específicas de ImageCropField
 * @param {number} [props.aspect=16/9] - Relación de aspecto para recorte
 * @param {boolean} [props.showPreview=true] - Mostrar preview de imagen actual
 * @param {string} [props.maxFileSize='5MB'] - Tamaño máximo de archivo
 * @param {string[]} [props.acceptedFormats=['jpg','png','webp']] - Formatos permitidos
 * @param {string} [props.previewAlt='Vista previa de imagen'] - Alt text para preview
 * @param {Object} [props.previewDimensions] - Dimensiones del preview
 * @param {number} [props.previewDimensions.width=300] - Ancho del preview
 * @param {number} [props.previewDimensions.height=200] - Alto del preview
 * @param {string} [props.cropButtonText='Volver a recortar'] - Texto del botón de recorte
 * @param {string} [props.changeButtonText='Cambiar imagen'] - Texto del botón de cambio
 * @param {string} [props.selectButtonText='Seleccionar imagen'] - Texto del botón inicial
 * 
 * // Props del FileInput heredadas
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del componente
 * @param {'default'|'success'|'warning'|'danger'} [props.variant='default'] - Variante visual
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 */
function ImageCropField({
  // Props de control de formulario
  name,
  value,
  onChange = () => {},
  
  // Props de estructura (siguiendo patrón TextInput/FileInputField)
  label,
  helperText,
  errorText,
  required = false,
  disabled = false,
  fullWidth = false,
  compact = false,
  className = '',
  
  // Props específicas de ImageCropField
  aspect = 16 / 9,
  showPreview = true,
  maxFileSize = '5MB',
  acceptedFormats = ['*'],
  previewAlt = 'Vista previa de imagen',
  previewDimensions = { width: 300, height: 200 },
  cropButtonText = 'Volver a recortar',
  changeButtonText = 'Cambiar imagen',
  selectButtonText = 'Seleccionar imagen',
  
  // Props heredadas del FileInput
  size = 'md',
  variant = 'default',
  rounded = 'md',
  
  ...rest
}) {
  // Estados internos para manejo de focus (igual que otras moléculas)
  const [focused, setFocused] = useState(false);
  
  // Determinar el estado actual
  const hasError = Boolean(errorText);
  const currentVariant = hasError ? 'danger' : variant;
  
  // Hook de recorte de imágenes
  const {
    isOpen: isCropperOpen,
    originalFile,
    imageUrl: cropperImageUrl,
    croppedFile,
    openCropper,
    closeCropper,
    handleCroppedImage,
    resetCropper,
    shouldOpenCropper,
    aspect: cropperAspect
  } = useImageCropper({
    aspect,
    onCropComplete: (croppedFile) => {
      onChange(croppedFile);
    },
    onCropCancel: () => {
      // Recorte cancelado - no hacer nada
    }
  });
  
  
  // Construir accept string para FileInput
  const acceptString = acceptedFormats.map(format => {
    if (format.startsWith('.')) return format;
    if (format.startsWith('image/')) return format;
    return `image/${format}`;
  }).join(',');
  
  // Generar IDs únicos si no se proporcionan
  const fieldId = `image-crop-field-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const errorId = errorText ? `${fieldId}-error` : undefined;
  const previewId = value ? `${fieldId}-preview` : undefined;
  const describedBy = [helperId, errorId, previewId].filter(Boolean).join(' ') || undefined;
  
  /**
   * Manejador de selección de archivo
   */
  const handleFileSelect = useCallback((files) => {
    const file = files[0];
    if (!file) return;
    
    // Verificar si necesita cropping
    if (shouldOpenCropper(file)) {
      openCropper(file);
    } else {
      // Si ya fue procesado o no necesita cropping, usar directamente
      onChange(file);
    }
  }, [shouldOpenCropper, openCropper, onChange]);
  
  /**
   * Abrir cropper para imagen existente
   */
  const handleRecropImage = useCallback(() => {
    if (value && value instanceof File) {
      // Resetear el estado del cropper para permitir volver a recortar
      resetCropper();
      setTimeout(() => {
        openCropper(value);
      }, 50);
    }
  }, [value, resetCropper, openCropper]);
  
  /**
   * Limpiar imagen actual
   */
  const handleClearImage = useCallback(() => {
    onChange(null);
    resetCropper();
  }, [onChange, resetCropper]);
  
  /**
   * Manejadores de focus
   */
  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);
  
  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);
  
  /**
   * Generar URL de preview para la imagen actual
   */
  const getPreviewUrl = useCallback(() => {
    if (!value || !(value instanceof File)) return null;
    
    try {
      return URL.createObjectURL(value);
    } catch (error) {
      console.error('❌ Error creando URL de preview:', error);
      return null;
    }
  }, [value]);
  
  const previewUrl = getPreviewUrl();
  
  // Construir clases CSS (siguiendo patrón TextInput/FileInputField)
  const wrapperClasses = [
    'image-crop-field-wrapper',
    `image-crop-field-wrapper--${size}`,
    `image-crop-field-wrapper--${currentVariant}`,
    focused && 'image-crop-field-wrapper--focused',
    disabled && 'image-crop-field-wrapper--disabled',
    hasError && 'image-crop-field-wrapper--error',
    fullWidth && 'image-crop-field-wrapper--full-width',
    compact && 'image-crop-field-wrapper--compact',
    value && 'image-crop-field-wrapper--has-value',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={wrapperClasses}>
      {/* Label (igual estructura que TextInput/FileInputField) */}
      {label && (
        <label 
          htmlFor={fieldId} 
          className={`image-crop-field__label ${required ? 'image-crop-field__label--required' : ''}`}
        >
          {label}
        </label>
      )}
      
      {/* Contenedor principal del campo */}
      <div className="image-crop-field__container">
        {/* Preview de imagen actual */}
        {showPreview && value && previewUrl && (
          <div className="image-crop-field__preview" id={previewId}>
            <img
              src={previewUrl}
              alt={previewAlt}
              className="image-crop-field__preview-image"
              style={{
                width: previewDimensions.width,
                height: previewDimensions.height,
                maxWidth: '100%'
              }}
              onLoad={() => {
                // Limpiar URL después de cargar para evitar memory leaks
                // TODO: Implementar cleanup más robusto
              }}
            />
            
            {/* Botones de acción sobre la imagen */}
            <div className="image-crop-field__preview-actions">
              <Button
                variant="secondary"
                size="sm"
                rounded="md"
                onClick={handleRecropImage}
                disabled={disabled}
                className="image-crop-field__action-button"
              >
                {cropButtonText}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                rounded="md"
                onClick={handleClearImage}
                disabled={disabled}
                className="image-crop-field__action-button"
              >
                Quitar
              </Button>
            </div>
          </div>
        )}
        
        {/* FileInput para selección/cambio de archivo */}
        <div className="image-crop-field__input-section">
          <FileInput
            id={fieldId}
            name={name}
            accept={acceptString}
            multiple={false}
            disabled={disabled}
            required={required && !value}
            size={size}
            variant={currentVariant}
            rounded={rounded}
            text={value ? changeButtonText : selectButtonText}
            onChange={(event) => {
              const files = Array.from(event.target.files || []);
              handleFileSelect(files);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ariaLabel={label}
            ariaDescribedBy={describedBy}
            {...rest}
          />
        </div>
      </div>
      
      {/* Footer con mensajes (igual que TextInput/FileInputField) */}
      <div className="image-crop-field__footer">
        {/* Texto de ayuda */}
        {helperText && !hasError && (
          <div id={helperId} className="image-crop-field__helper-text">
            {helperText}
          </div>
        )}
        
        {/* Mensaje de error */}
        {errorText && (
          <div id={errorId} className="image-crop-field__error-text" role="alert">
            {errorText}
          </div>
        )}
        
        {/* Información adicional sobre formatos y tamaño */}
        {!hasError && !helperText && (
          <div className="image-crop-field__info">
            Formatos: {acceptedFormats.join(', ')} • Máx: {maxFileSize}
          </div>
        )}
      </div>
      
      {/* Modal de recorte */}
      {isCropperOpen && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          imageSrc={cropperImageUrl}
          aspect={cropperAspect}
          onComplete={handleCroppedImage}
          onClose={closeCropper}
          title="Recortar imagen"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
}

export { ImageCropField };