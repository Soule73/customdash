import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
  type CSSProperties,
  useRef,
} from 'react';

type SortDirection = 'asc' | 'desc';
type TextAlign = 'left' | 'center' | 'right';

interface ThemeColors {
  textColor?: string;
  labelColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

interface TableContextValue {
  compact: boolean;
  striped: boolean;
  sortKey: string | null;
  sortDirection: SortDirection;
  onSort: (key: string) => void;
  themeColors?: ThemeColors;
  resizable: boolean;
  columnWidths: Record<string, number>;
  onColumnResize: (key: string, width: number) => void;
}

const TableContext = createContext<TableContextValue | null>(null);

function useTableContext() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table components must be used within a Table');
  }
  return context;
}

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  compact?: boolean;
  striped?: boolean;
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSort?: (key: string, direction: SortDirection) => void;
  themeColors?: ThemeColors;
  resizable?: boolean;
}

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
  sticky?: boolean;
}

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  index?: number;
}

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  sortable?: boolean;
  sortKey?: string;
  align?: TextAlign;
  width?: string;
  resizable?: boolean;
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  align?: TextAlign;
}

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  labels?: {
    showing?: string;
    of?: string;
    noResults?: string;
    firstPage?: string;
    previousPage?: string;
    nextPage?: string;
    lastPage?: string;
  };
}

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  themeColors?: ThemeColors;
}

interface TableEmptyProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

interface SortIconProps {
  active: boolean;
  direction: SortDirection;
}

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * SortIcon component to indicate sorting direction in table headers
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
      className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/**
 * Table container component with sorting and styling context
 */
function Table({
  children,
  compact = false,
  striped = true,
  sortKey: externalSortKey,
  sortDirection: externalSortDirection,
  onSort: externalOnSort,
  themeColors,
  resizable = true,
  className = '',
  ...props
}: TableProps) {
  const [internalSortKey, setInternalSortKey] = useState<string | null>(null);
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>('asc');
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  const isControlled = externalSortKey !== undefined;
  const sortKey = isControlled ? externalSortKey : internalSortKey;
  const sortDirection = isControlled ? (externalSortDirection ?? 'asc') : internalSortDirection;

  const handleSort = useCallback(
    (key: string) => {
      const newDirection: SortDirection =
        sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';

      if (externalOnSort) {
        externalOnSort(key, newDirection);
      }

      if (!isControlled) {
        setInternalSortKey(key);
        setInternalSortDirection(newDirection);
      }
    },
    [sortKey, sortDirection, externalOnSort, isControlled],
  );

  const handleColumnResize = useCallback((key: string, width: number) => {
    setColumnWidths(prev => ({ ...prev, [key]: width }));
  }, []);

  const contextValue = useMemo(
    () => ({
      compact,
      striped,
      sortKey,
      sortDirection,
      onSort: handleSort,
      themeColors,
      resizable,
      columnWidths,
      onColumnResize: handleColumnResize,
    }),
    [
      compact,
      striped,
      sortKey,
      sortDirection,
      handleSort,
      themeColors,
      resizable,
      columnWidths,
      handleColumnResize,
    ],
  );

  const tableStyle: CSSProperties = themeColors?.backgroundColor
    ? { backgroundColor: themeColors.backgroundColor }
    : {};

  return (
    <TableContext.Provider value={contextValue}>
      <table className={`w-full ${className}`} style={tableStyle} {...props}>
        {children}
      </table>
    </TableContext.Provider>
  );
}

/**
 * Table header section (thead)
 */
function TableHeader({ children, sticky = false, className = '', ...props }: TableHeaderProps) {
  const stickyClass = sticky ? 'sticky top-0 z-10' : '';

  return (
    <thead className={`bg-black/5 dark:bg-white/5 ${stickyClass} ${className}`} {...props}>
      {children}
    </thead>
  );
}

/**
 * Table body section (tbody)
 */
