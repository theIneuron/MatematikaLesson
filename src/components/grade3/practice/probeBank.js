// Namuna bank — yangi mexanikalarni ko'rish uchun (TIPLAR_AMALIYOT_3SINF.md §3.5-3.7).
// Bu dars banki EMAS: hech qaysi darsga ulanmagan, faqat /lab/g3-tiplar sahifasida ochiladi.
// Vazifasi ikki xil: metodist mexanikani ko'z bilan tasdiqlaydi, muallif esa spec shaklini
// shu yerdan ko'chirib oladi.

/* ------------------------------- match ------------------------------- */
// correct[chapIndeks] = o'ngIndeks. O'ng ustun ekranda aralashtirib chiqariladi.
const MATCH = {
  id: '01',
  label: 'Moslashtiring',
  level: '🟢',
  tag: 'probe-match',
  genre: 'moslashtirish',
  type: 'match',
  emoji: '🔗',
  correct: [0, 1, 2],
  text: {
    uz: {
      eyebrow: 'Moslashtiring',
      setup: "Displeylarda sonlar, kartochkalarda o'qilishlari turibdi.",
      ask: "Har bir sonni o'z o'qilishiga ulang.",
      left: ['680', '430', '903'],
      right: ['olti yuz sakson', "to'rt yuz o'ttiz", "to'qqiz yuz uch"],
      correct: "To'g'ri. Nol o'qilmaydi, lekin o'z joyini saqlaydi.",
      wrong: "Maslahat: har sonni razryadlab o'qing, avval yuzligi, keyin o'nligi, oxirida birligi.",
      rule: "903 — to'qqiz yuz uch: o'nlik yo'q, lekin nol joyni saqlaydi.",
    },
    ru: {
      eyebrow: 'Соедини пары',
      setup: 'На дисплеях числа, на карточках их чтение.',
      ask: 'Соедини каждое число с его чтением.',
      left: ['680', '430', '903'],
      right: ['шестьсот восемьдесят', 'четыреста тридцать', 'девятьсот три'],
      correct: 'Верно. Ноль не читается, но сохраняет своё место.',
      wrong: 'Подсказка: читай по разрядам — сначала сотни, потом десятки, в конце единицы.',
      rule: '903 — девятьсот три: десятков нет, но ноль держит место.',
    },
  },
};

/* -------------------------------- dnd -------------------------------- */
// correct[kartaIndeks] = maydonIndeksi.
const DND = {
  id: '02',
  label: 'Rafga joylang',
  level: '🟡',
  tag: 'probe-dnd',
  genre: 'son tuzish',
  type: 'dnd',
  emoji: '🖐️',
  correct: [0, 1, 2],
  text: {
    uz: {
      eyebrow: 'Saralash rafi',
      setup: '306 sonining razryadlarini rafga joylash kerak.',
      ask: "Har bir kartani o'z rafiga qo'ying.",
      tokens: ['3 yuzlik', "0 o'nlik", '6 birlik'],
      zones: ['Yuzliklar', "O'nliklar", 'Birliklar'],
      dndHint: 'Kartalar tugadi.',
      correct: "To'g'ri. 306 — uch yuzlik, o'nlik yo'q, olti birlik.",
      wrong: "Maslahat: 306 da o'rtadagi raqam nol, demak o'nlik rafi bo'sh emas — unga nol o'nlik tushadi.",
      rule: "306 = 300 + 6. Nol o'nlik ham razryad, u joyni saqlaydi.",
    },
    ru: {
      eyebrow: 'Сортировочная полка',
      setup: 'Разряды числа 306 нужно разложить по полкам.',
      ask: 'Положи каждую карточку на свою полку.',
      tokens: ['3 сотни', '0 десятков', '6 единиц'],
      zones: ['Сотни', 'Десятки', 'Единицы'],
      dndHint: 'Карточки закончились.',
      correct: 'Верно. 306 — три сотни, десятков нет, шесть единиц.',
      wrong: 'Подсказка: в 306 средняя цифра ноль, значит на полку десятков ложится ноль десятков.',
      rule: '306 = 300 + 6. Ноль десятков — тоже разряд, он держит место.',
    },
  },
};

/* -------------------------- grid · add (ko'chirish bilan) -------------------------- */
// cells da to'g'ri qiymat turadi, fill qaysi katak bo'sh chiqishini aytadi — bitta haqiqat manbai.
// Ko'chirish qatori: har razryad ustida kichik katak, ko'chirish bo'lmasa bo'sh qoladi.
const GRID_ADD = {
  id: '03',
  label: "Ustunda qo'shish",
  level: '🟡',
  tag: 'probe-grid-add',
  genre: 'hisoblash',
  type: 'grid',
  emoji: '⌨️',
  grid: {
    op: 'add',
    cols: 3,
    rows: [
      { id: 'carry', kind: 'carry', cells: ['', '1', ''], fill: 'all' },
      { id: 'a', cells: ['2', '6', '4'] },
      { id: 'b', sign: true, cells: ['1', '7', '2'], line: true },
      { id: 'sum', cells: ['4', '3', '6'], fill: 'all' },
    ],
  },
  text: {
    uz: {
      eyebrow: "Ustunda qo'shish",
      setup: "Xona xona ostida turibdi. O'ngdan chapga qo'shamiz.",
      ask: '264 + 172 ni ustunda hisoblang.',
      gridHint: "Katakni bosing, so'ng raqamni tanlang. Ko'chirish bo'lmasa, yuqoridagi katak bo'sh qoladi.",
      correct: "To'g'ri. O'nliklarda 6 + 7 = 13, o'nlik to'lib yuzlikka bir ko'chdi.",
      wrong: "Maslahat: o'nliklarni qo'shing va natija o'ndan katta chiqsa, ortiqchasini yuqoriga ko'chiring.",
      rule: "O'nlik to'lganda bittasi keyingi razryadga ko'chadi.",
    },
    ru: {
      eyebrow: 'Сложение столбиком',
      setup: 'Разряд стоит под разрядом. Складываем справа налево.',
      ask: 'Вычисли 264 + 172 столбиком.',
      gridHint: 'Нажми клетку, потом выбери цифру. Если переноса нет, верхняя клетка остаётся пустой.',
      correct: 'Верно. В десятках 6 + 7 = 13, десяток переполнился и один перешёл в сотни.',
      wrong: 'Подсказка: сложи десятки, и если получилось больше десяти, лишнее перенеси наверх.',
      rule: 'Когда десяток заполнен, один переходит в следующий разряд.',
    },
  },
};

