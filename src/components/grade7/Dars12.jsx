// ============================================================================
// 7-sinf, Dars 12. TENGLAMA TUZISHGA DOIR MATNLI MASALALAR.
// (Текстовые задачи на составление линейных уравнений)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md. B2 blokining OXIRGI darsi.
//
// 11-DARSDAN FARQI, VA U ANIQ. U yerda ikkinchi kattalik birinchisiga
// KO'PAYTIRISH bilan bog'langandi («3 marta ko'p» -> 3x). Bu yerda boshqa
// bog'lanish: ularning YIG'INDISI ma'lum. Shunda ikkinchi kattalik ayirish
// bilan yoziladi: hammasi 40 bo'lsa va biri x bo'lsa, ikkinchisi 40 - x.
//
// ASOSIY XATO. O'quvchi ikkinchi kattalikka IKKINCHI HARF qo'yadi (x va y),
// va bitta tenglama bilan ikki noma'lumni yechib bo'lmaydi -- ish tugamaydi.
// Sistema esa 7-sinfning oxirida, boshqa bobda. Shuning uchun dars birinchi
// ekrandan aynan shuni ko'rsatadi: bitta harf yetadi.
//
// ASBOBLAR: `QuantityCard` (11-darsdan), `EquationBalance` (8-darsdan),
// qolganlari umumiy. Yangi asbob YOZILMADI.
//
// SONLAR. Darslikning aralashma masalasi ming so'mda va kasr bilan berilgan
// (0,50 va 0,30). Bu yerda o'sha masala SO'MDA olindi: 500 va 300, jami
// 16400. Matematikasi bir xil, arifmetikasi esa butun sonlarda -- 7-sinfda
// kasr koeffitsiyent yechimni emas, hisobni murakkablashtiradi.
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
  QuantityCard,
  RuleBuilder,
  SlotFill,
  StairsReveal,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_12'
const LESSON_TITLE = L('Tenglama tuzishga doir masalalar', 'Задачи на составление уравнений', 'Building equations from word problems')
const LESSON_NO = L('12-dars', 'Урок 12', 'Lesson 12')
const TOTAL = 15

const BLOCK = { label: L('B2-blok', 'Блок Б2', 'Block B2'), from: 7, to: 12, current: 12 }

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
  Z1: L('ikkinchi harf kiritildi', 'введена вторая буква', 'a second letter was introduced'),
  Z2: L('ayirish teskari yozildi', 'вычитание записано наоборот', 'the subtraction was reversed'),
  Z3: L('qavs ochilmadi', 'скобка не раскрыта', 'the bracket was not opened'),
  Z4: L('x javob deb olindi', 'x принят за ответ', 'x taken as the answer'),
  Z5: L("bog'lanish notogri", 'связь неверна', 'the link is wrong'),
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

