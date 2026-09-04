# 50+ Bẫy JavaScript & Phân tích Code Output kinh điển (Meta / Google / Uber)

Người học làm chủ khả năng phân tích và phản xạ chính xác 100% trước các bẫy code output trong phỏng vấn kỹ thuật:

1. **Function Declaration Scoping (Annex B)**:
   - Khai báo hàm trong block/function scope hoist identifier lên đỉnh hàm, tạo local shadowing variable. Phép gán bên trong chỉ ảnh hưởng local variable.
2. **Sparse Arrays & Array Holes**:
   - Array holes (`[1, , 3]`) bị bỏ qua trong `map()`, `forEach()`, `Object.keys()` nhưng giữ nguyên index length và `in` operator trả về `false`.
3. **Object Key Coercion & Thứ tự duyệt thuộc tính**:
   - Non-symbol keys bị ép về String (`"[object Object]"`). Thứ tự duyệt chuẩn: Số nguyên dương tăng dần -> Insertion order -> Symbols.
4. **Custom Type Coercion (`Symbol.toPrimitive`)**:
   - Thứ tự ưu tiên: `Symbol.toPrimitive(hint)` > `valueOf()` > `toString()`. Phép cộng binary `+` kích hoạt hint `"default"`.
5. **Constructor Return Override**:
   - Return Primitive bị bỏ qua (trả về `this`). Return Object tường minh sẽ ghi đè instance và phá vỡ `instanceof`.
6. **Proxy Invariants**:
   - Proxy get/set traps không thể vi phạm ràng buộc non-writable & non-configurable của target object (ném `TypeError`).

## Implications
Hoàn thành Bài 36 của Module 10. Toàn bộ 37 test suites (231/231 unit tests) chạy XANH 100%. Sẵn sàng tiến vào Bài 37: Giả lập Live-Coding Interview Senior/Lead.
