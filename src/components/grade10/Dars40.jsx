// ============================================================================
// 10-sinf, Dars 40. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS40_KONTENT.md
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
const LESSON_NO = 40
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Perpendikulyar chiziq va tekislik`,
  `Урок ${LESSON_NO}. Перпендикулярность`,
  `Lesson ${LESSON_NO}. Perpendicular line and plane`,
)

const BLOCK = { label: 'B6', from: 38, to: 43, current: 40 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('PERPENDIKULYAR', 'ПЕРПЕНДИКУЛЯР', 'THE PERPENDICULAR'),
  title: L("Bitta chiziq yetadimi yoki yo'q", 'Одной прямой хватит или нет', 'Is one line enough or not'),
  audio: [
    A('mount', 'Tekislikda bitta chiziq, bizning chiziq unga perpendikulyar. Nuqtadagi burchak belgilangan.', 'В плоскости одна прямая, и наша прямая ей перпендикулярна. Угол в точке отмечен.', 'One line in the plane, and our line is perpendicular to it. The angle at the point is marked.'),
    A('r1', "Birinchi yozuv shunday deydi: burchak to'g'ri, demak chiziq butun tekislikka ham perpendikulyar.", 'Первая запись говорит: угол прямой, значит прямая перпендикулярна и всей плоскости.', 'The first reading says: the angle is right, so the line is perpendicular to the whole plane.'),
    A('r2', 'Ikkinchisi bunday xulosa uchun bitta chiziq kam deydi.', 'Вторая говорит, что одной прямой для такого вывода мало.', 'The second says one line is not enough for such a conclusion.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi sahnani buramiz.', 'Твой ответ записан. Сейчас повернём сцену.', 'Your answer is saved. Now we will rotate the scene.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('bittasi yetadi', 'хватит одной', 'one is enough'),
      value: 'a ⊥ α',
    },
    b: {
      name: L('bittasi kam', 'одной мало', 'one is not enough'),
      value: 'a ⊥ α  ?',
    },
  },
  expr: 'a ⊥ b,   b ⊂ α',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Alomatdan oldin uch savol', 'Три вопроса перед признаком', 'Three questions before the criterion'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Fazoda ikki to'g'ri chiziq qachon perpendikulyar?", 'Когда две прямые в пространстве перпендикулярны?', 'When are two lines in space perpendicular?'),
      done: 'a ⊥ b   →   90°',
      items: [
        { id: 'a', label: L("ular orasidagi burchak to'qson gradus bo'lganda", 'когда угол между ними девяносто градусов', 'when the angle between them is ninety degrees'), correct: true },
        { id: 'b', label: L('ular kesishganda', 'когда они пересекаются', 'when they meet'), hint: L('Istalgan burchak ostida kesishish mumkin.', 'Пересекаться можно под любым углом.', 'Lines can meet at any angle.') },
        { id: 'c', label: L('ular bitta tekislikda yotganda', 'когда они лежат в одной плоскости', 'when they lie in one plane'), hint: L('Bitta tekislikda parallellar ham yotadi.', 'В одной плоскости лежат и параллельные.', 'Parallel lines lie in one plane too.') },
        { id: 'd', label: L("ular teng bo'lganda", 'когда они равны', 'when they are equal'), hint: L("To'g'ri chiziqlarning uzunligi umuman yo'q.", 'У прямых длины нет вовсе.', 'Lines have no length at all.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Perpendikulyar chiziqlar ayqash bo'lishi mumkinmi?", 'Могут ли перпендикулярные прямые быть скрещивающимися?', 'Can perpendicular lines be skew?'),
      done: 'a ⊥ b,   a ∸ b',
      items: [
        { id: 'a', label: L('ha, mumkin', 'да, могут', 'yes, they can'), correct: true },
        { id: 'b', label: L("yo'q, ular doim kesishadi", 'нет, они всегда пересекаются', 'no, they always meet'), hint: L("Ayqashlar orasidagi burchak ko'chirish bilan aniqlanadi, va u to'g'ri ham bo'ladi.", 'Угол между скрещивающимися определён переносом, и он бывает прямым.', 'The angle between skew lines is defined by shifting, and it can be right.') },
        { id: 'c', label: L("yo'q, ular doim parallel", 'нет, они всегда параллельны', 'no, they are always parallel'), hint: L("Parallellar nol burchak hosil qiladi, to'qson emas.", 'Параллельные образуют угол ноль, а не девяносто.', 'Parallel lines make an angle of zero, not ninety.') },
        { id: 'd', label: L('faqat kubda', 'только в кубе', 'only in a cube'), hint: L('Kub bu misol, shart emas.', 'Куб это пример, а не условие.', 'A cube is an example, not a condition.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Tekislikning bir nuqtasi orqali uning nechta chizig'i o'tadi?", 'Сколько прямых плоскости проходит через одну её точку?', 'How many lines of a plane pass through one of its points?'),
      done: '∞',
      items: [
        { id: 'a', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L("Tekislikdagi nuqta orqali istalgan yo'nalishda chiziq o'tkazish mumkin.", 'Через точку в плоскости можно провести прямую в любом направлении.', 'Through a point in a plane a line can go in any direction.') },
        { id: 'c', label: L('ikkita', 'две', 'two'), hint: L("Ish ikkita bilan cheklanmaydi, yo'nalish istalgancha.", 'Двумя дело не ограничивается, направлений сколько угодно.', 'It does not stop at two, there are any number of directions.') },
        { id: 'd', label: L("bitta ham yo'q", 'ни одной', 'none'), hint: L("Hech bo'lmaganda bittasi doim bor.", 'Хотя бы одна есть всегда.', 'At least one always exists.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Buring va chiziq tik turganini ko'ring", 'Поверни и посмотри, стоит ли прямая', 'Rotate and see whether the line stands up'),
  tag: 'odnoy-pryamoy-hvatit',
  show: [
    [
      L('tekislikda bitta chiziq olingan', 'в плоскости взята одна прямая', 'one line is taken in the plane'),
      L('bizning chiziq unga perpendikulyar', 'наша прямая ей перпендикулярна', 'our line is perpendicular to it'),
      L("burchak belgilangan, va u to'g'ri", 'угол отмечен, и он прямой', 'the angle is marked and it is right'),
    ],
    [
      L('sahnani buring', 'поверни сцену', 'rotate the scene'),
      L("chiziq og'ib qoldi", 'прямая наклонилась', 'the line turned out slanted'),
      L('u tekislikka nisbatan qiyshiq turadi', 'к плоскости она стоит косо', 'it stands askew to the plane'),
    ],
  ],
  motion: ['spin'],
  audio: [
    A('mount', 'Tekislikda bitta chiziq, bizning chiziq unga perpendikulyar. Boshqa hech nima tekshirilmagan.', 'В плоскости одна прямая, и наша прямая ей перпендикулярна. Больше ничего не проверено.', 'One line in the plane, and our line is perpendicular to it. Nothing else has been checked.'),
    A('spin', "Birinchi rakursda hammasi ishonarli ko'rinadi: burchak to'g'ri, chiziq tekislikda tik turgandek. Sahnani buring va yondan qarang. Chiziq og'gan: u tikka ko'tarilmay, chetga ketadi. Shu bilan birga o'sha yagona chiziq bilan burchak to'g'ri qoldi, uni hech kim buzmadi. Demak tekislikning bitta chizig'iga perpendikulyarlik tekislikning o'ziga perpendikulyarlik haqida hali hech nima demaydi. Buni nimadan bilganimizga e'tibor bering. Mulohazadan yoki o'lchashdan emas, burilishdan: birinchi rakursda og'ishni ko'rish mumkin emas edi.", 'На первом ракурсе всё выглядит убедительно: угол прямой, прямая как будто стоит на плоскости. Поверни сцену и посмотри сбоку. Прямая наклонена: она уходит в сторону, а не поднимается вертикально. При этом угол с той единственной прямой остался прямым, никто его не портил. Значит перпендикулярность одной прямой плоскости ещё ничего не говорит о перпендикулярности самой плоскости. Заметь, из чего мы это узнали. Не из рассуждения и не из измерения, а из поворота: на первом ракурсе увидеть наклон было нельзя.', 'From the first view everything looks convincing: the angle is right, the line seems to stand on the plane. Rotate the scene and look from the side. The line is slanted: it goes off sideways instead of rising vertically. Meanwhile the angle with that single line stayed right, nobody spoiled it. So being perpendicular to one line of a plane says nothing yet about being perpendicular to the plane itself. Notice how we learned this. Not from reasoning and not from measuring, but from rotating: on the first view the slant could not be seen.'),
    A('work', 'Sahnani buring va javob bering: chiziq tekislikka qanday turadi?', 'Поверни сцену и ответь: как прямая стоит к плоскости?', 'Rotate the scene and answer: how does the line stand to the plane?'),
  ],
  pick: {
    prompt: L('Chiziq tekislikka qanday turadi?', 'Как прямая стоит к плоскости?', 'How does the line stand to the plane?'),
    a: {
      label: L('perpendikulyar', 'перпендикулярно', 'perpendicular to it'),
      hint: L('Yana buring: u yuqoriga emas, chetga ketadi.', 'Поверни ещё раз: она уходит в сторону, а не вверх.', 'Rotate again: it goes sideways, not upwards.'),
    },
    b: L('qiyshiq', 'наклонно', 'at a slant'),
    c: {
      label: L('tekislikda yotadi', 'лежит в плоскости', 'it lies in the plane'),
      hint: L("U holda tekislik chizig'i bilan burchak to'g'ri deb belgilanmasdi.", 'Тогда угол с прямой плоскости не был бы отмечен как прямой.', 'Then the angle with the line of the plane would not be marked as right.'),
    },
    ok: L("Qiyshiq. Bitta chiziq bilan burchak to'g'ri, tekislikka esa chiziq qiyshiq turadi.", 'Наклонно. Угол с одной прямой прямой, а к плоскости прямая стоит косо.', 'At a slant. The angle with one line is right, yet the line stands askew to the plane.'),
  },
  mark: 'a ⊥ b,   b ⊂ α',
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Ikkinchi chiziq hammasini o'zgartiradi", 'Вторая прямая меняет всё', 'The second line changes everything'),
  tag: 'odnoy-pryamoy-hvatit',
  show: [
    [
      L('tekislikda ikkinchi chiziq olingan', 'в плоскости взята вторая прямая', 'a second line is taken in the plane'),
      L("u birinchisini kesib o'tadi", 'она пересекает первую', 'it crosses the first one'),
      L('bizning chiziq unga ham perpendikulyar', 'наша прямая перпендикулярна и ей', 'our line is perpendicular to it as well'),
    ],
    [
      L('sahnani buring', 'поверни сцену', 'rotate the scene'),
      L("og'ish endi yo'q", 'наклона больше нет', 'there is no slant any more'),
      L('hech qanday burilishda', 'ни при каком повороте', 'at no rotation at all'),
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', "Tekislikka birinchisini kesib o'tadigan ikkinchi chiziqni qo'shamiz.", 'Добавим в плоскость вторую прямую, которая пересекает первую.', 'Let us add a second line to the plane, one that crosses the first.'),
    A('two', "Endi bizning chiziq tekislikning ikki chizig'iga perpendikulyar, va bu ikkitasi kesishadi. Sahnani har tomondan buring. Hech qanday rakursda og'ish yo'q: chiziq ustundek tikka turadi. Bundan tashqari, endi u faqat shu ikkitasiga emas, tekislikning istalgan chizig'iga perpendikulyar. Alomatda kesishuvchi so'zi shuning uchun turadi. Ikki kesishuvchi chiziq tekislikda ikki xil yo'nalishni beradi, va bu chiziqni mahkamlash uchun yetadi. Bitta chiziq bitta yo'nalishni beradi, uning atrofida esa og'ishga joy bor.", 'Теперь наша прямая перпендикулярна двум прямым плоскости, и эти две пересекаются. Поверни сцену со всех сторон. Наклона нет ни при каком ракурсе: прямая стоит вертикально, как столб. Больше того, теперь она перпендикулярна любой прямой плоскости, а не только этим двум. Вот почему в признаке стоит слово пересекающиеся. Две пересекающиеся прямые задают в плоскости два разных направления, а этого хватает, чтобы закрепить прямую. Одна прямая задаёт одно направление, и вокруг него ещё есть куда наклониться.', 'Now our line is perpendicular to two lines of the plane, and those two cross each other. Rotate the scene from every side. There is no slant at any view: the line stands vertical like a post. What is more, it is now perpendicular to any line of the plane, not only to these two. That is why the criterion carries the word crossing. Two crossing lines give two different directions in the plane, and that is enough to fix the line. One line gives one direction, and around it there is still room to lean.'),
    A('work', 'Sahnani buring va javob bering: chiziq endi qanday turadi?', 'Поверни сцену и ответь: как прямая стоит теперь?', 'Rotate the scene and answer: how does the line stand now?'),
  ],
  pick: {
    prompt: L('Chiziq endi tekislikka qanday turadi?', 'Как прямая стоит к плоскости теперь?', 'How does the line stand to the plane now?'),
    a: {
      label: L('hali ham qiyshiq', 'всё ещё наклонно', 'still at a slant'),
      hint: L("Yana buring: hech bir rakursda og'ish yo'q.", 'Поверни ещё: наклона нет ни на одном ракурсе.', 'Rotate again: there is no slant at any view.'),
    },
    b: L('tekislikka perpendikulyar', 'перпендикулярно плоскости', 'perpendicular to the plane'),
    c: {
      label: L("bu rakursga bog'liq", 'это зависит от ракурса', 'it depends on the view'),
      hint: L("Rakursga rasm bog'liq, shaklning o'zi emas.", 'От ракурса зависит картинка, а не сама фигура.', 'The picture depends on the view, the figure itself does not.'),
    },
    ok: L('Perpendikulyar. Ikki kesishuvchi chiziq yetdi, va bu alomat.', 'Перпендикулярно. Двух пересекающихся прямых хватило, и это признак.', 'Perpendicular. Two crossing lines were enough, and that is the criterion.'),
  },
  mark: 'a ⊥ b,   a ⊥ c,   b ∩ c = O   →   a ⊥ α',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Alomat aynan nimani talab qiladi', 'Что именно требует признак', 'What exactly the criterion demands'),
  tag: 'svoystvo-vmesto-priznaka',
  show: [
    [
      L('alomat ikki chiziqni talab qiladi', 'признак требует двух прямых', 'the criterion demands two lines'),
      L('ikkalasi tekislikda yotadi', 'обе лежат в плоскости', 'both lie in the plane'),
      L('va ular kesishadi', 'и они пересекаются', 'and they cross'),
    ],
    [
      L('u holda chiziq tekislikka perpendikulyar', 'тогда прямая перпендикулярна плоскости', 'then the line is perpendicular to the plane'),
      L('va undagi istalgan chiziqqa', 'и любой прямой в ней', 'and to any line in it'),
      L('bu allaqachon xossa, alomat emas', 'это уже свойство, а не признак', 'that is already a property, not the criterion'),
    ],
  ],
  motion: ['count'],
  audio: [
    A('mount', "Alomat shartlarini yig'amiz va sanaymiz.", 'Соберём условия признака и посчитаем их.', 'Let us gather the conditions of the criterion and count them.'),
    A('count', "Alomat shunday: agar chiziq tekislikda yotgan ikki kesishuvchi chiziqqa perpendikulyar bo'lsa, u tekislikka ham perpendikulyar. Talab bu yerda ikkita: chiziq ikkita bo'lishi kerak, va ular kesishishi kerak. Endi eng ko'p xato qilinadigan muhim farq. Alomat va xossa qarama-qarshi tomonga gapiradi. Alomat ikki chiziqdan tekislikka boradi: ikkitasini tekshirdim, butun tekislik haqida xulosa oldim. Xossa teskariga boradi: agar chiziq tekislikka allaqachon perpendikulyar bo'lsa, u undagi istalgan chiziqqa perpendikulyar, va hech nimani tekshirish kerak emas. Alomat o'rniga xossani qo'yish isbotlanishi kerak narsani tayyor deb olish degani.", 'Признак звучит так: если прямая перпендикулярна двум пересекающимся прямым, лежащим в плоскости, то она перпендикулярна и плоскости. Требований здесь два: прямых должно быть две, и они должны пересекаться. Теперь важное различение, на котором ошибаются чаще всего. Признак и свойство говорят в разные стороны. Признак идёт от двух прямых к плоскости: проверил две, получил вывод про всю плоскость. Свойство идёт обратно: если прямая уже перпендикулярна плоскости, то она перпендикулярна любой прямой в ней, и проверять ничего не надо. Подставить свойство вместо признака значит взять то, что надо доказать, за готовое.', 'The criterion says: if a line is perpendicular to two crossing lines lying in a plane, then it is perpendicular to the plane as well. There are two requirements here: there must be two lines, and they must cross. Now the important distinction where mistakes happen most. A criterion and a property speak in opposite directions. The criterion goes from two lines to the plane: I checked two, I got a conclusion about the whole plane. The property goes back: if a line is already perpendicular to the plane, then it is perpendicular to any line in it, and nothing needs checking. Putting the property in place of the criterion means taking what has to be proved as given.'),
    A('work', "O'zingiz hisoblang. Alomat tekislikning nechta chizig'ini talab qiladi?", 'Посчитай сам. Сколько прямых плоскости требует признак?', 'Work it out yourself. How many lines of the plane does the criterion require?'),
  ],
  work: {
    prompt: L('Alomat nechta chiziqni talab qiladi?', 'Сколько прямых требует признак?', 'How many lines does the criterion require?'),
    ok: L('Ikkita. Va albatta kesishuvchi, aks holda alomat ishlamaydi.', 'Две. И обязательно пересекающиеся, иначе признак не работает.', 'Two. And necessarily crossing, otherwise the criterion does not work.'),
    hint: [
      L("Alomatni qayta o'qing va undagi chiziqlarni sanang.", 'Перечитай признак и посчитай прямые в нём.', 'Read the criterion again and count the lines in it.'),
      L("Bittasi yetmadi, buni burilish bilan ko'rdingiz.", 'Одной не хватило, ты видел это поворотом.', 'One was not enough, you saw that by rotating.'),
      L('Ikki.', 'Две.', 'Two.'),
    ],
    expr: 'a ⊥ b,   a ⊥ c,   b ∩ c = O',
    answer: '2',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Ikki chiziq, lekin parallel', 'Две прямые, но параллельные', 'Two lines, but parallel'),
  tag: 'odnoy-pryamoy-hvatit',
  show: [
    [
      L('tekislikda ikki chiziq', 'в плоскости две прямые', 'two lines in the plane'),
      L('bizning chiziq ikkalasiga perpendikulyar', 'наша прямая перпендикулярна обеим', 'our line is perpendicular to both'),
      L('lekin bu ikkitasi parallel', 'но эти две параллельны', 'but these two are parallel'),
    ],
    [
      L('sahnani buring', 'поверни сцену', 'rotate the scene'),
      L("og'ish qoldi", 'наклон остался', 'the slant is still there'),
      L("ikki chiziq kam bo'lib chiqdi", 'двух прямых оказалось мало', 'two lines turned out not to be enough'),
    ],
  ],
  motion: ['para'],
  audio: [
    A('mount', 'Tekislikda ikki chiziq olib, yana tekshiramiz. Faqat endi ular parallel.', 'Возьмём в плоскости две прямые и снова проверим. Только теперь они параллельны.', 'Let us take two lines in the plane and check again. Only now they are parallel.'),
    A('para', "Bizning chiziq ikkalasiga perpendikulyar, chiziq ikkita, xulosa esa yo'q: sahnani buring va o'sha og'ishni ko'rasiz. Gap yo'nalishlarda. Ikki parallel chiziq tekislikda bir xil yo'nalishni beradi, ikkinchisini qo'shmaydi. Shuning uchun chiziq shu yo'nalish bo'ylab og'ishi mumkin, ikkalasiga perpendikulyar qolgan holda. Alomat shunchaki ikki chiziqni emas, ikki XIL yo'nalishni talab qiladi, va shuning uchun unda kesishuvchi so'zi turadi. Ikki parallel chiziq nechta yo'nalish berishini o'zingiz sanang.", 'Наша прямая перпендикулярна обеим, прямых две, а вывода нет: поверни сцену и увидишь тот же наклон. Дело в направлениях. Две параллельные прямые задают в плоскости одно и то же направление, второго они не добавляют. Поэтому прямая может наклоняться вдоль этого направления, оставаясь перпендикулярной обеим. Признак требует не просто двух прямых, а двух РАЗНЫХ направлений, и потому в нём стоит слово пересекающиеся. Посчитай сам, сколько направлений задают две параллельные прямые.', 'Our line is perpendicular to both, there are two lines, and yet there is no conclusion: rotate the scene and you will see the same slant. It is about directions. Two parallel lines give one and the same direction in the plane, they add no second one. So the line can lean along that direction while staying perpendicular to both. The criterion requires not simply two lines but two DIFFERENT directions, and that is why it carries the word crossing. Count for yourself how many directions two parallel lines give.'),
    A('work', "O'zingiz hisoblang. Ikki parallel chiziq nechta har xil yo'nalish beradi?", 'Посчитай сам. Сколько разных направлений задают две параллельные прямые?', 'Work it out yourself. How many different directions do two parallel lines give?'),
  ],
  work: {
    prompt: L("Ular nechta har xil yo'nalish beradi?", 'Сколько разных направлений они задают?', 'How many different directions do they give?'),
    ok: L("Bitta. Parallellar bir tomonga boradi, ikkinchi yo'nalishni bermaydi.", 'Одно. Параллельные идут в одну сторону, второго направления они не дают.', 'One. Parallel lines go the same way, they give no second direction.'),
    hint: [
      L('Ularning har biri qayerga borishiga qarang.', 'Посмотри, куда идёт каждая из них.', 'Look at where each of them goes.'),
      L("Parallellarning yo'nalishi bir xil.", 'У параллельных направление одно и то же.', 'Parallel lines have one and the same direction.'),
      L('Bitta.', 'Одно.', 'One.'),
    ],
    expr: 'b ∥ c   →   b ∩ c = ∅',
    answer: '1',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARAVIY HOL', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Perpendikulyar yonlab o'tolmaydi", 'Перпендикуляр не может пройти мимо', 'A perpendicular cannot pass by'),
  tag: 'izmeril-znachit-dokazal',
  show: [
    [
      L('chiziq tekislikka perpendikulyar', 'прямая перпендикулярна плоскости', 'the line is perpendicular to the plane'),
      L("demak u uni kesib o'tadi", 'значит она её пересекает', 'so it crosses it'),
      L("yonlab o'tolmaydi", 'пройти мимо она не может', 'it cannot pass by'),
    ],
    [
      L('buring va umumiy nuqtalarni sanang', 'поверни и посчитай общие точки', 'rotate and count the common points'),
      L('ular chiziq va tekislikda qanchaligicha', 'их ровно столько, сколько у прямой с плоскостью', 'as many as a crossing line has'),
      L("va bu yerda o'lchaydigan narsa yo'q", 'и мерить тут нечего', 'and there is nothing to measure here'),
    ],
  ],
  motion: ['cross'],
  audio: [
    A('mount', "Darslikning yana bir tasdig'i, qisqa va foydali.", 'Ещё одно утверждение учебника, короткое и полезное.', 'One more statement from the textbook, short and useful.'),
    A('cross', "Darslik shunday deydi: tekislikka perpendikulyar chiziq albatta uni kesib o'tadi. Nega ekani tushunarli: agar u tekislikka tegmasa, unga parallel bo'lardi, parallel chiziq esa tekislik chiziqlari bilan hech qanday to'g'ri burchak hosil qilmaydi. Demak umumiy nuqta bor, va u bitta: ikkita bo'lishi mumkin emas, aks holda ikkinchi aksioma bo'yicha butun chiziq tekislikka yotardi. Bu nuqtalarni o'zingiz sanang. Va yilning asosiy qoidasini eslab turing: sonlar chizmadan olinmaydi. Bu yerda javob o'lchash bilan emas, mulohaza bilan olindi, shuning uchun u isbotga yaraydi.", 'Учебник говорит: прямая, перпендикулярная плоскости, обязательно её пересекает. Понятно почему: если бы она плоскости не касалась, то была бы ей параллельна, а параллельная прямая никакого прямого угла с прямыми плоскости не образует. Значит общая точка есть, и она одна: двух быть не может, иначе по второй аксиоме вся прямая легла бы в плоскость. Посчитай эти точки сам. И держи в голове главное правило года: числа с чертежа не берут. Здесь ответ получен рассуждением, а не измерением, и потому он годится в доказательство.', 'The textbook says: a line perpendicular to a plane necessarily crosses it. It is clear why: if it did not touch the plane it would be parallel to it, and a parallel line makes no right angle with the lines of the plane at all. So a common point exists, and there is one: there cannot be two, otherwise by the second axiom the whole line would lie in the plane. Count these points yourself. And keep the main rule of the year in mind: numbers are not taken from the drawing. Here the answer came from reasoning, not from measuring, and that is why it can go into a proof.'),
    A('work', "O'zingiz hisoblang. Perpendikulyar va tekislikning nechta umumiy nuqtasi bor?", 'Посчитай сам. Сколько общих точек у перпендикуляра и плоскости?', 'Work it out yourself. How many common points do the perpendicular and the plane have?'),
  ],
  work: {
    prompt: L('Ularning nechta umumiy nuqtasi bor?', 'Сколько у них общих точек?', 'How many common points do they have?'),
    ok: L('Bitta. Nol parallellikni, ikkita esa chiziq tekislikda yotishini bildirardi.', 'Одна. Ноль означал бы параллельность, две означали бы, что прямая лежит в плоскости.', 'One. Zero would mean parallel, two would mean the line lies in the plane.'),
    hint: [
      L("Perpendikulyar tekislikka parallel bo'lishi mumkinmi?", 'Может ли перпендикуляр быть параллелен плоскости?', 'Can a perpendicular be parallel to the plane?'),
      L('Ikki umumiy nuqta butun chiziqni tekislikka tortardi.', 'Две общие точки затянули бы всю прямую в плоскость.', 'Two common points would pull the whole line into the plane.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    expr: 'a ⊥ α   →   a ∩ α = O',
    answer: '1',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Alomat va xossa', 'Признак и свойство', 'The criterion and the property'),
  tag: 'svoystvo-vmesto-priznaka',
  motion: ['rule'],
  audio: [
    A('mount', "Qoidani yig'amiz. Alomat qisqa, lekin undagi har so'z ishlaydi.", 'Соберём правило. Признак короткий, но каждое слово в нём работает.', 'Let us put the rule together. The criterion is short, but every word in it works.'),
    A('rule', "Alomat: agar chiziq tekislikda yotgan ikki kesishuvchi chiziqqa perpendikulyar bo'lsa, u shu tekislikka perpendikulyar. Ikki so'zi shuning uchun kerak, chunki bittasi kam: chiziq yagona yo'nalish atrofida og'adi. Kesishuvchi so'zi shuning uchun kerak, chunki parallellar bitta yo'nalish beradi, ikkitasini emas. Keyin xossa ishlaydi, va u boshqa tomonga qaraydi: tekislikka perpendikulyar chiziq shu tekislikdagi istalgan chiziqqa perpendikulyar. Alomat isbotlaydi, xossa isbotlanganidan foydalanadi. Xossani alomat o'rniga qo'yib bo'lmaydi: bu xulosani shart o'rniga olish bilan bir xil.", 'Признак: если прямая перпендикулярна двум пересекающимся прямым, лежащим в плоскости, то она перпендикулярна этой плоскости. Слово двум нужно потому, что одной мало: прямая наклонится вокруг единственного направления. Слово пересекающимся нужно потому, что параллельные дают одно направление, а не два. Дальше работает свойство, и оно смотрит в другую сторону: перпендикулярная плоскости прямая перпендикулярна любой прямой в этой плоскости. Признак доказывает, свойство пользуется доказанным. Поставить свойство на место признака нельзя: это то же самое, что взять вывод за условие.', 'The criterion: if a line is perpendicular to two crossing lines lying in a plane, then it is perpendicular to that plane. The word two is needed because one is not enough: the line will lean around the single direction. The word crossing is needed because parallel lines give one direction, not two. Then the property works, and it looks the other way: a line perpendicular to a plane is perpendicular to any line in that plane. The criterion proves, the property uses what was proved. The property cannot be put in place of the criterion: that is the same as taking the conclusion for the condition.'),
  ],
  probe: {
    question: L('Alomat xossadan nimasi bilan farq qiladi?', 'Чем признак отличается от свойства?', 'How does a criterion differ from a property?'),
    items: [
      { id: 'a', label: L('alomat xulosaga olib boradi, xossa undan kelib chiqadi', 'признак ведёт к выводу, свойство следует из него', 'a criterion leads to the conclusion, a property follows from it'), correct: true },
      { id: 'b', label: L('bu bir xil narsa, boshqacha aytilgan', 'это одно и то же, сказанное по-разному', 'they are the same thing said differently'), hint: L("U holda isbot doira bo'ylab yurardi: xulosa shart o'rniga olinardi.", 'Тогда доказательство ходило бы по кругу: вывод брался бы за условие.', 'Then the proof would go in a circle: the conclusion would serve as the condition.') },
    ],
  },
  rule: {
    lawLabel: L('ALOMAT', 'ПРИЗНАК', 'THE CRITERION'),
    lines: [
      L("chiziq tekislikning ikki chizig'iga perpendikulyar", 'прямая перпендикулярна двум прямым плоскости', 'the line is perpendicular to two lines of the plane'),
      L('bu ikki chiziq kesishadi', 'эти две прямые пересекаются', 'those two lines cross each other'),
      L('u holda chiziq tekislikka perpendikulyar', 'тогда прямая перпендикулярна плоскости', 'then the line is perpendicular to the plane'),
    ],
    law: 'a ⊥ b,   a ⊥ c,   b ∩ c = O   →   a ⊥ α',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  title: L("Kub bo'yicha sanang", 'Посчитай по кубу', 'Count on the cube'),
  tag: 'svoystvo-vmesto-priznaka',
  audio: [
    A('mount', "Kub haqida to'rt yozuv. Oxirgisi uning yoqlari soni.", 'Четыре записи про куб. Последняя это число его граней.', 'Four writings about the cube. The last one is the number of its faces.'),
  ],
  match: {
    prompt: L("To'rt javobning hammasi har xil", 'Все четыре ответа разные', 'All four answers are different'),
    ok: L("To'g'ri. Qirraga perpendikulyarlari eng ko'p: o'n birdan sakkiztasi.", 'Верно. Перпендикулярных ребру больше всего: их восемь из одиннадцати.', 'Correct. Perpendicular edges are the most: eight out of eleven.'),
    left: ['AB ⊥ ?', 'AB ∥ ?', 'AB ∸ ?', 'ABCDA₁B₁C₁D₁'],
    a: '8',
    b: '3',
    c: '4',
    d: '6',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Perpendikulyarlikni isbotlang', 'Докажи перпендикулярность', 'Prove the perpendicularity'),
  tag: 'svoystvo-vmesto-priznaka',
  audio: [
    A('mount', "Kubda isbotlaymiz. Har qatorning asoslashi ro'yxatdan tanlanadi.", 'Докажем на кубе. Обоснование каждой строки выбирается из списка.', 'Let us prove it on the cube. The justification of each line is chosen from the list.'),
  ],
  proof: {
    given: L('kubning yon qirrasi va asos tekisligi', 'боковое ребро куба и плоскость основания', 'a side edge of a cube and the plane of its base'),
    goal: L('qirra asos tekisligiga perpendikulyar', 'ребро перпендикулярно плоскости основания', 'the edge is perpendicular to the plane of the base'),
    r1: L('qirra asosning birinchi qirrasiga perpendikulyar', 'ребро перпендикулярно первому ребру основания', 'the edge is perpendicular to the first edge of the base'),
    r2: L('u ikkinchisiga ham perpendikulyar', 'оно перпендикулярно и второму', 'it is perpendicular to the second as well'),
    r3: L('asosning bu ikki qirrasi kesishadi', 'эти два ребра основания пересекаются', 'those two edges of the base cross'),
    e1: L(
      "Alomat oxirida qo'llanadi. Hozir uning sharti tekshirilyapti.",
      'Признак идёт в конце. Здесь проверяется его условие.',
      'The criterion comes at the end. Here its condition is checked.',
    ),
    e2: L(
      "Bu qator birinchisidek, faqat ikkinchi qirra bilan.",
      'Эта строка как первая, только со вторым ребром.',
      'This line is like the first, only with the second edge.',
    ),
    e3: L(
      "Gap perpendikulyarlik haqida emas. Bu ikki qirra uchrashadimi.",
      'Речь не о перпендикулярности. Встречаются ли эти рёбра.',
      'This is not about perpendicularity. Do these edges meet.',
    ),
    ok: L('Isbotlandi. Alomatning ikkala sharti tekshirildi, va faqat endi xulosa qonuniy.', 'Доказано. Оба условия признака проверены, и только теперь вывод законный.', 'Proved. Both conditions of the criterion are checked, and only now is the conclusion lawful.'),
  },
  reason: {
    s1: L("kub yasalishiga ko'ra", 'по построению куба', 'by the construction of the cube'),
    s2: L('perpendikulyarlik alomati', 'признак перпендикулярности', 'the criterion of perpendicularity'),
    s3: L('asos uchi umumiy', 'вершина основания общая', 'the vertex of the base is common'),
    pic: {
      label: L('perpendikulyar chiziq xossasi', 'свойство перпендикулярной прямой', 'the property of a perpendicular line'),
      missing: L('Bu xossa, alomat emas: u hali olinmagan xulosadan kelib chiqadi.', 'Это свойство, а не признак: оно следует из вывода, который ещё не получен.', 'That is a property, not the criterion: it follows from a conclusion not yet obtained.'),
    },
  },
  expr: 'AA₁ ⊥ AB,   AA₁ ⊥ AD,   AB ∩ AD = A',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Berilganiga nechta qirra perpendikulyar', 'Сколько рёбер перпендикулярно данному', 'How many edges are perpendicular to the given one'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring.", 'Прибора нет. Считай на бумаге, потом сверься.', 'No instrument here. Work it out on paper, then compare.'),
    A('next', "Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping.", 'Дальше запись с ошибкой. Найди строку, где она появилась.', 'Next comes a written solution with a mistake. Find the line where it appeared.'),
  ],
  task: {
    ok: L("Sakkizta. To'rttasi uni kesadi, to'rttasi to'g'ri burchak ostida ayqash.", 'Восемь. Четыре пересекают его, четыре скрещиваются с ним под прямым углом.', 'Eight. Four cross it and four are skew to it at a right angle.'),
    hint: [
      L("Ayqash qirralar ham perpendikulyar bo'ladi.", 'Перпендикулярными бывают и скрещивающиеся рёбра.', 'Skew edges can be perpendicular too.'),
      L("Qirralar jami o'n bitta, parallellari uchta.", 'Всего рёбер одиннадцать, параллельных три.', 'Eleven edges in all, three of them parallel.'),
      L('Sakkiz.', 'Восемь.', 'Eight.'),
    ],
    prompt: 'AB ⊥ ?',
    answer: '8',
  },
  order: {
    prompt: L("Yozuvlarni javobi o'sishi bo'yicha joylashtiring", 'Расставь записи по возрастанию ответа', 'Put the writings in order of increasing answer'),
    title: L('kichik sondan kattasiga', 'от меньшего числа к большему', 'from the smallest number to the largest'),
    ok: L("To'g'ri. Perpendikulyar qirralar qolganlarining hammasidan ko'p.", 'Верно. Перпендикулярных рёбер больше, чем всех остальных вместе.', 'Correct. There are more perpendicular edges than all the rest together.'),
    bad: L('Har yozuvni alohida hisoblang.', 'Считай каждую запись отдельно.', 'Compute each writing separately.'),
    items: ['ABCDA₁B₁C₁D₁', 'AB ⊥ ?', 'AB ∥ ?', 'AB ∸ ?'],
    answer: 'AB ∥ ?  AB ∸ ?  ABCDA₁B₁C₁D₁  AB ⊥ ?',
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
    A('mount', "To'rt qator. Yozuvdagi barcha burchaklar to'g'ri, xulosa esa yo'q.", 'Четыре строки. Все углы в записи верные, а вывод нет.', 'Four lines. Every angle in the writing is right, and the conclusion is not.'),
    A('next', 'Keyin teskari masala: xulosaga qarab yetishmayotgan shartni ayting.', 'Дальше обратная задача: по выводу назови недостающее условие.', 'Next comes the reverse task: name the missing condition from the conclusion.'),
  ],
  hint: {
    r1: L("Shart to'g'ri ko'chirilgan.", 'Условие переписано верно.', 'The condition is copied correctly.'),
    r2: L("Bu to'g'ri burchak haqiqatan bor.", 'Этот прямой угол действительно есть.', 'This right angle does exist.'),
    r3: L("O'zingizdan so'rang: shu paytgacha nechta chiziq tekshirilgan?", 'Спроси себя, сколько прямых проверено к этому моменту.', 'Ask yourself how many lines have been checked by this point.'),
  },
  proof: L("Sahnani buring: bitta tekshirilgan chiziqda og'ish qoladi.", 'Поверни сцену: при одной проверенной прямой наклон остаётся.', 'Rotate the scene: with one line checked the slant remains.'),
  entry: {
    prompt: L("Tekislikning nechta chizig'i yetmadi?", 'Сколько прямых плоскости не хватило?', 'How many lines of the plane were missing?'),
    ok: L('Bittasi. Bittasi tekshirilgan edi, alomat esa ikki kesishuvchini talab qiladi.', 'Одной. Проверена была одна, а признак требует двух пересекающихся.', 'One. One was checked, and the criterion requires two crossing ones.'),
    hint: [
      L('Yozuvda nechta chiziq eslatilganini sanang.', 'Посчитай, сколько прямых упомянуто в записи.', 'Count how many lines are mentioned in the writing.'),
      L('Alomat ikkitasini talab qiladi, yozuvda esa bittasi.', 'Признак требует двух, а в записи одна.', 'The criterion requires two, and the writing has one.'),
      L('Bittasi.', 'Одной.', 'One.'),
    ],
    answer: '1',
  },
  row: {
    r1: 'b ⊂ α,   a ⊥ b',
    r2: '∠(a, b) = 90°',
    r3: 'a ⊥ α',
    r4: 'a ⊥ c   ∀c ⊂ α',
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
    A('mount', 'Endi teskarisiga. Avval xossa haqida javob bering.', 'Теперь наоборот. Сначала ответь про свойство.', 'Now the other way round. First answer about the property.'),
    A('work', 'Keyin xulosa kelib chiqadigan barcha yozuvlarni belgilang.', 'Потом отметь все записи, из которых вывод следует.', 'Then mark every writing from which the conclusion follows.'),
  ],
  multi: {
    prompt: L('Tekislikka perpendikulyarlik kelib chiqadigan barcha yozuvlarni belgilang', 'Отметь все записи, из которых следует перпендикулярность плоскости', 'Mark every writing from which perpendicularity to the plane follows'),
    title: L('ular aynan ikkita', 'их ровно два', 'there are exactly two'),
    ok: L("To'g'ri. Ikki chiziq kerak va albatta kesishuvchi.", 'Верно. Нужны две прямые и обязательно пересекающиеся.', 'Correct. Two lines are needed, and they must cross.'),
    items: [
      { id: 'c', label: 'a ⊥ b,  b ⊂ α', hint: L("Bu yerda chiziq bitta: bitta yo'nalish kam.", 'Здесь прямая одна: одного направления мало.', 'Here there is one line: one direction is not enough.') },
      { id: 'd', label: 'a ⊥ b,  a ⊥ c,  b ∥ c', hint: L("Bu yerda ikki chiziq, lekin parallel: yo'nalish yana bitta.", 'Здесь две прямые, но параллельные: направление снова одно.', 'Here there are two lines but parallel: again one direction.') },
      { id: 'a', label: 'a ⊥ b,  a ⊥ c,  b ∩ c = O', ok: true },
      { id: 'b', label: 'AA₁ ⊥ AB,  AA₁ ⊥ AD', ok: true },
    ],
  },
  entry: {
    prompt: L('Chiziq tekislikka perpendikulyar. U bu tekislikdagi nechta chiziqqa perpendikulyar EMAS?', 'Прямая перпендикулярна плоскости. Скольким прямым в этой плоскости она НЕ перпендикулярна?', 'A line is perpendicular to a plane. To how many lines in that plane is it NOT perpendicular?'),
    ok: L("Bitta ham yo'q. Bu allaqachon xossa: istisnosiz hammasiga perpendikulyar, tekshiradigan narsa yo'q.", 'Ни одной. Это уже свойство: перпендикулярна всем без исключения, и проверять нечего.', 'None. That is already the property: it is perpendicular to all of them without exception, and nothing is left to check.'),
    hint: [
      L('Alomat bir tomonga, xossa esa boshqa tomonga ishlardi.', 'Признак работал в одну сторону, а свойство в другую.', 'The criterion worked one way, the property works the other.'),
      L("Xossa shunday deydi: tekislikning istalgan chizig'iga perpendikulyar.", 'Свойство говорит: перпендикулярна любой прямой плоскости.', 'The property says: perpendicular to any line of the plane.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    expr: 'a ⊥ α   →   a ⊥ c',
    answer: '0',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'odnoy-pryamoy-hvatit',
  audio: [
    A('mount', "Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi.", 'Четыре вопроса подряд. Считается первая попытка.', 'Four questions in a row. The first attempt counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Alomat tekislikning nechta chizig'ini talab qiladi?", 'Сколько прямых плоскости требует признак?', 'How many lines of the plane does the criterion require?'),
      done: 'b ∩ c = O',
      items: [
        { id: 'a', label: L('ikki kesishuvchi', 'две пересекающиеся', 'two crossing ones'), correct: true },
        { id: 'b', label: L('bittasini', 'одну', 'one'), hint: L("Bittasida chiziq og'adi, buni burilish bilan ko'rdingiz.", 'При одной прямая наклоняется, ты видел это поворотом.', 'With one the line leans, you saw that by rotating.') },
        { id: 'c', label: L('istalgan ikkitasini', 'две любые', 'any two'), hint: L("Ikki parallel bitta yo'nalish beradi, va bu kam.", 'Две параллельные дают одно направление, и этого мало.', 'Two parallel ones give one direction, and that is not enough.') },
        { id: 'd', label: L('tekislikning barcha chiziqlarini', 'все прямые плоскости', 'all lines of the plane'), hint: L("Hammasini tekshirish kerak emas, alomatning ma'nosi shunda.", 'Все проверять не надо, в этом и смысл признака.', 'Checking all is not needed, that is the point of the criterion.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Ikki parallel chiziq xulosa uchun yetadimi?', 'Двух параллельных прямых хватает для вывода?', 'Are two parallel lines enough for the conclusion?'),
      done: 'b ∥ c',
      items: [
        { id: 'a', label: L("yo'q, ularning yo'nalishi bitta", 'нет, направление у них одно', 'no, they have one direction'), correct: true },
        { id: 'b', label: L('ha, chiziq ikkita-ku', 'да, прямых же две', 'yes, there are two lines after all'), hint: L("Chiziqlar emas, yo'nalishlar hisoblanadi.", 'Считаются направления, а не прямые.', 'Directions are counted, not lines.') },
        { id: 'c', label: L("ha, agar ular bir-biridan uzoq bo'lsa", 'да, если они далеко друг от друга', 'yes, if they are far apart'), hint: L("Ular orasidagi masofa hech nimani o'zgartirmaydi.", 'Расстояние между ними ничего не меняет.', 'The distance between them changes nothing.') },
        { id: 'd', label: L("bu tekislikka bog'liq", 'это зависит от плоскости', 'it depends on the plane'), hint: L("Tekislikning bunga aloqasi yo'q, gap yo'nalishlarda.", 'Плоскость тут ни при чём, дело в направлениях.', 'The plane is not involved, it is about directions.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Perpendikulyar va tekislikning nechta umumiy nuqtasi bor?', 'Сколько общих точек у перпендикуляра и плоскости?', 'How many common points do a perpendicular and a plane have?'),
      done: 'a ∩ α = O',
      items: [
        { id: 'a', label: L('bitta', 'одна', 'one'), correct: true, ok: L("Bitta. Perpendikulyar albatta tekislikni kesib o'tadi, va roppa-rosa bir marta.", 'Одна. Перпендикуляр обязательно пересекает плоскость, и ровно один раз.', 'One. A perpendicular necessarily crosses the plane, exactly once.') },
        { id: 'b', label: L("bitta ham yo'q", 'ни одной', 'none'), hint: L("Bitta ham yo'q parallel chiziqda bo'lardi.", 'Ни одной было бы у параллельной прямой.', 'None would belong to a parallel line.') },
        { id: 'c', label: L('ikkita', 'две', 'two'), hint: L('Ikki nuqta butun chiziqni tekislikka tortardi.', 'Две точки затянули бы всю прямую в плоскость.', 'Two points would pull the whole line into the plane.') },
        { id: 'd', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p chiziq tekislikda yotganda bo'lardi.", 'Бесконечно много было бы, если прямая лежит в плоскости.', 'Infinitely many would happen if the line lay in the plane.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Alomat o'rniga nimani olib bo'lmaydi?", 'Что нельзя брать вместо признака?', 'What must not be taken in place of the criterion?'),
      done: 'a ⊥ α   →   a ⊥ c',
      items: [
        { id: 'a', label: L('perpendikulyar chiziq xossasini', 'свойство перпендикулярной прямой', 'the property of a perpendicular line'), correct: true },
        { id: 'b', label: L('ikkinchi kesuvchi chiziqni', 'вторую пересекающую прямую', 'a second crossing line'), hint: L('Aynan uni olish kerak: bu alomatning sharti.', 'Как раз её и надо взять: это условие признака.', 'That is exactly what has to be taken: it is a condition of the criterion.') },
        { id: 'c', label: L('ikkinchi aksiomani', 'вторую аксиому', 'the second axiom'), hint: L('Aksioma doim qonuniy, undan foydalanish mumkin.', 'Аксиома законна всегда, ею пользоваться можно.', 'An axiom is always lawful, it may be used.') },
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
    A('mount', "Taxmin bitta chiziq haqida edi. Nima chiqqanini ko'ramiz.", 'Прогноз был про одну прямую. Посмотрим, что вышло.', 'The guess was about one line. Let us see how it turned out.'),
    A('next', "Bittasi kam. Ikkita kerak, va albatta kesishuvchi: bitta o'rniga ikki yo'nalish.", 'Одной мало. Нужны две, и обязательно пересекающиеся: два направления вместо одного.', 'One is not enough. Two are needed, and they must cross: two directions instead of one.'),
  ],
  can: [
    L('Bitta emas, ikki chiziqni tekshiraman', 'Проверяю две прямые, а не одну', 'I check two lines, not one'),
    L('Ular kesishadimi, qarayman', 'Смотрю, пересекаются ли они', 'I look at whether they cross'),
    L('Alomat va xossani ajrataman', 'Различаю признак и свойство', 'I tell the criterion from the property'),
    L("Xulosani shart o'rniga qo'ymayman", 'Не подставляю вывод в условие', 'I do not put the conclusion into the condition'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of problem is closed.'),
    gap: L('Bir joy takrorlashni talab qiladi: nega parallellar yetarli emas.', 'Одно место требует повтора: почему параллельных недостаточно.', 'One spot needs a second look: why parallel lines are not enough.'),
    back: L('Qoidaga va oltinchi ekranga qayting.', 'Вернись к правилу и к экрану 6.', 'Go back to the rule and to screen six.'),
  },
  bridge: L("Keyin chiziq va tekislik orasidagi burchak: u yerda proyeksiya kerak bo'ladi.", 'Дальше угол прямой с плоскостью: там понадобится проекция.', 'Next comes the angle between a line and a plane: there a projection will be needed.'),
  lifehack: L("Chiziqlarni emas, yo'nalishlarni sanang. Ikki parallel bu bitta yo'nalish.", 'Считай не прямые, а направления. Две параллельные это одно направление.', 'Count directions, not lines. Two parallel lines are one direction.'),
  sheetTitle: L('Perpendikulyarlik · shpargalka', 'Перпендикулярность · шпаргалка', 'Perpendicularity · cheat sheet'),
  sheetSrc: L('10-sinf · 40-dars', '10 класс · урок 40', 'Grade 10 · lesson 40'),
  hook: {
    a: 'a ⊥ α',
    b: 'a ⊥ α  ?',
  },
  proved: 'b ∩ c = O',
  law: 'a ⊥ b,  a ⊥ c,  b ∩ c = O   →   a ⊥ α',
  sheet: [
    'a ⊥ b,   b ⊂ α',
    'a ⊥ c,   c ⊂ α',
    'b ∩ c = O',
    'a ⊥ α',
    'a ∩ α = O',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))

// СЦЕНА УРОКА. Точка `O` в плоскости, две прямые плоскости `OM` и `ON`,
// перпендикуляр `OP` и НАКЛОННАЯ `OQ`.
//
// `OQ` подобрана честно: она перпендикулярна `OM` (её направление не имеет
// составляющей вдоль `OM`), но не перпендикулярна `ON`. Именно поэтому при
// повороте виден наклон, а угол с первой прямой остаётся прямым.
const PTS = [
  { id: 'O', at: [0, 0, 0], label: 'O' },
  { id: 'M', at: [0.95, 0, 0], label: 'M' },
  { id: 'N', at: [0, 0.95, 0], label: 'N' },
  { id: 'P', at: [0, 0, 0.95], label: 'P' },
  { id: 'Q', at: [0, 0.5, 0.8], label: 'Q' },
  // Вторая прямая, ПАРАЛЛЕЛЬНАЯ первой: направление то же, и признак не даёт
  // ничего нового (экран 6).
  { id: 'K', at: [-0.5, 0.6, 0], label: '' },
  { id: 'L', at: [0.5, 0.6, 0], label: '' },
]
const PLANE = [{ by: ['O', 'M', 'N'], dim: true }]
const GREY = '#7f8c8d'
// Одна прямая плоскости и наклонная к ней.
const ONE = [
  { from: 'O', to: 'Q' },
  { from: 'O', to: 'M', tone: GREY, w: 2 },
]
// Две ПЕРЕСЕКАЮЩИЕСЯ прямые и настоящий перпендикуляр.
const TWO = [
  { from: 'O', to: 'P' },
  { from: 'O', to: 'M', tone: GREY, w: 2 },
  { from: 'O', to: 'N', tone: GREY, w: 2 },
]
// Две ПАРАЛЛЕЛЬНЫЕ прямые и всё та же наклонная.
const PAR = [
  { from: 'O', to: 'Q' },
  { from: 'O', to: 'M', tone: GREY, w: 2 },
  { from: 'K', to: 'L', tone: GREY, w: 2 },
]

// Har KADRDA faqat o'sha kadrning nuqtalari ko'rinadi. `PTS` bitta ro'yxat --
// kesmalar va tekislik unga id bilan murojaat qiladi, -- lekin hammasini har
// kadrda chizish kerak emas: 3-ekranda savol O, Q va M haqida, ekranda esa yana
// P va nomsiz ikki nuqta turardi (metodist ko'rdi, 2026-08-20).
const HIDE_ONE = ['P', 'N', 'K', 'L']
const HIDE_TWO = ['Q', 'K', 'L']
const HIDE_PAR = ['P', 'N']

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

const PICK3 = ['a', 'b', 'c'].map((k) => {
  const v = S3.pick[k]
  return {
    id: k,
    label: v && v.label ? v.label : v,
    hint: v && v.hint ? v.hint : undefined,
    ok: k === 'b',
  }
})
const PICK4 = ['a', 'b', 'c'].map((k) => {
  const v = S4.pick[k]
  return {
    id: k,
    label: v && v.label ? v.label : v,
    hint: v && v.hint ? v.hint : undefined,
    ok: k === 'b',
  }
})

const REASONS = [
  { id: 's1', label: S10.reason.s1 },
  { id: 's2', label: S10.reason.s2 },
  { id: 's3', label: S10.reason.s3 },
  { id: 'pic', label: S10.reason.pic.label, missing: S10.reason.pic.missing },
]
// `early` -- TO'G'RI, lekin bu qatorda emas degan razbor.
//
// ASOSLASHLAR TUZATILDI. Ilgari «u ikkinchisiga ham perpendikulyar» qatori
// «asos uchi umumiy» bilan asoslanardi, bu esa mazmunan noto'g'ri: umumiy uch
// qirralarning KESISHISHINI asoslaydi. Ikki perpendikulyarlik ham kub
// yasalishidan keladi, kesishish esa umumiy uchdan.
const PROOF_ROWS = [
  { text: S10.proof.r1, reason: 's1', early: S10.proof.e1 },
  { text: S10.proof.r2, reason: 's1', early: S10.proof.e2 },
  { text: S10.proof.r3, reason: 's3', early: S10.proof.e3, ok: S10.proof.ok },
]

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Ракурс ВЫБРАН так, чтобы рёбра казались сошедшимися: прогноз делается
        // ровно на том обмане, который потом снимет поворот.
        fig={() => <Scene fig={<Space step={1} pts={PTS} planes={PLANE} segs={ONE} hide={HIDE_ONE} angleAt={{ at: 'O', from: 'Q', to: 'M' }} />} max={172} h={172} />}
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
          <Scene fig={<Space step={1} yaw={0.4} pts={PTS} planes={PLANE} segs={TWO} hide={HIDE_TWO} />} max={240} h={158} />
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
        fig={<Space step={1} yaw={phase * 0.75} pts={PTS} planes={PLANE} segs={ONE} hide={HIDE_ONE} angleAt={{ at: 'O', from: 'Q', to: 'M' }} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      /* СВИДЕТЕЛЬ УРОКА. Крутит ученик: пока он не повернул куб, «пересеклись»
         и «скрестились» на экране неотличимы. */
      <SpinScene
        scene={<Space step={1} pts={PTS} planes={PLANE} segs={ONE} hide={HIDE_ONE} angleAt={{ at: 'O', from: 'Q', to: 'M' }} />}
        prompt={S3.pick.prompt}
        options={PICK3}
        okText={S3.pick.ok}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* Кадр 1 -- ПАРАЛЛЕЛЬНАЯ пара с их общей плоскостью, кадр 2 -- наша.
         Различие видно только в том, есть ли плоскость. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.5} pts={PTS} planes={PLANE} segs={TWO} hide={HIDE_TWO}
            angleAt={{ at: 'O', from: 'P', to: phase === 0 ? 'M' : 'N' }}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={<Space step={1} pts={PTS} planes={PLANE} segs={TWO} hide={HIDE_TWO} angleAt={{ at: 'O', from: 'P', to: 'N' }} />}
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
        fig={<Space step={1} yaw={phase * 0.6} pts={PTS} planes={PLANE} segs={TWO} hide={HIDE_TWO} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.6} pts={PTS} planes={PLANE} segs={TWO} hide={HIDE_TWO} />} max={300} /></Col>
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
      /* Подсветка переезжает: сначала параллельные данному ребру, потом
         пересекающие. Остаток и есть ответ. */
      <Scene
        fig={<Space step={1} yaw={phase * 0.7} pts={PTS} planes={PLANE} segs={PAR} hide={HIDE_PAR} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.7} pts={PTS} planes={PLANE} segs={PAR} hide={HIDE_PAR} />} max={300} /></Col>
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
      /* ПЕРЕНОС на глазах: верхнее ребро опускается на нижнюю грань, и угол
         становится обычным углом двух пересекающихся рёбер. */
      <Scene
        fig={(
          <Space
            step={1} yaw={phase * 0.6} pts={PTS} planes={PLANE} segs={TWO} hide={HIDE_TWO}
            angleAt={{ at: 'O', from: 'P', to: 'M' }}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene
            fig={<Space step={1} yaw={0.6} pts={PTS} planes={PLANE} segs={TWO} hide={HIDE_TWO} angleAt={{ at: 'O', from: 'P', to: 'M' }} />}
            max={300}
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
            fig={<Space step={1} yaw={solved ? 0.8 : 0} pts={PTS} planes={PLANE} segs={solved ? TWO : ONE} hide={solved ? HIDE_TWO : HIDE_ONE} angleAt={{ at: 'O', from: solved ? 'P' : 'Q', to: 'M' }} />}
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
            <Expr size="mid">{S13.entry.expr}</Expr>
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
            fig={<Space step={1} yaw={round * 0.4} pts={PTS} planes={PLANE} segs={round === 1 ? PAR : TWO} hide={round === 1 ? HIDE_PAR : HIDE_TWO} />}
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
