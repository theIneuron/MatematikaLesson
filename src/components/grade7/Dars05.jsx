// ============================================================================
// 7-sinf, Dars 5. QAVSLARNI OCHISH.  (Раскрытие скобок)
//
// PILOT dars. Kontrakt: src/books/grade7/ETALON_7SINF.md
// Raskadrovka: src/books/grade7/DARS05_SKELET.md
// Bu faylda FAQAT MA'LUMOT va asboblarni ulash bor: mexanika `./tools.jsx` da,
// yadro `./core.jsx` da. Ikkisi ham 7-sinfning O'ZIGA tegishli, boshqa sinf
// bilan bo'lishilmaydi -- 11-sinf naqshi.
//
// 2026-08-06: 16 ekran 15 ga KELTIRILDI (ETALON_7SINF.md §4.1 va §4.4).
// Nima o'zgardi:
//   - ekran 4 YANGI: qavs oldidagi PLYUS (darslik 1 va 2-qoidasi, 20-bet) --
//     eski darsda bu holat umuman yo'q edi;
//   - ikki qoida kartochkasi (eski 5 va 10) BITTA ekranga, o'rni 8;
//   - eski 12 va 13 BLITS ga (ekran 14) yig'ildi -- yagona baholanadigan ekran;
//   - mashq (ekran 9) variant tanlashdan YIG'ISHGA o'tdi: to'rt variantli
//     ekran endi uchta (2, 6, 8), kontrakt chegarasi ham uchta;
//   - ekran 11 ASBOBSIZ: faqat o'quvchining yozuvi;
//   - ekran 12 tuzoq: qarshi misol sonini O'QUVCHI qo'yadi;
//   - ekran 15: yangi savol OLIB TASHLANDI, tayyorlik darajasi SO'Z bilan,
//     qaydlar va chop etiladigan shpargalka qo'shildi;
//   - 1, 8, 15-ekranlarda MAYDON RANGI (cool / accent / ok);
//   - baho FAQAT blitsda; qolgan ekranlar TEG yozadi (§8.5);
//   - `useInstructionGate`: ovoz yoniq bo'lsa javob ko'rsatma tugagach ochiladi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  BgCurves,
  Btn,
  Col,
  Cols,
  DoneRow,
  Expr,
  Hint,
  Insight,
  L,
  LangProvider,
  LangSetProvider,
  NotesInline,
  PrintSheet,
  RingProgress,
  STYLES,
  Slot,
  Stage,
  T,
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
  CrateScene,
  DistributeDemo,
  ExplainClip,
  FlipTwiceDemo,
  MergeDemo,
  Probe,
  ProbeChain,
  RuleGate,
  SignFlipDemo,
  SlotFill,
  SubstituteRows,
  Transform,
} from './tools.jsx'

const LESSON_ID = 'alg_7_05'
const LESSON_TITLE = L('Qavslarni ochish', 'Раскрытие скобок', 'Expanding brackets')
const LESSON_NO = L('5-dars', 'Урок 5', 'Lesson 5')
const TOTAL = 15

// Blok ichidagi o'rin: o'quvchi bu dars B1 ning beshinchi qadami ekanini
// ko'radi, alohida tema emas. B1 -- algebraik ifodalar, 1-6-darslar.
const BLOCK = { label: L('B1-blok', 'Блок Б1', 'Block B1'), from: 1, to: 6, current: 5 }

// Ovoz bo'laklari. `on: 'mount'` -- ekran ochilganda, `on: '<nom>'` -- shu nomli
// qadam bosilganda. Ya'ni ovoz TAYMER bilan emas, o'quvchining qadami bilan boradi.
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
  print: L('Shpargalkani chop etish', 'Распечатать шпаргалку', 'Print the cheat sheet'),
}

// ============================================================
// TEGLAR. Baho emas: qaysi yanglish tushuncha ishga tushgani.
// Yakunda kamchilik aynan shu SO'ZLAR bilan ataladi, foiz bilan EMAS.
// Kodlar DARS05_SKELET.md dan (Z1..Z5), ikkitasi tayanch uchun qo'shildi.
// ============================================================
const TAGS = {
  Z1: L("qavs oldidagi ko'paytuvchi", 'множитель перед скобкой', 'the multiplier before the brackets'),
  Z2: L('qavs oldidagi minus', 'минус перед скобкой', 'the minus before the brackets'),
  Z3: L("minus va ko'paytuvchi birga", 'минус вместе с множителем', 'a minus together with a multiplier'),
  Z4: L('qavs oldidagi plyus', 'плюс перед скобкой', 'the plus before the brackets'),
  Z5: L("qavsni qoidasiz olib tashlash", 'снятие скобок без правила', 'dropping brackets without a rule'),
  Z6: L("o'xshash qo'shiluvchilar", 'подобные слагаемые', 'like terms'),
  Z7: L('ketma-ket ikki minus', 'два минуса рядом', 'two minus signs in a row'),
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

// Qadamba-qadam qayta yozish amallari. Ro'yxat butun dars uchun BIR XIL:
// «ko'chirish» ataylab turadi -- bu IFODA, tenglama emas, ko'chiradigan joy yo'q.
const ACTIONS = [
  { id: 'open', label: L('Qavsni ochish', 'Раскрыть скобку', 'Expand the bracket') },
  { id: 'collect', label: L("O'xshashlarni qo'shish", 'Привести подобные', 'Collect like terms') },
  { id: 'flip', label: L("Butun qavsning ishorasini almashtirish", 'Поменять знак у всей скобки', 'Flip the sign of the whole bracket') },
  { id: 'move', label: L("Qo'shiluvchini ko'chirish", 'Перенести слагаемое', 'Move a term across') },
]

// ============================================================
// Umumiy ramka: sarlavha, maydon rangi, qulf, navigatsiya.
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
      right={meta.right}
      block={{ ...BLOCK, label: t(BLOCK.label) }}
      screen={screen}
      total={TOTAL}
      audio={audio}
      nav={nav}
      field={meta.field}
    >
      <Title>{t(meta.title)}</Title>
      {children}
    </Stage>
  )
}

