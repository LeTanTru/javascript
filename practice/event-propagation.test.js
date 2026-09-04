import { describe, it, expect, vi } from 'vitest';

// ─── DOM EVENT DISPATCHER SIMULATION ─────────────────────────────────────────

export class DOMEventNode {
  constructor(name, parent = null) {
    this.name = name;
    this.parent = parent;
    this.listeners = { capture: [], bubble: [] };
  }

  addEventListener(type, callback, options = false) {
    const isCapture = typeof options === 'boolean' ? options : Boolean(options?.capture);
    const isPassive = typeof options === 'object' ? Boolean(options?.passive) : false;
    const isOnce = typeof options === 'object' ? Boolean(options?.once) : false;

    const list = isCapture ? this.listeners.capture : this.listeners.bubble;
    list.push({ type, callback, isPassive, isOnce });
  }

  dispatchEvent(event) {
    event.target = this;

    // 1. Build Ancestor Chain
    const chain = [];
    let curr = this.parent;
    while (curr) {
      chain.unshift(curr); // [GrandParent, Parent]
      curr = curr.parent;
    }

    // 2. Phase 1: Capturing Phase (từ gốc xuống target)
    event.eventPhase = 1; // CAPTURING_PHASE
    for (const node of chain) {
      if (event.propagationStopped) break;
      event.currentTarget = node;
      node._runListeners('capture', event);
    }

    // 3. Phase 2: Target Phase
    if (!event.propagationStopped) {
      event.eventPhase = 2; // AT_TARGET
      event.currentTarget = this;
      this._runListeners('capture', event);
      this._runListeners('bubble', event);
    }

    // 4. Phase 3: Bubbling Phase (từ target lên gốc)
    if (!event.propagationStopped) {
      event.eventPhase = 3; // BUBBLING_PHASE
      const reverseChain = [...chain].reverse();
      for (const node of reverseChain) {
        if (event.propagationStopped) break;
        event.currentTarget = node;
        node._runListeners('bubble', event);
      }
    }

    return !event.defaultPrevented;
  }

  _runListeners(phase, event) {
    const list = [...this.listeners[phase]];
    for (let i = 0; i < list.length; i++) {
      if (event.immediatePropagationStopped) break;
      const entry = list[i];
      if (entry.type === event.type) {
        if (entry.isPassive) {
          event._isPassiveContext = true;
        }
        entry.callback.call(this, event);
        event._isPassiveContext = false;
        if (entry.isOnce) {
          const idx = this.listeners[phase].indexOf(entry);
          if (idx !== -1) this.listeners[phase].splice(idx, 1);
        }
      }
    }
  }
}

export class CustomDOMEvent {
  constructor(type) {
    this.type = type;
    this.target = null;
    this.currentTarget = null;
    this.eventPhase = 0;
    this.propagationStopped = false;
    this.immediatePropagationStopped = false;
    this.defaultPrevented = false;
    this._isPassiveContext = false;
  }

  stopPropagation() {
    this.propagationStopped = true;
  }

  stopImmediatePropagation() {
    this.propagationStopped = true;
    this.immediatePropagationStopped = true;
  }

  preventDefault() {
    if (this._isPassiveContext) {
      // Trong passive listener, preventDefault bị bỏ qua (hoặc warning trên console)
      return;
    }
    this.defaultPrevented = true;
  }
}

/**
 * Event Delegation helper
 */
