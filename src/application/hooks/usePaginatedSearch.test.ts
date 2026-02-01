import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaginatedSearch } from './usePaginatedSearch';

interface TestItem {
  id: number;
  name: string;
  category: string;
  count: number;
}

const mockData: TestItem[] = [
  { id: 1, name: 'Apple', category: 'Fruit', count: 10 },
  { id: 2, name: 'Banana', category: 'Fruit', count: 20 },
  { id: 3, name: 'Carrot', category: 'Vegetable', count: 15 },
  { id: 4, name: 'Date', category: 'Fruit', count: 5 },
  { id: 5, name: 'Eggplant', category: 'Vegetable', count: 8 },
  { id: 6, name: 'Fig', category: 'Fruit', count: 12 },
  { id: 7, name: 'Grape', category: 'Fruit', count: 25 },
  { id: 8, name: 'Honeydew', category: 'Fruit', count: 7 },
  { id: 9, name: 'Iceberg Lettuce', category: 'Vegetable', count: 30 },
  { id: 10, name: 'Jackfruit', category: 'Fruit', count: 3 },
  { id: 11, name: 'Kale', category: 'Vegetable', count: 18 },
  { id: 12, name: 'Lemon', category: 'Fruit', count: 22 },
];

describe('usePaginatedSearch', () => {
  describe('initial state', () => {
    it('should return all data when no search is applied', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name', 'category'],
        }),
      );

      expect(result.current.filteredData).toHaveLength(12);
      expect(result.current.totalItems).toBe(12);
    });

    it('should paginate data with default page size of 10', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
        }),
      );

      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.totalPages).toBe(2);
      expect(result.current.currentPage).toBe(1);
    });

    it('should use custom page size', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
          pageSize: 5,
        }),
      );

      expect(result.current.paginatedData).toHaveLength(5);
      expect(result.current.totalPages).toBe(3);
    });

    it('should use custom initial page', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
          pageSize: 5,
          initialPage: 2,
        }),
      );

      expect(result.current.currentPage).toBe(2);
      expect(result.current.paginatedData[0].name).toBe('Fig');
    });

    it('should handle undefined data', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: undefined,
          searchFields: ['name'],
        }),
      );

      expect(result.current.filteredData).toEqual([]);
      expect(result.current.paginatedData).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPages).toBe(1);
    });

    it('should handle empty data array', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: [],
          searchFields: ['name'],
        }),
      );

      expect(result.current.filteredData).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPages).toBe(1);
    });
  });

  describe('search functionality', () => {
    it('should filter by string field', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
        }),
      );

      act(() => {
        result.current.setSearch('apple');
      });

      expect(result.current.filteredData).toHaveLength(1);
      expect(result.current.filteredData[0].name).toBe('Apple');
    });

    it('should be case-insensitive', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
        }),
      );

      act(() => {
        result.current.setSearch('BANANA');
      });

      expect(result.current.filteredData).toHaveLength(1);
      expect(result.current.filteredData[0].name).toBe('Banana');
    });

    it('should search across multiple fields', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name', 'category'],
        }),
      );

      act(() => {
        result.current.setSearch('Vegetable');
      });

      expect(result.current.filteredData).toHaveLength(4);
    });

    it('should search by number field', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['count'],
        }),
      );

      act(() => {
        result.current.setSearch('25');
      });

      expect(result.current.filteredData).toHaveLength(1);
      expect(result.current.filteredData[0].name).toBe('Grape');
    });

    it('should reset to page 1 when search changes', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
          pageSize: 5,
        }),
      );

      act(() => {
        result.current.setCurrentPage(2);
      });
      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.setSearch('a');
      });
      expect(result.current.currentPage).toBe(1);
    });

    it('should handle empty search after filtering', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
        }),
      );

      act(() => {
        result.current.setSearch('apple');
      });
      expect(result.current.filteredData).toHaveLength(1);

      act(() => {
        result.current.setSearch('');
      });
      expect(result.current.filteredData).toHaveLength(12);
    });

    it('should handle whitespace-only search', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
        }),
      );

      act(() => {
        result.current.setSearch('   ');
      });

      expect(result.current.filteredData).toHaveLength(12);
    });
  });

  describe('pagination navigation', () => {
    it('should go to next page', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
          pageSize: 5,
        }),
      );

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.paginatedData[0].name).toBe('Fig');
    });

    it('should not exceed last page', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
          pageSize: 5,
        }),
      );

      act(() => {
        result.current.setCurrentPage(3);
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(3);
    });

    it('should go to previous page', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
          pageSize: 5,
          initialPage: 2,
        }),
      );

      act(() => {
        result.current.goToPrevPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should not go below page 1', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
          pageSize: 5,
        }),
      );

      act(() => {
        result.current.goToPrevPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should go to first page', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
          pageSize: 5,
          initialPage: 3,
        }),
      );

      act(() => {
        result.current.goToFirstPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should go to last page', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
          pageSize: 5,
        }),
      );

      act(() => {
        result.current.goToLastPage();
      });

      expect(result.current.currentPage).toBe(3);
    });

    it('should allow setting specific page', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
          pageSize: 5,
        }),
      );

      act(() => {
        result.current.setCurrentPage(2);
      });

      expect(result.current.currentPage).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle data smaller than page size', () => {
      const smallData = mockData.slice(0, 3);
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: smallData,
          searchFields: ['name'],
          pageSize: 10,
        }),
      );

      expect(result.current.paginatedData).toHaveLength(3);
      expect(result.current.totalPages).toBe(1);
    });

    it('should handle search with no results', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
        }),
      );

      act(() => {
        result.current.setSearch('xyz123');
      });

      expect(result.current.filteredData).toHaveLength(0);
      expect(result.current.paginatedData).toHaveLength(0);
      expect(result.current.totalPages).toBe(1);
    });

    it('should handle partial string matches', () => {
      const { result } = renderHook(() =>
        usePaginatedSearch({
          data: mockData,
          searchFields: ['name'],
        }),
      );

      act(() => {
        result.current.setSearch('an');
      });

      expect(result.current.filteredData).toHaveLength(2);
      expect(result.current.filteredData.map(i => i.name)).toContain('Banana');
      expect(result.current.filteredData.map(i => i.name)).toContain('Eggplant');
    });
  });
});
