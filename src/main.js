// src/main.js
import Chart from 'chart.js/auto'

// 1. 화면 레이아웃 만들기 --------------------------------------------------
const app = document.querySelector('#app')

// 페이지를 가운데로 고정
document.body.style.margin = '0'
document.body.style.background = '#e5edff'
document.body.style.display = 'flex'
document.body.style.justifyContent = 'center'
document.body.style.fontFamily =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

app.innerHTML = `
  <style>
    :root {
      --indigo: #4f46e5;
      --indigo-soft: #eef2ff;
      --slate-900: #0f172a;
      --slate-700: #334155;
      --slate-500: #64748b;
      --green-soft: #ecfdf3;
      --green-border: #bbf7d0;
      --amber-soft: #fffbeb;
      --amber-border: #fed7aa;
      --emerald-soft: #ecfdf5;
      --emerald-border: #6ee7b7;
      --card-radius: 16px;
    }

    .lesson-shell {
      width: min(1100px, 100% - 32px);
      margin: 24px auto 32px;
      padding: 24px 26px 28px;
      border-radius: 24px;
      background:
        radial-gradient(circle at top left, rgba(191, 219, 254, 0.6), transparent 55%),
        radial-gradient(circle at bottom right, rgba(199, 210, 254, 0.6), transparent 55%),
        #f9fafb;
      box-shadow: 0 26px 70px rgba(15, 23, 42, 0.18);
      box-sizing: border-box;
    }

    .lesson-header-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 28px;
      font-weight: 700;
      color: var(--slate-900);
      margin-bottom: 6px;
    }

    .lesson-header-title span.emoji {
      font-size: 26px;
    }

    .lesson-steps {
      margin: 8px 0 0;
      padding-left: 18px;
      color: var(--slate-500);
      font-size: 12.5px;
      line-height: 1.6;
    }

    .lesson-cards {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .lesson-card {
      background: #ffffff;
      border-radius: var(--card-radius);
      border: 1px solid #e5e7eb;
      padding: 14px 16px 16px;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      margin-bottom: 24px;
    }

    .lesson-card--intro {
      background: var(--indigo-soft);
      border-color: #c7d2fe;
    }

    .lesson-card--graph {
      background: #ffffff;
      border-color: #e5e7eb;
    }

    .lesson-card--q1 {
      background: #f9fafb;
      border-color: #e5e7eb;
    }

    .lesson-card--limit {
      background: var(--amber-soft);
      border-color: var(--amber-border);
    }

    .lesson-card--def {
      background: var(--emerald-soft);
      border-color: var(--emerald-border);
    }

    .lesson-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 15px;
      font-weight: 700;
      color: var(--slate-900);
    }

    .lesson-card-header--green { color: #166534; }
    .lesson-card-header--amber { color: #b45309; }
    .lesson-card-header--emerald { color: #047857; }

    .lesson-card p {
      margin: 0 0 6px;
      font-size: 13.5px;
      color: var(--slate-700);
    }

    textarea {
      width: 100%;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      font-size: 13px;
      resize: vertical;
      background: #ffffff;
      box-sizing: border-box;
    }

    .graph-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.7fr) minmax(260px, 1.1fr);
      gap: 14px;
      align-items: flex-start;
      margin-top: 6px;
    }

    .lesson-card--graph .desc{
      margin: 0 0 10px;
      line-height: 1.7;
    }

    .callout{
      margin-top: 8px;
      padding: 10px 12px;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: var(--slate-700);
      font-size: 13px;
      line-height: 1.7;
    }

    .graph-surface{
      border-radius: 14px;
      background: #fff;
    }

    .micro-hint{
      margin-top: 10px;
      font-size: 12px;
      color: #64748b;
    }

    .control-panel--stack{
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .panel-title{
      font-weight: 700;
      color: var(--slate-900);
      font-size: 13px;
    }

    .panel-subtitle{
      margin-top: 2px;
      font-weight: 700;
      font-size: 12px;
      color: #0f172a;
      opacity: .85;
    }

    .inline{
      display:flex;
      align-items:center;
      gap: 8px;
    }

    .between{
      display:flex;
      align-items:center;
      justify-content: space-between;
    }

    .muted{
      font-size: 12px;
      color: #6b7280;
    }

    .hint-list{
      margin: 0;
      padding-left: 18px;
      color: #64748b;
      font-size: 12px;
      line-height: 1.6;
    }

    /* ✅ 빈칸 문장 한 줄(필요 시 줄바꿈) + 버튼/피드백 끝에 고정 */
    .blank-line{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      line-height: 1.9;
    }

    /* 버튼/피드백이 아래로 밀리지 않게 */
    .blank-btn,
    .blank-feedback{
      white-space: nowrap;
    }

    /* 그래프 */
    #graph-area {
      width: 100%;
      max-width: 520px;
      aspect-ratio: 1 / 1;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      background: linear-gradient(to bottom, #ffffff, #f8fafc);
      padding: 10px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    }

    #graph-area::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
        linear-gradient(to top, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none;
    }

    #graph-canvas {
      position: relative;
      z-index: 1;
    }

    /* 조작 패널 */
    .control-panel {
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      box-shadow: 0 1px 0 #f3f4f6 inset;
      font-size: 13px;
      color: var(--slate-700);
    }

    .control-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }

    .control-row label { white-space: nowrap; }

    .control-panel input[type="number"] {
      width: 76px;
      padding: 5px 8px;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      font-size: 13px;
    }

    .control-panel input[type="range"] { width: 100%; }

    /* ✅ 결과 카드: 레이아웃 고정 */
    .result-card{
      margin-top: 6px;
      padding: 12px;
      border-radius: 14px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      min-height: 170px; /* ✅ h=0/아닐 때 튐 방지 */
    }

    /* ✅ (요약 제목 삭제) .result-title는 남겨둬도 되고, 안 써도 됨 */
    .result-title{
      font-size: 12px;
      color: #64748b;
      margin-bottom: 6px;
      font-weight: 700;
    }

    .result-row{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      padding:6px 0;
      border-top:1px dashed #e5e7eb;
      min-height: 34px; /* ✅ 줄 높이 고정 */
    }

    .result-row:first-of-type{ border-top:none; }

    .row-label{
      font-size:12px;
      color:#64748b;
      font-weight:700;
    }

    /* ✅ 평균변화율 줄은 라벨/식 줄바꿈(세로배치) */
    #row-avg{
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 6px;
    }

    #row-avg .row-value{
      width: 100%;
      text-align: left;
      flex-wrap: wrap;
      word-break: break-word;
    }

    .row-value{
      font-size:14px;
      color:#0f172a;
      font-weight:800;
    }

    .row-hint{
      margin-top:8px;
      font-size:12px;
      color:#64748b;
      line-height:1.5;
      min-height: 42px; /* ✅ 문장 길이 달라도 튐 방지 */
    }

    /* ✅ 분수(분자/분모) 표기 */
    .formula-line{
      display:flex;
      align-items:center;
      gap:8px;
      margin-top:6px;
    }
    .frac{
      display:inline-flex;
      flex-direction:column;
      align-items:center;
      line-height:1.1;
      font-weight:800;
      color:#334155;
    }
    .frac .num{
      padding: 0 6px 2px;
      border-bottom: 1.6px solid #334155;
      white-space: nowrap;
    }
    .frac .den{
      padding-top: 2px;
      white-space: nowrap;
    }

    @media (max-width: 880px) {
      .lesson-shell { padding: 18px 16px 22px; }
      .graph-layout { grid-template-columns: 1fr; }
      #graph-area { height: 260px; }
    }

    /* ✅ 빈칸 채우기 UI */
    .blank-wrap { margin-top: 8px; }
    .blank-sentence { font-size: 13.5px; color: var(--slate-700); line-height: 1.8; }

    .blank-slot { display: inline-block; vertical-align: baseline; }
    .blank-input{
      width: 140px;
      padding: 6px 10px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      font-size: 13px;
      outline: none;
      background: #fff;
      box-sizing: border-box;
    }
    .blank-input:focus{ border-color:#818cf8; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }

    .blank-btn{
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      background: #0f172a;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      font-size: 12px;
    }
    .blank-btn:disabled{ opacity: .5; cursor: default; }

    .blank-feedback{ font-size: 12px; font-weight: 700; }
    .blank-feedback.ok{ color:#16a34a; }
    .blank-feedback.no{ color:#ef4444; }

    .blank-hint{
      margin-top: 6px;
      font-size: 12px;
      color:#64748b;
      min-height: 18px;
    }

    .blank-answer{
      display:inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      color: #1e293b;
      font-weight: 800;
    }

    .blank-btn.inline {
      margin-left: 8px;
      padding: 6px 10px;
      font-size: 12px;
      vertical-align: middle;
    }

    .blank-feedback.inline {
      margin-left: 6px;
      vertical-align: middle;
    }

    /* ✅ 접선 기울기 입력(정/오답) */
    .tan-quiz {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tan-quiz .tan-prefix {
      font-weight: 800;
      color: #0f172a;
      font-size: 14px;
      white-space: nowrap;
    }
    .tan-input{
      width: 110px;
      padding: 6px 10px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      font-size: 13px;
      outline: none;
      box-sizing: border-box;
      background: #fff;
    }
    .tan-input:focus{ border-color:#a78bfa; box-shadow: 0 0 0 3px rgba(168,85,247,0.18); }
    .tan-btn{
      padding: 6px 10px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      background: #0f172a;
      color: #fff;
      font-weight: 800;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
    }
    .tan-fb{
      font-size: 12px;
      font-weight: 800;
      white-space: nowrap;
    }
    .tan-fb.ok{ color:#16a34a; }
    .tan-fb.no{ color:#ef4444; }
    .tan-reveal{
      font-size: 12px;
      color: #64748b;
      font-weight: 700;
      white-space: nowrap;
    }

    #row-tan {
  display: none !important;
}

  </style>

  <main class="lesson-shell">
    <header style="margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
      <h1 class="lesson-header-title">
        <span class="emoji">📈</span>
        <span>수학 실험실</span>
      </h1>
    </header>

    <section class="lesson-cards">
      <!-- 도입 질문 -->
      <article class="lesson-card lesson-card--intro">
        <div class="lesson-card-header">
          <span>평균변화율이란?</span>
        </div>

        <div id="q1-chat" style="margin-top:10px;">
          <div id="chat-log" style="
            border: 1px solid #c7d2fe;
            background: #ffffff;
            border-radius: 12px;
            padding: 10px;
            height: 180px;
            overflow-y: auto;
            font-size: 13px;
            line-height: 1.5;
          "></div>

          <div style="display:flex; gap:8px; margin-top:10px;">
            <input
              id="chat-input"
              placeholder="여기에 답을 적어보세요 (예: 전체를 하나의 숫자로 나타내면...)"
              style="
                flex:1;
                padding: 10px 12px;
                border-radius: 10px;
                border: 1px solid #cbd5e1;
                font-size: 13px;
                box-sizing: border-box;
              "
            />
            <button
              id="chat-send"
              style="
                padding: 10px 12px;
                border-radius: 10px;
                border: 1px solid #c7d2fe;
                background: #4f46e5;
                color: white;
                font-weight: 600;
                cursor: pointer;
              "
            >보내기</button>
          </div>
        </div>
      </article>

      <!-- 그래프 탐색 -->
      <article class="lesson-card lesson-card--graph">
        <div class="lesson-card-header">
          <span>그래프에서 평균변화율 탐색하기</span>
        </div>

        <p class="desc">
          점 A, B의 위치에 따라 <b>직선 AB의 기울기</b>가 어떻게 달라지는지 관찰해 보세요.
        </p>

        <div class="callout">
          <b>왜 '직선 AB'를 볼까요?</b>
          직선 AB는 구간 <b>[a, a+h]</b>의 <b>변화</b>를 한 눈에 보여주기 때문입니다.
        </div>

        <div class="graph-layout">
          <!-- 그래프 -->
          <div>
            <div id="graph-area" class="graph-surface">
              <canvas id="graph-canvas"></canvas>
            </div>

            <div class="micro-hint">
              ✅ 팁: 그래프에서 점 B를 <b>클릭</b>해 보세요. (h가 함께 바뀝니다)
            </div>
          </div>

          <!-- 조작 패널 -->
          <aside class="control-panel control-panel--stack">
            <div class="panel-title">점의 위치와 간격</div>

            <div class="control-row">
              <label for="a-input">점 A의 x값 a</label>
              <div class="inline">
                <input id="a-input" type="number" min="-2" max="2" step="1" value="1" />
                <span class="muted">현재 <b id="a-value">1</b></span>
              </div>
            </div>

            <div class="control-row" style="flex-direction:column; align-items:stretch;">
              <div class="between">
                <label>간격 h</label>
                <span class="muted"><b id="h-value">1.00</b></span>
              </div>
              <div class="inline">
                <input id="h-slider" type="range" min="-2" max="2" step="0.1" value="1" />
                <input id="h-input" type="number" min="-2" max="2" step="0.2" value="1.00" />
              </div>
            </div>

            <div class="panel-subtitle">관찰 포인트</div>
            <ul class="hint-list">
              <li>h가 작아질수록 점 B가 점 A에 가까워져요.</li>
              <li>그때 직선 AB의 기울기는 어떻게 변하나요?</li>
            </ul>

            <!-- 결과 카드 -->
            <div id="slope-info" class="result-card">
              <!-- ✅ 요약 제목 삭제 -->

              <!-- ✅ 평균변화율: h ≠ 0일 때만 보여줄 줄 -->
              <div class="result-row" id="row-avg">
                <div class="row-label">평균변화율 (직선 AB의 기울기)</div>
                <div class="row-value">
                  <span id="avg-val"></span>
                  <span id="avg-eq" style="margin-left:6px;"></span>
                </div>
              </div>

              <!-- ✅ 순간변화율: h = 0일 때만 보여줄 줄 -->
              <div class="result-row" id="row-tan">
                <div class="row-label">순간변화율 (접선의 기울기)</div>
                <div class="row-value" id="tan-val">
                  <!-- JS에서 h=0일 때 입력/정오답 UI를 렌더링 -->
                </div>
              </div>

              <!-- 의미 설명(항상 같은 박스, 텍스트만 교체) -->
              <div class="row-hint" id="rate-hint">
                직선 AB는 구간 <b>[a, a+h]</b>의 <b>전체 변화</b>를 하나의 값으로 나타냅니다.<br/>
                그 <b>기울기 m</b>이 이 구간의 <b>평균변화율</b>입니다.
              </div>
            </div>
          </aside>
        </div>
      </article>

      <!-- 평균변화율의 기하적 의미 -->
      <article class="lesson-card lesson-card--q1">
        <div class="lesson-card-header lesson-card-header--green">
          <span>평균변화율의 기하적 의미</span>
        </div>

        <div class="blank-wrap" data-blank="avg">
          <div class="blank-line" id="sent-avg">
            <span>평균변화율은 그래프에서 두 점 A와 B를 이은</span>
            <span class="blank-slot">
              <input id="blank-avg" class="blank-input" type="text" placeholder="빈칸" />
            </span>
            <span>와 같다.</span>

            <button class="blank-btn" id="btn-avg">확인</button>
            <span class="blank-feedback" id="fb-avg"></span>
          </div>

          <div class="blank-hint" id="hint-avg"></div>
        </div>
      </article>

      <!-- 정의 -->
      <article class="lesson-card lesson-card--def">
        <div class="lesson-card-header lesson-card-header--emerald">
          <span>점 A에서의 접선</span>
        </div>
        <p>
          점 A를 고정한 채 <b>h → 0</b>이면, 직선 AB는 점 A에서 <b>어떤 하나의 직선에 한없이 가까워진다.</b><br/><br/>
          이 직선을 <b>점 A에서의 접선</b>이라고 한다.
        </p>
      </article>

      <!-- 순간변화율이란? -->
      <article class="lesson-card lesson-card--limit" style="margin-top:14px;">
        <div class="lesson-card-header lesson-card-header--amber">
          <span>순간변화율이란?</span>
        </div>

        <div class="blank-wrap" data-blank="tan" style="margin-top:10px;">
          <div class="blank-sentence" id="sent-tan" style="display:flex; flex-wrap:wrap; align-items:center; gap:6px; line-height:1.9;">
            <span><b>h → 0</b> 일 때, <b>직선 AB의 기울기</b>는 점 A에서의</span>

            <span class="blank-slot">
              <input id="blank-tan" class="blank-input" type="text" placeholder="빈칸" />
            </span>

            <span>에 한없이 가까워진다.</span>

            <button class="blank-btn inline" id="btn-tan" style="margin-left:6px;">확인</button>
            <span class="blank-feedback inline" id="fb-tan"></span>
          </div>

          <div class="blank-hint" id="hint-tan" style="margin-top:8px;"></div>
        </div>
      </article>

    </section>
  </main>
`

