import PropTypes from 'prop-types';
import { Typography } from '../../../components/atoms/Typography/Typography';

/**
 * VideoPlayerLoadingScreen - Componente para mostrar pantalla de carga
 */
export const VideoPlayerLoadingScreen = ({ contentType, preferencesLoading }) => {
  return (
    <div className="video-player-container">
      <div className="video-info">
        <Typography variant="h2" size="lg" weight="semibold">Cargando {contentType === 'episode' ? 'episodio' : 'película'}...</Typography>
        {preferencesLoading && <Typography variant="body" size="md" color="muted">Cargando preferencias de usuario...</Typography>}
      </div>
    </div>
  );
};

VideoPlayerLoadingScreen.propTypes = {
  contentType: PropTypes.string.isRequired,
  preferencesLoading: PropTypes.bool
};