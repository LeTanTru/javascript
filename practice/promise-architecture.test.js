import { describe, it, expect } from 'vitest';

// ─── MINIMAL PROMISE IMPLEMENTATION FOR TESTING ────────────────────────────
// Giúp học viên tự mình cài đặt Promise State Machine từ đầu
class TinyPromise {
  #state = 'pending';
  #value = undefined;
  #thenCallbacks = [];
  #catchCallbacks = [];

  constructor(executor) {
    const resolve = (value) => {
      if (this.#state !== 'pending') return;
      this.#state = 'fulfilled';
      this.#value = value;
      // Chạy callbacks theo Microtask (giả lập)
      this.#thenCallbacks.forEach((cb) => queueMicrotask(() => cb(value)));
    };
    const reject = (reason) => {
      if (this.#state !== 'pending') return;
      this.#state = 'rejected';
      this.#value = reason;
      this.#catchCallbacks.forEach((cb) => queueMicrotask(() => cb(reason)));
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new TinyPromise((resolve, reject) => {
      const fulfilledCb = (value) => {
        try {
          if (typeof onFulfilled === 'function') {
            resolve(onFulfilled(value));
          } else {
            resolve(value);
          }
        } catch (err) {
          reject(err);
        }
      };
      const rejectedCb = (reason) => {
        try {
          if (typeof onRejected === 'function') {
            resolve(onRejected(reason));
          } else {
            reject(reason);
          }
        } catch (err) {
          reject(err);
        }
      };

      if (this.#state === 'fulfilled') {
        queueMicrotask(() => fulfilledCb(this.#value));
      } else if (this.#state === 'rejected') {
        queueMicrotask(() => rejectedCb(this.#value));
      } else {
        this.#thenCallbacks.push(fulfilledCb);
        this.#catchCallbacks.push(rejectedCb);
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally();
        return value;
      },
      (reason) => {
        onFinally();
        throw reason;
      }
    );
  }

  get state() {
    return this.#state;
  }
  get value() {
    return this.#value;
  }
}

describe('Module 05 - Bài 18: Promise Architecture (State Machine, .then Chaining & Error Propagation)', () => {
  it('State Machine: Promise có đúng 3 trạng thái, chỉ chuyển 1 chiều và không thể đảo ngược', () => {
    const fulfilled = new TinyPromise((resolve) => resolve(42));
    const rejected = new TinyPromise((_, reject) => reject(new Error('fail')));
    const pending = new TinyPromise(() => {});

    expect(fulfilled.state).toBe('fulfilled');
    expect(fulfilled.value).toBe(42);

    expect(rejected.state).toBe('rejected');
    expect(rejected.value).toBeInstanceOf(Error);

    expect(pending.state).toBe('pending');
  });

  it('.then() trả về Promise mới: chuỗi biến đổi giá trị qua nhiều tầng (Promise Chaining)', async () => {
    const result = await new Promise((resolve) => {
      Promise.resolve(1)
        .then((v) => v + 1) // 2
        .then((v) => v * 3) // 6
        .then((v) => `Kết quả: ${v}`) // "Kết quả: 6"
        .then((v) => resolve(v));
    });

    expect(result).toBe('Kết quả: 6');
  });

  it('.then() với giá trị không phải Promise: Được bọc tự động thành fulfilled Promise', async () => {
    const result = await Promise.resolve('start')
      .then(() => 42)
      .then((v) => v.toString());

    expect(result).toBe('42');
  });

  it('Error Propagation: Lỗi lan truyền qua chuỗi .then() đến handler .catch() đầu tiên', async () => {
    const steps = [];

    const result = await Promise.resolve('ok')
      .then((v) => {
        steps.push('then 1');
        throw new Error('Lỗi ở then 1');
      })
      .then(() => {
        steps.push('then 2 — BỊ BỎ QUA');
      })
      .catch((err) => {
        steps.push('catch');
        return `Đã xử lý: ${err.message}`;
      })
      .then((v) => {
        steps.push('then 3 — Chạy sau catch');
        return v;
      });

    expect(steps).toEqual(['then 1', 'catch', 'then 3 — Chạy sau catch']);
    expect(result).toBe('Đã xử lý: Lỗi ở then 1');
  });

  it('.finally(): Chạy khi fulfilled hoặc rejected nhưng không biến đổi giá trị truyền đi', async () => {
    const logs = [];

    const resultSuccess = await Promise.resolve('value')
      .finally(() => {
        logs.push('finally-success');
      });

    const resultFail = await Promise.reject(new Error('oops'))
      .finally(() => {
        logs.push('finally-fail');
      })
      .catch((err) => `caught: ${err.message}`);

    expect(resultSuccess).toBe('value');
    expect(resultFail).toBe('caught: oops');
    expect(logs).toEqual(['finally-success', 'finally-fail']);
  });

  it('TinyPromise tự cài đặt: .then chaining và error propagation hoạt động chuẩn xác', async () => {
    const result = await new Promise((outerResolve) => {
      new TinyPromise((resolve) => resolve(10))
        .then((v) => v + 5)
        .then((v) => v * 2)
        .catch(() => 'không nên chạy')
        .then((v) => outerResolve(v));
    });

    expect(result).toBe(30);
  });
});
