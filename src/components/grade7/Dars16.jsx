// ============================================================================
// 7-sinf, Dars 16. BIR HADLARNI KO'PAYTIRISH.
// (Умножение одночленов)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md. B3 bloki, to'rtinchi dars.
// ASBOB: `FactorTape` -- lenta, o'zgarishsiz. Ikki bir hadning ko'paytmasi
// bu IKKI LENTANING BIRLASHISHI: sonlar birga ko'paytiriladi, bir xil
// harflar sanaladi. 15-darsdagi saralash shu yerda ham ishlaydi.
//
// BU DARS OBVYAZKASIZ YOZILGAN. `Frame` va ildiz komponent `core.jsx` ga
// chiqarildi (`LessonFrame`, `createLesson`), shuning uchun bu faylda faqat
// MA'LUMOT bor: ekranlar mazmuni, misollar, razborlar, ovoz. Metodist savoli
// 2026-08-20 shu haqda edi: obvyazka takrorlanmaydi, matematika esa har
// darsda qaytadan topiladi.
//
// ASOSIY XATO. Koeffitsiyentlarni QO'SHIB yuborish: 2a karra 3a ni o'quvchi
// 5a² yoki 6a deb yozadi. Ikki xato bir joyda: sonlar bilan qo'shish,
// harflar bilan esa sanamaslik. Lenta ikkisini ham ko'rsatadi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  DoneRow,
  Fx,
  HackNote,
  Hint,
  L,
  LessonFrame,
  Tag,
  collectLessonTags,
  createLesson,
  levelFromFirstTry,
  tr,
  useAudio,
  useInstructionGate,
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

const LESSON_ID = 'alg_7_16'
const LESSON_TITLE = L("Bir hadlarni ko'paytirish", 'Умножение одночленов', 'Multiplying monomials')
const LESSON_NO = L('16-dars', 'Урок 16', 'Lesson 16')
const BLOCK = { label: L('B3-blok', 'Блок Б3', 'Block B3'), from: 13, to: 17, current: 16 }

const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

const buildSegments = (list, lang) =>
  list.map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: s.on === 'mount' ? (i === 0 ? 'on_mount' : 'after_previous') : 'on_event:' + s.on,
    waits_for: null,
  }))

const TAGS = {
  Z1: L("koeffitsiyentlar qo'shildi", 'коэффициенты сложены', 'the coefficients were added'),
  Z2: L('harflar sanalmadi', 'буквы не посчитаны', 'the letters were not counted'),
  Z3: L('turli harflar birlashtirildi', 'разные буквы объединены', 'different letters were merged'),
  Z4: L('ishora tushib qoldi', 'знак потерялся', 'the sign was dropped'),
  Z5: L('muljitellar sanalmadi', 'множители не посчитаны', 'the factors were not counted'),
  Z6: L('amallar tartibi', 'порядок действий', 'order of operations'),
}

