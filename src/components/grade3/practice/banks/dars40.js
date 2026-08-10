// Dars 40 amaliyoti — Simmetriya o'qi va burchak gradusi.
// Nazariya: src/components/grade3/Dars40.jsx (num-3-40).
// O'q — shakl buklanganda yarmilari ustma-ust tushadigan chiziq (kvadratda 4,
// to'rtburchakda 2); to'g'ri burchak 90 gradus, o'tkir kichik, o'tmas katta.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 choice · 3 order · 4 dnd · 5 multi · 6 match · 7 dnd · 8 input · 9 order · 10 multi
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS40_BANK = {
  title: 'Dars 40 · Simmetriya o\'qi va burchak',
  items: [

    /* 1 · match · 🟢 — shakl va o'qlar soni. */
    q('01', 'Nechta o\'q?', '🟢', 'd40-match-axes', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch shakl', s: "Har shaklni chiziq bo'ylab buklaymiz va yarmilarga qaraymiz.",
        a: 'Har shaklni uning simmetriya o\'qlari soniga ulang.',
        left: ['Kvadrat', 'To\'rtburchak', 'Har xil tomonli uchburchak'],
        right: ['4 ta o\'q', '2 ta o\'q', 'O\'q yo\'q'],
        y: "Kvadrat to'rt xil buklanadi, to'rtburchak ikki xil, har xil tomonli uchburchakda esa mos tushadigan buklash yo'q.",
        n: 'Har shaklni xayolan buklang: yarmilar ustma-ust tushadimi?',
        r: 'O\'q — bu shakl buklanganda yarmilari ustma-ust tushadigan chiziq.',
      },
      {
        e: 'Три фигуры', s: 'Каждую фигуру сгибаем по линии и смотрим на половинки.',
        a: 'Соедини каждую фигуру с числом её осей симметрии.',
        left: ['Квадрат', 'Прямоугольник', 'Разносторонний треугольник'],
        right: ['4 оси', '2 оси', 'Осей нет'],
        y: 'Квадрат складывается четырьмя способами, прямоугольник двумя, а у разностороннего треугольника совпадающего сгиба нет.',
        n: 'Мысленно согни каждую фигуру: половинки совпадут?',
        r: 'Ось — это линия, по которой фигура складывается так, что половинки совпадают.',
      }),

    /* 2 · choice · 🟢 — to'g'ri burchak. */
    q('02', 'To\'g\'ri burchak', '🟢', 'd40-right-angle', 'choice', '🔒', 2,
      {
        e: 'Burchak o\'lchovi', s: "Burchaklar gradus bilan o'lchanadi.",
        a: 'To\'g\'ri burchak nechaga teng?',
        o: ['100 gradus', '45 gradus', '90 gradus', '180 gradus'],
        y: "To'g'ri burchak 90 gradusga teng. Varaq burchagi aynan shunday.",
        n: 'Varaq burchagini eslang: uning o\'z aniq o\'lchovi bor.',
        by: [
          "Yumaloq yuz soni bu yerda hech nima bildirmaydi, to'g'ri burchakning o'z o'lchovi bor.",
          "Qirq besh bu to'g'rining yarmi, bunday burchak o'tkir.",
          undefined,
          "Bir yuz sakson bu yoyiq burchak, ya'ni to'g'ri chiziq.",
        ],
        r: 'To\'g\'ri burchak 90 gradus.',
      },
      {
        e: 'Мера угла', s: 'Углы измеряют в градусах.',
        a: 'Чему равен прямой угол?',
        o: ['100 градусов', '45 градусов', '90 градусов', '180 градусов'],
        y: 'Прямой угол равен 90 градусам. Угол листа бумаги именно такой.',
        n: 'Вспомни угол листа: у него своя точная мера.',
        by: [
          'Круглое число здесь ничего не значит, у прямого угла своя мера.',
          'Сорок пять это половина прямого, такой угол острый.',
          undefined,
          'Сто восемьдесят это развёрнутый угол, то есть прямая линия.',
        ],
        r: 'Прямой угол равен 90 градусам.',
      }),

    /* 3 · order · 🟢 — tekshiruv qadamlari. */
    q('03', 'Qanday tekshiramiz', '🟢', 'd40-check-steps', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "Chiziq simmetriya o'qi ekanini tekshiramiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Mos tushsa — bu o\'q', 'Shaklni shu chiziq bo\'ylab buklayman', 'Yarmilar ustma-ust tushdimi, qarayman'],
        y: "Avval buklaymiz, keyin yarmilarga qaraymiz, oxirida xulosa chiqaramiz. Ko'z bilan chamalash tekshiruv emas.",
        n: 'Ko\'rinishiga ishonmang. Aniq tekshiruv nima bilan bo\'ladi?',
        r: 'O\'q deb faqat yarmilar ustma-ust tushgan chiziqni atash mumkin.',
      },
      {
        e: 'Три шага', s: 'Проверяем, будет ли линия осью симметрии.',
        a: 'Выбери шаги по порядку.',
        o: ['Совпали — значит это ось', 'Сгибаю фигуру по этой линии', 'Смотрю, совпали ли половинки'],
        y: 'Сначала сгибаем, потом смотрим на половинки, в конце делаем вывод. На глаз прикинуть — это не проверка.',
        n: 'Не верь виду. Чем делается точная проверка?',
        r: 'Осью можно назвать только ту линию, по которой половинки совпали.',
      }),

    /* 4 · dnd · 🟡 — burchak turlari. */
    q('04', 'Burchak turi', '🟡', 'd40-angle-kind', 'dnd', '📐', [0, 1, 0, 1],
      {
        e: 'Gradusga qarang', s: "To'rtta burchak. To'g'ri burchak 90 gradus.",
        a: 'Burchaklarni ajrating: qaysilari o\'tkir, qaysilari o\'tmas.',
        tokens: ['45 gradus', '120 gradus', '60 gradus', '135 gradus'],
        zones: ['O\'tkir', 'O\'tmas'],
        dndHint: 'Burchaklar tugadi.',
        y: "45 va 60 to'qsondan kichik — o'tkir. 120 va 135 to'qsondan katta — o'tmas.",
        n: 'Har burchakni 90 gradus bilan solishtiring.',
        r: 'O\'tkir burchak to\'g\'ridan kichik, o\'tmas — katta.',
      },
      {
        e: 'Смотри на градусы', s: 'Четыре угла. Прямой угол равен 90 градусам.',
        a: 'Разложи углы: какие острые, а какие тупые.',
        tokens: ['45 градусов', '120 градусов', '60 градусов', '135 градусов'],
        zones: ['Острый', 'Тупой'],
        dndHint: 'Углы закончились.',
        y: '45 и 60 меньше девяноста — острые. 120 и 135 больше девяноста — тупые.',
        n: 'Сравни каждый угол с 90 градусами.',
        r: 'Острый угол меньше прямого, тупой больше.',
      }),

    /* 5 · multi · 🟡 — o'qi bor shakllar. */
    q('05', 'O\'qi bor', '🟡', 'd40-has-axis', 'multi', '🎯', [0, 2, 3],
      {
        e: 'Buklab ko\'ring', s: "To'rtta shakl. Ba'zilarida simmetriya o'qi bor.",
        a: 'Qaysi shakllarda simmetriya o\'qi bor? Hammasini belgilang.',
        o: ['Kvadrat', 'Har xil tomonli uchburchak', 'To\'rtburchak', 'Teng yonli uchburchak'],
        y: "Kvadrat, to'rtburchak va teng yonli uchburchak buklanganda yarmilari mos tushadi. Har xil tomonlida bunday chiziq yo'q.",
        n: 'Shaklda teng qismlar bormi? Ular buklanishga yordam beradi.',
        r: 'Teng tomonlar shaklga simmetriya o\'qini beradi.',
      },
      {
        e: 'Попробуй согнуть', s: 'Четыре фигуры. У некоторых есть ось симметрии.',
        a: 'У каких фигур есть ось симметрии? Отметь все.',
        o: ['Квадрат', 'Разносторонний треугольник', 'Прямоугольник', 'Равнобедренный треугольник'],
        y: 'У квадрата, прямоугольника и равнобедренного треугольника при сгибе половинки совпадают. У разностороннего такой линии нет.',
        n: 'Есть ли в фигуре равные части? Они и помогают сгибу.',
        r: 'Равные стороны дают фигуре ось симметрии.',
      }),

    /* 6 · match · 🟡 — burchak va turi. */
    q('06', 'Burchak va nomi', '🟡', 'd40-match-angle', 'match', '📏', [0, 1, 2],
      {
        e: 'Uch burchak', s: 'Har burchakning gradusi berilgan.',
        a: 'Har burchakni uning nomiga ulang.',
        left: ['90 gradus', '30 gradus', '150 gradus'],
        right: ['To\'g\'ri', 'O\'tkir', 'O\'tmas'],
        y: "90 bu to'g'ri burchak, 30 undan kichik — o'tkir, 150 undan katta — o'tmas.",
        n: 'Har gradusni 90 bilan solishtiring.',
        r: 'Burchak turi 90 gradus bilan solishtirishdan aniqlanadi.',
      },
      {
        e: 'Три угла', s: 'У каждого угла дана мера в градусах.',
        a: 'Соедини каждый угол с его названием.',
        left: ['90 градусов', '30 градусов', '150 градусов'],
        right: ['Прямой', 'Острый', 'Тупой'],
        y: '90 это прямой угол, 30 меньше него — острый, 150 больше — тупой.',
        n: 'Сравни каждую меру с 90.',
        r: 'Вид угла определяют сравнением с 90 градусами.',
      }),

    /* 7 · dnd · 🟡 — chiziq o'qmi. */
    q('07', 'Bu o\'qmi?', '🟡', 'd40-is-axis', 'dnd', '🪞', [0, 1, 0, 1],
      {
        e: 'Buklash natijasi', s: "To'rtta buklash. Ba'zilarida yarmilar mos tushdi.",
        a: 'Buklashlarni ajrating: qayerda o\'q chiqdi, qayerda yo\'q.',
        tokens: [
          'Yarmilar aniq ustma-ust tushdi',
          'Bir yarmi kattaroq chiqdi',
          'Ikkala yarim bir xil bo\'ldi',
          'Yarmilarning tepasi va pasti har xil',
        ],
        zones: ['Bu o\'q', 'Bu o\'q emas'],
        dndHint: 'Buklashlar tugadi.',
        y: "O'q deb faqat yarmilar to'liq mos tushgan chiziqni atash mumkin. Qolgan hollarda chiziq shunchaki chiziq.",
        n: 'Yarmilar to\'liq mos tushdimi yoki farq bormi?',
        r: 'Mos tushmasa, chiziq simmetriya o\'qi bo\'lmaydi.',
      },
      {
        e: 'Результат сгиба', s: 'Четыре сгиба. В некоторых половинки совпали.',
        a: 'Разложи сгибы: где вышла ось, а где нет.',
        tokens: [
          'Половинки точно совпали',
          'Одна половинка вышла больше',
          'Обе половинки одинаковые',
          'Верх и низ половинок разные',
        ],
        zones: ['Это ось', 'Это не ось'],
        dndHint: 'Сгибы закончились.',
        y: 'Осью можно назвать только линию, по которой половинки полностью совпали. В остальных случаях это просто линия.',
        n: 'Половинки совпали полностью или есть разница?',
        r: 'Если не совпали, линия не будет осью симметрии.',
      }),

    /* 8 · input · 🔴 — kvadratdagi o'qlar. */
    q('08', 'Kvadratdagi o\'qlar', '🔴', 'd40-square-axes', 'input', '🔢', ['4'],
      {
        e: 'Sanang', s: "Kvadrat bo'ylab va ko'ndalang buklanadi, yana ikki diagonal bo'ylab ham.",
        a: 'Kvadratda nechta simmetriya o\'qi bor?',
        y: "Ikkita to'g'ri buklash va ikkita diagonal buklash, jami to'rtta o'q. Kvadratda o'q ko'p, chunki hamma tomoni teng.",
        n: 'To\'g\'ri buklashlarni va diagonal buklashlarni alohida sanang.',
        r: 'Kvadratda to\'rtta simmetriya o\'qi bor.',
        p: 'Javob',
      },
      {
        e: 'Посчитай', s: 'Квадрат складывается вдоль и поперёк, а ещё по двум диагоналям.',
        a: 'Сколько осей симметрии у квадрата?',
        y: 'Два прямых сгиба и два диагональных, всего четыре оси. У квадрата осей много, потому что все стороны равны.',
        n: 'Посчитай отдельно прямые сгибы и диагональные.',
        r: 'У квадрата четыре оси симметрии.',
        p: 'Ответ',
      }, 'numeric'),

    /* 9 · order · 🔴 — burchaklarni tartiblash. */
    q('09', 'Burchaklar tartibi', '🔴', 'd40-sort-angles', 'order', '📈', [2, 0, 1, 3],
      {
        e: 'To\'rt burchak', s: 'Har birining gradusi berilgan.',
        a: 'Burchaklarni kichigidan kattasiga tartiblang.',
        o: ['90 gradus', '120 gradus', '45 gradus', '180 gradus'],
        y: '45, keyin 90, keyin 120, oxirida 180. Birinchisi o\'tkir, ikkinchisi to\'g\'ri, uchinchisi o\'tmas, oxirgisi yoyiq.',
        n: 'Gradus sonlarini oddiy sonlar kabi solishtiring.',
        r: 'Burchaklar gradus soni bo\'yicha solishtiriladi.',
      },
      {
        e: 'Четыре угла', s: 'У каждого дана мера в градусах.',
        a: 'Расставь углы от меньшего к большему.',
        o: ['90 градусов', '120 градусов', '45 градусов', '180 градусов'],
        y: '45, потом 90, потом 120, в конце 180. Первый острый, второй прямой, третий тупой, последний развёрнутый.',
        n: 'Сравнивай числа градусов как обычные числа.',
        r: 'Углы сравнивают по числу градусов.',
      }),

    /* 10 · multi · 🔴 — to'g'ri gaplar. */
    q('10', 'To\'g\'ri gaplar', '🔴', 'd40-true-facts', 'multi', '🚀', [0, 2],
      {
        e: 'Yakuniy mashq', s: "To'rtta gap. Ikkitasi to'g'ri.",
        a: 'Qaysi gaplar to\'g\'ri? Hammasini belgilang.',
        o: [
          'O\'tkir burchak to\'g\'ridan kichik',
          'Har qanday shaklda simmetriya o\'qi bor',
          'Kvadratda to\'rtburchakdan ko\'ra o\'q ko\'proq',
          'To\'g\'ri burchak 100 gradus',
        ],
        y: "O'tkir burchak 90 dan kichik, kvadratda esa to'rtta o'q, to'rtburchakda ikkita. Har xil tomonli uchburchakda o'q umuman yo'q.",
        n: 'Har gapni tekshiring: buklash yoki 90 gradus bilan solishtirish yordam beradi.',
        r: 'O\'q shaklning teng qismlaridan chiqadi, burchak turi esa 90 gradusdan.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре утверждения. Два из них верны.',
        a: 'Какие утверждения верны? Отметь все.',
        o: [
          'Острый угол меньше прямого',
          'У любой фигуры есть ось симметрии',
          'У квадрата осей больше, чем у прямоугольника',
          'Прямой угол равен 100 градусам',
        ],
        y: 'Острый угол меньше 90, а у квадрата четыре оси против двух у прямоугольника. У разностороннего треугольника осей нет вовсе.',
        n: 'Проверь каждое утверждение: помогает сгиб или сравнение с 90 градусами.',
        r: 'Ось появляется из равных частей фигуры, а вид угла — из сравнения с 90 градусами.',
      }),
  ],
};

export default DARS40_BANK;
