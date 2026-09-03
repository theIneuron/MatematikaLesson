// ============================================================================
// 10-sinf, Dars 22. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS22_KONTENT.md
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
  Scene,
} from './tools.jsx'

import { DomainBand } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
// REJA SATRINING IKKINCHI YARMI: 22-dars 21-darsning temasini davom ettiradi.
// Reja satri bitta, darslar ikkita; nomer esa har darsda o'zining.
const LESSON_NO = 22
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Ratsional tengsizliklar`,
  `Урок ${LESSON_NO}. Рацион. неравенства`,
  `Lesson ${LESSON_NO}. Rational inequalities`,
)

const BLOCK = { label: 'B5', from: 15, to: 27, current: 22 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TENGSIZLIK', 'НЕРАВЕНСТВО', 'THE INEQUALITY'),
  title: L("Bir bo'lakmi yoki ikkitami", 'Один кусок или два', 'One piece or two'),
  audio: [
    A('mount', "Kasr noldan katta. Chapda va o'ngda ikki xil javob, ikkalasi ham ishonarli ko'rinadi.", 'Дробь больше нуля. Слева и справа два разных ответа, и оба выглядят убедительно.', 'A fraction greater than zero. On the left and on the right two different answers, and both look convincing.'),
    A('r1', "Birinchisi ikkala tarafni maxrajga ko'paytirish bilan olingan: iks qo'shuv bir noldan katta bo'lib qoladi.", 'Первый получен умножением обеих частей на знаменатель: остаётся икс плюс один больше нуля.', 'The first came from multiplying both sides by the denominator: x plus one greater than zero remains.'),
    A('r2', "Ikkinchisi o'qni belgilash bilan olingan va bitta emas, ikki bo'lakdan iborat.", 'Второй получен разметкой оси и состоит из двух кусков, а не из одного.', 'The second came from marking up the axis and consists of two pieces, not one.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi son bilan tekshiramiz.', 'Твой ответ записан. Сейчас проверим числом.', 'Your answer is saved. Now we will check with a number.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("maxrajga ko'paytirdik", 'умножили на знаменатель', 'multiplied by the denominator'),
      value: 'x > −1',
    },
    b: {
      name: L("o'qni belgiladik", 'разметили ось', 'marked up the axis'),
      value: 'x < −1;  x > 2',
    },
  },
  expr: '(x + 1)/(x − 2) > 0',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Tengsizlikdan oldin uch savol', 'Три вопроса перед неравенством', 'Three questions before the inequality'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Kasr qaysi iksda aniqlanmagan?', 'При каком икс дробь не определена?', 'For which x is a fraction undefined?'),
      done: 'x − 2 ≠ 0',
      items: [
        { id: 'a', label: L("maxraj nol bo'lganda", 'когда знаменатель ноль', 'when the denominator is zero'), correct: true },
        { id: 'b', label: L("surat nol bo'lganda", 'когда числитель ноль', 'when the numerator is zero'), hint: L('Suratdagi nol nol beradi, va bu oddiy son.', 'Ноль в числителе даёт ноль, и это обычное число.', 'Zero in the numerator gives zero, and that is an ordinary number.') },
        { id: 'c', label: L("iks manfiy bo'lganda", 'когда икс отрицателен', 'when x is negative'), hint: L('Manfiy iks kasrni buzmaydi.', 'Отрицательный икс дробь не ломает.', 'A negative x does not break a fraction.') },
        { id: 'd', label: L('hech qachon', 'никогда', 'never'), hint: L('Bitta nuqta baribir tushib qoladi, va uni topish kerak.', 'Одна точка всё же выпадает, и её надо найти.', 'One point does drop out, and it has to be found.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Ikki manfiy sonning bo'linmasi qanday ishorali?", 'Какой знак у частного двух отрицательных чисел?', 'What sign does a quotient of two negative numbers have?'),
      done: '(−)/(−) = (+)',
      items: [
        { id: 'a', label: L('plyus', 'плюс', 'plus'), correct: true },
        { id: 'b', label: L('minus', 'минус', 'minus'), hint: L("Minusga minus bo'lishda ham plyus beradi.", 'Минус на минус даёт плюс и при делении тоже.', 'Minus by minus gives plus in division too.') },
        { id: 'c', label: L("qaysi biri kattaligiga bog'liq", 'зависит от того, что больше', 'it depends on which one is bigger'), hint: L("Kattalik ishorani o'zgartirmaydi, uni faqat ishoralar belgilaydi.", 'Величина не меняет знак, его определяют только знаки.', 'Size does not change the sign, only the signs decide it.') },
        { id: 'd', label: L('nol', 'ноль', 'zero'), hint: L("Surat nol bo'lganda nol chiqardi.", 'Ноль вышел бы, будь числитель нулём.', 'Zero would come only from a zero numerator.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Tengsizlikning yechimi nima?', 'Что такое решение неравенства?', 'What is the solution of an inequality?'),
      done: '(x + 1)/(x − 2) > 0',
      items: [
        { id: 'a', label: L("u to'g'ri bo'ladigan barcha sonlar", 'все числа, при которых оно верно', 'all numbers for which it holds'), correct: true },
        { id: 'b', label: L('bitta son', 'одно число', 'one number'), hint: L('Bitta son tenglamaning javobi, tengsizlikniki emas.', 'Одно число это ответ уравнения, а не неравенства.', 'One number is the answer of an equation, not of an inequality.') },
        { id: 'c', label: L("bo'laklar orasidagi chegara", 'граница между кусками', 'the boundary between pieces'), hint: L("Chegara javobni topishga yordam beradi, lekin o'zi javob emas.", 'Граница помогает найти ответ, но сама им не является.', 'The boundary helps find the answer but is not the answer itself.') },
        { id: 'd', label: L('har qanday musbat son', 'любое положительное число', 'any positive number'), hint: L("Ba'zan yechimlar manfiy, musbatlari esa yaramaydi.", 'Иногда решения отрицательные, а положительные не годятся.', 'Sometimes the solutions are negative and the positive ones do not fit.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("O'qni ikki son kesadi", 'Ось режут два числа', 'Two numbers cut the axis'),
  tag: 'umnozhayut-na-znamenatel',
  show: [
    [
      L('surat minus birda nolga teng', 'числитель равен нулю при минус единице', 'the numerator is zero at minus one'),
      L('maxraj ikkida nolga teng', 'знаменатель равен нулю при двойке', 'the denominator is zero at two'),
      L("ikkala son o'qqa tushadi", 'оба числа падают на ось', 'both numbers land on the axis'),
    ],
    [
      L("o'q bo'laklarga bo'lingan", 'ось разрезана на участки', 'the axis is cut into pieces'),
      L("bo'lak ichida ishora o'zgarmaydi", 'внутри участка знак не меняется', 'inside a piece the sign does not change'),
      L("demak har bo'lakka bitta son yetadi", 'значит хватит одного числа на участок', 'so one number per piece is enough'),
    ],
  ],
  motion: ['cut'],
  audio: [
    A('mount', "Tengsizlik tagida o'q. Butun yechim unga sig'adi.", 'Ось под неравенством. Всё решение уместится на ней.', 'An axis under the inequality. The whole solution will fit on it.'),
    A('cut', "Surat minus birda nolga aylanadi, maxraj esa ikkida. Ikkala son o'qqa tushadi va uni uch bo'lakka bo'ladi. Keyin oddiy narsa ishlaydi: biz bitta bo'lak bo'ylab yurganimizda na surat, na maxraj ishorasini o'zgartiradi, demak butun kasr ham uni o'zgartirmaydi. U faqat biror narsa nolga aylanadigan nuqtalarda, ya'ni chegaralarda o'zgarishi mumkin. Shuning uchun butun bo'lakni tekshirish shart emas, undan bitta son yetadi.", 'Числитель обращается в ноль при минус единице, знаменатель при двойке. Оба числа падают на ось и режут её на три участка. Дальше работает простая вещь: пока мы идём по одному участку, ни числитель, ни знаменатель знак не меняют, а значит и вся дробь его не меняет. Поменяться он может только в тех точках, где что-то обращается в ноль, то есть на границах. Поэтому проверять весь участок не надо, хватит одного числа из него.', 'The numerator turns to zero at minus one, the denominator at two. Both numbers land on the axis and cut it into three pieces. Then a simple thing does the work: while we walk along one piece, neither the numerator nor the denominator changes sign, so the whole fraction does not change sign either. It can only change at the points where something turns to zero, that is, at the boundaries. So there is no need to test a whole piece, one number from it is enough.'),
    A('work', "O'zingiz hisoblang. Ikki son o'qni necha bo'lakka bo'ldi?", 'Посчитай сам. На сколько участков два числа разрезали ось?', 'Work it out yourself. Into how many pieces did the two numbers cut the axis?'),
  ],
  work: {
    prompt: L("Nechta bo'lak hosil bo'ldi?", 'Сколько участков получилось?', 'How many pieces are there?'),
    ok: L("Uchta. Minus birdan chapda, u bilan ikki orasida, va ikkidan o'ngda.", 'Три. Слева от минус единицы, между ней и двойкой, и правее двойки.', 'Three. To the left of minus one, between it and two, and to the right of two.'),
    hint: [
      L("Nuqtalarni emas, bo'laklarni sanang.", 'Посчитай куски, а не сами точки.', 'Count the pieces, not the points themselves.'),
      L("Ikki nuqta to'g'ri chiziqni uch qismga bo'ladi.", 'Две точки режут прямую на три части.', 'Two points cut a line into three parts.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'order',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Nega maxrajga ko'paytirib bo'lmaydi", 'Почему нельзя умножить на знаменатель', 'Why you cannot multiply by the denominator'),
  tag: 'umnozhayut-na-znamenatel',
  show: [
    [
      L("ikkala tarafni maxrajga ko'paytiramiz", 'умножаем обе части на знаменатель', 'multiply both sides by the denominator'),
      L("iks qo'shuv bir noldan katta bo'lib qoladi", 'остаётся икс плюс один больше нуля', 'x plus one greater than zero remains'),
      L("javob bitta bo'lak bo'lib chiqadi", 'ответ выходит одним куском', 'the answer comes out as one piece'),
    ],
    [
      L('shu javobdan nolni olamiz', 'берём ноль из этого ответа', 'take zero from that answer'),
      L('yuqorida bir, pastda minus ikki', 'сверху один, снизу минус два', 'one on top, minus two below'),
      L('minus chiqadi, plyus kerak esa', 'выходит минус, а нужен плюс', 'a minus comes out, and a plus was needed'),
    ],
  ],
  motion: ['mul'],
  audio: [
    A('mount', "Birinchi javobni ko'rib chiqamiz. U qisqa va tanish amal bilan olingan.", 'Разберём первый ответ. Он получен коротким и знакомым действием.', 'Let us look at the first answer. It came from a short and familiar step.'),
    A('mul', "Ikkala tarafni maxrajga ko'paytirdik, kasr yo'qoldi, iks qo'shuv bir noldan katta bo'lib qoldi, bundan iks minus birdan katta. Bu javobni son bilan tekshiramiz. Nol unga kiradi. Nolni dastlabkisiga qo'yamiz: yuqorida bir, pastda minus ikki, kasr minus nol butun besh o'ndan ga teng. Bu noldan kichik, katta bo'lishi kerak edi. Demak javob noto'g'ri. Sababi shuki, maxraj manfiy ham bo'ladi, manfiyga ko'paytirilganda esa tengsizlik ishorasi ag'dariladi. Tenglamada bunday balo yo'q, u yerda ishora umuman yo'q. Tenglama bilan tengsizlik orasidagi farq ana shu.", 'Обе части умножили на знаменатель, дробь исчезла, осталось икс плюс один больше нуля, отсюда икс больше минус единицы. Проверим этот ответ числом. Ноль в него входит. Подставим ноль в исходное: сверху единица, снизу минус два, дробь равна минус ноль целых пять десятых. Это меньше нуля, а требовалось больше. Значит ответ неверный. Причина в том, что знаменатель бывает отрицательным, а при умножении на отрицательное знак неравенства переворачивается. У уравнения такой беды нет, там знака нет вовсе. Это и есть разница между уравнением и неравенством.', 'Both sides were multiplied by the denominator, the fraction vanished, x plus one greater than zero remained, which gives x greater than minus one. Let us test this answer with a number. Zero belongs to it. Substitute zero into the original: one on top, minus two below, and the fraction equals minus zero point five. That is less than zero, while greater was required. So the answer is wrong. The reason is that the denominator can be negative, and multiplying by a negative flips the inequality sign. An equation has no such trouble, there is no sign there at all. That is exactly the difference between an equation and an inequality.'),
    A('work', "Bu sodir bo'lgan tartibda qadamlarni joylashtiring.", 'Расставь шаги в том порядке, в котором это произошло.', 'Put the steps in the order in which this happened.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring', 'Расставь шаги по порядку', 'Put the steps in order'),
    s1: L("maxrajga ko'paytirdik", 'умножили на знаменатель', 'multiplied by the denominator'),
    s2: L("bitta bo'lak oldik", 'получили один кусок', 'got one piece'),
    s3: L('javobdan nolni oldik', 'взяли ноль из ответа', 'took zero from the answer'),
    s4: L('minus chiqdi', 'вышел минус', 'a minus came out'),
    ok: L("To'g'ri. Bitta son bilan tekshirish noto'g'ri javobni bir qadamda buzadi.", 'Верно. Проверка одним числом ломает неверный ответ за один шаг.', 'Correct. A check with one number breaks a wrong answer in a single step.'),
    bad: L('Tekshirishdan emas, amaldan boshlang.', 'Начни с действия, а не с проверки.', 'Start with the step, not with the check.'),
    mark: '−0,5 < 0',
  },
  frameA: 'x + 1 > 0   →   x > −1',
  frameB: '(0 + 1)/(0 − 2) = −0,5',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Har bo'lakning ishorasi", 'Знак каждого участка', 'The sign of each piece'),
  tag: 'umnozhayut-na-znamenatel',
  show: [
    [
      L('chapda minus ikkini olamiz', 'слева берём минус два', 'on the left we take minus two'),
      L('yuqorida minus, pastda minus', 'сверху минус, снизу минус', 'minus on top, minus below'),
      L("birinchi bo'lakda plyus", 'на первом участке плюс', 'plus on the first piece'),
    ],
    [
      L("o'rtada nolni olamiz", 'в середине берём ноль', 'in the middle we take zero'),
      L("o'ngda uchni olamiz", 'справа берём тройку', 'on the right we take three'),
      L('ishoralar navbatlashadi', 'знаки чередуются', 'the signs alternate'),
    ],
  ],
  motion: ['signs'],
  audio: [
    A('mount', "Uch bo'lak, uch son. Har biridan bittadan olamiz.", 'Три участка, три числа. Возьмём по одному из каждого.', 'Three pieces, three numbers. Let us take one from each.'),
    A('signs', "Minus birdan chapda minus ikkini olamiz. Yuqorida minus bir, pastda minus to'rt, minusga minus plyus beradi. Birinchi bo'lakda plyus. O'rtada nolni olamiz. Yuqorida bir, pastda minus ikki, minus chiqadi. Ikkinchi bo'lakda minus. Ikkidan o'ngda uchni olamiz. Yuqorida to'rt, pastda bir, plyus chiqadi. Uchinchi bo'lakda plyus. E'tibor bering, ishoralar plyus, minus, plyus bo'lib ketdi, ular navbatlashadi. Bu doim ham shunday bo'lavermaydi, shuning uchun biz har bo'lakni naqshga qarab taxmin qilmay, son bilan tekshirdik.", 'Слева от минус единицы берём минус два. Сверху минус один, снизу минус четыре, минус на минус даёт плюс. На первом участке плюс. В середине берём ноль. Сверху один, снизу минус два, выходит минус. На втором участке минус. Справа от двойки берём тройку. Сверху четыре, снизу один, выходит плюс. На третьем участке плюс. Обрати внимание, знаки пошли плюс, минус, плюс, они чередуются. Так бывает не всегда, поэтому каждый участок мы всё же проверили числом, а не угадали по узору.', 'To the left of minus one we take minus two. Minus one on top, minus four below, and minus by minus gives plus. The first piece is plus. In the middle we take zero. One on top, minus two below, so a minus comes out. The second piece is minus. To the right of two we take three. Four on top, one below, so a plus comes out. The third piece is plus. Notice that the signs came out plus, minus, plus, they alternate. That is not always so, which is why we still tested every piece with a number instead of guessing from the pattern.'),
    A('work', "O'zingiz hisoblang. Nechta bo'lakda plyus turibdi?", 'Посчитай сам. На скольких участках стоит плюс?', 'Work it out yourself. How many pieces carry a plus?'),
  ],
  work: {
    prompt: L("Plyus ishorali nechta bo'lak bor?", 'Сколько участков со знаком плюс?', 'How many pieces have a plus sign?'),
    ok: L('Ikkita. Birinchi va uchinchi, javobni ular tashkil qiladi.', 'Два. Первый и третий, и они и составят ответ.', 'Two. The first and the third, and they will make the answer.'),
    hint: [
      L("O'q ustidagi ishoralarga qarang.", 'Посмотри на знаки над осью.', 'Look at the signs above the axis.'),
      L("Plyus chapda va o'ngda, minus o'rtada.", 'Плюс стоит слева и справа, минус в середине.', 'Plus stands on the left and on the right, minus in the middle.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Avval bitta kasr, keyin o'q", 'Сначала одна дробь, потом ось', 'First one fraction, then the axis'),
  tag: 'umnozhayut-na-znamenatel',
  show: [
    [
      L('chapda kasr emas, ayirma', 'слева не дробь, а разность', 'on the left there is a difference, not a fraction'),
      L('umumiy maxrajga keltiramiz', 'приводим к общему знаменателю', 'bring it to a common denominator'),
      L("yuqorida iks kvadrat minus to'rt", 'сверху икс в квадрате минус четыре', 'x squared minus four on top'),
    ],
    [
      L('surat ikkida va minus ikkida nolga teng', 'числитель равен нулю при двойке и минус двойке', 'the numerator is zero at two and at minus two'),
      L('maxraj nolda nolga teng', 'знаменатель равен нулю при нуле', 'the denominator is zero at zero'),
      L("o'qda uch son bo'ladi", 'на оси окажется три числа', 'three numbers will be on the axis'),
    ],
  ],
  motion: ['one'],
  audio: [
    A('mount', "Bu darslikdagi topshiriq. U bizda hali bo'lmagan qadamdan boshlanadi.", 'Это задание из учебника. Оно начинается с шага, которого у нас ещё не было.', 'This task comes from the textbook. It starts with a step we have not had yet.'),
    A('one', "Chapda kasr emas, ayirma turibdi, va usulni unga hozircha qo'llab bo'lmaydi. Avval hammasini umumiy maxrajga keltiramiz. Iks minus to'rtni iksga bo'lish yuqorisida iks kvadrat minus to'rt, pastida iks turgan kasrga aylanadi. Endi nollarni izlash mumkin. Yuqorida nol ikkida va minus ikkida chiqadi, pastda nolda. Demak o'qda uch son bo'ladi, bo'laklar esa to'rtta. Bu qoida doim ishlaydi: avval bitta kasr, faqat keyin belgilash.", 'Слева стоит не дробь, а разность, и метод к ней пока не применить. Сначала приводим всё к общему знаменателю. Икс минус четыре делить на икс превращается в дробь, у которой сверху икс в квадрате минус четыре, а снизу икс. Теперь можно искать нули. Сверху ноль выходит при двойке и при минус двойке, снизу при нуле. Значит на оси окажется три числа, и участков будет четыре. Это правило работает всегда: сначала одна дробь, и только потом разметка.', 'On the left there is a difference, not a fraction, and the method does not apply to it yet. First we bring everything to a common denominator. X minus four over x turns into a fraction with x squared minus four on top and x below. Now the zeros can be found. On top the zero comes at two and at minus two, below it comes at zero. So three numbers will be on the axis, and there will be four pieces. This rule always holds: one fraction first, marking up only after that.'),
    A('work', "O'zingiz hisoblang. O'qqa nechta son tushadi?", 'Посчитай сам. Сколько чисел попадёт на ось?', 'Work it out yourself. How many numbers will land on the axis?'),
  ],
  work: {
    prompt: L("O'qqa nechta son tushadi?", 'Сколько чисел попадёт на ось?', 'How many numbers land on the axis?'),
    ok: L('Uchta. Suratning ikki noli va maxrajning bir noli.', 'Три. Два нуля числителя и один ноль знаменателя.', 'Three. Two zeros of the numerator and one zero of the denominator.'),
    hint: [
      L('Surat nollarini va maxraj nollarini alohida toping.', 'Найди нули числителя и нули знаменателя отдельно.', 'Find the zeros of the numerator and of the denominator separately.'),
      L("Iks kvadrat minus to'rt ikki marta nolga aylanadi.", 'Икс в квадрате минус четыре обращается в ноль дважды.', 'X squared minus four turns to zero twice.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    expr: '(x² − 4)/x ≥ 0',
    answer: '3',
  },
  frameA: 'x − 4/x ≥ 0',
  frameB: '(x² − 4)/x ≥ 0',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARAVIY HOL', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Bir nuqta kiradi, boshqasi yo'q", 'Одна точка входит, другая нет', 'One point is in, the other is not'),
  tag: 'tochku-ne-vykololi',
  show: [
    [
      L("o'sha misol, lekin ishora qat'iy emas", 'тот же пример, но знак нестрогий', 'the same example, but the sign is not strict'),
      L('minus bir kasrni nolga aylantiradi', 'минус единица делает дробь нулём', 'minus one makes the fraction zero'),
      L('nol javobga kiradi', 'ноль в ответ входит', 'zero belongs to the answer'),
    ],
    [
      L('ikki maxrajni nolga aylantiradi', 'двойка делает знаменатель нулём', 'two makes the denominator zero'),
      L('bunday kasr mavjud emas', 'такой дроби не существует', 'such a fraction does not exist'),
      L("nuqta javob ichidan o'yib olingan", 'точка выколота изнутри ответа', 'the point is punched out from inside the answer'),
    ],
  ],
  motion: ['edge'],
  audio: [
    A('mount', "O'sha tengsizlik, lekin ishora qat'iy emasga o'zgartirildi. Javob butunlay emas, ikki nuqtada o'zgaradi.", 'То же неравенство, но знак поменяли на нестрогий. Ответ изменится не весь, а в двух точках.', 'The same inequality, but the sign is now not strict. The answer changes not everywhere, but at two points.'),
    A('edge', "Minus birda surat nolga teng, demak butun kasr ham nolga teng. Qat'iy bo'lmagan ishora nolni yo'l qo'yadi, shuning uchun minus bir javobga kiradi, nuqta esa bo'yaladi. Ikkida maxraj nolga aylanadi, nolga bo'lish esa tengsizlikning hech qanday ishorasida mumkin emas. Demak ikki hech qachon kirmaydi, nuqta ochiq qoladi. O'qda bu qanday ko'rinishiga qarang: bo'yalgan bo'lak ikkigacha boradi va uziladi, ikkining o'zi esa bo'sh qoladi. U javob chetidan emas, ichidan o'yib olingan.", 'При минус единице числитель равен нулю, значит и вся дробь равна нулю. Нестрогий знак ноль допускает, поэтому минус единица входит в ответ, и точка закрашивается. При двойке в ноль обращается знаменатель, а делить на ноль нельзя ни при каком знаке неравенства. Значит двойка не входит никогда, и точка остаётся выколотой. Посмотри, как это выглядит на оси: закрашенный участок идёт до двойки и обрывается, а сама двойка остаётся пустой. Она вырезана изнутри ответа, а не с края.', 'At minus one the numerator is zero, so the whole fraction is zero. A non-strict sign allows zero, so minus one belongs to the answer and the point is filled in. At two the denominator turns to zero, and dividing by zero is not allowed under any inequality sign. So two never belongs, and the point stays hollow. Look at how this shows on the axis: the shaded piece runs up to two and breaks off, while two itself stays empty. It is cut out from inside the answer, not from its edge.'),
    A('work', "O'zingiz hisoblang. Javobda nechta nuqta ochiq qoldirilgan?", 'Посчитай сам. Сколько точек в ответе выколото?', 'Work it out yourself. How many points in the answer are punched out?'),
  ],
  work: {
    prompt: L('Nechta nuqta ochiq?', 'Сколько точек выколото?', 'How many points are punched out?'),
    ok: L("Bitta. Maxraj nol bo'lgan ikki. Minus bir esa bo'yalgan.", 'Одна. Двойка, где знаменатель ноль. Минус единица закрашена.', 'One. The two, where the denominator is zero. Minus one is filled in.'),
    hint: [
      L('Surat noliga va maxraj noliga alohida qarang.', 'Посмотри отдельно на ноль числителя и на ноль знаменателя.', 'Look separately at the zero of the numerator and of the denominator.'),
      L("Qat'iy bo'lmagan ishorada surat noli javobga kiradi.", 'Ноль числителя при нестрогом знаке входит в ответ.', 'With a non-strict sign the zero of the numerator belongs to the answer.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    expr: '(x + 1)/(x − 2) ≥ 0',
    answer: '1',
  },
  frameA: '(x + 1)/(x − 2) ≥ 0',
  frameB: 'x ≤ −1;  x > 2',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Besh qadam', 'Пять шагов', 'Five steps'),
  tag: 'umnozhayut-na-znamenatel',
  motion: ['rule'],
  audio: [
    A('mount', "Qoidani yig'amiz. Darslikda u besh qadam bilan yozilgan.", 'Соберём правило. В учебнике оно записано пятью шагами.', 'Let us put the rule together. It is written as five steps.'),
    A('rule', "Birinchi: surat nollarini topish. Ikkinchi: maxraj nollarini topish. Uchinchi: ikkalasini ham son o'qida belgilash. To'rtinchi: hosil bo'lgan har bir bo'lakda bitta son qo'yib kasr ishorasini aniqlash. Beshinchi: tengsizlikni qanoatlantiradigan bo'laklarni tanlash, javob ana shu. Alohida esda tuting: yuqoridagi nol bilan pastdagi nol boshqacha. Qat'iy bo'lmagan ishorada surat noli javobga kiradi, maxraj noli esa hech qachon kirmaydi.", 'Первое: найти нули числителя. Второе: найти нули знаменателя. Третье: отметить и те и другие на числовой оси. Четвёртое: на каждом получившемся участке определить знак дроби, подставив одно число. Пятое: выбрать те участки, которые удовлетворяют неравенству, и это и есть ответ. Отдельно держи в голове разницу между нулём сверху и нулём снизу. Ноль числителя при нестрогом знаке входит в ответ, ноль знаменателя не входит никогда.', 'First: find the zeros of the numerator. Second: find the zeros of the denominator. Third: mark both kinds on the number axis. Fourth: on every piece that appears, determine the sign of the fraction by substituting one number. Fifth: pick the pieces that satisfy the inequality, and that is the answer. Keep the difference between a zero on top and a zero below in mind separately. With a non-strict sign the zero of the numerator belongs to the answer, the zero of the denominator never does.'),
  ],
  probe: {
    question: L("Nega ikkala tarafni maxrajga ko'paytirib bo'lmaydi?", 'Почему нельзя умножить обе части на знаменатель?', 'Why can you not multiply both sides by the denominator?'),
    items: [
      { id: 'a', label: L("maxraj manfiy ham bo'ladi, ishora ag'dariladi", 'знаменатель бывает отрицательным, и знак перевернётся', 'the denominator can be negative, and the sign will flip'), correct: true },
      { id: 'b', label: L("chunki kasr yo'qoladi", 'потому что дробь исчезнет', 'because the fraction will vanish'), hint: L("Kasr tenglamada ham yo'qoladi, va u yerda bu mumkin. Gap ishorada.", 'Дробь исчезает и в уравнении, и там это разрешено. Дело в знаке.', 'The fraction vanishes in an equation too, and there it is allowed. The point is the sign.') },
    ],
  },
  rule: {
    lawLabel: L('BESH QADAM', 'ПЯТЬ ШАГОВ', 'THE FIVE STEPS'),
    lines: [
      L('surat va maxraj nollarini topish', 'найти нули числителя и нули знаменателя', 'find the zeros of the numerator and of the denominator'),
      L("ularni son o'qida belgilash", 'отметить их на числовой оси', 'mark them on the number axis'),
      L("har bo'lakda ishorani topib, keraklilarini tanlash", 'на каждом участке найти знак и выбрать нужные', 'find the sign on every piece and pick the ones you need'),
    ],
    law: 'f(x)/g(x) > 0,   g(x) ≠ 0',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  title: L('Tengsizlikni javobi bilan ulang', 'Соедини неравенство с ответом', 'Match each inequality with its answer'),
  tag: 'tochku-ne-vykololi',
  audio: [
    A('mount', "To'rt tengsizlik va to'rt javob. O'qni xayolda belgilang.", 'Четыре неравенства и четыре ответа. Размечай ось в уме.', 'Four inequalities and four answers. Mark up the axis in your head.'),
  ],
  match: {
    prompt: L('Hammaning nollari har xil, ishoralari ham', 'Нули у всех разные, знаки тоже', 'The zeros differ everywhere, and so do the signs'),
    ok: L("To'g'ri. Qaysi bo'laklar olinishini nollar emas, tengsizlik ishorasi hal qiladi.", 'Верно. Знак неравенства решает, какие участки берут, а не где нули.', 'Correct. The inequality sign decides which pieces are taken, not where the zeros are.'),
    left: ['(x − 1)/(x − 3) > 0', '(x + 2)/(x − 1) < 0', '1/(x − 4) > 0', '(x + 3)/x < 0'],
    a: 'x < 1;  x > 3',
    b: '−2 < x < 1',
    c: 'x > 4',
    d: '−3 < x < 0',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L("Tengsizlikni to'liq yeching", 'Реши неравенство целиком', 'Solve the inequality from start to finish'),
  tag: 'umnozhayut-na-znamenatel',
  audio: [
    A('mount', "Endi butun tengsizlik. To'rt qadam, tartib muhim.", 'Теперь всё неравенство целиком. Четыре шага, порядок важен.', 'Now the whole inequality. Four steps, and the order matters.'),
  ],
  order: {
    prompt: L('Yechish qadamlarini tartib bilan joylashtiring', 'Расставь шаги решения по порядку', 'Put the solution steps in order'),
    s1: L('nollarni topish', 'найти нули', 'find the zeros'),
    s2: L("o'qda belgilash", 'отметить на оси', 'mark them on the axis'),
    s3: L("ishoralarni qo'yish", 'расставить знаки', 'place the signs'),
    s4: L("bo'laklarni tanlash", 'выбрать участки', 'pick the pieces'),
    ok: L("To'g'ri. Ishoralar belgilashdan keyin qo'yiladi, tanlash esa eng oxirida.", 'Верно. Знаки ставят после разметки, а выбирают в самом конце.', 'Correct. Signs go after the marking, and the picking comes last.'),
    bad: L("Bo'lak yo'q ekan, uning ishorasini topib bo'lmaydi.", 'Знак участка нельзя найти, пока участка ещё нет.', 'You cannot find the sign of a piece while the piece does not exist yet.'),
    mark: 'x < −1;  x > 2',
  },
  expr: '(x + 1)/(x − 2) > 0',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Ichida nechta butun son bor', 'Сколько целых чисел внутри', 'How many whole numbers are inside'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring.", 'Прибора нет. Считай на бумаге, потом сверься.', 'No instrument here. Work it out on paper, then compare.'),
    A('next', "Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping.", 'Дальше запись с ошибкой. Найди строку, где она появилась.', 'Next comes a written solution with a mistake. Find the line where it appeared.'),
  ],
  task: {
    ok: L("Uchta. Bular ikki, uch va to'rt: chegaralarning o'zi kirmaydi.", 'Три. Это два, три и четыре: границы сами не входят.', 'Three. They are two, three and four: the boundaries themselves are out.'),
    hint: [
      L('Birdan katta va beshdan kichik sonlarni yozing.', 'Выпиши числа, которые больше одного и меньше пяти.', 'Write out the numbers greater than one and less than five.'),
      L("Bir va besh kirmaydi: ishoralar qat'iy.", 'Единица и пятёрка не входят: знаки строгие.', 'One and five are out: the signs are strict.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    prompt: '1 < x < 5',
    answer: '3',
  },
  order: {
    prompt: L("Oraliqlarni uzunligi o'sishi bo'yicha joylashtiring", 'Расставь промежутки по возрастанию длины', 'Put the intervals in order of increasing length'),
    title: L('qisqasidan uzuniga', 'от короткого к длинному', 'from the shortest to the longest'),
    ok: L("To'g'ri. Uzunlik chekkalar ayirmasi, oraliq qayerda turgani emas.", 'Верно. Длина это разность концов, а не то, где промежуток стоит.', 'Correct. Length is the difference of the ends, not where the interval sits.'),
    bad: L('Uzunlik ayirish bilan hisoblanadi, qaysi oraliq chaproq ekaniga qaralmaydi.', 'Длину считают вычитанием, а не смотрят, какой промежуток левее.', 'Length is computed by subtracting, not by seeing which interval is further left.'),
    items: ['(1; 5)', '(−1; 7)', '(2; 4)', '(0; 3)'],
    answer: '(2; 4)  (0; 3)  (1; 5)  (−1; 7)',
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
    A('mount', "To'rt qator. Xato erta paydo bo'ldi, keyin uni hech kim sezmadi.", 'Четыре строки. Ошибка появилась рано, и дальше её никто не заметил.', 'Four lines. The mistake appeared early, and after that nobody noticed it.'),
    A('next', 'Keyin teskari masala: javobga qarab tengsizlikni tiklang.', 'Дальше обратная задача: по ответу восстанови неравенство.', 'Next comes the reverse task: rebuild the inequality from its answer.'),
  ],
  hint: {
    r1: L("Dastlabki tengsizlik, bu yerda xato bo'lishi mumkin emas.", 'Исходное неравенство, здесь ошибки быть не может.', 'The original inequality, no mistake can live here.'),
    r2: L("Kasr yo'qoldi. O'zingizdan so'rang: unga nima qilishdi?", 'Дробь исчезла. Спроси себя, что с ней сделали.', 'The fraction vanished. Ask yourself what was done to it.'),
    r3: L("Oldingi qatordan bu to'g'ri kelib chiqadi, lekin qatorning o'zi noto'g'ri.", 'Из предыдущей строки это следует верно, но сама она уже неверна.', 'This follows correctly from the previous line, but that line is already wrong.'),
  },
  proof: L("Nolni birinchi qatorga qo'ying: minus nol butun besh o'ndan chiqadi.", 'Подставь ноль в первую строку: выйдет минус ноль целых пять десятых.', 'Substitute zero into the first line: minus zero point five comes out.'),
  entry: {
    prompt: L('Bu javobdagi qaysi son yaramaydi?', 'Какое число из этого ответа не подходит?', 'Which number from this answer does not fit?'),
    ok: L('Nol. U olingan javobga kiradi, dastlabki tengsizlikni esa qanoatlantirmaydi.', 'Ноль. Он входит в полученный ответ, а исходному неравенству не удовлетворяет.', 'Zero. It belongs to the answer obtained, yet it does not satisfy the original inequality.'),
    hint: [
      L('Minus bir bilan ikki orasidagi istalgan sonni oling.', 'Возьми любое число между минус единицей и двойкой.', 'Take any number between minus one and two.'),
      L("Hisoblash uchun eng qulay son aynan o'sha yerda yotadi.", 'Самое удобное для счёта число как раз там и лежит.', 'The most convenient number to compute with lies right there.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
  row: {
    r1: '(x + 1)/(x − 2) > 0',
    r2: 'x + 1 > 0',
    r3: 'x > −1',
    r4: 'x ∈ (−1; +∞)',
  },
  answerId: 'r2',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Teskari yo'l", 'Обратный ход', 'The other direction'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskarisiga. Avval javobga qarab maxraj nolini ayting.', 'Теперь наоборот. Сначала по ответу назови ноль знаменателя.', 'Now the other way round. First name the zero of the denominator from the answer.'),
    A('work', "Keyin tengsizlik to'g'ri bo'ladigan barcha sonlarni belgilang.", 'Потом отметь все числа, при которых неравенство верно.', 'Then mark every number for which the inequality holds.'),
  ],
  multi: {
    prompt: L("Yechim bo'lgan barcha sonlarni belgilang", 'Отметь все числа, которые являются решениями', 'Mark every number that is a solution'),
    title: L('ular aynan ikkita', 'их ровно два', 'there are exactly two'),
    ok: L("To'g'ri. Chekka bo'laklardagi sonlar yaraydi, o'rtadagi bo'lak tushib qoladi.", 'Верно. Годятся числа из крайних участков, средний участок отпадает.', 'Correct. Numbers from the outer pieces fit, the middle piece drops out.'),
    items: [
      { id: 'c', label: '0', hint: L("Nol o'rtadagi bo'lakda yotadi, u yerda esa minus.", 'Ноль лежит в среднем участке, а там знак минус.', 'Zero lies in the middle piece, and the sign there is minus.') },
      { id: 'd', label: '2', hint: L("Bu nuqtada maxraj nolga teng, kasr umuman yo'q.", 'В этой точке знаменатель равен нулю, дроби просто нет.', 'At this point the denominator is zero, so there is no fraction at all.') },
      { id: 'a', label: '−5', ok: true },
      { id: 'b', label: '3', ok: true },
    ],
  },
  entry: {
    prompt: L('Mana tengsizlikning javobi. Maxraj qaysi iksda nolga teng?', 'Вот ответ неравенства. При каком икс знаменатель равен нулю?', 'Here is the answer of an inequality. For which x is the denominator zero?'),
    ok: L("Ikki. Bu nuqta ochiq, demak aynan o'sha yerda maxraj nolga aylanadi.", 'Два. Эта точка выколота, значит именно там знаменатель обращается в ноль.', 'Two. That point is punched out, so the denominator turns to zero exactly there.'),
    hint: [
      L("Qaysi chegara ochiq, qaysi biri bo'yalganiga qarang.", 'Посмотри, какая граница выколота, а какая закрашена.', 'Look at which boundary is hollow and which is filled.'),
      L('Ochiq chegara doim maxrajdan keladi.', 'Выколотая граница всегда приходит от знаменателя.', 'A hollow boundary always comes from the denominator.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    expr: 'x < −1;  x > 2',
    answer: '2',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'tochku-ne-vykololi',
  audio: [
    A('mount', "Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi.", 'Четыре вопроса подряд. Считается первая попытка.', 'Four questions in a row. The first attempt counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Ikki har xil son o'qni necha bo'lakka bo'ladi?", 'На сколько участков делят ось два разных числа?', 'Into how many pieces do two different numbers cut the axis?'),
      done: '3',
      items: [
        { id: 'a', label: L('uchga', 'на три', 'into three'), correct: true },
        { id: 'b', label: L('ikkiga', 'на два', 'into two'), hint: L("Ikki bo'lakni bitta son berardi, ular esa ikkita.", 'Два куска дало бы одно число, а их два.', 'Two pieces would come from one number, and there are two.') },
        { id: 'c', label: L("to'rtga", 'на четыре', 'into four'), hint: L("To'rt bo'lakni uch son beradi.", 'Четыре куска дают три числа.', 'Four pieces come from three numbers.') },
        { id: 'd', label: L('beshga', 'на пять', 'into five'), hint: L("Bo'laklar doim sonlardan bittaga ko'p.", 'Кусков всегда на один больше, чем чисел.', 'There is always one piece more than there are numbers.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Maxraj nol bo'lgan nuqta bilan nima qilinadi?", 'Что делают с точкой, где знаменатель ноль?', 'What is done with the point where the denominator is zero?'),
      done: 'g(x) ≠ 0',
      items: [
        { id: 'a', label: L('doim ochiq qoldiriladi', 'выкалывают всегда', 'it is always punched out'), correct: true },
        { id: 'b', label: L("qat'iy bo'lmagan ishorada kiritiladi", 'включают при нестрогом знаке', 'it is included when the sign is not strict'), hint: L("Qat'iy bo'lmagan ishora surat nolining taqdirini o'zgartiradi, maxrajnikini emas.", 'Нестрогий знак меняет судьбу нуля числителя, а не знаменателя.', 'A non-strict sign changes the fate of the numerator zero, not the denominator one.') },
        { id: 'c', label: L('doim kiritiladi', 'включают всегда', 'it is always included'), hint: L("U holda nolga bo'lishga to'g'ri kelardi.", 'Тогда пришлось бы делить на ноль.', 'Then you would have to divide by zero.') },
        { id: 'd', label: L("surat ishorasiga bog'liq", 'зависит от знака числителя', 'it depends on the sign of the numerator'), hint: L("Surat bunga umuman ta'sir qilmaydi.", 'Числитель на это не влияет вовсе.', 'The numerator has no bearing on this at all.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Yozuvni nechta butun son qanoatlantiradi?', 'Сколько целых чисел удовлетворяет записи?', 'How many whole numbers satisfy this?'),
      done: '−2 < x < 3',
      items: [
        { id: 'a', label: L("to'rt", 'четыре', 'four'), correct: true, ok: L("To'rtta. Bular minus bir, nol, bir va ikki.", 'Четыре. Это минус один, ноль, один и два.', 'Four. They are minus one, zero, one and two.') },
        { id: 'b', label: L('besh', 'пять', 'five'), hint: L("Chegaralar kirmaydi, ishoralar qat'iy.", 'Границы не входят, знаки строгие.', 'The boundaries are out, the signs are strict.') },
        { id: 'c', label: L('uch', 'три', 'three'), hint: L('Nolni unutmang, u ham butun son.', 'Не забудь про ноль, он тоже целое число.', 'Do not forget zero, it is a whole number too.') },
        { id: 'd', label: L('olti', 'шесть', 'six'), hint: L('Olti ikkala chegara ham kirganda chiqardi.', 'Шесть вышло бы, если бы вошли обе границы.', 'Six would come if both boundaries were included.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Ikkala tarafni maxrajga ko'paytirish mumkinmi?", 'Можно ли умножить обе части на знаменатель?', 'Can both sides be multiplied by the denominator?'),
      done: 'f(x)/g(x) > 0',
      items: [
        { id: 'a', label: L("yo'q, ishora ag'darilishi mumkin", 'нет, знак может перевернуться', 'no, the sign may flip'), correct: true },
        { id: 'b', label: L('ha, doim', 'да, всегда', 'yes, always'), hint: L("Bu tenglama uchun to'g'ri, tengsizlik uchun emas.", 'Это верно для уравнения, но не для неравенства.', 'That holds for an equation, not for an inequality.') },
        { id: 'c', label: L("ha, agar maxraj nol bo'lmasa", 'да, если знаменатель не ноль', 'yes, if the denominator is not zero'), hint: L("Nol emas, lekin manfiy bo'lishi mumkin, va bu yetarli.", 'Не ноль, но может быть отрицательным, и этого достаточно.', 'Not zero, but it can be negative, and that is enough.') },
        { id: 'd', label: L("ha, agar surat musbat bo'lsa", 'да, если числитель положителен', 'yes, if the numerator is positive'), hint: L("Suratning bunga aloqasi yo'q, ishora maxrajdan olinadi.", 'Числитель тут ни при чём, знак берут у знаменателя.', 'The numerator is not involved, the sign comes from the denominator.') },
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
    A('mount', "Taxmin bitta va ikki bo'lak haqida edi. Nima chiqqanini ko'ramiz.", 'Прогноз был про один кусок и два. Посмотрим, что вышло.', 'The guess was about one piece and two. Let us see how it turned out.'),
    A('next', "Javob ikki bo'lakdan. Maxrajga ko'paytirish ularni bittaga yopishtirib, yarmini yo'qotgan.", 'Ответ из двух кусков. Умножение на знаменатель склеило их в один и потеряло половину.', 'The answer has two pieces. Multiplying by the denominator glued them into one and lost half of it.'),
  ],
  can: [
    L('Surat va maxraj nollarini topaman', 'Нахожу нули числителя и знаменателя', 'I find the zeros of the numerator and denominator'),
    L("O'qni belgilab, har bo'lakka ishora qo'yaman", 'Размечаю ось и ставлю знак на каждом участке', 'I mark up the axis and put a sign on every piece'),
    L("Maxrajga ko'paytirib bo'lmasligini bilaman", 'Знаю, что на знаменатель умножать нельзя', 'I know you cannot multiply by the denominator'),
    L("Maxraj nol bo'lgan nuqtani ochiq qoldiraman", 'Выкалываю точку, где знаменатель ноль', 'I punch out the point where the denominator is zero'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of problem is closed.'),
    gap: L("Bir joy takrorlashni talab qiladi: bo'laklardagi ishoralar.", 'Одно место требует повтора: знаки на участках.', 'One spot needs a second look: the signs on the pieces.'),
    back: L('Qoidaga va beshinchi ekranga qayting.', 'Вернись к правилу и к экрану 5.', 'Go back to the rule and to screen five.'),
  },
  bridge: L("Keyin logarifmlar: yechishdan oldin ifodani yig'ish kerak bo'ladi.", 'Дальше логарифмы: выражение надо будет свернуть, прежде чем решать.', 'Next come logarithms: an expression will have to be folded up before solving.'),
  lifehack: L("Kasr va tengsizlik ishorasini ko'rsangiz, darrov nollarni izlang. Ko'paytiradigan narsa yo'q.", 'Увидел дробь и знак неравенства, сразу ищи нули. Умножать нечего.', 'When you see a fraction and an inequality sign, look for the zeros right away. There is nothing to multiply.'),
  sheetTitle: L('Ratsional tengsizliklar · shpargalka', 'Рациональные неравенства · шпаргалка', 'Rational inequalities · cheat sheet'),
  sheetSrc: L('10-sinf · 33-dars', '10 класс · урок 33', 'Grade 10 · lesson 33'),
  hook: {
    a: 'x > −1',
    b: 'x < −1;  x > 2',
  },
  proved: 'x < −1;  x > 2',
  law: 'f(x)/g(x) > 0,   g(x) ≠ 0',
  sheet: [
    'f(x) = 0',
    'g(x) = 0',
    '(−)/(−) = (+)',
    '(+)/(−) = (−)',
    'x < −1;  x > 2',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => {
  const t = String(s).replace(/−/g, '-').replace(',', '.')
  if (t.indexOf('/') !== -1) {
    const p = t.split('/')
    return parseFloat(p[0]) / parseFloat(p[1])
  }
  return parseFloat(t)
}

// ОСЬ ОДНА НА ВЕСЬ УРОК. Окно не меняется от экрана к экрану: минус единица и
// двойка обязаны стоять на одном и том же месте, иначе «участок слева» на
// экране 3 и «участок слева» на экране 7 -- разные картинки.
const AXIS = { lo: -5, hi: 5, ticks: [-4, -2, 0, 2, 4] }

// НУЛИ. Сверху -- ноль числителя, снизу -- ноль знаменателя. Вид у них разный:
// закрашенный входит в ответ при нестрогом знаке, выколотый не входит никогда.
const ZEROS = [{ v: -1, kind: 'num' }, { v: 2, kind: 'den' }]
const SIGNS = [
  { from: -5, to: -1, sign: '+' },
  { from: -1, to: 2, sign: '−' },
  { from: 2, to: 5, sign: '+' },
]
// Строгий знак: обе границы выколоты.
const SOL_STRICT = [{ from: -5, to: -1, openR: true }, { from: 2, to: 5, openL: true }]
// Нестрогий: ноль ЧИСЛИТЕЛЯ входит, ноль знаменателя -- нет.
const SOL_SOFT = [{ from: -5, to: -1, openR: false }, { from: 2, to: 5, openL: true }]

// Учебник, стр. 75, 3-misol: три нуля, четыре участка.
const ZEROS_BOOK = [{ v: -2, kind: 'num' }, { v: 0, kind: 'den' }, { v: 2, kind: 'num' }]

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

const ORD4 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S4.order[id] }))
const ORD10 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S10.order[id] }))
const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

// ДВА КАДРА НА ЗАПИСИ. Там, где ленты знаков нет, работает прибор 2.
const Pair = ({ a, b, phase, items }) => (
  <Cols l={1} r={1}>
    <Col>
      <Panel tone="paper">
        <Expr size="big">{phase === 0 ? a : b}</Expr>
      </Panel>
    </Col>
    <Col><NoteList items={items} /></Col>
  </Cols>
)

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Ось ПУСТАЯ: нулей ещё нет. Прогноз делается до разметки.
        fig={() => <Scene fig={<DomainBand step={0} zeros={[]} {...AXIS} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.2}>
        <Col>
          <Panel tone="paper">
            <Expr size="big">{S2.items[2].done}</Expr>
          </Panel>
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
      /* ПРИБОР 5 в режиме ленты. Нули падают на ось и режут её; знаков пока
         нет -- в кадре движется один объект. */
      <Scene
        fig={<DomainBand step={phase} zeros={ZEROS} {...AXIS} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={1} zeros={ZEROS} {...AXIS} />} max={300} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S3.work.prompt}
            answer={num(S3.work.answer)}
            okText={S3.work.ok}
            hints={S3.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      <Pair a={S4.frameA} b={S4.frameB} phase={phase} items={S4.show[phase]} />
    ) : (
      <OrderRow
        prompt={S4.order.prompt}
        items={ORD4}
        answer={['s1', 's2', 's3', 's4']}
        okText={S4.order.ok}
        badText={S4.order.bad}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      /* СВИДЕТЕЛЬ УРОКА. Знаки встают ПО ОДНОМУ: `pick` растёт вместе с
         кадром, и каждый знак приходит вслед за своим числом. */
      <Scene
        fig={<DomainBand step={1} zeros={ZEROS} signs={SIGNS} pick={phase === 0 ? 1 : 3} {...AXIS} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={1} zeros={ZEROS} signs={SIGNS} pick={3} {...AXIS} />} max={300} />
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
      /* Задание учебника. Сначала запись, потом ДРУГАЯ ось: нулей три. */
      phase === 0 ? (
        <Pair a={S6.frameA} b={S6.frameB} phase={phase} items={S6.show[phase]} />
      ) : (
        <Scene
          fig={<DomainBand step={1} zeros={ZEROS_BOOK} {...AXIS} />}
          note={<NoteList items={S6.show[phase]} />}
        />
      )
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={1} zeros={ZEROS_BOOK} {...AXIS} />} max={300} />
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
      /* Ответ ЗАКРАШЕН, и видно, что дыра вырезана изнутри: слева граница
         закрашена, справа выколота. */
      <Scene
        fig={<DomainBand step={1} zeros={ZEROS} signs={SIGNS} pick={3} sol={SOL_SOFT} {...AXIS} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene
            fig={<DomainBand step={1} zeros={ZEROS} signs={SIGNS} pick={3} sol={SOL_SOFT} {...AXIS} />}
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
        // Ответ закрашивается в момент ответа: правило открывается рядом с тем
        // движением, которое его и породило.
        fig={(solved) => (
          <Scene
            fig={(
              <DomainBand
                step={1} zeros={ZEROS} signs={SIGNS} pick={3}
                sol={solved ? SOL_STRICT : []} {...AXIS}
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
      <>
        <Expr size="mid" style={{ marginBottom: 6 }}>{S10.expr}</Expr>
        <OrderRow
          prompt={S10.order.prompt}
          items={ORD10}
          answer={['s1', 's2', 's3', 's4']}
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
          {/* Дан ГОТОВЫЙ ответ, ищется причина: где выколото. */}
          <Scene fig={<DomainBand step={1} zeros={[]} sol={SOL_STRICT} signs={[]} {...AXIS} />} max={250} h={190} />
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
            fig={(
              <DomainBand
                step={1} zeros={ZEROS} signs={SIGNS} pick={round >= 1 ? 3 : 0}
                sol={round >= 2 ? SOL_STRICT : []} {...AXIS}
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
