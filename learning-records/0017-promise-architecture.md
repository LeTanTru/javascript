# Promise Architecture: State Machine, .then Chaining & Error Propagation

Người học giải phẫu kiến trúc bên trong của Promise trong JavaScript theo chuẩn Promises/A+ Specification và ECMAScript:

1. **Promise State Machine**: Mô hình 3 trạng thái bất biến — `pending`, `fulfilled`, `rejected`. Khi đã Settled (không còn pending), Promise không thể thay đổi trạng thái lần nữa; mọi lần gọi `resolve()` hay `reject()` tiếp theo đều bị Engine bỏ qua.

2. **Promise Chaining & Promise Resolution Procedure**: `.then()` luôn tạo ra một Promise mới và đăng ký handler vào callback queue qua Microtask Queue. Giá trị trả về của handler (primitive, object hoặc Promise khác) sẽ resolve Promise mới; nếu handler ném lỗi, Promise mới sẽ tự động bị rejected.

3. **Error Propagation (Lan truyền lỗi nhảy cóc)**: Lỗi trong `.then()` không bị hấp thụ tại chỗ; nó lan truyền qua toàn bộ chuỗi `.then()` tiếp theo và chỉ dừng lại tại `.catch()` đầu tiên bắt được. Sau khi `.catch()` xử lý và trả về giá trị bình thường, chuỗi khôi phục về trạng thái fulfilled.

4. **Cài đặt TinyPromise**: Triển khai Promise tối giản với Private Fields (#state, #value), 2 mảng callbacks, `.then()` tạo Promise con và `.catch()`, `.finally()` đầy đủ theo nguyên lý Closure và `queueMicrotask`.

## Implications
Nền tảng trực tiếp để tiến vào Bài 19: Live-coding Polyfills cho `Promise.all`, `allSettled`, `race`, `any` và `Promise.withResolvers` — các combinators thiết yếu trong async patterns hiện đại.
