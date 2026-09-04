# Prototype Chain: Phân biệt prototype vs __proto__ vs [[Prototype]]

Người học chính thức mở màn Module 03 (Objects, Prototype Chain & Meta-Programming). Phân định triệt để bộ ba khái niệm dễ nhầm lẫn nhất trong hướng đối tượng JavaScript:
- `[[Prototype]]`: Internal slot ẩn trong mọi đối tượng theo đặc tả ECMAScript, lưu trữ tham chiếu đến prototype kế thừa. Đỉnh của chuỗi là `Object.prototype` (với `[[Prototype]] === null`).
- `__proto__`: Accessor property (getter/setter) trên `Object.prototype` để tương thích ngược (deprecated). Chuẩn hiện đại dùng `Object.getPrototypeOf()` và `Object.setPrototypeOf()`.
- `prototype`: Thuộc tính object thông thường chỉ tồn tại trên Function Declarations/Expressions và ES6 Classes. Arrow Functions và plain object instances hoàn toàn KHÔNG CÓ thuộc tính `prototype`.

Làm chủ thuật toán duyệt tuyến tính trên Prototype Chain và hiện tượng Property Shadowing (gán thuộc tính con tạo Own Property che khuất cha mà không làm đột biến prototype gốc). Hiểu tác hại hiệu năng của `Object.setPrototypeOf()` đối với Hidden Classes/Inline Caching của V8. Nắm vững kỹ thuật tạo Pure Dictionary sạch tuyệt đối bằng `Object.create(null)`.

## Implications
Nền tảng trực tiếp để tiến vào Bài 10: Giải phẫu 4 bước thần thánh của toán tử `new`, cơ chế Function Constructor, bẫy return object vs primitive và tự tay live-coding polyfill `myNew()`.
