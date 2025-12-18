// src/main.js

import Chart from 'chart.js/auto'

// 1. 화면 레이아웃 만들기 --------------------------------------------------
const app = document.querySelector('#app')

// 화면 중앙 정렬을 확실히 하기 위해 body에 플렉스 정렬 적용
document.body.style.margin = '0'
document.body.style.display = 'flex'
document.body.style.justifyContent = 'center'
document.body.style.background = '#f8fafc'

app.innerHTML = `
  <main style="
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    width: min(1200px, calc(100% - 24px));
    margin: 16px auto 32px;
    padding: 20px 22px;
    border-radius: 20px;
    box-shadow: 0 14px 36px rgba(15,23,42,0.07);
    background: linear-gradient(to bottom right,#f9fafb,#eef2ff);
    box-sizing: border-box;
  ">
    <header style="margin-bottom: 18px; padding-bottom:8px; border-bottom:1px solid #e5e7eb;">
      <h1 style="font-size: 28px; margin-bottom: 6px; display:flex; align-items:center; gap:8px; color:#0f172a;">
        <span style="font-size:26px;">📈</span>
        <span>미분 도입 실험실</span>
      </h1>
      <p style="margin: 0; line-height: 1.6; color:#374151; font-size:14px;">
        평균변화율이 무엇을 뜻하는지 생각해 보고, 그래프에서 직접 조작하며 순간변화율(접선 기울기)까지 연결하는 활동입니다.
      </p>
      <ul style="margin:10px 0 0; padding-left:18px; color:#4b5563; font-size:12.5px; line-height:1.5;">
        <li>① 도입 질문: 평균변화율을 네 말로 적기</li>
        <li>② 그래프 탐색: A, B 점을 옮기며 평균변화율 관찰</li>
        <li>③ 탐구 질문: 그래프에서 평균변화율이 의미하는 기울기 확인</li>
        <li>④ h→0 탐색: 평균변화율이 접선 기울기에 가까워짐을 보기</li>
        <li>⑤ 정의: 순간변화율 = 미분계수 f'(a) 정리</li>
      </ul>
    </header>

    <section style="display: grid; grid-template-columns: 1.9fr 1.3fr; gap: 20px; align-items:flex-start;">
      <!-- 🔹 왼쪽: 질문 + 그래프 중심 영역 -------------------------------------------------------- -->
      <div>
        <!-- 1단계: 도입 질문 -->
        <div style="
          margin-bottom: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          background:#eef2ff;
          border:1px solid #c7d2fe;
        ">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span style="
              display:inline-flex; align-items:center; justify-content:center;
              width:22px; height:22px; border-radius:999px;
              background:#4f46e5; color:white; font-size:12px; font-weight:700;
            ">1</span>
            <span style="font-weight:700; font-size:14px;">도입 질문 · 평균변화율이란?</span>
          </div>
          <p style="font-size: 13px; margin-bottom: 6px; color:#3730a3;">
            Q1. 너는 <b>평균변화율</b>이 어떤 뜻이라고 생각해? (지금 알고 있는 대로 편하게 써 보기)
          </p>
          <textarea
            id="intuition-avg-rate"
            rows="2"
            style="width:100%; border-radius:8px; border:1px solid #c7d2fe; padding:6px 8px; font-size:13px; resize: vertical; background:white;"
            placeholder="예) x가 a에서 a+h로 조금 바뀔 때, y가 얼마나 같이 바뀌는지 나타내는 값… 같은 느낌?"
          ></textarea>
        </div>

        <!-- 2단계: 그래프로 탐색하기 -->
        <div style="
          margin-bottom: 12px;
          padding: 12px 14px 14px;
          border-radius: 14px;
          background:white;
          border:1px solid #e5e7eb;
        ">
<div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
  <span style="font-weight:700; font-size:14px; color:#0f172a;">그래프로 평균변화율 탐색하기</span>
</div>
          <p style="font-size: 13px; color: #4b5563; margin-bottom: 6px;">
            함수 <b>f(x) = x²</b>와 두 점 A(x), B(x+h)를 보면서, 간격 h에 따라 기울기가 어떻게 바뀌는지 관찰해 보자.
            (그래프를 클릭해서 A의 위치를 직접 정할 수 있어.)
          </p>
          <div style="display:grid; grid-template-columns: 1.6fr 1.1fr; gap:12px; align-items:start;">
            <div>
              <div
                id="graph-area"
                style="
                  height: 320px;
                  border-radius: 12px;
                  border: 1px solid #e2e2e2;
                  background:#ffffff;
                  padding: 8px;
                "
              >
                <canvas id="graph-canvas"></canvas>
              </div>
              <p id="slope-info" style="margin-top: 8px; font-size: 13px; color:#111827;">
                현재 평균변화율 m = ?
              </p>
            </div>

            <!-- 그래프 바로 옆 조작 슬라이더 + 모드 전환 -->
            <div style="
              padding: 10px 12px;
              border-radius: 12px;
              border:1px solid #e5e7eb;
              background:#ffffff;
              box-shadow: 0 1px 0 #f3f4f6 inset;
            ">
              <div style="display:flex; gap:8px; margin-bottom:8px;">
                <button id="mode-avg" style="
                  flex:1; padding:8px 10px; border-radius:8px;
                  border:1px solid #d4d4d8; background:#eef2ff;
                  font-weight:600; color:#312e81; font-size:12px;
                ">
                  단계 2) 평균변화율 탐색 (h ≠ 0)
                </button>
                <button id="mode-limit" style="
                  flex:1; padding:8px 10px; border-radius:8px;
                  border:1px solid #d4d4d8; background:#f8fafc;
                  font-weight:600; color:#0f172a; font-size:12px;
                ">
                  단계 6) h → 0 포함 탐색
                </button>
              </div>
              <p id="mode-desc" style="margin: 0 0 10px; font-size: 12px; color:#4b5563;">
                단계 1: h=0을 찍지 못하게 하고, 평균변화율만 보면서 기울기 의미를 떠올려 보기.
              </p>

              <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px; margin-top:4px;">
                <span style="font-weight:700; font-size:14px; color:#0f172a;">점의 위치와 간격 조절</span>
              </div>

              <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; font-size:13px;">
                <span style="white-space:nowrap;">점 A의 x값 a :</span>
                <input
                  id="a-input"
                  type="number"
                  min="-2"
                  max="2"
                  step="1"
                  value="1"
                  style="width:72px; padding:6px 8px; border-radius:6px; border:1px solid #ddd; font-size:13px;"
                />
                <span style="white-space:nowrap; color:#4b5563;">(현재: <span id="a-value" style="font-weight:600;">1</span>)</span>
              </div>

              <label style="display:block; font-size:13px; margin-bottom:4px;">
                간격 h :
                <span id="h-value" style="font-weight:600;">1.0</span>
              </label>
              <div style="display:flex; gap:8px; align-items:center;">
                <input
                  id="h-slider"
                  type="range"
                  min="-2"
                  max="2"
                  step="0.25"
                  value="1"
                  style="flex:1;"
                />
                <input
                  id="h-input"
                  type="number"
                  min="-2"
                  max="2"
                  step="0.25"
                  value="1.00"
                  style="width:72px; padding:4px 6px; border-radius:6px; border:1px solid #ddd; font-size:13px;"
                />
              </div>
              <p style="margin-top:8px; font-size:11px; color:#6b7280;">
                · 그래프를 직접 클릭해서 A의 위치를 정해도 됩니다.<br/>
                · 단계 2 모드에서는 h=0으로 정확히 맞추지 못하게 막아 둡니다.
              </p>
            </div>
          </div>
        </div>

        <!-- 3단계: 탐구 질문 1 -->
        <div style="
          margin-bottom: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background:#f9fafb;
          border:1px solid #e5e7eb;
        ">
<div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
  <span style="font-weight:700; font-size:14px; color:#14532d;">탐구 질문 1 · 그래프에서 평균변화율의 의미</span>
</div>
          <p style="font-size: 13px; margin-bottom: 6px; color:#14532d;">
            Q2. 그래프에서 평균변화율 m은 <b>무엇의 기울기</b>라고 볼 수 있을까?
          </p>
          <textarea
            id="q-graph-meaning"
            rows="2"
            style="width:100%; border-radius:8px; border:1px solid #bbf7d0; padding:6px 8px; font-size:13px; resize: vertical; background:white;"
            placeholder="예) A와 B를 이은 직선의 기울기인 것 같다…"
          ></textarea>
        </div>

        <!-- 4·5단계: h→0 탐색 + 정의 -->
        <div style="
          padding: 10px 12px;
          border-radius: 12px;
          background:#fefce8;
          border:1px solid #facc15;
        ">
<div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
  <span style="font-weight:700; font-size:14px; color:#854d0e;">h→0일 때 & 미분계수 정의 정리</span>
</div>
          <p style="font-size: 13px; margin-bottom: 4px; color:#713f12;">
            Q3. 간격 h가 0에 가까워질 때, 평균변화율 m의 값(그래프의 기울기)은 어떻게 되는 것 같니?
          </p>
          <textarea
            id="q-limit-meaning"
            rows="2"
            style="width:100%; border-radius:8px; border:1px solid #fed7aa; padding:6px 8px; font-size:13px; resize: vertical; background:white; margin-bottom:6px;"
            placeholder="예) 주황색 할선의 기울기가 보라색 접선의 기울기에 가까워지는 것 같다…"
          ></textarea>
          <p style="font-size: 12px; line-height:1.6; color:#854d0e; margin:0;">
            ★ 정리: <b>한 점 x = a에서의 순간변화율(접선의 기울기)</b>을
            함수의 <b>미분계수 f'(a)</b>라고 부른다.<br/>
            평균변화율이 가진 기울기 값이 <b>h → 0</b>으로 갈 때 가까워지는 그 극한값이 바로 미분계수이다.
          </p>
        </div>
      </div>

      <!-- 🔹 오른쪽: 관찰 영역 ------------------------------------------------------------ -->
      <div>
      </div>
    </section>
  </main>
`