// 2. 슬라이더 값 표시 -----------------------------------------------
const aInput = document.querySelector('#a-input')
const hSlider = document.querySelector('#h-slider')
const hInput = document.querySelector('#h-input')
const aValueSpan = document.querySelector('#a-value')
const hValueSpan = document.querySelector('#h-value')

let isDraggingB = false

// h 값을 공통 규칙에 맞춰 반영하는 헬퍼 (단일 모드: h = 0 허용)
function applyHValue(raw) {
  let hVal = Number(raw)
  if (Number.isNaN(hVal)) return

  // -2 ~ 2 범위 제한
  if (hVal < -2) hVal = -2
  if (hVal > 2) hVal = 2

  // 소수 둘째 자리까지 반올림
  hVal = Math.round(hVal * 100) / 100

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

// 점 A 입력: -2 ~ 2 정수
aInput.addEventListener('input', () => {
  let val = Number(aInput.value)
  if (Number.isNaN(val)) return

  if (val < -2) val = -2
  if (val > 2) val = 2

  val = Math.round(val)

  aInput.value = val.toFixed(0)
  updateSliderLabels()
  updateChart()
})

hSlider.addEventListener('input', () => {
  applyHValue(hSlider.value)
})

hInput.addEventListener('input', () => {
  applyHValue(hInput.value)
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

// y축 글자를 가로로 보이도록 직접 그려주는 플러그인
const axisLabelPlugin = {
  id: 'axisLabelPlugin',
  afterDraw(chart) {
    const { ctx, chartArea, scales } = chart
    if (!chartArea || !scales?.y) return

    ctx.save()
    ctx.fillStyle = '#111827'
    ctx.font =
      '12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    const yMid = (chartArea.top + chartArea.bottom) / 2
    ctx.fillText('y', scales.y.left - 14, yMid)

    ctx.restore()
  },
}

const chart = new Chart(ctx, {
  type: 'scatter',
  data: {
    datasets: [
      {
        label: 'f(x) = x²',
        data: xs.map((x, i) => ({ x, y: ys[i] })),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.08)',
        showLine: true,
        pointRadius: 0,
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
        label: '직선(평균변화율)',
        data: [],
        borderColor: '#f97316',
        backgroundColor: '#f97316',
        showLine: true,
        pointRadius: 0,
        tension: 0,
      },
      {
        label: '접선(순간변화율)',
        data: [],
        borderColor: '#a855f7',
        backgroundColor: '#a855f7',
        borderDash: [6, 4],
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
        title: { display: true, text: 'x' },
        grid: { color: 'rgba(148,163,184,0.25)' },
      },
      y: {
        min: -0.5,
        max: 6.5,
        title: { display: false },
        grid: { color: 'rgba(148,163,184,0.25)' },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 16,
          boxHeight: 8,

          
      // ✅ 직선(평균변화율), 접선(순간변화율) 범례 숨김
      filter: (legendItem) => ![3, 4].includes(legendItem.datasetIndex),
        },
      },
    },
  },
  plugins: [axisLabelPlugin],
})

// 그래프 클릭으로 점 B의 위치를 맞추도록 h 조절 -------------------------
const canvas = document.querySelector('#graph-canvas')

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

// a가 바뀌면 B가 그래프 범위(-2~2) 안에 있도록 h의 min/max를 자동으로 맞춤
function getHBoundsByA(aVal) {
  // xB = a + h 가 [-2, 2] 안에 들어오도록
  const hMin = -2 - aVal
  const hMax = 2 - aVal
  return { hMin, hMax }
}

// 드래그/클릭에서 xB를 0.5 단위로 스냅하고, 범위 제한한 뒤 h로 변환
function setHByTargetXB(targetXB) {
  const aVal = Number(aInput.value)

  // 0.5 단위 스냅
  let snappedXB = Math.round(targetXB * 10) / 10

  // B의 x는 무조건 -2~2 안에
  snappedXB = clamp(snappedXB, -2, 2)

  const { hMin, hMax } = getHBoundsByA(aVal)
  const newH = clamp(snappedXB - aVal, hMin, hMax)

  applyHValue(newH)
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect()
  const xPixel = event.clientX - rect.left
  const xValue = chart.scales.x.getValueForPixel(xPixel)
  setHByTargetXB(xValue)
})

