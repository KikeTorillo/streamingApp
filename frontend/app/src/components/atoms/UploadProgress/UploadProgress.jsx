// src/components/atoms/UploadProgress/UploadProgress.jsx
import PropTypes from 'prop-types';
import "./UploadProgress.css";

const UploadProgress = ({ 
  progress = 0, 
  message = "Procesando...",
  status = "processing", // 'uploading', 'processing', 'transcoding', 'completed', 'failed'
  showPercentage = true,
  size = "md" // 'sm', 'md', 'lg'
}) => {
  return (
  <div className={`upload-progress upload-progress--${size} upload-progress--${status}`}>
    
    {/* Texto de estado */}
    <div className="upload-progress__message">
      {message}
    </div>
    
    {/* Animación de puntos */}
    {(status === 'uploading' || status === 'processing' || status === 'transcoding') && (
      <div className="upload-progress__dots">
        <span className="upload-progress__dot"></span>
        <span className="upload-progress__dot"></span>
        <span className="upload-progress__dot"></span>
      </div>
    )}
    
    {/* Barra de progreso */}
    <div className="upload-progress__bar-container">
      <div 
        className="upload-progress__bar" 
        style={{ 
          width: `${Math.min(progress, 100)}%`,
          minWidth: progress > 0 ? '0.8rem' : '0'
        }}
      >
        {/* Efectos de barras blancas animadas */}
        <div className="upload-progress__shimmer">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="upload-progress__shimmer-bar"></div>
          ))}
        </div>
      </div>
    </div>
    
    {/* Porcentaje */}
    {showPercentage && (
      <div className="upload-progress__percentage">
        {Math.round(progress)}%
      </div>
    )}
    
    {/* Iconos de estado */}
    <div className="upload-progress__icon">
      {status === 'uploading' && '📤'}
      {status === 'processing' && '⚙️'}
      {status === 'transcoding' && '🎬'}
      {status === 'completed' && '✅'}
      {status === 'failed' && '❌'}
    </div>
    
  </div>
  );
};

UploadProgress.propTypes = {
  progress: PropTypes.number,
  message: PropTypes.string,
  status: PropTypes.oneOf(['uploading', 'processing', 'transcoding', 'completed', 'failed']),
  showPercentage: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export { UploadProgress };