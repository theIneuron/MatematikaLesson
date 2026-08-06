// ============================================================================
// 11-sinf, Dars 12. LOGARIFMIK TENGSIZLIKLAR.  (Логарифмические неравенства)
//
// PILOT dars: PODXOD_11SINF.md yondashuvi bo'yicha birinchi dars.
// Bu faylda FAQAT MA'LUMOT va asboblarni ulash bor. Mexanika `tools.jsx` da,
// yadro `core.jsx` da.
//   raskadrovka: src/books/grade11/DARS12_SKELET.md (redaksiya 2)
//   kontent:     src/books/grade11/DARS12_CONTENT.md
//
// Tuzilishi (metodist tasdiqladi 2026-08-06): 15 ekran
//   1      xuk
//   2-8    temani tushuntirish
//   9-14   o'rganilganni mashq qilish
//   15     yakun
//
// Baholanadi FAQAT 12-slayd (blits). Qolgan ekranlar diagnostik teg beradi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// `React` LMS klassik rejimi uchun SHART, kodda to'g'ridan-to'g'ri ishlatilmaydi.
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BgCurves,
  Btn,
  Col,
  Cols,
  Expr,
  FREE_NAV,
  Fx,
  Insight,
  L,
  LangProvider,
  LangSetProvider,
  NotesInline,
  Panel,
  PrintSheet,
  RingProgress,
  STYLES,
  Slot,
  SoftTimer,
  Stage,
  T,
  Tag,
  Title,
  configureLesson,
  tr,
  useAdvanceGate,
  useAudio,
  useMobileZoom,
  useNarratedSteps,
  useT,
} from './core.jsx'
import {
  AnswerInterval,
  AuditRows,
  BaseSlider,
  BuildExpr,
  GraphProjection,
  Probe,
  ProbeChain,
  RuleGate,
  SignFill,
  SolutionLine,
  SupportCards,
  TestPointRows,
  TransformChain,
} from './tools.jsx'

const LESSON_ID = 'alg_11_12'
const LESSON_TITLE = L('Logarifmik tengsizliklar', 'Логарифмические неравенства', 'Logarithmic inequalities')
const TOTAL = 15

// Ovoz bo'laklari. `on: 'mount'` -- ekran ochilganda, `on: '<nom>'` -- shu nomli
// qadam bosilganda. Ovoz TAYMER bilan emas, o'quvchining qadami bilan boradi.
const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

// Ovoz OCHILISHNI boshqaradigan ekranlar uchun: hamma bo'lak avtomatik
// zanjirlanadi, `waitFor` dagilar esa o'quvchining javobini kutadi.
const TP_IN = L('kiradi', 'входит', 'is a solution')
const TP_OUT = L('kirmaydi', 'не входит', 'is not a solution')

const buildAuto = (list, lang, waitFor = []) =>
  list.map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: waitFor.indexOf(s.on) !== -1
      ? 'on_event:' + s.on
      : (i === 0 ? 'on_mount' : 'after_previous'),
    waits_for: null,
  }))

const textsOf = (list, lang) => list.map((s) => tr(s.text, lang))

const buildSegments = (list, lang) =>
  list.map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: s.on === 'mount'
      ? (i === 0 ? 'on_mount' : 'after_previous')
      : s.on === 'next' ? 'after_previous' : 'on_event:' + s.on,
    waits_for: null,
  }))

const UI = {
  next: L('Davom etish', 'Продолжить', 'Continue'),
  back: L('Orqaga', 'Назад', 'Back'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish the lesson'),
  saved: L('Natija saqlandi', 'Результат сохранён', 'Result saved'),
  substitute: L("Qo'yish:", 'Подставить', 'Substitute'),
  mock: L('Sinov DTM · 1 daqiqa', 'Пробный ДТМ · 1 минута', 'Mock exam · 1 minute'),
  answerA: L('A varianti', 'Вариант A', 'Option A'),
  answerB: L('B varianti', 'Вариант B', 'Option B'),
  was: L('Edi', 'Было', 'Before'),
  now: L("Bo'ldi", 'Стало', 'Now'),
  target: L('Maqsad oralig\u2018i', 'Целевой интервал', 'Target interval'),
  learned: L('Nimani o\u2018rgandingiz', 'Что ты узнал', 'What you learned'),
  predictToProved: L('Boshdagi taxmin \u2192 isbotlangan javob', 'Прогноз в начале \u2192 доказанный ответ', 'Initial guess \u2192 proved answer'),
  dtmReady: L('DTM ga tayyorlik', 'Готовность к ДТМ', 'Exam readiness'),
  weakSpot: L('Takrorlash kerak', 'Требует повтора', 'Needs review'),
  caseUp: L('a > 1 \u00b7 o\u2018sadi', 'a > 1 \u00b7 возрастает', 'a > 1 \u00b7 increasing'),
  caseDown: L('0 < a < 1 \u00b7 kamayadi', '0 < a < 1 \u00b7 убывает', '0 < a < 1 \u00b7 decreasing'),
  // 3-ekran: TEKSHIRISH MEZONI. Ilgari ekranda faqat «Qaysi nuqtani olamiz?»
  // turardi -- nima uchun olayotganimiz va nimani kutayotganimiz yozilmagan edi.
  s3rule: L(
    "Yechim bo'lgan son TO'G'RI javobning ICHIDA yotishi shart. Ikki javobni ajratadigan sonni izlaymiz.",
    'Число-решение обязано лежать ВНУТРИ верного ответа. Ищем число, которое разводит эти два ответа.',
    'A number that is a solution must lie INSIDE the correct answer. We are looking for a number that separates these two answers.',
  ),
  // Qisqa: uzun yorliq telefonda o'z satriga tushib, 25px qo'shardi.
  s3goal: L('chap tomon 2 dan KICHIK', 'слева МЕНЬШЕ 2', 'the left side is LESS than 2'),
  yourPick: L('sizning taxminingiz', 'твой прогноз', 'your guess'),
  agrees: L('mos keldi', 'сходится', 'consistent'),
  breaks: L('ZIDDIYAT', 'ПРОТИВОРЕЧИЕ', 'CONTRADICTION'),
  breakHas: L(
    'ichida {v} bor, {v} esa yechim emas',
    'содержит {v}, а {v} — не решение',
    'contains {v}, but {v} is not a solution',
  ),
  breakMiss: L(
    "{v} yo'q, lekin {v} yechim",
    'нет {v}, хотя {v} — решение',
    'lacks {v}, although {v} is a solution',
  ),
  headPut: L("qo'ydik", 'подставили', 'substituted'),
  headGot: L('chapda chiqdi', 'слева получилось', 'left side gives'),
  headVerdict: L('xulosa', 'вывод', 'verdict'),
  need: L('kerak', 'нужно', 'needed'),
  soAnswer: L('Demak javob', 'Значит ответ', 'So the answer is'),
  ourBase: L('misolda', 'в примере', 'in our example'),
  bonusLabel: L('BONUS', 'БОНУС', 'BONUS'),
  bonus: L(
    "pH, detsibel, magnituda \u2014 hammasi logarifmik shkala: teng qadam teng NISBATni beradi, teng farqni emas.",
    'pH, децибелы, магнитуда \u2014 всё это логарифмические шкалы: равный шаг даёт равное ОТНОШЕНИЕ, а не равную разницу.',
    'pH, decibels and magnitude are logarithmic scales: an equal step means an equal RATIO, not an equal difference.',
  ),
  lifehackLabel: L('LAYFXAK', 'ЛАЙФХАК', 'LIFEHACK'),
  sheetTitle: L('Logarifmik tengsizliklar \u00b7 shpargalka', 'Логарифмические неравенства \u00b7 шпаргалка', 'Logarithmic inequalities \u00b7 cheat sheet'),
  sheetSrc: L('11-sinf, 12-dars \u00b7 masalalar to\u2018plami, 2-qism, 100-bet, \u2116 32', '11 класс, урок 12 \u00b7 задачник, часть 2, стр. 100, \u2116 32', 'Grade 11, lesson 12 \u00b7 exercise book, part 2, p. 100, no. 32'),
  lifehack: L(
    "10 sekundlik tekshiruv: javob ICHIDAN bitta butun son va TASHQARISIDAN bitta butun son ol. Boshlang'ich tengsizlikka qo'y: biri o'tishi, ikkinchisi o'tmasligi kerak.",
    'Проверка за 10 секунд: возьми целое число ВНУТРИ ответа и целое СНАРУЖИ. Подставь в исходное: одно должно пройти, другое нет.',
    'A 10-second check: take a whole number INSIDE your answer and one OUTSIDE. Substitute into the original: one must pass, the other must fail.',
  ),
  goesToResult: L('Natijaga kiradi', 'Идёт в результат', 'Counts towards the result'),
}

// ============================================================
// Umumiy ramka: sarlavha, qulf, navigatsiya.
// ============================================================
function Frame({ meta, right, screen, audio, solved, onPrev, onNext, onFinish, finished, navCenter, children }) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  const nav = {
    back: (
      <Btn tone="ghost" onClick={onPrev} disabled={screen === 0}>
        {t(UI.back)}
      </Btn>
    ),
    next: last ? (
      <Btn tone="accent" ready={!finished} onClick={onFinish} disabled={finished}>
        {finished ? t(UI.saved) : t(UI.finish)}
      </Btn>
    ) : (
      <Btn onClick={onNext} disabled={!canNext} ready={solved}>
        {t(UI.next)}
      </Btn>
    ),
  }
  return (
    <Stage eyebrow={t(meta.eyebrow)} right={right} block={BLOCK} screen={screen} total={TOTAL} audio={audio} nav={nav} navCenter={navCenter}>
      <Title>{t(meta.title)}</Title>
      {children}
    </Stage>
  )
}

// Dars B2 blokining nechanchi qadami: 9-14 darslar, hozir 12-si.
// Manba: src/books/Math_1-11_Поурочно_RUz.xlsx, «11 класс» varag'i.
// `B2` -- LOTIN harfi bilan: uch tilda ham bir xil, UZ/EN ekranida kirill
// paydo bo'lmasligi kerak (prokliklash skripti buni tekshiradi).
const BLOCK = { label: 'B2', from: 9, to: 14, current: 12 }

// Umumiy son o'qlari.
const AXIS_1 = { min: -8, max: 34, ticks: [{ v: 3 }, { v: 28 }] }
const AXIS_2 = { min: 0, max: 8, ticks: [{ v: 2 }, { v: 3 }] }
const AXIS_3 = { min: -2, max: 10, ticks: [{ v: 0 }, { v: 3 }] }
const AXIS_4 = { min: 0, max: 10, ticks: [{ v: 3 }, { v: 7 }] }