// 그래프에서 점 B 드래그로 h 조절 ----------------------------------------
canvas.addEventListener('mousedown', (event) => {
  const rect = canvas.getBoundingClientRect()
  const xPixel = event.clientX - rect.left
  const yPixel = event.clientY - rect.top

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
  setHByTargetXB(xValue)
})

const endDrag = () => {
  isDraggingB = false
}
canvas.addEventListener('mouseup', endDrag)
canvas.addEventListener('mouseleave', endDrag)

const rowAvg = document.querySelector('#row-avg')
const rowTan = document.querySelector('#row-tan')
const avgVal = document.querySelector('#avg-val')
const avgEq = document.querySelector('#avg-eq')
const tanVal = document.querySelector('#tan-val')
const rateHint = document.querySelector('#rate-hint')

// ✅ 접선의 기울기(정오답)용 상태
let currentTanAnswer = null
let tanQuizBound = false

function renderTanQuiz(answer) {
  // tanVal 영역에 "입력 + 확인 + 피드백 + 정답 공개" 구성
  tanVal.innerHTML = `
    <div class="tan-quiz">
      <span class="tan-prefix">f′(a) =</span>
      <input id="tan-input" class="tan-input" type="text" inputmode="decimal" placeholder="값 입력" />
      <button id="tan-check" class="tan-btn" type="button">확인</button>
      <span id="tan-fb" class="tan-fb"></span>
      <span id="tan-reveal" class="tan-reveal" style="display:none;"></span>
    </div>
  `
  currentTanAnswer = answer
  tanQuizBound = false
  bindTanQuizEvents()
}

