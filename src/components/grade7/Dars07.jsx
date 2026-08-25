// ============================================================================
// 7-sinf, Dars 7. TENGLAMA VA UNING ILDIZI. (Корень уравнения)
// B2-BLOKNING BIRINCHI DARSI.
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// Namuna: Dars01.jsx (sinf ETALONI), Dars05.jsx, Dars06.jsx.
//
// DARSNING G'OYASI va 2-DARS BILAN BOG'LANISH. 2-darsda o'zgaruvchi son
// uchun JOY edi: unga istalgan sonni qo'yish mumkin, va yozuvning qiymati
// har safar boshqacha chiqadi. Bu yerda o'sha harf turibdi, lekin yonida
// TENGLIK BELGISI paydo bo'ldi -- va endi har qanday son yaramaydi.
// Tenglama sonni TEKSHIRADI: qaysi biri tenglikni to'g'ri qiladi.
//
// Shu sababli 2-darsning Z7 tegi («ifoda tenglama bilan chalkashdi») aynan
// shu darsda yopiladi.
//
// §1.2 (etalon): ildiz SON bilan tekshiriladi, va tekshirishni O'QUVCHI
// qiladi. Darslik ham shuni talab qiladi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
//
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
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
  useMobileZoom,
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
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_07'
const LESSON_TITLE = L('Tenglama va uning ildizi', 'Уравнение и его корень', 'An equation and its root')
const LESSON_NO = L('7-dars', 'Урок 7', 'Lesson 7')
const TOTAL = 15

