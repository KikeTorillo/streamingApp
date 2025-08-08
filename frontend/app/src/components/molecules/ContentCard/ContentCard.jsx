// molecules/ContentCard/ContentCard.jsx
import { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, CardSubtitle } from '../../atoms/Card/Card';
import { Badge } from '../../atoms/Badge/Badge';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import './ContentCard.css';

/**
 * Componente ContentCard - Molécula para mostrar carátulas de películas/series
 * Sigue Atomic Design: combina Card + Badge + Button + elementos personalizados
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.content - Datos del contenido
 * @param {string} props.content.id - ID único del contenido
 * @param {string} props.content.title - Título de la película/serie
 * @param {string} props.content.cover - URL de la imagen de carátula
 * @param {string} props.content.category - Categoría/género
 * @param {number} props.content.year - Año de lanzamiento
 * @param {number} props.content.rating - Puntuación (ej: 8.5)
 * @param {string} props.content.type - Tipo: 'movie' | 'series'
 * @param {string} [props.content.duration] - Duración (películas)
 * @param {number} [props.content.seasons] - Temporadas (series)
 * @param {number} [props.content.episodes] - Episodios (series)
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño de la card
 * @param {function} [props.onClick] - Callback al hacer click en la card (acción principal)
 * @param {function} [props.onPlay] - Callback al hacer click en reproducir (obsoleto - usar onClick)
 * @param {function} [props.onFavorite] - Callback para agregar a favoritos (obsoleto - funcionalidad no implementada)
 * @param {boolean} [props.showRating=true] - Mostrar rating
 * @param {boolean} [props.showMeta=true] - Mostrar metadatos (duración/temporadas)
 * @param {boolean} [props.showCategory=true] - Mostrar categoría
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {'elevated'|'outlined'|'default'} [props.variant='elevated'] - Variante visual
 * @param {'sm'|'md'|'lg'|'xl'} [props.rounded='lg'] - Border radius
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
const ContentCard = ({
  content,
  size = 'md',
  onClick,
  showRating = true,
  showMeta = true,
  showCategory = true,
  loading = false,
  disabled = false,
  variant = 'elevated',
  rounded = 'lg',
  className = '',
  ...restProps
}) => {
  // Validación de datos requeridos
  if (!content) {

    return null;
  }

  const {
    title,
    cover,
    category,
    year,
    rating,
    type,
    duration,
    seasons,
    episodes
  } = content;

  // ✅ FILTRAR PROPS PERSONALIZADAS QUE NO DEBEN IR AL DOM
  const {
    // Props personalizados que podrían venir del padre
    content: _content,
    size: _size,
    onPlay: _onPlay,
    onFavorite: _onFavorite,
    showRating: _showRating,
    showMeta: _showMeta,
    showCategory: _showCategory,
    
    ...domProps // ✅ Solo props válidas para el DOM
  } = restProps;

  // Evitar warnings de unused vars
  void _content;
  void _size;
  void _onPlay;
  void _onFavorite;
  void _showRating;
  void _showMeta;
  void _showCategory;

  // Construir clases CSS
  const cardClasses = [
    'content-card',
    `content-card--${size}`,
    loading && 'content-card--loading',
    disabled && 'content-card--disabled',
    className
  ].filter(Boolean).join(' ');

  // Metadatos según el tipo de contenido
  const getMetaText = () => {
    if (type === 'movie' && duration) {
      return duration;
    }
    if (type === 'series') {
      if (seasons && episodes) {
        return `${seasons} temporada${seasons > 1 ? 's' : ''} • ${episodes} episodios`;
      }
      if (seasons) {
        return `${seasons} temporada${seasons > 1 ? 's' : ''}`;
      }
    }
    return year.toString();
  };

  // Handlers
  const handleCardClick = () => {
    if (disabled || loading) return;
    onClick?.(content);
  };

  const handleImageError = () => {
    // ContentImage ya maneja los errores automáticamente
  };

  return (
    <Card
      variant={variant}
      shadow="md"
      rounded={rounded}
      hoverable
      clickable
      onClick={handleCardClick}
      className={cardClasses}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`${type === 'movie' ? 'Película' : 'Serie'}: ${title}`}
      aria-disabled={disabled}
      {...domProps} // ✅ Solo props válidas del DOM
    >
      {/* Contenedor de imagen */}
      <div className="content-card__image-container">
        <ContentImage
          src={cover}
          alt={`Carátula de ${title}`}
          aspectRatio="2/3"
          contentType={type}
          loading={loading ? "eager" : "lazy"}
          onError={handleImageError}
          rounded="none" // El contenedor ya maneja el border radius
          className="content-card__image"
        />

        {/* Badge de tipo en esquina superior */}
        <div className="content-card__type-badge">
          <Badge
            variant={type === 'movie' ? 'primary' : 'secondary'}
            size="xs"
            appearance="soft"
          >
            {type === 'movie' ? '🎬' : '📺'}
          </Badge>
        </div>
      </div>

      {/* Información del contenido */}
      <CardBody className="content-card__info">
        <CardTitle className="content-card__title">
          {title}
        </CardTitle>
        
        {showCategory && category && (
          <CardSubtitle className="content-card__subtitle">
            {category} • {year}
          </CardSubtitle>
        )}

        {/* Metadatos y rating */}
        <div className="content-card__details">
          <div className="content-card__meta">
            {showMeta && (
              <span className="content-card__duration">
                {getMetaText()}
              </span>
            )}
          </div>
          
          {showRating && rating && (
            <div className="content-card__rating">
              <Badge
                variant="warning"
                size="xs"
                appearance="soft"
                icon="⭐"
              >
                {rating}
              </Badge>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

// PropTypes para validación
ContentCard.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    category: PropTypes.string,
    year: PropTypes.number.isRequired,
    rating: PropTypes.number,
    type: PropTypes.oneOf(['movie', 'series']).isRequired,
    duration: PropTypes.string,
    seasons: PropTypes.number,
    episodes: PropTypes.number
  }).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  onClick: PropTypes.func,
  onPlay: PropTypes.func,
  onFavorite: PropTypes.func,
  showRating: PropTypes.bool,
  showMeta: PropTypes.bool,
  showCategory: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['elevated', 'outlined', 'default']),
  rounded: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string
};

// Memoizar ContentCard - se usa en grids de películas/series
const MemoizedContentCard = memo(ContentCard);

export { MemoizedContentCard as ContentCard };