function bindTanQuizEvents() {
  if (tanQuizBound) return
  const input = document.querySelector('#tan-input')
  const btn = document.querySelector('#tan-check')
  const fb = document.querySelector('#tan-fb')
  const reveal = document.querySelector('#tan-reveal')
  if (!input || !btn || !fb || !reveal) return

  const checkTan = () => {
    const raw = (input.value ?? '').toString().trim()

    // 쉼표 입력(예: 1,5) 방지/보정
    const normalized = raw.replace(/,/g, '.')
    const userNum = Number(normalized)

    if (Number.isNaN(userNum)) {
      fb.textContent = '숫자로 입력해 주세요 🙂'
      fb.classList.remove('ok')
      fb.classList.add('no')
      reveal.style.display = 'none'
      return
    }

    // ✅ 허용 오차(소수 입력/반올림 고려)
    const tol = 0.01
    const ok = Math.abs(userNum - currentTanAnswer) <= tol

    if (ok) {
      fb.textContent = '정답이에요! ✅'
      fb.classList.remove('no')
      fb.classList.add('ok')

      reveal.textContent = `정답: ${currentTanAnswer.toFixed(3)}`
      reveal.style.display = 'inline-block'

      input.disabled = true
      btn.disabled = true
      return
    }

    fb.textContent = '다시 생각해보세요 🙂'
    fb.classList.remove('ok')
    fb.classList.add('no')
    reveal.style.display = 'none'

    input.focus()
    input.select()
  }

  btn.addEventListener('click', checkTan)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkTan()
  })

  tanQuizBound = true
}

