/**
 * A JSON reviver function that strips forbidden keys to prevent prototype pollution.
 */
export const prototypePollutionReviver = (key: string, value: any) => {
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    return undefined;
  }
  return value;
};

/**
 * Recursively sanitizes an object to remove forbidden keys.
 */
export const sanitizeObject = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
  }
  return sanitized;
};
