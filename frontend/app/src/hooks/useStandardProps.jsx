// hooks/useStandardProps.js
// ===== HOOK PARA USAR PROPS ESTÁNDAR Y TOKENS =====

/**
 * Hook personalizado para gestionar props estándar y tokens en componentes funcionales
 * 
 * ✅ BENEFICIOS:
 * - Gestión automática de design tokens
 * - Props estándar normalizadas y validadas
 * - Sistema de iconos integrado
 * - Memoización para performance óptima
 * - API consistente entre componentes
 * 
 * 🎯 USO:
 * const buttonProps = useStandardProps(props, { componentType: 'button' });
 * const { size, variant, tokens, renderIcon, hasLeftIcon } = buttonProps;
 */

import { useMemo } from 'react';
import { getSizeTokens, getVariantTokens, getRoundedToken } from '../tokens/designTokens.js';
import { useIconRenderer } from '../utils/iconHelpers.js';
import { validateStandardProps } from '../tokens/standardProps.js';

/**
 * Hook principal para usar props estándar y tokens en componentes funcionales
 * 
 * @param {Object} props - Props del componente
 * @param {Object} options - Opciones de configuración
 * @param {string} options.defaultSize - Tamaño por defecto ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {string} options.defaultVariant - Variante por defecto ('primary', 'secondary', etc.)
 * @param {string} options.defaultRounded - Radio por defecto ('sm', 'md', 'lg', 'xl', 'full')
 * @param {string} options.componentType - Tipo para sistema de iconos ('button', 'badge', etc.)
 * @param {boolean} options.enableValidation - Habilitar validación en desarrollo (true por defecto)
 * @returns {Object} Props procesadas con tokens y helpers
 */
export const useStandardProps = (props = {}, options = {}) => {
  const {
    defaultSize = 'md',
    defaultVariant = 'primary',
    defaultRounded = 'md',
    componentType = 'generic',
    enableValidation = true
  } = options;

  // Validar props en desarrollo si está habilitado
  const validatedProps = useMemo(() => {
    return enableValidation 
      ? validateStandardProps(props, `useStandardProps(${componentType})`)
      : props;
  }, [props, enableValidation, componentType]);

  // Extraer y normalizar props
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

  // Memoizar tokens para performance óptima
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

  // Hook de iconos integrado con memoización
  const renderIcon = useIconRenderer(componentType, size);

  // Estados y flags computados
  const computedStates = useMemo(() => ({
    hasLeftIcon: Boolean(leftIcon),
    hasRightIcon: Boolean(rightIcon),
    hasAnyIcon: Boolean(leftIcon || rightIcon),
    isDisabled: disabled,
    isLoading: loading,
    isEmpty: iconOnly && !leftIcon && !rightIcon
  }), [leftIcon, rightIcon, iconOnly, disabled, loading]);

  // Props procesadas finales - memoizadas para evitar re-renders
  const standardProps = useMemo(() => ({
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
    
    // Funciones y datos enriquecidos
    tokens,
    renderIcon,
    
    // Estados computados
    ...computedStates,
    
    // Props restantes (sin procesamiento)
    ...restProps
  }), [
    size, variant, rounded, disabled, loading, className,
    leftIcon, rightIcon, iconOnly, tokens, renderIcon,
    computedStates, restProps
  ]);

  return standardProps;
};

// ===== HOOKS ESPECIALIZADOS PARA COMPONENTES ESPECÍFICOS =====

/**
 * Hook especializado para componentes tipo Button
 * Configuración y comportamiento optimizado para botones
 */
export const useButtonProps = (props) => useStandardProps(props, {
  componentType: 'button',
  defaultSize: 'md',
  defaultVariant: 'primary',
  defaultRounded: 'md'
});

/**
 * Hook especializado para componentes tipo Badge
 * Configuración optimizada para badges con iconos pequeños
 */
export const useBadgeProps = (props) => useStandardProps(props, {
  componentType: 'badge',
  defaultSize: 'sm', 
  defaultVariant: 'primary',
  defaultRounded: 'full'
});

/**
 * Hook especializado para componentes tipo Input
 * Configuración optimizada para inputs con soporte de iconos
 */
export const useInputProps = (props) => useStandardProps(props, {
  componentType: 'input',
  defaultSize: 'md',
  defaultVariant: 'primary', 
  defaultRounded: 'md'
});

/**
 * Hook especializado para componentes tipo Card
 * Configuración optimizada para cards con esquinas redondeadas
 */
export const useCardProps = (props) => useStandardProps(props, {
  componentType: 'card',
  defaultSize: 'md',
  defaultVariant: 'neutral',
  defaultRounded: 'lg'
});

