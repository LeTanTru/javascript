# Live-coding: Memoize function & LRU Cache implementation

Người học làm chủ các giải pháp lưu trữ bộ nhớ đệm (Caching) tối ưu hiệu năng:

1. **Memoization**:
   - Gắn bộ đệm vào hàm thuần khiết để nhớ kết quả theo danh sách đối số.
   - Hỗ trợ `resolver` tùy biến để chuyển đổi arguments phức tạp thành chuỗi key chuẩn xác.
   - Expose thuộc tính `memoized.cache` (Map) để cho phép kiểm tra, xóa phần tử hoặc clear toàn bộ cache.
2. **LRU Cache (Least Recently Used)**:
   - Cơ chế giới hạn dung lượng `capacity` và tự động loại bỏ phần tử ít dùng nhất.
   - Tận dụng đặc tính chuẩn ECMAScript: `Map` luôn bảo toàn thứ tự chèn (Insertion Order).
   - Đạt độ phức tạp thời gian $O(1)$ cho cả `.get(key)` và `.put(key, value)` bằng cách xóa và chèn lại phần tử để đưa lên vị trí Most Recently Used (cuối Map).

## Implications
Củng cố nền tảng giải thuật để tiến vào Bài 27: Live-coding `flatten` (Array/Object lồng nhau) & `deepEqual` implementation — bài học cuối cùng của Module 06.
