# Live-coding: Cài đặt Async Pool / Concurrency Limiter (p-limit / Task Queue)

Người học làm chủ cơ chế điều tiết luồng bất đồng bộ trong các ứng dụng tải cao:

1. **Kiến trúc Sliding Window**: Kết hợp FIFO Queue và Reference Counter (`activeCount`) để duy trì liên tục tối đa $N$ tasks đồng thời.
2. **Kích hoạt an toàn với `.finally()`**: Giải phóng slot và kích hoạt task kế tiếp `next()` trong `.finally()` thay vì `.then()` để đảm bảo isolation lỗi — task thất bại không làm nghẽn pool.
3. **Thứ tự kết quả**: Sử dụng `Promise.all` cùng `map` để trả về mảng kết quả giữ nguyên đúng index ban đầu của items.
4. **Ứng dụng sản xuất**: Pattern `asyncPool` để batch processing hàng loạt API calls, upload file lên S3 và rate-limiting bảo vệ backend.

## Implications
Kết thúc trọn vẹn Module 05: Asynchronous JavaScript, Event Loop & Concurrency Control. Sẵn sàng bước vào Module 06: Functional Programming & Utility Polyfills.
