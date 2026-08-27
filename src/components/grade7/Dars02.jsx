// ============================================================================
// 7-sinf, Dars 2. O'ZGARUVCHILI IFODALAR.  (Выражения с переменными)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// Raskadrovka: src/books/grade7/DARS02_SKELET.md
// Namuna: src/components/grade7/Dars01.jsx -- SINF ETALONI.
//
// Bu faylda FAQAT MA'LUMOT va asboblarni ulash bor: mexanika `./tools.jsx` da,
// yadro `./core.jsx` da (§9.1). `Options`, `Feedback`, `useSfx`, `useAnswerFx`
// bu yerda YO'Q.
//
// DARSNING ASOSIY G'OYASI. 1-dars shu bilan tugagandi: bitta yozuv ikki xil
// son berdi, va bu XATO edi. 2-dars aynan shu manzara bilan boshlanadi --
// 12 karra a, ikkita safar, 24 va 36, -- lekin endi bu xato emas, bu
// O'ZGARUVCHINING XOSSASI. O'quvchi yangi mavzuga kechagi «noto'g'ri» bilan
// to'qnashib kiradi.
//
// METODIST QARORLARI 2026-08-15 (ETALON_7SINF.md §3.4, §3.5):
//   - ishchi so'z «o'zgaruvchi», «harf» emas: 7-sinf o'quvchisi buni biladi;
//   - darslikka HAVOLA YO'Q: na paragraf, na bet, na «darslik» so'zi --
//     ekranda ham, ovozda ham. Manba faqat skeletda qoladi;
//   - xuk sahnasi O'ZINIKI: `RideScene` asbobi `tools.jsx` da.
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
  qMeta,
  useMobileZoom,
  useT,
} from './core.jsx'
import {
  AuditRows,
  HistoryTape,
  Probe,
  ProbeChain,
  RideScene,
  RuleBuilder,
  SlotFill,
  StairsReveal,
  SubstituteRows,
  Transform,
  TwoValues,
} from './tools.jsx'

const LESSON_ID = 'alg_7_02'
const LESSON_TITLE = L("O'zgaruvchili ifodalar", 'Выражения с переменными', 'Expressions with variables')
const LESSON_NO = L('2-dars', 'Урок 2', 'Lesson 2')
const TOTAL = 15

const BLOCK = { label: L('B1-blok', 'Блок Б1', 'Block B1'), from: 1, to: 6, current: 2 }

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

