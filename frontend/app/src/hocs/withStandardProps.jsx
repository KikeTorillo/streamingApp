// hocs/withStandardProps.js
// ===== HIGHER-ORDER COMPONENT PARA PROPS ESTÁNDAR =====

/**
 * HOC que aplica props estándar y tokens a cualquier componente
 * 
 * ✅ BENEFICIOS:
 * - Aplicación automática de design tokens
 * - Props estándar consistentes en todos los componentes  
 * - Integración con sistema de iconos
 * - Performance optimizado con memoización
 * - Backward compatibility mantenida
 * 
 * 🎯 USO:
 * const EnhancedButton = withStandardProps(Button, { 
 *   defaultSize: 'md', 
 *   componentType: 'button' 
 * });
 */

import React, { forwardRef, useMemo } from 'react';
import { DESIGN_TOKENS, getSizeTokens, getVariantTokens, getRoundedToken } from '../tokens/designTokens.js';
import { createStandardIconRenderer } from '../utils/iconHelpers.js';
import { validateStandardProps } from '../tokens/standardProps.js';

/**
 * HOC principal que envuelve componentes con props estándar
 * 
 * @param {React.Component} WrappedComponent - Componente a envolver
 * @param {Object} options - Opciones de configuración
 * @param {string} options.defaultSize - Tamaño por defecto ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {string} options.defaultVariant - Variante por defecto ('primary', 'secondary', etc.)
 * @param {string} options.defaultRounded - Radio por defecto ('sm', 'md', 'lg', 'xl', 'full')
 * @param {string} options.componentType - Tipo para sistema de iconos ('button', 'badge', etc.)
 * @param {boolean} options.enableValidation - Habilitar validación en desarrollo (true por defecto)
 * @returns {React.Component} Componente envuelto con props estándar
 */
export const withStandardProps = (WrappedComponent, options = {}) => {
  const {
    defaultSize = 'md',
    defaultVariant = 'primary',
    defaultRounded = 'md',
    componentType = 'generic',
    enableValidation = true
  } = options;

  const StandardizedComponent = forwardRef((props, ref) => {
    // Validar props en desarrollo si está habilitado
    const validatedProps = enableValidation 
      ? validateStandardProps(props, WrappedComponent.name || 'Component')
      : props;

    const {
      size = defaultSize,
      variant = defaultVariant,
      rounded = defaultRounded,
      disabled = false,
      loading = false,
      className = '',
      leftIcon,
      rightIcon,
      iconOnly = false,
      ...restProps
    } = validatedProps;

    // Memoizar tokens para performance
    const tokens = useMemo(() => {
      const sizeTokens = getSizeTokens(size);
      const variantTokens = getVariantTokens(variant);
      const roundedToken = getRoundedToken(rounded);

      return {
        size: sizeTokens,
        variant: variantTokens,
        rounded: roundedToken,
        componentType
      };
    }, [size, variant, rounded, componentType]);

    // Crear renderizador de iconos específico para este componente
    const renderIcon = useMemo(() => {
      return createStandardIconRenderer(componentType, size);
    }, [componentType, size]);

    // Props computadas que se pasan al componente envuelto
    const enhancedProps = useMemo(() => ({
      ...restProps,
      ref,
      
      // Props estándar normalizadas
      size,
      variant,
      rounded,
      disabled,
      loading,
      className,
      
      // Props de iconos
      leftIcon,
      rightIcon,
      iconOnly,
      
      // Funciones y datos adicionales
      tokens,
      renderIcon,
      
      // Helpers booleanos para conveniencia
      hasLeftIcon: Boolean(leftIcon),
      hasRightIcon: Boolean(rightIcon),
      
      // Estados computados
      isDisabled: disabled,
      isLoading: loading
    }), [
      restProps, ref, size, variant, rounded, disabled, loading, className,
      leftIcon, rightIcon, iconOnly, tokens, renderIcon
    ]);

    return <WrappedComponent {...enhancedProps} />;
  });

  // Preservar información del componente para debugging
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  StandardizedComponent.displayName = `withStandardProps(${componentName})`;
  
  // Preservar propiedades estáticas del componente original
  StandardizedComponent.WrappedComponent = WrappedComponent;
  
  // Copiar propiedades estáticas relevantes
  if (WrappedComponent.propTypes) {
    StandardizedComponent.propTypes = WrappedComponent.propTypes;
  }
  
  if (WrappedComponent.defaultProps) {
    StandardizedComponent.defaultProps = WrappedComponent.defaultProps;
  }

  return StandardizedComponent;
};

// ===== FUNCIONES DE CONVENIENCIA PARA COMPONENTES ESPECÍFICOS =====

/**
 * HOC especializado para componentes tipo Button
 * Configuración optimizada para botones
 */
export const withButtonProps = (Component) => withStandardProps(Component, {
  defaultSize: 'md',
  defaultVariant: 'primary',
  defaultRounded: 'md',
  componentType: 'button'
});

/**
 * HOC especializado para componentes tipo Badge  
 * Configuración optimizada para badges
 */
export const withBadgeProps = (Component) => withStandardProps(Component, {
  defaultSize: 'sm',
  defaultVariant: 'primary', 
  defaultRounded: 'full',
  componentType: 'badge'
});

/**
 * HOC especializado para componentes tipo Input
 * Configuración optimizada para inputs
 */
export const withInputProps = (Component) => withStandardProps(Component, {
  defaultSize: 'md',
  defaultVariant: 'primary',
  defaultRounded: 'md', 
  componentType: 'input'
});

/**
 * HOC especializado para componentes tipo Card
 * Configuración optimizada para cards
 */
export const withCardProps = (Component) => withStandardProps(Component, {
  defaultSize: 'md',
  defaultVariant: 'neutral',
  defaultRounded: 'lg',
  componentType: 'card'
});

/**
 * HOC especializado para componentes tipo Modal
 * Configuración optimizada para modales
 */
export const withModalProps = (Component) => withStandardProps(Component, {
  defaultSize: 'md',
  defaultVariant: 'primary',
  defaultRounded: 'xl',
  componentType: 'modal'
});

// ===== HELPER PARA CREAR HOCS PERSONALIZADOS =====

/**
 * Factory para crear HOCs personalizados con configuración específica
 * 
 * @param {Object} config - Configuración del HOC
 * @returns {Function} Función HOC personalizada
 * 
 * @example
 * const withMyComponentProps = createStandardHOC({
 *   defaultSize: 'lg',
 *   defaultVariant: 'success',
 *   componentType: 'myComponent'
 * });
 * 
 * const EnhancedMyComponent = withMyComponentProps(MyComponent);
 */
export const createStandardHOC = (config = {}) => {
  return (Component) => withStandardProps(Component, config);
};

// ===== UTILIDADES PARA TESTING =====

/**
 * Extrae el componente original de un componente envuelto con withStandardProps
 * Útil para testing y debugging
 * 
 * @param {React.Component} WrappedComponent - Componente envuelto
 * @returns {React.Component} Componente original
 */
export const getOriginalComponent = (WrappedComponent) => {
  return WrappedComponent.WrappedComponent || WrappedComponent;
};

/**
 * Verifica si un componente está envuelto con withStandardProps
 * 
 * @param {React.Component} Component - Componente a verificar
 * @returns {boolean} true si está envuelto
 */
export const isStandardPropsComponent = (Component) => {
  return Boolean(Component && Component.WrappedComponent);
};

// ===== EXPORTS DEFAULT =====
export default withStandardProps;