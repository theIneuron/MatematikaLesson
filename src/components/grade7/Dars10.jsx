// ============================================================================
// 7-sinf, Dars 10. MODUL QATNASHGAN CHIZIQLI TENGLAMA.
// (Линейные уравнения с модулем)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// ASBOB: `DistanceLine` -- masofa o'qi, shu darsda yozildi.
//
// TAYANCH QAYERDAN. Darslikda modul qatnashgan tenglamalar uchun alohida
// paragraf YO'Q, lekin MODULNING TA'RIFI bor -- 6-bet, oltinchi sinfni
// takrorlash: «sonning moduli uning son o'qida 0 sonidan qancha uzoqligini
// bildiradi». Ya'ni modul bu MASOFA. Butun dars shu bitta ta'rifdan chiqadi.
//
// NEGA IKKITA ILDIZ. Buni e'lon qilmaymiz va formula bilan bermaymiz.
// O'quvchi nuqtalarni O'ZI qo'yadi, asbob esa bitta nuqtadan keyin masalani
// YOPMAYDI. Blokning eng qimmat xatosi -- «ikkita o'rniga bitta ildiz» --
// shu tarzda mumkin bo'lmay qoladi, xuddi 8-darsda bir tomonga amal qo'llash
// mumkin bo'lmagani kabi.
//
// UCH HOLAT davom etadi: masofa noldan katta bo'lsa ikkita nuqta, nolga teng
// bo'lsa bitta, manfiy bo'lsa bittasi ham yo'q -- masofa manfiy bo'lmaydi.
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
  DistanceLine,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  SolutionSet,
  StairsReveal,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_10'
const LESSON_TITLE = L('Modul qatnashgan chiziqli tenglama', 'Линейное уравнение с модулем', 'A linear equation with an absolute value')
const LESSON_NO = L('10-dars', 'Урок 10', 'Lesson 10')
const TOTAL = 15

const BLOCK = { label: L('B2-blok', 'Блок Б2', 'Block B2'), from: 7, to: 12, current: 10 }

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

const FOUND = L('Topildi', 'Найдено', 'Found')

