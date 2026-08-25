// ============================================================================
// 7-sinf, Dars 17. BIR HADNING DARAJASI. B3 BLOKINING OXIRGI DARSI.
// (Степень одночлена)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// ASBOB: `FactorTape` -- lenta, o'zgarishsiz. Bir hadni darajaga ko'tarish
// bu BUTUN LENTANI n marta takrorlash: koeffitsiyent ham, har harf ham
// o'sha n martaga ko'paytiriladi.
//
// ASOSIY XATO. Koeffitsiyentni ko'rsatkichga KO'PAYTIRISH: (3a²)² ni
// o'quvchi 6a⁴ deb yozadi. Uch KVADRATGA ko'tarilishi kerak, ya'ni 9.
// Xuk aynan shu ikki javobni yonma-yon qo'yadi.
//
// CHEGARAVIY HOLAT DARSLIKDAN. 37-bet aniq aytadi: bo'linuvchining
// ko'rsatkichi bo'linadigannikidan katta bo'lsa, natija bir had BO'LMAYDI.
// Ya'ni bir hadlar bo'linishga yopiq emas -- bu 13-darsdan boshlangan
// «har yozuv bir had bo'lmaydi» chizig'ining davomi.
//
// Obvyazka `core.jsx` da (`LessonFrame`, `createLesson`).
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  DoneRow,
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
  FactorTape,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  StairsReveal,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_17'
const LESSON_TITLE = L('Bir hadning darajasi', 'Степень одночлена', 'The power of a monomial')
const LESSON_NO = L('17-dars', 'Урок 17', 'Lesson 17')
const BLOCK = { label: L('B3-blok', 'Блок Б3', 'Block B3'), from: 13, to: 17, current: 17 }

const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

const buildSegments = (list, lang) =>
  list.map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: s.on === 'mount' ? (i === 0 ? 'on_mount' : 'after_previous') : 'on_event:' + s.on,
    waits_for: null,
  }))

const TAGS = {
  Z1: L("koeffitsiyent ko'paytirildi", 'коэффициент умножен', 'the coefficient was multiplied'),
  Z2: L("harf ko'rsatkichi qoldi", 'показатель буквы не изменён', 'the letter exponent stayed'),
  Z3: L('ishora hisobga olinmadi', 'знак не учтён', 'the sign was ignored'),
  Z4: L("natija bir had emas", 'результат не одночлен', 'the result is not a monomial'),
  Z5: L('muljitellar sanalmadi', 'множители не посчитаны', 'the factors were not counted'),
  Z6: L('amallar tartibi', 'порядок действий', 'order of operations'),
}

