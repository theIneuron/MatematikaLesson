import React from 'react';
import { AncientHallBg, BitSVG, HALL_SLAB, LUMO_CAST, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars36 — "Kvadrat yuzasi" (num-3-36) | Б5 «KRISTALL ARXITEKTURA»
// Syujet: kristall kvartal davom etadi (SYUJET_3SINF.md 194-satr, reja 40-satr).
// SAHNA: metodist qarori 2026-08-09 — qolgan darslarning HAMMASIDA 8-DARS sahnasi,
//   qadimgi zal. Zalning o'zi endi kitda (`AncientHallBg`), 24-32 darslardagidek
//   nusxalanmaydi. Dars faqat markaziy taxtaga o'z narsasini qo'yadi: kvadrat panel,
//   tomoni belgilangan, ichida kataklar.
// FIGURALAR: kitning geometriya to'plamidan (`GridFig`), yuza rejimida.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 162-bet): kvadrat yuzasi — tomonni
//   o'ziga ko'paytirish, chunki qator soni qatordagi katak soniga teng.
// KARKAS QARORI 2.2: formula sanashdan KEYIN keladi. 35-darsda uzunlik enga
//   ko'paytirildi, bu yerda ikkala son BITTA bo'lib qoladi.
// YADRO: tomoni 6 kvadrat. 6 · 6 = 36, lekin 6 · 4 = 24 bu perimetr.
// Misconception: M1 tomonni to'rtga ko'paytirish (perimetr); M2 tomonni tomonga qo'shish;
//   M3 «kvadratda yuza va perimetr har doim teng» (tomoni 4 dagi tasodif); M4 birlikni
//   unutish yoki sm va sm² ni chalkashtirish.
// FactCard: perimetri bir xil shakllar ichida kvadrat eng ko'p joy sig'diradi —
//   24 metr arqon 2 ga 10 da 20, 6 ga 6 da esa 36 kvadrat metr beradi.
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 36». Karkas: BLOK_B5_KARKAS.md.
//
// FREE_NAV kitdan keladi (hozircha true).

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-36',
  lessonTitle: { ru: 'Урок 36. Площадь квадрата', uz: "36-dars. Kvadrat yuzasi", en: 'Lesson 36. The area of a square' }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 36»): s0 xuk tomoni 6 · s1 qatorlar soni tomonga teng ·
