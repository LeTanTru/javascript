import { describe, it, expect, vi } from 'vitest';

// ─── CONCURRENCY LIMITER IMPLEMENTATION ────────────────────────────────────
/**
 * Tạo một Concurrency Limiter giới hạn tối đa `concurrency` tasks chạy đồng thời.
 * Các tasks vượt quá giới hạn sẽ được xếp vào Queue và tự động kích hoạt
 * khi có slot trống (1 task hoàn thành).
 *
 * @param {number} concurrency - Số tasks tối đa chạy đồng thời
 * @returns {Function} limitedFn - Nhận task factory, trả về Promise kết quả
 */
function createConcurrencyLimiter(concurrency) {
  const queue = [];       // Hàng đợi các tasks chưa được chạy
  let activeCount = 0;    // Số tasks đang chạy hiện tại

  const next = () => {
    // Nếu queue rỗng hoặc đã đạt giới hạn, không làm gì
    if (queue.length === 0 || activeCount >= concurrency) return;

    activeCount++;
    const { taskFactory, resolve, reject } = queue.shift();

    Promise.resolve(taskFactory())
      .then(resolve, reject)
      .finally(() => {
        activeCount--;
        next(); // Kích hoạt task kế tiếp trong queue
      });
  };

  return function limit(taskFactory) {
    return new Promise((resolve, reject) => {
      queue.push({ taskFactory, resolve, reject });
      next();
    });
  };
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 05 - Bài 21: Async Pool / Concurrency Limiter (p-limit / Task Queue)', () => {
  it('Không vượt quá giới hạn: Tối đa N tasks chạy đồng thời tại bất kỳ thời điểm nào', async () => {
    const limit = createConcurrencyLimiter(2);
    let maxConcurrent = 0;
    let currentConcurrent = 0;

    const makeTask = (delay) => () =>
      new Promise((resolve) => {
        currentConcurrent++;
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
        setTimeout(() => {
          currentConcurrent--;
          resolve(delay);
        }, delay);
      });

    await Promise.all([
      limit(makeTask(50)),
      limit(makeTask(30)),
      limit(makeTask(20)),
      limit(makeTask(10)),
    ]);

    // Tối đa 2 tasks chạy đồng thời tại bất kỳ thời điểm nào
    expect(maxConcurrent).toBeLessThanOrEqual(2);
  });

  it('Duy trì kết quả đúng thứ tự và đầy đủ: Tất cả tasks đều hoàn thành với giá trị chính xác', async () => {
    const limit = createConcurrencyLimiter(3);
    const inputs = [1, 2, 3, 4, 5, 6];

    const results = await Promise.all(
      inputs.map((n) => limit(() => Promise.resolve(n * n)))
    );

    expect(results).toEqual([1, 4, 9, 16, 25, 36]);
  });

  it('Error propagation: Lỗi từ task không làm hỏng toàn bộ pool, các tasks khác vẫn chạy', async () => {
    const limit = createConcurrencyLimiter(2);
    const results = [];

    const tasks = [
      limit(() => Promise.resolve('ok1')).then((v) => results.push(v)),
      limit(() => Promise.reject(new Error('task2 failed'))).catch((e) =>
        results.push(`caught: ${e.message}`)
      ),
      limit(() => Promise.resolve('ok3')).then((v) => results.push(v)),
    ];

    await Promise.all(tasks);

    expect(results).toContain('ok1');
    expect(results).toContain('caught: task2 failed');
    expect(results).toContain('ok3');
  });

  it('FIFO Queue: Tasks được thực thi theo thứ tự vào queue', async () => {
    const limit = createConcurrencyLimiter(1); // Concurrency 1 → tuần tự
    const executionOrder = [];

    await Promise.all([
      limit(async () => { executionOrder.push(1); await new Promise((r) => setTimeout(r, 20)); }),
      limit(async () => { executionOrder.push(2); await new Promise((r) => setTimeout(r, 10)); }),
      limit(async () => { executionOrder.push(3); }),
    ]);

    expect(executionOrder).toEqual([1, 2, 3]);
  });

  it('Sliding Window: Khi 1 task hoàn thành, task tiếp theo được bốc ngay lập tức', async () => {
    const limit = createConcurrencyLimiter(2);
    const timeline = [];

    const makeTimedTask = (id, delay) => () =>
      new Promise((resolve) => {
        timeline.push(`start:${id}`);
        setTimeout(() => {
          timeline.push(`end:${id}`);
          resolve(id);
        }, delay);
      });

    // T0: tasks A, B bắt đầu (slot đầy)
    // T50: A kết thúc → C bắt đầu ngay (sliding window)
    // T100: B kết thúc → D bắt đầu
    await Promise.all([
      limit(makeTimedTask('A', 50)),
      limit(makeTimedTask('B', 100)),
      limit(makeTimedTask('C', 30)),
      limit(makeTimedTask('D', 20)),
    ]);

    // A và B phải bắt đầu ngay (2 slots)
    expect(timeline[0]).toBe('start:A');
    expect(timeline[1]).toBe('start:B');
    // C bắt đầu sau khi A kết thúc
    const endAIdx = timeline.indexOf('end:A');
    const startCIdx = timeline.indexOf('start:C');
    expect(startCIdx).toBeGreaterThan(endAIdx - 1);
  });

  it('Xây dựng asyncPool: Giới hạn concurrency khi xử lý danh sách items với async mapper', async () => {
    async function asyncPool(items, concurrency, mapper) {
      const limit = createConcurrencyLimiter(concurrency);
      return Promise.all(items.map((item) => limit(() => mapper(item))));
    }

    const items = [1, 2, 3, 4, 5, 6, 7, 8];
    let maxActive = 0;
    let active = 0;

    const results = await asyncPool(items, 3, async (n) => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 10));
      active--;
      return n * 2;
    });

    expect(results).toEqual([2, 4, 6, 8, 10, 12, 14, 16]);
    expect(maxActive).toBeLessThanOrEqual(3);
  });
});
