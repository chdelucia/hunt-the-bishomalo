import { prototypePollutionReviver, sanitizeObject } from './security.util';

describe('Security Utils', () => {
  describe('prototypePollutionReviver', () => {
    it('should strip forbidden keys', () => {
      const json = '{"foo":"bar","__proto__":{"polluted":"yes"},"constructor":"danger","prototype":"danger"}';
      const parsed = JSON.parse(json, prototypePollutionReviver);

      expect(parsed.foo).toBe('bar');
      expect(Object.prototype.hasOwnProperty.call(parsed, '__proto__')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(parsed, 'constructor')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(parsed, 'prototype')).toBe(false);
    });
  });

  describe('sanitizeObject', () => {
    it('should recursively strip forbidden keys', () => {
      const obj = {
        a: 1,
        __proto__: { polluted: 'yes' },
        nested: {
          b: 2,
          constructor: { dangerous: true },
          arr: [
            { c: 3, prototype: 'danger' }
          ]
        }
      };

      const sanitized = sanitizeObject(obj);

      expect(sanitized.a).toBe(1);
      expect(Object.prototype.hasOwnProperty.call(sanitized, '__proto__')).toBe(false);
      expect(sanitized.nested.b).toBe(2);
      expect(Object.prototype.hasOwnProperty.call(sanitized.nested, 'constructor')).toBe(false);
      expect(sanitized.nested.arr[0].c).toBe(3);
      expect(Object.prototype.hasOwnProperty.call(sanitized.nested.arr[0], 'prototype')).toBe(false);
    });

    it('should handle null and primitives', () => {
      expect(sanitizeObject(null)).toBeNull();
      expect(sanitizeObject(123)).toBe(123);
      expect(sanitizeObject('str')).toBe('str');
    });
  });
});
