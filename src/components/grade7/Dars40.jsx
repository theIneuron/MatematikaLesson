// ============================================================================
// 7-sinf, Dars 40. CHIZIQLAR VA BURCHAKLAR. B7 BLOKINI BOSHLAYDI.
// (Прямые и углы)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// BLOKNING ASBOBI SHU DARSDA ISHGA TUSHADI: `Figure` -- chizma. Uch to'r
// tugunlarida turadi, va o'quvchi uchni BOSHQA TUGUNGA ko'chira oladi.
//
// «O'LCHOV ISBOT EMAS» TALABI BU DARSDA YO'Q. Etalonning B7 izohi qat'iy:
// bu talab § 9 dan boshlanadi, 40 va 41-darslarda esa o'lchash TEMANING
// O'ZI va chizg'ich bu yerda asbob, vasvasa emas. Shuning uchun `guess`
// yorlig'i bu darsda qo'yilmaydi.
//
// BURCHAK QIYMATLARI `notes` BILAN BERILADI: asbob burchakni faqat yopiq
// uchburchakda hisoblaydi, bu yerda esa nur va to'g'ri chiziq bor. Chizma
// va yorliq MOS: C nuqtasi uch ; uch tugunida turadi, ya'ni burchak aynan
// qirq besh daraja.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_40'
const LESSON_TITLE = L('Chiziqlar va burchaklar', 'Прямые и углы', 'Lines and angles')
const LESSON_NO = L('40-dars', 'Урок 40', 'Lesson 40')
const BLOCK = { label: L('B7-blok', 'Блок Б7', 'Block B7'), from: 40, to: 48, current: 40 }

