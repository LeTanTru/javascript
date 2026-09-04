# Live-coding Polyfills: Promise.all, allSettled, race, any & Promise.withResolvers

Người học tự tay cài đặt 5 Promise Combinators thiết yếu từ gốc rễ theo chuẩn ECMAScript 2015–2024:

1. **Promise.all (myAll)**: Kỹ thuật Reference Counter (`remaining`) đếm ngược từ N về 0. Lưu kết quả theo chỉ số (`results[i]`) để đảm bảo thứ tự đúng bất kể promise nào hoàn thành trước. Reject ngay khi có 1 rejection.

2. **Promise.allSettled (myAllSettled)**: Tương tự myAll nhưng không bao giờ gọi `reject`. Mọi kết quả (cả fulfilled lẫn rejected) đều được thu gom dạng `{ status, value/reason }`.

3. **Promise.race (myRace)**: Thuật toán đua tranh — đăng ký đồng thời cả resolve lẫn reject cho mọi Promise; Promise nào settle trước sẽ thắng. Sau khi thắng, mọi lời gọi `resolve/reject` tiếp theo đều bị bỏ qua (nhờ tính bất biến State Machine của Promise bọc ngoài).

4. **Promise.any (myAny)**: Ngược với myAll — Reference Counter đếm số lần rejected. Khi rejectedCount === promises.length, ném AggregateError với toàn bộ danh sách lỗi.

5. **Promise.withResolvers (myWithResolvers)**: Deferred Pattern ES2024 — trích xuất `resolve` và `reject` ra ngoài Promise constructor thông qua biến Closure, cho phép kiểm soát vòng đời Promise từ bên ngoài (hữu ích cho test mocking, event-driven workflows).

## Implications
Nền tảng trực tiếp để tiến vào Bài 20: AbortController & AbortSignal — kiểm soát vòng đời async operations và xử lý Race Conditions trong data fetching.
