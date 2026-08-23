// ============================================================================
// 8-sinf, Dars 24. SONLI TENGSIZLIKLARNING ASOSIY XOSSALARI.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `twosides.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `twosides`: ikkala qismni songa ko'paytirish,
// manfiy songa ko'paytirilganda BELGI BURILADI — blokning eng qimmat joyi.
//
// DARSNING ISHI (darslik, 12-§, 71-73-bet):
//   1) Teorema 1: a > b va b > c bo'lsa, a > c (o'tuvchanlik);
//   2) Teorema 2: ikkala qismga ayni bir son qo'shilsa, ishora o'zgarmaydi;
//   3) Teorema 3 — ENG NOZIK JOY: ikkala qism ayni bir MUSBAT songa
//      ko'paytirilsa, ishora o'zgarmaydi; ayni bir MANFIY songa
//      ko'paytirilsa, ishora QARAMA-QARSHISIGA o'zgaradi.
//
// DARSLIK. O'zbek darsligi, 12-§, 71-73-bet: uch teorema, 1/5 < 0,21 ni 3 ga
// va minus to'rtga ko'paytirish namunasi (72-bet), 1- va 2-masala.
//
// ADASHISHLAR: ikkitasi yangi:
//   З52 — manfiy songa ko'paytirilganda/bo'linganda ishora burilmadi;
//   З53 — musbat songa ko'paytirilganda ishora ORTIQCHA burildi;
//   З16 — javob son bilan tekshirilmadi (11-ekranda, qaytadi).
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { SceneBand } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'
import { UI, buildScreens } from './karkas.js'

export const META = {
  id: 'alg-8-24',
  n: 24,
  row: 27,
  block: 'Б4',
  topic: L(
    'Sonli tengsizliklarning asosiy xossalari',
    'Основные свойства числовых неравенств',
    'The basic properties of numerical inequalities',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "tengsizlikning ikkala qismi ayni bir musbat songa ko'paytirilsa, ishora o'zgarmaydi",
    'Если обе части неравенства умножить на одно и то же положительное число, знак не меняется',
    'If both sides of an inequality are multiplied by the same positive number, the sign does not change',
  ),
  L(
    "tengsizlikning ikkala qismi ayni bir manfiy songa ko'paytirilsa, ishora qarama-qarshisiga o'zgaradi",
    'Если обе части неравенства умножить на одно и то же отрицательное число, знак меняется на противоположный',
    'If both sides of an inequality are multiplied by the same negative number, the sign changes to the opposite',
  ),
  L(
    "shu qoida bo'lishga ham tegishli, chunki bo'lish songa ko'paytirish bilan bir xil",
    'Это правило относится и к делению, потому что деление на число — то же, что умножение',
    'This rule also applies to division, since dividing by a number is the same as multiplying',
  ),
]

export const MISS = {
  'З16': {
    what: L(
      'javob son bilan tekshirilmadi',
      'ответ не проверен числом',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 11,
  },
  'З52': {
    what: L(
      "manfiy songa ko'paytirilganda ishora burilmadi",
      'при умножении на отрицательное число знак не был перевёрнут',
      'when multiplying by a negative number, the sign was not flipped',
    ),
    wrong: '-6',
    at: 4,
  },
  'З53': {
    what: L(
      "musbat songa ko'paytirilganda ishora ortiqcha burildi",
      'при умножении на положительное число знак был перевёрнут без причины',
      'when multiplying by a positive number, the sign was flipped without reason',
    ),
    wrong: '15',
    at: 9,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: 3 < 7 ni minus birga ko'paytirish. Yakun: minus 4
// karra 1/5 < 0,21, ishora burilib −4/5 > −0,84 chiqadi.
// ============================================================
const SC_ASK = L('ISHORA BURILADIMI', 'ЗНАК ПЕРЕВОРАЧИВАЕТСЯ', 'DOES THE SIGN FLIP')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <text x="200" y="46" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
        fill={T.ink}>{'3 < 7'}</text>
      <text x="200" y="80" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
        fill={T.ink3}>{'× (−1)'}</text>
      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="112" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="119" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Manfiyga ko'paytirilganda ishora burilib, minus to'rtdan besh kattaroq chiqadi",
      'При умножении на отрицательное знак переворачивается, и минус четыре пятых выходит больше',
      'Multiplying by a negative flips the sign, and negative four fifths comes out greater',
    )}>
      <text x="80" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fill={T.ink}>{'1/5 < 0,21'}</text>
      <path d="M138 26 L156 26 M150 20 L156 26 L150 32" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <text x="200" y="20" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11"
        fill={T.ink3}>{'× (−4)'}</text>
      <g className="g8-seat" style={{ '--d': '600ms' }}>
        <text x="320" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.ok}>{'−4/5 > −0,84'}</text>
      </g>
      <g className="g8-seat" style={{ '--d': '1300ms' }}>
        <line x1="40" y1="70" x2="360" y2="70" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <circle cx="150" cy="70" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
        <text x="150" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>{'−0,84'}</text>
        <circle cx="210" cy="70" r="4.4" fill={T.ok}/>
        <text x="210" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>{'−0,8'}</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('MINUS BIRGA KO\'PAYTIRSAK', 'ЕСЛИ УМНОЖИТЬ НА МИНУС ОДИН', 'IF MULTIPLIED BY NEGATIVE ONE'),
  title: L(
    "3 kichik 7 dan. Minus birga ko'paytirsak, belgi qanday bo'ladi",
    'Три меньше семи. Если умножить на минус один, каким будет знак',
    'Three is less than seven. If multiplied by negative one, what will the sign be',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Uch yettidan kichik. Ikkala tomonni minus birga ko'paytiramiz.",
      'Три меньше семи. Умножаем обе части на минус один.',
      'Three is less than seven. We multiply both sides by negative one.'),
    A('why',
      "Taxmin qiling, belgi shu holicha qoladimi yoki o'zgaradimi.",
      'Предположи, знак останется таким же или изменится.',
      'Predict whether the sign stays the same or changes.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, belgi o'zgaradimi?",
      'Как думаешь, знак изменится?',
      'Do you think the sign will change?',
    ),
    items: [
      { id: 'same', show: L('Yo\'q, shu holicha qoladi', 'Нет, останется таким же', 'No, it stays the same') },
      { id: 'flip', show: L('Ha, o\'zgaradi', 'Да, изменится', 'Yes, it changes') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Ayirma usuli (23-darsdan) — shu tayanch 5, 6 va
// 9-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Ayirma usulini eslash",
    'Вспоминаем способ разности',
    'Recalling the difference method',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida a plyus c va b plyus c ayirmasi to'g'ri hisoblangan.",
      'Четыре записи. Только в одной верно вычислена разность a плюс c и b плюс c.',
      'Four records. Only one correctly computes the difference of a plus c and b plus c.'),
    A('why',
      "c lar bir-birini yo'q qiladi, faqat a minus b qoladi.",
      'Слагаемые c уничтожают друг друга, остаётся только a минус b.',
      'The c terms cancel each other, leaving only a minus b.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuvda (a+c) minus (b+c) to'g'ri hisoblangan?",
      'В какой записи верно вычислено (a+c) минус (b+c)?',
      'In which record is (a+c) minus (b+c) correctly computed?',
    ),
    items: [
      { id: 'right', show: '(a+c) − (b+c) = a − b', right: true, name: L("c lar yo'q bo'ldi", 'c исчезли', 'the c terms cancel') },
      {
        id: 'kept', show: '(a+c) − (b+c) = a − b + 2c',
        hint: L("Qavsni ochsak, plyus c va minus c bir-birini yo'q qiladi, ikki c qolmaydi.", 'При раскрытии скобок плюс c и минус c уничтожаются, два c не остаётся.', 'Opening the brackets, plus c and minus c cancel out, no two c terms remain.'),
      },
      {
        id: 'sum', show: '(a+c) − (b+c) = a + b',
        hint: L("Bu yerda ayirmalar qo'shishga aylanib qolgan.", 'Здесь вычитание превратилось в сложение.', 'Here the subtraction turned into an addition.'),
      },
      {
        id: 'order', show: '(b+c) − (a+c) = a − b',
        hint: L("Bu ayirma teskari tartibda, chap tomon (a+c) bilan boshlanishi kerak.", 'Эта разность в обратном порядке, левая часть должна начинаться с (a+c).', 'This difference is in the reversed order; the left side should start with (a+c).'),
      },
    ],
    after: L(
      "To'g'ri. c lar yo'q bo'ladi, faqat a minus b qoladi, demak ishora o'zgarmaydi.",
      'Верно. c исчезают, остаётся только a минус b, значит знак не меняется.',
      'Correct. The c terms cancel, leaving only a minus b, so the sign does not change.',
    ),
  },
}

