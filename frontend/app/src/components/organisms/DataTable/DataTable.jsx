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
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Typography } from '../../atoms/Typography/Typography';

// ✅ V2: Sistema estándar de props y tokens
import { useContainerProps } from '../../../hooks/useStandardProps-v2.jsx';
import { extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import { CONTAINER_PROP_TYPES } from '../../../tokens/propHelpers.js';

import './DataTable.css';
import { Container } from '../../atoms/Container/Container';

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
 * DataTable - Organismo V2 completo para mostrar datos tabulares
 * 
 * ✅ SISTEMA V2: Props estándar V2 (size, variant, rounded, loading, disabled)
 * ✅ HOOKS V2: useContainerProps + extractDOMPropsV2 
 * ✅ TOKENS AUTOMÁTICOS: Spacing, colores, tipografía del sistema V2
 * ✅ COMPONENTES MIGRADOS: Button, TextInput, Select, EmptyState integrados
 * ✅ BACKWARD COMPATIBILITY: Mapping automático variant legacy
 * ⚠️  EXCEPCIÓN HTML: Usa table/thead/tbody por necesidad semántica (React-Table)
 */
function DataTable(props) {
  // ✅ V2: SISTEMA ESTÁNDAR DE PROPS
  const standardProps = useContainerProps(props, {
    componentName: 'DataTable',
    defaultSize: 'full',
    defaultVariant: 'neutral'
  });
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

  // ✅ V2: FILTRAR PROPS PARA DOM
  const domProps = extractDOMPropsV2(restProps);

  // ===== BACKWARD COMPATIBILITY =====
  // Separar claramente variant (sistema) vs tableVariant (tabla)
  const finalTableVariant = useMemo(() => {
    // Solo mapear si tableVariant específico fue pasado como variant (legacy)
    const legacyTableVariantMap = {
      'default': 'default',
      'striped': 'striped',
      'bordered': 'bordered',
      'compact': 'compact'
    };

    // Solo dar warning si están usando variant para tableVariant (legacy)
    if (props.variant && legacyTableVariantMap[props.variant] && !tableVariant) {
      console.warn(`[DataTable] DEPRECATION: variant="${props.variant}" para tabla. Usar tableVariant="${props.variant}" y variant para colores (primary, secondary, etc.)`);
      return legacyTableVariantMap[props.variant];
    }

    return tableVariant || 'default';
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
          <FlexContainer>
            <ActionsDropdown
              actions={actions}
              triggerData={rowData}
              variant="secondary"
              size={size}
              disabled={loading || disabled}
            />
          </FlexContainer>
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
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={finalEmptyDescription}
        action={emptyAction}
        size={size}
        variant={variant}
      />
    );
  }
  // ===== RENDER PRINCIPAL =====
  return (
    <Container
      variant={variant}
      size="full"
      className={`data-table data-table--${finalTableVariant} ${className}`}
      style={{
        '--table-border-radius': tokens.rounded,
        '--table-size': tokens.size.height,
        '--table-padding': tokens.size.padding
      }}
      {...domProps}
    >
      {/* ===== CONTROLES SUPERIORES ===== */}
      {searchable && (
        <FlexContainer
          direction="row"
          spacing="md"
          padding="md"
          align="center"
          width="full"
        >
          {/* Búsqueda - toma el espacio disponible */}
          <TextInput
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            leftIcon="search"
            size={size}
            variant={variant}
            width="full" // ✅ HOMOLOGACIÓN: Nueva prop width
            disabled={loading || disabled}
          />

          {/* Selector de tamaño de página - ancho natural */}
          <Select
            value={currentPageSize}
            onChange={(e) => {
              setCurrentPageSize(Number(e.target.value));
              setCurrentPageIndex(0); // Resetear a primera página
            }}
            size="sm"
            variant={variant}
            width="auto" // ✅ HOMOLOGACIÓN: Nueva prop width (ancho natural ~120px)
            disabled={loading || disabled}
            options={pageSizeOptions.map(size => ({
              value: size,
              label: `${size} filas`
            }))}
            placeholder="Tamaño"
          />
        </FlexContainer>
      )}

      {/* ===== TABLA CON WRAPPER PARA SCROLL ===== */}
      <div className="data-table__wrapper">
        <table className="data-table__table">
        {/* ===== HEADER CON COMPONENTE BUTTON ===== */}
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
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
                        <FlexContainer
                          align="center"
                          justify="between"
                          spacing="sm"
                          width="full"
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
                        </FlexContainer>
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
        <tbody>
          {loading ? (
            // Estados de loading
            Array.from({ length: currentPageSize }).map((_, index) => (
              <tr key={`loading-${index}`} className="data-table__row">
                {memoColumns.map((_, colIndex) => (
                  <td key={`loading-cell-${colIndex}`} className="data-table__td">
                    <div className="data-table__skeleton"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : error ? (
            // Estado de error - usando componente Label para iconos consistentes
            <tr className="data-table__row">
              <td colSpan={memoColumns.length} className="data-table__td">
                <FlexContainer
                  direction="column"
                  align="center"
                  spacing="md"
                >
                  <Label
                    leftIcon="alert-circle"
                    variant="danger"
                    size={size}
                  >
                    {error}
                  </Label>
                  {onRefresh && (
                    <Button
                      variant="secondary"
                      size={size}
                      onClick={onRefresh}
                      disabled={loading || disabled}
                    >
                      Reintentar
                    </Button>
                  )}
                </FlexContainer>
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            // Sin resultados de búsqueda - usando componente Label para iconos consistentes
            <tr className="data-table__row">
              <td colSpan={memoColumns.length} className="data-table__td">
                <FlexContainer
                  justify="center"
                  align="center"
                >
                  <Label
                    leftIcon="search"
                    variant="neutral"
                    size={size}
                  >
                    No se encontraron resultados para &ldquo;{debouncedGlobalFilter}&rdquo;
                  </Label>
                </FlexContainer>
              </td>
            </tr>
          ) : (
            // Filas normales
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={`data-table__row ${deleting === row.original.id ? 'data-table__row--deleting' : ''}`}
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
        <FlexContainer
          direction="column"
          spacing="md"
        >
          <FlexContainer
            align="center"
            justify="center"
          >
            <Typography variant="neutral" size="sm">
              Mostrando {table.getState().pagination.pageIndex * currentPageSize + 1} a{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * currentPageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              de {table.getFilteredRowModel().rows.length} resultados
            </Typography>
          </FlexContainer>

          <FlexContainer
            align="center"
            justify="center"
            spacing="sm"
            wrap="wrap"
          >
            <Button
              variant="secondary"
              size={size}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || loading || disabled}
              // CSS removido
              leftIcon="skip-back"
            >
              Primero
            </Button>

            <Button
              variant="secondary"
              size={size}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || loading || disabled}
              // CSS removido
              leftIcon="chevron-left"
            >
              Anterior
            </Button>

            <Typography variant="neutral" size="sm">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </Typography>

            <Button
              variant="secondary"
              size={size}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || loading || disabled}
              // CSS removido
              rightIcon="chevron-right"
            >
              Siguiente
            </Button>

            <Button
              variant="secondary"
              size={size}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || loading || disabled}
              // CSS removido
              rightIcon="skip-forward"
            >
              Último
            </Button>
          </FlexContainer>
        </FlexContainer>
      )}
    </Container>
  );
}

DataTable.propTypes = {
  // ✅ V2: PROPS ESTÁNDAR
  ...CONTAINER_PROP_TYPES,

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
  variant: function (props, propName, componentName) {
    if (props[propName] && ['default', 'striped', 'bordered', 'compact'].includes(props[propName])) {
      console.warn(`[${componentName}] DEPRECATION: prop "${propName}" ha sido renombrada a "tableVariant". La funcionalidad se mantendrá pero será removida en futuras versiones.`);
    }
    return PropTypes.oneOf(['default', 'striped', 'bordered', 'compact'])(props, propName, componentName);
  }
};

// Memoizar DataTable para evitar re-renders innecesarios con props complejas
const MemoizedDataTable = memo(DataTable);

export { MemoizedDataTable as DataTable };