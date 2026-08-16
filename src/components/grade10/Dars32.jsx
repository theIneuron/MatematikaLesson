// ============================================================================
// 10-sinf, Dars 32. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS32_KONTENT.md
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
const LESSON_NO = 32
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Irratsional tenglamalar`,
  `Урок ${LESSON_NO}. Иррац. уравнения`,
  `Lesson ${LESSON_NO}. Irrational equations`,
)

const BLOCK = { label: 'B5', from: 26, to: 37, current: 32 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TENGLAMA', 'УРАВНЕНИЕ', 'THE EQUATION'),
  title: L('Ikkala son yoki faqat bittasi', 'Оба числа или только одно', 'Both numbers or only one'),
  audio: [
    A('mount', "Chapda ildiz, o'ngda iks. Yechim kvadrat tenglamaga olib keladi, u esa ikki son beradi, uch va minus ikki.", 'Слева корень, справа икс. Решение приводит к квадратному уравнению, и оно даёт два числа, три и минус два.', 'On the left a square root, on the right x. Solving leads to a quadratic equation, and it gives two numbers, three and minus two.'),
    A('r1', "Birinchi yozuv ildiz ikkita deydi: ikkala son ham to'g'ri amallar bilan olingan.", 'Первая запись говорит, что корня два: оба числа получены верными действиями.', 'The first reading says there are two roots: both numbers came from correct steps.'),
    A('r2', 'Ikkinchisi ildiz bitta, ikkinchi son esa javobga yaramaydi deydi.', 'Вторая говорит, что корень один, а второе число в ответ не годится.', 'The second says there is one root, and the second number does not belong in the answer.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi ikkala sonni qo'yib tekshiramiz.", 'Твой ответ записан. Сейчас проверим оба числа подстановкой.', 'Your answer is saved. Now we will substitute both numbers and check.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('ikkala son ham yaraydi', 'оба числа подходят', 'both numbers fit'),
      value: '3;  −2',
    },
    b: {
      name: L('faqat bittasi yaraydi', 'подходит только одно', 'only one of them fits'),
      value: '3',
    },
  },
  expr: '√(x + 6) = x',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Tenglamadan oldin uch savol', 'Три вопроса перед уравнением', 'Three questions before the equation'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Manfiy bo'lmagan sonning kvadrat ildizi kvadrati nechaga teng?", 'Чему равен квадрат квадратного корня из неотрицательного числа?', 'What does the square of a square root of a non-negative number equal?'),
      done: '(√a)² = a,  a ≥ 0',
      items: [
        { id: 'a', label: L("sonning o'ziga", 'самому числу', 'the number itself'), correct: true },
        { id: 'b', label: L('ikkilangan songa', 'удвоенному числу', 'twice the number'), hint: L("Ikkilanish ildizni o'ziga qo'shganda chiqardi, kvadratga ko'targanda emas.", 'Удвоение вышло бы при сложении корня с самим собой, а не при возведении.', 'Doubling would come from adding the root to itself, not from squaring.') },
        { id: 'c', label: L('son kvadratiga', 'квадрату числа', 'the square of the number'), hint: L("Ildiz va kvadrat bir-birini so'ndiradi, qo'shilmaydi.", 'Корень и квадрат гасят друг друга, а не складываются.', 'The root and the square cancel each other, they do not stack.') },
        { id: 'd', label: L('sonning yarmiga', 'половине числа', 'half the number'), hint: L("To'qqizda tekshiring: ildiz uch, uning kvadrati yana to'qqiz.", 'Проверь на девятке: корень три, его квадрат снова девять.', 'Check on nine: the root is three, and its square is nine again.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Kvadrat ildiz qiymati qanday bo'lishi mumkin?", 'Каким может быть значение квадратного корня?', 'What can the value of a square root be?'),
      done: '√a ≥ 0',
      items: [
        { id: 'a', label: L("manfiy bo'lmagan", 'неотрицательным', 'non-negative'), correct: true },
        { id: 'b', label: L('har qanday', 'любым', 'any'), hint: L("Ildizning manfiy qiymati hech qachon bo'lmaydi.", 'Отрицательного значения у корня не бывает никогда.', 'A root never takes a negative value.') },
        { id: 'c', label: L('faqat musbat', 'только положительным', 'only positive'), hint: L('Nol ham yaraydi: noldan ildiz nolga teng.', 'Ноль тоже годится: корень из нуля равен нулю.', 'Zero works too: the root of zero is zero.') },
        { id: 'd', label: L('faqat butun', 'только целым', 'only a whole number'), hint: L('Ikkidan ildiz butun emas, lekin u mavjud.', 'Корень из двух не целый, но он существует.', 'The root of two is not whole, yet it exists.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Topilgan sonni tekshirish nima degani?', 'Что значит проверить найденное число?', 'What does it mean to check a number you found?'),
      done: '√(x + 6) = x',
      items: [
        { id: 'a', label: L("uni dastlabki tenglamaga qo'yish", 'подставить его в исходное уравнение', 'substitute it into the original equation'), correct: true },
        { id: 'b', label: L("kvadratga ko'targandan keyingi tenglamaga qo'yish", 'подставить в уравнение после возведения', 'substitute it into the equation after squaring'), hint: L('U yerda ikkala son ham yaraydi, shuning uchun bunday tekshirish hech nimani ajratmaydi.', 'Там подойдут оба числа, поэтому такая проверка ничего не различает.', 'Both numbers fit there, so that check tells them apart in no way.') },
        { id: 'c', label: L("o'sha amallarni yana bir marta takrorlash", 'повторить те же действия ещё раз', 'repeat the same steps once more'), hint: L("O'sha amallar o'sha natijani beradi, ortiqcha son bilan birga.", 'Те же действия дадут тот же результат, включая лишнее число.', 'The same steps give the same result, extra number included.') },
        { id: 'd', label: L("butunligini ko'rish", 'посмотреть, целое ли оно', 'look at whether it is whole'), hint: L("Butun son ortiqcha ham, haqiqiy ildiz ham bo'lishi mumkin.", 'Целым бывает и лишнее число, и настоящий корень.', 'A whole number can be the extra one and can be a true root.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Shart kvadratga ko'tarishdan oldin yoziladi", 'Условие пишут до возведения', 'The condition is written before squaring'),
  tag: 'postoronniy-koren',
  show: [
    [
      L("ildiz ostida manfiy bo'lmagan: iks qo'shuv olti", 'под корнем неотрицательное: икс плюс шесть', 'under the root a non-negative value: x plus six'),
      L("chapda ildiz, demak o'ngda ham noldan kichik emas", 'слева корень, значит справа тоже не меньше нуля', 'on the left a root, so the right side is not less than zero either'),
      L('ikkala shart bir vaqtda bajarilishi kerak', 'оба условия должны выполняться сразу', 'both conditions must hold at once'),
    ],
    [
      L("ikkalasi ham to'g'ri bo'lgan joy bo'yalgan", 'закрашено там, где верно и то и другое', 'the shading is where both hold'),
      L('polosa noldan boshlanadi', 'полоса начинается с нуля', 'the band starts at zero'),
      L("manfiy sonlarga joy yo'q", 'отрицательным числам места нет', 'negative numbers have no place'),
    ],
  ],
  motion: ['band'],
  audio: [
    A('mount', "Tenglama tagida polosa paydo bo'ldi. U qaysi iks umuman ildiz bo'la olishini ko'rsatadi.", 'Под уравнением появилась полоса. Она показывает, какие икс вообще могут оказаться корнем.', 'A band appeared under the equation. It shows which x can be a root at all.'),
    A('band', "Shart ikkita, va ikkalasi ham yozuvda ko'rinib turibdi. Ildiz ostida iks qo'shuv olti turadi, demak bu ifoda noldan kichik emas, bundan iks minus oltidan kichik emas. Lekin chapda ildiz turadi, ildiz esa manfiy bo'lmaydi. Demak o'ngda ham, ya'ni iksning o'zi ham noldan kichik emas. Ikkinchi shart birinchisidan qattiqroq, shuning uchun faqat noldan o'ngdagi bo'yaladi. Polosa kvadratga ko'tarishdan oldin chizilgan, va asosiysi shu: ko'targandan keyin shart yozuvdan yo'qoladi, masaladan esa hech qayerga ketmaydi.", 'Условий два, и оба видны прямо в записи. Под корнем стоит икс плюс шесть, значит это выражение не меньше нуля, отсюда икс не меньше минус шести. Но слева стоит корень, а корень отрицательным не бывает. Значит и справа, то есть сам икс, не меньше нуля. Второе условие строже первого, поэтому закрашивается только то, что правее нуля. Полоса начерчена до возведения в квадрат, и это главное: после возведения условие исчезнет из записи, а из задачи никуда не денется.', 'There are two conditions, and both are visible right in the equation. Under the root stands x plus six, so that expression is not less than zero, which gives x not less than minus six. But on the left stands a root, and a root is never negative. So the right side, that is x itself, is not less than zero either. The second condition is stricter than the first, so only what lies to the right of zero gets shaded. The band was drawn before squaring, and that is the point: after squaring the condition disappears from the writing, but it does not disappear from the problem.'),
    A('work', "O'zingiz hisoblang. Bo'yalgan polosa qaysi sondan boshlanadi?", 'Посчитай сам. С какого числа начинается закрашенная полоса?', 'Work it out yourself. From which number does the shaded band start?'),
  ],
  work: {
    prompt: L('Polosa qaysi sondan boshlanadi?', 'С какого числа начинается полоса?', 'From which number does the band start?'),
    ok: L('Noldan. Iks noldan kichik emas sharti iks minus oltidan kichik emas shartidan qattiqroq, shuning uchun u yutadi.', 'С нуля. Условие икс не меньше нуля строже, чем икс не меньше минус шести, поэтому побеждает оно.', 'From zero. The condition x not less than zero is stricter than x not less than minus six, so it wins.'),
    hint: [
      L("Ildiz ostidagi ifoda uchun va alohida o'ng taraf uchun shartni yozing.", 'Выпиши условие для подкоренного выражения и отдельно для правой части.', 'Write the condition for the expression under the root and separately for the right side.'),
      L("Ikkala shart bir vaqtda bajarilishi kerak, demak qattiqrog'i olinadi.", 'Оба условия должны выполняться сразу, значит берут более строгое.', 'Both must hold at once, so the stricter one is taken.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'order',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Kvadratga ko'tarish plyus va minusni yopishtiradi", 'Возведение склеивает плюс и минус', 'Squaring glues plus and minus together'),
  tag: 'postoronniy-koren',
  show: [
    [
      L("ataylab noto'g'ri tenglikni olamiz", 'берём заведомо неверное равенство', 'take an equality that is knowingly false'),
      L('minus ikki ikkiga teng emas', 'минус два не равно двум', 'minus two does not equal two'),
      L("ikkala tarafni kvadratga ko'taramiz", 'возводим обе части в квадрат', 'square both sides'),
    ],
    [
      L("chapda to'rt, o'ngda to'rt", 'слева четыре, справа четыре', 'four on the left, four on the right'),
      L("tenglik to'g'ri bo'lib qoldi", 'равенство стало верным', 'the equality became true'),
      L("teskarisiga bunday qaytib bo'lmaydi", 'обратно так вернуться нельзя', 'there is no way back'),
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', 'Tenglamadan chetlanib, ikki songa qaraymiz. Minus ikki va ikkini olamiz.', 'Отвлечёмся от уравнения на два числа. Возьмём минус два и два.', 'Let us step away from the equation and look at two numbers. Take minus two and two.'),
    A('two', "Minus ikki va ikki har xil sonlar, ular orasidagi tenglik noto'g'ri. Ikkala tarafni kvadratga ko'taramiz. Chapda to'rt, o'ngda to'rt, tenglik to'g'ri bo'lib qoldi. Kvadratga ko'tarish shuni qiladi: noto'g'ridan to'g'ri yasay oladi. Demak aksincha ham, ko'targandan keyin tenglamaning ildizlari avvalgidan ko'p bo'lib chiqishi mumkin. Ortiqchalari o'sha to'rt kelgan joydan keladi. Shuning uchun biz oladigan kvadrat tenglamani dastlabkisining natijasi deyishadi, o'sha tenglamaning o'zi emas.", 'Минус два и два это разные числа, равенство между ними неверно. Возведём обе части в квадрат. Слева четыре, справа четыре, равенство стало верным. Вот что делает возведение: из неверного оно способно сделать верное. Значит и наоборот, у уравнения после возведения корней может оказаться больше, чем было. Лишние приходят оттуда же, откуда пришла эта четвёрка. Поэтому квадратное уравнение, которое мы получим, называют следствием исходного, а не тем же самым уравнением.', 'Minus two and two are different numbers, and the equality between them is false. Square both sides. Four on the left, four on the right, and the equality became true. That is what squaring does: it can turn a false statement into a true one. So the other way round, an equation after squaring can end up with more roots than it had. The extra ones come from exactly where that four came from. This is why the quadratic equation we are about to get is called a consequence of the original, not the same equation.'),
    A('work', "Bu sodir bo'lgan tartibda qadamlarni joylashtiring.", 'Расставь шаги в том порядке, в котором это произошло.', 'Put the steps in the order in which this happened.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring', 'Расставь шаги по порядку', 'Put the steps in order'),
    s1: L("tenglik noto'g'ri", 'равенство неверно', 'the equality is false'),
    s2: L("kvadratga ko'taramiz", 'возводим в квадрат', 'square both sides'),
    s3: L("tenglik to'g'ri bo'ldi", 'равенство стало верным', 'the equality became true'),
    s4: L("yechim ko'paydi", 'решений стало больше', 'more solutions than before'),
    ok: L("To'g'ri. Ko'tarish plyus va minus orasidagi farqni yo'qotmaydi, uni yashiradi.", 'Верно. Возведение не отменяет разницу между плюсом и минусом, оно её прячет.', 'Correct. Squaring does not remove the difference between plus and minus, it hides it.'),
    bad: L("Ko'tarishdan oldin nima bo'lganidan boshlang, keyinidan emas.", 'Начни с того, что было до возведения, а не после.', 'Start with what was there before squaring, not after.'),
    mark: '(−2)² = 2²',
  },
  frameA: '−2 ≠ 2',
  frameB: '(−2)² = 2²   →   4 = 4',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Uch va minus ikki qayerga tushadi', 'Куда падают три и минус два', 'Where three and minus two land'),
  tag: 'postoronniy-koren',
  show: [
    [
      L('kvadrat tenglama ikki son berdi', 'квадратное уравнение дало два числа', 'the quadratic equation gave two numbers'),
      L('uchlik polosa ichiga tushadi', 'тройка падает внутрь полосы', 'the three lands inside the band'),
      L('minus ikki noldan chapga tushadi', 'минус два падает левее нуля', 'minus two lands to the left of zero'),
    ],
    [
      L('uchlik qoladi', 'тройка остаётся', 'the three stays'),
      L("minus ikki so'nadi", 'минус два гаснет', 'minus two fades out'),
      L('javobda bitta son', 'в ответе одно число', 'one number in the answer'),
    ],
  ],
  motion: ['fall'],
  audio: [
    A('mount', "Tenglamaga qaytamiz. Kvadrat tenglama uch va minus ikki berdi. Polosa joyida, ular qayerga tushishini ko'ramiz.", 'Возвращаемся к уравнению. Квадратное дало три и минус два. Полоса на месте, посмотрим, куда они упадут.', 'Back to the equation. The quadratic gave three and minus two. The band is in place, let us see where they land.'),
    A('fall', "Uchlik bo'yalgan polosa ichiga tushadi. Uni dastlabki tenglamaga qo'yamiz: ildiz ostida to'qqiz, to'qqizdan ildiz uch, o'ngda ham uch. Tenglik to'g'ri, uchlik ildiz. Minus ikki noldan chapga, polosadan tashqariga tushadi va so'nadi. Uni ham qo'yamiz: ildiz ostida to'rt, to'rtdan ildiz ikki, o'ngda esa minus ikki. Ikki va minus ikki har xil sonlar, tenglik noto'g'ri. E'tibor bering, minus ikki yo'lda buzilgani yo'q. U hech qachon yaroqli bo'lmagan: o'ngda iks turadi, ildiz esa manfiy bo'lmaydi.", 'Тройка падает внутрь закрашенной полосы. Подставим её в исходное уравнение: под корнем девять, корень из девяти три, справа тоже три. Равенство верное, тройка корень. Минус два падает левее нуля, снаружи полосы, и гаснет. Подставим и его: под корнем четыре, корень из четырёх два, а справа минус два. Два и минус два разные числа, равенство неверно. Обрати внимание, минус два не испортилось по дороге. Оно никогда не было допустимым: справа стоит икс, а корень отрицательным не бывает.', 'The three lands inside the shaded band. Substitute it into the original equation: nine under the root, the root of nine is three, and the right side is three too. The equality holds, so three is a root. Minus two lands to the left of zero, outside the band, and fades. Substitute it as well: four under the root, the root of four is two, and the right side is minus two. Two and minus two are different numbers, so the equality fails. Notice that minus two did not go bad along the way. It was never admissible: the right side is x, and a root is never negative.'),
    A('work', "O'zingiz hisoblang. Javobda nechta son qoladi?", 'Посчитай сам. Сколько чисел остаётся в ответе?', 'Work it out yourself. How many numbers stay in the answer?'),
  ],
  work: {
    prompt: L('Javobda nechta ildiz?', 'Сколько корней в ответе?', 'How many roots are in the answer?'),
    ok: L("Bitta. Uchlik tekshiruvdan o'tdi, minus ikki o'tmadi.", 'Один. Тройка прошла проверку, минус два не прошло.', 'One. The three passed the check, minus two did not.'),
    hint: [
      L('Ikki sondan qaysi biri polosa ichida yotganiga qarang.', 'Посмотри, какое из двух чисел лежит внутри полосы.', 'Look at which of the two numbers lies inside the band.'),
      L("Minus ikkini dastlabkisiga qo'ying: chapda ikki, o'ngda minus ikki chiqadi.", 'Подставь минус два в исходное: слева выйдет два, справа минус два.', 'Substitute minus two into the original: two on the left, minus two on the right.'),
      L('Bitta.', 'Один.', 'One.'),
    ],
    answer: '1',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Yig'indidan ildiz bo'linmaydi", 'Корень из суммы не распадается', 'A root of a sum does not split'),
  tag: 'koren-summy',
  show: [
    [
      L("ildiz ostida kvadratlar yig'indisi", 'под корнем сумма квадратов', 'a sum of squares under the root'),
      L("uch va to'rtni olamiz", 'берём тройку и четвёрку', 'take three and four'),
      L("to'qqiz qo'shuv o'n olti", 'девять плюс шестнадцать', 'nine plus sixteen'),
    ],
    [
      L('ildiz ostida yigirma besh', 'под корнем двадцать пять', 'twenty five under the root'),
      L('yigirma beshdan ildiz besh', 'корень из двадцати пяти пять', 'the root of twenty five is five'),
      L("sonlarning o'zi yig'indisi esa yetti", 'а сумма самих чисел семь', 'while the sum of the numbers is seven'),
    ],
  ],
  motion: ['sum'],
  audio: [
    A('mount', "Ildiz istagandek emas, boshqacha ish tutadigan yana bir joy. Ildiz ostida yig'indi.", 'Ещё одно место, где корень ведут себя не так, как хочется. Под корнем сумма.', 'One more place where the root behaves not the way one would like. Under the root there is a sum.'),
    A('sum', "Uch va to'rtni olamiz va ikkala ifodani yonma-yon hisoblaymiz. Chapda ildiz ostida to'qqiz qo'shuv o'n olti, bu yigirma besh, yigirma beshdan ildiz beshga teng. O'ngda uch qo'shuv to'rt, bu yetti. Besh va yetti har xil sonlar, demak kvadratlar yig'indisidan ildiz yig'indiga teng emas. Bu yerda bitta misol yetadi: qoidani bekor qilish uchun u ishlamaydigan bitta holat kifoya.", 'Возьмём тройку и четвёрку и посчитаем оба выражения рядом. Слева под корнем девять плюс шестнадцать, это двадцать пять, корень из двадцати пяти равен пяти. Справа три плюс четыре, это семь. Пять и семь разные числа, значит корень из суммы квадратов не равен сумме. Одного примера здесь хватает: чтобы отменить правило, достаточно одного случая, когда оно не работает.', 'Take three and four and compute both expressions side by side. On the left, under the root, nine plus sixteen, that is twenty five, and the root of twenty five is five. On the right, three plus four, that is seven. Five and seven are different numbers, so the root of a sum of squares is not the sum. One example is enough here: to cancel a rule, a single case where it fails will do.'),
    A('work', "O'zingiz hisoblang. Uch va to'rt kvadratlari yig'indisidan ildiz nechaga teng?", 'Посчитай сам. Чему равен корень из суммы квадратов трёх и четырёх?', 'Work it out yourself. What is the root of the sum of the squares of three and four?'),
  ],
  work: {
    prompt: L('Bu ifoda nechaga teng?', 'Чему равно это выражение?', 'What does this expression equal?'),
    ok: L("Besh. Ildiz ostida yigirma besh, yetti emas: avval qo'shiladi, keyin ildiz chiqariladi.", 'Пять. Под корнем двадцать пять, а не семь: сначала складывают, потом извлекают.', 'Five. Under the root there is twenty five, not seven: first you add, then you take the root.'),
    hint: [
      L('Avval ildiz ostidagini hisoblang.', 'Посчитай сначала то, что стоит под корнем.', 'First compute what stands under the root.'),
      L("To'qqiz qo'shuv o'n olti yigirma beshga teng.", 'Девять плюс шестнадцать равно двадцати пяти.', 'Nine plus sixteen equals twenty five.'),
      L('Besh.', 'Пять.', 'Five.'),
    ],
    expr: '√(3² + 4²)',
    answer: '5',
  },
  frameA: '√(3² + 4²)',
  frameB: '√25 = 5;   3 + 4 = 7',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARAVIY HOL', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Javob har qanday yechimdan oldin ko'rinadi", 'Ответ виден до всякого решения', 'The answer is visible before any solving'),
  tag: 'postoronniy-koren',
  show: [
    [
      L("chapda ildiz, o'ngda minus ikki", 'слева корень, справа минус два', 'on the left a root, on the right minus two'),
      L("ildiz manfiy bo'lmaydi", 'корень не бывает отрицательным', 'a root is never negative'),
      L("polosa hech qayerda bo'yalmaydi", 'полоса не закрасится нигде', 'the band shades nowhere'),
    ],
    [
      L("baribir ko'tarilsa", 'если всё же возвести', 'if one squares anyway'),
      L('besh soni chiqadi', 'получится число пять', 'the number five comes out'),
      L('va u yaramaydi', 'и оно не подойдёт', 'and it does not fit'),
    ],
  ],
  motion: ['stop'],
  audio: [
    A('mount', "Yechish shart bo'lmagan tenglama. O'ng tarafga qarash yetarli.", 'Уравнение, которое решать не надо. Достаточно посмотреть на правую часть.', 'An equation there is no need to solve. Looking at the right side is enough.'),
    A('stop', "Chapda ildiz turadi, u esa hech qachon manfiy bo'lmaydi. O'ngda minus ikki. Demak tenglik hech qanday iksda ham bo'lmaydi, polosa esa hech qayerda bo'yalmaydi. Yechim yo'q, va bu allaqachon javob. Lekin qoida unutilsa va ikkala taraf baribir ko'tarilsa nima bo'lishiga qarang. Chapda iks minus bir, o'ngda to'rt, bundan iks beshga teng. Son olindi, ishonarli ko'rinadi. Qo'yib ko'ramiz: ildiz ostida to'rt, to'rtdan ildiz ikki, o'ngda esa minus ikki. To'g'ri kelmadi. Beshlik butunlay ko'tarishdan tug'ilgan.", 'Слева стоит корень, а он никогда не бывает отрицательным. Справа минус два. Значит равенство невозможно ни при каком икс, и полоса не закрашивается нигде. Решений нет, и это уже ответ. Но посмотри, что будет, если правило забыть и всё же возвести обе части. Слева икс минус один, справа четыре, отсюда икс равен пяти. Число получено, выглядит убедительно. Подставим: под корнем четыре, корень из четырёх два, а справа минус два. Не сходится. Пятёрка целиком порождена возведением.', 'On the left stands a root, and it is never negative. On the right stands minus two. So the equality is impossible for any x, and the band shades nowhere. There are no solutions, and that is already the answer. But look what happens if the rule is forgotten and both sides are squared anyway. On the left x minus one, on the right four, which gives x equal to five. A number has been obtained and it looks convincing. Substitute it: four under the root, the root of four is two, and the right side is minus two. It does not match. The five was born entirely from the squaring.'),
    A('work', "O'zingiz hisoblang. Bu tenglamaning nechta ildizi bor?", 'Посчитай сам. Сколько корней у этого уравнения?', 'Work it out yourself. How many roots does this equation have?'),
  ],
  work: {
    prompt: L('Tenglamaning nechta ildizi bor?', 'Сколько корней у уравнения?', 'How many roots does the equation have?'),
    ok: L("Bitta ham yo'q. Chapda manfiy bo'lmagan, o'ngda manfiy, tenglik hech qachon bo'lmaydi.", 'Ни одного. Слева неотрицательное, справа отрицательное, равенства не будет никогда.', 'None. The left side is non-negative, the right side is negative, so equality never happens.'),
    hint: [
      L("Yechmasdan o'ng taraf ishorasiga qarang.", 'Посмотри на знак правой части, не решая.', 'Look at the sign of the right side without solving.'),
      L("Ildiz manfiy songa teng bo'la olmaydi.", 'Корень не может равняться отрицательному числу.', 'A root cannot equal a negative number.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    expr: '√(x − 1) = −2',
    answer: '0',
  },
  frameA: '√(x − 1) = −2',
  frameB: 'x − 1 = 4   →   x = 5',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Tekshirish yechimning bir qismi', 'Проверка — часть решения', 'The check is part of the solution'),
  tag: 'postoronniy-koren',
  motion: ['rule'],
  audio: [
    A('mount', "Qoidani yig'amiz. U qisqa, ichida uch qadam bor.", 'Соберём правило. Оно короткое, и в нём три шага.', 'Let us put the rule together. It is short and has three steps.'),
    A('rule', "Birinchi qadam: ildiz belgisidan qutulish uchun ikkala taraf darajaga ko'tariladi. Ikkinchisi: o'sha tenglamaning o'zi emas, uning natijasi chiqqanini eslash, natijaning ildizlari esa ko'proq bo'lishi mumkin. Uchinchisi: topilgan har bir sonni dastlabki tenglamaga qo'yish va faqat tenglik to'g'ri bo'lganlarini qoldirish. Tekshirish bu yerda ozodalik emas, yechimning bir qismi. Usiz masala yechilmagan.", 'Первый шаг: обе части возводят в степень, чтобы уйти от знака корня. Второй: помнить, что получилось не то же уравнение, а его следствие, и корней у следствия может быть больше. Третий: каждое найденное число подставить в исходное уравнение и оставить только те, при которых равенство верное. Проверка здесь не аккуратность, а часть решения. Без неё задача не решена.', 'First step: both sides are raised to a power to get rid of the root sign. Second: remember that what came out is not the same equation but its consequence, and a consequence can have more roots. Third: substitute every number found into the original equation and keep only those for which the equality holds. Checking here is not tidiness, it is part of the solution. Without it the problem is not solved.'),
  ],
  probe: {
    question: L("Qo'yib tekshirish nima qiladi?", 'Что делает проверка подстановкой?', 'What does substitution checking do?'),
    items: [
      { id: 'a', label: L("ko'tarish tug'dirgan sonlarni ajratib tashlaydi", 'отсеивает числа, которые породило возведение', 'it filters out numbers that squaring produced'), correct: true },
      { id: 'b', label: L("hisobdagi xatoni to'g'rilaydi", 'исправляет ошибку в вычислениях', 'it fixes a mistake in the calculation'), hint: L("Hisoblar to'g'ri edi. Ortiqcha son xatodan emas, amalning o'zidan paydo bo'ldi.", 'Вычисления были верными. Лишнее число появилось из самого действия, а не из ошибки.', 'The calculation was correct. The extra number came from the operation itself, not from a mistake.') },
    ],
  },
  rule: {
    lawLabel: L('YECHISH QADAMLARI', 'ШАГИ РЕШЕНИЯ', 'THE STEPS'),
    lines: [
      L("ildizdan qutulish uchun ikkala taraf darajaga ko'tariladi", 'обе части возводят в степень, чтобы уйти от корня', 'both sides are raised to a power to get rid of the root'),
      L("olingan tenglama natija, o'sha tenglamaning o'zi emas", 'полученное уравнение это следствие, а не то же самое', 'the equation obtained is a consequence, not the same equation'),
      L("topilgan har bir son dastlabkisiga qo'yiladi", 'каждое найденное число подставляют в исходное', 'every number found is substituted into the original'),
    ],
    law: '√f(x) = g(x)   →   f(x) = g(x)²,   g(x) ≥ 0',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  title: L('Tenglamani ildizi bilan ulang', 'Соедини уравнение с его корнем', 'Match each equation with its root'),
  tag: 'postoronniy-koren',
  audio: [
    A('mount', "To'rt tenglama va to'rt son. Xayolda hisoblang, qo'yib tekshiring.", 'Четыре уравнения и четыре числа. Считай в уме, проверяй подстановкой.', 'Four equations and four numbers. Compute in your head, check by substituting.'),
  ],
  match: {
    prompt: L('Har bir tenglamaning aynan bitta ildizi bor', 'У каждого уравнения ровно один корень', 'Each equation has exactly one root'),
    ok: L("To'g'ri. Birinchi tenglama yechilganda minus ikkini ham beradi, lekin u tekshiruvdan o'tmaydi.", 'Верно. Первое уравнение даёт при решении и минус два, но оно не проходит проверку.', 'Correct. The first equation also yields minus two when solved, but that one fails the check.'),
    left: ['√(x + 6) = x', '√(x + 3) = 2', '√(2x − 1) = 3', '√(x − 4) = 0'],
    a: '3',
    b: '1',
    c: '5',
    d: '4',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L("Tenglamani to'liq yeching", 'Реши уравнение целиком', 'Solve the equation from start to finish'),
  tag: 'postoronniy-koren',
  audio: [
    A('mount', "Endi butun tenglama. To'rt qadam, tartib muhim.", 'Теперь всё уравнение целиком. Четыре шага, порядок важен.', 'Now the whole equation. Four steps, and the order matters.'),
  ],
  order: {
    prompt: L('Yechish qadamlarini tartib bilan joylashtiring', 'Расставь шаги решения по порядку', 'Put the solution steps in order'),
    s1: L('shartni yozish', 'выписать условие', 'write the condition'),
    s2: L("kvadratga ko'tarish", 'возвести в квадрат', 'square both sides'),
    s3: L('kvadrat tenglamani yechish', 'решить квадратное', 'solve the quadratic'),
    s4: L('ikkala sonni tekshirish', 'проверить оба числа', 'check both numbers'),
    ok: L("To'g'ri. Shart birinchi, tekshirish oxirgi, orasida qolgani.", 'Верно. Условие первым, проверка последней, и между ними всё остальное.', 'Correct. The condition first, the check last, and everything else in between.'),
    bad: L("Shart ko'tarishdan oldin yoziladi, aks holda u ildiz belgisi bilan birga yo'qoladi.", 'Условие пишут до возведения, иначе оно исчезнет вместе со знаком корня.', 'The condition is written before squaring, otherwise it vanishes along with the root sign.'),
    mark: 'x = 3',
  },
  expr: '√(x + 6) = x',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Chizmasiz', 'Без чертежа', 'Without a drawing'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring.", 'Прибора нет. Считай на бумаге, потом сверься.', 'No instrument here. Work it out on paper, then compare.'),
    A('next', "Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping.", 'Дальше запись с ошибкой. Найди строку, где она появилась.', 'Next comes a written solution with a mistake. Find the line where it appeared.'),
  ],
  task: {
    ok: L("Yigirma yetti. Ko'tardik, ikki iks minus besh qirq to'qqizga teng bo'ldi.", 'Двадцать семь. Возвели, получили две икс минус пять равно сорока девяти.', 'Twenty seven. Squaring gives two x minus five equals forty nine.'),
    hint: [
      L("Ikkala tarafni kvadratga ko'taring.", 'Возведи обе части в квадрат.', 'Square both sides.'),
      L("O'ngda qirq to'qqiz chiqadi.", 'Справа получится сорок девять.', 'On the right you get forty nine.'),
      L('Yigirma yetti.', 'Двадцать семь.', 'Twenty seven.'),
    ],
    prompt: '√(2x − 5) = 7   →   x = ?',
    answer: '27',
  },
  order: {
    prompt: L("Tenglamalarni ildizi o'sishi bo'yicha joylashtiring", 'Расставь уравнения по возрастанию корня', 'Put the equations in order of increasing root'),
    title: L('kichik ildizdan kattasiga', 'от меньшего корня к большему', 'from the smallest root to the largest'),
    ok: L("To'g'ri. O'ng taraf kattaroq bo'lsa, ildiz kattaroq degani emas.", 'Верно. Правая часть больше не значит корень больше.', 'Correct. A bigger right side does not mean a bigger root.'),
    bad: L("O'ngdagi songa qaramay, har bir tenglamaning ildizini hisoblang.", 'Считай корень каждого уравнения, а не смотри на число справа.', 'Compute the root of each equation instead of looking at the number on the right.'),
    items: ['√(x + 1) = 2', '√(x − 2) = 3', '√(2x) = 4', '√(x + 7) = 1'],
    answer: '√(x + 7) = 1  √(x + 1) = 2  √(2x) = 4  √(x − 2) = 3',
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
    A('mount', "To'rt qator. Barcha amallar to'g'ri, javob esa noto'g'ri. Bu qayerda sodir bo'lganini toping.", 'Четыре строки. Все действия верные, а ответ неверный. Найди, где это произошло.', 'Four lines. Every step is correct and the answer is wrong. Find where that happened.'),
    A('next', 'Keyin teskari masala: javobga qarab tenglamani tiklang.', 'Дальше обратная задача: по ответу восстанови уравнение.', 'Next comes the reverse task: rebuild the equation from its answer.'),
  ],
  hint: {
    r1: L("Dastlabki tenglama, bu yerda xato bo'lishi mumkin emas.", 'Исходное уравнение, здесь ошибки быть не может.', 'The original equation, no mistake can live here.'),
    r2: L("Ko'tarish to'g'ri bajarilgan.", 'Возведение выполнено верно.', 'The squaring was done correctly.'),
    r3: L("Kvadrat tenglama to'g'ri tuzilgan, ildizlar to'g'ri hisoblangan.", 'Квадратное уравнение составлено верно, корни посчитаны верно.', 'The quadratic is set up correctly and its roots are computed correctly.'),
  },
  proof: L("Minus ikkini birinchi qatorga qo'ying: chapda ikki, o'ngda minus ikki chiqadi.", 'Подставь минус два в первую строку: слева выйдет два, справа минус два.', 'Substitute minus two into the first line: two on the left, minus two on the right.'),
  entry: {
    prompt: L('Qaysi son javobga behuda tushgan?', 'Какое число попало в ответ зря?', 'Which number ended up in the answer for nothing?'),
    ok: L("Minus ikki. Barcha amallar to'g'ri, javob esa noto'g'ri: oxirgi qadam yetishmayapti.", 'Минус два. Все действия верные, а ответ неверный: не хватает последнего шага.', 'Minus two. Every step is correct and the answer is wrong: the last step is missing.'),
    hint: [
      L('Xato hisobda emas, oxirgi qatorga qarang.', 'Ошибка не в вычислениях, посмотри на последнюю строку.', 'The mistake is not in the arithmetic, look at the last line.'),
      L("Ikki sondan biri qo'yib tekshirishdan o'tmaydi.", 'Одно из двух чисел не проходит подстановку.', 'One of the two numbers fails the substitution.'),
      L('Minus ikki.', 'Минус два.', 'Minus two.'),
    ],
    answer: '−2',
  },
  row: {
    r1: '√(x + 6) = x',
    r2: 'x + 6 = x²',
    r3: 'x² − x − 6 = 0',
    r4: 'x = 3;  x = −2',
  },
  answerId: 'r4',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Teskari yo'l", 'Обратный ход', 'The other direction'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskarisiga. Avval ildiziga qarab tenglamani tiklang.', 'Теперь наоборот. Сначала восстанови уравнение по его корню.', 'Now the other way round. First rebuild the equation from its root.'),
    A('work', "Keyin umuman ildizi yo'q barcha tenglamalarni belgilang.", 'Потом отметь все уравнения, у которых корней нет вовсе.', 'Then mark every equation that has no roots at all.'),
  ],
  multi: {
    prompt: L('Ildizsiz barcha tenglamalarni belgilang', 'Отметь все уравнения без корней', 'Mark every equation that has no roots'),
    title: L('ular aynan ikkita', 'их ровно два', 'there are exactly two'),
    ok: L("To'g'ri. O'ngdagi manfiy son tenglamani darrov yopadi.", 'Верно. Отрицательное число справа закрывает уравнение сразу.', 'Correct. A negative number on the right closes the equation at once.'),
    items: [
      { id: 'c', label: '√(x + 1) = 3', hint: L("Bu yerda o'ngda musbat son, ildiz topiladi.", 'Здесь справа положительное число, корень найдётся.', 'Here the right side is positive, so a root exists.') },
      { id: 'd', label: '√(x − 2) = 0', hint: L('Nol ildizga yetarli: noldan ildiz nolga teng.', 'Ноль корню доступен: корень из нуля равен нулю.', 'Zero is available to a root: the root of zero is zero.') },
      { id: 'a', label: '√(x + 1) = −3', ok: true },
      { id: 'b', label: '√(x − 2) = −1', ok: true },
    ],
  },
  entry: {
    prompt: L("Tenglamaning ildizi o'n ikkiga teng. Minus ostidagi son nechaga teng?", 'Корень уравнения равен двенадцати. Чему равно число под минусом?', 'The root of the equation is twelve. What is the number after the minus?'),
    ok: L("Uch. Ildiz ostida to'qqiz chiqishi kerak, o'n ikki minus uch esa to'qqiz.", 'Три. Под корнем должно выйти девять, а двенадцать минус три это девять.', 'Three. Under the root there must be nine, and twelve minus three is nine.'),
    hint: [
      L('Uch chiqishi uchun ildiz ostida nima turishi kerak?', 'Что должно стоять под корнем, чтобы получилось три?', 'What must stand under the root for the value to be three?'),
      L("Ildiz ostida to'qqiz, iks esa o'n ikkiga teng.", 'Под корнем девять, а икс равен двенадцати.', 'Nine under the root, and x equals twelve.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    expr: '√(x − a) = 3,   x = 12',
    answer: '3',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'postoronniy-koren',
  audio: [
    A('mount', "Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi.", 'Четыре вопроса подряд. Считается первая попытка.', 'Four questions in a row. The first attempt counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Yettidan ildiz kvadrati nechaga teng?', 'Чему равен квадрат корня из семи?', 'What is the square of the root of seven?'),
      done: '(√7)² = 7',
      items: [
        { id: 'a', label: L('yetti', 'семь', 'seven'), correct: true },
        { id: 'b', label: L("qirq to'qqiz", 'сорок девять', 'forty nine'), hint: L("Qirq to'qqiz yettining o'zini ko'targanda chiqardi.", 'Сорок девять вышло бы, если возвести само семь.', 'Forty nine would come from squaring seven itself.') },
        { id: 'c', label: L("o'n to'rt", 'четырнадцать', 'fourteen'), hint: L("O'n to'rt ikkilantirish, ko'tarish emas.", 'Четырнадцать это удвоение, а не возведение.', 'Fourteen is doubling, not squaring.') },
        { id: 'd', label: L('yettidan ildiz', 'корень из семи', 'the root of seven'), hint: L("Ko'tarish ildiz belgisini olib tashlaydi, qoldirmaydi.", 'Возведение убирает знак корня, а не оставляет его.', 'Squaring removes the root sign, it does not keep it.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Ildiz minus ikkiga teng bo'la oladimi?", 'Может ли корень равняться минус двум?', 'Can a root equal minus two?'),
      done: '√a ≥ 0',
      items: [
        { id: 'a', label: L("yo'q, hech qachon", 'нет, никогда', 'no, never'), correct: true },
        { id: 'b', label: L("ha, agar ildiz ostida manfiy bo'lsa", 'да, если под корнем отрицательное', 'yes, if the value under the root is negative'), hint: L("Ildiz ostida manfiy ham bo'lmaydi, ildiz qiymati esa baribir manfiy emas.", 'Под корнем отрицательного и не бывает, а значение корня всё равно неотрицательно.', 'A negative value cannot be under the root either, and the root value is non-negative regardless.') },
        { id: 'c', label: L("ha, kvadratga ko'tarilsa", 'да, если возвести в квадрат', 'yes, if you square it'), hint: L("Ko'tarish yozuvni o'zgartiradi, ildizning ishorasini emas.", 'Возведение меняет запись, а не знак самого корня.', 'Squaring changes the writing, not the sign of the root itself.') },
        { id: 'd', label: L('ha, manfiy iksda', 'да, при отрицательном икс', 'yes, for a negative x'), hint: L("Iks manfiy bo'lishi mumkin, ildiz qiymati esa yo'q.", 'Икс бывает отрицательным, а значение корня нет.', 'X can be negative, the value of the root cannot.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Tenglamaning ildizi nechaga teng?', 'Чему равен корень уравнения?', 'What is the root of the equation?'),
      done: '√(x + 2) = 3   →   x = 7',
      items: [
        { id: 'a', label: L('yetti', 'семь', 'seven'), correct: true, ok: L("Yetti. Ko'tardik, iks qo'shuv ikki to'qqizga teng bo'ldi.", 'Семь. Возвели, получили икс плюс два равно девяти.', 'Seven. Squaring gives x plus two equals nine.') },
        { id: 'b', label: L("o'n bir", 'одиннадцать', 'eleven'), hint: L("O'n bir o'ngda uch emas, kattaroq son turganda chiqardi.", 'Одиннадцать вышло бы, если справа стояло не три, а больше.', 'Eleven would come from a larger number on the right.') },
        { id: 'c', label: L('bir', 'один', 'one'), hint: L('Tekshiring: ildiz ostida uch chiqadi, uchdan ildiz esa uchga teng emas.', 'Проверь: под корнем выйдет три, а корень из трёх не равен трём.', 'Check it: three under the root, and the root of three is not three.') },
        { id: 'd', label: L("to'qqiz", 'девять', 'nine'), hint: L("To'qqiz ildiz ostidagi son, savol esa iks haqida.", 'Девять это то, что под корнем, а спросили про икс.', 'Nine is what stands under the root, and the question was about x.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Ko'targandan keyin nima albatta qilinadi?", 'Что обязательно делают после возведения?', 'What must always be done after squaring?'),
      done: '√f = g   →   f = g²,  g ≥ 0',
      items: [
        { id: 'a', label: L("topilgan sonlarni dastlabkisiga qo'yishadi", 'подставляют найденные числа в исходное', 'the numbers found are substituted into the original'), correct: true },
        { id: 'b', label: L('topilgan barcha sonlarni javobga yozishadi', 'записывают все найденные числа в ответ', 'all numbers found are written into the answer'), hint: L('Ortiqcha son javobga aynan shunday tushadi.', 'Именно так лишнее число и попадает в ответ.', 'That is exactly how the extra number gets into the answer.') },
        { id: 'c', label: L("yana bir marta ko'tarishadi", 'возводят ещё раз', 'they square once more'), hint: L("Ikkinchi ko'tarish yana ortiqcha sonlar qo'shadi, olib tashlamaydi.", 'Второе возведение добавит ещё лишних чисел, а не уберёт.', 'A second squaring adds more extra numbers, it does not remove any.') },
        { id: 'd', label: L('javobni yaxlitlashadi', 'округляют ответ', 'they round the answer'), hint: L("Yaxlitlashning ortiqcha ildizlarga aloqasi yo'q.", 'Округление к посторонним корням отношения не имеет.', 'Rounding has nothing to do with extra roots.') },
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
    A('mount', "Taxmin ikki son haqida edi. Nima chiqqanini ko'ramiz.", 'Прогноз был про два числа. Посмотрим, что вышло.', 'The guess was about two numbers. Let us see how it turned out.'),
    A('next', "Ildiz bitta. Minus ikki yechish paytida buzilgani yo'q, u hech qachon yaroqli bo'lmagan.", 'Корень один. Минус два не испортилось при решении, оно никогда и не было допустимым.', 'There is one root. Minus two did not go bad while solving, it was never admissible in the first place.'),
  ],
  can: [
    L("Kvadratga ko'tarishdan oldin shartni yozaman", 'Выписываю условие до возведения в квадрат', 'I write the condition before squaring'),
    L("Ko'tarish yechim qo'shishini bilaman", 'Знаю, что возведение добавляет решения', 'I know that squaring adds solutions'),
    L("Har bir sonni dastlabkisiga qo'yib tekshiraman", 'Проверяю каждое число подстановкой в исходное', 'I check every number by substituting into the original'),
    L("O'ng tarafiga qarab yechimsiz tenglamani ko'raman", 'Вижу уравнение без решений по правой части', 'I spot an equation with no solutions from its right side'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of problem is closed.'),
    gap: L("Bir joy takrorlashni talab qiladi: qo'yib tekshirish.", 'Одно место требует повтора: проверка подстановкой.', 'One spot needs a second look: checking by substitution.'),
    back: L('Qoidaga va beshinchi ekranga qayting.', 'Вернись к правилу и к экрану 5.', 'Go back to the rule and to screen five.'),
  },
  bridge: L("Keyin tengsizliklar: javob son emas, o'q bo'lagi bo'ladi.", 'Дальше неравенства: ответом станет не число, а участок оси.', 'Next come inequalities: the answer becomes a piece of the axis, not a number.'),
  lifehack: L("Noma'lumli ildizni ko'rsangiz, darrov o'ng tarafga qarang. Ba'zan yechish shart ham emas.", 'Увидел корень с неизвестным, сразу посмотри на правую часть. Иногда решать уже не надо.', 'When you see a root with an unknown, look at the right side first. Sometimes there is nothing left to solve.'),
  sheetTitle: L('Irratsional tenglamalar · shpargalka', 'Иррациональные уравнения · шпаргалка', 'Irrational equations · cheat sheet'),
  sheetSrc: L('10-sinf · 32-dars', '10 класс · урок 32', 'Grade 10 · lesson 32'),
  hook: {
    a: '3;  −2',
    b: '3',
  },
  proved: '3',
  law: '√f(x) = g(x)   →   f(x) = g(x)²,   g(x) ≥ 0',
  sheet: [
    'g(x) ≥ 0',
    '(√a)² = a,  a ≥ 0',
    '√f = g   →   f = g²',
    '√(a² + b²) ≠ a + b',
    '3 → 3 = 3;   −2 → 2 ≠ −2',
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

// ПОЛОСА ОДНА НА ВЕСЬ УРОК. Окно не меняется от экрана к экрану: иначе тройка
// на одном экране и тройка на другом окажутся в разных местах, и «корень попал
// в полосу» перестанет читаться. Минус шесть виден -- он граница первого
// условия, и ученик должен видеть, что оно НЕ выиграло.
const BAND = { lo: -7, hi: 8, ticks: [-6, -4, -2, 0, 2, 4, 6] }
const FROM = 0
const ROOTS = [{ v: 3, ok: true }, { v: -2, ok: false }]

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

// ДВА КАДРА НА ЧИСЛАХ. Слева запись, справа подписи. Прибор 2 в самом простом
// виде: у экранов 4, 6 и 7 полосы нет, там считают.
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
        // Полоса ПУСТАЯ: ось есть, закраски нет. Прогноз делается до того, как
        // стало видно, куда падают числа.
        fig={() => <Scene fig={<DomainBand step={0} from={FROM} {...BAND} />} max={172} h={172} />}
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
      /* ПРИБОР 5. Полоса закрашивается ДО возведения в квадрат: после него
         условие исчезнет из записи, а из задачи не денется никуда. */
      <Scene
        fig={<DomainBand step={phase} from={FROM} {...BAND} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={1} from={FROM} {...BAND} />} max={300} />
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
      /* Разграничение показано НЕ на уравнении, а на двух числах: так видно,
         что дело в самом возведении, а не в этой конкретной задаче. */
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
      /* СВИДЕТЕЛЬ УРОКА. Оба числа падают на полосу: тройка попадает в
         закрашенное и остаётся яркой, минус два падает снаружи и гаснет --
         но не исчезает, он был найден и это надо видеть. */
      <Scene
        fig={<DomainBand step={phase + 1} from={FROM} roots={ROOTS} {...BAND} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={2} from={FROM} roots={ROOTS} {...BAND} />} max={300} />
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
      <Pair a={S6.frameA} b={S6.frameB} phase={phase} items={S6.show[phase]} />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="big">{S6.frameB}</Expr>
          </Panel>
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
      /* Полоса НЕ закрашивается: `step` держим на нуле. Это и есть ответ --
         допустимых значений нет ни одного. */
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={0} from={FROM} {...BAND} />} max={250} h={190} />
        </Col>
        <Col>
          <Panel tone="paper">
            <Expr size="mid">{phase === 0 ? S7.frameA : S7.frameB}</Expr>
          </Panel>
          <NoteList items={S7.show[phase]} />
        </Col>
      </Cols>
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="big">{S7.work.expr}</Expr>
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
        // Корни падают в момент ответа: правило открывается рядом с тем
        // движением, которое его и породило.
        fig={(solved) => (
          <Scene fig={<DomainBand step={solved ? 2 : 1} from={FROM} roots={ROOTS} {...BAND} />} max={330} />
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
            fig={<DomainBand step={round >= 1 ? 2 : 1} from={FROM} roots={round >= 1 ? ROOTS : []} {...BAND} />}
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
