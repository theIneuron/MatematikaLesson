// ============================================================================
// 7-sinf, Dars 41. UCHBURCHAK VA UNING TURLARI.
// (Треугольник и виды треугольников)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// DARSNING O'ZAGI: IKKI MUSTAQIL BO'LINISH. Uchburchak turi TOMONLAR
// bo'yicha ham, BURCHAKLAR bo'yicha ham ataladi, va bu ikki nom bir-birini
// almashtirmaydi: bir uchburchak ayni vaqtda teng yonli VA to'g'ri burchakli
// bo'lishi mumkin. Xuk aynan shu tuzoqqa qo'yilgan.
//
// «O'LCHOV ISBOT EMAS» TALABI BU DARSDA HAM YO'Q (etalon B7 izohi: u § 9 dan
// boshlanadi). 40 va 41-darslarda o'lchash temaning o'zi, shuning uchun
// `guess` yorlig'i qo'yilmaydi. 42-darsdan chiqadi.
//
// CHEGARAVIY HOLAT -- AYNIQSA MUHIM: 2, 3 va 5 tomonlari bilan uchburchak
// yo'q, chunki ikki tomon yig'indisi uchinchisidan katta bo'lishi kerak.
// Chizmada u ko'rinadi: nuqtalar bir chiziqqa tushadi va burchaklar 0, 180,
// 0 chiqadi. Asbob buni haqiqatda hisoblaydi, matn emas.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_41'
const LESSON_TITLE = L('Uchburchak va uning turlari', 'Треугольник и виды треугольников', 'The triangle and its kinds')
const LESSON_NO = L('41-dars', 'Урок 41', 'Lesson 41')
const BLOCK = { label: L('B7-blok', 'Блок Б7', 'Block B7'), from: 40, to: 48, current: 41 }