// ============================================================
// EKRAN 3. K NI BURANG (1-darsning `steppers`). 3k va 7k tartibini kuzatish:
// k musbatda tartib saqlanadi, k manfiyda buriladi, k nolda yo'qoladi.
// ============================================================
const S3 = {
  eyebrow: L('K NI BURANG', 'КРУТИ K', 'TURN K'),
  title: L(
    "3k va 7k qaysi tartibda",
    'В каком порядке 3k и 7k',
    'In what order are 3k and 7k',
  ),
  audio: [
    A('mount',
      "Uch kichik yettidan. Ikkalasini k ga ko'paytiramiz.",
      'Три меньше семи. Умножаем оба на k.',
      'Three is less than seven. We multiply both by k.'),
    A('why',
      "Ikki maqsad beriladi. k ning turli qiymatlarida tartibni toping.",
      'Даны две цели. Находи порядок при разных значениях k.',
      'Two targets are given. Find the order at different values of k.'),
    A('why',
      "Oxirida k ni nolga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти k до нуля и посмотри, что будет.',
      'At the end bring k down to zero and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'k', label: L('k ning qiymati', 'значение k', 'the value of k'),
        start: 3, min: -5, max: 5, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] === 0 ? null : (v[0] > 0 ? 1 : -1)),
    resultLabel: L('3k, 7k tartibi', 'порядок 3k и 7k', 'the order of 3k and 7k'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "k hali nolga tushmasin, avval maqsadlarni oling.",
      'k пока не опускай до нуля, сначала возьми цели.',
      'Do not bring k down to zero yet, take the targets first.',
    ),
    goals: [
      {
        value: 1,
        ask: L("3k hali 7k dan kichik bo'lib qolsin", 'Пусть 3k пока остаётся меньше 7k', 'Let 3k stay less than 7k for now'),
        after: L(
          "Tartib saqlandi. k musbat bo'lgani uchun 3k hali 7k dan kichik.",
          'Порядок сохранён. Так как k положительно, 3k всё ещё меньше 7k.',
          'The order is kept. Since k is positive, 3k is still less than 7k.',
        ),
      },
      {
        value: -1,
        ask: L("Endi 3k 7k dan katta bo'lsin", 'Теперь пусть 3k станет больше 7k', 'Now make 3k become greater than 7k'),
        after: L(
          "Tartib buriladi. k manfiy bo'lgani uchun 3k endi 7k dan katta.",
          'Порядок перевернулся. Так как k отрицательно, 3k теперь больше 7k.',
          'The order flips. Since k is negative, 3k is now greater than 7k.',
        ),
      },
    ],
    ask: L("3k hali 7k dan kichik bo'lib qolsin", 'Пусть 3k пока остаётся меньше 7k', 'Let 3k stay less than 7k for now'),
    ask2: L("Endi k ni nolga tushiring", 'Теперь опусти k до нуля', 'Now bring k down to zero'),
    broke: L(
      "k nolga teng bo'lganda 3k va 7k ikkalasi ham nolga teng, taqqoslash yo'qoladi.",
      'При k равном нулю и 3k, и 7k равны нулю, сравнение исчезает.',
      'With k equal to zero, both 3k and 7k equal zero, and the comparison disappears.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI YOZUV TO'G'RI (1-darsning `pick`). Ловушка — ishora
// burilishi unutilgan (З52).
// ============================================================
const S4 = {
  eyebrow: L('MINUS UCHGA KO\'PAYTIRSAK', 'ЕСЛИ УМНОЖИТЬ НА МИНУС ТРИ', 'IF MULTIPLIED BY NEGATIVE THREE'),
  title: L(
    "2 kichik 9 dan. Ikkalasini minus uchga ko'paytirilsa, qaysi yozuv to'g'ri",
    'Два меньше девяти. При умножении на минус три, какая запись верна',
    'Two is less than nine. When multiplied by negative three, which record is correct',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida ishora to'g'ri burilgan.",
      'Четыре записи. Только в одной знак верно перевёрнут.',
      'Four records. Only one correctly flips the sign.'),
    A('why',
      "Manfiy songa ko'paytirilganda ishora qarama-qarshisiga o'zgaradi.",
      'При умножении на отрицательное число знак меняется на противоположный.',
      'When multiplying by a negative number, the sign changes to the opposite.'),
  ],
  props: {
    ask: L(
      "2 < 9 ni minus uchga ko'paytirsak, qaysi yozuv to'g'ri?",
      'При умножении 2 < 9 на минус три, какая запись верна?',
      'Multiplying 2 < 9 by negative three, which record is correct?',
    ),
    items: [
      { id: 'right', show: '−6 > −27', right: true, name: L("ishora burildi", 'знак перевёрнут', 'the sign is flipped') },
      {
        id: 'noflip', show: '−6 < −27',
        hint: L("Manfiy songa ko'paytirilgan, ishora burilishi kerak edi.", 'Умножено на отрицательное число, знак должен был перевернуться.', 'Multiplied by a negative number, the sign should have flipped.'),
      },
      {
        id: 'wrongnum', show: '6 > 27',
        hint: L("Ishoralar yo'qolib qoldi, manfiy songa ko'paytirilgan edi.", 'Знаки минус потерялись, ведь умножали на отрицательное число.', 'The minus signs got lost, but the multiplier was negative.'),
      },
      {
        id: 'flipwrong', show: '−6 = −27',
        hint: L("Bu tenglik, taqqoslash tenglikka aylanib qolmaydi.", 'Это равенство, а сравнение не превращается в равенство.', 'This is an equality, and a comparison does not turn into one.'),
      },
    ],
    after: L(
      "To'g'ri. Manfiy songa ko'paytirilgan, shuning uchun ishora burilib, minus olti minus yigirma yettidan katta.",
      'Верно. Умножено на отрицательное число, поэтому знак перевернулся, и минус шесть больше минус двадцати семи.',
      'Correct. Multiplied by a negative number, so the sign flipped, and negative six is greater than negative twenty seven.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — MANFIYGA KO'PAYTIRISH (`twosides`).
// Darslik 72-bet: 1/5 < 0,21 ni uchga, keyin minus to'rtga ko'paytirish.
// ============================================================
const S5 = {
  eyebrow: L('KO\'PAYTIRAMIZ', 'УМНОЖАЕМ', 'WE MULTIPLY'),
  title: L(
    "Bir bo'lingan beshni 0,21 bilan ko'paytirib taqqoslash",
    'Умножить одну пятую и 0,21 и сравнить',
    'Multiply one fifth and 0.21 and compare',
  ),
  audio: [
    A('mount',
      "Bir bo'lingan besh kichik 0,21 dan. Ikkala tomonni ketma-ket ko'paytiramiz.",
      'Одна пятая меньше 0,21. Умножаем обе части по очереди.',
      'One fifth is less than 0.21. We multiply both sides in turn.'),
    A('why',
      "Amal ikkala qismga birdan qo'llanadi. Qadamni tanlang.",
      'Действие применяется сразу к обеим частям. Выбери шаг.',
      'The action applies to both sides at once. Choose the step.'),
    W('a2',
      "Ikkinchi qadamda manfiy songa ko'paytirildi.",
      'На втором шаге умножение выполнено на отрицательное число.',
      'In the second step the multiplication was by a negative number.'),
  ],
  props: {
    from: -1,
    to: 1,
    start: { left: '1/5', rel: '<', right: '0,21', set: null },
    steps: [
      {
        ask: L('Ikkala qismni uchga ko\'paytirsak, nima bo\'ladi?', 'Что будет, если умножить обе части на три?', 'What happens if both sides are multiplied by three?'),
        actions: [
          {
            id: 'mul3', right: true,
            label: L("Ko'paytirish, ishora shu holicha qoladi", 'Умножить, знак остаётся таким же', 'Multiply, the sign stays the same'),
            to: { left: '3/5', rel: '<', right: '0,63' },
          },
          {
            id: 'mul3flip',
            label: L("Ko'paytirish, ishorani burish", 'Умножить и перевернуть знак', 'Multiply and flip the sign'),
            counter: { at: '3/5', gives: '> 0,63', verdict: L("bu yolg'on", 'это ложь', 'this is false') },
            hint: L(
              "Uch musbat son, musbatga ko'paytirilganda ishora burilmaydi.",
              'Три положительное число, при умножении на положительное знак не переворачивается.',
              'Three is a positive number; multiplying by a positive one does not flip the sign.',
            ),
          },
        ],
      },
      {
        ask: L('Endi ikkala qismni minus to\'rtga ko\'paytirsak, nima bo\'ladi?', 'Теперь что будет при умножении обеих частей на минус четыре?', 'Now what happens when multiplying both sides by negative four?'),
        actions: [
          {
            id: 'mulm4', right: true, flip: true,
            label: L("Ko'paytirish, ishorani burish", 'Умножить и перевернуть знак', 'Multiply and flip the sign'),
            to: { left: '−4/5', rel: '>', right: '−0,84' },
            set: { point: -0.8 },
            note: L(
              "Manfiy songa ko'paytirildi, shuning uchun ishora burildi.",
              'Умножение на отрицательное число, поэтому знак перевернулся.',
              'Multiplication by a negative number, so the sign flipped.',
            ),
          },
          {
            id: 'mulm4same',
            label: L("Ko'paytirish, ishora shu holicha qoladi", 'Умножить, знак остаётся таким же', 'Multiply, the sign stays the same'),
            counter: { at: '−4/5', gives: '< −0,84', verdict: L("bu yolg'on, minus 0,8 minus 0,84 dan katta", 'это ложь, минус 0,8 больше минус 0,84', 'this is false, negative 0.8 is greater than negative 0.84') },
            hint: L(
              "Minus to'rt manfiy son, manfiyga ko'paytirilganda ishora buriladi.",
              'Минус четыре отрицательное число, при умножении на отрицательное знак переворачивается.',
              'Negative four is a negative number; multiplying by a negative one flips the sign.',
            ),
          },
        ],
      },
    ],
    note: L(
      "Musbatga ko'paytirilganda ishora saqlanadi, manfiyga ko'paytirilganda buriladi.",
      'При умножении на положительное знак сохраняется, при умножении на отрицательное переворачивается.',
      'Multiplying by a positive keeps the sign, multiplying by a negative flips it.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): qoidani ikki yo'l bilan
// ko'rish — ayirma orqali isbot va son bilan tekshirish.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Qoidani ikki yo'l bilan ko'rish",
    'Увидеть правило двумя способами',
    'Seeing the rule two ways',
  ),
  audio: [
    A('mount',
      "Bitta qoida va ikki yo'l. Ikkalasi ham bir xil xulosaga olib keladi.",
      'Одно правило и два пути. Оба приводят к одному выводу.',
      'One rule and two ways. Both lead to the same conclusion.'),
    W('w2',
      "Birinchi yo'lda ayirma orqali isbotlanadi.",
      'В первом пути доказывается через разность.',
      'In the first way it is proven through the difference.'),
    W('w4',
      "Ikkinchi yo'lda haqiqiy sonlar bilan tekshiriladi.",
      'Во втором пути проверяется на настоящих числах.',
      'In the second way it is checked with actual numbers.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('1-USUL — AYIRMA ORQALI ISBOT', 'СПОСОБ 1 — ДОКАЗАТЕЛЬСТВО ЧЕРЕЗ РАЗНОСТЬ', 'METHOD 1 — PROOF VIA THE DIFFERENCE'),
        lead: L(
          "a kichik b bo'lsa, b minus a musbat",
          'Если a меньше b, то b минус a положительно',
          'If a is less than b, then b minus a is positive',
        ),
        rows: [
          { text: '(b − a) · c' },
          { text: L("c manfiy bo'lsa, bu ko'paytma manfiy chiqadi", 'если c отрицательно, это произведение выходит отрицательным', 'if c is negative, this product comes out negative'), tone: 'ok' },
        ],
      },
      {
        name: L('2-USUL — SON BILAN TEKSHIRISH', 'СПОСОБ 2 — ПРОВЕРКА ЧИСЛОМ', 'METHOD 2 — CHECKING WITH A NUMBER'),
        lead: L(
          "a = 2, b = 9, c = −3 qo'yib ko'ramiz",
          'Подставляем a = 2, b = 9, c = −3',
          'We substitute a = 2, b = 9, c = −3',
        ),
        rows: [
          { text: '2 · (−3) = −6,   9 · (−3) = −27' },
          { text: L('−6 −27 dan katta', '−6 больше −27', '−6 is greater than −27'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Isbot har doim ishlaydi, son bilan tekshirish esa ko'rgazmali",
          'Доказательство работает всегда, а проверка числом наглядна',
          'The proof always works, and checking with a number is visual',
        ),
        rows: [{ text: L('ishora buriladi', 'знак переворачивается', 'the sign flips'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): nega manfiyga ko'paytirish
// ishorani buradi.
// ============================================================
const S7 = {
  eyebrow: L('NEGA ISHORA BURILADI', 'ПОЧЕМУ ЗНАК ПЕРЕВОРАЧИВАЕТСЯ', 'WHY THE SIGN FLIPS'),
  title: L(
    "Nega manfiyga ko'paytirish ishorani buradi",
    'Почему умножение на отрицательное переворачивает знак',
    'Why multiplying by a negative flips the sign',
  ),
  audio: [
    A('mount',
      "a kichik b bo'lsa, b minus a musbat sondir.",
      'Если a меньше b, то b минус a положительное число.',
      'If a is less than b, then b minus a is a positive number.'),
    W('p2',
      "Musbat sonni musbat c ga ko'paytirsak, natija ham musbat qoladi.",
      'Умножив положительное число на положительное c, результат остаётся положительным.',
      'Multiplying a positive number by a positive c, the result stays positive.'),
    W('p4',
      "Musbat sonni manfiy c ga ko'paytirsak, natija manfiy bo'ladi, va tartib buriladi.",
      'Умножив положительное число на отрицательное c, результат становится отрицательным, и порядок переворачивается.',
      'Multiplying a positive number by a negative c, the result becomes negative, and the order flips.',
    ),
  ],
  props: {
    tokens: [
      { t: '(b − a)', id: 'a' },
      { t: ' · c', id: 'sign' },
    ],
    steps: [
      {
        focus: 'a',
        text: L(
          "Birinchi qadam. a kichik b bo'lgani uchun b minus a musbat.",
          'Первый шаг. Так как a меньше b, разность b минус a положительна.',
          'Step one. Since a is less than b, the difference b minus a is positive.',
        ),
      },
      {
        focus: 'sign',
        text: L(
          "Ikkinchi qadam. c musbat bo'lsa, musbat karra musbat musbat qoladi, tartib saqlanadi.",
          'Второй шаг. Если c положительно, положительное на положительное остаётся положительным, порядок сохраняется.',
          'Step two. If c is positive, positive times positive stays positive, the order is kept.',
        ),
      },
      {
        focus: 'sign',
        text: L(
          "Uchinchi qadam. c manfiy bo'lsa, musbat karra manfiy manfiy chiqadi, tartib buriladi.",
          'Третий шаг. Если c отрицательно, положительное на отрицательное выходит отрицательным, порядок переворачивается.',
          'Step three. If c is negative, positive times negative comes out negative, the order flips.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Bank amaliyotida qarzni belgilash uchun sonlar manfiy olinadi, shuning uchun qarzlarni taqqoslaganda aynan shu qoida ishlatiladi.",
        'В банковском деле долг обозначают отрицательным числом, и при сравнении долгов используется именно это правило.',
        'In banking, debt is marked with a negative number, and comparing debts relies on exactly this rule.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 12-§, 72-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Ko'paytirish xossasi",
    'Свойство умножения',
    'The multiplication property',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik qoidasi ochildi, va xukdagi qarz to'landi.",
      'Открылось правило из учебника, и долг с хука оплачен.',
      'The textbook rule opened, and the debt from the hook is paid.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("ikkala qism ayni bir musbat songa ko'paytirilsa", 'если обе части умножить на одно и то же положительное число', 'if both sides are multiplied by the same positive number') },
      { id: 'f2', label: L("ishora o'zgarmaydi", 'знак не меняется', 'the sign does not change') },
      { id: 'f3', label: L("ikkala qism ayni bir manfiy songa ko'paytirilsa", 'если обе части умножить на одно и то же отрицательное число', 'if both sides are multiplied by the same negative number') },
      { id: 'f4', label: L("ishora qarama-qarshisiga o'zgaradi", 'знак меняется на противоположный', 'the sign changes to the opposite') },
      { id: 'w1', label: L("ishora sonning kattaligiga bog'liq", 'знак зависит от величины числа', 'the sign depends on the size of the number') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Ishora ko'paytiruvchining ISHORASIGA bog'liq, kattaligiga emas.",
      'Так не складывается. Знак зависит от ЗНАКА множителя, а не от его величины.',
      'That does not fit. The sign depends on the SIGN of the multiplier, not its size.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 12-§, 72-bet",
        'Учебник, § 12, стр. 72',
        'Textbook, section 12, page 72',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Ikkala tomonni songa ko'paytirsak, ishora hali noaniq",
        'Умножив обе части на число, знак пока неясен',
        'Multiplying both sides by a number, the sign is still unclear',
      ),
      right: L(
        "endi ko'paytiruvchining ishorasiga qarab bilamiz",
        'теперь узнаём по знаку множителя',
        'now we know by the sign of the multiplier',
      ),
      winner: 'right',
      note: L(
        "Musbatga ko'paytirish saqlaydi, manfiyga ko'paytirish buradi",
        'Умножение на положительное сохраняет, на отрицательное переворачивает',
        'Multiplying by a positive keeps it, multiplying by a negative flips it',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): ko'paytiruvchining ishorasiga
// qarab natija belgisini toping.
// ============================================================
const ASK_SIGN2 = L('Ishora o\'zgaradimi?', 'Знак изменится?', 'Will the sign change?')
const ASK_RESULT = L('Qaysi yozuv to\'g\'ri?', 'Какая запись верна?', 'Which record is correct?')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ko'paytiruvchining ishorasini toping",
    'Найди знак множителя',
    'Find the sign of the multiplier',
  ),
  audio: [
    A('mount',
      "Besh holat. Har birida ikkala qism berilgan songa ko'paytiriladi.",
      'Пять случаев. В каждом обе части умножаются на данное число.',
      'Five cases. In each, both sides are multiplied by a given number.'),
    A('why',
      "Ko'paytiruvchi manfiy bo'lsa, ishora buriladi.",
      'Если множитель отрицателен, знак переворачивается.',
      'If the multiplier is negative, the sign flips.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar ko'paytiruvchining ishorasi javobni bergan.",
      'Все пять разобраны. Каждый раз знак множителя давал ответ.',
      'All five are done. Each time the sign of the multiplier gave the answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'4 < 6,  × 2'}</Row>,
        ok: L("Yo'q. Ikki musbat, ishora shu holicha qoladi.", 'Нет. Два положительное, знак остаётся таким же.', 'No. Two is positive, the sign stays the same.'),
        question: ASK_SIGN2,
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Ikki musbat son, ishora burilmaydi.", 'Два положительное число, знак не переворачивается.', 'Two is a positive number, the sign does not flip.') },
        ],
        solution: ['4 < 6', '×2', L('musbat, ishora saqlanadi', 'положительное, знак сохраняется', 'positive, the sign is kept')],
      },
      {
        expr: <Row size="big" align="center">{'4 < 6,  × (−2)'}</Row>,
        ok: L("Ha. Minus ikki manfiy, ishora buriladi.", 'Да. Минус два отрицательное, знак переворачивается.', 'Yes. Negative two is negative, the sign flips.'),
        question: ASK_SIGN2,
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Minus ikki manfiy son, ishora burilishi kerak.", 'Минус два отрицательное число, знак должен перевернуться.', 'Negative two is a negative number, the sign must flip.') },
        ],
        solution: ['4 < 6', '×(−2)', L('manfiy, ishora buriladi', 'отрицательное, знак переворачивается', 'negative, the sign flips')],
      },
      {
        expr: <Row size="big" align="center">{'−5 < −1,  × 3'}</Row>,
        ok: L("Yo'q. Uch musbat, ishora shu holicha qoladi.", 'Нет. Три положительное, знак остаётся таким же.', 'No. Three is positive, the sign stays the same.'),
        question: ASK_SIGN2,
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Uch musbat son.", 'Три положительное число.', 'Three is a positive number.') },
        ],
        solution: ['−5 < −1', '×3', L('musbat, ishora saqlanadi', 'положительное, знак сохраняется', 'positive, the sign is kept')],
      },
      {
        expr: <Row size="big" align="center">{'−5 < −1,  × (−1)'}</Row>,
        ok: L("Ha. Minus bir manfiy, ishora buriladi.", 'Да. Минус один отрицательное, знак переворачивается.', 'Yes. Negative one is negative, the sign flips.'),
        question: ASK_SIGN2,
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Minus bir manfiy son.", 'Минус один отрицательное число.', 'Negative one is a negative number.') },
        ],
        solution: ['−5 < −1', '×(−1)', L('manfiy, ishora buriladi', 'отрицательное, знак переворачивается', 'negative, the sign flips')],
      },
      {
        expr: <Row size="big" align="center">{'2 < 8,  ÷ (−2)'}</Row>,
        ok: L("Ha. Bo'lish minus ikkiga ko'paytirish kabi, ishora buriladi.", 'Да. Деление на минус два подобно умножению, знак переворачивается.', 'Yes. Dividing by negative two is like multiplying, the sign flips.'),
        question: ASK_SIGN2,
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Bo'lish ham manfiy songa ko'paytirish qoidasiga bo'ysunadi.", 'Деление тоже подчиняется правилу умножения на отрицательное.', 'Division also follows the rule for multiplying by a negative.') },
        ],
        solution: ['2 < 8', '÷(−2)', L('manfiy, ishora buriladi', 'отрицательное, знак переворачивается', 'negative, the sign flips')],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): natijaviy yozuvni toping.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ko'paytirilgandan keyingi yozuvni toping",
    'Найди запись после умножения',
    'Find the record after multiplying',
  ),
  audio: [
    A('mount',
      "Uch holat. Har biridan keyingi to'g'ri yozuv kerak.",
      'Три случая. В каждом нужна верная запись после умножения.',
      'Three cases. Each needs the correct record after multiplying.'),
    A('why',
      "Ko'paytiruvchining ishorasiga qarab tanlang.",
      'Выбирай, глядя на знак множителя.',
      'Choose by looking at the sign of the multiplier.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ishora to'g'ri hisobga olindi.",
      'Все три разобраны. Каждый раз знак учтён верно.',
      'All three are done. Each time the sign was accounted for correctly.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'1 < 5,  × 4'}</Row>,
        ok: L("Ha. To'rt musbat, ishora saqlanadi.", 'Да. Четыре положительное, знак сохраняется.', 'Yes. Four is positive, the sign is kept.'),
        question: ASK_RESULT,
        items: [
          { id: 'a', right: true, label: '4 < 20' },
          { id: 'b', label: '4 > 20', hint: L("To'rt musbat son, ishora burilmaydi.", 'Четыре положительное число, знак не переворачивается.', 'Four is a positive number, the sign does not flip.') },
        ],
        solution: ['1 < 5', '×4', '4 < 20'],
      },
      {
        expr: <Row size="big" align="center">{'1 < 5,  × (−4)'}</Row>,
        ok: L("Ha. Minus to'rt manfiy, ishora buriladi.", 'Да. Минус четыре отрицательное, знак переворачивается.', 'Yes. Negative four is negative, the sign flips.'),
        question: ASK_RESULT,
        items: [
          { id: 'a', right: true, label: '−4 > −20' },
          { id: 'b', label: '−4 < −20', hint: L("Minus to'rt manfiy son, ishora burilishi kerak edi.", 'Минус четыре отрицательное число, знак должен был перевернуться.', 'Negative four is a negative number, the sign should have flipped.') },
        ],
        solution: ['1 < 5', '×(−4)', '−4 > −20'],
      },
      {
        expr: <Row size="big" align="center">{'−3 < 2,  × (−5)'}</Row>,
        ok: L("Ha. Minus besh manfiy, ishora buriladi.", 'Да. Минус пять отрицательное, знак переворачивается.', 'Yes. Negative five is negative, the sign flips.'),
        question: ASK_RESULT,
        items: [
          { id: 'a', right: true, label: '15 > −10' },
          { id: 'b', label: '15 < −10', hint: L("Minus besh manfiy son, ishora burilishi kerak edi.", 'Минус пять отрицательное число, знак должен был перевернуться.', 'Negative five is a negative number, the sign should have flipped.') },
        ],
        solution: ['−3 < 2', '×(−5)', '15 > −10'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): natijani son bilan
// tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Natijani son bilan tekshirish",
    'Проверка результата числом',
    'Checking the result with a number',
  ),
  audio: [
    A('mount',
      "Uch taklif qilingan natija. Har birini o'ziga son qo'yib tekshiring.",
      'Предложены три результата. Каждый проверь, подставив свои числа.',
      'Three proposed results. Check each by substituting your own numbers.'),
    A('why',
      "Ko'paytiruvchining ishorasi natijani tasdiqlashi yoki rad etishi kerak.",
      'Знак множителя должен подтвердить или отвергнуть результат.',
      'The sign of the multiplier should confirm or reject the result.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ishora natijani tekshirib berdi.",
      'Все три разобраны. Каждый раз знак проверял результат.',
      'All three are done. Each time the sign checked the result.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'3 < 10,  × 5 → 15 < 50'}</Row>,
        ok: L("Ha. Besh musbat, ishora saqlangan, to'g'ri.", 'Да. Пять положительное, знак сохранён, верно.', 'Yes. Five is positive, the sign is kept, correct.'),
        question: L("Bu natija to'g'rimi?", 'Верен ли этот результат?', 'Is this result correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Besh musbat son, ishora burilmasligi to'g'ri.", 'Пять положительное число, знак верно не перевёрнут.', 'Five is a positive number, correctly not flipping the sign.') },
        ],
        solution: ['3 < 10', '×5', L('musbat, to\'g\'ri', 'положительное, верно', 'positive, correct')],
      },
      {
        expr: <Row size="big" align="center">{'3 < 10,  × (−5) → −15 < −50'}</Row>,
        ok: L("Yo'q. Minus besh manfiy, ishora burilishi kerak edi.", 'Нет. Минус пять отрицательное, знак должен был перевернуться.', 'No. Negative five is negative, the sign should have flipped.'),
        question: L("Bu natija to'g'rimi?", 'Верен ли этот результат?', 'Is this result correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Minus besh manfiy son, ishora burilishi kerak edi, bu yerda burilmagan.", 'Минус пять отрицательное число, знак должен был перевернуться, а здесь не перевёрнут.', 'Negative five is negative, the sign should have flipped, but here it did not.') },
        ],
        solution: ['3 < 10', '×(−5)', L('manfiy, xato', 'отрицательное, неверно', 'negative, wrong')],
      },
      {
        expr: <Row size="big" align="center">{'−1 < 4,  × (−2) → 2 > −8'}</Row>,
        ok: L("Ha. Minus ikki manfiy, ishora burilgan, to'g'ri.", 'Да. Минус два отрицательное, знак перевёрнут, верно.', 'Yes. Negative two is negative, the sign flipped, correct.'),
        question: L("Bu natija to'g'rimi?", 'Верен ли этот результат?', 'Is this result correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Minus ikki manfiy son, ishora burilishi to'g'ri.", 'Минус два отрицательное число, знак верно перевёрнут.', 'Negative two is negative, correctly flipping the sign.') },
        ],
        solution: ['−1 < 4', '×(−2)', L('manfiy, to\'g\'ri', 'отрицательное, верно', 'negative, correct')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (1-darsning `drill`, ловушка): musbat songa
// ko'paytirilganda ishora ORTIQCHA burilgan (З53).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ishora kerak edimi",
    'Нужно ли было переворачивать знак',
    'Was flipping the sign needed',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham musbat songa ko'paytirilib, ishora ortiqcha burilgan.",
      'Два задания. В обоих умножено на положительное число, но знак перевёрнут без причины.',
      'Two tasks. In both, the multiplier is positive, but the sign was flipped without reason.'),
    A('why',
      "Faqat manfiy songa ko'paytirilganda ishora buriladi.",
      'Знак переворачивается только при умножении на отрицательное число.',
      'The sign flips only when multiplying by a negative number.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Musbat songa ko'paytirilganda ishora burilmaydi.",
      'Оба разобраны. При умножении на положительное число знак не переворачивается.',
      'Both are done. Multiplying by a positive number does not flip the sign.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'5 < 10,  × 3 → 15 > 30'}</Row>,
        ok: L("Ha. Uch musbat, ishora shu holicha qolishi kerak edi.", 'Да. Три положительное, знак должен был остаться таким же.', 'Yes. Three is positive, the sign should have stayed the same.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ishora ortiqcha burilgan", 'Знак перевёрнут без причины', 'The sign was flipped without reason') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, uch musbat, ishora burilmasligi kerak edi.", 'Это и есть показанная ошибка, три положительное, знак не должен был перевернуться.', 'This is the very mistake shown, three is positive, the sign should not have flipped.') },
        ],
        solution: ['5 < 10', '×3', '15 < 30'],
      },
      {
        expr: <Row size="big" align="center">{'2 < 6,  × 7 → 14 > 42'}</Row>,
        ok: L("Ha. Yetti musbat, ishora shu holicha qolishi kerak edi.", 'Да. Семь положительное, знак должен был остаться таким же.', 'Yes. Seven is positive, the sign should have stayed the same.'),
        question: L("Bu yerda xato qayerda?", 'В чём здесь ошибка?', 'Where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Ishora ortiqcha burilgan", 'Знак перевёрнут без причины', 'The sign was flipped without reason') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, yetti musbat, ishora burilmasligi kerak edi.", 'Это и есть показанная ошибка, семь положительное, знак не должен был перевернуться.', 'This is the very mistake shown, seven is positive, the sign should not have flipped.') },
        ],
        solution: ['2 < 6', '×7', '14 < 42'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH (1-darsning `fill`): ko'paytirish qadamlarini
// yozish.
// ============================================================
const S13 = {
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Ko'paytirish qadamlarini yozing",
    'Запиши шаги умножения',
    'Write the multiplication steps',
  ),
  audio: [
    A('mount',
      "Tengsizlik va ko'paytiruvchi berilgan. Ishorani hisobga olib natijani yozing.",
      'Даны неравенство и множитель. Учтя знак, запиши результат.',
      'An inequality and a multiplier are given. Accounting for the sign, write the result.'),
    A('why',
      "Ko'paytiruvchi manfiy bo'lsa, belgi ham o'zgaradi.",
      'Если множитель отрицателен, знак тоже меняется.',
      'If the multiplier is negative, the sign changes too.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar ko'paytiruvchining ishorasi belgini bergan.",
      'Все три заполнены. Каждый раз знак множителя давал знак результата.',
      'All three are filled. Each time the sign of the multiplier gave the sign of the result.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['12', '<'],
      lines: [
        [{ t: '3 < 4,   × 3 → 9 ' }, { slot: '<' }, { t: ' ' }, { slot: '12' }],
      ],
    },
    tasks: [
      {
        chips: ['−16', '>'],
        lines: [
          [{ t: '2 < 4,   × (−4) → −8 ' }, { slot: '>' }, { t: ' ' }, { slot: '−16' }],
        ],
      },
      {
        chips: ['20', '<'],
        lines: [
          [{ t: '1 < 5,   × 4 → 4 ' }, { slot: '<' }, { t: ' ' }, { slot: '20' }],
        ],
      },
      {
        chips: ['−6', '>'],
        lines: [
          [{ t: '−1 < 3,   × (−2) → 2 ' }, { slot: '>' }, { t: ' ' }, { slot: '−6' }],
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS (to'rt savol va beshinchisi SBORKA).
// ============================================================
const S14 = {
  eyebrow: UI.blitzEyebrow,
  title: L(
    "Ko'paytirish qoidasi bo'yicha to'rt savol",
    'Четыре вопроса о правиле умножения',
    'Four questions about the multiplication rule',
  ),
  audio: [
    A('mount',
      "To'rt savol va oxirida yozuvni yig'ish.",
      'Четыре вопроса и в конце сборка записи.',
      'Four questions and an assembly at the end.'),
    A('why',
      "Har javobdan keyin izoh chiqadi.",
      'После каждого ответа выходит разбор.',
      'After each answer an explanation appears.'),
  ],
  props: {
    lead: UI.blitzLead,
    items: [
      {
        id: 'q1', tag: 'З52',
        ask: L('4 < 9 ni minus birga ko\'paytirsak, qaysi yozuv to\'g\'ri?', 'При умножении 4 < 9 на минус один, какая запись верна?', 'Multiplying 4 < 9 by negative one, which record is correct?'),
        options: [
          { id: 'ok', right: true, label: '−4 > −9' },
          { id: 'noflip', label: '−4 < −9' },
          { id: 'abs', label: '4 > 9' },
          { id: 'equal', label: '−4 = −9' },
        ],
        hint: L("Minus bir manfiy, ishora buriladi.", 'Минус один отрицательное, знак переворачивается.', 'Negative one is negative, the sign flips.'),
        ok: L("To'g'ri, ishora burilib minus to'rt kattaroq chiqadi.", 'Верно, знак перевернулся, и минус четыре больше.', 'Correct, the sign flipped, and negative four is greater.'),
      },
      {
        id: 'q2', tag: 'З53',
        ask: L('6 < 8 ni ikkiga ko\'paytirsak, qaysi yozuv to\'g\'ri?', 'При умножении 6 < 8 на два, какая запись верна?', 'Multiplying 6 < 8 by two, which record is correct?'),
        options: [
          { id: 'ok', right: true, label: '12 < 16' },
          { id: 'flip', label: '12 > 16' },
          { id: 'wrong', label: '6 < 16' },
          { id: 'equal', label: '12 = 16' },
        ],
        hint: L("Ikki musbat son, ishora burilmaydi.", 'Два положительное число, знак не переворачивается.', 'Two is a positive number, the sign does not flip.'),
        ok: L("To'g'ri, musbat songa ko'paytirilganda ishora saqlanadi.", 'Верно, при умножении на положительное знак сохраняется.', 'Correct, multiplying by a positive keeps the sign.'),
      },
      {
        id: 'q3', tag: 'З52',
        ask: L('10 > 4 ni minus ikkiga bo\'lsak, qaysi yozuv to\'g\'ri?', 'При делении 10 > 4 на минус два, какая запись верна?', 'Dividing 10 > 4 by negative two, which record is correct?'),
        options: [
          { id: 'ok', right: true, label: '−5 < −2' },
          { id: 'noflip', label: '−5 > −2' },
          { id: 'abs', label: '5 < 2' },
          { id: 'equal', label: '−5 = −2' },
        ],
        hint: L("Bo'lish ham manfiy songa ko'paytirish kabi ishoraga ta'sir qiladi.", 'Деление тоже влияет на знак, как и умножение на отрицательное.', 'Division also affects the sign, just like multiplying by a negative.'),
        ok: L("To'g'ri, bo'lish manfiy songa, ishora buriladi.", 'Верно, деление на отрицательное, знак переворачивается.', 'Correct, dividing by a negative, the sign flips.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('−3 < 5 ni minus birga ko\'paytirib, 3 > −5 chiqishi to\'g\'rimi?', 'Верно ли, что при умножении −3 < 5 на минус один выходит 3 > −5?', 'Multiplying −3 < 5 by negative one, is 3 > −5 correct?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Minus bir manfiy, ishora buriladi, minus uch uchga, besh minus beshga aylanadi.", 'Минус один отрицательное, знак переворачивается, минус три становится три, пять становится минус пять.', 'Negative one is negative, the sign flips, negative three becomes three, five becomes negative five.'),
        ok: L("To'g'ri, ishora burilgan.", 'Верно, знак перевёрнут.', 'Correct, the sign is flipped.'),
      },
      {
        id: 'q5', tag: 'З52',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "1 < 3 ni minus beshga ko'paytiring va belgini qo'ying.",
            'Умножь 1 < 3 на минус пять и поставь знак.',
            'Multiply 1 < 3 by negative five and put the sign.',
          ),
          lines: [
            [{ t: '−5 ' }, { slot: '>' }, { t: ' −15' }],
          ],
          tiles: [
            { id: 't1', v: '>', x: 12, y: 12 },
            { id: 't2', v: '<', x: 70, y: 14 },
            { id: 't3', v: '=', x: 40, y: 50 },
          ],
          hint: L(
            "Minus besh manfiy son, ishora buriladi.",
            'Минус пять отрицательное число, знак переворачивается.',
            'Negative five is a negative number, the sign flips.',
          ),
          doneNote: L(
            "Yig'ildi. Manfiy songa ko'paytirilganda katta belgisi kichikka aylanadi.",
            'Собрано. При умножении на отрицательное знак больше становится знаком меньше.',
            'Assembled. Multiplying by a negative turns the greater-than sign into less-than.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (1-darsning `takeaway`). Yangi matematika yo'q.
// ============================================================
const S15 = {
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Manfiyga ko'paytirilganda ishora buriladi",
    'При умножении на отрицательное знак переворачивается',
    'Multiplying by a negative flips the sign',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. Bir bo'lingan besh kichik 0,21 dan, minus to'rtga ko'paytirilganda minus to'rtdan besh kattaroq chiqadi.",
      'С урока остаётся одна запись. Одна пятая меньше 0,21, при умножении на минус четыре минус четыре пятых выходит больше.',
      'One record stays with you. One fifth is less than 0.21, and multiplied by negative four, negative four fifths comes out greater.'),
    A('s1',
      "Bugun uch narsa qilindi. Musbatga ko'paytirishni ko'rdingiz, manfiyga ko'paytirishda ishora burilishini ko'rdingiz va buni son bilan tekshirdingiz.",
      'Сегодня сделано три вещи. Ты увидел умножение на положительное, увидел, как переворачивается знак при умножении на отрицательное, и проверил это числом.',
      'Three things are done today. You saw multiplying by a positive, saw the sign flip when multiplying by a negative, and checked it with a number.'),
    A('s2',
      "Keyingi darsda bir noma'lumli chiziqli tengsizliklar. Shu qoida iksni topishda ishlatiladi.",
      'В следующем уроке линейные неравенства с одной переменной. Это правило используется при поиске x.',
      'The next lesson covers linear inequalities in one variable. This rule is used when finding x.',
    ),
  ],
  props: {
    mark: '1/5 < 0,21,   × (−4) → −4/5 > −0,84',
    markNote: L(
      "manfiyga ko'paytirilganda ishora buriladi",
      'при умножении на отрицательное знак переворачивается',
      'multiplying by a negative flips the sign',
    ),
    lines: [
      L(
        "musbat songa ko'paytirilsa, ishora saqlanadi",
        'При умножении на положительное число знак сохраняется',
        'Multiplying by a positive number keeps the sign',
      ),
      L(
        "manfiy songa ko'paytirilsa, ishora buriladi",
        'При умножении на отрицательное число знак переворачивается',
        'Multiplying by a negative number flips the sign',
      ),
      L(
        "bo'lish ham shu qoidaga bo'ysunadi",
        'деление подчиняется тому же правилу',
        'division follows the same rule',
      ),
    ],
    bridge: L(
      "Keyingi dars: bir noma'lumli chiziqli tengsizliklar",
      'Следующий урок: линейные неравенства с одной переменной',
      'Next lesson: linear inequalities in one variable',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — MANFIYGA KO'PAYTIRISH (`twosides`).
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З52', 'З52', 'З52',
    'З52', 'З52', 'З53', 'З53', 'З52',
    'З16', 'З53', 'З52', null, null,
  ],
  mechanic: { at: 5, tool: 'twosides', kind: 'multiply' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
