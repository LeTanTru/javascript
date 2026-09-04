# Async/Await, Fetch API & AbortController trong React

Người học làm chủ quy trình Data Fetching và kiểm soát Side Effects bất đồng bộ trong React:

1. **Clean useEffect Async Pattern**:
   - Khai báo async function bên trong effect callback; không truyền trực tiếp async function vào useEffect (để bảo vệ cơ chế Cleanup function).
2. **Kiểm tra `response.ok`**:
   - `fetch()` chỉ reject khi gặp lỗi mạng phần cứng/CORS. Các mã lỗi HTTP 404/500 vẫn resolve bình thường, cần ném exception thủ công qua `if (!res.ok)`.
3. **Chống Race Conditions**:
   - Giải pháp 1: Boolean `ignore` flag trong effect scope.
   - Giải pháp 2 (Best Practice): `AbortController` truyền `signal` vào `fetch()` và gọi `controller.abort()` trong cleanup function.
4. **Lọc bỏ `AbortError`**:
   - Bỏ qua exception `err.name === 'AbortError'` trong khối `catch` khi component unmount để tránh set state lỗi giả.

## Implications
Hoàn thành Bài 41 của Module 11. Toàn bộ 42 test suites (255/255 unit tests) chạy XANH 100%. Sẵn sàng tiến vào Bài 42: Logic & Conditional Rendering trong JSX (Bài học cuối cùng của toàn bộ khóa học).
