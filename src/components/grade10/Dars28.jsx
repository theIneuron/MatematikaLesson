// ============================================================================
// 10-sinf, Dars 28. KO'RSATKICHLI TENGLAMALAR.
//
// ASBOB: 2-asbob (qadam bilan qaytadan yozish, `Tape`) va 4-asbobning
// soddalashtirilgan ko'rinishi (`Plane` gorizontal bilan). Oyna 27-darsdan
// KENGROQ: sakkiz darajasidagi gorizontal uchta ustida uchrashishi kerak,
// va ikkala son imzolangan bo'lishi shart -- aks holda shohid yolg'onchi.
// SHOHID: uchrashuvlar soni -- ildizlar soni.
//
// Yuqoridagi ma'lumot `scripts/grade10-kontent-build.mjs` bilan
// `src/books/grade10/DARS28_KONTENT.md` dan yig'ilgan: QO'LDA tuzatmang,
// kontentni tuzatib qaytadan yig'ing. Ekran tanalari esa qo'lda yozilgan.
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
  SlotTable,
} from './tools.jsx'

import { Plane } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 28
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Ko'rsatkichli tenglamalar`,
  `Урок ${LESSON_NO}. Показат. уравнения`,
  `Lesson ${LESSON_NO}. Exponential equations`,
)

