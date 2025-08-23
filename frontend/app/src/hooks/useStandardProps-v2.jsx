// hooks/useStandardProps-v2.js
// ===== HOOK ESTÁNDAR V2.0 - SISTEMA RESPONSIVE DE CLASE MUNDIAL =====

import { useMemo, useEffect, useState } from 'react';
import { 
  DESIGN_TOKENS_V2,
  getComponentSizeTokens,
  getTypographyTokens,
  getSpacingToken,
  getContainerToken,
  getResponsiveValue,
  tokensToStyles
} from '../tokens/designTokens-v2.js';
import {
  validateStandardPropsV2,
  extractStandardPropsV2,
  getResponsiveValue as getResponsiveValueFromProps
} from '../tokens/standardProps-v2.js';

/**
 * HOOK ESTÁNDAR V2.0 - RESPONSIVE + ESPECIALIZADO
 * 
 * 🏗️ FILOSOFÍA: "Un hook, múltiples especializaciones"
 * 🎯 CARACTERÍSTICAS:
 * ✅ RESPONSIVE: Soporte nativo para breakpoints
 * ✅ ESPECIALIZADO: Tokens específicos por tipo de componente  
 * ✅ PERFORMANTE: Memoización y debouncing de resize
 * ✅ TYPE-SAFE: Validación completa en desarrollo
 * ✅ FLEXIBLE: Fallbacks inteligentes
 * 
 * @param {Object} props - Props del componente
 * @param {Object} config - Configuración del hook
 * @param {string} config.componentType - Tipo: 'interactive'|'typography'|'container'
 * @param {string} config.defaultSize - Tamaño por defecto
 * @param {string} config.defaultVariant - Variante por defecto
 * @param {string} config.defaultRounded - Redondeo por defecto
 * @param {boolean} config.enableResponsive - Habilitar responsive (default: true)
 * @param {boolean} config.enableValidation - Habilitar validación (default: true en DEV)
 * @returns {Object} - Props procesadas + tokens + helpers
 */
