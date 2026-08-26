// Dars31 · Amaliyot 02 — Guruhlar · 🟢 · tag: defined_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §3 (31-dars, 2-pozitsiya)
//
// T3: TAQIQNI KO'RSATKICH EMAS, ASOS BERADI. Kartalar juft-juft qo'yilgan
// va har juftlikda ko'rsatkich BIR XIL, asos esa boshqa:
//   5⁰ va 0⁰ ; 2⁻³ va 0⁻³ ; (−3)⁻¹ va 0⁻¹ ; (0,5)⁰ va 0⁻²
// Ya'ni «manfiy ko'rsatkich taqiqlanadi» degan xulosa chiqmaydi: manfiy
// ko'rsatkichli uchta karta birinchi zonada turibdi.
//
// To'rtta nol ataylab. Bitta bo'lsa u istisno bo'lib ko'rinardi; to'rttasi
// esa naqsh: asos nol bo'lsa — ma'no yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'defined_or_not', level: '🟢',
  zoneSize: 13, itemSize: 17, zoneLbl: 124,
  zones: [
    { id: 'z1', label: L("MA'NOGA EGA", 'ИМЕЕТ СМЫСЛ', 'HAS A VALUE') },
    { id: 'z2', label: L('ANIQLANMAGAN', 'НЕ ОПРЕДЕЛЕНО', 'UNDEFINED') },
  ],
  items: [
    { id: 'i1', tokens: ['5⁰'], zone: 'z1' },
    { id: 'i2', tokens: ['0⁰'], zone: 'z2' },
    { id: 'i3', tokens: ['2⁻³'], zone: 'z1' },
    { id: 'i4', tokens: ['0⁻³'], zone: 'z2' },
    { id: 'i5', tokens: ['(−3)⁻¹'], zone: 'z1' },
    { id: 'i6', tokens: ['0⁻¹'], zone: 'z2' },
    { id: 'i7', tokens: ['(0,5)⁰'], zone: 'z1' },
    { id: 'i8', tokens: ['0⁻²'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz daraja. Ularning bir qismi oddiy sonni beradi, bir qismi esa umuman ma'noga ega emas. Kartalar juft-juft turibdi: har juftlikda ko'rsatkich bir xil, asos esa boshqa.",
    'Восемь степеней. Часть из них даёт обычное число, а часть вообще не имеет смысла. Карточки стоят парами: в каждой паре показатель одинаковый, а основание разное.',
    'Eight powers. Some of them give an ordinary number, others have no meaning at all. The cards come in pairs: within each pair the exponent is the same and the base differs.'),
  ask: L('Darajani bosing, keyin guruhini bosing.', 'Нажми степень, потом её группу.', 'Tap a power, then its group.'),
  bank: L('Darajalar', 'Степени', 'Powers'),
  correctText: L(
    "To'g'ri. Manfiy ko'rsatkich teskari songa o'tishni bildiradi, ya'ni asos MAXRAJGA tushadi. Nolinchi daraja esa bir xil darajani o'ziga bo'lishdan chiqadi, va bu bo'lishda ham asos maxrajda turadi. Ikkala holda ham asos nolga aylansa, maxraj nol bo'ladi — nolga bo'lish esa yo'q. Shuning uchun taqiqni ko'rsatkich emas, ASOS beradi: minus uchinchi daraja ikki uchun bemalol, nol uchun esa yo'q. Musbat asosning ham, manfiy asosning ham, o'nli kasrning ham nolinchi darajasi birga teng.",
    'Верно. Отрицательный показатель означает переход к обратному числу, то есть основание уходит в ЗНАМЕНАТЕЛЬ. А нулевая степень получается из деления одинаковой степени саму на себя, и в этом делении основание тоже стоит в знаменателе. В обоих случаях, если основание становится нулём, знаменатель равен нулю — а деления на нуль нет. Поэтому запрет даёт не показатель, а ОСНОВАНИЕ: минус третья степень для двойки спокойна, а для нуля нет. И у положительного основания, и у отрицательного, и у десятичной дроби нулевая степень равна единице.',
    'Correct. A negative exponent means moving to the reciprocal, that is, the base goes into the DENOMINATOR. And the zero power comes from dividing a power by itself, where the base again sits in the denominator. In both cases, if the base becomes zero the denominator is zero — and there is no division by zero. So the ban comes from the BASE, not the exponent: the minus third power is fine for two and not for zero. A positive base, a negative base, and a decimal all have a zero power equal to one.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1', text: L(
      "Nolning nolinchi darajasi ANIQLANMAGAN. Nolinchi daraja bir xil darajani o'ziga bo'lishdan chiqadi: nolning kubini nolning kubiga bo'lish kerak bo'lardi, ya'ni nolni nolga bo'lish. Bunday bo'lish yo'q, shuning uchun bu yozuvga qiymat berilmaydi. Qo'shni kartaga qarang — u yerda o'sha ko'rsatkich, lekin asos besh, va u birga teng.",
      'Нуль в нулевой степени НЕ ОПРЕДЕЛЁН. Нулевая степень получается из деления одинаковой степени саму на себя: пришлось бы делить нуль в кубе на нуль в кубе, то есть нуль на нуль. Такого деления нет, поэтому этой записи значение не приписывают. Посмотри на соседнюю карточку — там тот же показатель, но основание пять, и она равна единице.',
      'Zero to the zero is UNDEFINED. The zero power comes from dividing a power by itself: it would mean dividing zero cubed by zero cubed, that is zero by zero. There is no such division, so this record is given no value. Look at the neighbouring card — the same exponent there, but the base is five, and it equals one.') },
    { when: (s) => s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Asosi nol bo'lgan manfiy daraja aniqlanmagan. Manfiy ko'rsatkichni ochib yozing: nolning minus uchinchi darajasi bir bo'lingan nolning kubi, ya'ni bir bo'lingan nol. Maxraj nol bo'lib qoldi, va bunday kasr yo'q. Boshqa asoslarda bu muammo yo'q: ikkining kubi sakkiz, va bir bo'lingan sakkiz oddiy son.",
      'Отрицательная степень с основанием нуль не определена. Раскрой отрицательный показатель: нуль в минус третьей это единица делить на нуль в кубе, то есть единица делить на нуль. Знаменатель оказался нулём, а такой дроби нет. При других основаниях этой беды нет: два в кубе восемь, и одна восьмая — обычное число.',
      'A negative power with base zero is undefined. Unfold the negative exponent: zero to the minus three is one divided by zero cubed, that is one divided by zero. The denominator turned out to be zero, and there is no such fraction. With other bases the trouble is absent: two cubed is eight, and one eighth is an ordinary number.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i5 === 'z2', text: L(
      "Manfiy ko'rsatkich TAQIQ EMAS. U faqat teskari songa o'tishni bildiradi: ikkining minus uchinchi darajasi bir bo'lingan sakkiz, minus uchning minus birinchi darajasi esa minus bir uchdan. Ikkalasi ham oddiy son. Taqiq faqat asos nol bo'lganda paydo bo'ladi, chunki o'shanda maxraj nolga aylanadi.",
      'Отрицательный показатель — НЕ ЗАПРЕТ. Он лишь означает переход к обратному числу: два в минус третьей это одна восьмая, а минус три в минус первой это минус одна треть. И то, и другое — обычные числа. Запрет появляется только при основании нуль, потому что тогда знаменатель обращается в нуль.',
      'A negative exponent is NOT a ban. It only means moving to the reciprocal: two to the minus three is one eighth, and minus three to the minus one is minus one third. Both are ordinary numbers. The ban appears only when the base is zero, because then the denominator becomes zero.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i7 === 'z2', text: L(
      "Nolinchi daraja asos noldan farqli bo'lsa doim birga teng — asos butun sonmi, manfiymi yoki o'nli kasrmi, ahamiyati yo'q. Nol butun besh ham noldan farqli, ya'ni uning nolinchi darajasi bir. Bu qoidani bo'lish beradi: bir xil darajani o'ziga bo'lsangiz bir chiqadi.",
      'Нулевая степень при основании, отличном от нуля, всегда равна единице — целое основание, отрицательное или десятичная дробь, неважно. Нуль целых пять тоже отлично от нуля, значит его нулевая степень равна единице. Это правило даёт деление: одинаковая степень, делённая сама на себя, даёт единицу.',
      'The zero power equals one whenever the base is not zero — whether the base is a whole number, a negative, or a decimal makes no difference. Zero point five is also not zero, so its zero power is one. Division gives the rule: a power divided by itself gives one.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada bitta savol bering: ASOS nolmi yoki yo'q. Ko'rsatkichga qaramang — u hech narsani taqiqlamaydi. Asos nol bo'lsa maxraj nolga aylanadi va yozuvning ma'nosi qolmaydi.",
      'К каждой карточке задай один вопрос: основание нуль или нет. На показатель не смотри — он ничего не запрещает. Если основание нуль, знаменатель обращается в нуль и у записи не остаётся смысла.',
      'Ask one question of every card: is the BASE zero or not. Do not look at the exponent — it forbids nothing. If the base is zero the denominator becomes zero and the record keeps no meaning.') },
  ],
  wrongText: L(
    "Faqat ASOSGA qarang: u nol bo'lsa yozuv aniqlanmagan, nolmas bo'lsa ma'noga ega. Ko'rsatkichning manfiyligi hech narsani taqiqlamaydi.",
    'Смотри только на ОСНОВАНИЕ: если оно нуль — запись не определена, если не нуль — имеет смысл. Отрицательность показателя ничего не запрещает.',
    'Look only at the BASE: if it is zero the record is undefined, if not zero it has a value. A negative exponent forbids nothing.'),
};

export default function D31_02(props) { return <Zones data={DATA} {...props} />; }
