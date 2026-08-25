// ============================================================================
// 7-sinf, Dars 44. UCHBURCHAK BURCHAKLARINING YIG'INDISI.
// (Сумма углов треугольника)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// BU DARSDA «O'LCHOV ISBOT EMAS» TALABI ENG MUHIM (etalon § 9), va shuning
// uchun asbobning `guess` yorlig'i har o'lchov ekranida turadi. Dars halol
// yo'ldan boradi: yig'indi bir necha xil uchburchakda O'LCHANADI, har safar
// bir yuz sakson chiqadi, va bu QONUNIYAT deb ataladi -- ISBOT deb emas.
// Isbot parallel chiziqlarni talab qiladi, ular esa keyingi darsda.
//
// ASBOB YIG'INDINI ALDAMAYDI. `Figure` ikki burchakni butun darajaga
// yaxlitlaydi, uchinchisini esa AYIRMA bilan oladi -- shuning uchun yig'indi
// har qanday uch holatida aynan 180 chiqadi va yaxlitlash uni buzmaydi.
// Ya'ni «o'lchov har safar 180 beradi» degan xulosa chizmada haqiqatda
// ko'rinadi, matnda aytilmaydi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_44'
const LESSON_TITLE = L("Uchburchak burchaklarining yig'indisi", 'Сумма углов треугольника', 'The sum of the angles of a triangle')
const LESSON_NO = L('44-dars', 'Урок 44', 'Lesson 44')
const BLOCK = { label: L('B7-blok', 'Блок Б7', 'Block B7'), from: 40, to: 48, current: 44 }

