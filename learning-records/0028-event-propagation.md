# Event Propagation: Bubbling vs Capturing, Event Delegation & passive: true

Người học làm chủ mô hình xử lý tương tác sự kiện chuẩn W3C trong DOM:

1. **3 Pha của DOM Event Flow**:
   - Phase 1: Capturing Phase (từ `window` đi xuống target node).
   - Phase 2: Target Phase (tại chính target node).
   - Phase 3: Bubbling Phase (nổi bọt từ target node ngược lên `window`).
2. **Kiểm soát lan truyền sự kiện**:
   - `e.stopPropagation()`: Dừng lan truyền lên/xuống các node khác, nhưng không chặn các listener còn lại trên cùng node.
   - `e.stopImmediatePropagation()`: Dừng lan truyền VÀ chặn ngay lập tức tất cả các listener khác trên cùng node.
   - `e.preventDefault()`: Chặn hành vi mặc định của trình duyệt mà không ảnh hưởng đến propagation.
3. **Event Delegation**:
   - Gắn 1 listener lên phần tử cha và sử dụng `event.target.closest(selector)` để bắt các phần tử con tĩnh và động sinh ra sau này.
   - Tiết kiệm bộ nhớ và tránh memory leaks do không phải quản lý hàng ngàn listener rời rạc.
4. **Tối ưu hóa cuộn trang với `{ passive: true }`**:
   - Khẳng định với trình duyệt rằng listener không gọi `preventDefault()`.
   - Cho phép GPU Compositor Thread cuộn trang 60fps mượt mà mà không bị block bởi Main Thread.

## Implications
Nền tảng trực tiếp để tiến vào Bài 30: Layout Thrashing, Repaint, Reflow & Tối ưu hiệu năng DOM Rendering.
