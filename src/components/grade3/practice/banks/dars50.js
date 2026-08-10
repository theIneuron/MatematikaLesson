// Dars 50 amaliyoti — Doiraviy diagramma va ma'lumot.
// Nazariya: src/components/grade3/Dars50.jsx (num-3-50).
// Doira — butun, sektor — uning qismi, qismlar yig'indisi butunga teng; bir xil ulush
// har xil butunda har xil son beradi (8 ning yarmi 4, 20 niki 10).
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 dnd · 3 multi · 4 match · 5 order · 6 input · 7 choice · 8 input · 9 match · 10 dnd
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS50_BANK = {
  title: 'Dars 50 · Doiraviy diagramma',
  items: [

    /* 1 · order · 🟢 — diagrammani o'qish qadamlari. */
    q('01', 'Diagrammani o\'qiymiz', '🟢', 'd50-steps', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "Doiraviy diagrammada butun 12 kristall, ko'k sektor yarmini egallagan.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Javob: 6 kristall', 'Butun nechaga tengligini bilaman: 12', 'Sektor qaysi ulush ekanini ko\'raman: yarmi'],
        y: "Avval butunni bilamiz, keyin sektor qaysi ulush ekanini ko'ramiz, oxirida ulushni hisoblaymiz.",
        n: 'Ulushni hisoblashdan oldin nimani bilish kerak?',
        r: 'Doira — butun, sektor — uning qismi.',
      },
      {
        e: 'Три шага', s: 'На круговой диаграмме целое это 12 кристаллов, синий сектор занимает половину.',
        a: 'Выбери шаги по порядку.',
        o: ['Ответ: 6 кристаллов', 'Узнаю, чему равно целое: 12', 'Смотрю, какая это доля: половина'],
        y: 'Сначала узнаём целое, потом смотрим, какая это доля, в конце считаем.',
        n: 'Что нужно узнать до подсчёта доли?',
        r: 'Круг это целое, сектор это его часть.',
      }),

    /* 2 · dnd · 🟢 — butun yoki qism. */
    q('02', 'Butunmi yoki qism?', '🟢', 'd50-whole-part', 'dnd', '🥧', [0, 1, 0, 1],
      {
        e: 'Diagrammada nima nima', s: "Doiraviy diagrammada butun ham, qismlar ham bor.",
        a: 'Yozuvlarni ajrating: qaysilari butunni, qaysilari qismni bildiradi.',
        tokens: ['Butun doira', 'Ko\'k sektor', 'Omborda jami', 'Yarmi'],
        zones: ['Butun', 'Qism'],
        dndHint: 'Yozuvlar tugadi.',
        y: "Butun doira va «omborda jami» bu hammasi birga. Sektor va yarmi esa butundan olingan qism.",
        n: 'Bu hammasi birgami yoki undan olingan bo\'lakmi?',
        r: 'Butun doira hammasini, sektor esa undan olingan ulushni bildiradi.',
      },
      {
        e: 'Что есть что на диаграмме', s: 'На круговой диаграмме есть и целое, и части.',
        a: 'Разложи записи: какие означают целое, а какие часть.',
        tokens: ['Весь круг', 'Синий сектор', 'Всего на складе', 'Половина'],
        zones: ['Целое', 'Часть'],
        dndHint: 'Записи закончились.',
        y: 'Весь круг и «всего на складе» это всё вместе. А сектор и половина — часть, взятая от целого.',
        n: 'Это всё вместе или кусок, взятый от целого?',
        r: 'Весь круг означает всё, а сектор — долю, взятую от него.',
      }),

    /* 3 · multi · 🟢 — to'g'ri gaplar. */
    q('03', 'To\'g\'ri gaplar', '🟢', 'd50-true-facts', 'multi', '✅', [0, 2],
      {
        e: 'Diagramma qoidalari', s: "To'rtta gap. Ikkitasi to'g'ri.",
        a: 'Qaysi gaplar to\'g\'ri? Hammasini belgilang.',
        o: [
          'Qismlar yig\'indisi butunga teng',
          'Eng katta sektor bu butun doira',
          'Sektorlar soni har xil bo\'lishi mumkin',
          'Butun har doim 12 ga teng',
        ],
        y: "Qismlar rosa butunga yig'iladi. Sektor uchta, to'rtta, xohlagancha bo'lishi mumkin. Eng katta qism esa baribir bitta sektor.",
        n: 'Har gapni diagramma bilan solishtiring: qismlar butunni to\'ldiradimi?',
        r: 'Qismlar yig\'indisi butunga teng, ko\'p ham emas, kam ham emas.',
      },
      {
        e: 'Правила диаграммы', s: 'Четыре утверждения. Два из них верны.',
        a: 'Какие утверждения верны? Отметь все.',
        o: [
          'Сумма частей равна целому',
          'Самый большой сектор это весь круг',
          'Число секторов может быть разным',
          'Целое всегда равно 12',
        ],
        y: 'Части складываются ровно в целое. Секторов может быть три, четыре, сколько угодно. А самая большая часть всё равно один сектор.',
        n: 'Сверь каждое утверждение с диаграммой: заполняют ли части целое?',
        r: 'Сумма частей равна целому, не больше и не меньше.',
      }),

    /* 4 · match · 🟡 — sektor va son. */
    q('04', 'Sektor va son', '🟡', 'd50-match-sector', 'match', '🔗', [0, 1, 2],
      {
        e: 'Butun 12', s: "Omborda jami 12 kristall, bu butun doira.",
        a: 'Har sektorni uning kristallar soniga ulang.',
        left: ['Yarmi', 'To\'rtdan biri', 'Uchdan biri'],
        right: ['6', '3', '4'],
        y: '12 : 2 = 6, 12 : 4 = 3, 12 : 3 = 4.',
        n: 'Butunni ulushning maxrajiga bo\'ling.',
        r: 'Sektor qiymati: butunni maxrajga bo\'lamiz.',
      },
      {
        e: 'Целое 12', s: 'На складе всего 12 кристаллов, это весь круг.',
        a: 'Соедини каждый сектор с числом кристаллов.',
        left: ['Половина', 'Четверть', 'Треть'],
        right: ['6', '3', '4'],
        y: '12 : 2 = 6, 12 : 4 = 3, 12 : 3 = 4.',
        n: 'Раздели целое на знаменатель доли.',
        r: 'Значение сектора: целое делим на знаменатель.',
      }),

    /* 5 · order · 🟡 — sektorlar tartibi. */
    q('05', 'Sektorlar tartibi', '🟡', 'd50-sort-sectors', 'order', '📈', [2, 1, 0, 3],
      {
        e: 'Butun 24', s: "Butun doira 24 kristall. To'rtta sektor berilgan.",
        a: 'Sektorlarni kristallar soni bo\'yicha kamidan ko\'piga tartiblang.',
        o: ['Uchdan biri', 'To\'rtdan biri', 'Oltidan biri', 'Yarmi'],
        y: '24 : 6 = 4, 24 : 4 = 6, 24 : 3 = 8, 24 : 2 = 12. Maxraj katta bo\'lsa, sektor kichik.',
        n: 'Har ulush uchun butunni maxrajga bo\'ling.',
        r: 'Maxraj katta bo\'lsa, sektor kichikroq chiqadi.',
      },
      {
        e: 'Целое 24', s: 'Весь круг это 24 кристалла. Даны четыре сектора.',
        a: 'Расставь секторы по числу кристаллов от меньшего к большему.',
        o: ['Треть', 'Четверть', 'Шестая часть', 'Половина'],
        y: '24 : 6 = 4, 24 : 4 = 6, 24 : 3 = 8, 24 : 2 = 12. Чем больше знаменатель, тем меньше сектор.',
        n: 'Для каждой доли раздели целое на знаменатель.',
        r: 'Чем больше знаменатель, тем меньше сектор.',
      }, undefined, {
        orderBy: "sektordagi kristallar soni bo'yicha",
      }),

    /* 6 · input · 🟡 — qolgan sektor. */
    q('06', 'Qolgan sektor', '🟡', 'd50-remaining', 'input', '🧩', ['5'],
      {
        e: 'Qismlar butunni to\'ldiradi', s: "Butun doira 20 kristall. Ko'k sektorda 8 ta, qizilida 7 ta.",
        a: 'Uchinchi sektorda nechta kristall bor?',
        y: "8 + 7 = 15, keyin 20 − 15 = 5 kristall. Qismlar rosa butunga yig'ilishi kerak.",
        n: 'Ma\'lum sektorlarni qo\'shing va butundan ayiring.',
        r: 'Qismlar yig\'indisi butunga teng.',
        p: 'Javob',
      },
      {
        e: 'Части заполняют целое', s: 'Весь круг это 20 кристаллов. В синем секторе 8, в красном 7.',
        a: 'Сколько кристаллов в третьем секторе?',
        y: '8 + 7 = 15, потом 20 − 15 = 5 кристаллов. Части должны сложиться ровно в целое.',
        n: 'Сложи известные секторы и вычти из целого.',
        r: 'Сумма частей равна целому.',
        p: 'Ответ',
      }, 'numeric'),

    /* 7 · choice · 🟡 — bir xil ulush, har xil butun. */
    q('07', 'Bir xil yarmi?', '🟡', 'd50-same-share', 'choice', '🔎', 1,
      {
        e: 'Eng ko\'p uchraydigan xato', s: "Ikki diagramma. Birinchisida butun 8, ikkinchisida 20. Ikkalasida ham ko'k sektor yarmini egallagan.",
        a: 'Ko\'k sektorlar teng kristall beradimi?',
        o: [
          'Ha, ikkalasi ham yarmi',
          'Yo\'q: birinchisida 4, ikkinchisida 10',
          'Ha, chunki sektorlar bir xil ko\'rinadi',
          'Aniqlab bo\'lmaydi',
        ],
        y: "8 ning yarmi 4, 20 niki esa 10. Ko'rinishi bir xil sektor butun har xil bo'lsa, har xil son beradi.",
        n: 'Har diagrammada butunni ikkiga bo\'ling va sonlarni solishtiring.',
        by: [
          "Ulush bir xil, lekin butun har xil — demak sonlar ham har xil.",
          undefined,
          "Ko'rinish aldaydi: son butunga bog'liq.",
          "Ikkala butun ham berilgan, demak hisoblash mumkin.",
        ],
        r: 'Bir xil ulush har xil butunda har xil son beradi.',
      },
      {
        e: 'Самая частая ошибка', s: 'Две диаграммы. В первой целое 8, во второй 20. В обеих синий сектор занимает половину.',
        a: 'Дают ли синие секторы одинаковое число кристаллов?',
        o: [
          'Да, обе половины',
          'Нет: в первой 4, во второй 10',
          'Да, ведь секторы выглядят одинаково',
          'Определить нельзя',
        ],
        y: 'Половина от 8 это 4, а от 20 это 10. Одинаковый на вид сектор при разном целом даёт разные числа.',
        n: 'В каждой диаграмме раздели целое пополам и сравни числа.',
        by: [
          'Доля одна и та же, но целое разное — значит и числа разные.',
          undefined,
          'Вид обманывает: число зависит от целого.',
          'Оба целых даны, значит посчитать можно.',
        ],
        r: 'Одинаковая доля при разном целом даёт разные числа.',
      }),

    /* 8 · input · 🔴 — butunni tiklash. */
    q('08', 'Butunni toping', '🔴', 'd50-find-whole', 'input', '🔁', ['18'],
      {
        e: 'Teskari yo\'l', s: "Diagrammada uchdan bir sektor 6 kristallga teng.",
        a: 'Butun doirada nechta kristall bor?',
        y: "Shunday sektor uchta. 6 ni 3 ga ko'paytiramiz, 18 kristall chiqadi.",
        n: 'Butunda shunday sektor nechta bor? Shuncha marta oling.',
        r: 'Ulush ma\'lum bo\'lsa, butun ko\'paytirish bilan topiladi.',
        p: 'Javob',
      },
      {
        e: 'Обратный путь', s: 'На диаграмме сектор в одну треть равен 6 кристаллам.',
        a: 'Сколько кристаллов во всём круге?',
        y: 'Таких секторов три. Умножаем 6 на 3, получается 18 кристаллов.',
        n: 'Сколько таких секторов в целом? Столько раз и возьми.',
        r: 'Если доля известна, целое находят умножением.',
        p: 'Ответ',
      }, 'numeric'),

    /* 9 · match · 🔴 — butun va yarmi. */
    q('09', 'Har xil butun', '🔴', 'd50-different-wholes', 'match', '🧩', [0, 1, 2],
      {
        e: 'Yarmi har xil', s: "Uch diagramma, har birida ko'k sektor yarmini egallagan.",
        a: 'Har butunni uning yarmiga ulang.',
        left: ['Butun 8', 'Butun 20', 'Butun 14'],
        right: ['4', '10', '7'],
        y: '8 : 2 = 4, 20 : 2 = 10, 14 : 2 = 7. Ulush bir xil, javoblar esa har xil.',
        n: 'Har butunni ikkiga bo\'ling.',
        r: 'Ulushning qiymati butunga bog\'liq.',
      },
      {
        e: 'Половины разные', s: 'Три диаграммы, в каждой синий сектор занимает половину.',
        a: 'Соедини каждое целое с его половиной.',
        left: ['Целое 8', 'Целое 20', 'Целое 14'],
        right: ['4', '10', '7'],
        y: '8 : 2 = 4, 20 : 2 = 10, 14 : 2 = 7. Доля одна и та же, а ответы разные.',
        n: 'Раздели каждое целое пополам.',
        r: 'Значение доли зависит от целого.',
      }),

    /* 10 · dnd · 🔴 — diagramma to'g'rimi. */
    q('10', 'Diagramma to\'g\'rimi?', '🔴', 'd50-check', 'dnd', '🚀', [0, 1, 0, 1],
      {
        e: 'Yakuniy mashq', s: "Butun 10 kristall. To'rtta diagramma taklif qilindi.",
        a: 'Diagrammalarni ajrating: qaysilari to\'g\'ri, qaysilari xato.',
        tokens: [
          'Sektorlar: 5, 3 va 2',
          'Sektorlar: 5, 3 va 4',
          'Sektorlar: 6 va 4',
          'Sektorlar: 6 va 3',
        ],
        zones: ["To'g'ri", 'Xato'],
        dndHint: 'Diagrammalar tugadi.',
        y: "5 + 3 + 2 = 10 va 6 + 4 = 10 — qismlar butunga yig'ildi. Qolganlarida 12 va 9 chiqadi.",
        n: 'Har diagrammada sektorlarni qo\'shing va butun bilan solishtiring.',
        r: 'Qismlar yig\'indisi butunga teng bo\'lishi shart.',
      },
      {
        e: 'Итоговое задание', s: 'Целое 10 кристаллов. Предложили четыре диаграммы.',
        a: 'Разложи диаграммы: какие верные, а какие с ошибкой.',
        tokens: [
          'Секторы: 5, 3 и 2',
          'Секторы: 5, 3 и 4',
          'Секторы: 6 и 4',
          'Секторы: 6 и 3',
        ],
        zones: ['Верно', 'Ошибка'],
        dndHint: 'Диаграммы закончились.',
        y: '5 + 3 + 2 = 10 и 6 + 4 = 10 — части сложились в целое. В остальных выходит 12 и 9.',
        n: 'В каждой диаграмме сложи секторы и сравни с целым.',
        r: 'Сумма частей обязана равняться целому.',
      }),
  ],
};

export default DARS50_BANK;
