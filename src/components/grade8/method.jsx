// ============================================================================
// 8 КЛАСС — СПОСОБЫ И СЦЕНЫ. То, что редакция 3 эталона добавила к уроку.
//
//   MethodCard   — способ: имя, шаги. Стоит трижды: там, где вводится (шаги
//                  загораются в такт действию), рядом с практическим заданием
//                  (свёрнутая) и в итоге. Карточка ОДНА и та же, не копия.
//   SceneBand    — сцена урока. Пропорции жёсткие: хук 400 на 154, финал
//                  400 на 92, чтобы хук и итог занимали одну высоту во всех
//                  уроках класса. Сцена МАТЕМАТИЧЕСКАЯ: чертёж, график, записи.
//   SolveTogether — «решаем вместе»: образец полного решения. Строки копятся,
//                  НИЧЕГО не стирается, на двух шагах решает ученик.
//
// Контракты — ETALON_8SINF.md §4 и §6.
// ============================================================================

// eslint-disable-next-line no-unused-vars -- LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме
import React, { useState } from 'react'
import { Ask, L, MATH_FONT, Note, Slot, StepDots, T, useInstructionGate, useSfx, useT } from './core.jsx'

const TXT = {
  next: L('Keyingi qadam', 'Следующий шаг', 'Next step'),
  answer: L('Javob', 'Ответ', 'Answer'),
  no: L('mos emas', 'не годится', 'does not fit'),
}

// ============================================================
// 1. КАРТОЧКА СПОСОБА
//
// `live` — номер шага, который сейчас выполняется; шаги до него уже сделаны.
// Способ не бывает подсказкой после ошибки: карточка стоит на экране всегда,
// а не появляется в наказание (§4).
// ============================================================
export function MethodCard({ name, steps, live = -1, compact }) {
  const t = useT()

  // СВЁРНУТЫЙ ВИД — ЛЕНТОЙ, А НЕ СТОЛБЦОМ. Замер 2026-08-15: столбец из
  // четырёх шагов занимает около ста пикселей и выбивает экраны практики за
  // фолд на ноутбуке (10 и 11: +49 и +26). Лента укладывается в две строки.
  // Способ рядом с заданием обязан быть НАПОМИНАНИЕМ, а не вторым текстом.
  if (compact) {
    return (
      <div className="g8-mc is-compact">
        <span className="g8-mc-h">{t(name)}</span>
        <span className="g8-mc-strip">
          {steps.map((s, i) => (
            <span key={i} className="g8-mc-item">
              <b>{i + 1}</b>{t(s)}
            </span>
          ))}
        </span>
      </div>
    )
  }

  return (
    <div className="g8-mc">
      <div className="g8-mc-h">{t(name)}</div>
      <ol className="g8-mc-list">
        {steps.map((s, i) => (
          <li
            key={i}
            className={
              live < 0 ? '' : i < live ? 'is-done' : i === live ? 'is-live' : 'is-wait'
            }
          >
            {t(s)}
          </li>
        ))}
      </ol>
    </div>
  )
}

// ============================================================
// 2. СЦЕНА
//
// Пропорция задаётся ЗДЕСЬ, а не в уроке: иначе в каждом уроке она уедет,
// и хук с итогом перестанут занимать одинаковую высоту.
// Только фигуры: ни картинок, ни эмодзи, ни растровых файлов.
// ============================================================
// ЗНАК КОРНЯ ДЛЯ СЦЕН. Нужен в каждом уроке блока Б2, поэтому лежит в слое, а
// не переписывается в каждом файле урока. Черта РИСУЕТСЯ (pathLength="1" плюс
// класс `g8-draw`), подкоренное встаёт под неё.
//   x, y — левый нижний угол галочки, w — длина верхней черты.
// eslint-disable-next-line react-refresh/only-export-components
export const rootPath = (x, y, w) => 'M' + x + ' ' + (y + 8) + ' L' + (x + 9) + ' ' + (y + 18)
  + ' L' + (x + 22) + ' ' + (y - 18) + ' L' + (x + 22 + w) + ' ' + (y - 18)

const SCENE_VB = { hook: '0 0 400 154', final: '0 0 400 92' }