// ============================================================
// TEGLAR. Baho emas: qaysi yanglish tushuncha ishga tushgani (§8.5).
// ============================================================
const TAGS = {
  Z1: L('bitta yozuvda bitta qiymat', 'у одной записи одно значение', 'one expression has just one value'),
  Z2: L("ko'rinmaydigan ko'paytirish belgisi", 'невидимый знак умножения', 'the invisible multiplication sign'),
  Z3: L("son qo'yilgandan keyingi amallar tartibi", 'порядок действий после подстановки', 'the order of operations after substituting'),
  Z4: L("o'zgaruvchi o'rniga har qanday son", 'вместо переменной любое число', 'any number can replace the variable'),
  Z5: L('manfiy son qavssiz qo\'yildi', 'отрицательное подставлено без скобок', 'a negative substituted without brackets'),
  Z6: L('ikki o\'zgaruvchi chalkashdi', 'две переменные перепутаны', 'the two variables got mixed up'),
  Z7: L('ifoda tenglama bilan chalkashdi', 'выражение спутано с уравнением', 'an expression mistaken for an equation'),
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

// Bir xil harakat -- BIR XIL so'z (1-darsdagi qoida).
const ASK_VALUE = L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is the value?')
const ASK_BUILD = L(
  "Qatorni yig'ing va qiymatni toping.",
  'Собери строку и найди значение.',
  'Build the line and find the value.',
)

// Qayta yozish amallari. Ro'yxat butun dars uchun BIR XIL.
// Birinchi amal 2-darsda YANGI: son o'zgaruvchi o'rniga qo'yiladi.
const ACTIONS = [
  { id: 'put', label: L("O'zgaruvchi o'rniga son qo'yish", 'Поставить число вместо переменной', 'Put a number in place of the variable') },
  { id: 'bracket', label: L('Qavs ichidagini hisoblash', 'Посчитать в скобках', 'Do what is inside the brackets') },
  { id: 'stage2', label: L('Ikkinchi bosqich amali', 'Действие второй ступени', 'A second-stage operation') },
  { id: 'stage1', label: L('Birinchi bosqich amali', 'Действие первой ступени', 'A first-stage operation') },
]

const levelOf = (firstTry, total) => {
  if (firstTry === null || firstTry === undefined) return 'none'
  if (firstTry >= total) return 'closed'
  if (firstTry === total - 1) return 'one'
  return 'back'
}

// ============================================================
// Umumiy ramka: sarlavha, maydon rangi, navigatsiya.
// ============================================================
function Frame({ meta, screen, audio, solved, onPrev, onNext, onFinish, finished, children }) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  const nav = {
    back: meta.noBack ? null : (
      <Btn tone="ghost" onClick={onPrev} disabled={screen === 0}>
        {t(UI.back)}
      </Btn>
    ),
    next: last ? (
      <Btn tone="accent" onClick={onFinish} disabled={finished}>
        {finished ? t(UI.saved) : t(UI.finish)}
      </Btn>
    ) : (
      <Btn onClick={onNext} disabled={!canNext} ready={canNext}>
        {t(UI.next)}
      </Btn>
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
// EKRAN 1. XUK. Bitta yozuv, ikkita safar. Baholanmaydi, teg ham yozmaydi.
// Kechagi darsda «bitta yozuv, ikki son» XATO edi. Bugun -- xossa.
// ============================================================
const S1 = {
  eyebrow: L("O'ZGARUVCHILI IFODALAR", 'ВЫРАЖЕНИЯ С ПЕРЕМЕННЫМИ', 'EXPRESSIONS WITH VARIABLES'),
  noBack: true,
  noNotes: true,
  title: L('Bitta yozuv, ikki safar', 'Одна запись, две поездки', 'One expression, two rides'),
  speed: 12,
  runs: [2, 3],
  probe: {
    question: L('Nega bitta yozuv ikki xil son berdi?', 'Как одна запись дала два разных числа?', 'How did one expression give two different numbers?'),
    items: [
      {
        id: 'var',
        // Inglizcha yorliqlar QISQA: 390 da ular uzunroq va xuk 14px oshib
        // ketgandi (o'lchov 2026-08-15). Ma'no o'zgarmadi, gap qisqardi.
        label: L(
          "Yozuvda o'zgaruvchi bor, uning o'rniga har xil son qo'yiladi",
          'В записи есть переменная, на её место можно поставить разные числа',
          'It has a variable, and different numbers can take its place',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Uni shu yozuvning o'zida qo'lingiz bilan tekshiramiz.",
          'Прогноз принят. Проверим его руками на этой же записи.',
          'Your prediction is taken. We will check it by hand on this very expression.',
        ),
      },
      {
        id: 'wrongcount',
        label: L("Safarlardan biri noto'g'ri hisoblangan", 'Одну из поездок посчитали неверно', 'One of the rides was worked out wrongly'),
        hint: L(
          "Ikkala qatorni o'zingiz hisoblang. 12 karra 2 va 12 karra 3. Ikkalasi ham to'g'ri. Demak gap hisobda emas, o'zgaruvchi o'rnida nima turganida.",
          'Посчитай обе строки сам. 12 умножить на 2 и 12 умножить на 3. Обе верны. Значит дело не в счёте, а в том, что стоит на месте переменной.',
          'Work out both lines yourself. 12 times 2 and 12 times 3. Both are right. So it is not about the counting, it is about what stands in the place of the variable.',
        ),
      },
      {
        id: 'one',
        label: L(
          "Yozuv noto'g'ri, qiymat bitta bo'lishi kerak",
          'Запись неверная, значение должно быть одно',
          'The expression is wrong, the value should be one',
        ),
        hint: L(
          "Birinchi darsda shunday edi, u yerda sonlar farq qila olmasdi. Bu yozuv kechagidan nimasi bilan farq qilishiga qarang. Unda kecha bo'lmagan harf paydo bo'ldi.",
          'В первом уроке так и было, там числа расходиться не могли. Посмотри, чем эта запись отличается от вчерашней. В ней появилась буква, которой вчера не было.',
          'In lesson one that was true, there the numbers could not differ. Look at how this expression differs from yesterday one. A letter has appeared that was not there before.',
        ),
      },
      {
        id: 'unknown',
        label: L("a bu noma'lum son, uni topish kerak", 'Буква a это неизвестное число, его надо найти', 'The letter a is an unknown number and it has to be found'),
        hint: L(
          "Topish mumkin bo'lgan narsa yashiringan bo'ladi. Bu yerda son yashiringan emas. Har bir safar tagidagi yozuvga qarang, u yerda son to'g'ridan to'g'ri aytilgan.",
          'Найти можно то, что спрятано. Здесь число не спрятано. Посмотри на подпись под каждой поездкой, там оно названо прямо.',
          'You can find what is hidden. Here nothing is hidden. Look at the caption under each ride, the number is named there outright.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bugungi mavzu o'zgaruvchili ifodalar. Velosipedchi soatiga o'n ikki kilometr tezlik bilan yuradi.", 'Сегодня тема урока выражения с переменными. Велосипедист едет со скоростью двенадцать километров в час.', 'Today the topic is expressions with variables. A cyclist rides at twelve kilometres an hour.'),
    A('mount', "Ikki soatda u yigirma to'rt kilometr yurdi. Uch soatda o'ttiz olti kilometr.", 'За два часа он проехал двадцать четыре километра. За три часа тридцать шесть.', 'In two hours he covered twenty four kilometres. In three hours thirty six.'),
    A('mount', "Ikkala safar ustida bitta yozuv turibdi. O'n ikki karra a.", 'Над обеими поездками стоит одна запись. Двенадцать умножить на a.', 'One expression stands over both rides. Twelve times a.'),
    A('mount', "Kecha bitta yozuv ikki xil son berdi va bu xato edi. Bugun esa bu xato emas.", 'Вчера одна запись дала два разных числа, и это была ошибка. Сегодня это не ошибка.', 'Yesterday one expression gave two different numbers and that was a mistake. Today it is not a mistake.'),
    A('mount', "Sizningcha nima bo'lyapti. Javobni tanlang, bu taxmin, uning uchun baho yo'q. Dars oxirida unga qaytamiz.", 'Как думаешь, что здесь происходит. Выбери ответ, это прогноз, оценки за него нет, и в конце урока мы к нему вернёмся.', 'What do you think is going on. Pick an answer, this is a prediction, it is not graded, and we will come back to it at the end.'),
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
      {/* Sarlavhani `Frame` chizadi. Bu yerda ikkinchi marta chizilganda u
          ekranda IKKI MARTA turardi (surat 2026-08-15) -- o'lchov buni
          ko'rmaydi, chunki hammasi sig'ib turadi.
          Sahna KATTA: xukda ekranning yarmi bo'sh qolardi, sonlar esa
          o'n piksellik bo'lib ko'rinmasdi. */}
      <RideScene speed={S1.speed} runs={S1.runs} size="mid" />
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
// EKRAN 2. TAYANCH. Uchta narsa 6-sinfdan. Hech biri MASHQNI takrorlamaydi:
// mashq -- son qo'yish, bu yerda esa harf umuman yo'q (1-darsning saboqi).
// Uchtasi 5, 12 va 7-ekranning aynan poydevorini qo'yadi.
// KVOTA EKRANI: yagona harakat -- to'rt variantdan bittasi (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: ASK_VALUE,
  items: [
    {
      prompt: '12 − 0,5 · (6 + 4)',
      ok: L("Avval qavs, keyin ko'paytirish. Nol butun besh o'ndan ko'paytirish -- yarmini olish.", 'Сначала скобка, потом умножение. Умножить на ноль целых пять десятых значит взять половину.', 'The bracket first, then the multiplication. Times nought point five means taking half.'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '115', tag: 'Z3', hint: L("Bu chapdan o'ngga sanaganda chiqadi: avval 12 dan yarim ayirilib, keyin o'nga ko'paytirilgan. Ko'paytirish esa ayirishdan oldin ketadi.", 'Так выходит при счёте слева направо: сначала из 12 вычли половину, потом умножили на десять. А умножение идёт раньше вычитания.', 'That comes from counting left to right: half taken from 12, then times ten. But multiplication goes before subtraction.') },
        { id: 'c', label: '5', hint: L("5 bu faqat ko'paytma. Yozuvning boshida yana 12 turibdi.", '5 это только произведение. В начале записи стоит ещё 12.', '5 is only the product. There is still a 12 at the start of the expression.') },
        { id: 'd', label: '9', tag: 'Z3', hint: L("Bu qavs ochilmaganda chiqadi: yarim faqat oltiga ko'paytirilgan. Qavsda esa ikkita son bor.", 'Так выходит, если скобку не посчитать: половину умножили только на шесть. А в скобке два числа.', 'That comes from ignoring the bracket: the half was multiplied by six only. But the bracket holds two numbers.') },
      ],
    },
    {
      prompt: '(−0,4) · (−5) − 3',
      ok: L("Ikki manfiy sonning ko'paytmasi musbat: ikki chiqadi. Ayirish esa undan keyin.", 'Произведение двух отрицательных положительно: выходит два. А вычитание идёт после.', 'The product of two negatives is positive: it gives two. The subtraction comes after.'),
      items: [
        { id: 'a', label: '−1', correct: true },
        { id: 'b', label: '−5', tag: 'Z5', hint: L("Ko'paytmaning ishorasini tekshiring: ikkala son ham manfiy edi, demak ko'paytma musbat.", 'Проверь знак произведения: оба числа были отрицательными, значит произведение положительно.', 'Check the sign of the product: both numbers were negative, so the product is positive.') },
        { id: 'c', label: '5', hint: L("Oxirgi belgi qo'shish emas. Yozuvning oxiriga qarang.", 'Последний знак не сложение. Посмотри на конец записи.', 'The last sign is not an addition. Look at the end of the expression.') },
        { id: 'd', label: '3,2', tag: 'Z3', hint: L("Bu ayirish oldin bajarilganda chiqadi. Ko'paytirish ikkinchi bosqich, u oldinroq ketadi.", 'Так выходит, если сначала выполнить вычитание. Умножение это вторая ступень, оно идёт раньше.', 'That comes from doing the subtraction first. Multiplication is the second stage and goes earlier.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L('12 : 0 ifodaning qiymati bormi?', 'Есть ли значение у записи 12 : 0?', 'Does the expression 12 : 0 have a value?'),
      ok: L("Nolga bo'lish amali yo'q.", 'Действия деления на нуль не существует.', 'There is no such operation as dividing by zero.'),
      items: [
        { id: 'a', label: L('Qiymati yo\'q', 'Значения нет', 'It has no value'), correct: true },
        { id: 'b', label: '0', tag: 'Z4', hint: L("Nol boshqa holatda chiqadi, nolni bo'lganda. Bu yerda esa nolga bo'linmoqda.", 'Нуль получается в другом случае, когда делят нуль. А здесь делят на нуль.', 'Zero comes from the other case, when you divide zero. Here you divide by zero.') },
        { id: 'c', label: '12', tag: 'Z4', hint: L("Nolga bo'lish sonni o'z holicha qoldirmaydi. Bunday amal umuman yo'q.", 'Деление на нуль не оставляет число прежним. Такого действия нет вовсе.', 'Dividing by zero does not leave the number as it was. There is no such operation at all.') },
        { id: 'd', label: L('Butun bo\'linmaydi', 'Не делится нацело', 'It does not divide evenly'), hint: L("12 ni 5 ga ham butun bo'lib bo'lmaydi, lekin uning qiymati bor. Gap boshqa narsada.", '12 на 5 тоже не делится нацело, но значение у него есть. Дело в другом.', '12 by 5 does not divide evenly either, yet it has a value. The reason is different.') },
      ],
    },
  ],
  audio: [
    A('mount', "Yangi mavzuga o'tishdan oldin uchta savolga javob beramiz. Bu yerda harf ham yo'q, baho ham yo'q.", 'Прежде чем идти в новую тему, ответим на три вопроса. Здесь нет ни буквы, ни оценки.', 'Before the new topic let us answer three questions. No letters here and nothing is graded.'),
    A('1', "Ikkinchisi. Manfiy son qavs ichida turibdi, minus esa uning bir qismi.", 'Второе. Отрицательное число стоит в скобках, и минус это его часть.', 'Second. A negative number stands in brackets, and the minus is part of it.'),
    A('2', "Uchinchisi. Bu savol bugun yana kerak bo'ladi.", 'Третье. Этот вопрос сегодня понадобится ещё раз.', 'Third. This question will come up again today.'),
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
// EKRAN 3. TUSHUNTIRISH 1. O'ZGARUVCHI -- SON UCHUN JOY.
// O'quvchi sonni UCH MARTA o'z qo'li bilan qo'yadi, har safar qiymat
// jadvalga muzlab qoladi. Savol faqat shundan keyin ochiladi -- ya'ni
// «qancha qiymat bo'ladi» degan savol tajribadan KEYIN keladi (§1.4).
// ============================================================
const S3 = {
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Son uchun joy', 'Место для числа', 'A place for a number'),
  numbers: [2, 3, 5],
  rows: [
    { id: 'r1', expr: '12 · a', sub: (n) => '12 · ' + n, val: (n) => 12 * n },
  ],
  probe: {
    question: L('12 · a yozuvi nechta har xil qiymat bera oladi?', 'Сколько разных значений может дать запись 12 · a?', 'How many different values can the expression 12 · a give?'),
    items: [
      {
        id: 'many',
        correct: true,
        label: L("O'zgaruvchi o'rniga qancha son qo'ysak", 'Столько, сколько разных чисел поставим вместо переменной', 'As many as there are numbers we put in its place'),
      },
      {
        id: 'one',
        tag: 'Z1',
        label: L('Bitta', 'Одно', 'One'),
        hint: L("O'zingiz yig'gan uchta qatorga qarang. Yozuv uchalasida bir xil, o'ngdagi sonlar esa har xil.", 'Посмотри на три строки, которые ты собрал. Запись во всех трёх одна и та же, а числа справа разные.', 'Look at the three lines you built. The expression is the same in all three, the numbers on the right differ.'),
      },
      {
        id: 'three',
        tag: 'Z1',
        label: L('Uchta', 'Три', 'Three'),
        hint: L("Uchta bu biz qo'ygan sonlar soni. Yana bir son qo'ying va sonlar tugadimi yoki yo'qmi ko'ring.", 'Три это сколько чисел мы поставили. Поставь ещё одно и посмотри, кончились ли числа.', 'Three is how many we put in. Put in one more and see whether the numbers run out.'),
      },
      {
        id: 'none',
        tag: 'Z7',
        label: L("a topilmaguncha bittasi ham yo'q", 'Ни одного, пока не найдём a', 'None until we find a'),
        hint: L("Qiymat allaqachon uch marta topildi va har safar izlamasdan. Sonni o'zingiz qo'ydingiz.", 'Значение уже найдено три раза, и каждый раз без поиска. Число ты поставил сам.', 'The value has already been found three times, each time without searching. You put the number in yourself.'),
      },
    ],
  },
  okText: L(
    "O'zgaruvchi sonni saqlamaydi, u son uchun joy tutib turadi. Qoida esa hamma safar uchun bitta.",
    'Переменная не хранит число, она держит для него место. А правило одно на все поездки.',
    'A variable does not store a number, it holds a place for one. The rule is the same for every ride.',
  ),
  audio: [
    A('mount', "Yozuvda a harfi turibdi. Uni o'zgaruvchi deb ataymiz.", 'В записи стоит буква a. Мы называем её переменной.', 'The expression has the letter a in it. We call it a variable.'),
    A('mount', "O'zgaruvchi son emas. U son uchun joy tutib turadi.", 'Переменная это не число. Она держит место для числа.', 'A variable is not a number. It holds a place for a number.'),
    A('mount', "Sonni o'zingiz tanlang va o'sha joyga qo'ying. Uch marta, har safar boshqa son bilan.", 'Выбери число сам и поставь его на это место. Три раза, каждый раз другое число.', 'Choose a number yourself and put it in that place. Three times, a different number each time.'),
    A('sub', "Son o'z joyini egalladi. Endi bu oddiy sonli ifoda, uni birinchi darsdagidek hisoblaymiz.", 'Число заняло своё место. Теперь это обычное числовое выражение, считаем его как в первом уроке.', 'The number has taken its place. Now it is an ordinary numerical expression, worked out as in lesson one.'),
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
// EKRAN 4. TUSHUNTIRISH 2. FARQLASH: 3a bu «uch va a» EMAS.
// O'quvchi tushib qolgan belgini O'ZI qo'yadi -- tayyor yozuvdan
// tanlamaydi, ya'ni kvotaga kirmaydi (§4.2).
// Son bilan isbot javobdan KEYIN chiqadi (§1.2): 12 va 7 yonma-yon.
// ============================================================
const S4 = {
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Ko'rinmaydigan belgi", 'Невидимый знак', 'The invisible sign'),
  template: ['3 ', { slot: 0 }, ' a'],
  parts: [
    { id: 'mul', label: '·' },
    { id: 'add', label: '+' },
    { id: 'sub', label: '−' },
    { id: 'div', label: ':' },
  ],
  answer: ['mul'],
  prompt: L(
    "3a yozuvida qaysi belgi tushirib qoldirilgan? Uni bo'sh joyga qo'ying.",
    'Какой знак пропущен в записи 3a? Поставь его в щель.',
    'Which sign is missing in 3a? Put it into the gap.',
  ),
  checkNote: L(
    "Son bilan o'zgaruvchi orasiga nuqta yozilmaydi, lekin u o'sha yerda turadi",
    'Между числом и переменной точку не пишут, но она там стоит',
    'A dot between a number and a variable is not written, but it is there',
  ),
  wrongs: [
    { key: 'add', tag: 'Z2', hint: L("Ikkala yozuvga 4 ni qo'ying. 3 karra 4 va 3 qo'shuv 4. Sonlar farq qildi, demak bular har xil yozuv.", 'Поставь 4 в обе записи. 3 умножить на 4 и 3 плюс 4. Числа разошлись, значит это разные записи.', 'Put 4 into both. 3 times 4 and 3 plus 4. The numbers came out different, so these are different expressions.') },
    { key: 'sub', tag: 'Z2', hint: L("To'g'ri to'rtburchak yuzasi formulasiga qarang, S teng ab. Agar tushirib qoldirilgan belgi minus bo'lganda, yuza ayirish bilan topilardi.", 'Посмотри на формулу площади прямоугольника, S равно ab. Если бы пропущенный знак был минусом, площадь считалась бы вычитанием.', 'Look at the area formula, S equals ab. If the missing sign were a minus, area would be found by subtracting.') },
    { key: 'div', tag: 'Z2', hint: L("4 ni qo'ying. 3 ni 4 ga bo'lsak 3 dan kichik chiqadi, 3 ni 4 ga ko'paytirsak kattaroq. Bu yozuvlardan biri 3a emas.", 'Подставь 4. 3 разделить на 4 меньше трёх, 3 умножить на 4 больше. Одна из этих записей не 3a.', 'Substitute 4. 3 divided by 4 is less than three, 3 times 4 is more. One of these is not 3a.') },
    { key: '*', tag: 'Z2', hint: L("Bo'sh joyga bitta belgi tushadi. 3a ni ovoz chiqarib o'qing va qanday amal eshitilishiga qarang.", 'В щель идёт один знак. Прочитай 3a вслух и послушай, какое действие слышно.', 'One sign goes into the gap. Read 3a aloud and listen for which operation you hear.') },
  ],
  proof: {
    left: { cap: L('3 · 4', '3 · 4', '3 · 4'), value: '12' },
    right: { cap: L('3 + 4', '3 + 4', '3 + 4'), value: '7' },
  },
  proofNote: L(
    "a teng 4 bo'lganda sonlar farq qildi. Demak bular har xil yozuv.",
    'При a равном 4 числа разошлись. Значит это разные записи.',
    'At a equal to 4 the numbers came out different. So these are different expressions.',
  ),
  audio: [
    A('mount', "Yozuvlarda ba'zan belgi ko'rinmaydi. Son bilan o'zgaruvchi orasidagi ko'paytirish nuqtasi ko'pincha yozilmaydi.", 'В записях иногда знак не виден. Точку умножения между числом и переменной часто не пишут.', 'Sometimes a sign is invisible. The multiplication dot between a number and a variable is often left out.'),
    A('mount', "Qaysi belgi yashiringanini o'zingiz qo'ying. Keyin uni son bilan tekshiramiz.", 'Поставь сам, какой знак спрятан. Потом проверим его числом.', 'Put in yourself which sign is hidden. Then we will check it with a number.'),
    A('checked', "Endi tekshiramiz. a o'rniga to'rtni qo'yamiz va ikkala yozuvni hisoblaymiz.", 'Теперь проверим. Вместо a поставим четыре и посчитаем обе записи.', 'Now let us check. We put four in place of a and work out both expressions.'),
    A('checked', "O'n ikki va yetti. Sonlar farq qildi, demak bular har xil yozuv, va 3a ulardan biri.", 'Двенадцать и семь. Числа разошлись, значит это разные записи, и 3a только одна из них.', 'Twelve and seven. The numbers differ, so these are different expressions, and 3a is only one of them.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const t = useT()
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
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {/* Isbot javobdan KEYIN: ikki son yonma-yon, «noto'g'ri» so'zi yo'q. */}
      {done ? (
        <>
          <TwoValues left={S4.proof.left} right={S4.proof.right} />
          <Hint>{t(S4.proofNote)}</Hint>
        </>
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3. O'SHA g'oya BOSHQA ko'rinishda: jadval emas,
// QATOR. Ko'paytirish belgisi 4-ekranda allaqachon qaytarilgan, shuning
// uchun bu yerda yozuv 5 + 3 · a shaklida keladi.
// ============================================================
const S5 = {
  eyebrow: L('QATOR OSTIGA QATOR', 'СТРОКА ПОД СТРОКОЙ', 'LINE UNDER LINE'),
  title: L("Son qo'yamiz va qayta yozamiz", 'Подставляем и переписываем', 'Substitute and rewrite'),
  start: '5 + 3 · a',
  steps: [
    {
      part: '3 · a', action: 'put', to: '5 + 3 · 4', parts: ['3 · a', '5 + 3'],
      needPart: L('Avval qismni tanlang.', 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'stage2', part: '3 · a', tag: 'Z2', hint: L("O'zgaruvchiga ko'paytirib bo'lmaydi. Uning o'rnida son turmaguncha, ko'paytiradigan narsa yo'q.", 'На переменную умножить нельзя. Пока на её месте не стоит число, умножать не на что.', 'You cannot multiply by a variable. Until a number stands in its place there is nothing to multiply by.') },
        { action: 'stage1', part: '5 + 3', tag: 'Z3', hint: L("Birinchi darsni eslang, qo'shish ikkinchi bosqich ishlaguncha kutadi. Ikki tartibni qoralamada hisoblang va sonlarni solishtiring.", 'Вспомни первый урок, сложение ждёт, пока сработает вторая ступень. Посчитай оба порядка на черновике и сравни числа.', 'Recall lesson one, addition waits for the second stage. Work out both orders on the draft and compare.') },
        { action: 'put', part: '5 + 3', hint: L("Bu qismda o'zgaruvchi yo'q. Son qayerga tushishini yozuvdan toping.", 'В этой части переменной нет. Найди в записи, куда идёт число.', 'There is no variable in this part. Find in the expression where the number goes.') },
        { action: 'bracket', hint: L("Bu yozuvda qavs yo'q.", 'В этой записи скобок нет.', 'There are no brackets here.') },
      ],
    },
    {
      part: '3 · 4', action: 'stage2', to: '5 + 12', parts: ['3 · 4', '5 + 3'],
      needPart: L('Avval qismni tanlang.', 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'put', tag: 'Z3', hint: L("Bu qatorda o'zgaruvchi qolmadi. Unga yana bir bor qarang.", 'В этой строке переменной уже нет. Посмотри на неё ещё раз.', 'There is no variable left in this line. Look at it again.') },
        { action: 'stage1', part: '5 + 3', tag: 'Z3', hint: L("Ko'paytirish hali bajarilmadi, u qo'shishdan oldin ketadi.", 'Умножение ещё не сделано, оно идёт раньше сложения.', 'The multiplication is not done yet, it goes before the addition.') },
      ],
    },
    {
      part: '5 + 12', action: 'stage1', to: '17', parts: ['5 + 12'],
      needPart: L('Avval qismni tanlang.', 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'stage2', hint: L("Ikkinchi bosqich amallari tugadi.", 'Действия второй ступени закончились.', 'The second-stage operations are done.') },
      ],
    },
  ],
  footNote: L('Qiymat topildi', 'Значение найдено', 'The value is found'),
  reward: {
    title: L('Tartib o\'zgarmadi', 'Порядок не изменился', 'The order did not change'),
    text: L(
      "Sonlar ustida amallarning bajarilish tartibi o'zgaruvchi bo'lganda ham saqlanib qoladi. Yangi qadam faqat bitta: son o'z joyiga qo'yiladi.",
      'Порядок действий над числами сохраняется и когда в записи есть переменная. Новый шаг только один: число становится на своё место.',
      'The order of operations over numbers holds even when the expression has a variable. There is only one new step: the number takes its place.',
    ),
  },
  audio: [
    A('mount', "Endi o'sha ishni jadval bilan emas, qator bilan qilamiz. Daftardagidek, ustma-ust.", 'Теперь сделаем ту же работу не таблицей, а строкой. Как в тетради, одна под другой.', 'Now the same work, not as a table but as lines. Like in a notebook, one under the other.'),
    A('mount', "a teng to'rt. Har qadamda qismini tanlang va amalni ayting.", 'a равно четырём. На каждом шаге выбирай часть и называй действие.', 'a equals four. At each step pick a part and name the operation.'),
    A('step2', "Son o'z joyiga tushdi. Endi bu oddiy sonli ifoda.", 'Число встало на своё место. Теперь это обычное числовое выражение.', 'The number has taken its place. Now it is an ordinary numerical expression.'),
    A('step3', "Ikkinchi bosqich oldin ketdi. Qo'shish kutdi.", 'Вторая ступень пошла раньше. Сложение подождало.', 'The second stage went first. The addition waited.'),
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
      <Transform
        audio={audio}
        start={S5.start}
        steps={S5.steps}
        actions={ACTIONS}
        footNote={S5.footNote}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4. O'ZINGIZ, YANGI HOLAT: ikkita o'zgaruvchi.
// Javob TANLANMAYDI, bo'laklardan YIG'ILADI (§4.2), ortiqcha bo'laklar
// yanglish tushunchalardan olingan (§5.1).
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Ikki o\'zgaruvchi, ikki joy', 'Две переменные, два места', 'Two variables, two places'),
  template: [{ slot: 0 }, ' + 3 · ', { slot: 1 }, ' = ', { slot: 2 }],
  parts: [
    { id: 'p5', label: '5' },
    { id: 'p2', label: '2' },
    { id: 'p11', label: '11' },
    { id: 'p37', label: '37' },
    { id: 'p16', label: '16' },
  ],
  answer: ['p5', 'p2', 'p11'],
  prompt: L(
    "a = 5, b = 2. a + 3b qatorini yig'ing va qiymatini toping.",
    'a = 5, b = 2. Собери строку a + 3b и найди её значение.',
    'a = 5, b = 2. Build the line a + 3b and find its value.',
  ),
  checkNote: L(
    "Har xil o'zgaruvchi har xil joy, va har biri o'z sonini kutadi",
    'Разные переменные это разные места, и каждое ждёт своё число',
    'Different variables are different places, and each waits for its own number',
  ),
  wrongs: [
    { key: 'p5|p2|p37', tag: 'Z2', hint: L("32 bu yonma-yon qo'yilgan 3 va 2. Ular orasida ko'paytirish belgisi bor, oldingi ekranda uni o'zingiz qo'ygansiz.", '32 это 3 и 2, поставленные рядом. Между ними знак умножения, ты сам ставил его на прошлом экране.', '32 is 3 and 2 placed side by side. Between them is a multiplication sign, you put it there yourself.') },
    { key: 'p2|p5|p16', tag: 'Z6', hint: L("Siz 5 ni b turgan joyga qo'ydingiz. Shartga qarang, 5 a uchun aytilgan.", 'Ты поставил 5 туда, где стоит b. Посмотри в условие, 5 названо для a.', 'You put 5 where b stands. Check the condition, 5 was given for a.') },
    { key: 'p5|p2|p16', tag: 'Z3', hint: L("16 bu avval 5 qo'shuv 3, keyin 2 ga ko'paytirish. Qo'shish ko'paytirishdan oldin ishlab ketdi.", '16 это сначала 5 плюс 3, потом умножить на 2. Сложение сработало раньше умножения.', '16 is 5 plus 3 first, then times 2. Addition went before multiplication.') },
    { key: '*', tag: 'Z6', hint: L("Birinchi katakka a ning soni, ikkinchisiga b ning soni, uchinchisiga esa butun yozuvning qiymati tushadi.", 'В первую клетку идёт число для a, во вторую для b, в третью значение всей записи.', 'The first box takes the number for a, the second for b, the third the value of the whole expression.') },
  ],
  audio: [
    A('mount', "Yozuvda ikkita har xil o'zgaruvchi bor. Ular ikki xil joy, va har biri o'z sonini oladi.", 'В записи две разные переменные. Это два разных места, и каждое берёт своё число.', 'There are two different variables. Two different places, and each takes its own number.'),
    A('mount', "Qatorni yig'ing va qiymatni toping.", 'Собери строку и найди значение.', 'Build the line and find the value.'),
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
// EKRAN 7. TUSHUNTIRISH 5. CHEGARAVIY HOLAT: har qanday son bo'lavermaydi.
// `askFirst` -- AVVAL savol, qo'yish esa KEYIN. Aks holda jadval javobni
// o'quvchi o'rniga aytib qo'yardi (§8.1).
// KVOTA EKRANI: yagona harakat -- to'rt variantdan bittasi.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Har qanday son bo'lavermaydi", 'Не всякое число подходит', 'Not every number fits'),
  numbers: [0],
  // `val` bo'sh satr qaytaradi: natija joyi BO'SH qoladi va bu ko'rinadi.
  rows: [
    { id: 'q2', expr: '12 : a', sub: () => '12 : 2', val: () => 6 },
    { id: 'q4', expr: '12 : a', sub: () => '12 : 4', val: () => 3 },
    { id: 'q0', expr: '12 : a', sub: () => '12 : 0', val: () => '' },
  ],
  probe: {
    question: L("12 : a yozuvida a o'rniga qaysi sonni qo'yib bo'lmaydi?", 'Какое число нельзя поставить вместо a в записи 12 : a?', 'Which number cannot take the place of a in 12 : a?'),
    items: [
      { id: 'zero', label: '0', correct: true },
      { id: 'one', label: '1', tag: 'Z4', hint: L("1 ni qo'ying va hisoblang. 12 ni 1 ga bo'ling. Son chiqdi, demak 1 to'g'ri keladi.", 'Поставь 1 и посчитай. 12 разделить на 1. Число получилось, значит 1 подходит.', 'Put in 1 and work it out. 12 divided by 1. A number came out, so 1 fits.') },
      { id: 'twelve', label: '12', tag: 'Z4', hint: L("12 ni qo'ying. 12 ni 12 ga bo'ling. Son chiqdi.", 'Поставь 12. 12 разделить на 12. Число получилось.', 'Put in 12. 12 divided by 12. A number came out.') },
      { id: 'any', label: L("Har qanday son bo'ladi", 'Любое можно', 'Any number fits'), tag: 'Z4', hint: L("12 ni nolga bo'lib ko'ring. Xuddi shunday topshiriq tayanch ekranida bor edi.", 'Попробуй разделить 12 на нуль. Такое же задание было на экране опоры.', 'Try dividing 12 by zero. The same task was on the warm-up screen.') },
    ],
  },
  okText: L(
    "Nolga bo'lish mumkin emas, shuning uchun nol o'zgaruvchi qiymatlaridan chiqib ketadi.",
    'Делить на нуль нельзя, поэтому нуль выпадает из значений переменной.',
    'You cannot divide by zero, so zero drops out of the values of the variable.',
  ),
  audio: [
    A('mount', "O'zgaruvchi o'rniga har qanday son qo'yish mumkinmi. Avval javob bering, keyin tekshiramiz.", 'Любое ли число можно поставить вместо переменной. Сначала ответь, потом проверим.', 'Can any number take the place of a variable. Answer first, then we will check.'),
    // DIQQAT: bu yerda `sub` bo'lishi MUMKIN EMAS. `askFirst` rejimida son
    // tanlanmaydi, ya'ni `onStep('sub')` hech qachon chaqirilmaydi va replika
    // butunlay jim qolardi (grade10-on-event-jim-replika naqshi).
    A('row1', "Endi qo'yib ko'ramiz. Ikki, to'rt va nol.", 'Теперь подставим. Два, четыре и нуль.', 'Now let us substitute. Two, four and zero.'),
    A('row3', "Uchinchi qatorda natija joyi bo'sh qoldi. Nolga bo'lish amali yo'q, demak bu yozuvning qiymati ham yo'q.", 'В третьей строке место результата осталось пустым. Деления на нуль нет, значит и значения у этой записи нет.', 'In the third line the result slot stayed empty. There is no dividing by zero, so this expression has no value.'),
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
        letter="a"
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
// EKRAN 8. QOIDA. O'quvchi son qo'yish ALGORITMINI yig'adi, keyin
// kartochka ochiladi. Maydon TO'Q SARIQ -- darsdagi yagona rangli ekran.
// DARSLIKKA HAVOLA YO'Q (metodist qarori 2026-08-15).
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("avval ko'rinmaydigan ko'paytirish belgisini qaytaramiz", 'сначала возвращаем невидимый знак умножения', 'first bring back the invisible multiplication sign') },
    { id: 'f2', label: L("so'ng o'zgaruvchi o'rniga son qo'yamiz", 'затем ставим число вместо переменной', 'then put the number in place of the variable') },
    { id: 'f3', label: L("manfiy sonni qavs bilan qo'yamiz", 'отрицательное число ставим в скобках', 'a negative number goes in brackets') },
    { id: 'f4', label: L("so'ng amallarni sonlardagi tartibda bajaramiz", 'затем выполняем действия в том же порядке, что у чисел', 'then carry out the operations in the same order as for numbers') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Son qo'yishdan OLDIN nima qilish kerakligini o'ylang: 3a da amal belgisi ko'rinmaydi.",
    'Порядок нарушен. Подумай, что делается ДО подстановки: в 3a знак действия не виден.',
    'The order is off. Think what comes BEFORE substituting: in 3a the operation sign is invisible.',
  ),
  lawChips: [
    { label: '·', tone: 's2' },
    { label: 'a', tone: 'par' },
    { label: '( )', tone: 'par' },
    { label: 'II', tone: 's2' },
    { label: 'I', tone: 's1' },
  ],
  lawSweep: L(
    "belgi, son, qavs, so'ng bosqichlar",
    'знак, число, скобка, потом ступени',
    'sign, number, bracket, then the stages',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Algebraik ifoda sonlar va harflardan tuzilib, amal belgilari bilan birlashtirilgan ifodadir.",
        'Алгебраическое выражение это выражение, состоящее из чисел и букв в сочетании со знаками арифметических операций.',
        'An algebraic expression is an expression made of numbers and letters joined by operation signs.',
      ),
      L(
        "Harflar o'rniga son qo'yilib, amallar bajarilsa, hosil bo'lgan son ifodaning son qiymati deyiladi.",
        'Если вместо букв подставить число и выполнить действия, полученное число называется числовым значением выражения.',
        'If a number is put in place of the letters and the operations are carried out, the number obtained is called the numerical value of the expression.',
      ),
    ],
  },
  hookCap: L('Bitta yozuv, ko\'p qiymat', 'Одна запись, много значений', 'One expression, many values'),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("3a bu 3 karra a", '3a это 3 умножить на a', '3a is 3 times a'),
    L("II bosqich -- ko'paytirish va bo'lish", 'II ступень — умножение и деление', 'II stage is multiplication and division'),
    L('I bosqich -- qo\'shish va ayirish', 'I ступень — сложение и вычитание', 'I stage is addition and subtraction'),
  ],
  audio: [
    A('mount', "Hamma narsani ko'rdik. Endi son qo'yish tartibini so'z bilan yig'amiz.", 'Всё, что нужно, мы увидели. Теперь соберём словами порядок подстановки.', 'We have seen everything we need. Now let us put the order of substitution into words.'),
    A('mount', "Bo'laklarni to'g'ri tartibda joylashtiring.", 'Разложи фрагменты в верном порядке.', 'Put the pieces in the right order.'),
    A('ok', "To'g'ri. Endi qisqa ta'rifni o'qing.", 'Верно. Теперь прочитай короткое определение.', 'Correct. Now read the short definition.'),
    A('ok', "Va birinchi ekranga qayting. Bitta yozuv, ikkita safar, ikkita son. Chunki o'zgaruvchi son uchun joy tutib turadi.", 'И вернёмся к первому экрану. Одна запись, две поездки, два числа. Потому что переменная держит место для числа.', 'And back to the first screen. One expression, two rides, two numbers. Because the variable holds a place for a number.'),
  ],
}

function Screen8({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S8.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const rule = useMemo(
    () => ({ badge: t(S8.rule.badge), lines: S8.rule.lines.map(t) }),
    [t],
  )
  return (
    <Frame meta={S8} screen={screen} audio={audio} solved={done} {...rest}>
      <RuleBuilder
        audio={audio}
        fragments={S8.fragments}
        answer={S8.answer}
        wrongHint={S8.wrongHint}
        tag="Z2"
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
// EKRAN 9. MASHQ 1. Uchta bir xil turdagi yozuv. Javob TANLANMAYDI,
// bo'laklardan YIG'ILADI, ya'ni bu ekran kvotaga kirmaydi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchta qiymatni topamiz', 'Находим три значения', 'Finding three values'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Uchala yozuvda ham o'zgaruvchi bitta narsani anglatdi: son uchun joy. Yozuvlar har xil, ish esa bitta.",
      'Во всех трёх записях переменная значила одно и то же: место для числа. Записи разные, а работа одна.',
      'In all three the variable meant the same thing: a place for a number. Different expressions, the same job.',
    ),
  },
  rounds: [
    {
      template: ['4 · ', { slot: 0 }, ' = ', { slot: 1 }],
      parts: [{ id: 'p7', label: '7' }, { id: 'p28', label: '28' }, { id: 'p47', label: '47' }, { id: 'p11', label: '11' }],
      answer: ['p7', 'p28'],
      prompt: L("4x, bunda x = 7. Qatorni yig'ing.", '4x, где x = 7. Собери строку.', '4x, where x = 7. Build the line.'),
      checkNote: L("4 · 7 = 28", '4 · 7 = 28', '4 · 7 = 28'),
      wrongs: [
        { key: 'p7|p47', tag: 'Z2', hint: L("47 bu yonma-yon turgan 4 va 7. Ular orasida ko'paytirish bor.", '47 это 4 и 7, стоящие рядом. Между ними умножение.', '47 is 4 and 7 side by side. Between them is a multiplication.') },
        { key: 'p7|p11', tag: 'Z2', hint: L("11 bu 4 qo'shuv 7. Yozuvda esa qo'shish emas, ko'paytirish yashiringan.", '11 это 4 плюс 7. А в записи спрятано не сложение, а умножение.', '11 is 4 plus 7. But what is hidden in the expression is a multiplication, not an addition.') },
        { key: '*', tag: 'Z2', hint: L("Birinchi katakka x ning soni, ikkinchisiga qiymat tushadi.", 'В первую клетку идёт число для x, во вторую значение.', 'The first box takes the number for x, the second the value.') },
      ],
    },
    {
      template: [{ slot: 0 }, ' + 9 = ', { slot: 1 }],
      parts: [{ id: 'q7', label: '7' }, { id: 'q16', label: '16' }, { id: 'q79', label: '79' }, { id: 'q63', label: '63' }],
      answer: ['q7', 'q16'],
      prompt: L("x + 9, bunda x = 7. Qatorni yig'ing.", 'x + 9, где x = 7. Собери строку.', 'x + 9, where x = 7. Build the line.'),
      checkNote: L('7 + 9 = 16', '7 + 9 = 16', '7 + 9 = 16'),
      wrongs: [
        { key: 'q7|q79', tag: 'Z2', hint: L("79 bu yonma-yon yozilgan 7 va 9. Ular orasida qo'shish belgisi turibdi.", '79 это 7 и 9, записанные рядом. Между ними стоит знак сложения.', '79 is 7 and 9 written side by side. Between them stands an addition sign.') },
        { key: 'q7|q63', tag: 'Z3', hint: L("63 bu 7 karra 9. Belgiga qarang, u ko'paytirish emas.", '63 это 7 умножить на 9. Посмотри на знак, он не умножение.', '63 is 7 times 9. Look at the sign, it is not a multiplication.') },
        { key: '*', tag: 'Z2', hint: L("Birinchi katakka x ning soni, ikkinchisiga qiymat tushadi.", 'В первую клетку идёт число для x, во вторую значение.', 'The first box takes the number for x, the second the value.') },
      ],
    },
    {
      template: [{ slot: 0 }, ' : 2 = ', { slot: 1 }],
      parts: [{ id: 'w8', label: '8' }, { id: 'w4', label: '4' }, { id: 'w16', label: '16' }, { id: 'w82', label: '82' }],
      answer: ['w8', 'w4'],
      prompt: L("x : 2, bunda x = 8. Qatorni yig'ing.", 'x : 2, где x = 8. Собери строку.', 'x : 2, where x = 8. Build the line.'),
      checkNote: L('8 ni 2 ga bo\'lsak 4 bo\'ladi', '8 : 2 будет 4', '8 : 2 = 4'),
      wrongs: [
        { key: 'w8|w16', tag: 'Z3', hint: L("16 bu 8 karra 2. Belgiga qarang, u bo'lish.", '16 это 8 умножить на 2. Посмотри на знак, он деление.', '16 is 8 times 2. Look at the sign, it is a division.') },
        { key: 'w8|w82', tag: 'Z2', hint: L("82 bu yonma-yon yozilgan 8 va 2. Ular orasida amal belgisi bor.", '82 это 8 и 2, записанные рядом. Между ними стоит знак действия.', '82 is 8 and 2 written side by side. There is an operation sign between them.') },
        { key: '*', tag: 'Z2', hint: L("Birinchi katakka x ning soni, ikkinchisiga qiymat tushadi.", 'В первую клетку идёт число для x, во вторую значение.', 'The first box takes the number for x, the second the value.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Endi uni uchta yozuvda sinab ko'ramiz.", 'Правило готово. Проверим его на трёх записях.', 'The rule is ready. Let us try it on three expressions.'),
    A('r1', "Ikkinchisi. Bu safar qo'shish.", 'Второе. На этот раз сложение.', 'Second. This time an addition.'),
    A('r2', "Uchinchisi. Bu safar bo'lish.", 'Третье. На этот раз деление.', 'Third. This time a division.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S9.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [rows, setRows] = useState([])
  const done = idx >= S9.rounds.length
  const r = S9.rounds[idx]
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
          disabled={!canAnswer}
          onSolved={(res) => {
            const label = t(r.prompt) + ' → ' + (r.parts.find((p) => p.id === r.answer[1]) || {}).label
            setRows((prev) => prev.concat(label))
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan: qavs va o'zgaruvchi BIRGA.
// Bitta o'zgaruvchi yozuvda IKKI MARTA uchraydi va u BITTA son.
// Birinchi qadam beshni IKKALA qavsga birdan qo'yadi -- ekranning
// butun ma'nosi shu.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L("Bitta o'zgaruvchi, ikki joy", 'Одна переменная, два места', 'One variable, two places'),
  start: '(x + 1) : (x − 2)',
  steps: [
    {
      action: 'put', to: '(5 + 1) : (5 − 2)', parts: ['x + 1', 'x − 2'],
      needPart: L("Avval o'zgaruvchi turgan qismni tanlang.", 'Сначала выбери часть, где стоит переменная.', 'First pick a part where the variable stands.'),
      wrongs: [
        { action: 'bracket', tag: 'Z6', hint: L("Qavs ichida hali o'zgaruvchi turibdi, uni hisoblab bo'lmaydi. Avval son qo'yiladi, va iks yozuvning ikkala joyida ham bitta son.", 'В скобке ещё стоит переменная, посчитать её нельзя. Сначала ставится число, и икс в обоих местах записи это одно и то же число.', 'A variable still stands inside the bracket, it cannot be worked out. The number goes in first, and the x in both places is one and the same number.') },
        { action: 'stage2', tag: 'Z3', hint: L("Qavslar orasidagi bo'lish oxirida bajariladi. Avval qavs ichidagi tayyor bo'lishi kerak.", 'Деление между скобками выполняется последним. Сначала должно быть готово то, что внутри скобок.', 'The division between the brackets goes last. What is inside the brackets has to be ready first.') },
        { action: 'stage1', tag: 'Z3', hint: L("Bu qism qavs ichida turibdi va u yerda hali o'zgaruvchi bor.", 'Эта часть стоит в скобке, и в ней ещё есть переменная.', 'That part is inside a bracket, and it still has a variable in it.') },
      ],
    },
    {
      action: 'bracket', to: '6 : 3', parts: ['5 + 1', '5 − 2'],
      needPart: L('Avval qismni tanlang.', 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'put', hint: L("Bu qatorda o'zgaruvchi qolmadi, iks o'rniga allaqachon 5 turibdi.", 'В этой строке переменной уже нет, вместо икса стоит 5.', 'There is no variable left in this line, a 5 stands where the x was.') },
        { action: 'stage2', tag: 'Z3', hint: L("Qavs ichidagi oldin hisoblanadi, bu birinchi darsning qoidasi.", 'Сначала считается то, что в скобках, это правило первого урока.', 'What is inside the brackets goes first, that is the rule from lesson one.') },
        { action: 'stage1', tag: 'Z3', hint: L("Qavs ichidagi oldin hisoblanadi.", 'Сначала считается то, что в скобках.', 'What is inside the brackets goes first.') },
      ],
    },
    {
      part: '6 : 3', action: 'stage2', to: '2', parts: ['6 : 3'],
      needPart: L('Avval qismni tanlang.', 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'bracket', hint: L("Qavslar ishini tugatdi va yo'qoldi.", 'Скобки сделали своё дело и исчезли.', 'The brackets have done their job and are gone.') },
        { action: 'stage1', hint: L("Bu amal bo'lish, ya'ni ikkinchi bosqich.", 'Это действие деление, то есть вторая ступень.', 'This operation is a division, that is the second stage.') },
      ],
    },
  ],
  footNote: L('Qiymat topildi', 'Значение найдено', 'The value is found'),
  reward: {
    title: L("Iks ikki joyda, son esa bitta", 'Икс в двух местах, число одно', 'The x is in two places, the number is one'),
    text: L(
      "Bitta yozuvdagi bir xil o'zgaruvchi bir xil sonni anglatadi. Shuning uchun besh ikkala qavsga birdan tushdi.",
      'Одна и та же переменная в одной записи значит одно и то же число. Поэтому пятёрка пошла сразу в обе скобки.',
      'The same variable in one expression means the same number. That is why the five went into both brackets at once.',
    ),
  },
  audio: [
    A('mount', "Endi qavsli yozuv. Bu yerda iks ikki marta uchraydi.", 'Теперь запись со скобками. Здесь икс встречается дважды.', 'Now an expression with brackets. Here the x appears twice.'),
    A('mount', "Iks teng besh. Diqqat qiling, iks yozuvning ikkala joyida ham bitta son.", 'Икс равен пяти. Обрати внимание, икс в обоих местах записи это одно число.', 'x equals five. Note that the x in both places is one and the same number.'),
    A('step2', "Besh ikkala qavsga birdan tushdi. Boshqacha bo'lishi mumkin emas, chunki harf bitta.", 'Пятёрка пошла сразу в обе скобки. Иначе быть не может, буква ведь одна.', 'The five went into both brackets at once. It cannot be otherwise, the letter is one.'),
    A('step3', "Qavslar ichidagi hisoblandi. Oxirgi amal qoldi.", 'Скобки посчитаны. Осталось последнее действие.', 'The brackets are worked out. One last operation is left.'),
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
      <Transform
        audio={audio}
        start={S10.start}
        steps={S10.steps}
        actions={ACTIONS}
        footNote={S10.footNote}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 11. MASHQ 3. ASBOBSIZ (§4.2). Ekranda na jadval, na qadamba-qadam
// yozuv, na sahna bor -- faqat javob shakli. Bu yerda MANFIY son birinchi
// marta o'quvchining qo'liga tushadi va u 12-ekranga tayyorlaydi.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L("Qiymatni o'zingiz yig'ing", 'Собери значение сам', 'Build the value yourself'),
  template: ['2 · 2 + ', { slot: 0 }, ' = ', { slot: 1 }],
  parts: [
    { id: 'mp', label: '(−1)' },
    { id: 'mn', label: '−1' },
    { id: 'v3', label: '3' },
    { id: 'v5', label: '5' },
  ],
  answer: ['mp', 'v3'],
  prompt: L(
    "2x + y, bunda x = 2, y = −1. x allaqachon qo'yilgan. y ni qo'ying va qiymatni toping.",
    '2x + y, где x = 2, y = −1. x уже подставлен. Поставь y и найди значение.',
    '2x + y, where x = 2 and y = −1. The x is already in. Put y in and find the value.',
  ),
  checkNote: L(
    "Manfiy son o'z ishorasi bilan birga qo'yiladi, shuning uchun qavsga olinadi",
    'Отрицательное число ставится вместе со своим знаком, поэтому его берут в скобки',
    'A negative number goes in with its sign, and that is why it is put in brackets',
  ),
  wrongs: [
    { key: 'mn|v3', tag: 'Z5', hint: L("Ikkita belgi ketma-ket turolmaydi. Sonni ishorasi bilan qavsga oling, shunda amal qayerda tugab, son qayerda boshlanishi ko'rinadi.", 'Два знака подряд стоять не могут. Возьми число со знаком в скобки, тогда видно, где кончается действие и начинается число.', 'Two signs cannot stand in a row. Put the number with its sign in brackets, then you see where the operation ends and the number begins.') },
    { key: 'mp|v5', tag: 'Z5', hint: L("5 bu 4 qo'shuv 1. Shartda esa y minus bir, ya'ni qo'shiladigan son manfiy.", '5 это 4 плюс 1. А в условии y минус единица, то есть прибавляемое число отрицательное.', '5 is 4 plus 1. But the condition gives y as minus one, so the number added is negative.') },
    { key: '*', tag: 'Z5', hint: L("Birinchi katakka y ning soni tushadi, ikkinchisiga butun yozuvning qiymati.", 'В первую клетку идёт число для y, во вторую значение всей записи.', 'The first box takes the number for y, the second the value of the whole expression.') },
  ],
  audio: [
    A('mount', "Endi ekranda yordam yo'q. Jadval ham, qadamlar ham ko'rinmaydi.", 'Теперь помощи на экране нет. Ни таблицы, ни шагов не будет.', 'Now there is no help on the screen. Neither a table nor the steps will appear.'),
    A('mount', "Diqqat qiling, y manfiy son. Uni qanday qo'yish kerakligini o'ylang.", 'Обрати внимание, y отрицательное число. Подумай, как его подставить.', 'Note that y is a negative number. Think how to substitute it.'),
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
// EKRAN 12. TUZOQ. Har qator to'g'ri KO'RINADI, javob esa noto'g'ri.
// Xatodan keyingi qatorlar undan TO'G'RI kelib chiqadi -- shuning uchun
// BIRINCHI noto'g'ri qatorni izlash kerak (§8.2).
// Qarshi misolni O'QUVCHI yig'adi, dastur emas.
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
    { id: 'r1', text: '5 − 2m' },
    { id: 'r2', text: '5 − 2 · m' },
    { id: 'r3', text: '5 − 2 · −3' },
    { id: 'r4', text: '5 − 2 − 3' },
    { id: 'r5', text: '0' },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu boshlang'ich yozuv, unda hali hech narsa qo'yilmagan.", 'Это исходная запись, в неё ещё ничего не подставлено.', 'That is the original expression, nothing has been substituted into it yet.'),
    r2: L("Bu yerda faqat 2 bilan o'zgaruvchi orasidagi nuqta qaytarilgan. Boshqa nima o'zgarganini tekshiring.", 'Здесь только вернули точку между 2 и переменной. Проверь, изменилось ли что-нибудь ещё.', 'Here only the dot between the 2 and the variable was brought back. Check whether anything else changed.'),
    r4: L("Bu qator uchinchisini halol davom ettiradi. Yuqoriga qarang, uchinchi qatorda yozilgan narsa allaqachon minus 2 minus 3 deb o'qiladi.", 'Эта строка честно продолжает третью. Посмотри выше, то, что записано в третьей, уже читается как минус 2 минус 3.', 'This line honestly continues the third. Look above, what is written in the third already reads as minus 2 minus 3.'),
    r5: L("5 dan 2 va 3 ni ayirsak, nol chiqadi. Xato bundan oldin paydo bo'lgan.", 'Если из 5 вычесть 2 и 3, получится нуль. Ошибка появилась раньше.', 'Taking 2 and 3 from 5 does give zero. The mistake appeared earlier.'),
  },
  tags: { r1: 'Z5', r2: 'Z5', r4: 'Z5', r5: 'Z5' },
  proofFill: {
    template: ['5 − 2 · ', { slot: 0 }, ' = ', { slot: 1 }],
    parts: [{ id: 'b3', label: '(−3)' }, { id: 'n3', label: '−3' }, { id: 'v11', label: '11' }, { id: 'v0', label: '0' }],
    answer: ['b3', 'v11'],
    prompt: L(
      "Uchinchi qatorni to'g'ri yig'ing. Manfiy sonni qavs bilan qo'ying va qiymatni hisoblang.",
      'Собери третью строку правильно. Поставь отрицательное число в скобках и посчитай значение.',
      'Build the third line correctly. Put the negative number in brackets and work out the value.',
    ),
    checkNote: L('11 va 0. Sonlar farq qildi, demak uchinchi qator ikkinchisiga teng emas', '11 и 0. Числа разошлись, значит третья строка не равна второй', '11 and 0. The numbers differ, so the third line is not equal to the second'),
    wrongs: [
      { key: 'b3|v0', tag: 'Z5', hint: L("Qavs to'g'ri qo'yildi. Endi hisoblang: 2 ni minus 3 ga ko'paytiring va 5 dan ayiring.", 'Скобки поставлены верно. Теперь посчитай: 2 умножить на минус 3 и вычесть из 5.', 'The brackets are right. Now work it out: 2 times minus 3, then take it from 5.') },
      { key: '*', tag: 'Z5', hint: L("2 ni minus 3 ga ko'paytirsak minus 6 chiqadi. 5 dan minus 6 ni ayirish esa qo'shish demakdir.", 'Два умножить на минус три это минус шесть. А вычесть минус шесть из пяти значит прибавить.', 'Two times minus three is minus six. And taking minus six from five means adding.') },
    ],
  },
  audio: [
    A('mount', "O'quvchi yechdi va xato qildi. Har bir qator to'g'ri ko'rinadi, javob esa noto'g'ri.", 'Ученик решил и ошибся. Каждая строка выглядит верной, а ответ неверен.', 'A student solved it and got it wrong. Every line looks right, yet the answer is wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping. Har qanday noto'g'ri qatorni emas, aynan birinchisini.", 'Найди строку, где ошибка появилась впервые. Не любую неверную, а именно первую.', 'Find the line where the mistake first appears. Not any wrong line, the first one.'),
    A('proof', "Topdingiz. Endi isbotlang. Uchinchi qatorni o'zingiz to'g'ri yig'ing va qiymatni hisoblang.", 'Нашёл. Теперь докажи. Собери третью строку сам как надо и посчитай значение.', 'You found it. Now prove it. Build the third line correctly yourself and work out the value.'),
    A('done', "O'n bir va nol. Sonlar farq qildi, demak uchinchi qator ikkinchisiga teng emas.", 'Одиннадцать и нуль. Числа разошлись, значит третья строка не равна второй.', 'Eleven and zero. The numbers differ, so the third line is not equal to the second.'),
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
// EKRAN 13. KO'CHIRISH. TESKARI yo'l: butun dars yozuv qiymatni berardi,
// endi VAZIYAT yozuvni beradi. Ikki bosqich, o'sha asbob.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI YO\'L', 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L("Vaziyatdan yozuvga", 'Из ситуации в запись', 'From a situation to an expression'),
  rounds: [
    {
      template: ['30 ', { slot: 0 }, ' ', { slot: 1 }],
      parts: [{ id: 'mul', label: '·' }, { id: 'add', label: '+' }, { id: 'pn', label: 'n' }, { id: 'p250', label: '250' }],
      answer: ['mul', 'pn'],
      prompt: L(
        "Bog'da n tup olma, har biridan 30 kg hosil. Butun hosilni n orqali yozing.",
        'В саду n яблонь, с каждой по 30 кг. Запиши весь урожай через n.',
        'A garden has n apple trees, 30 kg from each. Write the whole harvest through n.',
      ),
      checkNote: L('Yozuv har qanday bog\' uchun bitta, tup soni esa keyin qo\'yiladi', 'Запись одна на любой сад, а число яблонь подставляют потом', 'One expression for any garden, and the number of trees goes in later'),
      wrongs: [
        { key: 'add|pn', tag: 'Z2', hint: L("Ikkita tup uchun hisoblang. Har biridan 30 kilogramm bo'lsa, hosil 32 kilogrammmi yoki 60 mi?", 'Посчитай для двух яблонь. По тридцать килограммов с каждой это тридцать два килограмма или шестьдесят?', 'Work it out for two trees. Thirty kilograms from each, is that thirty two kilograms or sixty?') },
        { key: 'mul|p250', tag: 'Z7', hint: L("250 bu bitta bog'ning tup soni. Yozuv esa har qanday bog' uchun ishlashi kerak.", '250 это число яблонь одного сада. А запись должна работать для любого сада.', '250 is the tree count of one garden. The expression has to work for any garden.') },
        { key: '*', tag: 'Z7', hint: L("Birinchi katakka amal belgisi, ikkinchisiga tup sonini bildiruvchi o'zgaruvchi tushadi.", 'В первую клетку идёт знак действия, во вторую переменная, которая обозначает число яблонь.', 'The first box takes an operation sign, the second the variable that stands for the number of trees.') },
      ],
    },
    {
      template: ['30 · 250 = ', { slot: 0 }],
      parts: [{ id: 'a7500', label: '7500' }, { id: 'a280', label: '280' }, { id: 'a750', label: '750' }, { id: 'a75000', label: '75000' }],
      answer: ['a7500'],
      prompt: L(
        "Endi n = 250 bo'lganda hosilni hisoblang.",
        'Теперь посчитай урожай при n = 250.',
        'Now work out the harvest at n = 250.',
      ),
      checkNote: L('Yozuv o\'zgarmadi, faqat n o\'rnidagi son o\'zgardi', 'Запись не изменилась, изменилось только число на месте n', 'The expression did not change, only the number in the place of n did'),
      wrongs: [
        { key: 'a280', tag: 'Z2', hint: L("280 bu 30 qo'shuv 250. Yozuvdagi belgiga qarang.", '280 это 30 плюс 250. Посмотри на знак в записи.', '280 is 30 plus 250. Look at the sign in the expression.') },
        { key: '*', tag: 'Z2', hint: L("Har bir tupdan 30 kilogramm. Tup 250 ta. 3 ni 25 ga ko'paytiring va nollarni qo'shing.", 'С каждой яблони 30 килограммов. Яблонь 250. Умножь 3 на 25 и допиши нули.', 'Thirty kilograms from each tree, and there are 250 trees. Multiply 3 by 25 and add the zeros.') },
      ],
    },
  ],
  reward: {
    title: L("Bitta yozuv, har qanday bog'", 'Одна запись, любой сад', 'One expression, any garden'),
    text: L(
      "Tup 300 ta bo'lsa ham yozuv o'zgarmaydi, faqat n o'rnidagi son almashadi. Xuddi birinchi ekrandagi velosipedchidek.",
      'Даже если яблонь 300, запись не изменится, поменяется только число на месте n. Как и у велосипедиста с первого экрана.',
      'Even with 300 trees the expression stays, only the number in the place of n changes. Just like the cyclist on the first screen.',
    ),
  },
  audio: [
    A('mount', "Butun dars davomida yozuv qiymatni berardi. Endi teskarisi: vaziyat berilgan, yozuvni siz yig'asiz.", 'Весь урок запись задавала значение. Теперь наоборот: дана ситуация, запись собираешь ты.', 'All lesson the expression gave the value. Now the other way round: the situation is given, you build the expression.'),
    A('r1', "Yozuv tayyor. Endi tup soni ma'lum bo'ldi. Hisoblang.", 'Запись готова. Теперь число яблонь известно. Посчитай.', 'The expression is ready. Now the number of trees is known. Work it out.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S13.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [rows, setRows] = useState([])
  const done = idx >= S13.rounds.length
  const r = S13.rounds[idx]
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
            const label = idx === 0 ? '30 · n' : '30 · 250 → 7500'
            setRows((prev) => prev.concat(label))
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
// Ball FAQAT birinchi urinish uchun. To'rtinchi savol SO'Z bilan.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  question: ASK_VALUE,
  items: [
    {
      // Yozuv MATEMATIK satr bo'lib qoladi, proza emas: `.g7-expr` da
      // `white-space: nowrap` turadi va gap chetga chiqib KO'RINMAY qolardi
      // (§6.2). Shart yozuvning o'zida, vergul orqali.
      prompt: '4a,  a = 3',
      ok: L("Son bilan o'zgaruvchi orasida ko'paytirish yashiringan.", 'Между числом и переменной спрятано умножение.', 'A multiplication is hidden between the number and the variable.'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '43', tag: 'Z2', hint: L("43 bu yonma-yon turgan 4 va 3. Ular orasida amal belgisi bor.", '43 это 4 и 3, стоящие рядом. Между ними есть знак действия.', '43 is 4 and 3 side by side. There is an operation sign between them.') },
        { id: 'c', label: '7', tag: 'Z2', hint: L("7 bu 4 qo'shuv 3. Yashiringan belgi esa qo'shish emas.", '7 это 4 плюс 3. А спрятанный знак не сложение.', '7 is 4 plus 3. But the hidden sign is not an addition.') },
        { id: 'd', label: '1', hint: L("Bu ayirish. Yozuvda ayirish belgisi yo'q.", 'Это вычитание. Знака вычитания в записи нет.', 'That is a subtraction. There is no subtraction sign in the expression.') },
      ],
    },
    {
      prompt: '10 − 2a,  a = 4',
      ok: L("Avval ko'paytirish, keyin ayirish.", 'Сначала умножение, потом вычитание.', 'Multiplication first, then subtraction.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '32', tag: 'Z3', hint: L("32 bu chapdan o'ngga sanagani: avval 10 dan 2 ayirilgan, keyin 4 ga ko'paytirilgan.", '32 это счёт слева направо: сначала из 10 вычли 2, потом умножили на 4.', '32 is counting left to right: 2 taken from 10 first, then times 4.') },
        { id: 'c', label: '4', tag: 'Z2', hint: L("4 bu 10 dan 2 qo'shuv 4 ni ayirgani. 2a esa 2 qo'shuv a emas.", '4 получается, если из 10 вычесть 2 плюс 4. Но 2a это не 2 плюс a.', '4 comes from taking 2 plus 4 from 10. But 2a is not 2 plus a.') },
        { id: 'd', label: '−14', tag: 'Z2', hint: L("Bu yerda 2a 24 deb o'qilgan. Son bilan o'zgaruvchi yonma-yon turganda ular ko'paytiriladi.", 'Здесь 2a прочитано как 24. Когда число и переменная стоят рядом, они умножаются.', 'Here 2a was read as 24. When a number and a variable stand together they are multiplied.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("6 : a yozuvida a o'rniga qaysi sonni qo'yib bo'lmaydi?", 'Какое число нельзя поставить вместо a в записи 6 : a?', 'Which number cannot take the place of a in 6 : a?'),
      ok: L("Nolga bo'lish amali yo'q.", 'Действия деления на нуль не существует.', 'There is no such operation as dividing by zero.'),
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: '1', tag: 'Z4', hint: L("1 ni qo'ying va hisoblang. Son chiqadi.", 'Поставь 1 и посчитай. Число получится.', 'Put in 1 and work it out. A number comes out.') },
        { id: 'c', label: '6', tag: 'Z4', hint: L("6 ni qo'ying va hisoblang. Son chiqadi.", 'Поставь 6 и посчитай. Число получится.', 'Put in 6 and work it out. A number comes out.') },
        { id: 'd', label: L("Har qanday son bo'ladi", 'Любое можно', 'Any number fits'), tag: 'Z4', hint: L("6 ni nolga bo'lib ko'ring.", 'Попробуй разделить 6 на нуль.', 'Try dividing 6 by zero.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("a + 5 yozuvi nechta har xil qiymat bera oladi?", 'Сколько разных значений может дать запись a + 5?', 'How many different values can the expression a + 5 give?'),
      ok: L("O'zgaruvchi son uchun joy tutib turadi.", 'Переменная держит место для числа.', 'A variable holds a place for a number.'),
      items: [
        { id: 'a', correct: true, label: L("O'zgaruvchi o'rniga qancha son qo'ysak", 'Сколько чисел поставим вместо буквы', 'As many as the numbers put in its place') },
        { id: 'b', tag: 'Z1', label: L('Bitta', 'Одно', 'One'), hint: L("Unda a qo'shuv 5 yozuvi 2 qo'shuv 5 dan nimasi bilan farq qiladi.", 'Тогда чем запись a плюс 5 отличается от 2 плюс 5.', 'Then how does a plus 5 differ from 2 plus 5.') },
        { id: 'c', tag: 'Z1', label: L('Beshta', 'Пять', 'Five'), hint: L("Yozuvdagi 5 qiymatlarni sanamaydi, u qo'shiluvchi.", 'Пятёрка в записи не считает значения, она слагаемое.', 'The five in the expression does not count values, it is a term.') },
        { id: 'd', tag: 'Z7', label: L("a topilmaguncha bittasi ham yo'q", 'Ни одного, пока не найдём a', 'None until we find a'), hint: L("Izlaydigan narsa yo'q. Sonni o'zimiz qo'yamiz.", 'Искать нечего. Число мы ставим сами.', 'There is nothing to search for. We put the number in ourselves.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Bu darsdagi yagona baholanadigan ekran, shuning uchun shoshilmang.", 'Блиц, четыре вопроса. Это единственный оцениваемый экран урока, поэтому не спеши.', 'Quick round, four questions. This is the only graded screen of the lesson, so take your time.'),
    A('1', "Ikkinchisi. Bu yerda ikkita amal bor.", 'Второй. Здесь два действия.', 'Second. There are two operations here.'),
    A('2', "Uchinchisi chegara haqida.", 'Третий про границу.', 'The third is about the edge case.'),
    A('3', "Oxirgisi so'z bilan.", 'Последний вопрос словами.', 'The last one is in words.'),
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
          onAnswer({
            ...r,
            screen,
            role: 'blitz',
            scored: true,
            total,
            firstTry,
            level: levelOf(firstTry, total),
          })
        }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 15. YAKUN. Yangi matematika ham, yangi savol ham YO'Q (§4.2).
// Sahna XUKNI YOPADI: o'quvchi yo'lni bosadi va yangi safar chiziladi --
// o'zi son qo'yadi, yozuv esa o'zgarmaydi.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Bitta yozuv, ko'p qiymat", 'Одна запись, много значений', 'One expression, many values'),
  speed: 12,
  runs: [2, 3],
  tapValues: [5],
  tapSay: L(
    "Siz yangi son qo'ydingiz va yangi safar chiqdi. Yozuv esa o'zgarmadi. O'zgaruvchi shuning uchun kerak.",
    'Ты поставил новое число, и получилась новая поездка. А запись не изменилась. Для этого переменная и нужна.',
    'You put in a new number and a new ride appeared. The expression did not change. That is what a variable is for.',
  ),
  tapHint: L("Yo'lni bosing", 'Нажми на дорогу', 'Tap the road'),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    var: L("yozuvda o'zgaruvchi bor", 'в записи есть переменная', 'the expression has a variable'),
    wrongcount: L("safarlardan biri noto'g'ri hisoblangan", 'одну из поездок посчитали неверно', 'one of the rides was worked out wrongly'),
    one: L('bitta yozuvda bitta qiymat', 'у одной записи одно значение', 'one expression has one value'),
    unknown: L("a noma'lum son", 'a это неизвестное число', 'a is an unknown number'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['12 · a → 24', '12 · a → 36', '3a = 3 · a', 'a + 3b → 11', '12 : a → 6', '30 · n → 7500'],
  twoLabel: L("Bitta yozuv, har xil sonlar", 'Одна запись, разные числа', 'One expression, different numbers'),
  twoA: '12 · 2  →  24',
  twoB: '12 · 5  →  60',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "amallar xossalari: yozuvni qiymatini o'zgartirmasdan almashtirish",
    'свойства действий: как менять запись, не меняя её значения',
    'the properties of operations: changing an expression without changing its value',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz va mana qanday chiqdi.", 'Вернёмся к началу. Вот что ты предполагал и вот как оказалось.', 'Back to the start. This is what you predicted and this is how it turned out.'),
    A('mount', "O'zgaruvchi son uchun joy tutib turadi. Shuning uchun bitta yozuv butun bir safar turkumiga yetadi.", 'Переменная держит место для числа. Поэтому одной записи хватает на целую серию поездок.', 'A variable holds a place for a number. That is why one expression is enough for a whole family of rides.'),
    A('mount', "Yo'lni bosing va yangi safar qo'shing.", 'Нажми на дорогу и добавь новую поездку.', 'Tap the road and add a new ride.'),
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

  const onTap = useCallback(() => { audio.say(t(S15.tapSay)) }, [audio, t])

  return (
    <Frame meta={S15} screen={screen} audio={audio} solved {...rest}>
      {/* Sahna XUKDAN keladi va endi BOSILADI. Bu yangi savol emas (§4.2):
          o'quvchi hech nima tanlamaydi, allaqachon bilgan qoidani qo'llaydi.
          Tugma uchun alohida qator yo'q -- sahnaning O'ZI bosiladi. */}
      {/* Yakunda sahna BAZAVIY o'lchamda: pastda lenta va kartochka bor,
          o'rta pog'ona ularni pastki paneldan chiqarib yuborardi
          (surat 2026-08-15). Xukda esa sahnadan boshqa hech nima yo'q. */}
      <RideScene
        speed={S15.speed}
        runs={S15.runs}
        tap={{ values: S15.tapValues, onTap }}
      />
      <Hint>{t(S15.tapHint)}</Hint>

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

export default function Grade7Dars02({
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
    voiceGender: voiceGender || 'm', // 7-sinf: erkak ovoz
    lessonId: LESSON_ID,
    lessonNo: LESSON_NO,
    freeNav: true, // ishlab chiqish fazasi; sinf topshirilganda false
  })
  useMobileZoom()

  const [screen, setScreen] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const startedAt = useRef(Date.now())

  const onAnswer = useCallback((payload) => {
    setAnswers((prev) => prev.concat(payload))
  }, [])

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
    else console.log('[Grade7 Dars02] onFinished', payload)
  }, [answers, lang, onFinished])

  const Current = SCREENS[screen]

  return (
    <LangProvider value={lang}>
      <LangSetProvider value={setLang}>
        <style>{STYLES}</style>
        <div
          className={'lesson-root' + (screen === 7 ? ' is-rule' : '')}
          lang={lang}
        >
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
