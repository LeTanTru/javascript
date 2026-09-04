import { describe, it, expect } from 'vitest';

describe('Bài 05: Execution Context & Creation vs Execution Phase', () => {
  describe('1. Creation Phase: Function Declaration vs var', () => {
    it('Function Declaration được khởi tạo hoàn chỉnh ngay trong Creation Phase', () => {
      // Có thể gọi hàm trước dòng định nghĩa vì toàn bộ function đã nằm trong VO
      expect(sayHello()).toBe('Hello Antigravity');

      function sayHello() {
        return 'Hello Antigravity';
      }
    });

    it('var được đăng ký trong Creation Phase nhưng chỉ nhận giá trị undefined', () => {
      // Biến myVar đã tồn tại trong VO ở Creation Phase với giá trị undefined
      expect(typeof myVar).toBe('undefined');
      expect(myVar).toBe(undefined);

      var myVar = 100;
      // Đến Execution Phase, giá trị 100 mới được gán
      expect(myVar).toBe(100);
    });

    it('Function Expression với var gây TypeError nếu gọi sớm vì giá trị lúc đó là undefined', () => {
      expect(typeof myFuncExpr).toBe('undefined');

      // myFuncExpr() lúc này tương đương undefined() -> quăng TypeError chứ không phải ReferenceError!
      expect(() => {
        // @ts-ignore
        myFuncExpr();
      }).toThrow(TypeError);

      var myFuncExpr = function () {
        return 'expression';
      };

      expect(myFuncExpr()).toBe('expression');
    });
  });

  describe('2. Độ ưu tiên trong Creation Phase: Function Declaration thắng var trùng tên', () => {
    it('Khi trùng tên, Function Declaration ghi đè khai báo var trong Creation Phase', () => {
      // Trong Creation Phase:
      // 1. Quét function double -> VO có double là Function
      // 2. Quét var double -> VO thấy đã có double, bỏ qua không ghi đè thành undefined!
      expect(typeof double).toBe('function');

      var double = 42;
      // Đến Execution Phase: dòng gán double = 42 thực thi -> double biến thành number
      expect(typeof double).toBe('number');
      expect(double).toBe(42);

      function double(n) {
        return n * 2;
      }
    });
  });

  describe('3. Vòng đời Call Stack & Arguments Object trong Function Execution Context', () => {
    it('Mỗi lần gọi hàm tạo ra một FEC mới với arguments và parameters riêng', () => {
      function calculateSum(a, b) {
        // arguments object được tạo tự động trong Activation Object (AO)
        expect(arguments.length).toBe(2);
        expect(arguments[0]).toBe(10);
        expect(arguments[1]).toBe(20);
        return a + b;
      }

      const result = calculateSum(10, 20);
      expect(result).toBe(30);
    });

    it('Đệ quy sâu vượt quá giới hạn Call Stack gây Stack Overflow (RangeError)', () => {
      function recursiveOverflow(count) {
        return recursiveOverflow(count + 1);
      }

      expect(() => {
        recursiveOverflow(1);
      }).toThrow(RangeError);
    });
  });
});
