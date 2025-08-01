// FilterBar.jsx
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import './FilterBar.css';

/**
 * Componente FilterBar - Molecule
 * 
 * Barra de filtros con categorías y acciones adicionales.
 * Para filtrar contenido en MainPage.
 */
function FilterBar({
  // Categorías
  categories = [],
  selectedCategory = 'all',
  onCategoryChange = () => {},
  
  // Acciones adicionales (botones a la derecha)
  actions = null,
  
  // Estilos
  variant = 'default',
  size = 'md',
  
  // Props adicionales
  className = '',
  
  // ✅ SEPARAR PROPS PERSONALIZADAS QUE NO VAN AL DOM
  loading, // ← PROP PERSONALIZADA
  error, // ← PROP PERSONALIZADA
  disabled, // ← Esta sí puede ir al DOM
  
  ...restProps
}) {
  
  // ✅ FILTRAR PROPS QUE NO DEBEN IR AL DOM
  const {
    loading: _loading,
    error: _error,
    variant: _variant,
    size: _size,
    categories: _categories,
    selectedCategory: _selectedCategory,
    onCategoryChange: _onCategoryChange,
    actions: _actions,
    ...domProps // ✅ Solo props válidas para el DOM
  } = restProps;

  // Usar variables para evitar warning de no-unused-vars
  void _loading;
  void _error;
  void _variant;
  void _size;
  void _categories;
  void _selectedCategory;
  void _onCategoryChange;
  void _actions;
  
  // Clases CSS dinámicas
  const filterBarClasses = [
    'filter-bar',
    `filter-bar--variant-${variant}`,
    `filter-bar--size-${size}`,
    loading && 'filter-bar--loading',
    error && 'filter-bar--error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={filterBarClasses} 
      {...domProps} // ✅ Solo props válidas del DOM
    >
      {/* Estados de loading */}
      {loading && (
        <div className="filter-bar__loading">
          <span>Cargando filtros...</span>
        </div>
      )}
      
      {/* Estados de error */}
      {error && (
        <div className="filter-bar__error">
          <span>Error: {error}</span>
        </div>
      )}
      
      {/* Contenido normal cuando no hay loading ni error */}
      {!loading && !error && (
        <>
          {/* Categorías */}
          <div className="filter-bar__categories">
            {categories.map(category => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'primary' : 'outline'}
                size={size === 'lg' ? 'md' : 'sm'}
                onClick={() => onCategoryChange(category.value)}
                className="filter-bar__category-button"
                disabled={disabled}
              >
                {category.icon && <span className="category-icon">{category.icon}</span>}
                {category.label}
              </Button>
            ))}
          </div>

          {/* Acciones */}
          {actions && (
            <div className="filter-bar__actions">
              {actions}
            </div>
          )}
        </>
      )}
    </div>
  );
}

FilterBar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string
  })),
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func,
  actions: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool
};

export { FilterBar };