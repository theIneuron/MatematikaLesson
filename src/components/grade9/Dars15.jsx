// ============================================================================
// 9-sinf, Dars 15. ORALIQLAR USULI.  (Метод интервалов)
//
// PILOT dars: `PODXOD_9SINF.md` bo'yicha 9-sinfning birinchi darsi.
// Bu faylda FAQAT MA'LUMOT bor. Mexanika: `./tools.jsx` (1-asbob) va
// `../shared/lesson-tools.jsx` (mayda asboblar). Yadro `../shared/lesson-core.jsx`.
//
// Skelet:  src/books/grade9/DARS15_SKELET.md   (tasdiq 2026-08-06)
// Kontent: src/books/grade9/DARS15_CONTENT.md  (tasdiq 2026-08-06)
// Kontrakt: src/books/grade9/ETALON_9SINF.md
//
// Tuzilishi (metodist qarori 2026-08-06, 15 slayd):
//   1      xuk
//   2-8    tushuntirish, 8-slayd QOIDA
//   9-14   mashq, 13 masala, 14 final
//   15     yakun
//
// Darslik asosi dosloven: Алгебра 9 (RU), §8 «Метод интервалов», 32-35-betlar.
// Uchta masala tushuntirishni ko'taradi: 1-masala (32-bet), 2-masala va
// 3-masala (34-bet). 10-slayd 70-mashqdan (35-bet). 13-slayd §6 1-masalasi
// naqshida (24-bet).
//
// Ovoz: erkak (metodist qarori 2026-08-06). `freeNav` ishlab chiqishda true.
// `import React` SHART: LMS xom jsx ni KLASSIK rejimda yuklaydi.
// ============================================================================
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Btn,
  DoneRow,
  Expr,
  Feedback,
  Hint,
  L,
  LangProvider,
  RuleCard,
  STYLES,
  Slot,
  Stage,
  Title,
  configureLesson,
  getFreeNav,
  tr,
  useAdvanceGate,
  useAudio,
  useInstructionGate,
  useMobileZoom,
  useT,
} from '../shared/lesson-core.jsx'
import { AuditRows, Probe, ProbeChain, RuleGate, SlotFill } from '../shared/lesson-tools.jsx'
import { AXIS_STYLES, AxisStill, LiveProduct, ParabolaAxis, SignAxis } from './tools.jsx'

const LESSON_ID = 'mat_9_15'
const LESSON_TITLE = L('Oraliqlar usuli', 'Метод интервалов', 'The interval method')
const TOTAL = 15

// Ovoz bo'laklari. `on: 'mount'` -- ekran ochilganda, `on: '<nom>'` -- shu nomli
// qadam bajarilganda, `on: '+'` -- oldingi bo'lak tugagach darhol.
//
// Ovoz TAYMER bilan emas, o'quvchining QADAMI bilan boradi: asbob har ochilish
// qadamida `onStep(nom)` chaqiradi, dars esa shu nomdagi bo'lakni uyg'otadi.
// Bitta qadamga bir nechta fikr kerak bo'lsa, ular `+` bilan zanjir bo'ladi --
// baribir har fikr ALOHIDA bo'lak (ETALON: bir bo'lak = bir fikr).
const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

// Ochilish bo'laklari O'ZI ketadi, savol bo'laklari JAVOBNI kutadi.
//   iv1.. line2.. sign, sign1..  -> `after_previous`, ya'ni o'zi aytiladi;
//     asbob ularning `id` sini ko'rib holatini ochadi (`useRevealClock`).
//   qolgan nomlar                -> `on_event`, ya'ni zanjir SHU YERDA to'xtaydi
//     va o'quvchi javob bergach davom etadi.
const AUTO_SEG = /^(iv\d+|line\d+|sign\d*)$/

const buildSegments = (list, lang) =>
  list.map((s, i) => {
    const named = s.on !== 'mount' && s.on !== '+'
    const auto = named && AUTO_SEG.test(s.on)
    return {
      id: named ? s.on : 'a' + i,
      text: tr(s.text, lang),
      trigger:
        s.on === 'mount'
          ? (i === 0 ? 'on_mount' : 'after_previous')
          : s.on === '+' || auto
            ? 'after_previous'
            : 'on_event:' + s.on,
      waits_for: null,
    }
  })

const UI = {
  next: L('Davom etish', 'Продолжить', 'Continue'),
  back: L('Orqaga', 'Назад', 'Back'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish the lesson'),
  saved: L('Natija saqlandi', 'Результат сохранён', 'Result saved'),
  plusWord: L('Musbat', 'Плюс', 'Positive'),
  minusWord: L('Manfiy', 'Минус', 'Negative'),
  goOn: L('Davom', 'Дальше', 'Go on'),
  round: L('Raund', 'Раунд', 'Round'),
}

// ============================================================
// Umumiy ramka: sarlavha, qulf, navigatsiya.
// ============================================================
function Frame({ meta, screen, audio, solved, onPrev, onNext, onFinish, finished, children }) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  const nav = (
    <>
      <Btn tone="ghost" onClick={onPrev} disabled={screen === 0}>{t(UI.back)}</Btn>
      {last ? (
        <Btn tone="accent" onClick={onFinish} disabled={finished}>
          {finished ? t(UI.saved) : t(UI.finish)}
        </Btn>
      ) : (
        <Btn onClick={onNext} disabled={!canNext} ready={canNext}>{t(UI.next)}</Btn>
      )}
    </>
  )
  return (
    <Stage eyebrow={t(meta.eyebrow)} screen={screen} total={TOTAL} audio={audio} nav={nav}>
      <Title>{t(meta.title)}</Title>
      {children}
    </Stage>
  )
}

// ============================================================
// SLAYD 1. XUK. Ikki o'quvchi, ikki xil javob. BAHOLANMAYDI:
// bu tushuntirishdan OLDINGI taxmin, 15-slaydda unga qaytamiz.
// ============================================================
const S1 = {
  eyebrow: L('ORALIQLAR USULI', 'МЕТОД ИНТЕРВАЛОВ', 'THE INTERVAL METHOD'),
  title: L(
    'Ikki o\'quvchi bitta tengsizlikni yechdi',
    'Два ученика решили одно неравенство',
    'Two students solved the same inequality',
  ),
  expr: '(x − 1)(x − 3) > 0',
  motive: L(
    "Ikkisi ham DTM topshiradi. Unda bunday javob to'liq hisobga olinadi yoki umuman olinmaydi. Yarmi bo'lmaydi.",
    'Оба сдают ДТМ. Там такой ответ засчитывают целиком или не засчитывают вовсе. Половины не бывает.',
    'Both are taking the DTM exam. There an answer like this counts fully or not at all. There is no half credit.',
  ),
  cards: [
    { id: 'd', name: L('Dilshod', 'Дилшод', 'Dilshod'), value: 'x > 3', btn: L('Dilshodning javobi', 'Ответ Дилшода', "Dilshod's answer") },
    { id: 'n', name: L('Nilufar', 'Нилуфар', 'Nilufar'), value: 'x < 1  yoki  x > 3', btn: L('Nilufarning javobi', 'Ответ Нилуфар', "Nilufar's answer") },
  ],
  probe: {
    question: L('Kimning javobi to\'g\'ri?', 'Чей ответ верный?', 'Whose answer is correct?'),
    items: [
      {
        id: 'a',
        label: 'x > 3',
        hint: L(
          "Bu Dilshodning javobi. Bitta bo'lak. Dars oxirigacha yodda tuting, biz unga qaytamiz.",
          'Это ответ Дилшода. Один кусок. Держи его в голове до конца урока, мы к нему вернёмся.',
          "That is Dilshod's answer. One piece. Keep it in mind until the end of the lesson, we will come back to it.",
        ),
      },
      {
        id: 'b',
        label: 'x < 1  yoki  x > 3',
        hint: L(
          'Tanlovingiz yozib olindi. Dars oxirida tekshiramiz.',
          'Запомнил твой выбор. Проверим его в конце урока.',
          'Your choice is saved. We will check it at the end of the lesson.',
        ),
      },
      {
        id: 'c',
        label: '1 < x < 3',
        hint: L(
          'Siz ildizlar orasidagi bo\'lakni oldingiz. Buni ham son bilan tekshiramiz.',
          'Ты взял то, что между корнями. Тоже проверим числом.',
          'You picked what lies between the roots. We will check that with a number too.',
        ),
      },
      {
        id: 'd',
        label: 'x > 1',
        hint: L(
          "Siz kichik ildizni olib, o'ngga qarab ketdingiz. Yodda tuting, qaytamiz.",
          'Ты взял меньший корень и пошёл вправо. Держи в голове, вернёмся.',
          'You took the smaller root and went right. Keep it in mind, we will come back.',
        ),
      },
    ],
  },
  audio: [
    A('mount', 'Ikki o\'quvchi bitta tengsizlikni yechdi.', 'Два ученика решили одно и то же неравенство.', 'Two students solved the same inequality.'),
    A('mount', "Iks minus bir, iks minus uch, ko'paytmasi noldan katta.", 'Икс минус один, умножить на икс минус три, больше нуля.', 'Ex minus one, times ex minus three, is greater than zero.'),
    A('c1', 'Javoblari boshqacha. Biri bitta bo\'lak yozdi, ikkinchisi ikkita yozdi.', 'Ответы у них разные. Один написал один кусок, другая написала два.', 'Their answers differ. One wrote a single piece, the other wrote two.'),
    A('c2', "Ikkisi ham DTMga tayyorlanmoqda. Unda bunday javobga yo to'liq ball, yo nol.", 'Оба готовятся к ДТМ. Там за такой ответ либо полный балл, либо ноль.', 'Both are preparing for the DTM exam. There such an answer gets full marks or nothing.'),
    A('ask', 'Sizningcha, kimning javobi to\'g\'ri? Hozir bu faqat taxmin, va bu normal.', 'Как думаешь, чей ответ верный? Сейчас это только догадка, и это нормально.', 'Which answer do you think is correct? Right now this is only a guess, and that is fine.'),
  ],
}

function Screen1({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S1.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const gate = useInstructionGate(audio)
  const [open, setOpen] = useState(0)
  const [picked, setPicked] = useState(null)

  const reveal = () => {
    const next = open + 1
    setOpen(next)
    audio.step('c' + next)
    if (next === S1.cards.length) audio.step('ask')
  }

  return (
    <Frame meta={S1} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <Expr size="mid">{S1.expr}</Expr>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8 }}>
        {S1.cards.map((card, i) => (
          <div key={card.id} className="lc-card" style={{ minHeight: 44, padding: '5px 10px' }}>
            <span className="lc-card-name">{t(card.name)}</span>
            {i < open ? (
              <span className="lc-expr lc-expr-row lc-in">{card.value}</span>
            ) : (
              <span className="lc-expr lc-expr-row lc-dim">?</span>
            )}
          </div>
        ))}
      </div>
      <Slot mh={42}>
        {open < S1.cards.length ? (
          <Btn tone="soft" ready={gate} disabled={!gate} onClick={reveal}>{t(S1.cards[open].btn)}</Btn>
        ) : (
          <Hint>{t(S1.motive)}</Hint>
        )}
      </Slot>
      {open >= S1.cards.length ? (
        <div className="lc-in lc-d1">
          <Probe
            audio={audio}
            data={S1.probe}
            cols={2}
            unscored
            disabled={!gate}
            fbSlot={70}
            onSolved={(r) => { setPicked(r.picked); onAnswer({ ...r, screen, forecast: r.picked }) }}
          />
        </div>
      ) : null}
    </Frame>
  )
}

