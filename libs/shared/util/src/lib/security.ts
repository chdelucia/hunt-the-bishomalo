/**
 * Reviver function for JSON.parse to prevent prototype pollution.
 * It strips forbidden keys like __proto__, constructor, and prototype.
 */
export const prototypePollutionReviver = (key: string, value: any): any => {
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    return undefined;
  }

  return value;
};