export function useStandardPropsV2(props, config = {}) {
  const {
    componentType = 'interactive',
    componentName = 'Component',
    defaultSize = 'md',
    defaultVariant = 'primary',
    defaultRounded = 'md',
    enableResponsive = true,
    enableValidation = import.meta.env?.DEV
  } = config;

  // ===== ESTADO RESPONSIVE =====
  const [currentBreakpoint, setCurrentBreakpoint] = useState('base');
  
  // Detectar breakpoint actual
  useEffect(() => {
    if (!enableResponsive || typeof window === 'undefined') return;

    const breakpoints = {
      '2xl': 1536,
      xl: 1280,
      lg: 1024,
      md: 768,
      sm: 640,
      base: 0
    };

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const breakpoint = Object.entries(breakpoints).find(
        ([_, minWidth]) => width >= minWidth
      )?.[0] || 'base';
      
      setCurrentBreakpoint(breakpoint);
    };

    updateBreakpoint();
    
    // Debounced resize handler para performance
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateBreakpoint, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [enableResponsive]);

  // ===== VALIDACIÓN =====
  const validatedProps = useMemo(() => {
    return enableValidation 
      ? validateStandardPropsV2(props, componentName, componentType)
      : props;
  }, [props, componentName, componentType, enableValidation]);

  // ===== EXTRACCIÓN DE PROPS =====
  const standardProps = useMemo(() => {
    return extractStandardPropsV2(validatedProps, componentType);
  }, [validatedProps, componentType]);

  // ===== RESOLUCIÓN RESPONSIVE =====
  const resolvedProps = useMemo(() => {
    if (!enableResponsive) {
      return standardProps;
    }

    // Resolver cada prop responsive
    const resolved = {};
    Object.entries(standardProps).forEach(([key, value]) => {
      resolved[key] = getResponsiveValueFromProps(value, currentBreakpoint);
    });

    return resolved;
  }, [standardProps, currentBreakpoint, enableResponsive]);

  // ===== APLICAR DEFAULTS =====
  const propsWithDefaults = useMemo(() => {
    return {
      size: resolvedProps.size || defaultSize,
      variant: resolvedProps.variant || defaultVariant,
      rounded: resolvedProps.rounded || defaultRounded,
      width: resolvedProps.width || 'auto',
      disabled: Boolean(resolvedProps.disabled),
      loading: Boolean(resolvedProps.loading),
      className: resolvedProps.className || '',
      shadow: resolvedProps.shadow || 'none',
      ...resolvedProps
    };
  }, [resolvedProps, defaultSize, defaultVariant, defaultRounded]);

  // ===== GENERAR TOKENS ESPECIALIZADOS =====
  const tokens = useMemo(() => {
    const { size, variant, rounded, shadow, width, padding, gap, margin, spacing, weight } = propsWithDefaults;

    let sizeTokens = {};
    let additionalTokens = {};

    // Tokens según tipo de componente
    switch (componentType) {
      case 'interactive':
        sizeTokens = getComponentSizeTokens(size);
        break;
      
      case 'typography':
        sizeTokens = getTypographyTokens(size);
        if (weight) additionalTokens.fontWeight = DESIGN_TOKENS_V2.typography[size]?.fontWeight || 400;
        break;
      
      case 'container':
        sizeTokens = { maxWidth: getContainerToken(size) };
        break;
        
      default:
        sizeTokens = getComponentSizeTokens(size);
    }

    // Tokens de variante
    const variantTokens = DESIGN_TOKENS_V2.variants[variant] || DESIGN_TOKENS_V2.variants.primary;
    
    // Tokens universales
    const borderRadius = DESIGN_TOKENS_V2.borderRadius[rounded] || DESIGN_TOKENS_V2.borderRadius.md;
    const boxShadow = DESIGN_TOKENS_V2.shadows[shadow] || 'none';
    
    // Tokens de ancho
    const widthToken = DESIGN_TOKENS_V2.widths[width] || 'auto';
    
    // Tokens de espaciado
    const spacingTokens = {};
    if (padding) spacingTokens.padding = getSpacingToken(padding);
    if (gap) spacingTokens.gap = getSpacingToken(gap);
    if (margin) spacingTokens.margin = getSpacingToken(margin);
    
    // Tokens de spacing responsive para Typography
    if (spacing && componentType === 'typography') {
      if (spacing.top) spacingTokens.marginTop = getSpacingToken(getResponsiveValueFromProps(spacing.top, currentBreakpoint));
      if (spacing.bottom) spacingTokens.marginBottom = getSpacingToken(getResponsiveValueFromProps(spacing.bottom, currentBreakpoint));
      if (spacing.left) spacingTokens.marginLeft = getSpacingToken(getResponsiveValueFromProps(spacing.left, currentBreakpoint));
      if (spacing.right) spacingTokens.marginRight = getSpacingToken(getResponsiveValueFromProps(spacing.right, currentBreakpoint));
    }

    return {
      size: sizeTokens,
      variant: variantTokens,
      borderRadius,
      boxShadow,
      width: widthToken,
      ...spacingTokens,
      ...additionalTokens
    };
  }, [propsWithDefaults, componentType, currentBreakpoint]);

  // ===== HELPERS DE ICONOS =====
  const iconHelpers = useMemo(() => {
    const { leftIcon, rightIcon } = propsWithDefaults;
    
    return {
      hasLeftIcon: Boolean(leftIcon),
      hasRightIcon: Boolean(rightIcon),
      hasAnyIcon: Boolean(leftIcon || rightIcon),
      leftIcon,
      rightIcon
    };
  }, [propsWithDefaults]);

  // ===== HELPERS DE ESTADO =====
  const stateHelpers = useMemo(() => {
    const { disabled, loading } = propsWithDefaults;
    
    return {
      isDisabled: disabled,
      isLoading: loading,
      isInteractive: !disabled && !loading
    };
  }, [propsWithDefaults]);

  // ===== GENERADOR DE CLASES CSS =====
  const generateClassName = useMemo(() => {
    return (baseClass = 'component') => {
      const { size, variant, rounded, shadow, width, disabled, loading, className } = propsWithDefaults;
      
      const classes = [
        baseClass,
        `${baseClass}--size-${size}`,
        `${baseClass}--variant-${variant}`,
        rounded !== 'md' && `${baseClass}--rounded-${rounded}`,
        shadow !== 'none' && `${baseClass}--shadow-${shadow}`,
        width !== 'auto' && `${baseClass}--width-${width}`,
        disabled && `${baseClass}--disabled`,
        loading && `${baseClass}--loading`,
        className
      ].filter(Boolean);
      
      return classes.join(' ');
    };
  }, [propsWithDefaults]);

  // ===== GENERADOR DE ESTILOS CSS =====
  const generateStyles = useMemo(() => {
    return (additionalStyles = {}) => {
      // Validar que tokens sea un objeto válido
      const safeTokens = tokens && typeof tokens === 'object' ? tokens : {};
      const baseStyles = tokensToStyles(safeTokens);
      
      // Estados
      const stateStyles = {
        opacity: stateHelpers.isDisabled ? 0.5 : 1,
        pointerEvents: stateHelpers.isDisabled ? 'none' : 'auto',
        cursor: stateHelpers.isLoading ? 'wait' : 
                stateHelpers.isDisabled ? 'not-allowed' : 'auto'
      };
      
      // Asegurar que todos los valores sean objetos válidos
      const safeAdditionalStyles = additionalStyles && typeof additionalStyles === 'object' ? additionalStyles : {};
      
      return {
        ...baseStyles,
        ...stateStyles,
        ...safeAdditionalStyles
      };
    };
  }, [tokens, stateHelpers, propsWithDefaults]);

  // ===== RENDERER DE ICONOS AVANZADO =====
  const createIconRenderer = useMemo(() => {
    return (iconType = 'general', iconSize = null) => {
      return (iconName) => {
        if (!iconName) return null;
        
        // Si es React element, devolverlo tal cual
        if (typeof iconName === 'object' && iconName.type) {
          return iconName;
        }
        
        // Si es string, crear icono del sistema
        const finalIconSize = iconSize || tokens.size?.iconSize || '2.0rem';
        
        return (
          <span 
            className={`icon icon--${iconName} icon--${iconType}`}
            style={{
              '--icon-size': finalIconSize,
              width: 'var(--icon-size)',
              height: 'var(--icon-size)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-hidden="true"
          >
            {/* Implementación específica del sistema de iconos */}
            {iconName}
          </span>
        );
      };
    };
  }, [tokens]);

  // ===== RETURN COMPLETO =====
  return {
    // Props procesadas
    ...propsWithDefaults,
    
    // Tokens especializados
    tokens,
    
    // Helpers de iconos
    ...iconHelpers,
    renderIcon: createIconRenderer('component', tokens.size?.iconSize),
    
    // Helpers de estado
    ...stateHelpers,
    
    // Generators
    generateClassName,
    generateStyles,
    
    // Meta información
    currentBreakpoint: enableResponsive ? currentBreakpoint : 'base',
    componentType,
    
    // Helpers de debugging (solo en desarrollo)
    ...(import.meta.env?.DEV && {
      _debug: {
        originalProps: props,
        validatedProps,
        standardProps,
        resolvedProps,
        propsWithDefaults,
        tokens
      }
    })
  };
}

// ===== 🎯 HOOKS ESPECIALIZADOS =====

/**
 * Hook especializado para componentes interactivos
 */
export function useInteractiveProps(props, config = {}) {
  return useStandardPropsV2(props, {
    ...config,
    componentType: 'interactive',
    defaultSize: config.defaultSize || 'md'
  });
}

/**
 * Hook especializado para componentes tipográficos
 */
export function useTypographyProps(props, config = {}) {
  return useStandardPropsV2(props, {
    ...config,
    componentType: 'typography',
    defaultSize: config.defaultSize || 'md'
  });
}

/**
 * Hook especializado para componentes contenedores
 */
export function useContainerProps(props, config = {}) {
  return useStandardPropsV2(props, {
    ...config,
    componentType: 'container',
    defaultSize: config.defaultSize || 'lg',
    defaultVariant: config.defaultVariant || 'neutral'
  });
}

// ===== 🔧 UTILITY HOOKS =====

/**
 * Hook para obtener breakpoint actual
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('base');
  
  useEffect(() => {
    const breakpoints = {
      '2xl': 1536,
      xl: 1280,
      lg: 1024,
      md: 768,
      sm: 640,
      base: 0
    };

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const current = Object.entries(breakpoints).find(
        ([_, minWidth]) => width >= minWidth
      )?.[0] || 'base';
      
      setBreakpoint(current);
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return breakpoint;
}

/**
 * Hook para responsive values
 */
export function useResponsiveValue(value) {
  const breakpoint = useBreakpoint();
  return useMemo(() => getResponsiveValueFromProps(value, breakpoint), [value, breakpoint]);
}

// ===== 📦 EXPORTS =====
export default useStandardPropsV2;