import { describe, it, expect } from 'vitest';

// ─── IMPLEMENTATION: DEEP CLONE ──────────────────────────────────────────────
/**
 * Tự cài đặt deepClone hỗ trợ toàn diện các kiểu dữ liệu nâng cao:
 * - Primitive types (string, number, boolean, bigint, symbol, null, undefined)
 * - Date, RegExp, Map, Set
 * - Object & Array lồng nhau nhiều cấp
 * - Thuộc tính khóa là Symbol (Reflect.ownKeys)
 * - Quan hệ tham chiếu vòng (Circular References) bằng WeakMap
 *
 * @param {any} value - Đối tượng cần sao chép sâu
 * @param {WeakMap} [hash=new WeakMap()] - Bảng tra cứu tham chiếu vòng
 * @returns {any} clonedValue
 */
export function deepClone(value, hash = new WeakMap()) {
  // 1. Primitives hoặc function: Trả về trực tiếp
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // 2. Xử lý Date & RegExp
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // 3. Xử lý Circular References (Tham chiếu vòng)
  if (hash.has(value)) {
    return hash.get(value);
  }

  // 4. Xử lý Map
  if (value instanceof Map) {
    const clonedMap = new Map();
    hash.set(value, clonedMap);
    value.forEach((v, k) => {
      clonedMap.set(deepClone(k, hash), deepClone(v, hash));
    });
    return clonedMap;
  }

  // 5. Xử lý Set
  if (value instanceof Set) {
    const clonedSet = new Set();
    hash.set(value, clonedSet);
    value.forEach((v) => {
      clonedSet.add(deepClone(v, hash));
    });
    return clonedSet;
  }

  // 6. Xử lý Array và Plain Object (kể cả Symbol properties)
  const isArray = Array.isArray(value);
  const result = isArray ? [] : Object.create(Object.getPrototypeOf(value));
  hash.set(value, result);

  const keys = Reflect.ownKeys(value);
  for (const key of keys) {
    // Chỉ copy properties khả liệt kê hoặc Symbol
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor && descriptor.enumerable) {
      result[key] = deepClone(value[key], hash);
    }
  }

  return result;
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 06 - Bài 24: Live-coding Tự viết deepClone vs structuredClone', () => {
  it('1. Sao chép sâu Object & Array lồng nhau: Độc lập 100% về vùng nhớ', () => {
    const original = {
      name: 'Tru',
      skills: ['JS', 'React', { level: 'Senior' }],
      address: { city: 'HCMC', geo: { lat: 10.8, lng: 106.6 } },
    };

    const clone = deepClone(original);

    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
    expect(clone.skills).not.toBe(original.skills);
    expect(clone.skills[2]).not.toBe(original.skills[2]);
    expect(clone.address.geo).not.toBe(original.address.geo);

    // Mutation test
    clone.address.city = 'Hanoi';
    expect(original.address.city).toBe('HCMC');
  });

  it('2. Xử lý đúng Date và RegExp', () => {
    const original = {
      birthday: new Date('1995-10-20T00:00:00.000Z'),
      pattern: /^[a-z0-9_-]+$/gi,
    };

    const clone = deepClone(original);

    expect(clone.birthday).toBeInstanceOf(Date);
    expect(clone.birthday.getTime()).toBe(original.birthday.getTime());
    expect(clone.birthday).not.toBe(original.birthday);

    expect(clone.pattern).toBeInstanceOf(RegExp);
    expect(clone.pattern.source).toBe(original.pattern.source);
    expect(clone.pattern.flags).toBe(original.pattern.flags);
    expect(clone.pattern).not.toBe(original.pattern);
  });

  it('3. Xử lý đúng Map và Set (kể cả phần tử lồng nhau)', () => {
    const original = {
      mapData: new Map([
        ['k1', { val: 100 }],
        [{ id: 'objKey' }, [1, 2, 3]],
      ]),
      setData: new Set(['apple', { fruit: 'banana' }]),
    };

    const clone = deepClone(original);

    expect(clone.mapData).toBeInstanceOf(Map);
    expect(clone.setData).toBeInstanceOf(Set);
    expect(clone.mapData.get('k1')).not.toBe(original.mapData.get('k1'));
    expect(clone.mapData.get('k1')).toEqual({ val: 100 });
  });

  it('4. Xử lý Circular References (Tham chiếu vòng): Không gây Maximum call stack overflow', () => {
    const parent = { name: 'Parent' };
    const child = { name: 'Child', parent };
    parent.child = child; // Vòng: parent -> child -> parent

    const clonedParent = deepClone(parent);

    expect(clonedParent).not.toBe(parent);
    expect(clonedParent.name).toBe('Parent');
    expect(clonedParent.child.parent).toBe(clonedParent); // Bảo toàn cấu trúc vòng
    expect(clonedParent.child).not.toBe(child);
  });

  it('5. Sao chép Symbol properties bằng Reflect.ownKeys', () => {
    const symId = Symbol('userId');
    const original = {
      [symId]: 'SYM-12345',
      regular: 'value',
    };

    const clone = deepClone(original);

    expect(clone[symId]).toBe('SYM-12345');
    expect(clone.regular).toBe('value');
  });

  it('6. So sánh với structuredClone: structuredClone ném lỗi khi gặp Function/DOM, deepClone xử lý an toàn', () => {
    const objWithFn = {
      id: 1,
      greet: function () {
        return 'Hello';
      },
    };

    // structuredClone sẽ ném DataCloneError với Function
    expect(() => structuredClone(objWithFn)).toThrow();

    // Custom deepClone xử lý an toàn
    const cloned = deepClone(objWithFn);
    expect(cloned.id).toBe(1);
    expect(cloned.greet()).toBe('Hello');
  });
});
