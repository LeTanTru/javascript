import { describe, it, expect } from 'vitest';

describe('Module 05 - Bài 17: Thứ tự thực thi Microtasks vs Macrotasks vs queueMicrotask vs async/await', () => {
  it('Thứ tự cơ bản: Đồng bộ -> Microtask (queueMicrotask & Promise) -> Macrotask (setTimeout)', async () => {
    const log = [];

    await new Promise((resolve) => {
      log.push('1. Sync Start');

      setTimeout(() => {
        log.push('5. Macrotask (setTimeout)');
        resolve();
      }, 0);

      queueMicrotask(() => {
        log.push('3. Microtask (queueMicrotask)');
      });

      Promise.resolve().then(() => {
        log.push('4. Microtask (Promise.then)');
      });

      log.push('2. Sync End');
    });

    expect(log).toEqual([
      '1. Sync Start',
      '2. Sync End',
      '3. Microtask (queueMicrotask)',
      '4. Microtask (Promise.then)',
      '5. Macrotask (setTimeout)',
    ]);
  });

  it('Bản chất async/await: Mã trước await chạy đồng bộ, mã sau await là Microtask', async () => {
    const log = [];

    async function asyncFunc() {
      log.push('2. asyncFunc: Before await');
      await Promise.resolve();
      log.push('4. asyncFunc: After await (Microtask continuation)');
    }

    await new Promise((resolve) => {
      log.push('1. Script Start');

      asyncFunc();

      Promise.resolve().then(() => {
        log.push('5. Promise.then outside');
        resolve();
      });

      log.push('3. Script End');
    });

    // 1. Script Start
    // 2. asyncFunc() được gọi đồng bộ cho đến gặp từ khóa 'await'
    // 3. Script End chạy xong mã đồng bộ
    // 4 & 5. Các microtask sau await và Promise.then được xả cạn theo thứ tự FIFO
    expect(log).toEqual([
      '1. Script Start',
      '2. asyncFunc: Before await',
      '3. Script End',
      '4. asyncFunc: After await (Microtask continuation)',
      '5. Promise.then outside',
    ]);
  });

  it('Bẫy phỏng vấn lồng nhau: Promise trong setTimeout vs setTimeout trong Promise', async () => {
    const log = [];

    await new Promise((resolve) => {
      // Nhánh A: setTimeout chứa Promise
      setTimeout(() => {
        log.push('Macro A: setTimeout outer');
        Promise.resolve().then(() => {
          log.push('Micro A: Promise inside setTimeout');
        });
      }, 0);

      // Nhánh B: Promise chứa setTimeout
      Promise.resolve().then(() => {
        log.push('Micro B: Promise outer');
        setTimeout(() => {
          log.push('Macro B: setTimeout inside Promise');
          resolve();
        }, 0);
      });
    });

    // Vòng 1: Call stack trống -> Chạy Micro B trước -> Đăng ký Macro B
    // Vòng 2: Bốc Macro A -> Chạy Macro A -> Vét Micro A (sinh bởi Macro A)
    // Vòng 3: Bốc Macro B
    expect(log).toEqual([
      'Micro B: Promise outer',
      'Macro A: setTimeout outer',
      'Micro A: Promise inside setTimeout',
      'Macro B: setTimeout inside Promise',
    ]);
  });

  it('queueMicrotask API: Nhẹ hơn Promise vì không tạo Promise Object trên Heap', async () => {
    const order = [];

    await new Promise((resolve) => {
      setTimeout(resolve, 0);

      // queueMicrotask được đẩy thẳng vào Microtask Queue của V8
      queueMicrotask(() => {
        order.push('queueMicrotask 1');
      });

      Promise.resolve().then(() => {
        order.push('Promise 1');
      });

      queueMicrotask(() => {
        order.push('queueMicrotask 2');
      });
    });

    // Cả hai cùng nằm trong một hàng đợi Microtask và tuân thủ FIFO
    expect(order).toEqual([
      'queueMicrotask 1',
      'Promise 1',
      'queueMicrotask 2',
    ]);
  });

  it('Nhiều Macrotasks xen kẽ: Mỗi Macrotask đều kích hoạt một lượt xả cạn Microtask riêng', async () => {
    const steps = [];

    await new Promise((resolve) => {
      setTimeout(() => {
        steps.push('Macro 1');
        queueMicrotask(() => steps.push('Micro from Macro 1'));
      }, 0);

      setTimeout(() => {
        steps.push('Macro 2');
        queueMicrotask(() => steps.push('Micro from Macro 2'));
        resolve();
      }, 0);
    });

    expect(steps).toEqual([
      'Macro 1',
      'Micro from Macro 1',
      'Macro 2',
      'Micro from Macro 2',
    ]);
  });

  it('Mô phỏng chu kỳ Rendering Frame: requestAnimationFrame chạy trước Paint nhưng sau Microtasks', () => {
    // Mô hình hóa giả lập Browser Event Loop đầy đủ
    const events = [];

    function simulateFrame(tasks, microtasks, rafCallbacks, renderPaint) {
      // 1. Chạy Sync Task
      while (tasks.length > 0) {
        tasks.shift()();
      }

      // 2. Vét cạn Microtasks
      while (microtasks.length > 0) {
        microtasks.shift()();
      }

      // 3. Render Steps: chạy requestAnimationFrame trước khi Paint
      while (rafCallbacks.length > 0) {
        rafCallbacks.shift()();
      }

      // 4. Paint ra màn hình (Compositor/GPU)
      renderPaint();
    }

    const tasks = [() => events.push('Task 1 (Call Stack)')];
    const microtasks = [() => events.push('Microtask (Promise/queueMicrotask)')];
    const rafCallbacks = [() => events.push('requestAnimationFrame (Before Paint)')];
    const paint = () => events.push('Render / Paint to Screen');

    simulateFrame(tasks, microtasks, rafCallbacks, paint);

    expect(events).toEqual([
      'Task 1 (Call Stack)',
      'Microtask (Promise/queueMicrotask)',
      'requestAnimationFrame (Before Paint)',
      'Render / Paint to Screen',
    ]);
  });
});
