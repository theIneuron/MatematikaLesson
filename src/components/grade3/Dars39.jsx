import React from 'react';
import { AncientHallBg, BitSVG, HALL_SLAB, LUMO_CAST, createLesson } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars39 — "Uchburchak turlari, parallel va perpendikulyar"
// (num-3-39) | Б5 «KRISTALL ARXITEKTURA»
// Syujet: kristall kvartal davom etadi (SYUJET_3SINF.md 194-satr, reja 43-satr).
// SAHNA: 8-DARS zali kitdan, markazda darsning tuguni — bino karkaslari.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 120-122-bet).
// YADRO: uchburchak ikki BELGI bo'yicha ajratiladi — burchaklari va tomonlari. Chiziqlar
//   esa parallel (kesishmaydi) yoki perpendikulyar (to'g'ri burchak ostida kesishadi).
//   Shaklning qog'ozdagi HOLATI turini o'zgartirmaydi.
// Misconception: M1 burilgan uchburchakni boshqa tur deb hisoblash; M2 kesishmaydigan har
//   qanday kesmani parallel deyish; M3 «perpendikulyar demak tik»; M4 teng yonli va teng
//   tomonlini bir xil deb bilish.
// FactCard: uchburchak yig'ilmaydi, shuning uchun ko'prik va kran fermalarida turadi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-39',
  lessonTitle: { ru: 'Урок 39. Виды треугольников; параллельные и перпендикулярные', uz: '39-dars. Uchburchak turlari, parallel va perpendikulyar' }
};
// STRUKTURA: s0 xuk uchta uchburchak · s1 burchaklar bo'yicha · s2 tomonlar bo'yicha ·
// s3 QOIDA ikki belgi · s4 chizma bo'yicha tur · s5 saralash parallel yoki perpendikulyar ·
// s6 test perpendikulyar nima · s7 konsol sanoq · s8 xatoni top (burilgan shakl) ·
// s9 Bit tuzog'i (tik demak perpendikulyar) · s10 trenajyor to'g'ri burchaklar ·
// s11 trenajyor teng tomonli perimetri · s12 masala karkas · s13 final + FactCard · s14 yakun.
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

