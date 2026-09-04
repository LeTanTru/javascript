import { describe, it, expect } from 'vitest';

/**
 * MODULE 11: JAVASCRIPT NỀN TẢNG CHO REACT
 * BÀI 42: LOGIC & CONDITIONAL RENDERING TRONG JSX
 */

describe('Bài 42 - Logic & Conditional Rendering in JSX', () => {

  // 1. Bẫy số 0 trong && Short-circuit Evaluation
  it('1. Bẫy số 0 trong toán tử && và cách khắc phục triệt để', () => {
    function simulateBuggyJSX(count) {
      // count = 0 -> 0 && <Badge /> trả về 0 (Sẽ bị render thành ký tự '0' trên giao diện!)
      return count && '<Badge />';
    }

    function simulateFixedJSX(count) {
      // Cách 1: So sánh lớn hơn 0
      // Cách 2: Boolean(count)
      // Cách 3: count > 0 ? <Badge /> : null
      return count > 0 ? '<Badge />' : null;
    }

    expect(simulateBuggyJSX(0)).toBe(0); // BUG: JSX render '0'
    expect(simulateFixedJSX(0)).toBeNull(); // FIX: JSX bỏ qua null (không render gì)
    expect(simulateFixedJSX(5)).toBe('<Badge />');
  });

  // 2. Các giá trị bị JSX bỏ qua (Ignored Values) vs Rendered Values
  it('2. JSX bỏ qua null, undefined, false, true nhưng RENDER số 0 và NaN', () => {
    function shouldRenderToDOM(value) {
      // Quy tắc JSX Runtime: boolean, null, undefined không tạo DOM node
      if (value === null || value === undefined || typeof value === 'boolean') {
        return false;
      }
      return true; // số 0, chuỗi, object, NaN đều bị ép hiển thị
    }

    expect(shouldRenderToDOM(null)).toBe(false);
    expect(shouldRenderToDOM(undefined)).toBe(false);
    expect(shouldRenderToDOM(false)).toBe(false);
    expect(shouldRenderToDOM(true)).toBe(false);

    expect(shouldRenderToDOM(0)).toBe(true); // Cần hết sức cẩn thận
    expect(shouldRenderToDOM('Hello')).toBe(true);
  });

  // 3. Early Return Guard Clauses trong Component Render
  it('3. Áp dụng Early Return (Guard Clauses) để xử lý trạng thái Loading & Error', () => {
    function renderComponentState({ loading, error, data }) {
      if (loading) return 'LOADING_SPINNER';
      if (error) return `ERROR_BANNER: ${error}`;
      if (!data || data.length === 0) return 'EMPTY_STATE';
      return `DATA_LIST: ${data.join(', ')}`;
    }

    expect(renderComponentState({ loading: true })).toBe('LOADING_SPINNER');
    expect(renderComponentState({ loading: false, error: 'Network 500' })).toBe('ERROR_BANNER: Network 500');
    expect(renderComponentState({ loading: false, data: [] })).toBe('EMPTY_STATE');
    expect(renderComponentState({ loading: false, data: ['React', 'Vite'] })).toBe('DATA_LIST: React, Vite');
  });

  // 4. Dictionary / Object Mapping thay cho lồng nhiều Ternary
  it('4. Pattern Dictionary Mapping thay thế Nested Ternaries cho Status Badges', () => {
    const STATUS_MAP = {
      pending: { label: 'Đang chờ', color: 'orange' },
      success: { label: 'Thành công', color: 'green' },
      failed: { label: 'Thất bại', color: 'red' }
    };

    function getBadgeProps(status) {
      return STATUS_MAP[status] ?? { label: 'Không xác định', color: 'gray' };
    }

    expect(getBadgeProps('pending')).toEqual({ label: 'Đang chờ', color: 'orange' });
    expect(getBadgeProps('unknown')).toEqual({ label: 'Không xác định', color: 'gray' });
  });

  // 5. Logical OR (||) fallback cho Content Defaults
  it('5. Kết hợp Ternary & Optional Chaining cho Avatar fallback an toàn', () => {
    function renderUserAvatar(user) {
      return user?.avatarUrl
        ? `<img src="${user.avatarUrl}" />`
        : `<div class="placeholder">${user?.name?.[0] ?? 'U'}</div>`;
    }

    const userWithAvatar = { name: 'Tru Le', avatarUrl: '/tru.jpg' };
    expect(renderUserAvatar(userWithAvatar)).toBe('<img src="/tru.jpg" />');

    const userNoAvatar = { name: 'Antigravity' };
    expect(renderUserAvatar(userNoAvatar)).toBe('<div class="placeholder">A</div>');

    const anonymous = null;
    expect(renderUserAvatar(anonymous)).toBe('<div class="placeholder">U</div>');
  });

  // 6. Double Negation (!!) ép kiểu Boolean sạch cho JSX Flags
  it('6. Ép kiểu Boolean sạch bằng !! hoặc Boolean() cho conditional rendering', () => {
    const activeFilters = ['tag1', 'tag2'];
    const emptyFilters = [];

    const hasActiveFilters = Boolean(activeFilters.length);
    const hasNoFilters = !!emptyFilters.length;

    expect(hasActiveFilters).toBe(true);
    expect(hasNoFilters).toBe(false);
  });

});
