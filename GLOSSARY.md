# JavaScript Core Glossary

Bảng thuật ngữ chuẩn hóa dành cho khóa học JavaScript Core for Frontend Interview. Mỗi thuật ngữ được định nghĩa súc tích, chính xác theo chuẩn ECMAScript và V8 runtime.

## Terms

**Execution Context**:
Môi trường trừu tượng do JavaScript Engine tạo ra để quản lý việc đánh giá và thực thi mã nguồn JavaScript, bao gồm Lexical Environment, Variable Environment và `this` binding.
_Avoid_: Function runner, execution container

**Lexical Environment**:
Cấu trúc dữ liệu dạng dictionary ánh xạ định danh biến/hàm với giá trị cụ thể, được xác định tĩnh dựa trên vị trí vật lý của đoạn mã trong file nguồn.
_Avoid_: Code scope, memory context

**Closure**:
Sự kết hợp giữa một hàm và môi trường từ vựng (Lexical Environment) bao quanh nó, cho phép hàm truy cập vào các biến bên ngoài ngay cả khi phạm vi cha đã kết thúc thực thi.
_Avoid_: Nested function, private function

**Prototypal Inheritance**:
Cơ chế kế thừa đối tượng trong JavaScript thông qua liên kết nội bộ `[[Prototype]]` (prototype chain), nơi các object thừa hưởng thuộc tính trực tiếp từ object khác thay vì sao chép cấu trúc từ class.
_Avoid_: Class inheritance, classical OOP

**Event Loop**:
Cơ chế điều phối luồng thực thi trong JavaScript runtime, liên tục kiểm tra Call Stack và rút các tác vụ từ Microtask Queue và Task Queue đưa vào Call Stack khi stack rỗng.
_Avoid_: Background thread, async runner

**Microtask Queue**:
Hàng đợi ưu tiên cao chứa các callback bất đồng bộ (Promise `.then`/`catch`/`finally`, `queueMicrotask`, `MutationObserver`), được thực thi vét cạn ngay sau khi Call Stack rỗng trước khi chuyển sang Macrotask hoặc Render frame tiếp theo.
_Avoid_: Small queue, fast queue

**Proxy**:
Đối tượng siêu lập trình (meta-programming) bọc quanh một target object, cho phép đánh chặn và tùy biến các thao tác cơ bản trên object đó (như đọc thuộc tính `get`, ghi thuộc tính `set`, gọi hàm `apply`).
_Avoid_: Object wrapper, interceptor object

**AbortController**:
Giao diện tiêu chuẩn trên Web API cho phép tạo ra một tín hiệu hủy (`AbortSignal`) để chủ động hủy bỏ các tác vụ bất đồng bộ (như `fetch`, event listeners, async streams) nhằm tránh race conditions và rò rỉ bộ nhớ.
_Avoid_: Fetch canceller, async stopper

**WeakRef & FinalizationRegistry**:
Cơ chế giữ tham chiếu yếu (Weak Reference) đến một đối tượng mà không ngăn cản Garbage Collector thu hồi vùng nhớ của đối tượng đó khi không còn tham chiếu mạnh nào khác.
_Avoid_: Soft pointer, weak link

**Hidden Class (Shape)**:
Cấu trúc dữ liệu nội bộ trong V8 Engine dùng để biểu diễn hình dạng của đối tượng và ánh xạ offset của các thuộc tính trong bộ nhớ nhằm tối ưu hóa tốc độ truy xuất thuộc tính.
_Avoid_: Virtual class, internal prototype
