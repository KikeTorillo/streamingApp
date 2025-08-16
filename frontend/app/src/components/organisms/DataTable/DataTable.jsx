// ===== DATA TABLE ORGANISM - SISTEMA ESTÁNDAR =====

import React, { useState, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

// Componentes del sistema de diseño migrados
import { Button } from '../../atoms/Button/Button';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { Select } from '../../atoms/Select/Select';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { ActionsDropdown } from '../../molecules/ActionsDropdown/ActionsDropdown';
import { Label } from '../../atoms/Label/Label';

// Sistema estándar de props y tokens
import { useDataTableProps } from '../../../hooks/useStandardProps';
import { extractDOMProps, STANDARD_PROP_TYPES } from '../../../tokens/standardProps';

import './DataTable.css';

// Hook personalizado para debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
}

/**
 * DataTable - Organismo completo para mostrar datos tabulares
 * 
 * ✅ SISTEMA ESTÁNDAR: Props estándar (size, variant, rounded, loading, disabled)
 * ✅ TOKENS AUTOMÁTICOS: Spacing, colores, tipografía del sistema
 * ✅ COMPONENTES MIGRADOS: Button, TextInput, Select, EmptyState integrados
 * ✅ BACKWARD COMPATIBILITY: Mapping automático variant legacy
 */
