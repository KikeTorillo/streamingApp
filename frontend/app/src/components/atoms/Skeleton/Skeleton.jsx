import PropTypes from 'prop-types';
import { memo } from 'react';
import { useSkeletonProps } from '../../../hooks/useStandardProps.jsx';
import { extractDOMProps, STANDARD_PROP_TYPES } from '../../../tokens/standardProps.js';
import './Skeleton.css';

/**
 * Skeleton - Átomo para estados de carga elegantes
 * 
 * Sistema estándar migrado:
 * - ✅ Props estándar (size, variant, rounded, loading, disabled)
 * - ✅ Hook useSkeletonProps() integrado
 * - ✅ 6 variantes semánticas (primary, secondary, success, danger, warning, neutral)
 * - ✅ Design tokens automáticos
 * - ✅ Estados loading/disabled con overlays
 * - ✅ Backward compatibility con deprecation warnings
 * - ✅ Performance optimizada con memoización
 * 
 * Características preservadas:
 * - ✅ Múltiples variantes funcionales (text, avatar, image, card, custom)
 * - ✅ Líneas múltiples para texto
 * - ✅ Animación shimmer suave
 * - ✅ Aspect ratio configurable
 * - ✅ Componentes de conveniencia (Skeleton.Text, .Avatar, etc.)
 * - ✅ Responsive y accesible
 * 
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño estándar del skeleton
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'neutral'} [variant='neutral'] - Variante semántica
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [rounded='md'] - Radio de bordes estándar
 * @param {boolean} [loading=false] - Estado de carga (controla animación)
 * @param {boolean} [disabled=false] - Estado deshabilitado
 * @param {'text'|'avatar'|'image'|'card'|'custom'} [skeletonVariant='text'] - Tipo funcional de skeleton
 * @param {number} [lines=1] - Número de líneas (solo para skeletonVariant="text")
 * @param {'rectangular'|'rounded'|'circular'} [shape='rounded'] - Forma del skeleton (legacy)
 * @param {string|number} [width] - Ancho personalizado (CSS value)
 * @param {string|number} [height] - Alto personalizado (CSS value)
 * @param {string} [aspectRatio] - Aspect ratio (ej: "16/9", "4/3", "1/1")
 * @param {boolean} [animate=true] - Habilitar animación shimmer (legacy)
 * @param {string} [className=''] - Clases CSS adicionales
 * @param {string} [ariaLabel] - Etiqueta de accesibilidad
 */
function Skeleton({
  // Props estándar del sistema
  size,
  variant,
  rounded,
  loading,
  disabled,
  className,
  
  // Props específicas de Skeleton
  skeletonVariant = 'text', // Separado del variant semántico
  lines = 1,
  width,
  height,
  aspectRatio,
  
  // Props legacy con deprecation warnings
  variant: legacyVariant, // Para detectar uso legacy
  shape = 'rounded', // Legacy prop
  animate = true, // Legacy prop
  
  // Props de accesibilidad
  ariaLabel,
  style = {},
  ...restProps
}) {
  // Hook especializado para props estándar y tokens
  const {
    size: finalSize,
    variant: finalVariant,
    rounded: finalRounded,
    loading: finalLoading,
    disabled: finalDisabled,
    className: standardClassName,
    tokens
  } = useSkeletonProps({
    size,
    variant,
    rounded,
    loading,
    disabled,
    className
  });
  
  // Backward compatibility: detectar y mapear uso legacy
  let resolvedSkeletonVariant = skeletonVariant;
  
  // Si se pasa variant como primera prop (uso legacy), mapear a skeletonVariant
  if (legacyVariant && ['text', 'avatar', 'image', 'card', 'custom'].includes(legacyVariant)) {
    console.warn(`[Skeleton] DEPRECATION: usar 'variant="${legacyVariant}"' está deprecado. Usar 'skeletonVariant="${legacyVariant}"' en su lugar. La prop 'variant' ahora controla variantes semánticas (primary, secondary, success, etc.).`);
    resolvedSkeletonVariant = legacyVariant;
  }
  
  // Backward compatibility: mapear shape a rounded
  let resolvedRounded = finalRounded;
  if (shape && shape !== 'rounded') {
    console.warn(`[Skeleton] DEPRECATION: prop 'shape="${shape}"' está deprecada. Usar 'rounded' con valores estándar del sistema en su lugar.`);
    const shapeToRoundedMap = {
      'rectangular': 'sm',
      'circular': 'full',
      'rounded': 'md'
    };
    resolvedRounded = shapeToRoundedMap[shape] || finalRounded;
  }
  
  // Control de animación: usar loading para controlar animación (nuevo) o animate (legacy)
  const shouldAnimate = finalLoading !== false ? finalLoading : animate;
  
  // Extraer props DOM válidas
  const domProps = extractDOMProps(restProps);
  // Generar clases CSS con sistema estándar
  const skeletonClasses = [
    'skeleton',
    `skeleton--skeleton-variant-${resolvedSkeletonVariant}`, // Variante funcional
    `skeleton--size-${finalSize}`, // Tamaño estándar
    `skeleton--variant-${finalVariant}`, // Variante semántica
    `skeleton--rounded-${resolvedRounded}`, // Radio estándar
    shouldAnimate && 'skeleton--animate',
    finalLoading && 'skeleton--loading',
    finalDisabled && 'skeleton--disabled',
    standardClassName
  ].filter(Boolean).join(' ');

  // Estilos dinámicos con tokens del sistema
  const dynamicStyles = {
    // Tokens automáticos del sistema
    ...tokens,
    // Estilos custom del usuario
    ...style,
    // Dimensiones personalizadas
    ...(width && { width }),
    ...(height && { height }),
    ...(aspectRatio && { aspectRatio })
  };

  // Props de accesibilidad mejoradas
  const accessibilityProps = {
    'aria-label': ariaLabel || (finalLoading ? 'Cargando contenido' : 'Contenido placeholder'),
    'aria-busy': finalLoading ? 'true' : 'false',
    'aria-disabled': finalDisabled ? 'true' : undefined,
    'role': 'status',
    'data-testid': restProps.testId,
    ...domProps
  };

  // Para múltiples líneas de texto
  if (resolvedSkeletonVariant === 'text' && lines > 1) {
    return (
      <div 
        className={`skeleton-group skeleton-group--variant-${finalVariant} skeleton-group--size-${finalSize}`}
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
        
        {/* Overlay para estado disabled */}
        {finalDisabled && (
          <div className="skeleton__overlay skeleton__overlay--disabled" />
        )}
      </div>
    );
  }

  // Skeleton individual
  return (
    <div 
      className={skeletonClasses}
      style={dynamicStyles}
      {...accessibilityProps}
    >
      {/* Overlay para estado disabled */}
      {finalDisabled && (
        <div className="skeleton__overlay skeleton__overlay--disabled" />
      )}
    </div>
  );
}

