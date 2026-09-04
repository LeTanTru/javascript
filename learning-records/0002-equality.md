# So sánh bằng: === vs == vs Object.is() & Bẫy NaN, null, undefined

Người học đã nắm vững 3 thuật toán so sánh bằng trong ECMA-262: `IsStrictlyEqual` (===), `IsLooselyEqual` (==) và `SameValue` (Object.is()). Hiểu rõ 2 bẫy IEEE 754 của `===`: `NaN !== NaN` và `+0 === -0`. Nắm quy tắc đặc biệt của `==` với `null` — chỉ bằng `null` hoặc `undefined`, không coerce sang số trong bất kỳ tình huống nào. Giải mã được điểm mâu thuẫn kinh điển: `null >= 0` (true) vs `null == 0` (false) do hai toán tử dùng hai thuật toán trừu tượng khác nhau. Biết dùng `Number.isNaN()` thay `isNaN()` và hiểu lý do React dùng `Object.is()` trong deps comparison.

## Implications
Đủ tiền đề để tiếp tục Bài 04 về `typeof`, `instanceof` và chiến lược kiểm tra kiểu đáng tin cậy — hiểu tại sao `instanceof` thất bại cross-realm và đâu là giải pháp production-grade.