function DataTable(props) {
  // ===== SISTEMA ESTÁNDAR DE PROPS =====
  const standardProps = useDataTableProps(props);
  const {
    size,
    variant,
    loading,
    disabled,
    className,
    tokens,
    renderIcon,
    ...componentProps
  } = standardProps;

  // ===== EXTRAER PROPS ESPECÍFICAS DE DATATABLE =====
  const {
    // Props de datos
    data = [],
    columns = [],

    // Props de estado específicos
    error = null,
    deleting = null, // ID del elemento siendo eliminado

    // Props de acciones
    showActions = true,
    onEdit,
    onDelete,
    onView,
    actionsColumnHeader = 'Acciones',

    // Props de búsqueda y paginación
    searchable = true,
    searchPlaceholder = 'Buscar...',
    pageSize = 25,
    pageSizeOptions = [10, 25, 50, 100],

    // Props de estados vacíos
    emptyTitle = 'No hay datos',
    emptyDescription = 'No se encontraron resultados',
    emptyIcon = "📋",
    emptyAction = null,
    emptyMessage, // Backward compatibility

    // Props de customización específica
    tableVariant = 'default', // 'default' | 'striped' | 'bordered' | 'compact'

    // Props adicionales
    onRefresh,
    ...restProps
  } = componentProps;

  // ===== FILTRAR PROPS PARA DOM =====
  const domProps = extractDOMProps(restProps);

  // ===== BACKWARD COMPATIBILITY =====
  // Mapping de variante legacy a tableVariant
  const finalTableVariant = useMemo(() => {
    const legacyVariantMap = {
      'default': 'default',
      'striped': 'striped', 
      'bordered': 'bordered',
      'compact': 'compact'
    };

    if (props.variant && legacyVariantMap[props.variant]) {
      console.warn(`[DataTable] DEPRECATION: prop "variant" debería ser "tableVariant". Usar tableVariant="${props.variant}" en lugar de variant="${props.variant}"`);
      return legacyVariantMap[props.variant];
    }

    return tableVariant;
  }, [props.variant, tableVariant]);

  // ===== LÓGICA PARA MANEJAR emptyMessage =====
  // Si se pasa emptyMessage, usarlo como emptyDescription (backward compatibility)
  const finalEmptyDescription = emptyMessage || emptyDescription;

  // ===== ESTADOS =====
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Debounce para búsqueda
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 300);

  // ===== COLUMNA DE ACCIONES =====
  const actionColumn = useMemo(() => {
    if (!showActions || (!onEdit && !onDelete && !onView)) return null;

    return {
      id: 'actions',
      header: actionsColumnHeader,
      size: 120,
      enableSorting: false,
      cell: ({ row }) => {
        const rowData = row.original;
        const isDeleting = deleting === rowData.id;

        const actions = [];

        if (onView) {
          actions.push({
            label: 'Ver',
            icon: 'eye',
            onClick: () => onView(rowData),
            variant: 'ghost'
          });
        }

        if (onEdit) {
          actions.push({
            label: 'Editar',
            icon: 'edit',
            onClick: () => onEdit(rowData),
            variant: 'outline'
          });
        }

        if (onDelete) {
          actions.push({
            label: isDeleting ? 'Eliminando...' : 'Eliminar',
            icon: isDeleting ? 'loading' : 'trash',
            onClick: () => onDelete(rowData),
            variant: 'danger',
            disabled: isDeleting,
            loading: isDeleting
          });
        }

        return (
          <div className="data-table__actions">
            <ActionsDropdown
              actions={actions}
              variant="secondary"
              size={size}
              disabled={loading || disabled}
              data={rowData}
            />
          </div>
        );
      }
    };
  }, [showActions, onEdit, onDelete, onView, actionsColumnHeader, deleting, loading, disabled, size]);

  // ===== MEMOIZED COLUMNS =====
  const memoColumns = useMemo(() => {
    const baseColumns = columns || [];
    return actionColumn ? [...baseColumns, actionColumn] : baseColumns;
  }, [columns, actionColumn]);

  // ===== CONFIGURACIÓN DE TABLA =====
  const table = useReactTable({
    data: data || [],
    columns: memoColumns,
    state: {
      globalFilter: debouncedGlobalFilter,
      pagination: {
        pageIndex: currentPageIndex,
        pageSize: currentPageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({ pageIndex: currentPageIndex, pageSize: currentPageSize });
        setCurrentPageIndex(newPagination.pageIndex);
        if (newPagination.pageSize !== currentPageSize) {
          setCurrentPageSize(newPagination.pageSize);
        }
      } else {
        setCurrentPageIndex(updater.pageIndex);
        if (updater.pageSize !== currentPageSize) {
          setCurrentPageSize(updater.pageSize);
        }
      }
    },
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
  });

  // ===== ACTUALIZAR TAMAÑO DE PÁGINA =====
  React.useEffect(() => {
    table.setPageSize(currentPageSize);
  }, [currentPageSize, table]);

  // ===== RENDER DE ESTADO VACÍO =====
  if (!loading && (!data || data.length === 0) && !debouncedGlobalFilter) {
    return (
      <div
        className={`data-table data-table--empty data-table--${finalTableVariant} data-table--${size} data-table--${variant} ${disabled ? 'data-table--disabled' : ''} ${className}`}
        style={{
          '--table-border-radius': tokens.rounded,
          '--table-size': tokens.size.height,
          '--table-padding': tokens.size.padding
        }}
        {...domProps}
      >
        <div className="data-table__empty">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={finalEmptyDescription}
            action={emptyAction}
            size={size}
            variant={variant}
          />
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div
      className={`data-table data-table--${finalTableVariant} data-table--${size} data-table--${variant} ${loading ? 'data-table--loading' : ''} ${disabled ? 'data-table--disabled' : ''} ${className}`}
      style={{
        '--table-border-radius': tokens.rounded,
        '--table-size': tokens.size.height,
        '--table-padding': tokens.size.padding,
        '--table-font-size': tokens.size.fontSize
      }}
      {...domProps}
    >
      {/* ===== CONTROLES SUPERIORES ===== */}
      {searchable && (
        <div className="data-table__controls">
          {/* Búsqueda */}
          <div className="data-table__search">
            <TextInput
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              leftIcon="search"
              size={size}
              variant={variant}
              disabled={loading || disabled}
            />
          </div>

          {/* Selector de tamaño de página */}
          <div className="data-table__page-size">
            <Select
              value={currentPageSize}
              onChange={(e) => {
                setCurrentPageSize(Number(e.target.value));
                setCurrentPageIndex(0); // Resetear a primera página
              }}
              size={size}
              variant={variant}
              disabled={loading || disabled}
              options={pageSizeOptions.map(size => ({
                value: size,
                label: `${size} filas`
              }))}
              placeholder="Tamaño"
            />
          </div>
        </div>
      )}

      {/* ===== TABLA ===== */}
      <div className="data-table__wrapper">
        <table className="data-table__table">
          {/* ===== HEADER CON COMPONENTE BUTTON ===== */}
          <thead className="data-table__thead">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="data-table__header-row">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`data-table__th ${header.column.getCanSort() ? 'data-table__th--sortable' : ''
                      }`}
                  >
                    {header.isPlaceholder ? null : (
                      header.column.getCanSort() ? (
                        <Button
                          variant="neutral"
                          size={size}
                          onClick={header.column.getToggleSortingHandler()}
                          className="data-table__sort-button"
                          disabled={loading || disabled}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="data-table__sort-icon">
                            {renderIcon(
                              {
                                asc: 'chevron-up',
                                desc: 'chevron-down',
                              }[header.column.getIsSorted()] ?? 'chevron-up',
                              undefined,
                              undefined,
                              { style: header.column.getIsSorted() ? {} : { opacity: 0.5 } }
                            )}
                          </span>
                        </Button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* ===== BODY ===== */}
          <tbody className="data-table__tbody">
            {loading ? (
              // Estados de loading
              Array.from({ length: currentPageSize }).map((_, index) => (
                <tr key={`loading-${index}`} className="data-table__row data-table__row--loading">
                  {memoColumns.map((_, colIndex) => (
                    <td key={`loading-cell-${colIndex}`} className="data-table__td">
                      <div className="data-table__skeleton"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              // Estado de error - usando componente Label para iconos consistentes
              <tr className="data-table__row data-table__row--error">
                <td colSpan={memoColumns.length} className="data-table__td">
                  <div className="data-table__error">
                    <Label
                      leftIcon="alert-circle"
                      variant="danger"
                      size={size}
                      className="data-table__error-label"
                    >
                      {error}
                    </Label>
                    {onRefresh && (
                      <Button
                        variant="secondary"
                        size={size}
                        onClick={onRefresh}
                        className="data-table__retry-button"
                        disabled={loading || disabled}
                      >
                        Reintentar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              // Sin resultados de búsqueda - usando componente Label para iconos consistentes
              <tr className="data-table__row data-table__row--empty">
                <td colSpan={memoColumns.length} className="data-table__td">
                  <div className="data-table__no-results">
                    <Label
                      leftIcon="search"
                      variant="neutral"
                      size={size}
                      className="data-table__no-results-label"
                    >
                      No se encontraron resultados para &ldquo;{debouncedGlobalFilter}&rdquo;
                    </Label>
                  </div>
                </td>
              </tr>
            ) : (
              // Filas normales
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={`data-table__row ${deleting === row.original.id ? 'data-table__row--deleting' : ''
                    }`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="data-table__td">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINACIÓN CON COMPONENTE BUTTON ===== */}
      {!loading && !error && data.length > 0 && (
        <div className="data-table__pagination">
          <div className="data-table__pagination-info">
            <span className="data-table__pagination-text">
              Mostrando {table.getState().pagination.pageIndex * currentPageSize + 1} a{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * currentPageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              de {table.getFilteredRowModel().rows.length} resultados
            </span>
          </div>

          <div className="data-table__pagination-controls">
            <Button
              variant="secondary"
              size={size}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || loading || disabled}
              className="data-table__pagination-button"
              leftIcon="skip-back"
            >
              Primero
            </Button>

            <Button
              variant="secondary"
              size={size}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || loading || disabled}
              className="data-table__pagination-button"
              leftIcon="chevron-left"
            >
              Anterior
            </Button>

            <span className="data-table__pagination-current">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </span>

            <Button
              variant="secondary"
              size={size}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || loading || disabled}
              className="data-table__pagination-button"
              rightIcon="chevron-right"
            >
              Siguiente
            </Button>

            <Button
              variant="secondary"
              size={size}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || loading || disabled}
              className="data-table__pagination-button"
              rightIcon="skip-forward"
            >
              Último
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

DataTable.propTypes = {
  // ===== PROPS ESTÁNDAR =====
  ...STANDARD_PROP_TYPES,
  
  // Props de datos
  data: PropTypes.array,
  columns: PropTypes.array,
  
  // Props de estado
  error: PropTypes.string,
  deleting: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  // Props de acciones
  showActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  actionsColumnHeader: PropTypes.string,
  
  // Props de búsqueda y paginación
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.array,
  
  // Props de estados vacíos
  emptyTitle: PropTypes.string,
  emptyDescription: PropTypes.string,
  emptyIcon: PropTypes.string,
  emptyAction: PropTypes.node,
  emptyMessage: PropTypes.string, // Backward compatibility
  
  // Props de customización específica
  tableVariant: PropTypes.oneOf(['default', 'striped', 'bordered', 'compact']),
  
  // Props adicionales
  onRefresh: PropTypes.func,
  
  // ===== DEPRECATED PROPS (Backward compatibility) =====
  variant: function(props, propName, componentName) {
    if (props[propName] && ['default', 'striped', 'bordered', 'compact'].includes(props[propName])) {
      console.warn(`[${componentName}] DEPRECATION: prop "${propName}" ha sido renombrada a "tableVariant". La funcionalidad se mantendrá pero será removida en futuras versiones.`);
    }
    return PropTypes.oneOf(['default', 'striped', 'bordered', 'compact'])(props, propName, componentName);
  }
};

// Memoizar DataTable para evitar re-renders innecesarios con props complejas
const MemoizedDataTable = memo(DataTable);

export { MemoizedDataTable as DataTable };