import PropTypes from 'prop-types';
import { Button } from '../../../components/atoms/Button/Button';

/**
 * VideoPlayerBackButton - Botón de navegación para regresar
 */
export const VideoPlayerBackButton = ({ onGoBack }) => {
  return (
    <Button 
      className="back-button"
      onClick={onGoBack}
      ariaLabel="Regresar"
      variant="secondary"
      size="md"
      icon="←"
      iconPosition="left"
    >
      Regresar
    </Button>
  );
};

VideoPlayerBackButton.propTypes = {
  onGoBack: PropTypes.func.isRequired
};