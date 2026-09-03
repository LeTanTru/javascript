/* ===== lesson-enhance.js — tăng cường UX cho mọi bài: progress bar trên top + progress border home-fab + nút Copy + quiz ===== */
(function () {
  // --- 1) Nút 🏠 nổi cố định (về mục lục) kèm viền tiến độ tròn SVG chuẩn xác ---
  var fab = document.querySelector(".home-fab");
  if (!fab) {
    fab = document.createElement("a");
    fab.className = "home-fab";
    fab.href = "index.html";
    fab.title = "Về mục lục";
    fab.innerHTML =
      '<svg class="home-fab-ring" viewBox="0 0 52 52" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="fab-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#38bdf8"/>' +
            '<stop offset="100%" stop-color="#a78bfa"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<circle class="ring-bg" cx="26" cy="26" r="23"/>' +
        '<circle class="ring-bar" cx="26" cy="26" r="23"/>' +
      '</svg>' +
      '<span class="home-fab-icon">🏠</span>';
    document.body.appendChild(fab);
  } else if (!fab.querySelector(".home-fab-ring")) {
    fab.innerHTML =
      '<svg class="home-fab-ring" viewBox="0 0 52 52" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="fab-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#38bdf8"/>' +
            '<stop offset="100%" stop-color="#a78bfa"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<circle class="ring-bg" cx="26" cy="26" r="23"/>' +
        '<circle class="ring-bar" cx="26" cy="26" r="23"/>' +
      '</svg>' +
      '<span class="home-fab-icon">🏠</span>';
  }

  var ringBar = fab ? fab.querySelector(".ring-bar") : null;
  var circumference = 2 * Math.PI * 23; // ≈ 144.51
  if (ringBar) {
    ringBar.style.strokeDasharray = circumference;
    ringBar.style.strokeDashoffset = circumference;
  }

  // --- 2) Thanh tiến độ đọc cuộn trang trên top (Reading Scroll Progress Bar) ---
  var progressBar = document.querySelector(".reading-progress-bar");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.className = "reading-progress-bar";
    document.body.appendChild(progressBar);
  }

  // Cập nhật tiến độ cuộn cho cả thanh top và viền tròn SVG của home-fab
  var updateProgress = function () {
    var docEl = document.documentElement;
    var body = document.body;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop || 0;
    var scrollHeight = (docEl.scrollHeight || body.scrollHeight) - docEl.clientHeight;
    var percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    var clamped = Math.min(100, Math.max(0, percent));

    if (progressBar) {
      progressBar.style.width = clamped + "%";
    }
    if (ringBar) {
      var offset = circumference - (clamped / 100) * circumference;
      ringBar.style.strokeDashoffset = offset;
    }
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  // --- 3) Chèn nút Copy vào thanh header (.code-label) của mỗi khối code ---
  document.querySelectorAll(".code-block").forEach(function (block) {
    var pre = block.querySelector("pre");
    if (!pre) return;
    // Đảm bảo có thanh header để chứa nút Copy; tạo mới nếu khối thiếu .code-label
    var label = block.querySelector(".code-label");
    if (!label) {
      label = document.createElement("span");
      label.className = "code-label";
      block.insertBefore(label, pre);
    }
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      // Đọc text thuần từ <pre> (nút Copy nằm trong .code-label nên KHÔNG lẫn vào)
      var code = pre.innerText;
      navigator.clipboard.writeText(code).then(function () {
        btn.textContent = "Đã copy ✓";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 1500);
      });
    });
    label.appendChild(btn);
  });

  // --- 2) Chèn nút 🏠 nổi cố định (về mục lục) ---
  if (!document.querySelector(".home-fab")) {
    var fab = document.createElement("a");
    fab.className = "home-fab";
    fab.href = "index.html";
    fab.title = "Về mục lục";
    fab.textContent = "🏠";
    document.body.appendChild(fab);
  }

  // --- 3) Quiz tương tác: feedback tức thì ---
  // Mỗi .opt có data-correct="true|false" và data-explain="giải thích".
  // QUAN TRỌNG: gom .opt theo TỪNG CÂU HỎI (.q), KHÔNG theo cả khối .quiz.
  // Nhờ vậy một khối .quiz chứa được nhiều câu: trả lời câu 1 KHÔNG làm lộ đáp án câu 2, 3, 4.
  // Khối .quiz chỉ có 1 câu vẫn chạy y như cũ (tương thích ngược).
  document.querySelectorAll(".quiz").forEach(function (quiz) {
    var groups = [];
    var current = null;

    // Duyệt .q / .opt / .feedback ĐÚNG THỨ TỰ xuất hiện trong trang:
    // mỗi .q mở một nhóm mới, các .opt đứng sau thuộc về nhóm đó.
    quiz.querySelectorAll(".q, .opt, .feedback").forEach(function (node) {
      if (node.classList.contains("q")) {
        current = { options: [], lastOpt: null, feedback: null };
        groups.push(current);
      } else if (node.classList.contains("opt")) {
        // Phòng trường hợp .opt đứng trước .q đầu tiên (quiz không khai báo .q)
        if (!current) {
          current = { options: [], lastOpt: null, feedback: null };
          groups.push(current);
        }
        current.options.push(node);
        current.lastOpt = node;
      } else if (current && !current.feedback) {
        // .feedback thuộc về nhóm gần nhất phía trên nó
        current.feedback = node;
      }
    });

    groups.forEach(function (group) {
      if (!group.options.length) return;

      // Nhóm chưa có ô .feedback riêng -> tự tạo, chèn ngay dưới đáp án cuối của CHÍNH nhóm đó
      if (!group.feedback) {
        var fb = document.createElement("div");
        fb.className = "feedback";
        group.lastOpt.parentNode.insertBefore(fb, group.lastOpt.nextSibling);
        group.feedback = fb;
      }

      group.options.forEach(function (opt) {
        opt.addEventListener("click", function () {
          var isCorrect = opt.getAttribute("data-correct") === "true";
          // Chỉ khoá & lộ đáp án TRONG nhóm này — các câu khác không bị đụng tới
          group.options.forEach(function (other) {
            other.classList.add("disabled");
            if (other.getAttribute("data-correct") === "true") other.classList.add("correct");
          });
          if (!isCorrect) opt.classList.add("wrong");
          group.feedback.textContent = opt.getAttribute("data-explain") || "";
          group.feedback.classList.add("show", isCorrect ? "good" : "bad");
        });
      });
    });
  });
})();