export function SceneBand({ kind = 'hook', children, label, className }) {
  const t = useT()
  return (
    <div className={'g8-scene g8-scene-' + kind + (className ? ' ' + className : '')}>
      <svg viewBox={SCENE_VB[kind] || SCENE_VB.hook} preserveAspectRatio="xMidYMid meet"
        role="img" aria-label={label ? t(label) : undefined}>
        {children}
      </svg>
    </div>
  )
}

// ============================================================
// 3. РЕШАЕМ ВМЕСТЕ
//
// Образец полного решения: запись строится строкой за строкой и ничего не
// исчезает. На шагах с `ask` ученик решает сам — без ответа решение не идёт
// дальше. В записи обязан быть НЕУДАЧНЫЙ шаг: если показывать только удачные,
// ученик на контрольной не узнает отказ (§4).
//
// Строка с `tone: 'no'` и есть тот самый отказ.
// ============================================================
export function SolveTogether({ task, lines, method, onSolved, audio, onStep }) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [open, setOpen] = useState(1)
  const [picked, setPicked] = useState({})
  const [wrong, setWrong] = useState({})
  const [note, setNote] = useState(null)

  const cur = lines[open - 1]
  const waiting = cur && cur.ask && !picked[open - 1]
  const done = open >= lines.length && !waiting

  const advance = () => {
    const nextOpen = Math.min(open + 1, lines.length)
    setOpen(nextOpen)
    setNote(null)
    if (onStep) onStep('s' + nextOpen)
    if (nextOpen >= lines.length && onSolved) {
      onSolved({ correct: true, tries: 1 })
    }
  }

  const pick = (idx, opt) => {
    const src = cur.ask.items.find((i) => i.id === opt.id)
    if (src && src.right) {
      setPicked((p) => ({ ...p, [idx]: opt.id }))
      sfx.playCorrect()
      setNote(null)
      if (cur.ask.after && audio) audio.say(t(cur.ask.after))
      return
    }
    setWrong((w) => {
      const had = w[idx] || []
      return had.indexOf(opt.id) === -1 ? { ...w, [idx]: had.concat(opt.id) } : w
    })
    setNote(src && src.hint ? src.hint : null)
    sfx.playWrong()
    if (audio && src && src.hint) audio.say(t(src.hint))
  }

  return (
    <>
      {task ? <Ask>{t(task)}</Ask> : null}

      {/* Способ НАД решением, а не сбоку: контент вертикальный (решение
          методиста 2026-08-13). Сбоку карточка забирает половину ширины и
          первая строка решения жмётся в узкую колонку. */}
      {method ? <MethodCard {...method} compact /> : null}

      {/* Высота под ВСЕ строки забронирована с первой секунды (§11): решение
          дозаполняется, а не растёт. Иначе экран прыгает на каждом шаге, и
          нижняя панель уезжает под последнюю строку. */}
      <div className="g8-sv">
        <div className="g8-sv-lines" style={{ fontFamily: MATH_FONT, minHeight: lines.length * 25 }}>
          {lines.slice(0, open).map((l, i) => (
            <div key={i} className={'g8-sv-line tone-' + (l.tone || 'plain')}>
              <span className="g8-sv-text">{typeof l.text === 'string' ? l.text : t(l.text)}</span>
              {l.note ? <span className="g8-sv-note">{t(l.note)}</span> : null}
            </div>
          ))}
        </div>
      </div>

      {/* Сколько шагов в решении и где ученик сейчас: без этого он не знает,
          впереди ещё один шаг или пять (образец — урок 1 седьмого класса). */}
      <StepDots total={lines.length} at={open - 1} />

      <Slot mh={50}>
        {waiting ? (
          <div className="g8-sv-ask">
            <Ask>{t(cur.ask.question)}</Ask>
            <div className="g8-sv-opts">
              {cur.ask.items.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  className={'g8-opt' + ((wrong[open - 1] || []).indexOf(i.id) !== -1 ? ' g8-opt-tip' : '')}
                  disabled={!canAnswer}
                  onClick={() => pick(open - 1, i)}
                >
                  {t(i.label)}
                </button>
              ))}
            </div>
          </div>
        ) : done ? null : (
          <button type="button" className="g8-sv-next" disabled={!canAnswer} onClick={advance}>
            {t(TXT.next)}
          </button>
        )}
      </Slot>

      <Slot mh={44}>
        <Note kind={done ? 'ok' : 'no'}>{note ? t(note) : null}</Note>
      </Slot>
    </>
  )
}