// ============================================================
// SLAYD 2. TAYANCH. Butun usul shu bitta savolga tayanadi.
// Baholanmaydi. Javob ikki bo'lak bo'lishining KALITI shu yerda.
// ============================================================
const S2 = {
  eyebrow: L('ESLAYMIZ', 'ВСПОМНИМ', 'RECALL'),
  title: L("Ikki sonning ko'paytmasi musbat", 'Произведение двух чисел положительно', 'The product of two numbers is positive'),
  probe: {
    question: L('Ularning ishoralari haqida nima deyish mumkin?', 'Что можно сказать об их знаках?', 'What can be said about their signs?'),
    ok: L(
      "To'g'ri. Buni yodda tuting. Aynan shuning uchun bugun javobda ikkita bo'lak bo'ladi, bitta emas.",
      'Верно. Запомни это. Именно поэтому у ответа сегодня будет два куска, а не один.',
      "Correct. Remember this. That is exactly why today's answer will have two pieces, not one.",
    ),
    items: [
      {
        id: 'a',
        label: L('ikkisi ham musbat', 'оба положительны', 'both are positive'),
        hint: L(
          "Bunday bo'ladi. Lekin minus uchni minus ikkiga ko'paytirib, ishoraga qarang.",
          'Так бывает. Но попробуй минус три умножить на минус два и посмотри на знак.',
          'That happens. But multiply minus three by minus two and look at the sign.',
        ),
      },
      {
        id: 'b',
        label: L('ikkisi ham manfiy', 'оба отрицательны', 'both are negative'),
        hint: L(
          "Bunday ham bo'ladi. Demak, holatlar bittadan ko'p.",
          'И так бывает. Значит случаев больше, чем один.',
          'That happens too. So there is more than one case.',
        ),
      },
      {
        id: 'c',
        correct: true,
        label: L('ikkisi ham musbat yoki ikkisi ham manfiy', 'оба положительны или оба отрицательны', 'both positive or both negative'),
      },
      {
        id: 'd',
        label: L('biri musbat, ikkinchisi manfiy', 'один положителен, другой отрицателен', 'one positive, the other negative'),
        hint: L(
          "Unda ko'paytma manfiy bo'lardi. Minus musbatga ko'paytirilsa, minus chiqadi.",
          'Тогда произведение было бы отрицательным. Минус на плюс даёт минус.',
          'Then the product would be negative. Minus times plus gives minus.',
        ),
      },
    ],
  },
  audio: [
    A('mount', 'Tengsizlikni olishdan oldin ishoralar haqida bir narsani eslaymiz.', 'Прежде чем брать неравенство, вспомним одну вещь про знаки.', 'Before we take on the inequality, let us recall one thing about signs.'),
    A('mount', "Ikki sonning ko'paytmasi musbat chiqdi.", 'Произведение двух чисел получилось положительным.', 'The product of two numbers came out positive.'),
    A('mount', "O'ylab ko'ring, bu ikki son qanday bo'lishi mumkin. Holat bitta bo'lmasligi mumkin.", 'Подумай, какими могли быть эти два числа. Случай может быть не один.', 'Think about what those two numbers could be. There may be more than one case.'),
    A('ok', "Buni yodda tuting. Bir necha ekrandan keyin bundan javobning ikki bo'lagi qanday chiqishini ko'rasiz.", 'Держи это в голове. Через несколько экранов ты увидишь, как из этого получаются два куска ответа.', 'Keep this in mind. In a few screens you will see how two pieces of the answer come out of it.'),
  ],
}

function Screen2({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S2.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const gate = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S2} screen={screen} audio={audio} solved={done} {...rest}>
      <Probe
        audio={audio}
        data={S2.probe}
        cols={1}
        minH={44}
        disabled={!gate}
        onSolved={(r) => { setDone(true); audio.step('ok'); onAnswer({ ...r, screen }) }}
      />
    </Frame>
  )
}

// ============================================================
// SLAYD 3. Ildizlar o'qni QISMLARGA BO'LADI. Darslik 32-bet, 1-masala.
// Ikki qadam: ko'paytuvchilarga ajratish, keyin ildizlarni o'qqa qo'yish.
// Nuqtalar OCHIQ: tengsizlik qat'iy (ETALON §1 talab 5).
// ============================================================
const S3 = {
  eyebrow: L('AJRATAMIZ', 'РАЗБИРАЕМ', 'BREAKING IT DOWN'),
  title: L('Bu uchhad qayerda musbat, qayerda manfiy', 'Где этот трёхчлен положителен, а где отрицателен', 'Where this trinomial is positive and where negative'),
  expr: 'x² − 4x + 3',
  probe: {
    question: L('Ko\'paytuvchilarga ajrating', 'Разложи на множители', 'Factor it'),
    ok: L("To'g'ri. Endi ildizlarni o'qqa qo'ying.", 'Верно. Теперь поставь корни на ось.', 'Correct. Now place the roots on the axis.'),
    items: [
      { id: 'a', label: '(x − 1)(x − 3)', correct: true },
      {
        id: 'b',
        label: '(x + 1)(x + 3)',
        hint: L(
          "Qavslarni oching. O'rta had musbat chiqadi, kerakligi esa manfiy.",
          'Раскрой обратно. Средний член выйдет с плюсом, а нужен с минусом.',
          'Expand it back. The middle term comes out plus, but we need minus.',
        ),
      },
      {
        id: 'c',
        label: '(x − 1)(x + 3)',
        hint: L(
          'Qavslarni oching. Ozod had minus uch chiqadi, kerakligi esa musbat uch.',
          'Раскрой обратно. Свободный член выйдет минус три, а нужен плюс три.',
          'Expand it back. The constant term comes out minus three, but we need plus three.',
        ),
      },
      {
        id: 'd',
        label: '(x − 2)(x − 2)',
        hint: L(
          "Qavslarni oching. Ozod had to'rt chiqadi, kerakligi esa uch.",
          'Раскрой обратно. Свободный член выйдет четыре, а нужен три.',
          'Expand it back. The constant term comes out four, but we need three.',
        ),
      },
    ],
  },
  axis: {
    expr: '(x − 1)(x − 3) > 0',
    from: -1,
    to: 5,
    roots: [{ at: 1, filled: false }, { at: 3, filled: false }],
    candidates: [
      { v: 1, ok: true },
      { v: 3, ok: true },
      {
        v: -1,
        hint: L(
          "Ildiz ko'paytuvchini nolga aylantiradi. Iks minus bir nolga teng bo'ladi, qachonki iks bir bo'lsa.",
          'Корень обращает множитель в нуль. Икс минус один равен нулю, когда икс равен одному.',
          'A root makes a factor zero. Ex minus one is zero when ex equals one.',
        ),
      },
      {
        v: 4,
        hint: L(
          "To'rtda hech qaysi ko'paytuvchi nolga aylanmaydi. Tekshirib ko'ring.",
          'В четвёрке ни один множитель в нуль не обращается. Проверь.',
          'At four neither factor becomes zero. Check it.',
        ),
      },
    ],
    texts: {
      place: L("Ildizlarni o'qqa qo'ying", 'Поставь корни на ось', 'Place the roots on the axis'),
    },
  },
  after: L('Uchta bo\'lak. Darslik ularni oraliqlar deb ataydi.', 'Три промежутка. Учебник называет их интервалами.', 'Three pieces. The textbook calls them intervals.'),
  audio: [
    A('mount', "Iks kvadrat minus to'rt iks qo'shuv uch uchhadini olamiz.", 'Возьмём трёхчлен икс в квадрате минус четыре икс плюс три.', 'Take the trinomial ex squared minus four ex plus three.'),
    A('+', 'Darslikning savoli shunday. Qanday iks larda u musbat, qandaylarida manfiy.', 'Вопрос учебника такой. При каких икс он положителен, а при каких отрицателен.', 'The textbook asks this. For which ex is it positive, and for which negative.'),
    A('+', "Uni ko'paytuvchilarga ajratishdan boshlaymiz.", 'Начнём с того, что разложим его на множители.', 'Let us start by factoring it.'),
    A('factored', "Endi ildizlarni topamiz. Har bir ko'paytuvchi o'z nuqtasida nolga aylanadi.", 'Теперь найдём корни. Каждый множитель обращается в нуль в своей точке.', 'Now let us find the roots. Each factor becomes zero at its own point.'),
    A('+', "Bu nuqtalarni sonlar o'qiga qo'ying.", 'Поставь эти точки на числовую ось.', 'Place these points on the number line.'),
    A('root1', "Birinchi nuqta. E'tibor bering, u ochiq, ichi bo'yalmagan.", 'Первая точка. Обрати внимание, она пустая внутри, не закрашена.', 'The first point. Note that it is hollow inside, not filled.'),
    A('+', "Tengsizlik qat'iy, shuning uchun nuqtaning o'zi javobga kirmaydi.", 'Неравенство строгое, поэтому сама точка в ответ не войдёт.', 'The inequality is strict, so the point itself will not be in the answer.'),
    A('root2', 'Ikkinchi nuqta ham ochiq.', 'Вторая точка тоже пустая.', 'The second point is hollow as well.'),
    A('+', "Endi ko'ramiz, o'q qanday bo'laklarga bo'lindi.", 'Теперь посмотрим, на какие части разрезалась ось.', 'Now let us see what pieces the axis is cut into.'),
    A('iv1', "Birinchi bo'lak. Birdan chapda yotgan hamma sonlar.", 'Первый кусок. Все числа левее единицы.', 'The first piece. All numbers to the left of one.'),
    A('iv2', "Ikkinchi bo'lak. Bir bilan uch orasi.", 'Второй кусок. То, что между единицей и тройкой.', 'The second piece. What lies between one and three.'),
    A('iv3', "Uchinchi bo'lak. Uchdan o'ngda.", 'Третий кусок. Правее тройки.', 'The third piece. To the right of three.'),
    A('+', "Uchta bo'lak. Darslik bunday bo'laklarni oraliqlar deb ataydi.", 'Три части. Учебник называет такие части интервалами.', 'Three pieces. The textbook calls such pieces intervals.'),
    A('+', "Ildizlar hali javob emas. Ular faqat o'qni bo'ldi. Javob ular orasidagi bo'laklarda yashaydi.", 'Корни это ещё не ответ. Они только разрезали ось. Ответ живёт на кусках между ними.', 'The roots are not the answer yet. They only cut the axis. The answer lives on the pieces between them.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S3.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const gate = useInstructionGate(audio)
  const [factored, setFactored] = useState(false)
  const [done, setDone] = useState(false)

  return (
    <Frame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      {!factored ? (
        <>
          <Expr size="big">{S3.expr}</Expr>
          <Probe
            audio={audio}
            data={S3.probe}
            cols={2}
            disabled={!gate}
            onSolved={(r) => { setFactored(true); audio.step('factored'); onAnswer({ ...r, screen }) }}
          />
        </>
      ) : (
        <>
          <SignAxis
            {...S3.axis}
            phases={['place']}
            revealIntervals
            audio={audio}
            onStep={(p) => { audio.step(p); if (p === 'done') setDone(true) }}
            onSolved={() => {}}
          />
          <Slot mh={30}>{done ? <Hint>{t(S3.after)}</Hint> : null}</Slot>
        </>
      )}
    </Frame>
  )
}

// ============================================================
// SLAYD 4. Eng o'ngdagi oraliq ishorasi SON QO'YIB hisoblanadi.
// Darslik 33-bet: «pri x > 3 oba mnojitelya polojitelny».
// ETALON §1 talab 3: razbor SON bilan isbotlaydi.
// ============================================================
const S4 = {
  eyebrow: L('ISHORANI HISOBLAYMIZ', 'СЧИТАЕМ ЗНАК', 'COMPUTING THE SIGN'),
  title: L('Uchdan o\'ngdagi sonni oling', 'Возьми число справа от тройки', 'Take a number to the right of three'),
  axis: {
    expr: '(x − 1)(x − 3) > 0',
    from: -1,
    to: 5,
    roots: [{ at: 1, filled: false }, { at: 3, filled: false }],
    witness: {
      interval: 2,
      sign: '+',
      signWord: L('Musbat', 'Плюс', 'Positive'),
      lines: ['x = 4', '(4 − 1)(4 − 3) = 3 · 1 = 3'],
      options: [
        { id: 'a', v: 4, ok: true },
        { id: 'b', v: 10, ok: true },
        {
          id: 'c',
          v: 0,
          hint: L(
            "Nol birdan chapda. Bu boshqa oraliq. Uchdan o'ngdagi sonni oling.",
            'Ноль лежит левее единицы. Это другой промежуток. Возьми число правее тройки.',
            'Zero lies to the left of one. That is a different interval. Take a number to the right of three.',
          ),
        },
        {
          id: 'd',
          v: 2,
          hint: L(
            "Ikki ildizlar orasida. Bu oraliqni keyingi qadamda ko'ramiz.",
            'Двойка между корнями. Этот промежуток разберём следующим.',
            'Two is between the roots. We will handle that interval next.',
          ),
        },
      ],
    },
    texts: {
      witness: L("Qaysi sonni o'rniga qo'yamiz?", 'Какое число подставим?', 'Which number shall we substitute?'),
      witnessOk: L(
        "Uch musbat son. Demak, bu oraliqning hammasida ikki ko'paytuvchi ham musbat.",
        'Три это положительное число. На всём этом промежутке оба множителя положительны.',
        'Three is a positive number. On this whole interval both factors are positive.',
      ),
      goOn: L('Davom', 'Дальше', 'Go on'),
    },
  },
  audio: [
    A('mount', 'Oraliq ishorasini eslamaymiz. Uni hisoblaymiz.', 'Знак промежутка мы не будем вспоминать. Мы его посчитаем.', 'We are not going to recall the sign of an interval. We will compute it.'),
    A('+', "O'ng oraliqdan, ya'ni uchdan o'ngdan istalgan sonni oling.", 'Возьми любое число из правого промежутка, то есть правее тройки.', 'Take any number from the right interval, that is, to the right of three.'),
    A('sub', "Sonni qo'ydik. Endi qavslarni hisoblaymiz.", 'Число подставили. Теперь посчитаем скобки.', 'The number is substituted. Now let us compute the brackets.'),
    A('line2', "To'rt minus bir uchga teng. To'rt minus uch birga teng. Uchni birga ko'paytirsak, uch chiqadi.", 'Четыре минус один это три. Четыре минус три это один. Три умножить на один это три.', 'Four minus one is three. Four minus three is one. Three times one is three.'),
    A('sign', 'Uch musbat son. Demak, bu oraliqda musbat turadi.', 'Три это положительное число. Значит на этом промежутке стоит плюс.', 'Three is a positive number. So this interval carries a plus.'),
    A('+', "Darslik ham shunday tushuntiradi. Uchdan o'ngda ikki ko'paytuvchi ham musbat, shuning uchun ko'paytma ham musbat.", 'Учебник объясняет это так же. Правее тройки оба множителя положительны, поэтому и произведение положительно.', 'The textbook explains it the same way. To the right of three both factors are positive, so the product is positive.'),
    A('+', "Bu usulni yodda tuting. Butun yil davomida va imtihonda ham o'zingizni shu bilan tekshirasiz.", 'Запомни этот приём. Им ты будешь проверять себя весь год, и на экзамене тоже.', 'Remember this move. You will use it to check yourself all year, and in the exam too.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S4.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
      <SignAxis
        {...S4.axis}
        phases={['witness']}
        audio={audio}
        onStep={(p) => audio.step(p)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen }) }}
      />
    </Frame>
  )
}

