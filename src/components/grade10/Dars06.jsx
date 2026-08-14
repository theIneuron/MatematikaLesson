// ============================================================================
// 10-sinf, Dars 6. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS06_KONTENT.md
// Ma'lumot (ovoz, kadrlar, variantlar, razborlar, qoida, yakun) mashina bilan
// yig'ilgan. Ekran tanalari qo'lda yozilgan: asbob va figurani tanlash --
// matematik qaror, va u avtomatlashtirilmaydi (etalon §5.3).
//
// Matn o'zgarsa: kontentni to'g'rilash va qayta yig'ish (kalitsiz), tanalar
// joyida qoladi. Keyin `grade10-lesson-audit.mjs`, tez yarus, to'liq prognon.
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
// Развёртка — единственная новая фигура урока. Она снята на стенде
// `probe/figures.html` до сборки: два первых варианта там и были отвергнуты.
import { Unroll } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 6
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Grafiklar`,
  `Урок ${LESSON_NO}. Графики`,
  `Lesson ${LESSON_NO}. Graphs`,
)

const BLOCK = { label: 'B1', from: 1, to: 7, current: 6 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('GRAFIK', 'ГРАФИК', 'THE GRAPH'),
  title: L("Aylana bilan to'lqinda nima umumiy?", 'Что общего у круга и волны?', 'What do a circle and a wave share?'),
  motion: ['mount'],
  audio: [
    A('mount', "Chapda aylana, o'ngda bo'sh vaqt o'qi. Nuqta aylana bo'ylab yuradi, balandligi esa o'ngga suriladi.", 'Слева круг, справа пустая ось времени. Точка идёт по кругу, и её высота уезжает вправо.', 'On the left a circle, on the right an empty time axis. The point goes round, and its height moves to the right.'),
    A('r1', "Birinchi yozuv aylana va to'lqin boshqa-boshqa temalar deydi.", 'Первая запись говорит, что круг и волна это разные темы.', 'The first reading says the circle and the wave are separate topics.'),
    A('r2', 'Ikkinchisi bu aynan bitta nuqta deydi.', 'Вторая говорит, что это одна и та же точка.', 'The second says it is one and the same point.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi aylanani yoyib ko'ramiz.", 'Твой ответ записан. Сейчас развернём круг и посмотрим.', 'Your answer is saved. Now we will unroll the circle and see.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('bular boshqa-boshqa temalar', 'это разные темы', 'these are separate topics'),
      value: '(x; y)  ≠  y = sin α',
    },
    b: {
      name: L('bu aynan bitta nuqta', 'это одна и та же точка', 'this is one and the same point'),
      value: '(x; y)  →  y = sin α',
    },
  },
  expr: 'y = sin α',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Yoyishdan oldin uch savol', 'Три вопроса перед развёрткой', 'Three questions before unrolling'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Nuqtaning balandligi nima?', 'Что такое высота точки?', 'What is the height of a point?'),
      done: 'y = sin α',
      items: [
        { id: 'a', label: L('burchakning sinusi', 'синус угла', 'the sine of the angle'), correct: true },
        { id: 'b', label: L('burchakning kosinusi', 'косинус угла', 'the cosine of the angle'), hint: L('Kosinus bu siljish, juftlikning birinchi soni.', 'Косинус это сдвиг, первое число пары.', 'The cosine is the shift, the first number of the pair.') },
        { id: 'c', label: L('radius', 'радиус', 'the radius'), hint: L("Radius doim birga teng va o'zgarmaydi.", 'Радиус всегда равен единице и не меняется.', 'The radius is always one and does not change.') },
        { id: 'd', label: L('burchak', 'угол', 'the angle'), hint: L('Burchak nuqtani beradi, balandlik esa uning koordinatasi.', 'Угол задаёт точку, а высота это её координата.', 'The angle fixes the point, the height is its coordinate.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Nuqta necha gradusdan keyin joyiga qaytadi?', 'Через сколько градусов точка возвращается на место?', 'After how many degrees does the point return to its place?'),
      done: '360°',
      items: [
        { id: 'a', label: L('uch yuz oltmish', 'триста шестьдесят', 'three hundred sixty'), correct: true },
        { id: 'b', label: L('yuz sakson', 'сто восемьдесят', 'one hundred eighty'), hint: L("Yuz saksondan keyin nuqta qarshi tomonda bo'ladi, joyida emas.", 'Через сто восемьдесят точка окажется напротив, а не на месте.', 'After one hundred eighty the point ends up opposite, not in place.') },
        { id: 'c', label: L("to'qson", 'девяносто', 'ninety'), hint: L("To'qson bu yo'lning choragi.", 'Девяносто это четверть пути.', 'Ninety is a quarter of the way.') },
        { id: 'd', label: L('qaytmaydi', 'не возвращается', 'it does not return'), hint: L("Qaytadi: o'tgan dars aynan shu haqda edi.", 'Возвращается: это и был прошлый урок.', 'It does return: that was the previous lesson.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Sinus kattaligi bo'yicha qanday bo'la oladi?", 'Каким может быть синус по величине?', 'How large can the sine be?'),
      done: '−1 ≤ sin α ≤ 1',
      items: [
        { id: 'a', label: L('birdan katta emas', 'не больше единицы', 'no more than one'), correct: true },
        { id: 'b', label: L('har qanday', 'любым', 'anything'), hint: L("Nuqta radiusi bir bo'lgan aylanada va uzoqroqqa chiqa olmaydi.", 'Точка лежит на окружности радиуса один и дальше уйти не может.', 'The point lies on the circle of radius one and cannot go further.') },
        { id: 'c', label: L('ikkidan katta emas', 'не больше двух', 'no more than two'), hint: L('Chegara bu radius, u esa birga teng.', 'Граница это радиус, а он равен единице.', 'The bound is the radius, and it equals one.') },
        { id: 'd', label: L('faqat musbat', 'только положительным', 'only positive'), hint: L("O'qdan pastda balandlik manfiy, bu to'rtinchi darsda edi.", 'Ниже оси высота отрицательна, это было на четвёртом уроке.', 'Below the axis the height is negative, that was in lesson four.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Aylana to'lqinga yoyiladi", 'Круг разворачивается в волну', 'The circle unrolls into a wave'),
  tag: 'grafik-bez-kruga',
  show: [
    [
      L("chapda aylana, o'ngda vaqt o'qi", 'слева круг, справа ось времени', 'a circle on the left, a time axis on the right'),
      L("nuqtaning balandligi ko'chiriladi", 'переносится высота точки', 'the height of the point is carried over'),
    ],
    [
      L("nuqta yuradi, egri chiziq ortidan o'sadi", 'точка идёт, кривая растёт за ней', 'the point goes, the curve grows behind it'),
      L('grafik shu', 'это и есть график', 'that is the graph'),
    ],
  ],
  motion: ['roll'],
  audio: [
    A('mount', "Chapda aylana, o'ngda vaqt o'qi. Unda hozircha hech narsa yo'q.", 'Слева круг, справа ось времени. Пока на ней ничего нет.', 'On the left a circle, on the right a time axis. Nothing on it yet.'),
    A('roll', "Nuqta aylana bo'ylab yuradi, balandligi esa o'ngga ko'chiriladi. Qarang: egri chiziqni qo'l emas, nuqtaning o'zi chizadi.", 'Точка идёт по кругу, а её высота переносится вправо. Смотри: кривую чертит не рука, а сама точка.', 'The point goes round, and its height is carried to the right. Watch: the curve is drawn not by a hand but by the point itself.'),
    A('work', "Endi o'zingiz. Egri chiziq eng baland ko'tariladigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, где кривая поднимается выше всего.', 'Now you. Place the point where the curve rises highest.'),
  ],
  work: {
    prompt: L("Egri chiziq eng baland joyga nuqta qo'ying.", 'Поставь точку туда, где кривая выше всего.', 'Place the point where the curve is highest.'),
    ok: L("Bu aylananing eng tepasi, to'qson gradus. U yerda balandlik eng katta, to'lqinda esa cho'qqi.", 'Это самый верх круга, девяносто градусов. Там высота наибольшая, и у волны там вершина.', 'That is the very top of the circle, ninety degrees. The height is largest there, and the wave has its peak.'),
    hint: [
      L('Egri chiziq nuqtaning balandligini takrorlaydi. Balandlik qayerda eng katta?', 'Кривая повторяет высоту точки. Где высота больше всего?', 'The curve repeats the height of the point. Where is the height largest?'),
      L("O'ngda va chapda balandlik nolga teng, demak cho'qqi u yerda emas.", 'Справа и слева высота равна нулю, значит вершина не там.', 'On the right and left the height is zero, so the peak is not there.'),
      L('Aylananing eng tepasi kerak.', 'Нужен самый верх круга.', 'You need the very top of the circle.'),
    ],
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Aylananing tepasi to'lqinning tepasi", 'Верх круга — верх волны', 'The top of the circle is the top of the wave'),
  tag: 'grafik-bez-kruga',
  show: [
    [
      L("nuqta o'qdan yuqorida", 'точка выше оси', 'the point is above the axis'),
      L('egri chiziq noldan yuqorida', 'кривая выше нуля', 'the curve is above zero'),
    ],
    [
      L("nuqta o'qdan pastga tushdi", 'точка ушла ниже оси', 'the point went below the axis'),
      L('egri chiziq nol ostiga tushdi', 'кривая ушла под ноль', 'the curve went below zero'),
    ],
  ],
  motion: ['under'],
  audio: [
    A('mount', "Yo'lning birinchi yarmida nuqta o'qdan yuqorida yuradi, va egri chiziq shu vaqt davomida noldan yuqorida.", 'Первую половину пути точка идёт выше оси, и кривая всё это время выше нуля.', 'For the first half of the way the point goes above the axis, and the curve stays above zero all that time.'),
    A('under', "Endi nuqta o'qdan pastga ketadi, va egri chiziq nol ostiga tushadi. Balandlikning ishorasi va egri chiziqning ishorasi bir narsa.", 'Теперь точка уходит ниже оси, и кривая идёт под ноль. Знак высоты и знак кривой это одно и то же.', 'Now the point goes below the axis, and the curve goes below zero. The sign of the height and the sign of the curve are one and the same.'),
    A('work', "Endi o'zingiz. Egri chiziq eng past tushadigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, где кривая опускается ниже всего.', 'Now you. Place the point where the curve dips lowest.'),
  ],
  work: {
    prompt: L("Egri chiziq eng past joyga nuqta qo'ying.", 'Поставь точку туда, где кривая ниже всего.', 'Place the point where the curve is lowest.'),
    ok: L("Bu aylananing eng pasti. Balandlik u yerda kattaligi bo'yicha eng katta va pastga qaragan, to'lqinda esa chuqurlik.", 'Это самый низ круга. Высота там наибольшая по величине и направлена вниз, у волны там впадина.', 'That is the very bottom of the circle. The height there is largest in size and points down, and the wave has its trough.'),
    hint: [
      L("Egri chiziq nuqtaning balandligi eng manfiy joyda eng past bo'ladi.", 'Ниже всего кривая там, где высота точки самая отрицательная.', 'The curve is lowest where the height of the point is most negative.'),
      L('Bu yon tomonda emas: yon tomonda balandlik nolga teng.', 'Это не сбоку: сбоку высота равна нулю.', 'Not on the side: on the side the height is zero.'),
      L('Aylananing eng pasti kerak.', 'Нужен самый низ круга.', 'You need the very bottom of the circle.'),
    ],
  },
}

const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Kosinus o'sha to'lqin", 'Косинус — та же волна', 'The cosine is the same wave'),
  tag: 'grafik-bez-kruga',
  show: [
    [
      L('sanoq chorak aylana oldin boshlangan', 'счёт начат на четверть оборота раньше', 'the count starts a quarter turn earlier'),
      L("qurilish o'sha-o'sha", 'построение то же самое', 'the construction is the same'),
    ],
    [
      L("to'lqin surilgan chiqdi", 'волна вышла сдвинутой', 'the wave came out shifted'),
      L("shakli esa o'sha", 'форма у неё та же', 'its shape is the same'),
    ],
  ],
  motion: ['roll'],
  audio: [
    A('mount', "Sanoqning boshi endi tepada. Qolgani o'sha.", 'Начало счёта теперь наверху. Всё остальное как было.', 'The start of the count is now at the top. Everything else stays as it was.'),
    A('roll', "Nuqta o'sha aylana bo'ylab yuradi, balandlik ham xuddi shunday o'ngga suriladi. Egri chiziq surilgan chiqadi, lekin shakli o'sha.", 'Точка идёт по тому же кругу, и высота так же уезжает вправо. Кривая получается сдвинутой, но форма у неё та же.', 'The point goes round the same circle, and the height moves right the same way. The curve comes out shifted, but its shape is the same.'),
    A('work', "Endi o'zingiz. Kosinusda sanoq boshlanadigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, откуда начинается счёт у косинуса.', 'Now you. Place the point where the cosine starts its count.'),
  ],
  work: {
    prompt: L("Kosinusda sanoq boshlanadigan joyga nuqta qo'ying.", 'Поставь точку туда, откуда начинается счёт у косинуса.', 'Place the point where the cosine starts its count.'),
    ok: L("Tepada. U yerdan balandlik birga teng, va kosinus to'lqini noldan emas, birdan boshlanadi.", 'Наверху. Оттуда высота равна единице, и волна косинуса начинается с единицы, а не с нуля.', 'At the top. From there the height equals one, and the cosine wave starts at one, not at zero.'),
    hint: [
      L("Kosinus to'lqini eng katta qiymatdan boshlanadi.", 'Волна косинуса начинается с наибольшего значения.', 'The cosine wave starts at the largest value.'),
      L("Demak nuqta ham balandlik eng katta bo'lgan joyda turishi kerak.", 'Значит и точка должна стоять там, где высота наибольшая.', 'So the point must stand where the height is largest.'),
      L('Aylananing eng tepasi kerak.', 'Нужен самый верх круга.', 'You need the very top of the circle.'),
    ],
  },
}

const S6 = {
  role: 'explain4',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Davr bitta to'lqinning uzunligi", 'Период — длина одной волны', 'The period is the length of one wave'),
  tag: 'period-bez-vozvrata',
  show: [
    [
      L('nuqta joyiga qaytdi', 'точка вернулась на место', 'the point returned to its place'),
      L("to'lqin yopildi", 'волна замкнулась', 'the wave closed'),
    ],
    [
      L('keyin hammasi takrorlanadi', 'дальше всё повторится', 'from here on it all repeats'),
    ],
  ],
  motion: ['mark'],
  audio: [
    A('mount', "Nuqta to'liq aylanani bosib o'tdi va joyiga qaytdi. Grafikda bunga bitta tugagan to'lqin mos keladi.", 'Точка прошла полный оборот и вернулась на место. На графике этому отвечает одна законченная волна.', 'The point completed a full turn and returned to its place. On the graph that matches one finished wave.'),
    A('mark', "Shu to'lqinning uzunligi davr bo'ladi. Keyin nuqta o'sha aylana bo'ylab yuradi, va to'lqin aynan takrorlanadi.", 'Длина этой волны и есть период. Дальше точка пойдёт по тому же кругу, и волна повторится точь-в-точь.', 'The length of that wave is the period. Next the point will go round the same circle, and the wave will repeat exactly.'),
    A('work', "Endi o'zingiz. To'lqin yopiladigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, где волна замыкается.', 'Now you. Place the point where the wave closes.'),
  ],
  work: {
    prompt: L("To'lqin yopiladigan joyga nuqta qo'ying.", 'Поставь точку туда, где волна замыкается.', 'Place the point where the wave closes.'),
    ok: L("Bu aylananing boshi. To'liq aylana bosib o'tildi, va keyingi to'lqin ham shunday bo'ladi.", 'Это начало круга. Полный оборот пройден, и следующая волна будет такой же.', 'That is the start of the circle. A full turn is complete, and the next wave will be the same.'),
    hint: [
      L("To'lqin nuqta o'z joyiga qaytgan joyda yopiladi.", 'Волна замыкается там, где точка вернулась на своё место.', 'The wave closes where the point returned to its place.'),
      L("Sanoqning boshi o'ngda, nol gradusda edi.", 'Начало счёта было справа, на нуле градусов.', 'The count started on the right, at zero degrees.'),
      L("Aylananing o'ng nuqtasi kerak.", 'Нужна правая точка круга.', 'You need the right point of the circle.'),
    ],
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("To'lqin polosadan chiqmaydi", 'Волна не выходит из полосы', 'The wave does not leave the band'),
  tag: 'bolshe-odnogo',
  show: [
    [
      L("to'lqin yasaldi", 'волна построена', 'the wave is built'),
      L("to'lqinning balandligi radiusga teng", 'высота волны равна радиусу', 'the wave height equals the radius'),
      '−1 ≤ sin α ≤ 1',
    ],
    [
      L('minus birdan birgacha polosa', 'полоса от минус единицы до единицы', 'a band from minus one to one'),
      L("to'lqin chetlarga tegadi", 'волна упирается в края', 'the wave touches the edges'),
    ],
  ],
  motion: ['band'],
  audio: [
    A('mount', "To'lqin yasaldi, va uning balandligi aylananing radiusidek. Hozir polosani belgilaymiz.", 'Волна построена, и её высота ровно такая же, как радиус круга. Сейчас отметим полосу.', 'The wave is built, and its height is exactly the radius of the circle. Now we will mark the band.'),
    A('band', "Minus birdan birgacha polosa. To'lqin uning chetlariga tegadi va tashqariga chiqmaydi. Aks holda nuqta aylanadan chiqib ketardi, u esa aylanada yotadi.", 'Полоса от минус единицы до единицы. Волна упирается в её края и наружу не выходит. Иначе точка сошла бы с окружности, а она на ней лежит.', 'A band from minus one to one. The wave touches its edges and never leaves it. Otherwise the point would leave the circle, and it lies on it.'),
    A('work', "O'zingiz hisoblang. Sinus eng katta qanday qiymat oladi?", 'Посчитай сам. Какое самое большое значение принимает синус?', 'Compute it yourself. What is the largest value the sine takes?'),
  ],
  work: {
    prompt: L('Sinus eng katta qanday qiymat oladi?', 'Какое самое большое значение принимает синус?', 'What is the largest value the sine takes?'),
    ok: L("Bir. Balandlik bundan katta bo'la olmaydi: nuqta radiusi bir bo'lgan aylanada yotadi.", 'Единица. Больше высота быть не может: точка лежит на окружности радиуса один.', 'One. The height cannot exceed that: the point lies on the circle of radius one.'),
    hint: [
      L("Eng katta balandlik aylananing eng tepasida bo'ladi.", 'Наибольшая высота бывает на самом верху круга.', 'The largest height happens at the very top of the circle.'),
      L('Eng tepada balandlik radiusga teng.', 'На самом верху высота равна радиусу.', 'At the very top the height equals the radius.'),
      L('Bir.', 'Единица.', 'One.'),
    ],
    answer: '1',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Sinus grafigi', 'График синуса', 'The graph of the sine'),
  tag: 'grafik-bez-kruga',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Aylana yana bir bor yoyiladi, va qoida yonida ochiladi. Grafik alohida tema emas, bu vaqt bo'ylab yozilgan o'sha nuqta.", 'Круг разворачивается ещё раз, и правило открывается рядом. График это не отдельная тема, а та же точка, записанная во времени.', 'The circle unrolls once more, and the rule opens beside it. The graph is not a separate topic but the same point written along time.'),
  ],
  probe: {
    question: L('Grafik qayerdan olinadi?', 'Откуда берётся график?', 'Where does the graph come from?'),
    items: [
      { id: 'a', label: L('aylanadagi nuqtaning balandligidan', 'из высоты точки на круге', 'from the height of the point on the circle'), correct: true },
      { id: 'b', label: L('qiymatlar jadvalidan', 'из таблицы значений', 'from a table of values'), hint: L("Jadval bo'yicha bir nechta nuqta qo'yish mumkin, lekin ular orasida to'lqin qayerdan kelganini jadval tushuntirmaydi.", 'По таблице можно поставить несколько точек, но откуда между ними волна, таблица не объясняет.', 'A table lets you plot a few points, but it does not explain where the wave between them comes from.') },
    ],
  },
  rule: {
    lawLabel: L('Yoyilma', 'Развёртка', 'The unrolling'),
    lines: [
      L('Har bir `x` songa birlik aylanadagi nuqta mos keladi, uning balandligi esa `sin x` beradi.', 'Каждому числу `x` отвечает точка единичной окружности, а её высота даёт `sin x`.', 'Each number `x` gives a point of the unit circle, and its height gives `sin x`.'),
      L('Ikkala grafik ham har qanday `x` da aniqlangan, qiymatlar esa `[−1; 1]` kesmada.', 'Оба графика определены при любом `x`, а значения лежат в отрезке `[−1; 1]`.', 'Both graphs are defined for every `x`, and the values lie in `[−1; 1]`.'),
      L('Grafik davrdan keyin takrorlanadi: sinus va kosinusda u `2π` ga teng.', 'График повторяется через период: у синуса и косинуса он равен `2π`.', 'The graph repeats after a period: for sine and cosine it equals `2π`.'),
    ],
    law: 'D(y) = (−∞; +∞),   E(y) = [−1; 1]',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Nuqta qayerda, to'lqin ham o'sha yerda", 'Где точка — там и волна', 'Where the point is, the wave is too'),
  tag: 'grafik-bez-kruga',
  audio: [
    A('mount', "To'rt burchak va to'lqindagi to'rt joy. Ularni birlashtiring.", 'Четыре угла и четыре места на волне. Соедини их.', 'Four angles and four places on the wave. Match them.'),
  ],
  match: {
    prompt: L("Har bir burchakni to'lqindagi joy bilan birlashtiring.", 'Соедини каждый угол с местом на волне.', 'Match each angle with its place on the wave.'),
    a: L("o'qda, yuqoriga ketyapti", 'на оси, идёт вверх', 'on the axis, going up'),
    b: L("cho'qqi", 'вершина', 'the peak'),
    c: L("o'qda, pastga ketyapti", 'на оси, идёт вниз', 'on the axis, going down'),
    d: {
      label: L('chuqurlik', 'впадина', 'the trough'),
      hint: L("Chuqurlik balandlik eng manfiy joyda, ya'ni aylananing pastida.", 'Впадина там, где высота самая отрицательная, то есть внизу круга.', 'The trough is where the height is most negative, that is at the bottom of the circle.'),
    },
    ok: L("To'lqinning to'rt tuguni bu nuqtaning to'rt holati. Ular orasida nuqta aylana bo'ylab, egri chiziq esa tugunlar orasida yuradi.", 'Четыре узла волны это четыре положения точки. Между ними точка идёт по кругу, а кривая между узлами.', 'The four nodes of the wave are the four positions of the point. Between them the point goes round and the curve runs between the nodes.'),
    left: ['0°', '90°', '180°', '270°'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Bitta to'lqinni qadamlar bilan yasang", 'Построй одну волну по шагам', 'Build one wave step by step'),
  tag: 'grafik-bez-kruga',
  audio: [
    A('mount', "To'rtta yasash qadami. Tartibini o'zingiz qo'yasiz.", 'Четыре шага построения. Порядок ставишь ты.', 'Four construction steps. You put them in order.'),
  ],
  order: {
    prompt: L('Yasash qadamlarini tartib bilan joylashtiring.', 'Расставь шаги построения по порядку.', 'Put the construction steps in order.'),
    s1: L("nuqta aylana bo'ylab yuradi", 'точка идёт по кругу', 'the point goes round the circle'),
    s2: L("balandlik o'ngga ketadi", 'высота едет вправо', 'the height moves right'),
    s3: L("to'rt tugun belgilanadi", 'отмечены четыре узла', 'four nodes are marked'),
    s4: L('tugunlar egri chiziq bilan tutashadi', 'узлы соединены кривой', 'the nodes are joined by a curve'),
    ok: L("To'lqin yasaldi. Jadvaldan birorta nuqta kerak bo'lmadi: hammasi aylanadan keldi.", 'Волна построена. Ни одной точки из таблицы не понадобилось: всё пришло из круга.', 'The wave is built. Not a single table value was needed: it all came from the circle.'),
    bad: L("Avval nuqta yuradi, keyin balandlik ko'chiriladi, keyin tugunlar belgilanadi, keyin ular tutashtiriladi.", 'Сначала идёт точка, потом переносится высота, потом отмечаются узлы, потом они соединяются.', 'First the point moves, then the height is carried, then the nodes are marked, then they are joined.'),
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
    A('mount', "Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi.", 'На этом экране круга нет. На экзамене чертежа тоже не будет.', 'There is no circle on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L("To'qson. To'lqinning cho'qqisi aylananing eng tepasiga mos keladi.", 'Девяносто. Вершина волны отвечает самому верху круга.', 'Ninety. The peak of the wave matches the very top of the circle.'),
    hint: [
      L("To'lqin cho'qqisi nuqtaning balandligi eng katta joyda.", 'Вершина волны там, где высота точки наибольшая.', 'The peak of the wave is where the height of the point is largest.'),
      L("Eng katta balandlik aylananing eng tepasida bo'ladi.", 'Наибольшая высота бывает на самом верху круга.', 'The largest height happens at the very top of the circle.'),
      L("To'qson.", 'Девяносто.', 'Ninety.'),
    ],
    prompt: 'sin α = 1   →   α = ?',
    answer: '90',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi qiymat kichikroq?', 'Какое значение меньше?', 'Which value is smaller?'),
    ok: L("Siz to'lqinni chapdan o'ngga balandlik bo'yicha o'qidingiz, burchaklar tartibi bo'yicha emas.", 'Ты прочитал волну слева направо по высоте, а не по порядку углов.', 'You read the wave by height, not by the order of the angles.'),
    bad: L('Balandliklarni solishtiring, burchaklarni emas. Ikki yuz yetmishda balandlik eng kichik.', 'Сравнивай высоты, а не углы. У двухсот семидесяти высота самая маленькая.', 'Compare heights, not angles. At two hundred seventy the height is smallest.'),
    items: ['sin 270°', 'sin 210°', 'sin 0', 'sin 90°'],
    answer: 'sin 270°  sin 210°  sin 0  sin 90°',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Javob noto'g'ri. Qayerda?", 'Ответ неверный. Где?', 'The answer is wrong. Where?'),
  tag: 'check',
  audio: [
    A('mount', 'Masala. Kosinus grafigi qanday qiymatdan boshlanadi.', 'Задача. С какого значения начинается график косинуса.', 'A task. At what value does the cosine graph start.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L("Bu qator to'g'ri: kosinus juftlikning birinchi soni.", 'Эта строка верна: косинус это первое число пары.', 'This line is right: the cosine is the first number of the pair.'),
    r2: L("Bu qator ham to'g'ri: o'ngda siljish birga teng.", 'Эта строка тоже верна: справа сдвиг равен единице.', 'This line is right too: on the right the shift equals one.'),
    r4: L('Bu qator oldingisidan kelib chiqadi. Birinchi xato qator yuqorida.', 'Эта строка повторяет ошибку предыдущей. Первая неверная строка выше.', 'This line repeats the error of the previous one. The first wrong line is above.'),
  },
  proof: L('Birdan nol kelib chiqmaydi.', 'Из единицы не следует ноль.', 'Zero does not follow from one.'),
  entry: {
    prompt: L('Kosinus grafigi qanday qiymatdan boshlanadi?', 'С какого значения начинается график косинуса?', 'At what value does the cosine graph start?'),
    ok: L("Birdan. Nol gradusda nuqta o'ngda turadi, uning siljishi birga teng.", 'С единицы. При нуле градусов точка стоит справа, и её сдвиг равен единице.', 'At one. At zero degrees the point stands on the right, and its shift equals one.'),
    hint: [
      L('Nol gradusda nuqta qayerda turishiga qarang.', 'Посмотри, где стоит точка при нуле градусов.', 'Look where the point stands at zero degrees.'),
      L("U o'ngda, uning birinchi soni birga teng.", 'Она справа, и её первое число равно единице.', 'It is on the right, and its first number equals one.'),
      L('Bir.', 'Единица.', 'One.'),
    ],
    answer: '1',
  },
  row: {
    r1: 'cos α = x',
    r2: 'α = 0   →   x = 1',
    r3: 'cos 0 = 0',
    r4: 'cos α = sin α',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'lead',
  format: 'place+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("To'lqindan yana aylanaga", 'С волны обратно на круг', 'From the wave back to the circle'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Endi teskari masala. To'lqindagi joy berilgan, burchak kerak.", 'Теперь обратная задача. Дано место на волне, нужен угол.', 'Now the inverse task. A place on the wave is given, the angle is needed.'),
    A('work', "Nuqtani qo'ying, keyin xuddi shunday balandlikdagi hamma burchakni belgilaysiz.", 'Поставь точку, потом отметишь все углы с такой же высотой.', 'Place the point, then you will mark every angle with the same height.'),
  ],
  multi: {
    prompt: L("Balandligi xuddi shunday bo'lgan hamma burchakni belgilang.", 'Отметь все углы, у которых высота такая же.', 'Mark every angle whose height is the same.'),
    title: L('Qaysi burchaklarda balandlik xuddi shunday?', 'У каких углов высота такая же?', 'Which angles have the same height?'),
    ok: L("Beshtadan uchtasi. Cho'qqi butun sondagi aylanadan keyin takrorlanadi, to'lqin ham u bilan birga.", 'Три записи из пяти. Вершина повторяется через целое число оборотов, и волна повторяется вместе с ней.', 'Three out of five. The peak repeats after a whole number of turns, and the wave repeats with it.'),
    items: [
      { id: 'd', label: '270°', hint: L("Ikki yuz yetmishda balandlik kattaligi bo'yicha eng katta, lekin pastga qaragan.", 'У двухсот семидесяти высота наибольшая по величине, но направлена вниз.', 'At two hundred seventy the height is largest in size but points down.') },
      { id: 'e', label: '180°', hint: L("Yuz saksonda balandlik nolga teng: bu to'lqinning tuguni, cho'qqi emas.", 'У ста восьмидесяти высота равна нулю: это узел волны, а не вершина.', 'At one hundred eighty the height is zero: that is a node of the wave, not a peak.') },
      { id: 'a', label: '90°', ok: true },
      { id: 'b', label: '450°', ok: true },
      { id: 'c', label: '−270°', ok: true },
    ],
  },
  place: {
    prompt: L("To'lqinda cho'qqi belgilangan. Uni beradigan nuqtani aylanaga qo'ying.", 'На волне отмечена вершина. Поставь точку на круге, которая её даёт.', 'The peak is marked on the wave. Place the point on the circle that gives it.'),
    ok: L("To'qson gradus. To'lqinning cho'qqisi bu aylananing eng tepasi.", 'Девяносто градусов. Вершина волны это самый верх круга.', 'Ninety degrees. The peak of the wave is the very top of the circle.'),
    wrong: L("Cho'qqi bu eng katta balandlik, eng katta balandlik esa tepada bo'ladi.", 'Вершина это наибольшая высота, а наибольшая высота бывает наверху.', 'The peak is the largest height, and the largest height happens at the top.'),
    target: '90°',
    step: 'sin α = 1   →   90°',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'grafik-bez-kruga',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Sinus grafigini nima chizadi?', 'Что рисует график синуса?', 'What draws the graph of the sine?'),
      done: 'y = sin α',
      items: [
        { id: 'a', label: L('nuqtaning balandligi', 'высота точки', 'the height of the point'), correct: true },
        { id: 'b', label: L('nuqtaning siljishi', 'сдвиг точки', 'the shift of the point'), hint: L('Siljish kosinus grafigini chizadi.', 'Сдвиг рисует график косинуса.', 'The shift draws the cosine graph.') },
        { id: 'c', label: L('radius', 'радиус', 'the radius'), hint: L('Radius doim birga teng, u hech narsa chizmaydi.', 'Радиус всегда равен единице, он ничего не рисует.', 'The radius is always one, it draws nothing.') },
        { id: 'd', label: L('burchak', 'угол', 'the angle'), hint: L("Burchak bu gorizontal bo'yicha vaqt, chizadigani esa balandlik.", 'Угол это время по горизонтали, а рисует высота.', 'The angle is the time along the horizontal, and the height does the drawing.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Kosinus grafigi qanday qiymatdan boshlanadi?', 'С какого значения начинается график косинуса?', 'At what value does the cosine graph start?'),
      done: 'cos 0 = 1',
      items: [
        { id: 'a', label: L('birdan', 'с единицы', 'at one'), correct: true },
        { id: 'b', label: L('noldan', 'с нуля', 'at zero'), hint: L("Noldan sinus boshlanadi: o'ngda balandlik nolga, siljish esa birga teng.", 'С нуля начинается синус: справа высота равна нулю, а сдвиг единице.', 'The sine starts at zero: on the right the height is zero and the shift is one.') },
        { id: 'c', label: L('minus birdan', 'с минус единицы', 'at minus one'), hint: L("Minus bir chapda bo'ladi, sanoq esa o'ngdan boshlanadi.", 'Минус единица бывает слева, а счёт начинается справа.', 'Minus one happens on the left, and the count starts on the right.') },
        { id: 'd', label: L('har qanday qiymatdan', 'с любого', 'at any value'), hint: L('Sanoqning boshi kelishuv bilan qotirilgan, demak qiymat ham bitta.', 'Начало счёта закреплено договором, значит и значение одно.', 'The start of the count is fixed by agreement, so the value is one specific number.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("To'lqin qayerda noldan yuqori ekanini qanday bilamiz?", 'Как узнать, где волна выше нуля?', 'How do you tell where the wave is above zero?'),
      done: 'sin α > 0',
      items: [
        { id: 'a', label: L("nuqta qayerda o'qdan yuqori ekaniga qarash", 'посмотреть, где точка выше оси', 'look where the point is above the axis'), correct: true, ok: L('Ha. Balandlikning ishorasi va egri chiziqning ishorasi bir narsa.', 'Да. Знак высоты и знак кривой это одно и то же.', 'Yes. The sign of the height and the sign of the curve are the same.') },
        { id: 'b', label: L('qismlarni yoddan bilib olish', 'выучить участки наизусть', 'memorise the intervals'), hint: L("Yodlashga narsa yo'q: qism aylanadan ko'rinadi.", 'Заучивать нечего: участок видно по кругу.', 'There is nothing to memorise: the interval shows on the circle.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Sinusning bitta to'lqin uzunligi qancha?", 'Чему равна длина одной волны синуса?', 'What is the length of one sine wave?'),
      done: 'T = 360°',
      items: [
        { id: 'a', label: L("to'liq aylana", 'полный оборот', 'a full turn'), correct: true },
        { id: 'b', label: L('yarim aylana', 'половина оборота', 'half a turn'), hint: L("Yarim aylanada nuqta qarshi tomonda bo'ladi, to'lqin esa hali yopilmaydi.", 'За половину оборота точка окажется напротив, а волна ещё не замкнётся.', 'In half a turn the point ends up opposite and the wave has not closed yet.') },
        { id: 'c', label: L('chorak aylana', 'четверть оборота', 'a quarter turn'), hint: L("Chorak faqat cho'qqigacha.", 'Четверть это только до вершины.', 'A quarter reaches only the peak.') },
        { id: 'd', label: L('ikki aylana', 'два оборота', 'two turns'), hint: L("Ikki aylanada to'lqin ikki marta takrorlanadi.", 'За два оборота волна повторится дважды.', 'In two turns the wave repeats twice.') },
      ],
    },
  ],
  angles: ['90°', '0°', '120°', '360°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', "Grafik bu o'sha nuqta, faqat balandligi vaqt bo'ylab yozilgan.", 'График это та же точка, только её высота записана во времени.', 'The graph is the same point, only its height written along time.'),
  ],
  can: [
    L("Grafikni aylananing yoyilmasi sifatida ko'raman", 'Вижу график как развёртку круга', 'I see the graph as the unrolled circle'),
    L("Grafikdan ishorani va cho'qqini o'qiyman", 'Читаю по графику знак и вершину', 'I read the sign and the peak off the graph'),
    L("To'lqin polosadan chiqmasligini bilaman", 'Знаю, что волна не выходит из полосы', 'I know the wave stays inside the band'),
    L("Davrni bitta to'lqin uzunligi sifatida topaman", 'Нахожу период как длину одной волны', 'I find the period as the length of one wave'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L('Bitta joy takrorlashni talab qiladi: kosinus nimadan boshlanadi.', 'Одно место требует повтора: с чего начинается косинус.', 'One place needs review: where the cosine starts.'),
    back: L('Qoidaga va 3-ekranga qayting.', 'Вернись к правилу и к экрану 3.', 'Go back to the rule and to screen 3.'),
  },
  bridge: L("7-dars: o'sha grafiklar, lekin gap aniqlanish sohasi va qiymatlar to'plami haqida boradi.", 'Урок 7: те же графики, но разговор пойдёт про область определения и множество значений.', 'Lesson 7: the same graphs, but the talk will be about the domain and the range.'),
  lifehack: L("Nuqtalar bo'yicha chizmang. Nuqta aylanada qayerda ekanini so'rang, balandlik o'zi aytadi.", 'Не рисуй по точкам. Спроси, где сейчас точка на круге, и высота сама скажет, где кривая.', 'Do not plot point by point. Ask where the point is on the circle, and the height will tell you where the curve is.'),
  sheetTitle: L('Grafik · shpargalka', 'График · шпаргалка', 'The graph · cheat sheet'),
  sheetSrc: L('10-sinf · 6-dars', '10 класс · урок 6', 'Grade 10 · lesson 6'),
  hook: {
    a: '(x; y)  ≠  y = sin α',
    b: '(x; y)  →  y = sin α',
  },
  proved: '(x; y)  →  y = sin α',
  law: 'D(y) = (−∞; +∞),   E(y) = [−1; 1]',
  sheet: [
    'y = sin α:   0  →  1  →  0  →  −1  →  0',
    'y = cos α:   1  →  0  →  −1  →  0  →  1',
    'T = 360°  =  2π',
    'E(y) = [−1; 1]',
    ['sin α = 1  →  90°', 'cos α = 1  →  0°'],
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число и градус из контента: там минус это типографский знак, а `parseInt` и
// `parseFloat` его не понимают и дают NaN (в уроке 5 это уронило координаты).
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))
const deg = (s) => parseInt(String(s).replace(/−/g, '-'), 10)

// Соответствие «угол — место на волне». Подписи справа СЛОВАМИ, а не числами:
// у нуля и ста восьмидесяти высота одна и та же, и числами их не различить.
const NODE_IDS = ['n0', 'n1', 'n2', 'n3']
const WAVE_LEFT = S9.match.left.map((label, i) => ({ id: NODE_IDS[i], label }))
// Ключ с разбором приходит как `{label, hint}`, без разбора — просто подпись.
const WAVE_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: NODE_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})
// Отметки на круге при неверной паре — из тех же четырёх углов, что и слева.
const WAVE_MARKS = S9.match.left.map((label, i) => ({
  deg: deg(label), tone: i % 2 ? 'graph' : 'ink3', label,
}))

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
        // Развёртка идёт уже на хуке: ученик видит, КАК из круга получается
        // волна, но что это значит — ещё не сказано. Прогноз до объяснения.
        fig={() => <Scene fig={<Unroll step={1} from={0} label="y = sin α" />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<UnitCircle angle={60} locked drop meaning ticks />} max={300} />
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
      /* Свидетель урока: кривую чертит САМА точка. Кадр 0 — пустая ось, кадр 1
         — точка идёт и волна растёт за ней. */
      <Scene
        fig={<Unroll step={phase} from={0} label="y = sin α" />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S3.work.prompt}
        test={(c, s) => s > 0.97}
        hints={[
          { when: (c, s) => Math.abs(s) < 0.2, text: S3.work.hint[0] },
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
      /* Пол-оборота, потом целый: сначала кривая идёт выше нуля, потом уходит
         под ноль ровно там, где точка переходит ось. */
      <Scene
        fig={<Unroll step={1} turns={phase === 0 ? 0.5 : 1} from={0} label="y = sin α" />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S4.work.prompt}
        test={(c, s) => s < -0.97}
        hints={[
          { when: (c, s) => s > 0, text: S4.work.hint[0] },
          { when: (c, s) => Math.abs(s) < 0.2, text: S4.work.hint[1] },
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
      /* ТО ЖЕ построение, только счёт начат на четверть оборота раньше.
         Никакого второго чертежа и никакого поворота: переносится высота. */
      <Scene
        fig={<Unroll step={phase} from={90} label="y = cos α" />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S5.work.prompt}
        test={(c, s) => s > 0.97}
        hints={[
          { when: (c, s) => Math.abs(s) < 0.2, text: S5.work.hint[0] },
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
      /* Кадр 0 — готовая волна, кадр 1 — размеченный период: длина одной
         волны и есть полный оборот. */
      <Scene
        fig={<Unroll step={phase === 0 ? 1 : 2} from={0} label="y = sin α" />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S6.work.prompt}
        test={(c, s) => c > 0.97 && Math.abs(s) < 0.1}
        hints={[
          { when: (c, s) => s > 0.5, text: S6.work.hint[0] },
          { when: (c) => c < 0, text: S6.work.hint[1] },
          { when: () => true, text: S6.work.hint[2] },
        ]}
        okText={S6.work.ok}
        snap={[0]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      /* Полоса ПОЯВЛЯЕТСЯ на втором кадре, а не стоит с начала: сначала волна,
         потом граница вокруг неё. Высота волны на экране ровно равна радиусу
         круга — иначе «не выходит из полосы» нечем проверить. */
      <Scene
        fig={<Unroll step={phase === 0 ? 1 : 3} from={0} label="y = sin α" />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Unroll step={3} from={0} label="y = sin α" />} max={300} />
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
        // Круг разворачивается в момент ответа: правило открывается рядом с тем
        // построением, которое его и породило.
        fig={(solved) => <Scene fig={<Unroll step={solved ? 1 : 0} from={0} label="y = sin α" />} max={330} />}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={WAVE_LEFT}
        right={WAVE_RIGHT}
        marks={WAVE_MARKS}
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
        marks={[{ deg: 90, tone: 'graph', label: S10.order.mark }]}
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
