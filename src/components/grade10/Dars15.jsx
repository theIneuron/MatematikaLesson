// ============================================================================
// 10-sinf, Dars 15. HAQIQIY KO'RSATKICHLI DARAJA.
//
// Fayl IKKI qismdan iborat. Yuqoridagi ma'lumot (ovoz, kadrlar, variantlar,
// razborlar, qoida, yakun) `scripts/grade10-kontent-build.mjs` bilan
// `src/books/grade10/DARS15_KONTENT.md` dan yig'ilgan -- uni QO'LDA
// tuzatmang, kontentni tuzatib qaytadan yig'ing. Pastdagi ekran tanalari
// esa qo'lda yozilgan: asbob va figurani tanlash matematik qaror.
//
// ASBOB. 26-darsda chizma YO'Q joyi ham bor: 3-6-ekranlarda ish YOZUVDA
// boradi (`Tape`), va bu 2-asbobning o'zi -- qadam bilan qaytadan yozish.
// 7 va 8-ekranlarda `PowerBand`: torayuvchi polosa va kvadratlar polosasi.
// Aylana bu darsda YO'Q va bo'lishi ham kerak emas.
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

import { PowerBand } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 15
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Haqiqiy ko'rsatkichli daraja`,
  `Урок ${LESSON_NO}. Степень (действ.)`,
  `Lesson ${LESSON_NO}. The power with a real exponent`,
)