// 2. 슬라이더 값 표시 + 모드 전환 -----------------------------------------------
const aInput = document.querySelector('#a-input')
const hSlider = document.querySelector('#h-slider')
const hInput = document.querySelector('#h-input')
const aValueSpan = document.querySelector('#a-value')
const hValueSpan = document.querySelector('#h-value')
const slopeInfo = document.querySelector('#slope-info')
const modeAvgBtn = document.querySelector('#mode-avg')
const modeLimitBtn = document.querySelector('#mode-limit')
const modeDesc = document.querySelector('#mode-desc')

let mode = 'avg' // 'avg' = h=0 금지 단계, 'limit' = h→0 허용 단계
let isDraggingB = false

// h 값을 공통 규칙에 맞춰 반영하는 헬퍼
function applyHValue(raw, { snapZero = true } = {}) {
  let hVal = Number(raw)
  if (Number.isNaN(hVal)) return

  // -2 ~ 2 범위 제한
  if (hVal < -2) hVal = -2
  if (hVal > 2) hVal = 2

  // 소수 둘째 자리까지 반올림
  hVal = Math.round(hVal * 100) / 100

  // 단계 2(avg)에서는 h=0 피하기
  if (snapZero && mode === 'avg' && Math.abs(hVal) < 0.05) {
    hVal = 0.1
  }

  hSlider.value = hVal.toFixed(2)
  hInput.value = hVal.toFixed(2)
  updateSliderLabels()
  updateChart()
}

