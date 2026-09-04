import { describe, it, expect } from 'vitest';

/**
 * MODULE 09: MODULE SYSTEMS (ESM vs COMMONJS)
 * Kiểm tra các cơ chế cốt lõi:
 * 1. CJS Module Wrapper & require.cache
 * 2. CJS (Value Copy) vs ESM (Live Bindings)
 * 3. Circular Dependencies resolution trong CJS vs ESM
 * 4. Dual Package Hazard & __esModule interop
 * 5. ESM 3-Phase Lifecycle (Construction -> Instantiation -> Evaluation)
 * 6. Dynamic import() vs Static import
 */

describe('Module 09 - Module Systems (ESM vs CommonJS)', () => {

  // 1. CJS Module Wrapper & require.cache simulation
  it('1. CJS Module Wrapper bọc code trong IIFE và cache kết quả module.exports', () => {
    // CJS Module Wrapper: (function (exports, require, module, __filename, __dirname) { ... });
    const moduleCache = {};
    let executionCount = 0;

    function customRequire(moduleId) {
      if (moduleCache[moduleId]) {
        return moduleCache[moduleId].exports;
      }

      const module = {
        id: moduleId,
        exports: {}
      };
      // Gán trước vào cache để hỗ trợ circular dependencies
      moduleCache[moduleId] = module;

      // Giả lập code module được bọc bởi CJS Wrapper
      function moduleWrapper(exports, require, module, __filename, __dirname) {
        executionCount++;
        module.exports = {
          name: 'Antigravity Module',
          count: executionCount
        };
      }

      moduleWrapper(module.exports, customRequire, module, `/path/${moduleId}.js`, '/path');
      return module.exports;
    }

    const mod1 = customRequire('app');
    const mod2 = customRequire('app');

    expect(mod1).toBe(mod2); // Cùng tham chiếu từ cache
    expect(executionCount).toBe(1); // Chỉ thực thi 1 lần duy nhất nhờ require.cache
  });

  // 2. CJS Value Copy vs ESM Live Bindings
  it('2. CJS xuất bản sao giá trị (Value Copy) trong khi ESM xuất Live Bindings', () => {
    // Giả lập CJS: Copy giá trị tại thời điểm export
    function createCJSModule() {
      let count = 0;
      function increment() { count++; }
      // module.exports copy giá trị count tại thời điểm gán
      return {
        count: count,
        increment
      };
    }

    const cjs = createCJSModule();
    cjs.increment();
    // Giá trị cjs.count không đổi vì chỉ là bản copy nguyên thủy (Primitive Copy)
    expect(cjs.count).toBe(0);

    // Giả lập ESM: Live Bindings (Trỏ trực tiếp vào Module Environment Record)
    function createESMModule() {
      let count = 0;
      return {
        get count() { return count; }, // Getter mô phỏng Live Binding
        increment() { count++; }
      };
    }

    const esm = createESMModule();
    esm.increment();
    esm.increment();
    // Live binding phản ánh ngay lập tức giá trị mới nhất
    expect(esm.count).toBe(2);
  });

  // 3. Circular Dependencies trong CommonJS
  it('3. CommonJS xử lý Circular Dependencies bằng cách trả về partial exports chưa hoàn thiện', () => {
    const moduleCache = {};

    function runCircularCJS() {
      const logs = [];

      function requireA() {
        if (moduleCache['a']) return moduleCache['a'].exports;
        const moduleA = { id: 'a', exports: {} };
        moduleCache['a'] = moduleA;

        moduleA.exports.loaded = false;
        // A requires B
        const b = requireB();
        moduleA.exports.bLoaded = b.loaded;
        moduleA.exports.loaded = true;
        return moduleA.exports;
      }

      function requireB() {
        if (moduleCache['b']) return moduleCache['b'].exports;
        const moduleB = { id: 'b', exports: {} };
        moduleCache['b'] = moduleB;

        moduleB.exports.loaded = false;
        // B requires A (vòng lặp) -> A đang thực thi dở, nhận partial exports
        const a = requireA();
        moduleB.exports.aLoadedDuringB = a.loaded; // lúc này a.loaded = false
        moduleB.exports.loaded = true;
        return moduleB.exports;
      }

      const a = requireA();
      return { a, b: moduleCache['b'].exports };
    }

    const result = runCircularCJS();
    // B nhận được a.loaded = false vì A chưa chạy xong
    expect(result.b.aLoadedDuringB).toBe(false);
    // Khi hoàn tất toàn bộ graph, cả 2 đều đã loaded = true
    expect(result.a.loaded).toBe(true);
    expect(result.b.loaded).toBe(true);
  });

  // 4. Circular Dependencies trong ESM với Live Bindings & Function Hoisting
  it('4. ESM giải quyết Circular Dependencies thông qua 2-pass: Instantiation trước, Evaluation sau', () => {
    // ESM Phase 1 & 2: Instantiation (cấp phát bindings và hoist functions)
    // Module A: export function getA() { return 'A' + getB(); }
    // Module B: export function getB() { return 'B'; }

    const moduleGraph = {
      moduleA: {
        bindings: {},
        instantiate() {
          this.bindings.getA = () => `A -> ${moduleGraph.moduleB.bindings.getB()}`;
        }
      },
      moduleB: {
        bindings: {},
        instantiate() {
          this.bindings.getB = () => 'B';
        }
      }
    };

    // Phase 2: Instantiation
    moduleGraph.moduleA.instantiate();
    moduleGraph.moduleB.instantiate();

    // Phase 3: Evaluation (Thực thi an toàn vì cả hai bindings đã sẵn sàng)
    const res = moduleGraph.moduleA.bindings.getA();
    expect(res).toBe('A -> B');
  });

  // 5. Dual Package Hazard & Interoperability (__esModule, default import)
  it('5. Xử lý Interop giữa ESM và CJS với cờ __esModule và default fallback', () => {
    function interopRequireDefault(obj) {
      // Babel / TypeScript helper chuẩn
      return (obj && obj.__esModule) ? obj : { default: obj };
    }

    // Module CJS thông thường
    const cjsModule = { hello: 'world' };
    const importedCJS = interopRequireDefault(cjsModule);
    expect(importedCJS.default.hello).toBe('world');

    // Module được biên dịch từ ESM (có cờ __esModule)
    const transpiledESM = {
      __esModule: true,
      default: { hello: 'esm world' },
      hello: 'named'
    };
    const importedESM = interopRequireDefault(transpiledESM);
    expect(importedESM.default.hello).toBe('esm world');
  });

  // 6. Dynamic import() trả về Promise và hỗ trợ Code Splitting / Conditional Loading
  it('6. Dynamic import() trả về Promise chứa Module Namespace Object', async () => {
    async function mockDynamicImport(moduleName) {
      if (moduleName === 'analytics') {
        return {
          [Symbol.toStringTag]: 'Module',
          default: function track(event) { return `Tracked: ${event}`; },
          VERSION: '2.0.0'
        };
      }
      throw new Error(`Cannot find module '${moduleName}'`);
    }

    const analyticsModule = await mockDynamicImport('analytics');
    expect(typeof analyticsModule.default).toBe('function');
    expect(analyticsModule.default('button_click')).toBe('Tracked: button_click');
    expect(analyticsModule.VERSION).toBe('2.0.0');
  });

});
