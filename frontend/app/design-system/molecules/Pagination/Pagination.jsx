// ===== PAGINATION MOLECULE - SISTEMA ESTÁNDAR V2.0 =====

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Componentes del sistema de diseño
import { Button, Select, Typography, FlexContainer, useInteractiveProps, extractDOMPropsV2, INTERACTIVE_PROP_TYPES } from '../../index.js';
import './Pagination.css';

/**
 * Pagination Molecule - Sistema de navegación por páginas V2.0
 * 
 * ✅ SISTEMA V2.0: Hook estándar + Props API universal + CSS tokens + Átomos
 * ✅ UNIVERSAL: Navegación por páginas para cualquier contenido paginado
 * ✅ RESPONSIVE: Layout automático mobile-first con touch optimization
 * ✅ ACCESIBLE: ARIA completo + navegación por teclado
 * 
 * Componente de paginación **independiente de TanStack Table**, diseñado para 
 * casos de uso no-tabulares como grids, listas y resultados de búsqueda.
 * 
 * 🎯 Casos de uso:
 * - MainPage: Grid de películas/series
 * - SearchResults: Lista de resultados de búsqueda
 * - CategoryPage: Movies por categoría  
 * - UserFavorites: Lista de favoritos
 * - Cualquier contenido paginado NO tabular
 * 
 * ❌ NO usar para DataTable (ya tiene TanStack pagination integrada)
 * 
 * @param {Object} props - Props del componente
 * @param {number} props.currentPage - Página actual (1-based)
 * @param {number} props.totalPages - Total de páginas
 * @param {function} props.onPageChange - Callback de cambio de página
 * @param {number} props.totalItems - Total de elementos (opcional)
 * @param {number} props.itemsPerPage - Elementos por página (opcional)
 * @param {function} props.onItemsPerPageChange - Callback cambio tamaño página
 * @param {boolean} props.showInfo - Mostrar información de elementos
 * @param {boolean} props.showSizeSelector - Mostrar selector de tamaño
 * @param {boolean} props.showFirstLast - Mostrar botones primera/última
 */