function updateSliderLabels() {
  aValueSpan.textContent = Number(aInput.value).toFixed(0)
  const hVal = Number(hSlider.value)
  hValueSpan.textContent = hVal.toFixed(2)
  hInput.value = hVal.toFixed(2)
}
updateSliderLabels()

// A 숫자 입력: 정수만 허용 (-2~2), 반올림 후 반영
aInput.addEventListener('input', () => {
  let val = Number(aInput.value)
  if (Number.isNaN(val)) return

  // -2 ~ 2 범위 제한
  if (val < -2) val = -2
  if (val > 2) val = 2

  // 정수로 반올림
  val = Math.round(val)

  aInput.value = val.toFixed(0)
  updateSliderLabels()
  updateChart()
})

hSlider.addEventListener('input', () => {
  applyHValue(hSlider.value, { snapZero: true })
})

// h 숫자 입력과 슬라이더를 서로 연동 ---------------------------------------
hInput.addEventListener('input', () => {
  applyHValue(hInput.value, { snapZero: true })
})

// 단계 전환 버튼 -----------------------------------------------------------
function setMode(nextMode) {
  mode = nextMode
  if (mode === 'avg') {
    modeDesc.textContent =
      '단계 2: h=0을 찍지 못하게 하고, 평균변화율만 보면서 기울기 의미를 떠올려 보기.'
    modeAvgBtn.style.background = '#eef2ff'
    modeAvgBtn.style.color = '#312e81'
    modeLimitBtn.style.background = '#f8fafc'
    modeLimitBtn.style.color = '#0f172a'

    applyHValue(hSlider.value, { snapZero: true })
  } else {
    modeDesc.textContent =
      '단계 6: h를 0으로도 설정해 보며, 평균변화율이 순간변화율(접선 기울기)에 수렴하는 것을 확인하기.'
    modeLimitBtn.style.background = '#eef2ff'
    modeLimitBtn.style.color = '#312e81'
    modeAvgBtn.style.background = '#f8fafc'
    modeAvgBtn.style.color = '#0f172a'
  }
  updateSliderLabels()
  updateChart()
}

