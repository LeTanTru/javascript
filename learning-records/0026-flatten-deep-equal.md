# Live-coding: flatten (Array/Object) & deepEqual implementation

Người học làm chủ các giải thuật đệ quy và cấu trúc dữ liệu nền tảng trong JavaScript:

1. **`flattenArray(arr, depth)`**:
   - Sử dụng `reduce()` kết hợp Spread syntax để làm phẳng mảng theo độ sâu `depth`.
   - Hỗ trợ `depth = Infinity` để làm phẳng triệt để mảng lồng nhau vô hạn cấp.
2. **`flattenObject(obj, prefix, delimiter)`**:
   - Biến đổi cây object phân cấp lồng nhau thành object 1 cấp dạng Dot Notation (`a.b.c: 1`).
   - Xử lý các edge-cases: `Date`, `RegExp`, `null` và object rỗng `{}`.
3. **`deepEqual(a, b)`**:
   - So sánh Primitives với `Object.is(a, b)` (xử lý chính xác `NaN === NaN` và `+0 !== -0`).
   - Kiểm tra `constructor` để loại trừ các kiểu dữ liệu khác nhau (Array vs Object).
   - So sánh chuyên biệt cho `Date` (getTime) và `RegExp` (source & flags).
   - Duyệt `Reflect.ownKeys()` để so sánh đệ quy toàn bộ properties, bao gồm cả Symbol keys.

## Implications
Kết thúc trọn vẹn Module 06: Functional Programming & Utility Polyfills. Sẵn sàng bước sang Module 07: DOM, Browser Engine & Web APIs.
