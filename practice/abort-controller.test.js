import { describe, it, expect, vi } from 'vitest';

describe('Module 05 - Bài 20: AbortController & AbortSignal (Hủy request, Race Conditions, Stale Responses)', () => {
  it('AbortController API: signal.aborted phản ánh trạng thái abort chính xác', () => {
    const controller = new AbortController();
    const { signal } = controller;

    expect(signal.aborted).toBe(false);
    expect(signal.reason).toBeUndefined();

    controller.abort('User cancelled');

    expect(signal.aborted).toBe(true);
    expect(signal.reason).toBe('User cancelled');
  });

  it('signal.addEventListener("abort"): Lắng nghe sự kiện hủy và dọn dẹp resources', async () => {
    const controller = new AbortController();
    const { signal } = controller;
    const log = [];

    signal.addEventListener('abort', () => {
      log.push(`Aborted: ${signal.reason}`);
    });

    controller.abort('Request timeout');

    // Microtask cho event handler có thể chạy
    await new Promise((r) => queueMicrotask(r));

    expect(log).toEqual(['Aborted: Request timeout']);
  });

  it('Mô phỏng fetch có thể hủy: Race giữa timeout và fetch thực', async () => {
    async function fetchWithTimeout(url, timeout) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort('Timeout'), timeout);

      try {
        // Giả lập fetch (trả về sau delay)
        const result = await new Promise((resolve, reject) => {
          const requestTime = 50; // ms giả lập thời gian fetch
          const timerId = setTimeout(() => resolve(`Data from ${url}`), requestTime);

          controller.signal.addEventListener('abort', () => {
            clearTimeout(timerId);
            reject(new DOMException(controller.signal.reason, 'AbortError'));
          });
        });
        clearTimeout(timeoutId);
        return result;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    }

    // Test 1: Fetch hoàn thành trước timeout
    const result = await fetchWithTimeout('https://api.example.com', 200);
    expect(result).toBe('Data from https://api.example.com');

    // Test 2: Timeout xảy ra trước khi fetch hoàn thành
    await expect(fetchWithTimeout('https://slow.api.com', 10)).rejects.toThrow('Timeout');
  });

  it('Race Condition Prevention: AbortController xử lý đúng tình huống nhiều request chồng chéo', async () => {
    let activeController = null;
    const fetchLog = [];

    async function searchWithAbort(query) {
      // Hủy request cũ nếu đang chạy
      if (activeController) {
        activeController.abort('Superseded by newer request');
      }
      activeController = new AbortController();
      const myController = activeController;

      return new Promise((resolve, reject) => {
        const delay = query === 'slow' ? 100 : 20;
        const timerId = setTimeout(() => {
          if (!myController.signal.aborted) {
            fetchLog.push(`Completed: ${query}`);
            resolve(query);
          }
        }, delay);

        myController.signal.addEventListener('abort', () => {
          clearTimeout(timerId);
          fetchLog.push(`Aborted: ${query} (${myController.signal.reason})`);
          reject(new DOMException(myController.signal.reason, 'AbortError'));
        });
      });
    }

    // Gửi "slow" trước, ngay sau đó gửi "fast"
    const slowPromise = searchWithAbort('slow').catch((e) => `caught: ${e.message}`);
    const fastPromise = searchWithAbort('fast');

    const [slowResult, fastResult] = await Promise.all([slowPromise, fastPromise]);

    expect(slowResult).toBe('caught: Superseded by newer request');
    expect(fastResult).toBe('fast');
    expect(fetchLog).toContain('Aborted: slow (Superseded by newer request)');
    expect(fetchLog).toContain('Completed: fast');
  });

  it('AbortSignal.timeout() static factory: Tạo signal tự abort sau đúng N milliseconds', async () => {
    // AbortSignal.timeout() là static factory, trả về signal tự abort sau N ms
    const signal = AbortSignal.timeout(50);

    expect(signal.aborted).toBe(false);

    // Chờ hơn timeout
    await new Promise((r) => setTimeout(r, 80));

    expect(signal.aborted).toBe(true);
  });

  it('AbortSignal.any(): Kết hợp nhiều signals, abort khi bất kỳ nguồn nào kích hoạt', () => {
    const c1 = new AbortController();
    const c2 = new AbortController();

    const combinedSignal = AbortSignal.any([c1.signal, c2.signal]);

    expect(combinedSignal.aborted).toBe(false);

    c1.abort('First cancelled');

    expect(combinedSignal.aborted).toBe(true);
    expect(combinedSignal.reason).toBe('First cancelled');
  });
});