const TAGS = {
  Z1: L("qo'shni burchaklar yig'indisi", 'сумма смежных углов', 'the sum of adjacent angles'),
  Z2: L('vertikal burchaklar tengligi', 'равенство вертикальных углов', 'the equality of vertical angles'),
  Z3: L('burchak turi', 'вид угла', 'the kind of angle'),
  Z4: L('kesma va to\'g\'ri chiziq', 'отрезок и прямая', 'a segment and a line'),
  Z5: L('o\'lchov o\'qilmadi', 'измерение прочитано неверно', 'the measurement was misread'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Qo'shni burchakning ikkinchisi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('CHIZIQLAR VA BURCHAKLAR', 'ПРЯМЫЕ И УГЛЫ', 'LINES AND ANGLES'),
  noBack: true,
  noNotes: true,
  title: L('Ikkinchi burchak nechchi', 'Сколько второй угол', 'How big is the second angle'),
  gate: {
    source: { kind: 'plain', tokens: ['135°', '+', '?'] },
    rows: [
      { tokens: ['225°'], value: '360' },
      { tokens: ['45°'], value: '180' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Ikki burchak qo'shni: ular bir to'g'ri chiziqni to'ldiradi. Bittasi 135 daraja. Ikkinchisi nechchi? Tabloda har birining yig'indisi turadi.",
      'Два угла смежные: вместе они дают развёрнутый. Один из них 135 градусов. Сколько второй? На табло сумма, которая вышла у каждого.',
      'Two angles are adjacent: together they fill a straight line. One is 135 degrees. How big is the other? The boards show the sum each got.',
    ),
    items: [
      {
        id: 'fortyfive',
        label: L('45 daraja', '45 градусов', '45 degrees'),
        hint: L(
          "Taxminingiz qabul qilindi. Chizmada tekshiramiz.",
          'Прогноз принят. Проверим на чертеже.',
          'Your prediction is taken. We will check it on the drawing.',
        ),
      },
      {
        id: 'big',
        label: L('225 daraja', '225 градусов', '225 degrees'),
        hint: L(
          "Ikki qo'shni burchak birgalikda yoyilgan burchakni beradi, u esa 180 daraja.",
          'Два смежных угла вместе дают развёрнутый угол, а он равен 180 градусам.',
          'Two adjacent angles together make a straight angle, and that is 180 degrees.',
        ),
      },
      {
        id: 'ninety',
        label: L('90 daraja', '90 градусов', '90 degrees'),
        hint: L(
          "90 daraja to'g'ri burchak. Bu yerda esa birinchisi 135, ya'ni ikkinchisi kichikroq bo'ladi.",
          '90 градусов это прямой угол. А здесь первый 135, значит второй будет меньше.',
          '90 degrees is a right angle. Here the first is 135, so the second is smaller.',
        ),
      },
      {
        id: 'cant',
        label: L('Bilib bo\'lmaydi', 'Узнать нельзя', 'It cannot be known'),
        hint: L(
          "Bilib bo'ladi: qo'shni burchaklar yig'indisi har doim 180 daraja.",
          'Можно: сумма смежных углов всегда 180 градусов.',
          'It can: the sum of adjacent angles is always 180 degrees.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki burchak bir to'g'ri chiziqni to'ldiradi. Bittasi ma'lum, ikkinchisi esa yo'q.", 'Два угла вместе дают развёрнутый. Один известен, а второй нет.', 'Two angles together fill a straight line. One is known, the other is not.'),
    A('mount', "Tabloda har birining yig'indisi turadi: uch yuz oltmish va bir yuz sakson.", 'На табло сумма, которая вышла у каждого: триста шестьдесят и сто восемьдесят.', 'The boards show each sum: three hundred sixty and one hundred eighty.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Burchak turi, ayirma va chiziq turlari. KVOTA EKRANI.
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
        "To'g'ri burchak nechcha darajaga teng?",
        'Сколько градусов в прямом угле?',
        'How many degrees is a right angle?',
      ),
      ok: L("To'g'ri burchak 90 daraja.", 'Прямой угол это 90 градусов.', 'A right angle is 90 degrees.'),
      items: [
        { id: 'a', label: '90°', correct: true },
        { id: 'b', label: '180°', tag: 'Z3', hint: L("180 daraja yoyilgan burchak, u to'g'ri chiziq bo'lib qoladi.", '180 градусов это развёрнутый угол, он становится прямой линией.', '180 degrees is a straight angle, it becomes a straight line.') },
        { id: 'c', label: '60°', tag: 'Z3', hint: L("60 daraja o'tkir burchak: u to'g'ri burchakdan kichik.", '60 градусов это острый угол: он меньше прямого.', '60 degrees is an acute angle: smaller than a right one.') },
        { id: 'd', label: '360°', tag: 'Z3', hint: L("360 daraja to'liq aylanish.", '360 градусов это полный оборот.', '360 degrees is a full turn.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "135 daraja burchak qanday burchak?",
        'Какой это угол — 135 градусов?',
        'What kind of angle is 135 degrees?',
      ),
      ok: L("U to'g'ri burchakdan katta, yoyilganidan kichik: o'tmas burchak.", 'Он больше прямого и меньше развёрнутого: тупой угол.', 'It is more than a right angle and less than a straight one: obtuse.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L("o'tmas", 'тупой', 'obtuse'),
        },
        {
          id: 'b',
          tag: 'Z3',
          label: L("o'tkir", 'острый', 'acute'),
          hint: L("O'tkir burchak 90 darajadan kichik bo'ladi.", 'Острый угол меньше 90 градусов.', 'An acute angle is under 90 degrees.'),
        },
        {
          id: 'c',
          tag: 'Z3',
          label: L("to'g'ri", 'прямой', 'right'),
          hint: L("To'g'ri burchak aynan 90 daraja.", 'Прямой угол это ровно 90 градусов.', 'A right angle is exactly 90 degrees.'),
        },
        {
          id: 'd',
          tag: 'Z3',
          label: L('yoyilgan', 'развёрнутый', 'straight'),
          hint: L("Yoyilgan burchak 180 daraja.", 'Развёрнутый угол это 180 градусов.', 'A straight angle is 180 degrees.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Kesma to'g'ri chiziqdan nimasi bilan farq qiladi?",
        'Чем отрезок отличается от прямой?',
        'How does a segment differ from a line?',
      ),
      ok: L("Kesmaning ikki uchi bor, to'g'ri chiziq esa ikki tomonga cheksiz davom etadi.", 'У отрезка два конца, а прямая продолжается в обе стороны бесконечно.', 'A segment has two ends, a line runs on forever both ways.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('kesmaning ikki uchi bor', 'у отрезка два конца', 'a segment has two ends'),
        },
        {
          id: 'b',
          tag: 'Z4',
          label: L('hech qanday farqi yo\'q', 'ничем не отличается', 'no difference at all'),
          hint: L("To'g'ri chiziqning uchi yo'q, kesmaning esa bor.", 'У прямой нет концов, а у отрезка есть.', 'A line has no ends, a segment does.'),
        },
        {
          id: 'c',
          tag: 'Z4',
          label: L('kesma uzunroq', 'отрезок длиннее', 'a segment is longer'),
          hint: L("To'g'ri chiziq cheksiz, ya'ni uni uzunlik bilan solishtirib bo'lmaydi.", 'Прямая бесконечна, её нельзя сравнивать по длине.', 'A line is endless, its length cannot be compared.'),
        },
        {
          id: 'd',
          tag: 'Z4',
          label: L("to'g'ri chiziq qiyshiq bo'lmaydi", 'прямая не бывает наклонной', 'a line is never slanted'),
          hint: L("To'g'ri chiziq qiyshiq bo'lishi mumkin, gap uning uchlari haqida.", 'Прямая может быть наклонной, речь о её концах.', 'A line may be slanted, this is about its ends.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Ikkitasi burchak turi haqida, bittasi chiziqlar haqida.", 'Три коротких вопроса. Два про вид угла, один про линии.', 'Three short questions. Two about the kind of angle, one about lines.'),
    A('1', "Ikkinchisida burchak 135 daraja.", 'Во втором угол 135 градусов.', 'In the second the angle is 135 degrees.'),
    A('2', "Uchinchisi kesma haqida.", 'Третий про отрезок.', 'The third is about a segment.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. QO'SHNI BURCHAKLAR: nur yoyilgan burchakni
// ikkiga bo'ladi.
// ============================================================
const S3 = {
  kind: 'figure',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Nur burchakni ikkiga bo\'ladi', 'Луч делит угол на два', 'A ray splits the angle in two'),
  pts: { A: { x: -5, y: 0 }, O: { x: 0, y: 0 }, B: { x: 5, y: 0 }, C: { x: 3, y: 3 } },
  seg: [['A', 'O'], ['O', 'B'], ['O', 'C']],
  notes: [
    { x: -1.7, y: 0.7, text: '135°', mark: true },
    { x: 1.5, y: 0.7, text: '45°' },
  ],
  caption: L(
    "A O B yoyilgan burchak: u to'g'ri chiziq. O C nuri uni ikki qo'shni burchakka bo'ldi.",
    'Угол A O B развёрнутый: это прямая линия. Луч O C разделил его на два смежных угла.',
    'The angle A O B is straight: it is a line. The ray O C split it into two adjacent angles.',
  ),
  options: [
    { id: 'a', label: '180°' },
    { id: 'b', label: '90°' },
    { id: 'c', label: '360°' },
    { id: 'd', label: '135°' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("90 daraja to'g'ri burchak, bu yerda esa yoyilgan burchak bo'lingan.", '90 градусов это прямой угол, а здесь разделён развёрнутый.', '90 degrees is a right angle, but here a straight angle was split.') },
    { key: 'c', tag: 'Z1', hint: L("360 daraja to'liq aylanish, chizmada esa to'g'ri chiziq turibdi.", '360 градусов это полный оборот, а на чертеже прямая линия.', '360 degrees is a full turn, but the drawing shows a straight line.') },
    { key: 'd', tag: 'Z6', hint: L("135 bu bitta burchak, yig'indi esa ikkovi birga.", '135 это один угол, а сумма это оба вместе.', '135 is one angle, the sum is both together.') },
  ],
  note: L(
    "Ikki qo'shni burchakning yig'indisi 180 daraja: ular birgalikda yoyilgan burchakni, ya'ni to'g'ri chiziqni to'ldiradi.",
    'Сумма двух смежных углов равна 180 градусам: вместе они заполняют развёрнутый угол, то есть прямую.',
    'Two adjacent angles add to 180 degrees: together they fill a straight angle, that is a line.',
  ),
  audio: [
    A('mount', "A dan B gacha to'g'ri chiziq o'tgan, va u yoyilgan burchak beradi.", 'От A до B проходит прямая, и она даёт развёрнутый угол.', 'A line runs from A to B, and it gives a straight angle.'),
    A('mount', "O C nuri uni ikki burchakka bo'ldi: bittasi 135, ikkinchisi 45 daraja.", 'Луч O C разделил его на два угла: один 135, другой 45 градусов.', 'The ray O C split it into two angles: one 135, the other 45 degrees.'),
    A('mount', "Ikkovining yig'indisi nechchi bo'ladi.", 'Какова будет их сумма.', 'What their sum will be.'),
  ],
}

// ============================================================
// 4. FARQLASH. VERTIKAL BURCHAKLAR: ular teng, va bu qo'shni
// burchaklardan boshqa narsa.
// ============================================================
const S4 = {
  kind: 'figure',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Vertikal burchaklar', 'Вертикальные углы', 'Vertical angles'),
  pts: { A: { x: -5, y: 0 }, B: { x: 5, y: 0 }, C: { x: -3, y: -3 }, D: { x: 3, y: 3 } },
  seg: [['A', 'B'], ['C', 'D']],
  notes: [
    { x: 1.6, y: 0.7, text: '45°', mark: true },
    { x: -1.6, y: -0.7, text: '45°', mark: true },
    { x: -1.8, y: 0.8, text: '135°' },
    { x: 1.8, y: -0.8, text: '135°' },
  ],
  caption: L(
    "Ikki to'g'ri chiziq kesishdi va to'rt burchak berdi. Yoritilgan ikkitasi qarama-qarshi turibdi.",
    'Две прямые пересеклись и дали четыре угла. Подсвеченные два стоят напротив друг друга.',
    'Two lines crossed and made four angles. The two highlighted ones sit opposite each other.',
  ),
  options: [
    { id: 'a', label: L('qarama-qarshi burchaklar teng', 'противоположные углы равны', 'opposite angles are equal') },
    { id: 'b', label: L("ularning yig'indisi 180 daraja", 'их сумма 180 градусов', 'their sum is 180 degrees') },
    { id: 'c', label: L("hamma to'rt burchak teng", 'все четыре угла равны', 'all four angles are equal') },
    { id: 'd', label: L('ularni solishtirib bo\'lmaydi', 'их нельзя сравнить', 'they cannot be compared') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("180 daraja QO'SHNI burchaklarning yig'indisi, bu ikkitasi esa qarama-qarshi.", '180 градусов это сумма СМЕЖНЫХ углов, а эти два противоположны.', '180 degrees is the sum of ADJACENT angles, but these two are opposite.') },
    { key: 'c', tag: 'Z2', hint: L("Chizmaga qarang: yoritilganlari 45, qolganlari esa 135 daraja.", 'Посмотри на чертёж: подсвеченные 45, а остальные 135 градусов.', 'Look at the drawing: the highlighted are 45, the others 135 degrees.') },
    { key: 'd', tag: 'Z5', hint: L("Solishtirish mumkin: ikkovi ham 45 daraja.", 'Сравнить можно: оба по 45 градусов.', 'They can be compared: both are 45 degrees.') },
  ],
  note: L(
    "Kesishishda hosil bo'lgan QARAMA-QARSHI burchaklar VERTIKAL deb ataladi va ular TENG. Yonma-yon turganlari esa qo'shni: ularning yig'indisi 180 daraja.",
    'Противоположные углы при пересечении называются ВЕРТИКАЛЬНЫМИ и они РАВНЫ. А стоящие рядом смежные: их сумма 180 градусов.',
    'Opposite angles at a crossing are called VERTICAL and they are EQUAL. The neighbouring ones are adjacent: their sum is 180 degrees.',
  ),
  audio: [
    A('mount', "Ikki chiziq kesishganda to'rt burchak hosil bo'ladi.", 'При пересечении двух прямых получается четыре угла.', 'Two crossing lines make four angles.'),
    A('mount', "Yoritilgan ikkitasiga qarang: ular yonma-yon emas, qarama-qarshi turibdi.", 'Посмотри на подсвеченные два: они не рядом, а напротив.', 'Look at the two highlighted: they are not side by side but opposite.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Qo'shni burchakni hisoblash.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Chizmasiz hisoblash', 'Счёт без чертежа', 'Computing without a drawing'),
  given: L(
    "Bir burchak 62 daraja. Uning qo'shnisi nechcha daraja?",
    'Один угол 62 градуса. Сколько градусов у его смежного?',
    'One angle is 62 degrees. How many degrees is its adjacent angle?',
  ),
  template: ['180 − 62 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '118' },
    { id: 'b', label: '128' },
    { id: 'c', label: '28' },
    { id: 'd', label: '242' },
  ],
  answer: ['a'],
  prompt: L(
    "Qo'shni burchakni hisoblang.",
    'Посчитай смежный угол.',
    'Work out the adjacent angle.',
  ),
  checkNote: L(
    "Qo'shni burchaklar yig'indisi 180 daraja, shuning uchun ikkinchisi ayirma bilan topiladi.",
    'Сумма смежных углов 180 градусов, поэтому второй находится вычитанием.',
    'Adjacent angles add to 180 degrees, so the second is found by subtracting.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Bir yuz sakson dan oltmish ikki ayirilsa bir yuz o'n sakkiz chiqadi.", 'Сто восемьдесят минус шестьдесят два это сто восемнадцать.', 'One hundred eighty minus sixty two is one hundred eighteen.') },
    { key: 'c', tag: 'Z3', hint: L("To'qsondan emas, bir yuz sakson dan ayiriladi: qo'shni burchaklar yoyilganini to'ldiradi.", 'Вычитают не из девяноста, а из ста восьмидесяти: смежные дают развёрнутый.', 'Subtract from one hundred eighty, not ninety: adjacent angles fill a straight one.') },
    { key: 'd', tag: 'Z1', hint: L("Yig'indi 180 daraja, shuning uchun ayiriladi.", 'Сумма 180 градусов, поэтому вычитают.', 'The sum is 180 degrees, so we subtract.') },
  ],
  audio: [
    A('mount', "Chizma har doim kerak emas: qo'shni burchak ayirma bilan topiladi.", 'Чертёж нужен не всегда: смежный угол находится вычитанием.', 'A drawing is not always needed: an adjacent angle comes from subtracting.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. UCHNI KO'CHIRISH: burchak to'g'ri bo'lsin.
// ============================================================
const S6 = {
  kind: 'figure',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Burchakni to\'g\'ri qiling', 'Сделай угол прямым', 'Make the angle right'),
  pts: { A: { x: -5, y: 0 }, O: { x: 0, y: 0 }, B: { x: 5, y: 0 }, C: { x: 3, y: 2 } },
  seg: [['A', 'O'], ['O', 'B'], ['O', 'C']],
  move: 'C',
  pick: { x: 0, y: 3 },
  caption: L(
    "C nuqtasini boshqa tugunga ko'chiring, toki O C nuri to'g'ri chiziqqa tik bo'lsin.",
    'Перенеси точку C в другой узел так, чтобы луч O C стал перпендикулярен прямой.',
    'Move the point C to another node so that the ray O C becomes perpendicular to the line.',
  ),
  options: [
    { id: 'a', label: L('ikki burchak ham 90 daraja', 'оба угла по 90 градусов', 'both angles are 90 degrees') },
    { id: 'b', label: L('bittasi 90, ikkinchisi 180', 'один 90, другой 180', 'one is 90, the other 180') },
    { id: 'c', label: L('burchaklar teng bo\'lmaydi', 'углы не будут равны', 'the angles will not be equal') },
    { id: 'd', label: L("yig'indi 90 daraja bo'ladi", 'сумма станет 90 градусов', 'the sum becomes 90 degrees') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Ikki burchakning yig'indisi 180 bo'lishi kerak, demak har biri 90 daraja.", 'Сумма двух углов должна быть 180, значит каждый по 90 градусов.', 'The two angles must add to 180, so each is 90 degrees.') },
    { key: 'c', tag: 'Z1', hint: L("Nur tik turgan bo'lsa, ikki tomonda bir xil burchak qoladi.", 'Если луч перпендикулярен, с обеих сторон остаётся одинаковый угол.', 'If the ray is perpendicular, the same angle stays on both sides.') },
    { key: 'd', tag: 'Z1', hint: L("Yig'indi o'zgarmaydi: qo'shni burchaklar har doim 180 daraja beradi.", 'Сумма не меняется: смежные углы всегда дают 180 градусов.', 'The sum does not change: adjacent angles always give 180 degrees.') },
  ],
  note: L(
    "Nur to'g'ri chiziqqa tik bo'lganda yoyilgan burchak TENG ikkiga bo'linadi: 90 va 90. Yig'indi esa o'zgarmaydi.",
    'Когда луч перпендикулярен прямой, развёрнутый угол делится РОВНО пополам: 90 и 90. А сумма не меняется.',
    'When the ray is perpendicular the straight angle splits EXACTLY in half: 90 and 90. The sum does not change.',
  ),
  audio: [
    A('mount', "Endi nurni o'zingiz ko'chirasiz. Uni tik holatga qo'ying.", 'Теперь луч переносишь сам. Поставь его вертикально.', 'Now you move the ray. Set it upright.'),
    A('mount', "Tugunni bosing: uch shu joyga ko'chadi.", 'Нажми на узел: вершина переедет туда.', 'Tap a node: the vertex moves there.'),
    A('move', "Nur tik turdi. Endi burchaklar nechchi bo'lganini ayting.", 'Луч встал вертикально. Теперь скажи, какими стали углы.', 'The ray is upright. Now say what the angles became.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: yoyilgan burchak -- bu ham burchak.
// ============================================================
const S7 = {
  kind: 'figure',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('To\'g\'ri chiziq ham burchak', 'Прямая это тоже угол', 'A line is an angle too'),
  pts: { A: { x: -5, y: 0 }, O: { x: 0, y: 0 }, B: { x: 5, y: 0 } },
  seg: [['A', 'O'], ['O', 'B']],
  notes: [{ x: 0, y: 1.1, text: '180°', mark: true }],
  caption: L(
    "Bu yerda nur yo'q: A O B shunchaki to'g'ri chiziq. Bu burchakmi?",
    'Здесь луча нет: A O B это просто прямая. Это угол?',
    'There is no ray here: A O B is just a line. Is that an angle?',
  ),
  options: [
    { id: 'a', label: L('ha, yoyilgan burchak', 'да, развёрнутый угол', 'yes, a straight angle') },
    { id: 'b', label: L("yo'q, burchak emas", 'нет, это не угол', 'no, it is not an angle') },
    { id: 'c', label: L('bu nol daraja', 'это ноль градусов', 'that is zero degrees') },
    { id: 'd', label: L('bu 360 daraja', 'это 360 градусов', 'that is 360 degrees') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Burchak: uning uchi O, tomonlari esa O A va O B nurlari.", 'Угол есть: его вершина O, а стороны это лучи O A и O B.', 'It is an angle: the vertex is O and the sides are the rays O A and O B.') },
    { key: 'c', tag: 'Z3', hint: L("Nol daraja ikki nur ustma-ust tushganda bo'ladi, bu yerda esa ular qarama-qarshi.", 'Ноль градусов бывает, когда лучи совпадают, а здесь они противоположны.', 'Zero degrees happens when the rays coincide, here they are opposite.') },
    { key: 'd', tag: 'Z3', hint: L("360 daraja to'liq aylanish: nur boshlang'ich joyiga qaytadi.", '360 градусов это полный оборот: луч возвращается на место.', '360 degrees is a full turn: the ray returns to its start.') },
  ],
  note: L(
    "Yoyilgan burchak ham burchak, va u 180 darajaga teng. Aynan shuning uchun qo'shni burchaklarning yig'indisi 180 chiqadi: ular yoyilganini bo'lib oladi.",
    'Развёрнутый угол это тоже угол, и он равен 180 градусам. Именно поэтому сумма смежных углов даёт 180: они делят развёрнутый.',
    'A straight angle is an angle too, equal to 180 degrees. That is exactly why adjacent angles add to 180: they split the straight one.',
  ),
  audio: [
    A('mount', "Chizmada faqat to'g'ri chiziq qoldi.", 'На чертеже осталась только прямая.', 'Only the line is left on the drawing.'),
    A('mount', "Lekin uchi va ikki tomoni bor. Bu burchakmi.", 'Но есть вершина и две стороны. Это угол.', 'But there is a vertex and two sides. Is it an angle.'),
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
    { id: 'f1', label: L("yonma-yon turgan burchaklar qo'shni", 'стоящие рядом углы смежные', 'angles side by side are adjacent') },
    { id: 'f2', label: L("ularning yig'indisi 180 daraja", 'их сумма 180 градусов', 'their sum is 180 degrees') },
    { id: 'f3', label: L('qarama-qarshi turganlari vertikal', 'стоящие напротив вертикальные', 'the opposite ones are vertical') },
    { id: 'f4', label: L('va ular bir-biriga teng', 'и они равны между собой', 'and they are equal to each other') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval qo'shni burchaklar va ularning yig'indisi, keyin vertikal burchaklar va ularning tengligi.",
    'Порядок нарушен. Сначала смежные углы и их сумма, потом вертикальные и их равенство.',
    'The order is off. Adjacent angles and their sum first, then vertical angles and their equality.',
  ),
  lawChips: [
    { label: '180', tone: 'off' },
    { label: '=', tone: 's2' },
    { label: '+', tone: 's1' },
    { label: '( )', tone: 'par' },
  ],
  lawSweep: L(
    "yoyilgan burchak, tenglik, yig'indi, juftlik",
    'развёрнутый угол, равенство, сумма, пара',
    'the straight angle, equality, the sum, the pair',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Bir tomoni umumiy bo'lgan va qolgan tomonlari to'g'ri chiziq hosil qiladigan ikki burchak QO'SHNI deb ataladi. Ularning yig'indisi 180 darajaga teng.",
        'Два угла с общей стороной, у которых остальные стороны образуют прямую, называются СМЕЖНЫМИ. Их сумма равна 180 градусам.',
        'Two angles with a common side whose other sides form a line are called ADJACENT. Their sum is 180 degrees.',
      ),
      L(
        "Ikki to'g'ri chiziq kesishganda qarama-qarshi turgan burchaklar VERTIKAL deb ataladi, va ular bir-biriga teng. Yoyilgan burchak ham burchak: u 180 darajaga teng.",
        'При пересечении двух прямых противоположные углы называются ВЕРТИКАЛЬНЫМИ, и они равны между собой. Развёрнутый угол это тоже угол: он равен 180 градусам.',
        'When two lines cross, the opposite angles are called VERTICAL and they are equal. A straight angle is an angle too: it equals 180 degrees.',
      ),
    ],
  },
  hookCap: L(
    "Qo'shni burchaklar  --  180 daraja",
    'Смежные углы — 180 градусов',
    'Adjacent angles make 180 degrees',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("yonma-yon  --  qo'shni", 'рядом это смежные', 'side by side means adjacent'),
    L('qarama-qarshi  --  vertikal', 'напротив это вертикальные', 'opposite means vertical'),
    L("yoyilgan  --  180", 'развёрнутый это 180', 'straight means 180'),
  ],
  audio: [
    A('mount', "Ikki juft burchakni ko'rdik: qo'shni va vertikal. Endi qoidani yig'amiz.", 'Мы увидели две пары углов: смежные и вертикальные. Теперь соберём правило.', 'We have seen two pairs: adjacent and vertical. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda uch nuqta uchburchak beradi.", 'Верно. На следующем уроке три точки дадут треугольник.', 'Correct. Next lesson three points will make a triangle.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni toping', 'Найди ответ', 'Find the answer'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Bir burchak 70 daraja. Uning qo'shnisi nechcha daraja?",
        'Один угол 70 градусов. Сколько градусов его смежный?',
        'One angle is 70 degrees. How many degrees is its adjacent one?',
      ),
      ok: L("Bir yuz sakson dan yetmish ayirilsa bir yuz o'n chiqadi.", 'Сто восемьдесят минус семьдесят это сто десять.', 'One hundred eighty minus seventy is one hundred ten.'),
      items: [
        { id: 'a', label: '110°', correct: true },
        { id: 'b', label: '20°', tag: 'Z3', hint: L("To'qsondan emas, bir yuz sakson dan ayiriladi.", 'Вычитают не из девяноста, а из ста восьмидесяти.', 'Subtract from one hundred eighty, not ninety.') },
        { id: 'c', label: '290°', tag: 'Z1', hint: L("Yig'indi 180, shuning uchun ayiriladi.", 'Сумма 180, поэтому вычитают.', 'The sum is 180, so we subtract.') },
        { id: 'd', label: '70°', tag: 'Z2', hint: L("Teng bo'lishi VERTIKAL burchaklarda, qo'shnilarda esa yig'indi 180.", 'Равны бывают ВЕРТИКАЛЬНЫЕ углы, а у смежных сумма 180.', 'VERTICAL angles are equal, adjacent ones sum to 180.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki chiziq kesishdi. Bir burchak 40 daraja. Unga vertikal burchak nechcha daraja?",
        'Две прямые пересеклись. Один угол 40 градусов. Сколько градусов вертикальный к нему?',
        'Two lines crossed. One angle is 40 degrees. How many degrees is the vertical one?',
      ),
      ok: L("Vertikal burchaklar teng, demak u ham 40 daraja.", 'Вертикальные углы равны, значит он тоже 40 градусов.', 'Vertical angles are equal, so it is 40 degrees too.'),
      items: [
        { id: 'a', label: '40°', correct: true },
        { id: 'b', label: '140°', tag: 'Z2', hint: L("Bir yuz qirq bu QO'SHNI burchak, vertikal esa teng bo'ladi.", 'Сто сорок это СМЕЖНЫЙ угол, а вертикальный равен.', 'One hundred forty is the ADJACENT angle, the vertical one is equal.') },
        { id: 'c', label: '50°', tag: 'Z3', hint: L("To'qsondan ayirish bu boshqa masala.", 'Вычитание из девяноста это другая задача.', 'Subtracting from ninety is another problem.') },
        { id: 'd', label: '320°', tag: 'Z2', hint: L("Vertikal burchak teng bo'ladi, ayirma emas.", 'Вертикальный угол равен, а не разность.', 'A vertical angle is equal, not a difference.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki qo'shni burchak teng. Har biri nechcha daraja?",
        'Два смежных угла равны. Сколько градусов каждый?',
        'Two adjacent angles are equal. How many degrees is each?',
      ),
      ok: L("Yig'indi 180, ikkovi teng, demak har biri 90 daraja.", 'Сумма 180, оба равны, значит каждый по 90 градусов.', 'The sum is 180 and both are equal, so each is 90 degrees.'),
      items: [
        { id: 'a', label: '90°', correct: true },
        { id: 'b', label: '45°', tag: 'Z6', hint: L("Ikkovi qo'shilganda 180 bo'lishi kerak, qirq besh esa to'qson beradi.", 'В сумме должно быть 180, а сорок пять дают девяносто.', 'They must sum to 180, but forty five each gives ninety.') },
        { id: 'c', label: '180°', tag: 'Z1', hint: L("Bu ikkovining yig'indisi, bittasi esa uning yarmi.", 'Это сумма обоих, а один это её половина.', 'That is the sum of both, one is half of it.') },
        { id: 'd', label: '60°', tag: 'Z6', hint: L("Oltmish va oltmish bir yuz yigirma beradi.", 'Шестьдесят и шестьдесят дают сто двадцать.', 'Sixty and sixty give one hundred twenty.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki chiziq kesishganda nechta burchak hosil bo'ladi?",
        'Сколько углов получается при пересечении двух прямых?',
        'How many angles appear when two lines cross?',
      ),
      ok: L("To'rtta: ikki juft vertikal burchak.", 'Четыре: две пары вертикальных углов.', 'Four: two pairs of vertical angles.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '2', tag: 'Z2', hint: L("Kesishishning to'rt tomonida burchak bor.", 'С четырёх сторон от пересечения есть угол.', 'There is an angle on each of the four sides of the crossing.') },
        { id: 'c', label: '3', tag: 'Z2', hint: L("Burchaklar juft-juft bo'ladi, demak toq son chiqmaydi.", 'Углы идут парами, значит нечётного числа не выйдет.', 'The angles come in pairs, so an odd count is impossible.') },
        { id: 'd', label: '6', tag: 'Z6', hint: L("Ikki chiziq bitta nuqtada kesishadi va to'rt burchak beradi.", 'Две прямые пересекаются в одной точке и дают четыре угла.', 'Two lines cross at one point and give four angles.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ikkinchisi vertikal burchaklar haqida.", 'Четыре вопроса. Второй про вертикальные углы.', 'Four questions. The second is about vertical angles.'),
    A('1', "Ikkinchisida burchaklar teng bo'ladi.", 'Во втором углы будут равны.', 'In the second the angles are equal.'),
    A('2', "Uchinchisiga o'ylab javob bering.", 'На третий ответь подумав.', 'Think before answering the third.'),
    A('3', "Oxirgisida burchaklarni sanang.", 'В последнем посчитай углы.', 'In the last one count the angles.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: qo'shni, keyin vertikal.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Qo\'shni va vertikal', 'Смежный и вертикальный', 'Adjacent and vertical'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Ikki chiziq kesishdi, bir burchak 35 daraja. 1-burchak unga qo'shni, 2-burchak esa vertikal.",
    'Две прямые пересеклись, один угол 35 градусов. Угол 1 ему смежный, а угол 2 вертикальный.',
    'Two lines crossed, one angle is 35 degrees. Angle 1 is adjacent to it, angle 2 is vertical.',
  ),
  template: ['∠1 = 180 − 35 = ', { slot: 0 }, ',   ∠2 = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '145' },
    { id: 'b', label: '35' },
    { id: 'c', label: '55' },
    { id: 'd', label: '145' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "1-burchakni va 2-burchakni yozing: biri qo'shni, ikkinchisi vertikal.",
    'Запиши угол 1 и угол 2: один смежный, другой вертикальный.',
    'Write angle 1 and angle 2: one adjacent, the other vertical.',
  ),
  checkNote: L(
    "Qo'shni burchak ayirma bilan topiladi, vertikal esa berilganiga teng.",
    'Смежный угол находится вычитанием, а вертикальный равен данному.',
    'The adjacent angle comes from subtracting, the vertical equals the given one.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("Bir yuz sakson dan ayiriladi, to'qsondan emas.", 'Вычитают из ста восьмидесяти, а не из девяноста.', 'Subtract from one hundred eighty, not ninety.') },
    { key: 'd', tag: 'Z2', hint: L("Vertikal burchak berilganiga TENG, qo'shnisiga emas.", 'Вертикальный угол РАВЕН данному, а не смежному.', 'The vertical angle EQUALS the given one, not the adjacent.') },
    { key: '*', tag: 'Z1', hint: L("Qo'shni -- ayirma, vertikal -- tenglik.", 'Смежный это разность, вертикальный это равенство.', 'Adjacent means a difference, vertical means equality.') },
  ],
  probe: {
    question: L("Kesishishda nechta har xil qiymat bor?", 'Сколько разных значений при пересечении?', 'How many different values at the crossing?'),
    items: [
      { id: 'a', correct: true, label: '2' },
      { id: 'b', tag: 'Z2', label: '4', hint: L("To'rt burchak bor, lekin ular juft-juft teng.", 'Углов четыре, но они равны попарно.', 'There are four angles, but they are equal in pairs.') },
      { id: 'c', tag: 'Z2', label: '1', hint: L("Bir xil bo'lishi faqat to'rt burchak ham to'g'ri bo'lganda.", 'Одинаковыми они бывают только если все четыре прямые.', 'They are all the same only when all four are right angles.') },
      { id: 'd', tag: 'Z6', label: '3', hint: L("Juft-juft teng bo'lgani uchun toq son chiqmaydi.", 'Так как равны попарно, нечётного числа не выйдет.', 'Being equal in pairs, an odd count is impossible.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval qo'shni burchak, keyin vertikal.", 'Два шага. Сначала смежный угол, потом вертикальный.', 'Two steps. The adjacent angle first, then the vertical.'),
    A('mount', "Diqqat: bittasi ayirma bilan, ikkinchisi tenglik bilan topiladi.", 'Внимание: один находится вычитанием, другой равенством.', 'Careful: one comes from subtracting, the other from equality.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Uch burchakni toping', 'Найди три угла', 'Find three angles'),
  given: L(
    "Ikki chiziq kesishdi, bir burchak 108 daraja. Qo'shni burchakni yozing.",
    'Две прямые пересеклись, один угол 108 градусов. Запиши смежный угол.',
    'Two lines crossed, one angle is 108 degrees. Write the adjacent angle.',
  ),
  template: ['180 − 108 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '72' },
    { id: 'b', label: '82' },
    { id: 'c', label: '108' },
    { id: 'd', label: '288' },
  ],
  answer: ['a'],
  prompt: L(
    "Qo'shni burchakni hisoblang.",
    'Посчитай смежный угол.',
    'Work out the adjacent angle.',
  ),
  checkNote: L(
    "Bir yuz sakson dan bir yuz sakkiz ayirilsa yetmish ikki chiqadi. Vertikal burchaklar esa 108 va 72 bo'lib qoladi.",
    'Сто восемьдесят минус сто восемь это семьдесят два. А вертикальные углы будут 108 и 72.',
    'One hundred eighty minus one hundred eight is seventy two. The vertical angles are 108 and 72.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Bir yuz sakson dan bir yuz sakkiz ayirilsa yetmish ikki qoladi.", 'Сто восемьдесят минус сто восемь это семьдесят два.', 'One hundred eighty minus one hundred eight is seventy two.') },
    { key: 'c', tag: 'Z2', hint: L("Teng bo'lishi vertikal burchakda, qo'shnisi esa ayirma.", 'Равным бывает вертикальный, а смежный это разность.', 'The vertical one is equal, the adjacent is a difference.') },
    { key: 'd', tag: 'Z1', hint: L("Yig'indi 180 daraja.", 'Сумма 180 градусов.', 'The sum is 180 degrees.') },
  ],
  audio: [
    A('mount', "Bu safar chizma yo'q va yordam ham yo'q.", 'На этот раз ни чертежа, ни помощи.', 'This time no drawing and no help.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Ayirma TO'G'RI hisoblangan, lekin u VERTIKAL
// burchakka yozilgan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Ayirma to'g'ri hisoblangan. Shunday bo'lsa ham, qaysi qator xato?",
    'Разность посчитана верно. И всё же какая строка ошибочна?',
    'The difference is computed right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('berilgan burchak: 60°', 'дан угол: 60°', 'given angle: 60°') },
    { id: 'r2', text: '180 − 60 = 120' },
    { id: 'r3', text: L("qo'shni burchak: 120°", 'смежный угол: 120°', 'adjacent angle: 120°') },
    { id: 'r4', text: L('javob: vertikal burchak 120°', 'ответ: вертикальный угол 120°', 'answer: the vertical angle is 120°') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu berilgan burchak.", 'Это данный угол.', 'That is the given angle.'),
    r2: L("To'g'ri: bir yuz sakson dan oltmish ayirilsa bir yuz yigirma.", 'Верно: сто восемьдесят минус шестьдесят это сто двадцать.', 'Right: one hundred eighty minus sixty is one hundred twenty.'),
    r3: L("To'g'ri: qo'shni burchak aynan shunday topiladi.", 'Верно: смежный угол находится именно так.', 'Right: that is exactly how the adjacent angle is found.'),
  },
  tags: { r1: 'Z2', r2: 'Z2', r3: 'Z2' },
  proofFill: {
    template: ['∠ = ', { slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: '60' },
      { id: 'b', label: L('teng bo\'ladi', 'равен данному', 'equals the given one') },
      { id: 'c', label: '120' },
      { id: 'd', label: L('ayirma bo\'ladi', 'это разность', 'it is the difference') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Vertikal burchakni tuzating: uning qiymati va sababi.",
      'Исправь вертикальный угол: его значение и причину.',
      'Fix the vertical angle: its value and the reason.',
    ),
    checkNote: L(
      "Vertikal burchak berilganiga TENG, ya'ni 60 daraja. Bir yuz yigirma esa QO'SHNI burchak edi -- u to'g'ri hisoblangan, lekin boshqa joyga yozilgan.",
      'Вертикальный угол РАВЕН данному, то есть 60 градусов. А сто двадцать это СМЕЖНЫЙ угол — он посчитан верно, но записан не туда.',
      'The vertical angle EQUALS the given one, that is 60 degrees. One hundred twenty was the ADJACENT angle — computed right but written in the wrong place.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z2', hint: L("Bir yuz yigirma qo'shni burchak, vertikal esa teng bo'ladi.", 'Сто двадцать это смежный угол, а вертикальный равен.', 'One hundred twenty is the adjacent angle, the vertical is equal.') },
      { key: 'd', tag: 'Z2', hint: L("Ayirma qo'shni burchakni beradi, vertikalni emas.", 'Разность даёт смежный угол, а не вертикальный.', 'The difference gives the adjacent angle, not the vertical.') },
      { key: '*', tag: 'Z2', hint: L("Vertikal -- tenglik, qo'shni -- ayirma.", 'Вертикальный это равенство, смежный это разность.', 'Vertical means equality, adjacent means a difference.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda ayirma to'g'ri hisoblangan.", 'В этой ловушке разность посчитана верно.', 'In this trap the difference is computed right.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Bir yuz yigirma qo'shni burchak edi, vertikal emas.", 'Нашёл. Сто двадцать это смежный угол, а не вертикальный.', 'You found it. One hundred twenty was the adjacent angle, not the vertical.'),
    A('done', "Vertikal burchak berilganiga teng bo'ladi.", 'Вертикальный угол равен данному.', 'The vertical angle equals the given one.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. YO'L CHORRAHASI.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Chorraha', 'Перекрёсток', 'A crossroads'),
  given: L(
    "Ikki yo'l kesishdi. Bir burchak 65 daraja. Chorrahaning qarama-qarshi tomonidagi burchak nechcha daraja?",
    'Две дороги пересеклись. Один угол 65 градусов. Сколько градусов угол с противоположной стороны перекрёстка?',
    'Two roads crossed. One angle is 65 degrees. How many degrees is the angle on the opposite side?',
  ),
  template: ['∠1 = 65°,   ∠2 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '65' },
    { id: 'b', label: '115' },
    { id: 'c', label: '25' },
    { id: 'd', label: '130' },
  ],
  answer: ['a'],
  prompt: L(
    "2-burchakni yozing: u chorrahaning qarama-qarshi tomonida turadi.",
    'Запиши угол 2: он стоит с противоположной стороны перекрёстка.',
    'Write angle 2: it is on the opposite side of the crossroads.',
  ),
  checkNote: L(
    "Qarama-qarshi burchak vertikal, va vertikal burchaklar teng. Yo'lda ham xuddi shunday: qarama-qarshi tomonlar bir xil burilish beradi.",
    'Противоположный угол вертикальный, а вертикальные углы равны. На дороге так же: противоположные стороны дают одинаковый поворот.',
    'The opposite angle is vertical, and vertical angles are equal. On a road it is the same: opposite sides give the same turn.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Bu qo'shni burchak, ya'ni yonma-yon turgani.", 'Это смежный угол, тот, что рядом.', 'That is the adjacent angle, the one beside it.') },
    { key: 'c', tag: 'Z3', hint: L("To'qsondan ayirish bu boshqa masala.", 'Вычитание из девяноста это другая задача.', 'Subtracting from ninety is another problem.') },
    { key: 'd', tag: 'Z6', hint: L("Vertikal burchak ikki barobar emas, u TENG.", 'Вертикальный угол не в два раза больше, он РАВЕН.', 'A vertical angle is not doubled, it is EQUAL.') },
  ],
  audio: [
    A('mount', "Chorraha ham ikki chiziqning kesishishi.", 'Перекрёсток это тоже пересечение двух линий.', 'A crossroads is also a crossing of two lines.'),
    A('mount', "Qarama-qarshi tomondagi burchak vertikal bo'ladi.", 'Угол с противоположной стороны будет вертикальным.', 'The angle on the opposite side is the vertical one.'),
  ],
}

// ============================================================
// 14. BLITS. Baholanadigan YAGONA ekran.
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
        "Bir burchak 25 daraja. Qo'shnisi nechcha daraja?",
        'Один угол 25 градусов. Сколько его смежный?',
        'One angle is 25 degrees. How big is its adjacent one?',
      ),
      ok: L("Bir yuz sakson dan yigirma besh ayirilsa bir yuz ellik besh.", 'Сто восемьдесят минус двадцать пять это сто пятьдесят пять.', 'One hundred eighty minus twenty five is one hundred fifty five.'),
      items: [
        { id: 'a', label: '155°', correct: true },
        { id: 'b', label: '65°', tag: 'Z3', hint: L("To'qsondan emas, bir yuz sakson dan ayiriladi.", 'Вычитают не из девяноста, а из ста восьмидесяти.', 'Subtract from one hundred eighty, not ninety.') },
        { id: 'c', label: '25°', tag: 'Z2', hint: L("Teng bo'lishi vertikal burchakda.", 'Равным бывает вертикальный угол.', 'The vertical angle is the equal one.') },
        { id: 'd', label: '335°', tag: 'Z1', hint: L("Yig'indi 180 daraja.", 'Сумма 180 градусов.', 'The sum is 180 degrees.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Vertikal burchaklar haqida nima to'g'ri?",
        'Что верно о вертикальных углах?',
        'What is true about vertical angles?',
      ),
      ok: L("Ular teng, va bu ularning asosiy xossasi.", 'Они равны, и это их главное свойство.', 'They are equal, and that is their main property.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('ular teng', 'они равны', 'they are equal'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L("yig'indisi 180", 'их сумма 180', 'they sum to 180'),
          hint: L("Bu qo'shni burchaklar haqida.", 'Это про смежные углы.', 'That is about adjacent angles.'),
        },
        {
          id: 'c',
          tag: 'Z3',
          label: L('ular har doim to\'g\'ri', 'они всегда прямые', 'they are always right angles'),
          hint: L("Ular har qanday bo'lishi mumkin, faqat teng bo'ladi.", 'Они могут быть любыми, только равными.', 'They can be any size, only equal.'),
        },
        {
          id: 'd',
          tag: 'Z2',
          label: L('ular yonma-yon turadi', 'они стоят рядом', 'they stand side by side'),
          hint: L("Yonma-yon turganlari qo'shni, vertikallari esa qarama-qarshi.", 'Рядом стоят смежные, а вертикальные напротив.', 'The adjacent ones stand side by side, the vertical ones opposite.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Yoyilgan burchak nechcha darajaga teng?",
        'Сколько градусов в развёрнутом угле?',
        'How many degrees is a straight angle?',
      ),
      ok: L("Yoyilgan burchak to'g'ri chiziq bo'lib qoladi: 180 daraja.", 'Развёрнутый угол становится прямой линией: 180 градусов.', 'A straight angle becomes a line: 180 degrees.'),
      items: [
        { id: 'a', label: '180°', correct: true },
        { id: 'b', label: '90°', tag: 'Z3', hint: L("To'qson daraja to'g'ri burchak.", 'Девяносто градусов это прямой угол.', 'Ninety degrees is a right angle.') },
        { id: 'c', label: '360°', tag: 'Z3', hint: L("Uch yuz oltmish to'liq aylanish.", 'Триста шестьдесят это полный оборот.', 'Three hundred sixty is a full turn.') },
        { id: 'd', label: '0°', tag: 'Z3', hint: L("Nol daraja nurlar ustma-ust tushganda.", 'Ноль градусов когда лучи совпадают.', 'Zero degrees when the rays coincide.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Nur to'g'ri chiziqqa tik turgan bo'lsa, qo'shni burchaklar nechcha daraja?",
        'Если луч перпендикулярен прямой, сколько градусов смежные углы?',
        'If a ray is perpendicular to a line, how big are the adjacent angles?',
      ),
      ok: L("Yoyilgan burchak teng ikkiga bo'linadi: 90 va 90.", 'Развёрнутый угол делится ровно пополам: 90 и 90.', 'The straight angle splits exactly in half: 90 and 90.'),
      items: [
        { id: 'a', label: '90°', correct: true },
        { id: 'b', label: '45°', tag: 'Z6', hint: L("Qirq besh va qirq besh to'qson beradi, kerak bo'lgani esa 180.", 'Сорок пять и сорок пять дают девяносто, а нужно 180.', 'Forty five and forty five give ninety, but 180 is needed.') },
        { id: 'c', label: '180°', tag: 'Z1', hint: L("Bu ikkovining yig'indisi.", 'Это сумма обоих.', 'That is the sum of both.') },
        { id: 'd', label: '60°', tag: 'Z6', hint: L("Oltmish va oltmish bir yuz yigirma beradi.", 'Шестьдесят и шестьдесят дают сто двадцать.', 'Sixty and sixty give one hundred twenty.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi vertikal burchaklar haqida.", 'Второй про вертикальные углы.', 'The second is about vertical angles.'),
    A('2', "Uchinchisi yoyilgan burchak haqida.", 'Третий про развёрнутый угол.', 'The third is about a straight angle.'),
    A('3', "Oxirgisida nur tik turadi.", 'В последнем луч перпендикулярен.', 'In the last one the ray is perpendicular.'),
  ],
}

// ============================================================
// 15. YAKUN. B7 BLOKI BOSHLANDI.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Qo\'shni 180, vertikal teng', 'Смежные 180, вертикальные равны', 'Adjacent make 180, vertical are equal'),
  gate: S1.gate,
  fix: {
    tokens: ['45°'],
    value: '180',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Qo'shni burchaklar birgalikda yoyilgan burchakni to'ldiradi, u esa 180 daraja. Shuning uchun ikkinchisi 45 daraja bo'ladi.",
    'Смежные углы вместе заполняют развёрнутый, а он равен 180 градусам. Поэтому второй будет 45 градусов.',
    'Adjacent angles together fill a straight angle, which is 180 degrees. So the second is 45 degrees.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    fortyfive: L('45 daraja', '45 градусов', '45 degrees'),
    big: L('225 daraja', '225 градусов', '225 degrees'),
    ninety: L('90 daraja', '90 градусов', '90 degrees'),
    cant: L('bilib bo\'lmaydi', 'узнать нельзя', 'cannot be known'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['135° + 45° → 180°', '45° = 45°', '180 − 62 → 118°', '90° + 90° → 180°'],
  twoLabel: L('B7 bloki boshlandi', 'Блок Б7 начат', 'Block B7 has begun'),
  twoA: L(
    "qo'shni  →  180 daraja",
    'смежные  →  180 градусов',
    'adjacent  →  180 degrees',
  ),
  twoB: L(
    'vertikal  →  teng',
    'вертикальные  →  равны',
    'vertical  →  equal',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'uchburchak va uning turlari',
    'треугольник и виды треугольников',
    'the triangle and its kinds',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish ikki juftdan chiqdi: qo'shni burchaklar 180 beradi, vertikal burchaklar esa teng.", 'Вся сегодняшняя работа вышла из двух пар: смежные дают 180, вертикальные равны.', 'All of today came from two pairs: adjacent give 180, vertical are equal.'),
    A('mount', "Keyingi darsda uch nuqta uchburchak beradi.", 'На следующем уроке три точки дадут треугольник.', 'Next lesson three points will make a triangle.'),
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