// ============================================================
// SLAYD 1. XUK. Ikki javob, umumiy soni YO'Q. Baholanmaydi.
// ============================================================
const S1 = {
  eyebrow: L('LOGARIFMIK TENGSIZLIKLAR', 'ЛОГАРИФМИЧЕСКИЕ НЕРАВЕНСТВА', 'LOGARITHMIC INEQUALITIES'),
  title: L(
    'Ikki javob. Kim haq?',
    'Два ответа. Кто прав?',
    'Two answers. Who is right?',
  ),
  expr: 'log₅(x − 3) < 2',
  rows: [
    {
      id: 'a',
      name: L('birinchi yechim', 'первое решение', 'first solution'),
      value: '(3; 28)',
      btn: L("Birinchi yechimni ko'rsatish", 'Показать первое решение', 'Show the first solution'),
      set: { from: 3, to: 28, tone: 'ink' },
    },
    {
      id: 'b',
      name: L('ikkinchi yechim', 'второе решение', 'second solution'),
      value: '(−∞; 28)',
      btn: L("Ikkinchi yechimni ko'rsatish", 'Показать второе решение', 'Show the second solution'),
      set: { from: null, to: 28, tone: 'tip' },
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi uni nuqta bilan tekshiramiz.",
      'Твой ответ записан. Сейчас проверим его точкой.',
      'Your answer is saved. Now we will check it with a point.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первое', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второе', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  audio: [
    A('mount', 'Sinov imtihonida ikki kishi bitta tengsizlikni yechdi va turli javob oldi.', 'На пробном экзамене двое решили одно и то же неравенство и получили разные ответы.', 'On a mock exam two students solved the same inequality and got different answers.'),
    A('r1', 'Birinchi javob mana shu.', 'Вот первый ответ.', 'Here is the first answer.'),
    A('r2', 'Ikkinchisi esa mana shu. Qarang: ikkinchi javobda uchdan chapda sonlar bor, birinchisida ular yo\'q.', 'А вот второй. Посмотри: во втором ответе есть числа левее тройки, а в первом их нет.', 'And here is the second one. Look: the second answer has numbers to the left of three, the first one does not.'),
    A('ask', "Sizningcha qaysi javob to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какой ответ верный? Пока просто предположи.', 'Which answer do you think is correct? Just make a guess for now.'),
  ],
}

function Screen1({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S1.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S1.audio, rest.lang))
  const [picked, setPicked] = useState(null)
  const open = Math.min(phase, S1.rows.length)

  return (
    <Frame meta={S1} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <Cols l={1.05} r={1}>
        <Col>
          <Tag tone="accent">{t(UI.mock)}</Tag>
          <Expr size="hero" style={{ textAlign: 'left' }}>{S1.expr}</Expr>
          {phase >= 3 ? (
            <div className="g11-in">
              <Probe audio={audio} data={S1.probe} cols={2} fbSlot={58} noShuffle unscored dense
                onSolved={(r) => { setPicked(r.picked); onAnswer({ ...r, screen }) }} />
            </div>
          ) : null}
        </Col>
        <Col>
          {S1.rows.map((r, i) => (
            <Panel
              key={r.id}
              tone={i < open ? 'paper' : 'quiet'}
              className={i < open ? 'g11-reveal' : undefined}
              style={{ display: 'flex', flexDirection: 'column', gap: 5, opacity: i < open ? 1 : 0.32 }}
            >
              <Tag tone={i === 0 ? 'graph' : 'quiet'}>{t(r.name)}</Tag>
              <Expr size="big" style={{ textAlign: 'left' }} className={i < open ? 'g11-drop' : undefined}>
                {i < open ? r.value : '?'}
              </Expr>
              {i < open ? (
                <SolutionLine axis={AXIS_1} sets={[r.set]} />
              ) : <Slot mh={60} />}
            </Panel>
          ))}
        </Col>
      </Cols>
    </Frame>
  )
}

// ============================================================
// SLAYD 2. TAYANCH. Uch kartochka, keyin uch topshiriq. Baholanmaydi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCHNI TEKSHIRISH', 'ПРОВЕРКА ОПОРЫ', 'CHECKING THE BASICS'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  toTasks: L('Endi uchta qisqa topshiriq', 'Теперь три коротких задания', 'Now three short tasks'),
  cards: [
    {
      id: 'c1',
      title: L('Logarifm — daraja ko\'rsatkichi', 'Логарифм — это показатель степени', 'A logarithm is an exponent'),
      short: L('daraja ko\'rsatkichi', 'показатель степени', 'an exponent'),
      ex: [
        { e: 'log₅ 25 = 2', why: '5² = 25' },
        { e: 'log₅ 125 = 3', why: '5³ = 125' },
      ],
      btn: L('Birinchi tayanch', 'Первая опора', 'First basic'),
    },
    {
      id: 'c2',
      title: L('Manfiy ko\'rsatkich kasrni teskari aylantiradi', 'Отрицательный показатель переворачивает дробь', 'A negative exponent flips the fraction'),
      short: L('minus — teskari kasr', 'минус — переворот дроби', 'a minus flips the fraction'),
      ex: [
        { e: '(0,5)⁻¹ = 2', why: '1 : 0,5 = 2' },
        { e: 'log₀,₅ 4 = −2', why: '(0,5)⁻² = 4' },
      ],
      btn: L('Ikkinchi tayanch', 'Вторая опора', 'Second basic'),
    },
    {
      // Bu tayanch bugungi darsning O'ZAGI, shuning uchun u SONLARDA
      // ko'rsatiladi: bir xil argumentlar, ikki xil asos, teskari natija.
      id: 'c3',
      title: L('Asos yo\'nalishni belgilaydi', 'Основание задаёт направление', 'The base sets the direction'),
      short: L('asos yo\'nalishni belgilaydi', 'основание задаёт направление', 'the base sets the direction'),
      ex: [
        {
          e: 'log₅ 25 = 2  →  log₅ 125 = 3',
          why: L('argument o\'sdi — logarifm ham o\'sdi', 'аргумент вырос — и логарифм вырос', 'the argument grew, so did the logarithm'),
        },
        {
          e: 'log₀,₂ 25 = −2  →  log₀,₂ 125 = −3',
          why: L('argument o\'sdi — logarifm PASAYDI', 'аргумент вырос — а логарифм УПАЛ', 'the argument grew, the logarithm FELL'),
        },
      ],
      btn: L('Uchinchi tayanch', 'Третья опора', 'Third basic'),
    },
  ],
  tasks: [
    {
      id: 't1',
      prompt: 'log₅ 25 =',
      cols: 4,
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '5', hint: L("Logarifm — daraja ko'rsatkichi, sonning o'zi emas.", 'Логарифм — это показатель степени, а не само число.', 'A logarithm is an exponent, not the number itself.') },
        { id: 'c', label: '10', hint: L("Beshni ikkiga ko'paytirish — beshning darajasi bilan bir xil emas.", 'Пять умножить на два — не то же самое, что пять в степени.', 'Five times two is not the same as five raised to a power.') },
        { id: 'd', label: '0,5', hint: L("Yigirma besh beshdan katta, demak ko'rsatkich birdan katta.", 'Двадцать пять больше пяти, значит показатель больше единицы.', 'Twenty five is greater than five, so the exponent is greater than one.') },
      ],
    },
    {
      id: 't2',
      prompt: '(0,5)⁻¹ =',
      cols: 4,
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '−2', hint: L("Manfiy ko'rsatkich kasrni teskari aylantiradi, sonning ishorasini emas.", 'Отрицательный показатель переворачивает дробь, а не знак числа.', 'A negative exponent flips the fraction, not the sign of the number.') },
        { id: 'c', label: '0,5', hint: L("Ko'rsatkich minus bir, demak kasr teskari aylanadi.", 'Показатель минус один, значит дробь переворачивается.', 'The exponent is minus one, so the fraction flips.') },
        { id: 'd', label: '−0,5', hint: L('Na teskari aylanish, na ishora. Yana bir hisoblang.', 'Ни переворота, ни знака. Посчитай ещё раз.', 'Neither a flip nor a sign change. Compute it again.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('log₀,₅ 4 va log₀,₅ 8 dan qaysi biri katta?', 'Что больше: log₀,₅ 4 или log₀,₅ 8 ?', 'Which is greater, log₀,₅ 4 or log₀,₅ 8 ?'),
      cols: 2,
      items: [
        { id: 'a', label: 'log₀,₅ 4', correct: true },
        { id: 'b', label: 'log₀,₅ 8', hint: L("Grafikka qarang: bu chiziqda nuqta o'ngga va pastga boradi. Argument katta — logarifm kichik.", 'Посмотри на график: у этой кривой точка едет вправо и вниз. Аргумент больше — логарифм меньше.', 'Look at the graph: on this curve the point moves right and down. Bigger argument, smaller logarithm.') },
        { id: 'c', label: L('teng', 'равны', 'they are equal'), hint: L('Argumentlar turlicha, demak logarifmlar ham turlicha.', 'Аргументы разные, значит и логарифмы разные.', 'The arguments differ, so the logarithms differ too.') },
        { id: 'd', label: L("solishtirib bo'lmaydi", 'нельзя сравнить', 'cannot be compared'), hint: L('Mumkin: ikkisini hisoblang yoki grafikka qarang.', 'Можно: посчитай оба или посмотри на график.', 'You can: compute both, or look at the graph.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Bahsni hal qilishdan oldin uch narsani eslaymiz. Bu baho emas.', 'Прежде чем решать спор, восстановим три вещи. Это не оценка.', 'Before we settle the argument, let us recall three things. This is not graded.'),
    A(
      'c1',
      "Birinchi tayanch. Logarifm — bu daraja ko'rsatkichi. Beshni qaysi darajaga oshirsak yigirma besh chiqadi. Ikkinchi darajaga. Demak besh asosli yigirma beshning logarifmi ikki. Xuddi shunday bir yuz yigirma besh uchun: besh kubi bir yuz yigirma besh, demak logarifm uch. Bu sonni eslab qoling, u bugun yana kerak bo'ladi.",
      'Первая опора. Логарифм — это показатель степени. В какую степень возвести пять, чтобы получить двадцать пять. Во вторую. Значит логарифм двадцати пяти по основанию пять равен двум. Так же и для ста двадцати пяти: пять в кубе это сто двадцать пять, значит логарифм равен трём. Запомни это число, оно сегодня ещё понадобится.',
      'First basic. A logarithm is an exponent. To what power do we raise five to get twenty five. To the second. So the logarithm of twenty five to base five is two. The same for one hundred twenty five: five cubed is one hundred twenty five, so the logarithm is three. Remember this number, we will need it again today.',
    ),
    A(
      'c2',
      "Ikkinchi tayanch. Ko'rsatkichdagi minus kasrni teskari aylantiradi, sonning ishorasini emas. Nol butun besh minus birinchi darajada ikkiga teng. Endi diqqat qiling: nol butun besh asosli to'rtning logarifmi minus ikki, chunki nol butun beshni minus ikkinchi darajaga oshirsak to'rt chiqadi.",
      'Вторая опора. Минус в показателе переворачивает дробь, а не меняет знак числа. Нуль целых пять в минус первой степени равно двум. Теперь внимание: логарифм четырёх по основанию нуль целых пять равен минус двум, потому что нуль целых пять в минус второй степени даёт четыре.',
      'Second basic. A minus in the exponent flips the fraction, it does not change the sign of the number. Zero point five to the power minus one equals two. Now pay attention: the logarithm of four to base zero point five is minus two, because zero point five to the power minus two gives four.',
    ),
    A(
      'c3',
      "Uchinchi tayanch, va bugun eng muhimi. Asos besh bo'lganda argument yigirma beshdan bir yuz yigirma beshga o'sdi — logarifm ikkidan uchga ko'tarildi. Endi asosni birdan kichik qilaman, nol butun ikki. Argumentlar aynan o'sha, lekin logarifm minus ikkidan minus uchga tushdi. Argument o'sdi, logarifm esa pasaydi. Demak yo'nalishni argument emas, ASOS belgilaydi.",
      'Третья опора, и сегодня она главная. При основании пять аргумент вырос с двадцати пяти до ста двадцати пяти — и логарифм поднялся с двух до трёх. Теперь я делаю основание меньше единицы, нуль целых два. Аргументы те же самые, а логарифм опустился с минус двух до минус трёх. Аргумент вырос, а логарифм упал. Значит направление задаёт не аргумент, а ОСНОВАНИЕ.',
      'Third basic, and today it is the main one. With base five the argument grew from twenty five to one hundred twenty five, and the logarithm rose from two to three. Now I make the base smaller than one, zero point two. The arguments are exactly the same, yet the logarithm dropped from minus two to minus three. The argument grew but the logarithm fell. So the direction is set not by the argument but by the BASE.',
    ),
    A(
      'tasks',
      "Tayanchlarni bitta tugmaga yig'ib qo'yaman — kerak bo'lsa ochasiz. Endi uchta qisqa topshiriq.",
      'Опоры я сворачиваю в одну кнопку — понадобятся, откроешь. Теперь три коротких задания.',
      'I am folding the basics into one button — open it if you need it. Now three short tasks.',
    ),
  ],
}

function Screen2({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S2.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S2.audio, rest.lang))
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S2} screen={screen} audio={audio} solved={done} {...rest}>
      <SupportCards
        cards={S2.cards}
        tasks={S2.tasks}
        open={Math.min(phase, S2.cards.length)}
        showTasks={phase >= 4}
        audio={audio}
        onStep={audio.step}
        onSolved={() => { setDone(true); onAnswer({ screen, correct: null, tag: 'support' }) }}
      />
    </Frame>
  )
}

// ============================================================
// SLAYD 3. BIRINCHI MODEL: bahsni NUQTA hal qiladi.
// ============================================================
const S3 = {
  eyebrow: L('NUQTA BILAN TEKSHIRAMIZ', 'ПРОВЕРИМ ТОЧКОЙ', 'LET US CHECK WITH A POINT'),
  title: L('Bahsni nuqta hal qiladi', 'Спор решает точка', 'A point settles it'),
  pick: L('Qaysi nuqtani olamiz?', 'Какую точку взять?', 'Which point shall we take?'),
  // Har nuqtaning ROLI bor va u tugmada yozilgan: o'quvchi tugmani
  // ko'r-ko'rona bosmaydi, nima uchun aynan shu sonni olayotganini biladi.
  // `sol` -- bu son tengsizlikning yechimimi. `inA`, `inB` -- u da'vogar
  // javoblarning ichidami. Ziddiyat aynan `sol` va `in` mos kelmaganda chiqadi.
  points: [
    {
      id: 'p0', label: 'x = 0', num: '0', mark: 0, step: 'calc', verdict: 'out',
      role: L('uchdan chapda', 'левее тройки', 'left of three'),
      calc: L(
        "log₅(0 − 3) — logarifm YO'Q",
        'log₅(0 − 3) — логарифма НЕТ',
        'log₅(0 − 3) — NO logarithm',
      ),
      sol: false, inA: false, inB: true,
    },
    {
      id: 'p4', label: 'x = 4', num: '4', mark: 4, step: 'calc', verdict: 'in',
      role: L('ikki javob ichida', 'внутри обоих ответов', 'inside both answers'),
      calc: L('log₅ 1 = 0,  va 0 < 2', 'log₅ 1 = 0,  и 0 < 2', 'log₅ 1 = 0,  and 0 < 2'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'p128', label: 'x = 128', num: '128', step: 'calc', verdict: 'out',
      role: L("o'ngda, uzoqda", 'далеко справа', 'far to the right'),
      calc: L('log₅ 125 = 3,  lekin 3 > 2', 'log₅ 125 = 3,  но 3 > 2', 'log₅ 125 = 3,  but 3 > 2'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'a', label: '(3; 28)', correct: true,
        ok: L("To'g'ri. Siz bir javobga mos, ikkinchisiga mos kelmaydigan sonni topdingiz. Tekshirish usuli aynan shu.", 'Верно. Ты нашёл число, которое проходит по одному ответу и не проходит по другому. Это и есть способ проверки.', 'Correct. You found a number that fits one answer and fails the other. That is the way to check.'),
      },
      {
        id: 'b', label: '(−∞; 28)',
        hint: L("Nolni oling. Logarifm ostida minus uch chiqadi, manfiy sonning logarifmi esa yo'q. Demak nol yechim bo'lolmaydi — bu javobga esa u kiradi.", 'Возьми ноль. Под логарифмом получается минус три, а логарифма отрицательного числа не существует. Значит ноль решением быть не может — а в этот ответ он входит.', 'Take zero. Under the logarithm you get minus three, and there is no logarithm of a negative number. So zero cannot be a solution, yet this answer contains it.'),
      },
    ],
  },
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A(
      'mount',
      "Bahs bahs bilan emas, son bilan hal qilinadi. Qoida oddiy: agar son tengsizlikning yechimi bo'lsa, u to'g'ri javobning ichida yotishi shart. Demak bizga shunday son kerak: u bir javobning ichida, ikkinchisining tashqarisida bo'lsin.",
      'Спор решается не спором, а числом. Правило простое: если число — решение неравенства, оно обязано лежать внутри верного ответа. Значит нам нужно такое число, которое лежит внутри одного ответа и вне другого.',
      'An argument is settled by a number, not by arguing. The rule is simple: if a number is a solution of the inequality, it must lie inside the correct answer. So we need a number that lies inside one answer and outside the other.',
    ),
    A(
      'mount',
      "Nuqtani tanlang. Uni boshlang'ich tengsizlikka qo'yamiz va chap tomonni ikki bilan solishtiramiz: yechim uchun chap tomon ikkidan kichik bo'lishi kerak.",
      'Выбери число. Мы подставим его в исходное неравенство и сравним левую часть с двойкой: чтобы число было решением, слева должно получиться меньше двух.',
      'Pick a number. We will substitute it into the original inequality and compare the left side with two: for the number to be a solution, the left side must come out less than two.',
    ),
    A('calc', 'Hisoblaymiz va ikki bilan solishtiramiz.', 'Считаем и сравниваем с двойкой.', 'We compute and compare with two.'),
    A(
      'mark',
      "Uch nuqta tekshirildi. Endi eng muhimi: nol yechim emas, lekin u ikkinchi javobning ICHIDA yotadi. To'rt yechim, va u ikki javobda ham bor. Bir yuz yigirma sakkiz yechim emas, va u ikki javobdan ham tashqarida.",
      'Три числа проверены. Теперь самое важное: ноль не решение, но он лежит ВНУТРИ второго ответа. Четвёрка решение, и она есть в обоих ответах. Сто двадцать восемь не решение, и его нет ни в одном ответе.',
      'Three numbers checked. Now the key part: zero is not a solution, yet it lies INSIDE the second answer. Four is a solution and it is in both answers. One hundred twenty eight is not a solution and it is outside both answers.',
    ),
    A(
      'next',
      "Bitta son ikki javobni ajratdi. Qaysi javob mezonni buzdi?",
      'Одно число развело два ответа. Какой из них нарушил правило?',
      'One number separated the two answers. Which of them broke the rule?',
    ),
  ],
}