export function delegateEvent(parentElement, selector, eventType, handler) {
  parentElement.addEventListener(eventType, function (e) {
    // Giả lập closest() matching
    let target = e.target;
    while (target && target !== parentElement) {
      if (target.name === selector || target.className === selector) {
        handler.call(target, e, target);
        break;
      }
      target = target.parent;
    }
  });
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 07 - Bài 29: Event Propagation & Event Delegation', () => {
  it('1. Chu trình 3 pha: Capturing (1) -> Target (2) -> Bubbling (3)', () => {
    const grandParent = new DOMEventNode('GrandParent');
    const parent = new DOMEventNode('Parent', grandParent);
    const button = new DOMEventNode('Button', parent);

    const log = [];

    grandParent.addEventListener('click', () => log.push('GrandParent Capture'), true);
    parent.addEventListener('click', () => log.push('Parent Capture'), true);
    button.addEventListener('click', () => log.push('Button Target'), false);
    parent.addEventListener('click', () => log.push('Parent Bubble'), false);
    grandParent.addEventListener('click', () => log.push('GrandParent Bubble'), false);

    button.dispatchEvent(new CustomDOMEvent('click'));

    expect(log).toEqual([
      'GrandParent Capture',
      'Parent Capture',
      'Button Target',
      'Parent Bubble',
      'GrandParent Bubble',
    ]);
  });

  it('2. stopPropagation(): Dừng lan truyền lên cha nhưng các listeners khác trên cùng node vẫn chạy', () => {
    const parent = new DOMEventNode('Parent');
    const button = new DOMEventNode('Button', parent);

    const log = [];

    parent.addEventListener('click', () => log.push('Parent Listener'));

    button.addEventListener('click', (e) => {
      log.push('Button Listener 1');
      e.stopPropagation(); // Dừng lan lên parent
    });

    button.addEventListener('click', () => {
      log.push('Button Listener 2'); // VẪN CHẠY vì cùng nằm trên button
    });

    button.dispatchEvent(new CustomDOMEvent('click'));

    expect(log).toEqual(['Button Listener 1', 'Button Listener 2']);
  });

  it('3. stopImmediatePropagation(): Dừng lan truyền VÀ chặn mọi listener còn lại trên cùng node', () => {
    const parent = new DOMEventNode('Parent');
    const button = new DOMEventNode('Button', parent);

    const log = [];

    button.addEventListener('click', (e) => {
      log.push('Button Listener 1');
      e.stopImmediatePropagation();
    });

    button.addEventListener('click', () => {
      log.push('Button Listener 2'); // BỊ CHẶN!
    });

    button.dispatchEvent(new CustomDOMEvent('click'));

    expect(log).toEqual(['Button Listener 1']);
  });

  it('4. Event Delegation: Bắt sự kiện trên thẻ cha thay vì gắn vào từng thẻ con', () => {
    const listContainer = new DOMEventNode('ListContainer');
    const item1 = new DOMEventNode('item', listContainer);
    const item2 = new DOMEventNode('item', listContainer);

    const clickedItems = [];

    delegateEvent(listContainer, 'item', 'click', (e, item) => {
      clickedItems.push(item.name);
    });

    item1.dispatchEvent(new CustomDOMEvent('click'));
    item2.dispatchEvent(new CustomDOMEvent('click'));

    expect(clickedItems).toEqual(['item', 'item']);
  });

  it('5. passive: true listeners: Vô hiệu hóa preventDefault() để tối ưu luồng cuộn trang 60fps', () => {
    const scrollContainer = new DOMEventNode('ScrollContainer');
    const event = new CustomDOMEvent('touchstart');

    scrollContainer.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault(); // Sẽ bị bỏ qua vì passive: true
      },
      { passive: true }
    );

    scrollContainer.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false); // Không thể preventDefault trong passive listener
  });

  it('6. Phân biệt target (phần tử phát sinh) vs currentTarget (phần tử đang xử lý)', () => {
    const form = new DOMEventNode('Form');
    const input = new DOMEventNode('Input', form);

    let recordedTarget = null;
    let recordedCurrentTarget = null;

    form.addEventListener('click', (e) => {
      recordedTarget = e.target.name;
      recordedCurrentTarget = e.currentTarget.name;
    });

    input.dispatchEvent(new CustomDOMEvent('click'));

    expect(recordedTarget).toBe('Input');
    expect(recordedCurrentTarget).toBe('Form');
  });
});