/**
 * Hook especializado para componentes tipo Modal
 * Configuración optimizada para modales con esquinas extra redondeadas
 */
export const useModalProps = (props) => useStandardProps(props, {
  componentType: 'modal',
  defaultSize: 'md',
  defaultVariant: 'primary',
  defaultRounded: 'xl'
});

/**
 * Hook especializado para componentes tipo Label
 * Configuración optimizada para labels con estados semánticos específicos
 */
export const useLabelProps = (props) => useStandardProps(props, {
  componentType: 'label',
  defaultSize: 'md',
  defaultVariant: 'default', 
  defaultRounded: 'sm'
});

/**
 * Hook especializado para componentes tipo EmptyState
 * Configuración optimizada para estados vacíos con iconos grandes
 */
export const useEmptyStateProps = (props) => useStandardProps(props, {
  componentType: 'empty-state',
  defaultSize: 'md',
  defaultVariant: 'neutral',
  defaultRounded: 'lg'
});

/**
 * Hook especializado para componentes tipo Toast
 * Configuración optimizada para notificaciones con iconos semánticos
 */
export const useToastProps = (props) => useStandardProps(props, {
  componentType: 'toast',
  defaultSize: 'md',
  defaultVariant: 'primary',
  defaultRounded: 'md'
});

/**
 * Hook especializado para componentes tipo Tabs
 * Configuración optimizada para navegación por pestañas
 */
export const useTabsProps = (props) => useStandardProps(props, {
  componentType: 'tabs',
  defaultSize: 'md',
  defaultVariant: 'primary',
  defaultRounded: 'md'
});

/**
 * Hook especializado para componentes tipo DataTable
 * Configuración optimizada para tablas complejas con filtros y acciones
 */
export const useDataTableProps = (props) => useStandardProps(props, {
  componentType: 'datatable',
  defaultSize: 'md',
  defaultVariant: 'neutral',
  defaultRounded: 'lg'
});

// ===== HOOKS COMPUESTOS PARA CASOS ESPECÍFICOS =====

/**
 * Hook compuesto para botones con estado de loading
 * Combina useStandardProps con lógica específica de loading
 */
export const useLoadingButtonProps = (props) => {
  const standardProps = useButtonProps(props);
  const { loading, disabled } = standardProps;
  
  const loadingState = useMemo(() => ({
    isClickable: !loading && !disabled,
    showSpinner: loading,
    ariaLabel: loading ? 'Cargando...' : standardProps.ariaLabel
  }), [loading, disabled, standardProps.ariaLabel]);
  
  return {
    ...standardProps,
    ...loadingState
  };
};

/**
 * Hook compuesto para inputs con validación
 * Combina useStandardProps con estados de validación
 */
export const useValidatedInputProps = (props, validationState = {}) => {
  const standardProps = useInputProps(props);
  const { isValid = true, errorMessage = '', showError = false } = validationState;
  
  const validationProps = useMemo(() => {
    // Cambiar variante basado en validación
    const variant = !isValid && showError ? 'danger' : standardProps.variant;
    
    return {
      ...standardProps,
      variant,
      isValid,
      errorMessage,
      showError,
      hasError: !isValid && showError,
      'aria-invalid': !isValid && showError,
      'aria-describedby': errorMessage ? `${props.id || 'input'}-error` : undefined
    };
  }, [standardProps, isValid, errorMessage, showError, props.id]);
  
  return validationProps;
};

// ===== FACTORY PARA HOOKS PERSONALIZADOS =====

/**
 * Factory para crear hooks personalizados con configuración específica
 * 
 * @param {Object} config - Configuración del hook
 * @returns {Function} Hook personalizado
 * 
 * @example
 * const useMyComponentProps = createStandardHook({
 *   componentType: 'myComponent',
 *   defaultSize: 'lg',
 *   defaultVariant: 'success'
 * });
 * 
 * // Usar en componente
 * const myProps = useMyComponentProps(props);
 */
export const createStandardHook = (config = {}) => {
  return (props) => useStandardProps(props, config);
};

// ===== UTILIDADES PARA DEBUGGING =====

/**
 * Hook de debugging que registra cambios en props y tokens
 * Solo activo en desarrollo
 */
export const useStandardPropsDebug = (props, options, componentName = 'Component') => {
  const standardProps = useStandardProps(props, options);
  
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMemo(() => {
      console.group(`🔍 ${componentName} - Standard Props Debug`);
      console.log('Props originales:', props);
      console.log('Opciones:', options);
      console.log('Props procesadas:', standardProps);
      console.log('Tokens:', standardProps.tokens);
      console.groupEnd();
    }, [props, options, standardProps, componentName]);
  }
  
  return standardProps;
};

// ===== EXPORTS DEFAULT =====
export default useStandardProps;