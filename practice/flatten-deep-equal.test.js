import { describe, it, expect } from 'vitest';

// ─── IMPLEMENTATIONS ──────────────────────────────────────────────────────────

/**
 * 1. flattenArray: Làm phẳng mảng lồng nhau theo độ sâu `depth`
 * @param {Array} arr - Mảng lồng nhau
 * @param {number} [depth=1] - Độ sâu làm phẳng
 * @returns {Array} flattenedArray
 */
export function flattenArray(arr, depth = 1) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Expected an array');
  }
  if (depth <= 0) return arr.slice();

  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flattenArray(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

/**
 * 2. flattenObject: Làm phẳng Object lồng nhau thành các keys nối bằng delimiter
 * Ví dụ: { a: { b: { c: 1 } } } -> { 'a.b.c': 1 }
 *
 * @param {Object} obj - Object lồng nhau
 * @param {string} [prefix=''] - Tiền tố key
 * @param {string} [delimiter='.'] - Ký tự phân cách
 * @returns {Object} flattenedObject
 */
export function flattenObject(obj, prefix = '', delimiter = '.') {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date || obj instanceof RegExp) {
    return { [prefix]: obj };
  }

  const result = {};
  const keys = Object.keys(obj);

  if (keys.length === 0 && prefix) {
    result[prefix] = Array.isArray(obj) ? [] : {};
    return result;
  }

  for (const key of keys) {
    const val = obj[key];
    const newKey = prefix ? `${prefix}${delimiter}${key}` : key;

    if (val !== null && typeof val === 'object' && !(val instanceof Date) && !(val instanceof RegExp)) {
      Object.assign(result, flattenObject(val, newKey, delimiter));
    } else {
      result[newKey] = val;
    }
  }

  return result;
}

/**
 * 3. deepEqual: So sánh bằng cấu trúc sâu toàn diện
 * @param {any} a - Giá trị 1
 * @param {any} b - Giá trị 2
 * @returns {boolean} isEqual
 */
export function deepEqual(a, b) {
  // 1. Primitive & Reference equality (Xử lý cả NaN)
  if (Object.is(a, b)) return true;

  // 2. Nếu một trong hai là null hoặc không phải object
  if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
    return false;
  }

  // 3. Khác Constructor (VD: Array vs Plain Object, Map vs Set)
  if (a.constructor !== b.constructor) {
    return false;
  }

  // 4. Xử lý Date
  if (a instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // 5. Xử lý RegExp
  if (a instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  // 6. Xử lý Array và Plain Object
  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 06 - Bài 27: Live-coding flatten (Array/Object) & deepEqual', () => {
  it('1. flattenArray: Làm phẳng theo độ sâu depth và Infinity', () => {
    const nested = [1, [2, [3, [4, 5]]]];

    expect(flattenArray(nested, 1)).toEqual([1, 2, [3, [4, 5]]]);
    expect(flattenArray(nested, 2)).toEqual([1, 2, 3, [4, 5]]);
    expect(flattenArray(nested, Infinity)).toEqual([1, 2, 3, 4, 5]);
  });

  it('2. flattenObject: Chuyển cây lồng nhau nhiều cấp thành phẳng với dot notation', () => {
    const nestedObj = {
      user: {
        name: 'Tru',
        profile: {
          age: 28,
          address: { city: 'HCMC' },
        },
      },
      theme: 'dark',
    };

    const flat = flattenObject(nestedObj);

    expect(flat).toEqual({
      'user.name': 'Tru',
      'user.profile.age': 28,
      'user.profile.address.city': 'HCMC',
      theme: 'dark',
    });
  });

  it('3. flattenObject: Xử lý Date, RegExp và Object rỗng', () => {
    const d = new Date('2026-01-01');
    const r = /abc/g;
    const input = {
      meta: {
        createdAt: d,
        regex: r,
        empty: {},
      },
    };

    const flat = flattenObject(input);
    expect(flat['meta.createdAt']).toBe(d);
    expect(flat['meta.regex']).toBe(r);
    expect(flat['meta.empty']).toEqual({});
  });

  it('4. deepEqual: So sánh Primitives, NaN và Types', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('hello', 'hello')).toBe(true);
    expect(deepEqual(NaN, NaN)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(0, false)).toBe(false);
    expect(deepEqual([], {})).toBe(false);
  });

  it('5. deepEqual: So sánh sâu Objects & Arrays lồng nhau', () => {
    const obj1 = { a: [1, 2, { b: 'x' }], c: { d: 4 } };
    const obj2 = { a: [1, 2, { b: 'x' }], c: { d: 4 } };
    const obj3 = { a: [1, 2, { b: 'y' }], c: { d: 4 } };

    expect(deepEqual(obj1, obj2)).toBe(true);
    expect(deepEqual(obj1, obj3)).toBe(false);
  });

  it('6. deepEqual: So sánh Date, RegExp và Symbol Keys', () => {
    const sym = Symbol('id');
    const d1 = new Date('2026-09-04');
    const d2 = new Date('2026-09-04');
    const d3 = new Date('2025-01-01');

    expect(deepEqual(d1, d2)).toBe(true);
    expect(deepEqual(d1, d3)).toBe(false);

    expect(deepEqual(/test/i, /test/i)).toBe(true);
    expect(deepEqual(/test/i, /test/g)).toBe(false);

    const sObj1 = { [sym]: 100, name: 'A' };
    const sObj2 = { [sym]: 100, name: 'A' };
    const sObj3 = { [sym]: 200, name: 'A' };

    expect(deepEqual(sObj1, sObj2)).toBe(true);
    expect(deepEqual(sObj1, sObj3)).toBe(false);
  });
});
