// ===== IMAGE CROPPER MODAL - COMPONENTE REUTILIZABLE =====
// src/components/molecules/ImageCropperModal/ImageCropperModal.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import { Modal, Button } from '../../../../design-system';
import './ImageCropperModal.css';

// ===== FUNCIONES AUXILIARES PARA CROPPING =====

/**
 * Crear elemento imagen para canvas
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Obtener imagen recortada como blob
 */
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject(new Error('Canvas is empty'));
      }
      resolve(blob);
    }, 'image/jpeg');
  });
}

/**
 * ImageCropperModal - Componente completo para recortar imágenes
 * 
 * ✅ COMPLETO: Integra react-easy-crop + Modal + UX completa
 * ✅ REUTILIZABLE: Para Movies, Series y cualquier formulario con imágenes
 * ✅ ACCESIBLE: Modal con foco y navegación por teclado
 * ✅ RESPONSIVE: Adaptable a diferentes tamaños de pantalla
 * ✅ CONFIGURABLE: Aspecto, título y textos personalizables
 */
function ImageCropperModal({
  // Control básico
  isOpen = false,
  onClose = null,
  onComplete = null,
  
  // Imagen a recortar
  imageSrc = null,
  
  // Configuración del cropper
  aspect = 16 / 9,
  
  // Personalización de contenido
  title = "✂️ Recortar Imagen",
  description = "Ajusta el área de recorte para tu imagen. Se recomienda usar una proporción de 16:9.",
  helpText = "Ajusta el área de recorte y haz clic en \"Confirmar recorte\" para proceder.",
  
  // Botones
  cancelText = "❌ Cancelar",
  
  // Configuración del modal
  size = "lg",
  closeOnBackdrop = false,
  closeOnEscape = true,
  
  // Props adicionales
  className = '',
  
  // Filtrar props específicos del modal para evitar warnings de React
  // ...restProps
}) {
  
  // ===== ESTADOS DEL CROPPER =====
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  // ===== FUNCIONES =====
  
  /**
   * Manejar cancelación
   */
  const handleCancel = () => {
    onClose?.();
  };
  
  /**
   * Manejar cambios en el área de recorte
   */
  const onCropCompleteHandler = (croppedArea, croppedAreaPixels) => {
    void croppedArea; // Evitar warning unused-vars
    setCroppedAreaPixels(croppedAreaPixels);
  };
  
  /**
   * Confirmar el recorte y generar blob
   */
  const handleConfirmCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) {
      console.warn('No se puede recortar: falta área de recorte o imagen');
      return;
    }
    
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onComplete?.(croppedBlob);
    } catch (cropError) {
      console.error('Error al recortar imagen:', cropError);
      void cropError; // Evitar warning unused-vars
    }
  };
  
  // ===== CLASES CSS =====
  const modalClasses = [
    'image-cropper-modal',
    className
  ].filter(Boolean).join(' ');
  
  // ===== RENDER =====
  
  // Filtrar props para el Modal (solo las que Modal reconoce)
  const modalProps = {
    isOpen,
    onClose,
    title,
    size,
    closeOnBackdrop,
    closeOnEscape,
    className: modalClasses,
    'aria-label': "Modal para recortar imagen"
  };
  
  return (
    <Modal {...modalProps}>
      <div className="image-cropper-modal__content">
        {/* Descripción */}
        <p className="image-cropper-modal__description">
          {description}
        </p>
        
        {/* Contenedor del cropper */}
        <div className="image-cropper-modal__cropper-container">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropCompleteHandler}
            />
          ) : (
            <div className="image-cropper-modal__empty-state">
              <span className="image-cropper-modal__empty-icon">🖼️</span>
              <p className="image-cropper-modal__empty-text">No hay imagen para recortar</p>
            </div>
          )}
        </div>
        
        {/* Acciones del modal */}
        <div className="image-cropper-modal__footer">
          <p className="image-cropper-modal__help-text">
            {helpText}
          </p>
          
          <div className="image-cropper-modal__actions">
            <Button
              onClick={handleCancel}
              variant="secondary"
              size="md"
            >
              {cancelText}
            </Button>
            
            <Button
              onClick={handleConfirmCrop}
              variant="primary"
              size="md"
              disabled={!croppedAreaPixels || !imageSrc}
            >
              ✅ Confirmar recorte
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

ImageCropperModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onComplete: PropTypes.func,
  imageSrc: PropTypes.string,
  aspect: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  helpText: PropTypes.string,
  cancelText: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  closeOnBackdrop: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  className: PropTypes.string
};

export { ImageCropperModal };