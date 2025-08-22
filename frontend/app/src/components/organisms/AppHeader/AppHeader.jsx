// AppHeader.jsx
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { SearchBar } from '../../molecules/SearchBar/SearchBar';
import { ThemeSelector } from '../../atoms/ThemeSelector';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Typography } from '../../atoms/Typography/Typography';

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
  
  // Clases CSS simplificadas (sin CSS file)
  const headerClasses = className;

  // Filtrar props que no deben propagarse al DOM
  const {
    showBackButton,
    onBackClick,
    ...validDOMProps
  } = restProps;

  // Evitar warnings de variables no usadas (necesarias para filtrar del DOM)
  void showBackButton; void onBackClick;

  // Solo el background usando tokens del sistema de diseño
  const headerStyles = {
    background: 'var(--color-primary)'
  };

  return (
    <header {...validDOMProps} className={headerClasses} style={headerStyles}>
      <FlexContainer 
        align="center" 
        justify="space-between" 
        gap="lg"
        width="full"
        as="div"
        padding="lg"
      >
        {/* Brand/Logo */}
        <FlexContainer 
          align="center" 
          shrink={false}
        >
          <Typography
            as="h1"
            size={size === 'lg' ? '2xl' : 'xl'}
            weight="bold"
            color="light"
            onClick={onTitleClick}
          >
            {appTitle}
          </Typography>
        </FlexContainer>

        {/* Búsqueda */}
        {showSearch && (
          <FlexContainer 
            grow 
            justify="center"
            style={{ maxWidth: '40rem' }}
          >
            <SearchBar
              searchVariant="simple"
              variant="primary"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={onSearchChange}
              size={size === 'lg' ? 'lg' : 'md'}
              width="full"
            />
          </FlexContainer>
        )}

        {/* Usuario */}
        <FlexContainer 
          align="center" 
          gap="md"
          className="app-header__user"
          shrink={false}
        >
          {userName && (
            <Typography
              size="sm"
              weight="medium"
              color="light"
              className="app-header__welcome"
            >
              ¡Hola, {userName}!
            </Typography>
          )}
          <Button
            variant="secondary"
            size={size === 'lg' ? 'md' : 'sm'}
            onClick={onLogout}
            className="logout-button"
          >
            Cerrar Sesión
          </Button>
          <ThemeSelector variant="neutral" size='md' />
        </FlexContainer>
      </FlexContainer>
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
  variant: PropTypes.oneOf(['primary', 'secondary', 'dark', 'light']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export { AppHeader };