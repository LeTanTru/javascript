# Critical Rendering Path: HTML/CSS Parser → DOM/CSSOM → Render Tree → Layout → Paint → Composite

Người học làm chủ các giai đoạn dựng trang web tầng Browser Engine:

1. **6 Giai đoạn của CRP**:
   - DOM Construction (Bytes $\rightarrow$ Characters $\rightarrow$ Tokens $\rightarrow$ Nodes $\rightarrow$ DOM Tree).
   - CSSOM Construction (Render-blocking: Trình duyệt không render đến khi CSSOM sẵn sàng để tránh FOUC).
   - Render Tree (Chỉ kết hợp các nodes hiển thị; loại bỏ `<head>`, `<script>`, `<style>` và `display: none`).
   - Layout / Reflow (Tính toán tọa độ $x, y, width, height$).
   - Paint / Repaint (Vẽ điểm ảnh màu sắc, border, text).
   - Compositing (Ghép các layer trên GPU Compositor thread).
2. **`display: none` vs `visibility: hidden`**:
   - `display: none`: Bị loại bỏ hoàn toàn khỏi Render Tree và Layout.
   - `visibility: hidden` / `opacity: 0`: Vẫn nằm trong Render Tree và tham gia tính toán Layout.
3. **Script Loading (`defer` vs `async`)**:
   - Regular script: Chặn HTML Parser.
   - `defer`: Tải song song, chạy theo thứ tự file sau khi DOM parse xong (trước `DOMContentLoaded`).
   - `async`: Tải song song, chạy ngay khi tải xong (không bảo toàn thứ tự).
4. **Performance Triggers**: Tối ưu 60fps bằng cách ưu tiên các thuộc tính Composite Only (`transform`, `opacity`).

## Implications
Nền tảng trực tiếp để tiến vào Bài 29: Event Propagation: Bubbling vs Capturing, Event Delegation & `passive: true` listeners.
