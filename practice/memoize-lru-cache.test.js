import { describe, it, expect, vi } from 'vitest';

// ─── IMPLEMENTATIONS ──────────────────────────────────────────────────────────

/**
 * 1. Memoize: Ghi nhớ kết quả hàm thuần khiết
 * @param {Function} fn - Hàm cần memoize
 * @param {Function} [resolver] - Hàm tùy biến tạo cache key từ arguments
 * @returns {Function} memoizedFn
 */
export function memoize(fn, resolver) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }

  const memoized = function (...args) {
    const key = typeof resolver === 'function' ? resolver.apply(this, args) : JSON.stringify(args);
    const cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };

  memoized.cache = new Map();
  return memoized;
}

/**
 * 2. LRU Cache (Least Recently Used)
 * Đảm bảo độ phức tạp thời gian O(1) cho cả get(key) và put(key, value).
 * Tận dụng đặc tính bảo toàn thứ tự chèn (Insertion Order) của JavaScript Map.
 */
export class LRUCache {
  constructor(capacity) {
    if (capacity <= 0) throw new Error('Capacity must be positive');
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    // Lấy giá trị, xóa và chèn lại để đẩy lên vị trí Most Recently Used (cuối Map)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Xóa phần tử đầu tiên (Least Recently Used)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  get size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
  }
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 06 - Bài 26: Live-coding Memoize function & LRU Cache', () => {
  it('1. Memoize cơ bản: Chỉ tính toán 1 lần cho cùng tập tham số', () => {
    const expensiveCalculation = vi.fn((a, b) => a + b);
    const memoizedCalc = memoize(expensiveCalculation);

    expect(memoizedCalc(2, 3)).toBe(5);
    expect(memoizedCalc(2, 3)).toBe(5);
    expect(memoizedCalc(2, 3)).toBe(5);

    expect(expensiveCalculation).toHaveBeenCalledTimes(1);

    expect(memoizedCalc(4, 5)).toBe(9);
    expect(expensiveCalculation).toHaveBeenCalledTimes(2);
  });

  it('2. Memoize với Custom Resolver: Tự biến đổi cache key', () => {
    const fetchUser = vi.fn((user) => `User: ${user.id}`);
    // Chỉ dùng user.id làm cache key
    const memoizedUser = memoize(fetchUser, (u) => u.id);

    const user1 = { id: 101, name: 'Alice', timestamp: 1000 };
    const user2 = { id: 101, name: 'Alice Updated', timestamp: 2000 };

    expect(memoizedUser(user1)).toBe('User: 101');
    expect(memoizedUser(user2)).toBe('User: 101'); // Trả về từ cache vì trùng id

    expect(fetchUser).toHaveBeenCalledTimes(1);
  });

  it('3. Memoize .cache manipulation: Cho phép xóa hoặc clear cache chủ động', () => {
    const fn = vi.fn((x) => x * 10);
    const memoized = memoize(fn);

    memoized(5);
    expect(memoized.cache.size).toBe(1);

    memoized.cache.clear();
    expect(memoized.cache.size).toBe(0);

    memoized(5);
    expect(fn).toHaveBeenCalledTimes(2); // Tính lại vì vừa clear cache
  });

  it('4. LRU Cache: get() và put() cơ bản trong giới hạn capacity', () => {
    const lru = new LRUCache(2);

    lru.put('a', 1);
    lru.put('b', 2);

    expect(lru.get('a')).toBe(1);
    expect(lru.get('b')).toBe(2);
    expect(lru.get('c')).toBeUndefined();
  });

  it('5. LRU Cache Eviction: Tự động loại bỏ phần tử cũ nhất (LRU) khi vượt capacity', () => {
    const lru = new LRUCache(2);

    lru.put('a', 1);
    lru.put('b', 2);

    // Truy cập 'a' -> 'a' thành Most Recently Used, 'b' thành Least Recently Used
    expect(lru.get('a')).toBe(1);

    // Thêm 'c' -> dung lượng vượt 2 -> 'b' bị đẩy ra ngoài
    lru.put('c', 3);

    expect(lru.get('a')).toBe(1);
    expect(lru.get('b')).toBeUndefined(); // 'b' đã bị evicted
    expect(lru.get('c')).toBe(3);
  });

  it('6. LRU Cache: Cập nhật key đã tồn tại sẽ refresh vị trí lên Most Recently Used', () => {
    const lru = new LRUCache(2);

    lru.put('x', 10);
    lru.put('y', 20);

    // Cập nhật lại 'x' -> 'x' thành MRU, 'y' thành LRU
    lru.put('x', 100);

    // Thêm 'z' -> 'y' bị loại bỏ
    lru.put('z', 30);

    expect(lru.get('x')).toBe(100);
    expect(lru.get('y')).toBeUndefined();
    expect(lru.get('z')).toBe(30);
  });
});
