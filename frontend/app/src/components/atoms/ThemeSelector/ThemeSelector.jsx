import PropTypes from 'prop-types';
import { useTheme } from '../../../app/context/ThemeContext';
import { Select } from '../Select/Select';
import { Button } from '../Button/Button';
import './ThemeSelector.css';

function ThemeSelector({
  size = 'md',
  variant = 'default',
  showLabels = false,
  className = '',
  ...restProps
}) {
  const { theme, setTheme, toggleMode, palette } = useTheme();

  const handleChange = (e) => {
    setTheme(e.target.value);
  };

  // Opciones para el Select con grupos
  const themeOptions = [
    { value: 'light', label: '☀️ Claro (Defecto)' },
    { value: 'dark', label: '🌙 Oscuro (Defecto)' },
    { value: 'ocean-light', label: '🌊 Océano Claro' },
    { value: 'ocean-dark', label: '🌊 Océano Oscuro' },
    { value: 'forest-light', label: '🌲 Bosque Claro' },
    { value: 'forest-dark', label: '🌲 Bosque Oscuro' },
    { value: 'sunset-light', label: '🌅 Atardecer Claro' },
    { value: 'sunset-dark', label: '🌅 Atardecer Oscuro' },
    { value: 'purple-light', label: '💜 Violeta Claro' },
    { value: 'purple-dark', label: '💜 Violeta Oscuro' }
  ];

  const selectorClasses = [
    'theme-selector',
    `theme-selector--size-${size}`,
    `theme-selector--variant-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={selectorClasses} {...restProps}>
      {showLabels && <label className="theme-selector__label">Tema</label>}
      
      <div className="theme-selector__controls">
        <Select
          className="theme-selector__select"
          value={theme}
          onChange={handleChange}
          options={themeOptions}
          size={size}
          variant={variant}
          ariaLabel="Selector de tema"
          compact={true}
        />
        
        <Button
          className="theme-selector__toggle"
          onClick={toggleMode}
          ariaLabel="Alternar modo claro/oscuro"
          variant="ghost"
          size={size}
          iconOnly={true}
          icon={palette === 'default' && (theme === 'dark' ? '🌙' : '☀️') || 
                palette !== 'default' && (theme.endsWith('dark') ? '🌙' : '☀️')}
        />
      </div>
    </div>
  );
}

ThemeSelector.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.string,
  showLabels: PropTypes.bool,
  className: PropTypes.string
};

export { ThemeSelector };