// ============================================================
// EKRAN 1. XUK. (3a²)²: koeffitsiyent kvadratga ko'tariladimi yoki
// ko'rsatkichga ko'paytiriladimi. Tablolarda KOEFFITSIYENT turadi.
// ============================================================
const S1 = {
  eyebrow: L('BIR HADNING DARAJASI', 'СТЕПЕНЬ ОДНОЧЛЕНА', 'THE POWER OF A MONOMIAL'),
  noBack: true,
  noNotes: true,
  title: L('Koeffitsiyent bilan nima bo\'ladi', 'Что происходит с коэффициентом', 'What happens to the coefficient'),
  gate: {
    source: { kind: 'plain', tokens: ['(3a²)²'] },
    rows: [
      { tokens: ['6a⁴'], value: '6' },
      { tokens: ['9a⁴'], value: '9' },
    ],
  },
  probe: {
    question: L(
      "Ikkalasi ham harf ko'rsatkichini to'g'ri topdi. Koeffitsiyentda esa farq bor. Kim haq?",
      'Оба верно нашли показатель буквы. А с коэффициентом разошлись. Кто прав?',
      'Both got the letter exponent right. But they differ on the coefficient. Who is right?',
    ),
    items: [
      {
        id: 'sq',
        label: L(
          "To'qqiz: uchlik ham kvadratga ko'tariladi",
          'Девять: тройка тоже возводится в квадрат',
          'Nine: the three is squared as well',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Lentada tekshiramiz.",
          'Прогноз принят. Проверим на ленте.',
          'Your prediction is taken. We will check it on the tape.',
        ),
      },
      {
        id: 'mul',
        label: L("Olti: uchlik ko'rsatkichga ko'paytiriladi", 'Шесть: тройку умножают на показатель', 'Six: the three is multiplied by the exponent'),
        hint: L(
          "Ko'paytirish faqat KO'RSATKICHLAR bilan bo'ladi. Koeffitsiyent esa boshqa hammasi kabi ikki marta olinadi.",
          'Умножение бывает только с ПОКАЗАТЕЛЯМИ. А коэффициент, как и всё остальное, берётся дважды.',
          'Multiplying happens only with EXPONENTS. The coefficient, like everything else, is taken twice.',
        ),
      },
      {
        id: 'keep',
        label: L("Uchlik o'zgarmaydi", 'Тройка не меняется', 'The three does not change'),
        hint: L(
          "Qavs ichidagi hammasi darajaga kiradi -- bu o'n uchinchi darsdan tanish.",
          'В степень входит всё, что в скобке — это знакомо с тринадцатого урока.',
          'Everything in the bracket enters the power — familiar from lesson thirteen.',
        ),
      },
      {
        id: 'both',
        label: L("Ikkalasi ham to'g'ri", 'Оба верны', 'Both are right'),
        hint: L(
          "a teng 1 ni qo'yib ko'ring: 3 karra 1 kvadrat teng 9. Olti chiqmaydi.",
          'Подставь a = 1: 3 умножить на 1, в квадрате это 9. Шесть не выходит.',
          'Try a = 1: 3 times 1, squared, is 9. Six does not come out.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Blokning oxirgi darsi. Bir hadni butunlay darajaga ko'taramiz.", 'Последний урок блока. Возведём одночлен в степень целиком.', 'The last lesson of the block. We raise a whole monomial to a power.'),
    A('mount', "Ikki o'quvchi harf ko'rsatkichini bir xil topdi, koeffitsiyentda esa boshqacha.", 'Два ученика нашли одинаковый показатель буквы, а коэффициент разный.', 'Two students found the same letter exponent but different coefficients.'),
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
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      prompt: '(2a)³',
      ok: L("Qavs ichidagi hammasi darajaga kiradi.", 'В степень входит всё, что в скобке.', 'Everything in the bracket enters the power.'),
      items: [
        { id: 'a', label: '8a³', correct: true },
        { id: 'b', label: '6a³', tag: 'Z1', hint: L("Olti bu 2 karra 3. Ikkilik uch marta ko'paytiriladi: 8.", 'Шесть это 2 на 3. Двойка умножается трижды: 8.', 'Six is 2 times 3. The two multiplies three times: 8.') },
        { id: 'c', label: '2a³', tag: 'Z1', hint: L("Ikkilik ham qavs ichida.", 'Двойка тоже в скобке.', 'The two is inside the bracket as well.') },
        { id: 'd', label: '8a', tag: 'Z5', hint: L("Lentada uchta a ham bor.", 'В ленте есть и три a.', 'The tape also holds three a.') },
      ],
    },
    {
      prompt: '(a²)³',
      ok: L("Darajaning darajasida ko'rsatkichlar ko'paytiriladi.", 'В степени степени показатели умножаются.', 'A power of a power multiplies the exponents.'),
      items: [
        { id: 'a', label: 'a⁶', correct: true },
        { id: 'b', label: 'a⁵', tag: 'Z6', hint: L("Besh bu ikki qo'shuv uch. Guruh esa uch marta TAKRORLANADI.", 'Пять это два плюс три. А группа ПОВТОРЯЕТСЯ трижды.', 'Five is two plus three. But the group REPEATS three times.') },
        { id: 'c', label: 'a⁸', tag: 'Z6', hint: L("Sakkiz bu ikkining kubi. Ko'paytirilishi kerak bo'lgan narsa ko'rsatkichlar: ikki karra uch.", 'Восемь это два в кубе. А перемножать надо показатели: два на три.', 'Eight is two cubed. What multiplies is the exponents: two times three.') },
        { id: 'd', label: 'a²', tag: 'Z2', hint: L("Tashqi ko'rsatkich hisobga olinmadi.", 'Внешний показатель не учтён.', 'The outer exponent was ignored.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("−a²b ning koeffitsiyenti?", 'Коэффициент у −a²b?', 'The coefficient of −a²b?'),
      ok: L("Son yozilmagan, faqat minus turibdi.", 'Числа не написано, стоит только минус.', 'No number is written, only a minus.'),
      items: [
        { id: 'a', label: '−1', correct: true },
        { id: 'b', label: '1', tag: 'Z3', hint: L("Ishora ham koeffitsiyentga kiradi.", 'Знак тоже входит в коэффициент.', 'The sign belongs to the coefficient too.') },
        { id: 'c', label: '−2', tag: 'Z3', hint: L("Ikkilik bu a ning ko'rsatkichi.", 'Двойка это показатель a.', 'Two is the exponent of a.') },
        { id: 'd', label: '0', tag: 'Z3', hint: L("Nol koeffitsiyent bir hadni nolga aylantirardi.", 'Нулевой коэффициент обратил бы одночлен в нуль.', 'A zero coefficient would zero the monomial.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta savolga javob beramiz.", 'Ответим на три вопроса.', 'Three things to recall.'),
    A('1', "Ikkinchisi darajaning darajasi.", 'Второе степень степени.', 'The second is a power of a power.'),
    A('2', "Uchinchisi koeffitsiyent.", 'Третье коэффициент.', 'The third is the coefficient.'),
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
// EKRAN 3. LENTA IKKI MARTA. (3a²)² -- butun bir had ikki marta yoziladi.
// ============================================================
const S3 = {
  eyebrow: L('LENTA IKKI MARTA', 'ЛЕНТА ДВАЖДЫ', 'THE TAPE TWICE'),
  title: L('Butun bir had takrorlanadi', 'Одночлен повторяется целиком', 'The whole monomial repeats'),
  tape: {
    expr: '(3a²)²',
    mixed: ['3', 'a', 'a', '3', 'a', 'a'],
    options: [
      { id: 'a', label: '9a⁴' },
      { id: 'b', label: '6a⁴' },
      { id: 'c', label: '9a²' },
      { id: 'd', label: '3a⁴' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z1', hint: L("Lentada ikkita uchlik bor: 3 karra 3 teng 9. Ko'paytirish emas, TAKRORLASH.", 'В ленте две тройки: 3 на 3 это 9. Не умножение на показатель, а ПОВТОР.', 'The tape holds two threes: 3 times 3 is 9. Not multiplying by the exponent but REPEATING.') },
      { key: 'c', tag: 'Z2', hint: L("Hisobga qarang: to'rtta a.", 'Посмотри на счёт: четыре a.', 'Look at the tally: four a.') },
      { key: 'd', tag: 'Z5', hint: L("Uchlik ikki marta uchraydi, demak u ham ko'paytiriladi.", 'Тройка встречается дважды, значит и она умножается.', 'The three appears twice, so it multiplies too.') },
      { key: '*', tag: 'Z5', hint: L("Hisobda sonlar ham, a ning soni ham turibdi.", 'В счёте стоят и числа, и количество a.', 'The tally shows the numbers and how many a.') },
    ],
    note: L(
      "Bir hadni darajaga ko'tarish -- uni butunlay takrorlash.",
      'Возвести одночлен в степень значит повторить его целиком.',
      'Raising a monomial to a power means repeating it whole.',
    ),
  },
  reward: {
    title: L('Koeffitsiyent ham takrorlanadi', 'Коэффициент тоже повторяется', 'The coefficient repeats too'),
    text: L(
      "Shuning uchun u ko'rsatkichga ko'paytirilmaydi, balki o'sha darajaga ko'tariladi: uchlikning kvadrati to'qqiz.",
      'Поэтому его не умножают на показатель, а возводят в ту же степень: квадрат тройки девять.',
      'So it is not multiplied by the exponent but raised to that power: three squared is nine.',
    ),
  },
  audio: [
    A('mount', "Yozuvni bosing.", 'Нажми на запись.', 'Tap the record.'),
    A('open', "Bir had ikki marta yozildi: ikkita uchlik va to'rtta a.", 'Одночлен записан дважды: две тройки и четыре a.', 'The monomial is written twice: two threes and four a.'),
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
        groups={[3, 3]}
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
// EKRAN 4. FARQLASH. (3a²)² va 3(a²)² -- qavs qaerda tugaydi.
// KVOTA EKRANI.
// ============================================================
const S4 = {
  eyebrow: L('QAVS QAYERDA TUGAYDI', 'ГДЕ КОНЧАЕТСЯ СКОБКА', 'WHERE THE BRACKET ENDS'),
  title: L("Uchlik qavs ichida yoki tashqarisida", 'Тройка внутри скобки или вне', 'The three inside the bracket or outside'),
  expr: '(3a²)²    va    3(a²)²',
  probe: {
    question: L(
      "Bu ikki yozuv nimaga teng?",
      'Чему равны эти две записи?',
      'What do these two records equal?',
    ),
    items: [
      { id: 'a', correct: true, label: L('9a⁴ va 3a⁴', '9a⁴ и 3a⁴', '9a⁴ and 3a⁴') },
      {
        id: 'b', tag: 'Z1',
        label: L('9a⁴ va 9a⁴', '9a⁴ и 9a⁴', '9a⁴ and 9a⁴'),
        hint: L("Ikkinchi yozuvda uchlik qavsdan TASHQARIDA: u bir marta olinadi, faqat a kvadrat ikki marta takrorlanadi.", 'Во второй записи тройка ВНЕ скобки: её берут один раз, дважды повторяется только a в квадрате.', 'In the second record the three is OUTSIDE: it is taken once, only a squared repeats twice.'),
      },
      {
        id: 'c', tag: 'Z1',
        label: L('6a⁴ va 3a⁴', '6a⁴ и 3a⁴', '6a⁴ and 3a⁴'),
        hint: L("Olti bu 3 karra 2. Birinchi yozuvda uchlik qavs ichida, demak KVADRATGA ko'tariladi: to'qqiz.", 'Шесть это 3 на 2. В первой записи тройка в скобке, значит возводится в КВАДРАТ: девять.', 'Six is 3 times 2. In the first record the three is inside, so it is SQUARED: nine.'),
      },
      {
        id: 'd', tag: 'Z2',
        label: L('9a⁴ va 3a²', '9a⁴ и 3a²', '9a⁴ and 3a²'),
        hint: L("Ikkinchi yozuvda ham a kvadrat ikki marta takrorlanadi: a to'rtinchi daraja.", 'Во второй записи a в квадрате тоже повторяется дважды: a в четвёртой.', 'In the second record a squared also repeats twice: a to the fourth.'),
      },
    ],
    ok: L(
      "Qavs ichidagi hammasi takrorlanadi, tashqarisidagi esa bir marta olinadi.",
      'Всё, что в скобке, повторяется, а стоящее вне берётся один раз.',
      'Everything inside the bracket repeats, what is outside is taken once.',
    ),
  },
  audio: [
    A('mount', "Ikki yozuv, farq faqat qavsning chegarasida.", 'Две записи, разница только в границе скобки.', 'Two records, the only difference is where the bracket ends.'),
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
// EKRAN 5. UCH MARTA VA ISHORA BILAN. (−2a²b)³.
// ============================================================
const S5 = {
  eyebrow: L('UCH MARTA', 'ТРИЖДЫ', 'THREE TIMES'),
  title: L("Toq daraja ishorani saqlaydi", 'Нечётная степень сохраняет знак', 'An odd power keeps the sign'),
  tape: {
    expr: '(−2a²b)³',
    mixed: ['−2', 'a', 'a', 'b', '−2', 'a', 'a', 'b', '−2', 'a', 'a', 'b'],
    options: [
      { id: 'a', label: '−8a⁶b³' },
      { id: 'b', label: '8a⁶b³' },
      { id: 'c', label: '−6a⁶b³' },
      { id: 'd', label: '−8a⁵b³' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z3', hint: L("Uchta manfiy son toq, natija manfiy bo'ladi.", 'Три отрицательных числа это нечётно, результат отрицательный.', 'Three negative numbers is odd, the result is negative.') },
      { key: 'c', tag: 'Z1', hint: L("Olti bu 2 karra 3. Lentada esa uchta ikkilik ko'paytiriladi: sakkiz.", 'Шесть это 2 на 3. А в ленте перемножаются три двойки: восемь.', 'Six is 2 times 3. The tape multiplies three twos: eight.') },
      { key: 'd', tag: 'Z2', hint: L("Hisobga qarang: oltita a.", 'Посмотри на счёт: шесть a.', 'Look at the tally: six a.') },
      { key: '*', tag: 'Z5', hint: L("Uchta minus ikki, oltita a va uchta b.", 'Три минус два, шесть a и три b.', 'Three minus twos, six a and three b.') },
    ],
    note: L(
      "Har element uch marta olindi: son ham, harflar ham.",
      'Каждый элемент взят трижды: и число, и буквы.',
      'Every element was taken three times: the number and the letters.',
    ),
  },
  audio: [
    A('mount', "Bu safar uch marta va koeffitsiyent manfiy.", 'На этот раз трижды и коэффициент отрицательный.', 'This time three times and the coefficient is negative.'),
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
        groups={[4, 4, 4]}
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
// EKRAN 6. O'ZINGIZ. Juft daraja: (−x³y)⁴.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Juft daraja va yozilmagan koeffitsiyent', 'Чётная степень и ненаписанный коэффициент', 'An even power and an unwritten coefficient'),
  template: ['(−x³y)⁴ = ', { slot: 0 }],
  parts: [
    { id: 'a', label: 'x¹²y⁴' },
    { id: 'b', label: '−x¹²y⁴' },
    { id: 'c', label: 'x⁷y⁴' },
    { id: 'd', label: 'x¹²y' },
  ],
  answer: ['a'],
  prompt: L(
    "Koeffitsiyent minus bir, u ham to'rt marta olinadi.",
    'Коэффициент минус один, он тоже берётся четыре раза.',
    'The coefficient is minus one and it is taken four times too.',
  ),
  checkNote: L(
    "To'rtta minus bir musbat beradi; x ning ko'rsatkichi 3 karra 4 teng 12, y esa 1 karra 4",
    'Четыре минус единицы дают плюс; показатель x это 3 на 4, то есть 12, а y это 1 на 4',
    'Four minus ones give a plus; the x exponent is 3 times 4, that is 12, and y is 1 times 4',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("To'rtta minus juft son, ular bir-birini yo'qotadi.", 'Четыре минуса это чётное число, они гасят друг друга.', 'Four minuses is even, they cancel out.') },
    { key: 'c', tag: 'Z6', hint: L("Yetti bu 3 qo'shuv 4. Darajaning darajasida ko'rsatkichlar ko'paytiriladi.", 'Семь это 3 плюс 4. В степени степени показатели умножают.', 'Seven is 3 plus 4. A power of a power multiplies the exponents.') },
    { key: 'd', tag: 'Z2', hint: L("y ning ko'rsatkichi ham to'rtga ko'paytiriladi: bir karra to'rt.", 'Показатель y тоже умножается на четыре: один на четыре.', 'The y exponent multiplies by four too: one times four.') },
  ],
  audio: [
    A('mount', "Endi o'zingiz. Koeffitsiyent yozilmagan, lekin u bor.", 'Теперь сам. Коэффициент не написан, но он есть.', 'Now on your own. The coefficient is unwritten but present.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S6.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S6} screen={screen} audio={audio} solved={done} {...rest}>
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
    </LessonFrame>
  )
}

// ============================================================
// EKRAN 7. CHEGARAVIY HOLAT (darslik, 37-bet). Bo'linishda natija
// bir had BO'LMASLIGI mumkin.
// ============================================================
const S7 = {
  eyebrow: L("HAR DOIM BIR HAD EMAS", 'НЕ ВСЕГДА ОДНОЧЛЕН', 'NOT ALWAYS A MONOMIAL'),
  title: L("Bo'linish natijasi bir had bo'lmasligi mumkin", 'Частное может не быть одночленом', 'A quotient may fail to be a monomial'),
  expr: '6a³ : 2a⁵',
  probe: {
    question: L(
      "Ko'rsatkichlarni ayirsak, 3 ayirish 5 chiqadi. Natija bir hadmi?",
      'Если вычесть показатели, выйдет 3 минус 5. Является ли результат одночленом?',
      'Subtracting the exponents gives 3 minus 5. Is the result a monomial?',
    ),
    items: [
      {
        id: 'no', correct: true,
        label: L("Yo'q: bo'linuvchining ko'rsatkichi kattaroq", 'Нет: у делителя показатель больше', 'No: the divisor has the bigger exponent'),
      },
      {
        id: 'yes', tag: 'Z4',
        label: L('Ha, 3a⁻²', 'Да, 3a⁻²', 'Yes, 3a⁻²'),
        hint: L("Manfiy ko'rsatkich bir hadda bo'lmaydi: bir had faqat NATURAL ko'rsatkichli darajalardan tuziladi.", 'Отрицательного показателя в одночлене не бывает: одночлен строится только из степеней с НАТУРАЛЬНЫМ показателем.', 'A monomial has no negative exponent: it is built only from powers with a NATURAL exponent.'),
      },
      {
        id: 'zero', tag: 'Z4',
        label: L('Ha, 3', 'Да, 3', 'Yes, 3'),
        hint: L("Harf yo'qolib qolmaydi: uchta a ni beshta a ga bo'lsak, ikkita a bo'luvchida qoladi.", 'Буква не исчезает: три a разделить на пять a оставляет два a в делителе.', 'The letter does not vanish: three a divided by five a leaves two a in the divisor.'),
      },
      {
        id: 'cant', tag: 'Z4',
        label: L("Bo'lish umuman mumkin emas", 'Делить вообще нельзя', 'It cannot be divided at all'),
        hint: L("Bo'lish mumkin, natija esa kasr ko'rinishida yoziladi. Faqat u BIR HAD bo'lmaydi.", 'Делить можно, результат записывают дробью. Просто он не будет ОДНОЧЛЕНОМ.', 'It can be divided and the result is written as a fraction. It just is not a MONOMIAL.'),
      },
    ],
    ok: L(
      "Natija bor, lekin u bir had emas: uchta a beshta a ga qisqarmaydi.",
      'Результат есть, но он не одночлен: три a не сокращаются с пятью.',
      'A result exists but it is not a monomial: three a do not cancel five.',
    ),
  },
  bonus: {
    title: L("Bir hadlar bo'linishga yopiq emas", 'Одночлены не замкнуты относительно деления', 'Monomials are not closed under division'),
    text: L(
      "Ikki bir hadning ko'paytmasi har doim bir had bo'ladi, ko'paytmasi esa har doim emas. Shu chiziq o'n uchinchi darsdan boshlangan: har yozuv bir had bo'lmaydi.",
      'Произведение двух одночленов всегда одночлен, а частное — не всегда. Эта линия началась с тринадцатого урока: не всякая запись одночлен.',
      'A product of two monomials is always a monomial, a quotient is not. This line started in lesson thirteen: not every record is a monomial.',
    ),
  },
  audio: [
    A('mount', "Bo'linishda ko'rsatkichlar ayiriladi. Lekin bu safar bo'linuvchi kattaroq.", 'При делении показатели вычитаются. Но на этот раз делитель больше.', 'Division subtracts the exponents. But this time the divisor is bigger.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildSegments(S7.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S7} screen={screen} audio={audio} solved={done} {...rest}>
      <div className="g7-eqb-lone"><Fx>{S7.expr}</Fx></div>
      <Probe
        data={S7.probe}
        cols={2}
        audio={audio}
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
    { id: 'f1', label: L('bir had butunlay takrorlanadi', 'одночлен повторяется целиком', 'the monomial repeats whole') },
    { id: 'f2', label: L("koeffitsiyent shu darajaga ko'tariladi", 'коэффициент возводится в эту степень', 'the coefficient is raised to that power') },
    { id: 'f3', label: L("har harf ko'rsatkichi ko'paytiriladi", 'показатель каждой буквы умножается', 'each letter exponent is multiplied') },
    { id: 'f4', label: L("juft daraja minusni yo'qotadi", 'чётная степень убирает минус', 'an even power removes the minus') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval takrorlash, keyin koeffitsiyent, keyin harflar, oxirida ishora.",
    'Порядок нарушен. Сначала повтор, потом коэффициент, потом буквы, в конце знак.',
    'The order is off. Repetition first, then the coefficient, then the letters, and the sign last.',
  ),
  lawChips: [
    { label: '( )ⁿ', tone: 'par' },
    { label: 'kⁿ', tone: 's1' },
    { label: '· n', tone: 's2' },
    { label: '±', tone: 'off' },
  ],
  lawSweep: L(
    "takrorlash, koeffitsiyent, ko'rsatkichlar, ishora",
    'повтор, коэффициент, показатели, знак',
    'repetition, coefficient, exponents, sign',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Bir hadni darajaga ko'tarish uchun koeffitsiyentni shu darajaga ko'taramiz, har harfning ko'rsatkichini esa shu ko'rsatkichga ko'paytiramiz.",
        'Чтобы возвести одночлен в степень, коэффициент возводят в эту степень, а показатель каждой буквы умножают на этот показатель.',
        'To raise a monomial to a power, the coefficient is raised to that power and each letter exponent is multiplied by it.',
      ),
      L(
        "Ikki bir hadning ko'paytmasi har doim bir had bo'ladi. Bo'linmasi esa har doim emas: bo'linuvchining ko'rsatkichi kattaroq bo'lsa, natija bir had bo'lmaydi.",
        'Произведение двух одночленов всегда одночлен. А частное не всегда: если у делителя показатель больше, результат одночленом не будет.',
        'A product of two monomials is always a monomial. A quotient is not: if the divisor has a bigger exponent, the result is not one.',
      ),
    ],
  },
  hookCap: L(
    "Koeffitsiyent ko'paytirilmaydi, u darajaga ko'tariladi",
    'Коэффициент не умножают, его возводят в степень',
    'The coefficient is not multiplied but raised',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("koeffitsiyent darajaga", 'коэффициент в степень', 'the coefficient to the power'),
    L("ko'rsatkichlar ko'paytmaga", 'показатели в произведение', 'the exponents into a product'),
    L("juft daraja minusni yo'qotadi", 'чётная степень убирает минус', 'an even power kills the minus'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило.', 'We have seen all the cases. Now let us build the rule.'),
    A('ok', "To'g'ri. Bu blokning oxirgi qoidasi.", 'Верно. Это последнее правило блока.', 'Correct. The last rule of the block.'),
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
      "Har uchalasida bitta ish: koeffitsiyentni darajaga, ko'rsatkichlarni ko'paytmaga.",
      'Во всех трёх одна работа: коэффициент в степень, показатели в произведение.',
      'The same work in all three: the coefficient to the power, the exponents into a product.',
    ),
  },
  rounds: [
    {
      template: ['(2m)⁴ = ', { slot: 0 }],
      parts: [{ id: 'a', label: '16m⁴' }, { id: 'b', label: '8m⁴' }, { id: 'c', label: '2m⁴' }, { id: 'd', label: '16m' }],
      answer: ['a'],
      prompt: L("Ikkilik ham to'rt marta olinadi.", 'Двойка тоже берётся четыре раза.', 'The two is taken four times as well.'),
      checkNote: L("To'rtta ikkilik o'n oltini beradi", 'Четыре двойки дают шестнадцать', 'Four twos give sixteen'),
      wrongs: [
        { key: 'b', tag: 'Z5', hint: L("Sakkiz bu uchta ikkilik. Ko'rsatkich esa to'rt.", 'Восемь это три двойки. А показатель четыре.', 'Eight is three twos. The exponent is four.') },
        { key: 'c', tag: 'Z1', hint: L("Ikkilik qavs ichida, u ham darajaga kiradi.", 'Двойка в скобке, она тоже входит в степень.', 'The two is inside the bracket and enters the power.') },
        { key: '*', tag: 'Z2', hint: L("m ning ko'rsatkichi ham to'rtga ko'paytiriladi.", 'Показатель m тоже умножается на четыре.', 'The m exponent multiplies by four too.') },
      ],
    },
    {
      template: ['(−a²)⁵ = ', { slot: 0 }],
      parts: [{ id: 'e', label: '−a¹⁰' }, { id: 'f', label: 'a¹⁰' }, { id: 'g', label: '−a⁷' }, { id: 'h', label: '−a²⁵' }],
      answer: ['e'],
      prompt: L("Beshta minus: toq yoki juft?", 'Пять минусов: чётно или нечётно?', 'Five minuses: even or odd?'),
      checkNote: L("Beshta minus toq, ishora qoladi; ko'rsatkich esa 2 karra 5", 'Пять минусов нечётно, знак остаётся; показатель это 2 на 5', 'Five minuses is odd, the sign stays; the exponent is 2 times 5'),
      wrongs: [
        { key: 'f', tag: 'Z3', hint: L("Beshta minus toq son.", 'Пять минусов это нечётное число.', 'Five minuses is odd.') },
        { key: 'g', tag: 'Z6', hint: L("Yetti bu 2 qo'shuv 5. Bu yerda ko'paytirish.", 'Семь это 2 плюс 5. А здесь умножение.', 'Seven is 2 plus 5. Here it is multiplication.') },
        { key: '*', tag: 'Z6', hint: L("Ko'rsatkichlarni ko'paytiring: ikki karra besh.", 'Умножь показатели: два на пять.', 'Multiply the exponents: two times five.') },
      ],
    },
    {
      template: ['(0,1x)² = ', { slot: 0 }],
      parts: [{ id: 'i', label: '0,01x²' }, { id: 'j', label: '0,1x²' }, { id: 'k', label: '0,2x²' }, { id: 'l', label: '0,01x' }],
      answer: ['i'],
      prompt: L("Kasr koeffitsiyent ham kvadratga ko'tariladi.", 'Дробный коэффициент тоже возводится в квадрат.', 'A decimal coefficient is squared too.'),
      checkNote: L("Nol butun bir kvadratga nol butun nol bir beradi", 'Нуль целых одна десятая в квадрате даёт одну сотую', 'Zero point one squared gives zero point zero one'),
      wrongs: [
        { key: 'j', tag: 'Z1', hint: L("Koeffitsiyent ham darajaga kiradi.", 'Коэффициент тоже входит в степень.', 'The coefficient enters the power too.') },
        { key: 'k', tag: 'Z1', hint: L("Nol butun ikki bu 0,1 karra 2. Bu yerda esa 0,1 karra 0,1.", 'Нуль целых две десятых это 0,1 на 2. А здесь 0,1 на 0,1.', 'Zero point two is 0.1 times 2. Here it is 0.1 times 0.1.') },
        { key: '*', tag: 'Z2', hint: L("x ning ko'rsatkichi ikkiga ko'paytiriladi.", 'Показатель x умножается на два.', 'The x exponent multiplies by two.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uchta misol.", 'Три примера.', 'Three examples.'),
    A('r1', "Ikkinchisi ishora haqida.", 'Второй про знак.', 'The second is about the sign.'),
    A('r2', "Uchinchisi kasr bilan.", 'Третий с дробью.', 'The third has a decimal.'),
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
  const LABELS = ['(2m)⁴ = 16m⁴', '(−a²)⁵ = −a¹⁰', '(0,1x)² = 0,01x²']
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan lenta: (2ab²)³.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L('Ikki harf, uch marta', 'Две буквы, трижды', 'Two letters, three times'),
  tape: {
    expr: '(2ab²)³',
    mixed: ['2', 'a', 'b', 'b', '2', 'a', 'b', 'b', '2', 'a', 'b', 'b'],
    options: [
      { id: 'a', label: '8a³b⁶' },
      { id: 'b', label: '6a³b⁶' },
      { id: 'c', label: '8a³b⁵' },
      { id: 'd', label: '8ab⁶' },
    ],
    answer: 'a',
    wrongs: [
      { key: 'b', tag: 'Z1', hint: L("Olti bu 2 karra 3. Lentada uchta ikkilik ko'paytiriladi: sakkiz.", 'Шесть это 2 на 3. В ленте перемножаются три двойки: восемь.', 'Six is 2 times 3. The tape multiplies three twos: eight.') },
      { key: 'c', tag: 'Z2', hint: L("Hisobda oltita b turibdi: har guruhda ikkitadan.", 'В счёте шесть b: по две в каждой группе.', 'The tally shows six b: two in each group.') },
      { key: 'd', tag: 'Z2', hint: L("a ham uch marta uchraydi.", 'a тоже встречается трижды.', 'The a appears three times as well.') },
      { key: '*', tag: 'Z5', hint: L("Uchta ikkilik, uchta a va oltita b.", 'Три двойки, три a и шесть b.', 'Three twos, three a and six b.') },
    ],
    note: L(
      "Har harf o'z ko'rsatkichi bilan takrorlanadi.",
      'Каждая буква повторяется со своим показателем.',
      'Each letter repeats with its own exponent.',
    ),
  },
  audio: [
    A('mount', "Yana lenta. Bu safar ikkita harf va ularning ko'rsatkichlari boshqa.", 'Снова лента. На этот раз две буквы и показатели у них разные.', 'The tape again. This time two letters with different exponents.'),
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
        groups={[4, 4, 4]}
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
// EKRAN 11. MASHQ 3. ASBOBSIZ.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Lentasiz', 'Без ленты', 'Without the tape'),
  template: ['(−3x²y³)² = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '9x⁴y⁶' },
    { id: 'b', label: '−9x⁴y⁶' },
    { id: 'c', label: '6x⁴y⁶' },
    { id: 'd', label: '9x²y³' },
  ],
  answer: ['a'],
  prompt: L(
    "Koeffitsiyent manfiy, daraja juft. Ikki harfning ko'rsatkichlari boshqa.",
    'Коэффициент отрицательный, степень чётная. У двух букв показатели разные.',
    'A negative coefficient, an even power. The two letters have different exponents.',
  ),
  checkNote: L(
    "Minus uchning kvadrati to'qqiz; x da 2 karra 2, y da 3 karra 2",
    'Квадрат минус трёх это девять; у x это 2 на 2, у y это 3 на 2',
    'Minus three squared is nine; for x it is 2 times 2, for y it is 3 times 2',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Juft daraja minusni yo'qotadi: ikkita minus bir-birini so'ndiradi.", 'Чётная степень убирает минус: два минуса гасят друг друга.', 'An even power removes the minus: two minuses cancel.') },
    { key: 'c', tag: 'Z1', hint: L("Olti bu 3 karra 2. Koeffitsiyent esa KVADRATGA ko'tariladi: to'qqiz.", 'Шесть это 3 на 2. А коэффициент возводится в КВАДРАТ: девять.', 'Six is 3 times 2. But the coefficient is SQUARED: nine.') },
    { key: 'd', tag: 'Z2', hint: L("Harflarning ko'rsatkichlari ham ikkiga ko'paytiriladi.", 'Показатели букв тоже умножаются на два.', 'The letter exponents multiply by two as well.') },
  ],
  audio: [
    A('mount', "Endi lentasiz. Uchta narsa birga: ishora, koeffitsiyent va ikki harf.", 'Теперь без ленты. Три вещи вместе: знак, коэффициент и две буквы.', 'Now without the tape. Three things at once: the sign, the coefficient and two letters.'),
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
// EKRAN 12. TUZOQ (§8.2). Koeffitsiyent ko'rsatkichga ko'paytirilgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  task: L(
    "O'quvchi (2a³)⁴ ni hisobladi.",
    'Ученик считал (2a³)⁴.',
    'A student worked out (2a³)⁴.',
  ),
  ask: L(
    "Yuqoridagi qatordan kelib chiqmagan qatorni toping.",
    'Найди строку, которая не следует из строки над ней.',
    'Find the line that does not follow from the line above it.',
  ),
  rows: [
    { id: 'r1', text: '(2a³)⁴' },
    { id: 'r2', text: '8a¹²' },
    { id: 'r3', text: L('a = 1 da: 8', 'при a = 1: 8', 'at a = 1: 8') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r3: L("Bu qator ikkinchisidan to'g'ri kelib chiqadi. Xato yuqoriroqda.", 'Эта строка верно следует из второй. Ошибка выше.', 'This follows correctly from the second. The mistake is higher up.'),
  },
  tags: { r1: 'Z1', r3: 'Z1' },
  proofFill: {
    template: ['(2a³)⁴ = ', { slot: 0 }, 'a', { slot: 1 }],
    parts: [{ id: 'a', label: '16' }, { id: 'b', label: '¹²' }, { id: 'c', label: '8' }, { id: 'd', label: '⁷' }],
    answer: ['a', 'b'],
    prompt: L(
      "Koeffitsiyentni to'g'ri hisoblang. Harf ko'rsatkichi esa avvalgidek.",
      'Посчитай коэффициент верно. А показатель буквы как и был.',
      'Work the coefficient out correctly. The letter exponent stays as it was.',
    ),
    checkNote: L("Ikkilik TO'RT marta olinadi: 2 karra 2 karra 2 karra 2 teng 16", 'Двойка берётся ЧЕТЫРЕ раза: 2 на 2 на 2 на 2 это 16', 'The two is taken FOUR times: 2 times 2 times 2 times 2 is 16'),
    wrongs: [
      { key: 'c|b', tag: 'Z5', hint: L("Sakkiz bu uchta ikkilik. Tashqi ko'rsatkich esa to'rt.", 'Восемь это три двойки. А внешний показатель четыре.', 'Eight is three twos. The outer exponent is four.') },
      { key: '*', tag: 'Z1', hint: L("Koeffitsiyent tashqi darajaga ko'tariladi.", 'Коэффициент возводится во внешнюю степень.', 'The coefficient is raised to the outer power.') },
    ],
  },
  audio: [
    A('mount', "Harf ko'rsatkichi to'g'ri, koeffitsiyent esa yo'q.", 'Показатель буквы верен, а коэффициент нет.', 'The letter exponent is right, the coefficient is not.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. Ikkilik uch marta olingan, holbuki to'rt marta kerak edi.", 'Нашёл. Двойку взяли трижды, а нужно было четыре раза.', 'You found it. The two was taken three times instead of four.'),
    A('done', "To'g'ri javob o'n olti a o'n ikkinchi daraja ekan.", 'Верный ответ шестнадцать a в двенадцатой степени.', 'The right answer is sixteen a to the twelfth.'),
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
// EKRAN 13. KO'CHIRISH. Bo'linish, natija BIR HAD chiqadigan holat.
// ============================================================
const S13 = {
  eyebrow: L("BO'LINISH", 'ДЕЛЕНИЕ', 'DIVISION'),
  title: L("Bu safar natija bir had", 'На этот раз частное одночлен', 'This time the quotient is a monomial'),
  expr: '12a⁵b³ : 3a²b',
  template: [{ slot: 0 }],
  parts: [
    { id: 'a', label: '4a³b²' },
    { id: 'b', label: '9a³b²' },
    { id: 'c', label: '4a⁷b⁴' },
    { id: 'd', label: '4a³b³' },
  ],
  answer: ['a'],
  prompt: L(
    "Koeffitsiyentni bo'ling, ko'rsatkichlarni ayiring.",
    'Коэффициент раздели, показатели вычти.',
    'Divide the coefficient, subtract the exponents.',
  ),
  checkNote: L(
    "12 bo'lish 3 teng 4; a da 5 ayirish 2, b da 3 ayirish 1. Tekshiruv: 4a³b² karra 3a²b teng 12a⁵b³",
    '12 разделить на 3 это 4; у a это 5 минус 2, у b это 3 минус 1. Проверка: 4a³b² · 3a²b = 12a⁵b³',
    '12 divided by 3 is 4; for a it is 5 minus 2, for b it is 3 minus 1. Check: 4a³b² · 3a²b = 12a⁵b³',
  ),
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("To'qqiz bu 12 ayirish 3. Koeffitsiyentda BO'LISH kerak.", 'Девять это 12 минус 3. В коэффициенте нужно ДЕЛЕНИЕ.', 'Nine is 12 minus 3. The coefficient needs DIVISION.') },
    { key: 'c', tag: 'Z6', hint: L("Yetti bu 5 qo'shuv 2. Bo'lishda ko'rsatkichlar AYIRILADI.", 'Семь это 5 плюс 2. При делении показатели ВЫЧИТАЮТСЯ.', 'Seven is 5 plus 2. Division SUBTRACTS the exponents.') },
    { key: 'd', tag: 'Z2', hint: L("b ning ko'rsatkichi ham ayiriladi: uch ayirish bir.", 'Показатель b тоже вычитается: три минус один.', 'The b exponent subtracts too: three minus one.') },
  ],
  reward: {
    title: L("Bu yerda bo'lish bir had beradi", 'Здесь деление даёт одночлен', 'Here the division gives a monomial'),
    text: L(
      "Har harfda bo'linadigan ko'rsatkich kattaroq, shuning uchun ayirish natural son beradi. Yettinchi ekranda esa teskarisi edi.",
      'У каждой буквы показатель делимого больше, поэтому вычитание даёт натуральное число. А на седьмом экране было наоборот.',
      'For each letter the dividend exponent is bigger, so the subtraction gives a natural number. On screen seven it was the other way.',
    ),
  },
  audio: [
    A('mount', "Yettinchi ekranda bo'linish bir had bermagan edi. Bu safar beradi.", 'На седьмом экране деление не дало одночлена. На этот раз даст.', 'On screen seven the division gave no monomial. This time it does.'),
    A('mount', "Koeffitsiyent va har harf bilan alohida ishlang.", 'Работай с коэффициентом и каждой буквой отдельно.', 'Work with the coefficient and each letter separately.'),
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
      prompt: '(5a)²',
      ok: L("Koeffitsiyent ham kvadratga ko'tariladi.", 'Коэффициент тоже возводится в квадрат.', 'The coefficient is squared too.'),
      items: [
        { id: 'a', label: '25a²', correct: true },
        { id: 'b', label: '10a²', tag: 'Z1', hint: L("O'n bu 5 karra 2. Koeffitsiyent kvadratga ko'tariladi.", 'Десять это 5 на 2. Коэффициент возводится в квадрат.', 'Ten is 5 times 2. The coefficient is squared.') },
        { id: 'c', label: '5a²', tag: 'Z1', hint: L("Beshlik qavs ichida.", 'Пятёрка в скобке.', 'The five is inside the bracket.') },
        { id: 'd', label: '25a', tag: 'Z2', hint: L("a ning ko'rsatkichi ham ikkiga ko'paytiriladi.", 'Показатель a тоже умножается на два.', 'The a exponent multiplies by two too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: '(−2x³)³',
      ok: L("Uchta minus toq, ishora qoladi.", 'Три минуса нечётно, знак остаётся.', 'Three minuses is odd, the sign stays.'),
      items: [
        { id: 'a', label: '−8x⁹', correct: true },
        { id: 'b', label: '8x⁹', tag: 'Z3', hint: L("Uchta minus juft emas.", 'Три минуса это не чётно.', 'Three minuses is not even.') },
        { id: 'c', label: '−6x⁹', tag: 'Z1', hint: L("Olti bu 2 karra 3. Ikkilik esa kubga ko'tariladi.", 'Шесть это 2 на 3. А двойка возводится в куб.', 'Six is 2 times 3. The two is cubed.') },
        { id: 'd', label: '−8x⁶', tag: 'Z6', hint: L("Olti bu 3 qo'shuv 3. Ko'rsatkichlar ko'paytiriladi.", 'Шесть это 3 плюс 3. Показатели умножаются.', 'Six is 3 plus 3. The exponents multiply.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: '10a⁴ : 5a²',
      ok: L("Koeffitsiyentda bo'lish, ko'rsatkichda ayirish.", 'В коэффициенте деление, в показателе вычитание.', 'Division for the coefficient, subtraction for the exponent.'),
      items: [
        { id: 'a', label: '2a²', correct: true },
        { id: 'b', label: '5a²', tag: 'Z1', hint: L("Besh bu 10 ayirish 5. Koeffitsiyentda bo'lish kerak.", 'Пять это 10 минус 5. В коэффициенте нужно деление.', 'Five is 10 minus 5. The coefficient needs division.') },
        { id: 'c', label: '2a⁶', tag: 'Z6', hint: L("Olti bu 4 qo'shuv 2. Bo'lishda ayiriladi.", 'Шесть это 4 плюс 2. При делении вычитают.', 'Six is 4 plus 2. Division subtracts.') },
        { id: 'd', label: '2a⁸', tag: 'Z6', hint: L("Sakkiz bu 4 karra 2.", 'Восемь это 4 на 2.', 'Eight is 4 times 2.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Qaysi natija bir had EMAS?", 'Какой результат НЕ одночлен?', 'Which result is NOT a monomial?'),
      ok: L("Bo'linuvchining ko'rsatkichi kattaroq bo'lsa, natija bir had bo'lmaydi.", 'Если у делителя показатель больше, результат не одночлен.', 'If the divisor has the bigger exponent, the result is not a monomial.'),
      items: [
        { id: 'a', correct: true, label: '4a² : 2a⁵' },
        { id: 'b', label: '4a⁵ : 2a²', tag: 'Z4', hint: L("Bu yerda ko'rsatkich yetadi: besh ayirish ikki teng uch.", 'Здесь показателя хватает: пять минус два это три.', 'Here the exponent suffices: five minus two is three.') },
        { id: 'c', label: '(3a²)²', tag: 'Z4', hint: L("Darajaga ko'tarish har doim bir had beradi.", 'Возведение в степень всегда даёт одночлен.', 'Raising to a power always gives a monomial.') },
        { id: 'd', label: '2a · 3a²', tag: 'Z4', hint: L("Ko'paytma har doim bir had bo'ladi.", 'Произведение всегда одночлен.', 'A product is always a monomial.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Blokning oxirgi baholanadigan ekrani.", 'Блиц, четыре вопроса. Последний оцениваемый экран блока.', 'Quick round, four questions. The last graded screen of the block.'),
    A('1', "Ikkinchisi ishora haqida.", 'Второй про знак.', 'The second is about the sign.'),
    A('2', "Uchinchisi bo'lish.", 'Третий деление.', 'The third is division.'),
    A('3', "Oxirgisi eng qiyini.", 'Последний самый трудный.', 'The last is the hardest.'),
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
// EKRAN 15. YAKUN. Blok ham shu ekranda yakunlanadi.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Koeffitsiyent darajaga ko'tariladi", 'Коэффициент возводится в степень', 'The coefficient gets raised'),
  gate: S1.gate,
  fix: {
    tokens: ['9a⁴'],
    value: '9',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Uchlik ikki marta olinadi, ya'ni kvadratga ko'tariladi: to'qqiz. Ko'paytirish esa faqat ko'rsatkichlar bilan bo'ladi.",
    'Тройка берётся дважды, то есть возводится в квадрат: девять. А умножение бывает только с показателями.',
    'The three is taken twice, that is squared: nine. Multiplying happens only with exponents.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    sq: L("to'qqiz", 'девять', 'nine'),
    mul: L('olti', 'шесть', 'six'),
    keep: L("o'zgarmaydi", 'не меняется', 'it stays'),
    both: L('ikkalasi ham', 'оба', 'both'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(3a²)² → 9a⁴', '(−2a²b)³ → −8a⁶b³', '(2m)⁴ → 16m⁴', '6a³ : 2a⁵  ≠'],
  twoLabel: L('B3 bloki', 'Блок Б3', 'Block B3'),
  twoA: 'aⁿ  →  +  −  ·',
  twoB: '( )ⁿ  →  kⁿ',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "ko'phadlar",
    'многочлены',
    'polynomials',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Blok tugadi. Butun blok bitta ishdan chiqdi: lentani yozib, elementlarni sanash.", 'Блок закончен. Весь блок вышел из одной работы: выписать ленту и посчитать элементы.', 'The block is done. All of it came from one job: write out the tape and count.'),
    A('mount', "Keyingi blokda ko'phadlar, ya'ni bir hadlarning yig'indisi bo'ladi.", 'В следующем блоке будут многочлены, то есть суммы одночленов.', 'The next block brings polynomials, sums of monomials.'),
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