// ============================================================
// SLAYD 5. NAMUNA SLAYD (metodist qarori 2026-08-06).
//
// Bu slaydda o'quvchi JAVOB BERMAYDI -- u BOSHQARADI. O'qdagi nuqtani
// tortadi va ishoraning nima uchun ag'darilishini O'Z QO'LI bilan ko'radi:
// ildizdan o'tganda ko'paytuvchi chipi rangini o'zgartiradi, ko'paytma esa
// ishorasini. Variantli savol yo'q -- u test slaydlariga ko'chdi.
//
// Darslik 33-bet obosnovaniyesi shu yerda KO'RINADI, aytilmaydi: nuqtadan
// o'tganda BITTA ko'paytuvchi ishorasini o'zgartiradi.
//
// Balandlik nafas oladi: izoh chiqqanda grafik siqiladi (288 -> 224).
// ============================================================
const S5 = {
  eyebrow: L('ASOSIY', 'ГЛАВНОЕ', 'THE KEY IDEA'),
  title: L(
    "Nuqtani tortib ko'ring: ishora qachon ag'dariladi",
    'Потяни точку: когда переворачивается знак',
    'Drag the point: when does the sign flip',
  ),
  expr: '(x − 1)(x − 3)',
  from: -1.4,
  to: 5.4,
  yFrom: -2.4,
  yTo: 8.6,
  startX: 4.4,
  f: (v) => (v - 1) * (v - 3),
  factors: [
    { label: 'x − 1', f: (v) => v - 1 },
    { label: 'x − 3', f: (v) => v - 3 },
  ],
  roots: [{ at: 1, filled: false }, { at: 3, filled: false }],
  dragHint: L(
    "Nuqtani chapga tortib boring",
    'Тяни точку влево',
    'Drag the point to the left',
  ),
  notes: {
    c3: L(
      "Uchdan o'tdingiz. Iks minus uch manfiy bo'ldi, iks minus bir esa musbat qoldi. Bitta o'zgardi, ko'paytma ag'darildi.",
      'Ты прошёл через тройку. Икс минус три стал отрицательным, а икс минус один остался положительным. Изменился один, произведение перевернулось.',
      'You crossed three. Ex minus three became negative, while ex minus one stayed positive. One changed, so the product flipped.',
    ),
    c1: L(
      "Birdan o'tdingiz. Endi iks minus bir manfiy, iks minus uch ham manfiy. Yana bitta o'zgardi, yana ag'darildi.",
      'Ты прошёл через единицу. Теперь икс минус один отрицателен, и икс минус три тоже. Снова изменился один, снова переворот.',
      'You crossed one. Now ex minus one is negative, and so is ex minus three. Again one changed, again a flip.',
    ),
    done: L(
      "Musbat ikki bo'lakda. Javob: iks birdan kichik yoki iks uchdan katta.",
      'Плюс на двух кусках. Ответ: икс меньше единицы или икс больше трёх.',
      'Positive on two pieces. The answer: ex less than one, or ex greater than three.',
    ),
  },
  answer: L('x < 1   yoki   x > 3', 'x < 1   или   x > 3', 'x < 1   or   x > 3'),
  audio: [
    A('mount', "Nuqta uchdan o'ngda turadi. Ikki ko'paytuvchi ham musbat, shuning uchun ko'paytma musbat.", 'Точка стоит правее тройки. Оба множителя положительны, поэтому произведение положительно.', 'The point stands to the right of three. Both factors are positive, so the product is positive.'),
    A('+', "Pastda ularning haqiqiy qiymatlari turadi. Nuqtani chapga tortib boring va ularga qarab turing.", 'Внизу стоят их настоящие значения. Тяни точку влево и смотри на них.', 'Below are their actual values. Drag the point to the left and watch them.'),
    A('cross3', "Mana. Faqat iks minus uch ishorasini o'zgartirdi, iks minus bir esa yo'q. Shuning uchun ko'paytma ag'darildi.", 'Вот. Знак сменил только икс минус три, а икс минус один нет. Поэтому произведение перевернулось.', 'There. Only ex minus three changed sign, ex minus one did not. That is why the product flipped.'),
    A('+', "Chergalanish shundan chiqadi. Bu yodlanadigan qoida emas, natija.", 'Вот откуда берётся чередование. Это не правило, которое надо запомнить, а следствие.', 'This is where the alternation comes from. It is not a rule to memorize, it is a consequence.'),
    A('cross1', "Yana bitta ko'paytuvchi o'zgardi, yana ag'darildi. Chapda musbat.", 'Снова изменился один множитель, снова переворот. Слева плюс.', 'Again one factor changed, again a flip. The left side is positive.'),
    A('done', "Musbat ikki bo'lakda turadi, bitta emas. Ko'paytma ishoralari haqidagi ekranni eslang.", 'Плюс стоит на двух кусках, а не на одном. Вспомни экран про знаки произведения.', 'The plus stands on two pieces, not one. Remember the screen about the signs of a product.'),
    A('+', 'Iks birdan kichik yoki iks uchdan katta.', 'Икс меньше единицы или икс больше трёх.', 'Ex is less than one, or ex is greater than three.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S5.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [x, setX] = useState(S5.startX)
  const [crossed, setCrossed] = useState([])
  const [note, setNote] = useState(null)
  const [done, setDone] = useState(false)

  const has = (at) => crossed.indexOf(at) !== -1
  const signs = {}
  if (has(3)) { signs[2] = '+'; signs[1] = '-' }
  if (has(1)) { signs[0] = '+' }
  const shaded = done ? [0, 2] : []

  // Nuqta ildizdan o'tganda -- shu joyga ovoz va izoh bog'langan.
  const onX = (v) => {
    setX(v)
    setCrossed((prev) => {
      let next = prev
      if (v < 3 && prev.indexOf(3) === -1) {
        next = prev.concat(3)
        setNote(S5.notes.c3)
        audio.step('cross3')
      }
      if (v < 1 && next.indexOf(1) === -1 && next.indexOf(3) !== -1) {
        next = next.concat(1)
        setNote(S5.notes.c1)
        audio.step('cross1')
      }
      return next
    })
  }

  // Ikki ildizdan ham o'tilgach javob O'ZI bo'yaladi.
  useEffect(() => {
    if (done || !has(1) || !has(3)) return undefined
    const timer = setTimeout(() => {
      setDone(true)
      setNote(S5.notes.done)
      audio.step('done')
      onAnswer({ screen, correct: true, attempts: 1 })
    }, 1400)
    return () => clearTimeout(timer)
  }, [crossed, done]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <div className="lc-frame-card g9-plane-card">
        <ParabolaAxis
          from={S5.from}
          to={S5.to}
          yFrom={S5.yFrom}
          yTo={S5.yTo}
          f={S5.f}
          factors={S5.factors}
          roots={S5.roots}
          signs={signs}
          shaded={shaded}
          x={x}
          onX={done ? null : onX}
          compact={!!note}
          showHandle
        />
      </div>
      <LiveProduct factors={S5.factors} x={x} f={S5.f} />
      <Slot mh={22}>
        {!has(3) ? (
          <div className="g9-drag-hint"><span>◀</span>{t(S5.dragHint)}</div>
        ) : done ? (
          <div className="g9-answer lc-in">
            <span className="g9-answer-val">{t(S5.answer)}</span>
          </div>
        ) : null}
      </Slot>
      <Slot mh={note ? 74 : 0}>
        <Feedback show={!!note} ok={done}>{note ? t(note) : null}</Feedback>
      </Slot>
    </Frame>
  )
}

// ============================================================
// SLAYD 6. Usul FAQAT kvadrat tengsizlik uchun emas.
// Darslik 34-bet, 2-masala: x³ − x < 0 -> uch nuqta, TO'RT oraliq.
// ============================================================
const S6 = {
  eyebrow: L('KENGROQ', 'ШИРЕ', 'WIDER'),
  title: L('Bu yerda uchinchi daraja, usul esa o\'sha', 'Здесь третья степень, а метод тот же', 'Here is a cubic, and the method is the same'),
  steps: ['x³ − x < 0', 'x³ − x = x(x² − 1)', '(x + 1) · x · (x − 1) < 0'],
  axis: {
    expr: '(x + 1) · x · (x − 1) < 0',
    from: -3,
    to: 3,
    roots: [{ at: -1, filled: false }, { at: 0, filled: false }, { at: 1, filled: false }],
    signs0: { 3: '+' },
    flips: [
      {
        at: 1,
        why: [
          { factor: 'x − 1', ...{ txt: L("ishorani o'zgartiradi", 'меняет знак', 'changes sign'), changes: true } },
          { factor: 'x', ...{ txt: L("o'zgarmaydi", 'не меняется', 'does not change') } },
          { factor: 'x + 1', ...{ txt: L("o'zgarmaydi", 'не меняется', 'does not change') } },
        ],
        question: L(
          "Birdan o'tganda ishora o'zgaradimi?",
          'Меняется ли знак при переходе через единицу?',
          'Does the sign change when crossing one?',
        ),
        signAfter: { 2: '-' },
        ok: L(
          "Ha. Iks minus bir ishorasini o'zgartiradi, qolgan ikkitasi yo'q.",
          'Да. Икс минус один меняет знак, остальные два нет.',
          'Yes. Ex minus one changes sign, the other two do not.',
        ),
        options: [
          { id: 'a', label: L('ha, bitta ko\'paytuvchi o\'zgaradi', 'да, один множитель меняется', 'yes, one factor changes'), correct: true },
          {
            id: 'b',
            label: L('yo\'q, o\'zgarmaydi', 'нет, не меняется', 'no, it does not change'),
            hint: L(
              "Iks minus birni nolda va ikkida hisoblang. Ishora boshqacha.",
              'Посчитай икс минус один в нуле и в двойке. Знак разный.',
              'Compute ex minus one at zero and at two. The signs differ.',
            ),
          },
          {
            id: 'c',
            label: L('ha, uchtasi ham o\'zgaradi', 'да, меняются все три', 'yes, all three change'),
            hint: L(
              "Iks va iks qo'shuv bir birning ikki tomonida ham musbat. Faqat bittasi o'zgaradi.",
              'Икс и икс плюс один по обе стороны от единицы положительны. Меняется только один.',
              'Ex and ex plus one are positive on both sides of one. Only one changes.',
            ),
          },
          {
            id: 'd',
            label: L('ikkitasi o\'zgaradi', 'меняются два', 'two change'),
            hint: L(
              "Har bir nuqtada faqat O'Z ko'paytuvchisi nolga aylanadi. Bu yerda bittasi.",
              'В каждой точке в нуль обращается только свой множитель. Здесь он один.',
              'At each point only its own factor becomes zero. Here there is one.',
            ),
          },
        ],
      },
    ],
    shade: {
      answer: [0, 2],
      okText: L(
        "Yana ikki bo'lak. Iks minus birdan kichik, va iks nol bilan bir orasida.",
        'Снова два куска. Икс меньше минус единицы, и икс между нулём и единицей.',
        'Two pieces again. Ex less than minus one, and ex between zero and one.',
      ),
      wrongs: {
        '1,3': L(
          "Tengsizlik noldan kichik. Ko'paytma manfiy bo'lgan bo'laklar kerak.",
          'Неравенство меньше нуля. Нужны те части, где произведение отрицательно.',
          'The inequality is less than zero. We need the pieces where the product is negative.',
        ),
        '0': L(
          "Minus ikki oraliqda turadi. O'q bo'ylab chapdan o'ngga yana bir bor yuring.",
          'Минус стоит на двух промежутках. Пройди по оси ещё раз слева направо.',
          'The minus stands on two intervals. Walk along the axis once more from left to right.',
        ),
        '*': L(
          "Tengsizlik noldan kichik. Minus turgan bo'laklarni belgilang.",
          'Неравенство меньше нуля. Закрась те части, где стоит минус.',
          'The inequality is less than zero. Shade the parts that carry a minus.',
        ),
      },
    },
    texts: {
      place: L("Ildizlarni o'qqa qo'ying. Ularning uchtasi.", 'Поставь корни на ось. Их три.', 'Place the roots on the axis. There are three.'),
      shade: L("Ko'paytma manfiy bo'lgan oraliqlarni belgilang", 'Закрась промежутки, где произведение отрицательно', 'Shade the intervals where the product is negative'),
    },
    candidates: [
      { v: -1, ok: true },
      { v: 0, ok: true },
      { v: 1, ok: true },
      {
        v: 2,
        hint: L(
          "Ikkida hech qaysi ko'paytuvchi nolga aylanmaydi.",
          'В двойке ни один множитель в нуль не обращается.',
          'At two no factor becomes zero.',
        ),
      },
    ],
  },
  audio: [
    A('mount', 'Darslik ikkinchi masalani beradi. Iks kub minus iks, noldan kichik.', 'Учебник даёт вторую задачу. Икс в кубе минус икс, меньше нуля.', 'The textbook gives a second task. Ex cubed minus ex, less than zero.'),
    A('+', "Daraja uchinchi, lekin qo'rqadigan narsa yo'q. Avval iksni chiqaramiz, keyin kvadratlar ayirmasini ajratamiz.", 'Степень третья, но пугаться нечего. Сначала вынесем икс, потом разложим разность квадратов.', 'The power is three, but there is nothing to fear. First factor out ex, then split the difference of squares.'),
    A('axis', "Ko'paytuvchi uchta bo'ldi. Demak, o'qdagi nuqta ham uchta bo'ladi.", 'Множителей стало три. Значит и точек на оси будет три.', 'Now there are three factors. So there will be three points on the axis.'),
    A('root3', "Uchta nuqta qo'yildi. Endi bo'laklarni ko'ramiz.", 'Три точки поставлены. Теперь посмотрим на куски.', 'Three points are placed. Now let us look at the pieces.'),
    A('iv4', "To'rtta oraliq. Usul bundan o'zgarmadi.", 'Четыре промежутка. Метод от этого не изменился.', 'Four intervals. The method has not changed because of that.'),
    A('+', "Birdan o'ngda uch ko'paytuvchi ham musbat, shuning uchun u yerda musbat turadi.", 'Справа от единицы все три множителя положительны, поэтому там стоит плюс.', 'To the right of one all three factors are positive, so there is a plus.'),
    A('why1', "Birdan o'tganda faqat iks minus bir o'zgaradi. Qolgan ikkitasi o'zgarmaydi.", 'При переходе через единицу меняется только икс минус один. Остальные два нет.', 'Crossing one, only ex minus one changes. The other two do not.'),
    A('sign1', "Ishora ag'darildi, keyin chergalanish davom etadi.", 'Знак перевернулся, дальше чередование продолжается.', 'The sign flipped, and the alternation carries on.'),
    A('shade', 'Endi bizga minuslar kerak, chunki tengsizlik noldan kichik.', 'Теперь нам нужны минусы, ведь неравенство меньше нуля.', 'Now we need the minuses, since the inequality is less than zero.'),
    A('shaded', "Yana ikki bo'lak. Iks minus birdan kichik, va iks nol bilan bir orasida.", 'Снова два куска. Икс меньше минус единицы, и икс между нулём и единицей.', 'Two pieces again. Ex less than minus one, and ex between zero and one.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S6.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [open, setOpen] = useState(1)
  const [done, setDone] = useState(false)
  const ready = open >= S6.steps.length

  return (
    <Frame meta={S6} screen={screen} audio={audio} solved={done} {...rest}>
      {!ready ? (
        <>
          <div className="lc-frame-card" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {S6.steps.slice(0, open).map((line, i) => (
              <div key={i} className={'lc-expr lc-expr-row' + (i === open - 1 && i > 0 ? ' lc-pop' : '')} style={{ minHeight: 32 }}>
                {line}
              </div>
            ))}
          </div>
          <Slot mh={46}>
            <Btn tone="soft" ready onClick={() => { const n = open + 1; setOpen(n); if (n >= S6.steps.length) audio.step('axis') }}>
              {t(UI.goOn)}
            </Btn>
          </Slot>
        </>
      ) : (
        <SignAxis
          {...S6.axis}
          phases={['place', 'flips', 'shade']}
          audio={audio}
          onStep={(p) => audio.step(p)}
          onSolved={(r) => { setDone(true); onAnswer({ ...r, screen }) }}
        />
      )}
    </Frame>
  )
}

// ============================================================
// SLAYD 7. KVADRATDAGI KO'PAYTUVCHI. Darslik 34-bet, 3-masala.
// Darslik usuli: (x+3)² > 0 hamma iksda, x = −3 dan tashqari, shuning uchun
// ko'paytuvchi OLIB TASHLANADI, nuqta esa OCHIQ qoladi.
// ============================================================
const S7 = {
  eyebrow: L("EHTIYOT BO'LING", 'ОСТОРОЖНО', 'CAREFUL'),
  title: L('Bu ko\'paytuvchi boshqacha tutadi', 'Этот множитель ведёт себя иначе', 'This factor behaves differently'),
  steps: ['(x² − 9)(x + 3)(x − 2) > 0', '(x + 3)²(x − 2)(x − 3) > 0'],
  probe: {
    question: L("(x + 3)² ko'paytuvchisi bilan nima qilamiz?", 'Что делать с множителем (x + 3)²?', 'What do we do with the factor (x + 3)²?'),
    ok: L(
      "To'g'ri, darslik ham shunday qiladi. Kvadrat minus uchdan boshqa har qanday iksda musbat, shuning uchun ko'paytuvchini olib tashlash mumkin. Iks minus uchda esa chap tomon nolga teng, nol noldan katta emas.",
      'Верно, и учебник делает так же. Квадрат положителен при любом иксе, кроме минус трёх, поэтому множитель можно убрать. А при иксе минус три слева получается ноль, и ноль не больше нуля.',
      'Correct, and the textbook does the same. The square is positive for every ex except minus three, so the factor can be dropped. And at ex minus three the left side becomes zero, and zero is not greater than zero.',
    ),
    items: [
      {
        id: 'a',
        correct: true,
        label: L('uni olib tashlash, minus uch nuqtasini esa ochiq qoldirish', 'убрать его, а точку минус три выколоть', 'drop it, and make minus three a hollow point'),
      },
      {
        id: 'b',
        label: L('olib tashlash va minus uch haqida o\'ylamaslik', 'убрать и про минус три не думать', 'drop it and not think about minus three'),
        hint: L(
          "Minus uchni o'rniga qo'ying. Chap tomonda nol chiqadi, nol esa noldan katta emas.",
          'Подставь минус три. Слева получится ноль, а ноль не больше нуля.',
          'Substitute minus three. The left side becomes zero, and zero is not greater than zero.',
        ),
      },
      {
        id: 'c',
        label: L("oddiy ko'paytuvchi deb hisoblab, ishorani chergalash", 'считать обычным множителем и чередовать знак', 'treat it as an ordinary factor and alternate the sign'),
        hint: L(
          "Iks qo'shuv uch kvadratini iks minus to'rtda va iks minus ikkida hisoblang. Ikki holatda ham musbat. Bu ko'paytuvchi ishorani o'zgartirmaydi.",
          'Посчитай икс плюс три в квадрате при иксе минус четыре и при иксе минус два. Оба раза положительно. Этот множитель знак не меняет.',
          'Compute ex plus three squared at ex equal to minus four and at minus two. Positive both times. This factor does not change sign.',
        ),
      },
      {
        id: 'd',
        label: L('tengsizlik ishorasini o\'zgartirish', 'поменять знак неравенства', 'flip the inequality sign'),
        hint: L(
          "Kvadrat manfiy bo'lmaydi. Tengsizlik ishorasini o'zgartirish uchun asos yo'q.",
          'Квадрат не бывает отрицательным. Менять знак неравенства тут не из чего.',
          'A square is never negative. There is nothing here that would flip the inequality.',
        ),
      },
    ],
  },
  axis: {
    from: -5,
    to: 5,
    roots: [{ at: -3, filled: false }, { at: 2, filled: false }, { at: 3, filled: false }],
    signs: { 0: '+', 1: '+', 2: '-', 3: '+' },
    shaded: [0, 1, 3],
    caption: L(
      "Minus uchdan o'tganda ishora O'ZGARMAYDI, lekin nuqtaning o'zi javobga kirmaydi",
      'Через минус три знак НЕ меняется, но сама точка в ответ не входит',
      'Across minus three the sign does NOT change, but the point itself is not in the answer',
    ),
  },
  answer: 'x < −3,   −3 < x < 2,   x > 3',
  note: L(
    "Bugungi asosiy narsa. Chergalanish faqat shuning uchun ishlaydi, chunki har bir nuqtada bitta ko'paytuvchi ishorani o'zgartiradi. Bu shunday bo'lmagan joyda chergalanish ham yo'q.",
    'Вот главное на сегодня. Чередование держится ровно потому, что в каждой точке знак меняет один множитель. Где это не так, там и чередования нет.',
    'Here is today\'s key point. Alternation holds precisely because at each point one factor changes sign. Where that is not so, there is no alternation.',
  ),
  audio: [
    A('mount', 'Darslikning uchinchi masalasi. Va bu yerda tuzoq bor.', 'Третья задача учебника. И здесь есть ловушка.', "The textbook's third task. And there is a trap here."),
    A('mount', "Iks kvadrat minus to'qqiz, bu iks minus uch, iks qo'shuv uch.", 'Икс в квадрате минус девять это икс минус три, умножить на икс плюс три.', 'Ex squared minus nine is ex minus three times ex plus three.'),
    A('step2', "Qarang, nima chiqdi. Iks qo'shuv uch ko'paytuvchisi ikki marta uchradi, ya'ni kvadratda turadi.", 'Смотри, что вышло. Множитель икс плюс три встретился дважды, то есть стоит в квадрате.', 'Look what came out. The factor ex plus three appeared twice, that is, it is squared.'),
    A('step2', "Ishoralarni chergalashdan oldin o'zingizdan so'rang. Bu ko'paytuvchi umuman ishorasini o'zgartiradimi?", 'Прежде чем чередовать знаки, спроси себя. А этот множитель вообще меняет знак?', 'Before alternating the signs, ask yourself. Does this factor change sign at all?'),
    A('solved', "Kvadrat hech qachon manfiy bo'lmaydi, shuning uchun ko'paytma ishorasi minus uchdan o'tganda teskari bo'lmaydi.", 'Квадрат никогда не бывает отрицательным, поэтому знак произведения через минус три не переворачивается.', 'A square is never negative, so the sign of the product does not flip across minus three.'),
    A('solved', "Lekin bu nuqta javobga ham kirmaydi. Unda chap tomon nolga teng.", 'Но и в ответ эта точка не входит. В ней левая часть равна нулю.', 'But that point is not in the answer either. There the left side equals zero.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S7.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const gate = useInstructionGate(audio)
  const [open, setOpen] = useState(1)
  const [solved, setSolved] = useState(false)
  const ready = open >= S7.steps.length

  return (
    <Frame meta={S7} screen={screen} audio={audio} solved={solved} {...rest}>
      <div className="lc-frame-card" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {S7.steps.slice(0, open).map((line, i) => (
          <div key={i} className={'lc-expr lc-expr-row' + (i === open - 1 && i > 0 ? ' lc-pop' : '')} style={{ minHeight: 30 }}>
            {line}
          </div>
        ))}
      </div>
      {!ready ? (
        <Slot mh={46}>
          <Btn tone="soft" ready={gate} disabled={!gate} onClick={() => { setOpen(2); audio.step('step2') }}>{t(UI.goOn)}</Btn>
        </Slot>
      ) : !solved ? (
        <Probe
          audio={audio}
          data={S7.probe}
          cols={1}
          minH={44}
          disabled={!gate}
          onSolved={(r) => { setSolved(true); audio.step('solved'); onAnswer({ ...r, screen }) }}
        />
      ) : (
        <div className="lc-in">
          <AxisStill {...S7.axis} h={100} />
          <Slot mh={34}><Expr size="row" tone="#1F7A4D">{S7.answer}</Expr></Slot>
          <Slot mh={54}><Hint>{t(S7.note)}</Hint></Slot>
        </div>
      )}
    </Frame>
  )
}

// ============================================================
// SLAYD 8. QOIDA. Darslik 33-betdagi ta'rif DOSLOVEN, plus 7-slayddan
// chiqadigan izoh. Qoida FAQAT to'g'ri javobdan keyin ochiladi.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Oraliqlar usuli', 'Метод интервалов', 'The interval method'),
  probe: {
    question: L(
      'Oraliqlar usuli tenglama yechishdan nimasi bilan farq qiladi?',
      'Чем метод интервалов отличается от решения уравнения?',
      'How does the interval method differ from solving an equation?',
    ),
    ok: L(
      "To'g'ri. Bu nuqtadan to'plamga o'tish.",
      'Верно. Это и есть переход от точки к множеству.',
      'Correct. That is the step from a point to a set.',
    ),
    shortAnswer: L(
      'tenglama nuqtalarni beradi, tengsizlik esa oraliqlarni',
      'уравнение даёт точки, неравенство — промежутки',
      'an equation gives points, an inequality gives intervals',
    ),
    items: [
      {
        id: 'a',
        correct: true,
        label: L('tenglama nuqtalarni beradi, tengsizlik esa shu nuqtalar orasidagi oraliqlarni', 'уравнение даёт точки, а неравенство — промежутки между этими точками', 'an equation gives points, an inequality gives the intervals between those points'),
      },
      {
        id: 'b',
        label: L('hech nimasi bilan, oxirida boshqa ishora qo\'yiladi', 'ничем, просто в конце ставят другой знак', 'nothing, you just put a different sign at the end'),
        hint: L(
          'Unda javob son bo\'lardi. Bizda esa javob ikki oraliq.',
          'Тогда ответом было бы число. А у нас ответ это два промежутка.',
          'Then the answer would be a number. But our answer is two intervals.',
        ),
      },
      {
        id: 'c',
        label: L('tengsizlikda ildizlarni boshqacha izlash kerak', 'в неравенстве корни надо искать по-другому', 'in an inequality the roots must be found differently'),
        hint: L(
          'Ildizlar bir xil izlanadi. Farq ulardan keyin nima qilinishida.',
          'Корни ищутся так же. Разница в том, что делают после них.',
          'Roots are found the same way. The difference is what you do after them.',
        ),
      },
      {
        id: 'd',
        label: L('tengsizlikda ildizlar kerak emas', 'в неравенстве корни не нужны', 'an inequality does not need roots'),
        hint: L(
          "Ildizlarsiz o'qni bo'ladigan narsa yo'q. Aynan ular uni bo'laklarga ajratadi.",
          'Без корней нечем разрезать ось. Именно они делят её на части.',
          'Without roots there is nothing to cut the axis with. They are what divides it.',
        ),
      },
    ],
  },
  rule: {
    badge: L('ORALIQLAR USULI', 'МЕТОД ИНТЕРВАЛОВ', 'THE INTERVAL METHOD'),
    title: L('Darslik, 33-bet', 'Учебник, страница 33', 'Textbook, page 33'),
    lines: [
      L("Tenglama ildizlarini sonlar o'qida belgilaymiz", 'Отмечаем на числовой оси корни уравнения', 'We mark the roots of the equation on the number line'),
      L("Ular o'qni oraliqlarga bo'ladi", 'Они разбивают ось на интервалы', 'They split the axis into intervals'),
      L('Eng o\'ngdagi oraliqda ishorani hisoblaymiz', 'Считаем знак на крайнем правом интервале', 'We compute the sign on the rightmost interval'),
      L('Qolgan ishoralarni chergalanish tartibida qo\'yamiz', 'Остальные знаки расставляем в порядке чередования', 'We place the remaining signs in alternating order'),
    ],
    example: L(
      "Chergalanish har bir nuqtada aynan bitta ko'paytuvchi ishorani o'zgartirganda to'g'ri",
      'Чередование верно, пока в каждой точке знак меняет ровно один множитель',
      'Alternation is valid as long as exactly one factor changes sign at each point',
    ),
  },
  audio: [
    A('mount', 'Endi qoida. Lekin avval bitta savol.', 'Теперь правило. Но сначала один вопрос.', 'Now the rule. But first one question.'),
    A('rule', "Qilgan ishlarimizni qoidaga yig'amiz. U darslik so'zlari bilan yozilgan.", 'Соберём то, что мы сделали, в правило. Оно написано словами учебника.', "Let us gather what we did into a rule. It is written in the textbook's own words."),
    A('rule', "Eng o'ngdagi oraliq ishorasini hisoblaymiz, qolganlarini chergalaymiz.", 'Знак крайнего правого интервала считаем, остальные чередуем.', 'We compute the sign of the rightmost interval and alternate the rest.'),
    A('rule', "Va darslikda ochiq yozilmagan, lekin uchinchi masaladan chiqadigan izoh. Chergalanish har bir nuqtada aynan bitta ko'paytuvchi ishorani o'zgartirganda ishlaydi.", 'И одна оговорка, которой в учебнике нет прямо, но она следует из третьей задачи. Чередование работает, пока в каждой точке знак меняет ровно один множитель.', 'And one caveat that is not stated outright in the textbook but follows from the third task. Alternation works as long as exactly one factor changes sign at each point.'),
  ],
}

function Screen8({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S8.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S8} screen={screen} audio={audio} solved={done} {...rest}>
      <RuleGate
        audio={audio}
        probe={S8.probe}
        rule={S8.rule}
        onStep={(p) => { if (p === 'rule') audio.step('rule') }}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen }) }}
      />
    </Frame>
  )
}

