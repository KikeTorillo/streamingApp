// molecules/ContentCard/ContentCard.jsx
import { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, CardSubtitle } from '../../atoms/Card/Card';
import { Badge } from '../../atoms/Badge/Badge';
import { ContentImage } from '../../atoms/ContentImage/ContentImage';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { useContentCardProps } from '../../../hooks/useStandardProps';
import { extractDOMProps, STANDARD_PROP_TYPES } from '../../../tokens/standardProps';
import './ContentCard.css';

/**
 * Componente ContentCard - Molécula para mostrar carátulas de películas/series
 * 
 * 🎯 Casos de uso:
 * - Grids de películas en HomePage
 * - Listas de series en SeriesPage
 * - Resultados de búsqueda
 * - Recommendations cards
 * - Favorites grids
 * 
 * ✅ Sistema estándar integrado
 * ✅ Estados loading, disabled, error
 * ✅ 6 variantes semánticas estándar
 * ✅ 5 tamaños estándar (xs → xl)
 * ✅ Sistema de iconos unificado
 * ✅ Backward compatibility 100%
 */
function ContentCard(props) {
  // ✅ BACKWARD COMPATIBILITY - Manejo de props deprecadas
  const {
    onPlay, // DEPRECATED: Usar onClick
    onFavorite, // DEPRECATED: Funcionalidad movida a acciones contextuales
    ...restProps
  } = props;

  // Warnings para desarrollo en props deprecadas
  if (import.meta.env?.DEV) {
    if (onPlay) {
      console.warn(
        '⚠️ ContentCard: "onPlay" prop está DEPRECADA. ' +
        'Usar "onClick" y manejar acciones desde el padre.'
      );
    }
    if (onFavorite) {
      console.warn(
        '⚠️ ContentCard: "onFavorite" prop está DEPRECADA. ' +
        'Usar acciones contextuales en lugar de props específicas.'
      );
    }
  }

  // Aplicar sistema estándar PRIMERO con todas las props
  const standardProps = useContentCardProps(restProps);
  
  // Extraer props procesadas por el hook
  const {
    // Configuración básica
    content,
    onClick,
    showRating = true,
    showMeta = true,
    showCategory = true,
    
    // Props estándar del sistema (ya procesadas por el hook)
    size, variant, rounded, disabled, loading, className,
    // leftIcon, rightIcon, // del hook pero no implementadas actualmente
    
    // Props específicos para backward compatibility
    cardVariant = 'elevated', // Separar de variant semántica
    
    // Tokens y sistema integrado
    tokens, // renderIcon, // del hook pero no implementadas actualmente
    
    // Props DOM
    ...domProps
  } = standardProps;
  
  // Extraer solo props válidas para DOM (sin className para evitar conflictos)
  const validDOMProps = extractDOMProps(domProps);
  delete validDOMProps.className; // Evitar que sobrescriba nuestras clases
  
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

  // Construir clases CSS con sistema estándar y tokens
  const cardClasses = [
    'content-card',
    // Tamaño específico de ContentCard
    `content-card--size-${size}`,
    // Variante semántica estándar (para bordes y hover effects)
    `content-card--variant-${variant}`,
    // Variante funcional separada (para estilo visual de la card)
    `content-card--card-variant-${cardVariant}`,
    // Estados
    disabled && 'content-card--disabled',
    loading && 'content-card--loading',
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
      // Usar cardVariant para la variante visual de la Card
      variant={cardVariant === 'elevated' ? 'neutral' : cardVariant}
      size={size} // Usar el tamaño que se pasa desde el padre
      rounded={rounded}
      disabled={disabled}
      loading={loading}
      hoverable
      clickable
      onClick={handleCardClick}
      className={cardClasses}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`${type === 'movie' ? 'Película' : 'Serie'}: ${title}`}
      aria-disabled={disabled}
      aria-busy={loading}
      style={{
        '--content-card-size': tokens.size.fontSize,
        '--content-card-spacing': tokens.size.spacing,
        '--content-card-padding': tokens.size.padding,
        '--content-card-rounded': tokens.rounded,
        ...validDOMProps.style
      }}
      {...validDOMProps}
    >
      {/* Contenedor de imagen */}
      <FlexContainer
        align="center"
        justify="center"
        className="content-card__image-container"
      >
        <ContentImage
          src={cover}
          alt={`Carátula de ${title}`}
          aspectRatio="2/3"
          contentType={type}
          imageLoading={loading ? "eager" : "lazy"}
          loading={loading}
          size={size} // Coordinar tamaño con ContentCard
          onError={handleImageError}
          rounded="sm" // El contenedor ya maneja el border radius
          className="content-card__image"
        />

        {/* Badge de tipo en esquina superior */}
        <div className="content-card__type-badge">
          <Badge
            variant={type === 'movie' ? 'primary' : 'secondary'}
            size={size === 'xs' ? 'xs' : size === 'xl' ? 'sm' : 'xs'}
            appearance="soft"
            leftIcon={type === 'movie' ? 'film' : 'video'}
          >
            {type === 'movie' ? 'Película' : 'Serie'}
          </Badge>
        </div>
      </FlexContainer>

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
        <FlexContainer
          direction="row"
          align="center"
          gap="xs"
          className="content-card__details"
        >
          <FlexContainer direction="column" gap="2xs" className="content-card__meta">
            {showMeta && (
              <FlexContainer
                direction="row"
                align="center"
                gap="2xs"
                className="content-card__duration"
              >
                {getMetaText()}
              </FlexContainer>
            )}
          </FlexContainer>
          
          {showRating && rating && (
            <FlexContainer
              direction="row"
              align="center"
              gap="2xs"
              className="content-card__rating"
            >
              <Badge
                variant="warning"
                size={size === 'xs' ? 'xs' : size === 'xl' ? 'sm' : 'xs'}
                appearance="soft"
                leftIcon="star"
              >
                {rating}
              </Badge>
            </FlexContainer>
          )}
        </FlexContainer>
      </CardBody>
    </Card>
  );
};

ContentCard.propTypes = {
  // Props estándar del sistema de diseño
  ...STANDARD_PROP_TYPES,
  
  // Configuración específica
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
  onClick: PropTypes.func,
  
  // Props de funcionalidad
  showRating: PropTypes.bool,
  showMeta: PropTypes.bool,
  showCategory: PropTypes.bool,
  
  // Variantes específicas separadas de variant semántica
  cardVariant: PropTypes.oneOf(['elevated', 'outlined', 'default']),
  
  // Backward compatibility (deprecados)
  onPlay: PropTypes.func,
  onFavorite: PropTypes.func
};

// Memoizar ContentCard - se usa en grids de películas/series
const MemoizedContentCard = memo(ContentCard);

export { MemoizedContentCard as ContentCard };