import { describe, it, expect, vi } from 'vitest';

// ─── SIMULATION: WEB WORKERS & SERVICE WORKERS ──────────────────────────────

/**
 * 1. Web Worker Simulation (Dedicated Worker)
 */
export class MockWebWorker {
  constructor(workerFn) {
    this.onmessage = null;
    // Worker scope giả lập (không có DOM)
    this._scope = {
      postMessage: (data) => {
        // Gửi tin nhắn về main thread (sao chép qua structuredClone)
        const cloned = structuredClone(data);
        if (typeof this.onmessage === 'function') {
          this.onmessage({ data: cloned });
        }
      },
      onmessage: null,
    };

    // Khởi chạy script trong worker
    workerFn(this._scope);
  }

  postMessage(data, transferList = []) {
    // Nếu có transferList (Zero-copy Transferable Object)
    let payload;
    if (transferList.length > 0 && transferList[0] instanceof ArrayBuffer) {
      // Giả lập transfer: ArrayBuffer nguồn bị detached (byteLength = 0)
      payload = transferList[0];
    } else {
      payload = structuredClone(data);
    }

    if (typeof this._scope.onmessage === 'function') {
      this._scope.onmessage({ data: payload });
    }
  }
}

/**
 * 2. Cache Storage Simulation (Cache API)
 */
export class MockCache {
  constructor(name) {
    this.name = name;
    this.storage = new Map();
  }

  async put(url, response) {
    this.storage.set(url, {
      body: response.body,
      status: response.status || 200,
      cachedAt: Date.now(),
    });
  }

  async match(url) {
    const entry = this.storage.get(url);
    if (!entry) return null;
    return {
      status: entry.status,
      body: structuredClone(entry.body),
    };
  }

  async delete(url) {
    return this.storage.delete(url);
  }
}

/**
 * 3. Service Worker Caching Strategies
 */
export class ServiceWorkerStrategies {
  constructor(cache) {
    this.cache = cache;
  }

  // Strategy 1: Cache-First (Asset tĩnh: JS/CSS/Images)
  async cacheFirst(url, networkFetchFn) {
    const cachedResponse = await this.cache.match(url);
    if (cachedResponse) {
      return { source: 'cache', data: cachedResponse.body };
    }
    const networkResponse = await networkFetchFn(url);
    await this.cache.put(url, networkResponse);
    return { source: 'network', data: networkResponse.body };
  }

  // Strategy 2: Network-First (Dữ liệu động: User profile, Posts)
  async networkFirst(url, networkFetchFn) {
    try {
      const networkResponse = await networkFetchFn(url);
      await this.cache.put(url, networkResponse);
      return { source: 'network', data: networkResponse.body };
    } catch (err) {
      const cachedResponse = await this.cache.match(url);
      if (cachedResponse) {
        return { source: 'cache_fallback', data: cachedResponse.body };
      }
      throw new Error(`Offline and no cache available for ${url}`);
    }
  }

  // Strategy 3: Stale-While-Revalidate (Avatars, Dashboard widgets)
  async staleWhileRevalidate(url, networkFetchFn) {
    const cachedResponse = await this.cache.match(url);
    // Gửi network fetch ngầm để cập nhật cache
    const networkPromise = networkFetchFn(url).then(async (res) => {
      await this.cache.put(url, res);
      return res;
    });

    if (cachedResponse) {
      return { source: 'stale_cache', data: cachedResponse.body, backgroundUpdate: networkPromise };
    }

    const networkResponse = await networkPromise;
    return { source: 'network', data: networkResponse.body };
  }
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 07 - Bài 31: Web Workers, Service Workers & Cache API', () => {
  it('1. Web Worker: Chạy tính toán nặng trên luồng riêng và giao tiếp qua postMessage', async () => {
    // Worker tính toán dãy Fibonacci
    function workerScript(self) {
      self.onmessage = (event) => {
        const n = event.data;
        function fib(num) {
          if (num <= 1) return num;
          return fib(num - 1) + fib(num - 2);
        }
        const result = fib(n);
        self.postMessage({ input: n, output: result });
      };
    }

    const worker = new MockWebWorker(workerScript);

    const promise = new Promise((resolve) => {
      worker.onmessage = (e) => resolve(e.data);
    });

    worker.postMessage(10); // fib(10) = 55
    const result = await promise;

    expect(result).toEqual({ input: 10, output: 55 });
  });