function TableBody({ children, className = '', ...props }: TableBodyProps) {
  const { themeColors } = useTableContext();

  const borderStyle: CSSProperties = themeColors?.borderColor
    ? { borderColor: themeColors.borderColor }
    : {};

  return (
    <tbody
      className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`}
      style={borderStyle}
      {...props}
    >
      {children}
    </tbody>
  );
}

/**
 * Table row component (tr)
 */
function TableRow({ children, index, className = '', ...props }: TableRowProps) {
  const { striped } = useTableContext();

  const isOddRow = striped && index !== undefined && index % 2 === 1;

  const rowClasses = [
    'hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
    isOddRow ? 'bg-black/5 dark:bg-white/5' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr className={rowClasses} {...props}>
      {children}
    </tr>
  );
}

/**
 * Table header cell component (th)
 */
function TableHead({
  children,
  sortable = false,
  sortKey,
  align = 'left',
  width,
  className = '',
  ...props
}: TableHeadProps) {
  const {
    compact,
    sortKey: activeSortKey,
    sortDirection,
    onSort,
    themeColors,
    resizable,
    columnWidths,
    onColumnResize,
  } = useTableContext();
  const [, setIsResizing] = useState(false);
  const thRef = useRef<HTMLTableCellElement>(null);
  const isResizingRef = useRef(false);

  const paddingClass = compact ? 'px-3 py-2' : 'px-4 py-3';
  const sortableClass = sortable
    ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none'
    : '';

  const handleClick = () => {
    if (sortable && sortKey && !isResizingRef.current) {
      onSort(sortKey);
    }
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!resizable || !sortKey) return;
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      isResizingRef.current = true;

      const startX = e.clientX;
      const startWidth = thRef.current?.offsetWidth || 0;

      const handleMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + diff);
        onColumnResize(sortKey, newWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        setTimeout(() => {
          isResizingRef.current = false;
        }, 100);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [resizable, sortKey, onColumnResize],
  );

  const finalWidth = sortKey && columnWidths[sortKey] ? `${columnWidths[sortKey]}px` : width;
  const headStyle: CSSProperties = {
    width: finalWidth,
    ...(themeColors?.labelColor && { color: themeColors.labelColor }),
  };

  const textColorClass = themeColors?.labelColor ? '' : 'text-gray-500 dark:text-gray-400';
  const justifyClass =
    align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <th
      ref={thRef}
      onClick={handleClick}
      className={`relative ${paddingClass} ${sortableClass} ${alignClasses[align]} text-xs font-medium ${textColorClass} uppercase tracking-wider ${className}`}
      style={headStyle}
      {...props}
    >
      <div className={`flex items-center gap-1 ${justifyClass}`}>
        <span>{children}</span>
        {sortable && sortKey && (
          <SortIcon active={activeSortKey === sortKey} direction={sortDirection} />
        )}
      </div>
      {resizable && sortKey && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-indigo-500 group"
          style={{ userSelect: 'none' }}
        >
          <div className="absolute top-0 right-0 h-full w-3 -translate-x-1" />
        </div>
      )}
    </th>
  );
}

/**
 * Table data cell component (td)
 */
function TableCell({ children, align = 'left', className = '', ...props }: TableCellProps) {
  const { compact, themeColors } = useTableContext();
  const paddingClass = compact ? 'px-3 py-2' : 'px-4 py-3';

  const cellStyle: CSSProperties = themeColors?.textColor ? { color: themeColors.textColor } : {};

  const textColorClass = themeColors?.textColor ? '' : 'text-gray-900 dark:text-gray-100';

  return (
    <td
      className={`${paddingClass} ${alignClasses[align]} text-sm ${textColorClass} ${className}`}
      style={cellStyle}
      {...props}
    >
      {children}
    </td>
  );
}

/**
 * Table pagination component
 */
function TablePagination({
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  onFirst,
  onPrev,
  onNext,
  onLast,
  labels = {},
}: TablePaginationProps) {
  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalRows);

  const buttonClass =
    'px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400';

  const showingText =
    totalRows > 0 ? `${start}-${end} ${labels.of ?? '/'} ${totalRows}` : (labels.noResults ?? '-');

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-600 dark:text-gray-400">{showingText}</div>
      <div className="flex gap-1">
        <button
          onClick={onFirst}
          disabled={currentPage === 0}
          className={buttonClass}
          aria-label={labels.firstPage}
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
          className={buttonClass}
          aria-label={labels.previousPage}
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
          className={buttonClass}
          aria-label={labels.nextPage}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={onLast}
          disabled={currentPage >= totalPages - 1}
          className={buttonClass}
          aria-label={labels.lastPage}
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
 * Table search input component
 */
function TableSearch({ value, onChange, placeholder, themeColors }: TableSearchProps) {
  const inputStyle: CSSProperties = {
    color: themeColors?.textColor,
    backgroundColor: themeColors?.backgroundColor,
    borderColor: themeColors?.borderColor,
  };

  const iconStyle: CSSProperties = {
    color: themeColors?.labelColor,
  };

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        style={iconStyle}
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
        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        style={inputStyle}
      />
    </div>
  );
}

/**
 * Table empty state component
 */
function TableEmpty({ title, description, icon }: TableEmptyProps) {
  return (
    <div className="flex items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        {icon || (
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
        )}
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Pagination = TablePagination;
Table.Search = TableSearch;
Table.Empty = TableEmpty;

export { Table };
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TablePaginationProps,
  TableSearchProps,
  TableEmptyProps,
  SortDirection,
  TextAlign,
  ThemeColors as TableThemeColors,
};
