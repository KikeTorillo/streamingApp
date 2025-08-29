// hooks/useStandardProps.jsx - VERSION MINIMALISTA PARA INPUT
// Enfoque: Solo lo que realmente necesita el Input

import React, { useMemo } from 'react';
import { Icon } from '../atoms/Icon/Icon.jsx';

/**
 * Hook minimalista para componentes interactivos (empezando con Input)
 * Solo incluye lo que realmente se usa
 */
function useStandardPropsV2(props, config = {}) {
  const {
    componentName = 'Component',
    defaultSize = 'md',
    defaultVariant = 'primary',
    defaultRounded = 'md'
  } = config;

  // ===== PROCESAR PROPS CON DEFAULTS =====
  const processedProps = useMemo(() => {
    return {
      // Props básicas con defaults
      size: props.size || defaultSize,
      variant: props.variant || defaultVariant,
      rounded: props.rounded || defaultRounded,
      width: props.width || 'auto',
      
      // Estados
      disabled: Boolean(props.disabled),
      loading: Boolean(props.loading),
      
      // Iconos
      leftIcon: props.leftIcon,
      rightIcon: props.rightIcon
    };
  }, [props, defaultSize, defaultVariant, defaultRounded]);

  // ===== HELPERS DE ESTADO =====
  const stateHelpers = useMemo(() => ({
    isDisabled: processedProps.disabled,
    isLoading: processedProps.loading,
    isInteractive: !processedProps.disabled && !processedProps.loading
  }), [processedProps.disabled, processedProps.loading]);

  // ===== SISTEMA DE ICONOS SIMPLE =====
  const renderIcon = useMemo(() => {
    return (iconName, iconSize = 'md') => {
      if (!iconName) return null;
      
      // Si es React element, devolverlo tal cual
      if (typeof iconName === 'object' && iconName.type) {
        return iconName;
      }
      
      // Si es string, crear icono del sistema
      return (
        <Icon 
          name={iconName} 
          size={iconSize}
          variant={processedProps.variant}
        />
      );
    };
  }, [processedProps.variant]);

  // ===== RETORNAR SOLO LO NECESARIO =====
  return {
    // Props procesadas
    ...processedProps,
    
    // Helpers de estado
    ...stateHelpers,
    
    // Sistema de iconos
    renderIcon
  };
}

/**
 * Hook especializado para componentes interactivos (Input, Button, etc.)
 */
export function useInteractiveProps(props, config = {}) {
  return useStandardPropsV2(props, {
    ...config,
    componentType: 'interactive'
  });
}

/**
 * Hooks de compatibilidad (por si otros componentes los necesitan)
 */
export function useTypographyProps(props, config = {}) {
  return useStandardPropsV2(props, config);
}

export function useContainerProps(props, config = {}) {
  return useStandardPropsV2(props, config);
}

export function useBreakpoint() {
  // Minimalista - siempre retorna 'base'
  return 'base';
}

export function useResponsiveValue(value) {
  // Minimalista - siempre retorna el valor tal como está
  return value;
}

// Export principal para compatibilidad
export { useStandardPropsV2 };
