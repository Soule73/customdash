import { useState, useMemo, type ReactNode, type HTMLAttributes } from 'react';

export type DataGridColumnType = 'string' | 'number' | 'date' | 'boolean' | 'currency';
type SortDir = 'asc' | 'desc' | null;
type Align = 'left' | 'center' | 'right';

export interface DataGridColumn {
  key: string;
  label: string;
  type?: DataGridColumnType;
  sortable?: boolean;
  width?: string;
  minWidth?: string;
  align?: Align;
  render?: (value: unknown, row: DataGridRow) => ReactNode;
}

export interface DataGridColumnGroup {
  label: string;
  children: DataGridColumn[];
}

export type DataGridColumnDef = DataGridColumn | DataGridColumnGroup;
export type DataGridRow = Record<string, unknown>;

export interface DataGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'data'> {
  columns: DataGridColumnDef[];
  data: DataGridRow[];
  loading?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  striped?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  caption?: string;
}

function isColumnGroup(col: DataGridColumnDef): col is DataGridColumnGroup {
  return 'children' in col;
}

function getLeafColumns(columns: DataGridColumnDef[]): DataGridColumn[] {
  return columns.flatMap(col => (isColumnGroup(col) ? col.children : [col]));
}

function hasGroups(columns: DataGridColumnDef[]): boolean {
  return columns.some(isColumnGroup);
}

function formatCellValue(value: unknown, type?: DataGridColumnType): string {
  if (value === null || value === undefined || value === '') return '-';
  switch (type) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value);
    case 'currency':
      return typeof value === 'number'
        ? value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
        : String(value);
    case 'date':
      try {
        return new Date(String(value)).toLocaleDateString();
      } catch {
        return String(value);
      }
    case 'boolean':
      return value ? 'Oui' : 'Non';
    default:
      return String(value);
  }
}

function getDefaultAlign(type?: DataGridColumnType): Align {
  if (type === 'number' || type === 'currency') return 'right';
  if (type === 'boolean') return 'center';
  return 'left';
}

