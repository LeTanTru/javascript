# Array Methods & Immutability cho React State

Người học làm chủ khả năng thao tác mảng an toàn và bất biến (Immutable Array Operations) trong React:

1. **Bộ 3 thao tác Array State chuẩn mực**:
   - Thêm phần tử: `[...prev, newItem]` (cuối) hoặc `[newItem, ...prev]` (đầu).
   - Xóa phần tử theo ID: `prev.filter(item => item.id !== id)`.
   - Sửa phần tử theo ID: `prev.map(item => item.id === id ? { ...item, ...patch } : item)`.
2. **ES2023 Non-mutating Array Methods**:
   - Thay thế `sort()` bằng `toSorted()`.
   - Thay thế `reverse()` bằng `toReversed()`.
   - Thay thế `splice()` bằng `toSpliced()`.
   - Thay thế `arr[i] = val` bằng `arr.with(i, val)`.
3. **Tư duy Derived State với `reduce`**:
   - Tính toán trực tiếp trong hàm render (tổng tiền giỏ hàng, grouping danh mục) thay vì tạo thêm `useState` và `useEffect` thừa.
4. **Validation danh sách với `some` và `every`**:
   - Kiểm tra tính hợp lệ toàn diện hoặc phát hiện lỗi trong form nhiều trường.

## Implications
Hoàn thành Bài 40 của Module 11. Toàn bộ 41 test suites (249/249 unit tests) chạy XANH 100%. Sẵn sàng tiến vào Bài 41: Async/Await, Fetch API & AbortController trong React.
