// ============================================================================
// 7-sinf, Dars 48. YAKUNIY TAKRORLASH. B7 BLOKI VA KURS YOPILADI.
// (Итоговое повторение)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// BU DARS TAKRORLASH, LEKIN QAYTA AYTISH EMAS. Har ekran blokning ikki
// faktini BIR MASALADA uchrashtiradi: qo'shni burchak va yig'indi, teng
// yonlilik va yig'indi, to'g'ri burchak va nisbat. Bitta fakt bilan
// yechiladigan savol bu darsda faqat tayanch ekranida qoladi.
//
// ASBOBDAGI QARAMA-QARSHILIK -- DARSNING O'ZAGI: uch ko'chganda asosdagi
// burchaklar tengligi YO'QOLADI, yig'indi esa QOLADI. Ya'ni blokda ikki xil
// tasdiq bor: SHARTLI (teng tomonlar bo'lsa) va SHARTSIZ (har qanday
// uchburchakda). Sonlar tekshirilgan: (0;3) da 59, 59, 62; (2;3) da 45, 79,
// 56 -- ikkovida ham yig'indi 180.
//
// «O'LCHOV ISBOT EMAS» (§9) ishlaydi: `guess` o'lchov ko'rsatilgan har
// ekranda.
//
// KURSNING OXIRGI DARSI: yakunda keyingi tema 8-sinf sifatida ko'rsatiladi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_48'
const LESSON_TITLE = L('Yakuniy takrorlash', 'Итоговое повторение', 'The final review')
const LESSON_NO = L('48-dars', 'Урок 48', 'Lesson 48')
const BLOCK = { label: L('B7-blok', 'Блок Б7', 'Block B7'), from: 40, to: 48, current: 48 }

