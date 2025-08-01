// src/components/molecules/ProgressModal/ProgressModal.jsx
import PropTypes from 'prop-types';
import { Modal } from "../Modal/Modal";
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

  // Función para obtener el título
  const getTitle = () => {
    switch (status) {
      case 'uploading': return '📤 Subiendo archivo...';
      case 'processing': return '⚙️ Procesando contenido...';
      case 'transcoding': return '🎬 Transcodificando video...';
      case 'completed': return '✅ ¡Proceso completado!';
      case 'failed': return '❌ Error en el proceso';
      default: return '⚙️ Procesando contenido...';
    }
  };

  // Función para obtener la descripción
  const getDescription = () => {
    switch (status) {
      case 'uploading': return 'El archivo se está subiendo al servidor...';
      case 'processing': return 'Validando y preparando el contenido...';
      case 'transcoding': return 'Generando diferentes calidades de video...';
      case 'completed': return 'El contenido ha sido procesado exitosamente.';
      case 'failed': return 'Ocurrió un error durante el procesamiento.';
      default: return 'Procesando contenido...';
    }
  };

  return (
    <Modal
      isOpen={isVisible}
      onClose={canClose ? onClose : undefined}
      title={getTitle()}
      size={size}
      closeOnBackdrop={canClose}
      closeOnEscape={canClose}
      aria-describedby="progress-modal-description"
      className="progress-modal"
    >
      <div className="progress-modal__content">
        {/* Componente de progreso */}
        <UploadProgress
          progress={progress}
          status={status}
          message={message}
          showPercentage={showPercentage}
          size={size}
        />

        {/* Descripción adicional */}
        <div 
          id="progress-modal-description" 
          className="progress-modal__description"
        >
          {getDescription()}
        </div>
      </div>
    </Modal>
  );
}

ProgressModal.propTypes = {
  isVisible: PropTypes.bool,
  progress: PropTypes.number,
  status: PropTypes.oneOf(['uploading', 'processing', 'transcoding', 'completed', 'failed']),
  message: PropTypes.string,
  showPercentage: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClose: PropTypes.func
};

export { ProgressModal };