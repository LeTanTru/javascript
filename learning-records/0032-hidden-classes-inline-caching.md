# Hidden Classes (Shapes) & Inline Caching (Monomorphic vs Polymorphic vs Megamorphic)

Người học làm chủ cơ chế tối ưu hóa truy xuất bộ nhớ Object của V8 Engine:

1. **Bản chất Hidden Classes (Shapes / Maps)**:
   - Thay vì tra cứu HashMap động, V8 gán cho mỗi object một Hidden Class chứa các thuộc tính kèm Memory Offset cố định.
   - Cây chuyển đổi Shape (Transition Tree) được xây dựng dựa trên thứ tự thêm thuộc tính: cùng thứ tự $\rightarrow$ cùng Shape; khác thứ tự $\rightarrow$ rẽ nhánh Shape mới.
2. **3 Cấp độ Inline Caching (IC)**:
   - **Monomorphic** (1 Shape duy nhất): Tối ưu tối đa ($O(1)$ direct offset lookup), sinh mã máy đọc thẳng bộ nhớ ngang tốc độ C++.
   - **Polymorphic** (2 đến 4 Shapes): Sinh mã kiểm tra nhánh `switch-case` nhỏ.
   - **Megamorphic** (> 4 Shapes): Vượt ngưỡng cache, từ bỏ IC và chuyển sang tra cứu chậm qua Global Stub / Dictionary Hash Table.
3. **Cạm bẫy của toán tử `delete`**:
   - `delete obj.prop` phá vỡ Shape và hạ cấp Object sang Dictionary Mode (Slow Properties), chậm hơn 10x-50x.
   - Thay thế bằng việc gán `undefined` hoặc `null` để duy trì Fast Mode.

## Implications
Nền tảng trực tiếp để tiến vào Bài 34: Garbage Collection trong V8 & Quản lý bộ nhớ với WeakMap, WeakSet, WeakRef.
