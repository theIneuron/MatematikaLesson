// ============================================================================
// 7-sinf, Dars 9. CHIZIQLI TENGLAMALARNI YECHISH: AL-XORAZMIY USULI.
// (Решение линейных уравнений)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// ASBOB: `EquationBalance` -- 8-darsda tug'ilgan tarozi. Bu darsda u
// KENGAYTIRILDI: o'zgaruvchi ikkala tomonda ham turadi, va uni ikkala
// tomondan ayirish mumkin. Yangi asbob yozilmadi (§5, umumiy kod).
//
// IKKI USUL O'Z NOMI BILAN ataladi -- darslikning o'zi shunday qiladi:
//   AL-JABR      -- hadni bir tomondan ikkinchisiga ko'chirish, ishora
//                   almashadi: «3x, chapga o'tsang −3x bo'lasan».
//   VAL-MUQOBALA -- ikkala tomondagi bir xil hadlarni yo'qotish.
//
// ASOSIY G'OYA, VA U 8-DARSDAN KELIB CHIQADI. Ko'chirish YANGI QOIDA EMAS.
// U tarozining qisqa yozuvi: hadni ko'chirish bu o'sha hadni IKKALA tomondan
// ayirish. Shuning uchun ishora almashadi. Dars shu bog'lanishni ko'rsatadi,
// aks holda ko'chirish sehr bo'lib qoladi va ishora yodlanadi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4). Al-Xorazmiy nomi esa havola emas -- bu
// matematika tarixi va usulning o'z nomi.
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
  EquationBalance,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  SolutionSet,
  StairsReveal,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_09'
const LESSON_TITLE = L('Chiziqli tenglamalarni yechish', 'Решение линейных уравнений', 'Solving linear equations')
const LESSON_NO = L('9-dars', 'Урок 9', 'Lesson 9')
const TOTAL = 15

const BLOCK = { label: L('B2-blok', 'Блок Б2', 'Block B2'), from: 7, to: 12, current: 9 }

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
  Z1: L("ko'chirishda ishora almashmadi", 'при переносе не поменялся знак', 'the sign did not change when moving a term'),
  Z2: L('noqulay amal tanlandi', 'выбрано неудобное действие', 'an unhelpful operation was chosen'),
  Z3: L("bir xil hadlar yo'qotilmadi", 'одинаковые слагаемые не уничтожены', 'equal terms were not cancelled'),
  Z4: L("ildizi yo'q holat tushunilmadi", 'случай без корней не понят', 'the no-root case was misread'),
  Z5: L("qavs ochilmasdan ko'chirildi", 'перенесли, не раскрыв скобку', 'terms were moved before the bracket was opened'),
  Z6: L('amallar tartibi buzildi', 'нарушен порядок действий', 'the order of operations broke'),
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

