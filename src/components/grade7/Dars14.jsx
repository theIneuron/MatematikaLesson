// ============================================================================
// 7-sinf, Dars 14. DARAJA XOSSALARI.
// (Свойства степеней с натуральным показателем)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md. B3 bloki, 13-darsning davomi.
// ASBOB: `FactorTape` -- 13-darsdagi lenta, endi GURUHLAR va QISQARTIRISH
// bilan. Yangi asbob yozilmadi.
//
// XOSSALAR YOD OLINMAYDI, ULAR SANALADI. Uchta xossaning uchtasi ham
// lentada ko'rinadi:
//   a³ karra a⁴ -- ikki guruh, jami yettita muljitel  -> ko'rsatkichlar QO'SHILADI
//   (a³)⁴       -- to'rtta guruh uchtadan, jami o'n ikki -> KO'PAYTIRILADI
//   a⁷ bo'lish a⁴ -- to'rttasi qisqaradi, uchtasi qoladi -> AYIRILADI
// Shuning uchun darsda «qoidani eslab qol» degan joy yo'q: har xossa
// lentani sanashdan chiqadi.
//
// QIYINLIK DARAJASI (metodist qarori 2026-08-20). Misollar harfli va
// ko'rsatkichi harfli ham bo'ladi: cⁿ karra c²ⁿ karra c⁵ⁿ. Ko'chirish esa
// darslikning qo'shma misoli: 2⁹ karra (2⁵)⁶ karra (2⁴)⁵ ni 2⁵⁴ ga bo'lish.
// Bunday misolni tanish yo'l bilan yechib bo'lmaydi.
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
  FactorTape,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  StairsReveal,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_14'
const LESSON_TITLE = L('Daraja xossalari', 'Свойства степеней', 'Properties of powers')
const LESSON_NO = L('14-dars', 'Урок 14', 'Lesson 14')
const TOTAL = 15

