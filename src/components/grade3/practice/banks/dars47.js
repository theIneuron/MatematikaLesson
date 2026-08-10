// Dars 47 amaliyoti — Tenglamalarni yechish.
// Nazariya: src/components/grade3/Dars47.jsx (num-3-47).
// Amal noma'lum qaysi komponent ekaniga qarab tanlanadi: qo'shiluvchi ayirib,
// kamayuvchi qo'shib, ayiriluvchi ayirib, ko'paytuvchi bo'lib topiladi;
// javob har doim tekshiriladi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 multi · 3 dnd · 4 input · 5 multi · 6 order · 7 match · 8 choice · 9 match · 10 input
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS47_BANK = {
  title: 'Dars 47 · Tenglamalarni yechish',
  items: [

    /* 1 · order · 🟢 — birinchi qadam savol. */
    q('01', 'Birinchi qadam', '🟢', 'd47-first-step', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "x + 6 = 14 tenglamasini yechamiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Tekshiraman: 8 + 6 = 14', 'Noma\'lum nima ekanini aniqlayman', 'Amalni tanlab hisoblayman: 14 − 6'],
        y: "Yechishning birinchi qadami hisob emas, savol: noma'lum nima ekani. Keyin amal tanlanadi, oxirida tekshiriladi.",
        n: 'Hisobdan oldin nimani aniqlash kerak?',
        r: 'Amal noma\'lum qaysi komponent ekaniga qarab tanlanadi.',
      },
      {
        e: 'Три шага', s: 'Решаем уравнение x + 6 = 14.',
        a: 'Выбери шаги по порядку.',
        o: ['Проверяю: 8 + 6 = 14', 'Определяю, чем является неизвестное', 'Выбираю действие и считаю: 14 − 6'],
        y: 'Первый шаг решения — не счёт, а вопрос: чем является неизвестное. Потом выбирают действие, в конце проверяют.',
        n: 'Что нужно определить до счёта?',
        r: 'Действие выбирают по тому, каким компонентом является неизвестное.',
      }),

    /* 2 · multi · 🟢 — noma'lum qo'shiluvchi. */
    q('02', 'Qaysilarida qo\'shiluvchi?', '🟢', 'd47-addend', 'multi', '🎯', [0, 2],
      {
        e: 'Noma\'lumning o\'rni', s: "To'rtta tenglama. Ikkitasida noma'lum qo'shiluvchi.",
        a: 'Qaysi tenglamalarda noma\'lum qo\'shiluvchi? Hammasini belgilang.',
        o: ['x + 5 = 12', 'x − 5 = 12', '4 + x = 9', 'x · 5 = 20'],
        y: "x + 5 va 4 + x da iks qo'shilyapti, demak u qo'shiluvchi. Qolganlarida kamayuvchi va ko'paytuvchi.",
        n: 'Iks qo\'shilyaptimi, ayirilyaptimi yoki ko\'paytirilyaptimi?',
        r: 'Iks qo\'shilsa, u qo\'shiluvchi bo\'ladi.',
      },
      {
        e: 'Место неизвестного', s: 'Четыре уравнения. В двух неизвестное — слагаемое.',
        a: 'В каких уравнениях неизвестное является слагаемым? Отметь все.',
        o: ['x + 5 = 12', 'x − 5 = 12', '4 + x = 9', 'x · 5 = 20'],
        y: 'В x + 5 и 4 + x икс прибавляют, значит он слагаемое. В остальных это уменьшаемое и множитель.',
        n: 'Икс прибавляют, вычитают или умножают?',
        r: 'Если икс прибавляют, он слагаемое.',
      }),

    /* 3 · dnd · 🟢 — qo'shish yoki ayirish. */
    q('03', 'Qaysi amal kerak?', '🟢', 'd47-which-action', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Belgi hal qiladi', s: "To'rtta tenglama. Amal noma'lumning o'rniga bog'liq.",
        a: 'Tenglamalarni ajrating: qaysilari ayirish, qaysilari qo\'shish bilan yechiladi.',
        tokens: ['x + 6 = 14', 'x − 6 = 14', 'x + 3 = 10', 'x − 3 = 10'],
        zones: ['Ayirish bilan', 'Qo\'shish bilan'],
        dndHint: 'Tenglamalar tugadi.',
        y: "Noma'lum qo'shiluvchi ayirish bilan, noma'lum kamayuvchi qo'shish bilan topiladi.",
        n: 'Iks qo\'shiluvchimi yoki kamayuvchimi? Amal shundan chiqadi.',
        r: 'Qo\'shiluvchi ayirib, kamayuvchi qo\'shib topiladi.',
      },
      {
        e: 'Решает знак', s: 'Четыре уравнения. Действие зависит от места неизвестного.',
        a: 'Разложи уравнения: какие решают вычитанием, а какие сложением.',
        tokens: ['x + 6 = 14', 'x − 6 = 14', 'x + 3 = 10', 'x − 3 = 10'],
        zones: ['Вычитанием', 'Сложением'],
        dndHint: 'Уравнения закончились.',
        y: 'Неизвестное слагаемое находят вычитанием, неизвестное уменьшаемое сложением.',
        n: 'Икс это слагаемое или уменьшаемое? Отсюда и действие.',
        r: 'Слагаемое находят вычитанием, уменьшаемое сложением.',
      }),

    /* 4 · input · 🟡 — noma'lum kamayuvchi. */
    q('04', 'Noma\'lum kamayuvchi', '🟡', 'd47-minuend', 'input', '🔢', ['20'],
      {
        e: 'Belgi boshqa', s: "x − 6 = 14 tenglamasi berilgan.",
        a: 'Ildizi nechaga teng?',
        y: "14 + 6 = 20. Tekshiramiz: 20 − 6 = 14, tenglik to'g'ri.",
        n: 'Iks birinchi turibdi va undan ayirilyapti. Kamayuvchi qanday topiladi?',
        r: 'Noma\'lum kamayuvchi qo\'shish bilan topiladi.',
        p: 'Javob',
      },
      {
        e: 'Знак другой', s: 'Дано уравнение x − 6 = 14.',
        a: 'Чему равен корень?',
        y: '14 + 6 = 20. Проверяем: 20 − 6 = 14, равенство верное.',
        n: 'Икс стоит первым, из него вычитают. Как находят уменьшаемое?',
        r: 'Неизвестное уменьшаемое находят сложением.',
        p: 'Ответ',
      }, 'numeric'),

    /* 5 · multi · 🟡 — ildizi 8 bo'lganlar. */
    q('05', 'Ildizi 8', '🟡', 'd47-root-eight', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil ildiz', s: "To'rtta tenglama. Ikkitasining ildizi 8.",
        a: 'Qaysi tenglamalarning ildizi 8 ga teng? Hammasini belgilang.',
        o: ['x + 6 = 14', 'x − 6 = 14', 'x · 2 = 16', 'x : 2 = 16'],
        y: "8 + 6 = 14 va 8 · 2 = 16. Qolganlarida ildiz 20 va 32 chiqadi.",
        n: 'Har tenglamaga 8 ni qo\'yib ko\'ring.',
        r: 'Bir xil sonlar bilan yozilgan tenglamalarning ildizi har xil bo\'lishi mumkin.',
      },
      {
        e: 'Одинаковый корень', s: 'Четыре уравнения. У двух корень равен 8.',
        a: 'У каких уравнений корень равен 8? Отметь все.',
        o: ['x + 6 = 14', 'x − 6 = 14', 'x · 2 = 16', 'x : 2 = 16'],
        y: '8 + 6 = 14 и 8 · 2 = 16. У остальных корни 20 и 32.',
        n: 'Подставь 8 в каждое уравнение.',
        r: 'Уравнения с одинаковыми числами могут иметь разные корни.',
      }),

    /* 6 · order · 🟡 — ildiz bo'yicha tartib. */
    q('06', 'Ildizlar tartibi', '🟡', 'd47-sort-roots', 'order', '📈', [1, 3, 0, 2],
      {
        e: 'To\'rt tenglama', s: 'Har birining ildizini toping.',
        a: 'Tenglamalarni ildizi bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['x + 4 = 12', 'x + 7 = 10', 'x − 5 = 15', 'x · 3 = 18'],
        y: "x + 7 = 10 da ildiz 3, x · 3 = 18 da 6, x + 4 = 12 da 8, x − 5 = 15 da 20.",
        n: 'Har tenglamada noma\'lum komponentni aniqlab, ildizini toping.',
        r: 'Ildizni topgandan keyin sonlarni odatdagidek solishtiramiz.',
      },
      {
        e: 'Четыре уравнения', s: 'Найди корень каждого.',
        a: 'Расставь уравнения по корню от меньшего к большему.',
        o: ['x + 4 = 12', 'x + 7 = 10', 'x − 5 = 15', 'x · 3 = 18'],
        y: 'У x + 7 = 10 корень 3, у x · 3 = 18 корень 6, у x + 4 = 12 корень 8, у x − 5 = 15 корень 20.',
        n: 'В каждом уравнении определи компонент и найди корень.',
        r: 'После поиска корней числа сравнивают как обычно.',
      }, undefined, {
        orderBy: "ildiz bo'yicha, tenglamadagi sonlar bo'yicha emas",
      }),

    /* 7 · match · 🟡 — komponent va amal. */
    q('07', 'Komponent va amal', '🟡', 'd47-match-component', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch holat', s: 'Noma\'lum har tenglamada boshqa komponent.',
        a: 'Har komponentni uni topadigan amalga ulang.',
        left: ['Noma\'lum qo\'shiluvchi', 'Noma\'lum kamayuvchi', 'Noma\'lum ko\'paytuvchi'],
        right: ['Ayirish', 'Qo\'shish', 'Bo\'lish'],
        y: "Qo'shiluvchi ayirib, kamayuvchi qo'shib, ko'paytuvchi bo'lib topiladi.",
        n: 'Har komponent uchun teskari amalni eslang.',
        r: 'Noma\'lumni topish usuli uning komponentiga bog\'liq.',
      },
      {
        e: 'Три случая', s: 'Неизвестное в каждом уравнении — другой компонент.',
        a: 'Соедини каждый компонент с действием, которое его находит.',
        left: ['Неизвестное слагаемое', 'Неизвестное уменьшаемое', 'Неизвестный множитель'],
        right: ['Вычитание', 'Сложение', 'Деление'],
        y: 'Слагаемое находят вычитанием, уменьшаемое сложением, множитель делением.',
        n: 'Вспомни обратное действие для каждого компонента.',
        r: 'Способ поиска неизвестного зависит от его компонента.',
      }),

    /* 8 · choice · 🔴 — noma'lum ayiriluvchi. */
    q('08', 'Noma\'lum ayiriluvchi', '🔴', 'd47-subtrahend', 'choice', '🔎', 1,
      {
        e: 'Iks ikkinchi turibdi', s: "12 − x = 5 tenglamasi berilgan.",
        a: 'Ildizi nechaga teng?',
        o: ['17', '7', '5', '12'],
        y: "12 − 7 = 5. Noma'lum ayiriluvchi kamayuvchidan ayirmani ayirish bilan topiladi.",
        n: 'Bu yerda iks kamayuvchi emas, ayiriluvchi: u ikkinchi turibdi.',
        by: [
          "Bu qo'shish natijasi. Lekin iks kamayuvchi emas, ayiriluvchi.",
          undefined,
          "Bu ayirmaning o'zi, noma'lum emas.",
          "Bu kamayuvchi, u allaqachon ma'lum.",
        ],
        r: 'Noma\'lum ayiriluvchi: kamayuvchidan ayirmani ayiramiz.',
      },
      {
        e: 'Икс стоит вторым', s: 'Дано уравнение 12 − x = 5.',
        a: 'Чему равен корень?',
        o: ['17', '7', '5', '12'],
        y: '12 − 7 = 5. Неизвестное вычитаемое находят, вычитая разность из уменьшаемого.',
        n: 'Здесь икс не уменьшаемое, а вычитаемое: он стоит вторым.',
        by: [
          'Это результат сложения. Но икс здесь не уменьшаемое, а вычитаемое.',
          undefined,
          'Это сама разность, а не неизвестное.',
          'Это уменьшаемое, оно и так известно.',
        ],
        r: 'Неизвестное вычитаемое: из уменьшаемого вычитаем разность.',
      }),

    /* 9 · match · 🔴 — tenglama va ildiz. */
    q('09', 'Tenglama va ildiz', '🔴', 'd47-match-root', 'match', '🧩', [0, 1, 2],
      {
        e: 'Sonlar bir xil', s: "Uch tenglamada bir xil sonlar, lekin amallar har xil.",
        a: 'Har tenglamani uning ildiziga ulang.',
        left: ['x + 6 = 18', 'x − 6 = 18', 'x · 6 = 18'],
        right: ['12', '24', '3'],
        y: '18 − 6 = 12, 18 + 6 = 24, 18 : 6 = 3. Sonlar bir xil, ildizlar esa butunlay boshqa.',
        n: 'Har tenglamada noma\'lum qaysi komponent ekanini aniqlang.',
        r: 'Amal noma\'lumning komponentiga qarab tanlanadi.',
      },
      {
        e: 'Числа одинаковые', s: 'В трёх уравнениях одни и те же числа, но разные действия.',
        a: 'Соедини каждое уравнение с его корнем.',
        left: ['x + 6 = 18', 'x − 6 = 18', 'x · 6 = 18'],
        right: ['12', '24', '3'],
        y: '18 − 6 = 12, 18 + 6 = 24, 18 : 6 = 3. Числа одни и те же, а корни совсем разные.',
        n: 'Определи в каждом уравнении, каким компонентом является неизвестное.',
        r: 'Действие выбирают по компоненту неизвестного.',
      }),

    /* 10 · input · 🔴 — noma'lum ko'paytuvchi. */
    q('10', 'Noma\'lum ko\'paytuvchi', '🔴', 'd47-factor', 'input', '🚀', ['5'],
      {
        e: 'Yakuniy mashq', s: "x · 4 = 20 tenglamasi berilgan.",
        a: 'Ildizi nechaga teng?',
        y: "20 : 4 = 5. Tekshiramiz: 5 · 4 = 20, tenglik to'g'ri.",
        n: 'Ko\'paytirish sonni oshiradi, demak iks yigirmadan kichik. Teskari amalni oling.',
        r: 'Noma\'lum ko\'paytuvchi bo\'lish bilan topiladi.',
        p: 'Javob',
      },
      {
        e: 'Итоговое задание', s: 'Дано уравнение x · 4 = 20.',
        a: 'Чему равен корень?',
        y: '20 : 4 = 5. Проверяем: 5 · 4 = 20, равенство верное.',
        n: 'Умножение увеличивает число, значит икс меньше двадцати. Возьми обратное действие.',
        r: 'Неизвестный множитель находят делением.',
        p: 'Ответ',
      }, 'numeric'),
  ],
};

export default DARS47_BANK;
