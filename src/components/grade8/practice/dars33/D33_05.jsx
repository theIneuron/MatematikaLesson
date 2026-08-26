// Dars33 · Amaliyot 05 — Kod · 🟡 · tag: code_exponents
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §5 (33-dars, 5-pozitsiya)
//
// UCH SON BIR XIL RAQAMLARDAN TUZILGAN, farq faqat vergulda:
//   0,0025 -> 2,5 · 10⁻³ -> −3
//   0,52   -> 5,2 · 10⁻¹ -> −1
//   520    -> 5,2 · 10²  ->  2
// Ikkinchisi va uchinchisi ayniqsa yaqin: o'sha 5,2, lekin ko'rsatkich
// minus bir va ikki.
//
// Bankdagi uch tuzoq — `3`, `1`, `−2`: hammasi ishorasi almashgan javob.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_exponents', level: '🟡',
  expr: ['0,0025', '   ', '0,52', '   ', '520'], exprSize: 19,
  cards: ['−3', '−2', '−1', '1', '2', '3'],
  answer: ['−3', '−1', '2'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch son berilgan, va har birining standart yozuvidagi ko'rsatkichni topish kerak. Uchala sonda ham bir xil raqamlar turibdi.",
    'В комнате сейф, код трёхзначный. Даны три числа, и надо найти показатель в стандартной записи каждого. Во всех трёх стоят одни и те же цифры.',
    'There is a safe in the room and its code has three places. Three numbers are given, and the exponent in the standard record of each must be found. All three hold the same digits.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch ko'rsatkichni kodga o'sish tartibida yozing.",
    'Запиши три показателя в код по возрастанию.',
    'Write the three exponents into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchi son birdan kichik: vergulni ikkidan keyin qo'yish uchun uni uch xona o'ngga surish kerak, ya'ni ko'rsatkich minus uch. Ikkinchisi ham birdan kichik, lekin unchalik emas: vergul bir xona o'ngga suriladi, ko'rsatkich minus bir. Uchinchisi esa birdan katta: vergul ikki xona chapga suriladi, ko'rsatkich musbat ikki. O'sish tartibida: minus uch, minus bir, ikki. Uchala sonda ham raqamlar deyarli bir xil, javobni esa faqat vergulning o'rni hal qildi — bu standart yozuvning butun mazmuni.",
    'Верно. Первое число меньше единицы: чтобы поставить запятую после двойки, её надо сдвинуть на три разряда вправо, значит показатель минус три. Второе тоже меньше единицы, но не настолько: запятая сдвигается на разряд вправо, показатель минус один. Третье больше единицы: запятая сдвигается на два разряда влево, показатель положительный два. По возрастанию: минус три, минус один, два. Цифры во всех трёх почти одинаковы, а ответ решило только положение запятой — в этом весь смысл стандартной записи.',
    'Correct. The first number is below one: to place the point after the two it must move three places right, so the exponent is minus three. The second is also below one, but less so: the point moves one place right, the exponent is minus one. The third is above one: the point moves two places left, the exponent is a positive two. In increasing order: minus three, minus one, two. The digits are nearly the same in all three, and only the position of the point decided the answer — that is the whole point of standard form.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('3') !== -1 || s.slots.indexOf('1') !== -1, text: L(
      "Xonalar to'g'ri sanaldi, ishora esa yo'qoldi. Bu sonlar birdan KICHIK, ya'ni ularni birdan o'ngacha bo'lgan mantissadan olish uchun KICHRAYTIRISH kerak, va kichraytirishni manfiy ko'rsatkich qiladi. Tekshiring: ikki butun besh o'ndan karra o'nning kubi ikki ming besh yuz, nol butun nol nol yigirma besh emas.",
      'Разряды сосчитаны верно, а знак потерян. Эти числа МЕНЬШЕ единицы, значит, чтобы получить их из мантиссы от одного до десяти, надо УМЕНЬШИТЬ, а уменьшает отрицательный показатель. Проверь: два целых пять десятых на десять в кубе это две тысячи пятьсот, а не нуль целых двадцать пять десятитысячных.',
      'The places were counted correctly, but the sign was lost. These numbers are BELOW one, so to reach them from a mantissa between one and ten you must make it SMALLER, and a negative exponent does that. Check: two point five times ten cubed is two thousand five hundred, not zero point zero zero two five.') },
    { when: (s) => s.slots.indexOf('−2') !== -1, text: L(
      "Uchinchi son besh yuz yigirma — u birdan ancha KATTA, ya'ni ko'rsatkich musbat bo'lishi kerak. Manfiy ko'rsatkich uni kichkina songa aylantirardi: besh butun ikki o'ndan karra o'nning minus ikkinchi darajasi nol butun nol besh yuz ikki mingdan beradi. Sonning kattaligiga qarang, keyin xonalarni sanang.",
      'Третье число пятьсот двадцать — оно намного БОЛЬШЕ единицы, значит показатель должен быть положительным. Отрицательный превратил бы его в крошечное: пять целых две десятых на десять в минус второй даёт нуль целых пятьдесят две тысячных. Сначала смотри на величину числа, потом считай разряды.',
      'The third number is five hundred twenty — far ABOVE one, so the exponent must be positive. A negative one would turn it tiny: five point two times ten to the minus two is zero point zero five two. Look at the size of the number first, then count the places.') },
    { when: (s) => s.slots.indexOf('−1') === -1, text: L(
      "Kodda minus bir yo'q, lekin ikkinchi sonning javobi aynan u. Nol butun ellik ikki yuzdan birdan kichik, ya'ni ko'rsatkich manfiy; vergul esa faqat BIR xona suriladi, chunki beshlik allaqachon vergulning yonida turibdi. Uchinchi son bilan solishtiring: u yerda o'sha besh butun ikki o'ndan, lekin ko'rsatkich ikki.",
      'В коде нет минус единицы, а ответ второго числа именно она. Нуль целых пятьдесят две сотых меньше единицы, значит показатель отрицателен; а запятая сдвигается лишь на ОДИН разряд, ведь пятёрка уже стоит рядом с запятой. Сравни с третьим числом: там те же пять целых две десятых, но показатель два.',
      'The code has no minus one, yet that is the answer for the second number. Zero point five two is below one, so the exponent is negative; and the point moves only ONE place, since the five already stands next to it. Compare with the third number: the same five point two there, but the exponent is two.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: minus uch, minus bir, ikki. Manfiy sonlarni tartiblashda moduli katta bo'lgani kichikroq.",
      'Три числа найдены верно, а порядок нарушен. Код пишется по возрастанию: минус три, минус один, два. При упорядочивании отрицательных меньше то, у которого больше модуль.',
      'The three numbers are right, the order is not. The code goes in increasing order: minus three, minus one, two. When ordering negatives, the larger in size is the smaller number.') },
  ],
  wrongText: L(
    "Har sonni bir bilan solishtiring — bu ishorani beradi; keyin vergul necha xona surilishini sanang — bu kattalikni beradi.",
    'Сравни каждое число с единицей — это даст знак; потом сосчитай, на сколько разрядов сдвигается запятая, — это даст величину.',
    'Compare each number with one — that gives the sign; then count how many places the point moves — that gives the size.'),
};

export default function D33_05(props) { return <CodeLock data={DATA} {...props} />; }
