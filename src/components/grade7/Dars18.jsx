// ============================================================================
// 7-sinf, Dars 18. KO'PHAD VA UNING TURLARI. B4 BLOKINING BIRINCHI DARSI.
// (Многочлен и его виды)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// ASBOB: `TermStrip` -- HADLAR LENTASI, B4 blokining yangi asbobi. Lenta
// FAQAT qo'shuv va ayirish belgisi bo'yicha kesiladi: ko'paytirish
// nuqtasida kesish tugmasi yo'q. Kesilgan joyda belgi o'chadi va had
// ostidagi chipda paydo bo'ladi -- ishora HAD BILAN ketgani ko'rinadi.
//
// ASOSIY XATO IKKITA.
//   1. Ishora had bilan ketmaydi: o'quvchi minusni hadlar ORASIDAGI amal
//      deb o'qiydi. 19-darsda aynan shundan qavs oldidagi minus faqat
//      birinchi hadga tarqaladi.
//   2. Tur STANDART SHAKLDAN OLDIN aytiladi: belgilar sanaladi, hadlar
//      emas. Xuk aynan shuni sinaydi -- uchta bo'lakka o'xshagan yozuv
//      bitta hadga yig'iladi.
//
// DARAJA (metodist qarori 2026-08-20): 7-sinfda misol o'zi ish talab
// qilishi kerak. Shuning uchun turni aytishdan oldin har yerda standart
// shaklga keltirish kerak bo'ladi, va had darajasi ham so'raladi.
//
// Obvyazka `core.jsx` da (`LessonFrame`, `createLesson`).
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Fx,
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
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  SortZones,
  StairsReveal,
  SubstituteRows,
  TermStrip,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_18'
const LESSON_TITLE = L('Ko\'phad va uning turlari', 'Многочлен и его виды', 'Polynomials and their kinds')
const LESSON_NO = L('18-dars', 'Урок 18', 'Lesson 18')
const BLOCK = { label: L('B4-blok', 'Блок Б4', 'Block B4'), from: 18, to: 24, current: 18 }

const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

const buildSegments = (list, lang) =>
  list.map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: s.on === 'mount' ? (i === 0 ? 'on_mount' : 'after_previous') : 'on_event:' + s.on,
    waits_for: null,
  }))

const TAGS = {
  Z1: L('belgilar hadlar o\'rniga sanaldi', 'посчитаны знаки, а не члены', 'signs were counted instead of terms'),
  Z2: L('ishora had bilan ketmadi', 'знак не ушёл с членом', 'the sign did not travel with the term'),
  Z3: L('muljitellar hadlar deb olindi', 'множители приняты за члены', 'factors were taken for terms'),
  Z4: L('tur standart shakldan oldin aytildi', 'вид назван до стандартного вида', 'the kind was named before the standard form'),
  Z5: L('birhad ko\'phad emas deb olindi', 'одночлен не считают многочленом', 'a monomial was not counted as a polynomial'),
  Z6: L('had darajasi noto\'g\'ri', 'степень члена найдена неверно', 'the term degree came out wrong'),
}

