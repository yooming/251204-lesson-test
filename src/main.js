// src/main.js

import Chart from 'chart.js/auto'

// 1. 화면 레이아웃 만들기 --------------------------------------------------
const app = document.querySelector('#app')

app.innerHTML = `
  <main style="
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    max-width: 960px;
    margin: 40px auto;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  ">
    <h1 style="font-size: 28px; margin-bottom: 12px;">📈 미분 도입 실험실</h1>
    <p style="margin-bottom: 20px; line-height: 1.6;">
      이 웹앱은 <b>평균변화율 → 순간변화율 → 접선의 기울기</b>를
      눈으로 보면서 이해하는 수업용 실험실입니다.
    </p>

    <section style="display: grid; grid-template-columns: 2fr 1.4fr; gap: 24px;">
      <!-- 왼쪽: 그래프 영역 -->
      <div>
        <h2 style="font-size: 20px; margin-bottom: 8px;">1. 그래프 영역</h2>
        <p style="font-size: 14px; color: #555; margin-bottom: 8px;">
          함수 <b>f(x) = x²</b>와 두 점 A(x), B(x+h)를 보면서 변화율을 관찰합니다.
        </p>
        <div style="margin-bottom: 10px; padding: 10px 12px; border-radius: 10px; background:#f4f4ff; border:1px solid #e0e0ff;">
          <p style="font-size: 13px; margin-bottom: 6px; font-weight: 600; color:#3730a3;">
            Q. 너는 <b>평균변화율</b>이 어떤 뜻이라고 생각해? (지금 알고 있는 대로 편하게 써 보기)
          </p>
          <textarea
            id="intuition-avg-rate"
            rows="2"
            style="width:100%; border-radius:8px; border:1px solid #c7d2fe; padding:6px 8px; font-size:13px; resize: vertical;"
            placeholder="예) x가 a에서 a+h로 조금 바뀔 때, y가 얼마나 같이 바뀌는지 나타내는 값… 같은 느낌?"
          ></textarea>
        </div>
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
        <p id="slope-info" style="margin-top: 8px; font-size: 14px; color:#333;">
          현재 평균변화율 m = ?
        </p>
      </div>

      <!-- 오른쪽: 슬라이더 + 메모 -->
      <div>
        <h2 style="font-size: 20px; margin-bottom: 8px;">2. 조작 & 관찰</h2>

        <!-- 슬라이더 구역 -->
        <div style="margin-bottom: 16px; padding: 12px; border-radius: 12px; background:#fafafa;">
          <p style="margin-bottom: 8px; font-weight: 600;">(1) 점의 위치와 간격 조절</p>

          <label style="display:block; font-size:14px; margin-bottom:4px;">
            점 A의 x값 a :
            <span id="a-value" style="font-weight:600;">1.0</span>
          </label>
          <input
            id="a-slider"
            type="range"
            min="-2"
            max="2"
            step="0.5"
            value="1"
            style="width:100%; margin-bottom: 12px;"
          />

          <label style="display:block; font-size:14px; margin-bottom:4px;">
            간격 h :
            <span id="h-value" style="font-weight:600;">1.0</span>
          </label>
          <div style="display:flex; gap:8px; align-items:center;">
            <input
              id="h-slider"
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value="1"
              style="flex:1;"
            />
            <input
              id="h-input"
              type="number"
              min="-2"
              max="2"
              step="0.1"
              value="1.0"
              style="width:72px; padding:4px 6px; border-radius:6px; border:1px solid #ddd; font-size:13px;"
            />
          </div>
        </div>

        <!-- 관찰 메모 구역 -->
        <div style="padding: 12px; border-radius: 12px; background:#fafafa;">
          <p style="margin-bottom: 8px; font-weight: 600;">(2) 네가 관찰한 것 적어보기</p>
          <p style="font-size: 13px; color:#555; margin-bottom: 8px;">
            예) h를 0에 가깝게 줄이면 두 점을 이은 선이 어떻게 변하는지,<br/>
            기울기가 어떻게 느껴지는지 자유롭게 써 보세요.
          </p>
          <textarea
            id="observation"
            rows="6"
            style="width:100%; border-radius:8px; border:1px solid #ddd; padding:8px; font-size:14px; resize: vertical;"
            placeholder="생각나는 내용을 편하게 적어 보세요."
          ></textarea>
        </div>
      </div>
    </section>
  </main>
`

// 2. 슬라이더 값 표시 연결 -----------------------------------------------
const aSlider = document.querySelector('#a-slider')
const hSlider = document.querySelector('#h-slider')
const hInput = document.querySelector('#h-input')
const aValueSpan = document.querySelector('#a-value')
const hValueSpan = document.querySelector('#h-value')
const slopeInfo = document.querySelector('#slope-info')

function updateSliderLabels() {
  aValueSpan.textContent = Number(aSlider.value).toFixed(1)
  hValueSpan.textContent = Number(hSlider.value).toFixed(1)
  hInput.value = Number(hSlider.value).toFixed(1)
}
updateSliderLabels()