const BLOCK = { label: L('B3-blok', 'Блок Б3', 'Block B3'), from: 13, to: 17, current: 14 }

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
  Z1: L("ko'rsatkichlar ko'paytirildi", 'показатели перемножены', 'the exponents were multiplied'),
  Z2: L("ko'rsatkichlar qo'shildi", 'показатели сложены', 'the exponents were added'),
  Z3: L('asoslar bir xil emas', 'основания не одинаковы', 'the bases are not equal'),
  Z4: L("asos ham ko'paytirildi", 'основание тоже перемножено', 'the base was multiplied too'),
  Z5: L('muljitellar sanalmadi', 'множители не посчитаны', 'the factors were not counted'),
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
// EKRAN 1. XUK. a³ karra a⁴: ko'rsatkichlar qo'shiladimi yoki
// ko'paytiriladimi. Tablolarda KO'RSATKICH turadi.
// ============================================================
const S1 = {
  eyebrow: L('DARAJA XOSSALARI', 'СВОЙСТВА СТЕПЕНЕЙ', 'PROPERTIES OF POWERS'),
  noBack: true,
  noNotes: true,
  title: L("Qo'shiladimi yoki ko'paytiriladimi", 'Складывают или умножают', 'Add them or multiply them'),
  gate: {
    source: { kind: 'plain', tokens: ['a³', '·', 'a⁴'] },
    rows: [
      { tokens: ['a⁷'], value: '7' },
      { tokens: ['a¹²'], value: '12' },
    ],
  },
  probe: {
    question: L(
      "Tabloda ko'rsatkichlar turibdi. Qaysi biri to'g'ri?",
      'На табло показатели. Какой из них верный?',
      'The boards show the exponents. Which one is right?',
    ),
    items: [
      {
        id: 'add',
        label: L(
          "Yettita: uchta muljitel va to'rtta muljitel birga",
          'Семь: три множителя и четыре множителя вместе',
          'Seven: three factors and four factors together',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Lentani ochib sanaymiz.",
          'Прогноз принят. Раскроем ленту и посчитаем.',
          'Your prediction is taken. We will unfold the tape and count.',
        ),
      },
      {
        id: 'mul',
        label: L("O'n ikkita: uch karra to'rt", 'Двенадцать: три умножить на четыре', 'Twelve: three times four'),
        hint: L(
          "Uch karra to'rt boshqa yozuvda chiqadi. Bu yerda ikki lenta yonma-yon qo'yiladi, ular ko'paytirilmaydi.",
          'Три умножить на четыре выйдет в другой записи. Здесь две ленты ставят рядом, а не перемножают.',
          'Three times four comes from a different record. Here two tapes stand side by side, they are not multiplied.',
        ),
      },
      {
        id: 'same',
        label: L("Uchta: asos bir xil, ko'rsatkich o'zgarmaydi", 'Три: основание то же, показатель не меняется', 'Three: the base is the same, the exponent stays'),
        hint: L(
          "Ko'paytirish muljitellar sonini oshiradi. Uchta muljitelga to'rttasi qo'shiladi.",
          'Умножение увеличивает число множителей. К трём добавляются четыре.',
          'Multiplying adds factors. Four join the three.',
        ),
      },
      {
        id: 'base',
        label: L("Asos ham o'zgaradi: a² bo'lib qoladi", 'Основание тоже меняется: станет a²', 'The base changes too: it becomes a²'),
        hint: L(
          "Asos o'zgarmaydi, u a bo'lib qoladi. O'zgaradigan narsa faqat muljitellar SONI.",
          'Основание не меняется, оно остаётся a. Меняется только КОЛИЧЕСТВО множителей.',
          'The base does not change, it stays a. Only the NUMBER of factors changes.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "O'n uchinchi darsda lentani sanashni o'rgandik. Endi shu sanoqdan xossalar chiqadi.", 'В тринадцатом уроке мы научились считать ленту. Теперь из этого счёта выйдут свойства.', 'In lesson thirteen we learned to count the tape. Now the properties come out of that count.'),
    A('mount', "Ikki daraja ko'paytirilgan, asos bir xil.", 'Две степени перемножены, основание одинаковое.', 'Two powers multiplied, the base is the same.'),
    A('mount', "Tabloda ikki xil ko'rsatkich turibdi.", 'На табло два разных показателя.', 'The boards show two different exponents.'),
    A('mount', "Sizningcha qaysi biri. Bu taxmin, uning uchun baho yo'q.", 'Как думаешь, какой. Это прогноз, оценки за него нет.', 'Which one do you think. This is a prediction, it is not graded.'),
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
      prompt: '(3a)³',
      ok: L("Qavs ichidagi hammasi darajaga kiradi.", 'В степень входит всё, что в скобке.', 'Everything in the bracket enters the power.'),
      items: [
        { id: 'a', label: '27a³', correct: true },
        { id: 'b', label: '3a³', tag: 'Z4', hint: L("Uchlik ham uch marta ko'paytiriladi: 27.", 'Тройка тоже умножается трижды: 27.', 'The three multiplies three times as well: 27.') },
        { id: 'c', label: '9a³', tag: 'Z5', hint: L("To'qqiz ikkita uchlikdan chiqadi, lentada esa uchta.", 'Девять выходит из двух троек, а в ленте их три.', 'Nine comes from two threes, the tape has three.') },
        { id: 'd', label: '27a', tag: 'Z5', hint: L("Lentada uchta a ham bor.", 'В ленте есть и три a.', 'The tape also holds three a.') },
      ],
    },
    {
      prompt: 'a² · a²',
      ok: L("Ikkita a kvadrat bu to'rtta a.", 'Два a в квадрате это четыре a.', 'Two a squared is four a.'),
      items: [
        { id: 'a', label: 'a⁴', correct: true },
        { id: 'b', label: 'a²', tag: 'Z5', hint: L("Ko'paytirish muljitellar sonini oshiradi.", 'Умножение увеличивает число множителей.', 'Multiplying adds factors.') },
        { id: 'c', label: '2a²', tag: 'Z2', hint: L("Bu yig'indining javobi. Bu yerda esa ko'paytirish.", 'Это ответ для суммы. А здесь умножение.', 'That is the answer for a sum. Here it is a product.') },
        { id: 'd', label: 'a⁸', tag: 'Z1', hint: L("Sakkiz ikkita kvadratni ko'paytirishdan chiqadi. Muljitellar esa QO'SHILADI.", 'Восемь выходит из перемножения квадратов. А множители СКЛАДЫВАЮТСЯ.', 'Eight comes from multiplying the squares. But factors ADD UP.') },
      ],
    },
    {
      prompt: '2⁵',
      ok: L("Beshta ikkilikning ko'paytmasi.", 'Произведение пяти двоек.', 'The product of five twos.'),
      items: [
        { id: 'a', label: '32', correct: true },
        { id: 'b', label: '10', tag: 'Z4', hint: L("O'n bu 2 karra 5. Ko'rsatkich muljitel emas.", 'Десять это 2 умножить на 5. Показатель не множитель.', 'Ten is 2 times 5. The exponent is not a factor.') },
        { id: 'c', label: '25', tag: 'Z4', hint: L("25 bu 5 ning kvadrati. Bizda asos ikki.", '25 это 5 в квадрате. У нас основание два.', '25 is 5 squared. Here the base is two.') },
        { id: 'd', label: '16', tag: 'Z5', hint: L("16 bu to'rtta ikkilik. Lentada esa beshta.", '16 это четыре двойки. А в ленте их пять.', '16 is four twos. The tape has five.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta savolga javob beramiz.", 'Ответим на три вопроса.', 'Three things to recall.'),
    A('1', "Ikkinchisi.", 'Второе.', 'Second.'),
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
// EKRAN 3. KO'PAYTIRISH. Lenta IKKI GURUHGA bo'linadi: uchta va to'rtta.
// Ko'rsatkichlarning qo'shilishi shu bo'linishda ko'rinadi.
// ============================================================
const S3 = {
  eyebrow: L("KO'PAYTIRISH", 'УМНОЖЕНИЕ', 'MULTIPLYING'),
  title: L('Ikki guruh bitta lentada', 'Две группы в одной ленте', 'Two groups in one tape'),
  tape: {
    expr: 'a³ · a⁴',
    item: 'a',
    count: 7,
    groups: [3, 4],
    options: [
      { id: 'a', label: 'a⁷' },
      { id: 'b', label: 'a¹²' },
      { id: 'c', label: 'a³' },
      { id: 'd', label: '2a⁷' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z1', hint: L("O'n ikki bu uch karra to'rt. Lentada esa guruhlar YONMA-YON turibdi, ular ko'paytirilmaydi -- sanoq qo'shiladi.", 'Двенадцать это три умножить на четыре. А в ленте группы стоят РЯДОМ, они не перемножаются — счёт складывается.', 'Twelve is three times four. In the tape the groups stand SIDE BY SIDE, they are not multiplied — the counts add.') },
      { key: 'd', tag: 'Z2', hint: L("Ikkilik yig'indidan kelardi. Bu yerda esa ko'paytirish: koeffitsiyent paydo bo'lmaydi.", 'Двойка пришла бы от суммы. А здесь умножение: коэффициент не появляется.', 'A two would come from a sum. Here it is a product: no coefficient appears.') },
      { key: '*', tag: 'Z5', hint: L("Lentani sanang: uchta va to'rtta, jami yettita.", 'Посчитай ленту: три и четыре, всего семь.', 'Count the tape: three and four, seven in all.') },
    ],
    note: L(
      "Asos bir xil bo'lganda ko'rsatkichlar QO'SHILADI.",
      'При одинаковом основании показатели СКЛАДЫВАЮТСЯ.',
      'With the same base the exponents ADD UP.',
    ),
  },
  reward: {
    title: L('Xossa sanoqdan chiqdi', 'Свойство вышло из счёта', 'The property came from counting'),
    text: L(
      "Uni yod olish kerak emas: lentani yozib, muljitellarni sanash yetadi.",
      'Его не надо запоминать: достаточно выписать ленту и посчитать множители.',
      'No need to memorise it: write out the tape and count the factors.',
    ),
  },
  audio: [
    A('mount', "Yozuvni bosing.", 'Нажми на запись.', 'Tap the record.'),
    A('open', "Lenta ikki guruhga bo'lingan: uchta va to'rtta. Jami esa bitta son.", 'Лента разделена на две группы: три и четыре. А всего одно число.', 'The tape splits into two groups: three and four. And the total is one number.'),
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
      <FactorTape
        audio={audio}
        expr={S3.tape.expr}
        item={S3.tape.item}
        count={S3.tape.count}
        groups={S3.tape.groups}
        options={S3.tape.options}
        answer={S3.tape.answer}
        wrongs={S3.tape.wrongs}
        note={S3.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. DARAJANING DARAJASI. To'rtta guruh UCHTADAN -- va endi
// ko'rsatkichlar KO'PAYTIRILADI. 3-ekran bilan farq shu yerda ko'rinadi.
// ============================================================
const S4 = {
  eyebrow: L('DARAJANING DARAJASI', 'СТЕПЕНЬ СТЕПЕНИ', 'A POWER OF A POWER'),
  title: L("To'rtta guruh, har birida uchta", 'Четыре группы по три', 'Four groups of three'),
  tape: {
    expr: '(a³)⁴',
    item: 'a',
    count: 12,
    groups: [3, 3, 3, 3],
    options: [
      { id: 'a', label: 'a¹²' },
      { id: 'b', label: 'a⁷' },
      { id: 'c', label: 'a⁶⁴' },
      { id: 'd', label: 'a³' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z2', hint: L("Yetti bu uch qo'shuv to'rt. Bu yerda esa to'rtta GURUH bor, har birida uchta muljitel.", 'Семь это три плюс четыре. А здесь четыре ГРУППЫ, в каждой три множителя.', 'Seven is three plus four. Here there are four GROUPS with three factors each.') },
      { key: 'c', tag: 'Z1', hint: L("Bu asosni ko'paytirish natijasi. Ko'paytirilishi kerak bo'lgan narsa esa KO'RSATKICHLAR.", 'Это результат перемножения основания. А перемножать надо ПОКАЗАТЕЛИ.', 'That comes from multiplying the base. What multiplies is the EXPONENTS.') },
      { key: '*', tag: 'Z5', hint: L("Lentani sanang: to'rtta guruh uchtadan, jami o'n ikkita.", 'Посчитай ленту: четыре группы по три, всего двенадцать.', 'Count the tape: four groups of three, twelve in all.') },
    ],
    note: L(
      "Darajaning darajasida ko'rsatkichlar KO'PAYTIRILADI.",
      'В степени степени показатели УМНОЖАЮТСЯ.',
      'For a power of a power the exponents MULTIPLY.',
    ),
  },
  bonus: {
    title: L('Uchinchi ekran bilan farq', 'Разница с третьим экраном', 'The difference from screen three'),
    text: L(
      "Uchinchi ekranda ikki guruh YONMA-YON turgandi va sanoq qo'shilgandi. Bu yerda esa bitta guruh to'rt marta TAKRORLANADI, shuning uchun ko'paytiriladi.",
      'На третьем экране две группы стояли РЯДОМ и счёт складывался. А здесь одна группа ПОВТОРЯЕТСЯ четыре раза, поэтому умножается.',
      'On screen three two groups stood SIDE BY SIDE and the counts added. Here one group REPEATS four times, so it multiplies.',
    ),
  },
  audio: [
    A('mount', "Endi qavs ichida daraja turibdi, tashqarisida ham daraja.", 'Теперь степень стоит и внутри скобки, и снаружи.', 'Now there is a power inside the bracket and one outside.'),
    A('open', "To'rtta guruh, har birida uchta muljitel.", 'Четыре группы, в каждой три множителя.', 'Four groups with three factors each.'),
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
      <FactorTape
        audio={audio}
        expr={S4.tape.expr}
        item={S4.tape.item}
        count={S4.tape.count}
        groups={S4.tape.groups}
        options={S4.tape.options}
        answer={S4.tape.answer}
        wrongs={S4.tape.wrongs}
        note={S4.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 5. BO'LISH. Umumiy muljitellar QISQARADI -- lentada o'chirilgan
// bo'lib ko'rinadi, va qolganlari sanaladi.
// ============================================================
const S5 = {
  eyebrow: L("BO'LISH", 'ДЕЛЕНИЕ', 'DIVIDING'),
  title: L('Umumiy muljitellar qisqaradi', 'Общие множители сокращаются', 'Common factors cancel'),
  tape: {
    expr: 'a⁷ : a⁴',
    item: 'a',
    count: 7,
    cross: 4,
    options: [
      { id: 'a', label: 'a³' },
      { id: 'b', label: 'a¹¹' },
      { id: 'c', label: 'a⁴' },
      { id: 'd', label: 'a²⁸' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z2', hint: L("O'n bir bu yetti qo'shuv to'rt. Bo'lishda esa muljitellar KETADI, qo'shilmaydi.", 'Одиннадцать это семь плюс четыре. А при делении множители УХОДЯТ, а не добавляются.', 'Eleven is seven plus four. In division the factors GO AWAY, they do not add.') },
      { key: 'd', tag: 'Z1', hint: L("Yigirma sakkiz bu yetti karra to'rt. Ko'rsatkichlar bo'lishda AYIRILADI.", 'Двадцать восемь это семь умножить на четыре. При делении показатели ВЫЧИТАЮТСЯ.', 'Twenty eight is seven times four. In division the exponents SUBTRACT.') },
      { key: '*', tag: 'Z5', hint: L("Lentada yettita muljitel bor, to'rttasi qisqardi. Nechtasi qoldi.", 'В ленте семь множителей, четыре сократились. Сколько осталось.', 'The tape has seven factors, four cancelled. How many are left.') },
    ],
    note: L(
      "Bo'lishda ko'rsatkichlar AYIRILADI.",
      'При делении показатели ВЫЧИТАЮТСЯ.',
      'In division the exponents SUBTRACT.',
    ),
  },
  audio: [
    A('mount', "Endi bo'lish. Yozuvni bosing.", 'Теперь деление. Нажми на запись.', 'Now division. Tap the record.'),
    A('open', "To'rtta muljitel qisqardi, ular o'chirilgan bo'lib turibdi.", 'Четыре множителя сократились, они зачёркнуты.', 'Four factors cancelled, they are struck through.'),
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
      <FactorTape
        audio={audio}
        expr={S5.tape.expr}
        item={S5.tape.item}
        count={S5.tape.count}
        cross={S5.tape.cross}
        options={S5.tape.options}
        answer={S5.tape.answer}
        wrongs={S5.tape.wrongs}
        note={S5.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 6. O'ZINGIZ. Asos qavs bilan: (2a)³ karra (2a)².
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Asos qavs bilan berilgan', 'Основание дано скобкой', 'The base is given by a bracket'),
  tape: {
    expr: '(2a)³ · (2a)²',
    item: '2a',
    count: 5,
    groups: [3, 2],
    options: [
      { id: 'a', label: '32a⁵' },
      { id: 'b', label: '(2a)⁶' },
      { id: 'c', label: '2a⁵' },
      { id: 'd', label: '10a⁵' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z1', hint: L("Olti bu uch karra ikki. Guruhlar esa yonma-yon: uch qo'shuv ikki, beshta.", 'Шесть это три умножить на два. А группы стоят рядом: три плюс два, пять.', 'Six is three times two. The groups stand side by side: three plus two, five.') },
      { key: 'c', tag: 'Z4', hint: L("Lentada beshta ikkilik bor: 2 karra 2 karra 2 karra 2 karra 2 teng 32.", 'В ленте пять двоек: 2 на 2 на 2 на 2 на 2 это 32.', 'The tape holds five twos: 2 times 2 times 2 times 2 times 2 is 32.') },
      { key: 'd', tag: 'Z4', hint: L("O'n bu 2 karra 5. Beshta ikkilik esa ko'paytiriladi, qo'shilmaydi.", 'Десять это 2 умножить на 5. А пять двоек перемножаются, не складываются.', 'Ten is 2 times 5. Five twos multiply, they do not add.') },
      { key: '*', tag: 'Z5', hint: L("Beshta ikkilik va beshta a.", 'Пять двоек и пять a.', 'Five twos and five a.') },
    ],
    note: L(
      "Asos butun qavs bo'lsa ham qoida bir xil: ko'rsatkichlar qo'shiladi.",
      'Даже если основание это целая скобка, правило то же: показатели складываются.',
      'Even when the base is a whole bracket the rule holds: the exponents add.',
    ),
  },
  audio: [
    A('mount', "Endi o'zingiz. Asos bu safar qavs.", 'Теперь сам. Основание на этот раз скобка.', 'Now on your own. This time the base is a bracket.'),
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
      <FactorTape
        audio={audio}
        expr={S6.tape.expr}
        item={S6.tape.item}
        count={S6.tape.count}
        groups={S6.tape.groups}
        options={S6.tape.options}
        answer={S6.tape.answer}
        wrongs={S6.tape.wrongs}
        note={S6.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 7. CHEGARAVIY HOLAT. Asoslar BOSHQA: a³ karra b³.
// Ko'rsatkichlarni qo'shish mumkin emas, lekin boshqa xossa ishlaydi.
// KVOTA EKRANI.
// ============================================================
const S7 = {
  eyebrow: L('ASOSLAR BOSHQA', 'ОСНОВАНИЯ РАЗНЫЕ', 'DIFFERENT BASES'),
  title: L("Qo'shish qoidasi bu yerda ishlamaydi", 'Правило сложения здесь не работает', 'The adding rule does not work here'),
  expr: 'a³ · b³',
  probe: {
    question: L(
      "Asoslar boshqa. Bu yozuvni qanday ixchamlash mumkin?",
      'Основания разные. Как можно свернуть эту запись?',
      'The bases differ. How can this record be folded up?',
    ),
    items: [
      {
        id: 'ab', correct: true,
        label: L('(ab)³ ko\'rinishida', 'В виде (ab)³', 'As (ab)³'),
      },
      {
        id: 'add', tag: 'Z3',
        label: L('a⁶ ko\'rinishida', 'В виде a⁶', 'As a⁶'),
        hint: L("Ko'rsatkichlar faqat asoslar BIR XIL bo'lganda qo'shiladi. Bu yerda a va b boshqa harflar.", 'Показатели складывают только при ОДИНАКОВЫХ основаниях. А здесь a и b разные буквы.', 'Exponents add only when the bases are the SAME. Here a and b are different letters.'),
      },
      {
        id: 'mul', tag: 'Z3',
        label: L('a⁹ ko\'rinishida', 'В виде a⁹', 'As a⁹'),
        hint: L("To'qqiz uch karra uchdan chiqadi, lekin b yo'qolib qolmaydi. Uni yozuvda saqlash kerak.", 'Девять выходит из трёх на три, но b не исчезает. Её надо сохранить в записи.', 'Nine comes from three times three, but the b does not vanish. It must stay in the record.'),
      },
      {
        id: 'none', tag: 'Z3',
        label: L('Ixchamlash mumkin emas', 'Свернуть нельзя', 'It cannot be folded'),
        hint: L("Ko'rsatkichlar bir xil, demak lentani uchta juftlikka bo'lish mumkin: a karra b, a karra b, a karra b.", 'Показатели одинаковые, значит ленту можно разбить на три пары: a на b, a на b, a на b.', 'The exponents match, so the tape splits into three pairs: a times b, a times b, a times b.'),
      },
    ],
    ok: L(
      "Ko'rsatkichlar bir xil bo'lganda asoslarni bitta qavsga yig'ish mumkin.",
      'Когда показатели одинаковы, основания можно собрать в одну скобку.',
      'When the exponents match, the bases can be gathered into one bracket.',
    ),
  },
  bonus: {
    title: L("Ikki xossa, ikki shart", 'Два свойства, два условия', 'Two properties, two conditions'),
    text: L(
      "Asoslar bir xil bo'lsa -- ko'rsatkichlar qo'shiladi. Ko'rsatkichlar bir xil bo'lsa -- asoslar qavsga yig'iladi.",
      'Одинаковые основания — складываются показатели. Одинаковые показатели — основания собираются в скобку.',
      'Same bases means the exponents add. Same exponents means the bases gather into a bracket.',
    ),
  },
  audio: [
    A('mount', "Bu safar asoslar boshqa: a va b.", 'На этот раз основания разные: a и b.', 'This time the bases differ: a and b.'),
    A('mount', "Ko'rsatkichlar esa bir xil. Bu nima beradi.", 'А показатели одинаковые. Что это даёт.', 'But the exponents match. What does that give.'),
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
        data={S7.probe}
        cols={2}
        audio={audio}
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
    { id: 'f1', label: L("asoslar bir xil bo'lsa, ko'paytirishda ko'rsatkichlar qo'shiladi", 'при одинаковых основаниях в умножении показатели складывают', 'with equal bases multiplication adds the exponents') },
    { id: 'f2', label: L("bo'lishda esa ayiriladi", 'а в делении вычитают', 'and division subtracts them') },
    { id: 'f3', label: L("darajaning darajasida ko'paytiriladi", 'в степени степени умножают', 'a power of a power multiplies them') },
    { id: 'f4', label: L("ko'rsatkichlar bir xil bo'lsa, asoslar qavsga yig'iladi", 'при одинаковых показателях основания собирают в скобку', 'with equal exponents the bases gather into a bracket') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval ko'paytirish, keyin bo'lish, keyin darajaning darajasi, oxirida asoslar.",
    'Порядок нарушен. Сначала умножение, потом деление, потом степень степени, в конце основания.',
    'The order is off. Multiplication, then division, then a power of a power, and the bases last.',
  ),
  lawChips: [
    { label: '+', tone: 'par' },
    { label: '−', tone: 's1' },
    { label: '·', tone: 's2' },
    { label: '( )', tone: 'off' },
  ],
  lawSweep: L(
    "qo'shish, ayirish, ko'paytirish, qavs",
    'сложить, вычесть, умножить, скобка',
    'add, subtract, multiply, bracket',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Asoslar bir xil bo'lganda: ko'paytirishda ko'rsatkichlar qo'shiladi, bo'lishda ayiriladi, darajaning darajasida ko'paytiriladi.",
        'При одинаковых основаниях: в умножении показатели складывают, в делении вычитают, в степени степени умножают.',
        'With equal bases: multiplication adds the exponents, division subtracts them, a power of a power multiplies them.',
      ),
      L(
        "Ko'rsatkichlar bir xil bo'lganda asoslarni bitta qavs ostiga yig'ish mumkin. Uchta xossaning uchtasi ham lentadagi muljitellarni sanashdan chiqadi.",
        'При одинаковых показателях основания можно собрать под одну скобку. Все три свойства выходят из счёта множителей в ленте.',
        'With equal exponents the bases gather under one bracket. All three properties come from counting factors in the tape.',
      ),
    ],
  },
  hookCap: L(
    "Xossalar yod olinmaydi, ular sanaladi",
    'Свойства не запоминают, их считают',
    'The properties are not memorised, they are counted',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("yonma-yon guruh -- qo'shish", 'группы рядом — сложение', 'groups side by side means adding'),
    L("takrorlangan guruh -- ko'paytirish", 'повторённая группа — умножение', 'a repeated group means multiplying'),
    L("qisqargan muljitel -- ayirish", 'сокращённый множитель — вычитание', 'a cancelled factor means subtracting'),
  ],
  audio: [
    A('mount', "Uchta xossani ko'rdik. Endi ularni tartibga solamiz.", 'Три свойства мы увидели. Теперь расставим их по порядку.', 'We have seen three properties. Now let us order them.'),
    A('ok', "To'g'ri. Bu blokning asosiy qoidasi.", 'Верно. Это главное правило блока.', 'Correct. This is the main rule of the block.'),
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
// EKRAN 9. MASHQ 1. Uchtasi uchta xossani sinaydi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Uch xossa: qo'shish, ayirish, ko'paytirish. Har birini lentada tekshirish mumkin.",
      'Три свойства: сложить, вычесть, умножить. Каждое можно проверить на ленте.',
      'Three properties: add, subtract, multiply. Each can be checked on the tape.',
    ),
  },
  rounds: [
    {
      template: ['5⁷ · 5⁴ = 5', { slot: 0 }],
      parts: [{ id: 'a', label: '¹¹' }, { id: 'b', label: '²⁸' }, { id: 'c', label: '³' }, { id: 'd', label: '⁷' }],
      answer: ['a'],
      prompt: L("Asoslar bir xil, amal ko'paytirish.", 'Основания одинаковые, действие умножение.', 'Equal bases, the operation is multiplication.'),
      checkNote: L("Yettita beshlik va to'rttasi birga o'n bittani beradi", 'Семь пятёрок и четыре вместе дают одиннадцать', 'Seven fives and four together give eleven'),
      wrongs: [
        { key: 'b', tag: 'Z1', hint: L("Yigirma sakkiz bu yetti karra to'rt. Ko'paytirishda ko'rsatkichlar QO'SHILADI.", 'Двадцать восемь это семь на четыре. При умножении показатели СКЛАДЫВАЮТСЯ.', 'Twenty eight is seven times four. In multiplication the exponents ADD.') },
        { key: '*', tag: 'Z5', hint: L("Muljitellarni sanang: yettita va to'rttasi.", 'Посчитай множители: семь и четыре.', 'Count the factors: seven and four.') },
      ],
    },
    {
      template: ['8¹⁵ : 8³ = 8', { slot: 0 }],
      parts: [{ id: 'e', label: '¹²' }, { id: 'f', label: '¹⁸' }, { id: 'g', label: '⁵' }, { id: 'h', label: '⁴⁵' }],
      answer: ['e'],
      prompt: L("Amal bo'lish.", 'Действие деление.', 'The operation is division.'),
      checkNote: L("Uchta muljitel qisqardi, o'n ikkitasi qoldi", 'Три множителя сократились, двенадцать осталось', 'Three factors cancelled, twelve are left'),
      wrongs: [
        { key: 'g', tag: 'Z6', hint: L("Besh bu o'n besh bo'lish uch. Ko'rsatkichlar bo'linmaydi, ular AYIRILADI.", 'Пять это пятнадцать разделить на три. Показатели не делятся, они ВЫЧИТАЮТСЯ.', 'Five is fifteen divided by three. Exponents do not divide, they SUBTRACT.') },
        { key: 'f', tag: 'Z2', hint: L("O'n sakkiz bu qo'shish. Bo'lishda esa ayiriladi.", 'Восемнадцать это сложение. А при делении вычитают.', 'Eighteen is addition. Division subtracts.') },
        { key: '*', tag: 'Z5', hint: L("O'n beshtadan uchtasi ketadi.", 'Из пятнадцати уходят три.', 'Three of the fifteen go away.') },
      ],
    },
    {
      template: ['(x⁸)³ = x', { slot: 0 }],
      parts: [{ id: 'i', label: '²⁴' }, { id: 'j', label: '¹¹' }, { id: 'k', label: '⁵' }, { id: 'l', label: '⁸' }],
      answer: ['i'],
      prompt: L("Darajaning darajasi.", 'Степень степени.', 'A power of a power.'),
      checkNote: L("Uchta guruh sakkiztadan yigirma to'rtni beradi", 'Три группы по восемь дают двадцать четыре', 'Three groups of eight give twenty four'),
      wrongs: [
        { key: 'j', tag: 'Z2', hint: L("O'n bir bu sakkiz qo'shuv uch. Bu yerda esa guruh TAKRORLANADI.", 'Одиннадцать это восемь плюс три. А здесь группа ПОВТОРЯЕТСЯ.', 'Eleven is eight plus three. Here the group REPEATS.') },
        { key: '*', tag: 'Z5', hint: L("Uchta guruh, har birida sakkizta muljitel.", 'Три группы, в каждой восемь множителей.', 'Three groups with eight factors each.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta misol, uchta xossa.", 'Три примера, три свойства.', 'Three examples, three properties.'),
    A('r1', "Ikkinchisi bo'lish.", 'Второй деление.', 'The second is division.'),
    A('r2', "Uchinchisi darajaning darajasi.", 'Третий степень степени.', 'The third is a power of a power.'),
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
  const LABELS = ['5⁷ · 5⁴ = 5¹¹', '8¹⁵ : 8³ = 8¹²', '(x⁸)³ = x²⁴']
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan lenta: (−x)⁹ karra (−x)¹⁸.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L("Asos manfiy, ko'rsatkichlar katta", 'Основание отрицательное, показатели большие', 'A negative base and big exponents'),
  tape: {
    expr: '(−x)⁹ · (−x)¹⁸',
    item: '(−x)',
    count: 27,
    groups: [9, 18],
    options: [
      { id: 'a', label: '(−x)²⁷' },
      { id: 'b', label: '(−x)¹⁶²' },
      { id: 'c', label: '(−x)⁹' },
      { id: 'd', label: 'x²⁷' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z1', hint: L("Bu to'qqiz karra o'n sakkiz. Guruhlar esa yonma-yon turibdi.", 'Это девять умножить на восемнадцать. А группы стоят рядом.', 'That is nine times eighteen. But the groups stand side by side.') },
      { key: 'd', tag: 'Z3', hint: L("Yigirma yetti toq son, demak minus yo'qolmaydi.", 'Двадцать семь нечётное число, значит минус не уходит.', 'Twenty seven is odd, so the minus does not go away.') },
      { key: '*', tag: 'Z5', hint: L("To'qqizta va o'n sakkizta muljitel birga.", 'Девять и восемнадцать множителей вместе.', 'Nine and eighteen factors together.') },
    ],
    note: L(
      "Ko'rsatkichlar katta bo'lsa ham qoida o'zgarmaydi.",
      'Даже при больших показателях правило то же.',
      'Even with big exponents the rule holds.',
    ),
  },
  audio: [
    A('mount', "Yana lenta, lekin bu safar u uzun.", 'Снова лента, но на этот раз длинная.', 'The tape again, and this time it is long.'),
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
      <FactorTape
        audio={audio}
        expr={S10.tape.expr}
        item={S10.tape.item}
        count={S10.tape.count}
        groups={S10.tape.groups}
        options={S10.tape.options}
        answer={S10.tape.answer}
        wrongs={S10.tape.wrongs}
        note={S10.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 11. MASHQ 3. ASBOBSIZ va KO'RSATKICHI HARFLI.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L("Ko'rsatkich ham harfli", 'Показатель тоже с буквой', 'The exponent has a letter too'),
  template: ['cⁿ · c²ⁿ · c⁵ⁿ = c', { slot: 0 }],
  parts: [
    { id: 'a', label: '⁸ⁿ' },
    { id: 'b', label: '¹⁰ⁿ' },
    { id: 'c', label: '⁸' },
    { id: 'd', label: 'ⁿ³' },
  ],
  answer: ['a'],
  prompt: L(
    "Uchta daraja ko'paytirilgan, asos bir xil. Ko'rsatkichlar harfli.",
    'Три степени перемножены, основание одно. Показатели с буквой.',
    'Three powers multiplied, one base. The exponents carry a letter.',
  ),
  checkNote: L(
    "n qo'shuv 2n qo'shuv 5n teng 8n. Harfli ko'rsatkich ham oddiy ko'rsatkich kabi qo'shiladi",
    'n плюс 2n плюс 5n равно 8n. Буквенный показатель складывается так же, как обычный',
    'n plus 2n plus 5n is 8n. A letter exponent adds just like a number',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("O'n n bu n qo'shuv 2n qo'shuv 7n bo'lardi. Uchinchi ko'rsatkich esa 5n.", 'Десять n вышло бы из n плюс 2n плюс 7n. А третий показатель 5n.', 'Ten n would come from n plus 2n plus 7n. The third exponent is 5n.') },
    { key: 'd', tag: 'Z1', hint: L("Bu ko'paytirish natijasi. Ko'paytirishda esa ko'rsatkichlar QO'SHILADI.", 'Это результат умножения. А при умножении показатели СКЛАДЫВАЮТСЯ.', 'That comes from multiplying. In multiplication the exponents ADD.') },
    { key: '*', tag: 'Z5', hint: L("Uchta ko'rsatkichni qo'shing: n, 2n va 5n.", 'Сложи три показателя: n, 2n и 5n.', 'Add the three exponents: n, 2n and 5n.') },
  ],
  audio: [
    A('mount', "Endi ko'rsatkichda ham harf bor. Qoida o'zgaradimi.", 'Теперь и в показателе буква. Меняется ли правило.', 'Now the exponent has a letter too. Does the rule change.'),
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
// EKRAN 12. TUZOQ (§8.2). Ko'rsatkichlar ko'paytirilgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  task: L(
    "O'quvchi 2³ karra 2⁴ ni hisobladi.",
    'Ученик считал 2³ · 2⁴.',
    'A student worked out 2³ · 2⁴.',
  ),
  ask: L(
    "Yuqoridagi qatordan kelib chiqmagan qatorni toping.",
    'Найди строку, которая не следует из строки над ней.',
    'Find the line that does not follow from the line above it.',
  ),
  rows: [
    { id: 'r1', text: '2³ · 2⁴' },
    { id: 'r2', text: '2¹²' },
    { id: 'r3', text: '4096' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r3: L("Bu qator ikkinchisidan to'g'ri kelib chiqadi: 2¹² haqiqatan 4096. Xato yuqoriroqda.", 'Эта строка верно следует из второй: 2¹² действительно 4096. Ошибка выше.', 'This follows correctly from the second: 2¹² really is 4096. The mistake is higher up.'),
  },
  tags: { r1: 'Z1', r3: 'Z1' },
  proofFill: {
    template: ['2³ · 2⁴ = 2', { slot: 0 }, ' = ', { slot: 1 }],
    parts: [{ id: 'a', label: '⁷' }, { id: 'b', label: '128' }, { id: 'c', label: '¹²' }, { id: 'd', label: '64' }],
    answer: ['a', 'b'],
    prompt: L(
      "Ko'rsatkichlarni to'g'ri hisoblang va qiymatni toping.",
      'Посчитай показатели верно и найди значение.',
      'Work the exponents out correctly and find the value.',
    ),
    checkNote: L("Uchta va to'rtta ikkilik birga yettita, ya'ni 128", 'Три и четыре двойки вместе семь, то есть 128', 'Three and four twos together make seven, that is 128'),
    wrongs: [
      { key: 'a|d', tag: 'Z5', hint: L("Oltmish to'rt bu oltita ikkilik. Bizda esa yettita.", 'Шестьдесят четыре это шесть двоек. А у нас семь.', 'Sixty four is six twos. We have seven.') },
      { key: '*', tag: 'Z1', hint: L("Ko'rsatkichlar qo'shiladi: uch qo'shuv to'rt.", 'Показатели складываются: три плюс четыре.', 'The exponents add: three plus four.') },
    ],
  },
  audio: [
    A('mount', "Hisob to'g'ri bajarilgan, javob esa xato.", 'Вычисление выполнено верно, а ответ неверный.', 'The calculation is right and the answer is wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. Ko'rsatkichlar ko'paytirilgan, holbuki ular qo'shilishi kerak edi.", 'Нашёл. Показатели перемножены, а их надо было сложить.', 'You found it. The exponents were multiplied when they should add.'),
    A('done', "To'g'ri javob bir yuz yigirma sakkiz ekan.", 'Верный ответ оказался сто двадцать восемь.', 'The right answer is one hundred twenty eight.'),
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
// EKRAN 13. KO'CHIRISH. Qo'shma misol: uchta xossa bir yozuvda.
// ============================================================
const S13 = {
  eyebrow: L("QO'SHMA MISOL", 'СОСТАВНОЙ ПРИМЕР', 'A COMPOUND EXAMPLE'),
  title: L('Uchta xossa bitta yozuvda', 'Три свойства в одной записи', 'Three properties in one record'),
  expr: '2⁹ · (2⁵)⁶ · (2⁴)⁵ : 2⁵⁴',
  rounds: [
    {
      template: ['2⁹ · 2', { slot: 0 }, ' · 2', { slot: 1 }, ' : 2⁵⁴'],
      parts: [{ id: 'a', label: '³⁰' }, { id: 'b', label: '²⁰' }, { id: 'c', label: '¹¹' }, { id: 'd', label: '⁹' }],
      answer: ['a', 'b'],
      prompt: L(
        "Avval qavslarni ochamiz: darajaning darajasida ko'rsatkichlar ko'paytiriladi.",
        'Сначала раскроем скобки: в степени степени показатели умножают.',
        'First open the brackets: a power of a power multiplies the exponents.',
      ),
      checkNote: L("Besh karra olti bu 30, to'rt karra besh bu 20", 'Пять на шесть это 30, четыре на пять это 20', 'Five times six is 30, four times five is 20'),
      wrongs: [
        { key: 'c|b', tag: 'Z2', hint: L("O'n bir bu besh qo'shuv olti. Darajaning darajasida esa ko'paytiriladi.", 'Одиннадцать это пять плюс шесть. А в степени степени умножают.', 'Eleven is five plus six. A power of a power multiplies.') },
        { key: '*', tag: 'Z2', hint: L("Har qavsda ko'rsatkichlarni ko'paytiring.", 'В каждой скобке умножь показатели.', 'Multiply the exponents in each bracket.') },
      ],
    },
    {
      template: ['2', { slot: 0 }, ' = ', { slot: 1 }],
      parts: [{ id: 'e', label: '⁵' }, { id: 'f', label: '32' }, { id: 'g', label: '⁵⁹' }, { id: 'h', label: '10' }],
      answer: ['e', 'f'],
      prompt: L(
        "Endi ko'paytirishda qo'shamiz, bo'lishda ayiramiz: 9 qo'shuv 30 qo'shuv 20 ayirish 54.",
        'Теперь в умножении складываем, в делении вычитаем: 9 плюс 30 плюс 20 минус 54.',
        'Now add for multiplication and subtract for division: 9 plus 30 plus 20 minus 54.',
      ),
      checkNote: L("Ko'rsatkich besh, qiymat esa 32", 'Показатель пять, а значение 32', 'The exponent is five and the value is 32'),
      wrongs: [
        { key: 'g|f', tag: 'Z6', hint: L("59 bu bo'lishdan OLDINGI ko'rsatkich. Undan 54 ni ayirish qoldi.", '59 это показатель ДО деления. Осталось вычесть 54.', '59 is the exponent BEFORE the division. Subtracting 54 is still to do.') },
        { key: '*', tag: 'Z6', hint: L("Avval uchta ko'rsatkichni qo'shing, keyin 54 ni ayiring.", 'Сначала сложи три показателя, потом вычти 54.', 'Add the three exponents first, then subtract 54.') },
      ],
    },
  ],
  reward: {
    title: L('Uchta xossa ketma-ket ishladi', 'Три свойства сработали подряд', 'Three properties worked in a row'),
    text: L(
      "Avval darajaning darajasi, keyin ko'paytirish, oxirida bo'lish. Har qadamda faqat ko'rsatkichlar bilan ish bo'ldi.",
      'Сначала степень степени, потом умножение, в конце деление. На каждом шаге работа шла только с показателями.',
      'First a power of a power, then multiplication, then division. Every step worked only with exponents.',
    ),
  },
  audio: [
    A('mount', "Oxirgi misol eng qiyini: unda uchta xossa birga.", 'Последний пример самый трудный: в нём три свойства вместе.', 'The last example is the hardest: three properties at once.'),
    A('r1', "Qavslar ochildi. Endi qo'shish va ayirish.", 'Скобки раскрыты. Теперь сложение и вычитание.', 'The brackets are open. Now adding and subtracting.'),
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
      prompt: 'a⁶ · a⁹',
      ok: L("Asoslar bir xil, ko'rsatkichlar qo'shiladi.", 'Основания одинаковые, показатели складываются.', 'Equal bases, the exponents add.'),
      items: [
        { id: 'a', label: 'a¹⁵', correct: true },
        { id: 'b', label: 'a⁵⁴', tag: 'Z1', hint: L("54 bu 6 karra 9. Ko'paytirishda ko'rsatkichlar qo'shiladi.", '54 это 6 умножить на 9. При умножении показатели складывают.', '54 is 6 times 9. Multiplication adds the exponents.') },
        { id: 'c', label: 'a³', tag: 'Z2', hint: L("Uch bu ayirish, ya'ni bo'lishning javobi.", 'Три это вычитание, то есть ответ для деления.', 'Three is subtraction, the answer for division.') },
        { id: 'd', label: '2a¹⁵', tag: 'Z2', hint: L("Koeffitsiyent yig'indidan kelardi.", 'Коэффициент пришёл бы от суммы.', 'A coefficient would come from a sum.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: '(b⁵)⁴',
      ok: L("Darajaning darajasida ko'paytiriladi.", 'В степени степени умножают.', 'A power of a power multiplies.'),
      items: [
        { id: 'a', label: 'b²⁰', correct: true },
        { id: 'b', label: 'b⁹', tag: 'Z2', hint: L("To'qqiz bu besh qo'shuv to'rt. Bu yerda guruh takrorlanadi.", 'Девять это пять плюс четыре. А здесь группа повторяется.', 'Nine is five plus four. Here the group repeats.') },
        { id: 'c', label: 'b⁶²⁵', tag: 'Z4', hint: L("Bu asosni ko'paytirish natijasi. Ko'paytirilishi kerak bo'lgan narsa ko'rsatkichlar.", 'Это результат перемножения основания. А перемножать надо показатели.', 'That multiplies the base. The exponents are what multiply.') },
        { id: 'd', label: 'b⁵', tag: 'Z5', hint: L("Tashqi ko'rsatkich hisobga olinmadi.", 'Внешний показатель не учтён.', 'The outer exponent was ignored.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: 'x¹² : x⁵',
      ok: L("Bo'lishda ko'rsatkichlar ayiriladi.", 'При делении показатели вычитаются.', 'Division subtracts the exponents.'),
      items: [
        { id: 'a', label: 'x⁷', correct: true },
        { id: 'b', label: 'x¹⁷', tag: 'Z2', hint: L("O'n yetti bu qo'shish. Bo'lishda ayiriladi.", 'Семнадцать это сложение. При делении вычитают.', 'Seventeen is addition. Division subtracts.') },
        { id: 'c', label: 'x⁶⁰', tag: 'Z1', hint: L("Oltmish bu ko'paytirish.", 'Шестьдесят это умножение.', 'Sixty is multiplication.') },
        { id: 'd', label: 'x²', tag: 'Z6', hint: L("Ikki bu 12 bo'lish 5 emas ham. Ko'rsatkichlar AYIRILADI: 12 ayirish 5.", 'Два это и не 12 разделить на 5. Показатели ВЫЧИТАЮТСЯ: 12 минус 5.', 'Two is not 12 divided by 5 either. The exponents SUBTRACT: 12 minus 5.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("a⁴ · b⁴ ni qanday yozish mumkin?", 'Как можно записать a⁴ · b⁴?', 'How can a⁴ · b⁴ be written?'),
      ok: L("Ko'rsatkichlar bir xil, asoslar qavsga yig'iladi.", 'Показатели одинаковые, основания собираются в скобку.', 'Equal exponents, the bases gather into a bracket.'),
      items: [
        { id: 'a', label: '(ab)⁴', correct: true },
        { id: 'b', label: 'a⁸', tag: 'Z3', hint: L("Asoslar boshqa, ularni qo'shib bo'lmaydi. Va b yo'qolib qolmaydi.", 'Основания разные, их не сложить. И b не исчезает.', 'The bases differ, they cannot be added. And the b does not vanish.') },
        { id: 'c', label: '(ab)⁸', tag: 'Z2', hint: L("Ko'rsatkich o'zgarmaydi: har juftlikda to'rtta emas, bitta a va bitta b bor.", 'Показатель не меняется: в каждой паре не четыре, а одна a и одна b.', 'The exponent does not change: each pair has one a and one b, not four.') },
        { id: 'd', label: 'ab⁴', tag: 'Z5', hint: L("Bunday yozuvda faqat b darajaga kiradi. Qavs kerak.", 'В такой записи в степень входит только b. Нужна скобка.', 'In that record only the b enters the power. A bracket is needed.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsdagi yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi darajaning darajasi.", 'Второй степень степени.', 'The second is a power of a power.'),
    A('2', "Uchinchisi bo'lish.", 'Третий деление.', 'The third is division.'),
    A('3', "Oxirgisi asoslar haqida.", 'Последний про основания.', 'The last is about the bases.'),
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
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Uchta xossa, bitta lenta", 'Три свойства, одна лента', 'Three properties, one tape'),
  gate: S1.gate,
  fix: {
    tokens: ['a⁷'],
    value: '7',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Uchta va to'rtta muljitel birga yettita bo'ladi. Shuning uchun ko'paytirishda ko'rsatkichlar qo'shiladi.",
    'Три и четыре множителя вместе дают семь. Поэтому при умножении показатели складываются.',
    'Three and four factors together make seven. That is why multiplication adds the exponents.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    add: L("qo'shiladi", 'складываются', 'they add'),
    mul: L("ko'paytiriladi", 'умножаются', 'they multiply'),
    same: L("o'zgarmaydi", 'не меняются', 'they stay'),
    base: L("asos o'zgaradi", 'меняется основание', 'the base changes'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['a³ · a⁴ → a⁷', '(a³)⁴ → a¹²', 'a⁷ : a⁴ → a³', 'a³ · b³ → (ab)³'],
  twoLabel: L('Uch amal', 'Три действия', 'Three operations'),
  twoA: '·  →  +      :  →  −',
  twoB: '( )ⁿ  →  ·',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "bir had va uning standart shakli",
    'одночлен и его стандартный вид',
    'a monomial and its standard form',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Uchta xossaning uchtasi ham bitta ishdan chiqdi: lentani sanashdan.", 'Все три свойства вышли из одной работы: из счёта ленты.', 'All three properties came from one job: counting the tape.'),
    A('mount', "Keyingi darsda bir had va uning standart shakli bo'ladi.", 'В следующем уроке будет одночлен и его стандартный вид.', 'The next lesson brings the monomial and its standard form.'),
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

export default function Grade7Dars14({
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
    else console.log('[Grade7 Dars14] onFinished', payload)
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
