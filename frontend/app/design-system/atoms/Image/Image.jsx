// src/components/atoms/Image/Image.jsx - MIGRADO AL SISTEMA ESTÁNDAR
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useInteractiveProps, extractDOMPropsV2, INTERACTIVE_PROP_TYPES } from '../../index.js';
import './Image.css';

/**
 * Image - MIGRADO Y RENOMBRADO (antes UniversalImage)
 * 
 * ✅ SISTEMA ESTÁNDAR: useInteractiveProps estándar
 * ✅ ASPECT RATIOS: Inline (eliminado tokens propios)
 * ✅ CSS LIMPIO: .image nomenclatura estándar
 * ✅ LOADING ESTÁNDAR: Sistema unificado
 * ✅ PROPS API: size, variant, rounded, disabled, loading
 * ✅ ACCESIBILIDAD: ARIA completo, lazy loading
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.src - URL de la imagen (requerida)
 * @param {string} [props.alt] - Texto alternativo para accesibilidad
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño estándar del sistema
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='neutral'] - Variante semántica estándar
 * @param {'none'|'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'full'} [props.rounded='md'] - Radio de bordes estándar
 * @param {'square'|'portrait'|'landscape'|'wide'|'ultrawide'|'golden'|'auto'} [props.aspectRatio='auto'] - Relación de aspecto
 * @param {'fill'|'cover'|'contain'|'scale-down'|'none'} [props.objectFit='cover'] - Ajuste de la imagen
 * @param {'top'|'center'|'bottom'|'left'|'right'} [props.objectPosition='center'] - Posición de la imagen
 * @param {boolean} [props.lazy=true] - Carga diferida (lazy loading)
 * @param {boolean} [props.loading=false] - Estado de carga estándar del sistema
 * @param {boolean} [props.disabled=false] - Estado deshabilitado estándar
 * @param {function} [props.onClick] - Función a ejecutar al hacer clic
 * @param {function} [props.onLoad] - Callback cuando la imagen carga exitosamente
 * @param {function} [props.onError] - Callback cuando la imagen falla al cargar
 * @param {string|React.ReactNode} [props.fallback] - Contenido a mostrar si la imagen falla
 * @param {string|React.ReactNode} [props.placeholder] - Contenido a mostrar mientras carga
 */
function Image(props) {
  
  // ✅ EXTRAER PROPS ESPECÍFICAS ANTES DEL HOOK
  const {
    src,
    alt,
    aspectRatio = 'auto',
    objectFit = 'cover',
    objectPosition = 'center',
    lazy = true,
    onClick,
    onLoad,
    onError,
    fallback,
    placeholder,
    ariaLabel,
    style,
    ...propsForHook
  } = props;
  
  // ✅ HOOK ESTÁNDAR PARA CONSISTENCIA TOTAL
  const {
    size, variant, rounded, disabled, loading, className,
    renderIcon, tokens, ...restProps
  } = useInteractiveProps(propsForHook, {
    componentName: 'Image',
    defaultSize: 'md',
    defaultVariant: 'neutral',
    defaultRounded: 'md'
  });
  

  // Estados locales - MOVER ANTES DE SU USO
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // ✅ FILTRAR PROPS DOM - Solo props válidas van al DOM
  const safeDOMProps = extractDOMPropsV2(restProps);
  

  // ✅ ASPECT RATIOS INLINE - Sin dependencias externas
  const aspectRatios = {
    square: '1/1',
    portrait: '2/3',
    landscape: '3/2',
    wide: '16/9',
    ultrawide: '21/9',
    golden: '1.618/1',
    auto: 'auto'
  };

  // ✅ CLASES CSS CONSTRUIDAS MANUALMENTE
  const imageClasses = [
    'image',
    `image--${size}`,
    `image--${variant}`,
    `image--rounded-${rounded}`,
    disabled && 'image--disabled',
    loading && 'image--system-loading',
    imageLoaded && 'image--loaded',
    imageError && 'image--error',
    onClick && !disabled && 'image--clickable',
    className
  ].filter(Boolean).join(' ');

  // Handlers
  const handleImageLoad = (event) => {
    setImageLoaded(true);
    setIsImageLoading(false);
    setImageError(false);
    onLoad?.(event);
  };

  const handleImageError = (event) => {
    setImageError(true);
    setIsImageLoading(false);
    setImageLoaded(false);
    onError?.(event);
  };

  const handleClick = (event) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  const handleKeyDown = (event) => {
    if (disabled || loading) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event);
    }
  };

  const isInteractive = Boolean(onClick && !disabled && !loading);
  const finalAlt = alt || ariaLabel || 'Imagen';
  const finalAriaLabel = ariaLabel || alt;

  return (
    <div 
      className={imageClasses}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={finalAriaLabel}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      style={{
        aspectRatio: aspectRatios[aspectRatio] !== 'auto' ? aspectRatios[aspectRatio] : undefined,
        ...style
      }}
      {...safeDOMProps}
    >
      {/* Contenedor de la imagen */}
      <div className="image__container">
        {/* Imagen principal */}
        {src && !imageError && (
          <img
            src={src}
            alt={finalAlt}
            loading={lazy ? 'lazy' : 'eager'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="image__element"
            style={{
              objectFit,
              objectPosition
            }}
          />
        )}

        {/* Estado de carga */}
        {(isImageLoading || loading) && !imageError && (
          <div className="image__loading">
            {placeholder || (
              <div className="image__loading-content">
                {renderIcon('image')}
              </div>
            )}
          </div>
        )}

        {/* Estado de error/fallback */}
        {imageError && (
          <div className="image__error">
            {fallback || (
              <div className="image__error-content">
                {renderIcon('image-off')}
                <span className="image__error-text">Error al cargar imagen</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading overlay del sistema */}
      {loading && (
        <div className="image__system-loading-overlay">
          <div className="image__system-loading-spinner">
            {renderIcon('loading')}
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ PROP TYPES ESTÁNDAR DEL SISTEMA
Image.propTypes = {
  // Props estándar del sistema
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas de Image
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  aspectRatio: PropTypes.oneOf(['square', 'portrait', 'landscape', 'wide', 'ultrawide', 'golden', 'auto']),
  objectFit: PropTypes.oneOf(['fill', 'cover', 'contain', 'scale-down', 'none']),
  objectPosition: PropTypes.oneOf(['top', 'center', 'bottom', 'left', 'right']),
  lazy: PropTypes.bool,
  onClick: PropTypes.func,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  fallback: PropTypes.node,
  placeholder: PropTypes.node,
  ariaLabel: PropTypes.string,
  style: PropTypes.object
};

Image.defaultProps = {
  size: 'md',
  variant: 'neutral',
  rounded: 'md',
  aspectRatio: 'auto',
  objectFit: 'cover',
  objectPosition: 'center',
  lazy: true,
  disabled: false,
  loading: false
};

export { Image };
