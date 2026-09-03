// ============================================================================
// 10-sinf, Dars 30. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS30_KONTENT.md
// Ma'lumot sborshchik bilan yig'ilgan, EKRAN TANALARI qo'lda: asbob va
// figurani tanlash matematik qaror (etalon 5.3). Asbob 6A -- `Space`,
// burilishni o'quvchi qiladi (`SpinScene`), sahna esa darslikning kubi.
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
const LESSON_NO = 30
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Chiziq va tekislik parallelligi`,
  `Урок ${LESSON_NO}. Параллельность прямой и плоскости`,
  `Lesson ${LESSON_NO}. A line parallel to a plane`,
)

const BLOCK = { label: 'B1', from: 1, to: 7, current: 30 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L("TO'G'RI CHIZIQ VA TEKISLIK", 'ПРЯМАЯ И ПЛОСКОСТЬ', 'A LINE AND A PLANE'),
  title: L("Kesib o'tadi yoki yonidan o'tadi", 'Пересечёт или пройдёт мимо', 'It will cross, or it will pass by'),
  audio: [
    A('mount', "Kub, va unda bitta yoq bo'yalgan. Bu bizning savolimizning tekisligi.", 'Куб, и в нём одна грань закрашена. Это плоскость нашего вопроса.', 'A cube, and one face in it is shaded. This is the plane of our question.'),
    A('r1', "Birinchi yozuv chiziq ertami-kechmi tekislikka kiradi deydi: chizmada u bo'yalgan yoqning ustidan o'tadi.", 'Первая запись говорит, что прямая рано или поздно войдёт в плоскость: на чертеже она идёт прямо по закрашенной грани.', 'The first reading says the line sooner or later enters the plane: on the drawing it runs right across the shaded face.'),
    A('r2', "Ikkinchisi umumiy nuqta umuman yo'q deydi, va davom ettirish hech narsani o'zgartirmaydi.", 'Вторая говорит, что общих точек нет вовсе, и продолжение ничего не изменит.', 'The second says there are no common points at all, and extending changes nothing.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi sahnani buramiz.', 'Твой ответ записан. Сейчас повернём сцену.', 'Your answer is saved. Now we will turn the scene.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("davom ettirilsa kesib o'tadi", 'пересечёт, если продолжить', 'it crosses if extended'),
      value: '1',
    },
    b: {
      name: L('hech qachon kesmaydi', 'не пересечёт никогда', 'it never crosses'),
      value: '0',
    },
  },
  expr: ['A₁B₁', 'ABCD'],
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE BASICS'),
  title: L('Boshlashdan oldin uchta qisqa savol', 'Три коротких перед началом', 'Three short ones before we start'),
  tag: 'support',
  audio: [
    A('mount', "Bo'lib o'tgan narsalar uchun uchta savol. Uchalasi alomatda kerak bo'ladi.", 'Три вопроса на то, что уже было. Все три понадобятся в признаке.', 'Three questions on what has already been. All three are needed in the criterion.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Chiziq tekislikni kesib o'tsa, ularning nechta umumiy nuqtasi bor?", 'Сколько общих точек у прямой и плоскости, если прямая пересекает плоскость?', 'How many common points has a line with a plane it crosses?'),
      done: L("Nol, bitta, cheksiz ko'p -- uchta hol, boshqasi yo'q.", 'Ноль, одна, бесконечно много — три случая, и других нет.', 'Zero, one, infinitely many: three cases, and no others.'),
      items: [
        { id: 'a', label: L('bitta', 'одна', 'one'), correct: true },
        { id: 'b', label: L('ikkita', 'две', 'two'), hint: L('Ikki nuqta orqali chiziq tekislikka butunlay yotib qolardi.', 'Через две точки прямая уже легла бы в плоскость целиком.', 'Through two points the line would already lie in the plane entirely.') },
        { id: 'c', label: L("birorta ham yo'q", 'ни одной', 'none'), hint: L("Birorta ham yo'q parallellarda bo'ladi, bu yerda esa «kesib o'tadi» deyilgan.", 'Ни одной бывает у параллельных, а здесь сказано «пересекает».', 'None happens for parallel ones, and here it says it crosses.') },
        { id: 'd', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p tekislikda yotgan chiziqda bo'ladi.", 'Бесконечно много у прямой, которая лежит в плоскости.', 'Infinitely many belongs to a line lying in the plane.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("AB chizig'i va ABCD yog'i: chiziq shu tekislikda yotadimi?", 'Прямая AB и грань ABCD: прямая лежит в этой плоскости?', 'The line AB and the face ABCD: does the line lie in that plane?'),
      done: L('Tekislikda yotadi -- bu uchinchi hol, parallellik emas.', 'Лежит в плоскости — это третий случай, не параллельность.', 'Lying in the plane is the third case, not parallelism.'),
      items: [
        { id: 'a', label: L('ha, ikkala nuqtasi ham yoqda', 'да, обе её точки в грани', 'yes, both of its points are in the face'), correct: true },
        { id: 'b', label: L("yo'q, u faqat tegib turadi", 'нет, она только касается', 'no, it only touches it'), hint: L('Tegish bu bitta nuqta, bu yerda esa butun kesma yoqda yotadi.', 'Касание это одна точка, а тут в грани лежит весь отрезок.', 'Touching is one point, and here the whole segment lies in the face.') },
        { id: 'c', label: L("yo'q, u parallel", 'нет, она параллельна', 'no, it is parallel'), hint: L("Parallel chiziqning tekislik bilan birorta umumiy nuqtasi yo'q.", 'Параллельная не имеет с плоскостью ни одной общей точки.', 'A parallel line has no common point with the plane at all.') },
        { id: 'd', label: L("yo'q, u kesib o'tadi", 'нет, она пересекает', 'no, it crosses it'), hint: L('Kesishish bu bitta nuqta, butun kesma emas.', 'Пересечение это одна точка, а не целый отрезок.', 'An intersection is one point, not a whole segment.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Ikki chiziq bir tekislikda yotmaydi. Ular qanday ataladi?', 'Две прямые не лежат в одной плоскости. Как они называются?', 'Two lines do not lie in one plane. What are they called?'),
      done: L("Ayqash chiziqlar beshinchi ekranda kerak bo'ladi.", 'Скрещивающиеся понадобятся на экране пять.', 'Skew lines will be needed on screen five.'),
      items: [
        { id: 'a', label: L('ayqash', 'скрещивающиеся', 'skew'), correct: true },
        { id: 'b', label: L('parallel', 'параллельные', 'parallel'), hint: L('Parallellarning umumiy tekisligi bor, va u bitta.', 'У параллельных общая плоскость есть, и через них она одна.', 'Parallel lines do have a common plane, and exactly one.') },
        { id: 'c', label: L('perpendikulyar', 'перпендикулярные', 'perpendicular'), hint: L('Perpendikulyarlik burchak haqida, umumiy tekislik haqida emas.', 'Перпендикулярность про угол, а не про общую плоскость.', 'Perpendicularity is about the angle, not about a common plane.') },
        { id: 'd', label: L('ustma-ust tushuvchi', 'совпадающие', 'coinciding'), hint: L("Ustma-ust tushuvchilar bir tekislikda yotadi, va bittada emas, ko'pida.", 'Совпадающие лежат в одной плоскости, и не в одной, а во многих.', 'Coinciding lines lie in one plane, and not in one but in many.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('SAHNANI BURING', 'ПОВЕРНИ СЦЕНУ', 'TURN THE SCENE'),
  title: L('Chizma bir narsa deydi, burilish boshqa', 'Чертёж говорит одно, поворот другое', 'The drawing says one thing, the turn another'),
  tag: 'parallel-na-chertezhe',
  show: [
    [
      L("Bu rakursda chiziq yoq ustidan o'tadi", 'На этом ракурсе прямая идёт по грани', 'At this angle the line runs across the face'),
      L("ular uchrashadi deb ko'rinadi", 'кажется, что они встречаются', 'it looks as if they meet'),
      L('lekin bu faqat ekranga proyeksiya', 'но это только проекция на экран', 'but this is only the projection onto the screen'),
    ],
    [
      L('Sahna burildi', 'Сцена повернулась', 'The scene has turned'),
      L('chiziq yoqdan baland boradi va unga tegmaydi', 'прямая идёт выше грани и не касается её', 'the line runs above the face and does not touch it'),
      L("oraliq har tomondan ko'rinadi", 'зазор виден с любой стороны', 'the gap is visible from every side'),
    ],
  ],
  motion: ['spin'],
  audio: [
    A('mount', "Yuqori yoqning chizig'i va pastki yoqning tekisligi. Sahnani pastdagi tugmalar bilan buring.", 'Прямая верхней грани и плоскость нижней. Поверни сцену кнопками ниже.', 'The line of the top face and the plane of the bottom one. Turn the scene with the buttons below.'),
    A('spin', "Chiziq va yoq orasidagi oraliqni kuzatib turing. U hech qanday burilishda yo'qolmaydi.", 'Смотри на зазор между прямой и гранью. Он не исчезает ни при каком повороте.', 'Watch the gap between the line and the face. It does not vanish at any turn.'),
    A('work', 'Darslik oddiy aytadi: chiziq va tekislik kesishmasa, ular parallel.', 'Учебник говорит просто: если прямая и плоскость не пересекаются, они параллельны.', 'The textbook puts it simply: if a line and a plane do not intersect, they are parallel.'),
  ],
  work: {
    prompt: L('Chiziq va shu tekislikning nechta umumiy nuqtasi bor?', 'Сколько общих точек у прямой и этой плоскости?', 'How many common points has the line with this plane?'),
    ok: L("To'g'ri. Birorta ham yo'q, va bu parallellikning ta'rifi.", 'Верно. Ни одной, и это определение параллельности.', 'Correct. None, and that is the definition of parallelism.'),
    hint: [
      L("Sahnani buring va tegish bor-yo'qligini ko'ring.", 'Поверни сцену и посмотри, есть ли касание.', 'Turn the scene and see whether there is any contact.'),
      L("Chiziq yuqori yoq bo'ylab boradi, tekislik esa pastki.", 'Прямая идёт по верхней грани, плоскость это нижняя.', 'The line runs along the top face, the plane is the bottom one.'),
      L("Ular orasida kubning balandligi, va u hech qayerda yo'qolmaydi.", 'Между ними высота куба, и она нигде не пропадает.', 'Between them stands the height of the cube, and it never disappears.'),
    ],
    answer: '0',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('IKKI SHART', 'ДВА УСЛОВИЯ', 'TWO CONDITIONS'),
  title: L("Ikkinchi shart yo'qoladi", 'Второе условие теряют', 'The second condition gets lost'),
  tag: 'priznak-bez-vne',
  show: [
    [
      L('Darslik alomati: chiziq tekislikdagi chiziqqa parallel', 'Признак учебника: прямая параллельна прямой в плоскости', 'The criterion: the line is parallel to a line in the plane'),
      L("va o'zi tekislikda yotmaydi", 'и при этом сама в плоскости не лежит', 'and it does not lie in the plane itself'),
      L('ikkala shart ham shart', 'оба условия обязательны', 'both conditions are required'),
    ],
    [
      L("Asos chizig'ini olib alomatni tekshiramiz", 'Возьмём прямую основания и проверим признак', 'Take a line of the base and check the criterion'),
      L("u o'sha tekislikning boshqa chizig'iga parallel", 'она параллельна другой прямой той же плоскости', 'it is parallel to another line of the same plane'),
      L('lekin u tekislikka parallel emas: u unda yotadi', 'но параллельной плоскости она не является: она в ней лежит', 'but it is not parallel to the plane: it lies in it'),
    ],
  ],
  motion: ['base'],
  audio: [
    A('mount', "Alomat ikki shartdan iborat, va biri ikkinchisidan ko'proq esdan chiqadi.", 'Признак состоит из двух условий, и одно из них забывают чаще другого.', 'The criterion has two conditions, and one is forgotten more often than the other.'),
    A('base', "Qarang: o'sha mantiq, lekin chiziq tekislikning o'zidan olingan. Xulosa yolg'on chiqadi.", 'Смотри: та же логика, но прямая взята из самой плоскости. Вывод получается ложным.', 'Look: the same logic, but the line is taken from the plane itself. The conclusion comes out false.'),
    A('work', "Uning tekislik bilan umumiy nuqtalari nol emas, cheksiz ko'p.", 'Общих точек у неё с плоскостью не ноль, а бесконечно много.', 'Its common points with the plane are not zero but infinitely many.'),
  ],
  work: {
    prompt: L("Kubning nechta yog'i AB chizig'ini o'z ichiga oladi?", 'Сколько граней куба содержат прямую AB?', 'How many faces of the cube contain the line AB?'),
    ok: L("To'g'ri. Ikki yoq. Tekislikda yotgan chiziq unga parallel bo'lmaydi.", 'Верно. Две грани. Прямая, лежащая в плоскости, параллельной ей не бывает.', 'Correct. Two faces. A line lying in a plane is never parallel to it.'),
    hint: [
      L('A va B nuqtalari butunlay yotgan yoqlarni toping.', 'Найди грани, в которых обе точки A и B лежат целиком.', 'Find the faces where both A and B lie entirely.'),
      L('Biri asos, ikkinchisi yon yoq.', 'Одна из них основание, вторая боковая.', 'One of them is the base, the other is a side face.'),
      L('Demak bunday yoq ikkita.', 'Значит таких граней две.', 'So there are two such faces.'),
    ],
    answer: '2',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('HAR CHIZIQQA EMAS', 'НЕ ВСЯКОЙ ПРЯМОЙ', 'NOT TO EVERY LINE'),
  title: L('Tekislikka parallel, lekin undagi hammasiga emas', 'Параллельна плоскости — но не всему в ней', 'Parallel to the plane, but not to all of it'),
  tag: 'parallel-vsem-pryamym',
  show: [
    [
      L('Chiziq asos tekisligiga parallel', 'Прямая параллельна плоскости основания', 'The line is parallel to the plane of the base'),
      L("asosda qirralar bo'ylab to'rt chiziq bor", 'в основании четыре прямых по рёбрам', 'in the base there are four lines along the edges'),
      L("to'rttasi ham parallel emas", 'параллельны ей не все четыре', 'not all four are parallel to it'),
    ],
    [
      L("Bizningi bilan ayqash chiziq bo'yalgan", 'Подсвечена прямая, скрещивающаяся с нашей', 'A line skew to ours is highlighted'),
      L("bu juftlikning umumiy tekisligi bitta ham yo'q", 'общей плоскости у этой пары нет ни одной', 'this pair has no common plane at all'),
      L("demak ularni parallel deb bo'lmaydi", 'значит параллельными их назвать нельзя', 'so they cannot be called parallel'),
    ],
  ],
  motion: ['pick'],
  audio: [
    A('mount', 'Chiziq tekislikka parallel. Bu undagi har bir chiziqqa parallel degani emas.', 'Прямая параллельна плоскости. Это не значит, что она параллельна каждой прямой этой плоскости.', 'The line is parallel to the plane. That does not mean it is parallel to every line of that plane.'),
    A('pick', "Asosda qaysi chiziq bo'yalganini kuzatib turing. Bizningi bilan u ayqash.", 'Смотри, какая прямая подсвечена в основании. С нашей она скрещивается.', 'Watch which line is highlighted in the base. It is skew to ours.'),
    A('work', "Asosning nechta chizig'i unga haqiqatan parallel ekanini hisoblang.", 'Посчитай, сколько прямых основания действительно ей параллельны.', 'Count how many lines of the base are really parallel to it.'),
  ],
  work: {
    prompt: L("Asosning nechta qirrasi A₁B₁ chizig'iga parallel?", 'Сколько рёбер основания параллельны прямой A₁B₁?', 'How many edges of the base are parallel to the line A₁B₁?'),
    ok: L("To'g'ri. Ikkita: AB va CD. Qolgan ikkitasi u bilan ayqash.", 'Верно. Два: AB и CD. Другие два с ней скрещиваются.', 'Correct. Two: AB and CD. The other two are skew to it.'),
    hint: [
      L("Asosning o'sha yo'nalishdagi qirralarini toping.", 'Найди рёбра основания, идущие в том же направлении.', 'Find the base edges running in the same direction.'),
      L("Ikki qirra bo'ylab, ikkitasi ko'ndalang boradi.", 'Два ребра идут вдоль, два поперёк.', 'Two edges run along, two across.'),
      L("Bo'ylab AB va CD boradi.", 'Вдоль идут AB и CD.', 'Along run AB and CD.'),
    ],
    answer: '2',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Yangi holatda alomat', 'Признак на новом случае', 'The criterion on a new case'),
  tag: 'priznak-bez-vne',
  show: [
    [
      L("Kubning oltita yog'i bor", 'У куба шесть граней', 'A cube has six faces'),
      L("ikkitasi bizning chizig'imizni o'z ichiga oladi", 'две из них содержат нашу прямую', 'two of them contain our line'),
      L("boshqa ikkitasi uni kesib o'tadi", 'две другие её пересекают', 'two others cross it'),
    ],
    [
      L("Birorta nuqtasi yo'q yoqlar qoladi", 'Остаются те, где нет ни точки', 'The ones with no point at all remain'),
      L('ularning har birida bizga parallel chiziq bor', 'в каждой из них есть прямая, параллельная нашей', 'each of them has a line parallel to ours'),
      L("va chiziqning o'zi ularda yotmaydi", 'и сама прямая в них не лежит', 'and the line itself does not lie in them'),
    ],
  ],
  motion: ['faces'],
  audio: [
    A('mount', "Endi o'zingiz. Alomat o'sha, hol yangi.", 'Теперь сам. Признак тот же, случай новый.', 'Now on your own. The same criterion, a new case.'),
    A('faces', "Yoqlar navbat bilan ko'rib chiqiladi. Chiziq qayerda yotadi, qayerda kesib o'tadi -- kuzatib turing.", 'Грани перебираются по очереди. Смотри, где прямая лежит, а где пересекает.', 'The faces are gone through one by one. Watch where the line lies and where it crosses.'),
    A('work', 'Faqat alomatning ikkala sharti bajarilgan yoqlarni sanang.', 'Считай только те грани, где выполнены оба условия признака.', 'Count only the faces where both conditions of the criterion hold.'),
  ],
  work: {
    prompt: L("A₁B₁ chizig'i kubning nechta yoq tekisligiga parallel?", 'Скольким плоскостям граней куба параллельна прямая A₁B₁?', 'To how many face planes of the cube is the line A₁B₁ parallel?'),
    ok: L("To'g'ri. Ikkitasiga: asos va orqa yoqqa. Qolganlarida u yo yotadi, yo kesib o'tadi.", 'Верно. Двум: основанию и задней грани. В остальных она либо лежит, либо пересекает.', 'Correct. Two: the base and the back face. In the rest it either lies or crosses.'),
    hint: [
      L("Chiziqning o'zini o'z ichiga olgan yoqlarni chiqarib tashlang.", 'Отбрось грани, которые содержат саму прямую.', 'Discard the faces that contain the line itself.'),
      L("Uning uchlaridan o'tadiganlarni chiqarib tashlang.", 'Отбрось те, что проходят через её концы.', 'Discard those passing through its ends.'),
      L('Oltita yoqdan ikkitasi qoladi.', 'Из шести граней остаются две.', 'Of the six faces two remain.'),
    ],
    answer: '2',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE'),
  title: L('Uch hol, va faqat biri parallellik', 'Три случая, и только один параллельность', 'Three cases, and only one is parallelism'),
  tag: 'lezhit-znachit-parallel',
  show: [
    [
      L('Chiziq tekislikni kesadi: bitta umumiy nuqta', 'Прямая пересекает плоскость: одна общая точка', 'The line crosses the plane: one common point'),
      L("chiziq tekislikda yotadi: cheksiz ko'p", 'прямая лежит в плоскости: бесконечно много', 'the line lies in the plane: infinitely many'),
      L("chiziq tekislikka parallel: birorta ham yo'q", 'прямая параллельна плоскости: ни одной', 'the line is parallel to the plane: none'),
    ],
    [
      L("O'rtadagi hol parallellik bilan chalkashtiriladi", 'Средний случай и путают с параллельностью', 'The middle case is the one confused with parallelism'),
      L('yotgan chiziq ham tekislikdan chiqib ketmaydi', 'лежащая прямая тоже никуда не выходит из плоскости', 'a lying line also never leaves the plane'),
      L('lekin uning umumiy nuqtalari nol emas', 'но общих точек у неё не ноль', 'but its common points are not zero'),
    ],
  ],
  motion: ['three'],
  audio: [
    A('mount', 'Hammasi uch hol, va ularni bitta son ajratadi: umumiy nuqtalar soni.', 'Всего три случая, и различает их одно число: количество общих точек.', 'There are three cases in all, and one number tells them apart: the count of common points.'),
    A('three', "Uchta chiziq navbat bilan. Har birining bo'yalgan yoqda nechta nuqtasi bor -- kuzatib turing.", 'Три прямые по очереди. Смотри, сколько точек у каждой в закрашенной грани.', 'Three lines one by one. Watch how many points each has in the shaded face.'),
    A('work', "Parallelda birorta ham yo'q. Bu darslikdagi ta'rifning o'zi.", 'У параллельной ни одной. Это и есть определение из учебника.', 'The parallel one has none. That is exactly the textbook definition.'),
  ],
  work: {
    prompt: L('Kubning nechta qirrasi ABCD tekisligiga parallel?', 'Сколько рёбер куба параллельны плоскости ABCD?', 'How many edges of the cube are parallel to the plane ABCD?'),
    ok: L("To'g'ri. Yuqori yoqning to'rt qirrasi. Asos qirralari yotadi, tikkalari kesib o'tadi.", 'Верно. Четыре ребра верхней грани. Рёбра основания лежат, вертикальные пересекают.', 'Correct. The four edges of the top face. The base edges lie in it, the vertical ones cross it.'),
    hint: [
      L('Asos qirralarini darrov chiqarib tashlang: ular tekislikda yotadi.', 'Рёбра основания сразу отбрось: они лежат в плоскости.', 'Discard the base edges at once: they lie in the plane.'),
      L('Tik qirralar asosga sanchiladi.', 'Вертикальные рёбра втыкаются в основание.', 'The vertical edges stick into the base.'),
      L("Faqat yuqori yoqning qirralari qoladi, ular to'rtta.", 'Остаются только рёбра верхней грани, их четыре.', 'Only the top face edges remain, and there are four of them.'),
    ],
    answer: '4',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  title: L("Ta'rif va alomat", 'Определение и признак', 'The definition and the criterion'),
  tag: 'priznak-bez-vne',
  motion: ['rule'],
  audio: [
    A('mount', 'Kartochkani ochishdan oldin bitta savolga javob bering.', 'Прежде чем открыть карточку, ответь на один вопрос.', 'Before the card opens, answer one question.'),
    A('rule', "Kartochka darslik so'zlari bilan gapiradi. Alomatda ikki shart bor, va ikkinchisi muhimlik bo'yicha birinchi.", 'Карточка говорит словами учебника. В признаке два условия, и второе стоит первым по важности.', 'The card speaks in the words of the textbook. The criterion has two conditions, and the second is first in importance.'),
  ],
  probe: {
    question: L('Alomatda nima yetishmaydi?', 'Чего не хватает в признаке?', 'What is missing from the criterion?'),
    items: [
      { id: 'a', label: L('chiziq tekislikda yotmasligi sharti', 'условия, что прямая не лежит в плоскости', 'the condition that the line does not lie in the plane'), correct: true },
      { id: 'b', label: L('tekislikda ikki chiziq borligi sharti', 'условия, что прямых в плоскости две', 'the condition that there are two lines in the plane'), hint: L("Bitta chiziq kifoya. Muammo ularning sonida emas, chiziqning o'zi qayerda ekanida.", 'Достаточно одной прямой. Проблема не в их числе, а в том, где сама прямая.', 'One line is enough. The problem is not their number but where the line itself is.') },
    ],
  },
  rule: {
    lawLabel: L('Chiziq va tekislik', 'Прямая и плоскость', 'A line and a plane'),
    lines: [
      L("98-bet. To'g'ri chiziq bilan tekislik kesishmasa, ular parallel deyiladi.", 'Стр. 98. Если прямая и плоскость не пересекаются, они параллельны.', 'Page 98. If a line and a plane do not intersect, they are parallel.'),
      L("98-bet, 3.5-teorema. Tekislikda yotmasa va undagi chiziqqa parallel bo'lsa, tekislikka parallel.", 'Стр. 98, теорема 3.5. Не в плоскости и параллельна прямой в ней — параллельна плоскости.', 'Page 98, theorem 3.5. Not in the plane and parallel to a line in it means parallel to the plane.'),
      L("98-bet, 3.6-teorema. Kesishish chizig'i o'sha chiziqqa parallel.", 'Стр. 98, теорема 3.6. Линия пересечения параллельна той прямой.', 'Page 98, theorem 3.6. The intersection line is parallel to that line.'),
    ],
    law: 'a ⊄ α,   a ∥ b,   b ⊂ α   ⇒   a ∥ α',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L("TO'RT CHIZIQ", 'ЧЕТЫРЕ ПРЯМЫЕ', 'FOUR LINES'),
  title: L("Chiziqni o'z holi bilan biriktiring", 'Соедини прямую с её случаем', 'Match each line with its case'),
  tag: 'lezhit-znachit-parallel',
  audio: [
    A('mount', "Kubning to'rt chizig'i va bitta tekislik. Har chiziqning o'z holi bor.", 'Четыре прямые куба и одна плоскость. У каждой прямой свой случай.', 'Four lines of the cube and one plane. Each line has its own case.'),
  ],
  match: {
    prompt: L('Tekislik bir xil: ABCD', 'Плоскость одна и та же: ABCD', 'The plane is the same: ABCD'),
    a: L("parallel, AB bo'yicha alomat", 'параллельна, признак по AB', 'parallel, criterion by AB'),
    b: L('tekislikda yotadi', 'лежит в плоскости', 'lies in the plane'),
    c: L("A nuqtada kesib o'tadi", 'пересекает в точке A', 'crosses at the point A'),
    d: L("parallel, AC bo'yicha alomat", 'параллельна, признак по AC', 'parallel, criterion by AC'),
    ok: L("To'rttasi ham to'g'ri. Uch hol, va yotgan chiziq parallellarga kirmaydi.", 'Все четыре верно. Три случая, и лежащая прямая в параллельные не попадает.', 'All four correct. Three cases, and the lying line does not join the parallel ones.'),
    left: ['A₁B₁', 'CD', 'AA₁', 'A₁C₁'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L("Alomat bo'yicha isbotlang", 'Докажи по признаку', 'Prove it by the criterion'),
  tag: 'priznak-bez-vne',
  audio: [
    A('mount', 'D₁C₁ qirrasi asosga parallel ekanini isbotlaymiz. Alomat ikki shartni ataydi.', 'Докажем, что ребро D₁C₁ параллельно основанию. Признак называет два условия.', 'Let us prove that the edge D₁C₁ is parallel to the base. The criterion names two conditions.'),
  ],
  order: {
    prompt: L('Tartib bilan joylashtiring', 'Расставь по порядку', 'Put them in order'),
    s1: L('chiziq tekislikda yotmaydi', 'прямая в плоскости не лежит', 'the line does not lie in the plane'),
    s2: L('tekislikda unga parallel chiziq bor', 'в плоскости есть параллельная ей прямая', 'the plane has a line parallel to it'),
    s3: L("alomat bo'yicha chiziq tekislikka parallel", 'по признаку прямая параллельна плоскости', 'by the criterion the line is parallel to the plane'),
    ok: L("To'g'ri. Avval chiziq qayerda ekani tekshiriladi, keyin parallel izlanadi.", 'Верно. Сначала проверяется, где прямая, и только потом ищется параллельная.', 'Correct. First we check where the line is, and only then look for a parallel one.'),
    bad: L('Tartib boshqacha. Xulosa shartlardan oldin turolmaydi.', 'Порядок другой. Вывод не может стоять раньше условий.', 'The order is different. The conclusion cannot stand before the conditions.'),
    mark: 'D₁C₁ ∥ ABCD',
  },
  expr: ['D₁C₁', 'ABCD'],
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
    prompt: L("Yozuvlarni isbotda paydo bo'lish tartibida joylashtiring", 'Расставь записи в том порядке, в каком они появляются в доказательстве', 'Put the lines in the order they appear in the proof'),
    title: L('Yozuvlar tartibi', 'Порядок записей', 'The order of the lines'),
    ok: L("To'g'ri. Shartlar tepada, xulosa pastda.", 'Верно. Условия сверху, вывод внизу.', 'Correct. The conditions on top, the conclusion below.'),
    bad: L("Tartib to'g'ri emas. Xulosa oxirida yoziladi.", 'Не тот порядок. Вывод пишется последним.', 'Wrong order. The conclusion is written last.'),
    items: ['A₁D₁ ⊄ BCC₁B₁', 'A₁D₁ ∥ AD', 'AD ⊂ ABCD', 'A₁D₁ ∥ BCC₁B₁'],
    answer: 'A₁D₁ ⊄ BCC₁B₁  A₁D₁ ∥ AD  AD ⊂ ABCD  A₁D₁ ∥ BCC₁B₁',
  },
  task: {
    prompt: L('Kubning nechta qirrasi BCC₁B₁ tekisligiga parallel?', 'Сколько рёбер куба параллельны плоскости BCC₁B₁?', 'How many edges of the cube are parallel to the plane BCC₁B₁?'),
    ok: L("To'g'ri. To'rtta: AD, A₁D₁, AA₁ va DD₁.", 'Верно. Четыре: AD, A₁D₁, AA₁ и DD₁.', 'Correct. Four: AD, A₁D₁, AA₁ and DD₁.'),
    hint: [
      L("To'rt qirra shu yoqning o'zida yotadi, ularni sanamaymiz.", 'Четыре ребра лежат в самой этой грани, их не считаем.', 'Four edges lie in that face itself; we do not count them.'),
      L("Ko'ndalang ketadigan qirralar bu tekislikka sanchiladi.", 'Рёбра, идущие поперёк, втыкаются в эту плоскость.', 'The edges running across stick into that plane.'),
      L("Qarshi yoqning qirralari qoladi, ular to'rtta.", 'Остаются рёбра противоположной грани, их четыре.', 'The edges of the opposite face remain, and there are four.'),
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
    A('next', "Endi buni son bilan ko'rsating.", 'Теперь покажи это числом.', 'Now show it with a number.'),
  ],
  hint: {
    r1: L('Bu berilgan va uchinchi ekranda tekshirilgan.', 'Это дано и проверено на экране три.', 'This is given and was checked on screen three.'),
    r2: L("To'g'ri: bu qirra haqiqatan asosda yotadi.", 'Верно: это ребро действительно лежит в основании.', 'Correct: that edge really lies in the base.'),
    r3: L("Bu ham to'g'ri, bu ikki chiziq ham asosda yotadi.", 'Тоже верно, эти две прямые лежат в основании обе.', 'Also correct, both of these lines lie in the base.'),
  },
  proof: L('Xato oxirgi satrda. Chiziq tekislikka parallel, lekin undagi har chiziqqa emas: AD bilan u ayqash.', 'Ошибка в последней строке. Прямая параллельна плоскости, но не каждой прямой в ней: с AD она скрещивается.', 'The mistake is in the last line. The line is parallel to the plane but not to every line in it: with AD it is skew.'),
  entry: {
    prompt: L("A₁B₁ va AD chiziqlari orqali nechta tekislik o'tadi?", 'Сколько плоскостей проходит через прямые A₁B₁ и AD?', 'How many planes pass through the lines A₁B₁ and AD?'),
    ok: L("To'g'ri. Birorta ham yo'q: ular ayqash, ayqash chiziqlar orqali esa tekislik o'tmaydi.", 'Верно. Ни одной: они скрещиваются, а через скрещивающиеся прямые плоскость не проходит.', 'Correct. None: they are skew, and no plane passes through skew lines.'),
    hint: [
      L("Ikkala chiziq yotgan tekislikni topishga urinib ko'ring.", 'Попробуй найти плоскость, в которой лежат обе прямые.', 'Try to find a plane in which both lines lie.'),
      L("Biri yuqori yoq bo'ylab, ikkinchisi pastda va ko'ndalang boradi.", 'Одна идёт по верхней грани, другая по нижней и поперёк.', 'One runs along the top face, the other below and across.'),
      L("Bunday tekislik yo'q: bular ayqash chiziqlar.", 'Такой плоскости нет: это скрещивающиеся прямые.', 'There is no such plane: these are skew lines.'),
    ],
    answer: '0',
  },
  row: {
    r1: 'A₁B₁ ∥ ABCD',
    r2: 'AD ⊂ ABCD',
    r3: 'A₁B₁, AD — ?',
    r4: 'A₁B₁ ∥ AD',
  },
  answerId: 'r4',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE REVERSE TASK'),
  title: L('Endi siz izlaysiz', 'Теперь ищешь ты', 'Now you do the searching'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Bungacha chiziqni sizga berardilar. Endi qirralarni o'zingiz ko'rib chiqasiz.", 'До этого прямую давали тебе. Теперь перебираешь рёбра сам.', 'Until now the line was given to you. Now you go through the edges yourself.'),
    A('work', "E'tibor bering: uch hol o'n ikki qirrani qoldiqsiz bo'lib chiqadi.", 'Обрати внимание: три случая делят все двенадцать рёбер без остатка.', 'Notice: the three cases divide all twelve edges with nothing left over.'),
  ],
  multi: {
    prompt: L('ABCD tekisligiga parallel hamma chiziqni belgilang', 'Отметь все прямые, параллельные плоскости ABCD', 'Mark every line parallel to the plane ABCD'),
    title: L("To'rttadan ikkitasi", 'Две из четырёх', 'Two out of four'),
    ok: L("To'g'ri. Tekislik bilan birorta umumiy nuqtasi yo'qlari parallel.", 'Верно. Параллельны те, у которых с плоскостью нет ни одной общей точки.', 'Correct. Parallel are those with no common point with the plane at all.'),
    items: [
      { id: 'c', label: 'AB', hint: L("Bu qirra tekislikning o'zida yotadi, yotgan chiziq esa parallel bo'lmaydi.", 'Это ребро лежит в самой плоскости, а лежащая прямая параллельной не бывает.', 'That edge lies in the plane itself, and a lying line is never parallel.') },
      { id: 'd', label: 'AA₁', hint: L('Bu qirra A uchida tekislikka sanchiladi.', 'Это ребро втыкается в плоскость в вершине A.', 'That edge sticks into the plane at the vertex A.') },
      { id: 'a', label: 'A₁B₁', ok: true },
      { id: 'b', label: 'C₁D₁', ok: true },
    ],
  },
  entry: {
    prompt: L("Kubning nechta qirrasi ABCD tekisligini kesib o'tadi?", 'Сколько рёбер куба пересекают плоскость ABCD?', 'How many edges of the cube cross the plane ABCD?'),
    ok: L("To'g'ri. To'rt tik qirra, har biri o'z uchida.", 'Верно. Четыре вертикальных ребра, каждое в своей вершине.', 'Correct. The four vertical edges, each at its own vertex.'),
    hint: [
      L("Kesib o'tadi degani aynan bitta umumiy nuqtasi bor.", 'Пересекает значит имеет ровно одну общую точку.', 'Crossing means having exactly one common point.'),
      L('Asos qirralari yotadi, yuqori yoq qirralari parallel.', 'Рёбра основания лежат, рёбра верхней грани параллельны.', 'The base edges lie in it, the top edges are parallel.'),
      L("Tik qirralar qoladi, ular to'rtta.", 'Остаются вертикальные, их четыре.', 'The vertical ones remain, and there are four.'),
    ],
    expr: 'ABCD',
    answer: '4',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'THE BLITZ'),
  title: L("Ketma-ket to'rtta savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'parallel-vsem-pryamym',
  audio: [
    A('mount', "To'rtta savol, va ular baholanadi.", 'Четыре вопроса, и они идут в оценку.', 'Four questions, and they count towards the score.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Chiziq tekislikka parallel. Ularning nechta umumiy nuqtasi bor?', 'Прямая параллельна плоскости. Сколько у них общих точек?', 'A line is parallel to a plane. How many common points have they?'),
      done: L("Birorta ham yo'q. Bu ta'rif.", 'Ни одной. Это определение.', 'None. That is the definition.'),
      items: [
        { id: 'a', label: L("birorta ham yo'q", 'ни одной', 'none'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L('Bitta umumiy nuqta bu kesishish, parallellik emas.', 'Одна общая точка это пересечение, а не параллельность.', 'One common point is an intersection, not parallelism.') },
        { id: 'c', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p tekislikda yotgan chiziqda.", 'Бесконечно много у прямой, лежащей в плоскости.', 'Infinitely many belongs to a line lying in the plane.') },
        { id: 'd', label: L("rakursga bog'liq", 'зависит от ракурса', 'it depends on the angle'), hint: L("Rakurs chizmani o'zgartiradi, sahnani emas.", 'Ракурс меняет чертёж, а не сцену.', 'The angle changes the drawing, not the scene.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Chiziq va tekislik parallelligi alomatida shart...', 'В признаке параллельности прямой и плоскости условий…', 'In the criterion for a line and a plane the conditions number...'),
      done: L("Ikki shart, va ikkinchisi chiziqning o'zi qayerda ekani haqida.", 'Два условия, и второе про то, где сама прямая.', 'Two conditions, and the second is about where the line itself is.'),
      items: [
        { id: 'a', label: L('ikkita', 'два', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'одно', 'one'), hint: L("Bittasi kam: asos chizig'i ham tekislikdagi chiziqqa parallel.", 'Одного мало: прямая основания тоже параллельна прямой в плоскости.', 'One is not enough: a base line is also parallel to a line in the plane.') },
        { id: 'c', label: L('uchta', 'три', 'three'), hint: L('Uchinchi shartni darslik atamaydi.', 'Третьего условия учебник не называет.', 'The textbook names no third condition.') },
        { id: 'd', label: L("birorta ham yo'q, bu ta'rif", 'ни одного, это определение', 'none, it is a definition'), hint: L("Ta'rif va alomat boshqa narsa: ta'rif umumiy nuqtalar haqida.", 'Определение и признак это разные вещи: определение про общие точки.', 'A definition and a criterion differ: the definition is about common points.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Chiziq tekislikka parallel. Demak u parallel...', 'Прямая параллельна плоскости. Значит она параллельна…', 'A line is parallel to a plane. So it is parallel to...'),
      done: L('Har chiziqqa emas: tekislikning bir qismi u bilan ayqash.', 'Не каждой: часть прямых плоскости с ней скрещивается.', "Not to every one: some of the plane's lines are skew to it."),
      items: [
        { id: 'a', label: L("bu tekislikning har chizig'iga emas", 'не каждой прямой этой плоскости', 'not to every line of that plane'), correct: true, ok: L('Ha: tekislikning bir qism chiziqlari bilan u ayqash.', 'Да: с частью прямых плоскости она скрещивается.', "Yes: with some of the plane's lines it is skew.") },
        { id: 'b', label: L("bu tekislikning har chizig'iga", 'каждой прямой этой плоскости', 'to every line of that plane'), hint: L("Kubda tekshiring: asosning ko'ndalang qirrasi bilan u ayqash.", 'Проверь на кубе: с поперечным ребром основания она скрещивается.', 'Check on the cube: with the crosswise base edge it is skew.') },
        { id: 'c', label: L('aynan bitta chiziqqa', 'ровно одной прямой', 'to exactly one line'), hint: L("Kubda ikkita, tekislikda esa umuman cheksiz ko'p.", 'Их две в кубе, а в плоскости вообще бесконечно много.', 'There are two in the cube, and infinitely many in the plane.') },
        { id: 'd', label: L('birorta chiziqqa ham emas', 'ни одной прямой', 'to no line at all'), hint: L("Hech bo'lmasa bittasi doim bor: u alomat beradi.", 'Хотя бы одна есть всегда: она и даёт признак.', 'At least one always exists: that is what gives the criterion.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Chiziq tekislikda yotadi. U tekislikka parallelmi?', 'Прямая лежит в плоскости. Она параллельна плоскости?', 'A line lies in a plane. Is it parallel to the plane?'),
      done: L('Yotadi -- demak parallel emas. Hollar kesishmaydi.', 'Лежит — значит не параллельна. Случаи не пересекаются.', 'Lying means not parallel. The cases do not overlap.'),
      items: [
        { id: 'a', label: L("yo'q, bu uchinchi hol", 'нет, это третий случай', 'no, this is the third case'), correct: true },
        { id: 'b', label: L('ha, chunki u chiqib ketmaydi', 'да, ведь она не выходит', 'yes, since it never leaves'), hint: L("Chiqib ketmaydi, lekin umumiy nuqtalari cheksiz ko'p, parallelda esa birorta ham yo'q.", 'Не выходит, но общих точек бесконечно много, а у параллельной ни одной.', 'It never leaves, but it has infinitely many common points, and a parallel one has none.') },
        { id: 'c', label: L("ha, alomat bo'yicha", 'да, по признаку', 'yes, by the criterion'), hint: L('Alomat chiziq tekislikda yotmasligini talab qiladi.', 'Признак требует, чтобы прямая в плоскости не лежала.', 'The criterion requires the line not to lie in the plane.') },
        { id: 'd', label: L("tekislikka bog'liq", 'зависит от плоскости', 'it depends on the plane'), hint: L("Bog'liq emas: yotgan chiziq hech qachon parallel bo'lmaydi.", 'Не зависит: лежащая прямая параллельной не бывает никогда.', 'It does not depend: a lying line is never parallel.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('XULOSA', 'ИТОГ', 'THE SUMMARY'),
  title: L('Uch hol va ikki shartli alomat', 'Три случая и признак из двух условий', 'Three cases and a two-condition criterion'),
  audio: [
    A('mount', 'Birinchi ekrandagi taxmin va natija yonma-yon turadi.', 'Прогноз с первого экрана и результат стоят рядом.', 'The guess from screen one and the result stand side by side.'),
    A('next', "Shpargalka darslik bo'yicha yig'ilgan. Pastda nimani bilishingiz ko'rinadi.", 'Шпаргалка собрана по учебнику. Ниже видно, что умеешь.', 'The sheet is put together from the textbook. Below you can see what you can do.'),
  ],
  can: [
    L('Uch holni umumiy nuqtalar soniga qarab ajrataman', 'Различаю три случая по числу общих точек', 'I tell the three cases apart by the count of common points'),
    L("Alomatni qo'llaman va ikkala shartni tekshiraman", 'Применяю признак и проверяю оба условия', 'I apply the criterion and check both conditions'),
    L('Tekislikka parallellik har chiziqqa parallellik bermasligini bilaman', 'Знаю, что параллельность плоскости не даёт параллельности каждой прямой', 'I know parallelism to a plane gives no parallelism to every line'),
    L('Yotgan chiziqni parallel bilan chalkashtirmayman', 'Не путаю лежащую прямую с параллельной', 'I do not confuse a lying line with a parallel one'),
  ],
  levels: {
    full: L("Hammasidan o'tdingiz va tuzoqni ochdingiz", 'Прошёл всё и разобрал ловушку', 'Everything done, the trap taken apart'),
    gap: L('Alomat ishlaydi, ayqash chiziqlar hali chalkashadi', 'Признак работает, скрещивающиеся ещё путаются', 'The criterion works, skew lines still get mixed up'),
    back: L("To'rtinchi ekranga qaytish kerak: alomatning ikkinchi sharti", 'Стоит вернуться к экрану четыре: второе условие признака', 'Worth going back to screen four: the second condition'),
  },
  bridge: L("Keyingisi ikki tekislikning parallelligi: unda alomat yana ikki shartdan, va yana ikkinchisi yo'qoladi.", 'Дальше параллельность двух плоскостей: там признак снова из двух условий, и снова теряют второе.', 'Next comes parallelism of two planes: there the criterion again has two conditions, and again the second gets lost.'),
  lifehack: L("Hollar bo'yicha sanash qulay: kubning o'n ikki qirrasi bor, va har yoqqa nisbatan to'rttasi unda yotadi, to'rttasi kesadi, to'rttasi parallel. Tekshiruv yig'indi bilan.", 'Считать удобно по случаям: у куба двенадцать рёбер, и относительно любой грани четыре лежат в ней, четыре пересекают, четыре параллельны. Проверка суммой.', 'Counting by cases is handy: a cube has twelve edges, and for any face four lie in it, four cross it, four are parallel. Check by the sum.'),
  sheetTitle: L('Dars shpargalkasi', 'Шпаргалка урока', 'The lesson sheet'),
  sheetSrc: L('geometriya 2022, 98-bet', 'геометрия 2022, стр. 98', 'geometry 2022, page 98'),
  hook: {
    a: '1',
    b: '0',
  },
  proved: '0',
  law: 'a ⊄ α,   a ∥ b,   b ⊂ α   ⇒   a ∥ α',
  sheet: [
    'a ∩ α = ∅   ⇒   a ∥ α',
    'A₁B₁ ∥ AB,   AB ⊂ ABCD   ⇒   A₁B₁ ∥ ABCD',
    'AB ⊂ ABCD   ⇒   AB ∦ ABCD',
    'A₁B₁ ∦ AD,   A₁B₁ ∩ AD = ∅',
    '12 = 4 + 4 + 4',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))

// SAHNA BITTA -- darslikning kubi. O'zgaradigan narsa: qaysi yoq bo'yalgan va
// qaysi chiziq bo'yalgan. Kamera sinfning odatdagisi: bu yerda aldov rakursda
// emas, PROYEKSIYADA -- chiziq yoqning ustidan o'tgandek ko'rinadi.
const BOTTOM = [{ by: ['A', 'B', 'C'], dim: true }]
// Chiziqni O'Z ICHIGA OLGAN yoq va uni KESIB O'TADIGAN yoq: 6-ekranda alomatning
// ikkinchi sharti aynan shu ikki holatda buziladi.
const FRONT = [{ by: ['A', 'B', 'B1'], dim: true }]
const LEFT = [{ by: ['A', 'D', 'D1'], dim: true }]

const TOP_LINE = ['A1B1']
const BASE_PAIR = ['AB', 'CD']
const PARA_PAIR = ['A1B1', 'AB']
const SKEW_PAIR = ['A1B1', 'AD']
const CROSS_LINE = ['AA1']

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
          <Scene fig={<Space step={1} yaw={0.4} cube hi={TOP_LINE} planes={BOTTOM} />} max={172} h={172} />
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
          <Scene fig={<Space step={1} yaw={0.4} cube planes={BOTTOM} />} max={240} h={158} />
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
        fig={<Space step={1} cube hi={TOP_LINE} planes={BOTTOM} yaw={phase === 0 ? 0.4 : 1.6} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      /* DARSNING SHOHIDI. Buradigan o'quvchi: u burmaguncha «yoq ustidan
         o'tadi» va «yoqdan baland o'tadi» ekranda bir xil ko'rinadi. */
      <SpinScene
        yaw0={0.4}
        stepYaw={0.6}
        scene={<Space step={1} cube hi={TOP_LINE} planes={BOTTOM} />}
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
            hi={phase === 0 ? PARA_PAIR : BASE_PAIR}
            planes={BOTTOM}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.4} cube hi={BASE_PAIR} planes={BOTTOM} />} max={280} /></Col>
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
            hi={phase === 0 ? PARA_PAIR : SKEW_PAIR}
            planes={BOTTOM}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.4}
        stepYaw={0.6}
        scene={<Space step={1} cube hi={SKEW_PAIR} planes={BOTTOM} />}
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
            step={1} yaw={0.4} cube hi={TOP_LINE}
            planes={phase === 0 ? FRONT : LEFT}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.4} cube hi={TOP_LINE} planes={BOTTOM} />} max={280} /></Col>
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
            hi={phase === 0 ? CROSS_LINE : PARA_PAIR}
            planes={BOTTOM}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.4} cube planes={BOTTOM} />} max={280} /></Col>
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
            fig={<Space step={1} yaw={0.4} cube hi={solved ? PARA_PAIR : TOP_LINE} planes={BOTTOM} />}
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
          <Scene fig={<Space step={1} yaw={0.4} cube planes={BOTTOM} />} max={260} h={190} />
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
            fig={<Space step={1} yaw={0.4} cube hi={round >= 2 ? SKEW_PAIR : TOP_LINE} planes={BOTTOM} />}
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
