import { describe, it, expect } from 'vitest';

describe('Module 05 - Bài 16: Kiến trúc Event Loop (Call Stack, Microtask & Task Queue)', () => {
  it('Call Stack: Mã đồng bộ (Synchronous) luôn thực thi trước bất kỳ task nào trong hàng đợi', () => {
    const executionOrder = [];

    executionOrder.push('1. Call Stack Sync Start');

    setTimeout(() => {
      executionOrder.push('4. Macrotask Timeout');
    }, 0);

    Promise.resolve().then(() => {
      executionOrder.push('3. Microtask Promise');
    });

    executionOrder.push('2. Call Stack Sync End');

    // Tại thời điểm này (đồng bộ), chỉ có mã trong Call Stack đã chạy
    expect(executionOrder).toEqual([
      '1. Call Stack Sync Start',
      '2. Call Stack Sync End',
    ]);
  });

  it('Microtask Queue vs Task Queue: Microtasks luôn được ưu tiên chạy hết trước Macrotask đầu tiên', async () => {
    const executionOrder = [];

    await new Promise((resolve) => {
      setTimeout(() => {
        executionOrder.push('Macrotask: setTimeout 0');
        resolve();
      }, 0);

      queueMicrotask(() => {
        executionOrder.push('Microtask: queueMicrotask 1');
      });

      Promise.resolve()
        .then(() => {
          executionOrder.push('Microtask: Promise.then 1');
        })
        .then(() => {
          executionOrder.push('Microtask: Promise.then 2 (Chained)');
        });

      executionOrder.push('Sync: Call Stack End');
    });

    expect(executionOrder).toEqual([
      'Sync: Call Stack End',
      'Microtask: queueMicrotask 1',
      'Microtask: Promise.then 1',
      'Microtask: Promise.then 2 (Chained)',
      'Macrotask: setTimeout 0',
    ]);
  });

  it('Microtask Drain: Microtask lồng nhau tiếp tục được vét cạn (drain) trong cùng một lượt quay Event Loop', async () => {
    const log = [];

    await new Promise((resolve) => {
      setTimeout(() => {
        log.push('Macrotask');
        resolve();
      }, 0);

      Promise.resolve().then(() => {
        log.push('Microtask Level 1');
        Promise.resolve().then(() => {
          log.push('Microtask Level 2');
          Promise.resolve().then(() => {
            log.push('Microtask Level 3');
          });
        });
      });
    });

    // Toàn bộ chuỗi lồng Microtask phải vét cạn sạch sẽ TRƯỚC KHI Macrotask được bốc ra
    expect(log).toEqual([
      'Microtask Level 1',
      'Microtask Level 2',
      'Microtask Level 3',
      'Macrotask',
    ]);
  });

  it('Task Interleaving: Mỗi Macrotask được bốc ra một lần, xen kẽ với việc vét sạch Microtask mới sinh', async () => {
    const log = [];

    await new Promise((resolve) => {
      setTimeout(() => {
        log.push('Macrotask 1');
        Promise.resolve().then(() => {
          log.push('Microtask sinh ra bởi Macrotask 1');
        });
      }, 0);

      setTimeout(() => {
        log.push('Macrotask 2');
        resolve();
      }, 0);
    });

    // Event Loop: Sau khi Macrotask 1 chạy xong -> vét sạch microtasks của nó -> mới bốc Macrotask 2
    expect(log).toEqual([
      'Macrotask 1',
      'Microtask sinh ra bởi Macrotask 1',
      'Macrotask 2',
    ]);
  });

  it('Microtask Queue FIFO: queueMicrotask và Promise.resolve().then thực thi theo thứ tự FIFO', async () => {
    const log = [];

    await new Promise((resolve) => {
      setTimeout(() => {
        log.push('Macrotask Timers');
        resolve();
      }, 0);

      queueMicrotask(() => {
        log.push('queueMicrotask 1');
      });

      Promise.resolve().then(() => {
        log.push('Promise.then 1');
      });

      queueMicrotask(() => {
        log.push('queueMicrotask 2');
      });
    });

    // Các microtask tuân theo nguyên lý hàng đợi FIFO (First In, First Out)
    expect(log).toEqual([
      'queueMicrotask 1',
      'Promise.then 1',
      'queueMicrotask 2',
      'Macrotask Timers',
    ]);
  });

  it('Event Loop Simulation: Mô hình hóa cấu trúc dữ liệu Event Loop tối giản', () => {
    class SimpleEventLoop {
      constructor() {
        this.callStack = [];
        this.microtaskQueue = [];
        this.macrotaskQueue = [];
        this.logs = [];
      }

      runSync(fn) {
        this.callStack.push(fn);
        const current = this.callStack.pop();
        current();
      }

      queueMicro(fn) {
        this.microtaskQueue.push(fn);
      }

      queueMacro(fn) {
        this.macrotaskQueue.push(fn);
      }

      tick() {
        // 1. Drain toàn bộ microtask queue
        while (this.microtaskQueue.length > 0) {
          const task = this.microtaskQueue.shift();
          task();
        }

        // 2. Bốc đúng 1 macrotask
        if (this.macrotaskQueue.length > 0) {
          const task = this.macrotaskQueue.shift();
          task();
        }

        // 3. Sau khi chạy macrotask, tiếp tục drain microtask mới nếu có
        while (this.microtaskQueue.length > 0) {
          const task = this.microtaskQueue.shift();
          task();
        }
      }
    }

    const loop = new SimpleEventLoop();
    loop.runSync(() => loop.logs.push('Sync'));
    loop.queueMacro(() => loop.logs.push('Macro 1'));
    loop.queueMicro(() => loop.logs.push('Micro 1'));
    loop.queueMicro(() => loop.logs.push('Micro 2'));

    loop.tick();

    expect(loop.logs).toEqual(['Sync', 'Micro 1', 'Micro 2', 'Macro 1']);
  });
});
