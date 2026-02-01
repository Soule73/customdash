/**
 * Query Keys Factory
 *
 * @description Factory function to create consistent query keys for React Query.
 * Follows the DRY principle by centralizing the query key pattern.
 *
 * @example
 * const userKeys = createQueryKeys('users');
 * userKeys.all           // ['users']
 * userKeys.lists()       // ['users', 'list']
 * userKeys.list({page:1}) // ['users', 'list', {page: 1}]
 * userKeys.details()     // ['users', 'detail']
 * userKeys.detail('123') // ['users', 'detail', '123']
 */

export type QueryKeyFilters = Record<string, unknown> | undefined;

export interface QueryKeys<T extends string> {
  /** Base key for all queries of this type */
  all: readonly [T];
  /** Key for list queries */
  lists: () => readonly [T, 'list'];
  /** Key for filtered list queries */
  list: (filters?: QueryKeyFilters) => readonly [T, 'list', QueryKeyFilters];
  /** Key for detail queries */
  details: () => readonly [T, 'detail'];
  /** Key for specific detail query */
  detail: (id: string) => readonly [T, 'detail', string];
}

/**
 * Creates a standardized set of query keys for a resource type.
 *
 * @param base - The base name for the resource (e.g., 'dashboards', 'widgets')
 * @returns An object with methods to generate consistent query keys
 */
export function createQueryKeys<T extends string>(base: T): QueryKeys<T> {
  return {
    all: [base] as const,
    lists: () => [base, 'list'] as const,
    list: (filters?: QueryKeyFilters) => [base, 'list', filters] as const,
    details: () => [base, 'detail'] as const,
    detail: (id: string) => [base, 'detail', id] as const,
  };
}

// Pre-defined query keys for common resources
export const dashboardKeys = createQueryKeys('dashboards');
export const widgetKeys = createQueryKeys('widgets');
export const dataSourceKeys = createQueryKeys('datasources');
export const aiConversationKeys = createQueryKeys('ai-conversations');
export const userKeys = createQueryKeys('users');
export const roleKeys = createQueryKeys('roles');
export const processingKeys = createQueryKeys('processing');
