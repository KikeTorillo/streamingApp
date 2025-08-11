// EmptyState.jsx
import PropTypes from 'prop-types';
import { Card } from '../../atoms/Card/Card';
import { Icon } from '../../atoms/Icon/Icon';
import { useEmptyStateProps } from '../../../hooks/useStandardProps.jsx';
import { STANDARD_PROP_TYPES } from '../../../tokens/standardProps.js';
import './EmptyState.css';

/**
 * Componente EmptyState - Molecule
 * 
 * ✅ MIGRADO: Sistema de diseño estándar completo
 * ✅ HOOKS: useEmptyStateProps() integrado
 * ✅ TOKENS: Spacing/sizing automáticos con design tokens
 * ✅ ICONS: Sistema de iconos unificado con renderIcon
 * ✅ COMPATIBILITY: Backward compatibility con deprecation warnings
 * 
 * Muestra un estado vacío cuando no hay contenido que mostrar.
 * Incluye ícono, título, descripción y acción opcional.
 * Usa el sistema de componentes Card como base.
 */
function EmptyState({
  // Contenido
  icon = '📭',
  title = 'No hay contenido',
  description = 'No se encontraron elementos para mostrar.',
  
  // Acción opcional
  action = null,
  
  // Props estándar del sistema
  size = 'md',
  variant = 'neutral',
  rounded = 'lg',
  disabled = false,
  loading = false,
  
  // Propiedades adicionales
  className = '',
  ...restProps
}) {
  
  // ===== INTEGRACIÓN SISTEMA DE DISEÑO =====
  const {
    size: finalSize,
    variant: finalVariant,
    rounded: finalRounded,
    disabled: isDisabled,
    loading: isLoading,
    tokens,
    renderIcon,
    className: standardClassName,
    ...standardProps
  } = useEmptyStateProps({ 
    size, 
    variant, 
    rounded, 
    disabled, 
    loading, 
    className, 
    ...restProps 
  });
  
  // Backward compatibility: mapear variants legacy
  const finalVariantCompat = (() => {
    // Mapear variantes legacy a estándar
    const variantMapping = {
      'default': 'neutral',
      'muted': 'neutral',
      'info': 'primary',
      'error': 'danger'
    };
    
    const mappedVariant = variantMapping[finalVariant] || finalVariant;
    
    // Warning para variantes deprecated
    if (variantMapping[finalVariant] && process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ EmptyState: variant="${finalVariant}" is deprecated. Use variant="${mappedVariant}" instead.`);
    }
    
    return mappedVariant;
  })();
  
  // Clases CSS dinámicas con sistema de tokens
  const emptyStateClasses = [
    'empty-state',
    `empty-state--size-${finalSize}`,
    `empty-state--variant-${finalVariantCompat}`,
    isDisabled && 'empty-state--disabled',
    isLoading && 'empty-state--loading',
    standardClassName
  ].filter(Boolean).join(' ');

  // ===== RENDER =====
  return (
    <Card 
      variant="outline"
      size={finalSize}
      className={emptyStateClasses}
      disabled={isDisabled}
      loading={isLoading}
      {...standardProps}
    >
      <div className="empty-state__content">
        {/* Ícono con sistema unificado */}
        <div className="empty-state__icon">
          {renderIcon ? renderIcon(icon) : (
            typeof icon === 'string' && icon.length <= 2 ? (
              icon // Emoji directo
            ) : (
              <Icon name={icon} size={tokens.size.iconSize} />
            )
          )}
        </div>
        
        {/* Título */}
        <h3 className="empty-state__title">
          {title}
        </h3>
        
        {/* Descripción */}
        <p className="empty-state__description">
          {description}
        </p>
        
        {/* Acción opcional */}
        {action && (
          <div className="empty-state__action">
            {action}
          </div>
        )}
        
        {/* Estado loading overlay */}
        {isLoading && (
          <div className="empty-state__loading-overlay">
            <Icon name="loader-2" size={tokens.size.iconSize} className="animate-spin" />
          </div>
        )}
      </div>
    </Card>
  );
}

EmptyState.propTypes = {
  // Contenido específico
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  
  // Props estándar del sistema
  ...STANDARD_PROP_TYPES,
  
  // Soporte legacy (deprecated)
  variant: PropTypes.oneOf([
    // Estándar
    'primary', 'secondary', 'success', 'warning', 'danger', 'neutral',
    // Legacy - Deprecated
    'default', 'muted', 'info', 'error'
  ])
};

export { EmptyState };