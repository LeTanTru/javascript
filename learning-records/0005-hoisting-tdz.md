# Hoisting, Temporal Dead Zone (TDZ) & Sự khác biệt var vs let vs const

Người học nắm trọn vẹn bản chất 3 bước trong vòng đời của một biến: Declaration (đăng ký định danh vào Environment Record), Initialization (cấp phát ô nhớ và gán giá trị mặc định ban đầu), và Assignment (gán giá trị cụ thể khi luồng thực thi chạy tới). Phá vỡ hoàn toàn ngụy thức "let và const không bị hoisting": chứng minh let/const CÓ bị hoisting thông qua hiện tượng Shadowing trong block scope (biến let cục bộ khoá phạm vi ngay trong Creation Phase và ném ReferenceError thay vì cho phép Scope Chain tìm ra biến toàn cục cùng tên).

Nắm vững cơ chế Temporal Dead Zone (TDZ) – khoảng thời gian định danh đã được khai báo nhưng chưa được cấp phát ô nhớ (uninitialized). Nắm rõ bẫy duy nhất khiến toán tử `typeof` ném ReferenceError trong JavaScript chính là TDZ. Phân tích rạch ròi cơ chế per-iteration lexical binding của từ khóa `let` trong vòng lặp `for` (mỗi vòng lặp sinh ra một Environment Record mới độc lập, bảo toàn giá trị cho asynchronous callbacks/closures) so với 1 binding duy nhất của `var`. Hiểu rõ `const` chỉ bảo vệ ràng buộc định danh (Variable Binding) trên Call Stack chứ không đóng băng cấu trúc Object trên Memory Heap.

## Implications
Nền tảng trực tiếp để tiến vào Bài 07: Lexical Environment, Scope Chain (danh sách liên kết các Environment Records), thuật toán phân giải định danh (Identifier Resolution) và bản chất Closures trên Memory Heap.