aSlider.addEventListener('input', () => {
  updateSliderLabels()
  updateChart()
})

hSlider.addEventListener('input', () => {
  updateSliderLabels()
  updateChart()
})

// h 숫자 입력과 슬라이더를 서로 연동 ---------------------------------------
hInput.addEventListener('input', () => {
  const raw = Number(hInput.value)
  if (Number.isNaN(raw)) return

  // -2 ~ 2 사이로 제한
  let clamped = raw
  if (clamped < -2) clamped = -2
  if (clamped > 2) clamped = 2

  // 소수 첫째 자리까지로 맞추기
  const rounded = Math.round(clamped * 10) / 10

  hSlider.value = String(rounded)
  updateSliderLabels()
  updateChart()
})

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
      },
      {
        label: '점 A',
        data: [],
        backgroundColor: '#ef4444',
        pointRadius: 5,
      },
      {
        label: '점 B',
        data: [],
        backgroundColor: '#22c55e',
        pointRadius: 5,
      },
      {
        label: '할선(평균변화율)',
        data: [],
        borderColor: '#f97316',
        backgroundColor: '#f97316',
        showLine: true,
        pointRadius: 0,
        tension: 0, // 항상 직선
      },
      {
        label: '접선(순간변화율)',
        data: [],
        borderColor: '#a855f7',
        backgroundColor: '#a855f7',
        borderDash: [6, 4],   // 점선으로 표시
        showLine: true,
        pointRadius: 0,
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
        title: { display: true, text: 'x' }
      },
      y: {
        min: -0.5,
        max: 6.5,
        title: { display: true, text: 'y' }
      }
    },
    plugins: {
      legend: { position: 'bottom' }
    }
  }
})
// 그래프 클릭으로 점 A의 x값(a) 선택하기
const canvas = document.querySelector('#graph-canvas')

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect()
  const xPixel = event.clientX - rect.left

  // 픽셀 → x좌표(수직선)로 변환
  const xValue = chart.scales.x.getValueForPixel(xPixel)

  // 너무 복잡하지 않게 0.5 단위로 반올림
  let snapped = Math.round(xValue * 2) / 2

  // 범위 제한 (-2 ~ 2 사이로)
  if (snapped < -2) snapped = -2
  if (snapped > 2) snapped = 2

  // 슬라이더 값도 같이 바꿔서 동기화
  aSlider.value = snapped
  updateSliderLabels()
  updateChart()
})

// 4. 슬라이더 값에 맞춰 A, B, 할선 & 평균변화율 업데이트 -----------------
function updateChart() {
  const a = Number(aSlider.value)
  const h = Number(hSlider.value)

  const xA = a
  const yA = f(xA)

  // 점 A는 항상 표시
  chart.data.datasets[1].data = [{ x: xA, y: yA }]

  // ----- 1) 할선(평균변화율) & 점 B 처리 + 접선 표시 조건 -----
  if (Math.abs(h) < 1e-6) {
    // h가 0이면, 점 B와 할선은 숨기고 접선만 표시
    chart.data.datasets[2].data = []   // 점 B 없음
    chart.data.datasets[3].data = []   // 할선 없음

    // f(x) = x^2 이므로 f'(a) = 2a
    const mTan = 2 * a

    // 접선은 x축에서 a-1 ~ a+1 정도 구간만 표시 (그래프 범위 안으로 자르기)
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

    // 이때만 접선의 기울기(순간변화율)를 함께 보여준다
    slopeInfo.textContent =
      `h = 0 이라 평균변화율은 정의되지 않지만, 이때 접선의 기울기(순간변화율)는 f'(a) = 2a = ${mTan.toFixed(3)} 입니다.`
  } else {
    const xB = a + h
    const yB = f(xB)

    // 점 B는 점으로 표시
    chart.data.datasets[2].data = [{ x: xB, y: yB }]

    // 평균변화율 m = (f(a+h) - f(a)) / h
    const mSec = (yB - yA) / h

    // 할선도 접선처럼 그래프 전체에 뻗는 "직선"으로 그리기
    // y - yA = mSec (x - xA)
    let sx1 = -2.5
    let sx2 = 2.5
    const sy1 = yA + mSec * (sx1 - xA)
    const sy2 = yA + mSec * (sx2 - xA)

    chart.data.datasets[3].data = [
      { x: sx1, y: sy1 },
      { x: sx2, y: sy2 },
    ]

    // h ≠ 0 인 경우엔 보라색 접선은 숨긴다
    chart.data.datasets[4].data = []

    // h ≠ 0 인 경우에는 평균변화율만 안내 (접선 기울기 값은 숨김)
    slopeInfo.textContent =
      `현재 평균변화율 m = (f(a+h) - f(a)) / h ≈ ${mSec.toFixed(3)}`
  }

  chart.update()
}



// 처음 한 번은 현재 슬라이더 값으로 그래프 세팅
updateChart()
