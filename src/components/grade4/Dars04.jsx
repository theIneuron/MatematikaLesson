import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// ============================================================================
// 4-SINF · Dars04 · Ko'p xonali sonlarni taqqoslash
// Local fallback contract: SCREEN_META is the Notion-ready skeleton;
// CONTENT is the complete RU/UZ and audio package.
// ============================================================================

const T = {
  bg: '#F5F5F0',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  paper: '#FFFFFF',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  lime: '#95C93D',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
  shadowBase: '58, 53, 48',
};

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Сигнал из Лумо Сити', uz: 'Lumo Sitidan signal' },
    title: { ru: 'Бит поставил короткий маршрут первым', uz: "Bit qisqa yo'nalishni birinchi qo'ydi" },
    lead: {
      ru: 'Сортировщик сравнил только последние цифры и решил, что 842 107 больше 842 190. Из-за этого городские машины получили неверный порядок.',
      uz: "Saralash qurilmasi faqat oxirgi raqamlarni taqqosladi va 842 107 soni 842 190 sonidan katta deb o'yladi. Shahar mashinalari noto'g'ri tartib oldi.",
    },
    badge: { ru: 'СБОЙ СОРТИРОВКИ', uz: 'SARALASH XATOSI' },
    bitLine: { ru: 'Я смотрел справа. Но числа почему-то не согласились.', uz: "Men o'ng tomonga qaradim. Ammo sonlar bunga rozi bo'lmadi." },
    prompt: { ru: 'Разберём, где число действительно становится больше.', uz: "Son qayerda haqiqatan katta bo'lishini aniqlaymiz." },
    audio: {
      ru: [
        'В Лумо Сити сбился сортировщик маршрутов. Бит сравнил только последние цифры двух чисел.',
        'Сегодня разберём надёжный способ сравнения многозначных чисел.',
      ],
      uz: [
        "Lumo Sitida yo'nalishlarni saralash qurilmasi adashdi. Bit ikki sonning faqat oxirgi raqamlarini taqqosladi.",
        "Bugun ko'p xonali sonlarni taqqoslashning ishonchli usulini o'rganamiz.",
      ],
    },
  },
  s1: {
    eyebrow: { ru: 'Первая опора', uz: 'Birinchi tayanch' },
    title: { ru: 'Разная длина записи решает сравнение', uz: "Yozuv uzunligi har xil bo'lsa, taqqoslash hal bo'ladi" },
    lead: {
      ru: 'Чем левее находится старший разряд, тем больше целое число. Поэтому сначала полезно посчитать цифры.',
      uz: "Eng katta xona qancha chapda bo'lsa, butun son shuncha katta bo'ladi. Shuning uchun avval raqamlar sonini sanash foydali.",
    },
    left: { number: '98 765', count: { ru: '5 цифр', uz: '5 ta raqam' } },
    right: { number: '102 304', count: { ru: '6 цифр', uz: '6 ta raqam' } },
    formula: '98 765 < 102 304',
    steps: [
      { ru: 'Считаем цифры: 5 и 6', uz: 'Raqamlarni sanaymiz: 5 va 6' },
      { ru: 'У второго числа есть разряд сотен тысяч', uz: 'Ikkinchi sonda yuz mingliklar xonasi bor' },
      { ru: 'Поэтому 102 304 больше любого пятизначного числа', uz: 'Shuning uchun 102 304 har qanday besh xonali sondan katta' },
    ],
    conclusion: { ru: 'Шестизначное число больше пятизначного.', uz: "Olti xonali son besh xonali sondan katta." },
    audio: {
      ru: [
        'Сначала считаем цифры. У первого числа пять цифр, а у второго шесть.',
        'Во втором числе есть разряд сотен тысяч. Поэтому оно больше любого пятизначного числа.',
      ],
      uz: [
        "Avval raqamlarni sanaymiz. Birinchi sonda beshta, ikkinchi sonda esa oltita raqam bor.",
        "Ikkinchi sonda yuz mingliklar xonasi bor. Shuning uchun u har qanday besh xonali sondan katta.",
      ],
    },
  },
  s2: {
    eyebrow: { ru: 'Таблица разрядов', uz: 'Xonalar jadvali' },
    title: { ru: 'Одинаковая длина: идём слева направо', uz: "Uzunligi teng bo'lsa, chapdan o'ngga yuramiz" },
    lead: {
      ru: 'Оба числа шестизначные. Теперь сравниваем цифры одного и того же разряда, начиная с самого старшего.',
      uz: "Ikkala son ham olti xonali. Endi eng katta xonadan boshlab bir xil xonalardagi raqamlarni taqqoslaymiz.",
    },
    headers: {
      ru: ['сот. тыс.', 'дес. тыс.', 'тыс.', 'сот.', 'дес.', 'ед.'],
      uz: ['yuz mingl.', "o'n mingl.", 'mingl.', 'yuzl.', "o'nl.", 'birl.'],
    },
    a: ['5', '7', '2', '4', '1', '8'],
    b: ['5', '7', '2', '4', '9', '1'],
    firstDifferent: 4,
    conclusion: { ru: 'В разряде десятков: 1 < 9, значит 572 418 < 572 491.', uz: "O'nlar xonasida 1 < 9, demak 572 418 < 572 491." },
    contrast: {
      a: '482 731',
      b: '485 112',
      trail: ['4 = 4', '8 = 8', '2 < 5'],
      result: '482 731 < 485 112',
      note: { ru: 'Первое различие в тысячах. Сотни, десятки и единицы уже не меняют результат.', uz: "Birinchi farq mingliklarda. Yuzliklar, o'nliklar va birliklar natijani endi o'zgartirmaydi." },
    },
    audio: {
      ru: [
        'У чисел одинаковое количество цифр. Сравниваем разряды слева направо.',
        'Первые четыре цифры равны. В разряде десятков один меньше девяти, поэтому первое число меньше.',
        'После первого различия младшие разряды уже не могут изменить результат.',
      ],
      uz: [
        "Sonlardagi raqamlar soni teng. Xonalarni chapdan o'ngga taqqoslaymiz.",
        "Birinchi to'rtta raqam teng. O'nlar xonasida bir to'qqizdan kichik, shuning uchun birinchi son kichik.",
        "Birinchi farqdan keyin kichik xonalar natijani o'zgartira olmaydi.",
      ],
    },
  },
  s3: {
    eyebrow: { ru: 'Числовая прямая', uz: "Sonlar chizig'i" },
    title: { ru: 'Близкие числа видно на линии', uz: "Yaqin sonlar chiziqda ko'rinadi" },
    lead: {
      ru: 'На числовой прямой больше то число, которое расположено правее. Модель особенно удобна для близких значений.',
      uz: "Sonlar chizig'ida o'ngroqda joylashgan son katta bo'ladi. Bu model yaqin qiymatlar uchun ayniqsa qulay.",
    },
    start: '705 000',
    end: '705 100',
    left: '705 009',
    right: '705 090',
    formula: '705 009 < 705 090',
    audio: {
      ru: [
        'Посмотрим на близкие числа на числовой прямой. Большее число находится правее.',
        'Семьсот пять тысяч девяносто правее семисот пяти тысяч девяти, поэтому оно больше.',
      ],
      uz: [
        "Yaqin sonlarni sonlar chizig'ida ko'ramiz. Katta son o'ngroqda joylashadi.",
        "Yetti yuz besh ming to'qson soni yetti yuz besh ming to'qqizdan o'ngroqda, shuning uchun u katta.",
      ],
    },
  },
  s4: {
    eyebrow: { ru: 'Особый случай', uz: 'Alohida holat' },
    title: { ru: 'Если различия нет, числа равны', uz: "Farq bo'lmasa, sonlar teng" },
    lead: {
      ru: 'Нули внутри числа занимают свои разряды. Их нельзя пропускать, но одинаковые нули подтверждают равенство.',
      uz: "Son ichidagi nollar o'z xonasini egallaydi. Ularni tashlab bo'lmaydi, teng nollar esa tenglikni tasdiqlaydi.",
    },
    a: '406 020',
    b: '406 020',
    formula: '406 020 = 406 020',
    conclusion: { ru: 'Все шесть разрядов совпали.', uz: 'Barcha oltita xona mos keldi.' },
    audio: {
      ru: [
        'Если все разряды совпали, числа равны. Нули внутри числа тоже участвуют в сравнении.',
        'В обоих числах каждая цифра занимает один и тот же разряд.',
      ],
      uz: [
        "Barcha xonalar mos kelsa, sonlar teng bo'ladi. Son ichidagi nollar ham taqqoslashda qatnashadi.",
        "Ikkala sonda har bir raqam bir xil xonani egallagan.",
      ],
    },
  },
  s5: {
    eyebrow: { ru: 'Короткая проверка', uz: 'Qisqa tekshiruv' },
    title: { ru: 'Какой знак вернёт сортировщик?', uz: 'Saralash qurilmasi qaysi belgini qaytaradi?' },
    lead: { ru: 'Сравни 705 090 и 705 009.', uz: '705 090 va 705 009 sonlarini taqqoslang.' },
    options: [
      { ru: '705 090 > 705 009', uz: '705 090 > 705 009' },
      { ru: '705 090 < 705 009', uz: '705 090 < 705 009' },
      { ru: '705 090 = 705 009', uz: '705 090 = 705 009' },
      { ru: 'Эти числа нельзя сравнить', uz: "Bu sonlarni taqqoslab bo'lmaydi" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Первые четыре разряда совпадают. В разряде десятков 9 больше 0, поэтому 705 090 больше.',
      uz: "Birinchi to'rtta xona mos keladi. O'nlar xonasida 9 raqami 0 dan katta, shuning uchun 705 090 katta.",
    },
    wrong: [
      null,
      { ru: 'Знак направлен неверно. Первое различие находится в разряде десятков: 9 больше 0.', uz: "Belgi noto'g'ri yo'nalgan. Birinchi farq o'nlar xonasida, 9 raqami 0 dan katta." },
      { ru: 'Числа начинаются одинаково, но не равны. В разряде десятков стоят 9 и 0.', uz: "Sonlarning boshi bir xil, ammo ular teng emas. O'nlar xonasida 9 va 0 turibdi." },
      { ru: 'Любые натуральные числа можно сравнить. Здесь достаточно найти первый различающийся разряд.', uz: "Har qanday natural sonni taqqoslash mumkin. Bu yerda birinchi farqli xonani topish yetarli." },
    ],
    audio: {
      intro: { ru: 'Сравни семьсот пять тысяч девяносто и семьсот пять тысяч девять. Выбери верную запись.', uz: "Yetti yuz besh ming to'qson va yetti yuz besh ming to'qqiz sonlarini taqqoslang. To'g'ri yozuvni tanlang." },
      on_correct: { ru: 'Верно. В разряде десятков девять больше нуля.', uz: "To'g'ri. O'nlar xonasida to'qqiz noldan katta." },
      on_wrong: [
        null,
        { ru: 'Проверь направление знака. Первое число больше.', uz: "Belgi yo'nalishini tekshiring. Birinchi son katta." },
        { ru: 'Числа не равны. Сравни разряд десятков.', uz: "Sonlar teng emas. O'nlar xonasini taqqoslang." },
        { ru: 'Эти числа можно сравнить. Ищи первый разный разряд.', uz: "Bu sonlarni taqqoslash mumkin. Birinchi farqli xonani toping." },
      ],
    },
  },
  s6: {
    eyebrow: { ru: 'Разбираем примеры', uz: 'Misollarni tahlil qilamiz' },
    title: { ru: 'Один алгоритм, разные ситуации', uz: 'Bitta algoritm, turli vaziyatlar' },
    lead: { ru: 'Посмотри, на каком шаге заканчивается каждое сравнение.', uz: "Har bir taqqoslash qaysi qadamda tugashiga qarang." },
    examples: [
      { formula: '87 650 < 103 002', reason: { ru: '5 цифр < 6 цифр', uz: '5 ta raqam < 6 ta raqam' }, tone: 'cyan' },
      { formula: '640 215 > 639 999', reason: { ru: '6 > 3 в разряде десятков тысяч', uz: "o'n mingliklar xonasida 6 > 3" }, tone: 'accent' },
      { formula: '520 608 > 520 086', reason: { ru: '6 > 0 в разряде сотен', uz: 'yuzliklar xonasida 6 > 0' }, tone: 'lime' },
      { formula: '401 070 = 401 070', reason: { ru: 'все разряды совпали', uz: 'barcha xonalar mos keldi' }, tone: 'navy' },
    ],
    audio: {
      ru: [
        'В первом примере различается количество цифр. В остальных примерах числа имеют одинаковую длину.',
        'Тогда ищем первое различие слева. Если различий нет, ставим знак равенства.',
      ],
      uz: [
        "Birinchi misolda raqamlar soni farq qiladi. Qolgan misollarda sonlarning uzunligi teng.",
        "Bunday holatda chapdan birinchi farqni topamiz. Farq bo'lmasa, tenglik belgisini qo'yamiz.",
      ],
    },
  },
  s7: {
    eyebrow: { ru: 'Открываем закономерность', uz: 'Qonuniyatni ochamiz' },
    title: { ru: 'Почему справа уже можно не смотреть?', uz: "Nega keyin o'ng tomonga qarash shart emas?" },
    lead: {
      ru: 'У чисел 631 204 и 631 240 первое различие возникает в разряде десятков.',
      uz: "631 204 va 631 240 sonlarida birinchi farq o'nlar xonasida paydo bo'ladi.",
    },
    a: '631 204',
    b: '631 240',
    proof: { ru: 'В десятках: 0 < 4. Единицы уже не меняют результат.', uz: "O'nlarda 0 < 4. Birliklar natijani endi o'zgartirmaydi." },
    discovery: { ru: 'Старший различающийся разряд сильнее всех разрядов справа.', uz: "Eng katta farqli xona o'ngdagi barcha xonalardan kuchliroq." },
    audio: {
      ru: [
        'Сравниваем цифры слева. Первое различие появляется в разряде десятков.',
        'Ноль десятков меньше четырёх десятков. Единицы уже не могут изменить результат.',
      ],
      uz: [
        "Raqamlarni chapdan taqqoslaymiz. Birinchi farq o'nlar xonasida paydo bo'ladi.",
        "Nol o'nlik to'rt o'nlikdan kichik. Birliklar natijani endi o'zgartira olmaydi.",
      ],
    },
  },
  s8: {
    eyebrow: { ru: 'Собираем правило', uz: "Qoidani yig'amiz" },
    title: { ru: 'Надёжный алгоритм сравнения', uz: 'Ishonchli taqqoslash algoritmi' },
    lead: { ru: 'Три шага работают для любых натуральных многозначных чисел.', uz: "Uch qadam barcha ko'p xonali natural sonlar uchun ishlaydi." },
    rules: [
      { n: '01', title: { ru: 'Сравни количество цифр', uz: 'Raqamlar sonini taqqoslang' }, body: { ru: 'Больше цифр означает большее число.', uz: "Raqamlari ko'p son kattaroq bo'ladi." } },
      { n: '02', title: { ru: 'Если длина равна, иди слева', uz: "Uzunlik teng bo'lsa, chapdan yuring" }, body: { ru: 'Найди первый разряд, где цифры различаются.', uz: 'Raqamlari farq qiladigan birinchi xonani toping.' } },
      { n: '03', title: { ru: 'Поставь знак', uz: "Belgini qo'ying" }, body: { ru: 'Сравни цифры первого различающегося разряда. Если различий нет, числа равны.', uz: "Birinchi farqli xonadagi raqamlarni taqqoslang. Farq bo'lmasa, sonlar teng." } },
    ],
    audio: {
      ru: [
        'Соберём правило. Сначала сравни количество цифр.',
        'Если длина одинакова, двигайся слева направо до первого различия. Если различий нет, числа равны.',
      ],
      uz: [
        "Qoidani yig'amiz. Avval raqamlar sonini taqqoslang.",
        "Uzunlik teng bo'lsa, birinchi farqqacha chapdan o'ngga yuring. Farq bo'lmasa, sonlar teng.",
      ],
    },
  },
  s9: {
    eyebrow: { ru: 'Язык знаков', uz: 'Belgilar tili' },
    title: { ru: 'Один факт можно прочитать с двух сторон', uz: "Bitta fikrni ikki tomondan o'qish mumkin" },
    lead: { ru: 'Широкая сторона знака смотрит на большее число, а острый угол указывает на меньшее.', uz: "Belgining keng tomoni katta songa qaraydi, o'tkir uchi esa kichik sonni ko'rsatadi." },
    rows: [
      { formula: '640 215 > 639 999', reason: { ru: 'слева: первое число больше', uz: 'chapdan: birinchi son katta' } },
      { formula: '639 999 < 640 215', reason: { ru: 'справа: тот же факт, знак повернулся', uz: "o'ngdan: o'sha fikr, belgi burildi" } },
      { formula: '406 020 = 406 020', reason: { ru: 'равенство не меняется при перестановке', uz: "tenglik o'rinlar almashganda o'zgarmaydi" } },
      { formula: { ru: 'большее  >  меньшее', uz: 'katta  >  kichik' }, reason: { ru: 'широкая сторона обращена к большему', uz: 'keng tomon katta songa qaragan' } },
    ],
    audio: {
      ru: [
        'Знак можно читать с любой стороны. Широкая сторона всегда обращена к большему числу.',
        'Если числа поменять местами, знак больше превращается в знак меньше. Равенство не меняется.',
      ],
      uz: [
        "Belgini istalgan tomondan o'qish mumkin. Keng tomon doim katta songa qaraydi.",
        "Sonlar o'rin almashsa, katta belgisi kichik belgisiga aylanadi. Tenglik esa o'zgarmaydi.",
      ],
    },
  },
  s10: {
    eyebrow: { ru: 'Выбираем стратегию', uz: 'Strategiyani tanlaymiz' },
    title: { ru: 'Какая модель удобнее?', uz: 'Qaysi model qulayroq?' },
    lead: { ru: 'Способ выбирают по виду чисел. Ответ останется тем же, но путь может быть короче.', uz: "Usul sonlarning ko'rinishiga qarab tanlanadi. Javob o'zgarmaydi, ammo yo'l qisqaroq bo'lishi mumkin." },
    strategies: [
      { icon: '≠', title: { ru: 'Разное число цифр', uz: 'Raqamlar soni har xil' }, body: { ru: 'Сразу сравни длину записи.', uz: 'Darhol yozuv uzunligini taqqoslang.' }, example: '78 900 < 101 000' },
      { icon: '⇢', title: { ru: 'Одинаковая длина', uz: 'Uzunligi teng' }, body: { ru: 'Ищи первую разную цифру слева.', uz: 'Chapdagi birinchi farqli raqamni toping.' }, example: '452 910 > 451 999' },
      { icon: '—', title: { ru: 'Очень близкие числа', uz: 'Juda yaqin sonlar' }, body: { ru: 'Числовая прямая делает порядок наглядным.', uz: "Sonlar chizig'i tartibni ko'rsatadi." }, example: '705 009 < 705 090' },
    ],
    note: { ru: 'Таблица разрядов остаётся самым надёжным способом проверки.', uz: "Xonalar jadvali tekshirishning eng ishonchli usuli bo'lib qoladi." },
    audio: {
      ru: [
        'Для чисел разной длины достаточно посчитать цифры. Для одинаковой длины сравниваем разряды.',
        'Если числа близки, порядок удобно показать на числовой прямой. Таблица разрядов подходит всегда.',
      ],
      uz: [
        "Uzunligi har xil sonlar uchun raqamlarni sanash yetarli. Uzunligi teng bo'lsa, xonalarni taqqoslaymiz.",
        "Sonlar yaqin bo'lsa, tartibni sonlar chizig'ida ko'rsatish qulay. Xonalar jadvali doim mos keladi.",
      ],
    },
  },
  s11: {
    eyebrow: { ru: 'Лаборатория ошибок', uz: 'Xatolar laboratoriyasi' },
    title: { ru: 'Три ловушки, которые сбивают сортировщик', uz: 'Saralash qurilmasini adashtiradigan uchta tuzoq' },
    lead: { ru: 'Каждую ошибку исправляет один и тот же вопрос: где находится первое различие слева?', uz: "Har bir xatoni bitta savol tuzatadi: chapdagi birinchi farq qayerda?" },
    errors: [
      {
        tag: { ru: 'Последняя цифра', uz: 'Oxirgi raqam' },
        wrong: '842 107 > 842 190',
        why: { ru: '7 > 0, но единицы проверены слишком рано', uz: '7 > 0, ammo birliklar juda erta tekshirildi' },
        correct: '842 107 < 842 190',
      },
      {
        tag: { ru: 'Сумма цифр', uz: "Raqamlar yig'indisi" },
        wrong: '510 002 < 499 999',
        why: { ru: 'Сумма цифр не показывает величину числа', uz: "Raqamlar yig'indisi sonning kattaligini ko'rsatmaydi" },
        correct: '510 002 > 499 999',
      },
      {
        tag: { ru: 'Знак наоборот', uz: 'Teskari belgi' },
        wrong: '705 090 < 705 009',
        why: { ru: '9 десятков больше 0 десятков', uz: "9 o'nlik 0 o'nlikdan katta" },
        correct: '705 090 > 705 009',
      },
    ],
    repair: { ru: 'Длина записи, затем первое различие слева, затем знак.', uz: "Yozuv uzunligi, keyin chapdagi birinchi farq, so'ng belgi." },
    audio: {
      ru: [
        'Разберём три ловушки. Нельзя начинать с последней цифры или сравнивать суммы цифр.',
        'Даже после верного сравнения нужно проверить направление знака. Широкая сторона смотрит на большее число.',
      ],
      uz: [
        "Uchta tuzoqni tahlil qilamiz. Oxirgi raqamdan boshlash yoki raqamlar yig'indisini taqqoslash mumkin emas.",
        "To'g'ri taqqoslashdan keyin ham belgi yo'nalishini tekshiring. Keng tomon katta songa qaraydi.",
      ],
    },
  },
  s12: {
    eyebrow: { ru: 'Финальная миссия', uz: 'Yakuniy missiya' },
    title: { ru: 'Расставь городские данные по убыванию', uz: "Shahar ma'lumotlarini kamayish tartibida joylashtiring" },
    lead: { ru: 'Самое большое значение должно стоять первым.', uz: 'Eng katta qiymat birinchi turishi kerak.' },
    options: [
      { ru: '608 450 > 608 405 > 607 999', uz: '608 450 > 608 405 > 607 999' },
      { ru: '607 999 > 608 405 > 608 450', uz: '607 999 > 608 405 > 608 450' },
      { ru: '608 405 > 608 450 > 607 999', uz: '608 405 > 608 450 > 607 999' },
      { ru: '608 450 > 607 999 > 608 405', uz: '608 450 > 607 999 > 608 405' },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Сначала идут два числа с 608 тысячами. Между ними 450 больше 405. Число 607 999 стоит последним.',
      uz: "Avval 608 mingli ikkita son keladi. Ularning orasida 450 soni 405 dan katta. 607 999 soni oxirida turadi.",
    },
    wrong: [
      null,
      { ru: 'Порядок перевёрнут. Числа с 608 тысячами больше числа с 607 тысячами.', uz: "Tartib teskari. 608 mingli sonlar 607 mingli sondan katta." },
      { ru: 'Первые два числа перепутаны. После общей части 608 сравни 450 и 405.', uz: "Birinchi ikkita son almashgan. Umumiy 608 qismidan keyin 450 va 405 ni taqqoslang." },
      { ru: 'Число 607 999 не может стоять между числами с 608 тысячами. Оно меньше обоих.', uz: "607 999 soni 608 mingli sonlar orasida tura olmaydi. U ikkalasidan ham kichik." },
    ],
    audio: {
      intro: { ru: 'Расположи три городских показателя по убыванию. Самое большое значение поставь первым.', uz: "Uchta shahar ko'rsatkichini kamayish tartibida joylashtiring. Eng katta qiymatni birinchi qo'ying." },
      on_correct: { ru: 'Верно. Два числа с шестьюстами восемью тысячами идут раньше меньшего числа.', uz: "To'g'ri. Olti yuz sakkiz mingli ikkita son kichik sondan oldin turadi." },
      on_wrong: [
        null,
        { ru: 'Сейчас порядок возрастает. Начни с самого большого числа.', uz: "Hozir tartib o'sib boryapti. Eng katta sondan boshlang." },
        { ru: 'Сравни последние три цифры первых двух чисел.', uz: "Birinchi ikkita sonning oxirgi uchta raqamini taqqoslang." },
        { ru: 'Сначала сравни тысячи. Число с шестьюстами семью тысячами меньше.', uz: "Avval mingliklarni taqqoslang. Olti yuz yetti mingli son kichik." },
      ],
    },
  },
  s13: {
    eyebrow: { ru: 'Разбор финальной цепочки', uz: 'Yakuniy zanjir tahlili' },
    title: { ru: 'Три числа упорядочиваются двумя сравнениями', uz: 'Uchta son ikki taqqoslash bilan tartiblanadi' },
    lead: {
      ru: 'После выбора ответа докажем порядок: сравним соседей цепочки и назовём разряд, который решил каждую пару.',
      uz: "Javob tanlangach, tartibni isbotlaymiz: zanjirdagi qo'shni sonlarni taqqoslab, har bir juftlikni hal qilgan xonani aytamiz.",
    },
    comparisons: [
      {
        pair: '608 450  ?  608 405',
        formula: '608 450 > 608 405',
        reason: { ru: 'Первые четыре цифры совпали; в десятках 5 > 0.', uz: "Birinchi to'rtta raqam mos; o'nlarda 5 > 0." },
      },
      {
        pair: '608 405  ?  607 999',
        formula: '608 405 > 607 999',
        reason: { ru: 'Первое различие в тысячах: 8 > 7.', uz: 'Birinchi farq minglarda: 8 > 7.' },
      },
    ],
    chain: '608 450 > 608 405 > 607 999',
    conclusion: {
      ru: 'Если первое число больше второго, а второе больше третьего, вся цепочка записана по убыванию.',
      uz: "Birinchi son ikkinchisidan, ikkinchisi uchinchisidan katta bo'lsa, butun zanjir kamayish tartibida yozilgan bo'ladi.",
    },
    audio: {
      ru: [
        'В первой паре первые четыре цифры совпали. Сравнение решают десятки.',
        'Во второй паре первое различие находится в тысячах. Они и решают сравнение.',
        'Оба знака направлены от большего числа к меньшему. Двух сравнений достаточно для всей цепочки.',
      ],
      uz: [
        "Birinchi juftlikda dastlabki to'rtta raqam mos keladi. Taqqoslashni o'nlar hal qiladi.",
        "Ikkinchi juftlikda birinchi farq minglar xonasida. Taqqoslashni minglar hal qiladi.",
        "Ikkala belgi ham katta sondan kichik songa yo'nalgan. Butun zanjirni asoslash uchun ikkita taqqoslash yetarli.",
      ],
    },
  },
  s14: {
    eyebrow: { ru: 'Маршруты восстановлены', uz: "Yo'nalishlar tiklandi" },
    title: { ru: 'Теперь Бит сравнивает слева направо', uz: "Endi Bit chapdan o'ngga taqqoslaydi" },
    lead: { ru: 'Сортировщик снова работает. Ты умеешь объяснить не только знак, но и разряд, который решил сравнение.', uz: "Saralash qurilmasi yana ishlayapti. Siz nafaqat belgini, balki taqqoslashni hal qilgan xonani ham tushuntira olasiz." },
    takeaways: [
      { ru: 'Сначала сравни количество цифр.', uz: 'Avval raqamlar sonini taqqoslang.' },
      { ru: 'При равной длине ищи первую разную цифру слева.', uz: "Uzunlik teng bo'lsa, chapdagi birinchi farqli raqamni toping." },
      { ru: 'Если все разряды совпали, числа равны.', uz: "Barcha xonalar mos kelsa, sonlar teng." },
    ],
    bridge: { ru: 'Дальше узнаем, как заменять точное число близким круглым числом.', uz: "Keyingi darsda aniq sonni yaqin yumaloq son bilan almashtirishni o'rganamiz." },
    finish: { ru: 'Завершить урок', uz: 'Darsni yakunlash' },
    audio: {
      ru: [
        'Маршруты восстановлены. Теперь Бит сначала сравнивает количество цифр, затем ищет первое различие слева.',
        'В следующем уроке научимся заменять точное число близким круглым числом.',
      ],
      uz: [
        "Yo'nalishlar tiklandi. Endi Bit avval raqamlar sonini taqqoslaydi, keyin chapdagi birinchi farqni topadi.",
        "Keyingi darsda aniq sonni yaqin yumaloq son bilan almashtirishni o'rganamiz.",
      ],
    },
  },
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story', template: 'custom', goal: 'Create conflict from Bit sorting by the last digit', misconceptions: null, active: false, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'exploration', subtype: 'digit-count-core', template: 'custom', goal: 'Use digit count and the new highest place to compare unequal-length numbers', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's2', type: 'exploration', subtype: 'place-table-deep', template: 'custom', goal: 'Align equal-length numbers and stop at the first different place', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's3', type: 'exploration', subtype: 'number-line-sign', template: 'custom', goal: 'Connect rightward position on a number line with comparison signs', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's4', type: 'exploration', subtype: 'zeros-equality', template: 'custom', goal: 'Establish equality when every place including internal zeros matches', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's5', type: 'test', subtype: 'choice', template: 'MCScreen', goal: 'Check sign choice for close numbers', misconceptions: ['reversed_sign', 'assumed_equality', 'comparison_impossible'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's6', type: 'exploration', subtype: 'worked-wall', template: 'custom', goal: 'Contrast digit count, first difference, internal zero and equality examples', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's7', type: 'exploration', subtype: 'discovery', template: 'custom', goal: 'Explain why lower places cannot reverse the first difference', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's8', type: 'rule', subtype: 'rule-reveal', template: 'custom', goal: 'Assemble the comparison algorithm after discovery', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's9', type: 'exploration', subtype: 'sign-language', template: 'custom', goal: 'Read the same comparison from both sides and orient the sign', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's10', type: 'rule', subtype: 'strategy', template: 'custom', goal: 'Choose the most convenient comparison model', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's11', type: 'exploration', subtype: 'multi-error-lab', template: 'custom', goal: 'Repair last-digit, digit-sum and reversed-sign errors', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's12', type: 'test', subtype: 'choice', template: 'MCScreen', goal: 'Order city data in descending order and justify the order', misconceptions: ['ascending_order', 'wrong_close_pair', 'thousand_class_ignored'], active: true, scored: true, scope: 'final', resetOnReturn: false },
  { id: 's13', type: 'exploration', subtype: 'ordered-chain-proof', template: 'custom', goal: 'Prove a three-number descending chain with two adjacent comparisons', misconceptions: ['every pair must be compared', 'chain sign direction ignored'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's14', type: 'summary', subtype: 'reflection', template: 'custom', goal: 'Consolidate comparison and bridge to rounding', misconceptions: null, active: false, scored: false, scope: null, resetOnReturn: true },
];

const TOTAL_SCREENS = 15;
const FREE_NAV = false;
const MOBILE_DESIGN_W = 390;
const NOTION_FLOW = SCREEN_META.map((meta, screen) => ({ screen, meta, contentKeys: [meta.id] }));

const LESSON_META = {
  lessonId: 'num-4-04-v1',
  lessonTitle: {
    ru: 'Урок 4. Сравнение многозначных чисел',
    uz: "4-dars. Ko'p xonali sonlarni taqqoslash",
  },
  skillTags: ['multi_digit_comparison', 'digit_count', 'first_different_place', 'comparison_signs', 'number_ordering', 'ordered_chain_proof'],
  notionFlow: NOTION_FLOW,
};

let runtimeConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  studentName: '',
  voiceGender: 'f',
};

