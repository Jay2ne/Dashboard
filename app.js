// 오늘 날짜
document.getElementById('today').textContent = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
});

// 색상
const C = {
  purple:     '#6366f1',
  purpleFill: 'rgba(99,102,241,0.15)',
  cyan:       '#22d3ee',
  cyanFill:   'rgba(34,211,238,0.12)',
  green:      '#34d399',
  greenFill:  'rgba(52,211,153,0.15)',
  orange:     '#fb923c',
  orangeFill: 'rgba(251,146,60,0.15)',
  grid:       'rgba(255,255,255,0.06)',
  tick:       '#64748b',
};

Chart.defaults.color = C.tick;
Chart.defaults.borderColor = C.grid;
Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";

// CSV 파서
function parseCSV(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i]);
    return obj;
  });
}

// 숫자 포맷
function fmtMoney(v) {
  if (v >= 1000000) return '₩' + (v / 1000000).toFixed(1) + 'M';
  if (v >= 1000)    return '₩' + (v / 1000).toFixed(1) + 'K';
  return '₩' + v.toFixed(0);
}
function fmtNum(v) {
  return Number(v).toLocaleString('ko-KR');
}

// 데이터 로드 & 렌더
const bust = '?v=' + Date.now();
Promise.all([
  fetch('data/sales_refund.csv' + bust).then(r => r.text()),
  fetch('data/new_dau.csv' + bust).then(r => r.text()),
]).then(([salesText, dauText]) => {
  const sales = parseCSV(salesText);
  const dau   = parseCSV(dauText);
  renderKPI(sales, dau);
  renderRevenueChart(sales);
  renderUserChart(dau);
  renderSalesRefundChart(sales);
  renderRefundRateChart(sales);
});

// ── KPI ───────────────────────────────────────────────
function renderKPI(sales, dau) {
  const totalNet   = sales.reduce((s, r) => s + parseFloat(r.Rev_Net || 0), 0);
  const totalGross = sales.reduce((s, r) => s + parseFloat(r.Total_Rev_gross || 0), 0);
  const totalSales = sales.reduce((s, r) => s + parseInt(r.판매량 || 0), 0);
  const totalRefund= sales.reduce((s, r) => s + parseInt(r.환불 || 0), 0);
  const avgDAU     = dau.reduce((s, r) => s + parseInt(r.DAU || 0), 0) / dau.length;
  const avgRefRate = sales.reduce((s, r) => s + parseFloat(r.환불률 || 0), 0) / sales.length;

  document.getElementById('kpi-revenue').textContent = fmtMoney(totalNet);
  document.getElementById('kpi-revenue-sub').textContent = `Gross ${fmtMoney(totalGross)}`;

  document.getElementById('kpi-sales').textContent = fmtNum(totalSales);
  document.getElementById('kpi-sales-sub').textContent = `환불 ${fmtNum(totalRefund)}건`;

  document.getElementById('kpi-dau').textContent = fmtNum(Math.round(avgDAU));
  document.getElementById('kpi-dau-sub').textContent = `최고 ${fmtNum(Math.max(...dau.map(r => parseInt(r.DAU))))}`;

  document.getElementById('kpi-refund').textContent = avgRefRate.toFixed(1) + '%';
  document.getElementById('kpi-refund-sub').textContent =
    `최고 ${Math.max(...sales.map(r => parseFloat(r.환불률))).toFixed(1)}%`;
}

// ── 일별 매출 추이 ─────────────────────────────────────
function renderRevenueChart(sales) {
  new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: {
      labels: sales.map(r => r.Date),
      datasets: [
        {
          label: 'Gross Revenue',
          data: sales.map(r => parseFloat(r.Total_Rev_gross)),
          borderColor: C.purple,
          backgroundColor: C.purpleFill,
          fill: true, tension: 0.3, pointRadius: 2, pointHoverRadius: 5,
        },
        {
          label: 'Net Revenue',
          data: sales.map(r => parseFloat(r.Rev_Net)),
          borderColor: C.cyan,
          backgroundColor: C.cyanFill,
          fill: true, tension: 0.3, pointRadius: 2, pointHoverRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } } },
      scales: {
        x: { grid: { color: C.grid }, ticks: { maxTicksLimit: 12, maxRotation: 0 } },
        y: { grid: { color: C.grid }, ticks: { callback: v => fmtMoney(v) } }
      }
    }
  });
}

// ── RNU & DAU 추이 ─────────────────────────────────────
function renderUserChart(dau) {
  new Chart(document.getElementById('userChart'), {
    type: 'line',
    data: {
      labels: dau.map(r => r.Date),
      datasets: [
        {
          label: 'DAU',
          data: dau.map(r => parseInt(r.DAU)),
          borderColor: C.green,
          backgroundColor: C.greenFill,
          fill: true, tension: 0.3, pointRadius: 2, pointHoverRadius: 5,
        },
        {
          label: 'RNU (신규)',
          data: dau.map(r => parseInt(r.RNU)),
          borderColor: C.orange,
          backgroundColor: C.orangeFill,
          fill: true, tension: 0.3, pointRadius: 2, pointHoverRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } } },
      scales: {
        x: { grid: { color: C.grid }, ticks: { maxTicksLimit: 12, maxRotation: 0 } },
        y: { grid: { color: C.grid }, ticks: { callback: v => fmtNum(v) } }
      }
    }
  });
}

// ── 판매량 & 환불 바 차트 ──────────────────────────────
function renderSalesRefundChart(sales) {
  new Chart(document.getElementById('salesRefundChart'), {
    type: 'bar',
    data: {
      labels: sales.map(r => r.Date),
      datasets: [
        {
          label: '판매량',
          data: sales.map(r => parseInt(r.판매량)),
          backgroundColor: C.purple,
          borderRadius: 3,
        },
        {
          label: '환불',
          data: sales.map(r => parseInt(r.환불)),
          backgroundColor: 'rgba(248,113,113,0.7)',
          borderRadius: 3,
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } } },
      scales: {
        x: { grid: { color: 'transparent' }, ticks: { maxTicksLimit: 10, maxRotation: 0 } },
        y: { grid: { color: C.grid }, ticks: { callback: v => fmtNum(v) } }
      }
    }
  });
}

// ── 환불률 추이 ────────────────────────────────────────
function renderRefundRateChart(sales) {
  new Chart(document.getElementById('refundRateChart'), {
    type: 'line',
    data: {
      labels: sales.map(r => r.Date),
      datasets: [{
        label: '환불률',
        data: sales.map(r => parseFloat(r.환불률)),
        borderColor: '#f87171',
        backgroundColor: 'rgba(248,113,113,0.12)',
        fill: true, tension: 0.3, pointRadius: 2, pointHoverRadius: 5,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: C.grid }, ticks: { maxTicksLimit: 10, maxRotation: 0 } },
        y: { grid: { color: C.grid }, ticks: { callback: v => v + '%' } }
      }
    }
  });
}