// 4. 슬라이더 값에 맞춰 A, B, 직선 & 평균변화율/접선 업데이트 ------------
function updateChart() {
  const a = Number(aInput.value)
  let h = Number(hSlider.value)

  // ✅ a에 따라 h를 자동으로 제한해서 xB가 -2~2 밖으로 못 나가게
  const { hMin, hMax } = getHBoundsByA(a)
  h = clamp(h, hMin, hMax)

  // 제한된 h를 다시 UI에도 반영(슬라이더/인풋 일치)
  if (Number(hSlider.value) !== h) {
    applyHValue(h)
    return // applyHValue가 updateChart를 다시 부르므로 여기서 종료
  }

  const xA = a
  const yA = f(xA)

  // 점 A
  chart.data.datasets[1].data = [{ x: xA, y: yA }]

  if (Math.abs(h) < 1e-6) {
    // ---------------------------
    // h = 0 (평균변화율 X, 접선 O)
    // ---------------------------
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

    // ✅ h=0이면 순간변화율만 보이게
    rowAvg.style.display = 'none'
    rowTan.style.display = 'flex'

    avgVal.textContent = 'm = (정의되지 않음)'
    if (avgEq) avgEq.textContent = ''

    // ✅ 접선의 기울기 입력 + 정/오답(값은 맞히면 공개)
    renderTanQuiz(mTan)

    // ✅ 멘트 수정(요청 반영)
    rateHint.innerHTML = `
  <b>h = 0이면</b> 두 점 A, B가 아니라 점 A만 남기 때문에 <b>평균변화율은 존재하지 않습니다.</b><br>
  <b>h를 아주 작게 하여 관찰</b>해 보면, 직선 AB의 기울기 값은 어떻게 변하나요?<br>
`
  } else {
    // ---------------------------
    // h ≠ 0 (평균변화율 O, 접선 X)
    // ---------------------------
    const xB = a + h
    const yB = f(xB)

    chart.data.datasets[2].data = [{ x: xB, y: yB }]

    const mSec = (yB - yA) / h

    const sx1 = -2.5
    const sx2 = 2.5
    const sy1 = yA + mSec * (sx1 - xA)
    const sy2 = yA + mSec * (sx2 - xA)

    chart.data.datasets[3].data = [
      { x: sx1, y: sy1 },
      { x: sx2, y: sy2 },
    ]

    // h ≠ 0이면 접선 숨김(그래프만)
    chart.data.datasets[4].data = []

    // ✅ h≠0이면 평균변화율만 보이게
    rowAvg.style.display = 'flex'
    rowTan.style.display = 'none'

    // ✅ m 숫자값은 숨기고 "식 + 대입"까지만
 // ✅ m = 공식 = 숫자대입 = 결과값 까지 한 줄로 표시
avgVal.textContent = '' // (avg-val은 그냥 비워둬도 OK)

if (avgEq) {
  avgEq.innerHTML = `
    <span style="font-weight:800;">m =</span>

    <span class="frac" style="margin-left:6px;">
      <span class="num">f(a+h) − f(a)</span>
      <span class="den">h</span>
    </span>

    <span style="margin-left:10px; font-weight:800;">=</span>

    <span class="frac" style="margin-left:6px;">
      <span class="num">${yB.toFixed(2)} − ${yA.toFixed(2)}</span>
      <span class="den">${h.toFixed(2)}</span>
    </span>

    <span style="margin-left:10px; font-weight:800;">=</span>

    <span style="font-weight:900;">${mSec.toFixed(2)}</span>
  `
}


    // (표시상 숨겨져 있지만 안전하게 초기화)
    tanVal.textContent = `f′(a) = ?`
    currentTanAnswer = null
    tanQuizBound = false

    rateHint.innerHTML =
      '직선 AB는 구간 <b>[a, a+h]</b>의 <b>변화</b>를 하나의 값으로 나타냅니다.<br/>' +
      '그 <b>기울기 m</b>이 이 구간의 <b>평균변화율</b>입니다.'
  }

  chart.update()
}

