// Dars 39 amaliyoti — Uchburchak turlari, parallel va perpendikulyar.
// Nazariya: src/components/grade3/Dars39.jsx (num-3-39).
// Uchburchak ikki belgi bo'yicha ajratiladi — burchaklari (to'g'ri, o'tkir, o'tmas) va
// tomonlari (teng tomonli, teng yonli, har xil); parallel chiziqlar kesishmaydi,
// perpendikulyarlar to'g'ri burchak ostida kesishadi; holat turini o'zgartirmaydi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 dnd · 3 input · 4 choice · 5 match · 6 input · 7 multi · 8 order · 9 choice · 10 dnd
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS39_BANK = {
  title: 'Dars 39 · Uchburchak turlari',
  items: [

    /* 1 · order · 🟢 — turni aniqlash qadamlari. */
    q('01', 'Turni aniqlash', '🟢', 'd39-steps', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "Uchburchakning burchak bo'yicha turini aniqlaymiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Turini aytaman', 'Eng katta burchakni topaman', 'Uni to\'g\'ri burchak bilan solishtiraman'],
        y: "Avval eng katta burchakni topamiz, keyin uni to'g'ri burchak bilan solishtiramiz, oxirida turini aytamiz.",
        n: 'Burchak bo\'yicha turni qaysi burchak hal qiladi?',
        r: 'Burchak bo\'yicha turni shaklning ENG KATTA burchagi belgilaydi.',
      },
      {
        e: 'Три шага', s: 'Определяем вид треугольника по углам.',
        a: 'Выбери шаги по порядку.',
        o: ['Называю вид', 'Нахожу самый большой угол', 'Сравниваю его с прямым углом'],
        y: 'Сначала находим самый большой угол, потом сравниваем его с прямым, в конце называем вид.',
        n: 'Какой угол решает вид по углам?',
        r: 'Вид по углам определяет САМЫЙ БОЛЬШОЙ угол фигуры.',
      }),

    /* 2 · dnd · 🟢 — burchak bo'yicha tur. */
    q('02', 'Burchak bo\'yicha', '🟢', 'd39-by-angle', 'dnd', '📐', [0, 1, 0, 1],
      {
        e: 'Eng katta burchak', s: "To'rtta uchburchak. Har birining eng katta burchagi berilgan.",
        a: 'Uchburchaklarni ajrating: qaysilarida to\'g\'ri burchak bor, qaysilarida yo\'q.',
        tokens: [
          'Eng katta burchak to\'g\'ri',
          'Eng katta burchak o\'tkir',
          'Bitta burchak varaq burchagidek',
          'Hamma burchak to\'g\'ridan kichik',
        ],
        zones: ['To\'g\'ri burchakli', 'To\'g\'ri burchakli emas'],
        dndHint: 'Uchburchaklar tugadi.',
        y: "Varaq burchagi bu to'g'ri burchak. Hamma burchagi undan kichik bo'lsa, uchburchak o'tkir burchakli.",
        n: 'Varaq burchagi — bu to\'g\'ri burchak. Shu bilan solishtiring.',
        r: 'To\'g\'ri burchak bo\'lsa, uchburchak to\'g\'ri burchakli deyiladi.',
      },
      {
        e: 'Самый большой угол', s: 'Четыре треугольника. У каждого указан самый большой угол.',
        a: 'Разложи треугольники: у каких есть прямой угол, а у каких нет.',
        tokens: [
          'Самый большой угол прямой',
          'Самый большой угол острый',
          'Один угол как угол листа',
          'Все углы меньше прямого',
        ],
        zones: ['Прямоугольный', 'Не прямоугольный'],
        dndHint: 'Треугольники закончились.',
        y: 'Угол листа — это прямой угол. Если все углы меньше него, треугольник остроугольный.',
        n: 'Угол листа бумаги — это прямой угол. С ним и сравнивай.',
        r: 'Если есть прямой угол, треугольник называют прямоугольным.',
      }),

    /* 3 · input · 🟢 — nechta tomon. */
    q('03', 'Nechta tomon?', '🟢', 'd39-sides-count', 'input', '🔢', ['3'],
      {
        e: 'Umumiysi', s: "Uchta uchburchak bir-biriga umuman o'xshamaydi.",
        a: 'Har bir uchburchakda nechta tomon bor?',
        y: "Uchta. Uchta tomon va uchta burchak har qanday uchburchakda bor, ular qanaqaligi esa boshqa masala.",
        n: 'Nomining o\'ziga qarang: uch burchak, demak tomon ham...',
        r: 'Har qanday uchburchakda uchta tomon va uchta burchak bor.',
        p: 'Javob',
      },
      {
        e: 'Что общего', s: 'Три треугольника совсем не похожи друг на друга.',
        a: 'Сколько сторон у каждого треугольника?',
        y: 'Три. Три стороны и три угла есть у любого треугольника, а какие они — уже другой вопрос.',
        n: 'Посмотри на само название: три угла, значит и сторон...',
        r: 'У любого треугольника три стороны и три угла.',
        p: 'Ответ',
      }, 'numeric'),

    /* 4 · choice · 🟡 — teng yonli. */
    q('04', 'Ikki tomon teng', '🟡', 'd39-isosceles', 'choice', '🔒', 1,
      {
        e: 'Tomonlar bo\'yicha', s: "Uchburchakning tomonlari 5 sm, 5 sm va 3 sm.",
        a: 'Bu qanday uchburchak?',
        o: ['Teng tomonli', 'Teng yonli', 'Har xil tomonli', 'To\'g\'ri burchakli'],
        y: "Ikki tomon bir xil uzunlikda — 5 va 5. Bunday uchburchak teng yonli deyiladi.",
        n: 'Tomonlarni solishtiring: nechtasi bir xil?',
        by: [
          "Teng tomonlida UCHALA tomon teng bo'ladi. Bu yerda uchinchisi boshqa.",
          undefined,
          "Har xil tomonlida hamma tomon turlicha. Bu yerda ikkitasi bir xil.",
          "Bu burchak bo'yicha tur, tomonlar haqida emas. Burchaklar berilmagan.",
        ],
        r: 'Ikki tomon teng bo\'lsa, uchburchak teng yonli.',
      },
      {
        e: 'По сторонам', s: 'Стороны треугольника 5 см, 5 см и 3 см.',
        a: 'Какой это треугольник?',
        o: ['Равносторонний', 'Равнобедренный', 'Разносторонний', 'Прямоугольный'],
        y: 'Две стороны одинаковой длины — 5 и 5. Такой треугольник называют равнобедренным.',
        n: 'Сравни стороны: сколько из них одинаковых?',
        by: [
          'У равностороннего равны ВСЕ ТРИ стороны. А здесь третья другая.',
          undefined,
          'У разностороннего все стороны разные. А здесь две одинаковые.',
          'Это вид по углам, а не по сторонам. Углы тут не даны.',
        ],
        r: 'Если две стороны равны, треугольник равнобедренный.',
      }),

    /* 5 · match · 🟡 — tomonlar va tur. */
    q('05', 'Tomonlar va tur', '🟡', 'd39-match-sides', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch uchburchak', s: 'Har birining tomonlari berilgan.',
        a: 'Har uchburchakni uning turiga ulang.',
        left: ['4 sm, 4 sm, 4 sm', '6 sm, 6 sm, 2 sm', '3 sm, 4 sm, 5 sm'],
        right: ['Teng tomonli', 'Teng yonli', 'Har xil tomonli'],
        y: "Uchala tomon teng — teng tomonli. Ikkitasi teng — teng yonli. Hammasi turlicha — har xil tomonli.",
        n: 'Har uchburchakda nechta tomon bir xil ekanini sanang.',
        r: 'Tomonlar bo\'yicha tur teng tomonlar soniga qarab aniqlanadi.',
      },
      {
        e: 'Три треугольника', s: 'У каждого даны стороны.',
        a: 'Соедини каждый треугольник с его видом.',
        left: ['4 см, 4 см, 4 см', '6 см, 6 см, 2 см', '3 см, 4 см, 5 см'],
        right: ['Равносторонний', 'Равнобедренный', 'Разносторонний'],
        y: 'Все три стороны равны — равносторонний. Две равны — равнобедренный. Все разные — разносторонний.',
        n: 'В каждом треугольнике посчитай, сколько сторон одинаковых.',
        r: 'Вид по сторонам определяют по числу равных сторон.',
      }),

    /* 6 · input · 🟡 — teng tomonli perimetri. */
    q('06', 'Teng tomonli perimetri', '🟡', 'd39-equilateral-perimeter', 'input', '📏', ['18'],
      {
        e: 'Uchala tomon teng', s: "Teng tomonli uchburchakning bir tomoni 6 sm.",
        a: 'Perimetri necha santimetr?',
        y: "Uchala tomon 6 ga teng. 6 + 6 + 6 = 18 santimetr.",
        n: 'Teng tomonlida hamma tomon bir xil. Uchtasini qo\'shing.',
        r: 'Teng tomonli uchburchakda bitta tomon hamma tomonni beradi.',
        p: 'Javob',
      },
      {
        e: 'Все три стороны равны', s: 'Одна сторона равностороннего треугольника 6 см.',
        a: 'Чему равен периметр в сантиметрах?',
        y: 'Все три стороны равны 6. 6 + 6 + 6 = 18 сантиметров.',
        n: 'У равностороннего все стороны одинаковые. Сложи три из них.',
        r: 'У равностороннего треугольника одна сторона задаёт все стороны.',
        p: 'Ответ',
      }, 'numeric'),

    /* 7 · multi · 🟡 — to'g'ri gaplar. */
    q('07', 'To\'g\'ri gaplar', '🟡', 'd39-true-facts', 'multi', '✅', [0, 2],
      {
        e: 'Ta\'rifni aniqlaymiz', s: "To'rtta gap. Ikkitasi to'g'ri.",
        a: 'Qaysi gaplar to\'g\'ri? Hammasini belgilang.',
        o: [
          'Teng tomonli uchburchak ayni paytda teng yonli ham',
          'Uchburchakni burasak, uning turi o\'zgaradi',
          'Uchburchakda har doim uchta burchak bor',
          'Har qanday uchburchakda to\'g\'ri burchak bor',
        ],
        y: "Teng tomonlida uchalasi teng, demak ikkitasi ham teng — bu teng yonlining alohida holi. Burchaklar soni esa har doim uchta.",
        n: 'Shaklni burash uning tomonlarini va burchaklarini o\'zgartiradimi?',
        r: 'Shaklning holati uning turini o\'zgartirmaydi.',
      },
      {
        e: 'Уточняем определение', s: 'Четыре утверждения. Два из них верны.',
        a: 'Какие утверждения верны? Отметь все.',
        o: [
          'Равносторонний треугольник одновременно и равнобедренный',
          'Если треугольник повернуть, его вид изменится',
          'У треугольника всегда три угла',
          'У любого треугольника есть прямой угол',
        ],
        y: 'У равностороннего равны все три, значит и две тоже — это частный случай равнобедренного. А углов всегда три.',
        n: 'Меняет ли поворот фигуры её стороны и углы?',
        r: 'Положение фигуры не меняет её вида.',
      }),

    /* 8 · order · 🔴 — perimetr bo'yicha tartib. */
    q('08', 'Perimetr bo\'yicha', '🔴', 'd39-sort-perimeter', 'order', '📈', [1, 2, 0, 3],
      {
        e: 'To\'rt uchburchak', s: 'Har birining tomonlari berilgan.',
        a: 'Uchburchaklarni perimetri bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['5 sm, 5 sm, 4 sm', '3 sm, 3 sm, 3 sm', '4 sm, 4 sm, 2 sm', '6 sm, 7 sm, 8 sm'],
        y: '3+3+3 = 9, keyin 4+4+2 = 10, keyin 5+5+4 = 14, oxirida 6+7+8 = 21.',
        n: 'Har uchburchakda uchta tomonni qo\'shing.',
        r: 'Uchburchak perimetri uchala tomonning yig\'indisi.',
      },
      {
        e: 'Четыре треугольника', s: 'У каждого даны стороны.',
        a: 'Расставь треугольники по периметру от меньшего к большему.',
        o: ['5 см, 5 см, 4 см', '3 см, 3 см, 3 см', '4 см, 4 см, 2 см', '6 см, 7 см, 8 см'],
        y: '3+3+3 = 9, потом 4+4+2 = 10, потом 5+5+4 = 14, в конце 6+7+8 = 21.',
        n: 'В каждом треугольнике сложи три стороны.',
        r: 'Периметр треугольника это сумма всех трёх сторон.',
      }),

    /* 9 · choice · 🔴 — parallel va perpendikulyar. */
    q('09', 'Ikki chiziq', '🔴', 'd39-lines', 'choice', '🔀', 2,
      {
        e: 'Chiziqlar', s: "Ikki chiziq hech qachon kesishmaydi, qancha davom ettirsak ham.",
        a: 'Bunday chiziqlar qanday ataladi?',
        o: ['Perpendikulyar', 'Kesishuvchi', 'Parallel', 'Teng'],
        y: "Kesishmaydigan chiziqlar parallel deyiladi. Perpendikulyarlar esa kesishadi, ammo to'g'ri burchak ostida.",
        n: 'Chiziqlar kesishadimi yoki yo\'qmi? Shundan boshlang.',
        by: [
          "Perpendikulyarlar kesishadi, faqat to'g'ri burchak ostida.",
          'Bu chiziqlar aynan kesishmaydi.',
          undefined,
          "Teng — bu uzunlik haqida, chiziqlarning joylashuvi haqida emas.",
        ],
        r: 'Parallel chiziqlar kesishmaydi, perpendikulyarlar to\'g\'ri burchak ostida kesishadi.',
      },
      {
        e: 'Линии', s: 'Две линии никогда не пересекаются, сколько их ни продолжай.',
        a: 'Как называются такие линии?',
        o: ['Перпендикулярные', 'Пересекающиеся', 'Параллельные', 'Равные'],
        y: 'Линии, которые не пересекаются, называют параллельными. А перпендикулярные пересекаются, но под прямым углом.',
        n: 'Пересекаются линии или нет? С этого и начни.',
        by: [
          'Перпендикулярные пересекаются, просто под прямым углом.',
          'Эти линии как раз не пересекаются.',
          undefined,
          'Равные — это про длину, а не про расположение линий.',
        ],
        r: 'Параллельные линии не пересекаются, перпендикулярные пересекаются под прямым углом.',
      }),

    /* 10 · dnd · 🔴 — ikki belgi bo'yicha. */
    q('10', 'Ikki belgi', '🔴', 'd39-two-signs', 'dnd', '🚀', [0, 1, 0, 1],
      {
        e: 'Yakuniy mashq', s: "To'rtta ta'rif. Ba'zilari burchak haqida, ba'zilari tomon haqida.",
        a: 'Ta\'riflarni ajrating: qaysilari burchak, qaysilari tomon belgisi.',
        tokens: ['To\'g\'ri burchakli', 'Teng yonli', 'O\'tkir burchakli', 'Har xil tomonli'],
        zones: ['Burchak belgisi', 'Tomon belgisi'],
        dndHint: 'Ta\'riflar tugadi.',
        y: "Uchburchak ikki belgi bo'yicha ajratiladi: burchaklari bo'yicha va tomonlari bo'yicha. Bitta uchburchakda ikkala tur ham bo'ladi.",
        n: 'Nomida burchak so\'zi bormi yoki tomon haqidami?',
        r: 'Uchburchakning ikki belgisi bor: burchaklari va tomonlari.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре названия. Одни про углы, другие про стороны.',
        a: 'Разложи названия: какие по углам, а какие по сторонам.',
        tokens: ['Прямоугольный', 'Равнобедренный', 'Остроугольный', 'Разносторонний'],
        zones: ['Признак по углам', 'Признак по сторонам'],
        dndHint: 'Названия закончились.',
        y: 'Треугольник различают по двум признакам: по углам и по сторонам. У одного треугольника есть оба вида.',
        n: 'В названии есть слово про угол или про сторону?',
        r: 'У треугольника два признака: углы и стороны.',
      }),
  ],
};

export default DARS39_BANK;
