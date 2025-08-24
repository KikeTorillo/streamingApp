// molecules/EpisodeListItem/EpisodeListItem.jsx
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { Image } from '../../atoms/Image/Image';
import './EpisodeListItem.css';

/**
 * Componente EpisodeListItem - Lista compacta de episodios
 * Diseño optimizado para navegación rápida con botón play prominente
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.episode - Datos del episodio
 * @param {string} props.episode.id - ID único del episodio
 * @param {string} props.episode.title - Título del episodio
 * @param {number} props.episode.season - Número de temporada
 * @param {number} props.episode.episode_number - Número de episodio
 * @param {string} [props.episode.description] - Descripción del episodio
 * @param {string} [props.episode.cover] - URL de thumbnail del episodio
 * @param {string} [props.episode.duration] - Duración formateada (ej: "45:30")
 * @param {number} [props.episode.rating] - Puntuación del episodio
 * @param {boolean} [props.episode.watched] - Si ya fue visto
 * @param {function} [props.onPlay] - Callback al hacer click en reproducir
 * @param {function} [props.onClick] - Callback al hacer click en el item
 * @param {boolean} [props.showThumbnail=true] - Mostrar thumbnail
 * @param {boolean} [props.showDescription=true] - Mostrar descripción
 * @param {boolean} [props.showRating=true] - Mostrar rating
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {'compact'|'normal'|'detailed'} [props.variant='normal'] - Variante visual
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
const EpisodeListItem = ({
  episode,
  onPlay,
  onClick,
  showThumbnail = true,
  showDescription = true,
  showRating = true,
  loading = false,
  disabled = false,
  variant = 'normal',
  className = '',
  ...restProps
}) => {
  // Validación de datos requeridos
  if (!episode) {

    return null;
  }

  const {
    title,
    season,
    episode_number,
    description,
    cover,
    duration,
    rating,
    watched = false
  } = episode;

  // Construir clases CSS
  const itemClasses = [
    'episode-list-item',
    `episode-list-item--${variant}`,
    watched && 'episode-list-item--watched',
    loading && 'episode-list-item--loading',
    disabled && 'episode-list-item--disabled',
    className
  ].filter(Boolean).join(' ');

  // Handlers
  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (disabled || loading) return;
    onPlay?.(episode);
  };

  const handleItemClick = () => {
    if (disabled || loading) return;
    onClick?.(episode);
  };

  // Formatear información del episodio
  const episodeInfo = `T${season} E${episode_number}`;
  const episodeTitle = title || `Episodio ${episode_number}`;

  return (
    <div
      className={itemClasses}
      onClick={handleItemClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`${episodeInfo} - ${episodeTitle}`}
      aria-disabled={disabled}
      {...restProps}
    >
      {/* Thumbnail del episodio */}
      {showThumbnail && (
        <div className="episode-list-item__thumbnail">
          <Image
            src={cover}
            alt={`Thumbnail de ${episodeTitle}`}
            aspectRatio="wide"
            loading={loading ? "eager" : "lazy"}
            rounded="sm"
            className="episode-list-item__image"
          />
          
          {/* Badge de visto */}
          {watched && (
            <div className="episode-list-item__watched-badge">
              <Badge
                variant="success"
                size="xs"
                appearance="soft"
                leftIcon="check"
              />
            </div>
          )}
        </div>
      )}

      {/* Información del episodio */}
      <div className="episode-list-item__content">
        <div className="episode-list-item__header">
          <div className="episode-list-item__info">
            <span className="episode-list-item__number">{episodeInfo}</span>
            <h3 className="episode-list-item__title">{episodeTitle}</h3>
          </div>
          
          {/* Duración y rating */}
          <div className="episode-list-item__meta">
            {duration && (
              <span className="episode-list-item__duration">{duration}</span>
            )}
            {showRating && rating && (
              <Badge
                variant="warning"
                size="xs"
                appearance="soft"
                leftIcon="star"
              >
                {rating}
              </Badge>
            )}
          </div>
        </div>

        {/* Descripción */}
        {showDescription && description && variant !== 'compact' && (
          <p className="episode-list-item__description">
            {description}
          </p>
        )}
      </div>

      {/* Botón de reproducir */}
      <div className="episode-list-item__actions">
        <Button
          variant="primary"
          size="sm"
          leftIcon="play"
          onClick={handlePlayClick}
          disabled={disabled || loading}
          loading={loading}
          aria-label={`Reproducir ${episodeInfo}`}
          className="episode-list-item__play-button"
        />
      </div>
    </div>
  );
};

EpisodeListItem.propTypes = {
  episode: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    season: PropTypes.number.isRequired,
    episode_number: PropTypes.number.isRequired,
    description: PropTypes.string,
    cover: PropTypes.string,
    duration: PropTypes.string,
    rating: PropTypes.number,
    watched: PropTypes.bool
  }).isRequired,
  onPlay: PropTypes.func,
  onClick: PropTypes.func,
  showThumbnail: PropTypes.bool,
  showDescription: PropTypes.bool,
  showRating: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['compact', 'normal', 'detailed']),
  className: PropTypes.string
};

export { EpisodeListItem };