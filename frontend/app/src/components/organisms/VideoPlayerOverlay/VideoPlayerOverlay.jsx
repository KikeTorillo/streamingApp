import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './VideoPlayerOverlay.css';

const VideoPlayerOverlay = ({ 
  onSkipBack, 
  onPlayPause, 
  onSkipForward,
  isPlaying = false,
  className = '',
  skipSeconds = 10
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);

  const showControls = useCallback(() => {
    setIsVisible(true);
    
    // Limpiar timeout anterior
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    
    // Ocultar después de 3 segundos
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    
    setHideTimeout(timeout);
  }, [hideTimeout]);

  const hideControls = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  // Exponer métodos para el componente padre
  useEffect(() => {
    const overlay = document.querySelector('.video-player-overlay');
    if (overlay) {
      overlay.showControls = showControls;
      overlay.hideControls = hideControls;
    }
  }, [showControls, hideControls]);

  return (
    <div 
      className={`video-player-overlay ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        pointerEvents: isVisible ? 'all' : 'none'
      }}
    >
      <div className="video-player-overlay__center-controls">
        <button 
          className="video-player-overlay__control-btn video-player-overlay__control-btn--skip-back"
          onClick={onSkipBack}
          type="button"
          aria-label={`Retroceder ${skipSeconds} segundos`}
        >
          ⏪
        </button>
        
        <button 
          className="video-player-overlay__control-btn video-player-overlay__control-btn--play-pause"
          onClick={onPlayPause}
          type="button"
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <button 
          className="video-player-overlay__control-btn video-player-overlay__control-btn--skip-forward"
          onClick={onSkipForward}
          type="button"
          aria-label={`Avanzar ${skipSeconds} segundos`}
        >
          ⏩
        </button>
      </div>
    </div>
  );
};

VideoPlayerOverlay.propTypes = {
  onSkipBack: PropTypes.func.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  onSkipForward: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool,
  className: PropTypes.string,
  skipSeconds: PropTypes.number
};

export { VideoPlayerOverlay };