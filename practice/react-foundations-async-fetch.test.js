import { describe, it, expect } from 'vitest';

/**
 * MODULE 11: JAVASCRIPT NỀN TẢNG CHO REACT
 * BÀI 41: ASYNC/AWAIT, FETCH API & ABORTCONTROLLER TRONG REACT
 */

describe('Bài 41 - Async JS, Fetch API & AbortController for React', () => {

  // 1. Fetch Error Handling: HTTP 404/500 không tự reject Promise
  it('1. Xử lý HTTP status error với response.ok', async () => {
    async function mockFetchUser(userId) {
      // Giả lập fetch response
      const mockResponse = {
        ok: userId === 1,
        status: userId === 1 ? 200 : 404,
        async json() {
          if (userId === 1) return { id: 1, name: 'Tru Le' };
          return { error: 'User not found' };
        }
      };

      if (!mockResponse.ok) {
        throw new Error(`HTTP Error: ${mockResponse.status}`);
      }
      return await mockResponse.json();
    }

    const user = await mockFetchUser(1);
    expect(user.name).toBe('Tru Le');

    await expect(mockFetchUser(999)).rejects.toThrow('HTTP Error: 404');
  });

  // 2. Data Fetching Effect với Boolean Ignore Flag (Chống Race Condition)
  it('2. Chống Race Condition bằng Boolean Ignore Flag trong Effect', async () => {
    const states = [];

    function simulateEffect(query) {
      let ignore = false;

      async function fetchData() {
        const delay = query === 'query-1' ? 50 : 10; // Query 1 chạy chậm hơn Query 2
        await new Promise(r => setTimeout(r, delay));

        if (!ignore) {
          states.push(`Result of ${query}`);
        }
      }

      fetchData();

      // Giả lập cleanup function khi query thay đổi
      return () => {
        ignore = true;
      };
    }

    // Trigger effect với query-1
    const cleanup1 = simulateEffect('query-1');
    // Người dùng gõ tiếp query-2 ngay lập tức -> cleanup1 được gọi
    cleanup1();
    const cleanup2 = simulateEffect('query-2');

    await new Promise(r => setTimeout(r, 60));

    // Chỉ có query-2 được ghi nhận, kết quả trễ của query-1 bị bỏ qua hoàn toàn!
    expect(states).toEqual(['Result of query-2']);
  });

  // 3. AbortController Network Request Cancellation
  it('3. Hủy bỏ Network Request khi component unmount bằng AbortController', async () => {
    async function fetchWithAbort(signal) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          resolve('Data loaded');
        }, 100);

        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          const err = new Error('The operation was aborted');
          err.name = 'AbortError';
          reject(err);
        });
      });
    }

    const controller = new AbortController();
    const fetchPromise = fetchWithAbort(controller.signal);

    // Unmount component sau 20ms
    setTimeout(() => {
      controller.abort();
    }, 20);

    await expect(fetchPromise).rejects.toMatchObject({
      name: 'AbortError'
    });
  });

  // 4. Bỏ qua AbortError trong Catch Block của React Effect
  it('4. Phân biệt AbortError để không set state lỗi khi component unmount', async () => {
    let errorState = null;
    let loadingState = true;

    async function executeEffectWithCatch(simulateAbort = false) {
      try {
        if (simulateAbort) {
          const err = new Error('Abort signal received');
          err.name = 'AbortError';
          throw err;
        }
        throw new Error('Network Connection Failed');
      } catch (err) {
        // Bỏ qua AbortError vì đây là hành vi unmount bình thường, không phải lỗi hệ thống
        if (err.name !== 'AbortError') {
          errorState = err.message;
        }
      } finally {
        if (!simulateAbort) {
          loadingState = false;
        }
      }
    }

    // Trường hợp 1: Abort do unmount
    await executeEffectWithCatch(true);
    expect(errorState).toBeNull(); // Không set lỗi!

    // Trường hợp 2: Lỗi mạng thật
    await executeEffectWithCatch(false);
    expect(errorState).toBe('Network Connection Failed');
    expect(loadingState).toBe(false);
  });

  // 5. Song song hóa Requests trong React bằng Promise.all
  it('5. Tải dữ liệu song song (Parallel Fetching) với Promise.all', async () => {
    async function fetchUserProfile() {
      await new Promise(r => setTimeout(r, 10));
      return { id: 1, name: 'Tru' };
    }

    async function fetchUserPosts() {
      await new Promise(r => setTimeout(r, 15));
      return [{ id: 101, title: 'JS Core' }];
    }

    const [profile, posts] = await Promise.all([
      fetchUserProfile(),
      fetchUserPosts()
    ]);

    expect(profile.name).toBe('Tru');
    expect(posts.length).toBe(1);
  });

  // 6. Async Custom Hook State Machine Simulation
  it('6. Mô phỏng State Machine của useAsync hook (idle -> loading -> success / error)', async () => {
    const history = [];

    async function mockUseAsync(asyncFunction) {
      history.push('loading');
      try {
        const data = await asyncFunction();
        history.push(`success: ${data}`);
        return { data, error: null, loading: false };
      } catch (err) {
        history.push(`error: ${err.message}`);
        return { data: null, error: err, loading: false };
      }
    }

    const result = await mockUseAsync(async () => 'OK');
    expect(result.data).toBe('OK');
    expect(history).toEqual(['loading', 'success: OK']);
  });

});
