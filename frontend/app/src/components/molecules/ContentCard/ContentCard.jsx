// molecules/ContentCard/ContentCard.jsx
import { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, CardSubtitle } from '../../atoms/Card/Card';
import { Badge } from '../../atoms/Badge/Badge';
import { Image } from '../../atoms/Image/Image';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/standardProps-v2.js';
import { extractDOMPropsV2 } from '../../../tokens/standardProps-v2';
import './ContentCard.css';

/**
 * ContentCard V2 - Molécula del Card System V2 COMPLETAMENTE INTEGRADA
 * 
 * ✅ CARD SYSTEM V2 PERFECTO:
 * - Hook useCardProps-v2 con tokens especializados del Card System
 * - Card V2 + Image V2 trabajando en perfecta armonía
 * - API unificada entre todos los componentes del Card System
 * - Dimensiones automáticas coordinadas
 * - Props consistentes y predecibles
 * - Micro-interactions automáticas
 * 
 * 🎯 Casos de uso:
 * - Grids de películas en HomePage
 * - Listas de series en SeriesPage
 * - Resultados de búsqueda
 * - Recommendations cards
 * - Favorites grids
 */
function ContentCard(props) {
  console.log('🎬 ContentCard V2 RENDER - props recibidas:', props);
  
  // ✅ V2: EXTRAER PROPS ESPECÍFICAS ANTES DEL HOOK V2
  const {
    content,
    // Props deprecadas con warnings
    onPlay, // DEPRECATED: Usar onClick
    onFavorite, // DEPRECATED: Funcionalidad movida a acciones contextuales
    ...restProps
  } = props;

  // ✅ V2: Hook estándar del sistema de diseño - ANTES de cualquier return
  const {
    size, variant, rounded, disabled, loading, className,
    ...standardProps
  } = useInteractiveProps(restProps, {
    componentName: 'ContentCard',
    defaultSize: 'md',
    defaultVariant: 'neutral'
  });
  
  // Validaciones después del hook
  console.log('🔍 ContentCard V2 - content recibido:', content);
  console.log('🔍 ContentCard V2 - content es válido:', !!content);
  
  if (!content) {
    console.log('❌ ContentCard V2 - SIN CONTENT, no se renderiza');
    return null;
  }

  // Warnings para desarrollo en props deprecadas
  if (import.meta.env?.DEV) {
    if (onPlay) {
      console.warn(
        '⚠️ ContentCard V2: "onPlay" prop está DEPRECADA. ' +
        'Usar "onClick" con handlers específicos según contexto.'
      );
    }
    if (onFavorite) {
      console.warn(
        '⚠️ ContentCard V2: "onFavorite" prop está DEPRECADA. ' +
        'Usar acciones contextuales en lugar de props específicas.'
      );
    }
  }
  
  // Extraer props específicas de ContentCard de props originales
  const {
    onClick,
    showRating = true,
    showMeta = true,
    showCategory = true,
    cardVariant = 'elevated',
    contentType = content?.type || 'movie'
  } = props;
  
  // ✅ V2: Extraer props DOM válidas con función V2
  const validDOMProps = extractDOMPropsV2(standardProps);

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

  console.log('📊 ContentCard V2 - datos extraídos:', { title, cover, category, year, rating, type });
  console.log('🖼️ ContentCard V2 - cover URL:', cover);
  console.log('🎯 ContentCard V2 - size:', size);
  console.log('🎯 ContentCard V2 - contentType:', contentType);

  // ✅ V2: Construir clases CSS manualmente
  const cardClasses = [
    'content-card',
    `content-card--${size}`,
    `content-card--${variant}`,
    `content-card--${cardVariant}`,
    `content-card--${contentType}`,
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
    // Image V2 ya maneja los errores automáticamente
  };

  return (
    <Card
      // ✅ V2: Props estándar del sistema
      size={size}
      variant={variant}
      rounded={rounded}
      disabled={disabled}
      loading={loading}
      onClick={handleCardClick}
      className={cardClasses}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`${type === 'movie' ? 'Película' : 'Serie'}: ${title}`}
      aria-disabled={disabled}
      aria-busy={loading}
      {...validDOMProps}
    >
      {/* Contenedor de imagen con Image V2 */}
      <FlexContainer
        align="center"
        justify="center"
        className="content-card__image-container"
      >
        <Image
          src={cover}
          alt={`Carátula de ${title}`}
          aspectRatio="portrait"
          loading={loading ? "eager" : "lazy"}
          size={size}
          variant={variant}
          onError={handleImageError}
          className="content-card__image"
        />

        {/* ✅ V2: Badge con props automáticas del Card System */}
        <div className="content-card__type-badge">
          <Badge
            size={size === 'xs' ? 'xs' : 'sm'}
            variant="primary"
            leftIcon={contentType === 'movie' ? 'film' : 'video'}
          >
            {contentType === 'movie' ? 'Película' : 'Serie'}
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
                size={size === 'xs' ? 'xs' : 'sm'}
                variant="warning"
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
  // ✅ V2: Props estándar del Card System V2
  ...INTERACTIVE_PROP_TYPES,
  
  // Configuración específica de ContentCard
  content: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    category: PropTypes.string,
    year: PropTypes.number.isRequired,
    rating: PropTypes.number,
    type: PropTypes.oneOf(['movie', 'series', 'episode']).isRequired,
    duration: PropTypes.string,
    seasons: PropTypes.number,
    episodes: PropTypes.number
  }).isRequired,
  onClick: PropTypes.func,
  
  // Props de funcionalidad (opcionales, manejadas por Card System)
  showRating: PropTypes.bool,
  showMeta: PropTypes.bool,
  showCategory: PropTypes.bool,
  
  // Props del Card System V2
  cardVariant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'soft']),
  contentType: PropTypes.oneOf(['movie', 'series', 'episode', 'profile', 'banner']),
  
  // Backward compatibility (deprecados con warnings)
  onPlay: PropTypes.func,
  onFavorite: PropTypes.func
};

ContentCard.defaultProps = {
  size: 'md',
  variant: 'neutral',
  cardVariant: 'elevated', 
  disabled: false,
  loading: false,
  showRating: true,
  showMeta: true,
  showCategory: true
};

// ✅ V2: Memoizar ContentCard optimizado para grids de películas/series
const MemoizedContentCard = memo(ContentCard);

export { MemoizedContentCard as ContentCard };