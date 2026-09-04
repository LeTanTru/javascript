# Lexical Environment, Scope Chain & Bản chất Closures

Người học làm chủ cấu trúc giải phẫu 2 thành phần của một `LexicalEnvironment` theo đặc tả ECMAScript: `EnvironmentRecord` (Declarative vs Object Environment Record) và con trỏ `outer` reference. Nắm vững bản chất của Scope Chain dưới góc độ cấu trúc dữ liệu: một Singly Linked List nối các Environment Records từ phạm vi hiện tại ngược về Global Environment (`outer === null`).

Chứng minh bằng thực nghiệm sự khác biệt giữa Lexical Scoping (phạm vi từ vựng tĩnh được xác định tại vị trí hàm được ĐỊNH NGHĨA trong mã nguồn) và Dynamic Scoping (xác định tại nơi hàm được GỌI). Phân tích chi tiết thuật toán Identifier Resolution: cơ chế duyệt tuyến tính tìm biến, bẫy gán biến không khai báo tạo biến toàn cục trong non-strict mode và sự an toàn của strict mode (`ReferenceError`).

Giải mã bản chất lưu trữ của Closures dưới tầng V8 Engine: lý giải tại sao hàm con vẫn truy cập được biến của hàm cha khi hàm cha đã kết thúc và pop khỏi Call Stack. Nắm rõ cơ chế V8 Scope Analysis: phân biệt Stack Allocation (cho biến cục bộ thông thường) và Context Allocation trên Memory Heap (cho biến closed-over). Hiểu rõ con trỏ nội bộ `[[Environment]]` giữ cho Context Object trên Heap không bị Garbage Collector thu gom. Nắm chắc nguyên lý độc lập của các Lexical Environments qua từng lần gọi hàm cha và khả năng chia sẻ chung ô nhớ giữa các closures cùng sinh ra trong một ngữ cảnh.

## Implications
Nền tảng trực tiếp để tiến vào Bài 08: Ứng dụng Closures trong thực tế (Module Pattern, Private State, Factory Functions, Memoization) và kỹ thuật phân tích, phát hiện rò rỉ bộ nhớ (Memory Leaks Hunting với Chrome DevTools Heap Snapshot).
