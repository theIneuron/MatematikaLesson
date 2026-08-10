// Dars 46 amaliyoti — Tenglama: noma'lumli tenglik.
// Nazariya: src/components/grade3/Dars46.jsx (num-3-46).
// Tenglama — noma'lumi bor tenglik (x + 3 = 10); ildiz — tenglikni to'g'ri qiladigan
// son; topilgan ildiz har doim qo'yib tekshiriladi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 dnd · 3 input · 4 order · 5 choice · 6 match · 7 multi · 8 input · 9 dnd · 10 multi
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS46_BANK = {
  title: 'Dars 46 · Tenglama',
  items: [

    /* 1 · match · 🟢 — tenglama va ildiz. */
    q('01', 'Tenglama va ildizi', '🟢', 'd46-match-root', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch tenglama', s: "Ildiz — tenglikni to'g'ri qiladigan son.",
        a: 'Har tenglamani uning ildiziga ulang.',
        left: ['x + 3 = 10', 'x + 5 = 9', 'x + 2 = 8'],
        right: ['7', '4', '6'],
        y: '7 + 3 = 10, 4 + 5 = 9, 6 + 2 = 8.',
        n: 'Har tenglamada qaysi son qo\'shilganda o\'ng tomon chiqadi?',
        r: 'Ildiz — tenglikni to\'g\'ri qiladigan son.',
      },
      {
        e: 'Три уравнения', s: 'Корень — это число, при котором равенство становится верным.',
        a: 'Соедини каждое уравнение с его корнем.',
        left: ['x + 3 = 10', 'x + 5 = 9', 'x + 2 = 8'],
        right: ['7', '4', '6'],
        y: '7 + 3 = 10, 4 + 5 = 9, 6 + 2 = 8.',
        n: 'Какое число нужно прибавить, чтобы получить правую часть?',
        r: 'Корень — это число, при котором равенство становится верным.',
      }, undefined, {
        en: {
          e: 'Three equations', s: 'The root is the number that makes the equality true.',
          a: 'Connect each equation with its root.',
          left: ['x + 3 = 10', 'x + 5 = 9', 'x + 2 = 8'],
          right: ['7', '4', '6'],
          y: '7 + 3 = 10, 4 + 5 = 9, 6 + 2 = 8.',
          n: 'Which number has to be added to get the right-hand side?',
          r: 'The root is the number that makes the equality true.',
        },
      }),

    /* 2 · dnd · 🟢 — tenglamami yoki yo'q. */
    q('02', 'Bu tenglamami?', '🟢', 'd46-is-equation', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: 'Ikki belgi kerak', s: "Tenglamada teng belgisi ham, noma'lum ham bo'lishi kerak.",
        a: 'Yozuvlarni ajrating: qaysilari tenglama, qaysilari emas.',
        tokens: ['x + 4 = 9', '5 + 3', 'x − 2 = 6', '8 > 5'],
        zones: ['Tenglama', 'Tenglama emas'],
        dndHint: 'Yozuvlar tugadi.',
        y: "Tenglamada teng belgisi va noma'lum bo'ladi. 5 + 3 bu ifoda, 8 > 5 esa tengsizlik.",
        n: 'Yozuvda teng belgisi bormi? Noma\'lum harf bormi?',
        r: 'Tenglama — noma\'lumi bor tenglik.',
      },
      {
        e: 'Нужны два признака', s: 'В уравнении должны быть и знак равенства, и неизвестное.',
        a: 'Разложи записи: какие уравнения, а какие нет.',
        tokens: ['x + 4 = 9', '5 + 3', 'x − 2 = 6', '8 > 5'],
        zones: ['Уравнение', 'Не уравнение'],
        dndHint: 'Записи закончились.',
        y: 'В уравнении есть знак равенства и неизвестное. 5 + 3 это выражение, а 8 > 5 неравенство.',
        n: 'Есть ли в записи знак равенства? Есть ли неизвестная буква?',
        r: 'Уравнение — это равенство с неизвестным.',
      }, undefined, {
        en: {
          e: 'Two signs are needed', s: 'An equation has to have both an equals sign and an unknown.',
          a: 'Sort the records: which ones are equations and which are not.',
          tokens: ['x + 4 = 9', '5 + 3', 'x − 2 = 6', '8 > 5'],
          zones: ['An equation', 'Not an equation'],
          dndHint: 'No records left.',
          y: 'An equation has an equals sign and an unknown. 5 + 3 is an expression and 8 > 5 is an inequality.',
          n: 'Does the record have an equals sign? Does it have an unknown letter?',
          r: 'An equation is an equality with an unknown.',
        },
      }),

    /* 3 · input · 🟢 — tarozi masalasi. */
    q('03', 'Tarozidagi yashik', '🟢', 'd46-scale', 'input', '⚖️', ['7'],
      {
        e: 'Tarozi tekis', s: "Chapda yashik va 3 kg tosh, o'ngda 10 kg tosh. Tarozi tekis turibdi.",
        a: 'Yashikda necha kilogramm bor?',
        y: "7 va 3 o'nni beradi, tarozi tenglashadi. Demak yashikda 7 kilogramm bor.",
        n: 'Uchga qanday son qo\'shilsa, o\'n chiqadi?',
        r: 'Tarozi tenglikni ko\'rsatadi: chap tomon o\'ng tomonga teng.',
        p: 'Javob',
      },
      {
        e: 'Весы ровные', s: 'Слева ящик и гиря 3 кг, справа гиря 10 кг. Весы стоят ровно.',
        a: 'Сколько килограммов в ящике?',
        y: 'Семь и три дают десять, весы уравновешиваются. Значит в ящике 7 килограммов.',
        n: 'Какое число нужно прибавить к трём, чтобы вышло десять?',
        r: 'Весы показывают равенство: левая часть равна правой.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The scales are level', s: 'On the left there is a box and a 3 kg weight, on the right a 10 kg weight. The scales are level.',
          a: 'How many kilograms are there in the box?',
          y: 'Seven and three make ten and the scales balance. So the box holds 7 kilograms.',
          n: 'Which number has to be added to three to make ten?',
          r: 'Scales show an equality: the left side equals the right side.',
          p: 'Answer',
        },
      }),

    /* 4 · order · 🟡 — yechim qadamlari. */
    q('04', 'Yechim qadamlari', '🟡', 'd46-steps', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "x + 3 = 10 tenglamasini yechamiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Tekshiraman: 7 + 3 = 10', 'Noma\'lumni topaman: 10 − 3', 'Ildiz 7 ga teng'],
        y: "Avval noma'lumni topamiz, keyin ildizni yozamiz, oxirida uni qo'yib tekshiramiz.",
        n: 'Tekshirish oxirida bo\'ladi: avval son topilishi kerak.',
        r: 'Topilgan ildiz har doim qo\'yib tekshiriladi.',
      },
      {
        e: 'Три шага', s: 'Решаем уравнение x + 3 = 10.',
        a: 'Выбери шаги по порядку.',
        o: ['Проверяю: 7 + 3 = 10', 'Нахожу неизвестное: 10 − 3', 'Корень равен 7'],
        y: 'Сначала находим неизвестное, потом пишем корень, в конце подставляем и проверяем.',
        n: 'Проверка идёт в конце: сначала нужно найти число.',
        r: 'Найденный корень всегда проверяют подстановкой.',
      }, undefined, {
        en: {
          e: 'Three steps', s: 'We are solving the equation x + 3 = 10.',
          a: 'Pick the steps in order.',
          o: ['I check: 7 + 3 = 10', 'I find the unknown: 10 − 3', 'The root is 7'],
          y: 'First we find the unknown, then we write the root, and at the end we put it back and check.',
          n: 'The check comes at the end: first the number has to be found.',
          r: 'A root that has been found is always checked by putting it back.',
        },
      }),

    /* 5 · choice · 🟡 — noma'lum qo'shiluvchi. */
    q('05', 'Noma\'lum qo\'shiluvchi', '🟡', 'd46-unknown-addend', 'choice', '🔒', 1,
      {
        e: 'Qanday topamiz?', s: "x + 6 = 15 tenglamasi berilgan.",
        a: 'Noma\'lum qo\'shiluvchini qanday topamiz?',
        o: ['15 ga 6 ni qo\'shamiz', '15 dan 6 ni ayiramiz', '15 ni 6 ga ko\'paytiramiz', '15 ni 6 ga bo\'lamiz'],
        y: "15 − 6 = 9. Noma'lum qo'shiluvchini topish uchun yig'indidan ma'lum qo'shiluvchi ayiriladi.",
        n: 'Yig\'indi ma\'lum, bitta qo\'shiluvchi ham. Ikkinchisi qanday topiladi?',
        by: [
          "Qo'shsak son kattalashadi, lekin x yig'indidan kichik bo'lishi kerak.",
          undefined,
          "Bu yerda ko'paytirish yo'q, tenglamada qo'shish turibdi.",
          "Bu yerda bo'lish yo'q, tenglamada qo'shish turibdi.",
        ],
        r: 'Noma\'lum qo\'shiluvchi: yig\'indidan ma\'lum qo\'shiluvchini ayiramiz.',
      },
      {
        e: 'Как находим?', s: 'Дано уравнение x + 6 = 15.',
        a: 'Как найти неизвестное слагаемое?',
        o: ['Прибавим 6 к 15', 'Вычтем 6 из 15', 'Умножим 15 на 6', 'Разделим 15 на 6'],
        y: '15 − 6 = 9. Чтобы найти неизвестное слагаемое, из суммы вычитают известное слагаемое.',
        n: 'Сумма известна и одно слагаемое тоже. Как найти второе?',
        by: [
          'При сложении число вырастет, а x должен быть меньше суммы.',
          undefined,
          'Здесь нет умножения, в уравнении стоит сложение.',
          'Здесь нет деления, в уравнении стоит сложение.',
        ],
        r: 'Неизвестное слагаемое: из суммы вычитаем известное слагаемое.',
      }, undefined, {
        en: {
          e: 'How do we find it?', s: 'Here is the equation x + 6 = 15.',
          a: 'How do you find an unknown addend?',
          o: ['Add 6 to 15', 'Subtract 6 from 15', 'Multiply 15 by 6', 'Divide 15 by 6'],
          y: '15 − 6 = 9. To find an unknown addend, the known addend is subtracted from the sum.',
          n: 'The sum is known and so is one addend. How do you find the other one?',
          by: [
            'Adding would make the number grow, but x has to be smaller than the sum.',
            undefined,
            'There is no multiplication here, the equation has an addition in it.',
            'There is no division here, the equation has an addition in it.',
          ],
          r: 'An unknown addend: subtract the known addend from the sum.',
        },
      }),

    /* 6 · match · 🟡 — tenglama va amal. */
    q('06', 'Qaysi amal yechadi?', '🟡', 'd46-match-action', 'match', '🧭', [0, 1, 2],
      {
        e: 'Uch tenglama', s: 'Har tenglamada noma\'lum o\'z o\'rnida turibdi.',
        a: 'Har tenglamani uni yechadigan amalga ulang.',
        left: ['x + 4 = 12', 'x − 5 = 8', 'x · 3 = 21'],
        right: ['12 − 4', '8 + 5', '21 : 3'],
        y: "Qo'shiluvchi ayirish bilan, kamayuvchi qo'shish bilan, ko'paytuvchi bo'lish bilan topiladi.",
        n: 'Har tenglamada noma\'lum qaysi komponent ekanini aniqlang.',
        r: 'Noma\'lumni topish usuli uning qaysi komponent ekaniga bog\'liq.',
      },
      {
        e: 'Три уравнения', s: 'В каждом уравнении неизвестное стоит на своём месте.',
        a: 'Соедини каждое уравнение с действием, которое его решает.',
        left: ['x + 4 = 12', 'x − 5 = 8', 'x · 3 = 21'],
        right: ['12 − 4', '8 + 5', '21 : 3'],
        y: 'Слагаемое находят вычитанием, уменьшаемое сложением, множитель делением.',
        n: 'Определи в каждом уравнении, каким компонентом является неизвестное.',
        r: 'Способ поиска неизвестного зависит от того, какой это компонент.',
      }, undefined, {
        en: {
          e: 'Three equations', s: 'In every equation the unknown stands in its own spot.',
          a: 'Connect each equation with the operation that solves it.',
          left: ['x + 4 = 12', 'x − 5 = 8', 'x · 3 = 21'],
          right: ['12 − 4', '8 + 5', '21 : 3'],
          y: 'An addend is found by subtracting, a minuend by adding and a factor by dividing.',
          n: 'Work out in every equation which part the unknown is.',
          r: 'How the unknown is found depends on which part it is.',
        },
      }),

    /* 7 · multi · 🟡 — ildizi 5 bo'lganlar. */
    q('07', 'Ildizi 5', '🟡', 'd46-root-five', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil ildiz', s: "To'rtta tenglama. Ikkitasining ildizi 5.",
        a: 'Qaysi tenglamalarning ildizi 5 ga teng? Hammasini belgilang.',
        o: ['x + 4 = 9', 'x + 4 = 10', 'x − 2 = 3', 'x − 2 = 4'],
        y: "5 + 4 = 9 va 5 − 2 = 3. Qolganlarida ildiz 6 chiqadi.",
        n: 'Har tenglamaga 5 ni qo\'yib ko\'ring va tenglikni tekshiring.',
        r: 'Ildizni qo\'yib tekshirish eng ishonchli yo\'l.',
      },
      {
        e: 'Одинаковый корень', s: 'Четыре уравнения. У двух корень равен 5.',
        a: 'У каких уравнений корень равен 5? Отметь все.',
        o: ['x + 4 = 9', 'x + 4 = 10', 'x − 2 = 3', 'x − 2 = 4'],
        y: '5 + 4 = 9 и 5 − 2 = 3. У остальных корень равен 6.',
        n: 'Подставь 5 в каждое уравнение и проверь равенство.',
        r: 'Подстановка корня — самый надёжный способ проверки.',
      }, undefined, {
        en: {
          e: 'The same root', s: 'Four equations. Two of them have the root 5.',
          a: 'Which equations have the root 5? Mark them all.',
          o: ['x + 4 = 9', 'x + 4 = 10', 'x − 2 = 3', 'x − 2 = 4'],
          y: '5 + 4 = 9 and 5 − 2 = 3. The others have the root 6.',
          n: 'Put 5 into every equation and check the equality.',
          r: 'Putting the root back is the surest way to check.',
        },
      }),

    /* 8 · input · 🔴 — noma'lum kamayuvchi. */
    q('08', 'Noma\'lum kamayuvchi', '🔴', 'd46-unknown-minuend', 'input', '🧩', ['13'],
      {
        e: 'Boshqa o\'rin', s: "x − 4 = 9 tenglamasi berilgan.",
        a: 'Ildizi nechaga teng?',
        y: "9 + 4 = 13. Tekshiramiz: 13 − 4 = 9, tenglik to'g'ri.",
        n: 'Ayirmadan katta sonni topish kerak: ayirmaga ayiriluvchini qo\'shing.',
        r: 'Noma\'lum kamayuvchi: ayirmaga ayiriluvchini qo\'shamiz.',
        p: 'Javob',
      },
      {
        e: 'Другое место', s: 'Дано уравнение x − 4 = 9.',
        a: 'Чему равен корень?',
        y: '9 + 4 = 13. Проверяем: 13 − 4 = 9, равенство верное.',
        n: 'Нужно найти число больше разности: прибавь вычитаемое к разности.',
        r: 'Неизвестное уменьшаемое: к разности прибавляем вычитаемое.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'A different spot', s: 'Here is the equation x − 4 = 9.',
          a: 'What is the root?',
          y: '9 + 4 = 13. We check: 13 − 4 = 9, the equality is true.',
          n: 'You need a number bigger than the difference: add the subtrahend to the difference.',
          r: 'An unknown minuend: add the subtrahend to the difference.',
          p: 'Answer',
        },
      }),

    /* 9 · dnd · 🔴 — tekshiruv mos keldimi. */
    q('09', 'Tekshiruv mos keldimi?', '🔴', 'd46-check', 'dnd', '🔎', [0, 1, 0, 1],
      {
        e: 'Ildizni qo\'yamiz', s: "To'rtta yechim. Ikkitasida ildiz noto'g'ri topilgan.",
        a: 'Yechimlarni ajrating: qaysilari to\'g\'ri, qaysilari xato.',
        tokens: [
          'x + 3 = 10, ildiz 7',
          'x + 3 = 10, ildiz 13',
          'x − 2 = 5, ildiz 7',
          'x − 2 = 5, ildiz 3',
        ],
        zones: ["To'g'ri", 'Xato'],
        dndHint: 'Yechimlar tugadi.',
        y: "7 + 3 = 10 va 7 − 2 = 5 — to'g'ri. 13 + 3 = 16 va 3 − 2 = 1 — tenglik chiqmadi.",
        n: 'Har ildizni tenglamaga qo\'ying va ikki tomonni solishtiring.',
        r: 'Ildiz qo\'yib tekshiriladi, tenglik mos tushishi kerak.',
      },
      {
        e: 'Подставляем корень', s: 'Четыре решения. В двух корень найден неверно.',
        a: 'Разложи решения: какие верные, а какие с ошибкой.',
        tokens: [
          'x + 3 = 10, корень 7',
          'x + 3 = 10, корень 13',
          'x − 2 = 5, корень 7',
          'x − 2 = 5, корень 3',
        ],
        zones: ['Верно', 'Ошибка'],
        dndHint: 'Решения закончились.',
        y: '7 + 3 = 10 и 7 − 2 = 5 — верно. А 13 + 3 = 16 и 3 − 2 = 1 — равенство не получилось.',
        n: 'Подставь каждый корень в уравнение и сравни обе части.',
        r: 'Корень проверяют подстановкой, равенство должно сойтись.',
      }, undefined, {
        en: {
          e: 'Putting the root back', s: 'Four solutions. In two of them the root was found wrongly.',
          a: 'Sort the solutions: which ones are right and which have a mistake.',
          tokens: ['x + 3 = 10, root 7', 'x + 3 = 10, root 13', 'x − 2 = 5, root 7', 'x − 2 = 5, root 3'],
          zones: ['Right', 'A mistake'],
          dndHint: 'No solutions left.',
          y: '7 + 3 = 10 and 7 − 2 = 5 are right. And 13 + 3 = 16 and 3 − 2 = 1 — the equality did not come out.',
          n: 'Put every root into its equation and compare both sides.',
          r: 'A root is checked by putting it back, and the equality has to work out.',
        },
      }),

    /* 10 · multi · 🔴 — to'g'ri gaplar. */
    q('10', 'To\'g\'ri gaplar', '🔴', 'd46-true-facts', 'multi', '🚀', [0, 2],
      {
        e: 'Yakuniy mashq', s: "To'rtta gap. Ikkitasi to'g'ri.",
        a: 'Qaysi gaplar to\'g\'ri? Hammasini belgilang.',
        o: [
          'Tenglamada noma\'lum bo\'lishi shart',
          'Tekshirish ortiqcha qadam',
          'Ildiz tenglikni to\'g\'ri qiladi',
          '8 > 5 ham tenglama',
        ],
        y: "Tenglamada noma'lum bo'ladi, ildiz esa tenglikni to'g'ri qiladi. Tekshirish yechimning bir qismi, 8 > 5 esa tengsizlik.",
        n: 'Har gapni ta\'rif bilan solishtiring: tenglik bormi, noma\'lum bormi?',
        r: 'Tenglama — noma\'lumi bor tenglik, ildiz uni to\'g\'ri qiladi.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре утверждения. Два из них верны.',
        a: 'Какие утверждения верны? Отметь все.',
        o: [
          'В уравнении обязательно есть неизвестное',
          'Проверка это лишний шаг',
          'Корень делает равенство верным',
          '8 > 5 тоже уравнение',
        ],
        y: 'В уравнении есть неизвестное, а корень делает равенство верным. Проверка — часть решения, а 8 > 5 это неравенство.',
        n: 'Сверь каждое утверждение с определением: есть равенство, есть неизвестное?',
        r: 'Уравнение — равенство с неизвестным, а корень делает его верным.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Four statements. Two of them are true.',
          a: 'Which statements are true? Mark them all.',
          o: ['An equation always has an unknown', 'The check is an extra step', 'The root makes the equality true', '8 > 5 is an equation too'],
          y: 'An equation has an unknown, and the root makes the equality true. The check is part of the solving, and 8 > 5 is an inequality.',
          n: 'Compare every statement with the definition: is there an equality, is there an unknown?',
          r: 'An equation is an equality with an unknown, and the root makes it true.',
        },
      }),
  ],
};

export default DARS46_BANK;
