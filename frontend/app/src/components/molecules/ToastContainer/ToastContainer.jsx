// molecules/ToastContainer/ToastContainer.jsx
import PropTypes from 'prop-types';
import { Toast } from '../../atoms/Toast/Toast';
import { useStandardProps } from '../../../hooks/useStandardProps';
import { STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens/standardProps';
import './ToastContainer.css';

/**
 * ToastContainer - Contenedor para gestionar múltiples toasts
 * 
 * ✅ **MIGRADO AL SISTEMA ESTÁNDAR**
 * 
 * Características:
 * - ✅ Hook useStandardProps() integrado
 * - ✅ Props estándar (size, variant, rounded, loading, disabled)
 * - ✅ Sistema de posicionamiento con tokens automáticos
 * - ✅ Integración Toast migrado del sistema estándar
 * - ✅ Gestión automática de stacking y límites
 * - ✅ Estados loading/disabled con overlays visuales
 * - ✅ Backward compatibility con deprecation warnings
 * - ✅ Accesibilidad completa ARIA + animaciones adaptativas
 * 
 * **Props específicas del componente:**
 * @param {Array} [toasts=[]] - Array de toasts a mostrar
 * @param {string} [position='top-right'] - Posición en pantalla
 * @param {number} [maxToasts=5] - Máximo número de toasts visibles
 * @param {function} [onRemoveToast] - Callback para remover toast
 * @param {string} [spacing='md'] - Espaciado entre toasts (reemplaza gap legacy)
 * 
 * **Props estándar del sistema:**
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño estándar aplicado a toasts
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [variant='neutral'] - Variante por defecto
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [rounded='md'] - Radio de bordes estándar
 * @param {boolean} [disabled=false] - Deshabilita interacciones
 * @param {boolean} [loading=false] - Estado de carga
 * @param {string} [className=''] - Clases CSS adicionales
 * @param {string} [testId] - ID para testing
 * @param {string} [ariaLabel] - Label para accesibilidad
 */
function ToastContainer({
  // Props específicas del componente
  toasts = [],
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  maxToasts = 5,
  onRemoveToast = null,
  spacing = 'md', // Reemplaza gap legacy
  
  // Backward compatibility - mapeo automático
  gap: legacyGap,
  
  ...restProps
}) {
  
  // Backward compatibility: mapear props legacy
  const propsWithCompatibility = { ...restProps };
  
  // Mapear gap legacy a spacing estándar
  if (legacyGap) {
    console.warn('⚠️ ToastContainer: prop "gap" está deprecada. Usa "spacing" en su lugar.');
    propsWithCompatibility.spacing = legacyGap;
  } else if (spacing) {
    propsWithCompatibility.spacing = spacing;
  }
  
  // Hook del sistema estándar - integra props, tokens e iconos
  const {
    size,
    variant,
    rounded,
    disabled,
    loading,
    className,
    ariaLabel,
    testId,
    tokens
  } = useStandardProps(propsWithCompatibility, {
    defaultSize: 'md',
    defaultVariant: 'neutral',
    componentType: 'toastcontainer'
  });
  
  // Usar spacing del sistema o fallback
  const finalSpacing = propsWithCompatibility.spacing || spacing;
  
  // Limitar número de toasts
  const visibleToasts = toasts.slice(0, maxToasts);
  
  // Calcular offset para cada toast usando tokens del sistema
  const getToastOffset = (index) => {
    const spacingTokens = {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20
    };
    
    const spacingSize = spacingTokens[finalSpacing] || spacingTokens.md;
    const toastHeight = size === 'xs' ? 60 : size === 'sm' ? 70 : size === 'lg' ? 90 : size === 'xl' ? 100 : 80;
    
    return index * (toastHeight + spacingSize);
  };
  
  // Manejar cierre de toast
  const handleRemoveToast = (toastId) => {
    if (onRemoveToast) {
      onRemoveToast(toastId);
    }
  };
  
  // Construir clases CSS con sistema estándar
  const containerClasses = [
    'toast-container',
    `toast-container--position-${position}`,
    `toast-container--size-${size}`,
    `toast-container--variant-${variant}`,
    `toast-container--spacing-${finalSpacing}`,
    disabled && 'toast-container--disabled',
    loading && 'toast-container--loading',
    className
  ].filter(Boolean).join(' ');
  
  // Extraer props seguras para DOM
  const domProps = extractDOMProps({ 
    ...restProps, 
    className: containerClasses, 
    disabled, 
    ariaLabel, 
    testId 
  });
  
  // No renderizar si no hay toasts
  if (visibleToasts.length === 0) {
    return null;
  }
  
  return (
    <div 
      className="toast-container"
      style={{
        '--toast-container-size': tokens?.size,
        '--toast-container-variant': tokens?.variant,
        '--toast-container-spacing': tokens?.spacing
      }}
      role="region"
      aria-label={ariaLabel || "Notificaciones"}
      aria-live="polite"
      aria-atomic="false"
      {...domProps}
    >
      {/* Overlay de loading usando sistema estándar */}
      {loading && (
        <div className="toast-container__loading-overlay">
          <div className="toast-container__loading-spinner" aria-label="Cargando notificaciones..." />
        </div>
      )}
      
      {/* Overlay de disabled */}
      {disabled && (
        <div className="toast-container__disabled-overlay" aria-hidden="true" />
      )}
      {visibleToasts.map((toast, index) => {
        // Calcular posición del toast
        const offset = getToastOffset(index);
        const isBottom = position.includes('bottom');
        const offsetProperty = isBottom ? 'bottom' : 'top';
        
        // Mapear type legacy a variant estándar si es necesario
        let toastVariant = toast.variant || toast.type;
        if (toast.type && !toast.variant) {
          // Backward compatibility: type → variant
          const typeToVariantMap = {
            'info': 'primary',
            'error': 'danger'
          };
          toastVariant = typeToVariantMap[toast.type] || toast.type;
        }
        
        return (
          <div
            key={toast.id}
            className="toast-container__item"
            style={{
              [offsetProperty]: `${offset}px`,
              zIndex: 9999 - index // Los más nuevos arriba
            }}
          >
            <Toast
              // Props estándar heredadas del contenedor
              size={toast.size || size}
              variant={toastVariant || variant}
              rounded={toast.rounded || rounded}
              disabled={disabled || toast.disabled}
              loading={toast.loading}
              
              // Props específicas del toast
              isOpen={toast.isOpen}
              title={toast.title}
              message={toast.message}
              position={position}
              autoClose={toast.autoClose}
              autoCloseDelay={toast.autoCloseDelay}
              action={toast.action}
              showCloseButton={toast.showCloseButton}
              onClose={() => handleRemoveToast(toast.id)}
              onAutoClose={toast.onAutoClose}
              
              // Backward compatibility para type
              type={toast.type} // Toast migrado maneja esta conversión internamente
            />
          </div>
        );
      })}
    </div>
  );
}

ToastContainer.propTypes = {
  /** Array de toasts a mostrar */
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isOpen: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    autoClose: PropTypes.bool,
    autoCloseDelay: PropTypes.number,
    action: PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    }),
    showCloseButton: PropTypes.bool,
    onAutoClose: PropTypes.func,
    
    // Props del sistema estándar específicas por toast
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']),
    rounded: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    
    // Backward compatibility
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info'])
  })),
  
  /** Posición en pantalla */
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
  
  /** Máximo número de toasts visibles */
  maxToasts: PropTypes.number,
  
  /** Espaciado entre toasts (sistema estándar) */
  spacing: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  
  /** Callback para remover toast */
  onRemoveToast: PropTypes.func,
  
  /** Props legacy con backward compatibility */
  gap: PropTypes.oneOf(['sm', 'md', 'lg']), // Deprecado
  
  // Props estándar del sistema de diseño
  ...STANDARD_PROP_TYPES
};

export { ToastContainer };