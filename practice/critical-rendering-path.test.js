import { describe, it, expect } from 'vitest';

// ─── SIMULATION MODEL: CRITICAL RENDERING PATH ──────────────────────────────

/**
 * 1. Mô phỏng xây dựng Render Tree từ DOM Tree và CSSOM Tree
 * - Loại bỏ các thẻ không hiển thị: <head>, <script>, <style>, <link>
 * - Loại bỏ các nodes có `display: none`
 * - Giữ lại các nodes có `visibility: hidden` hoặc `opacity: 0` (vẫn chiếm vị trí Layout!)
 */
export function buildRenderTree(domNode, computedStyles = new Map()) {
  const nonRenderTags = new Set(['HEAD', 'SCRIPT', 'STYLE', 'LINK', 'META', 'TITLE']);

  if (nonRenderTags.has(domNode.tagName)) {
    return null;
  }

  const style = computedStyles.get(domNode.id) || { display: 'block', visibility: 'visible', opacity: 1 };

  // display: none -> Hoàn toàn bị loại khỏi Render Tree
  if (style.display === 'none') {
    return null;
  }

  const renderNode = {
    id: domNode.id,
    tagName: domNode.tagName,
    text: domNode.text || null,
    style,
    // visibility: hidden vẫn nằm trong Render Tree vì chiếm chỗ trong Layout
    isInLayout: true,
    children: [],
  };

  if (domNode.children) {
    for (const child of domNode.children) {
      const childRenderNode = buildRenderTree(child, computedStyles);
      if (childRenderNode) {
        renderNode.children.push(childRenderNode);
      }
    }
  }

  return renderNode;
}

/**
 * 2. Phân loại tác động của thay đổi thuộc tính CSS (Triggers)
 * - Layout Trigger (Reflow): Thay đổi hình học (width, height, margin, padding, top, font-size...)
 * - Paint Trigger (Repaint): Thay đổi hiển thị điểm ảnh mà không đổi kích thước (color, background, visibility...)
 * - Composite Trigger (GPU): Chỉ thay đổi tầng ghép lớp, không gây Reflow/Repaint (transform, opacity)
 */
export function getRenderingCost(property) {
  const layoutProps = new Set(['width', 'height', 'margin', 'padding', 'border-width', 'top', 'left', 'font-size', 'display']);
  const paintProps = new Set(['color', 'background-color', 'visibility', 'border-color', 'outline', 'box-shadow']);
  const compositeProps = new Set(['transform', 'opacity', 'will-change', 'filter']);

  if (layoutProps.has(property)) return 'Layout -> Paint -> Composite';
  if (paintProps.has(property)) return 'Paint -> Composite';
  if (compositeProps.has(property)) return 'Composite Only';
  return 'Unknown';
}

/**
 * 3. Mô phỏng thứ tự thực thi của Script Tags (Normal vs Defer vs Async)
 */
