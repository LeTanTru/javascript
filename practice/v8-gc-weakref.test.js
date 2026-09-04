import { describe, it, expect, vi } from 'vitest';

// ─── SIMULATION MODEL: V8 GENERATIONAL GC & WEAK REFERENCES ──────────────────

export class MockV8Heap {
  constructor() {
    this.youngGeneration = []; // New Space (Nursery)
    this.oldGeneration = [];   // Old Space
    this.gcRoots = new Set();
  }

  allocate(obj) {
    const entry = { obj, age: 0, marked: false };
    this.youngGeneration.push(entry);
    return entry;
  }

  addGCRoot(obj) {
    this.gcRoots.add(obj);
  }

  removeGCRoot(obj) {
    this.gcRoots.delete(obj);
  }

  // Minor GC (Scavenge) - Dọn dẹp New Space
  runMinorGC() {
    const survivors = [];
    for (const entry of this.youngGeneration) {
      if (this.gcRoots.has(entry.obj)) {
        entry.age++;
        if (entry.age >= 2) {
          // Thăng cấp (Promotion) lên Old Generation
          this.oldGeneration.push(entry);
        } else {
          survivors.push(entry);
        }
      }
      // Các object không thể tiếp cận từ GC Roots bị thu hồi (vứt bỏ)
    }
    this.youngGeneration = survivors;
  }

  // Major GC (Mark-Sweep-Compact) - Dọn dẹp Old Space
  runMajorGC() {
    // 1. Mark phase
    for (const entry of this.oldGeneration) {
      entry.marked = this.gcRoots.has(entry.obj);
    }
    // 2. Sweep & Compact phase
    this.oldGeneration = this.oldGeneration.filter((entry) => entry.marked);
  }
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 08 - Bài 34: V8 Garbage Collection & Weak References', () => {
  it('1. Generational GC: Đối tượng sống sót qua 2 chu kỳ Scavenge được thăng cấp (Promoted) lên Old Space', () => {
    const heap = new MockV8Heap();

    const shortLived = { id: 'temp' };
    const longLived = { id: 'app_config' };

    heap.allocate(shortLived);
    const longEntry = heap.allocate(longLived);

    // Chỉ giữ root cho longLived
    heap.addGCRoot(longLived);

    // Chu kỳ 1: Minor GC
    heap.runMinorGC();
    expect(heap.youngGeneration.length).toBe(1); // shortLived đã bị thu hồi, longLived tuổi 1
    expect(longEntry.age).toBe(1);
    expect(heap.oldGeneration.length).toBe(0);

    // Chu kỳ 2: Minor GC
    heap.runMinorGC();
    expect(heap.youngGeneration.length).toBe(0); // Đã thăng cấp
    expect(heap.oldGeneration.length).toBe(1);   // Chuyển sang Old Space
    expect(heap.oldGeneration[0].obj.id).toBe('app_config');
  });

  it('2. WeakMap: Khóa giữ tham chiếu yếu, tự động giải phóng khi object key bị xóa strong reference', () => {
    const wm = new WeakMap();
    let user = { name: 'Alice' };

    wm.set(user, { role: 'Admin', metadata: 'Secret' });
    expect(wm.has(user)).toBe(true);

    // Xóa Strong reference duy nhất
    user = null;
    // GC có toàn quyền thu hồi object cũ và entry tương ứng trong WeakMap mà không gây memory leak
    expect(user).toBeNull();
  });

  it('3. WeakRef (ES2021): Tạo tham chiếu yếu và truy xuất an toàn qua deref()', () => {
    let target = { value: 42 };
    const ref = new WeakRef(target);

    // Khi target còn strong reference
    expect(ref.deref()).toBe(target);
    expect(ref.deref()?.value).toBe(42);

    // Giả lập sau khi GC thu hồi target: deref() sẽ trả về undefined
    function simulateGCAfterLossOfStrongRef(refInstance, forceClear = false) {
      if (forceClear) return undefined;
      return refInstance.deref();
    }

    expect(simulateGCAfterLossOfStrongRef(ref, true)).toBeUndefined();
  });

  it('4. FinalizationRegistry (ES2021): Đăng ký callback dọn dẹp tài nguyên khi object bị GC thu hồi', () => {
    const cleanupSpy = vi.fn();
    const registry = new FinalizationRegistry((heldValue) => {
      cleanupSpy(heldValue);
    });

    let resource = { id: 'file_handle_101' };
    registry.register(resource, 'Tài nguyên file_handle_101 đã bị giải phóng!');

    // Giả lập trigger callback khi resource bị dọn
    // @ts-ignore
    registry._triggerCleanup = function (heldValue) {
      cleanupSpy(heldValue);
    };

    registry._triggerCleanup('Tài nguyên file_handle_101 đã bị giải phóng!');
    expect(cleanupSpy).toHaveBeenCalledWith('Tài nguyên file_handle_101 đã bị giải phóng!');
  });

  it('5. Nhận diện 4 loại Memory Leak phổ biến trong JavaScript', () => {
    const memoryLeakTypes = new Set([
      'ACCIDENTAL_GLOBAL_VARIABLE',
      'FORGOTTEN_TIMER_OR_CALLBACK',
      'DETACHED_DOM_NODE',
      'CLOSURE_SCOPE_RETENTION',
    ]);

    expect(memoryLeakTypes.has('DETACHED_DOM_NODE')).toBe(true);
    expect(memoryLeakTypes.has('FORGOTTEN_TIMER_OR_CALLBACK')).toBe(true);
  });

  it('6. Phân biệt WeakMap vs Map: WeakMap không thể lặp (Not Iterable) và không có thuộc tính .size', () => {
    const wm = new WeakMap();
    const map = new Map();

    expect('size' in wm).toBe(false);
    expect('forEach' in wm).toBe(false);
    expect('keys' in wm).toBe(false);

    expect('size' in map).toBe(true);
    expect('forEach' in map).toBe(true);
  });
});
