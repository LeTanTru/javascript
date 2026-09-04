# Layout Thrashing, Repaint, Reflow & Tối ưu hiệu năng DOM Rendering

Người học làm chủ kỹ thuật tối ưu hóa hiệu năng render trên trình duyệt:

1. **Forced Synchronous Layout (Layout Thrashing)**:
   - Cơ chế: Đan xen giữa thao tác Write (sửa DOM/CSS) và Read (đo đạc hình học) trong cùng một vòng lặp buộc trình duyệt tính toán lại Layout liên tục trên Main Thread.
   - Hậu quả: Gây tụt khung hình (Frame Drop) và giật lag giao diện (Jank).
2. **Danh sách API kích hoạt Reflow bắt buộc**:
   - `offsetWidth`, `offsetHeight`, `clientWidth`, `clientHeight`, `scrollWidth`, `scrollHeight`.
   - `offsetTop`, `offsetLeft`, `clientTop`, `clientLeft`, `scrollTop`, `scrollLeft`.
   - `getBoundingClientRect()`, `getComputedStyle()`.
3. **Mô hình FastDOM Batching**:
   - Tách rời hoàn toàn 2 pha: **Read All First** $\rightarrow$ **Write All Later**.
   - Gom toàn bộ DOM updates vào 1 frame duy nhất (hoặc lên lịch qua `requestAnimationFrame`).
4. **DocumentFragment**:
   - Tạo cây DOM ảo trong bộ nhớ RAM, gom hàng ngàn nodes và chỉ kích hoạt 1 lần Reflow duy nhất khi append vào document thực.
5. **Kỹ thuật CSS Hiện đại**:
   - `contain: layout size style` / `contain: content`: Cô lập phạm vi Reflow cục bộ.
   - `content-visibility: auto`: Bỏ qua việc render các phần tử Off-screen cho đến khi cuộn tới.

## Implications
Nền tảng trực tiếp để tiến vào Bài 31: Web Workers, Service Workers, Cache API & Đa luồng trên Browser — bài cuối cùng của Module 07.
