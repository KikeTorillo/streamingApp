// atoms/ContentImage/ContentImage.jsx
import PropTypes from 'prop-types';
import { UniversalImage } from '../UniversalImage/UniversalImage';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import './ContentImage.css';

/**
 * ContentImage V3 - ADAPTER PARA RETROCOMPATIBILIDAD
 * 
 * ✅ MIGRADO A UNIVERSALIMAGE:
 * - Wrapper del proyecto streaming sobre UniversalImage universal
 * - Mapeo automático contentType → aspectRatio universal
 * - Mantiene API existente para compatibilidad total
 * - Placeholders específicos del dominio streaming
 * 
 * 🎯 Casos de uso (streaming específico):
 * - Carátulas de películas/series → aspectRatio="portrait"
 * - Thumbnails de episodios → aspectRatio="wide"
 * - Avatares de perfil → aspectRatio="square"
 * - Banners promocionales → aspectRatio="ultrawide"
 * 
 * 🚀 VENTAJAS DEL ADAPTER:
 * - Base universal reutilizable (UniversalImage)
 * - Lógica específica streaming encapsulada
 * - Migración gradual sin breaking changes
 * - Preparado para extracción de librería
 */
const ContentImage = (props) => {
  // Extraer props específicas del dominio streaming
  const {
    contentType = 'movie', // Props específica streaming
    placeholder,
    ...universalProps
  } = props;

  // ✅ MAPEO STREAMING → UNIVERSAL
  const aspectRatioMap = {
    movie: 'portrait',     // 2:3 - Carátulas películas
    series: 'portrait',    // 2:3 - Carátulas series  
    episode: 'wide',       // 16:9 - Thumbnails episodios
    profile: 'square',     // 1:1 - Avatares perfil
    banner: 'ultrawide'    // 21:9 - Banners promocionales
  };

  // ✅ PLACEHOLDERS ESPECÍFICOS STREAMING
  const placeholderMap = {
    movie: '🎬',
    series: '📺', 
    episode: '🎥',
    profile: '👤',
    banner: '🖼️'
  };

  // Determinar aspectRatio y placeholder universales
  const aspectRatio = aspectRatioMap[contentType] || 'portrait';
  const finalPlaceholder = placeholder || placeholderMap[contentType] || '🖼️';

  // Debug logs del adapter
  if (import.meta.env?.DEV) {
    console.log('🔄 ContentImage ADAPTER:', { 
      contentType, 
      mappedAspectRatio: aspectRatio,
      finalPlaceholder 
    });
  }

  // Delegar a UniversalImage con props mapeadas
  return (
    <UniversalImage
      {...universalProps}
      aspectRatio={aspectRatio}
      placeholder={finalPlaceholder}
    />
  );
};

ContentImage.propTypes = {
  // Props requeridas (delegadas a UniversalImage)
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  
  // Props estándar del sistema (delegadas)
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas streaming (adaptadas)
  contentType: PropTypes.oneOf(['movie', 'series', 'episode', 'profile', 'banner']),
  placeholder: PropTypes.string,
  
  // Props de UniversalImage (delegadas automáticamente)
  imageLoading: PropTypes.oneOf(['eager', 'lazy']),
  fetchPriority: PropTypes.oneOf(['high', 'low', 'auto']),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  showFallback: PropTypes.bool,
  blur: PropTypes.bool,
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'scale-down', 'none'])
};

ContentImage.defaultProps = {
  // Defaults específicos streaming (mantener compatibilidad)
  contentType: 'movie',
  size: 'md',
  variant: 'neutral',
  rounded: 'md',
  disabled: false,
  loading: false,
  
  // Defaults delegados a UniversalImage
  imageLoading: 'lazy',
  fetchPriority: 'auto',
  showFallback: true,
  blur: false,
  objectFit: 'cover'
};

export { ContentImage };