/**
 * practice/equality.test.js
 * Bài 03 — So sánh bằng: === vs == vs Object.is()
 * Kiểm chứng: IsStrictlyEqual, IsLooselyEqual (bảng null/undefined), SameValue, IEEE 754
 *
 * Chạy: npm test
 * Môi trường: Vitest 4.x / Node 22 / ESM strict mode
 */
import { describe, it, expect } from "vitest";

// ─────────────────────────────────────────────
// Test 1: === (IsStrictlyEqual) — Bẫy NaN & -0
// ─────────────────────────────────────────────
describe("1. Toán tử === (IsStrictlyEqual — ECMA-262 §7.2.15)", () => {
  it("NaN không bằng chính nó theo IEEE 754 — đây là cách duy nhất số tự khác mình", () => {
    const result = NaN === NaN;
    expect(result).toBe(false); // bẫy: mọi ngôn ngữ tuân IEEE 754 đều thế này

    // Kiểm tra đúng NaN phải dùng Number.isNaN, KHÔNG dùng isNaN toàn cục
    expect(Number.isNaN(NaN)).toBe(true);
    expect(Number.isNaN("hello")).toBe(false); // isNaN("hello") sẽ là true — sai!
  });

  it("+0 và -0 bằng nhau theo ===, khác nhau theo Object.is()", () => {
    expect(+0 === -0).toBe(true);  // === không phân biệt dấu của zero
    expect(Object.is(+0, -0)).toBe(false); // SameValue phân biệt chính xác
  });
});

// ─────────────────────────────────────────────
// Test 2: Object.is() — SameValue (ECMA-262 §7.2.11)
// ─────────────────────────────────────────────
describe("2. Object.is() (SameValue — ECMA-262 §7.2.11)", () => {
  it("Object.is(NaN, NaN) là true — hành xử toán học đúng hơn ===", () => {
    expect(Object.is(NaN, NaN)).toBe(true);
  });

  it("Object.is phân biệt +0 và -0 — quan trọng khi tính toán hướng/góc", () => {
    expect(Object.is(+0, -0)).toBe(false);
    expect(Object.is(+0, +0)).toBe(true);
    expect(Object.is(-0, -0)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Test 3: == (IsLooselyEqual) — Bảng quy tắc coerce
// Rule đặc biệt: null và undefined chỉ == với nhau
// ─────────────────────────────────────────────
describe("3. Toán tử == (IsLooselyEqual — ECMA-262 §7.2.14)", () => {
  it("null == undefined là true — đây là quy tắc cứng trong spec, KHÔNG coerce sang số", () => {
    // Đây là 1 trong 2 cặp duy nhất null/undefined bằng nhau qua ==
    expect(null == undefined).toBe(true);
    expect(undefined == null).toBe(true);
  });

  it("null KHÔNG == 0 và KHÔNG == false — null chỉ == null hoặc undefined", () => {
    expect(null == 0).toBe(false);     // bẫy kinh điển: dù ToNumber(null) = 0
    expect(null == false).toBe(false); // rule đặc biệt: null không coerce trong ==
    expect(null == "").toBe(false);
    expect(null == null).toBe(true);   // chỉ bằng chính nó...
  });

  it("Chuỗi và Boolean coerce sang số khi so sánh với nhau qua ==", () => {
    // "0" == false: ToNumber(false) = 0, ToNumber("0") = 0 -> true
    expect("0" == false).toBe(true);

    // "" == false: ToNumber("") = 0, ToNumber(false) = 0 -> true
    expect("" == false).toBe(true);

    // "1" == true: ToNumber(true) = 1, ToNumber("1") = 1 -> true
    expect("1" == true).toBe(true);

    // "2" == true: ToNumber(true) = 1, ToNumber("2") = 2 -> false!
    expect("2" == true).toBe(false);
  });

  it("Array rỗng == false vì cả 2 đều coerce về 0 qua ToPrimitive -> ToNumber", () => {
    // [] == false
    // B1: ToNumber(false) = 0
    // B2: ToPrimitive([]) -> "".toString() -> "" -> ToNumber("") = 0
    // B3: 0 == 0 -> true
    expect([] == false).toBe(true);
    expect([] == 0).toBe(true);
    expect([] == "").toBe(true);
  });
});

// ─────────────────────────────────────────────
// Test 4: Giải mã null >= 0 — 2 thuật toán khác nhau
// ─────────────────────────────────────────────
describe("4. Giải mã null >= 0 (Abstract Relational Comparison vs IsLooselyEqual)", () => {
  it("null >= 0 là TRUE vì >= dùng Abstract Relational Comparison (ép sang số)", () => {
    // Abstract Relational Comparison: ToNumber(null) = 0 -> 0 >= 0 -> true
    expect(null >= 0).toBe(true);
  });

  it("null > 0 là FALSE vì ToNumber(null) = 0, và 0 > 0 là false", () => {
    expect(null > 0).toBe(false);
  });

  it("null == 0 là FALSE — IsLooselyEqual có rule đặc biệt: null không coerce sang số", () => {
    // Đây là điểm mâu thuẫn nổi tiếng: >= dùng thuật toán khác ==
    expect(null == 0).toBe(false);
  });

  it("undefined >= 0 là FALSE vì ToNumber(undefined) = NaN, mọi so sánh với NaN là false", () => {
    expect(undefined >= 0).toBe(false);
    expect(undefined > 0).toBe(false);
    expect(undefined < 0).toBe(false);
  });
});

// ─────────────────────────────────────────────
// Test 5: Number.isNaN() vs isNaN() toàn cục — khác biệt quan trọng
// ─────────────────────────────────────────────
describe("5. Number.isNaN() vs isNaN() — kiểm tra NaN đúng cách", () => {
  it("isNaN() toàn cục ép kiểu sang số TRƯỚC khi kiểm tra — bẫy nguy hiểm", () => {
    expect(isNaN("hello")).toBe(true);  // "hello" -> ToNumber -> NaN -> true (SAI!)
    expect(isNaN("")).toBe(false);      // "" -> ToNumber -> 0 -> false
    expect(isNaN(undefined)).toBe(true); // undefined -> NaN -> true
  });

  it("Number.isNaN() KHÔNG coerce — chỉ true khi giá trị thực sự là NaN", () => {
    expect(Number.isNaN("hello")).toBe(false); // không coerce, "hello" không phải NaN
    expect(Number.isNaN(undefined)).toBe(false);
    expect(Number.isNaN(NaN)).toBe(true);      // chỉ giá trị NaN thật mới true
    expect(Number.isNaN(0 / 0)).toBe(true);    // phép tính sinh ra NaN
  });
});
