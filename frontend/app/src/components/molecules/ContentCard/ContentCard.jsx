// molecules/ContentCard/ContentCard.jsx
import { memo } from 'react';
import PropTypes from 'prop-types';
// ✅ DESIGN SYSTEM - LIBRERÍA REUTILIZABLE
import { 
  Card, 
  CardBody, 
  CardTitle, 
  CardSubtitle,
  Badge,
  Image,
  FlexContainer,
  useInteractiveProps,
  INTERACTIVE_PROP_TYPES,
  extractDOMPropsV2
} from '../../../../design-system';
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
    size, variant, rounded, disabled, loading, className
  } = useInteractiveProps(restProps, {
    componentName: 'ContentCard',
    defaultSize: 'md',
    defaultVariant: 'neutral'
  });
  
  // Validaciones después del hook
  
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
  
  // Extraer datos del content después de validación
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
  
  // Extraer props específicas de ContentCard de props originales
  const {
    onClick,
    showRating = true,
    showMeta = true,
    showCategory = true,
    cardVariant = 'elevated',
    contentType = content?.type || 'movie'
  } = props;
  

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
  
  // ✅ V2: Construir clases CSS usando patrón estándar del sistema
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

  // ✅ V2: Preparar props para Card - usar restProps en lugar de re-filtrar
  const cardProps = {
    ...restProps,
    size,
    variant,
    rounded,
    disabled,
    loading,
    onClick: handleCardClick,
    className: cardClasses,
    tabIndex: disabled ? -1 : 0,
    role: "button",
    'aria-label': `${type === 'movie' ? 'Película' : 'Serie'}: ${title}`,
    'aria-disabled': disabled,
    'aria-busy': loading
  };

  // Renderizar ContentCard con sistema V2.0
  
  return (
    <Card {...cardProps}>
      {/* Contenedor de imagen */}
      <div className="content-card__image-container" style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
        <Image
          src={cover}
          alt={`Carátula de ${title}`}
          aspectRatio="portrait"
          lazy={!loading}
          size={size}
          variant={variant}
          onError={handleImageError}
          onLoad={() => {}}
          className="content-card__image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Badge de tipo */}
        <div className="content-card__type-badge" style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2 }}>
          <Badge
            size={size === 'xs' ? 'xs' : 'sm'}
            variant="primary"
            leftIcon={contentType === 'movie' ? 'film' : 'video'}
          >
            {contentType === 'movie' ? 'Película' : 'Serie'}
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

        {/* Metadatos simples */}
        <div className="content-card__details">
          {showMeta && (
            <span className="content-card__duration">
              {getMetaText()}
            </span>
          )}
          
          {showRating && rating && (
            <Badge
              size={size === 'xs' ? 'xs' : 'sm'}
              variant="warning"
              leftIcon="star"
            >
              {rating}
            </Badge>
          )}
        </div>
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