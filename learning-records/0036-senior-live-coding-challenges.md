# Giả lập Live-Coding Interview: 3 bài toán phân loại ứng viên Senior/Lead

Người học làm chủ khả năng giải quyết và code trực tiếp 3 bài toán live-coding nâng cao:

1. **Priority Async Scheduler with Concurrency Limit**:
   - Quản lý hàng đợi async tasks theo độ ưu tiên giảm dần.
   - Giới hạn số lượng tác vụ chạy đồng thời (`runningCount < concurrency`).
   - Sử dụng khối `try/finally` đảm bảo kích hoạt tác vụ kế tiếp và chống race conditions.
2. **Deep Object Diff & Patch Engine (State Reconciler)**:
   - Thuật toán duyệt đệ quy phát hiện sự khác biệt: `{ added, updated, deleted }`.
   - Hàm `applyPatch` áp dụng patch một cách bất biến (Immutability), khôi phục chính xác trạng thái target object.
3. **Fine-grained Reactivity (Signal & Effect)**:
   - Cơ chế Dependency Collection: `read()` tự động lưu `activeEffect` vào `subscribers` (Set).
   - Cơ chế Trigger: `write()` thông báo và kích hoạt lại toàn bộ effects phụ thuộc khi giá trị thay đổi.
   - Nền tảng cốt lõi của SolidJS, Vue 3 Reactivity, Preact Signals và Angular Signals.

## Implications
Hoàn thành Bài 37 của Module 10. Toàn bộ 38 test suites (234/234 unit tests) chạy XANH 100%. Sẵn sàng bước sang Bài 38: Kỹ năng giao tiếp trong phỏng vấn kỹ thuật (Top-Down & STAR).
