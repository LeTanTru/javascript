# Arrow Functions & Lexical this (Tại sao không có arguments, prototype, new)

Người học giải mã bản chất tầng sâu của Arrow Functions trong ES6: Arrow Function hoàn toàn không có ràng buộc `this` riêng (No `this` binding) mà tra cứu `this` theo Scope Chain từ môi trường từ vựng (Lexical Environment) bao bọc bên ngoài. Chứng minh bằng thực nghiệm: `call`, `apply` và `bind` hoàn toàn bất lực trong việc thay đổi `this` của Arrow Function (Engine bỏ qua tham số đầu tiên).

Làm rõ nguyên nhân kỹ thuật khiến Arrow Function bị tước bỏ 3 tính năng truyền thống:
1. `arguments`: Không cấp phát đối tượng arguments riêng, truy cập sẽ lấy arguments của hàm cha (chuẩn hóa thay thế bằng Rest Parameters `...args`).
2. `[[Construct]]`: Không có internal method `[[Construct]]` nên ném `TypeError` khi gọi với `new`.
3. `prototype`: Vì không thể làm constructor, Engine không cấp phát thuộc tính `prototype` (`undefined`) để tối ưu hóa bộ nhớ Heap.

Nhận diện và tránh được 3 bẫy dùng sai Arrow Function kinh điển: phương thức trong Object literal (cặp ngoặc `{}` không tạo scope khiến `this` trỏ ra global), phương thức trên Prototype, và DOM Event Listeners cần truy cập phần tử click.

## Implications
Nền tảng trực tiếp để tiến vào Bài 15: Live-coding Polyfills cho `Function.prototype.call`, `apply` và `bind` (kỹ thuật Property Hijacking với Symbol và cài đặt Hard Binding), khép lại Module 04.
