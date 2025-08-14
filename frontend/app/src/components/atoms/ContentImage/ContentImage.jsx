// atoms/ContentImage/ContentImage.jsx
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useStandardProps } from '../../../hooks/useStandardProps.jsx';
import { STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens/standardProps.js';
import './ContentImage.css';

/**
 * ContentImage - Átomo del Sistema de Diseño
 * 
 * Componente especializado para imágenes de contenido multimedia con fallbacks inteligentes,
 * estados de loading y optimizaciones de performance.
 * 
 * ✅ CARACTERÍSTICAS DEL SISTEMA:
 * - Props estándar: size, variant, rounded, disabled, loading
 * - Tokens CSS del sistema de diseño
 * - Sistema de iconos integrado
 * - Accesibilidad completa (ARIA, navegación por teclado)
 * - Performance optimizada (lazy loading, memoización)
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo para accesibilidad
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño según sistema de diseño
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante semántica
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Border radius del sistema
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.loading=false] - Estado de carga del sistema
 * @param {'1/1'|'4/3'|'3/2'|'16/9'|'2/3'|'3/4'|'auto'} [props.aspectRatio='2/3'] - Proporción de aspecto
 * @param {'cover'|'contain'|'fill'|'scale-down'|'none'} [props.objectFit='cover'] - Comportamiento de ajuste
 * @param {'eager'|'lazy'} [props.imageLoading='lazy'] - Estrategia de carga
 * @param {'high'|'low'|'auto'} [props.fetchPriority='auto'] - Prioridad de descarga
 * @param {function} [props.onLoad] - Callback cuando la imagen carga
 * @param {function} [props.onError] - Callback cuando la imagen falla
 * @param {string} [props.placeholder] - Texto para placeholder (emoji o texto corto)
 * @param {'movie'|'series'|'generic'} [props.contentType='generic'] - Tipo de contenido para fallback
 * @param {boolean} [props.showFallback=true] - Si mostrar fallback en error
 * @param {boolean} [props.blur=false] - Si aplicar blur (para loading progresivo)
 * @param {string} [props.className=''] - Clases CSS adicionales del sistema
 * @param {string} [props.testId] - ID para testing
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 */
const ContentImage = (props) => {
  const {
    src,
    alt,
    // Props específicas de ContentImage
    aspectRatio = '2/3',
    objectFit = 'cover', 
    imageLoading = 'lazy',
    fetchPriority = 'auto',
    onLoad,
    onError,
    placeholder,
    contentType = 'generic',
    showFallback = true,
    blur = false,
    // Props del sistema de diseño (manejadas por useStandardProps)
    size,
    variant,
    rounded,
    disabled,
    loading,
    className,
    testId,
    ariaLabel,
    // Props restantes
    ...restProps
  } = useStandardProps(props, {
    componentType: 'content-image',
    defaultSize: 'md', // Restaurar defaultSize para consistencia
    defaultVariant: 'primary',
    defaultRounded: 'md'
  });
  const [imageState, setImageState] = useState(src ? 'loading' : 'error'); // 'loading' | 'loaded' | 'error'
  const [imageSrc, setImageSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);
  const prevSrcRef = useRef(src);

  // Actualizar imageSrc cuando cambie el prop src
  useEffect(() => {
    if (src !== prevSrcRef.current) {
      prevSrcRef.current = src;
      setImageSrc(src);
      setImageState('loading');
      setHasErrored(false); // Resetear error state
    }
  }, [src]);

  // Generar placeholder SVG según tipo de contenido
  const generateFallbackSvg = () => {
    const icons = {
      movie: '🎬',
      series: '📺',
      generic: '🖼️'
    };
    
    const icon = placeholder || icons[contentType] || icons.generic;
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%23f3f4f6'/%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23374151' font-family='Arial, sans-serif' font-size='24'%3E${icon}%3C/text%3E%3Ctext x='150' y='250' text-anchor='middle' fill='%23374151' font-family='Arial, sans-serif' font-size='12'%3ESin imagen%3C/text%3E%3C/svg%3E`;
  };

  // Handlers
  const handleImageLoad = (e) => {
    setImageState('loaded');
    onLoad?.(e);
  };

  const handleImageError = (e) => {
    // Solo manejar el error si no hemos fallado antes
    if (!hasErrored) {
      setImageState('error');
      setHasErrored(true);
      
      if (showFallback) {
        setImageSrc(generateFallbackSvg());
      }
    }
    
    onError?.(e);
  };

  // Construir clases CSS con sistema de diseño
  const imageClasses = [
    'content-image',
    // Siempre aplicar tamaño (ya sea especificado o por defecto)
    `content-image--size-${size}`,
    `content-image--variant-${variant}`,
    `content-image--aspect-${aspectRatio.replace('/', '-')}`,
    `content-image--fit-${objectFit}`,
    rounded !== 'md' && `content-image--rounded-${rounded}`,
    blur && 'content-image--blur',
    imageState === 'loading' && 'content-image--loading',
    imageState === 'error' && 'content-image--error',
    (disabled || loading) && 'content-image--disabled',
    loading && 'content-image--system-loading',
    className
  ].filter(Boolean).join(' ');  
  
  // Extraer props seguras para DOM (sin className)
  const domProps = extractDOMProps({
    ...restProps,
    'aria-label': ariaLabel,
    'data-testid': testId
  });

  return (
    <div
      {...domProps}
      className={imageClasses}
      aria-disabled={disabled}
      role="img"
    >
      {/* Skeleton de carga */}
      {imageState === 'loading' && (
        <div className="content-image__skeleton">
          <div className="content-image__skeleton-icon">
            {placeholder || '⏳'}
          </div>
        </div>
      )}

      {/* Imagen principal */}
      <img
        src={imageSrc}
        alt={alt}
        className="content-image__img"
        loading={imageLoading}
        fetchPriority={fetchPriority}
        onLoad={handleImageLoad}
        onError={handleImageError}
        draggable={false}
        aria-hidden={disabled}
      />

      {/* Indicador de error (opcional) */}
      {imageState === 'error' && !showFallback && (
        <div className="content-image__error-state">
          <span className="content-image__error-icon">⚠️</span>
          <span className="content-image__error-text">Error al cargar</span>
        </div>
      )}
    </div>
  );
};

ContentImage.propTypes = {
  // Props requeridas
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  
  // Props estándar del sistema de diseño
  ...STANDARD_PROP_TYPES,
  
  // Props específicas de ContentImage
  aspectRatio: PropTypes.oneOf(['1/1', '4/3', '3/2', '16/9', '2/3', '3/4', 'auto']),
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'scale-down', 'none']),
  imageLoading: PropTypes.oneOf(['eager', 'lazy']),
  fetchPriority: PropTypes.oneOf(['high', 'low', 'auto']),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  placeholder: PropTypes.string,
  contentType: PropTypes.oneOf(['movie', 'series', 'generic']),
  showFallback: PropTypes.bool,
  blur: PropTypes.bool
};

ContentImage.defaultProps = {
  size: 'md', // Tamaño estándar: 256px para carátulas
  variant: 'primary', 
  rounded: 'md',
  disabled: false,
  loading: false,
  aspectRatio: '2/3',
  objectFit: 'cover',
  imageLoading: 'lazy',
  fetchPriority: 'auto',
  contentType: 'generic',
  showFallback: true,
  blur: false,
  className: ''
};

export { ContentImage };