// EmptyState.jsx
import PropTypes from 'prop-types';
import { Container } from '../../atoms/Container/Container';
import { Icon } from '../../atoms/Icon/Icon';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Typography } from '../../atoms/Typography/Typography';
import { useEmptyStateProps } from '../../../hooks/useStandardProps.jsx';
import { STANDARD_PROP_TYPES } from '../../../tokens/standardProps.js';

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
  
  // ===== INTEGRACIÓN SISTEMA DE DISEÑO =====
  const {
    size: finalSize,
    variant: finalVariant,
    // rounded: finalRounded, // del hook pero no utilizada
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
    if (variantMapping[finalVariant] && import.meta.env?.DEV) {
      console.warn(`⚠️ EmptyState: variant="${finalVariant}" is deprecated. Use variant="${mappedVariant}" instead.`);
    }
    
    return mappedVariant;
  })();
  
  // ✅ SIMPLIFICADO: Sin clases CSS, solo sistema de componentes

  // ===== RENDER =====
  return (
    <Container 
      size="full"
      padding="xl"
      variant={finalVariantCompat}
      className={standardClassName}
      {...standardProps}
    >
      <FlexContainer
        direction="column"
        align="center"
        justify="center"
        gap="lg"
        style={{ minHeight: '16rem' }}
      >
        {/* Ícono con sistema unificado */}
        {renderIcon ? renderIcon(icon) : (
          typeof icon === 'string' && icon.length <= 2 ? (
            <span style={{ fontSize: '3rem' }}>{icon}</span> // Emoji directo
          ) : (
            <Icon name={icon} size="xl" />
          )
        )}
        
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
    </Container>
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