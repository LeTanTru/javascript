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

**Scope Chain**:
Danh sách liên kết đơn (Singly Linked List) kết nối các Lexical Environments thông qua con trỏ tham chiếu `outer`. Xác định thứ tự phân giải biến từ phạm vi cục bộ hiện tại ngược lên phạm vi cha và kết thúc ở Global Environment.
_Avoid_: Scope ladder, variable tree

**Identifier Resolution (Phân giải định danh)**:
Thuật toán trừu tượng trong JavaScript Engine nhằm xác định giá trị tương ứng của một tên biến bằng cách duyệt tuyến tính dọc theo Scope Chain từ Environment Record hiện tại ra ngoài. Nếu đến Global Scope mà không tìm thấy: ném `ReferenceError` khi đọc biến, hoặc tạo thuộc tính toàn cục trên `window` khi gán biến trong non-strict mode.
_Avoid_: Variable search, name lookup

**Revealing Module Pattern**:
Mẫu thiết kế phần mềm kết hợp hàm đóng gói (IIFE hoặc factory function) và Closures để tạo ra phạm vi dữ liệu riêng tư (Private State) và chỉ trả về một object công khai chứa các phương thức (Public API) được phép truy cập.
_Avoid_: Object wrapper, hidden class pattern

**Currying**:
Kỹ thuật chuyển đổi một hàm nhận $n$ tham số thành một chuỗi $n$ hàm lồng nhau liên tiếp, trong đó mỗi hàm con nhận đúng một tham số duy nhất và lưu giữ các tham số trước đó nhờ Closures.
_Avoid_: Nested calling, chain parameters

**Memoization**:
Kỹ thuật tối ưu hóa hiệu năng bằng cách lưu trữ kết quả của các lần gọi hàm thuần túy (Pure Functions) ứng với từng bộ tham số vào một bộ đệm (Cache) nằm trong phạm vi Closure, giúp các lần gọi sau trả kết quả ngay lập tức với O(1).
_Avoid_: Memory saving, function caching

**Retained Size**:
Tổng dung lượng bộ nhớ vật lý trên Memory Heap sẽ được Garbage Collector giải phóng ngay lập tức nếu đối tượng đích bị tiêu hủy (bao gồm chính đối tượng đó và toàn bộ cây đối tượng phụ thuộc chỉ có thể tiếp cận thông qua nó).
_Avoid_: Object weight, total memory

**Detached DOM Tree**:
Hiện tượng rò rỉ bộ nhớ xảy ra khi một phần tử HTML đã bị gỡ khỏi cây DOM của trang web nhưng vẫn không thể bị Garbage Collector thu dọn do còn ít nhất một biến hoặc Closure trong JavaScript lưu giữ tham chiếu trực tiếp/gián tiếp tới nó.
_Avoid_: Orphan node, floating element

**[[Prototype]]**:
Internal slot ẩn của mọi đối tượng trong JavaScript theo đặc tả ECMAScript, lưu trữ tham chiếu đến prototype object mà đối tượng đó kế thừa. Đỉnh của chuỗi kế thừa là `Object.prototype` với `[[Prototype]] === null`. Truy cập chuẩn qua `Object.getPrototypeOf()` và `Object.setPrototypeOf()`.
_Avoid_: Hidden class, base class

**__proto__**:
Accessor property (getter/setter) trên `Object.prototype` cho phép đọc/ghi `[[Prototype]]` của đối tượng. Đã bị xem là deprecated trong chuẩn hiện đại, chỉ tồn tại để tương thích ngược.
_Avoid_: Function prototype, prototype property

**Property Shadowing**:
Hiện tượng khi một thuộc tính được gán trực tiếp lên đối tượng con (Own Property) có cùng tên với thuộc tính nằm trên Prototype Chain của nó, dẫn đến việc thuộc tính con che khuất thuộc tính cha trong các thao tác đọc mà không làm thay đổi giá trị trên prototype cha.
_Avoid_: Property overriding, class overwrite

**[[Construct]]**:
Internal method trong đặc tả ECMAScript được gắn liền với các hàm có khả năng làm hàm khởi tạo (Constructor Functions, ES6 Classes). Được kích hoạt bởi toán tử `new` để thực thi chuỗi 4 bước: tạo object rỗng, liên kết prototype, bind `this` và giải quyết The Return Trap.
_Avoid_: Function builder, class instantiator

