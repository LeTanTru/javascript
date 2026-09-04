import { describe, it, expect } from 'vitest';

// ─── SIMULATION MODEL: V8 JIT COMPILATION & DEOPTIMIZATION ────────────────────

export class MockV8Function {
  constructor(name, fn) {
    this.name = name;
    this.fn = fn;
    this.invocationCount = 0;
    this.tier = 'IGNITION_BYTECODE'; // 'IGNITION_BYTECODE' -> 'TURBOFAN_OPTIMIZED'
    this.feedbackTypes = new Set();
    this.deoptCount = 0;
    this.optimizationThreshold = 5; // Hot function threshold
  }

  call(context, ...args) {
    this.invocationCount++;

    // Thu thập Type Feedback
    const argTypes = args.map((arg) => typeof arg).join(',');

    if (this.tier === 'TURBOFAN_OPTIMIZED') {
      // Kiểm tra xem kiểu tham số có khớp với giả định tối ưu trước đó không (Speculative Assumption)
      if (!this.feedbackTypes.has(argTypes)) {
        // BAILOUT / DEOPTIMIZATION!
        this.tier = 'IGNITION_BYTECODE';
        this.deoptCount++;
      }
    } else {
      this.feedbackTypes.add(argTypes);

      // Nếu hàm được gọi nhiều lần và chỉ có đúng 1 kiểu tham số (Monomorphic)
      if (this.invocationCount >= this.optimizationThreshold && this.feedbackTypes.size === 1) {
        this.tier = 'TURBOFAN_OPTIMIZED';
      }
    }

    return this.fn.apply(context, args);
  }
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 08 - Bài 32: V8 Engine Pipeline (Ignition & TurboFan)', () => {
  it('1. Ignition Bytecode: Hàm khởi đầu được thông dịch bằng Bytecode Interpreter', () => {
    const v8Add = new MockV8Function('add', (a, b) => a + b);

    expect(v8Add.tier).toBe('IGNITION_BYTECODE');
    expect(v8Add.invocationCount).toBe(0);

    const result = v8Add.call(null, 10, 20);
    expect(result).toBe(30);
    expect(v8Add.tier).toBe('IGNITION_BYTECODE');
  });

  it('2. TurboFan JIT Optimization: Hàm "Hot" với kiểu đồng nhất được tối ưu hóa thành Machine Code', () => {
    const v8Multiply = new MockV8Function('multiply', (a, b) => a * b);

    // Gọi liên tục 5 lần với kiểu (number, number)
    for (let i = 0; i < 5; i++) {
      v8Multiply.call(null, i, 2);
    }

    // Đạt ngưỡng tối ưu -> TurboFan kích hoạt
    expect(v8Multiply.tier).toBe('TURBOFAN_OPTIMIZED');
    expect(v8Multiply.feedbackTypes.has('number,number')).toBe(true);
    expect(v8Multiply.deoptCount).toBe(0);
  });

  it('3. Deoptimization (Bailout): Thay đổi kiểu đối số đột ngột khiến TurboFan huỷ tối ưu', () => {
    const v8ConcatOrAdd = new MockV8Function('calc', (a, b) => a + b);

    // Huấn luyện hàm với number (Hot function)
    for (let i = 0; i < 5; i++) {
      v8ConcatOrAdd.call(null, i, 10);
    }
    expect(v8ConcatOrAdd.tier).toBe('TURBOFAN_OPTIMIZED');

    // Bất ngờ truyền string -> Phá vỡ giả định kiểu (Type Assumption Violation)
    const stringResult = v8ConcatOrAdd.call(null, 'Hello ', 'World');

    expect(stringResult).toBe('Hello World');
    // Rớt xuống lại Ignition Bytecode (Deoptimization)
    expect(v8ConcatOrAdd.tier).toBe('IGNITION_BYTECODE');
    expect(v8ConcatOrAdd.deoptCount).toBe(1);
  });

  it('4. Monomorphic vs Polymorphic: Hàm nhận nhiều kiểu khác nhau ngay từ đầu sẽ không được tối ưu sớm', () => {
    const v8Polymorphic = new MockV8Function('poly', (a, b) => a + b);

    v8Polymorphic.call(null, 1, 2);           // number,number
    v8Polymorphic.call(null, 'a', 'b');       // string,string
    v8Polymorphic.call(null, 1, 'b');         // number,string
    v8Polymorphic.call(null, true, false);    // boolean,boolean
    v8Polymorphic.call(null, {}, {});         // object,object

    // Vì feedbackTypes có 5 kiểu khác nhau -> không thể suy luận speculative optimization đơn giản
    expect(v8Polymorphic.feedbackTypes.size).toBe(5);
    expect(v8Polymorphic.tier).toBe('IGNITION_BYTECODE');
  });

  it('5. Các tầng Compiler của V8 hiện đại (Ignition -> Sparkplug -> Maglev -> TurboFan)', () => {
    const v8PipelineStages = [
      { name: 'Scanner / Lexer', role: 'Biến chuỗi ký tự nguồn thành Tokens' },
      { name: 'Parser', role: 'Biến Tokens thành Abstract Syntax Tree (AST)' },
      { name: 'Ignition', role: 'Biến AST thành Bytecode và thu thập Type Feedback' },
      { name: 'Sparkplug', role: 'Trình biên dịch cơ bản không tối ưu (Non-optimizing Baseline Compiler)' },
      { name: 'Maglev', role: 'Biên dịch tối ưu tầm trung (Mid-tier JIT Compiler)' },
      { name: 'TurboFan', role: 'Biên dịch tối ưu hóa cao cấp dựa trên Speculative Feedback' },
    ];

    expect(v8PipelineStages.length).toBe(6);
    expect(v8PipelineStages[2].name).toBe('Ignition');
    expect(v8PipelineStages[5].name).toBe('TurboFan');
  });

  it('6. Quy tắc viết code thân thiện với JIT (JIT-Friendly Code)', () => {
    function isJITFriendly(functionUsagePattern) {
      // Monomorphic arguments & constant object shape
      return functionUsagePattern.consistentTypes && !functionUsagePattern.dynamicDelete;
    }

    expect(isJITFriendly({ consistentTypes: true, dynamicDelete: false })).toBe(true);
    expect(isJITFriendly({ consistentTypes: false, dynamicDelete: false })).toBe(false);
    expect(isJITFriendly({ consistentTypes: true, dynamicDelete: true })).toBe(false);
  });
});
