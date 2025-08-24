// hooks/useUniversalImageProps.js
// 🌟 HOOK UNIVERSAL PARA IMÁGENES - 100% REUTILIZABLE

import { useMemo } from 'react';
import { useStandardPropsV2 } from './useStandardProps-v2';
import { 
  UNIVERSAL_CARD_TOKENS,
  generateUniversalCardCSS,
  isValidUniversalSize,
  isValidUniversalAspectRatio,
  getUniversalCardSize,
  getUniversalAspectRatio
} from '../tokens/cardTokens-universal';

/**
 * 🎯 useUniversalImageProps: Hook universal para imágenes
 * 
 * ✅ 100% UNIVERSAL:
 * - Sin acoplamientos a dominios específicos
 * - API limpia con aspectRatio directo
 * - Compatible con cualquier proyecto
 * - Tokens reutilizables
 * 
 * 🏗️ FILOSOFÍA:
 * "Aspect ratios universales + configuración flexible = máxima reutilización"
 */
export function useUniversalImageProps(props, config = {}) {
  // Configuración del hook
  const {
    aspectRatio = 'portrait',
    defaultSize = 'md',
    defaultVariant = 'neutral',
    componentName = 'UniversalImage',
    ...hookConfig
  } = config;

  // Usar el hook base estándar
  const baseProps = useStandardPropsV2(props, {
    ...hookConfig,
    componentName,
    defaultSize
  });

  // Validaciones de desarrollo
  if (import.meta.env?.DEV) {
    if (!isValidUniversalSize(baseProps.size)) {
      console.warn(
        `⚠️ ${componentName}: size "${baseProps.size}" no es válido. ` +
        `Usar: ${Object.keys(UNIVERSAL_CARD_TOKENS.sizes).join(', ')}`
      );
    }
    
    if (!isValidUniversalAspectRatio(aspectRatio)) {
      console.warn(
        `⚠️ ${componentName}: aspectRatio "${aspectRatio}" no es válido. ` +
        `Usar: ${Object.keys(UNIVERSAL_CARD_TOKENS.aspectRatios).join(', ')} o ratio personalizado como "4/3"`
      );
    }
  }

  // Obtener tokens universales
  const sizeTokens = useMemo(() => 
    getUniversalCardSize(baseProps.size),
    [baseProps.size]
  );

  const aspectRatioValue = useMemo(() => 
    getUniversalAspectRatio(aspectRatio),
    [aspectRatio]
  );

  const variantTokens = useMemo(() => 
    UNIVERSAL_CARD_TOKENS.variants[baseProps.variant] || UNIVERSAL_CARD_TOKENS.variants[defaultVariant],
    [baseProps.variant, defaultVariant]
  );

  // Generar CSS custom properties universales
  const universalCSSProperties = useMemo(() => 
    generateUniversalCardCSS(baseProps.size, baseProps.variant, aspectRatio),
    [baseProps.size, baseProps.variant, aspectRatio]
  );

  // Helper para dimensiones consistentes
  const cardSize = useMemo(() => ({
    width: sizeTokens.width,
    minHeight: sizeTokens.minHeight,
    aspectRatio: aspectRatioValue,
    fontSize: sizeTokens.fontSize,
    iconSize: sizeTokens.iconSize,
    padding: sizeTokens.padding
  }), [sizeTokens, aspectRatioValue]);

  // Función generateStyles especializada para imágenes universales
  const generateUniversalStyles = useMemo(() => (additionalStyles = {}) => {
    const baseStyles = baseProps.generateStyles ? baseProps.generateStyles(additionalStyles) : {};
    
    return {
      ...baseStyles,
      ...universalCSSProperties,
      // Garantizar dimensiones consistentes
      width: cardSize.width,
      minHeight: cardSize.minHeight,
      aspectRatio: cardSize.aspectRatio,
      fontSize: cardSize.fontSize,
      padding: cardSize.padding,
      '--card-icon-size': cardSize.iconSize,
      '--card-aspect-ratio': cardSize.aspectRatio,
      // Merge con estilos adicionales
      ...additionalStyles
    };
  }, [baseProps.generateStyles, universalCSSProperties, cardSize]);

  // Función generateClassName especializada para imágenes universales
  const generateUniversalClassName = useMemo(() => (baseClass, additionalClasses = []) => {
    const baseClassName = baseProps.generateClassName ? baseProps.generateClassName(baseClass, additionalClasses) : baseClass;
    
    const universalClasses = [
      `${baseClass}--size-${baseProps.size}`,
      `${baseClass}--variant-${baseProps.variant}`,
      `${baseClass}--aspect-${aspectRatio.replace('/', '-')}`
    ];
    
    return `${baseClassName} ${universalClasses.join(' ')}`.trim();
  }, [baseProps.generateClassName, baseProps.size, baseProps.variant, aspectRatio]);

  // Helpers específicos para imágenes
  const imageHelpers = useMemo(() => ({
    // Obtener configuración de aspect ratio
    getAspectRatioConfig: () => ({
      aspectRatio: aspectRatioValue,
      isCustomRatio: !UNIVERSAL_CARD_TOKENS.aspectRatios[aspectRatio]
    }),
    
    // Obtener configuración de tamaño
    getSizeConfig: () => ({
      size: baseProps.size,
      tokens: sizeTokens,
      responsive: baseProps.size === 'full'
    }),
    
    // Helper para determinar object-fit óptimo según aspect ratio
    getOptimalObjectFit: () => {
      if (aspectRatio === 'square') return 'cover';
      if (aspectRatio === 'wide' || aspectRatio === 'ultrawide') return 'cover';
      return 'cover'; // Default seguro
    }
  }), [aspectRatioValue, aspectRatio, baseProps.size, sizeTokens]);

  return {
    // Props del hook base (ya procesadas)
    ...baseProps,
    
    // Tokens universales
    sizeTokens,
    aspectRatioValue,
    variantTokens,
    universalCSSProperties,
    
    // Helpers de dimensiones
    cardSize,
    
    // Funciones especializadas
    generateStyles: generateUniversalStyles,
    generateClassName: generateUniversalClassName,
    
    // Helpers específicos para imágenes
    ...imageHelpers,
    
    // Props específicas calculadas
    aspectRatio: aspectRatioValue
  };
}

