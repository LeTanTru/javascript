import { describe, it, expect } from 'vitest';

describe('Bài 09: Prototype Chain: Phân biệt prototype vs __proto__ vs [[Prototype]]', () => {
  it('1. prototype chỉ tồn tại trên Function Declarations/Expressions thông thường, không có trên instance', () => {
    function Person(name) {
      this.name = name;
    }

    const alice = new Person('Alice');

    // prototype là thuộc tính của constructor function
    expect(typeof Person.prototype).toBe('object');
    // @ts-ignore
    expect(alice.prototype).toBeUndefined();

    // [[Prototype]] của instance trỏ tới Person.prototype
    expect(Object.getPrototypeOf(alice)).toBe(Person.prototype);
    // __proto__ là accessor property truy cập [[Prototype]]
    expect(alice.__proto__).toBe(Person.prototype);
  });

  it('2. Arrow Functions và Object Literals KHÔNG có thuộc tính prototype', () => {
    const arrowFn = () => {};
    // @ts-ignore
    expect(arrowFn.prototype).toBeUndefined();

    const plainObj = { a: 1 };
    // @ts-ignore
    expect(plainObj.prototype).toBeUndefined();

    // Nhưng cả hai đều có [[Prototype]] kế thừa từ Function.prototype và Object.prototype
    expect(Object.getPrototypeOf(arrowFn)).toBe(Function.prototype);
    expect(Object.getPrototypeOf(plainObj)).toBe(Object.prototype);
  });

  it('3. Đỉnh của Prototype Chain là Object.prototype, và [[Prototype]] của nó là null', () => {
    const obj = {};
    const proto1 = Object.getPrototypeOf(obj); // Object.prototype
    const proto2 = Object.getPrototypeOf(proto1); // null

    expect(proto1).toBe(Object.prototype);
    expect(proto2).toBeNull();
  });

  it('4. Prototype Chain Traversal & Property Shadowing: Gán thuộc tính mới tạo own property che khuất cha', () => {
    const proto = {
      greeting: 'Xin chào',
      sayHello() {
        return `${this.greeting} từ Prototype`;
      },
    };

    const child = Object.create(proto);
    // Kế thừa qua prototype chain
    expect(child.greeting).toBe('Xin chào');
    expect(child.sayHello()).toBe('Xin chào từ Prototype');

    // Property Shadowing: gán greeting trên child
    child.greeting = 'Hello';
    expect(child.greeting).toBe('Hello'); // Đọc own property
    expect(proto.greeting).toBe('Xin chào'); // Prototype gốc không bị thay đổi

    // Kiểm tra own property
    expect(Object.hasOwn(child, 'greeting')).toBe(true);
    expect(Object.hasOwn(child, 'sayHello')).toBe(false);
    expect('sayHello' in child).toBe(true); // toán tử `in` kiểm tra cả prototype chain
  });

  it('5. Object.create(null) tạo ra đối tượng không có Prototype Chain ([[Prototype]] === null)', () => {
    const pureDict = Object.create(null);

    expect(Object.getPrototypeOf(pureDict)).toBeNull();
    // @ts-ignore
    expect(pureDict.__proto__).toBeUndefined();
    // Không kế thừa toString hay hasOwnProperty từ Object.prototype
    // @ts-ignore
    expect(pureDict.toString).toBeUndefined();
    // @ts-ignore
    expect(pureDict.hasOwnProperty).toBeUndefined();

    // Thêm key tùy ý không lo bị trùng tên với Object.prototype methods
    pureDict.toString = 'Custom string value';
    expect(pureDict.toString).toBe('Custom string value');
  });

  it('6. Object.setPrototypeOf thay đổi prototype động nhưng khuyến cáo tránh dùng trong production', () => {
    const animal = {
      speak() { return 'Animal noise'; },
    };

    const dog = {
      bark() { return 'Woof!'; },
    };

    Object.setPrototypeOf(dog, animal);
    expect(Object.getPrototypeOf(dog)).toBe(animal);
    // @ts-ignore
    expect(dog.speak()).toBe('Animal noise');
  });
});
