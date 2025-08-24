// Pagination.jsx - Componente standalone para paginación
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Select } from '../../atoms/Select/Select';
import { Icon } from '../../atoms/Icon/Icon';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { INTERACTIVE_PROP_TYPES, extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import './Pagination.css';

/**
 * Componente Pagination Standalone - Molécula del Design System
 * 
 * 🎯 Casos de uso:
 * - MainPage grid de películas/series
 * - SearchResults lista de resultados  
 * - CategoryPage movies por categoría
 * - UserFavorites lista de favoritos
 * - Cualquier contenido paginado NO tabular
 * 
 * ✅ INDEPENDIENTE de TanStack Table
 * ✅ API simple e intuitiva (1-based pages)
 * ✅ Mobile-first responsive
 * ✅ Sistema de diseño estándar integrado
 * 
 * ❌ NO usar para DataTable (ya tiene TanStack pagination)
 * 
 * @param {Object} props - Props del componente
 * @param {number} props.currentPage - Página actual (1-based)
 * @param {number} props.totalPages - Total de páginas
 * @param {Function} props.onPageChange - Callback de cambio de página
 * @param {number} props.totalItems - Total de elementos
 * @param {number} props.itemsPerPage - Elementos por página
 * @param {Function} props.onItemsPerPageChange - Callback cambio tamaño página
 */
function Pagination(props) {
  // Extraer props específicas del componente
  const {
    // Navegación básica (requerida)
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => {},
    
    // Información detallada (opcional)
    totalItems = null,
    itemsPerPage = null,
    onItemsPerPageChange = null,
    itemsPerPageOptions = [10, 25, 50, 100],
    
    // Personalización (ahora usa paginationVariant para evitar conflicto)
    paginationVariant = 'full', // full, simple, compact
    showInfo = true,
    showSizeSelector = true,
    showFirstLast = true,
    
    // Responsive
    breakpoint = 768,
    
    // Personalización de textos
    labels = {
      first: 'Primero',
      previous: 'Anterior', 
      next: 'Siguiente',
      last: 'Último',
      showing: 'Mostrando',
      to: 'a',
      of: 'de',
      results: 'resultados',
      page: 'Página',
      itemsPerPage: 'por página'
    },
    
    ...restProps
  } = props;

  // ✅ SISTEMA V2: Hook estándar - Pagination es tipo navegación
  const {
    size,
    variant, // Esta es la variante semántica estándar
    // eslint-disable-next-line no-unused-vars
    rounded,
    disabled,
    loading,
    className,
    tokens,
    generateStyles,
    renderIcon,
    ...standardProps
  } = useInteractiveProps(restProps, {
    componentName: 'Pagination',
    defaultSize: 'md',
    defaultVariant: 'neutral',
    defaultRounded: 'md'
  });

  // ✅ SISTEMA V2: Props seguros para DOM
  const domProps = extractDOMPropsV2({
    ...standardProps,
    disabled,
    className
  });
  
  // Validaciones
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, safeTotalPages));
  
  // Calcular información de elementos
  const startItem = totalItems && itemsPerPage 
    ? (safeCurrentPage - 1) * itemsPerPage + 1
    : null;
    
  const endItem = totalItems && itemsPerPage
    ? Math.min(safeCurrentPage * itemsPerPage, totalItems)
    : null;
  
  // Estados de navegación
  const canGoPrevious = safeCurrentPage > 1;
  const canGoNext = safeCurrentPage < safeTotalPages;
  const isFirstPage = safeCurrentPage === 1;
  const isLastPage = safeCurrentPage === safeTotalPages;
  
  // Handlers de navegación
  const handlePageChange = (newPage) => {
    if (disabled || loading) return;
    
    const targetPage = Math.max(1, Math.min(newPage, safeTotalPages));
    if (targetPage !== safeCurrentPage) {
      onPageChange(targetPage);
    }
  };
  
  const handleItemsPerPageChange = (newItemsPerPage) => {
    if (disabled || loading || !onItemsPerPageChange) return;
    
    onItemsPerPageChange(Number(newItemsPerPage));
    
    // Recalcular página actual para mantener posición aproximada
    if (totalItems && itemsPerPage) {
      const currentFirstItem = (safeCurrentPage - 1) * itemsPerPage;
      const newPage = Math.floor(currentFirstItem / newItemsPerPage) + 1;
      handlePageChange(newPage);
    } else {
      handlePageChange(1); // Reset a primera página
    }
  };
  
  // ✅ SSR-SAFE: Detectar mobile con useState/useEffect
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Verificar tamaño inicial
    checkMobile();

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);
    
  // ✅ V2: Variable removida - no era necesaria después de migración
  
  // Mapear variante legacy para backward compatibility
  const effectivePaginationVariant = (() => {
    // Si se pasó la prop legacy variant directamente en props
    const legacyVariant = props.variant;
    if (legacyVariant && typeof legacyVariant === 'string' && ['full', 'simple', 'compact'].includes(legacyVariant)) {
      if (import.meta.env?.DEV) {
        console.warn('⚠️ Pagination: prop "variant" está deprecada para variants de paginación. Usar "paginationVariant"');
      }
      return legacyVariant;
    }
    return paginationVariant;
  })();

  // Detectar mobile y ajustar variante
  const finalPaginationVariant = isMobile && effectivePaginationVariant === 'full' ? 'compact' : effectivePaginationVariant;

  // Construir clases CSS usando sistema estándar
  const paginationClasses = [
    'pagination',
    `pagination--pagination-variant-${finalPaginationVariant}`,
    `pagination--size-${size}`,
    `pagination--variant-${variant}`,
    disabled && 'pagination--disabled',
    loading && 'pagination--loading',
    className
  ].filter(Boolean).join(' ');
  
  // Si solo hay una página, no mostrar paginación (opcional)
  if (safeTotalPages <= 1 && finalPaginationVariant !== 'full') {
    return null;
  }
  
  return (
    <div 
      className={paginationClasses}
      style={{
        ...generateStyles(),
        ...domProps.style
      }}
      {...domProps}
    >
      {/* Información de elementos (solo variant full y simple) */}
      {finalPaginationVariant !== 'compact' && showInfo && totalItems && itemsPerPage && (
        <div className="pagination__info">
          <span className="pagination__info-text">
            {labels.showing} {startItem} {labels.to} {endItem} {labels.of} {totalItems} {labels.results}
          </span>
          
          {/* Selector de items por página */}
          {showSizeSelector && onItemsPerPageChange && finalPaginationVariant === 'full' && (
            <div className="pagination__size-selector">
              <Select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                size={size === 'lg' ? 'md' : 'sm'}
                disabled={disabled || loading}
                options={itemsPerPageOptions.map(option => ({
                  value: option,
                  label: `${option} ${labels.itemsPerPage}`
                }))}
                className="pagination__size-select"
              />
            </div>
          )}
        </div>
      )}
      
      {/* Controles de navegación */}
      <div className="pagination__controls">
        {/* Botón Primera (solo full variant) */}
        {finalPaginationVariant === 'full' && showFirstLast && (
          <Button
            variant="outline"
            size={size}
            onClick={() => handlePageChange(1)}
            disabled={disabled || loading || isFirstPage}
            className="pagination__button pagination__button--first"
            leftIcon={renderIcon('chevrons-left')}
            title={labels.first}
          >
            {finalPaginationVariant === 'compact' ? renderIcon('chevrons-left') : labels.first}
          </Button>
        )}
        
        {/* Botón Anterior */}
        <Button
          variant="outline"
          size={size}
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={disabled || loading || !canGoPrevious}
          className="pagination__button pagination__button--previous"
          leftIcon={finalPaginationVariant !== 'compact' ? renderIcon('chevron-left') : null}
          title={labels.previous}
        >
          {finalPaginationVariant === 'compact' ? renderIcon('chevron-left') : labels.previous}
        </Button>
        
        {/* Información de página actual */}
        <div className="pagination__current">
          {finalPaginationVariant === 'compact' ? (
            <span className="pagination__current-compact">
              {safeCurrentPage}/{safeTotalPages}
            </span>
          ) : (
            <span className="pagination__current-full">
              {labels.page} <strong>{safeCurrentPage}</strong> {labels.of} <strong>{safeTotalPages}</strong>
            </span>
          )}
          
          {loading && renderIcon('loader')}
        </div>
        
        {/* Botón Siguiente */}
        <Button
          variant="outline"
          size={size}
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={disabled || loading || !canGoNext}
          className="pagination__button pagination__button--next"
          rightIcon={finalPaginationVariant !== 'compact' ? renderIcon('chevron-right') : null}
          title={labels.next}
        >
          {finalPaginationVariant === 'compact' ? renderIcon('chevron-right') : labels.next}
        </Button>
        
        {/* Botón Última (solo full variant) */}
        {finalPaginationVariant === 'full' && showFirstLast && (
          <Button
            variant="outline"
            size={size}
            onClick={() => handlePageChange(safeTotalPages)}
            disabled={disabled || loading || isLastPage}
            className="pagination__button pagination__button--last"
            rightIcon={renderIcon('chevrons-right')}
            title={labels.last}
          >
            {finalPaginationVariant === 'compact' ? renderIcon('chevrons-right') : labels.last}
          </Button>
        )}
      </div>
    </div>
  );
}

Pagination.propTypes = {
  // ✅ SISTEMA V2: Props estándar del sistema de diseño
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas del componente
  // Navegación básica
  currentPage: PropTypes.number,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  
  // Información detallada
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onItemsPerPageChange: PropTypes.func,
  itemsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  
  // Personalización específica de paginación
  paginationVariant: PropTypes.oneOf(['full', 'simple', 'compact']),
  showInfo: PropTypes.bool,
  showSizeSelector: PropTypes.bool,
  showFirstLast: PropTypes.bool,
  
  // Responsive
  breakpoint: PropTypes.number,
  
  // Personalización de textos
  labels: PropTypes.shape({
    first: PropTypes.string,
    previous: PropTypes.string,
    next: PropTypes.string,
    last: PropTypes.string,
    showing: PropTypes.string,
    to: PropTypes.string,
    of: PropTypes.string,
    results: PropTypes.string,
    page: PropTypes.string,
    itemsPerPage: PropTypes.string
  })
};

export { Pagination };