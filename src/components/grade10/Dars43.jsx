// ============================================================================
// 10-sinf, Dars 43. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS43_KONTENT.md
// Ma'lumot (ovoz, kadrlar, variantlar, razborlar, qoida, yakun) tayyor.
// EKRAN TANALARI esa `TODO` bo'lib qoldi: asbob va figurani tanlash --
// matematik qaror, va u avtomatlashtirilmaydi (etalon §5.3).
//
// Tartib: tanalarni to'ldirish, keyin `grade10-lesson-audit.mjs`, keyin
// tez yarus (2 o'lcham), keyin to'liq prognon. Har yangi figura oldin
// `probe/figures.html` stendida suratga olinadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Col, Cols, Expr, L, Panel, Slot } from './core.jsx'
import {
  A,
  BlitzBody,
  HookBody,
  RuleBody,
  Screen,
  SummaryBody,
  makeLesson,
} from './screens.jsx'
import {
  AuditRows,
  MatchPairs,
  MultiPick,
  NoteList,
  NumberEntry,
  OrderRow,
  ProbeChain,
  ProofRows,
  Scene,
  SpinScene,
} from './tools.jsx'

import { Space } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 43
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Ikki yoqli burchak. Perpendikulyar tekisliklar`,
  `Урок ${LESSON_NO}. Двугранный угол. Перпендикулярные плоскости`,
  `Lesson ${LESSON_NO}. The dihedral angle. Perpendicular planes`,
)

const BLOCK = { label: 'B6', from: 38, to: 43, current: 43 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('IKKI YOQLI BURCHAK', 'ДВУГРАННЫЙ УГОЛ', 'THE DIHEDRAL ANGLE'),
  title: L("Joyga bog'liqmi yoki yo'q", 'Зависит от места или нет', 'Does it depend on the place or not'),
  audio: [
    A('mount', "Ochiq kitob ikki yoqli burchak beradi. Tekislikning ikki yarmi va umumiy buklanish chizig'i.", 'Открытая книга даёт двугранный угол. Две половины плоскости и общая линия сгиба.', 'An open book gives a dihedral angle. Two halves of a plane and a common fold line.'),
    A('r1', "Birinchi yozuv burchak kattaligi buklanish chizig'ining qaysi joyida o'lchashimizga bog'liq deydi.", 'Первая запись говорит, что величина угла зависит от того, в каком месте линии сгиба мы его мерим.', 'The first reading says the size of the angle depends on where along the fold line we measure it.'),
    A('r2', "Ikkinchisi bog'liq emas deydi, va istalgan joyda bir xil chiqadi.", 'Вторая говорит, что не зависит, и в любом месте получится одно и то же.', 'The second says it does not depend, and any place gives the same.'),
    A('ask', "Kitob chekkaga yaqin joyda kengroq ochilgandek ko'rinadi. Sizningcha qaysi yozuv to'g'ri?", 'Книга ближе к краю кажется раскрытой шире. Как думаешь, какая запись верная?', 'Near the edge the book seems opened wider. Which reading do you think is correct?'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi sahnani buramiz.', 'Твой ответ записан. Сейчас повернём сцену.', 'Your answer is recorded. Now we rotate the scene.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("bog'liq", 'зависит', 'it depends'),
      value: '∠A ≠ ∠B',
    },
    b: {
      name: L("bog'liq emas", 'не зависит', 'it does not depend'),
      value: '∠A = ∠B',
    },
  },
  expr: 'A, B ∈ a',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Burchakdan oldin uch savol', 'Три вопроса перед углом', 'Three questions before the angle'),
  tag: 'support',
  audio: [
    A('mount', "Uchta savol. Ikkinchisi bir daqiqadan keyin so'zma-so'z kerak bo'ladi.", 'Три вопроса. Второй понадобится дословно через минуту.', 'Three questions. The second will be needed word for word in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("To'g'ri chiziq va tekislik burchagi nima bilan olinadi?", 'С чем берут угол прямой и плоскости?', 'What is the angle of a line and a plane taken with?'),
      done: '∠(a; α) = ∠(a; a₁)',
      items: [
        { id: 'a', label: L('proyeksiya bilan', 'с проекцией', 'with the projection'), correct: true },
        { id: 'b', label: L("tekislikning istalgan chizig'i bilan", 'с любой прямой плоскости', 'with any line of the plane'), hint: L("Bunday chiziqlar cheksiz ko'p, va burchaklari boshqa-boshqa.", 'Таких прямых бесконечно много, и углы у них разные.', 'There are infinitely many such lines with different angles.') },
        { id: 'c', label: L('perpendikulyar bilan', 'с перпендикуляром', 'with the perpendicular'), hint: L("Perpendikulyar bilan burchak doim to'g'ri.", 'С перпендикуляром угол всегда прямой.', 'With the perpendicular the angle is always right.') },
        { id: 'd', label: L('qirra bilan', 'с ребром', 'with the edge'), hint: L('Qirra tekislik chiziqlaridan biri, boshqa emas.', 'Ребро это одна из прямых плоскости, не более.', 'An edge is just one of the lines of the plane.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Berilgan nuqta orqali tekislikda berilgan chiziqqa perpendikulyar nechta chiziq bor?', 'Сколько прямых в плоскости перпендикулярно данной прямой через данную точку?', 'How many lines of the plane through a given point are perpendicular to a given line?'),
      done: '1',
      items: [
        { id: 'a', label: L('bitta', 'одна', 'one'), correct: true },
        { id: 'b', label: L('ikkita', 'две', 'two'), hint: L('Bunday ikki chiziq ustma-ust tushardi.', 'Две такие прямые совпали бы.', 'Two such lines would coincide.') },
        { id: 'c', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p ular fazoda bo'lardi, tekislikda emas.", 'Бесконечно много их было бы в пространстве, а не в плоскости.', 'There would be infinitely many in space, not in a plane.') },
        { id: 'd', label: L("bitta ham yo'q", 'ни одной', 'none'), hint: L("Hech bo'lmaganda bittasi doim bor.", 'Хотя бы одна есть всегда.', 'At least one always exists.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Tekislikka perpendikulyar chiziq nima beradi?', 'Что даёт прямая, перпендикулярная плоскости?', 'What does a line perpendicular to a plane give?'),
      done: 'a ⊥ α   →   90°',
      items: [
        { id: 'a', label: L("shu tekislikning har bir chizig'i bilan to'g'ri burchak", 'прямой угол с каждой прямой этой плоскости', 'a right angle with every line of that plane'), correct: true },
        { id: 'b', label: L("faqat bitta chiziq bilan to'g'ri burchak", 'прямой угол только с одной прямой', 'a right angle with one line only'), hint: L('Bitta chiziq alomat uchun ham kam.', 'Одной прямой мало даже для признака.', 'One line is not even enough for the criterion.') },
        { id: 'c', label: L('teng kesmalar', 'равные отрезки', 'equal segments'), hint: L('Gap burchaklar haqida, uzunliklar haqida emas.', 'Речь об углах, а не о длинах.', 'This is about angles, not lengths.') },
        { id: 'd', label: L('parallellik', 'параллельность', 'parallelism'), hint: L("Parallellik nol burchak beradi, to'qson emas.", 'Параллельность даёт угол ноль, а не девяносто.', 'Parallelism gives a zero angle, not ninety.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Ikki yoq va bitta qirra', 'Две грани и одно ребро', 'Two faces and one edge'),
  tag: 'kartinka-kak-dokazatelstvo',
  show: [
    [
      L('bir yarimtekislik yotdi', 'одна полуплоскость легла', 'one half-plane lay down'),
      L("ikkinchisi o'sha chiziqdan ko'tarildi", 'вторая поднялась от той же прямой', 'the second rose from the same line'),
    ],
    [
      L('umumiy chiziq qirra deb ataladi', 'общая прямая называется ребром', 'the common line is called the edge'),
      L('yarimtekisliklar yoqlar deb ataladi', 'полуплоскости называются гранями', 'the half-planes are called the faces'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Bitta chiziqni va undan boshlanadigan ikki yarimtekislikni olamiz.', 'Возьмём прямую и две полуплоскости, которые от неё начинаются.', 'Take a line and two half-planes that start from it.'),
    A('move', "Bunday shakl ikki yoqli burchak deb ataladi. Yarimtekisliklar uning yoqlari, ularni chegaralovchi chiziq esa qirra. Darslikda bir yuz qirq ikkinchi betda shunday yozilgan. Ikki yoqli burchaklar atrofimizda hamma joyda. Ochiq kitob, noutbuk qopqog'i, ochiq eshik va tom qiyaligi. Sahnani buring va shaklga turli tomondan qarang. Qirra har qanday holatda ikki yoq uchun umumiy qoladi, chunki bu chizmaning xossasi emas, shaklning sharti.", 'Такая фигура называется двугранным углом. Полуплоскости это его грани, а прямая, которая их ограничивает, это ребро. Так написано в учебнике на странице сто сорок два. Двугранные углы вокруг нас повсюду. Открытая книга, крышка ноутбука, открытая дверь и скат крыши. Поверни сцену и посмотри на фигуру с разных сторон. Ребро остаётся общим для двух граней при любом положении, потому что это не свойство чертежа, а условие фигуры.', 'Such a figure is called a dihedral angle. The half-planes are its faces, and the line that bounds them is the edge. That is what the textbook says on page one hundred forty two. Dihedral angles are everywhere around us. An open book, a laptop lid, an open door and a roof slope. Rotate the scene and look at the figure from different sides. The edge stays common to both faces at any position, because this is not a property of the drawing but a condition of the figure.'),
    A('work', "O'zingiz hisoblang. Ikki yoqli burchakni nechta yarimtekislik hosil qiladi?", 'Посчитай сам. Сколько полуплоскостей образуют двугранный угол?', 'Work it out yourself. How many half-planes form a dihedral angle?'),
  ],
  work: {
    prompt: L('Nechta yarimtekislik?', 'Сколько полуплоскостей?', 'How many half-planes?'),
    ok: L('Ikkita. Va ularni chegaralovchi bitta umumiy qirra.', 'Две. И одно общее ребро, которое их ограничивает.', 'Two. And one common edge that bounds them.'),
    hint: [
      L("Chizmada tekislikning nechta bo'lagi borligini ko'ring.", 'Посмотри, сколько частей плоскости на чертеже.', 'See how many parts of a plane are on the drawing.'),
      L("Shaklning nomi bu sonni o'zida saqlaydi.", 'Название фигуры содержит это число.', 'The name of the figure carries this number.'),
      L('Ikkita.', 'Две.', 'Two.'),
    ],
    answer: '2',
  },
  expr: 'α, β;   a = α ∩ β',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('SHOHID', 'СВИДЕТЕЛЬ', 'THE WITNESS'),
  title: L("Nuqta qirra bo'ylab yuradi", 'Точка едет по ребру', 'The point travels along the edge'),
  tag: 'lineynyy-ne-tot',
  show: [
    [
      L('qirra nuqtasidan har yoqda nur chiqadi', 'из точки ребра в каждой грани идёт луч', 'from a point of the edge a ray runs in each face'),
      L('ikkala nur ham qirraga perpendikulyar', 'оба луча перпендикулярны ребру', 'both rays are perpendicular to the edge'),
    ],
    [
      L("nuqta qirraning boshqa joyiga o'tdi", 'точка переехала в другое место ребра', 'the point moved to another place on the edge'),
      L("burchak o'sha qoldi", 'угол остался тем же', 'the angle stayed the same'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Qirrada nuqta bor, va undan har yoqda qirraga perpendikulyar nur boradi. Bunday burchak chiziqli burchak deb ataladi.', 'На ребре есть точка, и из неё в каждой грани идёт луч, перпендикулярный ребру. Такой угол называется линейным.', 'There is a point on the edge, and from it a ray perpendicular to the edge runs in each face. Such an angle is called the linear angle.'),
    A('move', "Endi sonning o'ziga qarang. Nuqta qirra bo'ylab yuradi, nurlar u bilan birga yuradi, ular orasidagi burchak esa bir daraja ham o'zgarmaydi. Chiziqli burchaklar cheksiz ko'p, chunki qirrada nuqtalar cheksiz ko'p, lekin kattaligi hammasida bir xil. Aynan u ikki yoqli burchakning kattaligi deb hisoblanadi. Sahnani buring va burilishda faqat yaqinrog'i emas, ikkala burchak ham bir xil qolishini tekshiring.", 'Теперь смотри на само число. Точка едет по ребру, лучи едут вместе с ней, а угол между ними не меняется ни на градус. Линейных углов бесконечно много, потому что точек на ребре бесконечно много, но величина у всех одна. Именно она и считается величиной двугранного угла. Поверни сцену и проверь, что при повороте одинаковыми остаются оба угла, а не только тот, который ближе.', 'Now look at the number itself. The point travels along the edge, the rays travel with it, and the angle between them does not change by a single degree. There are infinitely many linear angles, because there are infinitely many points on the edge, but all of them have one size. That size is taken to be the size of the dihedral angle. Rotate the scene and check that under rotation both angles stay equal, not only the nearer one.'),
    A('work', "O'zingiz hisoblang. Bitta ikki yoqli burchakning chiziqli burchaklari nechta xil kattalikka ega?", 'Посчитай сам. Сколько разных величин у линейных углов одного двугранного угла?', 'Work it out yourself. How many different sizes do the linear angles of one dihedral angle have?'),
  ],
  work: {
    prompt: L('Nechta xil kattalik?', 'Сколько разных величин?', 'How many different sizes?'),
    ok: L("Bitta. Chiziqli burchaklar cheksiz ko'p, kattaligi esa bitta.", 'Одна. Линейных углов бесконечно много, а величина у них одна.', 'One. There are infinitely many linear angles, and they have one size.'),
    hint: [
      L('Nuqtani suring va ikki dugani solishtiring.', 'Подвинь точку и сравни две дуги.', 'Move the point and compare the two arcs.'),
      L('Bir yoqdagi nurlar turli nuqtalarda parallel.', 'Лучи в одной грани при разных точках параллельны.', 'The rays in one face at different points are parallel.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: '∠A = ∠B = ∠C',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L('Qiyshiq nur boshqa burchak beradi', 'Кривой луч даёт другой угол', 'A skewed ray gives a different angle'),
  tag: 'lineynyy-ne-tot',
  show: [
    [
      L("ikkinchi nur perpendikulyardan og'dirildi", 'второй луч отклонили от перпендикуляра', 'the second ray was tilted off the perpendicular'),
      L("chizmada u yomon ko'rinmaydi", 'на чертеже он выглядит не хуже', 'on the drawing it looks no worse'),
    ],
    [
      L('sahnani buring va dugalarni solishtiring', 'поверни сцену и сравни дуги', 'rotate the scene and compare the arcs'),
      L('bu burchak chiziqli emas', 'этот угол не линейный', 'this angle is not the linear one'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Birinchi nurni joyida qoldiramiz, ikkinchisini esa qirraga perpendikulyardan og'diramiz.", 'Оставим первый луч на месте, а второй отклоним от перпендикуляра к ребру.', 'Leave the first ray in place and tilt the second one off the perpendicular to the edge.'),
    A('move', "Qimirlamas chizmada og'ish deyarli ko'rinmaydi, va burchak xuddi shunday qonuniy ko'rinadi. Sahnani buring va dugalarni solishtiring. Ular boshqa-boshqa, va qiyshiq nurda qurilgani burilish bilan birga o'zgaradi. Chiziqli burchak ikki shartni talab qiladi, va ikkalasi ham majburiy. Nurlar yoqlarda yotadi, va ikkalasi ham qirraga perpendikulyar. Ikkinchi shartni olib tashlasangiz, kattalik aniq bo'lmay qoladi, chunki har bir qiyshiq nur o'z sonini beradi.", 'На неподвижном чертеже отклонение почти не видно, и угол выглядит таким же законным. Поверни сцену и сравни дуги. Они разные, и та, что построена на кривом луче, меняется вместе с поворотом. Линейный угол требует двух условий, и оба обязательны. Лучи лежат в гранях, и оба перпендикулярны ребру. Убери второе условие, и величина перестанет быть определённой, потому что каждый кривой луч даст своё число.', 'On a still drawing the tilt is almost invisible and the angle looks just as legitimate. Rotate the scene and compare the arcs. They differ, and the one built on the skewed ray changes together with the rotation. The linear angle needs two conditions and both are required. The rays lie in the faces, and both are perpendicular to the edge. Drop the second condition and the size stops being definite, because every skewed ray gives its own number.'),
    A('work', "O'zingiz hisoblang. Chizmadagi ikki burchakdan nechtasi chiziqli?", 'Посчитай сам. Сколько из двух углов на чертеже линейный?', 'Work it out yourself. How many of the two angles on the drawing are linear?'),
  ],
  work: {
    prompt: L('Chizmada nechta chiziqli burchak bor?', 'Сколько линейных углов на чертеже?', 'How many linear angles are on the drawing?'),
    ok: L('Bitta. Ikkinchisining nuri qirraga perpendikulyar emas.', 'Один. У второго луч не перпендикулярен ребру.', 'One. The ray of the second one is not perpendicular to the edge.'),
    hint: [
      L('Har burchakda ikki shartni tekshiring.', 'Проверь у каждого угла оба условия.', 'Check both conditions for each angle.'),
      L("Nurlar qirraga perpendikulyar bo'lishi kerak, shunchaki yoqlarda yotishi emas.", 'Лучи должны быть перпендикулярны ребру, а не просто лежать в гранях.', 'The rays must be perpendicular to the edge, not merely lie in the faces.'),
      L('Bitta.', 'Один.', 'One.'),
    ],
    answer: '1',
  },
  expr: 'AB ⊥ a,   AD ⊥̸ a',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Qirra atrofida to'rt burchak", 'Четыре угла вокруг ребра', 'Four angles around the edge'),
  tag: 'lineynyy-ne-tot',
  show: [
    [
      L('ikki tekislik kesishdi', 'две плоскости пересеклись', 'two planes crossed'),
      L("qirra atrofida to'rt burchak chiqdi", 'вокруг ребра получилось четыре угла', 'four angles came out around the edge'),
    ],
    [
      L('ulardan biri ellik daraja', 'один из них пятьдесят градусов', 'one of them is fifty degrees'),
      L('unga qarama-qarshisi ham shunday', 'противоположный ему такой же', 'the one opposite to it is the same'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Ikki kesishuvchi tekislik butun fazoni umumiy qirrali to'rt ikki yoqli burchakka ajratadi. Bir yuz qirq uchinchi betda shunday.", 'Две пересекающиеся плоскости делят всё пространство на четыре двугранных угла с общим ребром. Так на странице сто сорок три.', 'Two crossing planes divide the whole of space into four dihedral angles with a common edge. So it is on page one hundred forty three.'),
    A('move', "Bu to'rttasining chiziqli burchaklariga qarang. Ular ikki chiziq kesishganda hosil bo'ladigan oddiy burchaklar kabi tuzilgan. Qarama-qarshilari o'zaro teng, qo'shnilari esa bir yuz sakson darajaga to'ldiradi. Demak agar bir burchak ellik daraja bo'lsa, unga qarama-qarshisi ham ellik, ikki qo'shnisi esa bir yuz o'ttiztadan. Kesishuvchi tekisliklar orasidagi burchak deb to'rttadan eng kichigi olinadi, ya'ni to'qson darajadan katta bo'lmagani.", 'Посмотри на линейные углы этих четырёх. Они устроены как обычные углы при пересечении двух прямых. Противоположные равны между собой, а соседние дополняют друг друга до ста восьмидесяти градусов. Значит если один угол пятьдесят градусов, то противоположный ему тоже пятьдесят, а два соседних по сто тридцать. Углом между пересекающимися плоскостями называют наименьший из четырёх, то есть тот, который не больше девяноста градусов.', 'Look at the linear angles of these four. They are arranged like ordinary angles at the crossing of two lines. Opposite ones are equal to each other, and neighbouring ones add up to one hundred eighty degrees. So if one angle is fifty degrees, the one opposite is also fifty, and the two neighbours are one hundred thirty each. The angle between crossing planes is taken to be the smallest of the four, the one not greater than ninety degrees.'),
    A('work', "O'zingiz hisoblang. Bir burchak ellik daraja. Qo'shnisida necha daraja?", 'Посчитай сам. Один угол пятьдесят градусов. Сколько градусов в соседнем?', 'Work it out yourself. One angle is fifty degrees. How many degrees are in the neighbouring one?'),
  ],
  work: {
    prompt: L("Qo'shnisida necha daraja?", 'Сколько градусов в соседнем?', 'How many degrees in the neighbouring one?'),
    ok: L("Bir yuz o'ttiz. Qo'shnilar bir-birini bir yuz sakson darajaga to'ldiradi.", 'Сто тридцать. Соседние дополняют друг друга до ста восьмидесяти.', 'One hundred thirty. Neighbours add up to one hundred eighty.'),
    hint: [
      L("Qo'shni chiziqli burchaklar birgalikda yoyiq burchak beradi.", 'Соседние линейные углы вместе дают развёрнутый.', 'Neighbouring linear angles together give a straight angle.'),
      L('Bir yuz sakson dan ellikni ayiring.', 'Отними пятьдесят от ста восьмидесяти.', 'Subtract fifty from one hundred eighty.'),
      L("Bir yuz o'ttiz.", 'Сто тридцать.', 'One hundred thirty.'),
    ],
    answer: '130',
  },
  expr: '50° + x = 180°',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('PERPENDIKULYAR', 'ПЕРПЕНДИКУЛЯРНЫЕ', 'PERPENDICULAR'),
  title: L("Biri to'g'ri bo'lsa, to'rttasi ham", 'Один прямой значит все четыре', 'One right means all four'),
  tag: 'svoystvo-vmesto-priznaka',
  show: [
    [
      L("chiziqli burchak to'g'ri bo'ldi", 'линейный угол стал прямым', 'the linear angle became right'),
      L("qo'shnisi ham to'g'ri bo'ldi", 'соседний тоже стал прямым', 'the neighbouring one also became right'),
    ],
    [
      L('bunday tekisliklar perpendikulyar deb ataladi', 'такие плоскости называют перпендикулярными', 'such planes are called perpendicular'),
      L('xona poli va devori misol', 'пол и стена комнаты пример', 'the floor and a wall of a room are an example'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Bu yerda chiziqli burchak to'g'ri. Qirra atrofida o'sha to'rt burchak.", 'Здесь линейный угол прямой. Вокруг ребра всё те же четыре угла.', 'Here the linear angle is right. Around the edge there are the same four angles.'),
    A('move', "To'rt burchakdan biri to'g'ri bo'lishi bilanoq qolgan uchtasi ham to'g'ri bo'ldi. Qo'shnisi uni bir yuz sakson darajaga to'ldiradi, bir yuz sakson minus to'qson esa yana to'qson. To'g'ri burchak ostida kesishuvchi tekisliklar perpendikulyar deb ataladi. Ular atrofimizda ko'p. Xona poli va devori, umumiy qirrali ikki devor, umumiy qirrali rubik kubi yoqlari, yer va uy devori.", 'Как только один из четырёх углов стал прямым, прямыми стали и остальные три. Соседний дополняет его до ста восьмидесяти, а сто восемьдесят минус девяносто это опять девяносто. Плоскости, пересекающиеся под прямым углом, называют перпендикулярными. Их вокруг нас много. Пол и стена комнаты, две стены с общим углом, грани кубика Рубика с общим ребром, земля и стена дома.', 'As soon as one of the four angles became right, the other three became right too. The neighbour completes it to one hundred eighty, and one hundred eighty minus ninety is ninety again. Planes crossing at a right angle are called perpendicular. There are many of them around us. The floor and a wall of a room, two walls with a common corner, faces of a Rubik cube with a common edge, the ground and the wall of a house.'),
    A('work', "O'zingiz hisoblang. To'rt burchakdan biri to'g'ri. To'rttadan nechtasi to'g'ri?", 'Посчитай сам. Один из четырёх углов прямой. Сколько из четырёх прямые?', 'Work it out yourself. One of the four angles is right. How many of the four are right?'),
  ],
  work: {
    prompt: L("To'rttadan nechta to'g'ri burchak?", 'Сколько прямых углов из четырёх?', 'How many right angles out of four?'),
    ok: L("To'rttasi ham. Bir yuz sakson minus to'qson yana to'qson.", 'Все четыре. Сто восемьдесят минус девяносто снова девяносто.', 'All four. One hundred eighty minus ninety is ninety again.'),
    hint: [
      L("Qo'shni burchakni hisoblang.", 'Посчитай соседний угол.', 'Compute the neighbouring angle.'),
      L("Qarama-qarshi burchaklar teng, qo'shnilar yoyiq beradi.", 'Противоположные углы равны, соседние дают развёрнутый.', 'Opposite angles are equal, neighbours give a straight angle.'),
      L("To'rttasi ham.", 'Все четыре.', 'All four.'),
    ],
    answer: '4',
  },
  expr: 'α ⊥ β',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Chiziqli burchakning ikki sharti', 'Два условия линейного угла', 'Two conditions of the linear angle'),
  tag: 'lineynyy-ne-tot',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Ta'rifda ikki shart bor, va ikkinchisi butun ishni qiladi. Yoqlardagi nurlar istalgancha bo'ladi, lekin qirraga perpendikulyarlari har yoqda roppa-rosa bittadan. Shuning uchun berilgan nuqtada chiziqli burchak bitta, ko'p emas, va ikki yoqli burchakning kattaligi yagona aniqlanadi. Qulaylik ham shundan. Ikki yoqli burchakni o'lchash uchun tekisliklarni o'lchash kerak emas, qirraning istalgan joyida bitta chiziqli burchak qurish yetarli.", 'В определении два условия, и второе делает всю работу. Лучи в гранях бывают любые, но перпендикулярных ребру ровно по одному в каждой грани. Поэтому линейный угол в данной точке один, а не много, и величина двугранного угла определена однозначно. Отсюда и удобство. Чтобы измерить двугранный угол, не надо мерить плоскости, достаточно построить один линейный угол в любом месте ребра.', 'The definition has two conditions and the second one does all the work. Rays in the faces can be any, but there is exactly one perpendicular to the edge in each face. That is why the linear angle at a given point is one and not many, and the size of the dihedral angle is uniquely defined. Hence the convenience. To measure a dihedral angle there is no need to measure the planes, it is enough to build one linear angle anywhere on the edge.'),
  ],
  probe: {
    question: L('Qaysi burchak chiziqli deb ataladi?', 'Какой угол называют линейным?', 'Which angle is called the linear one?'),
    items: [
      { id: 'a', label: L('nurlar yoqlarda va ikkalasi qirraga perpendikulyar', 'лучи в гранях и оба перпендикулярны ребру', 'the rays are in the faces and both perpendicular to the edge'), correct: true },
      { id: 'b', label: L('qirra nuqtasidan chiqqan istalgan ikki nur', 'любые два луча из точки ребра', 'any two rays from a point of the edge'), hint: L("Unda bitta ikki yoqli burchakning ko'p xil kattaligi bo'lardi.", 'Тогда у одного двугранного угла было бы много разных величин.', 'Then one dihedral angle would have many different sizes.') },
    ],
  },
  rule: {
    lawLabel: L('Chiziqli burchak', 'Линейный угол', 'The linear angle'),
    lines: [
      L('nurlar qirraning bir nuqtasidan chiqadi va yoqlarda yotadi', 'лучи выходят из одной точки ребра и лежат в гранях', 'the rays leave one point of the edge and lie in the faces'),
      L('ikkala nur ham qirraga perpendikulyar', 'оба луча перпендикулярны ребру', 'both rays are perpendicular to the edge'),
      L('ikki yoqli burchakning kattaligi uning chiziqli burchagi kattaligi', 'величина двугранного угла это величина его линейного угла', 'the size of a dihedral angle is the size of its linear angle'),
    ],
    law: 'AB ⊥ a,   AC ⊥ a   →   ∠BAC',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Kattalik va turi', 'Величина и вид', 'The size and the kind'),
  tag: 'lineynyy-ne-tot',
  audio: [
    A('mount', "To'rt kattalik va to'rt nom. Ularni birlashtiring.", 'Четыре величины и четыре названия. Соедини их.', 'Four sizes and four names. Match them.'),
  ],
  match: {
    prompt: L('Chiziqli burchak kattaligini ikki yoqli burchak turi bilan birlashtiring', 'Соедини величину линейного угла с видом двугранного', 'Match the size of the linear angle with the kind of dihedral angle'),
    ok: L("To'rttasi ham joyida. Ikki yoqli burchakning turi chiziqli bo'yicha o'qiladi.", 'Все четыре на месте. Вид двугранного читается по линейному.', 'All four in place. The kind of the dihedral angle is read from the linear one.'),
    a: L("o'tkir", 'острый', 'acute'),
    b: L("to'g'ri", 'прямой', 'right'),
    c: L("o'tmas", 'тупой', 'obtuse'),
    d: L('yoyiq', 'развёрнутый', 'straight'),
    left: ['40°', '90°', '120°', '180°'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L("Nuqtaga bog'liq emasligini isbotlang", 'Докажи независимость от точки', 'Prove it does not depend on the point'),
  tag: 'lineynyy-ne-tot',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L('qirraning turli nuqtalarida ikki chiziqli burchak', 'два линейных угла в разных точках ребра', 'two linear angles at different points of the edge'),
    goal: L('ular teng', 'они равны', 'they are equal'),
    r1: L('har yoqda nurlar parallel', 'в каждой грани лучи параллельны', 'in each face the rays are parallel'),
    r2: L("burchak tomonlari bir yo'nalgan", 'стороны углов сонаправлены', 'the sides of the angles point the same way'),
    r3: L('demak burchaklar teng', 'значит углы равны', 'so the angles are equal'),
    ok: L("Isbotlandi. Ikki yoqli burchakning kattaligi qirradagi nuqtaga bog'liq emas.", 'Доказано. Величина двугранного угла от точки на ребре не зависит.', 'Proved. The size of a dihedral angle does not depend on the point on the edge.'),
    e1: L("Bir yo'nalganlik keyin keladi. Avval parallellik haqida.", 'Сонаправленность идёт дальше. Сначала про параллельность.', 'Codirection comes later. First about being parallel.'),
    e2: L("Parallellik bor. Gap nurlarning yo'nalishi haqida.", 'Параллельность уже есть. Речь о направлении лучей.', 'Being parallel is done. This is about the direction of the rays.'),
    e3: L("Tomonlar ko'rildi. Endi burchaklar haqida xulosa.", 'Стороны разобраны. Теперь вывод про углы.', 'The sides are done. Now the conclusion about the angles.'),
  },
  reason: {
    s1: L('tekislikda bir chiziqqa ikki perpendikulyar parallel', 'в плоскости два перпендикуляра к одной прямой параллельны', 'in a plane two perpendiculars to one line are parallel'),
    s2: L('nurlar qirradan bir tomonga boradi', 'лучи идут в одну сторону от ребра', 'the rays go to one side of the edge'),
    s3: L("bir yo'nalgan tomonli burchaklar teng", 'углы с сонаправленными сторонами равны', 'angles with codirected sides are equal'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: '∠A = ∠B',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO TOOL'),
  title: L('Hisob va tartib', 'Счёт и порядок', 'Counting and order'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob olib qo'yildi. Qog'ozda hisoblaymiz.", 'Прибор убран. Считаем на бумаге.', 'The tool is put away. We count on paper.'),
    A('next', 'Endi yozuvlar tartibi. Ularni qanday olinsa, shunday joylashtiring.', 'Теперь порядок записей. Расставь их так, как их получают.', 'Now the order of the readings. Arrange them the way they are obtained.'),
  ],
  task: {
    ok: L("Bir yuz o'n. Qo'shnisi yetmishni bir yuz sakson darajaga to'ldiradi.", 'Сто десять. Соседний дополняет семьдесят до ста восьмидесяти.', 'One hundred ten. The neighbour completes seventy to one hundred eighty.'),
    hint: [
      L("Bitta nuqta atrofida to'rt burchak chizing.", 'Нарисуй четыре угла вокруг одной точки.', 'Draw four angles around one point.'),
      L("Qo'shnilar birgalikda yoyiq burchak beradi.", 'Соседние вместе дают развёрнутый угол.', 'Neighbours together give a straight angle.'),
      L('Bir yuz sakson minus yetmish.', 'Сто восемьдесят минус семьдесят.', 'One hundred eighty minus seventy.'),
    ],
    prompt: '∠1 = 70°,   ∠2 = ?',
    answer: '110',
  },
  order: {
    prompt: L('Yozuvlarni olinish tartibida joylashtiring', 'Расставь записи в том порядке, в каком их получают', 'Arrange the readings in the order they are obtained'),
    title: L('Qurish tartibi', 'Порядок построения', 'The order of construction'),
    ok: L("Tartib to'g'ri. Nuqta birinchi olinadi, xulosa oxirgi.", 'Порядок верный. Точка берётся первой, вывод последним.', 'The order is right. The point is taken first, the conclusion last.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['∠BAC', 'A ∈ a', 'AB ⊥ a', 'AC ⊥ a'],
    answer: 'A ∈ a  AB ⊥ a  AC ⊥ a  ∠BAC',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato qatorni toping', 'Найди строку с ошибкой', 'Find the line with the mistake'),
  tag: 'check',
  audio: [
    A('mount', "To'rt qator, va ulardan biri chiziqli deb boshqa burchakni aytadi.", 'Четыре строки, и одна из них называет линейным не тот угол.', 'Four lines, and one of them calls the wrong angle linear.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Qirradagi nuqta to'g'ri olingan.", 'Точка на ребре взята верно.', 'The point on the edge is taken correctly.'),
    r2: L("Birinchi nur qirraga perpendikulyar, bu to'g'ri.", 'Первый луч перпендикулярен ребру, это верно.', 'The first ray is perpendicular to the edge, that is right.'),
    r4: L('Xulosa yuqoridagi xato qatordan olingan.', 'Вывод получен из неверной строки выше.', 'The conclusion comes from the wrong line above.'),
  },
  proof: L("Sahnani buring: bu nurdagi duga o'zgaradi, perpendikulyardagisi esa yo'q.", 'Поверни сцену: дуга на этом луче меняется, а на перпендикулярном нет.', 'Rotate the scene: the arc on this ray changes, the one on the perpendicular does not.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L('Uchinchi. Ikkinchi nur qirraga perpendikulyar emas, va burchak chiziqli emas.', 'Третья. Второй луч ребру не перпендикулярен, и угол не линейный.', 'The third. The second ray is not perpendicular to the edge and the angle is not linear.'),
    hint: [
      L('Har nurning qirraga perpendikulyarligini tekshiring.', 'Проверь у каждого луча перпендикулярность ребру.', 'Check each ray for perpendicularity to the edge.'),
      L('Isbotda ikkinchi nur haqidagi shart tekshirilmagan.', 'Условие про второй луч в доказательстве не проверено.', 'The condition about the second ray is not checked in the proof.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'A ∈ a',
    r2: 'AB ⊥ a,   B ∈ α',
    r3: 'AD ⊂ β   →   ∠BAD',
    r4: '∠BAD = 60°',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Teskari tomonga', 'В обратную сторону', 'The other way round'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Qoidani o'ngdan chapga o'qiymiz. Ikki yoqli burchak bo'yicha chiziqlini aytamiz.", 'Прочитаем правило справа налево. По двугранному углу назовём линейный.', 'Let us read the rule from right to left. From the dihedral angle we name the linear one.'),
    A('work', "Doim to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны всегда. Их больше одной.', 'Mark all the readings that are always true. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Nima doim to'g'ri", 'Что верно всегда', 'What is always true'),
    ok: L('Beshtadan uch yozuv. Qolgan ikkitasi qirra haqidagi shartda sinadi.', 'Три записи из пяти. Две оставшиеся ломаются на условии про ребро.', 'Three readings out of five. The other two break on the condition about the edge.'),
    items: [
      { id: 'd', label: 'AD ⊂ β   →   ∠BAD', hint: L('Yoqlardagi nurlar istalgancha, chiziqli burchak esa bitta.', 'Лучи в гранях бывают любые, а линейный угол один.', 'Rays in the faces can be any, the linear angle is one.') },
      { id: 'e', label: '∠1 = ∠2 = 180°', hint: L("Qo'shni burchaklar bir-birini to'ldiradi, teng emas.", 'Соседние углы дополняют друг друга, а не равны.', 'Neighbouring angles complete each other, they are not equal.') },
      { id: 'a', label: 'AB ⊥ a,   AC ⊥ a', ok: true },
      { id: 'b', label: '∠A = ∠B', ok: true },
      { id: 'c', label: '∠1 + ∠2 = 180°', ok: true },
    ],
  },
  place: {
    prompt: L("Ikki yoqli burchak to'g'ri. Uning chiziqli burchagida necha daraja?", 'Двугранный угол прямой. Сколько градусов в его линейном угле?', 'The dihedral angle is right. How many degrees are in its linear angle?'),
    ok: L("To'qson. Ikki yoqli burchakning kattaligi chiziqli burchak kattaligi.", 'Девяносто. Величина двугранного это величина линейного.', 'Ninety. The size of the dihedral is the size of the linear one.'),
    wrong: L('Kartochkaning uchinchi qatoriga qarang.', 'Посмотри на третью строку карточки.', 'Look at the third line of the card.'),
    target: '90',
    step: 'α ⊥ β   →   ∠BAC = 90°',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'lineynyy-ne-tot',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Ikki yoqli burchakning yoqlarini nima chegaralaydi?', 'Что ограничивает грани двугранного угла?', 'What bounds the faces of a dihedral angle?'),
      done: 'a = α ∩ β',
      items: [
        { id: 'a', label: L('qirra', 'ребро', 'the edge'), correct: true },
        { id: 'b', label: L('chiziqli burchak', 'линейный угол', 'the linear angle'), hint: L("Chiziqli burchak o'lchov, chegara emas.", 'Линейный угол это мера, а не граница.', 'The linear angle is a measure, not a boundary.') },
        { id: 'c', label: L('uch', 'вершина', 'a vertex'), hint: L("Ikki yoqli burchakning uchi yo'q, qirrasi bor.", 'У двугранного угла вершины нет, у него ребро.', 'A dihedral angle has no vertex, it has an edge.') },
        { id: 'd', label: L('tekislik', 'плоскость', 'a plane'), hint: L('Tekislik yoqlar yasalgan narsa.', 'Плоскость это то, из чего сделаны грани.', 'A plane is what the faces are made of.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Chiziqli burchak nurlari qayerga qarashi kerak?', 'Куда должны смотреть лучи линейного угла?', 'Where must the rays of the linear angle point?'),
      done: 'AB ⊥ a',
      items: [
        { id: 'a', label: L('qirraga perpendikulyar', 'перпендикулярно ребру', 'perpendicular to the edge'), correct: true },
        { id: 'b', label: L("qirra bo'ylab", 'вдоль ребра', 'along the edge'), hint: L("Qirra bo'ylab nur nol burchak berardi.", 'Вдоль ребра луч дал бы нулевой угол.', 'Along the edge a ray would give a zero angle.') },
        { id: 'c', label: L('istalgan tomonga', 'в любую сторону', 'in any direction'), hint: L("Unda ikki yoqli burchakning kattaligi bitta bo'lmasdi.", 'Тогда величина двугранного была бы не одна.', 'Then the size of the dihedral would not be single.') },
        { id: 'd', label: L('uchga', 'к вершине', 'towards the vertex'), hint: L("Ikki yoqli burchakda uch yo'q.", 'Вершины у двугранного угла нет.', 'A dihedral angle has no vertex.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("To'rt burchakdan biri bir yuz yigirma. Qo'shnisi?", 'Один из четырёх углов сто двадцать. Соседний?', 'One of the four angles is one hundred twenty. The neighbour?'),
      done: '120° + 60° = 180°',
      items: [
        { id: 'a', label: L('oltmish', 'шестьдесят', 'sixty'), correct: true },
        { id: 'b', label: L('bir yuz yigirma', 'сто двадцать', 'one hundred twenty'), hint: L("Bir yuz yigirma qarama-qarshisida, qo'shnisida emas.", 'Сто двадцать у противоположного, а не у соседнего.', 'One hundred twenty belongs to the opposite one.') },
        { id: 'c', label: L("to'qson", 'девяносто', 'ninety'), hint: L("To'qson perpendikulyar tekisliklarda bo'lardi.", 'Девяносто было бы у перпендикулярных плоскостей.', 'Ninety would belong to perpendicular planes.') },
        { id: 'd', label: L('qirq', 'сорок', 'forty'), hint: L("Bir yuz sakson bilan yig'indini tekshiring.", 'Проверь сумму со ста восьмьюдесятью.', 'Check the sum with one hundred eighty.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Tekisliklar orasidagi burchak deb qaysi burchak aytiladi?', 'Какой угол называют углом между плоскостями?', 'Which angle is called the angle between planes?'),
      done: '∠(α; β) ≤ 90°',
      items: [
        { id: 'a', label: L("to'rttadan eng kichigi", 'наименьший из четырёх', 'the smallest of the four'), correct: true },
        { id: 'b', label: L("to'rttadan eng kattasi", 'наибольший из четырёх', 'the biggest of the four'), hint: L("Eng kattasi o'tmas bo'ladi, va u o'lchov uchun yaramaydi.", 'Наибольший бывает тупым, и он не годится в меру.', 'The biggest can be obtuse and does not serve as a measure.') },
        { id: 'c', label: L("to'rttadan istalgani", 'любой из четырёх', 'any of the four'), hint: L("Unda o'lchov bitta bo'lmasdi.", 'Тогда мера была бы не одна.', 'Then the measure would not be single.') },
        { id: 'd', label: L("to'rttasining yig'indisi", 'сумма всех четырёх', 'the sum of all four'), hint: L("Yig'indi doim uch yuz oltmish va hech narsani ajratmaydi.", 'Сумма всегда триста шестьдесят и ничего не различает.', 'The sum is always three hundred sixty and tells nothing apart.') },
      ],
    },
  ],
  angles: ['40°', '90°', '120°', '180°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', "Dars kattalik qirradagi joyga bog'liqmi degan savol bilan boshlandi.", 'Урок начался с вопроса, зависит ли величина от места на ребре.', 'The lesson began with the question whether the size depends on the place on the edge.'),
    A('next', "Bog'liq emas, va biz buni shunchaki eshitmadik, ko'rdik. Nuqta qirra bo'ylab yurdi, burchak esa o'zgarmadi. Sababi shuki, har yoqda qirraga perpendikulyar bitta, va turli nuqtalardagi nurlar parallel. Bundan keyin ko'pyoqliklar boshlanadi, va ikki yoqli burchaklar har masalada paydo bo'ladi.", 'Не зависит, и мы это увидели, а не просто услышали. Точка ехала по ребру, а угол не менялся. Причина в том, что перпендикуляр к ребру в каждой грани один, и лучи при разных точках параллельны. Дальше начинаются многогранники, и двугранные углы будут появляться в каждой задаче.', 'It does not depend, and we saw that rather than merely heard it. The point travelled along the edge and the angle did not change. The reason is that there is one perpendicular to the edge in each face, and the rays at different points are parallel. Next polyhedra begin, and dihedral angles will appear in every problem.'),
  ],
  can: [
    L('Ikki yoqli burchakning yoqlari va qirrasini ajrataman', 'Различаю грани и ребро двугранного угла', 'I tell the faces and the edge of a dihedral angle apart'),
    L('Chiziqli burchakni qirraga perpendikulyar quraman', 'Строю линейный угол перпендикулярно ребру', 'I build the linear angle perpendicular to the edge'),
    L("Kattalik qirradagi nuqtaga bog'liq emasligini bilaman", 'Знаю, что от точки на ребре величина не зависит', 'I know the size does not depend on the point on the edge'),
    L("Bittasi bo'yicha to'rttasini topaman", 'Нахожу все четыре угла по одному', 'I find all four angles from one'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L("Blok tugadi. Bundan keyin ko'pyoqliklar, va u yerda ikki yoqli burchaklar har masalada bo'ladi", 'Блок закончен. Дальше многогранники, и там двугранные углы будут в каждой задаче', 'The block is over. Next come polyhedra, where dihedral angles appear in every problem'),
  lifehack: L("Tekisliklar orasidagi burchakni izlayotgan bo'lsangiz, qirrada chiziqli burchak quring", 'Ищешь угол между плоскостями — строй линейный угол на ребре', 'Looking for the angle between planes, build the linear angle on the edge'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L('Geometriya, bir yuz qirq ikkinchi va bir yuz qirq uchinchi betlar', 'Геометрия, страницы сто сорок два и сто сорок три', 'Geometry, pages one hundred forty two and one hundred forty three'),
  hook: {
    a: '∠A ≠ ∠B',
    b: '∠A = ∠B',
  },
  proved: '∠A = ∠B',
  law: 'AB ⊥ a,   AC ⊥ a',
  sheet: [
    'a = α ∩ β',
    'AB ⊥ a,   AC ⊥ a',
    '∠(α; β) = ∠BAC',
    '∠1 + ∠2 = 180°',
    'α ⊥ β   →   90°',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))

// SAHNA -- IKKI YOQLI BURCHAK. `E1E2` -- qirra, `A` va `B` -- qirradagi ikki
// nuqta. Har nuqtadan ikki nur: `A1`/`B1` birinchi yoqda, `A2`/`B2` ikkinchi
// yoqda, ikkalasi ham qirraga PERPENDIKULYAR. `D` -- qirraga perpendikulyar
// BO'LMAGAN nur (5-ekranning chegarasi).
//
// Nur uchlari HISOBLAB qo'yilgan: nur yoqda yotishi kerak, ya'ni uning
// koordinatalari yoqning burilish burchagiga bog'liq. Shuning uchun har burchak
// uchun o'z uchi bor: `A2` (1,1 radian), `A2f` (ellik daraja), `A2p` (to'qson).
const PTS = [
  { id: 'E1', at: [-0.95, 0, 0], label: '' },
  { id: 'E2', at: [0.95, 0, 0], label: 'a' },
  { id: 'A', at: [-0.35, 0, 0], label: 'A' },
  { id: 'B', at: [0.45, 0, 0], label: 'B' },
  { id: 'A1', at: [-0.35, 0.75, 0], label: '' },
  { id: 'A2', at: [-0.35, 0.34, 0.668], label: '' },
  { id: 'B1', at: [0.45, 0.75, 0], label: '' },
  { id: 'B2', at: [0.45, 0.34, 0.668], label: '' },
  { id: 'D', at: [0.2, 0.6, 0], label: 'D' },
  { id: 'A2f', at: [-0.35, 0.482, 0.575], label: '' },
  { id: 'A2p', at: [-0.35, 0, 0.75], label: '' },
  { id: 'A1m', at: [-0.35, -0.75, 0], label: '' },
]
const GREY = '#7f8c8d'
const EDGE = { from: 'E1', to: 'E2', tone: GREY, w: 2.4 }

// Yoqlar -- YARIM tekisliklar (`half`), chunki ikki yoqli burchak ta'rifi
// yarimtekisliklar haqida (geom. 142-bet). To'liq tekislik faqat 6 va
// 7-ekranda kerak, u yerda gap qirra atrofidagi TO'RT burchak haqida.
// Ikki yoq BOSHQA rangda: bir xil rangda ular ekranda bitta yashil dog'ga
// qo'shilib ketadi va «kitob» o'qilmaydi (2026-08-20 da suratda ko'rindi).
const FACE2 = '#6b8fa3'
const FACES = [
  { around: ['E1', 'E2'], phi: 0, half: -1, dim: true },
  { around: ['E1', 'E2'], phi: 1.1, half: -1, tone: FACE2 },
]
const FULL_50 = [
  { around: ['E1', 'E2'], phi: 0, dim: true },
  { around: ['E1', 'E2'], phi: 0.873, tone: FACE2 },
]
const FULL_90 = [
  { around: ['E1', 'E2'], phi: 0, dim: true },
  { around: ['E1', 'E2'], phi: 1.5708, tone: FACE2 },
]

const RAYS_A = [EDGE, { from: 'A', to: 'A1' }, { from: 'A', to: 'A2' }]
const RAYS_AB = [...RAYS_A, { from: 'B', to: 'B1' }, { from: 'B', to: 'B2' }]
const RAYS_BAD = [...RAYS_A, { from: 'A', to: 'D', tone: GREY, w: 2 }]
const RAYS_50 = [EDGE, { from: 'A', to: 'A1' }, { from: 'A', to: 'A2f' }, { from: 'A', to: 'A1m', tone: GREY, w: 2 }]
const RAYS_90 = [EDGE, { from: 'A', to: 'A1' }, { from: 'A', to: 'A2p' }, { from: 'A', to: 'A1m', tone: GREY, w: 2 }]

const H_EDGE = ['A1', 'A2', 'B1', 'B2', 'D', 'A2f', 'A2p', 'A1m', 'A', 'B']
const H_A = ['B1', 'B2', 'D', 'A2f', 'A2p', 'A1m', 'B']
const H_AB = ['D', 'A2f', 'A2p', 'A1m']
const H_BAD = ['B1', 'B2', 'A2f', 'A2p', 'A1m', 'B']
const H_FOUR = ['A2', 'B1', 'B2', 'D', 'B', 'A2p']
const H_FOUR90 = ['A2', 'B1', 'B2', 'D', 'B', 'A2f']

const ARC_A = { at: 'A', from: 'A1', to: 'A2', label: 'φ' }
const ARC_B = { at: 'B', from: 'B1', to: 'B2', label: 'φ' }
const ARC_BAD = { at: 'A', from: 'A1', to: 'D', label: 'ψ', scale: 1.8, tone: GREY }
const ARC_50 = { at: 'A', from: 'A1', to: 'A2f', label: '50°' }
const ARC_130 = { at: 'A', from: 'A2f', to: 'A1m', label: '130°', scale: 1.5, tone: GREY }
const RIGHT_90 = [{ at: 'A', from: 'A1', to: 'A2p' }, { at: 'A', from: 'A2p', to: 'A1m', scale: 1.5 }]

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => ({ id: PAIR_IDS[i], label: S9.match[k] }))

const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

const REASONS = [
  { id: 's1', label: S10.reason.s1 },
  { id: 's2', label: S10.reason.s2 },
  { id: 's3', label: S10.reason.s3 },
  { id: 'pic', label: S10.reason.pic.label, missing: S10.reason.pic.missing },
]
const PROOF_ROWS = [
  { text: S10.proof.r1, reason: 's1', early: S10.proof.e1 },
  { text: S10.proof.r2, reason: 's2', early: S10.proof.e2 },
  { text: S10.proof.r3, reason: 's3', early: S10.proof.e3, ok: S10.proof.ok },
]

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Prognoz paytida IKKI duga ko'rinadi, lekin sonlari yozilmagan: savol
        // aynan shu -- ular tengmi yoki yo'q.
        fig={() => (
          <Scene
            fig={<Space step={1} yaw={0.45} pts={PTS} planes={FACES} segs={RAYS_AB} hide={H_AB} arcAt={[ARC_A, ARC_B]} />}
            max={172}
            h={172}
          />
        )}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.2}>
        <Col>
          <Scene
            fig={<Space step={1} yaw={0.45} pts={PTS} planes={FACES} segs={[EDGE]} hide={H_EDGE} />}
            max={240}
            h={158}
          />
        </Col>
        <Col>
          <ProbeChain items={S2.items} cols={2} audio={audio} onSolved={solve} />
        </Col>
      </Cols>
    )}
  </Screen>
)

const Screen3 = (p) => (
  <Screen data={S3} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S3.show.length && !solved ? (
      /* Kadr 1 -- bitta yoq, kadr 2 -- ikkinchisi ham va qirra ajratilgan. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.45} pts={PTS}
            planes={phase === 0 ? [FACES[0]] : FACES}
            segs={[EDGE]} hide={H_EDGE}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} pts={PTS} planes={FACES} segs={[EDGE]} hide={H_EDGE} />}
        prompt={S3.work.prompt}
        answer={num(S3.work.answer)}
        okText={S3.work.ok}
        hints={S3.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* DARSNING SHOHIDI. Kadr 1 -- burchak `A` nuqtada, kadr 2 -- nuqta `B` ga
         ko'chdi va ikkinchi duga BIRINCHISI BILAN BIR XIL. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.45} pts={PTS} planes={FACES}
            segs={phase === 0 ? RAYS_A : RAYS_AB}
            hide={phase === 0 ? H_A : H_AB}
            arcAt={phase === 0 ? ARC_A : [ARC_A, ARC_B]}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} pts={PTS} planes={FACES} segs={RAYS_AB} hide={H_AB} arcAt={[ARC_A, ARC_B]} />}
        prompt={S4.work.prompt}
        answer={num(S4.work.answer)}
        okText={S4.work.ok}
        hints={S4.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      /* CHEGARA. `D` nuri yoqda yotadi, lekin qirraga perpendikulyar emas, va
         uning dugasi burilishda o'zgaradi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={phase === 0 ? 0.2 : 0.85} pts={PTS} planes={FACES}
            segs={RAYS_BAD} hide={H_BAD} arcAt={[ARC_A, ARC_BAD]}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.2}
        scene={<Space step={1} pts={PTS} planes={FACES} segs={RAYS_BAD} hide={H_BAD} arcAt={[ARC_A, ARC_BAD]} />}
        prompt={S5.work.prompt}
        answer={num(S5.work.answer)}
        okText={S5.work.ok}
        hints={S5.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      /* To'rt burchak: tekisliklar TO'LIQ, chunki gap qirra atrofidagi to'rt
         burchak haqida, yarimtekisliklar haqida emas. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} pts={PTS} planes={FULL_50}
            segs={RAYS_50} hide={H_FOUR}
            arcAt={phase === 0 ? ARC_50 : [ARC_50, ARC_130]}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene
            fig={<Space step={1} yaw={0.4} pts={PTS} planes={FULL_50} segs={RAYS_50} hide={H_FOUR} arcAt={[ARC_50, ARC_130]} />}
            max={240}
            h={150}
          />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S6.work.prompt}
            answer={num(S6.work.answer)}
            okText={S6.work.ok}
            hints={S6.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} pts={PTS} planes={FULL_90}
            segs={RAYS_90} hide={H_FOUR90}
            angleAt={phase === 0 ? RIGHT_90[0] : RIGHT_90}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene
            fig={<Space step={1} yaw={0.4} pts={PTS} planes={FULL_90} segs={RAYS_90} hide={H_FOUR90} angleAt={RIGHT_90} />}
            max={240}
            h={150}
          />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S7.work.prompt}
            answer={num(S7.work.answer)}
            okText={S7.work.ok}
            hints={S7.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen8 = (p) => (
  <Screen data={S8} waitFor={['rule']} {...p}>
    {(s) => (
      <RuleBody
        {...s}
        data={S8}
        fig={(solved) => (
          <Scene
            fig={(
              <Space
                step={1} yaw={solved ? 0.8 : 0.35} pts={PTS} planes={FACES}
                segs={RAYS_A} hide={H_A} arcAt={ARC_A}
              />
            )}
            max={330}
          />
        )}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={EQ_LEFT}
        right={EQ_RIGHT}
        okText={S9.match.ok}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

const Screen10 = (p) => (
  <Screen data={S10} {...p}>
    {({ audio, solve }) => (
      <ProofRows
        given={S10.proof.given}
        goal={S10.proof.goal}
        rows={PROOF_ROWS}
        reasons={REASONS}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

const Screen11 = (p) => (
  <Screen data={S11} {...p}>
    {({ audio, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <OrderRow
        prompt={S11.order.prompt}
        items={ORD11}
        answer={ORD11_ANS}
        okText={S11.order.ok}
        badText={S11.order.bad}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="big" style={{ textAlign: 'left' }}>{S11.task.prompt}</Expr>
          </Panel>
        </Col>
        <Col>
          <NumberEntry
            answer={num(S11.task.answer)}
            okText={S11.task.ok}
            hints={S11.task.hint}
            audio={audio}
            onSolved={() => setTimeout(() => { setTitle(S11.order.title); setStage(1) }, 1400)}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen12 = (p) => (
  <Screen data={S12} {...p}>
    {({ audio, stage, setStage, solve }) => (
      <Cols l={1.1} r={1}>
        <Col>
          <AuditRows
            rows={TRAP_ROWS}
            answerId={S12.answerId}
            hints={S12.hint}
            proof={S12.proof}
            hideProof
            audio={audio}
            onSolved={() => setStage(1)}
          />
        </Col>
        <Col>
          {stage === 1 ? (
            <NumberEntry
              compact
              prompt={S12.entry.prompt}
              answer={num(S12.entry.answer)}
              okText={S12.entry.ok}
              hints={S12.entry.hint}
              audio={audio}
              onSolved={solve}
            />
          ) : (
            <Slot mh={170} />
          )}
        </Col>
      </Cols>
    )}
  </Screen>
)

const Screen13 = (p) => (
  <Screen data={S13} {...p}>
    {({ audio, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <MultiPick
        prompt={S13.multi.prompt}
        items={S13.multi.items}
        okText={S13.multi.ok}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="mid">{S13.place.step}</Expr>
          </Panel>
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S13.place.prompt}
            answer={num(S13.place.target)}
            okText={S13.place.ok}
            hints={[S13.place.wrong]}
            audio={audio}
            onSolved={() => setTimeout(() => { setTitle(S13.multi.title); setStage(1) }, 1500)}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen14 = (p) => (
  <Screen data={S14} {...p}>
    {(s) => (
      <BlitzBody
        {...s}
        data={S14}
        fig={(round) => (
          <Scene
            fig={(
              <Space
                step={1} yaw={0.35 + round * 0.3} pts={PTS}
                planes={round === 1 ? FULL_50 : FACES}
                segs={round === 1 ? RAYS_50 : RAYS_A}
                hide={round === 1 ? H_FOUR : H_A}
                arcAt={round === 1 ? ARC_50 : ARC_A}
              />
            )}
            max={260}
            h={168}
          />
        )}
      />
    )}
  </Screen>
)

const Screen15 = (p) => (
  <Screen data={S15} {...p}>
    {(s) => (
      <SummaryBody
        {...s}
        data={{
          ...S15,
          hookLabels: { a: S15.hook.a, b: S15.hook.b, both: '?', none: '?' },
          sheetSteps: S15.sheet,
        }}
        answers={p.answers}
      />
    )}
  </Screen>
)

const SCREENS = [
  Screen1, Screen2, Screen3, Screen4, Screen5,
  Screen6, Screen7, Screen8, Screen9, Screen10,
  Screen11, Screen12, Screen13, Screen14, Screen15,
]

export default makeLesson({
  meta: { id: LESSON_ID, no: LESSON_NO, title: LESSON_TITLE },
  block: BLOCK,
  screens: SCREENS,
  voice: 'm',
})
