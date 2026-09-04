import { describe, it, expect } from 'vitest';

/**
 * MODULE 11: JAVASCRIPT NỀN TẢNG CHO REACT
 * BÀI 40: ARRAY METHODS & IMMUTABILITY CHO REACT STATE
 */

describe('Bài 40 - Array Methods & Immutability for React State', () => {

  // 1. Thêm phần tử mới bất biến (Add to State)
  it('1. Thêm phần tử mới mà không làm mutate mảng cũ', () => {
    const todos = [{ id: 1, text: 'Học JS' }];
    const newTodo = { id: 2, text: 'Học React' };

    // Thêm vào cuối
    const addedEnd = [...todos, newTodo];
    expect(addedEnd.length).toBe(2);
    expect(todos.length).toBe(1); // Không bị mutate!

    // Thêm vào đầu (Unshift immutably)
    const addedStart = [newTodo, ...todos];
    expect(addedStart[0].id).toBe(2);
    expect(todos.length).toBe(1);
  });

  // 2. Xóa phần tử theo ID bất biến (Delete from State with filter)
  it('2. Xóa phần tử theo ID bằng Array.prototype.filter()', () => {
    const list = [
      { id: 'a', title: 'Task A' },
      { id: 'b', title: 'Task B' },
      { id: 'c', title: 'Task C' }
    ];

    const deleteId = 'b';
    const filteredList = list.filter(item => item.id !== deleteId);

    expect(filteredList.length).toBe(2);
    expect(filteredList.some(item => item.id === 'b')).toBe(false);
    expect(list.length).toBe(3); // Mảng gốc nguyên vẹn
  });

  // 3. Cập nhật phần tử theo ID bất biến (Update Item with map)
  it('3. Cập nhật phần tử theo ID bằng Array.prototype.map()', () => {
    const cart = [
      { id: 101, name: 'MacBook', quantity: 1 },
      { id: 102, name: 'Mouse', quantity: 2 }
    ];

    const targetId = 101;
    const updatedCart = cart.map(item => {
      if (item.id === targetId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item; // Giữ nguyên tham chiếu của item không thay đổi
    });

    expect(updatedCart[0].quantity).toBe(2);
    expect(cart[0].quantity).toBe(1); // Mảng gốc không đổi
    expect(updatedCart[1]).toBe(cart[1]); // Shallow identity optimization
  });

  // 4. ES2023 Non-mutating Array Methods (toSorted, toReversed, toSpliced, with)
  it('4. Sử dụng ES2023 toSorted, toReversed, toSpliced và with thay cho mutating methods', () => {
    const numbers = [3, 1, 4, 1, 5];

    // toSorted vs sort
    const sorted = numbers.toSorted((a, b) => a - b);
    expect(sorted).toEqual([1, 1, 3, 4, 5]);
    expect(numbers).toEqual([3, 1, 4, 1, 5]); // numbers không bị đảo lộn

    // with (thay thế phần tử tại index bất biến)
    const replaced = numbers.with(0, 99);
    expect(replaced[0]).toBe(99);
    expect(numbers[0]).toBe(3);

    // toSpliced (chèn hoặc xóa tại index bất biến)
    const inserted = numbers.toSpliced(2, 0, 888);
    expect(inserted).toEqual([3, 1, 888, 4, 1, 5]);
    expect(numbers.length).toBe(5);
  });

  // 5. Tính toán Derived State với reduce (Cart Total & Grouping)
  it('5. Tính toán Derived State (Tổng tiền, Group by Category) với reduce', () => {
    const products = [
      { id: 1, name: 'Book A', category: 'books', price: 10, count: 2 },
      { id: 2, name: 'Book B', category: 'books', price: 15, count: 1 },
      { id: 3, name: 'Pen', category: 'stationery', price: 5, count: 4 }
    ];

    // 1. Tính tổng giỏ hàng (Derived State thay vì lưu thêm state phụ)
    const totalAmount = products.reduce((acc, p) => acc + p.price * p.count, 0);
    expect(totalAmount).toBe(55);

    // 2. Nhóm sản phẩm theo category
    const grouped = products.reduce((acc, p) => {
      acc[p.category] = acc[p.category] || [];
      acc[p.category].push(p);
      return acc;
    }, {});

    expect(grouped.books.length).toBe(2);
    expect(grouped.stationery.length).toBe(1);
  });

  // 6. Kiểm tra điều kiện danh sách với some & every (Form Validation)
  it('6. Kiểm tra tính hợp lệ toàn diện của Form với every & some', () => {
    const formFields = [
      { name: 'username', valid: true },
      { name: 'email', valid: true },
      { name: 'password', valid: false }
    ];

    const isFormValid = formFields.every(field => field.valid);
    const hasAnyError = formFields.some(field => !field.valid);

    expect(isFormValid).toBe(false);
    expect(hasAnyError).toBe(true);
  });

});
