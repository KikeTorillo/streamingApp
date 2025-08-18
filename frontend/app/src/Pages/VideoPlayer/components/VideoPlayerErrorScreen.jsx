import PropTypes from 'prop-types';
import { Button } from '../../../components/atoms/Button/Button';
import { Typography } from '../../../components/atoms/Typography/Typography';

/**
 * VideoPlayerErrorScreen - Componente para mostrar pantallas de error
 */
export const VideoPlayerErrorScreen = ({ error, onGoBack, resolutionsError = false }) => {
  if (resolutionsError) {
    return (
      <div className="video-player-container">
        <div className="video-info">
          <Typography variant="h2" size="lg" weight="semibold" color="danger">Error: Resoluciones no encontradas</Typography>
          <Typography variant="body" size="md" color="muted">Verifica que la URL contenga parámetros de resolución</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <div className="video-info">
        <Typography variant="h2" size="lg" weight="semibold" color="danger">Error</Typography>
        <Typography variant="body" size="md" color="muted">{error}</Typography>
        <Button 
          onClick={onGoBack}
          variant="primary"
          size="md"
        >
          Regresar
        </Button>
      </div>
    </div>
  );
};

VideoPlayerErrorScreen.propTypes = {
  error: PropTypes.string,
  onGoBack: PropTypes.func.isRequired,
  resolutionsError: PropTypes.bool
};