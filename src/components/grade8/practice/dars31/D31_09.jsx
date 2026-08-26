// Dars31 · Amaliyot 09 — Kod · 🔴 · tag: code_exponents
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §3 (31-dars, 9-pozitsiya)
//
// UCH TENGLIK, TESKARI YO'NALISHDA: daraja berilgan emas, QIYMAT berilgan
// va ko'rsatkich izlanadi.
//   1/8 = 2ⁿ   -> sakkiz maxrajda -> n = −3
//   1/49 = 7ⁿ  -> qirq to'qqiz maxrajda -> n = −2
//   1 = 5ⁿ     -> maxraj ham, ko'paytma ham yo'q -> n = 0
// Uchinchisi T1 ni teskari tomondan so'raydi.
//
// Bankdagi tuzoqlar: `3` va `2` — ishorasi tushib qolgan ko'rsatkich (З63);
// `8` — ko'rsatkich o'rniga QIYMATNING o'zi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_exponents', level: '🔴',
  expr: [{ n: '1', d: '8' }, '= 2ⁿ', '   ', { n: '1', d: '49' }, '= 7ⁿ', '   ', '1 = 5ⁿ'], exprSize: 17,
  cards: ['−3', '−2', '0', '2', '3', '8'],
  answer: ['−3', '−2', '0'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch tenglik berilgan, va har birida ko'rsatkichni topish kerak. Bu odatdagi savolning teskarisi: daraja emas, uning qiymati berilgan.",
    'В комнате сейф, код трёхзначный. Даны три равенства, и в каждом надо найти показатель. Это обратная задача: дана не степень, а её значение.',
    'There is a safe in the room and its code has three places. Three equalities are given, and in each the exponent must be found. This is the reverse question: not the power but its value is given.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch ko'rsatkichni kodga o'sish tartibida yozing.",
    'Запиши три показателя в код по возрастанию.',
    'Write the three exponents into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchi tenglikda sakkiz MAXRAJDA turibdi, ya'ni asos ag'darilgan: sakkiz ikkining kubi, demak ko'rsatkich minus uch. Ikkinchisida qirq to'qqiz ham maxrajda: u yettining kvadrati, demak ko'rsatkich minus ikki. Uchinchisida esa na maxraj bor, na ko'paytma — o'ng tomonda faqat bir turibdi, va beshning qaysi darajasi bir beradi degan savolga bitta javob bor: nolinchi daraja. O'sish tartibida: minus uch, minus ikki, nol. Maxrajda turgan son ko'rsatkichni MANFIY qiladi, bu esa uning kattaligini emas, ISHORASINI beradi.",
    'Верно. В первом равенстве восьмёрка стоит в ЗНАМЕНАТЕЛЕ, то есть основание перевёрнуто: восемь это два в кубе, значит показатель минус три. Во втором сорок девять тоже в знаменателе: это семь в квадрате, значит показатель минус два. А в третьем нет ни знаменателя, ни произведения — справа стоит просто единица, и на вопрос, какая степень пятёрки даёт единицу, ответ один: нулевая. По возрастанию: минус три, минус два, нуль. Число в знаменателе делает показатель ОТРИЦАТЕЛЬНЫМ, и это его знак, а не величина.',
    'Correct. In the first equality the eight sits in the DENOMINATOR, so the base is turned over: eight is two cubed, hence the exponent is minus three. In the second, forty-nine is also in the denominator: it is seven squared, hence the exponent is minus two. And in the third there is neither denominator nor product — the right side is simply one, and the question of which power of five gives one has a single answer: the zero power. In increasing order: minus three, minus two, zero. A number in the denominator makes the exponent NEGATIVE, and that is its sign, not its size.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('3') !== -1 || s.slots.indexOf('2') !== -1, text: L(
      "Ko'rsatkichning kattaligi to'g'ri topildi, ISHORASI esa yo'qoldi. Ikkining kubi sakkiz — bu rost, lekin tenglikda sakkiz MAXRAJDA turibdi. Musbat ko'rsatkich sakkizni beradi, manfiysi esa bir sakkizdan ni. Tekshiring: ikkining kubi sakkiz, bir sakkizdan emas. Demak ko'rsatkich minus uch.",
      'Величина показателя найдена верно, а ЗНАК потерян. Два в кубе восемь — это правда, но в равенстве восьмёрка стоит в ЗНАМЕНАТЕЛЕ. Положительный показатель даёт восемь, а отрицательный — одну восьмую. Проверь: два в кубе это восемь, а не одна восьмая. Значит показатель минус три.',
      'The size of the exponent was found correctly, but the SIGN was lost. Two cubed is eight — true, yet in the equality the eight sits in the DENOMINATOR. A positive exponent gives eight, a negative one gives one eighth. Check: two cubed is eight, not one eighth. So the exponent is minus three.') },
    { when: (s) => s.slots.indexOf('8') !== -1, text: L(
      "Sakkiz — bu QIYMAT, ko'rsatkich emas. Kodga ko'rsatkich yoziladi, ya'ni ikkining tepasidagi kichik son. Savolni shunday qo'ying: ikkini necha marta ko'paytirsa bir sakkizdan chiqadi. Uch marta, va maxrajda — demak minus uch.",
      'Восемь — это ЗНАЧЕНИЕ, а не показатель. В код пишется показатель, то есть маленькое число над двойкой. Поставь вопрос так: сколько раз надо взять двойку, чтобы вышла одна восьмая. Три раза, и в знаменателе — значит минус три.',
      'Eight is the VALUE, not the exponent. The code takes the exponent, that is the small number above the two. Put the question this way: how many twos give one eighth. Three of them, and in the denominator — hence minus three.') },
    { when: (s) => s.slots.indexOf('0') === -1, text: L(
      "Kodda nol yo'q, lekin uchinchi tenglikning javobi aynan u. O'ng tomonda bir turibdi: na maxraj, na ko'paytma. Beshni bir marta olsangiz besh chiqadi, ikki marta olsangiz yigirma besh, maxrajga tushirsangiz bir beshdan — birga faqat NOLINCHI daraja olib keladi. Bu qoida beshga xos emas, u har qanday noldan farqli asos uchun ishlaydi.",
      'В коде нет нуля, а ответ третьего равенства именно он. Справа стоит единица: ни знаменателя, ни произведения. Возьмёшь пятёрку один раз — будет пять, два раза — двадцать пять, уведёшь в знаменатель — одна пятая; к единице приводит только НУЛЕВАЯ степень. Это правило не про пятёрку, оно работает для любого основания, отличного от нуля.',
      'The code has no zero, yet that is exactly the answer to the third equality. The right side is one: no denominator, no product. Take five once and you get five, twice and you get twenty-five, send it to the denominator and you get one fifth — only the ZERO power leads to one. This rule is not about five; it works for any base other than zero.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: minus uch, minus ikki, nol. Manfiy sonlarda moduli KATTA bo'lgani kichikroq: minus uch minus ikkidan kichik.",
      'Три числа найдены верно, а порядок нарушен. Код пишется по возрастанию: минус три, минус два, нуль. У отрицательных чисел меньше то, у которого БОЛЬШЕ модуль: минус три меньше минус двух.',
      'The three numbers are right, the order is not. The code goes in increasing order: minus three, minus two, zero. Among negatives the one with the LARGER size is smaller: minus three is below minus two.') },
  ],
  wrongText: L(
    "Har tenglikda ikki narsani ajrating: qiymat maxrajdami (ko'rsatkich manfiy) va necha marta ko'paytirilgan (ko'rsatkichning kattaligi). O'ng tomonda bir tursa — nolinchi daraja.",
    'В каждом равенстве раздели два вопроса: стоит ли значение в знаменателе (показатель отрицателен) и сколько раз взято основание (величина показателя). Если справа единица — нулевая степень.',
    'Separate two questions in every equality: is the value in the denominator (the exponent is negative), and how many times is the base taken (the size of the exponent). If the right side is one — the zero power.'),
};

export default function D31_09(props) { return <CodeLock data={DATA} {...props} />; }
