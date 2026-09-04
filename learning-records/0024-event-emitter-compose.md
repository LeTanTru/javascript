# Live-coding: Cài đặt EventEmitter & pipe/compose

Người học làm chủ hai mẫu kiến trúc phần mềm và xử lý luồng dữ liệu quan trọng:

1. **EventEmitter & Pub/Sub Pattern**:
   - Quản lý Map các eventName và danh sách listeners tương ứng.
   - `.on(event, listener)`: Đăng ký và trả về subscription object hỗ trợ `.unsubscribe()`.
   - `.emit(event, ...args)`: Clone mảng listener trước khi lặp để tránh race condition khi listener tự gỡ bỏ chính nó (`.off()` / `.once()`) trong quá trình emit.
   - `.once(event, listener)`: Tạo wrapper tự hủy ngay trước khi chuyển giao kết quả.
2. **Function Composition Pipeline**:
   - `pipe(...fns)`: Kết hợp hàm từ Trái sang Phải (Left-to-Right) bằng `reduce()`, phù hợp tư duy đọc code tự nhiên.
   - `compose(...fns)`: Kết hợp hàm từ Phải sang Trái (Right-to-Left) theo chuẩn Toán học và Redux middleware.
3. **Async Pipeline (`pipeAsync`)**: Hỗ trợ chuỗi async/await biến đổi tuần tự kết quả Promise giữa các hàm.

## Implications
Nền tảng trực tiếp để tiến vào Bài 26: Live-coding Memoize function & LRU Cache implementation bằng JavaScript.
