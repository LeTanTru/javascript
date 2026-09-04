import { describe, it, expect } from 'vitest';

describe('Bài 07: Lexical Environment, Scope Chain & Bản chất Closures', () => {
  it('1. Lexical Scoping: Phạm vi biến được xác định tại nơi hàm ĐỊNH NGHĨA, không phải nơi hàm ĐƯỢC GỌI', () => {
    const x = 'global';

    function foo() {
      // foo được định nghĩa ở global scope -> outer trỏ về Global Environment Record
      return x;
    }

    function bar() {
      const x = 'local in bar';
      // Gọi foo bên trong bar, nhưng foo vẫn tìm x theo lexical scope (global)
      return foo();
    }

    expect(bar()).toBe('global');
  });

  it('2. Scope Chain & Shadowing: Tìm biến từ trong ra ngoài theo danh sách liên kết Environment Record', () => {
    const a = 1;
    const b = 2;

    function outer() {
      const b = 20; // Shadowing biến b toàn cục
      const c = 30;

      function inner() {
        const c = 300; // Shadowing biến c của outer
        return {
          a, // Tìm tới global: 1
          b, // Tìm tới outer: 20
          c, // Tìm thấy ngay tại local: 300
        };
      }

      return inner();
    }

    expect(outer()).toEqual({ a: 1, b: 20, c: 300 });
  });

  it('3. Closure: Hàm con lưu giữ tham chiếu tới Lexical Environment của cha sau khi cha đã hoàn thành', () => {
    function createCounter(initial = 0) {
      let count = initial; // Biến này nằm trong Lexical Environment của createCounter

      return function increment() {
        count += 1;
        return count;
      };
    }

    const counter = createCounter(10);
    // Tại thời điểm này, createCounter đã kết thúc và pop khỏi Call Stack
    // Nhưng biến count vẫn sống trên Memory Heap nhờ closure increment
    expect(counter()).toBe(11);
    expect(counter()).toBe(12);
    expect(counter()).toBe(13);
  });

  it('4. Tính độc lập của các Lexical Environments: Mỗi lần gọi hàm cha sinh ra một context mới', () => {
    function createBox(val) {
      let value = val;
      return {
        get() { return value; },
        set(newVal) { value = newVal; },
      };
    }

    const boxA = createBox('Apple');
    const boxB = createBox('Banana');

    boxA.set('Avocado');

    expect(boxA.get()).toBe('Avocado');
    // boxB có Lexical Environment riêng biệt, không bị ảnh hưởng
    expect(boxB.get()).toBe('Banana');
  });

  it('5. Shared Lexical Environment: Nhiều closures sinh ra cùng một lần gọi hàm cha chia sẻ chung ô nhớ', () => {
    function createAccount(initialBalance) {
      let balance = initialBalance;

      return {
        deposit(amount) {
          balance += amount;
          return balance;
        },
        withdraw(amount) {
          if (amount > balance) throw new Error('Insufficient funds');
          balance -= amount;
          return balance;
        },
        getBalance() {
          return balance;
        },
      };
    }

    const acc = createAccount(100);
    acc.deposit(50);
    expect(acc.getBalance()).toBe(150);

    acc.withdraw(30);
    expect(acc.getBalance()).toBe(120);
  });

  it('6. Phân giải định danh thất bại (Identifier Resolution) ném ReferenceError', () => {
    function testUnresolvable() {
      // @ts-ignore
      return nonExistentIdentifier + 1;
    }

    expect(() => testUnresolvable()).toThrow(ReferenceError);
  });
});
