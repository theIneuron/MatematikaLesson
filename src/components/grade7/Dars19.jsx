// ============================================================================
// 7-sinf, Dars 19. KO'PHADLARNI QO'SHISH VA AYIRISH.
// (Сложение и вычитание многочленов)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// ASBOB: `TermColumns` -- B4 asbobining IKKINCHI REJIMI. 18-darsda lenta
// hadlarni AJRATGAN edi, bu yerda o'sha hadlar USTUNGA teriladi. Ustun
// usulini darslikning o'zi beradi: o'xshash hadlar birining ostiga
// ikkinchisi turadi.
//
// ASOSIY XATO. Qavs oldidagi minus faqat BIRINCHI hadga tarqatiladi:
// (4x qo'shuv 9) ayirish (x qo'shuv 6) ni o'quvchi 3x qo'shuv 15 deb yozadi.
// Xuk aynan shu ikki javobni yonma-yon qo'yadi. Asbob nazoratchi: ustun
// ochilganda minusli qatorning HAR hadi ishorasini almashtiradi va bu
// KO'RINADI -- ya'ni xato aytilmaydi, u mumkin bo'lmay qoladi.
//
// IKKINCHI XATO. O'xshash bo'lmagan hadlar qo'shiladi. Bu ham yopiq:
// qo'shish faqat ustun ICHIDA bo'ladi, ustunlar orasida bosish yo'q.
//
// DARAJA. Har mashqda kamida ikki ustun va kamida bitta minusli qavs;
// chegaraviy holatda ikki uchhadning ayirmasi BIR HAD bo'lib chiqadi.
//
// Obvyazka `core.jsx` da (`LessonFrame`, `createLesson`).
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Expr,
  Fx,
  Hint,
  L,
  LessonFrame,
  Tag,
  collectLessonTags,
  createLesson,
  levelFromFirstTry,
  tr,
  useAudio,
  useInstructionGate,
  qMeta,
  useT,
} from './core.jsx'
import {
  AuditRows,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  StairsReveal,
  SubstituteRows,
  TermColumns,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_19'
const LESSON_TITLE = L("Ko'phadlarni qo'shish va ayirish", 'Сложение и вычитание многочленов', 'Adding and subtracting polynomials')
const LESSON_NO = L('19-dars', 'Урок 19', 'Lesson 19')
const BLOCK = { label: L('B4-blok', 'Блок Б4', 'Block B4'), from: 18, to: 24, current: 19 }

const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

const buildSegments = (list, lang) =>
  list.map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: s.on === 'mount' ? (i === 0 ? 'on_mount' : 'after_previous') : 'on_event:' + s.on,
    waits_for: null,
  }))

