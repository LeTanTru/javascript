# 4 Quy tắc xác định this & Strict Mode

Người học mở màn Module 04 (Cơ chế `this` & Function Internals), làm chủ nguyên lý Call-site: `this` không phụ thuộc vào nơi hàm được định nghĩa mà phụ thuộc 100% vào vị trí và cách thức hàm được kích hoạt tại thời điểm chạy.

Thành thạo thang bậc 4 quy tắc xác định `this` theo độ ưu tiên giảm dần:
1. New Binding: Kích hoạt với `new`, `this` trỏ vào instance mới sinh ra trên Heap.
2. Explicit Binding: Dùng `call`, `apply`, hoặc `bind` (Hard Binding) ép `this` vào context chỉ định.
3. Implicit Binding: Kích hoạt qua dấu chấm `obj.fn()`, `this` trỏ vào calling object.
4. Default Binding: Hàm gọi trần độc lập, `this` là `undefined` trong Strict Mode và `window/global` trong Non-strict Mode.

Phân tích sâu sắc hiện tượng mất liên kết ngầm định (Implicit Binding Loss) khi gán phương thức sang biến mới hoặc truyền làm callback (trong `setTimeout`, DOM event listeners). Chứng minh bằng thực nghiệm: `new Binding` có quyền năng cao nhất, ghi đè cả Hard Binding của `bind()`.

## Implications
Nền tảng trực tiếp để tiến vào Bài 14: Arrow Functions & Lexical `this` (tại sao Arrow Functions hoàn toàn miễn nhiễm trước 4 quy tắc binding này và bị tước bỏ `arguments`, `prototype`, `[[Construct]]`).
