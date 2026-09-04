import { describe, it, expect } from 'vitest';

/**
 * MODULE 11: JAVASCRIPT NỀN TẢNG CHO REACT
 * BÀI 39: ES6+ SYNTAX THIẾT YẾU CHO REACT
 */

describe('Bài 39 - ES6+ Syntax Essentials for React', () => {

  // 1. Props Destructuring, Default Values & Renaming
  it('1. Destructuring Props với Default Values và Aliasing', () => {
    function ButtonComponent(props) {
      const {
        title = 'Submit',
        variant: btnVariant = 'primary',
        onClick,
        ...restProps
      } = props;

      return {
        title,
        variant: btnVariant,
        hasClick: typeof onClick === 'function',
        ariaLabel: restProps['aria-label']
      };
    }

    const res1 = ButtonComponent({ onClick: () => {} });
    expect(res1.title).toBe('Submit');
    expect(res1.variant).toBe('primary');
    expect(res1.hasClick).toBe(true);

    const res2 = ButtonComponent({ title: 'Delete', variant: 'danger', 'aria-label': 'delete-btn' });
    expect(res2.title).toBe('Delete');
    expect(res2.variant).toBe('danger');
    expect(res2.ariaLabel).toBe('delete-btn');
  });

  // 2. State Immutability via Spread Operator
  it('2. Cập nhật Nested State bằng Spread Operator mà không mutate object cũ', () => {
    const prevState = {
      user: {
        id: 1,
        profile: { name: 'Tru Le', theme: 'light' }
      },
      loading: false
    };

    // Cách update React đúng chuẩn (tạo shallow copies tại các tầng thay đổi)
    const nextState = {
      ...prevState,
      user: {
        ...prevState.user,
        profile: {
          ...prevState.user.profile,
          theme: 'dark'
        }
      }
    };

    expect(nextState.user.profile.theme).toBe('dark');
    expect(prevState.user.profile.theme).toBe('light'); // Không bị mutate
    expect(nextState.user.profile).not.toBe(prevState.user.profile);
    expect(nextState.user).not.toBe(prevState.user);
    expect(nextState.loading).toBe(prevState.loading); // Primitive giữ nguyên
  });

  // 3. Dynamic Form Handling with Computed Property Names
  it('3. Xử lý form nhiều trường bằng Computed Property Names [name]: value', () => {
    let formState = { username: '', email: '', rememberMe: false };

    function handleChange(e) {
      const { name, value, type, checked } = e.target;
      formState = {
        ...formState,
        [name]: type === 'checkbox' ? checked : value
      };
    }

    handleChange({ target: { name: 'username', value: 'letantru', type: 'text' } });
    expect(formState.username).toBe('letantru');

    handleChange({ target: { name: 'rememberMe', checked: true, type: 'checkbox' } });
    expect(formState.rememberMe).toBe(true);
  });

  // 4. Nullish Coalescing (??) vs Logical OR (||) trong UI Props
  it('4. Nullish Coalescing (??) bảo toàn giá trị falsy hợp lệ (0, false, "")', () => {
    function renderBadgeCount(count) {
      // Bẫy kinh điển: count || 10 sẽ biến 0 thành 10 (SAI)
      // count ?? 10 chỉ fallback khi count là null hoặc undefined (ĐÚNG)
      return {
        wrongCount: count || 10,
        correctCount: count ?? 10
      };
    }

    const testZero = renderBadgeCount(0);
    expect(testZero.wrongCount).toBe(10); // Lỗi bug
    expect(testZero.correctCount).toBe(0); // Chuẩn xác!

    const testUndefined = renderBadgeCount(undefined);
    expect(testUndefined.correctCount).toBe(10);
  });

  // 5. Optional Chaining (?.) với Deep Nested API Response
  it('5. Optional Chaining ngăn ngừa TypeError: Cannot read properties of undefined', () => {
    const apiResponse = {
      data: {
        user: null // Chưa đăng nhập
      }
    };

    const username = apiResponse?.data?.user?.profile?.name ?? 'Guest';
    expect(username).toBe('Guest');

    const hasAvatar = apiResponse?.data?.user?.getAvatar?.() ?? '/default.png';
    expect(hasAvatar).toBe('/default.png');
  });

  // 6. Custom Hook Tuple Destructuring Simulation
  it('6. Array Destructuring mô phỏng useState & useToggle tuple return', () => {
    function createUseStateMock(init) {
      let val = init;
      const setter = (next) => {
        val = typeof next === 'function' ? next(val) : next;
        return val;
      };
      return [() => val, setter];
    }

    const [getCount, setCount] = createUseStateMock(10);
    expect(getCount()).toBe(10);
    setCount(prev => prev + 5);
    expect(getCount()).toBe(15);
  });

});