const CONTENT = {
  // s0 — XUK: uchta har xil uchburchak, umumiysi nima.
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Виды треугольников', uz: 'Uchburchak turlari' },
    lead: { ru: 'Три треугольника из каркаса', uz: 'Karkasdan uchta uchburchak' },
    order_cap: { ru: 'все разные, но что-то общее есть', uz: 'hammasi har xil, lekin umumiysi bor' },
    q: { ru: 'Что общего у всех треугольников?', uz: 'Hamma uchburchakda nima umumiy?' },
    opt0: { ru: 'три стороны и три угла', uz: 'uchta tomon va uchta burchak' },
    opt1: { ru: 'прямой угол', uz: "to'g'ri burchak" },
    opt2: { ru: 'равные стороны', uz: 'teng tomonlar' },
    opt3: { ru: 'одинаковый размер', uz: 'bir xil o\'lcham' },
    audio: {
      intro: {
        ru: [
          'Площадь и периметр остаются позади. Сегодня посмотрим на сами фигуры.',
          'В каркасе города три треугольника. Один вытянут, другой ровный, третий с прямым углом.',
          'На вид они очень разные.',
          'Как думаешь, что у них общего?'
        ],
        uz: [
          "Yuza va perimetr ortda qoldi. Bugun shakllarning o'ziga qaraymiz.",
          "Shahar karkasida uchta uchburchak bor. Biri cho'ziq, ikkinchisi tekis, uchinchisida to'g'ri burchak.",
          "Ko'rinishdan ular juda har xil.",
          "Sizningcha, ularning umumiysi nima?"
        ]
      },
      on_correct: { ru: 'Верно! Три стороны и три угла есть у любого треугольника. А вот какие они, уже разное.', uz: "To'g'ri! Uchta tomon va uchta burchak har qanday uchburchakda bor. Ular qanaqaligi esa boshqa masala." },
      on_wrong1: { ru: 'Прямой угол есть только у одного. У остальных углы другие.', uz: "To'g'ri burchak faqat bittasida bor. Qolganlarida burchaklar boshqacha." },
      on_wrong2: { ru: 'Равные стороны не у каждого. Посмотри на вытянутый.', uz: "Teng tomon har birida yo'q. Cho'ziqqa qarang." },
      on_idk: { ru: 'Ничего. Сейчас разберём их по признакам.', uz: "Hechqisi yo'q. Hozir ularni belgilariga qarab ajratamiz." }
    }
  },

  // s1 — MODEL: burchaklar bo'yicha.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Первый признак — углы', uz: "Birinchi belgi — burchaklar" },
    task_line: 'смотрим на самый большой угол',
    task_line_uz: "eng katta burchakka qaraymiz",
    step1: 'прямой угол',
    step1_cap: { ru: 'прямоугольный треугольник', uz: "to'g'ri burchakli uchburchak" },
    step2: 'все углы острые',
    step2_cap: { ru: 'остроугольный треугольник', uz: "o'tkir burchakli uchburchak" },
    res: 'один угол решает',
    btn1: { ru: 'Найти прямой угол', uz: "To'g'ri burchakni topish" },
    btn2: { ru: 'Посмотреть остальные', uz: "Qolganlariga qarash" },
    done_text: { ru: 'Вид по углам определяет самый большой угол фигуры.', uz: "Burchak bo'yicha turni shaklning eng katta burchagi belgilaydi." },
    audio: {
      ru: [
        'Первый признак треугольника это его углы.',
        'Если один угол прямой, такой как у листа бумаги, треугольник называют прямоугольным.',
        'Если все три угла острые, то есть меньше прямого, треугольник остроугольный. А если один угол больше прямого, треугольник тупоугольный. Решает всегда самый большой угол.'
      ],
      uz: [
        "Uchburchakning birinchi belgisi bu uning burchaklari.",
        "Bitta burchak to'g'ri bo'lsa, qog'oz varag'ining burchagidek, uchburchak to'g'ri burchakli deyiladi.",
        "Uchala burchak o'tkir bo'lsa, ya'ni to'g'ridan kichik bo'lsa, uchburchak o'tkir burchakli. Bitta burchak to'g'ridan katta bo'lsa, o'tmas burchakli. Har doim eng katta burchak hal qiladi."
      ]
    }
  },

  // s2 — MODEL: tomonlar bo'yicha.
  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 3,
    h: 3,
    lead: { ru: 'Второй признак — стороны', uz: 'Ikkinchi belgi — tomonlar' },
    capA: { ru: 'две стороны равны — равнобедренный', uz: 'ikki tomon teng — teng yonli' },
    capB: { ru: 'все три равны — равносторонний', uz: 'uchalasi teng — teng tomonli' },
    res: 'считаем равные стороны',
    btn1: { ru: 'Сравнить две стороны', uz: 'Ikki tomonni solishtirish' },
    btn2: { ru: 'Сравнить все три', uz: 'Uchalasini solishtirish' },
    done_text: { ru: 'Равносторонний это особый случай равнобедренного, у него равны все три.', uz: "Teng tomonli bu teng yonlining alohida holi, unda uchalasi teng." },
    audio: {
      ru: [
        'Второй признак это стороны.',
        'Если две стороны одинаковой длины, треугольник называют равнобедренным.',
        'Если одинаковы все три, он равносторонний. Заметь, равносторонний это особый случай равнобедренного, ведь две стороны у него тоже равны. А если все стороны разные, треугольник разносторонний.'
      ],
      uz: [
        "Ikkinchi belgi bu tomonlar.",
        "Ikki tomon bir xil uzunlikda bo'lsa, uchburchak teng yonli deyiladi.",
        "Uchalasi bir xil bo'lsa, u teng tomonli. E'tibor bering, teng tomonli bu teng yonlining alohida holi, chunki unda ham ikki tomon teng. Hamma tomon har xil bo'lsa, uchburchak har xil tomonli."
      ]
    }
  },

  // s3 — QOIDA: ikki belgi, holat ahamiyatsiz.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Треугольник повернули на листе. Что изменилось?', uz: "Uchburchak varaqda burildi. Nima o'zgardi?" },
    opts: [
      { ru: 'ничего', uz: 'hech nima' },
      { ru: 'вид по углам', uz: 'burchak bo\'yicha turi' },
      { ru: 'вид по сторонам', uz: 'tomon bo\'yicha turi' },
      { ru: 'число сторон', uz: 'tomonlar soni' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Углы при повороте не меняются, прямой остаётся прямым.', uz: "Burilganda burchaklar o'zgarmaydi, to'g'ri burchak to'g'riligicha qoladi." },
      2: { ru: 'Длины сторон при повороте те же.', uz: "Burilganda tomonlar uzunligi o'sha-o'sha." },
      3: { ru: 'Сторон всегда три, как ни поворачивай.', uz: "Qanday burasangiz ham tomon har doim uchta." }
    },
    on_correct: { ru: 'Верно. Поворот не меняет ни углы, ни стороны.', uz: "To'g'ri. Burilish na burchakni, na tomonni o'zgartiradi." },
    rule_lines: {
      ru: ['по углам: прямоугольный, остроугольный, тупоугольный', 'по сторонам: равносторонний, равнобедренный, разносторонний', 'поворот вид не меняет'],
      uz: ["burchak bo'yicha: to'g'ri, o'tkir, o'tmas burchakli", "tomon bo'yicha: teng tomonli, teng yonli, har xil tomonli", "burilish turni o'zgartirmaydi"]
    },
    rule_ex: 'два признака: углы и стороны',
    rule_speech: { ru: 'У треугольника два признака. По углам он бывает прямоугольный, остроугольный или тупоугольный. По сторонам равносторонний, равнобедренный или разносторонний. Как фигуру ни поверни, вид останется тем же.', uz: "Uchburchakning ikki belgisi bor. Burchak bo'yicha u to'g'ri, o'tkir yoki o'tmas burchakli bo'ladi. Tomon bo'yicha teng tomonli, teng yonli yoki har xil tomonli. Shaklni qanday bursangiz ham, turi o'sha bo'lib qoladi." },
    audio: {
      intro: { ru: 'Соберём правило. Мы нашли у треугольника два признака.', uz: "Qoidani yig'amiz. Uchburchakda ikki belgi topdik." }
    }
  },

  // s4 — CHIZMA: turini aniqlash (o'z chizmasi bilan).
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'Какой это треугольник по сторонам?', uz: "Bu uchburchak tomonlari bo'yicha qanday?" },
    fig_w: 3,
    fig_h: 3,
    opts: [
      { ru: 'равнобедренный', uz: 'teng yonli' },
      { ru: 'равносторонний', uz: 'teng tomonli' },
      { ru: 'разносторонний', uz: 'har xil tomonli' },
      { ru: 'прямоугольный', uz: "to'g'ri burchakli" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Все три стороны равными не оказались, основание короче.', uz: "Uchala tomon teng chiqmadi, asos qisqaroq." },
      2: { ru: 'Две стороны всё же равны, штрихи это показывают.', uz: "Ikki tomon baribir teng, chiziqchalar shuni ko'rsatadi." },
      3: { ru: 'Это признак по углам, а спрашивают про стороны.', uz: "Bu burchak belgisi, so'ralgani esa tomonlar." }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. Штрихи на сторонах показывают равные. Какой это треугольник по сторонам?', uz: "Chizmaga qarang. Tomonlardagi chiziqchalar tenglarini ko'rsatadi. Bu uchburchak tomonlari bo'yicha qanday?" },
      on_correct: { ru: 'Верно. Две стороны равны, значит равнобедренный.', uz: "To'g'ri. Ikki tomon teng, demak teng yonli." },
      on_wrong: { ru: 'Считай, сколько сторон отмечено одинаковыми штрихами.', uz: "Bir xil chiziqcha bilan belgilangan tomonlarni sanang." }
    }
  },

  // s5 — SARALASH: parallel yoki perpendikulyar.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи описания прямых', uz: "To'g'ri chiziq ta'riflarini ajrating" },
    bin_a: { ru: 'параллельные', uz: 'parallel' },
    bin_b: { ru: 'перпендикулярные', uz: 'perpendikulyar' },
    items: [
      { n: { ru: 'никогда не пересекутся', uz: 'hech qachon kesishmaydi' }, a: true, hint: { ru: 'Это и есть параллельные.', uz: "Bu parallelning o'zi." } },
      { n: { ru: 'пересекаются под прямым углом', uz: "to'g'ri burchak ostida kesishadi" }, a: false, hint: { ru: 'Прямой угол при встрече это признак перпендикулярных.', uz: "Uchrashganda to'g'ri burchak perpendikulyar belgisi." } },
      { n: { ru: 'рельсы дороги', uz: "yo'l relslari" }, a: true, hint: { ru: 'Рельсы идут рядом и не сходятся.', uz: "Relslar yonma-yon boradi va qo'shilmaydi." } },
      { n: { ru: 'угол листа бумаги', uz: 'qog\'oz varag\'ining burchagi' }, a: false, hint: { ru: 'В углу листа стороны встречаются под прямым углом.', uz: "Varaq burchagida tomonlar to'g'ri burchak ostida uchrashadi." } }
    ],
    audio: {
      intro: { ru: 'Четыре описания. Отправь каждое к своим прямым.', uz: "To'rtta ta'rif. Har birini o'z chiziqlariga yuboring." },
      on_correct: { ru: 'Всё на месте. Параллельные не встречаются никогда, перпендикулярные встречаются под прямым углом.', uz: "Hammasi joyida. Parallellar hech qachon uchrashmaydi, perpendikulyarlar to'g'ri burchak ostida uchrashadi." },
      on_wrong: { ru: 'Спроси себя, встретятся эти прямые или нет.', uz: "O'zingizdan so'rang, bu chiziqlar uchrashadimi yoki yo'qmi." }
    }
  },

  // s6 — TEST: perpendikulyar ta'rifi.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Две прямые пересеклись под прямым углом. Какие они?', uz: "Ikki to'g'ri chiziq to'g'ri burchak ostida kesishdi. Ular qanday?" },
    opts: [
      { ru: 'перпендикулярные', uz: 'perpendikulyar' },
      { ru: 'параллельные', uz: 'parallel' },
      { ru: 'вертикальные', uz: 'tik' },
      { ru: 'равные', uz: 'teng' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Параллельные вообще не пересекаются.', uz: "Parallellar umuman kesishmaydi." },
      2: { ru: 'Вертикальная это про положение, а тут про угол встречи.', uz: "Tik bu holat haqida, bu yerda esa uchrashuv burchagi haqida." },
      3: { ru: 'Длина прямых тут ни при чём.', uz: "Chiziqlar uzunligi bu yerda hech nima emas." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Две прямые пересеклись под прямым углом. Как они называются?', uz: "Tez savol. Ikki chiziq to'g'ri burchak ostida kesishdi. Ular qanday ataladi?" },
      on_correct: { ru: 'Верно. Прямой угол при пересечении это перпендикулярные.', uz: "To'g'ri. Kesishganda to'g'ri burchak bo'lsa, bu perpendikulyar." },
      on_wrong: { ru: 'Смотри на угол в точке встречи.', uz: "Uchrashuv nuqtasidagi burchakka qarang." }
    }
  },

  // s7 — KONSOL: sanoq karkas bo'yicha.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Посчитай части прямоугольной рамы', uz: "To'g'ri burchakli ramaning qismlarini sanang" },
    swap_line: 'рама прямоугольная',
    cells: [
      { head: { ru: 'прямых углов', uz: "to'g'ri burchak" }, label: 'штук', ans: 4, hint: { ru: 'У прямоугольника каждый угол прямой.', uz: "To'rtburchakda har bir burchak to'g'ri." } },
      { head: { ru: 'пар параллельных', uz: 'parallel juft' }, label: 'сторон', ans: 2, hint: { ru: 'Противоположные стороны идут парами.', uz: "Qarama-qarshi tomonlar juft bo'lib boradi." } },
      { head: { ru: 'сторон у треугольника', uz: 'uchburchak tomoni' }, label: 'штук', ans: 3, hint: { ru: 'Название фигуры само подсказывает.', uz: "Shakl nomi o'zi aytib turibdi." } }
    ],
    check: '4 угла, 2 пары, 3 стороны',
    check_label: { ru: 'признаки фигур', uz: 'shakl belgilari' },
    audio: {
      intro: { ru: 'Заполни три окна. Прямые углы рамы, пары параллельных сторон и стороны треугольника.', uz: "Uchta oynani to'ldiring. Rama to'g'ri burchaklari, parallel tomon juftlari va uchburchak tomonlari." },
      on_correct: { ru: 'Четыре прямых угла, две пары параллельных сторон и три стороны у треугольника.', uz: "To'rtta to'g'ri burchak, ikkita parallel tomon juftligi va uchburchakda uchta tomon." }
    }
  },

  // s8 — XATONI TOP: burilgan shakl (M1).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Прямоугольный треугольник положили на бок и назвали остроугольным. Где ошибка?', uz: "To'g'ri burchakli uchburchak yonboshiga qo'yilib, o'tkir burchakli deyilibdi. Xato qayerda?" },
    fig_line: 'фигуру просто повернули',
    opts: [
      { ru: 'поворот не меняет углы', uz: "burilish burchakni o'zgartirmaydi" },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'стороны стали другими', uz: 'tomonlar boshqacha bo\'ldi' },
      { ru: 'это уже не треугольник', uz: 'bu endi uchburchak emas' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Прямой угол никуда не делся, он просто смотрит в другую сторону.', uz: "To'g'ri burchak yo'qolmadi, u shunchaki boshqa tomonga qaradi." },
      2: { ru: 'Длины сторон при повороте те же самые.', uz: "Burilganda tomonlar uzunligi o'sha-o'sha." },
      3: { ru: 'Три стороны и три угла на месте, фигура та же.', uz: "Uchta tomon va uchta burchak joyida, shakl o'sha." }
    },
    audio: {
      intro: { ru: 'Кто-то повернул треугольник и решил, что вид сменился. Найди ошибку.', uz: "Kimdir uchburchakni burib, turi o'zgardi deb o'ylabdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Вид определяют углы и стороны, а не положение на листе.', uz: "To'g'ri. Turni burchak va tomonlar belgilaydi, varaqdagi holat emas." },
      on_wrong: { ru: 'Найди на чертеже прямой угол. Он остался.', uz: "Chizmadan to'g'ri burchakni toping. U qolgan." }
    }
  },

  // s9 — BIT TUZOG'I: perpendikulyar demak tik (M3).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит проверяет опоры моста', uz: "Bit ko'prik tayanchlarini tekshiryapti" },
    lines: ['две наклонные балки встретились', 'Бит: они не вертикальные, значит не перпендикулярные'],
    lines_uz: ["ikkita qiya to'sin uchrashdi", "Bit: ular tik emas, demak perpendikulyar emas"],
    line_cap: { ru: 'Бит: перпендикулярные это те, что стоят прямо', uz: "Bit: perpendikulyar bu tik turganlari" },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, важен угол между ними', 'да, они должны стоять прямо'], uz: ["yo'q, ular orasidagi burchak muhim", 'ha, ular tik turishi kerak'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Перпендикулярность это про угол между прямыми, а не про их положение. Две наклонные балки тоже перпендикулярны, если встретились под прямым углом.', uz: "Ha. Perpendikulyarlik chiziqlar orasidagi burchak haqida, ularning holati haqida emas. Ikki qiya to'sin ham to'g'ri burchak ostida uchrashsa, perpendikulyar bo'ladi." },
    trap_wrong: { ru: 'Наклони угол листа бумаги. Стороны всё равно встречаются под прямым углом.', uz: "Qog'oz varag'ining burchagini qiyshaytiring. Tomonlar baribir to'g'ri burchak ostida uchrashadi." },
    audio: {
      ru: [
        'Бит проверяет опоры моста.',
        'Эти балки наклонные, стоят не прямо. Значит перпендикулярными их звать нельзя.',
        'Так ли это?'
      ],
      uz: [
        "Bit ko'prik tayanchlarini tekshiryapti.",
        "Bu to'sinlar qiya, tik turmagan. Demak ularni perpendikulyar deb bo'lmaydi.",
        "Shundaymi?"
      ]
    }
  },

  // s10 — TRENAJYOR: to'g'ri burchaklar soni.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Сколько прямых углов у квадрата?', uz: 'Kvadratda nechta to\'g\'ri burchak bor?' },
    ans: 4,
    check: '4 угла',
    check_label: { ru: 'все углы прямые', uz: "hamma burchak to'g'ri" },
    hint: { ru: 'Посчитай углы квадрата, все они одинаковые.', uz: "Kvadrat burchaklarini sanang, hammasi bir xil." },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько прямых углов у квадрата?', uz: "Endi o'zingiz hisoblang. Kvadratda nechta to'g'ri burchak bor?" },
      on_correct: { ru: 'Четыре. Все углы квадрата прямые.', uz: "To'rtta. Kvadratning hamma burchagi to'g'ri." }
    }
  },

  // s11 — TRENAJYOR: teng tomonlining perimetri.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'У равностороннего треугольника сторона 7 см. Чему равен периметр в см?', uz: "Teng tomonli uchburchak tomoni 7 sm. Perimetri sm da nechaga teng?" },
    ans: 21,
    check: '7 · 3',
    check_label: { ru: 'три равные стороны', uz: 'uchta teng tomon' },
    hint: { ru: 'Все три стороны одинаковые, значит семь взять три раза.', uz: "Uchala tomon bir xil, demak yettini uch marta olish kerak." },
    audio: {
      intro: { ru: 'Равносторонний треугольник со стороной семь сантиметров. Чему равен периметр?', uz: "Tomoni yetti santimetr bo'lgan teng tomonli uchburchak. Perimetri nechaga teng?" },
      on_correct: { ru: 'Двадцать один сантиметр. Три равные стороны по семь.', uz: "Yigirma bir santimetr. Yettitadan uchta teng tomon." }
    }
  },

  // s12 — MASALA: karkas, chekka va ko'ndalang.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Каркас смотровой площадки', uz: 'Kuzatuv maydonchasi karkasi' },
    q: { ru: 'Рама 5 на 3 м. Внутрь ставят 2 перекладины параллельно короткой стороне. Сколько метров планок пойдёт на раму и сколько всего с перекладинами?', uz: "Rama 5 ga 3 m. Ichiga qisqa tomonga parallel 2 ta ko'ndalang qo'yiladi. Ramaga necha metr reyka ketadi va ko'ndalanglar bilan jami qancha?" },
    q_speech: { ru: 'рама пять на три метра, внутрь ставят две перекладины параллельно короткой стороне. Сколько метров планок пойдёт на раму и сколько всего?', uz: "rama besh ga uch metr, ichiga qisqa tomonga parallel ikkita ko'ndalang qo'yiladi. Ramaga necha metr reyka ketadi va jami qancha?" },
    tbl_heads: [
      { ru: 'рама', uz: 'rama' },
      { ru: 'перекладины', uz: "ko'ndalanglar" },
      { ru: 'вопрос', uz: 'savol' }
    ],
    tbl_cells: ['5 и 3', '2 по 3', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: '(5 + 3) · 2', uz: '(5 + 3) · 2' },
      { ru: '5 · 3', uz: '5 · 3' },
      { ru: '3 · 2', uz: '3 · 2' },
      { ru: '5 + 3', uz: '5 + 3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Это площадь площадки, а планки идут по краю.', uz: "Bu maydoncha yuzasi, reykalar esa chekka bo'ylab boradi." },
      2: { ru: 'Перекладины посчитаем вторым действием.', uz: "Ko'ndalanglarni ikkinchi amalda hisoblaymiz." },
      3: { ru: 'Две стороны это только половина рамы.', uz: "Ikki tomon bu ramaning yarmi xolos." }
    },
    pick_ok: { ru: 'Верно. Сначала рама по краю, потом перекладины.', uz: "To'g'ri. Avval chekka bo'ylab rama, keyin ko'ndalanglar." },
    step1_q: { ru: 'Сколько метров планок на раму?', uz: 'Ramaga necha metr reyka kerak?' },
    ans1: 16,
    hint1: { ru: 'Сложи пять и три, потом удвой.', uz: "Besh va uchni qo'shib, keyin ikkilantiring." },
    step2_q: { ru: 'Сколько метров всего с перекладинами?', uz: "Ko'ndalanglar bilan jami necha metr?" },
    ans2: 22,
    hint2: { ru: 'Две перекладины по три метра, прибавь их к раме.', uz: "Uch metrdan ikkita ko'ndalang, ularni ramaga qo'shing." },
    check: 'рама 16, всего 22',
    setup_audio: { ru: 'Площадку собирают из планок. Посмотри на таблицу и реши, с чего начать.', uz: "Maydoncha reykalardan yig'ilyapti. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Рама пять на три метра, внутрь ставят две перекладины по три метра. Сколько планок на раму и сколько всего?', uz: "Rama besh ga uch metr, ichiga uch metrdan ikkita ko'ndalang qo'yiladi. Ramaga qancha reyka va jami qancha?" },
      on_correct: { ru: 'На раму шестнадцать метров, а всего двадцать два. Перекладины параллельны короткой стороне и равны ей.', uz: "Ramaga o'n olti metr, jami esa yigirma ikki. Ko'ndalanglar qisqa tomonga parallel va unga teng." },
      on_wrong: { ru: 'Сначала обойди раму по краю, потом добавь перекладины.', uz: "Avval ramani chekka bo'ylab aylaning, keyin ko'ndalanglarni qo'shing." }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Смотри на признак, а не на положение', uz: "Uchta topshiriq. Holatga emas, belgiga qarang" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько сторон одинаковой длины у равностороннего треугольника?', uz: "Teng tomonli uchburchakda nechta tomon bir xil uzunlikda?" },
        q_speech: { ru: 'сколько сторон одинаковой длины у равностороннего треугольника?', uz: "teng tomonli uchburchakda nechta tomon bir xil uzunlikda?" },
        ans: 3,
        hint: { ru: 'Название фигуры само подсказывает ответ.', uz: "Shakl nomi javobni o'zi aytib turibdi." }
      },
      {
        kind: 'num',
        q: { ru: 'У равнобедренного треугольника основание 4 см, боковые стороны по 6 см. Чему равен периметр в см?', uz: "Teng yonli uchburchakning asosi 4 sm, yon tomonlari 6 sm dan. Perimetri sm da nechaga teng?" },
        q_speech: { ru: 'у равнобедренного треугольника основание четыре сантиметра, боковые по шесть. Чему равен периметр?', uz: "teng yonli uchburchakning asosi to'rt santimetr, yon tomonlari oltitadan. Perimetri nechaga teng?" },
        ans: 16,
        hint: { ru: 'Сложи основание и обе боковые стороны.', uz: "Asos va ikkala yon tomonni qo'shing." }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько пар параллельных сторон у прямоугольника?', uz: "To'rtburchakda nechta juft parallel tomon bor?" },
        q_speech: { ru: 'сколько пар параллельных сторон у прямоугольника?', uz: "to'rtburchakda nechta juft parallel tomon bor?" },
        ans: 2,
        hint: { ru: 'Противоположные стороны идут парами и не пересекаются.', uz: "Qarama-qarshi tomonlar juft bo'lib boradi va kesishmaydi." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Треугольник нельзя перекосить, не сломав стороны, а четырёхугольник складывается легко. Поэтому в фермах мостов, в кранах и в опорах вышек стоят именно треугольники: три стержня держат форму сами по себе.',
      uz: "Uchburchakni tomonlarini sindirmasdan qiyshaytirib bo'lmaydi, to'rtburchak esa oson yig'iladi. Shuning uchun ko'prik fermalarida, kranlarda va minora tayanchlarida aynan uchburchak turadi: uchta sterjen shaklni o'zi ushlab turadi."
    },
    fact_audio: {
      ru: 'Вот чем треугольник особенный. Возьми четыре палочки и скрепи их в четырёхугольник. Такую рамку легко перекосить, она сложится. А теперь возьми три палочки. Треугольник перекосить не выйдет, придётся ломать или гнуть сами стороны. Именно поэтому в фермах мостов, в стрелах кранов и в опорах вышек всюду видны треугольники. Три стержня держат форму сами.',
      uz: "Mana uchburchak nimasi bilan alohida. To'rtta cho'p olib, ularni to'rtburchak qilib biriktiring. Bunday ramkani qiyshaytirish oson, u yig'iladi. Endi uchta cho'p oling. Uchburchakni qiyshaytirib bo'lmaydi, tomonlarning o'zini sindirish yoki bukish kerak bo'ladi. Aynan shuning uchun ko'prik fermalarida, kran strelalarida va minora tayanchlarida hamma joyda uchburchak ko'rinadi. Uchta sterjen shaklni o'zi ushlab turadi."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Смотри на признаки фигуры.', uz: "Oxirida uchta topshiriq. Shakl belgilariga qarang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Вспомни, чем определяется вид.', uz: "Turni nima belgilashini eslang." }
    }
  },

  // s14 — YAKUN: keyingisi simmetriya va burchak (reja 44-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Каркас разобран!', uz: 'Karkas tahlil qilindi!' },
    cando: {
      ru: ['различаю треугольники по углам и сторонам', 'узнаю параллельные и перпендикулярные', 'не путаюсь, когда фигуру повернули'],
      uz: ["uchburchaklarni burchak va tomon bo'yicha ajrataman", "parallel va perpendikulyarni tanib olaman", "shakl burilganda adashmayman"]
    },
    rule_recap: { ru: 'Вид треугольника определяют углы и стороны, а не его положение на листе.', uz: "Uchburchak turini burchak va tomonlar belgilaydi, varaqdagi holati emas." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 31: периметр; урок 38: чтение чертежа', uz: "31-dars: perimetr; 38-dars: chizmani o'qish" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'ось симметрии и градусная мера угла', uz: 'simmetriya o\'qi va burchakning gradus o\'lchovi' },
    audio: {
      ru: 'Каркас разобран. Запомни главное. У треугольника два признака. По углам он прямоугольный, остроугольный или тупоугольный, и решает самый большой угол. По сторонам равносторонний, равнобедренный или разносторонний, и тут считают равные стороны. Прямые называют параллельными, если они никогда не встретятся, и перпендикулярными, если встретились под прямым углом. Как фигуру ни поверни, вид у неё останется прежним. В следующий раз сложим фигуру пополам и посмотрим на симметрию!',
      uz: "Karkas tahlil qilindi. Asosiysini eslab qoling. Uchburchakning ikki belgisi bor. Burchak bo'yicha u to'g'ri, o'tkir yoki o'tmas burchakli, va eng katta burchak hal qiladi. Tomon bo'yicha teng tomonli, teng yonli yoki har xil tomonli, bu yerda teng tomonlar sanaladi. Chiziqlar hech qachon uchrashmasa parallel, to'g'ri burchak ostida uchrashsa perpendikulyar deyiladi. Shaklni qanday bursangiz ham turi o'sha bo'lib qoladi. Keyingi safar shaklni teng ikkiga bukib, simmetriyaga qaraymiz!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Начнём с углов.', uz: 'Burchaklardan boshlaymiz.' },
  s2:  { ru: 'Теперь стороны.', uz: 'Endi tomonlar.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing." },
  s5:  { ru: 'Разложи описания.', uz: "Ta'riflarni ajrating." },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут фигуру просто повернули.', uz: 'Bu yerda shakl shunchaki burilgan.' },
  s9:  { ru: 'А вот и Бит со своей проверкой.', uz: "Mana Bit ham o'z tekshiruvi bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И ещё одна фигура.', uz: 'Yana bitta shakl.' },
  s12: { ru: 'Задача от строителей.', uz: 'Quruvchilardan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Каркас разобран. Теперь виден и вид треугольника, и характер прямых.',
  uz: "Karkas tahlil qilindi. Endi uchburchak turi ham, chiziqlar tabiati ham ko'rinadi."
};

// --- ZAL TAXTASI (D39): markazda karkas — uchta uchburchak va rama, unda parallel va
// perpendikulyar chiziqlar ko'rinadi.
const FrameNodeLayer = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x={HALL_SLAB.x} y={HALL_SLAB.y} width={HALL_SLAB.w} height={HALL_SLAB.h} rx="5" fill="#E4D3AC" stroke="#8A7550" strokeWidth="2"/>
    <rect x="130" y="99" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="107.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">KARKAS</text>
    <g stroke="#2E7E9E" strokeWidth="2.2" fill="none">
      <path d="M128 150 L150 118 L172 150 Z"/>
      <path d="M180 150 L200 118 L214 150 Z"/>
      <path d="M222 150 L222 120 L252 150 Z"/>
    </g>
    <g fill="#C06A2E">
      <rect x="218" y="146" width="8" height="4"/>
      <rect x="218" y="142" width="4" height="8"/>
    </g>
    <line x1="126" y1="155" x2="256" y2="155" stroke="#8A7550" strokeWidth="2"/>
    <line x1="126" y1="114" x2="256" y2="114" stroke="#8A7550" strokeWidth="1.4" strokeDasharray="4 3"/>
    {/* chap artefakt: parallel relslar */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <line x1="-18" y1="-14" x2="18" y2="-14" stroke="#2E7E9E" strokeWidth="2.4"/>
      <line x1="-18" y1="-4" x2="18" y2="-4" stroke="#2E7E9E" strokeWidth="2.4"/>
      <g stroke="#8A7550" strokeWidth="1">{[-12, -2, 8].map((dx, k) => <line key={k} x1={dx} y1="-16" x2={dx} y2="-2"/>)}</g>
      <text x="0" y="-20" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">PARALLEL</text>
    </g>
    {/* o'ng artefakt: to'g'ri burchak belgisi */}
    <g transform="translate(300 108)">
      <rect x="0" y="0" width="34" height="34" rx="3" fill="#E4D3AC" stroke="#8A7550" strokeWidth="1"/>
      <path d="M8 26 L8 8 L26 8" fill="none" stroke="#C06A2E" strokeWidth="2.4"/>
      <rect x="8" y="20" width="6" height="6" fill="none" stroke="#C06A2E" strokeWidth="1.4"/>
    </g>
    <circle className="lm-glow" cx="300" cy="92" r="2.4" fill="#BFF0C8"/>
  </svg>
);

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <AncientHallBg fill/>
      <FrameNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): teng yonli uchburchak, teng tomonlar chiziqcha bilan belgilangan.
const IsoTriangleFig = () => (
  <svg viewBox="0 0 200 120" style={{ width: 'min(240px, 78%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <path d="M100 16 L156 100 L44 100 Z" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2.4" strokeLinejoin="round"/>
    <g stroke="#C06A2E" strokeWidth="2.2">
      <line x1="68" y1="62" x2="78" y2="56"/>
      <line x1="132" y1="62" x2="122" y2="56"/>
    </g>
    <text x="100" y="114" textAnchor="middle" fontSize="10" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">asos</text>
  </svg>
);

// --- EKRAN CHIZMASI (s8): o'sha to'g'ri burchakli uchburchak, faqat burilgan.
const RotatedRightFig = () => (
  <svg viewBox="0 0 220 120" style={{ width: 'min(260px, 82%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(18 12)">
      <path d="M10 90 L10 20 L74 90 Z" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2.4" strokeLinejoin="round"/>
      <rect x="10" y="78" width="12" height="12" fill="none" stroke="#C06A2E" strokeWidth="1.8"/>
    </g>
    <path d="M104 62 h20 m-6 -6 l6 6 l-6 6" fill="none" stroke="#8A7550" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <g transform="translate(140 12) rotate(38 40 55)">
      <path d="M10 90 L10 20 L74 90 Z" fill="#FDF3E0" stroke="#8A7550" strokeWidth="2.4" strokeLinejoin="round"/>
      <rect x="10" y="78" width="12" height="12" fill="none" stroke="#C06A2E" strokeWidth="1.8"/>
    </g>
  </svg>
);

// --- FACTCARD QAHRAMONI: to'rtburchak yig'iladi, uchburchak yo'q.
const RigidityFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g stroke="#8A7550" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round">
      <rect x="16" y="26" width="52" height="52" stroke="#C06A2E"/>
      <path d="M84 78 L110 30 L118 78" stroke="#C06A2E" opacity="0.45"/>
      <path d="M96 78 L120 26 L152 78 Z" stroke="#2E7E9E"/>
    </g>
    <path d="M22 20 h40 m-8 -5 l8 5 l-8 5" fill="none" stroke="#C06A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="42" y="96" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">4</text>
    <text x="124" y="96" textAnchor="middle" fontSize="9" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">3</text>
    <g transform="translate(178 52)">
      <circle r="18" fill="none" stroke="#2E7E9E" strokeWidth="2.4"/>
      <path d="M-8 0 l6 7 l11 -14" fill="none" stroke="#2E7E9E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: RigidityFig,
  figs: { s4: <IsoTriangleFig/>, s8: <RotatedRightFig/> }
});
