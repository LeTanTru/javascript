import { describe, it, expect, vi } from 'vitest';

/**
 * MODULE 10: TỔNG ÔN & MOCK INTERVIEW THỰC CHIẾN
 * BÀI 37: GIẢ LẬP LIVE-CODING 3 BÀI TOÁN SENIOR / LEAD
 * 1. Priority Async Scheduler with Concurrency Limit
 * 2. Deep Object Diff & Patch Engine
 * 3. Mini Signal / Fine-grained Reactive System (Effect + Dependency Tracking)
 */

// ==========================================
// 1. PRIORITY ASYNC TASK SCHEDULER
// ==========================================
export class PriorityScheduler {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.runningCount = 0;
    this.queue = []; // Array of { task, priority, resolve, reject }
  }

  add(task, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, priority, resolve, reject });
      // Sắp xếp queue theo độ ưu tiên giảm dần (Priority cao thực thi trước)
      this.queue.sort((a, b) => b.priority - a.priority);
      this._runNext();
    });
  }

  async _runNext() {
    if (this.runningCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const { task, resolve, reject } = this.queue.shift();
    this.runningCount++;

    try {
      const result = await task();
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      this.runningCount--;
      this._runNext();
    }
  }
}

// ==========================================
// 2. DEEP OBJECT DIFF & PATCH ENGINE
// ==========================================
export function deepDiff(oldObj, newObj) {
  const diff = { added: {}, updated: {}, deleted: [] };

  function isObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }

  // Tìm keys bị xóa hoặc thay đổi
  for (const key of Object.keys(oldObj)) {
    if (!(key in newObj)) {
      diff.deleted.push(key);
    } else if (isObject(oldObj[key]) && isObject(newObj[key])) {
      const nestedDiff = deepDiff(oldObj[key], newObj[key]);
      if (Object.keys(nestedDiff.added).length || Object.keys(nestedDiff.updated).length || nestedDiff.deleted.length) {
        diff.updated[key] = nestedDiff;
      }
    } else if (oldObj[key] !== newObj[key]) {
      diff.updated[key] = { from: oldObj[key], to: newObj[key] };
    }
  }

  // Tìm keys mới được thêm vào
  for (const key of Object.keys(newObj)) {
    if (!(key in oldObj)) {
      diff.added[key] = newObj[key];
    }
  }

  return diff;
}

export function applyPatch(target, patch) {
  const result = Array.isArray(target) ? [...target] : { ...target };

  // Xóa keys
  for (const key of patch.deleted || []) {
    delete result[key];
  }

  // Thêm keys mới
  for (const [key, val] of Object.entries(patch.added || {})) {
    result[key] = val;
  }

  // Cập nhật keys
  for (const [key, updateVal] of Object.entries(patch.updated || {})) {
    if (updateVal && typeof updateVal === 'object' && ('from' in updateVal || 'to' in updateVal)) {
      result[key] = updateVal.to;
    } else if (updateVal && typeof updateVal === 'object') {
      result[key] = applyPatch(result[key] || {}, updateVal);
    }
  }

  return result;
}

// ==========================================
// 3. FINE-GRAINED REACTIVE SIGNAL SYSTEM
// ==========================================
let activeEffect = null;

export function createSignal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  function read() {
    if (activeEffect) {
      subscribers.add(activeEffect);
    }
    return value;
  }

  function write(newValue) {
    const next = typeof newValue === 'function' ? newValue(value) : newValue;
    if (next !== value) {
      value = next;
      // Chạy lại tất cả effects đang phụ thuộc
      const effectsToRun = new Set(subscribers);
      effectsToRun.forEach(fn => fn());
    }
  }

  return [read, write];
}

export function createEffect(fn) {
  const effectRunner = () => {
    activeEffect = effectRunner;
    try {
      fn();
    } finally {
      activeEffect = null;
    }
  };
  effectRunner();
}


describe('Bài 37 - Senior/Lead Live-Coding Challenges', () => {

  // Test 1: Priority Scheduler Concurrency & Sorting
  it('1. PriorityScheduler thực thi đúng giới hạn đồng thời và ưu tiên task có priority cao hơn', async () => {
    const scheduler = new PriorityScheduler(2);
    const executionOrder = [];

    const makeTask = (id, delayMs, priority) => {
      return scheduler.add(async () => {
        executionOrder.push(`start-${id}`);
        await new Promise(r => setTimeout(r, delayMs));
        executionOrder.push(`end-${id}`);
        return id;
      }, priority);
    };

    // Đẩy 4 tasks: Task 1 và 2 chiếm trọn concurrency = 2 ngay lập tức
    const p1 = makeTask(1, 40, 1);
    const p2 = makeTask(2, 40, 1);
    const p3 = makeTask(3, 10, 5); // Priority thấp hơn p4
    const p4 = makeTask(4, 10, 10); // Priority cao nhất trong hàng đợi

    const results = await Promise.all([p1, p2, p3, p4]);
    expect(results).toEqual([1, 2, 3, 4]);

    // Task 4 có priority 10 nên phải được chạy trước Task 3 (priority 5) sau khi slot trống!
    expect(executionOrder).toEqual([
      'start-1',
      'start-2',
      'end-1',
      'start-4', // Task 4 chạy trước Task 3
      'end-2',
      'start-3',
      'end-4',
      'end-3'
    ]);
  });

  // Test 2: Deep Object Diff & Patch
  it('2. DeepDiff & applyPatch phân tích chính xác nested changes và khôi phục target state', () => {
    const original = {
      user: { name: 'Tru Le', role: 'Dev', preferences: { theme: 'dark' } },
      tags: ['js', 'v8'],
      oldField: 'to_be_deleted'
    };

    const modified = {
      user: { name: 'Tru Le', role: 'Senior Architect', preferences: { theme: 'system' } },
      tags: ['js', 'v8'],
      newField: 'freshly_added'
    };

    const diff = deepDiff(original, modified);

    expect(diff.deleted).toEqual(['oldField']);
    expect(diff.added).toEqual({ newField: 'freshly_added' });
    expect(diff.updated.user.updated.role).toEqual({ from: 'Dev', to: 'Senior Architect' });
    expect(diff.updated.user.updated.preferences.updated.theme).toEqual({ from: 'dark', to: 'system' });

    // Áp dụng patch lên original phải cho ra state tương đương modified
    const patched = applyPatch(original, diff);
    expect(patched).toEqual(modified);
  });

  // Test 3: Fine-grained Reactivity Signals
  it('3. Mini Signal System tự động track dependencies và kích hoạt effect khi signal cập nhật', () => {
    const [count, setCount] = createSignal(0);
    const [multiplier, setMultiplier] = createSignal(2);

    let computedResult = 0;
    let runCount = 0;

    createEffect(() => {
      runCount++;
      computedResult = count() * multiplier();
    });

    // Lần đầu chạy effect đồng bộ
    expect(computedResult).toBe(0);
    expect(runCount).toBe(1);

    // Cập nhật signal 1
    setCount(5);
    expect(computedResult).toBe(10);
    expect(runCount).toBe(2);

    // Cập nhật signal 2
    setMultiplier(3);
    expect(computedResult).toBe(15);
    expect(runCount).toBe(3);

    // Gán cùng giá trị không kích hoạt effect
    setMultiplier(3);
    expect(runCount).toBe(3);
  });

});
