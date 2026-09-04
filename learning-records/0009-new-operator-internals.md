# Function Constructor, new Operator Internals & Object.create()

Người học làm chủ 4 bước thực thi bí mật của toán tử `new` (kích hoạt internal method `[[Construct]]` theo ECMA-262 §13.3.5.1):
1. Tạo object mới trên Memory Heap.
2. Thiết lập liên kết prototype: `instance.[[Prototype]] = Constructor.prototype`.
3. Kích hoạt Constructor với ngữ cảnh `this` trỏ thẳng vào `instance`.
4. The Return Trap: Nếu Constructor trả về một Object/Function thì trả về Object đó (ghi đè instance); nếu trả về Primitive (kể cả `null`) thì bỏ qua và trả về `instance` ban đầu.

Tự tay live-coding polyfill `myNew(Constructor, ...args)` mô phỏng chuẩn xác 100% hành vi của Engine. Phân biệt rạch ròi giữa `new Constructor()` (có chạy code khởi tạo) và `Object.create(proto)` (chỉ nối prototype thuần túy mà không kích hoạt hàm). Ứng dụng thành thạo meta-property `new.target` trong ES6 để xây dựng Safe Constructor Pattern (tự động kích hoạt `new` khi người dùng gọi hàm theo cách thông thường).

## Implications
Nền tảng trực tiếp để tiến vào Bài 11: So sánh Prototypal Inheritance cổ điển (kế thừa ký sinh Parasitic Combination Inheritance) vs ES6 Classes, cơ chế Subclassing với từ khóa `extends`, lý do tại sao bắt buộc phải gọi `super()` trước khi dùng `this` và bản chất của Private Fields (`#field`).
