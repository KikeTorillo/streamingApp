// adapters/streamingCardAdapter.js
// ===== DOMAIN ADAPTER PARA STREAMING =====

import { 
  UNIVERSAL_CARD_TOKENS,
  UNIVERSAL_ASPECT_RATIOS 
} from '../tokens/cardTokens-universal';

/**
 * STREAMING DOMAIN ADAPTER
 * 
 * 🎯 OBJETIVO: Adaptar UniversalCard para dominio de streaming
 * ✅ SEPARACIÓN: Lógica de dominio separada del componente universal
 * 🔧 FLEXIBILIDAD: Fácil cambiar configuración sin tocar el componente
 */

// ===== MAPEO DE TIPOS DE CONTENIDO STREAMING → UNIVERSAL =====
export const STREAMING_CONTENT_MAPPING = {
  movie: {
    aspectRatio: 'portrait',     // 2/3 - Posters tradicionales
    defaultSize: 'md',
    placeholder: '🎬',
    title: 'Película'
  },
  series: {
    aspectRatio: 'portrait',     // 2/3 - Posters de series
    defaultSize: 'md', 
    placeholder: '📺',
    title: 'Serie'
  },
  episode: {
    aspectRatio: 'wide',         // 16/9 - Thumbnails de video
    defaultSize: 'lg',
    placeholder: '🎥',
    title: 'Episodio'
  },
  person: {
    aspectRatio: 'square',       // 1/1 - Fotos de perfil
    defaultSize: 'sm',
    placeholder: '👤',
    title: 'Persona'
  },
  banner: {
    aspectRatio: 'ultrawide',    // 21/9 - Banners promocionales
    defaultSize: 'xl',
    placeholder: '🖼️',
    title: 'Banner'
  },
  collection: {
    aspectRatio: 'landscape',    // 3/2 - Colecciones
    defaultSize: 'lg',
    placeholder: '📚',
    title: 'Colección'
  }
};

/**
 * Adaptar props de ContentCard a UniversalCard
 */
export function adaptStreamingContentToUniversal(contentData, options = {}) {
  if (!contentData) return null;
  
  const {
    // Datos del contenido streaming
    id,
    title,
    cover,           // streaming → image
    category,
    year,
    rating,
    type,           // movie/series/episode
    duration,
    seasons,
    episodes,
    description,
    // Cualquier otra prop específica de streaming
    ...streamingSpecificProps
  } = contentData;
  
  // Obtener configuración para el tipo de contenido
  const contentConfig = STREAMING_CONTENT_MAPPING[type] || STREAMING_CONTENT_MAPPING.movie;
  
  // Adaptar a formato universal
  const universalData = {
    // Datos básicos universales
    id,
    title,
    image: cover,        // cover → image (universal)
    description,
    
    // Metadatos universales
    metadata: {
      category,
      year,
          rating,
      duration,
      seasons,
      episodes,
      type,
      // Preservar datos específicos de streaming
      ...streamingSpecificProps
    },
    
    // Configuración visual desde adapter
    aspectRatio: options.aspectRatio || contentConfig.aspectRatio,
    size: options.size || contentConfig.defaultSize,
    placeholder: contentConfig.placeholder,
    contentTypeTitle: contentConfig.title
  };
  
  return universalData;
}

/**
 * Props específicas para streaming que se pueden mostrar
 */
export function getStreamingDisplayProps(metadata, options = {}) {
  const {
    showRating = true,
    showMeta = true,
    showCategory = true,
    showYear = true
  } = options;
  
  const displayProps = [];
  
  // Rating con icono
  if (showRating && metadata.rating) {
    displayProps.push({
      key: 'rating',
      label: `⭐ ${metadata.rating}`,
      value: metadata.rating,
      type: 'rating'
    });
  }
  
  // Categoría
  if (showCategory && metadata.category) {
    displayProps.push({
      key: 'category',
      label: metadata.category,
      value: metadata.category,
      type: 'category'
    });
  }
  
  // Año
  if (showYear && metadata.year) {
    displayProps.push({
      key: 'year',
      label: metadata.year.toString(),
      value: metadata.year,
      type: 'year'
    });
  }
  
  // Metadatos específicos por tipo
  if (showMeta) {
    if (metadata.type === 'movie' && metadata.duration) {
      displayProps.push({
        key: 'duration',
        label: metadata.duration,
        value: metadata.duration,
        type: 'duration'
      });
    }
    
    if (metadata.type === 'series') {
      if (metadata.seasons && metadata.episodes) {
        displayProps.push({
          key: 'seasons-episodes',
          label: `${metadata.seasons} temp. • ${metadata.episodes} ep.`,
          value: { seasons: metadata.seasons, episodes: metadata.episodes },
          type: 'series-meta'
        });
      } else if (metadata.seasons) {
        displayProps.push({
          key: 'seasons',
          label: `${metadata.seasons} temporada${metadata.seasons > 1 ? 's' : ''}`,
          value: metadata.seasons,
          type: 'seasons'
        });
      }
    }
  }
  
  return displayProps;
}

