// index.js - Exports optimizados para Tree Shaking y Bundle Splitting
// ✅ Bundle Splitting Optimization - Punto de entrada único para la librería

// ✅ PROVIDERS - Exports directos para tree shaking
export { IconProvider } from './IconProvider.jsx';
export { ThemeProvider } from './ThemeProvider.jsx';
export { ContextualUIProvider } from './ContextualUIProvider.jsx';

// ✅ HOOKS - Re-exports optimizados
export { useIcon } from './IconProvider.jsx';
export { useTheme } from './ThemeProvider.jsx';

// ✅ HOOKS ESPECIALIZADOS - Para casos específicos
export { 
  useDesignSystem,
  useIconOnly, 
  useThemeOnly 
} from './providers-hooks.js';

// ✅ DEFAULT EXPORT - Provider unificado (caso más común)
export { ContextualUIProvider as default } from './ContextualUIProvider.jsx';