const SET_CAP = L("Nechta son to'g'ri qiladi", 'Сколько чисел делают верным', 'How many numbers make it true')

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
// EKRAN 1. XUK. Ikkalasi ham hadlarni ko'chirdi, ildiz esa boshqa chiqdi.
// Farq bitta: biri ishorani almashtirmadi.
// ============================================================
const S1 = {
  eyebrow: L('AL-XORAZMIY USULI', 'СПОСОБ АЛЬ-ХОРЕЗМИ', "AL-KHWARIZMI'S METHOD"),
  noBack: true,
  noNotes: true,
  title: L("Ikkalasi ham hadni ko'chirdi", 'Оба перенесли слагаемое', 'Both moved a term across'),
  gate: {
    source: { kind: 'plain', tokens: ['2x', '+', '9', '=', '15', '−', 'x'] },
    rows: [
      { tokens: ['3x', '=', '6'], value: '2' },
      { tokens: ['3x', '=', '24'], value: '8' },
    ],
  },
  probe: {
    question: L(
      "Ikkalasi ham x ni chapga, 9 ni o'ngga ko'chirdi. Nega ildiz boshqa chiqdi?",
      'Оба перенесли x влево, а девятку вправо. Почему корни вышли разные?',
      'Both moved x to the left and the nine to the right. Why did the roots come out different?',
    ),
    items: [
      {
        id: 'sign',
        label: L(
          "Biri ko'chirishda ishorani almashtirmadi",
          'Один при переносе не поменял знак',
          'One of them did not change the sign when moving',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Buni tarozida tekshiramiz.",
          'Прогноз принят. Проверим это на весах.',
          'Your prediction is taken. We will check it on the balance.',
        ),
      },
      {
        id: 'order',
        label: L("Biri boshqa tartibda ko'chirdi", 'Один переносил в другом порядке', 'One moved them in a different order'),
        hint: L(
          "Tartibning ahamiyati yo'q: avval x ni yoki avval sonni ko'chirsangiz ham natija bir xil.",
          'Порядок не важен: перенеси сначала x или сначала число, результат один.',
          'The order does not matter: move x first or the number first, the result is the same.',
        ),
      },
      {
        id: 'both',
        label: L("Ikkala ildiz ham mos keladi", 'Оба корня подходят', 'Both roots fit'),
        hint: L(
          "Ikkitasini ham qo'yib ko'ring. Ikkiga chap tomon o'n uch, o'ng tomon ham o'n uch. Sakkizga esa yigirma besh va yetti.",
          'Подставь оба. При двойке слева тринадцать и справа тринадцать. При восьмёрке двадцать пять и семь.',
          'Substitute both. With two the left is thirteen and the right is thirteen. With eight it is twenty five and seven.',
        ),
      },
      {
        id: 'noroot',
        label: L("Bunday tenglamani ko'chirish bilan yechib bo'lmaydi", 'Такое уравнение переносом не решить', 'Such an equation cannot be solved by moving terms'),
        hint: L(
          "Bittasi to'g'ri javob berdi, demak usul ishlaydi. Xato usulda emas, uni qo'llashda.",
          'Один же получил верный ответ, значит способ работает. Ошибка не в способе, а в его применении.',
          'One of them did get the right answer, so the method works. The mistake is in applying it, not in the method.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi darsda tarozi bilan yechardik. Bugun uni qisqa yozishni o'rganamiz.", 'В восьмом уроке мы решали на весах. Сегодня научимся записывать это коротко.', 'In lesson eight we solved on the balance. Today we learn to write it briefly.'),
    A('mount', "Tenglamada x ikkala tomonda ham bor. Ikkala o'quvchi ham hadlarni ko'chirdi.", 'В уравнении x есть в обеих частях. Оба ученика перенесли слагаемые.', 'The x appears on both sides. Both students moved the terms.'),
    A('mount', "Ko'chirish bir xil, natija esa boshqa. Tabloda ularning ildizlari turibdi.", 'Переносили одинаково, а вышло разное. На табло их корни.', 'They moved the same terms, yet got different results. The boards show their roots.'),
    A('mount', "Sizningcha farq nimada. Bu taxmin, uning uchun baho yo'q.", 'Как думаешь, в чём разница. Это прогноз, оценки за него нет.', 'What do you think the difference is. This is a prediction, it is not graded.'),
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
      prompt: '−5 + 5',
      ok: L('Qarama-qarshi sonlar bir-birini yo\'qotadi.', 'Противоположные числа уничтожают друг друга.', 'Opposite numbers cancel each other out.'),
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: '10', hint: L("10 bu 5 qo'shuv 5. Bu yerda birinchi son manfiy.", '10 это 5 плюс 5. Здесь первое число отрицательное.', '10 is 5 plus 5. The first number here is negative.') },
        { id: 'c', label: '−10', hint: L("−10 bu minus 5 ayirish 5. Bu yerda esa qo'shish.", '−10 это минус 5 минус 5. А здесь сложение.', '−10 is minus 5 minus 5. Here it is an addition.') },
        { id: 'd', label: '−25', hint: L("−25 bu minus 5 karra 5. Belgi qo'shish.", '−25 это минус 5 умножить на 5. Знак сложение.', '−25 is minus 5 times 5. The sign is a plus.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("3x = 12 tenglamaning ildizi?", 'Корень уравнения 3x = 12?', 'The root of 3x = 12?'),
      ok: L("Ikkala tomon uchga bo'lindi.", 'Обе части разделили на три.', 'Both sides were divided by three.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '9', tag: 'Z2', hint: L("9 bu 12 ayirish 3. x oldida ko'paytirish turibdi, demak bo'lish kerak.", '9 это 12 минус 3. Перед x умножение, значит нужно деление.', '9 is 12 minus 3. There is a multiplication before x, so division is needed.') },
        { id: 'c', label: '15', tag: 'Z2', hint: L("15 bu 12 qo'shuv 3. Bo'lish kerak edi.", '15 это 12 плюс 3. Нужно было деление.', '15 is 12 plus 3. Division was needed.') },
        { id: 'd', label: '36', tag: 'Z2', hint: L("36 bu 12 karra 3. Bo'lish kerak edi.", '36 это 12 умножить на 3. Нужно было деление.', '36 is 12 times 3. Division was needed.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Tarozida amal qayerga qo'llanardi?",
        'Куда на весах применялось действие?',
        'Where was an operation applied on the balance?',
      ),
      ok: L("Ikkala tomonga birdan. Bugun shu qoidadan qisqa yozuv chiqadi.", 'Сразу к обеим частям. Сегодня из этого правила выйдет короткая запись.', 'To both sides at once. Today that rule turns into a short notation.'),
      items: [
        { id: 'a', correct: true, label: L('Ikkala tomonga', 'К обеим частям', 'To both sides') },
        { id: 'b', tag: 'Z1', label: L('Harf turgan tomonga', 'К той части, где буква', 'To the side with the letter'), hint: L("Bitta tomonni o'zgartirsak tenglik buziladi. Tarozida bunday tugma yo'q edi.", 'Если менять одну часть, равенство ломается. На весах такой кнопки не было.', 'Changing one side breaks the equality. The balance had no such button.') },
        { id: 'c', tag: 'Z1', label: L('Son turgan tomonga', 'К той части, где число', 'To the side with the number'), hint: L("Xuddi shunday: amal ikkala tomonga ketadi.", 'То же самое: действие идёт к обеим частям.', 'The same: the operation goes to both sides.') },
        { id: 'd', tag: 'Z1', label: L("Har safar boshqacha", 'Каждый раз по-разному', 'Differently each time'), hint: L("Yo'q, qoida bitta va u har doim bir xil: ikkala tomonga.", 'Нет, правило одно и всегда одинаковое: к обеим частям.', 'No, the rule is one and always the same: to both sides.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta savolga javob beramiz, ular bugun kerak bo'ladi.", 'Ответим на три вопроса, они сегодня понадобятся.', 'Let us answer three questions, they will be needed today.'),
    A('1', "Ikkinchisi.", 'Второе.', 'Second.'),
    A('2', "Uchinchisi. Bugungi darsning tayanchi.", 'Третье. Опора сегодняшнего урока.', 'Third. The foundation of today.'),
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
// EKRAN 3. TUSHUNTIRISH 1. AL-JABR TAROZIDA. O'zgaruvchini IKKALA
// tomondan ayiramiz -- va ko'chirish shundan kelib chiqadi.
// ============================================================
const S3 = {
  eyebrow: L('AL-JABR', 'АЛЬ-ДЖАБР', 'AL-JABR'),
  title: L("O'zgaruvchi ham ikkala tomondan ayiriladi", 'Переменную тоже вычитают из обеих частей', 'The variable is taken from both sides too'),
  start: { a: 2, b: 9, k: -1, c: 15 },
  actions: [
    { id: 'ax', kind: 'addx', n: 1, label: '+x' },
    { id: 's9', kind: 'sub', n: 9, label: '−9' },
    { id: 'd3', kind: 'div', n: 3, label: ':3' },
    { id: 'sx', kind: 'subx', n: 1, label: '−x', tag: 'Z1', hint: L("O'ngda minus x turibdi. Uni yo'qotish uchun x QO'SHISH kerak, ayirish emas.", 'Справа стоит минус x. Чтобы его убрать, надо x ПРИБАВИТЬ, а не вычесть.', 'The right side has a minus x. To remove it you must ADD x, not subtract.') },
  ],
  done: L("Uch qadam, va x yolg'iz qoldi.", 'Три шага, и x остался один.', 'Three steps, and the x is left alone.'),
  reward: {
    title: L("Ko'chirish yangi qoida emas", 'Перенос это не новое правило', 'Moving a term is not a new rule'),
    text: L(
      "x ni ikkala tomondan ayirdik, va u o'ng tomondan yo'qolib, chap tomonga qarama-qarshi ishora bilan chiqdi. Ko'chirishda ishora aynan shuning uchun almashadi.",
      'Мы вычли x из обеих частей, и он исчез справа, а слева появился с противоположным знаком. Именно поэтому при переносе знак меняется.',
      'We took x from both sides, so it vanished on the right and appeared on the left with the opposite sign. That is exactly why the sign flips when you move a term.',
    ),
  },
  audio: [
    A('mount', "Bu safar x ikkala tomonda ham bor. Tarozi buni ham uddalaydi.", 'На этот раз x есть в обеих частях. Весы справятся и с этим.', 'This time the x is on both sides. The balance handles that too.'),
    A('mount', "O'ngdagi x ni yo'qotish uchun qaysi amal kerak.", 'Какое действие уберёт x справа.', 'Which operation removes the x on the right.'),
    A('step2', "x o'ngdan yo'qoldi va chapga qo'shildi. Endi son bilan ishlaymiz.", 'x исчез справа и прибавился слева. Теперь займёмся числом.', 'The x vanished on the right and joined the left. Now for the number.'),
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
      <EquationBalance
        audio={audio}
        start={S3.start}
        actions={S3.actions}
        done={S3.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2. AL-JABR NING QISQA YOZUVI. Endi tarozisiz:
// had ko'chadi, ishora almashadi. Bu o'sha amalning qisqa shakli.
// ============================================================
const S4 = {
  eyebrow: L('QISQA YOZUV', 'КОРОТКАЯ ЗАПИСЬ', 'THE SHORT NOTATION'),
  title: L('Had ko\'chadi, ishora almashadi', 'Слагаемое переходит, знак меняется', 'The term crosses over, the sign flips'),
  template: ['5x − 8 = 12,     5x = 12 ', { slot: 0 }, ' 8'],
  parts: [
    { id: 'p_plus', label: '+' },
    { id: 'p_minus', label: '−' },
    { id: 'p_mul', label: '·' },
    { id: 'p_div', label: ':' },
  ],
  answer: ['p_plus'],
  prompt: L(
    "Sakkizni o'ngga ko'chiramiz. U qanday ishora bilan boradi?",
    'Переносим восьмёрку вправо. С каким знаком она пойдёт?',
    'We move the eight to the right. With which sign does it go?',
  ),
  checkNote: L(
    "Chapda minus sakkiz edi, o'ngga plyus sakkiz bo'lib o'tdi: 5x = 20",
    'Слева было минус восемь, вправо перешло плюс восемь: 5x = 20',
    'It was minus eight on the left and crossed as plus eight: 5x = 20',
  ),
  wrongs: [
    { key: 'p_minus', tag: 'Z1', hint: L("Ishora saqlanmaydi. Ko'chirish bu ikkala tomonga sakkiz QO'SHISH, demak o'ngda plyus paydo bo'ladi.", 'Знак не сохраняется. Перенос это прибавление восьми к обеим частям, значит справа появится плюс.', 'The sign is not kept. Moving means adding eight to both sides, so a plus appears on the right.') },
    { key: '*', tag: 'Z1', hint: L("Ko'chirishda ishora qarama-qarshisiga almashadi.", 'При переносе знак меняется на противоположный.', 'When a term moves, its sign becomes the opposite.') },
  ],
  after: {
    title: L('Al-jabr', 'Аль-джабр', 'Al-jabr'),
    text: L(
      "Al-Xorazmiy buni shunday aytardi: 3x chapga o'tsa, minus 3x bo'ladi. Minus 4 esa plyus 4 bo'lib o'tadi.",
      'Аль-Хорезми говорил так: 3x переходит влево и становится минус 3x. А минус 4 переходит как плюс 4.',
      'Al-Khwarizmi put it this way: 3x crosses to the left and becomes minus 3x. And minus 4 crosses as plus 4.',
    ),
  },
  audio: [
    A('mount', "Endi tarozini qisqartiramiz. Ikkala tomonga bir xil narsani yozish o'rniga hadni ko'chiramiz.", 'Теперь сократим весы. Вместо того чтобы писать одно и то же в обеих частях, перенесём слагаемое.', 'Now let us shorten the balance. Instead of writing the same thing on both sides, we move the term.'),
    A('mount', "Ishorani tanlang.", 'Выбери знак.', 'Choose the sign.'),
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
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {done ? (
        <HackNote tone="ok" bottom title={t(S4.after.title)}>{t(S4.after.text)}</HackNote>
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3. VAL-MUQOBALA: ikkala tomonda bir xil had
// tursa, u yo'qoladi. Uzun tenglama uch qadamda qisqaradi.
// ============================================================
const S5 = {
  eyebrow: L('VAL-MUQOBALA', 'ВАЛ-МУКАБАЛА', 'WAL-MUQABALA'),
  title: L("Ikkala tomonda bir xil had", 'Одинаковое слагаемое в обеих частях', 'The same term on both sides'),
  start: { a: 14, b: -7, k: 11, c: 2 },
  actions: [
    { id: 'sx11', kind: 'subx', n: 11, label: '−11x' },
    { id: 'a7', kind: 'add', n: 7, label: '+7' },
    { id: 'd3', kind: 'div', n: 3, label: ':3' },
    { id: 's7', kind: 'sub', n: 7, label: '−7', tag: 'Z1', hint: L("Chapda minus yetti turibdi. Uni yo'qotish uchun yetti QO'SHISH kerak.", 'Слева стоит минус семь. Чтобы его убрать, надо семь ПРИБАВИТЬ.', 'The left side has a minus seven. To remove it you must ADD seven.') },
  ],
  done: L("Uzun tenglama uch qadamda qisqardi.", 'Длинное уравнение сжалось за три шага.', 'The long equation shrank in three steps.'),
  reward: {
    title: L('Val-muqobala', 'Вал-мукабала', 'Wal-muqabala'),
    text: L(
      "Ikkala tomonda ham 11x va minus 7 bor edi. Ular bir-birini yo'qotdi, va uzun yozuvdan 3x teng 9 qoldi. Al-Xorazmiy buni «bir xil hadlar bilan xayrlashamiz» derdi.",
      'В обеих частях были 11x и минус 7. Они уничтожили друг друга, и от длинной записи осталось 3x = 9. Аль-Хорезми говорил: с одинаковыми слагаемыми прощаемся.',
      'Both sides had an 11x and a minus 7. They cancelled out and the long line became 3x = 9. Al-Khwarizmi said: we say farewell to equal terms.',
    ),
  },
  audio: [
    A('mount', "Tenglama uzun ko'rinadi, lekin unda takror bor. Ikkala tomonga ham diqqat bilan qarang.", 'Уравнение выглядит длинным, но в нём есть повтор. Посмотри внимательно на обе части.', 'The equation looks long, but there is a repeat in it. Look closely at both sides.'),
    A('mount', "O'ngdagi o'n bir x ni yo'qotishdan boshlang.", 'Начни с того, чтобы убрать одиннадцать x справа.', 'Start by removing the eleven x on the right.'),
    A('step2', "O'n bir x ikkala tomondan ham ketdi. Endi son.", 'Одиннадцать x ушли с обеих сторон. Теперь число.', 'The eleven x is gone from both sides. Now the number.'),
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
// EKRAN 6. TUSHUNTIRISH 4. O'ZINGIZ, tarozida.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Uch qadamni o\'zingiz tanlang', 'Три шага выбираешь сам', 'You choose all three steps'),
  start: { a: 3, b: -8, k: 1, c: 6 },
  actions: [
    { id: 'sx', kind: 'subx', n: 1, label: '−x' },
    { id: 'a8', kind: 'add', n: 8, label: '+8' },
    { id: 'd2', kind: 'div', n: 2, label: ':2' },
    { id: 'ax', kind: 'addx', n: 1, label: '+x', tag: 'Z1', hint: L("O'ngda plyus x turibdi. Uni yo'qotish uchun x AYIRISH kerak.", 'Справа стоит плюс x. Чтобы его убрать, надо x ВЫЧЕСТЬ.', 'The right side has a plus x. To remove it you must SUBTRACT x.') },
  ],
  done: L("Ildiz topildi.", 'Корень найден.', 'The root is found.'),
  audio: [
    A('mount', "Endi butun yechim sizniki. Uch qadam kerak bo'ladi.", 'Теперь всё решение твоё. Понадобится три шага.', 'Now the whole solution is yours. Three steps will be needed.'),
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
      <EquationBalance
        audio={audio}
        start={S6.start}
        actions={S6.actions}
        done={S6.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {done ? <SolutionSet kind="one" caption={SET_CAP} /> : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 7. CHEGARAVIY HOLAT. Muqobaladan keyin x BUTUNLAY yo'qoladi va
// yolg'on tenglik qoladi. KVOTA EKRANI.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("x butunlay yo'qolib qolsa", 'Если x исчезнет совсем', 'When the x disappears entirely'),
  expr: '36 + 4x = 4x + 35',
  probe: {
    question: L(
      "4x ikkala tomondan ketdi. 36 = 35 qoldi. Bu nimani anglatadi?",
      'После ухода 4x осталось 36 = 35. Что это значит?',
      'After the 4x is gone, 36 = 35 remains. What does that mean?',
    ),
    items: [
      {
        id: 'none', correct: true,
        label: L("Tenglamaning ildizi yo'q", 'У уравнения нет корней', 'The equation has no roots'),
      },
      {
        id: 'zero', tag: 'Z4',
        label: L('Ildiz nolga teng', 'Корень равен нулю', 'The root is zero'),
        hint: L("Nolni qo'ying: chapda 36, o'ngda 35. Tenglik baribir yolg'on. Ildiz nol bo'lish va ildiz yo'q bo'lish boshqa narsa.", 'Подставь нуль: слева 36, справа 35. Равенство всё равно ложно. Корень нуль и отсутствие корней это разное.', 'Put in zero: 36 on the left, 35 on the right. The equality is still false. A root of zero and no root are different things.'),
      },
      {
        id: 'all', tag: 'Z4',
        label: L('Har qanday son mos keladi', 'Подходит любое число', 'Any number fits'),
        hint: L("Har qanday sonda ham 36 va 35 qoladi, ular esa teng emas. Agar o'ngda ham 36 tursa, o'shanda har qanday son mos kelardi.", 'При любом числе останутся 36 и 35, а они не равны. Вот если бы справа тоже стояло 36, тогда подошло бы любое.', 'For any number 36 and 35 remain, and they are not equal. If the right side were 36 too, then any number would fit.'),
      },
      {
        id: 'error', tag: 'Z3',
        label: L('Yechishda xatoga yo\'l qo\'yilgan', 'В решении допущена ошибка', 'There is a mistake in the solution'),
        hint: L("Yechim to'g'ri: chapda ham, o'ngda ham 4x bor edi va ular yo'qoldi. Xato yo'q, shunchaki bunday tenglama ham bo'ladi.", 'Решение верное: и слева, и справа было 4x, они ушли. Ошибки нет, просто бывают и такие уравнения.', 'The work is right: there was a 4x on each side and they cancelled. No mistake, such equations simply exist.'),
      },
    ],
  },
  okText: L(
    "Hech qanday son 36 ni 35 ga aylantira olmaydi. Bunday tenglamaning ildizi yo'q.",
    'Никакое число не превратит 36 в 35. У такого уравнения корней нет.',
    'No number turns 36 into 35. Such an equation has no roots.',
  ),
  bonus: {
    title: L('Sakkizinchi darsdagi uch holat', 'Три случая из восьмого урока', 'The three cases from lesson eight'),
    text: L(
      "O'sha uch holat bu yerda ham chiqadi. Faqat endi ular boshda emas, MUQOBALADAN KEYIN ko'rinadi: ikkala tomonda 36 va 35 qolsa ildiz yo'q, 36 va 36 qolsa har qanday son mos keladi.",
      'Те же три случая появляются и здесь. Только теперь они видны не сразу, а ПОСЛЕ мукабалы: осталось 36 и 35 — корней нет, осталось 36 и 36 — подходит любое число.',
      'The same three cases turn up here too. Only now they appear not at the start but AFTER the cancelling: 36 and 35 left means no roots, 36 and 36 left means any number fits.',
    ),
  },
  audio: [
    A('mount', "Bu tenglamada ikkala tomonda ham to'rt x bor. Muqobaladan keyin ular yo'qoladi.", 'В этом уравнении в обеих частях есть четыре x. После мукабалы они исчезают.', 'This equation has a four x on each side. After the cancelling they vanish.'),
    A('mount', "Qoladigan narsa esa g'alati. Avval javob bering.", 'А то, что остаётся, выглядит странно. Сначала ответь.', 'What is left looks strange. Answer first.'),
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
        data={{ ...S7.probe, ok: S7.okText }}
        cols={2}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {done ? <SolutionSet kind="none" caption={SET_CAP} /> : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 8. QOIDA. Maydon TO'Q SARIQ.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Ikki usul, ikki nom", 'Два способа, два имени', 'Two methods, two names'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("bir xil hadlar ikkala tomondan yo'qotiladi", 'одинаковые слагаемые в обеих частях уничтожают', 'equal terms on both sides are cancelled') },
    { id: 'f2', label: L("qolgan hadlar ko'chiriladi, ishora almashadi", 'оставшиеся слагаемые переносят, знак меняется', 'the remaining terms are moved and the sign flips') },
    { id: 'f3', label: L("o'xshash hadlar ixchamlanadi", 'подобные слагаемые приводят', 'like terms are collected') },
    { id: 'f4', label: L("ikkala tomon koeffitsiyentga bo'linadi", 'обе части делят на коэффициент', 'both sides are divided by the coefficient') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval uzun yozuvni qisqartiramiz, keyin ko'chiramiz, oxirida bo'lamiz.",
    'Порядок нарушен. Сначала укорачиваем длинную запись, потом переносим, в конце делим.',
    'The order is off. First shorten the long line, then move terms, and divide last.',
  ),
  lawChips: [
    { label: '=', tone: 'par' },
    { label: '⇄ ±', tone: 's1' },
    { label: 'ax = b', tone: 's2' },
    { label: ': a', tone: 'off' },
  ],
  lawSweep: L(
    "yo'qotamiz, ko'chiramiz, ixchamlaymiz, bo'lamiz",
    'уничтожаем, переносим, приводим, делим',
    'cancel, move, collect, divide',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Al-jabr: hadni bir tomondan ikkinchisiga ko'chirganda uning ishorasi qarama-qarshisiga almashadi.",
        'Аль-джабр: при переносе слагаемого из одной части в другую его знак меняется на противоположный.',
        'Al-jabr: when a term moves from one side to the other, its sign becomes the opposite.',
      ),
      L(
        "Val-muqobala: ikkala tomonda turgan bir xil hadlar yo'qotiladi.",
        'Вал-мукабала: одинаковые слагаемые, стоящие в обеих частях, уничтожаются.',
        'Wal-muqabala: identical terms standing on both sides are cancelled.',
      ),
    ],
  },
  hookCap: L(
    "Ikkalasi ham tarozining qisqa yozuvi, yangi qoida emas",
    'Оба это короткая запись весов, а не новое правило',
    'Both are the balance written briefly, not a new rule',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("ko'chirdingizmi -- ishorani almashtiring", 'перенёс — поменяй знак', 'moved it — flip the sign'),
    L("bir xil hadlar yo'qoladi", 'одинаковые слагаемые уходят', 'equal terms go away'),
    L("x yo'qolsa, javob sonlarda", 'если x исчез, ответ в числах', 'if the x is gone, the answer is in the numbers'),
  ],
  audio: [
    A('mount', "Ikkala usulni ham ko'rdik. Endi ularni tartibga solamiz.", 'Оба способа мы увидели. Теперь расставим их по порядку.', 'We have seen both methods. Now let us put them in order.'),
    A('mount', "Bo'laklarni to'g'ri ketma-ketlikda joylashtiring.", 'Разложи фрагменты в верной последовательности.', 'Put the pieces in the right sequence.'),
    A('ok', "To'g'ri. Bu tartib qolgan darslarda ham ishlaydi.", 'Верно. Этот порядок работает и в остальных уроках.', 'Correct. This order works in the remaining lessons too.'),
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
// EKRAN 9. MASHQ 1. Uchta tenglama, javob bo'laklardan yig'iladi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasini ko\'chirib yechamiz', 'Решаем три переносом', 'Solving three by moving terms'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Uchalasida ham bitta tartib: ko'chirdik, ixchamladik, bo'ldik.",
      'Во всех трёх один порядок: перенесли, привели, разделили.',
      'The same order in all three: move, collect, divide.',
    ),
  },
  rounds: [
    {
      template: ['3x − 8 = x + 6,     x = ', { slot: 0 }],
      parts: [{ id: 'p7', label: '7' }, { id: 'p1', label: '−1' }, { id: 'p14', label: '14' }, { id: 'p2', label: '2' }],
      answer: ['p7'],
      prompt: L("3x − 8 = x + 6. Ildizni toping.", '3x − 8 = x + 6. Найди корень.', '3x − 8 = x + 6. Find the root.'),
      checkNote: L("x chapga, 8 o'ngga: 2x = 14", 'x влево, 8 вправо: 2x = 14', 'x to the left, 8 to the right: 2x = 14'),
      wrongs: [
        { key: 'p14', tag: 'Z6', hint: L("14 bu 2x ning qiymati. Uni ikkiga bo'lish qolib ketdi.", '14 это значение 2x. Разделить на два осталось несделанным.', '14 is the value of 2x. Dividing by two was left undone.') },
        { key: '*', tag: 'Z1', hint: L("x ni chapga, sakkizni o'ngga ko'chiring va ikkala ishorani ham almashtiring.", 'Перенеси x влево, восьмёрку вправо и поменяй оба знака.', 'Move the x left and the eight right, flipping both signs.') },
      ],
    },
    {
      template: ['2x + 9 = 15 − x,     x = ', { slot: 0 }],
      parts: [{ id: 'q2', label: '2' }, { id: 'q8', label: '8' }, { id: 'q6', label: '6' }, { id: 'q24', label: '24' }],
      answer: ['q2'],
      prompt: L("Darsning boshidagi tenglama. Endi uni o'zingiz yeching.", 'Уравнение с начала урока. Теперь реши его сам.', 'The equation from the start of the lesson. Now solve it yourself.'),
      checkNote: L("3x = 6, demak x = 2. Xukdagi birinchi o'quvchi haq edi", '3x = 6, значит x = 2. Первый ученик на хуке был прав', '3x = 6, so x = 2. The first student on the hook was right'),
      wrongs: [
        { key: 'q8', tag: 'Z1', hint: L("8 bu ishora almashtirilmagan javob. Minus x chapga plyus x bo'lib o'tadi.", '8 это ответ без смены знака. Минус x переходит влево как плюс x.', '8 is the answer without flipping the sign. Minus x crosses to the left as plus x.') },
        { key: '*', tag: 'Z1', hint: L("Ikkala hadni ham ko'chiring va ishoralarni almashtiring.", 'Перенеси оба слагаемых и поменяй знаки.', 'Move both terms and flip the signs.') },
      ],
    },
    {
      template: ['5x + 3 = 2x + 3,     x = ', { slot: 0 }],
      parts: [{ id: 'w0', label: '0' }, { id: 'w1', label: '1' }, { id: 'w2', label: '2' }, { id: 'w6', label: '6' }],
      answer: ['w0'],
      prompt: L("Diqqat: ikkala tomonda ham uchlik bor.", 'Внимание: тройка есть в обеих частях.', 'Careful: there is a three on each side.'),
      checkNote: L("Uchliklar yo'qoldi, 3x = 0 qoldi. Ildiz nol, va bu ildiz yo'q degani emas", 'Тройки ушли, осталось 3x = 0. Корень нуль, и это не то же, что корней нет', 'The threes cancelled, leaving 3x = 0. The root is zero, which is not the same as no roots'),
      wrongs: [
        { key: 'w6', tag: 'Z3', hint: L("6 bu uchliklarni qo'shib yuborilgan javob. Ular bir xil, demak yo'qoladi.", '6 это ответ, где тройки сложили. Они одинаковые, значит уничтожаются.', '6 is the answer where the threes were added. They are equal, so they cancel.') },
        { key: '*', tag: 'Z3', hint: L("Bir xil hadlarni yo'qoting, keyin qolganini yeching.", 'Уничтожь одинаковые слагаемые, потом реши остаток.', 'Cancel the equal terms, then solve what is left.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Uchta tenglama.", 'Правило готово. Три уравнения.', 'The rule is ready. Three equations.'),
    A('r1', "Ikkinchisi tanish bo'lsa kerak.", 'Второе должно быть знакомым.', 'The second should look familiar.'),
    A('r2', "Uchinchisida diqqat bo'ling.", 'В третьем будь внимателен.', 'Be careful with the third.'),
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
  const LABELS = ['3x − 8 = x + 6   →   x = 7', '2x + 9 = 15 − x   →   x = 2', '5x + 3 = 2x + 3   →   x = 0']
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
// EKRAN 10. MASHQ 2. Qavs + ko'chirish. Tarozi qavsni OCHMAYDI, shuning
// uchun bu ekranda u yo'q: avval qavs, keyin ko'chirish.
// ============================================================
const S10 = {
  eyebrow: L('QAVS VA KO\'CHIRISH', 'СКОБКА И ПЕРЕНОС', 'BRACKET AND MOVE'),
  title: L('Avval qavs ochiladi', 'Скобку раскрывают первой', 'The bracket is opened first'),
  rounds: [
    {
      template: ['4x − 9 = ', { slot: 0 }, ' − ', { slot: 1 }],
      parts: [{ id: 'p6x', label: '6x' }, { id: 'p15', label: '15' }, { id: 'p2x', label: '2x' }, { id: 'p5', label: '5' }],
      answer: ['p6x', 'p15'],
      prompt: L(
        "4x − 9 = 3(2x − 5). Qavsni oching.",
        '4x − 9 = 3(2x − 5). Раскрой скобку.',
        '4x − 9 = 3(2x − 5). Open the bracket.',
      ),
      checkNote: L("Uchlik qavs ichidagi HAR BIR hadga yuboriladi", 'Тройку отправляют к КАЖДОМУ слагаемому в скобке', 'The three goes to EVERY term inside the bracket'),
      wrongs: [
        { key: 'p6x|p5', tag: 'Z5', hint: L("Beshlik ham uchga ko'paytiriladi: 3 karra 5 bu 15.", 'Пятёрку тоже умножают на три: 3 умножить на 5 это 15.', 'The five is multiplied by three as well: 3 times 5 is 15.') },
        { key: '*', tag: 'Z5', hint: L("Uchlikni ikkala hadga ham ko'paytiring.", 'Умножь тройку на оба слагаемых.', 'Multiply the three by both terms.') },
      ],
    },
    {
      template: ['x = ', { slot: 0 }],
      parts: [{ id: 'q3', label: '3' }, { id: 'q12', label: '−12' }, { id: 'q2', label: '2' }, { id: 'q6', label: '6' }],
      answer: ['q3'],
      prompt: L(
        "Endi ko'chiring va ildizni toping.",
        'Теперь перенеси и найди корень.',
        'Now move the terms and find the root.',
      ),
      checkNote: L("4 · 3 − 9 = 3, va 3 karra qavs 6 − 5 ham 3", '4 · 3 − 9 = 3, и 3 умножить на скобку 6 − 5 тоже 3', '4 · 3 − 9 = 3, and 3 times the bracket 6 − 5 = 3 too'),
      wrongs: [
        { key: 'q12', tag: 'Z1', hint: L("Minus 12 bu ishora almashtirilmagan javob. Minus 2x chapga o'tsa plyus bo'ladi.", 'Минус 12 это ответ без смены знака. Минус 2x при переносе влево станет плюсом.', 'Minus 12 is the answer without flipping the sign. Minus 2x becomes a plus on the left.') },
        { key: '*', tag: 'Z1', hint: L("6x ni chapga, 9 ni o'ngga ko'chiring.", 'Перенеси 6x влево, а 9 вправо.', 'Move the 6x left and the 9 right.') },
      ],
    },
  ],
  reward: {
    title: L('Tarozi qavsni ochmaydi', 'Весы скобку не раскрывают', 'The balance does not open brackets'),
    text: L(
      "Qavs ichidagi hadlar hali bitta had emas, ularni ko'chirib bo'lmaydi. Avval beshinchi darsdagi qoida, keyin bugungisi.",
      'Слагаемые внутри скобки ещё не отдельные слагаемые, их не перенести. Сначала правило пятого урока, потом сегодняшнее.',
      'The terms inside a bracket are not separate terms yet, they cannot be moved. First the rule of lesson five, then today one.',
    ),
  },
  audio: [
    A('mount', "Bu tenglamada qavs bor. Tarozi qavsni ocholmaydi, shuning uchun bu ekranda u yo'q.", 'В этом уравнении есть скобка. Весы её не раскроют, поэтому на этом экране их нет.', 'This equation has a bracket. The balance cannot open it, so it is not on this screen.'),
    A('r1', "Qavs ochildi. Endi ko'chiring.", 'Скобка раскрыта. Теперь перенеси.', 'The bracket is open. Now move the terms.'),
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
  const LABELS = ['4x − 9 = 6x − 15', 'x = 3']
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
  title: L('Tarozisiz', 'Без весов', 'Without the balance'),
  template: ['7x − 12 = 2x + 13,     x = ', { slot: 0 }],
  parts: [
    { id: 'p5', label: '5' },
    { id: 'p1', label: '0,2' },
    { id: 'p25', label: '25' },
    { id: 'p3', label: '3' },
  ],
  answer: ['p5'],
  prompt: L(
    "7x − 12 = 2x + 13. Qadamlarni o'zingiz o'ylang.",
    '7x − 12 = 2x + 13. Шаги держишь в голове.',
    '7x − 12 = 2x + 13. You hold the steps in your head.',
  ),
  checkNote: L(
    "5x = 25, demak x = 5. Tekshiruv: 35 − 12 = 23, va 10 + 13 ham 23",
    '5x = 25, значит x = 5. Проверка: 35 − 12 = 23, и 10 + 13 тоже 23',
    '5x = 25, so x = 5. Check: 35 − 12 = 23, and 10 + 13 = 23 too',
  ),
  wrongs: [
    { key: 'p25', tag: 'Z6', hint: L("25 bu 5x ning qiymati. Beshga bo'lish qolib ketdi.", '25 это значение 5x. Разделить на пять осталось несделанным.', '25 is the value of 5x. Dividing by five was left undone.') },
    { key: 'p1', tag: 'Z6', hint: L("0,2 bu 5 ni 25 ga bo'lgandagi natija. Bo'linuvchi va bo'luvchi almashib ketgan.", '0,2 это 5 разделить на 25. Делимое и делитель поменялись местами.', '0.2 is 5 divided by 25. The dividend and divisor were swapped.') },
    { key: '*', tag: 'Z1', hint: L("2x ni chapga, 12 ni o'ngga ko'chiring, ishoralarni almashtiring.", 'Перенеси 2x влево, 12 вправо, поменяй знаки.', 'Move the 2x left and the 12 right, flipping the signs.') },
  ],
  audio: [
    A('mount', "Endi tarozisiz. Ikkala tomonda ham x bor.", 'Теперь без весов. x есть в обеих частях.', 'Now without the balance. The x is on both sides.'),
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
// EKRAN 12. TUZOQ (§8.2). Ko'chirdi, ishorani almashtirmadi.
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
    { id: 'r1', text: '6x − 5 = 2x + 7' },
    { id: 'r2', text: '6x + 2x = 7 − 5' },
    { id: 'r3', text: '8x = 2' },
    { id: 'r4', text: 'x = 0,25' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich tenglama, unda hali hech nima qilinmagan.", 'Это исходное уравнение, в нём ещё ничего не сделано.', 'That is the original equation, nothing has been done to it yet.'),
    r3: L("Bu qator ikkinchisidan to'g'ri kelib chiqadi: 6x qo'shuv 2x bu 8x, 7 ayirish 5 bu 2. Xato yuqoriroqda.", 'Эта строка верно следует из второй: 6x плюс 2x это 8x, 7 минус 5 это 2. Ошибка выше.', 'This line follows correctly from the second: 6x plus 2x is 8x, 7 minus 5 is 2. The mistake is higher up.'),
    r4: L("Bu shunchaki bo'lishning natijasi.", 'Это просто результат деления.', 'That is just the result of the division.'),
  },
  tags: { r1: 'Z1', r3: 'Z1', r4: 'Z1' },
  proofFill: {
    template: ['6x − 2x = 7 ', { slot: 0 }, ' 5,     x = ', { slot: 1 }],
    parts: [{ id: 'v_plus', label: '+' }, { id: 'v3', label: '3' }, { id: 'v_minus', label: '−' }, { id: 'v05', label: '0,5' }],
    answer: ['v_plus', 'v3'],
    prompt: L(
      "Ikkala hadni ham to'g'ri ko'chiring va yechimni oxirigacha olib boring.",
      'Перенеси оба слагаемых верно и доведи решение до конца.',
      'Move both terms correctly and finish the solution.',
    ),
    checkNote: L("4x = 12, x = 3. Tekshiruv: 18 − 5 = 13, va 6 + 7 ham 13", '4x = 12, x = 3. Проверка: 18 − 5 = 13, и 6 + 7 тоже 13', '4x = 12, x = 3. Check: 18 − 5 = 13, and 6 + 7 = 13 too'),
    wrongs: [
      { key: 'v_minus|v3', tag: 'Z1', hint: L("Chapda minus besh turgandi, demak o'ngga plyus besh bo'lib o'tadi.", 'Слева было минус пять, значит вправо перейдёт плюс пять.', 'It was minus five on the left, so it crosses as plus five.') },
      { key: '*', tag: 'Z1', hint: L("2x ni chapga ko'chirganda minus bo'ladi, beshni o'ngga ko'chirganda plyus bo'ladi.", 'При переносе 2x влево будет минус, при переносе пятёрки вправо будет плюс.', 'Moving the 2x left gives a minus, moving the five right gives a plus.') },
    ],
  },
  audio: [
    A('mount', "O'quvchi ikkala hadni ham ko'chirdi va kasr javob oldi. Aslida ildiz butun son.", 'Ученик перенёс оба слагаемых и получил дробный ответ. На самом деле корень целый.', 'A student moved both terms and got a fractional answer. In fact the root is whole.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. Ikkala hadning ham ishorasi saqlanib qolgan. Endi to'g'ri qiling.", 'Нашёл. У обоих слагаемых знак сохранился. Теперь сделай верно.', 'You found it. Both terms kept their signs. Now do it right.'),
    A('done', "Ildiz uch ekan. Ishoralar almashtirilsa yetardi.", 'Корень оказался тройкой. Достаточно было поменять знаки.', 'The root is three. Flipping the signs was all it needed.'),
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
// EKRAN 13. KO'CHIRISH. Vaziyatda noma'lum IKKALA tomonda.
// ============================================================
const S13 = {
  eyebrow: L("TESKARI YO'L", 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L('Ikki do\'kon, bir narx', 'Два магазина, одна цена', 'Two shops, one price'),
  rounds: [
    {
      template: [{ slot: 0 }, 'x + 300 = ', { slot: 1 }, 'x'],
      parts: [{ id: 'p2', label: '2' }, { id: 'p5', label: '5' }, { id: 'p300', label: '300' }, { id: 'p3', label: '3' }],
      answer: ['p2', 'p5'],
      prompt: L(
        "Birinchi do'konda 2 ta daftar va 300 so'mlik yetkazish, ikkinchisida 5 ta xuddi shunday daftar. To'lov bir xil chiqdi. Tenglamani yig'ing.",
        'В первом магазине 2 тетради и доставка за 300 сумов, во втором 5 таких же тетрадей. Заплатили поровну. Собери уравнение.',
        'The first shop: 2 notebooks and a 300 sum delivery. The second: 5 of the same notebooks. The totals matched. Build the equation.',
      ),
      checkNote: L("x -- bitta daftarning narxi. U ikkala tomonda ham bor", 'x это цена одной тетради. Она есть в обеих частях', 'x is the price of one notebook. It appears on both sides'),
      wrongs: [
        { key: 'p5|p2', tag: 'Z2', hint: L("Birinchi do'konda ikkita daftar edi, ikkinchisida beshta. Tartibni saqlang.", 'В первом магазине было две тетради, во втором пять. Сохрани порядок.', 'The first shop had two notebooks, the second five. Keep the order.') },
        { key: '*', tag: 'Z2', hint: L("Birinchi katakka birinchi do'kondagi daftarlar soni, ikkinchisiga ikkinchi do'kondagisi.", 'В первую клетку число тетрадей первого магазина, во вторую второго.', 'The first box takes the first shop count, the second box the second shop count.') },
      ],
    },
    {
      template: ['x = ', { slot: 0 }],
      parts: [{ id: 'q100', label: '100' }, { id: 'q300', label: '300' }, { id: 'q43', label: '43' }, { id: 'q60', label: '60' }],
      answer: ['q100'],
      prompt: L(
        "Endi yeching: bitta daftar necha so'm?",
        'Теперь реши: сколько стоит одна тетрадь?',
        'Now solve it: how much is one notebook?',
      ),
      checkNote: L("2 · 100 + 300 = 500, va 5 · 100 ham 500", '2 · 100 + 300 = 500, и 5 · 100 тоже 500', '2 · 100 + 300 = 500, and 5 · 100 = 500 too'),
      wrongs: [
        { key: 'q300', tag: 'Z6', hint: L("300 bu yetkazishning narxi, daftarniki emas. 3x teng 300 dan x ni toping.", '300 это цена доставки, а не тетради. Найди x из 3x = 300.', '300 is the delivery price, not the notebook. Find x from 3x = 300.') },
        { key: '*', tag: 'Z1', hint: L("2x ni o'ngga ko'chiring: 300 teng 3x.", 'Перенеси 2x вправо: 300 = 3x.', 'Move the 2x to the right: 300 = 3x.') },
      ],
    },
  ],
  reward: {
    title: L("Noma'lum ikkala tomonda ham bo'lishi mumkin", 'Неизвестное может стоять в обеих частях', 'The unknown may stand on both sides'),
    text: L(
      "Bunday masalada bitta narx ikki xil hisoblanadi, shuning uchun x chapda ham, o'ngda ham paydo bo'ladi. Keyingisi esa tanish: ko'chirish va bo'lish.",
      'В такой задаче одна и та же сумма считается двумя способами, поэтому x появляется и слева, и справа. Дальше знакомое: перенос и деление.',
      'In such a problem one total is counted two ways, so the x turns up on both sides. The rest is familiar: move and divide.',
    ),
  },
  audio: [
    A('mount', "Bugungi tenglamalarda x ikkala tomonda edi. Endi shunday vaziyatni o'zingiz yozasiz.", 'В сегодняшних уравнениях x был в обеих частях. Теперь такую ситуацию ты запишешь сам.', 'In today equations the x stood on both sides. Now you will write such a situation yourself.'),
    A('r1', "Tenglama tayyor. Yeching.", 'Уравнение готово. Реши.', 'The equation is ready. Solve it.'),
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
  const LABELS = ['2x + 300 = 5x', 'x = 100']
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
      prompt: L("4x − 6 = x + 9 tenglamaning ildizi?", 'Корень уравнения 4x − 6 = x + 9?', 'The root of 4x − 6 = x + 9?'),
      ok: L("x chapga, oltilik o'ngga: 3x teng 15.", 'x влево, шестёрка вправо: 3x = 15.', 'x to the left, the six to the right: 3x = 15.'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '1', tag: 'Z1', hint: L("1 bu ishoralar almashtirilmagan javob.", '1 это ответ без смены знаков.', '1 is the answer without flipping the signs.') },
        { id: 'c', label: '15', tag: 'Z6', hint: L("15 bu 3x ning qiymati. Uchga bo'lish qolib ketdi.", '15 это значение 3x. Разделить на три осталось несделанным.', '15 is the value of 3x. Dividing by three was left undone.') },
        { id: 'd', label: '3', tag: 'Z6', hint: L("3 bu koeffitsiyent, ildiz emas.", '3 это коэффициент, а не корень.', '3 is the coefficient, not the root.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("−7 hadni ikkinchi tomonga ko'chirsak, u qanday bo'ladi?", 'Слагаемое −7 перенесли в другую часть. Каким оно станет?', 'The term −7 is moved to the other side. What does it become?'),
      ok: L("Ko'chirishda ishora qarama-qarshisiga almashadi.", 'При переносе знак меняется на противоположный.', 'Moving a term flips its sign.'),
      items: [
        { id: 'a', label: '+7', correct: true },
        { id: 'b', label: '−7', tag: 'Z1', hint: L("Ishora saqlanmaydi. Ko'chirish bu ikkala tomonga yetti qo'shish.", 'Знак не сохраняется. Перенос это прибавление семи к обеим частям.', 'The sign is not kept. Moving means adding seven to both sides.') },
        { id: 'c', label: '−7x', tag: 'Z1', hint: L("Had son edi, harf paydo bo'lmaydi. Faqat ishora almashadi.", 'Слагаемое было числом, буква не появится. Меняется только знак.', 'The term was a number, no letter appears. Only the sign changes.') },
        { id: 'd', label: '0', tag: 'Z3', hint: L("Had yo'qolmaydi, u ikkinchi tomonga o'tadi. Yo'qolish bu boshqa usul, muqobala.", 'Слагаемое не исчезает, оно переходит. Исчезновение это другой способ, мукабала.', 'The term does not vanish, it crosses over. Vanishing is the other method, the cancelling.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("9 + 5x = 5x + 9 tenglamani nechta son to'g'ri qiladi?", 'Сколько чисел делают верным 9 + 5x = 5x + 9?', 'How many numbers make 9 + 5x = 5x + 9 true?'),
      ok: L("Ikkala tomon bir xil, demak tenglik har doim to'g'ri.", 'Обе части одинаковые, значит равенство верно всегда.', 'Both sides are the same, so the equality always holds.'),
      items: [
        { id: 'a', correct: true, label: L('Hamma son', 'Все числа', 'Every number') },
        { id: 'b', tag: 'Z4', label: L("Bittasi ham yo'q", 'Ни одного', 'None'), hint: L("5x ham, 9 ham ikkala tomonda bor. Ular yo'qolgach 9 teng 9 qoladi, bu esa to'g'ri.", 'И 5x, и 9 есть в обеих частях. После их ухода остаётся 9 = 9, а это верно.', 'Both the 5x and the 9 stand on each side. After they cancel, 9 = 9 remains, which is true.') },
        { id: 'c', tag: 'Z4', label: L('Bitta, nol', 'Одно, нуль', 'One, zero'), hint: L("Boshqa sonni ham qo'yib ko'ring, masalan uchni: ikkala tomon ham 24 chiqadi.", 'Подставь другое число, например тройку: обе части выйдут 24.', 'Try another number, say three: both sides come out 24.') },
        { id: 'd', tag: 'Z4', label: L('Bitta, to\'qqiz', 'Одно, девять', 'One, nine'), hint: L("To'qqiz bu had, ildiz emas. Har qanday son yaraydi.", 'Девять это слагаемое, а не корень. Подходит любое число.', 'Nine is a term, not a root. Any number works.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Ikkala tomonda bir xil had tursa, nima qilinadi?", 'Что делают, если в обеих частях стоит одинаковое слагаемое?', 'What do you do when the same term stands on both sides?'),
      ok: L("Uni yo'qotadilar. Bu val-muqobala.", 'Его уничтожают. Это вал-мукабала.', 'It gets cancelled. That is wal-muqabala.'),
      items: [
        { id: 'a', correct: true, label: L("Ikkala tomondan ham yo'qotiladi", 'Уничтожают в обеих частях', 'It is cancelled on both sides') },
        { id: 'b', tag: 'Z3', label: L("Ular qo'shiladi", 'Их складывают', 'They are added together'), hint: L("Qo'shish boshqa tomonga ko'chirilganda bo'ladi. Bir xil hadlar esa shunchaki yo'qoladi.", 'Складывают, когда переносят в другую часть. А одинаковые просто уходят.', 'Adding happens when a term is moved across. Equal terms simply go away.') },
        { id: 'c', tag: 'Z1', label: L("Bittasi ko'chiriladi, ishora almashadi", 'Одно переносят, знак меняется', 'One is moved and its sign flips'), hint: L("Shunday qilish ham mumkin, natija bir xil chiqadi. Lekin qisqarog'i -- ikkalasini birdan yo'qotish.", 'Так тоже можно, результат тот же. Но короче уничтожить оба сразу.', 'That works too and gives the same result. But cancelling both at once is shorter.') },
        { id: 'd', tag: 'Z3', label: L("Ular koeffitsiyentga bo'linadi", 'Их делят на коэффициент', 'They are divided by the coefficient'), hint: L("Bo'lish oxirgi qadam, x yolg'iz qolganda. Bu yerda esa hadlar bir xil.", 'Деление это последний шаг, когда x остался один. А здесь слагаемые одинаковые.', 'Division is the last step, once the x is alone. Here the terms are identical.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsdagi yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi ishora haqida.", 'Второй про знак.', 'The second is about the sign.'),
    A('2', "Uchinchisi.", 'Третий.', 'Third.'),
    A('3', "Oxirgisi so'z bilan.", 'Последний словами.', 'The last one in words.'),
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
// EKRAN 15. YAKUN. Yangi matematika ham, yangi savol ham YO'Q (§4.2).
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Ko'chirdingizmi -- ishorani almashtiring", 'Перенёс — поменяй знак', 'Moved it — flip the sign'),
  gate: S1.gate,
  fix: {
    tokens: ['3x', '=', '6'],
    value: '2',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Ikkala had ham ishorasini almashtirib ko'chdi, va ildiz ikki chiqdi. Tekshiruv: chapda ham, o'ngda ham o'n uch.",
    'Оба слагаемых перешли со сменой знака, и корень вышел два. Проверка: и слева, и справа тринадцать.',
    'Both terms crossed with their signs flipped, and the root came out two. Check: thirteen on the left and thirteen on the right.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    sign: L("biri ishorani almashtirmadi", 'один не поменял знак', 'one did not flip the sign'),
    order: L('boshqa tartibda ko\'chirdi', 'переносил в другом порядке', 'moved them in a different order'),
    both: L('ikkala ildiz ham mos keladi', 'оба корня подходят', 'both roots fit'),
    noroot: L("ko'chirish bilan yechib bo'lmaydi", 'переносом не решить', 'it cannot be solved by moving'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['2x + 9 = 15 − x → x = 2', '14x − 7 = 11x + 2 → x = 3', '4x − 9 = 3(2x − 5) → x = 3', '36 + 4x = 4x + 35  ≠'],
  twoLabel: L('Ikki usul', 'Два способа', 'Two methods'),
  twoA: L('al-jabr:  ⇄  ±', 'аль-джабр:  ⇄  ±', 'al-jabr:  ⇄  ±'),
  twoB: L('val-muqobala:  =  →  0', 'валь-мукабала:  =  →  0', 'wal-muqabala:  =  →  0'),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "modul ostidagi tenglama",
    'уравнение с модулем',
    'an equation with an absolute value',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Ikkala usul ham tarozining qisqa yozuvi. Al-jabr bu ikkala tomondan ayirish, val-muqobala esa bir xil hadlarni yo'qotish.", 'Оба способа это короткая запись весов. Аль-джабр это вычитание из обеих частей, вал-мукабала это уничтожение одинаковых слагаемых.', 'Both methods are the balance written briefly. Al-jabr is subtracting from both sides, wal-muqabala is cancelling equal terms.'),
    A('mount', "Keyingi darsda modul ostidagi tenglamani ko'ramiz.", 'В следующем уроке разберём уравнение с модулем.', 'In the next lesson we look at an equation with an absolute value.'),
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

export default function Grade7Dars09({
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
    else console.log('[Grade7 Dars09] onFinished', payload)
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
