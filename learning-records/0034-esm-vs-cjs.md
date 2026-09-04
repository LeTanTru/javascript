# ESM vs CommonJS: Live Bindings, Top-level Await & Xử lý Circular Dependencies

Người học làm chủ kiến trúc Module Systems trong JavaScript và Node.js:

1. **CommonJS (CJS) Internals**:
   - Module Wrapper IIFE: `(function(exports, require, module, __filename, __dirname) { ... })`.
   - Cơ chế **Value Copy**: Primitive values được copy tại thời điểm export; thay đổi nội bộ sau đó không cập nhật sang file import.
   - Cơ chế **require.cache**: Kết quả `module.exports` được cache sau lần nạp đầu tiên.
2. **ECMAScript Modules (ESM) 3-Phase Lifecycle**:
   - **Phase 1: Construction**: Tải source code, phân tích cú pháp tĩnh thành `Module Record` (hỗ trợ Tree-shaking).
   - **Phase 2: Instantiation**: Cấp phát vùng nhớ cho exports và kết nối với imports tạo **Live Bindings** (con trỏ trỏ trực tiếp vào module environment record, luôn đọc giá trị mới nhất).
   - **Phase 3: Evaluation**: Thực thi mã từ lá lên gốc, hỗ trợ **Top-level `await`**.
3. **Circular Dependencies Resolution**:
   - CJS: Trả về **Partial Exports** chưa hoàn thiện khi phát hiện chu kỳ (dễ gây lỗi `undefined`).
   - ESM: Tách rời Instantiation và Evaluation; Function declarations được hoisted an toàn, biến `let/const` chưa thực thi rơi vào **TDZ** (`ReferenceError`).
4. **Modern Tooling & Dual Package Hazard**:
   - Khắc phục xung đột Dual Package bằng cấu hình `exports` field chuẩn (`import`, `require`, `types`) trong `package.json`.
   - Dynamic `import()` nạp module bất đồng bộ trả về Promise chứa Module Namespace Object.

## Implications
Kết thúc trọn vẹn Module 09: Module Systems & Modern Tooling Under The Hood. Toàn bộ 36 test suites (223/223 unit tests) đã hoàn thành và PASS 100%. Sẵn sàng tiến vào Module 10: Tổng ôn & Mock Interview thực chiến.
