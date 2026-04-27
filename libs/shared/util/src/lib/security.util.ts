const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype'];

/**
 * A JSON.parse reviver that strips forbidden keys to prevent prototype pollution.
 */
export function prototypePollutionReviver(key: string, value: unknown): unknown {
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
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  const sanitized: Record<string, unknown> = {};
  const typedObj = obj as Record<string, unknown>;

  for (const key in typedObj) {
    if (Object.prototype.hasOwnProperty.call(typedObj, key) && !FORBIDDEN_KEYS.includes(key)) {
      sanitized[key] = sanitizeObject(typedObj[key]);
    }
  }
  return sanitized as T;
}