// 처음 한 번은 현재 슬라이더 값으로 그래프 세팅
updateChart()

// =======================
// (1) Q1: 평균 + 변화율 개념 챗봇
// =======================

const chatLog = document.querySelector('#chat-log')
const chatInput = document.querySelector('#chat-input')
const chatSend = document.querySelector('#chat-send')

// 첫 질문(상황 랜덤 제시)
const scenarioPrompts = [
  '자동차가 10초 동안 이동했어요. 중간중간 속도는 달랐지만, 이 10초 동안을 “하나의 속력”으로 말한다면 어떻게 구할까요?',
  '아침 8시에 온도가 10℃였고, 10시에 18℃가 됐어요. 중간에 들쭉날쭉했더라도, 2시간 동안의 “시간당 평균 온도 변화”는 어떻게 구할까요?',
  '욕조에 물을 5분 동안 채웠어요. 처음엔 빨리 차고 나중엔 천천히 찼더라도, 5분 동안의 “분당 평균 증가량”은 어떻게 구할까요?',
]

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const firstAssistantMessage = pickRandom(scenarioPrompts)

// 화면에 대화 추가하는 함수
function appendChat(role, text) {
  const wrap = document.createElement('div')
  wrap.style.marginBottom = '10px'

  const who = document.createElement('div')
  who.style.fontSize = '12px'
  who.style.opacity = '0.7'
  who.textContent = role === 'assistant' ? '튜터' : '나'

  const bubble = document.createElement('div')
  bubble.style.whiteSpace = 'pre-wrap'
  bubble.style.padding = '8px 10px'
  bubble.style.borderRadius = '10px'
  bubble.style.marginTop = '4px'
  bubble.style.display = 'inline-block'
  bubble.style.maxWidth = '100%'

  if (role === 'assistant') {
    bubble.style.background = '#eef2ff'
    bubble.style.border = '1px solid #c7d2fe'
  } else {
    bubble.style.background = '#f1f5f9'
    bubble.style.border = '1px solid #e2e8f0'
  }

  bubble.textContent = text

  wrap.appendChild(who)
  wrap.appendChild(bubble)
  chatLog.appendChild(wrap)
  chatLog.scrollTop = chatLog.scrollHeight
}

