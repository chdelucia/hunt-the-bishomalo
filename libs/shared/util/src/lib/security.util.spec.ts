import { prototypePollutionReviver, sanitizeObject } from './security.util';

describe('Security Utilities', () => {
  describe('prototypePollutionReviver', () => {
    it('should strip forbidden keys', () => {
      const json = '{"foo": "bar", "__proto__": {"polluted": "true"}, "constructor": "evil", "prototype": "dangerous"}';
      const parsed = JSON.parse(json, prototypePollutionReviver);

      expect(parsed.foo).toBe('bar');
      // When using reviver and returning undefined, the key is omitted from the object.
      // Use Object.prototype.hasOwnProperty.call to satisfy linting
      expect(Object.prototype.hasOwnProperty.call(parsed, '__proto__')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(parsed, 'constructor')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(parsed, 'prototype')).toBe(false);

      // Verify it's not actually polluted
      expect((parsed as Record<string, unknown>)['polluted']).toBeUndefined();
    });

    it('should handle nested objects', () => {
      const json = '{"nested": {"__proto__": {"a": 1}}}';
      const parsed = JSON.parse(json, prototypePollutionReviver);
      expect(Object.prototype.hasOwnProperty.call(parsed.nested, '__proto__')).toBe(false);
    });
  });

  describe('sanitizeObject', () => {
    it('should remove forbidden keys from object', () => {
      const obj = {
        a: 1,
        __proto__: { polluted: true },
        constructor: { name: 'evil' },
        prototype: { some: 'thing' }
      } as unknown as Record<string, unknown>;

      const sanitized = sanitizeObject(obj) as Record<string, unknown>;

      expect(sanitized['a']).toBe(1);
      expect(Object.prototype.hasOwnProperty.call(sanitized, '__proto__')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(sanitized, 'constructor')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(sanitized, 'prototype')).toBe(false);
    });

    it('should recursively sanitize nested objects and arrays', () => {
      const obj = {
        nested: {
          __proto__: { p: 1 },
          valid: true
        },
        arr: [
          { __proto__: { p: 2 }, ok: true },
          "plain"
        ]
      } as unknown as Record<string, unknown>;

      const sanitized = sanitizeObject(obj) as Record<string, unknown>;

      const nested = sanitized['nested'] as Record<string, unknown>;
      expect(nested['valid']).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(nested, '__proto__')).toBe(false);

      const arr = sanitized['arr'] as any[];
      expect(arr[0]['ok']).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(arr[0], '__proto__')).toBe(false);
    });

    it('should return null/undefined/primitives as is', () => {
      expect(sanitizeObject(null)).toBeNull();
      expect(sanitizeObject(undefined)).toBeUndefined();
      expect(sanitizeObject(123)).toBe(123);
      expect(sanitizeObject("string")).toBe("string");
    });
  });
});