const configureLesson = (next) => {
  runtimeConfig = { ...runtimeConfig, ...next };
};

const LangContext = createContext('ru');
const useLang = () => useContext(LangContext);

const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value === null || value === undefined) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? value.ru ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return isMobile;
}

function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => {
      const zoom = window.innerWidth < breakpoint ? window.innerWidth / MOBILE_DESIGN_W : 1;
      root.style.setProperty('--g4z', String(zoom));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      root.style.removeProperty('--g4z');
    };
  }, [breakpoint]);
}

const buildTtsUrl = (base, text, gender) => {
  const encoded = encodeURIComponent(String(text).slice(0, 1000));
  return `${base}/api/tts?text=${encoded}&g=${gender === 'm' ? 'm' : 'f'}`;
};

class AudioEngine {
  constructor() {
    this.queue = [];
    this.index = 0;
    this.audio = null;
    this.previewUtterance = null;
    this.previewTimer = null;
    this.lang = 'ru';
    this.muted = false;
    this.isPlaying = false;
    this.onStateChange = null;
  }

  emit(extra = {}) {
    this.onStateChange?.({ isPlaying: this.isPlaying, muted: this.muted, ...extra });
  }

  ensureAudio() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'auto';
    }
    return this.audio;
  }

  setLang(lang) {
    this.lang = lang;
  }

  loadQueue(segments) {
    this.stop(false);
    this.queue = Array.isArray(segments) ? segments : [];
    this.index = 0;
  }

  start() {
    if (this.muted) {
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.emit({ completed: false });
    this.playCurrent();
  }

  playCurrent() {
    const segment = this.queue[this.index];
    if (!segment) {
      this.isPlaying = false;
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.playText(segment.text, () => {
      this.index += 1;
      this.playCurrent();
    }, segment.id);
  }

  playText(text, done, id = 'one-off') {
    if (!text || this.muted) {
      done?.();
      return;
    }
    const base = runtimeConfig.ttsApiBase;
    if (base) {
      const audio = this.ensureAudio();
      if (!audio) {
        done?.();
        return;
      }
      audio.onended = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.onerror = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.src = buildTtsUrl(base, text, runtimeConfig.voiceGender);
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          this.isPlaying = true;
          this.emit({ currentSegment: id });
        }).catch(() => {
          this.isPlaying = false;
          this.emit({ completed: true, currentSegment: null });
          done?.();
        });
      }
      return;
    }

    // Local preview only. LMS playback keeps using the HTTP TTS branch above.
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      done?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = this.lang === 'uz' ? 'uz-UZ' : 'ru-RU';
    utterance.rate = 0.94;
    utterance.onstart = () => {
      this.isPlaying = true;
      this.emit({ currentSegment: id });
    };
    utterance.onend = () => {
      if (this.previewUtterance === utterance) this.previewUtterance = null;
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    utterance.onerror = () => {
      if (this.previewUtterance === utterance) this.previewUtterance = null;
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    this.previewUtterance = utterance;
    this.previewTimer = window.setTimeout(() => {
      this.previewTimer = null;
      if (this.previewUtterance !== utterance || this.muted) return;
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        this.previewUtterance = null;
        done?.();
      }
    }, 50);
  }

  pushOneOff(text) {
    this.stop(false);
    this.queue = [{ id: `feedback-${Date.now()}`, text }];
    this.index = 0;
    this.start();
  }

  replay() {
    this.stop(false);
    this.index = 0;
    this.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stop(false);
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.index = 0;
    this.start();
  }

  stop(emit = true) {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.onended = null;
        this.audio.onerror = null;
      } catch {
        // Audio cleanup is best effort.
      }
    }
    if (this.previewTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.previewTimer);
      this.previewTimer = null;
    }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Preview speech cleanup is best effort.
      }
    }
    this.isPlaying = false;
    if (emit) this.emit({ currentSegment: null });
  }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const initiallyMuted = audioEngineInstance?.muted ?? false;
  const [state, setState] = useState({
    isPlaying: false,
    muted: initiallyMuted,
    completed: initiallyMuted,
    currentSegment: null,
  });

  /* eslint-disable react-hooks/refs -- stable queue prevents audio restart loops */
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const previousKeyRef = useRef(segmentsKey);
  if (previousKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    previousKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.onStateChange = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.loadQueue(stableSegments);
    if (stableSegments?.length && !engine.muted) {
      const timer = window.setTimeout(() => engine.start(), 250);
      return () => {
        window.clearTimeout(timer);
        engine.stop(false);
        engine.onStateChange = null;
      };
    }
    engine.emit({ completed: true, currentSegment: null });
    return () => {
      engine.stop(false);
      engine.onStateChange = null;
    };
  }, [stableSegments, lang]);

  return {
    ...state,
    replay: () => getAudioEngine()?.replay(),
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

const localizedSegments = (audioValue, lang, prefix) => {
  if (!audioValue) return [];
  const localized = audioValue[lang] ?? audioValue.ru ?? '';
  const values = Array.isArray(localized) ? localized : [localized];
  return values.filter(Boolean).map((text, index) => ({ id: `${prefix}-${index}`, text }));
};

function useCanAdvance(audio) {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);
  return FREE_NAV || audio.muted || audio.completed || timedOut;
}