// 시작 메시지 출력
appendChat('assistant', firstAssistantMessage)

// OpenAI 호출(발표용: 프론트에서 직접 호출 — 배포 시 키 노출 가능성 있음)
const systemPrompt = `
너는 고등학생을 위한 수학 튜터다. 주제는 '평균변화율 → 직선의 기울기 → 순간변화율(접선) → 미분계수'이다.

목표:
- 학생이 평균변화율을 '공식 암기'가 아니라 '구간 내 변화를 하나의 값으로 표현하는 개념'으로 이해하도록 돕는다.
- 다양한 상황(이동/온도/물의 양 등)에서 공통 구조가 '전체 변화량 ÷ 전체 기준량(…당)'임을 스스로 말하게 한다.
- 평균변화율을 그래프에서 두 점을 이은 직선의 기울기와 연결한다.
- h가 0에 가까워질수록 '두 점 → 한 점'으로 관점이 바뀌며 접선의 기울기(순간변화율)로 이어지게 한다.

대화 규칙:
- 학생이 무엇을 ÷ 무엇으로 말하더라도 바로 용어 붙이지 말고 확인 질문 1번 더.
- 그 다음 턴에서 학생이 구조를 인정하면 '평균변화율' 용어 소개.
- 공식을 먼저 제시하지 말고 질문으로 유도.
- 답변 2~4문장, 마지막은 질문 1개, 존댓말.
`