const TAGS = {
  Z1: L("qo'shni burchak va yig'indi aralashtirildi", 'смежный угол и сумма углов спутаны', 'the adjacent angle mixed with the angle sum'),
  Z2: L('asosdagi va uchdagi burchak', 'угол при основании и при вершине', 'the base angle and the apex angle'),
  Z3: L('shartli tasdiq shartsiz deb olindi', 'условное утверждение принято за безусловное', 'a conditional claim taken as unconditional'),
  Z4: L('tomon va burchak nisbati', 'соотношение стороны и угла', 'how a side relates to an angle'),
  Z5: L('parallellik sharti', 'условие параллельности', 'the condition for parallelism'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Uch qadamli masala: yig'indi, teng yonlilik, qo'shni burchak.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('YAKUNIY TAKRORLASH', 'ИТОГОВОЕ ПОВТОРЕНИЕ', 'THE FINAL REVIEW'),
  noBack: true,
  noNotes: true,
  title: L('Uchta fakt bitta masalada', 'Три факта в одной задаче', 'Three facts in one problem'),
  gate: {
    source: { kind: 'plain', tokens: ['80°', '?'] },
    rows: [
      { tokens: ['50°'], value: '50' },
      { tokens: ['130°'], value: '130' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Teng yonli uchburchakning uchdagi burchagi 80 daraja. Asosni davom ettirdik. Asosdagi burchakning qo'shnisi nechcha daraja bo'ladi?",
      'Угол при вершине равнобедренного треугольника 80 градусов. Основание продлили. Сколько градусов будет смежный с углом при основании?',
      'The apex angle of an isosceles triangle is 80 degrees. The base was extended. How big is the angle adjacent to a base angle?',
    ),
    items: [
      {
        id: 'ext',
        label: L('130 daraja', '130 градусов', '130 degrees'),
        hint: L(
          "Taxminingiz qabul qilindi. Uch qadamda tekshiramiz.",
          'Прогноз принят. Проверим в три шага.',
          'Your prediction is taken. We will check it in three steps.',
        ),
      },
      {
        id: 'base',
        label: L('50 daraja', '50 градусов', '50 degrees'),
        hint: L(
          "Ellik asosdagi burchakning o'zi. So'ralgani esa uning qo'shnisi.",
          'Пятьдесят это сам угол при основании. А спрашивают его смежный.',
          'Fifty is the base angle itself. The adjacent one is asked for.',
        ),
      },
      {
        id: 'hundred',
        label: L('100 daraja', '100 градусов', '100 degrees'),
        hint: L(
          "Yuz bu ikki asos burchagining yig'indisi, bitta burchak emas.",
          'Сто это сумма двух углов при основании, а не один угол.',
          'One hundred is the sum of the two base angles, not one angle.',
        ),
      },
      {
        id: 'cant',
        label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'),
        hint: L(
          "Bilib bo'ladi: uchta ma'lum fakt yetarli.",
          'Можно: трёх известных фактов достаточно.',
          'It can: three known facts are enough.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bu masalada blokning uchta fakti bir joyda uchrashadi.", 'В этой задаче встречаются три факта блока сразу.', 'This problem brings three facts of the block together.'),
    A('mount', "Uchdagi burchak sakson daraja. Asosdagi burchakning qo'shnisi nechchi bo'ladi.", 'Угол при вершине восемьдесят градусов. Каким будет смежный с углом при основании.', 'The apex angle is eighty degrees. What will the angle adjacent to a base angle be.'),
  ],
}

// ============================================================
// 2. TAYANCH. YAGONA ekran, unda har savol bitta fakt bilan
// yechiladi. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta fakt', 'Три факта', 'Three facts'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki qo'shni burchakning yig'indisi?",
        'Сумма двух смежных углов?',
        'The sum of two adjacent angles?',
      ),
      ok: L("Bir yuz sakson daraja.", 'Сто восемьдесят градусов.', 'One hundred eighty degrees.'),
      items: [
        { id: 'a', label: '180°', correct: true },
        { id: 'b', label: '90°', tag: 'Z1', hint: L("To'qson perpendikulyar bergan burchak.", 'Девяносто это угол от перпендикуляра.', 'Ninety is the angle from a perpendicular.') },
        { id: 'c', label: '360°', tag: 'Z1', hint: L("Ikki burchak to'liq aylanish bermaydi.", 'Два угла полного оборота не дают.', 'Two angles do not make a full turn.') },
        { id: 'd', label: '120°', tag: 'Z1', hint: L("Ular yoyilgan burchakni to'ldiradi.", 'Они заполняют развёрнутый угол.', 'They fill a straight angle.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchak burchaklarining yig'indisi?",
        'Сумма углов треугольника?',
        'The sum of the angles of a triangle?',
      ),
      ok: L("Bir yuz sakson, va bu parallel chiziq bilan isbotlangan.", 'Сто восемьдесят, и это доказано параллельной прямой.', 'One hundred eighty, proved with a parallel line.'),
      items: [
        { id: 'a', label: '180°', correct: true },
        { id: 'b', label: '90°', tag: 'Z1', hint: L("To'qson to'g'ri burchakli uchburchakning o'tkir burchaklari yig'indisi.", 'Девяносто это сумма острых углов прямоугольного треугольника.', 'Ninety is the sum of the acute angles of a right triangle.') },
        { id: 'c', label: '360°', tag: 'Z1', hint: L("Uch yuz oltmish to'liq aylanish.", 'Триста шестьдесят это полный оборот.', 'Three hundred sixty is a full turn.') },
        { id: 'd', label: L("turiga bog'liq", 'зависит от вида', 'depends on the kind'), tag: 'Z3', hint: L("Bog'liq emas: buni chizmada ko'rgan edik.", 'Не зависит: мы это видели на чертеже.', 'It does not: we saw that on the drawing.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Teng yonli uchburchakda qaysi burchaklar teng?",
        'Какие углы равны в равнобедренном треугольнике?',
        'Which angles are equal in an isosceles triangle?',
      ),
      ok: L("Asosdagi ikki burchak.", 'Два угла при основании.', 'The two base angles.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('asosdagilar', 'при основании', 'the base ones'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L('uchdagi va asosdagi', 'при вершине и при основании', 'the apex and a base one'),
          hint: L("Uchdagi burchakning juftligi yo'q.", 'У угла при вершине нет пары.', 'The apex angle has no pair.'),
        },
        {
          id: 'c',
          tag: 'Z2',
          label: L('uchtasi ham', 'все три', 'all three'),
          hint: L("Uchtasi teng bo'lsa uchburchak teng tomonli bo'lardi.", 'Если бы все три были равны, треугольник был бы равносторонним.', 'If all three were equal the triangle would be equilateral.'),
        },
        {
          id: 'd',
          tag: 'Z2',
          label: L('hech qaysi', 'никакие', 'none of them'),
          hint: L("Asosdagilar teng, va bu teng yonlilikning xossasi.", 'При основании равны, и это свойство равнобедренности.', 'The base ones are equal, and that is the property.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Uch fakt: qo'shni burchaklar, yig'indi va teng yonlilik.", 'Три факта: смежные углы, сумма и равнобедренность.', 'Three facts: adjacent angles, the sum and being isosceles.'),
    A('1', "Ikkinchisi o'tgan darslarda isbotlangan.", 'Второй доказан на прошлых уроках.', 'The second was proved in earlier lessons.'),
    A('2', "Uchinchisi teng yonli uchburchak haqida.", 'Третий про равнобедренный треугольник.', 'The third is about the isosceles triangle.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. IKKI FAKT BIR CHIZMADA.
// Uchburchak yopiq va uch nuqtadan iborat, shuning uchun asbob
// burchaklarni O'ZI hisoblaydi: 59, 59 va 62, yig'indi 180.
// ============================================================
const S3 = {
  kind: 'figure',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Ikki fakt bir chizmada', 'Два факта на одном чертеже', 'Two facts on one drawing'),
  pts: { A: { x: -3, y: -2 }, B: { x: 3, y: -2 }, C: { x: 0, y: 3 } },
  show: { sides: true, angles: true },
  mark: ['A', 'B'],
  caption: L(
    "Yon tomonlar teng. Chizmada tomonlar ham, burchaklar ham bir vaqtda ko'rinadi.",
    'Боковые стороны равны. На чертеже сразу видны и стороны, и углы.',
    'The legs are equal. The drawing shows the sides and the angles at once.',
  ),
  options: [
    { id: 'a', label: L("asosdagilar teng va yig'indi 180", 'при основании равны и сумма 180', 'the base ones are equal and the sum is 180') },
    { id: 'b', label: L("faqat yig'indi 180", 'только сумма 180', 'only the sum is 180') },
    { id: 'c', label: L('faqat asosdagilar teng', 'только при основании равны', 'only the base ones are equal') },
    { id: 'd', label: L('uchtasi teng', 'все три равны', 'all three are equal') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("A va B dagi sonlarni solishtiring: ular bir xil.", 'Сравни числа при A и B: они одинаковы.', 'Compare the numbers at A and B: they match.') },
    { key: 'c', tag: 'Z1', hint: L("Uchlardagi uchta sonni qo'shib ko'ring.", 'Сложи три числа при вершинах.', 'Add the three numbers at the vertices.') },
    { key: 'd', tag: 'Z2', hint: L("C dagi burchak boshqa: yon tomonlar teng, asos esa boshqa.", 'Угол при C другой: боковые равны, а основание другое.', 'The angle at C differs: the legs are equal, the base is not.') },
  ],
  note: L(
    "Bitta chizmada ikki fakt ishlaydi. Lekin ular bir xil emas: asosdagi burchaklar tengligi TENG TOMONLAR bo'lgani uchun bor, yig'indi esa hamma uchburchakda bor. Keyingi ekranda shu farqni sinab ko'ramiz.",
    'На одном чертеже работают два факта. Но они не одинаковы: равенство углов при основании есть потому, что РАВНЫ СТОРОНЫ, а сумма есть у любого треугольника. На следующем экране мы проверим эту разницу.',
    'Two facts work on one drawing. But they are not alike: the base angles are equal because the SIDES are equal, while the sum holds for every triangle. On the next screen we test that difference.',
  ),
  audio: [
    A('mount', "Chizmada teng yonli uchburchak turibdi.", 'На чертеже равнобедренный треугольник.', 'An isosceles triangle is on the drawing.'),
    A('mount', "Chizmada uchta son ko'rinadi. Ularni qo'shing va nima to'g'ri ekanini tanlang.", 'На чертеже видны три числа. Сложи их и выбери, что верно.', 'The drawing shows three numbers. Add them and choose what is true.'),
  ],
}

// ============================================================
// 4. FARQLASH. SHARTLI VA SHARTSIZ: bittasi yo'qoladi, ikkinchisi
// qoladi.
// ============================================================
const S4 = {
  kind: 'figure',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Qaysi biri yo\'qoladi', 'Что из этого пропадёт', 'Which of them disappears'),
  pts: { A: { x: -3, y: -2 }, B: { x: 3, y: -2 }, C: { x: 0, y: 3 } },
  move: 'C',
  pick: { x: 2, y: 3 },
  show: { sides: true, angles: true },
  caption: L(
    "C uchini (2; 3) nuqtaga ko'chiring. Ikki narsani kuzating: asosdagi burchaklar teng qoladimi va uchta burchak birga nechcha beradi.",
    'Перенеси вершину C в точку (2; 3). Следи за двумя вещами: остались ли равны углы при основании и сколько дают три угла вместе.',
    'Move the vertex C to the point (2; 3). Watch two things: whether the base angles stay equal and what the three angles give together.',
  ),
  options: [
    { id: 'a', label: L("burchaklar tengligi yo'qoldi, yig'indi qoldi", 'равенство углов пропало, сумма осталась', 'the equal angles went, the sum stayed') },
    { id: 'b', label: L("yig'indi yo'qoldi, tenglik qoldi", 'сумма пропала, равенство осталось', 'the sum went, the equality stayed') },
    { id: 'c', label: L('ikkovi ham yo\'qoldi', 'пропало и то и другое', 'both disappeared') },
    { id: 'd', label: L('ikkovi ham qoldi', 'осталось и то и другое', 'both stayed') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Uchta sonni qo'shing: yig'indi o'zgarmadi, uchlardagi sonlar esa har xil bo'ldi.", 'Сложи три числа: сумма не изменилась, а числа при вершинах стали разными.', 'Add the three numbers: the total is unchanged, but the ones at the vertices differ now.') },
    { key: 'c', tag: 'Z3', hint: L("Yig'indi joyida: chizma ostidagi songa qarang.", 'Сумма на месте: посмотри на число под чертежом.', 'The sum is still there: look at the number under the drawing.') },
    { key: 'd', tag: 'Z3', hint: L("Uchlardagi sonlarni solishtiring: endi uchtasi ham har xil.", 'Сравни числа при вершинах: теперь все три разные.', 'Compare the numbers at the vertices: all three differ now.') },
  ],
  note: L(
    "Blokda ikki xil tasdiq bor. SHARTLI: teng tomonlar bo'lsa, asosdagi burchaklar teng -- shart buzildi, tasdiq ham yo'qoldi. SHARTSIZ: yig'indi 180, va u har qanday uchburchakda bajariladi. Masala yechganda avval qaysi turdagi fakt kerakligini aniqlash muhim.",
    'В блоке есть два вида утверждений. УСЛОВНОЕ: если стороны равны, то углы при основании равны — условие нарушилось, и утверждение исчезло. БЕЗУСЛОВНОЕ: сумма 180, и оно выполняется в любом треугольнике. Решая задачу, важно сначала понять, факт какого вида нужен.',
    'The block has two kinds of statements. CONDITIONAL: if the sides are equal then the base angles are — break the condition and the statement goes. UNCONDITIONAL: the sum is 180, and it holds in every triangle. When solving, first decide which kind you need.',
  ),
  audio: [
    A('mount', "Endi shartni buzamiz: uchni yon tomonga suramiz.", 'Теперь нарушим условие: сдвинем вершину в сторону.', 'Now we break the condition: shift the vertex sideways.'),
    A('mount', "Ikki ; uch nuqtani bosing.", 'Нажми на точку два ; три.', 'Tap the point two ; three.'),
    A('move', "Uchlardagi sonlarga qarang, keyin ularni qo'shing.", 'Посмотри на числа при вершинах, потом сложи их.', 'Look at the numbers at the vertices, then add them.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Xukning birinchi qadami chizmasiz.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Asosdagi burchak', 'Угол при основании', 'The base angle'),
  given: L(
    "Teng yonli uchburchakning uchdagi burchagi 80 daraja. Asosdagi har bir burchak nechcha daraja?",
    'Угол при вершине равнобедренного треугольника 80 градусов. Сколько градусов каждый угол при основании?',
    'The apex angle of an isosceles triangle is 80 degrees. How big is each base angle?',
  ),
  template: ['(180° − 80°) : 2 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '50°' },
    { id: 'b', label: '100°' },
    { id: 'c', label: '80°' },
    { id: 'd', label: '40°' },
  ],
  answer: ['a'],
  prompt: L(
    "Asosdagi burchakni hisoblang.",
    'Посчитай угол при основании.',
    'Work out the base angle.',
  ),
  checkNote: L(
    "Ikki fakt birga ishladi: yig'indi 180 dan uchdagi burchak ayirildi, qolgani esa ikki TENG burchakka bo'lindi.",
    'Два факта сработали вместе: из суммы 180 вычли угол при вершине, а остаток разделили на два РАВНЫХ угла.',
    'Two facts worked together: the apex angle was taken from the 180, and the remainder split into two EQUAL angles.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Yuz bu ikki burchakka birga tegishli, har biriga yarmi.", 'Сто это на два угла вместе, каждому половина.', 'One hundred is for both angles, each gets half.') },
    { key: 'c', tag: 'Z2', hint: L("Sakson bu uchdagi burchak.", 'Восемьдесят это угол при вершине.', 'Eighty is the apex angle.') },
    { key: 'd', tag: 'Z6', hint: L("Yuzning yarmi ellik.", 'Половина ста это пятьдесят.', 'Half of one hundred is fifty.') },
  ],
  audio: [
    A('mount', "Chizma yo'q, ikki fakt esa ishlaydi.", 'Чертежа нет, а два факта работают.', 'No drawing, and two facts are at work.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. TO'G'RI BURCHAKLI VA TENG YONLI BIR VAQTDA.
// ============================================================
const S6 = {
  kind: 'figure',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Ikki nom bir vaqtda', 'Два названия сразу', 'Two names at once'),
  pts: { A: { x: -3, y: -3 }, B: { x: 1, y: -3 }, C: { x: 2, y: 2 } },
  move: 'C',
  pick: { x: -3, y: 1 },
  show: { sides: true, angles: true },
  caption: L(
    "C ni shunday qo'yingki, A dagi burchak to'g'ri bo'lsin VA A dan chiqadigan ikki tomon teng bo'lsin.",
    'Поставь C так, чтобы угол при A стал прямым И две выходящие из A стороны стали равны.',
    'Place C so that the angle at A becomes right AND the two sides from A become equal.',
  ),
  options: [
    { id: 'a', label: L("to'g'ri burchakli va teng yonli", 'прямоугольный и равнобедренный', 'right-angled and isosceles') },
    { id: 'b', label: L("faqat to'g'ri burchakli", 'только прямоугольный', 'right-angled only') },
    { id: 'c', label: L('faqat teng yonli', 'только равнобедренный', 'isosceles only') },
    { id: 'd', label: L('teng tomonli', 'равносторонний', 'equilateral') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("A dan chiqadigan ikki tomonning soniga qarang: ular teng.", 'Посмотри на числа двух сторон из A: они равны.', 'Look at the two sides from A: they are equal.') },
    { key: 'c', tag: 'Z4', hint: L("A dagi burchakka qarang: u to'qson.", 'Посмотри на угол при A: он девяносто.', 'Look at the angle at A: it is ninety.') },
    { key: 'd', tag: 'Z4', hint: L("Uchinchi tomon boshqa: gipotenuza katetlardan uzun.", 'Третья сторона другая: гипотенуза длиннее катетов.', 'The third side differs: the hypotenuse beats the legs.') },
  ],
  note: L(
    "Bir uchburchakka ikki nom to'g'ri keldi: burchaklar bo'yicha to'g'ri burchakli, tomonlar bo'yicha teng yonli. Va uch fakt birga chiqdi: to'g'ri burchak 90, o'tkir burchaklar teng, ularning yig'indisi ham 90 -- ya'ni har biri 45 daraja.",
    'Одному треугольнику подошли два названия: по углам прямоугольный, по сторонам равнобедренный. И три факта сошлись вместе: прямой угол 90, острые углы равны, а их сумма тоже 90 — значит по 45 градусов.',
    'One triangle fits two names: right-angled by its angles, isosceles by its sides. And three facts met: the right angle is 90, the acute angles are equal, and they add to 90 — so 45 each.',
  ),
  audio: [
    A('mount', "Ikki shartni bir vaqtda bajarish kerak.", 'Нужно выполнить два условия сразу.', 'Two conditions must hold at once.'),
    A('mount', "To'g'ri burchak A da bo'lsin va ikki tomon teng bo'lsin.", 'Прямой угол при A и две стороны равны.', 'A right angle at A and two equal sides.'),
    A('move', "Endi burchaklarga qarang.", 'Теперь посмотри на углы.', 'Now look at the angles.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT. Burchaklar tomonlarni CHEKLAYDI.
// ============================================================
const S7 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Burchaklar tomonlarni cheklaydi', 'Углы ограничивают стороны', 'The angles restrict the sides'),
  given: L(
    "Uchburchakning burchaklari 90, 45 va 45 daraja. Tomonlar haqida nima aytish mumkin?",
    'Углы треугольника 90, 45 и 45 градусов. Что можно сказать о сторонах?',
    'A triangle has angles of 90, 45 and 45 degrees. What can be said about its sides?',
  ),
  template: ['45° = 45°   →   ', { slot: 0 }],
  parts: [
    { id: 'a', label: L('ikki katet teng', 'два катета равны', 'the two legs are equal') },
    { id: 'b', label: L('katetlar har xil', 'катеты разные', 'the legs differ') },
    { id: 'c', label: L('gipotenuza katetga teng', 'гипотенуза равна катету', 'the hypotenuse equals a leg') },
    { id: 'd', label: L('uchtasi teng', 'все три равны', 'all three are equal') },
  ],
  answer: ['a'],
  prompt: L(
    "Tomonlar haqidagi xulosani yozing.",
    'Запиши вывод о сторонах.',
    'Write the conclusion about the sides.',
  ),
  checkNote: L(
    "Teng burchaklar qarshisida teng tomonlar yotadi, demak katetlar teng. Ya'ni tomonlari 3, 4 va 5 bo'lgan uchburchakda bunday burchaklar bo'lishi mumkin emas: unda katetlar har xil. Burchaklar tomonlarni cheklaydi, tomonlar esa burchaklarni.",
    'Против равных углов лежат равные стороны, значит катеты равны. То есть у треугольника со сторонами 3, 4 и 5 таких углов быть не может: там катеты разные. Углы ограничивают стороны, а стороны углы.',
    'Equal sides lie opposite equal angles, so the legs are equal. Hence a triangle with sides 3, 4 and 5 cannot have these angles: its legs differ. Angles restrict sides and sides restrict angles.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Katetlar har xil bo'lsa, ularning qarshisidagi burchaklar ham har xil bo'lardi.", 'Если бы катеты были разными, то и углы против них были бы разными.', 'If the legs differed, the angles facing them would differ too.') },
    { key: 'c', tag: 'Z4', hint: L("Gipotenuza har doim uzunroq: u eng katta burchak qarshisida.", 'Гипотенуза всегда длиннее: она против самого большого угла.', 'The hypotenuse is always longer: it faces the largest angle.') },
    { key: 'd', tag: 'Z4', hint: L("Uchtasi teng bo'lsa burchaklar 60, 60 va 60 bo'lardi.", 'Если бы все три были равны, углы были бы 60, 60 и 60.', 'If all three were equal the angles would be 60, 60 and 60.') },
  ],
  audio: [
    A('mount', "Chegaraviy holat: burchaklar berilgan, tomonlar so'ralgan.", 'Граничный случай: даны углы, спрашивают про стороны.', 'The edge case: the angles are given, the sides are asked about.'),
    A('mount', "Bog'liqlik ikki tomonga ishlaydi.", 'Связь работает в обе стороны.', 'The link works both ways.'),
  ],
}

// ============================================================
// 8. QOIDA. BLOKNING TO'RT USTUNI.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z3',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Blokni bir joyga yig'ing", 'Собери блок воедино', 'Gather the block together'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("qo'shni burchaklar 180, vertikallari teng", 'смежные 180, вертикальные равны', 'adjacent make 180, vertical are equal') },
    { id: 'f2', label: L("uchburchak burchaklari yig'indisi 180", 'сумма углов треугольника 180', 'the angles of a triangle make 180') },
    { id: 'f3', label: L('teng tomonlar teng burchaklarni beradi', 'равные стороны дают равные углы', 'equal sides give equal angles') },
    { id: 'f4', label: L('parallellik burchaklarni bog\'laydi', 'параллельность связывает углы', 'parallelism ties the angles together') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval chiziqlar va burchaklar, keyin uchburchak, keyin teng yonlilik, oxirida parallellik.",
    'Порядок нарушен. Сначала линии и углы, потом треугольник, потом равнобедренность, в конце параллельность.',
    'The order is off. Lines and angles first, then the triangle, then the isosceles case, and parallelism last.',
  ),
  lawChips: [
    { label: '180°', tone: 'off' },
    { label: '=', tone: 's2' },
    { label: '90°', tone: 's1' },
    { label: '( )', tone: 'par' },
  ],
  lawSweep: L(
    "yoyilgan burchak, tenglik, to'g'ri burchak, juftlik",
    'развёрнутый угол, равенство, прямой угол, пара',
    'the straight angle, equality, the right angle, the pair',
  ),
  rule: {
    badge: L('Blokning yakuni', 'Итог блока', 'The block in short'),
    lines: [
      L(
        "SHARTSIZ faktlar: qo'shni burchaklar yig'indisi 180, vertikal burchaklar teng, uchburchak burchaklari yig'indisi 180, katta burchak qarshisida katta tomon. Ular har qanday chizmada ishlaydi.",
        'БЕЗУСЛОВНЫЕ факты: сумма смежных 180, вертикальные равны, сумма углов треугольника 180, против большего угла большая сторона. Они работают на любом чертеже.',
        'UNCONDITIONAL facts: adjacent angles make 180, vertical angles are equal, a triangle makes 180, the larger side faces the larger angle. They hold on any drawing.',
      ),
      L(
        "SHARTLI faktlar: teng tomonlar bo'lsa asosdagi burchaklar teng; chiziqlar parallel bo'lsa mos burchaklar teng. Shart buzilsa tasdiq ham yo'qoladi. Masalani yechishni shartni tekshirishdan boshlash kerak.",
        'УСЛОВНЫЕ факты: если стороны равны, углы при основании равны; если прямые параллельны, соответственные углы равны. Нарушено условие исчезло и утверждение. Решение задачи начинают с проверки условия.',
        'CONDITIONAL facts: if the sides are equal the base angles are; if the lines are parallel the corresponding angles are equal. Break the condition and the claim is gone. Start solving by checking the condition.',
      ),
    ],
  },
  hookCap: L(
    'Shartli va shartsiz',
    'Условное и безусловное',
    'Conditional and unconditional',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("qo'shni  --  180", 'смежные это 180', 'adjacent means 180'),
    L("uchburchak  --  180", 'треугольник это 180', 'a triangle means 180'),
    L('teng tomonlar  --  teng burchaklar', 'равные стороны это равные углы', 'equal sides mean equal angles'),
  ],
  audio: [
    A('mount', "Blokning hamma faktini bir joyga yig'amiz.", 'Соберём все факты блока воедино.', 'Let us gather all the facts of the block.'),
    A('ok', "To'g'ri. Endi shartli va shartsiz faktni farqlaysiz.", 'Верно. Теперь ты различаешь условный и безусловный факт.', 'Correct. Now you tell a conditional fact from an unconditional one.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI. Har savol -- boshqa darsdan.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Blok bo\'ylab', 'По всему блоку', 'Across the block'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki chiziq kesishdi, bir burchak 36 daraja. Vertikal burchak?",
        'Две прямые пересеклись, один угол 36 градусов. Вертикальный угол?',
        'Two lines crossed, one angle is 36 degrees. The vertical angle?',
      ),
      ok: L("O'ttiz olti: vertikal burchaklar teng.", 'Тридцать шесть: вертикальные углы равны.', 'Thirty six: vertical angles are equal.'),
      items: [
        { id: 'a', label: '36°', correct: true },
        { id: 'b', label: '144°', tag: 'Z1', hint: L("Bu qo'shni burchak.", 'Это смежный угол.', 'That is the adjacent angle.') },
        { id: 'c', label: '54°', tag: 'Z6', hint: L("To'qsonga to'ldirish boshqa masala.", 'Дополнение до девяноста это другая задача.', 'Filling up to ninety is another problem.') },
        { id: 'd', label: '72°', tag: 'Z1', hint: L("Ikki barobar qilish kerak emas: burchaklar teng.", 'Удваивать не нужно: углы равны.', 'No doubling: the angles are equal.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "To'g'ri burchakli uchburchakda bir o'tkir burchak 41 daraja. Ikkinchisi?",
        'В прямоугольном треугольнике один острый угол 41 градус. Второй?',
        'In a right triangle one acute angle is 41 degrees. The second?',
      ),
      ok: L("Qirq to'qqiz: o'tkir burchaklar birga to'qson.", 'Сорок девять: острые углы вместе девяносто.', 'Forty nine: the acute angles make ninety.'),
      items: [
        { id: 'a', label: '49°', correct: true },
        { id: 'b', label: '139°', tag: 'Z1', hint: L("Bir yuz sakson dan emas, to'qson dan ayiriladi.", 'Вычитают не из ста восьмидесяти, а из девяноста.', 'Subtract from ninety, not one hundred eighty.') },
        { id: 'c', label: '59°', tag: 'Z6', hint: L("To'qson dan qirq bir ayirilsa qirq to'qqiz.", 'Девяносто минус сорок один это сорок девять.', 'Ninety minus forty one is forty nine.') },
        { id: 'd', label: '41°', tag: 'Z4', hint: L("Teng bo'lishi katetlar teng bo'lganda.", 'Равны они при равных катетах.', 'They are equal when the legs are.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Kesuvchi parallel chiziqlarni kesdi. Bir tomonli burchaklardan biri 105 daraja. Ikkinchisi?",
        'Секущая пересекла параллельные. Один из односторонних углов 105 градусов. Второй?',
        'A transversal crossed parallel lines. One co-interior angle is 105 degrees. The other?',
      ),
      ok: L("Yetmish besh: yig'indisi bir yuz sakson.", 'Семьдесят пять: сумма сто восемьдесят.', 'Seventy five: they sum to one hundred eighty.'),
      items: [
        { id: 'a', label: '75°', correct: true },
        { id: 'b', label: '105°', tag: 'Z5', hint: L("Teng bo'lishi mos va almashinuvchi burchaklarda.", 'Равны соответственные и накрест лежащие.', 'The equal ones are corresponding and alternate.') },
        { id: 'c', label: '85°', tag: 'Z6', hint: L("Bir yuz sakson dan bir yuz besh ayirilsa yetmish besh.", 'Сто восемьдесят минус сто пять это семьдесят пять.', 'One hundred eighty minus one hundred five is seventy five.') },
        { id: 'd', label: '255°', tag: 'Z5', hint: L("Yig'indi 180 daraja.", 'Сумма 180 градусов.', 'The sum is 180 degrees.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda tomonlar 6, 10 va 8. Eng katta burchak qaysi tomon qarshisida?",
        'В треугольнике стороны 6, 10 и 8. Против какой стороны самый большой угол?',
        'A triangle has sides 6, 10 and 8. Which side does the largest angle face?',
      ),
      ok: L("O'n qarshisida: eng uzun tomon.", 'Против десяти: самой длинной стороны.', 'Opposite ten: the longest side.'),
      items: [
        { id: 'a', label: '10', correct: true },
        { id: 'b', label: '6', tag: 'Z4', hint: L("Olti eng qisqa: uning qarshisida eng kichik burchak.", 'Шесть самая короткая: против неё самый малый угол.', 'Six is the shortest: the smallest angle faces it.') },
        { id: 'c', label: '8', tag: 'Z4', hint: L("Sakkiz o'rtada turadi.", 'Восемь в середине.', 'Eight is in the middle.') },
        { id: 'd', tag: 'Z4', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'), hint: L("Bilish mumkin: tomonlarni solishtirish yetarli.", 'Можно: достаточно сравнить стороны.', 'It can: comparing the sides is enough.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol, va har biri boshqa darsdan.", 'Четыре вопроса, и каждый из другого урока.', 'Four questions, each from a different lesson.'),
    A('1', "Ikkinchisi to'g'ri burchakli uchburchak haqida.", 'Второй про прямоугольный треугольник.', 'The second is about a right triangle.'),
    A('2', "Uchinchisi parallel chiziqlar haqida.", 'Третий про параллельные прямые.', 'The third is about parallel lines.'),
    A('3', "Oxirgisi nisbat haqida.", 'Последний про соотношение.', 'The last is about the relation.'),
  ],
}

// ============================================================
// 10. MASHQ 2. XUKNING TO'LIQ ZANJIRI.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Zanjirni oxirigacha', 'Цепочка до конца', 'The chain to its end'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Teng yonli uchburchakning uchdagi burchagi 80 daraja, asosi davom ettirilgan. Asosdagi burchakni va uning qo'shnisini yozing.",
    'Угол при вершине равнобедренного треугольника 80 градусов, основание продлено. Запиши угол при основании и смежный с ним.',
    'The apex angle of an isosceles triangle is 80 degrees and the base is extended. Write the base angle and the one adjacent to it.',
  ),
  template: ['(180° − 80°) : 2 = ', { slot: 0 }, ',   180° − 50° = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '50°' },
    { id: 'b', label: '130°' },
    { id: 'c', label: '100°' },
    { id: 'd', label: '80°' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Asosdagi burchakni va uning qo'shnisini yozing.",
    'Запиши угол при основании и смежный с ним.',
    'Write the base angle and the adjacent one.',
  ),
  checkNote: L(
    "Uch fakt ketma-ket ishladi: yig'indi 180, asosdagi burchaklar tengligi, va qo'shni burchaklar yig'indisi 180. Xukdagi javob shu zanjirdan chiqdi.",
    'Три факта сработали подряд: сумма 180, равенство углов при основании и сумма смежных 180. Ответ из хука вышел из этой цепочки.',
    'Three facts fired in a row: the sum 180, the equal base angles, and adjacent angles making 180. The hook answer came out of that chain.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z2', hint: L("Yuz bu ikki asos burchagining yig'indisi.", 'Сто это сумма двух углов при основании.', 'One hundred is the sum of the two base angles.') },
    { key: 'd', tag: 'Z2', hint: L("Sakson bu uchdagi burchak.", 'Восемьдесят это угол при вершине.', 'Eighty is the apex angle.') },
    { key: '*', tag: 'Z1', hint: L("Birinchi bo'shliq uchburchak ichida, ikkinchisi tashqarida.", 'Первый пропуск внутри треугольника, второй снаружи.', 'The first gap is inside the triangle, the second outside.') },
  ],
  probe: {
    question: L("Qo'shni burchak uchburchakning qolgan ikki burchagi yig'indisiga tengmi?", 'Равен ли смежный угол сумме двух остальных углов треугольника?', 'Does the adjacent angle equal the sum of the other two angles?'),
    items: [
      { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
      { id: 'b', tag: 'Z1', label: L("yo'q", 'нет', 'no'), hint: L("Sakson qo'shuv ellik bir yuz o'ttiz beradi, qo'shni burchak esa aynan shu.", 'Восемьдесят плюс пятьдесят это сто тридцать, а смежный именно такой.', 'Eighty plus fifty is one hundred thirty, exactly the adjacent angle.') },
      { id: 'c', tag: 'Z1', label: L('faqat teng yonlida', 'только в равнобедренном', 'only in an isosceles one'), hint: L("Bu har qanday uchburchakda shunday: ikkovi ham 180 dan chiqadi.", 'Так в любом треугольнике: и то и другое идёт от 180.', 'It holds in any triangle: both come from the 180.') },
      { id: 'd', tag: 'Z6', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'), hint: L("Sonlarni qo'shib solishtirish yetarli.", 'Достаточно сложить и сравнить числа.', 'Adding and comparing the numbers is enough.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam, va ikkovi xukdagi savolga olib boradi.", 'Два шага, и оба ведут к вопросу из хука.', 'Two steps, and both lead to the hook question.'),
    A('two', "Endi asosni davom ettiramiz.", 'Теперь продлеваем основание.', 'Now we extend the base.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Uchdagi burchak', 'Угол при вершине', 'The apex angle'),
  given: L(
    "Teng yonli uchburchakning asosidagi burchagi 65 daraja. Uchdagi burchak nechcha daraja?",
    'Угол при основании равнобедренного треугольника 65 градусов. Сколько градусов угол при вершине?',
    'A base angle of an isosceles triangle is 65 degrees. How big is the apex angle?',
  ),
  template: ['180° − 65° − 65° = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '50°' },
    { id: 'b', label: '115°' },
    { id: 'c', label: '65°' },
    { id: 'd', label: '55°' },
  ],
  answer: ['a'],
  prompt: L(
    "Uchdagi burchakni hisoblang.",
    'Посчитай угол при вершине.',
    'Work out the apex angle.',
  ),
  checkNote: L(
    "Asosdagi burchaklar teng, ya'ni ikkovi ham 65. Bir yuz sakson dan bir yuz o'ttiz ayirilsa ellik qoladi.",
    'Углы при основании равны, то есть оба по 65. Сто восемьдесят минус сто тридцать это пятьдесят.',
    'The base angles are equal, so both are 65. One hundred eighty minus one hundred thirty is fifty.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Faqat bitta asos burchagini ayirdingiz, ikkitasi bor.", 'Ты вычел только один угол при основании, а их два.', 'You took away only one base angle, and there are two.') },
    { key: 'c', tag: 'Z2', hint: L("Oltmish besh asosdagi burchak.", 'Шестьдесят пять это угол при основании.', 'Sixty five is the base angle.') },
    { key: 'd', tag: 'Z6', hint: L("Ayirmani qaytadan hisoblang: oltmish besh ikki marta.", 'Посчитай разность заново: шестьдесят пять дважды.', 'Recompute: sixty five twice.') },
  ],
  audio: [
    A('mount', "Bu safar yordam yo'q. Asosdagi burchak ikkita ekanini yodda tuting.", 'На этот раз без помощи. Помни, что углов при основании два.', 'No help this time. Remember there are two base angles.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). QO'SHNI BURCHAK YIG'INDI O'RNIGA ISHLATILGAN.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Uchinchi burchak to'g'ri hisoblangan. Shunday bo'lsa ham, qaysi qator xato?",
    'Третий угол посчитан верно. И всё же какая строка ошибочна?',
    'The third angle is computed right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('uchburchakda burchaklar 70° va 60°', 'в треугольнике углы 70° и 60°', 'a triangle has angles 70° and 60°') },
    { id: 'r2', text: '180° − 70° − 60° = 50°' },
    { id: 'r3', text: L('uchinchi burchak 110°', 'третий угол 110°', 'the third angle is 110°') },
    { id: 'r4', text: L('110°', '110°', '110°') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu berilgan burchaklar.", 'Это данные углы.', 'Those are the given angles.'),
    r2: L("To'g'ri: uchinchi burchak aynan shunday topiladi.", 'Верно: третий угол находится именно так.', 'Right: that is how the third angle is found.'),
    r4: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r4: 'Z1' },
  proofFill: {
    template: ['110°  ', { slot: 0 }, ',   50°  ', { slot: 1 }],
    // IKKI BIR XIL YOZUV BO'LMASIN: ilgari 'c' va 'b' bir xil matn bilan
    // turgan edi, ya'ni o'quvchi ko'zga bir xil ko'rinadigan variantni
    // tanlab «xato» olardi. Har variant o'z matni bilan.
    parts: [
      { id: 'a', label: L("qo'shni burchak", 'смежный угол', 'the adjacent angle') },
      { id: 'b', label: L('uchinchi burchak', 'третий угол', 'the third angle') },
      { id: 'c', label: L("uchburchakning yig'indisi", 'сумма углов треугольника', 'the sum of the triangle') },
      { id: 'd', label: L('ikkinchi berilgan burchak', 'второй данный угол', 'the second given angle') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Ikki sonni nomlang: qaysi biri qo'shni, qaysi biri uchinchi burchak.",
      'Назови два числа: какое смежный угол, а какое третий.',
      'Name the two numbers: which is the adjacent angle and which the third.',
    ),
    checkNote: L(
      "Bir yuz o'n bitta burchakning qo'shnisi, uchinchi burchak esa 50. Ikki hisob ham to'g'ri edi, lekin javobga NOTO'G'RISI yozilgan: uchburchakda uchta burchak bor, va ikkitasi olib tashlanishi kerak, bittasi emas.",
      'Сто десять это смежный с одним углом, а третий угол это 50. Оба счёта были верны, но в ответ попал НЕ ТОТ: в треугольнике три угла, и вычитать нужно два, а не один.',
      'One hundred ten is adjacent to one angle, and the third angle is 50. Both computations were right, but the WRONG one went into the answer: a triangle has three angles, so two must be taken away, not one.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z1', hint: L("Yig'indi 180 ga teng, bu ikki son esa undan kichik.", 'Сумма равна 180, а эти два числа меньше.', 'The sum is 180, and these two numbers are smaller.') },
      { key: 'd', tag: 'Z1', hint: L("Berilgan burchaklar 70 va 60 edi, bu ikki son esa hisobdan chiqqan.", 'Данные углы были 70 и 60, а эти два числа получены счётом.', 'The given angles were 70 and 60; these two numbers came from computing.') },
      { key: '*', tag: 'Z1', hint: L("Bittasini ayirish qo'shni burchakni beradi, ikkitasini ayirish uchinchi burchakni.", 'Вычесть один даёт смежный угол, вычесть два третий.', 'Taking one away gives the adjacent angle, taking two gives the third.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda uchinchi burchak to'g'ri hisoblangan.", 'В этой ловушке третий угол посчитан верно.', 'In this trap the third angle is computed right.'),
    A('mount', "Lekin javobga qaysi biri yozilganiga qarang.", 'Но посмотри, какой из них попал в ответ.', 'But look at which of them went into the answer.'),
    A('proof', "Topdingiz. Bittasini ayirish qo'shni burchakni beradi.", 'Нашёл. Вычесть один даёт смежный угол.', 'You found it. Taking one away gives the adjacent angle.'),
    A('done', "Uchburchakda uchta burchak bor, shuning uchun ikkitasi ayiriladi.", 'В треугольнике три угла, поэтому вычитают два.', 'A triangle has three angles, so two are taken away.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TOM FERMASI.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Tom fermasi', 'Ферма крыши', 'A roof truss'),
  given: L(
    "Tom fermasi teng yonli uchburchak: uchida burchak 90 daraja. Nishab yer bilan qanday burchak hosil qiladi?",
    'Ферма крыши это равнобедренный треугольник: угол при вершине 90 градусов. Какой угол скат образует с землёй?',
    'A roof truss is an isosceles triangle with a 90 degree apex angle. What angle does a slope make with the ground?',
  ),
  template: ['(180° − 90°) : 2 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '45°' },
    { id: 'b', label: '90°' },
    { id: 'c', label: '30°' },
    { id: 'd', label: '135°' },
  ],
  answer: ['a'],
  prompt: L(
    "Nishab burchagini hisoblang.",
    'Посчитай угол ската.',
    'Work out the slope angle.',
  ),
  checkNote: L(
    "Ferma teng yonli, demak ikki nishab burchagi teng. Uchdagi 90 daraja ayirilgach 90 qoladi, va u ikkiga teng bo'linadi: har biri 45 daraja. Duradgor transportirsiz ham biladi: ikki yog'och teng bo'lsa, nishablar ham teng.",
    'Ферма равнобедренная, значит углы двух скатов равны. После вычитания 90 при вершине остаётся 90, и делится пополам: по 45 градусов. Плотник знает это и без транспортира: если две балки равны, то и скаты равны.',
    'The truss is isosceles, so the two slope angles are equal. After the 90 at the apex, 90 remains and splits in half: 45 each. A carpenter knows it without a protractor: equal beams, equal slopes.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("To'qson uchdagi burchak.", 'Девяносто это угол при вершине.', 'Ninety is the apex angle.') },
    { key: 'c', tag: 'Z6', hint: L("To'qson ikkiga bo'linadi, uchga emas.", 'Девяносто делят на два, а не на три.', 'Ninety is halved, not divided by three.') },
    { key: 'd', tag: 'Z1', hint: L("Bir yuz o'ttiz besh qo'shni burchak bo'lardi.", 'Сто тридцать пять был бы смежный угол.', 'One hundred thirty five would be the adjacent angle.') },
  ],
  audio: [
    A('mount', "Tom fermasi ham teng yonli uchburchak.", 'Ферма крыши это тоже равнобедренный треугольник.', 'A roof truss is an isosceles triangle too.'),
    A('mount', "Uchdagi burchak to'g'ri, nishablar esa teng.", 'Угол при вершине прямой, а скаты равны.', 'The apex angle is right and the slopes are equal.'),
  ],
}

// ============================================================
// 14. BLITS. KURSNING OXIRGI BAHOLANADIGAN EKRANI.
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
        "Ikki burchak 45 va 55 daraja. Uchinchisi?",
        'Два угла 45 и 55 градусов. Третий?',
        'Two angles are 45 and 55 degrees. The third?',
      ),
      ok: L("Sakson: bir yuz sakson dan yuz ayirildi.", 'Восемьдесят: из ста восьмидесяти вычли сто.', 'Eighty: one hundred taken from one hundred eighty.'),
      items: [
        { id: 'a', label: '80°', correct: true },
        { id: 'b', label: '100°', tag: 'Z1', hint: L("Yuz bu ikkitasining yig'indisi.", 'Сто это сумма двух данных.', 'One hundred is the sum of the two given.') },
        { id: 'c', label: '135°', tag: 'Z1', hint: L("Bu bitta burchakning qo'shnisi.", 'Это смежный с одним углом.', 'That is adjacent to one angle.') },
        { id: 'd', label: '90°', tag: 'Z6', hint: L("Qirq besh qo'shuv ellik besh yuz bo'ladi.", 'Сорок пять плюс пятьдесят пять это сто.', 'Forty five plus fifty five is one hundred.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qaysi tasdiq SHARTSIZ, ya'ni har qanday uchburchakda ishlaydi?",
        'Какое утверждение БЕЗУСЛОВНО, то есть работает в любом треугольнике?',
        'Which statement is UNCONDITIONAL, holding in every triangle?',
      ),
      ok: L("Burchaklar yig'indisi 180 daraja.", 'Сумма углов равна 180 градусам.', 'The angles add to 180 degrees.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L("yig'indi 180", 'сумма 180', 'the sum is 180'),
        },
        {
          id: 'b',
          tag: 'Z3',
          label: L('asosdagi burchaklar teng', 'углы при основании равны', 'the base angles are equal'),
          hint: L("Bu teng tomonlar bo'lganda ishlaydi: shartli tasdiq.", 'Это работает при равных сторонах: условное утверждение.', 'That needs equal sides: a conditional statement.'),
        },
        {
          id: 'c',
          tag: 'Z3',
          label: L('mos burchaklar teng', 'соответственные углы равны', 'corresponding angles are equal'),
          hint: L("Bu chiziqlar parallel bo'lganda ishlaydi.", 'Это работает при параллельных прямых.', 'That needs the lines to be parallel.'),
        },
        {
          id: 'd',
          tag: 'Z3',
          label: L("o'tkir burchaklar 90 beradi", 'острые углы дают 90', 'the acute angles make 90'),
          hint: L("Bu to'g'ri burchakli uchburchakda ishlaydi.", 'Это работает в прямоугольном треугольнике.', 'That needs a right triangle.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Teng yonli uchburchakda asosdagi burchak 70 daraja. Uchdagisi?",
        'В равнобедренном треугольнике угол при основании 70 градусов. При вершине?',
        'A base angle of an isosceles triangle is 70 degrees. The apex?',
      ),
      ok: L("Qirq: ikki yetmish yuz qirq beradi.", 'Сорок: две семидесятки дают сто сорок.', 'Forty: two seventies make one hundred forty.'),
      items: [
        { id: 'a', label: '40°', correct: true },
        { id: 'b', label: '110°', tag: 'Z2', hint: L("Faqat bittasini ayirdingiz, asos burchagi ikkita.", 'Ты вычел только один, а углов при основании два.', 'You took away only one, and there are two base angles.') },
        { id: 'c', label: '70°', tag: 'Z2', hint: L("Yetmish asosdagi burchak.", 'Семьдесят это угол при основании.', 'Seventy is the base angle.') },
        { id: 'd', label: '20°', tag: 'Z6', hint: L("Bir yuz sakson dan yuz qirq ayirilsa qirq.", 'Сто восемьдесят минус сто сорок это сорок.', 'One hundred eighty minus one hundred forty is forty.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda burchaklar 30, 70 va 80. Eng qisqa tomon qaysi burchak qarshisida?",
        'Углы 30, 70 и 80. Против какого угла самая короткая сторона?',
        'The angles are 30, 70 and 80. Which angle does the shortest side face?',
      ),
      ok: L("O'ttiz daraja qarshisida.", 'Против тридцати градусов.', 'Opposite thirty degrees.'),
      items: [
        { id: 'a', label: '30°', correct: true },
        { id: 'b', label: '80°', tag: 'Z4', hint: L("Sakson eng katta: uning qarshisida eng uzun tomon.", 'Восемьдесят самый большой: против него самая длинная.', 'Eighty is the largest: the longest side faces it.') },
        { id: 'c', label: '70°', tag: 'Z4', hint: L("Yetmish o'rtada.", 'Семьдесят в середине.', 'Seventy is in the middle.') },
        { id: 'd', tag: 'Z4', label: L('uchtasi teng', 'все три равны', 'all three are equal'), hint: L("Burchaklar har xil, demak tomonlar ham har xil.", 'Углы разные, значит и стороны разные.', 'The angles differ, so the sides differ.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Kursning oxirgi baholanadigan ekrani.", 'Блиц, четыре вопроса. Последний оцениваемый экран курса.', 'Quick round, four questions. The last graded screen of the course.'),
    A('1', "Ikkinchisi shartli va shartsiz farqi haqida.", 'Второй про разницу условного и безусловного.', 'The second is about conditional versus unconditional.'),
    A('2', "Uchinchisida asos burchagi ikkita.", 'В третьем углов при основании два.', 'In the third there are two base angles.'),
    A('3', "Oxirgisi nisbat haqida.", 'Последний про соотношение.', 'The last is about the relation.'),
  ],
}

// ============================================================
// 15. YAKUN. BLOK VA KURS YOPILADI.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('B7 bloki va kurs yopildi', 'Блок Б7 и курс завершены', 'Block B7 and the course are done'),
  gate: S1.gate,
  fix: {
    tokens: ['130°'],
    value: '130',
    sign: '=',
    hint: L('Pastki tabloni bosing', 'Нажми на нижнее табло', 'Tap the lower board'),
  },
  fixSay: L(
    "Zanjir uch qadamdan iborat edi. Bir yuz sakson dan sakson ayirildi, qolgani ikkiga bo'linib ellik chiqdi, va bir yuz sakson dan ellik ayirilib bir yuz o'ttiz chiqdi.",
    'Цепочка была из трёх шагов. Из ста восьмидесяти вычли восемьдесят, остаток разделили на два и получили пятьдесят, а из ста восьмидесяти вычли пятьдесят и получили сто тридцать.',
    'The chain had three steps. Eighty from one hundred eighty, the remainder halved to fifty, and fifty from one hundred eighty gives one hundred thirty.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    ext: L('130 daraja', '130 градусов', '130 degrees'),
    base: L('50 daraja', '50 градусов', '50 degrees'),
    hundred: L('100 daraja', '100 градусов', '100 degrees'),
    cant: L('bilib bo\'lmaydi', 'узнать нельзя', 'cannot be known'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['180', '59 = 59', '90 : 2 = 45', '180 − 50 = 130'],
  twoLabel: L('Ikki xil tasdiq', 'Два вида утверждений', 'Two kinds of statements'),
  twoA: L(
    "shartsiz  →  yig'indi 180",
    'безусловное  →  сумма 180',
    'unconditional  →  the sum is 180',
  ),
  twoB: L(
    'shartli  →  teng tomonlar bo\'lsa',
    'условное  →  если стороны равны',
    'conditional  →  if the sides are equal',
  ),
  nextLabel: L('Keyingi yil', 'В следующем году', 'Next year'),
  nextTopic: L(
    "8-sinf: gipotenuza uzunligi va kvadrat ildiz",
    '8 класс: длина гипотенузы и квадратный корень',
    'grade 8: the length of the hypotenuse and square roots',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Blokda ikki xil tasdiq bor edi: shartsiz va shartli. Masalani shartni tekshirishdan boshlash kerak.", 'В блоке было два вида утверждений: безусловные и условные. Решение начинают с проверки условия.', 'The block had two kinds of statements: unconditional and conditional. Start solving by checking the condition.'),
    A('mount', "Yettinchi sinf kursi shu bilan tugadi. Keyingi yil gipotenuza uzunligini hisoblashni o'rganasiz.", 'На этом курс седьмого класса закончен. В следующем году научишься считать длину гипотенузы.', 'That closes the grade seven course. Next year you will learn to compute the hypotenuse.'),
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