function useAdvanceGate(solved, audio) {
  const [delayElapsed, setDelayElapsed] = useState(false);
  useEffect(() => {
    if (!solved) return undefined;
    const timer = window.setTimeout(() => setDelayElapsed(true), 900);
    return () => window.clearTimeout(timer);
  }, [solved]);
  if (FREE_NAV) return true;
  if (!solved) return false;
  if (audio.muted) return true;
  return delayElapsed && !audio.isPlaying;
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try {
    const sound = new Audio(url);
    sound.volume = 0.6;
    const promise = sound.play();
    promise?.catch?.(() => {});
  } catch {
    // SFX must never block the lesson.
  }
};

const buildOptionOrder = (length, correctIndex, seed = 0) => {
  const natural = Array.from({ length }, (_, index) => index);
  if (length < 2 || !natural.includes(correctIndex)) return natural;
  const target = Math.abs(seed * 3 + 1) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
};

const autoScrollTo = (element) => {
  if (!element || typeof element.scrollIntoView !== 'function') return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
};

function useRevealScroll(active, delay = 320) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return undefined;
    let timer = 0;
    const firstFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timer = window.setTimeout(() => autoScrollTo(ref.current), delay);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      window.clearTimeout(timer);
    };
  }, [active, delay]);
  return ref;
}

function useTimedReveal(count, interval = 520) {
  const [visible, setVisible] = useState(0);
  const [runKey, setRunKey] = useState(0);
  useEffect(() => {
    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const frame = requestAnimationFrame(() => setVisible(count));
      return () => cancelAnimationFrame(frame);
    }
    const resetFrame = requestAnimationFrame(() => setVisible(0));
    const timers = Array.from({ length: count }, (_, index) => (
      window.setTimeout(() => setVisible(index + 1), 340 + index * interval)
    ));
    return () => {
      cancelAnimationFrame(resetFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [count, interval, runKey]);
  return { visible, replay: () => setRunKey((value) => value + 1), runKey };
}

function useAudioSegmentReveal(audio, segments, count) {
  const [visible, setVisible] = useState(0);
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const fallback = reducedMotion || audio.muted || audio.completed;
  const segmentIds = segments.map((segment) => segment.id);
  const activeIndex = segmentIds.indexOf(audio.currentSegment);

  useEffect(() => {
    if (fallback) {
      const frame = requestAnimationFrame(() => setVisible(count));
      return () => cancelAnimationFrame(frame);
    }
    if (activeIndex >= 0) {
      const frame = requestAnimationFrame(() => setVisible(Math.min(count, activeIndex + 1)));
      return () => cancelAnimationFrame(frame);
    }
    return undefined;
  }, [activeIndex, count, fallback]);

  const replay = useCallback(() => {
    if (!reducedMotion && !audio.muted) setVisible(0);
    audio.replay();
  }, [audio, reducedMotion]);

  const toggleMute = useCallback(() => {
    setVisible(audio.muted ? 0 : count);
    audio.toggleMute();
  }, [audio, count]);

  return { visible, replay, toggleMute };
}

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const muteLabel = audio.muted
    ? (lang === 'uz' ? 'Ovozni yoqish' : 'Включить звук')
    : (lang === 'uz' ? "Ovozni o'chirish" : 'Выключить звук');
  const replayLabel = lang === 'uz' ? 'Qayta eshitish' : 'Повторить';
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>
          ↻
        </button>
      )}
    </div>
  );
};

const NextLabel = () => (useLang() === 'uz' ? 'Davom etish' : 'Дальше');
const BackLabel = () => (useLang() === 'uz' ? 'Orqaga' : 'Назад');

const NavBack = ({ onClick, hidden = false }) => (
  <button type="button" className="btn btn-ghost" onClick={onClick} style={{ visibility: hidden ? 'hidden' : 'visible' }}>
    <span aria-hidden="true">←</span><BackLabel />
  </button>
);