const BLOCK = { label: 'B5', from: 15, to: 27, current: 15 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('DARAJA', 'СТЕПЕНЬ', 'THE POWER'),
  title: L("Ko'rsatkichdagi minus", 'Минус в показателе', 'The minus in the exponent'),
  audio: [
    A('mount', 'Yonma-yon ikki son. Minus sakkiz va bir sakkizdan. Ulardan aynan bittasi ikkining minus uchinchi darajasiga teng.', 'Два числа рядом. Минус восемь и одна восьмая. Ровно одно из них равно двойке в минус третьей степени.', 'Two numbers side by side. Minus eight and one eighth. Exactly one of them equals two to the minus third power.'),
    A('r1', "Birinchi yozuv ko'rsatkichdagi minus sonning o'zini manfiy qiladi deydi.", 'Первая запись говорит, что минус в показателе делает само число отрицательным.', 'The first reading says the minus in the exponent makes the number itself negative.'),
    A('r2', 'Ikkinchisi minus kasrni teskari qiladi, sonning ishorasiga tegmaydi deydi.', 'Вторая говорит, что минус переворачивает дробь, а знак числа не трогает.', 'The second says the minus turns the fraction over and leaves the sign alone.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi ko'rsatkichlar zinapoyasidan tushamiz va ko'ramiz.", 'Твой ответ записан. Сейчас спустимся по лестнице показателей и посмотрим.', 'Your answer is saved. Now we will walk down the ladder of exponents and see.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("sonning ishorasini o'zgartiradi", 'меняет знак числа', 'flips the sign of the number'),
      value: '−8',
    },
    b: {
      name: L('kasrni teskari qiladi', 'переворачивает дробь', 'turns the fraction over'),
      value: '1/8',
    },
  },
  expr: '2^{−3}',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Darajadan oldin uch savol', 'Три вопроса перед степенью', 'Three questions before the power'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Ikki uchinchi darajada yozuvida nechta ko'paytuvchi bor?", 'Сколько множителей в записи два в третьей степени?', 'How many factors are in two to the third power?'),
      done: '2³ = 2·2·2',
      items: [
        { id: 'a', label: L('uchta', 'три', 'three'), correct: true },
        { id: 'b', label: L('ikkita', 'два', 'two'), hint: L("Ikki bu asos, ko'paytuvchilar soni esa ko'rsatkich aytgancha.", 'Два это основание, а множителей столько, сколько сказал показатель.', 'Two is the base, and the number of factors is what the exponent says.') },
        { id: 'c', label: L('oltita', 'шесть', 'six'), hint: L("Olti ikki bilan uchni ko'paytirsak chiqardi, ular esa bu yerda har xil o'rinda turadi.", 'Шесть получилось бы, если два и три перемножить, а они здесь стоят на разных местах.', 'Six would come from multiplying two by three, but here they sit in different places.') },
        { id: 'd', label: L('sakkizta', 'восемь', 'eight'), hint: L("Sakkiz bu yozuvning qiymati, savol esa ko'paytuvchilar soni haqida.", 'Восемь это значение записи, а спросили про число множителей.', 'Eight is the value of the reading, and the question was the number of factors.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Ikki uchinchi darajada ikki ikkinchi darajaga ko'paytirilsa nima bo'ladi?", 'Чему равно два в третьей умножить на два во второй?', 'What is two to the third times two to the second?'),
      done: '2³·2² = 2⁵',
      items: [
        { id: 'a', label: L('ikki beshinchi darajada', 'два в пятой', 'two to the fifth'), correct: true },
        { id: 'b', label: L('ikki oltinchi darajada', 'два в шестой', 'two to the sixth'), hint: L("Olti ko'rsatkichlarni ko'paytirsak chiqardi. Ko'paytuvchilarni yozib sanang.", 'Шесть вышло бы, если показатели перемножить. Выпиши множители и посчитай их.', 'Six would come from multiplying the exponents. Write the factors out and count them.') },
        { id: 'c', label: L("to'rt beshinchi darajada", 'четыре в пятой', 'four to the fifth'), hint: L("Asos o'zgarmaydi: ko'paytuvchilar o'sha ikkilar.", 'Основание не меняется: множители те же двойки.', 'The base does not change: the factors are the same twos.') },
        { id: 'd', label: L('ikki birinchi darajada', 'два в первой', 'two to the first'), hint: L("Birinchi daraja bo'lishda chiqardi, bu yerda esa ko'paytirish.", 'Первая степень вышла бы при делении, а здесь умножение.', 'The first power would come from dividing, and here we multiply.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Qaysi son kvadratda to'qqiz beradi?", 'Какое число в квадрате даёт девять?', 'Which number squared gives nine?'),
      done: '3² = 9',
      items: [
        { id: 'a', label: L('uch', 'три', 'three'), correct: true },
        { id: 'b', label: L("to'rt yarim", 'четыре с половиной', 'four and a half'), hint: L("Bu to'qqizning yarmi, kerak bo'lgani esa ikki marta olingan ko'paytuvchi.", 'Это половина девяти, а нужен множитель, взятый дважды.', 'That is half of nine, but we need a factor taken twice.') },
        { id: 'c', label: L('sakson bir', 'восемьдесят один', 'eighty one'), hint: L("Sakson bir bu to'qqiz kvadratda, ya'ni teskari yo'l.", 'Восемьдесят один это девять в квадрате, то есть обратный ход.', 'Eighty one is nine squared, that is the other direction.') },
        { id: 'd', label: L('olti', 'шесть', 'six'), hint: L("Olti bu to'qqiz qo'shuv uch, ikki marta olingan ko'paytuvchi emas.", 'Шесть это девять плюс три, а не множитель, взятый дважды.', 'Six is nine plus three, not a factor taken twice.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'order',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ko'rsatkich ko'paytuvchilarni sanaydi", 'Показатель считает множители', 'The exponent counts the factors'),
  tag: 'stepen-po-analogii',
  show: [
    [
      L("ko'rsatkich bu ko'paytuvchilar soni", 'показатель это число множителей', 'the exponent is the number of factors'),
      L("ikkala yozuvni to'liq yozamiz", 'выписываем обе записи полностью', 'we write both readings out in full'),
      '2³·2² = 2·2·2·2·2',
    ],
    [
      L("ko'paytuvchilar shunchaki qo'shildi", 'множители просто дописались', 'the factors simply got appended'),
      L("shuning uchun ko'rsatkichlar qo'shiladi", 'поэтому показатели складываются', 'so the exponents add up'),
      '2³·2² = 2⁵',
    ],
  ],
  motion: ['grow'],
  audio: [
    A('mount', "Daraja bu ko'paytirishning qisqa yozuvi. Ko'rsatkich asos necha marta takrorlanishini aytadi.", 'Степень это короткая запись умножения. Показатель говорит, сколько раз повторяется основание.', 'A power is a short way to write multiplication. The exponent says how many times the base repeats.'),
    A('grow', "Ikki uchinchi darajani to'liq yozamiz, keyin ikki ikkinchi darajani, va ularni yonma-yon qo'yamiz. Ko'paytuvchilar beshta bo'ldi, chunki uch bilan ikki bir-biriga qo'shildi. Bu yerda birorta yangi qoida yo'q, faqat ko'paytuvchilar sanog'i bor. Shuning uchun darajalar ko'paytmasida ko'rsatkichlar qo'shiladi, ko'paytirilmaydi.", 'Выпишем два в третьей полностью, потом два во второй, и поставим их рядом. Множителей стало пять, потому что три и два дописались друг к другу. Ни одного нового правила здесь нет, есть только счёт множителей. Поэтому у произведения степеней показатели складываются, а не перемножаются.', 'Let us write two to the third out in full, then two to the second, and place them side by side. There are five factors now, because three and two got appended to each other. There is no new rule here, only counting factors. So in a product of powers the exponents add up instead of multiplying.'),
    A('work', "Endi o'zingiz. Bu yozuv qanday tartibda chiqqan bo'lsa, qadamlarni shunday joylashtiring.", 'Теперь сам. Расставь шаги в том порядке, в котором эта запись получилась.', 'Now you. Put the steps in the order this reading came out.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L("ko'paytuvchilarni yozamiz", 'выписываем множители', 'we write out the factors'),
    s2: L("yozuvlarni yonma-yon qo'yamiz", 'ставим записи рядом', 'we place the readings side by side'),
    s3: L("ko'paytuvchilarni sanaymiz", 'считаем множители', 'we count the factors'),
    s4: L("ko'rsatkichlarni qo'shamiz", 'складываем показатели', 'we add the exponents'),
    ok: L("Tartib shunday. Ko'rsatkichlar qo'shiladi, chunki ko'paytuvchilar qo'shiladi.", 'Порядок такой. Показатели складываются потому, что множители дописываются.', 'That is the order. The exponents add up because the factors get appended.'),
    bad: L("Avval ko'paytuvchilarni yozish, keyin yozuvlarni yonma-yon qo'yish, keyin sanash.", 'Сначала выписать множители, потом поставить записи рядом, потом посчитать.', 'First write the factors out, then place the readings side by side, then count.'),
    mark: '2⁵',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'order',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Darajaning darajasi ko'rsatkichlarni ko'paytiradi", 'Степень степени умножает показатели', 'A power of a power multiplies the exponents'),
  tag: 'stepen-po-analogii',
  show: [
    [
      L("bu yerda daraja darajaga ko'tariladi", 'здесь в степень возводится степень', 'here a power is raised to a power'),
      L('demak asos ikki marta olinadi', 'значит основание берут дважды', 'so the base is taken twice'),
      '(2³)² = 2³·2³',
    ],
    [
      L("har yozuvda uchta ko'paytuvchi", 'в каждой записи по три множителя', 'each reading has three factors'),
      L("jami oltita, ya'ni uch kerra ikki", 'всего шесть, то есть три на два', 'six in all, that is three times two'),
      '(2³)² = 2⁶',
    ],
  ],
  motion: ['same'],
  audio: [
    A('mount', "O'xshash yozuv, lekin amal boshqa. Bu yerda darajaning o'zi darajaga ko'tarilgan.", 'Похожая запись, но действие другое. Здесь в степень возводится сама степень.', 'A similar reading, but a different action. Here the power itself is raised to a power.'),
    A('same', "Ikki uchinchi darajada kvadratda bu ikki uchinchi darajada, ikki marta olingan. Ikkala yozuvni ochamiz. Ko'paytuvchilar oltita bo'ldi, ya'ni uch ikki marta takrorlangan. Demak bu yerda ko'rsatkichlar ko'paytiriladi. O'tgan yozuvda ular qo'shilardi, va bu ikki holni aralashtirish mumkin emas: birida yozuvlar yonma-yon qo'yiladi, boshqasida bittasi bir necha marta olinadi.", 'Два в третьей в квадрате это два в третьей, взятое дважды. Раскроем обе записи. Множителей стало шесть, то есть три, повторённое два раза. Значит здесь показатели перемножаются. В прошлой записи они складывались, и путать эти два случая нельзя: в одном записи ставят рядом, в другом одну из них берут несколько раз.', 'Two to the third, squared, is two to the third taken twice. Let us open both readings. There are six factors now, that is three repeated two times. So here the exponents multiply. In the previous reading they added up, and these two cases must not be mixed: in one the readings stand side by side, in the other one of them is taken several times.'),
    A('work', "O'zingiz hisoblang. Bu yozuv qanday chiqqan bo'lsa, qadamlarni joylashtiring.", 'Посчитай сам. Расставь шаги, как получилась эта запись.', 'Work it out yourself. Put the steps in the order this reading came out.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L('asos ikki marta', 'основание дважды', 'the base twice'),
    s2: L('yozuvlarni ochish', 'раскрыть записи', 'open the readings'),
    s3: L("oltita ko'paytuvchi", 'шесть множителей', 'six factors'),
    s4: L("ko'rsatkichlar ko'paytirildi", 'показатели перемножены', 'the exponents got multiplied'),
    ok: L("Uch kerra ikki bu olti: ko'rsatkichlar ko'paytirildi.", 'Три умножить на два это шесть: показатели перемножились.', 'Three times two is six: the exponents multiplied.'),
    bad: L("Avval asos ikki marta, keyin ochish, keyin ko'paytuvchilarni sanash.", 'Сначала основание дважды, потом раскрыть, потом посчитать множители.', 'First the base twice, then open it, then count the factors.'),
    mark: '2⁶',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Zinapoya pastga nol orqali o'tadi", 'Лестница вниз проходит через ноль', 'The ladder down passes through zero'),
  tag: 'stepen-po-analogii',
  show: [
    [
      L("pastga har qadam ikkiga bo'ladi", 'каждый шаг вниз делит на два', 'each step down divides by two'),
      L("sakkiz, to'rt, ikki", 'восемь, четыре, два', 'eight, four, two'),
      '2³ = 8    2² = 4    2¹ = 2',
    ],
    [
      L("birdan pastdagi qadam bo'lishni davom etadi", 'шаг ниже единицы продолжает делить', 'the step below one keeps dividing'),
      L("nol va manfiy ko'rsatkich o'zi chiqdi", 'нулевой и отрицательный показатель вышли сами', 'the zero and negative exponents came out on their own'),
      '2⁰ = 1    2^{−1} = 1/2',
    ],
  ],
  motion: ['down'],
  audio: [
    A('mount', "Ko'rsatkichlar bo'yicha pastga tushamiz. Sakkiz, to'rt, ikki. Pastga har qadam ikkiga bo'ladi.", 'Спустимся по показателям вниз. Восемь, четыре, два. Каждый шаг вниз делит на два.', 'Let us walk down the exponents. Eight, four, two. Each step down divides by two.'),
    A('down', "Ikkidan keyingi qadam nol emas, bir, chunki ikki ikkiga bo'linsa bir bo'ladi. Yana bir qadam pastga, va bir ikkidan chiqadi. Nol va manfiy ko'rsatkich shundan keladi. Ular uchun alohida kelishuv o'ylab topilmagan: bu o'sha zinapoyaning davomi.", 'Следующий шаг после двойки это единица, а не ноль, потому что два разделить на два это один. Ещё шаг ниже, и получается одна вторая. Вот откуда берутся нулевой и отрицательный показатель. Отдельного соглашения для них не придумывали: они просто продолжение той же лестницы.', 'The next step after two is one, not zero, because two divided by two is one. One more step down and we get one half. That is where the zero and the negative exponent come from. No separate agreement was invented for them: they are simply the same ladder continued.'),
    A('work', "O'zingiz hisoblang. Ikki nol darajada nechaga teng?", 'Посчитай сам. Чему равно два в нулевой степени?', 'Work it out yourself. What is two to the zero power?'),
  ],
  work: {
    prompt: L('Ikki nol darajada nechaga teng?', 'Чему равно два в нулевой степени?', 'What is two to the zero power?'),
    ok: L("Bir. Pastga qadam ikkiga bo'ladi, va ikkidan keyin bir keladi.", 'Единица. Шаг вниз делит на два, и после двойки идёт один.', 'One. A step down divides by two, and after two comes one.'),
    hint: [
      L("Har keyingi qadam nimaga bo'linishini ko'ring.", 'Посмотри, на что делится каждый следующий шаг.', 'Look at what each next step is divided by.'),
      L("Ikki ikkiga bo'linsa.", 'Два разделить на два.', 'Two divided by two.'),
      L('Bir.', 'Один.', 'One.'),
    ],
    answer: '1',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Kasr ko'rsatkich bu ildiz", 'Дробный показатель это корень', 'A fractional exponent is a root'),
  tag: 'drobnyy-kak-delenie',
  show: [
    [
      L("ko'rsatkich bir uchdan", 'показатель одна третья', 'the exponent is one third'),
      L("javobni kubga ko'taramiz", 'возведём ответ в куб', 'let us cube the answer'),
      '8^{1/3} = ?',
    ],
    [
      L('kubi sakkizga teng sonni izlaymiz', 'ищем число, чей куб равен восьми', 'we look for the number whose cube is eight'),
      L("bo'lish bunday sonni bermaydi", 'деление такого числа не даёт', 'division does not give such a number'),
      '2³ = 8',
    ],
  ],
  motion: ['root'],
  audio: [
    A('mount', "Endi kasr ko'rsatkich. Sakkiz bir uchdan darajada.", 'Теперь дробный показатель. Восемь в степени одна третья.', 'Now a fractional exponent. Eight to the power one third.'),
    A('root', "Javobni kubga ko'taramiz. Bir uchdan ko'rsatkich uch marta olinsa bir beradi, demak chapda sakkiz qoladi. Shunday chiqdi: kubi sakkizga teng son kerak, u esa ikki. Endi kasr bo'lishni bildiradi degan taxminni tekshiramiz. Sakkiz uchga bo'linsa ikki butun oltmish yetti yuzdan bo'ladi, va bu sonning kubi sakkiz emas, o'n to'qqiz. Demak kasr ko'rsatkich bu ildiz.", 'Возведём ответ в куб. Показатель одна третья, взятый три раза, даёт единицу, значит слева останется восемь. Получилось так: нужно число, куб которого равен восьми, а это двойка. Теперь проверим догадку, что дробь означает деление. Восемь разделить на три это два целых шестьдесят семь сотых, и куб этого числа равен девятнадцати, а не восьми. Значит дробный показатель это корень.', 'Let us cube the answer. One third taken three times gives one, so eight is left on the left side. It came out like this: we need the number whose cube is eight, and that is two. Now let us test the guess that the fraction means division. Eight divided by three is two point six seven, and the cube of that number is nineteen, not eight. So a fractional exponent is a root.'),
    A('work', "O'zingiz hisoblang. Sakkiz bir uchdan darajada nechaga teng?", 'Посчитай сам. Чему равно восемь в степени одна третья?', 'Work it out yourself. What is eight to the power one third?'),
  ],
  work: {
    prompt: L('Sakkiz bir uchdan darajada nechaga teng?', 'Чему равно восемь в степени одна третья?', 'What is eight to the power one third?'),
    ok: L("Ikki. Ikkining kubi sakkizga teng, shuning uchun kasr ko'rsatkich bu ildiz, bo'lish emas.", 'Два. Куб двойки равен восьми, поэтому дробный показатель это корень, а не деление.', 'Two. The cube of two is eight, so a fractional exponent is a root, not a division.'),
    hint: [
      L("Javobni kubga ko'taring va chapda nima qolishini ko'ring.", 'Возведи ответ в куб и посмотри, что останется слева.', 'Cube the answer and see what is left on the left side.'),
      L('Kubi sakkizga teng sonni izlang.', 'Ищи число, куб которого равен восьми.', 'Look for the number whose cube is eight.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ko'rsatkich irratsional ham bo'ladi", 'Показатель бывает иррациональным', 'The exponent can be irrational'),
  tag: 'irracionalnyy-ne-chislo',
  show: [
    [
      L("ko'rsatkich bir va ikki orasida", 'показатель между единицей и двойкой', 'the exponent is between one and two'),
      L("demak qiymat ikki va to'rt orasida", 'значит значение между двумя и четырьмя', 'so the value is between two and four'),
      '2¹ = 2    2² = 4',
    ],
    [
      L("ko'rsatkichni aniqlaymiz, polosa torayadi", 'уточняем показатель, полоса сужается', 'we refine the exponent, the band narrows'),
      L('ikki ildiz ikki tashqarida qoldi', 'два корня из двух остались снаружи', 'two root two stayed outside'),
      '2^{1,41} … 2^{1,42}',
    ],
  ],
  motion: ['squeeze'],
  audio: [
    A('mount', "Ikkining ildizi bu bir butun qirq bir yuzdan, va keyin cheksiz davom etadi. Bunday ko'rsatkich ham yaraydi.", 'Корень из двух это один и сорок один сотых, и дальше без конца. Такой показатель тоже годится.', 'The root of two is one point four one and on without end. Such an exponent works too.'),
    A('squeeze', "Ikkining ildizi bir va ikki orasida yotadi, demak bizning son ikki va to'rt orasida. Ko'rsatkichni o'ndan birgacha aniqlaymiz, va polosa torayadi. Yuzdan birgacha aniqlaymiz, va ichida deyarli bitta son qoladi. Endi ikki ildiz ikkiga qarang. Bu birinchi polosaning o'ng cheti, va torayishdan keyin u tashqarida qoldi. Demak bizning son unga teng emas, yozuvlari o'xshash bo'lsa ham.", 'Корень из двух лежит между единицей и двойкой, значит наше число лежит между двумя и четырьмя. Уточним показатель до десятых, и полоса сузится. Уточним до сотых, и внутри останется почти одно число. Теперь посмотри на два корня из двух. Это правый конец первой полосы, и после сужения он оказался снаружи. Значит наше число ему не равно, хотя записи похожи.', 'The root of two lies between one and two, so our number lies between two and four. Let us refine the exponent to tenths and the band narrows. Refine to hundredths and almost one number is left inside. Now look at two root two. That is the right edge of the first band, and after the narrowing it ended up outside. So our number is not equal to it, however similar the readings look.'),
    A('work', "O'zingiz hisoblang. Bu sonning vergulidan keyingi birinchi raqami qaysi?", 'Посчитай сам. Какая первая цифра после запятой у этого числа?', 'Work it out yourself. What is the first digit after the decimal point of this number?'),
  ],
  work: {
    prompt: L('Vergulidan keyingi birinchi raqam qaysi?', 'Какая первая цифра после запятой?', 'What is the first digit after the decimal point?'),
    ok: L("Olti. Polosaning ikkala cheti ikki butun olti o'ndan bilan boshlanadi, demak son ham shunday.", 'Шесть. Оба конца полосы начинаются с двух целых шести десятых, значит и число тоже.', 'Six. Both edges of the band start with two point six, so the number does too.'),
    hint: [
      L("Tor polosa qaysi bo'linmalar orasida yotganini ko'ring.", 'Посмотри, между какими делениями лежит узкая полоса.', 'Look at which marks the narrow band lies between.'),
      L('Uning ikkala cheti bir xil boshlanadi.', 'Оба её конца начинаются одинаково.', 'Both of its edges start the same way.'),
      L('Olti.', 'Шесть.', 'Six.'),
    ],
    answer: '6',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Qanday asos yaraydi', 'Какое основание годится', 'Which base works'),
  tag: 'osnova-lyubaya',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidadan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Kvadratlar polosasi ekranda qoladi, va qoida yonida ochiladi. Asos musbat olinishi kelishuv bo'yicha emas, chunki polosada ko'rinadi: chapda kvadratlar yo'q, minus to'rtning ildizi ham yo'q.", 'Полоса квадратов остаётся на экране, и правило открывается рядом. Основание берут положительным не по договору, а потому, что на полосе видно: слева квадратов нет, и корня из минус четырёх нет тоже.', 'The band of squares stays on the screen and the rule opens beside it. The base is taken positive not by agreement but because the band shows it: there are no squares on the left, and no root of minus four either.'),
  ],
  probe: {
    question: L("Har qanday haqiqiy ko'rsatkichli daraja uchun qanday asos olinadi?", 'Какое основание берут у степени с любым действительным показателем?', 'Which base is taken for a power with any real exponent?'),
    items: [
      { id: 'a', label: L("musbat va birga teng bo'lmagan", 'положительное и не равное единице', 'positive and not equal to one'), correct: true },
      { id: 'b', label: L('noldan boshqa har qanday', 'любое, кроме нуля', 'any except zero'), hint: L("Minus to'rt va bir ikkidan ko'rsatkichni tekshiring. Har qanday sonning kvadrati manfiy emas, demak bunday son yo'q.", 'Проверь минус четыре и показатель одна вторая. Квадрат любого числа неотрицателен, значит числа нет.', 'Check minus four with the exponent one half. The square of any number is not negative, so no such number exists.') },
    ],
  },
  rule: {
    lawLabel: L('Daraja', 'Степень', 'The power'),
    lines: [
      L("Ko'rsatkichlar ko'paytirishda qo'shiladi, darajaga ko'tarishda ko'paytiriladi.", 'Показатели складываются при умножении и перемножаются при возведении в степень.', 'Exponents add when multiplying and multiply when raising to a power.'),
      L("Nol ko'rsatkich bir beradi, manfiy kasrni teskari qiladi, kasr esa ildizni bildiradi.", 'Нулевой показатель даёт единицу, отрицательный переворачивает дробь, дробный означает корень.', 'A zero exponent gives one, a negative one turns the fraction over, a fractional one means a root.'),
      L("Asos musbat va birga teng emas: aks holda kasr ko'rsatkich son bermaydi.", 'Основание положительно и не равно единице: иначе дробный показатель числа не даёт.', 'The base is positive and not one: otherwise a fractional exponent gives no number.'),
    ],
    law: 'a^{m/n} = ⁿ√(a^m),   a > 0',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Yozuv va uning qiymati', 'Запись и её значение', 'A reading and its value'),
  tag: 'drobnyy-kak-delenie',
  audio: [
    A('mount', "To'rt yozuv va to'rt qiymat. Ularni birlashtiring.", 'Четыре записи и четыре значения. Соедини их.', 'Four readings and four values. Match them.'),
  ],
  match: {
    prompt: L('Yozuvni qiymati bilan birlashtiring.', 'Соедини запись со значением.', 'Match each reading with its value.'),
    ok: L("Kasr ko'rsatkich bu ildiz, manfiy kasrni teskari qiladi, nol esa bir beradi. Asos bunda o'zgarmaydi.", 'Дробный показатель это корень, отрицательный переворачивает дробь, нулевой даёт единицу. Основание при этом не меняется.', 'A fractional exponent is a root, a negative one turns the fraction over, a zero one gives one. The base does not change.'),
    left: ['8^{1/3}', '2^{−3}', '5⁰', '9^{1/2}'],
    a: '2',
    b: '1/8',
    c: '1',
    d: '3',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Qadam bilan qaytadan yozing', 'Перепиши по шагам', 'Rewrite it step by step'),
  tag: 'stepen-po-analogii',
  audio: [
    A('mount', "To'rtta qadam. Tartibini o'zingiz qo'yasiz.", 'Четыре шага. Порядок ставишь ты.', 'Four steps. You put them in order.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L("ko'rsatkichlarni ko'paytirish", 'умножить показатели', 'multiply the exponents'),
    s2: L("ko'rsatkich butun bo'ldi", 'показатель стал целым', 'the exponent became whole'),
    s3: L("ko'rsatkichlarni qo'shish", 'сложить показатели', 'add the exponents'),
    s4: L('nol bir beradi', 'ноль даёт единицу', 'zero gives one'),
    ok: L("Ko'rsatkichlar nol berdi, nol ko'rsatkich esa bir.", 'Показатели дали ноль, а нулевой показатель это единица.', 'The exponents gave zero, and a zero exponent is one.'),
    bad: L("Avval daraja darajaga, keyin ko'paytirish, keyin nol ko'rsatkich.", 'Сначала степень в степень, потом умножение, потом нулевой показатель.', 'First the power of a power, then the multiplication, then the zero exponent.'),
    mark: '1',
  },
  expr: '(a^{2/3})⁶·a^{−4}',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Polosasiz hisoblang', 'Посчитай без полосы', 'Compute without the band'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu ekranda polosa yo'q. Imtihonda ham bo'lmaydi.", 'На этом экране полосы нет. На экзамене её тоже не будет.', 'There is no band on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L("To'rt. Ko'rsatkichdagi minus kasrni teskari qildi, ikki uchdan esa kub ildizning kvadratini berdi.", 'Четыре. Минус в показателе перевернул дробь, а две третьих дали квадрат кубического корня.', 'Four. The minus in the exponent turned the fraction over, and two thirds gave the square of the cube root.'),
    hint: [
      L('Avval kasrni teskari qilib minusni oling.', 'Сначала убери минус, перевернув дробь.', 'First remove the minus by turning the fraction over.'),
      L("Keyin kasr ko'rsatkichni ildiz deb o'qing.", 'Потом дробный показатель прочитай как корень.', 'Then read the fractional exponent as a root.'),
      L("To'rt.", 'Четыре.', 'Four.'),
    ],
    prompt: '(1/8)^{−2/3}   →   ?',
    answer: '4',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi yozuv kichikroq?', 'Какая запись меньше?', 'Which reading is smaller?'),
    ok: L("Asos birdan katta, shuning uchun ko'rsatkich qancha katta bo'lsa, qiymat ham shuncha katta.", 'Основание больше единицы, поэтому чем больше показатель, тем больше значение.', 'The base is greater than one, so the bigger the exponent the bigger the value.'),
    bad: L("Har yozuvni songa o'tkazing, keyin solishtiring.", 'Переведи каждую запись в число, потом сравнивай.', 'Turn each reading into a number, then compare.'),
    items: ['2^{−2}', '2⁰', '2^{1/2}', '2²'],
    answer: '2^{−2}  2⁰  2^{1/2}  2²',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Javob xato. Qayerda?', 'Ответ неверный. Где?', 'The answer is wrong. Where?'),
  tag: 'check',
  audio: [
    A('mount', "Masala. Manfiy son avval kvadratga ko'tarilgan ifodaning qiymatini topish.", 'Задача. Найти значение выражения, где отрицательное число сначала возводят в квадрат.', 'A task. Find the value of an expression where a negative number is squared first.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L('Bu qator shartni shunchaki qaytadan yozadi.', 'Эта строка просто переписывает условие.', 'This line just rewrites the task.'),
    r3: L("Bu oldingi qatorning to'g'ri natijasi.", 'Это верное следствие предыдущей строки.', 'This is a correct consequence of the previous line.'),
    r4: L("Bu yerda son oldingi qator bo'yicha to'g'ri hisoblangan.", 'Число здесь посчитано по предыдущей строке верно.', 'The number here is computed correctly from the previous line.'),
  },
  proof: L("Bu yerda manfiy asosda ko'rsatkichlar ko'paytirildi, bu qoida esa musbat asosni talab qiladi.", 'Здесь показатели перемножили при отрицательном основании, а это правило требует положительного.', 'Here the exponents were multiplied with a negative base, and that rule requires a positive one.'),
  entry: {
    prompt: L('Bu ifoda haqiqatda nechaga teng?', 'Чему равно это выражение на самом деле?', 'What does this expression actually equal?'),
    ok: L("Ikki. Avval kvadrat to'rt beradi, va faqat keyin ildiz olinadi.", 'Два. Сначала квадрат даёт четыре, и только потом берут корень.', 'Two. First the square gives four, and only then the root is taken.'),
    hint: [
      L("Ichkisidan boshlab amallar bo'yicha hisoblang.", 'Посчитай по действиям, начиная с внутреннего.', 'Compute action by action, starting from the inner one.'),
      L("Minus ikki kvadratda bu to'rt.", 'Минус два в квадрате это четыре.', 'Minus two squared is four.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
  row: {
    r1: '((−2)²)^{1/2}',
    r2: '(−2)^{2·1/2}',
    r3: '(−2)¹',
    r4: '−2',
  },
  answerId: 'r2',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Qiymat berilgan, ko'rsatkichni toping", 'Значение дано, найди показатель', 'The value is given, find the exponent'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Endi teskari masala. Qiymat berilgan, ko'rsatkichni topish kerak.", 'Теперь обратная задача. Значение дано, а найти надо показатель.', 'Now the inverse task. The value is given, and the exponent must be found.'),
    A('work', "Avval ko'rsatkichni yozing, keyin shu qiymatli hamma yozuvni belgilaysiz.", 'Сначала запиши показатель, потом отметишь все записи с этим значением.', 'First type the exponent, then you will mark every reading with that value.'),
  ],
  multi: {
    prompt: L("Qiymati bir to'qqizdan bo'lgan hamma yozuvni belgilang.", 'Отметь все записи, значение которых равно одной девятой.', 'Mark every reading whose value is one ninth.'),
    title: L("Qaysi yozuvlarning qiymati bir to'qqizdan?", 'У каких записей значение равно одной девятой?', 'Which readings have the value one ninth?'),
    ok: L("To'rttadan ikkitasi. Bir xil qiymat har xil asoslar bilan yoziladi.", 'Две из четырёх. Одно и то же значение записывается разными основаниями.', 'Two out of four. The same value is written with different bases.'),
    items: [
      { id: 'c', label: '3^{1/2}', hint: L('Bu uchning ildizi, u birdan katta.', 'Это корень из трёх, он больше единицы.', 'That is the root of three, it is greater than one.') },
      { id: 'd', label: '2^{−3}', hint: L('Bu bir sakkizdan: asos bu yerda ikki, uch emas.', 'Это одна восьмая: основание здесь двойка, а не тройка.', 'That is one eighth: the base here is two, not three.') },
      { id: 'a', label: '3^{−2}', ok: true },
      { id: 'b', label: '9^{−1}', ok: true },
    ],
  },
  entry: {
    prompt: L("Asos uch bo'lganda qaysi ko'rsatkich bir to'qqizdan beradi?", 'При основании три какой показатель даёт одну девятую?', 'With base three, which exponent gives one ninth?'),
    ok: L("Minus ikki. Uchning kvadrati to'qqiz, minus esa kasrni teskari qiladi.", 'Минус два. Квадрат тройки это девять, а минус переворачивает дробь.', 'Minus two. Three squared is nine, and the minus turns the fraction over.'),
    hint: [
      L("Avval uchning qaysi darajasi to'qqizga teng ekanini o'ylang.", 'Сначала подумай, какая степень тройки равна девяти.', 'First think which power of three equals nine.'),
      L("Keyin to'qqizdan bir to'qqizdan yasang.", 'Потом сделай из девяти одну девятую.', 'Then turn nine into one ninth.'),
      L('Minus ikki.', 'Минус два.', 'Minus two.'),
    ],
    answer: '−2',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'drobnyy-kak-delenie',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Darajalarni ko'paytirishda ko'rsatkichlar nima qilinadi?", 'Что делают с показателями при умножении степеней?', 'What happens to the exponents when powers are multiplied?'),
      done: 'a^m·a^n = a^{m+n}',
      items: [
        { id: 'a', label: L("qo'shiladi", 'складывают', 'they are added'), correct: true },
        { id: 'b', label: L("ko'paytiriladi", 'перемножают', 'they are multiplied'), hint: L("Darajani darajaga ko'tarishda ko'paytiriladi. Bu yerda yozuvlar yonma-yon qo'yiladi.", 'Перемножают при возведении степени в степень. Здесь записи ставят рядом.', 'They are multiplied when a power is raised to a power. Here the readings stand side by side.') },
        { id: 'c', label: L("bo'linadi", 'делят', 'they are divided'), hint: L("Bo'lish ko'rsatkichni kamaytiradi, ko'paytirish esa ko'paytuvchilarni qo'shadi.", 'Деление уменьшает показатель, а умножение множители дописывает.', 'Division lowers the exponent, multiplication appends factors.') },
        { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Ko'paytuvchilar ko'paydi, demak ko'rsatkich o'zgardi.", 'Множителей стало больше, значит показатель изменился.', 'There are more factors now, so the exponent changed.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Besh nol darajada nechaga teng?', 'Чему равно пять в нулевой степени?', 'What is five to the zero power?'),
      done: '5⁰ = 1',
      items: [
        { id: 'a', label: L('bir', 'единица', 'one'), correct: true },
        { id: 'b', label: L('nol', 'ноль', 'zero'), hint: L('Zinapoyadan tushing: beshdan keyin nol emas, bir keladi.', 'Спустись по лестнице: после пятёрки идёт не ноль, а единица.', 'Walk down the ladder: after five comes one, not zero.') },
        { id: 'c', label: L('besh', 'пять', 'five'), hint: L('Besh bu birinchi daraja, nol esa bir qadam pastda.', 'Пять это первая степень, а нулевая на шаг ниже.', 'Five is the first power, and the zero one is a step below.') },
        { id: 'd', label: L("bunday yozuv yo'q", 'такой записи нет', 'there is no such reading'), hint: L("Bor: zinapoya pastga nol ko'rsatkich orqali o'tadi.", 'Есть: лестница вниз проходит через нулевой показатель.', 'There is: the ladder down passes through the zero exponent.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Kasr ko'rsatkich nimani bildiradi?", 'Что означает дробный показатель?', 'What does a fractional exponent mean?'),
      done: 'a^{1/n} = ⁿ√a',
      items: [
        { id: 'a', label: L('ildiz', 'корень', 'a root'), correct: true, ok: L("Ha. Ko'rsatkichning maxraji qanday ildiz olinishini aytadi.", 'Да. Знаменатель показателя говорит, какой корень берут.', 'Yes. The denominator of the exponent says which root is taken.') },
        { id: 'b', label: L("asosni bo'lish", 'деление основания', 'dividing the base'), hint: L("Sakkiz uchga bo'linib kubga ko'tarilsa sakkiz emas, o'n to'qqiz beradi.", 'Восемь разделить на три в куб даёт девятнадцать, а не восемь.', 'Eight divided by three, cubed, gives nineteen, not eight.') },
        { id: 'c', label: L("asosni ko'paytirish", 'умножение основания', 'multiplying the base'), hint: L("Ko'paytirish sonni kattalashtirardi, ildiz esa kichraytiradi.", 'Умножение увеличило бы число, а корень его уменьшает.', 'Multiplying would make the number bigger, a root makes it smaller.') },
        { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L('Yozuvning qiymati bor, va uni teskari amal bilan tekshirish mumkin.', 'Значение у записи есть, и его можно проверить обратным действием.', 'The reading has a value, and it can be checked by the inverse action.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Har qanday ko'rsatkichli darajaning asosi qanday olinadi?", 'Каким берут основание степени с любым показателем?', 'Which base is taken for a power with any exponent?'),
      done: 'a > 0,  a ≠ 1',
      items: [
        { id: 'a', label: L("musbat va birga teng bo'lmagan", 'положительным и не равным единице', 'positive and not equal to one'), correct: true },
        { id: 'b', label: L('har qanday', 'любым', 'any'), hint: L("Minus to'rt va bir ikkidan ko'rsatkichda son yo'q.", 'У минус четырёх и показателя одна вторая числа нет.', 'With minus four and the exponent one half there is no number.') },
        { id: 'c', label: L('faqat butun', 'только целым', 'only a whole number'), hint: L("Asos kasr ham bo'ladi, faqat musbat bo'lsa.", 'Основание бывает и дробным, лишь бы положительным.', 'The base can be fractional too, as long as it is positive.') },
        { id: 'd', label: L('manfiy', 'отрицательным', 'negative'), hint: L("Aksincha: manfiyda kasr ko'rsatkich ishlamaydi.", 'Как раз наоборот: у отрицательного дробный показатель не работает.', 'Just the opposite: with a negative one a fractional exponent does not work.') },
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
    A('next', "Ko'rsatkichdagi minus kasrni teskari qiladi, sonning ishorasini o'zgartirmaydi.", 'Минус в показателе переворачивает дробь, а знак числа не меняет.', 'The minus in the exponent turns the fraction over and does not change the sign of the number.'),
  ],
  can: [
    L("Ko'paytirishda ko'rsatkichlarni qo'shaman, darajaga ko'tarishda ko'paytiraman", 'Складываю показатели при умножении и перемножаю при возведении в степень', 'I add exponents when multiplying and multiply them when raising to a power'),
    L("Nol va manfiy ko'rsatkichni zinapoya bilan chiqaraman", 'Получаю нулевой и отрицательный показатель по лестнице', 'I get the zero and negative exponents from the ladder'),
    L("Kasr ko'rsatkichni ildiz deb o'qiyman va teskari amal bilan tekshiraman", 'Дробный показатель читаю как корень и проверяю обратным действием', 'I read a fractional exponent as a root and check it by the inverse action'),
    L('Asos nega musbat olinishini bilaman', 'Знаю, почему основание берут положительным', 'I know why the base is taken positive'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L("Bitta joy takrorlashni talab qiladi: kasr ko'rsatkich.", 'Одно место требует повтора: дробный показатель.', 'One place needs review: the fractional exponent.'),
    back: L('Qoidaga va 6-ekranga qayting.', 'Вернись к правилу и к экрану 6.', 'Go back to the rule and to screen 6.'),
  },
  bridge: L("Keyin ko'rsatkich o'zgaruvchi bo'ladi, va o'sha yozuv funksiyaga aylanadi.", 'Дальше показатель станет переменной, и та же запись превратится в функцию.', 'Next the exponent becomes a variable, and the same reading turns into a function.'),
  lifehack: L("Nol ko'rsatkich qoidasini esdan chiqardingizmi, asosga bo'lib zinapoyadan tushing.", 'Забыл правило для нулевого показателя — спустись по лестнице, деля на основание.', 'Forgot the rule for the zero exponent, walk down the ladder dividing by the base.'),
  sheetTitle: L('Daraja · shpargalka', 'Степень · шпаргалка', 'The power · cheat sheet'),
  sheetSrc: L('10-sinf · 26-dars', '10 класс · урок 26', 'Grade 10 · lesson 26'),
  hook: {
    a: '−8',
    b: '1/8',
  },
  proved: '1/8',
  law: 'a^{−n} = 1/a^n',
  sheet: [
    'a^m·a^n = a^{m+n}',
    '(a^m)^n = a^{m·n}',
    'a⁰ = 1',
    'a^{−n} = 1/a^n',
    'a^{m/n} = ⁿ√(a^m)',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число из контента: минус там типографский, `parseFloat` его не понимает.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))

// ЗАПИСЬ РАСТЁТ ВНИЗ -- это и есть прибор 2 (`PODXOD_10SINF.md` §5).
//
// Кадр показа приходит смешанным: текстовые строки это объекты `L(...)`,
// формулы -- обычные строки. Слева ложится запись (все формулы от первого
// кадра до текущего, зелёным ровно ОДНА -- последняя, решение методиста §5),
// справа стоят слова текущего кадра. Чертежа на этих экранах нет: работа
// идёт в записи, и придумывать ей картинку значило бы врать.
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

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const POW_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const POW_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

const ORD3 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S3.order[id] }))
const ORD4 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S4.order[id] }))
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
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.1}>
        <Col>
          {/* Полоса стоит с первой секунды и ничего не выдаёт: на ней числа,
              квадраты появятся только на восьмом экране. */}
          <Scene fig={<PowerBand step={0} mode="squares" />} max={280} />
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
      <Tape show={S3.show} phase={phase} />
    ) : (
      <OrderRow
        prompt={S3.order.prompt}
        items={ORD3}
        answer={['s1', 's2', 's3', 's4']}
        okText={S3.order.ok}
        badText={S3.order.bad}
        audio={audio}
        onSolved={solve}
      />
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
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <NoteList items={[S5.show[0][2], { ok: true, v: S5.show[1][2] }]} />
          </Panel>
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
      <Tape show={S6.show} phase={phase} />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <NoteList items={[S6.show[0][2], { ok: true, v: S6.show[1][2] }]} />
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
      /* Свидетель урока: полоса СУЖАЕТСЯ. Прошлая полоса остаётся хирым
         контуром, и видно, что `2√2` лежал на её правом конце. */
      <Scene
        fig={<PowerBand step={phase} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<PowerBand step={2} />} max={300} />
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
        // Квадраты падают в правую половину в момент ответа: правило
        // открывается рядом с тем движением, которое его и породило.
        fig={(solved) => <Scene fig={<PowerBand step={solved ? 2 : 1} mode="squares" />} max={330} />}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={POW_LEFT}
        right={POW_RIGHT}
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
          <Scene fig={<PowerBand step={2} mode="squares" />} max={280} />
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
        fig={() => <Scene fig={<PowerBand step={2} mode="squares" />} max={280} />}
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
