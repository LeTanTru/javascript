# V8 Engine Pipeline: Ignition (Interpreter) & TurboFan (JIT Compiler), Deoptimization

Người học làm chủ kiến trúc biên dịch đa tầng của JavaScript Engine V8:

1. **Kiến trúc Multi-Tier Compilation**:
   - Scanner / Lexer &rarr; Parser (AST).
   - Ignition (Bytecode Interpreter): Khởi động nhanh, sinh bytecode và thu thập Type Feedback Vector.
   - Sparkplug (Baseline Compiler) & Maglev (Mid-tier Compiler).
   - TurboFan (Optimizing JIT Compiler): Biên dịch bytecode của các Hot Functions thành Machine Code tối ưu cao cấp.
2. **Speculative Optimization & Deoptimization (Bailout)**:
   - TurboFan đưa ra giả định kiểu dựa trên lịch sử chạy (Monomorphic assumptions).
   - Nếu gặp kiểu dữ liệu mới không khớp, TurboFan kích hoạt Deopt: Hủy mã máy và hạ cấp về Ignition Bytecode, gây drop hiệu năng.
3. **Quy tắc JIT-Friendly Code**:
   - Duy trì kiểu tham số nhất quán (Monomorphic).
   - Khởi tạo object với thứ tự thuộc tính cố định.
   - Tránh toán tử `delete obj.prop` (làm vỡ Hidden Class sang Dictionary Mode).
   - Tránh tạo Holey Arrays (mảng chứa lỗ hổng trống).

## Implications
Nền tảng trực tiếp để tiến vào Bài 33: Hidden Classes (Shapes) & Inline Caching (Monomorphic vs Polymorphic vs Megamorphic).