const BLOCK = { label: 'B5', from: 26, to: 37, current: 28 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TENGLAMA', 'УРАВНЕНИЕ', 'THE EQUATION'),
  title: L("Ko'rsatkichni qanday topish", 'Как найти показатель', 'How to find the exponent'),
  audio: [
    A('mount', "Egri chiziq tanish, o'tgan darsdan. Endi undan so'raladi: qaysi iksda qiymat sakkizga teng.", 'Кривая знакомая, с прошлого урока. Теперь у неё спрашивают: при каком икс значение равно восьми.', 'The curve is familiar from the previous lesson. Now it is asked: at which x is the value eight.'),
    A('r1', "Birinchi yozuv ko'rsatkich o'ng qismni asosga bo'lish bilan topiladi deydi.", 'Первая запись говорит, что показатель находят делением правой части на основание.', 'The first reading says the exponent is found by dividing the right side by the base.'),
    A('r2', "Ikkinchisi o'ng qismni o'sha asosning darajasi qilib yozish kerak deydi.", 'Вторая говорит, что правую часть надо записать степенью того же основания.', 'The second says the right side must be written as a power of the same base.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi gorizontal o'tkazamiz va uni egri chiziqni qayerda uchratishini ko'ramiz.", 'Твой ответ записан. Сейчас проведём горизонталь и посмотрим, где она встретит кривую.', 'Your answer is saved. Now we will draw a horizontal and see where it meets the curve.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("sakkizni ikkiga bo'lamiz", 'делим восемь на два', 'we divide eight by two'),
      value: 'x = 4',
    },
    b: {
      name: L('sakkizni ikkining darajasi qilib yozamiz', 'пишем восемь степенью двойки', 'we write eight as a power of two'),
      value: 'x = 3',
    },
  },
  expr: '2^x = 8',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Tenglamadan oldin uch savol', 'Три вопроса перед уравнением', 'Three questions before the equation'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
    A('link', "Va bitta kuzatish. Trigonometriya blokida ildizlar cheksiz ko'p edi, chunki funksiya davriy. Bu yerda ildiz bitta bo'ladi, chunki funksiya monoton. Sabab bir xil, faqat har xil tomondan o'qilgan.", 'И одно наблюдение. В блоке про тригонометрию корней было бесконечно много, потому что функция периодическая. Здесь корень будет один, потому что функция монотонная. Причина одна и та же, прочитанная в разные стороны.', 'And one observation. In the trigonometry block there were infinitely many roots because the function is periodic. Here there will be one root because the function is monotone. The same reason read in opposite directions.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Sakkizni ikkining darajasi qilib qanday yozish kerak?', 'Как записать восемь степенью двойки?', 'How is eight written as a power of two?'),
      done: '8 = 2³',
      items: [
        { id: 'a', label: L('ikki uchinchi darajada', 'два в третьей', 'two to the third'), correct: true },
        { id: 'b', label: L("ikki to'rtinchi darajada", 'два в четвёртой', 'two to the fourth'), hint: L("Ikki to'rtinchi darajada bu o'n olti. Ko'paytuvchilarni sanang.", 'Два в четвёртой это шестнадцать. Посчитай множители.', 'Two to the fourth is sixteen. Count the factors.') },
        { id: 'c', label: L('uch ikkinchi darajada', 'три во второй', 'three to the second'), hint: L("Uch ikkinchi darajada bu to'qqiz, va asos bu yerda boshqa.", 'Три во второй это девять, и основание здесь другое.', 'Three to the second is nine, and the base here is different.') },
        { id: 'd', label: L("to'rt ikkinchi darajada", 'четыре во второй', 'four to the second'), hint: L("To'rt ikkinchi darajada bu o'n olti, va asos ikki emas.", 'Четыре во второй это шестнадцать, и основание не двойка.', 'Four to the second is sixteen, and the base is not two.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Ikki iks darajada manfiy bo'lishi mumkinmi?", 'Может ли два в степени икс быть отрицательным?', 'Can two to the x be negative?'),
      done: '2^x > 0',
      items: [
        { id: 'a', label: L("yo'q, hech qachon", 'нет, никогда', 'no, never'), correct: true },
        { id: 'b', label: L("ha, manfiy ko'rsatkichda", 'да, при отрицательном показателе', 'yes, with a negative exponent'), hint: L("Manfiy ko'rsatkich manfiy emas, kichik musbat son beradi.", 'Отрицательный показатель даёт маленькое положительное число, а не отрицательное.', 'A negative exponent gives a small positive number, not a negative one.') },
        { id: 'c', label: L("ha, kasr ko'rsatkichda", 'да, при дробном', 'yes, with a fractional one'), hint: L("Kasr ko'rsatkich bu ildiz, u ham musbat.", 'Дробный показатель это корень, и он тоже положителен.', 'A fractional exponent is a root, and it is positive too.') },
        { id: 'd', label: L("ha, nol ko'rsatkichda", 'да, при нулевом', 'yes, with a zero one'), hint: L("Nol ko'rsatkich bir beradi.", 'Нулевой показатель даёт единицу.', 'A zero exponent gives one.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Asos ikki bo'lganda egri chiziq qayoqqa ketadi?", 'Куда идёт кривая при основании два?', 'Which way does the curve go with base two?'),
      done: 'a > 1   →   ↑',
      items: [
        { id: 'a', label: L('yuqoriga va qaytmaydi', 'вверх и не возвращается', 'up, and it does not come back'), correct: true },
        { id: 'b', label: L('yuqoriga, keyin pastga', 'вверх, потом вниз', 'up, then down'), hint: L("Bu to'lqin bo'lardi. Ko'rsatkichli egri chiziqda burilish yo'q.", 'Это была бы волна. У показательной кривой поворота нет.', 'That would be a wave. An exponential curve has no turn.') },
        { id: 'c', label: L('pastga', 'вниз', 'down'), hint: L("Asos birdan kichik bo'lganda egri chiziq pastga ketadi.", 'Вниз идёт кривая при основании меньше единицы.', 'The curve goes down when the base is less than one.') },
        { id: 'd', label: L("to'g'ri chiziq bo'yicha", 'по прямой', 'along a straight line'), hint: L("To'g'ri chiziq faqat asos birga teng bo'lganda chiqadi.", 'Прямая получается только при основании, равном единице.', 'A straight line comes only from a base equal to one.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Ildizlar soni uchrashuvlar soniga teng', 'Корней столько, сколько встреч', 'As many roots as meetings'),
  tag: 'delyat-vmesto-osnovaniya',
  show: [
    [
      L("sakkiz darajasida gorizontal o'tkazamiz", 'проводим горизонталь на уровне восьми', 'we draw a horizontal at the level eight'),
      L('u egri chiziqni bir marta uchratadi', 'она встречает кривую один раз', 'it meets the curve once'),
      '2^x = 8',
    ],
    [
      L('egri chiziq yuqoriga ketadi va qaytmaydi', 'кривая идёт вверх и не возвращается', 'the curve goes up and does not come back'),
      L('demak ildiz bitta', 'значит корень один', 'so there is one root'),
      'x = 3',
    ],
  ],
  motion: ['meet'],
  audio: [
    A('mount', "Tenglamani yechish bu qiymati sakkizga teng bo'lgan iksni topish.", 'Решить уравнение значит найти икс, при котором значение равно восьми.', 'To solve the equation means to find the x at which the value is eight.'),
    A('meet', "Sakkiz darajasida gorizontal o'tkazamiz. U egri chiziqni aynan bir marta uchratadi, va uchrashuv iks uchga teng joyga tushadi. Bir marta, ikki emas, chunki egri chiziq monoton: u yuqoriga ketadi va bir marta ham qaytmaydi. Demak ko'rsatkichli tenglamada ildiz bitta, va bu yangi qoida emas, o'tgan darsning natijasi.", 'Проведём горизонталь на уровне восьми. Она встречает кривую ровно один раз, и встреча приходится на икс, равный трём. Один раз, а не два, потому что кривая монотонна: она идёт вверх и не возвращается ни разу. Значит у показательного уравнения корень один, и это следствие прошлого урока, а не новое правило.', 'Let us draw a horizontal at the level eight. It meets the curve exactly once, and the meeting falls at x equal to three. Once, not twice, because the curve is monotone: it goes up and never comes back. So an exponential equation has one root, and that follows from the previous lesson rather than being a new rule.'),
    A('work', "O'zingiz hisoblang. Gorizontal egri chiziqni necha marta uchratdi?", 'Посчитай сам. Сколько раз горизонталь встретила кривую?', 'Work it out yourself. How many times did the horizontal meet the curve?'),
  ],
  work: {
    prompt: L('Gorizontal egri chiziqni necha marta uchratdi?', 'Сколько раз горизонталь встретила кривую?', 'How many times did the horizontal meet the curve?'),
    ok: L("Bir. Egri chiziq yuqoriga ketadi va qaytmaydi, shuning uchun ikkinchi uchrashuv bo'lishi mumkin emas.", 'Один. Кривая идёт вверх и не возвращается, поэтому второй встречи быть не может.', 'Once. The curve goes up and does not come back, so a second meeting is impossible.'),
    hint: [
      L('Gorizontal egri chiziqni kesgan nuqtalarni sanang.', 'Посчитай точки, где горизонталь пересекла кривую.', 'Count the points where the horizontal crossed the curve.'),
      L('Egri chiziq bir marta ham orqaga burilmaydi.', 'Кривая ни разу не поворачивает назад.', 'The curve never turns back.'),
      L('Bir.', 'Один.', 'Once.'),
    ],
    answer: '1',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'order',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Bo'lish mumkin emas, keltirish mumkin", 'Делить нельзя, приводить можно', 'Dividing is out, reducing is in'),
  tag: 'delyat-vmesto-osnovaniya',
  show: [
    [
      L("bo'lish bilan to'rt chiqardi", 'делением получилось бы четыре', 'dividing would give four'),
      L("to'rtni qo'yib tekshiramiz", 'подставим четвёрку и проверим', 'let us substitute four and check'),
      '8 : 2 = 4',
    ],
    [
      L("o'n olti chiqdi, sakkiz kerak edi", 'вышло шестнадцать, а нужно восемь', 'sixteen came out, and eight was needed'),
      L("demak o'ng qism qaytadan yoziladi", 'значит правую часть переписывают', 'so the right side gets rewritten'),
      '2⁴ = 16',
    ],
  ],
  motion: ['check'],
  audio: [
    A('mount', "Dars boshidagi birinchi yozuvni tekshiramiz. Sakkiz ikkiga bo'linsa to'rt bo'ladi.", 'Проверим первую запись с начала урока. Восемь разделить на два это четыре.', 'Let us check the first reading from the start of the lesson. Eight divided by two is four.'),
    A('check', "To'rtni ko'rsatkichga qo'yamiz. Ikki to'rtinchi darajada bu o'n olti, sakkiz kerak edi. Demak bo'lish bu yerda umuman ishlamaydi: ko'rsatkich ko'paytuvchi emas, va u bo'lish bilan olinmaydi. Boshqa narsa ishlaydi. Sakkizning o'zi ikkining darajasi qilib yoziladi, va shunda chapda ham o'ngda ham bitta asos turadi.", 'Подставим четвёрку в показатель. Два в четвёртой степени это шестнадцать, а нужно было восемь. Значит деление тут не работает совсем: показатель это не множитель, и делением его не получают. Работает другое. Восемь само записывается степенью двойки, и тогда слева и справа стоит одно основание.', 'Let us substitute four into the exponent. Two to the fourth is sixteen, and eight was needed. So dividing does not work here at all: the exponent is not a factor and is not obtained by division. Something else works. Eight itself can be written as a power of two, and then the same base stands on both sides.'),
    A('work', 'Bunday tenglama qanday yechilsa, qadamlarni shunday joylashtiring.', 'Расставь шаги, как решается такое уравнение.', 'Put the steps in the order such an equation is solved.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L("o'ng qismni o'sha asosning darajasi qilib yozamiz", 'правую часть пишем степенью того же основания', 'write the right side as a power of the same base'),
    s2: L("chapda va o'ngda bitta asos", 'слева и справа одно основание', 'the same base on both sides'),
    s3: L("ko'rsatkichlarni solishtiramiz", 'сравниваем показатели', 'compare the exponents'),
    s4: L('ildizni olamiz', 'получаем корень', 'get the root'),
    ok: L("Tartib doim shunday. Unda bo'lish birorta qadamda ham yo'q.", 'Порядок такой всегда. Деления в нём нет ни на одном шаге.', 'The order is always this. There is no division at any step.'),
    bad: L("Avval o'ng qismni qaytadan yozish, keyin ko'rsatkichlarni solishtirish.", 'Сначала переписать правую часть, потом сравнить показатели.', 'First rewrite the right side, then compare the exponents.'),
    mark: 'x = 3',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'order',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Bitta asos, keyin ko'rsatkichlar", 'Одно основание, потом показатели', 'One base first, then the exponents'),
  tag: 'delyat-vmesto-osnovaniya',
  show: [
    [
      L("asoslar har xil, lekin bog'liq", 'основания разные, но связаны', 'the bases differ but are related'),
      L("to'rt bu ikki kvadratda", 'четвёрка это два в квадрате', 'four is two squared'),
      '4^x = 2^{x+1}',
    ],
    [
      L("asoslar bir xil bo'ldi", 'основания стали одинаковыми', 'the bases became the same'),
      L("ko'rsatkichlarni solishtirish qoladi", 'остаётся сравнить показатели', 'comparing the exponents is what is left'),
      '2^{2x} = 2^{x+1}',
    ],
  ],
  motion: ['same'],
  audio: [
    A('mount', "Endi asoslar har xil. Chapda to'rt, o'ngda ikki.", 'Теперь основания разные. Слева четыре, справа два.', 'Now the bases differ. Four on the left, two on the right.'),
    A('same', "To'rt bu ikki kvadratda, demak chapda ikki ikki iks darajada chiqadi. Asoslar bir xil bo'ldi, va ko'rsatkichlarni solishtirish qoladi. Solishtirish huquqini monotonlik beradi: bitta qiymatga faqat bitta ko'rsatkich mos, chunki egri chiziq har darajadan aynan bir marta o'tadi. Ikki iks iks qo'shuv birga teng, shundan iks birga teng.", 'Четвёрка это два в квадрате, значит слева получается два в степени два икс. Основания стали одинаковыми, и остаётся сравнить показатели. Право сравнить их даёт монотонность: у одного значения только один показатель, потому что кривая проходит через каждый уровень ровно один раз. Два икс равно икс плюс один, отсюда икс равен единице.', 'Four is two squared, so on the left we get two to the two x. The bases became the same, and comparing the exponents is what is left. The right to compare them comes from monotonicity: one value has only one exponent, because the curve passes each level exactly once. Two x equals x plus one, so x equals one.'),
    A('work', 'Har xil asosli tenglama qanday yechilsa, qadamlarni shunday joylashtiring.', 'Расставь шаги, как решается уравнение с разными основаниями.', 'Put the steps in the order an equation with different bases is solved.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L('ikkala asosni ikkiga keltiramiz', 'оба основания сводим к двойке', 'reduce both bases to two'),
    s2: L("ko'rsatkichlarni tenglashtiramiz", 'показатели приравниваем', 'set the exponents equal'),
    s3: L('oddiy tenglamani yechamiz', 'решаем обычное уравнение', 'solve the ordinary equation'),
    s4: L('ildiz bitta', 'корень один', 'one root'),
    ok: L("Asoslar bittaga keltiriladi, keyin tenglama oddiy bo'ladi. Monotonlik ko'rsatkichlarni solishtirishga ruxsat beradi.", 'Основания приводят к одному, и дальше уравнение обычное. Монотонность разрешает сравнить показатели.', 'The bases are reduced to one, and then the equation is an ordinary one. Monotonicity allows comparing the exponents.'),
    bad: L("Avval bitta asos, keyin ko'rsatkichlar, keyin yechim.", 'Сначала одно основание, потом показатели, потом решение.', 'First one base, then the exponents, then the solution.'),
    mark: 'x = 1',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Almashtirish kvadratga keltiradi', 'Замена сводит к квадратному', 'A substitution reduces it to a quadratic'),
  tag: 'net-resheniy',
  show: [
    [
      L('tenglamada ikki daraja', 'в уравнении две степени', 'the equation has two powers'),
      L('biri ikkinchisining kvadrati', 'одна из них квадрат другой', 'one of them is the square of the other'),
      '4^x − 3·2^x − 4 = 0',
    ],
    [
      L('almashtirish kvadrat tenglama beradi', 'замена даёт квадратное уравнение', 'the substitution gives a quadratic'),
      L('manfiy qiymat tashlanadi', 'отрицательное значение отбрасывают', 'the negative value is dropped'),
      't² − 3t − 4 = 0',
    ],
  ],
  motion: ['sub'],
  audio: [
    A('mount', "Ikki daraja bo'lgan tenglamani olamiz. To'rt iks darajada va ikki iks darajada.", 'Возьмём уравнение, где степеней две. Четыре в степени икс и два в степени икс.', 'Take an equation with two powers. Four to the x and two to the x.'),
    A('sub', "To'rt iks darajada bu ikki iks darajaning kvadrati. Ikki iks darajani te harfi bilan belgilaymiz, va oddiy kvadrat tenglama chiqadi. Uning ildizlari to'rt va minus bir. Minus birni tashlaymiz: ikki iks darajada har qanday iksda musbat, u hech qachon manfiy bo'lmaydi. To'rt qoladi, va undan iks ikkiga teng.", 'Четыре в степени икс это квадрат двух в степени икс. Обозначим два в степени икс буквой тэ, и получится обычное квадратное уравнение. Его корни четыре и минус один. Минус один отбрасываем: два в степени икс положительно при любом икс, отрицательным оно не бывает никогда. Остаётся четвёрка, и из неё икс равен двум.', 'Four to the x is the square of two to the x. Let us call two to the x by the letter t, and an ordinary quadratic appears. Its roots are four and minus one. We drop minus one: two to the x is positive for every x and is never negative. Four is left, and from it x equals two.'),
    A('work', "O'zingiz hisoblang. Almashtirishning nechta ildizi yaraydi?", 'Посчитай сам. Сколько корней замены годится?', 'Work it out yourself. How many roots of the substitution fit?'),
  ],
  work: {
    prompt: L('Almashtirishning nechta ildizi yaraydi?', 'Сколько корней замены годится?', 'How many roots of the substitution fit?'),
    ok: L("Bitta. Minus bir yaramaydi: ikkining darajasi manfiy bo'lmaydi.", 'Один. Минус единица не годится: степень двойки отрицательной не бывает.', 'One. Minus one does not fit: a power of two is never negative.'),
    hint: [
      L("Almashtirishning har ildizini ishorasi bo'yicha tekshiring.", 'Проверь каждый корень замены на знак.', 'Check the sign of each root of the substitution.'),
      L('Almashtirish qiymati bu ikkining darajasi, u esa musbat.', 'Значение замены это степень двойки, а она положительна.', 'The substituted value is a power of two, and that is positive.'),
      L('Bitta.', 'Один.', 'One.'),
    ],
    answer: '1',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Uchrashuv bo'lmaydigan hol", 'Когда встреч не бывает', 'When there are no meetings'),
  tag: 'net-resheniy',
  show: [
    [
      L("gorizontalni o'q ostiga tushiramiz", 'опускаем горизонталь под ось', 'we lower the horizontal below the axis'),
      L("u egri chiziqdan pastda o'tadi", 'она проходит ниже кривой', 'it passes below the curve'),
      '2^x = −4',
    ],
    [
      L("birorta uchrashuv yo'q", 'встреч нет ни одной', 'there is not a single meeting'),
      L("demak ildiz yo'q", 'значит корней нет', 'so there are no roots'),
      '∅',
    ],
  ],
  motion: ['none'],
  audio: [
    A('mount', "Gorizontalni o'q ostiga, minus to'rt darajasiga tushiramiz.", 'Опустим горизонталь под ось, на уровень минус четыре.', 'Let us lower the horizontal below the axis, to the level minus four.'),
    A('none', "U egri chiziqdan pastda o'tadi va uni hech qayerda uchratmaydi. Demak ildiz yo'q, va bu har qanday hisobdan oldin ko'rinadi. Gorizontalni aynan nolga ko'taramiz. U asimptota bilan ustma-ust tushadi va u ham egri chiziqni uchratmaydi. Shuning uchun o'ng qismida nol yoki manfiy son bo'lgan tenglamalarning yechimi yo'q, va o'ng qism birinchi tekshiriladi.", 'Она проходит ниже кривой и не встречает её нигде. Значит корней нет, и это видно до всяких вычислений. Поднимем горизонталь ровно на ноль. Она совпадает с асимптотой и тоже не встречает кривую. Поэтому уравнения, где справа ноль или отрицательное число, решений не имеют, и правая часть проверяется первой.', 'It passes below the curve and meets it nowhere. So there are no roots, and this is visible before any computation. Let us raise the horizontal to exactly zero. It coincides with the asymptote and does not meet the curve either. So equations with zero or a negative number on the right have no solutions, and the right side is what gets checked first.'),
    A('work', "O'zingiz hisoblang. Bu tenglamada nechta ildiz bor?", 'Посчитай сам. Сколько корней у этого уравнения?', 'Work it out yourself. How many roots does this equation have?'),
  ],
  work: {
    prompt: L('Bu tenglamada nechta ildiz bor?', 'Сколько корней у этого уравнения?', 'How many roots does this equation have?'),
    ok: L("Birortasi ham. Qiymatlar to'plami musbat sonlar, o'ngda esa manfiy son turadi.", 'Ни одного. Множество значений это положительные числа, а справа стоит отрицательное.', 'None. The range is the positive numbers, and a negative one stands on the right.'),
    hint: [
      L('Gorizontal egri chiziqni biror joyda uchratadimi, qarang.', 'Посмотри, встречает ли горизонталь кривую хоть где-нибудь.', 'Look whether the horizontal meets the curve anywhere at all.'),
      L("Egri chiziq butunlay o'qdan yuqorida, gorizontal esa pastda.", 'Кривая целиком выше оси, а горизонталь ниже.', 'The curve lies entirely above the axis, and the horizontal below.'),
      L('Birortasi ham.', 'Ни одного.', 'None.'),
    ],
    answer: '0',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L("Ko'rsatkichli tenglama", 'Показательное уравнение', 'The exponential equation'),
  tag: 'delyat-vmesto-osnovaniya',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidadan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Gorizontal ekranda qoladi, va qoida yonida ochiladi. Ko'rsatkichlar asos qayoqqadir ketgani uchun emas, egri chiziq har qiymatdan aynan bir marta o'tgani uchun tenglashtiriladi.", 'Горизонталь остаётся на экране, и правило открывается рядом. Показатели приравнивают не потому, что основание куда-то ушло, а потому, что кривая проходит через каждое значение ровно один раз.', 'The horizontal stays on the screen and the rule opens beside it. The exponents are set equal not because the base went away but because the curve passes each value exactly once.'),
  ],
  probe: {
    question: L("Nega darajalarning tengligidan ko'rsatkichlarni tenglashtirish mumkin?", 'Почему из равенства степеней можно приравнять показатели?', 'Why may the exponents be set equal when the powers are equal?'),
    items: [
      { id: 'a', label: L("funksiya monoton: bitta qiymatga bitta ko'rsatkich", 'функция монотонна: одному значению один показатель', 'the function is monotone: one value, one exponent'), correct: true },
      { id: 'b', label: L('asos qisqaradi', 'основание сокращается', 'the base cancels out'), hint: L("Asos qisqartirilmaydi: u ko'paytuvchi emas. Solishtirish huquqini egri chiziqning monotonligi beradi.", 'Основание не сокращают: это не множитель. Право сравнить даёт монотонность кривой.', 'The base is not cancelled: it is not a factor. The right to compare comes from the monotonicity of the curve.') },
    ],
  },
  rule: {
    lawLabel: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L("Ko'rsatkichida noma'lum turgan tenglama ko'rsatkichli tenglama deyiladi.", 'Уравнение, в показателе которого стоит неизвестное, называют показательным.', 'An equation whose exponent holds the unknown is called exponential.'),
      L("Asos musbat va birga teng bo'lmasa, ko'rsatkichlar teng bo'ladi.", 'Если основание положительно и не равно единице, показатели равны.', 'If the base is positive and not one, the exponents are equal.'),
      L("O'ngda nol yoki manfiy son bo'lsa, ildiz yo'q.", 'Если справа ноль или отрицательное число, корней нет.', 'If the right side is zero or negative, there are no roots.'),
    ],
    law: 'a^{f(x)} = a^{g(x)}   →   f(x) = g(x)',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Tenglama va uning ildizi', 'Уравнение и его корень', 'An equation and its root'),
  tag: 'delyat-vmesto-osnovaniya',
  audio: [
    A('mount', "To'rt tenglama va to'rt ildiz. Ularni birlashtiring.", 'Четыре уравнения и четыре корня. Соедини их.', 'Four equations and four roots. Match them.'),
  ],
  match: {
    prompt: L('Tenglamani ildizi bilan birlashtiring.', 'Соедини уравнение с его корнем.', 'Match each equation with its root.'),
    ok: L("Har tenglama bitta asosga keltiriladi, keyin ko'rsatkichlar solishtiriladi. Ildiz kasr ham, manfiy ham, nol ham bo'ladi.", 'Каждое уравнение сводится к одному основанию, и дальше сравниваются показатели. Корень бывает и дробным, и отрицательным, и нулём.', 'Every equation reduces to one base, and then the exponents are compared. A root can be fractional, negative, or zero.'),
    left: ['2^x = 32', '3^x = 1/3', '5^x = 1', '4^x = 2'],
    a: '5',
    b: '−1',
    c: '0',
    d: '1/2',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Qadam bilan yeching', 'Реши по шагам', 'Solve it step by step'),
  tag: 'delyat-vmesto-osnovaniya',
  audio: [
    A('mount', "To'rtta qadam. Tartibini o'zingiz qo'yasiz.", 'Четыре шага. Порядок ставишь ты.', 'Four steps. You put them in order.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L("to'qqiz bu uch kvadratda", 'девять это три в квадрате', 'nine is three squared'),
    s2: L("ko'rsatkichni ochish", 'раскрыть показатель', 'expand the exponent'),
    s3: L("ko'rsatkichlarni tenglashtirish", 'приравнять показатели', 'set the exponents equal'),
    s4: L('ildizni olish', 'получить корень', 'get the root'),
    ok: L('Ikkala asos uchga keltirildi, keyin tenglama oddiy. Ildiz uchga teng.', 'Оба основания сведены к тройке, и дальше уравнение обычное. Корень равен трём.', 'Both bases are reduced to three, and then the equation is an ordinary one. The root is three.'),
    bad: L("Avval bitta asos, keyin ko'rsatkichni ochish, keyin tenglashtirish.", 'Сначала одно основание, потом раскрыть показатель, потом приравнять.', 'First one base, then expand the exponent, then set them equal.'),
    mark: 'x = 3',
  },
  expr: '9^{x−1} = 3^{x+1}',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Chizmasiz yeching', 'Реши без чертежа', 'Solve it without a drawing'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu ekranda chizma yo'q. Imtihonda ham bo'lmaydi.", 'На этом экране чертежа нет. На экзамене его тоже не будет.', 'There is no drawing on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L('Minus uch. Bir ikkidan bu ikki minus birinchi darajada, demak chapda ikki minus iks darajada turadi.', 'Минус три. Одна вторая это два в минус первой, значит слева стоит два в степени минус икс.', 'Minus three. One half is two to the minus first, so on the left stands two to the minus x.'),
    hint: [
      L('Bir ikkidanni ikkining darajasi qilib yozing.', 'Запиши одну вторую степенью двойки.', 'Write one half as a power of two.'),
      L('Chapda ikki minus iks darajada chiqadi.', 'Слева получится два в степени минус икс.', 'On the left you get two to the minus x.'),
      L('Minus uch.', 'Минус три.', 'Minus three.'),
    ],
    prompt: '(1/2)^x = 8   →   x = ?',
    answer: '−3',
  },
  order: {
    prompt: L("Tenglamalarni ildizining o'sishi bo'yicha joylashtiring.", 'Расставь уравнения по возрастанию корня.', 'Arrange the equations by increasing root.'),
    title: L('Qaysi tenglamaning ildizi kichikroq?', 'У какого уравнения корень меньше?', 'Which equation has the smaller root?'),
    ok: L("Asos birdan katta, shuning uchun o'ng qism qancha katta bo'lsa, ildiz ham shuncha katta.", 'Основание больше единицы, поэтому чем больше правая часть, тем больше корень.', 'The base is greater than one, so the bigger the right side the bigger the root.'),
    bad: L('Har tenglamaning ildizini toping, keyin solishtiring.', 'Найди корень каждого уравнения, потом сравнивай.', 'Find the root of each equation, then compare.'),
    items: ['2^x = 1/4', '2^x = 1', '2^x = 2', '2^x = 8'],
    answer: '2^x = 1/4  2^x = 1  2^x = 2  2^x = 8',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Javob to'liq emas. Qayerda?", 'Ответ неполный. Где?', 'The answer is incomplete. Where?'),
  tag: 'check',
  audio: [
    A('mount', "Masala. Chapda ko'rsatkich iks kvadratda bo'lgan tenglamani yechish.", 'Задача. Решить уравнение, где показатель слева это икс в квадрате.', 'A task. Solve an equation where the exponent on the left is x squared.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L('Bu qator shartni shunchaki qaytadan yozadi.', 'Эта строка просто переписывает условие.', 'This line just rewrites the task.'),
    r2: L("To'rt bu ikki kvadratda, qator to'g'ri.", 'Четыре это два в квадрате, строка верна.', 'Four is two squared, the line is right.'),
    r3: L("Ko'rsatkichlar to'g'ri tenglashtirilgan.", 'Показатели приравнены верно.', 'The exponents are set equal correctly.'),
  },
  proof: L("Bu yerda ikkala qism iksga bo'lindi, va nol ildiz yo'qoldi.", 'Здесь обе части поделили на икс, и корень ноль исчез.', 'Here both sides were divided by x, and the root zero vanished.'),
  entry: {
    prompt: L("Qaysi ildiz yo'qolgan?", 'Какой корень потерян?', 'Which root is lost?'),
    ok: L('Nol. Nolda ikkala qism birga teng, demak bu ham ildiz.', 'Ноль. При нуле обе части равны единице, значит это тоже корень.', 'Zero. At zero both sides equal one, so it is a root too.'),
    hint: [
      L("Oxirgi tenglamani iksga bo'lmasdan yeching.", 'Реши последнее уравнение, не деля на икс.', 'Solve the last equation without dividing by x.'),
      L("Iksni qavsdan chiqaring va har ko'paytuvchini nolga tenglashtiring.", 'Вынеси икс за скобку и приравняй каждый множитель нулю.', 'Factor x out and set each factor to zero.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
  row: {
    r1: '2^{x²} = 4^x',
    r2: '2^{x²} = 2^{2x}',
    r3: 'x² = 2x',
    r4: 'x = 2',
  },
  answerId: 'r4',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Ildiz bo'yicha tenglama yasang", 'По корню собери уравнение', 'From a root back to the equation'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Endi teskari masala. Ildiz ma'lum, tenglamani yasash kerak.", 'Теперь обратная задача. Корень известен, собрать надо уравнение.', 'Now the inverse task. The root is known, and the equation must be built.'),
    A('work', "Avval o'ng qismni yozing, keyin ildizi ikki bo'lgan hamma tenglamani belgilaysiz.", 'Сначала запиши правую часть, потом отметишь все уравнения с корнем два.', 'First type the right side, then you will mark every equation with root two.'),
  ],
  multi: {
    prompt: L('Ildizi ikkiga teng hamma tenglamani belgilang.', 'Отметь все уравнения, у которых корень равен двум.', 'Mark every equation whose root is two.'),
    title: L('Qaysi tenglamalarning ildizi ikkiga teng?', 'У каких уравнений корень равен двум?', 'Which equations have the root two?'),
    ok: L("To'rttadan ikkitasi. Bir xil son har xil tenglamalarning ildizi bo'ladi.", 'Две из четырёх. Одно и то же число бывает корнем разных уравнений.', 'Two out of four. The same number can be the root of different equations.'),
    items: [
      { id: 'c', label: '2^x = 8', hint: L('Sakkiz bu ikki kubda, demak ildiz uchga teng.', 'Восемь это два в кубе, значит корень равен трём.', 'Eight is two cubed, so the root is three.') },
      { id: 'd', label: '(1/2)^x = 4', hint: L('Asos birdan kichik, va ildiz manfiy chiqadi.', 'Основание меньше единицы, и корень получается отрицательным.', 'The base is less than one, and the root comes out negative.') },
      { id: 'a', label: '2^x = 4', ok: true },
      { id: 'b', label: '9^x = 81', ok: true },
    ],
  },
  entry: {
    prompt: L("Asos besh, ildiz uch. O'ng qism nechaga teng?", 'Основание пять, корень три. Чему равна правая часть?', 'The base is five, the root is three. What is the right side?'),
    ok: L("Bir yuz yigirma besh. Bu besh kubda, va bunday tenglamada boshqa ildiz yo'q.", 'Сто двадцать пять. Это пять в кубе, и другого корня у такого уравнения нет.', 'One hundred twenty five. That is five cubed, and such an equation has no other root.'),
    hint: [
      L("Ko'rsatkichga uchni qo'ying.", 'Подставь тройку в показатель.', 'Substitute three into the exponent.'),
      L('Besh kubda.', 'Пять в кубе.', 'Five cubed.'),
      L('Bir yuz yigirma besh.', 'Сто двадцать пять.', 'One hundred twenty five.'),
    ],
    answer: '125',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'delyat-vmesto-osnovaniya',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Chapda va o'ngda bitta asos bo'lgan tenglama qanday yechiladi?", 'Как решают уравнение, где слева и справа одно основание?', 'How is an equation with the same base on both sides solved?'),
      done: 'f(x) = g(x)',
      items: [
        { id: 'a', label: L("ko'rsatkichlarni tenglashtiradilar", 'приравнивают показатели', 'the exponents are set equal'), correct: true },
        { id: 'b', label: L("o'ng qismni asosga bo'ladilar", 'делят правую часть на основание', 'the right side is divided by the base'), hint: L("Qo'yib tekshiring: sakkiz ikkiga bo'linsa to'rt, ikki to'rtinchi darajada esa o'n olti.", 'Проверь подстановкой: восемь на два это четыре, а два в четвёртой шестнадцать.', 'Check by substitution: eight over two is four, and two to the fourth is sixteen.') },
        { id: 'c', label: L('asoslarni ayiradilar', 'вычитают основания', 'the bases are subtracted'), hint: L("Asoslar bir xil, ayiradigan narsa yo'q.", 'Основания одинаковые, вычитать нечего.', 'The bases are the same, there is nothing to subtract.') },
        { id: 'd', label: L("ikkala qismni kvadratga ko'taradilar", 'возводят обе части в квадрат', 'both sides are squared'), hint: L("Kvadrat hech narsani soddalashtirmaydi: ko'rsatkichlar shunchaki ikkilanadi.", 'Квадрат ничего не упростит: показатели просто удвоятся.', 'Squaring simplifies nothing: the exponents just double.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Ikki iks darajada sakkizga teng tenglamada nechta ildiz bor?', 'Сколько корней у уравнения два в степени икс равно восьми?', 'How many roots does two to the x equals eight have?'),
      done: 'x = 3',
      items: [
        { id: 'a', label: L('bitta', 'один', 'one'), correct: true },
        { id: 'b', label: L('ikkita', 'два', 'two'), hint: L("Ikkita to'lqinda bo'lardi. Ko'rsatkichli egri chiziq orqaga burilmaydi.", 'Два было бы у волны. Показательная кривая назад не поворачивает.', 'Two would happen for a wave. An exponential curve never turns back.') },
        { id: 'c', label: L('birortasi ham', 'ни одного', 'none'), hint: L('Sakkiz musbat, demak gorizontal egri chiziqni uchratadi.', 'Восемь положительно, значит горизонталь кривую встречает.', 'Eight is positive, so the horizontal does meet the curve.') },
        { id: 'd', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p davriy funksiyada bo'ladi, bu esa monoton.", 'Бесконечно много бывает у периодической функции, а эта монотонна.', 'Infinitely many happens for a periodic function, and this one is monotone.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Ikki iks darajada minus to'rtga teng tenglamada nechta ildiz bor?", 'Сколько корней у уравнения два в степени икс равно минус четырём?', 'How many roots does two to the x equals minus four have?'),
      done: '∅',
      items: [
        { id: 'a', label: L('birortasi ham', 'ни одного', 'none'), correct: true, ok: L("Ha. Gorizontal egri chiziqdan pastda, va uchrashuvlari yo'q.", 'Да. Горизонталь ниже кривой, и встреч у них нет.', 'Yes. The horizontal is below the curve, and they have no meetings.') },
        { id: 'b', label: L('bitta', 'один', 'one'), hint: L("Bitta ildiz uchun o'ng qism musbat bo'lishi kerak.", 'Для одного корня правая часть должна быть положительной.', 'For one root the right side must be positive.') },
        { id: 'c', label: L('ikkita', 'два', 'two'), hint: L("Egri chiziq butunlay o'qdan yuqorida, gorizontal esa pastda.", 'Кривая целиком выше оси, а горизонталь ниже.', 'The curve lies entirely above the axis, and the horizontal below.') },
        { id: 'd', label: L('minus ikki', 'минус два', 'minus two'), hint: L('Savol ildizlar soni haqida, qiymati haqida emas.', 'Спросили число корней, а не их значение.', 'The question was the number of roots, not their value.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Almashtirishdan keyin nima tekshiriladi?', 'Что проверяют после замены?', 'What is checked after a substitution?'),
      done: 't > 0',
      items: [
        { id: 'a', label: L('almashtirish qiymati musbatligini', 'что значение замены положительно', 'that the substituted value is positive'), correct: true },
        { id: 'b', label: L('hech narsa', 'ничего', 'nothing'), hint: L('Unda javobga daraja bermaydigan qiymat tushadi.', 'Тогда в ответ попадёт значение, которого степень не даёт.', 'Then a value that no power gives will get into the answer.') },
        { id: 'c', label: L('butunligini', 'что оно целое', 'that it is a whole number'), hint: L("Almashtirishning kasr qiymati ham yaraydi, faqat musbat bo'lsa.", 'Дробное значение замены годится, лишь бы положительное.', 'A fractional substituted value is fine, as long as it is positive.') },
        { id: 'd', label: L('birdan kichikligini', 'что оно меньше единицы', 'that it is less than one'), hint: L("Qiymat birdan katta ham bo'ladi: ekrandagi to'rt yaradi.", 'Значение бывает и больше единицы: четвёрка на экране подошла.', 'The value can exceed one: the four on the screen fitted.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlash kerak edi. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you had to choose one of two readings. Here is the result.'),
    A('next', "Ko'rsatkich bo'lish bilan topilmaydi. O'ng qism o'sha asosning darajasi qilib yoziladi, va shunda ko'rsatkichlar to'g'ridan to'g'ri solishtiriladi.", 'Показатель делением не находят. Правую часть записывают степенью того же основания, и тогда показатели сравнивают напрямую.', 'The exponent is not found by dividing. The right side is written as a power of the same base, and then the exponents are compared directly.'),
  ],
  can: [
    L('Tenglamani bitta asosga keltiraman', 'Привожу уравнение к одному основанию', 'I reduce an equation to one base'),
    L("Ko'rsatkichlarni nega tenglashtirish mumkinligini bilaman", 'Знаю, почему можно приравнять показатели', 'I know why the exponents may be set equal'),
    L("Gorizontal bo'yicha nechta ildiz bo'lishini ko'raman", 'Вижу по горизонтали, сколько будет корней', 'I see from the horizontal how many roots there will be'),
    L('Almashtirish qiymatini musbatligiga tekshiraman', 'Проверяю значение замены на положительность', 'I check the substituted value for positivity'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L('Bitta joy takrorlashni talab qiladi: almashtirish va uni tekshirish.', 'Одно место требует повтора: замена и её проверка.', 'One place needs review: the substitution and its check.'),
    back: L('Qoidaga va 6-ekranga qayting.', 'Вернись к правилу и к экрану 6.', 'Go back to the rule and to screen 6.'),
  },
  bridge: L("Keyin noma'lum asosning o'zi bo'ladi, va logarifm paydo bo'ladi.", 'Дальше неизвестным станет само основание, и появится логарифм.', 'Next the base itself becomes the unknown, and the logarithm appears.'),
  lifehack: L("Yechishdan oldin o'ng qismga qarang. Nol yoki manfiy son ildiz yo'qligini bildiradi.", 'Прежде чем решать, посмотри на правую часть. Ноль или отрицательное число означает, что корней нет.', 'Before solving, look at the right side. Zero or a negative number means there are no roots.'),
  sheetTitle: L("Ko'rsatkichli tenglamalar · shpargalka", 'Показательные уравнения · шпаргалка', 'Exponential equations · cheat sheet'),
  sheetSrc: L('10-sinf · 28-dars', '10 класс · урок 28', 'Grade 10 · lesson 28'),
  hook: {
    a: 'x = 4',
    b: 'x = 3',
  },
  proved: 'x = 3',
  law: 'a^{f(x)} = a^{g(x)}   →   f(x) = g(x)',
  sheet: [
    '2^x = 8   →   2^x = 2³',
    'f(x) = g(x)',
    't = a^x,   t > 0',
    'a^x = 0   →   ∅',
    'a^x < 0   →   ∅',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число из контента: минус там типографский, `parseFloat` его не понимает.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))

// ОКНО ЧЕРТЕЖА ОДНО НА ВЕСЬ УРОК, и оно ШИРЕ, чем в уроке 27.
//
// Причина в математике урока: горизонталь стоит на уровне восьми, а встреча
// приходится на икс, равный трём. Значит в кадре обязаны быть и восьмёрка на
// вертикальной оси, и тройка на горизонтальной, обе с подписями. Иначе
// свидетель врёт: линия проходит там, где написано другое число. Ровно эту
// ошибку стенд поймал 2026-08-14 на асимптоте.
const WIN = { xmin: -2.6, xmax: 3.15, ymax: 9, tx: [-2, -1, 1, 2, 3], ty: [1, 2, 4, 8] }

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

const ORD4 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S4.order[id] }))
const ORD5 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S5.order[id] }))
const ORD10 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S10.order[id] }))
const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

// ЗАПИСЬ РАСТЁТ ВНИЗ -- прибор 2. Кадр приходит смешанным: слова это
// объекты `L(...)`, формулы -- строки. Слева ложится решение (зелёным ровно
// одна строка, решение методиста §5), справа стоят слова текущего кадра.
const Tape = ({ show, phase }) => {
  const at = Math.min(phase, show.length - 1)
  const rows = []
  for (let i = 0; i <= at; i += 1) {
    show[i].forEach((x) => { if (typeof x === 'string') rows.push(x) })
  }
  const lines = show[at].filter((x) => typeof x !== 'string')
  return (
    <Cols l={1} r={1}>
      <Col>
        <Panel tone="paper">
          <NoteList items={rows.map((r, i) => (i === rows.length - 1 ? { ok: true, v: r } : r))} />
        </Panel>
      </Col>
      <Col><NoteList items={lines} /></Col>
    </Cols>
  )
}

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Кривая есть, ГОРИЗОНТАЛИ нет: иначе прогноз читался бы с чертежа.
        // Горизонталь появляется на экране 3, там же, где ответ.
        fig={() => <Scene fig={<Plane step={1} curve="exp" show="none" {...WIN} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.1}>
        <Col>
          <Scene fig={<Plane step={1} curve="exp" show="none" {...WIN} />} max={300} />
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
      /* СВИДЕТЕЛЬ УРОКА. Горизонталь на уровне восьми, и на втором кадре
         встреча зажигается вместе с проекцией на тройку. Одна встреча --
         один корень, и это видно, а не сказано. */
      <Scene
        fig={<Plane step={phase} curve="exp" show="none" level={8} {...WIN} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="exp" show="none" level={8} {...WIN} />} max={300} />
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
      <Tape show={S4.show} phase={phase} />
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
      <Tape show={S5.show} phase={phase} />
    ) : (
      <OrderRow
        prompt={S5.order.prompt}
        items={ORD5}
        answer={['s1', 's2', 's3', 's4']}
        okText={S5.order.ok}
        badText={S5.order.bad}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      <Tape show={S6.show} phase={phase} />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          {/* Горизонталь на четвёрке: значение замены, которое ГОДИТСЯ.
              Отрицательное значение горизонталью не показать -- и это же
              есть довод, почему его отбрасывают. */}
          <Scene fig={<Plane step={1} curve="exp" show="none" level={4} {...WIN} />} max={300} />
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
      /* Горизонталь УШЛА ПОД ОСЬ. Встречи нет, и отсутствие встречи -- тоже
         свидетель: корней нет, и это видно до вычислений. */
      <Scene
        fig={<Plane step={phase} curve="exp" show="none" level={-2} {...WIN} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="exp" show="none" level={-2} {...WIN} />} max={300} />
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
        // Встреча зажигается в момент ответа: правило открывается рядом с
        // тем движением, которое его и породило.
        fig={(solved) => (
          <Scene
            fig={<Plane step={solved ? 1 : 0} curve="exp" show="none" level={8} {...WIN} />}
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
        {/* Запись БЕЗ панели: панель с большой формулой стоила 89 px, и на
            1366x615 экран вылезал из бюджета на 11 px (проверка вёрстки). */}
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
          <Scene fig={<Plane step={1} curve="exp" show="none" {...WIN} />} max={300} />
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
        // Уровень идёт за вопросом: восемь, восемь, минус два, четыре.
        // Третий вопрос про отсутствие корней, и горизонталь там под осью.
        fig={(round) => (
          <Scene
            fig={<Plane step={1} curve="exp" show="none" level={round === 2 ? -2 : round === 3 ? 4 : 8} {...WIN} />}
            // Blits chizmasi KICHIK: uzbek matnida to'rt variant balandroq, va
            // telefonda ekran budjetdan 22 px chiqib ketardi. `h` shart -- telefonda
            // `max` ishlamaydi, chizma baribir ustun kengligiga siqiladi.
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
