// ============================================================================
// 10-sinf, Dars 38. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS38_KONTENT.md
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
const LESSON_NO = 38
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Stereometriya aksiomalari`,
  `Урок ${LESSON_NO}. Аксиомы`,
  `Lesson ${LESSON_NO}. Axioms of stereometry`,
)

const BLOCK = { label: 'B6', from: 38, to: 43, current: 38 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('FAZO', 'ПРОСТРАНСТВО', 'SPACE'),
  title: L('Bitta tekislikmi yoki istalgancha', 'Одна плоскость или сколько угодно', 'One plane or any number'),
  audio: [
    A('mount', "Fazoda tekisliklar cheksiz ko'p. Savol shundaki, tekislik nima bilan yagona qilib beriladi.", 'В пространстве плоскостей бесконечно много. Вопрос в том, чем плоскость задаётся однозначно.', 'In space there are infinitely many planes. The question is what fixes a plane uniquely.'),
    A('r1', 'Birinchi yozuv shunday deydi: uch nuqta oling, ular orqali tekislik roppa-rosa bitta, doim.', 'Первая запись говорит: возьми три точки, и плоскость через них ровно одна, всегда.', 'The first reading says: take three points and there is exactly one plane through them, always.'),
    A('r2', "Ikkinchisi bunday har doim ham bo'lmasligini va tekisliklar cheksiz ko'p bo'ladigan hol borligini aytadi.", 'Вторая говорит, что так бывает не всегда, и есть случай, когда плоскостей бесконечно много.', 'The second says this does not always hold and there is a case with infinitely many planes.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi sahnani burib ko'ramiz.", 'Твой ответ записан. Сейчас повернём сцену и посмотрим.', 'Your answer is saved. Now we will rotate the scene and look.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('istalgan uch nuqta orqali bitta', 'через любые три точки одна', 'one through any three points'),
      value: '1',
    },
    b: {
      name: L('bitta har doim ham emas', 'одна не всегда', 'not always one'),
      value: '∞',
    },
  },
  expr: 'A, B, C   →   α',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Fazodan oldin uch savol', 'Три вопроса перед пространством', 'Three questions before space'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Stereometriya planimetriyadan nimasi bilan farq qiladi?', 'Чем стереометрия отличается от планиметрии?', 'How does stereometry differ from planimetry?'),
      done: 'A ∈ α,   a ⊂ α',
      items: [
        { id: 'a', label: L("fazoviy shakllarni o'rganadi", 'изучает пространственные фигуры', 'it studies spatial figures'), correct: true },
        { id: 'b', label: L("faqat ko'pyoqlarni o'rganadi", 'изучает только многогранники', 'it studies only polyhedra'), hint: L("Ko'pyoqlar fanning bir qismi, butun fani emas.", 'Многогранники это часть предмета, а не весь предмет.', 'Polyhedra are a part of the subject, not the whole of it.') },
        { id: 'c', label: L('bu planimetriyaning boshqa nomi', 'это другое название планиметрии', 'it is another name for planimetry'), hint: L('Planimetriya bitta tekislikda yashaydi, stereometriya butun fazoda.', 'Планиметрия живёт на одной плоскости, стереометрия во всём пространстве.', 'Planimetry lives on one plane, stereometry in the whole of space.') },
        { id: 'd', label: L("unda aksiomalar yo'q", 'в ней нет аксиом', 'it has no axioms'), hint: L('Aksiomalar bor, va ulardan boshlanadi.', 'Аксиомы есть, и с них начинают.', 'There are axioms and they come first.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Asosiy tushunchalar nima?', 'Что такое основные понятия?', 'What are the basic notions?'),
      done: 'A,   a,   α',
      items: [
        { id: 'a', label: L("ta'rif berilmaydiganlari", 'те, которым не дают определения', 'the ones that are not defined'), correct: true },
        { id: 'b', label: L('eng muhim teoremalar', 'самые важные теоремы', 'the most important theorems'), hint: L('Teorema bu tasdiq, tushuncha esa suhbat mavzusi.', 'Теорема это утверждение, а понятие это предмет разговора.', 'A theorem is a statement, a notion is what you speak about.') },
        { id: 'c', label: L("birinchi o'tiladiganlari", 'те, которые проходят первыми', 'the ones taught first'), hint: L("Tartibning bunga aloqasi yo'q, gap ta'rifda.", 'Порядок тут ни при чём, дело в определении.', 'Order is not the point, definition is.') },
        { id: 'd', label: L('isbotlanadiganlari', 'те, которые доказывают', 'the ones that are proved'), hint: L('Tasdiqlar isbotlanadi, tushunchalar emas.', 'Доказывают утверждения, а не понятия.', 'Statements are proved, not notions.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Tekislik qanday belgilanadi?', 'Как обозначают плоскость?', 'How is a plane denoted?'),
      done: 'α,  β,  γ',
      items: [
        { id: 'a', label: L('yunon harfi bilan', 'греческой буквой', 'by a Greek letter'), correct: true },
        { id: 'b', label: L('katta lotin harfi bilan', 'большой латинской', 'by a capital Latin letter'), hint: L('Katta lotin harflari bilan nuqtalar belgilanadi.', 'Большими латинскими обозначают точки.', 'Capital Latin letters denote points.') },
        { id: 'c', label: L('kichik lotin harfi bilan', 'маленькой латинской', 'by a small Latin letter'), hint: L("Kichik lotin harflari bilan to'g'ri chiziqlar belgilanadi.", 'Маленькими латинскими обозначают прямые.', 'Small Latin letters denote lines.') },
        { id: 'd', label: L('raqam bilan', 'цифрой', 'by a digit'), hint: L('Geometriyada raqamlar bilan kattaliklar belgilanadi, shakllar emas.', 'Цифрами в геометрии обозначают величины, а не фигуры.', 'Digits denote magnitudes in geometry, not figures.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Sahnani burib ko'ring", 'Поверни сцену и посмотри', 'Rotate the scene and look'),
  tag: 'tri-tochki-na-pryamoy',
  show: [
    [
      L("uch nuqta bir to'g'ri chiziqda yotmaydi", 'три точки не лежат на одной прямой', 'the three points are not on one line'),
      L("ular orqali tekislik o'tkazilgan", 'через них проведена плоскость', 'a plane is drawn through them'),
      L('sahnani buring va unga qarang', 'поверни сцену и следи за ней', 'rotate the scene and watch it'),
    ],
    [
      L('tekislik joyida qoldi', 'плоскость осталась на месте', 'the plane stayed where it was'),
      L("uning uchun boshqa holat yo'q", 'другого положения для неё нет', 'there is no other position for it'),
      L('demak u yagona', 'значит она единственная', 'so it is unique'),
    ],
  ],
  motion: ['spin'],
  audio: [
    A('mount', 'Fazoda uch nuqta va ular orqali tekislik. Keyin rasm emas, burilish ishlaydi.', 'Три точки в пространстве и плоскость через них. Дальше работает не картинка, а поворот.', 'Three points in space and a plane through them. From here it is the rotation that works, not the picture.'),
    A('spin', "Sahnani olib buring. Nuqtalar siljidi, tekislik ular bilan birga siljidi, lekin nuqtalarga nisbatan u zarracha ham qimirlamadi. Uning uchun boshqa holat yo'q. Uchinchi nuqta birinchi ikkitasi orqali o'tgan to'g'ri chiziqda yotmaydi, va u tekislikni ushlab turadi. Birinchi aksioma aynan shuni aytadi. Undagi so'zga e'tibor bering: nuqtalar bir to'g'ri chiziqda yotmasligi kerak. Shart olib tashlansa, aksioma to'g'ri bo'lmay qoladi, va buni keyingi ekranda ko'ramiz.", 'Возьми сцену и поверни её. Точки поехали, плоскость поехала вместе с ними, но относительно точек она не сдвинулась ни на сколько. Другого положения у неё нет. Третья точка не лежит на прямой через первые две, и она держит плоскость. Именно это говорит первая аксиома. Обрати внимание на слово в ней: точки не должны лежать на одной прямой. Если условие убрать, аксиома перестанет быть верной, и на следующем экране мы это увидим.', 'Take the scene and rotate it. The points moved, the plane moved with them, but relative to the points it did not shift at all. It has no other position. The third point does not lie on the line through the first two, and it holds the plane. That is exactly what the first axiom says. Notice the words in it: the points must not lie on one line. Remove that condition and the axiom stops being true, and we will see that on the next screen.'),
    A('work', "O'zingiz hisoblang. Bu uch nuqta orqali nechta tekislik o'tadi?", 'Посчитай сам. Сколько плоскостей проходит через эти три точки?', 'Work it out yourself. How many planes pass through these three points?'),
  ],
  work: {
    prompt: L("Ular orqali nechta tekislik o'tadi?", 'Сколько плоскостей проходит через них?', 'How many planes pass through them?'),
    ok: L('Bitta. Sahnani qancha burmang, boshqa holat topilmaydi.', 'Одна. Сколько сцену ни крути, другого положения не находится.', 'One. However much you rotate the scene, no other position turns up.'),
    hint: [
      L("Sahnani buring va tekislik holati o'zgaradimi, qarang.", 'Поверни сцену и посмотри, меняется ли положение плоскости.', 'Rotate the scene and see whether the plane changes position.'),
      L("Uchinchi nuqta to'g'ri chiziqda emas, va u tekislikni ushlab turadi.", 'Третья точка не на прямой, и она держит плоскость.', 'The third point is off the line and it holds the plane.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Nuqtalar bir to'g'ri chiziqqa surildi", 'Точки сдвинули на одну прямую', 'The points were moved onto one line'),
  tag: 'tri-tochki-na-pryamoy',
  show: [
    [
      L("endi uchalasi ham bir to'g'ri chiziqda", 'теперь все три на одной прямой', 'now all three are on one line'),
      L("tekislik ular orqali baribir o'tadi", 'плоскость через них по-прежнему проходит', 'a plane still passes through them'),
      L('lekin u endi yagona emas', 'но она больше не одна', 'but it is no longer alone'),
    ],
    [
      L("tekislik to'g'ri chiziq atrofida aylanadi", 'плоскость крутится вокруг прямой', 'the plane spins around the line'),
      L('uning har bir holati yaraydi', 'каждое её положение годится', 'every position of it works'),
      L('birortasi ajratilmagan', 'ни одно не выделено', 'none of them is singled out'),
    ],
  ],
  motion: ['turn'],
  audio: [
    A('mount', "O'sha uch nuqta, va ularning hammasi bir to'g'ri chiziqda.", 'Те же три точки, и все они на одной прямой.', 'The same three points, and all of them on one line.'),
    A('turn', "Tekislikka nima bo'lganiga qarang. U avvalgidek uchala nuqta orqali o'tadi, lekin endi uni to'g'ri chiziq atrofida burish mumkin, va u baribir ular orqali o'tadi. Bir holat, ikkinchi, uchinchi, hammasi yaraydi. Bunday uch nuqta orqali tekisliklar cheksiz ko'p, va birortasi qolganidan yaxshi emas. Aksiomada to'g'ri chiziq haqidagi shart shuning uchun turadi. Usiz tasdiq noto'g'ri, va bunga biz mulohaza bilan emas, burilish bilan ishonch hosil qildik.", 'Смотри, что стало с плоскостью. Она проходит через все три точки, как и раньше, но теперь её можно крутить вокруг прямой, и она всё равно будет проходить через них. Одно положение, второе, третье, годятся все. Плоскостей через три такие точки бесконечно много, и ни одна не лучше остальных. Вот почему в аксиоме стоит условие про прямую. Без него утверждение неверно, и убедились мы в этом не рассуждением, а поворотом.', 'Look at what happened to the plane. It passes through all three points as before, but now it can be spun around the line and it will still pass through them. One position, a second, a third, all of them work. There are infinitely many planes through three such points, and none is better than the others. That is why the axiom carries the condition about the line. Without it the statement is false, and we became sure of that not by reasoning but by rotating.'),
    A('work', 'Sahnani buring va javob bering: bunday tekisliklar nechta?', 'Поверни сцену и ответь: сколько таких плоскостей?', 'Rotate the scene and answer: how many such planes are there?'),
  ],
  pick: {
    prompt: L("Bir to'g'ri chiziqdagi uch nuqta orqali nechta tekislik o'tadi?", 'Сколько плоскостей проходит через три точки одной прямой?', 'How many planes pass through three points of one line?'),
    a: {
      label: L('roppa-rosa bitta', 'ровно одна', 'exactly one'),
      hint: L('Siz uni hozirgina burib, boshqa holatlarni topdingiz.', 'Ты только что покрутил её и нашёл другие положения.', 'You have just rotated it and found other positions.'),
    },
    b: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'),
    c: {
      label: L("bitta ham yo'q", 'ни одной', 'none'),
      hint: L("Hech bo'lmaganda bittasi bor: siz uni ekranda ko'rib turibsiz.", 'Хотя бы одна есть: ты её видишь на экране.', 'At least one exists: you can see it on the screen.'),
    },
    ok: L("Cheksiz ko'p. Bir to'g'ri chiziqdagi uch nuqta tekislikni belgilamaydi.", 'Бесконечно много. Три точки на одной прямой плоскость не задают.', 'Infinitely many. Three points on one line do not fix a plane.'),
  },
  mark: 'A, B, C ∈ a   →   α ⊃ a',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ikki nuqta butun to'g'ri chiziqni ergashtiradi", 'Две точки тянут за собой всю прямую', 'Two points drag the whole line along'),
  tag: 'kartinka-kak-dokazatelstvo',
  show: [
    [
      L("to'g'ri chiziqning ikki nuqtasi tekislikda yotadi", 'две точки прямой лежат в плоскости', 'two points of the line lie in the plane'),
      L('qolganlari haqida hozircha hech nima aytilmagan', 'про остальные пока ничего не сказано', 'nothing is said about the rest yet'),
      L("buring va to'g'ri chiziqqa qarang", 'поверни и посмотри на прямую', 'rotate and look at the line'),
    ],
    [
      L("to'g'ri chiziq butunlay tekislikda yotadi", 'прямая целиком лежит в плоскости', 'the whole line lies in the plane'),
      L('u undan birorta nuqtada ham chiqmaydi', 'она не выходит из неё ни в одной точке', 'it does not leave it at any point'),
      L('bu ikkinchi aksioma', 'это вторая аксиома', 'this is the second axiom'),
    ],
  ],
  motion: ['lie'],
  audio: [
    A('mount', 'Ikkinchi aksioma. U qisqa, lekin butun kurs davomida ishlaydi.', 'Вторая аксиома. Она короткая, а работать будет весь курс.', 'The second axiom. It is short, and it will work for the whole course.'),
    A('lie', "To'g'ri chiziqni olamiz va unda tekislikda yotgan ikki nuqtani belgilaymiz. Bu to'g'ri chiziq haqida boshqa hech nima ma'lum emas. U tekislikni teshib chetga ketishi mumkindek tuyuladi, lekin yo'q. Aksioma shunday deydi: agar to'g'ri chiziqning ikki nuqtasi tekislikda yotsa, uning barcha nuqtalari shu tekislikda yotadi. Sahnani buring va to'g'ri chiziq tekislikdan hech qayerda chiqmasligiga ishonch hosil qiling. Aytgancha, bundan tanish usul kelib chiqadi: to'g'ri chiziq tekislikda yotganini tekshirish uchun ikki nuqta yetadi. Butun to'g'ri chiziq emas, ikki nuqta.", 'Возьмём прямую и отметим на ней две точки, которые лежат в плоскости. Больше про эту прямую ничего не известно. Кажется, что она могла бы проткнуть плоскость и уйти в сторону, но нет. Аксиома говорит: если две точки прямой лежат в плоскости, то все её точки лежат в этой плоскости. Поверни сцену и убедись, что прямая не выходит из плоскости нигде. Отсюда, кстати, следует привычный приём: чтобы проверить, лежит ли прямая в плоскости, хватит двух точек. Не всей прямой, а двух точек.', 'Take a line and mark two of its points that lie in the plane. Nothing else is known about this line. It seems it could pierce the plane and go off to the side, but no. The axiom says: if two points of a line lie in a plane, then all its points lie in that plane. Rotate the scene and see that the line does not leave the plane anywhere. From this, by the way, follows the familiar move: to check whether a line lies in a plane, two points are enough. Not the whole line, two points.'),
    A('work', "O'zingiz hisoblang. To'g'ri chiziqning nechta nuqtasini tekshirish kerak?", 'Посчитай сам. Сколько точек прямой надо проверить?', 'Work it out yourself. How many points of the line must be checked?'),
  ],
  work: {
    prompt: L("To'g'ri chiziqning nechta nuqtasini tekshirish kerak?", 'Сколько точек прямой надо проверить?', 'How many points of the line must be checked?'),
    ok: L("Ikkita. Qolganlari ikkinchi aksioma bo'yicha o'zi keladi.", 'Две. Остальные придут сами по второй аксиоме.', 'Two. The rest follow by the second axiom.'),
    hint: [
      L("Ikkinchi aksiomani yana bir bor o'qing.", 'Прочитай вторую аксиому ещё раз.', 'Read the second axiom once more.'),
      L('Unda ikki nuqta haqida aytilgan.', 'В ней сказано про две точки.', 'It speaks about two points.'),
      L('Ikki.', 'Две.', 'Two.'),
    ],
    expr: 'A, B ∈ α,  A, B ∈ a   →   a ⊂ α',
    answer: '2',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Umumiy nuqtali ikki tekislik', 'Две плоскости с общей точкой', 'Two planes with a common point'),
  tag: 'kartinka-kak-dokazatelstvo',
  show: [
    [
      L('ikki tekislik, ularning umumiy nuqtasi bor', 'две плоскости, у них есть общая точка', 'two planes with a common point'),
      L('ish bitta nuqta bilan tugamaydi', 'одной точкой дело не кончается', 'one point is not the end of it'),
      L('sahnani buring va qarang', 'поверни сцену и посмотри', 'rotate the scene and look'),
    ],
    [
      L("ularning umumiy to'g'ri chizig'i bor", 'у них есть общая прямая', 'they have a common line'),
      L("u shu nuqtadan o'tadi", 'она проходит через эту точку', 'it passes through that point'),
      L("va bunday to'g'ri chiziq bitta", 'и такая прямая одна', 'and there is one such line'),
    ],
  ],
  motion: ['cut'],
  audio: [
    A('mount', "Uchinchi aksioma. Bu yerda o'zingiz hisoblashingizga to'g'ri keladi.", 'Третья аксиома. Здесь считать придётся самому.', 'The third axiom. Here you will have to count for yourself.'),
    A('cut', "Ikki tekislikning umumiy nuqtasi bor. Aksioma shuni tasdiqlaydiki, u holda ularning shu nuqtadan o'tuvchi umumiy to'g'ri chizig'i ham bor. Ya'ni bir-biriga roppa-rosa bitta nuqtada tegadigan ikki tekislik fazoda bo'lmaydi: yo ularning umumiy nuqtasi umuman yo'q, yo butun bir to'g'ri chiziq bor. Sahnani buring va shu to'g'ri chiziqni toping. U bir tekislik ikkinchisiga kiradigan chiziq ko'rinishida ko'rinadi. Kesishuvchi ikki tekislikning bunday umumiy to'g'ri chizig'i nechta ekanini sanang.", 'Две плоскости имеют общую точку. Аксиома утверждает, что тогда у них есть и общая прямая, проходящая через эту точку. То есть двух плоскостей, которые касались бы друг друга ровно в одной точке, в пространстве не бывает: либо у них нет общих точек вовсе, либо есть целая прямая. Поверни сцену и найди эту прямую. Она видна как линия, по которой одна плоскость входит в другую. Посчитай, сколько таких общих прямых у двух пересекающихся плоскостей.', 'Two planes have a common point. The axiom claims that then they also have a common line through that point. That is, two planes that touch each other at exactly one point do not exist in space: either they have no common points at all, or they have a whole line. Rotate the scene and find that line. It shows as the line along which one plane enters the other. Count how many such common lines two intersecting planes have.'),
    A('work', "O'zingiz hisoblang. Kesishuvchi ikki tekislikning nechta umumiy to'g'ri chizig'i bor?", 'Посчитай сам. Сколько общих прямых у двух пересекающихся плоскостей?', 'Work it out yourself. How many common lines do two intersecting planes have?'),
  ],
  work: {
    prompt: L("Ularning nechta umumiy to'g'ri chizig'i bor?", 'Сколько у них общих прямых?', 'How many common lines do they have?'),
    ok: L("Bitta. Ikki tekislik bitta to'g'ri chiziq bo'ylab kesishadi, bitta nuqta bo'yicha esa hech qachon kesishmaydi.", 'Одна. Две плоскости пересекаются по одной прямой, и по одной точке не пересекаются никогда.', 'One. Two planes meet along one line, and never at a single point.'),
    hint: [
      L('Sahnani buring va ular bir-biriga kiradigan chiziqni toping.', 'Поверни сцену и найди линию, по которой они входят друг в друга.', 'Rotate the scene and find the line along which they enter each other.'),
      L("Bunday to'g'ri chiziq ikkita bo'lganda, tekisliklar ustma-ust tushardi.", 'Если бы таких прямых было две, плоскости совпали бы.', 'If there were two such lines, the planes would coincide.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    expr: 'α ∩ β = a',
    answer: '1',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARAVIY HOL', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("O'lchadi — hali isbotlamadi", 'Измерил — ещё не доказал', 'Measured is not proved'),
  tag: 'izmeril-znachit-dokazal',
  show: [
    [
      L("chizmada ikki kesma teng ko'rinadi", 'на чертеже два отрезка кажутся равными', 'on the drawing two segments look equal'),
      L("chizg'ich bir xil sonni ko'rsatadi", 'линейка показывает одно и то же число', 'the ruler shows the same number'),
      L("bu o'lchash natijasi", 'это результат измерения', 'this is the result of a measurement'),
    ],
    [
      L('sahnani buring', 'поверни сцену', 'rotate the scene'),
      L('sonlar farq qildi', 'числа разошлись', 'the numbers came apart'),
      L("demak uzunlikni emas, proyeksiyani o'lchadik", 'значит мерили не длину, а проекцию', 'so it was the projection that was measured, not the length'),
    ],
  ],
  motion: ['rule'],
  audio: [
    A('mount', "Yettinchi sinfdagi bir usul bu yerga ko'chadi va qattiqroq bo'ladi.", 'Один приём из седьмого класса переносится сюда и становится строже.', 'One move from grade seven carries over here and gets stricter.'),
    A('rule', "Planimetriyada biz allaqachon kelishgan edik: chizg'ich bilan o'lchash natijasi taxmin so'zi bilan imzolanadi va isbotga olinmaydi. Fazoda bu qoida qattiqroq bo'ladi. Yassi chizmada biz kesmaning o'zini emas, uning proyeksiyasini ko'ramiz, proyeksiya esa uzunlikni ham, burchakni ham buzadi. Sahnani buring: teng ko'ringan ikki kesma ajralib ketdi. Bu o'lchovlarning birortasi hech nimani isbotlamaydi, ikkalasi ham faqat diqqat bilan qarashga sabab. Isbot aksiomalar va allaqachon isbotlangan tasdiqlar bo'yicha qilinadi, rasm bo'yicha emas.", 'В планиметрии мы уже договаривались: результат измерения линейкой подписывается словом предположение и в доказательство не берётся. В пространстве это правило становится жёстче. На плоском чертеже мы видим не сам отрезок, а его проекцию, а проекция искажает и длины, и углы. Поверни сцену: два отрезка, которые казались равными, разъехались. Ни один из этих замеров ничего не доказывает, оба они только повод присмотреться. Доказывают по аксиомам и по уже доказанным утверждениям, а не по картинке.', 'In planimetry we already agreed: the result of measuring with a ruler is labelled a guess and is not taken into a proof. In space this rule gets harder. On a flat drawing we do not see the segment itself but its projection, and a projection distorts both lengths and angles. Rotate the scene: two segments that looked equal have come apart. Neither of these measurements proves anything, both are only a reason to look closer. Proofs go by axioms and by statements already proved, not by the picture.'),
    A('work', "O'zingiz hisoblang. Ikki o'lchovdan nechtasi isbotga yaraydi?", 'Посчитай сам. Сколько из двух замеров годится в доказательство?', 'Work it out yourself. How many of the two measurements can go into a proof?'),
  ],
  work: {
    prompt: L("Nechta o'lchov isbotga yaraydi?", 'Сколько замеров годится в доказательство?', 'How many measurements can go into a proof?'),
    ok: L("Bitta ham yo'q. Proyeksiya bo'yicha o'lchash hech nimani isbotlamaydi.", 'Ни одного. Измерение по проекции не доказывает ничего.', 'None. A measurement taken from a projection proves nothing.'),
    hint: [
      L("Yettinchi sinfda chizg'ich natijasi nima bilan imzolanganini eslang.", 'Вспомни, чем подписывался результат линейки в седьмом классе.', 'Recall how a ruler result was labelled in grade seven.'),
      L("Chizmada proyeksiya ko'rinadi, kesmaning o'zi emas.", 'На чертеже видна проекция, а не сам отрезок.', 'The drawing shows the projection, not the segment itself.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Uch aksioma', 'Три аксиомы', 'Three axioms'),
  tag: 'tri-tochki-na-pryamoy',
  motion: ['rule'],
  audio: [
    A('mount', "Qoidani yig'amiz. Aksioma uchta, uchalasini ham harakatda ko'rdik.", 'Соберём правило. Аксиом три, и все три мы уже видели в движении.', 'Let us put the rule together. There are three axioms and we have seen all three in motion.'),
    A('rule', "Birinchi: agar uch nuqta bir to'g'ri chiziqda yotmasa, ular orqali yagona tekislik o'tkazish mumkin. To'g'ri chiziq haqidagi so'zlar bu yerda asosiy, ularsiz tasdiq noto'g'ri. Ikkinchi: agar to'g'ri chiziqning ikki nuqtasi tekislikda yotsa, uning barcha nuqtalari shu tekislikda yotadi. Bundan tekshirish qoidasi: ikki nuqta yetadi. Uchinchi: agar ikki tekislikning umumiy nuqtasi bo'lsa, undan o'tuvchi umumiy to'g'ri chiziq ham bor. Demak tekisliklar bitta nuqta bo'yicha hech qachon kesishmaydi. Planimetriya aksiomalari bilan birga bu uchtasi stereometriyaning asosini tashkil qiladi, va keyin hammasi ulardan isbotlanadi.", 'Первая: если три точки не лежат на одной прямой, через них можно провести единственную плоскость. Слова про прямую здесь главные, без них утверждение неверно. Вторая: если две точки прямой лежат в плоскости, то все её точки лежат в этой плоскости. Отсюда правило проверки: хватает двух точек. Третья: если у двух плоскостей есть общая точка, то есть и общая прямая, проходящая через неё. Значит по одной точке плоскости не пересекаются никогда. Вместе с аксиомами планиметрии эти три составляют основу стереометрии, и дальше всё доказывается из них.', 'First: if three points do not lie on one line, a unique plane can be drawn through them. The words about the line are the main part here, without them the statement is false. Second: if two points of a line lie in a plane, then all its points lie in that plane. Hence the checking rule: two points are enough. Third: if two planes have a common point, they also have a common line through it. So planes never meet at a single point. Together with the axioms of planimetry these three form the basis of stereometry, and everything further is proved from them.'),
  ],
  probe: {
    question: L("Birinchi aksiomadagi qaysi shartni tashlab bo'lmaydi?", 'Какое условие в первой аксиоме отбрасывать нельзя?', 'Which condition in the first axiom cannot be dropped?'),
    items: [
      { id: 'a', label: L("nuqtalar bir to'g'ri chiziqda yotmaydi", 'точки не лежат на одной прямой', 'the points do not lie on one line'), correct: true },
      { id: 'b', label: L('nuqtalar roppa-rosa uchta', 'точек ровно три', 'there are exactly three points'), hint: L('Ular uchta ham. Gap sonda emas, joylashuvida.', 'Три их и есть. Дело не в числе, а в том, как они расположены.', 'There are three of them indeed. The point is not their number but their arrangement.') },
    ],
  },
  rule: {
    lawLabel: L('UCH AKSIOMA', 'ТРИ АКСИОМЫ', 'THE THREE AXIOMS'),
    lines: [
      L("bir to'g'ri chiziqda yotmagan uch nuqta orqali yagona tekislik o'tadi", 'через три точки не на одной прямой проходит единственная плоскость', 'through three points not on one line passes a unique plane'),
      L("to'g'ri chiziqning ikki nuqtasi tekislikda bo'lsa, butun chiziq unda", 'если две точки прямой в плоскости, то вся прямая в ней', 'if two points of a line are in a plane, the whole line is in it'),
      L("ikki tekislikning umumiy nuqtasi bo'lsa, umumiy to'g'ri chizig'i ham bor", 'если у двух плоскостей есть общая точка, есть и общая прямая', 'if two planes share a point, they share a line'),
    ],
    law: 'S₁: A, B, C ∉ a   →   α',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  title: L('Shartni tekisliklar soni bilan ulang', 'Соедини условие с числом плоскостей', 'Match each condition with the number of planes'),
  tag: 'tri-tochki-na-pryamoy',
  audio: [
    A('mount', "To'rt yozuv va to'rt javob. Chizmasdan hisoblang. Oxirgi yozuv bu kub: uning yoqlari tekisliklarini sanang.", 'Четыре записи и четыре ответа. Считай, не рисуя. Последняя запись это куб: считай плоскости его граней.', 'Four writings and four answers. Count without drawing. The last writing is a cube: count the planes of its faces.'),
  ],
  match: {
    prompt: L('Yozuvga nechta har xil tekislik mos keladi', 'Сколько разных плоскостей отвечает записи', 'How many distinct planes each writing gives'),
    ok: L("To'g'ri. To'rt nuqtadan uchlik to'rt xil tanlanadi, kubning yoqlari esa olti tekislikda yotadi.", 'Верно. Из четырёх точек тройку выбирают четырьмя способами, а грани куба лежат в шести плоскостях.', 'Correct. A triple is chosen from four points in four ways, and the faces of a cube lie in six planes.'),
    left: ['A, B, C ∉ a', 'A, B, C ∈ a', 'A, B, C, D', 'ABCDA₁B₁C₁D₁'],
    a: '1',
    b: '∞',
    c: '4',
    d: '6',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Natijani isbotlang', 'Докажи следствие', 'Prove the corollary'),
  tag: 'kartinka-kak-dokazatelstvo',
  audio: [
    A('mount', "Endi aksiomalardan chiqadigan natijani isbotlaymiz. Har qatorning asoslashi ro'yxatdan tanlanadi.", 'Теперь докажем следствие из аксиом. Обоснование каждой строки выбирается из списка.', 'Now let us prove a corollary of the axioms. The justification of each line is chosen from the list.'),
  ],
  proof: {
    given: L("to'g'ri chiziq va undan tashqaridagi nuqta", 'прямая и точка вне её', 'a line and a point outside it'),
    goal: L("ular orqali roppa-rosa bitta tekislik o'tadi", 'через них проходит ровно одна плоскость', 'exactly one plane passes through them'),
    r1: L("to'g'ri chiziqda ikki nuqta olamiz", 'берём на прямой две точки', 'take two points on the line'),
    r2: L("uch nuqta bir chiziqda emas, tekislik o'tkazamiz", 'три точки не на одной прямой, проводим плоскость', 'three points not on one line, draw the plane'),
    r3: L('chiziqning ikki nuqtasi tekislikda, demak butun chiziq unda', 'две точки прямой в плоскости, значит вся прямая в ней', 'two points of the line are in the plane, so the whole line is'),
    e1: L(
      "Aksioma bu yerda hali ishlamaydi. Bu qadamni o'zimiz qilamiz.",
      'Аксиома тут ещё не работает. Этот шаг мы делаем сами.',
      'No axiom works here yet. We make this step ourselves.',
    ),
    e2: L(
      "Tekislik hali yo'q. Uni olish kerak.",
      'Плоскости пока нет. Её ещё надо получить.',
      'There is no plane yet. It still has to be obtained.',
    ),
    e3: L(
      "Tekislik bor. Gap unga tushadigan to'g'ri chiziq haqida.",
      'Плоскость уже есть. Речь о том, что в неё попадает целая прямая.',
      'The plane is there. This is about the line that falls into it.',
    ),
    ok: L("Isbotlandi. Ikkala aksioma ham kerak bo'ldi: birinchisi tekislik berdi, ikkinchisi unga chiziqni tortdi.", 'Доказано. Обе аксиомы понадобились: первая дала плоскость, вторая втянула в неё прямую.', 'Proved. Both axioms were needed: the first gave the plane, the second pulled the line into it.'),
  },
  reason: {
    s1: L('birinchi aksioma', 'первая аксиома', 'the first axiom'),
    s2: L('ikkinchi aksioma', 'вторая аксиома', 'the second axiom'),
    s3: L("yasashga ko'ra", 'по построению', 'by construction'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas: u ko'p holatdan bittasini ko'rsatadi.", 'Чертёж не обоснование: он показывает одно положение из многих.', 'A drawing is not a justification: it shows one position out of many.'),
    },
    measure: {
      label: L("chizg'ich bilan o'lchangan", 'измерено линейкой', 'measured with a ruler'),
      missing: L("O'lchash taxmin, dalil emas.", 'Измерение это предположение, а не довод.', 'A measurement is a guess, not an argument.'),
    },
  },
  expr: 'a, C ∉ a   →   α',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L("To'rt nuqta, hech qaysi uchtasi bir chiziqda emas", 'Четыре точки, никакие три не на прямой', 'Four points, no three on one line'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring.", 'Прибора нет. Считай на бумаге, потом сверься.', 'No instrument here. Work it out on paper, then compare.'),
    A('next', "Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping.", 'Дальше запись с ошибкой. Найди строку, где она появилась.', 'Next comes a written solution with a mistake. Find the line where it appeared.'),
  ],
  task: {
    ok: L("To'rtta. Har uchlik o'z tekisligini belgilaydi, to'rt nuqtadan uchliklar esa to'rtta.", 'Четыре. Каждая тройка задаёт свою плоскость, а троек из четырёх точек четыре.', 'Four. Each triple fixes its own plane, and there are four triples of four points.'),
    hint: [
      L('Nuqtalarni emas, uchliklarni sanang.', 'Считай тройки точек, а не сами точки.', 'Count the triples of points, not the points.'),
      L("To'rt nuqtadan uchlikni to'rt xil tanlash mumkin.", 'Из четырёх точек тройку можно выбрать четырьмя способами.', 'A triple can be chosen from four points in four ways.'),
      L("To'rt.", 'Четыре.', 'Four.'),
    ],
    prompt: 'A, B, C, D   →   ?',
    answer: '4',
  },
  order: {
    prompt: L("Shartlarni tekisliklar soni o'sishi bo'yicha joylashtiring", 'Расставь условия по возрастанию числа плоскостей', 'Put the conditions in order of increasing number of planes'),
    title: L('kichik sondan kattasiga', 'от меньшего числа к большему', 'from fewer planes to more'),
    ok: L("To'g'ri. Chiziqda yotmagan uch nuqta bitta tekislik beradi, to'rt nuqta to'rtta, kub oltita, chiziqdagi uch nuqta esa cheksiz ko'p.", 'Верно. Три точки не на прямой дают одну плоскость, четыре точки четыре, куб шесть, а три точки на прямой бесконечно много.', 'Correct. Three points off a line give one plane, four points give four, a cube six, and three points on a line infinitely many.'),
    bad: L("Nuqtalar nechtaligiga emas, joylashuvi haqida nima ma'lumligiga qarang.", 'Смотри, что известно о расположении точек, а не сколько их.', 'Look at what is known about the arrangement, not at how many points there are.'),
    items: ['A, B, C ∈ a', 'A, B, C ∉ a', 'ABCDA₁B₁C₁D₁', 'A, B, C, D'],
    answer: 'A, B, C ∉ a  A, B, C, D  ABCDA₁B₁C₁D₁  A, B, C ∈ a',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xatoli qatorni toping', 'Найди строку с ошибкой', 'Find the line with the mistake'),
  tag: 'check',
  audio: [
    A('mount', "To'rt qator. Xato hisobda emas: bir qator rasmga tayanadi.", 'Четыре строки. Ошибка не в счёте: одна строка опирается на рисунок.', 'Four lines. The mistake is not in the counting: one line leans on the picture.'),
    A('next', 'Keyin teskari masala: tekisliklar soniga qarab shartni tiklang.', 'Дальше обратная задача: по числу плоскостей восстанови условие.', 'Next comes the reverse task: rebuild the condition from the number of planes.'),
  ],
  hint: {
    r1: L("Shart to'g'ri ko'chirilgan.", 'Условие переписано верно.', 'The condition is copied correctly.'),
    r2: L('Bunday tekislik haqiqatan ham bor.', 'Такая плоскость и правда есть.', 'Such a plane does exist.'),
    r3: L("O'zingizdan so'rang: bu qayerdan olingan, aksiomadanmi yoki rasmdanmi?", 'Спроси себя, откуда это взято: из аксиомы или с рисунка.', 'Ask yourself where this comes from: an axiom or the picture.'),
  },
  proof: L("Sahnani buring: tekislikda ko'ringan nuqta uning ustida chiqdi.", 'Поверни сцену: точка, которая казалась на плоскости, оказалась над ней.', 'Rotate the scene: the point that seemed to be on the plane turned out to be above it.'),
  entry: {
    prompt: L("To'g'ri chiziqning nechta nuqtasini tekshirish kerak edi?", 'Сколько точек прямой надо было проверить?', 'How many points of the line had to be checked?'),
    ok: L("Ikkita. Ikkinchi aksioma uchun bitta nuqta kam, rasm esa ikkinchi nuqta o'rniga yaramaydi.", 'Две. Одной точки для второй аксиомы мало, а картинка вместо второй точки не годится.', 'Two. One point is not enough for the second axiom, and a picture is no substitute for the second one.'),
    hint: [
      L("Ikkinchi aksiomani qayta o'qing.", 'Перечитай вторую аксиому.', 'Read the second axiom again.'),
      L('Unda ikki nuqta haqida aytilgan, yozuvda esa bittasi olingan.', 'В ней сказано про две точки, а в записи взята одна.', 'It speaks of two points, and the writing takes one.'),
      L('Ikki.', 'Две.', 'Two.'),
    ],
    answer: '2',
  },
  row: {
    r1: 'a,  B ∉ a',
    r2: 'α ⊃ a,  B ∈ α',
    r3: 'C ∈ a,  C ∈ α',
    r4: 'a ⊂ α',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Teskari yo'l", 'Обратный ход', 'The other direction'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskarisiga. Tekisliklar soniga qarab nuqtalar qanday joylashganini ayting.', 'Теперь наоборот. По числу плоскостей назови, как расположены точки.', 'Now the other way round. From the number of planes, say how the points are arranged.'),
    A('work', 'Keyin tekislikni yagona qilib beradigan barcha yozuvlarni belgilang.', 'Потом отметь все записи, которые задают плоскость однозначно.', 'Then mark every writing that fixes a plane uniquely.'),
  ],
  multi: {
    prompt: L('Tekislikni yagona qilib beradigan barcha yozuvlarni belgilang', 'Отметь все записи, которые задают плоскость однозначно', 'Mark every writing that fixes a plane uniquely'),
    title: L('ular aynan ikkita', 'их ровно два', 'there are exactly two'),
    ok: L("To'g'ri. Chiziqdan tashqaridagi nuqta kerak: tekislikni u ushlab turadi.", 'Верно. Нужна точка вне прямой: она и держит плоскость.', 'Correct. A point off the line is needed: it is what holds the plane.'),
    items: [
      { id: 'c', label: 'A, B', hint: L("Ikki nuqta to'g'ri chiziqni beradi, u orqali tekisliklar esa cheksiz ko'p.", 'Две точки задают прямую, а плоскостей через неё бесконечно много.', 'Two points fix a line, and there are infinitely many planes through it.') },
      { id: 'd', label: 'A, B, C ∈ a', hint: L("Bir chiziqdagi uch nuqta bitta to'g'ri chiziqdek ish tutadi.", 'Три точки на одной прямой ведут себя как одна прямая.', 'Three points on one line behave like a single line.') },
      { id: 'a', label: 'A, B, C ∉ a', ok: true },
      { id: 'b', label: 'a, C ∉ a', ok: true },
    ],
  },
  entry: {
    prompt: L("Nuqta uchta, ular orqali tekislik bitta. Ulardan nechtasi bir to'g'ri chiziqda yotadi?", 'Точек три, плоскость через них одна. Сколько из них лежит на одной прямой?', 'Three points, one plane through them. How many of them lie on one line?'),
    ok: L("Ikkita. Uchtasi bir chiziqda bo'lsa, cheksiz ko'p tekislik chiqardi.", 'Две. Три на одной прямой дали бы бесконечно много плоскостей.', 'Two. Three on one line would give infinitely many planes.'),
    hint: [
      L("Uchalasi ham chiziqda yotganda, tekislik yagona bo'lmasdi.", 'Если бы все три лежали на прямой, плоскость была бы не одна.', 'If all three were on a line, the plane would not be unique.'),
      L("Istalgan ikki nuqta orqali to'g'ri chiziq doim o'tadi.", 'Через любые две точки прямая проходит всегда.', 'A line always passes through any two points.'),
      L('Ikki.', 'Две.', 'Two.'),
    ],
    expr: 'A, B, C   →   α',
    answer: '2',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'tri-tochki-na-pryamoy',
  audio: [
    A('mount', "Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi.", 'Четыре вопроса подряд. Считается первая попытка.', 'Four questions in a row. The first attempt counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Bir to'g'ri chiziqdagi uch nuqta orqali nechta tekislik o'tadi?", 'Сколько плоскостей проходит через три точки одной прямой?', 'How many planes pass through three points of one line?'),
      done: 'A, B, C ∈ a',
      items: [
        { id: 'a', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L("Bitta uchinchi nuqta chiziqdan chiqqanda bo'ladi.", 'Одна выходит, когда третья точка сходит с прямой.', 'One comes when the third point leaves the line.') },
        { id: 'c', label: L("bitta ham yo'q", 'ни одной', 'none'), hint: L("Hech bo'lmaganda bittasi doim bor.", 'Хотя бы одна есть всегда.', 'At least one always exists.') },
        { id: 'd', label: L('uchta', 'три', 'three'), hint: L("Tekisliklar soni nuqtalar soniga to'g'ridan bog'liq emas.", 'Число плоскостей не связано с числом точек напрямую.', 'The number of planes is not tied to the number of points directly.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("To'g'ri chiziqning ikki nuqtasi tekislikda yotadi. Qolganlari qayerda?", 'Две точки прямой лежат в плоскости. Где остальные?', 'Two points of a line lie in a plane. Where are the rest?'),
      done: 'a ⊂ α',
      items: [
        { id: 'a', label: L('ular ham shu tekislikda', 'тоже в этой плоскости', 'in that plane too'), correct: true },
        { id: 'b', label: L('bir qismi unda, bir qismi tashqarida', 'часть в ней, часть вне', 'some in it, some outside'), hint: L("U holda chiziq siniq bo'lardi, u esa to'g'ri.", 'Тогда прямая ломалась бы, а она прямая.', 'Then the line would bend, and it is straight.') },
        { id: 'c', label: L("buni bilib bo'lmaydi", 'этого узнать нельзя', 'it cannot be known'), hint: L('Ikkinchi aksioma bu savolga aniq javob beradi.', 'Вторая аксиома отвечает на этот вопрос точно.', 'The second axiom answers this exactly.') },
        { id: 'd', label: L('tekislikdan tashqarida', 'вне плоскости', 'outside the plane'), hint: L("U holda belgilangan ikki nuqta alohida bo'lib qolardi.", 'Тогда две отмеченные точки оказались бы особенными.', 'Then the two marked points would be special.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Kesishuvchi ikki tekislikning nechta umumiy to'g'ri chizig'i bor?", 'Сколько общих прямых у двух пересекающихся плоскостей?', 'How many common lines do two intersecting planes have?'),
      done: 'α ∩ β = a',
      items: [
        { id: 'a', label: L('bitta', 'одна', 'one'), correct: true, ok: L("Bitta. Tekisliklar bitta nuqta bo'yicha hech qachon kesishmaydi.", 'Одна. По одной точке плоскости не пересекаются никогда.', 'One. Planes never meet at a single point.') },
        { id: 'b', label: L("bitta ham yo'q", 'ни одной', 'none'), hint: L("Kesishmaydigan tekisliklarda bitta ham yo'q.", 'Ни одной у плоскостей, которые не пересекаются вовсе.', 'None belongs to planes that do not meet at all.') },
        { id: 'c', label: L('ikkita', 'две', 'two'), hint: L('Ikki umumiy chiziq tekisliklar ustma-ust tushganini bildirardi.', 'Две общие прямые означали бы, что плоскости совпали.', 'Two common lines would mean the planes coincide.') },
        { id: 'd', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p ustma-ust tushgan tekisliklarda bo'lardi.", 'Бесконечно много было бы у совпавших плоскостей.', 'Infinitely many would belong to coinciding planes.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Isbotga nimani olib bo'lmaydi?", 'Что нельзя брать в доказательство?', 'What must not go into a proof?'),
      done: 'S₁,  S₂,  S₃',
      items: [
        { id: 'a', label: L("chizmada ko'ringanini", 'то, что видно на чертеже', 'what is visible on the drawing'), correct: true },
        { id: 'b', label: L('aksiomani', 'аксиому', 'an axiom'), hint: L('Aksioma aynan qonuniy asos.', 'Аксиома как раз и есть законное основание.', 'An axiom is exactly a lawful ground.') },
        { id: 'c', label: L('oldin isbotlangan tasdiqni', 'доказанное раньше утверждение', 'a statement proved earlier'), hint: L('Isbotlangan ekan, olish mumkin.', 'Раз доказано, брать можно.', 'Once proved, it may be used.') },
        { id: 'd', label: L('masalaning shartini', 'условие задачи', 'the condition of the problem'), hint: L('Isbot shartdan boshlanadi.', 'С условия доказательство и начинается.', 'A proof begins with the condition.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nima qila olasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', "Taxmin bitta tekislik va istalgancha haqida edi. Nima chiqqanini ko'ramiz.", 'Прогноз был про одну плоскость и про сколько угодно. Посмотрим, что вышло.', 'The guess was about one plane and about any number. Let us see how it turned out.'),
    A('next', 'Bitta har doim ham emas. Hammasini shart hal qiladi: uch nuqta bir chiziqda yotadimi.', 'Одна не всегда. Всё решает условие: лежат ли три точки на одной прямой.', 'Not always one. Everything is decided by the condition: whether the three points lie on one line.'),
  ],
  can: [
    L('Tekislik nima bilan yagona berilishini bilaman', 'Знаю, чем плоскость задаётся однозначно', 'I know what fixes a plane uniquely'),
    L("Chiziq tekislikda ekanini ikki nuqta bo'yicha tekshiraman", 'Проверяю прямую в плоскости по двум точкам', 'I check a line in a plane by two points'),
    L("Ikki tekislik chiziq bo'ylab kesishishini bilaman", 'Знаю, что две плоскости пересекаются по прямой', 'I know two planes meet along a line'),
    L("Rasmda ko'ringanini isbotga olmayman", 'Не беру в доказательство то, что видно на картинке', 'I do not take what the picture shows into a proof'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of problem is closed.'),
    gap: L('Bir joy takrorlashni talab qiladi: birinchi aksioma sharti.', 'Одно место требует повтора: условие первой аксиомы.', 'One spot needs a second look: the condition of the first axiom.'),
    back: L("Qoidaga va to'rtinchi ekranga qayting.", 'Вернись к правилу и к экрану 4.', 'Go back to the rule and to screen four.'),
  },
  bridge: L("Keyin fazodagi to'g'ri chiziqlar: u yerda rasm yanada ko'proq aldaydi.", 'Дальше прямые в пространстве: там картинка соврёт ещё сильнее.', 'Next come lines in space: there the picture lies even harder.'),
  lifehack: L("Chizmaga ishonchingiz komil bo'lmasa, sahnani buring. Burilishdan o'zgargan hamma narsa isbot bo'lmagan.", 'Не уверен в чертеже — поверни сцену. Всё, что от поворота меняется, доказательством не было.', 'If you are unsure of the drawing, rotate the scene. Whatever changes with the rotation was never a proof.'),
  sheetTitle: L('Aksiomalar · shpargalka', 'Аксиомы · шпаргалка', 'Axioms · cheat sheet'),
  sheetSrc: L('10-sinf · 38-dars', '10 класс · урок 38', 'Grade 10 · lesson 38'),
  hook: {
    a: '1',
    b: '∞',
  },
  proved: '∞',
  law: 'S₁: A, B, C ∉ a   →   α',
  sheet: [
    'A, B, C ∉ a   →   α',
    'A, B ∈ α   →   a ⊂ α',
    'α ∩ β = a',
    'a, C ∉ a   →   α',
    'A, B, C ∈ a   →   ∞',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => {
  const t = String(s).replace(/−/g, '-').replace(',', '.')
  return parseFloat(t)
}

// СЦЕНЫ УРОКА. Точки одни и те же на всех экранах, меняется только их
// расположение: сначала третья точка ВНЕ прямой, потом на ней. Так видно, что
// дело не в числе точек, а в том, как они лежат.
const FREE = [
  { id: 'A', at: [-0.7, -0.25, 0], label: 'A' },
  { id: 'B', at: [0.15, 0.6, 0], label: 'B' },
  { id: 'C', at: [0.7, -0.4, 0.35], label: 'C' },
]
const ON_LINE = [
  { id: 'A', at: [-0.75, 0, 0], label: 'A' },
  { id: 'B', at: [0, 0, 0], label: 'B' },
  { id: 'C', at: [0.75, 0, 0], label: 'C' },
]
// Вторая аксиома: прямая через две точки плоскости.
const LINE_IN = [
  { id: 'A', at: [-0.6, -0.2, 0], label: 'A' },
  { id: 'B', at: [0.55, 0.25, 0], label: 'B' },
  { id: 'M', at: [-1.0, -0.35, 0], label: 'M' },
  { id: 'N', at: [0.95, 0.4, 0], label: 'N' },
  { id: 'P', at: [0.3, -0.9, 0], label: 'P' },
]
// Третья аксиома: две плоскости и общая точка.
const TWO_PL = [
  { id: 'K', at: [0, 0, 0], label: 'K' },
  { id: 'U', at: [0.9, 0, 0], label: '' },
  { id: 'V', at: [0, 0.9, 0], label: '' },
  { id: 'W', at: [0, 0, 0.9], label: '' },
]

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

// Варианты экрана 4: верный лежит в `b` (в контенте помечен «верно»).
const PICK4 = ['a', 'b', 'c'].map((k) => {
  const v = S4.pick[k]
  return {
    id: k,
    label: v && v.label ? v.label : v,
    hint: v && v.hint ? v.hint : undefined,
    ok: k === 'b',
  }
})

// Обоснования экрана 10: два законных и два негодных, вперемешку. Негодные
// приносят не «неверно», а название того, чего им не хватает.
const REASONS = [
  { id: 's1', label: S10.reason.s1 },
  { id: 's2', label: S10.reason.s2 },
  { id: 's3', label: S10.reason.s3 },
  { id: 'pic', label: S10.reason.pic.label, missing: S10.reason.pic.missing },
]
// Пятый вариант («измерено линейкой») из списка убран: на телефоне пять строк
// не помещались, прогон вёрстки поймал переполнение на сорока одном пикселе.
// Он остаётся в контенте и понадобится в уроке 40, где мерят наклонную.
// `early` -- TO'G'RI, lekin bu qatorda emas degan razbor. Ilgari bunday
// tanlovga javob jim edi (metodist ko'rdi, 2026-08-20).
const PROOF_ROWS = [
  { text: S10.proof.r1, reason: 's3', early: S10.proof.e1 },
  { text: S10.proof.r2, reason: 's1', early: S10.proof.e2 },
  { text: S10.proof.r3, reason: 's2', early: S10.proof.e3, ok: S10.proof.ok },
]

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Три точки есть, плоскости ещё нет: прогноз делается до того, как
        // стало видно, сколько её положений.
        fig={() => <Scene fig={<Space step={1} pts={FREE} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.2}>
        <Col>
          {/* Telefonda ustunlar bir-birining ostiga tushadi, shuning uchun bu
              yerda chizma BALANDLIGI qat'iy: aks holda uch savol bilan birga
              ekranga sig'maydi (vyorstka prognoni 17 px oshiqcha topdi). */}
          <Scene fig={<Space step={1} yaw={0.4} pts={FREE} planes={[{ by: ['A', 'B', 'C'], dim: true }]} />} max={240} h={158} />
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
        fig={<Space step={1} yaw={phase * 0.5} pts={FREE} planes={[{ by: ['A', 'B', 'C'] }]} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      /* ПРИБОР 6A. Крутит УЧЕНИК: вопрос открывается только после поворота,
         иначе он снова отвечает по картинке. */
      <SpinScene
        scene={<Space step={1} pts={FREE} planes={[{ by: ['A', 'B', 'C'] }]} />}
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
      /* СВИДЕТЕЛЬ УРОКА. Те же три точки, но на одной прямой: плоскость
         крутится вокруг неё, и ни одно положение не выделено. */
      <Scene
        fig={<Space step={1} yaw={0.3} pts={ON_LINE} planes={[{ around: ['A', 'C'], phi: phase * 0.9 }]} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        /* `yaw0` NIMA UCHUN: nolda tekislik yassi tasmaga aylanadi, va o'quvchi
           asbobni qo'lga olganida hech narsa ko'rmaydi (metodist, 2026-08-20). */
        yaw0={0.35}
        scene={<Space step={1} pts={ON_LINE} planes={[{ around: ['A', 'C'], phi: 0.9 }]} />}
        prompt={S4.pick.prompt}
        options={PICK4}
        okText={S4.pick.ok}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      <Scene
        fig={(
          <Space
            step={1} yaw={phase * 0.5} pts={LINE_IN}
            planes={[{ by: ['A', 'B', 'P'], dim: true }]}
            segs={[{ from: 'M', to: 'N' }]}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={(
          <Space
            step={1} pts={LINE_IN}
            planes={[{ by: ['A', 'B', 'P'], dim: true }]}
            segs={[{ from: 'M', to: 'N' }]}
          />
        )}
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
      <Scene
        fig={(
          <Space
            step={1} yaw={phase * 0.5} pts={TWO_PL}
            planes={[{ by: ['K', 'U', 'V'], dim: true }, { by: ['K', 'U', 'W'], dim: true }]}
            segs={[{ from: 'K', to: 'U' }]}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={(
          <Space
            step={1} pts={TWO_PL}
            planes={[{ by: ['K', 'U', 'V'], dim: true }, { by: ['K', 'U', 'W'], dim: true }]}
            segs={[{ from: 'K', to: 'U' }]}
          />
        )}
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
      /* Два отрезка куба, которые на одном ракурсе кажутся равными: поворот
         разводит их проекции. Мерить по проекции нельзя. */
      <Scene
        fig={<Space step={1} yaw={phase * 0.8} cube hi={['AB', 'BC1']} segs={[{ from: 'B', to: 'C1' }]} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Space step={1} yaw={0.8} cube segs={[{ from: 'B', to: 'C1' }]} />} max={300} />
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
                step={1} yaw={solved ? 0.7 : 0}
                pts={solved ? ON_LINE : FREE}
                planes={[solved ? { around: ['A', 'C'], phi: 0.9 } : { by: ['A', 'B', 'C'] }]}
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
            <Expr size="big">{S13.entry.expr}</Expr>
          </Panel>
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
            fig={(
              <Space
                step={1} yaw={round * 0.4}
                pts={round === 0 ? ON_LINE : FREE}
                planes={[round === 0 ? { around: ['A', 'C'], phi: 0.9 } : { by: ['A', 'B', 'C'], dim: true }]}
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