// ============================================================
// SLAYD 9. MASHQ 1. To'liq yo'l: ildizlar, son bilan ishora, javobni yig'ish.
// `alternate` -- 8-slaydda o'rganilgan qoidani QO'LLASH.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni o\'qda yig\'ing', 'Собери ответ на оси', 'Build the answer on the axis'),
  axis: {
    expr: '(x + 2)(x − 5) < 0',
    from: -4,
    to: 7,
    roots: [{ at: -2, filled: false }, { at: 5, filled: false }],
    candidates: [
      { v: -2, ok: true },
      { v: 5, ok: true },
      {
        v: 2,
        hint: L(
          "Ildiz ko'paytuvchini nolga aylantiradi. Iks qo'shuv ikki nolga teng bo'ladi, qachonki iks minus ikki bo'lsa.",
          'Корень обращает множитель в нуль. Икс плюс два равен нулю, когда икс равен минус двум.',
          'A root makes a factor zero. Ex plus two is zero when ex equals minus two.',
        ),
      },
      {
        v: -5,
        hint: L(
          "Ishoraga qarang. Iks minus besh nolga teng bo'ladi, qachonki iks besh bo'lsa.",
          'Посмотри на знак. Икс минус пять равен нулю, когда икс равен пяти.',
          'Look at the sign. Ex minus five is zero when ex equals five.',
        ),
      },
    ],
    witness: {
      interval: 2,
      sign: '+',
      signWord: L('Musbat', 'Плюс', 'Positive'),
      lines: ['x = 6', '(6 + 2)(6 − 5) = 8 · 1 = 8'],
      options: [
        { id: 'a', v: 6, ok: true },
        { id: 'b', v: 10, ok: true },
        {
          id: 'c',
          v: 0,
          hint: L(
            "Nol ildizlar orasida. Eng o'ngdagi oraliqdan son oling.",
            'Ноль между корнями. Возьми число из крайнего правого промежутка.',
            'Zero is between the roots. Take a number from the rightmost interval.',
          ),
        },
        {
          id: 'd',
          v: -3,
          hint: L(
            "Minus uch chap oraliqda. Bizga eng o'ngdagi kerak.",
            'Минус три в левом промежутке. Нам нужен крайний правый.',
            'Minus three is in the left interval. We need the rightmost one.',
          ),
        },
      ],
    },
    shade: {
      answer: [1],
      okText: L(
        "Bo'ldi. Bitta oraliq, bunday ham bo'ladi. Hammasini tengsizlik ishorasi hal qildi.",
        'Есть. Один промежуток, и это тоже бывает. Всё решил знак неравенства.',
        'Done. One interval, and that happens too. The inequality sign decided everything.',
      ),
      wrongs: {
        '0,2': L(
          'Ishora noldan kichik. Demak, ko\'paytma manfiy bo\'lgan bo\'laklar kerak.',
          'Знак меньше нуля. Значит нужны те части, где произведение отрицательно.',
          'The sign is less than zero. So we need the parts where the product is negative.',
        ),
        '*': L(
          "Tengsizlik noldan kichik. Minus turgan bo'lakni belgilang.",
          'Неравенство меньше нуля. Закрась ту часть, где стоит минус.',
          'The inequality is less than zero. Shade the part that carries a minus.',
        ),
      },
    },
    texts: {
      place: L("Ildizlarni o'qqa qo'ying", 'Поставь корни на ось', 'Place the roots on the axis'),
      witness: L("Eng o'ngdagi oraliqqa qaysi sonni qo'yamiz?", 'Какое число подставим в крайний правый промежуток?', 'Which number shall we substitute into the rightmost interval?'),
      witnessOk: L(
        "Sakkiz musbat. Qolgan ishoralar chergalanish bilan to'ldi.",
        'Восемь положительно. Остальные знаки встали по чередованию.',
        'Eight is positive. The remaining signs fell into place by alternation.',
      ),
      shade: L("Kerakli oraliqni belgilang", 'Закрась нужный промежуток', 'Shade the interval you need'),
    },
  },
  audio: [
    A('mount', "Endi o'zingiz. Tartibni bilasiz. Ildizlar, nuqtalar, o'ngdagi ishora, chergalanish.", 'Теперь сам. Порядок ты знаешь. Корни, точки, знак справа, чередование.', 'Now on your own. You know the order. Roots, points, sign on the right, alternation.'),
    A('+', "Tengsizlik ishorasiga e'tibor bering. Bu yerda u noldan kichik.", 'И следи за знаком неравенства. Здесь он меньше нуля.', 'And watch the inequality sign. Here it is less than zero.'),
    A('sub', "Sonni qo'ydik. Hisoblang.", 'Число подставили. Посчитай.', 'The number is substituted. Compute.'),
    A('sign', "Musbat. Qolgan ishoralar qoidaga ko'ra chergalanish bilan to'ldi.", 'Плюс. Остальные знаки встали по чередованию, как в правиле.', 'Positive. The remaining signs fell into place by alternation, as in the rule.'),
    A('shaded', "Bitta oraliq. Bunday ham bo'ladi, hammasini tengsizlik ishorasi hal qiladi.", 'Один промежуток. И так бывает, всё решает знак неравенства.', 'One interval. That happens too, the inequality sign decides everything.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S9.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S9} screen={screen} audio={audio} solved={done} {...rest}>
      <SignAxis
        {...S9.axis}
        phases={['place', 'witness', 'shade']}
        alternate
        audio={audio}
        onStep={(p) => audio.step(p)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen }) }}
      />
    </Frame>
  )
}

