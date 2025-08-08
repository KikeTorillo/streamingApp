// Pagination.jsx - Componente standalone para paginación
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { Select } from '../../atoms/Select/Select';
import { Icon } from '../../atoms/Icon/Icon';
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
 * ✅ Múltiples variantes (full, simple, compact)
 * 
 * ❌ NO usar para DataTable (ya tiene TanStack pagination)
 */
function Pagination({
  // Navegación básica (requerida)
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  
  // Información detallada (opcional)
  totalItems = null,
  itemsPerPage = null,
  onItemsPerPageChange = null,
  itemsPerPageOptions = [10, 25, 50, 100],
  
  // Personalización
  variant = 'full',
  size = 'md',
  showInfo = true,
  showSizeSelector = true,
  showFirstLast = true,
  
  // Estados
  disabled = false,
  loading = false,
  
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
  
  // Props adicionales
  className = '',
  ...restProps
}) {
  
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
  
  // Detectar mobile (si window está disponible)
  const isMobile = typeof window !== 'undefined' 
    ? window.innerWidth < breakpoint 
    : false;
    
  const effectiveVariant = isMobile && variant === 'full' ? 'compact' : variant;
  
  // Construir clases CSS
  const paginationClasses = [
    'pagination',
    `pagination--variant-${effectiveVariant}`,
    `pagination--size-${size}`,
    disabled && 'pagination--disabled',
    loading && 'pagination--loading',
    className
  ].filter(Boolean).join(' ');
  
  // Si solo hay una página, no mostrar paginación (opcional)
  if (safeTotalPages <= 1 && variant !== 'full') {
    return null;
  }
  
  return (
    <div className={paginationClasses} {...restProps}>
      {/* Información de elementos (solo variant full y simple) */}
      {effectiveVariant !== 'compact' && showInfo && totalItems && itemsPerPage && (
        <div className="pagination__info">
          <span className="pagination__info-text">
            {labels.showing} {startItem} {labels.to} {endItem} {labels.of} {totalItems} {labels.results}
          </span>
          
          {/* Selector de items por página */}
          {showSizeSelector && onItemsPerPageChange && effectiveVariant === 'full' && (
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
        {effectiveVariant === 'full' && showFirstLast && (
          <Button
            variant="outline"
            size={size}
            onClick={() => handlePageChange(1)}
            disabled={disabled || loading || isFirstPage}
            className="pagination__button pagination__button--first"
            leftIcon={<Icon name="chevron-left" size="xs" />}
            title={labels.first}
          >
            {effectiveVariant === 'compact' ? '⏮️' : labels.first}
          </Button>
        )}
        
        {/* Botón Anterior */}
        <Button
          variant="outline"
          size={size}
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={disabled || loading || !canGoPrevious}
          className="pagination__button pagination__button--previous"
          leftIcon={effectiveVariant !== 'compact' ? <Icon name="chevron-left" size="xs" /> : null}
          title={labels.previous}
        >
          {effectiveVariant === 'compact' ? '◀️' : labels.previous}
        </Button>
        
        {/* Información de página actual */}
        <div className="pagination__current">
          {effectiveVariant === 'compact' ? (
            <span className="pagination__current-compact">
              {safeCurrentPage}/{safeTotalPages}
            </span>
          ) : (
            <span className="pagination__current-full">
              {labels.page} <strong>{safeCurrentPage}</strong> {labels.of} <strong>{safeTotalPages}</strong>
            </span>
          )}
          
          {loading && (
            <Icon 
              name="loader" 
              size="xs" 
              className="pagination__loading-icon" 
            />
          )}
        </div>
        
        {/* Botón Siguiente */}
        <Button
          variant="outline"
          size={size}
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={disabled || loading || !canGoNext}
          className="pagination__button pagination__button--next"
          rightIcon={effectiveVariant !== 'compact' ? <Icon name="chevron-right" size="xs" /> : null}
          title={labels.next}
        >
          {effectiveVariant === 'compact' ? '▶️' : labels.next}
        </Button>
        
        {/* Botón Última (solo full variant) */}
        {effectiveVariant === 'full' && showFirstLast && (
          <Button
            variant="outline"
            size={size}
            onClick={() => handlePageChange(safeTotalPages)}
            disabled={disabled || loading || isLastPage}
            className="pagination__button pagination__button--last"
            rightIcon={<Icon name="chevron-right" size="xs" />}
            title={labels.last}
          >
            {effectiveVariant === 'compact' ? '⏭️' : labels.last}
          </Button>
        )}
      </div>
    </div>
  );
}

Pagination.propTypes = {
  // Navegación básica
  currentPage: PropTypes.number,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  
  // Información detallada
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onItemsPerPageChange: PropTypes.func,
  itemsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  
  // Personalización
  variant: PropTypes.oneOf(['full', 'simple', 'compact']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showInfo: PropTypes.bool,
  showSizeSelector: PropTypes.bool,
  showFirstLast: PropTypes.bool,
  
  // Estados
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  
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
  }),
  
  // Props adicionales
  className: PropTypes.string
};

export { Pagination };