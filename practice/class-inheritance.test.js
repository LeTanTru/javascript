import { describe, it, expect } from 'vitest';

describe('Bài 11: Prototypal Inheritance vs ES6 Classes, super & Private Fields (#field)', () => {
  it('1. Class constructor bắt buộc phải gọi với toán tử new, gọi thường ném TypeError', () => {
    class User {
      constructor(name) {
        this.name = name;
      }
    }

    expect(new User('Alice').name).toBe('Alice');
    // @ts-ignore
    expect(() => User('Bob')).toThrow(TypeError);
  });

  it('2. Subclass constructor bắt buộc phải gọi super() trước khi truy cập this', () => {
    class Parent {
      constructor(name) {
        this.name = name;
      }
    }

    class BrokenChild extends Parent {
      constructor(name) {
        // @ts-ignore: cố tình truy cập this trước super()
        this.title = 'Junior';
        super(name);
      }
    }

    expect(() => new BrokenChild('Nam')).toThrow(ReferenceError);

    class CorrectChild extends Parent {
      constructor(name, role) {
        super(name); // Tạo `this` từ Parent constructor trước
        this.role = role;
      }
    }

    const child = new CorrectChild('Nam', 'Engineer');
    expect(child.name).toBe('Nam');
    expect(child.role).toBe('Engineer');
  });

  it('3. Kế thừa kép trong ES6: Instance prototype chain VÀ Constructor prototype chain (Static inheritance)', () => {
    class Animal {
      static identify() {
        return 'Animal kingdom';
      }
      speak() {
        return 'Sound';
      }
    }

    class Dog extends Animal {
      speak() {
        return 'Bark';
      }
    }

    const dog = new Dog();

    // 1. Instance prototype chain: dog -> Dog.prototype -> Animal.prototype -> Object.prototype
    expect(Object.getPrototypeOf(dog)).toBe(Dog.prototype);
    expect(Object.getPrototypeOf(Dog.prototype)).toBe(Animal.prototype);

    // 2. Static inheritance: Dog kế thừa trực tiếp từ Animal
    expect(Object.getPrototypeOf(Dog)).toBe(Animal);
    expect(Dog.identify()).toBe('Animal kingdom');
  });

  it('4. ES2022 Private Fields (#field): Bảo mật tuyệt đối (Hard Private) cấp ngôn ngữ', () => {
    class BankAccount {
      #balance; // Private field

      constructor(initial) {
        this.#balance = initial;
      }

      deposit(amount) {
        this.#balance += amount;
        return this.#balance;
      }

      getBalance() {
        return this.#balance;
      }
    }

    const acc = new BankAccount(100);
    acc.deposit(50);
    expect(acc.getBalance()).toBe(150);

    // Thuộc tính private hoàn toàn vô hình với reflection / inspection
    // @ts-ignore
    expect(acc['#balance']).toBeUndefined();
    expect(Object.keys(acc)).toEqual([]);
    expect(Object.getOwnPropertyNames(acc)).toEqual([]);
    expect(Object.getOwnPropertySymbols(acc)).toEqual([]);
  });

  it('5. Parasitic Combination Inheritance (ES5): Mô hình tương đương 100% với ES6 extends', () => {
    function Parent(name) {
      this.name = name;
    }
    Parent.prototype.sayName = function () {
      return this.name;
    };

    function Child(name, age) {
      Parent.call(this, name); // Mượn constructor
      this.age = age;
    }

    // Kế thừa prototype mà không gọi Parent constructor lần 2
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;

    Child.prototype.sayAge = function () {
      return this.age;
    };

    const kid = new Child('Bé Bi', 5);
    expect(kid.sayName()).toBe('Bé Bi');
    expect(kid.sayAge()).toBe(5);
    expect(kid instanceof Child).toBe(true);
    expect(kid instanceof Parent).toBe(true);
    expect(kid.constructor).toBe(Child);
  });
});