// ============================================================
// EKRAN 1. XUK. 2a karra 3a: 6a yoki 6a².
// ============================================================
const S1 = {
  eyebrow: L("BIR HADLARNI KO'PAYTIRISH", 'УМНОЖЕНИЕ ОДНОЧЛЕНОВ', 'MULTIPLYING MONOMIALS'),
  noBack: true,
  noNotes: true,
  title: L('Harf qayerga ketdi', 'Куда девалась буква', 'Where did the letter go'),
  gate: {
    source: { kind: 'plain', tokens: ['2a', '·', '3a'] },
    rows: [
      { tokens: ['6a'], value: '6' },
      { tokens: ['6a²'], value: '6' },
    ],
  },
  probe: {
    question: L(
      "Ikkalasi ham koeffitsiyentni to'g'ri topdi: olti. Harfda esa farq bor. Kim haq?",
      'Оба верно нашли коэффициент: шесть. А с буквой разошлись. Кто прав?',
      'Both got the coefficient right: six. But they differ on the letter. Who is right?',
    ),
    items: [
      {
        id: 'sq',
        label: L(
          "a kvadrat: ikkita a ko'paytirilgan",
          'a в квадрате: два a перемножены',
          'a squared: two a multiplied',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Lentada sanab ko'ramiz.",
          'Прогноз принят. Посчитаем на ленте.',
          'Your prediction is taken. We will count it on the tape.',
        ),
      },
      {
        id: 'lin',
        label: L("Bitta a: harf o'zgarmaydi", 'Одна a: буква не меняется', 'One a: the letter stays'),
        hint: L(
          "Ikkita bir had ko'paytirilganda ularning harflari BIRGA keladi. Ikkita a esa a kvadratni beradi.",
          'При умножении двух одночленов их буквы сходятся ВМЕСТЕ. А два a дают a в квадрате.',
          'Multiplying two monomials brings their letters TOGETHER. And two a give a squared.',
        ),
      },
      {
        id: 'sum',
        label: L("Bu yerda 5a bo'lishi kerak", 'Здесь должно быть 5a', 'It should be 5a here'),
        hint: L(
          "Besh bu ikki qo'shuv uch, ya'ni QO'SHISHNING javobi. Belgi esa ko'paytirish.",
          'Пять это два плюс три, то есть ответ для СЛОЖЕНИЯ. А знак умножение.',
          'Five is two plus three, the answer for ADDING. But the sign is a times.',
        ),
      },
      {
        id: 'both',
        label: L("Ikkalasi ham to'g'ri", 'Оба верны', 'Both are right'),
        hint: L(
          "a teng 2 ni qo'yib ko'ring: 4 karra 6 teng 24. 6a esa 12 beradi, 6a kvadrat esa 24.",
          'Подставь a = 2: 4 умножить на 6 это 24. А 6a даёт 12, и 6a в квадрате 24.',
          'Try a = 2: 4 times 6 is 24. But 6a gives 12 and 6a squared gives 24.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "O'n beshinchi darsda bir hadni standart shaklga keltirdik. Endi ikkitasini ko'paytiramiz.", 'В пятнадцатом уроке мы привели одночлен к стандартному виду. Теперь умножим два.', 'In lesson fifteen we put a monomial in standard form. Now we multiply two.'),
    A('mount', "Ikki o'quvchi koeffitsiyentni bir xil topdi, harfda esa boshqacha yozdi.", 'Два ученика нашли одинаковый коэффициент, а букву записали по-разному.', 'Two students found the same coefficient but wrote the letter differently.'),
    A('mount', "Sizningcha kim haq. Bu taxmin, uning uchun baho yo'q.", 'Как думаешь, кто прав. Это прогноз, оценки за него нет.', 'Who do you think is right. This is a prediction, it is not graded.'),
  ],
}

function Screen1({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S1.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [picked, setPicked] = useState(null)
  return (
    <LessonFrame meta={S1} screen={screen} audio={audio} solved={!!picked} {...rest}>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 2. TAYANCH. KVOTA EKRANI (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L('Uchta narsa', 'Три вещи', 'Three things'),
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      prompt: 'a³ · a²',
      ok: L("Ko'rsatkichlar qo'shiladi: uch qo'shuv ikki.", 'Показатели складываются: три плюс два.', 'The exponents add: three plus two.'),
      items: [
        { id: 'a', label: 'a⁵', correct: true },
        { id: 'b', label: 'a⁶', tag: 'Z5', hint: L("Olti bu uch karra ikki. Ko'paytirishda ko'rsatkichlar qo'shiladi.", 'Шесть это три на два. При умножении показатели складывают.', 'Six is three times two. Multiplication adds the exponents.') },
        { id: 'c', label: 'a', tag: 'Z5', hint: L("Ko'paytirish muljitellar sonini oshiradi.", 'Умножение увеличивает число множителей.', 'Multiplying adds factors.') },
        { id: 'd', label: '2a³', tag: 'Z1', hint: L("Koeffitsiyent yig'indidan kelardi.", 'Коэффициент пришёл бы от суммы.', 'A coefficient would come from a sum.') },
      ],
    },
    {
      prompt: '−2 · 5',
      ok: L("Ishoralar boshqa, natija manfiy.", 'Знаки разные, результат отрицательный.', 'Different signs, the result is negative.'),
      items: [
        { id: 'a', label: '−10', correct: true },
        { id: 'b', label: '10', tag: 'Z4', hint: L("Bitta muljitel manfiy, demak natija manfiy.", 'Один множитель отрицательный, значит и результат.', 'One factor is negative, so is the result.') },
        { id: 'c', label: '3', tag: 'Z1', hint: L("Uch bu minus ikki qo'shuv besh. Belgi ko'paytirish.", 'Три это минус два плюс пять. Знак умножение.', 'Three is minus two plus five. The sign is a times.') },
        { id: 'd', label: '−7', tag: 'Z1', hint: L("Minus yetti bu minus ikki ayirish besh.", 'Минус семь это минус два минус пять.', 'Minus seven is minus two minus five.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("−a²b ning koeffitsiyenti?", 'Коэффициент у −a²b?', 'The coefficient of −a²b?'),
      ok: L("Son yozilmagan, faqat minus turibdi.", 'Числа не написано, стоит только минус.', 'No number is written, only a minus.'),
      items: [
        { id: 'a', label: '−1', correct: true },
        { id: 'b', label: '1', tag: 'Z4', hint: L("Ishora ham koeffitsiyentga kiradi.", 'Знак тоже входит в коэффициент.', 'The sign belongs to the coefficient too.') },
        { id: 'c', label: '−2', tag: 'Z4', hint: L("Ikkilik bu a ning ko'rsatkichi.", 'Двойка это показатель a.', 'Two is the exponent of a.') },
        { id: 'd', label: '0', tag: 'Z4', hint: L("Nol koeffitsiyent butun bir hadni nolga aylantirardi.", 'Нулевой коэффициент обратил бы одночлен в нуль.', 'A zero coefficient would zero the monomial.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta narsani eslaymiz.", 'Вспомним три вещи.', 'Three things to recall.'),
    A('1', "Ikkinchisi ishora haqida.", 'Второе про знак.', 'The second is about the sign.'),
    A('2', "Uchinchisi koeffitsiyent haqida.", 'Третье про коэффициент.', 'The third is about the coefficient.'),
  ],
}

function Screen2({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S2.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S2} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S2.items}
        question={S2.question}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'support' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 3. IKKI LENTA BIRLASHADI. 2a³ karra 5a².
// ============================================================
const S3 = {
  eyebrow: L('IKKI LENTA', 'ДВЕ ЛЕНТЫ', 'TWO TAPES'),
  title: L('Ikki bir had bitta lentaga qo\'shiladi', 'Два одночлена сходятся в одну ленту', 'Two monomials merge into one tape'),
  tape: {
    expr: '2a³ · 5a²',
    mixed: ['2', 'a', 'a', 'a', '5', 'a', 'a'],
    options: [
      { id: 'a', label: '10a⁵' },
      { id: 'b', label: '7a⁵' },
      { id: 'c', label: '10a⁶' },
      { id: 'd', label: '10a' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z1', hint: L("Yetti bu 2 qo'shuv 5. Koeffitsiyentlar KO'PAYTIRILADI.", 'Семь это 2 плюс 5. Коэффициенты УМНОЖАЮТСЯ.', 'Seven is 2 plus 5. The coefficients MULTIPLY.') },
      { key: 'c', tag: 'Z5', hint: L("Olti bu 3 karra 2. Ko'rsatkichlar esa qo'shiladi: uchta va ikkita a.", 'Шесть это 3 на 2. А показатели складываются: три и два a.', 'Six is 3 times 2. But the exponents add: three a and two a.') },
      { key: 'd', tag: 'Z2', hint: L("Lentada beshta a bor, hisobga qarang.", 'В ленте пять a, посмотри на счёт.', 'The tape holds five a, look at the tally.') },
      { key: '*', tag: 'Z5', hint: L("Hisobda sonlar va a ning soni turibdi.", 'В счёте стоят числа и количество a.', 'The tally shows the numbers and how many a.') },
    ],
    note: L(
      "Sonlar ko'paytiriladi, bir xil harflar esa sanaladi.",
      'Числа перемножаются, а одинаковые буквы считаются.',
      'The numbers multiply and equal letters are counted.',
    ),
  },
  reward: {
    title: L('Yangi qoida yo\'q', 'Нового правила нет', 'No new rule'),
    text: L(
      "Bu o'sha saralash: sonlar bir joyga, harflar bir joyga. Ikki bir hadning ko'paytmasi ham bir had bo'ladi.",
      'Это та же сортировка: числа к числам, буквы к буквам. Произведение двух одночленов тоже одночлен.',
      'The same sorting: numbers with numbers, letters with letters. A product of two monomials is a monomial too.',
    ),
  },
  audio: [
    A('mount', "Yozuvni bosing.", 'Нажми на запись.', 'Tap the record.'),
    A('open', "Ikki bir hadning muljitellari bitta lentada turibdi.", 'Множители двух одночленов стоят в одной ленте.', 'The factors of both monomials stand in one tape.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S3.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      <FactorTape
        audio={audio}
        expr={S3.tape.expr}
        mixed={S3.tape.mixed}
        options={S3.tape.options}
        answer={S3.tape.answer}
        wrongs={S3.tape.wrongs}
        note={S3.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 4. FARQLASH. 2a karra 3a va 2a qo'shuv 3a. KVOTA EKRANI.
// ============================================================
const S4 = {
  eyebrow: L('BELGI QAYSI', 'КАКОЙ ЗНАК', 'WHICH SIGN'),
  title: L("Ko'paytirish va qo'shish bir xil emas", 'Умножение и сложение не одно и то же', 'Multiplying and adding are not the same'),
  expr: '2a · 3a    va    2a + 3a',
  probe: {
    question: L(
      "Bu ikki yozuv nimaga teng?",
      'Чему равны эти две записи?',
      'What do these two records equal?',
    ),
    items: [
      { id: 'a', correct: true, label: L('6a² va 5a', '6a² и 5a', '6a² and 5a') },
      {
        id: 'b', tag: 'Z1',
        label: L('5a va 5a', '5a и 5a', '5a and 5a'),
        hint: L("Ko'paytirishda koeffitsiyentlar ko'paytiriladi: 2 karra 3 teng 6. Va ikkita a a kvadratni beradi.", 'При умножении коэффициенты перемножают: 2 на 3 это 6. И два a дают a в квадрате.', 'Multiplication multiplies the coefficients: 2 times 3 is 6. And two a give a squared.'),
      },
      {
        id: 'c', tag: 'Z2',
        label: L('6a² va 6a²', '6a² и 6a²', '6a² and 6a²'),
        hint: L("Qo'shishda harf o'zgarmaydi: ikkita a had qo'shilganda a bo'lib qoladi, faqat koeffitsiyent o'sadi.", 'При сложении буква не меняется: складывая слагаемые с a, получаем a, растёт только коэффициент.', 'Adding does not change the letter: adding terms with a keeps a, only the coefficient grows.'),
      },
      {
        id: 'd', tag: 'Z1',
        label: L('6a va 6a²', '6a и 6a²', '6a and 6a²'),
        hint: L("Javoblar o'rin almashgan: kvadrat KO'PAYTIRISHDAN chiqadi, qo'shishdan emas.", 'Ответы поменялись местами: квадрат выходит из УМНОЖЕНИЯ, а не из сложения.', 'The answers are swapped: the square comes from MULTIPLYING, not adding.'),
      },
    ],
    ok: L(
      "Ko'paytirish ko'rsatkichni o'stiradi, qo'shish esa koeffitsiyentni.",
      'Умножение растит показатель, сложение растит коэффициент.',
      'Multiplying grows the exponent, adding grows the coefficient.',
    ),
  },
  audio: [
    A('mount', "Ikki yozuv, sonlar bir xil. Farq faqat belgida.", 'Две записи, числа те же. Разница только в знаке.', 'Two records with the same numbers. Only the sign differs.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S4.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
      <div className="g7-eqb-lone"><Fx>{S4.expr}</Fx></div>
      <Probe
        data={S4.probe}
        cols={2}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 5. IKKI HARF VA ISHORA. −3x²y karra 4xy³.
// ============================================================
const S5 = {
  eyebrow: L('IKKI HARF', 'ДВЕ БУКВЫ', 'TWO LETTERS'),
  title: L('Har harf alohida sanaladi', 'Каждая буква считается отдельно', 'Each letter is counted on its own'),
  tape: {
    expr: '−3x²y · 4xy³',
    mixed: ['−3', 'x', 'x', 'y', '4', 'x', 'y', 'y', 'y'],
    options: [
      { id: 'a', label: '−12x³y⁴' },
      { id: 'b', label: '12x³y⁴' },
      { id: 'c', label: '−12x²y³' },
      { id: 'd', label: '−7x³y⁴' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z4', hint: L("Lentada bitta manfiy son bor, natija manfiy bo'ladi.", 'В ленте одно отрицательное число, результат будет отрицательным.', 'The tape holds one negative number, the result is negative.') },
      { key: 'c', tag: 'Z2', hint: L("Hisobga qarang: uchta x va to'rtta y.", 'Посмотри на счёт: три x и четыре y.', 'Look at the tally: three x and four y.') },
      { key: 'd', tag: 'Z1', hint: L("Yetti bu 3 qo'shuv 4. Koeffitsiyentlar ko'paytiriladi: minus uch karra to'rt.", 'Семь это 3 плюс 4. Коэффициенты перемножают: минус три на четыре.', 'Seven is 3 plus 4. The coefficients multiply: minus three times four.') },
      { key: '*', tag: 'Z5', hint: L("Hisob har harfni alohida sanaydi.", 'Счёт считает каждую букву отдельно.', 'The tally counts each letter separately.') },
    ],
    note: L(
      "x va y aralashmaydi: ularning ko'rsatkichlari alohida.",
      'x и y не смешиваются: их показатели отдельны.',
      'The x and y do not mix: their exponents are separate.',
    ),
  },
  audio: [
    A('mount', "Bu safar ikki harf va manfiy koeffitsiyent bor.", 'На этот раз две буквы и отрицательный коэффициент.', 'This time two letters and a negative coefficient.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S5.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <FactorTape
        audio={audio}
        expr={S5.tape.expr}
        mixed={S5.tape.mixed}
        options={S5.tape.options}
        answer={S5.tape.answer}
        wrongs={S5.tape.wrongs}
        note={S5.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 6. O'ZINGIZ. Yozilmagan koeffitsiyent: −a²b karra 5ab.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Koeffitsiyent yozilmagan bo'lsa ham lentada bor", 'Ненаписанный коэффициент в ленте есть', 'An unwritten coefficient is in the tape'),
  tape: {
    expr: '−a²b · 5ab',
    mixed: ['−1', 'a', 'a', 'b', '5', 'a', 'b'],
    options: [
      { id: 'a', label: '−5a³b²' },
      { id: 'b', label: '5a³b²' },
      { id: 'c', label: '−5a²b' },
      { id: 'd', label: '−4a³b²' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z4', hint: L("Birinchi bir hadning koeffitsiyenti minus bir, u lentada ko'rinadi.", 'Коэффициент первого одночлена минус один, он виден в ленте.', 'The first monomial has coefficient minus one, visible in the tape.') },
      { key: 'c', tag: 'Z2', hint: L("Hisobda uchta a va ikkita b turibdi.", 'В счёте три a и два b.', 'The tally shows three a and two b.') },
      { key: 'd', tag: 'Z1', hint: L("To'rt bu minus bir qo'shuv besh. Koeffitsiyentlar ko'paytiriladi.", 'Четыре это минус один плюс пять. Коэффициенты перемножают.', 'Four is minus one plus five. The coefficients multiply.') },
      { key: '*', tag: 'Z5', hint: L("Lentaning boshida minus bir turibdi.", 'В начале ленты стоит минус один.', 'The tape starts with minus one.') },
    ],
    note: L(
      "Minus bir ham son, u ham ko'paytirishda qatnashadi.",
      'Минус один тоже число и тоже участвует в умножении.',
      'Minus one is a number too and joins the multiplication.',
    ),
  },
  audio: [
    A('mount', "Endi o'zingiz. Birinchi bir hadda son yozilmagan.", 'Теперь сам. В первом одночлене число не написано.', 'Now on your own. The first monomial has no number written.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S6.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S6} screen={screen} audio={audio} solved={done} {...rest}>
      <FactorTape
        audio={audio}
        expr={S6.tape.expr}
        mixed={S6.tape.mixed}
        options={S6.tape.options}
        answer={S6.tape.answer}
        wrongs={S6.tape.wrongs}
        note={S6.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 7. CHEGARAVIY HOLAT. 3a karra 4b -- harflar boshqa.
// ============================================================
const S7 = {
  eyebrow: L('HARFLAR BOSHQA', 'БУКВЫ РАЗНЫЕ', 'DIFFERENT LETTERS'),
  title: L("Turli harflar birlashmaydi", 'Разные буквы не объединяются', 'Different letters do not merge'),
  template: ['3a · 4b = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '12ab' },
    { id: 'b', label: '12a²' },
    { id: 'c', label: '12ab²' },
    { id: 'd', label: '7ab' },
  ],
  answer: ['a'],
  prompt: L(
    "Koeffitsiyentlar ko'paytiriladi. Harflar bilan nima bo'ladi?",
    'Коэффициенты перемножаются. А что с буквами?',
    'The coefficients multiply. What happens to the letters?',
  ),
  checkNote: L(
    "a bitta, b bitta: ularning ko'rsatkichi bir va yozilmaydi",
    'a одна, b одна: их показатель единица и не пишется',
    'One a, one b: their exponent is one and is not written',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("b ni a ga aylantirib bo'lmaydi: bu boshqa harf, boshqa kattalik.", 'b нельзя превратить в a: это другая буква, другая величина.', 'The b cannot become an a: it is a different letter, a different quantity.') },
    { key: 'c', tag: 'Z2', hint: L("Lentada bitta b bor, ikkita emas.", 'В ленте одна b, а не две.', 'The tape holds one b, not two.') },
    { key: 'd', tag: 'Z1', hint: L("Yetti bu 3 qo'shuv 4.", 'Семь это 3 плюс 4.', 'Seven is 3 plus 4.') },
  ],
  bonus: {
    title: L("Ko'rsatkich faqat BIR XIL harflarda qo'shiladi", 'Показатели складываются только у ОДИНАКОВЫХ букв', 'Exponents add only for the SAME letter'),
    text: L(
      "a va b alohida sanaladi, chunki ular alohida kattaliklar. Shuning uchun javob ab bo'ladi, a kvadrat emas.",
      'a и b считаются отдельно, потому что это разные величины. Поэтому ответ ab, а не a в квадрате.',
      'The a and b are counted apart because they are different quantities. So the answer is ab, not a squared.',
    ),
  },
  audio: [
    A('mount', "Bu safar harflar boshqa: a va b.", 'На этот раз буквы разные: a и b.', 'This time the letters differ: a and b.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S7.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S7} screen={screen} audio={audio} solved={done} {...rest}>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 8. QOIDA.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('koeffitsiyentlar ko\'paytiriladi', 'коэффициенты перемножают', 'the coefficients multiply') },
    { id: 'f2', label: L("bir xil harflarning ko'rsatkichlari qo'shiladi", 'у одинаковых букв показатели складывают', 'the same letters have their exponents added') },
    { id: 'f3', label: L('turli harflar alohida qoladi', 'разные буквы остаются отдельно', 'different letters stay apart') },
    { id: 'f4', label: L('natija standart shaklda yoziladi', 'результат пишут в стандартном виде', 'the result is written in standard form') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval sonlar, keyin bir xil harflar, keyin turlilari, oxirida yozuv.",
    'Порядок нарушен. Сначала числа, потом одинаковые буквы, потом разные, в конце запись.',
    'The order is off. Numbers first, then equal letters, then different ones, and the notation last.',
  ),
  lawChips: [
    { label: '· ', tone: 'par' },
    { label: '+', tone: 's1' },
    { label: 'a b', tone: 's2' },
    { label: 'std', tone: 'off' },
  ],
  lawSweep: L(
    "sonlar, bir xil harflar, turli harflar, standart shakl",
    'числа, одинаковые буквы, разные буквы, стандартный вид',
    'numbers, same letters, different letters, standard form',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ikki bir hadni ko'paytirish uchun koeffitsiyentlarni ko'paytiramiz, bir xil harflarning ko'rsatkichlarini esa qo'shamiz.",
        'Чтобы умножить два одночлена, перемножают коэффициенты, а у одинаковых букв складывают показатели.',
        'To multiply two monomials, multiply the coefficients and add the exponents of the same letters.',
      ),
      L(
        "Turli harflar alohida qoladi. Natija esa bir had bo'ladi va standart shaklda yoziladi.",
        'Разные буквы остаются отдельно. Результат тоже одночлен и его пишут в стандартном виде.',
        'Different letters stay apart. The result is a monomial too and is written in standard form.',
      ),
    ],
  },
  hookCap: L(
    "Ko'paytirish ko'rsatkichni o'stiradi, qo'shish koeffitsiyentni",
    'Умножение растит показатель, сложение коэффициент',
    'Multiplying grows the exponent, adding grows the coefficient',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("sonlar ko'paytiriladi", 'числа перемножают', 'numbers multiply'),
    L("bir xil harflar qo'shiladi", 'одинаковые буквы складывают', 'same letters add'),
    L('turlilari qoladi', 'разные остаются', 'different ones stay'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило.', 'We have seen all the cases. Now let us build the rule.'),
    A('ok', "To'g'ri.", 'Верно.', 'Correct.'),
  ],
}

function Screen8({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S8.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const rule = useMemo(() => ({ badge: t(S8.rule.badge), lines: S8.rule.lines.map(t) }), [t])
  return (
    <LessonFrame meta={S8} screen={screen} audio={audio} solved={done} {...rest}>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 9. MASHQ 1.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Har uchalasida bitta ish: sonlarni ko'paytirish, harflarni sanash.",
      'Во всех трёх одна работа: перемножить числа, посчитать буквы.',
      'The same work in all three: multiply the numbers, count the letters.',
    ),
  },
  rounds: [
    {
      template: ['4x · 2x³ = ', { slot: 0 }],
      parts: [{ id: 'a', label: '8x⁴' }, { id: 'b', label: '6x⁴' }, { id: 'c', label: '8x³' }, { id: 'd', label: '8x⁵' }],
      answer: ['a'],
      prompt: L("Bir xil harf, ko'rsatkichlar qo'shiladi.", 'Одинаковая буква, показатели складываются.', 'The same letter, the exponents add.'),
      checkNote: L("4 karra 2 teng 8; bitta va uchta x birga to'rtta", '4 на 2 это 8; одна и три x вместе четыре', '4 times 2 is 8; one and three x make four'),
      wrongs: [
        { key: 'b', tag: 'Z1', hint: L("Olti bu 4 qo'shuv 2.", 'Шесть это 4 плюс 2.', 'Six is 4 plus 2.') },
        { key: '*', tag: 'Z2', hint: L("x lar sonini sanang: bitta va uchta.", 'Посчитай количество x: одна и три.', 'Count the x: one and three.') },
      ],
    },
    {
      template: ['−2a²b · 3ab = ', { slot: 0 }],
      parts: [{ id: 'e', label: '−6a³b²' }, { id: 'f', label: '6a³b²' }, { id: 'g', label: '−6a²b' }, { id: 'h', label: '−5a³b²' }],
      answer: ['e'],
      prompt: L("Ikki harf va manfiy koeffitsiyent.", 'Две буквы и отрицательный коэффициент.', 'Two letters and a negative coefficient.'),
      checkNote: L("Minus ikki karra uch teng minus olti; a lar uchta, b lar ikkita", 'Минус два на три это минус шесть; a три, b две', 'Minus two times three is minus six; three a, two b'),
      wrongs: [
        { key: 'f', tag: 'Z4', hint: L("Ishora yo'qolib qoldi.", 'Знак потерялся.', 'The sign got lost.') },
        { key: 'h', tag: 'Z1', hint: L("Besh bu qo'shishning natijasi.", 'Пять это результат сложения.', 'Five is the result of adding.') },
        { key: '*', tag: 'Z2', hint: L("Har harfni alohida sanang.", 'Считай каждую букву отдельно.', 'Count each letter separately.') },
      ],
    },
    {
      template: ['5m · 3n = ', { slot: 0 }],
      parts: [{ id: 'i', label: '15mn' }, { id: 'j', label: '15m²' }, { id: 'k', label: '8mn' }, { id: 'l', label: '15m²n²' }],
      answer: ['i'],
      prompt: L("Harflar boshqa.", 'Буквы разные.', 'The letters differ.'),
      checkNote: L("Turli harflar alohida qoladi, ko'rsatkichlari bir", 'Разные буквы остаются отдельно, показатели у них единица', 'Different letters stay apart, their exponents are one'),
      wrongs: [
        { key: 'j', tag: 'Z3', hint: L("n ni m ga aylantirib bo'lmaydi.", 'n нельзя превратить в m.', 'The n cannot become an m.') },
        { key: 'l', tag: 'Z2', hint: L("Har harf bittadan.", 'Каждой буквы по одной.', 'One of each letter.') },
        { key: '*', tag: 'Z1', hint: L("Sonlarni ko'paytiring, harflarni yonma-yon yozing.", 'Перемножь числа, а буквы запиши рядом.', 'Multiply the numbers and write the letters side by side.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta misol.", 'Три примера.', 'Three examples.'),
    A('r1', "Ikkinchisida ikki harf.", 'Во втором две буквы.', 'The second has two letters.'),
    A('r2', "Uchinchisida harflar boshqa.", 'В третьем буквы разные.', 'In the third the letters differ.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S9.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [rows, setRows] = useState([])
  const done = idx >= S9.rounds.length
  const r = S9.rounds[idx]
  const LABELS = ['4x · 2x³ = 8x⁴', '−2a²b · 3ab = −6a³b²', '5m · 3n = 15mn']
  return (
    <LessonFrame meta={S9} screen={screen} audio={audio} solved={done} {...rest}>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 10. MASHQ 2. Yo'naltirilgan lenta, uch harf.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L('Uch harf va ikki manfiy son', 'Три буквы и два отрицательных числа', 'Three letters and two negatives'),
  tape: {
    expr: '−2ab · (−3bc)',
    mixed: ['−2', 'a', 'b', '−3', 'b', 'c'],
    options: [
      { id: 'a', label: '6ab²c' },
      { id: 'b', label: '−6ab²c' },
      { id: 'c', label: '6abc' },
      { id: 'd', label: '5ab²c' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z4', hint: L("Ikkita manfiy son ko'paytirilsa natija MUSBAT bo'ladi.", 'Произведение двух отрицательных чисел ПОЛОЖИТЕЛЬНО.', 'Two negative numbers multiply to a POSITIVE.') },
      { key: 'c', tag: 'Z2', hint: L("Hisobda ikkita b turibdi.", 'В счёте два b.', 'The tally shows two b.') },
      { key: 'd', tag: 'Z1', hint: L("Besh bu qo'shishdan. Minus ikki karra minus uch teng olti.", 'Пять от сложения. Минус два на минус три это шесть.', 'Five comes from adding. Minus two times minus three is six.') },
      { key: '*', tag: 'Z5', hint: L("Ikki manfiy son va uch xil harf.", 'Два отрицательных числа и три разные буквы.', 'Two negative numbers and three different letters.') },
    ],
    note: L(
      "Ikki minus bir-birini yo'qotadi, natija musbat.",
      'Два минуса гасят друг друга, результат положительный.',
      'Two minuses cancel out, the result is positive.',
    ),
  },
  audio: [
    A('mount', "Ikkala bir hadning koeffitsiyenti ham manfiy.", 'У обоих одночленов коэффициент отрицательный.', 'Both monomials have a negative coefficient.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S10.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S10} screen={screen} audio={audio} solved={done} {...rest}>
      <FactorTape
        audio={audio}
        expr={S10.tape.expr}
        mixed={S10.tape.mixed}
        options={S10.tape.options}
        answer={S10.tape.answer}
        wrongs={S10.tape.wrongs}
        note={S10.tape.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 11. MASHQ 3. ASBOBSIZ, uchta bir had.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Uchta bir had', 'Три одночлена', 'Three monomials'),
  template: ['2x · 3x² · x = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '6x⁴' },
    { id: 'b', label: '6x³' },
    { id: 'c', label: '5x⁴' },
    { id: 'd', label: '6x⁶' },
  ],
  answer: ['a'],
  prompt: L(
    "Uchta bir had ko'paytirilgan. Oxirgisida son yozilmagan.",
    'Перемножены три одночлена. В последнем число не написано.',
    'Three monomials multiplied. The last has no number written.',
  ),
  checkNote: L(
    "2 karra 3 karra 1 teng 6; x lar bitta, ikkita va bitta -- jami to'rtta",
    '2 на 3 на 1 это 6; x одна, две и одна — всего четыре',
    '2 times 3 times 1 is 6; one, two and one x make four',
  ),
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Oxirgi x ham sanaladi: bitta qo'shuv ikkita qo'shuv bitta.", 'Последняя x тоже считается: одна плюс две плюс одна.', 'The last x counts too: one plus two plus one.') },
    { key: 'c', tag: 'Z1', hint: L("Besh bu 2 qo'shuv 3.", 'Пять это 2 плюс 3.', 'Five is 2 plus 3.') },
    { key: 'd', tag: 'Z5', hint: L("Olti bu 2 karra 3, ya'ni KOEFFITSIYENT. Ko'rsatkich esa to'rt.", 'Шесть это 2 на 3, то есть КОЭФФИЦИЕНТ. А показатель четыре.', 'Six is 2 times 3, the COEFFICIENT. The exponent is four.') },
  ],
  audio: [
    A('mount', "Endi lentasiz va uchta bir had bilan.", 'Теперь без ленты и с тремя одночленами.', 'Now without the tape and with three monomials.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S11.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S11} screen={screen} audio={audio} solved={done} {...rest}>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 12. TUZOQ (§8.2). Koeffitsiyentlar qo'shilgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  task: L(
    "O'quvchi 3a² karra 4a³ ni hisobladi.",
    'Ученик считал 3a² · 4a³.',
    'A student worked out 3a² · 4a³.',
  ),
  ask: L(
    "Yuqoridagi qatordan kelib chiqmagan qatorni toping.",
    'Найди строку, которая не следует из строки над ней.',
    'Find the line that does not follow from the line above it.',
  ),
  rows: [
    { id: 'r1', text: '3a² · 4a³' },
    { id: 'r2', text: '7a⁵' },
    { id: 'r3', text: L('a = 1 da: 7', 'при a = 1: 7', 'at a = 1: 7') },
    { id: 'r4', text: L('javob: 7', 'ответ: 7', 'answer: 7') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r3: L("Bu qator ikkinchisidan to'g'ri kelib chiqadi: a teng bir da a beshinchi daraja bir. Xato yuqoriroqda.", 'Эта строка верно следует из второй: при a = 1 пятая степень равна одному. Ошибка выше.', 'This follows correctly from the second: at a = 1 the fifth power is one. The mistake is higher up.'),
    r4: L("Javob oldingi qatorni takrorlaydi.", 'Ответ повторяет предыдущую строку.', 'The answer repeats the previous line.'),
  },
  tags: { r1: 'Z1', r3: 'Z1', r4: 'Z1' },
  proofFill: {
    template: ['3a² · 4a³ = ', { slot: 0 }, 'a', { slot: 1 }],
    parts: [{ id: 'a', label: '12' }, { id: 'b', label: '⁵' }, { id: 'c', label: '7' }, { id: 'd', label: '⁶' }],
    answer: ['a', 'b'],
    prompt: L(
      "Koeffitsiyentlarni to'g'ri hisoblang. Ko'rsatkich esa avvalgidek.",
      'Посчитай коэффициенты верно. А показатель как и был.',
      'Work the coefficients out correctly. The exponent stays as it was.',
    ),
    checkNote: L("3 karra 4 teng 12; ikkita va uchta a birga beshta", '3 на 4 это 12; два и три a вместе пять', '3 times 4 is 12; two and three a make five'),
    wrongs: [
      { key: 'c|b', tag: 'Z1', hint: L("Yetti bu 3 qo'shuv 4. Koeffitsiyentlar KO'PAYTIRILADI.", 'Семь это 3 плюс 4. Коэффициенты УМНОЖАЮТСЯ.', 'Seven is 3 plus 4. The coefficients MULTIPLY.') },
      { key: '*', tag: 'Z5', hint: L("Sonlarni ko'paytiring, ko'rsatkichlarni qo'shing.", 'Числа перемножь, показатели сложи.', 'Multiply the numbers, add the exponents.') },
    ],
  },
  audio: [
    A('mount', "Ko'rsatkich to'g'ri topilgan, koeffitsiyent esa yo'q.", 'Показатель найден верно, а коэффициент нет.', 'The exponent is right, the coefficient is not.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. Koeffitsiyentlar qo'shib yuborilgan.", 'Нашёл. Коэффициенты сложили вместо умножения.', 'You found it. The coefficients were added instead of multiplied.'),
    A('done', "To'g'ri javob o'n ikki a beshinchi daraja ekan.", 'Верный ответ двенадцать a в пятой степени.', 'The right answer is twelve a to the fifth.'),
  ],
}

function Screen12({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S12.audio, rest.lang), [rest.lang])
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
    <LessonFrame meta={S12} screen={screen} audio={audio} solved={done} {...rest}>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 13. KO'CHIRISH. Muljiteli topish: ? karra 3a² teng 12a⁵.
// Bu teskari masala, uni tanish yo'l bilan yechib bo'lmaydi.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE INVERSE PROBLEM'),
  title: L("Ikkinchi muljitelni toping", 'Найди второй множитель', 'Find the other factor'),
  expr: '?  ·  3a²  =  12a⁵',
  template: [{ slot: 0 }],
  parts: [
    { id: 'a', label: '4a³' },
    { id: 'b', label: '9a³' },
    { id: 'c', label: '4a⁷' },
    { id: 'd', label: '4a²' },
  ],
  answer: ['a'],
  prompt: L(
    "Qaysi bir had 3a² ga ko'paytirilganda 12a⁵ beradi?",
    'Какой одночлен при умножении на 3a² даёт 12a⁵?',
    'Which monomial times 3a² gives 12a⁵?',
  ),
  checkNote: L(
    "Koeffitsiyent: 12 bo'lish 3 teng 4. Ko'rsatkich: 5 ayirish 2 teng 3. Tekshiruv: 4a³ karra 3a² teng 12a⁵",
    'Коэффициент: 12 разделить на 3 это 4. Показатель: 5 минус 2 это 3. Проверка: 4a³ · 3a² = 12a⁵',
    'Coefficient: 12 divided by 3 is 4. Exponent: 5 minus 2 is 3. Check: 4a³ · 3a² = 12a⁵',
  ),
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("To'qqiz bu 12 ayirish 3. Koeffitsiyentlar ko'paytiriladi, demak teskari amal BO'LISH.", 'Девять это 12 минус 3. Коэффициенты перемножаются, значит обратное действие ДЕЛЕНИЕ.', 'Nine is 12 minus 3. The coefficients multiply, so the inverse is DIVISION.') },
    { key: 'c', tag: 'Z5', hint: L("Yetti bu 5 qo'shuv 2. Ko'rsatkichlar qo'shiladi, demak teskari amal AYIRISH.", 'Семь это 5 плюс 2. Показатели складываются, значит обратное действие ВЫЧИТАНИЕ.', 'Seven is 5 plus 2. The exponents add, so the inverse is SUBTRACTION.') },
    { key: 'd', tag: 'Z5', hint: L("Ikkita a yetmaydi: ikki qo'shuv ikki teng to'rt, bizga esa besh kerak.", 'Двух a не хватит: два плюс два это четыре, а нужно пять.', 'Two a is not enough: two plus two is four, but five is needed.') },
  ],
  reward: {
    title: L('Teskari amal ikki xil', 'Обратное действие двойное', 'The inverse is twofold'),
    text: L(
      "Koeffitsiyentda bo'lish, ko'rsatkichda ayirish. Ikkalasi ham to'g'ri amalning teskarisi.",
      'В коэффициенте деление, в показателе вычитание. Каждое обратно своему прямому действию.',
      'Division for the coefficient, subtraction for the exponent. Each is the inverse of its own operation.',
    ),
  },
  audio: [
    A('mount', "Oxirgi savol teskari: javob ma'lum, muljitel esa yo'q.", 'Последний вопрос обратный: ответ известен, а множитель нет.', 'The last question is inverted: the answer is known, the factor is not.'),
    A('mount', "Koeffitsiyent va ko'rsatkich bilan alohida ishlang.", 'Работай с коэффициентом и показателем отдельно.', 'Work with the coefficient and the exponent separately.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S13.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S13} screen={screen} audio={audio} solved={done} {...rest}>
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
    </LessonFrame>
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
      prompt: '5a² · 2a',
      ok: L("Sonlar ko'paytiriladi, ko'rsatkichlar qo'shiladi.", 'Числа перемножают, показатели складывают.', 'The numbers multiply, the exponents add.'),
      items: [
        { id: 'a', label: '10a³', correct: true },
        { id: 'b', label: '7a³', tag: 'Z1', hint: L("Yetti bu 5 qo'shuv 2.", 'Семь это 5 плюс 2.', 'Seven is 5 plus 2.') },
        { id: 'c', label: '10a²', tag: 'Z2', hint: L("Ikkinchi bir hadda ham a bor.", 'Во втором одночлене тоже есть a.', 'The second monomial has an a too.') },
        { id: 'd', label: '10a⁴', tag: 'Z5', hint: L("Ikki qo'shuv bir teng uch.", 'Два плюс один это три.', 'Two plus one is three.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: '−3x · 4x²',
      ok: L("Bitta manfiy muljitel natijani manfiy qiladi.", 'Один отрицательный множитель делает результат отрицательным.', 'One negative factor makes the result negative.'),
      items: [
        { id: 'a', label: '−12x³', correct: true },
        { id: 'b', label: '12x³', tag: 'Z4', hint: L("Ishora yo'qolib qoldi.", 'Знак потерялся.', 'The sign got lost.') },
        { id: 'c', label: '−12x²', tag: 'Z2', hint: L("Bitta va ikkita x birga uchta.", 'Одна и две x вместе три.', 'One and two x make three.') },
        { id: 'd', label: '−7x³', tag: 'Z1', hint: L("Yetti qo'shishdan chiqadi.", 'Семь выходит из сложения.', 'Seven comes from adding.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: '2a · 5b',
      ok: L("Harflar boshqa, ular alohida qoladi.", 'Буквы разные, они остаются отдельно.', 'The letters differ and stay apart.'),
      items: [
        { id: 'a', label: '10ab', correct: true },
        { id: 'b', label: '10a²', tag: 'Z3', hint: L("b ni a ga aylantirib bo'lmaydi.", 'b нельзя превратить в a.', 'The b cannot become an a.') },
        { id: 'c', label: '7ab', tag: 'Z1', hint: L("Yetti bu 2 qo'shuv 5.", 'Семь это 2 плюс 5.', 'Seven is 2 plus 5.') },
        { id: 'd', label: '10a²b²', tag: 'Z2', hint: L("Har harf bittadan.", 'Каждой буквы по одной.', 'One of each letter.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Qaysi bir had 2x² ga ko'paytirilganda 8x⁵ beradi?", 'Какой одночлен при умножении на 2x² даёт 8x⁵?', 'Which monomial times 2x² gives 8x⁵?'),
      ok: L("Koeffitsiyentda bo'lish, ko'rsatkichda ayirish.", 'В коэффициенте деление, в показателе вычитание.', 'Division for the coefficient, subtraction for the exponent.'),
      items: [
        { id: 'a', label: '4x³', correct: true },
        { id: 'b', label: '6x³', tag: 'Z1', hint: L("Olti bu 8 ayirish 2. Koeffitsiyentda bo'lish kerak.", 'Шесть это 8 минус 2. В коэффициенте нужно деление.', 'Six is 8 minus 2. The coefficient needs division.') },
        { id: 'c', label: '4x⁷', tag: 'Z5', hint: L("Yetti bu 5 qo'shuv 2. Ko'rsatkichda ayirish kerak.", 'Семь это 5 плюс 2. В показателе нужно вычитание.', 'Seven is 5 plus 2. The exponent needs subtraction.') },
        { id: 'd', label: '4x²', tag: 'Z5', hint: L("Ikki qo'shuv ikki teng to'rt, bizga esa besh kerak.", 'Два плюс два это четыре, а нужно пять.', 'Two plus two is four, but five is needed.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsdagi yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi ishora haqida.", 'Второй про знак.', 'The second is about the sign.'),
    A('2', "Uchinchisi turli harflar.", 'Третий про разные буквы.', 'The third is about different letters.'),
    A('3', "Oxirgisi teskari masala.", 'Последний обратная задача.', 'The last is the inverse problem.'),
  ],
}

function Screen14({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S14.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const resRef = useRef([])
  const total = S14.items.length
  return (
    <LessonFrame meta={S14} screen={screen} audio={audio} solved={done} {...rest}>
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
          onAnswer({ ...r, screen, role: 'blitz', scored: true, total, firstTry, level: levelFromFirstTry(firstTry, total) })
        }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Sonlar ko'paytiriladi, harflar sanaladi", 'Числа перемножают, буквы считают', 'Numbers multiply, letters are counted'),
  gate: S1.gate,
  fix: {
    tokens: ['6a²'],
    value: '6',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Ikkita a ko'paytirilganda a kvadrat chiqadi. Shuning uchun javob olti a kvadrat.",
    'При умножении двух a выходит a в квадрате. Поэтому ответ шесть a в квадрате.',
    'Multiplying two a gives a squared. So the answer is six a squared.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    sq: L('a kvadrat', 'a в квадрате', 'a squared'),
    lin: L('bitta a', 'одна a', 'one a'),
    sum: L('besh a', 'пять a', 'five a'),
    both: L('ikkalasi ham', 'оба', 'both'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['2a³ · 5a² → 10a⁵', '−3x²y · 4xy³ → −12x³y⁴', '3a · 4b → 12ab', '? · 3a² = 12a⁵ → 4a³'],
  twoLabel: L('Ikki amal', 'Два действия', 'Two operations'),
  twoA: 'son · son',
  twoB: "ko'rsatkich + ko'rsatkich",
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "bir hadning darajasi",
    'степень одночлена',
    'the power of a monomial',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Ikki bir hadning ko'paytmasi ham bir had bo'ladi.", 'Произведение двух одночленов тоже одночлен.', 'A product of two monomials is a monomial too.'),
    A('mount', "Keyingi darsda bir hadning darajasi bo'ladi.", 'В следующем уроке будет степень одночлена.', 'The next lesson brings the power of a monomial.'),
  ],
}

function Screen15({ screen, answers, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S15.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)

  const tags = collectLessonTags(answers, TAGS)
  const hook = (answers || []).find((a) => a && a.role === 'hook')
  const predict = hook && hook.picked ? S15.predictMap[hook.picked] : null

  const named = tags.slice(0, 2).map((code) => t(TAGS[code])).join(', ')
  const more = tags.length - 2
  const gapLine = tags.length
    ? t(S15.gapPrefix) + ': ' + named + (more > 0 ? ', ' + t(S15.moreGaps) + ' ' + more : '')
    : t(S15.noGap)

  return (
    <LessonFrame meta={S15} screen={screen} audio={audio} solved {...rest}>
      <TwoRoutes
        source={S15.gate.source}
        rows={S15.gate.rows}
        fix={{ ...S15.fix, onFix: () => audio.say(t(S15.fixSay)) }}
      />

      <HistoryTape items={S15.chips} label={S15.tapeLabel} />

      <div className="g7-sumcards g7-sumcards-one">
        <div className="g7-sumcard">
          <p className="g7-sumcard-h">{t(S15.twoLabel)}</p>
          <span className="g7-sumtwo-line"><Fx>{S15.twoA}</Fx></span>
          <span className="g7-sumtwo-line">{t(S15.twoB)}</span>
          <p className="g7-sumcard-note">
            <b>{t(S15.predictLabel)}:</b> {predict ? t(predict) : t(S15.noAnswer)}
          </p>
          <p className="g7-sumcard-note">
            <b>{t(S15.nextLabel)}:</b> {t(S15.nextTopic)}
          </p>
          <p className="g7-sumcard-note g7-readyline">{gapLine}</p>
        </div>
      </div>
    </LessonFrame>
  )
}

// ============================================================
// DARS. Obvyazka `core.jsx` da: `createLesson` ildiz komponentni,
// navigatsiyani, natija to'plamini va tillarni o'zi qiladi.
// ============================================================
export default createLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [
    Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8,
    Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
  ],
})
