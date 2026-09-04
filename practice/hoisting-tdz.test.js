import { describe, it, expect } from 'vitest';

describe('Bài 06: Hoisting, Temporal Dead Zone (TDZ) & var vs let vs const', () => {
  describe('1. Temporal Dead Zone (TDZ) & Chứng minh let/const có bị hoisting', () => {
    it('truy cập biến let/const trước dòng khai báo ném ReferenceError do TDZ', () => {
      expect(() => {
        // @ts-ignore
        console.log(myLet);
        let myLet = 10;
      }).toThrow(ReferenceError);
    });

    it('typeof trong TDZ ném ReferenceError (phá vỡ tính an toàn của typeof)', () => {
      // Biến chưa từng khai báo: typeof an toàn trả về "undefined"
      // @ts-ignore
      expect(typeof undeclaredVariable).toBe('undefined');

      // Nhưng biến let đang trong TDZ: typeof ném ReferenceError!
      expect(() => {
        // @ts-ignore
        typeof tdzVar;
        let tdzVar = 'dangerous';
      }).toThrow(ReferenceError);
    });

    it('chứng minh let có bị hoisting qua hiện tượng Shadowing chặn scope cha', () => {
      let x = 'global';

      function testScope() {
        // Nếu let không bị hoisting, dòng dưới sẽ đọc được 'global' từ scope ngoài.
        // Nhưng vì let x bị hoisting và chiếm lĩnh TDZ của block này, nó ném ReferenceError!
        // @ts-ignore
        return x;
        let x = 'local';
      }

      expect(() => testScope()).toThrow(ReferenceError);
    });
  });

  describe('2. Block Scope vs Function Scope & Vòng lặp for', () => {
    it('var rò rỉ ra ngoài block scope {}, còn let/const thì không', () => {
      {
        var blockVar = 'leaked';
        let blockLet = 'confined';
        const blockConst = 'confined';
        expect(blockLet).toBe('confined');
        expect(blockConst).toBe('confined');
      }

      expect(blockVar).toBe('leaked');

      expect(() => {
        // @ts-ignore
        console.log(blockLet);
      }).toThrow(ReferenceError);
    });

    it('vòng lặp for với let tạo ra một lexical environment mới cho mỗi iteration', async () => {
      const results = [];

      for (let i = 0; i < 3; i++) {
        results.push(() => i);
      }

      // Mỗi hàm closure giữ một tham chiếu đến lexical binding của vòng lặp tương ứng
      expect(results[0]()).toBe(0);
      expect(results[1]()).toBe(1);
      expect(results[2]()).toBe(2);
    });

    it('vòng lặp for với var dùng chung 1 biến duy nhất', () => {
      const results = [];

      for (var i = 0; i < 3; i++) {
        results.push(() => i);
      }

      // Tất cả đều trỏ vào cùng 1 biến i trên function/global scope
      expect(results[0]()).toBe(3);
      expect(results[1]()).toBe(3);
      expect(results[2]()).toBe(3);
    });
  });

  describe('3. const immutability & Object.freeze', () => {
    it('const ngăn cản re-assignment nhưng cho phép mutate object bên trong', () => {
      const user = { name: 'Antigravity' };

      // Cho phép mutate thuộc tính
      user.name = 'Senior Dev';
      expect(user.name).toBe('Senior Dev');

      // Nhưng không cho phép gán lại biến
      expect(() => {
        // @ts-ignore
        user = { name: 'Other' };
      }).toThrow(TypeError);
    });
  });
});