modeAvgBtn.addEventListener('click', () => setMode('avg'))
modeLimitBtn.addEventListener('click', () => setMode('limit'))

// 3. f(x) = x^2 함수와 그래프 초기화 -----------------------------------
function f(x) {
  return x * x
}

function generateFunctionData() {
  const xs = []
  const ys = []
  for (let x = -2.5; x <= 2.5; x += 0.1) {
    xs.push(x)
    ys.push(f(x))
  }
  return { xs, ys }
}

const { xs, ys } = generateFunctionData()

const ctx = document.querySelector('#graph-canvas').getContext('2d')

// y축 글자를 가로로 보이도록 직접 그려주는 플러그인
const axisLabelPlugin = {
  id: 'axisLabelPlugin',
  afterDraw(chart) {
    const { ctx, chartArea, scales } = chart
    if (!chartArea || !scales?.y) return

    ctx.save()
    ctx.fillStyle = '#111827'
    ctx.font = '12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    // y 라벨을 세로 가운데, y축 왼쪽에 수평으로 배치
    const yMid = (chartArea.top + chartArea.bottom) / 2
    ctx.fillText('y', scales.y.left - 14, yMid)

    ctx.restore()
  }
}

const chart = new Chart(ctx, {
  type: 'scatter',
  data: {
    datasets: [
      {
        label: 'f(x) = x²',
        data: xs.map((x, i) => ({ x, y: ys[i] })),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        showLine: true,
        pointRadius: 0,
        pointStyle: 'line',
      },
      {
        label: '점 A',
        data: [],
        backgroundColor: '#ef4444',
        pointRadius: 5,
        pointStyle: 'circle',
      },
      {
        label: '점 B',
        data: [],
        backgroundColor: '#22c55e',
        pointRadius: 5,
        pointStyle: 'circle',
      },
      {
        label: '할선(평균변화율)',
        data: [],
        borderColor: '#f97316',
        backgroundColor: '#f97316',
        showLine: true,
        pointRadius: 0,
        tension: 0,
        pointStyle: 'line',
      },
      {
        label: '접선(순간변화율)',
        data: [],
        borderColor: '#a855f7',
        backgroundColor: '#a855f7',
        borderDash: [6, 4],
        showLine: true,
        pointRadius: 0,
        pointStyle: 'line',
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: -2.5,
        max: 2.5,
        title: { display: true, text: 'x' },
      },
      y: {
        min: -0.5,
        max: 6.5,
        title: { display: false },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 16,
          boxHeight: 8,
        },
      },
    },
  },
  plugins: [axisLabelPlugin],
})

// 그래프 클릭으로 점 A의 x값(a) 선택하기 ------------------------------
const canvas = document.querySelector('#graph-canvas')

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect()
  const xPixel = event.clientX - rect.left
  const xValue = chart.scales.x.getValueForPixel(xPixel)

  // 그래프 클릭 시: 현재 a를 기준으로 h를 바꿔서 B의 x좌표가 클릭 위치가 되도록
  const aVal = Number(aInput.value)
  let snapped = Math.round(xValue * 2) / 2 // 0.5 단위 스냅
  if (snapped < -2) snapped = -2
  if (snapped > 2) snapped = 2

  const newH = snapped - aVal
  applyHValue(newH, { snapZero: true })
})

