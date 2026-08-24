// ============================================================================
// 7-sinf, Dars 04. AYNIYAT VA AYNIY O'ZGARTIRISHLAR.
// (Тождества и тождественные преобразования)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// ASBOB: B1 blokining asbobi -- SON QO'YISH (`SubstituteRows`) va QADAMMA-
// QADAM QAYTA YOZISH (`Transform`). Yangi asbob yozilmadi.
//
// DARS NEGA KECHIKDI. Metodist uni 2026-08-16 da to'xtatgan edi: darslikda
// «ayniyat» so'zi YO'Q -- ikkala nashrda ham, 192 betning birortasida ham.
// 2026-08-21 da metodist darsni QILISH kerak dedi. Shuning uchun dars
// darslik BERADIGAN narsaga qurilgan: amallarning xossalari (23-bet) va
// ifodani soddalashtirish. Atamaning o'zi (`ayniyat`) metodist tasdig'ini
// kutadi -- u faqat NOM, matematika esa darslikdan.
//
// ASOSIY XATO. Bitta son bilan tekshirish ISBOT deb qabul qilinadi.
// a qo'shuv a va a kvadrat -- a teng 2 da IKKALASI ham 4 beradi. Xuk shu
// tuzoqdan boshlanadi, tuzoq ekrani esa x kvadrat teng x ni nol va bir
// bilan «isbotlaydi».
//
// IKKINCHI XATO. Ayniyat va tenglama aralashadi: x qo'shuv 3 teng 8 ham
// tenglik, lekin u FAQAT bitta sonda bajariladi. Chegaraviy ekran shu
// farqni son bilan ko'rsatadi va 7-darsga yo'l ochadi.
//
// Obvyazka `core.jsx` da (`LessonFrame`, `createLesson`).
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
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
  useT,
} from './core.jsx'
import {
  AuditRows,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  SortZones,
  StairsReveal,
  SubstituteRows,
  Transform,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_04'
const LESSON_TITLE = L("Ayniyat va ayniy o'zgartirishlar", 'Тождества и тождественные преобразования', 'Identities and identity transformations')
const LESSON_NO = L('4-dars', 'Урок 4', 'Lesson 4')
const BLOCK = { label: L('B1-blok', 'Блок Б1', 'Block B1'), from: 1, to: 6, current: 4 }

const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

const buildSegments = (list, lang) =>
  list.map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: s.on === 'mount' ? (i === 0 ? 'on_mount' : 'after_previous') : 'on_event:' + s.on,
    waits_for: null,
  }))

