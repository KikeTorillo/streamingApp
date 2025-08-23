import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';

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
    <FlexContainer
      className={`video-player-overlay ${className}`}
      align="center"
      justify="center"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: 'calc(100% - 3rem)',
        marginTop: '-4rem',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease',
        pointerEvents: isVisible ? 'all' : 'none',
        zIndex: 500
      }}
      onClick={(e) => {
        // Click en fondo muestra controles brevemente
        if (e.target === e.currentTarget) {
          showControls();
        }
      }}
    >
      <FlexContainer
        align="center"
        justify="center"
        spacing="xl"
        style={{ pointerEvents: 'all' }}
      >
        <Button
          iconOnly
          leftIcon="skip-back"
          size="xl"
          variant="secondary"
          onClick={onSkipBack}
          ariaLabel={`Retroceder ${skipSeconds} segundos`}
          style={{
            backgroundColor: 'var(--backdrop-dark)',
            backdropFilter: 'blur(8px)',
            border: '0.2rem solid var(--bg-primary)',
            borderRadius: 'var(--radius-full)',
            width: '6rem',
            height: '6rem',
            boxShadow: 'var(--shadow-xl)'
          }}
        />
        
        <Button
          iconOnly
          leftIcon={isPlaying ? 'pause' : 'play'}
          size="xl"
          variant="primary"
          onClick={onPlayPause}
          ariaLabel={isPlaying ? 'Pausar' : 'Reproducir'}
          style={{
            border: '0.3rem solid var(--bg-primary)',
            borderRadius: 'var(--radius-full)',
            width: '8rem',
            height: '8rem',
            boxShadow: 'var(--shadow-2xl)'
          }}
        />
        
        <Button
          iconOnly
          leftIcon="skip-forward"
          size="xl"
          variant="secondary"
          onClick={onSkipForward}
          ariaLabel={`Avanzar ${skipSeconds} segundos`}
          style={{
            backgroundColor: 'var(--backdrop-dark)',
            backdropFilter: 'blur(8px)',
            border: '0.2rem solid var(--bg-primary)',
            borderRadius: 'var(--radius-full)',
            width: '6rem',
            height: '6rem',
            boxShadow: 'var(--shadow-xl)'
          }}
        />
      </FlexContainer>
    </FlexContainer>
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