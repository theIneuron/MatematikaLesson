// ============================================================================
// 8 КЛАСС — ПРИБОР `FeedNumber`: УЧЕНИК САМ ЛОМАЕТ ЗАПИСЬ.
//
// На экране запись и ряд чисел. Ученик жмёт любое — машина считает и печатает
// результат. Одно из чисел останавливает машину: вместо значения прочерк и
// строка о делении на нуль.
//
// Почему так, а не спор двух приборов: ученик НАХОДИТ поломку сам, а не
// смотрит на чужой конфликт. Он выбирает число, он получает отказ, и вопрос
// «почему именно это число?» рождается у него. Хук перестаёт быть картинкой и
// становится первым действием урока.
//
// Контракт хука (ETALON_8SINF.md §5): экран принимает действие и закрывается.
// Ни разбора, ни вывода — ответ ученик добывает на экране 6 и видит на 15.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { Ask, L, MATH_FONT, Note, Row, Slot, T, fmt, useSfx, useT } from './core.jsx'

const TXT = {
  tap: L(
    "Istalgan sonni bosing: mashina hisoblaydi",
    'Нажми любое число — машина посчитает',
    'Tap any number and the machine will compute',
  ),
  waiting: L('kutmoqda', 'ждёт числа', 'waiting for a number'),
  stopped: L("mashina to'xtadi", 'машина остановилась', 'the machine stopped'),
}

export function FeedNumber({ expr, rows, ask, broke, onSolved, audio }) {
  const t = useT()
  const sfx = useSfx()
  const [at, setAt] = useState(null)
  const [seen, setSeen] = useState({})
  const [found, setFound] = useState(false)

  const cur = at === null ? null : rows.find((r) => r.x === at)
  const dead = cur ? cur.v === null : false

  const feed = (x) => {
    const row = rows.find((r) => r.x === x)
    setAt(x)
    setSeen((p) => ({ ...p, [x]: true }))
    if (row && row.v === null) {
      sfx.playWrong()
      if (!found) {
        setFound(true)
        if (audio && broke) audio.say(t(broke))
        // Хук вне оценки: `correct: null`. Прогноз — число, на котором
        // машина встала: он нужен экрану 15 для сверки.
        if (onSolved) onSolved({ correct: null, tries: 1, predicted: String(x) })
      }
      return
    }
    sfx.playCorrect()
  }

  return (
    <>
      <Row size="big" align="center">{expr}</Row>

      <div className="g8-fd">
        {/* ТАБЛО. Высота под ответ забронирована с первой секунды: экран
            дозаполняется, а не растёт (§11). */}
        <div className={'g8-fd-screen' + (dead ? ' is-dead' : '')}>
          <span className="g8-fd-in" style={{ fontFamily: MATH_FONT }}>
            {at === null ? '' : 'x = ' + fmt(at)}
          </span>
          <span className="g8-fd-out" style={{ fontFamily: MATH_FONT }}>
            {at === null ? t(TXT.waiting) : dead ? '—' : fmt(cur.v)}
          </span>
        </div>

        <div className="g8-fd-nums">
          {rows.map((r) => (
            <button
              key={r.x}
              type="button"
              className={'g8-fd-btn'
                + (at === r.x ? ' is-now' : '')
                + (seen[r.x] && r.v === null ? ' is-dead' : seen[r.x] ? ' is-seen' : '')}
              style={{ fontFamily: MATH_FONT }}
              onClick={() => feed(r.x)}
            >
              {fmt(r.x)}
            </button>
          ))}
        </div>
      </div>

      <Slot mh={54}>
        {found ? (
          <Note kind="no">{t(broke)}</Note>
        ) : (
          <Ask>{t(ask || TXT.tap)}</Ask>
        )}
      </Slot>
    </>
  )
}

// ============================================================
// CSS. ВНИМАНИЕ: строка шаблонная — обратная кавычка или обратный слэш
// внутри неё, даже в комментарии, дают белую страницу.
// ============================================================
export const FEED_STYLES = `
.g8-fd { display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%;
  flex: 1 1 auto; justify-content: center; min-height: 0; }

.g8-fd-screen { display: flex; align-items: center; justify-content: center; gap: 22px;
  min-width: 420px; min-height: 128px; padding: 18px 34px; border-radius: 18px;
  background: ${T.paper}; box-shadow: 0 18px 40px -30px rgba(${T.shadow},.9),
  inset 0 0 0 1px rgba(23,26,29,.06); transition: box-shadow .3s ease; }
.g8-fd-screen.is-dead { box-shadow: 0 18px 40px -30px rgba(${T.tipRgb},.8),
  inset 0 0 0 2px rgba(${T.tipRgb},.45); }
.g8-fd-in { font-size: clamp(22px, 2.2vw, 30px); color: ${T.ink2}; min-width: 74px; text-align: right; }
.g8-fd-out { font-size: clamp(38px, 4.4vw, 62px); color: ${T.ink}; min-width: 92px; text-align: left; }
.g8-fd-screen.is-dead .g8-fd-out { color: ${T.tip}; }

.g8-fd-nums { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.g8-fd-btn { min-width: 74px; min-height: 74px; border: 0; cursor: pointer; border-radius: 14px;
  background: ${T.paper}; color: ${T.ink}; font-size: clamp(24px, 2.4vw, 32px);
  box-shadow: 0 10px 26px -22px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.07);
  transition: transform .2s ease, box-shadow .2s ease; }
.g8-fd-btn:hover { transform: translateY(-2px); }
.g8-fd-btn.is-seen { color: ${T.ink2}; background: ${T.okSoft}; }
.g8-fd-btn.is-now { box-shadow: inset 0 0 0 2px rgba(${T.accentRgb},.5); }
.g8-fd-btn.is-dead { background: ${T.tipSoft}; color: ${T.tip}; }

@media (max-height: 680px) {
  .g8-fd-screen { min-height: 78px; padding: 10px 22px; }
  .g8-fd-btn { min-width: 54px; min-height: 54px; }
}
@media (max-width: 640px) {
  .g8-fd-screen { min-width: 0; width: 100%; gap: 12px; }
  .g8-fd-btn { min-width: 52px; min-height: 52px; }
}
`
