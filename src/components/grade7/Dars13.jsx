// ============================================================================
// 7-sinf, Dars 13. NATURAL KO'RSATKICHLI DARAJA.
// (Степень с натуральным показателем)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md. B3 blokining BIRINCHI darsi.
// ASBOB: `FactorTape` -- muljitellar lentasi, blokning asbobi.
//
// DARAJA QIYINLIGI. Metodist qarori 2026-08-20: «yosh o'sadi, qiyinlik esa
// o'smaydi» -- bu loyihalash xatosi. Shuning uchun bu darsda 2 karra 2 karra 2
// kabi misollar YO'Q: ular beshinchi sinf darajasi. Qiyinlik YOZUVNING
// TUZILISHIDAN keladi, hisobning og'irligidan emas:
//   -- harfli ifoda: (3a)³, (−2x)⁴, (−3b)³
//   -- ishora va koeffitsiyent birga: −a⁴ va (−a)⁴
//   -- taqqoslash: 2¹⁰ va 10², 3⁵ va 5³
//   -- ko'chirish: 2¹⁰ 2⁷ dan NECHA MARTA katta (uchga ko'p emas, sakkiz marta)
//
// BLOKNING ASOSIY XATOSI: yig'indi va ko'paytma qavatlari aralashadi,
// a² qo'shuv a² ni o'quvchi a⁴ deb yozadi. Lenta ularni ajratadi: yig'indi
// KOEFFITSIYENTNI o'stiradi, ko'paytma esa KO'RSATKICHNI.
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
  FactorTape,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  StairsReveal,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_13'
const LESSON_TITLE = L("Natural ko'rsatkichli daraja", 'Степень с натуральным показателем', 'A power with a natural exponent')
const LESSON_NO = L('13-dars', 'Урок 13', 'Lesson 13')
const TOTAL = 15

