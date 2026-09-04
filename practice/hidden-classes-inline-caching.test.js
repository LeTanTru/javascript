import { describe, it, expect } from 'vitest';

// ─── SIMULATION MODEL: HIDDEN CLASSES & INLINE CACHING ────────────────────────

export class ShapeRegistry {
  constructor() {
    this.rootShape = { id: 'Shape_Root', transitions: new Map(), offsets: new Map() };
    this.shapeCounter = 0;
  }

  createObject() {
    return {
      __shape: this.rootShape,
      __properties: [],
    };
  }

  addProperty(obj, propName, value) {
    const currentShape = obj.__shape;

    if (!currentShape.transitions.has(propName)) {
      this.shapeCounter++;
      const nextShape = {
        id: `Shape_${this.shapeCounter}_(+${propName})`,
        transitions: new Map(),
        offsets: new Map(currentShape.offsets),
      };
      // Gán offset cho thuộc tính mới
      const newOffset = currentShape.offsets.size;
      nextShape.offsets.set(propName, newOffset);
      currentShape.transitions.set(propName, nextShape);
    }

    obj.__shape = currentShape.transitions.get(propName);
    const offset = obj.__shape.offsets.get(propName);
    obj.__properties[offset] = value;
  }
}

export class InlineCacheCallSite {
  constructor(propertyName) {
    this.propertyName = propertyName;
    this.cachedShapes = new Map(); // shape.id -> offset
  }

  get state() {
    const size = this.cachedShapes.size;
    if (size === 0) return 'UNINITIALIZED';
    if (size === 1) return 'MONOMORPHIC';
    if (size <= 4) return 'POLYMORPHIC';
    return 'MEGAMORPHIC';
  }

  getProperty(obj) {
    const shape = obj.__shape;

    // Fast Path: Đã có trong cache IC
    if (this.cachedShapes.has(shape.id)) {
      const offset = this.cachedShapes.get(shape.id);
      return obj.__properties[offset];
    }

    // Slow Path: Cache Miss -> Tìm trong Shape offsets và nạp vào IC
    if (!shape.offsets.has(this.propertyName)) {
      return undefined;
    }

    const offset = shape.offsets.get(this.propertyName);
    this.cachedShapes.set(shape.id, offset);
    return obj.__properties[offset];
  }
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 08 - Bài 33: Hidden Classes (Shapes) & Inline Caching', () => {
  it('1. Cùng thứ tự thêm thuộc tính -> Chia sẻ cùng 1 Hidden Class', () => {
    const registry = new ShapeRegistry();

    const objA = registry.createObject();
    registry.addProperty(objA, 'x', 10);
    registry.addProperty(objA, 'y', 20);

    const objB = registry.createObject();
    registry.addProperty(objB, 'x', 30);
    registry.addProperty(objB, 'y', 40);

    // Cả objA và objB đều trải qua transition: Root -> (+x) -> (+y)
    expect(objA.__shape.id).toBe(objB.__shape.id);
    expect(objA.__shape.id).toBe('Shape_2_(+y)');
  });

  it('2. Khác thứ tự thêm thuộc tính -> Rẽ nhánh thành các Hidden Classes khác nhau', () => {
    const registry = new ShapeRegistry();

    const obj1 = registry.createObject();
    registry.addProperty(obj1, 'x', 1);
    registry.addProperty(obj1, 'y', 2); // Root -> (+x) -> (+y)

    const obj2 = registry.createObject();
    registry.addProperty(obj2, 'y', 2); // Root -> (+y)
    registry.addProperty(obj2, 'x', 1); // Root -> (+y) -> (+x)

    // obj1 và obj2 có 2 shapes hoàn toàn khác nhau!
    expect(obj1.__shape.id).not.toBe(obj2.__shape.id);
  });

  it('3. Inline Caching: Monomorphic Call Site đạt tốc độ tối đa $O(1)$ với 1 Shape', () => {
    const registry = new ShapeRegistry();
    const callSite = new InlineCacheCallSite('x');

    const objA = registry.createObject();
    registry.addProperty(objA, 'x', 100);

    const objB = registry.createObject();
    registry.addProperty(objB, 'x', 200);

    expect(callSite.getProperty(objA)).toBe(100);
    expect(callSite.state).toBe('MONOMORPHIC');

    expect(callSite.getProperty(objB)).toBe(200);
    // Vẫn duy trì Monomorphic vì objB cùng shape với objA
    expect(callSite.state).toBe('MONOMORPHIC');
  });

  it('4. Inline Caching: Polymorphic Call Site khi gặp từ 2 đến 4 Shapes khác nhau', () => {
    const registry = new ShapeRegistry();
    const callSite = new InlineCacheCallSite('x');

    // Tạo 3 objects với 3 shapes khác nhau
    const obj1 = registry.createObject();
    registry.addProperty(obj1, 'x', 1);

    const obj2 = registry.createObject();
    registry.addProperty(obj2, 'a', 0);
    registry.addProperty(obj2, 'x', 2);

    const obj3 = registry.createObject();
    registry.addProperty(obj3, 'b', 0);
    registry.addProperty(obj3, 'x', 3);

    callSite.getProperty(obj1);
    expect(callSite.state).toBe('MONOMORPHIC');

    callSite.getProperty(obj2);
    expect(callSite.state).toBe('POLYMORPHIC');

    callSite.getProperty(obj3);
    expect(callSite.state).toBe('POLYMORPHIC');
    expect(callSite.cachedShapes.size).toBe(3);
  });

  it('5. Inline Caching: Megamorphic Call Site khi vượt quá 4 Shapes (> 4)', () => {
    const registry = new ShapeRegistry();
    const callSite = new InlineCacheCallSite('x');

    // Tạo 5 objects với 5 shapes khác nhau
    for (let i = 0; i < 5; i++) {
      const obj = registry.createObject();
      registry.addProperty(obj, `dummy_${i}`, 0);
      registry.addProperty(obj, 'x', i * 10);
      callSite.getProperty(obj);
    }

    // Đạt 5 shapes -> Chuyển sang MEGAMORPHIC (Bỏ IC, tra cứu chậm)
    expect(callSite.state).toBe('MEGAMORPHIC');
  });

  it('6. Dictionary Mode: Tránh toán tử delete để không làm hỏng Shape', () => {
    function mutateObjectSafely(obj, key) {
      // Cách an toàn: gán undefined/null thay vì delete
      obj[key] = undefined;
      return obj;
    }

    const user = { id: 1, tempToken: 'xyz' };
    mutateObjectSafely(user, 'tempToken');

    expect(user.tempToken).toBeUndefined();
    expect('tempToken' in user).toBe(true); // Vẫn giữ nguyên layout shape
  });
});
