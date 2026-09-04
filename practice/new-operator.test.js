import { describe, it, expect } from 'vitest';

/**
 * Polyfill hoàn chỉnh mô phỏng toán tử `new`
 */
export function myNew(Constructor, ...args) {
  // Bước 1 & 2: Tạo object mới với [[Prototype]] trỏ tới Constructor.prototype
  const instance = Object.create(Constructor.prototype);

  // Bước 3: Gọi Constructor với this là instance
  const result = Constructor.apply(instance, args);

  // Bước 4: Kiểm tra kết quả trả về
  // Nếu trả về Object (và không phải null) hoặc Function, ưu tiên trả về result
  const isObject = (typeof result === 'object' && result !== null) || typeof result === 'function';
  return isObject ? result : instance;
}

/**
 * Polyfill tối giản mô phỏng Object.create
 */
export function myObjectCreate(proto) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null');
  }
  function F() {}
  F.prototype = proto;
  const obj = new F();
  if (proto === null) {
    Object.setPrototypeOf(obj, null);
  }
  return obj;
}

describe('Bài 10: Function Constructor, new Operator Internals & Object.create()', () => {
  it('1. Polyfill myNew mô phỏng chính xác toán tử new thông thường', () => {
    function User(name, age) {
      this.name = name;
      this.age = age;
    }
    User.prototype.greet = function () {
      return `Xin chào, tôi là ${this.name}`;
    };

    const userBuiltIn = new User('Nam', 25);
    const userCustom = myNew(User, 'Nam', 25);

    expect(userCustom.name).toBe('Nam');
    expect(userCustom.age).toBe(25);
    expect(userCustom.greet()).toBe('Xin chào, tôi là Nam');
    expect(Object.getPrototypeOf(userCustom)).toBe(User.prototype);
    expect(userCustom instanceof User).toBe(true);
  });

  it('2. Bẫy return trong Constructor: Return Primitive hoặc null thì new bỏ qua, trả về instance', () => {
    function ReturnPrimitive(name) {
      this.name = name;
      return 'Chuỗi nguyên thủy'; // Primitive bị bỏ qua
    }

    function ReturnNull(name) {
      this.name = name;
      return null; // null là primitive typeof 'object' nhưng bị bỏ qua
    }

    const inst1 = new ReturnPrimitive('Test 1');
    const inst2 = myNew(ReturnPrimitive, 'Test 1');
    expect(inst1.name).toBe('Test 1');
    expect(inst2.name).toBe('Test 1');

    const inst3 = new ReturnNull('Test 2');
    const inst4 = myNew(ReturnNull, 'Test 2');
    expect(inst3.name).toBe('Test 2');
    expect(inst4.name).toBe('Test 2');
  });

  it('3. Bẫy return trong Constructor: Return Object thì new trả về object đó thay vì instance', () => {
    const overrideObj = { special: 'Vật thể ghi đè' };

    function ReturnObject(name) {
      this.name = name;
      return overrideObj; // Ghi đè hoàn toàn instance
    }

    const inst1 = new ReturnObject('Bob');
    const inst2 = myNew(ReturnObject, 'Bob');

    expect(inst1).toBe(overrideObj);
    expect(inst2).toBe(overrideObj);
    expect(inst1.name).toBeUndefined();
  });

  it('4. new.target xác định hàm có được gọi bằng toán tử new hay không', () => {
    let capturedTarget = null;
    function CheckInvocation() {
      capturedTarget = new.target;
      return this;
    }

    // Gọi thông thường -> new.target là undefined
    CheckInvocation();
    expect(capturedTarget).toBeUndefined();

    // Gọi với new -> new.target trỏ tới chính hàm CheckInvocation
    new CheckInvocation();
    expect(capturedTarget).toBe(CheckInvocation);
  });

  it('5. Safe Constructor Pattern: Tự động khởi tạo new khi người dùng quên từ khóa new', () => {
    function SafeUser(name) {
      if (!new.target) {
        return new SafeUser(name);
      }
      this.name = name;
    }

    // @ts-ignore: cố tình gọi không có new
    const user = SafeUser('Hoàng');
    expect(user instanceof SafeUser).toBe(true);
    expect(user.name).toBe('Hoàng');
  });

  it('6. Polyfill myObjectCreate thiết lập prototype mà không gọi constructor', () => {
    const animal = {
      isLiving: true,
      eat() { return 'eating'; },
    };

    const cat = myObjectCreate(animal);
    cat.meow = () => 'meow';

    expect(cat.meow()).toBe('meow');
    expect(cat.eat()).toBe('eating');
    expect(cat.isLiving).toBe(true);
    expect(Object.getPrototypeOf(cat)).toBe(animal);
  });
});
