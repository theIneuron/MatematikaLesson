// ============================================================================
// 8 КЛАСС — ГРАФИКА. Приборы, которые рисуют координатную плоскость.
//
// Контракты — ETALON_8SINF.md §7.2. Главное, что здесь держится:
//
//   1. КРИВАЯ СТРОИТСЯ ИЗ ФУНКЦИИ. Урок передаёт `f`, а не список точек.
//      Список точек в данных урока запрещён: автор нарисует неверный график,
//      и ни одна проверка этого не поймает.
//   2. Оси со стрелками и подписями, деления с числами, начало O. Подписи осей —
//      must-пункт METODIK_PROFIL_MATEMATIKA.md.
//   3. Разрыв рисуется выколотой точкой, и кривая РВЁТСЯ.
//   4. Тап проверяется по математическим координатам с допуском в единицах оси,
//      а НЕ по пикселю: на телефоне урок масштабируется zoom, и пиксель врёт.
//      Отношение (доля клика по ширине) через rect безразмерно и потому безопасно.
//   5. Прибор — контролёр, а не оракул: показывает следствие, ответа не называет.
//
// Что здесь НЕТ: GeoFigure (чертёж с тапом по сторонам) — он про геометрию и
// строится из вершин, ему нужен свой файл.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useMemo, useRef, useState } from 'react'
import { Ask, Frac, L, MATH_FONT, Note, Slot, T, fmt, useInstructionGate, useSfx, useT } from './core.jsx'
import { MathField, useIsPhone } from './math.jsx'

const TXT = {
  tapHere: L("Javobni chizmada belgilang", 'Отметь ответ на чертеже', 'Mark the answer on the plot'),
  yourPoint: L('sizning nuqtangiz', 'твоя точка', 'your point'),
  predictFirst: L("Avval javobni tanlang, keyin tekshiring", 'Сначала выбери ответ, потом проверяй', 'Choose an answer first, then check'),
  checkNow: L("Endi surgichni suring va tekshiring", 'Теперь двигай ползунок и проверь', 'Now move the slider and check'),
  start: L('boshlangan qiymat', 'исходное значение', 'starting value'),
}

// ============================================================
// 1. ГЕОМЕТРИЯ КАДРА
// Ширина 420 постоянна: она совпадает с рабочей зоной урока. Высота приходит
// из урока и по умолчанию 196 — бюджет §11 отводит графику 180–210 пикселей.
// ============================================================
const VB_W = 420
const PAD = { l: 30, r: 16, t: 12, b: 24 }

// Шаг делений считается ОТ ПИКСЕЛЕЙ, а не от диапазона. Восемь делений на
// длинной оси читаются, а на короткой (график высотой 72) слипаются в кашу —
// поймано замером 2026-08-15: подписи оси y налезли друг на друга у нуля.
// `gap` — минимальное расстояние между подписями.
function niceStep(range, px, gap) {
  const count = Math.max(2, Math.floor((px || 320) / (gap || 46)))
  const raw = range / count
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const norm = raw / mag
  const step = norm >= 5 ? 5 : norm >= 2 ? 2 : 1
  return step * mag
}

function makeScale({ from, to, yFrom, yTo, h, equal }) {
  const left = PAD.l
  const right = VB_W - PAD.r
  const top = PAD.t
  const bottom = h - PAD.b
  let y0 = yFrom
  let y1 = yTo
  // Равный масштаб нужен там, где на чертеже есть расстояния, углы или
  // окружность: иначе окружность станет эллипсом.
  if (equal) {
    const perPx = (to - from) / (right - left)
    const half = (perPx * (bottom - top)) / 2
    const mid = (yFrom + yTo) / 2
    y0 = mid - half
    y1 = mid + half
  }
  const px = (x) => left + ((x - from) / (to - from)) * (right - left)
  const py = (y) => bottom - ((y - y0) / (y1 - y0)) * (bottom - top)
  const xOf = (p) => from + ((p - left) / (right - left)) * (to - from)
  const yOf = (p) => y0 + ((bottom - p) / (bottom - top)) * (y1 - y0)
  return {
    px, py, xOf, yOf, left, right, top, bottom,
    from, to, yFrom: y0, yTo: y1,
    // по горизонтали подписи широкие, по вертикали — низкие
    stepX: niceStep(to - from, right - left, 52),
    stepY: niceStep(y1 - y0, bottom - top, 26),
  }
}

// ============================================================
// 2. ПУТЬ КРИВОЙ
// Считается ИЗ функции. Путь рвётся в трёх случаях: значения нет, значение
// ушло за кадр, значение прыгнуло (это разрыв, а не крутой участок).
// Именно поэтому гипербола не соединяется через ноль сама собой.
// ============================================================
function pathsOf(f, sc, steps) {
  const n = steps || 260
  const jump = (sc.yTo - sc.yFrom) * 0.55
  const out = []
  let cur = ''
  let prevY = null
  for (let i = 0; i <= n; i += 1) {
    const x = sc.from + ((sc.to - sc.from) * i) / n
    let y
    try { y = f(x) } catch { y = null }
    const dead = y === null || y === undefined || !isFinite(y)
      || y < sc.yFrom || y > sc.yTo
      || (prevY !== null && Math.abs(y - prevY) > jump)
    if (dead) {
      if (cur) { out.push(cur); cur = '' }
      prevY = (y !== null && isFinite(y)) ? y : null
      continue
    }
    cur += (cur ? 'L' : 'M') + sc.px(x).toFixed(2) + ' ' + sc.py(y).toFixed(2)
    prevY = y
  }
  if (cur) out.push(cur)
  return out
}

