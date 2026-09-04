import { describe, it, expect } from 'vitest';

describe('Bài 14: Arrow Functions & Lexical this (Tại sao không có arguments, prototype, new)', () => {
  it('1. Lexical this: Arrow function kế thừa this từ lexical scope cha, không phụ thuộc vào call-site', () => {
    function Timer() {
      this.seconds = 0;

      // Hàm con thông thường: mất this
      this.tickRegular = function (cb) {
        cb();
      };

      // Arrow function: giữ nguyên lexical this của Timer
      this.tickArrow = () => {
        this.seconds += 1;
        return this.seconds;
      };
    }

    const timer = new Timer();

    // Gọi tách rời (mô phỏng callback)
    const standaloneTick = timer.tickArrow;
    expect(standaloneTick()).toBe(1);
    expect(standaloneTick()).toBe(2);
    expect(timer.seconds).toBe(2);
  });

  it('2. call, apply và bind hoàn toàn bất lực trong việc thay đổi this của Arrow Function', () => {
    const contextA = { id: 'A' };
    const contextB = { id: 'B' };

    function createArrow() {
      return () => this.id;
    }

    const getArrowId = createArrow.call(contextA);

    expect(getArrowId()).toBe('A');

    // Thử call với contextB
    expect(getArrowId.call(contextB)).toBe('A');

    // Thử apply với contextB
    expect(getArrowId.apply(contextB)).toBe('A');

    // Thử bind với contextB
    const boundToB = getArrowId.bind(contextB);
    expect(boundToB()).toBe('A');
  });

  it('3. Arrow function không có arguments riêng, nếu truy cập sẽ lấy arguments của hàm cha', () => {
    function outerFunction(a, b) {
      const arrow = () => {
        // @ts-ignore
        return Array.from(arguments);
      };
      return arrow();
    }

    expect(outerFunction('hello', 'world')).toEqual(['hello', 'world']);
  });

  it('4. Arrow function không có internal method [[Construct]], gọi với new ném TypeError', () => {
    const ArrowConstructor = () => {};

    // @ts-ignore
    expect(() => new ArrowConstructor()).toThrow(TypeError);
  });

  it('5. Arrow function không có thuộc tính prototype (tiết kiệm bộ nhớ)', () => {
    const arrow = () => {};
    // @ts-ignore
    expect(arrow.prototype).toBeUndefined();

    function regular() {}
    expect(typeof regular.prototype).toBe('object');
  });

  it('6. Bẫy kinh điển: Khai báo object method bằng arrow function khiến this trỏ ra ngoài object', () => {
    const user = {
      name: 'Khánh',
      // BẪY: Object literal `{}` không tạo Execution Context / Lexical Scope!
      // Lexical scope cha của greetArrow là Global/Module scope
      greetArrow: () => {
        // @ts-ignore
        return typeof this !== 'undefined' ? this.name : undefined;
      },
      // ĐÚNG ĐẮN: Dùng Regular Method
      greetMethod() {
        return this.name;
      },
    };

    expect(user.greetArrow()).toBeUndefined();
    expect(user.greetMethod()).toBe('Khánh');
  });
});
