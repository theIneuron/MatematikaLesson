// ============================================================================
// 7-sinf, Dars 47. SIRKUL VA CHIZG'ICH BILAN YASASHLAR.
// (Построения циркулем и линейкой)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// ASBOB YOY CHIZMAYDI -- VA BU DARSGA XALAL BERMAYDI. Sirkulning MA'NOSI
// teng masofalar: bir uchi qadaladi, ikkinchisi bir xil uzoqlikdagi
// nuqtalarni beradi. Shu ma'no klik bilan to'liq beriladi: o'quvchi TENG
// MASOFADAGI tugunni topadi, va aynan shu ish sirkulning ikki yoyi
// kesishishiga teng.
//
// TUGUNLAR YECHIM YAGONA BO'LADIGAN QILIB TANLANGAN. Bu majburiy: asbob
// javobni bitta `pick` bilan solishtiradi, ya'ni ikkinchi to'g'ri javob
// bo'lgan tugun XATO deb belgilanardi va o'quvchi haqsiz jazolanardi.
// Shuning uchun shart ikkita: teng masofa VA masofaning aniq qiymati.
//   3-ekran: A(-3;-1), B(3;-1), P A dan va B dan besh -- faqat (0;3).
//   6-ekran: kesmani o'ngga ko'chirish -- faqat (4;-2).
// Tekshirilgan: qatordagi boshqa tugunlar shartni bajarmaydi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_47'
const LESSON_TITLE = L("Sirkul va chizg'ich bilan yasashlar", 'Построения циркулем и линейкой', 'Constructions with compass and straightedge')
const LESSON_NO = L('47-dars', 'Урок 47', 'Lesson 47')
const BLOCK = { label: L('B7-blok', 'Блок Б7', 'Block B7'), from: 40, to: 48, current: 47 }