function Screen3({ screen, answers, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S3.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S3.audio, rest.lang))
  const [shown, setShown] = useState([])
  const [solved, setSolved] = useState(false)
  const [marked, setMarked] = useState(false)
  const all = shown.length >= S3.points.length
  const marks = S3.points
    .filter((p) => shown.indexOf(p.id) !== -1 && p.mark !== undefined)
    .map((p) => ({ v: p.mark, tone: 'accent' }))

  // 1-ekrandagi taxmin: qaysi javobni tanlagan edi.
  const rec = (answers || []).find((a) => a && a.screen === 0 && a.picked)
  const predicted = rec ? rec.picked : null

  // Xulosa ovozi UCHINCHI hisob TUGAGACH aytiladi. Ilgari u 400 ms dan keyin
  // chaqirilardi va oxirgi hisobning ustidan gapirib ketardi.
  useEffect(() => {
    if (!all || marked || audio.muted || audio.isPlaying) return undefined
    const id = setTimeout(() => { setMarked(true); audio.step('mark') }, 300)
    return () => clearTimeout(id)
  }, [all, marked, audio.muted, audio.isPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // Da'vogar javobning xulosasi: TEKSHIRILGAN sonlar ichida mezonni buzgani
  // bormi. Muhim: xulosa faqat o'quvchi javob bergandan KEYIN bosiladi --
  // aks holda savol tekin bo'lib qoladi.
  const breachOf = (key) => S3.points.find(
    (p) => shown.indexOf(p.id) !== -1 && p.sol !== p[key],
  ) || null

  return (
    <Frame meta={S3} screen={screen} audio={audio} solved={solved} {...rest}>
      {/* Tengsizlik va NIMANI kutayotganimiz bir joyda. */}
      <Panel tone="teal" pad={8} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Expr size="row" style={{ textAlign: 'left' }}>{S1.expr}</Expr>
        <Tag tone="graph">{t(UI.s3goal)}</Tag>
      </Panel>

      {/* MEZON bir gapda: nima uchun son qo'yayotganimiz. */}
      <Slot mh={20}>
        {phase >= 1 ? <p className="g11-ask g11-drop">{t(UI.s3rule)}</p> : null}
      </Slot>

      {/* Ikki da'vogar javob EKRANDA turadi: o'quvchi nimani hal qilayotganini
          ko'radi. Xulosa o'rni hozircha savol belgisi. */}
      {phase >= 1 ? (
        <div className="g11-claims g11-reveal">
          {S1.rows.map((r) => {
            const key = r.id === 'a' ? 'inA' : 'inB'
            const bad = solved ? breachOf(key) : null
            const why = bad
              ? tr(bad.sol ? UI.breakMiss : UI.breakHas, rest.lang).replace(/\{v\}/g, bad.num)
              : null
            return (
              <Panel key={r.id} tone={solved && !bad ? 'paper' : 'quiet'} pad={8} className="g11-claim">
                <Tag tone="quiet">{t(r.name)}</Tag>
                <span className="g11-claim-v"><Fx>{r.value}</Fx></span>
                {predicted === r.id ? <Tag tone="quiet">{t(UI.yourPick)}</Tag> : null}
                {solved
                  ? <Tag tone={bad ? 'tip' : 'ok'} className="g11-drop">{bad ? t(UI.breaks) : t(UI.agrees)}</Tag>
                  : <span className="g11-claim-q">?</span>}
                {why ? <span className="g11-hint g11-wrap">{why}</span> : null}
              </Panel>
            )
          })}
        </div>
      ) : <Slot mh={44} />}

      <Cols l={1} r={0.82}>
        <Col>
          {/* Bitta tugma va u O'ZI nima qilishini aytadi: «Qo'yish: x = 0».
              Ilgari uch tugma va bo'sh jadval turardi -- nima qilish kerakligi
              ekrandan ko'rinmasdi. */}
          <TestPointRows
            points={S3.points}
            sequential
            pickLabel={S3.pick}
            subLabel={UI.substitute}
            onStep={audio.step}
            onRevealed={({ id }) => setShown((v) => (v.indexOf(id) === -1 ? v.concat(id) : v))}
          />
        </Col>
        <Col>
          {all ? (
            <div className="g11-in">
              <SolutionLine axis={AXIS_1} sets={[{ from: 3, to: 28, tone: 'graph' }, { from: null, to: 28, tone: 'tip' }]} marks={marks} />
              <Probe audio={audio} data={S3.probe} cols={2} fbSlot={46} dense
                onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: 'check_by_point' }) }} />
            </div>
          ) : null}
        </Col>
      </Cols>
    </Frame>
  )
}

// ============================================================
// SLAYD 4. GRAFIK va uning O'QDAGI SOYASI.
// ODZ shu yerda qoida emas: chegaradan chapda kirivi YO'Q.
// ============================================================
const S4 = {
  eyebrow: L('BU TENGSIZLIK QAYERDA YASHAYDI', 'ГДЕ ЖИВЁТ ЭТО НЕРАВЕНСТВО', 'WHERE THIS INEQUALITY LIVES'),
  title: L('Tengsizlik qayerda yashaydi', 'Где живёт неравенство', 'Where the inequality lives'),
  btns: [
    L('Chiziqni chizish', 'Нарисовать кривую', 'Draw the curve'),
    L("y = 2 to'g'ri chizig'ini o'tkazish", 'Провести прямую y = 2', 'Draw the line y = 2'),
    L("O'qdagi soyani ko'rsatish", 'Показать тень на оси', 'Show the shadow on the axis'),
  ],
  probe: {
    question: L('Nega yechimlar uchdan chapda bo\'lolmaydi?', 'Почему решения не могут быть левее тройки?', 'Why can there be no solutions to the left of three?'),
    items: [
      { id: 'a', label: L('u yerda chiziq mavjud emas', 'там кривой не существует', 'the curve does not exist there'), correct: true },
      { id: 'b', label: L("u yerda chiziq to'g'ri chiziqdan pastda", 'там кривая ниже прямой', 'the curve is below the line there'), hint: L("To'g'ri chiziqdan pastda u aynan yechimlar bor joyda. Uchdan chapda esa u umuman yo'q.", 'Ниже прямой она как раз там, где решения есть. Левее тройки её вообще нет.', 'Below the line is exactly where the solutions are. To the left of three the curve is not there at all.') },
      { id: 'c', label: L("u yerda asos o'zgaradi", 'там основание меняется', 'the base changes there'), hint: L("Asos chapda ham, o'ngda ham besh. Chiziq qayerda boshlanishiga qarang.", 'Основание пять и слева, и справа. Смотри, где кривая начинается.', 'The base is five on both sides. Look at where the curve begins.') },
      { id: 'd', label: L("u yerda 28 nuqtasi yo'q", 'там нет точки 28', 'the point 28 is not there'), hint: L("Yigirma sakkiz nuqtasi — o'ng chegara. Savol chap chegara haqida.", 'Точка двадцать восемь — правая граница. Вопрос про левую.', 'Twenty eight is the right boundary. The question is about the left one.') },
    ],
  },
  audio: [
    A('mount', "Nuqta qaysi javob to'g'ri ekanini ko'rsatdi. Endi ikkala chegara qayerdan kelishini ko'ramiz.", 'Точка показала, какой ответ верный. Теперь посмотрим, откуда берутся обе границы.', 'The point showed which answer is correct. Now let us see where both boundaries come from.'),
    A('curve', "Chiziq qayerda boshlanishiga qarang. Uchdan chapda u umuman yo'q: logarifm ostida u yerda manfiy son.", 'Смотри, где начинается кривая. Левее тройки её нет совсем: под логарифмом там отрицательное число.', 'Look at where the curve begins. To the left of three it does not exist at all: the expression under the logarithm is negative there.'),
    A('line', "Endi ikki balandlikda to'g'ri chiziq o'tkazamiz.", 'Теперь проведём прямую на высоте двух.', 'Now let us draw a line at height two.'),
    A('shade', "Bizga logarifm ikkidan kichik joy kerak — ya'ni chiziq to'g'ri chiziqdan pastda bo'lgan joy. Mana shu qism.", 'Нам нужно, где логарифм меньше двух — то есть где кривая ниже прямой. Вот эта часть.', 'We need where the logarithm is less than two, that is where the curve is below the line. This part.'),
    A('shadow', "Endi eng muhimi: uning gorizontal o'qdagi soyasiga qarang. Javob aynan shu, uchdan yigirma sakkizgacha.", 'А теперь главное: посмотри на её тень на горизонтальной оси. Это и есть ответ, от трёх до двадцати восьми.', 'And now the main thing: look at its shadow on the horizontal axis. That is the answer, from three to twenty eight.'),
  ],
}

const LOG5 = (x) => Math.log(x - 3) / Math.log(5)

function Screen4({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S4.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S4.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  const [pt, setPt] = useState(null)
  const graphPhase = Math.min(phase, 3)

  return (
    <Frame meta={S4} screen={screen} audio={audio} solved={solved} {...rest}>
      <Cols l={1.9} r={1} align="start">
        <Col>
          <Panel tone="paper" pad={10} style={{ minWidth: 0 }}>
            <GraphProjection
              fn={LOG5}
              xDomain={[1, 34]}
              yDomain={[-3, 3]}
              asymptote={3}
              hline={2}
              cross={28}
              shade={{ from: 3, to: 28 }}
              shadeLabel="(3; 28)"
              xTicks={[{ v: 3 }, { v: 4 }, { v: 28 }]}
              yTicks={[{ v: 0 }, { v: 2 }]}
              phase={graphPhase}
              height={168}
              probe
              onProbe={setPt}
            />
          </Panel>
        </Col>
        <Col>
          <Tag tone="graph">{'y = log\u2085(x \u2212 3)'}</Tag>
          {/* Tortiladigan nuqtaning o'qishi + BONUS: bitta panel, balandlik tejaladi */}
          {phase >= 3 ? (
            <Panel tone="quiet" pad={10} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Tag tone="quiet">{t(UI.dragMe)}</Tag>
              {pt && isFinite(pt.y) ? (
                <span className="g11-expr g11-expr-sm">
                  {'x = ' + pt.x.toFixed(1).replace('.', ',') + '   \u2192   ' + pt.y.toFixed(2).replace('.', ',') + '   '}
                  <span className={pt.y < 2 ? 'g11-ok-text' : 'g11-tip-text'}>{pt.y < 2 ? '< 2' : '\u2265 2'}</span>
                </span>
              ) : (
                <span className="g11-expr g11-expr-sm g11-dim">{'x = ?'}</span>
              )}
            </Panel>
          ) : null}
          {phase >= 4 ? (
            <Insight label={t(UI.bonusLabel)} tone="graph">{t(UI.bonus)}</Insight>
          ) : null}
        </Col>
      </Cols>
      {phase >= 4 ? (
        <div className="g11-in">
          <Probe audio={audio} data={S4.probe} cols={2} fbSlot={52} dense
            onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: 'log_domain' }) }} />
        </div>
      ) : null}
    </Frame>
  )
}

