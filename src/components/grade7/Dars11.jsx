// ============================================================================
// 7-sinf, Dars 11. MASALALARNI TENGLAMA YORDAMIDA YECHISH.
// (Решение задач с помощью уравнений)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
//
// NIMA O'RGATILADI. Tenglamani YECHISH 8, 9 va 10-darslarda o'rganilgan.
// Bu darsda boshqa narsa: masalani tenglamaga AYLANTIRISH. Darslik buning
// uchun olti qadam beradi, va ularning uchtasi kattaliklar haqida: qanday
// kattaliklar bor, qaysi biri noma'lum, qaysi birini harf bilan belgilaymiz.
//
// ASOSIY XATO, VA U DARSNING O'ZAGI. O'quvchi tenglamani to'g'ri yechadi,
// x ni topadi -- va SHU SONNI javob deb yozadi. Holbuki savol boshqa
// kattalik haqida bo'lishi mumkin. Darslikning birinchi masalasi aynan
// shunday: x teng 3 chiqadi, javob esa 3x, ya'ni 9.
//
// Shuning uchun oxirgi qadam ALOHIDA ekranda turadi va o'tkazib bo'lmaydi:
// «x topildi» hali «javob topildi» degani emas. 7-ekran esa buni tuzatadi:
// ba'zan x ning O'ZI javob bo'ladi, ya'ni «har doim ko'paytir» ham xato.
//
// ASBOBLAR: `QuantityCard` (kattaliklar jadvali, shu darsda yozildi),
// `EquationBalance` (8-darsdan), qolganlari umumiy.
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
  useMobileZoom,
  useT,
} from './core.jsx'
import {
  AuditRows,
  EquationBalance,
  HistoryTape,
  Probe,
  ProbeChain,
  QuantityCard,
  RuleBuilder,
  SlotFill,
  StairsReveal,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_11'
const LESSON_TITLE = L('Masalalarni tenglama yordamida yechish', 'Решение задач с помощью уравнений', 'Solving word problems with equations')
const LESSON_NO = L('11-dars', 'Урок 11', 'Lesson 11')
const TOTAL = 15

const BLOCK = { label: L('B2-blok', 'Блок Б2', 'Block B2'), from: 7, to: 12, current: 11 }

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
  Z1: L('x javob deb olindi', 'x принят за ответ', 'x taken as the answer'),
  Z2: L('harf notogri qatorda', 'буква не на той величине', 'letter on the wrong quantity'),
  Z3: L("bog'lanish notogri", 'связь неверна', 'the link is wrong'),
  Z4: L('tenglama savoldan', 'уравнение из вопроса', 'equation from the question'),
  Z5: L('ortiqcha hisoblandi', 'лишний пересчёт', 'one step too far'),
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

const WAS = L('Dastlab bor edi', 'Было сначала', 'There was at first')
const LEFT = L('Qirqilgandan keyin qoldi', 'Осталось после отрезания', 'Left after cutting')

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
// EKRAN 1. XUK. Ikkalasi ham tenglamani TO'G'RI yechdi va bir xil x topdi,
// javob esa boshqa chiqdi. Sabab: biri x ni javob deb yozdi.
// ============================================================
const S1 = {
  eyebrow: L('MASALA VA TENGLAMA', 'ЗАДАЧА И УРАВНЕНИЕ', 'PROBLEMS AND EQUATIONS'),
  noBack: true,
  noNotes: true,
  title: L("Bir xil x, boshqa javob", 'Один и тот же x, разные ответы', 'The same x, different answers'),
  gate: {
    source: { kind: 'plain', tokens: ['3x', '−', 'x', '=', '6'] },
    rows: [
      { tokens: ['x', '=', '3'], value: '3' },
      { tokens: ['x', '=', '3'], value: '9' },
    ],
  },
  probe: {
    question: L(
      "Ikkalasi ham x teng 3 topdi, javob esa boshqa yozdi. Nega?",
      'Оба получили x = 3, а ответы записали разные. Почему?',
      'Both got x = 3 but wrote different answers. Why?',
    ),
    items: [
      {
        id: 'asked',
        label: L(
          "Biri x ning qiymatini javob deb yozdi, savol esa boshqa kattalik haqida edi",
          'Один записал значение x как ответ, а спрашивали про другую величину',
          'One wrote the value of x as the answer, but the question was about another quantity',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Masalani boshidan yig'amiz va tekshiramiz.",
          'Прогноз принят. Соберём задачу с начала и проверим.',
          'Your prediction is taken. We will build the problem from the start and check.',
        ),
      },
      {
        id: 'calc',
        label: L("Biri hisobda xato qildi", 'Один ошибся в вычислении', 'One made an arithmetic slip'),
        hint: L(
          "Ikkalasi ham bir xil x topdi, demak hisobda xato yo'q. Farq undan KEYIN paydo bo'lgan.",
          'Оба получили одинаковый x, значит в вычислении ошибки нет. Разница появилась ПОСЛЕ него.',
          'Both got the same x, so the arithmetic is fine. The difference appeared AFTER that.',
        ),
      },
      {
        id: 'eq',
        label: L("Tenglama notogri tuzilgan", 'Уравнение составлено неверно', 'The equation was built wrongly'),
        hint: L(
          "Tenglama ikkalasida ham bitta. Farq tenglamada emas, javobni yozishda.",
          'Уравнение у обоих одно и то же. Разница не в уравнении, а в записи ответа.',
          'They both had the same equation. The difference is not in the equation but in writing the answer.',
        ),
      },
      {
        id: 'two',
        label: L("Bu tenglamaning ikkita ildizi bor", 'У этого уравнения два корня', 'This equation has two roots'),
        hint: L(
          "3x ayirish x bu 2x, ya'ni 2x teng 6. Bunday tenglamaning ildizi bitta.",
          '3x минус x это 2x, то есть 2x = 6. У такого уравнения один корень.',
          '3x minus x is 2x, so 2x = 6. Such an equation has one root.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi, to'qqizinchi va o'ninchi darslarda tenglama yechishni o'rgandik. Bugun boshqa ish: masalani tenglamaga aylantirish.", 'В восьмом, девятом и десятом уроках мы учились решать уравнения. Сегодня другая работа: превратить задачу в уравнение.', 'In lessons eight, nine and ten we learned to solve equations. Today a different job: turning a word problem into an equation.'),
    A('mount', "Ikkala o'quvchi ham bitta masalani yechdi va bitta tenglamaga keldi.", 'Оба ученика решали одну задачу и пришли к одному уравнению.', 'Both students worked the same problem and reached the same equation.'),
    A('mount', "Tenglamani ham to'g'ri yechdilar, x teng uch chiqdi. Javob esa boshqa yozildi.", 'Уравнение они тоже решили верно, x вышел три. А ответы записали разные.', 'They solved the equation correctly too, x came out three. Yet the answers differ.'),
    A('mount', "Sizningcha nega. Bu taxmin, uning uchun baho yo'q.", 'Как думаешь, почему. Это прогноз, оценки за него нет.', 'Why do you think that is. This is a prediction, it is not graded.'),
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
  title: L('Uchta narsa oldingi darslardan', 'Три вещи из прошлых уроков', 'Three things from earlier lessons'),
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      prompt: '3x − x',
      ok: L("Koeffitsiyentlar ayiriladi, harf umumiy qoladi.", 'Коэффициенты вычитают, буква остаётся общей.', 'The coefficients subtract and the letter stays.'),
      items: [
        { id: 'a', label: '2x', correct: true },
        { id: 'b', label: '3', tag: 'Z3', hint: L("Harf yo'qolib qolmaydi: 3x dan x ni ayirsak 2x qoladi.", 'Буква не исчезает: из 3x вычли x, осталось 2x.', 'The letter does not vanish: take x from 3x and 2x is left.') },
        { id: 'c', label: '3x', tag: 'Z3', hint: L("Bitta x ketadi, demak koeffitsiyent kamayadi.", 'Один x уходит, значит коэффициент уменьшается.', 'One x goes, so the coefficient drops.') },
        { id: 'd', label: '4x', tag: 'Z3', hint: L("Bu qo'shishning natijasi. Belgi ayirish.", 'Это результат сложения. Знак вычитание.', 'That is the result of adding. The sign is a minus.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("2x teng 6 tenglamaning ildizi?", 'Корень уравнения 2x = 6?', 'The root of 2x = 6?'),
      ok: L("Ikkala tomon ikkiga bo'lindi.", 'Обе части разделили на два.', 'Both sides were divided by two.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '4', tag: 'Z6', hint: L("4 bu 6 ayirish 2. x oldida ko'paytirish turibdi.", '4 это 6 минус 2. Перед x стоит умножение.', '4 is 6 minus 2. There is a multiplication before x.') },
        { id: 'c', label: '12', tag: 'Z6', hint: L("12 bu 6 karra 2. Bo'lish kerak edi.", '12 это 6 умножить на 2. Нужно было деление.', '12 is 6 times 2. Division was needed.') },
        { id: 'd', label: '8', tag: 'Z6', hint: L("8 bu 6 qo'shuv 2. Bo'lish kerak edi.", '8 это 6 плюс 2. Нужно было деление.', '8 is 6 plus 2. Division was needed.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Bir miqdor ikkinchisidan 3 marta kam. Kichigi x bo'lsa, kattasi qanday yoziladi?",
        'Одна величина в 3 раза меньше другой. Если меньшая x, как записать большую?',
        'One quantity is 3 times less than another. If the smaller is x, how is the larger written?',
      ),
      ok: L("Kattasi kichigidan uch marta ko'p, ya'ni 3x.", 'Большая втрое больше меньшей, то есть 3x.', 'The larger is three times the smaller, that is 3x.'),
      items: [
        { id: 'a', label: '3x', correct: true },
        { id: 'b', label: 'x − 3', tag: 'Z3', hint: L("«3 marta kam» va «3 ga kam» boshqa narsa. Marta bu ko'paytirish.", '«В 3 раза меньше» и «на 3 меньше» это разное. Раза это умножение.', 'Three times less and three less are different things. Times means multiplication.') },
        { id: 'c', label: 'x : 3', tag: 'Z3', hint: L("x kichigi, demak kattasini topish uchun ko'paytirish kerak, bo'lish emas.", 'x это меньшая, значит для большей надо умножать, а не делить.', 'x is the smaller one, so the larger comes from multiplying, not dividing.') },
        { id: 'd', label: 'x + 3', tag: 'Z3', hint: L("Bu «3 ga ko'p» degani. Bizda esa «3 marta».", 'Это «на 3 больше». А у нас «в 3 раза».', 'That is three more. Here it is three times.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta narsani eslaymiz.", 'Вспомним три вещи.', 'Let us recall three things.'),
    A('1', "Ikkinchisi.", 'Второе.', 'Second.'),
    A('2', "Uchinchisi. Bu bugun kalit bo'ladi.", 'Третье. Это будет ключом сегодня.', 'Third. This will be the key today.'),
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
// EKRAN 3. TUSHUNTIRISH 1. QAYSI KATTALIKNI HARF BILAN BELGILAYMIZ.
// Jadval masalaning tuzilishini ekranga chiqaradi. KVOTA EKRANI.
// ============================================================
const S3 = {
  eyebrow: L('KATTALIKLAR', 'ВЕЛИЧИНЫ', 'THE QUANTITIES'),
  title: L("Harfni qaysi kattalikka qo'yamiz", 'На какую величину ставим букву', 'Which quantity gets the letter'),
  task: L(
    "O'ramdan 6 metr ip qirqildi, unda 3 marta kam qoldi. Dastlab necha metr edi?",
    'От мотка отрезали 6 м, осталось втрое меньше. Сколько было в мотке?',
    'Six metres were cut from a coil, leaving three times less. How much was in it?',
  ),
  rows: [
    { id: 'was', cap: WAS },
    { id: 'left', cap: LEFT },
  ],
  probe: {
    question: L(
      "Ikkalasi ham noma'lum. Qaysi birini x deb olish qulay?",
      'Обе неизвестны. Какую удобнее взять за x?',
      'Both are unknown. Which is handier to call x?',
    ),
    items: [
      {
        id: 'left', correct: true,
        label: L("Qolgan ipni, ya'ni kichigini", 'Оставшуюся пряжу, то есть меньшую', 'The yarn left, that is the smaller one'),
      },
      {
        id: 'was', tag: 'Z2',
        label: L("Dastlabki ipni, ya'ni kattasini", 'Пряжу в начале, то есть большую', 'The yarn at the start, the larger one'),
        hint: L("Bunday qilish ham mumkin, lekin unda ikkinchi kattalik x bo'lish 3 bo'ladi va kasr paydo bo'ladi. Kichigini olsak, kattasi 3x, ya'ni butun.", 'Так тоже можно, но тогда вторая величина будет x делить на 3 и появится дробь. Если взять меньшую, большая будет 3x, то есть целой.', 'That works too, but then the other quantity becomes x divided by 3 and a fraction appears. Take the smaller and the larger is 3x, which stays whole.'),
      },
      {
        id: 'six', tag: 'Z2',
        label: L("Qirqib olingan 6 metrni", 'Отрезанные 6 метров', 'The six metres cut off'),
        hint: L("Olti ma'lum, u masalada berilgan. Harf faqat NOMA'LUM kattalikka qo'yiladi.", 'Шесть известно, оно дано в задаче. Букву ставят только на НЕИЗВЕСТНУЮ величину.', 'Six is known, it is given in the problem. The letter goes only on an UNKNOWN quantity.'),
      },
      {
        id: 'both', tag: 'Z2',
        label: L("Ikkalasini ham, x va y bilan", 'Обе, через x и y', 'Both, with x and y'),
        hint: L("Ikkita harf bo'lsa ikkita tenglama kerak. Bitta harf yetadi: ikkinchi kattalik uning orqali yoziladi.", 'Две буквы потребуют двух уравнений. Хватит одной: вторая величина запишется через неё.', 'Two letters would need two equations. One is enough: the other quantity is written through it.'),
      },
    ],
  },
  okText: L(
    "Kichigini x deb oldik. Endi kattasini x orqali yozish qoldi.",
    'Меньшую взяли за x. Осталось записать большую через x.',
    'The smaller one is x. Now the larger has to be written through x.',
  ),
  audio: [
    A('mount', "Masalani o'qing. Unda ikkita kattalik bor va ikkalasi ham noma'lum.", 'Прочитай задачу. В ней две величины, и обе неизвестны.', 'Read the problem. It has two quantities and both are unknown.'),
    A('mount', "Harf faqat bittasiga qo'yiladi. Qaysi biriga, o'zingiz tanlang.", 'Букву ставят только на одну. На какую, выбери сам.', 'The letter goes on one of them only. Which one is your choice.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S3.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const rows = S3.rows.map((r) => ({ ...r, expr: done && r.id === 'left' ? 'x' : null }))
  return (
    <Frame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      <Hint>{t(S3.task)}</Hint>
      <QuantityCard rows={rows} mark={done ? 'left' : null} />
      <Probe
        data={{ ...S3.probe, ok: S3.okText }}
        cols={2}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2. Ikkinchi kattalik x orqali yoziladi, keyin
// SHARTDAGI bog'lanishdan tenglama tuziladi.
// ============================================================
const S4 = {
  eyebrow: L("IFODA VA TENGLAMA", 'ВЫРАЖЕНИЕ И УРАВНЕНИЕ', 'EXPRESSION AND EQUATION'),
  title: L('Kattasi x orqali yoziladi', 'Большую записывают через x', 'The larger is written through x'),
  rows: [
    { id: 'was', cap: WAS },
    { id: 'left', cap: LEFT, expr: 'x' },
  ],
  rounds: [
    {
      template: [{ slot: 0 }],
      parts: [{ id: 'p3x', label: '3x' }, { id: 'px3', label: 'x : 3' }, { id: 'pp', label: 'x + 3' }, { id: 'pm', label: 'x − 3' }],
      answer: ['p3x'],
      prompt: L(
        "Dastlabki ip x dan 3 marta ko'p edi. Uni qanday yozamiz?",
        'Пряжи сначала было в 3 раза больше, чем x. Как это записать?',
        'At the start there was three times more than x. How is that written?',
      ),
      checkNote: L("Kichigi x, kattasi 3x. Jadval to'ldi", 'Меньшая x, большая 3x. Таблица заполнена', 'The smaller is x, the larger 3x. The table is full'),
      wrongs: [
        { key: 'px3', tag: 'Z3', hint: L("x bu KICHIK miqdor. Uni uchga bo'lsak yana kichrayadi.", 'x это МЕНЬШАЯ величина. Если её разделить на три, она станет ещё меньше.', 'x is the SMALLER quantity. Dividing it by three makes it smaller still.') },
        { key: '*', tag: 'Z3', hint: L("«3 marta ko'p» bu uchga ko'paytirish.", '«В 3 раза больше» это умножение на три.', 'Three times more means multiplying by three.') },
      ],
    },
    {
      template: ['3x − x = ', { slot: 0 }],
      parts: [{ id: 'q6', label: '6' }, { id: 'q3', label: '3' }, { id: 'q9', label: '9' }, { id: 'q2', label: '2' }],
      answer: ['q6'],
      prompt: L(
        "Ular orasidagi farq bu qirqib olingan qism. Tenglamani tugating.",
        'Разница между ними это отрезанный кусок. Заверши уравнение.',
        'The difference between them is the piece cut off. Finish the equation.',
      ),
      checkNote: L("Farq qirqib olingan olti metrga teng", 'Разница равна отрезанным шести метрам', 'The difference equals the six metres cut off'),
      wrongs: [
        { key: 'q9', tag: 'Z4', hint: L("To'qqiz bu masalaning JAVOBI, u hali topilmagan. Tenglamada faqat SHARTDA berilgan son turadi.", 'Девять это ОТВЕТ задачи, он ещё не найден. В уравнении стоит только число из УСЛОВИЯ.', 'Nine is the ANSWER, not yet found. Only a number from the given condition belongs in the equation.') },
        { key: '*', tag: 'Z4', hint: L("Shartda bitta son bor: qirqib olingan olti metr.", 'В условии есть одно число: отрезанные шесть метров.', 'The condition gives one number: the six metres cut off.') },
      ],
    },
  ],
  audio: [
    A('mount', "Kichigi x. Endi kattasini x orqali yozamiz.", 'Меньшая это x. Теперь запишем большую через x.', 'The smaller is x. Now let us write the larger through x.'),
    A('r1', "Jadval to'ldi. Endi shartdagi bog'lanishdan tenglama tuzamiz.", 'Таблица заполнена. Теперь составим уравнение из связи в условии.', 'The table is full. Now let us build the equation from the link in the condition.'),
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
  const rows = S4.rows.map((q) => ({ ...q, expr: q.id === 'was' ? (idx > 0 ? '3x' : null) : q.expr }))
  return (
    <Frame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
      <QuantityCard rows={rows} mark="left" />
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
      ) : <DoneRow>3x − x = 6</DoneRow>}
    </Frame>
  )
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3. Tenglamani yechamiz -- bu TANISH ish.
// ============================================================
const S5 = {
  eyebrow: L('TANISH QISM', 'ЗНАКОМАЯ ЧАСТЬ', 'THE FAMILIAR PART'),
  title: L("Tenglamani sakkizinchi darsdagidek yechamiz", 'Уравнение решаем как в восьмом уроке', 'The equation is solved as in lesson eight'),
  start: { a: 2, b: 0, c: 6 },
  actions: [
    { id: 'd2', kind: 'div', n: 2, label: ':2' },
    { id: 's2', kind: 'sub', n: 2, label: '−2', tag: 'Z6', hint: L("Ikkini ayirsak, chapda 2x ayirish 2 chiqadi. x hali yolg'iz emas.", 'Если вычесть два, слева выйдет 2x минус 2. x всё ещё не один.', 'Taking away two gives 2x minus 2 on the left. The x is still not alone.') },
    { id: 'm2', kind: 'mul', n: 2, label: '·2', tag: 'Z6', hint: L("Ko'paytirish koeffitsiyentni to'rtga aylantiradi.", 'Умножение превратит коэффициент в четыре.', 'Multiplying turns the coefficient into four.') },
    { id: 'a2', kind: 'add', n: 2, label: '+2', tag: 'Z6', hint: L("Qo'shish chapga ortiqcha son qo'shadi.", 'Сложение добавит слева лишнее число.', 'Adding puts an extra number on the left.') },
  ],
  done: L("x teng 3. Lekin bu hali javob emas.", 'x = 3. Но это ещё не ответ.', 'x = 3. But that is not the answer yet.'),
  reward: {
    title: L("x topildi, javob esa hali yo'q", 'x найден, а ответа ещё нет', 'The x is found, the answer is not'),
    text: L(
      "Uchlik bu QOLGAN ipning uzunligi, chunki biz aynan uni x deb belgilagandik. Savol esa dastlabki ip haqida edi.",
      'Тройка это длина ОСТАВШЕЙСЯ пряжи, ведь именно её мы обозначили за x. А вопрос был про пряжу в начале.',
      'Three is the length of the yarn LEFT, since that is what we called x. But the question was about the yarn at the start.',
    ),
  },
  audio: [
    A('mount', "Tenglama tayyor. Uni yechish tanish ish.", 'Уравнение готово. Решать его дело знакомое.', 'The equation is ready. Solving it is familiar work.'),
    A('step2', "x teng uch. Diqqat: bu hali javob emas.", 'x равен трём. Внимание: это ещё не ответ.', 'x is three. Careful: that is not the answer yet.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S5.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const rows = [
    { id: 'was', cap: WAS, expr: '3x' },
    { id: 'left', cap: LEFT, expr: done ? '3' : 'x' },
  ]
  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <QuantityCard rows={rows} mark="left" />
      <EquationBalance
        audio={audio}
        start={S5.start}
        actions={S5.actions}
        done={S5.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4. OXIRGI QADAM: SAVOLGA QAYTISH.
// Darsning o'zagi: «x topildi» hali «javob topildi» degani emas.
// ============================================================
const S6 = {
  eyebrow: L('OXIRGI QADAM', 'ПОСЛЕДНИЙ ШАГ', 'THE LAST STEP'),
  title: L("Savol qaysi kattalik haqida edi", 'О какой величине был вопрос', 'Which quantity the question asked about'),
  rows: [
    { id: 'was', cap: WAS, expr: '3x' },
    { id: 'left', cap: LEFT, expr: '3' },
  ],
  template: ['3x = 3 · 3 = ', { slot: 0 }],
  parts: [
    { id: 'p9', label: '9' },
    { id: 'p3', label: '3' },
    { id: 'p6', label: '6' },
    { id: 'p12', label: '12' },
  ],
  answer: ['p9'],
  prompt: L(
    "Savol dastlabki ip haqida edi, u esa jadvalda 3x. x teng 3 ni qo'ying va javobni toping.",
    'Вопрос был про пряжу в начале, а она в таблице это 3x. Подставь x = 3 и найди ответ.',
    'The question was about the yarn at the start, which is 3x in the table. Put x = 3 and find the answer.',
  ),
  checkNote: L(
    "Tekshiruv: 9 metrdan 6 metr qirqilsa 3 metr qoladi, va 3 metr 9 metrdan 3 marta kam",
    'Проверка: из 9 метров отрезали 6, осталось 3 метра, а 3 втрое меньше 9',
    'Check: cut 6 from 9 metres and 3 are left, and 3 is three times less than 9',
  ),
  wrongs: [
    { key: 'p3', tag: 'Z1', hint: L("Uchlik bu x, ya'ni QOLGAN ip. Savol dastlabki ip haqida, u esa uch marta ko'p.", 'Тройка это x, то есть ОСТАВШАЯСЯ пряжа. Вопрос про пряжу в начале, а её втрое больше.', 'Three is x, the yarn LEFT. The question is about the start, which is three times more.') },
    { key: 'p6', tag: 'Z1', hint: L("Olti bu qirqib olingan qism, u shartda berilgan.", 'Шесть это отрезанный кусок, он дан в условии.', 'Six is the piece cut off, given in the condition.') },
    { key: '*', tag: 'Z1', hint: L("Jadvalda dastlabki ip 3x deb yozilgan. Uchni qo'ying.", 'В таблице пряжа в начале записана как 3x. Подставь тройку.', 'The table has the starting yarn as 3x. Put in three.') },
  ],
  audio: [
    A('mount', "Endi eng oxirgi qadam, va u eng ko'p tashlab ketiladigan qadam.", 'Теперь самый последний шаг, и его чаще всего пропускают.', 'Now the very last step, and it is the one most often skipped.'),
    A('mount', "Savol qaysi kattalik haqida edi. Jadvalga qarang.", 'О какой величине был вопрос. Посмотри в таблицу.', 'Which quantity did the question ask about. Look at the table.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S6.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const rows = S6.rows.map((r) => ({ ...r, expr: done && r.id === 'was' ? '9' : r.expr }))
  return (
    <Frame meta={S6} screen={screen} audio={audio} solved={done} {...rest}>
      <QuantityCard rows={rows} mark="left" answer={done ? 'was' : null} />
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
// EKRAN 7. FARQLASH. Ba'zan x ning O'ZI javob bo'ladi.
// Bu 6-ekranni TUZATADI: «har doim ko'paytir» degan qoida ham xato.
// ============================================================
const S7 = {
  eyebrow: L('FARQNI KO\'RAMIZ', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Ba'zan x ning o'zi javob", 'Иногда x и есть ответ', 'Sometimes x is the answer itself'),
  task: L(
    "Qizlar o'g'il bolalardan 2 marta ko'p, hammasi 27. Nechta o'g'il bola?",
    'Девочек вдвое больше, чем мальчиков, всего 27. Сколько мальчиков?',
    'Twice as many girls as boys, 27 in all. How many boys?',
  ),
  rows: [
    { id: 'boys', cap: L("O'g'il bolalar", 'Мальчики', 'Boys'), expr: 'x' },
    { id: 'girls', cap: L('Qizlar', 'Девочки', 'Girls'), expr: '2x' },
  ],
  rounds: [
    {
      template: ['x + 2x = ', { slot: 0 }],
      parts: [{ id: 'q27', label: '27' }, { id: 'q9', label: '9' }, { id: 'q18', label: '18' }, { id: 'q2', label: '2' }],
      answer: ['q27'],
      prompt: L(
        "Qizlar o'g'il bolalardan 2 marta ko'p, hammasi 27 nafar. Tenglamani tugating.",
        'Девочек вдвое больше, чем мальчиков, всего 27. Заверши уравнение.',
        'Twice as many girls as boys, 27 in all. Finish the equation.',
      ),
      checkNote: L("3x teng 27, demak x teng 9", '3x = 27, значит x = 9', '3x = 27, so x = 9'),
      wrongs: [
        { key: 'q9', tag: 'Z4', hint: L("To'qqiz bu javob, u hali topilmagan. Tenglamada shartdagi son turadi.", 'Девять это ответ, он ещё не найден. В уравнении стоит число из условия.', 'Nine is the answer, not yet found. The equation takes the number from the condition.') },
        { key: '*', tag: 'Z4', hint: L("Shartda bitta son bor: hammasi yigirma yetti nafar.", 'В условии есть одно число: всего двадцать семь человек.', 'The condition gives one number: twenty seven in all.') },
      ],
    },
    {
      template: [{ slot: 0 }],
      parts: [{ id: 'w9', label: '9' }, { id: 'w18', label: '18' }, { id: 'w27', label: '27' }, { id: 'w3', label: '3' }],
      answer: ['w9'],
      prompt: L(
        "x teng 9. Savol o'g'il bolalar haqida edi. Javobni yozing.",
        'x = 9. Вопрос был про мальчиков. Запиши ответ.',
        'x = 9. The question was about the boys. Write the answer.',
      ),
      checkNote: L("Javob x qatorida turgan edi. Savol qaysi qator haqida bo'lsa, javob shu qatorda", 'Ответ стоял в строке x. В какой строке вопрос, в той и ответ', 'The answer sat in the x row. The answer is in whichever row the question asks about'),
      wrongs: [
        { key: 'w18', tag: 'Z5', hint: L("O'n sakkiz bu qizlar soni, ya'ni 2x. Savol o'g'il bolalar haqida edi.", 'Восемнадцать это девочки, то есть 2x. А вопрос был про мальчиков.', 'Eighteen is the girls, that is 2x. The question was about the boys.') },
        { key: 'w27', tag: 'Z5', hint: L("Yigirma yetti bu butun sinf, u shartda berilgan.", 'Двадцать семь это весь класс, он дан в условии.', 'Twenty seven is the whole class, given in the condition.') },
        { key: '*', tag: 'Z5', hint: L("Jadvalga qarang: o'g'il bolalar qatorida x turibdi.", 'Посмотри в таблицу: в строке мальчиков стоит x.', 'Look at the table: the boys row has x.') },
      ],
    },
  ],
  audio: [
    A('mount', "Yana bir masala. Jadval allaqachon to'ldirilgan.", 'Ещё одна задача. Таблица уже заполнена.', 'Another problem. The table is already filled in.'),
    A('r1', "Tenglama tayyor, x teng to'qqiz. Endi javobni yozing.", 'Уравнение готово, x равен девяти. Теперь запиши ответ.', 'The equation is ready, x is nine. Now write the answer.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S7.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const done = idx >= S7.rounds.length
  const r = S7.rounds[idx]
  return (
    <Frame meta={S7} screen={screen} audio={audio} solved={done} {...rest}>
      <QuantityCard rows={S7.rows} mark="boys" answer={done ? 'boys' : null} />
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
      ) : null}
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
    { id: 'f1', label: L('masalada qanday kattaliklar borligini aniqlaymiz', 'выясняем, какие в задаче величины', 'find out which quantities the problem has') },
    { id: 'f2', label: L("noma'lumlardan kichigini x deb olamiz", 'меньшую из неизвестных берём за x', 'take the smaller unknown as x') },
    { id: 'f3', label: L("shartdagi bog'lanishdan tenglama tuzamiz", 'из связи в условии составляем уравнение', 'build the equation from the link in the condition') },
    { id: 'f4', label: L('tenglamani yechib, savolga qaytamiz', 'решив уравнение, возвращаемся к вопросу', 'solve it, then return to the question') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval kattaliklar, keyin harf, keyin tenglama, oxirida savol.",
    'Порядок нарушен. Сначала величины, потом буква, потом уравнение, в конце вопрос.',
    'The order is off. Quantities first, then the letter, then the equation, and the question last.',
  ),
  lawChips: [
    { label: '?', tone: 'par' },
    { label: 'x', tone: 's1' },
    { label: '=', tone: 's2' },
    { label: '→ ?', tone: 'off' },
  ],
  lawSweep: L(
    'kattaliklar, harf, tenglama, savol',
    'величины, буква, уравнение, вопрос',
    'quantities, letter, equation, question',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Masalani tenglama yordamida yechish uchun noma'lum kattaliklardan birini, iloji bo'lsa kichigini, harf bilan belgilaymiz va qolganlarini shu harf orqali yozamiz.",
        'Чтобы решить задачу с помощью уравнения, одну из неизвестных величин, по возможности меньшую, обозначают буквой, а остальные записывают через неё.',
        'To solve a problem with an equation, one unknown quantity, the smaller one where possible, gets a letter and the rest are written through it.',
      ),
      L(
        "Tenglama shartdagi bog'lanishdan tuziladi. Uni yechib topilgan son har doim javob bo'lmaydi: oxirida savol qaysi kattalik haqida ekaniga qaytiladi.",
        'Уравнение составляют из связи, данной в условии. Найденное число не всегда является ответом: в конце возвращаются к тому, о какой величине спрашивали.',
        'The equation comes from the link given in the condition. The number found is not always the answer: at the end you return to which quantity was asked about.',
      ),
    ],
  },
  hookCap: L(
    "x topildi -- ish tugamadi, savolga qaytish qoldi",
    'x найден — работа не кончена, остался возврат к вопросу',
    'The x is found, but the work is not: the question is still waiting',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("harf kichik kattalikka qulay", 'букву удобно ставить на меньшую', 'the letter sits best on the smaller one'),
    L("tenglama shartdan, savoldan emas", 'уравнение из условия, не из вопроса', 'the equation from the condition, not the question'),
    L("oxirida savolga qayt", 'в конце вернись к вопросу', 'return to the question at the end'),
  ],
  audio: [
    A('mount', "Ikki masalani ko'rdik. Endi qadamlarni tartibga solamiz.", 'Две задачи мы разобрали. Теперь расставим шаги по порядку.', 'We have worked two problems. Now let us put the steps in order.'),
    A('ok', "To'g'ri. Bu tartib har qanday masalada ishlaydi.", 'Верно. Этот порядок работает в любой задаче.', 'Correct. This order works for any problem.'),
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
// EKRAN 9. MASHQ 1. Uchta qisqa savol -- har biri BOSHQA qadam haqida.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Uch xil qadam: harfni qo'yish, tenglama tuzish, savolga qaytish.",
      'Три разных шага: поставить букву, составить уравнение, вернуться к вопросу.',
      'Three different steps: place the letter, build the equation, return to the question.',
    ),
  },
  rounds: [
    {
      template: [{ slot: 0 }],
      parts: [{ id: 'p4x', label: '4x' }, { id: 'px4', label: 'x : 4' }, { id: 'pp', label: 'x + 4' }, { id: 'pm', label: 'x − 4' }],
      answer: ['p4x'],
      prompt: L(
        "Anvarda Sardordan 4 marta ko'p daftar bor. Sardorda x ta daftar bo'lsa, Anvarda nechta?",
        'У Анвара в 4 раза больше тетрадей, чем у Сардора. Если у Сардора x тетрадей, сколько у Анвара?',
        'Anvar has four times as many notebooks as Sardor. If Sardor has x, how many does Anvar have?',
      ),
      checkNote: L("Kichigi x, kattasi undan to'rt marta ko'p", 'Меньшая x, большая вчетверо больше', 'The smaller is x, the larger is four times it'),
      wrongs: [
        { key: 'pp', tag: 'Z3', hint: L("«4 marta ko'p» bu ko'paytirish, «4 ga ko'p» esa qo'shish.", '«В 4 раза больше» это умножение, а «на 4 больше» это сложение.', 'Four times more means multiplying, four more means adding.') },
        { key: '*', tag: 'Z3', hint: L("Marta bu ko'paytirish.", 'Раза это умножение.', 'Times means multiplication.') },
      ],
    },
    {
      template: ['x + 4x = ', { slot: 0 }],
      parts: [{ id: 'q30', label: '30' }, { id: 'q6', label: '6' }, { id: 'q24', label: '24' }, { id: 'q5', label: '5' }],
      answer: ['q30'],
      prompt: L(
        "Ikkalasida birga 30 ta daftar. Tenglamani tugating.",
        'Вместе у них 30 тетрадей. Заверши уравнение.',
        'Together they have 30 notebooks. Finish the equation.',
      ),
      checkNote: L("5x teng 30, demak x teng 6", '5x = 30, значит x = 6', '5x = 30, so x = 6'),
      wrongs: [
        { key: 'q6', tag: 'Z4', hint: L("Olti bu javob, u hali topilmagan. Tenglamada shartdagi son turadi.", 'Шесть это ответ, он ещё не найден. В уравнении стоит число из условия.', 'Six is the answer, not yet found. The equation takes the number from the condition.') },
        { key: '*', tag: 'Z4', hint: L("Shartda bitta son bor: hammasi o'ttizta.", 'В условии есть одно число: всего тридцать.', 'The condition gives one number: thirty in all.') },
      ],
    },
    {
      template: [{ slot: 0 }],
      parts: [{ id: 'w24', label: '24' }, { id: 'w6', label: '6' }, { id: 'w30', label: '30' }, { id: 'w5', label: '5' }],
      answer: ['w24'],
      prompt: L(
        "x teng 6. Savol Anvardagi daftarlar haqida. Javobni yozing.",
        'x = 6. Вопрос про тетради Анвара. Запиши ответ.',
        'x = 6. The question is about Anvar notebooks. Write the answer.',
      ),
      checkNote: L("Anvarda 4x, ya'ni 24 ta. Tekshiruv: 6 qo'shuv 24 teng 30", 'У Анвара 4x, то есть 24. Проверка: 6 плюс 24 равно 30', 'Anvar has 4x, that is 24. Check: 6 plus 24 is 30'),
      wrongs: [
        { key: 'w6', tag: 'Z1', hint: L("Olti bu x, ya'ni Sardordagi daftarlar. Savol Anvar haqida.", 'Шесть это x, то есть тетради Сардора. Вопрос про Анвара.', 'Six is x, the notebooks Sardor has. The question is about Anvar.') },
        { key: '*', tag: 'Z1', hint: L("Anvardagi daftarlar 4x deb yozilgan.", 'Тетради Анвара записаны как 4x.', 'Anvar notebooks were written as 4x.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Uchta savol, har biri boshqa qadam haqida.", 'Правило готово. Три вопроса, каждый про другой шаг.', 'The rule is ready. Three questions, each about a different step.'),
    A('r1', "Ikkinchisi: tenglama.", 'Второй: уравнение.', 'Second: the equation.'),
    A('r2', "Uchinchisi: javob.", 'Третий: ответ.', 'Third: the answer.'),
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
  const LABELS = ['Sardor: x,   Anvar: 4x', 'x + 4x = 30   →   x = 6', 'Anvar: 4x = 24']
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan: tarozida yechib, javobga qaytamiz.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L("Yechib, savolga qaytamiz", 'Решаем и возвращаемся к вопросу', 'Solve, then return to the question'),
  task: L(
    "Ikki qutida 48 ta olma, birinchisida 2 marta ko'p.",
    'В двух ящиках 48 яблок, в первом вдвое больше.',
    'Two crates hold 48 apples, the first twice the second.',
  ),
  rows: [
    { id: 'second', cap: L('Ikkinchi qutida', 'Во втором ящике', 'In the second crate'), expr: 'x' },
    { id: 'first', cap: L('Birinchi qutida', 'В первом ящике', 'In the first crate'), expr: '2x' },
  ],
  start: { a: 3, b: 0, c: 48 },
  actions: [
    { id: 'd3', kind: 'div', n: 3, label: ':3' },
    { id: 'd2', kind: 'div', n: 2, label: ':2', tag: 'Z6', hint: L("Chapda 3x turibdi, ikkiga bo'lsak kasr chiqadi.", 'Слева стоит 3x, при делении на два выйдет дробь.', 'The left side is 3x, dividing by two gives a fraction.') },
    { id: 's3', kind: 'sub', n: 3, label: '−3', tag: 'Z6', hint: L("Ayirish koeffitsiyentni yo'qotmaydi.", 'Вычитание не убирает коэффициент.', 'Subtracting does not remove the coefficient.') },
    { id: 'm3', kind: 'mul', n: 3, label: '·3', tag: 'Z6', hint: L("Ko'paytirish koeffitsiyentni yanada kattalashtiradi.", 'Умножение только увеличит коэффициент.', 'Multiplying makes the coefficient bigger still.') },
  ],
  done: L("x teng 16, savol esa birinchi quti haqida.", 'x = 16, а вопрос про первый ящик.', 'x = 16, but the question is about the first crate.'),
  probe: {
    question: L(
      "Birinchi qutida nechta olma bor? Jadvalga qarang.",
      'Сколько яблок в первом ящике? Посмотри в таблицу.',
      'How many apples are in the first crate? Look at the table.',
    ),
    items: [
      { id: 'a32', label: '32', correct: true },
      { id: 'a16', label: '16', tag: 'Z1', hint: L("O'n olti bu x, ya'ni ikkinchi quti. Savol birinchisi haqida.", 'Шестнадцать это x, то есть второй ящик. Вопрос про первый.', 'Sixteen is x, the second crate. The question is about the first.') },
      { id: 'a48', label: '48', tag: 'Z1', hint: L("Qirq sakkiz bu ikkala qutidagi olmalar.", 'Сорок восемь это яблоки в обоих ящиках.', 'Forty eight is the apples in both crates.') },
      { id: 'a8', label: '8', tag: 'Z1', hint: L("Sakkiz bu 16 ning yarmi. Birinchi quti esa ikki marta KO'P.", 'Восемь это половина 16. А в первом ящике вдвое БОЛЬШЕ.', 'Eight is half of 16. The first crate has twice as MANY.') },
    ],
    ok: L("Jadvalda birinchi quti 2x, ya'ni 2 karra 16.", 'В таблице первый ящик это 2x, то есть 2 умножить на 16.', 'The table has the first crate as 2x, that is 2 times 16.'),
  },
  audio: [
    A('mount', "Jadval to'ldirilgan, tenglama ham tayyor. Uni yechib, javobga qaytamiz.", 'Таблица заполнена, уравнение готово. Решим и вернёмся к ответу.', 'The table is filled and the equation is ready. Solve it, then return to the answer.'),
    A('step2', "x topildi. Endi savolga qaytamiz.", 'x найден. Теперь вернёмся к вопросу.', 'The x is found. Now back to the question.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S10.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [solvedEq, setSolvedEq] = useState(false)
  const [done, setDone] = useState(false)
  const rows = S10.rows.map((r) => ({
    ...r,
    expr: r.id === 'second' ? (solvedEq ? '16' : 'x') : (done ? '32' : '2x'),
  }))
  return (
    <Frame meta={S10} screen={screen} audio={audio} solved={done} {...rest}>
      <Hint>{t(S10.task)}</Hint>
      <QuantityCard rows={rows} mark="second" answer={done ? 'first' : null} />
      {!solvedEq ? (
        <EquationBalance
          audio={audio}
          start={S10.start}
          actions={S10.actions}
          done={S10.done}
          disabled={!canAnswer}
          onStep={(s) => audio.step(s)}
          onSolved={(r) => { setSolvedEq(true); onAnswer({ ...r, screen, role: 'practice', part: 'eq' }) }}
        />
      ) : (
        <Probe
          data={S10.probe}
          cols={4}
          audio={audio}
          disabled={!canAnswer}
          onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice', part: 'answer' }) }}
        />
      )}
    </Frame>
  )
}

// ============================================================
// EKRAN 11. MASHQ 3. ASBOBSIZ (§4.2, §8.1). Jadval ham yo'q.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Jadvalsiz', 'Без таблицы', 'Without the table'),
  template: [{ slot: 0 }],
  parts: [
    { id: 'p35', label: '35' },
    { id: 'p7', label: '7' },
    { id: 'p42', label: '42' },
    { id: 'p5', label: '5' },
  ],
  answer: ['p35'],
  prompt: L(
    "Kutubxonada matematika kitoblari fizika kitoblaridan 5 marta ko'p. Jami 42 kitob. Nechta matematika kitobi bor?",
    'В библиотеке книг по математике в 5 раз больше, чем по физике. Всего 42 книги. Сколько книг по математике?',
    'A library has five times as many maths books as physics books. There are 42 in all. How many maths books?',
  ),
  checkNote: L(
    "Fizika kitoblari x, matematika 5x. 6x teng 42, x teng 7, matematika esa 5x teng 35",
    'Книги по физике x, по математике 5x. 6x = 42, x = 7, а по математике 5x = 35',
    'Physics books x, maths 5x. 6x = 42, x = 7, and maths is 5x = 35',
  ),
  wrongs: [
    { key: 'p7', tag: 'Z1', hint: L("Yetti bu x, ya'ni fizika kitoblari. Savol matematika kitoblari haqida.", 'Семь это x, то есть книги по физике. Вопрос про математику.', 'Seven is x, the physics books. The question is about maths.') },
    { key: 'p42', tag: 'Z1', hint: L("Qirq ikki bu hamma kitob, u shartda berilgan.", 'Сорок два это все книги, они даны в условии.', 'Forty two is all the books, given in the condition.') },
    { key: '*', tag: 'Z3', hint: L("Kichigini x deb oling: fizika x, matematika 5x, ikkalasi 6x.", 'Возьми меньшую за x: физика x, математика 5x, вместе 6x.', 'Take the smaller as x: physics x, maths 5x, together 6x.') },
  ],
  audio: [
    A('mount', "Endi jadvalsiz. Hamma qadamni o'zingiz o'ylaysiz.", 'Теперь без таблицы. Все шаги держишь в голове.', 'Now without the table. You hold every step in your head.'),
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
// EKRAN 12. TUZOQ (§8.2). Yechim TO'G'RI, javob esa x ning qiymati.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  task: L(
    "Otaning yoshi o'g'ilning yoshidan 3 marta ko'p, ikkalasining yoshi birga 48. Otaning yoshi nechada?",
    'Возраст отца втрое больше возраста сына, вместе им 48. Сколько лет отцу?',
    'A father is three times as old as his son, together 48. How old is the father?',
  ),
  ask: L(
    "Yuqoridagi qatordan kelib chiqmagan qatorni toping.",
    'Найди строку, которая не следует из строки над ней.',
    'Find the line that does not follow from the line above it.',
  ),
  rows: [
    { id: 'r1', text: L("o'g'il: x,   ota: 3x", 'сын: x,   отец: 3x', 'son: x,   father: 3x') },
    { id: 'r2', text: 'x + 3x = 48' },
    { id: 'r3', text: 'x = 12' },
    { id: 'r4', text: L('javob: 12', 'ответ: 12', 'answer: 12') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Belgilash to'g'ri: kichik yosh x, katta yosh 3x.", 'Обозначение верное: меньший возраст x, больший 3x.', 'The labelling is right: the smaller age x, the larger 3x.'),
    r2: L("Tenglama ham to'g'ri: ikkalasining yoshi birga qirq sakkiz.", 'Уравнение тоже верное: вместе им сорок восемь.', 'The equation is right too: together they are forty eight.'),
    r3: L("Bu ham to'g'ri: 4x teng 48 dan x teng 12. Xato pastroqda.", 'И это верно: из 4x = 48 выходит x = 12. Ошибка ниже.', 'This is correct as well: 4x = 48 gives x = 12. The mistake is lower down.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r3: 'Z1' },
  proofFill: {
    template: ['3x = 3 · 12 = ', { slot: 0 }],
    parts: [{ id: 'v36', label: '36' }, { id: 'v12', label: '12' }, { id: 'v48', label: '48' }, { id: 'v24', label: '24' }],
    answer: ['v36'],
    prompt: L(
      "Savol ota haqida edi. To'g'ri javobni hisoblang.",
      'Вопрос был про отца. Посчитай верный ответ.',
      'The question was about the father. Work out the right answer.',
    ),
    checkNote: L("Tekshiruv: 36 qo'shuv 12 teng 48, va 36 soni 12 dan uch marta ko'p", 'Проверка: 36 плюс 12 равно 48, и 36 втрое больше 12', 'Check: 36 plus 12 is 48, and 36 is three times 12'),
    wrongs: [
      { key: 'v12', tag: 'Z1', hint: L("O'n ikki bu o'g'ilning yoshi. Ota uch marta katta.", 'Двенадцать это возраст сына. Отец втрое старше.', 'Twelve is the son age. The father is three times older.') },
      { key: '*', tag: 'Z1', hint: L("Otaning yoshi 3x deb yozilgan, x esa o'n ikki.", 'Возраст отца записан как 3x, а x равен двенадцати.', 'The father age was written as 3x, and x is twelve.') },
    ],
  },
  audio: [
    A('mount', "Bu yechimda hamma hisob to'g'ri. Shunga qaramay javob xato.", 'В этом решении все вычисления верны. И всё же ответ неверный.', 'Every calculation in this solution is right. And yet the answer is wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. O'quvchi x ning qiymatini javob deb yozdi. Endi to'g'ri qiling.", 'Нашёл. Ученик записал значение x как ответ. Теперь сделай верно.', 'You found it. The student wrote the value of x as the answer. Now do it right.'),
    A('done', "Otaning yoshi o'ttiz olti ekan.", 'Отцу оказалось тридцать шесть.', 'The father is thirty six.'),
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
// EKRAN 13. TESKARI YO'L. Tenglama berilgan -- masala nima haqida edi?
// ============================================================
const S13 = {
  eyebrow: L("TESKARI YO'L", 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L("Tenglamadan masalaga", 'От уравнения к задаче', 'From the equation to the problem'),
  expr: 'x + 5x = 42',
  rounds: [
    {
      template: [{ slot: 0 }],
      parts: [
        { id: 'p5', label: '5' },
        { id: 'p6', label: '6' },
        { id: 'p42', label: '42' },
        { id: 'p7', label: '7' },
      ],
      answer: ['p5'],
      prompt: L(
        "Bu tenglama qanday masaladan chiqqan: bir miqdor ikkinchisidan necha marta ko'p?",
        'Из какой задачи вышло это уравнение: одна величина во сколько раз больше другой?',
        'Which problem gives this equation: one quantity is how many times the other?',
      ),
      checkNote: L("x kichigi, 5x kattasi, demak besh marta", 'x меньшая, 5x большая, значит в пять раз', 'x is the smaller, 5x the larger, so five times'),
      wrongs: [
        { key: 'p6', tag: 'Z3', hint: L("Oltilik bu x qo'shuv 5x ning natijasi, ya'ni 6x. Savol esa marta haqida.", 'Шестёрка это результат x плюс 5x, то есть 6x. А вопрос про разы.', 'Six is the result of x plus 5x, that is 6x. The question is about times.') },
        { key: '*', tag: 'Z3', hint: L("Kattasi 5x deb yozilgan.", 'Большая записана как 5x.', 'The larger is written as 5x.') },
      ],
    },
    {
      template: [{ slot: 0 }],
      parts: [
        { id: 'q35', label: '35' },
        { id: 'q7', label: '7' },
        { id: 'q42', label: '42' },
        { id: 'q6', label: '6' },
      ],
      answer: ['q35'],
      prompt: L(
        "Tenglamani yechsak x teng 7. Savol kattaroq miqdor haqida bo'lsa, javob nima?",
        'Решив уравнение, получим x = 7. Если вопрос про большую величину, каков ответ?',
        'Solving it gives x = 7. If the question is about the larger quantity, what is the answer?',
      ),
      checkNote: L("Kattasi 5x, ya'ni 35. Tekshiruv: 7 qo'shuv 35 teng 42", 'Большая это 5x, то есть 35. Проверка: 7 плюс 35 равно 42', 'The larger is 5x, that is 35. Check: 7 plus 35 is 42'),
      wrongs: [
        { key: 'q7', tag: 'Z1', hint: L("Yetti bu x, ya'ni kichigi. Savol kattasi haqida.", 'Семь это x, то есть меньшая. Вопрос про большую.', 'Seven is x, the smaller one. The question is about the larger.') },
        { key: '*', tag: 'Z1', hint: L("Kattasi 5x, x esa yetti.", 'Большая это 5x, а x равен семи.', 'The larger is 5x, and x is seven.') },
      ],
    },
  ],
  reward: {
    title: L('Tenglama masalaning qisqa yozuvi', 'Уравнение это краткая запись задачи', 'An equation is the problem written briefly'),
    text: L(
      "Unda kattaliklar ham, ular orasidagi bog'lanish ham turadi. Faqat savol yozilmaydi -- shuning uchun uni yodda tutish kerak.",
      'В нём есть и величины, и связь между ними. Не записан только вопрос — поэтому его и надо держать в голове.',
      'It holds both the quantities and the link between them. Only the question is not written down, which is why it must be kept in mind.',
    ),
  },
  audio: [
    A('mount', "Endi teskari yo'l: tenglama berilgan, masala esa yo'q.", 'Теперь обратный ход: уравнение дано, а задачи нет.', 'Now the other way round: the equation is given, the problem is not.'),
    A('r1', "Endi javobni toping.", 'Теперь найди ответ.', 'Now find the answer.'),
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
      <div className="g7-eqb-lone"><Fx>{S13.expr}</Fx></div>
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
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Bir miqdor ikkinchisidan 6 marta ko'p. Kichigi x bo'lsa, kattasi qanday yoziladi?",
        'Одна величина в 6 раз больше другой. Если меньшая x, как записать большую?',
        'One quantity is six times another. If the smaller is x, how is the larger written?',
      ),
      ok: L("Marta bu ko'paytirish.", 'Раза это умножение.', 'Times means multiplication.'),
      items: [
        { id: 'a', label: '6x', correct: true },
        { id: 'b', label: 'x + 6', tag: 'Z3', hint: L("Bu «6 ga ko'p» degani.", 'Это «на 6 больше».', 'That is six more.') },
        { id: 'c', label: 'x : 6', tag: 'Z3', hint: L("x kichigi, bo'lish uni yana kichraytiradi.", 'x это меньшая, деление сделает её ещё меньше.', 'x is the smaller, dividing makes it smaller still.') },
        { id: 'd', label: 'x − 6', tag: 'Z3', hint: L("Bu «6 ga kam» degani.", 'Это «на 6 меньше».', 'That is six less.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Noma'lum kattaliklardan qaysi birini x deb olish qulay?",
        'Какую из неизвестных величин удобнее взять за x?',
        'Which unknown quantity is handier to call x?',
      ),
      ok: L("Kichigini: unda qolganlari butun son bilan yoziladi.", 'Меньшую: тогда остальные запишутся целыми.', 'The smaller one: then the rest stay whole.'),
      items: [
        { id: 'a', correct: true, label: L('Kichigini', 'Меньшую', 'The smaller one') },
        { id: 'b', tag: 'Z2', label: L('Kattasini', 'Большую', 'The larger one'), hint: L("Bunda ikkinchi kattalik kasr bo'lib qoladi, masalan x bo'lish 3.", 'Тогда вторая величина станет дробной, например x делить на 3.', 'Then the other quantity becomes fractional, say x divided by 3.') },
        { id: 'c', tag: 'Z2', label: L("Shartda berilgan sonni", 'Число, данное в условии', 'A number given in the condition'), hint: L("U ma'lum, harf esa noma'lumga qo'yiladi.", 'Оно известно, а буква ставится на неизвестное.', 'That is known, and the letter goes on an unknown.') },
        { id: 'd', tag: 'Z2', label: L("Farqi yo'q, ikkalasi ham bir xil", 'Без разницы, всё равно', 'It makes no difference'), hint: L("Ikkalasi ham to'g'ri javobga olib boradi, lekin biri kasrsiz -- shuning uchun qulayroq.", 'Оба приведут к верному ответу, но один без дробей — значит удобнее.', 'Both reach the right answer, but one avoids fractions and so is handier.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Tenglama nimadan tuziladi?",
        'Из чего составляют уравнение?',
        'What is the equation built from?',
      ),
      ok: L("Shartdagi bog'lanishdan.", 'Из связи, данной в условии.', 'From the link given in the condition.'),
      items: [
        { id: 'a', correct: true, label: L("Shartdagi bog'lanishdan", 'Из связи в условии', 'From the link in the condition') },
        { id: 'b', tag: 'Z4', label: L('Masalaning savolidan', 'Из вопроса задачи', 'From the question'), hint: L("Savol javobni so'raydi, u tenglamada yo'q. Savol oxirida kerak bo'ladi.", 'Вопрос спрашивает ответ, его в уравнении нет. Вопрос нужен в конце.', 'The question asks for the answer, which is not in the equation. The question is needed at the end.') },
        { id: 'c', tag: 'Z4', label: L('Javobdan', 'Из ответа', 'From the answer'), hint: L("Javob hali topilmagan. Uni topish uchun tenglama kerak.", 'Ответ ещё не найден. Уравнение нужно, чтобы его найти.', 'The answer is not found yet. The equation is what finds it.') },
        { id: 'd', tag: 'Z4', label: L('Jadvaldan', 'Из таблицы', 'From the table'), hint: L("Jadval kattaliklarni saqlaydi, tenglikni esa shart beradi.", 'Таблица хранит величины, а равенство даёт условие.', 'The table holds the quantities, the condition gives the equality.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "O'g'il x, ota 3x. x teng 12 chiqdi. Savol ota haqida bo'lsa, javob nima?",
        'Сын x, отец 3x. Вышло x = 12. Если вопрос про отца, каков ответ?',
        'Son x, father 3x. It came out x = 12. If the question is about the father, what is the answer?',
      ),
      ok: L("Jadvalda ota 3x, demak 36.", 'В таблице отец 3x, значит 36.', 'The table has the father as 3x, so 36.'),
      items: [
        { id: 'a', label: '36', correct: true },
        { id: 'b', label: '12', tag: 'Z1', hint: L("O'n ikki bu x, ya'ni o'g'ilning yoshi.", 'Двенадцать это x, то есть возраст сына.', 'Twelve is x, the son age.') },
        { id: 'c', label: '48', tag: 'Z1', hint: L("Qirq sakkiz bu ikkalasining yoshi birga.", 'Сорок восемь это возраст обоих вместе.', 'Forty eight is both ages together.') },
        { id: 'd', label: '4', tag: 'Z1', hint: L("To'rtlik bu 12 bo'lish 3. Ota esa uch marta KATTA.", 'Четвёрка это 12 делить на 3. А отец втрое СТАРШЕ.', 'Four is 12 divided by 3. But the father is three times OLDER.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsdagi yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi.", 'Второй.', 'Second.'),
    A('2', "Uchinchisi.", 'Третий.', 'Third.'),
    A('3', "Oxirgisi.", 'Последний.', 'The last one.'),
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
  title: L("x topildi -- savolga qaytish qoldi", 'x найден — остался возврат к вопросу', 'The x is found, the question still waits'),
  gate: S1.gate,
  fix: {
    tokens: ['x', '=', '3', ',', '3x'],
    value: '9',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Ikkalasi ham x teng uch topdi, javob esa dastlabki ip haqida edi, ya'ni uch karra uch, to'qqiz metr.",
    'Оба получили x равный трём, а вопрос был про пряжу в начале, то есть три умножить на три, девять метров.',
    'Both got x equal to three, and the question was about the yarn at the start, that is three times three, nine metres.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    asked: L("biri x ni javob deb yozdi", 'один записал x как ответ', 'one wrote x as the answer'),
    calc: L('hisobda xato', 'ошибка в вычислении', 'an arithmetic slip'),
    eq: L('tenglama notogri', 'уравнение неверное', 'the equation was wrong'),
    two: L('ikkita ildiz', 'два корня', 'two roots'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['3x − x = 6 → 9', 'x + 2x = 27 → 9', 'x + 4x = 30 → 24', 'x + 3x = 48 → 36'],
  twoLabel: L("To'rt qadam", 'Четыре шага', 'Four steps'),
  twoA: '?  →  x  →  =  →  ?',
  twoB: 'x  ≠  javob',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "aralashma masalalari",
    'задачи на смеси',
    'mixture problems',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Butun darsning ma'nosi shu: tenglama x ni beradi, savol esa boshqa kattalik haqida bo'lishi mumkin.", 'Весь смысл урока в этом: уравнение даёт x, а вопрос может быть про другую величину.', 'That is the whole point: the equation gives x, and the question may be about another quantity.'),
    A('mount', "Keyingi darsda aralashma va harakat masalalarini ko'ramiz.", 'В следующем уроке разберём задачи на смеси и движение.', 'In the next lesson we look at mixture and motion problems.'),
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
          <span className="g7-sumtwo-line"><Fx>{S15.twoA}</Fx></span>
          <span className="g7-sumtwo-line"><Fx>{S15.twoB}</Fx></span>
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

export default function Grade7Dars11({
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
    else console.log('[Grade7 Dars11] onFinished', payload)
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
