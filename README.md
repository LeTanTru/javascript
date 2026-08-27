# 🚀 JavaScript Core Mastery for Frontend Interview (2025/2026 Edition)

Kho lưu trữ tài liệu, bài giảng tương tác và hệ thống câu hỏi phỏng vấn thực chiến chuyên sâu về **JavaScript Core, V8 Engine & Browser Runtime** dành cho Frontend Engineers (chuẩn bị phỏng vấn Junior+, Middle, Senior & Lead).

---

## 🎯 Mục tiêu & Tôn chỉ học tập

1. **Hiểu bản chất tầng sâu (Under the hood)**: Đi sâu vào cơ chế của ECMAScript 2026 Specification, V8 Engine (Ignition & TurboFan), mô hình bộ nhớ (Call Stack / Heap / WeakRef) và Browser Rendering Pipeline.
2. **Cập nhật chuẩn Web mới nhất (2025/2026)**: Tích hợp các tính năng hiện đại như `Promise.withResolvers()`, `AbortController`/`AbortSignal` cancellation patterns, `Proxy` & `Reflect` meta-programming (Reactivity / Signals), `structuredClone`, và `WeakRef`/`FinalizationRegistry`.
3. **Thực chiến phỏng vấn (Interview-Ready)**: Mọi bài học đều tích hợp **"Góc Phỏng Vấn" (Interview Corner)** phân tích các câu hỏi kinh điển trích từ phỏng vấn Meta, Google, Uber, Amazon, ByteDance, kèm bẫy code output hóc búa và kỹ thuật trả lời súc tích theo phương pháp Top-Down / STAR.
4. **Live-coding Polyfills chuẩn mực**: Tự tay viết trọn vẹn các hàm utility kinh điển (`Promise`, `Promise.all`, `Promise.withResolvers`, `p-limit` Concurrency Limiter, `bind`, `call`, `apply`, `debounce`, `throttle`, `deepClone`, `EventEmitter`, `curry`, `LRU Cache`, `deepEqual`) trong 10–15 phút.

---

## 🗺️ Lộ trình đào tạo toàn diện (Curriculum Roadmap)

Khóa học được chia làm **11 Module chuyên sâu (~39 bài học)**:

| Module | Tên Module | Trọng tâm phỏng vấn thực tế | Số bài |
| :--- | :--- | :--- | :---: |
| **Module 00** | **Môi trường & Sân tập (Playground Setup)** | Node.js 22+, Vitest, Chrome DevTools Memory Profiling, AST Explorer | 1 bài |
| **Module 01** | **Data Types, Memory Model & Type Coercion** | Stack vs Heap, `ToPrimitive`, Truthy/Falsy, `==` vs `===` vs `Object.is()`, Symbol/BigInt | 4 bài |
| **Module 02** | **Execution Context, Scope Chain & Closures** | Hoisting, TDZ, Lexical Environment, Closure internals, Memory Leaks | 4 bài |
| **Module 03** | **Objects, Prototype & Meta-Programming** | `[[Prototype]]`, `__proto__` vs `prototype`, `new`, ES6 Classes, `Proxy` & `Reflect` (Reactivity) | 4 bài |
| **Module 04** | **Cơ chế `this` & Function Internals** | 4 quy tắc `this` binding, Arrow functions, Polyfill `call`, `apply`, `bind` | 3 bài |
| **Module 05** | **Bất đồng bộ, Event Loop & Concurrency** | Microtasks vs Macrotasks, `Promise.withResolvers`, `AbortController` race conditions, `p-limit` | 7 bài |
| **Module 06** | **Functional Programming & Live-Coding Polyfills** | Currying, `debounce`/`throttle`, `deepClone` (circular refs), `EventEmitter`, `LRU Cache`, `deepEqual` | 6 bài |
| **Module 07** | **DOM, Browser Engine & Web APIs** | Critical Rendering Path, Layout Thrashing, Event Delegation, Web Workers, Core Web Vitals | 4 bài |
| **Module 08** | **V8 Engine Internals & Tối ưu bộ nhớ** | Ignition & TurboFan, Hidden Classes (Shapes), Inline Caching, `WeakRef`/`FinalizationRegistry` | 3 bài |
| **Module 09** | **Module Systems & Tooling Under The Hood** | ESM vs CommonJS (CJS), Live Bindings, Top-level `await`, Circular Dependencies | 1 bài |
| **Module 10** | **Tổng ôn & Mock Interview thực chiến** | 50+ Trick Code Output, Live-coding giả lập phân loại Senior, Chiến lược trả lời STAR/Top-Down | 3 bài |

> **Tổng quy mô**: ~39 bài học tương tác + Cheat-sheets in ấn định kỳ + Bộ đề Live-coding kiểm thử bằng Vitest.

---

## 📂 Cấu trúc Repository

```text
├── .agents/
│   └── skills/teach/           # Cấu hình chuẩn giảng dạy và asset template
├── lessons/                    # Các bài giảng tương tác định dạng HTML (.html)
│   ├── index.html              # Mục lục lộ trình toàn khóa (Dashboard tiến độ)
│   ├── lesson.css              # Design system Dark mode chuẩn mực
│   ├── lesson-enhance.js       # Script tương tác: Copy code, Quiz, Hotkeys
│   └── 0000-playground-setup.html  # (Các bài học từ 0000 -> ...)
├── reference/                  # Cheat-sheets tóm tắt lý thuyết, in ấn nhanh
├── learning-records/           # Nhật ký ghi nhận tiến độ & điểm cần củng cố
├── practice/                   # Sân tập code thực hành & bộ test Vitest
├── GLOSSARY.md                 # Từ điển thuật ngữ chuẩn ECMAScript & V8
├── MISSION.md                  # Mục tiêu cá nhân hóa & tôn chỉ khóa học
├── RESOURCES.md                # Nguồn tài liệu chính thống (Specs, MDN, V8, GreatFrontEnd)
└── README.md                   # Tổng quan dự án
```

---

## 🖥️ Hướng dẫn học tập & Mở bài giảng

### 1. Xem mục lục & Dashboard tiến độ
Mở file mục lục trong trình duyệt web:
- **Windows PowerShell**:
  ```powershell
  Start-Process lessons/index.html
  ```
- **macOS / Linux**:
  ```bash
  open lessons/index.html   # macOS
  xdg-open lessons/index.html # Linux
  ```

### 2. Phương pháp học hiệu quả
1. **Đọc bài học (`lessons/*.html`)**: Tập trung vào phần *"Vì sao"* và *"Đánh đổi"*.
2. **Tương tác Quiz**: Chọn đáp án trực tiếp trong bài học để nhận phản hồi phân tích ngay lập tức.
3. **Thực hành tại `practice/`**: Mở editor, tự tay gõ lại các ví dụ và chạy thử các test case.
4. **Phản hồi cùng AI Assistant**: Đặt câu hỏi chất vấn sâu, yêu cầu giải thích thêm hoặc yêu cầu review code trực tiếp sau mỗi bài học.

---

## 📜 Tài liệu tham khảo chính thức (High-Trust Resources)
- [ECMA-262 ECMAScript® Specification (2026)](https://tc39.es/ecma262/)
- [MDN Web Docs — JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Google V8 Engine Documentation](https://v8.dev/blog)
- [You Don't Know JS Yet — Kyle Simpson](https://github.com/getify/You-Dont-Know-JS)
- [GreatFrontEnd Interview Platform](https://www.greatfrontend.com/)

---
*Tạo bởi `/teach` skill — Thiết kế tối ưu cho trải nghiệm học tập sâu và phỏng vấn kỹ thuật đỉnh cao.*
