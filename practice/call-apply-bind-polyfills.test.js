import { describe, it, expect } from 'vitest';

// Cài đặt Polyfill chuẩn interview
Function.prototype.myCall = function (context, ...args) {
  // Nếu context là null hoặc undefined, fallback về globalThis
  // Nếu là primitive (number, string, boolean), Object(context) bọc thành object
  if (context === null || context === undefined) {
    context = globalThis;
  } else {
    context = Object(context);
  }

  // Sử dụng Symbol để tránh collision với key có sẵn của context
  const fnKey = Symbol('fnKey');
  context[fnKey] = this;

  // Thực thi qua Implicit Binding: context.fnKey() -> this trong hàm là context
  const result = context[fnKey](...args);

  // Dọn dẹp thuộc tính tạm thời
  delete context[fnKey];

  return result;
};

Function.prototype.myApply = function (context, argsArray) {
  if (context === null || context === undefined) {
    context = globalThis;
  } else {
    context = Object(context);
  }

  const fnKey = Symbol('fnKey');
  context[fnKey] = this;

  let result;
  if (!argsArray || !Array.isArray(argsArray)) {
    result = context[fnKey]();
  } else {
    result = context[fnKey](...argsArray);
  }

  delete context[fnKey];
  return result;
};

Function.prototype.myBind = function (context, ...bindArgs) {
  const originalFn = this;
  if (typeof originalFn !== 'function') {
    throw new TypeError('Function.prototype.myBind - what is trying to be bound is not callable');
  }

  function boundFn(...callArgs) {
    // Nếu được gọi bằng `new boundFn()`, `this` lúc này là instance của boundFn
    // Quy tắc ECMAScript: new ghi đè bind context!
    const isNewInstance = this instanceof boundFn;
    const targetContext = isNewInstance ? this : (context ?? globalThis);

    return originalFn.apply(targetContext, [...bindArgs, ...callArgs]);
  }

  // Kế thừa prototype của originalFn để new boundFn() có đúng chuỗi prototype
  if (originalFn.prototype) {
    boundFn.prototype = Object.create(originalFn.prototype);
  }

  return boundFn;
};

describe('Module 04 - Polyfills: myCall, myApply, myBind', () => {
  it('myCall: Thực thi hàm với context truyền vào và truyền đối số rời rạc', () => {
    function greet(greeting, punctuation) {
      return `${greeting}, ${this.name}${punctuation}`;
    }
    const user = { name: 'Alice' };

    const result = greet.myCall(user, 'Xin chào', ' !');
    expect(result).toBe('Xin chào, Alice !');
  });

  it('myCall: Xử lý đúng primitive context (number, string) và null/undefined fallback globalThis', () => {
    function getType() {
      return typeof this;
    }
    function getValueOf() {
      return this.valueOf();
    }

    expect(getType.myCall(42)).toBe('object');
    expect(getValueOf.myCall(42)).toBe(42);
    expect(getValueOf.myCall('hello')).toBe('hello');

    function checkGlobal() {
      return this === globalThis;
    }
    expect(checkGlobal.myCall(null)).toBe(true);
    expect(checkGlobal.myCall(undefined)).toBe(true);
  });

  it('myApply: Thực thi hàm với context và danh sách đối số dạng mảng', () => {
    const numbers = [10, 25, 3, 99, 42];
    const max = Math.max.myApply(null, numbers);
    expect(max).toBe(99);

    function sum(a = 0, b = 0, c = 0) {
      return (this.base || 0) + a + b + c;
    }
    expect(sum.myApply({ base: 100 }, [1, 2, 3])).toBe(106);
    expect(sum.myApply({ base: 50 })).toBe(50);
  });

  it('myBind: Ràng buộc context vĩnh viễn và cho phép gọi nhiều lần', () => {
    const user = { name: 'Bob' };
    function introduce(role) {
      return `${this.name} là ${role}`;
    }

    const boundIntroduce = introduce.myBind(user);
    expect(boundIntroduce('Developer')).toBe('Bob là Developer');
    expect(boundIntroduce('Tech Lead')).toBe('Bob là Tech Lead');

    // Gọi call/apply đè lên hàm đã bind cũng không đổi this
    const anotherUser = { name: 'Charlie' };
    expect(boundIntroduce.call(anotherUser, 'Manager')).toBe('Bob là Manager');
  });

  it('myBind: Hỗ trợ Partial Application (Currying arguments gộp đối số lúc bind và lúc gọi)', () => {
    function multiply(a, b, c) {
      return a * b * c;
    }

    const multiplyByTwo = multiply.myBind(null, 2);
    expect(multiplyByTwo(3, 4)).toBe(24);

    const multiplyByTwoAndThree = multiply.myBind(null, 2, 3);
    expect(multiplyByTwoAndThree(5)).toBe(30);
  });

  it('myBind: Hỗ trợ toán tử new ghi đè context đã bind và giữ nguyên prototype', () => {
    function Person(name, age) {
      this.name = name;
      this.age = age;
    }
    Person.prototype.sayHi = function () {
      return `Hi, I'm ${this.name}`;
    };

    const dummyContext = { name: 'Ignored' };
    const BoundPerson = Person.myBind(dummyContext, 'David');

    // Gọi với new: dummyContext phải bị bỏ qua, this trỏ tới instance mới
    const personInstance = new BoundPerson(28);

    expect(personInstance.name).toBe('David');
    expect(personInstance.age).toBe(28);
    expect(personInstance instanceof BoundPerson).toBe(true);
    expect(personInstance instanceof Person).toBe(true);
    expect(personInstance.sayHi()).toBe("Hi, I'm David");
    expect(dummyContext.age).toBeUndefined();
  });
});
