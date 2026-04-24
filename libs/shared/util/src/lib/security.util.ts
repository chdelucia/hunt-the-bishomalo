export const FORBIDDEN_PROTOTYPE_KEYS = ['__proto__', 'constructor', 'prototype'];

/**
 * A JSON.parse reviver function that strips forbidden prototype-related keys
 * to prevent Prototype Pollution vulnerabilities.
 */
export function prototypePollutionReviver(key: string, value: unknown): unknown {
  if (FORBIDDEN_PROTOTYPE_KEYS.includes(key)) {
    return undefined;
  }
  return value;
}

/**
 * Recursively sanitizes an object by removing forbidden prototype-related keys.
 * Useful for cases where JSON.parse reviver cannot be used or for pre-existing objects.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as unknown as T;
  }

  const sanitized: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (!FORBIDDEN_PROTOTYPE_KEYS.includes(key)) {
        sanitized[key] = sanitizeObject((obj as Record<string, unknown>)[key]);
      }
    }
  }
  return sanitized as T;
}
