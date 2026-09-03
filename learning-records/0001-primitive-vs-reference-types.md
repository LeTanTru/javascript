# Primitive vs Reference Types & Memory Model (Call Stack vs Heap)

Người học đã làm chủ mô hình phân bổ bộ nhớ của V8 Engine: 7 kiểu Primitive lưu trực tiếp theo giá trị (Value) trên Call Stack và có tính bất biến (Immutable), trong khi Reference Types cấp phát vùng nhớ động trên Heap và biến chỉ lưu con trỏ tham chiếu (Reference Pointer). Đã hiểu rõ bản chất JavaScript là Pass-by-sharing (Pass-by-value đối với địa chỉ tham chiếu), phân biệt được Đột biến (Mutation) vs Gán lại (Reassignment), và nắm vững giải pháp `structuredClone()` để né bẫy Shallow Copy.

## Implications
Đủ tiền đề vững chắc để tiếp tục đào sâu sang Bài 02 về cơ chế Ép kiểu ngầm (Type Coercion) và thuật toán `ToPrimitive`, `ToNumber`, `ToString` theo chuẩn ECMA-262 mà không bị nhầm lẫn giữa kiểu giá trị và kiểu tham chiếu.
