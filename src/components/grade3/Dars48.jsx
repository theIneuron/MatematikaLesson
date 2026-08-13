import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars48 — "Murakkab masalalar" (num-3-48) | Б6 «O'LCHOVLAR»
// Syujet: Lumo shahri (reja 53-satr). SAHNA: 1-DARSNING shahri, tugun — masala rejasi.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, masalalar boblari).
// YADRO: murakkab masalada javob BIRDANIGA topilmaydi. Avval oraliq son topiladi, keyin
//   savolga javob beriladi. Reja: nima ma'lum, nimani avval topamiz, nimani keyin.
// Misconception: M1 birinchi amalning natijasini javob deb yozish; M2 shartdan noto'g'ri
//   sonni olish; M3 amallar tartibini almashtirish; M4 savolga javob yozmaslik.
// FactCard: eski masala kitoblarida masalalar SHE'R bilan yozilgan — yodlash oson bo'lsin deb.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-48',
  lessonTitle: { ru: 'Урок 48. Составные задачи', uz: '48-dars. Murakkab masalalar', en: 'Lesson 48. Compound problems' }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'diagnostic' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Составные задачи', uz: 'Murakkab masalalar', en: 'Compound problems' },
    lead: { ru: 'В корзине 8 кристаллов, во второй в 3 раза больше', uz: "Savatda 8 kristall, ikkinchisida 3 marta ko'p", en: 'A basket has 8 crystals, the second has 3 times more' },
    order_cap: { ru: 'спрашивают про обе вместе', uz: "ikkalasi haqida birga so'ralgan", en: 'the question is about both together' },
    plate: ['8', '·', '3'],
    q: { ru: 'Можно ли ответить одним действием?', uz: "Bitta amal bilan javob berib bo'ladimi?", en: 'Can it be answered in one step?' },
    opt0: { ru: 'нет, нужно два', uz: "yo'q, ikkita kerak", en: 'no, two are needed' },
    opt1: { ru: 'да, одним', uz: 'ha, bittasi bilan', en: 'yes, in one' },
    opt2: { ru: 'ответ уже есть', uz: 'javob allaqachon bor', en: 'the answer is there already' },
    opt3: { ru: 'данных не хватает', uz: "ma'lumot yetmaydi", en: 'there is not enough data' },
    audio: {
      intro: {
        ru: [
          'Уравнения позади. Теперь возьмёмся за задачи, где одного действия мало.',
          'В первой корзине восемь кристаллов, во второй в три раза больше.',
          'А спрашивают, сколько кристаллов в обеих корзинах вместе.',
          'Как думаешь, можно ли ответить одним действием?'
        ],
        uz: [
          "Tenglamalar ortda qoldi. Endi bitta amal yetmaydigan masalalarga o'tamiz.",
          "Birinchi savatda sakkiz kristall, ikkinchisida uch marta ko'p.",
          "So'ralgani esa ikkala savatda jami nechta kristall borligi.",
          "Sizningcha, bitta amal bilan javob berib bo'ladimi?"
        ],
        en: ['Equations are behind us. Now let us take problems where one step is not enough.', 'The first basket has eight crystals, the second three times more.', 'And the question is how many crystals there are in both baskets together.', 'Do you think it can be answered in one step?']
      },
      on_correct: { ru: 'Верно! Сначала надо узнать вторую корзину, и только потом складывать.', uz: "To'g'ri! Avval ikkinchi savatni bilish kerak, keyin esa qo'shish.", en: 'Right! First we have to find the second basket, and only then add.' },
      on_wrong1: { ru: 'Одним не выйдет. Во второй корзине число пока неизвестно.', uz: "Bittasi bilan chiqmaydi. Ikkinchi savatdagi son hali noma'lum.", en: 'One will not do. The number in the second basket is not known yet.' },
      on_wrong2: { ru: 'Восемь это только первая корзина.', uz: "Sakkiz bu faqat birinchi savat.", en: 'Eight is only the first basket.' },
      on_idk: { ru: 'Ничего. Сейчас составим план и решим.', uz: "Hechqisi yo'q. Hozir reja tuzib, yechamiz.", en: 'Never mind. Let us make a plan and solve it.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Составляем план решения', uz: 'Yechish rejasini tuzamiz', en: 'We make a plan of the solution' },
    task_line: '8 и в 3 раза больше',
    task_line_uz: "8 va 3 marta ko'p",
    task_line_en: '8 and 3 times more',
    step1: '8 · 3 = 24',
    step1_cap: { ru: 'первое действие: вторая корзина', uz: 'birinchi amal: ikkinchi savat', en: 'first step: the second basket' },
    step2: '8 + 24 = 32',
    step2_cap: { ru: 'второе действие: ответ', uz: 'ikkinchi amal: javob', en: 'second step: the answer' },
    res: { ru: 'ответ 32 кристалла', uz: 'javob 32 kristall', en: 'the answer is 32 crystals' },
    btn1: { ru: 'Найти вторую корзину', uz: 'Ikkinchi savatni topish', en: 'Find the second basket' },
    btn2: { ru: 'Ответить на вопрос', uz: 'Savolga javob berish', en: 'Answer the question' },
    done_text: { ru: 'Первое действие готовит второе, а ответом становится только последнее число.', uz: "Birinchi amal ikkinchisini tayyorlaydi, javob esa faqat oxirgi son bo'ladi.", en: 'The first step prepares the second, and only the last number becomes the answer.' },
    audio: {
      ru: [
        'Решение начинается с плана, а не с вычислений.',
        'Первое действие. Во второй корзине в три раза больше, значит восемь умножить на три, двадцать четыре.',
        'Второе действие. Теперь известны обе корзины, складываем. Восемь плюс двадцать четыре, тридцать два. Вот это и есть ответ на вопрос.'
      ],
      uz: [
        "Yechish hisobdan emas, rejadan boshlanadi.",
        "Birinchi amal. Ikkinchi savatda uch marta ko'p, demak sakkizni uchga ko'paytiramiz, yigirma to'rt.",
        "Ikkinchi amal. Endi ikkala savat ham ma'lum, qo'shamiz. Sakkiz qo'shuv yigirma to'rt, o'ttiz ikki. Mana shu savolga javob."
      ],
      en: ['A solution begins with a plan, not with working out.', 'The first step. The second basket has three times more, so eight times three, twenty four.', 'The second step. Now both baskets are known, we add them. Eight plus twenty four, thirty two. And that is the answer to the question.']
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 4,
    h: 4,
    lead: { ru: 'Вопрос решает, где остановиться', uz: "Qayerda to'xtashni savol hal qiladi", en: 'The question decides where to stop' },
    capA: { ru: 'спросили про вторую — ответ 24', uz: "ikkinchisi so'ralsa — javob 24", en: 'asked about the second — the answer is 24' },
    capB: { ru: 'спросили про обе — ответ 32', uz: "ikkalasi so'ralsa — javob 32", en: 'asked about both — the answer is 32' },
    res: { ru: 'считаем до вопроса', uz: 'savolgacha sanaymiz', en: 'we count up to the question' },
    btn1: { ru: 'Спросить про вторую', uz: "Ikkinchisi haqida so'rash", en: 'Ask about the second' },
    btn2: { ru: 'Спросить про обе', uz: "Ikkalasi haqida so'rash", en: 'Ask about both' },
    done_text: { ru: 'Одно и то же условие даёт разные ответы, потому что вопросы разные.', uz: "Bitta shart har xil javob beradi, chunki savollar har xil.", en: 'The very same conditions give different answers, because the questions are different.' },
    audio: {
      ru: [
        'Условие мы уже разобрали. Теперь посмотрим на вопрос.',
        'Если спрашивают только про вторую корзину, ответом будет двадцать четыре, и второе действие не нужно.',
        'А если спрашивают про обе вместе, останавливаться на двадцати четырёх нельзя. Нужно ещё сложить. Поэтому вопрос читают до конца и только потом считают.'
      ],
      uz: [
        "Shartni ko'rib chiqdik. Endi savolga qaraymiz.",
        "Faqat ikkinchi savat so'ralsa, javob yigirma to'rt bo'ladi va ikkinchi amal kerak emas.",
        "Ikkalasi birga so'ralsa, yigirma to'rtda to'xtab bo'lmaydi. Yana qo'shish kerak. Shuning uchun savol oxirigacha o'qiladi, keyin hisoblanadi."
      ],
      en: ['We have sorted out the conditions. Now let us look at the question.', 'If the question is only about the second basket, the answer will be twenty four, and the second step is not needed.', 'And if the question is about both together, we cannot stop at twenty four. We still have to add. So the question is read to the end and only then do we count.']
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'С чего начинают решение составной задачи?', uz: 'Murakkab masalani yechish nimadan boshlanadi?', en: 'How do we begin solving a compound problem?' },
    opts: [
      { ru: 'с плана действий', uz: 'amallar rejasidan', en: 'with a plan of the steps' },
      { ru: 'со сложения чисел', uz: "sonlarni qo'shishdan", en: 'by adding the numbers' },
      { ru: 'с последнего числа', uz: 'oxirgi sondan', en: 'with the last number' },
      { ru: 'с записи ответа', uz: 'javobni yozishdan', en: 'by writing the answer' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Складывать пока нечего. Одно число ещё неизвестно.', uz: "Hozircha qo'shadigan narsa yo'q. Bitta son hali noma'lum.", en: 'There is nothing to add yet. One number is still unknown.' },
      2: { ru: 'Числа берут не подряд, а по плану.', uz: "Sonlar ketma-ket emas, reja bo'yicha olinadi.", en: 'The numbers are not taken in order but by the plan.' },
      3: { ru: 'Ответ пишут в конце, а не в начале.', uz: "Javob boshida emas, oxirida yoziladi.", en: 'The answer is written at the end, not at the beginning.' }
    },
    on_correct: { ru: 'Верно. Сначала план, потом вычисления.', uz: "To'g'ri. Avval reja, keyin hisob.", en: 'Right. First the plan, then the working out.' },
    rule_lines: {
      ru: ['что известно', 'что найдём первым действием', 'что ответит на вопрос'],
      uz: ["nima ma'lum", "birinchi amalda nimani topamiz", "savolga nima javob beradi"],
      en: ['what is known', 'what the first step will find', 'what will answer the question']
    },
    rule_ex: { ru: '8 · 3 = 24, потом 8 + 24 = 32', uz: '8 · 3 = 24, keyin 8 + 24 = 32', en: '8 · 3 = 24, then 8 + 24 = 32' },
    rule_speech: { ru: 'Составную задачу решают по плану. Сначала отвечают, что известно, потом что найдут первым действием, и только потом считают. Ответом становится то число, которое отвечает на вопрос задачи.', uz: "Murakkab masala reja bo'yicha yechiladi. Avval nima ma'lum ekani, keyin birinchi amalda nima topilishi aytiladi, shundan so'ng hisoblanadi. Javob bo'lib masala savoliga javob beradigan son olinadi.", en: 'A compound problem is solved by a plan. First you say what is known, then what the first step will find, and only then you count. The answer is the number that answers the question of the problem.' },
    audio: {
      intro: { ru: 'Соберём правило. Мы решили задачу в два шага.', uz: "Qoidani yig'amiz. Masalani ikki qadamda yechdik.", en: 'Let us gather the rule. We solved the problem in two steps.' }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'У Рано 5 марок, у Анвара на 4 больше. Сколько у обоих?', uz: "Ra'noda 5 marka, Anvarda 4 ta ko'p. Ikkalasida qancha?", en: 'Rano has 5 stamps, Anvar has 4 more. How many do they both have?' },
    fig_w: 5,
    fig_h: 2,
    opts: [
      { ru: '14', uz: '14', en: '14' },
      { ru: '9', uz: '9', en: '9' },
      { ru: '4', uz: '4', en: '4' },
      { ru: '20', uz: '20', en: '20' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Девять это только у Анвара, а спрашивают про обоих.', uz: "To'qqiz bu faqat Anvarda, so'ralgani esa ikkalasi.", en: 'Nine is only what Anvar has, and the question is about both.' },
      2: { ru: 'Четыре это разница, а не ответ.', uz: "To'rt bu farq, javob emas.", en: 'Four is the difference, not the answer.' },
      3: { ru: 'Двадцать это слишком много, посчитай ещё раз.', uz: "Yigirma juda ko'p, qaytadan sanang.", en: 'Twenty is too many, count again.' }
    },
    audio: {
      intro: { ru: 'Посмотри на схему. У Рано пять марок, у Анвара на четыре больше. Сколько марок у обоих?', uz: "Chizmaga qarang. Ra'noda beshta marka, Anvarda to'rtta ko'p. Ikkalasida nechta marka bor?", en: 'Look at the diagram. Rano has five stamps, Anvar has four more. How many stamps do they both have?' },
      on_correct: { ru: 'Верно. Сначала девять у Анвара, потом пять и девять вместе.', uz: "To'g'ri. Avval Anvarda to'qqizta, keyin besh va to'qqiz birga.", en: 'Right. First nine for Anvar, then five and nine together.' },
      on_wrong: { ru: 'Первое действие даёт марки Анвара, второе отвечает на вопрос.', uz: "Birinchi amal Anvarning markasini beradi, ikkinchisi savolga javob beradi.", en: "The first step gives Anvar's stamps, the second answers the question." }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи задачи по числу действий', uz: 'Masalalarni amallar soniga qarab ajrating', en: 'Sort the problems by the number of steps' },
    bin_a: { ru: 'одно действие', uz: 'bitta amal', en: 'one step' },
    bin_b: { ru: 'два действия', uz: 'ikkita amal', en: 'two steps' },
    items: [
      { n: { ru: 'было 12, отдали 5', uz: '12 ta edi, 5 tasi berildi', en: 'there were 12, 5 were given away' }, a: true, hint: { ru: 'Всё известно, одно вычитание.', uz: "Hammasi ma'lum, bitta ayirish.", en: 'Everything is known, one subtraction.' } },
      { n: { ru: 'было 12, отдали 5, потом ещё 3', uz: '12 ta edi, 5 tasi, keyin yana 3 tasi berildi', en: 'there were 12, 5 were given away, then 3 more' }, a: false, hint: { ru: 'Два раза отдавали, значит два шага.', uz: "Ikki marta berilgan, demak ikki qadam.", en: 'They gave away twice, so two steps.' } },
      { n: { ru: '6 коробок по 4', uz: '4 tadan 6 quti', en: '6 boxes of 4' }, a: true, hint: { ru: 'Одно умножение и всё.', uz: "Bitta ko'paytirish va tamom.", en: 'One multiplication and that is all.' } },
      { n: { ru: '6 коробок по 4, увезли 10', uz: "4 tadan 6 quti, 10 tasi olib ketildi", en: '6 boxes of 4, 10 were taken away' }, a: false, hint: { ru: 'Сначала найти всё, потом вычесть.', uz: "Avval hammasini topish, keyin ayirish.", en: 'First find them all, then subtract.' } }
    ],
    audio: {
      intro: { ru: 'Четыре задачи. Отправь каждую в свою корзину.', uz: "To'rtta masala. Har birini o'z savatiga yuboring.", en: 'Four problems. Send each one to its basket.' },
      on_correct: { ru: 'Всё на месте. Если в условии есть скрытое число, действий будет два.', uz: "Hammasi joyida. Shartda yashiringan son bo'lsa, amal ikkita bo'ladi.", en: 'All in place. If the conditions hide a number, there will be two steps.' },
      on_wrong: { ru: 'Проверь, все ли числа для ответа уже известны.', uz: "Javob uchun hamma son ma'lummi, tekshiring.", en: 'Check whether all the numbers for the answer are already known.' }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Было 40 кристаллов, увезли 3 ящика по 6. Сколько осталось?', uz: "40 ta kristall bor edi, 6 tadan 3 yashik olib ketildi. Nechtasi qoldi?", en: 'There were 40 crystals, 3 boxes of 6 were taken away. How many are left?' },
    opts: [
      { ru: '22', uz: '22', en: '22' },
      { ru: '18', uz: '18', en: '18' },
      { ru: '34', uz: '34', en: '34' },
      { ru: '31', uz: '31', en: '31' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Восемнадцать это то, что увезли, а спрашивают про остаток.', uz: "O'n sakkiz bu olib ketilgani, so'ralgani esa qoldiq.", en: 'Eighteen is what was taken away, and the question is about what is left.' },
      2: { ru: 'Тридцать четыре получится, если вычесть только шесть.', uz: "O'ttiz to'rt faqat oltini ayirsangiz chiqadi.", en: 'Thirty four comes out if you subtract only six.' },
      3: { ru: 'Тридцать один получится, если вычесть девять.', uz: "O'ttiz bir to'qqizni ayirsangiz chiqadi.", en: 'Thirty one comes out if you subtract nine.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Было сорок, увезли три ящика по шесть. Сколько осталось?', uz: "Tez savol. Qirqta edi, oltitadan uch yashik olib ketildi. Nechtasi qoldi?", en: 'A quick question. There were forty, three boxes of six were taken away. How many are left?' },
      on_correct: { ru: 'Верно. Сначала восемнадцать увезли, потом сорок минус восемнадцать.', uz: "To'g'ri. Avval o'n sakkiztasi olib ketildi, keyin qirq ayirish o'n sakkiz.", en: 'Right. First eighteen were taken away, then forty minus eighteen.' },
      on_wrong: { ru: 'Первым действием найди, сколько увезли.', uz: "Birinchi amalda qanchasi olib ketilganini toping.", en: 'With the first step find how many were taken away.' }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Было 40, увезли 3 ящика по 6', uz: "40 ta edi, 6 tadan 3 yashik olib ketildi", en: 'There were 40, 3 boxes of 6 were taken away' },
    swap_line: { ru: 'было 40', uz: '40 edi', en: 'there were 40' },
    cells: [
      { head: { ru: 'увезли', uz: 'olib ketildi', en: 'taken away' }, label: '3 · 6', ans: 18, hint: { ru: 'Три ящика по шесть штук.', uz: "Oltitadan uch yashik.", en: 'Three boxes of six pieces.' } },
      { head: { ru: 'было', uz: 'bor edi', en: 'there were' }, label: { ru: 'штук', uz: 'dona', en: 'pieces' }, ans: 40, hint: { ru: 'Это число дано в условии.', uz: 'Bu son shartda berilgan.', en: 'That number is given in the problem.' } },
      { head: { ru: 'осталось', uz: 'qoldi', en: 'left' }, label: '40 − 18', ans: 22, hint: { ru: 'Из того, что было, вычти увезённое.', uz: "Bor bo'lganidan olib ketilganini ayiring.", en: 'Take what was taken away from what there was.' } }
    ],
    check: { ru: '18 увезли, 22 осталось', uz: '18 tasi olib ketildi, 22 tasi qoldi', en: '18 taken away, 22 left' },
    check_label: { ru: 'два действия', uz: 'ikki amal', en: 'two steps' },
    audio: {
      intro: { ru: 'Заполни три окна. Сколько увезли, сколько было и сколько осталось.', uz: "Uchta oynani to'ldiring. Qancha olib ketildi, qancha bor edi va qancha qoldi.", en: 'Fill three windows. How many were taken away, how many there were and how many are left.' },
      on_correct: { ru: 'Увезли восемнадцать, осталось двадцать два. Первое действие подготовило второе.', uz: "O'n sakkiztasi olib ketildi, yigirma ikkitasi qoldi. Birinchi amal ikkinchisini tayyorladi.", en: 'Eighteen were taken away, twenty two are left. The first step prepared the second.' }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Спросили про остаток, а в ответ записали 18. Где ошибка?', uz: "Qoldiq so'ralgan, javobga esa 18 yozilibdi. Xato qayerda?", en: 'The question was about what is left, and 18 was written as the answer. Where is the mistake?' },
    fig_line: '3 · 6 = 18',
    opts: [
      { ru: 'ответили первым действием', uz: 'birinchi amal bilan javob berilgan', en: 'they answered with the first step' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'неверно умножили', uz: "noto'g'ri ko'paytirilgan", en: 'the multiplying was wrong' },
      { ru: 'взяли не те числа', uz: "sonlar noto'g'ri olingan", en: 'the wrong numbers were taken' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Восемнадцать это увезённое, а спрашивали про остаток.', uz: "O'n sakkiz bu olib ketilgani, so'ralgani esa qoldiq.", en: 'Eighteen is what was taken away, and the question was about what is left.' },
      2: { ru: 'Умножение верное, три на шесть это восемнадцать.', uz: "Ko'paytirish to'g'ri, uchga olti o'n sakkiz.", en: 'The multiplying is right, three times six is eighteen.' },
      3: { ru: 'Числа из условия взяты правильно.', uz: "Shartdagi sonlar to'g'ri olingan.", en: 'The numbers from the problem were taken correctly.' }
    },
    audio: {
      intro: { ru: 'Кто-то остановился на первом действии. Найди ошибку.', uz: "Kimdir birinchi amalda to'xtab qolibdi. Xatoni toping.", en: 'Someone stopped at the first step. Find the mistake.' },
      on_correct: { ru: 'Верно. Первое действие только подготовка, отвечает второе.', uz: "To'g'ri. Birinchi amal faqat tayyorgarlik, javobni ikkinchisi beradi.", en: 'Right. The first step is only preparation, the second one answers.' },
      on_wrong: { ru: 'Перечитай вопрос и посмотри, на что отвечает восемнадцать.', uz: "Savolni qayta o'qing va o'n sakkiz nimaga javob berishiga qarang.", en: 'Read the question again and see what eighteen answers.' }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит решает задачу по порядку чисел', uz: 'Bit masalani sonlar tartibi bo\'yicha yechyapti', en: 'Bit is solving the problem in the order of the numbers' },
    lines: ['было 40, увезли 3 ящика по 6', 'Бит: беру числа подряд, 40 − 3 = 37, потом 37 − 6 = 31'],
    lines_uz: ["40 ta edi, 6 tadan 3 yashik olib ketildi", "Bit: sonlarni ketma-ket olaman, 40 − 3 = 37, keyin 37 − 6 = 31"],
    lines_en: ['there were 40, 3 boxes of 6 were taken away', 'Bit: I take the numbers in order, 40 − 3 = 37, then 37 − 6 = 31'],
    line_cap: { ru: 'Бит: считаю в порядке записи', uz: 'Bit: yozilish tartibida hisoblayman', en: 'Bit: I count in the order they are written' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, числа берут по смыслу', 'да, порядок записи главный'], uz: ["yo'q, sonlar ma'nosiga qarab olinadi", 'ha, yozilish tartibi asosiy'], en: ['no, the numbers are taken by their meaning', 'yes, the order they are written in is what matters'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Тройка это число ящиков, а не кристаллов. Её нельзя вычитать из сорока. Сначала три умножают на шесть и получают восемнадцать, и только это число вычитают.', uz: "Ha. Uchlik bu yashiklar soni, kristallar emas. Uni qirqdan ayirib bo'lmaydi. Avval uchni oltiga ko'paytirib, o'n sakkiz olinadi va faqat shu son ayiriladi.", en: 'Yes. The three is the number of boxes, not of crystals. It cannot be taken away from forty. First three is multiplied by six and gives eighteen, and only that number is subtracted.' },
    trap_wrong: { ru: 'Спроси себя, что означает тройка в условии.', uz: "O'zingizdan so'rang, shartdagi uchlik nimani anglatadi.", en: 'Ask yourself what the three means in the problem.' },
    audio: {
      ru: [
        'Бит решает задачу про кристаллы.',
        'Беру числа по порядку. Сорок минус три, тридцать семь. Потом минус шесть, тридцать один.',
        'Так ли это?'
      ],
      uz: [
        "Bit kristallar haqidagi masalani yechyapti.",
        "Sonlarni tartib bilan olaman. Qirq ayirish uch, o'ttiz yetti. Keyin ayirish olti, o'ttiz bir.",
        "Shundaymi?"
      ],
      en: ['Bit is solving the problem about the crystals.', 'I take the numbers in order. Forty minus three, thirty seven. Then minus six, thirty one.', 'Is that so?']
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'В первой корзине 7 кристаллов, во второй в 2 раза больше. Сколько в обеих?', uz: "Birinchi savatda 7 kristall, ikkinchisida 2 marta ko'p. Ikkalasida qancha?", en: 'The first basket has 7 crystals, the second 2 times more. How many are in both?' },
    ans: 21,
    check: '7 · 2 = 14, 7 + 14',
    check_label: { ru: 'два действия', uz: 'ikki amal', en: 'two steps' },
    hint: { ru: 'Сначала вторую корзину, потом обе вместе.', uz: "Avval ikkinchi savatni, keyin ikkalasini birga.", en: 'First the second basket, then both together.' },
    audio: {
      intro: { ru: 'Теперь считай сам. В первой семь, во второй в два раза больше. Сколько в обеих?', uz: "Endi o'zingiz hisoblang. Birinchisida yetti, ikkinchisida ikki marta ko'p. Ikkalasida qancha?", en: 'Now count on your own. The first has seven, the second two times more. How many are in both?' },
      on_correct: { ru: 'Двадцать один кристалл.', uz: "Yigirma bitta kristall.", en: 'Twenty one crystals.' }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Купили 5 коробок по 6 кристаллов, 12 отдали. Сколько осталось?', uz: "6 tadan 5 quti sotib olindi, 12 tasi berildi. Nechtasi qoldi?", en: '5 boxes of 6 crystals were bought, 12 were given away. How many are left?' },
    ans: 18,
    check: '5 · 6 = 30, 30 − 12',
    check_label: { ru: 'сначала всё, потом остаток', uz: 'avval hammasi, keyin qoldiq', en: 'first the whole lot, then what is left' },
    hint: { ru: 'Сначала найди, сколько купили всего.', uz: "Avval jami qancha sotib olinganini toping.", en: 'First find how many were bought in all.' },
    audio: {
      intro: { ru: 'Купили пять коробок по шесть, двенадцать отдали. Сколько осталось?', uz: "Oltitadan besh quti sotib olindi, o'n ikkitasi berildi. Nechtasi qoldi?", en: 'Five boxes of six were bought, twelve were given away. How many are left?' },
      on_correct: { ru: 'Восемнадцать кристаллов.', uz: "O'n sakkizta kristall.", en: 'Eighteen crystals.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Три действия подряд', uz: 'Ketma-ket uch amal', en: 'Three steps in a row' },
    q: { ru: 'В мастерской 9 полок по 4 кристалла. Забрали 2 полки. Сколько кристаллов осталось и сколько это полок?', uz: "Ustaxonada 4 tadan 9 javon bor. 2 ta javon olindi. Nechta kristall qoldi va bu nechta javon?", en: 'The workshop has 9 shelves of 4 crystals. 2 shelves were taken. How many crystals are left and how many shelves is that?' },
    q_speech: { ru: 'в мастерской девять полок по четыре кристалла, забрали две полки. Сколько кристаллов осталось и сколько это полок?', uz: "ustaxonada to'rttadan to'qqiz javon bor, ikkita javon olindi. Nechta kristall qoldi va bu nechta javon?", en: 'the workshop has nine shelves of four crystals, two shelves were taken. How many crystals are left and how many shelves is that?' },
    tbl_heads: [
      { ru: 'полок', uz: 'javon', en: 'shelves' },
      { ru: 'на полке', uz: 'javonda', en: 'on a shelf' },
      { ru: 'забрали', uz: 'olindi', en: 'taken' }
    ],
    tbl_cells: ['9', '4', '2'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: '9 · 4', uz: '9 · 4', en: '9 · 4' },
      { ru: '9 − 2', uz: '9 − 2', en: '9 − 2' },
      { ru: '4 · 2', uz: '4 · 2', en: '4 · 2' },
      { ru: '9 + 4', uz: '9 + 4', en: '9 + 4' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Так найдутся полки, а спрашивают сначала про кристаллы.', uz: "Bunda javonlar topiladi, avval esa kristallar so'ralgan.", en: 'That would find the shelves, and the first question is about crystals.' },
      2: { ru: 'Так найдётся забранное, но не всё количество.', uz: "Bunda olingani topiladi, butun soni emas.", en: 'That would find what was taken, but not the whole amount.' },
      3: { ru: 'Полки и кристаллы не складывают.', uz: "Javon va kristall qo'shilmaydi.", en: 'Shelves and crystals are not added.' }
    },
    pick_ok: { ru: 'Верно. Сначала все кристаллы, потом остаток.', uz: "To'g'ri. Avval hamma kristall, keyin qoldiq.", en: 'Right. First all the crystals, then what is left.' },
    step1_q: { ru: 'Сколько кристаллов осталось?', uz: 'Nechta kristall qoldi?', en: 'How many crystals are left?' },
    ans1: 28,
    hint1: { ru: 'Всего тридцать шесть, забрали восемь.', uz: "Jami o'ttiz olti, sakkiztasi olindi.", en: 'Thirty six in all, eight were taken.' },
    step2_q: { ru: 'Сколько это полок?', uz: 'Bu nechta javon?', en: 'How many shelves is that?' },
    ans2: 7,
    hint2: { ru: 'Раздели остаток на четыре.', uz: "Qoldiqni to'rtga bo'ling.", en: 'Divide what is left by four.' },
    check: '36 − 8 = 28, 28 : 4 = 7',
    setup_audio: { ru: 'В мастерской считают кристаллы. Посмотри на таблицу и реши, с чего начать.', uz: "Ustaxonada kristallar hisoblanmoqda. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'The crystals in the workshop are being counted. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Девять полок по четыре кристалла, забрали две полки. Сколько осталось и сколько это полок?', uz: "To'rttadan to'qqiz javon, ikkita javon olindi. Qancha qoldi va bu nechta javon?", en: 'Nine shelves of four crystals, two shelves were taken. How many are left and how many shelves is that?' },
      on_correct: { ru: 'Осталось двадцать восемь кристаллов, а это семь полок.', uz: "Yigirma sakkizta kristall qoldi, bu esa yettita javon.", en: 'Twenty eight crystals are left, and that is seven shelves.' },
      on_wrong: { ru: 'Сначала посчитай все кристаллы, потом убери забранное.', uz: "Avval hamma kristallni sanang, keyin olinganini olib tashlang.", en: 'First count all the crystals, then take away what was taken.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задачи. Дочитывай вопрос до конца', uz: "Uchta masala. Savolni oxirigacha o'qing", en: 'Three problems. Read the question to the end' },
    items: [
      {
        kind: 'num',
        q: { ru: 'У Зухры 6 книг, у Жасура в 3 раза больше. Сколько у обоих?', uz: "Zuhrada 6 kitob, Jasurda 3 marta ko'p. Ikkalasida qancha?", en: 'Zuhra has 6 books, Jasur has 3 times more. How many do they both have?' },
        q_speech: { ru: 'у Зухры шесть книг, у Жасура в три раза больше. Сколько книг у обоих?', uz: "Zuhrada oltita kitob, Jasurda uch marta ko'p. Ikkalasida nechta kitob bor?", en: 'Zuhra has six books, Jasur has three times more. How many books do they both have?' },
        ans: 24,
        hint: { ru: 'Сначала книги Жасура, потом обе стопки.', uz: "Avval Jasurning kitobi, keyin ikkala uyum.", en: "First Jasur's books, then both piles." }
      },
      {
        kind: 'num',
        q: { ru: 'Было 50 кристаллов, увезли 4 ящика по 7. Сколько осталось?', uz: "50 ta kristall bor edi, 7 tadan 4 yashik olib ketildi. Nechtasi qoldi?", en: 'There were 50 crystals, 4 boxes of 7 were taken away. How many are left?' },
        q_speech: { ru: 'было пятьдесят кристаллов, увезли четыре ящика по семь. Сколько осталось?', uz: "ellikta kristall bor edi, yettitadan to'rt yashik olib ketildi. Nechtasi qoldi?", en: 'there were fifty crystals, four boxes of seven were taken away. How many are left?' },
        ans: 22,
        hint: { ru: 'Сначала найди, сколько увезли.', uz: "Avval qancha olib ketilganini toping.", en: 'First find how many were taken away.' }
      },
      {
        kind: 'num',
        q: { ru: 'В 8 коробках по 5 кристаллов, добавили ещё 10. Сколько стало?', uz: "8 qutida 5 tadan kristall bor, yana 10 ta qo'shildi. Nechta bo'ldi?", en: '8 boxes have 5 crystals each, 10 more were added. How many are there now?' },
        q_speech: { ru: 'в восьми коробках по пять кристаллов, добавили ещё десять. Сколько стало?', uz: "sakkiz qutida beshtadan kristall bor, yana o'nta qo'shildi. Nechta bo'ldi?", en: 'eight boxes have five crystals each, ten more were added. How many are there now?' },
        ans: 50,
        hint: { ru: 'Сначала все коробки, потом добавка.', uz: "Avval hamma quti, keyin qo'shimcha.", en: 'First all the boxes, then what was added.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'В старинных учебниках задачи часто писали стихами. Так их было легче запомнить наизусть, ведь книги стоили дорого и одна книга была на весь класс. Ученик заучивал условие, а потом решал его в уме, шаг за шагом.',
      uz: "Qadimgi darsliklarda masalalar ko'pincha she'r bilan yozilgan. Shunda ularni yod olish oson bo'lgan, chunki kitob qimmat edi va butun sinfga bitta kitob to'g'ri kelardi. O'quvchi shartni yodlab, keyin uni qadamma-qadam xayolan yechardi.",
      en: 'In old textbooks problems were often written in verse. That made them easier to learn by heart, because books were expensive and one book served the whole class. A pupil learned the problem by heart and then solved it in their head, step by step.'
    },
    fact_audio: {
      ru: 'Вот как учились раньше. Книги стоили дорого, и одна книга приходилась на весь класс. Поэтому задачи часто записывали стихами. Условие в рифму запоминалось с двух-трёх прочтений, и ученик уносил его в голове. Потом он решал задачу в уме, шаг за шагом, ровно так же, как мы сегодня составляем план. Получается, привычка сначала подумать, а потом считать, старше самих тетрадей.',
      uz: "Ilgari mana shunday o'qishgan. Kitob qimmat edi va butun sinfga bitta kitob to'g'ri kelardi. Shuning uchun masalalar ko'pincha she'r bilan yozilgan. Qofiyali shart ikki-uch o'qishda esda qolardi va o'quvchi uni boshida olib ketardi. Keyin masalani xayolan, qadamma-qadam yechardi, xuddi biz bugun reja tuzganimizdek. Demak, avval o'ylab, keyin hisoblash odati daftarlarning o'zidan ham qadimiyroq.",
      en: 'Here is how children learned in the old days. Books were expensive, and one book served the whole class. So problems were often written in verse. A problem in rhyme was remembered after two or three readings, and the pupil carried it away in their head. Then they solved it in their head, step by step, exactly the way we make a plan today. So the habit of thinking first and counting afterwards is older than exercise books themselves.'
    },
    audio: {
      intro: { ru: 'Три задачи напоследок. В каждой сначала план, потом счёт.', uz: "Oxirida uchta masala. Har birida avval reja, keyin hisob.", en: 'Three problems at the end. In each one the plan first, then the counting.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Первое действие только готовит ответ.', uz: "Birinchi amal faqat javobni tayyorlaydi.", en: 'The first step only prepares the answer.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Задачи решены!', uz: 'Masalalar yechildi!', en: 'The problems are solved!' },
    cando: {
      ru: ['составляю план решения', 'нахожу скрытое число первым действием', 'отвечаю именно на вопрос задачи'],
      uz: ["yechish rejasini tuzaman", "yashiringan sonni birinchi amalda topaman", "aynan masala savoliga javob beraman"],
      en: ['I make a plan of the solution', 'I find the hidden number with the first step', 'I answer exactly the question of the problem']
    },
    rule_recap: { ru: 'В составной задаче первое действие готовит ответ, а отвечает последнее.', uz: "Murakkab masalada birinchi amal javobni tayyorlaydi, javobni oxirgisi beradi.", en: 'In a compound problem the first step prepares the answer, and the last one gives it.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 38: выбор величины; урок 47: план решения', uz: "38-dars: kattalik tanlash; 47-dars: yechish rejasi", en: 'lesson 38: choosing the quantity; lesson 47: a plan of the solution' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'неравенства и верные высказывания', uz: 'tengsizliklar va rost mulohazalar', en: 'inequalities and true statements' },
    audio: {
      ru: 'Задачи решены. Запомни главное. В составной задаче не хватает одного числа, и его находят первым действием. Это число не ответ, а только ступенька. Отвечает всегда последнее действие, то самое, которое отвечает на вопрос. И ещё одно. Числа из условия берут не подряд, а по смыслу. Тройка может означать ящики, а не кристаллы, и вычитать её нельзя. В следующий раз возьмём записи со знаками больше и меньше!',
      uz: "Masalalar yechildi. Asosiysini eslab qoling. Murakkab masalada bitta son yetishmaydi va u birinchi amalda topiladi. Bu son javob emas, faqat zina. Javobni har doim oxirgi amal beradi, aynan savolga javob beradigani. Yana bir narsa. Shartdagi sonlar ketma-ket emas, ma'nosiga qarab olinadi. Uchlik yashikni anglatishi mumkin, kristallni emas, uni ayirib bo'lmaydi. Keyingi safar katta va kichik belgili yozuvlarni olamiz!",
      en: 'The problems are solved. Remember the main thing. A compound problem is missing one number, and it is found by the first step. That number is not the answer, only a step on the way. The answer always comes from the last step, the one that answers the question. And one more thing. The numbers from the problem are taken not in order but by their meaning. A three can mean boxes and not crystals, and then it cannot be subtracted. Next time we will take records with the greater than and less than signs!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Составим план.', uz: 'Reja tuzamiz.', en: 'Let us make a plan.' },
  s2:  { ru: 'Теперь про вопрос.', uz: 'Endi savol haqida.', en: 'Now about the question.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай схему.', uz: "Chizmani o'qing.", en: 'Read the diagram.' },
  s5:  { ru: 'Разложи задачи.', uz: 'Masalalarni ajrating.', en: 'Sort the problems.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут ответили слишком рано.', uz: 'Bu yerda juda erta javob berilibdi.', en: 'Here they answered too early.' },
  s9:  { ru: 'А вот и Бит со своим порядком.', uz: "Mana Bit ham o'z tartibi bilan.", en: 'And here is Bit with his order.' },
  s10: { ru: 'Теперь решай сам.', uz: "Endi o'zingiz yeching.", en: 'Now solve it on your own.' },
  s11: { ru: 'И ещё одна задача.', uz: 'Yana bitta masala.', en: 'And one more problem.' },
  s12: { ru: 'Задача в три действия.', uz: 'Uch amalli masala.', en: 'A problem in three steps.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Задачи решены. План оказался важнее скорости счёта.',
  uz: "Masalalar yechildi. Reja hisob tezligidan muhimroq bo'ldi.",
  en: 'The problems are solved. The plan turned out to matter more than fast counting.'
};

// --- SAHNA TUGUNI (D48): 1-DARSNING shahri, ustiga masala rejasi.
const PlanNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(132 96)">
      <rect x="0" y="0" width="138" height="80" rx="6" fill="#FDF6E8" stroke="#8A7550" strokeWidth="2"/>
      <rect x="0" y="0" width="138" height="14" rx="6" fill="#C06A2E"/>
      <text x="69" y="10.5" textAnchor="middle" fontSize="7" letterSpacing="1.4" fill="#FFF3E9" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ПЛАН', 'REJA', 'THE PLAN')}</text>
      {[['1', '8 · 3 = 24'], ['2', '8 + 24 = 32']].map(([n, t], i) => (
        <g key={i} transform={`translate(12 ${32 + i * 22})`}>
          <circle cx="0" cy="-4" r="7" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.4"/>
          <text x="0" y="-1" textAnchor="middle" fontSize="7" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">{n}</text>
          <text x="16" y="0" fontSize="9" fontWeight="800" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{t}</text>
        </g>
      ))}
      <text x="69" y="94" textAnchor="middle" fontSize="7" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ответ в последнем действии', 'javob oxirgi amalda', 'the answer is in the last step')}</text>
    </g>
  </svg>
  );
};

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <LumoCityBg fill/>
      <PlanNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): ikki uyum marka, ikkinchisi to'rtta ko'p.
const StacksFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 240 110" style={{ width: 'min(270px, 85%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(24 20)">
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={i * 16} y="30" width="13" height="18" rx="2" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.4"/>
      ))}
      <text x="40" y="66" textAnchor="middle" fontSize="9" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">5</text>
      <text x="40" y="20" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">Ra'no</text>
    </g>
    <g transform="translate(128 20)">
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={i * 16} y="30" width="13" height="18" rx="2" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="1.4"/>
      ))}
      <rect x="80" y="30" width="13" height="18" rx="2" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="1.4" strokeDasharray="3 2"/>
      <text x="46" y="66" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">5 + 4</text>
      <text x="46" y="20" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'Анвар', 'Anvar', 'Anvar')}</text>
    </g>
    <text x="120" y="104" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{tri(lang, '? всего', '? jami', '? in all')}</text>
  </svg>
  );
};

// --- FACTCARD QAHRAMONI: she'r bilan yozilgan eski masala kitobi.
const VerseFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <path d="M20 18 q40 -10 80 0 v64 q-40 -10 -80 0 Z" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M100 18 q40 -10 80 0 v64 q-40 -10 -80 0 Z" fill="#FDF3E0" stroke="#8A7550" strokeWidth="2" strokeLinejoin="round"/>
    <g stroke="#C9BCA2" strokeWidth="2.4" strokeLinecap="round">
      {[32, 42, 52, 62].map((y, i) => <line key={i} x1="30" y1={y} x2={90 - (i % 2) * 16} y2={y}/>)}
      {[32, 42, 52, 62].map((y, i) => <line key={`b${i}`} x1="110" y1={y} x2={170 - (i % 2) * 16} y2={y}/>)}
    </g>
    <g fill="#C06A2E">
      {[32, 42, 52, 62].map((y, i) => <circle key={i} cx={94 - (i % 2) * 16} cy={y} r="2.6"/>)}
    </g>
    <text x="100" y="98" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'рифма', 'qofiya', 'rhyme')}</text>
  </svg>
  );
};

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: VerseFig,
  figs: { s4: <StacksFig/> }
});
