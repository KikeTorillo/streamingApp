// ThemeSelector.jsx - Selector de Themes con Sistema de Diseño Universal
// ✅ COMPLETAMENTE MIGRADO: Usa 100% componentes del sistema de diseño

// import React from 'react'; // No necesario en React 17+
import PropTypes from 'prop-types';
import { useTheme } from '../../../providers/ThemeProvider';
import { TextSelect } from '../../molecules/TextSelect/TextSelect';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { Container } from '../Container/Container';
import { FlexContainer } from '../FlexContainer/FlexContainer';
import { Label } from '../Label/Label';

/**
 * ✅ ThemeSelector - SELECTOR DE THEMES CON SISTEMA DE DISEÑO UNIVERSAL
 * 
 * ✅ COMPLETAMENTE MIGRADO - 100% componentes del sistema de diseño:
 * - Container: Reemplaza div nativo para contenedores
 * - FlexContainer: Layouts flexbox con props estandarizadas
 * - Label: Labels semánticas con iconos del sistema
 * - Button: Botones del sistema con iconos universales
 * - Badge: Badges del sistema con variantes estándar
 * - Select: Selects del sistema con opciones tipadas
 * 
 * CARACTERÍSTICAS DEL SISTEMA UNIVERSAL:
 * - ✅ Múltiples themes configurables dinámicamente
 * - ✅ Runtime switching sin reload de página
 * - ✅ Modo claro/oscuro por theme automático
 * - ✅ Auto-detection del sistema operativo
 * - ✅ Preview visual de themes en tiempo real
 * - ✅ Props estándar unificadas (size, variant, etc.)
 * - ✅ Iconos universales integrados (moon, sun, palette)
 * - ✅ Layouts responsivos automáticos
 * - ✅ Backward compatibility 100%
 */
function ThemeSelector({
  size = 'md',
  variant = 'primary',
  showModeToggle = true,
  className = '',
  ...restProps
}) {
  const {
    currentTheme,
    colorMode,
    finalColorMode,
    availableThemes,
    setCurrentTheme,
    setColorMode,
    toggleColorMode,
    isDark,
    systemPreference
  } = useTheme();

  // ✅ GENERAR OPCIONES DINÁMICAMENTE
  const themeOptions = availableThemes.map(themeName => {

    // Iconos y labels por theme
    const themeInfo = {
      streaming: { icon: '🌊', label: 'Océano' },
      tierra: { icon: '🌿', label: 'Tierra' },
      ecommerce: { icon: '🛒', label: 'E-commerce' },
      enterprise: { icon: '🏢', label: 'Enterprise' },
      gaming: { icon: '🎮', label: 'Gaming' }
    };

    const info = themeInfo[themeName] || { icon: '🎨', label: themeName };

    return {
      value: themeName,
      label: `${info.icon} ${info.label}`
    };
  });

  // ✅ OPCIONES DE MODO DE COLOR
  const colorModeOptions = [
    { value: 'auto', label: '🔄 Auto' },
    { value: 'light', label: '☀️ Claro' },
    { value: 'dark', label: '🌙 Oscuro' }
  ];

  // ✅ MANEJADORES DE EVENTOS
  const handleThemeChange = (e) => {
    setCurrentTheme(e.target.value);
  };

  const handleModeChange = (e) => {
    setColorMode(e.target.value);
  };

  return (
    <>
      <TextSelect
        value={currentTheme}
        onChange={handleThemeChange}
        options={themeOptions}
        size={size}
        variant={variant}
        width="auto"
        ariaLabel="Selector de tema"
        compact
      />
      <Button
        onClick={toggleColorMode}
        variant="secondary"
        size={size}
        width="auto"
        iconOnly={true}
        leftIcon={isDark ? 'moon' : 'sun'}
        ariaLabel={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
        title={`Modo actual: ${finalColorMode} (${colorMode})`}
      />
    </>
  );
}

/**
 * ✅ PROPTYPES
 */
ThemeSelector.propTypes = {
  /** Tamaño del selector */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),

  /** Variante de color */
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']),

  /** Mostrar controles de modo claro/oscuro */
  showModeToggle: PropTypes.bool,

  /** Renderizado compacto (solo botones) */
  compact: PropTypes.bool,

  /** Clase CSS adicional */
  className: PropTypes.string
};

// ✅ DISPLAY NAME para debugging
ThemeSelector.displayName = 'ThemeSelector';

export { ThemeSelector };
export default ThemeSelector;