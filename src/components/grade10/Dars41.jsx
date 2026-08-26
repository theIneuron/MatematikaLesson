// ============================================================================
// 10-sinf, Dars 41. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS41_KONTENT.md
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
const LESSON_NO = 41
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Perpendikulyar, og'ma va uch perpendikulyar`,
  `Урок ${LESSON_NO}. Перпендикуляр, наклонная и три перпендикуляра`,
  `Lesson ${LESSON_NO}. Perpendicular, oblique and three perpendiculars`,
)

const BLOCK = { label: 'B6', from: 38, to: 43, current: 41 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L("OG'MA", 'НАКЛОННАЯ', 'THE OBLIQUE'),
  title: L('Ikki yozuv, farq bitta kesmada', 'Две записи, разница в одном отрезке', 'Two readings, one segment apart'),
  audio: [
    A('mount', "Nuqta tekislik ustida turadi. Undan perpendikulyar tushirilgan va og'ma o'tkazilgan. Tekislikda og'maning asosi orqali uchinchi to'g'ri chiziq o'tadi.", 'Точка стоит над плоскостью. Из неё опущен перпендикуляр и проведена наклонная. В плоскости через основание наклонной идёт третья прямая.', 'A point stands above the plane. A perpendicular is dropped from it and an oblique is drawn. In the plane a third line runs through the foot of the oblique.'),
    A('r1', "Birinchi yozuv shunday deydi. To'g'ri chiziq perpendikulyarga perpendikulyar, demak u og'maga ham perpendikulyar.", 'Первая запись говорит так. Прямая перпендикулярна перпендикуляру, значит она перпендикулярна и наклонной.', 'The first reading says this. The line is perpendicular to the perpendicular, so it is perpendicular to the oblique as well.'),
    A('r2', "Ikkinchisi proyeksiya haqida gapiradi. To'g'ri chiziq og'maning proyeksiyasiga perpendikulyar, demak u og'maning o'ziga ham perpendikulyar.", 'Вторая говорит про проекцию. Прямая перпендикулярна проекции наклонной, значит она перпендикулярна самой наклонной.', 'The second one speaks about the projection. The line is perpendicular to the projection of the oblique, so it is perpendicular to the oblique itself.'),
    A('ask', "Yozuvlar o'xshash, va bitta kesma bilan farq qiladi. Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Записи похожи, и отличаются одним отрезком. Как думаешь, какая верная? Пока просто предположи.', 'The readings look alike and differ by one segment. Which do you think is correct? Just guess for now.'),
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
      name: L('perpendikulyar orqali', 'через перпендикуляр', 'through the perpendicular'),
      value: 'c ⊥ AB   →   c ⊥ AC',
    },
    b: {
      name: L('proyeksiya orqali', 'через проекцию', 'through the projection'),
      value: 'c ⊥ BC   →   c ⊥ AC',
    },
  },
  expr: 'AB ⊥ α,   c ⊂ α',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Teoremadan oldin uch savol', 'Три вопроса перед теоремой', 'Three questions before the theorem'),
  tag: 'support',
  audio: [
    A('mount', "Uchta qisqa savol. Uchalasi ham bir daqiqadan keyin, teorema paydo bo'lganda kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту, когда появится теорема.', 'Three short questions. All three will be needed in a minute, when the theorem appears.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("To'g'ri chiziq qachon tekislikka perpendikulyar bo'ladi?", 'Когда прямая перпендикулярна плоскости?', 'When is a line perpendicular to a plane?'),
      done: 'a ⊥ b,  a ⊥ c   →   a ⊥ α',
      items: [
        { id: 'a', label: L("ikki kesishuvchi chiziqqa perpendikulyar bo'lganda", 'когда перпендикулярна двум пересекающимся', 'when perpendicular to two crossing lines'), correct: true },
        { id: 'b', label: L("bitta chiziqqa perpendikulyar bo'lganda", 'когда перпендикулярна одной прямой', 'when perpendicular to one line'), hint: L("Bittasi kam, va o'tgan darsda burilish shuni ko'rsatdi.", 'Одной мало, и поворот это показал в прошлом уроке.', 'One is not enough, and the rotation showed that last lesson.') },
        { id: 'c', label: L("tekislikni kesib o'tganda", 'когда пересекает плоскость', 'when it crosses the plane'), hint: L("Kesib o'tish qiyshiq ham bo'ladi.", 'Пересечь можно и наклонно.', 'Crossing can also be at a slant.') },
        { id: 'd', label: L("undagi chiziqqa parallel bo'lganda", 'когда параллельна прямой в ней', 'when parallel to a line in it'), hint: L("Parallellik to'g'ri burchak bermaydi.", 'Параллельность прямого угла не даёт.', 'Being parallel gives no right angle.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("To'g'ri chiziq tekislikka perpendikulyar. U shu tekislikning to'g'ri chiziqlari bilan qanday burchak beradi?", 'Прямая перпендикулярна плоскости. Какой угол она даёт с прямыми этой плоскости?', 'A line is perpendicular to a plane. What angle does it make with the lines of that plane?'),
      done: 'a ⊥ α   →   90°',
      items: [
        { id: 'a', label: L("har biri bilan to'qson", 'девяносто с каждой', 'ninety with each of them'), correct: true },
        { id: 'b', label: L("to'g'ri chiziqqa bog'liq", 'зависит от прямой', 'it depends on the line'), hint: L("Tekislikka perpendikulyarlik uning barcha to'g'ri chiziqlari bilan to'g'ri burchak degani.", 'Перпендикулярность плоскости и означает прямой угол со всеми её прямыми.', 'Being perpendicular to a plane means a right angle with all its lines.') },
        { id: 'c', label: L('qirq besh daraja', 'сорок пять градусов', 'forty five degrees'), hint: L('Bu son hech qayerdan chiqmaydi.', 'Это число ниоткуда не следует.', 'That number follows from nothing.') },
        { id: 'd', label: L('nol daraja', 'ноль градусов', 'zero degrees'), hint: L("Nol tekislikda yotgan to'g'ri chiziqda bo'lardi.", 'Ноль был бы у прямой, лежащей в плоскости.', 'Zero would belong to a line lying in the plane.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Sahnani burish nimani ko'rsatadi?", 'Что показывает поворот сцены?', 'What does rotating the scene show?'),
      done: 'α ≠ 90°  ?',
      items: [
        { id: 'a', label: L("burchak boshqa bo'lishi mumkinligini", 'что угол бывает не тем, каким кажется', 'that an angle can be other than it seems'), correct: true },
        { id: 'b', label: L("shakl o'z shaklini o'zgartirishini", 'что фигура меняет форму', 'that the figure changes its shape'), hint: L("Shakl o'sha, faqat qarash o'zgaradi.", 'Форма та же, меняется только взгляд.', 'The shape is the same, only the view changes.') },
        { id: 'c', label: L("chizmani o'lchash mumkinligini", 'что чертёж можно измерить', 'that the drawing can be measured'), hint: L("O'lchash taxmin, dalil emas.", 'Измерение это предположение, а не довод.', 'A measurement is a guess, not an argument.') },
        { id: 'd', label: L('yangi hech narsa emas', 'ничего нового', 'nothing new'), hint: L("O'tgan darsda aynan burilish yolg'on kesishishni rad etdi.", 'В прошлом уроке именно поворот отменил ложное пересечение.', 'Last lesson it was the rotation that refuted a false crossing.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Uch kesma, va faqat bittasi tekislikda', 'Три отрезка, и только один в плоскости', 'Three segments, and only one in the plane'),
  tag: 'kartinka-kak-dokazatelstvo',
  show: [
    [
      L('nuqtadan perpendikulyar tushirilgan', 'из точки опущен перпендикуляр', 'a perpendicular is dropped from the point'),
      L("o'sha nuqtadan og'ma o'tkazilgan", 'из неё же проведена наклонная', 'an oblique is drawn from the same point'),
    ],
    [
      L('asoslar tutashtirilgan', 'основания соединены', 'the feet are joined'),
      L("bu og'maning proyeksiyasi", 'это и есть проекция наклонной', 'this is the projection of the oblique'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Tekislik ustidagi nuqta va undan ikki kesma. Biri to'g'ri burchak bilan tushdi, ikkinchisi qiyshiq.", 'Точка над плоскостью и два отрезка из неё. Один упал по прямому углу, второй косо.', 'A point above the plane and two segments from it. One landed at a right angle, the other at a slant.'),
    A('move', "Kesmalar qayerda tugashiga qarang. Perpendikulyarning asosi va og'maning asosi boshqa nuqtalar, va ular orasidagi kesma butunlay tekislikda yotadi. U og'maning proyeksiyasi deb ataladi. Sahnani buring va unga qarang. Perpendikulyar va og'ma burilishda tekislikdan chiqadi, proyeksiya esa sahnaning har qanday holatida unda qoladi. Bu uning alomati, chizmaning xossasi emas.", 'Смотри, где кончаются отрезки. Основание перпендикуляра и основание наклонной это разные точки, и отрезок между ними лежит в плоскости целиком. Он называется проекцией наклонной. Поверни сцену и следи за ним. Перпендикуляр и наклонная при повороте уходят из плоскости, а проекция остаётся в ней при любом положении сцены. Это её признак, а не свойство чертежа.', 'Look at where the segments end. The foot of the perpendicular and the foot of the oblique are different points, and the segment between them lies wholly in the plane. It is called the projection of the oblique. Rotate the scene and watch it. Under rotation the perpendicular and the oblique leave the plane, while the projection stays in it at any position of the scene. That is its mark, not a property of the drawing.'),
    A('work', "O'zingiz hisoblang. Uch kesmadan nechtasi butunlay tekislikda yotadi?", 'Посчитай сам. Сколько из трёх отрезков лежит в плоскости целиком?', 'Work it out yourself. How many of the three segments lie wholly in the plane?'),
  ],
  work: {
    prompt: L('Nechta kesma tekislikda yotadi?', 'Сколько отрезков лежит в плоскости?', 'How many segments lie in the plane?'),
    ok: L('Bitta. Bu proyeksiya, va sahnani qancha burmang, u tekislikdan chiqmaydi.', 'Один. Это проекция, и сколько сцену ни крути, она из плоскости не выходит.', 'One. It is the projection, and however much you rotate the scene, it does not leave the plane.'),
    hint: [
      L("Sahnani buring va qaysi kesma tekislikdan uzilmasligini ko'ring.", 'Поверни сцену и посмотри, какой отрезок не отрывается от плоскости.', 'Rotate the scene and see which segment never comes off the plane.'),
      L("Og'maning tekislikda faqat bitta uchi yotadi.", 'У наклонной в плоскости лежит только один конец.', 'Only one end of the oblique lies in the plane.'),
      L('Bitta, va bu ikki asos orasidagi kesma.', 'Один, и это отрезок между двумя основаниями.', 'One, and it is the segment between the two feet.'),
    ],
    answer: '1',
  },
  expr: 'AB ⊥ α,   BC ⊂ α',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Bitta nuqtadan ikki og'ma", 'Две наклонные из одной точки', 'Two obliques from one point'),
  tag: 'izmeril-znachit-dokazal',
  show: [
    [
      L("nuqtadan ikki og'ma o'tkazilgan", 'из точки проведены две наклонные', 'two obliques are drawn from the point'),
      L("chizmada ular teng ko'rinadi", 'на чертеже они кажутся равными', 'on the drawing they look equal'),
    ],
    [
      L('sahnani buring va proyeksiyalarga qarang', 'поверни сцену и посмотри на проекции', 'rotate the scene and look at the projections'),
      L("proyeksiyalar boshqa, demak og'malar ham boshqa", 'проекции разные, значит и наклонные разные', 'the projections differ, so the obliques differ too'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "O'sha nuqtadan ikkinchi og'ma o'tkazilgan. Qimirlamas chizmada ikki og'ma bir xil ko'rinadi.", 'Из той же точки проведена вторая наклонная. На неподвижном чертеже две наклонные выглядят одинаково.', 'A second oblique is drawn from the same point. On a still drawing the two obliques look the same.'),
    A('move', "Sahnani buring va og'malarning o'zini emas, proyeksiyalarini solishtiring. Proyeksiyalar boshqa uzunlikda chiqdi, va bu masalani hal qiladi. Og'maning asosi perpendikulyar asosidan qancha uzoq bo'lsa, og'maning o'zi shuncha uzun. Qoida teskari tomonga ham ishlaydi. Teng og'malar teng proyeksiya beradi, teng proyeksiyalar esa teng og'ma beradi. Va yana bittasi, eng qisqasi. Perpendikulyar o'sha nuqtadan chiqqan har qanday og'madan qisqa, chunki to'g'ri burchakli uchburchakda u katet, og'ma esa gipotenuza.", 'Поверни сцену и сравни не сами наклонные, а их проекции. Проекции оказались разной длины, и это решает дело. Чем дальше основание наклонной от основания перпендикуляра, тем длиннее сама наклонная. Правило работает и в обратную сторону. Равные наклонные дают равные проекции, а равные проекции дают равные наклонные. И ещё одно, самое короткое. Перпендикуляр короче любой наклонной из той же точки, потому что в прямоугольном треугольнике он катет, а наклонная гипотенуза.', 'Rotate the scene and compare not the obliques themselves but their projections. The projections turned out to have different lengths, and that settles it. The farther the foot of an oblique is from the foot of the perpendicular, the longer the oblique. The rule works the other way too. Equal obliques give equal projections, and equal projections give equal obliques. And one more, the shortest one. The perpendicular is shorter than any oblique from the same point, because in a right triangle it is a leg and the oblique is the hypotenuse.'),
    A('work', "O'zingiz hisoblang. Og'malar teng, va birinchisining proyeksiyasi to'qqizga teng. Ikkinchisining proyeksiyasi qancha?", 'Посчитай сам. Наклонные равны, и проекция первой равна девяти. Какова проекция второй?', 'Work it out yourself. The obliques are equal and the projection of the first one is nine. What is the projection of the second?'),
  ],
  work: {
    prompt: L("Birinchi proyeksiya to'qqiz. Ikkinchisi qancha?", 'Первая проекция девять. Какова вторая?', 'The first projection is nine. What is the second?'),
    ok: L("Ham to'qqiz. To'g'ri burchakli uchburchaklar katet va gipotenuza bo'yicha teng.", 'Тоже девять. Прямоугольные треугольники равны по катету и гипотенузе.', 'Nine as well. The right triangles are equal by a leg and the hypotenuse.'),
    hint: [
      L('Perpendikulyar ularda umumiy, va u ikki uchburchakda ham katet.', 'Перпендикуляр у них общий, и он катет в обоих треугольниках.', 'The perpendicular is common to both, and it is a leg in both triangles.'),
      L("Gipotenuzalar shartga ko'ra teng, katet umumiy.", 'Гипотенузы равны по условию, катет общий.', 'The hypotenuses are equal by the condition, the leg is common.'),
      L("Demak ikkinchi katetlar, ya'ni proyeksiyalar ham teng. To'qqiz.", 'Значит равны и вторые катеты, то есть проекции. Девять.', 'So the second legs, that is the projections, are equal too. Nine.'),
    ],
    answer: '9',
  },
  expr: 'AC = AD,   BC = 9   →   BD = ?',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Bitta to'g'ri burchak ikkinchisini tortadi", 'Один прямой угол тянет за собой второй', 'One right angle pulls a second one after it'),
  tag: 'svoystvo-vmesto-priznaka',
  show: [
    [
      L("tekislikda og'maning asosi orqali to'g'ri chiziq o'tkazilgan", 'в плоскости через основание наклонной проведена прямая', 'in the plane a line is drawn through the foot of the oblique'),
      L('u proyeksiyaga perpendikulyar', 'она перпендикулярна проекции', 'it is perpendicular to the projection'),
    ],
    [
      L('sahnani buring va ikkinchi belgiga qarang', 'поверни сцену и посмотри на вторую отметку', 'rotate the scene and look at the second mark'),
      L("u og'maning o'ziga ham perpendikulyar", 'она перпендикулярна и самой наклонной', 'it is perpendicular to the oblique itself'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Tekislikda to'g'ri chiziq o'tkazilgan. U og'maning asosi orqali o'tadi va uning proyeksiyasiga perpendikulyar.", 'В плоскости проведена прямая. Она идёт через основание наклонной и перпендикулярна её проекции.', 'A line is drawn in the plane. It runs through the foot of the oblique and is perpendicular to its projection.'),
    A('move', "Sahnani buring va to'g'ri burchak belgilariga qarang. Ular ikkita bo'ldi. Birinchisi shart bilan berilgan edi, ikkinchisi esa o'zi paydo bo'ldi, va hech qanday burilishda yo'qolmaydi. Bu uch perpendikulyar haqidagi teorema. Tekislikda og'maning asosi orqali uning proyeksiyasiga perpendikulyar o'tkazilgan to'g'ri chiziq og'maning o'ziga ham perpendikulyar bo'ladi. Teskarisi ham to'g'ri. Og'maga perpendikulyar bo'lsa, proyeksiyaga ham perpendikulyar. Teoremada uchta perpendikulyar qatnashadi, nomi ham shundan.", 'Поверни сцену и следи за отметками прямого угла. Их стало две. Первая была задана условием, а вторая появилась сама, и ни при каком повороте она не исчезает. Это и есть теорема о трёх перпендикулярах. Прямая в плоскости, проведённая через основание наклонной перпендикулярно её проекции, перпендикулярна и самой наклонной. Обратное тоже верно. Перпендикулярна наклонной, значит перпендикулярна и проекции. В теореме участвуют три перпендикуляра, отсюда и название.', 'Rotate the scene and watch the right-angle marks. There are two of them now. The first was given by the condition, the second appeared on its own, and it does not vanish at any rotation. This is the theorem of three perpendiculars. A line in the plane drawn through the foot of the oblique perpendicular to its projection is perpendicular to the oblique itself. The converse holds too. Perpendicular to the oblique means perpendicular to the projection. Three perpendiculars take part in the theorem, and that is where the name comes from.'),
    A('work', "O'zingiz hisoblang. Teoremada nechta perpendikulyar qatnashadi?", 'Посчитай сам. Сколько перпендикуляров участвует в теореме?', 'Work it out yourself. How many perpendiculars take part in the theorem?'),
  ],
  work: {
    prompt: L('Teoremada nechta perpendikulyar bor?', 'Сколько перпендикуляров в теореме?', 'How many perpendiculars are in the theorem?'),
    ok: L("Uchta. Tekislikka perpendikulyar, proyeksiyaga to'g'ri chiziq va u og'maga.", 'Три. Перпендикуляр к плоскости, прямая к проекции и она же к наклонной.', 'Three. The perpendicular to the plane, the line to the projection, and the same line to the oblique.'),
    hint: [
      L("Hozir chizmada bor to'g'ri burchaklarni hisoblang.", 'Посчитай прямые углы, которые сейчас на чертеже.', 'Count the right angles now on the drawing.'),
      L("Bittasi perpendikulyar bilan tekislikni tutadi, ikkitasi to'g'ri chiziqda paydo bo'ldi.", 'Один держит перпендикуляр с плоскостью, два появились у прямой.', 'One holds the perpendicular with the plane, two appeared at the line.'),
      L("Teoremaning nomi bu sonni o'zida saqlaydi.", 'Название теоремы уже содержит это число.', 'The name of the theorem already carries this number.'),
    ],
    answer: '3',
  },
  expr: 'c ⊥ BC   →   c ⊥ AC',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L('Bu perpendikulyar emas', 'Не тот перпендикуляр', 'The wrong perpendicular'),
  tag: 'ttp-vmesto-proekcii',
  show: [
    [
      L("tekislikning boshqa to'g'ri chizig'i olingan", 'взята другая прямая плоскости', 'another line of the plane is taken'),
      L('u perpendikulyarga perpendikulyar', 'она перпендикулярна перпендикуляру', 'it is perpendicular to the perpendicular'),
    ],
    [
      L("sahnani buring va og'maga qarang", 'поверни сцену и посмотри на наклонную', 'rotate the scene and look at the oblique'),
      L("u bilan to'g'ri burchak yo'q", 'прямого угла с ней нет', 'there is no right angle with it'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Tekislikdagi to'g'ri chiziq qaytadan olingan, va endi u proyeksiyaga emas, perpendikulyarning o'ziga perpendikulyar.", 'Прямая в плоскости взята заново, и теперь она перпендикулярна не проекции, а самому перпендикуляру.', 'The line in the plane is taken anew, and now it is perpendicular not to the projection but to the perpendicular itself.'),
    A('move', "Bu shart doim bajariladi va shuning uchun hech narsa bermaydi. Perpendikulyar butun tekislikka to'g'ri burchak ostida turadi, demak uning har bir to'g'ri chizig'iga ham, qaysi birini olsangiz. Sahnani buring va og'ma bilan burchakka qarang. U to'g'ri emas, va sahnaning birorta holati uni to'g'ri qilmaydi. Teoremada proyeksiya so'zi shuning uchun turadi. Proyeksiyani perpendikulyarga almashtirsangiz, teorema ishlamay qoladi, yozuv esa deyarli o'sha.", 'Это условие выполняется всегда и потому ничего не даёт. Перпендикуляр стоит под прямым углом ко всей плоскости, значит и к каждой её прямой, какую ни возьми. Поверни сцену и посмотри на угол с наклонной. Он не прямой, и ни одно положение сцены его прямым не сделает. Вот почему в теореме стоит слово проекция. Замени проекцию на перпендикуляр, и теорема перестанет работать, хотя запись почти та же.', 'This condition always holds and therefore gives nothing. The perpendicular stands at a right angle to the whole plane, hence to every line of it, whichever you take. Rotate the scene and look at the angle with the oblique. It is not right, and no position of the scene will make it right. That is why the word projection stands in the theorem. Replace the projection by the perpendicular and the theorem stops working, although the reading is almost the same.'),
    A('work', "O'zingiz hisoblang. Og'maning asosi orqali o'tuvchi tekislik to'g'ri chiziqlaridan nechtasi unga perpendikulyar?", 'Посчитай сам. Сколько прямых плоскости через основание наклонной перпендикулярны ей самой?', 'Work it out yourself. How many lines of the plane through the foot of the oblique are perpendicular to the oblique itself?'),
  ],
  work: {
    prompt: L("Tekislikda shunday to'g'ri chiziq nechta?", 'Сколько таких прямых в плоскости?', 'How many such lines are there in the plane?'),
    ok: L("Bitta. Aynan proyeksiyaga perpendikulyar bo'lgani, boshqasi yo'q.", 'Одна. Та самая, что перпендикулярна проекции, и других нет.', 'One. Exactly the one perpendicular to the projection, and there are no others.'),
    hint: [
      L("Tekislikdagi nuqta orqali berilgan to'g'ri chiziqqa perpendikulyar bitta to'g'ri chiziq o'tadi.", 'Через точку в плоскости перпендикулярно данной прямой проходит одна прямая.', 'Through a point in the plane there is one line perpendicular to a given line.'),
      L("Teorema bunday to'g'ri chiziqni og'ma bilan ikki tomonga bog'laydi.", 'Теорема связывает такую прямую с наклонной в обе стороны.', 'The theorem ties such a line to the oblique both ways.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: 'd ⊥ AB,   d ⊥ AC  ?',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('MASOFA', 'РАССТОЯНИЕ', 'DISTANCE'),
  title: L("Masofa doim perpendikulyar bo'yicha", 'Расстояние всегда по перпендикуляру', 'Distance always goes along the perpendicular'),
  tag: 'bumaga',
  show: [
    [
      L("nuqtadan tekislikkacha perpendikulyar bo'yicha o'lchanadi", 'от точки до плоскости мерят по перпендикуляру', 'from a point to a plane it is measured along the perpendicular'),
      L("og'ma doim uzunroq", 'наклонная всегда длиннее', 'an oblique is always longer'),
    ],
    [
      L("to'g'ri chiziqdan parallel tekislikkacha ham shunday", 'от прямой до параллельной плоскости так же', 'from a line to a parallel plane it is the same'),
      L('parallel tekisliklar orasida ham', 'и между параллельными плоскостями тоже', 'and between parallel planes as well'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Endi uzunlik haqida. Nuqtadan tekislikkacha bo'lgan masofa deb shu nuqtadan tushirilgan perpendikulyar uzunligiga aytiladi.", 'Теперь про длину. Расстоянием от точки до плоскости называют длину перпендикуляра, опущенного из этой точки.', 'Now about length. The distance from a point to a plane is the length of the perpendicular dropped from that point.'),
    A('move', "Nima uchun aynan perpendikulyar, biz allaqachon ko'rdik. U o'sha nuqtadan chiqqan har qanday og'madan qisqa, masofa esa doim eng qisqa yo'l. Toshkentdagi soat minorasining balandligi o'ttiz metr deyilganda, uchidan asos tekisligigacha bo'lgan perpendikulyar tushuniladi. Qolgan masofalar ham shunday o'lchanadi. To'g'ri chiziqdan unga parallel tekislikkacha uning istalgan nuqtasidan perpendikulyar olinadi, chunki ularning hammasi bir uzunlik beradi. Ikki parallel tekislik orasida ham perpendikulyar olinadi.", 'Почему именно перпендикуляр, мы уже видели. Он короче любой наклонной из той же точки, а расстояние это всегда самый короткий путь. Когда говорят, что высота часовой башни в Ташкенте тридцать метров, имеют в виду перпендикуляр от вершины до плоскости основания. Так же мерят и остальные расстояния. От прямой до параллельной ей плоскости берут перпендикуляр из любой её точки, потому что все они дают одну длину. Между двумя параллельными плоскостями тоже берут перпендикуляр.', 'Why the perpendicular, we have already seen. It is shorter than any oblique from the same point, and a distance is always the shortest path. When the clock tower in Tashkent is said to be thirty metres high, what is meant is the perpendicular from its top to the plane of its base. The other distances are measured the same way. From a line to a plane parallel to it you take a perpendicular from any of its points, because all of them give one length. Between two parallel planes you take a perpendicular as well.'),
    A('work', "O'zingiz hisoblang. Tekislikka perpendikulyar sakkizga, og'ma proyeksiyasi oltiga teng. Og'ma qancha?", 'Посчитай сам. Перпендикуляр к плоскости равен восьми, проекция наклонной шести. Какова наклонная?', 'Work it out yourself. The perpendicular to the plane is eight, the projection of the oblique is six. How long is the oblique?'),
  ],
  work: {
    prompt: L("Og'ma uzunligini toping", 'Найди длину наклонной', 'Find the length of the oblique'),
    ok: L("O'n. Perpendikulyar va proyeksiya katetlar, og'ma esa gipotenuza.", 'Десять. Перпендикуляр и проекция это катеты, наклонная гипотенуза.', 'Ten. The perpendicular and the projection are the legs, the oblique is the hypotenuse.'),
    hint: [
      L("Perpendikulyar, proyeksiya va og'ma to'g'ri burchakli uchburchak beradi.", 'Перпендикуляр, проекция и наклонная дают прямоугольный треугольник.', 'The perpendicular, the projection and the oblique form a right triangle.'),
      L("To'g'ri burchak perpendikulyar tekislikka kirgan joyda turadi.", 'Прямой угол стоит там, где перпендикуляр входит в плоскость.', 'The right angle is where the perpendicular meets the plane.'),
      L("Olti va sakkiz o'n gipotenuza beradi.", 'Шесть и восемь дают гипотенузу десять.', 'Six and eight give a hypotenuse of ten.'),
    ],
    answer: '10',
  },
  expr: 'AB = 8,   BC = 6,   AC = ?',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Teoremada nima shart', 'Что обязательно в теореме', 'What is required in the theorem'),
  tag: 'svoystvo-vmesto-priznaka',
  motion: ['rule'],
  audio: [
    A('mount', "O'zingizni bitta savol bilan tekshiring, keyin kartochkaga qarang.", 'Проверь себя одним вопросом, а потом посмотри на карточку.', 'Check yourself with one question, then look at the card.'),
    A('rule', "Teoremada ikki shart bor, va ikkalasi ham majburiy. To'g'ri chiziq tekislikda yotadi va og'maning asosi orqali o'tadi. Birinchisini olib tashlasangiz, to'g'ri chiziq xohlagancha turishi mumkin. Ikkinchisini olib tashlasangiz, u yonidan o'tib ketadi. Perpendikulyar haqidagi shartni tekshirish hech narsa turmaydi, chunki u doim bajariladi. Faqat proyeksiya haqidagi tekshiruv ishlaydi.", 'В теореме два условия, и оба обязательны. Прямая лежит в плоскости и проходит через основание наклонной. Убери первое, и прямая может стоять как угодно. Убери второе, и она пройдёт мимо. Проверка условия про перпендикуляр ничего не стоит, потому что она выполняется всегда. Работает только проверка про проекцию.', 'The theorem has two conditions, and both are required. The line lies in the plane and passes through the foot of the oblique. Drop the first and the line may stand however it likes. Drop the second and it will pass by. Checking the condition about the perpendicular costs nothing, because it always holds. Only the check about the projection works.'),
  ],
  probe: {
    question: L("Teoremani qo'llash uchun nima kerak?", 'Что нужно, чтобы применить теорему?', 'What is needed to apply the theorem?'),
    items: [
      { id: 'a', label: L("to'g'ri chiziq tekislikda yotadi va og'maning asosi orqali o'tadi", 'прямая лежит в плоскости и идёт через основание наклонной', 'the line lies in the plane and runs through the foot of the oblique'), correct: true },
      { id: 'b', label: L("to'g'ri chiziq perpendikulyarga perpendikulyar", 'прямая перпендикулярна перпендикуляру', 'the line is perpendicular to the perpendicular'), hint: L("Bu tekislikning har bir to'g'ri chizig'ida bajariladi va shuning uchun hech narsa bermaydi.", 'Это выполняется у каждой прямой плоскости и потому ничего не даёт.', 'That holds for every line of the plane and therefore gives nothing.') },
    ],
  },
  rule: {
    lawLabel: L('Uch perpendikulyar haqidagi teorema', 'Теорема о трёх перпендикулярах', 'The theorem of three perpendiculars'),
    lines: [
      L("tekislikda og'maning asosi orqali o'tuvchi va proyeksiyaga perpendikulyar to'g'ri chiziq og'maga ham perpendikulyar", 'прямая в плоскости через основание наклонной, перпендикулярная проекции, перпендикулярна и наклонной', 'a line in the plane through the foot of the oblique, perpendicular to the projection, is perpendicular to the oblique too'),
      L("teskarisi to'g'ri: og'maga perpendikulyar bo'lsa, proyeksiyaga ham perpendikulyar", 'обратное верно: перпендикулярна наклонной, значит перпендикулярна проекции', 'the converse holds: perpendicular to the oblique means perpendicular to the projection'),
      L("perpendikulyar har qanday og'madan qisqa, shuning uchun masofa u bo'yicha olinadi", 'перпендикуляр короче любой наклонной, поэтому расстояние берут по нему', 'the perpendicular is shorter than any oblique, so distance is taken along it'),
    ],
    law: 'c ⊂ α,  C ∈ c   →   (c ⊥ BC ⇔ c ⊥ AC)',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Har bir kesmani nomlang', 'Назови каждый отрезок', 'Name each segment'),
  tag: 'svoystvo-vmesto-priznaka',
  audio: [
    A('mount', "To'rt yozuv va to'rt nom. Ularni birlashtiring.", 'Четыре записи и четыре имени. Соедини их.', 'Four readings and four names. Match them.'),
  ],
  match: {
    prompt: L('Yozuvni nomi bilan birlashtiring', 'Соедини запись с именем', 'Match the reading with the name'),
    ok: L("To'rttasi ham joyida. Bundan keyin bu nomlarni ishchi deb olamiz.", 'Все четыре на месте. Дальше эти имена берём как рабочие.', 'All four are in place. From here we take these names as working ones.'),
    a: L('tekislikka perpendikulyar', 'перпендикуляр к плоскости', 'the perpendicular to the plane'),
    b: L("og'ma", 'наклонная', 'the oblique'),
    c: L("og'maning proyeksiyasi", 'проекция наклонной', 'the projection of the oblique'),
    d: L("og'maning asosi", 'основание наклонной', 'the foot of the oblique'),
    left: ['AB', 'AC', 'BC', 'C'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Baravar uzoqlikni isbotlang', 'Докажи равноудалённость', 'Prove the equal distances'),
  tag: 'svoystvo-vmesto-priznaka',
  audio: [
    A('mount', "Darslikdagi masala. Har qatorning asoslashi ro'yxatdan tanlanadi.", 'Задача из учебника. Обоснование каждой строки выбирается из списка.', 'A problem from the textbook. The justification of each line is chosen from the list.'),
  ],
  proof: {
    given: L('ichki chizilgan aylana markazidan perpendikulyar', 'перпендикуляр из центра вписанной окружности', 'a perpendicular from the incentre'),
    goal: L('uning nuqtalari tomonlardan baravar uzoqlikda', 'его точки равноудалены от сторон', 'its points are equidistant from the sides'),
    r1: L('radius tomonga perpendikulyar', 'радиус перпендикулярен стороне', 'the radius is perpendicular to the side'),
    r2: L("demak og'ma ham tomonga perpendikulyar", 'значит и наклонная перпендикулярна стороне', 'so the oblique is perpendicular to the side too'),
    r3: L("uchta uchburchak ikki katet bo'yicha teng", 'три треугольника равны по двум катетам', 'three triangles are equal by two legs'),
    ok: L("Isbotlandi. Teorema uch marta ishladi, har safar bitta tomon bo'yicha.", 'Доказано. Теорема сработала три раза, по одной стороне каждый раз.', 'Proved. The theorem worked three times, once for each side.'),
    e1: L('Bu yerda aksioma kerak emas. Bu aylananing xossasi.', 'Аксиома тут не нужна. Это свойство окружности.', 'No axiom is needed here. This is a property of the circle.'),
    e2: L("Radiuslar allaqachon olingan. Endi og'ma haqida.", 'Радиусы уже взяты. Теперь про наклонную.', 'The radii are already taken. Now about the oblique.'),
    e3: L('Perpendikulyarlik isbotlandi. Gap uzunliklar haqida.', 'Перпендикулярность доказана. Речь о длинах.', 'The perpendicularity is proved. This is about lengths.'),
  },
  reason: {
    s1: L('uch perpendikulyar haqidagi teorema', 'теорема о трёх перпендикулярах', 'the theorem of three perpendiculars'),
    s2: L('urinish nuqtasiga radius', 'радиус в точку касания', 'the radius to the point of contact'),
    s3: L("to'g'ri burchakli uchburchaklar tengligi", 'равенство прямоугольных треугольников', 'equality of right triangles'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'SO ⊥ α,   OA ⊥ a   →   SA ⊥ a',
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
    A('next', 'Endi qadamlar tartibi. Ularni qanday bajarilsa, shunday joylashtiring.', 'Теперь порядок шагов. Расставь их так, как их делают.', 'Now the order of steps. Arrange them the way they are done.'),
  ],
  task: {
    ok: L("O'n besh. Proyeksiya to'qqiz, perpendikulyar o'n ikki, og'ma o'n besh.", 'Пятнадцать. Проекция девять, перпендикуляр двенадцать, наклонная пятнадцать.', 'Fifteen. The projection is nine, the perpendicular is twelve, the oblique is fifteen.'),
    hint: [
      L("To'g'ri burchakli uchburchak chizing va katetlarni imzolang.", 'Нарисуй прямоугольный треугольник и подпиши катеты.', 'Draw a right triangle and label the legs.'),
      L("To'g'ri burchak perpendikulyar tekislikka kirgan joyda.", 'Прямой угол там, где перпендикуляр входит в плоскость.', 'The right angle is where the perpendicular meets the plane.'),
      L("To'qqiz va o'n ikki o'n beshni beradi.", 'Девять и двенадцать дают пятнадцать.', 'Nine and twelve give fifteen.'),
    ],
    prompt: 'AB = 12,   BC = 9,   AC = ?',
    answer: '15',
  },
  order: {
    prompt: L('Yozuvlarni olinish tartibida joylashtiring', 'Расставь записи в том порядке, в каком их получают', 'Arrange the readings in the order they are obtained'),
    title: L('Ish tartibi', 'Порядок работы', 'The order of work'),
    ok: L("Tartib to'g'ri. Shart xulosadan oldin tekshiriladi, keyin emas.", 'Порядок верный. Условие проверяется до вывода, а не после.', 'The order is right. The condition is checked before the conclusion, not after.'),
    bad: L("Bu tartibda emas. Avval nimani bilish kerakligini ko'ring.", 'Не в этом порядке. Посмотри, что нужно знать раньше.', 'Not in this order. See what has to be known first.'),
    items: ['c ⊥ AC', 'AB ⊥ α', 'c ⊥ BC', 'BC'],
    answer: 'AB ⊥ α  BC  c ⊥ BC  c ⊥ AC',
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
    A('mount', "Oldingizda to'rt qatorli isbot. Ulardan biri oldingilaridan kelib chiqmaydi.", 'Перед тобой доказательство из четырёх строк. Одна из них не следует из предыдущих.', 'In front of you is a proof of four lines. One of them does not follow from the previous ones.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Shart to'g'ri ko'chirilgan.", 'Условие переписано верно.', 'The condition is copied correctly.'),
    r2: L("Bu tekislikning har qanday to'g'ri chizig'ida to'g'ri.", 'Это верно у любой прямой плоскости.', 'This is true for any line of the plane.'),
    r4: L("Xulosa o'zi to'g'ri, lekin bu yerdan olinmagan.", 'Вывод сам по себе верен, но получен не отсюда.', 'The conclusion itself is right, but it does not come from here.'),
  },
  proof: L("Sahnani buring: to'g'ri deb hisoblangan burchak to'g'ri chiqmadi.", 'Поверни сцену: угол, который считали прямым, прямым не оказался.', 'Rotate the scene: the angle taken for a right one turned out not to be right.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L("Uchinchi. Perpendikulyarga perpendikulyarlikdan og'ma haqida hech narsa kelib chiqmaydi.", 'Третья. Из перпендикулярности перпендикуляру про наклонную не следует ничего.', 'The third. Being perpendicular to the perpendicular implies nothing about the oblique.'),
    hint: [
      L('Har qatorni alohida tekshiring va xulosa kelib chiqmagan joyni toping.', 'Проверь каждую строку отдельно и найди, где вывод не следует.', 'Check each line separately and find where the conclusion does not follow.'),
      L('Teorema proyeksiya haqida gapiradi, perpendikulyar haqida emas.', 'Теорема говорит про проекцию, а не про перпендикуляр.', 'The theorem speaks about the projection, not about the perpendicular.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'AB ⊥ α,   AC',
    r2: 'd ⊂ α   →   d ⊥ AB',
    r3: 'd ⊥ AB   →   d ⊥ AC',
    r4: 'd ⊥ AC',
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
    A('mount', "Teorema ikki tomonga o'qiladi, va hozir biz uni o'ngdan chapga o'qiymiz.", 'Теорема читается в обе стороны, и сейчас мы прочитаем её справа налево.', 'The theorem reads both ways, and now we read it from right to left.'),
    A('work', "Doim to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны всегда. Их больше одной.', 'Mark all the readings that are always true. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Nima doim to'g'ri", 'Что верно всегда', 'What is always true'),
    ok: L("Beshtadan uch yozuv. Qolgan ikkitasi proyeksiya so'zida sinadi.", 'Три записи из пяти. Две оставшиеся ломаются на слове проекция.', 'Three readings out of five. The other two break at the word projection.'),
    items: [
      { id: 'd', label: 'd ⊥ AB   →   d ⊥ AC', hint: L("Bu shart tekislikning har bir to'g'ri chizig'ida bor va xulosa bermaydi.", 'Это условие есть у каждой прямой плоскости и вывода не даёт.', 'Every line of the plane has this condition and it gives no conclusion.') },
      { id: 'e', label: 'AC < BC', hint: L("Og'ma gipotenuza, proyeksiya esa katet.", 'Наклонная гипотенуза, а проекция катет.', 'The oblique is the hypotenuse and the projection is a leg.') },
      { id: 'a', label: 'AB < AC', ok: true },
      { id: 'b', label: 'c ⊥ BC   →   c ⊥ AC', ok: true },
      { id: 'c', label: 'AB ⊥ BC', ok: true },
    ],
  },
  place: {
    prompt: L("To'g'ri chiziq og'maga perpendikulyar deb berilgan. Asos orqali o'tuvchi tekislik to'g'ri chiziqlaridan nechtasi proyeksiyaga perpendikulyar?", 'Дано, что прямая перпендикулярна наклонной. Сколько прямых плоскости через основание перпендикулярны проекции?', 'It is given that a line is perpendicular to the oblique. How many lines of the plane through the foot are perpendicular to the projection?'),
    ok: L("Bitta, va bu o'sha to'g'ri chiziq. Teorema ikki tomonga ishlaydi.", 'Одна, и это та же прямая. Теорема работает в обе стороны.', 'One, and it is the same line. The theorem works both ways.'),
    wrong: L('Kartochkadagi teskari teoremaga qarang.', 'Посмотри на обратную теорему на карточке.', 'Look at the converse theorem on the card.'),
    target: '1',
    step: 'c ⊥ AC   →   c ⊥ BC',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'svoystvo-vmesto-priznaka',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Bitta nuqtadan nima qisqaroq?', 'Что короче из одной точки?', 'Which is shorter from one point?'),
      done: 'AB < AC',
      items: [
        { id: 'a', label: L('perpendikulyar', 'перпендикуляр', 'the perpendicular'), correct: true },
        { id: 'b', label: L("og'ma", 'наклонная', 'the oblique'), hint: L("Og'ma o'sha uchburchakda gipotenuza.", 'Наклонная гипотенуза в том же треугольнике.', 'The oblique is the hypotenuse in that same triangle.') },
        { id: 'c', label: L('ular teng', 'они равны', 'they are equal'), hint: L("Ular faqat proyeksiya nol bo'lganda teng bo'lardi.", 'Равны они были бы только при нулевой проекции.', 'They would be equal only if the projection were zero.') },
        { id: 'd', label: L("tekislikka bog'liq", 'зависит от плоскости', 'it depends on the plane'), hint: L("Uchburchak har qanday tekislikda to'g'ri burchakli.", 'Треугольник прямоугольный при любой плоскости.', 'The triangle is right-angled for any plane.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("To'g'ri chiziq qaysi nuqta orqali o'tishi kerak?", 'Через какую точку должна идти прямая?', 'Through which point must the line pass?'),
      done: 'C ∈ c',
      items: [
        { id: 'a', label: L("og'maning asosi orqali", 'через основание наклонной', 'through the foot of the oblique'), correct: true },
        { id: 'b', label: L('perpendikulyarning asosi orqali', 'через основание перпендикуляра', 'through the foot of the perpendicular'), hint: L('Bu boshqa nuqta, va teorema u haqida hech narsa demaydi.', 'Это другая точка, и теорема про неё ничего не говорит.', 'That is a different point, and the theorem says nothing about it.') },
        { id: 'c', label: L('proyeksiyaning istalgan nuqtasi orqali', 'через любую точку проекции', 'through any point of the projection'), hint: L("Unda og'ma bilan to'g'ri burchak bo'lmasligi mumkin.", 'Тогда прямого угла с наклонной может и не быть.', 'Then there may be no right angle with the oblique.') },
        { id: 'd', label: L('joy muhim emas', 'место не важно', 'the place does not matter'), hint: L("Asos haqidagi shart teoremada so'zma-so'z turadi.", 'Условие про основание стоит в теореме дословно.', 'The condition about the foot stands in the theorem word for word.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Og'malar teng. Proyeksiyalar qanday?", 'Наклонные равны. Что с проекциями?', 'The obliques are equal. What about the projections?'),
      done: 'AC = AD   →   BC = BD',
      items: [
        { id: 'a', label: L('teng', 'равны', 'equal'), correct: true },
        { id: 'b', label: L('biri kattaroq', 'одна больше', 'one is bigger'), hint: L("Katta proyeksiya katta og'ma ham beradi.", 'Большая проекция даёт и большую наклонную.', 'A bigger projection gives a bigger oblique too.') },
        { id: 'c', label: L("aytib bo'lmaydi", 'нельзя сказать', 'it cannot be said'), hint: L("Bu yerda to'g'ri burchakli uchburchaklar teng.", 'Прямоугольные треугольники здесь равны.', 'The right triangles here are equal.') },
        { id: 'd', label: L("og'ish burchagiga bog'liq", 'зависит от угла наклона', 'it depends on the angle of the slant'), hint: L("Teng og'malarda og'ish burchagi bir xil.", 'Угол наклона у равных наклонных один и тот же.', 'Equal obliques have one and the same angle of slant.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Nuqtadan tekislikkacha bo'lgan masofa deb nimaga aytiladi?", 'Что называют расстоянием от точки до плоскости?', 'What is called the distance from a point to a plane?'),
      done: 'ρ = AB',
      items: [
        { id: 'a', label: L('perpendikulyar uzunligiga', 'длину перпендикуляра', 'the length of the perpendicular'), correct: true },
        { id: 'b', label: L("og'ma uzunligiga", 'длину наклонной', 'the length of the oblique'), hint: L("Og'malar ko'p, va hammasi uzunroq.", 'Наклонных много, и все они длиннее.', 'There are many obliques, and all of them are longer.') },
        { id: 'c', label: L('proyeksiya uzunligiga', 'длину проекции', 'the length of the projection'), hint: L('Proyeksiya tekislikda yotadi va undan uzoqlashmaydi.', 'Проекция лежит в плоскости и от неё не удаляется.', 'The projection lies in the plane and does not go away from it.') },
        { id: 'd', label: L("o'lchovlarning o'rtasiga", 'среднее из замеров', 'the average of measurements'), hint: L("Masofa eng qisqa yo'l, o'rtacha emas.", 'Расстояние это самый короткий путь, а не среднее.', 'A distance is the shortest path, not an average.') },
      ],
    },
  ],
  angles: ['AB', 'AC', 'BC', 'C'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', "Dars ikki o'xshash yozuv bilan boshlandi. Ulardan biri bo'sh bo'lib chiqdi.", 'Урок начался с двух похожих записей. Одна из них оказалась пустой.', 'The lesson began with two similar readings. One of them turned out to be empty.'),
    A('next', "Farq bitta so'zda edi. Proyeksiya xulosa beradi, perpendikulyar esa hech narsa bermaydi, chunki u butun tekislikka birdan perpendikulyar. Endi sizda proyeksiya bor, va keyingi darsda og'ma bilan uning orasidagi burchakni o'lchaymiz.", 'Разница была в одном слове. Проекция даёт вывод, перпендикуляр не даёт ничего, потому что он перпендикулярен всей плоскости сразу. Теперь у тебя есть проекция, и на следующем уроке мы измерим угол между наклонной и ею.', 'The difference was in one word. The projection gives a conclusion, the perpendicular gives nothing, because it is perpendicular to the whole plane at once. Now you have the projection, and in the next lesson we will measure the angle between the oblique and it.'),
  ],
  can: [
    L("Perpendikulyarni og'madan ajrataman va uning proyeksiyasini topaman", 'Отличаю перпендикуляр от наклонной и нахожу её проекцию', 'I tell a perpendicular from an oblique and find its projection'),
    L("Teoremani proyeksiyaga qo'llayman, perpendikulyarga emas", 'Применяю теорему к проекции, а не к перпендикуляру', 'I apply the theorem to the projection, not to the perpendicular'),
    L("Teoremani ikki tomonga o'qiyman", 'Читаю теорему в обе стороны', 'I read the theorem both ways'),
    L("Masofani perpendikulyar bo'yicha olaman", 'Беру расстояние по перпендикуляру', 'I take distance along the perpendicular'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L("Bundan keyin og'ma va uning proyeksiyasi orasidagi burchakni olamiz, bu to'g'ri chiziqning tekislik bilan burchagi", 'Дальше берём угол между наклонной и её проекцией — это и есть угол прямой с плоскостью', 'Next we take the angle between the oblique and its projection, and that is the angle of a line with a plane'),
  lifehack: L("Fazoda to'g'ri burchak izlayotgan bo'lsangiz, avval proyeksiyani toping", 'Ищешь прямой угол в пространстве — сначала найди проекцию', 'Looking for a right angle in space, find the projection first'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L("Geometriya, bir yuz o'ttiz birinchi va bir yuz o'ttiz beshinchi betlar", 'Геометрия, страницы сто тридцать один и сто тридцать пять', 'Geometry, pages one hundred thirty one and one hundred thirty five'),
  hook: {
    a: 'c ⊥ AB   →   c ⊥ AC',
    b: 'c ⊥ BC   →   c ⊥ AC',
  },
  proved: 'c ⊥ BC   ⇔   c ⊥ AC',
  law: 'AB ⊥ α,   c ⊂ α,   C ∈ c',
  sheet: [
    'AB ⊥ α',
    'AB < AC',
    'AC = AD ⇔ BC = BD',
    'c ⊥ BC ⇔ c ⊥ AC',
    'ρ(A; α) = AB',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))

// SAHNA. `A` tekislik ustidagi nuqta, `B` perpendikulyarning asosi, `C`
// og'maning asosi, `D` ikkinchi og'maning asosi (`BD = BC`, shuning uchun
// og'malar teng). `K` va `M` -- proyeksiyaga perpendikulyar `c` chizig'ining
// uchlari, `P` va `Q` -- proyeksiyaga perpendikulyar BO'LMAGAN `d` chizig'i.
// Ikkinchisi 6-ekranning chegarasi uchun: u perpendikulyarga perpendikulyar,
// og'maga esa yo'q.
const PTS = [
  { id: 'A', at: [0, 0, 0.95], label: 'A' },
  { id: 'B', at: [0, 0, 0], label: 'B' },
  { id: 'C', at: [0.9, 0, 0], label: 'C' },
  { id: 'D', at: [0, 0.9, 0], label: 'D' },
  { id: 'K', at: [0.9, -0.7, 0], label: '' },
  { id: 'M', at: [0.9, 0.7, 0], label: 'c' },
  { id: 'P', at: [0.5, -0.55, 0], label: '' },
  { id: 'Q', at: [1.3, 0.55, 0], label: 'd' },
]
const PLANE = [{ by: ['B', 'C', 'D'], dim: true }]
const GREY = '#7f8c8d'

// Perpendikulyar va og'ma -- ASOSIY chiziqlar, proyeksiya va tekislik
// chiziqlari -- kulrang: chizmada nima haqida gap ketayotgani ko'rinishi kerak.
const PERP = { from: 'A', to: 'B' }
const OBL = { from: 'A', to: 'C' }
const PROJ = { from: 'B', to: 'C', tone: GREY, w: 2 }
const OBL2 = { from: 'A', to: 'D' }
const PROJ2 = { from: 'B', to: 'D', tone: GREY, w: 2 }
const LINE_C = { from: 'K', to: 'M', tone: GREY, w: 2 }
const LINE_D = { from: 'P', to: 'Q', tone: GREY, w: 2 }

const THREE = [PERP, OBL, PROJ]
const TWO_OBL = [PERP, OBL, PROJ, OBL2, PROJ2]
const WITH_C = [PERP, OBL, PROJ, LINE_C]
const WITH_D = [PERP, OBL, PROJ, LINE_D]

// Har kadrda faqat o'sha kadrning nuqtalari (asbob 6A, `hide`).
const H_THREE = ['D', 'K', 'M', 'P', 'Q']
const H_TWO_OBL = ['K', 'M', 'P', 'Q']
const H_WITH_C = ['D', 'P', 'Q']
const H_WITH_D = ['D', 'K', 'M']

// To'g'ri burchak belgisi perpendikulyar tekislikka kirgan joyda.
const RIGHT_B = { at: 'B', from: 'A', to: 'C' }
// TEOREMA: ikki to'g'ri burchak BIR VAQTDA. `c` proyeksiyaga ham, og'maga ham
// perpendikulyar, va aynan shu ikkinchi belgi burilishda ham yo'qolmaydi.
const RIGHT_TTP = [
  { at: 'C', from: 'M', to: 'B' },
  { at: 'C', from: 'M', to: 'A', scale: 1.7 },
]

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
// `early` -- TO'G'RI, lekin bu qatorda emas degan razbor.
const PROOF_ROWS = [
  { text: S10.proof.r1, reason: 's2', early: S10.proof.e1 },
  { text: S10.proof.r2, reason: 's1', early: S10.proof.e2 },
  { text: S10.proof.r3, reason: 's3', early: S10.proof.e3, ok: S10.proof.ok },
]

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Prognoz TURG'UN chizmada beriladi: aynan shu chizmada ikki yozuv
        // ajralmaydi, va o'quvchi taxmin qilishga majbur.
        fig={() => (
          <Scene
            fig={<Space step={1} yaw={0.4} pts={PTS} planes={PLANE} segs={WITH_C} hide={H_WITH_C} angleAt={RIGHT_B} />}
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
          {/* Telefonda ustunlar bir-birining ostiga tushadi, shuning uchun
              chizma BALANDLIGI qat'iy: uch savol bilan birga sig'ishi kerak. */}
          <Scene
            fig={<Space step={1} yaw={0.4} pts={PTS} planes={PLANE} segs={THREE} hide={H_THREE} angleAt={RIGHT_B} />}
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
      <Scene
        fig={(
          <Space
            step={1} yaw={phase * 0.5} pts={PTS} planes={PLANE}
            segs={phase === 0 ? [PERP, OBL] : THREE}
            hide={H_THREE} angleAt={RIGHT_B}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      /* ASBOB 6A. Buradi O'QUVCHI: proyeksiya tekislikdan chiqmasligini
         faqat burilish ko'rsatadi, turg'un chizmada uchala kesma ham
         tekislikda yotgandek ko'rinadi. */
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} pts={PTS} planes={PLANE} segs={THREE} hide={H_THREE} angleAt={RIGHT_B} />}
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
      <Scene
        fig={(
          <Space
            step={1} yaw={phase * 0.55} pts={PTS} planes={PLANE}
            segs={TWO_OBL} hide={H_TWO_OBL} angleAt={RIGHT_B}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} pts={PTS} planes={PLANE} segs={TWO_OBL} hide={H_TWO_OBL} angleAt={RIGHT_B} />}
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
      /* DARSNING SHOHIDI. Birinchi kadrda bitta belgi -- shart bilan berilgani.
         Ikkinchisida ikkinchi belgi paydo bo'ladi, va u burilishda qolaveradi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={phase * 0.5} pts={PTS} planes={PLANE} segs={WITH_C} hide={H_WITH_C}
            angleAt={phase === 0 ? RIGHT_TTP[0] : RIGHT_TTP}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={<Space step={1} pts={PTS} planes={PLANE} segs={WITH_C} hide={H_WITH_C} angleAt={RIGHT_TTP} />}
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
      /* CHEGARA. `d` chizig'ida to'g'ri burchak BELGISI YO'Q, va bu ataylab:
         perpendikulyarga perpendikulyarlik har bir tekislik chizig'ida bor,
         shuning uchun uni belgilash hech narsa bildirmaydi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={phase * 0.6} pts={PTS} planes={PLANE}
            segs={WITH_D} hide={H_WITH_D} angleAt={RIGHT_B}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={<Space step={1} pts={PTS} planes={PLANE} segs={WITH_D} hide={H_WITH_D} angleAt={RIGHT_B} />}
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
      <Scene
        fig={(
          <Space
            step={1} yaw={phase * 0.5} pts={PTS} planes={PLANE}
            segs={TWO_OBL} hide={H_TWO_OBL} angleAt={RIGHT_B}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene
            fig={<Space step={1} yaw={0.5} pts={PTS} planes={PLANE} segs={THREE} hide={H_THREE} angleAt={RIGHT_B} />}
            max={230}
            h={134}
          />
          {/* Chizma 230, 300 emas: yakuniy holatda razbor ikki qatorga chiqadi,
              va telefonda ekran 7 px oshib ketardi (qo'l bilan o'tish prognoni). */}
          <Panel tone="paper">
            <Expr size="mid">{S7.expr}</Expr>
          </Panel>
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
                step={1} yaw={solved ? 0.8 : 0.3} pts={PTS} planes={PLANE}
                segs={WITH_C} hide={H_WITH_C}
                angleAt={solved ? RIGHT_TTP : RIGHT_TTP[0]}
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
                step={1} yaw={0.3 + round * 0.35} pts={PTS} planes={PLANE}
                segs={round === 1 ? TWO_OBL : WITH_C}
                hide={round === 1 ? H_TWO_OBL : H_WITH_C}
                angleAt={RIGHT_B}
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
