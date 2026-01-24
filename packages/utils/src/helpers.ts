type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | Record<string, boolean>;

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ');
}

export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${randomPart}` : `${timestamp}${randomPart}`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a !== typeof b) return false;

  if (a === null || b === null) return a === b;

  if (typeof a !== 'object' || typeof b !== 'object') return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false;
    }
  }

  return true;
}

const DATE_TYPES = ['date', 'datetime'] as const;

/**
 * Check if a column type is a date type
 */
export function isDateType(type: string): boolean {
  return DATE_TYPES.includes(type as (typeof DATE_TYPES)[number]);
}

/**
 * Filter columns by their types
 */
export function filterColumnsByType(
  columns: string[],
  types: Record<string, string>,
  allowedTypes: string[],
): string[] {
  return columns.filter(column => allowedTypes.includes(types[column] || ''));
}

/**
 * Get date columns from a list of columns
 */
export function getDateColumns(columns: string[], types: Record<string, string>): string[] {
  return filterColumnsByType(columns, types, [...DATE_TYPES]);
}

/**
 * Get a nested value from an object using a dot-notation path
 */
export function getNestedValue<T>(obj: Record<string, unknown>, path: string): T | undefined {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as T | undefined;
}

/**
 * Set a nested value in an object using a dot-notation path
 */
export function setNestedValue<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown,
): T {
  const keys = path.split('.');
  const result = { ...obj };
  let current: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] =
      current[key] !== undefined ? { ...(current[key] as Record<string, unknown>) } : {};
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

/**
 * Check if a key is a nested path
 */
export function isNestedPath(key: string): boolean {
  return key.includes('.');
}