function ticksOf(from, to, step) {
  const out = []
  const first = Math.ceil(from / step) * step
  for (let v = first; v <= to + step * 0.001; v += step) {
    // −0 и хвосты вида 0.30000000000000004 убираем округлением к шагу.
    const r = Math.round(v / step) * step
    out.push(Math.abs(r) < step * 0.001 ? 0 : r)
  }
  return out
}

// ============================================================
// 3. КАДР: оси, сетка, деления, кривые, точки
// ============================================================
function Canvas({
  sc, h, fns, holes, points, xLabel, yLabel, grid = true, band, extra, onTap, tappable, still,
}) {
  const ref = useRef(null)
  const ax = Math.min(Math.max(sc.px(0), sc.left), sc.right)
  const ay = Math.min(Math.max(sc.py(0), sc.top), sc.bottom)
  const xt = ticksOf(sc.from, sc.to, sc.stepX)
  const yt = ticksOf(sc.yFrom, sc.yTo, sc.stepY)

  // Координаты клика. Всё считается ОТНОШЕНИЯМИ: на телефоне rect уже умножен
  // zoom-ом, но масштаб кадра и отступы приходят из того же rect и сокращаются.
  // Учитывать поля обязательно: preserveAspectRatio meet вписывает кадр целиком
  // и центрирует его, поэтому слева или сверху остаётся пустая полоса, и деление
  // просто на ширину промахивается тем сильнее, чем уже колонка.
  const tap = (e) => {
    if (!onTap || !tappable) return
    const box = ref.current
    if (!box) return
    const r = box.getBoundingClientRect()
    if (!r.width || !r.height) return
    const s = Math.min(r.width / VB_W, r.height / h)
    if (!s) return
    const vx = (e.clientX - r.left - (r.width - VB_W * s) / 2) / s
    const vy = (e.clientY - r.top - (r.height - h * s) / 2) / s
    onTap({ x: sc.xOf(vx), y: sc.yOf(vy) })
  }

  return (
    <svg
      ref={ref}
      className={'g8-plotc' + (tappable ? ' is-tappable' : '')}
      viewBox={'0 0 ' + VB_W + ' ' + h}
      preserveAspectRatio="xMidYMid meet"
      style={{ height: h }}
      onPointerDown={tap}
      role="img"
    >
      {grid ? (
        <g className="g8-pl-grid">
          {xt.map((v) => <line key={'gx' + v} x1={sc.px(v)} y1={sc.top} x2={sc.px(v)} y2={sc.bottom} />)}
          {yt.map((v) => <line key={'gy' + v} x1={sc.left} y1={sc.py(v)} x2={sc.right} y2={sc.py(v)} />)}
        </g>
      ) : null}

      {band ? (
        <rect
          className="g8-pl-band"
          x={sc.px(Math.max(band.from, sc.from))}
          y={sc.top}
          width={Math.max(0, sc.px(Math.min(band.to, sc.to)) - sc.px(Math.max(band.from, sc.from)))}
          height={sc.bottom - sc.top}
        />
      ) : null}

      {/* оси со стрелками */}
      <g className="g8-pl-ax">
        <line x1={sc.left} y1={ay} x2={sc.right} y2={ay} />
        <line x1={ax} y1={sc.bottom} x2={ax} y2={sc.top} />
        <polygon points={sc.right + ',' + ay + ' ' + (sc.right - 8) + ',' + (ay - 4) + ' ' + (sc.right - 8) + ',' + (ay + 4)} />
        <polygon points={ax + ',' + sc.top + ' ' + (ax - 4) + ',' + (sc.top + 8) + ' ' + (ax + 4) + ',' + (sc.top + 8)} />
      </g>

      <g className="g8-pl-lab" style={{ fontFamily: MATH_FONT }}>
        <text x={sc.right - 4} y={ay - 8} textAnchor="end">{xLabel || 'x'}</text>
        <text x={ax + 9} y={sc.top + 10}>{yLabel || 'y'}</text>
        <text x={ax - 9} y={ay + 13} textAnchor="end">O</text>
      </g>

      <g className="g8-pl-tick" style={{ fontFamily: MATH_FONT }}>
        {xt.map((v) => (v === 0 ? null : (
          <g key={'tx' + v}>
            <line x1={sc.px(v)} y1={ay - 3} x2={sc.px(v)} y2={ay + 3} />
            <text x={sc.px(v)} y={ay + 15} textAnchor="middle">{fmt(v)}</text>
          </g>
        )))}
        {yt.map((v) => (v === 0 ? null : (
          <g key={'ty' + v}>
            <line x1={ax - 3} y1={sc.py(v)} x2={ax + 3} y2={sc.py(v)} />
            <text x={ax - 7} y={sc.py(v) + 4} textAnchor="end">{fmt(v)}</text>
          </g>
        )))}
      </g>

      {/* ЧЕРТЁЖ РИСУЕТСЯ НА ГЛАЗАХ (DINAMIKA_VA_ILLUSTRATSIYA.md §2, долг
          эталона §18 п. 9). `pathLength="1"` нормирует длину, и одна анимация
          работает на ветке любой длины.
          РОДСТВЕННЫЕ КРИВЫЕ НЕ ПОЯВЛЯЮТСЯ ОДНОВРЕМЕННО: задержка растёт с
          номером кривой, вторая начинается после первой. Ветки ОДНОЙ кривой
          (гипербола) рисуются вместе — это один объект, а не две кривые. */}
      {(fns || []).map((item, i) => (
        <g key={'f' + i} className={'g8-pl-line tone-' + (item.tone || 'accent')}>
          {pathsOf(item.f, sc, item.steps).map((d, k) => (
            <path
              key={k}
              d={d}
              pathLength="1"
              className={still ? undefined : 'g8-pl-draw'}
              style={still ? undefined : { animationDelay: (0.15 + i * 0.75) + 's' }}
            />
          ))}
        </g>
      ))}

      {/* выколотая точка: кривая уже разорвана, здесь только метка разрыва */}
      {(holes || []).map((p, i) => (
        <circle key={'h' + i} className="g8-pl-hole" cx={sc.px(p.x)} cy={sc.py(p.y)} r="4.5" />
      ))}

      {(points || []).map((p, i) => (
        <g key={'p' + i} className={'g8-pl-dot tone-' + (p.tone || 'accent')}>
          <circle cx={sc.px(p.x)} cy={sc.py(p.y)} r="5" />
          {p.label ? (
            <text x={sc.px(p.x)} y={sc.py(p.y) - 10} textAnchor="middle" style={{ fontFamily: MATH_FONT }}>{p.label}</text>
          ) : null}
        </g>
      ))}

      {extra || null}
    </svg>
  )
}

