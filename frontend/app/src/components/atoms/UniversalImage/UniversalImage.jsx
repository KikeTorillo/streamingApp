// atoms/UniversalImage/UniversalImage.jsx
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useUniversalImageProps } from '../../../hooks/useUniversalImageProps';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import { UNIVERSAL_ASPECT_RATIOS } from '../../../tokens/cardTokens-universal.js';
import './UniversalImage.css';

/**
 * UniversalImage - Componente Universal para Cualquier Dominio
 * 
 * ✅ 100% UNIVERSAL:
 * - Sin acoplamientos a streaming, e-commerce, etc.
 * - API limpia con aspectRatio directo
 * - Placeholders configurables
 * - Compatible con cualquier proyecto
 * 
 * 🎯 Casos de uso universales:
 * - Productos (e-commerce): aspectRatio="portrait"
 * - Avatares (cualquier app): aspectRatio="square"  
 * - Banners (cualquier web): aspectRatio="wide"
 * - Contenido multimedia: aspectRatio personalizado
 */
const UniversalImage = (props) => {
  // Extraer props específicas ANTES del hook
  const {
    src,
    alt,
    // Props específicas de UniversalImage
    aspectRatio = 'portrait',
    placeholder = '🖼️',
    objectFit = 'cover',
    imageLoading = 'lazy',
    fetchPriority = 'auto',
    onLoad,
    onError,
    showFallback = true,
    blur = false,
    // Props restantes para el hook universal
    ...restProps
  } = props;

  // Hook universal SIN dependencias específicas
  const {
    // Tokens universales
    cardSize,
    generateStyles,
    generateClassName,
    
    // Props estándar del sistema
    size, variant, disabled,
    
    // Props DOM limpias
    ...standardProps
  } = useUniversalImageProps(restProps, {
    componentName: 'UniversalImage',
    aspectRatio,
    defaultSize: 'md'
  });

  const [imageState, setImageState] = useState(src ? 'loading' : 'error'); // 'loading' | 'loaded' | 'error'
  const [imageSrc, setImageSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);
  const prevSrcRef = useRef(src);

  // Debug logs en desarrollo
  useEffect(() => {
    if (import.meta.env?.DEV) {
      console.log('🔍 UniversalImage props:', { src, alt, aspectRatio, size, variant });
      console.log('🔍 UniversalImage cardSize:', cardSize);
      console.log('🖼️ UniversalImage imageSrc:', imageSrc);
    }
  }, [src, alt, aspectRatio, size, variant, imageSrc, cardSize]);

  // Actualizar imageSrc cuando cambie el prop src
  useEffect(() => {
    if (src !== prevSrcRef.current) {
      prevSrcRef.current = src;
      setImageSrc(src);
      setImageState('loading');
      setHasErrored(false);
    }
  }, [src]);

  // Generar placeholder SVG universal
  const generateFallbackSvg = () => {
    const fallbackIcon = placeholder || '🖼️';
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%23f3f4f6'/%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23374151' font-family='Arial, sans-serif' font-size='24'%3E${fallbackIcon}%3C/text%3E%3Ctext x='150' y='250' text-anchor='middle' fill='%23374151' font-family='Arial, sans-serif' font-size='12'%3ESin imagen%3C/text%3E%3C/svg%3E`;
  };

  // Handlers
  const handleImageLoad = (e) => {
    setImageState('loaded');
    
    if (import.meta.env?.DEV) {
      console.log('✅ UniversalImage loaded successfully:', src);
    }
    
    onLoad?.(e);
  };

  const handleImageError = (e) => {
    if (!hasErrored) {
      setImageState('error');
      setHasErrored(true);
      
      if (import.meta.env?.DEV) {
        console.error('❌ UniversalImage failed to load:', src);
        console.error('Error details:', e);
      }
      
      if (showFallback) {
        setImageSrc(generateFallbackSvg());
      }
    }
    
    onError?.(e);
  };

  // Construir clases CSS universales
  const imageClasses = generateClassName('universal-image', [
    `universal-image--size-${size}`,
    `universal-image--variant-${variant}`,
    `universal-image--aspect-${aspectRatio.replace('/', '-')}`,
    `universal-image--object-fit-${objectFit}`,
    {
      'universal-image--loading': imageState === 'loading',
      'universal-image--loaded': imageState === 'loaded',
      'universal-image--error': imageState === 'error',
      'universal-image--blur': blur,
      'universal-image--disabled': disabled
    }
  ]);

  // Obtener aspect ratio real
  const actualAspectRatio = UNIVERSAL_ASPECT_RATIOS[aspectRatio] || aspectRatio;

  return (
    <div
      style={generateStyles({
        // Usar dimensiones calculadas universalmente
        width: cardSize.width,
        aspectRatio: actualAspectRatio,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-muted, #f5f5f5)'
      })}
      className={imageClasses}
      {...standardProps}
    >
      {/* Skeleton de carga */}
      {imageState === 'loading' && (
        <div className="universal-image__skeleton">
          <div className="universal-image__skeleton-icon">
            {placeholder || '⏳'}
          </div>
        </div>
      )}

      {/* Imagen principal */}
      <img
        src={imageSrc}
        alt={alt}
        className="universal-image__img"
        loading={imageLoading}
        fetchPriority={fetchPriority}
        onLoad={handleImageLoad}
        onError={handleImageError}
        draggable={false}
        aria-hidden={disabled}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: objectFit
        }}
      />

      {/* Fallback en caso de error */}
      {imageState === 'error' && showFallback && (
        <img
          src={generateFallbackSvg()}
          alt={`Imagen no disponible: ${alt}`}
          className="universal-image__fallback"
          draggable={false}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}

      {/* Overlay de disabled */}
      {disabled && (
        <div className="universal-image__disabled-overlay" />
      )}
    </div>
  );
};

UniversalImage.propTypes = {
  // Props requeridas
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  
  // Props estándar del sistema de diseño universal
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas universales
  aspectRatio: PropTypes.oneOfType([
    PropTypes.oneOf(Object.keys(UNIVERSAL_ASPECT_RATIOS)),
    PropTypes.string // Para aspect ratios personalizados como "4/3"
  ]),
  placeholder: PropTypes.string,
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'scale-down', 'none']),
  imageLoading: PropTypes.oneOf(['eager', 'lazy']),
  fetchPriority: PropTypes.oneOf(['high', 'low', 'auto']),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  showFallback: PropTypes.bool,
  blur: PropTypes.bool
};

UniversalImage.defaultProps = {
  size: 'md',
  variant: 'neutral', 
  rounded: 'md',
  disabled: false,
  loading: false,
  aspectRatio: 'portrait',
  placeholder: '🖼️',
  objectFit: 'cover',
  imageLoading: 'lazy',
  fetchPriority: 'auto',
  showFallback: true,
  blur: false
};

export { UniversalImage };