const TAGS = {
  Z1: L("yig'indi 180 daraja", 'сумма равна 180 градусам', 'the sum is 180 degrees'),
  Z2: L("uchinchi burchakni topish", 'нахождение третьего угла', 'finding the third angle'),
  Z3: L("o'lchov isbot deb olindi", 'измерение принято за доказательство', 'a measurement taken as proof'),
  Z4: L('teng yonlida taqsimlash', 'распределение в равнобедренном', 'splitting in an isosceles triangle'),
  Z5: L("tashqi burchak ichkisi bilan aralashtirildi", 'внешний угол спутан с внутренним', 'the exterior angle confused with the interior'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Yig'indi uchburchakka bog'liqmi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("BURCHAKLAR YIG'INDISI", 'СУММА УГЛОВ', 'THE SUM OF THE ANGLES'),
  noBack: true,
  noNotes: true,
  title: L('Yig\'indi o\'zgaradimi', 'Меняется ли сумма', 'Does the sum change'),
  gate: {
    source: { kind: 'plain', tokens: ['?', '+', '?', '+', '?'] },
    rows: [
      { tokens: ['har xil'], value: '?' },
      { tokens: ['bir xil'], value: '180' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Uchta har xil uchburchak oldik: cho'ziq, keng va to'g'ri burchakli. Har birida uchta burchakni qo'shdik. Yig'indi har xil chiqadimi yoki bir xilmi?",
      'Взяли три разных треугольника: вытянутый, широкий и прямоугольный. В каждом сложили три угла. Сумма выйдет разной или одинаковой?',
      'We took three different triangles: a narrow one, a wide one and a right-angled one. In each we added the three angles. Will the sum differ or match?',
    ),
    items: [
      {
        id: 'same',
        label: L('har doim bir xil', 'всегда одинаковой', 'always the same'),
        hint: L(
          "Taxminingiz qabul qilindi. Chizmada tekshiramiz.",
          'Прогноз принят. Проверим на чертеже.',
          'Your prediction is taken. We will check it on the drawing.',
        ),
      },
      {
        id: 'diff',
        label: L('har xil bo\'ladi', 'будет разной', 'it will differ'),
        hint: L(
          "Chizmada tekshiramiz: uchni ko'chirib, yig'indini kuzatamiz.",
          'Проверим на чертеже: перенесём вершину и посмотрим на сумму.',
          'We will check on the drawing: move the vertex and watch the sum.',
        ),
      },
      {
        id: 'big',
        label: L('katta uchburchakda kattaroq', 'у большого треугольника больше', 'larger for a larger triangle'),
        hint: L(
          "O'lcham burchaklarga ta'sir qilmaydi: uchburchakni kattalashtirsak burchaklar o'sha-o'sha qoladi.",
          'Размер на углы не влияет: увеличим треугольник, а углы останутся теми же.',
          'Size does not affect the angles: enlarge the triangle and the angles stay.',
        ),
      },
      {
        id: 'kind',
        label: L('turiga bog\'liq', 'зависит от вида', 'it depends on the kind'),
        hint: L(
          "Turini o'zgartirib ko'ramiz va yig'indiga qaraymiz.",
          'Изменим вид и посмотрим на сумму.',
          'We will change the kind and look at the sum.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Uchta har xil uchburchak. Har birida uchta burchak bor.", 'Три разных треугольника. В каждом по три угла.', 'Three different triangles. Each has three angles.'),
    A('mount', "Har birida burchaklarni qo'shsak, yig'indi bir xil chiqadimi.", 'Если в каждом сложить углы, выйдет ли одинаковая сумма.', 'If we add the angles in each, will the sum match.'),
  ],
}

// ============================================================
// 2. TAYANCH. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Yoyilgan burchak nechcha darajaga teng?",
        'Сколько градусов в развёрнутом угле?',
        'How many degrees is a straight angle?',
      ),
      ok: L("Bir yuz sakson daraja.", 'Сто восемьдесят градусов.', 'One hundred eighty degrees.'),
      items: [
        { id: 'a', label: '180°', correct: true },
        { id: 'b', label: '90°', tag: 'Z1', hint: L("To'qson bu to'g'ri burchak.", 'Девяносто это прямой угол.', 'Ninety is a right angle.') },
        { id: 'c', label: '360°', tag: 'Z1', hint: L("Uch yuz oltmish to'liq aylanish.", 'Триста шестьдесят это полный оборот.', 'Three hundred sixty is a full turn.') },
        { id: 'd', label: '270°', tag: 'Z1', hint: L("Yoyilgan burchak to'g'ri chiziq beradi.", 'Развёрнутый угол даёт прямую линию.', 'A straight angle gives a straight line.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakni kattalashtirsak, burchaklari o'zgaradimi?",
        'Если увеличить треугольник, изменятся ли его углы?',
        'If a triangle is enlarged, do its angles change?',
      ),
      ok: L("Yo'q: o'lcham o'zgaradi, burchaklar esa qoladi.", 'Нет: размер меняется, а углы остаются.', 'No: the size changes, the angles stay.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z1', label: L('ha, kattalashadi', 'да, увеличатся', 'yes, they grow'), hint: L("Burchak burilish, uzunlik emas.", 'Угол это поворот, а не длина.', 'An angle is a turn, not a length.') },
        { id: 'c', tag: 'Z1', label: L('ha, kichrayadi', 'да, уменьшатся', 'yes, they shrink'), hint: L("Burchaklar o'lchamga bog'liq emas.", 'Углы от размера не зависят.', 'Angles do not depend on size.') },
        { id: 'd', tag: 'Z3', label: L("o'lchash kerak", 'нужно измерить', 'measuring is needed'), hint: L("Bu yerda o'lchash kerak emas: burchak burilishni ko'rsatadi.", 'Здесь измерять не нужно: угол показывает поворот.', 'No measuring needed here: an angle shows a turn.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki qo'shni burchakning yig'indisi nechcha daraja?",
        'Сколько градусов сумма двух смежных углов?',
        'What is the sum of two adjacent angles?',
      ),
      ok: L("Bir yuz sakson: ular yoyilgan burchakni to'ldiradi.", 'Сто восемьдесят: они заполняют развёрнутый угол.', 'One hundred eighty: they fill a straight angle.'),
      items: [
        { id: 'a', label: '180°', correct: true },
        { id: 'b', label: '90°', tag: 'Z1', hint: L("To'qson bu perpendikulyar bergan burchak.", 'Девяносто это угол от перпендикуляра.', 'Ninety is the angle a perpendicular gives.') },
        { id: 'c', label: '360°', tag: 'Z1', hint: L("Ikki burchak to'liq aylanish bermaydi.", 'Два угла полного оборота не дают.', 'Two angles do not make a full turn.') },
        { id: 'd', label: '120°', tag: 'Z1', hint: L("Qo'shni burchaklar to'g'ri chiziqni to'ldiradi.", 'Смежные углы заполняют прямую линию.', 'Adjacent angles fill a straight line.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch savol: yoyilgan burchak, o'lcham va qo'shni burchaklar.", 'Три вопроса: развёрнутый угол, размер и смежные углы.', 'Three questions: the straight angle, size, and adjacent angles.'),
    A('1', "Ikkinchisi o'lcham haqida.", 'Второй про размер.', 'The second is about size.'),
    A('2', "Uchinchisi qo'shni burchaklar haqida.", 'Третий про смежные углы.', 'The third is about adjacent angles.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. YIG'INDI O'LCHANADI.
// ============================================================
const S3 = {
  kind: 'figure',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Uchta burchakni qo\'shamiz', 'Складываем три угла', 'Adding the three angles'),
  pts: { A: { x: -4, y: -2 }, B: { x: 3, y: -2 }, C: { x: -1, y: 3 } },
  show: { sides: true, angles: true, sum: true },
  guess: true,
  caption: L(
    "Uchta burchak o'lchandi va qo'shildi. Yig'indi chizmaning ostida turadi.",
    'Три угла измерены и сложены. Сумма стоит под чертежом.',
    'The three angles are measured and added. The sum is under the drawing.',
  ),
  options: [
    { id: 'a', label: '180' },
    { id: 'b', label: '90' },
    { id: 'c', label: '360' },
    { id: 'd', label: L("uchburchakka bog'liq", 'зависит от треугольника', 'it depends on the triangle') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("To'qson bitta burchak bo'lishi mumkin, uchtasining yig'indisi esa yo'q.", 'Девяносто может быть одним углом, но не суммой трёх.', 'Ninety may be one angle, but not the sum of three.') },
    { key: 'c', tag: 'Z1', hint: L("Chizma ostidagi songa qarang.", 'Посмотри на число под чертежом.', 'Look at the number under the drawing.') },
    { key: 'd', tag: 'Z1', hint: L("Keyingi ekranda uchni ko'chiramiz va yig'indini kuzatamiz.", 'На следующем экране перенесём вершину и посмотрим на сумму.', 'On the next screen we move the vertex and watch the sum.') },
  ],
  note: L(
    "Yig'indi 180 chiqdi. Lekin diqqat: bu O'LCHOV, ya'ni taxmin. Bitta chizma hech narsani isbotlamaydi -- shuning uchun keyingi ekranda uchburchakni o'zgartirib ko'ramiz.",
    'Сумма вышла 180. Но внимание: это ИЗМЕРЕНИЕ, то есть предположение. Один чертёж ничего не доказывает — поэтому на следующем экране мы изменим треугольник.',
    'The sum came out 180. But careful: that is a MEASUREMENT, a guess. One drawing proves nothing — so on the next screen we change the triangle.',
  ),
  audio: [
    A('mount', "Uchta burchak o'lchandi.", 'Три угла измерены.', 'The three angles are measured.'),
    A('mount', "Chizma ostida yig'indi turadi, va u taxmin deb imzolangan.", 'Под чертежом стоит сумма, и она подписана как предположение.', 'The sum is under the drawing, marked as a guess.'),
  ],
}

// ============================================================
// 4. FARQLASH. UCH KO'CHDI, BURCHAKLAR O'ZGARDI, YIG'INDI QOLDI.
// ============================================================
const S4 = {
  kind: 'figure',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Uchburchakni o\'zgartiramiz', 'Меняем треугольник', 'Changing the triangle'),
  pts: { A: { x: -4, y: -2 }, B: { x: 3, y: -2 }, C: { x: -1, y: 3 } },
  move: 'C',
  pick: { x: 3, y: 3 },
  show: { angles: true, sum: true },
  guess: true,
  caption: L(
    "C uchini (3; 3) tuguniga ko'chiring. Burchaklar va yig'indi qayta hisoblanadi.",
    'Перенеси вершину C в узел (3; 3). Углы и сумма пересчитаются.',
    'Move the vertex C to the node (3; 3). The angles and the sum are recomputed.',
  ),
  options: [
    { id: 'a', label: L("burchaklar o'zgardi, yig'indi qoldi", 'углы изменились, сумма осталась', 'the angles changed, the sum stayed') },
    { id: 'b', label: L("yig'indi ham o'zgardi", 'сумма тоже изменилась', 'the sum changed too') },
    { id: 'c', label: L("burchaklar o'zgarmadi", 'углы не изменились', 'the angles did not change') },
    { id: 'd', label: L('uchburchak o\'sha-o\'sha qoldi', 'треугольник остался тем же', 'the triangle stayed the same') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Chizma ostidagi songa qarang: u o'zgarmadi.", 'Посмотри на число под чертежом: оно не изменилось.', 'Look at the number under the drawing: it did not change.') },
    { key: 'c', tag: 'Z1', hint: L("Uchlardagi sonlarni ko'chirishdan oldingi bilan solishtiring.", 'Сравни числа при вершинах с теми, что были до переноса.', 'Compare the numbers at the vertices with those before the move.') },
    { key: 'd', tag: 'Z1', hint: L("Uchburchak boshqa bo'ldi: uch joyini o'zgartirdi.", 'Треугольник стал другим: вершина сменила место.', 'The triangle became different: the vertex changed place.') },
  ],
  note: L(
    "Uchburchak boshqa bo'ldi, uchta burchak ham boshqa bo'ldi -- yig'indi esa 180 bo'lib qoldi. Bu QONUNIYAT: har qanday uchburchakda burchaklar yig'indisi 180 darajaga teng.",
    'Треугольник стал другим, все три угла стали другими — а сумма осталась 180. Это ЗАКОНОМЕРНОСТЬ: в любом треугольнике сумма углов равна 180 градусам.',
    'The triangle became different, all three angles became different — and the sum stayed 180. That is a REGULARITY: in any triangle the angles add to 180 degrees.',
  ),
  audio: [
    A('mount', "Endi uchni ko'chiramiz va yig'indini kuzatamiz.", 'Теперь перенесём вершину и посмотрим на сумму.', 'Now we move the vertex and watch the sum.'),
    A('mount', "Uch ; uch tugunini bosing.", 'Нажми на узел три ; три.', 'Tap the node three ; three.'),
    A('move', "Burchaklarga qarang, keyin yig'indiga.", 'Посмотри на углы, потом на сумму.', 'Look at the angles, then at the sum.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Uchinchi burchak ayirma bilan.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Uchinchi burchak', 'Третий угол', 'The third angle'),
  given: L(
    "Uchburchakning ikki burchagi 55 va 65 daraja. Uchinchisi nechcha daraja?",
    'Два угла треугольника 55 и 65 градусов. Сколько градусов третий?',
    'Two angles of a triangle are 55 and 65 degrees. How big is the third?',
  ),
  template: ['180 − 55 − 65 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '60' },
    { id: 'b', label: '70' },
    { id: 'c', label: '120' },
    { id: 'd', label: '50' },
  ],
  answer: ['a'],
  prompt: L(
    "Uchinchi burchakni hisoblang.",
    'Посчитай третий угол.',
    'Work out the third angle.',
  ),
  checkNote: L(
    "Yig'indi 180 ekanini bilsak, uchinchi burchak ayirma bilan topiladi: chizma ham, o'lchov ham kerak emas.",
    'Зная, что сумма 180, третий угол находим вычитанием: ни чертежа, ни измерения не нужно.',
    'Knowing the sum is 180, the third angle comes from subtracting: no drawing, no measuring.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Ellik besh qo'shuv oltmish besh bir yuz yigirma, va bir yuz sakson dan bir yuz yigirma ayirilsa oltmish.", 'Пятьдесят пять плюс шестьдесят пять это сто двадцать, а сто восемьдесят минус сто двадцать это шестьдесят.', 'Fifty five plus sixty five is one hundred twenty, and one hundred eighty minus that is sixty.') },
    { key: 'c', tag: 'Z2', hint: L("Bir yuz yigirma bu ikki burchakning yig'indisi, uchinchisi esa qolgani.", 'Сто двадцать это сумма двух углов, а третий это остаток.', 'One hundred twenty is the sum of the two, the third is what remains.') },
    { key: 'd', tag: 'Z6', hint: L("Qo'shishni tekshiring: ellik besh va oltmish besh.", 'Проверь сложение: пятьдесят пять и шестьдесят пять.', 'Check the addition: fifty five and sixty five.') },
  ],
  audio: [
    A('mount', "Chizma yo'q. Yig'indi ma'lum, demak uchinchi burchak ayirma bilan chiqadi.", 'Чертежа нет. Сумма известна, значит третий угол выходит вычитанием.', 'No drawing. The sum is known, so the third angle comes from subtracting.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. UCHNI SHUNDAY QO'YINGKI, BURCHAK TO'G'RI BO'LSIN.
// ============================================================
const S6 = {
  kind: 'figure',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('To\'g\'ri burchakli qiling', 'Сделай прямоугольным', 'Make it right-angled'),
  pts: { A: { x: -3, y: -3 }, B: { x: 1, y: -3 }, C: { x: 2, y: 2 } },
  move: 'C',
  pick: { x: -3, y: 1 },
  show: { angles: true, sum: true },
  guess: true,
  caption: L(
    "C uchini shunday tugunga qo'yingki, A dagi burchak to'g'ri bo'lsin. Yig'indiga ham qarab turing.",
    'Поставь вершину C в такой узел, чтобы угол при A стал прямым. И следи за суммой.',
    'Place the vertex C at a node so the angle at A becomes right. And keep an eye on the sum.',
  ),
  options: [
    { id: 'a', label: L("qolgan ikkisi birga 90 daraja beradi", 'остальные два вместе дают 90 градусов', 'the other two together give 90 degrees') },
    { id: 'b', label: L("qolgan ikkisi birga 180 beradi", 'остальные два вместе дают 180', 'the other two give 180') },
    { id: 'c', label: L("yig'indi 270 bo'lib qoldi", 'сумма стала 270', 'the sum became 270') },
    { id: 'd', label: L("ikkinchi to'g'ri burchak paydo bo'ldi", 'появился второй прямой угол', 'a second right angle appeared') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Bir yuz sakson uchtasining yig'indisi, to'qson esa allaqachon olingan.", 'Сто восемьдесят это сумма трёх, а девяносто уже занято.', 'One hundred eighty is the sum of three, and ninety is already taken.') },
    { key: 'c', tag: 'Z1', hint: L("Chizma ostidagi songa qarang: u o'zgarmadi.", 'Посмотри на число под чертежом: оно не изменилось.', 'Look at the number under the drawing: it did not change.') },
    { key: 'd', tag: 'Z2', hint: L("Ikkita to'g'ri burchak bo'lsa uchinchisiga joy qolmasdi.", 'Если бы прямых углов было два, третьему не осталось бы места.', 'With two right angles there would be no room for a third.') },
  ],
  note: L(
    "To'g'ri burchakli uchburchakda qolgan ikki burchak birga 90 daraja beradi: 180 dan 90 ayirilsa 90 qoladi. Bu alohida qoida emas, o'sha yig'indining natijasi.",
    'В прямоугольном треугольнике два остальных угла вместе дают 90 градусов: из 180 вычли 90 и осталось 90. Это не отдельное правило, а следствие той же суммы.',
    'In a right triangle the other two angles add to 90 degrees: 180 minus 90 leaves 90. That is no separate rule but a consequence of the same sum.',
  ),
  audio: [
    A('mount', "Endi to'g'ri burchakli uchburchak yasaymiz.", 'Теперь построим прямоугольный треугольник.', 'Now we build a right triangle.'),
    A('mount', "A dagi burchak to'g'ri bo'lishi kerak: uchni tik qatorga qo'ying.", 'Угол при A должен стать прямым: поставь вершину в вертикальный ряд.', 'The angle at A must become right: put the vertex in the upright row.'),
    A('move', "Yig'indi o'zgarmadi. Qolgan ikki burchakni qo'shib ko'ring.", 'Сумма не изменилась. Сложи два остальных угла.', 'The sum did not change. Add the other two angles.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT. TENG TOMONLIGA YAQIN: uchtasi teng bo'lsa
// har biri oltmish daraja.
// ============================================================
const S7 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Uchtasi teng bo\'lsa', 'Если все три равны', 'If all three are equal'),
  given: L(
    "Uchburchakning uchta burchagi ham teng. Har biri nechcha daraja?",
    'Все три угла треугольника равны. Сколько градусов каждый?',
    'All three angles of a triangle are equal. How many degrees is each?',
  ),
  template: ['180 : 3 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '60' },
    { id: 'b', label: '90' },
    { id: 'c', label: '45' },
    { id: 'd', label: '30' },
  ],
  answer: ['a'],
  prompt: L(
    "Har bir burchakni hisoblang.",
    'Посчитай каждый угол.',
    'Work out each angle.',
  ),
  checkNote: L(
    "Uchtasi teng bo'lsa, yig'indi uchga teng bo'linadi: har biri 60 daraja. Bunday uchburchak teng tomonli bo'ladi, va uni chizg'ich bilan o'lchash kerak emas -- yig'indi javobni o'zi beradi.",
    'Если все три равны, сумма делится на три: по 60 градусов. Такой треугольник равносторонний, и линейка тут не нужна — сумма сама даёт ответ.',
    'If all three are equal the sum splits into three: 60 degrees each. Such a triangle is equilateral, and no ruler is needed — the sum gives the answer.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Uchta to'qson ikki yuz yetmish beradi, bu esa juda ko'p.", 'Три девяностых дают двести семьдесят, а это слишком много.', 'Three nineties give two hundred seventy, far too much.') },
    { key: 'c', tag: 'Z6', hint: L("Uchta qirq besh bir yuz o'ttiz besh beradi.", 'Три сорок пять дают сто тридцать пять.', 'Three forty fives give one hundred thirty five.') },
    { key: 'd', tag: 'Z6', hint: L("Uchta o'ttiz to'qson beradi, kerak bo'lgani esa bir yuz sakson.", 'Три тридцатки дают девяносто, а нужно сто восемьдесят.', 'Three thirties give ninety, but one hundred eighty is needed.') },
  ],
  audio: [
    A('mount', "Chegaraviy holat: uchta burchak ham teng.", 'Граничный случай: все три угла равны.', 'The edge case: all three angles are equal.'),
    A('mount', "Chizma ham, o'lchov ham kerak emas: yig'indi javobni beradi.", 'Ни чертежа, ни измерения не нужно: сумма даёт ответ.', 'No drawing, no measuring: the sum gives the answer.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z1',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('har qanday uchburchakda', 'в любом треугольнике', 'in any triangle') },
    { id: 'f2', label: L("uch burchakning yig'indisi 180 daraja", 'сумма трёх углов равна 180 градусам', 'the three angles add to 180 degrees') },
    { id: 'f3', label: L('shuning uchun ikkitasi ma\'lum bo\'lsa', 'поэтому если известны два', 'so if two are known') },
    { id: 'f4', label: L('uchinchisi ayirma bilan topiladi', 'третий находится вычитанием', 'the third comes from subtracting') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval qoida qayerda ishlashi va yig'indi, keyin undan chiqadigan foyda.",
    'Порядок нарушен. Сначала где правило работает и сумма, потом польза из него.',
    'The order is off. Where the rule holds and the sum first, then what it gives you.',
  ),
  lawChips: [
    { label: '180', tone: 'off' },
    { label: '+', tone: 's1' },
    { label: '=', tone: 's2' },
    { label: '( )', tone: 'par' },
  ],
  lawSweep: L(
    "yoyilgan burchak, yig'indi, tenglik, juftlik",
    'развёрнутый угол, сумма, равенство, пара',
    'the straight angle, the sum, equality, the pair',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Har qanday uchburchakda burchaklar yig'indisi 180 darajaga teng. Shuning uchun ikki burchak ma'lum bo'lsa, uchinchisi ayirma bilan topiladi, va to'g'ri burchakli uchburchakda qolgan ikkisi birga 90 daraja beradi.",
        'В любом треугольнике сумма углов равна 180 градусам. Поэтому если известны два угла, третий находится вычитанием, а в прямоугольном треугольнике два остальных вместе дают 90 градусов.',
        'In any triangle the angles add to 180 degrees. So if two are known the third comes from subtracting, and in a right triangle the other two add to 90 degrees.',
      ),
      L(
        "Biz bu qoidani chizmada O'LCHADIK: uch ko'chdi, burchaklar o'zgardi, yig'indi esa qoldi. O'lchov qonuniyatni ko'rsatadi, lekin isbotlamaydi -- isbot parallel chiziqlar bilan keladi.",
        'Мы это правило ИЗМЕРИЛИ на чертеже: вершина двигалась, углы менялись, а сумма оставалась. Измерение показывает закономерность, но не доказывает её — доказательство придёт с параллельными прямыми.',
        'We MEASURED this rule on the drawing: the vertex moved, the angles changed, the sum stayed. A measurement shows a regularity but does not prove it — the proof comes with parallel lines.',
      ),
    ],
  },
  hookCap: L(
    "Uch burchak  --  180 daraja",
    'Три угла — 180 градусов',
    'Three angles — 180 degrees',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("yig'indi  --  180", 'сумма это 180', 'the sum is 180'),
    L('uchinchisi  --  ayirma', 'третий это разность', 'the third is a difference'),
    L("to'g'ri burchakli  --  qolgani 90", 'прямоугольный: остальные 90', 'right-angled: the rest make 90'),
  ],
  audio: [
    A('mount', "Yig'indi uch xil uchburchakda bir xil chiqdi. Endi qoidani yig'amiz.", 'Сумма вышла одинаковой в трёх разных треугольниках. Теперь соберём правило.', 'The sum came out the same in three different triangles. Now let us build the rule.'),
    A('ok', "To'g'ri. Va yodda tuting: bu hozircha o'lchovga tayangan qonuniyat.", 'Верно. И помни: пока это закономерность, опирающаяся на измерение.', 'Correct. And remember: for now this is a regularity resting on measurement.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchinchi burchakni toping', 'Найди третий угол', 'Find the third angle'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki burchak 40 va 60 daraja. Uchinchisi?",
        'Два угла 40 и 60 градусов. Третий?',
        'Two angles are 40 and 60 degrees. The third?',
      ),
      ok: L("Bir yuz sakson dan yuz ayirilsa sakson qoladi.", 'Сто восемьдесят минус сто это восемьдесят.', 'One hundred eighty minus one hundred is eighty.'),
      items: [
        { id: 'a', label: '80°', correct: true },
        { id: 'b', label: '100°', tag: 'Z2', hint: L("Yuz bu ikkitasining yig'indisi.", 'Сто это сумма двух данных.', 'One hundred is the sum of the two given.') },
        { id: 'c', label: '90°', tag: 'Z6', hint: L("Qirq qo'shuv oltmish yuz bo'ladi.", 'Сорок плюс шестьдесят это сто.', 'Forty plus sixty is one hundred.') },
        { id: 'd', label: '20°', tag: 'Z6', hint: L("Ayirmani qaytadan hisoblang.", 'Посчитай разность заново.', 'Recompute the difference.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "To'g'ri burchakli uchburchakda bir o'tkir burchak 35 daraja. Ikkinchi o'tkir burchak?",
        'В прямоугольном треугольнике один острый угол 35 градусов. Второй острый угол?',
        'In a right triangle one acute angle is 35 degrees. The second acute angle?',
      ),
      ok: L("O'tkir burchaklar birga to'qson beradi: ellik besh.", 'Острые углы вместе дают девяносто: пятьдесят пять.', 'The acute angles add to ninety: fifty five.'),
      items: [
        { id: 'a', label: '55°', correct: true },
        { id: 'b', label: '145°', tag: 'Z2', hint: L("Bir yuz qirq besh o'tkir burchak bo'lmaydi.", 'Сто сорок пять не может быть острым углом.', 'One hundred forty five cannot be acute.') },
        { id: 'c', label: '65°', tag: 'Z6', hint: L("To'qson dan o'ttiz besh ayirilsa ellik besh qoladi.", 'Девяносто минус тридцать пять это пятьдесят пять.', 'Ninety minus thirty five is fifty five.') },
        { id: 'd', label: '35°', tag: 'Z4', hint: L("Teng bo'lishi shart emas: bu teng yonli emas.", 'Равными они быть не обязаны: треугольник не равнобедренный.', 'They need not be equal: this is not an isosceles triangle.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Teng yonli uchburchakda uchdagi burchak 20 daraja. Asosdagi har bir burchak?",
        'В равнобедренном треугольнике угол при вершине 20 градусов. Каждый угол при основании?',
        'An isosceles triangle has a 20 degree apex angle. Each base angle?',
      ),
      ok: L("Bir yuz sakson dan yigirma ayirilsa bir yuz oltmish, uni ikkiga bo'lsak sakson.", 'Сто восемьдесят минус двадцать это сто шестьдесят, делим на два и получаем восемьдесят.', 'One hundred eighty minus twenty is one hundred sixty, halved gives eighty.'),
      items: [
        { id: 'a', label: '80°', correct: true },
        { id: 'b', label: '160°', tag: 'Z4', hint: L("Bir yuz oltmish ikki burchakka birga tegishli, har biriga yarmi.", 'Сто шестьдесят это на два угла вместе, каждому половина.', 'One hundred sixty is for both angles, each gets half.') },
        { id: 'c', label: '20°', tag: 'Z4', hint: L("Yigirma bu uchdagi burchak.", 'Двадцать это угол при вершине.', 'Twenty is the apex angle.') },
        { id: 'd', label: '70°', tag: 'Z6', hint: L("Bir yuz oltmishning yarmi sakson.", 'Половина ста шестидесяти это восемьдесят.', 'Half of one hundred sixty is eighty.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda burchaklar 70, 60 va 60 bo'la oladimi?",
        'Могут ли углы треугольника быть 70, 60 и 60?',
        'Can a triangle have angles 70, 60 and 60?',
      ),
      ok: L("Yo'q: yig'indi bir yuz to'qson chiqadi, kerak bo'lgani esa bir yuz sakson.", 'Нет: сумма выходит сто девяносто, а нужно сто восемьдесят.', 'No: the sum is one hundred ninety, but one hundred eighty is needed.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z1', label: L('ha', 'да', 'yes'), hint: L("Qo'shib ko'ring: yetmish qo'shuv oltmish qo'shuv oltmish.", 'Сложи: семьдесят плюс шестьдесят плюс шестьдесят.', 'Add them: seventy plus sixty plus sixty.') },
        { id: 'c', tag: 'Z4', label: L('ha, teng yonli bo\'ladi', 'да, будет равнобедренным', 'yes, it would be isosceles'), hint: L("Teng yonli bo'lishi yetarli emas: yig'indi ham to'g'ri bo'lishi kerak.", 'Равнобедренности недостаточно: сумма тоже должна сойтись.', 'Being isosceles is not enough: the sum must fit too.') },
        { id: 'd', tag: 'Z3', label: L("o'lchash kerak", 'нужно измерить', 'measuring is needed'), hint: L("O'lchash kerak emas: qo'shish yetarli.", 'Измерять не нужно: достаточно сложить.', 'No measuring needed: adding is enough.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ikkinchisi to'g'ri burchakli uchburchak haqida.", 'Четыре вопроса. Второй про прямоугольный треугольник.', 'Four questions. The second is about a right triangle.'),
    A('1', "Ikkinchisida to'g'ri burchak allaqachon olingan.", 'Во втором прямой угол уже занят.', 'In the second the right angle is already taken.'),
    A('2', "Uchinchisida ikki burchak teng.", 'В третьем два угла равны.', 'In the third two angles are equal.'),
    A('3', "Oxirgisida qo'shib tekshiring.", 'В последнем проверь сложением.', 'In the last one check by adding.'),
  ],
}

// ============================================================
// 10. MASHQ 2. IKKI QADAM: teng yonlida taqsimlash.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Teng yonlida', 'В равнобедренном', 'In an isosceles triangle'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Teng yonli uchburchakning uchdagi burchagi 40 daraja. Asosdagi ikki burchakka qolgan darajalarni topib, har birini yozing.",
    'Угол при вершине равнобедренного треугольника 40 градусов. Найди, сколько градусов остаётся на два угла при основании, и запиши каждый.',
    'The apex angle of an isosceles triangle is 40 degrees. Find how many degrees remain for the two base angles and write each.',
  ),
  template: ['180 − 40 = ', { slot: 0 }, ',   : 2 = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '140' },
    { id: 'b', label: '70' },
    { id: 'c', label: '160' },
    { id: 'd', label: '80' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Qolgan darajalarni va har bir asos burchagini yozing.",
    'Запиши остаток и каждый угол при основании.',
    'Write the remainder and each base angle.',
  ),
  checkNote: L(
    "Bir yuz sakson dan uchdagi burchak ayiriladi, qolgani esa ikki teng burchakka bo'linadi: har biri 70 daraja.",
    'Из ста восьмидесяти вычитается угол при вершине, а остаток делится на два равных угла: по 70 градусов.',
    'The apex angle is taken from one hundred eighty and the remainder splits into two equal angles: 70 degrees each.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Bir yuz sakson dan qirq ayirilsa bir yuz qirq qoladi.", 'Сто восемьдесят минус сорок это сто сорок.', 'One hundred eighty minus forty is one hundred forty.') },
    { key: 'd', tag: 'Z4', hint: L("Bir yuz qirqning yarmi yetmish.", 'Половина ста сорока это семьдесят.', 'Half of one hundred forty is seventy.') },
    { key: '*', tag: 'Z4', hint: L("Avval ayirish, keyin ikkiga bo'lish.", 'Сначала вычитание, потом деление на два.', 'Subtract first, then halve.') },
  ],
  probe: {
    question: L("Bu uchburchak burchaklar bo'yicha qanday?", 'Какой это треугольник по углам?', 'What kind is it by angles?'),
    items: [
      { id: 'a', correct: true, label: L("o'tkir burchakli", 'остроугольный', 'acute-angled') },
      { id: 'b', tag: 'Z2', label: L("to'g'ri burchakli", 'прямоугольный', 'right-angled'), hint: L("To'qson darajali burchak yo'q: qirq, yetmish va yetmish.", 'Угла девяносто нет: сорок, семьдесят и семьдесят.', 'There is no ninety: forty, seventy and seventy.') },
      { id: 'c', tag: 'Z2', label: L("o'tmas burchakli", 'тупоугольный', 'obtuse-angled'), hint: L("Eng katta burchak yetmish, u esa to'qsondan kichik.", 'Самый большой угол семьдесят, а это меньше девяноста.', 'The largest angle is seventy, under ninety.') },
      { id: 'd', tag: 'Z4', label: L('teng tomonli', 'равносторонний', 'equilateral'), hint: L("Bu tomonlar bo'yicha nom, va uchtasi teng emas.", 'Это название по сторонам, и все три не равны.', 'That is a name by sides, and all three are not equal.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam: avval qolgan darajalar, keyin ularni ikkiga bo'lish.", 'Два шага: сначала остаток, потом делим его на два.', 'Two steps: the remainder first, then halve it.'),
    A('two', "Endi ikkiga bo'lamiz.", 'Теперь делим на два.', 'Now we halve it.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Ikki burchak berilgan', 'Даны два угла', 'Two angles are given'),
  given: L(
    "Uchburchakning burchaklari 25 va 95 daraja. Uchinchisi nechcha daraja?",
    'Углы треугольника 25 и 95 градусов. Сколько градусов третий?',
    'Two angles of a triangle are 25 and 95 degrees. How big is the third?',
  ),
  template: ['180 − 25 − 95 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '60' },
    { id: 'b', label: '70' },
    { id: 'c', label: '120' },
    { id: 'd', label: '50' },
  ],
  answer: ['a'],
  prompt: L(
    "Uchinchi burchakni hisoblang.",
    'Посчитай третий угол.',
    'Work out the third angle.',
  ),
  checkNote: L(
    "Yigirma besh qo'shuv to'qson besh bir yuz yigirma beradi, bir yuz sakson dan bir yuz yigirma ayirilsa oltmish qoladi.",
    'Двадцать пять плюс девяносто пять это сто двадцать, сто восемьдесят минус сто двадцать это шестьдесят.',
    'Twenty five plus ninety five is one hundred twenty, and one hundred eighty minus that is sixty.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Qo'shishni tekshiring: yigirma besh va to'qson besh.", 'Проверь сложение: двадцать пять и девяносто пять.', 'Check the addition: twenty five and ninety five.') },
    { key: 'c', tag: 'Z2', hint: L("Bir yuz yigirma ikkitasining yig'indisi.", 'Сто двадцать это сумма двух данных.', 'One hundred twenty is the sum of the two given.') },
    { key: 'd', tag: 'Z6', hint: L("Ayirmani qaytadan hisoblang.", 'Посчитай разность заново.', 'Recompute the difference.') },
  ],
  audio: [
    A('mount', "Bu safar yordam yo'q.", 'На этот раз без помощи.', 'No help this time.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Yig'indi TO'G'RI ishlatilgan, lekin javob
// TASHQI burchakka yozilgan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Yig'indi to'g'ri ishlatilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Сумма использована верно. И всё же какая строка ошибочна?',
    'The sum was used correctly. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('ikki burchak 50° va 60°', 'два угла 50° и 60°', 'two angles are 50° and 60°') },
    { id: 'r2', text: '180 − 50 − 60 = 70' },
    { id: 'r3', text: L("70° ning qo'shnisi ham 70°", 'смежный с 70° тоже 70°', 'the angle adjacent to 70° is 70° too') },
    { id: 'r4', text: L("qo'shni burchak 70°", 'смежный угол 70°', 'the adjacent angle is 70°') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu berilgan burchaklar.", 'Это данные углы.', 'Those are the given angles.'),
    r2: L("To'g'ri: yig'indi ishlatilgan, uchinchi burchak 70 daraja.", 'Верно: сумма использована, третий угол 70 градусов.', 'Right: the sum was used, the third angle is 70 degrees.'),
    r4: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r4: 'Z2' },
  proofFill: {
    template: ['180 − 70 = ', { slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: '110' },
      { id: 'b', label: L("qo'shni burchak", 'смежный угол', 'the adjacent angle') },
      { id: 'c', label: '70' },
      { id: 'd', label: L('uchburchak burchagi', 'угол треугольника', 'an angle of the triangle') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Qo'shni burchakni hisoblang va uni nomlang.",
      'Посчитай смежный угол и назови его.',
      'Work out the adjacent angle and name it.',
    ),
    checkNote: L(
      "Qo'shni burchak uchburchakning ichida emas, tashqarisida turadi. U 70 ga teng bo'lmaydi: 180 dan 70 ayirilsa 110 chiqadi.",
      'Смежный угол лежит не внутри треугольника, а снаружи. Он не равен 70: сто восемьдесят минус семьдесят это сто десять.',
      'The adjacent angle lies outside the triangle, not inside. It is not 70: one hundred eighty minus seventy is one hundred ten.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z5', hint: L("Yetmish uchburchakning ichidagi burchak, qo'shnisi esa uni 180 gacha to'ldiradi.", 'Семьдесят это угол внутри треугольника, а смежный дополняет его до 180.', 'Seventy is the angle inside; the adjacent one fills it up to 180.') },
      { key: 'd', tag: 'Z5', hint: L("Uchburchakning burchaklari uchtasi allaqachon topilgan.", 'Три угла треугольника уже найдены.', 'The triangle already has its three angles.') },
      { key: '*', tag: 'Z5', hint: L("Ichki va tashqi burchak boshqa-boshqa.", 'Внутренний и внешний угол это разные углы.', 'The interior and the exterior angle are different.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda yig'indi to'g'ri ishlatilgan.", 'В этой ловушке сумма использована верно.', 'In this trap the sum was used correctly.'),
    A('mount', "Lekin oxirgi qator boshqa burchak haqida.", 'Но последняя строка про другой угол.', 'But the last line is about a different angle.'),
    A('proof', "Topdingiz. Qo'shni burchak tashqarida turadi.", 'Нашёл. Смежный угол лежит снаружи.', 'You found it. The adjacent angle lies outside.'),
    A('done', "Uchburchakning yig'indisi ichki burchaklar haqida.", 'Сумма треугольника про внутренние углы.', 'The sum of a triangle is about its interior angles.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TOM NISHABI.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Tom nishabi', 'Скат крыши', 'The slope of a roof'),
  given: L(
    "Tomning uchida burchak 90 daraja. Bir tomondagi nishab burchagi 50 daraja. Ikkinchi tomondagi nishab burchagi nechcha daraja?",
    'Угол при вершине крыши 90 градусов. Угол одного ската 50 градусов. Сколько градусов угол второго ската?',
    'The angle at the roof apex is 90 degrees. One slope makes 50 degrees. What angle does the other slope make?',
  ),
  template: ['180 − 90 − 50 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '40' },
    { id: 'b', label: '50' },
    { id: 'c', label: '130' },
    { id: 'd', label: '30' },
  ],
  answer: ['a'],
  prompt: L(
    "Ikkinchi nishab burchagini hisoblang.",
    'Посчитай угол второго ската.',
    'Work out the angle of the second slope.',
  ),
  checkNote: L(
    "Tom uchburchak beradi, uchta burchak esa birga 180 daraja. To'g'ri burchak olingandan keyin nishablarga 90 daraja qoladi, va ulardan ellikni ayirsak qirq chiqadi.",
    'Крыша даёт треугольник, а три угла вместе 180 градусов. После прямого угла на скаты остаётся 90 градусов, и если вычесть пятьдесят, выйдет сорок.',
    'The roof makes a triangle, and three angles add to 180. After the right angle the slopes have 90 degrees left, and taking fifty leaves forty.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Nishablar teng bo'lishi shart emas: birinchisi ellik, ikkinchisi boshqa.", 'Скаты не обязаны быть равными: первый пятьдесят, второй другой.', 'The slopes need not be equal: the first is fifty, the second differs.') },
    { key: 'c', tag: 'Z5', hint: L("Bu qo'shni burchak bo'lardi.", 'Это был бы смежный угол.', 'That would be the adjacent angle.') },
    { key: 'd', tag: 'Z6', hint: L("To'qson dan ellik ayirilsa qirq qoladi.", 'Девяносто минус пятьдесят это сорок.', 'Ninety minus fifty is forty.') },
  ],
  audio: [
    A('mount', "Tom ham uchburchak beradi.", 'Крыша тоже даёт треугольник.', 'A roof makes a triangle too.'),
    A('mount', "Uchta burchak birga bir yuz sakson beradi.", 'Три угла вместе дают сто восемьдесят.', 'Three angles together give one hundred eighty.'),
  ],
}

// ============================================================
// 14. BLITS.
// ============================================================
const S14 = {
  kind: 'blitz',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki burchak 30 va 80 daraja. Uchinchisi?",
        'Два угла 30 и 80 градусов. Третий?',
        'Two angles are 30 and 80 degrees. The third?',
      ),
      ok: L("Bir yuz sakson dan bir yuz o'n ayirilsa yetmish.", 'Сто восемьдесят минус сто десять это семьдесят.', 'One hundred eighty minus one hundred ten is seventy.'),
      items: [
        { id: 'a', label: '70°', correct: true },
        { id: 'b', label: '110°', tag: 'Z2', hint: L("Bir yuz o'n ikkitasining yig'indisi.", 'Сто десять это сумма двух данных.', 'One hundred ten is the sum of the two given.') },
        { id: 'c', label: '80°', tag: 'Z6', hint: L("Ayirmani hisoblang.", 'Посчитай разность.', 'Compute the difference.') },
        { id: 'd', label: '60°', tag: 'Z6', hint: L("O'ttiz qo'shuv sakson bir yuz o'n bo'ladi.", 'Тридцать плюс восемьдесят это сто десять.', 'Thirty plus eighty is one hundred ten.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "To'g'ri burchakli uchburchakda o'tkir burchaklar birga nechcha daraja beradi?",
        'Сколько градусов вместе дают острые углы прямоугольного треугольника?',
        'How many degrees do the acute angles of a right triangle add to?',
      ),
      ok: L("To'qson: bir yuz sakson dan to'g'ri burchak olingan.", 'Девяносто: прямой угол уже взят из ста восьмидесяти.', 'Ninety: the right angle is already taken from the one hundred eighty.'),
      items: [
        { id: 'a', label: '90°', correct: true },
        { id: 'b', label: '180°', tag: 'Z2', hint: L("Bir yuz sakson uchtasining yig'indisi.", 'Сто восемьдесят это сумма всех трёх.', 'One hundred eighty is the sum of all three.') },
        { id: 'c', label: '45°', tag: 'Z6', hint: L("Qirq besh har biri bo'lishi mumkin, ikkovi esa to'qson.", 'Сорок пять может быть каждым, а вместе девяносто.', 'Forty five may be each of them, together ninety.') },
        { id: 'd', label: '120°', tag: 'Z6', hint: L("Bir yuz sakson dan to'qson ayirilsa to'qson qoladi.", 'Сто восемьдесят минус девяносто это девяносто.', 'One hundred eighty minus ninety is ninety.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Teng yonli uchburchakda asosdagi burchak 50 daraja. Uchdagi burchak?",
        'В равнобедренном треугольнике угол при основании 50 градусов. Угол при вершине?',
        'A base angle of an isosceles triangle is 50 degrees. The apex angle?',
      ),
      ok: L("Ikki asos burchagi yuz beradi, qolgani sakson.", 'Два угла при основании дают сто, остаётся восемьдесят.', 'Two base angles give one hundred, leaving eighty.'),
      items: [
        { id: 'a', label: '80°', correct: true },
        { id: 'b', label: '50°', tag: 'Z4', hint: L("Uchdagi burchak asosdagiga teng bo'lishi shart emas.", 'Угол при вершине не обязан быть равным углу при основании.', 'The apex angle need not equal a base angle.') },
        { id: 'c', label: '130°', tag: 'Z4', hint: L("Faqat bitta asos burchagini ayirdingiz, ikkitasi bor.", 'Ты вычел только один угол при основании, а их два.', 'You took away only one base angle, and there are two.') },
        { id: 'd', label: '100°', tag: 'Z4', hint: L("Yuz bu ikki asos burchagining yig'indisi.", 'Сто это сумма двух углов при основании.', 'One hundred is the sum of the two base angles.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda ikkita o'tmas burchak bo'la oladimi?",
        'Может ли в треугольнике быть два тупых угла?',
        'Can a triangle have two obtuse angles?',
      ),
      ok: L("Yo'q: ikkitasi allaqachon bir yuz sakson dan oshib ketardi.", 'Нет: два таких угла уже превысили бы сто восемьдесят.', 'No: two of them would already exceed one hundred eighty.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z1', label: L('ha', 'да', 'yes'), hint: L("Har biri to'qsondan katta, ikkovi esa bir yuz saksondan katta bo'lib qolardi.", 'Каждый больше девяноста, а вместе они превысили бы сто восемьдесят.', 'Each is over ninety, so together they would pass one hundred eighty.') },
        { id: 'c', tag: 'Z4', label: L('teng yonlida', 'в равнобедренном', 'in an isosceles one'), hint: L("Tur yordam bermaydi: yig'indi hamma uchburchakda bir xil.", 'Вид не поможет: сумма одинакова во всех треугольниках.', 'The kind does not help: the sum is the same in every triangle.') },
        { id: 'd', tag: 'Z3', label: L("o'lchash kerak", 'нужно измерить', 'measuring is needed'), hint: L("O'lchash kerak emas: qo'shish yetarli.", 'Измерять не нужно: достаточно сложить.', 'No measuring needed: adding is enough.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран.', 'Quick round, four questions. The only graded screen.'),
    A('1', "Ikkinchisi to'g'ri burchakli uchburchak haqida.", 'Второй про прямоугольный треугольник.', 'The second is about a right triangle.'),
    A('2', "Uchinchisida asosdagi burchak berilgan.", 'В третьем дан угол при основании.', 'In the third a base angle is given.'),
    A('3', "Oxirgisida qo'shib o'ylang.", 'В последнем подумай сложением.', 'In the last one think by adding.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Yig\'indi qimirlamaydi', 'Сумма не шевелится', 'The sum does not budge'),
  gate: S1.gate,
  fix: {
    tokens: ['bir xil'],
    value: '180',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Uchni ko'chirdik, burchaklar o'zgardi, yig'indi esa har safar bir yuz sakson bo'lib qoldi. Bu qonuniyat, va uning isboti keyingi darsda keladi.",
    'Мы переносили вершину, углы менялись, а сумма каждый раз оставалась сто восемьдесят. Это закономерность, и её доказательство придёт на следующем уроке.',
    'We moved the vertex, the angles changed, and the sum stayed one hundred eighty every time. That is a regularity, and its proof comes next lesson.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    same: L('har doim bir xil', 'всегда одинаковая', 'always the same'),
    diff: L('har xil bo\'ladi', 'будет разной', 'it will differ'),
    big: L('kattada kattaroq', 'у большого больше', 'larger for a larger one'),
    kind: L('turiga bog\'liq', 'зависит от вида', 'depends on the kind'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['180', '180 − 55 − 65 = 60', '90 + 90', '180 : 3 = 60'],
  twoLabel: L('Yig\'indi nima beradi', 'Что даёт сумма', 'What the sum gives'),
  twoA: L(
    "ikkitasi ma'lum  →  uchinchisi ayirma",
    'известны два  →  третий разностью',
    'two known  →  the third by subtracting',
  ),
  twoB: L(
    "to'g'ri burchakli  →  qolgani 90",
    'прямоугольный  →  остальные 90',
    'right-angled  →  the rest make 90',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'parallel chiziqlar va kesuvchi',
    'параллельные прямые и секущая',
    'parallel lines and a transversal',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Yig'indi uchburchakka bog'liq emas: u har doim bir yuz sakson.", 'Сумма от треугольника не зависит: она всегда сто восемьдесят.', 'The sum does not depend on the triangle: it is always one hundred eighty.'),
    A('mount', "Keyingi darsda parallel chiziqlar bu qonuniyatni isbotga aylantiradi.", 'На следующем уроке параллельные прямые превратят эту закономерность в доказательство.', 'Next lesson parallel lines turn this regularity into a proof.'),
  ],
}

export default makeLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