// 그래프에서 점 B 드래그로 h 조절 ------------------------------------------------
canvas.addEventListener('mousedown', (event) => {
  const { x, y } = event
  const rect = canvas.getBoundingClientRect()
  const xPixel = x - rect.left
  const yPixel = y - rect.top

  const aVal = Number(aInput.value)
  const hVal = Number(hSlider.value)
  const xB = aVal + hVal
  const yB = f(xB)

  const px = chart.scales.x.getPixelForValue(xB)
  const py = chart.scales.y.getPixelForValue(yB)

  const dist = Math.hypot(px - xPixel, py - yPixel)
  if (dist <= 10) {
    isDraggingB = true
    event.preventDefault()
  }
})

canvas.addEventListener('mousemove', (event) => {
  if (!isDraggingB) return
  const rect = canvas.getBoundingClientRect()
  const xPixel = event.clientX - rect.left
  const xValue = chart.scales.x.getValueForPixel(xPixel)

  const aVal = Number(aInput.value)
  const newH = xValue - aVal
  applyHValue(newH, { snapZero: true })
})

const endDrag = () => {
  if (isDraggingB) isDraggingB = false
}

canvas.addEventListener('mouseup', endDrag)
canvas.addEventListener('mouseleave', endDrag)

// 4. 슬라이더 값에 맞춰 A, B, 할선 & 평균변화율/접선 업데이트 ------------
function updateChart() {
  const a = Number(aInput.value)
  let h = Number(hSlider.value)

  const xA = a
  const yA = f(xA)

  // 점 A
  chart.data.datasets[1].data = [{ x: xA, y: yA }]

  // 단계 2(avg)에서는 h=0을 허용하지 않음
  if (mode === 'avg' && Math.abs(h) < 1e-6) {
    h = 0.1
    hSlider.value = h.toFixed(2)
    updateSliderLabels()
  }

  if (Math.abs(h) < 1e-6) {
    // h = 0 → 점 B와 할선 숨기고, 접선만 표시
    chart.data.datasets[2].data = []
    chart.data.datasets[3].data = []

    const mTan = 2 * a

    let x1 = a - 1
    let x2 = a + 1
    if (x1 < -2.5) x1 = -2.5
    if (x2 > 2.5) x2 = 2.5

    const y1 = yA + mTan * (x1 - xA)
    const y2 = yA + mTan * (x2 - xA)

    chart.data.datasets[4].data = [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ]

    slopeInfo.textContent =
      `h = 0 이라 평균변화율은 정의되지 않지만, 이때 접선의 기울기(순간변화율)는 f'(a) = 2a = ${mTan.toFixed(3)} 입니다.`
  } else {
    const xB = a + h
    const yB = f(xB)

    chart.data.datasets[2].data = [{ x: xB, y: yB }]

    const mSec = (yB - yA) / h

    let sx1 = -2.5
    let sx2 = 2.5
    const sy1 = yA + mSec * (sx1 - xA)
    const sy2 = yA + mSec * (sx2 - xA)

    chart.data.datasets[3].data = [
      { x: sx1, y: sy1 },
      { x: sx2, y: sy2 },
    ]

    // h ≠ 0이면 접선은 숨김
    chart.data.datasets[4].data = []

    slopeInfo.innerHTML = `
      <span style="display:inline-flex; align-items:center; gap:6px; flex-wrap:wrap; font-size:13px; color:#111827;">
        <span style="font-weight:600; color:#0f172a;">현재 평균변화율 m</span>
        <span>=</span>
        <span style="display:inline-block; text-align:center; line-height:1.3;">
          <span style="display:block; padding:2px 4px; border-bottom:1px solid #111827;">
            f(a+h) - f(a)
          </span>
          <span style="display:block; padding:2px 4px; font-size:12px; color:#111827;">
            h
          </span>
        </span>
        <span>=</span>
        <span style="font-weight:600; color:#0f172a;">${mSec.toFixed(3)}</span>
      </span>
    `
  }

  chart.update()
}

// 처음 한 번은 현재 슬라이더 값으로 그래프 세팅
updateChart()
