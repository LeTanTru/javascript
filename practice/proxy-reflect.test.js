import { describe, it, expect, vi } from 'vitest';

/**
 * Minimal Reactivity Engine (Mô phỏng cốt lõi Vue 3)
 */
let activeEffect = null;
const targetMap = new WeakMap();

export function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => effect());
  }
}

export function reactive(target) {
  return new Proxy(target, {
    get(obj, key, receiver) {
      track(obj, key);
      return Reflect.get(obj, key, receiver);
    },
    set(obj, key, value, receiver) {
      const oldValue = obj[key];
      const result = Reflect.set(obj, key, value, receiver);
      if (oldValue !== value) {
        trigger(obj, key);
      }
      return result;
    },
  });
}

export function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn;
    fn();
    activeEffect = null;
  };
  effectFn();
}

describe('Bài 12: Proxy & Reflect API: Meta-programming, Traps & Cơ chế Reactivity', () => {
  it('1. get và set traps đánh chặn và xác thực dữ liệu trước khi ghi vào target', () => {
    const user = { name: 'An', age: 20 };

    const validatedUser = new Proxy(user, {
      get(target, prop, receiver) {
        if (prop === 'name') return `Anh ${Reflect.get(target, prop, receiver)}`;
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        if (prop === 'age') {
          if (typeof value !== 'number' || value <= 0) {
            throw new TypeError('Tuổi phải là số dương hợp lệ');
          }
        }
        return Reflect.set(target, prop, value, receiver);
      },
    });

    expect(validatedUser.name).toBe('Anh An');

    validatedUser.age = 25;
    expect(validatedUser.age).toBe(25);
    expect(user.age).toBe(25); // Target thật sự bị thay đổi

    // @ts-ignore
    expect(() => { validatedUser.age = -5; }).toThrow(TypeError);
  });

  it('2. has (toán tử in) và deleteProperty traps kiểm soát thuộc tính ẩn giấu', () => {
    const sensitive = { id: 1, secretKey: 'SECRET_123', publicInfo: 'Hello' };

    const protectedObj = new Proxy(sensitive, {
      has(target, prop) {
        if (prop === 'secretKey') return false; // Ẩn khỏi toán tử 'in'
        return Reflect.has(target, prop);
      },
      deleteProperty(target, prop) {
        if (prop === 'id') {
          throw new Error('Không được phép xóa thuộc tính id');
        }
        return Reflect.deleteProperty(target, prop);
      },
    });

    expect('secretKey' in protectedObj).toBe(false);
    expect('publicInfo' in protectedObj).toBe(true);

    expect(() => delete protectedObj.id).toThrow();

    delete protectedObj.publicInfo;
    expect(sensitive.publicInfo).toBeUndefined();
  });

  it('3. apply trap đánh chặn lời gọi hàm và construct trap đánh chặn new', () => {
    function calculate(a, b) {
      return a + b;
    }

    const spyCalculate = new Proxy(calculate, {
      apply(target, thisArg, argArray) {
        const [a, b] = argArray;
        return target.apply(thisArg, [a * 2, b * 2]);
      },
    });

    expect(spyCalculate(2, 3)).toBe(10); // (2*2) + (3*2) = 10
  });

  it('4. Tầm quan trọng cốt tử của receiver trong Reflect.get: Bảo toàn this trong getter kế thừa', () => {
    const parent = {
      _val: 10,
      get val() {
        return this._val;
      },
    };

    // Proxy với Reflect.get có receiver
    const proxyWithReceiver = new Proxy(parent, {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
    });

    const child = Object.create(proxyWithReceiver);
    child._val = 99;

    // Nhờ có receiver, `this` trong getter `val` trỏ đúng vào `child`, trả về 99!
    expect(child.val).toBe(99);
  });

  it('5. Proxy.revocable cho phép thu hồi quyền truy cập đối tượng để tránh rò rỉ bảo mật', () => {
    const data = { token: 'AUTH_TOKEN' };
    const { proxy, revoke } = Proxy.revocable(data, {});

    expect(proxy.token).toBe('AUTH_TOKEN');

    // Thu hồi quyền truy cập
    revoke();

    // Mọi thao tác sau khi revoke đều ném TypeError
    expect(() => proxy.token).toThrow(TypeError);
  });

  it('6. Reactivity System tối giản (Vue 3 Core): Tự động re-run effect khi reactive state thay đổi', () => {
    const state = reactive({ count: 0, multiplier: 2 });
    let output = 0;
    const effectSpy = vi.fn(() => {
      output = state.count * state.multiplier;
    });

    // Kích hoạt effect lần đầu
    effect(effectSpy);
    expect(output).toBe(0);
    expect(effectSpy).toHaveBeenCalledTimes(1);

    // Cập nhật state -> tự động re-run effect
    state.count = 5;
    expect(output).toBe(10);
    expect(effectSpy).toHaveBeenCalledTimes(2);

    state.multiplier = 3;
    expect(output).toBe(15);
    expect(effectSpy).toHaveBeenCalledTimes(3);
  });
});
