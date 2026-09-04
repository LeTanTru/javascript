# Garbage Collection trong V8 & Quản lý bộ nhớ với WeakMap, WeakSet, WeakRef

Người học làm chủ cơ chế quản lý bộ nhớ tự động và chống rò rỉ bộ nhớ (Memory Leaks) trong V8:

1. **Generational Garbage Collection & Cấu trúc Heap**:
   - The Generational Hypothesis: Đối tượng phần lớn chết trẻ.
   - **New Space (Young Generation)**: Dọn dẹp bằng **Minor GC (Scavenge - Cheney's Copying)**; đối tượng sống sót qua 2 chu kỳ được thăng cấp (Promoted) lên Old Space.
   - **Old Space (Old Generation)**: Dọn dẹp bằng **Major GC (Mark-Sweep-Compact / Orinoco)**; đánh dấu từ GC Roots, thu hồi ô nhớ không dùng và gom dồn chống phân mảnh.
2. **4 Bẫy Memory Leaks phổ biến**:
   - Accidental Global variables.
   - Forgotten Timers (`setInterval`) & uncleaned Event Listeners.
   - Detached DOM Nodes.
   - Closures giữ thừa outer scope references.
3. **Quản lý tham chiếu yếu (Weak References)**:
   - `WeakMap` / `WeakSet`: Giữ weak reference đến object keys, không ngăn cản GC thu hồi, không lặp được (Non-iterable) và không có `.size`.
   - `WeakRef` (ES2021): Tạo tham chiếu yếu truy xuất qua `.deref()` (trả về `undefined` khi đã bị dọn).
   - `FinalizationRegistry` (ES2021): Đăng ký cleanup callback được gọi tự động khi target object bị GC thu hồi.

## Implications
Kết thúc trọn vẹn Module 08: V8 Engine Internals & Tối ưu hóa bộ nhớ. Sẵn sàng bước sang Module 09: Module Systems & Modern Tooling Under The Hood.
