// providers-hooks.js - Hooks aislados para tree shaking óptimo
// ✅ Bundle Splitting Optimization - Solo hooks sin providers

import { useIcon } from './IconProvider.jsx';
import { useTheme } from './ThemeProvider.jsx';

// ✅ EXPORTS INDIVIDUALES - Tree shaking perfecto
export { useIcon, useTheme };

/**
 * ✅ HOOK COMBINADO para casos comunes
 * Permite importar ambos hooks en una sola línea
 */
export function useDesignSystem() {
  const iconSystem = useIcon();
  const themeSystem = useTheme();
  
  return {
    icons: iconSystem,
    theme: themeSystem
  };
}

/**
 * ✅ HOOK ESPECÍFICO para componentes que solo necesitan iconos
 */
export function useIconOnly(name, size = 'md') {
  const { IconComponent, exists } = useIcon(name, size);
  return { IconComponent, exists };
}

/**
 * ✅ HOOK ESPECÍFICO para componentes que solo necesitan theme
 */
export function useThemeOnly() {
  const { currentTheme, colorMode, isDark } = useTheme();
  return { currentTheme, colorMode, isDark };
}