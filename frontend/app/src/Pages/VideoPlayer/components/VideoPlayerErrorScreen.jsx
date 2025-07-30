import PropTypes from 'prop-types';
import { Button } from '../../../components/atoms/Button/Button';

/**
 * VideoPlayerErrorScreen - Componente para mostrar pantallas de error
 */
export const VideoPlayerErrorScreen = ({ error, onGoBack, resolutionsError = false }) => {
  if (resolutionsError) {
    return (
      <div className="video-player-container">
        <div className="video-info">
          <h2>Error: Resoluciones no encontradas</h2>
          <p>Verifica que la URL contenga parámetros de resolución</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <div className="video-info">
        <h2>Error</h2>
        <p>{error}</p>
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