# ES6+ Syntax thiết yếu cho React: Destructuring, Spread, Rest & Modern Operators

Người học làm chủ các cú pháp JavaScript hiện đại nền tảng cho React:

1. **Clean Props Destructuring**:
   - Khai báo Default Values chống undefined props.
   - Renaming / Aliasing tránh trùng tên biến.
   - Rest Parameters (`...restProps`) chuyển tiếp attributes (`aria-*`, `id`, `style`) cho HTML element gốc.
2. **State Immutability with Spread (`...`)**:
   - React so sánh shallow reference (`Object.is`).
   - Cập nhật nested state bằng cách tạo bản sao tại từng tầng bị biến động, không mutate state cũ.
3. **Dynamic Forms with Computed Property Names**:
   - Gom toàn bộ handler vào 1 hàm duy nhất: `[name]: type === 'checkbox' ? checked : value`.
4. **Nullish Coalescing (`??`) vs Logical OR (`||`)**:
   - `||` nuốt mất giá trị hợp lệ `0`, `""`, `false` (gây bug đếm số lượng giỏ hàng/badge).
   - `??` chỉ kích hoạt fallback khi giá trị là `null` hoặc `undefined`.

## Implications
Hoàn thành Bài 39 của Module 11. Toàn bộ 40 test suites (243/243 unit tests) chạy XANH 100%. Sẵn sàng tiến vào Bài 40: Array Methods & Immutability cho React State.
