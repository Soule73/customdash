import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  useWidgetFormStore,
  useWidgetFormType,
  useWidgetFormSourceId,
  useWidgetFormColumns,
  useWidgetFormTitle,
  useWidgetFormIsDirty,
  useWidgetFormActiveTab,
  useWidgetFormActions,
} from './index';

// Mock the widgetFormService
vi.mock('@core/widgets', () => ({
  widgetFormService: {
    createFormConfig: vi.fn().mockReturnValue({
      metrics: [{ field: '', agg: 'sum', label: '' }],
      buckets: [],
      globalFilters: [],
      metricStyles: [{}],
      widgetParams: {},
    }),
    getDataConfig: vi.fn().mockReturnValue({ datasetType: 'standard' }),
    applySchemaDefaults: vi.fn().mockReturnValue({}),
    createMetric: vi.fn().mockReturnValue({ field: '', agg: 'sum', label: '' }),
    createMetricStyle: vi.fn().mockReturnValue({}),
    applySourceData: vi.fn().mockReturnValue({
      metrics: [{ field: '', agg: 'sum', label: '' }],
      buckets: [],
    }),
    createBucket: vi.fn().mockReturnValue({ field: '' }),
    createFilter: vi.fn().mockReturnValue({ field: '', operator: 'equals', value: '' }),
    setNestedParam: vi.fn().mockImplementation((params, key, value) => ({
      ...params,
      [key]: value,
    })),
  },
}));