// ============================================================
// SLAYD 10. MASHQ 2. SON QO'YIB ISBOTLASH. Darslik 35-bet, 70-mashq
// (u darslikda OG'ZAKI). Ikki savol birma-bir.
// ============================================================
const S10 = {
  eyebrow: L('SON BILAN TEKSHIRISH', 'ПРОВЕРКА ЧИСЛОМ', 'CHECK WITH A NUMBER'),
  title: L('Tengsizlik (x − 1)(x − 3) > 0', 'Неравенство (x − 1)(x − 3) > 0', 'The inequality (x − 1)(x − 3) > 0'),
  chain: [
    {
      prompt: '(5 − 1)(5 − 3) = ?',
      ok: L('Sakkiz noldan katta, demak besh yechim.', 'Восемь больше нуля, значит пятёрка решение.', 'Eight is greater than zero, so five is a solution.'),
      items: [
        { id: 'a', label: '8', correct: true },
        {
          id: 'b',
          label: '6',
          hint: L(
            'Qavslar orasida ko\'paytirish, qo\'shish emas.',
            'Между скобками умножение, а не сложение.',
            'Between the brackets there is multiplication, not addition.',
          ),
        },
        {
          id: 'c',
          label: '2',
          hint: L(
            "Ikki qavs ham hisoblanadi. Avval har birini alohida.",
            'Считаются обе скобки. Сначала каждую по отдельности.',
            'Both brackets count. First each one separately.',
          ),
        },
        {
          id: 'd',
          label: '−8',
          hint: L(
            'Ikki qavs ham musbat chiqadi. Musbatni musbatga ko\'paytirsak, musbat.',
            'Обе скобки выходят положительными. Плюс на плюс даёт плюс.',
            'Both brackets come out positive. Plus times plus gives plus.',
          ),
        },
      ],
    },
    {
      prompt: '(2 − 1)(2 − 3) = ?',
      ok: L(
        "Minus bir, va bu noldan katta emas. Demak, ikki yechim emas.",
        'Минус один, и это не больше нуля. Значит двойка решением не является.',
        'Minus one, and that is not greater than zero. So two is not a solution.',
      ),
      items: [
        { id: 'a', label: '−1', correct: true },
        {
          id: 'b',
          label: '1',
          hint: L(
            'Ikkinchi qavs manfiy chiqadi. Ikki minus uch, bu minus bir.',
            'Вторая скобка выходит отрицательной. Два минус три это минус один.',
            'The second bracket comes out negative. Two minus three is minus one.',
          ),
        },
        {
          id: 'c',
          label: '−5',
          hint: L(
            "Birinchi qavs bir, ikkinchisi minus bir. Ko'paytmasini hisoblang.",
            'Первая скобка один, вторая минус один. Посчитай произведение.',
            'The first bracket is one, the second minus one. Compute the product.',
          ),
        },
        {
          id: 'd',
          label: '0',
          hint: L(
            "Nol chiqishi uchun qavslardan biri nol bo'lishi kerak. Bu yerda ikkisi ham nol emas.",
            'Чтобы вышел ноль, одна из скобок должна быть нулём. Здесь ни одна не ноль.',
            'For zero to come out one bracket must be zero. Here neither is.',
          ),
        },
      ],
    },
  ],
  audio: [
    A('mount', 'Bu mashq darslikdan olingan, u yerda og\'zaki.', 'Это упражнение взято из учебника, и оно там устное.', 'This exercise comes from the textbook, where it is given orally.'),
    A('mount', "Besh yechim bo'ladimi, tekshiring. Shunchaki o'rniga qo'yib hisoblang.", 'Проверь, будет ли пятёрка решением. Просто подставь и посчитай.', 'Check whether five is a solution. Just substitute and compute.'),
    A('r2', 'Endi ikki. O\'rniga qo\'yib o\'zingiz ko\'ring.', 'А теперь двойка. Подставь и посмотри сам.', 'And now two. Substitute and see for yourself.'),
    A('done', "Ana shu usul bilan har qanday javobingizni tekshirasiz. Imtihonda ham, u yerda hech kim aytmaydi.", 'Вот этим приёмом ты сможешь проверить любой свой ответ. И на экзамене тоже, там никто не подскажет.', 'With this move you can check any answer of yours. In the exam too, where nobody will help.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S10.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S10} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S10.chain}
        cols={4}
        onStep={(i) => { if (i === 1) audio.step('r2') }}
        onSolved={(r) => { setDone(true); audio.step('done'); onAnswer({ ...r, screen }) }}
      />
    </Frame>
  )
}

// ============================================================
// SLAYD 11. MASHQ 3. BIRINCHI xato qadamni topish.
// Javobdan keyin xato SON QO'YIB isbotlanadi (ETALON §1 talab 3).
// Darslik 24-betda shu qadamni QONUNIY qiladi -- avval ishorani isbotlab.
// ============================================================
const S11 = {
  eyebrow: L('XATONI TOPING', 'НАЙДИ ОШИБКУ', 'FIND THE MISTAKE'),
  title: L('Bu yerda bitta satr xato. Birinchisi qaysi?', 'Здесь одна строка неверна. Какая первая?', 'One line here is wrong. Which is the first one?'),
  rows: [
    { id: 'r1', text: '(x − 2)(x + 5) > 0' },
    { id: 'r2', text: 'ikki tomonni (x − 2) ga bo\'lamiz' },
    { id: 'r3', text: 'x + 5 > 0' },
    { id: 'r4', text: 'x > −5' },
  ],
  answerId: 'r2',
  hints: {
    r1: L('Bu shart. Bu yerda xato bo\'lishi mumkin emas.', 'Это условие. Здесь ошибки быть не может.', 'This is the given. There cannot be a mistake here.'),
    r3: L('U ikkinchi satrdan olingan. Xato oldinroq.', 'Она получена из второй строки. Ошибка раньше.', 'It follows from line two. The mistake is earlier.'),
    r4: L('Uchinchi satrdan bu to\'g\'ri chiqadi. Yuqoriga qarang.', 'Из третьей строки это следует правильно. Смотри выше.', 'This follows correctly from line three. Look higher up.'),
  },
  proof: L(
    'x = 0:  (0 − 2)(0 + 5) = −10',
    'x = 0:  (0 − 2)(0 + 5) = −10',
    'x = 0:  (0 − 2)(0 + 5) = −10',
  ),
  note: L(
    "Iks minus ikkiga bo'lish mumkin, lekin uning ishorasini bilgan holda. Darslik yigirma to'rtinchi betda shunday qiladi: avval ko'paytuvchi musbat ekanini isbotlaydi, keyin bo'ladi.",
    'Делить на икс минус два можно, но только зная его знак. Учебник на странице двадцать четыре так и делает: сначала доказывает, что множитель положителен, и только потом делит.',
    'You may divide by ex minus two, but only knowing its sign. The textbook on page twenty four does exactly that: it first proves the factor is positive, and only then divides.',
  ),
  audio: [
    A('mount', 'Oldingizda birovning yechimi. Unda bitta satr buzilgan.', 'Перед тобой чужое решение. В нём одна строка сломана.', "In front of you is someone else's solution. One line in it is broken."),
    A('mount', 'Birinchi xato satrni toping. Aynan birinchisini, chunki keyin xato shunchaki davom etadi.', 'Найди первую неверную строку. Именно первую, потому что дальше ошибка просто тянется.', 'Find the first wrong line. The first one, because after it the mistake simply carries on.'),
    A('proof', "Bu javobga ko'ra nol yechim bo'lishi kerak, chunki nol minus beshdan katta.", 'По этому ответу ноль должен быть решением, ведь ноль больше минус пяти.', 'By this answer zero should be a solution, since zero is greater than minus five.'),
    A('proof', 'Nolni dastlabki tengsizlikka qo\'yamiz. Minus ikkini beshga ko\'paytirsak, minus o\'n chiqadi.', 'Подставим ноль в исходное неравенство. Минус два умножить на пять это минус десять.', 'Substitute zero into the original inequality. Minus two times five is minus ten.'),
    A('proof', 'Minus o\'n noldan katta emas. Demak, nol yechim emas, javob esa teskarisini aytadi.', 'Минус десять не больше нуля. Значит ноль решением не является, а ответ говорит обратное.', 'Minus ten is not greater than zero. So zero is not a solution, yet the answer claims otherwise.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S11.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S11} screen={screen} audio={audio} solved={done} {...rest}>
      <AuditRows
        audio={audio}
        rows={S11.rows}
        answerId={S11.answerId}
        hints={S11.hints}
        proof={S11.proof}
        onStep={(p) => { if (p === 'proof') audio.step('proof') }}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen }) }}
      />
      <Slot mh={64}>{done ? <Hint>{t(S11.note)}</Hint> : null}</Slot>
    </Frame>
  )
}

