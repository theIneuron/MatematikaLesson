// Dars32 · Amaliyot 01 — Belgilash · 🟢 · tag: equal_a5_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §4 (32-dars, 1-pozitsiya)
//
// UCHALA XOSSA BIR TOPSHIRIQDA, va uchtasi ham a⁵ ni beradi:
//   a²·a³   -> ko'rsatkichlar qo'shiladi (T1)
//   a⁸:a³   -> ko'rsatkichlar ayiriladi  (T2)
//   a⁷·a⁻²  -> manfiy ko'rsatkich bilan ham o'sha qoida (T3)
//
// Uch rad etilgan karta uch xil sababdan: `a² + a³` — qo'shish daraja
// bermaydi (bu umuman boshqa amal); `(a²)³` — bu yerda ko'rsatkichlar
// KO'PAYTIRILADI va olti chiqadi; `a⁸:a⁻³` — manfiy ko'rsatkichni ayirish
// uni qo'shishga aylantiradi va o'n bir chiqadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'equal_a5_marked', level: '🟢',
  col: 112, itemSize: 18,
  given: [['a⁵']],
  givenLabel: L('Izlanayotgan daraja', 'Искомая степень', 'The power sought'),
  items: [
    { id: 'i1', tokens: ['a² · a³'], hit: true },
    { id: 'i2', tokens: ['a² + a³'] },
    { id: 'i3', tokens: ['a⁸ : a³'], hit: true },
    { id: 'i4', tokens: ['(a²)³'] },
    { id: 'i5', tokens: ['a⁷ · a⁻²'], hit: true },
    { id: 'i6', tokens: ['a⁸ : a⁻³'] },
  ],
  eyebrow: L('Belgilash', 'Отметь', 'Mark'),
  setup: L(
    "Olti ifoda. Uchtasi soddalashtirilganda aynan a beshinchi darajasini beradi, uchtasi esa boshqa natijani. Hamma joyda bitta asos, ya'ni javobni faqat ko'rsatkichlar hal qiladi.",
    'Шесть выражений. Три из них после упрощения дают ровно a в пятой степени, а три — другой результат. Основание везде одно, значит ответ решают только показатели.',
    'Six expressions. Three of them simplify to exactly a to the fifth, three give something else. The base is the same everywhere, so only the exponents decide the answer.'),
  ask: L(
    "a⁵ ga teng bo'lgan 3 ta ifodani belgilang.",
    'Отметь 3 выражения, равные a⁵.',
    'Mark the 3 expressions equal to a⁵.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Ko'paytirishda ko'rsatkichlar QO'SHILADI: ikki qo'shuv uch besh. Bo'lishda AYIRILADI: sakkiz minus uch besh. Uchinchisida ko'rsatkich manfiy, qoida esa o'sha: yetti qo'shuv minus ikki besh. Rad etilganlar boshqa: qo'shish daraja bermaydi; qavsda ko'rsatkichlar ko'paytiriladi va olti chiqadi; oxirgisida manfiy ko'rsatkich ayirilyapti — sakkiz minus minus uch, ya'ni o'n bir.",
    'Верно. При умножении показатели СКЛАДЫВАЮТСЯ: два плюс три пять. При делении ВЫЧИТАЮТСЯ: восемь минус три пять. В третьем показатель отрицательный, но правило остаётся тем же: семь плюс минус два пять. Три отвергнутых устроены иначе: сложение вообще не даёт степени — a в квадрате плюс a в кубе не упрощается и одной степенью не записывается; в выражении со скобкой показатели перемножаются и выходит шесть; а в последнем вычитается отрицательный показатель, то есть восемь минус минус три — это одиннадцать.',
    'Correct. Multiplication ADDS the exponents: two plus three is five. Division SUBTRACTS them: eight minus three is five. In the third the exponent is negative, but the rule stays the same: seven plus minus two is five. The three rejected ones work differently: addition gives no power at all — a squared plus a cubed does not simplify and cannot be written as one power; in the bracketed expression the exponents multiply and give six; and in the last a negative exponent is subtracted, that is eight minus minus three — which is eleven.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Qo'shish daraja bermaydi. Ko'rsatkichlar faqat KO'PAYTIRISHDA qo'shiladi, ifodaning o'zi qo'shilganda emas. a kvadrat qo'shuv a kub — bu ikki har xil had, va ular birlashmaydi. Son bilan tekshiring: a ikkiga teng bo'lsa, to'rt qo'shuv sakkiz o'n ikki, a beshinchi darajasi esa o'ttiz ikki.",
      'Сложение не даёт степени. Показатели складываются только при УМНОЖЕНИИ, а не когда складываются сами выражения. a в квадрате плюс a в кубе — это два разных слагаемых, и они не объединяются. Проверь числом: при a равном двум четыре плюс восемь двенадцать, а a в пятой это тридцать два.',
      'Addition gives no power. Exponents add only under MULTIPLICATION, not when the expressions themselves are added. a squared plus a cubed are two different terms and they do not combine. Check with a number: at a equal to two, four plus eight is twelve, while a to the fifth is thirty-two.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Qavs ichidagi daraja yana darajaga ko'tarilgan, va bu yerda ko'rsatkichlar QO'SHILMAYDI, ko'paytiriladi: ikki karra uch olti. Ochib yozing — a kvadratni uch marta ko'paytirish kerak, ya'ni a olti marta ko'paytuvchi bo'ladi. Son bilan tekshiring: a ikkiga teng bo'lsa, to'rtning kubi oltmish to'rt, a beshinchi darajasi esa o'ttiz ikki.",
      'Степень в скобке возведена ещё в степень, и здесь показатели НЕ СКЛАДЫВАЮТСЯ, а перемножаются: дважды три шесть. Распиши — a в квадрате надо взять три раза, то есть a окажется множителем шесть раз. Проверь числом: при a равном двум четыре в кубе шестьдесят четыре, а a в пятой тридцать два.',
      'A power inside a bracket is raised to a power again, and here the exponents do NOT add, they multiply: two times three is six. Unfold it — a squared must be taken three times, so a is a factor six times. Check with a number: at a equal to two, four cubed is sixty-four, while a to the fifth is thirty-two.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bo'lishda ko'rsatkichlar ayiriladi, lekin bu yerda ayiriladigan ko'rsatkich MANFIY: sakkiz minus minus uch. Manfiy sonni ayirish uni qo'shishga aylantiradi, ya'ni sakkiz qo'shuv uch — o'n bir. Yonidagi karta bilan solishtiring: u yerda maxrajdagi ko'rsatkich musbat, va javob besh chiqadi.",
      'При делении показатели вычитаются, но здесь вычитаемый показатель ОТРИЦАТЕЛЬНЫЙ: восемь минус минус три. Вычитание отрицательного превращается в сложение, то есть восемь плюс три — одиннадцать. Сравни с соседней карточкой: там показатель в знаменателе положительный, и получается пять.',
      'Division subtracts the exponents, but here the exponent being subtracted is NEGATIVE: eight minus minus three. Subtracting a negative turns into adding, that is eight plus three — eleven. Compare with the neighbouring card: there the denominator exponent is positive and the result is five.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Manfiy ko'rsatkichli karta chetlab o'tildi, lekin u ham a beshinchi darajasini beradi. Qoida o'zgarmaydi: ko'paytirishda ko'rsatkichlar qo'shiladi, ko'rsatkich manfiy bo'lsa ham. Yetti qo'shuv minus ikki besh. Ochib yozsangiz ham ko'rinadi: a yettinchi darajasini a kvadratga bo'lish kerak.",
      'Карточка с отрицательным показателем осталась в стороне, а она тоже даёт a в пятой. Правило не меняется: при умножении показатели складываются, даже если показатель отрицательный. Семь плюс минус два пять. Это видно и в раскрытом виде: a в седьмой надо разделить на a в квадрате.',
      'The card with the negative exponent was left out, yet it also gives a to the fifth. The rule does not change: multiplication adds the exponents, even a negative one. Seven plus minus two is five. Unfolding shows the same: a to the seventh divided by a squared.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta ifoda kerak. Har birida avval AMALNI aniqlang — ko'paytirishmi, bo'lishmi yoki darajaga ko'tarishmi, — keyin unga mos qoidani qo'llang: qo'shish, ayirish yoki ko'paytirish.",
      'Нужно ровно три выражения. В каждом сначала определи ДЕЙСТВИЕ — умножение, деление или возведение в степень, — потом примени соответствующее правило: сложение, вычитание или умножение.',
      'Exactly three expressions are needed. In each, first identify the OPERATION — multiplication, division or raising to a power — then apply the matching rule: add, subtract or multiply.') },
  ],
  wrongText: L(
    "Avval amalni aniqlang: ko'paytirishda ko'rsatkichlar qo'shiladi, bo'lishda ayiriladi, darajaga ko'tarishda ko'paytiriladi. Qo'shish esa daraja bermaydi.",
    'Сначала определи действие: при умножении показатели складываются, при делении вычитаются, при возведении в степень перемножаются. А сложение степени не даёт.',
    'First identify the operation: multiplication adds the exponents, division subtracts them, raising to a power multiplies them. Addition gives no power at all.'),
};

export default function D32_01(props) { return <MarkAll data={DATA} {...props} />; }
