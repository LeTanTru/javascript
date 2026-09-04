import { describe, it, expect } from 'vitest';

/**
 * Utility hàm kiểm tra kiểu chính xác mức Senior / Production-grade
 */
function toExactType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

describe('Bài 04: Type Checking Mastery', () => {
  describe('1. typeof operator & các bẫy kinh điển', () => {
    it('trả về đúng 8 string kết quả chuẩn của ECMAScript', () => {
      expect(typeof undefined).toBe('undefined');
      expect(typeof true).toBe('boolean');
      expect(typeof 42).toBe('number');
      expect(typeof 42n).toBe('bigint');
      expect(typeof 'Antigravity').toBe('string');
      expect(typeof Symbol('id')).toBe('symbol');
      expect(typeof function () {}).toBe('function');
      expect(typeof {}).toBe('object');
    });

    it('bẫy typeof null === "object" (lỗi thiết kế từ 1995)', () => {
      // Trong JS 1995 (C-level), type tag 000 biểu thị Object, con trỏ NULL là 0x00
      expect(typeof null).toBe('object');
      expect(null instanceof Object).toBe(false);
    });

    it('typeof với các reference type đặc biệt đều là object', () => {
      expect(typeof []).toBe('object');
      expect(typeof /abc/).toBe('object');
      expect(typeof new Date()).toBe('object');
      expect(typeof new Map()).toBe('object');
    });
  });

  describe('2. instanceof operator & Prototype Chain', () => {
    it('kiểm tra constructor.prototype có nằm trong prototype chain', () => {
      const arr = [1, 2, 3];
      expect(arr instanceof Array).toBe(true);
      expect(arr instanceof Object).toBe(true);
      expect(arr instanceof RegExp).toBe(false);
    });

    it('instanceof không hoạt động với primitives nguyên bản', () => {
      expect('hello' instanceof String).toBe(false);
      expect(new String('hello') instanceof String).toBe(true);
    });

    it('instanceof có thể bị đánh lừa bằng prototype mutation hoặc Symbol.hasInstance', () => {
      class SpecialValidator {
        static [Symbol.hasInstance](instance) {
          return Array.isArray(instance);
        }
      }
      expect([1, 2] instanceof SpecialValidator).toBe(true);
      expect({} instanceof SpecialValidator).toBe(false);
    });
  });

  describe('3. Cross-realm issue & Array.isArray vs instanceof', () => {
    it('mô phỏng cross-realm (hai constructor Array khác nhau ở hai realms)', () => {
      // Giả lập constructor Array từ realm khác (vd iframe contentWindow.Array)
      function FakeRealmArray() {}
      FakeRealmArray.prototype = Object.create(Array.prototype);
      const fakeRealmObj = Object.create(FakeRealmArray.prototype);

      // Thất bại vì Constructor không khớp
      expect(fakeRealmObj instanceof Array).toBe(true); // qua prototype chain giả lập
      
      // Nhưng đối với Array thật được tạo ra từ Realm khác:
      // Array.isArray kiểm tra internal slot [[Class]], an toàn tuyệt đối
      expect(Array.isArray([])).toBe(true);
      expect(Array.isArray({ length: 0 })).toBe(false);
    });
  });

  describe('4. Object.prototype.toString.call() - Tiêu chuẩn vàng', () => {
    it('trích xuất chính xác internal tag của mọi kiểu dữ liệu', () => {
      expect(Object.prototype.toString.call(null)).toBe('[object Null]');
      expect(Object.prototype.toString.call(undefined)).toBe('[object Undefined]');
      expect(Object.prototype.toString.call([])).toBe('[object Array]');
      expect(Object.prototype.toString.call(/regex/)).toBe('[object RegExp]');
      expect(Object.prototype.toString.call(new Date())).toBe('[object Date]');
      expect(Object.prototype.toString.call(new Map())).toBe('[object Map]');
      expect(Object.prototype.toString.call(new Set())).toBe('[object Set]');
    });

    it('hàm toExactType() phân loại chính xác 100% mọi giá trị', () => {
      expect(toExactType(null)).toBe('null');
      expect(toExactType(undefined)).toBe('undefined');
      expect(toExactType([1, 2])).toBe('array');
      expect(toExactType({})).toBe('object');
      expect(toExactType(new Date())).toBe('date');
      expect(toExactType(/test/)).toBe('regexp');
      expect(toExactType(async () => {})).toBe('asyncfunction');
    });
  });
});
