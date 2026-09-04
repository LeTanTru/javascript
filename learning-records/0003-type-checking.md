# typeof, instanceof & Kiểm tra kiểu đáng tin cậy (Object.prototype.toString, Array.isArray)

Người học nắm bản chất toán tử `typeof` và giải mã được nguồn gốc lỗi thiết kế C-level 1995 (`typeof null === 'object'`) từ hệ thống Type Tag 32-bit (tag `000` của Object trùng khớp với địa chỉ `0x00` của con trỏ NULL). Hiểu rõ nguyên tắc *Don't Break the Web* khiến TC39 giữ nguyên hành vi này. Nắm sâu thuật toán `OrdinaryHasInstance` của toán tử `instanceof` và 3 điểm mù: primitive literals, prototype mutation và đặc biệt là sự sụp đổ khi kiểm tra đối tượng cross-realm (iframe, worker) do khác biệt vùng nhớ giữa các Realm. Hiểu tại sao `Array.isArray()` giải quyết được vấn đề nhờ đọc internal slot. Thành thạo "tiêu chuẩn vàng" `Object.prototype.toString.call()` kết hợp `Symbol.toStringTag` và xây dựng hàm tiện ích `toExactType()` chuẩn production.

## Implications
Hoàn tất trọn vẹn Module 01 (Kiểu dữ liệu, Memory Model & Type Coercion). Người học đã có tư duy tầng sâu về internal slots và Well-known Symbols, sẵn sàng bước sang Bài 05 về `Symbol`, `Symbol.hasInstance`, `Symbol.toStringTag`, `Symbol.iterator` và cơ chế siêu lập trình (Metaprogramming) căn bản trong JS.