// ============================================================
// SLAYD 12. MASHQ 4. TESKARI TOPSHIRIQ: javob berilgan, tengsizlikni tuz.
// Tuzilishni tushunganini to'g'ri hisoblashdan yaxshiroq ko'rsatadi.
// ============================================================
const S12 = {
  eyebrow: L('O\'ZINGIZ TUZING', 'СОБЕРИ САМ', 'BUILD IT YOURSELF'),
  title: L('Javob x < −1 yoki x > 3 bo\'lsin', 'Ответ должен быть x < −1 или x > 3', 'The answer must be x < −1 or x > 3'),
  fill: {
    prompt: L('Qavslarni va ishorani tanlang', 'Выбери скобки и знак', 'Choose the brackets and the sign'),
    template: [{ slot: 0 }, { slot: 1 }, { slot: 2 }, '0'],
    parts: [
      { id: 'p1', label: '(x + 1)' },
      { id: 'm1', label: '(x − 1)' },
      { id: 'p3', label: '(x + 3)' },
      { id: 'm3', label: '(x − 3)' },
      { id: 'gt', label: '>' },
      { id: 'lt', label: '<' },
    ],
    answer: ['p1', 'm3', 'gt'],
    checkNote: L(
      "Bo'ldi. Ildizlar nuqtalarni beradi, ishora esa nimani belgilashni tanlaydi, buni tushundingiz.",
      'Есть. Корни задают точки, а знак выбирает, что закрашивать — ты это понял.',
      'Done. The roots set the points and the sign chooses what to shade, you got that.',
    ),
    wrongs: {
      'm1|p3|gt': L(
        "Tuzgan ifodangiz ildizlarini tekshiring. Bir va minus uch chiqadi, kerakligi esa minus bir va uch.",
        'Проверь корни своей сборки. Получатся единица и минус три, а нужны минус единица и тройка.',
        'Check the roots of what you built. You get one and minus three, but we need minus one and three.',
      ),
      'p1|m3|lt': L(
        "Kichik ishorasi o'rtani belgilaydi. Bizga esa chetlar kerak.",
        'Знак меньше закрашивает середину. А нам нужны края.',
        'The less-than sign shades the middle. But we need the outer parts.',
      ),
      '*': L(
        "Ildizlar minus bir va uch bo'lishi kerak, javob esa chetlarda. Qavslarni va ishorani tekshiring.",
        'Корни должны быть минус один и три, а ответ по краям. Проверь скобки и знак.',
        'The roots must be minus one and three, and the answer lies at the ends. Check the brackets and the sign.',
      ),
    },
  },
  audio: [
    A('mount', 'Endi teskarisi. Javob berilgan, tengsizlikni esa tuzish kerak.', 'Теперь наоборот. Ответ уже дан, а неравенство нужно построить.', 'Now the other way round. The answer is given, and you must build the inequality.'),
    A('mount', 'Avval qanday ildizlar shunday javob berishini o\'ylang, keyin ishorani tanlang.', 'Подумай сначала, какие корни дают такой ответ, и только потом выбирай знак.', 'First think which roots give such an answer, and only then choose the sign.'),
    A('checked', 'Bunday topshiriq tushunishni hisoblashdan yaxshiroq ko\'rsatadi.', 'Такое задание показывает понимание лучше, чем счёт.', 'A task like this shows understanding better than computing does.'),
  ],
}

