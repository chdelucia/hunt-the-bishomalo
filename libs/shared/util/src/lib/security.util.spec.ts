import { prototypePollutionReviver, sanitizeObject } from './security.util';

describe('Security Utilities', () => {
  const hasOwn = (obj: any, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

  describe('prototypePollutionReviver', () => {
    it('should strip forbidden keys', () => {
      const payload = '{"foo": "bar", "__proto__": {"polluted": "true"}, "constructor": "evil", "prototype": "dangerous"}';
      const parsed = JSON.parse(payload, prototypePollutionReviver);

      expect(parsed.foo).toBe('bar');
      expect(hasOwn(parsed, '__proto__')).toBe(false);
      expect(hasOwn(parsed, 'constructor')).toBe(false);
      expect(hasOwn(parsed, 'prototype')).toBe(false);
    });

    it('should handle nested forbidden keys', () => {
      const payload = '{"nested": {"__proto__": {"polluted": "true"}}}';
      const parsed = JSON.parse(payload, prototypePollutionReviver);

      expect(hasOwn(parsed.nested, '__proto__')).toBe(false);
    });

    it('should allow normal keys', () => {
      const payload = '{"a": 1, "b": "2", "c": true}';
      const parsed = JSON.parse(payload, prototypePollutionReviver);

      expect(parsed).toEqual({ a: 1, b: '2', c: true });
    });
  });

  describe('sanitizeObject', () => {
    it('should remove forbidden keys recursively', () => {
      const obj = {
        foo: 'bar',
        __proto__: { polluted: 'true' },
        nested: {
          constructor: 'evil',
          deep: {
            prototype: 'dangerous',
            valid: 123,
          },
        },
        list: [{ __proto__: 'polluted' }, { valid: true }],
      };

      const sanitized = sanitizeObject(obj);

      expect(sanitized.foo).toBe('bar');
      expect(hasOwn(sanitized, '__proto__')).toBe(false);
      expect(hasOwn(sanitized.nested, 'constructor')).toBe(false);
      expect(hasOwn(sanitized.nested.deep, 'prototype')).toBe(false);
      expect(sanitized.nested.deep.valid).toBe(123);
      expect(hasOwn(sanitized.list[0], '__proto__')).toBe(false);
      expect(sanitized.list[1]).toEqual({ valid: true });
    });

    it('should return non-objects as is', () => {
      expect(sanitizeObject(null)).toBeNull();
      expect(sanitizeObject(123)).toBe(123);
      expect(sanitizeObject('string')).toBe('string');
    });
  });
});