const ALIGN_CLASSES: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function SortIcon({ direction }: { direction: SortDir }) {
  if (direction === 'asc') {
    return (
      <svg
        className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  }
  if (direction === 'desc') {
    return (
      <svg
        className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  }
  return (
    <svg
      className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500"
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

function PaginationButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400 transition-colors"
    >
      {children}
    </button>
  );
}

/**
 * Feature-rich data grid with flat and grouped column headers, sorting,
 * global search, custom cell rendering, and pagination.
 *
 * @example
 * // Simple columns
 * <DataGrid columns={[{ key: 'name', label: 'Name' }]} data={rows} />
 *
 * @example
 * // Grouped columns
 * <DataGrid
 *   columns={[
 *     { key: 'building', label: 'Building' },
 *     { label: 'H1', children: [{ key: 'jan', label: 'Jan', type: 'number' }, ...] }
 *   ]}
 *   data={rows}
 * />
 */
export function DataGrid({
  columns,
  data,
  loading = false,
  emptyMessage = 'Aucune donnée à afficher',
  searchable = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  striped = true,
  compact = false,
  stickyHeader = true,
  caption,
  className = '',
  ...props
}: DataGridProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const leafColumns = useMemo(() => getLeafColumns(columns), [columns]);
  const grouped = useMemo(() => hasGroups(columns), [columns]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();
    return data.filter(row =>
      leafColumns.some(col => {
        const val = row[col.key];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
      }),
    );
  }, [data, search, leafColumns]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = av == null ? -1 : bv == null ? 1 : av < bv ? -1 : 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const paginated = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page, pageSize],
  );

  function handleSort(key: string) {
    if (sortKey === key) {
      if (sortDir === 'asc') {
        setSortDir('desc');
      } else {
        setSortKey(null);
        setSortDir(null);
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handlePageSizeChange(value: number) {
    setPageSize(value);
    setPage(1);
  }

  const cellPad = compact ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-sm';
  const headPad = compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-xs';

  function renderLeafTh(col: DataGridColumn, key: string | number) {
    const align = col.align ?? getDefaultAlign(col.type);
    const isSortable = col.sortable !== false;
    const justifyClass =
      align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';
    return (
      <th
        key={key}
        onClick={isSortable ? () => handleSort(col.key) : undefined}
        className={`${headPad} font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 whitespace-nowrap ${ALIGN_CLASSES[align]} ${isSortable ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none' : ''}`}
        style={{ width: col.width, minWidth: col.minWidth ?? '80px' }}
      >
        <div className={`flex items-center gap-1 ${justifyClass}`}>
          <span>{col.label}</span>
          {isSortable && <SortIcon direction={sortKey === col.key ? sortDir : null} />}
        </div>
      </th>
    );
  }

  return (
    <div
      className={`flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm ${className}`}
      {...props}
    >
      {searchable && (
        <div className="flex items-center justify-between px-4 py-2.5 gap-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="relative flex-1 max-w-xs">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
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
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Rechercher..."
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 shrink-0">
            <span>Lignes :</span>
            <select
              value={pageSize}
              onChange={e => handlePageSizeChange(Number(e.target.value))}
              className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {pageSizeOptions.map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="overflow-auto flex-1">
        <table className="w-full border-collapse">
          {caption && (
            <caption className="px-4 pb-1 pt-2 text-left text-xs text-gray-400 dark:text-gray-500 caption-top">
              {caption}
            </caption>
          )}
          <thead
            className={`bg-gray-50 dark:bg-gray-800 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}
          >
            {grouped && (
              <tr>
                {columns.map((col, idx) => {
                  if (isColumnGroup(col)) {
                    return (
                      <th
                        key={idx}
                        colSpan={col.children.length}
                        className={`${headPad} font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-center border-b border-gray-200 dark:border-gray-700 border-r last:border-r-0 bg-indigo-50/60 dark:bg-indigo-950/30`}
                      >
                        {col.label}
                      </th>
                    );
                  }
                  const align = col.align ?? getDefaultAlign(col.type);
                  const isSortable = col.sortable !== false;
                  const justifyClass =
                    align === 'right'
                      ? 'justify-end'
                      : align === 'center'
                        ? 'justify-center'
                        : 'justify-start';
                  return (
                    <th
                      key={idx}
                      rowSpan={2}
                      onClick={isSortable ? () => handleSort(col.key) : undefined}
                      className={`${headPad} font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 whitespace-nowrap ${ALIGN_CLASSES[align]} ${isSortable ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none' : ''}`}
                      style={{ width: col.width, minWidth: col.minWidth ?? '80px' }}
                    >
                      <div className={`flex items-center gap-1 ${justifyClass}`}>
                        <span>{col.label}</span>
                        {isSortable && (
                          <SortIcon direction={sortKey === col.key ? sortDir : null} />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            )}
            <tr>
              {grouped
                ? columns.flatMap((col, gIdx) => {
                    if (!isColumnGroup(col)) return [];
                    return col.children.map((child, cIdx) =>
                      renderLeafTh(child, `${gIdx}-${cIdx}`),
                    );
                  })
                : leafColumns.map((col, idx) => renderLeafTh(col, idx))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={leafColumns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 6.477 0 12h4z"
                      />
                    </svg>
                    <span className="text-sm">Chargement…</span>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={leafColumns.length}>
                  <div className="flex items-center justify-center py-12">
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
                        {emptyMessage}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                    striped && rowIdx % 2 === 1 ? 'bg-black/5 dark:bg-white/5' : ''
                  }`}
                >
                  {leafColumns.map((col, colIdx) => {
                    const align = col.align ?? getDefaultAlign(col.type);
                    const value = row[col.key];
                    const content = col.render
                      ? col.render(value, row)
                      : formatCellValue(value, col.type);
                    return (
                      <td
                        key={colIdx}
                        className={`${cellPad} text-gray-900 dark:text-gray-100 ${ALIGN_CLASSES[align]}`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900">
        <span>
          {sorted.length === 0
            ? 'Aucun résultat'
            : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, sorted.length)} sur ${sorted.length} ligne${sorted.length > 1 ? 's' : ''}`}
          {search.trim() && ` (filtré sur ${data.length})`}
        </span>
        <div className="flex items-center gap-0.5">
          <PaginationButton onClick={() => setPage(1)} disabled={page === 1} label="Première page">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </PaginationButton>
          <PaginationButton
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            label="Page précédente"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </PaginationButton>
          <span className="px-3 font-medium text-gray-700 dark:text-gray-300 tabular-nums">
            {page} / {totalPages}
          </span>
          <PaginationButton
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            label="Page suivante"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </PaginationButton>
          <PaginationButton
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            label="Dernière page"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </PaginationButton>
        </div>
      </div>
    </div>
  );
}
