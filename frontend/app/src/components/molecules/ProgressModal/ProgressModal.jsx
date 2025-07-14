// src/components/molecules/ProgressModal/ProgressModal.jsx
import { UploadProgress } from "../../atoms/UploadProgress/UploadProgress";
import "./ProgressModal.css";

/**
 * ProgressModal - Modal overlay unificado para mostrar progreso de subida y procesamiento
 * 
 * ✅ SISTEMA DE DISEÑO: Combina UploadProgress (atom) con modal overlay
 * ✅ REUTILIZABLE: Para Movies, Series y Episodes con misma apariencia
 * ✅ CONSISTENCIA: Modal overlay elegante con backdrop blur
 * ✅ ACCESIBILIDAD: Soporte para reduced-motion y teclado
 * ✅ RESPONSIVE: Adaptable a diferentes tamaños de pantalla
 */
function ProgressModal({
  isVisible = false,
  progress = 0,
  status = "processing", // 'uploading', 'processing', 'transcoding', 'completed', 'failed'
  message = "Procesando...",
  showPercentage = true,
  size = "md", // 'sm', 'md', 'lg'
  onClose = null // Función opcional para cerrar (solo disponible en estados de error/completado)
}) {
  // No renderizar si no es visible
  if (!isVisible) {
    return null;
  }

  // Determinar si se puede cerrar el modal
  const canClose = onClose && (status === 'completed' || status === 'failed');

  // Manejar clic en backdrop (solo si se puede cerrar)
  const handleBackdropClick = (event) => {
    if (canClose && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Manejar tecla Escape (solo si se puede cerrar)
  const handleKeyDown = (event) => {
    if (canClose && event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="progress-modal__overlay"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="progress-modal-title"
      aria-describedby="progress-modal-description"
    >
      {/* Fondo oscuro con blur */}
      <div className="progress-modal__backdrop" />
      
      {/* Contenedor del modal */}
      <div className="progress-modal__container">
        
        {/* Título del modal */}
        <div 
          id="progress-modal-title" 
          className="progress-modal__title"
        >
          {status === 'uploading' && '📤 Subiendo archivo...'}
          {status === 'processing' && '⚙️ Procesando contenido...'}
          {status === 'transcoding' && '🎬 Transcodificando video...'}
          {status === 'completed' && '✅ ¡Proceso completado!'}
          {status === 'failed' && '❌ Error en el proceso'}
        </div>

        {/* Componente de progreso */}
        <div className="progress-modal__content">
          <UploadProgress
            progress={progress}
            status={status}
            message={message}
            showPercentage={showPercentage}
            size={size}
          />
        </div>

        {/* Descripción adicional */}
        <div 
          id="progress-modal-description" 
          className="progress-modal__description"
        >
          {status === 'uploading' && 'El archivo se está subiendo al servidor...'}
          {status === 'processing' && 'Validando y preparando el contenido...'}
          {status === 'transcoding' && 'Generando diferentes calidades de video...'}
          {status === 'completed' && 'El contenido ha sido procesado exitosamente.'}
          {status === 'failed' && 'Ocurrió un error durante el procesamiento.'}
        </div>

        {/* Botón de cerrar (solo si es posible) */}
        {canClose && (
          <button
            type="button"
            className="progress-modal__close-button"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        )}

      </div>
    </div>
  );
}

export { ProgressModal };