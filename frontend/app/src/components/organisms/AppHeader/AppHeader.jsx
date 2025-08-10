// AppHeader.jsx
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { SearchBar } from '../../molecules/SearchBar/SearchBar';
import { ThemeSelector } from '../../atoms/ThemeSelector';
import './AppHeader.css';

/**
 * Componente AppHeader - Organism
 * 
 * Header principal de la aplicación con título, búsqueda y usuario.
 * Para usar en MainPage y otras páginas principales.
 */
function AppHeader({
  // Título de la app
  appTitle = 'StreamApp',
  onTitleClick = null,
  
  // Usuario
  userName = null,
  onLogout = () => {},
  
  // Búsqueda
  searchValue = '',
  onSearchChange = () => {},
  searchPlaceholder = 'Buscar películas, series...',
  showSearch = true,
  
  // Estilos
  variant = 'primary',
  size = 'md',
  
  // Props adicionales
  className = '',
  ...restProps
}) {
  
  // Clases CSS dinámicas
  const headerClasses = [
    'app-header',
    `app-header--variant-${variant}`,
    `app-header--size-${size}`,
    className
  ].filter(Boolean).join(' ');

  // Filtrar props que no deben propagarse al DOM
  const {
    showBackButton,
    onBackClick,
    ...validDOMProps
  } = restProps;

  // Evitar warnings de variables no usadas (necesarias para filtrar del DOM)
  void showBackButton; void onBackClick;

  return (
    <header className={headerClasses} {...validDOMProps}>
      {/* Brand/Logo */}
      <div className="app-header__brand">
        <h1 
          className={`app-header__title ${onTitleClick ? 'app-header__title--clickable' : ''}`}
          onClick={onTitleClick}
          style={onTitleClick ? { cursor: 'pointer' } : {}}
        >
          {appTitle}
        </h1>
      </div>

      {/* Búsqueda */}
      {showSearch && (
        <div className="app-header__search">
          <SearchBar
            variant="simple"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            size={size === 'lg' ? 'lg' : 'md'}
            className="search-input"
          />
        </div>
      )}

      {/* Usuario */}
      <div className="app-header__user">
        {userName && (
          <span className="app-header__welcome">
            ¡Hola, {userName}!
          </span>
        )}
        <Button
          variant="outline"
          size={size === 'lg' ? 'md' : 'sm'}
          onClick={onLogout}
          className="logout-button"
        >
          Cerrar Sesión
        </Button>
        <ThemeSelector variant="compact" size='md' />
      </div>
    </header>
  );
}

AppHeader.propTypes = {
  appTitle: PropTypes.string,
  onTitleClick: PropTypes.func,
  userName: PropTypes.string,
  onLogout: PropTypes.func,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  showSearch: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'dark', 'light']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export { AppHeader };