// ============================================================
// EKRAN 1. XUK. Uchta bo'lakka o'xshagan yozuv bitta hadga yig'iladi.
// ============================================================
const S1 = {
  eyebrow: L("KO'PHAD VA UNING TURLARI", 'МНОГОЧЛЕН И ЕГО ВИДЫ', 'POLYNOMIALS AND THEIR KINDS'),
  noBack: true,
  noNotes: true,
  title: L('Necha hadli yozuv', 'Сколько членов в записи', 'How many terms are in the record'),
  // XUK SAHNASI (§4.1): ikki yo'l yonma-yon. Yuqori tabloda sanoq
  // BELGILAR bo'yicha, pastda esa standart shakldan KEYIN. Sahna qaysi
  // biri to'g'ri ekanini aytmaydi (§8.1).
  gate: {
    source: { kind: 'plain', tokens: ['6x³', '−', '2x', '·', '3x²', '+', '5'] },
    rows: [
      { tokens: ['6x³', '−', '6x³', '+', '5'], value: '3' },
      { tokens: ['5'], value: '1' },
    ],
  },
  probe: {
    question: L(
      "Ikki o'quvchi bir xil yozuvda hadlarni sanadi va boshqa javob oldi. Sizningcha, nechta had qoladi?",
      'Два ученика посчитали члены в одной записи и получили разное. Как думаешь, сколько членов останется?',
      'Two students counted the terms in the same record and got different answers. How many terms do you think are left?',
    ),
    items: [
      {
        id: 'three',
        label: L('Uchta had', 'Три члена', 'Three terms'),
        hint: L(
          "Yuqori tabloga qarang: o'rtadagi ikki had bir xil, faqat ishorasi boshqa. Ular birga nima beradi.",
          'Посмотри на верхнее табло: два средних члена одинаковы, отличается только знак. Что они дают вместе.',
          'Look at the upper board: the two middle terms are the same, only the sign differs. What do they give together.',
        ),
      },
      {
        id: 'two',
        label: L('Ikkita had: nol va besh', 'Два члена: ноль и пять', 'Two terms: zero and five'),
        hint: L(
          "Nol nima qiladi: yozuvga qo'shilganda uni o'zgartiradimi.",
          'А что делает ноль: меняет ли он запись, когда его прибавляют.',
          'And what does zero do: does it change the record when you add it.',
        ),
      },
      {
        id: 'one',
        label: L('Bitta had', 'Один член', 'One term'),
        hint: L(
          "Taxminingiz qabul qilindi. Lentada tekshiramiz.",
          'Прогноз принят. Проверим на полосе.',
          'Your prediction is taken. We will check it on the strip.',
        ),
      },
      {
        id: 'no',
        label: L("Bu ko'phad emas", 'Это не многочлен', 'This is not a polynomial'),
        hint: L(
          "Son ham bir had, bir had esa bitta hadli ko'phad. Ya'ni ko'phad bo'lmay qolishi mumkin emas.",
          'Число тоже одночлен, а одночлен это многочлен из одного члена. Так что многочленом оно быть не перестанет.',
          'A number is a monomial too, and a monomial is a polynomial with one term. So it cannot stop being one.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Yozuvda ikki belgi turibdi, demak uchta bo'lak ko'rinadi.", 'В записи два знака, значит на вид три куска.', 'The record has two signs, so it looks like three pieces.'),
    A('mount', "Lekin o'rtadagi bo'lak ko'paytma, va uning standart shakli hali yozilmagan.", 'Но средний кусок это произведение, и его стандартный вид ещё не записан.', 'But the middle piece is a product, and its standard form is not written yet.'),
    A('mount', "Standart shaklga keltirilgandan keyin nechta had qolishini taxmin qiling.", 'Предположи, сколько членов останется после приведения к стандартному виду.', 'Predict how many terms are left after the record is reduced to standard form.'),
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
// EKRAN 2. TAYANCH. B3 bloki: bir had, uning standart shakli va darajasi.
// KVOTA EKRANI (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Bir had haqida uch savol', 'Три вопроса про одночлен', 'Three questions about a monomial'),
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      prompt: '−2a · 3a²b',
      ok: L("Koeffitsiyentlar ko'paytiriladi, bir xil harflar sanaladi.", 'Коэффициенты умножаются, одинаковые буквы считаются.', 'The coefficients multiply, the like letters get counted.'),
      items: [
        { id: 'a', label: '−6a³b', correct: true },
        { id: 'b', label: '−6a²b', tag: 'Z6', hint: L("a harfini sanang: birinchi ko'paytuvchida bitta, ikkinchisida ikkita.", 'Посчитай букву a: в первом множителе одна, во втором две.', 'Count the letter a: one in the first factor, two in the second.') },
        { id: 'c', label: '6a³b', tag: 'Z2', hint: L("Bitta minus toq, ishora esa yo'qolmaydi.", 'Один минус это нечётно, а знак не исчезает.', 'One minus is odd, and the sign does not vanish.') },
        { id: 'd', label: '−5a³b', tag: 'Z6', hint: L("Besh bu 2 qo'shuv 3. Koeffitsiyentlar esa ko'paytiriladi.", 'Пять это 2 плюс 3. А коэффициенты умножаются.', 'Five is 2 plus 3. But coefficients multiply.') },
      ],
    },
    {
      prompt: L("−6a³b bir hadning darajasi", 'Степень одночлена −6a³b', 'The degree of the monomial −6a³b'),
      wrap: true,
      question: null,
      ok: L("Daraja bu harflar ko'rsatkichlarining yig'indisi.", 'Степень это сумма показателей букв.', 'The degree is the sum of the letter exponents.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '3', tag: 'Z6', hint: L("b ning ko'rsatkichi ham hisobga olinadi, u birga teng.", 'Показатель b тоже учитывается, он равен единице.', 'The exponent of b counts too, it equals one.') },
        { id: 'c', label: '6', tag: 'Z6', hint: L("Olti bu koeffitsiyent. Daraja faqat harflardan yig'iladi.", 'Шесть это коэффициент. Степень собирается только из букв.', 'Six is the coefficient. The degree comes from the letters only.') },
        { id: 'd', label: '5', tag: 'Z6', hint: L("Ko'rsatkichlar qo'shiladi, koeffitsiyent esa qo'shilmaydi.", 'Показатели складываются, а коэффициент нет.', 'The exponents add up, the coefficient does not.') },
      ],
    },
    {
      prompt: '(2x)³',
      ok: L("Qavs ichidagi hammasi uch marta olinadi.", 'Всё, что в скобке, берётся трижды.', 'Everything inside the bracket is taken three times.'),
      items: [
        { id: 'a', label: '8x³', correct: true },
        { id: 'b', label: '6x³', tag: 'Z6', hint: L("Ikkilik uch marta olinadi, uchga ko'paytirilmaydi.", 'Двойка берётся три раза, а не умножается на три.', 'The two is taken three times, not multiplied by three.') },
        { id: 'c', label: '2x³', tag: 'Z6', hint: L("Ikkilik ham qavs ichida turibdi.", 'Двойка тоже стоит внутри скобки.', 'The two is inside the bracket as well.') },
        { id: 'd', label: '8x', tag: 'Z6', hint: L("x ham uch marta olinadi.", 'x тоже берётся три раза.', 'x is taken three times as well.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta qisqa savol o'tgan blokdan. Ular bugun kerak bo'ladi.", 'Три коротких вопроса из прошлого блока. Они понадобятся сегодня.', 'Three short questions from the last block. We will need them today.'),
    A('1', "Ikkinchisi daraja haqida.", 'Второй про степень.', 'The second is about the degree.'),
    A('2', "Oxirgisi qavs haqida.", 'Последний про скобку.', 'The last one is about the bracket.'),
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
        cols={4}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'support' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1. LENTA. Kesish faqat qo'shuv va ayirish
// belgisida, ishora esa had bilan ketadi. Savol asbob JAVOB BERMAYDIGAN
// narsa haqida: qaysi hadning darajasi eng katta.
// ============================================================
const S3 = {
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Yozuvni hadlarga ajratamiz', 'Разрежем запись на члены', 'Cutting the record into terms'),
  strips: [{ parts: ['9a⁶b²c', '−2a³bc⁴', '+2ab', '−5ac'] }],
  options: [
    { id: 'a', label: '9a⁶b²c' },
    { id: 'b', label: '−2a³bc⁴' },
    { id: 'c', label: '+2ab' },
    { id: 'd', label: '−5ac' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Ko'rsatkichlarni qo'shib ko'ring: uchta, bitta va to'rtta. Birinchi hadda esa oltita, ikkita va bitta.", 'Сложи показатели: три, один и четыре. А в первом члене шесть, два и один.', 'Add the exponents: three, one and four. In the first term they are six, two and one.') },
    { key: 'c', tag: 'Z6', hint: L("Bu hadda ikki harf bor va ikkalasining ko'rsatkichi birga teng.", 'В этом члене две буквы, и у обеих показатель равен единице.', 'This term has two letters, and both exponents equal one.') },
    { key: 'd', tag: 'Z6', hint: L("Bu hadda ham ikki harf, ko'rsatkichlar esa birga teng.", 'Здесь тоже две буквы, а показатели равны единице.', 'Here too there are two letters, and the exponents equal one.') },
  ],
  note: L(
    "Had darajasi bu uning harflari ko'rsatkichlarining yig'indisi.",
    'Степень члена это сумма показателей его букв.',
    'The degree of a term is the sum of its letter exponents.',
  ),
  ask: L('Qaysi hadning darajasi eng katta?', 'У какого члена степень самая большая?', 'Which term has the biggest degree?'),
  audio: [
    A('mount', "Yozuvdagi belgilarni bosing. Har bosishda yozuv hadlarga ajraladi.", 'Нажимай на знаки в записи. С каждым нажатием запись делится на члены.', 'Tap the signs in the record. Each tap splits the record into terms.'),
    A('mount', "Diqqat qiling: belgi hadning yoniga ko'chib o'tadi va u yerda qoladi. Minus hadning o'ziga tegishli.", 'Обрати внимание: знак переезжает к члену и остаётся при нём. Минус принадлежит самому члену.', 'Notice this: the sign moves over to the term and stays with it. The minus belongs to the term itself.'),
    A('cut-all', "Hammasi ajratildi. To'rt had, ya'ni to'rthad. Endi darajalarni solishtiring.", 'Всё разделено. Четыре члена, то есть четырёхчлен. Теперь сравни степени.', 'All separated. Four terms, that is a four-term polynomial. Now compare the degrees.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S3.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      <TermStrip
        audio={audio}
        strips={S3.strips}
        caption={S3.ask}
        options={S3.options}
        answer={S3.answer}
        wrongs={S3.wrongs}
        note={S3.note}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain', tags: r.tags }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 4. FARQLASH. Bir xil harflar, bir xil sonlar, boshqa hadlar
// soni. Ikki lenta yonma-yon: ko'paytirish nuqtasida kesish YO'Q.
// ============================================================
const S4 = {
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Nuqta va qo\'shuv belgisi', 'Точка и знак плюс', 'The dot and the plus sign'),
  strips: [
    { cap: L('Birinchi yozuv', 'Первая запись', 'The first record'), parts: ['3a · 2b', '+5'] },
    { cap: L('Ikkinchi yozuv', 'Вторая запись', 'The second record'), parts: ['3a', '+2b', '+5'] },
  ],
  options: [
    {
      id: 'a',
      label: L("Nuqta hadni bo'lmaydi", 'Точка не делит на члены', 'The dot does not split terms'),
    },
    {
      id: 'b',
      label: L('Sonlar kamroq', 'Чисел меньше', 'Fewer numbers'),
    },
    {
      id: 'c',
      label: L('Qavs tushib qolgan', 'Пропущена скобка', 'A bracket is missing'),
    },
    {
      id: 'd',
      label: L('Daraja kattaroq', 'Степень больше', 'A bigger degree'),
    },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Sonlar ikkala yozuvda ham bir xil.", 'Числа в обеих записях одни и те же.', 'Both records have the same numbers.') },
    { key: 'c', tag: 'Z3', hint: L("Qavs kerak emas: ko'paytirish oldin bajariladi.", 'Скобка не нужна: умножение идёт раньше.', 'No bracket is needed: multiplication comes first.') },
    { key: 'd', tag: 'Z3', hint: L("Daraja kattaroq, lekin sanoq darajaga qarab bormaydi.", 'Степень больше, но счёт идёт не по степени.', 'The degree is bigger, but counting does not go by degree.') },
  ],
  note: L(
    "Sanoq faqat qo'shuv va ayirish belgilari bo'yicha boradi.",
    'Счёт идёт только по знакам сложения и вычитания.',
    'Counting goes only by the plus and minus signs.',
  ),
  audio: [
    A('mount', "Ikki yozuvda bir xil harflar va bir xil sonlar. Belgi esa boshqa.", 'В двух записях одни и те же буквы и одни и те же числа. А знак другой.', 'Two records with the same letters and the same numbers. But a different sign.'),
    A('mount', "Ikkalasini ham ajratib ko'ring. Nuqtaning ustida kesish tugmasi yo'q.", 'Разрежь обе. Над точкой кнопки для разреза нет.', 'Cut both of them. There is no cutting button above the dot.'),
    A('cut-all', "Bitta yozuvda ikki had, boshqasida uchta. Nima uchun shunday.", 'В одной записи два члена, в другой три. Почему так.', 'One record has two terms, the other three. Why is that.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S4.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
      <TermStrip
        audio={audio}
        strips={S4.strips}
        options={S4.options}
        answer={S4.answer}
        wrongs={S4.wrongs}
        note={S4.note}
        cols={2}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3. O'SHA G'OYA IKKINCHI KO'RINISHDA: ayirish bu
// manfiy hadni qo'shish. Shu sababli ko'phad YIG'INDI deb ataladi.
// ============================================================
const S5 = {
  eyebrow: L('IKKINCHI KO\'RINISH', 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Ayirish qayerga ketdi', 'Куда ушло вычитание', 'Where the subtraction went'),
  template: ['7x³ − 4x² + 2x − 9  =  7x³ + ', { slot: 0 }, ' + 2x + ', { slot: 1 }],
  parts: [
    { id: 'a', label: '(−4x²)' },
    { id: 'b', label: '(4x²)' },
    { id: 'c', label: '(−9)' },
    { id: 'd', label: '(9)' },
  ],
  answer: ['a', 'c'],
  prompt: L(
    "Har hadni ISHORASI bilan qavsga oling. Shunda yozuvda faqat qo'shuv qoladi.",
    'Возьми каждый член ВМЕСТЕ с его знаком в скобки. Тогда в записи останется только сложение.',
    'Put each term in brackets TOGETHER with its sign. Then only addition is left in the record.',
  ),
  checkNote: L(
    "Ayirish bu manfiy hadni qo'shish. Shuning uchun ko'phad yig'indi deb ataladi.",
    'Вычитание это прибавление отрицательного члена. Поэтому многочлен и называют суммой.',
    'Subtracting is adding a negative term. That is why a polynomial is called a sum.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Minus qavs ichida qoladi, aks holda yozuv boshqa songa aylanadi.", 'Минус остаётся внутри скобки, иначе запись превратится в другое число.', 'The minus stays inside the bracket, otherwise the record becomes a different number.') },
    { key: 'd', tag: 'Z2', hint: L("To'qqiz oldida minus turgan edi, u had bilan birga ketadi.", 'Перед девяткой стоял минус, он уходит вместе с членом.', 'There was a minus before the nine, and it travels with the term.') },
    { key: '*', tag: 'Z2', hint: L("Ishora hadning qismi, u yozuvda qolib ketmaydi.", 'Знак это часть члена, он не остаётся в записи.', 'The sign is part of the term, it does not stay behind in the record.') },
  ],
  audio: [
    A('mount', "Bitta yozuvni ikkinchi ko'rinishda yozamiz. Unda ayirish bo'lmaydi, faqat qo'shuv.", 'Запишем ту же запись вторым видом. В нём не будет вычитания, только сложение.', 'We will write the same record a second way. It will have no subtraction, only addition.'),
    A('mount', "Har had o'z ishorasi bilan qavsga tushadi.", 'Каждый член уходит в скобки вместе со своим знаком.', 'Each term goes into brackets together with its own sign.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S5.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <SlotFill
        audio={audio}
        template={S5.template}
        parts={S5.parts}
        answer={S5.answer}
        prompt={S5.prompt}
        checkNote={S5.checkNote}
        wrongs={S5.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 6. O'ZINGIZ. TURLAR. Ikkita yozuvda hadlar soni KAMAYADI --
// ya'ni turni aytishdan oldin standart shakl kerak.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Turini toping', 'Определи вид', 'Name the kind'),
  zones: [
    { id: 'z1', label: L('Birhad', 'Одночлен', 'Monomial') },
    { id: 'z2', label: L('Ikkihad', 'Двучлен', 'Binomial') },
    { id: 'z3', label: L('Uchhad', 'Трёхчлен', 'Trinomial') },
  ],
  // KALIT `items` EMAS. Tekshiruv `items: [` ni VARIANTLAR to'plami deb
  // o'qiydi (skriptning kelishuvi), va kartalar ro'yxatini variant deb
  // olib «to'g'ri javob 0 ta» deb yolg'on xabar berardi.
  cards: [
    { id: 'i1', text: '3m · 4m', zone: 'z1' },
    { id: 'i2', text: 'x² + 5x − 5x', zone: 'z1' },
    { id: 'i3', text: '2c − 3', zone: 'z2' },
    { id: 'i4', text: 'a² + a² + 7', zone: 'z2' },
    { id: 'i5', text: '4x² + 5x + 8', zone: 'z3' },
    { id: 'i6', text: '6y³ − y³ + y − 2', zone: 'z3' },
  ],
  prompt: L(
    "Har yozuvni avval standart shaklga keltiring. Ba'zilarida hadlar soni KAMAYADI.",
    'Сначала приведи каждую запись к стандартному виду. В некоторых число членов УМЕНЬШИТСЯ.',
    'First bring each record to standard form. In some of them the number of terms DROPS.',
  ),
  wrongs: [
    { hint: L("Ikki yozuvda o'xshash hadlar bor. Ular birlashadi va hadlar soni kamayadi.", 'В двух записях есть подобные члены. Они соединяются, и число членов уменьшается.', 'Two records have like terms. They merge, and the number of terms drops.'), tag: 'Z4' },
  ],
  okNote: L(
    "Tur hadlar soniga qarab aytiladi, lekin faqat standart shakldan keyin.",
    'Вид называют по числу членов, но только после стандартного вида.',
    'The kind is named by the number of terms, but only after the standard form.',
  ),
  audio: [
    A('mount', "Olti yozuv va uchta tur. Har yozuvni o'z turiga qo'ying.", 'Шесть записей и три вида. Отправь каждую запись в свой вид.', 'Six records and three kinds. Send each record to its own kind.'),
    A('mount', "Ehtiyot bo'ling: ikki yozuvda o'xshash hadlar bor va ular birlashadi.", 'Осторожно: в двух записях есть подобные члены, и они соединятся.', 'Careful: two records have like terms, and they will merge.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S6.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S6} screen={screen} audio={audio} solved={done} {...rest}>
      <SortZones
        audio={audio}
        zones={S6.zones}
        items={S6.cards}
        prompt={S6.prompt}
        wrongs={S6.wrongs}
        okNote={S6.okNote}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH. Ikki boshqa yozuv --
// bitta ko'phad. Uchta son, uchtasida ham bir xil qiymat.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Ikki yozuv, bitta ko\'phad', 'Две записи, один многочлен', 'Two records, one polynomial'),
  numbers: [2, 3, 5],
  rows: [
    { id: 'r1', role: 'source', expr: 'a² + 5a − 3a', sub: (n) => n + '² + 5 · ' + n + ' − 3 · ' + n, val: (n) => n * n + 5 * n - 3 * n },
    { id: 'r2', expr: 'a² + 2a', sub: (n) => n + '² + 2 · ' + n, val: (n) => n * n + 2 * n },
  ],
  probe: {
    question: L(
      "Uchta sonda ham ikki qator bir xil son berdi. Bu nima degani?",
      'При всех трёх числах две строки дали одно и то же. Что это значит?',
      'At all three numbers the two rows gave the same value. What does that mean?',
    ),
    items: [
      { id: 'same', correct: true, label: L('Bitta ko\'phad, va u ikkihad', 'Один многочлен, и он двучлен', 'One polynomial, and it is a binomial') },
      { id: 'three', tag: 'Z4', label: L('Bitta ko\'phad, va u uchhad', 'Один многочлен, и он трёхчлен', 'One polynomial, and it is a trinomial'), hint: L("Uchta had faqat standart shaklga keltirilmagan yozuvda ko'rinadi. O'xshash hadlar birlashgach ikkitasi qoladi.", 'Три члена видны только в записи, не приведённой к стандартному виду. После соединения подобных остаётся два.', 'Three terms show only in a record that is not in standard form. Once like terms merge, two are left.') },
      { id: 'diff', tag: 'Z4', label: L('Boshqa-boshqa ko\'phadlar', 'Это разные многочлены', 'These are different polynomials'), hint: L("Uch xil son sinaldi va har uchtasida qiymat bir xil chiqdi. Boshqa ko'phadlar bunday qilmaydi.", 'Проверили три разных числа, и при каждом значение вышло одинаковым. Разные многочлены так не делают.', 'Three different numbers were tried, and each gave the same value. Different polynomials do not do that.') },
      { id: 'luck', tag: 'Z4', label: L('Tasodif, shu sonlarda mos keldi', 'Совпадение при этих числах', 'A coincidence at these numbers'), hint: L("Tasodif bitta sonda bo'ladi, uchtasida emas. Yozuvlardan biri ikkinchisining standart shakli.", 'Совпадение бывает при одном числе, а не при трёх. Одна из записей это стандартный вид другой.', 'A coincidence happens at one number, not at three. One record is the standard form of the other.') },
    ],
  },
  okText: L(
    "Tur STANDART SHAKL bo'yicha aytiladi, yozuvning ko'rinishi bo'yicha emas.",
    'Вид называют по СТАНДАРТНОМУ ВИДУ, а не по тому, как запись выглядит.',
    'The kind is named by the STANDARD FORM, not by how the record looks.',
  ),
  audio: [
    A('mount', "Yuqorida uchta hadli yozuv, pastda ikki hadli. Ular bir xilmi.", 'Сверху запись из трёх членов, снизу из двух. Одинаковы ли они.', 'Above is a record of three terms, below of two. Are they the same.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqa son bilan.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Ikki qatorni solishtiring.", 'Сравни две строки.', 'Compare the two rows.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S7.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S7} screen={screen} audio={audio} solved={done} {...rest}>
      <SubstituteRows
        audio={audio}
        rows={S7.rows}
        numbers={S7.numbers}
        runs={3}
        letter="a"
        question={S7.probe.question}
        options={S7.probe.items}
        okText={S7.okText}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
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
    { id: 'f1', label: L("ko'phad bu bir necha bir hadning yig'indisi", 'многочлен это сумма нескольких одночленов', 'a polynomial is a sum of several monomials') },
    { id: 'f2', label: L("uni tashkil qilgan bir hadlar uning hadlari deyiladi", 'составляющие его одночлены называют его членами', 'the monomials that make it up are called its terms') },
    { id: 'f3', label: L("har had o'z ishorasi bilan olinadi", 'каждый член берётся со своим знаком', 'each term is taken with its own sign') },
    { id: 'f4', label: L("tur esa standart shakldagi hadlar soniga qarab aytiladi", 'а вид называют по числу членов в стандартном виде', 'and the kind is named by the term count in standard form') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval ko'phad nima ekani, keyin hadlari, keyin ishora, oxirida tur.",
    'Порядок нарушен. Сначала что такое многочлен, потом его члены, потом знак, в конце вид.',
    'The order is off. First what a polynomial is, then its terms, then the sign, and the kind last.',
  ),
  lawChips: [
    { label: '+ −', tone: 's1' },
    { label: '·', tone: 's2' },
    { label: '1 2 3 4', tone: 'par' },
    { label: '±', tone: 'off' },
  ],
  lawSweep: L(
    "belgilar, nuqta, hadlar soni, ishora",
    'знаки, точка, число членов, знак члена',
    'signs, dot, term count, term sign',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Bir necha bir hadning algebraik yig'indisi ko'phad deyiladi. Ko'phadni tashkil qiluvchi bir hadlar shu ko'phadning hadlari deyiladi.",
        'Алгебраическая сумма нескольких одночленов называется многочленом. Одночлены, составляющие многочлен, называются его членами.',
        'An algebraic sum of several monomials is called a polynomial. The monomials that make it up are called its terms.',
      ),
      L(
        "Hadlar soniga qarab: bitta bo'lsa bir had, ikkita bo'lsa ikkihad, uchta bo'lsa uchhad, to'rtta bo'lsa to'rthad. Ularning hammasi ko'phad.",
        'По числу членов: один это одночлен, два двучлен, три трёхчлен, четыре четырёхчлен. И все они многочлены.',
        'By term count: one is a monomial, two a binomial, three a trinomial, four a four-term polynomial. All of them are polynomials.',
      ),
    ],
  },
  hookCap: L(
    "Belgilar sanalmaydi, hadlar sanaladi",
    'Считают не знаки, а члены',
    'You count terms, not signs',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("ishora hadning qismi", 'знак это часть члена', 'the sign is part of the term'),
    L("nuqta hadni bo'lmaydi", 'точка не делит на члены', 'the dot does not split terms'),
    L("tur standart shakldan keyin", 'вид после стандартного вида', 'the kind comes after the standard form'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило.', 'We have seen all the cases. Now let us build the rule.'),
    A('ok', "To'g'ri. Bu blokning birinchi qoidasi.", 'Верно. Это первое правило блока.', 'Correct. The first rule of the block.'),
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
// EKRAN 9. MASHQ 1. KVOTA EKRANI. To'rt yozuv, ikkitasida hadlar soni
// ko'ringanidan kam.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Nechta had', 'Сколько членов', 'How many terms'),
  question: L('Standart shaklda nechta had bor?', 'Сколько членов в стандартном виде?', 'How many terms in standard form?'),
  items: [
    {
      prompt: '−3x² + 9x − 5',
      ok: L("O'xshash had yo'q, uchtasi ham qoladi.", 'Подобных нет, все три остаются.', 'No like terms, all three stay.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '2', tag: 'Z1', hint: L("Ikki belgi bor, lekin hadlar undan bitta ko'p.", 'Знаков два, но членов на один больше.', 'There are two signs, but one more term than that.') },
        { id: 'c', label: '4', tag: 'Z1', hint: L("Belgilar bilan hadlarni qo'shib sanamang.", 'Не считай знаки вместе с членами.', 'Do not count the signs along with the terms.') },
        { id: 'd', label: '1', tag: 'Z1', hint: L("Harf qismlari boshqa, ular birlashmaydi.", 'Буквенные части разные, они не соединяются.', 'The letter parts differ, so they do not merge.') },
      ],
    },
    {
      prompt: 'ab³ + a³b − abc',
      ok: L("Harf qismlari boshqa, hech biri birlashmaydi.", 'Буквенные части разные, ничего не соединяется.', 'The letter parts differ, nothing merges.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '1', tag: 'Z4', hint: L("Bir xil harflar turgani birlashish uchun yetmaydi, ko'rsatkichlar ham bir xil bo'lishi kerak.", 'Одних тех же букв мало для соединения, показатели тоже должны совпадать.', 'The same letters are not enough to merge, the exponents must match too.') },
        { id: 'c', label: '2', tag: 'Z4', hint: L("Birinchi ikki hadda ko'rsatkichlar almashgan, ya'ni ular o'xshash emas.", 'В первых двух членах показатели поменялись местами, значит они не подобны.', 'In the first two terms the exponents are swapped, so they are not like terms.') },
        { id: 'd', label: '4', tag: 'Z1', hint: L("Uchinchi hadda uch harf bor, lekin u bitta had.", 'В третьем члене три буквы, но это один член.', 'The third term has three letters, but it is one term.') },
      ],
    },
    {
      prompt: '5x · 2x − 7',
      ok: L("Ko'paytma bitta had.", 'Произведение это один член.', 'A product is one term.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '3', tag: 'Z3', hint: L("Nuqta hadni bo'lmaydi, ko'paytma bitta had bo'lib qoladi.", 'Точка не делит на члены, произведение остаётся одним членом.', 'The dot does not split terms, a product stays one term.') },
        { id: 'c', label: '1', tag: 'Z1', hint: L("Ayirish belgisi bor, demak kamida ikki had.", 'Есть знак вычитания, значит членов не меньше двух.', 'There is a minus sign, so there are at least two terms.') },
        { id: 'd', label: '4', tag: 'Z3', hint: L("Ko'paytuvchilar had emas.", 'Множители это не члены.', 'Factors are not terms.') },
      ],
    },
    {
      prompt: '4y² − y² + 1',
      ok: L("Birinchi ikki had o'xshash, ular birlashadi.", 'Первые два члена подобны, они соединяются.', 'The first two terms are like, so they merge.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '3', tag: 'Z4', hint: L("Birinchi ikki hadda harf qismi bir xil, demak ular birlashadi.", 'У первых двух членов буквенная часть одинакова, значит они соединяются.', 'The first two terms have the same letter part, so they merge.') },
        { id: 'c', label: '1', tag: 'Z4', hint: L("Birlik alohida qoladi, uning harf qismi yo'q.", 'Единица остаётся отдельно, у неё нет буквенной части.', 'The one stays on its own, it has no letter part.') },
        { id: 'd', label: '4', tag: 'Z1', hint: L("Yozuvda uchta bo'lak ko'rinadi, undan ko'p emas.", 'В записи видно три куска, больше нет.', 'The record shows three pieces, no more.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt yozuv. Ikkitasida hadlar soni ko'ringanidan kam bo'ladi.", 'Четыре записи. В двух из них членов окажется меньше, чем видно.', 'Four records. In two of them there will be fewer terms than you see.'),
    A('1', "Ikkinchisida ko'rsatkichlarga diqqat qiling.", 'Во втором смотри на показатели.', 'In the second one watch the exponents.'),
    A('2', "Uchinchisida nuqta bor.", 'В третьем есть точка.', 'The third one has a dot.'),
    A('3', "Oxirgisida o'xshash hadlar bor.", 'В последнем есть подобные члены.', 'The last one has like terms.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S9.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S9} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S9.items}
        question={S9.question}
        cols={4}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 10. MASHQ 2. QADAMLAR ATALGAN: avval standart shakl, keyin son.
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Avval standart shakl, keyin qiymat', 'Сначала стандартный вид, потом значение', 'Standard form first, then the value'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['3y · y² − y³ + 4y − 7y + 9  =  ', { slot: 0 }, ' − ', { slot: 1 }, ' + 9'],
  parts: [
    { id: 'a', label: '2y³' },
    { id: 'b', label: '3y' },
    { id: 'c', label: '4y³' },
    { id: 'd', label: '11y' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Avval ko'paytmani hisoblang, keyin o'xshash hadlarni birlashtiring.",
    'Сначала посчитай произведение, потом соедини подобные члены.',
    'Work out the product first, then merge the like terms.',
  ),
  checkNote: L(
    "Uchta y kub bo'ldi, bittasi ayrildi: ikkita qoldi. To'rt y dan yetti y ayrilsa, minus uch y.",
    'Стало три y в кубе, один вычли: осталось два. Из четырёх y вычли семь y, вышло минус три y.',
    'Three y cubed came out, one was taken away: two are left. Four y minus seven y gives minus three y.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Uchta y kub bor edi, undan bittasi ayriladi.", 'Было три y в кубе, из них один вычитается.', 'There were three y cubed, and one is taken away.') },
    { key: 'd', tag: 'Z4', hint: L("To'rt va yetti qo'shilmaydi, ayriladi.", 'Четыре и семь не складывают, а вычитают.', 'Four and seven are not added but subtracted.') },
    { key: '*', tag: 'Z4', hint: L("O'xshash hadlarni izlang: harf qismi bir xil bo'lganlarini.", 'Ищи подобные члены: те, у которых одинакова буквенная часть.', 'Look for like terms: the ones with the same letter part.') },
  ],
  probe: {
    question: L('y ning o\'rniga 2 qo\'ysak, qiymat nechchi bo\'ladi?', 'Если вместо y поставить 2, каким будет значение?', 'If we put 2 in place of y, what is the value?'),
    items: [
      { id: 'a', correct: true, label: '19' },
      { id: 'b', tag: 'Z6', label: '23', hint: L("Uch y ayriladi, qo'shilmaydi.", 'Три y вычитают, а не прибавляют.', 'Three y is subtracted, not added.') },
      { id: 'c', tag: 'Z6', label: '13', hint: L("Ikkilik kubga ko'tariladi, so'ng ikkiga ko'paytiriladi.", 'Двойку возводят в куб, а потом умножают на два.', 'The two is cubed first, then multiplied by two.') },
      { id: 'd', tag: 'Z6', label: '11', hint: L("Oxirida to'qqiz qo'shiladi.", 'В конце прибавляется девять.', 'Nine is added at the end.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval standart shakl, keyin son.", 'Два шага. Сначала стандартный вид, потом число.', 'Two steps. Standard form first, then the number.'),
    A('mount', "Yozuvda ko'paytma ham, o'xshash hadlar ham bor.", 'В записи есть и произведение, и подобные члены.', 'The record has both a product and like terms.'),
    A('two', "Endi ikkinchi qadam: y o'rniga ikki qo'yamiz.", 'Теперь второй шаг: вместо y ставим два.', 'Now the second step: we put two in place of y.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S10.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [std, setStd] = useState(false)
  const [done, setDone] = useState(false)
  const [twoIn, setTwoIn] = useState(false)
  useEffect(() => {
    if (!std) return undefined
    const tmr = setTimeout(() => setTwoIn(true), 620)
    return () => clearTimeout(tmr)
  }, [std])
  return (
    <LessonFrame meta={S10} screen={screen} audio={audio} solved={done} {...rest}>
      <SlotFill
        audio={audio}
        template={S10.template}
        parts={S10.parts}
        answer={S10.answer}
        prompt={S10.prompt}
        promptCap={S10.step1Cap}
        checkNote={S10.checkNote}
        wrongs={S10.wrongs}
        tightAsk
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setStd(true); audio.step('two'); onAnswer({ ...r, screen, role: 'practice', part: 'standart' }) }}
      />
      {twoIn ? (
        <Probe
          data={S10.probe}
          cols={4}
          fbSlot={0}
          audio={audio}
          disabled={!canAnswer}
          onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice', part: 'qiymat' }) }}
        />
      ) : null}
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 11. FAQAT O'ZINGIZ. Asbob yo'q: uchta bir hadan ko'phad tuziladi
// va har had o'z ishorasi bilan qo'yiladi.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Uch bir haddan ko\'phad', 'Многочлен из трёх одночленов', 'A polynomial from three monomials'),
  given: L(
    "Berilgan bir hadlar: minus a ettinchi daraja, minus b oltinchi daraja, c to'rtinchi daraja.",
    'Даны одночлены: минус a в седьмой, минус b в шестой, c в четвёртой.',
    'The monomials given are: minus a to the seventh, minus b to the sixth, c to the fourth.',
  ),
  template: [{ slot: 0 }, '  ', { slot: 1 }, '  ', { slot: 2 }],
  parts: [
    { id: 'a', label: '−a⁷' },
    { id: 'b', label: '−b⁶' },
    { id: 'c', label: '+c⁴' },
    { id: 'd', label: '+b⁶' },
    { id: 'e', label: '−c⁴' },
  ],
  answer: ['a', 'b', 'c'],
  prompt: L(
    "Ulardan ko'phad tuzing. Har had o'z ishorasi bilan turishi kerak.",
    'Составь из них многочлен. Каждый член должен стоять со своим знаком.',
    'Build a polynomial out of them. Each term must carry its own sign.',
  ),
  checkNote: L(
    "Uch had, ya'ni uchhad. Ikkita hadda minus, bittasida qo'shuv.",
    'Три члена, то есть трёхчлен. У двух членов минус, у одного плюс.',
    'Three terms, that is a trinomial. Two terms have a minus, one has a plus.',
  ),
  wrongs: [
    { key: 'd', tag: 'Z2', hint: L("b oltinchi daraja oldida minus turgan edi, ishora o'zgarmaydi.", 'Перед b в шестой стоял минус, знак не меняется.', 'There was a minus before b to the sixth, and the sign does not change.') },
    { key: 'e', tag: 'Z2', hint: L("c to'rtinchi daraja oldida minus yo'q edi, uni o'zimiz qo'shmaymiz.", 'Перед c в четвёртой минуса не было, сами мы его не добавляем.', 'There was no minus before c to the fourth, and we do not add one.') },
    { key: '*', tag: 'Z2', hint: L("Berilgan uchta bir hadning ishoralarini o'zgartirmang.", 'Не меняй знаки трёх данных одночленов.', 'Do not change the signs of the three given monomials.') },
  ],
  audio: [
    A('mount', "Uchta bir had berilgan. Ulardan ko'phad tuzish kerak.", 'Даны три одночлена. Из них нужно составить многочлен.', 'Three monomials are given. You need to build a polynomial from them.'),
    A('mount', "Ishoralarni o'zgartirmang: har had qanday berilgan bo'lsa, shunday turadi.", 'Не меняй знаки: каждый член стоит так, как он дан.', 'Do not change the signs: each term stands as it was given.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S11.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S11} screen={screen} audio={audio} solved={done} {...rest}>
      <Hint>{t(S11.given)}</Hint>
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
// EKRAN 12. TUZOQ (§8.2). Uch qadam ham to'g'ri, XULOSA noto'g'ri:
// nol had yozilmaydi, ya'ni natija bir had.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Hisob to'g'ri bajarilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Счёт выполнен верно. И всё же какая строка ошибочна?',
    'The arithmetic is done right. Even so, which line is wrong?',
  ),
  // UCH QATOR, to'rtta emas: 12-ekranda ikki asbob turadi (qatorlar va
  // isbot), va to'rtinchi qator 488 px budjetidan chiqib ketardi. Qadamlar
  // MAZMUNI o'zgarmadi: ikkinchi qatorda ikki amal birga hisoblangan.
  rows: [
    { id: 'r1', text: '4x · x − x² + 7 − 7 = 3x² + 0' },
    { id: 'r2', text: L('nol ham had bo\'lib qoladi', 'ноль тоже остаётся членом', 'the zero stays a term too') },
    { id: 'r3', text: L('javob: ikkihad', 'ответ: двучлен', 'answer: a binomial') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("To'g'ri: ko'paytma hisoblandi, to'rttadan bittasi ayrildi, yettidan yetti nol berdi.", 'Верно: произведение посчитано, из четырёх вычли один, семь минус семь дало ноль.', 'Right: the product is worked out, one was taken from four, and seven minus seven gave zero.'),
    r3: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z1', r3: 'Z1' },
  proofFill: {
    template: ['4x · x − x² + 7 − 7  =  ', { slot: 0 }, ',  ya\'ni  ', { slot: 1 }],
    parts: [
      { id: 'a', label: '3x²' },
      { id: 'b', label: '3x² + 0' },
      { id: 'c', label: L('birhad', 'одночлен', 'a monomial') },
      { id: 'd', label: L('ikkihad', 'двучлен', 'a binomial') },
    ],
    answer: ['a', 'c'],
    prompt: L(
      "To'g'ri javobni yozing.",
      'Запиши верный ответ.',
      'Write the correct answer.',
    ),
    checkNote: L(
      "Nol yozuvni o'zgartirmaydi, ya'ni had bo'lib qolmaydi.",
      'Ноль запись не меняет, значит членом не остаётся.',
      'Zero does not change the record, so it does not stay a term.',
    ),
    wrongs: [
      { key: 'b|d', tag: 'Z1', hint: L("Nol had sifatida yozilmaydi: aks holda har qanday yozuvga nol qo'shib ketish mumkin bo'lardi.", 'Ноль членом не записывают: иначе к любой записи можно дописывать нули.', 'Zero is not written as a term: otherwise you could keep adding zeros to any record.') },
      { key: '*', tag: 'Z1', hint: L("Xato faqat xulosada edi.", 'Ошибка была только в выводе.', 'The mistake was only in the conclusion.') },
    ],
  },
  audio: [
    A('mount', "Uch qadam ham to'g'ri hisoblangan. Lekin javob noto'g'ri.", 'Все три шага посчитаны верно. А ответ неверен.', 'All three steps were worked out correctly. But the answer is wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. Nol had bo'lib qolmaydi.", 'Нашёл. Ноль членом не остаётся.', 'You found it. Zero does not remain a term.'),
    A('done', "Ya'ni bu yozuv bir had, ikkihad emas.", 'То есть эта запись одночлен, а не двучлен.', 'So this record is a monomial, not a binomial.'),
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
// EKRAN 13. KO'CHIRISH. TESKARI MASALA: qanday had qo'ysak, ikkihad
// qoladi. Bunda o'quvchi natijadan boshlab teskari yuradi.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE INVERSE TASK'),
  title: L('Qanday had qo\'ysak, ikkihad qoladi', 'Какой член вставить, чтобы остался двучлен', 'Which term makes a binomial'),
  template: ['5x³ + ', { slot: 0 }, ' − 2x + 7'],
  parts: [
    { id: 'a', label: '(−5x³)' },
    { id: 'b', label: '(5x³)' },
    { id: 'c', label: '(−2x³)' },
    { id: 'd', label: '(0)' },
  ],
  answer: ['a'],
  prompt: L(
    "Bo'sh joyga qanday had qo'ysak, standart shaklda IKKI had qoladi?",
    'Какой член поставить в пропуск, чтобы в стандартном виде осталось ДВА члена?',
    'Which term goes in the gap so that TWO terms are left in standard form?',
  ),
  checkNote: L(
    "Besh x kubdan besh x kub ayrilsa nol qoladi, va u yozilmaydi. Ikki had qoladi.",
    'Пять x в кубе минус пять x в кубе это ноль, а он не пишется. Остаются два члена.',
    'Five x cubed minus five x cubed is zero, and zero is not written. Two terms are left.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Ikkita x kubli had qo'shiladi va o'nta bo'ladi. Uchta had qoladi.", 'Два члена с x в кубе сложатся и дадут десять. Останется три члена.', 'Two x cubed terms add up to ten. Three terms are left.') },
    { key: 'c', tag: 'Z4', hint: L("O'xshash hadlar birlashadi, lekin natija nolga aylanmaydi.", 'Подобные члены соединятся, но в ноль не обратятся.', 'The like terms merge, but they do not turn into zero.') },
    { key: 'd', tag: 'Z4', hint: L("Nol qo'shilsa yozuv o'zgarmaydi, uchta had joyida qoladi.", 'Если прибавить ноль, запись не изменится, три члена останутся на месте.', 'Adding zero leaves the record unchanged, and three terms stay.') },
  ],
  audio: [
    A('mount', "Bu safar javob berilgan: ikki had qolishi kerak.", 'На этот раз ответ дан: должно остаться два члена.', 'This time the answer is given: two terms must be left.'),
    A('mount', "Bo'sh joyga qanday had qo'yish kerakligini o'zingiz toping.", 'Найди сам, какой член поставить в пропуск.', 'Work out yourself which term goes in the gap.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S13.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S13} screen={screen} audio={audio} solved={done} {...rest}>
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
// EKRAN 14. BLITS. Baholanadigan YAGONA ekran.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  items: [
    {
      wrap: true,
      question: null,
      prompt: L('7a² + 9b − 4b³ + 8 da nechta had bor?', 'Сколько членов в 7a² + 9b − 4b³ + 8?', 'How many terms are in 7a² + 9b − 4b³ + 8?'),
      ok: L("To'rt had, ya'ni to'rthad.", 'Четыре члена, то есть четырёхчлен.', 'Four terms, that is a four-term polynomial.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '3', tag: 'Z1', hint: L("Belgilar uchta, hadlar esa bittaga ko'p.", 'Знаков три, а членов на один больше.', 'There are three signs, and one more term than that.') },
        { id: 'c', label: '5', tag: 'Z1', hint: L("Bu yozuvda o'xshash hadlar yo'q, hech narsa ajralmaydi.", 'В этой записи нет подобных членов, ничего не расщепляется.', 'This record has no like terms, nothing splits.') },
        { id: 'd', label: '2', tag: 'Z4', hint: L("b va b kub o'xshash emas: ko'rsatkichlar boshqa.", 'b и b в кубе не подобны: показатели разные.', 'b and b cubed are not like: the exponents differ.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L('9a⁶b²c − 2a³bc⁴ + 2ab ko\'phadning ikkinchi hadi qaysi?', 'Какой второй член многочлена 9a⁶b²c − 2a³bc⁴ + 2ab?', 'Which is the second term of 9a⁶b²c − 2a³bc⁴ + 2ab?'),
      ok: L("Ishora had bilan ketadi.", 'Знак уходит вместе с членом.', 'The sign travels with the term.'),
      items: [
        { id: 'a', label: '−2a³bc⁴', correct: true },
        { id: 'b', label: '2a³bc⁴', tag: 'Z2', hint: L("Oldida minus turgan edi, u hadning qismi.", 'Перед ним стоял минус, он часть члена.', 'There was a minus before it, and it is part of the term.') },
        { id: 'c', label: '−2a³bc', tag: 'Z2', hint: L("c ning ko'rsatkichi tushib qoldi.", 'Потерялся показатель у c.', 'The exponent of c went missing.') },
        { id: 'd', label: '9a⁶b²c', tag: 'Z2', hint: L("Bu birinchi had.", 'Это первый член.', 'That is the first term.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L('6x³ − 2x · 3x² + 5 qanday ko\'phad?', 'Какой это многочлен: 6x³ − 2x · 3x² + 5?', 'What kind of polynomial is 6x³ − 2x · 3x² + 5?'),
      ok: L("Birinchi ikki had bir-birini so'ndirdi, son qoldi.", 'Первые два члена погасили друг друга, осталось число.', 'The first two terms cancelled each other, a number is left.'),
      items: [
        { id: 'a', label: L('Birhad', 'Одночлен', 'A monomial'), correct: true },
        { id: 'b', label: L('Ikkihad', 'Двучлен', 'A binomial'), tag: 'Z4', hint: L("Ko'paytmani hisoblang va birinchi had bilan solishtiring.", 'Посчитай произведение и сравни с первым членом.', 'Work out the product and compare it with the first term.') },
        { id: 'c', label: L('Uchhad', 'Трёхчлен', 'A trinomial'), tag: 'Z1', hint: L("Bu belgilar soni, hadlar soni emas.", 'Это число знаков, а не членов.', 'That is the number of signs, not of terms.') },
        { id: 'd', label: L("Ko'phad emas", 'Не многочлен', 'Not a polynomial'), tag: 'Z5', hint: L("Son ham bir had, bir had esa ko'phad.", 'Число тоже одночлен, а одночлен это многочлен.', 'A number is a monomial too, and a monomial is a polynomial.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L('x² − 3x ko\'phadning qiymati, x teng minus 2 da', 'Значение многочлена x² − 3x при x равном минус 2', 'The value of x² − 3x at x equal to minus two'),
      ok: L("Kvadrat musbat, ayirish esa qo'shuvga aylandi.", 'Квадрат положителен, а вычитание обратилось в сложение.', 'The square is positive, and the subtraction turned into addition.'),
      items: [
        { id: 'a', label: '10', correct: true },
        { id: 'b', label: '−2', tag: 'Z6', hint: L("Minus ikkining kvadrati musbat bo'ladi.", 'Квадрат минус двух положителен.', 'Minus two squared is positive.') },
        { id: 'c', label: '2', tag: 'Z6', hint: L("Uch karra minus ikki manfiy, uni ayirsak qo'shilib ketadi.", 'Три на минус два отрицательно, и вычитание превращается в сложение.', 'Three times minus two is negative, and subtracting it turns into adding.') },
        { id: 'd', label: '−10', tag: 'Z6', hint: L("Ikkala had ham musbat chiqadi.", 'Оба члена выходят положительными.', 'Both terms come out positive.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi ishora haqida.", 'Второй про знак.', 'The second is about the sign.'),
    A('2', "Uchinchisi xukdagi yozuv.", 'Третий это запись с хука.', 'The third is the record from the hook.'),
    A('3', "Oxirgisi son bilan.", 'Последний с числом.', 'The last one uses a number.'),
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
// EKRAN 15. YAKUN. Yangi matematika yo'q (§4.2).
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Ishora hadning qismi', 'Знак это часть члена', 'The sign is part of the term'),
  gate: S1.gate,
  fix: {
    tokens: ['5'],
    value: '1',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "O'rtadagi ikki had bir-birini so'ndirdi va nol berdi, nol esa had bo'lib yozilmaydi. Bitta had qoldi.",
    'Два средних члена погасили друг друга и дали ноль, а ноль членом не записывают. Остался один член.',
    'The two middle terms cancelled and gave zero, and zero is not written as a term. One term is left.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    one: L('bitta had', 'один член', 'one term'),
    two: L('ikkita had', 'два члена', 'two terms'),
    three: L('uchta had', 'три члена', 'three terms'),
    no: L("ko'phad emas", 'не многочлен', 'not a polynomial'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['9a⁶b²c − 2a³bc⁴ → 4', '3a · 2b + 5 → 2', 'x² + 5x − 5x → 1', '5x³ − 5x³ − 2x + 7 → 2'],
  twoLabel: L('B4 bloki boshlandi', 'Блок Б4 начался', 'Block B4 has started'),
  twoA: L("+ va −  →  hadlar", '+ и −  →  члены', '+ and −  →  terms'),
  twoB: L("·  →  bitta had", '·  →  один член', '·  →  one term'),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "ko'phadlarni qo'shish va ayirish",
    'сложение и вычитание многочленов',
    'adding and subtracting polynomials',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzatib qo'ying.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь его.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta narsadan chiqdi: sanoq faqat qo'shuv va ayirish belgilari bo'yicha boradi, ishora esa had bilan ketadi.", 'Вся сегодняшняя работа вышла из одного: счёт идёт только по знакам сложения и вычитания, а знак уходит вместе с членом.', 'All of today came from one thing: counting goes only by the plus and minus signs, and the sign travels with the term.'),
    A('mount', "Keyingi darsda ko'phadlarni qo'shamiz va ayiramiz.", 'На следующем уроке будем складывать и вычитать многочлены.', 'Next lesson we will add and subtract polynomials.'),
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
    </LessonFrame>
  )
}

// ============================================================
// DARS. Obvyazka `core.jsx` da.
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
