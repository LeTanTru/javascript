# Proxy & Reflect API: Meta-programming, Traps & Cơ chế Reactivity (Vue 3 / Signals)

Người học chính thức hoàn thành toàn bộ Module 03 (Objects, Prototype Chain & Meta-Programming). Khám phá đỉnh cao Meta-Programming trong JavaScript thông qua `Proxy` và `Reflect` API:
- Làm chủ 13 internal traps của `Proxy` (đánh chặn `[[Get]]`, `[[Set]]`, `[[HasProperty]]`, `[[Delete]]`, `[[Call]]`, `[[Construct]]`...).
- Hiểu sâu sắc lý do bắt buộc phải kết hợp `Reflect` bên trong Proxy Traps: chuẩn hóa giá trị trả về (trả boolean an toàn) và đặc biệt là vai trò của tham số `receiver` trong `Reflect.get(target, prop, receiver)` để bảo toàn ngữ cảnh `this` trỏ đúng vào Proxy khi truy cập getter kế thừa, ngăn chặn triệt để bug mất reactivity.
- So sánh toàn diện giữa `Proxy` (Vue 3) và `Object.defineProperty` (Vue 2): chỉ rõ 3 hạn chế chí mạng của Vue 2 (duyệt đệ quy tốn CPU, không bắt được thêm/xóa key, phải monkey-patch mảng) và cách `Proxy` giải quyết triệt để nhờ cơ chế Lazy Evaluation và Native Array/Object interception.
- Tự tay live-coding cài đặt hoàn chỉnh một Reactive State Engine tối giản (mô phỏng Vue 3 Core) với 4 hàm trụ cột: `track`, `trigger`, `reactive`, `effect`.

## Implications
Khép lại Module 03 với bộ tài liệu tra cứu `reference/03-objects-prototype-meta.html`. Người học sở hữu nền tảng vững chắc nhất về mô hình đối tượng và meta-programming để tự tin bước sang Module 04: Cơ chế `this` & Function Internals (4 quy tắc xác định `this`, Arrow Functions lexical `this`, và live-coding polyfills `call`, `apply`, `bind`).
