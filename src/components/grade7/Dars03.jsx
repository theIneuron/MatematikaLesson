// ============================================================================
// 7-sinf, Dars 3. ARIFMETIK AMALLARNING XOSSALARI.
// (Свойства арифметических действий)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// Namuna: Dars01.jsx (sinf ETALONI) va Dars02.jsx.
// Bu faylda FAQAT MA'LUMOT bor: mexanika `./tools.jsx` da, yadro `./core.jsx` da.
//
// DARSNING G'OYASI. Uchinchi marta bir xil manzara, va har safar boshqacha
// tugaydi:
//   1-dars: bitta yozuv, ikki tartib -> IKKI XIL son. Bu XATO edi.
//   2-dars: bitta yozuv, har xil sonlar -> bu O'ZGARUVCHINING xossasi.
//   3-dars: bitta yozuv, ikki tartib -> BITTA son, lekin bir yo'l qisqa.
// Uchinchisi birinchisini ham tushuntiradi: u yerda bosqichlar HAR XIL edi,
// bu yerda esa amal BITTA, shuning uchun tartib qiymatni o'zgartirmaydi.
//
// METODIST QARORLARI 2026-08-15 (§3.4, §3.5): darslikka havola YO'Q,
// ishchi so'z «o'zgaruvchi».
//
// DARSLIK NUQSONI. 23-betdagi 4-misol ikkala nashrda ham
// «4 · 25 · 37 = 370» deb chop etilgan, to'g'risi 3700. Bu tarjima emas,
// HISOB xatosi. Darsga to'g'ri son kiradi, kitob esa tilga olinmaydi.
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
  BracketGap,
  CollapseTrack,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  StairsReveal,
  StepOrder,
  SubstituteRows,
  TwoRoutes,
  Transform,
} from './tools.jsx'

const LESSON_ID = 'alg_7_03'
const LESSON_TITLE = L('Arifmetik amallarning xossalari', 'Свойства арифметических действий', 'Properties of arithmetic operations')
const LESSON_NO = L('3-dars', 'Урок 3', 'Lesson 3')
const TOTAL = 15

