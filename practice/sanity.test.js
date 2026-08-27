// practice/sanity.test.js
// Test kiểm tra môi trường chạy Vitest và JavaScript Core ESM

import { describe, it, expect } from "vitest";

describe("Sanity Check: Môi trường JavaScript Core & Vitest", () => {
  it("Kiểm tra phép toán số học cơ bản", () => {
    // Đảm bảo runtime hoạt động chuẩn xác
    expect(1 + 1).toBe(2);
  });

  it("Kiểm tra kiểu dữ liệu JavaScript Core: typeof NaN là number", () => {
    // NaN (Not-a-Number) trong chuẩn ECMA-262 vẫn mang kiểu primitive là 'number'
    expect(typeof NaN).toBe("number");
  });

  it("Kiểm tra cơ chế so sánh bằng nghiêm ngặt của Object.is", () => {
    // Object.is phân biệt được +0 và -0, và nhận diện đúng NaN === NaN
    expect(Object.is(NaN, NaN)).toBe(true);
    expect(Object.is(+0, -0)).toBe(false);
  });
});
