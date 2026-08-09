// Dars 21 amaliyoti — Yozma usul: ustunda ko'paytirish.
// Nazariya: src/components/grade3/Dars21.jsx (num-3-21), KONTENT_3SINF.md «Dars 21».
// Darsda 23 · 4, 29 · 3, 123 · 3, 328 · 3 ishlangan — amaliyotda BOSHQA sonlar olindi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 choice · 2 dnd · 3 GRID · 4 input · 5 order · 6 input · 7 match · 8 GRID · 9 order · 10 multi
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS21_BANK = {
  title: 'Dars 21 · Yozma usul: ustun',
  items: [

    /* 1 · choice · 🟢 — ikkinchi ko'paytuvchi qayerga yoziladi. */
    q('01', 'Qayerga yoziladi?', '🟢', 'd21-where-factor', 'choice', '📐', 0,
      {
        e: 'Ustun yozuvi', s: "Ustunda ikkinchi ko'paytuvchi bir xonali. Uni qayerga yozish kerak?",
        a: "132 × 3 da 3 raqami qaysi xona tagiga yoziladi?",
        o: ['Birliklar tagiga', 'Yuzliklar tagiga', "O'nliklar tagiga", 'Chetga, chiziqdan tashqariga'],
        y: "Bir xonali ko'paytuvchi birliklar tagiga yoziladi — hisob o'shandan boshlanadi.",
        n: "Ustunda hisob o'ngdan boshlanadi. Demak ko'paytuvchi ham o'ng chetga tekislanadi.",
        by: [
          undefined,
          "Unda 3 raqami yuzliklarni ko'paytirardi. Lekin u butun songa ko'paytiriladi.",
          "Unda hisob o'rtadan boshlanardi. Ustunda qaysi xonadan boshlanadi?",
          "Ko'paytuvchi ustun ichida turishi kerak, aks holda qaysi xonadan boshlashni bilib bo'lmaydi.",
        ],
        r: "Bir xonali ko'paytuvchi birliklar tagiga yoziladi, hisob o'ngdan chapga boradi.",
      },
      {
        e: 'Запись столбиком', s: 'В столбике второй множитель однозначный. Куда его записать?',
        a: 'Под каким разрядом пишется цифра 3 в примере 132 × 3?',
        o: ['Под единицами', 'Под сотнями', 'Под десятками', 'Сбоку, за чертой'],
        y: 'Однозначный множитель пишется под единицами — с них и начинается счёт.',
        n: 'В столбике счёт начинается справа. Значит, и множитель выравнивают по правому краю.',
        by: [
          undefined,
          'Тогда 3 умножала бы только сотни. Но она умножает всё число.',
          'Тогда счёт начинался бы с середины. С какого разряда начинают в столбике?',
          'Множитель должен стоять внутри столбика, иначе непонятно, с какого разряда начинать.',
        ],
        r: 'Однозначный множитель пишут под единицами, счёт идёт справа налево.',
      }, undefined, {
        art: { plates: ['132', '3'] },
      }),

    /* 2 · dnd · 🟢 — tekislash. */
    q('02', "To'g'ri tekislangan?", '🟢', 'd21-align', 'dnd', '📏', [0, 1, 0, 1],
      {
        e: 'Tekislash', s: "To'rtta yozuv. Ba'zilarida ko'paytuvchi noto'g'ri xona tagida turibdi.",
        a: "Yozuvlarni ajrating: qaysilarida ko'paytuvchi to'g'ri, qaysilarida xato turibdi.",
        tokens: ['132 va 3 birlik tagida', '132 va 3 yuzlik tagida', '246 va 3 birlik tagida', '246 va 3 o\'nlik tagida'],
        zones: ["To'g'ri", 'Xato'],
        dndHint: 'Yozuvlar tugadi.',
        y: "Bir xonali ko'paytuvchi doim birliklar tagida turadi — boshqa xona tagida hisob buziladi.",
        n: "Har yozuvda ko'paytuvchi qaysi xona tagida ekanini toping.",
        r: "Ustunda bir xonali ko'paytuvchi faqat birliklar tagiga yoziladi.",
      },
      {
        e: 'Выравнивание', s: 'Четыре записи. В некоторых множитель стоит не под тем разрядом.',
        a: 'Разложи записи: где множитель стоит верно, а где с ошибкой.',
        tokens: ['132 и 3 под единицами', '132 и 3 под сотнями', '246 и 3 под единицами', '246 и 3 под десятками'],
        zones: ['Верно', 'Ошибка'],
        dndHint: 'Записи закончились.',
        y: 'Однозначный множитель всегда стоит под единицами — под другим разрядом счёт сломается.',
        n: 'В каждой записи найди, под каким разрядом стоит множитель.',
        r: 'В столбике однозначный множитель пишут только под единицами.',
      }),

    /* 3 · GRID · 🟢 — ko'chirishsiz. */
    q('03', "Ustunda: 132 × 3", '🟢', 'd21-grid-132x3', 'grid', '⌨️', undefined,
      {
        e: 'Oson holat', s: "Bu misolda hech bir xonada o'nlikdan o'tish yo'q.",
        a: '132 × 3 ni ustunda hisoblang.',
        gridHint: "Katakni bosing va raqamni tanlang. O'ngdan chapga hisoblang.",
        y: "Birliklar: 2 × 3 = 6. O'nliklar: 3 × 3 = 9. Yuzliklar: 1 × 3 = 3. Javob 396.",
        n: 'Har xonani alohida 3 ga ko\'paytiring va natijani o\'z xonasi tagiga yozing.',
        r: "Ustunda har xona alohida ko'paytiriladi, o'ngdan chapga.",
      },
      {
        e: 'Простой случай', s: 'В этом примере ни в одном разряде нет перехода через десяток.',
        a: 'Вычисли 132 × 3 столбиком.',
        gridHint: 'Нажми клетку и выбери цифру. Считай справа налево.',
        y: 'Единицы: 2 × 3 = 6. Десятки: 3 × 3 = 9. Сотни: 1 × 3 = 3. Ответ 396.',
        n: 'Умножай каждый разряд на 3 отдельно и записывай результат под своим разрядом.',
        r: 'В столбике каждый разряд умножается отдельно, справа налево.',
      }, undefined, {
        grid: {
          op: 'mul',
          cols: 3,
          rows: [
            { id: 'a', cells: ['1', '3', '2'] },
            { id: 'b', sign: true, cells: ['', '', '3'], line: true },
            { id: 'res', cells: ['3', '9', '6'], fill: 'all' },
          ],
        },
      }),

    /* 4 · input · 🟡 — ko'chirishsiz, og'zaki tekshiruv. */
    q('04', 'Tez hisoblang', '🟡', 'd21-214x2', 'input', '⚡', ['428'],
      {
        e: 'Ko\'chirishsiz', s: "214 × 2 da har xona ikki barobar ortadi, lekin hech qayerda o'nlikdan o'tilmaydi.",
        a: '214 × 2 nechaga teng?',
        y: '214 × 2 = 428: 4 × 2 = 8, 1 × 2 = 2, 2 × 2 = 4.',
        n: 'Har xonani alohida 2 ga ko\'paytiring: birlik, o\'nlik, yuzlik.',
        r: "Ko'chirish bo'lmasa, har xona mustaqil ko'paytiriladi: 214 × 2 = 428.",
        p: 'Javob',
      },
      {
        e: 'Без переноса', s: 'В 214 × 2 каждый разряд удваивается, но нигде нет перехода через десяток.',
        a: 'Чему равно 214 × 2?',
        y: '214 × 2 = 428: 4 × 2 = 8, 1 × 2 = 2, 2 × 2 = 4.',
        n: 'Умножай каждый разряд на 2 отдельно: единицы, десятки, сотни.',
        r: 'Если переноса нет, каждый разряд умножается независимо: 214 × 2 = 428.',
        p: 'Ответ',
      }, 'numeric', {
        art: { plates: ['214', '2'] },
      }),

    /* 5 · order · 🟡 — ko'chirish qadamlari. */
    q('05', "Ko'chirish qadamlari", '🟡', 'd21-carry-order', 'order', '🪜', [2, 0, 1],
      {
        e: "O'nlikdan o'tish", s: "47 × 2 da birliklar 14 beradi — bu bir xonaga sig'maydi.",
        a: 'Qadamlarni to\'g\'ri tartibda tanlang.',
        o: ["4 ni birliklar xonasiga yozaman", "1 o'nlikni yuqoriga ko'chiraman", "7 ni 2 ga ko'paytiraman"],
        y: "Avval ko'paytiramiz (7 × 2 = 14), keyin 4 ni yozamiz, so'ng 1 o'nlikni yuqoriga ko'chiramiz.",
        n: 'Natijani bilmasdan turib nimani yozishni ham, nimani ko\'chirishni ham aytib bo\'lmaydi.',
        r: "O'n birlik to'lsa, 1 o'nlik yuqoriga ko'chadi va keyingi xonaga qo'shiladi.",
      },
      {
        e: 'Переход через десяток', s: 'В 47 × 2 единицы дают 14 — это не помещается в один разряд.',
        a: 'Выбери шаги в правильном порядке.',
        o: ['Пишу 4 в разряд единиц', 'Переношу 1 десяток наверх', 'Умножаю 7 на 2'],
        y: 'Сначала умножаем (7 × 2 = 14), потом пишем 4, затем переносим 1 десяток наверх.',
        n: 'Не зная результата, нельзя сказать ни что записать, ни что перенести.',
        r: 'Когда набирается десять единиц, один десяток уходит наверх и прибавляется к следующему разряду.',
      }),

    /* 6 · input · 🟡 — bitta ko'chirish. */
    q('06', 'Bitta ko\'chirish', '🟡', 'd21-47x2', 'input', '🔺', ['94'],
      {
        e: 'Ko\'chirish bilan', s: "47 × 2: birliklar 14 beradi, demak bitta o'nlik ko'chadi.",
        a: '47 × 2 nechaga teng?',
        y: "Birliklar: 7 × 2 = 14 — 4 yoziladi, 1 o'nlik ko'chadi. O'nliklar: 4 × 2 = 8, ustiga 1 — 9. Javob 94.",
        n: "Ko'chgan o'nlikni o'nliklar natijasiga qo'shishni unutmang.",
        r: "Ko'chgan o'nlik keyingi xona natijasiga qo'shiladi: 47 × 2 = 94.",
        p: 'Javob',
      },
      {
        e: 'С переносом', s: 'В 47 × 2 единицы дают 14, значит один десяток переходит дальше.',
        a: 'Чему равно 47 × 2?',
        y: 'Единицы: 7 × 2 = 14 — пишем 4, один десяток переносим. Десятки: 4 × 2 = 8, плюс перенос 1 — 9. Ответ 94.',
        n: 'Не забудь прибавить перенесённый десяток к результату десятков.',
        r: 'Перенесённый десяток прибавляется к результату следующего разряда: 47 × 2 = 94.',
        p: 'Ответ',
      }, 'numeric', {
        art: { plates: ['47', '2'] },
      }),

    /* 7 · match · 🟡 — misol va javob. */
    q('07', 'Misol va javob', '🟡', 'd21-match', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch misol', s: "Uchta ko'paytma: bittasida ko'chirish bor, ikkitasida yo'q.",
        a: 'Har misolni uning javobiga ulang.',
        left: ['24 × 3', '31 × 3', '26 × 3'],
        right: ['72', '93', '78'],
        y: '24 × 3 = 72 (ko\'chirish bor), 31 × 3 = 93 (yo\'q), 26 × 3 = 78 (ko\'chirish bor).',
        n: "Har misolda avval birliklarni ko'paytiring: natija o'ndan oshsa, ko'chirish bo'ladi.",
        r: "Ko'chirish birliklar ko'paytmasi o'ndan oshganda paydo bo'ladi.",
      },
      {
        e: 'Три примера', s: 'Три произведения: в одном переноса нет, в двух есть.',
        a: 'Соедини каждый пример с его ответом.',
        left: ['24 × 3', '31 × 3', '26 × 3'],
        right: ['72', '93', '78'],
        y: '24 × 3 = 72 (есть перенос), 31 × 3 = 93 (нет), 26 × 3 = 78 (есть перенос).',
        n: 'В каждом примере сначала умножь единицы: если результат больше десяти, будет перенос.',
        r: 'Перенос появляется, когда произведение единиц переваливает за десяток.',
      }),

    /* 8 · GRID · 🔴 — ikki ko'chirish. */
    q('08', 'Ustunda: 246 × 3', '🔴', 'd21-grid-246x3', 'grid', '⌨️', undefined,
      {
        e: 'Ikki ko\'chirish', s: "Bu misolda ko'chirish ikki marta bo'ladi: birlikdan ham, o'nlikdan ham.",
        a: '246 × 3 ni ustunda hisoblang.',
        gridHint: "Ko'chirishni razryad ustidagi kichik katakka yozing. Ko'chirish bo'lmasa, katak bo'sh qoladi.",
        y: "Birliklar: 6 × 3 = 18 — 8 yoziladi, 1 ko'chadi. O'nliklar: 4 × 3 = 12, ustiga 1 — 13, 3 yoziladi, 1 ko'chadi. Yuzliklar: 2 × 3 = 6, ustiga 1 — 7. Javob 738.",
        n: "Har xonada avval ko'paytiring, keyin ko'chgan o'nlikni qo'shing, natija o'ndan oshsa yana ko'chiring.",
        r: "Ko'chirish ketma-ket bo'lishi mumkin: har xonada tekshiriladi.",
      },
      {
        e: 'Два переноса', s: 'В этом примере перенос будет дважды: и из единиц, и из десятков.',
        a: 'Вычисли 246 × 3 столбиком.',
        gridHint: 'Перенос записывай в маленькую клетку над разрядом. Если переноса нет, клетка остаётся пустой.',
        y: 'Единицы: 6 × 3 = 18 — пишем 8, переносим 1. Десятки: 4 × 3 = 12, плюс 1 — 13, пишем 3, переносим 1. Сотни: 2 × 3 = 6, плюс 1 — 7. Ответ 738.',
        n: 'В каждом разряде сначала умножь, потом прибавь перенос, и если результат больше десяти — переноси снова.',
        r: 'Перенос может идти подряд: его проверяют в каждом разряде.',
      }, undefined, {
        grid: {
          op: 'mul',
          cols: 3,
          rows: [
            { id: 'carry', kind: 'carry', cells: ['1', '1', ''], fill: 'all' },
            { id: 'a', cells: ['2', '4', '6'] },
            { id: 'b', sign: true, cells: ['', '', '3'], line: true },
            { id: 'res', cells: ['7', '3', '8'], fill: 'all' },
          ],
        },
      }),

    /* 9 · order · 🔴 — natijalarni tartiblash. */
    q('09', 'Natijalar tartibi', '🔴', 'd21-order-results', 'order', '📈', [1, 0, 3, 2],
      {
        e: 'Qaysi ko\'proq?', s: "To'rtta ko'paytma. Ularni hisoblab, natijalarga qarab tartiblang.",
        a: "Ko'paytmalarni natijasi bo'yicha kichigidan kattasiga tartiblang.",
        o: ['132 × 3', '47 × 2', '246 × 3', '214 × 2'],
        y: '47 × 2 = 94, 214 × 2 = 428, 132 × 3 = 396... to\'g\'ri tartib: 94, 396, 428, 738.',
        n: "Avval har ko'paytmani hisoblang, keyin natijalarni razryadlab solishtiring.",
        r: "Ko'paytmani taqqoslash uchun avval uni hisoblash kerak — ko'rinishiga qarab bo'lmaydi.",
      },
      {
        e: 'Где больше?', s: 'Четыре произведения. Посчитай их и расставь по результатам.',
        a: 'Расставь произведения от меньшего результата к большему.',
        o: ['132 × 3', '47 × 2', '246 × 3', '214 × 2'],
        y: '47 × 2 = 94, 132 × 3 = 396, 214 × 2 = 428, 246 × 3 = 738.',
        n: 'Сначала посчитай каждое произведение, потом сравни результаты по разрядам.',
        r: 'Чтобы сравнить произведения, их сначала считают — на глаз по виду нельзя.',
      }),

    /* 10 · multi · 🔴 — qayerda ko'chirish bo'ladi. */
    q('10', "Ko'chirish bo'ladimi?", '🔴', 'd21-carry-multi', 'multi', '🚀', [0, 2, 3],
      {
        e: 'Yakuniy mashq', s: "To'rtta ko'paytma. Birliklarni ko'paytirib, ko'chirish bor-yo'qligini aniqlang.",
        a: "Qaysi misollarda BIRLIKLARDAN ko'chirish bo'ladi? Hammasini belgilang.",
        o: ['26 × 3', '31 × 3', '47 × 2', '246 × 3'],
        y: '26 × 3: 6 × 3 = 18. 47 × 2: 7 × 2 = 14. 246 × 3: 6 × 3 = 18. 31 × 3 da esa 1 × 3 = 3 — ko\'chirish yo\'q.',
        n: "Butun misolni hisoblash shart emas: faqat birliklarni ko'paytiring va 10 bilan solishtiring.",
        r: "Ko'chirish birliklar ko'paytmasi 10 ga yetganda paydo bo'ladi.",
      },
      {
        e: 'Итоговое задание', s: 'Четыре произведения. Умножь единицы и определи, будет ли перенос.',
        a: 'В каких примерах будет перенос ИЗ ЕДИНИЦ? Отметь все.',
        o: ['26 × 3', '31 × 3', '47 × 2', '246 × 3'],
        y: '26 × 3: 6 × 3 = 18. 47 × 2: 7 × 2 = 14. 246 × 3: 6 × 3 = 18. А в 31 × 3 единицы дают 1 × 3 = 3 — переноса нет.',
        n: 'Считать весь пример не нужно: умножь только единицы и сравни с 10.',
        r: 'Перенос появляется, когда произведение единиц доходит до 10.',
      }),
  ],
};

export default DARS21_BANK;