// ============================================================
// 4. Plot — просто чертёж. Ученик смотрит, прибор ничего не спрашивает.
// ============================================================
export function Plot({
  f, fns, from = -6, to = 6, yFrom = -6, yTo = 6, h = 196,
  holes, points, xLabel, yLabel, grid, equal, band, caption,
}) {
  const t = useT()
  const sc = useMemo(
    () => makeScale({ from, to, yFrom, yTo, h, equal }),
    [from, to, yFrom, yTo, h, equal],
  )
  const list = fns || (f ? [{ f }] : [])
  return (
    <div className="g8-pl">
      <Canvas sc={sc} h={h} fns={list} holes={holes} points={points}
        xLabel={xLabel} yLabel={yLabel} grid={grid} band={band}/>
      {caption ? <p className="g8-pl-cap">{t(caption)}</p> : null}
    </div>
  )
}

// ============================================================
// 5. PlotTap — ОТВЕТ СТАВИТСЯ НА ЧЕРТЕЖЕ
//
// Проверка по математическим координатам с допуском в единицах оси. Прилипание
// к делению обязательно: без него пальцем не попасть, и прибор начнёт наказывать
// за моторику вместо математики.
//
// Неверная точка ОСТАЁТСЯ на месте и становится амбер — задание не закрывается
// (§12), ученик ставит новую. На каждую известную ловушку свой разбор: он
// указывает на признак и не называет верную координату.
// ============================================================
export function PlotTap({
  f, fns, from = -6, to = 6, yFrom = -6, yTo = 6, h = 196,
  holes, points, xLabel, yLabel, grid, equal,
  ask, target, axis = 'x', tol, snap, wrong, hint,
  onSolved, audio,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [mine, setMine] = useState(null)
  const [solved, setSolved] = useState(false)
  const [note, setNote] = useState(null)
  const [tries, setTries] = useState(0)

  const sc = useMemo(
    () => makeScale({ from, to, yFrom, yTo, h, equal }),
    [from, to, yFrom, yTo, h, equal],
  )
  const stepSnap = snap || sc.stepX / 2
  const eps = tol || sc.stepX / 2

  const onTap = (raw) => {
    if (solved) return
    const gx = Math.round(raw.x / stepSnap) * stepSnap
    const gy = axis === 'xy' ? Math.round(raw.y / stepSnap) * stepSnap : (f ? f(gx) : raw.y)
    const okX = Math.abs(gx - target.x) <= eps
    const okY = axis === 'xy' ? Math.abs(gy - target.y) <= eps : true
    const n = tries + 1
    setTries(n)
    if (okX && okY) {
      setMine({ x: gx, y: gy, tone: 'ok', label: axis === 'xy' ? null : fmt(gx) })
      setSolved(true)
      setNote(null)
      sfx.playCorrect()
      if (onSolved) onSolved({ correct: true, tries: n, value: gx })
      return
    }
    setMine({ x: gx, y: gy, tone: 'tip', label: axis === 'xy' ? null : fmt(gx) })
    // Разбор ищется по ловушке, ближайшей к тому, куда ученик ткнул.
    let said = hint
    let best = Infinity
    ;(wrong || []).forEach((w) => {
      const d = Math.abs(gx - w.at.x) + (axis === 'xy' ? Math.abs(gy - w.at.y) : 0)
      if (d <= (w.eps || eps) && d < best) { best = d; said = w.text }
    })
    setNote(said || null)
    sfx.playWrong()
    if (audio && said) audio.say(t(said))
  }

  const shown = (points || []).concat(mine ? [mine] : [])
  const list = fns || (f ? [{ f }] : [])

  return (
    <>
      <div className="g8-pl">
        <Canvas sc={sc} h={h} fns={list} holes={holes} points={shown}
          xLabel={xLabel} yLabel={yLabel} grid={grid}
          tappable={canAnswer && !solved} onTap={onTap}/>
      </div>
      <Slot mh={50}>
        <Ask>{t(ask || TXT.tapHere)}</Ask>
      </Slot>
      <Slot mh={58}>
        <Note kind={solved ? 'ok' : 'no'}>{note ? t(note) : null}</Note>
      </Slot>
    </>
  )
}

// ============================================================
// 6. ParamPlot — СЛАЙДЕР ПАРАМЕТРА
//
// Порядок жёсткий и в этом весь смысл прибора:
//   1. вопрос и прогноз — слайдер ЗАПЕРТ;
//   2. ученик выбрал — слайдер открылся, идёт проверка;
//   3. условие `checkAt` выполнено — слайдер зафиксирован, на экране осталось
//      доказательство.
// Если дать слайдер сразу, он становится игрушкой: ученик крутит его до того,
// как у него появилось предположение, и проверять оказывается нечего.
//
// Формула перестраивается вместе с графиком, меняющийся коэффициент — акцентом.
// Прибор НЕ подписывает вывод: он показывает следствие, называет его ученик.
// ============================================================
export function ParamPlot({
  build, param, formula, from = -6, to = 6, yFrom = -6, yTo = 6, h = 196,
  xLabel, yLabel, grid, equal, ghost,
  ask, predict, checkAt, after, onSolved, audio,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [p, setP] = useState(param.start)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)
  const [locked, setLocked] = useState(false)

  const sc = useMemo(
    () => makeScale({ from, to, yFrom, yTo, h, equal }),
    [from, to, yFrom, yTo, h, equal],
  )

  const pick = (opt) => {
    if (picked) return
    const src = predict.items.find((i) => i.id === opt.id)
    if (src && src.right) {
      setPicked(opt.id)
      setNote(TXT.checkNow)
      return
    }
    setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
    setNote(src && src.hint ? src.hint : null)
    sfx.playWrong()
    if (audio && src && src.hint) audio.say(t(src.hint))
  }

  const move = (v) => {
    if (locked || !picked) return
    setP(v)
    if (checkAt && checkAt(v)) {
      setLocked(true)
      setNote(after || null)
      sfx.playCorrect()
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: wrong.length + 1, value: v })
    }
  }

  const fns = []
  if (ghost) fns.push({ f: build(param.start), tone: 'ghost' })
  fns.push({ f: build(p), tone: 'accent' })

  const frac = (param.to - param.from) ? (param.start - param.from) / (param.to - param.from) : 0

  return (
    <>
      <div className="g8-pl">
        <Canvas sc={sc} h={h} fns={fns} xLabel={xLabel} yLabel={yLabel} grid={grid} still/>
      </div>

      {formula ? (
        <p className="g8-pl-form" style={{ fontFamily: MATH_FONT }}>
          {formula(p).map((part, i) => (
            <span key={i} className={part.accent ? 'is-live' : ''}>{part.t}</span>
          ))}
        </p>
      ) : null}

      <div className={'g8-pl-slider' + (picked ? '' : ' is-locked') + (locked ? ' is-done' : '')}>
        <span className="g8-pl-pname" style={{ fontFamily: MATH_FONT }}>{param.name}</span>
        <span className="g8-pl-track">
          {/* якорь: видно, откуда ученик стартовал и куда вернуться */}
          <i className="g8-pl-anchor" style={{ left: (frac * 100) + '%' }} title={t(TXT.start)}/>
          <input
            type="range"
            min={param.from}
            max={param.to}
            step={param.step}
            value={p}
            disabled={!picked || locked || !canAnswer}
            aria-label={param.name}
            onChange={(e) => move(Number(e.target.value))}
          />
        </span>
        <span className="g8-pl-pval" style={{ fontFamily: MATH_FONT }}>{fmt(p)}</span>
      </div>

      <Slot mh={50}>
        <Ask>{t(ask)}</Ask>
      </Slot>

      {!picked ? (
        <div className="g8-pl-opts">
          {predict.items.map((i) => (
            <button
              key={i.id}
              type="button"
              className={'g8-opt' + (wrong.indexOf(i.id) !== -1 ? ' g8-opt-tip' : '')}
              disabled={!canAnswer}
              onClick={() => pick(i)}
            >
              {t(i.label)}
            </button>
          ))}
        </div>
      ) : null}

      <Slot mh={48}>
        <Note kind={locked ? 'ok' : 'no'}>{note ? t(note) : null}</Note>
      </Slot>
    </>
  )
}

