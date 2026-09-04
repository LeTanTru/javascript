# Live-coding: Tự viết deepClone vs structuredClone

Người học làm chủ kỹ thuật sao chép sâu các cấu trúc dữ liệu phức tạp trong JavaScript:

1. **Cạm bẫy của JSON.stringify**:
   - Mất hoàn toàn `undefined`, `Function`, `Symbol`.
   - Biến `Date` thành string ISO, `RegExp`/`Map`/`Set` thành `{}`.
   - Crash với `TypeError` khi gặp quan hệ tham chiếu vòng (Circular References).
2. **Giải pháp Circular References bằng WeakMap**:
   - Lưu trữ cặp `[originalObject, clonedObject]` vào `WeakMap`.
   - Nếu gặp lại object đã clone trong cây đệ quy, trả về ngay kết quả từ cache để chặn đệ quy vô tận.
   - Tận dụng Garbage Collection tự động của WeakMap để giải phóng bộ nhớ.
3. **Xử lý chuyên sâu các Data Types**:
   - `Date`: `new Date(value.getTime())`.
   - `RegExp`: `new RegExp(value.source, value.flags)`.
   - `Map` & `Set`: Duyệt và clone đệ quy từng entry / value.
   - `Symbol Properties`: Sử dụng `Reflect.ownKeys()` kết hợp `Object.getOwnPropertyDescriptor()` để duyệt trọn vẹn cả String keys và Symbol keys.
4. **Giới hạn của `structuredClone`**: Hiểu rõ `structuredClone` ném `DataCloneError` khi gặp `Function` hoặc `DOM Nodes`.

## Implications
Củng cố nền tảng cấu trúc dữ liệu để tiến vào Bài 25: Live-coding Cài đặt `EventEmitter` (Pub/Sub pattern) & `pipe`/`compose`.
