// ============================================================================
// 10-sinf, Dars 32. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS32_KONTENT.md
// Ma'lumot sborshchik bilan yig'ilgan, EKRAN TANALARI qo'lda (etalon 5.3).
// YANGI ASBOB YO'Q: kubning o'z chizmasi parallel proyeksiya, va dars aynan
// shu haqida. Burilish uzunlik va burchakni o'zgartiradi, parallellikni esa
// o'zgartirmaydi -- shohid shunda.
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
  Scene,
  SpinScene,
} from './tools.jsx'
import { Space } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 32
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Parallel proyeksiyalash`,
  `Урок ${LESSON_NO}. Параллельное проецирование`,
  `Lesson ${LESSON_NO}. Parallel projection`,
)

const BLOCK = { label: 'B1', from: 1, to: 7, current: 32 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('CHIZMA', 'ЧЕРТЁЖ', 'THE DRAWING'),
  title: L("Chizma nimani saqlaydi, nimani yo'qotadi", 'Что чертёж сохраняет, а что теряет', 'What the drawing keeps and what it loses'),
  audio: [
    A('mount', "Siz besh dars ko'rgan kub. Uning o'n ikki qirrasi fazoda teng.", 'Куб, который ты видел пять уроков. Все двенадцать его рёбер в пространстве равны.', 'The cube you have seen for five lessons. All twelve of its edges are equal in space.'),
    A('r1', "Birinchi yozuv chizmada ham ular teng deydi: kub bo'lsa, hammasi bir xil.", 'Первая запись говорит, что и на чертеже они равны: раз куб, значит всё одинаково.', 'The first reading says they are equal on the drawing too: it is a cube, so everything is the same.'),
    A('r2', "Ikkinchisi chizma ularning uzunligini o'zgartiradi deydi, fazoda esa ular teng.", 'Вторая говорит, что чертёж их длины меняет, хотя в пространстве они равны.', 'The second says the drawing changes their lengths, though in space they are equal.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi ekrandagi qirralarni solishtiramiz.', 'Твой ответ записан. Сейчас сравним рёбра на экране.', 'Your answer is saved. Now we will compare the edges on the screen.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('teng qirralar chizmada ham teng', 'равные рёбра равны и на чертеже', 'equal edges stay equal on the drawing'),
      value: '=',
    },
    b: {
      name: L('chizmada ularning uzunligi boshqa', 'на чертеже их длины разные', 'on the drawing their lengths differ'),
      value: '≠',
    },
  },
  expr: 'AB = AD = AA₁',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE BASICS'),
  title: L('Boshlashdan oldin uchta qisqa savol', 'Три коротких перед началом', 'Three short ones before we start'),
  tag: 'support',
  audio: [
    A('mount', "Kubning o'zi haqida uchta savol. Javoblarni ekranda ko'rinadigani bilan solishtiramiz.", 'Три вопроса про сам куб. Ответы будем сравнивать с тем, что видно на экране.', 'Three questions about the cube itself. We will compare the answers with what shows on the screen.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Kubning nechta qirrasi bor?', 'Сколько рёбер у куба?', 'How many edges has a cube?'),
      done: L("O'n ikki qirra, va fazoda ularning hammasi teng.", 'Двенадцать рёбер, и в пространстве все они равны.', 'Twelve edges, and in space all of them are equal.'),
      items: [
        { id: 'a', label: L('12', '12', '12'), correct: true },
        { id: 'b', label: L('8', '8', '8'), hint: L('Sakkiz bu uchlar, qirralar emas.', 'Восемь это вершины, а не рёбра.', 'Eight is the vertices, not the edges.') },
        { id: 'c', label: L('6', '6', '6'), hint: L('Olti bu yoqlar.', 'Шесть это грани.', 'Six is the faces.') },
        { id: 'd', label: L('4', '4', '4'), hint: L("To'rt bu bitta yoqning qirralari.", 'Четыре это рёбра одной грани.', 'Four is the edges of one face.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Kub asosidagi DAB burchagi. Unda necha daraja bor?', 'Угол DAB в основании куба. Сколько в нём градусов?', 'The angle DAB in the base of a cube. How many degrees has it?'),
      done: L("Fazoda to'qson daraja. Buni yodda tuting.", 'Девяносто градусов в пространстве. Держи это в голове.', 'Ninety degrees in space. Keep that in mind.'),
      items: [
        { id: 'a', label: L('90', '90', '90'), correct: true },
        { id: 'b', label: L('60', '60', '60'), hint: L('Oltmish bu muntazam uchburchak burchagi, asosda esa kvadrat.', 'Шестьдесят это угол правильного треугольника, а в основании квадрат.', 'Sixty is the angle of an equilateral triangle, and the base is a square.') },
        { id: 'c', label: L('120', '120', '120'), hint: L("Yuz yigirma bu chizmada ko'rinadigani, fazodagisi emas.", 'Сто двадцать это то, что видно на чертеже, а не то, что в пространстве.', 'A hundred and twenty is what shows on the drawing, not what is in space.') },
        { id: 'd', label: L('45', '45', '45'), hint: L("Qirq besh bu to'g'ri burchakning yarmi.", 'Сорок пять это половина прямого.', 'Forty five is half a right angle.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Ikki chiziq parallel. Ularning nechta umumiy nuqtasi bor?', 'Две прямые параллельны. Сколько у них общих точек?', 'Two lines are parallel. How many common points have they?'),
      done: L('Bu esa chizma buzmaydigan yagona narsa.', 'А это то единственное, что чертёж не портит.', 'And this is the one thing the drawing does not spoil.'),
      items: [
        { id: 'a', label: L("birorta ham yo'q", 'ни одной', 'none'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L('Bitta umumiy nuqta bu kesishish.', 'Одна общая точка это пересечение.', 'One common point is an intersection.') },
        { id: 'c', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p ustma-ust tushgan chiziqlarda.", 'Бесконечно много у совпавших прямых.', 'Infinitely many belongs to coinciding lines.') },
        { id: 'd', label: L("chizmaga bog'liq", 'зависит от чертежа', 'it depends on the drawing'), hint: L('Aynan parallellikni chizma saqlaydi.', 'Как раз параллельность чертёж и сохраняет.', 'Parallelism is precisely what the drawing keeps.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('UZUNLIK', 'ДЛИНА', 'LENGTH'),
  title: L('Fazoda teng, ekranda emas', 'В пространстве равны, на экране нет', 'Equal in space, not on the screen'),
  tag: 'proyekciya-sohranyaet-dlinu',
  show: [
    [
      L("Kubning hamma qirrasi ta'rif bo'yicha teng", 'Все рёбра куба равны по определению', 'All edges of a cube are equal by definition'),
      L("bir uchdan chiqqan ikki qirra bo'yalgan", 'подсвечены два ребра из одной вершины', 'two edges from one vertex are highlighted'),
      L('ekranda ularning uzunligi boshqa', 'на экране они разной длины', 'on the screen they have different lengths'),
    ],
    [
      L("Sahnaning burilishi uzunlikni o'zgartiradi", 'Поворот сцены длины меняет', 'Turning the scene changes the lengths'),
      L('demak chizmadagi uzunlik shaklning xossasi emas', 'значит длина на чертеже не свойство фигуры', 'so a length on the drawing is not a property of the figure'),
      L('bu chizmaning xossasi', 'это свойство чертежа', 'it is a property of the drawing'),
    ],
  ],
  motion: ['spin'],
  audio: [
    A('mount', "Kubning chizmasi darslik aytayotgan parallel proyeksiyaning o'zi.", 'Чертёж куба это и есть параллельная проекция, о которой говорит учебник.', 'The drawing of the cube is exactly the parallel projection the textbook speaks about.'),
    A('spin', "Sahnani buring va bo'yalgan qirralarni kuzatib turing. Ekranda ularning uzunligi doim o'zgaradi.", 'Поверни сцену и смотри на подсвеченные рёбра. На экране их длины всё время меняются.', 'Turn the scene and watch the highlighted edges. On the screen their lengths keep changing.'),
    A('work', "Fazoda esa hech narsa o'zgarmaydi: kub kub bo'lib qoladi.", 'В пространстве при этом не меняется ничего: куб остаётся кубом.', 'In space nothing changes: the cube stays a cube.'),
  ],
  work: {
    prompt: L("Fazoda kubning nechta qirrasi AB qirrasiga uzunligi bo'yicha teng?", 'Сколько рёбер куба равны ребру AB по длине в пространстве?', 'In space, how many edges of the cube are equal in length to AB?'),
    ok: L("To'g'ri. O'n bir: qolganlarining hammasi. Chizmada esa hammasi teng ko'rinmaydi.", 'Верно. Одиннадцать: все остальные. На чертеже равными выглядят далеко не все.', 'Correct. Eleven: all the others. On the drawing far from all of them look equal.'),
    hint: [
      L("Kubning hamma qirrasi o'zaro teng.", 'Все рёбра куба равны между собой.', 'All edges of a cube are equal to each other.'),
      L("Qirralar o'n ikkita, AB ning o'zini sanamaymiz.", 'Всего рёбер двенадцать, само AB не считаем.', 'There are twelve edges in all, and we do not count AB itself.'),
      L("O'n ikkidan bitta kam.", 'Двенадцать без одного.', 'Twelve minus one.'),
    ],
    answer: '11',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('BURCHAK', 'УГОЛ', 'ANGLE'),
  title: L("Chizmada to'g'ri burchak to'g'ri emas", 'Прямой угол на чертеже не прямой', 'A right angle is not right on the drawing'),
  tag: 'proyekciya-sohranyaet-dlinu',
  show: [
    [
      L('Kubning asosi kvadrat', 'Основание куба это квадрат', 'The base of a cube is a square'),
      L("uning to'rt burchagi ham to'g'ri", 'все четыре его угла прямые', 'all four of its angles are right'),
      L("ekranda birortasi ham to'g'ri ko'rinmaydi", 'на экране ни один прямым не выглядит', 'on the screen not one of them looks right'),
    ],
    [
      L("Burilish burchaklarni ham o'zgartiradi", 'Поворот меняет и углы', 'Turning changes the angles too'),
      L("bitta burchak ba'zan o'tkir, ba'zan o'tmas bo'ladi", 'один и тот же угол бывает то острым, то тупым', 'one and the same angle looks now acute, now obtuse'),
      L('demak burchak kattaligini chizma saqlamaydi', 'значит величину угла чертёж не сохраняет', 'so the drawing does not keep the size of an angle'),
    ],
  ],
  motion: ['angle'],
  audio: [
    A('mount', "Proyeksiya yo'qotadigan ikkinchi narsa bu burchaklar.", 'Второе, что теряет проекция, это углы.', 'The second thing the projection loses is angles.'),
    A('angle', "A uchidagi burchakni kuzatib turing. Ekranda u o'zgaradi, fazoda esa doim to'g'ri.", 'Смотри на угол в вершине A. На экране он меняется, в пространстве он всё время прямой.', 'Watch the angle at the vertex A. On the screen it changes, in space it stays right.'),
    A('work', "Shuning uchun chizmada to'g'ri burchak maxsus belgi bilan qo'yiladi: uni ko'z bilan tekshirib bo'lmaydi.", 'Поэтому отметку прямого угла на чертеже ставят особым знаком: глазом её не проверить.', 'That is why a right angle on a drawing is marked with a special sign: the eye cannot check it.'),
  ],
  work: {
    prompt: L("Fazoda kub asosining nechta to'g'ri burchagi bor?", 'Сколько прямых углов у основания куба в пространстве?', 'In space, how many right angles has the base of a cube?'),
    ok: L("To'g'ri. To'rtta, va ularning birortasi chizmada to'g'ri ko'rinmaydi.", 'Верно. Четыре, и ни один из них на чертеже прямым не выглядит.', 'Correct. Four, and not one of them looks right on the drawing.'),
    hint: [
      L('Asos bu kvadrat.', 'Основание это квадрат.', 'The base is a square.'),
      L("Kvadratning hamma burchagi to'g'ri.", 'У квадрата все углы прямые.', 'All angles of a square are right.'),
      L("Kvadratning burchagi to'rtta.", 'Углов у квадрата четыре.', 'A square has four angles.'),
    ],
    answer: '4',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('NIMA SAQLANADI', 'ЧТО СОХРАНЯЕТСЯ', 'WHAT IS KEPT'),
  title: L('Parallellik qoladi', 'Параллельность остаётся', 'Parallelism stays'),
  tag: 'proyekciya-sohranyaet-dlinu',
  show: [
    [
      L("Bir yo'nalishdagi qirralar bo'yalgan", 'Подсвечены рёбра одного направления', 'The edges of one direction are highlighted'),
      L('fazoda ular parallel', 'в пространстве они параллельны', 'in space they are parallel'),
      L('ekranda ham ular parallel', 'на экране они тоже параллельны', 'on the screen they are parallel too'),
    ],
    [
      L('Burilish buni buzmaydi', 'Поворот этого не ломает', 'Turning does not break this'),
      L("uzunlik va burchaklar o'zgaradi, parallellik yo'q", 'длины и углы меняются, параллельность нет', 'lengths and angles change, parallelism does not'),
      L('bu darslikning birinchi va ikkinchi xossasi', 'это первое и второе свойства учебника', 'these are the first and second properties in the textbook'),
    ],
  ],
  motion: ['keep'],
  audio: [
    A('mount', 'Endi proyeksiya saqlaydigan narsa haqida. Darslik ikki xossani ataydi.', 'Теперь о том, что проекция сохраняет. Учебник называет два свойства.', 'Now about what the projection keeps. The textbook names two properties.'),
    A('keep', "Burilishda bo'yalgan qirralarni kuzatib turing. Ular har rakursda parallel qoladi.", 'Смотри на подсвеченные рёбра при повороте. Они остаются параллельными на любом ракурсе.', 'Watch the highlighted edges as it turns. They stay parallel at any angle.'),
    A('work', "Kesma kesma bo'lib qoladi, parallellar parallel bo'lib qoladi. Qolganini chizma o'zgartiradi.", 'Отрезок остаётся отрезком, а параллельные остаются параллельными. Остальное чертёж меняет.', 'A segment stays a segment, and parallel lines stay parallel. The rest the drawing changes.'),
  ],
  work: {
    prompt: L('Kubning nechta qirrasi AB qirrasiga parallel?', 'Сколько рёбер куба параллельны ребру AB?', 'How many edges of the cube are parallel to the edge AB?'),
    ok: L("To'g'ri. Uchta, va chizmada ham ular parallel: bu proyeksiyaning xossasi.", 'Верно. Три, и на чертеже они тоже параллельны: это свойство проекции.', 'Correct. Three, and on the drawing they are parallel too: that is a property of the projection.'),
    hint: [
      L("O'sha yo'nalishdagi qirralarni toping.", 'Найди рёбра того же направления.', 'Find the edges of the same direction.'),
      L('Biri asosda, ikkitasi yuqori yoqda.', 'Одно в основании, два в верхней грани.', 'One in the base, two in the top face.'),
      L('Bunday qirra jami uchta.', 'Всего таких три.', 'There are three such edges in all.'),
    ],
    answer: '3',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("YO'NALISH", 'НАПРАВЛЕНИЕ', 'THE DIRECTION'),
  title: L("Yo'nalish tekislikni kesishi shart", 'Направление обязано пересекать плоскость', 'The direction must cross the plane'),
  tag: 'napravlenie-vdol-ploskosti',
  show: [
    [
      L("Proyeksiyalash yo'nalish bilan beriladi", 'Проецирование задаётся направлением', 'A projection is set by a direction'),
      L("har nuqta orqali shu yo'nalishdagi chiziq o'tkaziladi", 'через каждую точку проводится прямая этого направления', 'through each point a line of that direction is drawn'),
      L('va uning tekislik bilan kesishishi belgilanadi', 'и отмечается её пересечение с плоскостью', 'and its intersection with the plane is marked'),
    ],
    [
      L("Tekislik bo'ylab yo'nalishni olamiz", 'Возьмём направление вдоль плоскости', 'Take a direction along the plane'),
      L('bunday chiziq tekislikka yetib bormaydi', 'такая прямая до плоскости не доходит', 'such a line never reaches the plane'),
      L("kesishish yo'q, proyeksiya ham yo'q", 'пересечения нет, и проекции тоже', 'there is no intersection, and no projection either'),
    ],
  ],
  motion: ['dir'],
  audio: [
    A('mount', "Darslik proyeksiyalash yo'nalishining o'ziga shart qo'yadi.", 'Учебник ставит условие на само направление проецирования.', 'The textbook puts a condition on the direction of projection itself.'),
    A('dir', "Yo'nalish chizig'i qayerga borishini kuzatib turing. U tekislikni kesib turganda proyeksiya bor.", 'Смотри, куда идёт прямая направления. Пока она пересекает плоскость, проекция есть.', 'Watch where the line of the direction goes. As long as it crosses the plane, there is a projection.'),
    A('work', "Tekislik bo'ylab yo'nalish proyeksiyani umuman bermaydi.", 'Направление вдоль плоскости проекции не даёт вовсе.', 'A direction along the plane gives no projection at all.'),
  ],
  work: {
    prompt: L('Tekislikka parallel chiziq tekislikda nechta nuqta qoldiradi?', 'Сколько точек оставит на плоскости прямая, параллельная этой плоскости?', 'How many points will a line parallel to the plane leave on it?'),
    ok: L("To'g'ri. Birorta ham yo'q, shuning uchun darslik bunday yo'nalishni taqiqlaydi.", 'Верно. Ни одной, поэтому такое направление учебник запрещает.', 'Correct. None, which is why the textbook forbids such a direction.'),
    hint: [
      L("Bu o'tgan dars: parallel chiziq va tekislik.", 'Это прошлый урок: параллельная прямая и плоскость.', 'This is the last lesson: a line parallel to a plane.'),
      L("Parallel chiziq va tekislikning umumiy nuqtasi yo'q.", 'У параллельных прямой и плоскости общих точек нет.', 'A parallel line and plane share no points.'),
      L('Demak nol.', 'Значит ноль.', 'So zero.'),
    ],
    answer: '0',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE'),
  title: L("Yo'nalish bo'ylab kesma", 'Отрезок вдоль направления', 'A segment along the direction'),
  tag: 'otrezok-vdol-napravleniya',
  show: [
    [
      L("Xossalar hamma kesma uchun to'g'ri emas", 'Свойства верны не для всех отрезков', 'The properties do not hold for every segment'),
      L("darslik yo'nalish haqida izoh beradi", 'учебник делает оговорку про направление', 'the textbook adds a remark about the direction'),
      L("yo'nalish bo'ylab kesma o'zining proyeksiyalovchi chizig'i bo'ylab boradi", 'отрезок вдоль направления идёт по своей проецирующей прямой', 'a segment along the direction lies on its own projecting line'),
    ],
    [
      L('Uning hamma nuqtasi bitta nuqtaga ketadi', 'Все его точки уходят в одну и ту же точку', 'All its points go into one and the same point'),
      L('uning proyeksiyasi endi kesma emas', 'отрезком его проекция уже не является', 'its projection is no longer a segment'),
      L("shuning uchun izoh darslikning o'zida turadi", 'поэтому оговорка стоит в самом учебнике', 'that is why the remark stands in the textbook itself'),
    ],
  ],
  motion: ['point'],
  audio: [
    A('mount', "Darslikning oxirgi sharti: xossalar yo'nalishga parallel bo'lmagan kesmalar uchun to'g'ri.", 'Последнее условие учебника: свойства верны для отрезков, не параллельных направлению.', 'The last condition of the textbook: the properties hold for segments not parallel to the direction.'),
    A('point', "Yo'nalish bo'ylab ketadigan kesmaga nima bo'lishini kuzatib turing.", 'Смотри, что происходит с отрезком, который идёт вдоль направления.', 'Watch what happens to a segment running along the direction.'),
    A('work', "U nuqtaga aylanadi, va uning uzunligi haqida gapirib bo'lmaydi.", 'Он превращается в точку, и говорить о его длине больше нельзя.', 'It turns into a point, and one can no longer speak of its length.'),
  ],
  work: {
    prompt: L("Yo'nalish bo'ylab ketadigan kesma nechta nuqtaga o'tadi?", 'Во сколько точек перейдёт отрезок, идущий вдоль направления?', 'Into how many points does a segment along the direction go?'),
    ok: L("To'g'ri. Bittaga. Proyeksiya kesma bo'lishdan to'xtadi, shuning uchun xossalar unga qo'llanmaydi.", 'Верно. В одну. Проекция отрезком быть перестала, поэтому свойства к нему не применяют.', 'Correct. Into one. The projection stopped being a segment, so the properties do not apply to it.'),
    hint: [
      L('Kesmaning hamma nuqtasi bitta proyeksiyalovchi chiziqda yotadi.', 'Все точки отрезка лежат на одной проецирующей прямой.', 'All points of the segment lie on one projecting line.'),
      L('Bu chiziq tekislikni bir marta kesadi.', 'Эта прямая пересекает плоскость один раз.', 'That line crosses the plane once.'),
      L('Demak nuqta ham bitta chiqadi.', 'Значит и точка получится одна.', 'So the point comes out one.'),
    ],
    answer: '1',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  title: L("Ta'rif va ikki xossa", 'Определение и два свойства', 'The definition and two properties'),
  tag: 'proyekciya-sohranyaet-dlinu',
  motion: ['rule'],
  audio: [
    A('mount', 'Kartochkani ochishdan oldin bitta savolga javob bering.', 'Прежде чем открыть карточку, ответь на один вопрос.', 'Before the card opens, answer one question.'),
    A('rule', "Kartochka darslik so'zlari bilan gapiradi. Ikki xossa, va ikkalasi qoladigan narsa haqida.", 'Карточка говорит словами учебника. Два свойства, и оба про то, что остаётся.', 'The card speaks in the words of the textbook. Two properties, and both about what remains.'),
  ],
  probe: {
    question: L('Proyeksiya nimani saqlaydi?', 'Что проекция сохраняет?', 'What does the projection keep?'),
    items: [
      { id: 'a', label: L('parallellikni va kesmaning kesma qolishini', 'параллельность и то, что отрезок остаётся отрезком', 'parallelism and that a segment stays a segment'), correct: true },
      { id: 'b', label: L('uzunlik va burchak kattaligini', 'длины и величины углов', 'lengths and angle sizes'), hint: L("Kub qirralari teng, ekranda esa boshqa; asos burchaklari to'g'ri, ekranda esa emas.", 'Рёбра куба равны, а на экране разные; углы основания прямые, а на экране нет.', 'The cube edges are equal, on the screen they differ; the base angles are right, on the screen they are not.') },
    ],
  },
  rule: {
    lawLabel: L('Parallel proyeksiyalash', 'Параллельное проецирование', 'Parallel projection'),
    lines: [
      L("109-bet. Har bir nuqta proyeksiyalash yo'nalishiga parallel chiziqlar bo'ylab tekislikka ko'chiriladi.", 'Стр. 109. Каждая точка переносится на плоскость по прямым, параллельным направлению проецирования.', 'Page 109. Each point is carried onto the plane along lines parallel to the direction of projection.'),
      L("110-bet, 1-xossa. Kesma kesmaga, to'g'ri chiziq to'g'ri chiziqqa o'tadi.", 'Стр. 110, свойство 1. Отрезок переходит в отрезок, прямая в прямую.', 'Page 110, property 1. A segment goes to a segment, a line to a line.'),
      L("110-bet, 2-xossa. Parallel kesmalar parallel kesmalarga o'tadi yoki ustma-ust tushadi.", 'Стр. 110, свойство 2. Параллельные отрезки переходят в параллельные или совпадают.', 'Page 110, property 2. Parallel segments go to parallel ones or coincide.'),
    ],
    law: 'AB ∥ CD   ⇒   A₀B₀ ∥ C₀D₀',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L("TO'RT XOSSA", 'ЧЕТЫРЕ СВОЙСТВА', 'FOUR PROPERTIES'),
  title: L("Xossani o'z taqdiri bilan biriktiring", 'Соедини свойство с его судьбой', 'Match each property with its fate'),
  tag: 'proyekciya-sohranyaet-dlinu',
  audio: [
    A('mount', "To'rt kattalik va bitta proyeksiya. Ikkitasini u o'zgartiradi, ikkitasini qoldiradi.", 'Четыре величины и одна проекция. Две из них она меняет, две оставляет.', 'Four quantities and one projection. Two of them it changes, two it leaves.'),
  ],
  match: {
    prompt: L('Proyeksiya har biri bilan nima qiladi', 'Что проекция делает с каждым из них', 'What the projection does with each'),
    a: L("uzunlik o'zgaradi", 'длина меняется', 'length changes'),
    b: L("burchak o'zgaradi", 'угол меняется', 'the angle changes'),
    c: L('parallellik saqlanadi', 'параллельность сохраняется', 'parallelism is kept'),
    d: L("kesma bo'lib qoladi", 'остаётся отрезком', 'stays a segment'),
    ok: L("To'rttasi ham to'g'ri. Darslikning ikki xossasi aynan omon qolgan narsa.", 'Все четыре верно. Два свойства учебника это ровно то, что уцелело.', 'All four correct. The two textbook properties are exactly what survived.'),
    left: ['AB = AD', '∠DAB = 90°', 'AB ∥ CD', 'AB → A₀B₀'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Nuqtaning proyeksiyasini yasang', 'Построй проекцию точки', 'Build the projection of a point'),
  tag: 'napravlenie-vdol-ploskosti',
  audio: [
    A('mount', "Nuqta proyeksiyasini yasash uch qadamda boradi, birinchi qadam yo'nalish haqida.", 'Построение проекции точки идёт в три шага, и первый шаг про направление.', 'Building the projection of a point takes three steps, and the first is about the direction.'),
  ],
  order: {
    prompt: L('Tartib bilan joylashtiring', 'Расставь по порядку', 'Put them in order'),
    s1: L("tekislikni kesuvchi yo'nalishni tanlash", 'выбрать направление, пересекающее плоскость', 'choose a direction crossing the plane'),
    s2: L("nuqta orqali shu yo'nalishdagi chiziqni o'tkazish", 'провести через точку прямую этого направления', 'draw through the point a line of that direction'),
    s3: L('chiziqning tekislik bilan kesishishini belgilash', 'отметить пересечение прямой с плоскостью', 'mark where the line meets the plane'),
    ok: L("To'g'ri. Darslik A nol nuqtasini aynan shunday yasaydi.", 'Верно. Именно так учебник строит точку A нулевое.', 'Correct. This is exactly how the textbook builds the point A zero.'),
    bad: L("Tartib boshqacha. Yo'nalish har qanday yasashdan oldin tanlanadi.", 'Порядок другой. Направление выбирается до всякого построения.', 'The order is different. The direction is chosen before any construction.'),
    mark: 'A₀ ∈ α',
  },
  expr: 'A → A₀',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Asbobsiz', 'Без прибора', 'No instrument'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu yerda asbob yo'q. Avval yozuvlar tartibi, keyin javob.", 'Прибора здесь нет. Сначала порядок записей, потом ответ.', 'There is no instrument here. First the order of the lines, then the answer.'),
    A('next', "Endi masalaning o'zi. Sonni yozing.", 'Теперь сама задача. Пиши число.', 'Now the task itself. Write the number.'),
  ],
  order: {
    prompt: L("Yozuvlarni paydo bo'lish tartibida joylashtiring", 'Расставь записи в том порядке, в каком они появляются', 'Put the lines in the order they appear'),
    title: L('Yozuvlar tartibi', 'Порядок записей', 'The order of the lines'),
    ok: L("To'g'ri. Avval xossa, keyin shakl haqida xulosa.", 'Верно. Сначала свойство, потом вывод о фигуре.', 'Correct. First the property, then the conclusion about the figure.'),
    bad: L("Tartib to'g'ri emas. Shakl haqidagi xulosa oxirida yoziladi.", 'Не тот порядок. Вывод о фигуре пишется последним.', 'Wrong order. The conclusion about the figure is written last.'),
    items: ['AB ∥ CD', 'A₀B₀ ∥ C₀D₀', 'AB = CD', 'A₀B₀ = C₀D₀ — ?'],
    answer: 'AB ∥ CD  A₀B₀ ∥ C₀D₀  AB = CD  A₀B₀ = C₀D₀ — ?',
  },
  task: {
    prompt: L("Kubni tik qirralar bo'ylab proyeksiyalaymiz. Nechta qirra nuqtaga o'tadi?", 'Проецируем куб вдоль вертикальных рёбер. Сколько рёбер перейдёт в точки?', 'We project the cube along its vertical edges. How many edges go into points?'),
    ok: L("To'g'ri. To'rt tik qirra: ular yo'nalish bo'ylab boradi.", 'Верно. Четыре вертикальных: они идут вдоль направления.', 'Correct. The four vertical ones: they run along the direction.'),
    hint: [
      L("Yo'nalish bo'ylab ketadigan narsa nuqtaga o'tadi.", 'В точку переходит то, что идёт вдоль направления.', 'What runs along the direction goes into a point.'),
      L("Yo'nalish tik qirralar bilan berilgan.", 'Направление задано вертикальными рёбрами.', 'The direction is set by the vertical edges.'),
      L("Kubning tik qirralari to'rtta.", 'Вертикальных рёбер у куба четыре.', 'A cube has four vertical edges.'),
    ],
    answer: '4',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Hamma qadam to'g'ri, xulosa noto'g'ri", 'Все шаги верны, вывод неверен', 'Every step is right, the conclusion is wrong'),
  tag: 'check',
  audio: [
    A('mount', "Isbot to'rt satrda yozilgan. Xato paydo bo'lgan satrni toping.", 'Доказательство выписано в четыре строки. Найди ту, где появилась ошибка.', 'The proof is written in four lines. Find the one where the mistake appeared.'),
    A('next', 'Endi sonni yozing.', 'Теперь запиши число.', 'Now write the number.'),
  ],
  hint: {
    r1: L("To'g'ri: bu darslikning birinchi xossasi.", 'Верно: это первое свойство учебника.', 'Correct: this is the first textbook property.'),
    r2: L("To'g'ri: bu ikkinchi xossa.", 'Верно: это второе свойство.', 'Correct: this is the second property.'),
    r3: L("Bu ham to'g'ri: ikki xossadan parallelogramm chiqadi.", 'Тоже верно: из двух свойств параллелограмм и получается.', 'Also correct: the two properties do give a parallelogram.'),
  },
  proof: L("Xato oxirgi satrda. Proyeksiya na uzunlikni, na burchakni saqlaydi, shuning uchun kvadratni kafolatlab bo'lmaydi.", 'Ошибка в последней строке. Проекция не сохраняет ни длины, ни углы, поэтому квадрат гарантировать нельзя.', 'The mistake is in the last line. The projection keeps neither lengths nor angles, so a square cannot be guaranteed.'),
  entry: {
    prompt: L("Proyeksiya nechta to'g'ri burchakni kafolatlaydi?", 'Сколько прямых углов гарантирует проекция?', 'How many right angles does the projection guarantee?'),
    ok: L("To'g'ri. Birorta ham yo'q: proyeksiya burchak kattaligini saqlamaydi.", 'Верно. Ни одного: величину угла проекция не сохраняет.', 'Correct. None: the projection does not keep the size of an angle.'),
    hint: [
      L("To'rtinchi ekranga qarang: unda to'g'ri burchakka nima bo'ldi.", 'Посмотри на экран четыре: что там стало с прямым углом.', 'Look at screen four: what happened to the right angle there.'),
      L("Darslik faqat ikki xossani ataydi, burchak ular orasida yo'q.", 'Учебник называет только два свойства, и угла среди них нет.', 'The textbook names only two properties, and the angle is not among them.'),
      L("Demak kafolatlangan to'g'ri burchak nol.", 'Значит гарантированных прямых углов ноль.', 'So the guaranteed right angles are zero.'),
    ],
    answer: '0',
  },
  row: {
    r1: 'AB → A₀B₀',
    r2: 'AB ∥ CD   ⇒   A₀B₀ ∥ C₀D₀',
    r3: 'A₀B₀ ∥ C₀D₀,   A₀D₀ ∥ B₀C₀',
    r4: '∠A₀ = 90°',
  },
  answerId: 'r4',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE REVERSE TASK'),
  title: L('Endi siz hal qilasiz', 'Теперь решаешь ты', 'Now you decide'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Bungacha xossalarni darslik atardi. Endi siz tanlaysiz.', 'До этого свойства называл учебник. Теперь выбираешь ты.', 'Until now the textbook named the properties. Now you choose.'),
    A('work', "E'tibor bering: son bilan o'lchanmaydigan narsa saqlanadi.", 'Обрати внимание: сохраняется то, что не измеряется числом.', 'Notice: what is kept is what is not measured by a number.'),
  ],
  multi: {
    prompt: L('Proyeksiya saqlaydigan hamma narsani belgilang', 'Отметь всё, что проекция сохраняет', 'Mark everything the projection keeps'),
    title: L("To'rttadan ikkitasi", 'Две из четырёх', 'Two out of four'),
    ok: L("To'g'ri. Darslikdagi aynan ikki xossa saqlanadi.", 'Верно. Сохраняются ровно два свойства из учебника.', 'Correct. Exactly the two textbook properties are kept.'),
    items: [
      { id: 'c', label: 'AB = CD   ⇒   A₀B₀ = C₀D₀', hint: L("Uzunlikni proyeksiya o'zgartiradi: kubning teng qirralari ekranda boshqa.", 'Длину проекция меняет: равные рёбра куба на экране разные.', 'The projection changes length: the equal cube edges differ on the screen.') },
      { id: 'd', label: '∠DAB = 90°   ⇒   ∠D₀A₀B₀ = 90°', hint: L("Burchak kattaligini ham: to'g'ri burchak o'tmas ko'rinadi.", 'Величину угла тоже: прямой угол выглядит тупым.', 'The angle size too: a right angle looks obtuse.') },
      { id: 'a', label: 'AB ∥ CD   ⇒   A₀B₀ ∥ C₀D₀', ok: true },
      { id: 'b', label: 'AB → A₀B₀', ok: true },
    ],
  },
  entry: {
    prompt: L("Yo'nalish bo'ylab ketadigan kesmaning proyeksiyasi nechta nuqta beradi?", 'Сколько точек даёт проекция отрезка, идущего вдоль направления?', 'How many points does the projection of a segment along the direction give?'),
    ok: L("To'g'ri. Bitta. Bu kesma kesma bo'lib qolmaydigan yagona hol.", 'Верно. Одну. Это единственный случай, когда отрезок отрезком не остаётся.', 'Correct. One. This is the only case where a segment does not stay a segment.'),
    hint: [
      L('Kesmaning hamma nuqtasi bitta proyeksiyalovchi chiziqda yotadi.', 'Все точки отрезка лежат на одной проецирующей прямой.', 'All points of the segment lie on one projecting line.'),
      L('Chiziq tekislikni bir marta kesadi.', 'Прямая пересекает плоскость один раз.', 'The line crosses the plane once.'),
      L('Demak nuqta bitta.', 'Значит точка одна.', 'So the point is one.'),
    ],
    expr: 'AA₁ → A₀',
    answer: '1',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'THE BLITZ'),
  title: L("Ketma-ket to'rtta savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'proyekciya-sohranyaet-dlinu',
  audio: [
    A('mount', "To'rtta savol, va ular baholanadi.", 'Четыре вопроса, и они идут в оценку.', 'Four questions, and they count towards the score.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Kesmaning proyeksiyasi bu...', 'Проекция отрезка это…', 'The projection of a segment is...'),
      done: L("Kesma yoki nuqta. Nuqta faqat yo'nalish bo'ylab.", 'Отрезок или точка. Точка только вдоль направления.', 'A segment or a point. A point only along the direction.'),
      items: [
        { id: 'a', label: L('kesma yoki nuqta', 'отрезок или точка', 'a segment or a point'), correct: true },
        { id: 'b', label: L('doim kesma', 'всегда отрезок', 'always a segment'), hint: L("Yo'nalish bo'ylab kesma nuqtaga o'tadi.", 'Отрезок вдоль направления переходит в точку.', 'A segment along the direction goes into a point.') },
        { id: 'c', label: L('doim nuqta', 'всегда точка', 'always a point'), hint: L("Nuqtaga faqat yo'nalish bo'ylab kesma o'tadi.", 'В точку переходит только отрезок вдоль направления.', 'Only a segment along the direction goes into a point.') },
        { id: 'd', label: L('egri chiziq', 'кривая', 'a curve'), hint: L("Kesmaning proyeksiyasi egri chiziq bo'lmaydi: darslikning birinchi xossasi.", 'Кривой проекция отрезка не бывает: первое свойство учебника.', 'The projection of a segment is never a curve: the first textbook property.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Teng kesmalar proyeksiyalashdan keyin...', 'Равные отрезки после проецирования…', 'Equal segments after projecting...'),
      done: L("Uzunlik chizmaning xossasi emas: u o'zgaradi.", 'Длина не свойство чертежа: она меняется.', 'Length is not a property of the drawing: it changes.'),
      items: [
        { id: 'a', label: L("boshqa bo'lib qolishi mumkin", 'могут стать разными', 'may become different'), correct: true },
        { id: 'b', label: L('teng qoladi', 'остаются равными', 'stay equal'), hint: L('Kub qirralari teng, chizmada esa uzunligi boshqa.', 'Рёбра куба равны, а на чертеже разной длины.', 'The cube edges are equal, and different in length on the drawing.') },
        { id: 'c', label: L("parallel bo'lib qoladi", 'становятся параллельными', 'become parallel'), hint: L("Parallellik saqlanadi, paydo bo'lmaydi.", 'Параллельность сохраняется, а не появляется.', 'Parallelism is kept, not created.') },
        { id: 'd', label: L("yo'qoladi", 'исчезают', 'disappear'), hint: L("Kesma yo'qololmaydi: u kesmaga yoki nuqtaga o'tadi.", 'Исчезнуть отрезок не может: он переходит в отрезок или точку.', 'A segment cannot disappear: it goes to a segment or a point.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Proyeksiyalash yo'nalishi shart...", 'Направление проецирования обязано…', 'The direction of projection must...'),
      done: L("Tekislikni kesishi kerak. Aks holda proyeksiya yo'q.", 'Должно пересекать плоскость. Иначе проекции нет.', 'It must cross the plane. Otherwise there is no projection.'),
      items: [
        { id: 'a', label: L('proyeksiya tekisligini kesishi', 'пересекать плоскость проекции', 'cross the plane of projection'), correct: true, ok: L("Ha: aks holda chiziqlar tekislikka yetmaydi va proyeksiya yo'q.", 'Да: иначе прямые до плоскости не доходят и проекции нет.', 'Yes: otherwise the lines never reach the plane and there is no projection.') },
        { id: 'b', label: L("tekislikka parallel bo'lishi", 'быть параллельным плоскости', 'be parallel to the plane'), hint: L("Parallel yo'nalish tekislikda birorta nuqta bermaydi.", 'Параллельное направление не даёт ни одной точки на плоскости.', 'A parallel direction gives no point on the plane at all.') },
        { id: 'c', label: L("tekislikka perpendikulyar bo'lishi", 'быть перпендикулярным плоскости', 'be perpendicular to the plane'), hint: L('Perpendikulyari yaraydi, lekin bu xususiy hol.', 'Перпендикулярное годится, но это лишь частный случай.', 'A perpendicular one works, but that is only a special case.') },
        { id: 'd', label: L('tekislikda yotishi', 'лежать в плоскости', 'lie in the plane'), hint: L("Unda hamma nuqta tekislikda, proyeksiyalaydigan narsa yo'q.", 'Тогда все точки уже в плоскости, и проецировать нечего.', 'Then all points are already in the plane and there is nothing to project.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Kub chizmasida to'g'ri burchak...", 'Прямой угол на чертеже куба…', 'A right angle on the drawing of a cube...'),
      done: L("Shart emas. Shuning uchun to'g'ri burchak belgi bilan ko'rsatiladi.", 'Не обязан. Поэтому прямой угол помечают знаком.', 'It need not. That is why a right angle is marked with a sign.'),
      items: [
        { id: 'a', label: L("to'g'ri ko'rinishi shart emas", 'прямым выглядеть не обязан', 'need not look right'), correct: true },
        { id: 'b', label: L("doim to'g'ri ko'rinadi", 'всегда выглядит прямым', 'always looks right'), hint: L("Asos burchaklari to'g'ri, ekranda esa o'tmas.", 'Углы основания прямые, а на экране тупые.', 'The base angles are right, and obtuse on the screen.') },
        { id: 'c', label: L("chizmada yo'qoladi", 'на чертеже исчезает', 'disappears on the drawing'), hint: L("Burchak qoladi, faqat ekranda kattaligi o'zgaradi.", 'Угол остаётся, меняется только его величина на экране.', 'The angle remains, only its size on the screen changes.') },
        { id: 'd', label: L("yoyilgan bo'lib qoladi", 'становится развёрнутым', 'becomes straight'), hint: L("Yoyilgan bo'lishi uchun yoq tekisligi bo'ylab qarash kerak.", 'Развёрнутым он стал бы, только если смотреть вдоль плоскости грани.', 'It would become straight only when looking along the plane of the face.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('XULOSA', 'ИТОГ', 'THE SUMMARY'),
  title: L("Chizma to'rt xossadan ikkitasini saqlaydi", 'Чертёж сохраняет два свойства из четырёх', 'The drawing keeps two properties out of four'),
  audio: [
    A('mount', 'Birinchi ekrandagi taxmin va natija yonma-yon turadi.', 'Прогноз с первого экрана и результат стоят рядом.', 'The guess from screen one and the result stand side by side.'),
    A('next', "Shpargalka darslik bo'yicha yig'ilgan. Pastda nimani bilishingiz ko'rinadi.", 'Шпаргалка собрана по учебнику. Ниже видно, что умеешь.', 'The sheet is put together from the textbook. Below you can see what you can do.'),
  ],
  can: [
    L('Fazoviy shakl chizmasi proyeksiya ekanini bilaman', 'Знаю, что чертёж пространственной фигуры это проекция', 'I know a drawing of a spatial figure is a projection'),
    L("Chizmadan uzunlik va burchakni o'qimayman", 'Не читаю с чертежа длины и углы', 'I do not read lengths and angles off a drawing'),
    L('Parallellik saqlanishidan foydalanaman', 'Пользуюсь тем, что параллельность сохраняется', 'I use the fact that parallelism is kept'),
    L("Yo'nalish bo'ylab kesmani yodda tutaman", 'Помню про отрезок вдоль направления', 'I remember the segment along the direction'),
  ],
  levels: {
    full: L("Hammasidan o'tdingiz va tuzoqni ochdingiz", 'Прошёл всё и разобрал ловушку', 'Everything done, the trap taken apart'),
    gap: L("Xossalarni bilasiz, yo'nalish haqidagi izoh hali chalkashadi", 'Свойства помнишь, оговорка про направление ещё путается', 'The properties are there, the remark on the direction still slips'),
    back: L('Uchinchi ekranga qaytish kerak: chizmadagi uzunlik shaklning xossasi emas', 'Стоит вернуться к экрану три: длина на чертеже не свойство фигуры', 'Worth going back to screen three: a length on a drawing is not a property of the figure'),
  },
  bridge: L("Keyingisi fazoda perpendikulyarlik: unda to'g'ri burchakni isbotlash kerak, chizmaga qarash emas.", 'Дальше перпендикулярность в пространстве: там прямой угол придётся доказывать, а не смотреть на чертёж.', 'Next comes perpendicularity in space: there a right angle has to be proved, not looked at on a drawing.'),
  lifehack: L('Chizmada faqat ikki narsaga ishonish mumkin: kesma kesma qoldi va parallellar parallel qoldi. Qolgani shartdan olinadi, rasmdan emas.', 'На чертеже верить можно только двум вещам: отрезок остался отрезком и параллельные остались параллельными. Всё остальное берётся из условия, а не с картинки.', 'On a drawing only two things can be trusted: a segment stayed a segment and parallel lines stayed parallel. Everything else comes from the statement, not from the picture.'),
  sheetTitle: L('Dars shpargalkasi', 'Шпаргалка урока', 'The lesson sheet'),
  sheetSrc: L('geometriya 2022, 109, 110-betlar', 'геометрия 2022, стр. 109, 110', 'geometry 2022, pages 109, 110'),
  hook: {
    a: '=',
    b: '≠',
  },
  proved: '≠',
  law: 'AB ∥ CD   ⇒   A₀B₀ ∥ C₀D₀',
  sheet: [
    'AB = AD,   A₀B₀ ≠ A₀D₀',
    '∠DAB = 90°,   ∠D₀A₀B₀ ≠ 90°',
    'AB ∥ CD   ⇒   A₀B₀ ∥ C₀D₀',
    'AB → A₀B₀',
    'AA₁ ∥ l   ⇒   AA₁ → A₀',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))


// ASBOB YANGI EMAS: KUBNING O'Z CHIZMASI parallel proyeksiya. Shuning uchun
// sahna o'sha, o'zgaradigan narsa -- nima bo'yalgani va burilish bormi.
//
// Bir uchdan chiqqan ikki qirra: fazoda teng, ekranda esa uzunligi boshqa.
const TWO_EDGES = ['AB', 'AD']
// Asosning to'rt burchagi: fazoda to'g'ri, ekranda to'g'ri emas.
const BASE = [{ by: ['A', 'B', 'C'], dim: true }]
// Bir yo'nalishdagi to'rt qirra: parallellik SAQLANADI.
const SAME_DIR = ['AB', 'CD', 'A1B1', 'D1C1']
// Yo'nalish bo'ylab qirralar: ular nuqtaga o'tadi.
const VERTICALS = ['AA1', 'BB1', 'CC1', 'DD1']

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const CASE_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const CASE_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

// UCHTA QADAM: to'rtta slot noutbukning 615 px iga sig'maydi (25 va 8-darsda
// o'lchangan). Alomatning ikki sharti va xulosa -- uchtasi yetadi.
const ORD10 = ['s1', 's2', 's3'].map((id) => ({ id, label: S10.order[id] }))
const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Rakurs SINFNING odatdagisi, va aynan unda chiziq bo'yalgan yoqning
        // ustidan o'tgandek ko'rinadi: prognoz shu aldov ustida qilinadi.
        fig={() => (
          <Scene fig={<Space step={1} yaw={0.4} cube hi={TWO_EDGES} />} max={172} h={172} />
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
          {/* Telefonda ustunlar bir-birining ostiga tushadi: balandlik qat'iy. */}
          <Scene fig={<Space step={1} yaw={0.4} cube planes={BASE} />} max={240} h={158} />
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
        fig={<Space step={1} cube hi={TWO_EDGES} yaw={phase === 0 ? 0.4 : 1.6} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      /* DARSNING SHOHIDI. Buradigan o'quvchi: u burmaguncha «yoq ustidan
         o'tadi» va «yoqdan baland o'tadi» ekranda bir xil ko'rinadi. */
      <SpinScene
        yaw0={0.4}
        stepYaw={0.6}
        scene={<Space step={1} cube hi={TWO_EDGES} />}
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
      /* 1-kadr: alomat TO'G'RI ishlagan holat. 2-kadr: O'SHA mantiq asos
         chizig'iga qo'llanadi va yolg'on xulosa beradi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} cube
            hi={TWO_EDGES}
            planes={BASE}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.4} cube hi={TWO_EDGES} planes={BASE} />} max={280} /></Col>
        <Col>
          <NumberEntry
            compact
            prompt={S4.work.prompt}
            answer={num(S4.work.answer)}
            okText={S4.work.ok}
            hints={S4.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      /* 1-kadr: parallel juftlik. 2-kadr: AYQASH juftlik -- o'sha chiziq va
         o'sha tekislik, lekin boshqa chiziq tanlangan. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} cube
            hi={SAME_DIR}
            yaw={phase === 0 ? 0.4 : 1.6}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.4}
        stepYaw={0.6}
        scene={<Space step={1} cube hi={SAME_DIR} />}
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
      /* Yoqlar navbat bilan: 1-kadr -- chiziqni O'Z ICHIGA OLGAN yoq,
         2-kadr -- uni KESIB O'TADIGAN yoq. Alomat ikkalasida ham ishlamaydi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} cube
            hi={phase === 0 ? VERTICALS : []}
            planes={BASE}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.4} cube hi={TWO_EDGES} />} max={280} /></Col>
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
      /* Uch hol ketma-ket: kesib o'tuvchi chiziq, keyin yotgan va parallel
         yonma-yon. Farq bitta sonda -- umumiy nuqtalar sonida. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} cube
            hi={VERTICALS}
            planes={BASE}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.4} cube planes={BASE} />} max={280} /></Col>
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
        // Parallel juftlik javob paytida ochiladi: qoida uni tug'dirgan
        // harakat yonida turadi.
        fig={(solved) => (
          <Scene
            fig={<Space step={1} yaw={0.4} cube hi={solved ? SAME_DIR : TWO_EDGES} />}
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
        left={CASE_LEFT}
        right={CASE_RIGHT}
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
      <>
        {/* Yozuv KICHIK yarusda: ustida uchta slot va tugma turadi. */}
        <Expr size="sm" style={{ marginBottom: 2 }}>{S10.expr[0] + '  ∥  ' + S10.expr[1]}</Expr>
        <OrderRow
          prompt={S10.order.prompt}
          items={ORD10}
          answer={['s1', 's2', 's3']}
          okText={S10.order.ok}
          badText={S10.order.bad}
          audio={audio}
          onSolved={solve}
        />
      </>
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
      <NumberEntry
        prompt={S11.task.prompt}
        answer={num(S11.task.answer)}
        okText={S11.task.ok}
        hints={S11.task.hint}
        audio={audio}
        onSolved={() => setTimeout(() => { setTitle(S11.order.title); setStage(1) }, 1400)}
      />
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
          <Scene fig={<Space step={1} yaw={0.4} cube planes={BASE} />} max={260} h={190} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S13.entry.prompt}
            answer={num(S13.entry.answer)}
            okText={S13.entry.ok}
            hints={S13.entry.hint}
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
            fig={<Space step={1} yaw={0.4} cube hi={round >= 2 ? SAME_DIR : TWO_EDGES} />}
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
