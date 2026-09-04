# Live-coding: Cài đặt Debounce & Throttle (Leading, Trailing & Cancel options)

Người học làm chủ bộ đôi kỹ thuật kiểm soát tần suất thực thi sự kiện hàng đầu:

1. **Phân biệt Debounce vs Throttle**:
   - Debounce: Reset timer liên tục, gom chuỗi thao tác thành 1 lần gọi duy nhất sau khi người dùng ngừng thao tác (Typeahead, Resize).
   - Throttle: Giữ nhịp cố định tối đa 1 lần thực thi mỗi `wait` ms (Scroll, Drag & Drop, Button throttling).
2. **Options nâng cao**:
   - `leading`: Thực thi ngay lập tức tại cạnh đầu tiên (edge).
   - `trailing`: Thực thi lần gọi cuối cùng khi hết khoảng `wait`.
   - `.cancel()`: Dọn dẹp timer và giải phóng tham chiếu context/args, ngăn chặn memory leaks khi unmount component.
   - `.flush()`: Ép thực thi ngay lập tức tác vụ đang pending.
3. **Quản lý Closure & Context**: Lưu giữ `lastThis` và `lastArgs` để gọi hàm gốc với `fn.apply(lastThis, lastArgs)`.
4. **Tích hợp React**: Sử dụng `useRef` và `useMemo` kết hợp cleanup trong `useEffect` để tránh tạo instance mới mỗi re-render.

## Implications
Nền tảng trực tiếp để tiến vào Bài 24: Live-coding Tự viết `deepClone` (Xử lý Circular References với WeakMap) vs `structuredClone`.
