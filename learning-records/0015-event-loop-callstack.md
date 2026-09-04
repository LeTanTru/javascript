# Kiến trúc Event Loop trên Trình duyệt & Node.js (Call Stack, Task Queue, Microtask Queue)

Người học giải phẫu mô hình Concurrency Model đơn luồng (Single-threaded) của JavaScript và cơ chế phối hợp nhịp nhàng giữa 4 trụ cột kiến trúc:
1. **V8 Call Stack**: Ngăn xếp LIFO thực thi mã đồng bộ (Synchronous code).
2. **Web APIs (Trình duyệt) / Libuv Threadpool (Node.js)**: Nơi các tác vụ ngoại vi (Timers, Network I/O, DOM events) được chạy ngầm đa luồng ở tầng C++ của hệ điều hành.
3. **Task Queue (Macrotask Queue)**: Hàng đợi FIFO lưu trữ các callback đã sẵn sàng: `setTimeout`, `setInterval`, UI Events. Mỗi lượt quay của Event Loop chỉ bốc duy nhất 1 Macrotask.
4. **Microtask Queue**: Hàng đợi FIFO ưu tiên cao dành riêng cho `Promise.then/catch/finally`, `queueMicrotask`, `MutationObserver`.

Nắm chắc giải thuật 1 Tick của Event Loop theo chuẩn HTML Living Standard:
- Call Stack chạy hết mã đồng bộ.
- Vét cạn 100% Microtask Queue (bao gồm cả các microtask lồng nhau mới sinh ra).
- Thực hiện Rendering Pipeline (CSSOM, Layout, Paint) nếu đến chu kỳ khung hình.
- Bốc đúng 1 Macrotask từ Task Queue và lặp lại vòng tuần hoàn.

Nhận diện hiện tượng nguy hiểm: **Microtask Starvation** (chuỗi đệ quy Promise làm nghẽn Event Loop, treo đơ UI trình duyệt và bỏ đói Macrotask Queue vĩnh viễn). So sánh sự khác biệt cốt lõi giữa Event Loop HTML5 của Browser và 6 phases của Libuv trong Node.js (với sự xuất hiện của `process.nextTick`).

## Implications
Mở đầu toàn diện cho Module 05. Là tiền đề trực tiếp để bước vào Bài 17: Thứ tự thực thi Microtasks vs Macrotasks vs `requestAnimationFrame` vs `queueMicrotask` và giải mã chu kỳ Rendering Frame (60Hz/120Hz).
