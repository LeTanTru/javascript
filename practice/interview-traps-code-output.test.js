import { describe, it, expect } from 'vitest';

/**
 * MODULE 10: TỔNG ÔN & MOCK INTERVIEW THỰC CHIẾN
 * BÀI 36: 50+ BẪY JAVASCRIPT & PHÂN TÍCH CODE OUTPUT (META / GOOGLE / UBER)
 */

describe('Bài 36 - JavaScript Interview Traps & Code Output Mastery', () => {

  // Bẫy 1: Scoping & Function Declaration in Block (ES6+)
  it('1. Bẫy Function Declaration trong Block Scope (Annex B semantics)', () => {
    var a = 1;
    function test() {
      a = 10;
      return;
      function a() {}
    }
    test();
    // Do 'function a() {}' được hoist lên đầu function scope, 'a' trong test() là biến cục bộ (shadowing biến global a)
    // Phép gán 'a = 10' chỉ làm thay đổi biến cục bộ 'a', biến global 'a' vẫn là 1!
    expect(a).toBe(1);
  });

  // Bẫy 2: Array Holes & Sparse Array Iteration
  it('2. Bẫy Sparse Array & Hành vi của các phương thức lặp (map, forEach vs for...in)', () => {
    const arr = [1, 2, , 4]; // array hole tại index 2

    const mapResult = arr.map(x => x * 2);
    // map() bỏ qua empty hole (giữ nguyên hole), không gọi callback cho index 2
    expect(mapResult.length).toBe(4);
    expect(0 in mapResult).toBe(true);
    expect(2 in mapResult).toBe(false); // sparse hole vẫn là hole

    // Object.keys chỉ lấy keys thực sự tồn tại
    expect(Object.keys(arr)).toEqual(['0', '1', '3']);
  });

  // Bẫy 3: Property key coercion & Object keys order
  it('3. Bẫy Object Property Keys (Integer order vs Symbol/String keys)', () => {
    const obj = {};
    const a = { key: 'a' };
    const b = { key: 'b' };

    // Object key khi không phải Symbol sẽ bị ép sang String: "[object Object]"
    obj[a] = 123;
    obj[b] = 456;

    expect(obj[a]).toBe(456); // obj["[object Object]"] bị ghi đè bởi b
    expect(Object.keys(obj).length).toBe(1);

    // Thứ tự duyệt keys theo chuẩn ES6+: Integer indices tăng dần -> Insertion order -> Symbols
    const complexObj = {
      "b": 1,
      "2": "second",
      "1": "first",
      "a": 2
    };
    expect(Object.keys(complexObj)).toEqual(["1", "2", "b", "a"]);
  });

  // Bẫy 4: Class Private Fields (#) vs Closures vs Symbols
  it('4. Bẫy Class Private Fields (#) và Hard Privacy trong ES2022', () => {
    class BankAccount {
      #balance = 1000;

      getBalance() {
        return this.#balance;
      }

      deposit(amount) {
        this.#balance += amount;
      }
    }

    const acc = new BankAccount();
    acc.deposit(500);
    expect(acc.getBalance()).toBe(1500);

    // Private field không thể truy cập qua reflection/getOwnPropertyNames/Symbols
    expect(Object.keys(acc)).toEqual([]);
    expect(Object.getOwnPropertyNames(acc)).toEqual([]);
    expect(Object.getOwnPropertySymbols(acc)).toEqual([]);
    expect(acc.balance).toBeUndefined();
  });

  // Bẫy 5: Implicit Type Coercion with Custom Symbol.toPrimitive & valueOf
  it('5. Bẫy ToPrimitive Priority: Symbol.toPrimitive > valueOf > toString', () => {
    const customObj = {
      valueOf() { return 10; },
      toString() { return '20'; },
      [Symbol.toPrimitive](hint) {
        if (hint === 'number') return 100;
        if (hint === 'string') return 'antigravity';
        return 50; // default hint
      }
    };

    // Phép cộng binary (+) với object gọi ToPrimitive(hint: "default")
    expect(customObj + 10).toBe(60);

    // ToNumber (+) gọi ToPrimitive(hint: "number")
    expect(+customObj).toBe(100);

    // Template string gọi ToPrimitive(hint: "string")
    expect(`${customObj}!`).toBe('antigravity!');
  });

  // Bẫy 6: Event Loop Microtask Starvation & Execution Order
  it('6. Thứ tự thực thi vi nhiệm vụ lồng nhau (Promise Chaining vs Mutation)', async () => {
    const execution = [];

    execution.push('start');

    Promise.resolve()
      .then(() => {
        execution.push('promise-1');
        return Promise.resolve('promise-1-inner');
      })
      .then((res) => {
        execution.push(res);
      });

    Promise.resolve().then(() => {
      execution.push('promise-2');
    });

    execution.push('end');

    await new Promise(r => setTimeout(r, 10));

    expect(execution).toEqual([
      'start',
      'end',
      'promise-1',
      'promise-2',
      'promise-1-inner'
    ]);
  });

  // Bẫy 7: `this` trong Object Method vs Getter vs Constructor Return
  it('7. Bẫy Constructor Return Primitive vs Return Object', () => {
    function Human(name) {
      this.name = name;
      return 'ignored'; // Primitive return bị bỏ qua trong new
    }

    function Monster(name) {
      this.name = name;
      return { beast: true }; // Object return sẽ ghi đè instance mới
    }

    const h = new Human('Tru');
    expect(h.name).toBe('Tru');
    expect(h instanceof Human).toBe(true);

    const m = new Monster('Godzilla');
    expect(m.name).toBeUndefined();
    expect(m.beast).toBe(true);
    expect(m instanceof Monster).toBe(false); // Trả về object mới, phá vỡ instanceof
  });

  // Bẫy 8: Proxy Invariant Violations (Non-configurable Properties)
  it('8. Proxy Invariant: Không thể vi phạm thuộc tính non-configurable/non-writable của target', () => {
    const target = {};
    Object.defineProperty(target, 'id', {
      value: 999,
      writable: false,
      configurable: false
    });

    const proxy = new Proxy(target, {
      get(t, prop) {
        if (prop === 'id') return 888; // Cố tình trả về giá trị khác
        return Reflect.get(t, prop);
      }
    });

    // JavaScript Proxy ném TypeError nếu get trap vi phạm invariant của non-writable non-configurable property
    expect(() => proxy.id).toThrow(TypeError);
  });

});
