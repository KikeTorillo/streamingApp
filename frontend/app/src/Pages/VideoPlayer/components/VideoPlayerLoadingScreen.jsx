import PropTypes from 'prop-types';

/**
 * VideoPlayerLoadingScreen - Componente para mostrar pantalla de carga
 */
export const VideoPlayerLoadingScreen = ({ contentType, preferencesLoading }) => {
  return (
    <div className="video-player-container">
      <div className="video-info">
        <h2>Cargando {contentType === 'episode' ? 'episodio' : 'película'}...</h2>
        {preferencesLoading && <p>Cargando preferencias de usuario...</p>}
      </div>
    </div>
  );
};

VideoPlayerLoadingScreen.propTypes = {
  contentType: PropTypes.string.isRequired,
  preferencesLoading: PropTypes.bool
};