**new.target**:
Meta-property được bổ sung trong ES6 trỏ tới hàm constructor đã được kích hoạt trực tiếp thông qua toán tử `new`. Có giá trị là `undefined` nếu hàm được gọi theo cách thông thường; được dùng làm nền tảng cho Safe Constructor Pattern và kiểm soát tính kế thừa trong các lớp con.
_Avoid_: Constructor detector, target property

**Syntactic Sugar**:
Cú pháp trong ngôn ngữ lập trình được thiết kế nhằm giúp mã nguồn dễ đọc, biểu cảm và thuận tiện hơn cho con người, nhưng không hề bổ sung thêm bất kỳ tính năng hoặc mô hình tính toán mới nào bên dưới runtime (ví dụ ES6 Class thực chất vận hành 100% dựa trên Prototype Chain).
_Avoid_: New runtime feature, compiler magic

**Private Fields (#field)**:
Tính năng được chuẩn hóa trong ES2022 cho phép khai báo thuộc tính và phương thức hoàn toàn riêng tư bên trong class bằng tiền tố `#`. Được kiểm soát ở tầng bytecode của Engine (cơ chế PrivateBrand), ném SyntaxError nếu truy xuất trái phép từ bên ngoài và vô hình trước mọi kỹ thuật reflection.
_Avoid_: Soft private, pseudo-private

**Parasitic Combination Inheritance**:
Mẫu kế thừa tối ưu nhất trong kỷ nguyên ES5: sử dụng `Parent.call(this)` để mượn constructor khởi tạo thuộc tính instance, kết hợp `Object.create(Parent.prototype)` để kế thừa phương thức mà không cần gọi constructor của cha lần thứ 2. Là nền tảng cơ sở mà ES6 `class...extends` mô phỏng lại.
_Avoid_: Double constructor inheritance, classical clone

**Meta-Programming (Siêu lập trình)**:
Khả năng của một chương trình máy tính có thể đọc, phân tích, sửa đổi hoặc tùy biến chính hành vi cốt lõi của ngôn ngữ runtime tại thời điểm thực thi. Trong JavaScript, Meta-programming được triển khai qua Proxy, Reflect và Symbols.
_Avoid_: Code generation, macro system

**Reflect API**:
Đối tượng tĩnh toàn cục trong ES6 cung cấp 13 phương thức chuẩn ánh xạ 1:1 với các Proxy Traps để thực thi các hành vi mặc định của JavaScript Engine. Giúp chuẩn hóa giá trị trả về (trả boolean thay vì ném lỗi) và bảo toàn ngữ cảnh `this` thông qua tham số `receiver`.
_Avoid_: Reflection class, object helper

**Proxy Trap**:
Hàm đánh chặn được định nghĩa trong đối tượng handler của `Proxy`, cho phép can thiệp và ghi đè một trong 13 internal methods tương ứng của JavaScript Engine (như `get`, `set`, `has`, `deleteProperty`, `apply`).
_Avoid_: Hook, middleware, event handler

**Reactivity**:
Mô hình lập trình khai báo trong đó giao diện hoặc các phép tính toán phụ thuộc (effects) tự động cập nhật phản ánh sự thay đổi của trạng thái dữ liệu (state). Trong kiến trúc hiện đại (Vue 3, Signals), Reactivity được xây dựng dựa trên `Proxy` (bẫy `get` để track dependency, bẫy `set` để trigger effects).
_Avoid_: Two-way binding, auto-update

**Default Binding**:
Quy tắc xác định `this` khi một hàm được kích hoạt độc lập không qua đối tượng sở hữu hay cú pháp ràng buộc nào. Trong Strict Mode, `this` nhận giá trị `undefined`; trong Non-strict Mode, `this` trỏ tới Global Object (`window`/`global`).
_Avoid_: Global binding, fallback this

**Implicit Binding**:
Quy tắc xác định `this` khi một phương thức được kích hoạt thông qua đối tượng sở hữu (dấu chấm `obj.fn()`). Lúc này `this` được ngầm định trỏ tới chính đối tượng đứng ngay trước dấu chấm tại Call-site. Dễ bị mất liên kết (Implicit Binding Loss) khi truyền callback.
_Avoid_: Object this, method context

**Explicit Binding**:
Quy tắc ép buộc `this` trỏ tới một đối tượng context chỉ định tường minh thông qua các phương thức `Function.prototype.call`, `apply`, hoặc `bind` (Hard Binding).
_Avoid_: Forced this, manual context

**New Binding**:
Quy tắc xác định `this` khi một hàm constructor được kích hoạt với từ khóa `new`. `this` được Engine tự động gán vào instance đối tượng mới vừa được tạo trên Memory Heap. Có độ ưu tiên cao hơn cả Hard Binding.
_Avoid_: Constructor this, class binding

**Lexical this**:
Cơ chế xác định ngữ cảnh của Arrow Function trong ES6: không tạo ra ràng buộc `this` riêng mà kế thừa trực tiếp giá trị `this` từ phạm vi từ vựng (Lexical Scope) bao quanh nó thông qua Scope Chain. Hoàn toàn miễn nhiễm trước `call`, `apply`, và `bind`.
_Avoid_: Static this, scope this

**Rest Parameters (...args)**:
Cú pháp trong ES6 cho phép gom toàn bộ các tham số còn lại truyền vào hàm thành một mảng JavaScript thực sự (`Array.isArray(args) === true`), thay thế đối tượng giả mảng lỗi thời `arguments` của ES5.
_Avoid_: Arguments array, spread parameter

**Polyfill**:
Đoạn mã nguồn (thường bằng JavaScript thuần) được dùng để cung cấp các tính năng hoặc API mới của chuẩn ECMAScript trên các trình duyệt hoặc môi trường runtime cũ chưa hỗ trợ native.
_Avoid_: Shim, monkey patch, library hack

**Property Hijacking**:
Kỹ thuật mượn cơ chế Implicit Binding để cài đặt Explicit Binding trong polyfill `call`/`apply`: gán tạm hàm làm method của đối tượng context bằng `Symbol('fnKey')`, kích hoạt hàm đó qua cú pháp `context[fnKey]()`, sau đó dọn dẹp bằng `delete`.
_Avoid_: Method hijacking, object monkey-patch

**Partial Application**:
Kỹ thuật truyền trước một tập hợp con các tham số vào một hàm và trả về một hàm mới (Bound Function) chờ nhận nốt các tham số còn lại khi được thực thi, được hiện thực hóa qua `Function.prototype.bind`.
_Avoid_: Partial call, parameter caching

**Event Loop**:
Cơ chế điều phối ngoại vi của môi trường lưu trữ (Hosting Environment) liên tục giám sát Call Stack và các hàng đợi tác vụ nhằm hiện thực hóa mô hình xử lý bất đồng bộ không chặn (Non-blocking Asynchronous Concurrency) trên một luồng thực thi đơn nhất.
_Avoid_: Thread scheduler, process loop

**Task Queue (Macrotask Queue)**:
Hàng đợi FIFO lưu trữ các callback đã sẵn sàng từ các Web APIs hoặc Libuv như `setTimeout`, `setInterval`, I/O events và UI rendering events. Mỗi lượt quay của Event Loop chỉ bốc đúng một Macrotask.
_Avoid_: Event queue, message queue

**Microtask Queue**:
Hàng đợi FIFO ưu tiên cao lưu trữ các tác vụ vi mô như `Promise.then/catch/finally`, `queueMicrotask`, và `MutationObserver`. Event Loop bắt buộc phải vét cạn (drain) toàn bộ Microtask Queue trước khi chuyển sang giai đoạn kế tiếp.
_Avoid_: Sub-task queue, inner queue

**Event Loop Starvation**:
Hiện tượng vòng lặp sự kiện bị phong tỏa hoàn toàn (không thể render UI hay xử lý các Macrotask kế tiếp) do một chuỗi đệ quy tác vụ vi mô liên tục nhồi thêm việc vào Microtask Queue khiến hàng đợi này không bao giờ xả cạn.
_Avoid_: Loop freeze, stack blocking










