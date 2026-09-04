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

**Call Stack**:
Vùng nhớ ngăn xếp (LIFO) trong JavaScript Engine quản lý Execution Contexts, lời gọi hàm và lưu trữ các biến Primitive có kích thước cố định.
_Avoid_: Execution pile, run stack

**Memory Heap**:
Vùng nhớ phi cấu trúc do V8 Engine cấp phát động trong RAM để lưu trữ các đối tượng phức tạp (Objects, Arrays, Functions) có kích thước linh hoạt.
_Avoid_: Object pile, heap stack

**Pass-by-sharing**:
Cơ chế truyền tham số hàm của JavaScript: bản chất là Pass-by-value, trong đó giá trị được truyền của một Object là bản sao con trỏ địa chỉ bộ nhớ (Memory Pointer) trên Heap.
_Avoid_: True pass-by-reference, pointer passing

**Shallow Copy**:
Thao tác sao chép đối tượng mà chỉ sao chép các thuộc tính ở tầng nông thứ nhất (cấp 1); các thuộc tính lồng nhau (nested objects/arrays) vẫn tiếp tục dùng chung con trỏ tham chiếu tới cùng ô nhớ cũ trên Heap.
_Avoid_: Half clone, top copy

**Type Coercion**:
Cơ chế chuyển đổi tự động (ngầm định - Implicit) hoặc tường minh (Explicit) một giá trị từ kiểu dữ liệu này sang kiểu dữ liệu khác do JavaScript Engine thực thi theo đặc tả ECMA-262.
_Avoid_: Type casting (trong statically-typed languages), type magic

**ToPrimitive**:
Thuật toán trừu tượng nội bộ trong ECMA-262 (§7.1.1) biến đổi một Object thành giá trị nguyên thủy (Primitive), ưu tiên `[Symbol.toPrimitive](hint)`, kế đến là `valueOf()` hoặc `toString()`.
_Avoid_: Object flattening, primitive extractor

**Autoboxing (Wrapper Objects)**:
Cơ chế tạm thời đóng gói một giá trị Primitive (string, number, boolean) thành đối tượng wrapper tương ứng trên Memory Heap khi truy cập thuộc tính/phương thức, và lập tức hủy bỏ sau khi hoàn thành.
_Avoid_: Object boxing, auto-instantiation

**IsStrictlyEqual**:
Thuật toán trừu tượng ECMA-262 §7.2.15 triển khai toán tử `===`: không ép kiểu, trả về false ngay nếu khác type. Có 2 điểm không tương đồng với toán học: `NaN !== NaN` và `+0 === -0`.
_Avoid_: Strict comparison, type-safe equality

**IsLooselyEqual**:
Thuật toán trừu tượng ECMA-262 §7.2.14 triển khai toán tử `==`: thực hiện ép kiểu theo bảng quy tắc, có rule đặc biệt cho `null/undefined` (chỉ bằng nhau, không coerce sang số).
_Avoid_: Loose comparison, abstract equality

**SameValue**:
Thuật toán trừu tượng ECMA-262 §7.2.11 triển khai `Object.is()`: giống `===` nhưng xử lý đúng 2 edge case IEEE 754 — `NaN` đồng nhất với chính nó, và `+0` khác `−0`.
_Avoid_: Deep equality, reference equality

**IEEE 754**:
Chuẩn quốc tế định nghĩa cách biểu diễn và tính toán số thực dấu phẩy động trong máy tính (JavaScript dùng double-precision 64-bit). Quy định: mọi phép so sánh liên quan đến NaN đều trả về false; tồn tại hai zero phân biệt (+0 và −0).
_Avoid_: Floating point standard, IEEE standard

**Realm**:
Môi trường thực thi độc lập hoàn chỉnh trong JavaScript runtime, bao gồm một Global Object riêng biệt, Global Scope riêng, và một tập hợp các built-in constructors (Object, Array, Function...) riêng trên Memory Heap. Được tạo ra bởi mỗi window, tab, iframe hoặc worker.
_Avoid_: Sandbox, isolate scope, window context

**OrdinaryHasInstance (instanceof)**:
Thuật toán trừu tượng ECMA-262 §7.3.22 triển khai toán tử `instanceof`: kiểm tra xem `Constructor.prototype` có nằm trong chuỗi Prototype Chain (`[[Prototype]]`) của đối tượng hay không. Thất bại khi kiểm tra đối tượng sinh ra từ Realm khác (cross-realm) hoặc primitive literals.
_Avoid_: Type checker, class instance check

**Object.prototype.toString**:
Phương thức trích xuất nhãn định danh kiểu dữ liệu chuẩn (`[object Tag]`) thông qua internal slot `[[Class]]` hoặc `Symbol.toStringTag`. Là tiêu chuẩn vàng để kiểm tra kiểu dữ liệu trong JavaScript vì hoạt động chính xác xuyên suốt mọi Realm.
_Avoid_: Object serializer, type stringifier

**Symbol.toStringTag**:
Well-known Symbol trong ECMAScript cho phép tùy biến chuỗi mô tả nhãn kiểu dữ liệu trả về khi gọi `Object.prototype.toString(O)`.
_Avoid_: Custom tag, class tag

**Creation Phase (Khởi tạo Execution Context)**:
Giai đoạn đầu tiên trong vòng đời của một Execution Context, diễn ra trước khi bất kỳ dòng code nào được thực thi. Engine quét toàn bộ phạm vi để cấp phát Variable Environment, đăng ký Function Declarations với tham chiếu đầy đủ và khởi tạo các biến `var` với giá trị mặc định `undefined`.
_Avoid_: Pre-execution, compilation stage

**Variable Object (VO) / Activation Object (AO)**:
Cấu trúc dữ liệu trừu tượng trong đặc tả ES3 gắn liền với Execution Context chứa các biến, tham số hàm (arguments) và khai báo hàm. Trong ES6+, khái niệm này được chuẩn hóa và thay thế bởi Environment Record (Declarative và Object Environment Record).
_Avoid_: Scope dictionary, variable container

**Hoisting**:
Hành vi của JavaScript Engine khi phân tách quá trình biên dịch (Creation Phase) và thực thi (Execution Phase), trong đó các khai báo hàm và biến được ghi nhận vào Environment Record trước khi bất kỳ dòng code nào chạy. Bản chất mã nguồn không hề di chuyển vật lý.
_Avoid_: Code lifting, moving to top

**Temporal Dead Zone (TDZ)**:
Khoảng thời gian trong vòng đời của một biến bắt đầu từ khi bước vào phạm vi khối (Block Scope) cho đến khi câu lệnh khai báo (`let`/`const`) được thực thi. Trong TDZ, biến đã được khai báo nhưng chưa được khởi tạo (Uninitialized); mọi thao tác đọc/ghi đều ném ra ngoại lệ `ReferenceError`.
_Avoid_: Dead scope, uninitialized zone