Skeleton.propTypes = {
  // Props estándar del sistema
  ...STANDARD_PROP_TYPES,
  
  /** Tipo funcional de skeleton (separado de variant semántica) */
  skeletonVariant: PropTypes.oneOf(['text', 'avatar', 'image', 'card', 'custom']),
  
  /** Número de líneas (solo para skeletonVariant="text") */
  lines: PropTypes.number,
  
  /** Ancho personalizado (CSS value) */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  /** Alto personalizado (CSS value) */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  /** Aspect ratio para imágenes (ej: "16/9", "4/3", "1/1") */
  aspectRatio: PropTypes.string,
  
  /** Etiqueta de accesibilidad */
  ariaLabel: PropTypes.string,
  
  /** Estilos CSS inline (uso limitado) */
  style: PropTypes.object,
  
  // Props legacy (deprecadas pero mantenidas para compatibilidad)
  /** @deprecated Usar skeletonVariant en su lugar */
  variant: PropTypes.oneOf(['text', 'avatar', 'image', 'card', 'custom']),
  
  /** @deprecated Usar rounded con valores estándar del sistema */
  shape: PropTypes.oneOf(['rectangular', 'rounded', 'circular']),
  
  /** @deprecated Usar loading prop para controlar animación */
  animate: PropTypes.bool
};

// Componentes de conveniencia actualizados con nueva API
Skeleton.Text = memo(function SkeletonText({ lines = 1, ...props }) {
  return <Skeleton skeletonVariant="text" lines={lines} {...props} />;
});

Skeleton.Avatar = memo(function SkeletonAvatar({ size = 'md', ...props }) {
  return <Skeleton skeletonVariant="avatar" rounded="full" size={size} {...props} />;
});

Skeleton.Image = memo(function SkeletonImage({ aspectRatio = '16/9', ...props }) {
  return <Skeleton skeletonVariant="image" aspectRatio={aspectRatio} {...props} />;
});

Skeleton.Card = memo(function SkeletonCard({ ...props }) {
  return <Skeleton skeletonVariant="card" {...props} />;
});

// PropTypes para componentes de conveniencia
Skeleton.Text.propTypes = {
  lines: PropTypes.number,
  ...STANDARD_PROP_TYPES
};

Skeleton.Avatar.propTypes = STANDARD_PROP_TYPES;

Skeleton.Image.propTypes = {
  aspectRatio: PropTypes.string,
  ...STANDARD_PROP_TYPES
};

Skeleton.Card.propTypes = STANDARD_PROP_TYPES;

// Optimizar performance con memoización
const MemoizedSkeleton = memo(Skeleton);

export { MemoizedSkeleton as Skeleton };