const TAGS = {
  Z1: L('ikkinchi ildiz unutildi', 'забыт второй корень', 'the second root was forgotten'),
  Z2: L("markaz yoki masofa notog'ri o'lchandi", 'центр или расстояние отмерены неверно', 'the centre or the distance was measured wrongly'),
  Z3: L('masofa manfiy deb olindi', 'расстояние принято отрицательным', 'a distance was taken as negative'),
  Z4: L("ildiz nol va ildiz yo'q aralashtirildi", 'смешаны корень нуль и отсутствие корней', 'a zero root was mixed up with no roots'),
  Z5: L('modul ichidagi ishora hisobga olinmadi', 'не учтён знак внутри модуля', 'the sign inside the bars was ignored'),
  Z6: L('tekshirish qilinmadi', 'проверка не сделана', 'no check was made'),
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
// EKRAN 1. XUK. Biri bitta ildiz yozdi, ikkinchisi ikkita.
// Tablolarda ILDIZLAR SONI turadi -- savol shuni so'raydi.
// ============================================================
const S1 = {
  eyebrow: L('MODUL VA TENGLAMA', 'МОДУЛЬ И УРАВНЕНИЕ', 'ABSOLUTE VALUE AND EQUATIONS'),
  noBack: true,
  noNotes: true,
  title: L('Bitta ildizmi yoki ikkita', 'Один корень или два', 'One root or two'),
  gate: {
    source: { kind: 'plain', tokens: ['|x|', '=', '5'] },
    rows: [
      { tokens: ['x', '=', '5'], value: '1' },
      { tokens: ['x', '=', '5', ',', '−5'], value: '2' },
    ],
  },
  probe: {
    question: L(
      "Tablolarda topilgan ildizlar SONI turibdi. Aslida nechta ildiz bor?",
      'На табло стоит КОЛИЧЕСТВО найденных корней. Сколько их на самом деле?',
      'The boards show the NUMBER of roots found. How many are there really?',
    ),
    items: [
      {
        id: 'two',
        label: L("Ikkita: besh va minus besh", 'Два: пять и минус пять', 'Two: five and minus five'),
        hint: L(
          "Taxminingiz qabul qilindi. Buni son o'qida o'z qo'lingiz bilan tekshiramiz.",
          'Прогноз принят. Проверим это на числовой оси своими руками.',
          'Your prediction is taken. We will check it on the number line by hand.',
        ),
      },
      {
        id: 'one',
        label: L('Bitta: besh', 'Один: пять', 'One: five'),
        hint: L(
          "Minus beshni ham qo'yib ko'ring: minus beshning moduli ham besh chiqadi.",
          'Подставь и минус пять: модуль минус пяти тоже равен пяти.',
          'Try minus five as well: the absolute value of minus five is also five.',
        ),
      },
      {
        id: 'neg',
        label: L('Bitta: minus besh', 'Один: минус пять', 'One: minus five'),
        hint: L(
          "Minus besh yaraydi, lekin faqat u emas. Beshning o'zi ham yaraydi.",
          'Минус пять подходит, но не только он. Сама пятёрка тоже подходит.',
          'Minus five does fit, but not only it. Five itself fits too.',
        ),
      },
      {
        id: 'many',
        label: L('Cheksiz ko\'p', 'Бесконечно много', 'Infinitely many'),
        hint: L(
          "Uchni qo'yib ko'ring: uchning moduli uch, besh emas. Demak har qanday son yaramaydi.",
          'Подставь тройку: модуль трёх равен трём, а не пяти. Значит подходит не любое число.',
          'Try three: the absolute value of three is three, not five. So not every number fits.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "To'qqizinchi darsda tenglamani ko'chirish bilan yechardik. Bugun tenglamada modul paydo bo'ladi.", 'В девятом уроке мы решали переносом. Сегодня в уравнении появится модуль.', 'In lesson nine we solved by moving terms. Today an absolute value turns up in the equation.'),
    A('mount', "Ikkala o'quvchi ham x ning moduli besh degan tenglamani yechdi.", 'Оба ученика решали уравнение модуль x равен пяти.', 'Both students solved the equation the absolute value of x is five.'),
    A('mount', "Biri bitta ildiz yozdi, ikkinchisi ikkita. Tablolarda ildizlar soni turibdi.", 'Один записал один корень, другой два. На табло количество корней.', 'One wrote one root, the other two. The boards show how many.'),
    A('mount', "Sizningcha nechta. Bu taxmin, uning uchun baho yo'q.", 'Как думаешь, сколько. Это прогноз, оценки за него нет.', 'How many do you think. This is a prediction, it is not graded.'),
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
// EKRAN 2. TAYANCH. KVOTA EKRANI (§4.2). Modulning ta'rifi -- MASOFA.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L('Modul nima edi', 'Что такое модуль', 'What the absolute value was'),
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      prompt: '|−7|',
      ok: L("Modul masofani bildiradi, masofa esa manfiy bo'lmaydi.", 'Модуль это расстояние, а расстояние не бывает отрицательным.', 'The absolute value is a distance, and a distance is never negative.'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '−7', tag: 'Z3', hint: L("Modul masofa. Noldan minus yettigacha yetti qadam, va bu son manfiy emas.", 'Модуль это расстояние. От нуля до минус семи семь шагов, и это число не отрицательное.', 'The absolute value is a distance. From zero to minus seven is seven steps, and that number is not negative.') },
        { id: 'c', label: '0', tag: 'Z3', hint: L("Nol faqat nolning moduli. Minus yetti esa noldan uzoqda.", 'Нуль это модуль только самого нуля. А минус семь стоит далеко от нуля.', 'Zero is the absolute value of zero only. Minus seven stands far from zero.') },
        { id: 'd', label: '14', tag: 'Z3', hint: L("14 bu ikki karra yetti. Masofa esa yetti.", '14 это дважды семь. А расстояние семь.', '14 is twice seven. The distance is seven.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Qaysi son son o'qida noldan uzoqroq: −9 yoki 6?", 'Какое число дальше от нуля на оси: −9 или 6?', 'Which number is further from zero on the line: −9 or 6?'),
      ok: L("Uzoqlik ishoraga bog'liq emas, faqat masofaga.", 'Дальность не зависит от знака, только от расстояния.', 'Being further does not depend on the sign, only on the distance.'),
      items: [
        { id: 'a', correct: true, label: '−9' },
        { id: 'b', label: '6', tag: 'Z3', hint: L("Oltigacha olti qadam, minus to'qqizgacha to'qqiz qadam. To'qqiz ko'proq.", 'До шестёрки шесть шагов, до минус девяти девять. Девять больше.', 'Six is six steps away, minus nine is nine steps away. Nine is more.') },
        { id: 'c', tag: 'Z3', label: L('Ular teng uzoqlikda', 'Они одинаково далеко', 'They are equally far'), hint: L("Teng uzoqlikda bo'lishi uchun modullar teng bo'lishi kerak edi. To'qqiz va olti esa boshqa.", 'Чтобы быть одинаково далеко, модули должны совпасть. А девять и шесть разные.', 'To be equally far the absolute values would have to match. Nine and six differ.') },
        { id: 'd', tag: 'Z3', label: L("Manfiy son har doim yaqinroq", 'Отрицательное всегда ближе', 'A negative is always closer'), hint: L("Ishora yo'nalishni bildiradi, uzoqlikni emas.", 'Знак говорит о направлении, а не о дальности.', 'The sign tells the direction, not the distance.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("x ayirish 3 ifoda qaysi sonda nolga aylanadi?", 'При каком числе выражение x − 3 обращается в нуль?', 'For which number does the expression x − 3 become zero?'),
      ok: L("Bu son bugun markaz bo'lib xizmat qiladi.", 'Это число сегодня послужит центром.', 'That number will serve as the centre today.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '−3', tag: 'Z2', hint: L("Minus uchni qo'ying: minus uch ayirish uch bu minus olti, nol emas.", 'Подставь минус три: минус три минус три это минус шесть, а не нуль.', 'Put in minus three: minus three minus three is minus six, not zero.') },
        { id: 'c', label: '0', tag: 'Z2', hint: L("Nolni qo'ying: nol ayirish uch bu minus uch.", 'Подставь нуль: нуль минус три это минус три.', 'Put in zero: zero minus three is minus three.') },
        { id: 'd', label: '1', tag: 'Z2', hint: L("Birni qo'ying: bir ayirish uch bu minus ikki.", 'Подставь единицу: один минус три это минус два.', 'Put in one: one minus three is minus two.') },
      ],
    },
  ],
  audio: [
    A('mount', "Modul oltinchi sinfdan tanish. Uchta savol bilan eslaymiz.", 'Модуль знаком с шестого класса. Вспомним его тремя вопросами.', 'The absolute value is familiar from grade six. Three questions to recall it.'),
    A('1', "Ikkinchisi.", 'Второе.', 'Second.'),
    A('2', "Uchinchisi. Bu savol keyinroq kerak bo'ladi.", 'Третье. Этот вопрос понадобится позже.', 'Third. This one will be needed later.'),
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
// EKRAN 3. TUSHUNTIRISH 1. MASOFA O'QI. Ikkinchi ildiz E'LON QILINMAYDI --
// asbob bitta nuqtadan keyin yopilmaydi, o'quvchi uni O'ZI topadi.
// ============================================================
const S3 = {
  eyebrow: L('MASOFA', 'РАССТОЯНИЕ', 'DISTANCE'),
  title: L("Noldan besh qadam -- qayerga?", 'Пять шагов от нуля — куда?', 'Five steps from zero — where to?'),
  expr: '|x| = 5',
  ask: L(
    "Noldan besh masofada turgan HAMMA nuqtani bosing.",
    'Нажми на ВСЕ точки, стоящие на расстоянии пять от нуля.',
    'Tap EVERY point standing at a distance of five from zero.',
  ),
  line: { center: 0, dist: 5, from: -8, to: 8 },
  done: L(
    "Ikkita nuqta: besh va minus besh. Ikkalasi ham noldan bir xil uzoqlikda.",
    'Две точки: пять и минус пять. Обе одинаково далеко от нуля.',
    'Two points: five and minus five. Both are equally far from zero.',
  ),
  reward: {
    title: L("Ikkita ildiz -- bu ta'rifning natijasi", 'Два корня это следствие определения', 'Two roots follow from the definition'),
    text: L(
      "Modul bu masofa. Bir xil masofada turgan nuqta esa har doim ikkita: biri o'ngda, biri chapda. Shuning uchun ildiz ham ikkita.",
      'Модуль это расстояние. А точек на одном расстоянии всегда две: одна справа, другая слева. Поэтому и корней два.',
      'The absolute value is a distance. And there are always two points at the same distance: one right, one left. Hence two roots.',
    ),
  },
  audio: [
    A('mount', "Mana son o'qi. Qizil nuqta bu nol, ya'ni sanoq boshlanadigan joy.", 'Вот числовая ось. Красная точка это нуль, начало отсчёта.', 'Here is the number line. The red dot is zero, where counting starts.'),
    A('mount', "Modul masofa degani. Noldan besh masofada turgan nuqtalarni toping.", 'Модуль это расстояние. Найди точки на расстоянии пять от нуля.', 'The absolute value is a distance. Find the points at a distance of five from zero.'),
    A('hit1', "Bittasi topildi. Yana bormi?", 'Одна найдена. Есть ли ещё?', 'One is found. Is there another?'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S3.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      <div className="g7-eqb-lone"><Fx>{S3.expr}</Fx></div>
      <Hint>{t(S3.ask)}</Hint>
      <DistanceLine
        audio={audio}
        center={S3.line.center}
        dist={S3.line.dist}
        from={S3.line.from}
        to={S3.line.to}
        label={FOUND}
        tag="Z2"
        done={S3.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2. UCH HOLAT davom etadi. Masofa nolga teng --
// bitta nuqta. Masofa manfiy -- bittasi ham yo'q. KVOTA EKRANI.
// ============================================================
const S4 = {
  eyebrow: L('UCH HOLAT', 'ТРИ СЛУЧАЯ', 'THREE CASES'),
  title: L("Modul manfiy songa teng bo'la oladimi", 'Может ли модуль равняться отрицательному числу', 'Can an absolute value equal a negative number'),
  expr: '|x| = −3',
  probe: {
    question: L(
      "x ning moduli minus uchga teng. Nechta son buni to'g'ri qiladi?",
      'Модуль x равен минус трём. Сколько чисел делают это верным?',
      'The absolute value of x is minus three. How many numbers make that true?',
    ),
    items: [
      { id: 'none', correct: true, label: L("Bittasi ham yo'q", 'Ни одного', 'None') },
      {
        id: 'two', tag: 'Z3',
        label: L('Ikkita: uch va minus uch', 'Два: три и минус три', 'Two: three and minus three'),
        hint: L("Ikkalasining ham moduli UCH chiqadi, minus uch emas. Masofa manfiy bo'lmaydi.", 'У обоих модуль равен ТРЁМ, а не минус трём. Расстояние не бывает отрицательным.', 'Both have an absolute value of THREE, not minus three. A distance is never negative.'),
      },
      {
        id: 'one', tag: 'Z3',
        label: L('Bitta: minus uch', 'Одно: минус три', 'One: minus three'),
        hint: L("Minus uchning moduli uch, minus uch emas. O'qda minus uch masofa yo'q.", 'Модуль минус трёх равен трём, а не минус трём. На оси нет расстояния минус три.', 'The absolute value of minus three is three, not minus three. There is no distance of minus three on the line.'),
      },
      {
        id: 'zero', tag: 'Z4',
        label: L('Bitta: nol', 'Одно: нуль', 'One: zero'),
        hint: L("Nolning moduli nol, minus uch emas. Ildiz nol bo'lish va ildiz yo'q bo'lish boshqa narsa.", 'Модуль нуля равен нулю, а не минус трём. Корень нуль и отсутствие корней это разное.', 'The absolute value of zero is zero, not minus three. A zero root and no roots are different things.'),
      },
    ],
  },
  okText: L(
    "Masofa manfiy bo'lmaydi, shuning uchun bunday nuqta yo'q.",
    'Расстояние не бывает отрицательным, поэтому такой точки нет.',
    'A distance is never negative, so no such point exists.',
  ),
  audio: [
    A('mount', "Endi o'ng tomonda manfiy son turibdi. Avval javob bering.", 'Теперь справа стоит отрицательное число. Сначала ответь.', 'Now there is a negative number on the right. Answer first.'),
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
      <div className="g7-eqb-lone"><Fx>{S4.expr}</Fx></div>
      <Probe
        data={{ ...S4.probe, ok: S4.okText }}
        cols={2}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      <SolutionSet kind={done ? 'none' : null} caption={SET_CAP} />
    </Frame>
  )
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3. MARKAZ SILJIYDI. Modul ichida x ayirish uch
// tursa, masofa NOLDAN emas, UCHDAN o'lchanadi.
// ============================================================
const S5 = {
  eyebrow: L('MARKAZ SILJIYDI', 'ЦЕНТР СДВИГАЕТСЯ', 'THE CENTRE SHIFTS'),
  title: L('Endi masofa uchdan o\'lchanadi', 'Теперь расстояние меряют от тройки', 'Now the distance is measured from three'),
  expr: '|x − 3| = 4',
  ask: L(
    "Uchdan to'rt masofada turgan hamma nuqtani bosing.",
    'Нажми все точки на расстоянии четыре от тройки.',
    'Tap every point at a distance of four from three.',
  ),
  line: { center: 3, dist: 4, from: -3, to: 9 },
  done: L(
    "Yetti va minus bir. Ikkalasi ham uchdan to'rt qadam narida.",
    'Семь и минус один. Оба в четырёх шагах от тройки.',
    'Seven and minus one. Both are four steps from three.',
  ),
  reward: {
    title: L("Markazni modul ichi aytadi", 'Центр подсказывает то, что внутри модуля', 'What is inside the bars gives the centre'),
    text: L(
      "Markaz bu modul ichidagi ifoda nolga aylanadigan son. x ayirish 3 nolga aylanadi, qachonki x uchga teng bo'lsa. Shuning uchun markaz uchda.",
      'Центр это число, при котором выражение внутри модуля обращается в нуль. x − 3 равно нулю при x равном трём. Поэтому центр в тройке.',
      'The centre is the number that makes the expression inside the bars zero. x − 3 is zero when x is three. So the centre sits at three.',
    ),
  },
  audio: [
    A('mount', "Modul ichida endi x ning o'zi emas, x ayirish uch turibdi.", 'Внутри модуля теперь не сам x, а x минус три.', 'Inside the bars there is now not the x itself but x minus three.'),
    A('mount', "Diqqat qiling: qizil nuqta joyidan siljidi. Endi u uchda.", 'Обрати внимание: красная точка сместилась. Теперь она на тройке.', 'Notice the red dot has moved. It is on the three now.'),
    A('hit1', "Bittasi topildi. Ikkinchisi qaysi tomonda?", 'Одна найдена. С какой стороны вторая?', 'One is found. Which side is the other on?'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S5.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <div className="g7-eqb-lone"><Fx>{S5.expr}</Fx></div>
      <Hint>{t(S5.ask)}</Hint>
      <DistanceLine
        audio={audio}
        center={S5.line.center}
        dist={S5.line.dist}
        from={S5.line.from}
        to={S5.line.to}
        label={FOUND}
        tag="Z2"
        done={S5.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4. O'ZINGIZ, va bu safar modul ichida QO'SHUV.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Modul ichida qo'shuv bo'lsa", 'Если внутри модуля плюс', 'When there is a plus inside the bars'),
  expr: '|x + 2| = 6',
  ask: L(
    "Avval markazni toping, keyin nuqtalarni bosing.",
    'Сначала найди центр, потом нажимай точки.',
    'Find the centre first, then tap the points.',
  ),
  line: { center: -2, dist: 6, from: -9, to: 5 },
  done: L(
    "To'rt va minus sakkiz. Markaz esa minus ikkida edi.",
    'Четыре и минус восемь. А центр был в минус двойке.',
    'Four and minus eight. And the centre was at minus two.',
  ),
  reward: {
    title: L("Qo'shuv markazni CHAPGA suradi", 'Плюс сдвигает центр ВЛЕВО', 'A plus shifts the centre LEFT'),
    text: L(
      "x qo'shuv 2 nolga aylanadi, qachonki x minus ikkiga teng bo'lsa. Modul ichida qo'shuv tursa markaz manfiy tomonga, ayirish tursa musbat tomonga suriladi.",
      'x + 2 равно нулю при x равном минус двум. Если внутри модуля плюс, центр уходит в отрицательную сторону, если минус — в положительную.',
      'x + 2 is zero when x is minus two. A plus inside the bars sends the centre to the negative side, a minus sends it to the positive side.',
    ),
  },
  audio: [
    A('mount', "Endi modul ichida qo'shuv. Markaz qayerda bo'lishini o'zingiz o'ylang.", 'Теперь внутри модуля плюс. Где будет центр, подумай сам.', 'Now there is a plus inside the bars. Work out where the centre is.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S6.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S6} screen={screen} audio={audio} solved={done} {...rest}>
      <div className="g7-eqb-lone"><Fx>{S6.expr}</Fx></div>
      <Hint>{t(S6.ask)}</Hint>
      <DistanceLine
        audio={audio}
        center={S6.line.center}
        dist={S6.line.dist}
        from={S6.line.from}
        to={S6.line.to}
        label={FOUND}
        tag="Z5"
        done={S6.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 7. O'QDAN YOZUVGA. Bir masala IKKITA oddiy tenglamaga bo'linadi --
// bu 8 va 9-darslardagi tanish tenglamalar.
// ============================================================
const S7 = {
  eyebrow: L('YOZUVGA O\'TAMIZ', 'ПЕРЕХОД К ЗАПИСИ', 'FROM THE LINE TO THE PAGE'),
  title: L("O'q har doim ham qo'l ostida bo'lmaydi", 'Оси не всегда есть под рукой', 'A number line is not always at hand'),
  // Shablonda SO'Z YO'Q (u tarjima qilinmaydi) va manba yozuvi ham yo'q
  // (390 px da kesiladi). Ikkalasi ham topshiriqda -- proza ko'chadi.
  template: ['x − 3 = ', { slot: 0 }],
  parts: [
    { id: 'p_m4', label: '−4' },
    { id: 'p_4', label: '4' },
    { id: 'p_0', label: '0' },
    { id: 'p_3', label: '3' },
  ],
  answer: ['p_m4'],
  prompt: L(
    "Beshinchi ekrandagi tenglamaning birinchi holati: x ayirish 3 teng 4. Ikkinchi holatni to'ldiring.",
    'Первый случай уравнения с пятого экрана такой: x − 3 = 4. Допиши второй случай.',
    'The first case of the equation from screen five is x − 3 = 4. Complete the second case.',
  ),
  checkNote: L(
    "x ayirish 3 teng 4 dan x teng 7, x ayirish 3 teng minus 4 dan x teng minus 1",
    'Из x − 3 = 4 выходит x = 7, из x − 3 = −4 выходит x = −1',
    'From x − 3 = 4 comes x = 7, from x − 3 = −4 comes x = −1',
  ),
  wrongs: [
    { key: 'p_4', tag: 'Z1', hint: L("Ikkala tenglama ham bir xil bo'lib qoladi, va ikkinchi ildiz yo'qoladi. Ular ISHORA bilan farq qiladi.", 'Оба уравнения станут одинаковыми, и второй корень пропадёт. Они отличаются ЗНАКОМ.', 'Both equations would be the same and the second root would vanish. They differ by the SIGN.') },
    { key: '*', tag: 'Z1', hint: L("Modul ichidagi ifoda to'rtga ham, minus to'rtga ham teng bo'lishi mumkin: ikkala holatda ham masofa to'rt.", 'Выражение под модулем может равняться и четырём, и минус четырём: в обоих случаях расстояние четыре.', 'The expression inside can equal four or minus four: either way the distance is four.') },
  ],
  reward: {
    title: L('Ikkita tanish tenglama', 'Два знакомых уравнения', 'Two familiar equations'),
    text: L(
      "Modulli tenglama yangi usul talab qilmaydi. U ikkita oddiy chiziqli tenglamaga bo'linadi, ularni esa sakkizinchi va to'qqizinchi darslarda yechgan edik.",
      'Уравнение с модулем не требует нового способа. Оно распадается на два обычных линейных, а их мы решали в восьмом и девятом уроках.',
      'An equation with an absolute value needs no new method. It splits into two ordinary linear ones, and those we solved in lessons eight and nine.',
    ),
  },
  audio: [
    A('mount', "O'q yaxshi, lekin u har doim ham qo'l ostida bo'lmaydi. Xuddi shu narsani yozuv bilan ham qilsa bo'ladi.", 'Ось хороша, но она не всегда под рукой. То же самое можно сделать записью.', 'The line is good, but it is not always at hand. The same thing can be done in writing.'),
    A('mount', "Modul ichidagi ifoda to'rtga teng bo'lishi mumkin. Yana nimaga teng bo'lishi mumkin?", 'Выражение внутри модуля может равняться четырём. Чему ещё оно может равняться?', 'The expression inside can equal four. What else can it equal?'),
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
      <SlotFill
        audio={audio}
        template={S7.template}
        parts={S7.parts}
        answer={S7.answer}
        prompt={S7.prompt}
        checkNote={S7.checkNote}
        wrongs={S7.wrongs}
        wide
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
    { id: 'f1', label: L('modul bu masofa, u manfiy bo\'lmaydi', 'модуль это расстояние, оно не бывает отрицательным', 'the absolute value is a distance and is never negative') },
    { id: 'f2', label: L("markaz -- modul ichi nol bo'ladigan son", 'центр это где внутренность равна нулю', 'the centre is where the inside is zero') },
    { id: 'f3', label: L("shu masofada markazdan ikkita nuqta bor", 'на этом расстоянии от центра две точки', 'two points lie at that distance from the centre') },
    { id: 'f4', label: L('demak ikkita oddiy tenglama yechiladi', 'значит решают два обычных уравнения', 'so two ordinary equations get solved') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval modul nimaligi, keyin markaz, keyin nuqtalar, oxirida yozuv.",
    'Порядок нарушен. Сначала что такое модуль, потом центр, потом точки, в конце запись.',
    'The order is off. First what the absolute value is, then the centre, then the points, and the notation last.',
  ),
  lawChips: [
    { label: '| |', tone: 'par' },
    { label: '0', tone: 's1' },
    { label: '← →', tone: 's2' },
    { label: '2', tone: 'off' },
  ],
  lawSweep: L(
    'masofa, markaz, ikki tomon, ikki ildiz',
    'расстояние, центр, две стороны, два корня',
    'distance, centre, two sides, two roots',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Sonning moduli uning noldan uzoqligi. Shuning uchun modul manfiy bo'lmaydi.",
        'Модуль числа это его расстояние от нуля. Поэтому модуль не бывает отрицательным.',
        'The absolute value is the distance from zero. So it is never negative.',
      ),
      L(
        "Ildizlar soni uch xil: masofa noldan katta bo'lsa ikkita, nolga teng bo'lsa bitta, manfiy bo'lsa yo'q.",
        'Корней бывает три вида: расстояние больше нуля — два, равно нулю — один, отрицательное — нет.',
        'Three kinds of root count: distance above zero gives two, zero gives one, negative gives none.',
      ),
    ],
  },
  hookCap: L(
    "Ikkita ildiz e'lon qilinmaydi, u masofadan kelib chiqadi",
    'Два корня не объявляют, они следуют из расстояния',
    'Two roots are not announced, they follow from the distance',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("markaz modul ichidan topiladi", 'центр находят по внутренности модуля', 'the centre comes from the inside'),
    L("nuqta o'ngda ham, chapda ham bor", 'точка есть и справа, и слева', 'there is a point on each side'),
    L("manfiy masofa bo'lmaydi", 'отрицательного расстояния нет', 'there is no negative distance'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani so'z bilan yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило словами.', 'We have seen all the cases. Now let us put the rule into words.'),
    A('ok', "To'g'ri. Bu tartib har qanday modulli tenglamada ishlaydi.", 'Верно. Этот порядок работает в любом уравнении с модулем.', 'Correct. This order works for any equation with an absolute value.'),
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
// EKRAN 9. MASHQ 1. Uchta tenglama.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Har safar bir xil savol: markaz qayerda va masofa qancha.",
      'Каждый раз один и тот же вопрос: где центр и какое расстояние.',
      'The same question every time: where is the centre and what is the distance.',
    ),
  },
  rounds: [
    {
      template: ['|x| = 9,     x = 9 ,     x = ', { slot: 0 }],
      parts: [{ id: 'p9', label: '−9' }, { id: 'p0', label: '0' }, { id: 'p18', label: '18' }, { id: 'p9p', label: '9' }],
      answer: ['p9'],
      prompt: L("Markaz nolda, masofa to'qqiz.", 'Центр в нуле, расстояние девять.', 'The centre is at zero, the distance is nine.'),
      checkNote: L("Noldan to'qqiz qadam o'ngga va to'qqiz qadam chapga", 'Девять шагов от нуля вправо и девять влево', 'Nine steps right from zero and nine steps left'),
      wrongs: [
        { key: 'p9p', tag: 'Z1', hint: L("Bu birinchi ildizning o'zi. Ikkinchisi qarama-qarshi tomonda.", 'Это тот же первый корень. Второй с противоположной стороны.', 'That is the first root again. The second is on the opposite side.') },
        { key: '*', tag: 'Z1', hint: L("Chap tomonda ham to'qqiz qadam narida nuqta bor.", 'Слева тоже есть точка в девяти шагах.', 'There is a point nine steps away on the left too.') },
      ],
    },
    {
      template: ['|x − 5| = 2,     x = 7 ,     x = ', { slot: 0 }],
      parts: [{ id: 'q3', label: '3' }, { id: 'q2', label: '−2' }, { id: 'q7', label: '−7' }, { id: 'q10', label: '10' }],
      answer: ['q3'],
      prompt: L("Markaz beshda, masofa ikki.", 'Центр в пятёрке, расстояние два.', 'The centre is at five, the distance is two.'),
      checkNote: L("Beshdan ikki qadam o'ngga yetti, ikki qadam chapga uch", 'От пятёрки два шага вправо это семь, два влево это три', 'Two steps right from five is seven, two steps left is three'),
      wrongs: [
        { key: 'q2', tag: 'Z2', hint: L("Minus ikki bu noldan ikki qadam chapga. Markaz esa beshda, nolda emas.", 'Минус два это два шага влево от нуля. А центр в пятёрке, не в нуле.', 'Minus two is two steps left of zero. But the centre is at five, not zero.') },
        { key: '*', tag: 'Z2', hint: L("Beshdan chapga ikki qadam sanang.", 'Отсчитай два шага влево от пятёрки.', 'Count two steps left from five.') },
      ],
    },
    {
      template: ['|x| = 0     →     ', { slot: 0 }],
      parts: [{ id: 'w1', label: '1' }, { id: 'w2', label: '2' }, { id: 'w0', label: '0' }, { id: 'wm', label: '∞' }],
      answer: ['w1'],
      prompt: L(
        "Diqqat: masofa nolga teng. Nechta ildiz bo'ladi?",
        'Внимание: расстояние равно нулю. Сколько будет корней?',
        'Careful: the distance is zero. How many roots will there be?',
      ),
      checkNote: L("Noldan nol qadam narida bitta nuqta bor -- nolning o'zi", 'В нуле шагов от нуля есть одна точка — сам нуль', 'Zero steps from zero there is one point — zero itself'),
      wrongs: [
        { key: 'w2', tag: 'Z4', hint: L("O'ngga nol qadam va chapga nol qadam bir xil joyga olib keladi.", 'Нуль шагов вправо и нуль шагов влево приводят в одно место.', 'Zero steps right and zero steps left land in the same place.') },
        { key: 'w0', tag: 'Z4', hint: L("Nolning o'zi yaraydi: nolning moduli nol. Ildiz bor.", 'Сам нуль подходит: модуль нуля равен нулю. Корень есть.', 'Zero itself fits: the absolute value of zero is zero. There is a root.') },
        { key: '*', tag: 'Z4', hint: L("Nol qadamda nechta nuqta bo'lishi mumkin.", 'Сколько точек может быть в нуле шагов.', 'How many points can there be at zero steps.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Uchta tenglama.", 'Правило готово. Три уравнения.', 'The rule is ready. Three equations.'),
    A('r1', "Ikkinchisida markaz siljigan.", 'Во втором центр сдвинут.', 'In the second the centre is shifted.'),
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
  const LABELS = ['|x| = 9   →   9 , −9', '|x − 5| = 2   →   7 , 3', '|x| = 0   →   1']
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan: yana o'q, markaz manfiy.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L("Markaz manfiy tomonda", 'Центр в отрицательной стороне', 'The centre on the negative side'),
  expr: '|x + 1| = 5',
  ask: L(
    "Markazni o'zingiz aniqlang va nuqtalarni bosing.",
    'Определи центр сам и нажми точки.',
    'Work out the centre yourself and tap the points.',
  ),
  line: { center: -1, dist: 5, from: -8, to: 6 },
  done: L(
    "To'rt va minus olti. Markaz minus birda edi.",
    'Четыре и минус шесть. Центр был в минус единице.',
    'Four and minus six. The centre was at minus one.',
  ),
  reward: {
    title: L('Ikkala ildiz ham markazdan teng uzoqlikda', 'Оба корня одинаково далеко от центра', 'Both roots are equally far from the centre'),
    text: L(
      "Markazdan o'nggacha ham besh, chapgacha ham besh. Shu sababli ildizlar har doim markazga nisbatan simmetrik turadi.",
      'От центра вправо пять и влево пять. Поэтому корни всегда стоят симметрично относительно центра.',
      'Five to the right of the centre and five to the left. That is why the roots always sit symmetrically about the centre.',
    ),
  },
  audio: [
    A('mount', "Yana o'q, lekin bu safar markazni o'zingiz topasiz.", 'Снова ось, но центр на этот раз находишь ты.', 'The line again, but this time you find the centre.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S10.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S10} screen={screen} audio={audio} solved={done} {...rest}>
      <div className="g7-eqb-lone"><Fx>{S10.expr}</Fx></div>
      <Hint>{t(S10.ask)}</Hint>
      <DistanceLine
        audio={audio}
        center={S10.line.center}
        dist={S10.line.dist}
        from={S10.line.from}
        to={S10.line.to}
        label={FOUND}
        tag="Z2"
        done={S10.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 11. MASHQ 3. ASBOBSIZ (§4.2, §8.1).
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L("O'qsiz", 'Без оси', 'Without the line'),
  template: ['|x − 4| = 3,     x = ', { slot: 0 }, ' ,     x = ', { slot: 1 }],
  parts: [
    { id: 'p7', label: '7' },
    { id: 'p1', label: '1' },
    { id: 'p3', label: '−3' },
    { id: 'p12', label: '12' },
  ],
  answer: ['p7', 'p1'],
  prompt: L(
    "Na o'q, na yordam bo'ladi. Markazni ham, ikkala ildizni ham o'zingiz topasiz.",
    'Ни оси, ни подсказок не будет. И центр, и оба корня находишь сам.',
    'Neither the line nor any hints. You find the centre and both roots yourself.',
  ),
  checkNote: L(
    "To'rtdan uch qadam o'ngga yetti, uch qadam chapga bir. Ikkalasining ham to'rtgacha masofasi uch",
    'От четвёрки три шага вправо это семь, три влево это один. У обоих расстояние до четвёрки три',
    'Three steps right from four is seven, three left is one. Both are three away from four',
  ),
  wrongs: [
    { key: 'p7|p3', tag: 'Z2', hint: L("Minus uch bu noldan uch qadam chapga. Markaz esa to'rtda.", 'Минус три это три шага влево от нуля. А центр в четвёрке.', 'Minus three is three steps left of zero. But the centre is at four.') },
    { key: '*', tag: 'Z2', hint: L("Markaz to'rtda. Undan o'ngga va chapga uch qadam sanang.", 'Центр в четвёрке. Отсчитай от него три шага вправо и три влево.', 'The centre is at four. Count three steps right and three left from it.') },
  ],
  audio: [
    A('mount', "Endi o'qsiz. Markazni ham, ikkala ildizni ham o'zingiz topasiz.", 'Теперь без оси. И центр, и оба корня находишь сам.', 'Now without the line. You find the centre and both roots yourself.'),
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
// EKRAN 12. TUZOQ (§8.2). Bitta ildiz yozib, ishni tugatgan.
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
    { id: 'r1', text: '|x + 6| = 2' },
    { id: 'r2', text: 'x + 6 = 2' },
    { id: 'r3', text: 'x = −4' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich tenglama, unda hali hech nima qilinmagan.", 'Это исходное уравнение, в нём ещё ничего не сделано.', 'That is the original equation, nothing has been done to it yet.'),
    r3: L("Bu qator ikkinchisidan to'g'ri kelib chiqadi: oltini ko'chirsak minus to'rt qoladi. Xato yuqoriroqda.", 'Эта строка верно следует из второй: перенесли шестёрку, вышло минус четыре. Ошибка выше.', 'This line follows correctly from the second: move the six and you get minus four. The mistake is higher up.'),
  },
  tags: { r1: 'Z1', r3: 'Z1' },
  proofFill: {
    template: ['x + 6 = ', { slot: 0 }, ',     x = ', { slot: 1 }],
    parts: [{ id: 'v_m2', label: '−2' }, { id: 'v_m8', label: '−8' }, { id: 'v2', label: '2' }, { id: 'v8', label: '8' }],
    answer: ['v_m2', 'v_m8'],
    prompt: L(
      "Ikkinchi tenglamani yozing va uni yeching.",
      'Запиши второе уравнение и реши его.',
      'Write the second equation and solve it.',
    ),
    checkNote: L("Minus sakkiz qo'shuv olti bu minus ikki, uning moduli esa ikki. Ildiz ikkita: minus to'rt va minus sakkiz", 'Минус восемь плюс шесть это минус два, его модуль два. Корней два: минус четыре и минус восемь', 'Minus eight plus six is minus two, whose absolute value is two. Two roots: minus four and minus eight'),
    wrongs: [
      { key: 'v2|v8', tag: 'Z1', hint: L("Birinchi tenglamada ikki bor edi. Ikkinchisi undan ISHORA bilan farq qiladi.", 'В первом уравнении двойка уже была. Второе отличается от него ЗНАКОМ.', 'The two was already in the first equation. The second differs from it by the SIGN.') },
      { key: '*', tag: 'Z1', hint: L("Modul ichidagi ifoda minus ikkiga ham teng bo'lishi mumkin, chunki masofa baribir ikki.", 'Выражение внутри модуля может равняться и минус двум, расстояние всё равно два.', 'The expression inside can equal minus two as well, the distance is still two.') },
    ],
  },
  audio: [
    A('mount', "O'quvchi bitta ildiz topib, ishni tugatdi. Aslida ildiz ikkita.", 'Ученик нашёл один корень и на этом закончил. На самом деле корня два.', 'A student found one root and stopped there. In fact there are two.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. Ikkinchi tenglama umuman yozilmagan. Endi uni yozing.", 'Нашёл. Второе уравнение вообще не записано. Теперь запиши его.', 'You found it. The second equation was never written. Now write it.'),
    A('done', "Ikkinchi ildiz minus sakkiz ekan.", 'Второй корень оказался минус восемь.', 'The second root is minus eight.'),
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
// EKRAN 13. KO'CHIRISH. Vaziyatdan modulli tenglamaga.
// ============================================================
const S13 = {
  eyebrow: L("TESKARI YO'L", 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L('Vaziyatdan tenglamaga', 'Из ситуации в уравнение', 'From a situation to an equation'),
  rounds: [
    {
      template: ['|x − 12| = ', { slot: 0 }],
      parts: [{ id: 'p3', label: '3' }, { id: 'p12', label: '12' }, { id: 'p15', label: '15' }, { id: 'p9', label: '9' }],
      answer: ['p3'],
      prompt: L(
        "Avtobus bekati o'n ikkinchi uyning oldida. Sardor uyi bekatdan uch uy narida. Tenglamani yig'ing.",
        'Автобусная остановка у дома номер двенадцать. Дом Сардора в трёх домах от остановки. Собери уравнение.',
        'The bus stop is at house number twelve. Sardor lives three houses from the stop. Build the equation.',
      ),
      checkNote: L("x -- Sardor uyining raqami, uch esa uygacha bo'lgan masofa", 'x это номер дома Сардора, а три это расстояние до дома', 'x is the number of Sardor house, and three is the distance to it'),
      wrongs: [
        { key: 'p12', tag: 'Z2', hint: L("O'n ikki bu bekatning raqami, u modul ichida turibdi. O'ng tomonga masofa yoziladi.", 'Двенадцать это номер остановки, он стоит внутри модуля. Справа пишут расстояние.', 'Twelve is the stop number and it stands inside the bars. The distance goes on the right.') },
        { key: '*', tag: 'Z2', hint: L("O'ng tomonda masofa turadi.", 'Справа стоит расстояние.', 'The distance goes on the right.') },
      ],
    },
    {
      template: ['x = ', { slot: 0 }, ' ,     x = ', { slot: 1 }],
      parts: [{ id: 'q15', label: '15' }, { id: 'q9', label: '9' }, { id: 'q3', label: '3' }, { id: 'q36', label: '36' }],
      answer: ['q15', 'q9'],
      prompt: L(
        "Sardorning uyi qaysi raqamli bo'lishi mumkin?",
        'Какой номер может быть у дома Сардора?',
        'What number can Sardor house have?',
      ),
      checkNote: L("Ikkita javob: bekatdan uch uy oldinda va uch uy orqada", 'Два ответа: три дома вперёд от остановки и три назад', 'Two answers: three houses past the stop and three before it'),
      wrongs: [
        { key: 'q15|q3', tag: 'Z2', hint: L("Uch bu masofa, uy raqami emas. O'n ikkidan uch uy orqaga sanang.", 'Три это расстояние, а не номер дома. Отсчитай три дома назад от двенадцати.', 'Three is the distance, not a house number. Count three houses back from twelve.') },
        { key: '*', tag: 'Z1', hint: L("Bekatning ikkala tomonida ham uy bor.", 'Дом есть по обе стороны от остановки.', 'There is a house on each side of the stop.') },
      ],
    },
  ],
  reward: {
    title: L('Modul hayotda ham masofa', 'Модуль и в жизни расстояние', 'Outside maths too the absolute value is a distance'),
    text: L(
      "«Bekatdan uch uy narida» degan gap yo'nalishni aytmaydi, faqat uzoqlikni aytadi. Shuning uchun javob ikkita bo'ladi.",
      'Фраза «в трёх домах от остановки» не говорит о направлении, только о дальности. Поэтому и ответов два.',
      'The phrase three houses from the stop says nothing about direction, only about distance. That is why there are two answers.',
    ),
  },
  audio: [
    A('mount', "Butun dars tenglama tayyor edi. Endi uni o'zingiz yozasiz.", 'Весь урок уравнение было готовым. Теперь ты запишешь его сам.', 'All lesson the equation was given. Now you write it yourself.'),
    A('r1', "Tenglama tayyor. Endi ikkala javobni ham toping.", 'Уравнение готово. Теперь найди оба ответа.', 'The equation is ready. Now find both answers.'),
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
  const LABELS = ['|x − 12| = 3', 'x = 15 , 9']
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
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      wrap: true,
      question: null,
      prompt: L("|x| = 8 tenglamaning ildizlari?", 'Корни уравнения |x| = 8?', 'The roots of |x| = 8?'),
      ok: L("Noldan sakkiz qadam o'ngga va sakkiz qadam chapga.", 'Восемь шагов от нуля вправо и восемь влево.', 'Eight steps right from zero and eight steps left.'),
      items: [
        { id: 'a', correct: true, label: L('8 va −8', '8 и −8', '8 and −8') },
        { id: 'b', label: L('Faqat 8', 'Только 8', 'Only 8'), tag: 'Z1', hint: L("Minus sakkizning moduli ham sakkiz. Chap tomonni unutmang.", 'Модуль минус восьми тоже восемь. Не забывай левую сторону.', 'The absolute value of minus eight is eight too. Do not forget the left side.') },
        { id: 'c', label: L('Faqat −8', 'Только −8', 'Only −8'), tag: 'Z1', hint: L("Sakkizning o'zi ham yaraydi.", 'Сама восьмёрка тоже подходит.', 'Eight itself fits as well.') },
        { id: 'd', label: L('0 va 8', '0 и 8', '0 and 8'), tag: 'Z4', hint: L("Nolning moduli nol, sakkiz emas.", 'Модуль нуля равен нулю, а не восьми.', 'The absolute value of zero is zero, not eight.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("|x − 6| = 2 tenglamada markaz qayerda?", 'Где центр в уравнении |x − 6| = 2?', 'Where is the centre in |x − 6| = 2?'),
      ok: L("Markaz -- modul ichi nolga aylanadigan son.", 'Центр это число, при котором внутренность обращается в нуль.', 'The centre is where the inside becomes zero.'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '−6', tag: 'Z2', hint: L("Minus oltini qo'ying: minus olti ayirish olti bu minus o'n ikki, nol emas.", 'Подставь минус шесть: минус шесть минус шесть это минус двенадцать, не нуль.', 'Put in minus six: minus six minus six is minus twelve, not zero.') },
        { id: 'c', label: '2', tag: 'Z2', hint: L("Ikki bu masofa, markaz emas. Markaz modul ICHIDA turadi.", 'Два это расстояние, а не центр. Центр стоит ВНУТРИ модуля.', 'Two is the distance, not the centre. The centre stands INSIDE the bars.') },
        { id: 'd', label: '0', tag: 'Z2', hint: L("Nol markaz bo'lardi, agar modul ichida faqat x tursa.", 'Нуль был бы центром, если бы внутри стоял только x.', 'Zero would be the centre if only the x stood inside.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("|x| = −4 tenglamaning nechta ildizi bor?", 'Сколько корней у уравнения |x| = −4?', 'How many roots does |x| = −4 have?'),
      ok: L("Masofa manfiy bo'lmaydi.", 'Расстояние не бывает отрицательным.', 'A distance is never negative.'),
      items: [
        { id: 'a', correct: true, label: L("Bittasi ham yo'q", 'Ни одного', 'None') },
        { id: 'b', label: L('Ikkita: 4 va −4', 'Два: 4 и −4', 'Two: 4 and −4'), tag: 'Z3', hint: L("Ikkalasining ham moduli TO'RT, minus to'rt emas.", 'У обоих модуль равен ЧЕТЫРЁМ, а не минус четырём.', 'Both have an absolute value of FOUR, not minus four.') },
        { id: 'c', label: L('Bitta: −4', 'Один: −4', 'One: −4'), tag: 'Z3', hint: L("Minus to'rtning moduli to'rt.", 'Модуль минус четырёх равен четырём.', 'The absolute value of minus four is four.') },
        { id: 'd', label: L('Bitta: 0', 'Один: 0', 'One: 0'), tag: 'Z4', hint: L("Nolning moduli nol. Ildiz nol bo'lish va ildiz yo'q bo'lish boshqa narsa.", 'Модуль нуля равен нулю. Корень нуль и отсутствие корней это разное.', 'The absolute value of zero is zero. A zero root and no roots are different things.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Nima uchun modulli tenglamada odatda ikkita ildiz bo'ladi?", 'Почему в уравнении с модулем обычно два корня?', 'Why does an equation with an absolute value usually have two roots?'),
      ok: L("Markazning ikki tomonida ham nuqta bor.", 'Точки есть по обе стороны от центра.', 'There are points on each side of the centre.'),
      items: [
        { id: 'a', correct: true, label: L('Markazning ikki tomonida nuqta bor', 'По обе стороны от центра есть точки', 'A point on each side of the centre') },
        { id: 'b', tag: 'Z1', label: L('Chunki modul ikki marta yoziladi', 'Потому что модуль пишут дважды', 'Because the bars are written twice'), hint: L("Yozuv ikki marta chiqadi, lekin bu sabab emas, natija. Sabab -- masofa.", 'Запись выходит двойной, но это не причина, а следствие. Причина в расстоянии.', 'The writing comes out doubled, but that is the effect, not the cause. The cause is the distance.') },
        { id: 'c', tag: 'Z3', label: L("Chunki tenglamada har doim ikki javob", 'Потому что у уравнения всегда два ответа', 'Because equations always have two answers'), hint: L("Sakkizinchi darsdagi tenglamalarning bitta ildizi bor edi. Demak har doim emas.", 'У уравнений из восьмого урока был один корень. Значит не всегда.', 'The equations in lesson eight had one root each. So not always.') },
        { id: 'd', tag: 'Z5', label: L("Chunki x musbat ham, manfiy ham bo'ladi", 'Потому что x может быть плюсом и минусом', 'Because x can be plus or minus'), hint: L("x ning ishorasi emas, uning markazgacha bo'lgan masofasi muhim. |x − 5| = 2 da ikkala ildiz ham musbat.", 'Важен не знак x, а его расстояние до центра. В |x − 5| = 2 оба корня положительные.', 'What matters is not the sign of x but its distance to the centre. In |x − 5| = 2 both roots are positive.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsdagi yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi markaz haqida.", 'Второй про центр.', 'The second is about the centre.'),
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
  title: L('Modul bu masofa', 'Модуль это расстояние', 'The absolute value is a distance'),
  gate: S1.gate,
  fix: {
    tokens: ['x', '=', '5', ',', '−5'],
    value: '2',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Ikkala o'quvchi ham ikkita ildiz topdi. Noldan besh masofada ikkita nuqta bor, biri o'ngda, biri chapda.",
    'Оба ученика нашли два корня. На расстоянии пять от нуля две точки, одна справа, другая слева.',
    'Both students found two roots. At a distance of five from zero there are two points, one right and one left.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    two: L('ikkita: besh va minus besh', 'два: пять и минус пять', 'two: five and minus five'),
    one: L('bitta: besh', 'один: пять', 'one: five'),
    neg: L('bitta: minus besh', 'один: минус пять', 'one: minus five'),
    many: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['|x| = 5 → 5 , −5', '|x − 3| = 4 → 7 , −1', '|x + 2| = 6 → 4 , −8', '|x| = −3  ≠'],
  twoLabel: L('Uch holat', 'Три случая', 'Three cases'),
  twoA: 'd > 0  →  2      d = 0  →  1',
  twoB: 'd < 0  →  0',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  // Satr QISQA: modul chizig'i balandroq bo'lgach yakun 2 px oshib ketardi.
  nextTopic: L(
    "tenglama bilan masala",
    'задачи с уравнением',
    'problems with equations',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Butun dars bitta ta'rifdan chiqdi: modul bu masofa. Ikkita ildiz e'lon qilinmadi, u masofadan kelib chiqdi.", 'Весь урок вышел из одного определения: модуль это расстояние. Два корня не объявляли, они следуют из расстояния.', 'The whole lesson came from one definition: the absolute value is a distance. Two roots were not announced, they follow from the distance.'),
    A('mount', "Keyingi darsda tenglama yordamida masala yechishni o'rganamiz.", 'В следующем уроке научимся решать задачи с помощью уравнений.', 'In the next lesson we learn to solve word problems with equations.'),
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

export default function Grade7Dars10({
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
    else console.log('[Grade7 Dars10] onFinished', payload)
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
