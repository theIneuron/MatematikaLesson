// ============================================================================
// 8 КЛАСС — ПРИБОР `FeedNumber`: ПОДСТАНОВКА ПРОИСХОДИТ В САМОЙ ЗАПИСИ.
//
// Ученик жмёт число — оно ВСТАЁТ НА МЕСТО БУКВЫ в дроби, числитель и
// знаменатель считаются на глазах, дробь схлопывается в результат.
// На запрещённом числе знаменатель становится нулём и ЧЕРТА ДРОБИ РВЁТСЯ:
// делить не на что.
//
// Почему не отдельное табло сбоку (первая версия, отклонена методистом
// 2026-08-15): ученик смотрел на коробку, а математика происходила где-то
// ещё. Запрет берётся ИЗ ЗНАМЕНАТЕЛЯ, и увидеть это можно только одним
// способом — подставив число туда, где стоит буква.
//
// Разрыв черты — тот же приём, что в `TapPart` на экране 4: хук и объяснение
// говорят одним языком.
//
// Контракт хука (§5): экран принимает действие и закрывается. Разбора нет.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useEffect, useRef, useState } from 'react'
import { Ask, L, MATH_FONT, Note, Slot, T, fmt, useSfx, useT } from './core.jsx'

const TXT = {
  tap: L(
    "Istalgan sonni bosing: u harf o'rniga turadi",
    'Нажми любое число — оно встанет на место буквы',
    'Tap any number and it will take the place of the letter',
  ),
}

// Место буквы: до подстановки стоит буква, после — прилетевшее число.
function Spot({ v, on, tick, name }) {
  return on
    ? <span key={'s' + tick} className="g8-fd-in">{fmt(v)}</span>
    : <span className="g8-fd-var">{name}</span>
}

// Запись урока собирается из токенов: строка, равная имени переменной, —
// это МЕСТО ПОДСТАНОВКИ. Так один прибор показывает любую формулу, а не
// только ту, что была вшита в разметку.
function Tokens({ parts, sub, v, tick, name }) {
  return (
    <>
      {(parts || []).map((p, i) => (
        p === name
          ? <Spot key={i} v={v} on={sub} tick={tick + i * 10} name={name}/>
          : <span key={i} className="g8-fd-op">{p}</span>
      ))}
    </>
  )
}

