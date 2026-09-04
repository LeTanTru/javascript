import { describe, it, expect } from "vitest";

describe("Bài 02: Type Coercion & Thuật toán ToPrimitive (ECMA-262)", () => {
  it("1. Autoboxing (Wrapper Objects): Tạm thời đóng gói Primitive thành Object", () => {
    const str = "javascript";

    // Khi truy cập thuộc tính .toUpperCase, V8 tự động tạo new String(str) tạm thời trên Heap
    // sau khi gọi xong, instance wrapper này lập tức bị Garbage Collector thu hồi
    expect(str.toUpperCase()).toBe("JAVASCRIPT");
    expect(typeof str).toBe("string"); // str gốc vẫn là primitive string

    // Trong ESM / Strict Mode: Thử gán thuộc tính vào primitive lập tức ném TypeError
    expect(() => {
      str.customProp = 42;
    }).toThrow(TypeError);
  });

  it("2. Thuật toán ToNumber: Ép kiểu sang số theo chuẩn ECMA-262 §7.1.3", () => {
    expect(Number(null)).toBe(0);           // null -> 0
    expect(Number(undefined)).toBeNaN();    // undefined -> NaN (không thể biểu diễn số)
    expect(Number(false)).toBe(0);          // boolean false -> 0
    expect(Number(true)).toBe(1);           // boolean true -> 1
    expect(Number("")).toBe(0);             // Chuỗi rỗng -> 0
    expect(Number("   123   ")).toBe(123);  // Chuỗi có khoảng trắng -> 123
    expect(Number("123abc")).toBeNaN();     // Chứa ký tự không hợp lệ -> NaN (khác parseInt!)
    expect(Number([])).toBe(0);             // [].toString() là "" -> Number("") -> 0
    expect(Number([42])).toBe(42);          // [42].toString() là "42" -> Number("42") -> 42
    expect(Number([1, 2])).toBeNaN();       // [1,2].toString() là "1,2" -> NaN
    expect(Number({})).toBeNaN();           // {}.toString() là "[object Object]" -> NaN
  });

  it("3. Toán tử cộng (+): Ưu tiên nối chuỗi nếu một bên ra string (ECMA-262 §13.15.3)", () => {
    // Phép cộng [] + {}
    // 1. [].ToPrimitive() -> [].toString() -> ""
    // 2. {}.ToPrimitive() -> {}.toString() -> "[object Object]"
    // 3. Có chuỗi -> Nối: "" + "[object Object]" -> "[object Object]"
    expect([] + {}).toBe("[object Object]");

    // Phép cộng hai mảng
    // [1, 2].toString() -> "1,2", [3, 4].toString() -> "3,4"
    expect([1, 2] + [3, 4]).toBe("1,23,4");

    // Thứ tự thực thi từ trái qua phải
    expect(1 + 2 + "3").toBe("33");   // (1 + 2) là số 3 -> 3 + "3" -> "33"
    expect("1" + 2 + 3).toBe("123");  // "1" + 2 -> "12" -> "12" + 3 -> "123"
    expect(1 + + "2").toBe(3);        // Toán tử một ngôi + "2" ép thành số 2 trước
  });

  it("4. Các toán tử số học (-, *, /, %): Luôn ép cả hai toán hạng về Number", () => {
    // Không có khái niệm nối chuỗi cho toán tử trừ, nhân, chia
    expect([] - 1).toBe(-1);          // [] -> "" -> 0 - 1 = -1
    expect("6" / "2").toBe(3);        // "6" -> 6, "2" -> 2 -> 6 / 2 = 3
    expect([10] * [2]).toBe(20);      // [10] -> 10, [2] -> 2 -> 10 * 2 = 20
    expect({} - 1).toBeNaN();         // {} -> "[object Object]" -> NaN - 1 = NaN
  });

  it("5. Kiểm soát cơ chế ToPrimitive với Symbol.toPrimitive", () => {
    // Khởi tạo object với Symbol.toPrimitive tùy biến
    const wallet = {
      vnd: 50000,
      code: "VND",
      [Symbol.toPrimitive](hint) {
        if (hint === "number") {
          return this.vnd;
        }
        if (hint === "string") {
          return `${this.vnd} ${this.code}`;
        }
        // hint === "default" (dùng cho toán tử + hoặc so sánh ==)
        return this.vnd;
      },
    };

    // Khi dùng trong ngữ cảnh toán học (hint: "number")
    expect(+wallet).toBe(50000);
    expect(wallet - 10000).toBe(40000);

    // Khi ép kiểu chuỗi tường minh (hint: "string")
    expect(String(wallet)).toBe("50000 VND");

    // Khi dùng toán tử + (hint: "default")
    expect(wallet + 5000).toBe(55000);
  });
});
