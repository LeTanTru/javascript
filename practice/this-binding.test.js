import { describe, it, expect } from 'vitest';

describe('Bài 13: 4 Quy tắc xác định this & Strict Mode', () => {
  it('1. Default Binding: Trong strict mode (mặc định của ESM), hàm gọi trần có this là undefined', () => {
    function getContext() {
      return this;
    }

    expect(getContext()).toBeUndefined();
  });

  it('2. Implicit Binding: this trỏ tới đối tượng ngay trước dấu chấm tại thời điểm gọi', () => {
    const user = {
      name: 'Hùng',
      greet() {
        return `Tôi là ${this.name}`;
      },
    };

    expect(user.greet()).toBe('Tôi là Hùng');
  });

  it('3. Implicit Binding Loss: Mất liên kết ngầm định khi gán phương thức sang biến mới', () => {
    const person = {
      name: 'Linh',
      getName() {
        return this ? this.name : 'No context';
      },
    };

    const standalone = person.getName;
    // Gọi standalone() là Default Binding -> this là undefined trong ESM
    expect(standalone()).toBe('No context');
  });

  it('4. Explicit Binding (call/apply/bind): Ép buộc this trỏ vào context chỉ định', () => {
    function introduce(greeting, punctuation) {
      return `${greeting}, ${this.name}${punctuation}`;
    }

    const context = { name: 'Thảo' };

    expect(introduce.call(context, 'Xin chào', '!')).toBe('Xin chào, Thảo!');
    expect(introduce.apply(context, ['Hello', '...'])).toBe('Hello, Thảo...');

    const bound = introduce.bind(context, 'Hi');
    expect(bound('~')).toBe('Hi, Thảo~');
  });

  it('5. New Binding có độ ưu tiên cao hơn Hard Binding (bind)', () => {
    function User(name) {
      this.name = name;
    }

    const fixedContext = { name: 'Cố định' };
    const BoundUser = User.bind(fixedContext);

    // Dù đã bind vào fixedContext, từ khóa new vẫn ghi đè và tạo instance mới
    const instance = new BoundUser('Mới sinh');
    expect(instance.name).toBe('Mới sinh');
    expect(fixedContext.name).toBe('Cố định'); // fixedContext không bị biến đổi
    expect(instance instanceof User).toBe(true);
  });

  it('6. Thứ tự ưu tiên xác định this: New > Explicit > Implicit > Default', () => {
    function showVal() {
      return this.val;
    }

    const objA = { val: 'A', show: showVal };
    const objB = { val: 'B' };

    // Implicit
    expect(objA.show()).toBe('A');

    // Explicit thắng Implicit
    expect(objA.show.call(objB)).toBe('B');

    // Hard Binding thắng Implicit
    const hardBound = objA.show.bind(objB);
    objA.show = hardBound;
    expect(objA.show()).toBe('B');
  });
});
