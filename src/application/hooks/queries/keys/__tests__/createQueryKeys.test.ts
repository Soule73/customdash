import { describe, it, expect } from 'vitest';
import {
  createQueryKeys,
  dashboardKeys,
  widgetKeys,
  dataSourceKeys,
  aiConversationKeys,
  userKeys,
  roleKeys,
  processingKeys,
} from '../createQueryKeys';

describe('createQueryKeys', () => {
  describe('factory function', () => {
    it('should create query keys with correct base', () => {
      const keys = createQueryKeys('test');
      expect(keys.all).toEqual(['test']);
    });

    it('should create lists key', () => {
      const keys = createQueryKeys('test');
      expect(keys.lists()).toEqual(['test', 'list']);
    });

    it('should create list key without filters', () => {
      const keys = createQueryKeys('test');
      expect(keys.list()).toEqual(['test', 'list', undefined]);
    });

    it('should create list key with filters', () => {
      const keys = createQueryKeys('test');
      const filters = { page: 1, status: 'active' };
      expect(keys.list(filters)).toEqual(['test', 'list', filters]);
    });

    it('should create details key', () => {
      const keys = createQueryKeys('test');
      expect(keys.details()).toEqual(['test', 'detail']);
    });

    it('should create detail key with id', () => {
      const keys = createQueryKeys('test');
      expect(keys.detail('123')).toEqual(['test', 'detail', '123']);
    });

    it('should preserve type information', () => {
      const keys = createQueryKeys('myResource');
      // TypeScript would error if types are wrong
      const all: readonly ['myResource'] = keys.all;
      expect(all).toBeDefined();
    });
  });

  describe('pre-defined keys', () => {
    it('should have correct dashboardKeys', () => {
      expect(dashboardKeys.all).toEqual(['dashboards']);
      expect(dashboardKeys.lists()).toEqual(['dashboards', 'list']);
      expect(dashboardKeys.detail('id1')).toEqual(['dashboards', 'detail', 'id1']);
    });

    it('should have correct widgetKeys', () => {
      expect(widgetKeys.all).toEqual(['widgets']);
      expect(widgetKeys.lists()).toEqual(['widgets', 'list']);
      expect(widgetKeys.detail('widget-1')).toEqual(['widgets', 'detail', 'widget-1']);
    });

    it('should have correct dataSourceKeys', () => {
      expect(dataSourceKeys.all).toEqual(['datasources']);
      expect(dataSourceKeys.list({ type: 'json' })).toEqual([
        'datasources',
        'list',
        { type: 'json' },
      ]);
    });

    it('should have correct aiConversationKeys', () => {
      expect(aiConversationKeys.all).toEqual(['ai-conversations']);
      expect(aiConversationKeys.details()).toEqual(['ai-conversations', 'detail']);
    });

    it('should have correct userKeys', () => {
      expect(userKeys.all).toEqual(['users']);
      expect(userKeys.list()).toEqual(['users', 'list', undefined]);
    });

    it('should have correct roleKeys', () => {
      expect(roleKeys.all).toEqual(['roles']);
      expect(roleKeys.detail('admin')).toEqual(['roles', 'detail', 'admin']);
    });

    it('should have correct processingKeys', () => {
      expect(processingKeys.all).toEqual(['processing']);
      expect(processingKeys.lists()).toEqual(['processing', 'list']);
    });
  });

  describe('key uniqueness', () => {
    it('should generate unique keys for different filters', () => {
      const key1 = dashboardKeys.list({ page: 1 });
      const key2 = dashboardKeys.list({ page: 2 });
      const key3 = dashboardKeys.list();

      expect(key1).not.toEqual(key2);
      expect(key1).not.toEqual(key3);
    });

    it('should generate unique keys for different ids', () => {
      const key1 = widgetKeys.detail('id1');
      const key2 = widgetKeys.detail('id2');

      expect(key1).not.toEqual(key2);
    });
  });

  describe('query invalidation patterns', () => {
    it('should allow invalidating all list queries', () => {
      // lists() returns base key for list invalidation
      const listsKey = dashboardKeys.lists();
      const specificListKey = dashboardKeys.list({ status: 'active' });

      // The lists key should be a prefix of specific list keys
      expect(specificListKey.slice(0, 2)).toEqual(listsKey);
    });

    it('should allow invalidating all detail queries', () => {
      const detailsKey = widgetKeys.details();
      const specificDetailKey = widgetKeys.detail('123');

      expect(specificDetailKey.slice(0, 2)).toEqual(detailsKey);
    });

    it('should allow invalidating all queries for a resource', () => {
      const allKey = dataSourceKeys.all;
      const listKey = dataSourceKeys.list();
      const detailKey = dataSourceKeys.detail('x');

      expect(listKey[0]).toEqual(allKey[0]);
      expect(detailKey[0]).toEqual(allKey[0]);
    });
  });
});
