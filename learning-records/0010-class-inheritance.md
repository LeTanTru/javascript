# Prototypal Inheritance vs ES6 Classes, super & Private Fields (#field)

Người học phân tích sâu sắc bản chất Syntactic Sugar của ES6 Classes: Class không phải là mô hình hướng đối tượng mới mà vận hành 100% trên Prototype Chain. Nắm vững 4 quy tắc bảo vệ của Class so với hàm thường: bắt buộc gọi bằng `new` (ném TypeError nếu thiếu), tự động chạy Strict Mode, dính TDZ trong Creation Phase, và các methods đều là non-enumerable.

Giải mã cơ chế Subclassing và lý do bắt buộc phải gọi `super()` trước khi truy cập `this`: trong ES6 `extends`, Base Class chịu trách nhiệm khởi tạo và cấp phát ô nhớ cho `this`, Derived Class chỉ nhận được tham chiếu `this` sau khi `super()` chạy xong (vi phạm ném ReferenceError). Nắm rõ mô hình kế thừa kép trong ES6 Class: Instance Prototype Chain (`Child.prototype` kế thừa `Parent.prototype`) và Static Prototype Chain (`Child` kế thừa trực tiếp từ `Parent`).

Làm chủ tính năng ES2022 Private Fields (`#field`): cơ chế PrivateBrand của V8 ở tầng bytecode tạo ra tính đóng gói tuyệt đối (Hard Private) cấp ngôn ngữ, ném SyntaxError khi truy xuất trái phép ngoài class và hoàn toàn vô hình trước các công cụ reflection.

## Implications
Nền tảng trực tiếp để tiến vào Bài 12: Đỉnh cao siêu lập trình (Meta-Programming) trong JavaScript với `Proxy` và `Reflect` API, 13 internal traps của Engine, so sánh toàn diện với `Object.defineProperty` và tự tay dựng Reactive State Engine (nền tảng của Vue 3 / Signals), hoàn tất Module 03.
