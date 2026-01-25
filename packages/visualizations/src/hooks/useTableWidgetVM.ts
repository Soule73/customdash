import { useMemo, useState, useCallback } from 'react';
import type { TableWidgetConfig, TableColumn, TableDataContext } from '../interfaces';
import { TableWidgetService } from '../core/services/TableWidgetService';

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

export interface TableWidgetInput {
  data: Record<string, unknown>[];
  config: TableWidgetConfig;
}

/**
 * ViewModel hook for TableWidget with optimized sorting, searching and pagination
 * Uses TableWidgetService for business logic
 */
export function useTableWidgetVM({ data, config }: TableWidgetInput): TableWidgetVM {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const context = useMemo<TableDataContext>(
    () => TableWidgetService.createDataContext({ data, config }),
    [data, config],
  );

  const processedData = useMemo(
    () =>
      TableWidgetService.processWithPagination(context, {
        currentPage,
        pageSize: context.pageSize,
        sortKey,
        sortDirection,
        searchTerm,
      }),
    [context, currentPage, sortKey, sortDirection, searchTerm],
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
  const goToLastPage = useCallback(
    () => setCurrentPage(Math.max(0, processedData.totalPages - 1)),
    [processedData.totalPages],
  );
  const goToNextPage = useCallback(
    () => setCurrentPage(prev => Math.min(prev + 1, processedData.totalPages - 1)),
    [processedData.totalPages],
  );
  const goToPrevPage = useCallback(() => setCurrentPage(prev => Math.max(prev - 1, 0)), []);

  return {
    columns: context.columns,
    displayData: context.displayData,
    paginatedData: processedData.paginatedData,
    tableTitle: context.tableTitle,
    isValid: context.isValid,
    totalRows: processedData.totalRows,
    totalPages: processedData.totalPages,
    currentPage,
    pageSize: context.pageSize,
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
