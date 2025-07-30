import PropTypes from 'prop-types';

/**
 * VideoPlayerStatusBar - Indicadores de estado del reproductor
 */
export const VideoPlayerStatusBar = ({ 
  currentQuality, 
  bufferPercentage, 
  subtitleOffset, 
  showOffsetIndicator 
}) => {
  return (
    <div className="video-status-indicators">
      {currentQuality && (
        <span className="quality-indicator">
          📺 {currentQuality}
        </span>
      )}
      {bufferPercentage > 0 && (
        <span className="buffer-indicator">
          ⏳ Buffer: {bufferPercentage.toFixed(0)}%
        </span>
      )}
      {showOffsetIndicator && (
        <span className="subtitle-offset-indicator">
          📝 Subtítulos: {subtitleOffset > 0 ? '+' : ''}{subtitleOffset.toFixed(1)}s
        </span>
      )}
    </div>
  );
};

VideoPlayerStatusBar.propTypes = {
  currentQuality: PropTypes.string,
  bufferPercentage: PropTypes.number,
  subtitleOffset: PropTypes.number,
  showOffsetIndicator: PropTypes.bool
};