/**
 * Componente adaptador que usa UniversalCard con datos de streaming
 */
export function createStreamingCardComponent(UniversalCard, { 
  UniversalCardHeader, 
  UniversalCardBody, 
  UniversalCardFooter,
  UniversalCardMedia,
  UniversalCardTitle,
  UniversalCardDescription 
}) {
  return function StreamingCard({
    content,
    showRating = true,
    showMeta = true, 
    showCategory = true,
    showYear = true,
    onClick,
    size,
    variant = 'elevated',
    ...universalCardProps
  }) {
    // Adaptar datos de streaming a universal
    const universalData = adaptStreamingContentToUniversal(content, { size });
    
    if (!universalData) return null;
    
    // Obtener props de display
    const displayProps = getStreamingDisplayProps(universalData.metadata, {
      showRating,
      showMeta,
      showCategory,
      showYear
    });
    
    // Handler adaptado
    const handleClick = () => {
      onClick?.(content); // Pasar datos originales de streaming
    };
    
    return (
      <UniversalCard
        size={universalData.size}
        aspectRatio={universalData.aspectRatio}
        variant={variant}
        clickable={!!onClick}
        onClick={handleClick}
        ariaLabel={`${universalData.contentTypeTitle}: ${universalData.title}`}
        {...universalCardProps}
      >
        {/* Media */}
        {universalData.image && (
          <UniversalCardMedia
            src={universalData.image}
            alt={`${universalData.contentTypeTitle} ${universalData.title}`}
            aspectRatio={universalData.aspectRatio}
          />
        )}
        
        {/* Content */}
        <UniversalCardBody>
          <UniversalCardTitle>
            {universalData.title}
          </UniversalCardTitle>
          
          {/* Display props como badges/texto */}
          {displayProps.length > 0 && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem',
              fontSize: '0.875em',
              color: 'var(--text-secondary)'
            }}>
              {displayProps.map(prop => (
                <span key={prop.key}>
                  {prop.label}
                </span>
              ))}
            </div>
          )}
          
          {/* Descripción si existe */}
          {universalData.description && (
            <UniversalCardDescription>
              {universalData.description}
            </UniversalCardDescription>
          )}
        </UniversalCardBody>
      </UniversalCard>
    );
  };
}

/**
 * Ejemplos de uso del adapter
 */
export const STREAMING_ADAPTER_EXAMPLES = {
  movie: {
    id: 1,
    title: "Avengers: Endgame",
    cover: "/images/avengers.jpg",
    type: "movie",
    year: 2019,
    rating: 8.4,
    category: "Acción",
    duration: "3h 1min"
  },
  
  series: {
    id: 2,
    title: "Breaking Bad",
    cover: "/images/breaking-bad.jpg", 
    type: "series",
    year: 2008,
    rating: 9.5,
    category: "Drama",
    seasons: 5,
    episodes: 62
  },
  
  episode: {
    id: 3,
    title: "Pilot",
    cover: "/images/breaking-bad-pilot.jpg",
    type: "episode", 
    year: 2008,
    rating: 8.2,
    category: "Drama",
    duration: "58min",
    season: 1,
    episode_number: 1
  }
};

export default {
  adaptStreamingContentToUniversal,
  getStreamingDisplayProps,
  createStreamingCardComponent,
  STREAMING_CONTENT_MAPPING,
  STREAMING_ADAPTER_EXAMPLES
};
