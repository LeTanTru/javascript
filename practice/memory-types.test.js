import { describe, it, expect } from "vitest";

describe("Bài 01: Primitive vs Reference Types & Memory Model", () => {
  it("1. Primitive types được sao chép theo giá trị (Pass-by-value)", () => {
    let x = 10;
    let y = x; // y nhận một bản sao độc lập của giá trị 10 trên Call Stack

    y = 20; // Thay đổi y không ảnh hưởng tới x

    expect(x).toBe(10);
    expect(y).toBe(20);
  });

  it("2. Reference types sao chép con trỏ địa chỉ bộ nhớ (Reference Pointer)", () => {
    const userA = { name: "Alice", role: "Developer" };
    const userB = userA; // userB sao chép cùng địa chỉ vùng nhớ trỏ tới Object trên Heap

    userB.name = "Bob"; // Đột biến (Mutate) object qua tham chiếu userB

    // Cả 2 biến cùng trỏ tới 1 ô nhớ duy nhất trên Heap
    expect(userA.name).toBe("Bob");
    expect(userA).toBe(userB); // So sánh bằng strict equality (===) kiểm tra cùng tham chiếu
  });

  it("3. Phân biệt Mutation (Đột biến thuộc tính) vs Reassignment (Gán lại địa chỉ)", () => {
    let itemA = { id: 1, title: "Phone" };
    let itemB = itemA;

    // Gán lại (Reassignment): itemB trỏ sang một ô nhớ hoàn toàn mới trên Heap
    itemB = { id: 2, title: "Laptop" };

    // itemA vẫn giữ nguyên tham chiếu đến object ban đầu
    expect(itemA.id).toBe(1);
    expect(itemA.title).toBe("Phone");
    expect(itemA).not.toBe(itemB);
  });

  it("4. Bẫy Shallow Copy (Spread Operator `{ ...obj }`): Chỉ clone 1 tầng nông", () => {
    const original = {
      id: 101,
      profile: { city: "Hanoi" }, // Nested object nằm ở một vùng nhớ khác trên Heap
    };

    // Shallow copy bằng Spread Operator
    const shallowCopy = { ...original };

    // Thuộc tính tầng 1 (primitive) được sao chép giá trị độc lập
    shallowCopy.id = 999;
    expect(original.id).toBe(101);

    // BẪY: Thuộc tính lồng nhau (nested object) vẫn dùng chung tham chiếu con trỏ!
    shallowCopy.profile.city = "Saigon";
    expect(original.profile.city).toBe("Saigon");
  });

  it("5. Deep Copy chuẩn hiện đại với structuredClone (Node 17+ / Native Web API)", () => {
    const original = {
      id: 101,
      createdAt: new Date("2026-01-01"),
      profile: { city: "Hanoi" },
      skills: ["JS", "TS"],
    };

    // structuredClone tạo bản sao độc lập 100% trên Heap, giữ nguyên Date/RegExp/Map/Set
    const deepCopied = structuredClone(original);

    deepCopied.profile.city = "Da Nang";
    deepCopied.skills.push("React");

    // Object gốc hoàn toàn không bị ảnh hưởng (Immutability được bảo toàn)
    expect(original.profile.city).toBe("Hanoi");
    expect(original.skills).toEqual(["JS", "TS"]);
    expect(deepCopied.createdAt).toBeInstanceOf(Date);
  });

  it("6. Lỗi lịch sử Type Tagging: typeof null trả về 'object'", () => {
    // Trong bản spec ECMA-262, null là một Primitive Type, KHÔNG PHẢI Object.
    // Lỗi typeof null === 'object' xuất phát từ cơ chế type tag bit 000 của JS 1.0 (1995)
    expect(typeof null).toBe("object");

    // Cách chuẩn xác để kiểm tra null trong thực tế
    const isActuallyNull = (val) => val === null;
    expect(isActuallyNull(null)).toBe(true);
  });
});