/* --------------------------- grid · mul (ikki xonali) --------------------------- */
const GRID_MUL = {
  id: '04',
  label: "Ustunda ko'paytirish",
  level: '🔴',
  tag: 'probe-grid-mul',
  genre: 'hisoblash',
  type: 'grid',
  emoji: '⌨️',
  grid: {
    op: 'mul',
    cols: 4,
    rows: [
      { id: 'a', cells: ['', '', '2', '3'] },
      { id: 'b', sign: true, cells: ['', '', '1', '4'], line: true },
      { id: 'p1', cells: ['', '9', '2'], fill: 'all' },
      { id: 'p2', sign: '+', cells: ['', '2', '3'], offset: 1, fill: 'all', line: true },
      { id: 'res', cells: ['', '3', '2', '2'], fill: [1, 2, 3] },
    ],
  },
  text: {
    uz: {
      eyebrow: "Ustunda ko'paytirish",
      setup: "Avval birlikka, keyin o'nlikka ko'paytiramiz. Ikkinchi qator bir xona chapga suriladi.",
      ask: '23 × 14 ni ustunda hisoblang.',
      correct: "To'g'ri. 23 × 4 = 92, 23 × 10 = 230, yig'indisi 322.",
      wrong: "Maslahat: ikkinchi qator o'nlikka ko'paytmasi, shuning uchun u bir xona chapga suriladi.",
      rule: "O'nlikka ko'paytirganda natija bir xona chapga suriladi.",
    },
    ru: {
      eyebrow: 'Умножение столбиком',
      setup: 'Сначала умножаем на единицы, потом на десятки. Вторая строка сдвигается на разряд влево.',
      ask: 'Вычисли 23 × 14 столбиком.',
      correct: 'Верно. 23 × 4 = 92, 23 × 10 = 230, вместе 322.',
      wrong: 'Подсказка: вторая строка — умножение на десятки, поэтому она сдвигается на разряд влево.',
      rule: 'При умножении на десятки результат сдвигается на разряд влево.',
    },
  },
};

/* ----------------------- grid · div (burchak, oraliq ayirishlar) ----------------------- */
// 96 : 4 = 24. Metodist qarori: oraliq ayirishlar ham to'ldiriladi.
const GRID_DIV = {
  id: '05',
  label: 'Burchakda bo\'lish',
  level: '🔴',
  tag: 'probe-grid-div',
  genre: 'hisoblash',
  type: 'grid',
  emoji: '⌨️',
  grid: {
    op: 'div',
    cols: 2,
    divisor: '4',
    quotient: { id: 'q', cells: ['2', '4'], fill: 'all' },
    rows: [
      { id: 'd', cells: ['9', '6'] },
      { id: 's1', sign: true, cells: ['8'], offset: 1, fill: 'all', line: 'cells' },
      { id: 'r1', cells: ['1', '6'], fill: 'all' },
      { id: 's2', sign: true, cells: ['1', '6'], fill: 'all', line: 'cells' },
      { id: 'r2', cells: ['0'], offset: 0, fill: 'all' },
    ],
    // Algoritm qadamlari: bo'linmaning birinchi raqami -> ayirish -> qoldiq -> ikkinchi raqam -> ...
    fillOrder: [
      ['q', 0], ['s1', 0], ['r1', 0], ['r1', 1],
      ['q', 1], ['s2', 0], ['s2', 1], ['r2', 0],
    ],
  },
  text: {
    uz: {
      eyebrow: "Burchakda bo'lish",
      setup: "Avval o'nliklarni bo'lamiz, qoldiqqa birliklarni tushiramiz.",
      ask: "96 : 4 ni burchakda hisoblang.",
      correct: "To'g'ri. 9 o'nlikda 4 ta ikki marta bor, qoldiq 1 o'nlik, u 16 birlik beradi.",
      wrong: "Maslahat: har qadamda ayirishni yozing va qoldiqni keyingi razryad bilan birga oling.",
      rule: "Burchakda bo'lish yuqori razryaddan boshlanadi, qoldiq keyingi razryadga tushadi.",
    },
    ru: {
      eyebrow: 'Деление уголком',
      setup: 'Сначала делим десятки, к остатку сносим единицы.',
      ask: 'Вычисли 96 : 4 уголком.',
      correct: 'Верно. В 9 десятках четвёрка помещается дважды, остаток 1 десяток, он даёт 16 единиц.',
      wrong: 'Подсказка: на каждом шаге записывай вычитание и бери остаток вместе со следующим разрядом.',
      rule: 'Деление уголком начинается со старшего разряда, остаток сносится к следующему.',
    },
  },
};

export const PROBE_BANK = {
  title: 'Mexanikalar namunasi — match, dnd, grid',
  items: [MATCH, DND, GRID_ADD, GRID_MUL, GRID_DIV],
  source: null,
};

export default PROBE_BANK;
