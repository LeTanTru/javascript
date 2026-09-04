# Execution Context: Creation Phase vs Execution Phase & Variable Object

Người học chính thức bước vào Module 02 (Execution Context, Scope Chain & Closures), nắm trọn vẹn mô hình hoạt động của 3 loại Execution Context (Global, Function, Eval). Hiểu sâu sắc 2 giai đoạn vòng đời của một context: Creation Phase (quét khởi tạo Variable Object, liên kết Scope Chain, xác định `this`) và Execution Phase (thực thi mã từ trên xuống). Nắm vững cơ chế ưu tiên trong Creation Phase: Function Declaration được cất vào VO với tham chiếu hàm hoàn chỉnh, trong khi `var` được đăng ký với giá trị mặc định `undefined` (và bị bỏ qua nếu trùng tên Function). Phân tích chính xác tại sao gọi sớm Function Expression gây TypeError thay vì ReferenceError. Nắm rõ cơ chế Push/Pop của Call Stack và hiện tượng Stack Overflow.

## Implications
Đầy đủ tiền đề để tiến vào Bài 06: Hoisting, Temporal Dead Zone (TDZ) và sự khác biệt bản chất giữa `var` vs `let` vs `const` trong Declarative Environment Record của ES6.
