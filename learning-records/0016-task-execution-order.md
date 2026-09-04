# Thứ tự thực thi: Microtasks vs Macrotasks vs requestAnimationFrame vs queueMicrotask

Người học làm chủ thuật toán 4 bước xác định thứ tự thực thi (Execution Order) của các tác vụ bất đồng bộ phức tạp lồng nhau:
1. **Bản chất của async/await**: Mã đứng trước từ khóa `await` thực thi hoàn toàn đồng bộ trên Call Stack. Biểu thức sau `await` được bọc thành `Promise.resolve()`, và toàn bộ phần mã còn lại sau `await` bị đẩy vào Microtask Queue.
2. **Chu kỳ Rendering Frame & `requestAnimationFrame` (rAF)**: Phân tích tần số quét màn hình 60Hz (16.6ms) / 120Hz (8.3ms). Khẳng định vị trí của callback rAF chạy ngay trước giai đoạn Recalculate Styles, Layout (Reflow) và Paint. Hiểu rõ vì sao `setTimeout(fn, 0)` gây giật lag / drop frame còn `requestAnimationFrame` đạt độ mượt mà tối đa.
3. **`queueMicrotask` API**: Sử dụng API chuẩn mực của W3C/WHATWG để đẩy trực tiếp hàm vào Microtask Queue của V8 mà không tốn chi phí cấp phát đối tượng Promise trên Memory Heap và tránh lỗi Unhandled Rejections.
4. **Chiến thuật giải câu đố Execution Order**: Rèn luyện kỹ năng vẽ 2 hàng đợi song song `[Microtask Queue]` và `[Macrotask Queue]` để phân tích các trường hợp tác vụ lồng nhau nhiều tầng (setTimeout chứa Promise vs Promise chứa setTimeout).

## Implications
Nền tảng trực tiếp để tiến vào Bài 18: Promise Architecture: State Machine, `.then` Chaining & Error Propagation.