function Pagination(props) {
  // ===== HOOK ESTÁNDAR V2.0 =====
  const standardProps = useInteractiveProps(props, {
    componentName: 'Pagination',
    defaultSize: 'md',
    defaultVariant: 'neutral'
  });

  const {
    size, variant, rounded, disabled, loading, className,
    tokens, renderIcon, ...restProps
  } = standardProps;

  // ===== PROPS ESPECÍFICAS (desde props originales) =====
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
    
    // Personalización de layout
    showInfo = true,
    showSizeSelector = true,
    showFirstLast = true,
    
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
    }
  } = props;

  // ===== DOM PROPS FILTERING =====
  const domProps = extractDOMPropsV2(restProps);

  // ===== VALIDACIÓN DE DATOS =====
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const canGoPrevious = validCurrentPage > 1;
  const canGoNext = validCurrentPage < totalPages;

  // ===== INFORMACIÓN DE ITEMS =====
  const startItem = totalItems && itemsPerPage 
    ? ((validCurrentPage - 1) * itemsPerPage) + 1 
    : null;
  const endItem = totalItems && itemsPerPage 
    ? Math.min(validCurrentPage * itemsPerPage, totalItems) 
    : null;

  // ===== HANDLERS =====
  const handlePageChange = (newPage) => {
    if (disabled || loading) return;
    if (newPage >= 1 && newPage <= totalPages && newPage !== validCurrentPage) {
      onPageChange(newPage);
    }
  };

  const handleSizeChange = (newSize) => {
    if (disabled || loading || !onItemsPerPageChange) return;
    onItemsPerPageChange(Number(newSize));
  };

  // ===== CSS CLASES MANUALES =====
  const paginationClasses = [
    'pagination',
    `pagination--${size}`,
    `pagination--${variant}`,
    rounded && `pagination--rounded-${rounded}`,
    disabled && 'pagination--disabled',
    loading && 'pagination--loading',
    className
  ].filter(Boolean).join(' ');

  // ===== RENDER CONDICIONAL PARA CASOS SIMPLES =====
  if (totalPages <= 1) {
    return showInfo && totalItems && itemsPerPage ? (
      <FlexContainer
        className={paginationClasses}
        align="center"
        justify="center"
        spacing="md"
        {...domProps}
      >
        <Typography variant="body" size="sm" color="muted">
          {labels.showing} {totalItems} {labels.results}
        </Typography>
      </FlexContainer>
    ) : null;
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <FlexContainer
      className={paginationClasses}
      direction="column"
      spacing="md"
      align="center"
      {...domProps}
    >
      {/* ===== INFORMACIÓN DE ITEMS ===== */}
      {showInfo && totalItems && itemsPerPage && (
        <FlexContainer
          align="center"
          justify="center"
          spacing="md"
          wrap="wrap"
        >
          <Typography variant="body" size="sm" color="muted">
            {labels.showing} {startItem} {labels.to} {endItem} {labels.of} {totalItems} {labels.results}
          </Typography>
          
          {/* Selector de tamaño de página */}
          {showSizeSelector && onItemsPerPageChange && (
            <FlexContainer align="center" spacing="sm">
              <Typography variant="body" size="sm" color="muted">
                {labels.itemsPerPage}:
              </Typography>
              <Select
                value={itemsPerPage}
                onChange={(e) => handleSizeChange(e.target.value)}
                size="sm"
                variant={variant}
                disabled={disabled || loading}
                options={itemsPerPageOptions.map(option => ({
                  value: option,
                  label: String(option)
                }))}
                width="auto"
              />
            </FlexContainer>
          )}
        </FlexContainer>
      )}

      {/* ===== CONTROLES DE NAVEGACIÓN ===== */}
      <FlexContainer
        align="center"
        justify="center"
        spacing="sm"
        wrap="wrap"
      >
        {/* Botón Primera Página */}
        {showFirstLast && (
          <Button
            variant="secondary"
            size={size}
            onClick={() => handlePageChange(1)}
            disabled={!canGoPrevious || disabled || loading}
            leftIcon="skip-back"
            aria-label={labels.first}
          >
            {labels.first}
          </Button>
        )}

        {/* Botón Página Anterior */}
        <Button
          variant="secondary"
          size={size}
          onClick={() => handlePageChange(validCurrentPage - 1)}
          disabled={!canGoPrevious || disabled || loading}
          leftIcon="chevron-left"
          aria-label={labels.previous}
        >
          {labels.previous}
        </Button>

        {/* Información de página actual */}
        <FlexContainer align="center" spacing="xs">
          <Typography variant="body" size="sm" weight="medium">
            {labels.page} {validCurrentPage} {labels.of} {totalPages}
          </Typography>
        </FlexContainer>

        {/* Botón Página Siguiente */}
        <Button
          variant="secondary"
          size={size}
          onClick={() => handlePageChange(validCurrentPage + 1)}
          disabled={!canGoNext || disabled || loading}
          rightIcon="chevron-right"
          aria-label={labels.next}
        >
          {labels.next}
        </Button>

        {/* Botón Última Página */}
        {showFirstLast && (
          <Button
            variant="secondary"
            size={size}
            onClick={() => handlePageChange(totalPages)}
            disabled={!canGoNext || disabled || loading}
            rightIcon="skip-forward"
            aria-label={labels.last}
          >
            {labels.last}
          </Button>
        )}
      </FlexContainer>

      {/* ===== OVERLAY DE LOADING ===== */}
      {loading && (
        <FlexContainer 
          className="pagination__loading-overlay"
          align="center"
          justify="center"
        >
          <FlexContainer 
            className="pagination__loading-spinner"
            align="center"
            justify="center"
          >
            {renderIcon('loading')}
          </FlexContainer>
        </FlexContainer>
      )}
    </FlexContainer>
  );
}

// ===== PROPTYPES =====
Pagination.propTypes = {
  // ===== PROPS ESTÁNDAR =====
  ...INTERACTIVE_PROP_TYPES,

  // Navegación básica
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,

  // Información detallada
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onItemsPerPageChange: PropTypes.func,
  itemsPerPageOptions: PropTypes.arrayOf(PropTypes.number),

  // Personalización de layout
  showInfo: PropTypes.bool,
  showSizeSelector: PropTypes.bool,
  showFirstLast: PropTypes.bool,

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