const TAGS = {
  Z1: L("bitta son isbot deb olindi", 'одну подстановку приняли за доказательство', 'one substitution was taken as a proof'),
  Z2: L("ko'paytuvchi bitta hadga tarqatildi", 'множитель отнесли к одному члену', 'the factor reached only one term'),
  Z3: L("qavs oldidagi minus hisobga olinmadi", 'минус перед скобкой не учли', 'the minus before the bracket was ignored'),
  Z4: L("ayniyat va tenglama aralashdi", 'тождество и уравнение перепутаны', 'an identity was confused with an equation'),
  Z5: L("o'xshash hadlar ixchamlanmadi", 'подобные члены не приведены', 'like terms were not collected'),
  Z6: L("hisobda xato", 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// EKRAN 1. XUK. a qo'shuv a va a kvadrat: a teng 2 da IKKALASI 4 beradi.
// ============================================================
const S1 = {
  eyebrow: L("AYNIYAT", 'ТОЖДЕСТВО', 'IDENTITY'),
  noBack: true,
  noNotes: true,
  title: L('Bitta son yetadimi', 'Достаточно ли одного числа', 'Is one number enough'),
  gate: {
    source: { kind: 'plain', tokens: ['a', '=', '2'] },
    rows: [
      { tokens: ['a', '+', 'a'], value: '4' },
      { tokens: ['a²'], value: '4' },
    ],
    sign: '=',
  },
  probe: {
    question: L(
      "Ikki yozuv a teng 2 da bir xil son berdi. Bu ular HAR DOIM teng degani bo'ladimi?",
      'Две записи при a равном 2 дали одно и то же число. Значит ли это, что они равны ВСЕГДА?',
      'Two records gave the same number at a equal to 2. Does that mean they are ALWAYS equal?',
    ),
    items: [
      {
        id: 'no',
        label: L("Yo'q, bitta son yetmaydi", 'Нет, одного числа не хватит', 'No, one number is not enough'),
        hint: L(
          "Taxminingiz qabul qilindi. Uch xil son bilan tekshiramiz.",
          'Прогноз принят. Проверим тремя разными числами.',
          'Your prediction is taken. We will check with three different numbers.',
        ),
      },
      {
        id: 'yes',
        label: L("Ha, teng bo'ldi, demak har doim teng", 'Да, вышло равно, значит равно всегда', 'Yes, they came out equal, so they always are'),
        hint: L(
          "Boshqa son qo'yib ko'ring, masalan uchni. Ikkala yozuv ham bir xil son beradimi.",
          'Подставь другое число, например три. Дадут ли обе записи одно и то же.',
          'Try another number, say three. Will both records give the same value.',
        ),
      },
      {
        id: 'only2',
        label: L("Faqat a teng 2 da teng", 'Равны только при a равном 2', 'Equal only at a equal to 2'),
        hint: L(
          "Nolni ham sinab ko'ring: nol qo'shuv nol va nol kvadrat.",
          'Попробуй ещё ноль: ноль плюс ноль и ноль в квадрате.',
          'Try zero as well: zero plus zero and zero squared.',
        ),
      },
      {
        id: 'never',
        label: L("Hech qachon teng emas", 'Они не равны никогда', 'They are never equal'),
        hint: L(
          "Tablolarga qarang: a teng 2 da ikkala son ham to'rt.",
          'Посмотри на табло: при a равном 2 оба числа четыре.',
          'Look at the boards: at a equal to 2 both numbers are four.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki yozuv: a qo'shuv a va a kvadrat.", 'Две записи: a плюс a и a в квадрате.', 'Two records: a plus a, and a squared.'),
    A('mount', "a o'rniga ikki qo'ydik, va ikkala yozuv ham to'rt berdi.", 'Вместо a поставили два, и обе записи дали четыре.', 'We put two in place of a, and both records gave four.'),
    A('mount', "Shundan ular har doim teng degan xulosa chiqadimi. Taxmin qiling.", 'Следует ли из этого, что они равны всегда. Предположи.', 'Does it follow that they are always equal. Make a prediction.'),
  ],
}

function Screen1({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S1.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [picked, setPicked] = useState(null)
  return (
    <LessonFrame meta={S1} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <TwoRoutes source={S1.gate.source} rows={S1.gate.rows} sign={S1.gate.sign} />
      <Probe
        data={S1.probe}
        cols={2}
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
// EKRAN 2. TAYANCH. Amallarning xossalari va o'xshash hadlar.
// KVOTA EKRANI (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch qisqa savol', 'Три коротких вопроса', 'Three short questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  items: [
    {
      prompt: '3(a + 5)',
      ok: L("Ko'paytuvchi qavs ichidagi HAR hadga tarqaladi.", 'Множитель расходится на КАЖДЫЙ член скобки.', 'The factor spreads to EVERY term in the bracket.'),
      items: [
        { id: 'a', label: '3a + 15', correct: true },
        { id: 'b', label: '3a + 5', tag: 'Z2', hint: L("Beshlik ham uchga ko'paytiriladi.", 'Пятёрка тоже умножается на три.', 'The five is multiplied by three as well.') },
        { id: 'c', label: '3a · 15', tag: 'Z2', hint: L("Qavs ichida qo'shuv turgan edi, ko'paytirish emas.", 'Внутри скобки было сложение, а не умножение.', 'Inside the bracket there was addition, not multiplication.') },
        { id: 'd', label: '8a', tag: 'Z5', hint: L("Uch a va besh o'xshash hadlar emas.", 'Три a и пять не подобные члены.', 'Three a and five are not like terms.') },
      ],
    },
    {
      prompt: '−(a − 7)',
      ok: L("Minus qavs ichidagi har ishorani ag'daradi.", 'Минус переворачивает каждый знак в скобке.', 'The minus flips every sign inside the bracket.'),
      items: [
        { id: 'a', label: '−a + 7', correct: true },
        { id: 'b', label: '−a − 7', tag: 'Z3', hint: L("Yettilik oldida ayirish turgan edi, u ham ag'dariladi.", 'Перед семёркой было вычитание, оно тоже переворачивается.', 'There was a subtraction before the seven, and it flips too.') },
        { id: 'c', label: 'a − 7', tag: 'Z3', hint: L("Minus yo'qolmaydi, u birinchi hadga ham tegishli.", 'Минус не исчезает, он относится и к первому члену.', 'The minus does not vanish, it belongs to the first term too.') },
        { id: 'd', label: 'a + 7', tag: 'Z3', hint: L("Ikkala ishora ham ag'darildi, lekin birinchisi ham manfiy bo'lishi kerak.", 'Оба знака перевернулись, но первый тоже должен стать отрицательным.', 'Both signs flipped, but the first must become negative too.') },
      ],
    },
    {
      prompt: '2a + 3a',
      ok: L("Koeffitsiyentlar qo'shiladi, harf o'sha qoladi.", 'Складываются коэффициенты, буква остаётся та же.', 'The coefficients add, the letter stays the same.'),
      items: [
        { id: 'a', label: '5a', correct: true },
        { id: 'b', label: '6a', tag: 'Z5', hint: L("Ikki va uch ko'paytirilmaydi, qo'shiladi.", 'Два и три не умножают, а складывают.', 'Two and three are not multiplied but added.') },
        { id: 'c', label: '5a²', tag: 'Z5', hint: L("Qo'shishda ko'rsatkich o'zgarmaydi.", 'При сложении показатель не меняется.', 'Adding does not change the exponent.') },
        { id: 'd', label: '23a', tag: 'Z6', hint: L("Sonlar yonma-yon yozilmaydi, ular qo'shiladi.", 'Числа не приписываются рядом, они складываются.', 'Numbers are not written side by side, they are added.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol o'tgan darslardan. Bugun ular kerak.", 'Три коротких вопроса из прошлых уроков. Сегодня они понадобятся.', 'Three short questions from the earlier lessons. We need them today.'),
    A('1', "Ikkinchisi qavs oldidagi minus haqida.", 'Второй про минус перед скобкой.', 'The second is about the minus before a bracket.'),
    A('2', "Oxirgisi o'xshash hadlar haqida.", 'Последний про подобные члены.', 'The last is about like terms.'),
  ],
}

function Screen2({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S2.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S2} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S2.items}
        question={S2.question}
        cols={4}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'support' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1. XUKDAGI YOZUVLAR UCH SON BILAN.
// ============================================================
const S3 = {
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Uch xil son bilan', 'С тремя разными числами', 'With three different numbers'),
  numbers: [2, 3, 5],
  rows: [
    { id: 'r1', role: 'source', expr: 'a + a', sub: (n) => n + ' + ' + n, val: (n) => n + n },
    { id: 'r2', expr: 'a²', sub: (n) => n + '²', val: (n) => n * n },
  ],
  probe: {
    question: L(
      "Uch xil son qo'yildi. Bu ikki yozuv har doim tengmi?",
      'Подставили три разных числа. Равны ли эти две записи всегда?',
      'Three different numbers were substituted. Are these two records always equal?',
    ),
    items: [
      { id: 'no', correct: true, label: L("Yo'q, har doim emas", 'Нет, не всегда', 'No, not always') },
      { id: 'yes', tag: 'Z1', label: L('Ha, har doim teng', 'Да, равны всегда', 'Yes, always equal'), hint: L("Uch va besh da qatorlar boshqa son berdi, jadvalga qarang.", 'При трёх и пяти строки дали разные числа, посмотри в таблицу.', 'At three and five the rows gave different numbers, look at the table.') },
      { id: 'need', tag: 'Z1', label: L("Yana ko'proq son kerak", 'Нужно ещё больше чисел', 'More numbers are needed'), hint: L("Bitta qarama-qarshi misol yetadi: bitta sonda teng bo'lmasa, tenglik har doim to'g'ri emas.", 'Одного противоположного примера достаточно: если при одном числе не равно, равенство не всегда верно.', 'One counterexample is enough: if it fails at one number, the equality is not always true.') },
      { id: 'even', tag: 'Z1', label: L('Faqat juft sonlarda teng', 'Равны только при чётных', 'Equal only at even numbers'), hint: L("Ikkilik juft va teng chiqdi, lekin nol ham juft. Uchlik esa toq va u ham teng emas edi.", 'Двойка чётная и вышло равно, но и ноль чётный. А тройка нечётная и тоже не равно.', 'Two is even and came out equal, but zero is even too. Three is odd and also not equal.') },
    ],
  },
  okText: L(
    "Bitta son tenglikni ISBOTLAMAYDI. Bitta son esa uni RAD ETADI.",
    'Одно число равенство НЕ ДОКАЗЫВАЕТ. А вот опровергнуть одно число может.',
    'One number does not PROVE an equality. But one number can REFUTE it.',
  ),
  audio: [
    A('mount', "Xukdagi ikki yozuv shu yerda. Endi sonni o'zingiz tanlaysiz.", 'Обе записи с хука здесь. Теперь число выбираешь ты.', 'Both records from the hook are here. Now you choose the number.'),
    A('mount', "Uch marta, har safar boshqa son bilan.", 'Три раза, каждый раз другое число.', 'Three times, a different number each time.'),
    A('sub', "Ikki qatorni solishtiring.", 'Сравни две строки.', 'Compare the two rows.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S3.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 4. FARQLASH. Endi tenglik HAR SAFAR bajariladi -- va shu yerda
// atama kiritiladi.
// ============================================================
const S4 = {
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Bu safar har safar teng', 'На этот раз равно каждый раз', 'This time equal every time'),
  numbers: [1, 4, 10],
  rows: [
    { id: 'r1', role: 'source', expr: '2(x + 3)', sub: (n) => '2 · (' + n + ' + 3)', val: (n) => 2 * (n + 3) },
    { id: 'r2', expr: '2x + 6', sub: (n) => '2 · ' + n + ' + 6', val: (n) => 2 * n + 6 },
  ],
  probe: {
    question: L(
      "Uch sonda ham qatorlar bir xil son berdi. Bunday tenglikni nima deb atash mumkin?",
      'При всех трёх числах строки дали одно и то же. Как назвать такое равенство?',
      'At all three numbers the rows gave the same value. What can such an equality be called?',
    ),
    items: [
      { id: 'ident', correct: true, label: L("Har qanday qiymatda bajariladigan tenglik", 'Равенство, верное при любом значении', 'An equality true for every value') },
      { id: 'eq', tag: 'Z4', label: L("Bitta ildizi bor tenglama", 'Уравнение с одним корнем', 'An equation with one root'), hint: L("Tenglama faqat ba'zi sonlarda bajariladi. Bu yerda esa uchtasida ham bajarildi.", 'Уравнение выполняется лишь при некоторых числах. А здесь выполнилось при всех трёх.', 'An equation holds only at some numbers. Here it held at all three.') },
      { id: 'luck', tag: 'Z1', label: L('Tasodif', 'Совпадение', 'A coincidence'), hint: L("Uch xil son sinaldi: bir, to'rt va o'n. Tasodif uch marta ketma-ket bo'lmaydi.", 'Проверили три разных числа: один, четыре и десять. Совпадение трижды подряд не бывает.', 'Three different numbers were tried: one, four and ten. A coincidence does not happen three times in a row.') },
      { id: 'same', tag: 'Z4', label: L('Bir xil yozuvning ikki nusxasi', 'Две копии одной записи', 'Two copies of the same record'), hint: L("Yozuvlar boshqa: birida qavs bor, ikkinchisida yo'q. Teng bo'lgani esa qiymatlari.", 'Записи разные: в одной есть скобка, во второй нет. А равны их значения.', 'The records differ: one has a bracket, the other does not. It is their values that are equal.') },
    ],
  },
  okText: L(
    "Bunday tenglik AYNIYAT deyiladi.",
    'Такое равенство называют ТОЖДЕСТВОМ.',
    'Such an equality is called an IDENTITY.',
  ),
  audio: [
    A('mount', "Endi boshqa ikki yozuv: qavsli va qavssiz.", 'Теперь две другие записи: со скобкой и без.', 'Now two other records: one with a bracket, one without.'),
    A('mount', "Yana uch marta son qo'yamiz. Diqqat qiling, natijalar bir xil chiqadi.", 'Снова три раза подставим число. Обрати внимание, результаты выходят одинаковыми.', 'Again we substitute three times. Notice that the results come out the same.'),
    A('sub', "Ikki qatorni solishtiring.", 'Сравни две строки.', 'Compare the two rows.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S4.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
      <SubstituteRows
        audio={audio}
        rows={S4.rows}
        numbers={S4.numbers}
        runs={3}
        letter="x"
        question={S4.probe.question}
        options={S4.probe.items}
        okText={S4.okText}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 5. IKKINCHI KO'RINISH. Son qo'yish ISBOT emas. Isbot -- QAYTA
// YOZISH: xossani qo'llab, bir yozuvdan ikkinchisi chiqariladi.
// ============================================================
const ACTIONS = [
  { id: 'dist', label: L('Taqsimot xossasi', 'Свойство распределения', 'The distributive property') },
  { id: 'mul', label: L("Ko'paytirishni bajarish", 'Выполнить умножение', 'Carry out the multiplication') },
  { id: 'add', label: L("Qo'shishni bajarish", 'Выполнить сложение', 'Carry out the addition') },
]

const S5 = {
  eyebrow: L("ISBOT", 'ДОКАЗАТЕЛЬСТВО', 'THE PROOF'),
  title: L('Sonsiz isbot', 'Доказательство без чисел', 'A proof without numbers'),
  start: '2(x + 3)',
  ask: L(
    "Qaysi xossani qo'llaymiz? Yozuvdagi belgini bosing.",
    'Какое свойство применим? Нажми на знак в записи.',
    'Which property do we apply? Tap a sign in the record.',
  ),
  askAct: L('Qaysi xossa?', 'Какое свойство?', 'Which property?'),
  // ASBOB QOIDASI: bosiladigan narsa -- YOZUVDAGI AMAL BELGISI, qismning
  // nomi esa shu belgi ATROFIDAGI UCHLIK, qavslari olib tashlangan holda.
  // `2(x + 3)` da bosilishi mumkin bo'lgan yagona belgi qavs ichidagi qo'shuv,
  // uning nomi `2x + 3`. Ilgari bu yerda `2(x + 3)` turgan edi va ekranda
  // BOSILADIGAN NARSA QOLMAGAN edi (o'lchov 2026-08-21).
  steps: [
    {
      part: '2x + 3', action: 'dist', to: '2 · x + 2 · 3', parts: ['2x + 3'],
      needPart: L('Yozuvdagi amal belgisini bosing.', 'Нажми на знак действия в записи.', 'Tap an operation sign in the record.'),
      wrongs: [
        { action: 'add', tag: 'Z2', hint: L("x va uchlik o'xshash hadlar emas, ularni qo'shib bo'lmaydi.", 'x и тройка не подобные члены, их сложить нельзя.', 'x and three are not like terms, they cannot be added.') },
        { action: 'mul', tag: 'Z2', hint: L("Qavs ichida ko'paytirish yo'q. Ikkilik esa qavs oldida turibdi.", 'Внутри скобки умножения нет. А двойка стоит перед скобкой.', 'There is no multiplication inside the bracket. The two stands before it.') },
      ],
    },
    {
      part: '2 · 3', action: 'mul', to: '2x + 6', parts: ['2 · 3', '2 · x', 'x + 2'],
      needPart: L('Qaysi ko\'paytmani hisoblaymiz?', 'Какое произведение считаем?', 'Which product do we work out?'),
      wrongs: [
        { action: 'mul', part: '2 · x', tag: 'Z6', hint: L("Ikki karra x ni sondan tashqari hisoblab bo'lmaydi, u shundayligicha qoladi.", 'Два на x посчитать числом нельзя, оно так и остаётся.', 'Two times x cannot be reduced to a number, it stays as it is.') },
        { action: 'add', part: '2 · 3', tag: 'Z6', hint: L("Bu ko'paytma, qo'shuv emas.", 'Это произведение, а не сумма.', 'That is a product, not a sum.') },
      ],
    },
  ],
  footNote: L(
    "Isbot tugadi: birinchi yozuvdan ikkinchisi xossa bilan chiqarildi, son qo'ymasdan.",
    'Доказательство закончено: из первой записи вторая выведена свойством, без подстановки.',
    'The proof is done: the second record follows from the first by a property, with no substitution.',
  ),
  audio: [
    A('mount', "Uch son bilan tekshirdik, lekin sonlar cheksiz. Hammasini sinab bo'lmaydi.", 'Мы проверили тремя числами, но чисел бесконечно много. Все не перепробуешь.', 'We checked with three numbers, but there are infinitely many. You cannot try them all.'),
    A('mount', "Shuning uchun isbot boshqacha bo'ladi: bir yozuvdan ikkinchisi xossa bilan chiqariladi.", 'Поэтому доказательство другое: из одной записи вторая выводится свойством.', 'So the proof works differently: the second record follows from the first by a property.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S5.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <Transform
        audio={audio}
        start={S5.start}
        steps={S5.steps}
        actions={ACTIONS}
        ask={S5.ask}
        askAct={S5.askAct}
        footNote={S5.footNote}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 6. O'ZINGIZ. Olti tenglik ikki zonaga.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Ayniyatmi yoki yo\'q', 'Тождество или нет', 'An identity or not'),
  zones: [
    { id: 'z1', label: L('Ayniyat', 'Тождество', 'An identity') },
    { id: 'z2', label: L('Ayniyat emas', 'Не тождество', 'Not an identity') },
  ],
  cards: [
    { id: 'i1', text: '2(a − 3) = 2a − 6', zone: 'z1' },
    { id: 'i2', text: '−(a − 7) = −a − 7', zone: 'z2' },
    { id: 'i3', text: '5a − 3a = 2a', zone: 'z1' },
    { id: 'i4', text: 'a + a = a²', zone: 'z2' },
    { id: 'i5', text: '3(a + 5) = 3a + 5', zone: 'z2' },
    { id: 'i6', text: 'a · a = a²', zone: 'z1' },
  ],
  prompt: L(
    "Har tenglikni tekshiring. Ayniyat bo'lmaganini bitta son ham rad etadi.",
    'Проверь каждое равенство. Не тождество опровергает даже одно число.',
    'Check each equality. A non-identity is refuted by even one number.',
  ),
  wrongs: [
    { hint: L("Uchta tenglik xossalardan chiqadi, uchtasi esa bitta son bilan rad etiladi.", 'Три равенства следуют из свойств, а три опровергаются одним числом.', 'Three equalities follow from the properties, and three are refuted by one number.'), tag: 'Z1' },
  ],
  okNote: L(
    "Ayniyat xossadan chiqariladi. Ayniyat emasligi esa bitta son bilan ko'rsatiladi.",
    'Тождество выводится из свойства. А то, что равенство не тождество, показывается одним числом.',
    'An identity is derived from a property. That an equality is not one is shown by a single number.',
  ),
  audio: [
    A('mount', "Olti tenglik. Uchtasi ayniyat, uchtasi esa yo'q.", 'Шесть равенств. Три из них тождества, три нет.', 'Six equalities. Three of them are identities, three are not.'),
    A('mount', "Har birini o'z zonasiga qo'ying.", 'Отправь каждое в свою зону.', 'Send each one to its own zone.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S6.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S6} screen={screen} audio={audio} solved={done} {...rest}>
      <SortZones
        audio={audio}
        zones={S6.zones}
        items={S6.cards}
        prompt={S6.prompt}
        wrongs={S6.wrongs}
        okNote={S6.okNote}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 7. CHEGARAVIY HOLAT. Tenglik BOR, lekin faqat bitta sonda
// bajariladi. Bu ayniyat emas -- bu tenglama (7-darsga yo'l).
// ============================================================
const S7 = {
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Faqat bitta sonda teng', 'Равно только при одном числе', 'Equal at one number only'),
  numbers: [2, 5, 7],
  rows: [
    { id: 'r1', role: 'source', expr: 'x + 3', sub: (n) => n + ' + 3', val: (n) => n + 3 },
    { id: 'r2', expr: '8', sub: () => '8', val: () => 8 },
  ],
  probe: {
    question: L(
      "Bu tenglik bitta sonda bajarildi, ikkitasida yo'q. U ayniyatmi?",
      'Это равенство выполнилось при одном числе и не выполнилось при двух. Это тождество?',
      'This equality held at one number and failed at two. Is it an identity?',
    ),
    items: [
      { id: 'no', correct: true, label: L("Yo'q: ayniyat HAR QANDAY qiymatda bajariladi", 'Нет: тождество верно при ЛЮБОМ значении', 'No: an identity holds for EVERY value') },
      { id: 'yes', tag: 'Z4', label: L("Ha, tenglik bajarildi", 'Да, равенство выполнилось', 'Yes, the equality held'), hint: L("Ikki sonda bajarilmadi. Ayniyat esa hech qachon buzilmaydi.", 'При двух числах не выполнилось. А тождество не нарушается никогда.', 'It failed at two numbers. An identity never fails.') },
      { id: 'half', tag: 'Z4', label: L('Yarim ayniyat', 'Половинное тождество', 'A half identity'), hint: L("Bunday tushuncha yo'q. Tenglik yo har doim bajariladi, yo yo'q.", 'Такого понятия нет. Равенство либо верно всегда, либо нет.', 'There is no such thing. An equality either always holds or it does not.') },
      { id: 'more', tag: 'Z1', label: L("Yana son kerak", 'Нужно ещё числа', 'More numbers are needed'), hint: L("Ikkita rad etuvchi son allaqachon topildi, bittasi ham yetardi.", 'Два опровергающих числа уже найдены, хватило бы и одного.', 'Two refuting numbers are already found, and one would have been enough.') },
    ],
  },
  okText: L(
    "Faqat ba'zi sonlarda bajariladigan tenglik TENGLAMA deyiladi. Uni yechish keyingi bloknning ishi.",
    'Равенство, которое выполняется лишь при некоторых числах, называют УРАВНЕНИЕМ. Решать его будем в следующем блоке.',
    'An equality that holds only at some numbers is called an EQUATION. Solving them comes in the next block.',
  ),
  audio: [
    A('mount', "Yana bir tenglik. Chapda x qo'shuv uch, o'ngda esa sakkiz.", 'Ещё одно равенство. Слева x плюс три, справа восемь.', 'One more equality. On the left x plus three, on the right eight.'),
    A('mount', "Uch xil son qo'yib ko'ring.", 'Подставь три разных числа.', 'Try three different numbers.'),
    A('sub', "Qatorlar teng bo'ldimi.", 'Стали ли строки равны.', 'Did the rows become equal.'),
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
    { id: 'f1', label: L("ikki ifoda tenglik bilan bog'langan bo'lsa", 'если два выражения связаны равенством', 'if two expressions are joined by an equality') },
    { id: 'f2', label: L("va bu tenglik harfning har qanday qiymatida bajarilsa", 'и это равенство верно при любом значении буквы', 'and that equality holds for every value of the letter') },
    { id: 'f3', label: L("bunday tenglik ayniyat deyiladi", 'такое равенство называют тождеством', 'such an equality is called an identity') },
    { id: 'f4', label: L("bitta qarama-qarshi son esa uni rad etadi", 'а одно противоположное число его опровергает', 'and a single counterexample refutes it') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval tenglik, keyin har qanday qiymat, keyin atama, oxirida rad etish.",
    'Порядок нарушен. Сначала равенство, потом любое значение, потом название, в конце опровержение.',
    'The order is off. The equality first, then every value, then the name, and the refutation last.',
  ),
  lawChips: [
    { label: '=', tone: 'par' },
    { label: 'a  b  x', tone: 's1' },
    { label: '1 2 3', tone: 's2' },
    { label: '≠', tone: 'off' },
  ],
  lawSweep: L(
    "tenglik, har qanday harf qiymati, isbot, rad etish",
    'равенство, любое значение буквы, доказательство, опровержение',
    'equality, every letter value, proof, refutation',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Harfning har qanday qiymatida bajariladigan tenglik ayniyat deyiladi. Ifodani xossalar bilan qayta yozish ayniy o'zgartirish deyiladi.",
        'Равенство, верное при любом значении буквы, называют тождеством. Переписывание выражения по свойствам называют тождественным преобразованием.',
        'An equality that holds for every value of the letter is called an identity. Rewriting an expression by the properties is called an identity transformation.',
      ),
      L(
        "Son qo'yish ayniyatni isbotlamaydi, chunki sonlar cheksiz. Lekin bitta son uni rad etishga yetadi.",
        'Подстановка числа тождество не доказывает, потому что чисел бесконечно много. Но одного числа хватает, чтобы его опровергнуть.',
        'Substituting a number does not prove an identity, because there are infinitely many numbers. But one number is enough to refute it.',
      ),
    ],
  },
  hookCap: L(
    "Isbot -- o'zgartirish, rad etish -- bitta son",
    'Доказательство это преобразование, опровержение это одно число',
    'A proof is a transformation, a refutation is one number',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("har qanday qiymatda", 'при любом значении', 'for every value'),
    L("isbot xossadan", 'доказательство из свойства', 'the proof from a property'),
    L("rad etish bitta sondan", 'опровержение одним числом', 'the refutation by one number'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило.', 'We have seen all the cases. Now let us build the rule.'),
    A('ok', "To'g'ri. Bu blokning oxirgi tushunchasi.", 'Верно. Это последнее понятие блока.', 'Correct. The last idea of the block.'),
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
// EKRAN 9. MASHQ 1. KVOTA EKRANI. To'rt ifoda, hammasida ikki qavs.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Nimaga ayniy teng', 'Чему тождественно равно', 'What it is identically equal to'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  items: [
    {
      prompt: '2(2x − 5) − 3(−2x + 1)',
      ok: L("Ikkinchi qavs oldida minus uch turibdi, u ikkala ishorani ham ag'daradi.", 'Перед второй скобкой минус три, он переворачивает оба знака.', 'Before the second bracket stands minus three, and it flips both signs.'),
      items: [
        { id: 'a', label: '10x − 13', correct: true },
        { id: 'b', label: '−2x − 13', tag: 'Z3', hint: L("Minus uch karra minus ikki x musbat oltiga teng.", 'Минус три на минус два x равно плюс шесть x.', 'Minus three times minus two x is plus six x.') },
        { id: 'c', label: '10x − 7', tag: 'Z3', hint: L("Birlik ham minus uchga ko'paytiriladi.", 'Единица тоже умножается на минус три.', 'The one is multiplied by minus three as well.') },
        { id: 'd', label: '10x + 13', tag: 'Z6', hint: L("O'nlik manfiy, uchlik ham manfiy.", 'Десятка отрицательная, и тройка отрицательная.', 'The ten is negative, and so is the three.') },
      ],
    },
    {
      prompt: '−3(5 − 4x) + 6(3x + 4)',
      ok: L("Minus uch beshni manfiy qildi, to'rt x ni esa musbat.", 'Минус три сделал пять отрицательным, а четыре x положительным.', 'Minus three made the five negative and the four x positive.'),
      items: [
        { id: 'a', label: '30x + 9', correct: true },
        { id: 'b', label: '6x + 9', tag: 'Z3', hint: L("Minus uch karra minus to'rt x musbat o'n ikki x.", 'Минус три на минус четыре x это плюс двенадцать x.', 'Minus three times minus four x is plus twelve x.') },
        { id: 'c', label: '30x − 39', tag: 'Z3', hint: L("Oltilik to'rtga ko'paytirilgach musbat yigirma to'rt bo'ladi.", 'Шесть на четыре даёт плюс двадцать четыре.', 'Six times four gives plus twenty four.') },
        { id: 'd', label: '30x + 19', tag: 'Z6', hint: L("Minus o'n besh va yigirma to'rt: ayirma to'qqiz.", 'Минус пятнадцать и двадцать четыре: разность девять.', 'Minus fifteen and twenty four: the difference is nine.') },
      ],
    },
    {
      prompt: '(3a − 4b)(−3) − 6(a − b)',
      ok: L("Ikkala qavs ham manfiy son bilan ochildi.", 'Обе скобки раскрыты отрицательным числом.', 'Both brackets were opened by a negative number.'),
      items: [
        { id: 'a', label: '−15a + 18b', correct: true },
        { id: 'b', label: '−15a + 6b', tag: 'Z2', hint: L("Minus to'rt b ham minus uchga ko'paytiriladi: musbat o'n ikki b.", 'Минус четыре b тоже умножается на минус три: плюс двенадцать b.', 'Minus four b is multiplied by minus three too: plus twelve b.') },
        { id: 'c', label: '−3a + 18b', tag: 'Z6', hint: L("Minus to'qqiz a va minus olti a: yig'indi minus o'n besh a.", 'Минус девять a и минус шесть a: вместе минус пятнадцать a.', 'Minus nine a and minus six a: together minus fifteen a.') },
        { id: 'd', label: '−15a − 18b', tag: 'Z3', hint: L("Minus olti karra minus b musbat olti b.", 'Минус шесть на минус b это плюс шесть b.', 'Minus six times minus b is plus six b.') },
      ],
    },
    {
      prompt: '1,2(2a − 3b) − 1,8(3a + 2b)',
      ok: L("O'nli kasrlar ham xuddi shunday tarqaladi.", 'Десятичные дроби расходятся точно так же.', 'Decimals spread exactly the same way.'),
      items: [
        { id: 'a', label: '−3a − 7,2b', correct: true },
        { id: 'b', label: '−3a + 0b', tag: 'Z6', hint: L("Minus uch butun olti b va minus uch butun olti b: yig'indi minus yetti butun ikki b.", 'Минус три целых шесть b и минус три целых шесть b: вместе минус семь целых две b.', 'Minus three point six b and minus three point six b: together minus seven point two b.') },
        { id: 'c', label: '7,8a − 7,2b', tag: 'Z3', hint: L("Besh butun to'rt a manfiy, chunki qavs oldida minus turibdi.", 'Пять целых четыре a отрицательно, потому что перед скобкой минус.', 'Five point four a is negative, because the bracket has a minus.') },
        { id: 'd', label: '−3a − 1,2b', tag: 'Z6', hint: L("Ikkala b li had ham manfiy va ular qo'shiladi.", 'Оба члена с b отрицательны и складываются.', 'Both b terms are negative and they add up.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt ifoda. Har birida ikki qavs, va kamida bittasi oldida minus.", 'Четыре выражения. В каждом две скобки, и хотя бы перед одной минус.', 'Four expressions. Each has two brackets, and at least one has a minus.'),
    A('1', "Ikkinchisida ikki manfiy son bor.", 'Во втором два отрицательных числа.', 'The second has two negative numbers.'),
    A('2', "Uchinchisida ko'paytuvchi qavsdan KEYIN turibdi.", 'В третьем множитель стоит ПОСЛЕ скобки.', 'In the third the factor stands AFTER the bracket.'),
    A('3', "Oxirgisi o'nli kasrlar bilan.", 'Последнее с десятичными дробями.', 'The last one uses decimals.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S9.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S9} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S9.items}
        question={S9.question}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 10. MASHQ 2. QADAMLAR ATALGAN: avval qavslar, keyin ixchamlash.
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ikki manfiy ko\'paytuvchi', 'Два отрицательных множителя', 'Two negative factors'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['−2(7 − 2x) − 5(−2x + 9)  =  −14 ', { slot: 0 }, ' ', { slot: 1 }, ' − 45'],
  parts: [
    { id: 'a', label: '+ 4x' },
    { id: 'b', label: '+ 10x' },
    { id: 'c', label: '− 4x' },
    { id: 'd', label: '− 10x' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikkala qavsni ham ochib yozing. Ikkala ko'paytuvchi ham manfiy.",
    'Раскрой обе скобки. Оба множителя отрицательные.',
    'Open both brackets. Both factors are negative.',
  ),
  checkNote: L(
    "Manfiy karra manfiy musbat beradi, shuning uchun ikkala x li had ham musbat.",
    'Минус на минус даёт плюс, поэтому оба члена с x положительные.',
    'A minus times a minus gives a plus, so both x terms are positive.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("Minus ikki karra minus ikki x musbat to'rt x beradi.", 'Минус два на минус два x даёт плюс четыре x.', 'Minus two times minus two x gives plus four x.') },
    { key: 'd', tag: 'Z3', hint: L("Minus besh karra minus ikki x ham musbat bo'ladi.", 'Минус пять на минус два x тоже положительно.', 'Minus five times minus two x is positive too.') },
    { key: '*', tag: 'Z3', hint: L("Ikkala ko'paytuvchi ham manfiy, ikkala qavsda ham x manfiy edi.", 'Оба множителя отрицательны, и в обеих скобках x был отрицательным.', 'Both factors are negative, and in both brackets the x was negative.') },
  ],
  probe: {
    question: L("Endi o'xshash hadlarni ixchamlang. Javob nima?", 'Теперь приведи подобные члены. Каков ответ?', 'Now collect the like terms. What is the answer?'),
    items: [
      { id: 'a', correct: true, label: '14x − 59' },
      { id: 'b', tag: 'Z6', label: '14x − 31', hint: L("Minus o'n to'rt va minus qirq besh qo'shiladi.", 'Минус четырнадцать и минус сорок пять складываются.', 'Minus fourteen and minus forty five add up.') },
      { id: 'c', tag: 'Z6', label: '6x − 59', hint: L("To'rt x va o'n x qo'shiladi.", 'Четыре x и десять x складываются.', 'Four x and ten x add up.') },
      { id: 'd', tag: 'Z6', label: '14x + 59', hint: L("Ikkala son ham manfiy edi.", 'Оба числа были отрицательными.', 'Both numbers were negative.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval ikkala qavsni ochamiz, keyin ixchamlaymiz.", 'Два шага. Сначала раскрываем обе скобки, потом приводим.', 'Two steps. Open both brackets first, then collect.'),
    A('mount', "Diqqat: ikkala ko'paytuvchi ham manfiy.", 'Внимание: оба множителя отрицательные.', 'Careful: both factors are negative.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
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
// EKRAN 11. FAQAT O'ZINGIZ. Asbob yo'q.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L("Yozuvni o'zingiz yig'ing", 'Собери запись сам', 'Build the record yourself'),
  template: ['4(5x − 11) + 8(−7x − 3)  =  ', { slot: 0 }, ' ', { slot: 1 }],
  parts: [
    { id: 'a', label: '−36x' },
    { id: 'b', label: '− 68' },
    { id: 'c', label: '−36x²' },
    { id: 'd', label: '− 20' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki qavsni ochib, o'xshash hadlarni ixchamlang.",
    'Раскрой две скобки и приведи подобные члены.',
    'Open the two brackets and collect the like terms.',
  ),
  checkNote: L(
    "Yigirma x dan ellik olti x ayrildi. Sonlar esa qirq to'rt va yigirma to'rt, ikkalasi manfiy.",
    'Из двадцати x вычли пятьдесят шесть x. А числа сорок четыре и двадцать четыре, оба отрицательные.',
    'Fifty six x was taken from twenty x. And the numbers are forty four and twenty four, both negative.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Qo'shishda ko'rsatkich paydo bo'lmaydi.", 'При сложении показатель не появляется.', 'Adding does not create an exponent.') },
    { key: 'd', tag: 'Z6', hint: L("Ikkinchi qavsda sakkiz karra uch yigirma to'rt beradi, uch emas.", 'Во второй скобке восемь на три даёт двадцать четыре, а не три.', 'In the second bracket eight times three gives twenty four, not three.') },
    { key: '*', tag: 'Z5', hint: L("Avval to'rt qismni ko'paytiring, keyin o'xshashlarini yig'ing.", 'Сначала перемножь четыре части, потом собери подобные.', 'Multiply the four parts first, then collect the like ones.') },
  ],
  audio: [
    A('mount', "Bu safar yordamsiz. Ikki qavs, ikkinchisida ikkala had ham manfiy.", 'На этот раз без подсказки. Две скобки, во второй оба члена отрицательные.', 'This time with no prompt. Two brackets, and in the second both terms are negative.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S11.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S11} screen={screen} audio={audio} solved={done} {...rest}>
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
// EKRAN 12. TUZOQ (§8.2). Ikki son bilan «isbotlangan» tenglik:
// x kvadrat teng x nol va bir da rostdan ham bajariladi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Hamma hisob to'g'ri. Shunday bo'lsa ham, qaysi qator xato?",
    'Весь счёт верен. И всё же какая строка ошибочна?',
    'All the arithmetic is right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('tekshiramiz: x² = x', 'проверяем: x² = x', 'checking: x² = x') },
    { id: 'r2', text: L('x = 0 da: 0 va 0, teng', 'при x = 0: 0 и 0, равно', 'at x = 0: 0 and 0, equal') },
    { id: 'r3', text: L('x = 1 da: 1 va 1, teng', 'при x = 1: 1 и 1, равно', 'at x = 1: 1 and 1, equal') },
    { id: 'r4', text: L('ikki tekshiruv yetarli', 'двух проверок достаточно', 'two checks are enough') },
    { id: 'r5', text: L('javob: ayniyat', 'ответ: тождество', 'answer: an identity') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu tekshirilayotgan tenglikning o'zi.", 'Это само проверяемое равенство.', 'That is the equality being checked.'),
    r2: L("To'g'ri: nol kvadrat nolga teng.", 'Верно: ноль в квадрате равен нулю.', 'Right: zero squared is zero.'),
    r3: L("To'g'ri: bir kvadrat birga teng.", 'Верно: единица в квадрате равна единице.', 'Right: one squared is one.'),
    r5: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r3: 'Z1', r5: 'Z1' },
  proofFill: {
    template: ['x = 2 da:  ', { slot: 0 }, '  va  ', { slot: 1 }],
    parts: [
      { id: 'a', label: '4' },
      { id: 'b', label: '2' },
      { id: 'c', label: '0' },
      { id: 'd', label: '8' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Uchinchi sonni qo'yib ko'ring.",
      'Подставь третье число.',
      'Substitute a third number.',
    ),
    checkNote: L(
      "Ikki son boshqa chiqdi, ya'ni tenglik ayniyat emas. Ikki mos kelish esa isbot bo'lmaydi.",
      'Два числа вышли разными, значит равенство не тождество. А два совпадения доказательством не были.',
      'The two numbers came out different, so the equality is not an identity. And two matches were not a proof.',
    ),
    wrongs: [
      { key: 'c|d', tag: 'Z6', hint: L("Ikki kvadrat to'rtga teng, ikkilikning o'zi esa ikki.", 'Два в квадрате равно четырём, а сама двойка два.', 'Two squared is four, and the two itself is two.') },
      { key: '*', tag: 'Z1', hint: L("Chap tomonda kvadrat, o'ng tomonda esa sonning o'zi turadi.", 'Слева квадрат, а справа само число.', 'On the left a square, on the right the number itself.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda ikki tekshirish ham to'g'ri hisoblangan.", 'В этой ловушке обе проверки посчитаны верно.', 'In this trap both checks are worked out correctly.'),
    A('mount', "Shunday bo'lsa ham xulosa noto'g'ri. Qaysi qatorda xato.", 'И всё же вывод неверен. В какой строке ошибка.', 'And yet the conclusion is wrong. Which line has the mistake.'),
    A('proof', "Topdingiz. Uchinchi son qo'yib ko'ramiz.", 'Нашёл. Подставим третье число.', 'You found it. Let us substitute a third number.'),
    A('done', "Ikki mos kelish isbot emas ekan.", 'Два совпадения доказательством не были.', 'Two matches were not a proof after all.'),
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
// EKRAN 13. KO'CHIRISH. TESKARI YO'L: qavs ochilmaydi, qavsga OLINADI.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE INVERSE TASK'),
  title: L('Qavsga olish', 'Вынести за скобку', 'Taking it out of the bracket'),
  given: L(
    "Ayniyat ikki tomonga ham o'qiladi: qavsni ochish mumkin, qavsga olish ham mumkin.",
    'Тождество читается в обе стороны: скобку можно раскрыть, а можно и вынести.',
    'An identity reads both ways: a bracket can be opened, and it can be taken out.',
  ),
  template: ['12x + 18  =  ', { slot: 0 }, ' (2x + 3)'],
  parts: [
    { id: 'a', label: '6' },
    { id: 'b', label: '4' },
    { id: 'c', label: '3' },
    { id: 'd', label: '12' },
  ],
  answer: ['a'],
  prompt: L(
    "Qanday son qavsdan tashqariga chiqadi?",
    'Какое число выносится за скобку?',
    'Which number comes out of the bracket?',
  ),
  checkNote: L(
    "Olti karra ikki x o'n ikki x, olti karra uch esa o'n sakkiz. Ikkala had ham to'g'ri chiqdi.",
    'Шесть на два x это двенадцать x, а шесть на три восемнадцать. Оба члена вышли верно.',
    'Six times two x is twelve x, and six times three is eighteen. Both terms came out right.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("To'rt karra ikki x sakkiz x beradi, o'n ikki emas.", 'Четыре на два x даёт восемь x, а не двенадцать.', 'Four times two x gives eight x, not twelve.') },
    { key: 'c', tag: 'Z6', hint: L("Uch karra uch to'qqiz beradi, o'n sakkiz emas.", 'Три на три даёт девять, а не восемнадцать.', 'Three times three gives nine, not eighteen.') },
    { key: 'd', tag: 'Z6', hint: L("O'n ikki karra uch o'ttiz olti bo'lardi.", 'Двенадцать на три было бы тридцать шесть.', 'Twelve times three would be thirty six.') },
  ],
  audio: [
    A('mount', "Bu safar teskari yo'l: qavs ochilgan holda berilgan, uni yig'ish kerak.", 'На этот раз обратный путь: запись дана без скобки, её нужно собрать.', 'This time the inverse path: the record is given opened, and it must be gathered.'),
    A('mount', "Ikkala hadga ham to'g'ri keladigan sonni toping.", 'Найди число, которое подходит к обоим членам.', 'Find the number that fits both terms.'),
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
      wrap: true,
      question: null,
      prompt: L('2(x + 3) va 2x + 6 ayniyatmi?', 'Тождество ли 2(x + 3) и 2x + 6?', 'Are 2(x + 3) and 2x + 6 an identity?'),
      ok: L("Ha: taqsimot xossasi shuni beradi.", 'Да: это даёт свойство распределения.', 'Yes: the distributive property gives it.'),
      items: [
        { id: 'a', correct: true, label: L('Ha', 'Да', 'Yes') },
        { id: 'b', label: L("Yo'q", 'Нет', 'No'), tag: 'Z2', hint: L("Ikkilik qavs ichidagi ikkala hadga tarqaladi va tenglik bajariladi.", 'Двойка расходится на оба члена скобки, и равенство выполняется.', 'The two spreads to both terms and the equality holds.') },
        { id: 'c', label: L('Faqat musbat sonlarda', 'Только при положительных', 'Only at positive numbers'), tag: 'Z1', hint: L("Xossa sonning ishorasiga bog'liq emas.", 'Свойство не зависит от знака числа.', 'The property does not depend on the sign of the number.') },
        { id: 'd', label: L('Bu tenglama', 'Это уравнение', 'That is an equation'), tag: 'Z4', hint: L("Tenglama faqat ba'zi sonlarda bajariladi.", 'Уравнение выполняется лишь при некоторых числах.', 'An equation holds only at some numbers.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L('a + a va a² ayniyatmi?', 'Тождество ли a + a и a²?', 'Are a + a and a² an identity?'),
      ok: L("Yo'q: a teng 3 da olti va to'qqiz.", 'Нет: при a равном 3 шесть и девять.', 'No: at a equal to 3 it is six and nine.'),
      items: [
        { id: 'a', correct: true, label: L("Yo'q", 'Нет', 'No') },
        { id: 'b', label: L('Ha', 'Да', 'Yes'), tag: 'Z1', hint: L("a teng 3 da olti va to'qqiz chiqadi.", 'При a равном 3 выходит шесть и девять.', 'At a equal to 3 you get six and nine.') },
        { id: 'c', label: L('Ha, a teng 2 da teng bo\'ldi', 'Да, при a равном 2 вышло равно', 'Yes, at a equal to 2 it came out equal'), tag: 'Z1', hint: L("Bitta son isbot bo'lmaydi.", 'Одно число доказательством не бывает.', 'One number is never a proof.') },
        { id: 'd', label: L('Aniqlash mumkin emas', 'Определить нельзя', 'It cannot be decided'), tag: 'Z1', hint: L("Bitta rad etuvchi son yetadi va u topilgan.", 'Достаточно одного опровергающего числа, и оно найдено.', 'One refuting number is enough, and it has been found.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '2(2x − 5) − 3(−2x + 1)',
      ok: L("Minus uch ikkala ishorani ag'dardi.", 'Минус три перевернул оба знака.', 'Minus three flipped both signs.'),
      items: [
        { id: 'a', label: '10x − 13', correct: true },
        { id: 'b', label: '−2x − 13', tag: 'Z3', hint: L("Minus uch karra minus ikki x musbat olti x.", 'Минус три на минус два x это плюс шесть x.', 'Minus three times minus two x is plus six x.') },
        { id: 'c', label: '10x − 7', tag: 'Z3', hint: L("Birlik ham ko'paytiriladi.", 'Единица тоже умножается.', 'The one is multiplied too.') },
        { id: 'd', label: '4x − 13', tag: 'Z2', hint: L("Birinchi qavsda ikkilik ikki x ga ham tarqaladi.", 'В первой скобке двойка расходится и на два x.', 'In the first bracket the two spreads onto two x as well.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L('Ayniyatni bitta son bilan isbotlash mumkinmi?', 'Можно ли доказать тождество одним числом?', 'Can an identity be proved by one number?'),
      ok: L("Isbot uchun o'zgartirish kerak, son esa faqat rad etadi.", 'Для доказательства нужно преобразование, а число только опровергает.', 'A proof needs a transformation, a number can only refute.'),
      items: [
        { id: 'a', correct: true, label: L("Yo'q, o'zgartirish kerak", 'Нет, нужно преобразование', 'No, a transformation is needed') },
        { id: 'b', label: L("Ha, agar son teng chiqsa", 'Да, если при числе вышло равно', 'Yes, if the number gives equality'), tag: 'Z1', hint: L("Nol va bir da x kvadrat teng x ham bajarilgan edi.", 'При нуле и единице равенство x² = x тоже выполнялось.', 'At zero and one the equality x² = x held as well.') },
        { id: 'c', label: L('Ha, agar son katta bo\'lsa', 'Да, если число большое', 'Yes, if the number is big'), tag: 'Z1', hint: L("Sonning kattaligi hech narsani hal qilmaydi, sonlar cheksiz.", 'Величина числа ничего не решает, чисел бесконечно много.', 'The size of the number decides nothing, there are infinitely many.') },
        { id: 'd', label: L("Yo'q, hech narsa isbotlab bo'lmaydi", 'Нет, ничего доказать нельзя', 'No, nothing can be proved'), tag: 'Z1', hint: L("O'zgartirish bilan isbotlanadi, buni o'zingiz qildingiz.", 'Преобразованием доказывается, ты это сам сделал.', 'A transformation proves it, and you did that yourself.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi xukdagi yozuv.", 'Второй это запись с хука.', 'The second is the record from the hook.'),
    A('2', "Uchinchisi hisob.", 'Третий на счёт.', 'The third is arithmetic.'),
    A('3', "Oxirgisi isbot haqida.", 'Последний про доказательство.', 'The last is about proof.'),
  ],
}

function Screen14({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S14.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const resRef = useRef([])
  const total = S14.items.length
  return (
    <LessonFrame meta={S14} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S14.items}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
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
// EKRAN 15. YAKUN. O'SHA SAHNA, lekin a teng 3 -- va tablolar ajraldi.
// Yangi matematika yo'q: bu 3-ekranning javobi (§4.2).
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Bitta son isbot emas', 'Одно число не доказательство', 'One number is not a proof'),
  gate: {
    source: { kind: 'plain', tokens: ['a', '=', '3'] },
    rows: [
      { tokens: ['a', '+', 'a'], value: '6' },
      { tokens: ['a²'], value: '9' },
    ],
    sign: '≠',
  },
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    no: L("bitta son yetmaydi", 'одного числа не хватит', 'one number is not enough'),
    yes: L("har doim teng", 'равны всегда', 'always equal'),
    only2: L("faqat a teng 2 da", 'только при a равном 2', 'only at a equal to 2'),
    never: L("hech qachon teng emas", 'не равны никогда', 'never equal'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['a + a ≠ a²', '2(x + 3) = 2x + 6', 'x + 3 = 8  →  x = 5', '12x + 18 = 6(2x + 3)'],
  twoLabel: L('B1 bloki yopildi', 'Блок Б1 закрыт', 'Block B1 is closed'),
  twoA: L("son  →  rad etadi", 'число  →  опровергает', 'a number  →  refutes'),
  twoB: L("xossa  →  isbotlaydi", 'свойство  →  доказывает', 'a property  →  proves'),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "faqat ba'zi sonlarda bajariladigan tenglik, ya'ni tenglama",
    'равенство, верное лишь при некоторых числах, то есть уравнение',
    'an equality true only at some numbers, that is an equation',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. O'sha ikki yozuv, lekin endi a teng uch.", 'Вернёмся к началу. Те же две записи, но теперь a равно трём.', 'Back to the start. The same two records, but now a equals three.'),
    A('mount', "Tablolar ajraldi: olti va to'qqiz. Bitta son isbot bo'lmagan ekan.", 'Табло разошлись: шесть и девять. Одно число доказательством не было.', 'The boards parted: six and nine. One number was not a proof.'),
    A('mount', "Keyingi blokda faqat ba'zi sonlarda bajariladigan tenglikni yechamiz.", 'В следующем блоке будем решать равенство, верное лишь при некоторых числах.', 'In the next block we will solve an equality that holds only at some numbers.'),
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
      <TwoRoutes source={S15.gate.source} rows={S15.gate.rows} sign={S15.gate.sign} />

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