// ============================================================
// 7. DragPoint — ТОЧКА ЕДЕТ ПО КРИВОЙ
// Точка привязана к графику: по горизонтали её ведёт ученик, по вертикали —
// функция. Возить её по всей плоскости нельзя, иначе теряется то, ради чего
// прибор нужен: y получается ИЗ x, а не ставится отдельно.
// ============================================================
export function DragPoint({
  f, from = -6, to = 6, yFrom = -6, yTo = 6, h = 196,
  xLabel, yLabel, grid, equal, start, snap, caption,
}) {
  const t = useT()
  const sc = useMemo(
    () => makeScale({ from, to, yFrom, yTo, h, equal }),
    [from, to, yFrom, yTo, h, equal],
  )
  const step = snap || sc.stepX / 2
  const [x, setX] = useState(start === undefined ? Math.round((from + to) / 2) : start)
  const y = f(x)

  const onTap = (raw) => {
    const gx = Math.min(Math.max(Math.round(raw.x / step) * step, from), to)
    setX(gx)
  }

  const dot = isFinite(y) && y >= sc.yFrom && y <= sc.yTo
    ? [{ x, y, tone: 'accent' }]
    : []

  return (
    <div className="g8-pl">
      <Canvas sc={sc} h={h} fns={[{ f }]} points={dot} xLabel={xLabel} yLabel={yLabel}
        grid={grid} tappable onTap={onTap}
        extra={dot.length ? (
          <g className="g8-pl-guide">
            <line x1={sc.px(x)} y1={sc.py(y)} x2={sc.px(x)} y2={Math.min(Math.max(sc.py(0), sc.top), sc.bottom)}/>
          </g>
        ) : null}/>
      <p className="g8-pl-read" style={{ fontFamily: MATH_FONT }}>
        {(xLabel || 'x') + ' = ' + fmt(x) + '   ' + (yLabel || 'y') + ' = ' + (isFinite(y) ? fmt(y) : '—')}
      </p>
      {caption ? <p className="g8-pl-cap">{t(caption)}</p> : null}
    </div>
  )
}

