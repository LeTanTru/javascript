import { describe, it, expect } from 'vitest';

/**
 * MODULE 10: TỔNG ÔN & MOCK INTERVIEW THỰC CHIẾN
 * BÀI 38: PHƯƠNG PHÁP TRẢ LỜI PHỎNG VẤN TOP-DOWN, STAR & TRADE-OFF MATRIX
 */

// 1. Top-Down Response Formatter
export function formatTopDownResponse({ conclusion, coreReasons, details }) {
  if (!conclusion || !coreReasons?.length) {
    throw new Error('Top-Down requires a clear upfront conclusion and core pillars.');
  }
  return {
    tldr: conclusion,
    pillars: coreReasons,
    deepDive: details || []
  };
}

// 2. STAR Story Builder
export function buildSTARIncident({ situation, task, action, result, metrics }) {
  return {
    summary: `[${situation}] -> [${task}]`,
    execution: action,
    impact: result,
    quantifiedMetrics: metrics
  };
}

// 3. Technical Trade-off Evaluator
export function evaluateTradeOffs(solutionA, solutionB, weights = { performance: 0.4, maintainability: 0.3, memory: 0.3 }) {
  const scoreA = solutionA.performance * weights.performance +
                 solutionA.maintainability * weights.maintainability +
                 solutionA.memory * weights.memory;

  const scoreB = solutionB.performance * weights.performance +
                 solutionB.maintainability * weights.maintainability +
                 solutionB.memory * weights.memory;

  return {
    winner: scoreA >= scoreB ? solutionA.name : solutionB.name,
    scoreA: Number(scoreA.toFixed(2)),
    scoreB: Number(scoreB.toFixed(2))
  };
}

describe('Bài 38 - Technical Interview Communication & STAR Methodology', () => {

  it('1. formatTopDownResponse định hình câu trả lời theo chuẩn Conclusion First', () => {
    const response = formatTopDownResponse({
      conclusion: 'ESM ưu việt hơn CommonJS nhờ phân tích tĩnh tại compile-time và Live Bindings.',
      coreReasons: [
        '1. Hỗ trợ Tree-shaking loại bỏ dead code',
        '2. Live Bindings phản ánh trạng thái động',
        '3. Hỗ trợ chuẩn Top-level await'
      ],
      details: ['Rollup/Vite dựa vào static structure để tạo bundle siêu nhẹ.']
    });

    expect(response.tldr).toContain('ESM ưu việt hơn CommonJS');
    expect(response.pillars.length).toBe(3);
  });

  it('2. buildSTARIncident định lượng hóa thành tích kỹ thuật bằng số liệu thực tế', () => {
    const incident = buildSTARIncident({
      situation: 'Trang Checkout bị sập do Memory Leak khi người dùng thêm 100+ items vào giỏ hàng.',
      task: 'Xác định nguyên nhân và đưa mức tiêu thụ RAM về dưới 50MB.',
      action: 'Dùng Chrome Memory Profiler phát hiện Detached DOM Nodes và chuyển cache sang WeakMap.',
      result: 'Triệt tiêu hoàn toàn rò rỉ bộ nhớ.',
      metrics: {
        memorySaved: '180MB',
        fcpImprovement: '45%'
      }
    });

    expect(incident.quantifiedMetrics.memorySaved).toBe('180MB');
    expect(incident.impact).toBe('Triệt tiêu hoàn toàn rò rỉ bộ nhớ.');
  });

  it('3. evaluateTradeOffs tính toán điểm số giải pháp dựa trên ma trận hiệu năng vs tài nguyên', () => {
    const solA = { name: 'Virtual DOM Diffing', performance: 8, maintainability: 9, memory: 6 };
    const solB = { name: 'Fine-grained Signals', performance: 10, maintainability: 8, memory: 9 };

    const evaluation = evaluateTradeOffs(solA, solB);
    expect(evaluation.winner).toBe('Fine-grained Signals');
    expect(evaluation.scoreB).toBeGreaterThan(evaluation.scoreA);
  });

});