// s2 model, uzunlik va en bitta son · s3 savol-oldin-QOIDA S = a · a · s4 rasm bo'yicha
// tomoni 3 · s5 saralash perimetr yoki yuza · s6 test tomoni 8 · s7 konsol tomoni 6, yuza
// va perimetr yonma-yon · s8 xatoni top (tomon to'rtga ko'paytirilgan) · s9 Bit tuzog'i
// (tomoni 4 da sonlar mos tushadi) · s10 trenajyor tomoni 7 · s11 trenajyor teskari
// (yuza 25) · s12 masala (pol va chekka, ikki amal) · s13 final 3 topshiriq + FactCard ·
// s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'diagnostic' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
// ============================================================
// CONTENT — 3-sinf Dars13 «Amallar tartibi» (num-3-13). RU + UZ to'liq.
// Manba: src/books/grade3/KONTENT_3SINF.md, «Dars 13» bo'limi (tasdiq 2026-08-05).
// Syujet: «Yorug' bog'» davomi — bog' kirishidagi BUYURTMA TAXTASI: 3 + 6 × 2.
// YADRO: qoida bo'yicha 15, chapdan o'ngga esa 18; 18 — QAVSLI yozuvning javobi.
// M1: chapdan o'ngga hisoblash. M2: qavsni e'tiborsiz qoldirish. M3: bitta amalda
// to'xtash. M4: «tartib ahamiyatsiz».
// BONUS s9: USTUN — ifoda ichida ko'paytirish, keyin qo'shish va ayirish ustunda.
// ============================================================
const CONTENT = {
  // s0 — XUK: kvadrat panelda tomonlar teng, lekin katak soni tomonga teng emas (162-bet).
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Площадь квадрата', uz: 'Kvadrat yuzasi', en: 'The area of a square' },
    lead: { ru: 'Квадратная панель, в ряду 6 клеток', uz: "Kvadrat panel, qatorda 6 katak", en: 'A square panel, 6 squares in a row' },
    order_cap: { ru: 'у квадрата все стороны одинаковые', uz: "kvadratning hamma tomoni bir xil", en: 'a square has all its sides the same' },
    plate: ['6', '·', '6'],
    q: { ru: 'Сколько клеток на квадратной панели?', uz: 'Kvadrat panelda nechta katak bor?', en: 'How many squares are on the square panel?' },
    opt0: { ru: '36', uz: '36', en: '36' },
    opt1: { ru: '24', uz: '24', en: '24' },
    opt2: { ru: '12', uz: '12', en: '12' },
    opt3: { ru: '30', uz: '30', en: '30' },
    audio: {
      intro: {
        ru: [
          'Площадь прямоугольника ты уже находишь. Сегодня возьмём фигуру попроще на вид.',
          'Панель квадратная. В ряду шесть клеток, и рядов тоже шесть.',
          'Стороны у квадрата одинаковые, а вот клеток внутри столько же или нет.',
          'Как думаешь, сколько всего клеток на этой панели?'
        ],
        uz: [
          "To'rtburchak yuzasini topa olasiz. Bugun ko'rinishdan soddaroq shaklni olamiz.",
          "Panel kvadrat. Qatorda oltita katak, qator ham oltita.",
          "Kvadratning tomonlari bir xil, ichkarida esa katak shunchami yoki yo'qmi.",
          "Sizningcha, bu panelda jami nechta katak bor?"
        ],
        en: ['You can already find the area of a rectangle. Today we will take a figure that looks simpler.', 'The panel is square. A row has six squares, and there are six rows too.', 'A square has its sides the same, but whether the squares inside are the same in number is another matter.', 'How many squares do you think there are on this panel in all?']
      },
      on_correct: { ru: 'Верно! Сейчас увидишь, почему у квадрата хватает одного числа.', uz: "To'g'ri! Endi kvadratga nega bitta son yetishini ko'rasiz.", en: 'Right! Now you will see why one number is enough for a square.' },
      on_wrong1: { ru: 'Двадцать четыре это путь по краю, четыре стороны по шесть. Мы считаем клетки внутри.', uz: "Yigirma to'rt bu chekka yo'li, to'rtta tomon oltitadan. Biz ichkaridagi kataklarni sanaymiz.", en: 'Twenty four is the path along the edge, four sides of six. We are counting the squares inside.' },
      on_wrong2: { ru: 'Двенадцать это две стороны вместе. Клеток намного больше.', uz: "O'n ikki bu ikkita tomon birga. Kataklar ancha ko'p.", en: 'Twelve is two sides together. There are far more squares.' },
      on_idk: { ru: 'Ничего. Сейчас посчитаем ряды и всё станет видно.', uz: "Hechqisi yo'q. Hozir qatorlarni sanaymiz va hammasi ko'rinadi.", en: 'Never mind. Let us count the rows and it will all be clear.' }
    }
  },

  // s1 — MODEL: kvadratda qator soni qatordagi katak soniga TENG.
  s1: {
    eyebrow: { ru: 'Модель', uz: 'Model', en: 'The model' },
    lead: { ru: 'Заполняем квадратную панель рядами', uz: "Kvadrat panelni qatorlab to'ldiramiz", en: 'We fill the square panel row by row' },
    task_line: 'сторона 5 клеток',
    task_line_uz: "tomoni 5 katak",
    task_line_en: 'side 5 squares',
    step1: '5 + 5 + 5 + 5 + 5',
    step1_cap: { ru: 'пять одинаковых рядов по 5 клеток', uz: "5 katakdan beshta bir xil qator", en: 'five identical rows of 5 squares' },
    step2: '5 · 5 = 25',
    step2_cap: { ru: 'у квадрата оба числа одинаковые', uz: 'kvadratda ikkala son bir xil', en: 'a square has both numbers the same' },
    res: { ru: 'S = 25 см²', uz: 'S = 25 sm²', en: 'S = 25 sq cm' },
    btn1: { ru: 'Посчитать ряд', uz: 'Qatorni sanash', en: 'Count a row' },
    btn2: { ru: 'Посчитать ряды', uz: 'Qatorlarni sanash', en: 'Count the rows' },
    done_text: { ru: 'Двадцать пять клеток. Оба числа одинаковые, потому что фигура квадратная.', uz: "Yigirma besh katak. Ikkala son bir xil, chunki shakl kvadrat.", en: 'Twenty five squares. Both numbers are the same, because the figure is square.' },
    audio: {
      ru: [
        'Панель со стороной пять клеток. Посчитаем сначала один ряд.',
        'Пять одинаковых рядов, в каждом по пять клеток.',
        'Одинаковые слагаемые заменяем умножением. Пять умножить на пять, двадцать пять клеток. У квадрата оба числа одинаковые.'
      ],
      uz: [
        "Tomoni besh katak bo'lgan panel. Avval bitta qatorni sanaymiz.",
        "Beshta bir xil qator, har birida beshtadan katak.",
        "Bir xil qo'shiluvchilarni ko'paytirish bilan almashtiramiz. Beshni beshga ko'paytiramiz, yigirma beshta katak. Kvadratda ikkala son bir xil."
      ],
      en: ['A panel with a side of five squares. Let us count one row first.', 'Five identical rows with five squares in each.', 'Identical addends are replaced by multiplication. Five times five, twenty five squares. A square has both numbers the same.']
    }
  },

  // s2 — MODEL: uzunlik ham, en ham BITTA son — tomon.
  s2: {
    eyebrow: { ru: 'Модель', uz: 'Model', en: 'The model' },
    w: 4,
    h: 4,
    lead: { ru: 'У квадрата длина и ширина это одно число', uz: "Kvadratda uzunlik ham, en ham bitta son", en: 'For a square the length and the width are one number' },
    capA: { ru: 'длина 4', uz: 'uzunlik 4', en: 'length 4' },
    capB: { ru: 'ширина 4', uz: 'en 4', en: 'width 4' },
    res: 'a = 4',
    name_a: { ru: 'длина', uz: 'uzunlik', en: 'length' },
    name_b: { ru: 'ширина', uz: 'en', en: 'width' },
    btn1: { ru: 'Измерить длину', uz: "Uzunlikni o'lchash", en: 'Measure the length' },
    btn2: { ru: 'Измерить ширину', uz: "Enni o'lchash", en: 'Measure the width' },
    done_text: { ru: 'Оба измерения дали четыре. Такое число называют стороной квадрата.', uz: "Ikkala o'lchov ham to'rt berdi. Bunday sonni kvadratning tomoni deyishadi.", en: 'Both measurements gave four. Such a number is called the side of the square.' },
    audio: {
      ru: [
        'Измерим панель двумя способами, вдоль и поперёк.',
        'Вдоль получилось четыре клетки.',
        'Поперёк тоже четыре. У прямоугольника эти числа разные, у квадрата совпадают, поэтому квадрату хватает одного числа. Его называют стороной.'
      ],
      uz: [
        "Panelni ikki yo'l bilan o'lchaymiz, bo'ylab va ko'ndalang.",
        "Bo'ylab to'rtta katak chiqdi.",
        "Ko'ndalang ham to'rtta. To'rtburchakda bu sonlar har xil, kvadratda mos tushadi, shuning uchun kvadratga bitta son yetadi. Uni tomon deyishadi."
      ],
      en: ['Let us measure the panel two ways, along and across.', 'Along it came to four squares.', 'Across it is four too. In a rectangle these numbers are different, in a square they match, so one number is enough for a square. It is called the side.']
    }
  },

  // s3 — QOIDA: S = a · a (162-bet).
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Как найти площадь квадрата со стороной 6?', uz: "Tomoni 6 bo'lgan kvadratning yuzasi qanday topiladi?", en: 'How do we find the area of a square with a side of 6?' },
    opts: [
      { ru: '6 · 6', uz: '6 · 6', en: '6 · 6' },
      { ru: '6 · 4', uz: '6 · 4', en: '6 · 4' },
      { ru: '6 + 6', uz: '6 + 6', en: '6 + 6' },
      { ru: '6 · 2', uz: '6 · 2', en: '6 · 2' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Четыре стороны по шесть это путь по краю, то есть периметр.', uz: "Oltitadan to'rtta tomon bu chekka yo'li, ya'ni perimetr.", en: 'Four sides of six is the path along the edge, that is the perimeter.' },
      2: { ru: 'Сложение сторон площади не даёт, клетки так не появятся.', uz: "Tomonlarni qo'shish yuza bermaydi, kataklar bunday chiqmaydi.", en: 'Adding the sides does not give the area, squares will not appear that way.' },
      3: { ru: 'Это только два ряда, а рядов столько же, сколько клеток в ряду.', uz: "Bu atigi ikki qator, qator esa qatordagi katak soniga teng.", en: 'That is only two rows, and there are as many rows as there are squares in a row.' }
    },
    on_correct: { ru: 'Верно. Сторона умножается сама на себя.', uz: "To'g'ri. Tomon o'ziga ko'paytiriladi.", en: 'Right. The side is multiplied by itself.' },
    rule_lines: {
      ru: ['площадь квадрата: S = a · a', 'a это сторона', 'ответ в квадратных единицах'],
      uz: ["kvadrat yuzasi: S = a · a", "a bu tomon", "javob kvadrat birlikda"],
      en: ['the area of a square: S = a · a', 'a is the side', 'the answer in square units']
    },
    rule_ex: { ru: 'S = 6 · 6 = 36 см²', uz: 'S = 6 · 6 = 36 sm²', en: 'S = 6 · 6 = 36 sq cm' },
    rule_speech: { ru: 'Площадь квадрата это сторона, умноженная сама на себя. Если сторона шесть сантиметров, площадь тридцать шесть квадратных сантиметров.', uz: "Kvadrat yuzasi bu tomonni o'ziga ko'paytirgani. Tomon olti santimetr bo'lsa, yuza o'ttiz olti kvadrat santimetr.", en: 'The area of a square is the side multiplied by itself. If the side is six centimetres, the area is thirty six square centimetres.' },
    audio: {
      intro: { ru: 'Соберём правило. У квадрата обе стороны одинаковые, значит нужно одно число.', uz: "Qoidani yig'amiz. Kvadratda ikkala tomon bir xil, demak bitta son kerak.", en: 'Let us gather the rule. A square has both sides the same, so one number is needed.' }
    }
  },

  // s4 — CHIZMA: tomoni 3 bo'lgan kvadrat.
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'Сторона 3 см. Чему равна площадь?', uz: "Tomoni 3 sm. Yuzasi nechaga teng?", en: 'The side is 3 cm. What is the area?' },
    fig_w: 3,
    fig_h: 3,
    opts: [
      { ru: '9 см²', uz: '9 sm²', en: '9 sq cm' },
      { ru: '12 см²', uz: '12 sm²', en: '12 sq cm' },
      { ru: '6 см²', uz: '6 sm²', en: '6 sq cm' },
      { ru: '3 см²', uz: '3 sm²', en: '3 sq cm' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Двенадцать это четыре стороны по три, путь по краю.', uz: "O'n ikki bu uchtadan to'rtta tomon, chekka yo'li.", en: 'Twelve is four sides of three, the path along the edge.' },
      2: { ru: 'Шесть это две стороны вместе, а нужно умножить.', uz: "Olti bu ikkita tomon birga, kerak bo'lgani ko'paytirish.", en: 'Six is two sides together, and they have to be multiplied.' },
      3: { ru: 'Три это сама сторона, а не число клеток.', uz: "Uch bu tomonning o'zi, katak soni emas.", en: 'Three is the side itself, not the number of squares.' }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. Сторона три сантиметра. Сколько квадратных сантиметров внутри?', uz: "Chizmaga qarang. Tomoni uch santimetr. Ichkarida necha kvadrat santimetr bor?", en: 'Look at the drawing. The side is three centimetres. How many square centimetres are inside?' },
      on_correct: { ru: 'Верно. Три ряда по три клетки.', uz: "To'g'ri. Uchtadan uchta qator.", en: 'Right. Three rows of three squares.' },
      on_wrong: { ru: 'Считай клетки внутри, а не шаги по краю.', uz: "Chekka qadamlarini emas, ichkaridagi kataklarni sanang.", en: 'Count the squares inside, not the steps along the edge.' }
    }
  },

  // s5 — SARALASH: perimetr yozuvlari va yuza yozuvlari (M1 asosiy tuzoq).
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи записи квадрата по величинам', uz: 'Kvadrat yozuvlarini kattaliklarga ajrating', en: 'Sort the lines about a square by quantity' },
    bin_a: { ru: 'периметр', uz: 'perimetr', en: 'perimeter' },
    bin_b: { ru: 'площадь', uz: 'yuza', en: 'area' },
    items: [
      { n: { ru: 'a · 4', uz: 'a · 4', en: 'a · 4' }, a: true, hint: { ru: 'Четыре одинаковые стороны это край.', uz: "To'rtta bir xil tomon bu chekka.", en: 'Four identical sides is the edge.' } },
      { n: { ru: 'a · a', uz: 'a · a', en: 'a · a' }, a: false, hint: { ru: 'Сторона на саму себя даёт клетки.', uz: "Tomonni o'ziga ko'paytirish kataklarni beradi.", en: 'The side times itself gives the squares.' } },
      { n: { ru: 'ответ в см', uz: 'javob sm da', en: 'the answer in cm' }, a: true, hint: { ru: 'Длину меряют обычными единицами.', uz: "Uzunlik oddiy birlikda o'lchanadi.", en: 'Length is measured in ordinary units.' } },
      { n: { ru: 'ответ в см²', uz: 'javob sm² da', en: 'the answer in sq cm' }, a: false, hint: { ru: 'Квадратные единицы считают клетки.', uz: "Kvadrat birliklar kataklarni sanaydi.", en: 'Square units count the squares.' } }
    ],
    audio: {
      intro: { ru: 'Четыре записи про один и тот же квадрат. Отправь каждую к своей величине.', uz: "Bitta kvadrat haqida to'rtta yozuv. Har birini o'z kattaligiga yuboring.", en: 'Four lines about the very same square. Send each one to its quantity.' },
      on_correct: { ru: 'Всё на месте. Умножение стороны на себя это площадь, четыре стороны это периметр.', uz: "Hammasi joyida. Tomonni o'ziga ko'paytirish bu yuza, to'rtta tomon bu perimetr.", en: 'All in place. The side times itself is the area, four sides is the perimeter.' },
      on_wrong: { ru: 'Спроси себя, обходит запись фигуру или заполняет.', uz: "O'zingizdan so'rang, yozuv shaklni aylanadimi yoki to'ldiradimi.", en: 'Ask yourself whether the line goes round the figure or fills it.' }
    }
  },

  // s6 — TEST: tomoni 8.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Сторона квадрата 8 см. Площадь?', uz: "Kvadrat tomoni 8 sm. Yuzasi?", en: 'The side of a square is 8 cm. The area?' },
    opts: [
      { ru: '64 см²', uz: '64 sm²', en: '64 sq cm' },
      { ru: '32 см²', uz: '32 sm²', en: '32 sq cm' },
      { ru: '16 см²', uz: '16 sm²', en: '16 sq cm' },
      { ru: '24 см²', uz: '24 sm²', en: '24 sq cm' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Тридцать два это периметр, четыре стороны по восемь.', uz: "O'ttiz ikki bu perimetr, sakkiztadan to'rtta tomon.", en: 'Thirty two is the perimeter, four sides of eight.' },
      2: { ru: 'Шестнадцать это две стороны вместе.', uz: "O'n olti bu ikkita tomon birga.", en: 'Sixteen is two sides together.' },
      3: { ru: 'Двадцать четыре это три стороны, такой величины нет.', uz: "Yigirma to'rt bu uchta tomon, bunday kattalik yo'q.", en: 'Twenty four is three sides, there is no such quantity.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Сторона восемь сантиметров, чему равна площадь?', uz: "Tez savol. Tomoni sakkiz santimetr, yuzasi nechaga teng?", en: 'A quick question. The side is eight centimetres, what is the area?' },
      on_correct: { ru: 'Верно, восемь на восемь.', uz: "To'g'ri, sakkizga sakkiz.", en: 'Right, eight times eight.' },
      on_wrong: { ru: 'Умножай сторону саму на себя.', uz: "Tomonni o'ziga ko'paytiring.", en: 'Multiply the side by itself.' }
    }
  },

  // s7 — KONSOL: tomoni 6, yuza va perimetr YONMA-YON.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Заполни консоль для квадрата со стороной 6', uz: "Tomoni 6 bo'lgan kvadrat uchun konsolni to'ldiring", en: 'Fill the console for a square with a side of 6' },
    swap_line: { ru: 'квадрат 6', uz: 'kvadrat 6', en: 'square 6' },
    cells: [
      { head: { ru: 'сторона', uz: 'tomon', en: 'side' }, label: { ru: 'клеток', uz: 'katak', en: 'squares' }, ans: 6, hint: { ru: 'Столько клеток вдоль одной стороны.', uz: "Bitta tomon bo'ylab shuncha katak bor.", en: 'That is how many squares there are along one side.' } },
      { head: { ru: 'площадь', uz: 'yuza', en: 'area' }, label: '6 · 6', ans: 36, hint: { ru: 'Сторона умножается сама на себя.', uz: "Tomon o'ziga ko'paytiriladi.", en: 'The side is multiplied by itself.' } },
      { head: { ru: 'периметр', uz: 'perimetr', en: 'perimeter' }, label: '6 · 4', ans: 24, hint: { ru: 'Четыре одинаковые стороны по шесть.', uz: "Oltitadan to'rtta bir xil tomon.", en: 'Four identical sides of six.' } }
    ],
    check: { ru: 'S = 36 см², P = 24 см', uz: 'S = 36 sm², P = 24 sm', en: 'S = 36 sq cm, P = 24 cm' },
    check_label: { ru: 'две разные величины', uz: 'ikki xil kattalik', en: 'two different quantities' },
    audio: {
      intro: { ru: 'Заполни три окна. Сторона, площадь и периметр одной и той же панели.', uz: "Uchta oynani to'ldiring. Bitta panelning tomoni, yuzasi va perimetri.", en: 'Fill three windows. The side, the area and the perimeter of the very same panel.' },
      on_correct: { ru: 'Тридцать шесть квадратных сантиметров и двадцать четыре сантиметра. Одна фигура, а величины разные.', uz: "O'ttiz olti kvadrat santimetr va yigirma to'rt santimetr. Shakl bitta, kattaliklar esa har xil.", en: 'Thirty six square centimetres and twenty four centimetres. One figure, and the quantities are different.' }
    }
  },

  // s8 — XATONI TOP: tomon to'rtga ko'paytirilgan (M1).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Сторона 5 см, записали S = 20 см². Где ошибка?', uz: "Tomoni 5 sm, S = 20 sm² deb yozilibdi. Xato qayerda?", en: 'The side is 5 cm, they wrote S = 20 sq cm. Where is the mistake?' },
    fig_line: '5 · 4 = 20',
    opts: [
      { ru: 'сторону умножили на 4', uz: "tomon 4 ga ko'paytirilgan", en: 'the side was multiplied by 4' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'сторону взяли не ту', uz: "tomon noto'g'ri olingan", en: 'the wrong side was taken' },
      { ru: 'забыли единицы', uz: "birliklar unutilgan", en: 'the units were forgotten' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Двадцать это путь по краю. Клеток внутри двадцать пять.', uz: "Yigirma bu chekka yo'li. Ichkarida yigirma beshta katak bor.", en: 'Twenty is the path along the edge. There are twenty five squares inside.' },
      2: { ru: 'Сторона взята верно, пять. Подвело действие.', uz: "Tomon to'g'ri olingan, besh. Amal aldabdi.", en: 'The side was taken correctly, five. The operation let it down.' },
      3: { ru: 'Единицы на месте, а вот число получено не тем действием.', uz: "Birliklar joyida, son esa boshqa amal bilan chiqarilgan.", en: 'The units are in place, but the number came from the wrong operation.' }
    },
    audio: {
      intro: { ru: 'Кто-то посчитал площадь квадрата со стороной пять и получил двадцать. Найди ошибку.', uz: "Kimdir tomoni besh bo'lgan kvadratning yuzasini hisoblab, yigirma olibdi. Xatoni toping.", en: 'Someone worked out the area of a square with a side of five and got twenty. Find the mistake.' },
      on_correct: { ru: 'Верно. Умножение на четыре даёт периметр, а площадь это сторона на саму себя.', uz: "To'g'ri. To'rtga ko'paytirish perimetrni beradi, yuza esa tomonni o'ziga ko'paytirgani.", en: 'Right. Multiplying by four gives the perimeter, and the area is the side times itself.' },
      on_wrong: { ru: 'Сравни записи. Одна обходит квадрат, другая заполняет.', uz: "Yozuvlarni solishtiring. Biri kvadratni aylanadi, ikkinchisi to'ldiradi.", en: 'Compare the lines. One goes round the square, the other fills it.' }
    }
  },

  // s9 — BIT TUZOG'I: tomoni 4 da sonlar mos tushadi (M3).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит нашёл у квадрата со стороной 4 равенство', uz: "Bit tomoni 4 bo'lgan kvadratda tenglik topdi", en: 'Bit found an equality for a square with a side of 4' },
    lines: ['сторона 4: S = 16, P = 16', 'Бит: площадь и периметр всегда равны'],
    lines_uz: ["tomoni 4: S = 16, P = 16", "Bit: yuza va perimetr har doim teng"],
    lines_en: ['side 4: S = 16, P = 16', 'Bit: the area and the perimeter are always equal'],
    line_cap: { ru: 'Бит: числа совпали, значит правило', uz: "Bit: sonlar mos tushdi, demak qoida", en: 'Bit: the numbers matched, so it is a rule' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, это только при стороне 4', 'да, у квадрата всегда так'], uz: ["yo'q, bu faqat tomoni 4 da", 'ha, kvadratda har doim shunday'], en: ['no, that is only for a side of 4', 'yes, a square is always like that'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Возьми сторону пять и увидишь двадцать пять против двадцати. Числа совпали один раз, да и величины тут разные. Одна в сантиметрах, другая в квадратных.', uz: "Ha. Tomonni besh qilib olsangiz, yigirma beshga qarshi yigirma chiqadi. Sonlar bir marta mos tushdi, kattaliklar esa har xil. Biri santimetrda, ikkinchisi kvadratda.", en: 'Yes. Take a side of five and you will see twenty five against twenty. The numbers matched once, and the quantities here are different anyway. One is in centimetres, the other in square ones.' },
    trap_wrong: { ru: 'Проверь на другой стороне. Возьми пять и посчитай обе величины, они разойдутся.', uz: "Boshqa tomonda tekshiring. Beshni olib, ikkala kattalikni hisoblang, ular ajralib ketadi.", en: 'Check it with another side. Take five and work out both quantities, they will part ways.' },
    audio: {
      ru: [
        'Бит посчитал квадрат со стороной четыре.',
        'Площадь шестнадцать, периметр тоже шестнадцать. Значит у квадрата это всегда одно и то же.',
        'Так ли это?'
      ],
      uz: [
        "Bit tomoni to'rt bo'lgan kvadratni hisobladi.",
        "Yuza o'n olti, perimetr ham o'n olti. Demak kvadratda bu har doim bir xil.",
        "Shundaymi?"
      ],
      en: ['Bit worked out a square with a side of four.', 'The area is sixteen, the perimeter is sixteen too. So for a square it is always the same thing.', 'Is that so?']
    }
  },

  // s10 — TRENAJYOR: to'g'ridan-to'g'ri yuza.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сторона квадрата 7 см. Чему равна площадь в см²?', uz: "Kvadrat tomoni 7 sm. Yuzasi sm² da nechaga teng?", en: 'The side of a square is 7 cm. What is the area in sq cm?' },
    ans: 49,
    check: 'S = 7 · 7',
    check_label: { ru: 'сторона на саму себя', uz: "tomon o'ziga", en: 'the side times itself' },
    hint: { ru: 'Семь умножь на семь.', uz: "Yettini yettiga ko'paytiring.", en: 'Multiply seven by seven.' },
    audio: {
      intro: { ru: 'Теперь считай сам. Сторона семь сантиметров, чему равна площадь?', uz: "Endi o'zingiz hisoblang. Tomoni yetti santimetr, yuzasi nechaga teng?", en: 'Now count on your own. The side is seven centimetres, what is the area?' },
      on_correct: { ru: 'Сорок девять квадратных сантиметров.', uz: "Qirq to'qqiz kvadrat santimetr.", en: 'Forty nine square centimetres.' }
    }
  },

  // s11 — TRENAJYOR: teskari yo'l, yuzadan tomonga.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Площадь квадрата 25 см². Чему равна сторона в см?', uz: "Kvadrat yuzasi 25 sm². Tomoni sm da nechaga teng?", en: 'The area of a square is 25 sq cm. What is the side in cm?' },
    ans: 5,
    check: '5 · 5 = 25',
    check_label: { ru: 'проверка умножением', uz: "ko'paytirib tekshirish", en: 'a check by multiplying' },
    hint: { ru: 'Ищи число, которое умножили само на себя и получили двадцать пять.', uz: "O'ziga ko'paytirilib yigirma besh chiqqan sonni qidiring.", en: 'Look for the number that was multiplied by itself to give twenty five.' },
    audio: {
      intro: { ru: 'А теперь обратный путь. Площадь двадцать пять квадратных сантиметров, чему равна сторона?', uz: "Endi teskari yo'l. Yuza yigirma besh kvadrat santimetr, tomoni nechaga teng?", en: 'And now the way back. The area is twenty five square centimetres, what is the side?' },
      on_correct: { ru: 'Пять сантиметров. Пять на пять даёт двадцать пять.', uz: "Besh santimetr. Beshga besh yigirma besh beradi.", en: 'Five centimetres. Five times five gives twenty five.' }
    }
  },

  // s12 — MASALA: ikki amal, savolga qarab kattalik tanlanadi (M1 + M2).
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Квадратный зал кристаллов', uz: 'Kvadrat kristall zali', en: 'The square crystal hall' },
    q: { ru: 'Пол зала квадратный, сторона 8 м. Сколько квадратных метров плитки на пол и сколько метров ленты по краю?', uz: "Zal poli kvadrat, tomoni 8 m. Polga necha kvadrat metr plitka va chekka bo'ylab necha metr lenta kerak?", en: 'The floor of the hall is square with a side of 8 m. How many square metres of tiles for the floor and how many metres of strip along the edge?' },
    q_speech: { ru: 'пол зала квадратный, сторона восемь метров. Сколько квадратных метров плитки на пол и сколько метров ленты по краю?', uz: "zal poli kvadrat, tomoni sakkiz metr. Polga necha kvadrat metr plitka va chekka bo'ylab necha metr lenta kerak?", en: 'the floor of the hall is square with a side of eight metres. How many square metres of tiles and how many metres of strip along the edge?' },
    tbl_heads: [
      { ru: 'сторона', uz: 'tomon', en: 'side' },
      { ru: 'плитка', uz: 'plitka', en: 'tiles' },
      { ru: 'лента', uz: 'lenta', en: 'strip' }
    ],
    tbl_cells: ['8', '?', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: '8 · 8', uz: '8 · 8', en: '8 · 8' },
      { ru: '8 · 4', uz: '8 · 4', en: '8 · 4' },
      { ru: '8 + 8', uz: '8 + 8', en: '8 + 8' },
      { ru: '8 · 2', uz: '8 · 2', en: '8 · 2' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Так найдётся лента, а первым спрашивают про пол.', uz: "Bunda lenta topiladi, birinchi bo'lib pol so'ralgan.", en: 'That finds the strip, and the floor is asked about first.' },
      2: { ru: 'Две стороны это ещё не весь пол.', uz: "Ikkita tomon hali butun pol emas.", en: 'Two sides are not the whole floor yet.' },
      3: { ru: 'Две стороны дают половину края, а не пол.', uz: "Ikkita tomon chekkaning yarmini beradi, polni emas.", en: 'Two sides give half the edge, not the floor.' }
    },
    pick_ok: { ru: 'Верно. Сначала пол, потом край.', uz: "To'g'ri. Avval pol, keyin chekka.", en: 'Right. First the floor, then the edge.' },
    step1_q: { ru: 'Сколько квадратных метров плитки?', uz: 'Necha kvadrat metr plitka kerak?', en: 'How many square metres of tiles?' },
    ans1: 64,
    hint1: { ru: 'Восемь умножь на восемь.', uz: "Sakkizni sakkizga ko'paytiring.", en: 'Multiply eight by eight.' },
    step2_q: { ru: 'Сколько метров ленты по краю?', uz: "Chekka bo'ylab necha metr lenta kerak?", en: 'How many metres of strip along the edge?' },
    ans2: 32,
    hint2: { ru: 'По краю четыре стороны, каждая по восемь.', uz: "Chekkada to'rtta tomon, har biri sakkizdan.", en: 'Along the edge there are four sides, each of eight.' },
    check: 'S = 64, P = 32',
    setup_audio: { ru: 'Строители готовят зал. Посмотри на таблицу и реши, с чего начать.', uz: "Quruvchilar zalni tayyorlayapti. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'The builders are getting the hall ready. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Пол зала квадратный, сторона восемь метров. Сколько квадратных метров плитки и сколько метров ленты по краю?', uz: "Zal poli kvadrat, tomoni sakkiz metr. Necha kvadrat metr plitka va chekka bo'ylab necha metr lenta kerak?", en: 'The floor of the hall is square with a side of eight metres. How many square metres of tiles and how many metres of strip along the edge?' },
      on_correct: { ru: 'Шестьдесят четыре квадратных метра плитки и тридцать два метра ленты. Величины разные, потому и числа разные.', uz: "Oltmish to'rt kvadrat metr plitka va o'ttiz ikki metr lenta. Kattaliklar har xil, shuning uchun sonlar ham har xil.", en: 'Sixty four square metres of tiles and thirty two metres of strip. The quantities are different, so the numbers are different too.' },
      on_wrong: { ru: 'Смотри, о чём спрашивают. Пол это клетки внутри, лента это путь по краю.', uz: "Nima so'ralayotganiga qarang. Pol bu ichkaridagi kataklar, lenta bu chekka yo'li.", en: 'Watch what is being asked. The floor is the squares inside, the strip is the path along the edge.' }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Смотри, о какой величине спрашивают', uz: "Uchta topshiriq. Qaysi kattalik so'ralganiga qarang", en: 'Three tasks. Watch which quantity is asked about' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сторона квадрата 9 см. Чему равна площадь в см²?', uz: "Kvadrat tomoni 9 sm. Yuzasi sm² da nechaga teng?", en: 'The side of a square is 9 cm. What is the area in sq cm?' },
        q_speech: { ru: 'сторона квадрата девять сантиметров. Чему равна площадь?', uz: "kvadrat tomoni to'qqiz santimetr. Yuzasi nechaga teng?", en: 'the side of a square is nine centimetres. What is the area?' },
        ans: 81,
        hint: { ru: 'Девять умножь на девять.', uz: "To'qqizni to'qqizga ko'paytiring.", en: 'Multiply nine by nine.' }
      },
      {
        kind: 'num',
        q: { ru: 'Сторона квадрата 3 см. Чему равен периметр в см?', uz: "Kvadrat tomoni 3 sm. Perimetri sm da nechaga teng?", en: 'The side of a square is 3 cm. What is the perimeter in cm?' },
        q_speech: { ru: 'сторона квадрата три сантиметра. Чему равен периметр?', uz: "kvadrat tomoni uch santimetr. Perimetri nechaga teng?", en: 'the side of a square is three centimetres. What is the perimeter?' },
        ans: 12,
        hint: { ru: 'Здесь спрашивают про край. Четыре стороны по три.', uz: "Bu yerda chekka so'ralgan. Uchtadan to'rtta tomon.", en: 'Here the edge is asked about. Four sides of three.' }
      },
      {
        kind: 'num',
        q: { ru: 'Площадь квадрата 36 см². Чему равна сторона в см?', uz: "Kvadrat yuzasi 36 sm². Tomoni sm da nechaga teng?", en: 'The area of a square is 36 sq cm. What is the side in cm?' },
        q_speech: { ru: 'площадь квадрата тридцать шесть квадратных сантиметров. Чему равна сторона?', uz: "kvadrat yuzasi o'ttiz olti kvadrat santimetr. Tomoni nechaga teng?", en: 'the area of a square is thirty six square centimetres. What is the side?' },
        ans: 6,
        hint: { ru: 'Какое число, умноженное само на себя, даёт тридцать шесть.', uz: "Qaysi son o'ziga ko'paytirilganda o'ttiz olti beradi.", en: 'Which number multiplied by itself gives thirty six.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Из всех фигур с одинаковым периметром квадрат вмещает больше всех. Дай верёвку длиной 24 метра: прямоугольник 2 на 10 даст 20 квадратных метров, а квадрат 6 на 6 даст 36. Поэтому загоны и комнаты стараются делать поближе к квадрату.',
      uz: "Perimetri bir xil shakllar ichida kvadrat eng ko'p joy sig'diradi. Uzunligi 24 metr arqon bering: 2 ga 10 to'rtburchak 20 kvadrat metr beradi, 6 ga 6 kvadrat esa 36 beradi. Shuning uchun qo'ra va xonalarni kvadratga yaqinroq qilishga harakat qilishadi.",
      en: 'Of all figures with the same perimeter a square holds the most. Give a rope 24 metres long: a 2 by 10 rectangle gives 20 square metres, and a 6 by 6 square gives 36. That is why pens and rooms are made as close to a square as possible.'
    },
    fact_audio: {
      ru: 'Вот что интересно. Из всех фигур с одинаковым краем квадрат вмещает больше всех. Возьми верёвку длиной двадцать четыре метра. Сделай из неё длинный прямоугольник, два метра на десять, и внутри поместится двадцать квадратных метров. А сделай квадрат, шесть на шесть, и внутри уже тридцать шесть. Край один и тот же, а места намного больше. Поэтому загоны для скота и комнаты стараются делать поближе к квадрату.',
      uz: "Mana qizig'i. Chekkasi bir xil shakllar ichida kvadrat eng ko'p joy sig'diradi. Uzunligi yigirma to'rt metr arqon oling. Undan uzun to'rtburchak yasang, ikki metrga o'n, ichiga yigirma kvadrat metr sig'adi. Kvadrat yasasangiz, oltiga olti, ichida esa o'ttiz olti bo'ladi. Chekka o'sha-o'sha, joy esa ancha ko'p. Shuning uchun mol qo'ralari va xonalarni kvadratga yaqinroq qilishga harakat qilishadi.",
      en: 'Here is something interesting. Of all figures with the same edge a square holds the most. Take a rope twenty four metres long. Make a long rectangle out of it, two metres by ten, and twenty square metres will fit inside. But make a square, six by six, and thirty six will fit. The edge is the same and there is far more room. That is why animal pens and rooms are made as close to a square as possible.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Каждый раз смотри, спрашивают про клетки внутри или про край.', uz: "Oxirida uchta topshiriq. Har safar ichkaridagi kataklar so'ralganmi yoki chekka so'ralganmi, qarang.", en: 'Three tasks at the end. Each time watch whether the squares inside or the edge is asked about.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Смотри, о какой величине спрашивают.', uz: "Qaysi kattalik so'ralganiga qarang.", en: 'Watch which quantity is asked about.' }
    }
  },

  // s14 — YAKUN: keyingisi shakllarni o'lchov bo'yicha solishtirish (reja 41-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Квадратная панель посчитана!', uz: 'Kvadrat panel sanaldi!', en: 'The square panel is worked out!' },
    cando: {
      ru: ['нахожу площадь квадрата стороной', 'не путаю площадь с периметром', 'иду обратно от площади к стороне'],
      uz: ["kvadrat yuzasini tomon bilan topaman", "yuzani perimetr bilan chalkashtirmayman", "yuzadan tomonga qaytib boraman"],
      en: ['I find the area of a square from its side', 'I do not confuse area with perimeter', 'I go back from the area to the side']
    },
    rule_recap: { ru: 'Площадь квадрата это сторона, умноженная сама на себя.', uz: "Kvadrat yuzasi bu tomonni o'ziga ko'paytirgani.", en: 'The area of a square is the side multiplied by itself.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 35: площадь прямоугольника; урок 31: периметр', uz: "35-dars: to'rtburchak yuzasi; 31-dars: perimetr", en: 'lesson 35: the area of a rectangle; lesson 31: perimeter' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'сравнение фигур по названной величине', uz: "shakllarni aytilgan kattalik bo'yicha solishtirish", en: 'comparing figures by a named quantity' },
    audio: {
      ru: 'Квадратная панель посчитана. Запомни главное. У квадрата все стороны одинаковые, поэтому площадь находят одним числом, стороной, умноженной саму на себя. Ответ пишут в квадратных единицах. А четыре стороны дают периметр, это уже другая величина, и путать их нельзя. В следующий раз поставим рядом две фигуры и научимся сравнивать их по названной мерке!',
      uz: "Kvadrat panel sanaldi. Asosiysini eslab qoling. Kvadratning hamma tomoni bir xil, shuning uchun yuza bitta son bilan topiladi, tomonni o'ziga ko'paytirish orqali. Javob kvadrat birlikda yoziladi. To'rtta tomon esa perimetrni beradi, bu boshqa kattalik, ularni chalkashtirib bo'lmaydi. Keyingi safar ikkita shaklni yonma-yon qo'yib, ularni aytilgan o'lchov bo'yicha solishtirishni o'rganamiz!",
      en: 'The square panel is worked out. Remember the main thing. A square has all its sides the same, so the area is found from one number, the side multiplied by itself. The answer is written in square units. And four sides give the perimeter, that is already a different quantity, and they must not be confused. Next time we will put two figures side by side and learn to compare them by a named measure!'
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Посчитаем ряды.', uz: 'Qatorlarni sanaymiz.', en: 'Let us count the rows.' },
  s2:  { ru: 'Измерим обе стороны.', uz: "Ikkala tomonni o'lchaymiz.", en: 'Let us measure both sides.' },
  s3:  { ru: 'Соберём это в правило.', uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing.", en: 'Read the drawing.' },
  s5:  { ru: 'Разложи записи.', uz: 'Yozuvlarni ajrating.', en: 'Sort the lines.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут выбрали не то действие.', uz: "Bu yerda amal boshqa tanlanibdi.", en: 'Here the wrong operation was chosen.' },
  s9:  { ru: 'А вот и Бит со своим открытием.', uz: "Mana Bit ham o'z kashfiyoti bilan.", en: 'And here is Bit with his discovery.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И обратный путь.', uz: "Teskari yo'l ham bor.", en: 'And the way back.' },
  s12: { ru: 'Задача от строителей.', uz: 'Quruvchilardan masala.', en: 'A task from the builders.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Квадратная панель посчитана. Одно число рассказало о ней всё.',
  uz: "Kvadrat panel sanaldi. Bitta son u haqida hammasini aytdi.",
  en: 'The square panel is worked out. One number told us everything about it.'
};

// ============================================================
// 1-SINF ANIMATSION KIT (etalon — keyingi darslar shundan meros oladi)
// Barcha sikllar prefers-reduced-motion bilan to'xtaydi (CSS @media + usePrefersReducedMotion).
// ============================================================



































// ============================================================
// LUMO VIZUALIZATORLAR — «BIT SHAHRI» (yuzlik/o'nlik/birlik):
// chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik).
// Qizil mitti yulduz osmoni, chiroqli minoralar. Razryad-mat (3 ustun).
// ============================================================



const withBridgeAudio = (c, key) => {
  const b = BRIDGES[key];
  if (!b || !c.audio || !c.audio.intro) return c;
  return { ...c, audio: { ...c.audio, intro: { ru: `${b.ru} ${c.audio.intro.ru}`, uz: `${b.uz} ${c.audio.intro.uz}` } } };
};



















// --- RAZRYAD-MAT (3 ustun: yuzlik/o'nlik/birlik). concrete -> panel/lenta/chiroq; digits -> raqam.

// --- ZAL TAXTASI (D36): 8-darsning qadimgi zali kitdan keladi, dars faqat markaziy
// taxtaga o'z narsasini qo'yadi — kvadrat panel, tomoni belgilangan. Chapda va o'ngda
// mavzuning ikki yuzi: yuza (ichkaridagi kataklar) va perimetr (chekka bo'ylab yo'l).
const SquareNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x={HALL_SLAB.x} y={HALL_SLAB.y} width={HALL_SLAB.w} height={HALL_SLAB.h} rx="5" fill="#E4D3AC" stroke="#8A7550" strokeWidth="2"/>
    <rect x="130" y="99" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="107.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'КВАДРАТНАЯ ПАНЕЛЬ', 'KVADRAT PANEL', 'THE SQUARE PANEL')}</text>
    {/* kvadrat panel: 4 ga 4, tomoni belgilangan */}
    <g transform="translate(140 114)">
      {Array.from({ length: 4 }).map((_, r) => (
        Array.from({ length: 4 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 10} y={r * 10} width="10" height="10"
            fill={(r + c) % 2 ? '#DCEBF5' : '#EAF4FA'} stroke="#7FA8BF" strokeWidth="0.7"/>
        ))
      ))}
      <rect x="0" y="0" width="40" height="40" fill="none" stroke="#FFB92E" strokeWidth="2.4"/>
      <text x="20" y="50" textAnchor="middle" fontSize="7" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">a</text>
    </g>
    <text x="228" y="132" textAnchor="middle" fontSize="11" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">a · a</text>
    <text x="228" y="146" textAnchor="middle" fontSize="7" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ПЛОЩАДЬ', 'YUZA', 'AREA')}</text>
    {/* chap artefakt: chekka bo'ylab yo'l — perimetr */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <rect x="-14" y="-16" width="28" height="28" fill="none" stroke="#C06A2E" strokeWidth="2.4"/>
      <g fill="#C06A2E">{[[-14, -16], [14, -16], [14, 12], [-14, 12]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="2"/>)}</g>
      <text x="0" y="17" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'КРАЙ', 'CHEKKA', 'THE EDGE')}</text>
    </g>
    {/* o'ng artefakt: tomon o'lchovlari tosh-tabletlarda */}
    {[['3', 92], ['5', 110], ['6', 128], ['8', 146]].map(([g, y], i) => (
      <g key={i} transform={`translate(306 ${y})`}>
        <rect x="0" y="0" width="26" height="14" rx="3" fill="#E4D3AC" stroke="#8A7550" strokeWidth="1"/>
        <text x="13" y="11" textAnchor="middle" fontSize="9" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">{g}</text>
      </g>
    ))}
    <circle className="lm-glow" cx="300" cy="88" r="2.4" fill="#BFF0C8"/>
  </svg>
  );
};

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <AncientHallBg fill/>
      <SquareNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- FACTCARD QAHRAMONI: bir xil arqon, ikki xil shakl. Chekka teng, ichkaridagi joy esa
