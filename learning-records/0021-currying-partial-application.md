# Pure Functions, Currying & Partial Application

Người học làm chủ các khái niệm cốt lõi của Functional Programming trong JavaScript:

1. **Pure Functions**: Thỏa mãn tính xác định (Deterministic - cùng input ra cùng output) và không có side effects (không mutate biến ngoài/tham số, không I/O).
2. **Arity & `fn.length`**: Hiểu quy tắc tính số lượng tham số của hàm (dừng lại trước tham số có default value đầu tiên, bỏ qua rest parameters).
3. **Currying**: Kỹ thuật chuyển đổi hàm $N$ tham số thành chuỗi $N$ hàm unary $f(a)(b)(c)...$ Tự cài đặt hàm `curry` hỗ trợ nhận nhiều đối số và bảo toàn `this`.
4. **Curry with Placeholder (`_`)**: Mở rộng `curry` cho phép truyền ký tự giữ chỗ để điền tham số theo vị trí bất kỳ (chuẩn Lodash/Ramda).
5. **Partial Application**: Cố định trước $K$ tham số, trả về hàm nhận toàn bộ $N - K$ tham số còn lại trong lần gọi tiếp theo (so sánh với `Function.prototype.bind`).
6. **Ứng dụng thực tế**: Xây dựng Custom Logger, Data Pipelines (Point-free style) và Event Handlers trong React.

## Implications
Đặt nền tảng tư duy biến đổi hàm cho Bài 23: Live-coding Debounce & Throttle (Leading, Trailing & Cancel options).
