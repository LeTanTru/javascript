# AbortController & AbortSignal: Hủy request, Race Conditions & Stale Responses

Người học làm chủ vòng đời của async operations trong môi trường production:

1. **Kiến trúc AbortController / AbortSignal**: Phân biệt rõ vai trò: AbortController là issuer (phát lệnh hủy), AbortSignal là receiver (nhận và propagate tín hiệu hủy). Thuộc tính `signal.aborted` (boolean) và `signal.reason` là phương tiện giao tiếp trạng thái.

2. **Pattern Cancel-on-Supersede**: Triển khai đúng cách cho typeahead search / autocomplete — lưu biến `activeController`, gọi `abort()` trước khi tạo controller mới cho mỗi keystroke. Phân biệt kết quả của request cuối cùng (valid) vs. các request cũ bị hủy (stale).

3. **Phân biệt AbortError với lỗi thực sự**: Kiểm tra `err.name === 'AbortError'` trong `.catch()` để tránh hiển thị error toast không cần thiết khi người dùng tự hủy.

4. **Static factories ES2022+**: `AbortSignal.timeout(ms)` thay thế pattern setTimeout + abort thủ công; `AbortSignal.any([s1, s2])` kết hợp nhiều nguồn hủy.

5. **React useEffect integration**: Cách viết cleanup function chuẩn với controller.abort() để tránh state update trên unmounted component.

## Implications
Nền tảng trực tiếp để tiến vào Bài 21: Live-coding Async Pool / Concurrency Limiter — giới hạn số task bất đồng bộ chạy song song, hoàn tất Module 05.