describe('Widget Form Store', () => {
  beforeEach(() => {
    act(() => {
      useWidgetFormStore.getState().resetForm();
    });
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      const state = useWidgetFormStore.getState();

      expect(state.type).toBe('bar');
      expect(state.sourceId).toBe('');
      expect(state.columns).toEqual([]);
      expect(state.columnTypes).toEqual({});
      expect(state.dataPreview).toEqual([]);
      expect(state.activeTab).toBe('data');
      expect(state.widgetTitle).toBe('');
      expect(state.widgetDescription).toBe('');
      expect(state.visibility).toBe('private');
      expect(state.isLoading).toBe(false);
      expect(state.isDirty).toBe(false);
      expect(state.errors).toEqual({});
    });
  });

  describe('base actions', () => {
    it('should set type and mark dirty', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.setType('line');
      });

      expect(result.current.type).toBe('line');
      expect(result.current.isDirty).toBe(true);
    });

    it('should set sourceId and mark dirty', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.setSourceId('source-123');
      });

      expect(result.current.sourceId).toBe('source-123');
      expect(result.current.isDirty).toBe(true);
    });

    it('should set active tab without marking dirty', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.setActiveTab('style');
      });

      expect(result.current.activeTab).toBe('style');
      expect(result.current.isDirty).toBe(false);
    });

    it('should set widget title and mark dirty', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.setWidgetTitle('My Widget');
      });

      expect(result.current.widgetTitle).toBe('My Widget');
      expect(result.current.isDirty).toBe(true);
    });

    it('should set widget description and mark dirty', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.setWidgetDescription('A test widget');
      });

      expect(result.current.widgetDescription).toBe('A test widget');
      expect(result.current.isDirty).toBe(true);
    });

    it('should set visibility and mark dirty', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.setVisibility('public');
      });

      expect(result.current.visibility).toBe('public');
      expect(result.current.isDirty).toBe(true);
    });

    it('should set errors', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.setErrors({ title: 'Title is required' });
      });

      expect(result.current.errors).toEqual({ title: 'Title is required' });
    });

    it('should set isDirty directly', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.setIsDirty(true);
      });

      expect(result.current.isDirty).toBe(true);

      act(() => {
        result.current.setIsDirty(false);
      });

      expect(result.current.isDirty).toBe(false);
    });
  });

  describe('config actions', () => {
    it('should update config key', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.updateConfig('widgetParams', { showLegend: true });
      });

      expect(result.current.config.widgetParams).toEqual({ showLegend: true });
      expect(result.current.isDirty).toBe(true);
    });

    it('should update widget param', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.updateWidgetParam('stacked', true);
      });

      expect(result.current.config.widgetParams.stacked).toBe(true);
      expect(result.current.isDirty).toBe(true);
    });
  });

  describe('metrics actions', () => {
    it('should add a metric', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      const initialLength = result.current.config.metrics.length;

      act(() => {
        result.current.addMetric();
      });

      expect(result.current.config.metrics.length).toBe(initialLength + 1);
      expect(result.current.isDirty).toBe(true);
    });

    it('should update a metric', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.updateMetric(0, { field: 'revenue', agg: 'avg' });
      });

      expect(result.current.config.metrics[0].field).toBe('revenue');
      expect(result.current.config.metrics[0].agg).toBe('avg');
      expect(result.current.isDirty).toBe(true);
    });

    it('should auto-set label from field when updating metric', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.updateMetric(0, { field: 'total_sales' });
      });

      expect(result.current.config.metrics[0].label).toBe('total_sales');
    });

    it('should not remove last metric', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      const initialLength = result.current.config.metrics.length;
      expect(initialLength).toBe(1);

      act(() => {
        result.current.removeMetric(0);
      });

      expect(result.current.config.metrics.length).toBe(1);
    });

    it('should remove metric when more than one exists', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.addMetric();
      });

      expect(result.current.config.metrics.length).toBe(2);

      act(() => {
        result.current.removeMetric(0);
      });

      expect(result.current.config.metrics.length).toBe(1);
    });

    it('should move metric', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      // Add more metrics
      act(() => {
        result.current.addMetric();
        result.current.updateMetric(0, { field: 'first' });
        result.current.updateMetric(1, { field: 'second' });
      });

      act(() => {
        result.current.moveMetric(0, 1);
      });

      expect(result.current.config.metrics[0].field).toBe('second');
      expect(result.current.config.metrics[1].field).toBe('first');
    });

    it('should update metric style', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.updateMetricStyle(0, { backgroundColor: '#ff0000' });
      });

      expect(result.current.config.metricStyles[0].backgroundColor).toBe('#ff0000');
      expect(result.current.isDirty).toBe(true);
    });
  });

  describe('buckets actions', () => {
    it('should add a bucket', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      const initialLength = result.current.config.buckets.length;

      act(() => {
        result.current.addBucket();
      });

      expect(result.current.config.buckets.length).toBe(initialLength + 1);
      expect(result.current.isDirty).toBe(true);
    });

    it('should update a bucket', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.addBucket();
        result.current.updateBucket(0, { field: 'category' });
      });

      expect(result.current.config.buckets[0].field).toBe('category');
      expect(result.current.isDirty).toBe(true);
    });

    it('should remove a bucket', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.addBucket();
        result.current.addBucket();
      });

      expect(result.current.config.buckets.length).toBe(2);

      act(() => {
        result.current.removeBucket(0);
      });

      expect(result.current.config.buckets.length).toBe(1);
    });

    it('should move bucket', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.addBucket();
        result.current.addBucket();
        result.current.updateBucket(0, { field: 'first' });
        result.current.updateBucket(1, { field: 'second' });
      });

      act(() => {
        result.current.moveBucket(0, 1);
      });

      expect(result.current.config.buckets[0].field).toBe('second');
      expect(result.current.config.buckets[1].field).toBe('first');
    });
  });

  describe('filters actions', () => {
    it('should add a global filter', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.addGlobalFilter();
      });

      expect(result.current.config.globalFilters.length).toBe(1);
      expect(result.current.isDirty).toBe(true);
    });

    it('should update a global filter', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.addGlobalFilter();
        result.current.updateGlobalFilter(0, {
          field: 'status',
          operator: 'equals',
          value: 'active',
        });
      });

      expect(result.current.config.globalFilters[0].field).toBe('status');
      expect(result.current.config.globalFilters[0].value).toBe('active');
      expect(result.current.isDirty).toBe(true);
    });

    it('should remove a global filter', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.addGlobalFilter();
        result.current.addGlobalFilter();
      });

      expect(result.current.config.globalFilters.length).toBe(2);

      act(() => {
        result.current.removeGlobalFilter(0);
      });

      expect(result.current.config.globalFilters.length).toBe(1);
    });
  });

  describe('form actions', () => {
    it('should initialize form with type', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.initializeForm({
          type: 'pie',
          sourceId: 'source-1',
          widgetTitle: 'Test Widget',
        });
      });

      expect(result.current.type).toBe('pie');
      expect(result.current.sourceId).toBe('source-1');
      expect(result.current.widgetTitle).toBe('Test Widget');
      expect(result.current.isDirty).toBe(false);
      expect(result.current.activeTab).toBe('data');
    });

    it('should load source data', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      const mockData = [
        { id: 1, name: 'Test', value: 100 },
        { id: 2, name: 'Test2', value: 200 },
      ];
      const columns = ['id', 'name', 'value'];
      const columnTypes = { id: 'number', name: 'string', value: 'number' };

      act(() => {
        result.current.loadSourceData('source-1', mockData, columns, columnTypes);
      });

      expect(result.current.sourceId).toBe('source-1');
      expect(result.current.columns).toEqual(columns);
      expect(result.current.columnTypes).toEqual(columnTypes);
      expect(result.current.dataPreview).toEqual(mockData);
      expect(result.current.isDirty).toBe(true);
    });

    it('should limit data preview to 100 rows', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      const mockData = Array.from({ length: 150 }, (_, i) => ({ id: i }));

      act(() => {
        result.current.loadSourceData('source-1', mockData, ['id'], { id: 'number' });
      });

      expect(result.current.dataPreview).toHaveLength(100);
    });

    it('should reset form to initial state', () => {
      const { result } = renderHook(() => useWidgetFormStore());

      act(() => {
        result.current.setType('line');
        result.current.setSourceId('source-123');
        result.current.setWidgetTitle('Test');
        result.current.setIsDirty(true);
      });

      expect(result.current.type).toBe('line');

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.type).toBe('bar');
      expect(result.current.sourceId).toBe('');
      expect(result.current.widgetTitle).toBe('');
      expect(result.current.isDirty).toBe(false);
    });
  });

  describe('selector hooks', () => {
    it('should return type via useWidgetFormType', () => {
      const { result } = renderHook(() => useWidgetFormType());
      expect(result.current).toBe('bar');
    });

    it('should return sourceId via useWidgetFormSourceId', () => {
      const { result } = renderHook(() => useWidgetFormSourceId());
      expect(result.current).toBe('');
    });

    it('should return columns via useWidgetFormColumns', () => {
      const { result } = renderHook(() => useWidgetFormColumns());
      expect(result.current).toEqual([]);
    });

    it('should return title via useWidgetFormTitle', () => {
      const { result } = renderHook(() => useWidgetFormTitle());
      expect(result.current).toBe('');
    });

    it('should return isDirty via useWidgetFormIsDirty', () => {
      const { result } = renderHook(() => useWidgetFormIsDirty());
      expect(result.current).toBe(false);
    });

    it('should return activeTab via useWidgetFormActiveTab', () => {
      const { result } = renderHook(() => useWidgetFormActiveTab());
      expect(result.current).toBe('data');
    });
  });

  describe('actions hook', () => {
    it('should return all actions via useWidgetFormActions', () => {
      const { result } = renderHook(() => useWidgetFormActions());

      expect(typeof result.current.setType).toBe('function');
      expect(typeof result.current.setSourceId).toBe('function');
      expect(typeof result.current.addMetric).toBe('function');
      expect(typeof result.current.addBucket).toBe('function');
      expect(typeof result.current.addGlobalFilter).toBe('function');
      expect(typeof result.current.initializeForm).toBe('function');
      expect(typeof result.current.resetForm).toBe('function');
    });
  });
});
