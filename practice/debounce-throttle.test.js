import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── IMPLEMENTATIONS ──────────────────────────────────────────────────────────

/**
 * 1. Debounce implementation (chuẩn Lodash)
 * Hoãn thực thi hàm cho đến khi qua `wait` ms không có lời gọi mới.
 * Hỗ trợ options: { leading: boolean, trailing: boolean }, kèm .cancel() và .flush().
 */
export function debounce(fn, wait, options = {}) {
  const { leading = false, trailing = true } = options;
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let result;

  function invokeFn() {
    if (lastArgs !== null) {
      result = fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
    return result;
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const isInvokingLeading = leading && timerId === null;

    if (timerId !== null) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      timerId = null;
      if (trailing && !isInvokingLeading) {
        invokeFn();
      }
    }, wait);

    if (isInvokingLeading) {
      invokeFn();
    }

    return result;
  }

  debounced.cancel = function () {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = function () {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
      return invokeFn();
    }
    return result;
  };

  return debounced;
}

/**
 * 2. Throttle implementation (chuẩn Lodash)
 * Giới hạn tần suất thực thi tối đa 1 lần mỗi `wait` ms.
 * Hỗ trợ options: { leading: boolean, trailing: boolean }, kèm .cancel().
 */
export function throttle(fn, wait, options = {}) {
  const { leading = true, trailing = true } = options;
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let lastCallTime = 0;
  let result;

  function invokeFn(time) {
    lastCallTime = time;
    if (lastArgs !== null) {
      result = fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
    return result;
  }

  function throttled(...args) {
    const now = Date.now();
    lastArgs = args;
    lastThis = this;

    // Nếu là lần đầu và không bật leading, giả lập như vừa gọi lúc này
    if (lastCallTime === 0 && !leading) {
      lastCallTime = now;
    }

    const remaining = wait - (now - lastCallTime);

    if (remaining <= 0 || remaining > wait) {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
      invokeFn(now);
    } else if (timerId === null && trailing) {
      timerId = setTimeout(() => {
        timerId = null;
        lastCallTime = leading ? Date.now() : 0;
        invokeFn(Date.now());
      }, remaining);
    }

    return result;
  }

  throttled.cancel = function () {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
    lastCallTime = 0;
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 06 - Bài 23: Live-coding Debounce & Throttle Polyfills', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1. Debounce trailing (mặc định): Chỉ thực thi 1 lần sau khi ngừng gọi `wait` ms', () => {
    const spy = vi.fn();
    const debouncedFn = debounce(spy, 100);

    debouncedFn('a');
    debouncedFn('b');
    debouncedFn('c');

    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    debouncedFn('d'); // Reset timer

    vi.advanceTimersByTime(99);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('d');
  });

  it('2. Debounce leading: Thực thi ngay lần đầu, hoãn các lần gọi tiếp theo trong `wait` ms', () => {
    const spy = vi.fn();
    const debouncedFn = debounce(spy, 100, { leading: true, trailing: false });

    debouncedFn(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);

    debouncedFn(2);
    debouncedFn(3);
    vi.advanceTimersByTime(100);

    expect(spy).toHaveBeenCalledTimes(1); // Không gọi lại ở trailing
  });

  it('3. Debounce .cancel() và .flush(): Hủy timer hoặc ép thực thi ngay lập tức', () => {
    const spy = vi.fn((x) => x * 2);
    const debouncedFn = debounce(spy, 100);

    // Test cancel
    debouncedFn(10);
    debouncedFn.cancel();
    vi.advanceTimersByTime(150);
    expect(spy).not.toHaveBeenCalled();

    // Test flush
    debouncedFn(20);
    const flushRes = debouncedFn.flush();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(flushRes).toBe(40);
  });

  it('4. Throttle leading + trailing (mặc định): Chạy ngay lúc đầu và chạy thêm 1 lần cuối sau chu kỳ', () => {
    const spy = vi.fn();
    const throttledFn = throttle(spy, 100);

    throttledFn(1); // Call 1 (leading -> chạy ngay)
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);

    throttledFn(2);
    throttledFn(3); // Call 3 (được lưu cho trailing)

    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(3);
  });

  it('5. Throttle { leading: false }: Không chạy ngay, chỉ chạy sau `wait` ms', () => {
    const spy = vi.fn();
    const throttledFn = throttle(spy, 100, { leading: false, trailing: true });

    throttledFn('x');
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('x');
  });

  it('6. Bảo toàn `this` context và arguments trong cả debounce và throttle', () => {
    const obj = {
      val: 42,
      debouncedMethod: debounce(function (extra) {
        return this.val + extra;
      }, 50),
      throttledMethod: throttle(function (extra) {
        return this.val + extra;
      }, 50),
    };

    obj.debouncedMethod(8);
    vi.advanceTimersByTime(50);

    obj.throttledMethod(10);
    expect(obj.throttledMethod(10)).toBe(52);
  });
});
