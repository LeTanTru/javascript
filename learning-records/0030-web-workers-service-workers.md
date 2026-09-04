# Web Workers, Service Workers, Cache API & Đa luồng trên Browser

Người học làm chủ các giải pháp đa luồng và hoạt động ngoại tuyến (Offline) trên trình duyệt:

1. **Phân biệt Web Worker vs Service Worker**:
   - Web Worker: Xử lý tính toán nặng ngầm (heavy CPU tasks) giải phóng UI Main Thread; vòng đời gắn với tab.
   - Service Worker: Proxy mạng ngầm (Network Interceptor), chạy độc lập với tab, quản lý Offline cache và Push Notifications.
   - Cả hai đều không có quyền truy cập DOM để loại trừ hoàn toàn race conditions trên UI.
2. **Cơ chế truyền dữ liệu qua `postMessage`**:
   - Mặc định: Structured Clone Algorithm (deep copy vùng nhớ).
   - Nâng cao: Transferable Objects (Zero-copy transfer quyền sở hữu `ArrayBuffer`, byteLength ở thread nguồn về 0).
3. **3 Chiến lược Caching kinh điển (Cache Storage API)**:
   - Cache-First: Ưu tiên cache, rớt về network (tối ưu static assets: fonts, css, js).
   - Network-First: Ưu tiên network, rớt về cache khi offline (dữ liệu động: feeds, news).
   - Stale-While-Revalidate: Trả cache tức thì 0ms đồng thời fetch ngầm để cập nhật cache cho lần sau (avatars, dashboards).

## Implications
Kết thúc trọn vẹn Module 07: DOM, Browser Engine & Web APIs. Sẵn sàng bước sang Module 08: V8 Engine Internals & Tối ưu hóa bộ nhớ.
