import { useMemo, useState, useCallback } from 'react';

interface UsePaginatedSearchOptions<T> {
  data: T[] | undefined;
  searchFields: (keyof T)[];
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginatedSearchReturn<T> {
  filteredData: T[];
  paginatedData: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  search: string;
  setSearch: (search: string) => void;
  setCurrentPage: (page: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * Reusable hook for filtering and paginating lists.
 * Handles search filtering across multiple fields and pagination logic.
 */
export function usePaginatedSearch<T>({
  data,
  searchFields,
  pageSize = DEFAULT_PAGE_SIZE,
  initialPage = 1,
}: UsePaginatedSearchOptions<T>): UsePaginatedSearchReturn<T> {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1);
  }, []);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;

    const searchLower = search.toLowerCase();
    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchLower);
        }
        return false;
      }),
    );
  }, [data, search, searchFields]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const goToFirstPage = useCallback(() => setCurrentPage(1), []);
  const goToLastPage = useCallback(() => setCurrentPage(totalPages), [totalPages]);
  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);
  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  return {
    filteredData,
    paginatedData,
    totalItems,
    totalPages,
    currentPage,
    search,
    setSearch: handleSetSearch,
    setCurrentPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
  };
}
