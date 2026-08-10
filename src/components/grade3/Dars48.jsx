import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang} from './_kit/index.jsx';
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
  lessonId: 'num-3-48',
  lessonTitle: { ru: 'Урок 48. Составные задачи', uz: '48-dars. Murakkab masalalar' }
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
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Составные задачи', uz: 'Murakkab masalalar' },
    lead: { ru: 'В корзине 8 кристаллов, во второй в 3 раза больше', uz: "Savatda 8 kristall, ikkinchisida 3 marta ko'p" },
    order_cap: { ru: 'спрашивают про обе вместе', uz: "ikkalasi haqida birga so'ralgan" },
    plate: ['8', '·', '3'],
    q: { ru: 'Можно ли ответить одним действием?', uz: "Bitta amal bilan javob berib bo'ladimi?" },
    opt0: { ru: 'нет, нужно два', uz: "yo'q, ikkita kerak" },
    opt1: { ru: 'да, одним', uz: 'ha, bittasi bilan' },
    opt2: { ru: 'ответ уже есть', uz: 'javob allaqachon bor' },
    opt3: { ru: 'данных не хватает', uz: "ma'lumot yetmaydi" },
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
        ]
      },
      on_correct: { ru: 'Верно! Сначала надо узнать вторую корзину, и только потом складывать.', uz: "To'g'ri! Avval ikkinchi savatni bilish kerak, keyin esa qo'shish." },
      on_wrong1: { ru: 'Одним не выйдет. Во второй корзине число пока неизвестно.', uz: "Bittasi bilan chiqmaydi. Ikkinchi savatdagi son hali noma'lum." },
      on_wrong2: { ru: 'Восемь это только первая корзина.', uz: "Sakkiz bu faqat birinchi savat." },
      on_idk: { ru: 'Ничего. Сейчас составим план и решим.', uz: "Hechqisi yo'q. Hozir reja tuzib, yechamiz." }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Составляем план решения', uz: 'Yechish rejasini tuzamiz' },
    task_line: '8 и в 3 раза больше',
    task_line_uz: "8 va 3 marta ko'p",
    step1: '8 · 3 = 24',
    step1_cap: { ru: 'первое действие: вторая корзина', uz: 'birinchi amal: ikkinchi savat' },
    step2: '8 + 24 = 32',
    step2_cap: { ru: 'второе действие: ответ', uz: 'ikkinchi amal: javob' },
    res: { ru: 'ответ 32 кристалла', uz: 'javob 32 kristall' },
    btn1: { ru: 'Найти вторую корзину', uz: 'Ikkinchi savatni topish' },
    btn2: { ru: 'Ответить на вопрос', uz: 'Savolga javob berish' },
    done_text: { ru: 'Первое действие готовит второе, а ответом становится только последнее число.', uz: "Birinchi amal ikkinchisini tayyorlaydi, javob esa faqat oxirgi son bo'ladi." },
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
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 4,
    h: 4,
    lead: { ru: 'Вопрос решает, где остановиться', uz: "Qayerda to'xtashni savol hal qiladi" },
    capA: { ru: 'спросили про вторую — ответ 24', uz: "ikkinchisi so'ralsa — javob 24" },
    capB: { ru: 'спросили про обе — ответ 32', uz: "ikkalasi so'ralsa — javob 32" },
    res: { ru: 'считаем до вопроса', uz: 'savolgacha sanaymiz' },
    btn1: { ru: 'Спросить про вторую', uz: "Ikkinchisi haqida so'rash" },
    btn2: { ru: 'Спросить про обе', uz: "Ikkalasi haqida so'rash" },
    done_text: { ru: 'Одно и то же условие даёт разные ответы, потому что вопросы разные.', uz: "Bitta shart har xil javob beradi, chunki savollar har xil." },
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
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'С чего начинают решение составной задачи?', uz: 'Murakkab masalani yechish nimadan boshlanadi?' },
    opts: [
      { ru: 'с плана действий', uz: 'amallar rejasidan' },
      { ru: 'со сложения чисел', uz: "sonlarni qo'shishdan" },
      { ru: 'с последнего числа', uz: 'oxirgi sondan' },
      { ru: 'с записи ответа', uz: 'javobni yozishdan' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Складывать пока нечего. Одно число ещё неизвестно.', uz: "Hozircha qo'shadigan narsa yo'q. Bitta son hali noma'lum." },
      2: { ru: 'Числа берут не подряд, а по плану.', uz: "Sonlar ketma-ket emas, reja bo'yicha olinadi." },
      3: { ru: 'Ответ пишут в конце, а не в начале.', uz: "Javob boshida emas, oxirida yoziladi." }
    },
    on_correct: { ru: 'Верно. Сначала план, потом вычисления.', uz: "To'g'ri. Avval reja, keyin hisob." },
    rule_lines: {
      ru: ['что известно', 'что найдём первым действием', 'что ответит на вопрос'],
      uz: ["nima ma'lum", "birinchi amalda nimani topamiz", "savolga nima javob beradi"]
    },
    rule_ex: { ru: '8 · 3 = 24, потом 8 + 24 = 32', uz: '8 · 3 = 24, keyin 8 + 24 = 32' },
    rule_speech: { ru: 'Составную задачу решают по плану. Сначала отвечают, что известно, потом что найдут первым действием, и только потом считают. Ответом становится то число, которое отвечает на вопрос задачи.', uz: "Murakkab masala reja bo'yicha yechiladi. Avval nima ma'lum ekani, keyin birinchi amalda nima topilishi aytiladi, shundan so'ng hisoblanadi. Javob bo'lib masala savoliga javob beradigan son olinadi." },
    audio: {
      intro: { ru: 'Соберём правило. Мы решили задачу в два шага.', uz: "Qoidani yig'amiz. Masalani ikki qadamda yechdik." }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'У Рано 5 марок, у Анвара на 4 больше. Сколько у обоих?', uz: "Ra'noda 5 marka, Anvarda 4 ta ko'p. Ikkalasida qancha?" },
    fig_w: 5,
    fig_h: 2,
    opts: [
      { ru: '14', uz: '14' },
      { ru: '9', uz: '9' },
      { ru: '4', uz: '4' },
      { ru: '20', uz: '20' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Девять это только у Анвара, а спрашивают про обоих.', uz: "To'qqiz bu faqat Anvarda, so'ralgani esa ikkalasi." },
      2: { ru: 'Четыре это разница, а не ответ.', uz: "To'rt bu farq, javob emas." },
      3: { ru: 'Двадцать это слишком много, посчитай ещё раз.', uz: "Yigirma juda ko'p, qaytadan sanang." }
    },
    audio: {
      intro: { ru: 'Посмотри на схему. У Рано пять марок, у Анвара на четыре больше. Сколько марок у обоих?', uz: "Chizmaga qarang. Ra'noda beshta marka, Anvarda to'rtta ko'p. Ikkalasida nechta marka bor?" },
      on_correct: { ru: 'Верно. Сначала девять у Анвара, потом пять и девять вместе.', uz: "To'g'ri. Avval Anvarda to'qqizta, keyin besh va to'qqiz birga." },
      on_wrong: { ru: 'Первое действие даёт марки Анвара, второе отвечает на вопрос.', uz: "Birinchi amal Anvarning markasini beradi, ikkinchisi savolga javob beradi." }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи задачи по числу действий', uz: 'Masalalarni amallar soniga qarab ajrating' },
    bin_a: { ru: 'одно действие', uz: 'bitta amal' },
    bin_b: { ru: 'два действия', uz: 'ikkita amal' },
    items: [
      { n: { ru: 'было 12, отдали 5', uz: '12 ta edi, 5 tasi berildi' }, a: true, hint: { ru: 'Всё известно, одно вычитание.', uz: "Hammasi ma'lum, bitta ayirish." } },
      { n: { ru: 'было 12, отдали 5, потом ещё 3', uz: '12 ta edi, 5 tasi, keyin yana 3 tasi berildi' }, a: false, hint: { ru: 'Два раза отдавали, значит два шага.', uz: "Ikki marta berilgan, demak ikki qadam." } },
      { n: { ru: '6 коробок по 4', uz: '4 tadan 6 quti' }, a: true, hint: { ru: 'Одно умножение и всё.', uz: "Bitta ko'paytirish va tamom." } },
      { n: { ru: '6 коробок по 4, увезли 10', uz: "4 tadan 6 quti, 10 tasi olib ketildi" }, a: false, hint: { ru: 'Сначала найти всё, потом вычесть.', uz: "Avval hammasini topish, keyin ayirish." } }
    ],
    audio: {
      intro: { ru: 'Четыре задачи. Отправь каждую в свою корзину.', uz: "To'rtta masala. Har birini o'z savatiga yuboring." },
      on_correct: { ru: 'Всё на месте. Если в условии есть скрытое число, действий будет два.', uz: "Hammasi joyida. Shartda yashiringan son bo'lsa, amal ikkita bo'ladi." },
      on_wrong: { ru: 'Проверь, все ли числа для ответа уже известны.', uz: "Javob uchun hamma son ma'lummi, tekshiring." }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Было 40 кристаллов, увезли 3 ящика по 6. Сколько осталось?', uz: "40 ta kristall bor edi, 6 tadan 3 yashik olib ketildi. Nechtasi qoldi?" },
    opts: [
      { ru: '22', uz: '22' },
      { ru: '18', uz: '18' },
      { ru: '34', uz: '34' },
      { ru: '31', uz: '31' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Восемнадцать это то, что увезли, а спрашивают про остаток.', uz: "O'n sakkiz bu olib ketilgani, so'ralgani esa qoldiq." },
      2: { ru: 'Тридцать четыре получится, если вычесть только шесть.', uz: "O'ttiz to'rt faqat oltini ayirsangiz chiqadi." },
      3: { ru: 'Тридцать один получится, если вычесть девять.', uz: "O'ttiz bir to'qqizni ayirsangiz chiqadi." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Было сорок, увезли три ящика по шесть. Сколько осталось?', uz: "Tez savol. Qirqta edi, oltitadan uch yashik olib ketildi. Nechtasi qoldi?" },
      on_correct: { ru: 'Верно. Сначала восемнадцать увезли, потом сорок минус восемнадцать.', uz: "To'g'ri. Avval o'n sakkiztasi olib ketildi, keyin qirq ayirish o'n sakkiz." },
      on_wrong: { ru: 'Первым действием найди, сколько увезли.', uz: "Birinchi amalda qanchasi olib ketilganini toping." }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Было 40, увезли 3 ящика по 6', uz: "40 ta edi, 6 tadan 3 yashik olib ketildi" },
    swap_line: { ru: 'было 40', uz: '40 edi' },
    cells: [
      { head: { ru: 'увезли', uz: 'olib ketildi' }, label: '3 · 6', ans: 18, hint: { ru: 'Три ящика по шесть штук.', uz: "Oltitadan uch yashik." } },
      { head: { ru: 'было', uz: 'bor edi' }, label: { ru: 'штук', uz: 'dona' }, ans: 40, hint: { ru: 'Это число дано в условии.', uz: 'Bu son shartda berilgan.' } },
      { head: { ru: 'осталось', uz: 'qoldi' }, label: '40 − 18', ans: 22, hint: { ru: 'Из того, что было, вычти увезённое.', uz: "Bor bo'lganidan olib ketilganini ayiring." } }
    ],
    check: { ru: '18 увезли, 22 осталось', uz: '18 tasi olib ketildi, 22 tasi qoldi' },
    check_label: { ru: 'два действия', uz: 'ikki amal' },
    audio: {
      intro: { ru: 'Заполни три окна. Сколько увезли, сколько было и сколько осталось.', uz: "Uchta oynani to'ldiring. Qancha olib ketildi, qancha bor edi va qancha qoldi." },
      on_correct: { ru: 'Увезли восемнадцать, осталось двадцать два. Первое действие подготовило второе.', uz: "O'n sakkiztasi olib ketildi, yigirma ikkitasi qoldi. Birinchi amal ikkinchisini tayyorladi." }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Спросили про остаток, а в ответ записали 18. Где ошибка?', uz: "Qoldiq so'ralgan, javobga esa 18 yozilibdi. Xato qayerda?" },
    fig_line: '3 · 6 = 18',
    opts: [
      { ru: 'ответили первым действием', uz: 'birinchi amal bilan javob berilgan' },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'неверно умножили', uz: "noto'g'ri ko'paytirilgan" },
      { ru: 'взяли не те числа', uz: "sonlar noto'g'ri olingan" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Восемнадцать это увезённое, а спрашивали про остаток.', uz: "O'n sakkiz bu olib ketilgani, so'ralgani esa qoldiq." },
      2: { ru: 'Умножение верное, три на шесть это восемнадцать.', uz: "Ko'paytirish to'g'ri, uchga olti o'n sakkiz." },
      3: { ru: 'Числа из условия взяты правильно.', uz: "Shartdagi sonlar to'g'ri olingan." }
    },
    audio: {
      intro: { ru: 'Кто-то остановился на первом действии. Найди ошибку.', uz: "Kimdir birinchi amalda to'xtab qolibdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Первое действие только подготовка, отвечает второе.', uz: "To'g'ri. Birinchi amal faqat tayyorgarlik, javobni ikkinchisi beradi." },
      on_wrong: { ru: 'Перечитай вопрос и посмотри, на что отвечает восемнадцать.', uz: "Savolni qayta o'qing va o'n sakkiz nimaga javob berishiga qarang." }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит решает задачу по порядку чисел', uz: 'Bit masalani sonlar tartibi bo\'yicha yechyapti' },
    lines: ['было 40, увезли 3 ящика по 6', 'Бит: беру числа подряд, 40 − 3 = 37, потом 37 − 6 = 31'],
    lines_uz: ["40 ta edi, 6 tadan 3 yashik olib ketildi", "Bit: sonlarni ketma-ket olaman, 40 − 3 = 37, keyin 37 − 6 = 31"],
    line_cap: { ru: 'Бит: считаю в порядке записи', uz: 'Bit: yozilish tartibida hisoblayman' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, числа берут по смыслу', 'да, порядок записи главный'], uz: ["yo'q, sonlar ma'nosiga qarab olinadi", 'ha, yozilish tartibi asosiy'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Тройка это число ящиков, а не кристаллов. Её нельзя вычитать из сорока. Сначала три умножают на шесть и получают восемнадцать, и только это число вычитают.', uz: "Ha. Uchlik bu yashiklar soni, kristallar emas. Uni qirqdan ayirib bo'lmaydi. Avval uchni oltiga ko'paytirib, o'n sakkiz olinadi va faqat shu son ayiriladi." },
    trap_wrong: { ru: 'Спроси себя, что означает тройка в условии.', uz: "O'zingizdan so'rang, shartdagi uchlik nimani anglatadi." },
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
      ]
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'В первой корзине 7 кристаллов, во второй в 2 раза больше. Сколько в обеих?', uz: "Birinchi savatda 7 kristall, ikkinchisida 2 marta ko'p. Ikkalasida qancha?" },
    ans: 21,
    check: '7 · 2 = 14, 7 + 14',
    check_label: { ru: 'два действия', uz: 'ikki amal' },
    hint: { ru: 'Сначала вторую корзину, потом обе вместе.', uz: "Avval ikkinchi savatni, keyin ikkalasini birga." },
    audio: {
      intro: { ru: 'Теперь считай сам. В первой семь, во второй в два раза больше. Сколько в обеих?', uz: "Endi o'zingiz hisoblang. Birinchisida yetti, ikkinchisida ikki marta ko'p. Ikkalasida qancha?" },
      on_correct: { ru: 'Двадцать один кристалл.', uz: "Yigirma bitta kristall." }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Купили 5 коробок по 6 кристаллов, 12 отдали. Сколько осталось?', uz: "6 tadan 5 quti sotib olindi, 12 tasi berildi. Nechtasi qoldi?" },
    ans: 18,
    check: '5 · 6 = 30, 30 − 12',
    check_label: { ru: 'сначала всё, потом остаток', uz: 'avval hammasi, keyin qoldiq' },
    hint: { ru: 'Сначала найди, сколько купили всего.', uz: "Avval jami qancha sotib olinganini toping." },
    audio: {
      intro: { ru: 'Купили пять коробок по шесть, двенадцать отдали. Сколько осталось?', uz: "Oltitadan besh quti sotib olindi, o'n ikkitasi berildi. Nechtasi qoldi?" },
      on_correct: { ru: 'Восемнадцать кристаллов.', uz: "O'n sakkizta kristall." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Три действия подряд', uz: 'Ketma-ket uch amal' },
    q: { ru: 'В мастерской 9 полок по 4 кристалла. Забрали 2 полки. Сколько кристаллов осталось и сколько это полок?', uz: "Ustaxonada 4 tadan 9 javon bor. 2 ta javon olindi. Nechta kristall qoldi va bu nechta javon?" },
    q_speech: { ru: 'в мастерской девять полок по четыре кристалла, забрали две полки. Сколько кристаллов осталось и сколько это полок?', uz: "ustaxonada to'rttadan to'qqiz javon bor, ikkita javon olindi. Nechta kristall qoldi va bu nechta javon?" },
    tbl_heads: [
      { ru: 'полок', uz: 'javon' },
      { ru: 'на полке', uz: 'javonda' },
      { ru: 'забрали', uz: 'olindi' }
    ],
    tbl_cells: ['9', '4', '2'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: '9 · 4', uz: '9 · 4' },
      { ru: '9 − 2', uz: '9 − 2' },
      { ru: '4 · 2', uz: '4 · 2' },
      { ru: '9 + 4', uz: '9 + 4' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Так найдутся полки, а спрашивают сначала про кристаллы.', uz: "Bunda javonlar topiladi, avval esa kristallar so'ralgan." },
      2: { ru: 'Так найдётся забранное, но не всё количество.', uz: "Bunda olingani topiladi, butun soni emas." },
      3: { ru: 'Полки и кристаллы не складывают.', uz: "Javon va kristall qo'shilmaydi." }
    },
    pick_ok: { ru: 'Верно. Сначала все кристаллы, потом остаток.', uz: "To'g'ri. Avval hamma kristall, keyin qoldiq." },
    step1_q: { ru: 'Сколько кристаллов осталось?', uz: 'Nechta kristall qoldi?' },
    ans1: 28,
    hint1: { ru: 'Всего тридцать шесть, забрали восемь.', uz: "Jami o'ttiz olti, sakkiztasi olindi." },
    step2_q: { ru: 'Сколько это полок?', uz: 'Bu nechta javon?' },
    ans2: 7,
    hint2: { ru: 'Раздели остаток на четыре.', uz: "Qoldiqni to'rtga bo'ling." },
    check: '36 − 8 = 28, 28 : 4 = 7',
    setup_audio: { ru: 'В мастерской считают кристаллы. Посмотри на таблицу и реши, с чего начать.', uz: "Ustaxonada kristallar hisoblanmoqda. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Девять полок по четыре кристалла, забрали две полки. Сколько осталось и сколько это полок?', uz: "To'rttadan to'qqiz javon, ikkita javon olindi. Qancha qoldi va bu nechta javon?" },
      on_correct: { ru: 'Осталось двадцать восемь кристаллов, а это семь полок.', uz: "Yigirma sakkizta kristall qoldi, bu esa yettita javon." },
      on_wrong: { ru: 'Сначала посчитай все кристаллы, потом убери забранное.', uz: "Avval hamma kristallni sanang, keyin olinganini olib tashlang." }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задачи. Дочитывай вопрос до конца', uz: "Uchta masala. Savolni oxirigacha o'qing" },
    items: [
      {
        kind: 'num',
        q: { ru: 'У Зухры 6 книг, у Жасура в 3 раза больше. Сколько у обоих?', uz: "Zuhrada 6 kitob, Jasurda 3 marta ko'p. Ikkalasida qancha?" },
        q_speech: { ru: 'у Зухры шесть книг, у Жасура в три раза больше. Сколько книг у обоих?', uz: "Zuhrada oltita kitob, Jasurda uch marta ko'p. Ikkalasida nechta kitob bor?" },
        ans: 24,
        hint: { ru: 'Сначала книги Жасура, потом обе стопки.', uz: "Avval Jasurning kitobi, keyin ikkala uyum." }
      },
      {
        kind: 'num',
        q: { ru: 'Было 50 кристаллов, увезли 4 ящика по 7. Сколько осталось?', uz: "50 ta kristall bor edi, 7 tadan 4 yashik olib ketildi. Nechtasi qoldi?" },
        q_speech: { ru: 'было пятьдесят кристаллов, увезли четыре ящика по семь. Сколько осталось?', uz: "ellikta kristall bor edi, yettitadan to'rt yashik olib ketildi. Nechtasi qoldi?" },
        ans: 22,
        hint: { ru: 'Сначала найди, сколько увезли.', uz: "Avval qancha olib ketilganini toping." }
      },
      {
        kind: 'num',
        q: { ru: 'В 8 коробках по 5 кристаллов, добавили ещё 10. Сколько стало?', uz: "8 qutida 5 tadan kristall bor, yana 10 ta qo'shildi. Nechta bo'ldi?" },
        q_speech: { ru: 'в восьми коробках по пять кристаллов, добавили ещё десять. Сколько стало?', uz: "sakkiz qutida beshtadan kristall bor, yana o'nta qo'shildi. Nechta bo'ldi?" },
        ans: 50,
        hint: { ru: 'Сначала все коробки, потом добавка.', uz: "Avval hamma quti, keyin qo'shimcha." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'В старинных учебниках задачи часто писали стихами. Так их было легче запомнить наизусть, ведь книги стоили дорого и одна книга была на весь класс. Ученик заучивал условие, а потом решал его в уме, шаг за шагом.',
      uz: "Qadimgi darsliklarda masalalar ko'pincha she'r bilan yozilgan. Shunda ularni yod olish oson bo'lgan, chunki kitob qimmat edi va butun sinfga bitta kitob to'g'ri kelardi. O'quvchi shartni yodlab, keyin uni qadamma-qadam xayolan yechardi."
    },
    fact_audio: {
      ru: 'Вот как учились раньше. Книги стоили дорого, и одна книга приходилась на весь класс. Поэтому задачи часто записывали стихами. Условие в рифму запоминалось с двух-трёх прочтений, и ученик уносил его в голове. Потом он решал задачу в уме, шаг за шагом, ровно так же, как мы сегодня составляем план. Получается, привычка сначала подумать, а потом считать, старше самих тетрадей.',
      uz: "Ilgari mana shunday o'qishgan. Kitob qimmat edi va butun sinfga bitta kitob to'g'ri kelardi. Shuning uchun masalalar ko'pincha she'r bilan yozilgan. Qofiyali shart ikki-uch o'qishda esda qolardi va o'quvchi uni boshida olib ketardi. Keyin masalani xayolan, qadamma-qadam yechardi, xuddi biz bugun reja tuzganimizdek. Demak, avval o'ylab, keyin hisoblash odati daftarlarning o'zidan ham qadimiyroq."
    },
    audio: {
      intro: { ru: 'Три задачи напоследок. В каждой сначала план, потом счёт.', uz: "Oxirida uchta masala. Har birida avval reja, keyin hisob." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Первое действие только готовит ответ.', uz: "Birinchi amal faqat javobni tayyorlaydi." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Задачи решены!', uz: 'Masalalar yechildi!' },
    cando: {
      ru: ['составляю план решения', 'нахожу скрытое число первым действием', 'отвечаю именно на вопрос задачи'],
      uz: ["yechish rejasini tuzaman", "yashiringan sonni birinchi amalda topaman", "aynan masala savoliga javob beraman"]
    },
    rule_recap: { ru: 'В составной задаче первое действие готовит ответ, а отвечает последнее.', uz: "Murakkab masalada birinchi amal javobni tayyorlaydi, javobni oxirgisi beradi." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 38: выбор величины; урок 47: план решения', uz: "38-dars: kattalik tanlash; 47-dars: yechish rejasi" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'неравенства и верные высказывания', uz: 'tengsizliklar va rost mulohazalar' },
    audio: {
      ru: 'Задачи решены. Запомни главное. В составной задаче не хватает одного числа, и его находят первым действием. Это число не ответ, а только ступенька. Отвечает всегда последнее действие, то самое, которое отвечает на вопрос. И ещё одно. Числа из условия берут не подряд, а по смыслу. Тройка может означать ящики, а не кристаллы, и вычитать её нельзя. В следующий раз возьмём записи со знаками больше и меньше!',
      uz: "Masalalar yechildi. Asosiysini eslab qoling. Murakkab masalada bitta son yetishmaydi va u birinchi amalda topiladi. Bu son javob emas, faqat zina. Javobni har doim oxirgi amal beradi, aynan savolga javob beradigani. Yana bir narsa. Shartdagi sonlar ketma-ket emas, ma'nosiga qarab olinadi. Uchlik yashikni anglatishi mumkin, kristallni emas, uni ayirib bo'lmaydi. Keyingi safar katta va kichik belgili yozuvlarni olamiz!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Составим план.', uz: 'Reja tuzamiz.' },
  s2:  { ru: 'Теперь про вопрос.', uz: 'Endi savol haqida.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай схему.', uz: "Chizmani o'qing." },
  s5:  { ru: 'Разложи задачи.', uz: 'Masalalarni ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут ответили слишком рано.', uz: 'Bu yerda juda erta javob berilibdi.' },
  s9:  { ru: 'А вот и Бит со своим порядком.', uz: "Mana Bit ham o'z tartibi bilan." },
  s10: { ru: 'Теперь решай сам.', uz: "Endi o'zingiz yeching." },
  s11: { ru: 'И ещё одна задача.', uz: 'Yana bitta masala.' },
  s12: { ru: 'Задача в три действия.', uz: 'Uch amalli masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Задачи решены. План оказался важнее скорости счёта.',
  uz: "Masalalar yechildi. Reja hisob tezligidan muhimroq bo'ldi."
};

// --- SAHNA TUGUNI (D48): 1-DARSNING shahri, ustiga masala rejasi.
const PlanNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(132 96)">
      <rect x="0" y="0" width="138" height="80" rx="6" fill="#FDF6E8" stroke="#8A7550" strokeWidth="2"/>
      <rect x="0" y="0" width="138" height="14" rx="6" fill="#C06A2E"/>
      <text x="69" y="10.5" textAnchor="middle" fontSize="7" letterSpacing="1.4" fill="#FFF3E9" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'ПЛАН' : 'REJA'}</text>
      {[['1', '8 · 3 = 24'], ['2', '8 + 24 = 32']].map(([n, t], i) => (
        <g key={i} transform={`translate(12 ${32 + i * 22})`}>
          <circle cx="0" cy="-4" r="7" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.4"/>
          <text x="0" y="-1" textAnchor="middle" fontSize="7" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">{n}</text>
          <text x="16" y="0" fontSize="9" fontWeight="800" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{t}</text>
        </g>
      ))}
      <text x="69" y="94" textAnchor="middle" fontSize="7" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'ответ в последнем действии' : 'javob oxirgi amalda'}</text>
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
      <text x="46" y="20" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'Анвар' : 'Anvar'}</text>
    </g>
    <text x="120" y="104" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? '? всего' : '? jami'}</text>
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
    <text x="100" y="98" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'рифма' : 'qofiya'}</text>
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
