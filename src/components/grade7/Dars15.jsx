// ============================================================================
// 7-sinf, Dars 15. BIR HAD VA UNING STANDART SHAKLI.
// (Одночлен и его стандартный вид)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md. B3 bloki, uchinchi dars.
// ASBOB: `FactorTape` -- lenta, endi ARALASH elementlar bilan (`mixed`).
// Yangi asbob yozilmadi.
//
// STANDART SHAKL LENTANI TARTIBLASHDIR. 2 karra a karra 3 karra b karra a
// lentasida sonlar ham, harflar ham aralash turadi. Standart shaklga
// keltirish -- ularni saralash: sonlarni ko'paytirish, bir xil harflarni
// sanash. Asbob lentada NIMA borligini aytadi, yozuvni esa o'quvchi yig'adi.
//
// DARSNING O'ZAGI -- KOEFFITSIYENT. Darslik aniq aytadi: −b ning
// koeffitsiyenti (−1), px ning koeffitsiyenti 1. O'quvchi esa minus b da
// koeffitsiyentni bir deb o'qiydi va ishorani yo'qotadi. Lenta bu yerda ham
// ishlaydi: minus lentaning ELEMENTI, ya'ni (−1) muljiteli.
//
// QIYINLIK DARAJASI (metodist qarori 2026-08-20). Misollar harfli va
// ko'rsatkichi harfli ham bo'ladi: cⁿ karra c²ⁿ karra c⁵ⁿ. Ko'chirish esa
// darslikning qo'shma misoli: 2⁹ karra (2⁵)⁶ karra (2⁴)⁵ ni 2⁵⁴ ga bo'lish.
// Bunday misolni tanish yo'l bilan yechib bo'lmaydi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Btn,
  DoneRow,
  Fx,
  HackNote,
  Hint,
  L,
  LangProvider,
  LangSetProvider,
  STYLES,
  Stage,
  Tag,
  Title,
  configureLesson,
  getFreeNav,
  tr,
  useAdvanceGate,
  useAudio,
  useInstructionGate,
  qMeta,
  useMobileZoom,
  useT,
} from './core.jsx'
import {
  AuditRows,
  FactorTape,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  StairsReveal,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_15'
const LESSON_TITLE = L('Bir had va uning standart shakli', 'Одночлен и его стандартный вид', 'A monomial and its standard form')
const LESSON_NO = L('15-dars', 'Урок 15', 'Lesson 15')
const TOTAL = 15

const BLOCK = { label: L('B3-blok', 'Блок Б3', 'Block B3'), from: 13, to: 17, current: 15 }

const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

const buildSegments = (list, lang) =>
  list.map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: s.on === 'mount' ? (i === 0 ? 'on_mount' : 'after_previous') : 'on_event:' + s.on,
    waits_for: null,
  }))

const UI = {
  next: L('Davom etish', 'Продолжить', 'Continue'),
  back: L('Orqaga', 'Назад', 'Back'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish the lesson'),
  saved: L('Natija saqlandi', 'Результат сохранён', 'Result saved'),
}

const TAGS = {
  Z1: L('minus koeffitsiyentga kirmadi', 'минус не вошёл в коэффициент', 'the minus stayed out of the coefficient'),
  Z2: L("sonlar ko'paytirilmadi", 'числа не перемножены', 'the numbers were not multiplied'),
  Z3: L('bir xil harflar sanalmadi', 'одинаковые буквы не посчитаны', 'equal letters were not counted'),
  Z4: L("yig'indi bir had deb olindi", 'сумма принята за одночлен', 'a sum was taken for a monomial'),
  Z5: L('muljitellar sanalmadi', 'множители не посчитаны', 'the factors were not counted'),
  Z6: L('amallar tartibi', 'порядок действий', 'order of operations'),
}

const uniqueTags = (answers) => {
  const out = []
  ;(answers || []).forEach((a) => {
    ;((a && a.tags) || []).forEach((tag) => {
      if (TAGS[tag] && out.indexOf(tag) === -1) out.push(tag)
    })
  })
  return out
}

const levelOf = (firstTry, total) => {
  if (firstTry === null || firstTry === undefined) return 'none'
  if (firstTry >= total) return 'closed'
  if (firstTry === total - 1) return 'one'
  return 'back'
}

function Frame({ meta, screen, audio, solved, onPrev, onNext, onFinish, finished, children }) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  const nav = {
    back: meta.noBack ? null : (
      <Btn tone="ghost" onClick={onPrev} disabled={screen === 0}>{t(UI.back)}</Btn>
    ),
    next: last ? (
      <Btn tone="accent" onClick={onFinish} disabled={finished}>
        {finished ? t(UI.saved) : t(UI.finish)}
      </Btn>
    ) : (
      <Btn onClick={onNext} disabled={!canNext} ready={canNext}>{t(UI.next)}</Btn>
    ),
  }
  return (
    <Stage
      eyebrow={t(meta.eyebrow)}
      block={{ ...BLOCK, label: t(BLOCK.label) }}
      screen={screen}
      total={TOTAL}
      audio={audio}
      nav={nav}
      field={meta.field}
      noNotes={meta.noNotes}
    >
      {meta.method ? <Tag tone="accent">{t(meta.method)}</Tag> : null}
      {meta.ownTitle ? null : <Title>{t(meta.title)}</Title>}
      {children}
      {meta.reward && solved ? (
        <HackNote tone="ok" bottom title={t(meta.reward.title)}>{t(meta.reward.text)}</HackNote>
      ) : null}
      {meta.hack && solved ? <HackNote bottom>{t(meta.hack)}</HackNote> : null}
      {meta.bonus && solved ? (
        <HackNote bottom title={t(meta.bonus.title)}>{t(meta.bonus.text)}</HackNote>
      ) : null}
    </Stage>
  )
}

