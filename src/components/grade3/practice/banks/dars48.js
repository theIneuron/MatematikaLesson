// Dars 48 amaliyoti — Murakkab masalalar.
// Nazariya: src/components/grade3/Dars48.jsx (num-3-48).
// Murakkab masalada javob birdaniga topilmaydi: birinchi amal yashiringan sonni beradi,
// savolga esa oxirgi amal javob beradi; sonlar shartdan ma'nosiga qarab olinadi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 input · 2 dnd · 3 choice · 4 order · 5 dnd · 6 match · 7 input · 8 order · 9 multi · 10 match
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS48_BANK = {
  title: 'Dars 48 · Murakkab masalalar',
  items: [

    /* 1 · input · 🟢 — birinchi amal. */
    q('01', 'Birinchi amal', '🟢', 'd48-first-action', 'input', '1️⃣', ['24'],
      {
        e: 'Yashiringan son', s: "Birinchi savatda 8 kristall, ikkinchisida 3 marta ko'p.",
        a: 'Ikkinchi savatda nechta kristall bor?',
        y: "8 ni 3 ga ko'paytiramiz, 24 kristall chiqadi. Bu birinchi amal, javob emas.",
        n: '«Uch marta ko\'p» degani ko\'paytirish.',
        r: 'Birinchi amal yashiringan sonni beradi.',
        p: 'Javob',
      },
      {
        e: 'Спрятанное число', s: 'В первой корзине 8 кристаллов, во второй в 3 раза больше.',
        a: 'Сколько кристаллов во второй корзине?',
        y: 'Умножаем 8 на 3, получается 24 кристалла. Это первое действие, а не ответ.',
        n: '«В три раза больше» означает умножение.',
        r: 'Первое действие даёт спрятанное число.',
        p: 'Ответ',
      }, 'numeric'),

    /* 2 · dnd · 🟢 — bir yoki ikki amal. */
    q('02', 'Necha amal kerak?', '🟢', 'd48-how-many', 'dnd', '🗂️', [1, 0, 1, 0],
      {
        e: 'Savolga qarang', s: "To'rtta savol bitta shartga: 8 kristall va 3 marta ko'p.",
        a: 'Savollarni ajrating: qaysilariga bir amalda, qaysilariga ikki amalda javob beriladi.',
        tokens: [
          'Ikkala savatda jami nechta?',
          'Ikkinchi savatda nechta?',
          'Ikkinchisida birinchisidan nechta ko\'p?',
          'Birinchi savatda nechta?',
        ],
        zones: ['Bir amal', 'Ikki amal'],
        dndHint: 'Savollar tugadi.',
        y: "Birinchi savat shartda berilgan, ikkinchisi bitta ko'paytirish bilan topiladi. Jami va farq esa ikki amal talab qiladi.",
        n: 'Savolga javob berish uchun yetadigan son bormi yoki uni avval topish kerakmi?',
        r: 'Ikki amalli savolda avval yashiringan son topiladi.',
      },
      {
        e: 'Смотри на вопрос', s: 'Четыре вопроса к одному условию: 8 кристаллов и в 3 раза больше.',
        a: 'Разложи вопросы: на какие отвечают одним действием, а на какие двумя.',
        tokens: [
          'Сколько всего в двух корзинах?',
          'Сколько во второй корзине?',
          'На сколько во второй больше, чем в первой?',
          'Сколько в первой корзине?',
        ],
        zones: ['Одно действие', 'Два действия'],
        dndHint: 'Вопросы закончились.',
        y: 'Первая корзина дана в условии, вторая находится одним умножением. А «всего» и «на сколько больше» требуют двух действий.',
        n: 'Есть ли число, которого хватает для ответа, или его надо сначала найти?',
        r: 'В вопросе на два действия сначала находят спрятанное число.',
      }),

    /* 3 · choice · 🟢 — jami nechta. */
    q('03', 'Jami nechta?', '🟢', 'd48-total', 'choice', '🔒', 2,
      {
        e: 'Ikkinchi amal', s: "Birinchi savatda 8 kristall, ikkinchisida 24 ta.",
        a: 'Ikkala savatda jami nechta kristall bor?',
        o: ['24', '16', '32', '8'],
        y: "8 + 24 = 32 kristall. Savolga javob beradigan aynan shu oxirgi amal.",
        n: 'Ikkala savatdagi sonlarni qo\'shing.',
        by: [
          "Bu faqat ikkinchi savat. Birinchisi ham hisobga olinishi kerak.",
          "Bu ikkinchi savat bilan birinchisining farqi, jami emas.",
          undefined,
          "Bu faqat birinchi savat.",
        ],
        r: 'Savolga oxirgi amal javob beradi.',
      },
      {
        e: 'Второе действие', s: 'В первой корзине 8 кристаллов, во второй 24.',
        a: 'Сколько кристаллов всего в двух корзинах?',
        o: ['24', '16', '32', '8'],
        y: '8 + 24 = 32 кристалла. Именно это последнее действие и отвечает на вопрос.',
        n: 'Сложи числа из обеих корзин.',
        by: [
          'Это только вторая корзина. Первую тоже нужно учесть.',
          'Это разница между корзинами, а не общее число.',
          undefined,
          'Это только первая корзина.',
        ],
        r: 'На вопрос отвечает последнее действие.',
      }),

    /* 4 · order · 🟡 — yechim rejasi. */
    q('04', 'Yechim rejasi', '🟡', 'd48-plan', 'order', '🪜', [2, 0, 1],
      {
        e: 'Uch qadam', s: "Masala: 8 kristall, ikkinchisida 3 marta ko'p, jami nechta?",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['8 · 3 = 24 — ikkinchi savat', '8 + 24 = 32 — javob', 'Savol jami haqida, demak ikki amal kerak'],
        y: "Yechish hisobdan emas, rejadan boshlanadi: avval savolga qaraymiz, keyin yashiringan sonni topamiz, oxirida javob beramiz.",
        n: 'Hisobdan oldin nimani aniqlash kerak?',
        r: 'Yechish rejadan boshlanadi, hisobdan emas.',
      },
      {
        e: 'Три шага', s: 'Задача: 8 кристаллов, во второй в 3 раза больше, сколько всего?',
        a: 'Выбери шаги по порядку.',
        o: ['8 · 3 = 24 — вторая корзина', '8 + 24 = 32 — ответ', 'Вопрос про «всего», значит нужны два действия'],
        y: 'Решение начинается не со счёта, а с плана: сначала смотрим на вопрос, потом находим спрятанное число, в конце отвечаем.',
        n: 'Что нужно определить до счёта?',
        r: 'Решение начинается с плана, а не со счёта.',
      }),

    /* 5 · dnd · 🟡 — birinchi amal qaysi. */
    q('05', 'Birinchi amal qaysi?', '🟡', 'd48-first-op', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Shartga qarang', s: "To'rtta masala. Birinchi amal har xil.",
        a: 'Masalalarni ajrating: qaysilari ko\'paytirishdan, qaysilari qo\'shishdan boshlanadi.',
        tokens: [
          '8 ta, ikkinchisida 3 marta ko\'p',
          '8 ta va yana 5 ta keldi, hammasi 4 rafga',
          '6 ta, ikkinchisida 2 marta ko\'p',
          '12 ta va yana 8 ta keldi, hammasi 5 qutiga',
        ],
        zones: ['Ko\'paytirishdan', 'Qo\'shishdan'],
        dndHint: 'Masalalar tugadi.',
        y: "«Marta ko'p» ko'paytirishni, «yana keldi» esa qo'shishni beradi.",
        n: 'Shartda «marta ko\'p» bormi yoki miqdorlar qo\'shilyaptimi?',
        r: 'Sonlar shartdan ma\'nosiga qarab olinadi.',
      },
      {
        e: 'Смотри на условие', s: 'Четыре задачи. Первое действие в них разное.',
        a: 'Разложи задачи: какие начинают с умножения, а какие со сложения.',
        tokens: [
          '8 штук, во второй в 3 раза больше',
          '8 штук и ещё 5 привезли, всё на 4 полки',
          '6 штук, во второй в 2 раза больше',
          '12 штук и ещё 8 привезли, всё в 5 коробок',
        ],
        zones: ['С умножения', 'Со сложения'],
        dndHint: 'Задачи закончились.',
        y: '«В раза больше» даёт умножение, а «ещё привезли» — сложение.',
        n: 'Есть ли в условии «в раза больше» или количества складываются?',
        r: 'Числа берут из условия по смыслу.',
      }),

    /* 6 · match · 🟡 — savol va javob. */
    q('06', 'Bitta shart, uch savol', '🟡', 'd48-one-condition', 'match', '🔗', [0, 1, 2],
      {
        e: 'Savol javobni tanlaydi', s: "Birinchi savatda 8 kristall, ikkinchisida 3 marta ko'p.",
        a: 'Har savolni uning javobiga ulang.',
        left: ['Ikkinchisida nechta?', 'Jami nechta?', 'Ikkinchisida nechta ko\'p?'],
        right: ['24', '32', '16'],
        y: "8 · 3 = 24; 8 + 24 = 32; 24 − 8 = 16. Bitta shart har xil javob beradi, chunki savollar har xil.",
        n: 'Har savolda qayerda to\'xtash kerakligini aniqlang.',
        r: 'Qayerda to\'xtashni savol hal qiladi.',
      },
      {
        e: 'Вопрос выбирает ответ', s: 'В первой корзине 8 кристаллов, во второй в 3 раза больше.',
        a: 'Соедини каждый вопрос с его ответом.',
        left: ['Сколько во второй?', 'Сколько всего?', 'На сколько во второй больше?'],
        right: ['24', '32', '16'],
        y: '8 · 3 = 24; 8 + 24 = 32; 24 − 8 = 16. Одно условие даёт разные ответы, потому что вопросы разные.',
        n: 'В каждом вопросе определи, где нужно остановиться.',
        r: 'Где остановиться, решает вопрос.',
      }),

    /* 7 · input · 🟡 — o'z masalasi. */
    q('07', 'Kitoblar', '🟡', 'd48-books', 'input', '📚', ['45'],
      {
        e: 'Ikki qadam', s: "Birinchi javonda 9 kitob, ikkinchisida 4 marta ko'p.",
        a: 'Ikkala javonda jami nechta kitob bor?',
        y: "Avval ikkinchi javon: 9 · 4 = 36. Keyin jami: 9 + 36 = 45 kitob.",
        n: 'Avval ikkinchi javondagi sonni toping, keyin ikkalasini qo\'shing.',
        r: 'Birinchi amal yashiringan sonni beradi, oxirgisi javobni.',
        p: 'Javob',
      },
      {
        e: 'Два шага', s: 'На первой полке 9 книг, на второй в 4 раза больше.',
        a: 'Сколько книг всего на двух полках?',
        y: 'Сначала вторая полка: 9 · 4 = 36. Потом всего: 9 + 36 = 45 книг.',
        n: 'Сначала найди число на второй полке, потом сложи обе.',
        r: 'Первое действие даёт спрятанное число, последнее — ответ.',
        p: 'Ответ',
      }, 'numeric'),

    /* 8 · order · 🔴 — javob bo'yicha tartib. */
    q('08', 'Javoblar tartibi', '🔴', 'd48-sort-answers', 'order', '📈', [1, 2, 0, 3],
      {
        e: 'To\'rt masala', s: 'Har birini yeching va javoblarni solishtiring.',
        o: ['5 ta, 3 marta ko\'p, jami?', '4 ta, 2 marta ko\'p, jami?', '6 ta, 2 marta ko\'p, jami?', '9 ta, 4 marta ko\'p, jami?'],
        a: 'Masalalarni javobi bo\'yicha kichigidan kattasiga tartiblang.',
        y: '4 + 8 = 12, keyin 6 + 12 = 18, keyin 5 + 15 = 20, oxirida 9 + 36 = 45.',
        n: 'Har masalada avval ikkinchi sonni toping, keyin qo\'shing.',
        r: 'Ikki amalli masalada javob faqat oxirgi amaldan chiqadi.',
      },
      {
        e: 'Четыре задачи', s: 'Реши каждую и сравни ответы.',
        o: ['5 штук, в 3 раза больше, всего?', '4 штуки, в 2 раза больше, всего?', '6 штук, в 2 раза больше, всего?', '9 штук, в 4 раза больше, всего?'],
        a: 'Расставь задачи по ответу от меньшего к большему.',
        y: '4 + 8 = 12, потом 6 + 12 = 18, потом 5 + 15 = 20, в конце 9 + 36 = 45.',
        n: 'В каждой задаче сначала найди второе число, потом складывай.',
        r: 'В задаче в два действия ответ даёт только последнее действие.',
      }, undefined, {
        orderBy: "masala javobi bo'yicha",
      }),

    /* 9 · multi · 🔴 — yetarli ma'lumot. */
    q('09', 'Javob berish mumkinmi?', '🔴', 'd48-answerable', 'multi', '❓', [0, 2],
      {
        e: 'Shartga qarang', s: "Birinchi savatda 8 kristall, ikkinchisida 3 marta ko'p. Boshqa hech narsa aytilmagan.",
        a: 'Qaysi savollarga javob berish MUMKIN? Hammasini belgilang.',
        o: [
          'Ikkala savatda jami nechta?',
          'Kristallar qanday rangda?',
          'Ikkinchisida nechta ko\'p?',
          'Savatlar qancha turadi?',
        ],
        y: "Sonlar berilgan, demak jami va farqni topish mumkin. Rang va narx haqida ma'lumot yo'q.",
        n: 'Shartda faqat kristallar soni berilgan. Ulardan nimani hisoblash mumkin?',
        r: 'Javob berish uchun shartda yetarli ma\'lumot bo\'lishi kerak.',
      },
      {
        e: 'Смотри на условие', s: 'В первой корзине 8 кристаллов, во второй в 3 раза больше. Больше ничего не сказано.',
        a: 'На какие вопросы МОЖНО ответить? Отметь все.',
        o: [
          'Сколько всего в двух корзинах?',
          'Какого цвета кристаллы?',
          'На сколько во второй больше?',
          'Сколько стоят корзины?',
        ],
        y: 'Числа даны, значит можно найти и общее количество, и разницу. О цвете и цене данных нет.',
        n: 'В условии дано только число кристаллов. Что из этого можно посчитать?',
        r: 'Чтобы ответить, в условии должно хватать данных.',
      }),

    /* 10 · match · 🔴 — masala va birinchi amal. */
    q('10', 'Birinchi amal', '🔴', 'd48-match-first', 'match', '🚀', [0, 1, 2],
      {
        e: 'Yakuniy mashq', s: 'Har masalada birinchi qadamda o\'z amali bajariladi.',
        a: 'Har masalani birinchi amaliga ulang.',
        left: [
          '7 ta, ikkinchisida 2 marta ko\'p, jami?',
          '10 ta va yana 6 ta keldi, 4 rafga teng?',
          '20 tani 4 rafga, keyin har rafga 3 tadan qo\'shildi?',
        ],
        right: ['Ko\'paytirish', 'Qo\'shish', 'Bo\'lish'],
        y: "«Marta ko'p» ko'paytirish, «yana keldi» qo'shish, «teng taqsimlash» esa bo'lish beradi.",
        n: 'Shartning boshiga qarang: u qanday amalni talab qiladi?',
        r: 'Birinchi amal shartning ma\'nosidan chiqadi.',
      },
      {
        e: 'Итоговое задание', s: 'В каждой задаче на первом шаге своё действие.',
        a: 'Соедини каждую задачу с её первым действием.',
        left: [
          '7 штук, во второй в 2 раза больше, всего?',
          '10 штук и ещё 6 привезли, поровну на 4 полки?',
          '20 штук на 4 полки, потом добавили по 3 на полку?',
        ],
        right: ['Умножение', 'Сложение', 'Деление'],
        y: '«В раза больше» даёт умножение, «ещё привезли» — сложение, «разложить поровну» — деление.',
        n: 'Посмотри на начало условия: какого действия оно требует?',
        r: 'Первое действие следует из смысла условия.',
      }),
  ],
};

export default DARS48_BANK;
