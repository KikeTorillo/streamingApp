import PropTypes from 'prop-types';
import './Skeleton.css';

/**
 * Skeleton - Átomo para estados de carga elegantes
 * 
 * Características:
 * - ✅ Múltiples variantes (text, avatar, image, card)
 * - ✅ Tamaños configurables (xs, sm, md, lg, xl)
 * - ✅ Líneas múltiples para texto
 * - ✅ Formas personalizables (rectangular, circular, redondeado)
 * - ✅ Animación shimmer suave
 * - ✅ Aspect ratio configurable para imágenes
 * - ✅ Composición flexible
 * - ✅ Responsive y accesible
 * 
 * @param {'text'|'avatar'|'image'|'card'|'custom'} [variant='text'] - Tipo de skeleton
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño base
 * @param {number} [lines=1] - Número de líneas (solo para variant="text")
 * @param {'rectangular'|'rounded'|'circular'} [shape='rounded'] - Forma del skeleton
 * @param {string|number} [width] - Ancho personalizado (CSS value)
 * @param {string|number} [height] - Alto personalizado (CSS value)
 * @param {string} [aspectRatio] - Aspect ratio (ej: "16/9", "4/3", "1/1")
 * @param {boolean} [animate=true] - Habilitar animación shimmer
 * @param {string} [className=''] - Clases CSS adicionales
 * @param {string} [ariaLabel] - Etiqueta de accesibilidad
 */
function Skeleton({
  variant = 'text',
  size = 'md',
  lines = 1,
  shape = 'rounded',
  width,
  height,
  aspectRatio,
  animate = true,
  className = '',
  ariaLabel,
  style = {},
  ...restProps
}) {
  // Generar clases CSS
  const skeletonClasses = [
    'skeleton',
    `skeleton--variant-${variant}`,
    `skeleton--size-${size}`,
    `skeleton--shape-${shape}`,
    animate && 'skeleton--animate',
    className
  ].filter(Boolean).join(' ');

  // Estilos dinámicos
  const dynamicStyles = {
    ...style,
    ...(width && { width }),
    ...(height && { height }),
    ...(aspectRatio && { aspectRatio })
  };

  // Props de accesibilidad
  const accessibilityProps = {
    'aria-label': ariaLabel || 'Cargando contenido',
    'aria-busy': 'true',
    'role': 'status',
    ...restProps
  };

  // Para múltiples líneas de texto
  if (variant === 'text' && lines > 1) {
    return (
      <div 
        className="skeleton-group"
        {...accessibilityProps}
      >
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={skeletonClasses}
            style={{
              ...dynamicStyles,
              // La última línea es más corta para simular texto real
              ...(index === lines - 1 && !width && {
                width: `${60 + Math.random() * 30}%`
              })
            }}
          />
        ))}
      </div>
    );
  }

  // Skeleton individual
  return (
    <div 
      className={skeletonClasses}
      style={dynamicStyles}
      {...accessibilityProps}
    />
  );
}

Skeleton.propTypes = {
  /** Tipo de skeleton */
  variant: PropTypes.oneOf(['text', 'avatar', 'image', 'card', 'custom']),
  
  /** Tamaño base del skeleton */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  
  /** Número de líneas (solo para variant="text") */
  lines: PropTypes.number,
  
  /** Forma del skeleton */
  shape: PropTypes.oneOf(['rectangular', 'rounded', 'circular']),
  
  /** Ancho personalizado */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  /** Alto personalizado */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  /** Aspect ratio (ej: "16/9") */
  aspectRatio: PropTypes.string,
  
  /** Habilitar animación shimmer */
  animate: PropTypes.bool,
  
  /** Clases CSS adicionales */
  className: PropTypes.string,
  
  /** Etiqueta de accesibilidad */
  ariaLabel: PropTypes.string,
  
  /** Estilos CSS inline */
  style: PropTypes.object
};

// Componentes de conveniencia
Skeleton.Text = function SkeletonText({ lines = 1, ...props }) {
  return <Skeleton variant="text" lines={lines} {...props} />;
};

Skeleton.Avatar = function SkeletonAvatar({ size = 'md', ...props }) {
  return <Skeleton variant="avatar" shape="circular" size={size} {...props} />;
};

Skeleton.Image = function SkeletonImage({ aspectRatio = '16/9', ...props }) {
  return <Skeleton variant="image" aspectRatio={aspectRatio} {...props} />;
};

Skeleton.Card = function SkeletonCard({ ...props }) {
  return <Skeleton variant="card" {...props} />;
};

export { Skeleton };