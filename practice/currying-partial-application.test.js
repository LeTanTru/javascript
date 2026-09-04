import { describe, it, expect } from 'vitest';

// ─── IMPLEMENTATIONS ──────────────────────────────────────────────────────────

/**
 * 1. Pure Function vs Impure check helpers
 */
export function pureAdd(a, b) {
  return a + b;
}

export function impureAddWithSideEffect(a, b, stateObj) {
  stateObj.lastSum = a + b; // Side effect: mutating external object
  return a + b;
}

/**
 * 2. Currying: Chuyển đổi hàm f(a, b, c, ...) thành f(a)(b)(c)...
 * Tự động tích lũy tham số cho đến khi đủ số lượng `fn.length`.
 *
 * @param {Function} fn - Hàm gốc cần curry
 * @returns {Function} curriedFn
 */
export function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    }.bind(this);
  };
}

/**
 * 3. Advanced Curry with Placeholder support (như Lodash / Ramda)
 * Cho phép truyền `_` để giữ chỗ cho tham số sau.
 */
export const _ = Symbol('curry_placeholder');

export function curryWithPlaceholder(fn) {
  return function curried(...args) {
    // Đếm số lượng tham số thực tế (không phải placeholder)
    const effectiveArgs = args.filter((arg) => arg !== _);
    const hasPlaceholder = args.slice(0, fn.length).includes(_);

    if (args.length >= fn.length && !hasPlaceholder && effectiveArgs.length >= fn.length) {
      return fn.apply(this, args.slice(0, fn.length));
    }

    return function (...nextArgs) {
      // Merge args hiện tại với nextArgs thay thế vào vị trí placeholder
      let nextIndex = 0;
      const combined = args.map((arg) => (arg === _ && nextIndex < nextArgs.length ? nextArgs[nextIndex++] : arg));
      // Append thêm các arguments còn lại chưa dùng
      while (nextIndex < nextArgs.length) {
        combined.push(nextArgs[nextIndex++]);
      }
      return curried.apply(this, combined);
    };
  };
}

/**
 * 4. Partial Application: Cố định một số đối số trước, trả về hàm nhận phần còn lại.
 *
 * @param {Function} fn - Hàm gốc
 * @param {...any} presetArgs - Các đối số cố định trước
 * @returns {Function} partiallyAppliedFn
 */
export function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    return fn.apply(this, presetArgs.concat(laterArgs));
  };
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 06 - Bài 22: Pure Functions, Currying & Partial Application', () => {
  it('1. Pure Function: Deterministic & không gây tác dụng phụ (no side effects)', () => {
    const state = { count: 0 };
    const result1 = pureAdd(5, 10);
    const result2 = pureAdd(5, 10);

    expect(result1).toBe(15);
    expect(result2).toBe(15);
    expect(state.count).toBe(0); // Không bị thay đổi

    const tracker = { lastSum: 0 };
    impureAddWithSideEffect(3, 4, tracker);
    expect(tracker.lastSum).toBe(7); // Mutated external state
  });

  it('2. Curry cơ bản: Cho phép gọi từng tham số hoặc gộp nhiều tham số', () => {
    function sum3(a, b, c) {
      return a + b + c;
    }

    const curriedSum = curry(sum3);

    expect(curriedSum(1)(2)(3)).toBe(6);
    expect(curriedSum(1, 2)(3)).toBe(6);
    expect(curriedSum(1)(2, 3)).toBe(6);
    expect(curriedSum(1, 2, 3)).toBe(6);
  });

  it('3. Curry bảo toàn context (this binding)', () => {
    const calculator = {
      multiplier: 10,
      compute(a, b, c) {
        return (a + b + c) * this.multiplier;
      },
    };

    calculator.curriedCompute = curry(calculator.compute);

    expect(calculator.curriedCompute(1)(2)(3)).toBe(60);
    expect(calculator.curriedCompute(1, 2)(3)).toBe(60);
  });

  it('4. Advanced Curry với Placeholder (_): Điền tham số linh hoạt theo vị trí', () => {
    function format(greeting, title, name) {
      return `${greeting}, ${title} ${name}!`;
    }

    const curriedFormat = curryWithPlaceholder(format);

    // Giữ chỗ tham số greeting bằng placeholder _
    const sayHelloTo = curriedFormat(_, 'Mr.', 'Tru');
    expect(sayHelloTo('Hello')).toBe('Hello, Mr. Tru!');

    // Giữ chỗ title
    const greetLord = curriedFormat('Welcome', _, 'Wayne');
    expect(greetLord('Lord')).toBe('Welcome, Lord Wayne!');
  });

  it('5. Partial Application: Cố định trước một tập tham số bất kỳ', () => {
    function buildURL(protocol, domain, path) {
      return `${protocol}://${domain}/${path}`;
    }

    const getSecureApi = partial(buildURL, 'https', 'api.example.com');

    expect(getSecureApi('users')).toBe('https://api.example.com/users');
    expect(getSecureApi('products/123')).toBe('https://api.example.com/products/123');
  });

  it('6. Phân biệt Currying vs Partial Application trong thực tế', () => {
    function multiply(a, b, c) {
      return a * b * c;
    }

    // Currying luôn trả về chuỗi hàm unary đến khi đủ arity
    const curriedMult = curry(multiply);
    const step1 = curriedMult(2); // function
    const step2 = step1(3);       // function
    const resultCurry = step2(4); // 24
    expect(resultCurry).toBe(24);

    // Partial cố định 2 tham số đầu, nhận tất cả tham số còn lại trong 1 lần gọi tiếp theo
    const partialMult = partial(multiply, 2, 3);
    const resultPartial = partialMult(4); // 24
    expect(resultPartial).toBe(24);
  });
});
