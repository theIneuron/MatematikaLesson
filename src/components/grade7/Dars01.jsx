// ============================================================================
// 7-sinf, Dars 1. SONLI IFODALAR.  (Числовые выражения)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// Raskadrovka: src/books/grade7/DARS01_SKELET.md
// Kontent: src/books/grade7/DARS01_KONTENT.md
// Darslik: algebra 7, 1-paragraf, 12-bet (RU va UZ nashrlari, betlar bir xil).
//
// Bu faylda FAQAT MA'LUMOT va asboblarni ulash bor: mexanika `./tools.jsx` da,
// yadro `./core.jsx` da (§9.1). `Options`, `Feedback`, `useSfx`, `useAnswerFx`
// bu yerda YO'Q -- ular paydo bo'lsa, mexanika darsga ko'chgan bo'ladi va
// bitta xatoni 48 faylda tuzatishga to'g'ri keladi.
//
// 1-4-SINFDAN KO'CHIRILGAN USULLAR (metodist qarori 2026-08-13):
//   - qoidani o'quvchi YIG'ADI          -> RuleBuilder, 8-ekran  (4-sinf)
//   - qo'l YOZUVNING ICHIDA ishlaydi    -> StepOrder / BracketGap (4-sinf)
//   - qoida XUK savoliga javob beradi   -> 8-ekran, TwoValues     (2, 3-sinf)
//
// DARSNING ASOSIY USULI. Bu darsda HARF YO'Q, shuning uchun son qo'yish
// ishlamaydi. Uning o'rnida -- IKKI TARTIB bilan qayta hisoblash: bitta yozuv
// o'quvchi tartibi bo'yicha va qoida bo'yicha hisoblanadi, ikki son yonma-yon
// turadi (PODXOD_7SINF.md §9). «Noto'g'ri» so'zi darsda BIR MARTA ham
// aytilmaydi.
//
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// ============================================================================
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Btn,
  DoneRow,
  Expr,
  FactCard,
  Fx,
  HackNote,
  Hint,
  Insight,
  L,
  LangProvider,
  LangSetProvider,
  RingProgress,
  STYLES,
  Slot,
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
  BracketGap,
  CollapseFilm,
  CollapseTrack,
  HistoryTape,
  HookMachines,
  NumberLineTracks,
  StairsReveal,
  Probe,
  ProbeChain,
  ReadViz,
  RuleBuilder,
  SolutionSteps,
  SlotFill,
  StepOrder,
  Transform,
  TwoValues,
} from './tools.jsx'

const LESSON_ID = 'alg_7_01'
const LESSON_TITLE = L('Sonli ifodalar', 'Числовые выражения', 'Numerical expressions')
const LESSON_NO = L('1-dars', 'Урок 1', 'Lesson 1')
const TOTAL = 15

const BLOCK = { label: L('B1-blok', 'Блок Б1', 'Block B1'), from: 1, to: 6, current: 1 }