const SEEDS = L('Kungaboqar, kg', 'Семечки, кг', 'Sunflower seeds, kg')
const CORN = L('Makkajo\'xori, kg', 'Кукуруза, кг', 'Corn, kg')
const SEEDS_SUM = L('Kungaboqar narxi', 'Стоимость семечек', 'Cost of the seeds')
const CORN_SUM = L('Makkajo\'xori narxi', 'Стоимость кукурузы', 'Cost of the corn')

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
// EKRAN 1. XUK. Ikki harf va bitta harf. Tablolarda HARFLAR SONI.
// ============================================================
const S1 = {
  eyebrow: L('IKKI KATTALIK, BITTA HARF', 'ДВЕ ВЕЛИЧИНЫ, ОДНА БУКВА', 'TWO QUANTITIES, ONE LETTER'),
  noBack: true,
  noNotes: true,
  title: L('Ikkita harf kerakmi', 'Нужны ли две буквы', 'Are two letters needed'),
  gate: {
    source: { kind: 'plain', tokens: [L('jami', 'всего', 'total'), '40', L('kg', 'кг', 'kg')] },
    rows: [
      { tokens: ['x', ',', 'y'], value: '2' },
      { tokens: ['x', ',', '40', '−', 'x'], value: '1' },
    ],
  },
  probe: {
    question: L(
      "Aralashmada 40 kg. Tablolarda ishlatilgan HARFLAR soni. Kim masalani yecha oladi?",
      'В смеси 40 кг. На табло число использованных БУКВ. Кто сможет решить задачу?',
      'The mix is 40 kg. The boards show how many LETTERS were used. Who can solve the problem?',
    ),
    items: [
      {
        id: 'one',
        label: L(
          "Bitta harf ishlatgani: ikkinchi kattalik 40 ayirish x",
          'Тот, кто взял одну букву: вторая величина это 40 минус x',
          'The one with a single letter: the second quantity is 40 minus x',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Buni jadvalda tekshiramiz.",
          'Прогноз принят. Проверим это в таблице.',
          'Your prediction is taken. We will check it in the table.',
        ),
      },
      {
        id: 'two',
        label: L(
          "Ikkita harf ishlatgani: har kattalikka o'z harfi",
          'Тот, кто взял две буквы: каждой величине своя',
          'The one with two letters: a letter for each quantity',
        ),
        hint: L(
          "Ikkita harf bo'lsa ikkita tenglama kerak. Bizda esa bitta shart bor.",
          'Две буквы потребуют двух уравнений. А условие у нас одно.',
          'Two letters need two equations. We have one condition.',
        ),
      },
      {
        id: 'both',
        label: L('Ikkalasi ham yecha oladi', 'Оба смогут', 'Both can'),
        hint: L(
          "Ikkinchisi 40 kg shartini ISHLATMAGAN, u shunchaki ikki harf qo'ygan. Shart esa ishlatilishi kerak.",
          'Второй не ИСПОЛЬЗОВАЛ условие про 40 кг, он просто поставил две буквы. А условие должно работать.',
          'The second one never USED the 40 kg condition, only placed two letters. The condition must be used.',
        ),
      },
      {
        id: 'none',
        label: L("Ikkalasi ham yecholmaydi", 'Оба не смогут', 'Neither can'),
        hint: L(
          "Bittasi yecha oladi: unda bitta harf va bitta tenglama bor.",
          'Один сможет: у него одна буква и одно уравнение.',
          'One of them can: one letter and one equation.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "O'n birinchi darsda ikkinchi kattalik ko'paytirish bilan bog'langandi. Bugun boshqa bog'lanish.", 'В одиннадцатом уроке вторая величина связывалась умножением. Сегодня связь другая.', 'In lesson eleven the second quantity was linked by multiplying. Today the link is different.'),
    A('mount', "Aralashmada ikki xil narsa bor va ularning umumiy massasi ma'lum: qirq kilogramm.", 'В смеси два продукта, и их общая масса известна: сорок килограммов.', 'The mix has two things and their total mass is known: forty kilograms.'),
    A('mount', "Ikki o'quvchi ikki xil yo'l tanladi. Tabloda ular ishlatgan harflar soni turibdi.", 'Два ученика выбрали разные пути. На табло число букв, которые они использовали.', 'Two students chose different paths. The boards show how many letters each used.'),
    A('mount', "Sizningcha kim yecha oladi. Bu taxmin, uning uchun baho yo'q.", 'Как думаешь, кто сможет решить. Это прогноз, оценки за него нет.', 'Who do you think can solve it. This is a prediction, it is not graded.'),
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
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      prompt: '40 − 22',
      ok: L("Qolgan qism ayirish bilan topiladi.", 'Остаток находят вычитанием.', 'The rest is found by subtracting.'),
      items: [
        { id: 'a', label: '18', correct: true },
        { id: 'b', label: '62', tag: 'Z2', hint: L("62 bu 40 qo'shuv 22. Belgi ayirish.", '62 это 40 плюс 22. Знак вычитание.', '62 is 40 plus 22. The sign is a minus.') },
        { id: 'c', label: '28', tag: 'Z2', hint: L("40 dan 22 ni ayirsak 18 qoladi, 28 emas.", 'Если из 40 вычесть 22, останется 18, а не 28.', 'Taking 22 from 40 leaves 18, not 28.') },
        { id: 'd', label: '22', tag: 'Z2', hint: L("22 bu ayiriladigan son, natija emas.", '22 это вычитаемое, а не результат.', '22 is what is taken away, not the result.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Jami 40 kg. Biri x kg bo'lsa, ikkinchisi necha kg?",
        'Всего 40 кг. Если одного x кг, сколько второго?',
        'Forty kg in all. If one is x kg, how much is the other?',
      ),
      ok: L("Umumiy massadan birinchisini ayiramiz.", 'Из общей массы вычитаем первую.', 'Take the first away from the total.'),
      items: [
        { id: 'a', label: '40 − x', correct: true },
        { id: 'b', label: 'x − 40', tag: 'Z2', hint: L("Bu manfiy chiqadi: x qirqdan kichik. Ayirishda tartib muhim.", 'Это выйдет отрицательным: x меньше сорока. В вычитании порядок важен.', 'That comes out negative: x is less than forty. Order matters in subtraction.') },
        { id: 'c', label: '40 + x', tag: 'Z2', hint: L("Qo'shsak, jami qirqdan ko'p bo'lib ketadi.", 'Если прибавить, всего станет больше сорока.', 'Adding would make the total more than forty.') },
        { id: 'd', label: 'y', tag: 'Z1', hint: L("Yangi harf shartni ishlatmaydi. Qirq kilogramm shartda berilgan, uni ishlatish kerak.", 'Новая буква не использует условие. Сорок килограммов даны, их надо использовать.', 'A new letter ignores the condition. The forty kg is given and must be used.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Bir kilogrammi 300 so'm. 18 kg necha so'm?",
        'Килограмм стоит 300 сумов. Сколько стоят 18 кг?',
        'A kilogram costs 300 sums. What do 18 kg cost?',
      ),
      ok: L("Narx massaga ko'paytiriladi.", 'Цену умножают на массу.', 'The price is multiplied by the mass.'),
      items: [
        { id: 'a', label: '5400', correct: true },
        { id: 'b', label: '318', tag: 'Z5', hint: L("318 bu 300 qo'shuv 18. Narx massaga KO'PAYTIRILADI.", '318 это 300 плюс 18. Цену УМНОЖАЮТ на массу.', '318 is 300 plus 18. The price is MULTIPLIED by the mass.') },
        { id: 'c', label: '282', tag: 'Z5', hint: L("282 bu 300 ayirish 18. Belgi ko'paytirish.", '282 это 300 минус 18. Знак умножение.', '282 is 300 minus 18. The sign is a times.') },
        { id: 'd', label: '540', tag: 'Z6', hint: L("Nol tushib qolgan: 3 karra 18 bu 54, demak 300 karra 18 bu 5400.", 'Потерян нуль: 3 умножить на 18 это 54, значит 300 на 18 это 5400.', 'A zero is missing: 3 times 18 is 54, so 300 times 18 is 5400.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta savolga javob beramiz.", 'Ответим на три вопроса.', 'Let us answer three questions.'),
    A('1', "Ikkinchisi bugungi darsning kaliti.", 'Второе это ключ сегодняшнего урока.', 'The second is the key to today.'),
    A('2', "Uchinchisi.", 'Третье.', 'Third.'),
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
// EKRAN 3. TUSHUNTIRISH 1. MASSALAR JADVALI. Ikkinchi qator x orqali.
// ============================================================
const S3 = {
  eyebrow: L('MASSALAR', 'МАССЫ', 'THE MASSES'),
  title: L("Ikkinchi qatorni x orqali yozamiz", 'Вторую строку пишем через x', 'The second row is written through x'),
  task: L(
    "40 kg aralashma: kungaboqar urug'i va makkajo'xori.",
    'Смесь 40 кг: семечки и кукуруза.',
    'A 40 kg mix: sunflower seeds and corn.',
  ),
  rows: [
    { id: 'seeds', cap: SEEDS, expr: 'x' },
    { id: 'corn', cap: CORN },
  ],
  template: ['x  ,  ', { slot: 0 }],
  parts: [
    { id: 'p40x', label: '40 − x' },
    { id: 'px40', label: 'x − 40' },
    { id: 'py', label: 'y' },
    { id: 'p40', label: '40' },
  ],
  answer: ['p40x'],
  prompt: L(
    "Kungaboqar x kg. Makkajo'xori necha kg?",
    'Семечек x кг. Сколько килограммов кукурузы?',
    'The seeds are x kg. How many kilograms of corn?',
  ),
  checkNote: L(
    "Jadval to'ldi va unda bitta harf bor",
    'Таблица заполнена, и в ней одна буква',
    'The table is full and it has a single letter',
  ),
  wrongs: [
    { key: 'py', tag: 'Z1', hint: L("Yangi harf 40 kg shartini ishlatmaydi, va bitta tenglama yetmay qoladi.", 'Новая буква не использует условие про 40 кг, и одного уравнения не хватит.', 'A new letter ignores the 40 kg condition and one equation will not be enough.') },
    { key: 'px40', tag: 'Z2', hint: L("x qirqdan kichik, demak x ayirish 40 manfiy chiqadi. Massa manfiy bo'lmaydi.", 'x меньше сорока, значит x минус 40 выйдет отрицательным. Масса не бывает отрицательной.', 'x is less than forty, so x minus 40 is negative. A mass is never negative.') },
    { key: '*', tag: 'Z2', hint: L("Umumiy massadan kungaboqarni ayiring.", 'Вычти семечки из общей массы.', 'Take the seeds away from the total mass.') },
  ],
  audio: [
    A('mount', "Jadvalning birinchi qatori tayyor: kungaboqar x kilogramm.", 'Первая строка таблицы готова: семечек x килограммов.', 'The first row is ready: the seeds are x kilograms.'),
    A('mount', "Ikkinchi qatorni to'ldiring.", 'Заполни вторую строку.', 'Fill in the second row.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S3.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const rows = S3.rows.map((r) => ({ ...r, expr: r.id === 'corn' ? (done ? '40 − x' : null) : r.expr }))
  return (
    <Frame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      <Hint>{t(S3.task)}</Hint>
      <QuantityCard rows={rows} mark="seeds" />
      <SlotFill
        audio={audio}
        template={S3.template}
        parts={S3.parts}
        answer={S3.answer}
        prompt={S3.prompt}
        checkNote={S3.checkNote}
        wrongs={S3.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2. NARXLAR. Har qatorning narxi massaga ko'paytma.
// ============================================================
const S4 = {
  eyebrow: L('NARXLAR', 'СТОИМОСТЬ', 'THE COST'),
  title: L("Har qatorning narxi", 'Стоимость каждой строки', 'The cost of each row'),
  task: L(
    "Kungaboqar 500 so'm/kg, makkajo'xori 300 so'm/kg.",
    'Семечки по 500 сум/кг, кукуруза по 300.',
    'Seeds at 500 a kg, corn at 300.',
  ),
  rounds: [
    {
      template: ['x  →  ', { slot: 0 }],
      parts: [{ id: 'a', label: '500x' }, { id: 'b', label: '500 + x' }, { id: 'c', label: 'x : 500' }, { id: 'd', label: '500' }],
      answer: ['a'],
      prompt: L(
        "Kungaboqar 500 so'm/kg. x kg necha so'm?",
        'Семечки по 500 сум/кг. Сколько стоят x кг?',
        'Seeds at 500 a kg. What do x kg cost?',
      ),
      checkNote: L("Narx massaga ko'paytiriladi", 'Цену умножают на массу', 'The price is multiplied by the mass'),
      wrongs: [
        { key: 'b', tag: 'Z5', hint: L("Qo'shish emas, ko'paytirish: har kilogramm uchun 500 so'm.", 'Не сложение, а умножение: за каждый килограмм 500 сумов.', 'Not adding but multiplying: 500 sums for each kilogram.') },
        { key: '*', tag: 'Z5', hint: L("Massani narxga ko'paytiring.", 'Умножь массу на цену.', 'Multiply the mass by the price.') },
      ],
    },
    {
      template: ['40 − x  →  ', { slot: 0 }],
      parts: [{ id: 'e', label: '300(40 − x)' }, { id: 'f', label: '300 − x' }, { id: 'g', label: '300 · 40 − x' }, { id: 'h', label: '300x' }],
      answer: ['e'],
      prompt: L(
        "Makkajo'xori 300 so'm/kg. 40 ayirish x kg necha so'm?",
        'Кукуруза по 300 сум/кг. Сколько стоят 40 минус x кг?',
        'Corn at 300 a kg. What do 40 minus x kg cost?',
      ),
      checkNote: L("Butun massa 300 ga ko'paytiriladi, shuning uchun qavs kerak", 'Вся масса умножается на 300, поэтому нужна скобка', 'The whole mass is multiplied by 300, so a bracket is needed'),
      wrongs: [
        { key: 'g', tag: 'Z3', hint: L("Qavssiz yozuv boshqa narsani bildiradi: 300 faqat qirqqa ko'paytiriladi. Butun massa ko'paytirilishi kerak.", 'Запись без скобки значит другое: 300 умножается только на сорок. А умножить надо всю массу.', 'Without the bracket it means something else: 300 times forty only. The whole mass must be multiplied.') },
        { key: 'h', tag: 'Z5', hint: L("300x bu x kilogrammning narxi. Makkajo'xori esa 40 ayirish x kilogramm.", '300x это стоимость x килограммов. А кукурузы 40 минус x килограммов.', '300x is the cost of x kilograms. But the corn is 40 minus x kilograms.') },
        { key: '*', tag: 'Z3', hint: L("Massa qavs ichida turadi, narx esa qavs oldida.", 'Масса стоит в скобке, а цена перед скобкой.', 'The mass goes inside the bracket, the price in front of it.') },
      ],
    },
  ],
  audio: [
    A('mount', "Jadvalga yana ikki qator qo'shiladi: har birining narxi.", 'В таблицу добавятся ещё две строки: стоимость каждого.', 'Two more rows join the table: the cost of each.'),
    A('r1', "Ikkinchisi. Diqqat: massa qavs ichida.", 'Второе. Внимание: масса в скобке.', 'Second. Careful: the mass is in a bracket.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S4.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const done = idx >= S4.rounds.length
  const r = S4.rounds[idx]
  const rows = [
    { id: 'sc', cap: SEEDS_SUM, expr: idx > 0 ? '500x' : null },
    { id: 'cc', cap: CORN_SUM, expr: done ? '300(40 − x)' : null },
  ]
  return (
    <Frame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
      <QuantityCard rows={rows} />
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
// EKRAN 5. TUSHUNTIRISH 3. TENGLAMA va QAVSNI OCHISH. Tarozi qavsni
// ochmaydi (5-dars qoidasi), shuning uchun bu ekranda u yo'q.
// ============================================================
const S5 = {
  eyebrow: L('QAVSNI OCHAMIZ', 'РАСКРЫВАЕМ СКОБКУ', 'OPENING THE BRACKET'),
  title: L("Ikki narx birga 16 400 so'm", 'Две стоимости вместе 16 400 сумов', 'The two costs together are 16,400 sums'),
  expr: '500x + 300(40 − x) = 16 400',
  rounds: [
    {
      template: ['500x + ', { slot: 0 }, ' − ', { slot: 1 }, ' = 16 400'],
      parts: [{ id: 'a', label: '12 000' }, { id: 'b', label: '300x' }, { id: 'c', label: '340' }, { id: 'd', label: '300' }],
      answer: ['a', 'b'],
      prompt: L(
        "Qavsni ochish uchun 300 ni har bir hadga ko'paytiring.",
        'Чтобы раскрыть скобку, умножь 300 на каждое слагаемое.',
        'To open the bracket, multiply 300 by each term.',
      ),
      checkNote: L("300 karra 40 bu 12 000, 300 karra x bu 300x", '300 умножить на 40 это 12 000, а 300 на x это 300x', '300 times 40 is 12,000 and 300 times x is 300x'),
      wrongs: [
        { key: 'c|b', tag: 'Z3', hint: L("340 bu 300 qo'shuv 40. Qavsni ochishda KO'PAYTIRILADI.", '340 это 300 плюс 40. При раскрытии скобки УМНОЖАЮТ.', '340 is 300 plus 40. Opening a bracket means MULTIPLYING.') },
        { key: '*', tag: 'Z3', hint: L("Ikkala hadga ham 300 ni ko'paytiring: qirqqa va x ga.", 'Умножь на 300 оба слагаемых: сорок и x.', 'Multiply both terms by 300: the forty and the x.') },
      ],
    },
    {
      template: [{ slot: 0 }, ' + 12 000 = 16 400'],
      parts: [{ id: 'e', label: '200x' }, { id: 'f', label: '800x' }, { id: 'g', label: '200' }, { id: 'h', label: '−200x' }],
      answer: ['e'],
      prompt: L(
        "O'xshash hadlarni ixchamlang: 500x ayirish 300x.",
        'Приведи подобные: 500x минус 300x.',
        'Collect like terms: 500x minus 300x.',
      ),
      checkNote: L("Koeffitsiyentlar ayiriladi, harf umumiy qoladi", 'Коэффициенты вычитают, буква остаётся общей', 'The coefficients subtract and the letter stays'),
      wrongs: [
        { key: 'f', tag: 'Z6', hint: L("800 bu 500 qo'shuv 300. Ikkinchi hadning oldida MINUS turibdi.", '800 это 500 плюс 300. Перед вторым слагаемым МИНУС.', '800 is 500 plus 300. There is a MINUS before the second term.') },
        { key: '*', tag: 'Z6', hint: L("500 dan 300 ni ayiring, harf esa saqlanadi.", 'Вычти из 500 триста, буква сохраняется.', 'Take 300 from 500, the letter stays.') },
      ],
    },
  ],
  audio: [
    A('mount', "Ikki narx birga aralashmaning narxini beradi. Tenglama tayyor, lekin unda qavs bor.", 'Две стоимости вместе дают цену смеси. Уравнение готово, но в нём скобка.', 'The two costs together give the price of the mix. The equation is ready but it has a bracket.'),
    A('r1', "Qavs ochildi. Endi o'xshash hadlarni ixchamlang.", 'Скобка раскрыта. Теперь приведи подобные.', 'The bracket is open. Now collect like terms.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S5.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const done = idx >= S5.rounds.length
  const r = S5.rounds[idx]
  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <div className="g7-eqb-lone"><Fx>{S5.expr}</Fx></div>
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
      ) : <DoneRow>200x + 12 000 = 16 400</DoneRow>}
    </Frame>
  )
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4. TAROZI. Tanish ish.
// ============================================================
const S6 = {
  eyebrow: L('TAROZI', 'ВЕСЫ', 'THE BALANCE'),
  title: L("Tanish tenglama qoldi", 'Осталось знакомое уравнение', 'A familiar equation is left'),
  start: { a: 200, b: 12000, c: 16400 },
  actions: [
    { id: 's', kind: 'sub', n: 12000, label: '−12 000' },
    { id: 'd', kind: 'div', n: 200, label: ':200' },
    { id: 'a', kind: 'add', n: 12000, label: '+12 000', tag: 'Z6', hint: L("Qo'shsak, chapda 24 000 paydo bo'ladi. Uni YO'QOTISH kerak.", 'Если прибавить, слева появится 24 000. А его надо УБРАТЬ.', 'Adding makes 24,000 on the left. It has to GO.') },
    { id: 'd4', kind: 'div', n: 40, label: ':40', tag: 'Z6', hint: L("Qirqqa bo'lsak, koeffitsiyent besh bo'ladi, bir emas. Koeffitsiyent 200 ga bo'linadi.", 'При делении на сорок коэффициент станет пятёркой, а не единицей. Делить надо на 200.', 'Dividing by forty makes the coefficient five, not one. Divide by 200.') },
  ],
  done: L("x teng 22. Bu kungaboqarning massasi.", 'x = 22. Это масса семечек.', 'x = 22. That is the mass of the seeds.'),
  audio: [
    A('mount', "Qavs ochildi, hadlar ixchamlandi. Qolgan ish tanish: tarozi.", 'Скобка раскрыта, подобные приведены. Осталось знакомое: весы.', 'The bracket is open, like terms collected. What is left is familiar: the balance.'),
    A('step2', "Endi koeffitsiyent qoldi.", 'Теперь остался коэффициент.', 'Now the coefficient is left.'),
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
    </Frame>
  )
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5. SAVOLGA QAYTISH -- ikkita javob so'ralgan.
// ============================================================
const S7 = {
  eyebrow: L('IKKI JAVOB', 'ДВА ОТВЕТА', 'TWO ANSWERS'),
  title: L("Savol ikkala mahsulot haqida edi", 'Вопрос был про оба продукта', 'The question asked about both'),
  template: ['40 − 22 = ', { slot: 0 }],
  parts: [
    { id: 'p18', label: '18' },
    { id: 'p22', label: '22' },
    { id: 'p62', label: '62' },
    { id: 'p40', label: '40' },
  ],
  answer: ['p18'],
  prompt: L(
    "Kungaboqar 22 kg. Makkajo'xori necha kg?",
    'Семечек 22 кг. Сколько килограммов кукурузы?',
    'The seeds are 22 kg. How many kilograms of corn?',
  ),
  checkNote: L(
    "Tekshiruv: 22 karra 500 bu 11 000, 18 karra 300 bu 5 400, jami 16 400",
    'Проверка: 22 на 500 это 11 000, 18 на 300 это 5 400, вместе 16 400',
    'Check: 22 times 500 is 11,000, 18 times 300 is 5,400, together 16,400',
  ),
  wrongs: [
    { key: 'p22', tag: 'Z4', hint: L("22 bu kungaboqar. Makkajo'xori qolgan qism.", '22 это семечки. Кукуруза это остаток.', '22 is the seeds. The corn is what is left.') },
    { key: '*', tag: 'Z2', hint: L("Umumiy massadan kungaboqarni ayiring.", 'Вычти семечки из общей массы.', 'Take the seeds from the total mass.') },
  ],
  audio: [
    A('mount', "Tenglama bitta sonni berdi, savol esa ikkala mahsulot haqida edi.", 'Уравнение дало одно число, а вопрос был про оба продукта.', 'The equation gave one number, but the question asked about both.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S7.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const rows = [
    { id: 'seeds', cap: SEEDS, expr: '22' },
    { id: 'corn', cap: CORN, expr: done ? '18' : '40 − x' },
  ]
  return (
    <Frame meta={S7} screen={screen} audio={audio} solved={done} {...rest}>
      <QuantityCard rows={rows} answer={done ? 'corn' : null} />
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
    { id: 'f1', label: L("bir kattalikni x deb olamiz", 'одну величину берём за x', 'take one quantity as x') },
    { id: 'f2', label: L("yig'indi ma'lum bo'lsa, ikkinchisi ayirish bilan", 'если сумма известна, вторая через вычитание', 'if the total is known, the other comes by subtracting') },
    { id: 'f3', label: L("shartdan tenglama tuzamiz", 'из условия составляем уравнение', 'build the equation from the condition') },
    { id: 'f4', label: L("yechib, hamma so'ralgan kattalikni yozamiz", 'решив, записываем все спрошенные величины', 'solve, then report every quantity asked for') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval harf, keyin ikkinchi kattalik, keyin tenglama, oxirida javob.",
    'Порядок нарушен. Сначала буква, потом вторая величина, потом уравнение, в конце ответ.',
    'The order is off. The letter first, then the other quantity, then the equation, and the answer last.',
  ),
  lawChips: [
    { label: 'x', tone: 'par' },
    { label: 'S − x', tone: 's1' },
    { label: '=', tone: 's2' },
    { label: '→ ?', tone: 'off' },
  ],
  lawSweep: L(
    "harf, qolgan qism, tenglama, javob",
    'буква, остаток, уравнение, ответ',
    'letter, remainder, equation, answer',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ikki kattalikning yig'indisi ma'lum bo'lsa, birini x deb olib, ikkinchisini yig'indidan x ni ayirib yozamiz. Ikkinchi harf kerak emas.",
        'Если известна сумма двух величин, одну берут за x, а вторую записывают как сумма минус x. Вторая буква не нужна.',
        'When the total of two quantities is known, one is taken as x and the other written as the total minus x. No second letter is needed.',
      ),
      L(
        "Savol bir necha kattalik haqida bo'lsa, ularning hammasi yoziladi: x topilgach qolganlari o'z ifodasidan hisoblanadi.",
        'Если вопрос про несколько величин, записывают все: найдя x, остальные считают по их выражениям.',
        'If the question covers several quantities, all of them are reported: once x is found the rest come from their expressions.',
      ),
    ],
  },
  hookCap: L(
    "Bitta harf butun masalani ushlab turadi",
    'Одна буква держит всю задачу',
    'A single letter holds the whole problem',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("ikkinchi harf kerak emas", 'вторая буква не нужна', 'no second letter'),
    L("qavsni ochishni unutmang", 'не забудь раскрыть скобку', 'do not forget the bracket'),
    L("hamma so'ralganni yozing", 'запиши всё спрошенное', 'report everything asked'),
  ],
  audio: [
    A('mount', "Masala yechildi. Endi qadamlarni tartibga solamiz.", 'Задача решена. Теперь расставим шаги по порядку.', 'The problem is solved. Now let us order the steps.'),
    A('ok', "To'g'ri. Bu blokning oxirgi qoidasi.", 'Верно. Это последнее правило блока.', 'Correct. This is the last rule of the block.'),
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
// EKRAN 9. MASHQ 1. HARAKAT. Ikki velosipedchi qarama-qarshi yo'lda.
// ============================================================
const S9 = {
  eyebrow: L('HARAKAT', 'ДВИЖЕНИЕ', 'MOTION'),
  title: L('Ikki velosipedchi', 'Два велосипедиста', 'Two cyclists'),
  task: L(
    "Ular 60 km masofadan bir-biriga qarab yo'lga chiqdi: 12 km/h va 18 km/h.",
    'Они выехали навстречу с расстояния 60 км: 12 км/ч и 18 км/ч.',
    'They set out towards each other from 60 km apart: 12 km/h and 18 km/h.',
  ),
  rounds: [
    {
      template: ['12t + 18t = ', { slot: 0 }],
      parts: [{ id: 'a', label: '60' }, { id: 'b', label: '30' }, { id: 'c', label: '2' }, { id: 'd', label: '6' }],
      answer: ['a'],
      prompt: L(
        "Ikki velosipedchi 60 km dan bir-biriga qarab chiqdi: 12 va 18 km/h. Tenglamani tugating.",
        'Два велосипедиста выехали навстречу с 60 км: 12 и 18 км/ч. Заверши уравнение.',
        'Two cyclists set out towards each other from 60 km: 12 and 18 km/h. Finish the equation.',
      ),
      checkNote: L("30t teng 60, demak t teng 2", '30t = 60, значит t = 2', '30t = 60, so t = 2'),
      wrongs: [
        { key: 'c', tag: 'Z4', hint: L("Ikki bu javob, u hali topilmagan. Tenglamada shartdagi son turadi.", 'Два это ответ, он ещё не найден. В уравнении стоит число из условия.', 'Two is the answer, not yet found. The equation takes the number from the condition.') },
        { key: '*', tag: 'Z5', hint: L("Shartda bitta masofa bor: oltmish kilometr.", 'В условии одно расстояние: шестьдесят километров.', 'The condition gives one distance: sixty kilometres.') },
      ],
    },
    {
      template: ['t = ', { slot: 0 }],
      parts: [{ id: 'e', label: '2' }, { id: 'f', label: '30' }, { id: 'g', label: '60' }, { id: 'h', label: '5' }],
      answer: ['e'],
      prompt: L(
        "Necha soatdan keyin uchrashadi?",
        'Через сколько часов они встретятся?',
        'After how many hours do they meet?',
      ),
      checkNote: L("Tekshiruv: 12 karra 2 bu 24, 18 karra 2 bu 36, jami 60", 'Проверка: 12 на 2 это 24, 18 на 2 это 36, вместе 60', 'Check: 12 times 2 is 24, 18 times 2 is 36, together 60'),
      wrongs: [
        { key: 'f', tag: 'Z4', hint: L("O'ttiz bu ikkalasining birlashgan tezligi, vaqt emas.", 'Тридцать это их общая скорость, а не время.', 'Thirty is their combined speed, not the time.') },
        { key: '*', tag: 'Z6', hint: L("Oltmishni o'ttizga bo'ling.", 'Раздели шестьдесят на тридцать.', 'Divide sixty by thirty.') },
      ],
    },
  ],
  audio: [
    A('mount', "Aralashma tugadi. Endi harakat: bu ham bitta harf bilan yechiladi.", 'Со смесью закончили. Теперь движение: оно тоже решается одной буквой.', 'The mix is done. Now motion: it also takes a single letter.'),
    A('r1', "Tenglama tayyor. Javobni toping.", 'Уравнение готово. Найди ответ.', 'The equation is ready. Find the answer.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S9.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const done = idx >= S9.rounds.length
  const r = S9.rounds[idx]
  const rows = [
    { id: 'one', cap: L('Birinchisining yo\'li', 'Путь первого', 'Path of the first'), expr: '12t' },
    { id: 'two', cap: L('Ikkinchisining yo\'li', 'Путь второго', 'Path of the second'), expr: '18t' },
  ]
  return (
    <Frame meta={S9} screen={screen} audio={audio} solved={done} {...rest}>
      <QuantityCard rows={rows} />
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
            onAnswer({ ...res, screen, role: 'practice', part: 'r' + (idx + 1) })
          }}
        />
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 10. MASHQ 2. Yo'naltirilgan: uchta kattalik, bitta harf.
// ============================================================
const S10 = {
  eyebrow: L('UCHTA KATTALIK', 'ТРИ ВЕЛИЧИНЫ', 'THREE QUANTITIES'),
  title: L("Bitta harf uchtasini ham ushlaydi", 'Одна буква держит все три', 'One letter holds all three'),
  task: L(
    "Uch qutida 90 ta olma. Ikkinchisida birinchisidan 2 marta ko'p, uchinchisida 30 ta.",
    'В трёх ящиках 90 яблок. Во втором вдвое больше, чем в первом, в третьем 30.',
    'Three crates hold 90 apples. The second has twice the first, the third has 30.',
  ),
  rounds: [
    {
      template: ['x + 2x + 30 = ', { slot: 0 }],
      parts: [{ id: 'a', label: '90' }, { id: 'b', label: '80' }, { id: 'c', label: '3' }, { id: 'd', label: '30' }],
      answer: ['a'],
      prompt: L(
        "Uchinchi qutida 30 ta, jami 90 ta. Tenglamani tugating.",
        'В третьем ящике 30, всего 90. Заверши уравнение.',
        'The third crate has 30, ninety in all. Finish the equation.',
      ),
      checkNote: L("3x qo'shuv 30 teng 90, demak 3x teng 60", '3x плюс 30 равно 90, значит 3x равно 60', '3x plus 30 is 90, so 3x is 60'),
      wrongs: [
        { key: 'b', tag: 'Z5', hint: L("80 shartda yo'q. Tenglamada faqat berilgan son turadi: to'qson.", 'В условии нет 80. В уравнении стоит только данное число: девяносто.', 'There is no 80 in the condition. The equation takes the given number: ninety.') },
        { key: '*', tag: 'Z5', hint: L("Shartda umumiy son bor: to'qson.", 'В условии есть общее число: девяносто.', 'The condition gives the total: ninety.') },
      ],
    },
    {
      template: ['x = ', { slot: 0 }],
      parts: [{ id: 'e', label: '26' }, { id: 'f', label: '30' }, { id: 'g', label: '80' }, { id: 'h', label: '20' }],
      answer: ['h'],
      prompt: L(
        "3x teng 60. Birinchi qutida nechta olma bor?",
        '3x = 60. Сколько яблок в первом ящике?',
        '3x = 60. How many apples are in the first crate?',
      ),
      checkNote: L("3x teng 60, x teng 20. Tekshiruv: 20 qo'shuv 40 qo'shuv 30 teng 90", '3x = 60, x = 20. Проверка: 20 плюс 40 плюс 30 равно 90', '3x = 60, x = 20. Check: 20 plus 40 plus 30 is 90'),
      wrongs: [
        { key: 'f', tag: 'Z4', hint: L("O'ttiz bu uchinchi qutidagi olmalar. Savol birinchisi haqida.", 'Тридцать это яблоки третьего ящика. Вопрос про первый.', 'Thirty is the third crate. The question is about the first.') },
        { key: '*', tag: 'Z6', hint: L("O'ttizni ko'chiring: 3x teng 60. Keyin uchga bo'ling.", 'Перенеси тридцать: 3x = 60. Потом раздели на три.', 'Move the thirty: 3x = 60. Then divide by three.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta kattalik, va ular ham bitta harf orqali yoziladi.", 'Три величины, и они тоже записываются через одну букву.', 'Three quantities, and they too are written through one letter.'),
    A('r1', "Tenglama tayyor. Endi birinchi qutini toping.", 'Уравнение готово. Теперь найди первый ящик.', 'The equation is ready. Now find the first crate.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S10.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const done = idx >= S10.rounds.length
  const r = S10.rounds[idx]
  const rows = [
    { id: 'one', cap: L('Birinchi quti', 'Первый ящик', 'First crate'), expr: done ? '20' : 'x' },
    { id: 'two', cap: L('Ikkinchi quti', 'Второй ящик', 'Second crate'), expr: done ? '40' : '2x' },
  ]
  return (
    <Frame meta={S10} screen={screen} audio={audio} solved={done} {...rest}>
      <QuantityCard rows={rows} mark="one" answer={done ? 'one' : null} />
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
  title: L('Jadvalsiz', 'Без таблицы', 'Without the table'),
  template: ['x = ', { slot: 0 }],
  parts: [
    { id: 'p8', label: '8' },
    { id: 'p12', label: '12' },
    { id: 'p20', label: '20' },
    { id: 'p4', label: '4' },
  ],
  answer: ['p8'],
  prompt: L(
    "20 ta daftar: qalinlari 900 so'm, yupqalari 500 so'm. Hammasi 14 000 so'm. Nechta qalin daftar bor?",
    '20 тетрадей: толстые по 900 сумов, тонкие по 500. Всего 14 000 сумов. Сколько толстых тетрадей?',
    'Twenty notebooks: thick ones 900 sums, thin ones 500. In all 14,000 sums. How many are thick?',
  ),
  checkNote: L(
    "900x qo'shuv 500 qavs 20 ayirish x teng 14 000, ya'ni 400x teng 4 000, x teng 8... tekshiring",
    '900x плюс 500 скобка 20 минус x равно 14 000, то есть 400x = 4 000, x = 8... проверь',
    '900x plus 500 times the bracket 20 minus x is 14,000, so 400x = 4,000 and x = 8... check it',
  ),
  wrongs: [
    { key: 'p12', tag: 'Z4', hint: L("O'n ikki bu yupqa daftarlar soni. Savol qalinlari haqida.", 'Двенадцать это тонкие тетради. Вопрос про толстые.', 'Twelve is the thin notebooks. The question is about the thick ones.') },
    { key: 'p20', tag: 'Z5', hint: L("Yigirma bu hamma daftar, u shartda berilgan.", 'Двадцать это все тетради, они даны в условии.', 'Twenty is all the notebooks, given in the condition.') },
    { key: '*', tag: 'Z2', hint: L("Qalinlarini x deb oling, yupqalari 20 ayirish x bo'ladi.", 'Возьми толстые за x, тогда тонких будет 20 минус x.', 'Take the thick ones as x, then the thin ones are 20 minus x.') },
  ],
  audio: [
    A('mount', "Endi jadvalsiz va yordamsiz. Hamma qadamni o'zingiz o'ylaysiz.", 'Теперь без таблицы и без подсказок. Все шаги держишь в голове.', 'Now without the table or hints. You hold every step in your head.'),
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
// EKRAN 12. TUZOQ (§8.2). Ikkinchi harf kiritilgan va ish tugamagan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  task: L(
    "50 ta shar: qizillari 200 so'm, ko'klari 300 so'm, hammasi 13 000 so'm.",
    '50 шаров: красные по 200 сумов, синие по 300, всего 13 000 сумов.',
    'Fifty balloons: red 200 sums, blue 300, in all 13,000 sums.',
  ),
  ask: L(
    "Yuqoridagi qatordan kelib chiqmagan qatorni toping.",
    'Найди строку, которая не следует из строки над ней.',
    'Find the line that does not follow from the line above it.',
  ),
  rows: [
    { id: 'r1', text: L("qizil: x", 'красные: x', 'red: x') },
    { id: 'r2', text: L("ko'k: y", 'синие: y', 'blue: y') },
    { id: 'r3', text: '200x + 300y = 13 000' },
    { id: 'r4', text: L('yechilmadi', 'не решается', 'cannot be solved') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Birinchi kattalikni x deb olish to'g'ri.", 'Обозначить первую величину за x верно.', 'Taking the first quantity as x is right.'),
    r3: L("Bu qator ikkinchisidan to'g'ri kelib chiqadi: narxlar yig'indisi. Xato yuqoriroqda.", 'Эта строка верно следует из второй: сумма стоимостей. Ошибка выше.', 'This line follows correctly from the second: the costs add up. The mistake is higher up.'),
    r4: L("Bu shunchaki natija: ikki harf bilan haqiqatan yechilmaydi. Sabab yuqoriroqda.", 'Это просто следствие: с двумя буквами действительно не решить. Причина выше.', 'That is just the consequence: two letters really cannot be solved. The cause is higher up.'),
  },
  tags: { r1: 'Z1', r3: 'Z1', r4: 'Z1' },
  proofFill: {
    template: ['200x + 300(', { slot: 0 }, ') = 13 000,     x = ', { slot: 1 }],
    parts: [{ id: 'a', label: '50 − x' }, { id: 'b', label: '20' }, { id: 'c', label: 'x − 50' }, { id: 'd', label: '30' }],
    answer: ['a', 'b'],
    prompt: L(
      "Ko'klarni x orqali yozing va yechimni oxirigacha olib boring.",
      'Запиши синие через x и доведи решение до конца.',
      'Write the blue ones through x and finish the solution.',
    ),
    checkNote: L("200x qo'shuv 15 000 ayirish 300x teng 13 000, ya'ni 100x teng 2 000, x teng 20", '200x плюс 15 000 минус 300x равно 13 000, то есть 100x = 2 000, x = 20', '200x plus 15,000 minus 300x is 13,000, so 100x = 2,000 and x = 20'),
    wrongs: [
      { key: 'a|d', tag: 'Z6', hint: L("O'ttiz bu ko'k sharlar soni. Savol qizillari haqida.", 'Тридцать это синие шары. Вопрос про красные.', 'Thirty is the blue balloons. The question is about the red ones.') },
      { key: '*', tag: 'Z2', hint: L("Umumiy sondan qizillarni ayiring: 50 ayirish x.", 'Вычти красные из общего числа: 50 минус x.', 'Take the red ones from the total: 50 minus x.') },
    ],
  },
  audio: [
    A('mount', "O'quvchi har kattalikka o'z harfini qo'ydi va ishni tugatolmadi.", 'Ученик поставил каждой величине свою букву и не смог закончить.', 'A student gave each quantity its own letter and could not finish.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. Ikkinchi harf o'rniga 50 ayirish x yoziladi. Endi to'g'ri qiling.", 'Нашёл. Вместо второй буквы пишут 50 минус x. Теперь сделай верно.', 'You found it. Instead of a second letter you write 50 minus x. Now do it right.'),
    A('done', "Qizil sharlar yigirmata ekan.", 'Красных шаров оказалось двадцать.', 'There are twenty red balloons.'),
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
// EKRAN 13. TESKARI YO'L. Tenglama berilgan -- masala nima haqida?
// ============================================================
const S13 = {
  eyebrow: L("TESKARI YO'L", 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L("Tenglamadan shartga", 'От уравнения к условию', 'From the equation to the condition'),
  expr: '400x + 250(30 − x) = 9 000',
  probe: {
    question: L(
      "Bu tenglamada 30 soni nimani bildiradi?",
      'Что означает число 30 в этом уравнении?',
      'What does the number 30 mean in this equation?',
    ),
    items: [
      {
        id: 'total', correct: true,
        label: L("Ikki kattalikning umumiy soni", 'Общее количество двух величин', 'The total of the two quantities'),
      },
      {
        id: 'price', tag: 'Z5',
        label: L("Bir donaning narxi", 'Цена одной штуки', 'The price of one item'),
        hint: L("Narxlar qavs oldida turadi: 400 va 250. Qavs ichida esa MIQDOR bor.", 'Цены стоят перед скобками: 400 и 250. А в скобке КОЛИЧЕСТВО.', 'The prices stand before the brackets: 400 and 250. Inside the bracket is a COUNT.'),
      },
      {
        id: 'answer', tag: 'Z4',
        label: L("Masalaning javobi", 'Ответ задачи', 'The answer to the problem'),
        hint: L("Javob x, u hali topilmagan. O'ttiz esa shartda berilgan son.", 'Ответ это x, он ещё не найден. А тридцать дано в условии.', 'The answer is x and it is not found yet. Thirty is given in the condition.'),
      },
      {
        id: 'sum', tag: 'Z5',
        label: L("Umumiy narx", 'Общая стоимость', 'The total cost'),
        hint: L("Umumiy narx o'ng tomonda: to'qqiz ming. O'ttiz esa qavs ichida, miqdorlar orasida.", 'Общая стоимость справа: девять тысяч. А тридцать в скобке, среди количеств.', 'The total cost is on the right: nine thousand. Thirty is inside the bracket, among the counts.'),
      },
    ],
    ok: L(
      "Qavs ichidagi 30 ayirish x ikkinchi miqdor, demak 30 ikkalasining yig'indisi.",
      'В скобке 30 минус x это второе количество, значит 30 это сумма обоих.',
      'The 30 minus x inside the bracket is the second count, so 30 is the total of both.',
    ),
  },
  reward: {
    title: L('Tenglama shartni saqlaydi', 'Уравнение хранит условие', 'The equation keeps the condition'),
    text: L(
      "Qavs oldidagi sonlar narx, qavs ichidagilar miqdor, o'ng tomondagi esa umumiy natija. Yozuvni o'qib shartni tiklash mumkin.",
      'Числа перед скобками это цены, внутри скобки количества, справа общий итог. Прочитав запись, условие можно восстановить.',
      'The numbers before the brackets are prices, inside are counts, on the right is the total. Read the line and the condition can be rebuilt.',
    ),
  },
  audio: [
    A('mount', "Endi teskari yo'l: tenglama berilgan, masala esa yo'q.", 'Теперь обратный ход: уравнение дано, а задачи нет.', 'Now the other way round: the equation is given, the problem is not.'),
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
      <div className="g7-eqb-lone"><Fx>{S13.expr}</Fx></div>
      <Probe
        data={S13.probe}
        cols={2}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'transfer' }) }}
      />
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
        "Jami 25 ta. Biri x bo'lsa, ikkinchisi?",
        'Всего 25. Если одного x, сколько второго?',
        'Twenty five in all. If one is x, what is the other?',
      ),
      ok: L("Umumiy sondan birinchisini ayiramiz.", 'Из общего числа вычитаем первое.', 'Take the first from the total.'),
      items: [
        { id: 'a', label: '25 − x', correct: true },
        { id: 'b', label: 'x − 25', tag: 'Z2', hint: L("Bu manfiy chiqadi: x yigirma beshdan kichik.", 'Это выйдет отрицательным: x меньше двадцати пяти.', 'That is negative: x is less than twenty five.') },
        { id: 'c', label: '25 + x', tag: 'Z2', hint: L("Qo'shsak, jami yigirma beshdan ko'p bo'ladi.", 'Если прибавить, всего станет больше двадцати пяти.', 'Adding makes the total more than twenty five.') },
        { id: 'd', label: 'y', tag: 'Z1', hint: L("Yangi harf shartni ishlatmaydi.", 'Новая буква не использует условие.', 'A new letter ignores the condition.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("300(20 − x) ni qavsdan chiqaring.", 'Раскрой скобку в 300(20 − x).', 'Open the bracket in 300(20 − x).'),
      ok: L("Ko'paytuvchi har bir hadga yuboriladi.", 'Множитель отправляется к каждому слагаемому.', 'The factor goes to every term.'),
      items: [
        { id: 'a', label: '6 000 − 300x', correct: true },
        { id: 'b', label: '6 000 − x', tag: 'Z3', hint: L("x ham 300 ga ko'paytiriladi.", 'x тоже умножается на 300.', 'The x is multiplied by 300 too.') },
        { id: 'c', label: '320 − 300x', tag: 'Z3', hint: L("320 bu 300 qo'shuv 20. Bu yerda ko'paytirish.", '320 это 300 плюс 20. Здесь умножение.', '320 is 300 plus 20. Here it is a multiplication.') },
        { id: 'd', label: '6 000 + 300x', tag: 'Z3', hint: L("Qavs ichida minus turgan, demak natijada ham minus.", 'В скобке стоял минус, значит и в результате минус.', 'The bracket had a minus, so the result keeps it.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikkita kattalik bor, yig'indisi ma'lum. Nechta harf kerak?",
        'Есть две величины, их сумма известна. Сколько нужно букв?',
        'Two quantities with a known total. How many letters are needed?',
      ),
      ok: L("Bittasi yetadi: ikkinchisi uning orqali yoziladi.", 'Хватит одной: вторая записывается через неё.', 'One is enough: the other is written through it.'),
      items: [
        { id: 'a', correct: true, label: L('Bitta', 'Одна', 'One') },
        { id: 'b', tag: 'Z1', label: L('Ikkita', 'Две', 'Two'), hint: L("Ikkita harf ikkita tenglama talab qiladi, shart esa bitta.", 'Две буквы требуют двух уравнений, а условие одно.', 'Two letters need two equations, but there is one condition.') },
        { id: 'c', tag: 'Z1', label: L("Har kattalikka bittadan", 'По одной на каждую величину', 'One per quantity'), hint: L("Bu ham ikkita degani. Yig'indi ma'lum bo'lsa, ikkinchisi ayirish bilan yoziladi.", 'Это и есть две. Если сумма известна, вторая пишется вычитанием.', 'That means two. With a known total the other comes by subtracting.') },
        { id: 'd', tag: 'Z1', label: L('Uchta', 'Три', 'Three'), hint: L("Kattalik ikkita, harf esa bittasi ham yetadi.", 'Величин две, а буквы хватит и одной.', 'There are two quantities and one letter is enough.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Jami 40 kg, x teng 22 chiqdi. Savol ikkinchi mahsulot haqida. Javob?",
        'Всего 40 кг, вышло x = 22. Вопрос про второй продукт. Ответ?',
        'Forty kg in all, x came out 22. The question is about the second product. The answer?',
      ),
      ok: L("Ikkinchisi 40 ayirish x, ya'ni 18.", 'Второй это 40 минус x, то есть 18.', 'The second is 40 minus x, that is 18.'),
      items: [
        { id: 'a', label: '18', correct: true },
        { id: 'b', label: '22', tag: 'Z4', hint: L("22 bu x, ya'ni birinchi mahsulot.", '22 это x, то есть первый продукт.', '22 is x, the first product.') },
        { id: 'c', label: '40', tag: 'Z4', hint: L("40 bu umumiy massa.", '40 это общая масса.', '40 is the total mass.') },
        { id: 'd', label: '62', tag: 'Z2', hint: L("62 bu 40 qo'shuv 22. Ayirish kerak edi.", '62 это 40 плюс 22. Нужно было вычитание.', '62 is 40 plus 22. Subtraction was needed.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Blokning oxirgi baholanadigan ekrani.", 'Блиц, четыре вопроса. Последний оцениваемый экран блока.', 'Quick round, four questions. The last graded screen of the block.'),
    A('1', "Ikkinchisi qavs haqida.", 'Второй про скобку.', 'The second is about the bracket.'),
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
// EKRAN 15. YAKUN. Blok ham shu ekranda yakunlanadi.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Bitta harf yetadi', 'Одной буквы достаточно', 'One letter is enough'),
  gate: S1.gate,
  fix: {
    tokens: ['x', ',', '40', '−', 'x'],
    value: '1',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Ikkinchi kattalik yangi harf emas, u qirq ayirish x. Shuning uchun bitta tenglama yetadi.",
    'Вторая величина это не новая буква, а сорок минус x. Поэтому одного уравнения достаточно.',
    'The second quantity is not a new letter but forty minus x. That is why one equation suffices.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    one: L('bitta harf ishlatgani', 'тот, кто взял одну букву', 'the one with a single letter'),
    two: L('ikkita harf ishlatgani', 'тот, кто взял две буквы', 'the one with two letters'),
    both: L('ikkalasi ham', 'оба', 'both'),
    none: L('ikkalasi ham emas', 'ни один', 'neither'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['x , 40 − x → 22 , 18', '12t + 18t = 60 → 2', 'x + 2x + 30 = 90 → 20', '200x + 300(50 − x) → 20'],
  twoLabel: L('B2 bloki', 'Блок Б2', 'Block B2'),
  twoA: 'x = ?  →  ⇄ ±  →  | |',
  twoB: L('masala  →  x  →  javob', 'задача  →  x  →  ответ', 'problem  →  x  →  answer'),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "darajalar va bir hadlar",
    'степени и одночлены',
    'powers and monomials',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Bu blokning oxirgi darsi edi. Tenglama nima ekanidan boshlab, masalani tenglama bilan yechishgacha keldik.", 'Это был последний урок блока. Мы прошли от того, что такое уравнение, до решения задач уравнением.', 'That was the last lesson of the block. We went from what an equation is to solving problems with one.'),
    A('mount', "Keyingi blokda darajalar va bir hadlar bo'ladi.", 'В следующем блоке будут степени и одночлены.', 'The next block brings powers and monomials.'),
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

export default function Grade7Dars12({
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
    else console.log('[Grade7 Dars12] onFinished', payload)
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
