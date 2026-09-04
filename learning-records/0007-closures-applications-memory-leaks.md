# Ứng dụng Closures: Module Pattern, Private State & Memory Leaks Hunting

Người học chính thức hoàn thành toàn bộ Module 02 (Execution Context, Scope Chain & Closures). Làm chủ các mẫu thiết kế kinh điển ứng dụng Closures:
- Revealing Module Pattern: Đóng gói Private State an toàn, chỉ để lộ Public API cần thiết, cô lập hoàn toàn biến nội bộ khỏi sự can thiệp trái phép từ bên ngoài.
- Currying & Partial Application: Tận dụng Closures lưu giữ tham số để cấu hình trước các hàm tiện ích có tính tái sử dụng cao (như Logger, Event dispatchers).
- Memoization: Sử dụng bộ đệm bảng băm (Map) nằm trong phạm vi Closure để cache kết quả tính toán đắt đỏ của các pure functions, tối ưu hóa độ phức tạp thời gian về $O(1)$.

Phân tích chuyên sâu 3 kịch bản rò rỉ bộ nhớ (Memory Leaks) kinh điển do Closures gây ra:
1. Dangling Event Listeners: Giữ tham chiếu tới DOM Node đã bị xóa khỏi document tạo ra hiện tượng Detached DOM Tree ngốn RAM.
2. Bỏ quên Timers: `setInterval` chạy ngầm neo giữ vĩnh viễn Context Object trên Memory Heap.
3. Shared Lexical Scope Leak: Hiện tượng nhiều hàm con trong cùng Execution Context chia sẻ chung một Context Object trên Heap, khiến một hàm nhỏ lưu ở biến toàn cục vô tình giữ lại mảng dữ liệu khổng lồ của một hàm con khác không còn được sử dụng.

Thành thạo công cụ Chrome DevTools Memory Profiler: phân biệt rạch ròi giữa Shallow Size (kích thước bản thân đối tượng) và Retained Size (tổng dung lượng giải phóng nếu đối tượng bị tiêu hủy), quy trình 3 bước so sánh Snapshot (Baseline -> Action -> Comparison Snapshot) để cô lập đối tượng tăng đột biến.

## Implications
Kết thúc Module 02 với bộ tài liệu tra cứu `reference/02-execution-context-scope-closures.html`. Người học sở hữu nền tảng vững chắc nhất về cơ chế Runtime & Memory Model để tự tin tiến vào Module 03: Objects, Prototype Chain & Meta-Programming (`prototype`, `__proto__`, `[[Prototype]]`, `new`, `Object.create()`, `Proxy`, `Reflect`).