const TAGS = {
  Z1: L("minus faqat birinchi hadga tarqatildi", 'минус отнесли только к первому члену', 'the minus reached only the first term'),
  Z2: L("o'xshash bo'lmagan hadlar qo'shildi", 'сложили неподобные члены', 'unlike terms were added'),
  Z3: L("qavs ochilmadi", 'скобку не раскрыли', 'the bracket was not opened'),
  Z4: L("ishora had bilan ketmadi", 'знак не ушёл с членом', 'the sign did not travel with the term'),
  Z5: L("ayirma teskari tartibda olindi", 'разность взяли в обратном порядке', 'the difference was taken the other way round'),
  Z6: L("hisobda xato", 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// EKRAN 1. XUK. Ikkalasi ham 3x ni to'g'ri topdi, ozod hadda esa farq.
// Yuqori tabloda XATO yo'l turadi -- yakunda o'quvchi uni tuzatadi.
// ============================================================
const S1 = {
  eyebrow: L("KO'PHADLARNI QO'SHISH VA AYIRISH", 'СЛОЖЕНИЕ И ВЫЧИТАНИЕ МНОГОЧЛЕНОВ', 'ADDING AND SUBTRACTING POLYNOMIALS'),
  noBack: true,
  noNotes: true,
  title: L('Minus qavsga kirganda', 'Когда минус входит в скобку', 'When the minus enters the bracket'),
  gate: {
    source: { kind: 'plain', tokens: ['(4x', '+', '9)', '−', '(x', '+', '6)'] },
    rows: [
      { tokens: ['3x', '+', '15'], value: '15' },
      { tokens: ['3x', '+', '3'], value: '3' },
    ],
  },
  probe: {
    question: L(
      "Ikkalasi ham 3x ni bir xil topdi. Ozod hadda esa farq bor. Sizningcha qaysi javob to'g'ri?",
      'Оба получили 3x одинаково. А в свободном члене разошлись. Какой ответ, по-твоему, верный?',
      'Both got 3x the same way. But they differ in the free term. Which answer do you think is right?',
    ),
    items: [
      {
        id: 'ok',
        label: '3x + 3',
        hint: L(
          "Taxminingiz qabul qilindi. Ustunda tekshiramiz.",
          'Прогноз принят. Проверим в столбике.',
          'Your prediction is taken. We will check it in the column.',
        ),
      },
      {
        id: 'first',
        label: '3x + 15',
        hint: L(
          "Qavs ichida nechta had bor va minus ularning qaysi biriga tegishli. Shuni tekshiring.",
          'Сколько членов внутри скобки и к какому из них относится минус. Это и проверь.',
          'How many terms are inside the bracket, and which of them the minus belongs to. Check that.',
        ),
      },
      {
        id: 'flip',
        label: '3x − 15',
        hint: L(
          "Birinchi qavsning oldida minus yo'q, unda ishoralar o'zgarmaydi.",
          'Перед первой скобкой минуса нет, в ней знаки не меняются.',
          'There is no minus before the first bracket, so its signs do not change.',
        ),
      },
      {
        id: 'drop',
        label: '4x + 3',
        hint: L(
          "Ikkinchi qavsdagi x ham ayriladi, u yo'qolmaydi.",
          'x из второй скобки тоже вычитается, он не исчезает.',
          'The x in the second bracket is subtracted too, it does not vanish.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi bitta ayirmani hisobladi. Ikkalasi ham uch x ni bir xil topdi.", 'Два ученика считали одну разность. Оба одинаково получили три x.', 'Two students worked out the same difference. Both got three x the same way.'),
    A('mount', "Ozod hadda esa javoblari boshqa: birida uch, ikkinchisida o'n besh.", 'А в свободном члене ответы разные: у одного три, у другого пятнадцать.', 'But their free terms differ: one has three, the other fifteen.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Какой из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

function Screen1({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S1.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [picked, setPicked] = useState(null)
  return (
    <LessonFrame meta={S1} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <TwoRoutes source={S1.gate.source} rows={S1.gate.rows} />
      <Probe
        data={S1.probe}
        cols={4}
        unscored
        fbSlot={0}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setPicked(r.picked); onAnswer({ ...r, screen, role: 'hook' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 2. TAYANCH. O'tgan darsdan: hadlar soni, o'xshash hadlar.
// KVOTA EKRANI (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
  items: [
    {
      prompt: '4x + 9 − x − 6',
      wrap: false,
      ok: L("O'xshash hadlar birlashdi: x lar bilan x lar, sonlar bilan sonlar.", 'Подобные соединились: x с x, числа с числами.', 'Like terms merged: x with x, numbers with numbers.'),
      items: [
        { id: 'a', label: '3x + 3', correct: true },
        { id: 'b', label: '3x + 15', tag: 'Z6', hint: L("To'qqizdan olti ayriladi.", 'Из девяти вычитают шесть.', 'Six is taken from nine.') },
        { id: 'c', label: '5x + 3', tag: 'Z6', hint: L("To'rtta x dan bittasi ayriladi.", 'Из четырёх x вычитают один.', 'One x is taken from four.') },
        { id: 'd', label: '6x', tag: 'Z2', hint: L("Sonlar x li hadlarga qo'shilmaydi.", 'Числа не складываются с членами, где есть x.', 'Numbers do not add to terms that carry x.') },
      ],
    },
    {
      prompt: '−4b + 7b',
      ok: L("Harf qismi bir xil, koeffitsiyentlar qo'shiladi.", 'Буквенная часть одна, коэффициенты складываются.', 'The letter part is the same, the coefficients add.'),
      items: [
        { id: 'a', label: '3b', correct: true },
        { id: 'b', label: '−3b', tag: 'Z4', hint: L("Yettilik kattaroq, ya'ni natija musbat.", 'Семёрка больше, значит результат положительный.', 'Seven is bigger, so the result is positive.') },
        { id: 'c', label: '11b', tag: 'Z4', hint: L("Birinchi had manfiy, u qo'shilmaydi.", 'Первый член отрицательный, он не прибавляется.', 'The first term is negative, it does not get added.') },
        { id: 'd', label: '3b²', tag: 'Z2', hint: L("Qo'shishda ko'rsatkich o'zgarmaydi.", 'При сложении показатель не меняется.', 'Adding does not change the exponent.') },
      ],
    },
    {
      prompt: L('Qaysi juft o\'xshash hadlar?', 'Какая пара подобна?', 'Which pair is a pair of like terms?'),
      wrap: true,
      question: null,
      ok: L("Harf qismi va ko'rsatkichlar bir xil bo'lsa, hadlar o'xshash.", 'Если буквенная часть и показатели совпадают, члены подобны.', 'If the letter part and the exponents match, the terms are like.'),
      items: [
        { id: 'a', label: '5a²b va −3a²b', correct: true },
        { id: 'b', label: '5a²b va 5ab²', tag: 'Z2', hint: L("Ko'rsatkichlar almashgan, demak harf qismi boshqa.", 'Показатели поменялись местами, значит буквенная часть другая.', 'The exponents are swapped, so the letter part differs.') },
        { id: 'c', label: '3x² va 2x', tag: 'Z2', hint: L("Bir hadda x kvadrat, ikkinchisida x.", 'В одном члене x в квадрате, в другом x.', 'One term has x squared, the other has x.') },
        { id: 'd', label: '7 va 7y', tag: 'Z2', hint: L("Birida harf yo'q, ikkinchisida bor.", 'В одном буквы нет, во втором есть.', 'One has no letter, the other has one.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol o'tgan darsdan. Bugun ular kerak bo'ladi.", 'Три коротких вопроса из прошлого урока. Сегодня они понадобятся.', 'Three short questions from the last lesson. We will need them today.'),
    A('1', "Ikkinchisi ishora haqida.", 'Второй про знак.', 'The second is about the sign.'),
    A('2', "Oxirgisi o'xshash hadlar haqida.", 'Последний про подобные члены.', 'The last is about like terms.'),
  ],
}

function Screen2({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S2.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const [at, setAt] = useState(0)
  return (
    <LessonFrame meta={qMeta(S2, at)} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S2.items}
        question={S2.question}
        cols={4}
        disabled={!canAnswer}
        onStep={(i) => { setAt(i); audio.step(String(i)) }}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'support' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1. USTUN. Qo'shish faqat ustun ichida.
// ============================================================
const S3 = {
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L("O'xshash hadlar bir ustunda", 'Подобные члены в одном столбике', 'Like terms in one column'),
  ask: L(
    "Ustunni bosing: o'xshash hadlar chiziq ostiga tushadi.",
    'Нажми на столбик: подобные члены опустятся под черту.',
    'Tap a column: the like terms drop below the line.',
  ),
  rows: [
    { cells: ['3a', '−4b'] },
    { op: '+', cells: ['−6a', '+7b'] },
  ],
  options: [
    { id: 'a', label: '−3a + 3b' },
    { id: 'b', label: '−3a + 11b' },
    { id: 'c', label: '9a + 3b' },
    { id: 'd', label: '−3a − 3b' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Ikkinchi ustunda birinchi had manfiy, u qo'shilmaydi.", 'Во втором столбике первый член отрицательный, он не прибавляется.', 'In the second column the first term is negative, it does not get added.') },
    { key: 'c', tag: 'Z4', hint: L("Birinchi ustunda oltilik manfiy, uchdan ayriladi.", 'В первом столбике шестёрка отрицательная, её вычитают из трёх.', 'In the first column the six is negative and gets taken from three.') },
    { key: 'd', tag: 'Z4', hint: L("Ikkinchi ustunda yettilik kattaroq va u musbat.", 'Во втором столбике семёрка больше и она положительна.', 'In the second column the seven is bigger and it is positive.') },
  ],
  note: L(
    "Qo'shish faqat ustun ICHIDA bo'ladi: ustunlar orasida hech narsa qo'shilmaydi.",
    'Сложение бывает только ВНУТРИ столбика: между столбиками ничего не складывается.',
    'Adding happens only INSIDE a column: nothing adds across columns.',
  ),
  audio: [
    A('mount', "Ikki ko'phadni ustunga terdik: a lar bitta ustunda, b lar boshqasida.", 'Два многочлена мы поставили в столбик: a в одном столбике, b в другом.', 'We set the two polynomials in columns: the a terms in one, the b terms in another.'),
    A('mount', "Ustunni bosing, va o'xshash hadlar chiziq ostiga tushadi.", 'Нажми на столбик, и подобные члены опустятся под черту.', 'Tap a column and the like terms drop below the line.'),
    A('col-all', "Ikki ustun ochildi. Endi har ustunni alohida qo'shing.", 'Два столбика открыты. Теперь сложи каждый столбик отдельно.', 'Both columns are open. Now add each column on its own.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S3.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      <TermColumns
        audio={audio}
        rows={S3.rows}
        caption={S3.ask}
        options={S3.options}
        answer={S3.answer}
        wrongs={S3.wrongs}
        note={S3.note}
        cols={4}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 4. FARQLASH. O'SHA sonlar, o'sha harflar -- qavs oldida MINUS.
// Ustun ochilganda ishoralar almashishi KO'RINADI.
// ============================================================
const S4 = {
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Qavs oldida minus', 'Минус перед скобкой', 'A minus before the bracket'),
  ask: L(
    "O'sha sonlar, lekin qavs oldida minus. Ustunlarni bosing.",
    'Те же числа, но перед скобкой минус. Нажми на столбики.',
    'The same numbers, but the bracket has a minus. Tap the columns.',
  ),
  rows: [
    { cells: ['3a', '−4b'] },
    { op: '−', cells: ['−6a', '+7b'] },
  ],
  options: [
    { id: 'a', label: '9a − 11b' },
    { id: 'b', label: '−3a + 3b' },
    { id: 'c', label: '9a + 3b' },
    { id: 'd', label: '−3a − 11b' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Bu qo'shish javobi. Bu yerda esa qavs oldida minus turibdi.", 'Это ответ для сложения. А здесь перед скобкой минус.', 'That is the answer for adding. Here the bracket has a minus.') },
    { key: 'c', tag: 'Z1', hint: L("Minus ikkala hadga ham tarqaladi, faqat birinchisiga emas.", 'Минус относится к обоим членам, а не только к первому.', 'The minus reaches both terms, not just the first.') },
    { key: 'd', tag: 'Z1', hint: L("Birinchi ustunga qarang: minus oltilikning ishorasini almashtirdi.", 'Посмотри на первый столбик: минус поменял знак у шестёрки.', 'Look at the first column: the minus flipped the sign of the six.') },
  ],
  note: L(
    "Minus qavsdagi HAR hadning ishorasini almashtiradi.",
    'Минус меняет знак КАЖДОГО члена в скобке.',
    'The minus flips the sign of EVERY term in the bracket.',
  ),
  audio: [
    A('mount', "Sonlar va harflar o'sha. O'zgargan narsa bittasi: qavs oldida minus turibdi.", 'Числа и буквы те же. Изменилось одно: перед скобкой стоит минус.', 'The numbers and letters are the same. One thing changed: the bracket has a minus.'),
    A('mount', "Ustunni bosing va ishoralarga qarang.", 'Нажми на столбик и посмотри на знаки.', 'Tap a column and watch the signs.'),
    A('col-all', "Ikkala hadning ham ishorasi almashdi. Endi qo'shing.", 'Знак поменялся у обоих членов. Теперь сложи.', 'Both terms flipped their sign. Now add.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S4.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
      <TermColumns
        audio={audio}
        rows={S4.rows}
        caption={S4.ask}
        options={S4.options}
        answer={S4.answer}
        wrongs={S4.wrongs}
        note={S4.note}
        cols={4}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 5. IKKINCHI KO'RINISH. To'rt ustun, to'rt harf qismi: javobni
// o'quvchi YIG'ADI, asbob esa yo'q.
// ============================================================
const S5 = {
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L("To'rt ustun", 'Четыре столбика', 'Four columns'),
  top: '2a²b − 3ab² + 4ab + 5',
  bottom: '+   a²b + ab² + 5ab − 1',
  template: [{ slot: 0 }, ' − ', { slot: 1 }, ' + 9ab + 4'],
  parts: [
    { id: 'a', label: '3a²b' },
    { id: 'b', label: '2ab²' },
    { id: 'c', label: '3a³b²' },
    { id: 'd', label: '4ab²' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Oxirgi ikki ustun yozilgan. Birinchi ikkisini o'zingiz yozing.",
    'Последние два столбика записаны. Первые два запиши сам.',
    'The last two columns are written. Write the first two yourself.',
  ),
  checkNote: L(
    "Har ustun alohida qo'shildi, ko'rsatkichlar esa o'zgarmadi.",
    'Каждый столбик сложен отдельно, а показатели не изменились.',
    'Each column was added on its own, and the exponents did not change.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z2', hint: L("Qo'shishda ko'rsatkichlar qo'shilmaydi, ular o'sha holida qoladi.", 'При сложении показатели не складываются, они остаются как были.', 'Adding does not add exponents, they stay as they were.') },
    { key: 'd', tag: 'Z6', hint: L("Uchta a b kvadratdan bittasi qo'shildi, ya'ni ikkitasi ayriladi.", 'К трём a b в квадрате прибавили один, значит вычитаются два.', 'One a b squared was added to three, so two are taken away.') },
    { key: '*', tag: 'Z2', hint: L("Ustunlarni chalkashtirmang: har ustunda o'z harf qismi.", 'Не путай столбики: в каждом своя буквенная часть.', 'Do not mix the columns: each has its own letter part.') },
  ],
  audio: [
    A('mount', "Endi to'rt ustun. Har ustunda o'z harf qismi bor.", 'Теперь четыре столбика. В каждом своя буквенная часть.', 'Now four columns. Each has its own letter part.'),
    A('mount', "Oxirgi ikki ustun yozilgan. Birinchi ikkisini o'zingiz yozing.", 'Последние два столбика записаны. Первые два запиши сам.', 'The last two columns are written. Write the first two yourself.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S5.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <Expr size="sm">{S5.top}</Expr>
      <Expr size="sm">{S5.bottom}</Expr>
      <SlotFill
        audio={audio}
        template={S5.template}
        parts={S5.parts}
        answer={S5.answer}
        prompt={S5.prompt}
        checkNote={S5.checkNote}
        wrongs={S5.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 6. O'ZINGIZ. Minus BIRINCHI qavsning oldida.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Minus birinchi qavsda', 'Минус у первой скобки', 'The minus at the first bracket'),
  ask: L(
    "Bu safar minus BIRINCHI qavsning oldida. Uchta ustunni bosing.",
    'На этот раз минус перед ПЕРВОЙ скобкой. Нажми на три столбика.',
    'This time the minus is before the FIRST bracket. Tap the three columns.',
  ),
  rows: [
    { op: '−', cells: ['4x²', '−3xy', '+5y²'] },
    { op: '+', cells: ['7x²', '+6xy', '−9y²'] },
  ],
  options: [
    { id: 'a', label: '3x² + 9xy − 14y²' },
    { id: 'b', label: '11x² + 3xy − 4y²' },
    { id: 'c', label: '3x² + 3xy − 14y²' },
    { id: 'd', label: '−3x² + 9xy + 14y²' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Birinchi qavs oldidagi minus uning hamma hadiga tarqaladi.", 'Минус перед первой скобкой относится ко всем её членам.', 'The minus before the first bracket reaches all of its terms.') },
    { key: 'c', tag: 'Z4', hint: L("Ikkinchi ustunga qarang: minus uch x y ni musbat qildi.", 'Посмотри на второй столбик: минус сделал три x y положительным.', 'Look at the second column: the minus made three x y positive.') },
    { key: 'd', tag: 'Z4', hint: L("Yetti x kvadrat musbat qoladi, unga minus tegmaydi.", 'Семь x в квадрате остаётся положительным, минус его не касается.', 'Seven x squared stays positive, the minus does not touch it.') },
  ],
  note: L(
    "Qavs oldidagi minus qaysi qavsda turgan bo'lsa, o'sha qavsning hadlarini almashtiradi.",
    'Минус перед скобкой меняет знаки той скобки, перед которой он стоит.',
    'A minus before a bracket flips the signs of that bracket only.',
  ),
  audio: [
    A('mount', "Endi minus birinchi qavsning oldida turibdi.", 'Теперь минус стоит перед первой скобкой.', 'Now the minus stands before the first bracket.'),
    A('mount', "Uchta ustun bor. Har birini bosib, ishoralarga qarang.", 'Столбиков три. Нажми на каждый и смотри на знаки.', 'There are three columns. Tap each one and watch the signs.'),
    A('col-all', "Birinchi qatorning uch hadi ham almashdi, ikkinchi qator esa o'zgarmadi.", 'Все три члена первой строки поменялись, а вторая строка не изменилась.', 'All three terms of the first row flipped, and the second row did not change.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S6.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S6} screen={screen} audio={audio} solved={done} {...rest}>
      <TermColumns
        audio={audio}
        rows={S6.rows}
        caption={S6.ask}
        options={S6.options}
        answer={S6.answer}
        wrongs={S6.wrongs}
        note={S6.note}
        cols={2}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH. Ikki UCHHADNING
// ayirmasi BIR HAD bo'lib chiqadi -- va u umuman harfsiz.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Uchhaddan uchhad ayirildi', 'Из трёхчлена вычли трёхчлен', 'A trinomial minus a trinomial'),
  numbers: [1, 2, 4],
  rows: [
    {
      id: 'r1',
      role: 'source',
      expr: '(x² + 5x + 4) − (x² + 5x − 4)',
      sub: (n) => '(' + n + '² + 5 · ' + n + ' + 4) − (' + n + '² + 5 · ' + n + ' − 4)',
      val: (n) => (n * n + 5 * n + 4) - (n * n + 5 * n - 4),
    },
    { id: 'r2', expr: '8', sub: () => '8', val: () => 8 },
  ],
  probe: {
    question: L(
      "Uchta sonda ham natija bir xil chiqdi. Ikki uchhadning ayirmasi nima bo'ldi?",
      'При всех трёх числах результат вышел одинаковым. Чем оказалась разность двух трёхчленов?',
      'At all three numbers the result came out the same. What did the difference of two trinomials turn out to be?',
    ),
    items: [
      { id: 'one', correct: true, label: L('Son, ya\'ni bir had', 'Число, то есть одночлен', 'A number, that is a monomial') },
      { id: 'three', tag: 'Z5', label: L('Uchhad', 'Трёхчлен', 'A trinomial'), hint: L("x li hadlar bir xil edi va ular bir-birini so'ndirdi. Faqat sonlar qoldi.", 'Члены с x были одинаковы и погасили друг друга. Остались только числа.', 'The x terms were identical and cancelled. Only numbers were left.') },
      { id: 'two', tag: 'Z5', label: L('Ikkihad', 'Двучлен', 'A binomial'), hint: L("x kvadratlar ham, x lar ham ketdi, ya'ni ikki had emas.", 'Ушли и x в квадрате, и x, значит членов не два.', 'Both the x squared and the x went, so there are not two terms.') },
      { id: 'zero', tag: 'Z1', label: L('Nol', 'Ноль', 'Zero'), hint: L("Ozod hadlar bir xil emas edi: birida to'rt musbat, ikkinchisida manfiy.", 'Свободные члены были разными: в одном четыре положительное, в другом отрицательное.', 'The free terms differed: four positive in one, negative in the other.') },
    ],
  },
  okText: L(
    "Ikki uchhadning ayirmasi bir had bo'lib chiqishi mumkin, va u harfsiz bo'lishi ham mumkin.",
    'Разность двух трёхчленов может оказаться одночленом, и даже без букв.',
    'The difference of two trinomials can turn out to be a monomial, even one without letters.',
  ),
  audio: [
    A('mount', "Yuqorida ikki uchhadning ayirmasi, pastda esa faqat sakkiz turibdi.", 'Сверху разность двух трёхчленов, снизу стоит просто восемь.', 'Above is the difference of two trinomials, below stands just eight.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasini.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Ikki qatorni solishtiring.", 'Сравни две строки.', 'Compare the two rows.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S7.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S7} screen={screen} audio={audio} solved={done} {...rest}>
      <SubstituteRows
        audio={audio}
        rows={S7.rows}
        numbers={S7.numbers}
        runs={3}
        letter="x"
        question={S7.probe.question}
        options={S7.probe.items}
        okText={S7.okText}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 8. QOIDA.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("avval qavslarni ochamiz", 'сначала раскрываем скобки', 'first we open the brackets') },
    { id: 'f2', label: L("qavs oldida minus bo'lsa, ichidagi har hadning ishorasi almashadi", 'если перед скобкой минус, знак каждого члена внутри меняется', 'if a minus stands before the bracket, every term inside flips its sign') },
    { id: 'f3', label: L("keyin o'xshash hadlarni ixchamlaymiz", 'потом приводим подобные члены', 'then we collect the like terms') },
    { id: 'f4', label: L("natijani standart shaklda yozamiz", 'и записываем результат в стандартном виде', 'and write the result in standard form') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval qavs, keyin ishoralar, keyin o'xshash hadlar, oxirida yozuv.",
    'Порядок нарушен. Сначала скобки, потом знаки, потом подобные члены, в конце запись.',
    'The order is off. Brackets first, then the signs, then the like terms, and the record last.',
  ),
  lawChips: [
    { label: '( )', tone: 'par' },
    { label: '±', tone: 'off' },
    { label: '+ −', tone: 's1' },
    { label: '1 2 3', tone: 's2' },
  ],
  lawSweep: L(
    "qavs, ishora, o'xshash hadlar, hadlar soni",
    'скобка, знак, подобные члены, число членов',
    'bracket, sign, like terms, term count',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Bir nechta ko'phadning algebraik yig'indisini standart shakldagi ko'phad ko'rinishida yozish uchun qavslarni ochish va o'xshash hadlarni ixchamlash kerak.",
        'Чтобы записать алгебраическую сумму нескольких многочленов в виде многочлена стандартного вида, нужно раскрыть скобки и привести подобные члены.',
        'To write an algebraic sum of several polynomials as a polynomial in standard form, open the brackets and collect the like terms.',
      ),
      L(
        "Yig'indi yoki ayirmani ustun usulida topish qulay: o'xshash hadlar birining ostiga ikkinchisi turadi va har ustun alohida qo'shiladi.",
        'Сумму или разность удобно находить столбиком: подобные члены становятся один под другим, и каждый столбик складывается отдельно.',
        'A sum or difference is convenient in a column: like terms stand one under another and each column adds on its own.',
      ),
    ],
  },
  hookCap: L(
    "Minus qavsdagi hamma hadga tarqaladi",
    'Минус относится ко всем членам скобки',
    'The minus reaches every term in the bracket',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("minus hamma hadga", 'минус ко всем членам', 'the minus to every term'),
    L("ustun ichida qo'shiladi", 'складывают внутри столбика', 'you add inside the column'),
    L("hadlar soni kamayishi mumkin", 'число членов может уменьшиться', 'the term count may drop'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило.', 'We have seen all the cases. Now let us build the rule.'),
    A('ok', "To'g'ri. Bu qoida butun blok bo'ylab ishlaydi.", 'Верно. Это правило работает во всём блоке.', 'Correct. This rule works across the whole block.'),
  ],
}

function Screen8({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S8.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const rule = useMemo(() => ({ badge: t(S8.rule.badge), lines: S8.rule.lines.map(t) }), [t])
  return (
    <LessonFrame meta={S8} screen={screen} audio={audio} solved={done} {...rest}>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 9. MASHQ 1. KVOTA EKRANI. To'rt yozuv, ikkitasida hadlar soni
// kamayadi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni toping', 'Найди ответ', 'Find the answer'),
  question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
  items: [
    {
      prompt: '(6a² − 9ab − 7b²) + (−8a² + ab + 6b²)',
      wrap: false,
      ok: L("Uch ustun, uchtasi ham alohida qo'shildi.", 'Три столбика, и каждый сложен отдельно.', 'Three columns, each added on its own.'),
      items: [
        { id: 'a', label: '−2a² − 8ab − b²', correct: true },
        { id: 'b', label: '−2a² − 8ab + b²', tag: 'Z4', hint: L("Oxirgi ustun: yetti manfiy, olti musbat.", 'Последний столбик: семь отрицательное, шесть положительное.', 'The last column: seven negative, six positive.') },
        { id: 'c', label: '14a² − 8ab − b²', tag: 'Z4', hint: L("Birinchi ustunda sakkizlik manfiy.", 'В первом столбике восьмёрка отрицательная.', 'In the first column the eight is negative.') },
        { id: 'd', label: '−2a² − 10ab − b²', tag: 'Z6', hint: L("Ikkinchi ustun: to'qqizdan bir ayriladi.", 'Второй столбик: из девяти вычитают один.', 'The second column: one is taken from nine.') },
      ],
    },
    {
      prompt: '(a² − a + 7) − (a² + a + 8)',
      ok: L("a kvadratlar so'ndi, ikki had qoldi.", 'a в квадрате погасились, осталось два члена.', 'The a squared cancelled, two terms are left.'),
      items: [
        { id: 'a', label: '−2a − 1', correct: true },
        { id: 'b', label: '−1', tag: 'Z1', hint: L("a li hadlar ham bor: minus a dan a ayriladi.", 'Члены с a тоже есть: из минус a вычитают a.', 'There are a terms too: a is taken from minus a.') },
        { id: 'c', label: '2a² − 2a − 1', tag: 'Z1', hint: L("Birinchi ustunda a kvadratlar bir xil, ular ayrilganda nol beradi.", 'В первом столбике a в квадрате одинаковы, при вычитании дают ноль.', 'In the first column the a squared are equal and give zero.') },
        { id: 'd', label: '−2a + 15', tag: 'Z1', hint: L("Sakkizlik qo'shilmaydi, u ayriladi.", 'Восьмёрка не прибавляется, она вычитается.', 'The eight is not added, it is subtracted.') },
      ],
    },
    {
      prompt: '(8a³ − 3a²) − (7 + 8a³ − 2a²)',
      ok: L("a kublar so'ndi, yettilik esa manfiy bo'lib qoldi.", 'a в кубе погасились, а семёрка осталась отрицательной.', 'The a cubed cancelled, and the seven stayed negative.'),
      items: [
        { id: 'a', label: '−a² − 7', correct: true },
        { id: 'b', label: '−a² + 7', tag: 'Z1', hint: L("Yettilik qavs ichida edi, minus unga ham tarqaladi.", 'Семёрка была в скобке, минус относится и к ней.', 'The seven was inside the bracket, and the minus reaches it too.') },
        { id: 'c', label: '−5a² − 7', tag: 'Z6', hint: L("Uch manfiy, ikki musbat bo'ldi: ayirma bittaga teng.", 'Три отрицательное, два стало положительным: разница равна одному.', 'Three negative, two became positive: the difference is one.') },
        { id: 'd', label: '16a³ − a² − 7', tag: 'Z1', hint: L("Ikkinchi qavsdagi sakkiz a kub ayriladi, qo'shilmaydi.", 'Восемь a в кубе из второй скобки вычитается, а не прибавляется.', 'The eight a cubed in the second bracket is subtracted, not added.') },
      ],
    },
    {
      prompt: '(1 + 3x) + (x² − 2x)',
      ok: L("Standart shaklda katta darajali had oldinda turadi.", 'В стандартном виде член со старшей степенью идёт впереди.', 'In standard form the highest-degree term comes first.'),
      items: [
        { id: 'a', label: 'x² + x + 1', correct: true },
        { id: 'b', label: 'x² + 5x + 1', tag: 'Z4', hint: L("Ikkilik manfiy: uchdan ikki ayriladi.", 'Двойка отрицательная: из трёх вычитают два.', 'The two is negative: two is taken from three.') },
        { id: 'c', label: 'x² − x + 1', tag: 'Z6', hint: L("Uchlik kattaroq, ya'ni natija musbat.", 'Тройка больше, значит результат положительный.', 'Three is bigger, so the result is positive.') },
        { id: 'd', label: '3x² + x + 1', tag: 'Z2', hint: L("Uchlik x li hadda, x kvadratda emas.", 'Тройка при члене с x, а не при x в квадрате.', 'The three belongs to the x term, not to x squared.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt yozuv. Ikkitasida hadlar soni kamayadi.", 'Четыре записи. В двух число членов уменьшится.', 'Four records. In two of them the term count drops.'),
    A('1', "Ikkinchisida a kvadratlarga diqqat qiling.", 'Во втором смотри на a в квадрате.', 'In the second watch the a squared.'),
    A('2', "Uchinchisida qavs ichida uchta had bor.", 'В третьем внутри скобки три члена.', 'In the third there are three terms inside the bracket.'),
    A('3', "Oxirgisida javobni standart shaklda yozing.", 'В последнем запиши ответ в стандартном виде.', 'In the last one write the answer in standard form.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S9.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const [at, setAt] = useState(0)
  return (
    <LessonFrame meta={qMeta(S9, at)} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S9.items}
        question={S9.question}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => { setAt(i); audio.step(String(i)) }}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 10. MASHQ 2. QADAMLAR ATALGAN: avval qavs, keyin ixchamlash.
// UCHTA qavs, o'rtadagisi minus bilan.
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uch qavs', 'Три скобки', 'Three brackets'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['(5x − 4y) − (−3x + 4y) + (8x − 9y)  =  5x − 4y ', { slot: 0 }, ' ', { slot: 1 }, ' + 8x − 9y'],
  parts: [
    { id: 'a', label: '+ 3x' },
    { id: 'b', label: '− 4y' },
    { id: 'c', label: '− 3x' },
    { id: 'd', label: '+ 4y' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "O'rtadagi qavsni ochib yozing. Uning oldida minus turibdi.",
    'Раскрой среднюю скобку. Перед ней стоит минус.',
    'Open the middle bracket. It has a minus before it.',
  ),
  checkNote: L(
    "Ikkala had ham ishorasini almashtirdi: minus uch x musbat bo'ldi, musbat to'rt y manfiy.",
    'Оба члена поменяли знак: минус три x стало положительным, плюс четыре y отрицательным.',
    'Both terms flipped: minus three x became positive, plus four y became negative.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("Qavs ichidagi had manfiy edi, minus uni musbat qiladi.", 'Член в скобке был отрицательным, минус делает его положительным.', 'The term inside was negative, and the minus makes it positive.') },
    { key: 'd', tag: 'Z1', hint: L("Ikkinchi had ham almashadi, u o'sha holida qolmaydi.", 'Второй член тоже меняется, он не остаётся как был.', 'The second term flips as well, it does not stay as it was.') },
    { key: '*', tag: 'Z1', hint: L("Minus ikkala hadga ham tarqaladi.", 'Минус относится к обоим членам.', 'The minus reaches both terms.') },
  ],
  probe: {
    question: L("Endi o'xshash hadlarni ixchamlang. Qiymati nechaga teng?", 'Теперь приведи подобные члены. Чему равно значение?', 'Now collect the like terms. What is its value?'),
    items: [
      { id: 'a', correct: true, label: '16x − 17y' },
      { id: 'b', tag: 'Z6', label: '16x − 9y', hint: L("Uchta y li had bor: to'rt, to'rt va to'qqiz, hammasi manfiy.", 'Членов с y три: четыре, четыре и девять, все отрицательные.', 'There are three y terms: four, four and nine, all negative.') },
      { id: 'c', tag: 'Z6', label: '10x − 17y', hint: L("x li hadlar uchta: besh, uch va sakkiz.", 'Членов с x три: пять, три и восемь.', 'There are three x terms: five, three and eight.') },
      { id: 'd', tag: 'Z4', label: '16x + 17y', hint: L("y li hadlarning hammasi manfiy edi.", 'Все члены с y были отрицательными.', 'All the y terms were negative.') },
    ],
  },
  audio: [
    A('mount', "Uch qavs, va o'rtadagisining oldida minus turibdi.", 'Три скобки, и перед средней стоит минус.', 'Three brackets, and the middle one has a minus before it.'),
    A('mount', "Ikki qadam: avval qavsni ochamiz, keyin ixchamlaymiz.", 'Два шага: сначала раскрываем скобку, потом приводим.', 'Two steps: open the bracket first, then collect.'),
    A('two', "Endi ikkinchi qadam: o'xshash hadlarni yig'amiz.", 'Теперь второй шаг: собираем подобные члены.', 'Now the second step: collect the like terms.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S10.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [twoIn, setTwoIn] = useState(false)
  useEffect(() => {
    if (!open) return undefined
    const tmr = setTimeout(() => setTwoIn(true), 620)
    return () => clearTimeout(tmr)
  }, [open])
  return (
    <LessonFrame meta={S10} screen={screen} audio={audio} solved={done} {...rest}>
      <SlotFill
        audio={audio}
        template={S10.template}
        parts={S10.parts}
        answer={S10.answer}
        prompt={S10.prompt}
        promptCap={S10.step1Cap}
        checkNote={S10.checkNote}
        wrongs={S10.wrongs}
        tightAsk
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setOpen(true); audio.step('two'); onAnswer({ ...r, screen, role: 'practice', part: 'qavs' }) }}
      />
      {twoIn ? (
        <Probe
          data={S10.probe}
          cols={4}
          fbSlot={0}
          audio={audio}
          disabled={!canAnswer}
          onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice', part: 'ixcham' }) }}
        />
      ) : null}
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 11. FAQAT O'ZINGIZ. Asbob yo'q: ayirma so'ralgan, qavsni ham
// o'quvchi o'zi qo'yadi.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Ayirmani toping', 'Найди разность', 'Find the difference'),
  given: L(
    "Ikki ko'phad berilgan: 4a² − b² va −a² + 3b². Birinchisidan ikkinchisini ayirish kerak.",
    'Даны два многочлена: 4a² − b² и −a² + 3b². Из первого нужно вычесть второй.',
    'Two polynomials are given: 4a² − b² and −a² + 3b². The second is to be taken from the first.',
  ),
  template: ['(4a² − b²) − (−a² + 3b²)  =  ', { slot: 0 }, ' − ', { slot: 1 }],
  parts: [
    { id: 'a', label: '5a²' },
    { id: 'b', label: '4b²' },
    { id: 'c', label: '3a²' },
    { id: 'd', label: '2b²' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki ustunni yozing. Ikkinchi qavs oldida minus turibdi.",
    'Запиши два столбика. Перед второй скобкой минус.',
    'Write the two columns. The second bracket has a minus before it.',
  ),
  checkNote: L(
    "Minus a kvadrat musbat bo'ldi va to'rtga qo'shildi. Uch b kvadrat esa manfiy bo'ldi.",
    'Минус a в квадрате стало положительным и прибавилось к четырём. А три b в квадрате стало отрицательным.',
    'Minus a squared became positive and added to four. And three b squared became negative.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("Minus a kvadratning ishorasi almashadi, ya'ni u to'rtga qo'shiladi.", 'Знак у минус a в квадрате меняется, значит он прибавляется к четырём.', 'The sign of minus a squared flips, so it adds to four.') },
    { key: 'd', tag: 'Z1', hint: L("Bir b kvadratdan uch b kvadrat ayriladi.", 'Из одного b в квадрате вычитают три b в квадрате.', 'Three b squared is taken from one b squared.') },
    { key: '*', tag: 'Z1', hint: L("Ikkinchi qavsning ikki hadi ham ishorasini almashtiradi.", 'Оба члена второй скобки меняют знак.', 'Both terms of the second bracket flip their sign.') },
  ],
  audio: [
    A('mount', "Bu safar yordamsiz. Ayirma so'ralgan, ya'ni ikkinchi qavs oldida minus turadi.", 'На этот раз без подсказки. Спрошена разность, значит перед второй скобкой минус.', 'This time with no prompt. A difference is asked for, so the second bracket takes a minus.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S11.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S11} screen={screen} audio={audio} solved={done} {...rest}>
      <Hint>{t(S11.given)}</Hint>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 12. TUZOQ (§8.2). Hamma HISOB to'g'ri, javob esa noto'g'ri:
// ayirma TESKARI tartibda olingan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Hisob hamma yerda to'g'ri. Shunday bo'lsa ham, qaysi qator xato?",
    'Счёт везде верен. И всё же какая строка ошибочна?',
    'The arithmetic is right everywhere. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('ayirma: 6a² + 4b va −9a² − 9b', 'разность: 6a² + 4b и −9a² − 9b', 'the difference: 6a² + 4b and −9a² − 9b') },
    { id: 'r2', text: '(−9a² − 9b) − (6a² + 4b)' },
    { id: 'r3', text: '−9a² − 9b − 6a² − 4b' },
    { id: 'r4', text: '−15a² − 13b' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu topshiriqning o'zi.", 'Это само задание.', 'That is the task itself.'),
    r3: L("Bu qator yuqorisidan to'g'ri kelib chiqadi: minus ikkala hadga tarqalgan.", 'Эта строка верно следует из предыдущей: минус разошёлся по обоим членам.', 'This line follows correctly: the minus reached both terms.'),
    r4: L("Hisob to'g'ri: to'qqiz va olti, to'qqiz va to'rt.", 'Счёт верен: девять и шесть, девять и четыре.', 'The arithmetic is right: nine and six, nine and four.'),
  },
  tags: { r1: 'Z5', r3: 'Z5', r4: 'Z5' },
  proofFill: {
    template: ['(6a² + 4b) − (−9a² − 9b)  =  ', { slot: 0 }, ' + ', { slot: 1 }],
    parts: [
      { id: 'a', label: '15a²' },
      { id: 'b', label: '13b' },
      { id: 'c', label: '−3a²' },
      { id: 'd', label: '5b' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Ayirmani to'g'ri tartibda yozing.",
      'Запиши разность в верном порядке.',
      'Write the difference in the right order.',
    ),
    checkNote: L(
      "Birinchi berilgan ko'phad kamayuvchi bo'ladi. Javob esa oldingisiga qarama-qarshi.",
      'Первый данный многочлен и есть уменьшаемое. А ответ вышел противоположным прежнему.',
      'The first polynomial given is the one being subtracted from. And the answer comes out opposite to the earlier one.',
    ),
    wrongs: [
      { key: 'c|d', tag: 'Z1', hint: L("Ikkinchi qavsning ikki hadi ham manfiy edi, minus ularni musbat qiladi.", 'Оба члена второй скобки были отрицательными, минус делает их положительными.', 'Both terms of the second bracket were negative, and the minus makes them positive.') },
      { key: '*', tag: 'Z5', hint: L("Birinchi berilgan ko'phaddan ikkinchisi ayriladi, teskarisi emas.", 'Из первого данного многочлена вычитают второй, а не наоборот.', 'The second polynomial is taken from the first, not the other way round.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda hamma hisob to'g'ri. Qavs to'g'ri ochilgan, sonlar to'g'ri qo'shilgan.", 'В этой ловушке весь счёт верен. Скобка раскрыта правильно, числа сложены правильно.', 'In this trap all the arithmetic is right. The bracket is opened correctly, the numbers added correctly.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Qaysi qatorda xato.", 'И всё же ответ неверен. В какой строке ошибка.', 'And yet the answer is wrong. Which line has the mistake.'),
    A('proof', "Topdingiz. Kamayuvchi va ayriluvchi joyini almashtirgan.", 'Нашёл. Уменьшаемое и вычитаемое поменяли местами.', 'You found it. The two polynomials were swapped.'),
    A('done', "To'g'ri javob esa oldingisiga qarama-qarshi ishorada.", 'А верный ответ противоположен прежнему по знаку.', 'And the right answer has the opposite sign to the earlier one.'),
  ],
}

function Screen12({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S12.audio, rest.lang), [rest.lang])
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
    <LessonFrame meta={S12} screen={screen} audio={audio} solved={done} {...rest}>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 13. KO'CHIRISH. TESKARI MASALA: perimetr va ikki tomon
// berilgan, uchinchi tomon so'ralgan.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE INVERSE TASK'),
  title: L('Uchinchi tomon', 'Третья сторона', 'The third side'),
  given: L(
    "Uchburchakning perimetri 12x + 4. Ikki tomoni 3x + 5 va 5x − 6. Uchinchi tomon nimaga teng?",
    'Периметр треугольника 12x + 4. Две стороны 3x + 5 и 5x − 6. Чему равна третья сторона?',
    'A triangle has perimeter 12x + 4. Two sides are 3x + 5 and 5x − 6. What is the third side?',
  ),
  template: ['12x + 4 − (3x + 5) − (5x − 6)  =  ', { slot: 0 }, ' + ', { slot: 1 }],
  parts: [
    { id: 'a', label: '4x' },
    { id: 'b', label: '5' },
    { id: 'c', label: '4x²' },
    { id: 'd', label: '3' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Perimetrdan ikki tomonni ayirish kerak. Ikkala qavs oldida ham minus turadi.",
    'От периметра нужно вычесть две стороны. Перед обеими скобками минус.',
    'Two sides must be taken from the perimeter. Both brackets take a minus.',
  ),
  checkNote: L(
    "x li hadlar: o'n ikkidan uch va besh ayrildi. Sonlar: to'rtdan besh ayrildi va olti qo'shildi.",
    'Члены с x: из двенадцати вычли три и пять. Числа: из четырёх вычли пять и прибавили шесть.',
    'The x terms: three and five were taken from twelve. The numbers: five was taken from four and six added.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z2', hint: L("Ayirishda ko'rsatkich o'zgarmaydi.", 'При вычитании показатель не меняется.', 'Subtracting does not change the exponent.') },
    { key: 'd', tag: 'Z1', hint: L("Oxirgi qavsda olti manfiy edi, minus uni musbat qiladi.", 'В последней скобке шесть было отрицательным, минус делает его положительным.', 'In the last bracket six was negative, and the minus makes it positive.') },
    { key: '*', tag: 'Z1', hint: L("Ikkala qavs ham minus bilan ochiladi.", 'Обе скобки раскрываются с минусом.', 'Both brackets open with a minus.') },
  ],
  audio: [
    A('mount', "Bu safar javob berilgan: perimetr ma'lum, uchinchi tomon esa yo'q.", 'На этот раз ответ дан: периметр известен, а третьей стороны нет.', 'This time the answer is given: the perimeter is known, the third side is not.'),
    A('mount', "Perimetr uch tomonning yig'indisi. Demak ikki tomonni ayirish kerak.", 'Периметр это сумма трёх сторон. Значит две стороны надо вычесть.', 'The perimeter is the sum of three sides. So two sides must be subtracted.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S13.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S13} screen={screen} audio={audio} solved={done} {...rest}>
      <Hint>{t(S13.given)}</Hint>
      <SlotFill
        audio={audio}
        template={S13.template}
        parts={S13.parts}
        answer={S13.answer}
        prompt={S13.prompt}
        checkNote={S13.checkNote}
        wrongs={S13.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'transfer' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 14. BLITS. Baholanadigan YAGONA ekran.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  items: [
    {
      wrap: false,
      question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
      prompt: '(3a − 4b) − (−6a + 7b)',
      ok: L("Minus ikkala hadning ishorasini almashtirdi.", 'Минус поменял знак у обоих членов.', 'The minus flipped the sign of both terms.'),
      items: [
        { id: 'a', label: '9a − 11b', correct: true },
        { id: 'b', label: '−3a + 3b', tag: 'Z1', hint: L("Bu qo'shish javobi.", 'Это ответ для сложения.', 'That is the answer for adding.') },
        { id: 'c', label: '9a + 3b', tag: 'Z1', hint: L("Ikkinchi ustunda ham ishora almashadi.", 'Во втором столбике знак тоже меняется.', 'In the second column the sign flips as well.') },
        { id: 'd', label: '−3a − 11b', tag: 'Z1', hint: L("Birinchi ustunda ham ishora almashadi.", 'В первом столбике знак тоже меняется.', 'In the first column the sign flips as well.') },
      ],
    },
    {
      wrap: false,
      question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
      prompt: '(a² − a + 7) − (a² + a + 8)',
      ok: L("a kvadratlar so'ndi.", 'a в квадрате погасились.', 'The a squared cancelled.'),
      items: [
        { id: 'a', label: '−2a − 1', correct: true },
        { id: 'b', label: '−1', tag: 'Z1', hint: L("a li hadlar ham qoladi.", 'Члены с a тоже остаются.', 'The a terms remain too.') },
        { id: 'c', label: '2a² − 2a − 1', tag: 'Z1', hint: L("Bir xil hadlar ayrilganda nol beradi.", 'Одинаковые члены при вычитании дают ноль.', 'Equal terms give zero when subtracted.') },
        { id: 'd', label: '−2a + 15', tag: 'Z1', hint: L("Sakkizlik ayriladi.", 'Восьмёрка вычитается.', 'The eight is subtracted.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Qavs oldida minus bo'lsa nima bo'ladi?", 'Что происходит, если перед скобкой минус?', 'What happens if a bracket has a minus before it?'),
      ok: L("Ishora HAR hadda almashadi.", 'Знак меняется у КАЖДОГО члена.', 'The sign flips on EVERY term.'),
      items: [
        { id: 'a', correct: true, label: L("Har hadning ishorasi almashadi", 'Знак каждого члена меняется', 'Every term flips its sign') },
        { id: 'b', label: L("Faqat birinchi hadning ishorasi almashadi", 'Меняется знак только первого члена', 'Only the first term flips'), tag: 'Z1', hint: L("Minus qavsning o'ziga turibdi, bitta hadga emas.", 'Минус стоит перед скобкой, а не перед одним членом.', 'The minus stands before the bracket, not before one term.') },
        { id: 'c', label: L("Ko'rsatkichlar almashadi", 'Меняются показатели', 'The exponents change'), tag: 'Z2', hint: L("Ko'rsatkich faqat ko'paytirishda o'zgaradi.", 'Показатель меняется только при умножении.', 'An exponent changes only in multiplication.') },
        { id: 'd', label: L("Hech narsa o'zgarmaydi", 'Ничего не меняется', 'Nothing changes'), tag: 'Z3', hint: L("Unda qo'shish bilan ayirish bir xil javob berardi.", 'Тогда сложение и вычитание давали бы один ответ.', 'Then adding and subtracting would give the same answer.') },
      ],
    },
    {
      wrap: false,
      question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
      prompt: '(x² + 5x + 4) − (x² + 5x − 4)',
      ok: L("Harfli hadlar so'ndi, son qoldi.", 'Члены с буквами погасились, осталось число.', 'The letter terms cancelled, a number is left.'),
      items: [
        { id: 'a', label: '8', correct: true },
        { id: 'b', label: '0', tag: 'Z1', hint: L("Ozod hadlar bir xil emas edi.", 'Свободные члены были разными.', 'The free terms were not the same.') },
        { id: 'c', label: '10x + 8', tag: 'Z1', hint: L("x li hadlar bir xil edi va ayrilganda ketdi.", 'Члены с x были одинаковы и при вычитании ушли.', 'The x terms were identical and went away.') },
        { id: 'd', label: '−8', tag: 'Z4', hint: L("To'rt musbat, ayriluvchida esa manfiy edi.", 'Четыре положительное, а в вычитаемом было отрицательным.', 'Four is positive, and in the subtracted one it was negative.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida hadlar soni kamayadi.", 'Во втором число членов уменьшается.', 'In the second the term count drops.'),
    A('2', "Uchinchisi qoida haqida.", 'Третий про правило.', 'The third is about the rule.'),
    A('3', "Oxirgisi eng qiziq holat.", 'Последний самый интересный случай.', 'The last is the most interesting case.'),
  ],
}

function Screen14({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S14.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const [at, setAt] = useState(0)
  const resRef = useRef([])
  const total = S14.items.length
  return (
    <LessonFrame meta={qMeta(S14, at)} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S14.items}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => { setAt(i); audio.step(String(i)) }}
        onItem={(r) => { resRef.current = resRef.current.concat(r) }}
        onSolved={(r) => {
          const list = resRef.current
          const firstTry = list.filter((x) => x.attempts === 1).length
          setDone(true)
          onAnswer({ ...r, screen, role: 'blitz', scored: true, total, firstTry, level: levelFromFirstTry(firstTry, total) })
        }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 15. YAKUN. Yangi matematika yo'q (§4.2).
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Minus hamma hadga tarqaladi', 'Минус расходится по всем членам', 'The minus spreads to every term'),
  gate: S1.gate,
  fix: {
    tokens: ['3x', '+', '3'],
    value: '3',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Minus qavsdagi ikki hadga ham tarqaladi: x ham ayriladi, olti ham. Shuning uchun ozod hadda uch qoladi.",
    'Минус расходится на оба члена скобки: вычитается и x, и шесть. Поэтому в свободном члене остаётся три.',
    'The minus spreads to both terms of the bracket: both x and six are subtracted. That is why three is left in the free term.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    ok: L('uch x qo\'shuv uch', 'три x плюс три', 'three x plus three'),
    first: L('uch x qo\'shuv o\'n besh', 'три x плюс пятнадцать', 'three x plus fifteen'),
    flip: L('uch x ayirish o\'n besh', 'три x минус пятнадцать', 'three x minus fifteen'),
    drop: L('to\'rt x qo\'shuv uch', 'четыре x плюс три', 'four x plus three'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  // CHIPLAR QISQA: uzun yozuvlar ikkinchi qatorga o'tib, yakun 31 px oshib
  // ketardi (o'lchov 2026-08-21). Yo'l ko'rinishi buzilmaydi.
  chips: ['+ (−6a + 7b) → −3a + 3b', '− (−6a + 7b) → 9a − 11b', '− (x² + 5x − 4) → 8'],
  twoLabel: L('B4 bloki davom etadi', 'Блок Б4 продолжается', 'Block B4 continues'),
  twoA: L("( )  →  ishora almashadi", '( )  →  знак меняется', '( )  →  the sign flips'),
  twoB: L("ustun  →  o'xshash hadlar", 'столбик  →  подобные члены', 'column  →  like terms'),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "ko'phadni bir hadga ko'paytirish",
    'умножение многочлена на одночлен',
    'multiplying a polynomial by a monomial',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzatib qo'ying.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь его.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta narsadan chiqdi: qavs oldidagi minus ichidagi hamma hadga tarqaladi.", 'Вся сегодняшняя работа вышла из одного: минус перед скобкой расходится по всем её членам.', 'All of today came from one thing: a minus before a bracket spreads to every term inside.'),
    A('mount', "Keyingi darsda ko'phadni bir hadga ko'paytiramiz.", 'На следующем уроке будем умножать многочлен на одночлен.', 'Next lesson we will multiply a polynomial by a monomial.'),
  ],
}

function Screen15({ screen, answers, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S15.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)

  const tags = collectLessonTags(answers, TAGS)
  const hook = (answers || []).find((a) => a && a.role === 'hook')
  const predict = hook && hook.picked ? S15.predictMap[hook.picked] : null

  const named = tags.slice(0, 2).map((code) => t(TAGS[code])).join(', ')
  const more = tags.length - 2
  const gapLine = tags.length
    ? t(S15.gapPrefix) + ': ' + named + (more > 0 ? ', ' + t(S15.moreGaps) + ' ' + more : '')
    : t(S15.noGap)

  return (
    <LessonFrame meta={S15} screen={screen} audio={audio} solved {...rest}>
      <TwoRoutes
        source={S15.gate.source}
        rows={S15.gate.rows}
        fix={{ ...S15.fix, onFix: () => audio.say(t(S15.fixSay)) }}
      />

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
    </LessonFrame>
  )
}

// ============================================================
// DARS. Obvyazka `core.jsx` da.
// ============================================================
export default createLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [
    Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8,
    Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
  ],
})
