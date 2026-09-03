// ============================================================================
// 10-sinf, Dars 27. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS27_KONTENT.md
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
  BagPick,
  MatchPairs,
  MultiPick,
  NoteList,
  NumberEntry,
  OrderRow,
  ProbeChain,
  Scene,
} from './tools.jsx'

import { Bag } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 27
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Ehtimolliklar nazariyasi`,
  `Урок ${LESSON_NO}. Теория вероятностей`,
  `Lesson ${LESSON_NO}. Probability`,
)

const BLOCK = { label: 'B5', from: 15, to: 27, current: 27 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TAJRIBA', 'ОПЫТ', 'THE EXPERIMENT'),
  title: L("Uch isxodmi yoki to'rt", 'Три исхода или четыре', 'Three outcomes or four'),
  audio: [
    A('mount', 'Ikkita tanga tashlaymiz va nima tushganiga qaraymiz. Savol tomonlar qanchalik tez-tez har xil chiqishi haqida.', 'Бросаем две монеты и смотрим, что выпало. Вопрос про то, как часто стороны выходят разные.', 'We toss two coins and look at what came up. The question is how often the sides come out different.'),
    A('r1', 'Birinchi yozuv shunday sanaydi: ikki gerb, ikki raqam va har xil. Isxod uchta, har xili uchdan bitta, demak bir uchdan.', 'Первая запись считает так: два герба, два числа и разные. Исходов три, разные один из трёх, значит одна третья.', 'The first counts like this: two heads, two tails, and different. Three outcomes, different is one of three, so one third.'),
    A('r2', "Ikkinchisi isxod to'rtta, har xili ular ichida ikkita, demak bir ikkidan deydi.", 'Вторая говорит, что исходов четыре, и разные среди них два, значит одна вторая.', 'The second says there are four outcomes, and two of them are different, so one half.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi isxodlarni kartochka qilib yotqizamiz.', 'Твой ответ записан. Сейчас выложим исходы карточками.', 'Your answer is saved. Now we will lay the outcomes out as cards.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('isxod uchta', 'исходов три', 'there are three outcomes'),
      value: '1/3',
    },
    b: {
      name: L("isxod to'rtta", 'исходов четыре', 'there are four outcomes'),
      value: '1/2',
    },
  },
  expr: 'P(A) = ?',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Tajribadan oldin uch savol', 'Три вопроса перед опытом', 'Three questions before the experiment'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Tajriba isxodi deb nima ataladi?', 'Что называют исходом опыта?', 'What is called an outcome of an experiment?'),
      done: 'E₁, E₂, E₃, …',
      items: [
        { id: 'a', label: L('har bir alohida natija', 'каждый отдельный результат', 'each separate result'), correct: true },
        { id: 'b', label: L('faqat muvaffaqiyatli natija', 'только удачный результат', 'only a successful result'), hint: L('Muvaffaqiyatsiz natija ham isxod, u ham sanaladi.', 'Неудачный результат тоже исход, его тоже считают.', 'An unsuccessful result is an outcome too, it is counted as well.') },
        { id: 'c', label: L("tajribaning o'zi butunligicha", 'сам опыт целиком', 'the whole experiment itself'), hint: L('Tajriba bitta, isxodlari esa bir nechta.', 'Опыт один, исходов у него несколько.', 'There is one experiment and several outcomes.') },
        { id: 'd', label: L('chiqqan son', 'число, которое получилось', 'the number that came out'), hint: L("Isxod son bo'lmasligi ham mumkin: gerb ham isxod.", 'Исход бывает и не числом: герб это тоже исход.', 'An outcome need not be a number: heads is an outcome too.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Isxodlar qachon teng imkoniyatli deyiladi?', 'Когда исходы называют равновозможными?', 'When are outcomes called equally likely?'),
      done: 'P(E₁) = P(E₂)',
      items: [
        { id: 'a', label: L("birini ikkinchisidan ehtimolliroq deyishga asos bo'lmaganda", 'когда нет причины считать один вероятнее другого', 'when there is no reason to think one more likely than another'), correct: true },
        { id: 'b', label: L("ular ikkita bo'lganda", 'когда их два', 'when there are two of them'), hint: L("Ikki isxod teng imkoniyatsiz ham bo'ladi: yomg'ir va uning yo'qligi.", 'Два исхода бывают и неравновозможными: дождь и его отсутствие.', 'Two outcomes can be unequal: rain and no rain.') },
        { id: 'c', label: L("ularni sanash mumkin bo'lganda", 'когда их можно посчитать', 'when they can be counted'), hint: L('Har qanday isxodni sanash mumkin, gap bunda emas.', 'Посчитать можно любые исходы, дело не в этом.', 'Any outcomes can be counted, that is not the point.') },
        { id: 'd', label: L('doim', 'всегда', 'always'), hint: L("Doim bo'lganda, e'lon qilish shart bo'lmasdi.", 'Если бы всегда, объявлять бы не пришлось.', 'If it were always, there would be nothing to declare.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Ikki miqdor nisbati nimani ko'rsatadi?", 'Что показывает отношение двух количеств?', 'What does a ratio of two counts show?'),
      done: 'm/n',
      items: [
        { id: 'a', label: L('biri ikkinchisining qanday qismi ekanini', 'какую часть одно составляет от другого', 'what part one makes of the other'), correct: true },
        { id: 'b', label: L("ularning yig'indisini", 'их сумму', 'their sum'), hint: L("Yig'indi qo'shishdan chiqadi, bu yerda esa bo'lish.", 'Сумма получается сложением, а здесь деление.', 'A sum comes from adding, and here there is division.') },
        { id: 'c', label: L('qaysi biri kattaligini', 'какое из них больше', 'which of them is bigger'), hint: L("Bu bo'lmasdan ham ko'rinadi, nisbat ko'proq narsa aytadi.", 'Это видно и без деления, отношение говорит больше.', 'That is visible without dividing, a ratio says more.') },
        { id: 'd', label: L('ularning ayirmasini', 'их разность', 'their difference'), hint: L("Ayirma bu ayirish, nisbat esa bo'lish.", 'Разность это вычитание, а отношение это деление.', 'A difference is subtraction, a ratio is division.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Isxodlarni kartochka qilib yotqizamiz', 'Выложим исходы карточками', 'Let us lay the outcomes out as cards'),
  tag: 'or-ro-odin-isxod',
  show: [
    [
      L('birinchi tanga ikki xil tusha oladi', 'первая монета может лечь двумя способами', 'the first coin can land in two ways'),
      L('ikkinchisi ham ikki xil', 'вторая тоже двумя', 'the second one in two ways as well'),
      L("demak kartochka to'rtta", 'значит карточек четыре', 'so there are four cards'),
    ],
    [
      L('gerb va raqam bu bitta kartochka', 'герб и число это одна карточка', 'heads then tails is one card'),
      L('raqam va gerb bu boshqasi', 'число и герб это другая', 'tails then heads is another'),
      L('ular bir xil narsa emas', 'они не одно и то же', 'they are not one and the same'),
    ],
  ],
  motion: ['lay'],
  audio: [
    A('mount', "Barcha isxodlarni bittalab yoyamiz. So'z bilan emas, kartochka bilan: shunda ularni barmoq bilan sanash mumkin.", 'Разложим все исходы по одному. Не словами, а карточками: так их можно пересчитать пальцем.', 'Let us lay out every outcome one by one. Not in words but as cards: that way they can be counted with a finger.'),
    A('lay', "Birinchi tanga ikki xil tushadi, ikkinchisi ham ikki xil, jami birikma to'rtta chiqadi. Mana ular yotibdi: gerb gerb, gerb raqam, raqam gerb, raqam raqam. Ikkinchi va uchinchi kartochkaga e'tibor bering. Ikkalasida ham tomonlar har xil, va buni bitta hol deyish oson. Lekin tanga ikkita, va ular ajratiladi: avval gerb, keyin raqam tushdi, yoki aksincha. Bu ikki xil isxod, va ular alohida yotadi. Tomonlar har xil bo'lgan kartochkalarni o'zingiz belgilang.", 'Первая монета ложится двумя способами, вторая тоже двумя, и всего сочетаний выходит четыре. Вот они лежат: герб герб, герб число, число герб, число число. Обрати внимание на вторую и третью карточки. В обеих стороны разные, и легко сказать, что это один и тот же случай. Но монеты две, и они различимы: сначала выпал герб, потом число, или наоборот. Это два разных исхода, и лежат они отдельно. Отметь сам те карточки, где стороны разные.', 'The first coin lands in two ways, the second one in two ways as well, and that gives four combinations in all. Here they lie: heads heads, heads tails, tails heads, tails tails. Look at the second and third cards. In both the sides are different, and it is easy to say that this is one and the same case. But there are two coins, and they can be told apart: heads came first and then tails, or the other way round. These are two different outcomes, and they lie separately. Mark the cards where the sides differ yourself.'),
    A('work', "Tomonlar har xil bo'lgan barcha kartochkalarni belgilang.", 'Отметь все карточки, где стороны разные.', 'Mark every card where the sides are different.'),
  ],
  pick: {
    prompt: L("Tomonlar har xil bo'lgan isxodlarni belgilang", 'Отметь исходы, где стороны разные', 'Mark the outcomes where the sides differ'),
    ok: L("To'rtta kartochkadan ikkitasi. Endi tajriba bilan tekshiramiz: bosing va sinov o'tkazing.", 'Две карточки из четырёх. Теперь проверим опытом: нажми и проведи испытания.', 'Two cards out of four. Now let us check by experiment: press and run the trials.'),
    bad: L('Har bir kartochkaga alohida qarang: har xil tomon bu istalgan tartibda gerb va raqam.', 'Посмотри на каждую карточку отдельно: разные стороны это герб и число в любом порядке.', 'Look at each card separately: different sides means heads and tails in either order.'),
    answer: 'ht  th',
  },
  card: {
    hh: L('GG', 'ГГ', 'HH'),
    ht: L('GR', 'ГЧ', 'HT'),
    th: L('RG', 'ЧГ', 'TH'),
    tt: L('RR', 'ЧЧ', 'TT'),
  },
}

const S4 = {
  role: 'explain2',
  answer: 'order',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Tajribadan oldin hisoblanadi, keyin o'lchanadi", 'Считают до опыта, измеряют после', 'Computed before, measured after'),
  tag: 'chastota-vmesto-veroyatnosti',
  show: [
    [
      L("o'nta sinov tarqoqlik beradi", 'десять испытаний дают разброс', 'ten trials give a spread'),
      L("bugun oltita, ertaga to'rtta", 'сегодня шесть, завтра четыре', 'six today, four tomorrow'),
      L("kasr esa shu vaqt ichida o'zgargani yo'q", 'а дробь всё это время не менялась', 'while the fraction did not change'),
    ],
    [
      L('ikki yuz sinov yarim atrofiga tushadi', 'двести испытаний ложатся около половины', 'two hundred trials land near a half'),
      L("sinov qancha ko'p bo'lsa, shuncha yaqin", 'чем больше испытаний, тем ближе', 'the more trials, the closer'),
      L("lekin aniq mos kelish va'da qilinmagan", 'но совпадения в точности не обещано', 'yet an exact match is never promised'),
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', 'Ketma-ket ikki seriya sinov. Avval qisqasi, keyin uzuni.', 'Две серии испытаний подряд. Сначала короткая, потом длинная.', 'Two series of trials in a row. First a short one, then a long one.'),
    A('two', "O'nta tashlash. Har xil tomon olti marta tushdi, bu nol butun olti o'ndan. Yana takrorlaymiz, boshqa son chiqadi, aytaylik o'ndan to'rtta. Kasr esa qimirlagani yo'q: isxod avvalgidek to'rtta, qulaylik tug'diruvchisi avvalgidek ikkita. Endi ikki yuz tashlash. Ustun yarim atrofida turadi va deyarli tebranmaydi. Farq mana shunda. Kasr bu ehtimollik, u har qanday tajribadan oldin, kartochkalar bo'yicha hisoblanadi. Ustun bu nisbiy chastota, u tajribadan keyin, yutuqlarni sanash bilan olinadi. Birinchisi bashorat qiladi, ikkinchisi o'lchaydi, uzun seriyada esa ular yaqinlashadi.", 'Десять бросков. Разные стороны выпали шесть раз, это ноль целых шесть десятых. Повторим ещё раз, и выйдет другое число, скажем четыре из десяти. Дробь при этом не шелохнулась: исходов по-прежнему четыре, благоприятных по-прежнему два. Теперь двести бросков. Столбик встаёт около половины и почти не гуляет. Вот в чём разница. Дробь это вероятность, её считают до всякого опыта, по карточкам. Столбик это относительная частота, её получают после опыта, счётом удач. Первое предсказывает, второе измеряет, и при длинной серии они сходятся.', 'Ten tosses. Different sides came up six times, that is zero point six. Repeat it and another number comes out, say four out of ten. The fraction did not stir: there are still four outcomes and still two favourable ones. Now two hundred tosses. The bar stands near a half and barely wanders. That is the difference. The fraction is the probability, computed before any experiment, from the cards. The bar is the relative frequency, obtained after the experiment by counting successes. The first predicts, the second measures, and over a long series they converge.'),
    A('work', 'Buni qanday tartibda qilishsa, shu tartibda qadamlarni joylashtiring.', 'Расставь шаги в том порядке, в котором это делают.', 'Put the steps in the order in which this is done.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring', 'Расставь шаги по порядку', 'Put the steps in order'),
    s1: L('isxodlarni yotqizish', 'выложить исходы', 'lay out the outcomes'),
    s2: L('kasrni hisoblash', 'посчитать дробь', 'compute the fraction'),
    s3: L("sinov o'tkazish", 'провести испытания', 'run the trials'),
    s4: L('kasr bilan solishtirish', 'сравнить с дробью', 'compare with the fraction'),
    ok: L("To'g'ri. Kasr tajribadan oldin olinadi, aks holda solishtiradigan narsa qolmaydi.", 'Верно. Дробь получают до опыта, иначе сравнивать будет не с чем.', 'Correct. The fraction comes before the experiment, otherwise there is nothing to compare with.'),
    bad: L("Sinovlar hisobdan keyin boradi, uning o'rniga emas.", 'Испытания идут после счёта, а не вместо него.', 'The trials come after the counting, not instead of it.'),
    mark: '2/4 = 0,5',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("O'n ikki shar, to'qqiztasi qulaylik tug'diradi", 'Двенадцать шаров, девять благоприятных', 'Twelve balls, nine favourable'),
  tag: 'ravnovozmozhnost-po-privychke',
  show: [
    [
      L("idishda o'n ikki shar bor", 'в урне двенадцать шаров', 'there are twelve balls in the urn'),
      L("beshtasi qizil, to'rttasi qora, uchtasi oq", 'пять красных, четыре чёрных, три белых', 'five red, four black, three white'),
      L('har bir shar alohida kartochka', 'каждый шар это отдельная карточка', 'each ball is a separate card'),
    ],
    [
      L('sharlar bir xil va aralashtirilgan', 'шары одинаковы и перемешаны', 'the balls are alike and well mixed'),
      L('demak isxodlar teng imkoniyatli', 'значит исходы равновозможны', 'so the outcomes are equally likely'),
      L("va buni nazarda tutishmaydi, e'lon qilishadi", 'и это объявляют, а не подразумевают', 'and this is declared, not assumed'),
    ],
  ],
  motion: ['urn'],
  audio: [
    A('mount', 'Darslikdagi masala. Idishdan tavakkaliga bitta shar olinadi.', 'Задача из учебника. Из урны наугад берут один шар.', 'A task from the textbook. One ball is taken from the urn at random.'),
    A('urn', "Idishda o'n ikki shar bor: beshtasi qizil, to'rttasi qora va uchtasi oq. Har bir shar o'z kartochkasi bilan yotibdi, va bu muhim: uch rang emas, o'n ikki isxod. Hisoblashdan oldin bir narsani ovoz chiqarib aytish kerak. Sharlar ushlaganda bir xil, aralashtirilgan va tavakkaliga olinadi, demak birortasining ustunligi yo'q. Faqat endi isxodlar teng imkoniyatli, va faqat endi kasr ma'noga ega. Agar qizillari qolganlaridan yirikroq bo'lganida, o'n ikkala kartochka joyida qolardi, lekin bunday hisoblab bo'lmasdi. Hodisaga qulaylik tug'diruvchi kartochkalarni belgilang: qizil yoki qora olindi.", 'В урне двенадцать шаров: пять красных, четыре чёрных и три белых. Каждый шар лежит своей карточкой, и это важно: не три цвета, а двенадцать исходов. Прежде чем считать, надо кое-что объявить вслух. Шары одинаковы на ощупь, перемешаны и берут их наугад, значит ни один не имеет преимущества. Только теперь исходы равновозможны, и только теперь дробь имеет смысл. Если бы красные были крупнее остальных, все двенадцать карточек остались бы на месте, а вот считать так было бы уже нельзя. Отметь карточки, благоприятные для события: вынули красный или чёрный.', 'The urn holds twelve balls: five red, four black and three white. Every ball lies as its own card, and that matters: not three colours but twelve outcomes. Before counting, something has to be said out loud. The balls feel the same, they are mixed and drawn at random, so none of them has an advantage. Only now are the outcomes equally likely, and only now does the fraction make sense. If the red ones were larger than the rest, all twelve cards would stay where they are, but counting this way would no longer be allowed. Mark the cards favourable to the event: a red or a black ball was drawn.'),
    A('work', "Bu hodisaga qulaylik tug'diruvchi barcha kartochkalarni belgilang.", 'Отметь все карточки, благоприятные для этого события.', 'Mark every card favourable to this event.'),
  ],
  pick: {
    prompt: L("Qulaylik tug'diruvchi isxodlarni belgilang: qizil yoki qora", 'Отметь благоприятные исходы: красный или чёрный', 'Mark the favourable outcomes: red or black'),
    ok: L("O'n ikkitadan to'qqiztasi. Kasr o'zi yig'ildi.", 'Девять карточек из двенадцати. Дробь собралась сама.', 'Nine cards out of twelve. The fraction assembled itself.'),
    bad: L("Oq sharlar hodisaga qulaylik tug'dirmaydi, qolganlarining hammasi tug'diradi.", 'Белые шары событию не благоприятны, а все остальные благоприятны.', 'The white balls are not favourable to the event, all the others are.'),
    count: '9/12',
  },
  card: {
    red: L('q', 'к', 'r'),
    black: L('k', 'ч', 'b'),
    white: L('o', 'б', 'w'),
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Kasrda nima qayerda turadi', 'Что где стоит в дроби', 'What stands where in the fraction'),
  tag: 'm-i-n-mestami',
  show: [
    [
      L("o'yin kubigi tashlanadi", 'бросают игральный кубик', 'a die is thrown'),
      L('isxod oltita', 'исходов шесть', 'there are six outcomes'),
      L('ular ichida juftlari uchta', 'чётных среди них три', 'three of them are even'),
    ],
    [
      L("yuqoriga qulaylik tug'diruvchilari qo'yiladi", 'сверху ставят благоприятные', 'the favourable ones go on top'),
      L('pastga barcha isxodlar', 'снизу все исходы', 'all the outcomes go below'),
      L('teskarisida birdan katta son chiqadi', 'наоборот выйдет число больше единицы', 'the other way round gives a number greater than one'),
    ],
  ],
  motion: ['place'],
  audio: [
    A('mount', 'Boshqa tajriba. Kubik tashlanadi va juft son tushganmi, qaraladi.', 'Другой опыт. Бросают кубик и смотрят, выпало ли чётное число.', 'A different experiment. A die is thrown and one looks at whether an even number came up.'),
    A('place', "Bu yerda isxod oltita: birdan oltigacha, va ularning hammasi teng imkoniyatli. Qulaylik tug'diruvchisi uchta: ikki, to'rt va olti. Kasr shunday yig'iladi: yuqorida qulaylik tug'diruvchilari, pastda hammasi. Oltidan uchtasi, ya'ni bir ikkidan. Endi o'rin almashtirilsa nima bo'lishiga qarang. Oltini uchga bo'lsak ikki. Ikkiga teng ehtimollik bo'lishi mumkin emas: qulaylik tug'diruvchi isxodlar hammasidan ko'p bo'lmaydi. Darslik buni alohida xossa qilib yozadi: ehtimollik nol bilan bir orasida yotadi. Demak birdan katta javob hisob xatosi emas, bu kasr ag'darilganining belgisi.", 'Исходов здесь шесть: от одного до шести, и все они равновозможны. Благоприятных три: два, четыре и шесть. Дробь собирается так: сверху благоприятные, снизу все. Три из шести, то есть одна вторая. А теперь посмотри, что будет при перестановке. Шесть на три это два. Вероятность, равная двум, невозможна: благоприятных исходов не бывает больше, чем всех. Учебник записывает это отдельным свойством: вероятность лежит между нулём и единицей. Так что ответ больше единицы это не ошибка счёта, это знак, что дробь перевёрнута.', 'There are six outcomes here: one to six, and all of them are equally likely. Three are favourable: two, four and six. The fraction is assembled like this: the favourable ones on top, all of them below. Three out of six, that is one half. Now look at what happens if they are swapped. Six over three is two. A probability equal to two is impossible: there are never more favourable outcomes than there are outcomes. The textbook writes this as a separate property: the probability lies between zero and one. So an answer greater than one is not an arithmetic slip, it is a sign that the fraction is upside down.'),
    A('work', "O'zingiz hisoblang. Maxrajda qaysi son turadi?", 'Посчитай сам. Какое число стоит в знаменателе?', 'Work it out yourself. Which number stands in the denominator?'),
  ],
  work: {
    prompt: L('Maxrajda nima turadi?', 'Что стоит в знаменателе?', 'What stands in the denominator?'),
    ok: L("Olti. Pastda doim barcha isxodlar, qulaylik tug'diruvchilari esa yuqorida.", 'Шесть. Внизу всегда все исходы, а благоприятные наверху.', 'Six. All the outcomes always go below, the favourable ones on top.'),
    hint: [
      L("Kubikning jami nechta yog'i bor?", 'Сколько всего граней у кубика?', 'How many faces does a die have in all?'),
      L('Kasrning pastida isxodlarning umumiy soni turadi.', 'Внизу дроби стоит общее число исходов.', 'The total number of outcomes stands at the bottom.'),
      L('Olti.', 'Шесть.', 'Six.'),
    ],
    expr: 'P(A) = m/n',
    answer: '6',
  },
  frameA: '3/6 = 1/2',
  frameB: '6/3 = 2',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARAVIY HOL', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Qulaylik tug'diruvchi yo'q va hammasi bo'lgan hol", 'Когда благоприятных нет и когда все', 'When none are favourable and when all are'),
  tag: 'ravnovozmozhnost-po-privychke',
  show: [
    [
      L("qutida o'n shar bor", 'в коробке десять шаров', 'there are ten balls in the box'),
      L("to'rttasi oq, qolganlari qora", 'четыре белых, остальные чёрные', 'four white, the rest black'),
      L("qizil shar umuman yo'q", 'красного шара нет вовсе', 'there is no red ball at all'),
    ],
    [
      L('birorta kartochka yoritilmagan', 'ни одна карточка не подсвечена', 'not a single card is lit'),
      L("yuqorida nol, pastda o'n", 'сверху ноль, снизу десять', 'zero on top, ten below'),
      L('ehtimollik nolga teng', 'вероятность равна нулю', 'the probability equals zero'),
    ],
  ],
  motion: ['edge'],
  audio: [
    A('mount', "Darslikdagi ikki qisqa hol. Ikkalasi ham o'sha kartochkalarda hisoblanadi.", 'Два коротких случая из учебника. Оба считаются на тех же карточках.', 'Two short cases from the textbook. Both are computed on the same cards.'),
    A('edge', "Qutida o'n shar bor: to'rttasi oq, qolganlari qora. Qizil olish ehtimolligi so'ralyapti. O'nta kartochkani yotqizamiz va qulaylik tug'diruvchilarini izlaymiz. Ular bitta ham yo'q: qutida qizil shar bo'lmagan. Yuqorida nol, pastda o'n, ehtimollik nolga teng. Bunday hodisani mumkin bo'lmagan deyishadi. Endi aksincha. Yigirma shar birdan yigirmagacha raqamlangan, tartib raqami yigirmadan katta bo'lmagan shar olish ehtimolligi so'ralyapti. Yigirmatasi ham qulaylik tug'diradi, yigirmani yigirmaga bo'lsak bir. Bunday hodisani muqarrar deyishadi. Chegaralar shundan: ehtimollik noldan kichik va birdan katta hech qachon bo'lmaydi.", 'В коробке десять шаров: четыре белых, остальные чёрные. Спрашивают вероятность вынуть красный. Выкладываем десять карточек и ищем благоприятные. Их нет ни одной: красного шара в коробке не было. Сверху ноль, снизу десять, вероятность равна нулю. Такое событие называют невозможным. Теперь наоборот. Двадцать шаров пронумерованы от одного до двадцати, спрашивают вероятность вынуть шар с номером не больше двадцати. Благоприятны все двадцать, двадцать делить на двадцать это единица. Такое событие называют достоверным. Отсюда и границы: меньше нуля и больше единицы вероятность не бывает никогда.', 'The box holds ten balls: four white, the rest black. The probability of drawing a red one is asked. We lay out ten cards and look for favourable ones. There is not a single one: there was no red ball in the box. Zero on top, ten below, the probability equals zero. Such an event is called impossible. Now the other way round. Twenty balls are numbered from one to twenty, and the probability of drawing a ball numbered no more than twenty is asked. All twenty are favourable, twenty divided by twenty is one. Such an event is called certain. Hence the bounds: a probability is never less than zero and never greater than one.'),
    A('work', "O'zingiz hisoblang. Qizil shar olish ehtimolligi nechaga teng?", 'Посчитай сам. Чему равна вероятность вынуть красный шар?', 'Work it out yourself. What is the probability of drawing a red ball?'),
  ],
  work: {
    prompt: L('Ehtimollik nechaga teng?', 'Чему равна вероятность?', 'What does the probability equal?'),
    ok: L("Nolga. Qulaylik tug'diruvchi isxod bitta ham yo'q.", 'Нулю. Благоприятных исходов нет ни одного.', 'Zero. There is not a single favourable outcome.'),
    hint: [
      L('Qutida nechta qizil shar borligini sanang.', 'Посчитай, сколько красных шаров в коробке.', 'Count how many red balls are in the box.'),
      L("Nolni o'nga bo'lsak nol.", 'Ноль, делённый на десять, это ноль.', 'Zero divided by ten is zero.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    expr: '0 ≤ P(A) ≤ 1',
    answer: '0',
  },
  frameA: '0/10 = 0',
  frameB: '20/20 = 1',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Ehtimollik va chastota', 'Вероятность и частота', 'Probability and frequency'),
  tag: 'chastota-vmesto-veroyatnosti',
  motion: ['rule'],
  audio: [
    A('mount', "Qoidani yig'amiz. U qisqa, chunki hisobning hammasi kartochkalarda.", 'Соберём правило. Оно короткое, потому что счёт весь на карточках.', 'Let us put the rule together. It is short, because all the counting is on the cards.'),
    A('rule', "Birinchi: barcha isxodlarni bittalab yotqizish va ularni teng imkoniyatli deb e'lon qilish. Bu alohida qadam, uni o'tkazib bo'lmaydi: agar isxodlar teng imkoniyatli bo'lmasa, keyin umuman hisoblab bo'lmaydi. Ikkinchi: qulaylik tug'diruvchilarini belgilab, ularni yuqoriga, isxodlarning umumiy sonini pastga qo'yish. Nisbat hodisaning ehtimolligi bo'ladi. Uchinchi: chegaralarni tekshirish. Nol hodisa mumkin emasligini, bir esa u albatta ro'y berishini bildiradi, qolgani ular orasida yotadi. Farqni ham eslang: bu son tajribadan oldin olingan. Tajriba boshqa natija berishi mumkin, ayniqsa sinov kam bo'lsa.", 'Первое: выложить все исходы поштучно и объявить их равновозможными. Это отдельный шаг, и его нельзя пропустить: если исходы неравновозможны, дальше считать нельзя вовсе. Второе: отметить благоприятные и поставить их сверху, а общее число исходов снизу. Отношение и есть вероятность события. Третье: проверить границы. Ноль означает, что событие невозможно, единица означает, что оно наступит наверняка, а всё остальное лежит между ними. И держи в голове разницу: это число получено до опыта. Опыт может дать другое, особенно если испытаний мало.', 'First: lay out every outcome one by one and declare them equally likely. That is a separate step and it cannot be skipped: if the outcomes are not equally likely, no further counting is allowed at all. Second: mark the favourable ones and put them on top, with the total number of outcomes below. The ratio is the probability of the event. Third: check the bounds. Zero means the event is impossible, one means it is certain, and everything else lies between. And keep the difference in mind: this number was obtained before the experiment. The experiment may give another, especially when there are few trials.'),
  ],
  probe: {
    question: L('Ehtimollik chastotadan nimasi bilan farq qiladi?', 'Чем вероятность отличается от частоты?', 'How does a probability differ from a frequency?'),
    items: [
      { id: 'a', label: L('ehtimollik tajribadan oldin, chastota keyin hisoblanadi', 'вероятность считают до опыта, частоту после', 'a probability is computed before the experiment, a frequency after'), correct: true },
      { id: 'b', label: L('bu bir xil narsa, faqat har xil ataladi', 'это одно и то же, только называется по-разному', 'they are the same thing under different names'), hint: L("U holda o'nta tashlash har safar bir xil son berardi.", 'Тогда десять бросков давали бы каждый раз одно и то же число.', 'Then ten tosses would give the same number every time.') },
    ],
  },
  rule: {
    lawLabel: L('QANDAY HISOBLANADI', 'КАК СЧИТАЮТ', 'HOW IT IS COUNTED'),
    lines: [
      L("barcha isxodlarni bittalab yotqizib, teng imkoniyatli deb e'lon qilish", 'выложить все исходы поштучно и объявить их равновозможными', 'lay out every outcome one by one and declare them equally likely'),
      L("yuqorida qulaylik tug'diruvchilari, pastda hammasi", 'сверху благоприятные, снизу все', 'the favourable ones on top, all of them below'),
      L('javob nol bilan bir orasida yotadi', 'ответ лежит между нулём и единицей', 'the answer lies between zero and one'),
    ],
    law: 'P(A) = m/n,   0 ≤ P(A) ≤ 1',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  title: L('Hisobni ehtimollik bilan ulang', 'Соедини счёт с вероятностью', 'Match each count with its probability'),
  tag: 'm-i-n-mestami',
  audio: [
    A('mount', "To'rt juft son va to'rt ehtimollik. Xayolda hisoblang.", 'Четыре пары чисел и четыре вероятности. Считай в уме.', 'Four pairs of numbers and four probabilities. Compute in your head.'),
  ],
  match: {
    prompt: L("Chapda qulaylik tug'diruvchilari va barcha isxodlar", 'Слева благоприятные и все исходы', 'On the left the favourable and the total outcomes'),
    ok: L("To'g'ri. Birorta ehtimollik birdan katta chiqmadi, va bu tekshiruv.", 'Верно. Ни одна вероятность не вышла больше единицы, и это проверка.', 'Correct. No probability came out greater than one, and that is a check.'),
    left: ['m = 3, n = 6', 'm = 0, n = 10', 'm = 20, n = 20', 'm = 9, n = 12'],
    a: '1/2',
    b: '0',
    c: '1',
    d: '3/4',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L("Ehtimollikni to'liq hisoblang", 'Посчитай вероятность целиком', 'Compute the probability from start to finish'),
  tag: 'or-ro-odin-isxod',
  audio: [
    A('mount', "Endi butun hisob. To'rt qadam, tartib muhim.", 'Теперь весь счёт целиком. Четыре шага, порядок важен.', 'Now the whole count. Four steps, and the order matters.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring', 'Расставь шаги по порядку', 'Put the steps in order'),
    s1: L('isxodlarni yotqizish', 'выложить исходы', 'lay out the outcomes'),
    s2: L("teng imkoniyatli deb e'lon qilish", 'объявить равновозможными', 'declare them equally likely'),
    s3: L("qulaylik tug'diruvchilarini belgilash", 'отметить благоприятные', 'mark the favourable ones'),
    s4: L('nisbatni yozish', 'записать отношение', 'write the ratio'),
    ok: L("To'g'ri. Teng imkoniyatlilik hisobdan oldin e'lon qilinadi, keyin emas.", 'Верно. Равновозможность объявляют до счёта, а не после.', 'Correct. Equal likelihood is declared before the counting, not after.'),
    bad: L("Qulaylik tug'diruvchilarini faqat isxodlar yotqizilgandan keyin belgilash mumkin.", 'Отмечать благоприятные можно только после того, как исходы выложены.', 'The favourable ones can be marked only after the outcomes are laid out.'),
    mark: '2/4 = 1/2',
  },
  expr: 'P(A) = m/n',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L("Nechta shar ko'k emas", 'Сколько шаров не синие', 'How many balls are not blue'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring.", 'Прибора нет. Считай на бумаге, потом сверься.', 'No instrument here. Work it out on paper, then compare.'),
    A('next', "Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping.", 'Дальше запись с ошибкой. Найди строку, где она появилась.', 'Next comes a written solution with a mistake. Find the line where it appeared.'),
  ],
  task: {
    ok: L("To'qqiz. Jami o'n besh, oltitasi ko'k, qolganlari boshqa.", 'Девять. Пятнадцать всего, шесть синих, остальные другие.', 'Nine. Fifteen in all, six of them blue, the rest are other.'),
    hint: [
      L("Ko'klarni umumiy sondan ayiring.", 'Вычти синие из общего числа.', 'Subtract the blue ones from the total.'),
      L("O'n besh minus olti.", 'Пятнадцать минус шесть.', 'Fifteen minus six.'),
      L("To'qqiz.", 'Девять.', 'Nine.'),
    ],
    prompt: 'n = 15,   m = 6',
    answer: '9',
  },
  order: {
    prompt: L("Hodisalarni ehtimolligi o'sishi bo'yicha joylashtiring", 'Расставь события по возрастанию вероятности', 'Put the events in order of increasing probability'),
    title: L("kam ehtimollidan ko'proq ehtimolliga", 'от менее вероятного к более', 'from less likely to more likely'),
    ok: L("To'g'ri. Yuqoridagi katta son katta ehtimollik degani emas.", 'Верно. Большое число сверху ещё не значит большую вероятность.', 'Correct. A big number on top does not yet mean a big probability.'),
    bad: L('Suratlarni emas, nisbatlarni solishtiring.', 'Сравнивай отношения, а не числители.', 'Compare the ratios, not the numerators.'),
    items: ['m = 1, n = 4', 'm = 3, n = 4', 'm = 0, n = 5', 'm = 1, n = 2'],
    answer: 'm = 0, n = 5  m = 1, n = 4  m = 1, n = 2  m = 3, n = 4',
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
    A('mount', "To'rt qator. Sonlar to'g'ri, javob esa mumkin emas. Bu qayerda sodir bo'lganini toping.", 'Четыре строки. Числа верные, а ответ невозможный. Найди, где это случилось.', 'Four lines. The counts are right and the answer is impossible. Find where that happened.'),
    A('next', "Keyin teskari masala: ehtimollikka qarab qulaylik tug'diruvchilar sonini tiklang.", 'Дальше обратная задача: по вероятности восстанови число благоприятных.', 'Next comes the reverse task: rebuild the number of favourable outcomes from the probability.'),
  ],
  hint: {
    r1: L("Sonlar to'g'ri sanalgan: shar o'n ikkita, qulaylik tug'diruvchisi to'qqizta.", 'Числа посчитаны верно: шаров двенадцать, благоприятных девять.', 'The counts are right: twelve balls, nine favourable.'),
    r2: L('Yuqoriga nima, pastga nima tushganiga qarang.', 'Посмотри, что оказалось сверху, а что снизу.', 'Look at what ended up on top and what below.'),
    r3: L("Oldingi qatordan bu to'g'ri kelib chiqadi, lekin qatorning o'zi noto'g'ri.", 'Из предыдущей строки это следует верно, но сама она уже неверна.', 'This follows correctly from the previous line, but that line is already wrong.'),
  },
  proof: L("Ehtimollik birdan katta bo'lmaydi, bu yerda esa kattaroq chiqdi.", 'Вероятность не бывает больше единицы, а здесь вышло больше.', 'A probability is never greater than one, and here it came out greater.'),
  entry: {
    prompt: L('Suratda qaysi son turishi kerak?', 'Какое число должно стоять в числителе?', 'Which number should stand in the numerator?'),
    ok: L("To'qqiz. Yuqorida doim qulaylik tug'diruvchilari, va shunda uch to'rtdan chiqadi.", 'Девять. Сверху всегда благоприятные, и тогда выходит три четверти.', 'Nine. The favourable ones always go on top, and then it comes out three quarters.'),
    hint: [
      L("Yuqorida kamroq yoki shuncha bo'lgan narsa turadi.", 'Сверху стоит то, чего меньше или столько же.', 'On top stands what is fewer or equal in number.'),
      L("Qulaylik tug'diruvchisi to'qqizta edi.", 'Благоприятных было девять.', 'There were nine favourable ones.'),
      L("To'qqiz.", 'Девять.', 'Nine.'),
    ],
    answer: '9',
  },
  row: {
    r1: 'n = 12,   m = 9',
    r2: 'P(A) = n/m',
    r3: 'P(A) = 12/9',
    r4: 'P(A) ≈ 1,33',
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
    A('mount', "Endi teskarisiga. Ehtimollikka qarab qulaylik tug'diruvchilar sonini ayting.", 'Теперь наоборот. По вероятности назови число благоприятных исходов.', 'Now the other way round. From the probability, name the number of favourable outcomes.'),
    A('work', "Keyin ro'y bera olmaydigan barcha hodisalarni belgilang.", 'Потом отметь все события, которые не могут произойти.', 'Then mark every event that cannot happen.'),
  ],
  multi: {
    prompt: L("Barcha mumkin bo'lmagan hodisalarni belgilang", 'Отметь все невозможные события', 'Mark every impossible event'),
    title: L('ular aynan ikkita', 'их ровно два', 'there are exactly two'),
    ok: L("To'g'ri. Mumkin bo'lmagan hodisaga nolta qulaylik tug'diruvchi isxod mos keladi.", 'Верно. Невозможному событию отвечает ноль благоприятных исходов.', 'Correct. An impossible event has zero favourable outcomes.'),
    items: [
      { id: 'c', label: '6', hint: L("Bu kamdan-kam bo'ladi, lekin bo'ladi: hodisa tasodifiy.", 'Такое случается редко, но случается: событие случайное.', 'That happens rarely but it happens: the event is random.') },
      { id: 'd', label: '1', hint: L("Bu hodisa doim ro'y beradi, u muqarrar, mumkin bo'lmagan emas.", 'Это событие наступает всегда, оно достоверное, а не невозможное.', 'This event always occurs, it is certain, not impossible.') },
      { id: 'a', label: '7', ok: true },
      { id: 'b', label: '0', ok: true },
    ],
  },
  entry: {
    prompt: L("Jami isxod o'n ikkita, ehtimollik bir to'rtdanga teng. Nechtasi qulaylik tug'diradi?", 'Всего исходов двенадцать, вероятность равна одной четвёртой. Сколько благоприятных?', 'There are twelve outcomes in all and the probability is one quarter. How many are favourable?'),
    ok: L("Uch. O'n ikkining bir to'rtdani uch.", 'Три. Одна четвёртая от двенадцати это три.', 'Three. One quarter of twelve is three.'),
    hint: [
      L("Kasr bir to'rtdanga teng, maxraj esa o'n ikki.", 'Дробь равна одной четвёртой, а знаменатель двенадцать.', 'The fraction equals one quarter and the denominator is twelve.'),
      L("O'n ikkini to'rtga bo'ling.", 'Двенадцать разделить на четыре.', 'Twelve divided by four.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    expr: 'P(A) = 1/4,   n = 12',
    answer: '3',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'chastota-vmesto-veroyatnosti',
  audio: [
    A('mount', "Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi.", 'Четыре вопроса подряд. Считается первая попытка.', 'Four questions in a row. The first attempt counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Ikki tanga tashlashda nechta isxod bor?', 'Сколько исходов у броска двух монет?', 'How many outcomes does tossing two coins have?'),
      done: '4',
      items: [
        { id: 'a', label: L("to'rt", 'четыре', 'four'), correct: true },
        { id: 'b', label: L('uch', 'три', 'three'), hint: L('Uch gerb bilan raqamni va raqam bilan gerbni yopishtirganda chiqadi.', 'Три выходит, если склеить герб с числом и число с гербом.', 'Three comes from gluing heads-tails and tails-heads together.') },
        { id: 'c', label: L('ikki', 'два', 'two'), hint: L('Ikki isxod bitta tangada, ular esa ikkita.', 'Два исхода у одной монеты, а их две.', 'Two outcomes belong to one coin, and there are two coins.') },
        { id: 'd', label: L('olti', 'шесть', 'six'), hint: L("Olti kubikda bo'ladi.", 'Шесть это у кубика.', 'Six belongs to a die.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("O'nta tashlashning yettitasi muvaffaqiyatli. Ehtimollik nechaga teng?", 'Из десяти бросков семь удачных. Чему равна вероятность?', 'Seven of ten tosses were successful. What is the probability?'),
      done: 'W(A) = 7/10',
      items: [
        { id: 'a', label: L("bundan uni bilib bo'lmaydi", 'из этого её узнать нельзя', 'it cannot be found from this'), correct: true },
        { id: 'b', label: L("nol butun yetti o'ndan", 'ноль целых семь десятых', 'zero point seven'), hint: L('Bu qisqa seriyaning nisbiy chastotasi, ehtimollik emas.', 'Это относительная частота короткой серии, а не вероятность.', 'That is the relative frequency of a short series, not the probability.') },
        { id: 'c', label: L('bir ikkidan', 'одна вторая', 'one half'), hint: L("Bir ikkidan isxodlar teng imkoniyatli bo'lganda bo'lardi, ular haqida esa hech nima aytilmagan.", 'Одна вторая была бы, если исходы равновозможны, а про них ничего не сказано.', 'One half would hold if the outcomes were equally likely, and nothing was said about them.') },
        { id: 'd', label: L('yetti', 'семь', 'seven'), hint: L("Ehtimollik birdan katta bo'lmaydi.", 'Вероятность больше единицы не бывает.', 'A probability is never greater than one.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Muqarrar hodisaning ehtimolligi nechaga teng?', 'Чему равна вероятность достоверного события?', 'What is the probability of a certain event?'),
      done: 'P(Ω) = 1',
      items: [
        { id: 'a', label: L('birga', 'единице', 'one'), correct: true, ok: L("Birga. Istisnosiz barcha isxodlar qulaylik tug'diradi.", 'Единице. Благоприятны все исходы без исключения.', 'One. Every single outcome is favourable.') },
        { id: 'b', label: L('nolga', 'нулю', 'zero'), hint: L("Nol mumkin bo'lmagan hodisada, muqarrarda emas.", 'Ноль у невозможного события, а не у достоверного.', 'Zero belongs to an impossible event, not to a certain one.') },
        { id: 'c', label: L('bir ikkidanga', 'одной второй', 'one half'), hint: L("Bir ikkidan isxodlarning yarmi qulaylik tug'dirganda bo'ladi.", 'Одна вторая это когда благоприятна половина исходов.', 'One half is when half the outcomes are favourable.') },
        { id: 'd', label: L("isxodlar soniga bog'liq", 'зависит от числа исходов', 'it depends on the number of outcomes'), hint: L("Ular qancha bo'lmasin, hammasi qulaylik tug'diradi, nisbat esa birga teng.", 'Сколько бы их ни было, благоприятны все, и отношение равно единице.', 'However many there are, all are favourable, and the ratio equals one.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Ehtimollik va chastota qachon yaqinlashadi?', 'Когда вероятность и частота сходятся?', 'When do a probability and a frequency converge?'),
      done: 'n → ∞',
      items: [
        { id: 'a', label: L("sinov soni katta bo'lganda", 'при большом числе испытаний', 'when the number of trials is large'), correct: true },
        { id: 'b', label: L('doim', 'всегда', 'always'), hint: L("O'nta tashlashda ular sezilarli farq qiladi.", 'При десяти бросках они расходятся заметно.', 'With ten tosses they differ noticeably.') },
        { id: 'c', label: L('hech qachon', 'никогда', 'never'), hint: L('Ikki yuz sinov yarim atrofiga tushdi, demak yaqinlashadi.', 'Двести испытаний легли около половины, значит сходятся.', 'Two hundred trials landed near a half, so they do converge.') },
        { id: 'd', label: L("isxod ikkita bo'lganda", 'когда исходов два', 'when there are two outcomes'), hint: L("Isxodlar sonining bunga aloqasi yo'q, gap sinovlar sonida.", 'Число исходов тут ни при чём, дело в числе испытаний.', 'The number of outcomes is not involved, it is the number of trials that matters.') },
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
    A('mount', "Taxmin uch va to'rt isxod haqida edi. Nima chiqqanini ko'ramiz.", 'Прогноз был про три исхода и четыре. Посмотрим, что вышло.', 'The guess was about three outcomes and four. Let us see how it turned out.'),
    A('next', "Isxod to'rtta, tajriba buni tasdiqladi. Gerb bilan raqam va raqam bilan gerb har xil isxod.", 'Исходов четыре, и опыт это подтвердил. Герб с числом и число с гербом это разные исходы.', 'There are four outcomes, and the experiment confirmed it. Heads then tails and tails then heads are different outcomes.'),
  ],
  can: [
    L('Barcha isxodlarni bittalab yotqizaman', 'Выкладываю все исходы поштучно', 'I lay out every outcome one by one'),
    L("Ularni alohida qadam bilan teng imkoniyatli deb e'lon qilaman", 'Объявляю их равновозможными отдельным шагом', 'I declare them equally likely as a separate step'),
    L("Qulaylik tug'diruvchilarini yuqoriga, hammasini pastga qo'yaman", 'Ставлю благоприятные сверху, все снизу', 'I put the favourable ones on top and all of them below'),
    L('Ehtimollikni chastotadan ajrataman', 'Отличаю вероятность от частоты', 'I tell a probability from a frequency'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of problem is closed.'),
    gap: L('Bir joy takrorlashni talab qiladi: teng imkoniyatlilik.', 'Одно место требует повтора: равновозможность.', 'One spot needs a second look: equal likelihood.'),
    back: L('Qoidaga va beshinchi ekranga qayting.', 'Вернись к правилу и к экрану 5.', 'Go back to the rule and to screen five.'),
  },
  bridge: L('Blok yopildi. Keyin takrorlash amaliyoti: daraja, logarifm, tengsizliklar va ehtimollik birga.', 'Блок закрыт. Дальше практикум повторения: степень, логарифм, неравенства и вероятность вместе.', 'The block is closed. Next comes the review practicum: powers, logarithms, inequalities and probability together.'),
  lifehack: L("Nimadan boshlashni bilmasangiz, isxodlarni bittalab yotqizing. Keyin masala o'zi hisoblanadi.", 'Не знаешь, с чего начать, выложи исходы по одному. Дальше задача считается сама.', 'If you do not know where to start, lay the outcomes out one by one. After that the task counts itself.'),
  sheetTitle: L('Ehtimollik · shpargalka', 'Вероятность · шпаргалка', 'Probability · cheat sheet'),
  sheetSrc: L('10-sinf · 37-dars', '10 класс · урок 37', 'Grade 10 · lesson 37'),
  hook: {
    a: '1/3',
    b: '1/2',
  },
  proved: '1/2',
  law: 'P(A) = m/n',
  sheet: [
    '0 ≤ P(A) ≤ 1',
    'P(Ω) = 1',
    'P(∅) = 0',
    'W(A) = M/N',
    '2/4 = 0,5',
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

// ПРИБОР 7. КАРТОЧКИ СОБИРАЮТСЯ ЗДЕСЬ, А ПОДПИСИ ЖИВУТ В КОНТЕНТЕ.
//
// Двенадцать карточек урны — это двенадцать исходов, но подписей у них три:
// цвет шара. Держать в документе контента двенадцать одинаковых строк на трёх
// языках незачем, поэтому там лежат три подписи, а список собирается тут.
const COINS = [
  { id: 'hh', label: S3.card.hh },
  { id: 'ht', label: S3.card.ht, good: true },
  { id: 'th', label: S3.card.th, good: true },
  { id: 'tt', label: S3.card.tt },
]
const COIN_ANS = String(S3.pick.answer).trim().split(/\s+/)

// Урна учебника, стр. 168: пять красных, четыре чёрных, три белых.
const URN = []
for (let i = 0; i < 5; i += 1) URN.push({ id: 'r' + i, label: S5.card.red, good: true })
for (let i = 0; i < 4; i += 1) URN.push({ id: 'b' + i, label: S5.card.black, good: true })
for (let i = 0; i < 3; i += 1) URN.push({ id: 'w' + i, label: S5.card.white })
const URN_ANS = URN.filter((c) => c.good).map((c) => c.id)

// Граничные случаи экрана 7: красного шара нет вовсе.
const BOX = []
for (let i = 0; i < 4; i += 1) BOX.push({ id: 'w' + i, label: S5.card.white })
for (let i = 0; i < 6; i += 1) BOX.push({ id: 'b' + i, label: S5.card.black })

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

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Карточки ЗАКРЫТЫ: исходы есть, но их ещё не выложили. Прогноз
        // делается до того, как стало видно, сколько их.
        fig={() => <Scene fig={<Bag step={0} cards={COINS} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.2}>
        <Col>
          <Scene fig={<Bag step={1} cards={COINS} />} max={300} />
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
      /* Карточки выкладываются ПОШТУЧНО. Весь урок держится на этом кадре:
         `ГЧ` и `ЧГ` лежат отдельно, и «исходов три» падает само. */
      <Scene fig={<Bag step={1} cards={COINS} />} note={<NoteList items={S3.show[phase]} />} />
    ) : (
      <BagPick
        prompt={S3.pick.prompt}
        cards={COINS.map((c) => ({ id: c.id, label: c.label }))}
        answer={COIN_ANS}
        okText={S3.pick.ok}
        wrongText={S3.pick.bad}
        run={{ n: 200 }}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* СВИДЕТЕЛЬ УРОКА. Кадр 1 -- короткая серия, кадр 2 -- длинная. Дробь
         на обоих одна и та же: она посчитана до опыта и опытом не двигается. */
      <Scene
        fig={(
          <Bag
            step={3} cards={COINS}
            trials={phase === 0 ? { n: 10, hits: 6 } : { n: 200, hits: 103 }}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
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
      <Scene fig={<Bag step={1} cards={URN} />} note={<NoteList items={S5.show[phase]} />} />
    ) : (
      <BagPick
        prompt={S5.pick.prompt}
        cards={URN.map((c) => ({ id: c.id, label: c.label }))}
        answer={URN_ANS}
        okText={S5.pick.ok}
        wrongText={S5.pick.bad}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="big">{phase === 0 ? S6.frameA : S6.frameB}</Expr>
          </Panel>
        </Col>
        <Col><NoteList items={S6.show[phase]} /></Col>
      </Cols>
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <NoteList items={[S6.frameA, { ok: true, v: S6.work.expr }]} />
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
      /* Ни одна карточка не подсвечена: благоприятных нет. Это и есть ноль. */
      <Scene fig={<Bag step={phase === 0 ? 1 : 3} cards={BOX} />} note={<NoteList items={S7.show[phase]} />} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Bag step={3} cards={BOX} />} max={300} /></Col>
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
        // Опыт встаёт рядом с дробью в момент ответа: правило открывается
        // вместе со свидетелем, который его и подтвердил.
        fig={(solved) => (
          <Scene
            fig={<Bag step={3} cards={COINS} trials={solved ? { n: 200, hits: 103 } : null} />}
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
            fig={<Bag step={round >= 1 ? 3 : 1} cards={COINS} trials={round >= 3 ? { n: 200, hits: 103 } : null} />}
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