const BLOCK = { label: L('B3-blok', 'Блок Б3', 'Block B3'), from: 13, to: 17, current: 13 }

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
  Z1: L("yig'indi darajaga aylantirildi", 'сумму свернули в степень', 'a sum was turned into a power'),
  Z2: L('koeffitsiyent darajaga kirmadi', 'коэффициент не вошёл в степень', 'the coefficient stayed out of the power'),
  Z3: L('ishora hisobga olinmadi', 'знак не учтён', 'the sign was ignored'),
  Z4: L("ko'rsatkich asos bilan almashdi", 'показатель спутан с основанием', 'exponent confused with the base'),
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
// EKRAN 1. XUK. Ikki o'n va o'n ikki: qaysi biri katta.
// Bu «asos katta bo'lsa daraja ham katta» degan taxminni sindiradi.
// ============================================================
const S1 = {
  eyebrow: L('DARAJA', 'СТЕПЕНЬ', 'POWERS'),
  noBack: true,
  noNotes: true,
  title: L('Qaysi biri katta', 'Что больше', 'Which is bigger'),
  gate: {
    source: { kind: 'plain', tokens: ['2¹⁰', '?', '10²'] },
    rows: [
      { tokens: ['10²'], value: '100' },
      { tokens: ['2¹⁰'], value: '1024' },
    ],
  },
  probe: {
    question: L(
      "Biri 10² ni tanladi: asos katta. Nega natija boshqa chiqdi?",
      'Один выбрал 10²: основание больше. Почему вышло иначе?',
      'One chose 10²: the base is bigger. Why did it come out otherwise?',
    ),
    items: [
      {
        id: 'count',
        label: L(
          "Ko'rsatkich muljitellar SONINI beradi: o'nta ikkilik ko'proq",
          'Показатель задаёт ЧИСЛО множителей: десять двоек дают больше',
          'The exponent sets the NUMBER of factors: ten twos give more',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Buni lentada sanab ko'ramiz.",
          'Прогноз принят. Посчитаем это на ленте.',
          'Your prediction is taken. We will count it on the tape.',
        ),
      },
      {
        id: 'base',
        label: L("Asos muhimroq, hisobda xato", 'Основание важнее, в счёте ошибка', 'The base matters more, a slip in the count'),
        hint: L(
          "Hisob to'g'ri: o'nta ikkilikning ko'paytmasi ming yigirma to'rt. Demak asos hamma narsani hal qilmaydi.",
          'Счёт верен: произведение десяти двоек это тысяча двадцать четыре. Значит основание решает не всё.',
          'The arithmetic is right: ten twos multiply to one thousand twenty four. So the base does not decide everything.',
        ),
      },
      {
        id: 'swap',
        label: L("Almashtirsa ham natija bir xil", 'Если поменять их местами, выйдет то же', 'Swapping them gives the same'),
        hint: L(
          "Tabloga qarang: yuz va ming yigirma to'rt. Almashtirish natijani o'zgartiradi.",
          'Посмотри на табло: сто и тысяча двадцать четыре. Обмен меняет результат.',
          'Look at the boards: one hundred and one thousand twenty four. Swapping changes the result.',
        ),
      },
      {
        id: 'add',
        label: L("Darajada asos ko'rsatkichga ko'paytiriladi", 'В степени основание умножают на показатель', 'A power multiplies the base by the exponent'),
        hint: L(
          "Unda ikki karra o'n yigirma bo'lardi. Tabloda esa ming yigirma to'rt.",
          'Тогда вышло бы два умножить на десять, то есть двадцать. А на табло тысяча двадцать четыре.',
          'That would give two times ten, twenty. But the board shows one thousand twenty four.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikkinchi blok tugadi. Endi darajalar.", 'Второй блок закончен. Теперь степени.', 'The second block is done. Now powers.'),
    A('mount', "Savol oddiy ko'rinadi: ikkining o'ninchi darajasi yoki o'nning kvadrati.", 'Вопрос кажется простым: два в десятой степени или десять в квадрате.', 'The question looks simple: two to the tenth or ten squared.'),
    A('mount', "Tabloda ikkala qiymat turibdi. Ular juda boshqa.", 'На табло оба значения. Они очень разные.', 'The boards show both values. They are very different.'),
    A('mount', "Sizningcha sabab nimada. Bu taxmin, uning uchun baho yo'q.", 'Как думаешь, в чём причина. Это прогноз, оценки за него нет.', 'What do you think the reason is. This is a prediction, it is not graded.'),
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
// EKRAN 2. TAYANCH. KVOTA EKRANI (§4.2). Uchtasi ham 7-sinf darajasida.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      prompt: '(−2)³',
      ok: L("Uchta manfiy muljitel manfiy natija beradi.", 'Три отрицательных множителя дают отрицательный результат.', 'Three negative factors give a negative result.'),
      items: [
        { id: 'a', label: '−8', correct: true },
        { id: 'b', label: '8', tag: 'Z3', hint: L("Minus uch marta ko'paytiriladi: minus karra minus musbat, yana minus karra manfiy.", 'Минус умножается трижды: минус на минус плюс, ещё минус даёт минус.', 'The minus multiplies three times: minus times minus is plus, one more minus turns it negative.') },
        { id: 'c', label: '−6', tag: 'Z4', hint: L("−6 bu minus ikki karra uch. Daraja esa ko'paytma, ko'rsatkich muljitel emas.", '−6 это минус два умножить на три. А степень это произведение, показатель не множитель.', '−6 is minus two times three. A power is a product and the exponent is not a factor.') },
        { id: 'd', label: '−9', tag: 'Z4', hint: L("−9 bu minus uchning kvadrati bo'lardi. Bizda asos minus ikki.", '−9 было бы минус три в квадрате. У нас основание минус два.', '−9 would be minus three squared. Here the base is minus two.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("a + a + a + a ni ko'paytma shaklida yozing.", 'Запиши a + a + a + a в виде произведения.', 'Write a + a + a + a as a product.'),
      ok: L("Bir xil qo'shiluvchilar KOEFFITSIYENT beradi.", 'Одинаковые слагаемые дают КОЭФФИЦИЕНТ.', 'Equal terms give a COEFFICIENT.'),
      items: [
        { id: 'a', label: '4a', correct: true },
        { id: 'b', label: 'a⁴', tag: 'Z1', hint: L("a⁴ bu to'rtta a ning KO'PAYTMASI. Bizda esa yig'indi.", 'a⁴ это ПРОИЗВЕДЕНИЕ четырёх a. А у нас сумма.', 'a⁴ is the PRODUCT of four a. Here we have a sum.') },
        { id: 'c', label: 'a + 4', tag: 'Z1', hint: L("Qo'shiluvchilar to'rtta va ular bir xil, demak to'rt karra a.", 'Слагаемых четыре и они одинаковые, значит четыре умножить на a.', 'There are four equal terms, so four times a.') },
        { id: 'd', label: '4a⁴', tag: 'Z1', hint: L("Bu ikki amalni birga qo'shib yuborish. Yig'indi faqat koeffitsiyent beradi.", 'Это смешение двух действий. Сумма даёт только коэффициент.', 'That mixes two operations. A sum gives only a coefficient.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("3 · 3 · 3 · 3 · 3 ni daraja shaklida yozing.", 'Запиши 3 · 3 · 3 · 3 · 3 в виде степени.', 'Write 3 · 3 · 3 · 3 · 3 as a power.'),
      ok: L("Ko'rsatkich muljitellar sonini beradi.", 'Показатель задаёт число множителей.', 'The exponent gives the number of factors.'),
      items: [
        { id: 'a', label: '3⁵', correct: true },
        { id: 'b', label: '5³', tag: 'Z4', hint: L("Bu yerda asos uch, muljitellar esa beshta. Asos pastda, ko'rsatkich yuqorida.", 'Здесь основание три, а множителей пять. Основание внизу, показатель наверху.', 'Here the base is three and there are five factors. The base goes below, the exponent above.') },
        { id: 'c', label: '15', tag: 'Z4', hint: L("15 bu 3 karra 5. Ko'paytmani hisoblash boshqa ish, uni daraja bilan YOZISH boshqa.", '15 это 3 умножить на 5. Посчитать произведение это другое, а ЗАПИСАТЬ степенью это другое.', '15 is 3 times 5. Computing a product is one thing, WRITING it as a power is another.') },
        { id: 'd', label: '3 · 5', tag: 'Z4', hint: L("Bu ham ko'paytma, lekin daraja emas. Daraja yozuvi asos va ko'rsatkichdan tuziladi.", 'Это тоже произведение, но не степень. Запись степени состоит из основания и показателя.', 'That is a product too but not a power. A power is written as a base and an exponent.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta savolga javob beramiz, ular bugun kerak.", 'Ответим на три вопроса, они сегодня нужны.', 'Three things to recall, they are needed today.'),
    A('1', "Ikkinchisi yig'indi haqida.", 'Второе про сумму.', 'The second is about a sum.'),
    A('2', "Uchinchisi ko'paytma haqida.", 'Третье про произведение.', 'The third is about a product.'),
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
// EKRAN 3. LENTA. Birinchi misol DARROV harfli va koeffitsiyentli:
// (3a)³. Lenta uchta bir xil muljitelni ko'rsatadi, ularning HAR BIRIDA
// uchlik ham, a ham bor.
// ============================================================
const S3 = {
  eyebrow: L('LENTA', 'ЛЕНТА', 'THE TAPE'),
  title: L('Yozuvni muljitellarga yoyamiz', 'Разворачиваем запись в множители', 'Unfolding the record into factors'),
  tape: {
    expr: '(3a)³',
    item: '3a',
    count: 3,
    options: [
      { id: 'a', label: '27a³' },
      { id: 'b', label: '9a³' },
      { id: 'c', label: '3a³' },
      { id: 'd', label: '27a' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'c', tag: 'Z2', hint: L("Lentada uchta uchlik bor, ya'ni 3 karra 3 karra 3 teng 27. Uchlik ham darajaga kiradi.", 'В ленте три тройки, то есть 3 умножить на 3 умножить на 3 равно 27. Тройка тоже входит в степень.', 'The tape has three threes, so 3 times 3 times 3 is 27. The three enters the power too.') },
      { key: 'b', tag: 'Z5', hint: L("To'qqiz bu ikkita uchlikning ko'paytmasi. Lentada esa uchta.", 'Девять это произведение двух троек. А в ленте их три.', 'Nine is the product of two threes. The tape has three of them.') },
      { key: 'd', tag: 'Z5', hint: L("Lentada uchta a ham bor, demak a uchinchi darajada.", 'В ленте есть и три a, значит a в третьей степени.', 'The tape also has three a, so a is cubed.') },
      { key: '*', tag: 'Z5', hint: L("Lentani sanang: uchta uchlik va uchta a.", 'Посчитай ленту: три тройки и три a.', 'Count the tape: three threes and three a.') },
    ],
    note: L(
      "Qavs ichidagi HAR BIR muljitel darajaga kiradi: uchlik ham, harf ham.",
      'В степень входит КАЖДЫЙ множитель из скобки: и тройка, и буква.',
      'EVERY factor from the bracket enters the power: the three and the letter.',
    ),
  },
  reward: {
    title: L("Ko'rsatkich bu sanoq", 'Показатель это счёт', 'The exponent is a count'),
    text: L(
      "Uch degani «uchta bir xil muljitel». Lentani yozib, ularni sanash yetadi -- yod olish kerak emas.",
      'Три значит «три одинаковых множителя». Достаточно выписать ленту и посчитать — запоминать нечего.',
      'Three means three equal factors. Write out the tape and count — nothing to memorise.',
    ),
  },
  audio: [
    A('mount', "Yozuvni bosing, u muljitellarga yoyiladi.", 'Нажми на запись, она развернётся в множители.', 'Tap the record and it unfolds into factors.'),
    A('open', "Uchta bir xil muljitel. Har birida uchlik ham, harf ham bor.", 'Три одинаковых множителя. В каждом и тройка, и буква.', 'Three equal factors. Each holds the three and the letter.'),
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
// EKRAN 4. FARQLASH. 2a³ va (2a)³ -- qavs bor yoki yo'q. KVOTA EKRANI.
// Tekshiruv darslikning usuli bilan: a teng 2 ni qo'yish.
// ============================================================
const S4 = {
  eyebrow: L('QAVS QAYERDA', 'ГДЕ СКОБКА', 'WHERE THE BRACKET IS'),
  title: L("Ikkilik lentada yoki lentadan tashqarida", 'Двойка в ленте или вне ленты', 'The two inside the tape or outside it'),
  expr: '2a³   va   (2a)³',
  probe: {
    question: L(
      "a teng 2 bo'lsa, bu ikki yozuv nechaga teng?",
      'Если a = 2, чему равны эти две записи?',
      'If a = 2, what do these two records equal?',
    ),
    items: [
      { id: 'a', correct: true, label: L('16 va 64', '16 и 64', '16 and 64') },
      {
        id: 'b', tag: 'Z2',
        label: L('64 va 64', '64 и 64', '64 and 64'),
        hint: L("Birinchi yozuvda ikkilik lentadan TASHQARIDA: faqat a uch marta ko'paytiriladi, keyin natija ikkiga ko'paytiriladi. 2 karra 8 teng 16.", 'В первой записи двойка ВНЕ ленты: трижды умножается только a, потом результат умножают на два. 2 умножить на 8 это 16.', 'In the first record the two is OUTSIDE the tape: only a is cubed, then the result is doubled. 2 times 8 is 16.'),
      },
      {
        id: 'c', tag: 'Z2',
        label: L('16 va 16', '16 и 16', '16 and 16'),
        hint: L("Ikkinchi yozuvda qavs bor, demak ikkilik ham darajaga kiradi: 2a karra 2a karra 2a teng 8a³, ya'ni 64.", 'Во второй записи есть скобка, значит двойка тоже входит в степень: 2a на 2a на 2a это 8a³, то есть 64.', 'The second has a bracket, so the two enters the power: 2a times 2a times 2a is 8a³, that is 64.'),
      },
      {
        id: 'd', tag: 'Z6',
        label: L('8 va 24', '8 и 24', '8 and 24'),
        hint: L("a teng 2 da a kub sakkiz bo'ladi, keyin ikkiga ko'paytirish qoldi. Ikkinchisida esa qavs bor.", 'При a = 2 куб a равен восьми, потом осталось умножить на два. А во второй есть скобка.', 'With a = 2 the cube of a is eight, then it must be doubled. And the second one has a bracket.'),
      },
    ],
    ok: L(
      "Qavs yo'q bo'lsa, darajaga faqat harf kiradi. Qavs bor bo'lsa, ichidagi hammasi kiradi.",
      'Без скобки в степень входит только буква. Со скобкой входит всё, что внутри.',
      'Without a bracket only the letter enters the power. With one, everything inside enters.',
    ),
  },
  audio: [
    A('mount', "Ikki yozuv juda o'xshash, farq faqat qavsda.", 'Две записи очень похожи, разница только в скобке.', 'Two records look alike, the only difference is the bracket.'),
    A('mount', "a o'rniga ikkini qo'yib tekshiring.", 'Проверь, подставив вместо a двойку.', 'Check by putting two in place of a.'),
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
        data={S4.probe}
        cols={2}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 5. IKKI QAVAT. a² qo'shuv a² va a² karra a². Bir xil ikkita
// element, lekin biri KOEFFITSIYENTNI o'stiradi, ikkinchisi KO'RSATKICHNI.
// Bu blokning eng qimmat xatosining o'zagi.
// ============================================================
const S5 = {
  eyebrow: L('IKKI QAVAT', 'ДВА УРОВНЯ', 'TWO LEVELS'),
  title: L("Bir xil ikkita element, ikki xil natija", 'Два одинаковых элемента, два разных итога', 'Two equal elements, two different results'),
  rounds: [
    {
      expr: 'a² + a²',
      item: 'a²',
      count: 2,
      join: '+',
      options: [
        { id: 'a', label: '2a²' },
        { id: 'b', label: 'a⁴' },
        { id: 'c', label: 'a²' },
        { id: 'd', label: '2a⁴' },
      ],
      answer: 'a',
      wrongs: [
        { key: 'b', tag: 'Z1', hint: L("Lentada QO'SHILUVCHILAR turibdi, muljitel emas. Yig'indi ko'rsatkichni o'stirmaydi.", 'В ленте СЛАГАЕМЫЕ, а не множители. Сумма не растит показатель.', 'The tape holds TERMS, not factors. A sum does not grow the exponent.') },
        { key: '*', tag: 'Z1', hint: L("Ikkita bir xil qo'shiluvchi ikki karra shu narsani beradi.", 'Два одинаковых слагаемых дают два раза это же.', 'Two equal terms give twice the same thing.') },
      ],
      note: L("Yig'indi KOEFFITSIYENTNI o'stirdi.", 'Сумма вырастила КОЭФФИЦИЕНТ.', 'The sum grew the COEFFICIENT.'),
    },
    {
      expr: 'a² · a²',
      item: 'a²',
      count: 2,
      join: '·',
      options: [
        { id: 'a', label: 'a⁴' },
        { id: 'b', label: '2a²' },
        { id: 'c', label: 'a²' },
        { id: 'd', label: 'a⁸' },
      ],
      answer: 'a',
      wrongs: [
        { key: 'b', tag: 'Z1', hint: L("Bu yig'indining javobi. Bu yerda esa muljitellar: ikkita a kvadrat, ya'ni to'rtta a.", 'Это ответ для суммы. А здесь множители: два a в квадрате, то есть четыре a.', 'That is the answer for a sum. Here there are factors: two a squared, that is four a.') },
        { key: 'd', tag: 'Z5', hint: L("Sakkiz bu ikki kvadratni ko'paytirish. Muljitellar esa QO'SHILADI: ikki qo'shuv ikki.", 'Восемь это перемножение двух квадратов. А множители СКЛАДЫВАЮТСЯ: два плюс два.', 'Eight comes from multiplying the two squares. But the factors ADD UP: two plus two.') },
        { key: '*', tag: 'Z5', hint: L("Har a kvadratda ikkita a bor, jami to'rtta.", 'В каждом a в квадрате два a, всего четыре.', 'Each a squared holds two a, four in all.') },
      ],
      note: L("Ko'paytma esa KO'RSATKICHNI o'stirdi.", 'А произведение вырастило ПОКАЗАТЕЛЬ.', 'And the product grew the EXPONENT.'),
    },
  ],
  reward: {
    title: L('Ikki qavat aralashmaydi', 'Два уровня не смешиваются', 'The two levels do not mix'),
    text: L(
      "Qo'shish bir xil narsalarni SANAYDI va koeffitsiyent beradi. Ko'paytirish ularni BIRLASHTIRADI va ko'rsatkich beradi.",
      'Сложение СЧИТАЕТ одинаковые вещи и даёт коэффициент. Умножение их СОЕДИНЯЕТ и даёт показатель.',
      'Adding COUNTS equal things and gives a coefficient. Multiplying JOINS them and gives an exponent.',
    ),
  },
  audio: [
    A('mount', "Ikki yozuv, ikkalasida ham a kvadrat ikki marta. Belgi esa boshqa.", 'Две записи, в обеих a в квадрате дважды. А знак разный.', 'Two records, both with a squared twice. But the sign differs.'),
    A('r1', "Endi ikkinchisi. Diqqat: belgi ko'paytirish.", 'Теперь второе. Внимание: знак умножение.', 'Now the second. Careful: the sign is a times.'),
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
      {!done ? (
        <FactorTape
          key={idx}
          audio={audio}
          expr={r.expr}
          item={r.item}
          count={r.count}
          join={r.join}
          options={r.options}
          answer={r.answer}
          wrongs={r.wrongs}
          note={r.note}
          disabled={!canAnswer}
          onStep={(s) => audio.step(s)}
          onSolved={(res) => {
            const next = idx + 1
            setIdx(next)
            audio.step('r' + next)
            onAnswer({ ...res, screen, role: 'explain', part: 'r' + (idx + 1) })
          }}
        />
      ) : (
        <>
          <DoneRow>a² + a² = 2a²</DoneRow>
          <DoneRow>a² · a² = a⁴</DoneRow>
        </>
      )}
    </Frame>
  )
}

// ============================================================
// EKRAN 6. O'ZINGIZ. (−2x)⁴ -- ishora ham, koeffitsiyent ham birga.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Ishora ham qavs ichida", 'Знак тоже в скобке', 'The sign is inside the bracket too'),
  tape: {
    expr: '(−2x)⁴',
    item: '−2x',
    count: 4,
    options: [
      { id: 'a', label: '16x⁴' },
      { id: 'b', label: '−16x⁴' },
      { id: 'c', label: '8x⁴' },
      { id: 'd', label: '−8x⁴' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z3', hint: L("To'rtta manfiy muljitel MUSBAT natija beradi: minuslar juft, ular bir-birini yo'qotadi.", 'Четыре отрицательных множителя дают ПОЛОЖИТЕЛЬНЫЙ результат: минусов чётное число, они гасят друг друга.', 'Four negative factors give a POSITIVE result: an even number of minuses cancels out.') },
      { key: 'c', tag: 'Z5', hint: L("Sakkiz bu uchta ikkilikning ko'paytmasi. Lentada esa to'rtta.", 'Восемь это произведение трёх двоек. А в ленте их четыре.', 'Eight is the product of three twos. The tape has four.') },
      { key: '*', tag: 'Z3', hint: L("Lentani sanang: to'rtta ikkilik, to'rtta x va to'rtta minus.", 'Посчитай ленту: четыре двойки, четыре x и четыре минуса.', 'Count the tape: four twos, four x and four minuses.') },
    ],
    note: L(
      "Juft ko'rsatkichda minuslar yo'qoladi, toq ko'rsatkichda bittasi qoladi.",
      'При чётном показателе минусы уходят, при нечётном один остаётся.',
      'With an even exponent the minuses cancel, with an odd one a single minus stays.',
    ),
  },
  audio: [
    A('mount', "Endi o'zingiz. Qavs ichida ishora ham, son ham, harf ham bor.", 'Теперь сам. В скобке и знак, и число, и буква.', 'Now on your own. The bracket holds a sign, a number and a letter.'),
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
// EKRAN 7. CHEGARAVIY HOLAT. −a⁴ va (−a)⁴: minus lentada yoki tashqarida.
// ============================================================
const S7 = {
  eyebrow: L('MINUS QAYERDA', 'ГДЕ МИНУС', 'WHERE THE MINUS IS'),
  title: L('Minus lentada yoki tashqarida', 'Минус в ленте или вне ленты', 'The minus inside the tape or outside'),
  tape: {
    expr: '−a⁴',
    item: 'a',
    count: 4,
    outside: '−',
    options: [
      { id: 'a', label: L('a = 2 da −16', 'при a = 2 это −16', 'with a = 2 it is −16') },
      { id: 'b', label: L('a = 2 da 16', 'при a = 2 это 16', 'with a = 2 it is 16') },
      { id: 'c', label: L('a = 2 da −8', 'при a = 2 это −8', 'with a = 2 it is −8') },
      { id: 'd', label: L('a = 2 da 8', 'при a = 2 это 8', 'with a = 2 it is 8') },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z3', hint: L("Minus lentaga KIRMADI, u tashqarida turibdi. Demak avval to'rtta a ko'paytiriladi, keyin natija manfiy bo'ladi.", 'Минус НЕ ВОШЁЛ в ленту, он стоит снаружи. Значит сначала перемножаются четыре a, потом результат становится отрицательным.', 'The minus did NOT enter the tape, it stands outside. So the four a multiply first and the result then turns negative.') },
      { key: '*', tag: 'Z5', hint: L("Lentada to'rtta a bor: ikki karra ikki karra ikki karra ikki teng o'n olti. Minus esa tashqarida.", 'В ленте четыре a: два на два на два на два это шестнадцать. А минус снаружи.', 'The tape has four a: two times two times two times two is sixteen. The minus is outside.') },
    ],
    note: L(
      "Lentadan tashqaridagi minus faqat OXIRIDA ishlaydi.",
      'Минус вне ленты работает только В КОНЦЕ.',
      'A minus outside the tape acts only AT THE END.',
    ),
  },
  bonus: {
    title: L('Qavs qo\'yilsa boshqa natija', 'Со скобкой результат другой', 'With a bracket the result differs'),
    text: L(
      "(−a)⁴ da minus har bir muljitelda bo'ladi, to'rttasi juft, va natija musbat: 16. Bir xil sonlar, boshqa yozuv, boshqa qiymat.",
      'В (−a)⁴ минус есть в каждом множителе, их четыре, чётное число, и результат положительный: 16. Те же числа, другая запись, другое значение.',
      'In (−a)⁴ the minus sits in every factor, four of them, an even count, and the result is positive: 16. Same numbers, different record, different value.',
    ),
  },
  audio: [
    A('mount', "Bu yozuvda minus qavsdan tashqarida turibdi. Lentani ochib ko'ring.", 'В этой записи минус стоит вне скобки. Раскрой ленту.', 'Here the minus stands outside the bracket. Unfold the tape.'),
    A('open', "Lentada faqat harflar bor, minus esa tashqarida qoldi.", 'В ленте только буквы, а минус остался снаружи.', 'The tape holds only letters, the minus stayed outside.'),
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
      <FactorTape
        audio={audio}
        expr={S7.tape.expr}
        item={S7.tape.item}
        count={S7.tape.count}
        outside={S7.tape.outside}
        options={S7.tape.options}
        answer={S7.tape.answer}
        wrongs={S7.tape.wrongs}
        note={S7.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
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
    { id: 'f1', label: L("daraja bu bir xil muljitellar ko'paytmasi", 'степень это произведение одинаковых множителей', 'a power is a product of equal factors') },
    { id: 'f2', label: L("ko'rsatkich muljitellar sonini beradi", 'показатель задаёт число множителей', 'the exponent gives the number of factors') },
    { id: 'f3', label: L("qavs ichidagi hammasi darajaga kiradi", 'всё, что в скобке, входит в степень', 'everything in the bracket enters the power') },
    { id: 'f4', label: L("qavsdan tashqaridagi esa kirmaydi", 'а что вне скобки, не входит', 'and what is outside does not') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval daraja nima, keyin ko'rsatkich, keyin qavs ichi va tashqarisi.",
    'Порядок нарушен. Сначала что такое степень, потом показатель, потом внутри и вне скобки.',
    'The order is off. First what a power is, then the exponent, then inside and outside the bracket.',
  ),
  lawChips: [
    { label: 'aⁿ', tone: 'par' },
    { label: 'n', tone: 's1' },
    { label: '( )', tone: 's2' },
    { label: '≠', tone: 'off' },
  ],
  lawSweep: L(
    "daraja, sanoq, qavs ichi, qavs tashqarisi",
    'степень, счёт, внутри скобки, вне скобки',
    'power, count, inside, outside',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "a sonining n-darajasi n ta muljitelning ko'paytmasiga teng, ularning har biri a ga teng. a birinchi darajada a ning o'ziga teng.",
        'Степень числа a с показателем n равна произведению n множителей, каждый из которых равен a. Число в первой степени равно самому себе.',
        'The n-th power of a is the product of n factors, each equal to a. A number to the first power equals itself.',
      ),
      L(
        "Qavs ichidagi har bir muljitel darajaga kiradi, qavsdan tashqaridagi esa kirmaydi. Shuning uchun 2a³ va (2a)³ boshqa qiymat beradi.",
        'Каждый множитель из скобки входит в степень, а стоящий вне скобки не входит. Поэтому 2a³ и (2a)³ дают разные значения.',
        'Every factor inside the bracket enters the power, one outside does not. That is why 2a³ and (2a)³ differ.',
      ),
    ],
  },
  hookCap: L(
    "Ko'rsatkich asosdan kuchliroq ishlaydi",
    'Показатель работает сильнее основания',
    'The exponent works harder than the base',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("yig'indi koeffitsiyent beradi", 'сумма даёт коэффициент', 'a sum gives a coefficient'),
    L("ko'paytma ko'rsatkich beradi", 'произведение даёт показатель', 'a product gives an exponent'),
    L("juft ko'rsatkich minusni yo'qotadi", 'чётный показатель убирает минус', 'an even exponent kills the minus'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило.', 'We have seen all the cases. Now let us build the rule.'),
    A('ok', "To'g'ri. Bu blokning tayanch qoidasi.", 'Верно. Это опорное правило блока.', 'Correct. This is the anchor rule of the block.'),
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
// EKRAN 9. MASHQ 1. Uchtasi ham 7-sinf darajasida.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Har uchalasida bitta ish: lentani yozib, elementlarni sanash.",
      'Во всех трёх одна работа: выписать ленту и посчитать элементы.',
      'The same work in all three: write out the tape and count.',
    ),
  },
  rounds: [
    {
      template: ['(−1)⁵ = ', { slot: 0 }],
      parts: [{ id: 'a', label: '−1' }, { id: 'b', label: '1' }, { id: 'c', label: '−5' }, { id: 'd', label: '5' }],
      answer: ['a'],
      prompt: L("Beshta minus bir. Toq yoki juft?", 'Пять минус единиц. Чётное или нечётное?', 'Five minus ones. Even or odd?'),
      checkNote: L("Beshta minus toq, demak bittasi qoladi", 'Пять минусов это нечётно, значит один остаётся', 'Five minuses is odd, so one stays'),
      wrongs: [
        { key: 'b', tag: 'Z3', hint: L("Beshta minus toq son. Juft bo'lganda natija musbat bo'lardi.", 'Пять минусов это нечётное число. При чётном результат был бы положительным.', 'Five minuses is an odd count. An even one would give a positive result.') },
        { key: '*', tag: 'Z4', hint: L("Asos minus bir, ko'rsatkich esa besh. Bir necha marta ko'paytirsak ham son bir bo'lib qoladi.", 'Основание минус один, показатель пять. Сколько ни умножай, число остаётся единицей.', 'The base is minus one and the exponent five. However often you multiply, the number stays one.') },
      ],
    },
    {
      template: ['5x · 5x = ', { slot: 0 }],
      parts: [{ id: 'e', label: '25x²' }, { id: 'f', label: '10x²' }, { id: 'g', label: '25x' }, { id: 'h', label: '10x' }],
      answer: ['e'],
      prompt: L("Ikkita bir xil muljitel. Lentani sanang.", 'Два одинаковых множителя. Посчитай ленту.', 'Two equal factors. Count the tape.'),
      checkNote: L("Ikkita beshlik 25 beradi, ikkita x esa x kvadrat", 'Две пятёрки дают 25, а два x дают x в квадрате', 'Two fives give 25 and two x give x squared'),
      wrongs: [
        { key: 'f', tag: 'Z1', hint: L("O'n bu beshlikning yig'indisi. Bu yerda esa ular KO'PAYTIRILADI.", 'Десять это сумма пятёрок. А здесь они УМНОЖАЮТСЯ.', 'Ten is the sum of the fives. Here they MULTIPLY.') },
        { key: '*', tag: 'Z5', hint: L("Lentada ikkita beshlik va ikkita x bor.", 'В ленте две пятёрки и два x.', 'The tape holds two fives and two x.') },
      ],
    },
    {
      template: ['(0,1)³ = ', { slot: 0 }],
      parts: [{ id: 'i', label: '0,001' }, { id: 'j', label: '0,01' }, { id: 'k', label: '0,3' }, { id: 'l', label: '0,1' }],
      answer: ['i'],
      prompt: L("Uchta o'nlik kasr muljitel.", 'Три десятичных множителя.', 'Three decimal factors.'),
      checkNote: L("Har ko'paytirish vergulni bir xona suradi, uchta muljitel uch xona", 'Каждое умножение сдвигает запятую на разряд, три множителя это три разряда', 'Each multiplication shifts the point one place, three factors give three places'),
      wrongs: [
        { key: 'j', tag: 'Z5', hint: L("Ikki xona ikkita muljitelda bo'lardi. Lentada esa uchta.", 'Два разряда были бы при двух множителях. А в ленте их три.', 'Two places would come from two factors. The tape has three.') },
        { key: '*', tag: 'Z4', hint: L("Uchlik ko'rsatkich, ya'ni muljitellar soni. Uni asosga ko'paytirmaymiz.", 'Тройка это показатель, то есть число множителей. Мы не умножаем её на основание.', 'Three is the exponent, the count of factors. It is not multiplied by the base.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Uchta misol, uchtasi ham boshqa tomonni sinaydi.", 'Правило готово. Три примера, каждый проверяет другое.', 'The rule is ready. Three examples, each testing something else.'),
    A('r1', "Ikkinchisi harfli.", 'Второй с буквой.', 'The second has a letter.'),
    A('r2', "Uchinchisi kasr bilan.", 'Третий с дробью.', 'The third has a decimal.'),
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
  const LABELS = ['(−1)⁵ = −1', '5x · 5x = 25x²', '(0,1)³ = 0,001']
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan lenta: (−3b)³.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L("Toq ko'rsatkich va manfiy asos", 'Нечётный показатель и отрицательное основание', 'An odd exponent and a negative base'),
  tape: {
    expr: '(−3b)³',
    item: '−3b',
    count: 3,
    options: [
      { id: 'a', label: '−27b³' },
      { id: 'b', label: '27b³' },
      { id: 'c', label: '−9b³' },
      { id: 'd', label: '−27b' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z3', hint: L("Uchta minus toq son, ular bir-birini yo'qotmaydi: bittasi qoladi.", 'Три минуса это нечётно, они не гасятся: один остаётся.', 'Three minuses is odd, they do not cancel: one stays.') },
      { key: 'c', tag: 'Z5', hint: L("To'qqiz ikkita uchlikdan chiqadi. Lentada esa uchta.", 'Девять выходит из двух троек. А в ленте их три.', 'Nine comes from two threes. The tape has three.') },
      { key: 'd', tag: 'Z5', hint: L("Lentada uchta b ham bor.", 'В ленте есть и три b.', 'The tape also holds three b.') },
      { key: '*', tag: 'Z5', hint: L("Uchta uchlik, uchta b va uchta minus.", 'Три тройки, три b и три минуса.', 'Three threes, three b and three minuses.') },
    ],
    note: L(
      "Toq ko'rsatkich manfiy asosning ishorasini SAQLAYDI.",
      'Нечётный показатель СОХРАНЯЕТ знак отрицательного основания.',
      'An odd exponent KEEPS the sign of a negative base.',
    ),
  },
  audio: [
    A('mount', "Yana lenta, lekin bu safar ko'rsatkich toq.", 'Снова лента, но показатель на этот раз нечётный.', 'The tape again, but this time the exponent is odd.'),
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
// EKRAN 11. MASHQ 3. ASBOBSIZ. Taqqoslash: 3⁵ va 5³.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Lentasiz taqqoslash', 'Сравнение без ленты', 'Comparing without the tape'),
  template: ['3⁵  ', { slot: 0 }, '  5³'],
  parts: [
    { id: 'gt', label: '>' },
    { id: 'lt', label: '<' },
    { id: 'eq', label: '=' },
    { id: 'no', label: '≠' },
  ],
  answer: ['gt'],
  prompt: L(
    "Beshta uchlik yoki uchta beshlik: qaysi ko'paytma katta?",
    'Пять троек или три пятёрки: какое произведение больше?',
    'Five threes or three fives: which product is bigger?',
  ),
  checkNote: L(
    "Beshta uchlik 243 beradi, uchta beshlik 125. Ko'rsatkich kuchliroq ishlaydi",
    'Пять троек дают 243, три пятёрки 125. Показатель работает сильнее',
    'Five threes give 243, three fives give 125. The exponent works harder',
  ),
  wrongs: [
    { key: 'lt', tag: 'Z4', hint: L("Asos katta bo'lgani natijani hal qilmaydi. Xukda ham shunday bo'lgandi: ikkining o'ninchi darajasi o'nning kvadratidan katta.", 'Большее основание не решает исход. На хуке было так же: два в десятой больше десяти в квадрате.', 'A bigger base does not decide it. The hook showed the same: two to the tenth beats ten squared.') },
    { key: 'eq', tag: 'Z4', hint: L("Asos va ko'rsatkichni almashtirish qiymatni o'zgartiradi.", 'Обмен основания и показателя меняет значение.', 'Swapping base and exponent changes the value.') },
    { key: '*', tag: 'Z5', hint: L("Ikkala ko'paytmani sanang: uch karra uch karra uch karra uch karra uch, va besh karra besh karra besh.", 'Посчитай оба произведения: три на три на три на три на три, и пять на пять на пять.', 'Count both products: three times three times three times three times three, and five times five times five.') },
  ],
  audio: [
    A('mount', "Endi lentasiz. Ikkala tomonni o'zingiz sanaysiz.", 'Теперь без ленты. Обе стороны считаешь сам.', 'Now without the tape. You count both sides yourself.'),
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
// EKRAN 12. TUZOQ (§8.2). Qavs yo'qolgan qator.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  task: L(
    "O'quvchi (2a)³ ni a teng 3 da hisobladi.",
    'Ученик считал (2a)³ при a = 3.',
    'A student worked out (2a)³ with a = 3.',
  ),
  ask: L(
    "Yuqoridagi qatordan kelib chiqmagan qatorni toping.",
    'Найди строку, которая не следует из строки над ней.',
    'Find the line that does not follow from the line above it.',
  ),
  rows: [
    { id: 'r1', text: '(2a)³' },
    { id: 'r2', text: '2a³' },
    { id: 'r3', text: '2 · 27' },
    { id: 'r4', text: '54' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich yozuv, unda hali hech nima qilinmagan.", 'Это исходная запись, в ней ещё ничего не сделано.', 'That is the original record, nothing has been done yet.'),
    r3: L("Bu qator ikkinchisidan to'g'ri kelib chiqadi: a teng 3 da a kub 27. Xato yuqoriroqda.", 'Эта строка верно следует из второй: при a = 3 куб a равен 27. Ошибка выше.', 'This line follows correctly from the second: with a = 3 the cube of a is 27. The mistake is higher up.'),
    r4: L("Bu shunchaki ko'paytirishning natijasi.", 'Это просто результат умножения.', 'That is just the result of the multiplication.'),
  },
  tags: { r1: 'Z2', r3: 'Z2', r4: 'Z2' },
  proofFill: {
    template: ['(2a)³ = ', { slot: 0 }, ' · 27 = ', { slot: 1 }],
    parts: [{ id: 'a8', label: '8' }, { id: 'a216', label: '216' }, { id: 'a2', label: '2' }, { id: 'a54', label: '54' }],
    answer: ['a8', 'a216'],
    prompt: L(
      "Qavs ichidagi ikkilik ham darajaga kiradi. To'g'ri hisoblang.",
      'Двойка из скобки тоже входит в степень. Посчитай верно.',
      'The two from the bracket enters the power too. Work it out correctly.',
    ),
    checkNote: L("Tekshiruv: 2a teng 6, va 6 kub 216", 'Проверка: 2a равно 6, а 6 в кубе это 216', 'Check: 2a is 6 and 6 cubed is 216'),
    wrongs: [
      { key: 'a2|a54', tag: 'Z2', hint: L("Ikkilik ham uch marta ko'paytiriladi: 2 karra 2 karra 2 teng 8.", 'Двойка тоже умножается трижды: 2 на 2 на 2 это 8.', 'The two multiplies three times as well: 2 times 2 times 2 is 8.') },
      { key: '*', tag: 'Z2', hint: L("Lentada uchta ikkilik va uchta a bor.", 'В ленте три двойки и три a.', 'The tape holds three twos and three a.') },
    ],
  },
  audio: [
    A('mount', "Hamma hisob to'g'ri bajarilgan, javob esa xato.", 'Все вычисления выполнены верно, а ответ неверный.', 'Every calculation is done right and the answer is still wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. Qavs yo'qolgan, va ikkilik daraja tashqarisida qolgan.", 'Нашёл. Скобка пропала, и двойка осталась вне степени.', 'You found it. The bracket vanished and the two stayed out of the power.'),
    A('done', "To'g'ri javob ikki yuz o'n olti ekan.", 'Верный ответ оказался двести шестнадцать.', 'The right answer is two hundred sixteen.'),
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
// EKRAN 13. KO'CHIRISH. 2¹⁰ 2⁷ dan necha marta katta.
// Uni tanish yo'l bilan yechib bo'lmaydi: farq uchta MULJITEL, ya'ni
// sakkiz marta -- «uchga ko'p» emas.
// ============================================================
const S13 = {
  eyebrow: L("NECHA MARTA", 'ВО СКОЛЬКО РАЗ', 'HOW MANY TIMES'),
  title: L("Uchta muljitel farqi nima beradi", 'Что даёт разница в три множителя', 'What a difference of three factors gives'),
  expr: '2¹⁰   va   2⁷',
  template: [{ slot: 0 }],
  parts: [
    { id: 'a8', label: '8' },
    { id: 'a3', label: '3' },
    { id: 'a17', label: '17' },
    { id: 'a128', label: '128' },
  ],
  answer: ['a8'],
  prompt: L(
    "2¹⁰ da o'nta ikkilik, 2⁷ da yettita. Birinchisi ikkinchisidan necha marta katta?",
    'В 2¹⁰ десять двоек, в 2⁷ семь. Во сколько раз первое больше второго?',
    '2¹⁰ has ten twos, 2⁷ has seven. How many times bigger is the first?',
  ),
  checkNote: L(
    "Uchta ortiqcha ikkilik, ya'ni 2 karra 2 karra 2 teng 8 marta. Tekshiruv: 1024 bo'lish 128 teng 8",
    'Три лишние двойки, то есть 2 на 2 на 2 это 8 раз. Проверка: 1024 разделить на 128 равно 8',
    'Three extra twos, that is 2 times 2 times 2, eight times. Check: 1024 divided by 128 is 8',
  ),
  wrongs: [
    { key: 'a3', tag: 'Z1', hint: L("Uchlik bu ortiqcha muljitellar SONI. Ular esa ko'paytiriladi, qo'shilmaydi: 2 karra 2 karra 2.", 'Тройка это КОЛИЧЕСТВО лишних множителей. А они умножаются, не складываются: 2 на 2 на 2.', 'Three is the COUNT of extra factors. They multiply, not add: 2 times 2 times 2.') },
    { key: 'a17', tag: 'Z1', hint: L("O'n qo'shuv yetti bu ko'rsatkichlarning yig'indisi, u bu savolga javob bermaydi.", 'Десять плюс семь это сумма показателей, она не отвечает на вопрос.', 'Ten plus seven is the sum of the exponents and answers a different question.') },
    { key: '*', tag: 'Z5', hint: L("Ikkala lentani yozib, ustma-ust qo'ying: yettita muljitel bir xil, uchtasi ortiqcha.", 'Выпиши обе ленты и положи одну под другую: семь множителей совпадают, три лишние.', 'Write both tapes one under the other: seven factors match, three are extra.') },
  ],
  reward: {
    title: L("Farq qo'shilmaydi, ko'paytiriladi", 'Разница не складывается, а умножается', 'The difference multiplies, it does not add'),
    text: L(
      "Ko'rsatkichlar farqi uchta bo'lsa, qiymatlar uchta ikkilik ko'paytmasicha farq qiladi.",
      'Показатели отличаются на три — значения в произведение трёх двоек.',
      'Exponents differ by three, values by the product of three twos.',
    ),
  },
  audio: [
    A('mount', "Oxirgi savol eng qiyini. Ikki daraja, ko'rsatkichlar farqi uchta.", 'Последний вопрос самый трудный. Две степени, показатели отличаются на три.', 'The last question is the hardest. Two powers, exponents differing by three.'),
    A('mount', "Diqqat: savol NECHA MARTA deb so'raydi, nechaga ko'p emas.", 'Внимание: вопрос ВО СКОЛЬКО РАЗ, а не на сколько.', 'Careful: the question asks HOW MANY TIMES, not how much more.'),
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
      prompt: '(−2a)³',
      ok: L("Uchta minus toq, ishora qoladi.", 'Три минуса это нечётно, знак остаётся.', 'Three minuses is odd, the sign stays.'),
      items: [
        { id: 'a', label: '−8a³', correct: true },
        { id: 'b', label: '8a³', tag: 'Z3', hint: L("Uchta minus juft emas: bittasi qoladi.", 'Три минуса это не чётное число: один остаётся.', 'Three minuses is not even: one stays.') },
        { id: 'c', label: '−6a³', tag: 'Z4', hint: L("Olti bu 2 karra 3. Lentada esa uchta ikkilik ko'paytiriladi.", 'Шесть это 2 умножить на 3. А в ленте перемножаются три двойки.', 'Six is 2 times 3. The tape multiplies three twos.') },
        { id: 'd', label: '−2a³', tag: 'Z2', hint: L("Ikkilik ham qavs ichida, demak u ham uch marta ko'paytiriladi.", 'Двойка тоже в скобке, значит и она умножается трижды.', 'The two is inside the bracket too, so it multiplies three times.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: 'x³ + x³',
      ok: L("Yig'indi koeffitsiyentni o'stiradi.", 'Сумма растит коэффициент.', 'A sum grows the coefficient.'),
      items: [
        { id: 'a', label: '2x³', correct: true },
        { id: 'b', label: 'x⁶', tag: 'Z1', hint: L("x⁶ bu ko'paytmaning javobi. Bu yerda esa qo'shish.", 'x⁶ это ответ для произведения. А здесь сложение.', 'x⁶ is the answer for a product. Here it is a sum.') },
        { id: 'c', label: '2x⁶', tag: 'Z1', hint: L("Bu ikki amalni birga qo'shib yuborish.", 'Это смешение двух действий.', 'That mixes the two operations.') },
        { id: 'd', label: 'x³', tag: 'Z5', hint: L("Ikkita qo'shiluvchi bor, demak koeffitsiyent ikki.", 'Слагаемых два, значит коэффициент два.', 'There are two terms, so the coefficient is two.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("a = 3 bo'lsa, −a² nechaga teng?", 'Если a = 3, чему равно −a²?', 'If a = 3, what is −a²?'),
      ok: L("Minus lentadan tashqarida, u oxirida ishlaydi.", 'Минус вне ленты, он работает в конце.', 'The minus is outside the tape and acts at the end.'),
      items: [
        { id: 'a', label: '−9', correct: true },
        { id: 'b', label: '9', tag: 'Z3', hint: L("Bu (−a)² ning javobi: unda minus qavs ichida bo'lardi.", 'Это ответ для (−a)²: там минус был бы в скобке.', 'That is the answer for (−a)², where the minus sits inside.') },
        { id: 'c', label: '−6', tag: 'Z4', hint: L("Olti bu 3 karra 2. Kvadrat esa ikkita uchlikning ko'paytmasi.", 'Шесть это 3 умножить на 2. А квадрат это произведение двух троек.', 'Six is 3 times 2. A square is the product of two threes.') },
        { id: 'd', label: '−3', tag: 'Z4', hint: L("Uchlik bu asos, natija emas.", 'Тройка это основание, а не результат.', 'Three is the base, not the result.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("3¹⁰ soni 3⁸ dan necha marta katta?", 'Во сколько раз 3¹⁰ больше 3⁸?', 'How many times bigger is 3¹⁰ than 3⁸?'),
      ok: L("Ikkita ortiqcha muljitel: 3 karra 3.", 'Два лишних множителя: 3 умножить на 3.', 'Two extra factors: 3 times 3.'),
      items: [
        { id: 'a', label: '9', correct: true },
        { id: 'b', label: '2', tag: 'Z1', hint: L("Ikkilik bu ortiqcha muljitellar soni. Ular ko'paytiriladi.", 'Двойка это количество лишних множителей. Они умножаются.', 'Two is the count of extra factors. They multiply.') },
        { id: 'c', label: '6', tag: 'Z1', hint: L("Olti bu 3 karra 2. Ortiqcha muljitellar esa ikkita uchlik.", 'Шесть это 3 умножить на 2. А лишние множители это две тройки.', 'Six is 3 times 2. The extra factors are two threes.') },
        { id: 'd', label: '18', tag: 'Z1', hint: L("O'n sakkiz bu ko'rsatkichlarning yig'indisi.", 'Восемнадцать это сумма показателей.', 'Eighteen is the sum of the exponents.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsdagi yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi yig'indi haqida.", 'Второй про сумму.', 'The second is about a sum.'),
    A('2', "Uchinchisi ishora haqida.", 'Третий про знак.', 'The third is about the sign.'),
    A('3', "Oxirgisi eng qiyini.", 'Последний самый трудный.', 'The last one is the hardest.'),
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
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Ko'rsatkich muljitellarni sanaydi", 'Показатель считает множители', 'The exponent counts the factors'),
  gate: S1.gate,
  fix: {
    tokens: ['2¹⁰'],
    value: '1024',
    sign: '>',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "O'nta ikkilikning ko'paytmasi ikkita o'nlikning ko'paytmasidan ancha katta. Ko'rsatkich asosdan kuchliroq ishlaydi.",
    'Произведение десяти двоек намного больше произведения двух десяток. Показатель работает сильнее основания.',
    'The product of ten twos is far bigger than the product of two tens. The exponent works harder than the base.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    count: L("ko'rsatkich muljitellar sonini beradi", 'показатель задаёт число множителей', 'the exponent sets the factor count'),
    base: L('asos muhimroq', 'основание важнее', 'the base matters more'),
    swap: L('almashtirsa ham bir xil', 'обмен ничего не меняет', 'swapping changes nothing'),
    add: L("asos ko'rsatkichga ko'paytiriladi", 'основание умножают на показатель', 'the base times the exponent'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(3a)³ → 27a³', 'a² + a² → 2a²', 'a² · a² → a⁴', '−a⁴ ≠ (−a)⁴'],
  twoLabel: L('Ikki qavat', 'Два уровня', 'Two levels'),
  twoA: L('+  →  koeff.', '+  →  коэфф.', '+  →  coeff.'),
  twoB: '·  →  aⁿ',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "daraja xossalari",
    'свойства степеней',
    'properties of powers',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Butun dars bitta ishdan chiqdi: lentani yozib, elementlarni sanash.", 'Весь урок вышел из одной работы: выписать ленту и посчитать элементы.', 'The whole lesson came from one job: write out the tape and count.'),
    A('mount', "Keyingi darsda daraja xossalari bo'ladi.", 'В следующем уроке будут свойства степеней.', 'The next lesson brings the properties of powers.'),
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

export default function Grade7Dars13({
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
    else console.log('[Grade7 Dars13] onFinished', payload)
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