// ============================================================
// EKRAN 1. XUK. −b ning koeffitsiyenti. Tablolarda KOEFFITSIYENT turadi.
// ============================================================
const S1 = {
  eyebrow: L('BIR HAD', 'ОДНОЧЛЕН', 'MONOMIALS'),
  noBack: true,
  noNotes: true,
  title: L("Minus b ning koeffitsiyenti", 'Коэффициент у минус b', 'The coefficient of minus b'),
  gate: {
    source: { kind: 'plain', tokens: ['−b'] },
    rows: [
      { tokens: ['1'], value: '1' },
      { tokens: ['−1'], value: '−1' },
    ],
  },
  probe: {
    question: L(
      "Tabloda ikki xil koeffitsiyent turibdi. Qaysi biri to'g'ri?",
      'На табло два разных коэффициента. Какой из них верный?',
      'The boards show two different coefficients. Which is right?',
    ),
    items: [
      {
        id: 'neg',
        label: L(
          "Minus bir: minus ham koeffitsiyentga kiradi",
          'Минус один: минус тоже входит в коэффициент',
          'Minus one: the minus belongs to the coefficient',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Lentada buni ko'ramiz.",
          'Прогноз принят. Увидим это на ленте.',
          'Your prediction is taken. We will see it on the tape.',
        ),
      },
      {
        id: 'one',
        label: L("Bir: harf oldida son yozilmagan", 'Один: перед буквой числа не написано', 'One: no number is written before the letter'),
        hint: L(
          "Son yozilmagan, lekin ishora yozilgan. b ni minus bir marta olish bilan bir xil.",
          'Числа не написано, но знак написан. Это то же, что взять b минус один раз.',
          'No number is written, but a sign is. It is the same as taking b minus one time.',
        ),
      },
      {
        id: 'zero',
        label: L("Nol: koeffitsiyent yo'q", 'Нуль: коэффициента нет', 'Zero: there is no coefficient'),
        hint: L(
          "Nol koeffitsiyent butun bir hadni nolga aylantirardi. Bizda esa b bor.",
          'Нулевой коэффициент обратил бы весь одночлен в нуль. А у нас есть b.',
          'A zero coefficient would turn the whole monomial into zero. But we have b.',
        ),
      },
      {
        id: 'b',
        label: L("b ning o'zi", 'Само b', 'The b itself'),
        hint: L(
          "Koeffitsiyent bu SON. b esa harf, u koeffitsiyent bo'lolmaydi.",
          'Коэффициент это ЧИСЛО. А b это буква, она не может быть коэффициентом.',
          'A coefficient is a NUMBER. The b is a letter and cannot be one.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "O'n to'rtinchi darsda xossalarni sanab chiqardik. Endi bir hadning o'ziga qaraymiz.", 'В четырнадцатом уроке мы вывели свойства счётом. Теперь посмотрим на сам одночлен.', 'In lesson fourteen we counted out the properties. Now let us look at the monomial itself.'),
    A('mount', "Yozuv juda qisqa: minus b. Uning koeffitsiyenti nima.", 'Запись очень короткая: минус b. Каков её коэффициент.', 'The record is very short: minus b. What is its coefficient.'),
    A('mount', "Ikki o'quvchi ikki xil javob berdi.", 'Два ученика дали разные ответы.', 'Two students gave different answers.'),
    A('mount', "Sizningcha qaysi biri. Bu taxmin, uning uchun baho yo'q.", 'Как думаешь, какой. Это прогноз, оценки за него нет.', 'Which one do you think. This is a prediction, it is not graded.'),
  ],
}

function Screen1({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S1.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [picked, setPicked] = useState(null)
  return (
    <Frame meta={S1} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <TwoRoutes source={S1.gate.source} rows={S1.gate.rows} />
      <Probe
        data={S1.probe}
        cols={2}
        unscored
        fbSlot={0}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setPicked(r.picked); onAnswer({ ...r, screen, role: 'hook' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 2. TAYANCH. KVOTA EKRANI (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
  items: [
    {
      prompt: 'a · a · a · a',
      ok: L("To'rtta muljitel to'rtinchi darajani beradi.", 'Четыре множителя дают четвёртую степень.', 'Four factors give the fourth power.'),
      items: [
        { id: 'a', label: 'a⁴', correct: true },
        { id: 'b', label: '4a', tag: 'Z3', hint: L("4a bu to'rtta a ning YIG'INDISI. Bu yerda esa ko'paytma.", '4a это СУММА четырёх a. А здесь произведение.', '4a is the SUM of four a. Here it is a product.') },
        { id: 'c', label: 'a⁸', tag: 'Z5', hint: L("Sakkiz sakkizta muljiteldan chiqadi. Lentada esa to'rtta.", 'Восемь выходит из восьми множителей. А в ленте четыре.', 'Eight comes from eight factors. The tape has four.') },
        { id: 'd', label: '4a⁴', tag: 'Z3', hint: L("Koeffitsiyent yig'indidan kelardi, ko'paytmadan emas.", 'Коэффициент пришёл бы от суммы, а не от произведения.', 'A coefficient would come from a sum, not a product.') },
      ],
    },
    {
      prompt: '2 · 3 · 5',
      ok: L("Sonlar birga ko'paytiriladi.", 'Числа перемножаются вместе.', 'The numbers multiply together.'),
      items: [
        { id: 'a', label: '30', correct: true },
        { id: 'b', label: '10', tag: 'Z2', hint: L("O'n bu 2 qo'shuv 3 qo'shuv 5. Bu yerda ko'paytirish.", 'Десять это 2 плюс 3 плюс 5. А здесь умножение.', 'Ten is 2 plus 3 plus 5. Here it is multiplication.') },
        { id: 'c', label: '15', tag: 'Z2', hint: L("15 bu 3 karra 5. Ikkilik ham hisobga olinishi kerak.", '15 это 3 умножить на 5. Двойку тоже надо учесть.', '15 is 3 times 5. The two must be counted as well.') },
        { id: 'd', label: '6', tag: 'Z2', hint: L("6 bu 2 karra 3. Beshlik qoldi.", '6 это 2 умножить на 3. Пятёрка осталась.', '6 is 2 times 3. The five is left over.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("−3ab yozuvida koeffitsiyent qaysi?", 'Какой коэффициент в записи −3ab?', 'What is the coefficient in −3ab?'),
      ok: L("Harflar oldidagi son, ishorasi bilan.", 'Число перед буквами, вместе со знаком.', 'The number before the letters, with its sign.'),
      items: [
        { id: 'a', label: '−3', correct: true },
        { id: 'b', label: '3', tag: 'Z1', hint: L("Ishora ham koeffitsiyentga kiradi.", 'Знак тоже входит в коэффициент.', 'The sign belongs to the coefficient too.') },
        { id: 'c', label: 'ab', tag: 'Z1', hint: L("Bu harfli qism. Koeffitsiyent esa son.", 'Это буквенная часть. А коэффициент это число.', 'That is the letter part. The coefficient is a number.') },
        { id: 'd', label: '−3ab', tag: 'Z1', hint: L("Bu butun bir had. Koeffitsiyent uning faqat sonli qismi.", 'Это весь одночлен. А коэффициент только его числовая часть.', 'That is the whole monomial. The coefficient is only its numeric part.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta savolga javob beramiz.", 'Ответим на три вопроса.', 'Three things to recall.'),
    A('1', "Ikkinchisi sonlar haqida.", 'Второе про числа.', 'The second is about numbers.'),
    A('2', "Uchinchisi koeffitsiyent haqida.", 'Третье про коэффициент.', 'The third is about the coefficient.'),
  ],
}

function Screen2({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S2.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const [at, setAt] = useState(0)
  return (
    <Frame meta={qMeta(S2, at)} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S2.items}
        question={S2.question}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => { setAt(i); audio.step(String(i)) }}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'support' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 3. ARALASH LENTA. Sonlar va harflar aralash turadi, standart
// shaklga keltirish -- ularni SARALASH.
// ============================================================
const S3 = {
  eyebrow: L('ARALASH LENTA', 'СМЕШАННАЯ ЛЕНТА', 'A MIXED TAPE'),
  title: L('Sonlar va harflar aralash', 'Числа и буквы вперемешку', 'Numbers and letters mixed up'),
  tape: {
    expr: '2 · a · 3 · b · a',
    mixed: ['2', 'a', '3', 'b', 'a'],
    options: [
      { id: 'a', label: '6a²b' },
      { id: 'b', label: '5a²b' },
      { id: 'c', label: '6ab' },
      { id: 'd', label: '6a²b²' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z2', hint: L("Besh bu 2 qo'shuv 3. Sonlar KO'PAYTIRILADI: 2 karra 3 teng 6.", 'Пять это 2 плюс 3. Числа УМНОЖАЮТСЯ: 2 на 3 это 6.', 'Five is 2 plus 3. The numbers MULTIPLY: 2 times 3 is 6.') },
      { key: 'c', tag: 'Z3', hint: L("Lentada ikkita a bor, demak a kvadrat.", 'В ленте два a, значит a в квадрате.', 'The tape holds two a, so a squared.') },
      { key: 'd', tag: 'Z3', hint: L("b esa bitta. Uning ko'rsatkichi bir, va u yozilmaydi.", 'А b одна. Её показатель единица, и он не пишется.', 'But there is one b. Its exponent is one and is not written.') },
      { key: '*', tag: 'Z5', hint: L("Lenta tagidagi hisobga qarang: sonlar va har harfning soni.", 'Посмотри на счёт под лентой: числа и количество каждой буквы.', 'Look at the tally under the tape: the numbers and how many of each letter.') },
    ],
    note: L(
      "Standart shakl: koeffitsiyent oldinda, harflar orqasida.",
      'Стандартный вид: коэффициент впереди, буквы за ним.',
      'Standard form: the coefficient first, the letters after.',
    ),
  },
  reward: {
    title: L('Standart shakl bu tartib', 'Стандартный вид это порядок', 'Standard form is an order'),
    text: L(
      "Lentadagi elementlar o'rin almashtirsa ham ko'paytma o'zgarmaydi. Shuning uchun ularni saralab yozish mumkin.",
      'Произведение не меняется от перестановки элементов ленты. Поэтому их можно записать отсортированными.',
      'Rearranging the tape does not change the product. So the elements can be written sorted.',
    ),
  },
  audio: [
    A('mount', "Yozuvni bosing, lenta ochiladi.", 'Нажми на запись, лента раскроется.', 'Tap the record, the tape unfolds.'),
    A('open', "Lentada ikkita son va uchta harf bor. Hisob tagida turibdi.", 'В ленте два числа и три буквы. Счёт стоит под ней.', 'The tape holds two numbers and three letters. The tally is below.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S3.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      <FactorTape
        audio={audio}
        expr={S3.tape.expr}
        mixed={S3.tape.mixed}
        options={S3.tape.options}
        answer={S3.tape.answer}
        wrongs={S3.tape.wrongs}
        note={S3.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. YOZILMAGAN KOEFFITSIYENT. px da bir, −b da minus bir.
// ============================================================
const S4 = {
  eyebrow: L('YOZILMAGAN SON', 'НЕНАПИСАННОЕ ЧИСЛО', 'THE UNWRITTEN NUMBER'),
  title: L("Koeffitsiyent ko'rinmasa ham bor", 'Коэффициент есть, даже если его не видно', 'The coefficient is there even when unseen'),
  rounds: [
    {
      template: ['px  →  ', { slot: 0 }],
      parts: [{ id: 'a', label: '1' }, { id: 'b', label: '0' }, { id: 'c', label: 'p' }, { id: 'd', label: 'x' }],
      answer: ['a'],
      prompt: L(
        "px yozuvining koeffitsiyenti qanday?",
        'Каков коэффициент записи px?',
        'What is the coefficient of px?',
      ),
      checkNote: L("Bir marta olingan har qanday narsa o'zi bo'lib qoladi, shuning uchun bir yozilmaydi", 'Взятое один раз остаётся собой, поэтому единицу не пишут', 'Taken once a thing stays itself, so the one is not written'),
      wrongs: [
        { key: 'b', tag: 'Z1', hint: L("Nol koeffitsiyent butun yozuvni nolga aylantirardi.", 'Нулевой коэффициент обратил бы всю запись в нуль.', 'A zero coefficient would turn the whole record into zero.') },
        { key: '*', tag: 'Z1', hint: L("Koeffitsiyent bu SON. Bu yozuvda son ko'rinmaydi, lekin u bor.", 'Коэффициент это ЧИСЛО. В этой записи числа не видно, но оно есть.', 'A coefficient is a NUMBER. None is visible here, but it is there.') },
      ],
    },
    {
      template: ['−b  →  ', { slot: 0 }],
      parts: [{ id: 'e', label: '−1' }, { id: 'f', label: '1' }, { id: 'g', label: '−b' }, { id: 'h', label: '0' }],
      answer: ['e'],
      prompt: L(
        "Endi minus b. Xukdagi savol shu edi.",
        'Теперь минус b. Это и был вопрос с хука.',
        'Now minus b. That was the hook question.',
      ),
      checkNote: L("Minus ishorasi koeffitsiyentning bir qismi: b ni minus bir marta olish", 'Знак минус часть коэффициента: взять b минус один раз', 'The minus is part of the coefficient: take b minus one time'),
      wrongs: [
        { key: 'f', tag: 'Z1', hint: L("Ishora yo'qolib qoldi. Minus koeffitsiyentga kiradi.", 'Знак потерялся. Минус входит в коэффициент.', 'The sign got lost. The minus belongs to the coefficient.') },
        { key: '*', tag: 'Z1', hint: L("Koeffitsiyent son bo'ladi va ishorasi bilan olinadi.", 'Коэффициент это число, и берут его со знаком.', 'The coefficient is a number and it comes with its sign.') },
      ],
    },
  ],
  reward: {
    title: L('Ikki holat, bitta qoida', 'Два случая, одно правило', 'Two cases, one rule'),
    text: L(
      "Son yozilmagan bo'lsa, u bir. Faqat minus turgan bo'lsa, u minus bir. Ikkalasida ham koeffitsiyent bor.",
      'Если число не написано, оно единица. Если стоит только минус, оно минус единица. Коэффициент есть в обоих случаях.',
      'If no number is written it is one. If only a minus stands there it is minus one. Either way there is a coefficient.',
    ),
  },
  audio: [
    A('mount', "Ba'zan koeffitsiyent yozilmaydi. Bu uning yo'qligini bildirmaydi.", 'Иногда коэффициент не пишут. Это не значит, что его нет.', 'Sometimes the coefficient is not written. That does not mean it is absent.'),
    A('r1', "Endi ishorali holat.", 'Теперь случай со знаком.', 'Now the case with a sign.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S4.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const done = idx >= S4.rounds.length
  const r = S4.rounds[idx]
  return (
    <Frame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
      {!done ? (
        <SlotFill
          key={idx}
          audio={audio}
          template={r.template}
          parts={r.parts}
          answer={r.answer}
          prompt={r.prompt}
          checkNote={r.checkNote}
          wrongs={r.wrongs}
          wide
          disabled={!canAnswer}
          onSolved={(res) => {
            const next = idx + 1
            setIdx(next)
            audio.step('r' + next)
            onAnswer({ ...res, screen, role: 'explain', part: 'r' + (idx + 1) })
          }}
        />
      ) : (
        <>
          <DoneRow>px  →  1</DoneRow>
          <DoneRow>−b  →  −1</DoneRow>
        </>
      )}
    </Frame>
  )
}

// ============================================================
// EKRAN 5. ISHORA LENTANING ELEMENTI. −3 · x · y · x.
// ============================================================
const S5 = {
  eyebrow: L('ISHORA LENTADA', 'ЗНАК В ЛЕНТЕ', 'THE SIGN IN THE TAPE'),
  title: L('Manfiy son ham oddiy element', 'Отрицательное число такой же элемент', 'A negative number is just another element'),
  tape: {
    expr: '−3 · x · y · x',
    mixed: ['−3', 'x', 'y', 'x'],
    options: [
      { id: 'a', label: '−3x²y' },
      { id: 'b', label: '3x²y' },
      { id: 'c', label: '−3xy' },
      { id: 'd', label: '−3x²y²' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z1', hint: L("Lentada bitta manfiy element bor, u yo'qolmaydi.", 'В ленте один отрицательный элемент, он не исчезает.', 'The tape holds one negative element and it does not vanish.') },
      { key: 'c', tag: 'Z3', hint: L("Ikkita x bor, demak x kvadrat.", 'Два x, значит x в квадрате.', 'Two x, so x squared.') },
      { key: 'd', tag: 'Z3', hint: L("y esa bitta.", 'А y одна.', 'But there is one y.') },
      { key: '*', tag: 'Z5', hint: L("Hisobga qarang: son va har harfning soni.", 'Посмотри на счёт: число и количество каждой буквы.', 'Look at the tally: the number and how many of each letter.') },
    ],
    note: L(
      "Koeffitsiyent ishorasi bilan yoziladi va harflar oldiga qo'yiladi.",
      'Коэффициент пишут со знаком и ставят перед буквами.',
      'The coefficient is written with its sign and placed before the letters.',
    ),
  },
  audio: [
    A('mount', "Bu safar lentada manfiy son bor.", 'На этот раз в ленте отрицательное число.', 'This time the tape holds a negative number.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S5.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <FactorTape
        audio={audio}
        expr={S5.tape.expr}
        mixed={S5.tape.mixed}
        options={S5.tape.options}
        answer={S5.tape.answer}
        wrongs={S5.tape.wrongs}
        note={S5.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 6. O'ZINGIZ. Kasr koeffitsiyent: 0,5 · a · b · a · b.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Koeffitsiyent kasr ham bo\'ladi', 'Коэффициент бывает и дробным', 'A coefficient can be a decimal too'),
  tape: {
    expr: '0,5 · a · b · a · b',
    mixed: ['0,5', 'a', 'b', 'a', 'b'],
    options: [
      { id: 'a', label: '0,5a²b²' },
      { id: 'b', label: '0,5a²b' },
      { id: 'c', label: 'a²b²' },
      { id: 'd', label: '2a²b²' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z3', hint: L("Lentada ikkita b bor.", 'В ленте два b.', 'The tape holds two b.') },
      { key: 'c', tag: 'Z2', hint: L("Koeffitsiyent yo'qolib qolmaydi, u nol butun besh.", 'Коэффициент не исчезает, он нуль целых пять.', 'The coefficient does not vanish, it is zero point five.') },
      { key: 'd', tag: 'Z2', hint: L("Ikki bu nol butun beshning teskarisi. Lentadagi son o'zgarmaydi.", 'Два это обратное к нулю целых пяти. Число в ленте не меняется.', 'Two is the reciprocal of zero point five. The number in the tape does not change.') },
      { key: '*', tag: 'Z5', hint: L("Hisobda son ham, harflar soni ham turibdi.", 'В счёте стоят и число, и количество букв.', 'The tally shows the number and the letter counts.') },
    ],
    note: L(
      "Kasr koeffitsiyent ham oddiy koeffitsiyent kabi oldinda turadi.",
      'Дробный коэффициент так же стоит впереди.',
      'A decimal coefficient stands in front just the same.',
    ),
  },
  audio: [
    A('mount', "Endi o'zingiz. Koeffitsiyent kasr.", 'Теперь сам. Коэффициент дробный.', 'Now on your own. The coefficient is a decimal.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S6.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S6} screen={screen} audio={audio} solved={done} {...rest}>
      <FactorTape
        audio={audio}
        expr={S6.tape.expr}
        mixed={S6.tape.mixed}
        options={S6.tape.options}
        answer={S6.tape.answer}
        wrongs={S6.tape.wrongs}
        note={S6.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 7. CHEGARAVIY HOLAT. 5ab qo'shuv 5c -- bu bir had EMAS.
// KVOTA EKRANI.
// ============================================================
const S7 = {
  eyebrow: L('BIR HADMI', 'ОДНОЧЛЕН ЛИ', 'IS IT A MONOMIAL'),
  title: L("Har yozuv bir had bo'lmaydi", 'Не всякая запись одночлен', 'Not every record is a monomial'),
  expr: '5ab + 5c',
  probe: {
    question: L(
      "Bu yozuv bir hadmi?",
      'Является ли эта запись одночленом?',
      'Is this record a monomial?',
    ),
    items: [
      {
        id: 'no', correct: true,
        label: L("Yo'q: bu ko'paytma emas, yig'indi", 'Нет: это не произведение, а сумма', 'No: it is a sum, not a product'),
      },
      {
        id: 'yes', tag: 'Z4',
        label: L('Ha: unda son ham, harflar ham bor', 'Да: в ней есть и число, и буквы', 'Yes: it has a number and letters'),
        hint: L("Son va harf bo'lishi yetmaydi. Bir had faqat KO'PAYTMADAN tuziladi, bu yerda esa qo'shish belgisi bor.", 'Наличия числа и букв недостаточно. Одночлен состоит только из ПРОИЗВЕДЕНИЯ, а здесь стоит знак сложения.', 'Having a number and letters is not enough. A monomial is only a PRODUCT, and here there is a plus.'),
      },
      {
        id: 'part', tag: 'Z4',
        label: L("Ha, chunki 5ab bir had", 'Да, ведь 5ab одночлен', 'Yes, since 5ab is a monomial'),
        hint: L("5ab haqiqatan bir had, 5c ham. Lekin ularning YIG'INDISI bir had emas.", '5ab действительно одночлен, и 5c тоже. Но их СУММА одночленом не является.', '5ab really is a monomial and so is 5c. But their SUM is not one.'),
      },
      {
        id: 'simplify', tag: 'Z4',
        label: L("Ha, uni 10abc ga keltirish mumkin", 'Да, её можно привести к 10abc', 'Yes, it can be reduced to 10abc'),
        hint: L("Bunday ixchamlash mumkin emas: hadlar o'xshash emas, harflari boshqa. Oltinchi darsdagi qoida shu edi.", 'Такое приведение невозможно: слагаемые не подобны, буквы разные. Это правило шестого урока.', 'No such collecting is possible: the terms are not alike, the letters differ. That was the rule of lesson six.'),
      },
    ],
    ok: L(
      "Bir had faqat ko'paytmadan tuziladi. Qo'shish belgisi bor bo'lsa, bu boshqa narsa.",
      'Одночлен состоит только из произведения. Если есть знак сложения, это уже другое.',
      'A monomial is built only from a product. A plus sign makes it something else.',
    ),
  },
  bonus: {
    title: L('Keyingi blokda nomi bo\'ladi', 'В следующем блоке у этого будет имя', 'In the next block this gets a name'),
    text: L(
      "Bir hadlarning yig'indisi ham matematik ob'ekt, va u to'rtinchi blokda o'z nomini oladi.",
      'Сумма одночленов тоже математический объект, и в четвёртом блоке она получит своё имя.',
      'A sum of monomials is a mathematical object too, and it gets its name in block four.',
    ),
  },
  audio: [
    A('mount', "Bu yozuvda son ham, harflar ham bor. Lekin savol boshqa.", 'В этой записи есть и число, и буквы. Но вопрос другой.', 'This record has a number and letters. But the question is different.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S7.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S7} screen={screen} audio={audio} solved={done} {...rest}>
      <div className="g7-eqb-lone"><Fx>{S7.expr}</Fx></div>
      <Probe
        data={S7.probe}
        cols={2}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 8. QOIDA. Maydon TO'Q SARIQ.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("bir had bu sonlar va harflar ko'paytmasi", 'одночлен это произведение чисел и букв', 'a monomial is a product of numbers and letters') },
    { id: 'f2', label: L('sonlar birga ko\'paytiriladi', 'числа перемножают вместе', 'the numbers multiply together') },
    { id: 'f3', label: L('bir xil harflar sanaladi', 'одинаковые буквы считают', 'equal letters are counted') },
    { id: 'f4', label: L('koeffitsiyent oldinga yoziladi', 'коэффициент пишут впереди', 'the coefficient is written first') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval bir had nima, keyin sonlar, keyin harflar, oxirida yozuv.",
    'Порядок нарушен. Сначала что такое одночлен, потом числа, потом буквы, в конце запись.',
    'The order is off. First what a monomial is, then the numbers, then the letters, and the notation last.',
  ),
  lawChips: [
    { label: '·', tone: 'par' },
    { label: '6', tone: 's1' },
    { label: 'a²b', tone: 's2' },
    { label: '6a²b', tone: 'off' },
  ],
  lawSweep: L(
    "ko'paytma, sonlar, harflar, standart shakl",
    'произведение, числа, буквы, стандартный вид',
    'product, numbers, letters, standard form',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Sonli va harfli muljitellar ko'paytmasidan tuzilgan ifoda bir had deyiladi. Harflar oldida turgan son koeffitsiyent deb ataladi.",
        'Выражение, составленное из произведения числовых и буквенных множителей, называют одночленом. Число перед буквами называют коэффициентом.',
        'An expression made of a product of numeric and letter factors is called a monomial. The number before the letters is the coefficient.',
      ),
      L(
        "Standart shaklda koeffitsiyent oldinda turadi, harflar esa darajalari bilan orqasida. Son yozilmagan bo'lsa koeffitsiyent bir, faqat minus turgan bo'lsa minus bir.",
        'В стандартном виде коэффициент стоит впереди, а буквы со своими степенями за ним. Если число не написано, коэффициент равен единице, если стоит только минус — минус единице.',
        'In standard form the coefficient comes first and the letters with their powers follow. With no number written the coefficient is one, with only a minus it is minus one.',
      ),
    ],
  },
  hookCap: L(
    "Standart shakl bu tartiblangan lenta",
    'Стандартный вид это упорядоченная лента',
    'Standard form is the tape put in order',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("sonlar ko'paytiriladi", 'числа перемножают', 'numbers multiply'),
    L('harflar sanaladi', 'буквы считают', 'letters are counted'),
    L('ishora koeffitsiyentda', 'знак в коэффициенте', 'the sign is in the coefficient'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило.', 'We have seen all the cases. Now let us build the rule.'),
    A('ok', "To'g'ri.", 'Верно.', 'Correct.'),
  ],
}

function Screen8({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S8.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const rule = useMemo(() => ({ badge: t(S8.rule.badge), lines: S8.rule.lines.map(t) }), [t])
  return (
    <Frame meta={S8} screen={screen} audio={audio} solved={done} {...rest}>
      <RuleBuilder
        audio={audio}
        fragments={S8.fragments}
        answer={S8.answer}
        wrongHint={S8.wrongHint}
        tag="Z1"
        rule={rule}
        help={(
          <div className="g7-helpstrip">
            <Tag tone="quiet">{t(S8.helpLabel)}</Tag>
            {S8.helpRows.map((r, i) => <span key={i}>{t(r)}</span>)}
          </div>
        )}
        after={(
          <>
            <StairsReveal items={S8.lawChips} sweep={t(S8.lawSweep)} />
            <Hint>{t(S8.hookCap)}</Hint>
          </>
        )}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'rule' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 9. MASHQ 1. Uchtasi uch xil tomonni sinaydi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Uchta bir hadni tartibga solamiz", 'Приводим три одночлена в порядок', 'Putting three monomials in order'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Koeffitsiyent, standart shakl va bir hadning o'zi -- uchtasi ham tekshirildi.",
      'Коэффициент, стандартный вид и сам одночлен — все три проверены.',
      'The coefficient, the standard form and the monomial itself — all three checked.',
    ),
  },
  rounds: [
    {
      template: ['−ab³  →  ', { slot: 0 }],
      parts: [{ id: 'a', label: '−1' }, { id: 'b', label: '1' }, { id: 'c', label: '−3' }, { id: 'd', label: '3' }],
      answer: ['a'],
      prompt: L("Koeffitsiyentni yozing.", 'Запиши коэффициент.', 'Write the coefficient.'),
      checkNote: L("Son yozilmagan, faqat minus turibdi", 'Числа не написано, стоит только минус', 'No number is written, only a minus'),
      wrongs: [
        { key: 'b', tag: 'Z1', hint: L("Minus yo'qolib qoldi.", 'Минус потерялся.', 'The minus got lost.') },
        { key: 'c', tag: 'Z1', hint: L("Uchlik bu b ning ko'rsatkichi, koeffitsiyent emas.", 'Тройка это показатель b, а не коэффициент.', 'Three is the exponent of b, not the coefficient.') },
        { key: '*', tag: 'Z1', hint: L("Harflar oldida son yo'q, faqat ishora bor.", 'Перед буквами числа нет, есть только знак.', 'There is no number before the letters, only a sign.') },
      ],
    },
    {
      template: ['2a · 3a  →  ', { slot: 0 }],
      parts: [{ id: 'e', label: '6a²' }, { id: 'f', label: '5a²' }, { id: 'g', label: '6a' }, { id: 'h', label: '6a⁴' }],
      answer: ['e'],
      prompt: L("Standart shaklga keltiring.", 'Приведи к стандартному виду.', 'Put it in standard form.'),
      checkNote: L("Sonlar ko'paytiriladi, ikkita a esa a kvadratni beradi", 'Числа перемножаются, а два a дают a в квадрате', 'The numbers multiply and two a give a squared'),
      wrongs: [
        { key: 'f', tag: 'Z2', hint: L("Besh bu 2 qo'shuv 3. Sonlar ko'paytiriladi.", 'Пять это 2 плюс 3. Числа перемножают.', 'Five is 2 plus 3. The numbers multiply.') },
        { key: 'g', tag: 'Z3', hint: L("Ikkita a bor.", 'Есть два a.', 'There are two a.') },
        { key: '*', tag: 'Z5', hint: L("Lentada ikkita son va ikkita harf.", 'В ленте два числа и две буквы.', 'The tape holds two numbers and two letters.') },
      ],
    },
    {
      wrap: true,
      template: ['7 + x  →  ', { slot: 0 }],
      parts: [{ id: 'i', label: '✗' }, { id: 'j', label: '✓' }, { id: 'k', label: '7x' }, { id: 'l', label: '1' }],
      answer: ['i'],
      prompt: L(
        "Bu yozuv bir hadmi? Ha bo'lsa belgi qo'ying, yo'q bo'lsa chizib tashlang.",
        'Это одночлен? Если да, поставь галочку, если нет — крестик.',
        'Is this a monomial? Tick if yes, cross if no.',
      ),
      checkNote: L("Qo'shish belgisi bor, demak bu ko'paytma emas", 'Есть знак сложения, значит это не произведение', 'There is a plus, so it is not a product'),
      wrongs: [
        { key: 'j', tag: 'Z4', hint: L("Bir had faqat ko'paytmadan tuziladi. Bu yerda qo'shish bor.", 'Одночлен состоит только из произведения. А здесь сложение.', 'A monomial is only a product. Here there is a sum.') },
        { key: '*', tag: 'Z4', hint: L("Yozuvdagi belgiga qarang.", 'Посмотри на знак в записи.', 'Look at the sign in the record.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta savol, uch xil tomon.", 'Три вопроса, три разные стороны.', 'Three questions, three different angles.'),
    A('r1', "Ikkinchisi standart shakl.", 'Второй стандартный вид.', 'The second is standard form.'),
    A('r2', "Uchinchisi ta'rif haqida.", 'Третий про определение.', 'The third is about the definition.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S9.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [rows, setRows] = useState([])
  const done = idx >= S9.rounds.length
  const r = S9.rounds[idx]
  const LABELS = ['−ab³  →  −1', '2a · 3a  →  6a²', '7 + x  →  ✗']
  return (
    <Frame meta={S9} screen={screen} audio={audio} solved={done} {...rest}>
      {rows.map((row, i) => <DoneRow key={i}>{row}</DoneRow>)}
      {!done ? (
        <SlotFill
          key={idx}
          audio={audio}
          template={r.template}
          parts={r.parts}
          answer={r.answer}
          prompt={r.prompt}
          checkNote={r.checkNote}
          wrongs={r.wrongs}
          wide
          disabled={!canAnswer}
          onSolved={(res) => {
            setRows((prev) => prev.concat(LABELS[idx]))
            const next = idx + 1
            setIdx(next)
            audio.step('r' + next)
            onAnswer({ ...res, screen, role: 'practice', part: 'r' + (idx + 1) })
          }}
        />
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 10. MASHQ 2. Yo'naltirilgan aralash lenta, uchta harf.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L('Uchta harf bitta lentada', 'Три буквы в одной ленте', 'Three letters in one tape'),
  tape: {
    expr: '−2 · a · b · c · a · b',
    mixed: ['−2', 'a', 'b', 'c', 'a', 'b'],
    options: [
      { id: 'a', label: '−2a²b²c' },
      { id: 'b', label: '−2abc' },
      { id: 'c', label: '2a²b²c' },
      { id: 'd', label: '−2a²b²c²' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z3', hint: L("Ikkita a va ikkita b bor.", 'Есть два a и два b.', 'There are two a and two b.') },
      { key: 'c', tag: 'Z1', hint: L("Manfiy son lentada qoladi.", 'Отрицательное число остаётся в ленте.', 'The negative number stays in the tape.') },
      { key: 'd', tag: 'Z3', hint: L("c esa bitta.", 'А c одна.', 'But there is one c.') },
      { key: '*', tag: 'Z5', hint: L("Hisobda har harfning soni turibdi.", 'В счёте стоит количество каждой буквы.', 'The tally shows how many of each letter.') },
    ],
    note: L(
      "Harflar alifbo tartibida yoziladi: avval a, keyin b, keyin c.",
      'Буквы пишут по алфавиту: сначала a, потом b, потом c.',
      'The letters are written alphabetically: a, then b, then c.',
    ),
  },
  audio: [
    A('mount', "Yana lenta, endi unda uchta harf bor.", 'Снова лента, теперь в ней три буквы.', 'The tape again, now with three letters.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S10.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S10} screen={screen} audio={audio} solved={done} {...rest}>
      <FactorTape
        audio={audio}
        expr={S10.tape.expr}
        mixed={S10.tape.mixed}
        options={S10.tape.options}
        answer={S10.tape.answer}
        wrongs={S10.tape.wrongs}
        note={S10.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 11. MASHQ 3. ASBOBSIZ.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Lentasiz', 'Без ленты', 'Without the tape'),
  template: ['−x · 4 · y · x  →  ', { slot: 0 }],
  parts: [
    { id: 'a', label: '−4x²y' },
    { id: 'b', label: '4x²y' },
    { id: 'c', label: '−4xy' },
    { id: 'd', label: '−5x²y' },
  ],
  answer: ['a'],
  prompt: L(
    "Standart shaklga keltiring. Diqqat: birinchi element minus x.",
    'Приведи к стандартному виду. Внимание: первый элемент минус x.',
    'Put it in standard form. Careful: the first element is minus x.',
  ),
  checkNote: L(
    "Minus koeffitsiyentga ketadi, to'rtlik ham; ikkita x esa x kvadratni beradi",
    'Минус уходит в коэффициент, четвёрка тоже; два x дают x в квадрате',
    'The minus goes into the coefficient along with the four; two x give x squared',
  ),
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Minus yo'qolib qoldi. U koeffitsiyentga kiradi.", 'Минус потерялся. Он входит в коэффициент.', 'The minus got lost. It belongs in the coefficient.') },
    { key: 'c', tag: 'Z3', hint: L("Ikkita x bor: birinchi elementda va oxirgisida.", 'Есть два x: в первом элементе и в последнем.', 'There are two x: in the first element and the last.') },
    { key: 'd', tag: 'Z2', hint: L("Besh bu 4 qo'shuv 1. Koeffitsiyentlar KO'PAYTIRILADI: minus bir karra to'rt.", 'Пять это 4 плюс 1. Коэффициенты УМНОЖАЮТСЯ: минус один на четыре.', 'Five is 4 plus 1. Coefficients MULTIPLY: minus one times four.') },
  ],
  audio: [
    A('mount', "Endi lentasiz. Elementlarni o'zingiz saralaysiz.", 'Теперь без ленты. Элементы сортируешь сам.', 'Now without the tape. You sort the elements yourself.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S11.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S11} screen={screen} audio={audio} solved={done} {...rest}>
      <SlotFill
        audio={audio}
        template={S11.template}
        parts={S11.parts}
        answer={S11.answer}
        prompt={S11.prompt}
        checkNote={S11.checkNote}
        wrongs={S11.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 12. TUZOQ (§8.2). Koeffitsiyentda ishora yo'qolgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  task: L(
    "O'quvchi −x²y ning koeffitsiyentini a teng 2, y teng 3 da hisobladi.",
    'Ученик считал коэффициент −x²y, затем значение при x = 2, y = 3.',
    'A student took the coefficient of −x²y, then its value at x = 2, y = 3.',
  ),
  ask: L(
    "Yuqoridagi qatordan kelib chiqmagan qatorni toping.",
    'Найди строку, которая не следует из строки над ней.',
    'Find the line that does not follow from the line above it.',
  ),
  rows: [
    { id: 'r1', text: '−x²y' },
    { id: 'r2', text: L('koeffitsiyent: 1', 'коэффициент: 1', 'coefficient: 1') },
    { id: 'r3', text: '1 · 4 · 3' },
    { id: 'r4', text: '12' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r3: L("Bu qator ikkinchisidan to'g'ri kelib chiqadi: x kvadrat to'rt, y uch. Xato yuqoriroqda.", 'Эта строка верно следует из второй: x в квадрате четыре, y три. Ошибка выше.', 'This follows correctly from the second: x squared is four, y is three. The mistake is higher up.'),
    r4: L("Bu ko'paytirishning natijasi.", 'Это результат умножения.', 'That is the result of the multiplication.'),
  },
  tags: { r1: 'Z1', r3: 'Z1', r4: 'Z1' },
  proofFill: {
    // Shablonda SO'Z YO'Q: u tarjima qilinmaydi.
    template: [{ slot: 0 }, '  ·  4  ·  3  =  ', { slot: 1 }],
    parts: [{ id: 'a', label: '−1' }, { id: 'b', label: '−12' }, { id: 'c', label: '1' }, { id: 'd', label: '12' }],
    answer: ['a', 'b'],
    prompt: L(
      "Koeffitsiyentni ishorasi bilan qo'ying va qiymatni qayta hisoblang.",
      'Поставь коэффициент со знаком и пересчитай значение.',
      'Put in the coefficient with its sign and recompute the value.',
    ),
    checkNote: L(
    "−1 · 4 · 3 = −12",
    '−1 · 4 · 3 = −12',
    '−1 · 4 · 3 = −12',
  ),
    wrongs: [
      { key: 'a|d', tag: 'Z1', hint: L("Koeffitsiyent manfiy bo'lsa, natija ham manfiy bo'ladi.", 'Если коэффициент отрицательный, результат тоже отрицательный.', 'A negative coefficient makes the result negative.') },
      { key: '*', tag: 'Z1', hint: L("Harflar oldida faqat minus turibdi, demak koeffitsiyent minus bir.", 'Перед буквами стоит только минус, значит коэффициент минус один.', 'Only a minus stands before the letters, so the coefficient is minus one.') },
    ],
  },
  audio: [
    A('mount', "Hamma hisob to'g'ri, javob esa xato.", 'Все вычисления верны, а ответ неверный.', 'Every calculation is right and the answer is wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. Koeffitsiyentda ishora yo'qolgan.", 'Нашёл. В коэффициенте потерялся знак.', 'You found it. The sign was lost in the coefficient.'),
    A('done', "To'g'ri javob minus o'n ikki ekan.", 'Верный ответ оказался минус двенадцать.', 'The right answer is minus twelve.'),
  ],
}

function Screen12({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S12.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [found, setFound] = useState(false)
  const [done, setDone] = useState(false)
  const [proofIn, setProofIn] = useState(false)
  useEffect(() => {
    if (!found) return undefined
    const tmr = setTimeout(() => setProofIn(true), 620)
    return () => clearTimeout(tmr)
  }, [found])
  return (
    <Frame meta={S12} screen={screen} audio={audio} solved={done} {...rest}>
      <Hint>{t(S12.task)}</Hint>
      <AuditRows
        audio={audio}
        rows={S12.rows}
        answerId={S12.answerId}
        hints={S12.hints}
        tags={S12.tags}
        prompt={S12.ask}
        promptCap={S12.step1Cap}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setFound(true); onAnswer({ ...r, screen, role: 'trap', part: 'line' }) }}
      />
      {proofIn ? (
        <SlotFill
          audio={audio}
          template={S12.proofFill.template}
          parts={S12.proofFill.parts}
          answer={S12.proofFill.answer}
          prompt={S12.proofFill.prompt}
          promptCap={S12.step2Cap}
          tightAsk
          wide
          checkNote={S12.proofFill.checkNote}
          wrongs={S12.proofFill.wrongs}
          disabled={!canAnswer}
          onSolved={(r) => { setDone(true); audio.step('done'); onAnswer({ ...r, screen, role: 'trap', part: 'proof' }) }}
        />
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 13. KO'CHIRISH. Ta'rifdan yozuvga: bir hadni SHART bo'yicha yig'ish.
// ============================================================
const S13 = {
  eyebrow: L("TESKARI YO'L", 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L("Ta'rifdan yozuvga", 'От описания к записи', 'From a description to a record'),
  rounds: [
    {
      template: [{ slot: 0 }],
      parts: [
        { id: 'a', label: '−2a²b' },
        { id: 'b', label: '2a²b' },
        { id: 'c', label: '−2ab²' },
        { id: 'd', label: '−2a²b²' },
      ],
      answer: ['a'],
      prompt: L(
        "Koeffitsiyenti minus ikki, a ikkinchi darajada, b birinchi darajada. Bir hadni yozing.",
        'Коэффициент минус два, a во второй степени, b в первой. Запиши одночлен.',
        'Coefficient minus two, a to the second power, b to the first. Write the monomial.',
      ),
      checkNote: L("Birinchi daraja yozilmaydi, shuning uchun b yonida son yo'q", 'Первую степень не пишут, поэтому у b нет показателя', 'The first power is not written, so the b carries no exponent'),
      wrongs: [
        { key: 'd', tag: 'Z3', hint: L("b birinchi darajada, ya'ni uning ko'rsatkichi yozilmaydi.", 'b в первой степени, то есть её показатель не пишут.', 'The b is to the first power, so its exponent is not written.') },
        { key: 'b', tag: 'Z1', hint: L("Koeffitsiyent manfiy.", 'Коэффициент отрицательный.', 'The coefficient is negative.') },
        { key: '*', tag: 'Z3', hint: L("Qaysi harf ikkinchi darajada ekaniga diqqat qiling.", 'Обрати внимание, какая буква во второй степени.', 'Note which letter is squared.') },
      ],
    },
    {
      template: ['x = 3, y = 1:   ', { slot: 0 }],
      parts: [
        { id: 'e', label: '−18' },
        { id: 'f', label: '18' },
        { id: 'g', label: '−12' },
        { id: 'h', label: '−6' },
      ],
      answer: ['e'],
      prompt: L(
        "Endi −2x²y ning qiymatini toping.",
        'Теперь найди значение −2x²y.',
        'Now find the value of −2x²y.',
      ),
      checkNote: L(
    "x kvadrat 9, −2 · 9 · 1 = −18",
    'x в квадрате 9, −2 · 9 · 1 = −18',
    'x squared is 9, −2 · 9 · 1 = −18',
  ),
      wrongs: [
        { key: 'f', tag: 'Z1', hint: L("Koeffitsiyent manfiy, demak natija ham manfiy.", 'Коэффициент отрицательный, значит и результат.', 'The coefficient is negative, so is the result.') },
        { key: 'h', tag: 'Z6', hint: L("Minus olti bu minus ikki karra uch. x esa KVADRATDA: to'qqiz.", 'Минус шесть это минус два на три. А x в КВАДРАТЕ: девять.', 'Minus six is minus two times three. But x is SQUARED: nine.') },
        { key: '*', tag: 'Z6', hint: L("Avval darajani hisoblang, keyin ko'paytiring.", 'Сначала посчитай степень, потом умножай.', 'Compute the power first, then multiply.') },
      ],
    },
  ],
  reward: {
    title: L("Yozuv butun ta'rifni saqlaydi", 'Запись хранит всё описание', 'The record keeps the whole description'),
    text: L(
      "Koeffitsiyent, harflar va ularning darajalari -- hammasi bitta qisqa yozuvda turadi.",
      'Коэффициент, буквы и их степени — всё стоит в одной короткой записи.',
      'The coefficient, the letters and their powers all sit in one short record.',
    ),
  },
  audio: [
    A('mount', "Endi teskari yo'l: ta'rif berilgan, yozuv esa yo'q.", 'Теперь обратный ход: описание дано, а записи нет.', 'Now the other way round: the description is given, the record is not.'),
    A('r1', "Endi qiymatni toping.", 'Теперь найди значение.', 'Now find the value.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S13.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const done = idx >= S13.rounds.length
  const r = S13.rounds[idx]
  return (
    <Frame meta={S13} screen={screen} audio={audio} solved={done} {...rest}>
      {!done ? (
        <SlotFill
          key={idx}
          audio={audio}
          template={r.template}
          parts={r.parts}
          answer={r.answer}
          prompt={r.prompt}
          checkNote={r.checkNote}
          wrongs={r.wrongs}
          wide
          disabled={!canAnswer}
          onSolved={(res) => {
            const next = idx + 1
            setIdx(next)
            audio.step('r' + next)
            onAnswer({ ...res, screen, role: 'transfer', part: 'r' + (idx + 1) })
          }}
        />
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 14. BLITS. YAGONA baholanadigan ekran (§8.5).
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
  items: [
    {
      wrap: true,
      question: null,
      prompt: L("−5a²b ning koeffitsiyenti?", 'Коэффициент у −5a²b?', 'The coefficient of −5a²b?'),
      ok: L("Son ishorasi bilan olinadi.", 'Число берут со знаком.', 'The number comes with its sign.'),
      items: [
        { id: 'a', label: '−5', correct: true },
        { id: 'b', label: '5', tag: 'Z1', hint: L("Ishora ham koeffitsiyentga kiradi.", 'Знак тоже входит в коэффициент.', 'The sign belongs to the coefficient too.') },
        { id: 'c', label: '−5a²', tag: 'Z1', hint: L("Koeffitsiyent faqat SON.", 'Коэффициент это только ЧИСЛО.', 'A coefficient is only a NUMBER.') },
        { id: 'd', label: '−10', tag: 'Z2', hint: L("Ko'rsatkich koeffitsiyentga ko'paytirilmaydi.", 'Показатель не умножается на коэффициент.', 'The exponent does not multiply the coefficient.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("−y ning koeffitsiyenti?", 'Коэффициент у −y?', 'The coefficient of −y?'),
      ok: L("Son yozilmagan, faqat minus turibdi.", 'Числа не написано, стоит только минус.', 'No number is written, only a minus.'),
      items: [
        { id: 'a', label: '−1', correct: true },
        { id: 'b', label: '1', tag: 'Z1', hint: L("Ishora yo'qolib qoldi.", 'Знак потерялся.', 'The sign got lost.') },
        { id: 'c', label: '0', tag: 'Z1', hint: L("Nol koeffitsiyent butun yozuvni nolga aylantirardi.", 'Нулевой коэффициент обратил бы запись в нуль.', 'A zero coefficient would zero the record.') },
        { id: 'd', label: '−y', tag: 'Z1', hint: L("Bu butun bir had, koeffitsiyent esa son.", 'Это весь одночлен, а коэффициент это число.', 'That is the whole monomial, the coefficient is a number.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: '3b · 4b · b',
      ok: L("Sonlar ko'paytiriladi, uchta b esa b kubni beradi.", 'Числа перемножают, а три b дают b в кубе.', 'The numbers multiply and three b give b cubed.'),
      items: [
        { id: 'a', label: '12b³', correct: true },
        { id: 'b', label: '12b²', tag: 'Z3', hint: L("Uchta b bor: 3b, 4b va b.", 'Есть три b: в 3b, в 4b и одна отдельно.', 'There are three b: in 3b, in 4b and one alone.') },
        { id: 'c', label: '7b³', tag: 'Z2', hint: L("Yetti bu 3 qo'shuv 4. Sonlar ko'paytiriladi.", 'Семь это 3 плюс 4. Числа перемножают.', 'Seven is 3 plus 4. The numbers multiply.') },
        { id: 'd', label: '12b', tag: 'Z3', hint: L("Harflar sanalmadi.", 'Буквы не посчитаны.', 'The letters were not counted.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Qaysi yozuv bir had EMAS?", 'Какая запись НЕ одночлен?', 'Which record is NOT a monomial?'),
      ok: L("Qo'shish belgisi bir hadda bo'lmaydi.", 'Знака сложения в одночлене нет.', 'A monomial has no plus sign.'),
      items: [
        { id: 'a', correct: true, label: '2a + b' },
        { id: 'b', label: '2ab', tag: 'Z4', hint: L("Bu ko'paytma, demak bir had.", 'Это произведение, значит одночлен.', 'That is a product, so a monomial.') },
        { id: 'c', label: '−7x³', tag: 'Z4', hint: L("Bu ham ko'paytma: minus yetti karra x kub.", 'Это тоже произведение: минус семь на x в кубе.', 'A product as well: minus seven times x cubed.') },
        { id: 'd', label: '0,5mn', tag: 'Z4', hint: L("Kasr koeffitsiyent bir hadga xalaqit bermaydi.", 'Дробный коэффициент одночлену не помеха.', 'A decimal coefficient does not stop it being a monomial.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsdagi yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi yozilmagan koeffitsiyent haqida.", 'Второй про ненаписанный коэффициент.', 'The second is about the unwritten coefficient.'),
    A('2', "Uchinchisi standart shakl.", 'Третий стандартный вид.', 'The third is standard form.'),
    A('3', "Oxirgisi ta'rif haqida.", 'Последний про определение.', 'The last is about the definition.'),
  ],
}

function Screen14({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S14.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const [at, setAt] = useState(0)
  const resRef = useRef([])
  const total = S14.items.length
  return (
    <Frame meta={qMeta(S14, at)} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S14.items}
        question={S14.question}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => { setAt(i); audio.step(String(i)) }}
        onItem={(r) => { resRef.current = resRef.current.concat(r) }}
        onSolved={(r) => {
          const list = resRef.current
          const firstTry = list.filter((x) => x.attempts === 1).length
          setDone(true)
          onAnswer({ ...r, screen, role: 'blitz', scored: true, total, firstTry, level: levelOf(firstTry, total) })
        }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Koeffitsiyent ishorasi bilan', 'Коэффициент вместе со знаком', 'The coefficient with its sign'),
  gate: S1.gate,
  fix: {
    tokens: ['−1'],
    value: '−1',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Minus b bu b ni minus bir marta olish. Shuning uchun koeffitsiyent minus bir.",
    'Минус b это взять b минус один раз. Поэтому коэффициент минус единица.',
    'Minus b means taking b minus one time. So the coefficient is minus one.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    neg: L('minus bir', 'минус один', 'minus one'),
    one: L('bir', 'один', 'one'),
    zero: L('nol', 'нуль', 'zero'),
    b: L("b ning o'zi", 'само b', 'the b itself'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['2 · a · 3 · b · a → 6a²b', '−3 · x · y · x → −3x²y', 'px → 1', '−b → −1'],
  twoLabel: L('Standart shakl', 'Стандартный вид', 'Standard form'),
  twoA: L('son · son  →  koeff.', 'число · число  →  коэфф.', 'number · number  →  coeff.'),
  twoB: L('harf · harf  →  aⁿ', 'буква · буква  →  aⁿ', 'letter · letter  →  aⁿ'),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "bir hadlarni ko'paytirish",
    'умножение одночленов',
    'multiplying monomials',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Standart shakl bu tartiblangan lenta: sonlar oldinda, harflar orqasida.", 'Стандартный вид это упорядоченная лента: числа впереди, буквы за ними.', 'Standard form is the tape in order: numbers first, letters after.'),
    A('mount', "Keyingi darsda bir hadlarni ko'paytiramiz.", 'В следующем уроке будем умножать одночлены.', 'In the next lesson we multiply monomials.'),
  ],
}

function Screen15({ screen, answers, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S15.audio, lang), [lang])
  const audio = useAudio(segments)

  const tags = uniqueTags(answers)
  const hook = (answers || []).find((a) => a && a.role === 'hook')
  const predict = hook && hook.picked ? S15.predictMap[hook.picked] : null

  const named = tags.slice(0, 2).map((code) => t(TAGS[code])).join(', ')
  const more = tags.length - 2
  const gapLine = tags.length
    ? t(S15.gapPrefix) + ': ' + named + (more > 0 ? ', ' + t(S15.moreGaps) + ' ' + more : '')
    : t(S15.noGap)

  const onFix = useCallback(() => { audio.say(t(S15.fixSay)) }, [audio, t])

  return (
    <Frame meta={S15} screen={screen} audio={audio} solved {...rest}>
      <TwoRoutes source={S15.gate.source} rows={S15.gate.rows} fix={{ ...S15.fix, onFix }} />

      <HistoryTape items={S15.chips} label={S15.tapeLabel} />

      <div className="g7-sumcards g7-sumcards-one">
        <div className="g7-sumcard">
          <p className="g7-sumcard-h">{t(S15.twoLabel)}</p>
          <span className="g7-sumtwo-line"><Fx>{t(S15.twoA)}</Fx></span>
          <span className="g7-sumtwo-line"><Fx>{t(S15.twoB)}</Fx></span>
          <p className="g7-sumcard-note">
            <b>{t(S15.predictLabel)}:</b> {predict ? t(predict) : t(S15.noAnswer)}
          </p>
          <p className="g7-sumcard-note">
            <b>{t(S15.nextLabel)}:</b> {t(S15.nextTopic)}
          </p>
          <p className="g7-sumcard-note g7-readyline">{gapLine}</p>
        </div>
      </div>
    </Frame>
  )
}

// ============================================================
// ILDIZ KOMPONENT
// ============================================================
const SCREENS = [
  Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8,
  Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
]

export default function Grade7Dars15({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  aiGradingEndpoint,
  onFinished,
}) {
  const initial = langProp === 'uz' || langProp === 'ru' || langProp === 'en' ? langProp : 'uz'
  const [lang, setLang] = useState(initial)
  useEffect(() => {
    if (langProp === 'uz' || langProp === 'ru' || langProp === 'en') setLang(langProp)
  }, [langProp])
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    aiGradingEndpoint: aiGradingEndpoint || '',
    studentName: studentName || '',
    voiceGender: voiceGender || 'm',
    lessonId: LESSON_ID,
    lessonNo: LESSON_NO,
    freeNav: true,
  })
  useMobileZoom()

  const [screen, setScreen] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const startedAt = useRef(Date.now())

  const onAnswer = useCallback((payload) => { setAnswers((prev) => prev.concat(payload)) }, [])
  const next = useCallback(() => setScreen((s) => Math.min(s + 1, TOTAL - 1)), [])
  const prev = useCallback(() => setScreen((s) => Math.max(s - 1, 0)), [])

  const finish = useCallback(() => {
    setFinished(true)
    const blitz = answers.find((a) => a && a.role === 'blitz')
    const total = blitz ? blitz.total : 0
    const firstTry = blitz ? blitz.firstTry : 0
    const payload = {
      lessonId: LESSON_ID,
      lessonTitle: tr(LESSON_TITLE, lang),
      lang,
      completed: true,
      durationSec: Math.floor((Date.now() - startedAt.current) / 1000),
      totalQuestions: total,
      correctAnswers: firstTry,
      firstTryStats: { total, firstTryCorrect: firstTry },
      level: blitz ? blitz.level : 'none',
      tags: uniqueTags(answers),
      freeNav: getFreeNav(),
      answers,
    }
    if (onFinished) onFinished(payload)
    else console.log('[Grade7 Dars15] onFinished', payload)
  }, [answers, lang, onFinished])

  const Current = SCREENS[screen]

  return (
    <LangProvider value={lang}>
      <LangSetProvider value={setLang}>
        <style>{STYLES}</style>
        <div className={'lesson-root' + (screen === 7 ? ' is-rule' : '')} lang={lang}>
          <Current
            screen={screen}
            lang={lang}
            answers={answers}
            onAnswer={onAnswer}
            onNext={next}
            onPrev={prev}
            onFinish={finish}
            finished={finished}
          />
        </div>
      </LangSetProvider>
    </LangProvider>
  )
}