function Screen12({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S12.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S12} screen={screen} audio={audio} solved={done} {...rest}>
      <SlotFill
        audio={audio}
        {...S12.fill}
        onStep={(p) => { if (p === 'checked') audio.step('checked') }}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen }) }}
      />
    </Frame>
  )
}

// ============================================================
// SLAYD 13. MASALA. Usul ikki bo'lak beradi, MASALA SHARTI bittasini qoldiradi.
// §6 1-masalasi naqshida (darslik 24-bet: u ham shartga tayanib tashlaydi).
// ============================================================
const S13 = {
  eyebrow: L('MASALA', 'ЗАДАЧА', 'WORD PROBLEM'),
  title: L('Yer maydoni', 'Участок', 'A plot of land'),
  task: L(
    "To'g'ri to'rtburchak shaklidagi yer maydonining bir tomoni ikkinchisidan 4 metr uzun. Kichik tomoni qanday bo'lganda yuza 45 kvadrat metrdan katta bo'ladi?",
    'У прямоугольного участка одна сторона на 4 метра длиннее другой. При какой меньшей стороне площадь больше 45 квадратных метров?',
    'One side of a rectangular plot is 4 metres longer than the other. For which shorter side is the area greater than 45 square metres?',
  ),
  steps: ['x(x + 4) > 45', 'x² + 4x − 45 > 0', '(x + 9)(x − 5) > 0', 'x < −9   yoki   x > 5'],
  probe: {
    question: L('Ikki bo\'lak ham yaraydimi?', 'Оба куска годятся?', 'Do both pieces work?'),
    ok: L(
      "Bo'ldi. Usul ikki bo'lak berdi, masala sharti esa bittasini qoldirdi. Darslik ham shunday qiladi.",
      'Есть. Метод дал два куска, а условие задачи оставило один. Учебник поступает так же.',
      "Done. The method gave two pieces, and the problem's condition left one. The textbook does the same.",
    ),
    items: [
      {
        id: 'a',
        correct: true,
        label: L('yo\'q, faqat x > 5', 'нет, только x > 5', 'no, only x > 5'),
      },
      {
        id: 'b',
        label: L('ha, ikkisi ham', 'да, оба', 'yes, both'),
        hint: L(
          "Yer maydonining tomoni uzunlik. U minus to'qqiz metrdan kichik bo'lishi mumkinmi?",
          'Сторона участка это длина. Может ли она быть меньше минус девяти метров?',
          'The side of a plot is a length. Can it be less than minus nine metres?',
        ),
      },
      {
        id: 'c',
        label: L('faqat x < −9', 'только x < −9', 'only x < −9'),
        hint: L(
          'Tomon manfiy bo\'lmaydi. Ikkinchi bo\'lakka qarang.',
          'Сторона не бывает отрицательной. Посмотри на второй кусок.',
          'A side cannot be negative. Look at the other piece.',
        ),
      },
      {
        id: 'd',
        label: L('x ≥ 5', 'x ≥ 5', 'x ≥ 5'),
        hint: L(
          "Iks beshga teng bo'lganda yuza roppa rosa qirq besh chiqadi. Kerakligi esa kattaroq.",
          'При иксе равном пяти площадь получится ровно сорок пять. А нужно больше.',
          'At ex equal to five the area is exactly forty five. But we need more.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Masala darslikning oltinchi paragrafidagi birinchi masala kabi tuzilgan. U yerda ham to'g'ri to'rtburchak.", 'Задача построена так же, как первая задача шестого параграфа учебника. Там тоже прямоугольник.', "The task is built the same way as the first task of the textbook's sixth section. There is a rectangle there too."),
    A('mount', "Kichik tomonni iks deb belgilang. Unda ikkinchi tomon iks qo'shuv to'rt bo'ladi.", 'Обозначь меньшую сторону иксом. Тогда вторая сторона это икс плюс четыре.', 'Let the shorter side be ex. Then the other side is ex plus four.'),
    A('step2', 'Yuza tomonlar ko\'paytmasi, va u qirq beshdan katta bo\'lishi kerak.', 'Площадь это произведение сторон, и она должна быть больше сорока пяти.', 'The area is the product of the sides, and it must be greater than forty five.'),
    A('step4', 'Usul ikki bo\'lak berdi. Va shu yerda to\'xtang.', 'Метод дал два куска. И вот тут остановись.', 'The method gave two pieces. And here you should stop.'),
    A('step4', 'Iks yer maydonining tomoni. Ikki bo\'lak ham yaraydimi, o\'ylang.', 'Икс это сторона участка. Подумай, годятся ли оба куска.', 'Ex is the side of a plot. Think about whether both pieces work.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S13.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const gate = useInstructionGate(audio)
  const [open, setOpen] = useState(0)
  const [done, setDone] = useState(false)
  const ready = open >= S13.steps.length

  const reveal = () => {
    const n = open + 1
    setOpen(n)
    audio.step('step' + n)
  }

  return (
    <Frame meta={S13} screen={screen} audio={audio} solved={done} {...rest}>
      <Hint>{t(S13.task)}</Hint>
      <div className="lc-frame-card" style={{ display: 'flex', flexDirection: 'column', gap: 1, minHeight: 40 }}>
        {S13.steps.slice(0, open).map((line, i) => (
          <div key={i} className={'lc-expr lc-expr-row' + (i === open - 1 ? ' lc-pop' : '')} style={{ minHeight: 29 }}>
            {line}
          </div>
        ))}
      </div>
      {!ready ? (
        <Slot mh={46}><Btn tone="soft" ready={gate} disabled={!gate} onClick={reveal}>{t(UI.goOn)}</Btn></Slot>
      ) : (
        <Probe
          audio={audio}
          data={S13.probe}
          cols={2}
          minH={44}
          disabled={!gate}
          onSolved={(r) => { setDone(true); onAnswer({ ...r, screen }) }}
        />
      )}
    </Frame>
  )
}

// ============================================================
// SLAYD 14. FINAL. Uch raund, uch XIL format. Birinchi raundda
// tengsizlik QAT'IY EMAS -- nuqtalar TO'LDIRILGAN bo'ladi, darsda
// bu birinchi marta.
// ============================================================
const S14 = {
  eyebrow: L('FINAL', 'ФИНАЛ', 'FINAL'),
  // Ikkita BAHOLANADIGAN topshiriq, uchinchi qadam esa FactCard -- u topshiriq
  // emas. Sarlavha, ovoz va hisoblagich shuni aytishi kerak: ilgari uchtasi
  // va'da qilinardi, o'quvchi esa ikkitasini olardi.
  title: L('Ketma ket ikkita topshiriq', 'Два задания подряд', 'Two tasks in a row'),
  axis: {
    expr: '(x − 4)(x + 1) ≤ 0',
    from: -3,
    to: 6,
    roots: [{ at: -1, filled: true }, { at: 4, filled: true }],
    candidates: [
      { v: -1, ok: true },
      { v: 4, ok: true },
      { v: 1, hint: L("Birda hech qaysi qavs nolga aylanmaydi.", 'В единице ни одна скобка в нуль не обращается.', 'At one neither bracket becomes zero.') },
      { v: -4, hint: L("Ishoraga qarang. Iks qo'shuv bir nolga teng bo'ladi, qachonki iks minus bir bo'lsa.", 'Посмотри на знак. Икс плюс один равен нулю, когда икс равен минус одному.', 'Look at the sign. Ex plus one is zero when ex equals minus one.') },
    ],
    witness: {
      interval: 2,
      sign: '+',
      signWord: L('Musbat', 'Плюс', 'Positive'),
      lines: ['x = 5', '(5 − 4)(5 + 1) = 1 · 6 = 6'],
      options: [
        { id: 'a', v: 5, ok: true },
        { id: 'b', v: 6, ok: true },
        { id: 'c', v: 0, hint: L("Nol ildizlar orasida.", 'Ноль между корнями.', 'Zero is between the roots.') },
        { id: 'd', v: -2, hint: L("Minus ikki chap oraliqda.", 'Минус два в левом промежутке.', 'Minus two is in the left interval.') },
      ],
    },
    shade: {
      answer: [1],
      filledSet: true,
      okText: L(
        "Ishora qat'iy emas, shuning uchun nuqtalar to'ldirilgan va chegaralar javobga kiradi.",
        'Знак нестрогий, поэтому точки закрашенные и границы входят в ответ.',
        'The sign is not strict, so the points are filled and the boundaries are in the answer.',
      ),
      wrongs: {
        '0,2': L(
          "Ishora kichik yoki teng. Ko'paytma manfiy yoki nol bo'lgan bo'lak kerak.",
          'Знак меньше или равно. Нужна та часть, где произведение отрицательно или ноль.',
          'The sign is less than or equal. We need the part where the product is negative or zero.',
        ),
        '*': L(
          "Minus turgan bo'lakni belgilang. Chegaralar ham kiradi.",
          'Закрась ту часть, где стоит минус. Границы тоже входят.',
          'Shade the part that carries a minus. The boundaries are included too.',
        ),
      },
    },
    texts: {
      place: L("Ildizlarni o'qqa qo'ying. E'tibor bering: ishora qat'iy emas.", 'Поставь корни на ось. Обрати внимание: знак нестрогий.', 'Place the roots on the axis. Note: the sign is not strict.'),
      witness: L("Eng o'ngdagi oraliqqa qaysi sonni qo'yamiz?", 'Какое число подставим в крайний правый промежуток?', 'Which number shall we substitute into the rightmost interval?'),
      witnessOk: L('Olti musbat.', 'Шесть положительно.', 'Six is positive.'),
      shade: L('Kerakli oraliqni belgilang', 'Закрась нужный промежуток', 'Shade the interval you need'),
    },
  },
  probe: {
    question: L(
      '(x − 1)(x − 3) uchun bir bilan uch orasidagi oraliqda qanday ishora?',
      'Какой знак у (x − 1)(x − 3) на промежутке от единицы до тройки?',
      'What sign does (x − 1)(x − 3) have on the interval from one to three?',
    ),
    ok: L('Ha. Ikkida tekshirsangiz, minus bir chiqadi.', 'Да. Проверь двойкой — выйдет минус один.', 'Yes. Check with two and you get minus one.'),
    items: [
      { id: 'a', correct: true, label: L('manfiy', 'минус', 'negative') },
      {
        id: 'b',
        label: L('musbat', 'плюс', 'positive'),
        hint: L(
          "Ikkini o'rniga qo'ying. Bir marta minus bir chiqadi.",
          'Подставь двойку. Получится минус один.',
          'Substitute two. You get minus one.',
        ),
      },
      {
        id: 'c',
        label: L('nol', 'ноль', 'zero'),
        hint: L(
          "Nol faqat ildizlarning O'ZIDA bo'ladi, oraliq ichida emas.",
          'Ноль бывает только в самих корнях, а не внутри промежутка.',
          'Zero occurs only at the roots themselves, not inside an interval.',
        ),
      },
      {
        id: 'd',
        label: L("ishora o'zgarib turadi", 'знак меняется', 'the sign varies'),
        hint: L(
          "Bitta oraliq ichida ishora o'zgarmaydi. Aynan shuning uchun oraliqlar bilan ishlaymiz.",
          'Внутри одного промежутка знак не меняется. Именно поэтому мы и работаем промежутками.',
          'Inside one interval the sign does not change. That is exactly why we work with intervals.',
        ),
      },
    ],
  },
  fact: {
    badge: L('BU NEGA ISHLAYDI', 'ОТКУДА ЭТО РАБОТАЕТ', 'WHY THIS WORKS'),
    lines: [
      L(
        "Uzluksiz funksiya nolda bo'lmasdan musbatdan manfiyga o'ta olmaydi.",
        'Непрерывная функция не может перейти с плюса на минус, не побывав в нуле.',
        'A continuous function cannot pass from plus to minus without visiting zero.',
      ),
      L(
        'Bu Bolsano teoremasi. Oraliqlar usuli aynan shunga tayanadi.',
        'Это теорема Больцано. На ней держится метод интервалов.',
        "This is Bolzano's theorem. The interval method rests on it.",
      ),
    ],
    example: L(
      "Ildizlarni sonli usulda izlaydigan programmalar ham shunga tayanadi: kesmani teng ikkiga bo'lib, qaysi yarmida ishora o'zgarganini qaraydi.",
      'На ней же работают программы, которые ищут корни численно: они делят отрезок пополам и смотрят, в какой половине знак меняется.',
      'The same theorem powers programs that find roots numerically: they halve the segment and look at which half the sign changes in.',
    ),
  },
  audio: [
    A('mount', "Ikkita topshiriq, ikkalasi ham boshqacha. Nazorat ishida ham shunday bo'ladi.", 'Два задания, и оба разные. Так же будет и на контрольной.', 'Two tasks, and they are different. It will be the same on the test.'),
    A('+', 'Tengsizlik ishorasiga diqqat bilan qarang, u bu yerda avvalgidek emas.', 'Посмотри внимательно на знак неравенства, он здесь не такой, как раньше.', 'Look carefully at the inequality sign, it is not the same as before.'),
    A('sign', "Olti musbat. Chergalanish qolganini qo'yadi.", 'Шесть положительно. Чередование расставит остальное.', 'Six is positive. Alternation will place the rest.'),
    A('shaded', "Ishora qat'iy emas, shuning uchun nuqtalar to'ldirilgan va chegaralar javobga kiradi. Darsda avval hamma nuqtalar ochiq edi.", 'Знак нестрогий, поэтому точки закрашенные и границы входят в ответ. Раньше в уроке все точки были пустыми.', 'The sign is not strict, so the points are filled and the boundaries are in the answer. Earlier in the lesson all points were hollow.'),
    A('r2', 'Ikkinchi topshiriq. Bu safar faqat ishora kerak.', 'Второе задание. На этот раз нужен только знак.', 'The second task. This time only the sign is needed.'),
    A('fact', 'Va oxirida bu usul nega umuman ishlashi haqida.', 'И напоследок про то, почему этот метод вообще работает.', 'And finally, about why this method works at all.'),
  ],
}

function Screen14({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S14.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const gate = useInstructionGate(audio)
  const [round, setRound] = useState(0)

  const finishRound = (r) => {
    onAnswer({ ...r, screen })
    const n = round + 1
    setTimeout(() => { setRound(n); if (n === 1) audio.step('r2'); if (n === 2) audio.step('fact') }, 900)
  }

  return (
    <Frame meta={S14} screen={screen} audio={audio} solved={round >= 2} {...rest}>
      <div className="lc-eyebrow" style={{ justifyContent: 'flex-start' }}>
        <span>{t(UI.round)} {Math.min(round + 1, 2)} / 2</span>
      </div>
      {round === 0 ? (
        <SignAxis
          {...S14.axis}
          phases={['place', 'witness', 'shade']}
          alternate
          audio={audio}
          onStep={(p) => audio.step(p)}
          onSolved={finishRound}
        />
      ) : round === 1 ? (
        <Probe audio={audio} data={S14.probe} cols={2} minH={44} disabled={!gate} onSolved={finishRound} />
      ) : (
        <div className="lc-in">
          <RuleCard
            badge={t(S14.fact.badge)}
            lines={S14.fact.lines.map((l) => t(l))}
            example={t(S14.fact.example)}
          />
        </div>
      )}
    </Frame>
  )
}

// ============================================================
// SLAYD 15. YAKUN. Yangi matematika YO'Q. Uch qism: qoida bir satrda,
// 1-slayddagi prognozga qaytish, oldingi va keyingi dars bilan bog'lash.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что ты теперь умеешь', 'What you can do now'),
  rule: L(
    "Ildizlar o'qni bo'ladi. Chetdagi oraliq ishorasi hisoblanadi, qolganlari chergalanadi, har bir nuqtada bitta ko'paytuvchi ishorani o'zgartirganda.",
    'Корни разрезают ось. Знак крайнего промежутка считается, остальные чередуются, пока в каждой точке знак меняет один множитель.',
    'The roots cut the axis. The sign of the end interval is computed, the rest alternate, as long as one factor changes sign at each point.',
  ),
  forecastTag: L('Dars boshida siz tanlagan javob', 'В начале урока ты выбрал', 'At the start of the lesson you chose'),
  rightTag: L('To\'g\'ri javob', 'Верный ответ', 'The correct answer'),
  right: 'x < 1  yoki  x > 3',
  wasRight: L(
    'Siz boshidan to\'g\'ri aytdingiz. Endi nima uchun ekanini ham bilasiz.',
    'Ты был прав с самого начала. Теперь ты знаешь ещё и почему.',
    'You were right from the very start. Now you also know why.',
  ),
  wasWrong: L(
    "Siz ikki bo'lak o'rniga bittasini oldingiz. Aynan o'q tutadigan xato.",
    'Ты взял один кусок вместо двух. Ровно та ошибка, которую ловит ось.',
    'You took one piece instead of two. Exactly the mistake the axis catches.',
  ),
  linkBack: L(
    "6-dars: xuddi shu tengsizlikni parabola grafigi bo'yicha yechgan edik. U yerda ishora ko'rinardi, bu yerda hisoblanadi.",
    'Урок 6: то же неравенство решали по графику параболы. Там знак был виден, здесь он считается.',
    "Lesson 6: the same inequality was solved from the parabola's graph. There the sign was visible, here it is computed.",
  ),
  linkFwd: L(
    "17-dars: nuqtalar maxrajdan ham paydo bo'ladi. Bunday nuqtalar tengsizlik ishorasi qanday bo'lsa ham, doim ochiq qoladi.",
    'Урок 17: точки будут появляться и из знаменателя. Такие точки всегда выколоты, каким бы ни был знак неравенства.',
    'Lesson 17: points will also come from the denominator. Such points are always hollow, whatever the inequality sign.',
  ),
  axis: {
    from: -1,
    to: 5,
    roots: [{ at: 1, filled: false }, { at: 3, filled: false }],
    signs: { 0: '+', 1: '-', 2: '+' },
    shaded: [0, 2],
  },
  audio: [
    A('mount', 'Dars tugadi. Asosiy narsani bitta fikrga yig\'amiz.', 'Урок закончен. Соберём главное в одну мысль.', 'The lesson is over. Let us gather the main point into one thought.'),
    A('mount', 'Tengsizlik javobi son emas, to\'plam. U o\'qda yig\'iladi.', 'Ответ неравенства это не число, а множество. Оно собирается на оси.', 'The answer to an inequality is not a number but a set. It is built on the axis.'),
    A('forecast', 'Endi dars boshiga qaytamiz.', 'А теперь вернёмся к началу урока.', 'And now let us go back to the start of the lesson.'),
    A('links', 'Oltinchi darsda siz xuddi shunday tengsizlikni grafik bo\'yicha yechgansiz. Bu o\'sha javob, faqat boshqa tomondan ko\'rilgan.', 'На шестом уроке ты решал такое же неравенство по графику. Это тот же ответ, только увиденный с другой стороны.', 'In lesson six you solved the same kind of inequality from a graph. It is the same answer, seen from another side.'),
    A('links', "O'n yettinchi darsda esa nuqtalar maxrajdan kela boshlaydi. Bunday nuqtalar doim ochiq, va nima uchun ekanini ko'ramiz.", 'А на семнадцатом уроке точки начнут приходить из знаменателя. Такие точки всегда пустые, и мы посмотрим почему.', 'And in lesson seventeen the points will start coming from the denominator. Such points are always hollow, and we will see why.'),
  ],
}

function Screen15({ screen, forecast, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S15.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [open, setOpen] = useState(0)
  const wasRight = forecast === 'b'
  const forecastLabel = useMemo(() => {
    const found = S1.probe.items.find((it) => it.id === forecast)
    return found ? (typeof found.label === 'string' ? found.label : t(found.label)) : '—'
  }, [forecast, t])

  const reveal = () => {
    const n = open + 1
    setOpen(n)
    audio.step(n === 1 ? 'forecast' : 'links')
  }

  return (
    <Frame meta={S15} screen={screen} audio={audio} solved {...rest}>
      <AxisStill {...S15.axis} h={92} />
      <Hint>{t(S15.rule)}</Hint>
      <Slot mh={92}>
        {open >= 1 ? (
          <div className="lc-in" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <DoneRow>{t(S15.forecastTag)}: {forecastLabel}</DoneRow>
            <DoneRow>{t(S15.rightTag)}: {S15.right}</DoneRow>
            <Hint>{t(wasRight ? S15.wasRight : S15.wasWrong)}</Hint>
          </div>
        ) : null}
      </Slot>
      <Slot mh={74}>
        {open >= 2 ? (
          <div className="lc-in" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Hint>{t(S15.linkBack)}</Hint>
            <Hint>{t(S15.linkFwd)}</Hint>
          </div>
        ) : null}
      </Slot>
      <Slot mh={46}>
        {open < 2 ? <Btn tone="soft" ready onClick={reveal}>{t(UI.goOn)}</Btn> : null}
      </Slot>
    </Frame>
  )
}

// ============================================================
const SCREENS = [
  Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8,
  Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
]

export default function Grade9Dars15({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
}) {
  const lang = langProp === 'uz' || langProp === 'ru' || langProp === 'en' ? langProp : 'ru'
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    studentName: studentName || '',
    voiceGender: voiceGender || 'm', // 9-sinf: erkak ovoz (metodist qarori 2026-08-06)
    freeNav: true, // ishlab chiqish fazasi; sinf topshirilganda false
  })
  useMobileZoom()

  const [screen, setScreen] = useState(0)
  const [answers, setAnswers] = useState([])
  const [forecast, setForecast] = useState(null)
  const [finished, setFinished] = useState(false)
  const startedAt = useRef(Date.now())

  const onAnswer = useCallback((payload) => {
    if (payload && payload.forecast) setForecast(payload.forecast)
    setAnswers((prev) => prev.concat(payload))
  }, [])

  const next = useCallback(() => setScreen((s) => Math.min(s + 1, TOTAL - 1)), [])
  const prev = useCallback(() => setScreen((s) => Math.max(s - 1, 0)), [])

  const finish = useCallback(() => {
    setFinished(true)
    const scored = answers.filter((a) => a && typeof a.correct === 'boolean')
    const firstTry = scored.filter((a) => a.correct && (a.attempts || 1) === 1)
    const payload = {
      lessonId: LESSON_ID,
      lessonTitle: tr(LESSON_TITLE, lang),
      lang,
      completed: true,
      durationSec: Math.floor((Date.now() - startedAt.current) / 1000),
      totalQuestions: scored.length,
      correctAnswers: scored.filter((a) => a.correct).length,
      firstTryStats: { total: scored.length, firstTryCorrect: firstTry.length },
      forecast,
      freeNav: getFreeNav(),
      answers,
    }
    if (onFinished) onFinished(payload)
    else console.log('[Grade9 Dars15] onFinished', payload)
  }, [answers, forecast, lang, onFinished])

  const Current = SCREENS[screen]

  return (
    <LangProvider value={lang}>
      <style>{STYLES}</style>
      <style>{AXIS_STYLES}</style>
      <div className="lesson-root" lang={lang}>
        <Current
          key={screen}
          screen={screen}
          lang={lang}
          forecast={forecast}
          onAnswer={onAnswer}
          onPrev={prev}
          onNext={next}
          onFinish={finish}
          finished={finished}
        />
      </div>
    </LangProvider>
  )
}