const TAGS = {
  Z1: L('sirkul teng masofa beradi', 'циркуль даёт равные расстояния', 'a compass gives equal distances'),
  Z2: L("o'rta perpendikulyar", 'серединный перпендикуляр', 'the perpendicular bisector'),
  Z3: L("teng masofadagi nuqta o'rta deb olindi", 'равноудалённая точка принята за середину', 'an equidistant point taken for the midpoint'),
  Z4: L('yasash va chamalash aralashtirildi', 'построение спутано с прикидкой на глаз', 'a construction confused with eyeballing'),
  Z5: L('yasash mumkin emas', 'построение невозможно', 'the construction is impossible'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Kesmani o'lchamasdan teng ikkiga bo'lish.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('YASASHLAR', 'ПОСТРОЕНИЯ', 'CONSTRUCTIONS'),
  noBack: true,
  noNotes: true,
  title: L('O\'lchamasdan teng ikkiga', 'Пополам без измерения', 'In half without measuring'),
  gate: {
    source: { kind: 'plain', tokens: ['A', '?', 'B'] },
    rows: [
      { tokens: [L('chamalab', 'на глаз', 'by eye')], value: '≈' },
      { tokens: [L('sirkul', 'циркуль', 'compass')], value: '=' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Kesmani chizg'ich bilan o'lchamasdan aynan teng ikkiga bo'lish mumkinmi?",
      'Можно ли разделить отрезок ровно пополам, не измеряя его линейкой?',
      'Can a segment be split exactly in half without measuring it with a ruler?',
    ),
    items: [
      {
        id: 'compass',
        label: L('ha, sirkul bilan aynan', 'да, циркулем ровно', 'yes, exactly with a compass'),
        hint: L(
          "Taxminingiz qabul qilindi. Chizmada tekshiramiz.",
          'Прогноз принят. Проверим на чертеже.',
          'Your prediction is taken. We will check it on the drawing.',
        ),
      },
      {
        id: 'eye',
        label: L('faqat chamalab', 'только на глаз', 'only by eye'),
        hint: L(
          "Chamalash taqriban beradi. Sirkul esa aniq beradi, va buni chizmada ko'rsatamiz.",
          'Прикидка даёт приблизительно. А циркуль даёт точно, и мы это покажем.',
          'Eyeballing gives an estimate. A compass gives it exactly, and we will show that.',
        ),
      },
      {
        id: 'no',
        label: L("yo'q, o'lchash shart", 'нет, измерять обязательно', 'no, measuring is required'),
        hint: L(
          "Shart emas: teng masofa o'lchovsiz ham beriladi.",
          'Не обязательно: равное расстояние получают и без измерения.',
          'Not required: an equal distance can be got without measuring.',
        ),
      },
      {
        id: 'numbers',
        label: L('faqat uzunlik son bo\'lsa', 'только если длина целое число', 'only if the length is a whole number'),
        hint: L(
          "Uzunlik qanday bo'lishidan qat'i nazar ishlaydi: sirkul sonni bilishi kerak emas.",
          'Работает при любой длине: циркулю не нужно знать число.',
          'It works for any length: the compass need not know the number.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Kesma bor, chizg'ich esa yo'q.", 'Есть отрезок, а линейки нет.', 'There is a segment and no ruler.'),
    A('mount', "Uni aynan teng ikkiga bo'lish mumkinmi deb taxmin qilasiz.", 'Как ты думаешь, можно ли разделить его ровно пополам.', 'Do you think it can be split exactly in half.'),
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
  question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Sirkul nima qilishga yaraydi?",
        'Для чего годится циркуль?',
        'What is a compass good for?',
      ),
      ok: L("Bir xil masofadagi nuqtalarni belgilashga.", 'Чтобы отмечать точки на одинаковом расстоянии.', 'To mark points at the same distance.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('teng masofalarni belgilashga', 'отмечать равные расстояния', 'marking equal distances'),
        },
        {
          id: 'b',
          tag: 'Z1',
          label: L('uzunlikni santimetrda o\'lchashga', 'измерять длину в сантиметрах', 'measuring length in centimetres'),
          hint: L("Santimetr chizg'ichda bor, sirkulda esa yo'q.", 'Сантиметры есть на линейке, а на циркуле нет.', 'Centimetres are on a ruler, not on a compass.'),
        },
        {
          id: 'c',
          tag: 'Z1',
          label: L('to\'g\'ri chiziq o\'tkazishga', 'проводить прямые линии', 'drawing straight lines'),
          hint: L("To'g'ri chiziq chizg'ich bilan o'tkaziladi.", 'Прямую проводят линейкой.', 'A line is drawn with a straightedge.'),
        },
        {
          id: 'd',
          tag: 'Z1',
          label: L('burchakni darajada o\'lchashga', 'измерять углы в градусах', 'measuring angles in degrees'),
          hint: L("Daraja transportirda o'lchanadi.", 'Градусы измеряют транспортиром.', 'Degrees are measured with a protractor.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Nuqta A dan ham, B dan ham bir xil uzoqlikda. Bu nimani bildiradi?",
        'Точка одинаково далека и от A, и от B. Что это значит?',
        'A point is equally far from A and from B. What does that mean?',
      ),
      ok: L("Ikki masofa teng: shu nuqtadan A gacha va B gacha bir xil.", 'Два расстояния равны: от этой точки до A и до B одинаково.', 'The two distances are equal: from that point to A and to B alike.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('ikki masofa teng', 'два расстояния равны', 'the two distances are equal'),
        },
        {
          id: 'b',
          tag: 'Z3',
          label: L("u A B ning o'rtasida", 'она в середине A B', 'it is the midpoint of A B'),
          hint: L("O'rta ham shunday, lekin bunday nuqta bittasi emas.", 'Середина тоже такая, но такая точка не одна.', 'The midpoint is one, but such points are many.'),
        },
        {
          id: 'c',
          tag: 'Z1',
          label: L('u A ga tegib turadi', 'она касается A', 'it touches A'),
          hint: L("Masofa nol emas: nuqta chetda tursa ham bo'ladi.", 'Расстояние не ноль: точка может стоять и в стороне.', 'The distance is not zero: the point may stand aside.'),
        },
        {
          id: 'd',
          tag: 'Z1',
          label: L('hech nimani', 'ничего', 'nothing'),
          hint: L("Bildiradi, va bu darsning asosiy fikri.", 'Значит, и это главная мысль урока.', 'It does mean something, and that is the point of the lesson.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Perpendikulyar chiziq bilan qanday burchak hosil qiladi?",
        'Какой угол образует перпендикуляр с линией?',
        'What angle does a perpendicular make with a line?',
      ),
      ok: L("To'g'ri burchak: 90 daraja.", 'Прямой угол: 90 градусов.', 'A right angle: 90 degrees.'),
      items: [
        { id: 'a', label: '90°', correct: true },
        { id: 'b', label: '45°', tag: 'Z2', hint: L("Qirq besh to'g'ri burchakning yarmi.", 'Сорок пять это половина прямого.', 'Forty five is half a right angle.') },
        { id: 'c', label: '180°', tag: 'Z2', hint: L("Bir yuz sakson yoyilgan burchak.", 'Сто восемьдесят это развёрнутый угол.', 'One hundred eighty is a straight angle.') },
        { id: 'd', label: '60°', tag: 'Z2', hint: L("Perpendikulyar aynan to'g'ri burchak beradi.", 'Перпендикуляр даёт именно прямой угол.', 'A perpendicular gives exactly a right angle.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch savol: sirkul, teng masofa va perpendikulyar.", 'Три вопроса: циркуль, равное расстояние и перпендикуляр.', 'Three questions: the compass, equal distance and the perpendicular.'),
    A('1', "Ikkinchisi darsning asosiy fikri.", 'Второй это главная мысль урока.', 'The second is the heart of the lesson.'),
    A('2', "Uchinchisi perpendikulyar haqida.", 'Третий про перпендикуляр.', 'The third is about the perpendicular.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. IKKI TENG MASOFA -- SIRKULNING IKKI YOYI.
// Yechim yagona: (0;3) dan boshqa hech bir tugun ikki shartni
// bir vaqtda bajarmaydi.
// ============================================================
const S3 = {
  kind: 'figure',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Ikki teng masofa', 'Два равных расстояния', 'Two equal distances'),
  pts: { A: { x: -3, y: -1 }, B: { x: 3, y: -1 }, P: { x: 4, y: 3 } },
  seg: [['A', 'B'], ['A', 'P'], ['B', 'P']],
  move: 'P',
  pick: { x: 0, y: 3 },
  show: { sides: true },
  caption: L(
    "P ni shunday joyga qo'yingki, A gacha ham, B gacha ham masofa 5 bo'lsin. Sirkul aynan shu ishni qiladi: bir xil yechilishda ikki yoy chizadi.",
    'Поставь точку P так, чтобы расстояние и до A, и до B было 5. Циркуль делает именно это: одним раствором чертит две дуги.',
    'Place the point P so that the distance to A and to B is 5. That is exactly what a compass does: one setting, two arcs.',
  ),
  options: [
    { id: 'a', label: L('ikki masofa teng bo\'ldi', 'два расстояния стали равны', 'the two distances became equal') },
    { id: 'b', label: L('P kesmaning o\'rtasiga tushdi', 'P попала в середину отрезка', 'P landed at the midpoint') },
    { id: 'c', label: L('bunday nuqta yo\'q edi', 'такой точки не было', 'there was no such point') },
    { id: 'd', label: L('masofalar har xil qoldi', 'расстояния остались разными', 'the distances stayed different') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("O'rta kesmaning ustida yotadi, P esa undan yuqorida turadi.", 'Середина лежит на отрезке, а P стоит выше него.', 'The midpoint lies on the segment, but P stands above it.') },
    { key: 'c', tag: 'Z1', hint: L("Bor edi va siz uni topdingiz: chizmadagi ikki sonni solishtiring.", 'Был, и ты его нашёл: сравни два числа на чертеже.', 'There was, and you found it: compare the two numbers.') },
    { key: 'd', tag: 'Z1', hint: L("Sonlarga qarang: ikkovi ham besh.", 'Посмотри на числа: оба пять.', 'Look at the numbers: both are five.') },
  ],
  note: L(
    "Sirkul faqat bitta ishni qiladi: bir xil masofadagi nuqtalarni beradi. A dan besh va B dan besh -- bu sirkulning ikki yoyi kesishgan joy. Chizg'ich esa bu nuqtalarni chiziq bilan tutashtiradi. Ikkovi birga yasash quroli bo'ladi.",
    'Циркуль делает только одно: даёт точки на одинаковом расстоянии. Пять от A и пять от B — это место, где пересеклись две его дуги. А линейка соединяет такие точки линией. Вдвоём они и есть инструмент построения.',
    'A compass does only one thing: it gives points at an equal distance. Five from A and five from B is where its two arcs meet. The straightedge joins such points with a line. Together they are the construction tool.',
  ),
  audio: [
    A('mount', "A va B nuqtalari qotib turadi.", 'Точки A и B закреплены.', 'The points A and B are fixed.'),
    A('mount', "P ni shunday qo'yingki, ikki masofa ham besh bo'lsin.", 'Поставь P так, чтобы оба расстояния были по пять.', 'Place P so that both distances are five.'),
    A('move', "Ikki sonni solishtiring.", 'Сравни два числа.', 'Compare the two numbers.'),
  ],
}

// ============================================================
// 4. FARQLASH. TENG MASOFADAGI NUQTALAR BITTA CHIZIQDA -- O'RTA
// PERPENDIKULYAR.
// ============================================================
const S4 = {
  kind: 'figure',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Bunday nuqta bittasi emas', 'Такая точка не одна', 'Such a point is not alone'),
  pts: {
    A: { x: -3, y: -1 }, B: { x: 3, y: -1 },
    P: { x: 0, y: 3 }, Q: { x: 0, y: -4 },
  },
  seg: [['A', 'B'], ['A', 'P'], ['B', 'P'], ['A', 'Q'], ['B', 'Q'], ['P', 'Q']],
  show: { sides: true },
  caption: L(
    "P dan A va B gacha masofa teng. Q dan ham teng, lekin masofa boshqa. Ikkovi bir tik chiziqda turadi.",
    'От P до A и B расстояния равны. От Q тоже равны, но расстояние другое. Обе стоят на одной вертикальной линии.',
    'From P the distances to A and B are equal. From Q they are equal too, but different. Both stand on one upright line.',
  ),
  options: [
    { id: 'a', label: L("chiziq A B ga tik va o'rtasidan o'tadi", 'линия перпендикулярна A B и идёт через середину', 'the line is perpendicular to A B and passes through its middle') },
    { id: 'b', label: L('chiziq A B ga parallel', 'линия параллельна A B', 'the line is parallel to A B') },
    { id: 'c', label: L('bu tasodifiy joylashuv', 'это случайное расположение', 'that is a chance arrangement') },
    { id: 'd', label: L('P va Q kesmaning o\'rtasi', 'P и Q это середины отрезка', 'P and Q are midpoints of the segment') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Parallel chiziq A B ni kesmasdi, bu esa uni kesib o'tadi.", 'Параллельная не пересекала бы A B, а эта её пересекает.', 'A parallel line would not cross A B, but this one does.') },
    { key: 'c', tag: 'Z2', hint: L("Tasodif emas: teng masofadagi HAMMA nuqta shu chiziqda yotadi.", 'Не случайность: ВСЕ равноудалённые точки лежат на этой линии.', 'Not chance: EVERY equidistant point lies on that line.') },
    { key: 'd', tag: 'Z3', hint: L("O'rta bittasi va u kesmaning ustida yotadi, P va Q esa chetda.", 'Середина одна и лежит на отрезке, а P и Q в стороне.', 'The midpoint is single and lies on the segment; P and Q are off it.') },
  ],
  note: L(
    "A va B dan teng uzoqlikdagi hamma nuqta bitta chiziqda yotadi. Bu chiziq A B ga TIK va uning O'RTASIDAN o'tadi, va u O'RTA PERPENDIKULYAR deb ataladi. Kesmani teng ikkiga bo'lish uchun aynan shu chiziq o'tkaziladi: shuning uchun sirkul o'lchovsiz aniq ishlaydi.",
    'Все точки, равноудалённые от A и B, лежат на одной линии. Эта линия ПЕРПЕНДИКУЛЯРНА A B и проходит через её СЕРЕДИНУ, и называется она СЕРЕДИННЫМ ПЕРПЕНДИКУЛЯРОМ. Чтобы разделить отрезок пополам, проводят именно её: поэтому циркуль работает точно и без измерения.',
    'All points equidistant from A and B lie on one line. That line is PERPENDICULAR to A B and passes through its MIDDLE, and it is called the PERPENDICULAR BISECTOR. To halve a segment you draw exactly that line: this is why a compass is exact without measuring.',
  ),
  audio: [
    A('mount', "Ikkinchi nuqta qo'shildi: Q ham A va B dan teng uzoqlikda.", 'Добавилась вторая точка: Q тоже равноудалена от A и B.', 'A second point appeared: Q is equidistant from A and B too.'),
    A('mount', "Ikkovi qanday joylashganiga qarang.", 'Посмотри, как они расположены.', 'Look at how the two are arranged.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Chizmasiz: o'rta perpendikulyar sonda.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Chizmasiz', 'Без чертежа', 'Without a drawing'),
  given: L(
    "Kesmaning uzunligi 14. O'rta perpendikulyar o'tkazildi. Uchidan kesishish joyigacha qancha bo'ladi?",
    'Длина отрезка 14. Провели серединный перпендикуляр. Сколько от конца до места пересечения?',
    'A segment is 14 long. The perpendicular bisector is drawn. How far is it from an end to the crossing point?',
  ),
  template: ['14 : 2 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '7' },
    { id: 'b', label: '14' },
    { id: 'c', label: '4' },
    { id: 'd', label: '28' },
  ],
  answer: ['a'],
  prompt: L(
    "Yarim kesmani hisoblang.",
    'Посчитай половину отрезка.',
    'Work out half the segment.',
  ),
  checkNote: L(
    "O'rta perpendikulyar kesmani teng ikkiga bo'ladi, shuning uchun har bo'lagi 7 ga teng. Chizma kerak emas: yasashning natijasi son bilan ham yozib qo'yiladi.",
    'Серединный перпендикуляр делит отрезок пополам, поэтому каждая часть равна 7. Чертёж не нужен: результат построения записывается и числом.',
    'The perpendicular bisector halves the segment, so each part is 7. No drawing needed: the result of a construction can be written as a number too.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("O'n to'rt butun kesma, yarmi esa undan ikki barobar kichik.", 'Четырнадцать это весь отрезок, а половина вдвое меньше.', 'Fourteen is the whole segment, the half is twice smaller.') },
    { key: 'c', tag: 'Z6', hint: L("O'n to'rt ikkiga bo'linsa yetti chiqadi.", 'Четырнадцать делить на два это семь.', 'Fourteen divided by two is seven.') },
    { key: 'd', tag: 'Z6', hint: L("Bo'linadi, ko'paytirilmaydi.", 'Делят, а не умножают.', 'Divide, do not multiply.') },
  ],
  audio: [
    A('mount', "Chizma yo'q, yasashning natijasi esa son bilan yoziladi.", 'Чертежа нет, а результат построения записывается числом.', 'No drawing, and the result of the construction is written as a number.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. KESMANI KO'CHIRISH -- SIRKULNING BIRINCHI ISHI.
// Yechim yagona: shart «o'ngga» deb aytilgan, va (4;-2) dan boshqa
// tugun uchni ham qatorda, ham uch masofada bermaydi.
// ============================================================
const S6 = {
  kind: 'figure',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Kesmani ko\'chiring', 'Перенеси отрезок', 'Copy the segment'),
  pts: {
    A: { x: -5, y: 2 }, B: { x: -2, y: 2 },
    C: { x: 1, y: -2 }, D: { x: 3, y: -3 },
  },
  seg: [['A', 'B'], ['C', 'D']],
  move: 'D',
  pick: { x: 4, y: -2 },
  show: { sides: true },
  caption: L(
    "A B kesmasi berilgan. D nuqtasini C dan O'NGGA, xuddi shu qatorga qo'yingki, C D kesmasi A B ga teng bo'lsin.",
    'Дан отрезок A B. Поставь точку D справа от C, в том же ряду, так чтобы отрезок C D был равен A B.',
    'The segment A B is given. Place D to the right of C, in the same row, so that C D equals A B.',
  ),
  options: [
    { id: 'a', label: L("kesmalar teng bo'ldi, o'lchovsiz", 'отрезки стали равны, без измерения', 'the segments became equal, with no measuring') },
    { id: 'b', label: L('C D uzunroq chiqdi', 'C D вышел длиннее', 'C D came out longer') },
    { id: 'c', label: L("kesmalar bir chiziqda yotadi", 'отрезки лежат на одной прямой', 'the segments lie on one line') },
    { id: 'd', label: L('teng qilib bo\'lmaydi', 'сделать равными нельзя', 'they cannot be made equal') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Chizmadagi ikki songa qarang: ikkovi ham uch.", 'Посмотри на два числа: оба три.', 'Look at the two numbers: both are three.') },
    { key: 'c', tag: 'Z1', hint: L("Ular boshqa-boshqa qatorda: biri yuqorida, ikkinchisi pastda.", 'Они в разных рядах: один выше, другой ниже.', 'They are in different rows: one above, one below.') },
    { key: 'd', tag: 'Z1', hint: L("Bo'ladi: siz hozir shuni qildingiz.", 'Можно: ты это только что сделал.', 'It can be done: you just did it.') },
  ],
  note: L(
    "Sirkulning birinchi ishi -- kesmani ko'chirish. Yechilishi A B ga to'g'rilanadi, keyin uchi C ga qadaladi, va yoy D nuqtasini beradi. Uzunlik sonda bilinmasa ham ish bajariladi: sirkul son bilan emas, masofa bilan ishlaydi.",
    'Первое дело циркуля это перенос отрезка. Раствор настраивают по A B, ножку ставят в C, и дуга даёт точку D. Работа выполняется, даже если длина в числах неизвестна: циркуль работает не с числом, а с расстоянием.',
    'The first job of a compass is copying a segment. Set the opening to A B, put the point at C, and the arc gives D. It works even when the length is unknown as a number: a compass works with distance, not with numbers.',
  ),
  audio: [
    A('mount', "Yuqorida A B kesmasi turadi, pastda esa C nuqtasi.", 'Сверху отрезок A B, а снизу точка C.', 'Above is the segment A B, below is the point C.'),
    A('mount', "D ni o'ngga, xuddi shu qatorga qo'ying.", 'Поставь D справа, в том же ряду.', 'Place D to the right, in the same row.'),
    A('move', "Ikki uzunlikni solishtiring.", 'Сравни две длины.', 'Compare the two lengths.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT. YOYLAR KESISHMAYDI -- YASASH MUMKIN EMAS.
// ============================================================
const S7 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Yoylar uchrashmadi', 'Дуги не встретились', 'The arcs did not meet'),
  given: L(
    "Tomonlari 2, 3 va 6 bo'lgan uchburchak yasashga urindik: asosga 6 qo'yildi, keyin bir uchidan 2 radiusli yoy, ikkinchisidan 3 radiusli yoy chizildi. Ikki yoyning yig'indisi nechchi?",
    'Мы попробовали построить треугольник со сторонами 2, 3 и 6: отложили основание 6, потом из одного конца дугу радиусом 2, из другого радиусом 3. Сколько в сумме дают два радиуса?',
    'We tried to build a triangle with sides 2, 3 and 6: we laid the base 6, then drew an arc of radius 2 from one end and 3 from the other. What do the two radii add to?',
  ),
  template: ['2 + 3 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '5' },
    { id: 'b', label: '6' },
    { id: 'c', label: '11' },
    { id: 'd', label: '1' },
  ],
  answer: ['a'],
  prompt: L(
    "Radiuslarning yig'indisini hisoblang.",
    'Посчитай сумму радиусов.',
    'Work out the sum of the radii.',
  ),
  checkNote: L(
    "Yig'indi 5 chiqdi, asos esa 6. Yoylar bir-biriga yetmadi va kesishmadi, demak uchburchak yasab bo'lmaydi. Yasash mumkin emasligini sirkulning o'zi ko'rsatib beradi: chizmada yoylar orasida bo'shliq qoladi.",
    'Сумма вышла 5, а основание 6. Дуги не дотянулись друг до друга и не пересеклись, значит треугольник построить нельзя. Невозможность построения показывает сам циркуль: на чертеже между дугами остаётся зазор.',
    'The sum is 5 while the base is 6. The arcs did not reach each other and never met, so the triangle cannot be built. The compass itself shows the impossibility: a gap is left between the arcs.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Ikki qo'shuv uch besh bo'ladi, olti esa asos.", 'Два плюс три это пять, а шесть это основание.', 'Two plus three is five, and six is the base.') },
    { key: 'c', tag: 'Z6', hint: L("Radiuslar qo'shiladi, asos esa qo'shilmaydi.", 'Складывают радиусы, а основание не складывают.', 'Add the radii; the base is not added.') },
    { key: 'd', tag: 'Z6', hint: L("Ayirma emas, yig'indi so'ralgan.", 'Спрашивают сумму, а не разность.', 'The sum is asked for, not the difference.') },
  ],
  audio: [
    A('mount', "Chegaraviy holat: yoylar uchrashmasligi mumkin.", 'Граничный случай: дуги могут не встретиться.', 'The edge case: the arcs may fail to meet.'),
    A('mount', "Ikki radiusni qo'shib, asos bilan solishtiring.", 'Сложи два радиуса и сравни с основанием.', 'Add the two radii and compare with the base.'),
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
    { id: 'f1', label: L('sirkul teng masofadagi nuqtalarni beradi', 'циркуль даёт точки на равном расстоянии', 'a compass gives points at an equal distance') },
    { id: 'f2', label: L("chizg'ich esa ularni tutashtiradi", 'а линейка их соединяет', 'and the straightedge joins them') },
    { id: 'f3', label: L('A va B dan teng uzoqlikdagi nuqtalar', 'точки, равноудалённые от A и B', 'the points equidistant from A and B') },
    { id: 'f4', label: L("o'rta perpendikulyarda yotadi", 'лежат на серединном перпендикуляре', 'lie on the perpendicular bisector') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval ikki qurol nima qilishi, keyin teng masofadagi nuqtalar va ular qayerda yotishi.",
    'Порядок нарушен. Сначала что делают два инструмента, потом равноудалённые точки и где они лежат.',
    'The order is off. What the two tools do first, then the equidistant points and where they lie.',
  ),
  lawChips: [
    { label: '=', tone: 's2' },
    { label: '90°', tone: 's1' },
    { label: '2', tone: 'off' },
    { label: '( )', tone: 'par' },
  ],
  lawSweep: L(
    "tenglik, to'g'ri burchak, ikkiga bo'linish, juftlik",
    'равенство, прямой угол, деление пополам, пара',
    'equality, the right angle, halving, the pair',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Yasashda faqat ikki qurol bor: SIRKUL teng masofadagi nuqtalarni beradi, CHIZG'ICH ularni chiziq bilan tutashtiradi. Chizg'ichdagi santimetrlar va transportirdagi darajalar yasashda ishlatilmaydi.",
        'В построении есть только два инструмента: ЦИРКУЛЬ даёт точки на равном расстоянии, ЛИНЕЙКА соединяет их линией. Сантиметры на линейке и градусы транспортира в построении не используются.',
        'A construction has only two tools: the COMPASS gives points at an equal distance, the STRAIGHTEDGE joins them with a line. Centimetres on the ruler and degrees on the protractor are not used.',
      ),
      L(
        "A va B dan teng uzoqlikdagi hamma nuqta O'RTA PERPENDIKULYARDA yotadi: u A B ga tik va uning o'rtasidan o'tadi. Shuning uchun kesmani o'lchamasdan aynan teng ikkiga bo'lish mumkin. Agar yoylar uchrashmasa, yasash mumkin emas -- va sirkul buni o'zi ko'rsatadi.",
        'Все точки, равноудалённые от A и B, лежат на СЕРЕДИННОМ ПЕРПЕНДИКУЛЯРЕ: он перпендикулярен A B и проходит через её середину. Поэтому отрезок можно разделить ровно пополам без измерения. А если дуги не встретились, построение невозможно — и циркуль сам это показывает.',
        'All points equidistant from A and B lie on the PERPENDICULAR BISECTOR: it is perpendicular to A B and passes through its middle. So a segment can be halved exactly without measuring. And if the arcs fail to meet, the construction is impossible — the compass shows that itself.',
      ),
    ],
  },
  hookCap: L(
    'Sirkul  --  teng masofa',
    'Циркуль — равное расстояние',
    'The compass — equal distance',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('sirkul  --  masofa', 'циркуль это расстояние', 'the compass means distance'),
    L("chizg'ich  --  chiziq", 'линейка это линия', 'the straightedge means a line'),
    L("teng uzoqlik  --  o'rta perpendikulyar", 'равноудалённость это серединный перпендикуляр', 'equidistance means the bisector'),
  ],
  audio: [
    A('mount', "Ikki qurolni va bitta chiziqni ko'rdik. Endi qoidani yig'amiz.", 'Мы увидели два инструмента и одну линию. Теперь соберём правило.', 'We saw two tools and one line. Now let us build the rule.'),
    A('ok', "To'g'ri. Sirkul son bilan emas, masofa bilan ishlaydi.", 'Верно. Циркуль работает не с числом, а с расстоянием.', 'Correct. A compass works with distance, not with numbers.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Yasash bo\'yicha', 'По построению', 'About constructions'),
  question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Kesma 18 ga teng. O'rta perpendikulyar undan qanday bo'lak ajratadi?",
        'Отрезок равен 18. Какую часть отсекает от него серединный перпендикуляр?',
        'A segment is 18. What part does the perpendicular bisector cut off?',
      ),
      ok: L("To'qqiz: teng ikkiga bo'linadi.", 'Девять: делится пополам.', 'Nine: it is halved.'),
      items: [
        { id: 'a', label: '9', correct: true },
        { id: 'b', label: '18', tag: 'Z2', hint: L("O'n sakkiz butun kesma.", 'Восемнадцать это весь отрезок.', 'Eighteen is the whole segment.') },
        { id: 'c', label: '6', tag: 'Z6', hint: L("Ikkiga bo'linadi, uchga emas.", 'Делят на два, а не на три.', 'Halve it, do not divide by three.') },
        { id: 'd', label: '36', tag: 'Z6', hint: L("Bo'linadi, ko'paytirilmaydi.", 'Делят, а не умножают.', 'Divide, do not multiply.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Nuqta A va B dan teng uzoqlikda. U albatta kesmaning o'rtasimi?",
        'Точка равноудалена от A и B. Обязательно ли она середина отрезка?',
        'A point is equidistant from A and B. Must it be the midpoint?',
      ),
      ok: L("Yo'q: o'rta perpendikulyarning istalgan nuqtasi bo'lishi mumkin.", 'Нет: это может быть любая точка серединного перпендикуляра.', 'No: it may be any point of the perpendicular bisector.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z3', label: L('ha', 'да', 'yes'), hint: L("Chizmada P ham, Q ham teng uzoqlikda edi, lekin ikkovi ham o'rta emas.", 'На чертеже и P, и Q были равноудалены, но серединой не были.', 'On the drawing both P and Q were equidistant, and neither was the midpoint.') },
        { id: 'c', tag: 'Z3', label: L('faqat kesma ustida bo\'lsa', 'только если она на отрезке', 'only if it lies on the segment'), hint: L("Kesma ustida bo'lsa u haqiqatda o'rta, lekin savol «albatta» degan edi.", 'Если на отрезке, она действительно середина, но вопрос был про обязательность.', 'On the segment it is indeed the midpoint, but the question asked whether it must be.') },
        { id: 'd', tag: 'Z3', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'), hint: L("Bilish mumkin: teng uzoqlik o'rtani talab qilmaydi.", 'Можно: равноудалённость середины не требует.', 'It can: equidistance does not require the midpoint.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Yasashda transportirdan foydalanish mumkinmi?",
        'Можно ли в построении пользоваться транспортиром?',
        'May a protractor be used in a construction?',
      ),
      ok: L("Yo'q: yasashda faqat sirkul va chizg'ich ishlatiladi.", 'Нет: в построении используют только циркуль и линейку.', 'No: only compass and straightedge are used.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z4', label: L('ha', 'да', 'yes'), hint: L("Transportir o'lchaydi, yasash esa o'lchovsiz bajariladi.", 'Транспортир измеряет, а построение выполняется без измерения.', 'A protractor measures, and a construction is done without measuring.') },
        { id: 'c', tag: 'Z4', label: L('faqat burchak uchun', 'только для углов', 'only for angles'), hint: L("Teng burchak ham sirkul bilan yasaladi.", 'Равный угол тоже строят циркулем.', 'An equal angle is built with a compass too.') },
        { id: 'd', tag: 'Z4', label: L('faqat tekshirish uchun', 'только для проверки', 'only for checking'), hint: L("Tekshirish mumkin, lekin u yasashning bir qismi bo'lmaydi.", 'Проверить можно, но частью построения это не станет.', 'Checking is allowed, but it is not part of the construction.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Tomonlari 4, 4 va 9 bo'lgan uchburchakni yasash mumkinmi?",
        'Можно ли построить треугольник со сторонами 4, 4 и 9?',
        'Can a triangle with sides 4, 4 and 9 be built?',
      ),
      ok: L("Yo'q: to'rt qo'shuv to'rt sakkiz, u esa to'qqizdan kichik va yoylar uchrashmaydi.", 'Нет: четыре плюс четыре это восемь, а это меньше девяти, и дуги не встретятся.', 'No: four plus four is eight, less than nine, and the arcs never meet.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z5', label: L('ha', 'да', 'yes'), hint: L("Radiuslarning yig'indisi asosdan kichik chiqdi.", 'Сумма радиусов вышла меньше основания.', 'The radii add to less than the base.') },
        { id: 'c', tag: 'Z5', label: L('ha, teng yonli bo\'ladi', 'да, будет равнобедренным', 'yes, it would be isosceles'), hint: L("Ikki tomoni teng, lekin uchburchakning o'zi chiqmaydi.", 'Две стороны равны, но самого треугольника не выйдет.', 'Two sides are equal, but the triangle itself will not appear.') },
        { id: 'd', tag: 'Z5', label: L('katta sirkul kerak', 'нужен большой циркуль', 'a bigger compass is needed'), hint: L("Sirkulning kattaligi yordam bermaydi: masofa yetmaydi.", 'Размер циркуля не поможет: не хватает расстояния.', 'The size of the compass will not help: the distance falls short.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ikkinchisi teng uzoqlik haqida.", 'Четыре вопроса. Второй про равноудалённость.', 'Four questions. The second is about equidistance.'),
    A('1', "Ikkinchisida diqqat bo'ling.", 'Во втором будь внимателен.', 'Be careful in the second.'),
    A('2', "Uchinchisi qurollar haqida.", 'Третий про инструменты.', 'The third is about the tools.'),
    A('3', "Oxirgisida radiuslarni qo'shing.", 'В последнем сложи радиусы.', 'In the last one add the radii.'),
  ],
}

// ============================================================
// 10. MASHQ 2. IKKI QADAM.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Yasash mumkinmi', 'Возможно ли построение', 'Is the construction possible'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Asos 10 ga teng, yoylarning radiuslari 6 va 7. Radiuslarning yig'indisini toping va yasash mumkinmi degan savolga javob bering.",
    'Основание равно 10, радиусы дуг 6 и 7. Найди сумму радиусов и ответь, возможно ли построение.',
    'The base is 10 and the arc radii are 6 and 7. Find the sum of the radii and say whether the construction is possible.',
  ),
  template: ['6 + 7 = ', { slot: 0 }, ',   ', { slot: 1 }],
  parts: [
    { id: 'a', label: '13' },
    { id: 'b', label: L('yoylar kesishadi', 'дуги пересекутся', 'the arcs will meet') },
    { id: 'c', label: '10' },
    { id: 'd', label: L('yoylar kesishmaydi', 'дуги не пересекутся', 'the arcs will not meet') },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Yig'indini va xulosani yozing.",
    'Запиши сумму и вывод.',
    'Write the sum and the conclusion.',
  ),
  checkNote: L(
    "Yig'indi 13 chiqdi, asos esa 10. Yig'indi asosdan katta, demak yoylar kesishadi va uchburchak yasaladi.",
    'Сумма вышла 13, а основание 10. Сумма больше основания, значит дуги пересекутся и треугольник построится.',
    'The sum is 13 and the base is 10. The sum beats the base, so the arcs meet and the triangle is built.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Olti qo'shuv yetti o'n uch bo'ladi. O'n bu asos.", 'Шесть плюс семь это тринадцать. Десять это основание.', 'Six plus seven is thirteen. Ten is the base.') },
    { key: 'd', tag: 'Z5', hint: L("Yig'indi asosdan katta, demak yoylar bir-biriga yetadi.", 'Сумма больше основания, значит дуги дотянутся друг до друга.', 'The sum beats the base, so the arcs do reach.') },
    { key: '*', tag: 'Z5', hint: L("Avval yig'indi, keyin uni asos bilan solishtirish.", 'Сначала сумма, потом сравнение с основанием.', 'The sum first, then compare it with the base.') },
  ],
  probe: {
    question: L("Chiqqan uchburchak turi qanday?", 'Какого вида получившийся треугольник?', 'What kind is the resulting triangle?'),
    items: [
      { id: 'a', correct: true, label: L('turli tomonli', 'разносторонний', 'scalene') },
      { id: 'b', tag: 'Z6', label: L('teng yonli', 'равнобедренный', 'isosceles'), hint: L("Uchta son ham har xil: o'n, olti va yetti.", 'Все три числа разные: десять, шесть и семь.', 'All three numbers differ: ten, six and seven.') },
      { id: 'c', tag: 'Z6', label: L('teng tomonli', 'равносторонний', 'equilateral'), hint: L("Teng tomonlida uchtasi bir xil bo'lardi.", 'В равностороннем все три были бы одинаковы.', 'In an equilateral one all three would match.') },
      { id: 'd', tag: 'Z5', label: L('yasab bo\'lmaydi', 'не построится', 'it will not be built'), hint: L("Yasaladi: yig'indi asosdan katta.", 'Построится: сумма больше основания.', 'It will: the sum beats the base.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam: yig'indi va xulosa.", 'Два шага: сумма и вывод.', 'Two steps: the sum and the conclusion.'),
    A('two', "Endi asos bilan solishtiring.", 'Теперь сравни с основанием.', 'Now compare with the base.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Yoylar yetadimi', 'Дотянутся ли дуги', 'Will the arcs reach'),
  given: L(
    "Asos 12, yoylarning radiuslari 5 va 6. Yasash mumkinmi?",
    'Основание 12, радиусы дуг 5 и 6. Возможно ли построение?',
    'The base is 12 and the arc radii are 5 and 6. Is the construction possible?',
  ),
  template: ['5 + 6 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '11' },
    { id: 'b', label: '12' },
    { id: 'c', label: '13' },
    { id: 'd', label: '1' },
  ],
  answer: ['a'],
  prompt: L(
    "Radiuslarning yig'indisini yozing.",
    'Запиши сумму радиусов.',
    'Write the sum of the radii.',
  ),
  checkNote: L(
    "Yig'indi 11, asos esa 12. Yig'indi asosdan KICHIK, demak yoylar uchrashmaydi va yasash mumkin emas.",
    'Сумма 11, а основание 12. Сумма МЕНЬШЕ основания, значит дуги не встретятся и построение невозможно.',
    'The sum is 11 and the base is 12. The sum is LESS than the base, so the arcs never meet and the construction is impossible.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Besh qo'shuv olti o'n bir bo'ladi. O'n ikki bu asos.", 'Пять плюс шесть это одиннадцать. Двенадцать это основание.', 'Five plus six is eleven. Twelve is the base.') },
    { key: 'c', tag: 'Z6', hint: L("Qo'shishni tekshiring.", 'Проверь сложение.', 'Check the addition.') },
    { key: 'd', tag: 'Z6', hint: L("Yig'indi so'ralgan, ayirma emas.", 'Спрашивают сумму, а не разность.', 'The sum is asked for, not the difference.') },
  ],
  audio: [
    A('mount', "Bu safar yordam yo'q. Yig'indini asos bilan solishtiring.", 'На этот раз без помощи. Сравни сумму с основанием.', 'No help this time. Compare the sum with the base.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). TENG UZOQLIK O'RTA DEB OLINGAN.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Yasash to'g'ri bajarilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Построение выполнено верно. И всё же какая строка ошибочна?',
    'The construction is done correctly. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('sirkul bilan P nuqtasi topildi', 'циркулем нашли точку P', 'the point P was found with a compass') },
    { id: 'r2', text: L('P dan A gacha va B gacha 5', 'от P до A и до B по 5', 'from P to A and to B it is 5') },
    { id: 'r3', text: L("teng uzoqlikdagi nuqta -- kesmaning o'rtasi", 'равноудалённая точка это середина отрезка', 'an equidistant point is the midpoint') },
    { id: 'r4', text: L("P kesmaning o'rtasi", 'P это середина отрезка', 'P is the midpoint') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu yasashning qadami.", 'Это шаг построения.', 'That is a step of the construction.'),
    r2: L("To'g'ri: ikki masofa ham besh, demak P teng uzoqlikda.", 'Верно: оба расстояния по пять, значит P равноудалена.', 'Right: both distances are five, so P is equidistant.'),
    r4: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z1', r2: 'Z1', r4: 'Z3' },
  proofFill: {
    template: [{ slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: L("P o'rta perpendikulyarda", 'P на серединном перпендикуляре', 'P is on the perpendicular bisector') },
      { id: 'b', label: L("o'rta esa kesma ustida", 'а середина на отрезке', 'and the midpoint is on the segment') },
      { id: 'c', label: L("P kesma ustida", 'P на отрезке', 'P is on the segment') },
      { id: 'd', label: L("o'rta ham teng uzoqlikda emas", 'а середина не равноудалена', 'and the midpoint is not equidistant') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "P qayerda ekanini va o'rta qayerda ekanini yozing.",
      'Запиши, где P и где середина.',
      'Write where P is and where the midpoint is.',
    ),
    checkNote: L(
      "Teng uzoqlik o'rta perpendikulyarni beradi, o'rtani esa yo'q. O'rta -- shu perpendikulyarning kesma bilan kesishgan YAGONA nuqtasi, P esa undan yuqorida turadi.",
      'Равноудалённость даёт серединный перпендикуляр, но не середину. Середина это ЕДИНСТВЕННАЯ точка этого перпендикуляра на самом отрезке, а P стоит выше.',
      'Equidistance gives the perpendicular bisector, not the midpoint. The midpoint is the ONE point of that bisector lying on the segment; P stands above it.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z3', hint: L("Chizmada P kesmadan yuqorida turgan edi.", 'На чертеже P стояла выше отрезка.', 'On the drawing P stood above the segment.') },
      { key: 'd', tag: 'Z3', hint: L("O'rta ham teng uzoqlikda: u shu chiziqning bir nuqtasi.", 'Середина тоже равноудалена: она точка той же линии.', 'The midpoint is equidistant too: it is a point of the same line.') },
      { key: '*', tag: 'Z3', hint: L("Teng uzoqlikdagi nuqta bittasi emas.", 'Равноудалённая точка не одна.', 'The equidistant point is not unique.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda yasash to'g'ri bajarilgan.", 'В этой ловушке построение выполнено верно.', 'In this trap the construction is done correctly.'),
    A('mount', "Lekin oxirgi qatorda nuqta boshqacha nomlangan.", 'Но в последней строке точку назвали иначе.', 'But the last line names the point wrongly.'),
    A('proof', "Topdingiz. Teng uzoqlik o'rtani bermaydi.", 'Нашёл. Равноудалённость середины не даёт.', 'You found it. Equidistance does not give the midpoint.'),
    A('done', "O'rta -- perpendikulyarning kesma ustidagi nuqtasi.", 'Середина это точка перпендикуляра на самом отрезке.', 'The midpoint is where the bisector meets the segment.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. ARQON BILAN BELGILASH.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Arqon bilan belgilash', 'Разметка верёвкой', 'Marking out with a rope'),
  given: L(
    "Bog'da ikki qoziq orasidagi masofa 16 qadam. Bog'bon arqonni ikkidan buklab, o'rtasini topdi. Qoziqdan o'rtagacha nechcha qadam?",
    'В саду между двумя колышками 16 шагов. Садовник сложил верёвку вдвое и нашёл середину. Сколько шагов от колышка до середины?',
    'In a garden two pegs are 16 paces apart. The gardener folded the rope in two and found the middle. How many paces from a peg to the middle?',
  ),
  template: ['16 : 2 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '8' },
    { id: 'b', label: '16' },
    { id: 'c', label: '4' },
    { id: 'd', label: '32' },
  ],
  answer: ['a'],
  prompt: L(
    "Masofani qadamda yozing.",
    'Запиши расстояние в шагах.',
    'Write the distance in paces.',
  ),
  checkNote: L(
    "Ikkidan buklangan arqon sirkulning o'rnini bosadi: u ikki qoziqdan teng masofani beradi. Bog'bon qadamlarni sanamadi ham, lekin o'rtani aynan topdi: 8 qadam.",
    'Сложенная вдвое верёвка заменяет циркуль: она даёт равное расстояние от двух колышков. Садовник даже не считал шаги, а середину нашёл точно: 8 шагов.',
    'A rope folded in two replaces a compass: it gives an equal distance from both pegs. The gardener never counted paces and still found the middle exactly: 8 paces.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("O'n olti butun masofa, yarmi esa undan ikki barobar kichik.", 'Шестнадцать это всё расстояние, а половина вдвое меньше.', 'Sixteen is the whole distance, the half is twice smaller.') },
    { key: 'c', tag: 'Z6', hint: L("O'n oltining yarmi sakkiz.", 'Половина шестнадцати это восемь.', 'Half of sixteen is eight.') },
    { key: 'd', tag: 'Z6', hint: L("Bo'linadi, ko'paytirilmaydi.", 'Делят, а не умножают.', 'Divide, do not multiply.') },
  ],
  audio: [
    A('mount', "Bog'da sirkul yo'q, arqon esa bor.", 'В саду циркуля нет, а верёвка есть.', 'There is no compass in the garden, but there is a rope.'),
    A('mount', "Ikkidan buklangan arqon teng masofani beradi.", 'Сложенная вдвое верёвка даёт равное расстояние.', 'A rope folded in two gives an equal distance.'),
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
        "Sirkul nima beradi?",
        'Что даёт циркуль?',
        'What does a compass give?',
      ),
      ok: L("Teng masofadagi nuqtalarni.", 'Точки на равном расстоянии.', 'Points at an equal distance.'),
      items: [
        { id: 'a', correct: true, label: L('teng masofa', 'равное расстояние', 'an equal distance') },
        { id: 'b', tag: 'Z1', label: L('santimetr', 'сантиметры', 'centimetres'), hint: L("Santimetr chizg'ichda.", 'Сантиметры на линейке.', 'Centimetres are on the ruler.') },
        { id: 'c', tag: 'Z1', label: L('daraja', 'градусы', 'degrees'), hint: L("Daraja transportirda.", 'Градусы на транспортире.', 'Degrees are on the protractor.') },
        { id: 'd', tag: 'Z1', label: L("to'g'ri chiziq", 'прямую линию', 'a straight line'), hint: L("Chiziqni chizg'ich beradi.", 'Линию даёт линейка.', 'The line comes from the straightedge.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "A va B dan teng uzoqlikdagi nuqtalar nimani hosil qiladi?",
        'Что образуют точки, равноудалённые от A и B?',
        'What do the points equidistant from A and B form?',
      ),
      ok: L("O'rta perpendikulyarni.", 'Серединный перпендикуляр.', 'The perpendicular bisector.'),
      items: [
        { id: 'a', correct: true, label: L("o'rta perpendikulyar", 'серединный перпендикуляр', 'the perpendicular bisector') },
        { id: 'b', tag: 'Z3', label: L("bitta o'rta nuqta", 'одну точку середины', 'a single midpoint'), hint: L("Bunday nuqta ko'p, ular chiziq hosil qiladi.", 'Таких точек много, они образуют линию.', 'There are many such points and they form a line.') },
        { id: 'c', tag: 'Z2', label: L('A B ga parallel chiziq', 'прямую, параллельную A B', 'a line parallel to A B'), hint: L("Chiziq A B ni kesib o'tadi, demak parallel emas.", 'Линия пересекает A B, значит не параллельна.', 'The line crosses A B, so it is not parallel.') },
        { id: 'd', tag: 'Z2', label: L('aylana', 'окружность', 'a circle'), hint: L("Aylana bitta nuqtadan teng uzoqlikda bo'ladi, bu yerda esa ikkitasi.", 'Окружность равноудалена от одной точки, а здесь их две.', 'A circle is equidistant from one point; here there are two.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Kesma 24 ga teng. O'rtasidan uchigacha qancha?",
        'Отрезок равен 24. Сколько от середины до конца?',
        'A segment is 24. How far from the middle to an end?',
      ),
      ok: L("O'n ikki.", 'Двенадцать.', 'Twelve.'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '24', tag: 'Z2', hint: L("Yigirma to'rt butun kesma.", 'Двадцать четыре это весь отрезок.', 'Twenty four is the whole segment.') },
        { id: 'c', label: '8', tag: 'Z6', hint: L("Ikkiga bo'linadi, uchga emas.", 'Делят на два, а не на три.', 'Halve it, do not divide by three.') },
        { id: 'd', label: '48', tag: 'Z6', hint: L("Bo'linadi, ko'paytirilmaydi.", 'Делят, а не умножают.', 'Divide, do not multiply.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Asos 9, radiuslar 4 va 4. Yoylar kesishadimi?",
        'Основание 9, радиусы 4 и 4. Пересекутся ли дуги?',
        'The base is 9 and the radii are 4 and 4. Will the arcs meet?',
      ),
      ok: L("Yo'q: to'rt qo'shuv to'rt sakkiz, u esa to'qqizga yetmaydi.", 'Нет: четыре плюс четыре это восемь, а до девяти не дотягивает.', 'No: four plus four is eight, short of nine.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z5', label: L('ha', 'да', 'yes'), hint: L("Yig'indi asosdan kichik.", 'Сумма меньше основания.', 'The sum is less than the base.') },
        { id: 'c', tag: 'Z5', label: L('bir nuqtada tegadi', 'коснутся в одной точке', 'they touch at one point'), hint: L("Tegishi yig'indi asosga TENG bo'lganda bo'ladi, bu yerda esa kichik.", 'Касание бывает, когда сумма РАВНА основанию, а здесь она меньше.', 'Touching happens when the sum EQUALS the base; here it is less.') },
        { id: 'd', tag: 'Z5', label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'), hint: L("Bilish mumkin: qo'shib solishtirish yetarli.", 'Можно: достаточно сложить и сравнить.', 'It can: adding and comparing is enough.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран.', 'Quick round, four questions. The only graded screen.'),
    A('1', "Ikkinchisi teng uzoqlik haqida.", 'Второй про равноудалённость.', 'The second is about equidistance.'),
    A('2', "Uchinchisi yarim kesma haqida.", 'Третий про половину отрезка.', 'The third is about half a segment.'),
    A('3', "Oxirgisida radiuslarni qo'shing.", 'В последнем сложи радиусы.', 'In the last one add the radii.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Sirkul o\'lchamaydi, lekin aniq', 'Циркуль не измеряет, но точен', 'A compass does not measure, yet it is exact'),
  gate: S1.gate,
  fix: {
    tokens: [L('sirkul', 'циркуль', 'compass')],
    value: '=',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Chamalash taqriban beradi, sirkul esa aniq. Teng masofadagi nuqtalar o'rta perpendikulyarni hosil qiladi, va u kesmani aynan teng ikkiga bo'ladi.",
    'Прикидка даёт приблизительно, а циркуль точно. Точки на равном расстоянии образуют серединный перпендикуляр, и он делит отрезок ровно пополам.',
    'Eyeballing is approximate, a compass is exact. Points at an equal distance form the perpendicular bisector, and it halves the segment exactly.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    compass: L('ha, sirkul bilan aynan', 'да, циркулем ровно', 'yes, exactly with a compass'),
    eye: L('faqat chamalab', 'только на глаз', 'only by eye'),
    no: L("o'lchash shart", 'измерять обязательно', 'measuring is required'),
    numbers: L('faqat butun son bo\'lsa', 'только при целом числе', 'only for a whole number'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['5 = 5', '14 : 2 = 7', '3 = 3', '2 + 3 < 6'],
  twoLabel: L('Ikki qurol', 'Два инструмента', 'Two tools'),
  twoA: L(
    'sirkul  →  teng masofa',
    'циркуль  →  равное расстояние',
    'the compass  →  equal distance',
  ),
  twoB: L(
    "chizg'ich  →  chiziq",
    'линейка  →  линия',
    'the straightedge  →  the line',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'B7 blokining yakuniy takrorlashi',
    'итоговое повторение блока Б7',
    'the wrap-up of block B7',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Sirkul sonni bilmaydi, lekin teng masofani aynan beradi.", 'Циркуль не знает числа, но равное расстояние даёт точно.', 'A compass knows no numbers, yet it gives an equal distance exactly.'),
    A('mount', "Keyingi dars butun blokni bir joyga yig'adi.", 'Следующий урок соберёт весь блок вместе.', 'The next lesson gathers the whole block together.'),
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
