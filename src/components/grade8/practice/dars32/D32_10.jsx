// Dars32 · Amaliyot 10 — Kod · 🔴 · tag: code_exponents
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §4 (32-dars, 10-pozitsiya)
//
// UCH IFODA, UCH XOSSA, VA UCHALASIDA HAM ISHORA HAL QILADI:
//   (a⁻²)³  -> −2 · 3 = −6
//   a⁵:a⁷   -> 5 − 7 = −2
//   a⁴·a⁻¹  -> 4 + (−1) = 3
// Ikkinchisi alohida: bo'lish natijasi MANFIY ko'rsatkich beradi, ya'ni
// javob maxrajga tushadi. Bu 31-darsning davomi — manfiy ko'rsatkich endi
// hisobning natijasi sifatida paydo bo'ladi, ta'rif sifatida emas.
//
// Bankdagi uch tuzoq: `6`, `2`, `−3` — hammasi ishorasi buzilgan natija.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_exponents', level: '🔴',
  expr: ['(a⁻²)³', '   ', 'a⁵ : a⁷', '   ', 'a⁴ · a⁻¹'], exprSize: 17,
  cards: ['−6', '−3', '−2', '2', '3', '6'],
  answer: ['−6', '−2', '3'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch ifoda berilgan, va har birini bitta darajaga keltirish kerak. Kodga ko'rsatkichlar yoziladi.",
    'В комнате сейф, код трёхзначный. Даны три выражения, и каждое надо привести к одной степени. В код записываются показатели.',
    'There is a safe in the room and its code has three places. Three expressions are given, and each must be reduced to a single power. The code takes the exponents.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch ko'rsatkichni kodga o'sish tartibida yozing.",
    'Запиши три показателя в код по возрастанию.',
    'Write the three exponents into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisida qavs turibdi, ya'ni ko'rsatkichlar ko'paytiriladi: minus ikki karra uch minus olti. Ikkinchisida bo'lish: besh minus yetti minus ikki — natija manfiy chiqdi, ya'ni javob maxrajda turadi. Uchinchisida ko'paytirish: to'rt qo'shuv minus bir uch. O'sish tartibida: minus olti, minus ikki, uch. Uch amalning uchtasi ham manfiy ko'rsatkich bilan ishladi, va ularning hech biri qoidani buzmadi: xossalar p va q istalgan butun son bo'lganda to'g'ri.",
    'Верно. В первом стоит скобка, значит показатели перемножаются: минус два на три минус шесть. Во втором деление: пять минус семь минус два — результат отрицательный, значит ответ стоит в знаменателе. В третьем умножение: четыре плюс минус один три. По возрастанию: минус шесть, минус два, три. Все три действия работали с отрицательным показателем, и ни одно из них правила не нарушило: свойства верны при любых целых p и q.',
    'Correct. The first has a bracket, so the exponents multiply: minus two times three is minus six. The second is a division: five minus seven is minus two — the result is negative, so the answer sits in the denominator. The third is a multiplication: four plus minus one is three. In increasing order: minus six, minus two, three. All three operations worked with a negative exponent, and none of them broke the rule: the properties hold for any whole p and q.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('6') !== -1, text: L(
      "Birinchi ifodada ko'rsatkichlarning ko'paytmasi to'g'ri topildi, ishorasi esa yo'qoldi. Minus ikkini uchga ko'paytirsangiz MANFIY son chiqadi: minus olti. Ochib yozing — a ning minus ikkinchi darajasi bir bo'lingan a kvadrat, va uni uch marta ko'paytirsangiz maxrajda a ning oltinchi darajasi qoladi. Maxrajdagi daraja manfiy ko'rsatkich bilan yoziladi.",
      'В первом выражении произведение показателей найдено верно, а знак потерян. Минус два, умноженное на три, даёт ОТРИЦАТЕЛЬНОЕ число: минус шесть. Распиши — a в минус второй это единица делить на a в квадрате, а взяв это трижды, получим в знаменателе a в шестой. Степень в знаменателе записывается отрицательным показателем.',
      'In the first expression the product of the exponents was found correctly, but the sign was lost. Minus two times three gives a NEGATIVE number: minus six. Unfold it — a to the minus two is one divided by a squared, and taking that three times leaves a to the sixth in the denominator. A power in the denominator is written with a negative exponent.') },
    { when: (s) => s.slots.indexOf('2') !== -1, text: L(
      "Ikkinchi ifodada ayirma teskari tartibda olindi: yetti minus besh ikki. Bo'lishda SURATDAGI ko'rsatkichdan maxrajdagisi ayiriladi: besh minus yetti minus ikki. Tartibni tekshirish oson — maxraj kattaroq, ya'ni bo'linma birdan kichik bo'lishi kerak, va shuning uchun ko'rsatkich manfiy.",
      'Во втором выражении разность взята в обратном порядке: семь минус пять два. При делении из показателя ЧИСЛИТЕЛЯ вычитается показатель знаменателя: пять минус семь минус два. Порядок легко проверить — знаменатель больше, значит частное меньше единицы, потому показатель и отрицателен.',
      'In the second expression the difference was taken the wrong way round: seven minus five is two. Division subtracts the denominator exponent from the NUMERATOR one: five minus seven is minus two. The order is easy to check — the denominator is larger, so the quotient is below one, which is why the exponent is negative.') },
    { when: (s) => s.slots.indexOf('−3') !== -1, text: L(
      "Uchinchi ifodada ko'paytirish turibdi: to'rt qo'shuv minus bir uch. Javob MUSBAT, chunki to'rt birdan katta. Minus uch chiqishi uchun to'rt manfiy bo'lishi kerak edi. Son bilan tekshiring: a ikkiga teng bo'lsa, o'n olti karra bir yarim sakkiz, va sakkiz ikkining kubi.",
      'В третьем выражении умножение: четыре плюс минус один три. Ответ ПОЛОЖИТЕЛЬНЫЙ, потому что четыре больше единицы. Чтобы вышло минус три, четвёрка должна была быть отрицательной. Проверь числом: при a равном двум шестнадцать на одну вторую восемь, а восемь это два в кубе.',
      'The third expression is a multiplication: four plus minus one is three. The answer is POSITIVE, because four exceeds one. To get minus three the four would have to be negative. Check with a number: at a equal to two, sixteen times one half is eight, and eight is two cubed.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: minus olti, minus ikki, uch. Manfiy sonlarda moduli katta bo'lgani kichikroq: minus olti minus ikkidan kichik.",
      'Три числа найдены верно, а порядок нарушен. Код пишется по возрастанию: минус шесть, минус два, три. У отрицательных чисел меньше то, у которого больше модуль: минус шесть меньше минус двух.',
      'The three numbers are right, the order is not. The code goes in increasing order: minus six, minus two, three. Among negatives the one with the larger size is smaller: minus six is below minus two.') },
  ],
  wrongText: L(
    "Har ifodada avval amalni aniqlang, keyin ishorani ehtiyot bo'lib hisoblang. Manfiy ko'rsatkich natijada ham paydo bo'lishi mumkin.",
    'В каждом выражении сначала определи действие, потом аккуратно посчитай знак. Отрицательный показатель может появиться и в результате.',
    'In every expression identify the operation first, then work out the sign carefully. A negative exponent can appear in the result as well.'),
};

export default function D32_10(props) { return <CodeLock data={DATA} {...props} />; }
