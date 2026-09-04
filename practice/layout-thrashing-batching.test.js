import { describe, it, expect, vi } from 'vitest';

// ─── SIMULATION MODEL: DOM BATCHER & LAYOUT ENGINE ───────────────────────────

export class MockDOMElement {
  constructor(id, initialWidth = 100) {
    this.id = id;
    this._width = initialWidth;
    this._mutated = false;
  }

  // Getter đo đạc hình học (Geometry Read)
  get offsetWidth() {
    if (this._engine) {
      this._engine.recordRead(this);
    }
    return this._width;
  }

  // Setter thay đổi hình học (Geometry Write)
  set width(val) {
    this._width = val;
    this._mutated = true;
    if (this._engine) {
      this._engine.recordWrite(this);
    }
  }
}

export class MockLayoutEngine {
  constructor() {
    this.reflowCount = 0;
    this.hasPendingWrites = false;
  }

  attach(element) {
    element._engine = this;
  }

  recordWrite(element) {
    this.hasPendingWrites = true;
  }

  recordRead(element) {
    // Nếu có write trước đó mà chưa commit -> Bắt buộc tính lại Layout ngay lập tức (Forced Synchronous Layout)!
    if (this.hasPendingWrites) {
      this.reflowCount++;
      this.hasPendingWrites = false; // Layout đã được recalculate
    }
  }

  flush() {
    if (this.hasPendingWrites) {
      this.reflowCount++;
      this.hasPendingWrites = false;
    }
  }
}

/**
 * FastDOM Batcher Implementation (Đọc trước - Ghi sau)
 */
export class FastDOMBatcher {
  constructor() {
    this.reads = [];
    this.writes = [];
  }

  measure(task) {
    this.reads.push(task);
  }

  mutate(task) {
    this.writes.push(task);
  }

  run() {
    // 1. Chạy tất cả Reads trước
    for (const read of this.reads) {
      read();
    }
    this.reads = [];

    // 2. Chạy tất cả Writes sau
    for (const write of this.writes) {
      write();
    }
    this.writes = [];
  }
}

/**
 * DocumentFragment Simulation
 */
export class MockDocumentFragment {
  constructor() {
    this.children = [];
  }

  appendChild(node) {
    this.children.push(node);
  }
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 07 - Bài 30: Layout Thrashing & DOM Batching Optimization', () => {
  it('1. Layout Thrashing: Đan xen Read và Write trong vòng lặp gây N lần Reflow', () => {
    const engine = new MockLayoutEngine();
    const elements = Array.from({ length: 5 }, (_, i) => {
      const el = new MockDOMElement(`box-${i}`, 100);
      engine.attach(el);
      return el;
    });

    // Code BAD: Vừa đọc offsetWidth vừa gán width trong mỗi vòng lặp
    for (const el of elements) {
      const currentWidth = el.offsetWidth; // Read
      el.width = currentWidth + 10;        // Write -> Làm bẩn Layout
      // Vòng lặp sau lại Read -> Buộc engine phải Reflow ngay lập tức!
    }
    engine.flush();

    // 5 lần đan xen = 5 lần Reflow bắt buộc!
    expect(engine.reflowCount).toBe(5);
  });

  it('2. Batching giải quyết Layout Thrashing: Đọc tất cả trước rồi Ghi tất cả sau (1 Reflow)', () => {
    const engine = new MockLayoutEngine();
    const elements = Array.from({ length: 5 }, (_, i) => {
      const el = new MockDOMElement(`box-${i}`, 100);
      engine.attach(el);
      return el;
    });

    const batcher = new FastDOMBatcher();
    const newWidths = [];

    // Phase 1: Đăng ký tất cả READS
    for (let i = 0; i < elements.length; i++) {
      batcher.measure(() => {
        newWidths[i] = elements[i].offsetWidth + 10;
      });
    }

    // Phase 2: Đăng ký tất cả WRITES
    for (let i = 0; i < elements.length; i++) {
      batcher.mutate(() => {
        elements[i].width = newWidths[i];
      });
    }

    batcher.run();
    engine.flush();

    // Toàn bộ 5 phần tử chỉ gây đúng 1 lần Reflow duy nhất!
    expect(engine.reflowCount).toBe(1);
  });

  it('3. DocumentFragment: Gom 1000 nodes trong RAM trước khi gắn vào DOM thực tế', () => {
    const fragment = new MockDocumentFragment();

    for (let i = 0; i < 1000; i++) {
      fragment.appendChild({ id: `item-${i}` });
    }

    expect(fragment.children.length).toBe(1000);

    const realContainer = { children: [] };
    // Chỉ 1 thao tác append duy nhất
    realContainer.children.push(...fragment.children);

    expect(realContainer.children.length).toBe(1000);
  });

  it('4. Phân loại các thuộc tính / phương thức đọc gây Forced Layout', () => {
    const layoutReadProperties = new Set([
      'offsetWidth', 'offsetHeight', 'offsetLeft', 'offsetTop',
      'clientWidth', 'clientHeight', 'clientLeft', 'clientTop',
      'scrollWidth', 'scrollHeight', 'scrollLeft', 'scrollTop',
      'getBoundingClientRect', 'getComputedStyle'
    ]);

    expect(layoutReadProperties.has('offsetWidth')).toBe(true);
    expect(layoutReadProperties.has('getBoundingClientRect')).toBe(true);
    expect(layoutReadProperties.has('scrollTop')).toBe(true);
    expect(layoutReadProperties.has('className')).toBe(false);
  });

  it('5. CSS Class Batching: Thay đổi 1 className thay vì sửa 5 thuộc tính style rời rạc', () => {
    const mutations = [];

    function applyStylesIndividually(el, styles) {
      for (const [k, v] of Object.entries(styles)) {
        mutations.push(`style.${k} = ${v}`);
      }
    }

    function applyStylesByClass(el, className) {
      mutations.push(`classList.add(${className})`);
    }

    applyStylesIndividually({}, { width: '100px', height: '100px', color: 'red' });
    expect(mutations.length).toBe(3);

    mutations.length = 0; // reset
    applyStylesByClass({}, 'active-card');
    expect(mutations.length).toBe(1);
  });

  it('6. CSS Containment: contain: content / contain: layout size cô lập phạm vi Reflow', () => {
    function isIsolatedContainer(cssStyle) {
      return (
        cssStyle.contain === 'layout' ||
        cssStyle.contain === 'content' ||
        cssStyle.contain === 'strict' ||
        cssStyle.contentVisibility === 'auto'
      );
    }

    expect(isIsolatedContainer({ contain: 'content' })).toBe(true);
    expect(isIsolatedContainer({ contentVisibility: 'auto' })).toBe(true);
    expect(isIsolatedContainer({ display: 'block' })).toBe(false);
  });
});