// ============================================================
// 4. CSS
// ВНИМАНИЕ: строка шаблонная. Обратная кавычка или обратный слэш внутри неё —
// даже в комментарии — дают белую страницу без объяснения причины.
// ============================================================
export const METHOD_STYLES = `
.g8-mc { background: ${T.paper}; border-radius: 14px; padding: 10px 12px;
  box-shadow: 0 8px 22px -18px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(${T.graphRgb},.2); }
.g8-mc-h { font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
  color: ${T.graph}; margin-bottom: 6px; }
.g8-mc-list { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 3px; }
.g8-mc-list li { font-size: 13.5px; line-height: 1.35; color: ${T.ink2}; }
.g8-mc-list li.is-done { color: ${T.ink2}; }
.g8-mc-list li.is-live { color: ${T.ink}; font-weight: 600; }
.g8-mc-list li.is-wait { color: ${T.ink3}; }
.g8-mc.is-compact { padding: 7px 10px; display: flex; flex-wrap: wrap; align-items: baseline;
  gap: 4px 10px; }
.g8-mc.is-compact .g8-mc-h { margin: 0; white-space: nowrap; }
.g8-mc-strip { display: flex; flex-wrap: wrap; gap: 3px 12px; flex: 1; min-width: 0; }
.g8-mc-item { font-size: 12.5px; line-height: 1.3; color: ${T.ink2}; }
.g8-mc-item b { display: inline-block; min-width: 13px; color: ${T.graph}; font-weight: 700; }

/* Сцена живёт в БЕЛОЙ карточке, как в уроке 1 шестого класса: на светлом поле
   без карточки чертёж висит в воздухе и не читается как объект.
   Потолок высоты задаётся в core.jsx (блок «вид как в 6 классе») — здесь его
   ставить нельзя: этот файл подключается ПОСЛЕ и перебил бы правку. */
.g8-scene { width: 100%; display: block; background: ${T.paper}; border-radius: 18px;
  padding: 10px; box-shadow: 0 18px 40px -30px rgba(${T.shadow},.9),
  inset 0 0 0 1px rgba(23,26,29,.05); }
.g8-scene svg { display: block; margin: 0 auto; }

/* РИСУЕТСЯ НА ГЛАЗАХ, А НЕ ПОЯВЛЯЕТСЯ ГОТОВЫМ — требование общего стандарта
   показа (src/books/DINAMIKA_VA_ILLUSTRATSIYA.md §2). Линия выходит из своего
   начала, и только потом встаёт то, ради чего чертёж нарисован.

   pathLength="1" на самой фигуре обязателен: он нормирует длину, и одна и та
   же анимация работает на линии любой длины. Без него dasharray пришлось бы
   считать под каждый отрезок.

   Задержку писать ВНУТРИ сокращённой записи animation: отдельный
   animation-delay рядом с animation React встречает предупреждением.

   ЗАДЕРЖКА КРУПНАЯ И ЭТО НАМЕРЕННО. Сцена монтируется РАНО — пока грузится
   страница. С задержкой в четверть секунды анимация успевала пройти до того,
   как человек вообще посмотрел на экран: замер 2026-08-15 показал линию уже
   дорисованной на 350-й мс после networkidle. Поэтому старт отодвинут почти
   на секунду, а сама отрисовка растянута. */
.g8-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: g8-draw 2000ms ease-out 900ms forwards; }
@keyframes g8-draw { to { stroke-dashoffset: 0; } }

/* Прозрачность — на РОДИТЕЛЬСКИЙ g, а не на саму фигуру: css-анимация
   перебивает атрибут opacity, и элемент останется видимым с первого кадра. */
.g8-late  { opacity: 0; transform-box: fill-box; transform-origin: center;
  animation: g8-pop-in 620ms cubic-bezier(.34,1.5,.64,1) 2900ms forwards; }
.g8-late2 { opacity: 0; transform-box: fill-box; transform-origin: center;
  animation: g8-pop-in 620ms cubic-bezier(.34,1.5,.64,1) 3500ms forwards; }
@keyframes g8-late { to { opacity: 1; } }
/* Результат не проступает, а ВЫХОДИТ: он главное на сцене, и его появление
   должно быть событием. transform-box: fill-box обязателен — без него точка
   в SVG масштабируется от угла холста и уезжает с места. */
@keyframes g8-pop-in {
  0%   { opacity: 0; transform: scale(.4); }
  100% { opacity: 1; transform: scale(1); }
}

/* ============ ДВИЖЕНИЕ СЦЕНЫ: ТРИ ИМЕНИ НА ВЕСЬ КЛАСС ============
   Решение методиста 2026-08-20: движение живёт в слое, а не в файле урока.
   Иначе к пятидесятому уроку будет пятьдесят способов подвинуть точку.
   Роль у каждого класса названа (DINAMIKA_VA_ILLUSTRATSIYA.md):
     g8-draw  — чертёж РИСУЕТСЯ (уже был выше, оставлен как есть);
     g8-fly   — объект ПРИЕЗЖАЕТ на своё место: множитель приходит в запись;
     g8-seat  — результат САДИТСЯ: точка встаёт, условие выходит.
   Задержка приходит из урока переменной --d и стоит ВНУТРИ сокращённой
   записи animation: отдельный animation-delay React встречает
   предупреждением на каждый элемент.
   Масштабом пульсировать нельзя (§11), поэтому g8-seat — однократный вход,
   а не пульсация. */
.g8-fly { opacity: 0; transform-box: fill-box; transform-origin: center;
  animation: g8-fly-in 460ms cubic-bezier(.22,.61,.36,1) var(--d, 0ms) forwards; }
@keyframes g8-fly-in {
  0%   { opacity: 0; transform: translateY(-13px); }
  100% { opacity: 1; transform: translateY(0); }
}
.g8-seat { opacity: 0; transform-box: fill-box; transform-origin: center;
  animation: g8-pop-in 480ms cubic-bezier(.34,1.5,.64,1) var(--d, 0ms) forwards; }

.g8-sv { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.g8-sv-lines { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.g8-sv-line { display: flex; align-items: baseline; gap: 10px; font-size: 17px;
  line-height: 1.45; color: ${T.ink}; animation: g8-sv-in 320ms ease both; }
/* pre-wrap, а не обычный перенос: в строке решения два уравнения разделяются
   пробелами, и обычный html их СХЛОПЫВАЕТ — «x − 3 = 0    x + 1 = 0»
   превращается в одну запись и читается как одно уравнение. */
.g8-sv-text { white-space: pre-wrap; }
.g8-sv-line.tone-no .g8-sv-text { color: ${T.tip}; }
.g8-sv-line.tone-ok .g8-sv-text { color: ${T.ok}; }
.g8-sv-note { font-family: 'Manrope', system-ui, sans-serif; font-size: 12.5px; color: ${T.ink3}; }
.g8-sv-ask { display: flex; flex-direction: column; gap: 6px; align-items: center; }
.g8-sv-opts { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.g8-sv-next { border: 0; cursor: pointer; background: rgba(${T.graphRgb},.12); color: ${T.graph};
  font-family: 'Manrope', system-ui, sans-serif; font-size: 13.5px; font-weight: 600;
  padding: 9px 18px; border-radius: 11px; }
.g8-sv-next:disabled { opacity: .5; cursor: default; }
@keyframes g8-sv-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

@media (max-width: 640px) {
  /* Контент прижат кверху (решение 2026-08-16), и центрирование больше не
     съедает лишнее — на телефоне экраны практики выходили за фолд на 8 px.
     Лента способа там плотнее: она напоминание, а не текст экрана. */
  .g8-mc.is-compact { padding: 4px 8px; gap: 2px 8px; }
  /* Шаг способа НЕ должен вылезать за рабочую зону: на 390 лента отдавала
     +3 px по горизонтали, и стенд честно считал это обрезкой (2026-08-20).
     Перенос внутри шага дешевле, чем ушедший за край текст. */
  .g8-mc-item { font-size: 11.5px; line-height: 1.25; max-width: 100%;
    overflow-wrap: anywhere; }
  .g8-mc-h { font-size: 10px; }
  .g8-sv { flex-direction: column; gap: 8px; }
  .g8-sv .g8-mc { width: 100%; }
  .g8-sv-line { font-size: 15px; }
  .g8-sv-opts { flex-direction: column; width: 100%; }
  .g8-sv-opts .g8-opt { width: 100%; }
}
`
