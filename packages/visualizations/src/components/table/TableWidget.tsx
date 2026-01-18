import { useTableWidgetVM, type TableWidgetProps } from '../../hooks/useTableWidgetVM';
import { formatValue } from '../../utils';
import type { TableColumn } from '../../interfaces';
import { useMemo } from 'react';

interface SortIconProps {
  active: boolean;
  direction: 'asc' | 'desc';
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface TableHeadProps {
  column: TableColumn;
  sortKey: string | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (key: string) => void;
  isCompact: boolean;
}

interface TableCellProps {
  row: Record<string, unknown>;
  column: TableColumn;
  isCompact: boolean;
}

interface TableRowProps {
  row: Record<string, unknown>;
  rowIndex: number;
  columns: TableColumn[];
  isStriped: boolean;
  isCompact: boolean;
}

/**
 * SortIcon component to indicate sorting direction in table headers
 * @param props - The properties for the SortIcon component
 * @returns The SortIcon element
 *
 * @example
 * <SortIcon active={true} direction="asc" />
 */
function SortIcon({ active, direction }: SortIconProps) {
  if (!active) {
    return (
      <svg
        className="w-4 h-4 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  }
  return direction === 'asc' ? (
    <svg
      className="w-4 h-4 text-blue-600 dark:text-blue-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 text-blue-600 dark:text-blue-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/**
 * Pagination component for table navigation
 * @param props - The properties for the Pagination component
 * @returns The Pagination element
 * @example
 * const currentPage = 0;
 * const totalPages = 5;
 * const totalRows = 50;
 * const pageSize = 10;
 * const goToFirstPage = () => fetchData("http://api.example.com/data?page=0");
 * const goToPrevPage = () => fetchData("http://api.example.com/data?page=" + (currentPage - 1));
 * const goToNextPage = () => fetchData("http://api.example.com/data?page=" + (currentPage + 1));
 * const goToLastPage = () => fetchData("http://api.example.com/data?page=" + (totalPages - 1));
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   totalRows={totalRows}
 *   pageSize={pageSize}
 *   onFirst={goToFirstPage}
 *   onPrev={goToPrevPage}
 *   onNext={goToNextPage}
 *   onLast={goToLastPage}
 * />
 */
function Pagination({
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  onFirst,
  onPrev,
  onNext,
  onLast,
}: PaginationProps) {
  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {totalRows > 0 ? `${start}-${end} of ${totalRows}` : 'No results'}
      </div>
      <div className="flex gap-1">
        <button
          onClick={onFirst}
          disabled={currentPage === 0}
          className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="First page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={onPrev}
          disabled={currentPage === 0}
          className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
          {totalPages > 0 ? `${currentPage + 1} / ${totalPages}` : '0 / 0'}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage >= totalPages - 1}
          className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={onLast}
          disabled={currentPage >= totalPages - 1}
          className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Last page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * SearchInput component for filtering table data
 * @param props - The properties for the Search input
 * @returns The Search input element
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search..." />
 */
function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

/**
 * EmptyState component to display when there is no data or invalid configuration
 * @param props - The properties for the EmptyState component
 * @returns The EmptyState element
 *
 * @example
 * <EmptyState isValid={false} />
 */
function EmptyState({ isValid }: { isValid: boolean }) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <svg
          className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {!isValid ? 'Invalid configuration' : 'No data available'}
        </p>
      </div>
    </div>
  );
}

/**
 * TableHead component for rendering table headers
 * @param props - The properties for the TableHead component
 * @returns The TableHead element
 *
 * @example
 * const column = { key: 'name', label: 'Name', sortable: true };
 * <TableHead
 *   column={column}
 *   sortKey={sortKey}
 *   sortDirection={sortDirection}
 *   handleSort={handleSort}
 *   isCompact={false}
 * />
 */
function TableHead({ column, sortKey, sortDirection, handleSort, isCompact }: TableHeadProps) {
  const classNames = useMemo(() => {
    const baseClassNames =
      'text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider';
    const paddingClassNames = isCompact ? 'px-3 py-2' : 'px-4 py-3';
    const sortableClassNames =
      column.sortable !== false
        ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none'
        : '';
    const alignClassNames =
      column.align === 'right'
        ? 'text-right'
        : column.align === 'center'
          ? 'text-center'
          : 'text-left';

    return `${paddingClassNames} ${sortableClassNames} ${alignClassNames} ${baseClassNames}`;
  }, [column.align, column.sortable, isCompact]);

  return (
    <th
      key={column.key}
      onClick={() => column.sortable !== false && handleSort(column.key)}
      className={classNames}
      style={{ width: column.width }}
    >
      <div className="flex items-center gap-1">
        <span>{column.label}</span>
        {column.sortable !== false && (
          <SortIcon active={sortKey === column.key} direction={sortDirection} />
        )}
      </div>
    </th>
  );
}

/**
 * TableCell component for rendering individual table cells
 * @param props - The properties for the TableCell component
 * @returns The TableCell element
 *
 * @example
 * const row = { name: 'Alice', age: 30 };
 * const column = { key: 'age', label: 'Age', format: 'number' };
 * <TableCell row={row} column={column} isCompact={false} />
 */
function TableCell({ row, column, isCompact }: TableCellProps) {
  const classNames = useMemo(() => {
    const baseClassNames = 'text-sm text-gray-900 dark:text-gray-100';
    const paddingClassNames = isCompact ? 'px-3 py-2' : 'px-4 py-3';
    const alignClassNames =
      column.align === 'right'
        ? 'text-right'
        : column.align === 'center'
          ? 'text-center'
          : 'text-left';

    return `${paddingClassNames} ${alignClassNames} ${baseClassNames}`;
  }, [column.align, isCompact]);

  const cellValue = useMemo(() => {
    return formatValue(row[column.key], column.format);
  }, [row, column]);

  return (
    <td key={column.key} className={classNames}>
      {cellValue}
    </td>
  );
}

/**
 * TableRow component for rendering individual table rows
 * @param props - The properties for the TableRow component
 * @returns The TableRow element
 *
 * @example
 * const row = { name: 'Alice', age: 30 };
 * const columns = [
 *   { key: 'name', label: 'Name' },
 *   { key: 'age', label: 'Age', format: 'number' }
 * ];
 *
 * <TableRow row={row} rowIndex={index} columns={columns} isStriped={true} isCompact={false} />
 */
function TableRow({ row, rowIndex, columns, isStriped, isCompact }: TableRowProps) {
  const classNames = useMemo(() => {
    const baseClassNames = 'hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors';
    const stripedClassNames =
      isStriped && rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : '';

    return `${stripedClassNames} ${baseClassNames}`;
  }, [isStriped, rowIndex]);

  const cellElements = useMemo(() => {
    return columns.map((column: TableColumn) => (
      <TableCell key={column.key} row={row} column={column} isCompact={isCompact} />
    ));
  }, [columns, row, isCompact]);

  return (
    <tr key={rowIndex} className={classNames}>
      {cellElements}
    </tr>
  );
}

/**
 * TableWidget component with optimized rendering, sorting, searching and pagination
 * @param props - The properties for the Table widget
 * @returns The Table widget rendering a data table with optional search and pagination
 *
 * @example
 * const data = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }];
 * const config = {
 *   columns: [
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'age', label: 'Age', sortable: true, format: 'number' }
 *   ],
 *   widgetParams: { pageSize: 10, searchable: true, striped: true, compact: false }
 * };
 *
 * <TableWidget data={data} config={config} />
 */
export default function TableWidget({ data, config }: TableWidgetProps) {
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

  const tableHeaders = useMemo(() => {
    return columns.map((column: TableColumn) => (
      <TableHead
        key={column.key}
        column={column}
        sortKey={sortKey}
        sortDirection={sortDirection}
        handleSort={handleSort}
        isCompact={isCompact}
      />
    ));
  }, [columns, sortKey, sortDirection, handleSort, isCompact]);

  if (!isValid || !data || data.length === 0) {
    return <EmptyState isValid={isValid} />;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tableTitle}</h3>
        {showSearch && (
          <div className="w-64">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
            <tr>{tableHeaders}</tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                columns={columns}
                isStriped={isStriped}
                isCompact={isCompact}
              />
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <Pagination
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
  );
}