// ============================================================
// SLAYD 5. USUL c = logₐ a^c va 1-QOIDA. Savol-oldin-qoida.
// ============================================================
const S5 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("O'ngda ham logarifm", 'Справа тоже логарифм', 'The right side too'),
  rows: ['log₅(x − 3) < 2', '2 = log₅ 25', 'log₅(x − 3) < log₅ 25'],
  btnNext: L('Keyingi qadam', 'Следующий шаг', 'Next step'),
  probe: {
    question: L(
      "Asos 5 birdan katta, funksiya o'sadi. Unda argumentlar uchun nima to'g'ri?",
      'Основание 5 больше единицы, функция возрастает. Что тогда верно для аргументов?',
      'The base 5 is greater than one, the function increases. What is then true for the arguments?',
    ),
    items: [
      { id: 'a', label: L("katta logarifm — katta argument, ishora o'sha", 'больший логарифм — больший аргумент, знак тот же', 'bigger logarithm means bigger argument, the sign stays'), correct: true },
      { id: 'b', label: L('katta logarifm — kichik argument', 'больший логарифм — меньший аргумент', 'bigger logarithm means smaller argument'), hint: L("Bu kamayuvchi funksiya uchun to'g'ri. Asos besh birdan katta, chiziq yuqoriga ketadi — oldingi ekrandagi grafikka qaytib qarang.", 'Это верно для убывающей функции. Основание пять больше единицы, кривая идёт вверх — вернись к графику на прошлом экране.', 'That is true for a decreasing function. The base five is greater than one, the curve goes up — go back to the graph on the previous screen.') },
      { id: 'c', label: L("argumentlarni solishtirib bo'lmaydi", 'аргументы сравнить нельзя', 'the arguments cannot be compared'), hint: L('Mumkin. Funksiya monoton: har bir qiymatga aynan bitta argument to\'g\'ri keladi.', 'Можно. Функция монотонна: каждому значению отвечает ровно один аргумент.', 'You can. The function is monotone: each value corresponds to exactly one argument.') },
      { id: 'd', label: L('argumentlar teng', 'аргументы равны', 'the arguments are equal'), hint: L('Tenglik yo\'q, tengsizlik bor.', 'Равенства нет, есть неравенство.', 'There is no equality here, there is an inequality.') },
    ],
  },
  rule: {
    badge: L('1-QOIDA. ASOS BIRDAN KATTA', 'ПРАВИЛО 1. ОСНОВАНИЕ БОЛЬШЕ ЕДИНИЦЫ', 'RULE 1. BASE GREATER THAN ONE'),
    lawLabel: L('QONUN', 'ЗАКОН', 'LAW'),
    law: 'log\u2090 f(x) < c  \u27fa  0 < f(x) < a\u1d9c',
    lines: [
      L("c = logₐ aᶜ  —  o'ngda ham logarifm, va aᶜ > 0", 'c = logₐ aᶜ — справа тоже логарифм, и aᶜ > 0', 'c = logₐ aᶜ — the right side is a logarithm too, and aᶜ > 0'),
      L("a > 1: o'sadi — katta logarifmga katta argument", 'a > 1: возрастает — большему логарифму больший аргумент', 'a > 1: increasing — a bigger logarithm has a bigger argument'),
      L('logₐ f(x) < c  ⟺  0 < f(x) < aᶜ  ·  nol kerak: f yuqoridan qisilgan', 'logₐ f(x) < c ⟺ 0 < f(x) < aᶜ  ·  ноль нужен: f зажат сверху', 'logₐ f(x) < c ⟺ 0 < f(x) < aᶜ  ·  the zero is needed: f is bounded above'),
      L('logₐ f(x) > c  ⟺  f(x) > aᶜ  ·  nol kerak emas: aᶜ musbat', 'logₐ f(x) > c ⟺ f(x) > aᶜ  ·  ноль не нужен: aᶜ положительно', 'logₐ f(x) > c ⟺ f(x) > aᶜ  ·  no zero needed: aᶜ is positive'),
    ],
    example: L('namuna: masalalar to\'plami, 2-qism, 100-bet, № 32(3)', 'образец: задачник, часть 2, стр. 100, № 32(3)', 'source: exercise book, part 2, p. 100, no. 32(3)'),
  },
  audio: [
    A('mount', "Rasmni ko'rdik. Endi shuning o'zini yozuv bilan olamiz.", 'Картинку мы увидели. Теперь получим то же самое записью.', 'We have seen the picture. Now let us get the same thing in writing.'),
    A('toLog', "Chapda logarifm, o'ngda oddiy son. Sondan logarifm yasaymiz: ikki — asosi besh bo'lgan yigirma beshning logarifmi.", 'Слева логарифм, справа обычное число. Сделаем из числа логарифм: два — это логарифм двадцати пяти по основанию пять.', 'On the left a logarithm, on the right an ordinary number. Let us turn the number into a logarithm: two is the logarithm of twenty five to the base five.'),
    A('same', "Endi chapda ham, o'ngda ham bir xil asosli logarifmlar. Asos birdan katta, chiziq yuqoriga ketadi.", 'Теперь слева и справа логарифмы по одному основанию. Основание больше единицы, кривая идёт вверх.', 'Now both sides are logarithms with the same base. The base is greater than one, the curve goes up.'),
    A('rule', "Aynan shunday. Katta logarifmning argumenti katta, demak argumentlar orasidagi ishora o'sha. Va agar argument sondan kichik chiqsa, uning noldan katta ekanini yozib qo'yamiz.", 'Именно так. У большего логарифма больший аргумент, значит знак между аргументами тот же. И если аргумент оказался меньше числа, дописываем, что он больше нуля.', 'Exactly. A bigger logarithm has a bigger argument, so the sign between the arguments stays. And if the argument turned out smaller than the number, we add that it is greater than zero.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S5.audio, rest.lang, ['rule']), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S5.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  const open = Math.min(phase + 1, S5.rows.length)

  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={solved} {...rest}>
      <Cols l={1} r={1} align="start">
        <Col>
          <Panel>
            <div className="g11-note-lines">
              {S5.rows.map((r, i) => (
                <div
                  key={i}
                  className={'g11-expr g11-expr-row' + (i === open - 1 && i > 0 ? ' g11-drop' : '')}
                  style={{ minHeight: 34, opacity: i < open ? 1 : 0.16, display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span className="g11-mono" style={{ fontSize: '.6em', color: T.ink3, minWidth: 14, fontWeight: 700 }}>{i + 1}</span>
                  <span className={i === 1 && open >= 2 ? 'g11-accent-pulse' : undefined}>
                    <Expr size="row" style={{ textAlign: 'left' }}>{i < open ? r : '?'}</Expr>
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </Col>
        <Col>
          {phase >= 3 ? (
            <RuleGate probe={S5.probe} rule={S5.rule} audio={audio} onStep={audio.step}
              onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: 'base_direction' }) }} />
          ) : (
            <Panel tone="quiet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>
              <Tag tone="quiet">{'\u2026'}</Tag>
            </Panel>
          )}
        </Col>
      </Cols>
    </Frame>
  )
}

// ============================================================
// SLAYD 6. YANGI HOLAT: asos birdan kichik. Savol + prognoz.
// ============================================================
const S6 = {
  eyebrow: L('YANGI HOLAT', 'НОВЫЙ СЛУЧАЙ', 'A NEW CASE'),
  title: L('Asos birdan kichik', 'Основание меньше единицы', 'The base is less than one'),
  was: { label: L('edi', 'было', 'before'), expr: 'log₅(x − 3) < 2' },
  now: { label: L("bo'ldi", 'стало', 'now'), expr: 'log₀,₅(2x − 4) > −1' },
  btnShow: L("Yangi yozuvni ko'rsatish", 'Показать новую запись', 'Show the new record'),
  probe1: {
    question: L('Ikkinchi yozuv birinchisidan nimasi bilan farq qiladi?', 'Чем вторая запись отличается от первой?', 'How does the second record differ from the first?'),
    items: [
      { id: 'a', label: L('asos birdan kichik', 'основание меньше единицы', 'the base is less than one'), correct: true },
      { id: 'b', label: L('tengsizlik ishorasi boshqa', 'знак неравенства другой', 'the inequality sign is different'), hint: L("Ishora haqiqatan boshqa. Lekin u birinchi holatda ham har qanday bo'lishi mumkin edi. Chaproqqa qarang.", 'Знак действительно другой. Но он мог быть любым и в первом случае. Смотри левее.', 'The sign is indeed different. But it could have been anything in the first case too. Look further left.') },
      { id: 'c', label: L('argumentda ikki bor', 'в аргументе двойка', 'there is a two in the argument'), hint: L("Argumentdagi ikki hech narsani o'zgartirmaydi: bu ham shunday chiziqli argument.", 'Двойка в аргументе ничего не меняет: это такой же линейный аргумент.', 'The two in the argument changes nothing: it is the same kind of linear argument.') },
      { id: 'd', label: L('o\'ngda manfiy son', 'справа отрицательное', 'the right side is negative'), hint: L('O\'ngdagi minusni hisoblashni bilamiz, buni tayanchda tekshirdik. Asosga qarang.', 'Минус справа считать умеем, мы это проверили на опоре. Смотри на основание.', 'We know how to handle the minus on the right, we checked that in the basics. Look at the base.') },
    ],
  },
  probe2: {
    question: L('Nima chiqadi?', 'Что получится?', 'What will come out?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '(2; 3)' },
      { id: 'b', label: '(3; +∞)' },
      { id: 'c', label: '(2; +∞)' },
      { id: 'd', label: '(−∞; 3)' },
    ],
  },
  audio: [
    A('mount', "Birinchi qoida tayyor. Lekin u har doim ishlamaydi — nima o'zganiga qarang.", 'Первое правило готово. Но оно работает не всегда — смотри, что изменилось.', 'The first rule is ready. But it does not always work — look at what has changed.'),
    A('now', 'Oldingi misolda asos birdan katta edi. Endi esa nol butun besh o\'ndan.', 'В прошлом примере основание было больше единицы. А теперь ноль целых пять десятых.', 'In the previous example the base was greater than one. Now it is zero point five.'),
    A('q1', 'Bu yozuv oldingisidan nimasi bilan farq qiladi?', 'Чем эта запись отличается от прежней?', 'How does this record differ from the previous one?'),
    A('q2', 'Sizningcha nima chiqadi? Shunchaki taxmin qiling.', 'Как думаешь, что получится? Просто предположи.', 'What do you think will come out? Just make a guess.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S6.audio, rest.lang, ['q2']), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S6.audio, rest.lang))
  const [q1done, setQ1done] = useState(false)
  const [picked, setPicked] = useState(null)
  const shown = phase >= 1

  return (
    <Frame meta={S6} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <Cols l={1} r={1} align="start">
        <Col>
          <Panel tone="quiet" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Tag tone="quiet">{t(UI.was)}</Tag>
            <Expr size="big" style={{ textAlign: 'left' }}>{S6.was.expr}</Expr>
            {shown ? <BaseSlider height={78} initial={5} min={1.1} max={8} step={0.1} mark={t(UI.ourBase) + ' a = 5'} /> : null}
          </Panel>
        </Col>
        <Col>
          <Panel
            tone={shown ? 'paper' : 'quiet'}
            className={shown ? 'g11-reveal' : undefined}
            style={{ display: 'flex', flexDirection: 'column', gap: 7, opacity: shown ? 1 : 0.3 }}
          >
            <Tag tone="accent">{t(UI.now)}</Tag>
            <span className={shown ? 'g11-accent-pulse' : undefined}>
              <Expr size="big" style={{ textAlign: 'left' }}>{shown ? S6.now.expr : '?'}</Expr>
            </span>
            {/* Asosni SURIB ko'rish: monotonlik qachon almashishini o'quvchi
                o'zi topadi. Ilgari bu so'z bilan aytilardi. */}
            {shown ? <BaseSlider height={78} initial={0.5} min={0.1} max={0.9} step={0.05} mark={t(UI.ourBase) + ' a = 0,5'} /> : null}
          </Panel>
        </Col>
      </Cols>
      {phase >= 2 && !q1done ? (
        <Probe audio={audio} data={S6.probe1} cols={2} fbSlot={58} dense
          onSolved={(r) => { setQ1done(true); audio.step('q2'); onAnswer({ ...r, screen, tag: 'base_direction' }) }} />
      ) : null}
      {q1done ? (
        <div className="g11-in">
          <Probe audio={audio} data={S6.probe2} cols={4} fbSlot={54} unscored dense
            onSolved={(r) => { setPicked(r.picked); onAnswer({ ...r, screen, predict: true }) }} />
        </div>
      ) : null}
    </Frame>
  )
}

// ============================================================
// SLAYD 7. IKKI NUQTA va IKKI TO'PLAM. Darsning ma'no burilishi.
// Javobni o'quvchi O'ZI yozadi.
// ============================================================
const S7 = {
  eyebrow: L('NUQTALAR BILAN TEKSHIRAMIZ', 'ПРОВЕРИМ ТОЧКАМИ', 'LET US CHECK WITH POINTS'),
  title: L('Ikki nuqta \u2014 ikki javob', 'Две точки \u2014 два ответа', 'Two points, two answers'),
  expr: 'log₀,₅(2x − 4) > −1',
  points: [
    { id: 'p25', label: 'x = 2,5', calc: 'log₀,₅ 1 = 0', verdict: 'in', step: 'p1' },
    { id: 'p4', label: 'x = 4', calc: 'log₀,₅ 4 = −2', verdict: 'out', step: 'p2' },
  ],
  answer: {
    numbers: ['2', '3', '4', '+∞'],
    value: ['2', '3'],
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '3|+∞', hint: L("x = 4 ni qo'ying. Chapda minus ikki chiqadi, kerak esa minus birdan katta. Minus ikki minus birdan kichik.", 'Подставь x = 4. Слева получается минус два, а нужно больше минус единицы. Минус два меньше минус единицы.', 'Substitute x = 4. The left side gives minus two, but we need greater than minus one. Minus two is less than minus one.') },
      { key: '*', hint: L('Ikki nuqta bilan tekshiring: ikki yarim kirishi kerak, to\'rt esa yo\'q.', 'Проверь двумя точками: два с половиной должно входить, четыре — нет.', 'Check with two points: two and a half must be in, four must not.') },
    ],
  },
  audio: [
    A('mount', 'Siz javobni taxmin qildingiz. Uni nuqtalar bilan tekshiramiz.', 'Ты предположил ответ. Проверим его точками.', 'You made a guess. Let us check it with points.'),
    A('p1', 'Birinchi javobdan nuqta olamiz. Chapda nol chiqdi. Nol minus birdan katta, demak ikki yarim kiradi.', 'Берём точку из первого ответа. Слева получился ноль. Ноль больше минус единицы, значит два с половиной входит.', 'Take a point from the first answer. The left side gives zero. Zero is greater than minus one, so two and a half is a solution.'),
    A('p2', 'Endi ikkinchi javobdan nuqta. Chapda minus ikki. Minus ikki minus birdan katta emas, demak to\'rt kirmaydi.', 'Теперь точку из второго ответа. Слева минус два. Минус два не больше минус единицы, значит четвёрка не входит.', 'Now a point from the second answer. The left side is minus two. Minus two is not greater than minus one, so four is not a solution.'),
    A('write', 'Ikki yarim faqat birinchi javobda, to\'rt esa faqat ikkinchisida. Javobni o\'zingiz yozing.', 'Два с половиной есть только в первом ответе, четвёрка — только во втором. Запиши ответ сам.', 'Two and a half is only in the first answer, four only in the second. Write the answer yourself.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S7.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S7.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  const cards = [
    { tag: UI.answerA, set: { from: 2, to: 3, tone: 'graph' }, txt: '(2; 3)', p: S7.points[0] },
    { tag: UI.answerB, set: { from: 3, to: null, tone: 'tip' }, txt: '(3; +\u221e)', p: S7.points[1] },
  ]

  return (
    <Frame meta={S7} screen={screen} audio={audio} solved={solved} {...rest}>
      <Expr size="row">{S7.expr}</Expr>
      <Cols l={1} r={1} align="start">
        {cards.map((c, i) => {
          const on = phase >= i + 1
          return (
            <Col key={i}>
              <Panel tone={on ? 'paper' : 'quiet'} className={on ? 'g11-reveal' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: on ? 1 : 0.32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <Tag tone={i === 0 ? 'graph' : 'quiet'}>{t(c.tag)}</Tag>
                  <span className="g11-expr g11-expr-row g11-graph-text">{c.txt}</span>
                </div>
                <SolutionLine axis={AXIS_2} sets={[c.set]} marks={on ? [{ v: i === 0 ? 2.5 : 4, tone: 'accent' }] : []} />
                {/* Qo'yish AJRATILGAN satrlarda: nima qo'ydik, nima chiqdi,
                    nima kerak, xulosa. Ilgari hammasi bir satrda yopishgan edi. */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div className="g11-expr g11-expr-sm" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ color: T.ink3 }}>{t(UI.headPut)}</span>
                    <span className={on ? 'g11-drop' : 'g11-dim'}>{on ? c.p.label : '?'}</span>
                  </div>
                  <div className="g11-expr g11-expr-sm" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ color: T.ink3 }}>{t(UI.headGot)}</span>
                    <span className={on ? 'g11-drop' : 'g11-dim'}>{on ? c.p.calc : '?'}</span>
                  </div>
                  {/* Xulosa yorlig'i AYNAN shu satrda: alohida satr 28px
                      olardi va ekran sig'masdi. */}
                  <div className="g11-expr g11-expr-sm" style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: T.ink3 }}>{t(UI.need)}</span>
                    <span className="g11-graph-text">{'> \u22121'}</span>
                    <Slot mh={0}>
                      {on ? <Tag tone={c.p.verdict === 'in' ? 'ok' : 'tip'}>{c.p.verdict === 'in' ? t(TP_IN) : t(TP_OUT)}</Tag> : null}
                    </Slot>
                  </div>
                </div>
              </Panel>
            </Col>
          )
        })}
      </Cols>
      {phase >= 3 ? (
        <div className="g11-in" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* Xulosa javob YOZILGANDAN keyin chiqadi. Ilgari u konstruktordan
              YUQORIDA turardi: qaysi variant to'g'ri ekani aytilgan, variant
              qiymati esa kartochkada ko'rinib turgan -- o'quvchiga ko'chirib
              yozish qolardi. */}
          {solved ? (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
              <span className="g11-expr g11-expr-sm g11-ok-text g11-drop">{t(UI.soAnswer) + ': A'}</span>
            </div>
          ) : null}
          <AnswerInterval
            numbers={S7.answer.numbers}
            answer={S7.answer.value}
            wrongs={S7.answer.wrongs}
            prompt={S7.answer.prompt}
            padSlot={34}
            fbSlot={54}
            audio={audio}
            onSolved={(r) => { if (r.correct) { setSolved(true); onAnswer({ screen, correct: true, tag: 'base_direction' }) } }}
          />
        </div>
      ) : null}
    </Frame>
  )
}

