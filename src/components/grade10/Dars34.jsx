// ============================================================================
// 10-sinf, Dars 34. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS34_KONTENT.md
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
const LESSON_NO = 34
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. To'g'ri chiziq va tekislik orasidagi burchak`,
  `Урок ${LESSON_NO}. Угол между прямой и плоскостью`,
  `Lesson ${LESSON_NO}. The angle between a line and a plane`,
)

const BLOCK = { label: 'B6', from: 28, to: 36, current: 34 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('BURCHAK', 'УГОЛ', 'THE ANGLE'),
  title: L('Burchak nima bilan olinadi', 'С чем берут угол', 'What the angle is taken with'),
  audio: [
    A('mount', "To'g'ri chiziq tekislikni kesib o'tadi va unga perpendikulyar emas. Ular orasidagi burchak hali belgilanmagan.", 'Прямая пересекает плоскость и не перпендикулярна ей. Угол между ними ещё не отмечен.', 'A line crosses the plane and is not perpendicular to it. The angle between them is not marked yet.'),
    A('r1', "Birinchi yozuv shunday deydi. Tekislikda kesishish nuqtasi orqali istalgan to'g'ri chiziqni olamiz va u bilan burchakni o'lchaymiz.", 'Первая запись говорит так. Берём в плоскости любую прямую через точку пересечения и мерим угол с ней.', 'The first reading says this. Take any line of the plane through the crossing point and measure the angle with it.'),
    A('r2', 'Ikkinchisi istalgan chiziqni emas, proyeksiyani oladi.', 'Вторая берёт не любую прямую, а проекцию.', 'The second takes not any line but the projection.'),
    A('ask', "Tekislikda to'g'ri chiziqlar cheksiz ko'p, va ular bilan burchaklar boshqa-boshqa. Sizningcha qaysi yozuv to'g'ri?", 'Прямых в плоскости бесконечно много, и углы с ними разные. Как думаешь, какая запись верная?', 'There are infinitely many lines in the plane and the angles with them differ. Which reading do you think is correct?'),
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
      name: L("tekislik chizig'i bilan", 'с прямой плоскости', 'with a line of the plane'),
      value: '∠(a; α) = ∠(a; b),   b ⊂ α',
    },
    b: {
      name: L('proyeksiya bilan', 'с проекцией', 'with the projection'),
      value: '∠(a; α) = ∠(a; a₁)',
    },
  },
  expr: 'a ∩ α = A',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L("O'tgan darsdan uch savol", 'Три вопроса из прошлого урока', 'Three questions from the last lesson'),
  tag: 'support',
  audio: [
    A('mount', "O'tgan dars haqida uch savol. Proyeksiya darhol kerak bo'ladi.", 'Три вопроса про прошлый урок. Проекция понадобится сразу.', 'Three questions about the last lesson. The projection will be needed at once.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Og'maning proyeksiyasi nima?", 'Что такое проекция наклонной?', 'What is the projection of an oblique?'),
      done: 'BC ⊂ α',
      items: [
        { id: 'a', label: L('asoslar orasidagi kesma', 'отрезок между основаниями', 'the segment between the feet'), correct: true },
        { id: 'b', label: L("og'maning o'zi", 'сама наклонная', 'the oblique itself'), hint: L("Og'ma tekislikda yotmaydi, proyeksiya esa yotadi.", 'Наклонная в плоскости не лежит, а проекция лежит.', 'An oblique does not lie in the plane, a projection does.') },
        { id: 'c', label: L('perpendikulyar', 'перпендикуляр', 'the perpendicular'), hint: L('Perpendikulyar tekislikka faqat keladi, unda bormaydi.', 'Перпендикуляр только приходит в плоскость, а не идёт по ней.', 'A perpendicular only arrives at the plane, it does not run along it.') },
        { id: 'd', label: L('butun tekislik', 'вся плоскость', 'the whole plane'), hint: L("Kesmaning proyeksiyasi kesma bo'ladi.", 'Проекция отрезка это отрезок.', 'The projection of a segment is a segment.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Bitta nuqtadan nima qisqaroq?', 'Что короче из одной точки?', 'Which is shorter from one point?'),
      done: 'AB < AC',
      items: [
        { id: 'a', label: L('perpendikulyar', 'перпендикуляр', 'the perpendicular'), correct: true },
        { id: 'b', label: L("og'ma", 'наклонная', 'the oblique'), hint: L("Og'ma o'sha uchburchakda gipotenuza.", 'Наклонная гипотенуза в том же треугольнике.', 'The oblique is the hypotenuse in that triangle.') },
        { id: 'c', label: L('ular teng', 'они равны', 'they are equal'), hint: L("Ular faqat proyeksiya nol bo'lganda teng bo'lardi.", 'Равны они были бы только при нулевой проекции.', 'They would be equal only with a zero projection.') },
        { id: 'd', label: L("tekislikka bog'liq", 'зависит от плоскости', 'it depends on the plane'), hint: L("Uchburchak har qanday tekislikda to'g'ri burchakli.", 'Треугольник прямоугольный при любой плоскости.', 'The triangle is right-angled for any plane.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Uch perpendikulyar haqidagi teorema nima beradi?', 'Что даёт теорема о трёх перпендикулярах?', 'What does the theorem of three perpendiculars give?'),
      done: 'c ⊥ BC ⇔ c ⊥ AC',
      items: [
        { id: 'a', label: L("perpendikulyarlikni proyeksiyadan og'maga o'tkazadi", 'переносит перпендикулярность с проекции на наклонную', 'it carries perpendicularity from the projection to the oblique'), correct: true },
        { id: 'b', label: L('uzunliklarni solishtiradi', 'сравнивает длины', 'it compares lengths'), hint: L("Unda uzunliklar haqida gap yo'q.", 'Про длины там речи нет вовсе.', 'It says nothing about lengths at all.') },
        { id: 'c', label: L('perpendikulyar quradi', 'строит перпендикуляр', 'it builds a perpendicular'), hint: L('Perpendikulyar unda allaqachon berilgan.', 'Перпендикуляр в ней уже дан.', 'The perpendicular is already given in it.') },
        { id: 'd', label: L("burchakni o'lchaydi", 'измеряет угол', 'it measures the angle'), hint: L("U burchaklarni hisoblamaydi, ularni o'tkazadi.", 'Углы она не считает, она их переносит.', 'It does not compute angles, it carries them over.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Perpendikulyar asoslari to'g'ri chiziq beradi", 'Основания перпендикуляров дают прямую', 'The feet of the perpendiculars give a line'),
  tag: 'kartinka-kak-dokazatelstvo',
  show: [
    [
      L("to'g'ri chiziq nuqtalaridan perpendikulyarlar tushadi", 'из точек прямой падают перпендикуляры', 'perpendiculars drop from the points of the line'),
      L('ularning asoslari tekislikka tushadi', 'их основания ложатся в плоскость', 'their feet land in the plane'),
    ],
    [
      L("asoslar bitta to'g'ri chiziqqa tushdi", 'основания легли на одну прямую', 'the feet fell on one line'),
      L("bu to'g'ri chiziqning tekislikdagi proyeksiyasi", 'это проекция прямой на плоскость', 'this is the projection of the line on the plane'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "To'g'ri chiziqda bir necha nuqta olamiz va har biridan tekislikka perpendikulyar tushiramiz.", 'Возьмём на прямой несколько точек и из каждой опустим перпендикуляр на плоскость.', 'Take several points on the line and drop a perpendicular from each onto the plane.'),
    A('move', "Asoslar qayerga tushishiga qarang. Ular sochilib ketmadi, bitta to'g'ri chiziqqa tizildi, va bu chiziq bizning to'g'ri chizig'imizning tekislikdagi proyeksiyasi deb ataladi. Darslikda bir yuz o'ttiz sakkizinchi betda ham shunday yozilgan. Sahnani buring va proyeksiyaga qarang. U sahnaning har qanday holatida tekislikda qoladi, chunki tekislik nuqtalaridan qurilgan. Og'ma chiziq burilishda tekislikdan chiqadi, uning proyeksiyasi esa yo'q.", 'Смотри, куда попадают основания. Они не разбросаны, они выстроились в одну прямую, и эта прямая называется проекцией нашей прямой на плоскость. Так и написано в учебнике на странице сто тридцать восемь. Поверни сцену и следи за проекцией. Она остаётся в плоскости при любом положении сцены, потому что построена из точек плоскости. Наклонная прямая при повороте уходит из плоскости, а её проекция нет.', 'Look at where the feet land. They are not scattered, they line up on one line, and that line is called the projection of our line on the plane. That is exactly what the textbook says on page one hundred thirty eight. Rotate the scene and watch the projection. It stays in the plane at any position of the scene, because it is built from points of the plane. Under rotation the slanted line leaves the plane, its projection does not.'),
    A('work', "O'zingiz hisoblang. Bu perpendikulyarlarning asoslaridan nechta to'g'ri chiziq chiqadi?", 'Посчитай сам. Сколько прямых получается из оснований этих перпендикуляров?', 'Work it out yourself. How many lines come out of the feet of these perpendiculars?'),
  ],
  work: {
    prompt: L("Asoslar nechta to'g'ri chiziq beradi?", 'Сколько прямых дают основания?', 'How many lines do the feet give?'),
    ok: L("Bitta. Barcha perpendikulyarlarning asoslari bitta to'g'ri chiziqda yotadi, va bu proyeksiya.", 'Одна. Основания всех перпендикуляров лежат на одной прямой, и это проекция.', 'One. The feet of all the perpendiculars lie on one line, and that is the projection.'),
    hint: [
      L('Asoslar sochilganmi yoki tizilganmi, qarang.', 'Посмотри, разбросаны основания или выстроены.', 'See whether the feet are scattered or lined up.'),
      L("Ikki nuqta orqali roppa-rosa bitta to'g'ri chiziq o'tadi.", 'Через две точки проходит ровно одна прямая.', 'Exactly one line passes through two points.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: 'a₁ ⊂ α',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Ikki duga, va ular boshqa-boshqa', 'Две дуги, и они разные', 'Two arcs, and they differ'),
  tag: 'ugol-ne-s-proekciey',
  show: [
    [
      L("biri to'g'ri chiziq va proyeksiya orasida", 'одна дуга между прямой и проекцией', 'one arc between the line and the projection'),
      L("ikkinchisi to'g'ri chiziq va tekislikning boshqa chizig'i orasida", 'другая между прямой и второй прямой плоскости', 'the other between the line and a second line of the plane'),
    ],
    [
      L('sahnani buring va dugalarni solishtiring', 'поверни сцену и сравни дуги', 'rotate the scene and compare the arcs'),
      L('proyeksiya bilan burchak eng kichik', 'с проекцией угол наименьший', 'with the projection the angle is the smallest'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Tekislikda o'sha nuqta orqali ikkinchi to'g'ri chiziq olingan, va u bilan burchak ham duga bilan belgilangan.", 'В плоскости взята вторая прямая через ту же точку, и угол с ней тоже отмечен дугой.', 'A second line of the plane is taken through the same point, and the angle with it is also marked by an arc.'),
    A('move', "Qimirlamas chizmada ikkinchi duga kichikroq ko'rinadi, va qo'l o'zi uni olishga cho'ziladi. Sahnani buring va yana qarang. Proyeksiya bilan duga har qanday holatda eng tor qoladi, ikkinchisi esa goh o'sadi, goh qisqaradi, chunki biz uni turli rakursdan ko'ramiz. To'g'ri chiziq va tekislik orasidagi burchak deb aynan eng kichigi olinadi, va u proyeksiyada erishiladi. Tekislikning qolgan barcha chiziqlari kattaroq burchak beradi.", 'На неподвижном чертеже вторая дуга кажется меньше, и рука сама тянется взять её. Поверни сцену и посмотри снова. Дуга с проекцией остаётся самой узкой при любом положении, а вторая то растёт, то сжимается, потому что мы видим её под разными ракурсами. Углом между прямой и плоскостью считают именно наименьший, и он достигается на проекции. Все остальные прямые плоскости дают углы больше.', 'On a still drawing the second arc seems smaller, and the hand reaches for it by itself. Rotate the scene and look again. The arc with the projection stays the narrowest at any position, while the second one grows and shrinks, because we see it from different views. The angle between a line and a plane is taken to be the smallest one, and it is reached on the projection. All the other lines of the plane give bigger angles.'),
    A('work', "O'zingiz hisoblang. Tekislikning nechta chizig'i bizning chizig'imiz bilan eng kichik burchak beradi?", 'Посчитай сам. Сколько прямых плоскости дают наименьший угол с нашей прямой?', 'Work it out yourself. How many lines of the plane give the smallest angle with our line?'),
  ],
  work: {
    prompt: L('Shunday chiziq nechta?', 'Сколько таких прямых?', 'How many such lines?'),
    ok: L('Bitta, va bu proyeksiya. Qolganlari kattaroq burchak beradi.', 'Одна, и это проекция. Остальные дают углы больше.', 'One, and it is the projection. The rest give bigger angles.'),
    hint: [
      L("Sahnani buring va qaysi duga doim tor qolishini ko'ring.", 'Поверни сцену и посмотри, какая дуга остаётся узкой всегда.', 'Rotate the scene and see which arc always stays narrow.'),
      L("To'g'ri chiziqning proyeksiyasi bitta.", 'Проекция у прямой одна.', 'A line has one projection.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: '∠(a; a₁) < ∠(a; b)',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('CHEGARA HOLLAR', 'КРАЙНИЕ СЛУЧАИ', 'THE EXTREME CASES'),
  title: L("To'qson va nol", 'Девяносто и ноль', 'Ninety and zero'),
  tag: 'ugol-ne-s-proekciey',
  show: [
    [
      L("to'g'ri chiziq tekislikka perpendikulyar bo'ldi", 'прямая встала перпендикулярно плоскости', 'the line stood perpendicular to the plane'),
      L('uning proyeksiyasi nuqtaga siqildi', 'её проекция сжалась в точку', 'its projection shrank to a point'),
    ],
    [
      L("endi to'g'ri chiziq tekislikka parallel", 'теперь прямая параллельна плоскости', 'now the line is parallel to the plane'),
      L('proyeksiya uning yonidan boradi', 'проекция идёт рядом с ней', 'the projection runs beside it'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Ta'rif qamramaydigan ikki hol, va darslik ularni alohida beradi.", 'Два случая, которые определением не покрываются, и учебник задаёт их отдельно.', 'Two cases the definition does not cover, and the textbook sets them separately.'),
    A('move', "Avval to'g'ri chiziq tekislikka perpendikulyar. Uning proyeksiyasi nuqtaga siqildi, va proyeksiya bilan burchakni qurib bo'lmaydi. Bu hol uchun burchak to'qson darajaga teng deb olinadi. Endi to'g'ri chiziq tekislikka parallel. Proyeksiya uning yonidan boradi va uni hech qachon uchratmaydi, va bu holda burchak nolga teng deb olinadi. Ikkala kelishuv ham darslikning bir yuz o'ttiz sakkizinchi betida yozilgan, va ikkalasi ham qolgan burchaklar bilan mos.", 'Сначала прямая перпендикулярна плоскости. Её проекция сжалась в точку, и угол с проекцией уже не построить. Для этого случая угол считают равным девяноста градусам. Теперь прямая параллельна плоскости. Проекция идёт рядом с ней и никогда её не встретит, и угол в этом случае считают равным нулю. Оба соглашения записаны в учебнике на странице сто тридцать восемь, и оба согласованы с остальными углами.', 'First the line is perpendicular to the plane. Its projection shrank to a point and the angle with the projection can no longer be built. For that case the angle is taken to be ninety degrees. Now the line is parallel to the plane. The projection runs beside it and will never meet it, and in that case the angle is taken to be zero. Both conventions are written in the textbook on page one hundred thirty eight, and both agree with the other angles.'),
    A('work', "O'zingiz hisoblang. Tekislik va unga perpendikulyar to'g'ri chiziq orasidagi burchak necha daraja?", 'Посчитай сам. Сколько градусов в угле между плоскостью и перпендикулярной ей прямой?', 'Work it out yourself. How many degrees are in the angle between a plane and a line perpendicular to it?'),
  ],
  work: {
    prompt: L('Necha daraja?', 'Сколько градусов?', 'How many degrees?'),
    ok: L("To'qson. Proyeksiya nuqtaga siqildi, va bu darslikdagi kelishuv.", 'Девяносто. Проекция сжалась в точку, и это соглашение из учебника.', 'Ninety. The projection shrank to a point, and this is the convention from the textbook.'),
    hint: [
      L("Proyeksiya nimaga aylanganini ko'ring.", 'Посмотри, во что превратилась проекция.', 'See what the projection has turned into.'),
      L("Perpendikulyar tekislikning har bir chizig'i bilan to'g'ri burchak beradi.", 'Перпендикуляр даёт прямой угол с каждой прямой плоскости.', 'A perpendicular gives a right angle with every line of the plane.'),
      L("To'qson.", 'Девяносто.', 'Ninety.'),
    ],
    answer: '90',
  },
  expr: 'a ⊥ α   →   ∠(a; α) = 90°',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Yoq diagonali va asos', 'Диагональ грани и основание', 'A face diagonal and the base'),
  tag: 'ugol-ne-s-proekciey',
  show: [
    [
      L('kubda yon yoqning diagonali olingan', 'в кубе взята диагональ боковой грани', 'a diagonal of a side face is taken in the cube'),
      L('uning proyeksiyasi asos qirrasi', 'её проекция это ребро основания', 'its projection is an edge of the base'),
    ],
    [
      L('kubni buring va uchburchakka qarang', 'поверни куб и посмотри на треугольник', 'rotate the cube and look at the triangle'),
      L('uning ikki kateti teng', 'два его катета равны', 'its two legs are equal'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Kub, va unda yon yoqning diagonali. Uning asos tekisligidagi proyeksiyasi qirra.', 'Куб, и в нём диагональ боковой грани. Её проекция на плоскость основания это ребро.', 'A cube, and in it a diagonal of a side face. Its projection on the plane of the base is an edge.'),
    A('move', "Diagonal, uning proyeksiyasi va yon qirra to'g'ri burchakli uchburchak beradi. To'g'ri burchak yon qirra asosga kelgan joyda turadi, va nima uchun ekanini biz allaqachon bilamiz. Kubning barcha qirralari teng, demak bu uchburchakning ikki kateti teng, bunday to'g'ri burchakli uchburchak esa teng yonli. Uning gipotenuzasidagi burchaklar qirq besh daraja. Kubni buring va uchburchak hech qanday burilishda buzilmasligiga ishonch hosil qiling. Burchak hisoblangan, rasmdan o'lchanmagan.", 'Диагональ, её проекция и боковое ребро дают прямоугольный треугольник. Прямой угол стоит там, где боковое ребро приходит в основание, и мы уже знаем почему. У куба все рёбра равны, значит два катета этого треугольника равны, а такой прямоугольный треугольник равнобедренный. Углы при его гипотенузе по сорок пять градусов. Поверни куб и убедись, что треугольник не разваливается ни при каком повороте. Угол посчитан, а не измерен с картинки.', 'The diagonal, its projection and the side edge give a right triangle. The right angle stands where the side edge arrives at the base, and we already know why. All edges of a cube are equal, so the two legs of that triangle are equal, and such a right triangle is isosceles. The angles at its hypotenuse are forty five degrees each. Rotate the cube and make sure the triangle does not fall apart at any rotation. The angle is computed, not measured off the picture.'),
    A('work', "O'zingiz hisoblang. Yoq diagonali va asos tekisligi orasida necha daraja?", 'Посчитай сам. Сколько градусов между диагональю грани и плоскостью основания?', 'Work it out yourself. How many degrees are between the face diagonal and the plane of the base?'),
  ],
  work: {
    prompt: L('Necha daraja?', 'Сколько градусов?', 'How many degrees?'),
    ok: L('Qirq besh. Katetlar teng, uchburchak teng yonli.', 'Сорок пять. Катеты равны, треугольник равнобедренный.', 'Forty five. The legs are equal, the triangle is isosceles.'),
    hint: [
      L("Gipotenuzasida shu diagonal bo'lgan to'g'ri burchakli uchburchakni toping.", 'Найди прямоугольный треугольник с этой диагональю в гипотенузе.', 'Find the right triangle with this diagonal as the hypotenuse.'),
      L('Kubning yon qirrasi va asos qirrasi teng.', 'Боковое ребро и ребро основания у куба равны.', 'The side edge and the base edge of a cube are equal.'),
      L("Teng yonli to'g'ri burchakli uchburchakda o'tkir burchaklar qirq beshtadan.", 'В равнобедренном прямоугольном треугольнике острые углы по сорок пять.', 'In an isosceles right triangle the acute angles are forty five each.'),
    ],
    answer: '45',
  },
  expr: 'AB₁ ⊥̸ ABCD,   AB = BB₁',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L("Proyeksiya nuqta bo'lganda", 'Когда проекция это точка', 'When the projection is a point'),
  tag: 'odnoy-pryamoy-hvatit',
  show: [
    [
      L("chiziq og'gan, proyeksiya kesma", 'прямая наклонена, проекция это отрезок', 'the line is slanted, the projection is a segment'),
      L("og'ish kamayadi, proyeksiya qisqaradi", 'наклон уменьшается, проекция короче', 'the slant decreases, the projection gets shorter'),
    ],
    [
      L('chiziq tik turdi', 'прямая встала вертикально', 'the line stood upright'),
      L('proyeksiya nuqtaga aylandi', 'проекция стала точкой', 'the projection became a point'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Chiziq og'gan, va uning proyeksiyasi tekislikdagi kesma.", 'Прямая наклонена, и её проекция это отрезок в плоскости.', 'The line is slanted, and its projection is a segment in the plane.'),
    A('move', "Proyeksiya tobora qisqaradi, va chiziq tekislikka perpendikulyar bo'lgan paytda u bitta nuqtaga yig'iladi. Bu qulay tekshiruv, va u ikki tomonga ishlaydi. Agar chiziqning proyeksiyasi nuqta bo'lsa, chiziq tekislikka perpendikulyar. Agar proyeksiya kesma bo'lsa, chiziq og'gan, va tekislik bilan burchak to'qson darajadan kichik. E'tibor bering, tekislikning barcha chiziqlari bilan burchakni tekshirish kerak emas, proyeksiyaga qarash yetarli.", 'Проекция становится всё короче, и в момент, когда прямая перпендикулярна плоскости, она стягивается в одну точку. Это удобная проверка, и она работает в обе стороны. Если проекция прямой это точка, то прямая перпендикулярна плоскости. Если проекция это отрезок, то прямая наклонена, и угол с плоскостью меньше девяноста градусов. Заметь, что проверять углы со всеми прямыми плоскости не нужно, достаточно посмотреть на проекцию.', 'The projection gets shorter and shorter, and at the moment the line is perpendicular to the plane it collapses into a single point. This is a handy check and it works both ways. If the projection of a line is a point, the line is perpendicular to the plane. If the projection is a segment, the line is slanted and the angle with the plane is less than ninety degrees. Note that there is no need to check the angles with all the lines of the plane, it is enough to look at the projection.'),
    A('work', "O'zingiz hisoblang. Tekislikka perpendikulyar to'g'ri chiziqning proyeksiyasida nechta nuqta bor?", 'Посчитай сам. Сколько точек в проекции прямой, перпендикулярной плоскости?', 'Work it out yourself. How many points are in the projection of a line perpendicular to the plane?'),
  ],
  work: {
    prompt: L('Proyeksiyada nechta nuqta?', 'Сколько точек в проекции?', 'How many points are in the projection?'),
    ok: L('Bitta. Chiziq nuqtalaridan chiqqan barcha perpendikulyarlar bitta nuqtaga keladi.', 'Одна. Все перпендикуляры из точек прямой приходят в одну точку.', 'One. All the perpendiculars from the points of the line arrive at one point.'),
    hint: [
      L("Chiziqning turli nuqtalaridan perpendikulyarlar qayerga tushishini ko'ring.", 'Посмотри, куда падают перпендикуляры из разных точек прямой.', 'See where the perpendiculars from different points of the line land.'),
      L("Chiziqning o'zi har bir nuqtasi uchun perpendikulyar.", 'Сама прямая и есть перпендикуляр для каждой своей точки.', 'The line itself is the perpendicular for each of its points.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: 'a ⊥ α   →   a₁ = A',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Ta'rif va ikki kelishuv", 'Определение и два соглашения', 'The definition and two conventions'),
  tag: 'ugol-ne-s-proekciey',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Ta'rif qisqa, va uning butun kuchi proyeksiya so'zida. Chiziqning proyeksiyasi bitta, shuning uchun burchak ham bitta. Tekislikning boshqa istalgan chizig'ini olsangiz, burchak kattaroq chiqadi, ya'ni bu chiziq bilan burchak bo'ladi, tekislik bilan emas. Ikki chegara hol alohida yozilgan, chunki ularda oddiy ma'nodagi proyeksiya yo'q. Perpendikulyar chiziq to'qson beradi, parallel esa nol.", 'Определение короткое, и вся его сила в слове проекция. Проекция у прямой одна, поэтому и угол один. Возьми любую другую прямую плоскости, и угол получится больше, а значит это будет угол с прямой, а не с плоскостью. Два крайних случая дописаны отдельно, потому что в них проекции в обычном смысле нет. Перпендикулярная прямая даёт девяносто, параллельная ноль.', 'The definition is short and all its force is in the word projection. A line has one projection, so the angle is one too. Take any other line of the plane and the angle comes out bigger, which means it is an angle with a line and not with the plane. The two extreme cases are written separately, because in them there is no projection in the usual sense. A perpendicular line gives ninety, a parallel one gives zero.'),
  ],
  probe: {
    question: L("Tekislikning qaysi chizig'i bilan burchak olinadi?", 'С какой прямой плоскости берут угол?', 'With which line of the plane is the angle taken?'),
    items: [
      { id: 'a', label: L('proyeksiya bilan', 'с проекцией', 'with the projection'), correct: true },
      { id: 'b', label: L("kesishish nuqtasi orqali o'tuvchi istalgan chiziq bilan", 'с любой прямой через точку пересечения', 'with any line through the crossing point'), hint: L("Bunday chiziqlar cheksiz ko'p, va ularning burchaklari boshqa-boshqa.", 'Таких прямых бесконечно много, и углы у них разные.', 'There are infinitely many such lines and their angles differ.') },
    ],
  },
  rule: {
    lawLabel: L('Chiziq va tekislik burchagi', 'Угол прямой и плоскости', 'The angle of a line and a plane'),
    lines: [
      L('bu chiziq va uning shu tekislikdagi proyeksiyasi orasidagi burchak', 'это угол между прямой и её проекцией на эту плоскость', 'it is the angle between the line and its projection on that plane'),
      L("agar chiziq tekislikka perpendikulyar bo'lsa, burchak to'qson daraja deb olinadi", 'если прямая перпендикулярна плоскости, угол считают равным девяноста градусам', 'if the line is perpendicular to the plane, the angle is taken as ninety degrees'),
      L("agar chiziq tekislikka parallel bo'lsa, burchak nol deb olinadi", 'если прямая параллельна плоскости, угол считают равным нулю', 'if the line is parallel to the plane, the angle is taken as zero'),
    ],
    law: '∠(a; α) = ∠(a; a₁)',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Kub chiziqlari va asos', 'Прямые куба и основание', 'Lines of the cube and the base'),
  tag: 'ugol-ne-s-proekciey',
  audio: [
    A('mount', "Kubning to'rt chizig'i va to'rt burchak. Ularni birlashtiring.", 'Четыре прямые куба и четыре угла. Соедини их.', 'Four lines of the cube and four angles. Match them.'),
  ],
  match: {
    prompt: L('Chiziqni asosga burchagi bilan birlashtiring', 'Соедини прямую с её углом к основанию', 'Match the line with its angle to the base'),
    ok: L("To'rttasi ham joyida. Burchaklar hisoblangan, o'lchanmagan.", 'Все четыре на месте. Углы посчитаны, а не измерены.', 'All four in place. The angles are computed, not measured.'),
    a: L('nol daraja', 'ноль градусов', 'zero degrees'),
    b: L("to'qson daraja", 'девяносто градусов', 'ninety degrees'),
    c: L('qirq besh daraja', 'сорок пять градусов', 'forty five degrees'),
    d: L('qirq beshdan kichik', 'меньше сорока пяти', 'less than forty five'),
    left: ['AB', 'AA₁', 'AB₁', 'AC₁'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Diagonalning proyeksiyasini toping', 'Найди проекцию диагонали', 'Find the projection of the diagonal'),
  tag: 'ugol-ne-s-proekciey',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, and each has its own justification from the list.'),
  ],
  proof: {
    given: L('kub diagonali va asos tekisligi', 'диагональ куба и плоскость основания', 'a diagonal of a cube and the plane of the base'),
    goal: L('uning proyeksiyasi asos diagonali', 'её проекция это диагональ основания', 'its projection is a diagonal of the base'),
    r1: L('yon qirra asosga perpendikulyar', 'боковое ребро перпендикулярно основанию', 'the side edge is perpendicular to the base'),
    r2: L('demak perpendikulyarning asosi asos uchi', 'значит основание перпендикуляра это вершина основания', 'so the foot of the perpendicular is a vertex of the base'),
    r3: L('kesmaning proyeksiyasi uchlari proyeksiyalari orasidagi kesma', 'проекция отрезка это отрезок между проекциями концов', 'the projection of a segment is the segment between the projections of its ends'),
    ok: L('Isbotlandi. Kub diagonalining proyeksiyasi asos diagonali.', 'Доказано. Проекция диагонали куба это диагональ основания.', 'Proved. The projection of the cube diagonal is a diagonal of the base.'),
    e1: L("Proyeksiya ta'rifi keyin keladi. To'g'ri burchak qayerdan olingan.", 'Определение проекции идёт дальше. Откуда взят прямой угол.', 'The definition of projection comes later. Where does the right angle come from.'),
    e2: L("To'g'ri burchak bor. Gap u kelgan nuqta haqida.", 'Прямой угол уже есть. Речь о точке, куда он приходит.', 'The right angle is already there. This is about the point it arrives at.'),
    e3: L('Uchlari haqida aytildi. Endi butun kesma haqida.', 'Про концы сказано. Теперь про весь отрезок.', 'The ends are done. Now about the whole segment.'),
  },
  reason: {
    s1: L("kub yasalishiga ko'ra", 'по построению куба', 'by the construction of the cube'),
    s2: L("proyeksiya ta'rifi", 'определение проекции', 'the definition of projection'),
    s3: L('kesmaning proyeksiyasi', 'проекция отрезка', 'the projection of a segment'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'AC₁ → AC',
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
    A('mount', "Asbob olib qo'yildi. Bu yerda qog'ozda hisoblanadi.", 'Прибор убран. Здесь считают на бумаге.', 'The tool is put away. Here you count on paper.'),
    A('next', 'Endi yozuvlar tartibi. Ularni qanday olinsa, shunday joylashtiring.', 'Теперь порядок записей. Расставь их так, как их получают.', 'Now the order of the readings. Arrange them the way they are obtained.'),
  ],
  task: {
    ok: L('Qirq besh. Perpendikulyar va proyeksiya teng, uchburchak teng yonli.', 'Сорок пять. Перпендикуляр и проекция равны, треугольник равнобедренный.', 'Forty five. The perpendicular and the projection are equal, the triangle is isosceles.'),
    hint: [
      L("To'g'ri burchakli uchburchak chizing va katetlarni imzolang.", 'Нарисуй прямоугольный треугольник и подпиши катеты.', 'Draw a right triangle and label the legs.'),
      L("Burchak tangensi perpendikulyarning proyeksiyaga bo'lingani.", 'Тангенс угла это перпендикуляр, делённый на проекцию.', 'The tangent of the angle is the perpendicular divided by the projection.'),
      L('Tangens birga teng, demak burchak qirq besh.', 'Тангенс равен единице, значит угол сорок пять.', 'The tangent is one, so the angle is forty five.'),
    ],
    prompt: 'AB = 7,   BC = 7,   ∠(AC; α) = ?',
    answer: '45',
  },
  order: {
    prompt: L('Yozuvlarni olinish tartibida joylashtiring', 'Расставь записи в том порядке, в каком их получают', 'Arrange the readings in the order they are obtained'),
    title: L('Ish tartibi', 'Порядок работы', 'The order of work'),
    ok: L("Tartib to'g'ri. Proyeksiya burchakdan oldin quriladi, keyin emas.", 'Порядок верный. Проекция строится до угла, а не после.', 'The order is right. The projection is built before the angle, not after.'),
    bad: L('Bu tartibda emas. Avval nimani bilish kerak.', 'Не в этом порядке. Что нужно знать раньше.', 'Not in this order. What has to be known first.'),
    items: ['∠(a; α)', 'a ∩ α = A', 'a₁ ⊂ α', '∠(a; a₁)'],
    answer: 'a ∩ α = A  a₁ ⊂ α  ∠(a; a₁)  ∠(a; α)',
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
    A('mount', "To'rt qator, va ulardan biri burchakni almashtiradi.", 'Четыре строки, и одна из них подменяет угол.', 'Four lines, and one of them substitutes the angle.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Shart to'g'ri ko'chirilgan.", 'Условие переписано верно.', 'The condition is copied correctly.'),
    r2: L('Tekislikda chiziq olingan, va bu hozircha xato emas.', 'Прямая в плоскости взята, и это пока не ошибка.', 'A line in the plane is taken, and that is not a mistake yet.'),
    r4: L('Xulosa yuqoridagi xato qatordan olingan.', 'Вывод получен из неверной строки выше.', 'The conclusion comes from the wrong line above.'),
  },
  proof: L("Sahnani buring: bu chiziq bilan duga goh o'sadi, goh qisqaradi, proyeksiya bilan esa yo'q.", 'Поверни сцену: дуга с этой прямой то растёт, то сжимается, а с проекцией нет.', 'Rotate the scene: the arc with this line grows and shrinks, the one with the projection does not.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L("Uchinchi. Tekislik bilan burchak deb shu tekislik chizig'i bilan burchak aytilgan.", 'Третья. Углом с плоскостью назвали угол с прямой этой плоскости.', 'The third. The angle with a line of the plane was called the angle with the plane.'),
    hint: [
      L('Har qatorda burchak nima bilan olinayotganini tekshiring.', 'Проверь, с чем берут угол в каждой строке.', 'Check what the angle is taken with in each line.'),
      L("Bu isbotda proyeksiya biror marta ham paydo bo'lmadi.", 'Проекция в этом доказательстве не появилась ни разу.', 'The projection never appeared in this proof.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'a ∩ α = A',
    r2: 'b ⊂ α,   A ∈ b',
    r3: '∠(a; α) = ∠(a; b)',
    r4: '∠(a; α) = 30°',
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
    A('mount', "Ta'rifni o'ngdan chapga o'qiymiz. Burchak bo'yicha chiziqning holatini aytamiz.", 'Прочитаем определение справа налево. По углу назовём положение прямой.', 'Let us read the definition from right to left. From the angle we name the position of the line.'),
    A('work', "Doim to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны всегда. Их больше одной.', 'Mark all the readings that are always true. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Nima doim to'g'ri", 'Что верно всегда', 'What is always true'),
    ok: L("Beshtadan uch yozuv. Qolgan ikkitasi proyeksiya so'zida sinadi.", 'Три записи из пяти. Две оставшиеся ломаются на слове проекция.', 'Three readings out of five. The other two break at the word projection.'),
    items: [
      { id: 'd', label: '∠(a; α) = ∠(a; b)', hint: L("Bu tekislik chizig'i bilan burchak, tekislik bilan emas.", 'Это угол с прямой плоскости, а не с плоскостью.', 'That is an angle with a line of the plane, not with the plane.') },
      { id: 'e', label: '∠(a; α) = 120°', hint: L("Tekislik bilan burchak to'qson darajadan katta bo'lmaydi.", 'Угол с плоскостью не бывает больше девяноста градусов.', 'An angle with a plane is never more than ninety degrees.') },
      { id: 'a', label: '∠(a; α) ≤ 90°', ok: true },
      { id: 'b', label: '∠(a; α) = ∠(a; a₁)', ok: true },
      { id: 'c', label: 'a ⊥ α   →   ∠(a; α) = 90°', ok: true },
    ],
  },
  place: {
    prompt: L("To'g'ri chiziq va tekislik orasidagi burchak nolga teng. Ularning nechta umumiy nuqtasi bor?", 'Угол между прямой и плоскостью равен нулю. Сколько общих точек у них?', 'The angle between a line and a plane is zero. How many common points do they have?'),
    ok: L("Bitta ham yo'q. Nol burchak parallellik, parallel chiziq esa tekislikni uchratmaydi.", 'Ни одной. Нулевой угол это параллельность, а параллельная прямая плоскость не встречает.', 'None. A zero angle means parallel, and a parallel line does not meet the plane.'),
    wrong: L('Kartochkadagi ikkinchi kelishuvga qarang.', 'Посмотри на второе соглашение в карточке.', 'Look at the second convention on the card.'),
    target: '0',
    step: '∠(a; α) = 0°   →   a ∥ α',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'ugol-ne-s-proekciey',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Burchak nima bilan olinadi?', 'С чем берут угол?', 'What is the angle taken with?'),
      done: '∠(a; a₁)',
      items: [
        { id: 'a', label: L('proyeksiya bilan', 'с проекцией', 'with the projection'), correct: true },
        { id: 'b', label: L('perpendikulyar bilan', 'с перпендикуляром', 'with the perpendicular'), hint: L("Perpendikulyar bilan burchak doim to'g'ri, va u hech narsani ajratmaydi.", 'С перпендикуляром угол всегда прямой, и он ничего не различает.', 'With the perpendicular the angle is always right and tells nothing apart.') },
        { id: 'c', label: L("tekislikning istalgan chizig'i bilan", 'с любой прямой плоскости', 'with any line of the plane'), hint: L("Bunday chiziqlar cheksiz ko'p, va burchaklar boshqa-boshqa.", 'Таких прямых бесконечно много, и углы разные.', 'There are infinitely many such lines and the angles differ.') },
        { id: 'd', label: L('asos qirrasi bilan', 'с ребром основания', 'with the edge of the base'), hint: L('Qirra tekislik chiziqlaridan biri, boshqa emas.', 'Ребро это одна из прямых плоскости, не более.', 'An edge is one of the lines of the plane, no more.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Chiziq tekislikka perpendikulyar. Burchak?', 'Прямая перпендикулярна плоскости. Угол?', 'The line is perpendicular to the plane. The angle?'),
      done: '90°',
      items: [
        { id: 'a', label: L("to'qson", 'девяносто', 'ninety'), correct: true },
        { id: 'b', label: L('nol', 'ноль', 'zero'), hint: L('Nol parallelda.', 'Ноль у параллельной.', 'Zero belongs to a parallel line.') },
        { id: 'c', label: L('qirq besh', 'сорок пять', 'forty five'), hint: L('Bu son hech qayerdan chiqmaydi.', 'Это число ниоткуда не следует.', 'That number follows from nothing.') },
        { id: 'd', label: L('burchak aniqlanmagan', 'угол не определён', 'the angle is undefined'), hint: L('Bu hol uchun darslik alohida kelishuv beradi.', 'Для этого случая учебник даёт отдельное соглашение.', 'For this case the textbook gives a separate convention.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Chiziqning proyeksiyasi nuqta. Chiziq qanday?', 'Проекция прямой это точка. Что с прямой?', 'The projection of a line is a point. What about the line?'),
      done: 'a₁ = A',
      items: [
        { id: 'a', label: L('tekislikka perpendikulyar', 'перпендикулярна плоскости', 'perpendicular to the plane'), correct: true },
        { id: 'b', label: L('tekislikka parallel', 'параллельна плоскости', 'parallel to the plane'), hint: L('Parallelda proyeksiya chiziq, nuqta emas.', 'У параллельной проекция это прямая, а не точка.', 'For a parallel line the projection is a line, not a point.') },
        { id: 'c', label: L('tekislikda yotadi', 'лежит в плоскости', 'lies in the plane'), hint: L("Unda proyeksiya chiziqning o'zi bilan ustma-ust tushardi.", 'Тогда проекция совпала бы с самой прямой.', 'Then the projection would coincide with the line itself.') },
        { id: 'd', label: L("qirq besh ostida og'gan", 'наклонена под сорок пять', 'slanted at forty five'), hint: L("Og'mada proyeksiya kesma.", 'У наклонной проекция это отрезок.', 'For a slanted line the projection is a segment.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Kub yoqining diagonali va asos. Burchak?', 'Диагональ грани куба и основание. Угол?', 'A face diagonal of a cube and the base. The angle?'),
      done: '45°',
      items: [
        { id: 'a', label: L('qirq besh', 'сорок пять', 'forty five'), correct: true },
        { id: 'b', label: L("o'ttiz", 'тридцать', 'thirty'), hint: L("O'ttiz katetlar bir va ikki bo'lganda chiqardi.", 'Тридцать вышло бы при катетах один и два.', 'Thirty would come from legs one and two.') },
        { id: 'c', label: L('oltmish', 'шестьдесят', 'sixty'), hint: L('Oltmish katetlarning boshqa nisbatidagi burchak.', 'Шестьдесят это угол при другом отношении катетов.', 'Sixty belongs to a different ratio of legs.') },
        { id: 'd', label: L("to'qson", 'девяносто', 'ninety'), hint: L("To'qson yon qirrada bo'lardi.", 'Девяносто было бы у бокового ребра.', 'Ninety would belong to the side edge.') },
      ],
    },
  ],
  angles: ['AB', 'AA₁', 'AB₁', 'AC₁'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', "Dars ikki yozuv bilan boshlandi. Birinchisida burchak tekislikning istalgan chizig'i bilan olingan edi.", 'Урок начался с двух записей. В первой угол брали с любой прямой плоскости.', 'The lesson began with two readings. In the first the angle was taken with any line of the plane.'),
    A('next', "Bunday chiziqlar cheksiz ko'p, va har biri o'z burchagini berardi, ya'ni ta'rif bo'sh bo'lardi. Chiziqning proyeksiyasi bitta, va u bilan burchak eng kichik. Shuning uchun ta'rifda aynan u turadi. Keyin bizga ikki tekislik orasidagi burchak kerak bo'ladi, va u yerda chiziqlarni emas, yarimtekisliklarni o'lchaymiz.", 'Таких прямых бесконечно много, и каждая давала бы свой угол, значит определение было бы пустым. Проекция у прямой одна, и угол с ней наименьший. Поэтому именно она стоит в определении. Дальше нам понадобится угол между двумя плоскостями, и там мерить будем не прямые, а полуплоскости.', 'There are infinitely many such lines and each would give its own angle, which means the definition would be empty. A line has one projection and the angle with it is the smallest. That is why it stands in the definition. Next we will need the angle between two planes, and there we will measure half-planes instead of lines.'),
  ],
  can: [
    L('Chiziqning tekislikdagi proyeksiyasini quraman', 'Строю проекцию прямой на плоскость', 'I build the projection of a line on a plane'),
    L('Burchakni proyeksiya bilan olaman, qulay chiziq bilan emas', 'Беру угол с проекцией, а не с удобной прямой', 'I take the angle with the projection, not with a convenient line'),
    L('Ikki chegara holni bilaman', 'Знаю два крайних случая', 'I know the two extreme cases'),
    L("Burchakni hisoblayman, rasmdan o'lchamayman", 'Считаю угол, а не измеряю с картинки', 'I compute the angle instead of measuring it off the picture'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L('Bundan keyin tekisliklar orasidagi burchak, ikki yoqli burchak va uning chiziqli burchagi', 'Дальше два угла между плоскостями — двугранный угол и его линейный угол', 'Next comes the angle between planes, the dihedral angle and its linear angle'),
  lifehack: L("Burchakni nima bilan o'lchashni bilmasangiz, proyeksiya quring", 'Не знаешь, с чем мерить угол — строй проекцию', 'If you do not know what to measure the angle with, build the projection'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L("Geometriya, bir yuz o'ttiz sakkizinchi bet", 'Геометрия, страница сто тридцать восемь', 'Geometry, page one hundred thirty eight'),
  hook: {
    a: '∠(a; b),   b ⊂ α',
    b: '∠(a; a₁)',
  },
  proved: '∠(a; α) = ∠(a; a₁)',
  law: 'a ∩ α = A,   a₁ ⊂ α',
  sheet: [
    'a₁ ⊂ α',
    '∠(a; α) = ∠(a; a₁)',
    '∠(a; a₁) < ∠(a; b)',
    'a ⊥ α   →   90°',
    'a ∥ α   →   0°',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))

// SAHNA 1 -- TEKISLIK VA OG'MA CHIZIQ. `A` -- kesishish nuqtasi, `P` -- og'ma
// chiziqning yuqori uchi, `Am` va `Ap` -- PROYEKSIYA chizig'ining uchlari,
// `Bm` va `Bp` -- tekislikning IKKINCHI chizig'i (u bilan burchak kattaroq).
// `F1..F3` -- og'ma chiziq nuqtalaridan tushirilgan perpendikulyarlar asoslari:
// 3-ekranda proyeksiya aynan ulardan yig'iladi.
const PTS = [
  { id: 'A', at: [0, 0, 0], label: 'A' },
  { id: 'P', at: [0.8, 0, 0.75], label: 'a' },
  { id: 'Am', at: [-0.55, 0, 0], label: '' },
  { id: 'Ap', at: [1.05, 0, 0], label: 'a₁' },
  { id: 'Bm', at: [-0.5, -0.72, 0], label: '' },
  { id: 'Bp', at: [0.5, 0.72, 0], label: 'b' },
  { id: 'P1', at: [0.27, 0, 0.25], label: '' },
  { id: 'P2', at: [0.53, 0, 0.5], label: '' },
  { id: 'F1', at: [0.27, 0, 0], label: '' },
  { id: 'F2', at: [0.53, 0, 0], label: '' },
  { id: 'V', at: [0, 0, 0.9], label: 'a' },
  { id: 'H1', at: [-0.62, 0, 0.45], label: 'a' },
  { id: 'H2', at: [0.62, 0, 0.45], label: '' },
]
const PLANE = [{ by: ['A', 'Ap', 'Bp'], dim: true }]
const GREY = '#7f8c8d'

const LINE_A = { from: 'A', to: 'P' }
const PROJ = { from: 'Am', to: 'Ap', tone: GREY, w: 2 }
const LINE_B = { from: 'Bm', to: 'Bp', tone: GREY, w: 2 }
const DROPS = [
  { from: 'P1', to: 'F1', tone: GREY, w: 1.4 },
  { from: 'P2', to: 'F2', tone: GREY, w: 1.4 },
  { from: 'P', to: 'Ap', tone: GREY, w: 1.4 },
]
const VERT = { from: 'A', to: 'V' }
const HORIZ = { from: 'H1', to: 'H2' }

// Kadr bo'yicha to'plamlar.
const SET_DROPS = [LINE_A, ...DROPS]
const SET_PROJ = [LINE_A, PROJ]
const SET_TWO = [LINE_A, PROJ, LINE_B]
const SET_VERT = [VERT, PROJ]
const SET_HORIZ = [HORIZ, PROJ]

const H_DROPS = ['Am', 'Bm', 'Bp', 'V', 'H1', 'H2']
const H_PROJ = ['Bm', 'Bp', 'P1', 'P2', 'F1', 'F2', 'V', 'H1', 'H2', 'Am']
const H_TWO = ['P1', 'P2', 'F1', 'F2', 'V', 'H1', 'H2', 'Am', 'Bm']
const H_VERT = ['P', 'Bm', 'Bp', 'P1', 'P2', 'F1', 'F2', 'H1', 'H2', 'Am', 'Ap']
const H_HORIZ = ['P', 'Bm', 'Bp', 'P1', 'P2', 'F1', 'F2', 'V', 'H2', 'Am']

// DUGA burchak QAYERDA ekanini ko'rsatadi, kattaligini emas (`Space` izohi).
const ARC_PROJ = { at: 'A', from: 'P', to: 'Ap', label: 'φ' }
const ARC_B = { at: 'A', from: 'P', to: 'Bp', label: 'ψ', scale: 1.75, tone: GREY }
const RIGHT_VERT = { at: 'A', from: 'V', to: 'Ap' }

// SAHNA 2 -- KUB. Yon yoq diagonali `AB₁` va uning asosdagi proyeksiyasi `AB`.
const DIAG = [{ from: 'A', to: 'B1' }]
const CUBE_HI = ['AB', 'BB1']
const BASE = [{ by: ['A', 'B', 'C'], dim: true }]
const ARC_CUBE = { at: 'A', from: 'B1', to: 'B', label: 'φ' }

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
        // Prognoz paytida DUGA YO'Q: burchak hali qo'yilmagan, va aynan shu
        // savol -- uni nima bilan qo'yish kerak.
        fig={() => (
          <Scene
            fig={<Space step={1} yaw={0.4} pts={PTS} planes={PLANE} segs={SET_TWO} hide={H_TWO} />}
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
            fig={<Space step={1} yaw={0.4} pts={PTS} planes={PLANE} segs={SET_PROJ} hide={H_PROJ} />}
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
      /* Kadr 1 -- perpendikulyarlar tushadi, kadr 2 -- asoslar chiziqqa
         tizildi va proyeksiya paydo bo'ldi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={phase * 0.45} pts={PTS} planes={PLANE}
            segs={phase === 0 ? SET_DROPS : [...SET_DROPS, PROJ]}
            hide={phase === 0 ? H_DROPS : H_DROPS.filter((k) => k !== 'Am')}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} pts={PTS} planes={PLANE} segs={[...SET_DROPS, PROJ]} hide={H_DROPS.filter((k) => k !== 'Am')} />}
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
      /* DARSNING SHOHIDI. Ikki duga bir vaqtda: proyeksiya bilan va
         tekislikning ikkinchi chizig'i bilan. Turg'un chizmada ikkinchisi
         kichikroq ko'rinadi, burilish esa buni rad etadi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={phase === 0 ? 0.25 : 0.9} pts={PTS} planes={PLANE}
            segs={SET_TWO} hide={H_TWO} arcAt={[ARC_PROJ, ARC_B]}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.25}
        scene={<Space step={1} pts={PTS} planes={PLANE} segs={SET_TWO} hide={H_TWO} arcAt={[ARC_PROJ, ARC_B]} />}
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
      /* Kadr 1 -- perpendikulyar chiziq, proyeksiya nuqta. Kadr 2 -- parallel
         chiziq, proyeksiya uning yonida. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} pts={PTS} planes={PLANE}
            segs={phase === 0 ? SET_VERT : SET_HORIZ}
            hide={phase === 0 ? H_VERT : H_HORIZ}
            angleAt={phase === 0 ? RIGHT_VERT : null}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene
            fig={<Space step={1} yaw={0.4} pts={PTS} planes={PLANE} segs={SET_VERT} hide={H_VERT} angleAt={RIGHT_VERT} />}
            max={240}
            h={150}
          />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S5.work.prompt}
            answer={num(S5.work.answer)}
            okText={S5.work.ok}
            hints={S5.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      <Scene
        fig={(
          <Space
            step={1} yaw={0.35 + phase * 0.45} cube hi={CUBE_HI}
            planes={BASE} segs={DIAG} arcAt={ARC_CUBE}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} cube hi={CUBE_HI} planes={BASE} segs={DIAG} arcAt={ARC_CUBE} />}
        prompt={S6.work.prompt}
        answer={num(S6.work.answer)}
        okText={S6.work.ok}
        hints={S6.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      /* CHEGARA. Kadr 1 -- og'ma chiziq va uning kesma proyeksiyasi, kadr 2 --
         chiziq tik turdi va proyeksiya nuqtaga yig'ildi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} pts={PTS} planes={PLANE}
            segs={phase === 0 ? SET_PROJ : SET_VERT}
            hide={phase === 0 ? H_PROJ : H_VERT}
            arcAt={phase === 0 ? ARC_PROJ : null}
            angleAt={phase === 0 ? null : RIGHT_VERT}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene
            fig={<Space step={1} yaw={0.4} pts={PTS} planes={PLANE} segs={SET_VERT} hide={H_VERT} angleAt={RIGHT_VERT} />}
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
                step={1} yaw={solved ? 0.75 : 0.3} pts={PTS} planes={PLANE}
                segs={SET_PROJ} hide={H_PROJ} arcAt={ARC_PROJ}
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
                step={1} yaw={0.35 + round * 0.3} cube hi={CUBE_HI}
                planes={BASE} segs={DIAG} arcAt={ARC_CUBE}
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