// Ovoz bo'laklari. `on: 'mount'` -- ekran ochilganda, `on: '<nom>'` -- shu
// nomli qadam bosilganda. Ovoz TAYMER bilan emas, o'quvchining QADAMI bilan.
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
// Yakunda kamchilik AYNAN shu so'zlar bilan ataladi, foiz bilan EMAS.
// Kodlar DARS01_SKELET.md dan.
// ============================================================
const TAGS = {
  Z1: L("chapdan o'ngga ketma-ket sanash", 'счёт подряд слева направо', 'counting straight from left to right'),
  Z2: L('ikkinchi bosqich ichidagi tartib', 'порядок внутри второй ступени', 'the order inside the second stage'),
  Z3: L('birinchi bosqich ichidagi tartib', 'порядок внутри первой ступени', 'the order inside the first stage'),
  Z4: L("qavslar qiymatni o'zgartirmaydi", 'скобки не меняют значение', 'brackets do not change the value'),
  Z5: L('bitta yozuvda ikki qiymat', 'у одной записи два значения', 'one expression with two values'),
  Z6: L('ifoda va uning qiymati', 'выражение и его значение', 'an expression and its value'),
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

// ============================================================
// TOPSHIRIQ E'LONLARI. Metodist 2026-08-14: 2, 3, 7, 12 va 14-ekranlarda
// o'quvchi undan nima talab qilinayotganini tushunmagan. Sarlavha MAVZUNI
// ataydi, topshiriqni esa faqat OVOZ aytardi -- ovoz o'chiq bo'lsa ekranda
// yozuv va to'rtta variant qolardi, savol esa qolmasdi.
//
// Bir xil harakat -- BIR XIL so'z. 6 va 14-ekran bitta savol beradi va uni
// bitta gap bilan beradi: o'quvchi uni bir marta o'qib oladi. 2-ekran
// 2026-08-14 dan boshqa ish qiladi -- u YOZUVNI O'QISHNI mashq qiladi va
// o'z savollarini beradi.
// E'lon ovozdan QISQA: ovoz shartni kengaytiradi, ekran uni takrorlamaydi.
// ============================================================
const ASK_VALUE = L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is the value?')

// 3 va 7-ekran: bitta asbob, bitta topshiriq. Amallar SONI aytilmaydi --
// 3-ekranda uchta belgi, 7-ekranda ikkita.
const ASK_ORDER = L(
  "Amal belgilarini qaysi tartibda hisoblasangiz, shu tartibda bosing.",
  'Нажми на знаки действий в том порядке, в каком будешь считать.',
  'Tap the operation signs in the order you will work them out.',
)

// Qayta yozish amallari. Ro'yxat butun dars uchun BIR XIL: o'quvchi har
// qadamda BOSQICHNI ataydi, «hisoblash» degan umumiy tugma yo'q.
const ACTIONS = [
  { id: 'bracket', label: L('Qavs ichidagini hisoblash', 'Посчитать в скобках', 'Do what is inside the brackets') },
  { id: 'stage2', label: L('Ikkinchi bosqich amali', 'Действие второй ступени', 'A second-stage operation') },
  { id: 'stage1', label: L('Birinchi bosqich amali', 'Действие первой ступени', 'A first-stage operation') },
]

// Tayyorlik darajasi -- birinchi urinishdagi to'g'ri javoblar soni bo'yicha.
const levelOf = (firstTry, total) => {
  if (firstTry === null || firstTry === undefined) return 'none'
  if (firstTry >= total) return 'closed'
  if (firstTry === total - 1) return 'one'
  return 'back'
}

// ============================================================
// Umumiy ramka: sarlavha, maydon rangi, navigatsiya.
// `meta.field` -- uch alohida ekranning maydon rangi (§6.5).
// `meta.noBack` -- xukda «Orqaga» tugmasi YO'Q.
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
      {/* «Usul 1 / Usul 2» yorlig'i sarlavha USTIDA: o'quvchi ekranga kirishi
          bilanoq bu qaysi usul ekanini ko'radi (3-sinf naqshi). */}
      {meta.method ? <Tag tone="accent">{t(meta.method)}</Tag> : null}
      {meta.ownTitle ? null : <Title>{t(meta.title)}</Title>}
      {children}
      {/* LAYFXAK va BONUS -- BITTA shakl (metodist qarori 2026-08-14):
          javob izohidagi kabi ramka, chapda polosa, tepada yorliq va
          YIRIK jonli yulduzcha. Rangi sariq -- o'zgarmaydi.
          Ikkalasi ham FAQAT ish bajarilgandan keyin chiqadi: avval o'quvchi
          o'zi qiladi, keyin usul haqidagi gapni o'qiydi. Ilgari layfxak
          birinchi soniyadan turardi va javobni oldindan aytib qo'yardi.
          `bottom` -- ekranning eng pastiga bosadi, ya'ni zahira slotlarning
          O'RNINI egallaydi va budjetga qo'shimcha yuk bermaydi. */}
      {/* `reward` -- ish tugagandagi JAVOB. Mashq ekranlari hech nima bilan
          tugamasdi: oxirgi javobdan keyin ekranda faqat qatorlar qolardi
          (metodist surati 2026-08-14). Yashil, ya'ni «bo'ldi». */}
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
// EKRAN 1. XUK. Bitta yozuv ikki mashinaga berildi, sonlar farq qildi.
// Baholanmaydi va TEG ham yozmaydi (§4.1): bu tushuntirishdan OLDINGI taxmin.
// Maydon BIRUZA -- «baholanmaydi» degani.
//
// Shakl darslikning O'ZIDAN: 12-betda ikkita yozuv yonma-yon turadi va
// ular orasida «teng emas» belgisi bor.
// ============================================================
const S1 = {
  eyebrow: L('SONLI IFODALAR', 'ЧИСЛОВЫЕ ВЫРАЖЕНИЯ', 'NUMERICAL EXPRESSIONS'),
  ownTitle: true,
  noBack: true,
  noNotes: true,
  // Metodist qarori 2026-08-14: XUK va YAKUNda maydon rangi YO'Q, fon dars
  // bo'yicha bir xil. Ilgari xuk biruza, yakun yashil edi (ETALON_7SINF.md
  // §6.5 «ekran turiga qarab fon»). Qoida ekrani (8) hozircha to'q sariq
  // qoldi -- metodist uni atamadi.
  title: L('Ikki mashina, bitta yozuv', 'Две машины, одна запись', 'Two machines, one expression'),
  expr: '18 − 6 : 3 + 4',
  tokens: ['18', '−', '6', ':', '3', '+', '4'],
  left: {
    cap: L('oddiy kalkulyator', 'обычный калькулятор', 'a basic calculator'),
    value: '8',
  },
  right: {
    cap: L('muhandislik kalkulyatori', 'инженерный калькулятор', 'a scientific calculator'),
    value: '20',
  },
  probe: {
    question: L('Nega sonlar farq qildi?', 'Почему числа разошлись?', 'Why did the numbers differ?'),
    items: [
      {
        id: 'order',
        label: L("Mashinalar yozuvni har xil tartibda o'qiydi", 'Машины читают запись в разном порядке', 'The machines read it in a different order'),
        hint: L(
          "Bu bizning savolimiz. Hozir yozuvning o'zida qaysi tartib sakkiz, qaysi tartib yigirma berishini tekshiramiz.",
          'Это и есть наш вопрос. Сейчас проверим на самой записи, какой порядок даёт восемь, а какой двадцать.',
          'That is our question. Now we will check on the expression itself which order gives eight and which gives twenty.',
        ),
      },
      {
        id: 'broken',
        label: L('Mashinalardan biri buzuq', 'Одна из машин сломана', 'One of the machines is broken'),
        hint: L(
          "Ikkala mashina ham soz. Har biri o'z qoidasi bo'yicha hisoblaydi, va shu qoidalardan biri matematikada qabul qilingan. Qaysi biri ekanini topamiz.",
          'Обе машины исправны. Каждая считает по своему правилу, и одно из этих правил принято в математике. Найдём какое.',
          'Both machines work. Each follows its own rule, and one of those rules is the one mathematics uses. Let us find which.',
        ),
      },
      {
        id: 'two',
        label: L("Bu yozuvning ikkita to'g'ri qiymati bor", 'У этой записи два верных значения', 'This expression has two correct values'),
        hint: L(
          "Bo'lish belgisiga qarang. Nimani oldin hisoblashni aynan u hal qiladi. Oldin esa faqat bitta narsani hisoblash mumkin.",
          'Посмотри на знак деления. Именно он решает, что считать раньше. А раньше можно посчитать только что-то одно.',
          'Look at the division sign. It decides what is done first. And only one thing can be done first.',
        ),
      },
      {
        id: 'brackets',
        label: L('Yozuvda qavs yetishmaydi', 'В записи не хватает скобок', 'The expression is missing brackets'),
        hint: L(
          "Qavs qo'yish mumkin, va biz buni qilamiz. Lekin unda boshqa yozuv hosil bo'ladi, o'qish kerak bo'lgani esa mana bu.",
          'Скобки поставить можно, и мы это сделаем. Но тогда получится другая запись, а прочитать надо эту.',
          'You can add brackets, and we will. But that makes a different expression, and this one is what we have to read.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bugungi dars mavzusi sonli ifodalar. Bitta yozuvni ikkita kalkulyatorga berdik.", 'Сегодня тема урока числовые выражения. Одну и ту же запись мы отдали двум калькуляторам.', 'Today the topic is numerical expressions. We gave one and the same expression to two calculators.'),
    A('mount', "Chapda oddiy kalkulyator, o'ngda muhandislik kalkulyatori. Yozuv bitta, o'n sakkiz ayirish olti bo'lish uch qo'shish to'rt.", 'Слева обычный калькулятор, справа инженерный. Запись одна, восемнадцать минус шесть разделить на три плюс четыре.', 'On the left a basic calculator, on the right a scientific one. One expression, eighteen minus six divided by three plus four.'),
    A('mount', "Oddiysi sakkizni ko'rsatdi. Muhandisligi yigirmani ko'rsatdi. Sonlar har xil, yozuv esa bitta.", 'Обычный показал восемь. Инженерный показал двадцать. Числа разные, а запись одна.', 'The basic one showed eight. The scientific one showed twenty. Different numbers, one expression.'),
    A('mount', "Sizningcha nima bo'ldi. Javobingizni tanlang, bu taxmin, uning uchun baho yo'q. Dars oxirida unga qaytamiz.", 'Как думаешь, что здесь происходит. Выбери свой ответ, это прогноз, оценки за него нет, и в конце урока мы к нему вернёмся.', 'What do you think is going on. Pick your answer, this is a prediction, it is not graded, and we will come back to it at the end.'),
  ],
}

function Screen1({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S1.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [picked, setPicked] = useState(null)
  return (
    <Frame meta={S1} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <Title>{t(S1.title)}</Title>
      {/* Sahna Expr va TwoValues ni ALMASHTIRADI: yozuv, ikkala mashina va
          «teng emas» belgisi endi bitta sahnada va HARAKATLANADI. */}
      <HookMachines tokens={S1.tokens} left={S1.left} right={S1.right} />
      {/* `fbSlot={0}` -- razbor uchun joy OLDINDAN band qilinmaydi. O'lchov
          2026-08-13: band qilinganda xuk noutbukda 80px, telefonda 81px
          oshib ketardi. Javobdan keyin uchta variant yig'ilib ketadi va
          razborga joy O'ZI bo'shaydi. */}
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
// EKRAN 2. TAYANCH. Oltinchi sinfdan uch narsa. Ball YO'Q, teg BOR.
// Razborlar «bosqich» so'zini ISHLATMAYDI: bu atama 5-ekranda kiritiladi.
// ============================================================
const S2 = {
  hack: L("Uzun yozuvni oddiy kalkulyatorga kiritmang: u chapdan o'ngga sanaydi va boshqa son beradi.", 'Длинную запись не вводи в простой калькулятор: он считает слева направо и даст другое число.', 'Do not type a long expression into a basic calculator: it counts left to right and gives a different number.'),
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L("Yozuvni o'qiymiz", 'Читаем запись', 'Reading the expression'),
  items: [
    {
      prompt: '40 : 8 + 3 · 2 − 5',
      question: L('Yozuvda nechta amal bor?', 'Сколько действий в записи?', 'How many operations are there?'),
      viz: () => <ReadViz tokens={['40', ':', '8', '+', '3', '·', '2', '−', '5']} mode="count" />,
      ok: L("To'rtta: bo'lish, qo'shish, ko'paytirish, ayirish.", 'Четыре: деление, сложение, умножение, вычитание.', 'Four: division, addition, multiplication, subtraction.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '5', hint: L("Beshta — bu SONLAR soni. Belgilar ular orasida turadi, ya'ni bittaga kam.", 'Пять — это количество ЧИСЕЛ. Знаки стоят между ними, значит их на один меньше.', 'Five is how many NUMBERS there are. The signs stand between them, so there is one fewer.') },
        { id: 'c', label: '3', hint: L("Bitta belgi hisobga kirmadi. Ularni chapdan sanang: bo'lish, qo'shish, ko'paytirish, ayirish.", 'Один знак не посчитан. Считай слева: деление, сложение, умножение, вычитание.', 'One sign was missed. Count from the left: division, addition, multiplication, subtraction.') },
        { id: 'd', label: '2', hint: L("Bu faqat ko'paytirish va bo'lish. Yozuvda qo'shish va ayirish ham bor.", 'Это только умножение и деление. В записи есть ещё сложение и вычитание.', 'That is the multiplication and division only. There is also an addition and a subtraction.') },
      ],
    },
    {
      prompt: '18 − 6 : 3 + 4',
      question: L("Bo'lish belgisi qaysi ikki songa tegishli?", 'К каким двум числам относится знак деления?', 'Which two numbers does the division sign belong to?'),
      viz: () => <ReadViz tokens={['18', '−', '6', ':', '3', '+', '4']} mode="pair" mark={3} />,
      ok: L("Belgi O'ZI turgan ikki sonni biriktiradi: 6 va 3.", 'Знак связывает те два числа, между которыми он стоит: 6 и 3.', 'A sign links the two numbers it stands between: 6 and 3.'),
      items: [
        { id: 'a', label: L('6 va 3', '6 и 3', '6 and 3'), correct: true },
        { id: 'b', label: L('18 va 6', '18 и 6', '18 and 6'), tag: 'Z1', hint: L("18 va 6 orasida boshqa belgi turibdi — ayirish. Bo'lish esa undan o'ngroqda.", 'Между 18 и 6 стоит другой знак — вычитание. Деление правее.', 'Between 18 and 6 stands a different sign, the subtraction. The division is further right.') },
        { id: 'c', label: L('3 va 4', '3 и 4', '3 and 4'), hint: L("3 va 4 orasida qo'shish turibdi. Bo'lish uchlikdan CHAPDA.", 'Между 3 и 4 стоит сложение. Деление левее тройки.', 'Between 3 and 4 stands the addition. The division is to the left of the three.') },
        { id: 'd', label: L('18 va 3', '18 и 3', '18 and 3'), hint: L("Belgi FAQAT yonidagi ikki songa tegishli. 18 bilan 3 orasida yana bitta son bor.", 'Знак относится только к соседним числам. Между 18 и 3 стоит ещё одно число.', 'A sign belongs only to its neighbours. Between 18 and 3 there is another number.') },
      ],
    },
    {
      prompt: '2 · (3 + 4)',
      question: L('Qavs nimani qamrab olgan?', 'Что охватывает скобка?', 'What does the bracket hold?'),
      viz: () => <ReadViz tokens={['2', '·', '(', '3', '+', '4', ')']} mode="bracket" mark={[2, 6]} />,
      ok: L("Faqat qavs ICHIDAGISINI: uch qo'shish to'rt.", 'Только то, что ВНУТРИ неё: три плюс четыре.', 'Only what is INSIDE it: three plus four.'),
      items: [
        { id: 'a', label: '3 + 4', correct: true },
        { id: 'b', label: '2 · 3', tag: 'Z4', hint: L("Ko'paytirish qavsdan OLDIN turibdi, ya'ni uning ichiga kirmaydi.", 'Умножение стоит ПЕРЕД скобкой, значит внутрь не входит.', 'The multiplication stands BEFORE the bracket, so it is not inside.') },
        { id: 'c', label: L('butun yozuv', 'вся запись', 'the whole expression'), tag: 'Z4', hint: L("Qavs ko'paytirish belgisidan KEYIN ochiladi, demak ikkilik tashqarida qoldi.", 'Скобка открывается ПОСЛЕ знака умножения, значит двойка осталась снаружи.', 'The bracket opens AFTER the multiplication sign, so the two stayed outside.') },
        { id: 'd', label: L('faqat 3', 'только 3', 'only the 3'), hint: L("Qavs ichida ikkita son va ular orasidagi belgi turibdi.", 'Внутри скобки два числа и знак между ними.', 'Inside the bracket there are two numbers and the sign between them.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoidani izlashdan oldin yozuvni O'QISHNI mashq qilamiz. Hisoblash hozir kerak emas, va bu yerda baho ham yo'q.", 'Прежде чем искать правило, потренируемся ЧИТАТЬ запись. Считать сейчас не нужно, и оценки здесь нет.', 'Before we look for the rule, let us practise READING an expression. No counting yet, and nothing is graded here.'),
    A('1', "Ikkinchisi. Har bir belgi ikkita songa tegishli. Qaysilariga ekanini toping.", 'Второе. Каждый знак относится к двум числам. Найди, к каким.', 'Second. Every sign belongs to two numbers. Find which ones.'),
    A('2', "Uchinchisi. Qavs butun yozuvni emas, uning bir qismini qamrab oladi.", 'Третье. Скобка охватывает не всю запись, а её часть.', 'Third. A bracket holds part of the expression, not all of it.'),
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
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'support' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1. O'quvchi tartibni O'ZI qo'yadi.
// Asbob o'quvchining tartibi bo'yicha hisoblaydi -- ya'ni u NAZORATCHI,
// oracle emas (§8.1): javobni ko'rsatmaydi, o'quvchining qadamini tekshiradi.
// ============================================================
const S3 = {
  hack: L("Bo'lish va ko'paytirish BIR bosqichda: ular orasida tartibni muhimlik emas, yozuvdagi O'RIN hal qiladi.", 'Деление и умножение — ОДНА ступень: между ними порядок решает не важность, а МЕСТО в записи.', 'Division and multiplication are ONE stage: between them the order is decided by POSITION, not importance.'),
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L("Tartibni o'zingiz qo'ying", 'Расставь порядок сам', 'Set the order yourself'),
  ask: ASK_ORDER,
  nums: [18, 6, 3, 4],
  ops: ['−', ':', '+'],
  ruleOrder: [1, 0, 2],
  yoursLabel: L('sizning tartibingiz bo\'yicha', 'по твоему порядку', 'by your order'),
  ruleLabel: L('qoida bo\'yicha', 'по правилу', 'by the rule'),
  note: L(
    "Yozuv bitta, son esa ikkita. Demak tartib haqiqatan ham hal qiladi.",
    'Запись одна, а чисел два. Значит порядок действительно решает.',
    'One expression, two numbers. So the order really does decide.',
  ),
  sameNote: L(
    "Siz qoida bilan bir xil tartibni qo'ydingiz. Unda oddiy kalkulyator qaysi tartibni olgan ekan.",
    'Ты поставил тот же порядок, что и правило. Тогда какой порядок взял обычный калькулятор?',
    'You set the same order as the rule. Then what order did the basic calculator take?',
  ),
  // KADRLAR: KICHIK misolda KO'RSATAMIZ, keyin o'quvchi O'ZINIKINI qiladi
  // (metodist 2026-08-14, «ko'rsat, keyin o'zi»). Misol BOSHQA -- 18 − 6 : 3 + 4
  // dagi kashfiyot o'quvchining qo'lida qolishi kerak, aks holda uning ishi
  // takrorlashga aylanadi.
  film: [
    {
      tokens: ['2', '+', '3', '·', '4'],
      cap: L(
        "Kichik misol. Uni ikki xil tartibda hisoblaymiz.",
        'Маленький пример. Посчитаем его двумя порядками.',
        'A small example. Let us work it out in two orders.',
      ),
    },
    {
      tokens: ['2', '+', '12'],
      merge: [2, 4],
      cap: L(
        "Qoida bo'yicha avval ko'paytirish: uch kere to'rt o'n ikki.",
        'По правилу сначала умножение: три на четыре двенадцать.',
        'By the rule multiplication goes first: three times four is twelve.',
      ),
    },
    {
      tokens: ['14', '≠', '20'],
      cap: L(
        "O'n to'rt chiqdi. Ketma-ket hisoblaganda esa yigirma. Bitta yozuv, ikki son.",
        'Получилось четырнадцать. А если считать подряд — двадцать. Одна запись, два числа.',
        'That gives fourteen. Counting straight through gives twenty. One expression, two numbers.',
      ),
    },
  ],
  audio: [
    A('mount', "Avval kichik misolda ko'rsataman. Uni ikki xil tartibda hisoblaymiz.", 'Сначала покажу на маленьком примере. Посчитаем его двумя порядками.', 'First I will show it on a small example. We will work it out in two orders.'),
    A('mount', "Qoida bo'yicha avval ko'paytirish keladi, keyin qo'shish.", 'По правилу сначала идёт умножение, потом сложение.', 'By the rule multiplication comes first, then addition.'),
    A('mount', "Bitta yozuv, ikki son. Endi o'sha katta yozuvni oling va tartibni O'ZINGIZ qo'ying.", 'Одна запись, два числа. Теперь возьми ту большую запись и поставь порядок САМ.', 'One expression, two numbers. Now take that big expression and set the order YOURSELF.'),
    A('done', "Qarang. Sizning tartibingiz bo'yicha bitta son chiqdi, qoida bo'yicha boshqasi.", 'Смотри. По твоему порядку получилось одно число, по правилу другое.', 'Look. Your order gave one number, the rule gave another.'),
    A('done', "Endi sakkiz qayerdan kelganini topamiz.", 'Теперь найдём, откуда взялось восемь.', 'Now let us find where the eight came from.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S3.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const [filmDone, setFilmDone] = useState(false)
  const onFilm = useCallback(() => setFilmDone(true), [])
  // Kadrlar tugagach asbob ULARNING O'RNIGA keladi: ikkalasi birga 488px ga
  // sig'maydi (§6.1 -- yangi qadam avvalgisini almashtiradi). Oxirgi kadr
  // izohi asbob tepasida QOLADI, ya'ni tushuntirish yo'qolmaydi.
  if (!filmDone) {
    return (
      <Frame meta={S3} screen={screen} audio={audio} solved={false} {...rest}>
        <CollapseFilm frames={S3.film} audio={audio} onDone={onFilm} />
      </Frame>
    )
  }
  // Kadr izohi bu yerda TAKRORLANMAYDI. Metodist 2026-08-14: ekranda bitta
  // fikr TO'RT marta yozilgan edi -- sarlavha, kadr izohi, topshiriq va
  // pastdagi maslahat. Qoldi ikkitasi: sarlavha va topshiriq (asbob ichida).
  return (
    <Frame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      <StepOrder
        audio={audio}
        prompt={S3.ask}
        nums={S3.nums}
        ops={S3.ops}
        ruleOrder={S3.ruleOrder}
        yoursLabel={S3.yoursLabel}
        ruleLabel={S3.ruleLabel}
        note={S3.note}
        sameNote={S3.sameNote}
        tag="Z1"
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2. FARQLASH: sakkiz -- BOSHQA yozuvning qiymati.
// O'quvchi qavsni O'ZI qo'yadi, tayyor yozuvlardan tanlamaydi -- shuning
// uchun bu ekran «to'rt variantdan bittasi» kvotasiga kirmaydi (§4.2).
// ============================================================
const S4 = {
  solLabel: L("To'liq yechim", 'Полное решение', 'The full solution'),
  solution: [
    { expr: '( 18 − 6 ) : 3 + 4', say: L("Qavs turibdi — avval uning ichini hisoblaymiz.", 'Скобка стоит — сначала считаем её.', 'There is a bracket, so we do what is inside it first.') },
    { expr: '12 : 3 + 4', say: L("O'n sakkizdan oltini ayirsak, o'n ikki bo'ladi.", 'Восемнадцать минус шесть будет двенадцать.', 'Eighteen minus six is twelve.') },
    { expr: '4 + 4', say: L("O'n ikkini uchga bo'lsak, to'rt bo'ladi. Bo'lish — ikkinchi bosqich, u qo'shishdan oldin.", 'Двенадцать разделить на три будет четыре. Деление — вторая ступень, оно раньше сложения.', 'Twelve divided by three is four. Division is second-stage, it comes before addition.') },
    { expr: '8', say: L("To'rt qo'shish to'rt — sakkiz. Mana oddiy kalkulyatorning soni.", 'Четыре плюс четыре — восемь. Вот число обычного калькулятора.', 'Four plus four is eight. That is the basic calculator number.') },
  ],
  bonus: {
    title: L('Bitta yozuv, ikki qiymat', 'Одна запись, два значения', 'One expression, two values'),
    text: L(
      "Sonlar bir xil, belgilar ham. Farqni QAVS qildi: u yozuvni, demak qiymatni ham o'zgartiradi.",
      'Числа те же, знаки те же. Разницу сделала СКОБКА: она меняет запись, а значит и значение.',
      'Same numbers, same signs. The BRACKET made the difference: it changes the expression, so the value.',
    ),
  },
  method: L('1-usul — qavs bilan', 'Способ 1 — скобкой', 'Way 1 — with a bracket'),
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Sakkiz qayerdan keldi', 'Откуда взялось восемь', 'Where the eight came from'),
  rounds: [
    {
      nums: [18, 6, 3, 4],
      ops: ['−', ':', '+'],
      answer: { from: 0, to: 1 },
      prompt: L(
        "Qavsni shunday qo'yingki, qiymat sakkiz bo'lsin.",
        'Поставь скобку так, чтобы значение стало равно восьми.',
        'Place a bracket so that the value comes out as eight.',
      ),
      baseNote: L('Qavssiz bu yozuvning qiymati 20', 'Без скобок значение этой записи равно 20', 'With no brackets the value is 20'),
      hints: {
        '1-2': L("Qavs hech narsani o'zgartirmadi, bo'lish baribir birinchi bajarilardi. Qavs ichiga boshqa narsani oling.", 'Скобка ничего не изменила: деление и так считалось первым. Возьми в скобку что-нибудь другое.', 'The bracket changed nothing: the division was going first anyway. Put something else inside it.'),
        '2-3': L("Endi uch va to'rt qo'shildi, va bo'linadigan son o'zgardi. Sakkiz olish uchun qavs boshqa joyda turishi kerak.", 'Теперь три и четыре сложились, и делить пришлось на другое число. Чтобы получить восемь, скобка должна стоять в другом месте.', 'Now three and four were added and the divisor changed. To get eight the bracket has to sit elsewhere.'),
        '0-2': L("Qavs ichida ham o'sha tartib ishlaydi, shuning uchun son o'zgarmadi. Bo'lishni qavsdan chiqarib ko'ring.", 'Внутри скобки работает тот же порядок, поэтому число не изменилось. Попробуй оставить деление за скобкой.', 'The same order works inside the bracket, so the number did not change. Try leaving the division outside.'),
        '*': L("Qavs ichidagi avval hisoblanadi. Sakkiz chiqishi uchun qaysi ikkita son birga turishi kerakligini o'ylang.", 'Сначала считается то, что в скобке. Подумай, какие два числа должны оказаться вместе, чтобы получилось восемь.', 'What is inside the bracket goes first. Think which two numbers must end up together to give eight.'),
      },
      tag: 'Z4',
    },
    // IKKINCHI raund. Qavssiz ham 20 chiqadi, shuning uchun topshiriq
    // teskari qo'yiladi: qavsni shunday qo'yingki, qiymat O'ZGARMASIN.
    // O'quvchi o'z qo'li bilan topadi: allaqachon birinchi bajariladigan
    // amal atrofidagi qavs ORTIQCHA. Bu 5-ekrandagi bonusga ko'prik --
    // «qoida qavsni almashtiradi». Va aynan shu ikkinchi raund tufayli
    // 8-ekranda ikkala usul BIR XIL songa keladi.
    {
      nums: [18, 6, 3, 4],
      ops: ['−', ':', '+'],
      answer: { from: 1, to: 2 },
      prompt: L(
        "Endi qavsni shunday qo'yingki, qiymat O'ZGARMASIN — 20 bo'lib qolsin.",
        'Теперь поставь скобку так, чтобы значение НЕ изменилось — осталось 20.',
        'Now place a bracket so the value does NOT change — it stays 20.',
      ),
      baseNote: L('Qavssiz bu yozuvning qiymati 20', 'Без скобок значение этой записи равно 20', 'With no brackets the value is 20'),
      hints: {
        '0-1': L("Bu qavs qiymatni sakkizga o'zgartirdi. Bizga esa o'zgarmasligi kerak.", 'Эта скобка изменила значение на восемь. А нам нужно, чтобы оно не менялось.', 'That bracket changed the value to eight. We need it unchanged.'),
        '2-3': L("Endi uch va to'rt qo'shildi, va bo'linadigan son o'zgardi. Qiymat ham o'zgardi.", 'Теперь сложились три и четыре, и делить пришлось на другое число. Значение изменилось.', 'Now three and four were added and the divisor changed. The value changed too.'),
        '*': L("Qaysi amal qoida bo'yicha ALLAQACHON birinchi bajariladi? Qavsni aynan uning atrofiga qo'ying.", 'Какое действие по правилу и так выполняется первым? Поставь скобку именно вокруг него.', 'Which operation already goes first by the rule? Put the bracket around exactly that one.'),
      },
      tag: 'Z4',
    },
  ],
  audio: [
    A('mount', "Oddiy kalkulyator sakkizni berdi. Bu son qayerdan kelganini ko'ramiz.", 'Обычный калькулятор дал восемь. Посмотрим, откуда это число берётся.', 'The basic calculator gave eight. Let us see where that number comes from.'),
    A('mount', "Yozuvga qavs qo'ying. Shunday qo'yingki, qiymat aynan sakkiz bo'lsin.", 'Поставь в запись скобку. Так, чтобы значение стало ровно восемь.', 'Place a bracket in the expression. Place it so the value comes out as exactly eight.'),
    A('ok1', "Mana javob. Sakkiz bu qavsli yozuvning qiymati. Oddiy kalkulyator xato qilmagan, u boshqa yozuvni o'qigan.", 'Вот и ответ. Восемь это значение записи со скобкой. Обычный калькулятор не ошибся, он прочитал другую запись.', 'There it is. Eight is the value of the expression with the bracket. The basic calculator did not make a mistake, it read a different expression.'),
    A('ok1', "Bu ikki yozuvni yonma-yon qo'ying va ular orasiga teng emas belgisini qo'ying. Sonlar bir xil, qiymatlar esa har xil.", 'Поставь эти две записи рядом и между ними знак не равно. Числа одни и те же, а значения разные.', 'Put these two expressions side by side with a not-equal sign between them. The same numbers, different values.'),
    A('ok1', "Endi teskari topshiriq. Qavsni shunday qo'ying, qiymat o'zgarmasin.", 'Теперь обратное задание. Поставь скобку так, чтобы значение не изменилось.', 'Now the opposite task. Place a bracket so the value does not change.'),
    A('ok2', "Mana. Qoida bo'yicha allaqachon birinchi bajariladigan amal atrofidagi qavs ORTIQCHA. Qoida uni o'zi almashtiradi.", 'Вот так. Скобка вокруг того, что по правилу и так идёт первым, лишняя. Правило само её заменяет.', 'There. A bracket around what the rule already does first is redundant. The rule replaces it.'),
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
      {/* Yechim asbobning O'RNINI egallaydi: ikkalasi birga 488px ga sig'maydi
          (§6.1 -- yangi qadam avvalgisini almashtiradi). O'quvchi qavsni
          allaqachon O'ZI qo'ygan, ya'ni yechim javobni ochmaydi, YO'LNI
          ko'rsatadi (§8.1). */}
      {done ? (
        <SolutionSteps lines={S4.solution} label={S4.solLabel} />
      ) : (
      <BracketGap
        audio={audio}
        rounds={S4.rounds}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      )}
    </Frame>
  )
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3. O'SHA g'oya BOSHQA ko'rinishda: bosqichlar.
// Atamalar shu yerda DARSLIK so'zi bilan kiritiladi (1-paragraf, 12-bet).
// To'rt qator -- budjet chegarasi (bir qator 40px).
// ============================================================
const S5 = {
  bonus: {
    title: L('Qavssiz ham ishlaydi', 'Работает и без скобок', 'It works with no brackets'),
    text: L(
      "Bosqichlar o'sha tartibni O'ZI beradi. Shuning uchun matematikada qavs har doim ham yozilmaydi: qoida uni ALMASHTIRADI.",
      'Ступени сами задают тот же порядок. Поэтому в математике скобки пишут не всегда: правило их заменяет.',
      'The stages set that same order themselves. That is why brackets are not always written: the rule replaces them.',
    ),
  },
  method: L('2-usul — bosqichlar bilan', 'Способ 2 — по ступеням', 'Way 2 — by stages'),
  eyebrow: L('ANIQ NOMLAR', 'ТОЧНЫЕ НАЗВАНИЯ', 'THE PROPER NAMES'),
  title: L('Amallar bosqichlari', 'Ступени действий', 'Stages of operations'),
  start: '40 : 8 + 3 · 2 − 5',
  steps: [
    { part: '40 : 8', action: 'stage2', to: '5 + 3 · 2 − 5', parts: ['40 : 8', '8 + 3', '3 · 2'],
      say: L("Qirq bo'lish sakkiz — besh. Ikkinchi bosqich, va u eng chapda.", 'Сорок разделить на восемь — пять. Вторая ступень, и она самая левая.', 'Forty divided by eight is five. Second stage, and it is leftmost.'),
      needPart: L("Avval qismni tanlang.", 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'stage2', part: '3 · 2', hint: L("Ikkalasi ham ikkinchi bosqichda, lekin qoida chapdan o'ngga deydi. Qaysi biri chaproqda?", 'Обе на второй ступени, но правило говорит слева направо. Какая из них левее?', 'Both are second-stage, but the rule says left to right. Which is further left?'), tag: 'Z2' },
        { action: 'stage1', hint: L("Bu yozuvda ikkinchi bosqich amallari bor, ular oldinroq bajariladi.", 'В этой записи есть действия второй ступени, они выполняются раньше.', 'This expression has second-stage operations, they go first.'), tag: 'Z1' },
        { action: 'bracket', hint: L("Bu yozuvda qavs yo'q.", 'В этой записи скобок нет.', 'There are no brackets here.') },
      ] },
    { part: '3 · 2', action: 'stage2', to: '5 + 6 − 5', parts: ['3 · 2', '5 + 3', '2 − 5'],
      say: L("Uch ko'paytiruv ikki — olti. Ikkinchi bosqich tugadi.", 'Три умножить на два — шесть. Вторая ступень закончилась.', 'Three times two is six. The second stage is done.'),
      needPart: L("Avval qismni tanlang.", 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'stage1', hint: L("Yozuvda hali ko'paytirish turibdi, u oldin bajariladi.", 'В записи ещё осталось умножение, оно выполняется раньше.', 'A multiplication is still there, it goes first.'), tag: 'Z1' },
      ] },
    { part: '5 + 6', action: 'stage1', to: '11 − 5', parts: ['5 + 6', '6 − 5'],
      say: L("Endi birinchi bosqich, chapdan o'ngga: besh qo'shish olti — o'n bir.", 'Теперь первая ступень, слева направо: пять плюс шесть — одиннадцать.', 'Now the first stage, left to right: five plus six is eleven.'),
      needPart: L("Avval qismni tanlang.", 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'stage1', part: '6 − 5', hint: L("Ikkalasi birinchi bosqichda. Chapdan o'ngga — qaysi biri chaproqda?", 'Обе на первой ступени. Слева направо — какая из них левее?', 'Both are first-stage. Left to right, which is further left?'), tag: 'Z3' },
        { action: 'stage2', hint: L("Ikkinchi bosqich amallari tugadi.", 'Действия второй ступени закончились.', 'The second-stage operations are done.') },
      ] },
    { part: '11 − 5', action: 'stage1', to: '6', parts: ['11 − 5'],
      say: L("O'n birdan beshni ayirsak — olti. Yozuvning qiymati shu.", 'Одиннадцать минус пять — шесть. Это и есть значение записи.', 'Eleven minus five is six. That is the value.'),
      needPart: L("Avval qismni tanlang.", 'Сначала выбери часть.', 'Pick a part first.'), wrongs: [] },
  ],
  footNote: L('Qiymat topildi', 'Значение найдено', 'The value is found'),
  solLabel: L("To'liq yechim", 'Полное решение', 'The full solution'),
  solution: [
    { expr: '40 : 8 + 3 · 2 − 5', say: L("Ikkinchi bosqich birinchi ketadi, chapdan boshlaymiz.", 'Вторая ступень идёт первой, начинаем слева.', 'The second stage goes first, we start from the left.') },
    { expr: '5 + 3 · 2 − 5', say: L("Qirq bo'lish sakkiz — besh.", 'Сорок разделить на восемь — пять.', 'Forty divided by eight is five.') },
    { expr: '5 + 6 − 5', say: L("Uch ko'paytiruv ikki — olti.", 'Три умножить на два — шесть.', 'Three times two is six.') },
    { expr: '11 − 5', say: L("Chapdan o'ngga: besh qo'shish olti — o'n bir.", 'Слева направо: пять плюс шесть — одиннадцать.', 'Left to right: five plus six is eleven.') },
    { expr: '6', say: L("O'n birdan beshni ayirsak — olti.", 'Одиннадцать минус пять — шесть.', 'Eleven minus five is six.') },
  ],
  // LENTA plashkalari: har bajarilgan qadam bittadan qoldiradi.
  // 8-ekranda shu lenta 4-ekrandagi lenta bilan yonma-yon qo'yiladi.
  // Plashkalar SAQLANIB qoldi, lekin chizilmaydi: «sqvoz lenta» qaroridan
  // keyin ular yakunda kerak bo'ladi. Ekran 5 da esa ular takror edi va
  // ekranni o'stirardi (§9.6).
  chips: ['40 : 8 → 5', '3 · 2 → 6', '5 + 6 → 11', '11 − 5 → 6'],
  audio: [
    A('mount', "Endi narsalarni aniq nomlari bilan ataymiz. Qo'shish va ayirish birinchi bosqich amallari, ko'paytirish va bo'lish ikkinchi bosqich amallari. Darajaga ko'tarish uchinchi bosqich, u bilan keyinroq uchrashamiz.", 'Теперь назовём вещи их точными именами. Сложение и вычитание это действия первой ступени, умножение и деление это действия второй ступени. Возведение в степень это третья ступень, с ней мы встретимся позже.', 'Now let us call things by their proper names. Addition and subtraction are first-stage operations, multiplication and division are second-stage. Raising to a power is the third stage, and we will meet it later.'),
    A('mount', "Ikkinchi bosqich oldin ketadi. Qarang, olti va uch bir-biriga yaqinlashadi.", 'Вторая ступень идёт раньше. Смотри, шесть и три сближаются.', 'The second stage goes first. Watch, the six and the three move together.'),
    A('mount', "Ular bitta songa aylandi. Ikki. Qolgan ikki amal bitta bosqichda.", 'Они стали одним числом. Два. Оставшиеся два действия на одной ступени.', 'They became one number. Two. The two remaining operations are on the same stage.'),
    A('mount', "Bitta bosqich ichida kattalik yo'q, faqat yozilish tartibi bor. Chapdan o'ngga.", 'Внутри одной ступени старшинства нет, есть только порядок записи. Слева направо.', 'Inside one stage nothing outranks anything, there is only the written order. Left to right.'),
    A('mount', "O'n olti hosil bo'ldi.", 'Получилось шестнадцать.', 'That gives sixteen.'),
    A('mount', "Oxirgi amal qoldi. O'n olti qo'shish to'rt.", 'Осталось последнее действие. Шестнадцать плюс четыре.', 'One last operation. Sixteen plus four.'),
    A('mount', "Yigirma. Endi o'sha yo'lni o'zingiz daftardagidek yozib chiqing. Qismini tanlang, amalni tanlang, va yangi qator pastda paydo bo'ladi.", 'Двадцать. Теперь пройди тот же путь сам и запиши строками, как в тетради. Выбери часть, выбери действие, и новая строка появится ниже.', 'Twenty. Now walk the same path yourself and write it as lines. Pick a part, pick an operation, and a new line appears below.'),
    A('step2', "Ikkinchi bosqich birinchi ketdi. Olti bo'lish uch ikkiga aylandi, qolgani esa joyida turibdi.", 'Вторая ступень пошла первой. Шесть разделить на три стало двойкой, остальное осталось на месте.', 'The second stage went first. Six divided by three became two, and the rest stayed put.'),
    A('step4', "Qolgan ikkita amal bitta bosqichda. Ular yozilish tartibida, chapdan o'ngga bajariladi.", 'Оставшиеся два действия на одной ступени. Они выполняются в порядке записи, слева направо.', 'The two remaining operations are on the same stage. They are done in the order they are written, left to right.'),
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
      {/* LENTA OLIB TASHLANDI (o'lchov 2026-08-14). Ikki sabab.
          1. U ekranni O'STIRARDI: birinchi qadamdan keyin 55px qo'shilardi
             va noutbukda 44px oshib ketardi. §6.1: ekran to'ladi, o'smaydi.
          2. U TAKROR edi: qayta yozish panelida hamma qatorlar allaqachon
             turibdi, plashkalar o'sha sonlarni ikkinchi marta ko'rsatardi.
          Butun dars bo'ylab «sqvoz lenta» g'oyasi shundan kelib chiqib
          ALOHIDA joy talab qiladi -- masalan, yakundagi kartochkalardan
          birining O'RNIGA. Bu metodist qarori (DARS01_HOLAT.md §9.6). */}
      {/* Qayta yozish tugagach asbob O'RNIGA to'liq yechim keladi -- 4-ekrandagi
          kabi. Ramka balandligi oldindan band, ya'ni qator qo'shilganda ekran
          O'SMAYDI. Shu bilan 5-ekrandagi 133px oshish ham yopiladi. */}
      {done ? (
        <SolutionSteps lines={S5.solution} label={S5.solLabel} />
      ) : (
      <Transform
        audio={audio}
        start={S5.start}
        steps={S5.steps}
        actions={ACTIONS}
        disabled={!canAnswer}
        onStep={(st) => audio.step(st)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      )}
    </Frame>
  )
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4. YANGI HOLAT: ikkala amal ham II bosqichda.
// KVOTA EKRANI: bu yerda yagona harakat -- to'rt variantdan bittasi (§4.2).
// ============================================================
const S6 = {
  // LAYFXAK bu ekranda YO'Q: uning gapi endi IKKI YO'LAK bilan
  // ko'rsatiladi, va ikkalasi birga 488px ga sig'masdi (o'lchov
  // 2026-08-14). Ko'rsatish so'zdan kuchliroq.
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Ikkalasi ham ikkinchi bosqichda', 'Обе на второй ступени', 'Both on the second stage'),
  expr: '24 : 6 · 2',
  nums: [24, 6, 2],
  ops: [':', '·'],
  rightLabel: L("qoida bo'yicha: chapdan o'ngga", 'по правилу: слева направо', 'by the rule: left to right'),
  wrongLabel: L("«avval ko'paytirish»", '«сначала умножение»', 'multiplication first'),
  probe: {
    // O'sha savol, o'sha so'zlar bilan: 2, 6 va 14-ekran bir xil so'raydi.
    question: ASK_VALUE,
    ok: L("Ha. Ikkalasi bitta bosqichda, shuning uchun chapdan o'ngga.", 'Да. Обе на одной ступени, поэтому слева направо.', 'Yes. Both on the same stage, so left to right.'),
    items: [
      { id: 'a', label: '8', correct: true },
      { id: 'b', label: '2', tag: 'Z2', hint: L("Siz ko'paytirishni bo'lishdan oldin hisobladingiz. Ikkalasi ham ikkinchi bosqichda, ular orasida kattaligi bo'yicha farq yo'q. Yozuvda qaysi belgi chaproqda turganiga qarang.", 'Ты посчитал умножение раньше деления. Обе на второй ступени, и старшинства между ними нет. Посмотри, какой из двух знаков стоит в записи левее.', 'You did the multiplication before the division. Both are second-stage and neither outranks the other. Look at which of the two signs stands further left.') },
      { id: 'c', label: '12', hint: L("Bu yozuvning faqat bir qismi. Yigirma to'rtga bo'lish bajarilmay qoldi.", 'Это значение только части записи. Деление двадцати четырёх осталось несделанным.', 'That is the value of only a part. The division of twenty-four was never done.') },
      { id: 'd', label: '48', hint: L("Bu yerda yigirma to'rt ikkiga ko'paytirilgan. Oltilikdan oldin esa bo'lish belgisi turibdi.", 'Здесь двадцать четыре умножено на два. А перед шестёркой стоит знак деления.', 'Here twenty-four was multiplied by two. But the sign before the six is division.') },
    ],
  },
  audio: [
    A('mount', "Yangi holat. Bu yerda ikkala amal ham bitta bosqichda turibdi.", 'Новый случай. Здесь оба действия стоят на одной ступени.', 'A new case. Here both operations are on the same stage.'),
    A('mount', "Qiymatni toping.", 'Найди значение.', 'Find the value.'),
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
      {/* `hero` EMAS: layfxak qo'shilgach noutbukda 8px oshib ketardi
          (o'lchov 2026-08-13). Yozuv qisqa, `big` da ham yaxshi ko'rinadi. */}
      <Expr size="big">{S6.expr}</Expr>
      <Probe
        data={S6.probe}
        cols={2}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {/* IKKI YO'L javobdan KEYIN (metodist tasdiqladi 2026-08-14).
          Bu ekranning butun ma'nosi «nega sakkiz, nega ikki emas» degan
          savolda. Endi ikkala yo'l YONMA-YON hisoblanadi: qoida bo'yicha
          chapdan o'ngga, va «avval ko'paytirish». Javobdan oldin
          ko'rsatilmaydi -- aks holda javobni aytib qo'yardi. */}
      {done ? (
        <div className="g7-so-out">
          <CollapseTrack nums={S6.nums} ops={S6.ops} order={[0, 1]} label={t(S6.rightLabel)} tone="ok" />
          <CollapseTrack nums={S6.nums} ops={S6.ops} order={[1, 0]} label={t(S6.wrongLabel)} tone="tip" delay={900} />
        </div>
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5. CHEGARAVIY HOLAT: bitta bosqich ichida
// kattalik UMUMAN yo'q, faqat yozilish tartibi bor (darslikning 1-qoidasi).
// ============================================================
const S7 = {
  hack: L("Ayirish va qo'shish aralashsa, o'ngdan boshlash deyarli har doim boshqa son beradi.", 'Если вычитание и сложение вперемешку, счёт справа почти всегда даёт другое число.', 'When subtraction and addition are mixed, counting from the right almost always gives a different number.'),
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Bitta bosqich', 'Одна ступень', 'One stage'),
  ask: ASK_ORDER,
  // Chiziq TURTKISI: tartib qo'yilgach o'quvchi shunchaki qarab qolmasin.
  // Taklif sahnaning TEPASIDA turadi -- pastdagi belgiga ko'z yetmasdi.
  lineAsk: L(
    "Chiziqni bosing: har bosishda keyingi sakrash chiziladi.",
    'Нажимай на прямую: каждое нажатие рисует следующий прыжок.',
    'Tap the line: each tap draws the next jump.',
  ),
  nums: [20, 5, 3],
  ops: ['−', '+'],
  ruleOrder: [0, 1],
  yoursLabel: L('sizning tartibingiz bo\'yicha', 'по твоему порядку', 'by your order'),
  ruleLabel: L('qoida bo\'yicha', 'по правилу', 'by the rule'),
  note: L(
    "Bitta bosqich ichida kattalik yo'q. Faqat yozilish tartibi bor, chapdan o'ngga.",
    'Внутри одной ступени старшинства нет вообще. Есть только порядок записи, слева направо.',
    'Inside one stage nothing outranks anything. There is only the written order, left to right.',
  ),
  sameNote: L(
    "To'g'ri qo'ydingiz. Bitta bosqich ichida chapdan o'ngga, boshqa tartib yo'q.",
    'Порядок верный. Внутри одной ступени слева направо, другого порядка нет.',
    'The order is right. Inside one stage it is left to right, and there is no other order.',
  ),
  film: [
    {
      tokens: ['20', '−', '5', '+', '3'],
      cap: L(
        "Bu yerda ayirish ham, qo'shish ham birinchi bosqichda.",
        'Здесь и вычитание, и сложение — первая ступень.',
        'Here both the subtraction and the addition are first-stage.',
      ),
    },
    {
      tokens: ['20', '−', '5', '+', '3'],
      cap: L(
        "Ular orasida kattalik yo'q. Tartibni qo'ying va ikkala sonni ko'ring.",
        'Старшинства между ними нет. Расставь порядок и посмотри на оба числа.',
        'Neither outranks the other. Set the order and look at both numbers.',
      ),
    },
  ],
  // SON O'QI: ikki yo'l va ikki to'xtash joyi. O'quvchi tartibni O'ZI
  // qo'ygandan KEYIN chiziladi -- javobni ochmaydi, uni KO'RSATADI.
  lines: [
    {
      cap: L("Qoida bo'yicha: chapdan o'ngga", 'По правилу: слева направо', 'By the rule: left to right'),
      jumps: [{ from: 20, to: 15, label: '− 5' }, { from: 15, to: 18, label: '+ 3' }],
      end: 18,
    },
    {
      cap: L("«Avval qo'shish»: 5 va 3 qo'shilib, 8 ga orqaga", '«Сначала сложение»: 5 и 3 сложились, уход на 8 назад', 'Addition first: 5 and 3 added, back by 8'),
      jumps: [{ from: 20, to: 12, label: '− 8' }],
      end: 12,
    },
  ],
  audio: [
    A('mount', "Yana bitta holat qoldi, va u eng aldamchisi. Bu yerda ikkala amal ham birinchi bosqichda.", 'Остался ещё один случай, и он самый обманчивый. Здесь оба действия на первой ступени.', 'One case is left, and it is the most deceptive one. Here both operations are first-stage.'),
    A('mount', "Ular orasida kattalik yo'q. Tartibni qo'ying va ikkala sonni ko'ring.", 'Старшинства между ними нет. Расставь порядок и посмотри на оба числа.', 'Neither outranks the other. Set the order and look at both numbers.'),
    A('done', "Bitta bosqich ichida kattalik yo'q. Faqat yozilish tartibi bor.", 'Внутри одной ступени старшинства нет вообще. Есть только порядок записи.', 'Inside one stage nothing outranks anything. There is only the written order.'),
    A('done', "Ikki amal bitta bosqichda turganda har doim shunday bo'ladi.", 'Так бывает всегда, когда два действия стоят на одной ступени.', 'That is always how it goes when two operations sit on the same stage.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S7.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const [filmDone, setFilmDone] = useState(false)
  const onFilm = useCallback(() => setFilmDone(true), [])
  if (!filmDone) {
    return (
      <Frame meta={S7} screen={screen} audio={audio} solved={false} {...rest}>
        <CollapseFilm frames={S7.film} audio={audio} onDone={onFilm} />
      </Frame>
    )
  }
  if (done) {
    return (
      <Frame meta={S7} screen={screen} audio={audio} solved {...rest}>
        <Hint>{t(S7.note)}</Hint>
        {/* Sakrashlarni O'QUVCHI chiqaradi: chiziqni bosadi va navbatdagi
            yoy chiziladi. Taymer olib tashlandi (§7: qadamni taymer
            yetaklamaydi) va ekran tomoshadan ISHGA aylandi. */}
        <NumberLineTracks tracks={S7.lines} audio={audio} manual prompt={S7.lineAsk} />
      </Frame>
    )
  }
  return (
    <Frame meta={S7} screen={screen} audio={audio} solved={done} {...rest}>
      <Hint>{t(S7.film[S7.film.length - 1].cap)}</Hint>
      <StepOrder
        audio={audio}
        prompt={S7.ask}
        nums={S7.nums}
        ops={S7.ops}
        ruleOrder={S7.ruleOrder}
        yoursLabel={S7.yoursLabel}
        ruleLabel={S7.ruleLabel}
        note={S7.note}
        sameNote={S7.sameNote}
        tag="Z3"
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 8. QOIDA. O'quvchi qoidani BO'LAKLARDAN YIG'ADI (4-sinf usuli).
// Kartochka faqat to'g'ri yig'ilgandan keyin ochiladi va yig'ish maydonini
// ALMASHTIRADI: ikkalasi birga 400px ga sig'maydi (§6.1).
// Pastida XUK QAYTADI: sakkiz so'nadi, yigirma yashil bo'ladi (2, 3-sinf).
// Maydon TO'Q SARIQ.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('avval qavs ichidagi amallar', 'сначала действия в скобках', 'first what is inside the brackets') },
    { id: 'f2', label: L("so'ng uchinchi bosqich amallari", 'затем действия третьей ступени', 'then the third-stage operations') },
    { id: 'f3', label: L("so'ng ikkinchi bosqich amallari", 'затем действия второй ступени', 'then the second-stage operations') },
    { id: 'f4', label: L("so'ng birinchi bosqich amallari", 'затем действия первой ступени', 'then the first-stage operations') },
    { id: 'f5', label: L("bitta bosqich ichida chapdan o'ngga", 'внутри одной ступени слева направо', 'inside one stage, left to right') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4', 'f5'],
  wrongHint: L(
    "Tartib buzildi. Qavs qayerda turishi kerakligini o'ylab ko'ring, u boshqa hamma narsadan oldin ishlaydi.",
    'Порядок нарушен. Подумай, где должны стоять скобки: они срабатывают раньше всего остального.',
    'The order is off. Think about where the brackets belong. They act before everything else.',
  ),
  // Qonun endi JONLI: qismlari birma-bir yonadi (LawReveal), shuning uchun
  // kartochkadagi qotib qolgan formula OLIB TASHLANDI -- ikkitasi bir vaqtda
  // bir narsani ikki marta aytardi va balandlikni ham yerdi.
  // Qoida darsdagi RANGLAR bilan yig'iladi: qavs -- bog'lanish rangi,
  // II va I -- o'sha bosqich ranglari, III esa neytral (bu darsda daraja
  // yo'q, u faqat o'rinni egallab turadi).
  lawChips: [
    { label: '( )', tone: 'par' },
    { label: 'III', tone: 'off' },
    { label: 'II', tone: 's2' },
    { label: 'I', tone: 's1' },
  ],
  lawSweep: L(
    "bitta bosqich ichida — chapdan o'ngga",
    'внутри одной ступени — слева направо',
    'inside one stage — left to right',
  ),
  rule: {
    // Metodist qarori 2026-08-13: darslikka havola OLIB TASHLANDI.
    // DIQQAT: ETALON_7SINF.md §6.5 «paragraf va bet SHART» deydi -- bu
    // talabdan chekinish, va u ataylab qilingan, unutilgani uchun emas.
    badge: L('Qoida', 'Правило', 'The rule'),
    // Metodist qarori 2026-08-14: kartochkadagi matn QISQARTIRILDI.
    // Ta'rifning MA'NOSI o'zgarmadi, faqat darslikning uzun qurilishi
    // olib tashlandi -- kartochka ekranning yarmini egallardi.
    lines: [
      L(
        "Sonli ifoda -- sonlar va amallardan tuzilgan yozuv.",
        'Числовое выражение — запись из чисел и действий.',
        'A numerical expression is a record made of numbers and operations.',
      ),
      L(
        "Uning qiymati -- amallarni bajarib olingan son.",
        'Его значение — число, полученное после выполнения действий.',
        'Its value is the number you get after carrying the operations out.',
      ),
    ],
  },
  hookCap: L('Bitta yozuv — bitta qiymat', 'Одна запись — одно значение', 'One expression, one value'),
  // Birinchi xatodan keyin ochiladigan LUG'AT. Tartibni aytmaydi -- faqat
  // qaysi amal qaysi bosqichda ekanini eslatadi (§8.4).
  helpLabel: L('Bosqichlar', 'Ступени', 'The stages'),
  helpRows: [
    L('I — qo\'shish va ayirish', 'I — сложение и вычитание', 'I — addition and subtraction'),
    L('II — ko\'paytirish va bo\'lish', 'II — умножение и деление', 'II — multiplication and division'),
    L('III — darajaga ko\'tarish', 'III — возведение в степень', 'III — raising to a power'),
  ],
  audio: [
    A('mount', "Hamma narsani ko'rdik. Endi qoidani so'z bilan yig'amiz.", 'Всё, что нужно, мы увидели. Теперь соберём правило словами.', 'We have seen everything we need. Now let us put the rule into words.'),
    A('mount', "Bo'laklarni to'g'ri tartibda joylashtiring.", 'Разложи фрагменты в верном порядке.', 'Put the pieces in the right order.'),
    A('ok', "To'g'ri. Endi shu qoidaning qisqa ta'rifini o'qing.", 'Верно. Теперь прочитай короткое определение этого правила.', 'Correct. Now read the short definition of this rule.'),
    A('ok', "Va birinchi ekranga qayting. Sakkiz o'chdi, yigirma qoldi. Bitta yozuvning qiymati bitta bo'ladi.", 'И вернёмся к первому экрану. Восемь погасло, двадцать осталось. У одной записи значение одно.', 'And back to the first screen. The eight is gone, the twenty stays. One expression has one value.'),
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
            <TwoValues left={S1.left} right={S1.right} dim="left" ok="right" />
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
// bo'laklardan YIG'ILADI, ortiqcha bo'laklar esa yanglish tushunchalardan
// olingan (§5.1, 4-band). Shuning uchun bu ekran kvotaga kirmaydi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Uchala yozuvda ham birinchi bo'lib IKKINCHI bosqich bajarildi. Qoida uchtasida ham bir xil ishladi.",
      'Во всех трёх записях первой шла ВТОРАЯ ступень. Правило сработало одинаково в каждой.',
      'In all three the SECOND stage went first. The rule worked the same way in each.',
    ),
  },
  rounds: [
    {
      template: ['30 − ', { slot: 0 }, ' = ', { slot: 1 }],
      parts: [{ id: 'p3', label: '3' }, { id: 'p18', label: '18' }, { id: 'p27', label: '27' }, { id: 'p45', label: '4,5' }],
      answer: ['p3', 'p27'],
      prompt: L("30 − 12 : 4 ning qiymatini yig'ing", 'Собери значение 30 − 12 : 4', 'Build the value of 30 − 12 : 4'),
      checkNote: L('Bo\'lish birinchi: 12 : 4 = 3, so\'ng 30 − 3 = 27', 'Деление первым: 12 : 4 = 3, затем 30 − 3 = 27', 'Division first: 12 : 4 = 3, then 30 − 3 = 27'),
      wrongs: [
        { key: 'p18|p45', tag: 'Z1', hint: L("Chapdan o'ngga sanasangiz, butun son ham chiqmaydi. Qaysi amal ikkinchi bosqichda ekaniga qarang.", 'Если считать подряд слева направо, не получится даже целого числа. Посмотри, какое из действий на второй ступени.', 'Counting straight left to right does not even give a whole number. Look at which operation is second-stage.') },
        { key: '*', tag: 'Z1', hint: L("Birinchi katakka ikkinchi bosqich amalining natijasi tushadi.", 'В первую клетку идёт результат действия второй ступени.', 'The first box takes the result of the second-stage operation.') },
      ],
    },
    {
      template: ['5 + ', { slot: 0 }, ' = ', { slot: 1 }],
      parts: [{ id: 'p18', label: '18' }, { id: 'p8', label: '8' }, { id: 'p23', label: '23' }, { id: 'p48', label: '48' }],
      answer: ['p18', 'p23'],
      prompt: L("5 + 3 · 6 ning qiymatini yig'ing", 'Собери значение 5 + 3 · 6', 'Build the value of 5 + 3 · 6'),
      checkNote: L("Ko'paytirish birinchi: 3 · 6 = 18, so'ng 5 + 18 = 23", 'Умножение первым: 3 · 6 = 18, затем 5 + 18 = 23', 'Multiplication first: 3 · 6 = 18, then 5 + 18 = 23'),
      wrongs: [
        { key: 'p8|p48', tag: 'Z1', hint: L("Qirq sakkiz bu sakkizni oltiga ko'paytirgani. Beshlik esa ko'paytirishga kirmasligi kerak.", 'Сорок восемь это восемь умножить на шесть. А пятёрка в умножение входить не должна.', 'Forty-eight is eight times six. But the five should not be part of the multiplication.') },
        { key: '*', tag: 'Z1', hint: L("Beshlik qo'shishda qoladi. Ko'paytirish faqat uch va oltiga tegishli.", 'Пятёрка остаётся в сложении. Умножение относится только к тройке и шестёрке.', 'The five stays in the addition. The multiplication belongs to the three and the six only.') },
      ],
    },
    {
      template: [{ slot: 0 }, ' : 5 = ', { slot: 1 }],
      parts: [{ id: 'p5', label: '5' }, { id: 'p16', label: '1,6' }, { id: 'p1', label: '1' }, { id: 'p25', label: '25' }],
      answer: ['p5', 'p1'],
      prompt: L("40 : 8 : 5 ning qiymatini yig'ing", 'Собери значение 40 : 8 : 5', 'Build the value of 40 : 8 : 5'),
      checkNote: L("Ikkalasi ham bo'lish: 40 : 8 = 5, so'ng 5 : 5 = 1", 'Оба действия деление: 40 : 8 = 5, затем 5 : 5 = 1', 'Both are divisions: 40 : 8 = 5, then 5 : 5 = 1'),
      wrongs: [
        { key: 'p16|p25', tag: 'Z2', hint: L("Ikkala amal ham bo'lish, ikkalasi bitta bosqichda. Shuning uchun o'ngdan emas, chapdan boshlanadi.", 'Оба действия деление, обе на одной ступени. Поэтому счёт начинается слева, а не справа.', 'Both operations are division and both are on the same stage. So it starts from the left, not the right.') },
        { key: '*', tag: 'Z2', hint: L("Birinchi katakka chapdagi bo'lishning natijasi tushadi.", 'В первую клетку идёт результат левого деления.', 'The first box takes the result of the left division.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Endi uni uchta yozuvda sinab ko'ramiz.", 'Правило готово. Проверим его на трёх записях.', 'The rule is ready. Let us try it on three expressions.'),
    A('r1', "Ikkinchisi: qo'shish va ko'paytirish.", 'Второе: сложение и умножение.', 'Second: addition and multiplication.'),
    A('r2', "Uchinchisi ikkitasi ham bo'lish. Bu eng muhimi.", 'Третье, оба действия деление. Оно самое важное.', 'The third one, both operations are division. This is the important one.'),
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan: qavs va bosqich BIRGA ishlaydi.
// To'rt qator -- budjet chegarasi.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L('Qavs bilan', 'Со скобкой', 'With a bracket'),
  reward: {
    title: L("Qavs ham, bosqich ham", 'И скобка, и ступень', 'Both bracket and stage'),
    text: L(
      "Ichkarida ham o'sha tartib ishladi: avval ikkinchi bosqich, keyin birinchisi. Qavs tugagach yozuv oddiy ko'paytirishga aylandi.",
      'Внутри скобки работал тот же порядок: сначала вторая ступень, потом первая. Когда скобка закончилась, осталось обычное умножение.',
      'Inside the bracket the same order held: second stage first, then the first. When the bracket was done, a plain multiplication was left.',
    ),
  },
  start: '3 · (12 − 4 : 2)',
  steps: [
    { part: '4 : 2', action: 'bracket', to: '3 · (12 − 2)', parts: ['4 : 2', '12 − 4', '3 · 12'],
      needPart: L("Avval qismni tanlang.", 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'stage2', part: '3 · 12', hint: L("Qavs oldidagi ko'paytirish hozircha kutadi. Avval qavs ichidagi hisoblanadi.", 'Умножение перед скобкой пока ждёт. Сначала считается то, что внутри скобки.', 'The multiplication before the bracket waits. What is inside the bracket goes first.'), tag: 'Z4' },
        { action: 'stage1', hint: L("Qavs ichida ham o'sha tartib: avval ikkinchi bosqich.", 'Внутри скобки тот же порядок: сначала вторая ступень.', 'The same order holds inside the bracket: second stage first.'), tag: 'Z1' },
      ] },
    { part: '12 − 2', action: 'bracket', to: '3 · 10', parts: ['12 − 2', '3 · 12'],
      needPart: L("Avval qismni tanlang.", 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'stage2', hint: L("Qavs ichida yana bitta amal qoldi.", 'Внутри скобки осталось ещё одно действие.', 'One more operation is left inside the bracket.'), tag: 'Z4' },
      ] },
    { part: '3 · 10', action: 'stage2', to: '30', parts: ['3 · 10'],
      needPart: L("Avval qismni tanlang.", 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'bracket', hint: L("Qavs ishini tugatdi va yo'qoldi.", 'Скобка сделала своё дело и исчезла.', 'The bracket has done its job and is gone.') },
      ] },
  ],
  footNote: L('Qiymat topildi', 'Значение найдено', 'The value is found'),
  audio: [
    A('mount', "Endi qavsli yozuv. Bu yerda ikkita qoida birga ishlaydi.", 'Теперь запись со скобкой. Здесь два правила работают вместе.', 'Now an expression with a bracket. Here two rules work together.'),
    A('mount', "Har qadamda qismini tanlang va amalni ayting.", 'На каждом шаге выбирай часть и называй действие.', 'At each step pick a part and name the operation.'),
    A('step2', "Qavs ichida ham o'sha tartib. Avval bo'lish, keyin ayirish.", 'Внутри скобки тот же порядок. Сначала деление, потом вычитание.', 'Inside the bracket the same order holds. Division first, then subtraction.'),
    A('step4', "Qavs ishini tugatdi va yo'qoldi. Qolgani oddiy ko'paytirish.", 'Скобка сделала своё дело и исчезла. Дальше обычное умножение.', 'The bracket has done its job and is gone. What is left is a plain multiplication.'),
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
      <Transform
        audio={audio}
        start={S10.start}
        steps={S10.steps}
        actions={ACTIONS}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 11. MASHQ 3. ASBOBSIZ (§4.2). Ekranda na qayta hisoblash,
// na qadamba-qadam yozuv, na chizma bor -- faqat javob shakli.
// Bu yerda tekshiriladi: ko'nikma QOG'OZGA ko'chadimi (§8.1).
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L("Qiymatni o'zingiz yig'ing", 'Собери значение сам', 'Build the value yourself'),
  template: ['50 − ', { slot: 0 }, ' + 2 = ', { slot: 1 }],
  // Javobdan keyingi yig'ilish: ko'paytirish birinchi (order[0] = 1).
  nums: [50, 6, 4, 2],
  ops: ['−', '·', '+'],
  order: [1, 0, 2],
  vizLabel: L("Qoida bo'yicha", 'По правилу', 'By the rule'),
  parts: [{ id: 'p24', label: '24' }, { id: 'p26', label: '26' }, { id: 'p28', label: '28' }, { id: 'p178', label: '178' }],
  answer: ['p24', 'p28'],
  // Topshiriq AYTIB beradi, qaysi katakka nima tushishini: ilgari o'quvchi
  // to'rtta son va ikkita bo'sh katak ko'rardi, nima qayerga ketishi esa
  // hech qayerda aytilmagandi (metodist surati 2026-08-13).
  prompt: L(
    "Avval 6 · 4 ni hisoblang va BIRINCHI katakka qo'ying. Ikkinchi katakka butun yozuvning qiymati tushadi.",
    'Сначала посчитай 6 · 4 и поставь в ПЕРВУЮ клетку. Во вторую клетку идёт значение всей записи.',
    'First work out 6 · 4 and put it in the FIRST box. The second box takes the value of the whole expression.',
  ),
  checkNote: L("6 · 4 = 24, so'ng 50 − 24 = 26 va 26 + 2 = 28", '6 · 4 = 24, затем 50 − 24 = 26 и 26 + 2 = 28', '6 · 4 = 24, then 50 − 24 = 26 and 26 + 2 = 28'),
  wrongs: [
    { key: 'p26|p178', tag: 'Z1', hint: L("Bu chapdan o'ngga sanagani. Ko'paytirish qaysi ikkita songa tegishli ekaniga qarang.", 'Это счёт подряд слева направо. Посмотри, к каким двум числам относится умножение.', 'That is counting straight left to right. Look at which two numbers the multiplication belongs to.') },
    { key: 'p24|p26', tag: 'Z1', hint: L("Ko'paytirish to'g'ri bajarilgan, lekin oxirgi qo'shish bajarilmagan.", 'Умножение сделано верно, но последнее сложение не выполнено.', 'The multiplication is right but the final addition was not done.') },
    { key: '*', tag: 'Z1', hint: L("Birinchi katakka ko'paytirishning natijasi tushadi, ikkinchisiga esa butun yozuvning qiymati.", 'В первую клетку идёт результат умножения, во вторую значение всей записи.', 'The first box takes the result of the multiplication, the second the value of the whole expression.') },
  ],
  audio: [
    A('mount', "Endi ekranda yordam yo'q. Qadamlar ko'rinmaydi, ularni o'zingiz o'ylaysiz.", 'Теперь помощи на экране нет. Шаги не появятся, их ты держишь в голове.', 'Now there is no help on the screen. The steps will not appear. You hold them in your head.'),
    A('mount', "Qiymatni yig'ing va tekshirishni bosing.", 'Собери значение и нажми проверить.', 'Build the value and tap check.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const t = useT()
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
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
      {/* Javobdan KEYIN yozuv o'zi yig'iladi: ko'paytirish birinchi, so'ng
          chapdan o'ngga. O'quvchi o'zini tekshiradi. Javobdan OLDIN
          ko'rsatilmaydi -- bu ekran asbobsiz ishlashni tekshiradi (§8.1). */}
      {done ? (
        <CollapseTrack nums={S11.nums} ops={S11.ops} order={S11.order} label={t(S11.vizLabel)} tone="ok" />
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 12. TUZOQ. Har qator to'g'ri KO'RINADI, javob esa noto'g'ri.
// Xatodan keyingi qatorlar undan to'g'ri kelib chiqadi -- shuning uchun
// BIRINCHI noto'g'ri qatorni izlash kerak.
// QARSHI MISOLNI O'QUVCHI hisoblaydi, dastur emas (§8.2).
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  // E'lon sarlavhani TAKRORLAMAYDI: sarlavha nima izlanayotganini ataydi,
  // e'lon esa ekranda NIMA turganini va nima qilish kerakligini aytadi.
  // «Aynan birinchisini» degan shart OVOZDA qoladi -- ovoz kengroq.
  // Metodist 2026-08-14: «ne ochen ponyatno chto nado sdelat». E'lon endi
  // uchta narsani aytadi: ekranda NIMA turibdi, nega u xato, va nima
  // qilish kerak. Ilgari birinchi ikkitasi faqat ovozda edi.
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  // Matn QISQARTIRILDI (to'liq prognoz 2026-08-14: uzun variant o'zbekcha
  // va ruschada uch satrga cho'zilib, ekranni 41px oshirib yuborardi).
  // Izlash BELGISI saqlanib qoldi: qator yuqoridagisidan kelib chiqadimi.
  ask: L(
    "Yuqoridagi qatordan kelib chiqmagan qatorni toping.",
    'Найди строку, которая не следует из строки над ней.',
    'Find the line that does not follow from the line above it.',
  ),
  rows: [
    { id: 'r1', text: '36 : 4 + 2 · 5 − 3' },
    { id: 'r2', text: '36 : 6 · 5 − 3' },
    { id: 'r3', text: '6 · 5 − 3' },
    { id: 'r4', text: '30 − 3' },
    { id: 'r5', text: '27' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich yozuv, unda hali hech narsa hisoblanmagan.", 'Это исходная запись, в ней ещё ничего не посчитано.', 'That is the original expression, nothing has been worked out in it yet.'),
    r3: L("Bu qatorga oltilik yuqoridan tushgan, boshlang'ich yozuvda esa u yo'q. Demak farq undan oldin paydo bo'lgan.", 'В эту строку шестёрка пришла сверху, а в исходной записи её нет. Значит расхождение появилось раньше.', 'The six in this line came from above, and it is not in the original. So the divergence happened earlier.'),
    r4: L("Bu yerda ko'paytirish to'g'ri bajarilgan. Yuqoriroqqa qarang.", 'Здесь умножение сделано верно. Смотри выше.', 'The multiplication here is correct. Look higher up.'),
    r5: L("Bu yerda ayirish to'g'ri. Xato bundan ancha oldin.", 'Здесь вычитание верное. Ошибка старше.', 'The subtraction here is fine. The mistake is older than this.'),
  },
  tags: { r1: 'Z1', r3: 'Z1', r4: 'Z1', r5: 'Z1' },
  // `proof` satri OLIB TASHLANDI (2026-08-13). Ikki sabab, va balandlik
  // ulardan ikkinchisi:
  //   1. §8.2: xatoni SON bilan o'quvchi isbotlaydi. Dastur xulosani undan
  //      OLDIN aytib qo'ysa, topshiriq kuchsizlanadi -- qarshi misolni
  //      qo'yishdan oldin javob allaqachon aytilgan bo'ladi.
  //   2. Yechim qatorlari, isbot satri va qarshi misol yig'ilishi birga
  //      noutbukda 17px oshib ketardi (to'liq o'lchov, 4050 o'lchov).
  // Xulosa hech qayerdan yo'qolmadi: uni `proofFill.checkNote` o'quvchi
  // sonni qo'ygandan KEYIN aytadi, ovoz esa topshiriqni o'z vaqtida beradi.
  // Qarshi misolni O'QUVCHI qo'yadi: to'g'ri qiymatni o'zi hisoblaydi.
  proofFill: {
    template: ['9 + ', { slot: 0 }, ' − 3 = ', { slot: 1 }],
    parts: [{ id: 'p10', label: '10' }, { id: 'p16', label: '16' }, { id: 'p19', label: '19' }, { id: 'p27', label: '27' }],
    answer: ['p10', 'p16'],
    // Ilgari bu yerda «To'g'ri qiymatni hisoblang» deb turardi va o'quvchi
    // 9 bilan 3 qayerdan kelganini tushunmasdi. Endi aytiladi: bu -- O'SHA
    // birinchi qator, faqat to'g'ri hisoblangani.
    // Matn QISQARTIRILDI (o'lchov 2026-08-14): uzun variant inglizchada
    // uchinchi satrga o'tib, ekranni 23px oshirib yuborardi. Ma'no o'sha:
    // bu O'SHA birinchi qator, faqat to'g'ri hisoblangani.
    prompt: L(
      "Birinchi qator to'g'ri hisoblanganda: 36 : 4 bu 9. Endi 2 ni 5 ga ko'paytiring va qiymatni yig'ing.",
      'Первая строка, посчитанная верно: 36 : 4 это 9. Умножь 2 на 5 и собери значение.',
      'The first line worked out correctly: 36 : 4 is 9. Multiply 2 by 5 and build the value.',
    ),
    checkNote: L('16 va 27. Sonlar farq qildi, demak ikkinchi qator birinchisiga teng emas', '16 и 27. Числа разошлись, значит вторая строка не равна первой', '16 and 27. The numbers differ, so the second line is not equal to the first'),
    wrongs: [
      { key: '*', tag: 'Z1', hint: L("Ikki ko'paytiruv besh nechaga teng ekanini hisoblang, o'ttiz olti bo'lish to'rt esa to'qqiz.", 'Посчитай, чему равно два умножить на пять, а тридцать шесть разделить на четыре это девять.', 'Work out two times five; and thirty-six divided by four is nine.') },
    ],
  },
  audio: [
    A('mount', "O'quvchi yechdi va xato qildi. Har bir qator to'g'ri ko'rinadi, javob esa noto'g'ri.", 'Ученик решил и ошибся. Каждая строка выглядит верной, а ответ неверен.', 'A student solved it and got it wrong. Every line looks right, yet the answer is wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping. Har qanday noto'g'ri qatorni emas, aynan birinchisini.", 'Найди строку, где ошибка появилась впервые. Не любую неверную, а именно первую.', 'Find the line where the mistake first appears. Not any wrong line, the first one.'),
    A('proof', "Topdingiz. Endi isbotlang. To'g'ri qiymatni o'zingiz hisoblang va yigirma yettining yoniga qo'ying.", 'Нашёл. Теперь докажи. Посчитай верное значение сам и поставь его рядом с двадцатью семью.', 'You found it. Now prove it. Work out the correct value yourself and put it next to twenty-seven.'),
    A('done', "O'n olti va yigirma yetti. Sonlar farq qildi, demak ikkinchi qator birinchisiga teng emas.", 'Шестнадцать и двадцать семь. Числа разошлись, значит вторая строка не равна первой.', 'Sixteen and twenty-seven. The numbers differ, so the second line is not equal to the first.'),
  ],
}

function Screen12({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S12.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [found, setFound] = useState(false)
  const [done, setDone] = useState(false)
  // Qatorlar yig'ilishi 0,5 s davom etadi (`min-height` va `padding` bo'yicha
  // o'tish). Isbot bloki DARROV chiqsa, o'sha yarim soniyada ekran 31px oshib
  // ketadi va yuqorisi KESILADI -- ko'z bilan bu «miltillash», o'lchov esa uni
  // faqat animatsiya paytida ushlaydi (grade7-noscroll, 2026-08-14).
  // Shuning uchun isbot qatorlar yig'ilib BO'LGACH keladi. Bu metodik jihatdan
  // ham to'g'ri tartib: avval «topdim», keyin «isbotlayman».
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
      {/* Ekranda IKKI topshiriq ketma-ket keladi, lekin BIR VAQTDA bittasi
          turadi: qator topilgach `AuditRows` e'loni yo'qoladi va uning
          o'rniga isbot topshirig'i chiqadi (§6.1). 2026-08-13 da bu satr
          olib tashlangan edi -- o'shanda ikkalasi BIRGA turardi va
          noutbukda 84px oshib ketardi. Endi ular ALMASHADI, qo'shilmaydi.
          Tor shakl: qatorlar va isbot yig'ilishi ustiga kartochka sig'maydi. */}
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
// EKRAN 13. KO'CHIRISH. TESKARI masala: butun dars yozuv qiymatni berardi,
// endi qiymat yozuvni beradi. Ikki bosqich, o'sha asbob.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE OTHER WAY ROUND'),
  title: L("Qiymat berilgan, yozuvni yig'ing", 'Значение дано, собери запись', 'The value is given, build the expression'),
  rounds: [
    {
      nums: [12, 8, 2],
      ops: ['−', ':'],
      answer: { from: 0, to: 1 },
      prompt: L('Qavsni shunday qo\'yingki, qiymat 2 bo\'lsin', 'Поставь скобку так, чтобы значение стало равно 2', 'Place a bracket so the value becomes 2'),
      baseNote: L('Qavssiz bu yozuvning qiymati 8', 'Без скобок значение этой записи равно 8', 'With no brackets the value is 8'),
      hints: {
        '1-2': L("Qavs hech narsani o'zgartirmadi, bo'lish baribir birinchi edi. Ayirishni qavs ichiga oling.", 'Скобка ничего не изменила: деление и так было первым. Возьми в скобку вычитание.', 'The bracket changed nothing, the division was first anyway. Put the subtraction inside it.'),
        '*': L("Ikki olish uchun avval ayirish bajarilishi kerak. Qaysi ikkita son qavs ichiga tushishini o'ylang.", 'Чтобы получить двойку, первым должно идти вычитание. Подумай, какие два числа попадут в скобку.', 'To get a two the subtraction has to go first. Think which two numbers end up inside the bracket.'),
      },
      tag: 'Z4',
    },
    {
      nums: [20, 4, 3],
      ops: ['−', '·'],
      answer: { from: 0, to: 1 },
      prompt: L('Qavsni shunday qo\'yingki, qiymat 48 bo\'lsin', 'Поставь скобку так, чтобы значение стало равно 48', 'Place a bracket so the value becomes 48'),
      baseNote: L('Qavssiz bu yozuvning qiymati 8', 'Без скобок значение этой записи равно 8', 'With no brackets the value is 8'),
      hints: {
        '1-2': L("Qavs hech narsani o'zgartirmadi: ko'paytirish baribir birinchi edi.", 'Скобка ничего не изменила: умножение и так было первым.', 'The bracket changed nothing: the multiplication was first anyway.'),
        '*': L("Qirq sakkiz bu o'n oltini uchga ko'paytirgani. O'n oltini qayerdan olamiz?", 'Сорок восемь это шестнадцать умножить на три. Откуда взять шестнадцать?', 'Forty-eight is sixteen times three. Where does the sixteen come from?'),
      },
      tag: 'Z4',
    },
    // Uchinchi bosqich -- DARSLIKNING 4-QOIDASI: qavs ichida qavs.
    // Ichki qavs ALLAQACHON turibdi va u BITTA songa aylangan: katakda
    // `(4 + 2)` ko'rinadi, hisobda esa 6 ishlatiladi (`labels`). O'quvchi
    // TASHQI qavsni qo'yadi -- ya'ni «avval eng ichkarisi» qoidasini o'qib
    // emas, QO'L bilan boshdan kechiradi.
    {
      nums: [6, 3, 6, 4],
      labels: ['(4 + 2)', '3', '6', '4'],
      ops: ['·', '−', ':'],
      answer: { from: 0, to: 2 },
      prompt: L('Tashqi qavsni shunday qo\'yingki, qiymat 3 bo\'lsin', 'Поставь внешнюю скобку так, чтобы значение стало равно 3', 'Place the outer bracket so the value becomes 3'),
      baseNote: L('Ichki qavs allaqachon ishladi va 6 ga aylandi. Tashqi qavssiz qiymat 16,5', 'Внутренняя скобка уже сработала и стала числом 6. Без внешней скобки значение равно 16,5', 'The inner bracket has already acted and became 6. With no outer bracket the value is 16,5'),
      hints: {
        '0-1': L("Qavs hech narsani o'zgartirmadi: ko'paytirish baribir birinchi edi. Bo'lishdan oldin nima bo'lishi kerakligini o'ylang.", 'Скобка ничего не изменила: умножение и так было первым. Подумай, что должно закончиться раньше деления.', 'The bracket changed nothing: the multiplication was first anyway. Think what has to finish before the division.'),
        '2-3': L("Bu qavs ham hech narsani o'zgartirmadi: bo'lish baribir oxirida edi. Bo'linadigan son butun boshli yozuv bo'lishi kerak.", 'Эта скобка тоже ничего не изменила: деление и так было последним. Делиться должна вся запись целиком.', 'That bracket changed nothing either: the division was last anyway. The whole record has to be divided.'),
        '*': L("Uchga bo'lish uchun bo'linuvchi o'n ikki bo'lishi kerak. O'n ikki qayerdan chiqadi?", 'Чтобы получилось три, делимое должно быть двенадцать. Откуда взять двенадцать?', 'To get three, the dividend has to be twelve. Where does the twelve come from?'),
      },
      tag: 'Z4',
    },
  ],
  audio: [
    A('mount', "Butun dars davomida yozuv qiymatni berardi. Endi teskarisi.", 'Весь урок запись задавала значение. Теперь наоборот.', 'All lesson the expression gave the value. Now it is the other way round.'),
    A('mount', "Qiymat ikki bo'lishi kerak. Qavsni shunday qo'yingki, shu son chiqsin.", 'Значение должно быть равно двум. Поставь скобку так, чтобы получилось именно оно.', 'The value has to be two. Place the bracket so that this is what comes out.'),
    A('ok1', "Bo'ldi. Bitta qavs sakkizni ikkiga aylantirdi. Endi qiymat qirq sakkiz bo'lishi kerak.", 'Готово. Одна скобка превратила восемь в двойку. Теперь значение должно быть сорок восемь.', 'Done. A single bracket turned eight into two. Now the value has to be forty-eight.'),
    A('ok2', "O'sha sonlar, qavs esa qiymatni sakkizdan qirq sakkizga ko'chirdi.", 'Те же числа, а скобка перевела значение с восьми на сорок восемь.', 'The same numbers, and the bracket moved the value from eight to forty-eight.'),
    A('ok2', "Oxirgisi. Bu yerda qavs ichida qavs bor. Ichkarisi allaqachon ishlagan va bitta songa aylangan. Endi tashqarisini qo'ying.", 'Последнее. Здесь внутри скобки стоит ещё одна. Внутренняя уже сработала и стала одним числом. Теперь поставь внешнюю.', 'The last one. Here one bracket sits inside another. The inner one has already acted and become a single number. Now place the outer one.'),
    A('ok3', "Eng ichkaridagi birinchi ishlaydi. Qavs nechta bo'lsa ham shunday.", 'Самая внутренняя срабатывает первой. Так при любом числе вложенных скобок.', 'The innermost one acts first. That holds for any number of nested brackets.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S13.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S13} screen={screen} audio={audio} solved={done} {...rest}>
      <BracketGap
        audio={audio}
        rounds={S13.rounds}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'transfer' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 14. BLITS. Darsdagi YAGONA baholanadigan ekran (§8.5).
// To'rt savol bitta panelda, javob berilgani qatorga yig'iladi.
// Ball FAQAT birinchi urinish uchun.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  // Uchta yozuv bitta savolga javob beradi -- 2 va 6-ekrandagi o'sha savol.
  // To'rtinchi band o'zi SO'Z bilan savol, unga `question: null` qo'yilgan.
  question: ASK_VALUE,
  items: [
    {
      prompt: '10 + 2 · 3 =',
      ok: L("Ikkinchi bosqich birinchidan oldin ketdi.", 'Вторая ступень пошла раньше первой.', 'The second stage went before the first.'),
      items: [
        { id: 'a', label: '16', correct: true },
        { id: 'b', label: '36', tag: 'Z1', hint: L("Bu o'n va ikkini qo'shib, keyin uchga ko'paytirgani. Ko'paytirish qaysi ikkita songa tegishli ekaniga qarang.", 'Это десять и два сложены, а потом умножено на три. Посмотри, к каким двум числам относится умножение.', 'That is ten and two added and then multiplied by three. Look at which two numbers the multiplication belongs to.') },
        { id: 'c', label: '15', hint: L("Bu yerda hammasi qo'shilgan. Uchlik oldida ko'paytirish belgisi turibdi.", 'Здесь всё сложено. Перед тройкой стоит знак умножения.', 'Here everything was added. The sign before the three is multiplication.') },
        { id: 'd', label: '60', hint: L("Bu yerda hammasi ko'paytirilgan. Ikkilik oldida esa qo'shish belgisi bor.", 'Здесь всё перемножено. А перед двойкой стоит знак сложения.', 'Here everything was multiplied. But the sign before the two is addition.') },
      ],
    },
    {
      prompt: '36 : 6 · 3 =',
      ok: L("Ikkalasi bitta bosqichda, shuning uchun chapdan o'ngga.", 'Обе на одной ступени, поэтому слева направо.', 'Both on one stage, so left to right.'),
      items: [
        { id: 'a', label: '18', correct: true },
        { id: 'b', label: '2', tag: 'Z2', hint: L("Ko'paytirish bo'lishdan oldin ketdi. Ikkalasi bitta bosqichda, demak yozilish tartibi hal qiladi.", 'Умножение пошло раньше деления. Обе на одной ступени, значит решает порядок записи.', 'The multiplication went before the division. Both are on one stage, so the written order decides.') },
        { id: 'c', label: '6', hint: L("Bu faqat bo'lish. Uchga ko'paytirish bajarilmay qoldi.", 'Это только деление. Умножение на три осталось несделанным.', 'That is the division only. The multiplication by three was never done.') },
        { id: 'd', label: '108', hint: L("Bu yerda o'ttiz oltini uchga ko'paytirgansiz. Oltilik oldida bo'lish belgisi turibdi.", 'Здесь тридцать шесть умножено на три. А перед шестёркой стоит знак деления.', 'Here thirty-six was multiplied by three. But the sign before the six is division.') },
      ],
    },
    {
      prompt: '(7 + 3) · 2 =',
      ok: L("Qavs qo'shishni birinchi qildi.", 'Скобка сделала сложение первым.', 'The bracket made the addition first.'),
      items: [
        { id: 'a', label: '20', correct: true },
        { id: 'b', label: '13', tag: 'Z4', hint: L("Bu qavssiz yozuvning qiymati. Qavs qo'shishni birinchi qiladi.", 'Это значение записи без скобок. Скобка делает сложение первым.', 'That is the value with the brackets removed. The bracket makes the addition first.') },
        { id: 'c', label: '12', hint: L("Bu yerda hammasi qo'shilgan. Qavs oldida esa ko'paytirish belgisi turibdi.", 'Здесь всё сложено. А перед скобкой стоит знак умножения.', 'Here everything was added. But the sign before the bracket is multiplication.') },
        { id: 'd', label: '42', hint: L("Bu yerda qavs ichida boshqa amal bajarilgan. Yetti va uch orasidagi belgiga qarang.", 'Здесь внутри скобки выполнено не то действие. Посмотри, какой знак стоит между семёркой и тройкой.', 'Here the wrong operation was done inside the bracket. Look at the sign between the seven and the three.') },
      ],
    },
    {
      wrap: true,
      question: null,
      ok: L("Qiymat -- bu SON, yozuvning o'zi emas.", 'Значение — это ЧИСЛО, а не сама запись.', 'A value is a NUMBER, not the expression itself.'),
      prompt: L("Sonli ifodaning qiymati nima?", 'Что такое значение числового выражения?', 'What is the value of a numerical expression?'),
      items: [
        { id: 'a', label: L("amallar natijasida hosil bo'lgan son", 'число, полученное в результате действий', 'the number obtained by the operations'), correct: true },
        { id: 'b', label: L("yozuvning o'zi", 'сама запись', 'the expression itself'), tag: 'Z6', hint: L("Bu ifodaning o'zi. Qiymat esa son, uni hisoblab olamiz.", 'Это само выражение. А значение это число, его мы получаем счётом.', 'That is the expression itself. The value is a number, and we get it by working the expression out.') },
        { id: 'c', label: L('amal belgisi', 'знак действия', 'the operation sign'), tag: 'Z6', hint: L("Belgi nima qilishni ko'rsatadi, lekin son emas. Qiymat har doim son bo'ladi.", 'Знак показывает, что делать, но числом не является. Значение всегда число.', 'A sign tells you what to do but is not a number. A value is always a number.') },
        { id: 'd', label: L('hisoblash tartibi', 'порядок счёта', 'the order of counting'), tag: 'Z6', hint: L("Tartib qiymatni topishga yordam beradi, lekin qiymatning o'zi emas.", 'Порядок помогает найти значение, но самим значением не является.', 'The order helps you find the value but is not the value itself.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Bu darsdagi yagona baholanadigan ekran, shuning uchun shoshilmang.", 'Блиц, четыре вопроса. Это единственный оцениваемый экран урока, поэтому не спеши.', 'Quick round, four questions. This is the only graded screen of the lesson, so take your time.'),
    A('1', "Ikkinchisi: bo'lish va ko'paytirish birga.", 'Второй: деление и умножение вместе.', 'Second: division and multiplication together.'),
    A('2', "Uchinchisi: qavsli yozuv.", 'Третий: запись со скобкой.', 'Third: an expression with a bracket.'),
    A('3', "Oxirgisi so'z bilan.", 'Последний вопрос словами.', 'The last one is in words.'),
  ],
}

function Screen14({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S14.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  // Natijalar REF da: `onSolved` taymer ichidan chaqiriladi va state ning
  // eski qiymatini ko'rib qolishi mumkin.
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
// Chapda: taxmin va natija, tayyorlik darajasi SO'Z bilan, keyingi darsga
// ko'prik. O'ngda: «endi nima qila olaman» va shpargalka. Maydon YASHIL.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Bitta yozuv — bitta qiymat', 'Одна запись — одно значение', 'One expression, one value'),
  // Maydon rangi OLIB TASHLANDI (metodist qarori 2026-08-14), 1-ekrandagi
  // kabi: fon butun dars bo'yicha bir xil.
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  resultLabel: L('Qanday chiqdi', 'Как оказалось', 'How it turned out'),
  predictMap: {
    order: L("mashinalar har xil tartibda o'qiydi", 'машины читают в разном порядке', 'the machines read in a different order'),
    broken: L('mashinalardan biri buzuq', 'одна из машин сломана', 'one of the machines is broken'),
    two: L('ikkita to\'g\'ri qiymat bor', 'есть два верных значения', 'there are two correct values'),
    brackets: L('qavs yetishmaydi', 'не хватает скобок', 'brackets are missing'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  result: L(
    "Ikkala kalkulyator ham o'z qoidasi bo'yicha ishlagan. Matematika esa bitta qoidani tanlagan.",
    'Оба калькулятора работали по своему правилу. Математика выбрала одно.',
    'Both calculators followed their own rule. Mathematics picked one.',
  ),
  // 6-sinf 1-darsining yakuni naqshi (metodist qarori 2026-08-13):
  // yakun -- BALL hisoboti emas, MAVZU svodi. Uch teng kartochka «Asosiysi»,
  // so'ng bitta misolning ikki o'qilishi, so'ng «nimaga tayanadi / keyingi».
  // YAKUNDAGI INTERAKTIV (metodist qarori 2026-08-14). Dars mashina bilan
  // bahsdan boshlangan edi; endi o'quvchi mashinani O'RGATADI: oddiy
  // kalkulyatorni bosadi, u qoida bo'yicha qayta hisoblaydi va sakkiz
  // yigirmaga aylanadi, «teng emas» esa «teng» bo'ladi.
  // Bu YANGI SAVOL emas va baholanmaydi (§4.2): o'quvchi hech narsa
  // tanlamaydi, u allaqachon bilgan qoidani mashinaga qo'llaydi.
  fix: {
    value: '20',
    sign: '=',
    // Sahna ichidagi yozuv QISQA bo'lishi kerak: u SVG da, o'ralmaydi.
    hint: L(
      "Oddiy kalkulyatorni bosing",
      'Нажми на простой калькулятор',
      'Tap the basic calculator',
    ),
    doneHint: L(
      "Ikkalasi bitta qiymatni beradi",
      'Обе машины дают одно значение',
      'Both machines give one value',
    ),
  },
  // Bosilgach aytiladigan gap. Ovoz navbatida turmaydi: u o'quvchining
  // HARAKATIGA javob, shuning uchun `say` bilan darrov o'qiladi.
  fixSay: L(
    "Oddiy kalkulyator endi qoida bo'yicha hisoblaydi. Sakkiz yigirmaga aylandi, va ikkala mashina bitta qiymatni beradi. Siz uni o'rgatdingiz.",
    'Простой калькулятор теперь считает по правилу. Восемь стало двадцатью, и обе машины дают одно значение. Ты его научил.',
    'The basic calculator now counts by the rule. The eight became twenty, and both machines give one value. You taught it.',
  ),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  banner: L('Matematika · Amallar tartibi', 'Математика · Порядок действий', 'Mathematics · Order of operations'),
  mainLabel: L('Asosiysi', 'Главное', 'The main thing'),
  briefs: [
    L('Qavs → III → II → I bosqich', 'Скобки → III → II → I ступень', 'Brackets → III → II → I stage'),
    L("Bitta bosqich ichida — chapdan o'ngga", 'Внутри одной ступени — слева направо', 'Inside one stage — left to right'),
    L('Bitta yozuvning qiymati bitta', 'У одной записи одно значение', 'One expression has one value'),
  ],
  twoLabel: L("Ikki yo'l — bitta qiymat", 'Два пути — одно значение', 'Two paths — one value'),
  twoA: '18 − 6 : 3 + 4  →  20',
  twoB: '18 − (6 : 3) + 4  →  20',
  twoNote: L(
    "Qoida va qavs bir xil ishni qildi. Shuning uchun qavsni har doim ham yozish shart emas.",
    'Правило и скобка сделали одну и ту же работу. Поэтому скобку писать не обязательно.',
    'The rule and the bracket did the same job. That is why the bracket need not always be written.',
  ),
  refsLabel: L('Nimaga tayanadi', 'Опирается на', 'Builds on'),
  refs: L("6-sinfdagi amallar tartibi", 'порядок действий из 6 класса', 'the order of operations from grade 6'),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L("yozuvda son o'rniga harf", 'буква вместо числа в записи', 'a letter in place of a number'),
  levelBadge: L('Tayyorlik', 'Готовность', 'Readiness'),
  levels: {
    closed: L('Bu turdagi masalalar yopildi', 'Этот тип задач закрыт', 'This type of task is done'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs another look'),
    back: L("Sakkizinchi ekrandagi qoidaga qayting", 'Вернись к правилу на экране восемь', 'Go back to the rule on screen eight'),
    none: L('Blits o\'tilmadi', 'Блиц не пройден', 'The quick round was not taken'),
  },
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  ringLabel: L('Blits', 'Блиц', 'Quick round'),
  ringSub: L('birinchi urinish', 'первая попытка', 'first try'),
  canTitle: L('Endi men', 'Теперь я', 'Now I can'),
  can: [
    L('Sonli ifodaning qiymatini topa olaman', 'Я нахожу значение числового выражения', 'I can find the value of a numerical expression'),
    L('Qaysi amal birinchi ekanini bosqich bo\'yicha ayta olaman', 'Я определяю по ступени, какое действие первое', 'I can tell which operation goes first by its stage'),
    L('Bitta bosqich ichida chapdan o\'ngga hisoblayman', 'Внутри одной ступени я считаю слева направо', 'Inside one stage I count from left to right'),
    L('Qavs yozuvni qanday o\'zgartirishini ko\'rsata olaman', 'Я показываю, как скобка меняет запись', 'I can show how a bracket changes the expression'),
  ],
  fact: {
    badge: L('Bilasizmi', 'Знаешь ли ты', 'Did you know'),
    // Uchinchi gap OLIB TASHLANDI: u 1-ekrandagi xukni takrorlardi, va aynan
    // shu takror telefonda yakunni 37px oshirib yuborardi (o'lchov 2026-08-13).
    text: L(
      "Amallar tartibi maktab shartliligi emas. Dasturlash tillarida amallar ustunligi alohida jadvalda yozib qo'yilgan, aks holda bitta kod qatori har xil mashinada har xil son berardi.",
      'Порядок действий не школьная условность. В языках программирования старшинство операций записано отдельной таблицей, иначе одна строка кода давала бы на разных машинах разные числа.',
      'The order of operations is not a school convention. Programming languages write operator precedence down in a table of its own, otherwise one line of code would give different numbers on different machines.',
    ),
  },
  motive: L(
    "Keyingi darsda yozuvda son o'rniga harf paydo bo'ladi, tartib esa o'sha-o'sha qoladi.",
    'В следующем уроке в записи вместо числа появится буква, а порядок останется тем же.',
    'In the next lesson a letter appears in place of a number, and the order stays the same.',
  ),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz va mana qanday chiqdi.", 'Вернёмся к началу. Вот что ты предполагал и вот как оказалось.', 'Back to the start. This is what you predicted and this is how it turned out.'),
    A('mount', "Ikkala kalkulyator ham o'z qoidasi bo'yicha ishlagan. Matematika esa bitta qoidani tanlagan, va endi siz uni bilasiz.", 'Оба калькулятора работали по своему правилу. Математика выбрала одно, и теперь ты его знаешь.', 'Both calculators followed their own rule. Mathematics picked one, and now you know it.'),
    A('mount', "Keyingi darsda yozuvda harf paydo bo'ladi. Tartib esa o'zgarmaydi.", 'В следующем уроке в записи появится буква. Порядок при этом не изменится.', 'In the next lesson a letter appears in the expression. The order does not change.'),
  ],
}

function Screen15({ screen, answers, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S15.audio, lang), [lang])
  const audio = useAudio(segments)

  const blitz = (answers || []).find((a) => a && a.role === 'blitz')
  const level = blitz ? blitz.level : 'none'
  const total = blitz ? blitz.total : S14.items.length
  const firstTry = blitz ? blitz.firstTry : 0
  const tags = uniqueTags(answers)

  const hook = (answers || []).find((a) => a && a.role === 'hook')
  const predict = hook && hook.picked ? S15.predictMap[hook.picked] : null

  // Teglar ro'yxati CHEKLANADI. Oltita teg yig'ilsa satr uch qatorga
  // cho'ziladi va yakun telefonda budjetdan oshib ketadi (o'lchov 2026-08-13).
  // Ikkitasi ATALADI -- eng muhimi shu, qolgani soni bilan aytiladi.
  const named = tags.slice(0, 2).map((code) => t(TAGS[code])).join(', ')
  const more = tags.length - 2
  // «+1» degan quyruq tushunarsiz edi -- son nimani anglatishi yozilmagandi.
  // Endi u SO'Z bilan aytiladi (metodist 2026-08-14).
  const gapLine = tags.length
    ? t(S15.gapPrefix) + ': ' + named + (more > 0 ? ', ' + t(S15.moreGaps) + ' ' + more : '')
    : t(S15.noGap)


  return (
    <Frame meta={S15} screen={screen} audio={audio} solved {...rest}>
      {/* Metodist qarori 2026-08-13: yakun IKKI USTUN emas, TIK bo'ladi.
          O'qish tartibi yuqoridan pastga: taxmin, natija, tayyorlik, endi men,
          fakt, keyingi darsga ko'prik. Prognoz va natija QATOR bo'lib turadi,
          to'rtta blok emas. */}
      {/* 6-sinf 1-darsining yakuni naqshi (metodist qarori 2026-08-13):
          banner, XUKNI YOPADIGAN sahna, so'ng UCH TENG kartochka setkada.
          Dars boshlangan zal bilan TUGAYDI: 1-ekrandagi ikki mashina yana
          chiqadi, lekin endi savol javobini olgan. */}
      {/* Sarlavha bannerdan OLIB TASHLANDI: u ekranning tepasida ALLAQACHON
          turibdi (`Title`), bannerda esa ikkinchi marta yozilardi. Bo'shagan
          joy sahnaga berildi -- yakun endi interaktiv, mashina bosiladi.
          Gliflar bosqich ranglarida: yakun ham darsning o'sha tili bilan
          gapiradi. */}
      {/* BANNER OLIB TASHLANDI (metodist qarori 2026-08-14): u faqat
          mavzu nomini takrorlardi, mavzu esa sarlavhada turibdi. */}

      <div className="g7-sumscene">
        <HookMachines
          tokens={S1.tokens}
          left={S1.left}
          right={S1.right}
          fix={{ ...S15.fix, onFix: () => audio.say(t(S15.fixSay)) }}
        />
      </div>

      {/* «ASOSIYSI» KARTOCHKASI OLIB TASHLANDI (metodist qarori
          2026-08-14). Yakunda bitta kartochka qoldi. */}
      {/* SQVOZ LENTA (metodist tasdiqladi 2026-08-14). Dars davomida
          o'quvchi qo'li bilan bajargan qadamlar birma-bir chiqadi -- butun
          yo'l bitta qatorda. Joy bannerni va «Asosiysi» kartochkasini
          olib tashlagach bo'shadi. */}
      <HistoryTape items={S5.chips} label={S15.tapeLabel} />

      <div className="g7-sumcards g7-sumcards-one">
        <div className="g7-sumcard">
          <p className="g7-sumcard-h">{t(S15.twoLabel)}</p>
          {/* Yozuvlar bosqich rangida -- darsdagi kabi. Ikki satr yonma-yon
              turgani uchun rang farqni ko'rsatadi: qavs bir xil ishni qildi. */}
          <span className="g7-sumtwo-line"><Fx>{t(S15.twoA)}</Fx></span>
          <span className="g7-sumtwo-line"><Fx>{t(S15.twoB)}</Fx></span>
          {/* `twoNote` OLIB TASHLANDI (metodist 2026-08-14: «tekstov mnogo»).
              Ikki satr YONMA-YON turibdi va ikkalasida ham 20 -- gap shu
              bilan aytilgan, uni yana bir marta yozish takror edi.
              Prognoz va keyingi mavzu ALOHIDA qatorlarda: bitta qatorga
              siqilganda ular bir gapga qo'shilib o'qilardi va ma'nosi
              yo'qolardi (metodist 2026-08-14: «o'rtada gap tushunarsiz»).
              Ikki ustunga o'tgach ular uchun joy bor. */}
          <p className="g7-sumcard-note">
            <b>{t(S15.predictLabel)}:</b> {predict ? t(predict) : t(S15.noAnswer)}
          </p>
          <p className="g7-sumcard-note">
            <b>{t(S15.nextLabel)}:</b> {t(S15.nextTopic)}
          </p>
          {/* §8.5: kamchilik SO'Z bilan ataladi. Metodist 2026-08-14 da
              alohida turgan satrni olib tashladi, shuning uchun u shu
              kartochkaning ichiga ko'chdi -- talab bajarilgan, ekranda
              esa ortiqcha element yo'q. */}
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

export default function Grade7Dars01({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  aiGradingEndpoint,
  onFinished,
}) {
  const initial = langProp === 'uz' || langProp === 'ru' || langProp === 'en' ? langProp : 'uz'
  const [lang, setLang] = useState(initial)
  // TIL SAYTDAN KELADI va dars ochilgandan KEYIN ham o'zgarishi mumkin:
  // yuqori o'ngdagi UZ / RU / EN tugmalari saytniki. `useState` esa
  // boshlang'ich qiymatni BIR MARTA oladi -- shuning uchun almashtirgich
  // manzilni o'zgartirardi, dars esa eski tilda qolib ketardi
  // (metodist surati 2026-08-14: RU bosilgan, ekran o'zbekcha).
  // Uch tilning MATNI ham, OVOZI ham joyida edi -- ularga yo'l yopiq edi.
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
    // BAHO faqat blitsdan (§8.5). Qolgan ekranlar teg yozadi, ball emas.
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
    else console.log('[Grade7 Dars01] onFinished', payload)
  }, [answers, lang, onFinished])

  const Current = SCREENS[screen]

  return (
    <LangProvider value={lang}>
      <LangSetProvider value={setLang}>
        <style>{STYLES}</style>
        {/* Sahifa foni. Metodist qarori 2026-08-14: xuk va yakunda ohang
            YO'Q, ular ham sut rangli fonda turadi. `is-rule` qoldi -- 8-ekran
            darsning tayanchi va u ataylab ajralib turadi; metodist uni
            atamadi, ya'ni o'zgartirish uchun alohida qaror kerak. */}
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
