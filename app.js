// 오늘 날짜
document.getElementById('today').textContent = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
});

const ACCENT   = '#6366f1';
const ACCENT2  = '#22d3ee';
const GREEN    = '#34d399';
const ORANGE   = '#fb923c';
const PINK     = '#f472b6';
const YELLOW   = '#facc15';
const GRID     = 'rgba(255,255,255,0.06)';
const TICK     = '#64748b';

Chart.defaults.color = TICK;
Chart.defaults.borderColor = GRID;
Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";

// ── 월별 매출 추이 (라인) ──────────────────────────────
new Chart(document.getElementById('lineChart'), {
  type: 'line',
  data: {
    labels: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    datasets: [
      {
        label: '2026년',
        data: [28, 32, 27, 35, 38, 41, 36, 43, 39, 45, 48, 52],
        borderColor: ACCENT,
        backgroundColor: 'rgba(99,102,241,0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: '2025년',
        data: [22, 25, 23, 28, 30, 33, 31, 35, 32, 38, 40, 43],
        borderColor: ACCENT2,
        backgroundColor: 'rgba(34,211,238,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderDash: [5, 4],
      }
    ]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } } },
    scales: {
      y: { grid: { color: GRID }, ticks: { callback: v => '₩' + v + 'M' } },
      x: { grid: { color: GRID } }
    }
  }
});

// ── 카테고리별 매출 (도넛) ────────────────────────────
new Chart(document.getElementById('donutChart'), {
  type: 'doughnut',
  data: {
    labels: ['전자기기', '패션', '식품', '뷰티', '기타'],
    datasets: [{
      data: [35, 25, 18, 14, 8],
      backgroundColor: [ACCENT, ACCENT2, GREEN, ORANGE, PINK],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  },
  options: {
    responsive: true,
    cutout: '68%',
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14 } },
      tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } }
    }
  }
});

// ── 주간 방문자 수 (바) ───────────────────────────────
new Chart(document.getElementById('barChart'), {
  type: 'bar',
  data: {
    labels: ['월','화','수','목','금','토','일'],
    datasets: [
      {
        label: '이번 주',
        data: [1200, 1540, 1320, 1780, 1650, 980, 870],
        backgroundColor: ACCENT,
        borderRadius: 6,
      },
      {
        label: '지난 주',
        data: [1050, 1380, 1100, 1500, 1420, 850, 760],
        backgroundColor: 'rgba(99,102,241,0.3)',
        borderRadius: 6,
      }
    ]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } } },
    scales: {
      y: { grid: { color: GRID }, ticks: { callback: v => v.toLocaleString() } },
      x: { grid: { color: 'transparent' } }
    }
  }
});

// ── 채널별 유입 (수평 바) ─────────────────────────────
new Chart(document.getElementById('horizontalBar'), {
  type: 'bar',
  data: {
    labels: ['자연 검색', 'SNS', '직접 방문', '이메일', '광고'],
    datasets: [{
      data: [42, 28, 15, 9, 6],
      backgroundColor: [ACCENT, ACCENT2, GREEN, YELLOW, ORANGE],
      borderRadius: 6,
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: GRID }, ticks: { callback: v => v + '%' } },
      y: { grid: { color: 'transparent' } }
    }
  }
});
