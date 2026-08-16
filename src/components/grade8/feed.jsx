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

// Фазы: 0 — буква, 1 — число подставлено, 2 — части посчитаны, 3 — итог.
export function FeedNumber({
  nums, num, den, varName = 'x', ask, broke, predict, table, onSolved, audio,
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

  const top = phase === 0 ? null : phase === 1 ? 'sub' : 'val'
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
                {top === 'val'
                  ? <span key={'nv' + tick} className="g8-fd-pop">{fmt(num(at))}</span>
                  : (
                    <>
                      <Spot v={at} on={top === 'sub'} tick={tick} name={varName}/>
                      <span className="g8-fd-op">{' · '}</span>
                      <Spot v={at} on={top === 'sub'} tick={tick + 100} name={varName}/>
                      <span className="g8-fd-op">{' − 4'}</span>
                    </>
                  )}
              </span>
              <span className={'g8-fd-bar' + (dead && phase >= 2 ? ' is-torn' : '')} />
              <span className="g8-fd-d">
                {top === 'val'
                  ? <span key={'dv' + tick} className={'g8-fd-pop' + (dead ? ' is-zero' : '')}>{fmt(den(at))}</span>
                  : (
                    <>
                      <Spot v={at} on={top === 'sub'} tick={tick + 200} name={varName}/>
                      <span className="g8-fd-op">{' − 2'}</span>
                    </>
                  )}
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

      <Slot mh={54}>
        {found && phase === 3 ? <Note kind="no">{t(broke)}</Note> : <Ask>{t(ask || TXT.tap)}</Ask>}
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
