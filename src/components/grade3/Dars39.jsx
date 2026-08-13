import React from 'react';
import { AncientHallBg, BitSVG, HALL_SLAB, LUMO_CAST, createLesson, useLang, tri } from './_kit/index.jsx';
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
  lessonId: 'grade3-39',
  lessonTitle: { ru: 'Урок 39. Виды треугольников; параллельные и перпендикулярные', uz: '39-dars. Uchburchak turlari, parallel va perpendikulyar', en: 'Lesson 39. Kinds of triangles; parallel and perpendicular lines' }
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
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Виды треугольников', uz: 'Uchburchak turlari', en: 'Kinds of triangles' },
    lead: { ru: 'Три треугольника из каркаса', uz: 'Karkasdan uchta uchburchak', en: 'Three triangles from the frame' },
    order_cap: { ru: 'все разные, но что-то общее есть', uz: 'hammasi har xil, lekin umumiysi bor', en: 'they are all different, but something is common' },
    plate: ['3', '△', '3'],
    q: { ru: 'Что общего у всех треугольников?', uz: 'Hamma uchburchakda nima umumiy?', en: 'What do all triangles have in common?' },
    opt0: { ru: 'три стороны и три угла', uz: 'uchta tomon va uchta burchak', en: 'three sides and three angles' },
    opt1: { ru: 'прямой угол', uz: "to'g'ri burchak", en: 'a right angle' },
    opt2: { ru: 'равные стороны', uz: 'teng tomonlar', en: 'equal sides' },
    opt3: { ru: 'одинаковый размер', uz: 'bir xil o\'lcham', en: 'the same size' },
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
        ],
        en: ['Area and perimeter are behind us. Today we will look at the figures themselves.', 'The city frame has three triangles. One is stretched, another is even, the third has a right angle.', 'They look very different.', 'What do you think they have in common?']
      },
      on_correct: { ru: 'Верно! Три стороны и три угла есть у любого треугольника. А вот какие они, уже разное.', uz: "To'g'ri! Uchta tomon va uchta burchak har qanday uchburchakda bor. Ular qanaqaligi esa boshqa masala.", en: 'Right! Every triangle has three sides and three angles. And what they are like is already different.' },
      on_wrong1: { ru: 'Прямой угол есть только у одного. У остальных углы другие.', uz: "To'g'ri burchak faqat bittasida bor. Qolganlarida burchaklar boshqacha.", en: 'Only one has a right angle. The others have different angles.' },
      on_wrong2: { ru: 'Равные стороны не у каждого. Посмотри на вытянутый.', uz: "Teng tomon har birida yo'q. Cho'ziqqa qarang.", en: 'Not every one has equal sides. Look at the stretched one.' },
      on_idk: { ru: 'Ничего. Сейчас разберём их по признакам.', uz: "Hechqisi yo'q. Hozir ularni belgilariga qarab ajratamiz.", en: 'Never mind. Let us sort them out by their features.' }
    }
  },

  // s1 — MODEL: burchaklar bo'yicha.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Первый признак — углы', uz: "Birinchi belgi — burchaklar", en: 'The first feature — the angles' },
    task_line: 'смотрим на самый большой угол',
    task_line_uz: "eng katta burchakka qaraymiz",
    task_line_en: 'we look at the biggest angle',
    step1: { ru: 'прямой угол', uz: "to'g'ri burchak", en: 'a right angle' },
    step1_cap: { ru: 'прямоугольный треугольник', uz: "to'g'ri burchakli uchburchak", en: 'a right-angled triangle' },
    step2: { ru: 'все углы острые', uz: "hamma burchak o'tkir", en: 'all the angles are acute' },
    step2_cap: { ru: 'остроугольный треугольник', uz: "o'tkir burchakli uchburchak", en: 'an acute-angled triangle' },
    res: { ru: 'один угол решает', uz: 'bitta burchak hal qiladi', en: 'one angle decides' },
    btn1: { ru: 'Найти прямой угол', uz: "To'g'ri burchakni topish", en: 'Find the right angle' },
    btn2: { ru: 'Посмотреть остальные', uz: "Qolganlariga qarash", en: 'Look at the others' },
    done_text: { ru: 'Вид по углам определяет самый большой угол фигуры.', uz: "Burchak bo'yicha turni shaklning eng katta burchagi belgilaydi.", en: 'The kind by angles is decided by the biggest angle of the figure.' },
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
      ],
      en: ['The first feature of a triangle is its angles.', 'If one angle is right, like the corner of a sheet of paper, the triangle is called right-angled.', 'If all three angles are acute, that is smaller than a right angle, the triangle is acute-angled. And if one angle is bigger than a right angle, the triangle is obtuse-angled. The biggest angle always decides.']
    }
  },

  // s2 — MODEL: tomonlar bo'yicha.
  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 3,
    h: 3,
    lead: { ru: 'Второй признак — стороны', uz: 'Ikkinchi belgi — tomonlar', en: 'The second feature — the sides' },
    capA: { ru: 'две стороны равны — равнобедренный', uz: 'ikki tomon teng — teng yonli', en: 'two sides are equal — isosceles' },
    capB: { ru: 'все три равны — равносторонний', uz: 'uchalasi teng — teng tomonli', en: 'all three are equal — equilateral' },
    res: { ru: 'считаем равные стороны', uz: 'teng tomonlarni sanaymiz', en: 'we count the equal sides' },
    btn1: { ru: 'Сравнить две стороны', uz: 'Ikki tomonni solishtirish', en: 'Compare two sides' },
    btn2: { ru: 'Сравнить все три', uz: 'Uchalasini solishtirish', en: 'Compare all three' },
    done_text: { ru: 'Равносторонний это особый случай равнобедренного, у него равны все три.', uz: "Teng tomonli bu teng yonlining alohida holi, unda uchalasi teng.", en: 'An equilateral triangle is a special case of an isosceles one, it has all three equal.' },
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
      ],
      en: ['The second feature is the sides.', 'If two sides are the same length, the triangle is called isosceles.', 'If all three are the same, it is equilateral. Notice that an equilateral triangle is a special case of an isosceles one, because two of its sides are equal too. And if all the sides are different, the triangle is scalene.']
    }
  },

  // s3 — QOIDA: ikki belgi, holat ahamiyatsiz.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Треугольник повернули на листе. Что изменилось?', uz: "Uchburchak varaqda burildi. Nima o'zgardi?", en: 'A triangle was turned round on the sheet. What changed?' },
    opts: [
      { ru: 'ничего', uz: 'hech nima', en: 'nothing' },
      { ru: 'вид по углам', uz: 'burchak bo\'yicha turi', en: 'the kind by angles' },
      { ru: 'вид по сторонам', uz: 'tomon bo\'yicha turi', en: 'the kind by sides' },
      { ru: 'число сторон', uz: 'tomonlar soni', en: 'the number of sides' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Углы при повороте не меняются, прямой остаётся прямым.', uz: "Burilganda burchaklar o'zgarmaydi, to'g'ri burchak to'g'riligicha qoladi.", en: 'Angles do not change when you turn it, a right angle stays right.' },
      2: { ru: 'Длины сторон при повороте те же.', uz: "Burilganda tomonlar uzunligi o'sha-o'sha.", en: 'The lengths of the sides are the same after a turn.' },
      3: { ru: 'Сторон всегда три, как ни поворачивай.', uz: "Qanday burasangiz ham tomon har doim uchta.", en: 'There are always three sides, however you turn it.' }
    },
    on_correct: { ru: 'Верно. Поворот не меняет ни углы, ни стороны.', uz: "To'g'ri. Burilish na burchakni, na tomonni o'zgartiradi.", en: 'Right. A turn changes neither the angles nor the sides.' },
    rule_lines: {
      ru: ['по углам: прямоугольный, остроугольный, тупоугольный', 'по сторонам: равносторонний, равнобедренный, разносторонний', 'поворот вид не меняет'],
      uz: ["burchak bo'yicha: to'g'ri, o'tkir, o'tmas burchakli", "tomon bo'yicha: teng tomonli, teng yonli, har xil tomonli", "burilish turni o'zgartirmaydi"],
      en: ['by angles: right-angled, acute-angled, obtuse-angled', 'by sides: equilateral, isosceles, scalene', 'a turn does not change the kind']
    },
    rule_ex: { ru: 'два признака: углы и стороны', uz: 'ikki belgi: burchak va tomon', en: 'two features: angles and sides' },
    rule_speech: { ru: 'У треугольника два признака. По углам он бывает прямоугольный, остроугольный или тупоугольный. По сторонам равносторонний, равнобедренный или разносторонний. Как фигуру ни поверни, вид останется тем же.', uz: "Uchburchakning ikki belgisi bor. Burchak bo'yicha u to'g'ri, o'tkir yoki o'tmas burchakli bo'ladi. Tomon bo'yicha teng tomonli, teng yonli yoki har xil tomonli. Shaklni qanday bursangiz ham, turi o'sha bo'lib qoladi.", en: 'A triangle has two features. By angles it can be right-angled, acute-angled or obtuse-angled. By sides equilateral, isosceles or scalene. However you turn the figure, the kind stays the same.' },
    audio: {
      intro: { ru: 'Соберём правило. Мы нашли у треугольника два признака.', uz: "Qoidani yig'amiz. Uchburchakda ikki belgi topdik.", en: 'Let us gather the rule. We found two features of a triangle.' }
    }
  },

  // s4 — CHIZMA: turini aniqlash (o'z chizmasi bilan).
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'Какой это треугольник по сторонам?', uz: "Bu uchburchak tomonlari bo'yicha qanday?", en: 'What kind of triangle is this by its sides?' },
    fig_w: 3,
    fig_h: 3,
    opts: [
      { ru: 'равнобедренный', uz: 'teng yonli', en: 'isosceles' },
      { ru: 'равносторонний', uz: 'teng tomonli', en: 'equilateral' },
      { ru: 'разносторонний', uz: 'har xil tomonli', en: 'scalene' },
      { ru: 'прямоугольный', uz: "to'g'ri burchakli", en: 'right-angled' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Все три стороны равными не оказались, основание короче.', uz: "Uchala tomon teng chiqmadi, asos qisqaroq.", en: 'All three sides did not turn out equal, the base is shorter.' },
      2: { ru: 'Две стороны всё же равны, штрихи это показывают.', uz: "Ikki tomon baribir teng, chiziqchalar shuni ko'rsatadi.", en: 'Two sides are equal after all, the marks show it.' },
      3: { ru: 'Это признак по углам, а спрашивают про стороны.', uz: "Bu burchak belgisi, so'ralgani esa tomonlar.", en: 'That is a feature by angles, and the question is about sides.' }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. Штрихи на сторонах показывают равные. Какой это треугольник по сторонам?', uz: "Chizmaga qarang. Tomonlardagi chiziqchalar tenglarini ko'rsatadi. Bu uchburchak tomonlari bo'yicha qanday?", en: 'Look at the drawing. The marks on the sides show which are equal. What kind of triangle is this by its sides?' },
      on_correct: { ru: 'Верно. Две стороны равны, значит равнобедренный.', uz: "To'g'ri. Ikki tomon teng, demak teng yonli.", en: 'Right. Two sides are equal, so it is isosceles.' },
      on_wrong: { ru: 'Считай, сколько сторон отмечено одинаковыми штрихами.', uz: "Bir xil chiziqcha bilan belgilangan tomonlarni sanang.", en: 'Count how many sides are marked with identical marks.' }
    }
  },

  // s5 — SARALASH: parallel yoki perpendikulyar.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи описания прямых', uz: "To'g'ri chiziq ta'riflarini ajrating", en: 'Sort the descriptions of lines' },
    bin_a: { ru: 'параллельные', uz: 'parallel', en: 'parallel' },
    bin_b: { ru: 'перпендикулярные', uz: 'perpendikulyar', en: 'perpendicular' },
    items: [
      { n: { ru: 'никогда не пересекутся', uz: 'hech qachon kesishmaydi', en: 'they will never cross' }, a: true, hint: { ru: 'Это и есть параллельные.', uz: "Bu parallelning o'zi.", en: 'Those are exactly parallel lines.' } },
      { n: { ru: 'пересекаются под прямым углом', uz: "to'g'ri burchak ostida kesishadi", en: 'they cross at a right angle' }, a: false, hint: { ru: 'Прямой угол при встрече это признак перпендикулярных.', uz: "Uchrashganda to'g'ri burchak perpendikulyar belgisi.", en: 'A right angle where they meet is the mark of perpendicular lines.' } },
      { n: { ru: 'рельсы дороги', uz: "yo'l relslari", en: 'railway rails' }, a: true, hint: { ru: 'Рельсы идут рядом и не сходятся.', uz: "Relslar yonma-yon boradi va qo'shilmaydi.", en: 'Rails run side by side and never come together.' } },
      { n: { ru: 'угол листа бумаги', uz: 'qog\'oz varag\'ining burchagi', en: 'the corner of a sheet of paper' }, a: false, hint: { ru: 'В углу листа стороны встречаются под прямым углом.', uz: "Varaq burchagida tomonlar to'g'ri burchak ostida uchrashadi.", en: 'In the corner of a sheet the sides meet at a right angle.' } }
    ],
    audio: {
      intro: { ru: 'Четыре описания. Отправь каждое к своим прямым.', uz: "To'rtta ta'rif. Har birini o'z chiziqlariga yuboring.", en: 'Four descriptions. Send each one to its lines.' },
      on_correct: { ru: 'Всё на месте. Параллельные не встречаются никогда, перпендикулярные встречаются под прямым углом.', uz: "Hammasi joyida. Parallellar hech qachon uchrashmaydi, perpendikulyarlar to'g'ri burchak ostida uchrashadi.", en: 'All in place. Parallel lines never meet, perpendicular ones meet at a right angle.' },
      on_wrong: { ru: 'Спроси себя, встретятся эти прямые или нет.', uz: "O'zingizdan so'rang, bu chiziqlar uchrashadimi yoki yo'qmi.", en: 'Ask yourself whether these lines will meet or not.' }
    }
  },

  // s6 — TEST: perpendikulyar ta'rifi.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Две прямые пересеклись под прямым углом. Какие они?', uz: "Ikki to'g'ri chiziq to'g'ri burchak ostida kesishdi. Ular qanday?", en: 'Two lines crossed at a right angle. What are they?' },
    opts: [
      { ru: 'перпендикулярные', uz: 'perpendikulyar', en: 'perpendicular' },
      { ru: 'параллельные', uz: 'parallel', en: 'parallel' },
      { ru: 'вертикальные', uz: 'tik', en: 'vertical' },
      { ru: 'равные', uz: 'teng', en: 'equal' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Параллельные вообще не пересекаются.', uz: "Parallellar umuman kesishmaydi.", en: 'Parallel lines do not cross at all.' },
      2: { ru: 'Вертикальная это про положение, а тут про угол встречи.', uz: "Tik bu holat haqida, bu yerda esa uchrashuv burchagi haqida.", en: 'Vertical is about position, and here it is about the angle of meeting.' },
      3: { ru: 'Длина прямых тут ни при чём.', uz: "Chiziqlar uzunligi bu yerda hech nima emas.", en: 'The length of the lines has nothing to do with it.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Две прямые пересеклись под прямым углом. Как они называются?', uz: "Tez savol. Ikki chiziq to'g'ri burchak ostida kesishdi. Ular qanday ataladi?", en: 'A quick question. Two lines crossed at a right angle. What are they called?' },
      on_correct: { ru: 'Верно. Прямой угол при пересечении это перпендикулярные.', uz: "To'g'ri. Kesishganda to'g'ri burchak bo'lsa, bu perpendikulyar.", en: 'Right. A right angle at the crossing means perpendicular.' },
      on_wrong: { ru: 'Смотри на угол в точке встречи.', uz: "Uchrashuv nuqtasidagi burchakka qarang.", en: 'Look at the angle at the meeting point.' }
    }
  },

  // s7 — KONSOL: sanoq karkas bo'yicha.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Посчитай части прямоугольной рамы', uz: "To'g'ri burchakli ramaning qismlarini sanang", en: 'Count the parts of a rectangular frame' },
    swap_line: { ru: 'рама прямоугольная', uz: "ramka to'rtburchak", en: 'the frame is rectangular' },
    cells: [
      { head: { ru: 'прямых углов', uz: "to'g'ri burchak", en: 'right angles' }, label: { ru: 'штук', uz: 'dona', en: 'pieces' }, ans: 4, hint: { ru: 'У прямоугольника каждый угол прямой.', uz: "To'rtburchakda har bir burchak to'g'ri.", en: 'A rectangle has every angle right.' } },
      { head: { ru: 'пар параллельных', uz: 'parallel juft', en: 'pairs of parallel' }, label: { ru: 'сторон', uz: 'tomon', en: 'sides' }, ans: 2, hint: { ru: 'Противоположные стороны идут парами.', uz: "Qarama-qarshi tomonlar juft bo'lib boradi.", en: 'Opposite sides go in pairs.' } },
      { head: { ru: 'сторон у треугольника', uz: 'uchburchak tomoni', en: 'sides of a triangle' }, label: { ru: 'штук', uz: 'dona', en: 'pieces' }, ans: 3, hint: { ru: 'Название фигуры само подсказывает.', uz: "Shakl nomi o'zi aytib turibdi.", en: 'The name of the figure tells you itself.' } }
    ],
    check: { ru: '4 угла, 2 пары, 3 стороны', uz: '4 burchak, 2 juft, 3 tomon', en: '4 angles, 2 pairs, 3 sides' },
    check_label: { ru: 'признаки фигур', uz: 'shakl belgilari', en: 'features of figures' },
    audio: {
      intro: { ru: 'Заполни три окна. Прямые углы рамы, пары параллельных сторон и стороны треугольника.', uz: "Uchta oynani to'ldiring. Rama to'g'ri burchaklari, parallel tomon juftlari va uchburchak tomonlari.", en: 'Fill three windows. The right angles of the frame, the pairs of parallel sides and the sides of a triangle.' },
      on_correct: { ru: 'Четыре прямых угла, две пары параллельных сторон и три стороны у треугольника.', uz: "To'rtta to'g'ri burchak, ikkita parallel tomon juftligi va uchburchakda uchta tomon.", en: 'Four right angles, two pairs of parallel sides and three sides in a triangle.' }
    }
  },

  // s8 — XATONI TOP: burilgan shakl (M1).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Прямоугольный треугольник положили на бок и назвали остроугольным. Где ошибка?', uz: "To'g'ri burchakli uchburchak yonboshiga qo'yilib, o'tkir burchakli deyilibdi. Xato qayerda?", en: 'A right-angled triangle was laid on its side and called acute-angled. Where is the mistake?' },
    fig_line: { ru: 'фигуру просто повернули', uz: 'shakl shunchaki burildi', en: 'the figure was simply turned' },
    opts: [
      { ru: 'поворот не меняет углы', uz: "burilish burchakni o'zgartirmaydi", en: 'a turn does not change the angles' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'стороны стали другими', uz: 'tomonlar boshqacha bo\'ldi', en: 'the sides became different' },
      { ru: 'это уже не треугольник', uz: 'bu endi uchburchak emas', en: 'it is not a triangle any more' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Прямой угол никуда не делся, он просто смотрит в другую сторону.', uz: "To'g'ri burchak yo'qolmadi, u shunchaki boshqa tomonga qaradi.", en: 'The right angle has not gone anywhere, it simply looks in another direction.' },
      2: { ru: 'Длины сторон при повороте те же самые.', uz: "Burilganda tomonlar uzunligi o'sha-o'sha.", en: 'The lengths of the sides are the very same after a turn.' },
      3: { ru: 'Три стороны и три угла на месте, фигура та же.', uz: "Uchta tomon va uchta burchak joyida, shakl o'sha.", en: 'Three sides and three angles are in place, the figure is the same.' }
    },
    audio: {
      intro: { ru: 'Кто-то повернул треугольник и решил, что вид сменился. Найди ошибку.', uz: "Kimdir uchburchakni burib, turi o'zgardi deb o'ylabdi. Xatoni toping.", en: 'Someone turned a triangle and decided that its kind had changed. Find the mistake.' },
      on_correct: { ru: 'Верно. Вид определяют углы и стороны, а не положение на листе.', uz: "To'g'ri. Turni burchak va tomonlar belgilaydi, varaqdagi holat emas.", en: 'Right. The kind is decided by the angles and the sides, not by the position on the sheet.' },
      on_wrong: { ru: 'Найди на чертеже прямой угол. Он остался.', uz: "Chizmadan to'g'ri burchakni toping. U qolgan.", en: 'Find the right angle on the drawing. It is still there.' }
    }
  },

  // s9 — BIT TUZOG'I: perpendikulyar demak tik (M3).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит проверяет опоры моста', uz: "Bit ko'prik tayanchlarini tekshiryapti", en: 'Bit is checking the supports of a bridge' },
    lines: ['две наклонные балки встретились', 'Бит: они не вертикальные, значит не перпендикулярные'],
    lines_uz: ["ikkita qiya to'sin uchrashdi", "Bit: ular tik emas, demak perpendikulyar emas"],
    lines_en: ['two sloping beams met', 'Bit: they are not vertical, so they are not perpendicular'],
    line_cap: { ru: 'Бит: перпендикулярные это те, что стоят прямо', uz: "Bit: perpendikulyar bu tik turganlari", en: 'Bit: perpendicular means the ones that stand upright' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, важен угол между ними', 'да, они должны стоять прямо'], uz: ["yo'q, ular orasidagi burchak muhim", 'ha, ular tik turishi kerak'], en: ['no, the angle between them matters', 'yes, they must stand upright'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Перпендикулярность это про угол между прямыми, а не про их положение. Две наклонные балки тоже перпендикулярны, если встретились под прямым углом.', uz: "Ha. Perpendikulyarlik chiziqlar orasidagi burchak haqida, ularning holati haqida emas. Ikki qiya to'sin ham to'g'ri burchak ostida uchrashsa, perpendikulyar bo'ladi.", en: 'Yes. Perpendicularity is about the angle between lines, not about their position. Two sloping beams are perpendicular too, if they met at a right angle.' },
    trap_wrong: { ru: 'Наклони угол листа бумаги. Стороны всё равно встречаются под прямым углом.', uz: "Qog'oz varag'ining burchagini qiyshaytiring. Tomonlar baribir to'g'ri burchak ostida uchrashadi.", en: 'Tilt the corner of a sheet of paper. The sides still meet at a right angle.' },
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
      ],
      en: ['Bit is checking the supports of a bridge.', 'These beams are sloping, they do not stand upright. So they cannot be called perpendicular.', 'Is that so?']
    }
  },

  // s10 — TRENAJYOR: to'g'ri burchaklar soni.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сколько прямых углов у квадрата?', uz: 'Kvadratda nechta to\'g\'ri burchak bor?', en: 'How many right angles does a square have?' },
    ans: 4,
    check: { ru: '4 угла', uz: '4 burchak', en: '4 angles' },
    check_label: { ru: 'все углы прямые', uz: "hamma burchak to'g'ri", en: 'all the angles are right' },
    hint: { ru: 'Посчитай углы квадрата, все они одинаковые.', uz: "Kvadrat burchaklarini sanang, hammasi bir xil.", en: 'Count the angles of a square, they are all the same.' },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько прямых углов у квадрата?', uz: "Endi o'zingiz hisoblang. Kvadratda nechta to'g'ri burchak bor?", en: 'Now count on your own. How many right angles does a square have?' },
      on_correct: { ru: 'Четыре. Все углы квадрата прямые.', uz: "To'rtta. Kvadratning hamma burchagi to'g'ri.", en: 'Four. All the angles of a square are right.' }
    }
  },

  // s11 — TRENAJYOR: teng tomonlining perimetri.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'У равностороннего треугольника сторона 7 см. Чему равен периметр в см?', uz: "Teng tomonli uchburchak tomoni 7 sm. Perimetri sm da nechaga teng?", en: 'An equilateral triangle has a side of 7 cm. What is the perimeter in cm?' },
    ans: 21,
    check: '7 · 3',
    check_label: { ru: 'три равные стороны', uz: 'uchta teng tomon', en: 'three equal sides' },
    hint: { ru: 'Все три стороны одинаковые, значит семь взять три раза.', uz: "Uchala tomon bir xil, demak yettini uch marta olish kerak.", en: 'All three sides are the same, so take seven three times.' },
    audio: {
      intro: { ru: 'Равносторонний треугольник со стороной семь сантиметров. Чему равен периметр?', uz: "Tomoni yetti santimetr bo'lgan teng tomonli uchburchak. Perimetri nechaga teng?", en: 'An equilateral triangle with a side of seven centimetres. What is the perimeter?' },
      on_correct: { ru: 'Двадцать один сантиметр. Три равные стороны по семь.', uz: "Yigirma bir santimetr. Yettitadan uchta teng tomon.", en: 'Twenty one centimetres. Three equal sides of seven.' }
    }
  },

  // s12 — MASALA: karkas, chekka va ko'ndalang.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Каркас смотровой площадки', uz: 'Kuzatuv maydonchasi karkasi', en: 'The frame of a viewing platform' },
    q: { ru: 'Рама 5 на 3 м. Внутрь ставят 2 перекладины параллельно короткой стороне. Сколько метров планок пойдёт на раму и сколько всего с перекладинами?', uz: "Rama 5 ga 3 m. Ichiga qisqa tomonga parallel 2 ta ko'ndalang qo'yiladi. Ramaga necha metr reyka ketadi va ko'ndalanglar bilan jami qancha?", en: 'A frame is 5 by 3 m. 2 crossbars are put inside parallel to the short side. How many metres of battens go into the frame and how many in all with the crossbars?' },
    q_speech: { ru: 'рама пять на три метра, внутрь ставят две перекладины параллельно короткой стороне. Сколько метров планок пойдёт на раму и сколько всего?', uz: "rama besh ga uch metr, ichiga qisqa tomonga parallel ikkita ko'ndalang qo'yiladi. Ramaga necha metr reyka ketadi va jami qancha?", en: 'a frame five by three metres, two crossbars are put inside parallel to the short side. How many metres of battens go into the frame and how many in all?' },
    tbl_heads: [
      { ru: 'рама', uz: 'rama', en: 'frame' },
      { ru: 'перекладины', uz: "ko'ndalanglar", en: 'crossbars' },
      { ru: 'вопрос', uz: 'savol', en: 'question' }
    ],
    tbl_cells: [{ ru: '5 и 3', uz: '5 va 3', en: '5 and 3' }, { ru: '2 по 3', uz: '2 tadan 3', en: '2 of 3' }, '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: '(5 + 3) · 2', uz: '(5 + 3) · 2', en: '(5 + 3) · 2' },
      { ru: '5 · 3', uz: '5 · 3', en: '5 · 3' },
      { ru: '3 · 2', uz: '3 · 2', en: '3 · 2' },
      { ru: '5 + 3', uz: '5 + 3', en: '5 + 3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Это площадь площадки, а планки идут по краю.', uz: "Bu maydoncha yuzasi, reykalar esa chekka bo'ylab boradi.", en: 'That is the area of the platform, and the battens run along the edge.' },
      2: { ru: 'Перекладины посчитаем вторым действием.', uz: "Ko'ndalanglarni ikkinchi amalda hisoblaymiz.", en: 'We will count the crossbars in the second step.' },
      3: { ru: 'Две стороны это только половина рамы.', uz: "Ikki tomon bu ramaning yarmi xolos.", en: 'Two sides are only half the frame.' }
    },
    pick_ok: { ru: 'Верно. Сначала рама по краю, потом перекладины.', uz: "To'g'ri. Avval chekka bo'ylab rama, keyin ko'ndalanglar.", en: 'Right. First the frame along the edge, then the crossbars.' },
    step1_q: { ru: 'Сколько метров планок на раму?', uz: 'Ramaga necha metr reyka kerak?', en: 'How many metres of battens for the frame?' },
    ans1: 16,
    hint1: { ru: 'Сложи пять и три, потом удвой.', uz: "Besh va uchni qo'shib, keyin ikkilantiring.", en: 'Add five and three, then double it.' },
    step2_q: { ru: 'Сколько метров всего с перекладинами?', uz: "Ko'ndalanglar bilan jami necha metr?", en: 'How many metres in all with the crossbars?' },
    ans2: 22,
    hint2: { ru: 'Две перекладины по три метра, прибавь их к раме.', uz: "Uch metrdan ikkita ko'ndalang, ularni ramaga qo'shing.", en: 'Two crossbars of three metres, add them to the frame.' },
    check: { ru: 'рама 16, всего 22', uz: 'ramka 16, jami 22', en: 'frame 16, 22 in all' },
    setup_audio: { ru: 'Площадку собирают из планок. Посмотри на таблицу и реши, с чего начать.', uz: "Maydoncha reykalardan yig'ilyapti. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'The platform is being built from battens. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Рама пять на три метра, внутрь ставят две перекладины по три метра. Сколько планок на раму и сколько всего?', uz: "Rama besh ga uch metr, ichiga uch metrdan ikkita ko'ndalang qo'yiladi. Ramaga qancha reyka va jami qancha?", en: 'A frame five by three metres, two crossbars of three metres are put inside. How many battens for the frame and how many in all?' },
      on_correct: { ru: 'На раму шестнадцать метров, а всего двадцать два. Перекладины параллельны короткой стороне и равны ей.', uz: "Ramaga o'n olti metr, jami esa yigirma ikki. Ko'ndalanglar qisqa tomonga parallel va unga teng.", en: 'Sixteen metres for the frame, and twenty two in all. The crossbars are parallel to the short side and equal to it.' },
      on_wrong: { ru: 'Сначала обойди раму по краю, потом добавь перекладины.', uz: "Avval ramani chekka bo'ylab aylaning, keyin ko'ndalanglarni qo'shing.", en: 'First go round the frame along the edge, then add the crossbars.' }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Смотри на признак, а не на положение', uz: "Uchta topshiriq. Holatga emas, belgiga qarang", en: 'Three tasks. Look at the feature, not at the position' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько сторон одинаковой длины у равностороннего треугольника?', uz: "Teng tomonli uchburchakda nechta tomon bir xil uzunlikda?", en: 'How many sides of the same length does an equilateral triangle have?' },
        q_speech: { ru: 'сколько сторон одинаковой длины у равностороннего треугольника?', uz: "teng tomonli uchburchakda nechta tomon bir xil uzunlikda?", en: 'how many sides of the same length does an equilateral triangle have?' },
        ans: 3,
        hint: { ru: 'Название фигуры само подсказывает ответ.', uz: "Shakl nomi javobni o'zi aytib turibdi.", en: 'The name of the figure tells you the answer itself.' }
      },
      {
        kind: 'num',
        q: { ru: 'У равнобедренного треугольника основание 4 см, боковые стороны по 6 см. Чему равен периметр в см?', uz: "Teng yonli uchburchakning asosi 4 sm, yon tomonlari 6 sm dan. Perimetri sm da nechaga teng?", en: 'An isosceles triangle has a base of 4 cm and sides of 6 cm each. What is the perimeter in cm?' },
        q_speech: { ru: 'у равнобедренного треугольника основание четыре сантиметра, боковые по шесть. Чему равен периметр?', uz: "teng yonli uchburchakning asosi to'rt santimetr, yon tomonlari oltitadan. Perimetri nechaga teng?", en: 'an isosceles triangle has a base of four centimetres and sides of six each. What is the perimeter?' },
        ans: 16,
        hint: { ru: 'Сложи основание и обе боковые стороны.', uz: "Asos va ikkala yon tomonni qo'shing.", en: 'Add the base and both sides.' }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько пар параллельных сторон у прямоугольника?', uz: "To'rtburchakda nechta juft parallel tomon bor?", en: 'How many pairs of parallel sides does a rectangle have?' },
        q_speech: { ru: 'сколько пар параллельных сторон у прямоугольника?', uz: "to'rtburchakda nechta juft parallel tomon bor?", en: 'how many pairs of parallel sides does a rectangle have?' },
        ans: 2,
        hint: { ru: 'Противоположные стороны идут парами и не пересекаются.', uz: "Qarama-qarshi tomonlar juft bo'lib boradi va kesishmaydi.", en: 'Opposite sides go in pairs and do not cross.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Треугольник нельзя перекосить, не сломав стороны, а четырёхугольник складывается легко. Поэтому в фермах мостов, в кранах и в опорах вышек стоят именно треугольники: три стержня держат форму сами по себе.',
      uz: "Uchburchakni tomonlarini sindirmasdan qiyshaytirib bo'lmaydi, to'rtburchak esa oson yig'iladi. Shuning uchun ko'prik fermalarida, kranlarda va minora tayanchlarida aynan uchburchak turadi: uchta sterjen shaklni o'zi ushlab turadi.",
      en: 'A triangle cannot be skewed without breaking its sides, while a quadrilateral folds up easily. That is why bridge trusses, cranes and tower supports use triangles: three rods hold the shape by themselves.'
    },
    fact_audio: {
      ru: 'Вот чем треугольник особенный. Возьми четыре палочки и скрепи их в четырёхугольник. Такую рамку легко перекосить, она сложится. А теперь возьми три палочки. Треугольник перекосить не выйдет, придётся ломать или гнуть сами стороны. Именно поэтому в фермах мостов, в стрелах кранов и в опорах вышек всюду видны треугольники. Три стержня держат форму сами.',
      uz: "Mana uchburchak nimasi bilan alohida. To'rtta cho'p olib, ularni to'rtburchak qilib biriktiring. Bunday ramkani qiyshaytirish oson, u yig'iladi. Endi uchta cho'p oling. Uchburchakni qiyshaytirib bo'lmaydi, tomonlarning o'zini sindirish yoki bukish kerak bo'ladi. Aynan shuning uchun ko'prik fermalarida, kran strelalarida va minora tayanchlarida hamma joyda uchburchak ko'rinadi. Uchta sterjen shaklni o'zi ushlab turadi.",
      en: 'Here is what makes a triangle special. Take four sticks and join them into a quadrilateral. Such a frame is easy to skew, it will fold up. Now take three sticks. A triangle cannot be skewed, you would have to break or bend the sides themselves. That is exactly why bridge trusses, crane jibs and tower supports are full of triangles. Three rods hold the shape on their own.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Смотри на признаки фигуры.', uz: "Oxirida uchta topshiriq. Shakl belgilariga qarang.", en: 'Three tasks at the end. Look at the features of the figure.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Вспомни, чем определяется вид.', uz: "Turni nima belgilashini eslang.", en: 'Recall what decides the kind.' }
    }
  },

  // s14 — YAKUN: keyingisi simmetriya va burchak (reja 44-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Каркас разобран!', uz: 'Karkas tahlil qilindi!', en: 'The frame is sorted out!' },
    cando: {
      ru: ['различаю треугольники по углам и сторонам', 'узнаю параллельные и перпендикулярные', 'не путаюсь, когда фигуру повернули'],
      uz: ["uchburchaklarni burchak va tomon bo'yicha ajrataman", "parallel va perpendikulyarni tanib olaman", "shakl burilganda adashmayman"],
      en: ['I tell triangles apart by angles and sides', 'I recognise parallel and perpendicular lines', 'I do not get confused when a figure is turned']
    },
    rule_recap: { ru: 'Вид треугольника определяют углы и стороны, а не его положение на листе.', uz: "Uchburchak turini burchak va tomonlar belgilaydi, varaqdagi holati emas.", en: 'The kind of a triangle is decided by its angles and sides, not by its position on the sheet.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 31: периметр; урок 38: чтение чертежа', uz: "31-dars: perimetr; 38-dars: chizmani o'qish", en: 'lesson 31: perimeter; lesson 38: reading a drawing' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'ось симметрии и градусная мера угла', uz: 'simmetriya o\'qi va burchakning gradus o\'lchovi', en: 'the axis of symmetry and the degree measure of an angle' },
    audio: {
      ru: 'Каркас разобран. Запомни главное. У треугольника два признака. По углам он прямоугольный, остроугольный или тупоугольный, и решает самый большой угол. По сторонам равносторонний, равнобедренный или разносторонний, и тут считают равные стороны. Прямые называют параллельными, если они никогда не встретятся, и перпендикулярными, если встретились под прямым углом. Как фигуру ни поверни, вид у неё останется прежним. В следующий раз сложим фигуру пополам и посмотрим на симметрию!',
      uz: "Karkas tahlil qilindi. Asosiysini eslab qoling. Uchburchakning ikki belgisi bor. Burchak bo'yicha u to'g'ri, o'tkir yoki o'tmas burchakli, va eng katta burchak hal qiladi. Tomon bo'yicha teng tomonli, teng yonli yoki har xil tomonli, bu yerda teng tomonlar sanaladi. Chiziqlar hech qachon uchrashmasa parallel, to'g'ri burchak ostida uchrashsa perpendikulyar deyiladi. Shaklni qanday bursangiz ham turi o'sha bo'lib qoladi. Keyingi safar shaklni teng ikkiga bukib, simmetriyaga qaraymiz!",
      en: 'The frame is sorted out. Remember the main thing. A triangle has two features. By angles it is right-angled, acute-angled or obtuse-angled, and the biggest angle decides. By sides it is equilateral, isosceles or scalene, and here we count the equal sides. Lines are called parallel if they will never meet, and perpendicular if they met at a right angle. However you turn a figure, its kind stays the same. Next time we will fold a figure in half and look at symmetry!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Начнём с углов.', uz: 'Burchaklardan boshlaymiz.', en: 'Let us start with the angles.' },
  s2:  { ru: 'Теперь стороны.', uz: 'Endi tomonlar.', en: 'Now the sides.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing.", en: 'Read the drawing.' },
  s5:  { ru: 'Разложи описания.', uz: "Ta'riflarni ajrating.", en: 'Sort the descriptions.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут фигуру просто повернули.', uz: 'Bu yerda shakl shunchaki burilgan.', en: 'Here the figure was simply turned.' },
  s9:  { ru: 'А вот и Бит со своей проверкой.', uz: "Mana Bit ham o'z tekshiruvi bilan.", en: 'And here is Bit with his check.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И ещё одна фигура.', uz: 'Yana bitta shakl.', en: 'And one more figure.' },
  s12: { ru: 'Задача от строителей.', uz: 'Quruvchilardan masala.', en: 'A task from the builders.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Каркас разобран. Теперь виден и вид треугольника, и характер прямых.',
  uz: "Karkas tahlil qilindi. Endi uchburchak turi ham, chiziqlar tabiati ham ko'rinadi.",
  en: 'The frame is sorted out. Now both the kind of a triangle and the character of lines can be seen.'
};

// --- ZAL TAXTASI (D39): markazda karkas — uchta uchburchak va rama, unda parallel va
// perpendikulyar chiziqlar ko'rinadi.
const FrameNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x={HALL_SLAB.x} y={HALL_SLAB.y} width={HALL_SLAB.w} height={HALL_SLAB.h} rx="5" fill="#E4D3AC" stroke="#8A7550" strokeWidth="2"/>
    <rect x="130" y="99" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="107.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'КАРКАС', 'KARKAS', 'THE FRAME')}</text>
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
      <text x="0" y="-20" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ПАРАЛЛЕЛЬНЫЕ', 'PARALLEL', 'PARALLEL')}</text>
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
const IsoTriangleFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 200 120" style={{ width: 'min(240px, 78%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <path d="M100 16 L156 100 L44 100 Z" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2.4" strokeLinejoin="round"/>
    <g stroke="#C06A2E" strokeWidth="2.2">
      <line x1="68" y1="62" x2="78" y2="56"/>
      <line x1="132" y1="62" x2="122" y2="56"/>
    </g>
    <text x="100" y="114" textAnchor="middle" fontSize="10" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'основание', 'asos', 'the base')}</text>
  </svg>
  );
};

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
