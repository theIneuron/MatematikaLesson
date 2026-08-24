// Dars11 · Amaliyot 05 — Belgilash · 🟡 · tag: always_true_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 5-pozitsiya)
//
// «Har qanday f da to'g'ri» degan talab uch tenglikni tanlaydi:
//   √(f²) = |f|     modul turgani uchun har doim to'g'ri;
//   √(f⁴) = f²      f kvadrat allaqachon nomanfiy, modul kerak emas;
//   √(9f²) = 3|f|   uchning kvadrati ildizdan chiqadi, f esa modul bo'lib.
// Uch xato tenglik uch adashish:
//   (√f)² = f       faqat f nomanfiy bo'lganda (chap tomon aks holda yo'q);
//   √(f²) = f       З31, modul tushib qoldi;
//   √(f²+16) = f+4  З4, ildiz hadlarga bo'lib chiqarildi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'always_true_marked', level: '🟡',
  col: 168, itemSize: 18,
  items: [
    { id: 'i1', tokens: [{ r: 'f²' }, '= |f|'], hit: true },
    { id: 'i2', tokens: ['(', { r: 'f' }, ')² = f'] },
    { id: 'i3', tokens: [{ r: 'f⁴' }, '= f²'], hit: true },
    { id: 'i4', tokens: [{ r: 'f²' }, '= f'] },
    { id: 'i5', tokens: [{ r: '9f²' }, '= 3|f|'], hit: true },
    { id: 'i6', tokens: [{ r: 'f² + 16' }, '= f + 4'] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita tenglik. Ba'zilari f ning har qanday qiymatida to'g'ri, ba'zilari faqat ayrim qiymatlarda.",
    'Шесть равенств. Одни верны при любом значении f, другие только при некоторых.',
    'Six equalities. Some are true for every value of f, others only for some.'),
  ask: L(
    "f ning HAR QANDAY qiymatida to'g'ri bo'lgan 3 ta tenglikni belgilang.",
    'Отметь 3 равенства, верные при ЛЮБОМ значении f.',
    'Mark the 3 equalities that are true for EVERY value of f.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasini minus uchda ham, uchda ham tekshirib ko'rish mumkin. Birinchisida modul turadi: minus uchda kvadrat to'qqiz, ildiz uch, modul ham uch. Ikkinchisida to'rtinchi daraja: minus uchda sakson bir, ildizi to'qqiz, va f kvadrat ham to'qqiz — modul keraksiz, chunki kvadrat allaqachon nomanfiy. Uchinchisida ildizdan uch chiqadi va f modul bo'lib qoladi: minus uchda ildiz osti sakson bir, ildizi to'qqiz, uch karra uch ham to'qqiz.",
    'Верно. Все три проверяются и при минус трёх, и при трёх. В первом стоит модуль: при минус трёх квадрат девять, корень три, модуль тоже три. Во втором четвёртая степень: при минус трёх восемьдесят один, корень девять, и f в квадрате тоже девять — модуль не нужен, ведь квадрат уже неотрицателен. В третьем из корня выходит три, а f остаётся под модулем: при минус трёх подкоренное восемьдесят один, корень девять, три на три тоже девять.',
    'Correct. All three can be checked at minus three and at three. The first has a modulus: at minus three the square is nine, the root is three, the modulus is three. The second has a fourth power: at minus three it is eighty one, the root is nine, and f squared is nine too — no modulus needed, since a square is already non-negative. In the third the three comes out of the root and f stays under a modulus: at minus three the radicand is eighty one, the root is nine, and three times three is nine as well.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu tenglikda modul tushib qolgan. f ni minus uchga qo'ying: chap tomonda kvadrat to'qqiz, ildizi uch; o'ng tomonda esa minus uch. Uch minus uchga teng emas, demak tenglik har qanday f da to'g'ri emas.",
      'В этом равенстве потерян модуль. Подставь f равное минус трём: слева квадрат девять, корень три; справа минус три. Три не равно минус трём, значит равенство верно не при любом f.',
      'This equality lost the modulus. Substitute f equal to minus three: on the left the square is nine and the root is three; on the right it is minus three. Three is not minus three, so the equality does not hold for every f.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu tenglik f nomanfiy bo'lganda to'g'ri, lekin har qanday f da emas: f ni minus uchga qo'ysangiz chap tomonning O'ZI yo'q — manfiy sondan ildiz olinmaydi. Yozuv mavjud bo'lmagan joyda tenglik ham gapirmaydi.",
      'Это равенство верно при неотрицательном f, но не при любом: подставь минус три и левая часть просто НЕ СУЩЕСТВУЕТ — из отрицательного корень не извлекается. Там, где записи нет, равенство ничего не утверждает.',
      'This equality holds for non-negative f but not for every f: substitute minus three and the left side simply DOES NOT EXIST — a root cannot be taken of a negative number. Where the record does not exist, the equality says nothing.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Ildiz hadlarga bo'linmaydi. f ni uchga qo'ying: chap tomonda to'qqiz qo'shuv o'n olti yigirma besh, ildizi besh; o'ng tomonda esa uch qo'shuv to'rt, ya'ni yetti. Besh yettiga teng emas.",
      'Корень не раздаётся по слагаемым. Подставь f равное трём: слева девять плюс шестнадцать двадцать пять, корень пять; справа три плюс четыре, то есть семь. Пять не равно семи.',
      'A root does not distribute over terms. Substitute f equal to three: on the left nine plus sixteen is twenty five and the root is five; on the right three plus four is seven. Five is not seven.') },
    { when: (s) => s.miss.indexOf('i3') !== -1 || s.miss.indexOf('i5') !== -1, text: L(
      "Bu tenglikni chetlab o'tdingiz. f ni minus ikkiga qo'yib ikki tomonni ham sanang: chap va o'ng tomon bir xil chiqadi. Kvadrat nomanfiy bo'lgani uchun modul kerak emas.",
      'Это равенство осталось в стороне. Подставь f равное минус двум и посчитай обе части: они выйдут одинаковыми. Модуль не нужен, потому что квадрат неотрицателен.',
      'This equality was left out. Substitute f equal to minus two and compute both sides: they come out the same. No modulus is needed because the square is non-negative.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta tenglik kerak. Har birini ikki qiymatda tekshiring: minus uch va uch. Ikkalasida ham to'g'ri chiqsa, tenglik har qanday f da to'g'ri.",
      'Нужно ровно три равенства. Проверяй каждое при двух значениях: минус три и три. Если верно в обоих, равенство верно при любом f.',
      'Exactly three equalities are needed. Test each at two values: minus three and three. If it holds at both, the equality holds for every f.') },
  ],
  wrongText: L(
    "Har tenglikni MANFIY qiymatda tekshiring — aynan shu yerda modul kerakligi ko'rinadi.",
    'Проверяй каждое равенство при ОТРИЦАТЕЛЬНОМ значении — именно там видно, нужен ли модуль.',
    'Test every equality at a NEGATIVE value — that is where the need for the modulus shows.'),
};

export default function D11_05(props) { return <MarkAll data={DATA} {...props} />; }