const NavNext = ({ onClick, disabled, finish = false }) => {
  const lang = useLang();
  return (
    <button type="button" className={`btn btn-white-accent ${!disabled ? 'btn-ready' : ''}`} onClick={onClick} disabled={disabled}>
      {finish ? (lang === 'uz' ? 'Darsni yakunlash' : 'Завершить урок') : <NextLabel />}
      <span aria-hidden="true">→</span>
    </button>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    hook: lang === 'uz' ? 'Missiya' : 'Миссия',
    exploration: lang === 'uz' ? 'Tushuntirish' : 'Объяснение',
    rule: lang === 'uz' ? 'Qoida' : 'Правило',
    test: lang === 'uz' ? 'Tekshiruv' : 'Проверка',
    summary: lang === 'uz' ? 'Yakun' : 'Итог',
  };
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const Stage = ({ screen, eyebrow, audio, children, nav }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const contentRef = useRef(null);
  const pad = isMobile ? 14 : 48;
  const meta = SCREEN_META[screen];

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [screen]);

  return (
    <main className={`stage stage-${meta.type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}>
          <div className="progress-fill progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title"><span className="status-dot" /><span>{t(eyebrow)}</span></div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={meta.type} />
            <AudioIndicator audio={audio} />
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section ref={contentRef} className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        {children}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
        {nav}
      </footer>
    </main>
  );
};

// The same canonical Bit used in grade 1-3 lessons and in Dars01.
const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};

const BitCoach = ({ text, mood = 'present', actionKey = 0 }) => (
  <div className="bit-coach" key={actionKey}>
    <div className="bit-coach-figure"><BitSVG state={mood} /></div>
    <div className="bit-speech"><span>{text}</span></div>
  </div>
);

const FeedbackBlock = ({ show, correct, children }) => {
  const lang = useLang();
  const revealRef = useRevealScroll(show);
  return (
    <div ref={revealRef} className={`feedback ${show ? 'feedback-visible' : ''}`} aria-hidden={!show} aria-live="polite">
      <div className={`feedback-card ${correct ? 'feedback-correct' : 'feedback-hint'}`}>
        <div className={`g4-bit-reaction-figure ${correct ? 'g4-bit-reaction-ok' : 'g4-bit-reaction-hint'}`}>
          <BitSVG state={correct ? 'nod' : 'awkward'} />
        </div>
        <div className="g4-bit-reaction-copy">
          <strong>{correct ? (lang === 'uz' ? 'YECHIM' : 'РЕШЕНИЕ') : (lang === 'uz' ? "YANA O'YLANG" : 'ПРОВЕРЬ СТРАТЕГИЮ')}</strong>
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
};

const ReplayReveal = ({ onClick }) => {
  const lang = useLang();
  return (
    <button type="button" className="btn btn-secondary replay-reveal" onClick={onClick}>
      <span aria-hidden="true">↻</span>{lang === 'uz' ? "Yana ko'rish" : 'Показать ещё раз'}
    </button>
  );
};

const ScreenHeading = ({ c }) => {
  const t = useT();
  return (
    <div className="heading-block">
      <h1 className="title h-title">{t(c.title)}</h1>
      <p className="lead">{t(c.lead)}</p>
    </div>
  );
};

const TheoryNav = ({ audio, onNext, onPrev, first = false }) => (
  <>
    <NavBack onClick={onPrev} hidden={first} />
    <NavNext onClick={onNext} disabled={!useCanAdvance(audio)} />
  </>
);

const StoryHookScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s0;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's0'));
  const reveal = useTimedReveal(3, 560);
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} first />}
    >
      <div className="screen-stack hook-stack">
        <ScreenHeading c={c} />
        <div className="city-sort-scene">
          <div className="city-grid" />
          <div className="sort-console">
            <span className="console-badge">{t(c.badge)}</span>
            <div className="route-order">
              <div className={`route-card route-wrong reveal-item ${reveal.visible >= 1 ? 'is-visible' : ''}`}>
                <small>ROUTE A</small><strong>842 107</strong><span>1</span>
              </div>
              <div className={`route-arrow reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`} aria-hidden="true">›</div>
              <div className={`route-card reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}>
                <small>ROUTE B</small><strong>842 190</strong><span>2</span>
              </div>
            </div>
            <div className={`sort-alert reveal-item ${reveal.visible >= 3 ? 'is-visible' : ''}`}>{t(c.prompt)}</div>
          </div>
          <div className="hook-bit">
            <BitSVG state="awkward" />
            <div className="bit-dark-speech">{t(c.bitLine)}</div>
          </div>
        </div>
        <ReplayReveal onClick={reveal.replay} />
      </div>
    </Stage>
  );
};

const RecapScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s1;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's1'));
  const reveal = useTimedReveal(5, 420);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack recap-stack">
        <ScreenHeading c={c} />
        <div className="recap-board">
          <div className={`recap-number reveal-item ${reveal.visible >= 1 ? 'is-visible' : ''}`}>
            <span>{c.left.number}</span><b>{t(c.left.count)}</b>
          </div>
          <div className={`recap-vs reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}>vs</div>
          <div className={`recap-number recap-number-big reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}>
            <span>{c.right.number}</span><b>{t(c.right.count)}</b>
          </div>
          <div className="step-rail recap-steps">
            {c.steps.map((step, index) => (
              <div key={t(step)} className={`model-step reveal-item ${reveal.visible >= index + 2 ? 'is-visible' : ''}`}>
                <span>{String(index + 1).padStart(2, '0')}</span><p>{t(step)}</p>
              </div>
            ))}
          </div>
          <div className={`recap-result reveal-item ${reveal.visible >= 5 ? 'is-visible' : ''}`}>
            <span aria-hidden="true">✓</span><b>{c.formula}</b><p>{t(c.conclusion)}</p>
          </div>
        </div>
        <BitCoach text={t(c.conclusion)} mood="point" actionKey={reveal.runKey} />
      </div>
    </Stage>
  );
};

const PlaceTableScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s2;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's2'));
  const reveal = useTimedReveal(8, 300);
  const headers = c.headers[lang] ?? c.headers.ru;
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack table-stack">
        <ScreenHeading c={c} />
        <div className="place-table-frame">
          <div className="place-table-grid place-table-head">
            {headers.map((header, index) => <span key={header} className={reveal.visible > index ? 'scan-done' : ''}>{header}</span>)}
          </div>
          {[c.a, c.b].map((row, rowIndex) => (
            <div className="place-table-grid place-table-row" key={row.join('')}>
              {row.map((digit, index) => (
                <span
                  key={`${rowIndex}-${index}`}
                  className={`${reveal.visible > index ? 'scan-done' : ''} ${index === c.firstDifferent && reveal.visible > index ? 'first-difference' : ''}`}
                >{digit}</span>
              ))}
            </div>
          ))}
          <div className={`table-scan-beam beam-${Math.min(reveal.visible, 6)}`} />
        </div>
        <div className={`explanation-callout reveal-item ${reveal.visible >= 6 ? 'is-visible' : ''}`}>{t(c.conclusion)}</div>
        <div className={`deep-contrast reveal-item ${reveal.visible >= 7 ? 'is-visible' : ''}`}>
          <div className="deep-contrast-numbers"><strong>{c.contrast.a}</strong><i>?</i><strong>{c.contrast.b}</strong></div>
          <div className="deep-contrast-trail">
            {c.contrast.trail.map((item, index) => <span className={index === 2 ? 'trail-stop' : ''} key={item}>{item}</span>)}
          </div>
          <div className={`deep-contrast-result reveal-item ${reveal.visible >= 8 ? 'is-visible' : ''}`}>
            <b>{c.contrast.result}</b><small>{t(c.contrast.note)}</small>
          </div>
        </div>
      </div>
    </Stage>
  );
};

const NumberLineScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s3;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's3'));
  const reveal = useTimedReveal(3, 600);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack line-stack">
        <ScreenHeading c={c} />
        <div className="number-line-card">
          <div className="line-scale"><span>{c.start}</span><span>{c.end}</span></div>
          <div className="number-line-track">
            <div className="line-ticks" />
            <div className={`line-point point-left reveal-item ${reveal.visible >= 1 ? 'is-visible' : ''}`}><i /><b>{c.left}</b></div>
            <div className={`line-point point-right reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}><i /><b>{c.right}</b></div>
            <div className={`line-flight reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}><span>→</span></div>
          </div>
          <div className={`formula-answer reveal-item ${reveal.visible >= 3 ? 'is-visible' : ''}`}>{c.formula}</div>
        </div>
        <BitCoach text={t(c.lead)} mood="point" actionKey={reveal.runKey} />
      </div>
    </Stage>
  );
};

const EqualityScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s4;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's4'));
  const reveal = useTimedReveal(3, 560);
  const digits = c.a.replace(' ', '').split('');
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack equality-stack">
        <ScreenHeading c={c} />
        <div className="equality-machine">
          <div className="digit-pairs">
            {digits.map((digit, index) => (
              <div key={`${digit}-${index}`} className={`digit-pair reveal-item ${reveal.visible >= 1 ? 'is-visible' : ''}`} style={{ '--delay': `${index * 80}ms` }}>
                <span>{digit}</span><i>=</i><span>{digit}</span>
              </div>
            ))}
          </div>
          <div className={`equal-pulse reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}>{c.formula}</div>
          <div className={`success-strip reveal-item ${reveal.visible >= 3 ? 'is-visible' : ''}`}><span>✓</span>{t(c.conclusion)}</div>
        </div>
      </div>
    </Stage>
  );
};

const ChoiceScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const t = useT();
  const lang = useLang();
  const intro = c.audio.intro;
  const audio = useAudio(localizedSegments(intro, lang, `s${screen}-intro`));
  const [attempted, setAttempted] = useState(storedAnswer?.attempted ?? []);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [wrongIndex, setWrongIndex] = useState(storedAnswer?.lastWrong ?? null);
  const order = useMemo(() => buildOptionOrder(c.options.length, c.correctIndex, screen), [c.options.length, c.correctIndex, screen]);
  const canChoose = useCanAdvance(audio);
  const canNext = useAdvanceGate(solved, audio);

  const pick = (sourceIndex) => {
    if (!canChoose || solved || attempted.includes(sourceIndex)) return;
    const nextAttempted = [...attempted, sourceIndex];
    setAttempted(nextAttempted);
    if (sourceIndex === c.correctIndex) {
      setSolved(true);
      setWrongIndex(null);
      playSfx('correct');
      audio.pushOneOff(t(c.audio.on_correct));
      onAnswer({
        screenIdx: screen,
        screenId: SCREEN_META[screen].id,
        studentAnswerIndex: sourceIndex,
        correct: true,
        firstTry: nextAttempted.length === 1,
        attempts: nextAttempted.length,
        attempted: nextAttempted,
        scope: SCREEN_META[screen].scope,
        skillTag: screen === 12 ? 'number_ordering' : 'first_different_place',
      });
    } else {
      setWrongIndex(sourceIndex);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio.on_wrong[sourceIndex]));
      onAnswer({
        screenIdx: screen,
        screenId: SCREEN_META[screen].id,
        studentAnswerIndex: sourceIndex,
        correct: false,
        firstTry: false,
        attempts: nextAttempted.length,
        attempted: nextAttempted,
        lastWrong: sourceIndex,
        scope: SCREEN_META[screen].scope,
        skillTag: screen === 12 ? 'number_ordering' : 'first_different_place',
      });
    }
  };

  const feedbackText = solved ? t(c.correctText) : (wrongIndex !== null ? t(c.wrong[wrongIndex]) : '');
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canNext} /></>}
    >
      <div className="screen-stack choice-stack">
        <ScreenHeading c={c} />
        <div className="answer-stage">
          <div className={`options-grid ${solved ? 'options-solved' : ''}`} role="group" aria-label={t(c.title)}>
            {order.map((sourceIndex, displayIndex) => {
              const inactiveWrong = attempted.includes(sourceIndex) && sourceIndex !== c.correctIndex;
              const correctReveal = solved && sourceIndex === c.correctIndex;
              return (
                <button
                  type="button"
                  className={`option ${inactiveWrong ? 'option-wrong' : ''} ${correctReveal ? 'option-correct-reveal' : ''}`}
                  key={sourceIndex}
                  onClick={() => pick(sourceIndex)}
                  disabled={!canChoose || solved || inactiveWrong}
                >
                  <span className="option-letter">{String.fromCharCode(65 + displayIndex)}</span>
                  <span>{t(c.options[sourceIndex])}</span>
                </button>
              );
            })}
          </div>
        </div>
        <FeedbackBlock show={solved || wrongIndex !== null} correct={solved}>{feedbackText}</FeedbackBlock>
      </div>
    </Stage>
  );
};

const WorkedExamplesScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s6;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's6'));
  const reveal = useTimedReveal(4, 430);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack examples-stack">
        <ScreenHeading c={c} />
        <div className="worked-grid">
          {c.examples.map((example, index) => (
            <article key={example.formula} className={`worked-card worked-${example.tone} reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{example.formula}</strong>
              <p>{t(example.reason)}</p>
            </article>
          ))}
        </div>
        <ReplayReveal onClick={reveal.replay} />
      </div>
    </Stage>
  );
};

const DiscoveryScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s7;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's7'));
  const reveal = useTimedReveal(4, 480);
  const pairs = c.a.replace(' ', '').split('').map((digit, index) => [digit, c.b.replace(' ', '')[index]]);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack discovery-stack">
        <ScreenHeading c={c} />
        <div className="discovery-lab">
          <div className="digit-lanes">
            {pairs.map((pair, index) => {
              const decision = index === 4;
              const faded = index > 4;
              return (
                <div key={`${pair.join('')}-${index}`} className={`lane-pair ${decision ? 'lane-decision' : ''} ${faded ? 'lane-faded' : ''} reveal-item ${reveal.visible >= (decision ? 2 : 1) ? 'is-visible' : ''}`}>
                  <span>{pair[0]}</span><i>{pair[0] === pair[1] ? '=' : '<'}</i><span>{pair[1]}</span>
                </div>
              );
            })}
          </div>
          <div className={`proof-strip reveal-item ${reveal.visible >= 3 ? 'is-visible' : ''}`}>{t(c.proof)}</div>
          <div className={`discovery-rule reveal-item ${reveal.visible >= 4 ? 'is-visible' : ''}`}><BitSVG state="idea" /><strong>{t(c.discovery)}</strong></div>
        </div>
      </div>
    </Stage>
  );
};

const RuleRevealScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s8;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's8'));
  const reveal = useTimedReveal(3, 580);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack rule-stack">
        <ScreenHeading c={c} />
        <div className="rule-path">
          {c.rules.map((rule, index) => (
            <article key={rule.n} className={`rule-card reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}>
              <span>{rule.n}</span><div><h2>{t(rule.title)}</h2><p>{t(rule.body)}</p></div>
            </article>
          ))}
          <div className="rule-path-line" />
        </div>
        <BitCoach text={t(c.rules[2].body)} mood="idea" actionKey={reveal.runKey} />
      </div>
    </Stage>
  );
};

const WorkedCheckpointScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s9;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's9'));
  const reveal = useTimedReveal(4, 440);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack checkpoint-stack">
        <ScreenHeading c={c} />
        <div className="checkpoint-board">
          {c.rows.map((row, index) => (
            <div key={t(row.formula)} className={`checkpoint-row reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}>
              <span>{String(index + 1).padStart(2, '0')}</span><strong>{t(row.formula)}</strong><i>→</i><p>{t(row.reason)}</p>
            </div>
          ))}
        </div>
        <div className="not-test-label"><span aria-hidden="true">◉</span>{t(c.lead)}</div>
      </div>
    </Stage>
  );
};

const StrategyScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s10;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's10'));
  const reveal = useTimedReveal(4, 450);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack strategy-stack">
        <ScreenHeading c={c} />
        <div className="strategy-grid">
          {c.strategies.map((strategy, index) => (
            <article key={strategy.example} className={`strategy-card reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}>
              <span className="strategy-icon">{strategy.icon}</span>
              <h2>{t(strategy.title)}</h2><p>{t(strategy.body)}</p><code>{strategy.example}</code>
            </article>
          ))}
        </div>
        <div className={`strategy-note reveal-item ${reveal.visible >= 4 ? 'is-visible' : ''}`}><BitSVG state="focus" /><span>{t(c.note)}</span></div>
      </div>
    </Stage>
  );
};

const ErrorWalkthroughScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s11;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's11'));
  const reveal = useTimedReveal(4, 500);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack error-stack">
        <ScreenHeading c={c} />
        <div className="error-workbench">
          <div className="error-lab-grid">
            {c.errors.map((item, index) => (
              <article key={item.wrong} className={`error-case reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}>
                <span>{t(item.tag)}</span>
                <div className="error-formula"><s>{item.wrong}</s><i>→</i><strong>{item.correct}</strong></div>
                <p>{t(item.why)}</p>
              </article>
            ))}
          </div>
          <div className={`correct-equation reveal-item ${reveal.visible >= 4 ? 'is-visible' : ''}`}><strong>01 → 02 → 03</strong><small>{t(c.repair)}</small></div>
          <div className="workbench-bit"><BitSVG state={reveal.visible >= 4 ? 'nod' : 'awkward'} /></div>
        </div>
      </div>
    </Stage>
  );
};

const ChainProofScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s13;
  const t = useT();
  const lang = useLang();
  const segments = useMemo(() => localizedSegments(c.audio, lang, 's13'), [c.audio, lang]);
  const audio = useAudio(segments);
  const reveal = useAudioSegmentReveal(audio, segments, 3);
  const syncedAudio = { ...audio, replay: reveal.replay, toggleMute: reveal.toggleMute };
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={syncedAudio} nav={<TheoryNav audio={syncedAudio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack chain-proof-stack">
        <ScreenHeading c={c} />
        <section className="chain-proof-board">
          <div className="chain-proof-comparisons">
            {c.comparisons.map((item, index) => (
              <article
                className={`chain-proof-card reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}
                aria-hidden={reveal.visible < index + 1}
                key={item.pair}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <small>{item.pair}</small>
                <strong>{item.formula}</strong>
                <p>{t(item.reason)}</p>
              </article>
            ))}
          </div>
          <div className={`chain-proof-result reveal-item ${reveal.visible >= 3 ? 'is-visible' : ''}`} aria-hidden={reveal.visible < 3}>
            <BitSVG state="idea" />
            <div><span>{lang === 'uz' ? 'TARTIB ISBOTLANDI' : 'ПОРЯДОК ДОКАЗАН'}</span><strong>{c.chain}</strong><p>{t(c.conclusion)}</p></div>
          </div>
        </section>
      </div>
    </Stage>
  );
};

const SummaryScreen = ({ screen, answers, onPrev, finishLesson }) => {
  const c = CONTENT.s14;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's14'));
  const canFinish = useCanAdvance(audio);
  const reveal = useTimedReveal(4, 430);
  const firstTry = [5, 12].filter((index) => answers[index]?.firstTry).length;
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={finishLesson} disabled={!canFinish} finish /></>}
    >
      <div className="screen-stack summary-stack">
        <div className="summary-hero">
          <div className={`summary-bit reveal-item ${reveal.visible >= 1 ? 'is-visible' : ''}`}><BitSVG state="wave" /></div>
          <div><h1 className="title h-title">{t(c.title)}</h1><p className="lead">{t(c.lead)}</p></div>
          <div className="summary-score"><strong>{firstTry}/2</strong><span>{lang === 'uz' ? "birinchi urinishda" : 'с первой попытки'}</span></div>
        </div>
        <div className="takeaway-grid">
          {c.takeaways.map((item, index) => (
            <div key={t(item)} className={`takeaway-card reveal-item ${reveal.visible >= index + 2 ? 'is-visible' : ''}`}><span>{index + 1}</span><p>{t(item)}</p></div>
          ))}
        </div>
        <div className={`bridge-card reveal-item ${reveal.visible >= 4 ? 'is-visible' : ''}`}><span>05</span><p>{t(c.bridge)}</p></div>
      </div>
    </Stage>
  );
};

const Screen0 = (props) => <StoryHookScreen {...props} screen={0} />;
const Screen1 = (props) => <RecapScreen {...props} screen={1} />;
const Screen2 = (props) => <PlaceTableScreen {...props} screen={2} />;
const Screen3 = (props) => <NumberLineScreen {...props} screen={3} />;
const Screen4 = (props) => <EqualityScreen {...props} screen={4} />;
const Screen5 = (props) => <ChoiceScreen {...props} screen={5} c={CONTENT.s5} />;
const Screen6 = (props) => <WorkedExamplesScreen {...props} screen={6} />;
const Screen7 = (props) => <DiscoveryScreen {...props} screen={7} />;
const Screen8 = (props) => <RuleRevealScreen {...props} screen={8} />;
const Screen9 = (props) => <WorkedCheckpointScreen {...props} screen={9} />;
const Screen10 = (props) => <StrategyScreen {...props} screen={10} />;
const Screen11 = (props) => <ErrorWalkthroughScreen {...props} screen={11} />;
const Screen12 = (props) => <ChoiceScreen {...props} screen={12} c={CONTENT.s12} />;
const Screen13 = (props) => <ChainProofScreen {...props} screen={13} />;
const Screen14 = (props) => <SummaryScreen {...props} screen={14} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6,
  Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14,
];

export default function Grade4Dars04({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished }) {
  useMobileZoom();
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    studentName: safeName,
    voiceGender: voiceGender || 'f',
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- duration requires a mount timestamp
  const startTimeRef = useRef(Date.now());
  const finishedRef = useRef(false);

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[data.screenIdx] = data;
      return next;
    });
  }, []);

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const scoredAnswers = [answers[5], answers[12]];
    const correctAnswers = scoredAnswers.filter((answer) => answer?.firstTry).length;
    const totalQuestions = 2;
    const finalScore = answers[12]?.firstTry ? 1 : 0;
    const finalTotal = 1;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang] ?? LESSON_META.lessonTitle.ru,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: Math.round((correctAnswers / totalQuestions) * 100),
      finalScore,
      finalTotal,
      passed: correctAnswers / totalQuestions >= 0.6,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredAnswers.reduce((sum, answer) => sum + (answer?.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars04 preview]', payload);
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className={`lesson-root ${preview ? 'lesson-preview' : ''}`}>
        {preview && (
          <div className="preview-language" aria-label="Preview language">
            {['ru', 'uz'].map((code) => (
              <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={current}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={recordAnswer}
          onNext={next}
          onPrev={previous}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

const STYLES = `
html:has(.lesson-root),
body:has(.lesson-root),
#root:has(.lesson-root),
.lesson-page:has(.lesson-root),
.lesson-frame:has(.lesson-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  overflow: hidden !important;
  overscroll-behavior: none;
}
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  contain: strict;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${T.ink};
  background:
    radial-gradient(circle at 12% 12%, rgba(22,143,163,.12), transparent 30%),
    radial-gradient(circle at 88% 80%, rgba(255,91,53,.10), transparent 32%),
    linear-gradient(145deg, #F7F8F4 0%, #EEF3F1 100%);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g4z, 1);
}
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root p,
.lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }
.lesson-root button { font: inherit; }
.title {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 650;
  line-height: 1.08;
  letter-spacing: -.012em;
}
.h-title { font-size: clamp(26px, 4.2vw, 36px); }
.lead {
  width: min(780px, 100%);
  color: ${T.ink2};
  font-size: clamp(14px, 1.8vw, 16px);
  line-height: 1.48;
}
.heading-block { display: grid; gap: 8px; }
.stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}
.stage-header {
  flex-shrink: 0;
  padding-top: 10px;
  padding-bottom: 8px;
  background: rgba(247,248,244,.88);
  backdrop-filter: blur(14px);
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: rgba(80,97,109,.16);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
  box-shadow: 0 0 12px rgba(255,91,53,.42);
  transition: width .45s ease;
}
.stage-chrome { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.chrome-title, .chrome-actions, .audio-controls { display: flex; align-items: center; gap: 9px; }
.chrome-title {
  color: ${T.ink2};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.65);
}
.screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-size: 10px;
  font-weight: 800;
}
.screen-count { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; }
.icon-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: ${T.ink2};
  background: rgba(255,255,255,.78);
  cursor: pointer;
  box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},.3);
  transition: transform .18s ease, background .18s ease;
}
.icon-btn:hover { transform: translateY(-1px); background: #FFFFFF; }
.stage-content {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  padding-top: clamp(8px, 1.4vw, 13px);
  padding-bottom: 12px;
}
.stage-nav {
  flex-shrink: 0;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  background: rgba(247,248,244,.92);
  border-top: 1px solid rgba(80,97,109,.14);
  backdrop-filter: blur(14px);
}
.screen-stack {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(12px, 2vw, 18px);
  animation: screen-in .5s cubic-bezier(.22,.8,.3,1) both;
}
@keyframes screen-in {
  from { opacity: 0; transform: translateY(16px) scale(.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.btn {
  min-height: 48px;
  padding: 11px 20px;
  border: 0;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease;
}
.btn-white-accent {
  margin-left: auto;
  color: ${T.accent};
  background: #FFFFFF;
  box-shadow: 0 9px 24px -12px rgba(255,91,53,.52), 0 0 0 1px rgba(255,91,53,.14);
}
.btn-white-accent:hover:not(:disabled), .btn-white-accent.btn-ready {
  color: #FFFFFF;
  background: ${T.accent};
  box-shadow: 0 12px 28px -12px rgba(255,91,53,.65);
}
.btn-ready { animation: ready-pulse 1.6s ease-in-out infinite; }
@keyframes ready-pulse { 50% { transform: scale(1.035); box-shadow: 0 14px 32px -10px rgba(255,91,53,.68); } }
.btn-ghost { color: ${T.ink2}; background: transparent; }
.btn-ghost:hover { background: #FFFFFF; box-shadow: 0 8px 20px -15px rgba(${T.shadowBase},.4); }
.btn-secondary {
  color: ${T.cyan};
  background: #FFFFFF;
  box-shadow: 0 8px 22px -14px rgba(22,143,163,.55), 0 0 0 1px rgba(22,143,163,.12);
}
.btn-secondary:hover:not(:disabled) { color: #FFFFFF; background: ${T.cyan}; }
.btn:disabled { opacity: .4; cursor: not-allowed; animation: none; box-shadow: none; }
.replay-reveal { min-height: 44px; padding: 8px 14px; align-self: flex-end; font-size: 12px; }
.reveal-item {
  opacity: 0;
  transform: translateY(14px) scale(.985);
  filter: blur(3px);
  transition: opacity .6s ease, transform .7s cubic-bezier(.16,1,.3,1), filter .55s ease;
}
.reveal-item.is-visible { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }

/* Canonical Bit movement vocabulary from Dars01. */
.g1-char { width: 100%; height: 100%; overflow: visible; }
.g1-bit-wave, .bit-wave-left, .bit-wave-right, .bit-point-arm, .bit-think-hand,
.bit-nod-hand, .g1-bit-ant, .bit-idea-bulb, .bit-focus-scan {
  transform-box: fill-box;
  transform-origin: center;
}
.g1-bit-wave { animation: bit-wave 1.8s ease-in-out infinite; transform-origin: 20% 80%; }
.bit-double-wave .bit-wave-left { animation: bit-wave-left 1.15s ease-in-out infinite; transform-origin: 80% 80%; }
.bit-double-wave .bit-wave-right { animation: bit-wave 1.15s ease-in-out .12s infinite; transform-origin: 20% 80%; }
.bit-point-arm { animation: bit-point 1.6s ease-in-out infinite; transform-origin: 10% 70%; }
.bit-point-target { animation: target-pulse 1.4s ease-in-out infinite; transform-origin: center; }
.bit-think-hand { animation: think-hand 1.8s ease-in-out infinite; transform-origin: 20% 80%; }
.bit-idea-bulb { animation: bulb-pop 1.55s ease-in-out infinite; }
.bit-focus-scan { animation: focus-scan 1.7s ease-in-out infinite; }
.bit-nod-check { animation: nod-check .8s cubic-bezier(.16,1,.3,1) both; transform-origin: center; }
.g1-char-state-nod { animation: bit-nod .95s ease-in-out both; }
.g1-char-state-awkward .g1-bit-ant { animation: bit-awkward-ant .75s ease both; transform-origin: bottom; }
@keyframes bit-wave { 0%,100% { transform: rotate(0); } 45% { transform: rotate(13deg); } }
@keyframes bit-wave-left { 0%,100% { transform: rotate(0); } 45% { transform: rotate(-13deg); } }
@keyframes bit-point { 0%,100% { transform: rotate(0); } 50% { transform: rotate(-5deg) translateX(2px); } }
@keyframes target-pulse { 50% { transform: scale(1.2); opacity: .65; } }
@keyframes think-hand { 50% { transform: rotate(-4deg) translateY(-2px); } }
@keyframes bulb-pop { 0%,100% { transform: scale(.92); } 45% { transform: scale(1.12) rotate(3deg); } }
@keyframes focus-scan { 0%,100% { transform: translateY(-5px); opacity: .55; } 50% { transform: translateY(8px); opacity: 1; } }
@keyframes nod-check { from { opacity: 0; transform: scale(.3) rotate(-15deg); } to { opacity: 1; transform: scale(1); } }
@keyframes bit-nod { 35% { transform: translateY(3px) rotate(2deg); } 70% { transform: translateY(-2px); } }
@keyframes bit-awkward-ant { to { transform: rotate(-13deg) translateY(2px); } }
.bit-coach { display: flex; align-items: center; justify-content: center; gap: 10px; }
.bit-coach-figure { width: 66px; height: 82px; flex: 0 0 66px; animation: coach-enter .72s cubic-bezier(.16,1,.3,1) both; }
@keyframes coach-enter { from { opacity: 0; transform: translateY(12px) scale(.88); } to { opacity: 1; transform: none; } }
.bit-speech {
  max-width: 540px;
  padding: 10px 14px;
  border-radius: 15px 15px 15px 4px;
  color: ${T.ink2};
  background: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  box-shadow: 0 12px 25px -20px rgba(${T.shadowBase},.48);
}

/* Hook: Lumo City route console. */
.city-sort-scene {
  position: relative;
  isolation: isolate;
  width: min(790px, 100%);
  min-height: 250px;
  margin: 0 auto;
  padding: 22px 190px 22px 22px;
  border-radius: 25px;
  overflow: hidden;
  color: #EAF9FB;
  background:
    radial-gradient(circle at 87% 20%, rgba(121,211,218,.18), transparent 25%),
    linear-gradient(140deg, rgba(22,143,163,.28), transparent 48%),
    linear-gradient(135deg, #153B50, #0B2232 72%);
  box-shadow: 0 24px 52px -30px rgba(14,33,44,.78);
}
.city-sort-scene::after { content: ''; position: absolute; inset: 1px; border: 1px solid rgba(144,228,235,.12); border-radius: 24px; pointer-events: none; }
.city-grid { position: absolute; inset: 0; z-index: -1; opacity: .16; background-image: linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px); background-size: 28px 28px; }
.sort-console { display: grid; gap: 14px; position: relative; z-index: 2; }
.console-badge { width: max-content; padding: 5px 8px; border: 1px solid rgba(255,183,107,.25); border-radius: 999px; color: #FFD29E; background: rgba(169,111,19,.18); font: 800 11px 'JetBrains Mono', monospace; letter-spacing: .12em; }
.route-order { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; }
.route-card { position: relative; min-width: 0; padding: 12px; border: 1px solid rgba(121,211,218,.18); border-radius: 16px; background: rgba(1,13,22,.52); box-shadow: inset 0 0 22px rgba(121,211,218,.04); }
.route-card small { display: block; color: #79D3DA; font: 800 11px 'JetBrains Mono', monospace; letter-spacing: .12em; }
.route-card strong { display: block; margin-top: 7px; color: #FFFFFF; font: 850 clamp(18px,3vw,28px) 'JetBrains Mono', monospace; white-space: nowrap; }
.route-card > span { position: absolute; top: -9px; right: -7px; width: 25px; height: 25px; display: grid; place-items: center; border-radius: 50%; color: #FFFFFF; background: ${T.cyan}; font: 900 11px 'JetBrains Mono', monospace; }
.route-wrong { border-color: rgba(255,91,53,.45); box-shadow: inset 0 0 30px rgba(255,91,53,.08), 0 0 0 3px rgba(255,91,53,.08); }
.route-wrong > span { background: ${T.accent}; animation: alert-pulse 1.4s ease-in-out infinite; }
.route-arrow { color: #79D3DA; font: 300 38px 'Manrope', sans-serif; }
.sort-alert { padding: 9px 12px; border-radius: 12px; color: #FFD4C9; background: rgba(255,91,53,.13); font-size: 11px; font-weight: 750; line-height: 1.35; }
.hook-bit { position: absolute; right: 24px; bottom: 13px; width: 136px; }
.hook-bit > svg { width: 102px; height: 128px; margin-left: 18px; }
.bit-dark-speech { position: absolute; right: 74px; bottom: 92px; width: 174px; padding: 9px 12px; border: 1px solid rgba(255,255,255,.14); border-radius: 14px 14px 4px 14px; color: #EAF9FB; background: rgba(7,26,38,.92); font-size: 10px; line-height: 1.38; box-shadow: 0 12px 28px -18px #000; }
@keyframes alert-pulse { 50% { transform: scale(1.12); box-shadow: 0 0 18px rgba(255,91,53,.65); } }

/* Recap and digit-count explanation. */
.recap-board, .model-frame, .place-table-frame, .number-line-card, .scan-console,
.equality-machine, .discovery-lab, .checkpoint-board, .error-workbench {
  width: min(790px, 100%);
  margin: 0 auto;
  border-radius: 22px;
  background: rgba(255,255,255,.88);
  box-shadow: 0 20px 44px -32px rgba(${T.shadowBase},.48), inset 0 0 0 1px rgba(80,97,109,.08);
}
.recap-board { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 14px; padding: 24px; }
.recap-number { min-height: 116px; padding: 18px; display: grid; place-items: center; gap: 7px; border-radius: 18px; background: ${T.cyanSoft}; }
.recap-number-big { background: ${T.accentSoft}; }
.recap-number span { color: ${T.navy}; font: 850 clamp(22px,4vw,36px) 'JetBrains Mono', monospace; white-space: nowrap; }
.recap-number b { color: ${T.cyan}; font-size: 12px; }
.recap-number-big b { color: ${T.accent}; }
.recap-vs { color: ${T.ink3}; font: 800 12px 'JetBrains Mono', monospace; }
.recap-steps { grid-column: 1 / -1; }
.recap-result { grid-column: 1 / -1; display: grid; grid-template-columns: auto auto 1fr; align-items: center; justify-content: center; gap: 9px; padding: 10px; border-radius: 12px; color: ${T.success}; background: ${T.successSoft}; font-size: 12px; font-weight: 800; }
.recap-result > span { width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; color: #FFFFFF; background: ${T.success}; }
.recap-result > b { color: ${T.navy}; font: 900 15px 'JetBrains Mono',monospace; }.recap-result > p { font-size: 10px; }
.digit-count-model { padding: 20px; display: grid; gap: 15px; }
.formula-display { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 14px; }
.formula-display span { padding: 13px; border-radius: 15px; color: ${T.navy}; background: #F8FAF8; text-align: center; font: 850 clamp(21px,4vw,34px) 'JetBrains Mono', monospace; }
.formula-display i { color: ${T.accent}; font: 900 30px 'Source Serif 4', serif; font-style: normal; }
.step-rail { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.model-step { min-height: 76px; padding: 10px; border-radius: 14px; display: flex; align-items: center; gap: 9px; background: ${T.cyanSoft}; }
.model-step > span { width: 29px; height: 29px; flex: 0 0 29px; display: grid; place-items: center; border-radius: 9px; color: #FFFFFF; background: ${T.cyan}; font: 850 9px 'JetBrains Mono', monospace; }
.model-step p { color: ${T.ink2}; font-size: 11px; font-weight: 750; line-height: 1.35; }
.formula-answer { padding: 11px 16px; border-radius: 14px; color: ${T.success}; background: ${T.successSoft}; text-align: center; font: 900 clamp(18px,3.2vw,26px) 'JetBrains Mono', monospace; box-shadow: 0 12px 24px -20px rgba(34,122,83,.48); }

/* Place table scanning. */
.place-table-frame { position: relative; padding: 15px; overflow: hidden; }
.place-table-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); }
.place-table-grid > span { min-width: 0; display: grid; place-items: center; border-right: 1px solid rgba(80,97,109,.10); opacity: .42; transition: color .45s ease, background .45s ease, opacity .45s ease, transform .45s ease; }
.place-table-grid > span:last-child { border-right: 0; }
.place-table-head > span { min-height: 37px; color: ${T.ink3}; background: #F6F8F6; font-size: 10px; font-weight: 800; text-align: center; }
.place-table-row > span { min-height: 55px; color: ${T.navy}; background: #FFFFFF; font: 850 clamp(18px,3vw,28px) 'JetBrains Mono', monospace; }
.place-table-row + .place-table-row { border-top: 1px solid rgba(80,97,109,.10); }
.place-table-grid > span.scan-done { opacity: 1; }
.place-table-grid > span.first-difference { color: #FFFFFF; background: ${T.accent}; transform: scale(.94); border-radius: 10px; box-shadow: 0 8px 18px -10px rgba(255,91,53,.7); }
.table-scan-beam { position: absolute; top: 15px; bottom: 15px; left: 15px; width: calc((100% - 30px) / 6); pointer-events: none; border: 2px solid rgba(22,143,163,.35); border-radius: 11px; box-shadow: 0 0 22px rgba(22,143,163,.16); transition: transform .38s cubic-bezier(.22,.8,.3,1); }
.beam-1 { transform: translateX(0); }.beam-2 { transform: translateX(100%); }.beam-3 { transform: translateX(200%); }.beam-4 { transform: translateX(300%); }.beam-5 { transform: translateX(400%); border-color: rgba(255,91,53,.55); }.beam-6 { transform: translateX(400%); border-color: rgba(255,91,53,.55); }
.explanation-callout { width: min(700px,100%); margin: 0 auto; padding: 11px 14px; border-left: 4px solid ${T.accent}; border-radius: 0 13px 13px 0; color: ${T.ink2}; background: ${T.accentSoft}; font-size: 12px; font-weight: 750; line-height: 1.4; }
.deep-contrast { width: min(700px,100%); margin: 0 auto; padding: 11px; border-radius: 15px; display: grid; grid-template-columns: 1fr auto 1.2fr; align-items: center; gap: 9px; background: #FFFFFF; box-shadow: 0 12px 25px -21px rgba(${T.shadowBase},.46); }
.deep-contrast-numbers { display: flex; align-items: center; justify-content: center; gap: 6px; }.deep-contrast-numbers strong { color: ${T.navy}; font: 850 13px 'JetBrains Mono',monospace; }.deep-contrast-numbers i { color: ${T.accent}; font-style: normal; font-weight: 900; }
.deep-contrast-trail { display: flex; gap: 4px; }.deep-contrast-trail span { padding: 5px 6px; border-radius: 8px; color: ${T.cyan}; background: ${T.cyanSoft}; font: 800 11px 'JetBrains Mono',monospace; }.deep-contrast-trail .trail-stop { color: #FFFFFF; background: ${T.accent}; }
.deep-contrast-result { display: grid; gap: 2px; }.deep-contrast-result b { color: ${T.success}; font: 850 12px 'JetBrains Mono',monospace; }.deep-contrast-result small { color: ${T.ink2}; font-size: 11px; line-height: 1.35; }

/* Number line and first-difference scan. */
.number-line-card { padding: 22px 26px 18px; }
.line-scale { display: flex; justify-content: space-between; color: ${T.ink3}; font: 750 11px 'JetBrains Mono', monospace; }
.number-line-track { position: relative; height: 116px; margin: 2px 16px 0; }
.line-ticks { position: absolute; left: 0; right: 0; top: 58px; height: 4px; border-radius: 999px; background: linear-gradient(90deg, ${T.cyan}, ${T.accent}); }
.line-ticks::after { content: ''; position: absolute; inset: -8px 0; opacity: .25; background: repeating-linear-gradient(90deg, transparent 0 calc(10% - 1px), ${T.ink2} calc(10% - 1px) 10%); }
.line-point { position: absolute; top: 22px; display: grid; justify-items: center; gap: 5px; }
.line-point i { width: 18px; height: 18px; border: 5px solid #FFFFFF; border-radius: 50%; background: ${T.cyan}; box-shadow: 0 0 0 3px rgba(22,143,163,.18), 0 7px 13px -7px rgba(${T.shadowBase},.6); }
.line-point b { padding: 5px 7px; border-radius: 8px; color: ${T.navy}; background: #FFFFFF; font: 800 10px 'JetBrains Mono', monospace; box-shadow: 0 8px 17px -13px rgba(${T.shadowBase},.5); }
.point-left { left: 5%; }.point-right { right: 5%; }
.point-right i { background: ${T.accent}; box-shadow: 0 0 0 3px rgba(255,91,53,.17), 0 7px 13px -7px rgba(${T.shadowBase},.6); }
.line-flight { position: absolute; left: 25%; right: 25%; top: 58px; color: ${T.accent}; text-align: center; font-size: 28px; transform-origin: left; }
.line-flight.is-visible { animation: flight-in .8s cubic-bezier(.16,1,.3,1) both; }
@keyframes flight-in { from { opacity: 0; transform: scaleX(.15); } to { opacity: 1; transform: scaleX(1); } }
.scan-console { padding: 18px; display: grid; gap: 15px; background: linear-gradient(145deg,#173B52,#102C3E); color: #FFFFFF; }
.scan-numbers { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.scan-numbers strong { padding: 12px; border: 1px solid rgba(121,211,218,.16); border-radius: 14px; background: rgba(1,13,22,.36); text-align: center; font: 850 clamp(22px,4vw,34px) 'JetBrains Mono', monospace; }
.comparison-scan { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }
.scan-chip { min-height: 76px; padding: 10px; border: 1px solid rgba(121,211,218,.15); border-radius: 13px; display: grid; place-items: center; gap: 3px; background: rgba(121,211,218,.08); }
.scan-chip b { color: #9DE3E7; font: 850 17px 'JetBrains Mono', monospace; }
.scan-chip span { color: rgba(234,249,251,.7); font-size: 11px; font-weight: 750; text-align: center; }
.scan-decision { border-color: rgba(255,183,107,.3); background: rgba(255,91,53,.16); }
.scan-decision b { color: #FFD29E; }
.decision-banner { padding: 10px 13px; border-radius: 13px; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #B5F2D2; background: rgba(34,122,83,.2); }
.decision-banner span { font: 850 17px 'JetBrains Mono', monospace; }.decision-banner small { max-width: 340px; text-align: right; font-size: 11px; line-height: 1.35; }

/* Equality machine. */
.equality-machine { padding: 21px; display: grid; gap: 14px; }
.digit-pairs { display: grid; grid-template-columns: repeat(6, 1fr); gap: 7px; }
.digit-pair { min-height: 96px; padding: 8px 4px; border-radius: 13px; display: grid; place-items: center; background: #F7F9F7; animation-delay: var(--delay); }
.digit-pair.is-visible { animation: pair-match .72s cubic-bezier(.16,1,.3,1) var(--delay) both; }
.digit-pair span { color: ${T.navy}; font: 850 21px 'JetBrains Mono', monospace; }
.digit-pair i { color: ${T.cyan}; font: 850 10px 'JetBrains Mono', monospace; font-style: normal; }
@keyframes pair-match { from { opacity: 0; transform: translateY(10px) scale(.9); } 70% { transform: translateY(-2px) scale(1.04); } to { opacity: 1; transform: none; } }
.equal-pulse { padding: 11px; border-radius: 14px; color: ${T.cyan}; background: ${T.cyanSoft}; text-align: center; font: 900 clamp(19px,3vw,27px) 'JetBrains Mono', monospace; }
.equal-pulse.is-visible { animation: equal-glow 1.2s ease both; }
@keyframes equal-glow { 50% { box-shadow: 0 0 0 8px rgba(22,143,163,.09); } }
.success-strip { padding: 9px 12px; border-radius: 12px; display: flex; justify-content: center; align-items: center; gap: 8px; color: ${T.success}; background: ${T.successSoft}; font-size: 11px; font-weight: 800; }

/* Two deliberate tests only. */
.choice-stack { justify-content: flex-start; }
.options-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.option {
  min-height: 61px;
  padding: 12px 14px;
  border: 1px solid rgba(80,97,109,.10);
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${T.ink};
  background: linear-gradient(145deg,#FFFFFF,#FBFCFA);
  cursor: pointer;
  text-align: left;
  font-weight: 650;
  box-shadow: 0 10px 24px -17px rgba(${T.shadowBase},.44);
  transition: transform .18s ease, box-shadow .18s ease, opacity .3s ease, background .3s ease;
  animation: option-in .45s cubic-bezier(.16,1,.3,1) both;
}
.option:nth-child(2) { animation-delay: .07s; }.option:nth-child(3) { animation-delay: .14s; }.option:nth-child(4) { animation-delay: .21s; }
@keyframes option-in { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
.option:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},.5), 0 0 0 3px rgba(22,143,163,.07); }
.option:disabled { cursor: default; }.option-wrong { opacity: .25; filter: grayscale(.65); }
.option-correct-reveal { color: ${T.success}; background: ${T.successSoft}; box-shadow: 0 0 0 2px rgba(34,122,83,.18), 0 12px 26px -17px rgba(34,122,83,.45); }
.option-letter { width: 27px; height: 27px; flex: 0 0 27px; display: grid; place-items: center; border-radius: 8px; color: ${T.cyan}; background: ${T.cyanSoft}; font: 800 11px 'JetBrains Mono', monospace; }
.feedback { max-height: 0; opacity: 0; overflow: hidden; transform: translateY(8px); transition: max-height .8s cubic-bezier(.22,.8,.3,1), opacity .6s ease, transform .7s ease; }
.feedback-visible { max-height: 260px; opacity: 1; transform: translateY(0); }
.feedback-card { min-height: 88px; padding: 8px 15px 8px 9px; border: 1px solid transparent; border-radius: 18px; display: flex; gap: 13px; align-items: center; line-height: 1.42; font-size: 14px; box-shadow: 0 14px 28px -22px rgba(${T.shadowBase},.48); }
.feedback-correct { border-color: rgba(34,122,83,.18); color: ${T.success}; background: linear-gradient(135deg,#FFFFFF,${T.successSoft}); }
.feedback-hint { border-color: rgba(169,111,19,.20); color: ${T.warn}; background: linear-gradient(135deg,#FFFFFF,${T.warnSoft}); }
.g4-bit-reaction-figure { width: 62px; height: 76px; flex: 0 0 62px; }.g4-bit-reaction-figure .g1-char { width: 100%; height: 100%; }
.g4-bit-reaction-copy { flex: 1; min-width: 0; display: grid; gap: 3px; font-family: 'Source Serif 4',Georgia,serif; font-size: clamp(15px,2vw,18px); font-weight: 700; }
.g4-bit-reaction-copy p { color: ${T.ink2}; font: 700 11px/1.4 'Manrope',sans-serif; }
.g4-bit-reaction-ok { animation: reaction-hop .72s ease both; }.g4-bit-reaction-hint { animation: reaction-awkward .9s cubic-bezier(.22,.8,.3,1) both; }
@keyframes reaction-hop { 35% { transform: translateY(-9px) scale(1.08); } 65% { transform: none; } }
@keyframes reaction-awkward { 25% { transform: translateX(-3px) rotate(-3deg); } 50% { transform: translateX(2px) translateY(3px) rotate(2deg); } 100% { transform: translateY(4px) rotate(-1deg); } }

/* Worked examples and discovery. */
.worked-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
.worked-card { position: relative; min-height: 110px; padding: 15px 15px 13px 50px; border-radius: 17px; display: grid; align-content: center; gap: 5px; background: #FFFFFF; box-shadow: 0 14px 30px -23px rgba(${T.shadowBase},.5); overflow: hidden; }
.worked-card > span { position: absolute; left: 14px; top: 15px; width: 25px; height: 25px; display: grid; place-items: center; border-radius: 8px; color: #FFFFFF; background: ${T.cyan}; font: 850 8px 'JetBrains Mono',monospace; }
.worked-card strong { color: ${T.navy}; font: 850 clamp(15px,2.5vw,21px) 'JetBrains Mono',monospace; white-space: nowrap; }
.worked-card p { color: ${T.ink2}; font-size: 10px; font-weight: 750; line-height: 1.35; }
.worked-card::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${T.cyan}; }
.worked-accent::after,.worked-accent > span { background: ${T.accent}; }.worked-lime::after,.worked-lime > span { background: ${T.success}; }.worked-navy::after,.worked-navy > span { background: ${T.navy}; }
.discovery-lab { padding: 18px; display: grid; gap: 13px; }
.digit-lanes { display: grid; grid-template-columns: repeat(6,1fr); gap: 6px; }
.lane-pair { min-height: 96px; padding: 7px 3px; border-radius: 12px; display: grid; place-items: center; color: ${T.navy}; background: #F5F8F6; }
.lane-pair span { font: 850 20px 'JetBrains Mono',monospace; }.lane-pair i { color: ${T.cyan}; font: 850 9px 'JetBrains Mono',monospace; font-style: normal; }
.lane-decision { color: #FFFFFF; background: ${T.accent}; box-shadow: 0 10px 22px -14px rgba(255,91,53,.7); }.lane-decision i { color: #FFFFFF; }
.lane-faded { opacity: .28 !important; filter: grayscale(.6) blur(0) !important; }
.proof-strip { padding: 10px 12px; border-radius: 12px; color: ${T.warn}; background: ${T.warnSoft}; font-size: 11px; font-weight: 750; text-align: center; }
.discovery-rule { min-height: 82px; padding: 7px 15px 7px 8px; border-radius: 16px; display: flex; align-items: center; gap: 10px; color: ${T.success}; background: ${T.successSoft}; font-family: 'Source Serif 4',serif; font-size: clamp(15px,2.2vw,19px); }
.discovery-rule > svg { width: 58px; height: 72px; flex: 0 0 58px; }

/* Rule, worked checkpoint and strategy. */
.rule-path { position: relative; width: min(790px,100%); margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 11px; }
.rule-path-line { position: absolute; left: 13%; right: 13%; top: 31px; height: 3px; z-index: -1; background: linear-gradient(90deg,${T.cyan},${T.accent},${T.success}); }
.rule-card { min-height: 152px; padding: 15px; border-radius: 18px; display: grid; align-content: start; gap: 11px; background: #FFFFFF; box-shadow: 0 15px 32px -24px rgba(${T.shadowBase},.5); }
.rule-card > span { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 11px; color: #FFFFFF; background: ${T.cyan}; font: 850 9px 'JetBrains Mono',monospace; }
.rule-card:nth-child(2) > span { background: ${T.accent}; }.rule-card:nth-child(3) > span { background: ${T.success}; }
.rule-card h2 { font: 700 16px/1.2 'Source Serif 4',serif; }.rule-card p { margin-top: 5px; color: ${T.ink2}; font-size: 10px; font-weight: 650; line-height: 1.4; }
.checkpoint-board { padding: 10px 15px; }
.checkpoint-row { min-height: 56px; display: grid; grid-template-columns: 28px minmax(175px,.8fr) auto 1fr; align-items: center; gap: 10px; border-bottom: 1px solid rgba(80,97,109,.10); }
.checkpoint-row:last-child { border-bottom: 0; }.checkpoint-row > span { color: ${T.cyan}; font: 850 10px 'JetBrains Mono',monospace; }.checkpoint-row strong { color: ${T.navy}; font: 850 clamp(13px,2vw,18px) 'JetBrains Mono',monospace; white-space: nowrap; }.checkpoint-row i { color: ${T.accent}; font-style: normal; }.checkpoint-row p { color: ${T.ink2}; font-size: 12px; font-weight: 700; line-height: 1.35; }
.not-test-label { align-self: center; display: flex; align-items: center; gap: 7px; color: ${T.cyan}; font-size: 10px; font-weight: 800; }.not-test-label > span { animation: data-node-pulse 1.9s ease-in-out infinite; }
@keyframes data-node-pulse { 50% { transform: scale(.72); opacity: .6; } }
.strategy-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 11px; }
.strategy-card { min-height: 164px; padding: 15px; border-radius: 18px; display: grid; align-content: start; gap: 7px; background: #FFFFFF; box-shadow: 0 15px 32px -24px rgba(${T.shadowBase},.5); }
.strategy-icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 12px; color: ${T.cyan}; background: ${T.cyanSoft}; font: 900 18px 'JetBrains Mono',monospace; }.strategy-card:nth-child(2) .strategy-icon { color: ${T.accent}; background: ${T.accentSoft}; }.strategy-card:nth-child(3) .strategy-icon { color: ${T.success}; background: ${T.successSoft}; }
.strategy-card h2 { font: 700 16px/1.18 'Source Serif 4',serif; }.strategy-card p { color: ${T.ink2}; font-size: 12px; line-height: 1.42; }.strategy-card code { margin-top: auto; color: ${T.navy}; font: 800 12px 'JetBrains Mono',monospace; }
.strategy-note { min-height: 75px; padding: 4px 14px 4px 7px; border-radius: 16px; display: flex; align-items: center; gap: 10px; color: ${T.success}; background: ${T.successSoft}; font-size: 11px; font-weight: 750; }.strategy-note > svg { width: 56px; height: 68px; flex: 0 0 56px; }

/* Error repair. */
.error-workbench { position: relative; padding: 13px 115px 13px 13px; display: grid; gap: 9px; overflow: hidden; }
.error-lab-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 7px; }
.error-case { min-height: 128px; padding: 9px; border: 1px solid rgba(169,111,19,.14); border-radius: 13px; display: grid; align-content: start; gap: 7px; background: linear-gradient(145deg,#FFFFFF,${T.warnSoft}); }
.error-case > span { width: max-content; max-width: 100%; padding: 4px 6px; border-radius: 7px; color: #FFFFFF; background: ${T.warn}; font-size: 10px; font-weight: 850; white-space: nowrap; }
.error-formula { display: grid; gap: 2px; font: 800 11px 'JetBrains Mono',monospace; }.error-formula s { color: ${T.warn}; text-decoration-color: ${T.accent}; }.error-formula i { color: ${T.accent}; font-style: normal; }.error-formula strong { color: ${T.success}; }.error-case p { color: ${T.ink2}; font-size: 11px; font-weight: 700; line-height: 1.38; }
.wrong-equation { min-height: 54px; padding: 9px 13px; border: 1px solid rgba(169,111,19,.18); border-radius: 14px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; color: ${T.warn}; background: ${T.warnSoft}; }
.wrong-equation > span { padding: 4px 6px; border-radius: 7px; color: #FFFFFF; background: ${T.warn}; font: 850 10px 'JetBrains Mono',monospace; }.wrong-equation strong { color: ${T.navy}; font: 850 clamp(14px,2.4vw,20px) 'JetBrains Mono',monospace; text-align: center; }.wrong-equation i { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; color: #FFFFFF; background: ${T.accent}; font-style: normal; font-weight: 900; }
.repair-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; }.repair-step { min-height: 61px; padding: 8px; border-radius: 12px; display: flex; align-items: center; gap: 7px; background: #F5F8F6; }.repair-step > span { width: 24px; height: 24px; flex: 0 0 24px; display: grid; place-items: center; border-radius: 8px; color: #FFFFFF; background: ${T.cyan}; font: 850 10px 'JetBrains Mono',monospace; }.repair-step p { color: ${T.ink2}; font-size: 11px; font-weight: 700; line-height: 1.36; }
.correct-equation { min-height: 58px; padding: 9px 13px; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: ${T.success}; background: ${T.successSoft}; }.correct-equation strong { font: 850 clamp(15px,2.5vw,21px) 'JetBrains Mono',monospace; }.correct-equation small { max-width: 245px; text-align: right; font-size: 11px; font-weight: 750; line-height: 1.36; }
.workbench-bit { position: absolute; right: 17px; bottom: 9px; width: 102px; height: 128px; transition: transform .6s ease; }

/* Post-transfer proof: two adjacent comparisons justify the full chain. */
.chain-proof-board { padding: 15px; display: grid; gap: 12px; border-radius: 21px; background: linear-gradient(145deg,#FFFFFF,${T.cyanSoft}); box-shadow: 0 17px 38px -28px rgba(${T.shadowBase},.5); }
.chain-proof-comparisons { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
.chain-proof-card { min-height: 174px; padding: 14px; display: grid; grid-template-columns: 34px minmax(0,1fr); align-content: start; gap: 7px 10px; border-radius: 17px; background: #FFFFFF; box-shadow: inset 0 0 0 1px rgba(22,143,163,.13), 0 12px 27px -22px rgba(${T.shadowBase},.4); }
.chain-proof-card > span { grid-row: 1 / 4; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 11px; color: #FFFFFF; background: ${T.cyan}; font: 900 10px 'JetBrains Mono',monospace; }
.chain-proof-card:nth-child(2) > span { background: ${T.accent}; }
.chain-proof-card small { color: ${T.ink3}; font: 800 11px 'JetBrains Mono',monospace; }
.chain-proof-card strong { color: ${T.navy}; font: 850 clamp(17px,2.7vw,24px) 'JetBrains Mono',monospace; }
.chain-proof-card p { grid-column: 2; color: ${T.ink2}; font-size: 12px; line-height: 1.42; }
.chain-proof-result { min-height: 104px; padding: 7px 15px 7px 7px; display: grid; grid-template-columns: 72px minmax(0,1fr); align-items: center; gap: 11px; border-radius: 17px; color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.chain-proof-result > svg { width: 67px; height: 84px; }
.chain-proof-result > div { display: grid; gap: 5px; }.chain-proof-result span { font-size: 11px; font-weight: 900; letter-spacing: .13em; }.chain-proof-result strong { color: ${T.navy}; font: 850 clamp(17px,3vw,24px) 'JetBrains Mono',monospace; }.chain-proof-result p { color: ${T.ink2}; font-size: 12px; line-height: 1.4; }

/* Summary. */
.summary-hero { min-height: 156px; padding: 14px 120px 14px 105px; position: relative; border-radius: 22px; display: flex; align-items: center; background: linear-gradient(135deg,#FFFFFF,${T.cyanSoft}); box-shadow: 0 18px 40px -29px rgba(${T.shadowBase},.5); }
.summary-bit { position: absolute; left: 15px; bottom: 3px; width: 82px; height: 104px; }.summary-score { position: absolute; right: 17px; top: 50%; transform: translateY(-50%); width: 88px; padding: 9px; border-radius: 15px; display: grid; place-items: center; gap: 2px; color: ${T.success}; background: ${T.successSoft}; }.summary-score strong { font: 900 23px 'JetBrains Mono',monospace; }.summary-score span { font-size: 10px; font-weight: 800; text-align: center; }
.takeaway-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }.takeaway-card { min-height: 82px; padding: 11px; border-radius: 15px; display: flex; align-items: center; gap: 9px; background: #FFFFFF; box-shadow: 0 12px 26px -21px rgba(${T.shadowBase},.44); }.takeaway-card > span { width: 28px; height: 28px; flex: 0 0 28px; display: grid; place-items: center; border-radius: 9px; color: #FFFFFF; background: ${T.cyan}; font: 850 10px 'JetBrains Mono',monospace; }.takeaway-card:nth-child(2) > span { background: ${T.accent}; }.takeaway-card:nth-child(3) > span { background: ${T.success}; }.takeaway-card p { color: ${T.ink2}; font-size: 11px; font-weight: 700; line-height: 1.4; }
.bridge-card { padding: 11px 14px; border-left: 4px solid ${T.accent}; border-radius: 0 14px 14px 0; display: flex; align-items: center; gap: 10px; color: ${T.ink2}; background: ${T.accentSoft}; }.bridge-card > span { color: ${T.accent}; font: 900 13px 'JetBrains Mono',monospace; }.bridge-card p { font-size: 11px; font-weight: 750; }

.preview-language { position: fixed; z-index: 50; right: 10px; bottom: 84px; padding: 4px; border-radius: 12px; display: flex; gap: 4px; background: rgba(18,33,44,.88); box-shadow: 0 12px 24px -14px rgba(0,0,0,.55); }
.preview-language button { min-width: 44px; min-height: 44px; border: 0; border-radius: 9px; color: rgba(255,255,255,.65); background: transparent; font-size: 10px; font-weight: 850; cursor: pointer; }.preview-language button.preview-active { color: #FFFFFF; background: ${T.accent}; }
.lesson-root button:focus-visible { outline: 3px solid rgba(22,143,163,.42); outline-offset: 3px; }

@media (max-width: 760px) {
  .stage-content { padding-top: 8px; }
  .h-title { font-size: 29px; }
  .lead { font-size: 14px; }
  .city-sort-scene { padding-right: 160px; }
  .worked-card strong { font-size: 16px; }
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
  .stage-header { padding-top: 8px; padding-bottom: 6px; }
  .stage-nav { min-height: 66px; padding-top: 8px; padding-bottom: 8px; }
  .stage-content { scrollbar-gutter: auto; padding-bottom: 8px; }
  .screen-stack { gap: 10px; }
  .heading-block { gap: 5px; }
  .h-title { font-size: 24px; line-height: 1.05; }
  .lead { font-size: 12px; line-height: 1.38; }
  .chrome-title { max-width: 126px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 9px; }
  .screen-type { display: none; }
  .icon-btn { width: 48px; height: 48px; border-radius: 12px; }
  .btn { min-height: 48px; padding: 9px 14px; }
  .replay-reveal { min-height: 48px; }
  .city-sort-scene { min-height: 224px; padding: 15px 112px 15px 14px; border-radius: 20px; }
  .route-order { grid-template-columns: 1fr; gap: 7px; }.route-arrow { display: none; }.route-card { padding: 9px; }.route-card strong { font-size: 18px; }.sort-alert { font-size: 11px; }
  .hook-bit { right: 8px; width: 104px; }.hook-bit > svg { width: 82px; height: 105px; }.bit-dark-speech { right: 49px; bottom: 75px; width: 142px; font-size: 11px; }
  .recap-board { padding: 13px; gap: 7px; }.recap-number { min-height: 90px; padding: 9px; }.recap-number span { font-size: 19px; }.recap-number b { font-size: 11px; }
  .digit-count-model,.place-table-frame,.number-line-card,.scan-console,.equality-machine,.discovery-lab,.checkpoint-board,.error-workbench { border-radius: 17px; }
  .digit-count-model { padding: 12px; gap: 9px; }.formula-display { gap: 6px; }.formula-display span { padding: 9px 5px; font-size: 17px; }.formula-display i { font-size: 22px; }.step-rail { grid-template-columns: 1fr; gap: 5px; }.model-step { min-height: 64px; padding: 8px; display: grid; justify-items: center; text-align: center; }.model-step > span { width: 25px; height: 25px; }.model-step p { font-size: 11px; line-height: 1.38; }
  .place-table-frame { padding: 8px; }.place-table-head > span { min-height: 36px; font-size: 10px; line-height: 1.15; overflow-wrap: anywhere; }.place-table-row > span { min-height: 44px; font-size: 18px; }.table-scan-beam { top: 8px; bottom: 8px; left: 8px; width: calc((100% - 16px) / 6); }
  .deep-contrast { grid-template-columns: 1fr; gap: 6px; }.deep-contrast-trail { justify-content: center; }.deep-contrast-result { text-align: center; }
  .number-line-card { padding: 14px 11px 10px; }.line-point b { font-size: 10px; }.number-line-track { margin: 0 6px; }
  .scan-console { padding: 11px; gap: 9px; }.scan-numbers { gap: 7px; }.scan-numbers strong { padding: 9px 4px; font-size: 20px; }.comparison-scan { gap: 5px; }.scan-chip { min-height: 68px; padding: 6px 3px; }.scan-chip b { font-size: 13px; }.decision-banner { display: grid; text-align: center; }.decision-banner small { text-align: center; }
  .equality-machine { padding: 12px; gap: 8px; }.digit-pairs { gap: 3px; }.digit-pair { min-height: 74px; padding: 4px 2px; }.digit-pair span { font-size: 17px; }
  .options-grid { grid-template-columns: 1fr; gap: 7px; }.option { min-height: 50px; padding: 8px 10px; font-size: 11px; }.feedback-card { min-height: 76px; font-size: 12px; }.g4-bit-reaction-figure { width: 50px; height: 62px; flex-basis: 50px; }
  .worked-grid { gap: 6px; }.worked-card { min-height: 104px; padding: 10px 7px 9px 36px; }.worked-card > span { left: 8px; top: 10px; width: 22px; height: 22px; }.worked-card strong { font-size: 13px; }.worked-card p { font-size: 11px; line-height: 1.38; }
  .discovery-lab { padding: 10px; gap: 8px; }.digit-lanes { gap: 3px; }.lane-pair { min-height: 72px; padding: 4px 1px; }.lane-pair span { font-size: 16px; }.discovery-rule { min-height: 66px; font-size: 13px; }.discovery-rule > svg { width: 47px; height: 58px; flex-basis: 47px; }
  .rule-path { grid-template-columns: 1fr; gap: 7px; }.rule-path-line { display: none; }.rule-card { min-height: 0; padding: 11px; gap: 7px; }.rule-card > span { width: 29px; height: 29px; }.rule-card h2 { font-size: 14px; }.rule-card p { font-size: 11px; line-height: 1.38; }
  .checkpoint-board { padding: 8px 10px; }.checkpoint-row { min-height: 72px; grid-template-columns: 22px minmax(0,1fr) auto; gap: 5px 7px; padding: 7px 0; }.checkpoint-row strong { font-size: 13px; }.checkpoint-row p { grid-column: 2 / -1; font-size: 11px; line-height: 1.38; }
  .strategy-grid { grid-template-columns: 1fr; gap: 7px; }.strategy-card { min-height: 0; padding: 12px; gap: 6px; }.strategy-icon { width: 34px; height: 34px; }.strategy-card h2 { font-size: 15px; }.strategy-card p { font-size: 11px; }.strategy-card code { font-size: 11px; }
  .error-workbench { padding: 8px; }.error-lab-grid { grid-template-columns: 1fr; gap: 6px; }.error-case { min-height: 0; padding: 10px; gap: 6px; }.error-case > span { font-size: 10px; }.error-formula { grid-template-columns: 1fr auto 1fr; align-items: center; gap: 5px; font-size: 11px; }.error-formula strong { text-align: right; }.error-case p { font-size: 11px; line-height: 1.38; }.correct-equation { display: grid; gap: 4px; }.correct-equation strong { font-size: 14px; }.correct-equation small { text-align: left; font-size: 11px; }.workbench-bit { position: static; width: 62px; height: 78px; justify-self: center; }
  .chain-proof-board { padding: 10px; }.chain-proof-comparisons { grid-template-columns: 1fr; gap: 7px; }.chain-proof-card { min-height: 0; padding: 11px; }.chain-proof-card small { font-size: 11px; }.chain-proof-card strong { font-size: 16px; }.chain-proof-card p { font-size: 11px; }.chain-proof-result { grid-template-columns: 58px minmax(0,1fr); padding: 7px 10px 7px 4px; }.chain-proof-result > svg { width: 55px; height: 69px; }.chain-proof-result strong { font-size: 14px; }.chain-proof-result p { font-size: 11px; }
  .summary-hero { min-height: 150px; padding: 11px 76px 11px 73px; }.summary-bit { left: 6px; width: 62px; height: 80px; }.summary-score { right: 7px; width: 66px; }.summary-score strong { font-size: 18px; }.summary-score span { font-size: 9px; }.takeaway-grid { grid-template-columns: 1fr; gap: 6px; }.takeaway-card { min-height: 58px; padding: 9px; display: flex; justify-items: initial; text-align: left; }.takeaway-card p { font-size: 11px; }.bridge-card { padding: 9px 11px; }.bridge-card p { font-size: 11px; }
  .bit-coach-figure { width: 52px; height: 65px; flex-basis: 52px; }.bit-speech { padding: 7px 10px; font-size: 11px; }
  .preview-language { right: 7px; bottom: 72px; }.preview-language button { min-width: 48px; min-height: 48px; }
}
@media (max-height: 680px) and (min-width: 640px) {
  .screen-stack { gap: 9px; }.h-title { font-size: 29px; }.lead { font-size: 13px; }.stage-nav { min-height: 62px; }.city-sort-scene { min-height: 205px; }.rule-card,.strategy-card { min-height: 132px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
}
`;
