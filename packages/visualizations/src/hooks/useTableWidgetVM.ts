import { useMemo, useState, useCallback } from 'react';
import type { TableWidgetConfig, TableColumn } from '../interfaces';
import {
  detectTableConfigType,
  processRawData,
  generateTableTitle,
  validateTableConfig,
  applyTableFilters,
  sortTableData,
  searchTableData,
  paginateTableData,
} from '../utils/tableUtils';

export interface TableWidgetVM {
  columns: TableColumn[];
  displayData: Record<string, unknown>[];
  paginatedData: Record<string, unknown>[];
  tableTitle: string;
  isValid: boolean;
  totalRows: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  sortKey: string | null;
  sortDirection: 'asc' | 'desc';
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  handleSort: (key: string) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

export interface TableWidgetProps {
  data: Record<string, unknown>[];
  config: TableWidgetConfig;
}

/**
 * ViewModel hook for TableWidget with optimized sorting, searching and pagination
 * @param props - The properties for the Table widget
 * @returns The ViewModel containing columns, display data, paginated data, title, validity, pagination and sorting info
 *
 * @example
 * const tableWidgetVM = useTableWidgetVM({ data, config });
 */
export function useTableWidgetVM({ data, config }: TableWidgetProps): TableWidgetVM {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const pageSize = config.widgetParams?.pageSize ?? 10;

  const isValid = useMemo(() => validateTableConfig(config, data), [config, data]);

  const filteredData = useMemo(
    () => applyTableFilters(data, config.globalFilters),
    [data, config.globalFilters],
  );

  const configType = useMemo(() => detectTableConfigType(config), [config]);

  const { columns, displayData } = useMemo(() => {
    const safeData = Array.isArray(filteredData) ? filteredData : [];
    return processRawData(safeData);
  }, [filteredData]);

  const tableTitle = useMemo(() => generateTableTitle(config, configType), [config, configType]);

  const searchedData = useMemo(
    () => searchTableData(displayData, searchTerm, columns),
    [displayData, searchTerm, columns],
  );

  const sortedData = useMemo(() => {
    if (!sortKey) return searchedData;
    return sortTableData(searchedData, sortKey, sortDirection);
  }, [searchedData, sortKey, sortDirection]);

  const totalRows = sortedData.length;
  const totalPages = Math.ceil(totalRows / pageSize);

  const paginatedData = useMemo(
    () => paginateTableData(sortedData, currentPage, pageSize),
    [sortedData, currentPage, pageSize],
  );

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDirection('asc');
      }
      setCurrentPage(0);
    },
    [sortKey],
  );

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
  }, []);

  const goToFirstPage = useCallback(() => setCurrentPage(0), []);
  const goToLastPage = useCallback(() => setCurrentPage(Math.max(0, totalPages - 1)), [totalPages]);
  const goToNextPage = useCallback(
    () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1)),
    [totalPages],
  );
  const goToPrevPage = useCallback(() => setCurrentPage(prev => Math.max(prev - 1, 0)), []);

  return {
    columns,
    displayData,
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
    setCurrentPage,
    setSearchTerm: handleSearchChange,
    handleSort,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
  };
}
