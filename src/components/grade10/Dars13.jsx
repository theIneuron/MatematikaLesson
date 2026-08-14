// ============================================================================
// 10-sinf, Dars 13. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS13_KONTENT.md
// Ma'lumot mashina bilan yig'ilgan, ekran tanalari qo'lda yozilgan (etalon
// §5.3). Tekshirish: `node scripts/grade10-check.mjs dars13`.
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
  BuildPoint,
  MatchPairs,
  MultiPick,
  NoteList,
  NumberEntry,
  OrderRow,
  PlaceAngle,
  ProbeChain,
  Scene,
  UnitCircle,
} from './tools.jsx'
// `LostRoots` -- свидетель урока: серия гаснет на глазах. Снята на стенде до
// контента.
import { LevelLine, LostRoots } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 13
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Usullar`,
  `Урок ${LESSON_NO}. Методы`,
  `Lesson ${LESSON_NO}. Methods`,
)

const BLOCK = { label: 'B2', from: 8, to: 13, current: 13 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('USULLAR', 'МЕТОДЫ', 'THE METHODS'),
  title: L("Kosinusga bo'lish mumkinmi?", 'Можно ли делить на косинус?', 'May we divide by the cosine?'),
  motion: ['mount'],
  audio: [
    A('mount', "Aylanada to'rt ildiz yonib turadi. Endi ikkala qismni kosinusga bo'lamiz, va ulardan ikkitasi so'nadi.", 'На окружности горят четыре корня. Сейчас мы поделим обе части на косинус, и два из них погаснут.', 'Four roots are lit on the circle. Now we will divide both sides by the cosine, and two of them will fade.'),
    A('r1', "Birinchi yozuv bo'lish mumkin va javob o'zgarmaydi deydi.", 'Первая запись говорит, что делить можно и ответ не изменится.', 'The first reading says dividing is fine and the answer stays.'),
    A('r2', 'Ikkinchisi ildizlarning bir qismi javobga tushmaydi deydi.', 'Вторая говорит, что часть корней в ответ не попадёт.', 'The second says some roots will not be in the answer.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi bo'lib, nima qolishini ko'ramiz.", 'Твой ответ записан. Сейчас поделим и посмотрим, что останется.', 'Your answer is saved. Now we will divide and see what is left.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("mumkin, javob o'sha", 'можно, ответ тот же', 'yes, the answer stays'),
      value: '2 sin x = 1',
    },
    b: {
      name: L("mumkin emas, ildizlar yo'qoladi", 'нельзя, корни потеряются', 'no, roots get lost'),
      value: ['cos x', '(2 sin x − 1) = 0'],
    },
  },
  expr: ['2 sin x', 'cos x = cos x'],
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Usullardan oldin uch savol', 'Три вопроса перед методами', 'Three questions before the methods'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Ko'paytma qachon nolga teng?", 'Когда произведение равно нулю?', 'When is a product equal to zero?'),
      done: ['a', 'b = 0'],
      items: [
        { id: 'a', label: L("bitta ko'paytuvchi nol", 'хотя бы один множитель ноль', 'at least one factor is zero'), correct: true },
        { id: 'b', label: L("hamma ko'paytuvchi nol", 'все множители нули', 'all factors are zero'), hint: L("Bittasi yetadi: qolganlari har qanday bo'lishi mumkin.", 'Достаточно одного: остальные могут быть любыми.', 'One is enough: the others may be anything.') },
        { id: 'c', label: L("ko'paytuvchilar teng", 'множители равны', 'the factors are equal'), hint: L("Teng ko'paytuvchilar kvadrat beradi, nol emas.", 'Равные множители дают квадрат, а не обязательно ноль.', 'Equal factors give a square, not necessarily zero.') },
        { id: 'd', label: L('hech qachon', 'никогда', 'never'), hint: L("Ko'paytmadagi nol hammasini nollaydi.", 'Ноль в произведении обнуляет всё.', 'A zero in a product zeroes everything.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Qaysi burchaklarda kosinus nolga teng?', 'При каких углах косинус равен нулю?', 'At which angles is the cosine zero?'),
      done: 'cos x = 0   →   90°,  270°',
      items: [
        { id: 'a', label: L("to'qson va ikki yuz yetmish", 'девяносто и двести семьдесят', 'ninety and two hundred seventy'), correct: true },
        { id: 'b', label: L('nol va yuz sakson', 'ноль и сто восемьдесят', 'zero and one hundred eighty'), hint: L("U yerda nol balandlikda, ya'ni sinusda.", 'Там ноль у высоты, то есть у синуса.', 'There the zero is in the height, that is the sine.') },
        { id: 'c', label: L('hech qaysida', 'ни при каких', 'at none of them'), hint: L("Vertikal o'qda siljish nolga teng.", 'На вертикальной оси сдвиг равен нулю.', 'On the vertical axis the shift is zero.') },
        { id: 'd', label: L('qirq besh', 'сорок пять', 'forty five'), hint: L('U yerda siljish va balandlik teng va nolga teng emas.', 'Там сдвиг и высота равны и не равны нулю.', 'There the shift and the height are equal and not zero.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Sinus qanday qiymatlarni olishi mumkin?', 'Какие значения может принимать синус?', 'Which values can the sine take?'),
      done: '−1 ≤ sin x ≤ 1',
      items: [
        { id: 'a', label: L('minus birdan birgacha', 'от минус единицы до единицы', 'from minus one to one'), correct: true },
        { id: 'b', label: L('har qanday', 'любые', 'any values'), hint: L("Nuqta radiusi bir bo'lgan aylanada yotadi.", 'Точка лежит на окружности радиуса один.', 'The point lies on the circle of radius one.') },
        { id: 'c', label: L('faqat butun sonlar', 'только целые', 'only whole numbers'), hint: L("Nol va bir orasida qiymatlar qancha bo'lsa ham bor.", 'Между нулём и единицей значений сколько угодно.', 'Between zero and one there are any number of values.') },
        { id: 'd', label: L('faqat musbat', 'только положительные', 'only positive ones'), hint: L("O'qdan pastda balandlik manfiy.", 'Ниже оси высота отрицательна.', 'Below the axis the height is negative.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Umumiy ko'paytuvchi chiqariladi", 'Общий множитель выносится', 'The common factor comes out'),
  tag: 'koren-poteryan-pri-delenii',
  show: [
    [
      L('kosinus ikkala qismda ham bor', 'косинус есть в обеих частях', 'the cosine is in both sides'),
      L("ko'chiramiz va chiqaramiz", 'переносим и выносим', 'we move it over and factor it out'),
    ],
    [
      L("ko'paytma nolga teng", 'произведение равно нулю', 'the product equals zero'),
      L('demak ikkita sodda tenglama', 'значит два простейших уравнения', 'so two simplest equations'),
    ],
  ],
  motion: ['split'],
  audio: [
    A('mount', 'Tenglamada kosinus ikkala qismda turadi. Uni chiqarish mumkin.', 'В уравнении косинус стоит в обеих частях. Его можно вынести.', 'In the equation the cosine stands in both sides. It can be factored out.'),
    A('split', "Hammasini bir qismga ko'chiramiz va kosinusni chiqaramiz. Nolga teng ko'paytma chiqadi, bunday ko'paytma esa ikkita sodda tenglamaga ajraladi. Aylanada to'rt ildiz yonadi: ikkitasi kosinusdan, ikkitasi sinusdan.", 'Переносим всё в одну часть и выносим косинус. Получается произведение, равное нулю, а такое произведение распадается на два простейших уравнения. На окружности зажигаются все четыре корня: два от косинуса и два от синуса.', 'We move everything to one side and factor out the cosine. A product equal to zero appears, and such a product splits into two simplest equations. All four roots light up on the circle: two from the cosine and two from the sine.'),
    A('work', "Endi o'zingiz. Kosinus beradigan ildizga nuqta qo'ying.", 'Теперь сам. Поставь точку в тот корень, который даёт косинус.', 'Now you. Place the point at the root that comes from the cosine.'),
  ],
  work: {
    prompt: L("Kosinus nolga teng bo'lgan ildizga nuqta qo'ying.", 'Поставь точку в корень, где косинус равен нулю.', 'Place the point at the root where the cosine is zero.'),
    ok: L("To'qson gradus. U yerda siljish nolga teng, demak birinchi ko'paytuvchi nollanadi.", 'Девяносто градусов. Сдвиг там равен нулю, значит первый множитель обнуляется.', 'Ninety degrees. The shift there is zero, so the first factor becomes zero.'),
    hint: [
      L('Kosinus bu siljish, u nolga teng joyni qidiring.', 'Косинус это сдвиг, ищи, где он равен нулю.', 'The cosine is the shift, look where it is zero.'),
      L('Bu aylananing yuqori yoki pastki nuqtasi.', 'Это верхняя или нижняя точка окружности.', 'That is the top or the bottom point of the circle.'),
      L("To'qson gradus.", 'Девяносто градусов.', 'Ninety degrees.'),
    ],
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Bo'lish seriyani so'ndiradi", 'Деление гасит серию', 'Dividing puts a series out'),
  tag: 'koren-poteryan-pri-delenii',
  show: [
    [
      L("ikkala qismni kosinusga bo'lamiz", 'делим обе части на косинус', 'we divide both sides by the cosine'),
      L('yozuv qisqardi', 'запись стала короче', 'the reading got shorter'),
    ],
    [
      L("ikki ildiz so'ndi", 'два корня погасли', 'two roots faded'),
      L('ular esa yechim edi', 'а они были решением', 'and they were solutions'),
    ],
  ],
  motion: ['lose'],
  audio: [
    A('mount', "Endi boshqacha qilib ko'ramiz: ikkala qismni kosinusga bo'lamiz.", 'Теперь попробуем сделать иначе: поделим обе части на косинус.', 'Now let us try it differently: divide both sides by the cosine.'),
    A('lose', "Yozuv qisqardi, lekin aylanaga qarang: ikki ildiz so'ndi. Bu kosinus nolga teng bo'lganlar. Ularga bo'lish mumkin emas edi, va ular javobdan tushib qoldi. Shuning uchun tenglama bo'linmaydi, ko'paytuvchilarga ajratiladi.", 'Запись стала короче, но смотри на окружность: два корня погасли. Это те, где косинус равен нулю. Делить на них было нельзя, и они выпали из ответа. Поэтому уравнение не делят, а разлагают на множители.', 'The reading got shorter, but look at the circle: two roots faded. Those are the ones where the cosine is zero. Dividing by them was not allowed, and they dropped out of the answer. That is why an equation is factored, not divided.'),
    A('work', "Endi o'zingiz. Yo'qolgan ildizga nuqta qo'ying.", 'Теперь сам. Поставь точку в тот корень, который потерялся.', 'Now you. Place the point at the root that got lost.'),
  ],
  work: {
    prompt: L("Yo'qolgan ildizga nuqta qo'ying.", 'Поставь точку в потерянный корень.', 'Place the point at the lost root.'),
    ok: L("Ikki yuz yetmish. U yerda kosinus nolga teng, va bo'lish aynan shu ildizlarni yo'q qiladi.", 'Двести семьдесят. Там косинус равен нулю, и деление именно эти корни и уничтожает.', 'Two hundred seventy. There the cosine is zero, and division destroys exactly those roots.'),
    hint: [
      L("Kosinus nolga teng ildizlar yo'qoldi.", 'Потерялись те корни, где косинус равен нулю.', 'The lost roots are the ones where the cosine is zero.'),
      L('Biri yuqorida, ikkinchisi pastda.', 'Один из них наверху, другой внизу.', 'One of them is at the top, the other at the bottom.'),
      L('Ikki yuz yetmish gradus.', 'Двести семьдесят градусов.', 'Two hundred seventy degrees.'),
    ],
  },
}

const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Almashtirish tenglamani oddiy qiladi', 'Замена делает уравнение обычным', 'A substitution makes it an ordinary equation'),
  tag: 'seriya-bez-n',
  show: [
    [
      L('sinus ikki marta uchraydi', 'синус встречается дважды', 'the sine occurs twice'),
      L('uni harf bilan belgilaymiz', 'обозначим его буквой', 'let us name it with a letter'),
    ],
    [
      L('oddiy tenglama chiqdi', 'получилось обычное уравнение', 'an ordinary equation came out'),
      L('sakkizinchi sinfdagidek yechamiz', 'решаем как в восьмом классе', 'we solve it as in grade eight'),
    ],
  ],
  motion: ['swap'],
  audio: [
    A('mount', 'Bu yerda sinus ikki marta uchraydi: kvadratda va oddiy.', 'Здесь синус встречается дважды, и в квадрате, и просто.', 'Here the sine occurs twice, squared and plain.'),
    A('swap', 'Sinusni te harfi bilan belgilaymiz. Tenglama oddiy kvadrat tenglamaga aylanadi, va u sakkizinchi sinfdagi usul bilan yechiladi. Ikki qiymat chiqadi: bir va bir ikkidan.', 'Обозначим синус буквой тэ. Уравнение становится обычным квадратным, и оно решается тем же способом, что в восьмом классе. Получаются два значения: единица и одна вторая.', 'Let us name the sine t. The equation becomes an ordinary quadratic one, and it is solved the same way as in grade eight. Two values come out: one and one half.'),
    A('work', "Endi o'zingiz. Bir qiymatini beradigan ildizga nuqta qo'ying.", 'Теперь сам. Поставь точку в тот корень, который даёт значение единица.', 'Now you. Place the point at the root giving the value one.'),
  ],
  work: {
    prompt: L("Sinus birga teng joyga nuqta qo'ying.", 'Поставь точку, где синус равен единице.', 'Place the point where the sine equals one.'),
    ok: L("To'qson gradus. U yerda balandlik birga teng, bu almashtirishning birinchi qiymati.", 'Девяносто градусов. Высота там равна единице, это и есть первое значение замены.', 'Ninety degrees. The height there is one, and that is the first value of the substitution.'),
    hint: [
      L('Sinus bu balandlik, eng kattasini qidiring.', 'Синус это высота, ищи наибольшую.', 'The sine is the height, look for the largest.'),
      L("U aylananing eng tepasida bo'ladi.", 'Она бывает на самом верху окружности.', 'It happens at the very top of the circle.'),
      L("To'qson gradus.", 'Девяносто градусов.', 'Ninety degrees.'),
    ],
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Almashtirishning har qiymati yaramaydi', 'Не всякое значение замены годится', 'Not every substituted value fits'),
  tag: 'net-resheniy',
  show: [
    [
      L('almashtirish ikki qiymat berdi', 'замена дала два значения', 'the substitution gave two values'),
      L('biri ikkiga teng', 'одно равно двум', 'one of them equals two'),
    ],
    [
      L('sinus ikkini bermaydi', 'синус двойки не даёт', 'the sine never gives two'),
      L('demak bu qiymat tashlanadi', 'значит это значение отбрасывается', 'so that value is dropped'),
    ],
  ],
  motion: ['check'],
  audio: [
    A('mount', 'Boshqa tenglamani olaylik. Almashtirishdan keyin ikki va minus bir ikkidan chiqdi.', 'Возьмём другое уравнение. После замены получились двойка и минус одна вторая.', 'Take another equation. After the substitution we got two and minus one half.'),
    A('check', "Ikki yaramaydi: aylanadagi nuqtaning balandligi birdan katta bo'lmaydi. Shunday balandlikdagi to'g'ri chiziq aylananing yonidan o'tardi. Demak bu qiymat tashlanadi, faqat ikkinchisi bilan yechish kerak.", 'Двойка не годится: высота точки на окружности больше единицы не бывает. Прямая на такой высоте прошла бы мимо круга. Значит это значение отбрасывается, а решать надо только со вторым.', 'Two does not fit: the height of a point on the circle is never above one. A line at such a height would miss the circle. So that value is dropped, and only the second one is solved.'),
    A('work', "O'zingiz hisoblang. Almashtirishning nechta qiymati yaraydi?", 'Посчитай сам. Сколько значений замены годится?', 'Compute it yourself. How many substituted values fit?'),
  ],
  work: {
    prompt: L('Almashtirishning nechta qiymati yaraydi?', 'Сколько значений замены годится?', 'How many substituted values fit?'),
    ok: L("Bitta. Ikki chegaradan chiqadi, minus bir ikkidan esa sig'adi.", 'Одно. Двойка выходит за пределы, а минус одна вторая помещается.', 'One. Two is out of range, and minus one half fits.'),
    hint: [
      L('Har qiymatni sinus chegaralari bilan tekshiring.', 'Проверь каждое значение по границам синуса.', 'Check each value against the bounds of the sine.'),
      L('Chegaralar minus birdan birgacha.', 'Границы это от минус единицы до единицы.', 'The bounds are from minus one to one.'),
      L('Bitta.', 'Одно.', 'One.'),
    ],
    answer: '1',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("O'zgaruvchiga qaytish", 'Возврат к переменной', 'Back to the variable'),
  tag: 'seriya-bez-n',
  show: [
    [
      L('almashtirish qiymati topildi', 'значение замены найдено', 'the substituted value is found'),
      L('lekin bu hali javob emas', 'но это ещё не ответ', 'but that is not the answer yet'),
    ],
    [
      L("orqaga qo'yamiz", 'подставляем обратно', 'we put it back'),
      L('va soddani yechamiz', 'и решаем простейшее', 'and solve the simplest equation'),
    ],
  ],
  motion: ['back'],
  audio: [
    A('mount', 'Almashtirish qiymati topildi, lekin javob harf bilan emas, burchaklar bilan yoziladi.', 'Значение замены найдено, но ответ пишется углами, а не буквой.', 'The substituted value is found, but the answer is written in angles, not in a letter.'),
    A('back', "Topilgan qiymatni orqaga qo'yamiz va sodda tenglamani yechamiz. Almashtirishning bitta qiymati ikkita seriya beradi, chunki shu balandlikdagi to'g'ri chiziq aylanani ikki marta kesadi.", 'Подставляем найденное значение обратно и решаем простейшее уравнение. Одно значение замены даёт целых две серии корней, потому что прямая на этой высоте задевает окружность дважды.', 'We put the found value back and solve the simplest equation. One substituted value gives two whole series of roots, because a line at that height meets the circle twice.'),
    A('work', "O'zingiz hisoblang. Almashtirishning bitta qiymati nechta seriya beradi?", 'Посчитай сам. Сколько серий даёт одно значение замены?', 'Compute it yourself. How many series does one substituted value give?'),
  ],
  work: {
    prompt: L('Almashtirishning bitta qiymati nechta seriya beradi?', 'Сколько серий даёт одно значение замены?', 'How many series does one substituted value give?'),
    ok: L("Ikkita. Shu balandlikdagi to'g'ri chiziq aylanani ikki nuqtada kesadi, va har birining o'z seriyasi bor.", 'Две. Прямая на этой высоте задевает окружность в двух точках, и у каждой своя серия.', 'Two. A line at that height meets the circle at two points, and each has its own series.'),
    hint: [
      L("Topilgan balandlikda to'g'ri chiziq o'tkazing.", 'Проведи прямую на найденной высоте.', 'Draw a line at the found height.'),
      L('U aylanani ikki nuqtada kesadi.', 'Она задевает окружность в двух точках.', 'It meets the circle at two points.'),
      L('Ikkita.', 'Две.', 'Two.'),
    ],
    answer: '2',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Soddaga qanday keltirish', 'Как приводить к простейшему', 'How to reduce to the simplest'),
  tag: 'koren-poteryan-pri-delenii',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "So'ngan ildizlar qaytadan yonadi, va qoida yonida ochiladi. Noma'lumli ifodaga bo'lish kelishuv bo'yicha emas, ekranda nima yo'qolganini ko'rish mumkin bo'lgani uchun mumkin emas.", 'Погасшие корни зажигаются обратно, и правило открывается рядом. Делить на выражение с неизвестным нельзя не по договору, а потому, что на экране видно, что при этом теряется.', 'The faded roots light up again, and the rule opens beside it. Dividing by an expression with the unknown is forbidden not by agreement but because the screen shows what gets lost.'),
  ],
  probe: {
    question: L("Nega kosinusga bo'lish mumkin emas?", 'Почему нельзя делить на косинус?', 'Why is dividing by the cosine not allowed?'),
    items: [
      { id: 'a', label: L("u nol bo'lgan joyda ildizlar bor edi", 'там, где он ноль, были корни', 'where it is zero there were roots'), correct: true },
      { id: 'b', label: L("bo'lish yozuvni murakkablashtiradi", 'деление усложняет запись', 'division makes the reading harder'), hint: L("Yozuv aksincha soddalashadi. Gap yo'qolgan ildizlarda, qulaylikda emas.", 'Запись как раз упрощается. Дело в потерянных корнях, а не в удобстве.', 'The reading actually gets simpler. The issue is the lost roots, not convenience.') },
    ],
  },
  rule: {
    lawLabel: L('Keltirish', 'Приведение', 'The reduction'),
    lines: [
      L("Umumiy ko'paytuvchi chiqariladi, nolga teng ko'paytma esa sodda tenglamalarga ajraladi.", 'Общий множитель выносят, а произведение, равное нулю, распадается на простейшие уравнения.', 'The common factor is taken out, and a product equal to zero splits into simplest equations.'),
      L("Ikkala qismni noma'lumli ifodaga bo'lish mumkin emas: u nolga teng bo'lgan ildizlar yo'qoladi.", 'Делить обе части на выражение с неизвестным нельзя: корни, где оно равно нулю, теряются.', 'Both sides must not be divided by an expression with the unknown: the roots where it is zero get lost.'),
      L("Almashtirishdan keyin chegaralar tekshiriladi, oxirida esa o'zgaruvchiga qaytiladi.", 'После замены проверяют границы, а в конце возвращаются к переменной.', 'After a substitution the bounds are checked, and at the end we return to the variable.'),
    ],
    law: ['a', 'b = 0   →   a = 0,  b = 0'],
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("To'liq javobda nechta seriya", 'Сколько серий в полном ответе', 'How many series in the full answer'),
  tag: 'koren-poteryan-pri-delenii',
  audio: [
    A('mount', "To'rt tenglama va to'rt son. Ularni birlashtiring.", 'Четыре уравнения и четыре числа. Соедини их.', 'Four equations and four numbers. Match them.'),
  ],
  match: {
    prompt: L("Tenglamani to'liq javobdagi seriyalar soni bilan birlashtiring.", 'Соедини уравнение с числом серий в полном ответе.', 'Match the equation with the number of series in its full answer.'),
    ok: L("Ildizlar emas, seriyalar sanaladi. Kosinusda ikki nuqta bitta seriyaga yig'iladi, sinusda esa yo'q, aylananing yonidan o'tgan chiziq esa birortasini bermaydi.", 'Считаются серии, а не корни. У косинуса две точки складываются в одну серию, у синуса нет, а прямая мимо круга не даёт ни одной.', 'Series are counted, not roots. For the cosine two points fold into one series, for the sine they do not, and a line that misses the circle gives none.'),
    left: ['sin x cos x = 0', '2 sin x cos x = cos x', 'sin x = −1', 'sin x = 2'],
    a: '2',
    b: '3',
    c: '1',
    d: '0',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Qadam bilan yeching', 'Реши по шагам', 'Solve it step by step'),
  tag: 'koren-poteryan-pri-delenii',
  audio: [
    A('mount', "To'rtta qadam. Tartibini o'zingiz qo'yasiz.", 'Четыре шага. Порядок ставишь ты.', 'Four steps. You put them in order.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L('hammasi bir qismga', 'всё в одну часть', 'everything to one side'),
    s2: L("ko'paytuvchini chiqaramiz", 'выносим множитель', 'we factor it out'),
    s3: L('ikkita sodda', 'два простейших', 'two simplest equations'),
    s4: L('ikkala seriya javobga', 'обе серии в ответ', 'both series into the answer'),
    ok: L("Tartib doim shunday. Unda bo'lish bir qadamda ham yo'q, shuning uchun yo'qotadigan narsa yo'q.", 'Порядок такой всегда. Деления в нём нет ни на одном шаге, поэтому и терять нечего.', 'The order is always this. There is no division at any step, so there is nothing to lose.'),
    bad: L("Avval hammasi bir qismga, keyin ko'paytuvchi, keyin ikki tenglama, keyin javob.", 'Сначала всё в одну часть, потом множитель, потом два уравнения, потом ответ.', 'First everything to one side, then the factor, then two equations, then the answer.'),
    mark: '90°',
  },
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Chizmasiz hisoblang', 'Посчитай без чертежа', 'Compute without a drawing'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi.", 'На этом экране окружности нет. На экзамене чертежа тоже не будет.', 'There is no circle on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L('Uchta. Kosinus yuz sakson qadamli bitta seriya beradi, sinus esa ikkita.', 'Три. Косинус даёт одну серию с шагом сто восемьдесят, а синус две.', 'Three. The cosine gives one series with a step of one hundred eighty, and the sine two.'),
    hint: [
      L("Har ko'paytuvchining seriyalarini alohida sanang.", 'Посчитай серии у каждого множителя отдельно.', 'Count the series of each factor separately.'),
      L('Kosinusda nuqtalar qarama-qarshi, seriyasi umumiy.', 'У косинуса точки противоположны, и серия у них общая.', 'For the cosine the points are opposite and share one series.'),
      L('Uchta.', 'Три.', 'Three.'),
    ],
    prompt: ['cos x', '(2 sin x − 1) = 0   →   ?'],
    answer: '3',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi ildiz kichikroq?', 'Какой корень меньше?', 'Which root is smaller?'),
    ok: L("Siz ular chiqqan ko'paytuvchilarni emas, burchaklarni solishtirdingiz.", 'Ты сравнил углы, а не множители, из которых они получились.', 'You compared angles, not the factors they came from.'),
    bad: L("Har yozuvni songa o'tkazing, keyin solishtiring.", 'Переведи каждую запись в число, потом сравнивай.', 'Turn each reading into a number, then compare.'),
    items: ['30°', '90°', '150°', '270°'],
    answer: '30°  90°  150°  270°',
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
    A('mount', "Masala. Ikkala qismda kosinus bo'lgan tenglamani yechish.", 'Задача. Решить уравнение с косинусом в обеих частях.', 'A task. Solve an equation with the cosine in both sides.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L('Bu qator shartni shunchaki qaytadan yozadi.', 'Эта строка просто переписывает условие.', 'This line just rewrites the task.'),
    r3: L("Bu oldingi qatorning to'g'ri natijasi.", 'Это верное следствие предыдущей строки.', 'This is a correct consequence of the previous line.'),
    r4: L("Bu seriyalar to'g'ri hisoblangan, lekin hammasi emas.", 'Эти серии посчитаны верно, но их не все.', 'These series are computed correctly, but they are not all of them.'),
  },
  proof: L("Bu yerda kosinusga bo'lindi, va uning ildizlari yo'qoldi.", 'Здесь поделили на косинус, и его корни исчезли.', 'Here they divided by the cosine, and its roots vanished.'),
  entry: {
    prompt: L("To'liq javobda nechta seriya bor?", 'Сколько серий в полном ответе?', 'How many series are in the full answer?'),
    ok: L('Uchta. Ikkitasi sinusdan, bittasi kosinusdan, yuz sakson qadam bilan.', 'Три. Две от синуса и одна от косинуса, с шагом сто восемьдесят.', 'Three. Two from the sine and one from the cosine, with a step of one hundred eighty.'),
    hint: [
      L("Har ko'paytuvchining seriyalarini sanang.", 'Посчитай серии у каждого множителя.', 'Count the series of each factor.'),
      L('Kosinusda nuqtalar qarama-qarshi, seriyasi bitta.', 'У косинуса точки противоположны, серия у них одна.', 'For the cosine the points are opposite, they share one series.'),
      L('Uchta.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
  row: {
    r1: ['2 sin x', 'cos x = cos x'],
    r2: '2 sin x = 1',
    r3: 'sin x = 1/2',
    r4: '30° + 360°n,  150° + 360°n',
  },
  answerId: 'r2',
}

const S13 = {
  role: 'transfer',
  answer: 'lead',
  format: 'place+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Qaysi ildizlar yo'qolgan", 'Какие корни потеряны', 'Which roots are lost'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Endi teskari masala. Qaysi ildizlar yo'qolishini aytish kerak.", 'Теперь обратная задача. Надо назвать, какие именно корни теряются.', 'Now the inverse task. You must name exactly which roots get lost.'),
    A('work', "Nuqtani qo'ying, keyin hamma yo'qolgan burchakni belgilaysiz.", 'Поставь точку, потом отметишь все потерянные углы.', 'Place the point, then you will mark every lost angle.'),
  ],
  multi: {
    prompt: L("Kosinusga bo'lishda yo'qoladigan hamma burchakni belgilang.", 'Отметь все углы, которые теряются при делении на косинус.', 'Mark every angle lost when dividing by the cosine.'),
    title: L("Kosinusga bo'lishda qaysi burchaklar yo'qoladi?", 'Какие углы теряются при делении на косинус?', 'Which angles are lost when dividing by the cosine?'),
    ok: L("Beshtadan uchtasi. Aynan kosinus nolga teng burchaklar yo'qoladi.", 'Три из пяти. Теряются ровно те углы, где косинус равен нулю.', 'Three out of five. Exactly the angles where the cosine is zero get lost.'),
    items: [
      { id: 'd', label: '30°', hint: L("O'ttizda kosinus nolga teng emas, bu ildiz qoladi.", 'У тридцати косинус не равен нулю, этот корень остаётся.', 'At thirty the cosine is not zero, this root stays.') },
      { id: 'e', label: '150°', hint: L('Yuz elliknikida ham kosinus nol emas.', 'У ста пятидесяти косинус тоже не ноль.', 'At one hundred fifty the cosine is not zero either.') },
      { id: 'a', label: '90°', ok: true },
      { id: 'b', label: '270°', ok: true },
      { id: 'c', label: '450°', ok: true },
    ],
  },
  place: {
    prompt: L("Nuqtani 90 gradusga qo'ying.", 'Поставь точку на 90 градусов.', 'Place the point at 90 degrees.'),
    ok: L("Bu yo'qolgan ildizlardan biri: u yerda kosinus nolga teng.", 'Это один из потерянных корней: там косинус равен нулю.', 'This is one of the lost roots: the cosine is zero there.'),
    wrong: L("To'qson bu aylananing eng tepasi.", 'Девяносто это самый верх окружности.', 'Ninety is the very top of the circle.'),
    target: '90°',
    step: 'cos x = 0',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'koren-poteryan-pri-delenii',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Umumiy ko'paytuvchini nima qiladilar?", 'Что делают с общим множителем?', 'What is done with a common factor?'),
      done: ['a', 'b = 0'],
      items: [
        { id: 'a', label: L('chiqaradilar', 'выносят', 'it is factored out'), correct: true },
        { id: 'b', label: L('qisqartiradilar', 'сокращают', 'it is cancelled'), hint: L("Qisqartirish bu o'sha bo'lish, va ildizlar yo'qoladi.", 'Сокращение это то же деление, и корни теряются.', 'Cancelling is the same division, and roots get lost.') },
        { id: 'c', label: L("kvadratga ko'taradilar", 'возводят в квадрат', 'it is squared'), hint: L("Kvadratga ko'tarish begona ildizlar qo'shadi, yordam bermaydi.", 'Возведение добавит посторонние корни, а не поможет.', 'Squaring adds extraneous roots instead of helping.') },
        { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L('Unda tenglama soddaga keltirilmaydi.', 'Тогда уравнение не приведётся к простейшему.', 'Then the equation will not reduce to the simplest one.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Kosinusga bo'lishda nima yo'qoladi?", 'Что теряется при делении на косинус?', 'What is lost when dividing by the cosine?'),
      done: 'cos x = 0',
      items: [
        { id: 'a', label: L('kosinus nolga teng ildizlar', 'корни, где косинус равен нулю', 'the roots where the cosine is zero'), correct: true },
        { id: 'b', label: L('sinus nolga teng ildizlar', 'корни, где синус равен нулю', 'the roots where the sine is zero'), hint: L("Nimaga bo'lingan bo'lsa, u yo'qoladi, bo'lingani esa kosinus.", 'Теряется то, на что делили, а делили на косинус.', 'What is lost is what was divided by, and that was the cosine.') },
        { id: 'c', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Ekranda ikki ildiz so'ndi, demak yo'qoladi.", 'На экране два корня погасли, значит теряется.', 'Two roots faded on the screen, so something is lost.') },
        { id: 'd', label: L('hamma ildiz', 'все корни', 'all the roots'), hint: L("Bir qismi qoladi: kosinus nol bo'lmaganlari.", 'Часть остаётся: те, где косинус не ноль.', 'Some remain: those where the cosine is not zero.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Almashtirishdan keyin nima qiladilar?', 'Что делают после замены?', 'What is done after a substitution?'),
      done: '−1 ≤ t ≤ 1',
      items: [
        { id: 'a', label: L('chegaralarni tekshiradilar', 'проверяют границы', 'the bounds are checked'), correct: true, ok: L('Ha. Birdan katta qiymatni sinus bermaydi.', 'Да. Значение больше единицы синус не даёт.', 'Yes. The sine never gives a value above one.') },
        { id: 'b', label: L('darrov javob yozadilar', 'сразу пишут ответ', 'the answer is written at once'), hint: L('Unda javobga imkonsiz qiymat tushadi.', 'Тогда в ответ попадёт невозможное значение.', 'Then an impossible value gets into the answer.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Sinusning bitta qiymati nechta seriya beradi?', 'Сколько серий даёт одно значение синуса?', 'How many series does one value of the sine give?'),
      done: '2',
      items: [
        { id: 'a', label: L('ikkita', 'две', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L("Bitta faqat chetda, bir va minus birda bo'ladi.", 'Одна бывает только у края, при единице и минус единице.', 'One happens only at the edge, at one and minus one.') },
        { id: 'c', label: L("to'rtta", 'четыре', 'four'), hint: L('Kesishish nuqtasi ikkita, demak seriya ham ikkita.', 'Точек пересечения две, значит и серий две.', 'There are two intersection points, so two series.') },
        { id: 'd', label: L('hech qaysi', 'ни одной', 'none'), hint: L("Qiymat chegaraga sig'sa, seriyalar bor.", 'Если значение помещается в границы, серии есть.', 'If the value fits the bounds, there are series.') },
      ],
    },
  ],
  angles: ['90°', '270°', '30°', '150°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', "Noma'lumli ifodaga bo'lish mumkin emas: u nolga teng bo'lgan ildizlar javobdan yo'qoladi.", 'Делить на выражение с неизвестным нельзя: корни, где оно равно нулю, исчезают из ответа.', 'Dividing by an expression with the unknown is not allowed: the roots where it is zero vanish from the answer.'),
  ],
  can: [
    L("Bo'lish o'rniga ko'paytuvchini chiqaraman", 'Выношу множитель вместо деления', 'I factor out instead of dividing'),
    L("Bo'lish qaysi ildizlarni yo'qotishini bilaman", 'Знаю, какие корни теряет деление', 'I know which roots division loses'),
    L('Almashtirishdan keyin chegaralarni tekshiraman', 'Проверяю границы после замены', 'I check the bounds after a substitution'),
    L("Oxirida o'zgaruvchiga qaytaman", 'Возвращаюсь к переменной в конце', 'I return to the variable at the end'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L("Bitta joy takrorlashni talab qiladi: bo'lishda nima yo'qoladi.", 'Одно место требует повтора: что теряется при делении.', 'One place needs review: what division loses.'),
    back: L('Qoidaga va 4-ekranga qayting.', 'Вернись к правилу и к экрану 4.', 'Go back to the rule and to screen 4.'),
  },
  bridge: L("Ikkinchi blok yopildi: kursdagi hamma trigonometrik tenglama shu to'rt usul bilan yechiladi.", 'Блок 2 закрыт: все тригонометрические уравнения курса решаются этими четырьмя приёмами.', 'Block two is closed: every trigonometric equation of the course is solved with these four moves.'),
  lifehack: L("Umumiy ko'paytuvchini ko'rdingizmi, chiqaring. Bo'lish doim biror narsani yeb qo'yadi.", 'Увидел общий множитель — выноси. Деление всегда что-нибудь съедает.', 'Spotted a common factor, factor it out. Division always eats something.'),
  sheetTitle: L('Usullar · shpargalka', 'Методы · шпаргалка', 'The methods · cheat sheet'),
  sheetSrc: L('10-sinf · 13-dars', '10 класс · урок 13', 'Grade 10 · lesson 13'),
  hook: {
    a: '2 sin x = 1',
    b: ['a', 'b = 0'],
  },
  proved: ['a', 'b = 0'],
  law: ['a', 'b = 0   →   a = 0,  b = 0'],
  sheet: [
    ['a', 'b = 0'],
    'cos x = 0   →   90° + 180°n',
    'sin x = 1/2   →   30°,  150°',
    '−1 ≤ t ≤ 1',
    't   →   x',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число и градус из контента: минус там типографский, `parseInt` его не понимает.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))
const deg = (s) => parseInt(String(s).replace(/−/g, '-'), 10)

// Соответствие «номер — угол». Обе стороны формулы, переводить нечего.
const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

const ORD10 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S10.order[id] }))
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
        // Два корня гаснут уже на хуке: ученик видит потерю до того, как она
        // названа. Прогноз делается при полной картине.
        fig={() => <Scene fig={<LostRoots step={2} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<UnitCircle angle={30} locked drop meaning ticks />} max={300} />
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
      /* Свидетель урока: прямая садится на высоту и зажигает ОБЕ точки разом.
         Они остаются на экране, пока ученик отвечает. */
      <Scene
        fig={<LostRoots step={phase} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S3.work.prompt}
        test={(c, s) => s > 0.9}
        hints={[
          { when: (c, s) => Math.abs(c) > 0.3, text: S3.work.hint[0] },
          { when: (c, s) => s < 0, text: S3.work.hint[1] },
          { when: () => true, text: S3.work.hint[2] },
        ]}
        okText={S3.work.ok}
        snap={[90]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* Свидетель урока: два корня ГАСНУТ на глазах. Они не исчезают, а
         тускнеют: они были решением, и это надо увидеть. */
      <Scene
        fig={<LostRoots step={phase + 1} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S4.work.prompt}
        test={(c, s) => s < -0.9}
        hints={[
          { when: (c, s) => s > 0, text: S4.work.hint[0] },
          { when: (c, s) => Math.abs(c) > 0.3, text: S4.work.hint[1] },
          { when: () => true, text: S4.work.hint[2] },
        ]}
        okText={S4.work.ok}
        snap={[270]}
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
        fig={<LevelLine step={phase} a={1} arcs />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S5.work.prompt}
        test={(c, s) => s > 0.9}
        hints={[
          { when: (c) => c < 0, text: S5.work.hint[0] },
          { when: (c, s) => s < 0, text: S5.work.hint[1] },
          { when: () => true, text: S5.work.hint[2] },
        ]}
        okText={S5.work.ok}
        snap={[90]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      /* Вертикаль КАСАЕТСЯ правого края: верх и низ совпали в одну точку. */
      <Scene
        fig={<LevelLine step={phase} a={2} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<LevelLine step={1} a={2} />} max={300} />
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
      /* Вертикаль остановилась ПРАВЕЕ окружности и осталась видимой. */
      <Scene
        fig={<LevelLine step={phase} a={-0.5} arcs />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<LevelLine step={1} a={-0.5} arcs />} max={300} />
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
        // Серия строится в момент ответа: правило открывается рядом с тем
        // движением, которое его и породило.
        fig={(solved) => <Scene fig={<LostRoots step={solved ? 1 : 2} />} max={330} />}
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
      <OrderRow
        prompt={S10.order.prompt}
        items={ORD10}
        answer={['s1', 's2', 's3', 's4']}
        marks={[{ deg: deg(S10.order.mark), tone: 'graph', label: S10.order.mark }]}
        okText={S10.order.ok}
        badText={S10.order.bad}
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
      <PlaceAngle
        prompt={S13.place.prompt}
        targets={[deg(S13.place.target)]}
        steps={[S13.place.step]}
        okText={S13.place.ok}
        wrongText={S13.place.wrong}
        audio={audio}
        extra={{ ticks: true }}
        onSolved={() => setTimeout(() => { setTitle(S13.multi.title); setStage(1) }, 1500)}
      />
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
            fig={<UnitCircle angle={deg(S14.angles[Math.min(round, S14.angles.length - 1)])} locked drop />}
            max={300}
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
