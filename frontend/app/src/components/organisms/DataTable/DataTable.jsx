// ===== DATA TABLE ORGANISM - CON COMPONENTES BUTTON =====

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

// Componentes del sistema de diseño
import { Button } from '../../atoms/Button/Button';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { Select } from '../../atoms/Select/Select';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { ActionsDropdown } from '../../molecules/ActionsDropdown/ActionsDropdown';
import { Icon } from '../../atoms/Icon/Icon';

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
 * ✅ SISTEMA DE DISEÑO: Usa componente Button para todos los botones
 * ✅ CONSISTENCIA: Headers, paginación y acciones con mismo estilo
 * ✅ STORYBOOK: Solo componentes con stories
 */
function DataTable({
  // Props de datos
  data = [],
  columns = [],

  // Props de estado
  loading = false,
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

  // ✅ AGREGAR emptyMessage COMO PROP VÁLIDA
  emptyMessage, // ← PROP PERSONALIZADA (causa el error)

  // Props de customización
  className = '',
  variant = 'default', // 'default' | 'striped' | 'bordered' | 'compact'

  // Props adicionales
  onRefresh,
  ...restProps
}) {

  // ===== FILTRAR PROPS PERSONALIZADAS PARA DOM =====
  const {
    data: tableData,
    columns: tableColumns,
    loading: tableLoading,
    error: tableError,
    deleting: tableDeleting,
    showActions: tableShowActions,
    onEdit: tableOnEdit,
    onDelete: tableOnDelete,
    onView: tableOnView,
    actionsColumnHeader: tableActionsColumnHeader,
    searchable: tableSearchable,
    searchPlaceholder: tableSearchPlaceholder,
    pageSize: tablePageSize,
    pageSizeOptions: tablePageSizeOptions,
    emptyTitle: tableEmptyTitle,
    emptyDescription: tableEmptyDescription,
    emptyIcon: tableEmptyIcon,
    emptyAction: tableEmptyAction,
    emptyMessage: tableEmptyMessage,
    variant: tableVariant,
    onRefresh: tableOnRefresh,
    ...domProps
  } = { 
    data, columns, loading, error, deleting, showActions, onEdit, onDelete, onView,
    actionsColumnHeader, searchable, searchPlaceholder, pageSize, pageSizeOptions,
    emptyTitle, emptyDescription, emptyIcon, emptyAction, emptyMessage, variant, onRefresh,
    ...restProps 
  };

  // Evitar warnings de variables no usadas (necesarias para filtrar del DOM)
  void tableData; void tableColumns; void tableLoading; void tableError; void tableDeleting;
  void tableShowActions; void tableOnEdit; void tableOnDelete; void tableOnView; void tableActionsColumnHeader;
  void tableSearchable; void tableSearchPlaceholder; void tablePageSize; void tablePageSizeOptions;
  void tableEmptyTitle; void tableEmptyDescription; void tableEmptyIcon; void tableEmptyAction;
  void tableEmptyMessage; void tableVariant; void tableOnRefresh;

  // ===== LÓGICA PARA MANEJAR emptyMessage =====
  // Si se pasa emptyMessage, usarlo como emptyDescription
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
              variant="outline"
              size="sm"
              disabled={loading}
            />
          </div>
        );
      }
    };
  }, [showActions, onEdit, onDelete, onView, actionsColumnHeader, deleting, loading]);

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
        className={`data-table data-table--empty data-table--${variant} ${className}`}
        {...domProps}
      >
        <div className="data-table__empty">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={finalEmptyDescription} // ✅ Usar emptyMessage si está disponible
            action={emptyAction}
          />
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div
      className={`data-table data-table--${variant} ${className}`}
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
              size="sm"
              disabled={loading}
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
              size="sm"
              disabled={loading}
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
                          variant="ghost"
                          size="sm"
                          onClick={header.column.getToggleSortingHandler()}
                          className="data-table__sort-button"
                          disabled={loading}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="data-table__sort-icon">
                            {{
                              asc: <Icon name="chevron-up" size="xs" />,
                              desc: <Icon name="chevron-down" size="xs" />,
                            }[header.column.getIsSorted()] ?? <Icon name="chevron-up" size="xs" style={{ opacity: 0.5 }} />}
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
              // Estado de error
              <tr className="data-table__row data-table__row--error">
                <td colSpan={memoColumns.length} className="data-table__td">
                  <div className="data-table__error">
                    <Icon name="alert" size="sm" color="danger" />
                    <span className="data-table__error-message">{error}</span>
                    {onRefresh && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        className="data-table__retry-button"
                      >
                        Reintentar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              // Sin resultados de búsqueda
              <tr className="data-table__row data-table__row--empty">
                <td colSpan={memoColumns.length} className="data-table__td">
                  <div className="data-table__no-results">
                    <Icon name="search" size="sm" color="muted" />
                    <span className="data-table__no-results-message">
                      No se encontraron resultados para &ldquo;{debouncedGlobalFilter}&rdquo;
                    </span>
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
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="data-table__pagination-button"
              leftIcon="skip-back"
            >
              Primero
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
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
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="data-table__pagination-button"
              rightIcon="chevron-right"
            >
              Siguiente
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
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
  // Props de datos
  data: PropTypes.array,
  columns: PropTypes.array,
  
  // Props de estado
  loading: PropTypes.bool,
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
  emptyMessage: PropTypes.string,
  
  // Props de customización
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'striped', 'bordered', 'compact']),
  
  // Props adicionales
  onRefresh: PropTypes.func
};

// Memoizar DataTable para evitar re-renders innecesarios con props complejas
const MemoizedDataTable = memo(DataTable);

export { MemoizedDataTable as DataTable };