const BLOCK = { label: L('B1-blok', 'Блок Б1', 'Block B1'), from: 1, to: 6, current: 3 }

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
// TEGLAR (§8.5). Baho emas: qaysi yanglish tushuncha ishga tushgani.
// ============================================================
const TAGS = {
  Z1: L("o'rin almashtirish qiymatni o'zgartiradi", 'перестановка меняет значение', 'swapping changes the value'),
  Z2: L("ayirish va bo'lish ham almashtiriladi", 'вычитание и деление тоже переставляют', 'subtraction and division get swapped too'),
  Z3: L("ko'paytuvchi faqat birinchi qo'shiluvchiga bordi", 'множитель дошёл только до первого слагаемого', 'the factor reached only the first term'),
  Z4: L('ayirishda qavs boshqacha ishlaydi', 'скобка при вычитании работает иначе', 'a bracket after a minus works differently'),
  Z5: L('xossa faqat shu sonlar uchun deb tushunildi', 'свойство сочли верным только для этих чисел', 'the property was taken to hold only for these numbers'),
  Z6: L("teskari yo'l ko'rinmadi", 'обратный ход не увиден', 'the reverse move was not seen'),
  Z7: L('xossa tenglama bilan chalkashdi', 'свойство спутано с уравнением', 'a property mistaken for an equation'),
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

const ASK_VALUE = L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is the value?')

// Qayta yozish amallari -- 1 va 2-darsdagi ro'yxat. Yangi amal YO'Q: bu
// darsda o'quvchi son qo'ymaydi, u JUFTNI TANLAYDI.
const ACTIONS = [
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
// EKRAN 1. XUK. Bitta yozuv, ikki yo'l, BITTA son. Baholanmaydi.
// Yo'laklar javobdan OLDIN turadi va bu javobni oshkor qilmaydi: savol
// «nechaga teng» emas, «nega bir yo'l qisqa» degan savol.
// ============================================================
const S1 = {
  eyebrow: L('ARIFMETIK AMALLARNING XOSSALARI', 'СВОЙСТВА АРИФМЕТИЧЕСКИХ ДЕЙСТВИЙ', 'PROPERTIES OF ARITHMETIC OPERATIONS'),
  noBack: true,
  noNotes: true,
  title: L("Bitta son, ikki yo'l", 'Одно число, два пути', 'One number, two paths'),
  // XUK SAHNASI (metodist talabi 2026-08-15). Naqsh 1-darsникi: bitta manba,
  // undan ikki yo'l, ikkita tablo, ular orasida halqa. Sodda: ortiqcha narsa
  // yo'q, sahna faqat MA'NONI beradi.
  //
  // Ma'no shu: yo'llar ORALIQ sonda ajraladi (100 va 925), yakuniy sonda esa
  // qo'shiladi -- shuning uchun halqada «teng». Nega birinchisi osonroq
  // ekanini sahna AYTMAYDI, buni o'quvchi o'zi aytadi.
  gate: {
    source: { kind: 'plain', tokens: ['4', '·', '25', '·', '37'] },
    // Tabloda yo'lning IKKINCHI qadami turadi: birinchi qadamdan keyin
    // birida 100, boshqasida 925 hosil bo'lgan. Indikatorda esa yakuniy son,
    // va u IKKALASIDA BIR XIL -- shuning uchun halqada «teng».
    rows: [
      { tokens: ['100', '·', '37'], value: '3700' },
      { tokens: ['925', '·', '4'], value: '3700' },
    ],
  },
  nums: [4, 25, 37],
  ops: ['·', '·'],
  // Yorliq yo'lni RAQAMLAMAYDI, balki qaysi juftdan boshlanganini ATAYDI.
  // «Birinchi va ikkinchi yo'l» deganda yakuniy holatda ikkala qator BIR XIL
  // ko'rinardi -- 3700 va 3700, -- va savol ekranda tayanchsiz qolardi
  // (surat 2026-08-15). Endi farq yakunda ham ko'rinadi, javob esa baribir
  // aytilmaydi: 4 karra 25 yuzni berishini o'quvchi O'ZI ko'radi.
  shortLabel: L("avval 4 · 25", 'сначала 4 · 25', 'first 4 · 25'),
  longLabel: L("avval 25 · 37", 'сначала 25 · 37', 'first 25 · 37'),
  probe: {
    // «Qisqaroq» degani NOTO'G'RI edi: ikkala yo'lda ham ikkita qadam.
    // Farq uzunlikda emas, OG'ZAKI hisoblashning yengilligida (surat
    // 2026-08-15).
    question: L("Ikkalasi ham 3700 ni berdi. Nega birinchi yo'lni og'zaki hisoblash osonroq?", 'Оба получили 3700. Почему первый путь легче посчитать в уме?', 'Both got 3700. Why is the first path easier to do in your head?'),
    items: [
      {
        id: 'round',
        label: L("Ko'paytuvchilar shunday almashtirilganki, yumaloq son chiqqan", 'Множители переставили так, что получилось круглое число', 'The factors were swapped so that a round number came out'),
        hint: L(
          "Taxminingiz qabul qilindi. Uni shu yozuvning o'zida qo'lingiz bilan tekshiramiz.",
          'Прогноз принят. Проверим его руками на этой же записи.',
          'Your prediction is taken. We will check it by hand on this very expression.',
        ),
      },
      {
        id: 'luck',
        label: L('U xato qilgan, shunchaki mos tushib qolgan', 'Он ошибся, просто совпало', 'They made a mistake, it just happened to match'),
        hint: L(
          "Ikkala yo'lakni o'zingiz hisoblang. Ikkalasi ham 3700 beradi. Tasodif ikki marta ketma-ket bo'lmaydi.",
          'Посчитай обе дорожки сам. Обе дают 3700. Случайность два раза подряд не бывает.',
          'Work out both tracks yourself. Both give 3700. Chance does not strike twice in a row.',
        ),
      },
      {
        id: 'onlythese',
        label: L("Bunday qilish faqat shu sonlar bilan mumkin", 'Так можно только с этими числами', 'That only works with these numbers'),
        hint: L(
          "Xuddi shu yo'lni 2 karra 17 karra 5 yozuvida sinab ko'ring. U yerda ham yumaloq son topiladi.",
          'Попробуй тот же ход в записи 2 · 17 · 5. Круглое число найдётся и там.',
          'Try the same move on 2 · 17 · 5. A round number turns up there too.',
        ),
      },
      {
        id: 'changes',
        label: L("Ko'paytuvchilar tartibi qiymatni o'zgartiradi", 'Порядок множителей меняет значение', 'The order of the factors changes the value'),
        hint: L(
          "O'ngdagi ikki songa qarang. Ular bir xil, tartib esa har xil edi.",
          'Посмотри на два числа справа. Они одинаковые, а порядок был разный.',
          'Look at the two numbers on the right. They are the same, and the orders were different.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bugungi mavzu arifmetik amallarning xossalari. Ikki o'quvchi bitta yozuvni hisobladi.", 'Сегодня тема урока свойства арифметических действий. Два ученика посчитали одну и ту же запись.', 'Today the topic is the properties of arithmetic operations. Two students worked out one and the same expression.'),
    A('mount', "To'rt karra yigirma besh karra o'ttiz yetti. Birinchisi to'rtni yigirma beshga ko'paytirdi va yuz oldi, keyin yuzni o'ttiz yettiga.", 'Четыре умножить на двадцать пять умножить на тридцать семь. Первый умножил четыре на двадцать пять, получил сто, а потом сто на тридцать семь.', 'Four times twenty five times thirty seven. The first multiplied four by twenty five, got a hundred, then a hundred by thirty seven.'),
    A('mount', "Ikkinchisi yigirma beshni o'ttiz yettiga ko'paytirdi. Bu og'ir hisob, va u to'qqiz yuz yigirma beshni oldi, keyin uni to'rtga ko'paytirdi.", 'Второй умножил двадцать пять на тридцать семь. Это тяжёлый счёт, он получил девятьсот двадцать пять, а потом умножил на четыре.', 'The second multiplied twenty five by thirty seven. That is heavy work, they got nine hundred twenty five, then multiplied by four.'),
    A('mount', "Ikkalasida ham uch ming yetti yuz chiqdi. Yozuv bitta, son bitta, yo'l esa har xil.", 'У обоих вышло три тысячи семьсот. Запись одна, число одно, а путь разный.', 'Both ended at three thousand seven hundred. One expression, one number, different paths.'),
    A('mount', "Sizningcha nima bo'lyapti. Javobni tanlang, bu taxmin, uning uchun baho yo'q.", 'Как думаешь, что здесь происходит. Выбери ответ, это прогноз, оценки за него нет.', 'What do you think is going on. Pick an answer, this is a prediction, it is not graded.'),
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
      {/* Sahna javobni OSHKOR QILMAYDI: savol «nechaga teng» emas, «nega bir
          yo'l osonroq». Yakuniy son ikkalasida bir xil, va halqada «teng». */}
      <TwoRoutes source={S1.gate.source} rows={S1.gate.rows} sign="=" />
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
// mashq -- qulay tartib topish, bu yerda esa tartib umuman tanlanmaydi.
// KVOTA EKRANI (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: ASK_VALUE,
  items: [
    {
      prompt: '0,25 · 7 · 4',
      ok: L("Chekka ikkitasi birni beradi, keyin yetti qoladi.", 'Крайние дают единицу, и остаётся семь.', 'The outer two make one, and seven is left.'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '1', hint: L("1 bu faqat chekka ikkitasining ko'paytmasi. Yozuvda uchta ko'paytuvchi bor.", '1 это произведение только крайних. В записи три множителя.', '1 is the product of the outer two only. The expression has three factors.') },
        { id: 'c', label: '1,75', hint: L("Bu chorak karra yetti. To'rt hisobga kirmagan.", 'Это четверть умножить на семь. Четвёрка не учтена.', 'That is a quarter times seven. The four was not counted.') },
        { id: 'd', label: '700', hint: L("Bu vergul yo'qolganda chiqadi. Birinchi son birdan kichik, demak natija ham kichrayadi.", 'Так выходит, если потерять запятую. Первое число меньше единицы, значит и результат уменьшится.', 'That comes from losing the comma. The first number is less than one, so the result shrinks.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("5 − 1,5 − 2 va 5 − (1,5 − 2) qiymatlari tengmi?", 'Равны ли значения 5 − 1,5 − 2 и 5 − (1,5 − 2)?', 'Are the values of 5 − 1,5 − 2 and 5 − (1,5 − 2) equal?'),
      ok: L("Yo'q. Qavs ichida manfiy son chiqadi, undan ayirish esa qo'shishga aylanadi.", 'Нет. В скобке выходит отрицательное число, а вычесть его значит прибавить.', 'No. The bracket gives a negative number, and taking it away means adding.'),
      items: [
        { id: 'a', correct: true, label: L("Yo'q, 1,5 va 5,5", 'Нет, 1,5 и 5,5', 'No, 1,5 and 5,5') },
        { id: 'b', tag: 'Z2', label: L("Ha, qavs hech nimani o'zgartirmaydi", 'Да, скобка ничего не меняет', 'Yes, the bracket changes nothing'), hint: L("Ikkala yozuvni hisoblang. Birinchisi beshdan kichik, ikkinchisi esa beshdan katta.", 'Посчитай обе записи. Первая меньше пяти, а вторая больше пяти.', 'Work out both. The first is less than five, the second more than five.') },
        { id: 'c', tag: 'Z2', label: L("Ha, ikkalasi ham 1,5", 'Да, оба равны 1,5', 'Yes, both are 1,5'), hint: L("Qavs ichida bir butun besh o'ndandan ikki ayiriladi va manfiy son chiqadi. Manfiy sonni ayirish esa qo'shishdir.", 'В скобке из полутора вычитают два и выходит отрицательное число. А вычесть отрицательное значит прибавить.', 'Inside the bracket two is taken from one and a half, giving a negative. Taking away a negative means adding.') },
        { id: 'd', tag: 'Z5', label: L("Yo'q, lekin faqat shu sonlar uchun", 'Нет, но только для этих чисел', 'No, but only for these numbers'), hint: L("Boshqa uchlikni oling, masalan 6, 2 va 3. Yana ikki xil son chiqadi.", 'Возьми другую тройку, например 6, 2 и 3. Снова выйдут два разных числа.', 'Take another triple, say 6, 2 and 3. Again two different numbers come out.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("9 : 3 : 0,5 va 9 : (3 : 0,5) qiymatlari tengmi?", 'Равны ли значения 9 : 3 : 0,5 и 9 : (3 : 0,5)?', 'Are the values of 9 : 3 : 0,5 and 9 : (3 : 0,5) equal?'),
      ok: L("Yo'q. Yarimga bo'lish sonni ikki barobar oshiradi, va qavs buni qayerga qo'yishni hal qiladi.", 'Нет. Деление на половину увеличивает число вдвое, и скобка решает, где это случится.', 'No. Dividing by a half doubles the number, and the bracket decides where that happens.'),
      items: [
        { id: 'a', correct: true, label: L("Yo'q, 6 va 1,5", 'Нет, 6 и 1,5', 'No, 6 and 1,5') },
        { id: 'b', tag: 'Z2', label: L("Ha, qavs bo'lishga ta'sir qilmaydi", 'Да, скобка на деление не влияет', 'Yes, the bracket does not affect division'), hint: L("Ikkala yozuvni hisoblang. Birinchisi to'qqizdan kichik emas, ikkinchisi esa ancha kichik.", 'Посчитай обе записи. Первая не меньше девяти, а вторая заметно меньше.', 'Work out both. The first is not less than nine, the second is much smaller.') },
        { id: 'c', tag: 'Z2', label: L("Ha, ikkalasi ham uch", 'Да, оба равны трём', 'Yes, both are three'), hint: L("Yarimga bo'lish kamaytirmaydi, oshiradi. Uchni yarimga bo'lsak olti chiqadi.", 'Деление на половину не уменьшает, а увеличивает. Три разделить на половину будет шесть.', 'Dividing by a half does not shrink but grows. Three divided by a half is six.') },
        { id: 'd', tag: 'Z2', label: L("Yo'q, ikkinchisining qiymati yo'q", 'Нет, у второй значения нет', 'No, the second has no value'), hint: L("Qavs ichidan olti chiqadi, olti esa noldan farqli. Qiymat yo'q bo'ladigan yagona holat -- bo'luvchi nol bo'lganda.", 'В скобке выходит шесть, а шесть не нуль. Значения нет только тогда, когда делитель нуль.', 'The bracket gives six, and six is not zero. A value is missing only when the divisor is zero.') },
      ],
    },
  ],
  audio: [
    A('mount', "Yangi mavzudan oldin uchta savolga javob beramiz. Bu yerda harf ham yo'q, baho ham yo'q.", 'Прежде чем идти в новую тему, ответим на три вопроса. Здесь нет ни буквы, ни оценки.', 'Before the new topic let us answer three questions. No letters here and nothing is graded.'),
    A('1', "Ikkinchisi. Ayirishga qarang.", 'Второе. Посмотри на вычитание.', 'Second. Look at the subtraction.'),
    A('2', "Uchinchisi. Endi bo'lishga.", 'Третье. Теперь на деление.', 'Third. Now the division.'),
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
// EKRAN 3. TUSHUNTIRISH 1. O'quvchi tartibni O'ZI qo'yadi.
// 1-darsda ikki tartib IKKI XIL son berardi. Bu yerda -- BITTA. Farq shu
// yerda tushuntiriladi: u yerda bosqichlar har xil edi, bu yerda amal bitta.
// ============================================================
const S3 = {
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L("Tartibni o'zingiz qo'ying", 'Расставь порядок сам', 'Set the order yourself'),
  ask: L(
    "Amal belgilarini qaysi tartibda hisoblasangiz, shu tartibda bosing.",
    'Нажми на знаки действий в том порядке, в каком будешь считать.',
    'Tap the operation signs in the order you will work them out.',
  ),
  nums: [4, 25, 37],
  ops: ['·', '·'],
  ruleOrder: [0, 1],
  yoursLabel: L("sizning tartibingiz bo'yicha", 'по твоему порядку', 'by your order'),
  ruleLabel: L("chapdan o'ngga", 'слева направо', 'left to right'),
  note: L(
    "Sonlar bir xil. Bitta amal ichida tartib qiymatni o'zgartirmaydi.",
    'Числа одинаковые. Внутри одного действия порядок значение не меняет.',
    'The numbers match. Inside one operation the order does not change the value.',
  ),
  sameNote: L(
    "Sonlar bir xil chiqdi. Birinchi darsda ular farq qilardi, chunki u yerda bosqichlar har xil edi. Bu yerda amal bitta, shuning uchun tartib qiymatni o'zgartirmaydi. U faqat mehnatni o'zgartiradi.",
    'Числа совпали. В первом уроке они расходились, потому что там были разные ступени. Здесь действие одно, и порядок значение не меняет. Он меняет только труд.',
    'The numbers matched. In lesson one they diverged because the stages differed. Here there is one operation, so the order does not change the value. It only changes the effort.',
  ),
  audio: [
    A('mount', "Yozuv o'sha. Endi tartibni o'zingiz qo'ying va ikkala songa qarang.", 'Запись та же. Теперь поставь порядок сам и посмотри на оба числа.', 'The same expression. Now set the order yourself and look at both numbers.'),
    A('done', "Sonlar bir xil. Birinchi darsda ular farq qilardi, chunki u yerda ko'paytirish va qo'shish aralash edi.", 'Числа совпали. В первом уроке они расходились, потому что там были перемешаны умножение и сложение.', 'The numbers matched. In lesson one they diverged because multiplication and addition were mixed.'),
    A('done', "Bu yerda hamma amal ko'paytirish. Shuning uchun tartib qiymatni emas, faqat mehnatni o'zgartiradi.", 'Здесь все действия умножение. Поэтому порядок меняет не значение, а только труд.', 'Here every operation is multiplication. So the order changes not the value but only the effort.'),
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
// EKRAN 4. TUSHUNTIRISH 2. FARQLASH: nimani almashtirib BO'LMAYDI.
// Ikki raund, har birida ikkita yozuv YONMA-YON turadi, ular orasiga
// o'quvchi belgi qo'yadi. Ikki bo'lakli tanlov -- §4.2 dagi guvohlik
// istisnosi: ikkala yozuv ham allaqachon ekranda.
// ============================================================
const S4 = {
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Nimani almashtirib bo'lmaydi", 'Что переставлять нельзя', 'What must not be swapped'),
  rounds: [
    {
      // UZLUKSIZ probel: oddiy probellar HTML da yig'ilib ketadi va
      // katak yozuvlarga YOPISHIB qoladi -- ekranda «10 − 4?4 − 10» bo'lib
      // ko'rinadi, ya'ni ikki yozuv o'rniga bitta (surat 2026-08-15).
      template: ['10 − 4   ', { slot: 0 }, '   4 − 10'],
      parts: [{ id: 'eq', label: '=' }, { id: 'ne', label: '≠' }],
      answer: ['ne'],
      prompt: L(
        "Ikki yozuv orasiga belgi qo'ying.",
        'Поставь знак между двумя записями.',
        'Put the sign between the two expressions.',
      ),
      checkNote: L('6 va минус 6. Ayirishda sonlar almashmaydi', '6 и минус 6. В вычитании числа не меняются местами', '6 and minus 6. In subtraction the numbers do not swap'),
      wrongs: [
        { key: 'eq', tag: 'Z2', hint: L("Ikkala yozuvni hisoblang: 6 va minus 6. Bu ikki xil son, demak belgi boshqa.", 'Посчитай обе записи: 6 и минус 6. Это два разных числа, значит знак другой.', 'Work out both: 6 and minus 6. Two different numbers, so the sign is the other one.') },
      ],
    },
    {
      template: ['12 : 4   ', { slot: 0 }, '   4 : 12'],
      parts: [{ id: 'eq', label: '=' }, { id: 'ne', label: '≠' }],
      answer: ['ne'],
      prompt: L(
        "Endi bo'lish uchun.",
        'Теперь для деления.',
        'Now for the division.',
      ),
      checkNote: L("3 va birdan kichik son. Bo'lishda ham almashmaydi", '3 и число меньше единицы. В делении тоже не меняются', '3 and a number less than one. Division does not swap either'),
      wrongs: [
        { key: 'eq', tag: 'Z2', hint: L("12 ni 4 ga bo'lsak 3. 4 ni 12 ga bo'lsak birdan kichik son. Bular teng emas.", '12 разделить на 4 это 3. А 4 разделить на 12 меньше единицы. Это не равные числа.', '12 divided by 4 is 3. And 4 divided by 12 is less than one. Not equal.') },
      ],
    },
  ],
  reward: {
    title: L("Ikkitasi almashadi, ikkitasi yo'q", 'Два переставляются, два нет', 'Two swap, two do not'),
    text: L(
      "Qo'shish va ko'paytirishda sonlarni almashtirsa bo'ladi. Ayirish va bo'lishda esa birinchi son bilan ikkinchisining ishi har xil.",
      'В сложении и умножении числа переставлять можно. В вычитании и делении у первого и второго числа разная работа.',
      'In addition and multiplication the numbers may be swapped. In subtraction and division the first and the second number do different jobs.',
    ),
  },
  audio: [
    A('mount', "Har qanday amalni almashtirib bo'lmaydi. Ikki juftni tekshiramiz.", 'Не всякое действие можно переставить. Проверим две пары.', 'Not every operation may be swapped. Let us check two pairs.'),
    A('mount', "Ikki yozuv orasiga teng yoki teng emas belgisini qo'ying.", 'Поставь между двумя записями знак равно или знак не равно.', 'Put an equals or a not-equals sign between the two expressions.'),
    A('r1', "Endi bo'lish uchun xuddi shunday.", 'Теперь то же самое для деления.', 'Now the same for the division.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S4.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [rows, setRows] = useState([])
  const done = idx >= S4.rounds.length
  const r = S4.rounds[idx]
  return (
    <Frame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
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
            setRows((prev) => prev.concat(idx === 0 ? '10 − 4  ≠  4 − 10' : '12 : 4  ≠  4 : 12'))
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
// EKRAN 5. TUSHUNTIRISH 3. GURUHLASH. O'quvchi qavsni O'ZI qo'yadi va
// yumaloq sonni O'ZI topadi. Qiymat o'zgarmaydi -- o'zgarayotgani MEHNAT.
// ============================================================
const S5 = {
  eyebrow: L('GURUHLASH', 'ГРУППИРОВКА', 'GROUPING'),
  title: L('Qavs mehnatni yengillashtiradi', 'Скобка облегчает труд', 'A bracket makes the work lighter'),
  rounds: [
    {
      nums: [37, 45, 55],
      ops: ['+', '+'],
      answer: { from: 1, to: 2 },
      prompt: L(
        "Qavsni shunday qo'yingki, uning ichida 100 chiqsin.",
        'Поставь скобку так, чтобы внутри неё получилось 100.',
        'Place a bracket so that 100 comes out inside it.',
      ),
      baseNote: L("Qavssiz ham qiymat 137, qavs bilan ham 137. O'zgarayotgani mehnat", 'И без скобки значение 137, и со скобкой 137. Меняется труд', 'With or without the bracket the value is 137. What changes is the effort'),
      hints: {
        '0-1': L("Qavs ichida 82 chiqdi, yumaloq son emas. Qaysi ikki son roppa-rosa yuz beradi?", 'Внутри скобки вышло 82, круглого числа нет. Какие два числа дают ровно сто?', 'Inside the bracket you got 82, not a round number. Which two numbers give exactly a hundred?'),
        '*': L("Sonlarga qarang va yuz beradigan juftni toping. U yozuvning oxirida turibdi.", 'Посмотри на числа и найди пару, которая даёт сто. Она стоит в конце записи.', 'Look at the numbers and find the pair that gives a hundred. It sits at the end.'),
      },
      tag: 'Z1',
    },
  ],
  reward: {
    title: L("Qavs qiymatni emas, yo'lni tanlaydi", 'Скобка выбирает не значение, а путь', 'A bracket picks the path, not the value'),
    text: L(
      "Qo'shishda qavsni istalgan juftga qo'yish mumkin, qiymat o'zgarmaydi. Shuning uchun uni eng qulay juftga qo'yamiz.",
      'В сложении скобку можно поставить к любой паре, значение не изменится. Поэтому её ставят к самой удобной.',
      'In addition a bracket may go around any pair, the value stays. So it goes around the handiest one.',
    ),
  },
  audio: [
    A('mount', "Uchta qo'shiluvchi. Qavsni qayerga qo'ysangiz ham qiymat o'zgarmaydi, lekin hisob yengillashishi mumkin.", 'Три слагаемых. Куда бы ты ни поставил скобку, значение не изменится, а считать может стать легче.', 'Three terms. Wherever you put the bracket the value stays, but the counting can get easier.'),
    A('mount', "Yumaloq son beradigan juftni toping.", 'Найди пару, которая даёт круглое число.', 'Find the pair that gives a round number.'),
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
      <BracketGap
        audio={audio}
        rounds={S5.rounds}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4. O'ZINGIZ: TAQSIMOT XOSSASI.
// Ko'paytuvchi qavs ichidagi HAR BIR qo'shiluvchiga boradi.
// Javob bo'laklardan yig'iladi, ortiqchalari yanglish tushunchalardan.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Ko'paytuvchi hammasiga boradi", 'Множитель идёт ко всем', 'The factor goes to every term'),
  // Manba yozuv TOPSHIRIQDA, shablonda emas: `.g7-expr` da `white-space:
  // nowrap`, va to'liq yozuv 390 da 8px chetga chiqib KESILARDI (o'lchov
  // 2026-08-15). Topshiriq esa proza, u o'raladi (§6.2).
  template: ['7 · 111 + 7 · ', { slot: 0 }, '  =  ', { slot: 1 }],
  parts: [
    { id: 'p8', label: '8' },
    { id: 'p833', label: '833' },
    { id: 'p785', label: '785' },
    { id: 'p119', label: '119' },
  ],
  answer: ['p8', 'p833'],
  prompt: L(
    "7 · (111 + 8). Ikkinchi yo'lni yig'ing va qiymatni toping.",
    '7 · (111 + 8). Собери второй путь и найди значение.',
    '7 · (111 + 8). Build the second path and find the value.',
  ),
  checkNote: L('777 va 56, jami 833. Qavs ichidan hisoblaganda ham 833', '777 и 56, вместе 833. Если считать через скобку, тоже 833', '777 and 56 make 833. Counting through the bracket also gives 833'),
  wrongs: [
    { key: 'p8|p785', tag: 'Z3', hint: L("785 bu 777 qo'shuv 8. Yettilik faqat birinchi qo'shiluvchiga borgan, ikkinchisi esa uni kutib qolgan.", '785 это 777 плюс 8. Семёрка дошла только до первого слагаемого, второе её не дождалось.', '785 is 777 plus 8. The seven reached only the first term, the second never got it.') },
    { key: 'p8|p119', tag: 'Z3', hint: L("119 bu qavs ichidagi yig'indi. Uni yettiga ko'paytirish qolib ketgan.", '119 это сумма в скобке. Умножить её на семь осталось несделанным.', '119 is the sum inside the bracket. Multiplying it by seven was never done.') },
    { key: '*', tag: 'Z3', hint: L("Birinchi katakka qavs ichidagi ikkinchi son tushadi, ikkinchisiga butun yozuvning qiymati.", 'В первую клетку идёт второе число из скобки, во вторую значение всей записи.', 'The first box takes the second number from the bracket, the second the value of the whole expression.') },
  ],
  audio: [
    A('mount', "Qavs oldida ko'paytuvchi turibdi. Uni ikki xil hisoblash mumkin.", 'Перед скобкой стоит множитель. Посчитать можно двумя способами.', 'A factor stands before the bracket. It can be worked out two ways.'),
    A('mount', "Birinchi yo'l qavs ichidan boshlanadi. Ikkinchi yo'lda ko'paytuvchi har bir qo'shiluvchiga boradi. Ikkinchisini o'zingiz yig'ing.", 'Первый путь начинается со скобки. Во втором множитель идёт к каждому слагаемому. Собери второй сам.', 'The first path starts inside the bracket. In the second the factor goes to each term. Build the second yourself.'),
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
// EKRAN 7. TUSHUNTIRISH 5. CHEGARAVIY HOLAT va YILNING ASOSIY XATOSI:
// 3(a + 5) ni 3a + 5 deb yozish. Avval savol, isbot KEYIN (§8.1).
// KVOTA EKRANI.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Qavs ichida o'zgaruvchi bo'lsa", 'Когда в скобке переменная', 'When the bracket holds a variable'),
  numbers: [2],
  rows: [
    { id: 'full', expr: '3(a + 5)', sub: () => '3 · (2 + 5)', val: () => 21 },
    { id: 'half', expr: '3a + 5', sub: () => '3 · 2 + 5', val: () => 11 },
  ],
  probe: {
    question: L("a teng 2 bo'lganda 3(a + 5) nechaga teng?", 'Чему равно 3(a + 5) при a = 2?', 'What is 3(a + 5) when a = 2?'),
    items: [
      { id: 'a', label: '21', correct: true },
      { id: 'b', label: '11', tag: 'Z3', hint: L("11 bu 3 karra 2 qo'shuv 5. Uchlik beshlikka yetib bormagan.", '11 это 3 умножить на 2 плюс 5. Тройка не дошла до пятёрки.', '11 is 3 times 2 plus 5. The three never reached the five.') },
      { id: 'c', label: '15', tag: 'Z3', hint: L("15 bu 3 karra 5. Qavs ichidagi a yo'qolib qolgan.", '15 это 3 умножить на 5. Переменная в скобке потерялась.', '15 is 3 times 5. The variable inside the bracket got lost.') },
      { id: 'd', label: '26', tag: 'Z3', hint: L("26 bu 21 qo'shuv 5. Beshlik ikki marta ishlatilgan.", '26 это 21 плюс 5. Пятёрка использована дважды.', '26 is 21 plus 5. The five was used twice.') },
    ],
  },
  okText: L(
    "Ko'paytuvchi qavs ichidagi har bir qo'shiluvchiga boradi, birinchisiga ham, ikkinchisiga ham.",
    'Множитель идёт к каждому слагаемому в скобке, и к первому, и ко второму.',
    'The factor goes to every term in the bracket, to the first and to the second.',
  ),
  audio: [
    A('mount', "Endi qavs ichida o'zgaruvchi turibdi. Avval javob bering, keyin son bilan tekshiramiz.", 'Теперь в скобке стоит переменная. Сначала ответь, потом проверим числом.', 'Now the bracket holds a variable. Answer first, then we check with a number.'),
    A('row1', "Ikkita yozuvni yonma-yon qo'yamiz va ikkalasiga ham ikkini qo'yamiz.", 'Поставим две записи рядом и подставим в обе двойку.', 'Let us put the two expressions side by side and substitute two into both.'),
    A('row2', "Yigirma bir va o'n bir. Sonlar farq qildi, demak bu ikki xil yozuv. Ko'paytuvchini yarim yo'lda qoldirib bo'lmaydi.", 'Двадцать один и одиннадцать. Числа разошлись, значит это разные записи. Множитель нельзя оставить на полпути.', 'Twenty one and eleven. The numbers differ, so these are different expressions. A factor cannot be left halfway.'),
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
// EKRAN 8. QOIDA. Maydon TO'Q SARIQ -- darsdagi yagona rangli ekran.
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("qo'shiluvchilar va ko'paytuvchilar o'rnini almashtirish mumkin", 'слагаемые и множители можно менять местами', 'terms and factors may be swapped') },
    { id: 'f2', label: L("qavsni istalgan juftga qo'yish mumkin", 'скобку можно поставить к любой паре', 'a bracket may go around any pair') },
    { id: 'f3', label: L("qavs oldidagi ko'paytuvchi har bir qo'shiluvchiga boradi", 'множитель перед скобкой идёт к каждому слагаемому', 'the factor before a bracket goes to every term') },
    { id: 'f4', label: L("ayirish va bo'lishda o'rin almashmaydi", 'в вычитании и делении местами не меняются', 'in subtraction and division nothing swaps') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Birinchi bo'lib eng sodda narsa keladi: nimani umuman almashtirsa bo'ladi.",
    'Порядок нарушен. Первым идёт самое простое: что вообще можно переставлять.',
    'The order is off. The simplest thing comes first: what may be swapped at all.',
  ),
  lawChips: [
    { label: '+ ·', tone: 's1' },
    { label: '( )', tone: 'par' },
    { label: 'a( )', tone: 's2' },
    { label: '− :', tone: 'off' },
  ],
  lawSweep: L(
    "almashtirish, guruhlash, taqsimlash",
    'переставить, сгруппировать, раздать',
    'swap, group, distribute',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "O'rin almashtirish xossasi va guruhlash xossasi: a qo'shuv b teng b qo'shuv a, qavs a qo'shuv b qavs qo'shuv c teng a qo'shuv qavs b qo'shuv c.",
        'Перестановочное свойство и свойство группировки: a + b = b + a, (a + b) + c = a + (b + c).',
        'The commutative and the grouping property: a + b = b + a, (a + b) + c = a + (b + c).',
      ),
      L(
        "Qo'shish va ayirishga nisbatan taqsimot xossasi: a qavs b qo'shuv c teng ab qo'shuv ac.",
        'Распределительное свойство умножения относительно сложения и вычитания: a(b + c) = ab + ac.',
        'The distributive property of multiplication over addition and subtraction: a(b + c) = ab + ac.',
      ),
    ],
  },
  hookCap: L("Qiymat o'zgarmaydi, mehnat o'zgaradi", 'Значение не меняется, меняется труд', 'The value stays, the effort changes'),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("almashtirish -- faqat + va ·", 'переставлять — только + и ·', 'swapping is for + and · only'),
    L("qavs -- istalgan juftga", 'скобка — к любой паре', 'a bracket goes to any pair'),
    L("ko'paytuvchi -- hammasiga", 'множитель — ко всем', 'the factor goes to all'),
  ],
  audio: [
    A('mount', "Hamma narsani ko'rdik. Endi qoidani so'z bilan yig'amiz.", 'Всё, что нужно, мы увидели. Теперь соберём правило словами.', 'We have seen everything we need. Now let us put the rule into words.'),
    A('mount', "Bo'laklarni to'g'ri tartibda joylashtiring.", 'Разложи фрагменты в верном порядке.', 'Put the pieces in the right order.'),
    A('ok', "To'g'ri. Uchta xossa bor, va to'rtinchi qator ularning chegarasini aytadi.", 'Верно. Свойств три, а четвёртая строка называет их границу.', 'Correct. There are three properties, and the fourth line names their limit.'),
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
// EKRAN 9. MASHQ 1. Uchtasi bir turdagi: umumiy ko'paytuvchini KO'RISH.
// Javob tanlanmaydi, yig'iladi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Uchalasida ham bitta ish qilindi: yumaloq son yasaldi va og'ir hisob yo'qoldi.",
      'Во всех трёх сделана одна работа: получено круглое число, и тяжёлый счёт исчез.',
      'The same job in all three: a round number was made and the heavy counting vanished.',
    ),
  },
  rounds: [
    {
      template: ['28 · ', { slot: 0 }, '  =  ', { slot: 1 }],
      parts: [{ id: 'p100', label: '100' }, { id: 'p2800', label: '2800' }, { id: 'p1260', label: '1260' }, { id: 'p145', label: '145' }],
      answer: ['p100', 'p2800'],
      prompt: L("28 · 45 + 28 · 55. Umumiy ko'paytuvchini tashqariga oling va hisoblang.", '28 · 45 + 28 · 55. Вынеси общий множитель и посчитай.', '28 · 45 + 28 · 55. Take the common factor out and work it out.'),
      checkNote: L('45 va 55 jami 100, keyin 28 karra 100', '45 и 55 вместе дают 100, потом 28 умножить на 100', '45 and 55 make 100, then 28 times 100'),
      wrongs: [
        { key: 'p100|p1260', tag: 'Z6', hint: L("1260 bu 28 karra 45, ya'ni faqat birinchi qism. Ikkinchisi ham qo'shilishi kerak.", '1260 это 28 умножить на 45, то есть только первая часть. Вторую тоже надо прибавить.', '1260 is 28 times 45, only the first part. The second has to be added too.') },
        { key: '*', tag: 'Z6', hint: L("Ikkala qismda ham 28 bor. Uni tashqariga oling, ichida esa 45 qo'shuv 55 qoladi.", 'В обеих частях есть 28. Вынеси его, а внутри останется 45 плюс 55.', 'Both parts have a 28. Take it out and 45 plus 55 stays inside.') },
      ],
    },
    {
      template: ['72 · ', { slot: 0 }, '  =  ', { slot: 1 }],
      parts: [{ id: 'q100', label: '100' }, { id: 'q7200', label: '7200' }, { id: 'q178', label: '178' }, { id: 'q10008', label: '10008' }],
      answer: ['q100', 'q7200'],
      prompt: L("72 · 139 − 72 · 39. Endi ayirish bilan. Umumiy ko'paytuvchini oling.", '72 · 139 − 72 · 39. Теперь с вычитанием. Вынеси общий множитель.', '72 · 139 − 72 · 39. Now with a subtraction. Take the common factor out.'),
      checkNote: L('139 ayirish 39 teng 100, keyin 72 karra 100', '139 минус 39 равно 100, потом 72 умножить на 100', '139 minus 39 is 100, then 72 times 100'),
      wrongs: [
        { key: 'q178|q7200', tag: 'Z2', hint: L("178 bu 139 qo'shuv 39. Ikki qism orasida ayirish turibdi.", '178 это 139 плюс 39. Между двумя частями стоит вычитание.', '178 is 139 plus 39. Between the two parts there is a subtraction.') },
        { key: '*', tag: 'Z6', hint: L("Qavs ichida 139 dan 39 ni ayirish qoladi.", 'Внутри скобки останется 139 минус 39.', 'Inside the bracket 139 minus 39 remains.') },
      ],
    },
    {
      template: [{ slot: 0 }, ' · 17  =  ', { slot: 1 }],
      parts: [{ id: 'w100', label: '100' }, { id: 'w1700', label: '1700' }, { id: 'w425', label: '425' }, { id: 'w29', label: '29' }],
      answer: ['w100', 'w1700'],
      prompt: L("25 · 17 · 4. Qulay juftni toping va hisoblang.", '25 · 17 · 4. Найди удобную пару и посчитай.', '25 · 17 · 4. Find the handy pair and work it out.'),
      checkNote: L('25 karra 4 teng 100, keyin 100 karra 17', '25 умножить на 4 равно 100, потом 100 умножить на 17', '25 times 4 is 100, then 100 times 17'),
      wrongs: [
        { key: 'w425|w1700', tag: 'Z1', hint: L("425 bu 25 karra 17. Bu ham mumkin, lekin yumaloq son bermaydi. Boshqa juftga qarang.", '425 это 25 умножить на 17. Так тоже можно, но круглого числа не выйдет. Посмотри на другую пару.', '425 is 25 times 17. That is allowed too, but no round number. Look at the other pair.') },
        { key: '*', tag: 'Z1', hint: L("Yumaloq son beradigan juft yozuvning ikki chekkasida turibdi.", 'Пара, дающая круглое число, стоит по краям записи.', 'The pair that gives a round number sits at the two ends.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Endi uni uchta yozuvda sinab ko'ramiz.", 'Правило готово. Проверим его на трёх записях.', 'The rule is ready. Let us try it on three expressions.'),
    A('r1', "Ikkinchisi. Bu safar ayirish bilan.", 'Второе. На этот раз с вычитанием.', 'Second. This time with a subtraction.'),
    A('r2', "Uchinchisi. Bu yerda qavs yo'q, faqat ko'paytirish.", 'Третье. Здесь скобок нет, только умножение.', 'Third. No brackets here, just multiplication.'),
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
  const LABELS = ['28 · 45 + 28 · 55  →  2800', '72 · 139 − 72 · 39  →  7200', '25 · 17 · 4  →  1700']
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan. Qulay juft yozuvning CHEKKASIDA
// emas, O'RTASIDA: o'quvchi chapdan o'ngga odatini sindirishi kerak.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L("Qulay juft chetda emas", 'Удобная пара не с краю', 'The handy pair is not at the edge'),
  start: '712 · 25 · 4',
  steps: [
    {
      part: '25 · 4', action: 'stage2', to: '712 · 100', parts: ['712 · 25', '25 · 4'],
      needPart: L('Avval juftni tanlang.', 'Сначала выбери пару.', 'Pick a pair first.'),
      wrongs: [
        { action: 'stage2', part: '712 · 25', tag: 'Z1', hint: L("Bu ham mumkin, ko'paytirish o'rin almashtiradi. Lekin 712 ni 25 ga og'zaki ko'paytirib ko'ring. Yumaloq son beradigan juft boshqa joyda.", 'Так тоже можно, умножение переставляется. Но попробуй умножить 712 на 25 в уме. Пара, дающая круглое число, в другом месте.', 'That is allowed too, multiplication swaps. But try 712 times 25 in your head. The pair that gives a round number is elsewhere.') },
        { action: 'stage1', hint: L("Yozuvda faqat ko'paytirish bor.", 'В записи только умножение.', 'The expression has multiplication only.') },
        { action: 'bracket', hint: L("Yozuvda qavs yo'q.", 'В записи скобок нет.', 'There are no brackets here.') },
      ],
    },
    {
      part: '712 · 100', action: 'stage2', to: '71200', parts: ['712 · 100'],
      needPart: L('Avval juftni tanlang.', 'Сначала выбери пару.', 'Pick a pair first.'),
      wrongs: [
        { action: 'stage1', hint: L("Bu ko'paytirish, ya'ni ikkinchi bosqich.", 'Это умножение, то есть вторая ступень.', 'This is multiplication, the second stage.') },
      ],
    },
  ],
  footNote: L('Qiymat topildi', 'Значение найдено', 'The value is found'),
  reward: {
    title: L("Chapdan o'ngga -- odat, majburiyat emas", 'Слева направо это привычка, а не обязанность', 'Left to right is a habit, not a duty'),
    text: L(
      "Faqat ko'paytirish turgan yozuvda istalgan juftdan boshlash mumkin. Shuning uchun avval yozuvga qarang, keyin hisoblang.",
      'Когда в записи только умножение, начинать можно с любой пары. Поэтому сначала посмотри на запись, а потом считай.',
      'When the expression is all multiplication you may start from any pair. So look at the expression first and count second.',
    ),
  },
  audio: [
    A('mount', "Uchta ko'paytuvchi. Qulay juft bu safar chetda emas.", 'Три множителя. Удобная пара на этот раз не с краю.', 'Three factors. This time the handy pair is not at the edge.'),
    A('mount', "Juftni tanlang va amalni ayting.", 'Выбери пару и назови действие.', 'Pick a pair and name the operation.'),
    A('step2', "Yuz hosil bo'ldi. Endi og'ir hisob qolmadi.", 'Получилась сотня. Тяжёлого счёта больше нет.', 'A hundred appeared. No heavy counting left.'),
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
// EKRAN 11. MASHQ 3. ASBOBSIZ (§4.2, §8.1). Na yo'lak, na qadamlar,
// na jadval -- faqat javob shakli.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L("Qiymatni o'zingiz yig'ing", 'Собери значение сам', 'Build the value yourself'),
  template: ['145 · ', { slot: 0 }, '  =  ', { slot: 1 }],
  parts: [
    { id: 'p100', label: '100' },
    { id: 'p14500', label: '14500' },
    { id: 'p7105', label: '7105' },
    { id: 'p2', label: '2' },
  ],
  answer: ['p100', 'p14500'],
  prompt: L(
    "145 · 49 + 145 · 51. Bir qarashda hisoblang, qadamlar ekranda ko'rinmaydi.",
    '145 · 49 + 145 · 51. Посчитай с одного взгляда, шаги на экране не появятся.',
    '145 · 49 + 145 · 51. Work it out at a glance, no steps will appear on screen.',
  ),
  checkNote: L('49 va 51 jami 100, keyin 145 karra 100', '49 и 51 вместе дают 100, потом 145 умножить на 100', '49 and 51 make 100, then 145 times 100'),
  wrongs: [
    { key: 'p100|p7105', tag: 'Z6', hint: L("7105 bu 145 karra 49, ya'ni faqat birinchi qism.", '7105 это 145 умножить на 49, то есть только первая часть.', '7105 is 145 times 49, only the first part.') },
    { key: 'p2|p290', tag: 'Z6', hint: L("Ikkita qism bor, lekin ular qo'shilmaydi, ularning ichidagi sonlar qo'shiladi.", 'Частей две, но складываются не они, а числа внутри них.', 'There are two parts, but it is the numbers inside them that add up, not the parts.') },
    { key: '*', tag: 'Z6', hint: L("Ikkala qismda ham 145 turibdi. Uni tashqariga oling.", 'В обеих частях стоит 145. Вынеси его.', 'Both parts have 145 in them. Take it out.') },
  ],
  audio: [
    A('mount', "Endi ekranda yordam yo'q. Yo'lak ham, qadamlar ham ko'rinmaydi.", 'Теперь помощи на экране нет. Ни дорожки, ни шагов не будет.', 'Now there is no help on the screen. No track and no steps.'),
    A('mount', "Ikki qismga qarang va ularda umumiy nima borligini toping.", 'Посмотри на две части и найди, что в них общего.', 'Look at the two parts and find what they share.'),
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
// EKRAN 12. TUZOQ (§8.2). Har qator to'g'ri KO'RINADI, javob noto'g'ri.
// Xatodan keyingi qatorlar undan TO'G'RI kelib chiqadi.
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
    { id: 'r1', text: '50 − 18 − 12' },
    { id: 'r2', text: '50 − (18 − 12)' },
    { id: 'r3', text: '50 − 6' },
    { id: 'r4', text: '44' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich yozuv, unda hali hech narsa qilinmagan.", 'Это исходная запись, в ней ещё ничего не сделано.', 'That is the original expression, nothing has been done to it yet.'),
    r3: L("Bu qator ikkinchisini halol davom ettiradi: 18 dan 12 ni ayirsak, haqiqatan 6 chiqadi.", 'Эта строка честно продолжает вторую: 18 минус 12 и правда 6.', 'This line honestly continues the second: 18 minus 12 really is 6.'),
    r4: L("50 dan 6 ni ayirsak, 44 chiqadi. Xato bundan oldin paydo bo'lgan.", 'Пятьдесят минус шесть и правда 44. Ошибка появилась раньше.', 'Fifty minus six really is 44. The mistake appeared earlier.'),
  },
  tags: { r1: 'Z4', r3: 'Z4', r4: 'Z4' },
  proofFill: {
    template: ['50 − (18 ', { slot: 0 }, ' 12)  =  ', { slot: 1 }],
    parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }, { id: 'v20', label: '20' }, { id: 'v44', label: '44' }],
    answer: ['plus', 'v20'],
    prompt: L(
      "Qavsni to'g'ri qo'ying va qiymatni hisoblang.",
      'Поставь скобку правильно и посчитай значение.',
      'Put the bracket correctly and work out the value.',
    ),
    checkNote: L('20 va 44. Sonlar farq qildi, demak ikkinchi qator birinchisiga teng emas', '20 и 44. Числа разошлись, значит вторая строка не равна первой', '20 and 44. The numbers differ, so the second line is not equal to the first'),
    wrongs: [
      { key: 'plus|v44', tag: 'Z4', hint: L("Qavs to'g'ri. Endi hisoblang: 18 qo'shuv 12 teng 30, keyin 50 dan 30 ni ayiring.", 'Скобка верная. Теперь посчитай: 18 плюс 12 это 30, потом из 50 вычти 30.', 'The bracket is right. Now count: 18 plus 12 is 30, then take 30 from 50.') },
      { key: '*', tag: 'Z4', hint: L("Ketma-ket ikkita ayirish bitta ayirishga aylanadi, lekin qavs ichidagi sonlar QO'SHILADI.", 'Два вычитания подряд сворачиваются в одно, но числа в скобке при этом СКЛАДЫВАЮТСЯ.', 'Two subtractions in a row collapse into one, but the numbers inside the bracket are ADDED.') },
    ],
  },
  audio: [
    A('mount', "O'quvchi yechdi va xato qildi. Har bir qator to'g'ri ko'rinadi, javob esa noto'g'ri.", 'Ученик решил и ошибся. Каждая строка выглядит верной, а ответ неверен.', 'A student solved it and got it wrong. Every line looks right, yet the answer is wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping. Har qanday noto'g'ri qatorni emas, aynan birinchisini.", 'Найди строку, где ошибка появилась впервые. Не любую неверную, а именно первую.', 'Find the line where the mistake first appears. Not any wrong line, the first one.'),
    A('proof', "Topdingiz. Endi isbotlang. Qavsni o'zingiz to'g'ri qo'ying va qiymatni hisoblang.", 'Нашёл. Теперь докажи. Поставь скобку сам как надо и посчитай значение.', 'You found it. Now prove it. Put the bracket right yourself and work out the value.'),
    A('done', "Yigirma va qirq to'rt. Sonlar farq qildi, demak ikkinchi qator birinchisiga teng emas.", 'Двадцать и сорок четыре. Числа разошлись, значит вторая строка не равна первой.', 'Twenty and forty four. The numbers differ, so the second line is not equal to the first.'),
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
// EKRAN 13. KO'CHIRISH. Vaziyatdan yozuvga, keyin qulay tartibga.
// ============================================================
const S13 = {
  eyebrow: L("TESKARI YO'L", 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L('Vaziyatdan yozuvga', 'Из ситуации в запись', 'From a situation to an expression'),
  rounds: [
    {
      template: ['25 · ', { slot: 0 }, ' · ', { slot: 1 }],
      parts: [{ id: 'p2', label: '2' }, { id: 'p4', label: '4' }, { id: 'p8', label: '8' }, { id: 'p50', label: '50' }],
      answer: ['p2', 'p4'],
      prompt: L(
        "Sinfda 25 ta parta, har partada 2 o'quvchi, har o'quvchida 4 ta daftar. Daftarlar sonini ko'rsatadigan yozuvni yig'ing.",
        'В классе 25 парт, за каждой 2 ученика, у каждого 4 тетради. Собери запись для числа тетрадей.',
        'A class has 25 desks, two students at each, four notebooks each. Build the expression for the number of notebooks.',
      ),
      checkNote: L('Uchta ko\'paytuvchi: partalar, o\'quvchilar, daftarlar', 'Три множителя: парты, ученики, тетради', 'Three factors: desks, students, notebooks'),
      wrongs: [
        { key: 'p8|p50', tag: 'Z7', hint: L("8 va 50 bu allaqachon hisoblangan sonlar. Yozuvda esa shartdagi uchta son turishi kerak.", '8 и 50 это уже посчитанные числа. А в записи должны стоять три числа из условия.', '8 and 50 are already-computed numbers. The expression needs the three numbers from the condition.') },
        { key: '*', tag: 'Z7', hint: L("Shartda uchta son bor: 25, 2 va 4. Uchalasi ham yozuvga tushadi.", 'В условии три числа: 25, 2 и 4. Все три идут в запись.', 'The condition has three numbers: 25, 2 and 4. All three go into the expression.') },
      ],
    },
    {
      template: [{ slot: 0 }, ' · 2  =  ', { slot: 1 }],
      parts: [{ id: 'a100', label: '100' }, { id: 'a200', label: '200' }, { id: 'a50', label: '50' }, { id: 'a800', label: '800' }],
      answer: ['a100', 'a200'],
      prompt: L(
        "Endi qulay tartibda hisoblang: avval qaysi juft yumaloq son beradi?",
        'Теперь посчитай удобным порядком: какая пара даёт круглое число?',
        'Now count in the handy order: which pair gives a round number?',
      ),
      checkNote: L('25 karra 4 teng 100, keyin 100 karra 2', '25 умножить на 4 равно 100, потом 100 умножить на 2', '25 times 4 is 100, then 100 times 2'),
      wrongs: [
        { key: 'a50|a200', tag: 'Z1', hint: L("50 bu 25 karra 2. Bu ham mumkin, lekin yumaloq son 25 va 4 dan chiqadi.", '50 это 25 умножить на 2. Так тоже можно, но круглое число даёт пара 25 и 4.', '50 is 25 times 2. Allowed too, but the round number comes from 25 and 4.') },
        { key: '*', tag: 'Z1', hint: L("Uchta sondan qaysi ikkitasi roppa-rosa yuz beradi?", 'Какие два из трёх чисел дают ровно сто?', 'Which two of the three numbers give exactly a hundred?') },
      ],
    },
  ],
  reward: {
    title: L("Yozuv bitta, yo'l esa tanlanadi", 'Запись одна, а путь выбирают', 'One expression, but the path is chosen'),
    text: L(
      "Ikki yuzta daftar. Xuddi shu son har qanday tartibda chiqadi, lekin qulay tartibda uni og'zaki hisoblash mumkin.",
      'Двести тетрадей. То же число выйдет при любом порядке, но в удобном его можно посчитать в уме.',
      'Two hundred notebooks. The same number comes out in any order, but in the handy one you can do it in your head.',
    ),
  },
  audio: [
    A('mount', "Endi teskari yo'l: vaziyat berilgan, yozuvni siz yig'asiz.", 'Теперь обратный ход: дана ситуация, запись собираешь ты.', 'Now the other way round: the situation is given, you build the expression.'),
    A('r1', "Yozuv tayyor. Endi eng qulay tartibni tanlang.", 'Запись готова. Теперь выбери самый удобный порядок.', 'The expression is ready. Now pick the handiest order.'),
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
  const LABELS = ['25 · 2 · 4', '25 · 4 · 2  →  200']
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
  question: ASK_VALUE,
  items: [
    {
      prompt: '25 · 37 · 4',
      ok: L("Yigirma besh va to'rt yumaloq son berdi.", 'Двадцать пять и четыре дали круглое число.', 'Twenty five and four gave the round number.'),
      items: [
        { id: 'a', label: '3700', correct: true },
        { id: 'b', label: '925', tag: 'Z1', hint: L("925 bu 25 karra 37. Uchinchi ko'paytuvchi hisobga kirmagan.", '925 это 25 умножить на 37. Третий множитель не посчитан.', '925 is 25 times 37. The third factor was left out.') },
        { id: 'c', label: '370', tag: 'Z1', hint: L("Nolni sanang. 25 karra 4 yuzni beradi, yuz karra 37 esa to'rt xonali son.", 'Посчитай нули. 25 умножить на 4 даёт сто, а сто умножить на 37 это четырёхзначное число.', 'Count the zeros. 25 times 4 is a hundred, and a hundred times 37 is a four-digit number.') },
        { id: 'd', label: '3600', hint: L("Yaqin, lekin aniq emas. 100 karra 37 ni qaytadan hisoblang.", 'Близко, но неточно. Пересчитай 100 умножить на 37.', 'Close but not exact. Recount 100 times 37.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("20 − 5 − 3 va 20 − (5 − 3) qiymatlari tengmi?", 'Равны ли значения 20 − 5 − 3 и 20 − (5 − 3)?', 'Are the values of 20 − 5 − 3 and 20 − (5 − 3) equal?'),
      ok: L("Yo'q. Ayirishdan keyingi qavs ishorani o'zgartiradi.", 'Нет. Скобка после вычитания меняет знак.', 'No. A bracket after a minus changes the sign.'),
      items: [
        { id: 'a', correct: true, label: L("Yo'q, 12 va 18", 'Нет, 12 и 18', 'No, 12 and 18') },
        { id: 'b', tag: 'Z4', label: L('Ha, qavs hech nimani o\'zgartirmaydi', 'Да, скобка ничего не меняет', 'Yes, the bracket changes nothing'), hint: L("Ikkalasini hisoblang. 12 va 18 chiqadi.", 'Посчитай обе. Выйдет 12 и 18.', 'Work out both. You get 12 and 18.') },
        { id: 'c', tag: 'Z4', label: L('Ha, qavsni istalgan joyga qo\'ysa bo\'ladi', 'Да, скобку можно ставить куда угодно', 'Yes, a bracket may go anywhere'), hint: L("Qo'shishda shunday, ayirishda esa yo'q. Ikkala qiymatni solishtiring.", 'В сложении так, а в вычитании нет. Сравни оба значения.', 'True for addition, not for subtraction. Compare the two values.') },
        { id: 'd', tag: 'Z5', label: L("Yo'q, lekin faqat shu sonlar uchun", 'Нет, но только для этих чисел', 'No, but only for these numbers'), hint: L("Boshqa uchta sonni oling. Farq yana chiqadi.", 'Возьми другие три числа. Расхождение выйдет снова.', 'Take three other numbers. The gap shows up again.') },
      ],
    },
    {
      prompt: '4 · (10 + 3)',
      ok: L("Ko'paytuvchi ikkala qo'shiluvchiga ham bordi.", 'Множитель дошёл до обоих слагаемых.', 'The factor reached both terms.'),
      items: [
        { id: 'a', label: '52', correct: true },
        { id: 'b', label: '43', tag: 'Z3', hint: L("43 bu 40 qo'shuv 3. To'rtlik uchlikka yetib bormagan.", '43 это 40 плюс 3. Четвёрка не дошла до тройки.', '43 is 40 plus 3. The four never reached the three.') },
        { id: 'c', label: '17', hint: L("17 bu 4 qo'shuv 13. Qavs oldida ko'paytirish turibdi.", '17 это 4 плюс 13. Перед скобкой стоит умножение.', '17 is 4 plus 13. The sign before the bracket is multiplication.') },
        { id: 'd', label: '120', hint: L("120 bu 4 karra 10 karra 3. Qavs ichida qo'shish turibdi.", '120 это 4 умножить на 10 и на 3. В скобке стоит сложение.', '120 is 4 times 10 times 3. The sign inside the bracket is addition.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Taqsimot xossasi nima qiladi?", 'Что делает распределительное свойство?', 'What does the distributive property do?'),
      ok: L("Ko'paytuvchini qavs ichidagi har bir qo'shiluvchiga yuboradi.", 'Отправляет множитель к каждому слагаемому в скобке.', 'It sends the factor to every term in the bracket.'),
      items: [
        { id: 'a', correct: true, label: L("Ko'paytuvchini har bir qo'shiluvchiga yuboradi", 'Отправляет множитель к каждому слагаемому', 'Sends the factor to every term') },
        { id: 'b', tag: 'Z3', label: L("Qo'shiluvchilarni o'rnini almashtiradi", 'Меняет слагаемые местами', 'Swaps the terms around'), hint: L("Bu o'rin almashtirish xossasi. Taqsimot xossasi qavs bilan ishlaydi.", 'Это перестановочное свойство. Распределительное работает со скобкой.', 'That is the commutative property. The distributive one works with a bracket.') },
        { id: 'c', tag: 'Z3', label: L("Qavsni o'zgarishsiz olib tashlaydi", 'Убирает скобку без изменений', 'Removes the bracket unchanged'), hint: L("Unda 4 karra qavs 10 qo'shuv 3 yozuvi 4 karra 10 qo'shuv 3 bo'lib qolardi, ya'ni 43.", 'Тогда 4 умножить на скобку 10 плюс 3 стало бы 4 умножить на 10 плюс 3, то есть 43.', 'Then 4 times bracket 10 plus 3 would become 4 times 10 plus 3, that is 43.') },
        { id: 'd', tag: 'Z5', label: L("Faqat sonlar bilan ishlaydi", 'Работает только с числами', 'Works with numbers only'), hint: L("Ettinchi ekranda qavs ichida o'zgaruvchi turgandi, va xossa u yerda ham ishladi.", 'На седьмом экране в скобке стояла переменная, и свойство сработало и там.', 'On screen seven a variable stood in the bracket, and the property worked there too.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Bu darsdagi yagona baholanadigan ekran, shuning uchun shoshilmang.", 'Блиц, четыре вопроса. Это единственный оцениваемый экран урока, поэтому не спеши.', 'Quick round, four questions. This is the only graded screen of the lesson, so take your time.'),
    A('1', "Ikkinchisi. Ayirish va qavs haqida.", 'Второй. Про вычитание и скобку.', 'Second. About subtraction and a bracket.'),
    A('2', "Uchinchisi. Qavs oldida ko'paytuvchi.", 'Третий. Множитель перед скобкой.', 'Third. A factor before a bracket.'),
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
// Sahna XUKNI YOPADI: o'sha ikki yo'lak, endi javob olingan.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Qiymat bitta, yo'l esa tanlanadi", 'Значение одно, а путь выбирают', 'One value, but the path is chosen'),
  nums: [4, 25, 37],
  ops: ['·', '·'],
  shortLabel: L("qulay yo'l", 'удобный путь', 'the handy path'),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    round: L("yumaloq son yasalgan", 'сделали круглое число', 'a round number was made'),
    luck: L('shunchaki mos tushgan', 'просто совпало', 'it just happened to match'),
    onlythese: L('faqat shu sonlar bilan', 'только с этими числами', 'only with these numbers'),
    changes: L("tartib qiymatni o'zgartiradi", 'порядок меняет значение', 'the order changes the value'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['4 · 25 → 100', '10 − 4 ≠ 4 − 10', '45 + 55 → 100', '7 · 111 + 7 · 8 → 833', '3(a + 5) → 21', '145 · 100 → 14500'],
  twoLabel: L("Uchta xossa", 'Три свойства', 'Three properties'),
  twoA: 'a + b = b + a',
  twoB: 'a(b + c) = ab + ac',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "yozuvni qiymatini o'zgartirmasdan almashtirish",
    'преобразования, которые не меняют значение записи',
    'transformations that leave the value of an expression unchanged',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz va mana qanday chiqdi.", 'Вернёмся к началу. Вот что ты предполагал и вот как оказалось.', 'Back to the start. This is what you predicted and this is how it turned out.'),
    A('mount', "Xossalar qiymatni o'zgartirmaydi. Ular mehnatni o'zgartiradi, va shuning uchun kerak.", 'Свойства не меняют значение. Они меняют труд, и ради этого их и применяют.', 'Properties do not change the value. They change the effort, and that is what they are for.'),
    A('mount', "Keyingi darsda yozuvni qiymatini o'zgartirmasdan almashtirishni o'rganamiz.", 'В следующем уроке будем менять запись, не меняя её значения.', 'In the next lesson we change the expression without changing its value.'),
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

  return (
    <Frame meta={S15} screen={screen} audio={audio} solved {...rest}>
      {/* Xuk yo'lagi qaytadi, endi javob olingan holda. */}
      <CollapseTrack nums={S15.nums} ops={S15.ops} order={[0, 1]} label={t(S15.shortLabel)} tone="ok" />

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

export default function Grade7Dars03({
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
    else console.log('[Grade7 Dars03] onFinished', payload)
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