export function simulateScriptExecution(scripts) {
  // Phân loại và xếp lịch
  const executionOrder = [];
  const deferred = [];

  for (const script of scripts) {
    if (script.type === 'normal') {
      executionOrder.push({ name: script.name, phase: 'HTML_PARSING_BLOCKED' });
    } else if (script.type === 'defer') {
      deferred.push(script);
    } else if (script.type === 'async') {
      // Async chạy ngay khi tải xong (thời gian download nhỏ nhất chạy trước)
      executionOrder.push({ name: script.name, phase: 'IMMEDIATELY_AFTER_DOWNLOAD', downloadTime: script.downloadTime });
    }
  }

  // Defer luôn chạy sau khi HTML Parse xong theo đúng thứ tự xuất hiện trong HTML
  for (const script of deferred) {
    executionOrder.push({ name: script.name, phase: 'AFTER_DOM_PARSED_BEFORE_DCL' });
  }

  return executionOrder;
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Module 07 - Bài 28: Critical Rendering Path (CRP)', () => {
  it('1. Render Tree Construction: Loại bỏ display:none và các thẻ <head>/<script>', () => {
    const dom = {
      tagName: 'HTML',
      id: 'html',
      children: [
        { tagName: 'HEAD', id: 'head', children: [{ tagName: 'TITLE', id: 'title', text: 'Demo' }] },
        {
          tagName: 'BODY',
          id: 'body',
          children: [
            { tagName: 'DIV', id: 'header', text: 'Header' },
            { tagName: 'DIV', id: 'modal', text: 'Hidden Modal' },
            { tagName: 'SCRIPT', id: 'app-js' },
          ],
        },
      ],
    };

    const computedStyles = new Map([
      ['modal', { display: 'none' }],
    ]);

    const renderTree = buildRenderTree(dom, computedStyles);

    expect(renderTree.children.length).toBe(1); // Chỉ có BODY
    const bodyNode = renderTree.children[0];
    expect(bodyNode.tagName).toBe('BODY');

    // Body chỉ chứa header, 'modal' (display:none) và 'app-js' (<script>) đều bị loại bỏ
    const bodyChildrenIds = bodyNode.children.map((c) => c.id);
    expect(bodyChildrenIds).toEqual(['header']);
  });

  it('2. Render Tree: visibility:hidden và opacity:0 VẪN nằm trong Render Tree và Layout', () => {
    const dom = {
      tagName: 'BODY',
      id: 'body',
      children: [
        { tagName: 'DIV', id: 'box1', text: 'Hidden Box' },
        { tagName: 'DIV', id: 'box2', text: 'Transparent Box' },
      ],
    };

    const computedStyles = new Map([
      ['box1', { display: 'block', visibility: 'hidden' }],
      ['box2', { display: 'block', opacity: 0 }],
    ]);

    const renderTree = buildRenderTree(dom, computedStyles);

    // Cả box1 và box2 đều phải có mặt trong Render Tree để tính toán Layout
    expect(renderTree.children.length).toBe(2);
    expect(renderTree.children[0].id).toBe('box1');
    expect(renderTree.children[0].isInLayout).toBe(true);
    expect(renderTree.children[1].id).toBe('box2');
    expect(renderTree.children[1].isInLayout).toBe(true);
  });

  it('3. Rendering Pipeline Triggers: Phân loại chi phí Layout vs Paint vs Composite', () => {
    expect(getRenderingCost('width')).toBe('Layout -> Paint -> Composite');
    expect(getRenderingCost('margin')).toBe('Layout -> Paint -> Composite');

    expect(getRenderingCost('color')).toBe('Paint -> Composite');
    expect(getRenderingCost('background-color')).toBe('Paint -> Composite');

    expect(getRenderingCost('transform')).toBe('Composite Only');
    expect(getRenderingCost('opacity')).toBe('Composite Only');
  });

  it('4. Script Loading: Normal script chặn HTML parser ngay tại vị trí xuất hiện', () => {
    const scripts = [{ name: 'bundle.js', type: 'normal' }];
    const plan = simulateScriptExecution(scripts);

    expect(plan[0].phase).toBe('HTML_PARSING_BLOCKED');
  });

  it('5. Script Loading: Defer tải ngầm song song và thực thi sau khi hoàn tất phân tích DOM', () => {
    const scripts = [
      { name: 'defer-1.js', type: 'defer' },
      { name: 'defer-2.js', type: 'defer' },
    ];
    const plan = simulateScriptExecution(scripts);

    expect(plan[0].phase).toBe('AFTER_DOM_PARSED_BEFORE_DCL');
    expect(plan[1].phase).toBe('AFTER_DOM_PARSED_BEFORE_DCL');
    expect(plan.map((s) => s.name)).toEqual(['defer-1.js', 'defer-2.js']);
  });

  it('6. CSS là Render-Blocking: Trình duyệt không render điểm ảnh cho đến khi CSSOM hoàn thành', () => {
    function canRenderPage(isDomReady, isCssomReady) {
      return isDomReady && isCssomReady;
    }

    expect(canRenderPage(true, false)).toBe(false); // DOM sẵn sàng nhưng CSSOM chưa xong -> chặn render (FOUC prevention)
    expect(canRenderPage(true, true)).toBe(true);   // Cả hai sẵn sàng -> xây dựng Render Tree
  });
});