// ============================================================
// EKRAN 1. XUK. Konflikt: 3(a + 5) -- 3a + 15 yoki 3a + 5?
// Baholanmaydi va TEG ham yozmaydi: bu tushuntirishdan OLDINGI taxmin.
// Maydon BIRUZA: «baholanmaydi» degani.
// ============================================================
const S1 = {
  eyebrow: L('QAVSLARNI OCHISH', 'РАСКРЫТИЕ СКОБОК', 'EXPANDING BRACKETS'),
  field: 'graph',
  noBack: true,
  title: L(
    "Ikki o'quvchi bir xil qavsni ochdi",
    'Два ученика раскрыли одни и те же скобки',
    'Two students expanded the same brackets',
  ),
  expr: '3(a + 5)',
  cards: [
    { id: 'left', name: L('Anvar', 'Анвар', 'Anvar'), value: '3a + 15', btn: L("Yashiklarni ochish", 'Открыть ящики', 'Open the crates') },
    { id: 'right', name: L('Zuhra', 'Зухра', 'Zuhra'), value: '3a + 5', btn: L("Ichida nima borligini ko'rish", 'Посмотреть, что внутри', 'See what is inside') },
  ],
  motive: L(
    "Ikkisi ham fan olimpiadasi finaliga tayyorlanmoqda. Finalda shu qadam xato bo'lsa, butun masala xato ketadi.",
    'Оба готовятся к финалу олимпиады. В финале один такой шаг решает всю задачу.',
    'Both are preparing for the science olympiad final. In the final, one such step decides the whole task.',
  ),
  probe: {
    question: L("Qaysi yoyish to'g'ri?", 'Какое раскрытие верное?', 'Which expansion is correct?'),
    afterPredict: L(
      "Taxminingiz yozib olindi. Endi uni SON bilan tekshiramiz.",
      'Твоя догадка записана. Сейчас проверим её числом, спорить не придётся.',
      'Your guess is saved. Now we check it with a number, no arguing needed.',
    ),
    items: [
      { id: 'l', label: L('Anvar: 3a + 15', 'Анвар: 3a + 15', 'Anvar: 3a + 15') },
      { id: 'r', label: L('Zuhra: 3a + 5', 'Зухра: 3a + 5', 'Zuhra: 3a + 5') },
      { id: 'both', label: L('Ikkisi ham', 'Оба', 'Both') },
      { id: 'none', label: L('Hech qaysi', 'Ни одно', 'Neither') },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi bir xil qavsni ochdi va ikki xil yozuv chiqdi.", 'Двое учеников раскрыли одни и те же скобки и получили разные записи.', 'Two students expanded the same brackets and got different results.'),
    A('c1', 'Birinchisida shunday chiqdi.', 'Вот что получилось у первого.', 'This is what the first one got.'),
    A('c2', 'Ikkinchisida esa boshqacha.', 'А вот что у второго.', 'And this is what the second one got.'),
    A('ask', "Sizningcha qaysi yozuv to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая запись верная? Пока просто предположи.', 'Which one do you think is correct? Just make a guess for now.'),
  ],
}

function Screen1({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S1.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [open, setOpen] = useState(0)
  const [picked, setPicked] = useState(null)

  const reveal = () => {
    const next = open + 1
    setOpen(next)
    audio.step('c' + next)
    if (next === S1.cards.length) audio.step('ask')
  }

  return (
    <Frame meta={S1} screen={screen} audio={audio} solved={!!picked} {...rest}>

      {/* SAHNA: uchta bir xil yashik, har birida muhrlangan `a` va beshta
          batareya. Qavs shu yerda KO'RINADI, matn bilan aytilmaydi. */}
      <div className="g7-scene">
        <CrateScene state={open >= S1.cards.length ? 'open' : 'closed'} />
      </div>
      <Expr size="row">{S1.expr}</Expr>
      <Hint>{t(S1.motive)}</Hint>
      {open < S1.cards.length ? (
        <Slot mh={44} style={{ alignItems: 'center' }}>
          <Btn tone="soft" ready={canAnswer} disabled={!canAnswer} onClick={reveal}>
            {t(S1.cards[open].btn)}
          </Btn>
        </Slot>
      ) : null}
      {open >= S1.cards.length ? (
        <div className="g7-in g7-d1">
          <Probe audio={audio} data={S1.probe} cols={2} unscored fbSlot={0} disabled={!canAnswer}
            onSolved={(r) => { setPicked(r.picked); onAnswer({ ...r, screen, role: 'hook' }) }} />
        </div>
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 2. TAYANCH. Uch qisqa savol, birma-bir. Baho YO'Q, teg BOR.
// To'rt variantli ekran: kvota 1/3.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCHNI TEKSHIRISH', 'ПРОВЕРКА ОПОРЫ', 'CHECKING THE BASICS'),
  title: L('Uch narsani eslaymiz', 'Вспомним три вещи', 'Let us recall three things'),
  items: [
    {
      viz: (ok) => <DistributeDemo factor="3" t1="4" t2="5" run={ok ? 1 : 0} h={52} />,
      prompt: '3 · (4 + 5) =',
      items: [
        { id: 'a', label: '27', correct: true },
        { id: 'b', label: '17', tag: 'Z1', hint: L("Uchlik butun yig'indiga ko'paytiriladi, faqat to'rtga emas.", 'Тройка умножается на всю сумму, а не только на четвёрку.', 'The three multiplies the whole sum, not just the four.') },
        { id: 'c', label: '32', tag: 'Z1', hint: L("Uchlik ko'paytiradi, qo'shilmaydi.", 'Тройка умножает, а не прибавляется.', 'The three multiplies, it is not added.') },
        { id: 'd', label: '12', tag: 'Z1', hint: L('Qavs ichida ikki son bor, ikkisi ham qatnashadi.', 'В скобках два числа, оба участвуют.', 'There are two numbers in the brackets, both take part.') },
      ],
    },
    {
      viz: (ok) => <FlipTwiceDemo value="4" run={ok ? 1 : 0} h={42} />,
      prompt: '−(−4) =',
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '−4', tag: 'Z7', hint: L("Minus ikkita. Har biri ishorani o'zgartiradi.", 'Минусов два. Каждый меняет знак.', 'There are two minus signs. Each one flips the sign.') },
        { id: 'c', label: '8', tag: 'Z7', hint: L("Ishora o'zgaradi, son kattalashmaydi.", 'Знак меняется, число не растёт.', 'The sign changes, the number does not grow.') },
        { id: 'd', label: '0', tag: 'Z7', hint: L("Bu qo'shish emas, son oldidagi ishora.", 'Здесь не сложение, а знак перед числом.', 'This is not addition, it is the sign before the number.') },
      ],
    },
    {
      viz: (ok) => <MergeDemo left="2a" right="3a" op="+" result="5a" run={ok ? 1 : 0} h={42} />,
      prompt: '2a + 3a =',
      items: [
        { id: 'a', label: '5a', correct: true },
        { id: 'b', label: '6a', tag: 'Z6', hint: L("Qo'shish kerak, ko'paytirish emas: ikkita va yana uchta.", 'Нужно сложить, а не умножить: два и ещё три.', 'They are added, not multiplied: two and three more.') },
        { id: 'c', label: '5', tag: 'Z6', hint: L('Nechta a borligini sanaymiz, harf qoladi.', 'Считаем, сколько a. Буква остаётся.', 'We count how many a there are. The letter stays.') },
        { id: 'd', label: '2a3a', tag: 'Z6', hint: L("O'xshash qo'shiluvchilar bittaga qo'shiladi.", 'Подобные слагаемые складываются в одно.', 'Like terms combine into one.') },
      ],
    },
  ],
  audio: [
    A('mount', "Yangi mavzudan oldin uch narsani eslaymiz. Bu baho emas.", 'Перед новой темой вспомним три вещи. Это не оценка.', 'Before the new topic, let us recall three things. This is not a test.'),
    A('1', "Ikkinchisi: son oldidagi minus ishorasi.", 'Второе: знак минус перед числом.', 'Second: the minus sign before a number.'),
    A('2', "Uchinchisi: o'xshash qo'shiluvchilarni qo'shish.", 'Третье: сложение подобных слагаемых.', 'Third: adding like terms.'),
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
      <ProbeChain audio={audio}
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
// EKRAN 3. SONLI GUVOH: 1-ekrandagi janjalni o'quvchi O'ZI hal qiladi.
// Podstanovka javob BERILGANDAN keyin ishlaydi: taxmin 1-ekranda yozildi.
// ============================================================
const S3 = {
  eyebrow: L('SON BILAN TEKSHIRAMIZ', 'ПРОВЕРИМ ЧИСЛОМ', 'CHECK WITH A NUMBER'),
  title: L("a o'rniga son qo'yamiz", 'Подставим вместо a число', 'Let us substitute a number for a'),
  rows: [
    { id: 'src', expr: '3(a + 5)', sub: (n) => '3(' + n + ' + 5)', val: (n) => 3 * (n + 5), role: 'source' },
    { id: 'c1', expr: '3a + 15', sub: (n) => '3 · ' + n + ' + 15', val: (n) => 3 * n + 15, role: 'candidate' },
    { id: 'c2', expr: '3a + 5', sub: (n) => '3 · ' + n + ' + 5', val: (n) => 3 * n + 5, role: 'candidate' },
  ],
  numbers: [1, 2, 4, 10],
  question: L('Qaysi yozuv boshlang\'ich yozuvga teng?', 'Какая запись равна исходной?', 'Which expression equals the original one?'),
  okText: L(
    "Ajoyib. Sonlar mos keldi -- demak yozuv o'sha.",
    'Отлично. Числа сошлись, значит запись та же самая.',
    'Great. The values matched, so it is the same expression.',
  ),
  options: [
    { id: 'c1', label: '3a + 15', correct: true },
    { id: 'c2', label: '3a + 5', tag: 'Z1', hint: L("O'ngdagi sonlarga qarang: boshlang'ich yozuvda bitta son, bunda boshqa son.", 'Посмотри на числа справа: у исходной записи одно число, у этой другое.', 'Look at the numbers on the right: the original gives one value, this one another.') },
  ],
  audio: [
    A('mount', "Janjalni janjal bilan emas, son bilan hal qilamiz. a o'rniga xohlagan sonni tanlang.", 'Спор решается не спором, а числом. Выбери любое число вместо a.', 'An argument is settled by a number, not by arguing. Pick any number for a.'),
    A('sub', "Endi har uch yozuvni shu son bilan hisoblaymiz.", 'Теперь посчитаем все три записи с этим числом.', 'Now we compute all three expressions with this number.'),
    A('row3', "Ikki yozuv bir xil natija berdi, bittasi boshqa. Qaysi biri to'g'ri?", 'Две записи дали одинаковый результат, одна другой. Какая из них верная?', 'Two expressions gave the same value, one gave a different one. Which is correct?'),
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
      <SubstituteRows audio={audio}
        rows={S3.rows}
        numbers={S3.numbers}
        question={S3.question}
        options={S3.options}
        okText={S3.okText}
        disabled={!canAnswer}
        onStep={(name) => audio.step(name)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. FARQLASH: qavs oldida PLYUS. O'xshash, lekin bu emas.
// Darslikning 1 va 2-qoidasi (20-bet): plyus turgan qavsda ishoralar
// O'ZGARMAYDI, va ishorasiz turgan birinchi qo'shiluvchi PLYUS bilan.
// Javobni o'quvchi YIG'ADI -- variant tanlash emas.
// ============================================================
const S4 = {
  eyebrow: L("PLYUS YOKI KO'PAYTUVCHI", 'ПЛЮС ИЛИ МНОЖИТЕЛЬ', 'PLUS OR MULTIPLIER'),
  title: L(
    "Qavs oldida plyus: nima o'zgaradi?",
    'Перед скобкой плюс: что меняется?',
    'A plus before the brackets: what changes?',
  ),
  known: '3 · (a + 5)  =  3a + 15',
  prompt: L(
    "Ishoralarni qo'ying: qavs oldida plyus turganda nima bo'ladi?",
    'Расставьте знаки: что будет, когда перед скобкой плюс?',
    'Place the signs: what happens when a plus stands before the brackets?',
  ),
  template: ['3 + (a + 5)', '  =  ', '3', { slot: 0 }, 'a', { slot: 1 }, '5'],
  parts: [
    { id: 'plus', label: '+' },
    { id: 'minus', label: '−' },
    { id: 'dot', label: '·' },
  ],
  answer: ['plus', 'plus'],
  wrongs: [
    { key: 'plus|minus', tag: 'Z4', hint: L("Qavs ichida minus yo'q edi. Plyus ishoralarni o'zgartirmaydi.", 'Минуса в скобках не было. Плюс знаки не меняет.', 'There was no minus inside. A plus does not change the signs.') },
    { key: 'minus|plus', tag: 'Z4', hint: L("Qavs oldida plyus turibdi, minus emas. a = 2 qo'yib solishtiring.", 'Перед скобкой плюс, а не минус. Подставь a = 2 и сравни.', 'There is a plus before the brackets, not a minus. Put a = 2 and compare.') },
    { key: 'minus|minus', tag: 'Z4', hint: L("Bu minus qoidasi, bu yerda esa plyus. a = 2 da chapda o'n chiqadi.", 'Это правило минуса, а здесь плюс. При a = 2 слева выходит десять.', 'That is the minus rule, but here we have a plus. With a = 2 the left side gives ten.') },
    { key: 'dot|plus', tag: 'Z1', hint: L("Uchlik bilan qavs orasida plyus turibdi, nuqta emas: ko'paytiradigan narsa yo'q.", 'Между тройкой и скобкой стоит плюс, а не точка: умножать нечем.', 'Between the three and the brackets there is a plus, not a dot: there is nothing to multiply by.') },
    { key: 'plus|dot', tag: 'Z1', hint: L("a va beshlik ko'paytirilmaydi: qavs ichida ular qo'shilgan edi.", 'a и пятёрка не умножаются: в скобках они складывались.', 'a and the five are not multiplied: inside the brackets they were added.') },
    { key: '*', tag: 'Z4', hint: L("Son qo'yib tekshiring: chap va o'ng tomon bir xil bo'lishi kerak.", 'Проверь числом: слева и справа должно получиться одно и то же.', 'Check with a number: both sides must give the same value.') },
  ],
  checkNote: L(
    'a = 2:  3 · (a + 5) = 21,   3 + (a + 5) = 10',
    'a = 2:  3 · (a + 5) = 21,   3 + (a + 5) = 10',
    'a = 2:  3 · (a + 5) = 21,   3 + (a + 5) = 10',
  ),
  audio: [
    A('mount', "Yozuv o'xshash, lekin qavs oldida ko'paytuvchi emas, plyus turibdi. Ishoralarni shunday qo'ying, tenglik saqlanib qolsin.", 'Запись похожая, но перед скобкой не множитель, а плюс. Расставь знаки так, чтобы равенство осталось верным.', 'The expression looks similar, but before the brackets there is a plus, not a multiplier. Place the signs so the equality still holds.'),
    A('checked', "Sonlarga qarang: nuqta bilan yigirma bir chiqdi, plyus bilan o'n. Plyus hech nimani ko'paytirmaydi va ishoralarga tegmaydi.", 'Смотри на числа: с точкой вышло двадцать один, с плюсом десять. Плюс ничего не умножает и знаки не трогает.', 'Look at the numbers: with the dot it gives twenty one, with the plus it gives ten. A plus multiplies nothing and leaves the signs alone.'),
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
      <DoneRow>{S4.known}</DoneRow>
      <SlotFill audio={audio}
        prompt={S4.prompt}
        template={S4.template}
        parts={S4.parts}
        answer={S4.answer}
        wrongs={S4.wrongs}
        checkNote={S4.checkNote}
        disabled={!canAnswer}
        onStep={(n) => audio.step(n)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 5. IKKINCHI TASVIR: o'sha fikr, lekin buyumlar bilan.
// Rolik tugagach o'rniga QAYTA YOZISH keladi -- oxirgi qatorni
// o'quvchi ochadi, dastur emas. Ikkisi birga 400px ga sig'maydi,
// shuning uchun keyingi qadam oldingisini ALMASHTIRADI (§6.1).
// ============================================================
const S5 = {
  eyebrow: L('QANDAY ISHLAYDI', 'КАК ЭТО РАБОТАЕТ', 'HOW IT WORKS'),
  title: L("Nega aynan 3a + 15 chiqdi", 'Почему получилось именно 3a + 15', 'Why the answer is exactly 3a + 15'),
  sceneSum: L(
    'Uchta a va o\'n beshta batareya',
    'Три a и пятнадцать батареек',
    'Three a and fifteen batteries',
  ),
  clip: [
    {
      state: 'closed',
      caption: L(
        "Uchta bir xil yashik. Har birida bitta noma'lum `a` va beshta batareya.",
        'Три одинаковых ящика. В каждом один неизвестный a и пять батареек.',
        'Three identical crates. Each holds one unknown a and five batteries.',
      ),
    },
    {
      state: 'open',
      caption: L(
        "Yashiklarni ochamiz. Ichidagilar ko'rinib turibdi.",
        'Открываем ящики. Теперь видно, что внутри.',
        'We open the crates. Now we can see what is inside.',
      ),
    },
    {
      state: 'regroup',
      caption: L(
        "Bir xillarini yig'amiz: `a` lar chapga, batareyalar o'ngga.",
        'Собираем одинаковое к одинаковому: все a влево, все батарейки вправо.',
        'We gather like with like: all the a blocks left, all the batteries right.',
      ),
    },
    {
      state: 'result',
      caption: L(
        "Uchta `a` va o'n beshta batareya. Endi shuni yozuvda takrorlang.",
        'Три a и пятнадцать батареек. Теперь повтори это в записи.',
        'Three a and fifteen batteries. Now repeat that in the written form.',
      ),
    },
  ],
  start: '3(a + 5)',
  steps: [
    {
      parts: ['3(a + 5)'],
      part: '3(a + 5)',
      action: 'open',
      to: '3a + 15',
      needPart: L("Avval qaysi qism bilan ishlayotganingizni tanlang.", 'Сначала выбери, с какой частью работаешь.', 'First choose which part you are working on.'),
      wrongs: [
        { action: 'collect', tag: 'Z6', hint: L("Qavs ichida a va beshlik o'xshash emas: birida harf bor, birida yo'q.", 'В скобках a и пятёрка не подобны: у одного буква есть, у другого нет.', 'Inside the brackets a and the five are not like terms: one has a letter, the other does not.') },
        { action: 'flip', tag: 'Z2', hint: L("Qavs oldida minus emas, uchlik turibdi. Ishora o'zgarmaydi.", 'Перед скобкой не минус, а тройка. Знак не меняется.', 'Before the brackets there is a three, not a minus. No sign changes.') },
        { action: 'move', hint: L("Bu tenglama emas, ifoda. Ko'chiradigan joy yo'q.", 'Это выражение, а не уравнение. Переносить некуда.', 'This is an expression, not an equation. There is nowhere to move it.') },
      ],
    },
  ],
  footNote: 'a = 2:  3(2 + 5) = 21      3a + 15 = 21',
  audio: [
    A('mount', "Nega shunday chiqqanini buyumlarda ko'ramiz.", 'Посмотрим на предметах, почему получилось именно так.', 'Let us see on objects why it came out that way.'),
    A('ask', "Endi o'sha harakatni yozuvda takrorlang: qismni tanlang va amalni tanlang.", 'Теперь повтори то же движение в записи: выбери часть и выбери действие.', 'Now repeat the same move in writing: choose the part and choose the action.'),
    A('step2', "Mana. Yashiklardagi harakat va yozuvdagi qator -- bitta narsa.", 'Вот. Движение в ящиках и строка в записи это одно и то же.', 'There. The move with the crates and the line in the record are the same thing.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S5.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [opened, setOpened] = useState(false)
  const [done, setDone] = useState(false)

  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      {!opened ? (
        <ExplainClip
          steps={S5.clip}
          render={(state) => <CrateScene state={state} />}
          onDone={() => { setOpened(true); audio.step('ask') }}
        />
      ) : (
        <div className="g7-in">
          <DoneRow>{t(S5.sceneSum)}</DoneRow>
          <Transform audio={audio}
            start={S5.start}
            steps={S5.steps}
            actions={ACTIONS}
            footNote={S5.footNote}
            disabled={!canAnswer}
            onStep={(n) => audio.step(n)}
            onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
          />
        </div>
      )}
    </Frame>
  )
}

// ============================================================
// EKRAN 6. YANGI HOLAT + PROGNOZ. To'rt variantli ekran: kvota 2/3.
// Ikki savol bir vaqtda turmaydi: birinchisi javobdan keyin
// ikkinchisi bilan ALMASHADI (budjet 400px).
// ============================================================
const S6 = {
  eyebrow: L('YANGI HOLAT', 'НОВЫЙ СЛУЧАЙ', 'A NEW CASE'),
  title: L("Qavs oldida endi son emas", 'Перед скобкой больше не число', 'There is no longer a number before the brackets'),
  rows: [
    { tag: L('edi:', 'было:', 'before:'), expr: '3(a + 5)' },
    { tag: L("bo'ldi:", 'стало:', 'now:'), expr: '−(a − 7)' },
  ],
  probe1: {
    question: L("Ikkinchi yozuv birinchisidan nimasi bilan farq qiladi?", 'Чем вторая запись отличается от первой?', 'How does the second expression differ from the first?'),
    ok: L(
      "To'g'ri. Qavs oldida endi son emas, minus turibdi.",
      'Верно. Перед скобкой теперь не число, а минус.',
      'Correct. There is now a minus before the brackets, not a number.',
    ),
    items: [
      { id: 'a', label: L("Qavs oldida minus, son emas", 'Перед скобкой минус, а не число', 'A minus before the brackets, not a number'), correct: true },
      { id: 'b', label: L('Qavs ichida minus bor', 'В скобках минус', 'There is a minus inside the brackets'), tag: 'Z2', hint: L("Qavs ichida minus birinchi yozuvda ham bor edi. Uning QAYERDA turganiga qarang.", 'Минус в скобках был и в первой записи. Посмотри, где он стоит.', 'A minus inside the brackets was there before too. Look at where it stands.') },
      { id: 'c', label: L("Ko'paytuvchi umuman yo'q", 'Множителя нет вообще', 'There is no multiplier at all'), tag: 'Z2', hint: L("Ko'paytuvchi bor. Faqat u songa o'xshamaydi.", 'Множитель есть. Просто он не похож на число.', 'There is a multiplier. It just does not look like a number.') },
      { id: 'd', label: L('Harf boshqa', 'Буква другая', 'The letter is different'), tag: 'Z2', hint: L("Harf muhim emas. Qavs OLDIDA nima turgani muhim.", 'Буква не важна. Важно, что стоит перед скобкой.', 'The letter does not matter. What matters is what stands before the brackets.') },
    ],
  },
  probe2: {
    question: L("Qavsni ochsak nima chiqadi?", 'Что получится, если раскрыть скобки?', 'What do we get if we expand?'),
    afterPredict: L(
      "Taxmin yozildi. O'sha usul bilan, son bilan tekshiramiz.",
      'Догадка записана. Проверим её тем же способом, числом.',
      'Your guess is saved. We will check it the same way, with a number.',
    ),
    items: [
      { id: 'p1', label: '−a + 7' },
      { id: 'p2', label: '−a − 7' },
      { id: 'p3', label: 'a − 7' },
      { id: 'p4', label: '−a − 7 + 7' },
    ],
  },
  audio: [
    A('mount', "Oldingi blokda qavs oldida son turardi.", 'В прошлом блоке перед скобкой стояло число.', 'In the previous block there was a number before the brackets.'),
    A('row2', "Endi qarang: qavs oldida minus turadi.", 'А теперь посмотри: перед скобкой стоит минус.', 'Now look: there is a minus before the brackets.'),
    A('ask2', "Sizningcha, qavsni ochsak nima chiqadi? Shunchaki taxmin qiling.", 'Как думаешь, что получится, если раскрыть скобки? Просто предположи.', 'What do you think we get if we expand? Just guess.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S6.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [shown, setShown] = useState(1)
  const [stage, setStage] = useState('diff') // diff -> predict
  const [picked, setPicked] = useState(null)

  return (
    <Frame meta={S6} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <Slot mh={78}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {S6.rows.map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10, minHeight: 34, opacity: i < shown ? 1 : 0.15 }}>
              <span className="g7-eyebrow" style={{ display: 'inline', minWidth: 54 }}>{t(row.tag)}</span>
              <span className={'g7-expr g7-expr-mid' + (i === 1 && shown > 1 ? ' g7-in g7-pulse' : '')}>{i < shown ? row.expr : ''}</span>
            </div>
          ))}
        </div>
      </Slot>
      <Slot mh={44} style={{ alignItems: 'center' }}>
        {shown < S6.rows.length ? (
          <Btn tone="soft" ready={canAnswer} disabled={!canAnswer} onClick={() => { setShown(2); audio.step('row2') }}>
            {t(L("Yangi holatni ko'rsatish", 'Показать новый случай', 'Show the new case'))}
          </Btn>
        ) : null}
      </Slot>
      <Slot mh={148}>
        {shown >= S6.rows.length && stage === 'diff' ? (
          <div className="g7-in g7-d1">
            <Probe audio={audio}
              data={S6.probe1}
              cols={2}
              minH={44}
              disabled={!canAnswer}
              onSolved={(r) => { onAnswer({ ...r, screen, role: 'explain', part: 'diff' }); setTimeout(() => { setStage('predict'); audio.step('ask2') }, 1000) }}
            />
          </div>
        ) : null}
        {stage === 'predict' ? (
          <div className="g7-in g7-d1">
            <Probe audio={audio} data={S6.probe2} cols={2} minH={44} unscored disabled={!canAnswer}
              onSolved={(r) => { setPicked(r.picked); onAnswer({ ...r, screen, role: 'explain', part: 'predict' }) }} />
          </div>
        ) : null}
      </Slot>
    </Frame>
  )
}

// ============================================================
// EKRAN 7. CHEGARAVIY HOLAT: sonli guvoh minusni tutadi.
// Darsning burilish nuqtasi. Taxmin 6-ekranda YOZILGAN, endi tekshiriladi.
// ============================================================
const S7 = {
  eyebrow: L('SON BILAN TEKSHIRAMIZ', 'ПРОВЕРИМ ЧИСЛОМ', 'CHECK WITH A NUMBER'),
  title: L('a = 10 ni qo\'yamiz', 'Подставим a = 10', 'Let us substitute a = 10'),
  rows: [
    { id: 'src', expr: '−(a − 7)', sub: (n) => '−(' + n + ' − 7)', val: (n) => -(n - 7), role: 'source' },
    { id: 'c1', expr: '−a + 7', sub: (n) => '−' + n + ' + 7', val: (n) => -n + 7, role: 'candidate' },
    { id: 'c2', expr: '−a − 7', sub: (n) => '−' + n + ' − 7', val: (n) => -n - 7, role: 'candidate' },
  ],
  numbers: [10],
  compareNote: '−3   ≠   −17',
  question: L('Qaysi yozuv boshlang\'ich yozuvga teng?', 'Какая запись равна исходной?', 'Which expression equals the original one?'),
  okText: L(
    "Mana javob. Minus uch va minus uch -- yozuvlar teng.",
    'Вот и ответ. Минус три и минус три, записи равны.',
    'There is the answer. Minus three and minus three, the expressions are equal.',
  ),
  options: [
    { id: 'c1', label: '−a + 7', correct: true },
    { id: 'c2', label: '−a − 7', tag: 'Z2', hint: L("Ikki songa qarang: boshlang'ich yozuv minus uch, bu esa minus o'n yetti berdi.", 'Смотри на два числа: исходная запись дала минус три, эта минус семнадцать.', 'Look at the two values: the original gives minus three, this one minus seventeen.') },
  ],
  audio: [
    A('mount', "O'sha usul bilan tekshiramiz. a o'rniga o'n qo'yamiz.", 'Проверим тем же способом. Подставим вместо a десять.', 'Let us check the same way. Substitute ten for a.'),
    A('row1', "Boshlang'ich yozuvda minus uch chiqdi.", 'В исходной записи получилось минус три.', 'The original expression gives minus three.'),
    A('row2', "Birinchi variantda ham minus uch.", 'В первом варианте тоже минус три.', 'The first option also gives minus three.'),
    A('row3', "Ikkinchisida esa minus o'n yetti. Bu boshqa son.", 'А во втором минус семнадцать. Это другое число.', 'But the second gives minus seventeen. That is a different number.'),
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
      <SubstituteRows audio={audio}
        rows={S7.rows}
        numbers={S7.numbers}
        question={S7.question}
        options={S7.options}
        compareNote={S7.compareNote}
        okText={S7.okText}
        disabled={!canAnswer}
        onStep={(name) => audio.step(name)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 8. QOIDA. Darsning ikki qoidasi BITTA kartochkada, o'rni 8.
// Maydon ORANJ. Kartochka savolga to'g'ri javob berilmaguncha YOPIQ.
// Formulalar darslikdan: 4-paragraf 20-bet, 5-paragraf 23-bet.
// To'rt variantli ekran: kvota 3/3.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  field: 'accent',
  title: L("Uch qoidani yig'amiz", 'Соберём три правила', 'Let us build the three rules'),
  probe: {
    question: L("Qavs oldidagi minus nimani o'zgartiradi?", 'Что меняет минус перед скобкой?', 'What does a minus before the brackets change?'),
    items: [
      { id: 'a', label: L("Hamma qo'shiluvchining ishorasini", 'Знак у всех слагаемых', 'The sign of every term'), correct: true },
      { id: 'b', label: L("Faqat birinchisining ishorasini", 'Знак только первого', 'Only the first term'), tag: 'Z2', hint: L("Son qo'yib tekshiring: harflar o'rniga besh va ikki qo'ying.", 'Проверь числом: подставь вместо букв пятёрку и двойку.', 'Check with a number: put five and two for the letters.') },
      { id: 'c', label: L("Hech nimani, qavs shunchaki olib tashlanadi", 'Ничего, скобки просто убираются', 'Nothing, the brackets are just removed'), tag: 'Z5', hint: L("Unda qavsni shundaygina o'chirsa bo'lardi. Bo'lmasligini son bilan tekshirdik.", 'Тогда скобки можно было бы просто стереть. Мы проверили числом, что нельзя.', 'Then the brackets could just be erased. We checked with a number that they cannot.') },
      { id: 'd', label: L("Faqat oxirgisining ishorasini", 'Знак только последнего', 'Only the last term'), tag: 'Z2', hint: L("Birinchi qo'shiluvchiga qarang. Uning ishorasi ham o'zgardi.", 'Посмотри на первое слагаемое. Его знак тоже изменился.', 'Look at the first term. Its sign changed too.') },
    ],
    shortAnswer: L("Hamma qo'shiluvchining ishorasi o'zgaradi", 'Меняются знаки у всех слагаемых', 'Every term changes its sign'),
    ok: L(
      "To'g'ri. Endi darsning ikki qoidasiga qarang.",
      'Верно. Теперь посмотри на оба правила урока.',
      'Correct. Now look at both rules of the lesson.',
    ),
  },
  rule: {
    demo: <SignFlipDemo before="x − ( y − z )" pairs={[['y', '− y'], ['− z', '+ z']]} run={1} h={52} />,
    badge: L('DARSNING UCH QOIDASI', 'ТРИ ПРАВИЛА УРОКА', 'THE THREE RULES OF THIS LESSON'),
    lawLabel: L('Darslik qoidalari', 'Правила учебника', 'Textbook rules'),
    laws: [
      {
        formula: 'a(b + c) = ab + ac',
        note: L("ko'paytuvchi HAR BIR qo'shiluvchiga ko'paytiriladi", 'множитель умножается на КАЖДОЕ слагаемое', 'the multiplier multiplies EACH term'),
      },
      {
        formula: 'x − (y − z) = x − y + z',
        note: L("minus HAR BIR qo'shiluvchining ishorasini o'zgartiradi", 'минус меняет знак КАЖДОГО слагаемого', 'the minus flips the sign of EVERY term'),
      },
      {
        formula: 'x + (y − z) = x + y − z',
        note: L("plyus ishoralarga tegmaydi; ishorasiz turgan qo'shiluvchi plyus bilan", 'плюс знаки не трогает; слагаемое без знака считается со знаком плюс', 'a plus changes nothing; a term without a sign counts as plus'),
      },
    ],
    lines: [],
    example: L('Darslik: 4-paragraf 20-bet, 5-paragraf 23-bet', 'Учебник: § 4, стр. 20 и § 5, стр. 23', 'Textbook: § 4, p. 20 and § 5, p. 23'),
  },
  audio: [
    A('mount', "Ikki qoidani yig'amiz. Avval ayting: qavs oldidagi minus aynan nimani o'zgartiradi?", 'Соберём два правила. Сначала скажи: что именно меняет минус перед скобкой?', 'Let us build the two rules. First tell me: what exactly does a minus before the brackets change?'),
    A('rule', "To'g'ri. Ko'paytuvchi har bir qo'shiluvchiga ko'paytiriladi, minus har bir ishorani o'zgartiradi, plyus esa ishoralarga tegmaydi. Uchtasi ham darslikdagi qoidalar.", 'Верно. Множитель умножается на каждое слагаемое, минус меняет каждый знак, а плюс знаки не трогает. Все три из учебника.', 'Correct. The multiplier multiplies each term, the minus flips every sign, and the plus leaves the signs alone. All three are from the textbook.'),
  ],
}

function Screen8({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S8.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S8} screen={screen} audio={audio} solved={done} {...rest}>
      <RuleGate audio={audio}
        probe={S8.probe}
        rule={S8.rule}
        disabled={!canAnswer}
        onStep={(n) => audio.step(n)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'rule' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 9. MASHQ 1: uch bir xil topshiriq ketma-ket.
// Javob TANLANMAYDI, YIG'ILADI -- shu sababli kvotaga kirmaydi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  title: L('Qavslarni ochingiz', 'Раскройте скобки', 'Expand the brackets'),
  tasks: [
    {
      prompt: L("Bo'sh joylarni to'ldiring", 'Заполните пропуски', 'Fill in the blanks'),
      template: ['4(x + 2)', '  =  ', { slot: 0 }, 'x  +  ', { slot: 1 }],
      parts: [{ id: 'four', label: '4' }, { id: 'eight', label: '8' }, { id: 'two', label: '2' }, { id: 'six', label: '6' }],
      answer: ['four', 'eight'],
      wrongs: [
        { key: 'four|two', tag: 'Z1', hint: L("x o'rniga bir qo'ying: boshlang'ichda o'n ikki, sizda olti.", 'Подставь x = 1: у исходного двенадцать, у тебя шесть.', 'Put x = 1: the original gives twelve, yours gives six.') },
        { key: 'four|six', tag: 'Z1', hint: L("To'rtlik qo'shilmaydi, ko'paytiriladi.", 'Четвёрка не прибавляется, а умножает.', 'The four does not add, it multiplies.') },
        { key: '*', tag: 'Z1', hint: L("Ochib, son qo'yib solishtiring.", 'Раскрой и сравни, подставив число.', 'Expand it and compare by substituting a number.') },
      ],
      checkNote: 'x = 1:  4(1 + 2) = 12      4x + 8 = 12',
      done: '4(x + 2) = 4x + 8',
    },
    {
      prompt: L("Bo'sh joylarni to'ldiring", 'Заполните пропуски', 'Fill in the blanks'),
      template: ['2(m − 3)', '  =  ', { slot: 0 }, 'm  −  ', { slot: 1 }],
      parts: [{ id: 'two', label: '2' }, { id: 'six', label: '6' }, { id: 'three', label: '3' }, { id: 'five', label: '5' }],
      answer: ['two', 'six'],
      wrongs: [
        { key: 'two|three', tag: 'Z1', hint: L("Ikkilik uchlikka ham ko'paytiriladi.", 'Двойка умножается и на тройку тоже.', 'The two multiplies the three as well.') },
        { key: 'two|five', tag: 'Z1', hint: L("Ikki va uch qo'shilmaydi, ko'paytiriladi.", 'Два и три не складываются, а умножаются.', 'Two and three are multiplied, not added.') },
        { key: '*', tag: 'Z1', hint: L("m o'rniga bir qo'ying va ikki tomonni solishtiring.", 'Подставь m = 1 и сравни две записи.', 'Put m = 1 and compare the two expressions.') },
      ],
      checkNote: 'm = 1:  2(1 − 3) = −4      2m − 6 = −4',
      done: '2(m − 3) = 2m − 6',
    },
    {
      prompt: L("Diqqat: harf ikkinchi turibdi", 'Внимание: буква стоит второй', 'Note: the letter comes second'),
      template: ['5(3 + y)', '  =  ', { slot: 0 }, '  +  ', { slot: 1 }, 'y'],
      parts: [{ id: 'fifteen', label: '15' }, { id: 'five', label: '5' }, { id: 'eight', label: '8' }, { id: 'three', label: '3' }],
      answer: ['fifteen', 'five'],
      wrongs: [
        { key: 'fifteen|three', tag: 'Z1', hint: L("Beshlik y ga ham ko'paytiriladi.", 'Пятёрка умножается и на y тоже.', 'The five multiplies the y as well.') },
        { key: 'eight|five', tag: 'Z1', hint: L("Besh va uch ko'paytiriladi, qo'shilmaydi.", 'Пять и три умножаются, а не складываются.', 'Five and three are multiplied, not added.') },
        { key: '*', tag: 'Z1', hint: L("y o'rniga bir qo'ying: boshlang'ichda yigirma.", 'Подставь y = 1: у исходного двадцать.', 'Put y = 1: the original gives twenty.') },
      ],
      checkNote: 'y = 1:  5(3 + 1) = 20      15 + 5y = 20',
      done: '5(3 + y) = 15 + 5y',
    },
  ],
  audio: [
    A('mount', "Qavslarni ochingiz. Ko'paytuvchi har bir qo'shiluvchiga boradi.", 'Раскройте скобки. Множитель идёт к каждому слагаемому.', 'Expand the brackets. The multiplier goes to each term.'),
    A('t2', 'Yaxshi. Keyingisi.', 'Хорошо. Следующее.', 'Good. Next one.'),
    A('t3', "Oxirgisi. Diqqat: harf oldinda emas, orqada.", 'Последнее. Обрати внимание: буква стоит второй.', 'The last one. Note that the letter comes second.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S9.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  const task = S9.tasks[idx]

  const solved = (r) => {
    onAnswer({ ...r, screen, role: 'practice', part: 't' + (idx + 1) })
    if (idx + 1 < S9.tasks.length) {
      setTimeout(() => { setIdx(idx + 1); audio.step('t' + (idx + 2)) }, 1100)
      return
    }
    setDone(true)
  }

  return (
    <Frame meta={S9} screen={screen} audio={audio} solved={done} {...rest}>
      <Slot mh={22}>
        <div className="g7-eyebrow">
          <span>{t(task.prompt)}</span>
          <span className="g7-eyebrow-right">{idx + 1} / {S9.tasks.length}</span>
        </div>
      </Slot>
      {S9.tasks.slice(0, idx).map((prev, i) => (
        <DoneRow key={i}>{prev.done}</DoneRow>
      ))}
      <SlotFill audio={audio}
        key={idx}
        template={task.template}
        parts={task.parts}
        answer={task.answer}
        wrongs={task.wrongs}
        checkNote={task.checkNote}
        disabled={!canAnswer}
        onSolved={solved}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 10. MASHQ 2, YO'L KO'RSATILGAN: 2(a − 3) − (a − 7).
// Qadamlar nomlangan, qismni va amalni o'quvchi tanlaydi.
// ============================================================
const S10 = {
  eyebrow: L('RAZBOR', 'РАЗБОР', 'WORKED EXAMPLE'),
  title: L('Keyingi qadamni tanlang', 'Выбирайте следующий шаг', 'Choose the next step'),
  start: '2(a − 3) − (a − 7)',
  steps: [
    {
      parts: ['2(a − 3)', '−(a − 7)'],
      part: '2(a − 3)',
      action: 'open',
      to: '2a − 6 − (a − 7)',
      needPart: L("Avval qaysi qism bilan ishlayotganingizni tanlang.", 'Сначала выбери, с какой частью работаешь.', 'First choose which part you are working on.'),
      wrongs: [
        { action: 'collect', tag: 'Z6', hint: L("Qavs ichida hali qo'shiluvchilar bor. Avval qavs.", 'Внутри скобок ещё остались слагаемые. Сначала скобки.', 'There are still terms inside the brackets. Brackets first.') },
        { action: 'flip', tag: 'Z2', hint: L("Ishorani o'zi o'zgarmaydi: qavsni ochish kerak.", 'Знак сам не меняется: скобку надо раскрыть.', 'The sign does not change by itself: the bracket must be expanded.') },
        { action: 'move', hint: L("Bu tenglama emas, ifoda. Ko'chiradigan joy yo'q.", 'Это выражение, а не уравнение. Переносить некуда.', 'This is an expression, not an equation. There is nowhere to move it.') },
      ],
    },
    {
      parts: ['−(a − 7)'],
      part: '−(a − 7)',
      action: 'open',
      to: '2a − 6 − a + 7',
      wrongs: [
        { action: 'collect', tag: 'Z6', hint: L("Ikkinchi qavs hali ochilmagan.", 'Вторая скобка ещё не раскрыта.', 'The second bracket is not expanded yet.') },
        { action: 'flip', tag: 'Z2', hint: L("Minus har bir qo'shiluvchiga boradi, butun qavsga bir marta emas.", 'Минус идёт к каждому слагаемому, а не к скобке целиком.', 'The minus goes to each term, not to the bracket as a whole.') },
        { action: 'move', hint: L("Bu ifoda, ko'chirish kerak emas.", 'Это выражение, переносить не нужно.', 'This is an expression, no moving needed.') },
      ],
    },
    {
      parts: ['2a − a', '−6 + 7'],
      action: 'collect',
      to: 'a + 1',
      wrongs: [
        { action: 'open', hint: L('Qavs qolmadi.', 'Скобок больше нет.', 'There are no brackets left.') },
        { action: 'flip', hint: L("O'zgartiradigan qavs yo'q.", 'Скобки, у которой менять знак, уже нет.', 'There is no bracket left to flip.') },
        { action: 'move', hint: L("Bu ifoda, ko'chirish kerak emas.", 'Это выражение, переносить не нужно.', 'This is an expression, no moving needed.') },
      ],
    },
  ],
  footNote: 'a = 5:  2(5 − 3) − (5 − 7) = 6      a + 1 = 6',
  audio: [
    A('mount', "Uzun misolni ko'rib chiqamiz. Ikki qavs bor, ikkinchisining oldida minus.", 'Разберём длинный пример. Здесь две скобки, и перед второй стоит минус.', 'Let us work through a long example. There are two brackets, and the second has a minus before it.'),
    A('step2', "Yaxshi. Endi ikkinchi qavs.", 'Хорошо. Теперь вторая скобка.', 'Good. Now the second bracket.'),
    A('step3', "Qavslar tugadi. Endi o'xshashlarni qo'shamiz.", 'Скобки закончились. Теперь приводим подобные.', 'The brackets are done. Now collect like terms.'),
    A('step4', "Tekshirib ko'ring. a beshga teng bo'lganda ikki yozuv ham oltini beradi.", 'Проверь. При a, равном пяти, обе записи дают шесть.', 'Check it. When a equals five, both expressions give six.'),
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
      <Transform audio={audio}
        start={S10.start}
        steps={S10.steps}
        actions={ACTIONS}
        footNote={S10.footNote}
        disabled={!canAnswer}
        onStep={(n) => audio.step(n)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 11. MASHQ 3, ASBOBSIZ. Ekranda podstanovka ham, qadamba-qadam
// yozuv ham YO'Q: faqat o'quvchining o'zi qo'ygan ishoralari.
// Tekshiruv javob YOZILGANDAN keyin chiqadi.
// ============================================================
const S11 = {
  eyebrow: L("O'ZINGIZ", 'САМОСТОЯТЕЛЬНО', 'ON YOUR OWN'),
  title: L('Ishoralarni qo\'ying, yozuvlar teng bo\'lsin', 'Расставьте знаки так, чтобы записи были равны', 'Place the signs so the two sides are equal'),
  template: ['−(a − 7)', '  =  ', { slot: 0 }, 'a', { slot: 1 }, '7'],
  parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }],
  answer: ['minus', 'plus'],
  wrongs: [
    { key: 'minus|minus', tag: 'Z2', hint: L("a = 10 qo'ying: o'ngda minus o'n yetti, chapda esa minus uch.", 'Подставь a = 10: справа минус семнадцать, а слева минус три.', 'Put a = 10: the right side gives minus seventeen, the left minus three.') },
    { key: 'plus|minus', tag: 'Z2', hint: L("Qavs oldidagi minus qayerga ketdi?", 'Куда пропал минус, который стоял перед скобкой?', 'Where did the minus before the brackets go?') },
    { key: 'plus|plus', tag: 'Z5', hint: L("Qavsni shundaygina o'chirib bo'lmaydi. Son bilan tekshiring.", 'Скобки нельзя просто стереть. Проверь числом.', 'Brackets cannot simply be erased. Check with a number.') },
    { key: '*', tag: 'Z2', hint: L('Son bilan tekshiring: chap va o\'ng tomon bir xil bo\'lishi kerak.', 'Проверь числом: слева и справа должно получиться одно и то же.', 'Check with a number: both sides must give the same value.') },
  ],
  checkNote: L('a = 10  →  chapda −3,  o\'ngda −3', 'a = 10  →  слева −3,  справа −3', 'a = 10  →  left −3, right −3'),
  audio: [
    A('mount', "Endi o'zingiz, yordamchi asbobsiz. Ishoralarni shunday qo'ying, o'ng tomon chap tomonga teng bo'lsin.", 'Теперь сам, без вспомогательного прибора. Поставь знаки так, чтобы правая запись была равна левой.', 'Now on your own, with no helper tool. Place the signs so the right side equals the left.'),
    A('checked', "Bo'ldi. Tekshiruvni ko'rdingiz: ikki tomon ham minus uch.", 'Получилось. Проверку видишь: обе стороны дают минус три.', 'Done. You can see the check: both sides give minus three.'),
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
      <SlotFill audio={audio}
        template={S11.template}
        parts={S11.parts}
        answer={S11.answer}
        wrongs={S11.wrongs}
        checkNote={S11.checkNote}
        disabled={!canAnswer}
        onStep={(n) => audio.step(n)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 12. TUZOQ. Har bir qadam TO'G'RI ko'rinadi, javob esa xato,
// va xato qatordan keyingi qatorlar undan TO'G'RI kelib chiqadi --
// shuning uchun BIRINCHI xato qatorni izlash kerak.
// Qarshi misol sonini O'QUVCHI qo'yadi (§8.2): son qo'yilmaguncha
// topshiriq yopilmaydi. Audit yechilgach qatorlar o'rnini bo'shatadi.
// ============================================================
const S12 = {
  eyebrow: L('XATONI TOPING', 'НАЙДИТЕ ОШИБКУ', 'FIND THE MISTAKE'),
  title: L('Xato birinchi qaysi qatorda paydo bo\'ldi?', 'В какой строке ошибка появилась впервые?', 'In which line does the mistake first appear?'),
  rows: [
    { id: 'r1', text: '3(m − 2) − (m − 6)' },
    { id: 'r2', text: '3m − 6 − (m − 6)' },
    { id: 'r3', text: '3m − 6 − m − 6' },
    { id: 'r4', text: '2m − 12' },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu boshlang'ich ifoda, unda xato bo'lishi mumkin emas.", 'Это исходное выражение, ошибки в нём быть не может.', 'This is the original expression, it cannot contain a mistake.'),
    r2: L('Son qo\'yib tekshiring: bu qator hali to\'g\'ri.', 'Проверь подстановкой: эта строка пока верна.', 'Check by substituting: this line is still correct.'),
    r4: L("Bu qatorda o'xshashlar to'g'ri qo'shilgan, faqat xato yozuvdan. Xato oldin kelgan.", 'Здесь подобные приведены верно, но уже из неверной строки. Ошибка пришла раньше.', 'Here like terms are collected correctly, but from an incorrect line. The mistake came earlier.'),
  },
  tags: { r2: 'Z1', r4: 'Z6' },
  found: L('Birinchi xato qator: 3m − 6 − m − 6', 'Первая неверная строка: 3m − 6 − m − 6', 'First wrong line: 3m − 6 − m − 6'),
  subRows: [
    { id: 'l2', expr: '3m − 6 − (m − 6)', sub: (n) => '3·' + n + ' − 6 − (' + n + ' − 6)', val: (n) => 3 * n - 6 - (n - 6), role: 'source' },
    { id: 'l3', expr: '3m − 6 − m − 6', sub: (n) => '3·' + n + ' − 6 − ' + n + ' − 6', val: (n) => 3 * n - 6 - n - 6, role: 'candidate' },
  ],
  numbers: [1, 4],
  question: L('Ikki qator teng chiqdimi?', 'Две строки оказались равны?', 'Did the two lines turn out equal?'),
  okText: L(
    "Aynan. Sonlar ajralib ketdi -- demak xato shu qatorda tug'ildi.",
    'Именно. Числа разошлись, значит ошибка родилась в этой строке.',
    'Exactly. The values diverged, so the mistake was born in this line.',
  ),
  options: [
    { id: 'no', label: L('Teng emas', 'Не равны', 'Not equal'), correct: true },
    { id: 'yes', label: L('Teng', 'Равны', 'Equal'), tag: 'Z2', hint: L("O'ngdagi ikki songa qarang: ular bir xil emas.", 'Посмотри на два числа справа: они разные.', 'Look at the two values on the right: they are different.') },
  ],
  audio: [
    A('mount', "O'quvchi yechdi va xato qildi. Xato birinchi qaysi qatorda paydo bo'lganini toping. Har qanday xato qatorni emas, aynan BIRINCHISINI.", 'Ученик решил и ошибся. Найди строку, в которой ошибка появилась впервые. Не любую неверную, а именно первую.', 'A student solved it and made a mistake. Find the line where the mistake first appears. Not any wrong line, the first one.'),
    A('proof', "Endi buni o'zingiz isbotlang: m o'rniga son tanlang va ikki qatorni hisoblang.", 'Теперь докажи это сам: выбери число вместо m и посчитай две строки.', 'Now prove it yourself: choose a number for m and compute the two lines.'),
    A('sub', "Ikki qatorni birma-bir hisoblaymiz.", 'Считаем две строки по очереди.', 'We compute the two lines one by one.'),
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
  return (
    <Frame meta={S12} screen={screen} audio={audio} solved={done} {...rest}>
      {/* Audit yechilgach qatorlar KETADI: qarshi misol uchun joy ochiladi.
          Ikkisi birga 400px ga sig'maydi (§6.1: keyingi qadam almashtiradi). */}
      {!found ? (
        <AuditRows audio={audio}
          rows={S12.rows}
          answerId={S12.answerId}
          hints={S12.hints}
          tags={S12.tags}
          disabled={!canAnswer}
          onStep={(n) => audio.step(n)}
          onSolved={(r) => { setFound(true); onAnswer({ ...r, screen, role: 'trap', part: 'line' }) }}
        />
      ) : (
        <div className="g7-in">
          <DoneRow>{t(S12.found)}</DoneRow>
          <SubstituteRows audio={audio}
            rows={S12.subRows}
            numbers={S12.numbers}
            letter="m"
            question={S12.question}
            options={S12.options}
            okText={S12.okText}
            disabled={!canAnswer}
            onStep={(name) => audio.step(name)}
            onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'trap', part: 'proof' }) }}
          />
        </div>
      )}
    </Frame>
  )
}

// ============================================================
// EKRAN 13. TESKARI MASALA: 2x − 6 ni O'ZINGIZ yig'ing. Ikki topshiriq.
// ============================================================
const PARTS13 = [
  { id: 'two', label: '2' },
  { id: 'mtwo', label: '−2' },
  { id: 'x', label: 'x' },
  { id: 'three', label: '3' },
  { id: 'plus', label: '+' },
  { id: 'minus', label: '−' },
]

const S13 = {
  eyebrow: L("O'ZINGIZ YIG'ING", 'СОБЕРИТЕ САМИ', 'BUILD IT YOURSELF'),
  title: L('Natijasi 2x − 6 bo\'ladigan ifoda yig\'ing', 'Соберите выражение со скобками, равное 2x − 6', 'Build a bracketed expression equal to 2x − 6'),
  tasks: [
    {
      prompt: L("Qavsli ifoda yig'ing: 2x − 6", 'Собери выражение со скобками: 2x − 6', 'Build a bracketed expression: 2x − 6'),
      template: [{ slot: 0 }, '(', { slot: 1 }, { slot: 2 }, { slot: 3 }, ')'],
      answer: ['two', 'x', 'minus', 'three'],
      checkNote: L("2(x − 3) = 2x − 6  —  to'g'ri", '2(x − 3) = 2x − 6  —  верно', '2(x − 3) = 2x − 6  —  correct'),
      done: '2(x − 3)',
    },
    {
      prompt: L("Endi o'sha natijani ko'paytuvchi −2 bilan yig'ing", 'А теперь соберите то же самое, но с множителем −2', 'Now build the same result, but with multiplier −2'),
      template: [{ slot: 0 }, '(', { slot: 1 }, { slot: 2 }, { slot: 3 }, ')'],
      answer: ['mtwo', 'three', 'minus', 'x'],
      checkNote: L("−2(3 − x) = −6 + 2x = 2x − 6  —  to'g'ri", '−2(3 − x) = −6 + 2x = 2x − 6  —  верно', '−2(3 − x) = −6 + 2x = 2x − 6  —  correct'),
      done: '−2(3 − x)',
    },
  ],
  wrongs: [
    {
      key: 'two|x|plus|three',
      tag: 'Z2',
      hint: L(
        "Qavs ichida qanday ishora kerak, minus olti chiqishi uchun?",
        'Какой знак нужен внутри, чтобы получить минус шесть?',
        'Which sign is needed inside to get minus six?',
      ),
    },
    {
      key: 'mtwo|x|minus|three',
      tag: 'Z3',
      hint: L(
        "Ochib ko'ring: birinchi qo'shiluvchi minus ikki iks chiqdi, kerak esa plyus.",
        'Раскрой: первое слагаемое вышло минус два икс, а нужно плюс.',
        'Expand it: the first term came out as minus two x, but plus is needed.',
      ),
    },
    {
      key: '*',
      tag: 'Z3',
      hint: L(
        "Yig'ganingizni ochib, 2x − 6 bilan solishtiring.",
        'Раскрой то, что собрал, и сравни с 2x − 6.',
        'Expand what you built and compare it with 2x − 6.',
      ),
    },
  ],
  audio: [
    A('mount', "Teskari masala. Natija berilgan, unga olib keladigan qavsli ifodani yig'ing.", 'Обратная задача. Дан результат, собери выражение со скобками, которое к нему приводит.', 'An inverse task. The result is given, build a bracketed expression that leads to it.'),
    A('t2', "Endi o'shani ko'paytuvchi minus ikki bilan yig'ing. Qavs ichidagi tartibni ham o'zgartirish kerak bo'ladi.", 'А теперь то же самое, но множитель минус два. Придётся поменять и порядок внутри скобок.', 'Now the same, but with multiplier minus two. You will also need to change the order inside.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S13.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  const task = S13.tasks[idx]

  const solved = (r) => {
    onAnswer({ ...r, screen, role: 'transfer', part: 't' + (idx + 1) })
    if (idx + 1 < S13.tasks.length) {
      setTimeout(() => { setIdx(idx + 1); audio.step('t2') }, 1100)
      return
    }
    setDone(true)
  }

  return (
    <Frame meta={S13} screen={screen} audio={audio} solved={done} {...rest}>
      <Slot mh={26}>
        <div className="g7-eyebrow">
          <span>{t(task.prompt)}</span>
          <span className="g7-eyebrow-right">{idx + 1} / {S13.tasks.length}</span>
        </div>
      </Slot>
      {idx > 0 ? <DoneRow>{S13.tasks[0].done}</DoneRow> : null}
      <SlotFill audio={audio}
        key={idx}
        template={task.template}
        parts={PARTS13}
        answer={task.answer}
        wrongs={S13.wrongs}
        checkNote={task.checkNote}
        disabled={!canAnswer}
        onSolved={solved}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 14. BLITS: to'rt savol bitta panelda. DARSDAGI YAGONA
// BAHOLANADIGAN EKRAN (§8.5). Javob berilgan savol qatorga yig'iladi.
// To'rt savol darsning to'rt tegini tekshiradi: Z6, Z3, Z4, Z2.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L('To\'rt savol. Baho shu ekranda', 'Четыре вопроса. Оценка только здесь', 'Four questions. This is the only graded screen'),
  items: [
    {
      prompt: '4(x + 2) − 3x =',
      ok: L("Ha. 3x oldidagi minus to'rtta iksdan bittasini qoldirdi.", 'Да. Минус перед 3x оставил от четырёх иксов один.', 'Yes. The minus before 3x left one x out of four.'),
      items: [
        { id: 'a', label: 'x + 8', correct: true },
        { id: 'b', label: '7x + 8', tag: 'Z6', hint: L("3x oldida minus turadi. Unda 4x bilan nima qilamiz?", 'Перед 3x стоит минус. Что тогда делать с 4x?', 'There is a minus before 3x. So what do we do with 4x?') },
        { id: 'c', label: 'x + 5', tag: 'Z6', hint: L("Sakkiz harfsiz, 3x harfli. Ularni qo'shmaymiz.", 'Восьмёрка без буквы, 3x с буквой. Их не складывают.', 'The eight has no letter, 3x has one. They do not combine.') },
        { id: 'd', label: '8 − x', tag: 'Z6', hint: L("To'rt iks minus uch iks: nechta qoldi?", 'Четыре икса минус три икса: сколько осталось?', 'Four x minus three x: how many are left?') },
      ],
    },
    {
      prompt: '−2(a − 3) =',
      ok: L("To'g'ri. Minus ikki ikkisiga ham bordi, ishoralari bilan.", 'Верно. Минус два пошёл к обоим слагаемым, вместе со знаком.', 'Correct. The minus two went to both terms, sign included.'),
      items: [
        { id: 'a', label: '−2a + 6', correct: true },
        { id: 'b', label: '−2a − 6', tag: 'Z3', hint: L("Minus ikkini minus uchga ko'paytiring: natija musbat.", 'Умножь минус два на минус три: получится положительное.', 'Multiply minus two by minus three: the result is positive.') },
        { id: 'c', label: '2a − 6', tag: 'Z3', hint: L("Ko'paytuvchi minus ikki. a oldidagi ishora qanday bo'ladi?", 'Множитель это минус два. Какой знак будет перед a?', 'The multiplier is minus two. What sign will stand before a?') },
        { id: 'd', label: '−2a + 3', tag: 'Z1', hint: L("Ikkilik uchlikka ham ko'paytiriladi.", 'Двойка умножается и на тройку тоже.', 'The two multiplies the three as well.') },
      ],
    },
    {
      prompt: 'x + (y − 3) =',
      ok: L("Ha. Plyus turgan qavsda ishoralar o'zgarmaydi.", 'Да. Перед скобкой плюс, и знаки не меняются.', 'Yes. There is a plus before the brackets, so the signs stay.'),
      items: [
        { id: 'a', label: 'x + y − 3', correct: true },
        { id: 'b', label: 'x − y + 3', tag: 'Z4', hint: L("Qavs oldida plyus turibdi. Bu minus qoidasi.", 'Перед скобкой плюс. А это правило минуса.', 'There is a plus before the brackets. That is the minus rule.') },
        { id: 'c', label: 'x + y + 3', tag: 'Z4', hint: L("Qavs ichidagi minus o'z joyida qoladi.", 'Минус внутри скобок остаётся на своём месте.', 'The minus inside the brackets stays where it was.') },
        { id: 'd', label: 'x − y − 3', tag: 'Z4', hint: L("y ning oldida qavs ichida ishora yo'q, demak plyus.", 'Перед y внутри скобок знака нет, значит плюс.', 'Inside the brackets y has no sign, so it is a plus.') },
      ],
    },
    {
      prompt: '9 − (x − 4) =',
      ok: L("Aynan. Ikki ishora ham o'zgardi.", 'Именно. Оба знака изменились.', 'Exactly. Both signs changed.'),
      items: [
        { id: 'a', label: '9 − x + 4', correct: true },
        { id: 'b', label: '9 − x − 4', tag: 'Z2', hint: L("To'rtlikning ishorasi ham o'zgaradi. x o'rniga bir qo'ying.", 'Знак четвёрки тоже меняется. Подставь x = 1.', 'The sign of the four changes too. Put x = 1.') },
        { id: 'c', label: '9 + x − 4', tag: 'Z2', hint: L("x ning ishorasi ham o'zgaradi, faqat to'rtlikning emas.", 'Знак x тоже меняется, не только четвёрки.', 'The sign of x changes too, not only the four.') },
        { id: 'd', label: '9 + x + 4', tag: 'Z5', hint: L("Qavsni shundaygina o'chirib bo'lmaydi. Oldida minus turibdi.", 'Скобки нельзя просто стереть. Перед ними минус.', 'The brackets cannot just be erased. There is a minus before them.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits: to'rt savol. Bu darsdagi yagona baholanadigan ekran, shuning uchun shoshilmang.", 'Блиц: четыре вопроса. Это единственный оцениваемый экран урока, поэтому не спеши.', 'Quick round: four questions. This is the only graded screen of the lesson, so take your time.'),
    A('1', "Ikkinchisi: qavs oldida minus ikki.", 'Второй: перед скобкой минус два.', 'Second: a minus two before the brackets.'),
    A('2', "Uchinchisi: qavs oldida plyus.", 'Третий: перед скобкой плюс.', 'Third: a plus before the brackets.'),
    A('3', "Oxirgisi: qavs oldida minus.", 'Последний: перед скобкой минус.', 'The last one: a minus before the brackets.'),
  ],
}

// Tayyorlik darajasi: birinchi urinishdagi to'g'ri javoblar soni bo'yicha.
const levelOf = (firstTry, total) => {
  if (firstTry === null || firstTry === undefined) return 'none'
  if (firstTry >= total) return 'closed'
  if (firstTry === total - 1) return 'one'
  return 'back'
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
      <ProbeChain audio={audio}
        items={S14.items}
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
// EKRAN 15. YAKUN. Yangi matematika ham, yangi savol ham YO'Q.
// Chapda: prognoz va natija, tayyorlik darajasi SO'Z bilan, keyingi
// darsga ko'prik. O'ngda: «endi nima qila olaman», qaydlar, shpargalka.
// Maydon YASHIL. Foiz YO'Q.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  field: 'ok',
  title: L('Boshida nima deb taxmin qilgandingiz', 'Что вы предполагали в начале', 'What you predicted at the start'),
  recall: [
    { screen: 0, expr: '3(a + 5)', right: '3a + 15', map: { l: '3a + 15', r: '3a + 5', both: L('ikkisi ham', 'оба', 'both'), none: L('hech qaysi', 'ни одно', 'neither') } },
    { screen: 5, expr: '−(a − 7)', right: '−a + 7', map: { p1: '−a + 7', p2: '−a − 7', p3: 'a − 7', p4: '−a − 7 + 7' } },
  ],
  youLabel: L('siz:', 'ты:', 'you:'),
  noAnswer: L("javob yo'q", 'нет ответа', 'no answer'),
  ringLabel: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  ringSub: L('birinchi urinishda', 'с первой попытки', 'on the first try'),
  levels: {
    closed: L('Bu turdagi masalalar yopildi', 'Этот тип задач закрыт', 'This type of task is closed'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One thing needs a repeat'),
    back: L('8-ekrandagi qoidaga va 10-ekrandagi razborga qaytish kerak', 'Вернись к правилу на экране 8 и к разбору на экране 10', 'Go back to the rule on screen 8 and the worked example on screen 10'),
    none: L("Blits o'tilmadi", 'Блиц не пройден', 'The quick round was not taken'),
  },
  levelBadge: L('TAYYORLIK', 'ГОТОВНОСТЬ', 'READINESS'),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs a repeat'),
  noGap: L("Takrorlash kerak bo'lgan joy yo'q", 'Мест для повтора нет', 'Nothing needs a repeat'),
  canTitle: L('ENDI NIMA QILA OLAMAN', 'ЧТО Я ТЕПЕРЬ УМЕЮ', 'WHAT I CAN DO NOW'),
  can: [
    L("Qavs oldida ko'paytuvchi bo'lsa qavsni ocha olaman", 'Я раскрываю скобки, когда перед ними множитель', 'I expand brackets when a multiplier stands before them'),
    L("Minus bo'lsa har bir qo'shiluvchining ishorasini o'zgartiraman", 'При минусе я меняю знак каждого слагаемого', 'With a minus I flip the sign of every term'),
    L("Plyus ishoralarni o'zgartirmasligini bilaman", 'Я знаю, что плюс знаки не меняет', 'I know a plus changes no signs'),
    L("Har qanday yoyishni son qo'yib tekshiraman", 'Я проверяю любое раскрытие подстановкой числа', 'I check any expansion by substituting a number'),
  ],
  cheatTitle: L('Qavslarni ochish. Shpargalka', 'Раскрытие скобок. Шпаргалка', 'Expanding brackets. Cheat sheet'),
  cheatSteps: [
    'a(b + c) = ab + ac',
    'x + (y − z) = x + y − z',
    'x − (y − z) = x − y + z',
  ],
  cheatNote: L(
    "Shubhalansangiz: harf o'rniga son qo'yib, ikki yozuvni solishtiring.",
    'Если сомневаешься: подставь вместо буквы число и сравни две записи.',
    'If you are unsure: put a number for the letter and compare the two expressions.',
  ),
  source: L('Darslik: 4-paragraf 20-bet, 5-paragraf 23-bet', 'Учебник: § 4, стр. 20 и § 5, стр. 23', 'Textbook: § 4, p. 20 and § 5, p. 23'),
  motive: L(
    "Qavslarni ochish keyingi blokda kerak bo'ladi: qavsli tenglamani ochmasdan yechib bo'lmaydi.",
    'Раскрытие скобок понадобится в следующем блоке: уравнение со скобками без этого не решить.',
    'Expanding brackets is needed in the next block: an equation with brackets cannot be solved without it.',
  ),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgandingiz va mana qanday chiqdi.", 'Вернёмся к началу. Вот что ты предполагал и вот как оказалось.', 'Let us return to the start. This is what you predicted and this is how it turned out.'),
    A('level', "Taxminda xato qilish normal edi. Muhimi, blitsda nima chiqqani.", 'Ошибиться в догадке было нормально. Важно, что вышло в блице.', 'Being wrong in a guess was fine. What matters is how the quick round went.'),
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

  const labelFor = (item) => {
    const stored = (answers || []).filter((a) => a && a.screen === item.screen && a.correct === null)
    const picked = stored.length ? stored[stored.length - 1].picked : null
    const value = picked ? item.map[picked] : null
    return value ? tr(value, lang) : t(S15.noAnswer)
  }

  const gapLine = tags.length
    ? t(S15.gapPrefix) + ': ' + tags.map((code) => t(TAGS[code])).join(', ')
    : t(S15.noGap)

  const print = () => { if (typeof window !== 'undefined') window.print() }

  return (
    <Frame meta={S15} screen={screen} audio={audio} solved {...rest}>
      <Cols l={1.1} r={1} align="start">
        <Col>
          {S15.recall.map((item, i) => (
            <div key={i} className="g7-expr g7-expr-sm" style={{ display: 'flex', gap: 8, minHeight: 24, alignItems: 'center', flexWrap: 'wrap', textAlign: 'left' }}>
              <span style={{ minWidth: 80 }}>{item.expr}</span>
              <span style={{ color: T.ink2 }}>{t(S15.youLabel)} {labelFor(item)}</span>
              <span className="g7-ok-text">{item.right}</span>
            </div>
          ))}
          <Insight label={t(S15.levelBadge)} tone={level === 'closed' ? 'ok' : 'graph'}>
            {t(S15.levels[level])}. {gapLine}
          </Insight>
          <Hint>{t(S15.motive)}</Hint>
        </Col>
        <Col>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
            <RingProgress value={firstTry} total={total} label={t(S15.ringLabel)} sub={t(S15.ringSub)} size={98} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <Tag tone="quiet">{t(S15.canTitle)}</Tag>
              {S15.can.map((line, i) => (
                <span key={i} style={{ display: 'flex', gap: 6, fontSize: 12.5, lineHeight: 1.26, color: T.ink }}>
                  <span style={{ color: T.ok, fontWeight: 800, flexShrink: 0 }}>{'✓'}</span>
                  <span>{t(line)}</span>
                </span>
              ))}
            </div>
          </div>
          <NotesInline
            rows={2}
            extra={<Btn tone="soft" onClick={print} style={{ minHeight: 34, padding: '0 12px' }}>{t(UI.print)}</Btn>}
          />
        </Col>
      </Cols>
      {/* Ekranda KO'RINMAYDI, faqat chop etishda. */}
      <PrintSheet
        title={t(S15.cheatTitle)}
        law={S15.cheatSteps[0]}
        steps={S15.cheatSteps}
        lifehack={t(S15.cheatNote)}
        source={t(S15.source)}
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

export default function Grade7Dars05({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  aiGradingEndpoint,
  onFinished,
}) {
  const initial = langProp === 'uz' || langProp === 'ru' || langProp === 'en' ? langProp : 'uz'
  // Uch til TENG huquqli, shuning uchun almashtirgich yuqori panelda turadi
  // (11-sinf naqshi). Host tildan bersa ham, o'quvchi almashtira oladi.
  const [lang, setLang] = useState(initial)
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    aiGradingEndpoint: aiGradingEndpoint || '',
    studentName: studentName || '',
    voiceGender: voiceGender || 'm', // 7-sinf: erkak ovoz
    lessonId: LESSON_ID,             // qoralama kaliti shundan
    lessonNo: LESSON_NO,             // yuqori panelda «5-dars»
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
    else console.log('[Grade7 Dars05] onFinished', payload)
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