// ============================================================
// 9. FourWindows — ЧЕТЫРЕ ОКНА ОДНОЙ ЗАВИСИМОСТИ (эталон §7.3).
//
//   условие словами · формула · таблица · график
//
// Связь между окнами ОДНА — коэффициент k. Ученик заполняет то окно, которое
// просит задание, и в этот же миг пересчитываются остальные три: формула
// получает число, таблица считается, график рисуется. Задание всегда одной
// формы: «дано вот это окно — заполни вот то», в любую сторону.
//
// ПОЧЕМУ ЧЕТЫРЁХ ОКОН НЕ ВИДНО ЦЕЛИКОМ В ПОЛНЫЙ РОСТ. Бюджет экрана 400
// пикселей (§11), и график в полный рост (196) с тремя окнами над ним туда не
// встаёт. Поэтому окна здесь компактные, а график 140-150: он ОДНО из четырёх
// окон, а не содержание экрана. Там, где график и есть содержание, стоит
// `Plot` в полный рост.
//
// Прибор — контролёр: он не подписывает ответ и не показывает k, пока ученик
// его не назвал. До ответа в пустых окнах стоит знак вопроса.
//
// props:
//   k         — верное значение связи;
//   text      — окно «условие», в тексте место числа помечено {k};
//   xs        — какие x стоят в таблице;
//   given     — какое окно ДАНО: 'text' | 'table' | 'plot';
//   holeAt    — при `given: table` значение при этом x спрятано;
//   answer    — что вводит ученик: 'k' | 'y';
//   hints     — разбор по введённому числу, ключ — само число;
//   titles    — подписи четырёх окон.
// ============================================================
export function FourWindows({
  k, text, xs = [1, 2, 3, 4, 6], given = 'table', holeAt, answer = 'k',
  ask, hints, after, titles, unit,
  from = -7, to = 7, yFrom = -7, yTo = 7, h = 104, hPhone = 64,
  onSolved, audio,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  // На телефоне четыре окна идут КОЛОНКОЙ, и график должен быть ниже: иначе
  // четвёрка выходит за рабочую зону 587 (замер 2026-08-20). Высота приходит
  // из прибора, а не из медиазапроса: `meet` ужимает кадр целиком, и потолком
  // в vh чертёж делается не ниже, а мельче.
  const phone = useIsPhone()
  const ph = phone ? hPhone : h
  const [val, setVal] = useState('')
  const [known, setKnown] = useState(false)
  const [note, setNote] = useState(null)
  const [tries, setTries] = useState(0)

  const sc = useMemo(
    () => makeScale({ from, to, yFrom, yTo, h: ph }),
    [from, to, yFrom, yTo, ph],
  )

  // Что видно ДО ответа: только то окно, которое дано. Остальные ждут.
  const showText = known || given === 'text'
  const showTable = known || given === 'table'
  const showPlot = known || given === 'plot'
  const want = answer === 'k' ? k : k / holeAt

  const submit = () => {
    if (known) return
    const n = Number(String(val).replace(',', '.'))
    if (!Number.isFinite(n)) return
    if (Math.abs(n - want) < 1e-9) {
      setKnown(true)
      setNote(after || null)
      sfx.playCorrect()
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: tries + 1 })
      return
    }
    setTries((x) => x + 1)
    const key = fmt(n)
    const hint = (hints && (hints[key] || hints['*'])) || null
    setNote(hint)
    sfx.playWrong()
    if (audio && hint) audio.say(t(hint))
  }

  const head = (id) => (titles && titles[id] ? t(titles[id]) : '')
  const cell = (x) => {
    if (!showTable && !known) return '?'
    if (!known && holeAt !== undefined && Math.abs(x - holeAt) < 1e-9) return '?'
    const y = k / x
    return fmt(Math.round(y * 1000) / 1000)
  }

  return (
    <>
      <div className="g8-fw">
        {/* ОКНО 1. Условие словами. Число появляется, когда его назвали. */}
        <div className={'g8-fw-box' + (given === 'text' ? ' is-given' : '')}>
          <span className="g8-fw-h">{head('text')}</span>
          <span className="g8-fw-text">
            {String(t(text)).replace('{k}', showText ? fmt(k) : '?')}
          </span>
        </div>

        {/* ОКНО 2. Формула. Меняющийся коэффициент выделен акцентом. */}
        <div className="g8-fw-box">
          <span className="g8-fw-h">{head('formula')}</span>
          <span className="g8-fw-form" style={{ fontFamily: MATH_FONT }}>
            {'y = '}
            {/* Дробь в МАЛОМ кегле: в полный рост она поднимала первую строку
                окон до 109 пикселей, а вся четвёрка не влезала в бюджет. */}
            <Frac size="sm" num={<span className="is-live">{known ? fmt(k) : '?'}</span>} den="x" />
            {unit ? <span className="g8-fw-text">{'  ' + t(unit)}</span> : null}
          </span>
        </div>

        {/* ОКНО 3. Таблица. Значения считаются, а не берутся из данных урока. */}
        <div className={'g8-fw-box' + (given === 'table' ? ' is-given' : '')}>
          <span className="g8-fw-h">{head('table')}</span>
          <div className="g8-fw-tab" style={{ fontFamily: MATH_FONT }}>
            <div className="g8-fw-row">
              <span className="g8-fw-cell is-head">x</span>
              {xs.map((x) => <span key={'x' + x} className="g8-fw-cell is-head">{fmt(x)}</span>)}
            </div>
            <div className="g8-fw-row">
              <span className="g8-fw-cell is-head">y</span>
              {xs.map((x) => {
                const v = cell(x)
                return (
                  <span
                    key={'y' + x}
                    className={'g8-fw-cell' + (v === '?' ? ' is-hole' : (known ? ' is-new' : ''))}
                  >
                    {v}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        {/* ОКНО 4. График. Кривая строится ИЗ функции и рисуется на глазах. */}
        <div className={'g8-fw-box is-plot' + (given === 'plot' ? ' is-given' : '')}>
          <span className="g8-fw-h">{head('plot')}</span>
          {showPlot ? (
            <Canvas sc={sc} h={ph} fns={[{ f: (x) => (x === 0 ? null : k / x) }]}
              xLabel="x" yLabel="y" grid/>
          ) : (
            <Canvas sc={sc} h={ph} fns={[]} xLabel="x" yLabel="y" grid/>
          )}
        </div>
      </div>

      {/* Слоты плотные: четыре окна и без того забирают 320 пикселей на
          телефоне, а вопрос здесь короткий по контракту. */}
      <Slot mh={32}>
        <Ask>{t(ask)}</Ask>
      </Slot>

      <Slot mh={44}>
        {!known && canAnswer ? (
          <MathField kind="number" value={val} onChange={setVal} onSubmit={submit} width={78}/>
        ) : null}
      </Slot>

      <Slot mh={44}>
        <Note kind={known ? 'ok' : 'no'}>{note ? t(note) : null}</Note>
      </Slot>
    </>
  )
}

// ============================================================
// 10. HyperFig — ЖИВОЙ ОБЪЕКТ ДЛЯ ЛЕНТЫ КАДРОВ: гипербола собирается.
//
// Один объект, четыре состояния (§8): пустая плоскость, точки таблицы сели,
// ветви прорисовались, ось y отмечена как запрет. Именно так чертёж
// СТРОИТСЯ НА ГЛАЗАХ, а не появляется готовым.
//
// Регистрируется в реестре фигур `tools.jsx` под именем `hyper`, поэтому в
// данных урока стоит строка, а не JSX.
//   data: { k, xs }
// ============================================================
export function HyperFig({ data, phase }) {
  const k = data.k
  const xs = data.xs || [1, 2, 3, 6]
  const h = data.h || 150
  const lim = data.lim || 7
  const sc = useMemo(
    () => makeScale({ from: -lim, to: lim, yFrom: -lim, yTo: lim, h }),
    [lim, h],
  )
  // Точки СИММЕТРИЧНЫ: вторая ветвь получается из первой, как в учебнике
  // (§7, стр. 35, пункт 5). Точки за кадром не рисуются.
  const pts = []
  if (phase >= 1) {
    for (const x of xs) {
      for (const sgn of [1, -1]) {
        const px = sgn * x
        const py = k / px
        if (Math.abs(py) <= lim) pts.push({ x: px, y: py, tone: 'graph' })
      }
    }
  }
  const fns = phase >= 2 ? [{ f: (x) => (x === 0 ? null : k / x) }] : []
  return (
    <div className="g8-pl">
      <Canvas
        sc={sc}
        h={h}
        fns={fns}
        points={pts}
        xLabel="x"
        yLabel="y"
        grid
        extra={phase >= 3 ? (
          <g className="g8-pl-asym">
            <line x1={sc.px(0)} y1={sc.top} x2={sc.px(0)} y2={sc.bottom} />
            <text x={sc.px(0) + 6} y={sc.bottom - 4} style={{ fontFamily: MATH_FONT }}>x &#8800; 0</text>
          </g>
        ) : null}
      />
    </div>
  )
}

// ============================================================
// 8. CSS
// ВНИМАНИЕ: строка шаблонная. Обратная кавычка или обратный слэш внутри неё —
// даже в комментарии — дают белую страницу без объяснения причины.
// ============================================================
export const PLOT_STYLES = `
.g8-pl { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 4px; }
/* Кривая ВЫХОДИТ ИЗ НАЧАЛА, а не появляется готовой. */
.g8-pl-draw { stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: g8-pl-draw 900ms ease-out forwards; }
@keyframes g8-pl-draw { to { stroke-dashoffset: 0; } }

/* ЧЕТЫРЕ ОКНА. На ноутбуке два столбца, на телефоне один: рабочая зона там
   узкая, и таблица с графиком рядом не читаются. */
.g8-fw { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; width: 100%; }
.g8-fw-box { background: ${T.paper}; border-radius: 14px; padding: 7px 10px;
  box-shadow: inset 0 0 0 1px ${T.line}; min-width: 0; display: flex;
  flex-direction: column; gap: 3px; }
.g8-fw-box.is-given { box-shadow: inset 0 0 0 2px rgba(${T.graphRgb},.5);
  background: ${T.graphSoft}; }
/* График СТОИТ РЯДОМ С ТАБЛИЦЕЙ, а не под ней: во второй строке иначе
   остаётся пустая клетка, и четыре окна вырастают на 145 пикселей — на
   ноутбуке это ровно то, чего не хватает до фолда (замер 2026-08-20). */
.g8-fw-box.is-plot { justify-content: center; }
.g8-fw-h { font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: ${T.ink3};
  font-weight: 700; }
.g8-fw-text { font-size: 12.5px; line-height: 1.3; color: ${T.ink2}; }
.g8-fw-form { font-size: 19px; color: ${T.ink}; text-align: center; }
.g8-fw-form .is-live { color: ${T.accent}; font-weight: 600; }
.g8-fw-tab { display: grid; gap: 2px; }
.g8-fw-row { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 2px; align-items: center; }
.g8-fw-cell { text-align: center; font-size: 13.5px; padding: 1px 0; border-radius: 5px;
  background: rgba(${T.graphRgb},.08); color: ${T.ink}; }
.g8-fw-cell.is-head { color: ${T.ink3}; font-style: italic; background: transparent; }
.g8-fw-cell.is-hole { background: rgba(${T.accentRgb},.14); color: ${T.accent}; font-weight: 700; }
.g8-fw-cell.is-new { animation: g8-pl-cell 420ms ease both; }
@keyframes g8-pl-cell { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }

/* Высота графика ОТЗЫВЧИВАЯ. viewBox задаёт запас, а потолок в vh ужимает
   чертёж целиком на тесном экране: на ноутбуке 1366 на 615 рабочая зона
   487 px, и график в полный рост выбивал экран за фолд (замер 2026-08-15).
   ВАЖНО: viewBox держать ПЛОСКИМ. Масштабируются обе стороны сразу
   (preserveAspectRatio meet), поэтому высокий viewBox под низким потолком
   ужимает чертёж и по ширине — график становится уже и мельче, а не выше.
   Потолок здесь — страховка на тесном экране, а не способ задать размер. */
.g8-plotc { width: auto; max-width: 100%; display: block; margin: 0 auto;
  touch-action: manipulation; max-height: min(210px, 34vh); }
.g8-plotc.is-tappable { cursor: crosshair; }

.g8-pl-grid line { stroke: rgba(${T.graphRgb},.16); stroke-width: 1; }
.g8-pl-band { fill: rgba(${T.graphRgb},.14); }
.g8-pl-ax line { stroke: ${T.ink2}; stroke-width: 1.6; }
.g8-pl-ax polygon { fill: ${T.ink2}; }
.g8-pl-lab text { fill: ${T.ink2}; font-size: 13px; font-style: italic; }
.g8-pl-tick line { stroke: ${T.ink3}; stroke-width: 1.2; }
.g8-pl-tick text { fill: ${T.ink3}; font-size: 10.5px; }

.g8-pl-line path { fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.g8-pl-line.tone-accent path { stroke: ${T.accent}; }
.g8-pl-line.tone-graph path  { stroke: ${T.graph}; }
.g8-pl-line.tone-ok path     { stroke: ${T.ok}; }
.g8-pl-line.tone-ghost path  { stroke: ${T.ink4}; stroke-width: 1.8; stroke-dasharray: 5 4; }

.g8-pl-hole { fill: ${T.paper}; stroke: ${T.accent}; stroke-width: 2.2; }
.g8-pl-dot circle { stroke: ${T.paper}; stroke-width: 1.6; }
.g8-pl-dot text { font-size: 12px; }
.g8-pl-dot.tone-accent circle { fill: ${T.accent}; } .g8-pl-dot.tone-accent text { fill: ${T.accent}; }
.g8-pl-dot.tone-ok circle     { fill: ${T.ok}; }     .g8-pl-dot.tone-ok text     { fill: ${T.ok}; }
.g8-pl-dot.tone-tip circle    { fill: ${T.tip}; }    .g8-pl-dot.tone-tip text    { fill: ${T.tip}; }
/* Точки таблицы — цветом слоя проверки: они ДАННЫЕ, а не результат. Без этого
   правила они рисовались чёрным по умолчанию браузера. */
.g8-pl-dot.tone-graph circle  { fill: ${T.graph}; }  .g8-pl-dot.tone-graph text  { fill: ${T.graph}; }
.g8-pl-guide line { stroke: ${T.ink3}; stroke-width: 1.2; stroke-dasharray: 3 3; }
/* Ось y как ЗАПРЕТ: в нуле у графика точки нет, и это видно линией, а не
   словом. Цвет амбер — тот же, которым помечается неверная попытка и таqiq. */
.g8-pl-asym line { stroke: ${T.tip}; stroke-width: 2; stroke-dasharray: 5 4; }
.g8-pl-asym text { fill: ${T.tip}; font-size: 12px; font-weight: 700; }

.g8-pl-cap  { margin: 0; font-size: 12.5px; color: ${T.ink2}; text-align: center; }
.g8-pl-read { margin: 2px 0 0; font-size: 15px; color: ${T.ink}; letter-spacing: .02em; }
.g8-pl-form { margin: 4px 0 0; font-size: 20px; color: ${T.ink}; text-align: center; }
.g8-pl-form .is-live { color: ${T.accent}; font-weight: 600; }

.g8-pl-slider { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 340px;
  margin: 6px auto 0; height: 44px; }
.g8-pl-slider.is-locked { opacity: .45; }
.g8-pl-pname { font-size: 18px; font-style: italic; color: ${T.ink}; width: 18px; text-align: center; }
.g8-pl-pval  { font-size: 18px; color: ${T.accent}; min-width: 42px; text-align: left; }
.g8-pl-track { position: relative; flex: 1; display: flex; align-items: center; height: 44px; }
.g8-pl-track input { width: 100%; height: 44px; margin: 0; background: transparent; -webkit-appearance: none; appearance: none; }
.g8-pl-track input::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: rgba(${T.graphRgb},.28); }
.g8-pl-track input::-moz-range-track { height: 6px; border-radius: 3px; background: rgba(${T.graphRgb},.28); }
.g8-pl-track input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px;
  margin-top: -10px; border-radius: 50%; background: ${T.accent}; border: 3px solid ${T.paper};
  box-shadow: 0 4px 12px -4px rgba(${T.accentRgb},.7); }
.g8-pl-track input::-moz-range-thumb { width: 26px; height: 26px; border-radius: 50%; background: ${T.accent};
  border: 3px solid ${T.paper}; box-shadow: 0 4px 12px -4px rgba(${T.accentRgb},.7); }
.g8-pl-track input:disabled::-webkit-slider-thumb { background: ${T.ink3}; box-shadow: none; }
.g8-pl-track input:disabled::-moz-range-thumb { background: ${T.ink3}; box-shadow: none; }
.g8-pl-slider.is-done .g8-pl-pval { color: ${T.ok}; }
.g8-pl-anchor { position: absolute; top: 8px; width: 2px; height: 10px; margin-left: -1px;
  background: ${T.ink3}; border-radius: 1px; pointer-events: none; }

.g8-pl-opts { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 4px; }

@media (max-width: 640px) {
  /* Телефон: одна колонка. Таблица и график рядом на 390 не читаются.
     Окна плотнее: на 390 четвёрка забирает 320 пикселей из 587, и вместе с
     карточкой способа экран практики выходит за фолд (замер 2026-08-20). */
  /* На 390 условие и формула встают РЯДОМ (они короткие), а таблица и график
     остаются на всю ширину: там читаются цифры и кривая. Одна колонка на все
     четыре окна забирала 320 пикселей из 587, две строки — 220. */
  .g8-fw { grid-template-columns: 1fr 1fr; gap: 5px; }
  .g8-fw-box:nth-child(3), .g8-fw-box:nth-child(4) { grid-column: 1 / -1; }
  .g8-fw-box { padding: 5px 8px; gap: 2px; }
  .g8-fw-text { font-size: 11.5px; line-height: 1.25; }
  .g8-fw-h { font-size: 9px; letter-spacing: .1em; }
  .g8-fw-form { font-size: 17px; }
  .g8-pl-form { font-size: 18px; }
  .g8-pl-read { font-size: 14px; }
  .g8-pl-opts { flex-direction: column; }
  .g8-pl-opts .g8-opt { width: 100%; }
}
`
