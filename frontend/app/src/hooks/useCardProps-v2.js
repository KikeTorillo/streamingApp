// hooks/useCardProps-v2.js
// 🔧 HOOK ESPECIALIZADO PARA CARD SYSTEM V2
// Parte del Plan de Refactorización Card System V2

import { useMemo } from 'react';
import { useInteractiveProps } from './useStandardProps-v2';
import { 
  CARD_SYSTEM_TOKENS, 
  generateCardCSSProperties,
  isValidCardSize,
  isValidContentType,
  isValidCardVariant,
  CARD_SYSTEM_DEFAULTS
} from '../tokens/cardTokens-v2';

/**
 * 🎯 useCardProps-v2: Hook especializado para Card System
 * 
 * ✅ RESUELVE LOS PROBLEMAS:
 * - Props inconsistentes entre Card, ContentImage, ContentCard
 * - CSS tradicional vs Sistema V2 desconectados
 * - Aspect ratio vs height fijo conflictos
 * - Dependencias circulares en migración
 * 
 * 🏗️ FILOSOFÍA:
 * "Un hook, múltiples componentes, API unificada"
 */
export function useCardProps(props, config = {}) {
  // Configuración del hook
  const {
    contentType = CARD_SYSTEM_DEFAULTS.contentType,
    defaultSize = CARD_SYSTEM_DEFAULTS.size,
    defaultCardVariant = CARD_SYSTEM_DEFAULTS.cardVariant,
    componentName = 'Card',
    ...hookConfig
  } = config;

  // Extraer props específicas de card antes del hook base
  const {
    cardVariant = defaultCardVariant,
    showRating = CARD_SYSTEM_DEFAULTS.showRating,
    showMeta = CARD_SYSTEM_DEFAULTS.showMeta,
    showCategory = CARD_SYSTEM_DEFAULTS.showCategory,
    ...restProps
  } = props;

  // Usar el hook base con configuración especializada
  const baseProps = useInteractiveProps(restProps, {
    ...hookConfig,
    componentName,
    defaultSize
  });

  // Validaciones de desarrollo
  if (import.meta.env?.DEV) {
    if (!isValidCardSize(baseProps.size)) {
      console.warn(
        `⚠️ ${componentName}: size "${baseProps.size}" no es válido. ` +
        `Usar: ${Object.keys(CARD_SYSTEM_TOKENS.sizes).join(', ')}`
      );
    }
    
    if (!isValidContentType(contentType)) {
      console.warn(
        `⚠️ ${componentName}: contentType "${contentType}" no es válido. ` +
        `Usar: ${Object.keys(CARD_SYSTEM_TOKENS.contentTypes).join(', ')}`
      );
    }
    
    if (!isValidCardVariant(cardVariant)) {
      console.warn(
        `⚠️ ${componentName}: cardVariant "${cardVariant}" no es válido. ` +
        `Usar: ${Object.keys(CARD_SYSTEM_TOKENS.cardVariants).join(', ')}`
      );
    }
  }

  // Obtener tokens especializados
  const cardTokens = useMemo(() => 
    CARD_SYSTEM_TOKENS.sizes[baseProps.size] || CARD_SYSTEM_TOKENS.sizes[defaultSize],
    [baseProps.size, defaultSize]
  );

  const contentTokens = useMemo(() => 
    CARD_SYSTEM_TOKENS.contentTypes[contentType],
    [contentType]
  );

  const variantTokens = useMemo(() => 
    CARD_SYSTEM_TOKENS.cardVariants[cardVariant],
    [cardVariant]
  );

  const spacingTokens = useMemo(() => 
    CARD_SYSTEM_TOKENS.spacing,
    []
  );

  const animationTokens = useMemo(() => 
    CARD_SYSTEM_TOKENS.animations,
    []
  );

  // Generar CSS custom properties
  const cardCSSProperties = useMemo(() => 
    generateCardCSSProperties(baseProps.size, contentType, cardVariant),
    [baseProps.size, contentType, cardVariant]
  );

  // Helper para dimensiones consistentes
  const cardSize = useMemo(() => ({
    width: cardTokens.width,
    height: cardTokens.height,
    aspectRatio: contentTokens.aspectRatio,
    fontSize: cardTokens.fontSize,
    iconSize: cardTokens.iconSize
  }), [cardTokens, contentTokens]);

  // Función generateStyles especializada para cards
  const generateCardStyles = useMemo(() => (additionalStyles = {}) => {
    const baseStyles = baseProps.generateStyles(additionalStyles);
    
    return {
      ...baseStyles,
      ...cardCSSProperties,
      // Garantizar dimensiones consistentes
      width: cardSize.width,
      height: cardSize.height,
      aspectRatio: cardSize.aspectRatio,
      fontSize: cardSize.fontSize,
      '--card-icon-size': cardSize.iconSize,
      // Merge con estilos adicionales
      ...additionalStyles
    };
  }, [baseProps.generateStyles, cardCSSProperties, cardSize]);

  // Función generateClassName especializada para cards
  const generateCardClassName = useMemo(() => (baseClass, additionalClasses = []) => {
    const baseClassName = baseProps.generateClassName(baseClass, additionalClasses);
    
    const cardSpecificClasses = [
      `${baseClass}--card-variant-${cardVariant}`,
      `${baseClass}--content-type-${contentType}`,
      `${baseClass}--card-size-${baseProps.size}`
    ];
    
    return `${baseClassName} ${cardSpecificClasses.join(' ')}`.trim();
  }, [baseProps.generateClassName, cardVariant, contentType, baseProps.size]);

  // Props específicas de funcionalidad
  const cardFunctionality = useMemo(() => ({
    showRating,
    showMeta,
    showCategory,
    contentType,
    cardVariant
  }), [showRating, showMeta, showCategory, contentType, cardVariant]);

  // Helpers específicos para diferentes tipos de componentes
  const componentHelpers = useMemo(() => ({
    // Helper para ContentImage
    getImageProps: () => ({
      size: baseProps.size,
      aspectRatio: contentTokens.aspectRatio,
      objectFit: contentTokens.objectFit,
      contentType
    }),
    
    // Helper para Badge
    getBadgeProps: () => ({
      size: baseProps.size === 'xs' ? 'xs' : baseProps.size === 'xl' ? 'sm' : 'xs',
      variant: contentType === 'movie' ? 'primary' : 'secondary'
    }),
    
    // Helper para Typography
    getTypographyProps: () => ({
      size: cardTokens.fontSize,
      weight: 'medium'
    })
  }), [baseProps.size, contentTokens, contentType, cardTokens]);

  return {
    // Props del hook base (ya procesadas)
    ...baseProps,
    
    // Tokens especializados
    cardTokens,
    contentTokens,
    variantTokens,
    spacingTokens,
    animationTokens,
    
    // Helpers de dimensiones
    cardSize,
    cardCSSProperties,
    
    // Props específicas de funcionalidad
    ...cardFunctionality,
    
    // Funciones especializadas
    generateStyles: generateCardStyles,
    generateClassName: generateCardClassName,
    
    // Helpers para componentes específicos
    ...componentHelpers
  };
}

/**
 * 🎯 EJEMPLO DE USO:
 * 
 * // En ContentCard:
 * const cardProps = useCardProps(props, { 
 *   contentType: 'movie',
 *   componentName: 'ContentCard' 
 * });
 * 
 * // En ContentImage:
 * const imageProps = useCardProps(props, { 
 *   contentType: 'series',
 *   componentName: 'ContentImage' 
 * });
 * 
 * // En Card:
 * const baseProps = useCardProps(props, { 
 *   componentName: 'Card' 
 * });
 */

/**
 * 🚀 BENEFICIOS CONSEGUIDOS:
 * 
 * ✅ API UNIFICADA: Props consistentes entre todos los componentes
 * ✅ TOKENS CENTRALIZADOS: Un lugar para definir tamaños y comportamientos
 * ✅ VALIDACIONES AUTOMÁTICAS: Warnings en desarrollo para props inválidas
 * ✅ CSS PROPERTIES: Generación automática de custom properties
 * ✅ RESPONSIVE: Adaptive sizing automático
 * ✅ HELPERS: Funciones específicas para cada tipo de componente
 * ✅ PERFORMANCE: Memoización optimizada
 * ✅ TYPESCRIPT: Tipado completo (TODO)
 */