/**
 * 🎯 EJEMPLO DE USO:
 * 
 * // Productos e-commerce:
 * const productProps = useUniversalImageProps(props, { 
 *   aspectRatio: 'portrait',
 *   componentName: 'ProductImage' 
 * });
 * 
 * // Avatares cualquier app:
 * const avatarProps = useUniversalImageProps(props, { 
 *   aspectRatio: 'square',
 *   componentName: 'Avatar' 
 * });
 * 
 * // Banners cualquier web:
 * const bannerProps = useUniversalImageProps(props, { 
 *   aspectRatio: 'wide',
 *   componentName: 'Banner' 
 * });
 * 
 * // Aspect ratio personalizado:
 * const customProps = useUniversalImageProps(props, { 
 *   aspectRatio: '4/3',
 *   componentName: 'CustomImage' 
 * });
 */

/**
 * 🚀 BENEFICIOS CONSEGUIDOS:
 * 
 * ✅ API UNIVERSAL: Funciona para cualquier dominio (e-commerce, social, streaming, etc.)
 * ✅ ASPECT RATIOS FLEXIBLES: Predefinidos + personalizados
 * ✅ TOKENS CENTRALIZADOS: Un lugar para definir comportamientos universales  
 * ✅ VALIDACIONES AUTOMÁTICAS: Warnings en desarrollo para props inválidas
 * ✅ CSS PROPERTIES: Generación automática de custom properties
 * ✅ RESPONSIVE: Adaptive sizing automático
 * ✅ HELPERS: Funciones específicas optimizadas para imágenes
 * ✅ PERFORMANCE: Memoización optimizada
 * ✅ ZERO COUPLING: Sin dependencias a dominios específicos
 */