// Фазы: 0 — буква, 1 — число подставлено, 2 — части посчитаны, 3 — итог.
export function FeedNumber({
  nums, num, den, top, bot, varName = 'x', ask, broke, predict, table, compact, onSolved, audio,
}) {
  const t = useT()
  const sfx = useSfx()
  const [at, setAt] = useState(null)
  const [phase, setPhase] = useState(0)
  const [seen, setSeen] = useState({})
  const [found, setFound] = useState(false)
  const [tick, setTick] = useState(0)
  // Прогноз ДО действия — это и делает экран хуком, а не тренажёром:
  // ученик берёт на себя обязательство, и проверка становится его делом.
  const [bet, setBet] = useState(predict ? null : 'skip')
  const timers = useRef([])

  // Таймеры держим в ref и гасим при уходе с экрана: иначе фаза доедет уже
  // на следующем экране и уронит его обращением к снятому состоянию.
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const dead = at !== null && den(at) === 0

  const feed = (x) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setAt(x)
    setPhase(1)
    setTick((n) => n + 1)
    setSeen((p) => ({ ...p, [x]: true }))
    timers.current.push(setTimeout(() => setPhase(2), 750))
    timers.current.push(setTimeout(() => {
      setPhase(3)
      if (den(x) === 0) {
        sfx.playWrong()
        setFound((was) => {
          if (!was) {
            if (audio && broke) audio.say(t(broke))
            // Хук вне оценки: `correct: null`. Число, на котором запись
            // сломалась, уходит на экран 15 для сверки.
            if (onSolved) onSolved({ correct: null, tries: 1, predicted: String(x) })
          }
          return true
        })
      } else {
        sfx.playCorrect()
      }
    }, 1500))
  }

  const showResult = phase === 3 && !dead

  return (
    <>
      <div className={'g8-fd' + (table ? ' g8-fd-has-tab' : '') + (compact ? ' g8-fd-compact' : '')}>
        <div className={'g8-fd-expr' + (dead && phase >= 2 ? ' is-dead' : '')} style={{ fontFamily: MATH_FONT }}>
          {showResult ? (
            <span key={'r' + tick} className="g8-fd-res">{fmt(num(at) / den(at))}</span>
          ) : (
            <span className="g8-fd-frac">
              <span className="g8-fd-n">
                {phase >= 2
                  ? <span key={'nv' + tick} className="g8-fd-pop">{fmt(num(at))}</span>
                  : <Tokens parts={top} sub={phase === 1} v={at} tick={tick} name={varName}/>}
              </span>
              <span className={'g8-fd-bar' + (dead && phase >= 2 ? ' is-torn' : '')} />
              <span className="g8-fd-d">
                {phase >= 2
                  ? <span key={'dv' + tick} className={'g8-fd-pop' + (dead ? ' is-zero' : '')}>{fmt(den(at))}</span>
                  : <Tokens parts={bot} sub={phase === 1} v={at} tick={tick + 200} name={varName}/>}
              </span>
            </span>
          )}
        </div>

        {bet === null ? (
          <div className="g8-fd-bet">
            <span className="g8-fd-betq">{t(predict.question)}</span>
            <div className="g8-fd-betopts">
              {predict.items.map((i) => (
                <button key={i.id} type="button" className="g8-fd-betbtn"
                  onClick={() => { setBet(i.id); if (audio && i.say) audio.say(t(i.say)) }}>
                  {t(i.label)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* ТАБЛИЦА СОБСТВЕННЫХ РЕЗУЛЬТАТОВ. Клетка заполняется тем, что
            ученик получил САМ, а не тем, что ему показали. Пустая клетка на
            запрещённом числе — его собственный результат, и спорить с ним
            он не станет. */}
        {table ? (
          <div className="g8-fd-tab">
            {nums.map((x) => (
              <div key={x} className={'g8-fd-cell' + (seen[x] ? (den(x) === 0 ? ' is-dead' : ' is-full') : '')}>
                <span className="g8-fd-cx" style={{ fontFamily: MATH_FONT }}>{fmt(x)}</span>
                <span className="g8-fd-cv" style={{ fontFamily: MATH_FONT }}>
                  {seen[x] ? (den(x) === 0 ? '—' : fmt(num(x) / den(x))) : ''}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className={'g8-fd-nums' + (bet === null ? ' is-locked' : '')}>
          {nums.map((x) => (
            <button
              key={x}
              type="button"
              className={'g8-fd-btn'
                + (at === x ? ' is-now' : '')
                + (seen[x] && den(x) === 0 ? ' is-dead' : seen[x] ? ' is-seen' : '')}
              style={{ fontFamily: MATH_FONT }}
              disabled={bet === null}
              onClick={() => feed(x)}
            >
              {fmt(x)}
            </button>
          ))}
        </div>
      </div>

      {/* 72, а не 54: строка про запрет длиннее вопроса и занимает две
          строки. Слот бронируется под ФИНАЛЬНОЕ состояние, иначе экран
          вылезает ровно после ответа — замер 2026-08-16 дал +3 на трёх
          размерах, и только после подстановки. */}
      <Slot mh={72}>
        {found && phase === 3 ? <Note kind="no">{t(broke)}</Note> : <Ask>{t(ask || TXT.tap)}</Ask>}
      </Slot>
    </>
  )
}


// ============================================================
// `PickBroken` — НАЙДИ ЗАПИСЬ, КОТОРАЯ НЕ СЧИТАЕТСЯ.
//
// Четыре записи в ряд, у одной под чертой буква. Заблуждение, которое экран
// лечит: «дробь опасна сама по себе». Опасна не дробь, а БУКВА ПОД ЧЕРТОЙ —
// поэтому среди вариантов есть и дробь со знаменателем-числом.
//
// Разбор на каждый неверный указывает на признак, а не даёт ответ.
// ============================================================
export function PickBroken({ items, ask, after, onSolved, audio }) {
  const t = useT()
  const sfx = useSfx()
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)

  const pick = (it) => {
    if (picked) return
    if (it.right) {
      setPicked(it.id)
      setNote(after || null)
      sfx.playCorrect()
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: wrong.length + 1 })
      return
    }
    setWrong((p) => (p.indexOf(it.id) === -1 ? p.concat(it.id) : p))
    setNote(it.hint || null)
    sfx.playWrong()
    if (audio && it.hint) audio.say(t(it.hint))
  }

  return (
    <>
      <Ask>{t(ask)}</Ask>
      <div className="g8-pb">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            className={'g8-pb-card'
              + (picked === it.id ? ' is-ok' : '')
              + (wrong.indexOf(it.id) !== -1 ? ' is-tip' : '')}
            style={{ fontFamily: MATH_FONT }}
            disabled={!!picked}
            onClick={() => pick(it)}
          >
            {/* `show` бывает записью (строка) и бывает текстом на трёх языках:
                на опоре это формула, на хуке — вариант ответа словами. */}
            {typeof it.show === 'string' ? it.show : t(it.show)}
          </button>
        ))}
      </div>
      <Slot mh={64}>
        <Note kind={picked ? 'ok' : 'no'}>{note ? t(note) : null}</Note>
      </Slot>
    </>
  )
}


// ============================================================
// `CaseStrip` — ТРИ СОБСТВЕННЫХ РЕЗУЛЬТАТА УЧЕНИКА ПЕРЕД ПРАВИЛОМ.
//
// На экранах 1, 5 и 7 ученик сам получил три отказа на разных записях и при
// разных числах. Здесь они стоят рядом — и правило перестаёт быть данным
// сверху: оно ВЫВОДИТСЯ из того, что он уже видел своими руками.
//
// Общее у всех трёх подсвечено: нуль под чертой.
// ============================================================
export function CaseStrip({ cases, lead }) {
  const t = useT()
  return (
    <div className="g8-cs">
      {lead ? <span className="g8-cs-lead">{t(lead)}</span> : null}
      <div className="g8-cs-row">
        {/* Карточка РЕШАЕТСЯ на глазах: сначала запись, потом подстановка,
            потом счёт знаменателя, и последним ноль. Раньше все три строки
            стояли готовыми, и было непонятно, откуда взялся ноль. */}
        {cases.map((c, i) => (
          <div key={i} className="g8-cs-item" style={{ fontFamily: MATH_FONT }}>
            <span className="g8-cs-rec">{c.rec}</span>
            <span className="g8-cs-at">{c.at}</span>
            {c.calc ? <span className="g8-cs-calc">{c.calc}</span> : null}
            <span className="g8-cs-den">{c.den}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


// ============================================================
// `TwoRecords` — ГДЕ ДВЕ ЗАПИСИ РАСХОДЯТСЯ.
//
// Ученик тапает числа; обе записи считаются РЯДОМ и на одном числе.
// Пока значения совпадают, обе панели зелёные. На числе, где левая теряет
// значение, она гаснет, а правая продолжает считать — расхождение видно, а
// не названо.
//
// Заблуждение, которое лечит: «сократили — значит равны». Равны везде,
// КРОМЕ одной точки, и эта точка не исчезает от сокращения.
// ============================================================
export function TwoRecords({ nums, left, right, ask, after, onSolved, audio }) {
  const t = useT()
  const sfx = useSfx()
  const [at, setAt] = useState(null)
  const [seen, setSeen] = useState({})
  const [found, setFound] = useState(false)

  const lv = at === null ? null : left.f(at)
  const rv = at === null ? null : right.f(at)
  const gap = at !== null && (lv === null || !isFinite(lv))

  const tap = (x) => {
    setAt(x)
    setSeen((p) => ({ ...p, [x]: true }))
    const v = left.f(x)
    if (v === null || !isFinite(v)) {
      sfx.playWrong()
      if (!found) {
        setFound(true)
        if (audio && after) audio.say(t(after))
        if (onSolved) onSolved({ correct: true, tries: 1, value: x })
      }
      return
    }
    sfx.playCorrect()
  }

  const cell = (rec, v, dim) => (
    <div className={'g8-tr-panel' + (dim ? ' is-dim' : '')}>
      <span className="g8-tr-rec" style={{ fontFamily: MATH_FONT }}>{rec}</span>
      <span className="g8-tr-val" style={{ fontFamily: MATH_FONT }}>
        {at === null ? '' : (v === null || !isFinite(v)) ? '—' : fmt(v)}
      </span>
    </div>
  )

  return (
    <>
      <div className="g8-tr">
        <div className="g8-tr-pair">
          {cell(left.show, lv, gap)}
          <span className={'g8-tr-sign' + (gap ? ' is-gap' : '')}>{gap ? '≠' : '='}</span>
          {cell(right.show, rv, false)}
        </div>
        <div className="g8-tr-nums">
          {nums.map((x) => (
            <button key={x} type="button" style={{ fontFamily: MATH_FONT }}
              className={'g8-fd-btn' + (at === x ? ' is-now' : '')
                + (seen[x] ? ((left.f(x) === null || !isFinite(left.f(x))) ? ' is-dead' : ' is-seen') : '')}
              onClick={() => tap(x)}>{fmt(x)}</button>
          ))}
        </div>
      </div>
      <Slot mh={64}>
        {found ? <Note kind="ok">{t(after)}</Note> : <Ask>{t(ask)}</Ask>}
      </Slot>
    </>
  )
}


// ============================================================
// `FormulaSlots` — УЧЕНИК СОБИРАЕТ ЗАПИСЬ САМ.
//
// Таблица в две ячейки: сверху и снизу. Кнопками ученик кладёт в каждую либо
// ЧИСЛО, либо БУКВУ и сразу видит приговор: считает всегда или может упасть.
// Перебрав четыре сочетания, он открывает правило сам — опасна только буква
// внизу, сверху она безразлична.
//
// Устройство взято из урока 1 второго класса («Собери 24»): там кнопками
// растят число в двух колонках, здесь — собирают запись.
// ============================================================
export function FormulaSlots({
  topLabel, botLabel, numWord, varWord, rounds, verdicts, after, onSolved, audio,
}) {
  const t = useT()
  const sfx = useSfx()
  const [top, setTop] = useState(null)
  const [bot, setBot] = useState(null)
  const [round, setRound] = useState(0)
  const [passed, setPassed] = useState([])
  const [done, setDone] = useState(false)

  // ЭТАПЫ ВИДНЫ. Раньше круг сменялся молча: ячейки пустели, счётчик менял
  // цифру, и ученик не понимал, что он прошёл этап. Теперь пройденный этап
  // остаётся на экране собранной записью с галочкой, а текущий подсвечен.
  const cur = rounds[Math.min(round, rounds.length - 1)]
  const risky = bot === 'var'
  const full = top && bot

  const put = (where, what) => {
    if (done) return
    const nextTop = where === 'top' ? what : top
    const nextBot = where === 'bot' ? what : bot
    if (where === 'top') setTop(what); else setBot(what)
    if (!nextTop || !nextBot) { sfx.playCorrect(); return }
    if (nextBot === cur.need) {
      sfx.playCorrect()
      setPassed((p) => p.concat([{ top: nextTop, bot: nextBot }]))
      if (round + 1 >= rounds.length) {
        setDone(true)
        if (audio && after) audio.say(t(after))
        if (onSolved) onSolved({ correct: true, tries: 1 })
      } else {
        setRound(round + 1)
        setTimeout(() => { setTop(null); setBot(null) }, 950)
      }
      return
    }
    sfx.playWrong()
  }

  const sym = (v) => (v === 'num' ? '7' : v === 'var' ? 'a' : '')

  const cell = (where, val, label) => (
    <div className={'g8-fs-cell' + (val ? ' is-full' : '') + (where === 'bot' && val === 'var' ? ' is-risky' : '')}>
      <span className="g8-fs-cap">{t(label)}</span>
      <span className="g8-fs-val" style={{ fontFamily: MATH_FONT }}>{sym(val)}</span>
      <span className="g8-fs-btns">
        <button type="button" className="g8-fs-btn" onClick={() => put(where, 'num')}>{t(numWord)}</button>
        <button type="button" className="g8-fs-btn" onClick={() => put(where, 'var')}>{t(varWord)}</button>
      </span>
    </div>
  )

  return (
    <>
      {/* ЛЕСТНИЦА ЭТАПОВ: пройденный этап показывает СОБРАННУЮ запись и
          галочку, текущий подсвечен, будущий приглушён. */}
      <div className="g8-fs-steps">
        {rounds.map((r, i) => (
          <div key={i} className={'g8-fs-step'
            + (i < passed.length ? ' is-done' : '')
            + (i === round && !done ? ' is-now' : '')}>
            <span className="g8-fs-stepn">{i + 1}</span>
            <span className="g8-fs-steptx">{t(r.ask)}</span>
            {passed[i] ? (
              <span className="g8-fs-stepres" style={{ fontFamily: MATH_FONT }}>
                {sym(passed[i].top)} : {sym(passed[i].bot)} {'✓'}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="g8-fs">
        {cell('top', top, topLabel)}
        <span className="g8-fs-bar"/>
        {cell('bot', bot, botLabel)}
      </div>

      <Slot mh={62}>
        {full && !done ? (
          <Note kind={risky ? 'no' : 'ok'}>{t(risky ? verdicts.risky : verdicts.safe)}</Note>
        ) : done ? <Note kind="ok">{t(verdicts.place)}</Note> : null}
      </Slot>
    </>
  )
}


// ============================================================
// `TwoWays` — ОДИН ОТВЕТ, ДВА СПОСОБА, ОБА НА ЭКРАНЕ СРАЗУ.
//
// Образец — урок 1 второго класса («Разберём 345 двумя способами»): одна
// карточка, внутри два озаглавленных блока и вывод. Никакой ленты шагов:
// сравнивать способы можно только когда они видны ОДНОВРЕМЕННО, а
// пошаговое открытие показывает их по очереди и сравнение убивает.
// ============================================================
export function TwoWays({ blocks, stepMs = 1900, onStep }) {
  const t = useT()
  // ПОСТРОЧНОЕ ОТКРЫТИЕ ПОД ОЗВУЧКУ. Высота карточки при этом ПОЛНАЯ с первой
  // секунды: строки уже стоят, но невидимы. Иначе карточка растёт, экран
  // подпрыгивает и нижняя панель уезжает (§11).
  // Каждая открытая строка шлёт событие onStep — за него цепляются реплики,
  // объявленные через W(), и звук идёт в ногу с показом.
  const [shown, setShown] = useState(0)
  const total = blocks.reduce((n, b) => n + b.rows.length, 0)
  // Колбэк держим в ref и обновляем В ЭФФЕКТЕ: присваивание при рендере —
  // ошибка линта react-hooks/refs, и на ней уже спотыкались в 10 классе.
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])
  useEffect(() => {
    if (shown >= total) return undefined
    const id = setTimeout(() => {
      setShown((n) => n + 1)
      if (stepRef.current) stepRef.current('w' + (shown + 1))
    }, shown === 0 ? 900 : stepMs)
    return () => clearTimeout(id)
  }, [shown, total, stepMs])
  // Номер строки считается ЗАРАНЕЕ, а не счётчиком по ходу разметки:
  // менять переменную во время рендера нельзя.
  const starts = []
  blocks.reduce((n, b) => { starts.push(n); return n + b.rows.length }, 0)
  return (
    <div className="g8-tw">
      {blocks.map((b, i) => (
        <div key={i} className={'g8-tw-b' + (b.tone ? ' is-' + b.tone : '')}>
          <div className="g8-tw-h">{t(b.name)}</div>
          {b.lead ? <div className="g8-tw-lead">{t(b.lead)}</div> : null}
          <div className="g8-tw-rows" style={{ fontFamily: MATH_FONT }}>
            {b.rows.map((r, k) => {
              const open = starts[i] + k + 1 <= shown
              return (
              <div key={k} className={'g8-tw-row' + (r.tone ? ' tone-' + r.tone : '') + (open ? ' is-open' : '')}>
                <span>{typeof r.text === 'string' ? r.text : t(r.text)}</span>
                {r.note ? <i className="g8-tw-note">{t(r.note)}</i> : null}
              </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}


// ============================================================
// `Steppers` — УЧЕНИК КРУТИТ ДАННЫЕ, ПРИЛОЖЕНИЕ СЧИТАЕТ.
//
// Два столбца со счётчиками: сумма и количество. Ученик меняет их кнопками
// и сразу видит цену. Уводя количество в ноль, он САМ доводит приложение до
// отказа — не выбирает готовый ответ и не смотрит показ.
//
// Устройство из урока 1 второго класса («Собери 245»): там столбцы разрядов
// с плюсом и минусом, здесь — поля, из которых складывается формула.
// ============================================================
// `goal` поднимает возраст экрана: вместо «покрути и посмотри» ученик решает
// ОБРАТНУЮ задачу — подбери количество, при котором цена станет ровно такой.
// Это уже рассуждение о делителях, а не перебор наугад.
export function Steppers({ cols, calc, resultLabel, sign, goal, ask, ask2, broke, onSolved, audio }) {
  const t = useT()
  const sfx = useSfx()
  const [vals, setVals] = useState(cols.map((c) => c.start))
  const [touched, setTouched] = useState(false)
  const [found, setFound] = useState(false)
  // `hit` — первая задача решена: цена подобрана. До этого ронять нельзя.
  const [hit, setHit] = useState(!goal)

  const out = calc(vals)
  const dead = out === null || !isFinite(out)

  const bump = (i, d) => {
    // Новое значение считаем СНАРУЖИ обновления состояния. Побочные действия
    // внутри updater-функции React выполняет в фазе рендера и предупреждает
    // «setState во время рендера другого компонента» — поймано прогоном.
    const c = cols[i]
    const next = vals.slice()
    next[i] = Math.min(Math.max(next[i] + d * (c.step || 1), c.min), c.max)
    setVals(next)
    setTouched(true)
    const res = calc(next)
    if (goal && !hit && res === goal.value) {
      setHit(true)
      sfx.playCorrect()
      if (audio && goal.after) audio.say(t(goal.after))
      return
    }
    if (res === null || !isFinite(res)) {
      sfx.playWrong()
      if (!found && hit) {
        setFound(true)
        if (audio && broke) audio.say(t(broke))
        if (onSolved) onSolved({ correct: true, tries: 1 })
      }
    } else {
      sfx.playCorrect()
    }
  }

  return (
    <>
      {/* СТОЛБЦЫ И РЕЗУЛЬТАТ СТОЯТ ОДНОЙ ФОРМУЛОЙ: сумма, знак деления,
          количество, знак равно, цена. Раньше они лежали в два этажа, и
          связь между ними на экране НЕ ЧИТАЛАСЬ — ученик крутил два числа,
          не видя, что это одна запись. */}
      <div className="g8-st">
        <div className="g8-st-line">
          {cols.map((c, i) => (
            <React.Fragment key={c.id}>
              {i > 0 ? <span className="g8-st-sign">{sign || ':'}</span> : null}
              <div className={'g8-st-col' + (dead && c.risky ? ' is-dead' : '')}>
                <span className="g8-st-cap">{t(c.label)}</span>
                <span className="g8-st-val" style={{ fontFamily: MATH_FONT }}>{fmt(vals[i])}</span>
                <span className="g8-st-btns">
                  <button type="button" className="g8-st-btn" onClick={() => bump(i, -1)}>{'−'}</button>
                  <button type="button" className="g8-st-btn is-plus" onClick={() => bump(i, 1)}>{'+'}</button>
                </span>
              </div>
            </React.Fragment>
          ))}

          <span className="g8-st-sign">{'='}</span>

          <div className={'g8-st-out' + (dead ? ' is-dead' : '')}>
            <span className="g8-st-cap">{t(resultLabel)}</span>
            <span className="g8-st-outval" style={{ fontFamily: MATH_FONT }}>
              {!touched ? '?' : dead ? 'Error' : fmt(out)}
            </span>
          </div>
        </div>
      </div>

      <Slot mh={62}>
        {found && dead
          ? <Note kind="no">{t(broke)}</Note>
          : <Ask>{t(hit && ask2 ? ask2 : ask)}</Ask>}
      </Slot>
    </>
  )
}


// ============================================================
// `Chain` — ЦЕПОЧКА: ЧТО МЕНЯЕТСЯ ВМЕСТЕ С ЧЕМ.
//
// Устройство из урока 1 четвёртого класса («Вспоминаем разряды»): полоса
// сегментов сверху, звенья цепочки со стрелками, под каждым — его следствие,
// и вывод строкой внизу. Звенья открываются по очереди под озвучку.
//
// Здесь цепочка показывает, что запрет НЕ ЗАКРЕПЛЁН за числом: меняется
// знаменатель — переезжает и запрет.
// ============================================================
export function Chain({
  items, conclusion, handoff, quiz, stepMs = 1800, onStep, onSolved, audio,
}) {
  const t = useT()
  const sfx = useSfx()
  const [shown, setShown] = useState(0)
  // ПОСЛЕ ОБЪЯСНЕНИЯ — ПЕРЕДАЧА ХОДА. Отсчёт в пять секунд отделяет показ от
  // работы: ученик успевает понять, что смотреть кончилось и теперь его
  // очередь. Без этой паузы вопрос выглядит как продолжение объяснения.
  const [left, setLeft] = useState(null)
  const [qi, setQi] = useState(-1)
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  useEffect(() => {
    if (shown >= items.length) return undefined
    const id = setTimeout(() => {
      setShown((n) => n + 1)
      if (stepRef.current) stepRef.current('c' + (shown + 1))
    }, shown === 0 ? 700 : stepMs)
    return () => clearTimeout(id)
  }, [shown, items.length, stepMs])

  // Отсчёт запускается, когда цепочка досказана.
  // setState синхронно в эффекте — ошибка линта и каскад рендеров. Обе смены
  // состояния уходят в таймер, даже нулевой (грабля записана в эталоне).
  useEffect(() => {
    if (shown < items.length || !handoff || left !== null || qi >= 0) return undefined
    const id = setTimeout(() => setLeft(handoff.seconds || 5), 0)
    return () => clearTimeout(id)
  }, [shown, items.length, handoff, left, qi])

  useEffect(() => {
    if (left === null) return undefined
    const id = setTimeout(() => {
      if (left <= 0) setQi(0); else setLeft(left - 1)
    }, left <= 0 ? 0 : 1000)
    return () => clearTimeout(id)
  }, [left])

  const q = qi >= 0 && quiz ? quiz[Math.min(qi, quiz.length - 1)] : null
  const finished = quiz ? qi >= quiz.length : false

  const pick = (it) => {
    const src = q.items.find((x) => x.id === it.id)
    if (src && src.right) {
      sfx.playCorrect()
      setWrong([])
      setNote(null)
      if (qi + 1 >= quiz.length) {
        setQi(quiz.length)
        if (onSolved) onSolved({ correct: true, tries: 1 })
      } else {
        setQi(qi + 1)
      }
      return
    }
    setWrong((p) => (p.indexOf(it.id) === -1 ? p.concat(it.id) : p))
    setNote(src && src.hint ? src.hint : null)
    sfx.playWrong()
    if (audio && src && src.hint) audio.say(t(src.hint))
  }

  return (
    <>
      <div className="g8-ch">
        <div className="g8-ch-seg">
          {items.map((it, i) => <i key={i} className={i < shown ? 'is-on' : ''}/>)}
        </div>

        <div className="g8-ch-row">
          {items.map((it, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <span className={'g8-ch-arrow' + (i < shown ? ' is-on' : '')}>{'→'}</span> : null}
              <div className={'g8-ch-item' + (i < shown ? ' is-on' : '')}>
                <span className="g8-ch-cap">{t(it.cap)}</span>
                <span className="g8-ch-val" style={{ fontFamily: MATH_FONT }}>{it.den}</span>
                <span className="g8-ch-out" style={{ fontFamily: MATH_FONT }}>{it.ban}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className={'g8-ch-sum' + (shown >= items.length ? ' is-on' : '')}>{t(conclusion)}</div>
      </div>

      <Slot mh={110}>
        {left !== null && left > 0 ? (
          <div className="g8-ch-hand">
            <span className="g8-ch-handtx">{t(handoff.text)}</span>
            <span className="g8-ch-timer" style={{ fontFamily: MATH_FONT }}>{left}</span>
          </div>
        ) : finished ? (
          <Note kind="ok">{t(handoff.done)}</Note>
        ) : q ? (
          <div className="g8-ch-quiz">
            <span className="g8-ch-qn">{qi + 1} / {quiz.length}</span>
            <Ask>{t(q.question)}</Ask>
            <div className="g8-ch-qopts">
              {q.items.map((it) => (
                <button key={it.id} type="button"
                  className={'g8-opt' + (wrong.indexOf(it.id) !== -1 ? ' g8-opt-tip' : '')}
                  onClick={() => pick(it)}>{t(it.label)}</button>
              ))}
            </div>
            {note ? <Note kind="no">{t(note)}</Note> : null}
          </div>
        ) : null}
      </Slot>
    </>
  )
}


// ============================================================
// `Parts` — РАЗБОР ЗАПИСИ ПО ЧАСТЯМ.
//
// Устройство из урока 1 четвёртого класса (разбор числа по классам): сверху
// запись, в ней по очереди подсвечивается часть, под ней копятся полосы с
// пояснением, внизу карточка факта.
//
// Ученик видит не новую тему, а РОЛИ в записи, которую он уже трогал.
// ============================================================
export function Parts({ tokens, steps, fact, stepMs = 2600, onStep }) {
  const t = useT()
  const [shown, setShown] = useState(0)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])
  useEffect(() => {
    if (shown >= steps.length) return undefined
    const id = setTimeout(() => {
      setShown((n) => n + 1)
      if (stepRef.current) stepRef.current('p' + (shown + 1))
    }, shown === 0 ? 900 : stepMs)
    return () => clearTimeout(id)
  }, [shown, steps.length, stepMs])

  const focus = shown > 0 ? steps[Math.min(shown, steps.length) - 1].focus : null

  return (
    <div className="g8-pt">
      <div className="g8-pt-expr" style={{ fontFamily: MATH_FONT }}>
        {tokens.map((tk, i) => (
          <span key={i} className={'g8-pt-tk' + (tk.id && tk.id === focus ? ' is-on' : '')}>{tk.t}</span>
        ))}
      </div>

      <div className="g8-pt-notes">
        {steps.map((st, i) => (
          <div key={i} className={'g8-pt-note' + (i < shown ? ' is-on' : '')
            + (i === shown - 1 ? ' is-now' : '')}>{t(st.text)}</div>
        ))}
      </div>

      {fact ? (
        <div className={'g8-pt-fact' + (shown >= steps.length ? ' is-on' : '')}>
          {/* Живой значок: три точки бегут по кругу, как индикатор запроса в
              базе — ровно про то, о чём факт. Движение здесь уместно, потому
              что оно НАЗЫВАЕТ предмет, а не украшает карточку. */}
          <span className="g8-pt-dots" aria-hidden="true"><i/><i/><i/></span>
          <span className="g8-pt-factcap">{t(fact.cap)}</span>
          <span className="g8-pt-facttx">{t(fact.text)}</span>
        </div>
      ) : null}
    </div>
  )
}


// ============================================================
// `Drill` — ЦЕПОЧКА ПРИМЕРОВ ОТ ЛЁГКОГО К ТРУДНОМУ С ПОКАЗОМ РЕШЕНИЯ.
//
// Наглядность из урока 5 третьего класса: ученик отвечает, и под заданием
// раскрывается блок «РЕШЕНИЕ» — как это решается по шагам. Решение видно
// ВСЕГДА, а не только при ошибке: тот, кто ответил верно, тоже должен
// увидеть образец записи.
//
// Ленты способа на экране нет: она дублировала то, что показывает решение.
// ============================================================
export function Drill({ tasks, solutionLabel, nextLabel, doneNote, onSolved, audio }) {
  const t = useT()
  const sfx = useSfx()
  const [at, setAt] = useState(0)
  const [wrong, setWrong] = useState([])
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(null)
  const [done, setDone] = useState(false)

  const task = tasks[Math.min(at, tasks.length - 1)]

  const pick = (it) => {
    if (open) return
    const src = task.items.find((x) => x.id === it.id)
    if (src && src.right) {
      sfx.playCorrect()
      setNote(null)
      setWrong([])
      setOpen(true)
      return
    }
    setWrong((p) => (p.indexOf(it.id) === -1 ? p.concat(it.id) : p))
    setNote(src && src.hint ? src.hint : null)
    sfx.playWrong()
    if (audio && src && src.hint) audio.say(t(src.hint))
  }

  const next = () => {
    if (at + 1 >= tasks.length) {
      setDone(true)
      if (onSolved) onSolved({ correct: true, tries: 1 })
      return
    }
    setAt(at + 1)
    setOpen(false)
    setNote(null)
    setWrong([])
  }

  return (
    <div className="g8-dr">
      <div className="g8-dr-top">
        <span className="g8-dr-n">{Math.min(at + 1, tasks.length)} / {tasks.length}</span>
        <span className="g8-dr-seg">
          {tasks.map((x, i) => <i key={i} className={i < at || (i === at && open) ? 'is-on' : ''}/>)}
        </span>
      </div>

      {done ? (
        <Note kind="ok">{t(doneNote)}</Note>
      ) : (
        <>
          {/* Запись может прийти ГОТОВОЙ ДРОБЬЮ (узел с чертой), а не строкой:
              «(x + 1) : ((x − 2)(x + 5))» в строку читается как набор скобок,
              а дробь читается сразу (методист, 2026-08-17). */}
          <div className="g8-dr-expr" style={{ fontFamily: MATH_FONT }}>
            {typeof task.expr === 'string' ? task.expr : task.expr}
          </div>
          <Ask>{t(task.question)}</Ask>

          {!open ? (
            <div className="g8-dr-opts">
              {task.items.map((it) => (
                <button key={it.id} type="button"
                  className={'g8-opt' + (wrong.indexOf(it.id) !== -1 ? ' g8-opt-tip' : '')}
                  onClick={() => pick(it)}>{t(it.label)}</button>
              ))}
            </div>
          ) : null}

          {note && !open ? <Note kind="no">{t(note)}</Note> : null}

          {open ? (
            <div className="g8-dr-sol">
              <span className="g8-dr-solcap">{t(solutionLabel)}</span>
              <div className="g8-dr-sollines" style={{ fontFamily: MATH_FONT }}>
                {task.solution.map((ln, i) => (
                  <div key={i} className="g8-dr-solline" style={{ animationDelay: (i * 260) + 'ms' }}>
                    {typeof ln === 'string' ? ln : t(ln)}
                  </div>
                ))}
              </div>
              <button type="button" className="g8-dr-next" onClick={next}>{t(nextLabel)}</button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}


// ============================================================
// `FillSolution` — УЧЕНИК ЗАПОЛНЯЕТ ЗАПИСЬ ПО КЛЕТКАМ.
//
// Устройство из урока 3 пятого класса («разбор в столбик»): пустые клетки
// закрываются ПО ОДНОЙ, текущая обведена акцентом, заполненные остаются.
// Внизу «Повторить» — пройти запись заново.
//
// Отличие от выбора одного ответа: ученик проходит ВСЮ запись, шаг за шагом,
// и видит, из чего она складывается.
// ============================================================
export function FillSolution({
  tasks, demo, showLabel, againLabel, selfLabel, repeatLabel, doneNote, onSolved,
}) {
  const t = useT()
  const sfx = useSfx()
  // ПОКАЗ, ПОТОМ САМ. Прибор сначала заполняет запись СВОИМИ руками — ученик
  // видит, что вообще надо делать на таком экране, — и только потом отдаёт
  // ход. Без показа первая клетка непонятна: неясно, куда жать и зачем.
  // Наглядность из урока 1 третьего класса.
  const [phase, setPhase] = useState(demo ? 'demo' : 'self')
  const [filled, setFilled] = useState([])
  const [wrong, setWrong] = useState(null)
  const [press, setPress] = useState(null)
  // Три примера подряд: после показа ученик решает их сам, сложность растёт.
  const [ti0, setTi0] = useState(0)

  const cur = phase === 'demo' && demo ? demo : tasks[Math.min(ti0, tasks.length - 1)]

  const slots = []
  cur.lines.forEach((ln, li) => ln.forEach((tk, ti) => {
    if (tk && tk.slot) slots.push({ li, ti, v: tk.slot })
  }))
  const at = filled.length
  const done = at >= slots.length

  // Показ идёт сам: фишка «нажимается», потом клетка закрывается.
  useEffect(() => {
    if (phase !== 'demo' || done) return undefined
    const v = slots[at].v
    const t1 = setTimeout(() => setPress(v), 700)
    const t2 = setTimeout(() => {
      setPress(null)
      setFilled((p) => p.concat([v]))
    }, 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase, at, done, slots])

  const put = (c) => {
    if (done || phase === 'demo') return
    if (c === slots[at].v) {
      sfx.playCorrect()
      setWrong(null)
      const next = filled.concat([c])
      setFilled(next)
      if (next.length >= slots.length) {
        if (ti0 + 1 < tasks.length) {
          setTimeout(() => { setTi0(ti0 + 1); setFilled([]) }, 1100)
        } else if (onSolved) {
          onSolved({ correct: true, tries: 1 })
        }
      }
      return
    }
    setWrong(c)
    sfx.playWrong()
  }

  const undo = () => { if (phase === 'demo' || !filled.length) return; setFilled(filled.slice(0, -1)); setWrong(null) }
  const again = () => { setFilled([]); setWrong(null); setPress(null) }
  const toSelf = () => { setPhase('self'); setFilled([]); setWrong(null); setPress(null) }

  const idxOf = new Map()
  let c0 = 0
  cur.lines.forEach((ln, li) => ln.forEach((tk, ti) => {
    if (tk && tk.slot) { idxOf.set(li + ':' + ti, c0); c0 += 1 }
  }))

  return (
    <div className="g8-fl">
      {phase === 'demo'
        ? <span className="g8-fl-badge">{t(showLabel)}</span>
        : <span className="g8-fl-n">{ti0 + 1} / {tasks.length}</span>}

      <div className={'g8-fl-lines' + (phase === 'demo' ? ' is-demo' : '')} style={{ fontFamily: MATH_FONT }}>
        {cur.lines.map((ln, li) => (
          <div key={li} className="g8-fl-line">
            {ln.map((tk, ti) => {
              if (!tk || !tk.slot) return <span key={ti} className="g8-fl-tx">{tk && tk.t ? tk.t : tk}</span>
              const idx = idxOf.get(li + ':' + ti)
              return (
                <span key={ti} className={'g8-fl-slot'
                  + (idx < filled.length ? ' is-full' : '')
                  + (idx === filled.length ? ' is-now' : '')}>
                  {idx < filled.length ? filled[idx] : ''}
                </span>
              )
            })}
          </div>
        ))}
      </div>

      {phase === 'demo' && done ? (
        <div className="g8-fl-hand">
          <button type="button" className="g8-fl-again" onClick={again}>{'↻  '}{t(againLabel)}</button>
          <button type="button" className="g8-fl-self" onClick={toSelf}>{t(selfLabel)}{'  →'}</button>
        </div>
      ) : done && ti0 + 1 >= tasks.length ? (
        <>
          <Note kind="ok">{t(doneNote)}</Note>
          <button type="button" className="g8-fl-again" onClick={again}>{'↻  '}{t(repeatLabel)}</button>
        </>
      ) : (
        <div className="g8-fl-row">
        <div className="g8-fl-chips">
          {cur.chips.map((c) => (
            <button key={c} type="button"
              className={'g8-fl-chip' + (wrong === c ? ' is-wrong' : '') + (press === c ? ' is-press' : '')}
              style={{ fontFamily: MATH_FONT }}
              onClick={() => put(c)}>
              {c}
              {press === c ? <i className="g8-fl-hand-ico" aria-hidden="true"/> : null}
            </button>
          ))}
        </div>
        {phase !== 'demo' && filled.length ? (
          <button type="button" className="g8-fl-undo" onClick={undo}>{'↶'}</button>
        ) : null}
        </div>
      )}
    </div>
  )
}

// ============================================================
// CSS. ВНИМАНИЕ: строка шаблонная — обратная кавычка или обратный слэш
// внутри неё, даже в комментарии, дают белую страницу.
// ============================================================
export const FEED_STYLES = `
.g8-fd { display: flex; flex-direction: column; align-items: center; gap: 26px; width: 100%;
  flex: 1 1 auto; justify-content: center; min-height: 0; }

.g8-fd-expr { display: flex; align-items: center; justify-content: center;
  padding: 26px 54px; border-radius: 22px; background: ${T.paper};
  box-shadow: 0 26px 60px -40px rgba(${T.shadow},1), inset 0 0 0 1px rgba(23,26,29,.05);
  min-height: 148px; font-size: clamp(30px, 3.4vw, 46px); color: ${T.ink}; }
.g8-fd-frac { display: inline-flex; flex-direction: column; align-items: center; }
.g8-fd-n, .g8-fd-d { display: flex; align-items: baseline; justify-content: center;
  padding: 0 .3em; line-height: 1.2; }
/* Ширина дроби НЕ прыгает при счёте: она задана заранее по самой длинной
   записи. Иначе на шаге «ноль на ноль» дробь схлопывается в чёрточку, и
   разрыв черты становится не виден. */
.g8-fd-frac { min-width: 5.6em; }
/* pre: пробелы вокруг знака действия html СХЛОПЫВАЕТ, и «x · x − 4»
   превращается в «x·x− 4». Второй раз за сессию на этом же. */
.g8-fd-op { color: ${T.ink}; white-space: pre; }
.g8-fd-var { font-style: italic; color: ${T.ink}; }

/* Черта дроби. При нуле в знаменателе она РВЁТСЯ: делить не на что, и это
   видно на самой записи, а не сказано словами. */
.g8-fd-bar { display: block; width: 100%; height: 4px; background: ${T.ink};
  margin: .16em 0; border-radius: 2px; transition: background .3s ease; }
.g8-fd-bar.is-torn { background: none;
  background-image: linear-gradient(to right, ${T.tip} 0 34%, transparent 34% 66%, ${T.tip} 66% 100%);
  animation: g8-fd-tear 420ms ease-out both; }
@keyframes g8-fd-tear { from { transform: scaleX(1); } 60% { transform: scaleX(1.06); } to { transform: scaleX(1); } }

/* Число ВСТАЁТ на место буквы: прилетает сверху и укрупняется. */
.g8-fd-in { color: ${T.accent}; font-weight: 600;
  animation: g8-fd-drop 420ms cubic-bezier(.34,1.5,.64,1) both; }
@keyframes g8-fd-drop { from { opacity: 0; transform: translateY(-26px) scale(.6); } to { opacity: 1; transform: none; } }

.g8-fd-pop { animation: g8-fd-pop 380ms cubic-bezier(.34,1.5,.64,1) both; }
@keyframes g8-fd-pop { from { opacity: 0; transform: scale(.55); } to { opacity: 1; transform: scale(1); } }
.g8-fd-pop.is-zero { color: ${T.tip}; font-weight: 700; }
.g8-fd-res { font-size: clamp(44px, 5vw, 72px); color: ${T.ok}; font-weight: 600;
  animation: g8-fd-pop 460ms cubic-bezier(.34,1.5,.64,1) both; }
.g8-fd-expr.is-dead { animation: g8-fd-shake 420ms ease-in-out 1; }
@keyframes g8-fd-shake {
  0%, 100% { transform: translateX(0); }
  22% { transform: translateX(-7px); }
  48% { transform: translateX(6px); }
  74% { transform: translateX(-3px); }
}

/* Экран со своей сценой: запись уже показана на сцене, и во весь рост её
   держать незачем — два блока начинают бороться за высоту и налезают. */
.g8-fd-compact { gap: 12px; }
.g8-fd-compact .g8-fd-expr { min-height: 82px; padding: 10px 26px; font-size: clamp(22px, 2.2vw, 30px);
  box-shadow: none; background: transparent; }
.g8-fd-has-tab .g8-fd-expr { min-height: 108px; padding: 16px 40px; }
.g8-fd-has-tab .g8-fd-btn { min-width: 58px; min-height: 58px; }
.g8-fd-has-tab { gap: 12px; }
.g8-tr { display: flex; flex-direction: column; align-items: center; gap: 20px; width: 100%;
  flex: 1 1 auto; justify-content: center; min-height: 0; }
.g8-tr-pair { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center; }
.g8-tr-panel { display: flex; flex-direction: column; align-items: center; gap: 6px;
  min-width: 168px; padding: 16px 20px; border-radius: 16px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.07); transition: opacity .3s ease; }
.g8-tr-panel.is-dim { opacity: .55; box-shadow: inset 0 0 0 2px rgba(${T.tipRgb},.4); }
.g8-tr-rec { font-size: clamp(17px, 1.7vw, 22px); color: ${T.ink2}; }
.g8-tr-val { font-size: clamp(26px, 2.8vw, 38px); color: ${T.ink}; min-height: 1.15em; }
.g8-tr-panel.is-dim .g8-tr-val { color: ${T.tip}; }
.g8-tr-sign { font-family: ${MATH_FONT}; font-size: clamp(20px, 2vw, 26px); color: ${T.ink3}; }
.g8-tr-sign.is-gap { color: ${T.tip}; font-weight: 700; }
.g8-tr-nums { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.g8-pt { width: 100%; display: flex; flex-direction: column; gap: 12px; align-items: center; }
.g8-pt-expr { display: flex; align-items: baseline; gap: 4px; white-space: pre;
  font-size: clamp(26px, 2.8vw, 40px); color: ${T.ink}; padding: 12px 20px;
  background: ${T.paper}; border-radius: 16px;
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.06); }
.g8-pt-tk { padding: 2px 6px; border-radius: 8px; display: inline-block;
  transition: background .35s ease, color .35s ease, transform .35s cubic-bezier(.34,1.4,.64,1); }
/* Подсвеченная часть ПРИПОДНИМАЕТСЯ: движение показывает, о чём речь сейчас,
   а не только цвет — цвет один и тот же на всех трёх шагах. */
.g8-pt-tk.is-on { background: ${T.tipSoft}; color: ${T.tip}; transform: translateY(-4px) scale(1.06); }

/* Запись выезжает первой, до полос: сначала объект, потом разговор о нём. */
.g8-pt-expr { animation: g8-pt-in 520ms cubic-bezier(.22,.9,.3,1) both; }
@keyframes g8-pt-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
.g8-pt-notes { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.g8-pt-note { padding: 9px 14px; border-radius: 0 12px 12px 0; border-left: 4px solid ${T.accent};
  background: ${T.paper}; font-family: 'Manrope', system-ui, sans-serif;
  font-size: clamp(13.5px, 1.25vw, 17px); color: ${T.ink};
  opacity: 0; transform: translateX(-8px); transition: opacity .4s ease, transform .4s ease; }
.g8-pt-note.is-on { opacity: 1; transform: none; }
/* Текущая полоса выделена: она про ту часть, что подсвечена сейчас.
   Прошлые остаются на экране, но уходят на второй план. */
.g8-pt-note.is-on:not(.is-now) { opacity: .62; border-left-color: ${T.ink4}; }
.g8-pt-note.is-now { border-left-width: 5px; box-shadow: 0 10px 26px -22px rgba(${T.shadow},.9); }
.g8-pt-fact { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto;
  column-gap: 12px; row-gap: 3px; width: 100%; align-items: center;
  padding: 11px 15px; border-radius: 14px; background: ${T.graphSoft};
  opacity: 0; transition: opacity .5s ease; }
.g8-pt-fact { position: relative; overflow: hidden; }
.g8-pt-fact.is-on { opacity: 1; animation: g8-pt-up 520ms cubic-bezier(.22,.9,.3,1) both; }
/* Полоса наливается слева направо, как заполняется индикатор запроса. */
.g8-pt-fact::after { content: ''; position: absolute; left: 0; bottom: 0; height: 3px; width: 100%;
  background: ${T.graph}; transform: scaleX(0); transform-origin: left center; }
.g8-pt-fact.is-on::after { animation: g8-pt-bar 2.4s cubic-bezier(.3,.7,.4,1) 400ms both; }
@keyframes g8-pt-bar { to { transform: scaleX(1); } }
@keyframes g8-pt-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.g8-pt-dots { grid-row: 1 / span 2; display: flex; gap: 4px; align-items: center; }
.g8-pt-dots i { width: 7px; height: 7px; border-radius: 50%; background: ${T.graph};
  animation: g8-pt-dot 1.4s ease-in-out infinite; }
.g8-pt-dots i:nth-child(2) { animation-delay: .18s; }
.g8-pt-dots i:nth-child(3) { animation-delay: .36s; }
@keyframes g8-pt-dot {
  0%, 100% { opacity: .25; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-4px); }
}
.g8-pt-factcap { font-family: 'Manrope', system-ui, sans-serif; font-size: 10.5px;
  letter-spacing: .14em; text-transform: uppercase; font-weight: 700; color: ${T.graph}; }
.g8-pt-facttx { font-family: 'Manrope', system-ui, sans-serif;
  font-size: clamp(13px, 1.2vw, 16px); color: ${T.ink}; }
@media (max-height: 680px) {
  .g8-pt-expr { font-size: 26px; padding: 8px 16px; }
  .g8-pt-note { padding: 6px 12px; font-size: 13px; }
  .g8-pt-fact { padding: 8px 12px; }
}
.g8-ch { width: 100%; background: ${T.paper}; border-radius: 18px; padding: 18px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  box-shadow: 0 18px 40px -30px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.05); }
.g8-ch-seg { display: flex; gap: 6px; width: 100%; max-width: 420px; }
.g8-ch-seg i { flex: 1; height: 4px; border-radius: 2px; background: rgba(23,26,29,.12);
  transition: background .4s ease; }
.g8-ch-seg i.is-on { background: ${T.accent}; }
.g8-ch-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.g8-ch-item { display: flex; flex-direction: column; align-items: center; gap: 3px;
  min-width: 116px; padding: 10px 14px; border-radius: 14px; background: ${T.bg};
  opacity: 0; transform: translateY(8px); transition: opacity .45s ease, transform .45s ease; }
.g8-ch-item.is-on { opacity: 1; transform: none; }
.g8-ch-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 10.5px;
  letter-spacing: .1em; text-transform: uppercase; color: ${T.ink3}; }
.g8-ch-val { font-size: clamp(20px, 2vw, 27px); color: ${T.ink}; }
.g8-ch-out { font-size: clamp(15px, 1.4vw, 19px); color: ${T.tip}; font-weight: 600; }
.g8-ch-arrow { font-family: ${MATH_FONT}; font-size: 20px; color: ${T.ink4};
  opacity: 0; transition: opacity .4s ease; }
.g8-ch-arrow.is-on { opacity: 1; color: ${T.ink3}; }
.g8-ch-sum { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 1.3vw, 18px);
  font-weight: 700; color: ${T.accent}; text-align: center;
  opacity: 0; transition: opacity .5s ease; }
.g8-ch-sum.is-on { opacity: 1; }

/* ПЕРЕДАЧА ХОДА: крупный отсчёт и одна фраза. Пауза нужна, чтобы ученик
   понял — показ кончился, дальше он сам. */
.g8-ch-hand { display: flex; flex-direction: column; align-items: center; gap: 6px;
  animation: g8-ch-hand 400ms cubic-bezier(.34,1.4,.64,1) both; }
.g8-ch-handtx { font-family: 'Manrope', system-ui, sans-serif;
  font-size: clamp(15px, 1.4vw, 19px); font-weight: 700; color: ${T.ink}; }
.g8-ch-timer { font-size: clamp(30px, 3vw, 42px); color: ${T.accent}; line-height: 1;
  animation: g8-ch-tick 1s ease-in-out infinite; }
@keyframes g8-ch-hand { from { opacity: 0; transform: scale(.9); } to { opacity: 1; transform: none; } }
@keyframes g8-ch-tick { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
.g8-ch-quiz { display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; }
.g8-ch-qn { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink3}; }
.g8-ch-qopts { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; width: 100%; }
.g8-st { display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; }
.g8-st-line { display: flex; gap: 12px; justify-content: center; align-items: center; flex-wrap: wrap; }
.g8-st-sign { font-family: ${MATH_FONT}; font-size: clamp(24px, 2.4vw, 34px); color: ${T.ink2}; }
.g8-st-col { display: flex; flex-direction: column; align-items: center; gap: 6px;
  min-width: 150px; padding: 12px 16px; border-radius: 16px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.08); transition: box-shadow .25s ease; }
.g8-st-col.is-dead { box-shadow: inset 0 0 0 2px rgba(${T.tipRgb},.5); }
.g8-st-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 11.5px;
  letter-spacing: .1em; text-transform: uppercase; color: ${T.ink3}; }
.g8-st-val { font-size: clamp(28px, 2.8vw, 38px); color: ${T.ink}; }
.g8-st-col.is-dead .g8-st-val { color: ${T.tip}; }
.g8-st-btns { display: flex; gap: 8px; }
.lesson-root .g8-st-btn { border: 0; cursor: pointer; width: 46px; height: 40px; border-radius: 11px;
  background: ${T.bg}; color: ${T.ink2}; font-size: 20px; font-weight: 700;
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.08); }
.lesson-root .g8-st-btn.is-plus { background: ${T.accent}; color: #fff; box-shadow: none; }
.lesson-root .g8-st-btn:hover { transform: translateY(-1px); }
.g8-st-out { display: flex; flex-direction: column; align-items: center; gap: 6px;
  min-width: 150px; padding: 12px 16px; border-radius: 16px; background: ${T.okSoft};
  align-self: stretch; justify-content: center; }
.g8-st-out.is-dead { background: ${T.tipSoft}; }
.g8-st-outcap { font-family: 'Manrope', system-ui, sans-serif; font-size: 11px;
  letter-spacing: .1em; text-transform: uppercase; color: ${T.ink3}; }
.g8-st-outval { font-size: clamp(26px, 2.6vw, 36px); color: ${T.ok}; }
.g8-st-out.is-dead .g8-st-outval { color: ${T.tip}; }
.g8-tw { width: 100%; background: ${T.paper}; border-radius: 16px; padding: 16px 20px;
  display: flex; flex-direction: column; gap: 12px;
  box-shadow: 0 18px 40px -30px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.05); }
.g8-tw-b { display: flex; flex-direction: column; gap: 5px; padding-bottom: 12px;
  border-bottom: 1px dashed rgba(23,26,29,.14); }
.g8-tw-b:last-child { border-bottom: 0; padding-bottom: 0; }
.g8-tw-b.is-sum { background: ${T.tipSoft}; border-radius: 12px; padding: 12px 14px; border-bottom: 0; }
.g8-tw-h { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(13px, 1.2vw, 16px);
  font-weight: 700; letter-spacing: .06em; color: ${T.accent}; text-align: center; }
.g8-tw-lead { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12.5px, 1.1vw, 15px);
  color: ${T.ink2}; text-align: center; }
.g8-tw-rows { display: flex; flex-direction: column; gap: 2px; align-items: center; }
.g8-tw-row { display: flex; align-items: baseline; gap: 10px; white-space: pre;
  font-size: clamp(16px, 1.6vw, 21px); color: ${T.ink};
  visibility: hidden; clip-path: inset(0 100% 0 0); }
/* Строка ПЕЧАТАЕТСЯ: раскрывается слева направо, как будто её набирают.
   Высота при этом занята с первой секунды — карточка не растёт. */
.g8-tw-row.is-open { visibility: visible; animation: g8-tw-type 1000ms steps(30, end) both; }
@keyframes g8-tw-type { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
.g8-tw-row.tone-no span { color: ${T.tip}; }
.g8-tw-row.tone-ok span { color: ${T.ok}; }
.g8-tw-note { font-family: 'Manrope', system-ui, sans-serif; font-size: 12px;
  font-style: normal; color: ${T.ink3}; }
/* Карточка двух способов держит девять строк — на тесной высоте она не
   влезает (замер: +61 на ноутбуке 615). Там всё плотнее: меньше отступы,
   мельче строки, подписи блоков в одну линию. */
@media (max-height: 680px) {
  .g8-tw { padding: 10px 14px; gap: 7px; }
  .g8-tw-b { padding-bottom: 7px; gap: 2px; }
  .g8-tw-b.is-sum { padding: 8px 10px; }
  .g8-tw-h { font-size: 12px; }
  .g8-tw-lead { font-size: 11.5px; }
  .g8-tw-row { font-size: 15px; }
}
.g8-fs { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
.g8-fs-cell { display: flex; flex-direction: column; align-items: center; gap: 4px;
  min-width: 260px; padding: 10px 16px; border-radius: 14px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.08); transition: box-shadow .25s ease; }
.g8-fs-cell.is-full { box-shadow: inset 0 0 0 2px rgba(${T.okRgb},.35); }
.g8-fs-cell.is-risky { box-shadow: inset 0 0 0 2px rgba(${T.tipRgb},.5); }
.g8-fs-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 11.5px;
  letter-spacing: .1em; text-transform: uppercase; color: ${T.ink3}; }
.g8-fs-val { font-size: clamp(26px, 2.6vw, 36px); color: ${T.ink}; min-height: 1.1em; }
.g8-fs-cell.is-risky .g8-fs-val { color: ${T.tip}; }
.g8-fs-btns { display: flex; gap: 8px; }
.lesson-root .g8-fs-btn { border: 0; cursor: pointer; border-radius: 10px; min-height: 40px;
  padding: 0 16px; background: ${T.bg}; color: ${T.ink2};
  font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(13px, 1.2vw, 16px); font-weight: 600;
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.08); }
.lesson-root .g8-fs-btn:hover { color: ${T.ink}; transform: translateY(-1px); }
/* На тесной высоте лестница этапов идёт в одну строку: два коротких блока
   вместо двух полос (замер: +34 на ноутбуке 615). Смысл сохраняется —
   пройденный этап зелёный с галочкой, текущий подсвечен. */
@media (max-height: 680px) {
  .g8-fs-steps { flex-direction: row; gap: 8px; }
  .g8-fs-step { padding: 6px 10px; }
  .g8-fs-steptx { font-size: 12px; }
  .g8-fs-cell { padding: 6px 12px; gap: 2px; }
  .g8-fs-val { font-size: 24px; }
}
.g8-fs-steps { display: flex; flex-direction: column; gap: 6px; width: 100%; margin-bottom: 4px; }
.g8-fs-step { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 12px;
  background: ${T.paper}; opacity: .45; transition: opacity .3s ease, box-shadow .3s ease; }
.g8-fs-step.is-now { opacity: 1; box-shadow: inset 0 0 0 2px rgba(${T.accentRgb},.35); }
.g8-fs-step.is-done { opacity: 1; background: ${T.okSoft}; }
.g8-fs-stepn { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;
  color: ${T.ink3}; min-width: 14px; }
.g8-fs-steptx { flex: 1; font-family: 'Manrope', system-ui, sans-serif;
  font-size: clamp(13px, 1.2vw, 16px); color: ${T.ink}; }
.g8-fs-stepres { font-size: clamp(15px, 1.4vw, 19px); color: ${T.ok}; font-weight: 600; }
.g8-fs-bar { display: block; width: 240px; height: 3px; border-radius: 2px; background: ${T.ink}; }
.g8-cs { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; }
.g8-cs-lead { font-family: 'Manrope', system-ui, sans-serif; font-size: 12px; letter-spacing: .12em;
  text-transform: uppercase; color: ${T.ink3}; }
.g8-cs-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; width: 100%; }
.g8-cs-item { flex: 1 1 0; min-width: 132px; display: flex; flex-direction: column; align-items: center;
  gap: 2px; padding: 10px 12px; border-radius: 14px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.07); }
.g8-cs-rec { font-size: clamp(15px, 1.4vw, 19px); color: ${T.ink2}; }
.g8-cs-at { font-size: clamp(13px, 1.2vw, 15px); color: ${T.ink3}; }
.g8-cs-den { font-size: clamp(19px, 1.9vw, 24px); color: ${T.tip}; font-weight: 700; }
/* На телефоне полоса результатов встаёт в столбец и добавляет 40 пикселей —
   экран правила выходит за фолд (замер: +42 и +35). Там она сжимается в одну
   строку мелким кеглем: это НАПОМИНАНИЕ, а не третий текст экрана. */
/* Ноутбук 615: там своя теснота, и полоса сжимается так же. */
@media (max-height: 680px) {
  .g8-cs { gap: 4px; }
  .g8-cs-item { padding: 6px 10px; }
  .g8-cs-rec { font-size: 14px; }
  .g8-cs-at { font-size: 12px; }
  .g8-cs-den { font-size: 17px; }
  .g8-cs-lead { display: none; }
}
@media (max-width: 640px) {
  .g8-cs-row { gap: 6px; }
  .g8-cs-item { flex-direction: row; align-items: baseline; gap: 6px;
    min-width: 0; padding: 5px 8px; }
  .g8-cs-rec { font-size: 12px; }
  .g8-cs-at { font-size: 11px; }
  .g8-cs-den { font-size: 14px; }
  .g8-cs-lead { display: none; }
}
.g8-pb { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; width: 100%; }
.g8-pb-card { flex: 1 1 0; min-width: 150px; min-height: 96px; border: 0; cursor: pointer;
  border-radius: 16px; background: ${T.paper}; color: ${T.ink};
  font-size: clamp(19px, 1.9vw, 26px);
  box-shadow: 0 14px 34px -26px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.07);
  transition: transform .2s ease, box-shadow .2s ease; }
/* Вариант СЛОВАМИ набирается крупнее, чем вариант-формула: прозу читают
   строкой, и мелкий кегль в ней мешает сильнее, чем в записи.
   ОСТОРОЖНО: смена гарнитуры на Manrope зрительно УМЕНЬШАЕТ текст при том же
   числе — серифный 26 читался крупнее, чем Manrope 22. Кегль поднят с запасом. */
/* ПРЕФИКС .lesson-root ОБЯЗАТЕЛЕН. В обвязке стоит правило вида
   .lesson-root button с font inherit, и у него приоритет выше, чем у правила по одному
   классу: без префикса кегль кнопки сбрасывается к унаследованным 16 px,
   и любая правка размера молча не действует. */
.lesson-root .g8-pb-card { font-family: 'Manrope', system-ui, sans-serif; font-weight: 600;
  font-size: clamp(20px, 2.1vw, 29px); padding: 16px 20px; line-height: 1.3; }
.g8-pb-card:hover:not(:disabled) { transform: translateY(-3px); }
.g8-pb-card.is-ok { background: ${T.okSoft}; color: ${T.ok};
  box-shadow: inset 0 0 0 2px rgba(${T.okRgb},.5); }
.g8-pb-card.is-tip { background: ${T.tipSoft}; color: ${T.tip};
  box-shadow: inset 0 0 0 2px rgba(${T.tipRgb},.45); }
.g8-pb-card:disabled { cursor: default; }
.g8-fd-tab { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.g8-fd-cell { display: flex; flex-direction: column; align-items: center; gap: 2px;
  min-width: 58px; padding: 6px 9px; border-radius: 12px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.07); transition: background .3s ease; }
.g8-fd-cx { font-size: 13px; color: ${T.ink3}; }
.g8-fd-cv { font-size: clamp(17px, 1.7vw, 22px); color: ${T.ink}; min-height: 1.15em; line-height: 1.15; }
.g8-fd-cell.is-full { background: ${T.okSoft}; }
.g8-fd-cell.is-full .g8-fd-cv { color: ${T.ok}; }
.g8-fd-cell.is-dead { background: ${T.tipSoft}; }
.g8-fd-cell.is-dead .g8-fd-cv { color: ${T.tip}; font-weight: 700; }
.g8-fd-bet { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.g8-fd-betq { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(15px, 1.4vw, 18px);
  font-weight: 700; color: ${T.ink}; text-align: center; }
.g8-fd-betopts { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.g8-fd-betbtn { border: 0; cursor: pointer; border-radius: 12px; min-height: 54px; padding: 0 22px;
  background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope', system-ui, sans-serif;
  font-size: clamp(14px, 1.25vw, 16px); font-weight: 600;
  box-shadow: 0 10px 26px -22px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.07); }
.g8-fd-betbtn:hover { transform: translateY(-2px); }
.g8-fd-nums.is-locked { opacity: .35; pointer-events: none; }
.g8-fd-nums { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.g8-fd-btn { min-width: 74px; min-height: 74px; border: 0; cursor: pointer; border-radius: 14px;
  background: ${T.paper}; color: ${T.ink}; font-size: clamp(24px, 2.4vw, 32px);
  box-shadow: 0 10px 26px -22px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.07);
  transition: transform .2s ease, box-shadow .2s ease; }
.g8-fd-btn:hover { transform: translateY(-2px); }
.g8-fd-btn:active { transform: translateY(1px) scale(.96); }
.g8-fd-btn.is-seen { color: ${T.ink2}; background: ${T.okSoft}; }
.g8-fd-btn.is-now { box-shadow: inset 0 0 0 2px rgba(${T.accentRgb},.5); }
.g8-fd-btn.is-dead { background: ${T.tipSoft}; color: ${T.tip}; }

@media (max-height: 680px) {
  .g8-fd { gap: 16px; }
  .g8-fd-expr { min-height: 112px; }
  .g8-fd-btn { min-width: 58px; min-height: 58px; }
}
@media (max-width: 640px) {
  .g8-fd-btn { min-width: 54px; min-height: 54px; }
}

/* ====================================================================
   СБОРКА ПРАВИЛА — ПО ОБРАЗЦУ УРОКА 1 ЧЕТВЁРТОГО КЛАССА.
   Было: тонкая строка для сборки и мелкие кнопки в ряд — собирать неудобно,
   и не видно, куда класть. Стало: заметное поле сборки, крупные куски
   карточками, понятная подпись внутри поля.

   Стили лежат ЗДЕСЬ, а не в tools.jsx: этот файл подключается позже и
   перебивает его. Префикс .lesson-root обязателен — иначе правило для кнопок
   внутри урока перебьёт кегль.
   ==================================================================== */
.lesson-root .g8-rb-built {
  min-height: 92px;
  border-radius: 16px;
  background: ${T.graphSoft};
  box-shadow: inset 0 0 0 2px rgba(${T.graphRgb},.28);
  padding: 14px 16px;
  align-items: center;
  gap: 8px;
}
.lesson-root .g8-rb-empty { font-size: clamp(13px, 1.2vw, 16px); color: ${T.graph}; font-weight: 600; }
.lesson-root .g8-rb-bag { gap: 10px; justify-content: center; margin-top: 12px; }
.lesson-root .g8-rb-chip {
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: clamp(14px, 1.3vw, 18px);
  font-weight: 600;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 12px;
  background: ${T.paper};
  box-shadow: 0 10px 26px -22px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.08);
  transition: transform .18s ease, box-shadow .18s ease;
}
.lesson-root .g8-rb-chip:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 2px rgba(${T.accentRgb},.4); }
.lesson-root .g8-rb-chip.is-built { background: ${T.graphSoft}; }

/* На тесной высоте поле сборки ниже, куски компактнее: экран правила несёт
   ещё три карточки результатов сверху (замер: +3 на ноутбуке 615). */
@media (max-height: 680px) {
  .lesson-root .g8-rb-built { min-height: 70px; padding: 10px 12px; }
  .lesson-root .g8-rb-chip { min-height: 40px; padding: 0 14px; font-size: 14px; }
  .lesson-root .g8-rb-bag { margin-top: 8px; gap: 8px; }
}

/* ====================================================================
   ТРИ КАРТОЧКИ РЕЗУЛЬТАТОВ ОЖИВАЮТ. Они стояли молча, и было непонятно,
   зачем они здесь. Теперь выезжают по очереди — как три шага, которые
   ученик прошёл, — и ноль в каждой вспыхивает последним: именно он общий.
   ==================================================================== */
.lesson-root .g8-cs-item { animation: g8-cs-in 520ms cubic-bezier(.34,1.4,.64,1) both; }
.lesson-root .g8-cs-item:nth-child(1) { animation-delay: 250ms; }
.lesson-root .g8-cs-item:nth-child(2) { animation-delay: 600ms; }
.lesson-root .g8-cs-item:nth-child(3) { animation-delay: 950ms; }
@keyframes g8-cs-in { from { opacity: 0; transform: translateY(14px) scale(.94); } to { opacity: 1; transform: none; } }

.lesson-root .g8-cs-den { animation: g8-cs-zero 700ms cubic-bezier(.34,1.5,.64,1) both; }
.lesson-root .g8-cs-item:nth-child(1) .g8-cs-den { animation-delay: 900ms; }
.lesson-root .g8-cs-item:nth-child(2) .g8-cs-den { animation-delay: 1250ms; }
.lesson-root .g8-cs-item:nth-child(3) .g8-cs-den { animation-delay: 1600ms; }
@keyframes g8-cs-zero {
  0%   { opacity: 0; transform: scale(.4); }
  60%  { opacity: 1; transform: scale(1.25); }
  100% { opacity: 1; transform: scale(1); }
}

/* КАРЕТКА в поле сборки: поле ждёт ввода, как строка в редакторе. */
.lesson-root .g8-rb-empty::after {
  content: '';
  display: inline-block; width: 2px; height: 1.05em; margin-left: 7px;
  background: ${T.accent}; vertical-align: text-bottom;
  animation: g8-rb-caret 1.05s steps(1, end) infinite;
}
@keyframes g8-rb-caret { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }

/* Счёт знаменателя — промежуточный шаг: он показывает, ОТКУДА ноль. */
.lesson-root .g8-cs-calc { font-size: clamp(14px, 1.3vw, 17px); color: ${T.ink2};
  animation: g8-cs-step 480ms ease-out both; }
.lesson-root .g8-cs-item:nth-child(1) .g8-cs-calc { animation-delay: 700ms; }
.lesson-root .g8-cs-item:nth-child(2) .g8-cs-calc { animation-delay: 1050ms; }
.lesson-root .g8-cs-item:nth-child(3) .g8-cs-calc { animation-delay: 1400ms; }
@keyframes g8-cs-step { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }

/* Подстановка появляется ПОСЛЕ записи, а не вместе с ней. */
.lesson-root .g8-cs-at { animation: g8-cs-step 420ms ease-out both; }
.lesson-root .g8-cs-item:nth-child(1) .g8-cs-at { animation-delay: 500ms; }
.lesson-root .g8-cs-item:nth-child(2) .g8-cs-at { animation-delay: 850ms; }
.lesson-root .g8-cs-item:nth-child(3) .g8-cs-at { animation-delay: 1200ms; }

/* Ноль встаёт последним и с ударением: он общий у всех трёх. */
.lesson-root .g8-cs-item:nth-child(1) .g8-cs-den { animation-delay: 1150ms; }
.lesson-root .g8-cs-item:nth-child(2) .g8-cs-den { animation-delay: 1500ms; }
.lesson-root .g8-cs-item:nth-child(3) .g8-cs-den { animation-delay: 1850ms; }

/* Тёмная рамка внутри строки ответа. Поле рисовало собственную обводку
   поверх акцентной, и получалась рамка в рамке — методист показывал это
   дважды. Правило стоит ЗДЕСЬ, потому что этот файл подключается последним
   и перебивает и core.jsx, и math.jsx. */
.lesson-root .g8-input,
.lesson-root .g8-input:focus,
.lesson-root .g8-input:focus-visible {
  border: 0;
  outline: none;
  box-shadow: none;
  background: transparent;
}

.g8-dr { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.g8-dr-top { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 420px; }
.g8-dr-n { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink3}; }
.g8-dr-seg { flex: 1; display: flex; gap: 5px; }
.g8-dr-seg i { flex: 1; height: 4px; border-radius: 2px; background: rgba(23,26,29,.12);
  transition: background .35s ease; }
.g8-dr-seg i.is-on { background: ${T.ok}; }
.g8-dr-expr { font-size: clamp(28px, 2.8vw, 40px); color: ${T.ink}; padding: 10px 22px;
  border-radius: 14px; background: ${T.paper}; box-shadow: inset 0 0 0 1px rgba(23,26,29,.07); }
.g8-dr-opts { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; width: 100%; }
.g8-dr-sol { width: 100%; display: flex; flex-direction: column; gap: 6px;
  padding: 12px 16px; border-radius: 0 14px 14px 0; border-left: 4px solid ${T.ok};
  background: ${T.okSoft}; animation: g8-dr-in 420ms cubic-bezier(.22,.9,.3,1) both; }
@keyframes g8-dr-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.g8-dr-solcap { font-family: 'Manrope', system-ui, sans-serif; font-size: 12.5px;
  letter-spacing: .14em; text-transform: uppercase; font-weight: 700; color: ${T.ok}; }
.g8-dr-sollines { display: flex; flex-direction: column; gap: 5px; }
.g8-dr-solline { font-size: clamp(19px, 1.9vw, 26px); color: ${T.ink}; white-space: pre-wrap;
  animation: g8-dr-line 380ms ease-out both; }
@keyframes g8-dr-line { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
.lesson-root .g8-dr-next { align-self: flex-end; border: 0; cursor: pointer; border-radius: 11px;
  min-height: 40px; padding: 0 18px; background: ${T.ok}; color: #fff;
  font-family: 'Manrope', system-ui, sans-serif; font-size: 14px; font-weight: 700; }
@media (max-height: 680px) {
  .g8-dr { gap: 7px; }
  .g8-dr-expr { font-size: 26px; padding: 8px 16px; }
  .g8-dr-sol { padding: 8px 12px; }
  .g8-dr-solline { font-size: 17px; }
}

.g8-fl { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 14px; }
.g8-fl-lines { display: flex; flex-direction: column; gap: 8px; align-items: center;
  padding: 16px 22px; border-radius: 16px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.07); }
.g8-fl-line { display: flex; align-items: center; gap: 6px;
  font-size: clamp(20px, 2vw, 28px); color: ${T.ink}; white-space: pre; }
.g8-fl-slot { display: inline-flex; align-items: center; justify-content: center;
  min-width: 44px; height: 44px; border-radius: 10px; background: ${T.bg};
  box-shadow: inset 0 0 0 1.5px rgba(23,26,29,.12); transition: box-shadow .25s ease; }
.g8-fl-slot.is-now { box-shadow: inset 0 0 0 2.5px ${T.accent};
  animation: g8-fl-pulse 1.3s ease-in-out infinite; }
.g8-fl-slot.is-full { background: ${T.okSoft}; color: ${T.ok};
  box-shadow: inset 0 0 0 1.5px rgba(${T.okRgb},.4); }
@keyframes g8-fl-pulse { 0%, 100% { box-shadow: inset 0 0 0 2.5px ${T.accent}; }
  50% { box-shadow: inset 0 0 0 2.5px rgba(${T.accentRgb},.45); } }
.g8-fl-chips { display: flex; gap: 9px; flex-wrap: wrap; justify-content: center; }
/* ПОКАЗ: рамка пунктиром, плашка сверху, «нажатая» фишка приподнята. */
.g8-fl-badge { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(13px, 1.2vw, 16px);
  font-weight: 700; color: ${T.graph}; background: ${T.graphSoft};
  padding: 7px 16px; border-radius: 999px; }
.g8-fl-lines.is-demo { box-shadow: inset 0 0 0 2px rgba(${T.graphRgb},.3); background: ${T.bg}; }
.lesson-root .g8-fl-chip.is-press { transform: translateY(-4px) scale(1.06);
  background: ${T.accentSoft}; color: ${T.accent};
  box-shadow: inset 0 0 0 2px rgba(${T.accentRgb},.5); }
.g8-fl-hand { display: flex; gap: 12px; align-items: center; }
.lesson-root .g8-fl-self { border: 0; cursor: pointer; min-height: 44px; padding: 0 20px;
  border-radius: 12px; background: ${T.accent}; color: #fff;
  font-family: 'Manrope', system-ui, sans-serif; font-size: 14.5px; font-weight: 700; }
.lesson-root .g8-fl-chip { border: 0; cursor: pointer; min-width: 56px; min-height: 52px;
  border-radius: 12px; background: ${T.paper}; color: ${T.ink};
  font-size: clamp(19px, 1.9vw, 25px);
  box-shadow: 0 10px 26px -22px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.08); }
.lesson-root .g8-fl-chip:hover { transform: translateY(-2px); }
.lesson-root .g8-fl-chip.is-wrong { background: ${T.tipSoft}; color: ${T.tip}; }
.lesson-root .g8-fl-again { border: 0; cursor: pointer; background: transparent; color: ${T.ink3};
  font-family: 'Manrope', system-ui, sans-serif; font-size: 13.5px; font-weight: 600; }
@media (max-height: 680px) {
  .g8-fl-lines { padding: 10px 16px; gap: 5px; }
  .g8-fl-line { font-size: 19px; }
  .g8-fl-slot { min-width: 38px; height: 38px; }
  .lesson-root .g8-fl-chip { min-height: 44px; min-width: 48px; font-size: 18px; }
}

/* ВЫРАВНИВАНИЕ ПО ЗНАКУ. Строки стояли по центру, и знаки расходились
   ступенькой — запись читалась криво. Первая часть строки тянется и
   прижимается ВПРАВО, поэтому всё, что после неё, начинается с одной
   вертикали. Сетка в три колонки не годится: в строке бывает четыре части. */
.g8-fl-line { width: 100%; }
.g8-fl-line > .g8-fl-tx:first-child { flex: 1; text-align: right; }

/* КАСАНИЕ на показе — расходящееся кольцо, а не фигурка руки: нарисованная
   кисть в такой мелочи читается кляксой (то же было в 6 классе, там её
   заменили стикером). Кольцо однозначно говорит «сюда нажали». */
.g8-fl-hand-ico { position: absolute; inset: -6px; border-radius: 16px; pointer-events: none;
  box-shadow: 0 0 0 2px ${T.accent}; animation: g8-fl-tap .62s ease-out both; }
@keyframes g8-fl-tap {
  0% { transform: scale(.72); opacity: 0; }
  35% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.18); opacity: 0; }
}
.lesson-root .g8-fl-chip { position: relative; }

/* ОТМЕНА: ученик может снять последнюю клетку и поставить другое. */
.g8-fl-row { display: flex; align-items: center; gap: 10px; justify-content: center; flex-wrap: wrap; }
.lesson-root .g8-fl-undo { border: 0; cursor: pointer; min-width: 46px; min-height: 46px;
  border-radius: 12px; background: transparent; color: ${T.ink3}; font-size: 20px;
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.12); }
.lesson-root .g8-fl-undo:hover { color: ${T.ink}; }
`
