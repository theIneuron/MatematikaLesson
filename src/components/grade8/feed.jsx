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
  nums, num, den, top, bot, varName = 'x', ask, broke, predict, table, onSolved, audio,
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
      <div className={'g8-fd' + (table ? ' g8-fd-has-tab' : '')}>
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
            {it.show}
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
        {cases.map((c, i) => (
          <div key={i} className="g8-cs-item" style={{ fontFamily: MATH_FONT }}>
            <span className="g8-cs-rec">{c.rec}</span>
            <span className="g8-cs-at">{c.at}</span>
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
  font-size: clamp(20px, 2vw, 27px);
  box-shadow: 0 14px 34px -26px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.07);
  transition: transform .2s ease, box-shadow .2s ease; }
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
`
