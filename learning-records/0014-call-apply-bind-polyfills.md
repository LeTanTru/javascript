# Live-coding Polyfills: Tự viết Function.prototype.call, apply và bind

Người học làm chủ kỹ thuật thiết kế và hiện thực hóa trọn bộ 3 Polyfills kinh điển của JavaScript: `myCall`, `myApply` và `myBind` theo chuẩn ECMAScript Specification, phục vụ trực tiếp các bài kiểm tra Live-coding Frontend Senior.

Nắm vững các nguyên lý then chốt:
1. **Property Hijacking với Symbol**: Mượn quy tắc Implicit Binding (`context[fnKey]()`) để kích hoạt Explicit Binding mà không dùng API native C++. Dùng `Symbol('fnKey')` đảm bảo thuộc tính tạm thời là độc nhất tuyệt đối, triệt tiêu nguy cơ collision/ghi đè key có sẵn của context object.
2. **Xử lý Biên (Edge cases)**: Fallback về `globalThis` khi context là `null` hoặc `undefined` (theo quy tắc Non-strict mode); tự động bọc primitive values (`number`, `string`, `boolean`) thành Object wrapper qua `Object(context)`.
3. **Partial Application (Currying)**: Đóng gói đối số truyền trước lúc `bind` và đối số truyền sau lúc kích hoạt hàm bound (`[...bindArgs, ...callArgs]`).
4. **Toán tử `new` ghi đè (The `new` Keyword Override)**: Giải thuật nhận diện `this instanceof boundFn` để nhận định khi hàm bound được kích hoạt bằng toán tử `new`. Khi đó, bỏ qua hoàn toàn đối tượng context đã bind và trỏ `this` vào instance mới tạo, bảo toàn chuỗi kế thừa qua `Object.create(originalFn.prototype)`.

## Implications
Khép lại trọn vẹn Module 04 (Cơ chế `this` & Function Internals). Người học nắm trọn kiến thức nền tảng vững chắc để chuyển sang Module 05: Asynchronous JavaScript, Event Loop, Task Queues và Concurrency Control.
