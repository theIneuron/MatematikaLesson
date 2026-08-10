import React from 'react';
import { AncientHallBg, BitSVG, HALL_SLAB, LUMO_CAST, createLesson, useLang} from './_kit/index.jsx';
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
  lessonId: 'num-3-36',
  lessonTitle: { ru: 'Урок 36. Площадь квадрата', uz: "36-dars. Kvadrat yuzasi" }
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
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Площадь квадрата', uz: 'Kvadrat yuzasi' },
    lead: { ru: 'Квадратная панель, в ряду 6 клеток', uz: "Kvadrat panel, qatorda 6 katak" },
    order_cap: { ru: 'у квадрата все стороны одинаковые', uz: "kvadratning hamma tomoni bir xil" },
    plate: ['6', '·', '6'],
    q: { ru: 'Сколько клеток на квадратной панели?', uz: 'Kvadrat panelda nechta katak bor?' },
    opt0: { ru: '36', uz: '36' },
    opt1: { ru: '24', uz: '24' },
    opt2: { ru: '12', uz: '12' },
    opt3: { ru: '30', uz: '30' },
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
        ]
      },
      on_correct: { ru: 'Верно! Сейчас увидишь, почему у квадрата хватает одного числа.', uz: "To'g'ri! Endi kvadratga nega bitta son yetishini ko'rasiz." },
      on_wrong1: { ru: 'Двадцать четыре это путь по краю, четыре стороны по шесть. Мы считаем клетки внутри.', uz: "Yigirma to'rt bu chekka yo'li, to'rtta tomon oltitadan. Biz ichkaridagi kataklarni sanaymiz." },
      on_wrong2: { ru: 'Двенадцать это две стороны вместе. Клеток намного больше.', uz: "O'n ikki bu ikkita tomon birga. Kataklar ancha ko'p." },
      on_idk: { ru: 'Ничего. Сейчас посчитаем ряды и всё станет видно.', uz: "Hechqisi yo'q. Hozir qatorlarni sanaymiz va hammasi ko'rinadi." }
    }
  },

  // s1 — MODEL: kvadratda qator soni qatordagi katak soniga TENG.
  s1: {
    eyebrow: { ru: 'Модель', uz: 'Model' },
    lead: { ru: 'Заполняем квадратную панель рядами', uz: "Kvadrat panelni qatorlab to'ldiramiz" },
    task_line: 'сторона 5 клеток',
    task_line_uz: "tomoni 5 katak",
    step1: '5 + 5 + 5 + 5 + 5',
    step1_cap: { ru: 'пять одинаковых рядов по 5 клеток', uz: "5 katakdan beshta bir xil qator" },
    step2: '5 · 5 = 25',
    step2_cap: { ru: 'у квадрата оба числа одинаковые', uz: 'kvadratda ikkala son bir xil' },
    res: { ru: 'S = 25 см²', uz: 'S = 25 sm²' },
    btn1: { ru: 'Посчитать ряд', uz: 'Qatorni sanash' },
    btn2: { ru: 'Посчитать ряды', uz: 'Qatorlarni sanash' },
    done_text: { ru: 'Двадцать пять клеток. Оба числа одинаковые, потому что фигура квадратная.', uz: "Yigirma besh katak. Ikkala son bir xil, chunki shakl kvadrat." },
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
      ]
    }
  },

  // s2 — MODEL: uzunlik ham, en ham BITTA son — tomon.
  s2: {
    eyebrow: { ru: 'Модель', uz: 'Model' },
    w: 4,
    h: 4,
    lead: { ru: 'У квадрата длина и ширина это одно число', uz: "Kvadratda uzunlik ham, en ham bitta son" },
    capA: { ru: 'длина 4', uz: 'uzunlik 4' },
    capB: { ru: 'ширина 4', uz: 'en 4' },
    res: 'a = 4',
    name_a: { ru: 'длина', uz: 'uzunlik' },
    name_b: { ru: 'ширина', uz: 'en' },
    btn1: { ru: 'Измерить длину', uz: "Uzunlikni o'lchash" },
    btn2: { ru: 'Измерить ширину', uz: "Enni o'lchash" },
    done_text: { ru: 'Оба измерения дали четыре. Такое число называют стороной квадрата.', uz: "Ikkala o'lchov ham to'rt berdi. Bunday sonni kvadratning tomoni deyishadi." },
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
      ]
    }
  },

  // s3 — QOIDA: S = a · a (162-bet).
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Как найти площадь квадрата со стороной 6?', uz: "Tomoni 6 bo'lgan kvadratning yuzasi qanday topiladi?" },
    opts: [
      { ru: '6 · 6', uz: '6 · 6' },
      { ru: '6 · 4', uz: '6 · 4' },
      { ru: '6 + 6', uz: '6 + 6' },
      { ru: '6 · 2', uz: '6 · 2' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Четыре стороны по шесть это путь по краю, то есть периметр.', uz: "Oltitadan to'rtta tomon bu chekka yo'li, ya'ni perimetr." },
      2: { ru: 'Сложение сторон площади не даёт, клетки так не появятся.', uz: "Tomonlarni qo'shish yuza bermaydi, kataklar bunday chiqmaydi." },
      3: { ru: 'Это только два ряда, а рядов столько же, сколько клеток в ряду.', uz: "Bu atigi ikki qator, qator esa qatordagi katak soniga teng." }
    },
    on_correct: { ru: 'Верно. Сторона умножается сама на себя.', uz: "To'g'ri. Tomon o'ziga ko'paytiriladi." },
    rule_lines: {
      ru: ['площадь квадрата: S = a · a', 'a это сторона', 'ответ в квадратных единицах'],
      uz: ["kvadrat yuzasi: S = a · a", "a bu tomon", "javob kvadrat birlikda"]
    },
    rule_ex: { ru: 'S = 6 · 6 = 36 см²', uz: 'S = 6 · 6 = 36 sm²' },
    rule_speech: { ru: 'Площадь квадрата это сторона, умноженная сама на себя. Если сторона шесть сантиметров, площадь тридцать шесть квадратных сантиметров.', uz: "Kvadrat yuzasi bu tomonni o'ziga ko'paytirgani. Tomon olti santimetr bo'lsa, yuza o'ttiz olti kvadrat santimetr." },
    audio: {
      intro: { ru: 'Соберём правило. У квадрата обе стороны одинаковые, значит нужно одно число.', uz: "Qoidani yig'amiz. Kvadratda ikkala tomon bir xil, demak bitta son kerak." }
    }
  },

  // s4 — CHIZMA: tomoni 3 bo'lgan kvadrat.
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'Сторона 3 см. Чему равна площадь?', uz: "Tomoni 3 sm. Yuzasi nechaga teng?" },
    fig_w: 3,
    fig_h: 3,
    opts: [
      { ru: '9 см²', uz: '9 sm²' },
      { ru: '12 см²', uz: '12 sm²' },
      { ru: '6 см²', uz: '6 sm²' },
      { ru: '3 см²', uz: '3 sm²' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Двенадцать это четыре стороны по три, путь по краю.', uz: "O'n ikki bu uchtadan to'rtta tomon, chekka yo'li." },
      2: { ru: 'Шесть это две стороны вместе, а нужно умножить.', uz: "Olti bu ikkita tomon birga, kerak bo'lgani ko'paytirish." },
      3: { ru: 'Три это сама сторона, а не число клеток.', uz: "Uch bu tomonning o'zi, katak soni emas." }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. Сторона три сантиметра. Сколько квадратных сантиметров внутри?', uz: "Chizmaga qarang. Tomoni uch santimetr. Ichkarida necha kvadrat santimetr bor?" },
      on_correct: { ru: 'Верно. Три ряда по три клетки.', uz: "To'g'ri. Uchtadan uchta qator." },
      on_wrong: { ru: 'Считай клетки внутри, а не шаги по краю.', uz: "Chekka qadamlarini emas, ichkaridagi kataklarni sanang." }
    }
  },

  // s5 — SARALASH: perimetr yozuvlari va yuza yozuvlari (M1 asosiy tuzoq).
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи записи квадрата по величинам', uz: 'Kvadrat yozuvlarini kattaliklarga ajrating' },
    bin_a: { ru: 'периметр', uz: 'perimetr' },
    bin_b: { ru: 'площадь', uz: 'yuza' },
    items: [
      { n: { ru: 'a · 4', uz: 'a · 4' }, a: true, hint: { ru: 'Четыре одинаковые стороны это край.', uz: "To'rtta bir xil tomon bu chekka." } },
      { n: { ru: 'a · a', uz: 'a · a' }, a: false, hint: { ru: 'Сторона на саму себя даёт клетки.', uz: "Tomonni o'ziga ko'paytirish kataklarni beradi." } },
      { n: { ru: 'ответ в см', uz: 'javob sm da' }, a: true, hint: { ru: 'Длину меряют обычными единицами.', uz: "Uzunlik oddiy birlikda o'lchanadi." } },
      { n: { ru: 'ответ в см²', uz: 'javob sm² da' }, a: false, hint: { ru: 'Квадратные единицы считают клетки.', uz: "Kvadrat birliklar kataklarni sanaydi." } }
    ],
    audio: {
      intro: { ru: 'Четыре записи про один и тот же квадрат. Отправь каждую к своей величине.', uz: "Bitta kvadrat haqida to'rtta yozuv. Har birini o'z kattaligiga yuboring." },
      on_correct: { ru: 'Всё на месте. Умножение стороны на себя это площадь, четыре стороны это периметр.', uz: "Hammasi joyida. Tomonni o'ziga ko'paytirish bu yuza, to'rtta tomon bu perimetr." },
      on_wrong: { ru: 'Спроси себя, обходит запись фигуру или заполняет.', uz: "O'zingizdan so'rang, yozuv shaklni aylanadimi yoki to'ldiradimi." }
    }
  },

  // s6 — TEST: tomoni 8.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Сторона квадрата 8 см. Площадь?', uz: "Kvadrat tomoni 8 sm. Yuzasi?" },
    opts: [
      { ru: '64 см²', uz: '64 sm²' },
      { ru: '32 см²', uz: '32 sm²' },
      { ru: '16 см²', uz: '16 sm²' },
      { ru: '24 см²', uz: '24 sm²' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Тридцать два это периметр, четыре стороны по восемь.', uz: "O'ttiz ikki bu perimetr, sakkiztadan to'rtta tomon." },
      2: { ru: 'Шестнадцать это две стороны вместе.', uz: "O'n olti bu ikkita tomon birga." },
      3: { ru: 'Двадцать четыре это три стороны, такой величины нет.', uz: "Yigirma to'rt bu uchta tomon, bunday kattalik yo'q." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Сторона восемь сантиметров, чему равна площадь?', uz: "Tez savol. Tomoni sakkiz santimetr, yuzasi nechaga teng?" },
      on_correct: { ru: 'Верно, восемь на восемь.', uz: "To'g'ri, sakkizga sakkiz." },
      on_wrong: { ru: 'Умножай сторону саму на себя.', uz: "Tomonni o'ziga ko'paytiring." }
    }
  },

  // s7 — KONSOL: tomoni 6, yuza va perimetr YONMA-YON.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Заполни консоль для квадрата со стороной 6', uz: "Tomoni 6 bo'lgan kvadrat uchun konsolni to'ldiring" },
    swap_line: { ru: 'квадрат 6', uz: 'kvadrat 6' },
    cells: [
      { head: { ru: 'сторона', uz: 'tomon' }, label: { ru: 'клеток', uz: 'katak' }, ans: 6, hint: { ru: 'Столько клеток вдоль одной стороны.', uz: "Bitta tomon bo'ylab shuncha katak bor." } },
      { head: { ru: 'площадь', uz: 'yuza' }, label: '6 · 6', ans: 36, hint: { ru: 'Сторона умножается сама на себя.', uz: "Tomon o'ziga ko'paytiriladi." } },
      { head: { ru: 'периметр', uz: 'perimetr' }, label: '6 · 4', ans: 24, hint: { ru: 'Четыре одинаковые стороны по шесть.', uz: "Oltitadan to'rtta bir xil tomon." } }
    ],
    check: { ru: 'S = 36 см², P = 24 см', uz: 'S = 36 sm², P = 24 sm' },
    check_label: { ru: 'две разные величины', uz: 'ikki xil kattalik' },
    audio: {
      intro: { ru: 'Заполни три окна. Сторона, площадь и периметр одной и той же панели.', uz: "Uchta oynani to'ldiring. Bitta panelning tomoni, yuzasi va perimetri." },
      on_correct: { ru: 'Тридцать шесть квадратных сантиметров и двадцать четыре сантиметра. Одна фигура, а величины разные.', uz: "O'ttiz olti kvadrat santimetr va yigirma to'rt santimetr. Shakl bitta, kattaliklar esa har xil." }
    }
  },

  // s8 — XATONI TOP: tomon to'rtga ko'paytirilgan (M1).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Сторона 5 см, записали S = 20 см². Где ошибка?', uz: "Tomoni 5 sm, S = 20 sm² deb yozilibdi. Xato qayerda?" },
    fig_line: '5 · 4 = 20',
    opts: [
      { ru: 'сторону умножили на 4', uz: "tomon 4 ga ko'paytirilgan" },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'сторону взяли не ту', uz: "tomon noto'g'ri olingan" },
      { ru: 'забыли единицы', uz: "birliklar unutilgan" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Двадцать это путь по краю. Клеток внутри двадцать пять.', uz: "Yigirma bu chekka yo'li. Ichkarida yigirma beshta katak bor." },
      2: { ru: 'Сторона взята верно, пять. Подвело действие.', uz: "Tomon to'g'ri olingan, besh. Amal aldabdi." },
      3: { ru: 'Единицы на месте, а вот число получено не тем действием.', uz: "Birliklar joyida, son esa boshqa amal bilan chiqarilgan." }
    },
    audio: {
      intro: { ru: 'Кто-то посчитал площадь квадрата со стороной пять и получил двадцать. Найди ошибку.', uz: "Kimdir tomoni besh bo'lgan kvadratning yuzasini hisoblab, yigirma olibdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Умножение на четыре даёт периметр, а площадь это сторона на саму себя.', uz: "To'g'ri. To'rtga ko'paytirish perimetrni beradi, yuza esa tomonni o'ziga ko'paytirgani." },
      on_wrong: { ru: 'Сравни записи. Одна обходит квадрат, другая заполняет.', uz: "Yozuvlarni solishtiring. Biri kvadratni aylanadi, ikkinchisi to'ldiradi." }
    }
  },

  // s9 — BIT TUZOG'I: tomoni 4 da sonlar mos tushadi (M3).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит нашёл у квадрата со стороной 4 равенство', uz: "Bit tomoni 4 bo'lgan kvadratda tenglik topdi" },
    lines: ['сторона 4: S = 16, P = 16', 'Бит: площадь и периметр всегда равны'],
    lines_uz: ["tomoni 4: S = 16, P = 16", "Bit: yuza va perimetr har doim teng"],
    line_cap: { ru: 'Бит: числа совпали, значит правило', uz: "Bit: sonlar mos tushdi, demak qoida" },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, это только при стороне 4', 'да, у квадрата всегда так'], uz: ["yo'q, bu faqat tomoni 4 da", 'ha, kvadratda har doim shunday'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Возьми сторону пять и увидишь двадцать пять против двадцати. Числа совпали один раз, да и величины тут разные. Одна в сантиметрах, другая в квадратных.', uz: "Ha. Tomonni besh qilib olsangiz, yigirma beshga qarshi yigirma chiqadi. Sonlar bir marta mos tushdi, kattaliklar esa har xil. Biri santimetrda, ikkinchisi kvadratda." },
    trap_wrong: { ru: 'Проверь на другой стороне. Возьми пять и посчитай обе величины, они разойдутся.', uz: "Boshqa tomonda tekshiring. Beshni olib, ikkala kattalikni hisoblang, ular ajralib ketadi." },
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
      ]
    }
  },

  // s10 — TRENAJYOR: to'g'ridan-to'g'ri yuza.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Сторона квадрата 7 см. Чему равна площадь в см²?', uz: "Kvadrat tomoni 7 sm. Yuzasi sm² da nechaga teng?" },
    ans: 49,
    check: 'S = 7 · 7',
    check_label: { ru: 'сторона на саму себя', uz: "tomon o'ziga" },
    hint: { ru: 'Семь умножь на семь.', uz: "Yettini yettiga ko'paytiring." },
    audio: {
      intro: { ru: 'Теперь считай сам. Сторона семь сантиметров, чему равна площадь?', uz: "Endi o'zingiz hisoblang. Tomoni yetti santimetr, yuzasi nechaga teng?" },
      on_correct: { ru: 'Сорок девять квадратных сантиметров.', uz: "Qirq to'qqiz kvadrat santimetr." }
    }
  },

  // s11 — TRENAJYOR: teskari yo'l, yuzadan tomonga.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Площадь квадрата 25 см². Чему равна сторона в см?', uz: "Kvadrat yuzasi 25 sm². Tomoni sm da nechaga teng?" },
    ans: 5,
    check: '5 · 5 = 25',
    check_label: { ru: 'проверка умножением', uz: "ko'paytirib tekshirish" },
    hint: { ru: 'Ищи число, которое умножили само на себя и получили двадцать пять.', uz: "O'ziga ko'paytirilib yigirma besh chiqqan sonni qidiring." },
    audio: {
      intro: { ru: 'А теперь обратный путь. Площадь двадцать пять квадратных сантиметров, чему равна сторона?', uz: "Endi teskari yo'l. Yuza yigirma besh kvadrat santimetr, tomoni nechaga teng?" },
      on_correct: { ru: 'Пять сантиметров. Пять на пять даёт двадцать пять.', uz: "Besh santimetr. Beshga besh yigirma besh beradi." }
    }
  },

  // s12 — MASALA: ikki amal, savolga qarab kattalik tanlanadi (M1 + M2).
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Квадратный зал кристаллов', uz: 'Kvadrat kristall zali' },
    q: { ru: 'Пол зала квадратный, сторона 8 м. Сколько квадратных метров плитки на пол и сколько метров ленты по краю?', uz: "Zal poli kvadrat, tomoni 8 m. Polga necha kvadrat metr plitka va chekka bo'ylab necha metr lenta kerak?" },
    q_speech: { ru: 'пол зала квадратный, сторона восемь метров. Сколько квадратных метров плитки на пол и сколько метров ленты по краю?', uz: "zal poli kvadrat, tomoni sakkiz metr. Polga necha kvadrat metr plitka va chekka bo'ylab necha metr lenta kerak?" },
    tbl_heads: [
      { ru: 'сторона', uz: 'tomon' },
      { ru: 'плитка', uz: 'plitka' },
      { ru: 'лента', uz: 'lenta' }
    ],
    tbl_cells: ['8', '?', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: '8 · 8', uz: '8 · 8' },
      { ru: '8 · 4', uz: '8 · 4' },
      { ru: '8 + 8', uz: '8 + 8' },
      { ru: '8 · 2', uz: '8 · 2' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Так найдётся лента, а первым спрашивают про пол.', uz: "Bunda lenta topiladi, birinchi bo'lib pol so'ralgan." },
      2: { ru: 'Две стороны это ещё не весь пол.', uz: "Ikkita tomon hali butun pol emas." },
      3: { ru: 'Две стороны дают половину края, а не пол.', uz: "Ikkita tomon chekkaning yarmini beradi, polni emas." }
    },
    pick_ok: { ru: 'Верно. Сначала пол, потом край.', uz: "To'g'ri. Avval pol, keyin chekka." },
    step1_q: { ru: 'Сколько квадратных метров плитки?', uz: 'Necha kvadrat metr plitka kerak?' },
    ans1: 64,
    hint1: { ru: 'Восемь умножь на восемь.', uz: "Sakkizni sakkizga ko'paytiring." },
    step2_q: { ru: 'Сколько метров ленты по краю?', uz: "Chekka bo'ylab necha metr lenta kerak?" },
    ans2: 32,
    hint2: { ru: 'По краю четыре стороны, каждая по восемь.', uz: "Chekkada to'rtta tomon, har biri sakkizdan." },
    check: 'S = 64, P = 32',
    setup_audio: { ru: 'Строители готовят зал. Посмотри на таблицу и реши, с чего начать.', uz: "Quruvchilar zalni tayyorlayapti. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Пол зала квадратный, сторона восемь метров. Сколько квадратных метров плитки и сколько метров ленты по краю?', uz: "Zal poli kvadrat, tomoni sakkiz metr. Necha kvadrat metr plitka va chekka bo'ylab necha metr lenta kerak?" },
      on_correct: { ru: 'Шестьдесят четыре квадратных метра плитки и тридцать два метра ленты. Величины разные, потому и числа разные.', uz: "Oltmish to'rt kvadrat metr plitka va o'ttiz ikki metr lenta. Kattaliklar har xil, shuning uchun sonlar ham har xil." },
      on_wrong: { ru: 'Смотри, о чём спрашивают. Пол это клетки внутри, лента это путь по краю.', uz: "Nima so'ralayotganiga qarang. Pol bu ichkaridagi kataklar, lenta bu chekka yo'li." }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Смотри, о какой величине спрашивают', uz: "Uchta topshiriq. Qaysi kattalik so'ralganiga qarang" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сторона квадрата 9 см. Чему равна площадь в см²?', uz: "Kvadrat tomoni 9 sm. Yuzasi sm² da nechaga teng?" },
        q_speech: { ru: 'сторона квадрата девять сантиметров. Чему равна площадь?', uz: "kvadrat tomoni to'qqiz santimetr. Yuzasi nechaga teng?" },
        ans: 81,
        hint: { ru: 'Девять умножь на девять.', uz: "To'qqizni to'qqizga ko'paytiring." }
      },
      {
        kind: 'num',
        q: { ru: 'Сторона квадрата 3 см. Чему равен периметр в см?', uz: "Kvadrat tomoni 3 sm. Perimetri sm da nechaga teng?" },
        q_speech: { ru: 'сторона квадрата три сантиметра. Чему равен периметр?', uz: "kvadrat tomoni uch santimetr. Perimetri nechaga teng?" },
        ans: 12,
        hint: { ru: 'Здесь спрашивают про край. Четыре стороны по три.', uz: "Bu yerda chekka so'ralgan. Uchtadan to'rtta tomon." }
      },
      {
        kind: 'num',
        q: { ru: 'Площадь квадрата 36 см². Чему равна сторона в см?', uz: "Kvadrat yuzasi 36 sm². Tomoni sm da nechaga teng?" },
        q_speech: { ru: 'площадь квадрата тридцать шесть квадратных сантиметров. Чему равна сторона?', uz: "kvadrat yuzasi o'ttiz olti kvadrat santimetr. Tomoni nechaga teng?" },
        ans: 6,
        hint: { ru: 'Какое число, умноженное само на себя, даёт тридцать шесть.', uz: "Qaysi son o'ziga ko'paytirilganda o'ttiz olti beradi." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Из всех фигур с одинаковым периметром квадрат вмещает больше всех. Дай верёвку длиной 24 метра: прямоугольник 2 на 10 даст 20 квадратных метров, а квадрат 6 на 6 даст 36. Поэтому загоны и комнаты стараются делать поближе к квадрату.',
      uz: "Perimetri bir xil shakllar ichida kvadrat eng ko'p joy sig'diradi. Uzunligi 24 metr arqon bering: 2 ga 10 to'rtburchak 20 kvadrat metr beradi, 6 ga 6 kvadrat esa 36 beradi. Shuning uchun qo'ra va xonalarni kvadratga yaqinroq qilishga harakat qilishadi."
    },
    fact_audio: {
      ru: 'Вот что интересно. Из всех фигур с одинаковым краем квадрат вмещает больше всех. Возьми верёвку длиной двадцать четыре метра. Сделай из неё длинный прямоугольник, два метра на десять, и внутри поместится двадцать квадратных метров. А сделай квадрат, шесть на шесть, и внутри уже тридцать шесть. Край один и тот же, а места намного больше. Поэтому загоны для скота и комнаты стараются делать поближе к квадрату.',
      uz: "Mana qizig'i. Chekkasi bir xil shakllar ichida kvadrat eng ko'p joy sig'diradi. Uzunligi yigirma to'rt metr arqon oling. Undan uzun to'rtburchak yasang, ikki metrga o'n, ichiga yigirma kvadrat metr sig'adi. Kvadrat yasasangiz, oltiga olti, ichida esa o'ttiz olti bo'ladi. Chekka o'sha-o'sha, joy esa ancha ko'p. Shuning uchun mol qo'ralari va xonalarni kvadratga yaqinroq qilishga harakat qilishadi."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Каждый раз смотри, спрашивают про клетки внутри или про край.', uz: "Oxirida uchta topshiriq. Har safar ichkaridagi kataklar so'ralganmi yoki chekka so'ralganmi, qarang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Смотри, о какой величине спрашивают.', uz: "Qaysi kattalik so'ralganiga qarang." }
    }
  },

  // s14 — YAKUN: keyingisi shakllarni o'lchov bo'yicha solishtirish (reja 41-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Квадратная панель посчитана!', uz: 'Kvadrat panel sanaldi!' },
    cando: {
      ru: ['нахожу площадь квадрата стороной', 'не путаю площадь с периметром', 'иду обратно от площади к стороне'],
      uz: ["kvadrat yuzasini tomon bilan topaman", "yuzani perimetr bilan chalkashtirmayman", "yuzadan tomonga qaytib boraman"]
    },
    rule_recap: { ru: 'Площадь квадрата это сторона, умноженная сама на себя.', uz: "Kvadrat yuzasi bu tomonni o'ziga ko'paytirgani." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 35: площадь прямоугольника; урок 31: периметр', uz: "35-dars: to'rtburchak yuzasi; 31-dars: perimetr" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'сравнение фигур по названной величине', uz: "shakllarni aytilgan kattalik bo'yicha solishtirish" },
    audio: {
      ru: 'Квадратная панель посчитана. Запомни главное. У квадрата все стороны одинаковые, поэтому площадь находят одним числом, стороной, умноженной саму на себя. Ответ пишут в квадратных единицах. А четыре стороны дают периметр, это уже другая величина, и путать их нельзя. В следующий раз поставим рядом две фигуры и научимся сравнивать их по названной мерке!',
      uz: "Kvadrat panel sanaldi. Asosiysini eslab qoling. Kvadratning hamma tomoni bir xil, shuning uchun yuza bitta son bilan topiladi, tomonni o'ziga ko'paytirish orqali. Javob kvadrat birlikda yoziladi. To'rtta tomon esa perimetrni beradi, bu boshqa kattalik, ularni chalkashtirib bo'lmaydi. Keyingi safar ikkita shaklni yonma-yon qo'yib, ularni aytilgan o'lchov bo'yicha solishtirishni o'rganamiz!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Посчитаем ряды.', uz: 'Qatorlarni sanaymiz.' },
  s2:  { ru: 'Измерим обе стороны.', uz: "Ikkala tomonni o'lchaymiz." },
  s3:  { ru: 'Соберём это в правило.', uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing." },
  s5:  { ru: 'Разложи записи.', uz: 'Yozuvlarni ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут выбрали не то действие.', uz: "Bu yerda amal boshqa tanlanibdi." },
  s9:  { ru: 'А вот и Бит со своим открытием.', uz: "Mana Bit ham o'z kashfiyoti bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И обратный путь.', uz: "Teskari yo'l ham bor." },
  s12: { ru: 'Задача от строителей.', uz: 'Quruvchilardan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Квадратная панель посчитана. Одно число рассказало о ней всё.',
  uz: "Kvadrat panel sanaldi. Bitta son u haqida hammasini aytdi."
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
    <text x="200" y="107.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'КВАДРАТНАЯ ПАНЕЛЬ' : 'KVADRAT PANEL'}</text>
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
    <text x="228" y="146" textAnchor="middle" fontSize="7" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'ПЛОЩАДЬ' : 'YUZA'}</text>
    {/* chap artefakt: chekka bo'ylab yo'l — perimetr */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <rect x="-14" y="-16" width="28" height="28" fill="none" stroke="#C06A2E" strokeWidth="2.4"/>
      <g fill="#C06A2E">{[[-14, -16], [14, -16], [14, 12], [-14, 12]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="2"/>)}</g>
      <text x="0" y="17" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'КРАЙ' : 'CHEKKA'}</text>
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
