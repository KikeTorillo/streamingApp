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

  // Opciones para el Select - Solo dos temas disponibles
  const themeOptions = [
    { value: 'light', label: '🌊 Océano Claro' },
    { value: 'dark', label: '🌊 Océano Oscuro' },
    { value: 'tierra-light', label: '🌿 Tierra Claro' },
    { value: 'tierra-dark', label: '🌿 Tierra Oscuro' }
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
          variant="primary"
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
