// FilterBar.jsx
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { useStandardProps, extractDOMProps } from '../../../tokens/index.js';
import './FilterBar.css';

/**
 * Componente FilterBar - Molecule
 * 
 * Barra de filtros con categorías y acciones adicionales integrada
 * completamente con el sistema de diseño.
 * 
 * ✅ SISTEMA DE DISEÑO:
 * - Props estándar: size, variant, rounded, disabled, loading, className
 * - Tokens dinámicos: Acceso programático a variables CSS
 * - Validación automática: Warnings para props incorrectas en desarrollo
 * - Consistencia: Misma API que otros componentes del sistema
 */
function FilterBar(props) {
  // ✅ USAR SISTEMA DE DISEÑO: useStandardProps con configuración específica
  const {
    // Props estándar del sistema
    size,
    variant,
    rounded,
    disabled,
    loading,
    className,
    tokens,
    // renderIcon, // No se usa directamente en FilterBar, los botones internos manejan sus iconos
    
    // Props específicas de FilterBar
    categories = [],
    selectedCategory = 'all',
    onCategoryChange = () => {},
    actions = null,
    error,
    
    // Props restantes para DOM
    ...restProps
  } = useStandardProps(props, {
    componentType: 'filterBar',
    defaultSize: 'md',
    defaultVariant: 'primary', // Variante estándar del sistema
    defaultRounded: 'lg'
  });
  
  // ✅ EXTRAER PROPS DOM-SAFE: Filtrar automáticamente props del sistema
  const domProps = extractDOMProps({ 
    ...restProps, 
    className, 
    disabled,
    style: tokens ? {
      // ✅ APLICAR TOKENS DINÁMICOS: Variables CSS accesibles desde JavaScript
      padding: tokens.size?.padding,
      fontSize: tokens.size?.fontSize,
      borderRadius: tokens.rounded,
      // CSS classes manejan colores, aquí solo overrides específicos si es necesario
      ...restProps.style
    } : restProps.style
  });
  
  // ✅ CLASES CSS DEL SISTEMA: Usar variantes estándar + estados
  const filterBarClasses = [
    'filter-bar',
    `filter-bar--variant-${variant}`, // primary, secondary, success, warning, danger, neutral
    `filter-bar--size-${size}`,       // xs, sm, md, lg, xl
    `filter-bar--rounded-${rounded}`, // sm, md, lg, xl, full
    loading && 'filter-bar--loading',
    error && 'filter-bar--error',
    disabled && 'filter-bar--disabled',
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
                // ✅ VARIANTES ESTÁNDAR: Usar solo variantes del sistema de diseño
                variant={selectedCategory === category.value ? 'primary' : 'secondary'}
                size={size} // ✅ Heredar tamaño del FilterBar
                rounded={rounded} // ✅ Heredar rounded del FilterBar
                onClick={() => onCategoryChange(category.value)}
                className="filter-bar__category-button"
                disabled={disabled || loading} // ✅ Deshabilitar durante loading
                // ✅ ICONOS DEL SISTEMA: Si la categoría tiene icono, usar leftIcon
                leftIcon={category.icon}
              >
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
  // ✅ PROPS ESTÁNDAR DEL SISTEMA: Importar desde standardProps
  // Todas estas props son validadas automáticamente por useStandardProps
  
  // Props específicas de FilterBar
  categories: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string // ✅ NUEVO: Soporte para iconos en categorías
  })),
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func,
  actions: PropTypes.node,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  
  // Nota: size, variant, rounded, disabled, loading, className
  // son manejadas automáticamente por useStandardProps
  // y validadas con STANDARD_PROP_TYPES
};

export { FilterBar };