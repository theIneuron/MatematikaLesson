// ============================================================================
// 10-sinf, Dars 29. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS29_KONTENT.md
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
const LESSON_NO = 29
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Ayqash to'g'ri chiziqlar`,
  `Урок ${LESSON_NO}. Скрещивающиеся`,
  `Lesson ${LESSON_NO}. Skew lines`,
)

const BLOCK = { label: 'B6', from: 28, to: 36, current: 29 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('KUB', 'КУБ', 'THE CUBE'),
  title: L("Kesishadimi yoki yo'q", 'Пересекаются или нет', 'Do they meet or not'),
  audio: [
    A('mount', "Kubning ikki qirrasi yoritilgan. Bu chizmada ular uchrashayotgandek ko'rinadi.", 'Два ребра куба подсвечены. На этом чертеже они выглядят так, будто встречаются.', 'Two edges of the cube are highlighted. On this drawing they look as if they meet.'),
    A('r1', 'Birinchi yozuv chizmaga ishonadi: qirralar tutashadi, demak kesishadi.', 'Первая запись верит чертежу: рёбра сходятся, значит пересекаются.', 'The first reading trusts the drawing: the edges come together, so they meet.'),
    A('r2', "Ikkinchisi umumiy nuqta yo'q va ular parallel ham emas deydi.", 'Вторая говорит, что общей точки нет и параллельными они тоже не являются.', 'The second says there is no common point and they are not parallel either.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi kubni buramiz.', 'Твой ответ записан. Сейчас повернём куб.', 'Your answer is saved. Now we will rotate the cube.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('kesishadi', 'пересекаются', 'they meet'),
      value: 'AB ∩ B₁C₁ = M',
    },
    b: {
      name: L('kesishmaydi va parallel emas', 'не пересекаются и не параллельны', 'they neither meet nor are parallel'),
      value: 'AB ∸ B₁C₁',
    },
  },
  expr: 'AB,  B₁C₁',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Kubdan oldin uch savol', 'Три вопроса перед кубом', 'Three questions before the cube'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Ikki kesishuvchi to'g'ri chiziq orqali nechta tekislik o'tadi?", 'Сколько плоскостей проходит через две пересекающиеся прямые?', 'How many planes pass through two intersecting lines?'),
      done: 'a ∩ b = M   →   α',
      items: [
        { id: 'a', label: L('bitta', 'одна', 'one'), correct: true },
        { id: 'b', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p bitta to'g'ri chiziq orqali o'tadi, bu yerda esa ikkita.", 'Бесконечно много проходит через одну прямую, а тут их две.', 'Infinitely many pass through one line, and here there are two.') },
        { id: 'c', label: L("bitta ham yo'q", 'ни одной', 'none'), hint: L('Kesishish nuqtasi va har chiziqdan bittadan nuqta allaqachon tekislikni beradi.', 'Точка пересечения и по точке с каждой прямой уже задают плоскость.', 'The meeting point plus a point on each line already fix a plane.') },
        { id: 'd', label: L('ikkita', 'две', 'two'), hint: L("Ular orqali ikki xil tekislik o'tkazib bo'lmaydi.", 'Двух разных плоскостей через них не провести.', 'Two different planes cannot be drawn through them.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Ikki parallel to'g'ri chiziq qayerda yotadi?", 'Где лежат две параллельные прямые?', 'Where do two parallel lines lie?'),
      done: 'a ∥ b   →   α',
      items: [
        { id: 'a', label: L('bitta tekislikda', 'в одной плоскости', 'in one plane'), correct: true },
        { id: 'b', label: L('har xil tekisliklarda', 'в разных плоскостях', 'in different planes'), hint: L("U holda ular parallel bo'lmasdi: parallellik tekislikda aniqlangan.", 'Тогда они не были бы параллельными: параллельность определена в плоскости.', 'Then they would not be parallel: parallelism is defined in a plane.') },
        { id: 'c', label: L("bu noma'lum", 'это неизвестно', 'that is unknown'), hint: L("Bu aniq ma'lum, va bu ta'rifning bir qismi.", 'Это известно точно, и это часть определения.', 'It is known exactly, and it is part of the definition.') },
        { id: 'd', label: L('doim gorizontalda', 'всегда в горизонтальной', 'always in a horizontal one'), hint: L("Tekislik istalgancha bo'lishi mumkin, muhimi u bitta.", 'Плоскость может быть какой угодно, важно что она одна.', 'The plane can be any, what matters is that it is one.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Uchinchi aksioma nima deydi?', 'Что говорит третья аксиома?', 'What does the third axiom say?'),
      done: 'α ∩ β = a',
      items: [
        { id: 'a', label: L("umumiy nuqtali ikki tekislikning umumiy to'g'ri chizig'i bor", 'у двух плоскостей с общей точкой есть общая прямая', 'two planes with a common point share a line'), correct: true },
        { id: 'b', label: L('ikki tekislik doim kesishadi', 'две плоскости всегда пересекаются', 'two planes always meet'), hint: L("Umuman umumiy nuqtasi bo'lmasligi ham mumkin.", 'Могут и не иметь общих точек вовсе.', 'They may have no common points at all.') },
        { id: 'c', label: L("uch nuqta orqali tekislik o'tadi", 'через три точки проходит плоскость', 'a plane passes through three points'), hint: L('Bu birinchi aksioma, savol esa uchinchisi haqida.', 'Это первая аксиома, а спросили про третью.', 'That is the first axiom, and the question is about the third.') },
        { id: 'd', label: L("to'g'ri chiziq tekislikda yotadi", 'прямая лежит в плоскости', 'a line lies in a plane'), hint: L('Bu ikkinchi aksioma.', 'Это вторая аксиома.', 'That is the second axiom.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Kubni burib qirralarga qarang', 'Поверни куб и посмотри на рёбра', 'Rotate the cube and look at the edges'),
  tag: 'kartinka-kak-dokazatelstvo',
  show: [
    [
      L('bu chizmada qirralar kesishdi', 'на этом чертеже рёбра пересеклись', 'on this drawing the edges cross'),
      L('ularning umumiy nuqtasi bordek tuyuladi', 'кажется, что у них есть общая точка', 'it seems they have a common point'),
      L('kubni buring va ularni kuzating', 'поверни куб и следи за ними', 'rotate the cube and watch them'),
    ],
    [
      L('qirralar ajraldi', 'рёбра разошлись', 'the edges came apart'),
      L('biri pastdan, ikkinchisi tepadan boradi', 'одно идёт понизу, другое поверху', 'one runs below, the other above'),
      L("umumiy nuqta bitta ham yo'q", 'общей точки нет ни одной', 'there is not a single common point'),
    ],
  ],
  motion: ['spin'],
  audio: [
    A('mount', 'Kubning ikki qirrasi. Chizma qimirlamas ekan, ular haqida istalgan narsani aytish mumkin.', 'Два ребра куба. Пока чертёж неподвижен, про них можно сказать что угодно.', 'Two edges of the cube. While the drawing stands still, anything can be said about them.'),
    A('spin', "Kubni buring va yoritilgan qirralarni kuzating. Birinchisi pastki yoq bo'ylab, ikkinchisi yuqorigi bo'ylab boradi, va kub burilishi bilan ular orasida masofa ko'rindi. Ularning umumiy nuqtasi yo'q: bir qirra ikkinchisidan pastroqdan o'tadi. Birinchi chizmada ular faqat qulay yo'nalish bo'ylab qaraganimiz uchun tutashgandek ko'ringan. Darsning asosiy xulosasi shu, va u qirralar haqida emas. Fazoning yassi chizmasida kesishishni u yo'q joyda ham ko'rish mumkin. Bu diqqat bilan emas, burilish bilan tekshiriladi.", 'Поверни куб и следи за подсвеченными рёбрами. Первое идёт по нижней грани, второе по верхней, и как только куб развернулся, между ними стало видно расстояние. Общей точки у них нет: одно ребро проходит ниже другого. На первом чертеже они казались сошедшимися только потому, что мы смотрели вдоль удачного направления. Вот главный вывод урока, и он не про рёбра. На плоском чертеже пространства пересечение можно увидеть там, где его нет. Проверяется это поворотом, а не внимательностью.', 'Rotate the cube and watch the highlighted edges. The first runs along the bottom face, the second along the top, and as soon as the cube turned, a distance appeared between them. They have no common point: one edge passes below the other. On the first drawing they seemed to meet only because we were looking along a convenient direction. Here is the main conclusion of the lesson, and it is not about edges. On a flat drawing of space you can see an intersection where there is none. This is checked by rotating, not by being careful.'),
    A('work', "O'zingiz hisoblang. Bu ikki qirraning nechta umumiy nuqtasi bor?", 'Посчитай сам. Сколько общих точек у этих двух рёбер?', 'Work it out yourself. How many common points do these two edges have?'),
  ],
  work: {
    prompt: L('Ularning nechta umumiy nuqtasi bor?', 'Сколько у них общих точек?', 'How many common points do they have?'),
    ok: L("Bitta ham yo'q. Bir qirra ikkinchisidan pastroqdan o'tadi, burilish buni ko'rsatdi.", 'Ни одной. Одно ребро проходит ниже другого, и поворот это показал.', 'None. One edge passes below the other, and the rotation showed it.'),
    hint: [
      L('Kubni buring va qirralar uchrashadimi, qarang.', 'Поверни куб и посмотри, встречаются ли рёбра.', 'Rotate the cube and see whether the edges meet.'),
      L('Bir qirra pastki yoqda, ikkinchisi yuqorigida.', 'Одно ребро на нижней грани, другое на верхней.', 'One edge is on the bottom face, the other on the top.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Bular ham kesishmaydi, lekin parallel emas', 'Тоже не пересекаются, но не параллельны', 'They do not meet either, but are not parallel'),
  tag: 'ayqash-kak-parallel',
  show: [
    [
      L("parallellarning ham umumiy nuqtasi yo'q", 'у параллельных общих точек тоже нет', 'parallel lines have no common points either'),
      L('lekin ular bitta tekislikda yotadi', 'но они лежат в одной плоскости', 'but they lie in one plane'),
      L("bu tekislikni o'tkazish mumkin", 'эту плоскость можно провести', 'that plane can be drawn'),
    ],
    [
      L("bizning qirralar uchun bunday tekislik yo'q", 'для наших рёбер такой плоскости нет', 'for our edges there is no such plane'),
      L('birorta tekislik ikkalasini ham saqlamaydi', 'ни одна плоскость не содержит оба', 'no plane contains both of them'),
      L("ayqash to'g'ri chiziqlar shu", 'это и есть скрещивающиеся', 'these are exactly skew lines'),
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', "Umumiy nuqtaning yo'qligi hali hech nimani hal qilmaydi. Parallellar ham kesishmaydi.", 'Отсутствие общих точек ещё ничего не решает. Параллельные тоже не пересекаются.', 'Having no common points settles nothing yet. Parallel lines do not meet either.'),
    A('two', "Avval pastki yoqning bir-biriga qarama-qarshi yotgan ikki qirrasini olamiz. Ularning umumiy nuqtasi yo'q, butun pastki yoq esa ikkalasi yotgan tekislik. Bular parallel. Endi o'z qirralarimizga qaytamiz. Umumiy nuqta ham yo'q, lekin ikkalasi yotadigan tekislikni topib ko'ring. Kubni buring va qarang: bir qirra pastda, ikkinchisi tepada, va hech qanday tekislik ularni yig'a olmaydi. Bitta tekislikda yotmaydigan to'g'ri chiziqlar ayqash deyiladi. Bu uchinchi hol, va tekislikda u umuman bo'lmaydi: u yerda istalgan ikki chiziq yo kesishadi, yo parallel.", 'Возьмём сначала два ребра нижней грани, которые лежат друг напротив друга. Общих точек у них нет, и вся нижняя грань это плоскость, в которой лежат оба. Это параллельные. Теперь вернёмся к нашим рёбрам. Общих точек тоже нет, но попробуй найти плоскость, в которой лежали бы оба. Поворачивай куб и смотри: одно ребро внизу, другое наверху, и никакая плоскость их не соберёт. Прямые, которые не лежат в одной плоскости, называются скрещивающимися. Это третий случай, и на плоскости его не бывает вовсе: там любые две прямые либо пересекаются, либо параллельны.', 'First take two edges of the bottom face lying opposite each other. They have no common points, and the whole bottom face is a plane containing both. These are parallel. Now back to our edges. There are no common points either, but try to find a plane containing both. Rotate the cube and look: one edge is below, the other above, and no plane will gather them. Lines that do not lie in one plane are called skew. This is the third case, and on a plane it does not occur at all: there any two lines either meet or are parallel.'),
    A('work', 'Kubni buring va javob bering: bu qirralar parallellardan nimasi bilan farq qiladi?', 'Поверни куб и ответь: чем эти рёбра отличаются от параллельных?', 'Rotate the cube and answer: how do these edges differ from parallel ones?'),
  ],
  pick: {
    prompt: L('Ular parallellardan nimasi bilan farq qiladi?', 'Чем они отличаются от параллельных?', 'How do they differ from parallel ones?'),
    a: {
      label: L('ularning umumiy nuqtasi bor', 'у них есть общая точка', 'they have a common point'),
      hint: L("Umumiy nuqta yo'q, uni o'zingiz burib izladingiz.", 'Общей точки нет, ты сам её искал поворотом.', 'There is no common point, you looked for it by rotating yourself.'),
    },
    b: L("umumiy tekislik yo'q", 'нет общей плоскости', 'there is no common plane'),
    c: {
      label: L('ular har xil uzunlikda', 'они разной длины', 'they have different lengths'),
      hint: L('Kubning barcha qirralari teng, gap uzunlikda emas.', 'У куба все рёбра равны, а дело не в длине.', 'All edges of a cube are equal, and length is not the point.'),
    },
    ok: L("To'g'ri. Umumiy tekislik parallellarda va kesishuvchilarda bor, bularda esa yo'q.", 'Верно. Общая плоскость есть у параллельных и у пересекающихся, а у этих её нет.', 'Correct. Parallel and intersecting lines have a common plane, these do not.'),
  },
  mark: 'AB ∸ B₁C₁',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Alomat: qanday aniq bilish mumkin', 'Признак: как узнать наверняка', 'The criterion: how to know for sure'),
  tag: 'ayqash-kak-parallel',
  show: [
    [
      L("bir to'g'ri chiziq tekislikda yotadi", 'одна прямая лежит в плоскости', 'one line lies in a plane'),
      L("ikkinchisi bu tekislikni kesib o'tadi", 'вторая пересекает эту плоскость', 'the second crosses that plane'),
      L('kesishish nuqtasi birinchi chiziqda emas', 'точка пересечения не на первой прямой', 'the crossing point is not on the first line'),
    ],
    [
      L('bu xulosa uchun yetarli', 'этого хватает для вывода', 'that is enough for the conclusion'),
      L("to'g'ri chiziqlar ayqash", 'прямые скрещиваются', 'the lines are skew'),
      L('burilish endi kerak emas', 'поворот больше не нужен', 'no rotation is needed any more'),
    ],
  ],
  motion: ['sign'],
  audio: [
    A('mount', "Burilish qirralar ayqash ekanini ko'rsatdi. Lekin har safar burib bo'lmaydi: alomat kerak.", 'Поворот показал, что рёбра скрещиваются. Но крутить каждый раз нельзя: нужен признак.', 'The rotation showed the edges are skew. But rotating every time is not an option: a criterion is needed.'),
    A('sign', "Alomat shunday. Birinchi to'g'ri chiziq biror tekislikda yotsin, ikkinchisi esa bu tekislikni birinchi chiziqda yotmagan nuqtada kesib o'tsin. U holda chiziqlar ayqash bo'ladi. Nega ekanini ko'ring. Agar ular bitta tekislikda yotganda, bu tekislik birinchi chiziqni ham, o'sha kesishish nuqtasini ham saqlardi. Lekin bunday tekislik allaqachon bor, va u boshidanoq olingan. Demak ikki tekislik ustma-ust tushardi, ikkinchi chiziq esa butunlay dastlabkisiga yotardi. U esa uni kesib o'tadi, ya'ni unda yotmaydi. Ziddiyat. Endi burilish kerak emas: uch shart tekshirildi va xulosa mulohaza bilan chiqarildi.", 'Признак такой. Пусть первая прямая лежит в некоторой плоскости, а вторая пересекает эту плоскость в точке, которая на первой прямой не лежит. Тогда прямые скрещиваются. Посмотри, почему. Если бы они лежали в одной плоскости, то эта плоскость содержала бы и первую прямую, и ту точку пересечения. Но такая плоскость уже есть, и она у нас взята с самого начала. Значит две плоскости совпали бы, и вторая прямая целиком легла бы в исходную. А она её пересекает, то есть в ней не лежит. Противоречие. Теперь поворот не нужен: три условия проверены, и вывод сделан рассуждением.', 'The criterion goes like this. Let the first line lie in some plane, and let the second cross that plane at a point not lying on the first line. Then the lines are skew. See why. If they lay in one plane, that plane would contain both the first line and the crossing point. But such a plane already exists, it was taken from the start. So the two planes would coincide and the second line would lie entirely in the original one. Yet it crosses it, that is, does not lie in it. A contradiction. Now no rotation is needed: three conditions were checked and the conclusion came by reasoning.'),
    A('work', "O'zingiz hisoblang. Alomatni qo'llash uchun nechta shartni tekshirish kerak?", 'Посчитай сам. Сколько условий надо проверить, чтобы применить признак?', 'Work it out yourself. How many conditions must be checked to apply the criterion?'),
  ],
  work: {
    prompt: L('Alomatning nechta sharti bor?', 'Сколько условий у признака?', 'How many conditions does the criterion have?'),
    ok: L('Uchta. Birinchisi tekislikda, ikkinchisi uni kesadi, kesishish nuqtasi birinchisida emas.', 'Три. Первая в плоскости, вторая пересекает её, точка пересечения не на первой.', 'Three. The first is in the plane, the second crosses it, and the crossing point is not on the first.'),
    hint: [
      L("Alomatni qayta o'qing va undagi talablarni sanang.", 'Перечитай признак и посчитай, сколько в нём требований.', 'Read the criterion again and count the requirements in it.'),
      L('Kesishish nuqtasi haqidagi oxirgi shart ham sanaladi.', 'Последнее условие про точку пересечения тоже считается.', 'The last condition about the crossing point counts too.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    expr: 'a ⊂ α,   b ∩ α = M,   M ∉ a',
    answer: '3',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Kubda sanang', 'Посчитай на кубе', 'Count it on the cube'),
  tag: 'ayqash-kak-parallel',
  show: [
    [
      L("kubning o'n ikki qirrasi bor", 'у куба двенадцать рёбер', 'a cube has twelve edges'),
      L('ulardan bittasi olingan', 'одно из них взято', 'one of them is taken'),
      L("qolgan o'n bittasini ajratish kerak", 'остальные одиннадцать надо разобрать', 'the remaining eleven have to be sorted'),
    ],
    [
      L('uchta qirra unga parallel', 'три ребра ему параллельны', 'three edges are parallel to it'),
      L("to'rttasi uni kesadi", 'четыре его пересекают', 'four cross it'),
      L('qolganlari ayqash', 'остальные скрещиваются', 'the rest are skew'),
    ],
  ],
  motion: ['count'],
  audio: [
    A('mount', "Endi o'zingiz sanang. Bir qirrani olamiz va qolganlarini hollarga ajratamiz.", 'Теперь считай сам. Возьмём ребро и разберём все остальные по случаям.', 'Now count for yourself. Take an edge and sort all the rest by case.'),
    A('count', "Kubning o'n ikki qirrasi bor. Bittasini oldik, o'n bittasi qoldi, va har biri uch holdan roppa-rosa bittasiga tushadi. Qirramizga parallel uchta: o'sha yoqdagi qarama-qarshisi va qarama-qarshi yoqdagi ikkitasi. Kesuvchisi to'rtta: har uchidan ikkitadan. Uch bilan to'rtni qo'shing, o'n birdan ayiring, va uchinchi holga nechta qolishi chiqadi. Bunda kubni burish mumkin va kerak: burmaguningizcha to'rtinchi va beshinchi qirrani chalkashtirish oson.", 'У куба двенадцать рёбер. Одно мы взяли, осталось одиннадцать, и каждое попадает ровно в один из трёх случаев. Параллельных нашему ребру три: противоположное на той же грани и два на противоположной. Пересекающих четыре: по два с каждого конца. Сложи три и четыре, вычти из одиннадцати, и получится, сколько остаётся на третий случай. Крутить куб при этом можно и нужно: пока не повернёшь, четвёртое и пятое ребро легко перепутать.', 'A cube has twelve edges. We took one, eleven are left, and each falls into exactly one of the three cases. Three are parallel to our edge: the opposite one on the same face and two on the opposite face. Four cross it: two at each end. Add three and four, subtract from eleven, and you get how many are left for the third case. Rotating the cube here is allowed and needed: until you turn it, the fourth and fifth edges are easy to confuse.'),
    A('work', "O'zingiz hisoblang. Berilgan qirra bilan nechta qirra ayqash?", 'Посчитай сам. Сколько рёбер скрещивается с данным?', 'Work it out yourself. How many edges are skew to the given one?'),
  ],
  work: {
    prompt: L('Berilgan bilan nechta qirra ayqash?', 'Сколько рёбер скрещивается с данным?', 'How many edges are skew to the given one?'),
    ok: L("To'rtta. O'n bir minus uchta parallel minus to'rtta kesuvchi.", 'Четыре. Одиннадцать минус три параллельных минус четыре пересекающих.', 'Four. Eleven minus three parallel minus four crossing.'),
    hint: [
      L("Qirralar jami o'n ikkita, o'zimiznikini sanamaymiz.", 'Всего рёбер двенадцать, наше не считаем.', 'There are twelve edges in all, ours is not counted.'),
      L("Parallellari uchta, kesuvchilari to'rtta.", 'Параллельных три, пересекающих четыре.', 'Three are parallel, four cross it.'),
      L("To'rt.", 'Четыре.', 'Four.'),
    ],
    expr: '11 − 3 − 4',
    answer: '4',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARAVIY HOL', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Uchrashmaydigan narsalar orasidagi burchak', 'Угол между тем, что не встречается', 'The angle between things that never meet'),
  tag: 'ugol-ne-s-proekciey',
  show: [
    [
      L('qirralar uchrashmaydi', 'рёбра не встречаются', 'the edges do not meet'),
      L("ular orasida burchak yo'qdek", 'угла между ними будто и нет', 'it seems there is no angle between them'),
      L('lekin u bor, va u aniqlanadi', 'но он есть, и его определяют', 'but there is one, and it is defined'),
    ],
    [
      L("bir chiziq parallel ko'chiriladi", 'одну прямую переносят параллельно', 'one line is moved parallel to itself'),
      L('endi chiziqlar kesishadi', 'теперь прямые пересекаются', 'now the lines meet'),
      L('ularning burchagi izlangani', 'их угол и есть искомый', 'their angle is the one sought'),
    ],
  ],
  motion: ['angle'],
  audio: [
    A('mount', 'Darsning oxirgi holi. Ayqash chiziqlarda ham burchak bor.', 'Последний случай урока. У скрещивающихся прямых тоже есть угол.', 'The last case of the lesson. Skew lines have an angle too.'),
    A('angle', "Uchrashmaydigan chiziqlar orasidagi burchakni to'g'ridan aniqlab bo'lmaydi: uning uchi yo'q. Darslik shunday qiladi. Chiziqlardan biri ikkinchisini kesguncha parallel ko'chiriladi va hosil bo'lgan kesishuvchi chiziqlar orasidagi burchak olinadi. U ayqash chiziqlar orasidagi burchak deyiladi. Muhimi, u ko'chirish joyiga bog'liq emas: parallel chiziqlar bir xil burchak beradi. Qirralarimizni olamiz. Yuqorigisini pastga, pastki yoqqa ko'chiramiz va u pastkisi bilan qanday burchak hosil qilishiga qaraymiz. Bu yerda nimaga qarab bo'lmasligi ham muhim: ular chizmada hosil qilgan burchakka. Bu proyeksiyalar orasidagi burchak, chiziqlar orasidagi emas, va u har burilishda o'zgaradi.", 'Определить угол между прямыми, которые не встречаются, напрямую нельзя: вершины у него нет. Учебник делает так. Одну из прямых переносят параллельно, пока она не пересечёт вторую, и берут угол между получившимися пересекающимися прямыми. Он и называется углом между скрещивающимися. Важно, что от выбора места переноса он не зависит: параллельные прямые дают один и тот же угол. Возьмём наши рёбра. Перенесём верхнее вниз, к нижней грани, и посмотрим, какой угол оно образует с нижним. И вот на что здесь смотреть нельзя: на угол, который они образуют на чертеже. Это угол между проекциями, а не между прямыми, и он меняется при каждом повороте.', 'The angle between lines that never meet cannot be defined directly: it has no vertex. The textbook does this. One of the lines is moved parallel to itself until it crosses the second, and the angle between the resulting intersecting lines is taken. That is called the angle between the skew lines. Importantly, it does not depend on where the shift is made: parallel lines give the same angle. Take our edges. Move the upper one down to the bottom face and see what angle it makes with the lower one. And here is what must not be looked at: the angle they make on the drawing. That is the angle between projections, not between lines, and it changes with every rotation.'),
    A('work', "O'zingiz hisoblang. Bu qirralar orasidagi burchak necha gradus?", 'Посчитай сам. Чему равен угол между этими рёбрами в градусах?', 'Work it out yourself. What is the angle between these edges in degrees?'),
  ],
  work: {
    prompt: L('Ular orasidagi burchak nechaga teng?', 'Чему равен угол между ними?', 'What is the angle between them?'),
    ok: L("To'qson. Ko'chirgandan keyin qirralar to'g'ri burchak ostida tutashadi, yoqning qo'shni qirralaridek.", 'Девяносто. После переноса рёбра сходятся под прямым углом, как соседние рёбра грани.', 'Ninety. After the shift the edges meet at a right angle, like neighbouring edges of a face.'),
    hint: [
      L("Yuqorigi qirrani pastga, pastki yoqqa ko'chiring.", 'Перенеси верхнее ребро вниз, к нижней грани.', 'Move the upper edge down to the bottom face.'),
      L("Kubning bir yog'ining qo'shni qirralari perpendikulyar.", 'Соседние рёбра одной грани куба перпендикулярны.', 'Neighbouring edges of one face of a cube are perpendicular.'),
      L("To'qson.", 'Девяносто.', 'Ninety.'),
    ],
    expr: 'AB ∸ B₁C₁',
    answer: '90',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Uch hol va alomat', 'Три случая и признак', 'Three cases and the criterion'),
  tag: 'ayqash-kak-parallel',
  motion: ['rule'],
  audio: [
    A('mount', "Qoidani yig'amiz. Hol uchta, ularni nuqta emas, tekislik ajratadi.", 'Соберём правило. Случаев три, и различает их плоскость, а не точка.', 'Let us put the rule together. There are three cases, and it is the plane that tells them apart, not the point.'),
    A('rule', "Birinchi hol: chiziqlar kesishadi. Ularning umumiy nuqtasi bor va ular orqali yagona tekislik o'tadi. Ikkinchi: chiziqlar parallel. Umumiy nuqta yo'q, lekin umumiy tekislik bor, u ham yagona. Uchinchi: chiziqlar ayqash. Na umumiy nuqta, na umumiy tekislik bor, va bu hol tekislikda umuman bo'lmaydi. Ularni nuqta bo'yicha ajratib bo'lmaydi: ikkinchi va uchinchi holda nuqta bir xil yo'q. Tekislik ajratadi. Har safar burmaslik uchun esa alomat bor: agar bir chiziq tekislikda yotsa, ikkinchisi esa bu tekislikni birinchi chiziqdan tashqarida kesib o'tsa, ular ayqash bo'ladi.", 'Первый случай: прямые пересекаются. У них есть общая точка, и через них проходит единственная плоскость. Второй: прямые параллельны. Общей точки нет, но общая плоскость есть, и она тоже единственная. Третий: прямые скрещиваются. Нет ни общей точки, ни общей плоскости, и этого случая на плоскости не бывает вовсе. Различать их по точкам нельзя: у второго и третьего случая точек нет одинаково. Различает плоскость. А чтобы не крутить каждый раз, есть признак: если одна прямая лежит в плоскости, а вторая пересекает эту плоскость вне первой прямой, то они скрещиваются.', 'First case: the lines meet. They have a common point and a unique plane passes through them. Second: the lines are parallel. There is no common point but there is a common plane, also unique. Third: the lines are skew. There is neither a common point nor a common plane, and this case does not occur on a plane at all. They cannot be told apart by points: the second and third case have no points alike. It is the plane that tells them apart. And so as not to rotate every time there is a criterion: if one line lies in a plane and the second crosses that plane outside the first line, then they are skew.'),
  ],
  probe: {
    question: L('Ayqash chiziqlar parallellardan nimasi bilan farq qiladi?', 'Чем скрещивающиеся отличаются от параллельных?', 'How do skew lines differ from parallel ones?'),
    items: [
      { id: 'a', label: L("ikkalasini saqlaydigan tekislik yo'q", 'нет плоскости, содержащей обе', 'there is no plane containing both'), correct: true },
      { id: 'b', label: L("umumiy nuqta yo'q", 'нет общих точек', 'there are no common points'), hint: L("Umumiy nuqta parallellarda ham yo'q, bu bilan ularni ajratib bo'lmaydi.", 'Общих точек нет и у параллельных, этим их не различить.', 'Parallel lines have no common points either, that does not tell them apart.') },
    ],
  },
  rule: {
    lawLabel: L('UCH HOL', 'ТРИ СЛУЧАЯ', 'THE THREE CASES'),
    lines: [
      L('kesishadi: umumiy nuqta va umumiy tekislik', 'пересекаются: общая точка и общая плоскость', 'they meet: a common point and a common plane'),
      L("parallel: umumiy nuqta yo'q, umumiy tekislik bor", 'параллельны: общей точки нет, общая плоскость есть', 'parallel: no common point, but a common plane'),
      L('ayqash: na unisi, na bunisi', 'скрещиваются: нет ни того, ни другого', 'skew: neither of the two'),
    ],
    law: 'a ⊂ α,   b ∩ α = M,   M ∉ a   →   a ∸ b',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  title: L("Kub bo'yicha sanang", 'Посчитай по кубу', 'Count on the cube'),
  tag: 'ayqash-kak-parallel',
  audio: [
    A('mount', "Kub haqida to'rt yozuv. Xayolda hisoblang, AB qirrasini ko'z oldingizda tuting.", 'Четыре записи про куб. Считай в уме, ребро AB держи перед глазами.', 'Four writings about the cube. Count in your head, keep edge AB in view.'),
  ],
  match: {
    prompt: L("To'rt javobning hammasi har xil", 'Все четыре ответа разные', 'All four answers are different'),
    ok: L("To'g'ri. O'n bir qirra uch guruhga bo'linadi, va birortasi guruhsiz qolmaydi.", 'Верно. Одиннадцать рёбер делятся на три группы, и ни одно не остаётся без группы.', 'Correct. Eleven edges split into three groups, and none is left out.'),
    left: ['AB ∸ ?', 'AB ∥ ?', 'AB ∩ CC₁', 'ABCDA₁B₁C₁D₁'],
    a: '4',
    b: '3',
    c: '0',
    d: '12',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Qirralar ayqash ekanini isbotlang', 'Докажи, что рёбра скрещиваются', 'Prove the edges are skew'),
  tag: 'ayqash-kak-parallel',
  audio: [
    A('mount', "Endi burilishsiz isbotlaymiz. Har qatorning asoslashi ro'yxatdan tanlanadi.", 'Теперь докажем без поворота. Обоснование каждой строки выбирается из списка.', 'Now let us prove it without rotating. The justification of each line is chosen from the list.'),
  ],
  proof: {
    given: L('pastki yoq qirrasi va yuqorigi yoq qirrasi', 'ребро нижней грани и ребро верхней', 'an edge of the bottom face and an edge of the top'),
    goal: L('ular ayqash', 'они скрещиваются', 'they are skew'),
    r1: L('pastki qirra pastki yoq tekisligida yotadi', 'нижнее ребро лежит в плоскости нижней грани', 'the bottom edge lies in the plane of the bottom face'),
    r2: L("yuqorigi qirra bu tekislikni kesib o'tadi", 'верхнее ребро пересекает эту плоскость', 'the top edge crosses that plane'),
    r3: L('kesishish nuqtasi pastki qirrada yotmaydi', 'точка пересечения не лежит на нижнем ребре', 'the crossing point is not on the bottom edge'),
    e1: L(
      "Alomat keyin kerak. Bu qirra qayerda yotganini qayerdan bilamiz.",
      'Признак нужен дальше. Откуда известно, где лежит это ребро.',
      'The criterion comes later. How do we know where this edge lies.',
    ),
    e2: L(
      "Alomat uchun erta. Avval yuqorigi qirra va shu tekislik haqida.",
      'Для признака рано. Сначала про верхнее ребро и эту плоскость.',
      'Too early for the criterion. First the top edge and this plane.',
    ),
    e3: L(
      "Kub yasalishi buni bermaydi. Ayqashni ajratadigan narsa kerak.",
      'Построение куба это не даёт. Нужно то, что отделяет скрещивающиеся.',
      'The cube does not give this. We need what separates skew lines.',
    ),
    ok: L('Isbotlandi. Alomat ishladi, burilish endi kerak emas.', 'Доказано. Признак сработал, и поворот больше не нужен.', 'Proved. The criterion worked and no rotation is needed any more.'),
  },
  reason: {
    s1: L("kub yasalishiga ko'ra", 'по построению куба', 'by the construction of the cube'),
    s2: L('ayqashlik alomati', 'признак скрещивающихся', 'the criterion for skew lines'),
    s3: L('ikkinchi aksioma', 'вторая аксиома', 'the second axiom'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas: u ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование: он показывает один ракурс из многих.', 'A drawing is not a justification: it shows one view out of many.'),
    },
  },
  expr: 'AB ⊂ ABCD,   B₁C₁ ∩ ABCD = B₁',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Berilganini nechta qirra kesadi', 'Сколько рёбер пересекает данное', 'How many edges cross the given one'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring.", 'Прибора нет. Считай на бумаге, потом сверься.', 'No instrument here. Work it out on paper, then compare.'),
    A('next', "Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping.", 'Дальше запись с ошибкой. Найди строку, где она появилась.', 'Next comes a written solution with a mistake. Find the line where it appeared.'),
  ],
  task: {
    ok: L("To'rtta. Qirraning har uchidan ikkitadan.", 'Четыре. По два с каждого конца ребра.', 'Four. Two at each end of the edge.'),
    hint: [
      L('Qirraning ikki uchi bor, har birida nima tutashishiga qarang.', 'У ребра два конца, посмотри, что сходится в каждом.', 'The edge has two ends, look at what meets at each.'),
      L('Kubning har uchida uchta qirra tutashadi.', 'В каждой вершине куба сходятся три ребра.', 'Three edges meet at each vertex of a cube.'),
      L("To'rt.", 'Четыре.', 'Four.'),
    ],
    prompt: 'AB ∩ ?',
    answer: '4',
  },
  order: {
    prompt: L("Yozuvlarni javobi o'sishi bo'yicha joylashtiring", 'Расставь записи по возрастанию ответа', 'Put the writings in order of increasing answer'),
    title: L('kichik sondan kattasiga', 'от меньшего числа к большему', 'from the smallest number to the largest'),
    ok: L("To'g'ri. Ayqashlari parallellaridan ko'p, qirralar esa jami o'n ikkita.", 'Верно. Скрещивающихся больше, чем параллельных, а всего рёбер двенадцать.', 'Correct. There are more skew edges than parallel ones, and twelve edges in all.'),
    bad: L('Har yozuvni alohida hisoblang, uzunligiga qaramang.', 'Считай каждую запись отдельно, а не смотри на её длину.', 'Compute each writing separately instead of looking at its length.'),
    items: ['AB ∥ ?', 'ABCDA₁B₁C₁D₁', 'AB ∩ CC₁', 'AB ∸ ?'],
    answer: 'AB ∩ CC₁  AB ∥ ?  AB ∸ ?  ABCDA₁B₁C₁D₁',
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
    A('mount', "To'rt qator. Har biri alohida haqiqatga o'xshaydi.", 'Четыре строки. Каждая по отдельности похожа на правду.', 'Four lines. Each of them alone looks like the truth.'),
    A('next', 'Keyin teskari masala: holga qarab qirralar juftini ayting.', 'Дальше обратная задача: по случаю назови пару рёбер.', 'Next comes the reverse task: name a pair of edges for the case.'),
  ],
  hint: {
    r1: L("Shart to'g'ri ko'chirilgan.", 'Условие переписано верно.', 'The condition is copied correctly.'),
    r2: L("Umumiy nuqta haqiqatan yo'q.", 'Общих точек и правда нет.', 'There really are no common points.'),
    r3: L("Nuqta yo'qligidan bu kelib chiqmaydi. Nima yetishmayapti?", 'Из отсутствия точек это не следует. Чего не хватает?', 'This does not follow from the absence of points. What is missing?'),
  },
  proof: L("Parallellarda umumiy tekislik bor, bu yerda esa yo'q.", 'У параллельных общая плоскость есть, а здесь её нет.', 'Parallel lines have a common plane, and here there is none.'),
  entry: {
    prompt: L('Ikkala qirrani nechta tekislik saqlaydi?', 'Сколько плоскостей содержит оба ребра?', 'How many planes contain both edges?'),
    ok: L("Bitta ham yo'q. Shuning uchun qirralar ayqash, parallel emas.", 'Ни одной. Поэтому рёбра скрещиваются, а не параллельны.', 'None. That is why the edges are skew, not parallel.'),
    hint: [
      L('Parallellik umumiy tekislikni talab qiladi.', 'Параллельность требует общей плоскости.', 'Parallelism requires a common plane.'),
      L("Ikkalasi yotadigan tekislikni izlang. U yo'q.", 'Поищи плоскость, в которой лежали бы оба. Её нет.', 'Look for a plane containing both. There is none.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
  row: {
    r1: 'AB,  B₁C₁',
    r2: 'AB ∩ B₁C₁ = ∅',
    r3: 'AB ∥ B₁C₁',
    r4: 'AB, B₁C₁ ⊂ α',
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
    A('mount', 'Endi teskarisiga. Avval bitta tekislikdagi ikki chiziq haqida javob bering.', 'Теперь наоборот. Сначала ответь про две прямые в одной плоскости.', 'Now the other way round. First answer about two lines in one plane.'),
    A('work', "Keyin kubning ayqash bo'lgan barcha qirra juftlarini belgilang.", 'Потом отметь все пары рёбер куба, которые скрещиваются.', 'Then mark every pair of cube edges that is skew.'),
  ],
  multi: {
    prompt: L("Ayqash bo'lgan barcha qirra juftlarini belgilang", 'Отметь все пары рёбер, которые скрещиваются', 'Mark every pair of edges that is skew'),
    title: L('ular aynan ikkita', 'их ровно два', 'there are exactly two'),
    ok: L("To'g'ri. Ayqashlar har xil yoqlarda yashaydi va umumiy tekisligi yo'q.", 'Верно. Скрещивающиеся живут на разных гранях и общей плоскости не имеют.', 'Correct. Skew edges live on different faces and share no plane.'),
    items: [
      { id: 'c', label: 'AB, BC', hint: L('Bu ikki qirra bir yoqda yotadi va kesishadi.', 'Эти два ребра лежат на одной грани и пересекаются.', 'These two edges lie on one face and meet.') },
      { id: 'd', label: 'AB, DC', hint: L('Bu ikkitasi parallel: ular bir yoqning qarama-qarshi tomonlarida.', 'Эти два параллельны: они на противоположных сторонах одной грани.', 'These two are parallel: they are on opposite sides of one face.') },
      { id: 'a', label: 'AB, B₁C₁', ok: true },
      { id: 'b', label: 'AB, CC₁', ok: true },
    ],
  },
  entry: {
    prompt: L('Ikki chiziq bitta tekislikda yotadi va kesishmaydi. Ularning nechta umumiy nuqtasi bor?', 'Две прямые лежат в одной плоскости и не пересекаются. Сколько у них общих точек?', 'Two lines lie in one plane and do not meet. How many common points do they have?'),
    ok: L("Bitta ham yo'q. Bular parallel: ayqashlardan ajratish uchun umumiy tekislik yetadi.", 'Ни одной. Это параллельные: общей плоскости хватает, чтобы отличить их от скрещивающихся.', 'None. These are parallel: a common plane is enough to tell them from skew ones.'),
    hint: [
      L("Nuqta bo'lganda, chiziqlar kesishardi.", 'Если бы точка была, прямые пересекались бы.', 'If there were a point, the lines would meet.'),
      L("Umumiy tekislik bor, umumiy nuqta esa yo'q.", 'Общая плоскость есть, а общих точек нет.', 'There is a common plane and no common points.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    expr: 'a, b ⊂ α,   a ∩ b = ∅',
    answer: '0',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'ayqash-kak-parallel',
  audio: [
    A('mount', "Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi.", 'Четыре вопроса подряд. Считается первая попытка.', 'Four questions in a row. The first attempt counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Fazoda to'g'ri chiziqlarning o'zaro joylashuvi necha xil?", 'Сколько случаев взаимного расположения прямых в пространстве?', 'How many cases of mutual position do lines in space have?'),
      done: '∩,   ∥,   ∸',
      items: [
        { id: 'a', label: L('uch', 'три', 'three'), correct: true },
        { id: 'b', label: L('ikki', 'два', 'two'), hint: L("Ikki hol tekislikda, fazoda uchinchisi qo'shiladi.", 'Два случая на плоскости, в пространстве добавляется третий.', 'Two cases hold on a plane, in space a third is added.') },
        { id: 'c', label: L("to'rt", 'четыре', 'four'), hint: L("To'rtinchi hol yo'q: istalgan ikki chiziq uchtadan biriga tushadi.", 'Четвёртого случая нет: любые две прямые попадают в один из трёх.', 'There is no fourth case: any two lines fall into one of the three.') },
        { id: 'd', label: L('bir', 'один', 'one'), hint: L('Bitta tekislikda ham kam.', 'Одного мало даже на плоскости.', 'One is too few even on a plane.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Qanday chiziqlar ayqash deyiladi?', 'Какие прямые называют скрещивающимися?', 'Which lines are called skew?'),
      done: 'a ∸ b',
      items: [
        { id: 'a', label: L('bitta tekislikda yotmaydiganlari', 'не лежащие в одной плоскости', 'those not lying in one plane'), correct: true },
        { id: 'b', label: L("umumiy nuqtasi yo'qlari", 'не имеющие общих точек', 'those with no common points'), hint: L("Bu parallellarga ham to'g'ri, demak bunday ajratib bo'lmaydi.", 'Это верно и для параллельных, значит различить так нельзя.', 'That is true for parallel lines too, so it does not tell them apart.') },
        { id: 'c', label: L("to'g'ri burchak ostida kesishadiganlari", 'пересекающиеся под прямым углом', 'those meeting at a right angle'), hint: L('Kesishuvchilar umuman ayqash emas, ularning umumiy nuqtasi bor.', 'Пересекающиеся вообще не скрещиваются, у них есть общая точка.', 'Intersecting lines are never skew, they have a common point.') },
        { id: 'd', label: L('har xil yoqlarda yotadiganlari', 'лежащие на разных гранях', 'those lying on different faces'), hint: L("Har xil yoqlarning qirralari parallel ham bo'ladi.", 'Рёбра разных граней бывают и параллельными.', 'Edges of different faces can be parallel too.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Berilgan qirra bilan kubning nechta qirrasi ayqash?', 'Сколько рёбер куба скрещивается с данным?', 'How many edges of a cube are skew to a given one?'),
      done: '11 − 3 − 4 = 4',
      items: [
        { id: 'a', label: L("to'rt", 'четыре', 'four'), correct: true, ok: L("To'rt. O'n bir minus uchta parallel minus to'rtta kesuvchi.", 'Четыре. Одиннадцать минус три параллельных минус четыре пересекающих.', 'Four. Eleven minus three parallel minus four crossing.') },
        { id: 'b', label: L('uch', 'три', 'three'), hint: L('Uchta bu unga parallel qirralar.', 'Три это параллельные ему рёбра.', 'Three is the number of edges parallel to it.') },
        { id: 'c', label: L('olti', 'шесть', 'six'), hint: L("Olti kesuvchilar umuman bo'lmaganda bo'lardi.", 'Шесть было бы, если бы пересекающих не было вовсе.', 'Six would hold if there were no crossing edges at all.') },
        { id: 'd', label: L("o'n bir", 'одиннадцать', 'eleven'), hint: L("O'n bir bu qolgan barcha qirralar, parallellari bilan.", 'Одиннадцать это все остальные рёбра, включая параллельные.', 'Eleven is all the other edges, parallel ones included.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Ayqash chiziqlar orasidagi burchak qanday topiladi?', 'Как находят угол между скрещивающимися?', 'How is the angle between skew lines found?'),
      done: '90°',
      items: [
        { id: 'a', label: L("birini kesishguncha parallel ko'chiradi", 'переносят одну параллельно до пересечения', 'one is moved parallel until they meet'), correct: true },
        { id: 'b', label: L("burchakni chizmada o'lchaydi", 'измеряют угол на чертеже', 'the angle is measured on the drawing'), hint: L("Chizmada proyeksiyalar orasidagi burchak ko'rinadi, va u burilishda o'zgaradi.", 'На чертеже виден угол между проекциями, и он меняется при повороте.', 'The drawing shows the angle between projections, and it changes when you rotate.') },
        { id: 'c', label: L("bunday burchak bo'lmaydi", 'такого угла не бывает', 'there is no such angle'), hint: L("U aniqlangan, faqat to'g'ridan emas.", 'Он определён, просто не напрямую.', 'It is defined, just not directly.') },
        { id: 'd', label: L('ularning tekisliklari orasidagi burchakni oladi', 'берут угол между их плоскостями', 'the angle between their planes is taken'), hint: L("Ayqashlarda umumiy tekislik umuman yo'q.", 'Общей плоскости у скрещивающихся нет вовсе.', 'Skew lines have no common plane at all.') },
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
    A('mount', "Taxmin kesishish haqida edi. Nima chiqqanini ko'ramiz.", 'Прогноз был про пересечение. Посмотрим, что вышло.', 'The guess was about an intersection. Let us see how it turned out.'),
    A('next', "Qirralar ayqash. Kesishish rasmda edi, fazoda esa u yo'q.", 'Рёбра скрещиваются. Пересечение было на картинке, а в пространстве его нет.', 'The edges are skew. The intersection was in the picture, and in space there is none.'),
  ],
  can: [
    L('Ikki emas, uch holni ajrataman', 'Различаю три случая, а не два', 'I tell three cases apart, not two'),
    L('Nuqtani emas, umumiy tekislikni tekshiraman', 'Проверяю не точку, а общую плоскость', 'I check the common plane, not the point'),
    L("Alomatni qo'llab, burilishsiz ish tutaman", 'Применяю признак и обхожусь без поворота', 'I apply the criterion and do without rotating'),
    L("Burchakni chizmadan emas, ko'chirish bilan topaman", 'Нахожу угол переносом, а не по чертежу', 'I find the angle by shifting, not from the drawing'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of problem is closed.'),
    gap: L('Bir joy takrorlashni talab qiladi: ayqashlar parallellardan nimasi bilan farq qiladi.', 'Одно место требует повтора: чем скрещивающиеся отличаются от параллельных.', 'One spot needs a second look: how skew differs from parallel.'),
    back: L("Qoidaga va to'rtinchi ekranga qayting.", 'Вернись к правилу и к экрану 4.', 'Go back to the rule and to screen four.'),
  },
  bridge: L("Keyin perpendikulyarlik: u yerda bitta chiziq kam bo'lib chiqadi.", 'Дальше перпендикулярность: там одной прямой окажется мало.', 'Next comes perpendicularity: there one line will turn out to be too few.'),
  lifehack: L('Umumiy nuqtani emas, umumiy tekislikni izlang. Nuqta ikkinchi va uchinchi holni ajratmaydi.', 'Не ищи общую точку, ищи общую плоскость. Точка не различает второй и третий случай.', 'Do not look for a common point, look for a common plane. The point does not separate the second case from the third.'),
  sheetTitle: L('Ayqash chiziqlar · shpargalka', 'Скрещивающиеся · шпаргалка', 'Skew lines · cheat sheet'),
  sheetSrc: L('10-sinf · 39-dars', '10 класс · урок 39', 'Grade 10 · lesson 39'),
  hook: {
    a: 'AB ∩ B₁C₁ = M',
    b: 'AB ∸ B₁C₁',
  },
  proved: 'AB ∸ B₁C₁',
  law: 'a ∸ b',
  sheet: [
    'a ∩ b = M',
    'a ∥ b',
    'a ∸ b',
    'a ⊂ α,  b ∩ α = M,  M ∉ a',
    '11 − 3 − 4 = 4',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))

// СЦЕНА УРОКА ОДНА -- куб учебника (геом. стр. 95, 2-rasm). Меняется только
// подсветка: сначала скрещивающаяся пара, потом параллельная для сравнения.
// KAMERA. Ikki og'ish bor, va bu bejiz emas.
//
// ALDOV KAMERASI (`TRICK`) -- 40 daraja og'ish va 45 daraja burilish. Aynan
// shunda `AB` va `B1C1` qirralari ekranda HAQIQATAN kesishadi, kesishish nuqtasi
// esa pastki qirraning o'rtasiga tushadi (hisoblab olingan: x = 0,5 minus
// sin(burilish) ni ctg(og'ish) ga ko'paytirilgani). Darslikning chizmasi ham
// shunday, va o'quvchi aynan shu rasmda aldanadi.
//
// Sinfning ODDIY kamerasi 26 daraja, va unda bu juftlik hech qachon
// kesishmaydi. Shu sababli aldov 1 va 3-ekranda ko'rsatiladi, qolgan ekranlar
// esa sinfning odatdagi kamerasida qoladi: ular alomat haqida, aldov haqida
// emas.
// Burilish 0,58, 0,785 EMAS. 45 darajada biz kubning fazoviy diagonali bo'ylab
// qaraymiz, va `A` bilan `C1` uchlari ekranda bir joyga tushadi -- yozuvlar
// bir-birining ustiga o'tiradi. 0,58 da ular qirraning uchdan biriga ajraladi,
// kesishish esa `C1` uchiga tushadi: yuqorigi qirra pastki qirrada TUGAGAN
// ko'rinadi, ya'ni umumiy nuqta bordek.
const TRICK = { pitch: 0.7, yaw: 0.58 }
// Aldov yo'qoladigan burilish. 1,45 YARAMAYDI: o'sha burilishda qirralar
// hamon deyarli tutashgan ko'rinadi (masofa qirraning 10 foizi). 2,4 da esa
// masofa 66 foiz -- hisoblab olindi, ko'z bilan emas.
const TRICK_OFF = 2.4

const SKEW = ['AB', 'B1C1']
const PARA = ['AB', 'CD']
// Нижняя грань как плоскость: на ней держится признак (теорема 3.4).
const BOTTOM = [{ by: ['A', 'B', 'C'], dim: true }]

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
const PROOF_ROWS = [
  { text: S10.proof.r1, reason: 's1', early: S10.proof.e1 },
  { text: S10.proof.r2, reason: 's3', early: S10.proof.e2 },
  { text: S10.proof.r3, reason: 's2', early: S10.proof.e3, ok: S10.proof.ok },
]

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Ракурс ВЫБРАН так, чтобы рёбра казались сошедшимися: прогноз делается
        // ровно на том обмане, который потом снимет поворот.
        fig={() => <Scene fig={<Space step={1} cube hi={SKEW} pitch={TRICK.pitch} yaw={TRICK.yaw} />} max={172} h={172} />}
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
          <Scene fig={<Space step={1} yaw={0.4} cube />} max={240} h={158} />
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
            step={1} cube hi={SKEW}
            pitch={TRICK.pitch}
            yaw={phase === 0 ? TRICK.yaw : TRICK_OFF}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      /* СВИДЕТЕЛЬ УРОКА. Крутит ученик: пока он не повернул куб, «пересеклись»
         и «скрестились» на экране неотличимы. */
      <SpinScene
        /* Asbob ALDOV rakursidan boshlanadi: qirralar kesishgan ko'rinadi, va
           faqat o'quvchining burilishi buni rad etadi. */
        yaw0={TRICK.yaw}
        stepYaw={1.2}
        scene={<Space step={1} cube hi={SKEW} pitch={TRICK.pitch} />}
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
      /* Кадр 1 -- ПАРАЛЛЕЛЬНАЯ пара с их общей плоскостью, кадр 2 -- наша.
         Различие видно только в том, есть ли плоскость. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.5} cube
            hi={phase === 0 ? PARA : SKEW}
            planes={phase === 0 ? BOTTOM : []}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={<Space step={1} cube hi={SKEW} />}
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
        fig={<Space step={1} yaw={phase * 0.6} cube hi={SKEW} planes={BOTTOM} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.6} cube hi={SKEW} planes={BOTTOM} />} max={300} /></Col>
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
        fig={<Space step={1} yaw={0.5} cube hi={phase === 0 ? ['AB'] : PARA} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.5} cube hi={SKEW} />} max={300} /></Col>
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
            step={1} yaw={0.5} cube hi={phase === 0 ? SKEW : ['AB', 'BC']}
            angleAt={phase === 0 ? null : { at: 'B', from: 'A', to: 'C' }}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene
            fig={<Space step={1} yaw={0.5} cube hi={['AB', 'BC']} angleAt={{ at: 'B', from: 'A', to: 'C' }} />}
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
            fig={<Space step={1} yaw={solved ? 0.8 : 0} cube hi={solved ? SKEW : PARA} planes={solved ? [] : BOTTOM} />}
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
            fig={<Space step={1} yaw={round * 0.4} cube hi={round === 1 ? PARA : SKEW} />}
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