// yo'q. Kataklar chizilgan: bola sanab tekshirishi mumkin, gap ishonishda emas.
const RopeFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(12 30)">
      {Array.from({ length: 2 }).map((_, r) => (
        Array.from({ length: 10 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 8} y={r * 8} width="8" height="8" fill="#F7F1E4" stroke="#C9BCA2" strokeWidth="0.6"/>
        ))
      ))}
      <rect x="0" y="0" width="80" height="16" fill="none" stroke="#C06A2E" strokeWidth="2.2"/>
      <text x="40" y="30" textAnchor="middle" fontSize="9" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">20</text>
    </g>
    <g transform="translate(130 22)">
      {Array.from({ length: 6 }).map((_, r) => (
        Array.from({ length: 6 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 8} y={r * 8} width="8" height="8" fill="#FDF3E0" stroke="#C9BCA2" strokeWidth="0.6"/>
        ))
      ))}
      <rect x="0" y="0" width="48" height="48" fill="none" stroke="#C06A2E" strokeWidth="2.2"/>
      <text x="24" y="62" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">36</text>
    </g>
    <text x="110" y="16" textAnchor="middle" fontSize="8" letterSpacing="1.2" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">24</text>
    <path d="M104 40 h14 m-4 -4 l4 4 l-4 4" fill="none" stroke="#8A7550" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: RopeFig
});
