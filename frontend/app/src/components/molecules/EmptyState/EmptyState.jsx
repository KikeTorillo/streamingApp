// EmptyState.jsx
import PropTypes from 'prop-types';
import { Container } from '../../atoms/Container/Container';
// import { Icon } from '../../atoms/Icon/Icon'; // Removido - usando renderIcon del hook V2
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Typography } from '../../atoms/Typography/Typography';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/standardProps-v2.js';

/**
 * Componente EmptyState - Molecule SIMPLIFICADO
 * 
 * ✅ SIMPLIFICACIÓN SISTEMAÁTICA: Eliminado CSS custom, solo componentes del sistema
 * ✅ CONTAINER + FLEXCONTAINER: Layout puro del sistema de diseño
 * ✅ TYPOGRAPHY: Componente Typography para todo el texto
 * ✅ ZERO CSS: Sin archivos .css, composición pura
 * ✅ TOKENS AUTOMÁTICOS: Spacing, colors y sizing del sistema
 * 
 * Muestra un estado vacío cuando no hay contenido que mostrar.
 * Incluye ícono, título, descripción y acción opcional.
 * NUEVO: Usa Container + FlexContainer para layout limpio.
 */
function EmptyState({
  // Contenido
  icon = 'folder',
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
  
  // ✅ SISTEMA V2: INTEGRACIÓN SISTEMA DE DISEÑO
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
  } = useInteractiveProps({ 
    size, 
    variant, 
    rounded, 
    disabled, 
    loading, 
    className, 
    ...restProps 
  }, {
    componentName: 'EmptyState',
    defaultSize: 'md',
    defaultVariant: 'neutral',
    defaultRounded: 'lg'
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
    if (variantMapping[finalVariant] && import.meta.env?.DEV) {
      console.warn(`⚠️ EmptyState: variant="${finalVariant}" is deprecated. Use variant="${mappedVariant}" instead.`);
    }
    
    return mappedVariant;
  })();
  
  // ✅ SIMPLIFICADO: Sin clases CSS, solo sistema de componentes

  // ===== RENDER =====
  return (
      <FlexContainer
        direction="column"
        align="center"
        justify="center"
        variant="primary"
        padding="lg"
      >
        {/* Ícono con sistema unificado */}
        <div className="empty-state__icon" style={{ fontSize: tokens?.size?.iconSize || 'var(--icon-size-xl)' }}>
          {renderIcon(icon || 'inbox')}
        </div>
        
        {/* Título */}
        <Typography variant="primary" size="lg" weight="semibold">
          {title}
        </Typography>
        
        {/* Descripción */}
        <Typography variant="neutral" size="md" style={{ textAlign: 'center', maxWidth: '32rem' }}>
          {description}
        </Typography>
        
        {/* Acción opcional */}
        {action && (
          <FlexContainer justify="center">
            {action}
          </FlexContainer>
        )}
        
        {/* Estado loading overlay */}
        {isLoading && (
          <FlexContainer
            align="center"
            justify="center"
          >
            <Icon name="loader-2" size="lg" className="animate-spin" />
          </FlexContainer>
        )}
      </FlexContainer>
  );
}

EmptyState.propTypes = {
  // Contenido específico
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  
  // ✅ SISTEMA V2: Props estándar del sistema
  ...INTERACTIVE_PROP_TYPES,
  
  // Soporte legacy (deprecated)
  variant: PropTypes.oneOf([
    // Estándar
    'primary', 'secondary', 'success', 'warning', 'danger', 'neutral',
    // Legacy - Deprecated
    'default', 'muted', 'info', 'error'
  ])
};

export { EmptyState };