import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import './VideoPlayerOverlay.css';

const VideoPlayerOverlay = forwardRef(({ 
  onSkipBack, 
  onPlayPause, 
  onSkipForward,
  isPlaying = false,
  className = '',
  skipSeconds = 10
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  // Métodos simples para mostrar/ocultar (controlados por Video.js events)
  const showControls = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideControls = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Exponer métodos via ref para Video.js events
  useImperativeHandle(ref, () => ({
    showControls,
    hideControls
  }), [showControls, hideControls]);

  return (
    <div 
      className={`video-player-overlay ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease',
        pointerEvents: isVisible ? 'all' : 'none'
      }}
      onClick={(e) => {
        // Click en fondo muestra controles brevemente
        if (e.target === e.currentTarget) {
          showControls();
        }
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
});

VideoPlayerOverlay.displayName = 'VideoPlayerOverlay';

VideoPlayerOverlay.propTypes = {
  onSkipBack: PropTypes.func.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  onSkipForward: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool,
  className: PropTypes.string,
  skipSeconds: PropTypes.number
};

export { VideoPlayerOverlay };