// ============================================================
// SLAYD 8. 2-QOIDA va BITTA JAMLANMA.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Bitta qoida', 'Одно правило', 'One rule'),
  rows: ['−1 = log₀,₅ 2', 'log₀,₅(2x − 4) > log₀,₅ 2'],
  btnNext: L('Keyingi qadam', 'Следующий шаг', 'Next step'),
  probe: {
    question: L("Argumentlar uchun nima to'g'ri?", 'Что верно для аргументов?', 'What is true for the arguments?'),
    items: [
      { id: 'a', label: L("katta logarifm — kichik argument, ishora o'zgaradi", 'больший логарифм — меньший аргумент, знак меняется', 'bigger logarithm means smaller argument, the sign changes'), correct: true },
      { id: 'b', label: L('katta logarifm — katta argument', 'больший логарифм — больший аргумент', 'bigger logarithm means bigger argument'), hint: L("Bu o'suvchi funksiya uchun. Bu yerda asos birdan kichik, chiziq pastga ketadi — tayanchni eslang.", 'Это для возрастающей функции. Здесь основание меньше единицы, кривая идёт вниз — вспомни опору.', 'That is for an increasing function. Here the base is less than one, the curve goes down — recall the basics.') },
      { id: 'c', label: L("o'ngdagi songa bog'liq", 'зависит от числа справа', 'it depends on the number on the right'), hint: L("Bog'liq emas. Minus birni plyus birga o'zgartiring — yo'nalish o'sha qoladi.", 'Не зависит. Поменяй минус один на плюс один — направление останется тем же.', 'It does not. Change minus one to plus one — the direction stays the same.') },
      { id: 'd', label: L('logarifm aniqlanmagan', 'логарифм не определён', 'the logarithm is undefined'), hint: L("Aniqlangan. Nol butun besh o'ndan — mumkin bo'lgan asos: musbat va birga teng emas.", 'Определён. Ноль целых пять десятых — допустимое основание: положительное и не равно единице.', 'It is defined. Zero point five is a valid base: positive and not equal to one.') },
    ],
  },
  rule: {
    badge: L('2-QOIDA. ASOS BIRDAN KICHIK', 'ПРАВИЛО 2. ОСНОВАНИЕ МЕНЬШЕ ЕДИНИЦЫ', 'RULE 2. BASE LESS THAN ONE'),
    lawLabel: L('QONUN', 'ЗАКОН', 'LAW'),
    law: 'log\u2090 f(x) > c  \u27fa  0 < f(x) < a\u1d9c',
    lines: [
      L("usul o'sha: c = logₐ aᶜ", 'приём тот же: c = logₐ aᶜ', 'the same device: c = logₐ aᶜ'),
      L('0 < a < 1: kamayadi — katta logarifmga KICHIK argument', '0 < a < 1: убывает — большему логарифму МЕНЬШИЙ аргумент', '0 < a < 1: decreasing — a bigger logarithm has a SMALLER argument'),
      L('logₐ f(x) > c  ⟺  0 < f(x) < aᶜ  ·  nol kerak: f yuqoridan qisilgan', 'logₐ f(x) > c ⟺ 0 < f(x) < aᶜ  ·  ноль нужен: f зажат сверху', 'logₐ f(x) > c ⟺ 0 < f(x) < aᶜ  ·  the zero is needed: f is bounded above'),
      L('logₐ f(x) < c  ⟺  f(x) > aᶜ  ·  nol kerak emas: aᶜ musbat', 'logₐ f(x) < c ⟺ f(x) > aᶜ  ·  ноль не нужен: aᶜ положительно', 'logₐ f(x) < c ⟺ f(x) > aᶜ  ·  no zero needed: aᶜ is positive'),
    ],
    example: L("namuna: masalalar to'plami, 2-qism, 100-bet, № 32(4)", 'образец: задачник, часть 2, стр. 100, № 32(4)', 'source: exercise book, part 2, p. 100, no. 32(4)'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('DARSNING BITTA QOIDASI', 'ОДНО ПРАВИЛО УРОКА', 'THE ONE RULE OF THIS LESSON'),
    lawLabel: L('QONUN', 'ЗАКОН', 'LAW'),
    law: 'c = log\u2090 a\u1d9c',
    lines: [
      L("1. o'ngni logarifmga aylantir: c = logₐ aᶜ,  aᶜ > 0", '1. справа сделай логарифм: c = logₐ aᶜ, aᶜ > 0', '1. make the right side a logarithm: c = logₐ aᶜ, aᶜ > 0'),
      L("2. logarifmlarni tashla: o'sadi — ishora o'sha, kamayadi — boshqa", '2. отбрось логарифмы: возрастает — знак тот же, убывает — другой', '2. drop the logarithms: increasing — same sign, decreasing — opposite'),
      L('3. argument yuqoridan qisilgan — 0 < f(x) < aᶜ deb yoz', '3. аргумент зажат сверху — пиши 0 < f(x) < aᶜ', '3. argument bounded above — write 0 < f(x) < aᶜ'),
      L('4. javobni ichkaridagi va tashqaridagi nuqta bilan tekshir', '4. проверь ответ точкой внутри и точкой снаружи', '4. check the answer with a point inside and a point outside'),
    ],
  },
  audio: [
    A('mount', "Nuqtalar javobni ko'rsatdi. Uni o'sha usul bilan, yozuv orqali olamiz.", 'Точки показали ответ. Получим его записью, тем же приёмом.', 'The points showed the answer. Let us get it in writing, with the same device.'),
    A('toLog', "Minus bir — asosi nol butun besh o'ndan bo'lgan ikkining logarifmi.", 'Минус единица — это логарифм двойки по основанию ноль целых пять десятых.', 'Minus one is the logarithm of two to the base zero point five.'),
    A('q', "Endi ikki tomon ham logarifm. Asos birdan kichik, chiziq pastga ketadi. Argumentlar uchun nima to'g'ri?", 'Теперь обе части логарифмы. Основание меньше единицы, кривая идёт вниз. Что верно для аргументов?', 'Now both sides are logarithms. The base is less than one, the curve goes down. What is true for the arguments?'),
    A('rule', "To'g'ri. Katta logarifmning argumenti kichik, shuning uchun argumentlar orasidagi ishora o'zgaradi.", 'Верно. У большего логарифма меньший аргумент, поэтому знак между аргументами меняется.', 'Correct. A bigger logarithm has a smaller argument, so the sign between the arguments changes.'),
    A('both', 'Endi ikkala holatni bitta qoidaga yig\'ing.', 'А теперь собери оба случая в одно правило.', 'Now combine both cases into one rule.'),
  ],
}

function Screen8({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S8.audio, rest.lang, ['rule', 'both']), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S8.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  const open = Math.min(phase + 1, S8.rows.length)

  return (
    <Frame meta={S8} screen={screen} audio={audio} solved={solved} {...rest}>
      {/* Ikki holat yonma-yon: chapda o'suvchi, o'ngda kamayuvchi */}
      <Cols l={1} r={1} align="start">
        <Col>
          <Panel tone="quiet" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Tag tone="graph">{t(UI.caseUp)}</Tag>
            <span className="g11-expr g11-expr-sm g11-wrap"><Fx>{t(S5.rule.lines[1])}</Fx></span>
          </Panel>
        </Col>
        <Col>
          <Panel tone="quiet" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Tag tone="accent">{t(UI.caseDown)}</Tag>
            <span className="g11-expr g11-expr-sm g11-wrap"><Fx>{t(S8.rule.lines[1])}</Fx></span>
          </Panel>
        </Col>
      </Cols>
      <Panel>
        <div className="g11-note-lines">
          {S8.rows.map((r, i) => (
            <div key={i} className={'g11-expr g11-expr-row' + (i === open - 1 && i > 0 ? ' g11-drop' : '')} style={{ minHeight: 32, opacity: i < open ? 1 : 0.16 }}>
              <Fx>{i < open ? r : '?'}</Fx>
            </div>
          ))}
        </div>
      </Panel>
      {phase >= 2 ? (
        <div className="g11-reveal">
          <RuleGate probe={S8.probe} rule={S8.rule} swap={S8.swap} audio={audio} onStep={audio.step}
            onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: 'base_direction' }) }} />
        </div>
      ) : (
        <Slot mh={44} className="g11-await" />
      )}
    </Frame>
  )
}