const BLOCK = { label: L('B2-blok', 'Блок Б2', 'Block B2'), from: 7, to: 12, current: 7 }

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
  Z1: L("tenglamada ham har qanday son yaraydi deb o'ylandi", 'в уравнении сочли годным любое число', 'any number was thought to fit the equation'),
  Z2: L("o'ng tomon ildiz deb olindi", 'правую часть приняли за корень', 'the right-hand side was taken for the root'),
  Z3: L("ildiz son bilan tekshirilmadi", 'корень не проверен подстановкой', 'the root was not checked by substituting'),
  Z4: L("ildiz yo'qligi tushunilmadi", 'случай без корней не понят', 'the no-root case was misread'),
  Z5: L('tekshirishda amallar tartibi buzildi', 'при проверке нарушен порядок действий', 'the order of operations broke during the check'),
  Z6: L('tenglama ifoda deb o\'qildi', 'уравнение прочитано как выражение', 'the equation was read as an expression'),
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
// EKRAN 1. XUK. 2-DARSDAGI O'SHA YOZUV, lekin yonida TENGLIK BELGISI.
// Ikki o'quvchi ikki xil son qo'ydi: biri nishonga tegdi, ikkinchisi yo'q.
// Sahna kim to'g'ri ekanini AYTMAYDI (§8.1).
// ============================================================
const S1 = {
  eyebrow: L('TENGLAMA VA UNING ILDIZI', 'УРАВНЕНИЕ И ЕГО КОРЕНЬ', 'AN EQUATION AND ITS ROOT'),
  noBack: true,
  noNotes: true,
  title: L("Endi har qanday son yaramaydi", 'Теперь годится не всякое число', 'Now not every number fits'),
  gate: {
    source: { kind: 'plain', tokens: ['12', '·', 'a', '=', '36'] },
    rows: [
      { tokens: ['a', '=', '2'], value: '24' },
      { tokens: ['a', '=', '3'], value: '36' },
    ],
  },
  probe: {
    question: L(
      "Ikkinchi darsda 12 karra a yozuviga istalgan sonni qo'yardik. Endi yonida tenglik belgisi va 36 turibdi. Nima o'zgardi?",
      'Во втором уроке в запись 12 · a мы ставили любое число. Теперь рядом знак равенства и 36. Что изменилось?',
      'In lesson two we put any number into 12 · a. Now there is an equals sign and 36 beside it. What changed?',
    ),
    items: [
      {
        id: 'one',
        label: L(
          "Endi faqat tenglikni to'g'ri qiladigan son yaraydi",
          'Теперь годится только то число, при котором равенство верное',
          'Now only the number that makes the equality true will do',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Uni sonlarni qo'yib tekshiramiz.",
          'Прогноз принят. Проверим его, подставляя числа.',
          'Your prediction is taken. We will check it by substituting numbers.',
        ),
      },
      {
        id: 'any',
        label: L("Hech nima, baribir istalgan sonni qo'yish mumkin", 'Ничего, по-прежнему можно поставить любое число', 'Nothing, any number can still be put in'),
        hint: L(
          "Ikkita tabloga qarang. Ikkalasiga ham son qo'yilgan, lekin faqat bittasida o'ttiz olti chiqdi.",
          'Посмотри на два табло. В оба поставили число, но тридцать шесть вышло только на одном.',
          'Look at the two boards. A number went into both, but thirty six came out on only one.',
        ),
      },
      {
        id: 'rhs',
        label: L("36 -- bu harfning qiymati", 'Тридцать шесть и есть значение буквы', 'Thirty six is the value of the letter'),
        hint: L(
          "Agar harf o'ttiz oltiga teng bo'lsa, chap tomonda o'n ikki karra o'ttiz olti chiqardi. Bu esa ancha katta son.",
          'Если бы буква равнялась тридцати шести, слева вышло бы двенадцать умножить на тридцать шесть. А это куда больше.',
          'If the letter were thirty six, the left side would be twelve times thirty six. That is far bigger.',
        ),
      },
      {
        id: 'drop',
        label: L("Harfni olib tashlab, hisoblash kerak", 'Букву надо убрать и посчитать', 'The letter should be dropped and the rest computed'),
        hint: L(
          "Harfni olib tashlasak, o'n ikki karra nima ekani noma'lum bo'lib qoladi. Uni olib tashlamaydilar, uning o'rniga son qo'yadilar.",
          'Если убрать букву, останется двенадцать умножить неизвестно на что. Её не убирают, на её место ставят число.',
          'Drop the letter and you are left with twelve times nothing. It is not dropped, a number takes its place.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Yangi blok boshlandi. Bugungi mavzu tenglama va uning ildizi.", 'Начался новый блок. Сегодня тема урока уравнение и его корень.', 'A new block begins. Today the topic is an equation and its root.'),
    A('mount', "Ikkinchi darsdagi o'sha yozuv, o'n ikki karra a. Lekin endi uning yonida tenglik belgisi va o'ttiz olti turibdi.", 'Та же запись из второго урока, двенадцать умножить на a. Но теперь рядом с ней знак равенства и тридцать шесть.', 'The same expression from lesson two, twelve times a. But now there is an equals sign and thirty six beside it.'),
    A('mount', "Bir o'quvchi ikkini qo'ydi va yigirma to'rt oldi. Ikkinchisi uchni qo'ydi va o'ttiz olti oldi.", 'Один ученик поставил двойку и получил двадцать четыре. Второй поставил тройку и получил тридцать шесть.', 'One student put in two and got twenty four. The other put in three and got thirty six.'),
    A('mount', "Sizningcha nima o'zgardi. Javobni tanlang, bu taxmin, uning uchun baho yo'q.", 'Как думаешь, что изменилось. Выбери ответ, это прогноз, оценки за него нет.', 'What do you think changed. Pick an answer, this is a prediction, it is not graded.'),
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
// EKRAN 2. TAYANCH. Uchtasi ham keyingi ekranlarning poydevori.
// KVOTA EKRANI (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      prompt: '12 · 3',
      ok: L("Bu son bugun yana kerak bo'ladi.", 'Это число сегодня понадобится ещё раз.', 'This number will be needed again today.'),
      items: [
        { id: 'a', label: '36', correct: true },
        { id: 'b', label: '15', hint: L("15 bu 12 qo'shuv 3. Belgi ko'paytirish.", '15 это 12 плюс 3. Знак умножение.', '15 is 12 plus 3. The sign is a multiplication.') },
        { id: 'c', label: '4', hint: L("4 bu 12 ni 3 ga bo'lgani. Belgi ko'paytirish.", '4 это 12 разделить на 3. Знак умножение.', '4 is 12 divided by 3. The sign is a multiplication.') },
        { id: 'd', label: '39', hint: L("39 bu 36 qo'shuv 3. Ko'paytirish bir marta bajariladi.", '39 это 36 плюс 3. Умножение делается один раз.', '39 is 36 plus 3. The multiplication happens once.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("5 qo'shuv 4 teng 10 tenglik to'g'rimi?", 'Верно ли равенство 5 + 4 = 10?', 'Is the equality 5 + 4 = 10 true?'),
      ok: L("Tenglik ikki tomoni bir xil son bo'lgandagina to'g'ri bo'ladi.", 'Равенство верно только тогда, когда обе части дают одно число.', 'An equality is true only when both sides give the same number.'),
      items: [
        { id: 'a', correct: true, label: L("Yo'q, chapda 9, o'ngda 10", 'Нет, слева 9, справа 10', 'No, nine on the left and ten on the right') },
        { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Chap tomonni hisoblang: 5 qo'shuv 4. Chiqqan son o'ngdagi bilan bir xilmi?", 'Посчитай левую часть: 5 плюс 4. Совпало ли это число с правым?', 'Work out the left side: 5 plus 4. Does it match the right one?') },
        { id: 'c', label: L("Aytib bo'lmaydi", 'Нельзя сказать', 'There is no way to tell'), hint: L("Ikkala tomonda ham sonlar turibdi, ularni hisoblash mumkin.", 'В обеих частях стоят числа, их можно посчитать.', 'Both sides hold numbers, they can be worked out.') },
        { id: 'd', label: L("Ha, agar chapga bir qo'shilsa", 'Да, если слева прибавить единицу', 'Yes, if you add one on the left'), hint: L("Tenglik BOR holicha to'g'ri yoki noto'g'ri bo'ladi. Uni o'zgartirsak, bu boshqa tenglik.", 'Равенство верно или неверно в том виде, как оно есть. Если его изменить, это уже другое равенство.', 'An equality is true or false as it stands. Change it and it is a different equality.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("12 karra a yozuvi nechta har xil qiymat bera oladi?", 'Сколько разных значений может дать запись 12 · a?', 'How many different values can the expression 12 · a give?'),
      ok: L("Ifodada o'zgaruvchi son uchun joy tutib turadi.", 'В выражении переменная держит место для числа.', 'In an expression a variable holds a place for a number.'),
      items: [
        { id: 'a', correct: true, label: L("Qancha son qo'ysak, shuncha", 'Сколько чисел поставим, столько', 'As many as the numbers we put in') },
        { id: 'b', tag: 'Z6', label: L('Bitta', 'Одно', 'One'), hint: L("Bu ifoda, tenglama emas. Unda tenglik belgisi yo'q, demak cheklov ham yo'q.", 'Это выражение, а не уравнение. В нём нет знака равенства, значит нет и ограничения.', 'That is an expression, not an equation. It has no equals sign, so there is no restriction.') },
        { id: 'c', tag: 'Z6', label: L("Bittasi ham yo'q", 'Ни одного', 'None'), hint: L("Ikkinchi darsda biz unga uchta son qo'ygandik va uchta qiymat olgandik.", 'Во втором уроке мы поставили в неё три числа и получили три значения.', 'In lesson two we put three numbers into it and got three values.') },
        { id: 'd', tag: 'Z6', label: L("O'n ikkita", 'Двенадцать', 'Twelve'), hint: L("O'n ikki bu yozuvdagi son, u qiymatlarni sanamaydi.", 'Двенадцать это число из записи, оно не считает значения.', 'Twelve is a number in the expression, it does not count the values.') },
      ],
    },
  ],
  audio: [
    A('mount', "Yangi mavzudan oldin uchta savolga javob beramiz. Uchalasi ham bugun kerak bo'ladi.", 'Прежде чем идти в новую тему, ответим на три вопроса. Все три сегодня понадобятся.', 'Before the new topic let us answer three questions. All three will be needed today.'),
    A('1', "Ikkinchisi. Tenglik qachon to'g'ri bo'ladi.", 'Второе. Когда равенство верно.', 'Second. When an equality is true.'),
    A('2', "Uchinchisi. Bu ikkinchi darsning savoli.", 'Третье. Это вопрос из второго урока.', 'Third. This is the question from lesson two.'),
  ],
}

function Screen2({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S2.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S2} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S2.items}
        question={S2.question}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'support' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1. O'quvchi UCHTA sonni O'Z QO'LI bilan qo'yadi va
// ko'radi: faqat bittasida chap tomon o'ng tomonga TENG bo'ladi.
// Asbob mos kelgan qatorni o'zi belgilaydi -- u NAZORATCHI (§8.1).
// ============================================================
const S3 = {
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L("Qaysi son tenglikni to'g'ri qiladi", 'Какое число делает равенство верным', 'Which number makes the equality true'),
  numbers: [2, 3, 5],
  rows: [
    { id: 'goal', role: 'source', expr: '36', sub: () => '36', val: () => 36 },
    { id: 'left', expr: '12 · a', sub: (n) => '12 · ' + n, val: (n) => 12 * n },
  ],
  probe: {
    question: L("12 karra a teng 36 tenglikni nechta son to'g'ri qiladi?", 'Сколько чисел делают равенство 12 · a = 36 верным?', 'How many numbers make the equality 12 · a = 36 true?'),
    items: [
      { id: 'one', correct: true, label: L('Bittasi', 'Одно', 'One') },
      { id: 'many', tag: 'Z1', label: L("Qancha qo'ysak, shuncha", 'Сколько ни поставим, столько', 'As many as we care to put in'), hint: L("Uchta son qo'ydingiz, va faqat bittasida qatorlar teng bo'ldi. Qolgan ikkitasida yo'q.", 'Ты поставил три числа, и только при одном строки совпали. При двух других нет.', 'You put in three numbers, and the rows matched at only one. Not at the other two.') },
      { id: 'three', tag: 'Z1', label: L('Uchta', 'Три', 'Three'), hint: L("Uchta bu siz qo'ygan sonlar soni. Ulardan nechtasida chap tomon o'ngga teng bo'ldi.", 'Три это сколько чисел ты поставил. А при скольких из них левая часть стала равна правой.', 'Three is how many you put in. But at how many of them did the left side equal the right.') },
      { id: 'none', tag: 'Z4', label: L("Bittasi ham yo'q", 'Ни одного', 'None'), hint: L("Bitta qatorda ikkala son ham bir xil chiqdi. Jadvalga yana bir bor qarang.", 'В одной строке оба числа вышли одинаковыми. Посмотри в таблицу ещё раз.', 'In one line both numbers came out the same. Look at the table again.') },
    ],
  },
  okText: L(
    "Shu yagona son tenglamaning ILDIZI deyiladi.",
    'Это единственное число называется КОРНЕМ уравнения.',
    'That single number is called the ROOT of the equation.',
  ),
  audio: [
    A('mount', "Tenglamaning o'ng tomonida o'ttiz olti turibdi. Chap tomonda esa o'n ikki karra a.", 'В правой части уравнения стоит тридцать шесть. А в левой двенадцать умножить на a.', 'On the right side of the equation stands thirty six. On the left, twelve times a.'),
    A('mount', "Sonni o'zingiz tanlang va qo'ying. Uch marta, har safar boshqa son bilan.", 'Выбери число сам и поставь. Три раза, каждый раз другое.', 'Choose a number yourself and put it in. Three times, a different one each time.'),
    A('sub', "Endi ikkala qatorni solishtiring. Ular teng bo'ldimi.", 'Теперь сравни две строки. Стали ли они равны.', 'Now compare the two lines. Did they become equal.'),
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
      <SubstituteRows
        audio={audio}
        rows={S3.rows}
        numbers={S3.numbers}
        runs={3}
        letter="a"
        question={S3.probe.question}
        options={S3.probe.items}
        okText={S3.okText}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2. FARQLASH: ildiz -- bu NE o'ng tomon va NE
// yozuvdagi boshqa son. Ortiqcha bo'laklar aynan shu chalkashliklardan.
// ============================================================
const S4 = {
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Ildiz qaysi son", 'Какое из чисел корень', 'Which number is the root'),
  template: ['x + 4 = 9,     x = ', { slot: 0 }],
  parts: [
    { id: 'p5', label: '5' },
    { id: 'p13', label: '13' },
    { id: 'p4', label: '4' },
    { id: 'p9', label: '9' },
  ],
  answer: ['p5'],
  prompt: L(
    "x qo'shuv 4 teng 9. Qaysi son x o'rniga turganda tenglik to'g'ri bo'ladi?",
    'x + 4 = 9. Какое число на месте x делает равенство верным?',
    'x + 4 = 9. Which number in the place of x makes the equality true?',
  ),
  checkNote: L(
    "5 qo'shuv 4 teng 9. Ikkala tomon bir xil, demak 5 ildiz",
    '5 плюс 4 равно 9. Обе части совпали, значит 5 корень',
    '5 plus 4 is 9. Both sides match, so 5 is the root',
  ),
  wrongs: [
    { key: 'p13', tag: 'Z2', hint: L("13 bu 9 qo'shuv 4, ya'ni ikkala sonning yig'indisi. Ildiz esa x o'rniga TURADIGAN son.", '13 это 9 плюс 4, то есть сумма обоих чисел. А корень это число, которое СТАНОВИТСЯ на место x.', '13 is 9 plus 4, the sum of both numbers. But a root is the number that TAKES the place of x.') },
    { key: 'p9', tag: 'Z2', hint: L("9 bu tenglamaning o'ng tomoni. Uni x o'rniga qo'ysangiz, chapda 13 chiqadi.", '9 это правая часть уравнения. Поставь её вместо x, и слева выйдет 13.', '9 is the right side of the equation. Put it in place of x and the left gives 13.') },
    { key: 'p4', tag: 'Z2', hint: L("4 bu yozuvdagi ikkinchi qo'shiluvchi. Uni x o'rniga qo'ysangiz, chapda 8 chiqadi.", '4 это второе слагаемое из записи. Поставь его вместо x, и слева выйдет 8.', '4 is the second term in the line. Put it in place of x and the left gives 8.') },
  ],
  reward: {
    title: L("Ildiz yozuvda turmaydi", 'Корень в записи не стоит', 'The root is not written in the line'),
    text: L(
      "Uni topish kerak. Yozuvdagi sonlarning hech biri ildiz emas -- ildiz x turgan JOYGA keladi.",
      'Его надо найти. Ни одно из чисел записи корнем не является — корень приходит на МЕСТО x.',
      'It has to be found. None of the numbers in the line is the root — the root comes to the PLACE of x.',
    ),
  },
  audio: [
    A('mount', "Yozuvda uchta son bor, lekin ularning hech biri ildiz emas.", 'В записи три числа, но ни одно из них не корень.', 'The line has three numbers, and none of them is the root.'),
    A('mount', "Ildiz x turgan joyga keladi. Uni toping.", 'Корень приходит на место x. Найди его.', 'The root comes to the place of x. Find it.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S4.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
      <SlotFill
        audio={audio}
        template={S4.template}
        parts={S4.parts}
        answer={S4.answer}
        prompt={S4.prompt}
        checkNote={S4.checkNote}
        wrongs={S4.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3. TEKSHIRISH: son ildizmi yoki yo'q.
// Avval savol, isbot KEYIN (§8.1, §1.2). Ikkala tomon ham hisoblanadi --
// aynan shu tekshirishning ma'nosi.
// ============================================================
const S5 = {
  eyebrow: L('TEKSHIRAMIZ', 'ПРОВЕРЯЕМ', 'CHECKING'),
  title: L("Ikkala tomonni ham hisoblaymiz", 'Считаем обе части', 'We work out both sides'),
  numbers: [3],
  rows: [
    { id: 'left', expr: '3x − 2', sub: (n) => '3 · ' + n + ' − 2', val: (n) => 3 * n - 2 },
    { id: 'right', role: 'source', expr: '7', sub: () => '7', val: () => 7 },
  ],
  probe: {
    question: L("3 soni 3x ayirish 2 teng 7 tenglamaning ildizimi?", 'Является ли число 3 корнем уравнения 3x − 2 = 7?', 'Is the number 3 a root of the equation 3x − 2 = 7?'),
    items: [
      { id: 'yes', correct: true, label: L("Ha", 'Да', 'Yes') },
      { id: 'no', tag: 'Z3', label: L("Yo'q", 'Нет', 'No'), hint: L("Chap tomonni hisoblang: 3 karra 3 ayirish 2. Chiqqan son 7 bilan bir xilmi?", 'Посчитай левую часть: 3 умножить на 3 минус 2. Совпало ли это число с семёркой?', 'Work out the left side: 3 times 3 minus 2. Does it match the seven?') },
      { id: 'cant', tag: 'Z3', label: L("Tenglamani yechmasdan bilib bo'lmaydi", 'Нельзя узнать, не решив уравнение', 'There is no way to tell without solving it'), hint: L("Bilib bo'ladi va yechish shart emas: sonni qo'yish va ikkala tomonni hisoblash yetarli.", 'Узнать можно, и решать не нужно: достаточно подставить число и посчитать обе части.', 'You can tell, and no solving is needed: substitute the number and work out both sides.') },
      { id: 'half', tag: 'Z5', label: L("Faqat chap tomonni hisoblash kerak", 'Достаточно посчитать только левую часть', 'It is enough to work out the left side only'), hint: L("Chap tomonni hisoblab, uni NIMA bilan solishtirasiz. O'ng tomon ham kerak.", 'Посчитав левую часть, с ЧЕМ ты её сравнишь. Правая часть тоже нужна.', 'Once the left side is worked out, WHAT will you compare it with. The right side is needed too.') },
    ],
  },
  okText: L(
    "Ikkala tomon ham 7 berdi. Tenglik to'g'ri bo'ldi, demak 3 ildiz.",
    'Обе части дали 7. Равенство стало верным, значит 3 корень.',
    'Both sides gave 7. The equality came out true, so 3 is a root.',
  ),
  audio: [
    A('mount', "Endi teskari savol. Son berilgan, uning ildiz ekanini tekshirish kerak.", 'Теперь обратный вопрос. Число дано, надо проверить, корень ли оно.', 'Now the reverse question. A number is given, and we must check whether it is a root.'),
    A('mount', "Avval javob bering, keyin ikkala tomonni ham hisoblab ko'ramiz.", 'Сначала ответь, потом посчитаем обе части.', 'Answer first, then we work out both sides.'),
    A('row2', "Yetti va yetti. Ikkala tomon bir xil son berdi, demak tenglik to'g'ri.", 'Семь и семь. Обе части дали одно число, значит равенство верное.', 'Seven and seven. Both sides gave the same number, so the equality is true.'),
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
      <SubstituteRows
        audio={audio}
        rows={S5.rows}
        numbers={S5.numbers}
        askFirst
        letter="x"
        question={S5.probe.question}
        options={S5.probe.items}
        okText={S5.okText}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4. O'ZINGIZ: ildizni topish.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Ildizni o'zingiz toping", 'Найди корень сам', 'Find the root yourself'),
  template: ['5x = 20,     x = ', { slot: 0 }],
  parts: [
    { id: 'p4', label: '4' },
    { id: 'p15', label: '15' },
    { id: 'p25', label: '25' },
    { id: 'p100', label: '100' },
  ],
  answer: ['p4'],
  prompt: L(
    "5x teng 20. Qaysi son x o'rniga turganda tenglik to'g'ri bo'ladi?",
    '5x = 20. Какое число на месте x делает равенство верным?',
    '5x = 20. Which number in the place of x makes the equality true?',
  ),
  checkNote: L(
    '5 karra 4 teng 20. Tenglik to\'g\'ri, demak 4 ildiz',
    '5 умножить на 4 равно 20. Равенство верное, значит 4 корень',
    '5 times 4 is 20. The equality is true, so 4 is the root',
  ),
  wrongs: [
    { key: 'p15', tag: 'Z2', hint: L("15 bu 20 ayirish 5. Lekin 5 bilan x orasida ko'paytirish turibdi, ayirish emas.", '15 это 20 минус 5. Но между 5 и x стоит умножение, а не вычитание.', '15 is 20 minus 5. But between the 5 and the x there is a multiplication, not a subtraction.') },
    { key: 'p100', tag: 'Z2', hint: L("100 bu 5 karra 20. Uni x o'rniga qo'ysangiz, chapda 500 chiqadi.", '100 это 5 умножить на 20. Поставь его вместо x, и слева выйдет 500.', '100 is 5 times 20. Put it in place of x and the left gives 500.') },
    { key: '*', tag: 'Z3', hint: L("Har bir sonni x o'rniga qo'yib ko'ring va chap tomonni hisoblang. Qaysi biri 20 beradi.", 'Подставь каждое число вместо x и посчитай левую часть. Какое из них даст 20.', 'Put each number in place of x and work out the left side. Which one gives 20.') },
  ],
  audio: [
    A('mount', "Endi o'zingiz. Yozuv qisqa, lekin ish o'sha.", 'Теперь сам. Запись короткая, а работа та же.', 'Now on your own. The line is short but the job is the same.'),
    A('mount', "Har bir sonni qo'yib ko'ring va chap tomonni hisoblang.", 'Подставь каждое число и посчитай левую часть.', 'Substitute each number and work out the left side.'),
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
      <SlotFill
        audio={audio}
        template={S6.template}
        parts={S6.parts}
        answer={S6.answer}
        prompt={S6.prompt}
        checkNote={S6.checkNote}
        wrongs={S6.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5. CHEGARAVIY HOLAT: ILDIZI YO'Q tenglama.
// Bu 2-blokning eng qimmat farqi: «ildizi yo'q» va «ildizi nol» -- ikki
// boshqa narsa. Avval savol, isbot KEYIN. KVOTA EKRANI.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Ildizi yo'q tenglama", 'Уравнение без корней', 'An equation with no roots'),
  numbers: [1],
  rows: [
    { id: 'left', expr: 'x + 5', sub: (n) => n + ' + 5', val: (n) => n + 5 },
    { id: 'right', role: 'source', expr: 'x', sub: (n) => String(n), val: (n) => n },
  ],
  probe: {
    question: L("x qo'shuv 5 teng x tenglikni qaysi son to'g'ri qiladi?", 'Какое число делает равенство x + 5 = x верным?', 'Which number makes the equality x + 5 = x true?'),
    items: [
      { id: 'none', correct: true, label: L("Bittasi ham yo'q", 'Ни одно', 'None') },
      { id: 'zero', tag: 'Z4', label: '0', hint: L("Nolni qo'ying: chapda 5, o'ngda 0. Bular teng emas. Ildizi nol bo'lish va ildizi yo'q bo'lish -- ikki boshqa narsa.", 'Поставь нуль: слева 5, справа 0. Это не равно. Корень нуль и отсутствие корней это разные вещи.', 'Put in zero: five on the left, zero on the right. Not equal. A root of zero and no root at all are different things.') },
      { id: 'five', tag: 'Z2', label: '5', hint: L("Beshni qo'ying: chapda 10, o'ngda 5. Beshlik yozuvda turibdi, lekin ildiz emas.", 'Поставь пятёрку: слева 10, справа 5. Пятёрка стоит в записи, но корнем не является.', 'Put in five: ten on the left, five on the right. The five is in the line but it is not a root.') },
      { id: 'any', tag: 'Z1', label: L("Har qanday son", 'Любое', 'Any number'), hint: L("Istalgan sonni qo'ying. Chap tomon har doim beshga katta chiqadi.", 'Поставь любое число. Левая часть всегда будет на пять больше.', 'Put in any number. The left side will always be five bigger.') },
    ],
  },
  okText: L(
    "Chap tomon har doim beshga katta. Bunday tenglamaning ildizi yo'q, va buni ko'rsatish ham javob.",
    'Левая часть всегда на пять больше. У такого уравнения корней нет, и показать это тоже ответ.',
    'The left side is always five bigger. Such an equation has no roots, and showing that is also an answer.',
  ),
  audio: [
    A('mount', "Endi g'alati tenglama. Ikkala tomonda ham bitta xil harf turibdi.", 'Теперь странное уравнение. В обеих частях стоит одна и та же буква.', 'Now a strange equation. The same letter stands on both sides.'),
    A('mount', "Avval javob bering, keyin son qo'yib tekshiramiz.", 'Сначала ответь, потом проверим подстановкой.', 'Answer first, then we check by substituting.'),
    A('row2', "Olti va bir. Chap tomon beshga katta. Qaysi sonni qo'ymang, u har doim beshga katta bo'lib qolaveradi.", 'Шесть и один. Левая часть на пять больше. Какое число ни поставь, она так и останется на пять больше.', 'Six and one. The left side is five bigger. Whatever number you put in, it stays five bigger.'),
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
      <SubstituteRows
        audio={audio}
        rows={S7.rows}
        numbers={S7.numbers}
        askFirst
        letter="x"
        question={S7.probe.question}
        options={S7.probe.items}
        okText={S7.okText}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 8. QOIDA. Maydon TO'Q SARIQ. DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("harf qatnashgan tenglik -- bu tenglama", 'равенство с буквой это уравнение', 'an equality with a letter is an equation') },
    { id: 'f2', label: L("ildiz -- tenglikni to'g'ri qiladigan qiymat", 'корень это значение, при котором равенство верно', 'a root is the value that makes the equality true') },
    { id: 'f3', label: L("tekshirish uchun sonni qo'ying va ikkala tomonni hisoblang", 'чтобы проверить, подставь число и посчитай обе части', 'to check, substitute the number and work out both sides') },
    { id: 'f4', label: L("yechish -- hamma ildizni topish yoki ildiz yo'qligini ko'rsatish", 'решить значит найти все корни или показать, что их нет', 'to solve means to find all roots or to show there are none') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval nima ekani ataladi, keyin ildiz nima ekani, keyin uni qanday tekshirish.",
    'Порядок нарушен. Сначала называют, что это такое, потом что такое корень, потом как его проверить.',
    'The order is off. First what it is, then what a root is, then how to check it.',
  ),
  lawChips: [
    { label: '=', tone: 'par' },
    { label: 'x', tone: 's2' },
    { label: '✓', tone: 's1' },
    { label: '…', tone: 'off' },
  ],
  lawSweep: L(
    "tenglik, noma'lum, tekshirish",
    'равенство, неизвестное, проверка',
    'equality, unknown, check',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Harf bilan belgilangan noma'lum sonni o'z ichiga olgan tenglik tenglama deyiladi. Tenglamaning ildizi deb noma'lumning tenglamani to'g'ri tenglikka aylantiruvchi qiymatiga aytiladi.",
        'Равенство, содержащее неизвестное число, обозначенное буквой, называется уравнением. Корень уравнения это значение неизвестного, которое превращает уравнение в верное равенство.',
        'An equality containing an unknown number denoted by a letter is called an equation. A root of an equation is the value of the unknown that turns the equation into a true equality.',
      ),
      L(
        "Tenglamani yechish uning hamma ildizlarini topish yoki ildizi yo'qligini ko'rsatish demakdir.",
        'Решить уравнение означает найти все его корни или показать, что оно не имеет корней.',
        'To solve an equation means to find all its roots or to show that it has none.',
      ),
    ],
  },
  hookCap: L("Tenglik son tanlaydi, ifoda esa hammasini qabul qiladi", 'Равенство отбирает число, а выражение принимает любое', 'An equality selects a number, an expression accepts any'),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("ifodada tenglik belgisi yo'q", 'в выражении нет знака равенства', 'an expression has no equals sign'),
    L("ildiz yozuvda turmaydi, uni topadilar", 'корень не стоит в записи, его находят', 'a root is not in the line, it is found'),
    L("tekshirishda IKKALA tomon hisoblanadi", 'при проверке считают ОБЕ части', 'a check works out BOTH sides'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani so'z bilan yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило словами.', 'We have seen all the cases. Now let us put the rule into words.'),
    A('mount', "Bo'laklarni to'g'ri tartibda joylashtiring.", 'Разложи фрагменты в верном порядке.', 'Put the pieces in the right order.'),
    A('ok', "To'g'ri. Oxirgi qatorga diqqat qiling: ildiz yo'qligini ko'rsatish ham javob.", 'Верно. Обрати внимание на последнюю строку: показать, что корней нет, тоже ответ.', 'Correct. Note the last line: showing there are no roots is also an answer.'),
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
        tag="Z6"
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
// EKRAN 9. MASHQ 1. Uchtasi bir turdagi: ildizni topish, uchta amal.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Uchalasida ham bitta ish: sonni x o'rniga qo'yib, ikkala tomon teng bo'lishini tekshirish.",
      'Во всех трёх одна работа: поставить число на место x и проверить, что обе части совпали.',
      'The same job in all three: put a number in the place of x and check that both sides match.',
    ),
  },
  rounds: [
    {
      template: ['x − 7 = 3,     x = ', { slot: 0 }],
      parts: [{ id: 'p10', label: '10' }, { id: 'p4', label: '4' }, { id: 'p21', label: '21' }, { id: 'p3', label: '3' }],
      answer: ['p10'],
      prompt: L("x ayirish 7 teng 3. Ildizni toping.", 'x − 7 = 3. Найди корень.', 'x − 7 = 3. Find the root.'),
      checkNote: L('10 ayirish 7 teng 3, tenglik to\'g\'ri', '10 минус 7 равно 3, равенство верное', '10 minus 7 is 3, the equality is true'),
      wrongs: [
        { key: 'p4', tag: 'Z2', hint: L("4 bu 7 ayirish 3. Uni qo'ysangiz, chapda minus 3 chiqadi.", '4 это 7 минус 3. Подставь его, и слева выйдет минус 3.', '4 is 7 minus 3. Substitute it and the left gives minus 3.') },
        { key: '*', tag: 'Z3', hint: L("Har bir sonni qo'yib, chap tomonni hisoblang. Qaysi biri 3 beradi.", 'Подставь каждое число и посчитай левую часть. Какое из них даст 3.', 'Substitute each number and work out the left side. Which gives 3.') },
      ],
    },
    {
      template: ['4x = 24,     x = ', { slot: 0 }],
      parts: [{ id: 'q6', label: '6' }, { id: 'q20', label: '20' }, { id: 'q28', label: '28' }, { id: 'q96', label: '96' }],
      answer: ['q6'],
      prompt: L("4x teng 24. Ildizni toping.", '4x = 24. Найди корень.', '4x = 24. Find the root.'),
      checkNote: L('4 karra 6 teng 24, tenglik to\'g\'ri', '4 умножить на 6 равно 24, равенство верное', '4 times 6 is 24, the equality is true'),
      wrongs: [
        { key: 'q20', tag: 'Z2', hint: L("20 bu 24 ayirish 4. Lekin 4 bilan x orasida ko'paytirish turibdi.", '20 это 24 минус 4. Но между 4 и x стоит умножение.', '20 is 24 minus 4. But between the 4 and the x there is a multiplication.') },
        { key: '*', tag: 'Z3', hint: L("Qaysi son 4 ga ko'paytirilganda 24 beradi.", 'Какое число при умножении на 4 даёт 24.', 'Which number times 4 gives 24.') },
      ],
    },
    {
      template: ['x : 3 = 5,     x = ', { slot: 0 }],
      parts: [{ id: 'w15', label: '15' }, { id: 'w8', label: '8' }, { id: 'w2', label: '2' }, { id: 'w53', label: '53' }],
      answer: ['w15'],
      prompt: L("x bo'lish 3 teng 5. Ildizni toping.", 'x : 3 = 5. Найди корень.', 'x : 3 = 5. Find the root.'),
      checkNote: L('15 ni 3 ga bo\'lsak 5, tenglik to\'g\'ri', '15 разделить на 3 будет 5, равенство верное', '15 divided by 3 is 5, the equality is true'),
      wrongs: [
        { key: 'w8', tag: 'Z2', hint: L("8 bu 3 qo'shuv 5. Yozuvda esa bo'lish turibdi.", '8 это 3 плюс 5. А в записи стоит деление.', '8 is 3 plus 5. But the line has a division.') },
        { key: '*', tag: 'Z3', hint: L("Qaysi son 3 ga bo'linganda 5 beradi.", 'Какое число при делении на 3 даёт 5.', 'Which number divided by 3 gives 5.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Endi uchta tenglama, uchta har xil amal.", 'Правило готово. Теперь три уравнения, три разных действия.', 'The rule is ready. Now three equations with three different operations.'),
    A('r1', "Ikkinchisi. Bu safar ko'paytirish.", 'Второе. На этот раз умножение.', 'Second. This time a multiplication.'),
    A('r2', "Uchinchisi. Bu safar bo'lish.", 'Третье. На этот раз деление.', 'Third. This time a division.'),
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
  const LABELS = ['x − 7 = 3   →   x = 10', '4x = 24   →   x = 6', 'x : 3 = 5   →   x = 15']
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan: IKKI sonni tekshirish. Bittasi
// ildiz, ikkinchisi yo'q -- va o'quvchi buni HISOB bilan ko'rsatadi.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L("Ikki sonni tekshiramiz", 'Проверяем два числа', 'Checking two numbers'),
  rounds: [
    {
      template: ['x = 5:     3 · 5 − 4 = ', { slot: 0 }],
      parts: [{ id: 'p11', label: '11' }, { id: 'p15', label: '15' }, { id: 'p7', label: '7' }, { id: 'p3', label: '3' }],
      answer: ['p11'],
      prompt: L(
        "3x ayirish 4 teng 11. Avval beshni tekshiramiz: chap tomon nechaga teng?",
        '3x − 4 = 11. Сначала проверим пятёрку: чему равна левая часть?',
        '3x − 4 = 11. First check the five: what does the left side equal?',
      ),
      checkNote: L("Chapda 11, o'ngda 11. Tenglik to'g'ri, demak 5 ildiz", 'Слева 11 и справа 11. Равенство верное, значит 5 корень', 'Eleven on the left and eleven on the right. The equality is true, so 5 is a root'),
      wrongs: [
        { key: 'p3', tag: 'Z5', hint: L("3 bu 5 ayirish 4 ni oldin hisoblagani, keyin 3 ga ko'paytirmagani. Avval ko'paytirish.", '3 получается, если сначала посчитать 5 минус 4. Сначала умножение.', '3 comes from doing 5 minus 4 first. Multiplication goes first.') },
        { key: '*', tag: 'Z5', hint: L("Avval 3 karra 5, keyin 4 ni ayiring.", 'Сначала 3 умножить на 5, потом вычесть 4.', 'First 3 times 5, then take away 4.') },
      ],
    },
    {
      template: ['x = 4:     3 · 4 − 4 = ', { slot: 0 }],
      parts: [{ id: 'q8', label: '8' }, { id: 'q11', label: '11' }, { id: 'q12', label: '12' }, { id: 'q0', label: '0' }],
      answer: ['q8'],
      prompt: L(
        "Endi to'rtni tekshiramiz. Chap tomon nechaga teng?",
        'Теперь проверим четвёрку. Чему равна левая часть?',
        'Now check the four. What does the left side equal?',
      ),
      checkNote: L("Chapda 8, o'ngda 11. Sonlar farq qildi, demak 4 ildiz emas", 'Слева 8, справа 11. Числа разошлись, значит 4 не корень', 'Eight on the left, eleven on the right. They differ, so 4 is not a root'),
      wrongs: [
        { key: 'q12', tag: 'Z5', hint: L("12 bu 3 karra 4. To'rtni ayirish qolib ketdi.", '12 это 3 умножить на 4. Вычесть четыре осталось несделанным.', '12 is 3 times 4. Taking away the four was left undone.') },
        { key: '*', tag: 'Z5', hint: L("Avval 3 karra 4, keyin 4 ni ayiring.", 'Сначала 3 умножить на 4, потом вычесть 4.', 'First 3 times 4, then take away 4.') },
      ],
    },
  ],
  reward: {
    title: L("Tekshirish yechishdan oson", 'Проверить легче, чем решить', 'Checking is easier than solving'),
    text: L(
      "Sonning ildiz ekanini bilish uchun tenglamani yechish shart emas. Uni qo'yib, ikkala tomonni hisoblash yetarli.",
      'Чтобы узнать, корень ли число, решать уравнение не нужно. Достаточно подставить и посчитать обе части.',
      'To find out whether a number is a root you need not solve the equation. Substitute it and work out both sides.',
    ),
  },
  audio: [
    A('mount', "Ikkita son berilgan. Ularning qaysi biri ildiz ekanini tekshiramiz.", 'Даны два числа. Проверим, какое из них корень.', 'Two numbers are given. Let us check which of them is a root.'),
    A('r1', "Endi ikkinchi sonni tekshiramiz.", 'Теперь проверим второе число.', 'Now check the second number.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S10.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [rows, setRows] = useState([])
  const done = idx >= S10.rounds.length
  const r = S10.rounds[idx]
  const LABELS = ['x = 5   →   11 = 11', 'x = 4   →   8 ≠ 11']
  return (
    <Frame meta={S10} screen={screen} audio={audio} solved={done} {...rest}>
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
// EKRAN 11. MASHQ 3. ASBOBSIZ (§4.2, §8.1).
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L("Ikki qadamli tenglama", 'Уравнение в два шага', 'A two-step equation'),
  template: ['2x + 3 = 15,     x = ', { slot: 0 }],
  parts: [
    { id: 'p6', label: '6' },
    { id: 'p9', label: '9' },
    { id: 'p18', label: '18' },
    { id: 'p36', label: '36' },
  ],
  answer: ['p6'],
  prompt: L(
    "2x qo'shuv 3 teng 15. Jadval ham, qadamlar ham ekranda ko'rinmaydi.",
    '2x + 3 = 15. Ни таблицы, ни шагов на экране не будет.',
    '2x + 3 = 15. Neither a table nor the steps will appear.',
  ),
  checkNote: L(
    '2 karra 6 qo\'shuv 3 teng 15, tenglik to\'g\'ri',
    '2 умножить на 6 плюс 3 равно 15, равенство верное',
    '2 times 6 plus 3 is 15, the equality is true',
  ),
  wrongs: [
    { key: 'p9', tag: 'Z5', hint: L("9 bu 15 ayirish 6. Lekin 2 ga ko'paytirish ham bor.", '9 это 15 минус 6. Но есть ещё умножение на 2.', '9 is 15 minus 6. But there is also the multiplication by 2.') },
    { key: 'p18', tag: 'Z2', hint: L("18 bu 15 qo'shuv 3. Uni qo'ysangiz, chapda 39 chiqadi.", '18 это 15 плюс 3. Подставь его, и слева выйдет 39.', '18 is 15 plus 3. Substitute it and the left gives 39.') },
    { key: '*', tag: 'Z3', hint: L("Har bir sonni qo'yib, chap tomonni hisoblang: avval ko'paytirish, keyin qo'shish.", 'Подставь каждое число и посчитай левую часть: сначала умножение, потом сложение.', 'Substitute each number and work out the left side: multiplication first, then addition.') },
  ],
  audio: [
    A('mount', "Endi yordamchisiz. Chap tomonda ikkita amal bor.", 'Теперь без помощника. В левой части два действия.', 'Now with no helper. The left side has two operations.'),
    A('mount', "Amallar tartibini eslang va ildizni toping.", 'Вспомни порядок действий и найди корень.', 'Recall the order of operations and find the root.'),
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
// EKRAN 12. TUZOQ (§8.2). Tekshirish O'ZI xato bajarilgan: amallar
// tartibi buzilgan, va shu sababli TO'G'RI ildiz rad etilgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Yuqoridagi qatordan kelib chiqmagan qatorni toping.",
    'Найди строку, которая не следует из строки над ней.',
    'Find the line that does not follow from the line above it.',
  ),
  rows: [
    { id: 'r1', text: '5x − 3 = 17,   x = 4' },
    { id: 'r2', text: '5 · 4 − 3' },
    { id: 'r3', text: '5 · 1' },
    { id: 'r4', text: '5' },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart: tenglama va tekshiriladigan son.", 'Это условие: уравнение и число, которое проверяют.', 'That is the condition: the equation and the number being checked.'),
    r2: L("Bu yerda faqat x o'rniga to'rt qo'yilgan. Boshqa hech nima o'zgarmagan.", 'Здесь только поставили четвёрку вместо x. Больше ничего не изменилось.', 'Here only the four took the place of x. Nothing else changed.'),
    r4: L("Bu qator uchinchisidan to'g'ri kelib chiqadi: 5 karra 1 bu 5. Xato yuqoriroqda.", 'Эта строка верно следует из третьей: 5 умножить на 1 это 5. Ошибка выше.', 'This line follows correctly from the third: 5 times 1 is 5. The mistake is higher up.'),
  },
  tags: { r1: 'Z5', r2: 'Z5', r4: 'Z5' },
  proofFill: {
    template: ['5 · 4 − 3 = ', { slot: 0 }],
    parts: [{ id: 'v17', label: '17' }, { id: 'v5', label: '5' }, { id: 'v20', label: '20' }, { id: 'v13', label: '13' }],
    answer: ['v17'],
    prompt: L(
      "Ikkinchi qatorni to'g'ri hisoblang: avval ko'paytirish, keyin ayirish.",
      'Посчитай вторую строку правильно: сначала умножение, потом вычитание.',
      'Work out the second line correctly: multiplication first, then subtraction.',
    ),
    checkNote: L('17 va 17. Tenglik to\'g\'ri, demak 4 ildiz. O\'quvchi uni bekorga rad etgan', '17 и 17. Равенство верное, значит 4 корень. Ученик отверг его напрасно', '17 and 17. The equality is true, so 4 is a root. The student rejected it for nothing'),
    wrongs: [
      { key: 'v20', tag: 'Z5', hint: L("20 bu 5 karra 4. Uchni ayirish qolib ketdi.", '20 это 5 умножить на 4. Вычесть три осталось несделанным.', '20 is 5 times 4. Taking away the three was left undone.') },
      { key: '*', tag: 'Z5', hint: L("Ko'paytirish ikkinchi bosqichda, ayirish birinchisida. Ikkinchi bosqich oldin ketadi.", 'Умножение вторая ступень, вычитание первая. Вторая ступень идёт раньше.', 'Multiplication is second stage, subtraction is first. The second stage goes first.') },
    ],
  },
  audio: [
    A('mount', "O'quvchi to'rtni tekshirdi va uni ildiz emas deb rad etdi. Lekin javob noto'g'ri.", 'Ученик проверил четвёрку и отверг её как не корень. Но ответ неверен.', 'A student checked the four and rejected it as not a root. But the answer is wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping. Har qanday noto'g'ri qatorni emas, aynan birinchisini.", 'Найди строку, где ошибка появилась впервые. Не любую неверную, а именно первую.', 'Find the line where the mistake first appears. Not any wrong line, the first one.'),
    A('proof', "Topdingiz. Endi ikkinchi qatorni o'zingiz to'g'ri hisoblang.", 'Нашёл. Теперь посчитай вторую строку сам как надо.', 'You found it. Now work out the second line correctly yourself.'),
    A('done', "O'n yetti va o'n yetti. To'rt haqiqatan ildiz ekan. Tekshirishning o'zi xato bajarilgan.", 'Семнадцать и семнадцать. Четвёрка и правда корень. Сама проверка была сделана неверно.', 'Seventeen and seventeen. The four really is a root. The check itself was done wrongly.'),
  ],
}

function Screen12({ screen, onAnswer, ...rest }) {
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
// EKRAN 13. KO'CHIRISH. Vaziyatdan TENGLAMAGA, keyin ildizga.
// ============================================================
const S13 = {
  eyebrow: L("TESKARI YO'L", 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L('Vaziyatdan tenglamaga', 'Из ситуации в уравнение', 'From a situation to an equation'),
  rounds: [
    {
      template: ['x + ', { slot: 0 }, ' = ', { slot: 1 }],
      parts: [{ id: 'p20', label: '20' }, { id: 'p45', label: '45' }, { id: 'p25', label: '25' }, { id: 'p65', label: '65' }],
      answer: ['p20', 'p45'],
      prompt: L(
        "Bir son o'ylandi, unga 20 qo'shildi va 45 hosil bo'ldi. Shu haqda tenglama yozing.",
        'Задумали число, прибавили к нему 20 и получили 45. Запиши это уравнением.',
        'A number was thought of, 20 was added to it and 45 came out. Write this as an equation.',
      ),
      checkNote: L("O'ylangan son noma'lum, shuning uchun uning o'rnida harf turadi", 'Задуманное число неизвестно, поэтому на его месте стоит буква', 'The number thought of is unknown, so a letter stands in its place'),
      wrongs: [
        { key: 'p25|p45', tag: 'Z6', hint: L("25 bu javob, uni hali topmadik. Tenglamada shartdagi sonlar turadi.", '25 это ответ, мы его ещё не нашли. В уравнении стоят числа из условия.', '25 is the answer, we have not found it yet. The equation holds the numbers from the condition.') },
        { key: '*', tag: 'Z6', hint: L("Shartda ikkita son bor: qo'shilgani va hosil bo'lgani.", 'В условии два числа: то, которое прибавили, и то, которое получилось.', 'The condition has two numbers: the one added and the one that came out.') },
      ],
    },
    {
      template: ['x = ', { slot: 0 }],
      parts: [{ id: 'q25', label: '25' }, { id: 'q65', label: '65' }, { id: 'q20', label: '20' }, { id: 'q45', label: '45' }],
      answer: ['q25'],
      prompt: L(
        "Endi ildizni toping va tekshiring.",
        'Теперь найди корень и проверь его.',
        'Now find the root and check it.',
      ),
      checkNote: L("25 qo'shuv 20 teng 45. Tenglik to'g'ri, demak o'ylangan son 25", '25 плюс 20 равно 45. Равенство верное, значит задумали 25', '25 plus 20 is 45. The equality is true, so the number thought of was 25'),
      wrongs: [
        { key: 'q65', tag: 'Z2', hint: L("65 bu 45 qo'shuv 20. Uni qo'ysangiz, chapda 85 chiqadi.", '65 это 45 плюс 20. Подставь его, и слева выйдет 85.', '65 is 45 plus 20. Substitute it and the left gives 85.') },
        { key: '*', tag: 'Z3', hint: L("Har bir sonni qo'yib, chap tomonni hisoblang. Qaysi biri 45 beradi.", 'Подставь каждое число и посчитай левую часть. Какое из них даст 45.', 'Substitute each number and work out the left side. Which gives 45.') },
      ],
    },
  ],
  reward: {
    title: L("Tenglama -- yozib qo'yilgan savol", 'Уравнение это записанный вопрос', 'An equation is a question written down'),
    text: L(
      "Noma'lum son harf bilan belgilanadi, shart esa tenglik bo'lib yoziladi. Shundan keyin uni tekshirish mumkin.",
      'Неизвестное число обозначают буквой, а условие записывают равенством. После этого его можно проверить.',
      'The unknown number gets a letter, and the condition is written as an equality. After that it can be checked.',
    ),
  },
  audio: [
    A('mount', "Butun dars davomida tenglama tayyor edi. Endi uni o'zingiz yozasiz.", 'Весь урок уравнение было готовым. Теперь ты запишешь его сам.', 'All lesson the equation was given. Now you write it yourself.'),
    A('r1', "Tenglama tayyor. Endi ildizni toping.", 'Уравнение готово. Теперь найди корень.', 'The equation is ready. Now find the root.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S13.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [rows, setRows] = useState([])
  const done = idx >= S13.rounds.length
  const r = S13.rounds[idx]
  const LABELS = ['x + 20 = 45', 'x = 25']
  return (
    <Frame meta={S13} screen={screen} audio={audio} solved={done} {...rest}>
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
            onAnswer({ ...res, screen, role: 'transfer', part: 'r' + (idx + 1) })
          }}
        />
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 14. BLITS. Darsdagi YAGONA baholanadigan ekran (§8.5).
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      wrap: true,
      question: null,
      prompt: L("4x teng 24 tenglamaning ildizi qaysi son?", 'Какое число корень уравнения 4x = 24?', 'Which number is the root of the equation 4x = 24?'),
      ok: L("To'rtga ko'paytirilganda yigirma to'rt beradigan son.", 'Число, которое при умножении на четыре даёт двадцать четыре.', 'The number that times four gives twenty four.'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '20', tag: 'Z2', hint: L("20 bu 24 ayirish 4. Yozuvda ko'paytirish turibdi.", '20 это 24 минус 4. В записи стоит умножение.', '20 is 24 minus 4. The line has a multiplication.') },
        { id: 'c', label: '28', tag: 'Z2', hint: L("28 bu 24 qo'shuv 4. Uni qo'ysangiz, chapda 112 chiqadi.", '28 это 24 плюс 4. Подставь его, и слева выйдет 112.', '28 is 24 plus 4. Substitute it and the left gives 112.') },
        { id: 'd', label: '96', tag: 'Z2', hint: L("96 bu 24 karra 4. Ildiz esa bundan kichik son.", '96 это 24 умножить на 4. А корень число поменьше.', '96 is 24 times 4. The root is a smaller number.') },
      ],
    },
    {
      prompt: L("2x + 1,   x = 3", '2x + 1,   x = 3', '2x + 1,   x = 3'),
      ok: L("Avval ko'paytirish, keyin qo'shish.", 'Сначала умножение, потом сложение.', 'Multiplication first, then addition.'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '8', tag: 'Z5', hint: L("8 bu 2 karra qavs 3 qo'shuv 1. Yozuvda qavs yo'q.", '8 это 2 умножить на скобку 3 плюс 1. Скобок в записи нет.', '8 is 2 times bracket 3 plus 1. There are no brackets in the line.') },
        { id: 'c', label: '6', tag: 'Z5', hint: L("6 bu 2 karra 3. Birni qo'shish qolib ketdi.", '6 это 2 умножить на 3. Прибавить единицу осталось несделанным.', '6 is 2 times 3. Adding the one was left undone.') },
        { id: 'd', label: '231', tag: 'Z5', hint: L("Sonlar yonma-yon yozilgan. Ular orasida amallar bor.", 'Числа записали рядом. А между ними есть действия.', 'The numbers were written side by side. But there are operations between them.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("x qo'shuv 5 teng x tenglamaning nechta ildizi bor?", 'Сколько корней у уравнения x + 5 = x?', 'How many roots does the equation x + 5 = x have?'),
      ok: L("Chap tomon har doim beshga katta, shuning uchun tenglik hech qachon to'g'ri bo'lmaydi.", 'Левая часть всегда на пять больше, поэтому равенство не бывает верным.', 'The left side is always five bigger, so the equality is never true.'),
      items: [
        { id: 'a', correct: true, label: L("Bittasi ham yo'q", 'Ни одного', 'None') },
        { id: 'b', tag: 'Z4', label: L('Bitta', 'Один', 'One'), hint: L("Qaysi son ekanini ayting va uni qo'yib ko'ring. Chap tomon baribir beshga katta chiqadi.", 'Назови какое и подставь его. Левая часть всё равно выйдет на пять больше.', 'Name which one and substitute it. The left side still comes out five bigger.') },
        { id: 'c', tag: 'Z4', label: L('Beshta', 'Пять', 'Five'), hint: L("Beshlik yozuvda turibdi, lekin u ildizlarni sanamaydi.", 'Пятёрка стоит в записи, но она не считает корни.', 'The five is in the line, but it does not count roots.') },
        { id: 'd', tag: 'Z1', label: L("Qancha son bo'lsa, shuncha", 'Сколько угодно', 'As many as you like'), hint: L("Bitta sonni qo'yib ko'ring va ikkala tomonni solishtiring.", 'Подставь хоть одно число и сравни обе части.', 'Substitute even one number and compare both sides.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Tenglamani yechish nima degani?", 'Что значит решить уравнение?', 'What does it mean to solve an equation?'),
      ok: L("Hamma ildizni topish yoki ildiz yo'qligini ko'rsatish.", 'Найти все корни или показать, что их нет.', 'To find all the roots or to show that there are none.'),
      items: [
        { id: 'a', correct: true, label: L("Hamma ildizni topish yoki yo'qligini ko'rsatish", 'Найти все корни или показать, что их нет', 'Find all roots or show there are none') },
        { id: 'b', tag: 'Z4', label: L('Bitta ildiz topish', 'Найти один корень', 'Find one root'), hint: L("Ildiz bittadan ko'p bo'lishi mumkin, va umuman bo'lmasligi ham mumkin.", 'Корней может быть больше одного, а может не быть вовсе.', 'There may be more than one root, or none at all.') },
        { id: 'c', tag: 'Z6', label: L("Chap tomonni hisoblash", 'Посчитать левую часть', 'Work out the left side'), hint: L("Chap tomonda harf bor, uni son qo'ymasdan hisoblab bo'lmaydi.", 'В левой части стоит буква, её нельзя посчитать, не подставив число.', 'The left side has a letter, it cannot be worked out without substituting a number.') },
        { id: 'd', tag: 'Z6', label: L("Harfni olib tashlash", 'Убрать букву', 'Remove the letter'), hint: L("Harfni olib tashlamaydilar, uning o'rniga son qo'yadilar.", 'Букву не убирают, на её место ставят число.', 'The letter is not removed, a number takes its place.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Bu darsdagi yagona baholanadigan ekran, shuning uchun shoshilmang.", 'Блиц, четыре вопроса. Это единственный оцениваемый экран урока, поэтому не спеши.', 'Quick round, four questions. This is the only graded screen of the lesson, so take your time.'),
    A('1', "Ikkinchisi. Bu tekshirish.", 'Второй. Это проверка.', 'Second. This is a check.'),
    A('2', "Uchinchisi. Chegaraviy holat.", 'Третий. Граничный случай.', 'Third. The edge case.'),
    A('3', "Oxirgisi so'z bilan.", 'Последний вопрос словами.', 'The last one is in words.'),
  ],
}

function Screen14({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S14.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const resRef = useRef([])
  const total = S14.items.length
  return (
    <Frame meta={S14} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S14.items}
        question={S14.question}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
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
// EKRAN 15. YAKUN. Yangi matematika ham, yangi savol ham YO'Q (§4.2).
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Tenglik son tanlaydi", 'Равенство отбирает число', 'An equality selects a number'),
  gate: S1.gate,
  fix: {
    tokens: ['a', '=', '3'],
    value: '36',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Ikkinchi tabloga ildiz qo'yildi, va ikkala tomon ham o'ttiz olti bo'ldi. Tenglik to'g'ri.",
    'На верхнее табло встал корень, и обе части стали равны тридцати шести. Равенство верное.',
    'The root went onto the upper board, and both sides became thirty six. The equality is true.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    one: L("faqat tenglikni to'g'ri qiladigan son", 'годится только число, при котором равенство верно', 'only the number that makes it true'),
    any: L("baribir istalgan son", 'по-прежнему любое число', 'still any number'),
    rhs: L("36 harfning qiymati", 'тридцать шесть и есть значение буквы', 'thirty six is the value of the letter'),
    drop: L('harfni olib tashlash kerak', 'букву надо убрать', 'the letter should be dropped'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  // Plashkalar UCH TILGA BO'LINMAYDI -- ular oddiy satrlar. Shuning uchun
  // ularda SO'Z bo'lmasligi kerak: «ildiz yo'q» ruscha versiyada ham
  // o'zbekcha bo'lib turardi. Belgi esa hamma tilda bir xil o'qiladi.
  chips: ['12 · a = 36 → a = 3', 'x + 4 = 9 → x = 5', '3x − 2 = 7,  x = 3 ✓', 'x + 5 = x  ≠'],
  twoLabel: L('Ifoda va tenglama', 'Выражение и уравнение', 'An expression and an equation'),
  twoA: '12 · a',
  twoB: '12 · a = 36',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "chiziqli tenglama: ildiz hisoblanadi",
    'линейное уравнение: корень вычисляют',
    'a linear equation: the root is computed',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz va mana qanday chiqdi.", 'Вернёмся к началу. Вот что ты предполагал и вот как оказалось.', 'Back to the start. This is what you predicted and this is how it turned out.'),
    A('mount', "Ifoda istalgan sonni qabul qiladi. Tenglama esa tanlaydi: faqat ildiz tenglikni to'g'ri qiladi.", 'Выражение принимает любое число. А уравнение отбирает: только корень делает равенство верным.', 'An expression accepts any number. An equation selects: only the root makes the equality true.'),
    A('mount', "Keyingi darsda ildizni tanlab emas, hisoblab topamiz.", 'В следующем уроке корень будем не подбирать, а вычислять.', 'In the next lesson the root will be computed, not guessed.'),
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

export default function Grade7Dars07({
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
    else console.log('[Grade7 Dars07] onFinished', payload)
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
