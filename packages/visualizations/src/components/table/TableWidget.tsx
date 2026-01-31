import { useMemo, useCallback, type CSSProperties } from 'react';
import { Table } from '@customdash/ui';
import { useTableWidgetVM, type TableWidgetInput } from '../../hooks/useTableWidgetVM';
import { formatValue } from '../../utils';
import type { TableColumn, ThemeColors } from '../../interfaces';
import { VisualizationContainer } from '../common';

/**
 * EmptyState component to display when there is no data or invalid configuration
 */
function EmptyState({ isValid }: { isValid: boolean }) {
  return (
    <Table.Empty
      title={!isValid ? 'Invalid Configuration' : 'No Results Found'}
      description={!isValid ? 'Please check the widget configuration' : 'No data available'}
    />
  );
}

interface TableContentProps {
  columns: TableColumn[];
  paginatedData: Record<string, unknown>[];
  isCompact: boolean;
  isStriped: boolean;
  sortKey: string | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (key: string, direction: 'asc' | 'desc') => void;
  themeColors?: ThemeColors;
}

/**
 * TableContent component renders the table headers and body rows
 */
function TableContent({
  columns,
  paginatedData,
  isCompact,
  sortKey,
  sortDirection,
  handleSort,
  themeColors,
}: TableContentProps) {
  return (
    <Table
      compact={isCompact}
      striped
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSort={handleSort}
      themeColors={themeColors}
    >
      <Table.Header sticky>
        <tr>
          {columns.map(column => (
            <Table.Head
              key={column.key}
              sortable={column.sortable !== false}
              sortKey={column.key}
              align={column.align}
              width={column.width}
            >
              {column.label}
            </Table.Head>
          ))}
        </tr>
      </Table.Header>
      <Table.Body>
        {paginatedData.map((row, rowIndex) => (
          <Table.Row key={rowIndex} index={rowIndex}>
            {columns.map(column => (
              <Table.Cell key={column.key} align={column.align}>
                {formatValue(row[column.key], column.format)}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

/**
 * TableWidget component with optimized rendering, sorting, searching and pagination
 * Uses the Table component from @customdash/ui for consistent styling
 */
export default function TableWidget({ data, config }: TableWidgetInput) {
  const {
    columns,
    paginatedData,
    tableTitle,
    isValid,
    totalRows,
    totalPages,
    currentPage,
    pageSize,
    searchTerm,
    sortKey,
    sortDirection,
    themeColors,
    setSearchTerm,
    handleSort,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
  } = useTableWidgetVM({ data, config });

  const showSearch = config.widgetParams?.searchable !== false;
  const showPagination = totalRows > pageSize;
  const isStriped = config.widgetParams?.striped !== false;
  const isCompact = config.widgetParams?.compact === true;

  const titleStyle: CSSProperties = themeColors?.labelColor
    ? { color: themeColors.labelColor }
    : {};

  const handleSortWithDirection = useCallback(
    (key: string, _direction: 'asc' | 'desc') => {
      handleSort(key);
    },
    [handleSort],
  );

  const tableContent = useMemo(
    () => (
      <TableContent
        columns={columns}
        paginatedData={paginatedData}
        isCompact={isCompact}
        isStriped={isStriped}
        sortKey={sortKey}
        sortDirection={sortDirection}
        handleSort={handleSortWithDirection}
        themeColors={themeColors}
      />
    ),
    [
      columns,
      paginatedData,
      isCompact,
      isStriped,
      sortKey,
      sortDirection,
      handleSortWithDirection,
      themeColors,
    ],
  );

  if (!isValid || !data || data.length === 0) {
    return <EmptyState isValid={isValid} />;
  }

  return (
    <VisualizationContainer>
      <div className="flex flex-col h-full rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold" style={titleStyle}>
            {tableTitle}
          </h3>
          {showSearch && (
            <div className="w-64">
              <Table.Search value={searchTerm} onChange={setSearchTerm} themeColors={themeColors} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto">{tableContent}</div>

        {showPagination && (
          <Table.Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRows={totalRows}
            pageSize={pageSize}
            onFirst={goToFirstPage}
            onPrev={goToPrevPage}
            onNext={goToNextPage}
            onLast={goToLastPage}
          />
        )}
      </div>
    </VisualizationContainer>
  );
}