let chatHistory = [
  { role: 'system', content: systemPrompt },
  { role: 'assistant', content: firstAssistantMessage },
]

async function askTutor(userText) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    return `좋아요. 그럼 ‘전체 변화량’과 ‘전체 기준량’을 이용하면 어떻게 표현할 수 있을까요? (힌트: … ÷ …)`
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [...chatHistory, { role: 'user', content: userText }],
      temperature: 0.3,
      max_tokens: 250,
    }),
  })

  const data = await res.json()
  const reply = data?.choices?.[0]?.message?.content ?? '응답을 가져오지 못했어요.'
  return reply
}

async function onSend() {
  const text = chatInput.value.trim()
  if (!text) return

  chatInput.value = ''
  appendChat('user', text)
  chatSend.disabled = true
  chatSend.textContent = '...'

  try {
    const reply = await askTutor(text)
    appendChat('assistant', reply)

    chatHistory.push({ role: 'user', content: text })
    chatHistory.push({ role: 'assistant', content: reply })
  } catch (e) {
    appendChat('assistant', '오류가 났어요. 잠시 후 다시 시도해 주세요.')
  } finally {
    chatSend.disabled = false
    chatSend.textContent = '보내기'
  }
}

chatSend.addEventListener('click', onSend)
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') onSend()
})

// =======================
// (2) 빈칸 채우기: 정답이면 문장 완성 / 오답이면 초성 힌트
// =======================

function normalizeAnswer(v) {
  return (v ?? '').toString().trim().replace(/\s+/g, ' ')
}

function setupBlank({
  inputId,
  buttonId,
  feedbackId,
  hintId,
  sentenceId,
  answerMain,
  acceptedAnswers,
  initialHint,
  fullSentenceHTML,
}) {
  const input = document.querySelector(inputId)
  const btn = document.querySelector(buttonId)
  const fb = document.querySelector(feedbackId)
  const hint = document.querySelector(hintId)
  const sent = document.querySelector(sentenceId)

  const accepted = acceptedAnswers.map(normalizeAnswer)

  function check() {
    const user = normalizeAnswer(input.value)
    const isCorrect = accepted.includes(user)

    if (isCorrect) {
      fb.textContent = '정답이에요! ✅'
      fb.classList.remove('no')
      fb.classList.add('ok')
      hint.textContent = ''

      // 문장 완성(입력칸 제거 + 정답 하이라이트)
      sent.innerHTML = fullSentenceHTML

      // 입력/버튼 비활성화(원소가 DOM에서 제거되어도 레퍼런스는 안전)
      input.disabled = true
      btn.disabled = true
      return
    }

    fb.textContent = '다시 생각해보세요 🙂'
    fb.classList.remove('ok')
    fb.classList.add('no')

    // 오답이면 초성 힌트 표시
    hint.textContent = `초성 힌트: ${initialHint}`

    input.focus()
    input.select()
  }

  btn.addEventListener('click', check)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') check()
  })
}

// ②-1 평균변화율 빈칸 (✅ '직선의 기울기'도 정답 처리)
setupBlank({
  inputId: '#blank-avg',
  buttonId: '#btn-avg',
  feedbackId: '#fb-avg',
  hintId: '#hint-avg',
  sentenceId: '#sent-avg',

  // 표시용 정답(문장 완성 시 하이라이트로 보여줄 값)
  answerMain: '직선의 기울기',

  // ✅ 허용 답안들
  acceptedAnswers: [
    '직선의 기울기',
    '직선 기울기',
    '직선의기울기',
    '직선기울기',
    '직선 AB의 기울기',
    '직선AB의 기울기',
  ],

  initialHint: 'ㅈㅅㅇ ㄱㅇㄱ',

  // ✅ 문장 완성(정답 하이라이트)
  fullSentenceHTML:
    `평균변화율은 그래프에서 두 점 A와 B를 이은 <span class="blank-answer">직선의 기울기</span>와 같다.`,
})

// h→0 의미 빈칸
setupBlank({
  inputId: '#blank-tan',
  buttonId: '#btn-tan',
  feedbackId: '#fb-tan',
  hintId: '#hint-tan',
  sentenceId: '#sent-tan',
  answerMain: '접선의 기울기',
  acceptedAnswers: ['접선의 기울기', '접선 기울기'],
  initialHint: 'ㅈㅅㅇ ㄱㅇㄱ',
  fullSentenceHTML:
    `h → 0 일 때, 직선 AB는 점 A에서의 <span class="blank-answer">접선의 기울기</span>에 한없이 가까워진다.`,
})
