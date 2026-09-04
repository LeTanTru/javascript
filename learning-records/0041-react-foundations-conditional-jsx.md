# Logic & Conditional Rendering trong JSX

Người học làm chủ khả năng rẽ nhánh giao diện (Conditional Rendering) chính xác trong React JSX:

1. **Bẫy số 0 trong toán tử `&&`**:
   - `count && <Badge />` trả về số `0` khi `count === 0` (JSX render ký tự '0' lên DOM).
   - Khắc phục: `count > 0 && <Badge />`, `Boolean(count) && <Badge />`, hoặc Ternary `count > 0 ? <Badge /> : null`.
2. **Quy tắc JSX Runtime đối với giá trị đặc biệt**:
   - Bị bỏ qua (không render node): `false`, `null`, `undefined`, `true`.
   - Bắt buộc render (tạo text node): Số `0`, `NaN`, chuỗi `""`.
3. **Early Return Guard Clauses**:
   - Tách rời các trạng thái `loading`, `error`, `empty` ở đầu component body để giữ luồng chính (happy path) phẳng và sạch sẽ.
4. **Pattern Dictionary Object Mapping**:
   - Thay thế các khối Nested Ternary phức tạp bằng Object Lookup table (`STATUS_CONFIG[status]`).

## Implications
Hoàn tất Bài 42 & TỐT NGHIỆP TOÀN BỘ KHÓA HỌC JAVASCRIPT CORE FOR FRONTEND INTERVIEW! Toàn bộ 43 test suites (261/261 unit tests) chạy XANH 100%.
