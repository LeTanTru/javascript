import { describe, it, expect, vi } from 'vitest';

// ─── IMPLEMENTATIONS ──────────────────────────────────────────────────────────

/**
 * 1. EventEmitter (Pub/Sub pattern chuẩn Node.js / Browser)
 */
export class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(listener);

    // Trả về Subscription object có phương thức unsubscribe
    return {
      unsubscribe: () => this.off(eventName, listener),
    };
  }

  emit(eventName, ...args) {
    if (!this.events.has(eventName)) {
      return [];
    }
    // Clone mảng listeners để tránh lỗi khi listener tự gỡ bỏ chính nó trong lúc emit
    const listeners = [...this.events.get(eventName)];
    const results = [];
    for (const listener of listeners) {
      results.push(listener.apply(this, args));
    }
    return results;
  }

  off(eventName, listener) {
    if (!this.events.has(eventName)) return this;
    const listeners = this.events.get(eventName);
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    if (listeners.length === 0) {
      this.events.delete(eventName);
    }
    return this;
  }

  once(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    const wrapper = (...args) => {
      this.off(eventName, wrapper);
      return listener.apply(this, args);
    };
    // Lưu tham chiếu gốc để hỗ trợ off(eventName, listener) nếu cần
    wrapper.originalListener = listener;
    return this.on(eventName, wrapper);
  }
}

/**
 * 2. pipe: Kết hợp hàm từ Trái sang Phải (Left-to-Right)
 * pipe(f, g, h)(x) === h(g(f(x)))
 */
export function pipe(...fns) {
  return function (...initialArgs) {
    if (fns.length === 0) return initialArgs[0];
    const [firstFn, ...restFns] = fns;
    return restFns.reduce((acc, fn) => fn(acc), firstFn(...initialArgs));
  };
}

/**
 * 3. compose: Kết hợp hàm từ Phải sang Trái (Right-to-Left - chuẩn Toán học)
 * compose(f, g, h)(x) === f(g(h(x)))
 */
export function compose(...fns) {
  return function (...initialArgs) {
    if (fns.length === 0) return initialArgs[0];
    const reversed = [...fns].reverse();
    const [firstFn, ...restFns] = reversed;
    return restFns.reduce((acc, fn) => fn(acc), firstFn(...initialArgs));
  };
}

/**
 * 4. pipeAsync: Pipeline hỗ trợ các hàm bất đồng bộ (Promise)
 */
export function pipeAsync(...fns) {
  return function (...initialArgs) {
    return fns.reduce(async (accPromise, fn) => {
      const acc = await accPromise;
      return fn(acc);
    }, Promise.resolve(fns.length > 0 && typeof fns[0] === 'function' ? fns[0](...initialArgs) : initialArgs[0]));
  };
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 06 - Bài 25: Live-coding EventEmitter & pipe/compose', () => {
  it('1. EventEmitter .on() và .emit(): Kích hoạt nhiều listeners và truyền đúng tham số', () => {
    const emitter = new EventEmitter();
    const results = [];

    emitter.on('data', (x) => results.push(`Listener1: ${x}`));
    emitter.on('data', (x) => results.push(`Listener2: ${x * 2}`));

    emitter.emit('data', 10);

    expect(results).toEqual(['Listener1: 10', 'Listener2: 20']);
  });

  it('2. EventEmitter .off() và subscription.unsubscribe(): Hủy đăng ký an toàn', () => {
    const emitter = new EventEmitter();
    const spy = vi.fn();

    const sub = emitter.on('click', spy);
    emitter.emit('click');
    expect(spy).toHaveBeenCalledTimes(1);

    sub.unsubscribe();
    emitter.emit('click');
    expect(spy).toHaveBeenCalledTimes(1); // Không tăng thêm
  });

  it('3. EventEmitter .once(): Tự động hủy sau đúng 1 lần phát sự kiện duy nhất', () => {
    const emitter = new EventEmitter();
    const spy = vi.fn();

    emitter.once('login', spy);

    emitter.emit('login', 'UserA');
    emitter.emit('login', 'UserB');
    emitter.emit('login', 'UserC');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('UserA');
  });

  it('4. pipe: Chạy chuỗi hàm từ trái sang phải (Left-to-Right)', () => {
    const add5 = (x) => x + 5;
    const multiply2 = (x) => x * 2;
    const subtract3 = (x) => x - 3;

    // ( (10 + 5) * 2 ) - 3 = (15 * 2) - 3 = 27
    const transform = pipe(add5, multiply2, subtract3);

    expect(transform(10)).toBe(27);
  });

  it('5. compose: Chạy chuỗi hàm từ phải sang trái (Right-to-Left)', () => {
    const add5 = (x) => x + 5;
    const multiply2 = (x) => x * 2;
    const subtract3 = (x) => x - 3;

    // ( (10 - 3) * 2 ) + 5 = (7 * 2) + 5 = 19
    const transform = compose(add5, multiply2, subtract3);

    expect(transform(10)).toBe(19);
  });

  it('6. pipeAsync: Kết hợp pipeline xử lý chuỗi Promise bất đồng bộ', async () => {
    const fetchUser = async (id) => ({ id, name: 'Alice' });
    const addRole = async (user) => ({ ...user, role: 'Admin' });
    const format = (user) => `${user.name} is ${user.role}`;

    const getUserRoleString = pipeAsync(fetchUser, addRole, format);
    const result = await getUserRoleString(1);

    expect(result).toBe('Alice is Admin');
  });
});
