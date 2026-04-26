const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype'];

/**
 * A reviver function for JSON.parse that strips forbidden keys to prevent Prototype Pollution.
 */
export function prototypePollutionReviver(key: string, value: any): any {
  if (FORBIDDEN_KEYS.includes(key)) {
    return undefined;
  }
  return value;
}

/**
 * Recursively sanitizes an object by removing forbidden keys.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as any;
  }

  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !FORBIDDEN_KEYS.includes(key)) {
      sanitized[key] = sanitizeObject((obj as any)[key]);
    }
  }
  return sanitized;
}
