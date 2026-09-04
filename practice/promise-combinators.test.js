import { describe, it, expect } from 'vitest';

// ─── POLYFILLS: Promise Combinators ──────────────────────────────────────────

function myAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises) || promises.length === 0) {
      return resolve([]);
    }
    const results = new Array(promises.length);
    let remaining = promises.length;
    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        remaining--;
        if (remaining === 0) resolve(results);
      }, reject);
    });
  });
}

function myAllSettled(promises) {
  if (!Array.isArray(promises) || promises.length === 0) {
    return Promise.resolve([]);
  }
  return new Promise((resolve) => {
    const results = new Array(promises.length);
    let remaining = promises.length;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = { status: 'fulfilled', value };
          if (--remaining === 0) resolve(results);
        },
        (reason) => {
          results[i] = { status: 'rejected', reason };
          if (--remaining === 0) resolve(results);
        }
      );
    });
  });
}

function myRace(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return;
    promises.forEach((p) => {
      Promise.resolve(p).then(resolve, reject);
    });
  });
}

function myAny(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises) || promises.length === 0) {
      return reject(new AggregateError([], 'All promises were rejected'));
    }
    const errors = new Array(promises.length);
    let rejectedCount = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(resolve, (reason) => {
        errors[i] = reason;
        rejectedCount++;
        if (rejectedCount === promises.length) {
          reject(new AggregateError(errors, 'All promises were rejected'));
        }
      });
    });
  });
}

function myWithResolvers() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 05 - Bài 19: Promise Combinators Polyfills (all, allSettled, race, any, withResolvers)', () => {
  it('myAll: Resolve khi tất cả fulfilled, giữ nguyên thứ tự kết quả theo chỉ số', async () => {
    const results = await myAll([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ]);
    expect(results).toEqual([1, 2, 3]);
  });

  it('myAll: Reject ngay khi bất kỳ 1 Promise nào bị rejected, trả về lý do đó', async () => {
    await expect(
      myAll([
        Promise.resolve('ok'),
        Promise.reject(new Error('fail!')),
        Promise.resolve('ok2'),
      ])
    ).rejects.toThrow('fail!');
  });

  it('myAllSettled: Luôn resolve với danh sách kết quả hỗn hợp (fulfilled + rejected)', async () => {
    const results = await myAllSettled([
      Promise.resolve('success'),
      Promise.reject(new Error('error')),
      Promise.resolve(42),
    ]);

    expect(results[0]).toEqual({ status: 'fulfilled', value: 'success' });
    expect(results[1].status).toBe('rejected');
    expect(results[1].reason).toBeInstanceOf(Error);
    expect(results[2]).toEqual({ status: 'fulfilled', value: 42 });
  });

  it('myRace: Resolve/Reject theo Promise nào settle đầu tiên', async () => {
    const fast = new Promise((r) => setTimeout(() => r('fast'), 10));
    const slow = new Promise((r) => setTimeout(() => r('slow'), 100));

    const winner = await myRace([slow, fast]);
    expect(winner).toBe('fast');

    // Race với reject: Promise reject đầu tiên sẽ là kết quả
    await expect(
      myRace([
        new Promise((_, r) => setTimeout(() => r(new Error('quick fail')), 5)),
        new Promise((res) => setTimeout(() => res('too slow'), 500)),
      ])
    ).rejects.toThrow('quick fail');
  });

  it('myAny: Resolve theo Promise fulfilled đầu tiên, bỏ qua các rejection trước đó', async () => {
    const result = await myAny([
      Promise.reject(new Error('err1')),
      Promise.resolve('first success'),
      Promise.resolve('second success'),
    ]);
    expect(result).toBe('first success');
  });

  it('myAny: Reject với AggregateError khi TẤT CẢ bị rejected', async () => {
    await expect(
      myAny([
        Promise.reject(new Error('e1')),
        Promise.reject(new Error('e2')),
      ])
    ).rejects.toBeInstanceOf(AggregateError);
  });

  it('myWithResolvers: Tách biệt promise và hàm resolve/reject ra ngoài (Deferred Pattern)', async () => {
    const { promise, resolve, reject } = myWithResolvers();

    // Giả lập resolve sau 10ms
    setTimeout(() => resolve('resolved from outside'), 10);

    const result = await promise;
    expect(result).toBe('resolved from outside');

    // Test reject path
    const { promise: p2, reject: r2 } = myWithResolvers();
    setTimeout(() => r2(new Error('rejected from outside')), 5);
    await expect(p2).rejects.toThrow('rejected from outside');
  });
});