// ============================================================
// SLAYD 9. BELGINI O'ZI QO'YADI. Kuzatishdan harakatga o'tish.
// ============================================================
const S9 = {
  eyebrow: L("O'ZINGIZ QO'YING", 'ПОСТАВЬ САМ', 'PLACE IT YOURSELF'),
  title: L("Belgini qo'ying", 'Поставь знак', 'Place the sign'),
  left: 'log₀,₅(2x − 4) > log₀,₅ 2',
  template: ['0 < 2x − 4', { slot: 0 }, '2'],
  signs: ['<', '>'],
  answer: '<',
  checkNote: L('Tekshiruv: x = 2,5 → chapda kiradi, o\'ngda 1 ikkidan kichik', 'Проверка: x = 2,5 → слева входит, справа 1 меньше 2', 'Check: x = 2,5 → on the left it is a solution, on the right 1 is less than 2'),
  wrongs: [
    { key: '>', hint: L("Ikki yarimni qo'ying. Chapda bu yechim, o'ngda esa bir ikkidan katta chiqadi — yolg'on. Demak yozuvlar teng kuchli emas.", 'Подставь два с половиной. Слева это решение, а справа получается один больше двух — ложь. Значит записи не равносильны.', 'Substitute two and a half. On the left it is a solution, on the right you get one greater than two, which is false. So the records are not equivalent.') },
  ],
  probe: {
    question: L("Argumentlar orasidagi ishora yo'nalishi nimaga bog'liq?", 'От чего зависит направление знака между аргументами?', 'What does the direction of the sign between the arguments depend on?'),
    items: [
      { id: 'a', label: L("funksiya o'sadimi yoki kamayadimi", 'возрастает функция или убывает', 'whether the function increases or decreases'), correct: true },
      { id: 'b', label: L("o'ngdagi ishoraga", 'от знака справа', 'on the sign on the right'), hint: L("O'ngda minus bir edi. Lekin plyus bir bo'lganda ham yo'nalish o'sha qolardi.", 'Справа было минус один. Но направление осталось бы тем же и при плюс один.', 'On the right it was minus one. But the direction would stay the same with plus one too.') },
      { id: 'c', label: L('argumentning ishorasiga', 'от знака аргумента', 'on the sign of the argument'), hint: L("Argument o'zimiz qo'yayotgan shart bo'yicha musbat. U hech narsani hal qilmaydi.", 'Аргумент положителен по условию, которое мы ставим сами. Он ничего не решает.', 'The argument is positive by the condition we impose ourselves. It decides nothing.') },
      { id: 'd', label: L("boshlang'ich ishoraga", 'от исходного знака', 'on the original sign'), hint: L("Boshlang'ich ishorani aynan o'zimiz o'zgartiramiz. Savol — nega bunga haqlimiz.", 'Исходный знак мы как раз и меняем. Вопрос в том, почему нам можно.', 'The original sign is exactly what we change. The question is why we are allowed to.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "O'ng yozuv chapiga teng kuchli bo'lishi uchun ishorani qo'ying.", 'Поставь знак так, чтобы правая запись была равносильна левой.', 'Place the sign so that the right record is equivalent to the left one.'),
    A('checked', 'Bo\'ldi. Endi ta\'riflang: yo\'nalish nimaga bog\'liq?', 'Получилось. Теперь сформулируй: от чего зависит направление?', 'Done. Now put it into words: what does the direction depend on?'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S9.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [placed, setPlaced] = useState(false)
  const [solved, setSolved] = useState(false)

  return (
    <Frame meta={S9} screen={screen} audio={audio} solved={solved} {...rest}>
      <Cols l={1.2} r={1} align="start">
        <Col>
          <Expr size="mid" style={{ textAlign: 'left' }}>{S9.left}</Expr>
          <SignFill
            template={S9.template}
            signs={S9.signs}
            answer={S9.answer}
            checkNote={S9.checkNote}
            wrongs={S9.wrongs}
            audio={audio}
            onStep={(n) => { audio.step(n); if (n === 'checked') setPlaced(true) }}
            onSolved={() => setPlaced(true)}
          />
        </Col>
        <Col>
          {placed ? (
            <div className="g11-in">
              <Probe audio={audio} data={S9.probe} cols={1} fbSlot={58} dense
                onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: 'base_direction' }) }} />
            </div>
          ) : (
            <Panel tone="quiet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>
              <Tag tone="quiet">{'\u2026'}</Tag>
            </Panel>
          )}
        </Col>
      </Cols>
    </Frame>
  )
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ: to'liq tahlil.
// Son o'qi FAQAT xato qadamda va javobdan keyin.
// ============================================================
const ACTIONS_10 = [
  { id: 'toLog', label: L("o'ngni logarifmga aylantirish", 'справа сделать логарифм', 'make the right side a logarithm') },
  { id: 'dropSame', label: L("logarifmlarni tashlash, ishora o'sha", 'отбросить логарифмы, знак тот же', 'drop the logarithms, same sign') },
  { id: 'dropFlip', label: L("logarifmlarni tashlash, ishora o'zgaradi", 'отбросить логарифмы, знак меняется', 'drop the logarithms, sign changes') },
  { id: 'solve', label: L('tengsizlikni yechish', 'решить неравенство', 'solve the inequality') },
]

const NOT_YET = L(
  "O'ngda hozircha oddiy son. Argumentlarni solishtirish uchun hali hech narsa yo'q.",
  'Справа пока обычное число. Сравнивать аргументы ещё не с чем.',
  'The right side is still an ordinary number. There is nothing to compare arguments with yet.',
)

const S10 = {
  eyebrow: L('TAHLIL', 'РАЗБОР', 'WORKED SOLUTION'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: 'log₀,₅(2x − 4) > −1',
  steps: [
    {
      action: 'toLog',
      to: 'log₀,₅(2x − 4) > log₀,₅ 2',
      wrongs: [
        { action: 'dropSame', hint: NOT_YET },
        { action: 'dropFlip', hint: NOT_YET },
        { action: 'solve', hint: NOT_YET },
      ],
    },
    {
      action: 'dropFlip',
      to: '0 < 2x − 4 < 2',
      wrongs: [
        {
          action: 'dropSame',
          set: { from: 3, to: null },
          hint: L("Asos birdan kichik, chiziq pastga ketadi. Qarang: to'plam uchdan o'ngga ketdi. x = 4 ni boshlang'ich tengsizlikka qo'ying — kirmaydi.", 'Основание меньше единицы, кривая идёт вниз. Смотри: множество уехало вправо от тройки. Подставь x = 4 в исходное — не входит.', 'The base is less than one, the curve goes down. Look: the set moved to the right of three. Substitute x = 4 into the original — it is not a solution.'),
        },
        { action: 'toLog', hint: L("O'ng tomon allaqachon logarifm.", 'Правая часть уже логарифм.', 'The right side is already a logarithm.') },
        { action: 'solve', hint: L('Avval logarifmlarni tashlash kerak.', 'Сначала надо отбросить логарифмы.', 'You must drop the logarithms first.') },
      ],
    },
    {
      action: 'solve',
      to: '2 < x < 3',
      wrongs: [
        { action: 'dropSame', hint: L('Logarifmlar allaqachon tashlangan.', 'Логарифмы уже отброшены.', 'The logarithms are already dropped.') },
        { action: 'dropFlip', hint: L('Logarifmlar allaqachon tashlangan.', 'Логарифмы уже отброшены.', 'The logarithms are already dropped.') },
        { action: 'toLog', hint: L('Logarifm qolmadi.', 'Логарифмов больше нет.', 'There are no logarithms left.') },
      ],
    },
  ],
  answer: {
    numbers: ['2', '3', '4', '+∞'],
    value: ['2', '3'],
    prompt: L('Javobni imtihonda yozganingizdek yozing', 'Запиши ответ так, как записал бы на экзамене', 'Write the answer the way you would on the exam'),
    wrongs: [{ key: '*', hint: L('Oxirgi satrga qarang: ikkidan uchgacha.', 'Смотри на последнюю строку: от двух до трёх.', 'Look at the last line: from two to three.') }],
  },
  audio: [
    A('mount', 'Siz qoidani ta\'rifladingiz. Bu misolni to\'liq o\'tamiz.', 'Ты сформулировал правило. Пройдём этот пример целиком.', 'You put the rule into words. Let us go through this example completely.'),
    A('start', 'Asos birdan kichik. Nimadan boshlashni tanlang.', 'Основание меньше единицы. Выбери, с чего начать.', 'The base is less than one. Choose where to start.'),
    A('step4', 'Endi javobni imtihonda yozganingizdek yozing.', 'Теперь запиши ответ так, как записал бы на экзамене.', 'Now write the answer the way you would on the exam.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S10.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S10} screen={screen} audio={audio} solved={solved} {...rest}>
      <TransformChain
        split
        start={S10.start}
        steps={S10.steps}
        actions={ACTIONS_10}
        axis={AXIS_2}
        correctSet={{ from: 2, to: 3 }}
        answer={S10.answer}
        audio={audio}
        onStep={audio.step}
        onSolved={() => { setSolved(true); onAnswer({ screen, correct: true, tag: 'base_direction' }) }}
      />
    </Frame>
  )
}

// ============================================================
// SLAYD 11. MUSTAQIL, SON O'QISIZ. Ikkala xato birga ishlaydi.
// Bu ekran ataylab imtihondagidek: o'q YO'Q, razbor faqat son bilan.
// ============================================================
const ACTIONS_11 = [
  { id: 'dropSame', label: L("logarifmlarni tashlash, ishora o'sha", 'отбросить логарифмы, знак тот же', 'drop the logarithms, same sign') },
  { id: 'dropFlip', label: L("logarifmlarni tashlash, ishora o'zgaradi", 'отбросить логарифмы, знак меняется', 'drop the logarithms, sign changes') },
  { id: 'solve', label: L('ko\'paytuvchilarga ajratish', 'разложить на множители', 'factor it') },
]

const S11 = {
  eyebrow: L('MUSTAQIL', 'САМОСТОЯТЕЛЬНО', 'ON YOUR OWN'),
  title: L('Tengsizlikni yeching', 'Реши неравенство', 'Solve the inequality'),
  start: 'log₀,₅ x² > log₀,₅ 3x',
  hint: L("Asos nol butun besh o'ndan. Chiziq yuqoriga ketadimi yoki pastga?", 'Основание ноль целых пять десятых. Кривая идёт вверх или вниз?', 'The base is zero point five. Does the curve go up or down?'),
  steps: [
    {
      action: 'dropFlip',
      to: '0 < x² < 3x',
      wrongs: [
        {
          action: 'dropSame',
          hint: L("x = 4 ni oling. Argumentlar o'n olti va o'n ikki. Asos birdan kichik, demak o'n oltining logarifmi o'n ikkining logarifmidan kichik. Tengsizlik yolg'on, to'rt yechim emas.", 'Возьми x = 4. Аргументы шестнадцать и двенадцать. Основание меньше единицы, значит логарифм шестнадцати меньше логарифма двенадцати. Неравенство ложно, четвёрка не решение.', 'Take x = 4. The arguments are sixteen and twelve. The base is less than one, so the logarithm of sixteen is smaller than the logarithm of twelve. The inequality is false, four is not a solution.'),
        },
        { action: 'solve', hint: L('Avval logarifmlarni tashlash kerak.', 'Сначала надо отбросить логарифмы.', 'You must drop the logarithms first.') },
      ],
    },
    {
      action: 'solve',
      to: 'x(x − 3) < 0',
      wrongs: [
        { action: 'dropSame', hint: L('Logarifmlar allaqachon tashlangan.', 'Логарифмы уже отброшены.', 'The logarithms are already dropped.') },
        { action: 'dropFlip', hint: L('Logarifmlar allaqachon tashlangan.', 'Логарифмы уже отброшены.', 'The logarithms are already dropped.') },
      ],
    },
  ],
  answer: {
    numbers: ['−1', '0', '1', '3', '4'],
    value: ['0', '3'],
    prompt: L('Javobni oraliq bilan yozing', 'Запиши ответ промежутком', 'Write the answer as an interval'),
    wrongs: [
      { key: '−1|3', hint: L("x = −1 ni oling. Ikkinchi logarifm ostida minus uch, logarifm yo'q.", 'Возьми x = −1. Под вторым логарифмом минус три, логарифма нет.', 'Take x = −1. Under the second logarithm you get minus three, there is no logarithm.') },
      { key: '3|4', hint: L("x = 1 ni oling. Chapda birning logarifmi, u nol. O'ngda uchning logarifmi, u manfiy. Nol katta — demak bir yechim, sizning javobingizga esa u kirmaydi.", 'Возьми x = 1. Слева логарифм единицы, это ноль. Справа логарифм трёх, он отрицательный. Ноль больше — значит единица решение, а в твой ответ она не входит.', 'Take x = 1. On the left the logarithm of one, which is zero. On the right the logarithm of three, which is negative. Zero is greater, so one is a solution, yet your answer does not contain it.') },
      { key: '*', hint: L("Oxirgi satrga qarang: ikki ko'paytuvchining ko'paytmasi noldan kichik.", 'Смотри на последнюю строку: произведение двух множителей меньше нуля.', 'Look at the last line: the product of two factors is less than zero.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, o'qsiz — imtihondagidek.", 'Теперь полностью сам, и без прямой — как на экзамене.', 'Now completely on your own, and without the line — as on the exam.'),
    A('go', 'Asosga qarang. Va yodda tuting: logarifm ostida ikki tomon ham musbat bo\'lishi kerak.', 'Смотри на основание. И помни: под логарифмом обе части должны быть положительны.', 'Look at the base. And remember: both expressions under the logarithms must be positive.'),
    A('answered', 'Javobni oraliq bilan yozing.', 'Ответ запиши промежутком.', 'Write the answer as an interval.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S11.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S11} screen={screen} audio={audio} solved={solved} {...rest}>
      <TransformChain
        split
        noLine
        solo
        start={S11.start}
        steps={S11.steps}
        actions={ACTIONS_11}
        axis={AXIS_3}
        correctSet={{ from: 0, to: 3 }}
        answer={S11.answer}
        hintText={S11.hint}
        audio={audio}
        onStep={audio.step}
        onSolved={() => { setSolved(true); onAnswer({ screen, correct: true, tag: 'log_domain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// SLAYD 12. BLITS. TO'RT SAVOL, YAGONA BAHOLANADIGAN EKRAN.
// ============================================================
const S12 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  items: [
    {
      // Nol KERAKMI -- bu ko'nikma darsda alohida mashq qilinmagan edi,
      // ayni paytda DTM da aynan shu yerda ball yo'qoladi.
      id: 'b1', tag: 'log_domain', ask: true, cols: 2,
      done: L(
        "nol argument YUQORIDAN qisilgan joyda kerak",
        'ноль нужен там, где аргумент зажат СВЕРХУ',
        'the zero is needed where the argument is bounded ABOVE',
      ),
      prompt: L(
        "Qaysi holatda «argument noldan katta» shartini yozish KERAK?",
        'В каком случае нужно дописать условие «аргумент больше нуля»?',
        'In which case must you add the condition that the argument is greater than zero?',
      ),
      items: [
        { id: 'a', label: 'log₅(x − 3) < 2', correct: true },
        {
          id: 'b', label: 'log₅(x − 3) > 2',
          hint: L(
            "Bu yerda argument yigirma beshdan katta, yigirma besh esa noldan katta. Musbatlik allaqachon bor.",
            'Здесь аргумент больше двадцати пяти, а двадцать пять больше нуля. Положительность уже есть.',
            'Here the argument is greater than twenty five, and twenty five is greater than zero. Positivity is already there.',
          ),
        },
        {
          id: 'c', label: L('ikkisida ham', 'в обоих', 'in both'),
          hint: L(
            "Bittasida musbatlik o'zidan kelib chiqadi. Argument qaysi birida YUQORIDAN qisilganiga qarang.",
            'В одном из них положительность получается сама. Посмотри, где аргумент зажат СВЕРХУ.',
            'In one of them positivity follows by itself. Look at where the argument is bounded ABOVE.',
          ),
        },
        {
          id: 'd', label: L('hech qaysida', 'ни в одном', 'in neither'),
          hint: L(
            "Birinchisini nol bilan tekshiring: logarifm ostida minus uch chiqadi.",
            'Проверь первый нулём: под логарифмом получается минус три.',
            'Check the first one with zero: under the logarithm you get minus three.',
          ),
        },
      ],
    },
    {
      id: 'b2', tag: 'log_domain', prompt: 'log₄(x + 1) + log₄ x < log₄ 2', cols: 2,
      items: [
        { id: 'a', label: '(0; 1)', correct: true },
        { id: 'b', label: '(−2; 1)', hint: L("Ikkinchi logarifm ostida x ning o'zi turadi, demak x noldan katta. x = −1 ni tekshiring.", 'Под вторым логарифмом стоит сам x, значит x больше нуля. Проверь x = −1.', 'Under the second logarithm there is x itself, so x is greater than zero. Check x = −1.') },
        { id: 'c', label: '(0; 2)', hint: L('Kvadrat tengsizlikni yana yeching: ildizlar minus ikki va bir.', 'Реши квадратное неравенство ещё раз: корни минус два и один.', 'Solve the quadratic inequality again: the roots are minus two and one.') },
        { id: 'd', label: '(−2; 0)', hint: L('x = −1 ni tekshiring: logarifm ostida manfiy son.', 'Проверь x = −1: под логарифмом отрицательное число.', 'Check x = −1: the expression under the logarithm is negative.') },
      ],
    },
    {
      id: 'b3', tag: 'base_direction', ask: true,
      done: L("ishora o'zgaradi:  log₀,₃(x − 1) < 3", 'знак меняется:  log₀,₃(x − 1) < 3', 'sign changes:  log₀,₃(x − 1) < 3'),
      prompt: L("Qaysi tengsizlikda argumentlar orasidagi ishora o'zgaradi?", 'В каком неравенстве знак между аргументами поменяется?', 'In which inequality will the sign between the arguments change?'),
      cols: 2,
      items: [
        { id: 'b', label: 'log₀,₃(x − 1) < 3', correct: true },
        { id: 'a', label: 'log₂(x − 1) < 3', hint: L("Asos ikki birdan katta, chiziq yuqoriga ketadi. Ishora o'sha qoladi.", 'Основание два больше единицы, кривая идёт вверх. Знак останется.', 'The base two is greater than one, the curve goes up. The sign stays.') },
        { id: 'c', label: 'log₅(x − 1) > 2', hint: L("Asos besh birdan katta. Boshlang'ich ishoraning yo'nalishi bu yerda ahamiyatsiz.", 'Основание пять больше единицы. Направление исходного знака тут ни при чём.', 'The base five is greater than one. The direction of the original sign is irrelevant here.') },
        { id: 'd', label: 'log₇(x − 1) > 2', hint: L('Yetti birdan katta. Birdan kichik asosni izlang.', 'Семь больше единицы. Ищи основание меньше единицы.', 'Seven is greater than one. Look for a base less than one.') },
      ],
    },
    {
      id: 'b4', tag: 'check_by_point', ask: true,
      done: L('tekshiruv:  ichkaridagi va tashqaridagi nuqta', 'проверка:  точка внутри и точка снаружи', 'check:  a point inside and outside'),
      prompt: L(
        "log₀,₅(2x − 4) > −1 uchun sizda (2; 3) javobi chiqdi. Uning to'g'riligiga eng tez qanday ishonch hosil qilasiz?",
        'У тебя вышел ответ (2; 3) для log₀,₅(2x − 4) > −1. Как быстрее всего убедиться, что он верный?',
        'You got the answer (2; 3) for log₀,₅(2x − 4) > −1. What is the fastest way to make sure it is correct?',
      ),
      cols: 1,
      items: [
        { id: 'a', label: L('ichkaridagi va tashqaridagi nuqtani qo\'yish', 'подставить точку внутри и точку снаружи', 'substitute a point inside and a point outside'), correct: true },
        { id: 'b', label: L("o'sha usul bilan ikkinchi marta yechish", 'решить второй раз тем же способом', 'solve it a second time the same way'), hint: L("O'sha usul bilan o'sha xatoni takrorlaysiz. Mustaqil tekshiruv kerak.", 'Тем же способом повторишь ту же ошибку. Нужна независимая проверка.', 'The same way will repeat the same mistake. You need an independent check.') },
        { id: 'c', label: L('faqat chegaralarni tekshirish', 'проверить только границы', 'check only the boundaries'), hint: L('Chegaralar javobga kirmaydi. Ichkaridagi va tashqaridagi sonni tekshirish kerak.', 'Границы в ответ не входят. Проверять надо число внутри и число снаружи.', 'The boundaries are not part of the answer. You must check a number inside and a number outside.') },
        { id: 'd', label: L('nechta butun son kirganini hisoblash', 'посчитать, сколько целых чисел вошло', 'count how many whole numbers are included'), hint: L('Bu tekshiruv emas: butun sonlar soni hech narsani isbotlamaydi.', 'Это не проверка: количество целых чисел ничего не доказывает.', 'That is not a check: the count of whole numbers proves nothing.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. To'rtta tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Четыре быстрых вопроса, они идут в результат.', 'Let us check what stuck. Four quick questions, they count towards the result.'),
    A('q2', 'Bu yerda chapda ikki logarifm.', 'Здесь два логарифма слева.', 'Here there are two logarithms on the left.'),
    A('q3', 'Asoslarga qarang.', 'Смотри на основания.', 'Look at the bases.'),
    A('q4', 'Oxirgi savol: tekshiruv haqida.', 'Последний вопрос: про проверку.', 'Last question: about checking.'),
  ],
}

function Screen12({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S12.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [n, setN] = useState(0)
  const [solved, setSolved] = useState(false)

  return (
    <Frame meta={S12} right={(n + (solved ? 0 : 1)) + '/4'} screen={screen} audio={audio} solved={solved} {...rest}>
      {/* Yuqorida: to'rt savolning holati, yumshoq taymer, «natijaga kiradi» */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', gap: 6 }}>
          {S12.items.map((q, i) => (
            <span
              key={q.id}
              className="g11-mono"
              style={{
                width: 22, height: 22, borderRadius: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                background: i < n ? T.okSoft : i === n ? T.accentSoft : 'rgba(23,26,29,.05)',
                color: i < n ? T.ok : i === n ? T.accent : T.ink3,
                boxShadow: i === n ? 'inset 0 0 0 1px rgba(201,84,44,.35)' : 'none',
                transition: 'background .24s cubic-bezier(.22,.61,.36,1), color .24s',
              }}
            >
              {i < n ? '\u2713' : i + 1}
            </span>
          ))}
        </span>
        <SoftTimer running={!solved} />
        <Tag tone="quiet">{t(UI.goesToResult)}</Tag>
      </div>
      <Panel>
        <ProbeChain
          items={S12.items}
          cols={2}
          audio={audio}
          onStep={audio.step}
          onEach={(r) => {
            setN((prev) => prev + 1)
            onAnswer({ screen, blitz: true, id: r.id, tag: r.tag, correct: r.correct, attempts: r.attempts })
          }}
          onSolved={() => setSolved(true)}
        />
      </Panel>
    </Frame>
  )
}

// ============================================================
// SLAYD 13. TIPIK XATO. Hamma qadam to'g'ri ko'rinadi, javob esa XATO.
// ============================================================
const S13 = {
  eyebrow: L('XATONI TOPING', 'НАЙДИ ОШИБКУ', 'FIND THE ERROR'),
  title: L("Qadamlar to'g'ri, javob xato", 'Шаги верны, ответ нет', 'Steps right, answer wrong'),
  rows: [
    { id: 'r1', text: 'log₂(x − 3) < 2' },
    { id: 'r2', text: 'x − 3 < 4' },
    { id: 'r3', text: 'x < 7' },
    { id: 'r4', text: '(−∞; 7)' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich tengsizlik, unda xato bo'lishi mumkin emas.", 'Это исходное неравенство, ошибки в нём быть не может.', 'This is the original inequality, there can be no error in it.'),
    r3: L("2-satrdan bu to'g'ri kelib chiqadi. Xato oldin kelgan.", 'Из строки 2 это следует верно. Ошибка пришла раньше.', 'This follows correctly from line 2. The error came earlier.'),
    r4: L("Javob haqiqatan xato. Lekin u oldin xato bo'lgan — qayerda ekanini toping.", 'Ответ действительно неверный. Но неверным он стал раньше — найди, где именно.', 'The answer is indeed wrong. But it became wrong earlier — find exactly where.'),
  },
  proof: L('x = 0 → logarifm ostida −3, yechim bo\'lolmaydi.  To\'g\'risi: 0 < x − 3 < 4, javob (3; 7)', 'x = 0 → под логарифмом −3, решением быть не может.  Верно: 0 < x − 3 < 4, ответ (3; 7)', 'x = 0 → −3 under the logarithm, it cannot be a solution.  Correct: 0 < x − 3 < 4, answer (3; 7)'),
  probe: {
    question: L('Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
    items: [
      { id: 'a', label: L("argument sondan kichik — «noldan katta» deb yozib qo'yish kerak", 'аргумент меньше числа — надо дописать «больше нуля»', 'the argument is smaller than the number — you must add «greater than zero»'), correct: true },
      { id: 'b', label: L('asos birdan kichik', 'основание меньше единицы', 'the base is less than one'), hint: L("Asos ikki, u birdan katta. Argumentlar orasidagi ishorani o'zgartirish kerak emas edi.", 'Основание два, оно больше единицы. Знак между аргументами менять не нужно было.', 'The base is two, greater than one. The sign between the arguments did not need changing.') },
      { id: 'c', label: L('sonni ko\'chirish', 'перенос числа', 'moving the number'), hint: L("Uch to'g'ri ko'chirilgan, bu 3-satrda ko'rinadi.", 'Тройка перенесена верно, это видно в строке 3.', 'The three was moved correctly, you can see it in line 3.') },
      { id: 'd', label: L('amallar tartibi', 'порядок действий', 'order of operations'), hint: L("Tartib to'g'ri edi: avval logarifm, keyin chiziqli tengsizlik.", 'Порядок был правильный: сначала логарифм, потом линейное неравенство.', 'The order was right: the logarithm first, then the linear inequality.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hamma qadam to'g'ri ko'rinadi. Shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Все шаги здесь выглядят верными. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Every step here looks correct. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', 'Nuqta bilan tekshiramiz. Mana javobga tushgan va yechim bo\'lolmaydigan son.', 'Проверим точкой. Вот число, которое попало в ответ и не может быть решением.', 'Let us check with a point. Here is a number that got into the answer and cannot be a solution.'),
    A('q2', 'Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S13.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [found, setFound] = useState(false)
  const [solved, setSolved] = useState(false)

  return (
    <Frame meta={S13} screen={screen} audio={audio} solved={solved} {...rest}>
      <Cols l={1} r={0.92} align="start">
        <Col>
          <AuditRows
            hideProof
            rows={S13.rows}
            answerId={S13.answerId}
            hints={S13.hints}
            proof={S13.proof}
            audio={audio}
            onStep={(nm) => { audio.step(nm); if (nm === 'proof') { setFound(true); setTimeout(() => audio.step('q2'), 900) } }}
            onSolved={(r) => onAnswer({ ...r, screen, tag: 'check_by_point' })}
          />
        </Col>
        <Col>
          {found ? (
            <>
              {/* Mustaqil tekshiruv: nuqta x = 0 */}
              <Panel tone="teal" className="g11-in" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <Tag tone="graph">{'x = 0'}</Tag>
                <span className="g11-expr g11-expr-sm g11-wrap" style={{ color: T.ink }}><Fx>{t(S13.proof)}</Fx></span>
              </Panel>
              <Probe audio={audio} data={S13.probe} cols={1} fbSlot={40} dense
                onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: 'log_domain' }) }} />
            </>
          ) : (
            <Panel tone="quiet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>
              <Tag tone="quiet">{'\u2026'}</Tag>
            </Panel>
          )}
        </Col>
      </Cols>
    </Frame>
  )
}

// ============================================================
// SLAYD 14. TESKARI MASALA: berilgan to'plam bo'yicha tengsizlik yig'ish.
// ============================================================
const S14 = {
  eyebrow: L("O'ZINGIZ YIG'ING", 'СОБЕРИ САМ', 'BUILD IT YOURSELF'),
  title: L('Teskari yig\'ing', 'Собери обратно', 'Build it back'),
  tasks: [
    {
      prompt: L('Asosi 2 bo\'lsin', 'Пусть основание будет 2', 'Let the base be 2'),
      template: [{ slot: 0 }, '(x − 3)', { slot: 1 }, { slot: 2 }],
      parts: ['log₂', 'log₀,₅', '<', '>', '2', '−2'],
      answer: ['log₂', '<', '2'],
      doneLabel: L("birinchi usul:  log₂(x − 3) < 2", 'первый способ: log₂(x − 3) < 2', 'first way: log₂(x − 3) < 2'),
      axis: AXIS_4,
      set: { from: 3, to: 7 },
      matchedLabel: L('maqsad bilan mos keldi', 'совпало с целью', 'matches the target'),
      wrongs: [
        { key: 'log₂|>|2', hint: L("Bu to'plam yettidan o'ngda, kerak esa uch bilan yetti orasida.", 'Это множество правее семёрки, а нужно между тройкой и семёркой.', 'This set is to the right of seven, but we need between three and seven.') },
        { key: 'log₂|<|−2', hint: L('x = 4 ni tekshiring: chapda nol, nol minus ikkidan kichikmi — yo\'q.', 'Проверь x = 4: слева ноль, ноль меньше минус двух — нет.', 'Check x = 4: the left side is zero, zero is not less than minus two.') },
        { key: '*', hint: L('x = 4 ni tekshiring: u javobga kirishi kerak.', 'Проверь x = 4: он должен входить в ответ.', 'Check x = 4: it must be in the answer.') },
      ],
    },
    {
      prompt: L("Endi asosi 0,5 bo'lsin, javob esa o'sha", 'А теперь основание 0,5, а ответ тот же', 'Now let the base be 0,5, with the same answer'),
      template: [{ slot: 0 }, '(x − 3)', { slot: 1 }, { slot: 2 }],
      parts: ['log₂', 'log₀,₅', '<', '>', '2', '−2'],
      answer: ['log₀,₅', '>', '−2'],
      doneLabel: L("ikkinchi usul:  log₀,₅(x − 3) > −2", 'второй способ: log₀,₅(x − 3) > −2', 'second way: log₀,₅(x − 3) > −2'),
      axis: AXIS_4,
      set: { from: 3, to: 7 },
      matchedLabel: L('maqsad bilan mos keldi', 'совпало с целью', 'matches the target'),
      wrongs: [
        { key: 'log₀,₅|<|−2', hint: L("Asos birdan kichik. x = 4 ni tekshiring: chapda nol, nol minus ikkidan kichikmi — yo'q. Lekin to'rt kirishi kerak.", 'Основание меньше единицы. Проверь x = 4: слева ноль, а ноль меньше минус двух — нет. Но четвёрка входить должна.', 'The base is less than one. Check x = 4: the left side is zero, and zero is not less than minus two. But four must be included.') },
        { key: 'log₀,₅|>|2', hint: L('x = 4 ni tekshiring: nol ikkidan kattami — yo\'q.', 'Проверь x = 4: ноль больше двух — нет.', 'Check x = 4: zero is not greater than two.') },
        { key: '*', hint: L("Asos birdan kichik, demak ishora o'zgaradi, va o'ngdagi son ham boshqa.", 'Основание меньше единицы, значит знак другой, и число справа тоже другое.', 'The base is less than one, so the sign is different, and the number on the right is different too.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xatoni topdingiz. Oxirgi topshiriq — teskari.', 'Ошибку нашёл. Последнее задание — обратное.', 'You found the error. The last task is the reverse one.'),
    A('built1', "Endi o'sha to'plam, lekin asos nol butun besh o'ndan bo'lishi kerak.", 'А теперь то же самое множество, но основание должно быть ноль целых пять десятых.', 'And now the same set, but the base must be zero point five.'),
  ],
}

function Screen14({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S14.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S14} right="2/2" screen={screen} audio={audio} solved={solved} {...rest}>
      <Cols l={1.15} r={1} align="start">
        <Col>
          <BuildExpr
            tasks={S14.tasks}
            audio={audio}
            onStep={audio.step}
            onSolved={() => { setSolved(true); onAnswer({ screen, correct: true, tag: 'intersection' }) }}
          />
        </Col>
        <Col>
          <Panel tone="teal" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Tag tone="graph">{t(UI.target)}</Tag>
            <Expr size="big" style={{ textAlign: 'left' }}>{'(3; 7)'}</Expr>
            <SolutionLine axis={AXIS_4} sets={[{ from: 3, to: 7, tone: 'graph' }]} />
          </Panel>
        </Col>
      </Cols>
    </Frame>
  )
}

// ============================================================
// SLAYD 15. YAKUN. Prognozlarga qaytish, qoida, DTM darajasi.
// Medal va konfetti YO'Q.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L("Nimani o'rgandingiz", 'Что ты узнал', 'What you learned'),
  youPicked: L('siz tanladingiz', 'ты выбрал', 'you picked'),
  correctIs: L("to'g'ri javob", 'верно', 'correct'),
  levelLabel: L("Blits bo'yicha daraja", 'Уровень по блицу', 'Level from the quick round'),
  btnNext: L('Keyingi qadam', 'Следующий шаг', 'Next step'),
  // Prognoz javobini oraliq bilan ko'rsatamiz. «ikkisi ham» va «hech qaysi»
  // uchun oraliq yo'q, shuning uchun chiziqcha.
  predicts: [
    { screen: 0, expr: 'log₅(x − 3) < 2', right: '(3; 28)', map: { a: '(3; 28)', b: '(−∞; 28)', both: '—', none: '—' } },
    { screen: 5, expr: 'log₀,₅(2x − 4) > −1', right: '(2; 3)', map: { a: '(2; 3)', b: '(3; +∞)', c: '(2; +∞)', d: '(−∞; 3)' } },
  ],
  ruleLines: [
    L("1. o'ngni logarifmga aylantir", '1. справа сделай логарифм', '1. make the right side a logarithm'),
    L("2. o'sadi — ishora o'sha, kamayadi — boshqa", '2. возрастает — знак тот же, убывает — другой', '2. increasing — same sign, decreasing — opposite'),
    L('3. argument sondan kichik — «noldan katta» deb yoz', '3. аргумент меньше числа — допиши «больше нуля»', '3. argument smaller than the number — add «greater than zero»'),
  ],
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Qoidaga va ikki nuqtali ekranga qayting', 'Вернись к правилу и к экрану с двумя точками', 'Go back to the rule and to the two-points screen'),
  },
  tagNames: {
    log_domain: L('argumentga shart', 'условие на аргумент', 'the condition on the argument'),
    base_direction: L("asosga qarab ishora yo'nalishi", 'направление знака по основанию', 'the sign direction from the base'),
    check_by_point: L('nuqta bilan tekshirish', 'проверка точкой', 'checking with a point'),
  },
  probe: {
    question: L('Ishonchingiz bo\'lmasa, javobingizni qanday tekshirasiz?', 'Как проверить свой ответ, если сомневаешься?', 'How do you check your answer when you are unsure?'),
    items: [
      { id: 'a', label: L('ichkaridagi va tashqaridagi nuqta', 'точка внутри и точка снаружи', 'a point inside and a point outside'), correct: true },
      { id: 'b', label: L('o\'qituvchidan so\'rash', 'спросить учителя', 'ask the teacher'), hint: L('Imtihonda o\'qituvchi yonda bo\'lmaydi. Nuqta esa har doim bor.', 'На экзамене учителя рядом нет. А точка всегда есть.', 'On the exam the teacher is not next to you. A point always is.') },
      { id: 'c', label: L('darslikka qarash', 'посмотреть в учебник', 'look in the textbook'), hint: L('Darslikda aynan sizning tengsizligingiz bo\'lmaydi.', 'В учебнике не будет именно твоего неравенства.', 'The textbook will not contain your exact inequality.') },
      { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L('Butun dars tekshirdik. Nima bilan ekanini eslang.', 'Мы весь урок проверяли. Вспомни, чем.', 'We were checking all lesson. Recall with what.') },
    ],
  },
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana siz nima deb taxmin qilgansiz va mana qanday chiqdi. Taxminda xato qilish normal edi — biz shuning uchun tekshirdik.", 'Вот что ты предполагал и вот как оказалось. Ошибиться в догадке было нормально — именно поэтому мы проверяли.', 'Here is what you guessed and here is how it turned out. Being wrong in a guess was fine — that is exactly why we checked.'),
    A('rule', 'Mana darsning butun qoidasi, uch qadam.', 'Вот всё правило урока, три шага.', 'Here is the whole rule of the lesson, three steps.'),
    A('q', "Va eng muhimi: javobga ishonchingiz bo'lmasa, o'zingiz tekshirish usuli bor.", 'И главное: если сомневаешься в ответе, есть способ проверить самому.', 'And the main thing: if you are unsure of the answer, there is a way to check it yourself.'),
  ],
}

function Screen15({ screen, answers, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S15.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S15.audio, rest.lang))
  const [solved, setSolved] = useState(false)

  const blitz = answers.filter((a2) => a2 && a2.blitz)
  const firstTry = blitz.filter((a2) => a2.correct && (a2.attempts || 1) === 1)
  const level = firstTry.length >= 4 ? 'full' : firstTry.length === 3 ? 'one' : 'low'
  const weakTag = blitz.find((a2) => !a2.correct || (a2.attempts || 1) > 1)

  return (
    <Frame meta={S15} screen={screen} audio={audio} solved={solved} {...rest}>
      <Cols l={1.25} r={1} align="start">
        <Col>
          <Tag tone="quiet">{t(UI.learned)}</Tag>
          <Panel tone="quiet" pad={9} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {S15.ruleLines.map((l, i) => (
              <div
                key={i}
                className={phase >= 2 ? 'g11-reveal' : undefined}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 9, minHeight: 22,
                  opacity: phase >= 2 ? 1 : 0.22, animationDelay: i * 0.09 + 's',
                }}
              >
                <span className="g11-mono" style={{ fontSize: 11, fontWeight: 800, color: T.accent, minWidth: 14 }}>
                  {'0' + (i + 1)}
                </span>
                <span className="g11-expr g11-expr-sm g11-wrap" style={{ color: T.ink }}><Fx>{t(l)}</Fx></span>
              </div>
            ))}
          </Panel>

          {/* Prognoz -> isbotlangan javob */}
          <Tag tone="accent">{t(UI.predictToProved)}</Tag>
          <Panel pad={10} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {S15.predicts.map((pr) => {
              const rec = answers.find((a2) => a2 && a2.screen === pr.screen && a2.picked)
              const mine = rec ? pr.map[rec.picked] || '\u2014' : '\u2014'
              const hit = mine === pr.right
              return (
                <div
                  key={pr.screen}
                  className="g11-expr g11-expr-sm"
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) auto 14px auto', gap: 8, alignItems: 'center', minHeight: 26, opacity: phase >= 1 ? 1 : 0.16 }}
                >
                  <span><Fx>{pr.expr}</Fx></span>
                  <span style={{ color: hit ? T.ok : T.ink2 }}>{phase >= 1 ? mine : '?'}</span>
                  <span style={{ color: T.ink3, textAlign: 'center' }}>{'\u2192'}</span>
                  <span className={phase >= 1 ? 'g11-ok-text' : undefined}>{phase >= 1 ? pr.right : '?'}</span>
                </div>
              )
            })}
          </Panel>

          {phase >= 3 ? (
            <Probe audio={audio} data={S15.probe} cols={2} fbSlot={48} dense
              onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: 'check_by_point' }) }} />
          ) : null}
        </Col>

        <Col>
          <Panel style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <RingProgress
              value={firstTry.length}
              total={4}
              size={84}
              label={t(UI.dtmReady)}
              sub={phase >= 3 ? t(S15.levels[level]) : ''}
            />
            {phase >= 3 && level === 'one' && weakTag && weakTag.tag ? (
              <Tag tone="tip">{t(UI.weakSpot) + ': ' + t(S15.tagNames[weakTag.tag] || '')}</Tag>
            ) : null}
          </Panel>
          {phase >= 2 ? (
            <Insight label={t(UI.lifehackLabel)} tone="accent">{t(UI.lifehack)}</Insight>
          ) : null}
          {/* Shpargalka tugmasi qoralama panelining ICHIDA -- alohida satr
              olmaydi, balandlik tejaladi. */}
          <Panel tone="quiet" pad={9}>
            <NotesInline rows={2} extra={
              <Btn tone="soft" onClick={() => { if (typeof window !== 'undefined') window.print() }} style={{ minHeight: 34, padding: '0 12px' }}>
                {t(UI.cheatSheet)}
              </Btn>
            } />
          </Panel>
        </Col>
      </Cols>
      <PrintSheet
        title={t(UI.sheetTitle)}
        law={'c = log\u2090 a\u1d9c'}
        steps={S15.ruleLines.map((l) => t(l))}
        lifehack={t(UI.lifehack)}
        source={t(UI.sheetSrc)}
      />
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

export default function Grade11Dars12({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  aiGradingEndpoint,
  onFinished,
}) {
  // Til darsning ICHIDA almashtiriladi: boshlang'ich qiymat propdan keladi.
  const [lang, setLang] = useState(
    langProp === 'uz' || langProp === 'ru' || langProp === 'en' ? langProp : 'uz',
  )
  useEffect(() => {
    if (langProp === 'uz' || langProp === 'ru' || langProp === 'en') setLang(langProp)
  }, [langProp])
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    aiGradingEndpoint: aiGradingEndpoint || '',
    studentName: studentName || '',
    voiceGender: voiceGender || 'm', // 11-sinf: erkak ovoz
  })
  useMobileZoom()

  const [screen, setScreen] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  // Vaqtni renderda emas, effektda olamiz: render toza qolishi kerak.
  const startedAt = useRef(0)
  useEffect(() => { startedAt.current = Date.now() }, [])

  const onAnswer = useCallback((payload) => {
    setAnswers((prev) => prev.concat(payload))
  }, [])

  const next = useCallback(() => setScreen((s) => Math.min(s + 1, TOTAL - 1)), [])
  const prev = useCallback(() => setScreen((s) => Math.max(s - 1, 0)), [])

  const finish = useCallback(() => {
    setFinished(true)
    // Baholanadi FAQAT blits. Qolgan ekranlar diagnostik teg beradi.
    const blitz = answers.filter((a) => a && a.blitz)
    const firstTry = blitz.filter((a) => a.correct && (a.attempts || 1) === 1)
    const gaps = {}
    answers.forEach((a) => {
      if (a && a.tag && a.correct === false) gaps[a.tag] = (gaps[a.tag] || 0) + 1
      if (a && a.tag && a.attempts && a.attempts > 1) gaps[a.tag] = (gaps[a.tag] || 0) + 1
    })
    const payload = {
      lessonId: LESSON_ID,
      lessonTitle: tr(LESSON_TITLE, lang),
      lang,
      completed: true,
      durationSec: startedAt.current ? Math.floor((Date.now() - startedAt.current) / 1000) : 0,
      scoredScreen: 12,
      totalQuestions: blitz.length,
      correctAnswers: blitz.filter((a) => a.correct).length,
      firstTryStats: { total: blitz.length, firstTryCorrect: firstTry.length },
      gaps,
      freeNav: FREE_NAV,
      answers,
    }
    if (onFinished) onFinished(payload)
    else console.log('[Grade11 Dars12] onFinished', payload)
  }, [answers, lang, onFinished])

  const Current = SCREENS[screen]

  return (
    <LangProvider value={lang}>
      <LangSetProvider value={setLang}>
      <style>{STYLES}</style>
      <div className="lesson-root" lang={lang}>
        <BgCurves />
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
