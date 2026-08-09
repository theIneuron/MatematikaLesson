import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars47 — "Tenglamalarni yechish" (num-3-47) | Б6 «O'LCHOVLAR»
// Syujet: Lumo shahri (reja 52-satr). SAHNA: 1-DARSNING shahri, tugun — amallar jadvali.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, tenglama boblari).
// YADRO: noma'lum QAYSI komponent ekaniga qarab amal tanlanadi. Qo'shiluvchi yig'indidan
//   ayirib, kamayuvchi qo'shib, ayiriluvchi ayirib, ko'paytuvchi bo'lib topiladi.
// Misconception: M1 har doim ayirish; M2 kamayuvchi va ayiriluvchini chalkashtirish;
//   M3 tekshirmaslik; M4 ko'paytirishda noto'g'ri sonni bo'lish.
// FactCard: «algebra» so'zi al-Xorazmiy kitobidan, «algoritm» esa uning nomidan kelgan.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-47',
  lessonTitle: { ru: 'Урок 47. Решение уравнений', uz: '47-dars. Tenglamalarni yechish' }
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
    topic: { ru: 'Решение уравнений', uz: 'Tenglamalarni yechish' },
    lead: { ru: 'Два уравнения рядом: x + 6 = 14 и x − 6 = 14', uz: "Yonma-yon ikki tenglama: x + 6 = 14 va x − 6 = 14" },
    order_cap: { ru: 'числа одинаковые, знаки разные', uz: 'sonlar bir xil, belgilar har xil' },
    q: { ru: 'Одинаковые ли у них корни?', uz: 'Ularning ildizi bir xilmi?' },
    opt0: { ru: 'нет, разные', uz: "yo'q, har xil" },
    opt1: { ru: 'да, одинаковые', uz: 'ha, bir xil' },
    opt2: { ru: 'у обоих 8', uz: 'ikkalasida ham 8' },
    opt3: { ru: 'корней нет', uz: "ildiz yo'q" },
    audio: {
      intro: {
        ru: [
          'Что такое уравнение и корень, ты уже знаешь. Теперь научимся решать любое.',
          'Вот два уравнения. Числа в них одинаковые, шесть и четырнадцать.',
          'Отличается только знак между ними. В одном плюс, в другом минус.',
          'Как думаешь, корни у них одинаковые или нет?'
        ],
        uz: [
          "Tenglama va ildiz nimaligini bilasiz. Endi har qanday tenglamani yechishni o'rganamiz.",
          "Mana ikki tenglama. Ulardagi sonlar bir xil, olti va o'n to'rt.",
          "Faqat orasidagi belgi farq qiladi. Birida qo'shuv, ikkinchisida ayirish.",
          "Sizningcha, ularning ildizi bir xilmi yoki yo'qmi?"
        ]
      },
      on_correct: { ru: 'Верно! В первом корень восемь, во втором двадцать. Действие выбирают по знаку, а не наугад.', uz: "To'g'ri! Birinchisida ildiz sakkiz, ikkinchisida yigirma. Amal tasodifan emas, belgiga qarab tanlanadi." },
      on_wrong1: { ru: 'Знак меняет всё. Подставь восемь во второе, и равенство не сойдётся.', uz: "Belgi hammasini o'zgartiradi. Sakkizni ikkinchisiga qo'ysangiz, tenglik mos tushmaydi." },
      on_wrong2: { ru: 'Восемь подходит только первому уравнению.', uz: "Sakkiz faqat birinchi tenglamaga to'g'ri keladi." },
      on_idk: { ru: 'Ничего. Сейчас решим оба и сравним.', uz: "Hechqisi yo'q. Hozir ikkalasini yechib solishtiramiz." }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Смотрим, чем является неизвестное', uz: "Noma'lum nima ekaniga qaraymiz" },
    task_line: 'x + 6 = 14',
    task_line_uz: "x + 6 = 14",
    step1: 'x — слагаемое',
    step1_cap: { ru: 'ищем часть суммы', uz: "yig'indining qismini izlaymiz" },
    step2: 'x = 14 − 6',
    step2_cap: { ru: 'из суммы вычитаем известное', uz: "yig'indidan ma'lumni ayiramiz" },
    res: 'x = 8',
    btn1: { ru: 'Назвать неизвестное', uz: "Noma'lumni aytish" },
    btn2: { ru: 'Выбрать действие', uz: 'Amalni tanlash' },
    done_text: { ru: 'Неизвестное слагаемое находят вычитанием. Из суммы убирают известную часть.', uz: "Noma'lum qo'shiluvchi ayirish bilan topiladi. Yig'indidan ma'lum qism olinadi." },
    audio: {
      ru: [
        'Первый шаг решения это не счёт, а вопрос. Чем является неизвестное в этой записи.',
        'Здесь икс стоит на месте слагаемого, ведь его прибавляют.',
        'А неизвестное слагаемое находят вычитанием. Из суммы четырнадцать убираем известное слагаемое шесть и получаем восемь.'
      ],
      uz: [
        "Yechishning birinchi qadami hisob emas, savol. Bu yozuvda noma'lum nima ekani.",
        "Bu yerda iks qo'shiluvchi o'rnida turibdi, chunki u qo'shilyapti.",
        "Noma'lum qo'shiluvchi esa ayirish bilan topiladi. O'n to'rt yig'indisidan ma'lum qo'shiluvchi oltini olamiz va sakkiz chiqadi."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 4,
    h: 4,
    lead: { ru: 'Второе уравнение решается иначе', uz: 'Ikkinchi tenglama boshqacha yechiladi' },
    capA: { ru: 'x − 6 = 14, x это уменьшаемое', uz: 'x − 6 = 14, x bu kamayuvchi' },
    capB: { ru: 'x = 14 + 6 = 20', uz: 'x = 14 + 6 = 20' },
    res: 'проверка: 20 − 6 = 14',
    btn1: { ru: 'Назвать неизвестное', uz: "Noma'lumni aytish" },
    btn2: { ru: 'Найти и проверить', uz: 'Topib tekshirish' },
    done_text: { ru: 'Неизвестное уменьшаемое находят сложением, а не вычитанием.', uz: "Noma'lum kamayuvchi ayirish bilan emas, qo'shish bilan topiladi." },
    audio: {
      ru: [
        'Второе уравнение выглядит почти так же, но неизвестное тут другое.',
        'Икс стоит первым, из него вычитают. Значит икс это уменьшаемое.',
        'Уменьшаемое находят сложением. К разности четырнадцать прибавляем вычитаемое шесть и получаем двадцать. Проверка сходится, двадцать минус шесть равно четырнадцать.'
      ],
      uz: [
        "Ikkinchi tenglama deyarli o'shanday ko'rinadi, lekin noma'lum bu yerda boshqa.",
        "Iks birinchi turibdi, undan ayirilyapti. Demak iks bu kamayuvchi.",
        "Kamayuvchi qo'shish bilan topiladi. O'n to'rt ayirmasiga ayiriluvchi oltini qo'shamiz va yigirma chiqadi. Tekshiruv mos tushadi, yigirma ayirish olti teng o'n to'rt."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Как найти неизвестный множитель в x · 4 = 20?', uz: "x · 4 = 20 da noma'lum ko'paytuvchi qanday topiladi?" },
    opts: [
      { ru: '20 : 4', uz: '20 : 4' },
      { ru: '20 · 4', uz: '20 · 4' },
      { ru: '20 − 4', uz: '20 − 4' },
      { ru: '20 + 4', uz: '20 + 4' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножение только увеличит число, а икс меньше двадцати.', uz: "Ko'paytirish sonni faqat oshiradi, iks esa yigirmadan kichik." },
      2: { ru: 'Вычитание тут не подходит. Множители не складывают.', uz: "Ayirish bu yerda to'g'ri kelmaydi. Ko'paytuvchilar qo'shilmaydi." },
      3: { ru: 'Сложение даст двадцать четыре, проверка не сойдётся.', uz: "Qo'shish yigirma to'rt beradi, tekshiruv mos tushmaydi." }
    },
    on_correct: { ru: 'Верно. Множитель находят делением.', uz: "To'g'ri. Ko'paytuvchi bo'lish bilan topiladi." },
    rule_lines: {
      ru: ['слагаемое = сумма − известное', 'уменьшаемое = разность + вычитаемое', 'множитель = произведение : известный'],
      uz: ["qo'shiluvchi = yig'indi − ma'lum", "kamayuvchi = ayirma + ayiriluvchi", "ko'paytuvchi = ko'paytma : ma'lum"]
    },
    rule_ex: 'x · 4 = 20, x = 20 : 4 = 5',
    rule_speech: { ru: 'Действие выбирают по тому, чем является неизвестное. Слагаемое находят вычитанием, уменьшаемое сложением, а множитель делением. И каждый раз ответ проверяют подстановкой.', uz: "Amal noma'lum nima ekaniga qarab tanlanadi. Qo'shiluvchi ayirish bilan, kamayuvchi qo'shish bilan, ko'paytuvchi esa bo'lish bilan topiladi. Va har safar javob qo'yib tekshiriladi." },
    audio: {
      intro: { ru: 'Соберём правило. У каждого неизвестного своё действие.', uz: "Qoidani yig'amiz. Har bir noma'lumning o'z amali bor." }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'В уравнении 18 − x = 7 чем является x?', uz: "18 − x = 7 tenglamada x nima?" },
    fig_w: 3,
    fig_h: 2,
    opts: [
      { ru: 'вычитаемое', uz: 'ayiriluvchi' },
      { ru: 'уменьшаемое', uz: 'kamayuvchi' },
      { ru: 'слагаемое', uz: "qo'shiluvchi" },
      { ru: 'разность', uz: 'ayirma' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Уменьшаемое тут восемнадцать, оно написано.', uz: "Kamayuvchi bu yerda o'n sakkiz, u yozilgan." },
      2: { ru: 'Слагаемые бывают при сложении, а здесь минус.', uz: "Qo'shiluvchi qo'shishda bo'ladi, bu yerda esa ayirish." },
      3: { ru: 'Разность это семь, она справа.', uz: "Ayirma bu yetti, u o'ngda." }
    },
    audio: {
      intro: { ru: 'Посмотри на запись. Из восемнадцати вычитают икс. Чем является икс?', uz: "Yozuvga qarang. O'n sakkizdan iks ayirilyapti. Iks nima?" },
      on_correct: { ru: 'Верно. Икс это вычитаемое, его находят вычитанием разности из уменьшаемого.', uz: "To'g'ri. Iks bu ayiriluvchi, u kamayuvchidan ayirmani ayirish bilan topiladi." },
      on_wrong: { ru: 'Посмотри, на каком месте стоит икс в записи.', uz: "Iks yozuvda qaysi o'rinda turganiga qarang." }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи уравнения по действию', uz: 'Tenglamalarni amaliga qarab ajrating' },
    bin_a: { ru: 'решаем вычитанием', uz: 'ayirish bilan yechamiz' },
    bin_b: { ru: 'решаем сложением', uz: "qo'shish bilan yechamiz" },
    items: [
      { n: { ru: 'x + 5 = 12', uz: 'x + 5 = 12' }, a: true, hint: { ru: 'Неизвестное слагаемое, из суммы вычитают.', uz: "Noma'lum qo'shiluvchi, yig'indidan ayiriladi." } },
      { n: { ru: 'x − 5 = 12', uz: 'x − 5 = 12' }, a: false, hint: { ru: 'Неизвестное уменьшаемое, к разности прибавляют.', uz: "Noma'lum kamayuvchi, ayirmaga qo'shiladi." } },
      { n: { ru: '9 + x = 20', uz: '9 + x = 20' }, a: true, hint: { ru: 'Снова слагаемое, значит вычитание.', uz: "Yana qo'shiluvchi, demak ayirish." } },
      { n: { ru: 'x − 8 = 3', uz: 'x − 8 = 3' }, a: false, hint: { ru: 'Уменьшаемое, значит сложение.', uz: "Kamayuvchi, demak qo'shish." } }
    ],
    audio: {
      intro: { ru: 'Четыре уравнения. Отправь каждое к своему действию.', uz: "To'rtta tenglama. Har birini o'z amaliga yuboring." },
      on_correct: { ru: 'Всё на месте. Смотреть надо не на знак в записи, а на то, чем является икс.', uz: "Hammasi joyida. Yozuvdagi belgiga emas, iks nima ekaniga qarash kerak." },
      on_wrong: { ru: 'Назови сначала, чем является икс в этой записи.', uz: "Avval bu yozuvda iks nima ekanini ayting." }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Найди корень: x : 3 = 6', uz: 'Ildizni toping: x : 3 = 6' },
    opts: [
      { ru: '18', uz: '18' },
      { ru: '2', uz: '2' },
      { ru: '9', uz: '9' },
      { ru: '3', uz: '3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Два это шесть делить на три, а нужно наоборот.', uz: "Ikki bu oltini uchga bo'lgan, kerak bo'lgani aksincha." },
      2: { ru: 'Девять это шесть и три сложенные.', uz: "To'qqiz bu olti va uchning yig'indisi." },
      3: { ru: 'Три уже стоит в записи, его не ищут.', uz: "Uch allaqachon yozuvda turibdi, u izlanmaydi." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Икс разделить на три равно шесть.', uz: "Tez savol. Iksni uchga bo'lsak, olti chiqadi." },
      on_correct: { ru: 'Верно. Делимое находят умножением, шесть на три.', uz: "To'g'ri. Bo'linuvchi ko'paytirish bilan topiladi, oltiga uch." },
      on_wrong: { ru: 'Икс тут делимое, а его находят умножением.', uz: "Iks bu yerda bo'linuvchi, u ko'paytirish bilan topiladi." }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Решаем x · 5 = 45 по шагам', uz: 'x · 5 = 45 ni qadamlab yechamiz' },
    swap_line: 'x · 5 = 45',
    cells: [
      { head: { ru: 'известный множитель', uz: "ma'lum ko'paytuvchi" }, label: 'число', ans: 5, hint: { ru: 'Оно написано рядом с иксом.', uz: 'U iks yonida yozilgan.' } },
      { head: { ru: 'произведение', uz: "ko'paytma" }, label: 'справа', ans: 45, hint: { ru: 'Это правая часть равенства.', uz: "Bu tenglikning o'ng tomoni." } },
      { head: { ru: 'корень', uz: 'ildiz' }, label: '45 : 5', ans: 9, hint: { ru: 'Множитель находят делением.', uz: "Ko'paytuvchi bo'lish bilan topiladi." } }
    ],
    check: '9 · 5 = 45',
    check_label: { ru: 'проверка умножением', uz: "ko'paytirib tekshirish" },
    audio: {
      intro: { ru: 'Заполни три окна. Известный множитель, произведение и корень.', uz: "Uchta oynani to'ldiring. Ma'lum ko'paytuvchi, ko'paytma va ildiz." },
      on_correct: { ru: 'Корень девять, и проверка сошлась. Девять на пять равно сорок пять.', uz: "Ildiz to'qqiz, tekshiruv mos tushdi. To'qqizga besh teng qirq besh." }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Для x · 6 = 24 написали x = 144. Где ошибка?', uz: "x · 6 = 24 uchun x = 144 deb yozilibdi. Xato qayerda?" },
    fig_line: 'x · 6 = 24',
    opts: [
      { ru: 'умножили вместо деления', uz: "bo'lish o'rniga ko'paytirilgan" },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'взяли не то число', uz: "son noto'g'ri olingan" },
      { ru: 'это не уравнение', uz: 'bu tenglama emas' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Корень должен быть меньше произведения, а не больше.', uz: "Ildiz ko'paytmadan kichik bo'lishi kerak, katta emas." },
      2: { ru: 'Числа из записи взяты верно, подвело действие.', uz: "Yozuvdagi sonlar to'g'ri olingan, amal aldadi." },
      3: { ru: 'Неизвестное и знак равно на месте, это уравнение.', uz: "Noma'lum va teng belgisi joyida, bu tenglama." }
    },
    audio: {
      intro: { ru: 'Кто-то нашёл множитель умножением. Найди ошибку.', uz: "Kimdir ko'paytuvchini ko'paytirish bilan topibdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Множитель находят делением, двадцать четыре разделить на шесть, корень четыре.', uz: "To'g'ri. Ko'paytuvchi bo'lish bilan topiladi, yigirma to'rtni oltiga bo'lsak, ildiz to'rt." },
      on_wrong: { ru: 'Подставь сто сорок четыре обратно и увидишь.', uz: "Bir yuz qirq to'rtni qaytarib qo'ysangiz, ko'rasiz." }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит нашёл универсальное правило', uz: 'Bit universal qoida topdi' },
    lines: ['x + 7 = 10 и 15 − x = 6', 'Бит: везде вычитаю меньшее из большего'],
    lines_uz: ["x + 7 = 10 va 15 − x = 6", "Bit: hamma joyda kichikni kattadan ayiraman"],
    line_cap: { ru: 'Бит: одно правило на все случаи', uz: "Bit: hamma holga bitta qoida" },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, действие зависит от неизвестного', 'да, вычитание подходит всегда'], uz: ["yo'q, amal noma'lumga bog'liq", "ha, ayirish har doim to'g'ri keladi"] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. В первом уравнении вычитание и правда подходит, корень три. Но в записи икс минус шесть равно четырнадцать вычитание даст восемь, а проверка не сойдётся. Там нужно сложение.', uz: "Ha. Birinchi tenglamada ayirish rostdan to'g'ri keladi, ildiz uch. Lekin iks ayirish olti teng o'n to'rt yozuvida ayirish sakkiz beradi va tekshiruv mos tushmaydi. U yerda qo'shish kerak." },
    trap_wrong: { ru: 'Возьми уравнение икс минус шесть равно четырнадцать и проверь правило Бита.', uz: "Iks ayirish olti teng o'n to'rt tenglamasini olib, Bitning qoidasini tekshiring." },
    audio: {
      ru: [
        'Бит придумал, как решать все уравнения сразу.',
        'Везде вычитаю меньшее число из большего, и ответ готов. Правило одно на все случаи.',
        'Так ли это?'
      ],
      uz: [
        "Bit hamma tenglamani birdan yechishni o'ylab topdi.",
        "Hamma joyda kichik sonni kattadan ayiraman va javob tayyor. Qoida hamma holga bitta.",
        "Shundaymi?"
      ]
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Найди корень: x · 7 = 42', uz: 'Ildizni toping: x · 7 = 42' },
    ans: 6,
    check: '42 : 7',
    check_label: { ru: 'множитель делением', uz: "ko'paytuvchi bo'lish bilan" },
    hint: { ru: 'Сорок два раздели на семь.', uz: "Qirq ikkini yettiga bo'ling." },
    audio: {
      intro: { ru: 'Теперь решай сам. Икс умножить на семь равно сорок два.', uz: "Endi o'zingiz yeching. Iksni yettiga ko'paytirsak, qirq ikki chiqadi." },
      on_correct: { ru: 'Корень шесть. Проверка сходится.', uz: "Ildiz olti. Tekshiruv mos tushdi." }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Найди корень: 24 − x = 9', uz: 'Ildizni toping: 24 − x = 9' },
    ans: 15,
    check: '24 − 9',
    check_label: { ru: 'вычитаемое', uz: 'ayiriluvchi' },
    hint: { ru: 'Из двадцати четырёх вычти девять.', uz: "Yigirma to'rtdan to'qqizni ayiring." },
    audio: {
      intro: { ru: 'И ещё уравнение. Двадцать четыре минус икс равно девять.', uz: "Yana tenglama. Yigirma to'rt ayirish iks teng to'qqiz." },
      on_correct: { ru: 'Корень пятнадцать. Двадцать четыре минус пятнадцать равно девять.', uz: "Ildiz o'n besh. Yigirma to'rt ayirish o'n besh teng to'qqiz." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Кристаллы по коробкам', uz: 'Qutilardagi kristallar' },
    q: { ru: 'Кристаллы разложили поровну в 6 коробок, в каждой стало 8. Сколько было всего и сколько это десятков?', uz: "Kristallar 6 ta qutiga teng bo'lindi, har birida 8 tadan bo'ldi. Jami qancha edi va bu necha o'nlik?" },
    q_speech: { ru: 'кристаллы разложили поровну в шесть коробок, в каждой стало восемь. Сколько было всего и сколько это десятков?', uz: "kristallar oltita qutiga teng bo'lindi, har birida sakkiztadan bo'ldi. Jami qancha edi va bu necha o'nlik?" },
    tbl_heads: [
      { ru: 'коробок', uz: 'quti' },
      { ru: 'в каждой', uz: 'har birida' },
      { ru: 'всего', uz: 'jami' }
    ],
    tbl_cells: ['6', '8', 'x'],
    pick_label: { ru: 'Какое уравнение подходит?', uz: 'Qaysi tenglama to\'g\'ri keladi?' },
    opts: [
      { ru: 'x : 6 = 8', uz: 'x : 6 = 8' },
      { ru: 'x · 6 = 8', uz: 'x · 6 = 8' },
      { ru: 'x + 6 = 8', uz: 'x + 6 = 8' },
      { ru: 'x − 6 = 8', uz: 'x − 6 = 8' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Кристаллы делили, а не умножали.', uz: "Kristallar bo'lindi, ko'paytirilmadi." },
      2: { ru: 'Коробки не прибавляют к кристаллам.', uz: "Qutilar kristallarga qo'shilmaydi." },
      3: { ru: 'Вычитание тут не подходит.', uz: "Ayirish bu yerda to'g'ri kelmaydi." }
    },
    pick_ok: { ru: 'Верно. Сначала уравнение, потом корень.', uz: "To'g'ri. Avval tenglama, keyin ildiz." },
    step1_q: { ru: 'Сколько кристаллов было всего?', uz: 'Jami nechta kristall bor edi?' },
    ans1: 48,
    hint1: { ru: 'Делимое находят умножением, восемь на шесть.', uz: "Bo'linuvchi ko'paytirish bilan topiladi, sakkizga olti." },
    step2_q: { ru: 'Сколько в этом числе десятков?', uz: "Bu sonda nechta o'nlik bor?" },
    ans2: 4,
    hint2: { ru: 'В сорока восьми четыре десятка.', uz: "Qirq sakkizda to'rtta o'nlik bor." },
    check: 'x = 48, проверка 48 : 6 = 8',
    setup_audio: { ru: 'Кристаллы раскладывают по коробкам. Посмотри на таблицу и выбери уравнение.', uz: "Kristallar qutilarga taqsimlanmoqda. Jadvalga qarang va tenglamani tanlang." },
    audio: {
      intro: { ru: 'Кристаллы разложили поровну в шесть коробок, в каждой по восемь.', uz: "Kristallar oltita qutiga teng bo'lindi, har birida sakkiztadan." },
      on_correct: { ru: 'Всего было сорок восемь, и в этом числе четыре десятка. Проверка сошлась.', uz: "Jami qirq sakkizta edi va bu sonda to'rtta o'nlik bor. Tekshiruv mos tushdi." },
      on_wrong: { ru: 'Сначала запиши уравнение по таблице.', uz: "Avval jadval bo'yicha tenglamani yozing." }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три уравнения. Сначала назови неизвестное', uz: "Uchta tenglama. Avval noma'lumni ayting" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Найди корень: x − 9 = 11', uz: 'Ildizni toping: x − 9 = 11' },
        q_speech: { ru: 'икс минус девять равно одиннадцать. Чему равен икс?', uz: "iks ayirish to'qqiz teng o'n bir. Iks nechaga teng?" },
        ans: 20,
        hint: { ru: 'Уменьшаемое находят сложением.', uz: "Kamayuvchi qo'shish bilan topiladi." }
      },
      {
        kind: 'num',
        q: { ru: 'Найди корень: x · 8 = 32', uz: 'Ildizni toping: x · 8 = 32' },
        q_speech: { ru: 'икс умножить на восемь равно тридцать два. Чему равен икс?', uz: "iksni sakkizga ko'paytirsak, o'ttiz ikki. Iks nechaga teng?" },
        ans: 4,
        hint: { ru: 'Множитель находят делением.', uz: "Ko'paytuvchi bo'lish bilan topiladi." }
      },
      {
        kind: 'num',
        q: { ru: 'Найди корень: 30 − x = 12', uz: 'Ildizni toping: 30 − x = 12' },
        q_speech: { ru: 'тридцать минус икс равно двенадцать. Чему равен икс?', uz: "o'ttiz ayirish iks teng o'n ikki. Iks nechaga teng?" },
        ans: 18,
        hint: { ru: 'Вычитаемое находят вычитанием разности.', uz: "Ayiriluvchi ayirmani ayirish bilan topiladi." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Слово алгебра пришло из книги учёного аль-Хорезми, который жил в Хорезме больше тысячи лет назад. Он описал, как переносить части равенства, и назвал это аль-джабр. А от его имени пошло слово алгоритм, то есть точный порядок действий.',
      uz: "Algebra so'zi ming yildan ko'proq oldin Xorazmda yashagan olim al-Xorazmiy kitobidan kelgan. U tenglik qismlarini qanday ko'chirishni tasvirlab, buni al-jabr deb atagan. Uning nomidan esa algoritm so'zi kelib chiqqan, ya'ni amallarning aniq tartibi."
    },
    fact_audio: {
      ru: 'Вот что связано с нашей темой. Больше тысячи лет назад в Хорезме жил учёный аль-Хорезми. Он написал книгу о том, как решать уравнения, перенося и уравнивая части. Один из приёмов он назвал аль-джабр, и от этого слова пошла алгебра. А само имя учёного превратилось в слово алгоритм, которым и сегодня называют точный порядок действий. Получается, ты сейчас решаешь по правилам, записанным здесь, в наших краях.',
      uz: "Mana mavzumizga bog'liq narsa. Ming yildan ko'proq oldin Xorazmda al-Xorazmiy degan olim yashagan. U tenglamalarni qismlarni ko'chirib va tenglashtirib yechish haqida kitob yozgan. Usullardan birini al-jabr deb atagan va shu so'zdan algebra kelib chiqqan. Olimning nomi esa algoritm so'ziga aylangan, bugun ham amallarning aniq tartibi shunday ataladi. Demak, siz hozir shu yurtda yozilgan qoidalar bo'yicha yechyapsiz."
    },
    audio: {
      intro: { ru: 'Три уравнения напоследок. Сначала назови, чем является икс.', uz: "Oxirida uchta tenglama. Avval iks nima ekanini ayting." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Действие выбирают по неизвестному, а не по знаку.', uz: "Amal belgiga emas, noma'lumga qarab tanlanadi." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Уравнения решены!', uz: 'Tenglamalar yechildi!' },
    cando: {
      ru: ['называю, чем является неизвестное', 'выбираю действие по правилу', 'проверяю корень подстановкой'],
      uz: ["noma'lum nima ekanini aytaman", "qoidaga qarab amal tanlayman", "ildizni qo'yib tekshiraman"]
    },
    rule_recap: { ru: 'Действие выбирают по тому, чем является неизвестное, а не по знаку в записи.', uz: "Amal yozuvdagi belgiga emas, noma'lum nima ekaniga qarab tanlanadi." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 46: уравнение и корень; урок 14: связь компонентов', uz: "46-dars: tenglama va ildiz; 14-dars: komponentlar bog'lanishi" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'составные задачи в два и три действия', uz: 'ikki va uch amalli murakkab masalalar' },
    audio: {
      ru: 'Уравнения решены. Запомни главное. Решение начинается не со счёта, а с вопроса. Чем является неизвестное в этой записи. Если слагаемым, из суммы вычитают. Если уменьшаемым, к разности прибавляют. Если вычитаемым, вычитают разность. Если множителем, делят, а если делимым, умножают. Одного правила на все случаи не бывает, и Бит это уже проверил. А в конце всегда подставляй найденное число обратно. В следующий раз возьмём задачи, где действий будет несколько!',
      uz: "Tenglamalar yechildi. Asosiysini eslab qoling. Yechish hisobdan emas, savoldan boshlanadi. Bu yozuvda noma'lum nima. Qo'shiluvchi bo'lsa, yig'indidan ayiriladi. Kamayuvchi bo'lsa, ayirmaga qo'shiladi. Ayiriluvchi bo'lsa, ayirma ayiriladi. Ko'paytuvchi bo'lsa, bo'linadi, bo'linuvchi bo'lsa, ko'paytiriladi. Hamma holga bitta qoida bo'lmaydi, buni Bit tekshirib ko'rdi. Oxirida esa topilgan sonni har doim qaytarib qo'ying. Keyingi safar amallari bir nechta bo'lgan masalalarni olamiz!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Начнём с первого.', uz: 'Birinchisidan boshlaymiz.' },
  s2:  { ru: 'Теперь второе.', uz: 'Endi ikkinchisi.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай запись.', uz: "Yozuvni o'qing." },
  s5:  { ru: 'Разложи уравнения.', uz: 'Tenglamalarni ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут выбрали не то действие.', uz: 'Bu yerda amal boshqa tanlanibdi.' },
  s9:  { ru: 'А вот и Бит со своим правилом.', uz: "Mana Bit ham o'z qoidasi bilan." },
  s10: { ru: 'Теперь решай сам.', uz: "Endi o'zingiz yeching." },
  s11: { ru: 'И ещё одно уравнение.', uz: 'Yana bitta tenglama.' },
  s12: { ru: 'Задача со склада.', uz: 'Ombordan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Уравнения решены. У каждого неизвестного нашлось своё действие.',
  uz: "Tenglamalar yechildi. Har bir noma'lum o'z amalini topdi."
};

// --- SAHNA TUGUNI (D47): 1-DARSNING shahri, ustiga amallar jadvali.
const RulesNodeLayer = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(128 98)">
      <rect x="0" y="0" width="146" height="76" rx="6" fill="#FDF6E8" stroke="#8A7550" strokeWidth="2"/>
      <rect x="0" y="0" width="146" height="14" rx="6" fill="#2E7E9E"/>
      <text x="73" y="10.5" textAnchor="middle" fontSize="7" letterSpacing="1.4" fill="#EAF4FA" fontFamily="'JetBrains Mono', monospace">QOIDALAR</text>
      {[['x + a = b', 'b − a'], ['x − a = b', 'b + a'], ['x · a = b', 'b : a']].map(([l, r], i) => (
        <g key={i} transform={`translate(10 ${28 + i * 16})`}>
          <text x="0" y="0" fontSize="8" fontWeight="800" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{l}</text>
          <text x="64" y="0" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">-&gt;</text>
          <text x="86" y="0" fontSize="8" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">{r}</text>
        </g>
      ))}
    </g>
  </svg>
);

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <LumoCityBg fill/>
      <RulesNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): 18 − x = 7 yozuvi, x ning o'rni belgilangan.
const PartsFig = () => (
  <svg viewBox="0 0 240 100" style={{ width: 'min(270px, 85%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <text x="30" y="52" textAnchor="middle" fontSize="26" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">18</text>
    <text x="66" y="52" textAnchor="middle" fontSize="24" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">−</text>
    <rect x="86" y="24" width="36" height="36" rx="8" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="2.4"/>
    <text x="104" y="52" textAnchor="middle" fontSize="22" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">x</text>
    <text x="142" y="52" textAnchor="middle" fontSize="24" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">=</text>
    <text x="176" y="52" textAnchor="middle" fontSize="26" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">7</text>
    <text x="30" y="80" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">kamayuvchi</text>
    <text x="176" y="80" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">ayirma</text>
  </svg>
);

// --- FACTCARD QAHRAMONI: al-Xorazmiy kitobi va ikki so'z.
const AlgebraFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(20 18)">
      <path d="M0 6 q22 -8 44 0 v58 q-22 -8 -44 0 Z" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M44 6 q22 -8 44 0 v58 q-22 -8 -44 0 Z" fill="#FDF3E0" stroke="#8A7550" strokeWidth="2" strokeLinejoin="round"/>
      <g stroke="#C9BCA2" strokeWidth="2" strokeLinecap="round">
        {[18, 26, 34, 42].map((y, i) => <line key={i} x1="8" y1={y} x2="36" y2={y}/>)}
        {[18, 26, 34, 42].map((y, i) => <line key={`b${i}`} x1="52" y1={y} x2="80" y2={y}/>)}
      </g>
    </g>
    <g transform="translate(128 26)">
      <rect x="0" y="0" width="76" height="22" rx="5" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.8"/>
      <text x="38" y="15" textAnchor="middle" fontSize="10" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">algebra</text>
      <rect x="0" y="30" width="76" height="22" rx="5" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="1.8"/>
      <text x="38" y="45" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A5A2E" fontFamily="'JetBrains Mono', monospace">algoritm</text>
    </g>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: AlgebraFig,
  figs: { s4: <PartsFig/> }
});