const TAGS = {
  Z1: L('tomonlar bo\'yicha tur', 'вид по сторонам', 'the kind by sides'),
  Z2: L('burchaklar bo\'yicha tur', 'вид по углам', 'the kind by angles'),
  Z3: L('ikki bo\'linish aralashtirildi', 'две классификации смешаны', 'the two classifications got mixed'),
  Z4: L('uchburchak mavjudligi', 'существование треугольника', 'whether the triangle exists'),
  Z5: L('teng tomonlar va teng burchaklar', 'равные стороны и равные углы', 'equal sides and equal angles'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Bitta uchburchakka nechta nom to'g'ri keladi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('UCHBURCHAK TURLARI', 'ВИДЫ ТРЕУГОЛЬНИКОВ', 'KINDS OF TRIANGLES'),
  noBack: true,
  noNotes: true,
  title: L('Nechta nom to\'g\'ri keladi', 'Сколько названий подходит', 'How many names fit'),
  gate: {
    source: { kind: 'plain', tokens: ['90°', '45°', '45°'] },
    rows: [
      { tokens: ['bitta'], value: '1' },
      { tokens: ['ikkita'], value: '2' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Uchburchakning burchaklari 90, 45 va 45 daraja. Unga nechta nom to'g'ri keladi: bittasi yoki ikkitasi?",
      'Углы треугольника 90, 45 и 45 градусов. Сколько названий ему подходит: одно или два?',
      'A triangle has angles of 90, 45 and 45 degrees. How many names fit it: one or two?',
    ),
    items: [
      {
        id: 'two',
        label: L('ikkita nom', 'два названия', 'two names'),
        hint: L(
          "Taxminingiz qabul qilindi. Chizmada tekshiramiz.",
          'Прогноз принят. Проверим на чертеже.',
          'Your prediction is taken. We will check it on the drawing.',
        ),
      },
      {
        id: 'right',
        label: L("faqat to'g'ri burchakli", 'только прямоугольный', 'right-angled only'),
        hint: L(
          "To'g'ri burchak bor, bu haqiqat. Lekin tomonlar haqida hech narsa aytilmadi.",
          'Прямой угол есть, это верно. Но про стороны ничего не сказано.',
          'There is a right angle, true. But nothing was said about the sides.',
        ),
      },
      {
        id: 'iso',
        label: L('faqat teng yonli', 'только равнобедренный', 'isosceles only'),
        hint: L(
          "Ikki burchak teng, bu haqiqat. Lekin 90 daraja ham bekorga turmagan.",
          'Два угла равны, это верно. Но 90 градусов тоже стоят не зря.',
          'Two angles are equal, true. But the 90 degrees are there for a reason.',
        ),
      },
      {
        id: 'none',
        label: L('bunday uchburchak yo\'q', 'такого треугольника нет', 'no such triangle exists'),
        hint: L(
          "Bor: to'qson qo'shuv qirq besh qo'shuv qirq besh bir yuz sakson beradi.",
          'Есть: девяносто плюс сорок пять плюс сорок пять дают сто восемьдесят.',
          'It exists: ninety plus forty five plus forty five gives one hundred eighty.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Uchburchakning uch burchagi berilgan: to'qson, qirq besh va qirq besh.", 'Даны три угла треугольника: девяносто, сорок пять и сорок пять.', 'Three angles are given: ninety, forty five and forty five.'),
    A('mount', "Savol nomlar haqida. Bunday uchburchakka nechta nom to'g'ri keladi.", 'Вопрос про названия. Сколько названий подходит такому треугольнику.', 'The question is about names. How many names fit such a triangle.'),
  ],
}

// ============================================================
// 2. TAYANCH. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch qisqa savol', 'Три коротких вопроса', 'Three short questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Qanday uchburchak teng yonli deb ataladi?",
        'Какой треугольник называют равнобедренным?',
        'Which triangle is called isosceles?',
      ),
      ok: L("Ikki tomoni teng bo'lgan uchburchak.", 'Тот, у которого две стороны равны.', 'The one with two equal sides.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('ikki tomoni teng', 'две стороны равны', 'two sides are equal'),
        },
        {
          id: 'b',
          tag: 'Z1',
          label: L('hamma tomoni teng', 'все стороны равны', 'all sides are equal'),
          hint: L("Hammasi teng bo'lsa, u teng TOMONLI deb ataladi.", 'Если все равны, он называется равноСТОРОННИМ.', 'If all are equal it is called equilateral.'),
        },
        {
          id: 'c',
          tag: 'Z3',
          label: L('bitta burchagi to\'g\'ri', 'один угол прямой', 'one angle is right'),
          hint: L("Bu burchaklar bo'yicha nom, gap esa tomonlar haqida.", 'Это название по углам, а речь о сторонах.', 'That is a name by angles, but this is about sides.'),
        },
        {
          id: 'd',
          tag: 'Z1',
          label: L('hamma tomoni har xil', 'все стороны разные', 'all sides differ'),
          hint: L("Hammasi har xil bo'lsa, u turli tomonli.", 'Если все разные, он разносторонний.', 'If all differ it is scalene.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Burchaklari 60, 60 va 60 daraja. Bu qanday uchburchak?",
        'Углы 60, 60 и 60 градусов. Какой это треугольник?',
        'The angles are 60, 60 and 60 degrees. What triangle is it?',
      ),
      ok: L("Hamma burchagi teng, demak hamma tomoni ham teng: teng tomonli.", 'Все углы равны, значит и все стороны равны: равносторонний.', 'All angles are equal, so all sides are equal: equilateral.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('teng tomonli', 'равносторонний', 'equilateral'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L("to'g'ri burchakli", 'прямоугольный', 'right-angled'),
          hint: L("To'g'ri burchak 90 daraja, bu yerda esa hammasi 60.", 'Прямой угол это 90 градусов, а здесь все по 60.', 'A right angle is 90 degrees, here all are 60.'),
        },
        {
          id: 'c',
          tag: 'Z2',
          label: L("o'tmas burchakli", 'тупоугольный', 'obtuse-angled'),
          hint: L("O'tmas burchak 90 dan katta bo'ladi.", 'Тупой угол больше 90.', 'An obtuse angle is over 90.'),
        },
        {
          id: 'd',
          tag: 'Z4',
          label: L('bunday uchburchak yo\'q', 'такого нет', 'no such triangle'),
          hint: L("Bor: uchta oltmish bir yuz sakson beradi.", 'Есть: три шестидесятки дают сто восемьдесят.', 'It exists: three sixties give one hundred eighty.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda 100 darajali burchak bor. Burchaklar bo'yicha bu qanday uchburchak?",
        'В треугольнике есть угол 100 градусов. Какой это треугольник по углам?',
        'A triangle has a 100 degree angle. What kind is it by angles?',
      ),
      ok: L("Yuz daraja to'g'ri burchakdan katta: o'tmas burchakli.", 'Сто градусов больше прямого: тупоугольный.', 'One hundred degrees is more than a right angle: obtuse.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L("o'tmas burchakli", 'тупоугольный', 'obtuse-angled'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L("o'tkir burchakli", 'остроугольный', 'acute-angled'),
          hint: L("O'tkir burchakli uchburchakda hamma burchak 90 dan kichik.", 'В остроугольном все углы меньше 90.', 'In an acute triangle every angle is under 90.'),
        },
        {
          id: 'c',
          tag: 'Z2',
          label: L("to'g'ri burchakli", 'прямоугольный', 'right-angled'),
          hint: L("To'g'ri burchakli uchburchakda aynan 90 daraja bo'ladi.", 'В прямоугольном есть ровно 90 градусов.', 'A right triangle has exactly 90 degrees.'),
        },
        {
          id: 'd',
          tag: 'Z1',
          label: L('turli tomonli', 'разносторонний', 'scalene'),
          hint: L("Bu tomonlar bo'yicha nom, savol esa burchaklar haqida.", 'Это название по сторонам, а вопрос про углы.', 'That is a name by sides, the question is about angles.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Uch savol: ikkitasi tomonlar haqida, bittasi burchaklar haqida.", 'Три вопроса: два про стороны, один про углы.', 'Three questions: two about sides, one about angles.'),
    A('1', "Ikkinchisida hamma burchak teng.", 'Во втором все углы равны.', 'In the second all angles are equal.'),
    A('2', "Uchinchisida yuz darajali burchak bor.", 'В третьем есть угол сто градусов.', 'The third has a one hundred degree angle.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. TENG YONLI: teng tomonlar teng burchaklar beradi.
// ============================================================
const S3 = {
  kind: 'figure',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Teng tomonlar, teng burchaklar', 'Равные стороны, равные углы', 'Equal sides, equal angles'),
  pts: { A: { x: -3, y: -2 }, B: { x: 3, y: -2 }, C: { x: 0, y: 3 } },
  show: { sides: true, angles: true },
  mark: ['A', 'B'],
  caption: L(
    "Asbob tomonlarni to'r birligida, burchaklarni esa darajada o'lchadi.",
    'Прибор измерил стороны в клетках сетки, а углы в градусах.',
    'The tool measured the sides in grid units and the angles in degrees.',
  ),
  options: [
    { id: 'a', label: L('teng tomonlar qarshisidagi burchaklar teng', 'углы против равных сторон равны', 'the angles opposite equal sides are equal') },
    { id: 'b', label: L('teng burchaklar qarshisida turli tomonlar', 'против равных углов разные стороны', 'different sides lie opposite equal angles') },
    { id: 'c', label: L('hamma burchak teng', 'все углы равны', 'all the angles are equal') },
    { id: 'd', label: L('bu tasodif', 'это случайность', 'it is a coincidence') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Chizmaga qarang: teng burchaklar A va B da, ular esa teng tomonlar qarshisida.", 'Посмотри на чертёж: равные углы при A и B, а они против равных сторон.', 'Look at the drawing: the equal angles are at A and B, opposite the equal sides.') },
    { key: 'c', tag: 'Z1', hint: L("C dagi burchak boshqa: faqat ikkitasi teng.", 'Угол при C другой: равны только два.', 'The angle at C is different: only two are equal.') },
    { key: 'd', tag: 'Z5', hint: L("Bu tasodif emas: uchni ko'chirsangiz ham bog'liqlik saqlanadi.", 'Это не случайность: перенеси вершину и связь сохранится.', 'Not a coincidence: move the vertex and the link stays.') },
  ],
  note: L(
    "Ikki tomoni teng bo'lgan uchburchak TENG YONLI deb ataladi. Uning asosidagi burchaklar ham teng, va bu har doim shunday.",
    'Треугольник с двумя равными сторонами называется РАВНОБЕДРЕННЫМ. Углы при его основании тоже равны, и это всегда так.',
    'A triangle with two equal sides is called ISOSCELES. The angles at its base are equal too, and that is always so.',
  ),
  audio: [
    A('mount', "Chizmada uchburchak turibdi, va asbob uning tomonlarini o'lchadi.", 'На чертеже треугольник, и прибор измерил его стороны.', 'A triangle is on the drawing, and the tool measured its sides.'),
    A('mount', "Ikki tomon bir xil chiqdi. Burchaklarga qarang: nima ko'rinadi.", 'Две стороны вышли одинаковыми. Посмотри на углы: что видно.', 'Two sides came out the same. Look at the angles: what do you see.'),
  ],
}

// ============================================================
// 4. FARQLASH. TURLI TOMONLI: teng tomon yo'q -- teng burchak ham yo'q.
// ============================================================
const S4 = {
  kind: 'figure',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Teng tomon bo\'lmasa', 'Когда равных сторон нет', 'When there are no equal sides'),
  pts: { A: { x: -4, y: -2 }, B: { x: 3, y: -2 }, C: { x: -1, y: 3 } },
  show: { sides: true, angles: true },
  caption: L(
    "Bu uchburchakda teng tomon yo'q. Burchaklarga qarang.",
    'В этом треугольнике равных сторон нет. Посмотри на углы.',
    'This triangle has no equal sides. Look at the angles.',
  ),
  options: [
    { id: 'a', label: L('teng burchak ham yo\'q', 'равных углов тоже нет', 'there are no equal angles either') },
    { id: 'b', label: L('ikki burchak teng', 'два угла равны', 'two angles are equal') },
    { id: 'c', label: L('hamma burchak teng', 'все углы равны', 'all the angles are equal') },
    { id: 'd', label: L('burchaklar bog\'liq emas', 'углы не связаны со сторонами', 'the angles have no link to the sides') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Uchta sonni solishtiring: ular har xil.", 'Сравни три числа: они разные.', 'Compare the three numbers: they differ.') },
    { key: 'c', tag: 'Z5', hint: L("Teng burchaklar teng tomonlardan chiqadi, bu yerda esa tomonlar har xil.", 'Равные углы идут от равных сторон, а тут стороны разные.', 'Equal angles come from equal sides, and here the sides differ.') },
    { key: 'd', tag: 'Z5', hint: L("Bog'liq: katta tomon qarshisida katta burchak yotadi.", 'Связаны: против большей стороны лежит больший угол.', 'They are linked: the larger angle lies opposite the larger side.') },
  ],
  note: L(
    "Hamma tomoni har xil uchburchak TURLI TOMONLI deb ataladi, va unda teng burchak ham yo'q. Bog'liqlik ikki tomonga ishlaydi: teng tomonlar teng burchaklar beradi, teng burchaklar esa teng tomonlarni.",
    'Треугольник, у которого все стороны разные, называется РАЗНОСТОРОННИМ, и равных углов в нём тоже нет. Связь работает в обе стороны: равные стороны дают равные углы, а равные углы дают равные стороны.',
    'A triangle with all sides different is called SCALENE, and it has no equal angles either. The link works both ways: equal sides give equal angles, equal angles give equal sides.',
  ),
  audio: [
    A('mount', "Endi boshqa uchburchak. Tomonlari uchtasi ham har xil.", 'Теперь другой треугольник. Все три стороны разные.', 'Now a different triangle. All three sides differ.'),
    A('mount', "Burchaklar bilan nima bo'ldi.", 'Что стало с углами.', 'What happened to the angles.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Chizmasiz: uchta son turni aytib beradi.
// ============================================================
const S5 = {
  kind: 'sort',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Uchta son bo\'yicha', 'По трём числам', 'By the three numbers'),
  zones: [
    { id: 'z1', label: L('Teng yonli', 'Равнобедренный', 'Isosceles') },
    { id: 'z2', label: L('Turli tomonli', 'Разносторонний', 'Scalene') },
  ],
  cards: [
    { id: 'c1', text: '5, 5, 6', zone: 'z1' },
    { id: 'c2', text: '7, 4, 7', zone: 'z1' },
    { id: 'c3', text: '4, 6, 9', zone: 'z2' },
    { id: 'c4', text: '3, 8, 10', zone: 'z2' },
  ],
  prompt: L(
    "To'rt uchburchakni turi bo'yicha tarqating. Chizma yo'q: faqat tomonlar berilgan.",
    'Раскинь четыре треугольника по видам. Чертежа нет: даны только стороны.',
    'Sort the four triangles by kind. No drawing: only the sides are given.',
  ),
  wrongs: [
    {
      tag: 'Z1',
      hint: L(
        "Uchta sonda ikkitasi bir xil bo'lsa, u teng yonli. Hammasi har xil bo'lsa, turli tomonli.",
        'Если среди трёх чисел два одинаковых, он равнобедренный. Если все разные, разносторонний.',
        'If two of the three numbers match, it is isosceles. If all differ, it is scalene.',
      ),
    },
  ],
  okNote: L(
    "Tomon soni yozib qo'yilgan bo'lsa, chizma kerak emas: tur uchta sondan ko'rinadi.",
    'Если длины сторон записаны, чертёж не нужен: вид виден по трём числам.',
    'When the side lengths are written down no drawing is needed: the kind shows in the three numbers.',
  ),
  audio: [
    A('mount', "Bu safar chizma yo'q, faqat tomonlar yozilgan.", 'На этот раз чертежа нет, записаны только стороны.', 'This time there is no drawing, only the sides are written.'),
    A('mount', "Turni sonlar bo'yicha aniqlang.", 'Определи вид по числам.', 'Work out the kind from the numbers.'),
    A('ok', "Ikki bir xil son teng yonli uchburchakni beradi.", 'Два одинаковых числа дают равнобедренный треугольник.', 'Two equal numbers give an isosceles triangle.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. UCHNI KO'CHIRISH: teng yonli qilib.
// ============================================================
const S6 = {
  kind: 'figure',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Teng yonli qilib qo\'ying', 'Сделай равнобедренным', 'Make it isosceles'),
  pts: { A: { x: -3, y: -2 }, B: { x: 3, y: -2 }, C: { x: 2, y: 3 } },
  move: 'C',
  pick: { x: 0, y: 3 },
  show: { sides: true },
  caption: L(
    "C uchini boshqa tugunga ko'chiring, toki uchburchak teng yonli bo'lsin.",
    'Перенеси вершину C в другой узел так, чтобы треугольник стал равнобедренным.',
    'Move the vertex C to another node so that the triangle becomes isosceles.',
  ),
  options: [
    { id: 'a', label: L('ikki yon tomon teng bo\'ldi', 'две боковые стороны стали равны', 'the two legs became equal') },
    { id: 'b', label: L('hamma tomon teng bo\'ldi', 'все стороны стали равны', 'all the sides became equal') },
    { id: 'c', label: L('asos ham o\'zgardi', 'основание тоже изменилось', 'the base changed too') },
    { id: 'd', label: L('hech nima o\'zgarmadi', 'ничего не изменилось', 'nothing changed') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Asosga qarang: u yon tomonlarga teng emas.", 'Посмотри на основание: оно не равно боковым.', 'Look at the base: it is not equal to the legs.') },
    { key: 'c', tag: 'Z1', hint: L("Asos A va B orasida, ular esa joyidan siljimadi.", 'Основание между A и B, а они не двигались.', 'The base is between A and B, and they did not move.') },
    { key: 'd', tag: 'Z5', hint: L("O'zgardi: ko'chirishdan oldin yon tomonlar har xil edi.", 'Изменилось: до переноса боковые были разными.', 'It changed: before the move the legs were different.') },
  ],
  note: L(
    "Uch asosning o'rtasi ustiga kelganda yon tomonlar teng bo'ladi. Teng yonlilik uchning O'RNIGA bog'liq, tomonlar sonining o'ziga emas.",
    'Когда вершина встаёт над серединой основания, боковые стороны равны. Равнобедренность зависит от МЕСТА вершины, а не от самих чисел.',
    'When the vertex sits above the middle of the base the legs are equal. Being isosceles depends on WHERE the vertex is, not on the numbers themselves.',
  ),
  audio: [
    A('mount', "Endi uchni o'zingiz ko'chirasiz. Tugunni bosing.", 'Теперь вершину переносишь сам. Нажми на узел.', 'Now you move the vertex. Tap a node.'),
    A('mount', "Maqsad: yon tomonlar teng bo'lsin.", 'Цель: боковые стороны должны стать равными.', 'The goal: make the legs equal.'),
    A('move', "Uch ko'chdi va tomonlar qayta o'lchandi.", 'Вершина переехала, и стороны измерены заново.', 'The vertex moved and the sides were measured again.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT. 2, 3 va 5: uchburchak yo'q.
// Asbob buni HAQIQATDA hisoblaydi: nuqtalar bir chiziqda, burchaklar
// nol, bir yuz sakson va nol chiqadi.
// ============================================================
const S7 = {
  kind: 'figure',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Uchburchak yopilmadi', 'Треугольник не замкнулся', 'The triangle did not close'),
  pts: { A: { x: -5, y: -1 }, B: { x: -3, y: -1 }, C: { x: 0, y: -1 } },
  show: { sides: true, angles: true },
  caption: L(
    "Tomonlari 2, 3 va 5 bo'lgan uchburchak yasashga urinib ko'rdik. Chizmaga qarang.",
    'Мы попробовали построить треугольник со сторонами 2, 3 и 5. Посмотри на чертёж.',
    'We tried to build a triangle with sides 2, 3 and 5. Look at the drawing.',
  ),
  options: [
    { id: 'a', label: L("2 + 3 = 5, ya'ni uchburchak yo'q", '2 + 3 = 5, значит треугольника нет', '2 + 3 = 5, so there is no triangle') },
    { id: 'b', label: L("bu juda yassi uchburchak", 'это очень плоский треугольник', 'it is a very flat triangle') },
    { id: 'c', label: L('chizma xato qurilgan', 'чертёж построен неверно', 'the drawing was built wrong') },
    { id: 'd', label: L('tomonlarni almashtirish kerak', 'нужно поменять стороны местами', 'the sides need swapping') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z4', hint: L("Burchaklarga qarang: nol, bir yuz sakson va nol. Bu uchburchak emas, kesma.", 'Посмотри на углы: ноль, сто восемьдесят и ноль. Это не треугольник, а отрезок.', 'Look at the angles: zero, one hundred eighty and zero. That is a segment, not a triangle.') },
    { key: 'c', tag: 'Z4', hint: L("Chizma to'g'ri: ikki qisqa tomon uzunini aynan to'ldirdi.", 'Чертёж верен: две короткие стороны в точности покрыли длинную.', 'The drawing is right: the two short sides covered the long one exactly.') },
    { key: 'd', tag: 'Z4', hint: L("Tartib hech narsani o'zgartirmaydi: yig'indi o'sha-o'sha qoladi.", 'Порядок ничего не меняет: сумма останется той же.', 'The order changes nothing: the sum stays the same.') },
  ],
  note: L(
    "Uchburchak faqat ikki tomonning yig'indisi uchinchisidan KATTA bo'lganda bor. 2 + 3 esa 5 dan katta emas, shuning uchun uchlar bir to'g'ri chiziqda qoldi.",
    'Треугольник существует только тогда, когда сумма двух сторон БОЛЬШЕ третьей. А 2 + 3 не больше 5, поэтому вершины остались на одной прямой.',
    'A triangle exists only when the sum of two sides is GREATER than the third. But 2 + 3 is not greater than 5, so the vertices stayed on one line.',
  ),
  audio: [
    A('mount', "Uchburchak har qanday uch sondan chiqmaydi.", 'Треугольник получается не из любых трёх чисел.', 'A triangle does not come from any three numbers.'),
    A('mount', "Ikki, uch va besh oldik. Chizmada nima bo'ldi.", 'Взяли два, три и пять. Что вышло на чертеже.', 'We took two, three and five. What came out on the drawing.'),
  ],
}

// ============================================================
// 8. QOIDA. IKKI BO'LINISH.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z3',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('tomonlar bo\'yicha uch tur bor', 'по сторонам есть три вида', 'by sides there are three kinds') },
    { id: 'f2', label: L('teng yonli, teng tomonli, turli tomonli', 'равнобедренный, равносторонний, разносторонний', 'isosceles, equilateral, scalene') },
    { id: 'f3', label: L('burchaklar bo\'yicha ham uch tur bor', 'по углам тоже есть три вида', 'by angles there are three kinds too') },
    { id: 'f4', label: L("o'tkir, to'g'ri va o'tmas burchakli", 'остроугольный, прямоугольный, тупоугольный', 'acute, right-angled, obtuse') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval tomonlar bo'yicha bo'linish va uning nomlari, keyin burchaklar bo'yicha.",
    'Порядок нарушен. Сначала деление по сторонам и его названия, потом по углам.',
    'The order is off. First the split by sides and its names, then by angles.',
  ),
  lawChips: [
    { label: '=', tone: 's2' },
    { label: '90°', tone: 's1' },
    { label: '<', tone: 'off' },
    { label: '>', tone: 'par' },
  ],
  lawSweep: L(
    'tenglik, to\'g\'ri burchak, kichik, katta',
    'равенство, прямой угол, меньше, больше',
    'equality, the right angle, less, greater',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "TOMONLAR bo'yicha: ikkitasi teng bo'lsa teng yonli, uchtasi teng bo'lsa teng tomonli, hammasi har xil bo'lsa turli tomonli.",
        'По СТОРОНАМ: две равны это равнобедренный, три равны это равносторонний, все разные это разносторонний.',
        'By SIDES: two equal is isosceles, three equal is equilateral, all different is scalene.',
      ),
      L(
        "BURCHAKLAR bo'yicha: hammasi 90 dan kichik bo'lsa o'tkir burchakli, bittasi 90 bo'lsa to'g'ri burchakli, bittasi 90 dan katta bo'lsa o'tmas burchakli. Ikki bo'linish MUSTAQIL: bir uchburchakka ikkitadan nom to'g'ri keladi.",
        'По УГЛАМ: все меньше 90 это остроугольный, один равен 90 это прямоугольный, один больше 90 это тупоугольный. Две классификации НЕЗАВИСИМЫ: одному треугольнику подходят два названия.',
        'By ANGLES: all under 90 is acute, one equal to 90 is right-angled, one over 90 is obtuse. The two classifications are INDEPENDENT: one triangle fits two names.',
      ),
    ],
  },
  hookCap: L(
    "Ikki nom  --  tomon va burchak",
    'Два названия — сторона и угол',
    'Two names — the side and the angle',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("tomonlar  --  tenglik", 'стороны это равенство', 'sides mean equality'),
    L("burchaklar  --  90 bilan solishtirish", 'углы это сравнение с 90', 'angles mean comparing with 90'),
    L("ikki nom bir vaqtda", 'два названия сразу', 'two names at once'),
  ],
  audio: [
    A('mount', "Ikki bo'linishni ko'rdik: tomonlar bo'yicha va burchaklar bo'yicha.", 'Мы увидели два деления: по сторонам и по углам.', 'We saw two splits: by sides and by angles.'),
    A('ok', "To'g'ri. Endi bir uchburchakka ikkitadan nom qo'yasiz.", 'Верно. Теперь одному треугольнику ты даёшь два названия.', 'Correct. Now you give one triangle two names.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Turini aniqlang', 'Определи вид', 'Name the kind'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Tomonlari 8, 8 va 8. Tomonlar bo'yicha turi qanday?",
        'Стороны 8, 8 и 8. Какой вид по сторонам?',
        'The sides are 8, 8 and 8. What kind by sides?',
      ),
      ok: L("Uchtasi ham teng: teng tomonli.", 'Все три равны: равносторонний.', 'All three are equal: equilateral.'),
      items: [
        { id: 'a', correct: true, label: L('teng tomonli', 'равносторонний', 'equilateral') },
        { id: 'b', tag: 'Z1', label: L('turli tomonli', 'разносторонний', 'scalene'), hint: L("Turli tomonlida hamma son har xil bo'ladi.", 'В разностороннем все числа разные.', 'In a scalene triangle all numbers differ.') },
        { id: 'c', tag: 'Z2', label: L("to'g'ri burchakli", 'прямоугольный', 'right-angled'), hint: L("Bu burchaklar bo'yicha nom, savol esa tomonlar haqida.", 'Это название по углам, а вопрос про стороны.', 'That is a name by angles, the question is about sides.') },
        { id: 'd', tag: 'Z4', label: L('bunday uchburchak yo\'q', 'такого нет', 'no such triangle'), hint: L("Bor: sakkiz qo'shuv sakkiz sakkizdan katta.", 'Есть: восемь плюс восемь больше восьми.', 'It exists: eight plus eight is more than eight.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Burchaklari 30, 60 va 90. Burchaklar bo'yicha turi qanday?",
        'Углы 30, 60 и 90. Какой вид по углам?',
        'The angles are 30, 60 and 90. What kind by angles?',
      ),
      ok: L("To'qson daraja bor: to'g'ri burchakli.", 'Есть девяносто градусов: прямоугольный.', 'There is a ninety degree angle: right-angled.'),
      items: [
        { id: 'a', correct: true, label: L("to'g'ri burchakli", 'прямоугольный', 'right-angled') },
        { id: 'b', tag: 'Z2', label: L("o'tkir burchakli", 'остроугольный', 'acute-angled'), hint: L("O'tkir burchaklida hamma burchak 90 dan kichik.", 'В остроугольном все углы меньше 90.', 'In an acute triangle every angle is under 90.') },
        { id: 'c', tag: 'Z2', label: L("o'tmas burchakli", 'тупоугольный', 'obtuse-angled'), hint: L("O'tmas burchak 90 dan katta bo'lishi kerak.", 'Тупой угол должен быть больше 90.', 'An obtuse angle must be over 90.') },
        { id: 'd', tag: 'Z1', label: L('teng yonli', 'равнобедренный', 'isosceles'), hint: L("Bu tomonlar bo'yicha nom.", 'Это название по сторонам.', 'That is a name by sides.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Tomonlari 2, 4 va 9 bo'lgan uchburchak bormi?",
        'Существует ли треугольник со сторонами 2, 4 и 9?',
        'Is there a triangle with sides 2, 4 and 9?',
      ),
      ok: L("Ikki qo'shuv to'rt olti bo'ladi, u esa to'qqizdan kichik: uchburchak yo'q.", 'Два плюс четыре это шесть, а это меньше девяти: треугольника нет.', 'Two plus four is six, less than nine: no triangle.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z4', label: L('ha, turli tomonli', 'да, разносторонний', 'yes, scalene'), hint: L("Tomonlar har xil, lekin ikki qisqasi uzunini yopmaydi.", 'Стороны разные, но две короткие не покрывают длинную.', 'The sides differ, but the two short ones do not cover the long one.') },
        { id: 'c', tag: 'Z4', label: L('ha, teng yonli', 'да, равнобедренный', 'yes, isosceles'), hint: L("Teng tomon ham yo'q, uchburchakning o'zi ham yo'q.", 'Равных сторон нет, да и треугольника нет.', 'There are no equal sides, and no triangle either.') },
        { id: 'd', tag: 'Z4', label: L('burchaklarni bilish kerak', 'нужно знать углы', 'the angles are needed'), hint: L("Tomonlar yetarli: yig'indini uchinchisi bilan solishtiring.", 'Сторон достаточно: сравни сумму с третьей.', 'The sides are enough: compare the sum with the third.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Teng tomonli uchburchak teng yonli ham bo'ladimi?",
        'Равносторонний треугольник является ли равнобедренным?',
        'Is an equilateral triangle also isosceles?',
      ),
      ok: L("Ha: ikki teng tomon unda bor, hatto uchtasi ham teng.", 'Да: две равные стороны в нём есть, там даже все три равны.', 'Yes: it has two equal sides, in fact all three are equal.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z1', label: L("yo'q, bu boshqa tur", 'нет, это другой вид', 'no, it is a different kind'), hint: L("Shart ikki tomon teng bo'lishi, uchtasi teng bo'lsa u ham bajarilgan.", 'Условие в том, что две стороны равны, а если равны три, оно тоже выполнено.', 'The condition is two equal sides, and with three equal it holds too.') },
        { id: 'c', tag: 'Z2', label: L('burchaklarga bog\'liq', 'зависит от углов', 'it depends on the angles'), hint: L("Bu tomonlar bo'yicha savol.", 'Это вопрос по сторонам.', 'This is a question about sides.') },
        { id: 'd', tag: 'Z1', label: L('faqat asosi kichik bo\'lsa', 'только если основание меньше', 'only if the base is smaller'), hint: L("Asosning kattaligi shart emas, tenglik yetarli.", 'Размер основания не важен, достаточно равенства.', 'The size of the base does not matter, equality is enough.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Diqqat: qaysi bo'linish so'ralgani har savolda yozilgan.", 'Четыре вопроса. Внимание: в каждом написано, какое деление спрашивают.', 'Four questions. Careful: each says which split is asked about.'),
    A('1', "Ikkinchisida burchaklar berilgan.", 'Во втором даны углы.', 'The second gives the angles.'),
    A('2', "Uchinchisida uchburchak bor yoki yo'qligini tekshiring.", 'В третьем проверь, есть ли треугольник.', 'In the third check whether the triangle exists.'),
    A('3', "Oxirgisi ikki nom haqida.", 'Последний про два названия.', 'The last is about two names.'),
  ],
}

// ============================================================
// 10. MASHQ 2. IKKI QADAM: tomonlar bo'yicha, keyin burchaklar bo'yicha.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ikkita nom', 'Два названия', 'Two names'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Uchburchakning tomonlari 5, 5 va 8, burchaklaridan bittasi 100 daraja. Ikki nomini yozing.",
    'Стороны треугольника 5, 5 и 8, а один из углов 100 градусов. Запиши оба названия.',
    'A triangle has sides 5, 5 and 8, and one of its angles is 100 degrees. Write both names.',
  ),
  template: ['5 = 5  →  ', { slot: 0 }, ',   100° > 90°  →  ', { slot: 1 }],
  parts: [
    { id: 'a', label: L('teng yonli', 'равнобедренный', 'isosceles') },
    { id: 'b', label: L("o'tmas burchakli", 'тупоугольный', 'obtuse-angled') },
    { id: 'c', label: L('turli tomonli', 'разносторонний', 'scalene') },
    { id: 'd', label: L("to'g'ri burchakli", 'прямоугольный', 'right-angled') },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Birinchi bo'shliqqa tomonlar bo'yicha nomni, ikkinchisiga burchaklar bo'yicha nomni qo'ying.",
    'В первый пропуск поставь название по сторонам, во второй по углам.',
    'Put the name by sides in the first gap and the name by angles in the second.',
  ),
  checkNote: L(
    "Ikki teng tomon teng yonli nomini beradi, 90 dan katta burchak esa o'tmas burchakli nomini. Bir uchburchak, ikki nom.",
    'Две равные стороны дают название равнобедренный, а угол больше 90 название тупоугольный. Один треугольник, два названия.',
    'Two equal sides give the name isosceles, and an angle over 90 gives obtuse. One triangle, two names.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("Turli tomonlida hamma tomon har xil, bu yerda esa ikkitasi besh.", 'В разностороннем все стороны разные, а здесь две по пять.', 'In a scalene triangle all sides differ, here two are five.') },
    { key: 'd', tag: 'Z2', hint: L("To'g'ri burchak aynan 90 daraja, bu yerda esa yuz.", 'Прямой угол это ровно 90 градусов, а здесь сто.', 'A right angle is exactly 90 degrees, here it is one hundred.') },
    { key: '*', tag: 'Z3', hint: L("Birinchi bo'shliq tomonlar haqida, ikkinchisi burchaklar haqida.", 'Первый пропуск про стороны, второй про углы.', 'The first gap is about sides, the second about angles.') },
  ],
  probe: {
    question: L("Bunday uchburchak o'tkir burchakli bo'la oladimi?", 'Может ли такой треугольник быть остроугольным?', 'Could such a triangle be acute-angled?'),
    items: [
      { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
      { id: 'b', tag: 'Z2', label: L('ha', 'да', 'yes'), hint: L("Yuz darajali burchak bor, u esa to'qsondan katta.", 'Есть угол сто градусов, а он больше девяноста.', 'There is a one hundred degree angle, more than ninety.') },
      { id: 'c', tag: 'Z3', label: L('tomonlarga bog\'liq', 'зависит от сторон', 'it depends on the sides'), hint: L("O'tkirlik faqat burchaklar bilan aniqlanadi.", 'Остроугольность определяется только углами.', 'Being acute is decided by the angles alone.') },
      { id: 'd', tag: 'Z2', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'), hint: L("Bilib bo'ladi: bitta o'tmas burchak yetarli.", 'Можно: одного тупого угла достаточно.', 'It can: one obtuse angle is enough.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam: avval tomonlar bo'yicha nom, keyin burchaklar bo'yicha.", 'Два шага: сначала название по сторонам, потом по углам.', 'Two steps: the name by sides first, then by angles.'),
    A('two', "Endi ikkinchi nom.", 'Теперь второе название.', 'Now the second name.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Teng burchaklardan tomonga', 'От равных углов к стороне', 'From equal angles to the side'),
  given: L(
    "Uchburchakning burchaklari 70, 70 va 40 daraja. Tomonlar bo'yicha turi qanday?",
    'Углы треугольника 70, 70 и 40 градусов. Какой вид по сторонам?',
    'A triangle has angles of 70, 70 and 40 degrees. What kind is it by sides?',
  ),
  template: ['70° = 70°  →  ', { slot: 0 }],
  parts: [
    { id: 'a', label: L('teng yonli', 'равнобедренный', 'isosceles') },
    { id: 'b', label: L('turli tomonli', 'разносторонний', 'scalene') },
    { id: 'c', label: L('teng tomonli', 'равносторонний', 'equilateral') },
    { id: 'd', label: L("to'g'ri burchakli", 'прямоугольный', 'right-angled') },
  ],
  answer: ['a'],
  prompt: L(
    "Turini yozing.",
    'Запиши вид.',
    'Write the kind.',
  ),
  checkNote: L(
    "Ikki burchak teng, demak ular qarshisidagi tomonlar ham teng: uchburchak teng yonli. Bog'liqlik ikki tomonga ishlaydi.",
    'Два угла равны, значит равны и стороны против них: треугольник равнобедренный. Связь работает в обе стороны.',
    'Two angles are equal, so the sides opposite them are equal too: the triangle is isosceles. The link works both ways.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Teng burchaklar teng tomonlarni beradi, ya'ni tomonlar har xil bo'lmaydi.", 'Равные углы дают равные стороны, значит стороны не все разные.', 'Equal angles give equal sides, so not all sides differ.') },
    { key: 'c', tag: 'Z5', hint: L("Hamma tomon teng bo'lishi uchun hamma burchak 60 bo'lishi kerak edi.", 'Чтобы все стороны были равны, все углы должны быть по 60.', 'For all sides to be equal every angle would have to be 60.') },
    { key: 'd', tag: 'Z3', hint: L("Bu burchaklar bo'yicha nom, savol esa tomonlar haqida.", 'Это название по углам, а вопрос про стороны.', 'That is a name by angles, the question is about sides.') },
  ],
  audio: [
    A('mount', "Bu safar burchaklar berilgan, tomonlar so'ralgan.", 'На этот раз даны углы, а спрашивают про стороны.', 'This time the angles are given and the sides are asked about.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Mavjudlik TO'G'RI tekshirilgan, lekin tur
// NOTO'G'RI atalgan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Mavjudlik to'g'ri tekshirilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Существование проверено верно. И всё же какая строка ошибочна?',
    'Existence was checked correctly. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('tomonlar: 3, 4, 5', 'стороны: 3, 4, 5', 'sides: 3, 4, 5') },
    { id: 'r2', text: '3 + 4 > 5' },
    { id: 'r3', text: L('uchburchak bor', 'треугольник существует', 'the triangle exists') },
    { id: 'r4', text: L('javob: teng yonli', 'ответ: равнобедренный', 'answer: isosceles') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu berilgan tomonlar.", 'Это данные стороны.', 'Those are the given sides.'),
    r2: L("To'g'ri: uch qo'shuv to'rt yetti, u esa beshdan katta.", 'Верно: три плюс четыре это семь, а это больше пяти.', 'Right: three plus four is seven, more than five.'),
    r3: L("To'g'ri: shart bajarildi, demak uchburchak bor.", 'Верно: условие выполнено, значит треугольник есть.', 'Right: the condition holds, so the triangle exists.'),
  },
  tags: { r1: 'Z1', r2: 'Z4', r3: 'Z4' },
  proofFill: {
    template: ['3 ≠ 4 ≠ 5  →  ', { slot: 0 }, ',   ', { slot: 1 }],
    parts: [
      { id: 'a', label: L('turli tomonli', 'разносторонний', 'scalene') },
      { id: 'b', label: L('teng tomon yo\'q', 'равных сторон нет', 'no equal sides') },
      { id: 'c', label: L('teng yonli', 'равнобедренный', 'isosceles') },
      { id: 'd', label: L('mavjudlik tekshirildi', 'существование проверено', 'existence was checked') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Turini tuzating va sababini ko'rsating.",
      'Исправь вид и укажи причину.',
      'Fix the kind and give the reason.',
    ),
    checkNote: L(
      "Uchta son har xil, demak uchburchak turli tomonli. Mavjudlik tekshiruvi to'g'ri edi, lekin u turni aytmaydi: bu ikki boshqa savol.",
      'Все три числа разные, значит треугольник разносторонний. Проверка существования была верна, но она не говорит о виде: это два разных вопроса.',
      'All three numbers differ, so the triangle is scalene. The existence check was right, but it says nothing about the kind: those are two different questions.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z1', hint: L("Teng yonli bo'lishi uchun ikki son bir xil bo'lishi kerak.", 'Чтобы быть равнобедренным, два числа должны совпадать.', 'To be isosceles two numbers must match.') },
      { key: 'd', tag: 'Z4', hint: L("Mavjudlik boshqa savol: u turni aniqlamaydi.", 'Существование это другой вопрос: вид он не определяет.', 'Existence is another question: it does not decide the kind.') },
      { key: '*', tag: 'Z1', hint: L("Tur tomonlarni solishtirishdan chiqadi.", 'Вид выходит из сравнения сторон.', 'The kind comes from comparing the sides.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda mavjudlik to'g'ri tekshirilgan.", 'В этой ловушке существование проверено верно.', 'In this trap existence was checked correctly.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri chiqdi.", 'И всё же ответ вышел неверным.', 'And yet the answer came out wrong.'),
    A('proof', "Topdingiz. Uchta son har xil edi.", 'Нашёл. Все три числа были разными.', 'You found it. All three numbers were different.'),
    A('done', "Mavjudlik va tur ikki boshqa savol.", 'Существование и вид это два разных вопроса.', 'Existence and kind are two different questions.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TOM: uchburchak tomlarda ishlaydi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Uy tomi', 'Крыша дома', 'A house roof'),
  given: L(
    "Tomning ikki yon yog'ochi bir xil uzunlikda kesilgan. Bir tomondagi burchak 35 daraja. Ikkinchi tomondagi burchak nechcha daraja?",
    'Две боковые балки крыши отрезаны одной длины. Угол с одной стороны 35 градусов. Сколько градусов угол с другой стороны?',
    'The two roof beams are cut to the same length. The angle on one side is 35 degrees. What is the angle on the other side?',
  ),
  template: ['∠1 = 35°,   ∠2 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '35' },
    { id: 'b', label: '55' },
    { id: 'c', label: '145' },
    { id: 'd', label: '110' },
  ],
  answer: ['a'],
  prompt: L(
    "Ikkinchi burchakni yozing.",
    'Запиши второй угол.',
    'Write the second angle.',
  ),
  checkNote: L(
    "Yon yog'ochlar teng, demak tom teng yonli uchburchak beradi, va asosdagi burchaklar teng. Shuning uchun ikkinchisi ham 35 daraja.",
    'Боковые балки равны, значит крыша даёт равнобедренный треугольник, и углы при основании равны. Поэтому второй тоже 35 градусов.',
    'The beams are equal, so the roof makes an isosceles triangle and the base angles are equal. So the second is 35 degrees too.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("To'qsondan ayirish bu boshqa masala.", 'Вычитание из девяноста это другая задача.', 'Subtracting from ninety is another problem.') },
    { key: 'c', tag: 'Z5', hint: L("Bu qo'shni burchak bo'lardi, bu yerda esa teng yonlilik ishlaydi.", 'Это был бы смежный угол, а здесь работает равнобедренность.', 'That would be the adjacent angle, but here being isosceles is what works.') },
    { key: 'd', tag: 'Z5', hint: L("Uchdagi burchak boshqa, so'ralgani esa asosdagi.", 'Угол при вершине другой, а спрашивают при основании.', 'The apex angle is different, the base angle is asked for.') },
  ],
  audio: [
    A('mount', "Tom ham uchburchak, va uning yon yog'ochlari teng.", 'Крыша это тоже треугольник, и её боковые балки равны.', 'A roof is a triangle too, and its side beams are equal.'),
    A('mount', "Teng tomonlar teng burchaklarni beradi.", 'Равные стороны дают равные углы.', 'Equal sides give equal angles.'),
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
        "Tomonlari 6, 6 va 4. Tomonlar bo'yicha turi?",
        'Стороны 6, 6 и 4. Вид по сторонам?',
        'Sides 6, 6 and 4. Kind by sides?',
      ),
      ok: L("Ikkitasi teng: teng yonli.", 'Две равны: равнобедренный.', 'Two are equal: isosceles.'),
      items: [
        { id: 'a', correct: true, label: L('teng yonli', 'равнобедренный', 'isosceles') },
        { id: 'b', tag: 'Z1', label: L('turli tomonli', 'разносторонний', 'scalene'), hint: L("Ikki olti bir xil.", 'Две шестёрки одинаковы.', 'The two sixes are the same.') },
        { id: 'c', tag: 'Z1', label: L('teng tomonli', 'равносторонний', 'equilateral'), hint: L("To'rt oltiga teng emas.", 'Четыре не равно шести.', 'Four is not six.') },
        { id: 'd', tag: 'Z4', label: L('yo\'q bunday', 'такого нет', 'no such one'), hint: L("Olti qo'shuv to'rt oltidan katta: bor.", 'Шесть плюс четыре больше шести: есть.', 'Six plus four is more than six: it exists.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Burchaklari 50, 60 va 70. Burchaklar bo'yicha turi?",
        'Углы 50, 60 и 70. Вид по углам?',
        'Angles 50, 60 and 70. Kind by angles?',
      ),
      ok: L("Hammasi to'qsondan kichik: o'tkir burchakli.", 'Все меньше девяноста: остроугольный.', 'All are under ninety: acute-angled.'),
      items: [
        { id: 'a', correct: true, label: L("o'tkir burchakli", 'остроугольный', 'acute-angled') },
        { id: 'b', tag: 'Z2', label: L("to'g'ri burchakli", 'прямоугольный', 'right-angled'), hint: L("To'qson darajali burchak yo'q.", 'Угла девяносто градусов нет.', 'There is no ninety degree angle.') },
        { id: 'c', tag: 'Z2', label: L("o'tmas burchakli", 'тупоугольный', 'obtuse-angled'), hint: L("To'qsondan katta burchak yo'q.", 'Угла больше девяноста нет.', 'There is no angle over ninety.') },
        { id: 'd', tag: 'Z1', label: L('turli tomonli', 'разносторонний', 'scalene'), hint: L("Bu tomonlar bo'yicha nom.", 'Это название по сторонам.', 'That is a name by sides.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Tomonlari 1, 2 va 4 bo'lgan uchburchak bormi?",
        'Есть ли треугольник со сторонами 1, 2 и 4?',
        'Is there a triangle with sides 1, 2 and 4?',
      ),
      ok: L("Bir qo'shuv ikki uch bo'ladi, u esa to'rtdan kichik: yo'q.", 'Один плюс два это три, а это меньше четырёх: нет.', 'One plus two is three, less than four: no.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z4', label: L('ha', 'да', 'yes'), hint: L("Ikki qisqa tomon uzunini yopmaydi.", 'Две короткие стороны не покрывают длинную.', 'The two short sides do not cover the long one.') },
        { id: 'c', tag: 'Z4', label: L('burchaklar kerak', 'нужны углы', 'the angles are needed'), hint: L("Tomonlar yetarli.", 'Сторон достаточно.', 'The sides are enough.') },
        { id: 'd', tag: 'Z4', label: L('faqat turli tomonli', 'только разносторонний', 'scalene only'), hint: L("Uchburchakning o'zi yo'q, tur haqida gap ham yo'q.", 'Самого треугольника нет, о виде речи нет.', 'There is no triangle at all, so no kind either.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda ikkita to'g'ri burchak bo'la oladimi?",
        'Может ли в треугольнике быть два прямых угла?',
        'Can a triangle have two right angles?',
      ),
      ok: L("Yo'q: to'qson qo'shuv to'qson bir yuz sakson beradi, uchinchi burchakka joy qolmaydi.", 'Нет: девяносто плюс девяносто дают сто восемьдесят, третьему углу места не остаётся.', 'No: ninety plus ninety is one hundred eighty, leaving no room for a third angle.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z2', label: L('ha', 'да', 'yes'), hint: L("Ikki to'g'ri burchak yoyilgan burchakni to'ldiradi, uchburchak esa yopilmaydi.", 'Два прямых угла заполняют развёрнутый, и треугольник не замкнётся.', 'Two right angles fill a straight angle and the triangle cannot close.') },
        { id: 'c', tag: 'Z2', label: L('faqat teng yonlida', 'только в равнобедренном', 'only in an isosceles one'), hint: L("Turi bunga yordam bermaydi.", 'Вид тут не поможет.', 'The kind does not help here.') },
        { id: 'd', tag: 'Z4', label: L('tomonlarga bog\'liq', 'зависит от сторон', 'it depends on the sides'), hint: L("Bog'liq emas: ikki to'qson allaqachon bir yuz sakson.", 'Не зависит: два раза девяносто это уже сто восемьдесят.', 'It does not: twice ninety is already one hundred eighty.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран.', 'Quick round, four questions. The only graded screen.'),
    A('1', "Ikkinchisi burchaklar haqida.", 'Второй про углы.', 'The second is about angles.'),
    A('2', "Uchinchisida mavjudlikni tekshiring.", 'В третьем проверь существование.', 'In the third check existence.'),
    A('3', "Oxirgisi o'ylashni talab qiladi.", 'Последний требует подумать.', 'The last one needs thinking.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Ikki bo\'linish, ikki nom', 'Два деления, два названия', 'Two splits, two names'),
  gate: S1.gate,
  fix: {
    tokens: ['ikkita'],
    value: '2',
    sign: '=',
    hint: L('Pastki tabloni bosing', 'Нажми на нижнее табло', 'Tap the lower board'),
  },
  fixSay: L(
    "Uchburchak turi tomonlar bo'yicha ham, burchaklar bo'yicha ham ataladi. Burchaklari to'qson, qirq besh va qirq besh bo'lgan uchburchak ayni vaqtda to'g'ri burchakli va teng yonli.",
    'Вид треугольника называют и по сторонам, и по углам. Треугольник с углами девяносто, сорок пять и сорок пять сразу прямоугольный и равнобедренный.',
    'A triangle is named both by sides and by angles. One with angles ninety, forty five and forty five is right-angled and isosceles at once.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    two: L('ikkita nom', 'два названия', 'two names'),
    right: L("faqat to'g'ri burchakli", 'только прямоугольный', 'right-angled only'),
    iso: L('faqat teng yonli', 'только равнобедренный', 'isosceles only'),
    none: L('bunday uchburchak yo\'q', 'такого нет', 'no such triangle'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['5 = 5', '4, 6, 9', '100° > 90°', '2 + 3 = 5'],
  twoLabel: L('Ikki bo\'linish', 'Два деления', 'Two splits'),
  twoA: L(
    'tomonlar  →  tenglik',
    'стороны  →  равенство',
    'sides  →  equality',
  ),
  twoB: L(
    'burchaklar  →  90 bilan solishtirish',
    'углы  →  сравнение с 90',
    'angles  →  comparing with 90',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'uchburchaklar tengligi alomatlari',
    'признаки равенства треугольников',
    'the tests for congruent triangles',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Ikkita nom to'g'ri keladi: tomonlar bo'yicha bittasi, burchaklar bo'yicha ikkinchisi.", 'Подходят два названия: одно по сторонам, другое по углам.', 'Two names fit: one by sides, the other by angles.'),
    A('mount', "Keyingi darsda uchburchaklarni bir-biriga solishtiramiz.", 'На следующем уроке будем сравнивать треугольники между собой.', 'Next lesson we will compare triangles with each other.'),
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