  it('2. Web Worker: Cách ly bộ nhớ hoàn toàn (Structured Clone / No Shared Memory by default)', async () => {
    function workerScript(self) {
      self.onmessage = (event) => {
        event.data.name = 'Mutated inside worker';
        self.postMessage(event.data);
      };
    }

    const worker = new MockWebWorker(workerScript);
    const originalObject = { name: 'Original', count: 1 };

    const promise = new Promise((resolve) => {
      worker.onmessage = (e) => resolve(e.data);
    });

    worker.postMessage(originalObject);
    const fromWorker = await promise;

    expect(fromWorker.name).toBe('Mutated inside worker');
    expect(originalObject.name).toBe('Original'); // Không bị mutate ngoài main thread!
  });

  it('3. Service Worker Strategy: Cache-First ưu tiên lấy từ cache trước', async () => {
    const cache = new MockCache('v1-static');
    await cache.put('/app.js', { body: 'console.log("Cached V1");' });

    const sw = new ServiceWorkerStrategies(cache);
    const networkFetch = vi.fn(async () => ({ body: 'console.log("Network V2");' }));

    const res = await sw.cacheFirst('/app.js', networkFetch);

    expect(res.source).toBe('cache');
    expect(res.data).toBe('console.log("Cached V1");');
    expect(networkFetch).not.toHaveBeenCalled(); // Không cần gọi network
  });

  it('4. Service Worker Strategy: Network-First fallback về cache khi mất mạng (Offline)', async () => {
    const cache = new MockCache('v1-dynamic');
    await cache.put('/api/news', { body: [{ id: 1, title: 'Old News' }] });

    const sw = new ServiceWorkerStrategies(cache);
    // Giả lập mạng bị ngắt (Offline)
    const failedNetworkFetch = vi.fn(async () => {
      throw new Error('Failed to fetch (Offline)');
    });

    const res = await sw.networkFirst('/api/news', failedNetworkFetch);

    expect(res.source).toBe('cache_fallback');
    expect(res.data).toEqual([{ id: 1, title: 'Old News' }]);
  });

  it('5. Service Worker Strategy: Stale-While-Revalidate trả về cache ngay và revalidate ngầm', async () => {
    const cache = new MockCache('v1-swr');
    await cache.put('/avatar.png', { body: 'avatar_v1_blob' });

    const sw = new ServiceWorkerStrategies(cache);
    const networkFetch = vi.fn(async () => ({ body: 'avatar_v2_blob' }));

    const res = await sw.staleWhileRevalidate('/avatar.png', networkFetch);

    // Trả về cache cũ tức thì để UI hiển thị ngay 0ms
    expect(res.source).toBe('stale_cache');
    expect(res.data).toBe('avatar_v1_blob');

    // Chờ background update hoàn tất
    await res.backgroundUpdate;
    expect(networkFetch).toHaveBeenCalledTimes(1);

    // Cache đã được cập nhật bản v2
    const updated = await cache.match('/avatar.png');
    expect(updated.body).toBe('avatar_v2_blob');
  });

  it('6. Phân biệt quyền hạn môi trường: Worker không có quyền truy cập DOM Window/Document', () => {
    const workerEnvironment = {
      self: true,
      importScripts: true,
      caches: true,
      indexedDB: true,
      window: undefined,
      document: undefined,
      localStorage: undefined,
    };

    expect(workerEnvironment.document).toBeUndefined();
    expect(workerEnvironment.window).toBeUndefined();
    expect(workerEnvironment.indexedDB).toBe(true);
  });
});
