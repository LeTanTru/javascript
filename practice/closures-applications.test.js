import { describe, it, expect, vi } from 'vitest';

describe('Bài 08: Ứng dụng Closures: Module Pattern, Private State & Memory Leaks Hunting', () => {
  it('1. Revealing Module Pattern: Đóng gói Private State an toàn, không thể can thiệp từ bên ngoài', () => {
    function createBankVault(initialCash) {
      // Private variable - nằm trong Lexical Environment của createBankVault
      let cash = initialCash;
      const transactions = [];

      function logTransaction(type, amount) {
        transactions.push({ type, amount, time: Date.now() });
      }

      // Public API (Revealing Module)
      return {
        deposit(amount) {
          if (amount <= 0) throw new Error('Invalid deposit amount');
          cash += amount;
          logTransaction('DEPOSIT', amount);
          return cash;
        },
        withdraw(amount) {
          if (amount > cash) throw new Error('Insufficient funds');
          cash -= amount;
          logTransaction('WITHDRAW', amount);
          return cash;
        },
        getBalance() {
          return cash;
        },
        getTransactionCount() {
          return transactions.length;
        },
      };
    }

    const vault = createBankVault(1000);

    // Kiểm tra không thể truy cập trực tiếp private variables
    // @ts-ignore
    expect(vault.cash).toBeUndefined();
    // @ts-ignore
    expect(vault.transactions).toBeUndefined();

    // Thao tác qua public API
    expect(vault.deposit(500)).toBe(1500);
    expect(vault.withdraw(200)).toBe(1300);
    expect(vault.getBalance()).toBe(1300);
    expect(vault.getTransactionCount()).toBe(2);
  });

  it('2. Currying & Partial Application: Sử dụng closures để cấu hình trước tham số hàm', () => {
    // Hàm curry bậc 3
    function currySum(a) {
      return function (b) {
        return function (c) {
          return a + b + c;
        };
      };
    }

    const add10 = currySum(10);
    const add10And20 = add10(20);

    expect(add10And20(30)).toBe(60);
    expect(currySum(1)(2)(3)).toBe(6);

    // Ứng dụng logger prefix với Partial Application
    function createLogger(prefix) {
      return function (message) {
        return `[${prefix}] ${message}`;
      };
    }

    const errorLogger = createLogger('ERROR');
    const warnLogger = createLogger('WARN');

    expect(errorLogger('Network connection failed')).toBe('[ERROR] Network connection failed');
    expect(warnLogger('Disk space low')).toBe('[WARN] Disk space low');
  });

  it('3. Memoization Cache: Lưu kết quả tính toán đắt đỏ trong closure scope', () => {
    function memoize(fn) {
      const cache = new Map(); // Nằm trong closure scope

      return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
          return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
      };
    }

    const expensiveCalculation = vi.fn((n) => n * 2);
    const memoizedCalc = memoize(expensiveCalculation);

    expect(memoizedCalc(5)).toBe(10);
    expect(memoizedCalc(5)).toBe(10);
    expect(memoizedCalc(5)).toBe(10);

    // Hàm đắt đỏ chỉ được thực thi đúng 1 lần duy nhất cho cùng tham số
    expect(expensiveCalculation).toHaveBeenCalledTimes(1);

    expect(memoizedCalc(10)).toBe(20);
    expect(expensiveCalculation).toHaveBeenCalledTimes(2);
  });

  it('4. Safe Subscription Cleanup: Trả về hàm unsubscribe để giải phóng closure tránh Memory Leak', () => {
    function createObservable() {
      let listeners = [];

      return {
        subscribe(fn) {
          listeners.push(fn);
          // Trả về hàm cleanup đóng gói đúng hàm listener cần xóa
          return function unsubscribe() {
            listeners = listeners.filter((item) => item !== fn);
          };
        },
        notify(data) {
          listeners.forEach((fn) => fn(data));
        },
        getListenerCount() {
          return listeners.length;
        },
      };
    }

    const observable = createObservable();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const unsubscribe1 = observable.subscribe(handler1);
    const unsubscribe2 = observable.subscribe(handler2);

    expect(observable.getListenerCount()).toBe(2);

    observable.notify('Event 1');
    expect(handler1).toHaveBeenCalledWith('Event 1');
    expect(handler2).toHaveBeenCalledWith('Event 1');

    // Hủy đăng ký handler1 -> giải phóng tham chiếu
    unsubscribe1();
    expect(observable.getListenerCount()).toBe(1);

    observable.notify('Event 2');
    expect(handler1).toHaveBeenCalledTimes(1); // Không nhận thêm
    expect(handler2).toHaveBeenCalledTimes(2); // Vẫn nhận bình thường

    unsubscribe2();
    expect(observable.getListenerCount()).toBe(0);
  });

  it('5. Shared Scope Context: Nhiều closures trong cùng scope chia sẻ chung một Context Object', () => {
    function createSharedScope() {
      let sharedState = 0;

      function getter() {
        return sharedState;
      }

      function setter(newVal) {
        sharedState = newVal;
      }

      return { getter, setter };
    }

    const instance = createSharedScope();
    expect(instance.getter()).toBe(0);

    instance.setter(42);
    expect(instance.getter()).toBe(42);
  });
});
