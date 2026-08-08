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
// 4-SINF · Dars05 · Ko'p xonali sonlarni yaxlitlash
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
    eyebrow: { ru: 'Новая миссия', uz: 'Yangi missiya' },
    title: { ru: 'Городу нужны точные и примерные данные', uz: "Shaharga aniq va taqribiy ma'lumotlar kerak" },
    lead: {
      ru: 'Табло Lumo City смешало точные показатели с приблизительными. Bit поможет выбрать подходящую точность для каждого сообщения.',
      uz: "Lumo City tablosi aniq ko'rsatkichlarni taqribiylari bilan aralashtirib yubordi. Bit har bir xabar uchun mos aniqlikni tanlashga yordam beradi.",
    },
    instruction: {
      ru: 'Точный код сохраняем без изменений, а большое значение для быстрого обзора можно округлить.',
      uz: "Aniq kodni o'zgartirmay saqlaymiz, katta qiymatni esa tez ko'rish uchun yaxlitlash mumkin.",
    },
    model: {
      kind: 'dashboard',
      badge: { ru: 'Городское табло', uz: 'Shahar tablosi' },
      cards: [
        { label: { ru: 'код станции', uz: 'stansiya kodi' }, value: '48 764', result: { ru: 'точно', uz: 'aniq' }, tone: 'cyan' },
        { label: { ru: 'пассажиры за месяц', uz: "bir oydagi yo'lovchilar" }, value: '48 764', result: { ru: 'примерно 49 000', uz: 'taxminan 49 000' }, tone: 'accent' },
      ],
    },
    options: [
      { ru: 'Сначала определить, нужна точная или приблизительная запись', uz: 'Avval aniq yoki taqribiy yozuv kerakligini aniqlash' },
      { ru: 'Всегда заменять число ближайшей тысячей', uz: 'Har doim sonni eng yaqin minglik bilan almashtirish' },
      { ru: 'Всегда оставлять все цифры без изменений', uz: "Har doim barcha raqamlarni o'zgartirmay qoldirish" },
      { ru: 'Округлять каждую цифру отдельно', uz: 'Har bir raqamni alohida yaxlitlash' },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Контекст определяет точность: код нужен полностью, а обзорный показатель удобно показать округлённо.',
      uz: "Aniqlik vaziyatga bog'liq: kod to'liq kerak, umumiy ko'rsatkichni esa yaxlitlab ko'rsatish qulay.",
    },
    wrong: [
      null,
      { ru: 'Тысячная точность подходит не каждой задаче.', uz: "Minglik aniqligi har bir vazifaga mos kelmaydi." },
      { ru: 'Для обзора все цифры иногда мешают быстро понять масштаб.', uz: "Umumiy ko'rishda barcha raqamlar miqyosni tez tushunishga xalaqit berishi mumkin." },
      { ru: 'Цифры одного числа нельзя округлять независимо друг от друга.', uz: "Bitta son raqamlarini bir-biridan alohida yaxlitlab bo'lmaydi." },
    ],
    audio: {
      intro: {
        ru: [
          'Табло города смешало точные данные с приблизительными.',
          'Код станции нужно сохранить полностью, а большой поток пассажиров можно показать округлённо.',
        ],
        uz: [
          "Shahar tablosi aniq ma'lumotlarni taqribiylari bilan aralashtirdi.",
          "Stansiya kodini to'liq saqlash kerak, katta yo'lovchilar oqimini esa yaxlitlab ko'rsatish mumkin.",
        ],
      },
      on_correct: {
        ru: 'Контекст подсказывает точность. Код оставляем точным, а обзорный показатель можно округлить.',
        uz: "Vaziyat aniqlikni ko'rsatadi. Kodni aniq qoldiramiz, umumiy ko'rsatkichni esa yaxlitlash mumkin.",
      },
      on_wrong: [
        null,
        { ru: 'Сначала решаем, какая точность нужна в этой ситуации.', uz: "Avval bu vaziyatda qanday aniqlik kerakligini hal qilamiz." },
        { ru: 'Приблизительная запись помогает быстрее увидеть масштаб.', uz: "Taqribiy yozuv miqyosni tezroq ko'rishga yordam beradi." },
        { ru: 'Округляем число целиком до выбранного разряда.', uz: 'Sonni tanlangan xonagacha yaxlitlaymiz.' },
      ],
    },
  },
  s1: {
    eyebrow: { ru: 'Опорная карта', uz: 'Tayanch xarita' },
    title: { ru: 'Один разряд задаёт двух соседей', uz: "Bitta xona ikkita qo'shnini belgilaydi" },
    lead: {
      ru: 'Перед округлением отмечаем целевой разряд. Он определяет шаг между соседними круглыми числами и количество будущих нулей.',
      uz: "Yaxlitlashdan oldin maqsad xonasini belgilaymiz. U qo'shni yaxlit sonlar orasidagi qadamni va kelajakdagi nollar sonini belgilaydi.",
    },
    instruction: {
      ru: 'Для 48 764 меняются и соседи, и масштаб: десятки 48 760–48 770, сотни 48 700–48 800, тысячи 48 000–49 000.',
      uz: "48 764 uchun qo'shnilar va miqyos o'zgaradi: o'nliklar 48 760–48 770, yuzliklar 48 700–48 800, mingliklar 48 000–49 000.",
    },
    model: {
      kind: 'targetMap',
      badge: { ru: 'Три масштаба', uz: 'Uch miqyos' },
      number: '48 764',
      rows: [
        { label: { ru: 'десятки', uz: "o'nlar" }, lower: '48 760', upper: '48 770', zeros: '1' },
        { label: { ru: 'сотни', uz: 'yuzlar' }, lower: '48 700', upper: '48 800', zeros: '2' },
        { label: { ru: 'тысячи', uz: 'minglar' }, lower: '48 000', upper: '49 000', zeros: '3' },
      ],
    },
    options: [
      { ru: 'Целевой разряд определяет соседей', uz: "Maqsad xonasi qo'shnilarni belgilaydi" },
      { ru: 'Соседи всегда одинаковы', uz: "Qo'shnilar har doim bir xil" },
      { ru: 'Нужны обычные соседние числа', uz: "Oddiy qo'shni sonlar kerak" },
      { ru: 'Целевой разряд не важен', uz: 'Maqsad xonasi muhim emas' },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Чем крупнее выбранный разряд, тем шире интервал между соседями и тем больше цифр справа позже станут нулями.',
      uz: "Tanlangan xona qanchalik katta bo'lsa, qo'shnilar oralig'i shunchalik keng va keyin nolga aylanadigan o'ng raqamlar shunchalik ko'p bo'ladi.",
    },
    wrong: [
      null,
      { ru: 'Каждый разряд создаёт свою пару круглых соседей.', uz: "Har bir xona o'zining yaxlit qo'shnilar juftini yaratadi." },
      { ru: 'Нужны соседние числа выбранного разряда, а не соседние единицы.', uz: "Qo'shni birliklar emas, tanlangan xonaning qo'shni sonlari kerak." },
      { ru: 'Без целевого разряда нельзя выбрать масштаб округления.', uz: "Maqsad xonasisiz yaxlitlash miqyosini tanlab bo'lmaydi." },
    ],
    audio: {
      intro: {
        ru: [
          'Сначала выбираем целевой разряд. Он задаёт шаг между двумя круглыми соседями.',
          'Для десятков шаг равен десяти, для сотен ста, для тысяч тысяче.',
        ],
        uz: [
          "Avval maqsad xonasini tanlaymiz. U ikkita yaxlit qo'shni orasidagi qadamni belgilaydi.",
          "O'nliklar uchun qadam o'n, yuzliklar uchun yuz, mingliklar uchun ming bo'ladi.",
        ],
      },
      on_correct: {
        ru: 'Чем крупнее разряд, тем шире интервал и тем больше правых цифр после решения станут нулями.',
        uz: "Xona qanchalik katta bo'lsa, oraliq shunchalik keng va qarordan keyin ko'proq o'ng raqamlar nol bo'ladi.",
      },
      on_wrong: [
        null,
        { ru: 'У каждого разряда своя пара круглых соседей.', uz: "Har bir xonaning o'z yaxlit qo'shnilar jufti bor." },
        { ru: 'Ищем соседей выбранного масштаба.', uz: "Tanlangan miqyosdagi qo'shnilarni izlaymiz." },
        { ru: 'Целевой разряд задаёт весь дальнейший алгоритм.', uz: 'Maqsad xonasi keyingi butun algoritmni belgilaydi.' },
      ],
    },
  },
  s2: {
    eyebrow: { ru: 'Три числовые прямые', uz: "Uchta son chizig'i" },
    title: { ru: 'Одно число занимает три разных положения', uz: "Bitta son uch xil o'rinni egallaydi" },
    lead: {
      ru: 'На каждом масштабе число 48 764 остаётся тем же, но его положение между круглыми соседями меняется.',
      uz: "Har bir miqyosda 48 764 soni o'zgarmaydi, ammo yaxlit qo'shnilar orasidagi o'rni o'zgaradi.",
    },
    instruction: {
      ru: 'До десятков число ближе к 48 760, до сотен — к 48 800, до тысяч — к 49 000.',
      uz: "O'nlikkacha son 48 760 ga, yuzlikkacha 48 800 ga, minglikkacha esa 49 000 ga yaqin.",
    },
    model: {
      kind: 'multiNumberLine',
      badge: { ru: 'Сравнение масштабов', uz: 'Miqyoslarni solishtirish' },
      number: '48 764',
      lines: [
        { label: { ru: 'до десятков', uz: "o'nlikkacha" }, lower: '48 760', upper: '48 770', position: 40, inspect: '4', result: '48 760' },
        { label: { ru: 'до сотен', uz: 'yuzlikkacha' }, lower: '48 700', upper: '48 800', position: 64, inspect: '6', result: '48 800' },
        { label: { ru: 'до тысяч', uz: 'minglikkacha' }, lower: '48 000', upper: '49 000', position: 76.4, inspect: '7', result: '49 000' },
      ],
    },
    options: [
      { ru: '48 760, 48 800, 49 000', uz: '48 760, 48 800, 49 000' },
      { ru: '48 770, 48 700, 48 000', uz: '48 770, 48 700, 48 000' },
      { ru: '48 764 во всех случаях', uz: 'Barcha holatda 48 764' },
      { ru: '49 000 во всех случаях', uz: 'Barcha holatda 49 000' },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Проверочные цифры 4, 6 и 7 объясняют три разных направления. После выбора соседа справа остаются 1, 2 или 3 нуля.',
      uz: "Tekshiruvchi 4, 6 va 7 raqamlari uch xil yo'nalishni tushuntiradi. Qo'shni tanlangach, o'ngda 1, 2 yoki 3 nol qoladi.",
    },
    wrong: [
      null,
      { ru: 'Направление определяется расстоянием до соседей.', uz: "Yo'nalish qo'shnilargacha masofa bilan belgilanadi." },
      { ru: 'Округлённый результат меняется вместе с масштабом.', uz: "Yaxlitlangan natija miqyos bilan birga o'zgaradi." },
      { ru: 'Для каждого разряда выбирается своя пара соседей.', uz: "Har bir xona uchun o'z qo'shnilar jufti tanlanadi." },
    ],
    audio: {
      intro: {
        ru: [
          'Сравним три числовые прямые для одного числа.',
          'На десятках проверяем единицы, на сотнях десятки, на тысячах сотни.',
        ],
        uz: [
          "Bitta son uchun uchta son chizig'ini solishtiramiz.",
          "O'nliklarda birlarni, yuzliklarda o'nlarni, mingliklarda yuzlarni tekshiramiz.",
        ],
      },
      on_correct: {
        ru: 'Четыре ведёт к нижнему десятку, шесть к верхней сотне, а семь к верхней тысяче.',
        uz: "To'rt quyi o'nlikka, olti yuqori yuzlikka, yetti esa yuqori minglikka olib boradi.",
      },
      on_wrong: [
        null,
        { ru: 'Сравни положение маркера на каждой прямой.', uz: "Har bir chiziqdagi belgi o'rnini solishtiring." },
        { ru: 'Три масштаба дают три разных приближения.', uz: 'Uch miqyos uch xil taqribiy qiymat beradi.' },
        { ru: 'Каждая прямая имеет собственных круглых соседей.', uz: "Har bir chiziqning o'z yaxlit qo'shnilari bor." },
      ],
    },
  },
  s3: {
    eyebrow: { ru: 'Граница решения', uz: 'Qaror chegarasi' },
    title: { ru: 'Середина отделяет вниз от вверх', uz: "O'rta nuqta pastni yuqoridan ajratadi" },
    lead: {
      ru: 'На отрезке между круглыми соседями цифры от 0 до 4 лежат в нижней половине, а от 5 до 9 — в верхней.',
      uz: "Yaxlit qo'shnilar orasidagi kesmada 0 dan 4 gacha raqamlar quyi, 5 dan 9 gacha raqamlar yuqori yarmida yotadi.",
    },
    instruction: {
      ru: '48 764 идёт к 48 760, 48 765 находится на границе и идёт к 48 770, а 48 766 тоже идёт вверх.',
      uz: "48 764 soni 48 760 ga boradi, 48 765 chegarada turib 48 770 ga boradi, 48 766 ham yuqoriga boradi.",
    },
    model: {
      kind: 'decisionContrast',
      badge: { ru: 'Нижняя и верхняя половины', uz: 'Quyi va yuqori yarimlar' },
      lower: '48 760',
      midpoint: '48 765',
      upper: '48 770',
      cases: [
        { value: '48 764', inspect: '4', result: '48 760', direction: 'down' },
        { value: '48 765', inspect: '5', result: '48 770', direction: 'up' },
        { value: '48 766', inspect: '6', result: '48 770', direction: 'up' },
      ],
    },
    options: [
      { ru: '0–4 вниз, 5–9 вверх', uz: '0–4 pastga, 5–9 yuqoriga' },
      { ru: '0–5 вниз, 6–9 вверх', uz: '0–5 pastga, 6–9 yuqoriga' },
      { ru: 'Только 9 ведёт вверх', uz: 'Faqat 9 yuqoriga olib boradi' },
      { ru: 'Всегда выбираем нижнего соседа', uz: "Har doim quyi qo'shnini tanlaymiz" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Цифра 5 принадлежит верхней половине. Это правило заменяет подсчёт расстояний и работает для любого выбранного разряда.',
      uz: "5 raqami yuqori yarmiga kiradi. Bu qoida masofani sanash o'rnini bosadi va har qanday tanlangan xona uchun ishlaydi.",
    },
    wrong: [
      null,
      { ru: 'На границе 5 округляем вверх.', uz: '5 chegarasida yuqoriga yaxlitlaymiz.' },
      { ru: 'Вверх ведут пять разных цифр.', uz: 'Beshta turli raqam yuqoriga olib boradi.' },
      { ru: 'Верхняя половина ведёт к верхнему соседу.', uz: "Yuqori yarim yuqori qo'shniga olib boradi." },
    ],
    audio: {
      intro: {
        ru: [
          'Середина делит отрезок на нижнюю и верхнюю половины.',
          'Цифры от нуля до четырёх ведут вниз, а от пяти до девяти вверх.',
        ],
        uz: [
          "O'rta nuqta kesmani quyi va yuqori yarmiga ajratadi.",
          "Noldan to'rtgacha raqamlar pastga, beshdan to'qqizgacha esa yuqoriga olib boradi.",
        ],
      },
      on_correct: {
        ru: 'Пять уже относится к верхней половине. Поэтому число на границе округляется вверх.',
        uz: "Besh allaqachon yuqori yarmiga kiradi. Shuning uchun chegaradagi son yuqoriga yaxlitlanadi.",
      },
      on_wrong: [
        null,
        { ru: 'Граница начинается с пяти.', uz: 'Chegara beshdan boshlanadi.' },
        { ru: 'Верхняя половина включает пять, шесть, семь, восемь и девять.', uz: "Yuqori yarim besh, olti, yetti, sakkiz va to'qqizni o'z ichiga oladi." },
        { ru: 'Сравни число с серединой отрезка.', uz: "Sonni kesmaning o'rta nuqtasi bilan solishtiring." },
      ],
    },
  },
  s4: {
    eyebrow: { ru: 'Граница и перенос', uz: "Chegara va o'tish" },
    title: { ru: 'Пять ведёт вверх, девять переносит разряд', uz: "Besh yuqoriga olib boradi, to'qqiz xonani o'tkazadi" },
    lead: {
      ru: 'На границе пяти округляем вверх. Иногда увеличение проходит через цифру 9 и создаёт новый разряд.',
      uz: "Besh chegarasida yuqoriga yaxlitlaymiz. Ba'zan oshirish 9 raqamidan o'tib, yangi xona hosil qiladi.",
    },
    instruction: {
      ru: '27 450 до сотен даёт 27 500, а 9 950 до сотен даёт 10 000.',
      uz: "27 450 yuzlikkacha 27 500, 9 950 esa yuzlikkacha 10 000 bo'ladi.",
    },
    model: {
      kind: 'carry',
      badge: { ru: 'Два граничных случая', uz: 'Ikki chegaraviy holat' },
      examples: [
        { from: '27 450', inspect: '5', target: '4', to: '27 500', note: { ru: 'граница пяти', uz: 'besh chegarasi' } },
        { from: '9 950', inspect: '5', target: '9', to: '10 000', note: { ru: 'перенос через девять', uz: "to'qqizdan o'tish" } },
      ],
    },
    options: [
      { ru: 'Оба числа округляются вверх', uz: 'Ikkala son ham yuqoriga yaxlitlanadi' },
      { ru: 'Оба числа округляются вниз', uz: 'Ikkala son ham pastga yaxlitlanadi' },
      { ru: 'Первое вниз, второе вверх', uz: 'Birinchisi pastga, ikkinchisi yuqoriga' },
      { ru: 'Сохраняются исходные числа', uz: "Boshlang'ich sonlar o'zgarmaydi" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Цифра 5 относится к верхней половине. Если выбранный разряд равен 9, увеличение переносится влево.',
      uz: "5 raqami yuqori yarmiga kiradi. Tanlangan xona 9 bo'lsa, oshirish chapga o'tadi.",
    },
    wrong: [
      null,
      { ru: 'На границе 5 округление идёт вверх.', uz: '5 chegarasida yaxlitlash yuqoriga boradi.' },
      { ru: 'В обоих примерах справа от сотен стоит 5.', uz: "Ikkala misolda ham yuzlarning o'ngida 5 turibdi." },
      { ru: 'При округлении правые цифры не сохраняются.', uz: "Yaxlitlashda o'ngdagi raqamlar saqlanmaydi." },
    ],
    audio: {
      intro: {
        ru: ['Цифра пять открывает верхнюю половину, поэтому на границе округляем вверх.'],
        uz: ['Besh raqami yuqori yarmini boshlaydi, shuning uchun chegarada yuqoriga yaxlitlaymiz.'],
      },
      on_correct: {
        ru: 'Если сотни равны девяти, их увеличение переносится в разряд тысяч и может создать новый разряд.',
        uz: "Yuzlar to'qqiz bo'lsa, oshirish minglar xonasiga o'tadi va yangi xona hosil qilishi mumkin.",
      },
      on_wrong: [
        null,
        { ru: 'Пять всегда относится к округлению вверх.', uz: 'Besh har doim yuqoriga yaxlitlashga kiradi.' },
        { ru: 'Сравни цифру сразу справа от сотен в обоих примерах.', uz: "Ikkala misolda yuzlarning darhol o'ngidagi raqamni solishtiring." },
        { ru: 'После решения все цифры справа заменяются нулями.', uz: "Qarordan keyin o'ngdagi barcha raqamlar nolga almashtiriladi." },
      ],
    },
  },
  s5: {
    eyebrow: { ru: 'Три уровня точности', uz: 'Uch aniqlik darajasi' },
    title: { ru: 'Одно число, три результата', uz: 'Bitta son, uchta natija' },
    lead: {
      ru: 'Результат зависит от выбранного разряда, хотя исходное число остаётся тем же.',
      uz: "Boshlang'ich son bir xil bo'lsa ham, natija tanlangan xonaga bog'liq.",
    },
    instruction: {
      ru: '126 549 округляется до десятков как 126 550, до сотен как 126 500, до тысяч как 127 000.',
      uz: "126 549 o'nlikkacha 126 550, yuzlikkacha 126 500, minglikkacha 127 000 bo'ladi.",
    },
    model: {
      kind: 'precision',
      badge: { ru: 'Смена точности', uz: "Aniqlikni o'zgartirish" },
      number: '126 549',
      rows: [
        { label: { ru: 'до десятков', uz: "o'nlikkacha" }, inspect: '9', value: '126 550' },
        { label: { ru: 'до сотен', uz: 'yuzlikkacha' }, inspect: '4', value: '126 500' },
        { label: { ru: 'до тысяч', uz: 'minglikkacha' }, inspect: '5', value: '127 000' },
      ],
    },
    options: [
      { ru: 'Выбранный разряд меняет результат', uz: "Tanlangan xona natijani o'zgartiradi" },
      { ru: 'Результат всегда один', uz: 'Natija har doim bitta' },
      { ru: 'Все три записи точные', uz: 'Uchala yozuv ham aniq' },
      { ru: 'Нули можно не записывать', uz: "Nollarni yozmasa ham bo'ladi" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Каждая точность использует свою проверочную цифру и своё количество нулей справа.',
      uz: "Har bir aniqlik o'z tekshiruvchi raqami va o'ngdagi nollar sonidan foydalanadi.",
    },
    wrong: [
      null,
      { ru: 'Для разных разрядов получаются разные приближения.', uz: "Turli xonalar uchun turli taqribiy qiymatlar hosil bo'ladi." },
      { ru: 'Это приблизительные, а не точные записи.', uz: 'Bular aniq emas, taqribiy yozuvlar.' },
      { ru: 'Нули показывают выбранную точность и должны остаться.', uz: "Nollar tanlangan aniqlikni ko'rsatadi va saqlanishi kerak." },
    ],
    audio: {
      intro: {
        ru: ['Одно число можно округлить с разной точностью. Каждый раз меняется целевой разряд и проверочная цифра.'],
        uz: ["Bitta sonni turli aniqlikda yaxlitlash mumkin. Har safar maqsad xonasi va tekshiruvchi raqam o'zgaradi."],
      },
      on_correct: {
        ru: 'До десятков проверяем единицы, до сотен десятки, а до тысяч сотни.',
        uz: "O'nlikkacha birlarni, yuzlikkacha o'nlarni, minglikkacha esa yuzlarni tekshiramiz.",
      },
      on_wrong: [
        null,
        { ru: 'Смена целевого разряда меняет ближайших соседей.', uz: "Maqsad xonasi o'zgarsa, eng yaqin qo'shnilar ham o'zgaradi." },
        { ru: 'Округлённая запись показывает приближённое значение.', uz: "Yaxlitlangan yozuv taqribiy qiymatni ko'rsatadi." },
        { ru: 'Правые нули фиксируют уровень точности.', uz: "O'ngdagi nollar aniqlik darajasini ko'rsatadi." },
      ],
    },
  },
  s6: {
    eyebrow: { ru: 'Собираем правило', uz: "Qoidani yig'amiz" },
    title: { ru: 'Четыре шага округления', uz: "Yaxlitlashning to'rt qadami" },
    lead: {
      ru: 'Наблюдения превращаются в единый алгоритм для десятков, сотен и тысяч.',
      uz: "Kuzatuvlar o'nlik, yuzlik va mingliklar uchun yagona algoritmga aylanadi.",
    },
    instruction: {
      ru: 'Находим целевой разряд, проверяем соседнюю цифру справа, принимаем решение и обнуляем правую часть.',
      uz: "Maqsad xonasini topamiz, o'ngdagi qo'shni raqamni tekshiramiz, qaror qilamiz va o'ng qismini nollaymiz.",
    },
    model: {
      kind: 'steps',
      badge: { ru: 'Алгоритм', uz: 'Algoritm' },
      steps: [
        { ru: '1. Найти целевой разряд', uz: '1. Maqsad xonasini topish' },
        { ru: '2. Посмотреть на цифру справа', uz: "2. O'ngdagi raqamga qarash" },
        { ru: '3. От 0 до 4 вниз, от 5 до 9 вверх', uz: '3. 0 dan 4 gacha pastga, 5 dan 9 gacha yuqoriga' },
        { ru: '4. Справа записать нули', uz: "4. O'ng tomonga nollar yozish" },
      ],
    },
    options: [
      { ru: 'Целевой разряд → сосед справа → решение → нули', uz: "Maqsad xonasi → o'ng qo'shni → qaror → nollar" },
      { ru: 'Округлить каждую цифру отдельно', uz: 'Har bir raqamni alohida yaxlitlash' },
      { ru: 'Смотреть только на целевой разряд', uz: 'Faqat maqsad xonasiga qarash' },
      { ru: 'Сохранить все цифры справа', uz: "O'ngdagi barcha raqamlarni saqlash" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Решение принимает только цифра сразу справа. Остальные правые цифры после этого заменяются нулями.',
      uz: "Qarorni faqat darhol o'ngdagi raqam qiladi. Shundan keyin boshqa o'ng raqamlar nolga almashtiriladi.",
    },
    wrong: [
      null,
      { ru: 'Число округляется целиком до одного выбранного разряда.', uz: 'Son bitta tanlangan xonagacha yaxlitlanadi.' },
      { ru: 'Нужна цифра сразу справа от цели.', uz: "Maqsadning darhol o'ngidagi raqam kerak." },
      { ru: 'Правые цифры заменяются нулями.', uz: "O'ngdagi raqamlar nolga almashtiriladi." },
    ],
    audio: {
      intro: {
        ru: ['Соберём правило. Сначала выбираем разряд, затем смотрим на цифру сразу справа.'],
        uz: ["Qoidani yig'amiz. Avval xonani tanlaymiz, keyin darhol o'ngdagi raqamga qaraymiz."],
      },
      on_correct: {
        ru: 'От нуля до четырёх округляем вниз, от пяти до девяти вверх. После решения справа записываем нули.',
        uz: "Noldan to'rtgacha pastga, beshdan to'qqizgacha yuqoriga yaxlitlaymiz. Qarordan keyin o'ng tomonga nollar yozamiz.",
      },
      on_wrong: [
        null,
        { ru: 'Округление работает с выбранным разрядом, а не с каждой цифрой отдельно.', uz: 'Yaxlitlash har bir raqam bilan alohida emas, tanlangan xona bilan ishlaydi.' },
        { ru: 'Целевой разряд сам не принимает решение.', uz: "Maqsad xonasining o'zi qaror qilmaydi." },
        { ru: 'После решения правую часть заменяем нулями.', uz: "Qarordan keyin o'ng qismini nollar bilan almashtiramiz." },
      ],
    },
  },
  s7: {
    eyebrow: { ru: 'Мини-проверка', uz: 'Mini tekshiruv' },
    title: { ru: 'Округли до сотен', uz: 'Yuzlikkacha yaxlitlang' },
    lead: {
      ru: 'Теперь один короткий ответ без готовых вариантов.',
      uz: 'Endi tayyor variantlarsiz bitta qisqa javob.',
    },
    instruction: {
      ru: 'Округли 63 746 до ближайших сотен.',
      uz: '63 746 sonini eng yaqin yuzlikkacha yaxlitlang.',
    },
    model: {
      kind: 'roundingFocus',
      badge: { ru: 'Мини-проверка', uz: 'Mini tekshiruv' },
      number: '63 746',
      targetIndex: 2,
      inspectIndex: 3,
      result: '?',
      direction: 'down',
    },
    options: ['63 700', '63 800', '63 740', '64 000'],
    correctIndex: 0,
    inputWrongDefault: {
      ru: 'Отметь сотни, посмотри на десятки и замени две правые цифры нулями.',
      uz: "Yuzlarni belgilang, o'nlarga qarang va o'ngdagi ikkita raqamni nolga almashtiring.",
    },
    inputWrongAudio: {
      ru: 'Для сотен решение принимает цифра десятков. После решения справа остаются два нуля.',
      uz: "Yuzlik uchun qarorni o'nlar raqami qiladi. Qarordan keyin o'ngda ikkita nol qoladi.",
    },
    correctText: {
      ru: '63 700: в десятках стоит 4, поэтому сотни сохраняются, а десятки и единицы становятся нулями.',
      uz: "63 700: o'nlar xonasida 4 turibdi, shuning uchun yuzlar saqlanadi, o'nlar va birlar nol bo'ladi.",
    },
    wrong: [
      null,
      { ru: '63 800 получилось бы при цифре десятков от 5 до 9. Здесь стоит 4.', uz: "63 800 o'nlar raqami 5 dan 9 gacha bo'lganda hosil bo'lardi. Bu yerda 4 turibdi." },
      { ru: '63 740 сохраняет десятки. После округления до сотен нужны два нуля.', uz: "63 740 o'nlarni saqlaydi. Yuzlikkacha yaxlitlashdan keyin ikkita nol kerak." },
      { ru: '64 000 — округление до тысяч, а не до сотен.', uz: '64 000 minglikkacha yaxlitlash, yuzlikkacha emas.' },
    ],
    audio: {
      intro: {
        ru: ['Округли шестьдесят три тысячи семьсот сорок шесть до ближайших сотен.'],
        uz: ['Oltmish uch ming yetti yuz qirq olti sonini eng yaqin yuzlikkacha yaxlitlang.'],
      },
      on_correct: {
        ru: 'В десятках стоит четыре. Сотни сохраняются, а две правые цифры становятся нулями.',
        uz: "O'nlar xonasida to'rt turibdi. Yuzlar saqlanadi, o'ngdagi ikkita raqam nol bo'ladi.",
      },
      on_wrong: [
        null,
        { ru: 'Четыре не увеличивает сотни.', uz: "To'rt yuzlarni oshirmaydi." },
        { ru: 'После округления до сотен справа остаются два нуля.', uz: "Yuzlikkacha yaxlitlashdan keyin o'ngda ikkita nol qoladi." },
        { ru: 'Сохрани точность до сотен, не до тысяч.', uz: 'Minglikkacha emas, yuzlikkacha aniqlikni saqlang.' },
      ],
    },
  },
  s8: {
    eyebrow: { ru: 'Развёрнутый пример', uz: 'Batafsil misol' },
    title: { ru: 'Проверяем три точности на новом числе', uz: 'Yangi sonda uch aniqlikni tekshiramiz' },
    lead: {
      ru: 'В каждом ряду отмечен свой целевой разряд и своя проверочная цифра.',
      uz: "Har bir qatorda o'z maqsad xonasi va o'z tekshiruvchi raqami belgilangan.",
    },
    instruction: {
      ru: '395 860 даёт 395 860 до десятков, 395 900 до сотен и 396 000 до тысяч.',
      uz: "395 860 o'nlikkacha 395 860, yuzlikkacha 395 900 va minglikkacha 396 000 bo'ladi.",
    },
    model: {
      kind: 'precision',
      badge: { ru: 'Рабочая таблица', uz: 'Ish jadvali' },
      number: '395 860',
      rows: [
        { label: { ru: 'до десятков', uz: "o'nlikkacha" }, inspect: '0', value: '395 860' },
        { label: { ru: 'до сотен', uz: 'yuzlikkacha' }, inspect: '6', value: '395 900' },
        { label: { ru: 'до тысяч', uz: 'minglikkacha' }, inspect: '8', value: '396 000' },
      ],
    },
    options: [
      { ru: 'Все три результата согласованы с правилом', uz: 'Uchala natija ham qoidaga mos' },
      { ru: 'До сотен должно быть 395 800', uz: "Yuzlikkacha 395 800 bo'lishi kerak" },
      { ru: 'До тысяч должно быть 395 000', uz: "Minglikkacha 395 000 bo'lishi kerak" },
      { ru: 'До десятков нужно менять число', uz: "O'nlikkacha sonni o'zgartirish kerak" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Ноль сохраняет десятки, шесть увеличивает сотни, а восемь увеличивает тысячи.',
      uz: "Nol o'nlarni saqlaydi, olti yuzlarni oshiradi, sakkiz esa minglarni oshiradi.",
    },
    wrong: [
      null,
      { ru: 'Шесть в десятках ведёт к верхней сотне.', uz: "O'nlardagi olti yuqori yuzlikka olib boradi." },
      { ru: 'Восемь в сотнях ведёт к верхней тысяче.', uz: 'Yuzlardagi sakkiz yuqori minglikka olib boradi.' },
      { ru: 'Ноль в единицах оставляет число на том же десятке.', uz: "Birlar xonasidagi nol sonni shu o'nlikda qoldiradi." },
    ],
    audio: {
      intro: {
        ru: ['Разберём новое число с тремя уровнями точности. Проверочная цифра каждый раз меняется.'],
        uz: ["Yangi sonni uch aniqlik darajasida tahlil qilamiz. Tekshiruvchi raqam har safar o'zgaradi."],
      },
      on_correct: {
        ru: 'Ноль сохраняет десятки, шесть повышает сотни, а восемь повышает тысячи.',
        uz: "Nol o'nlarni saqlaydi, olti yuzlarni, sakkiz esa minglarni oshiradi.",
      },
      on_wrong: [
        null,
        { ru: 'Шесть относится к верхней половине.', uz: 'Olti yuqori yarmiga kiradi.' },
        { ru: 'Восемь относится к верхней половине.', uz: 'Sakkiz yuqori yarmiga kiradi.' },
        { ru: 'Ноль не увеличивает выбранный разряд.', uz: 'Nol tanlangan xonani oshirmaydi.' },
      ],
    },
  },
  s9: {
    eyebrow: { ru: 'Лаборатория примеров', uz: 'Misollar laboratoriyasi' },
    title: { ru: 'Четыре готовых решения', uz: "To'rtta tayyor yechim" },
    lead: {
      ru: 'Каждая карточка показывает целевой разряд, проверочную цифру и готовый результат.',
      uz: "Har bir kartochka maqsad xonasi, tekshiruvchi raqam va tayyor natijani ko'rsatadi.",
    },
    audio: {
      intro: {
        ru: ['Разберём четыре готовых решения. Следи, какая цифра принимает решение и сколько нулей остаётся справа.'],
        uz: ["To'rtta tayyor yechimni tahlil qilamiz. Qaysi raqam qaror qilishi va o'ngda nechta nol qolishini kuzating."],
      },
    },
    items: [
      {
        question: { ru: '72 345 до десятков', uz: "72 345 o'nlikkacha" },
        options: ['72 350', '72 340', '72 300', '73 000'],
        correctIndex: 0,
        correctText: {
          ru: 'В единицах стоит 5, поэтому десятки увеличиваются.',
          uz: "Birlar xonasida 5 turibdi, shuning uchun o'nlar oshadi.",
        },
        wrong: [
          null,
          { ru: 'При 5 округляем вверх.', uz: "5 bo'lganda yuqoriga yaxlitlaymiz." },
          { ru: 'Это округление до сотен.', uz: 'Bu yuzlikkacha yaxlitlash.' },
          { ru: 'Это слишком крупная точность.', uz: 'Bu juda katta aniqlik.' },
        ],
        audio: {
          intro: { ru: ['Округляем семьдесят две тысячи триста сорок пять до десятков.'], uz: ["Yetmish ikki ming uch yuz qirq beshni o'nlikkacha yaxlitlaymiz."] },
          on_correct: { ru: 'Пять в единицах увеличивает десятки. Получаем семьдесят две тысячи триста пятьдесят.', uz: "Birlar xonasidagi besh o'nlarni oshiradi. Yetmish ikki ming uch yuz ellik hosil bo'ladi." },
          on_wrong: [null, { ru: 'Пять ведёт вверх.', uz: 'Besh yuqoriga olib boradi.' }, { ru: 'Сохрани точность до десятков.', uz: "O'nlikkacha aniqlikni saqlang." }, { ru: 'В этом примере округляем до десятков, а не до тысяч.', uz: "Bu misolda minglikkacha emas, o'nlikkacha yaxlitlash kerak." }],
        },
      },
      {
        question: { ru: '72 345 до сотен', uz: '72 345 yuzlikkacha' },
        options: ['72 300', '72 400', '72 340', '72 000'],
        correctIndex: 0,
        correctText: {
          ru: 'В десятках стоит 4, поэтому сотни сохраняются.',
          uz: "O'nlar xonasida 4 turibdi, shuning uchun yuzlar saqlanadi.",
        },
        wrong: [
          null,
          { ru: 'Четыре не увеличивает сотни.', uz: "To'rt yuzlarni oshirmaydi." },
          { ru: 'После сотен справа нужны два нуля.', uz: "Yuzlardan keyin o'ngda ikkita nol kerak." },
          { ru: 'Это округление до тысяч.', uz: 'Bu minglikkacha yaxlitlash.' },
        ],
        audio: {
          intro: { ru: ['Теперь округляем то же число до сотен и смотрим на десятки.'], uz: ["Endi shu sonni yuzlikkacha yaxlitlab, o'nlar xonasiga qaraymiz."] },
          on_correct: { ru: 'Четыре в десятках сохраняет сотни. Получаем семьдесят две тысячи триста.', uz: "O'nlardagi to'rt yuzlarni saqlaydi. Yetmish ikki ming uch yuz hosil bo'ladi." },
          on_wrong: [null, { ru: 'Четыре ведёт вниз.', uz: "To'rt pastga olib boradi." }, { ru: 'Справа от сотен нужны нули.', uz: "Yuzlarning o'ngida nollar kerak." }, { ru: 'Сохрани точность до сотен.', uz: 'Yuzlikkacha aniqlikni saqlang.' }],
        },
      },
      {
        question: { ru: '72 345 до тысяч', uz: '72 345 minglikkacha' },
        options: ['72 000', '73 000', '72 300', '70 000'],
        correctIndex: 0,
        correctText: {
          ru: 'В сотнях стоит 3, поэтому тысячи сохраняются.',
          uz: 'Yuzlar xonasida 3 turibdi, shuning uchun minglar saqlanadi.',
        },
        wrong: [
          null,
          { ru: 'Три не увеличивает тысячи.', uz: 'Uch minglarni oshirmaydi.' },
          { ru: 'После тысяч справа нужны три нуля.', uz: "Minglardan keyin o'ngda uchta nol kerak." },
          { ru: 'Это округление до десятков тысяч.', uz: "Bu o'n minglikkacha yaxlitlash." },
        ],
        audio: {
          intro: { ru: ['Теперь округляем то же число до тысяч и смотрим на сотни.'], uz: ['Endi shu sonni minglikkacha yaxlitlab, yuzlar xonasiga qaraymiz.'] },
          on_correct: { ru: 'Три в сотнях сохраняет тысячи. Получаем семьдесят две тысячи.', uz: "Yuzlardagi uch minglarni saqlaydi. Yetmish ikki ming hosil bo'ladi." },
          on_wrong: [null, { ru: 'Три ведёт вниз.', uz: 'Uch pastga olib boradi.' }, { ru: 'Справа от тысяч нужны нули.', uz: "Minglarning o'ngida nollar kerak." }, { ru: 'Не переходи к десяткам тысяч.', uz: "O'n mingliklarga o'tmang." }],
        },
      },
      {
        question: { ru: '999 500 до тысяч', uz: '999 500 minglikkacha' },
        options: ['1 000 000', '999 000', '999 500', '100 000'],
        correctIndex: 0,
        correctText: {
          ru: 'Пять в сотнях увеличивает 999 тысяч и создаёт 1 миллион.',
          uz: 'Yuzlardagi 5 raqami 999 mingni oshirib, 1 million hosil qiladi.',
        },
        wrong: [
          null,
          { ru: 'Пять требует округлить вверх.', uz: 'Besh yuqoriga yaxlitlashni talab qiladi.' },
          { ru: 'Правые цифры должны стать нулями.', uz: "O'ngdagi raqamlar nolga aylanishi kerak." },
          { ru: 'Потерян один разряд.', uz: "Bitta xona yo'qolgan." },
        ],
        audio: {
          intro: { ru: ['Округляем девятьсот девяносто девять тысяч пятьсот до тысяч.'], uz: ["To'qqiz yuz to'qson to'qqiz ming besh yuzni minglikkacha yaxlitlaymiz."] },
          on_correct: { ru: 'Пять увеличивает тысячи. Перенос проходит через три девятки и создаёт один миллион.', uz: "Besh minglarni oshiradi. O'tish uchta to'qqizdan o'tib, bir million hosil qiladi." },
          on_wrong: [null, { ru: 'Пять ведёт вверх.', uz: 'Besh yuqoriga olib boradi.' }, { ru: 'После решения справа остаются нули.', uz: "Qarordan keyin o'ngda nollar qoladi." }, { ru: 'Сохрани новый старший разряд.', uz: 'Yangi katta xonani saqlang.' }],
        },
      },
    ],
    completionText: { ru: 'Четыре решения разобраны.', uz: "To'rtta yechim tahlil qilindi." },
  },
  s10: {
    eyebrow: { ru: 'Стратегия точности', uz: 'Aniqlik strategiyasi' },
    title: { ru: 'Когда нужна точность, а когда приближение', uz: 'Qachon aniqlik, qachon taqribiylik kerak' },
    lead: {
      ru: 'Округление полезно не всегда. Сначала определяем, какую задачу решает число.',
      uz: "Yaxlitlash har doim ham foydali emas. Avval son qanday vazifani bajarishini aniqlaymiz.",
    },
    instruction: {
      ru: 'Код и платёж сохраняем точно, а поток людей и расстояние для обзора можно показать приблизительно.',
      uz: "Kod va to'lovni aniq saqlaymiz, odamlar oqimi va masofani umumiy ko'rish uchun taqribiy ko'rsatish mumkin.",
    },
    model: {
      kind: 'contexts',
      badge: { ru: 'Выбор точности', uz: 'Aniqlikni tanlash' },
      cards: [
        { label: { ru: 'код датчика', uz: 'sensor kodi' }, value: '286 471', result: { ru: 'точно', uz: 'aniq' }, tone: 'cyan' },
        { label: { ru: 'посетители', uz: 'tashrifchilar' }, value: '286 471', result: { ru: 'примерно 286 000', uz: 'taxminan 286 000' }, tone: 'accent' },
        { label: { ru: 'расстояние', uz: 'masofa' }, value: '48 764 м', result: { ru: 'примерно 49 000 м', uz: 'taxminan 49 000 m' }, tone: 'lime' },
      ],
    },
    options: [
      { ru: 'Сначала определить назначение числа', uz: 'Avval sonning vazifasini aniqlash' },
      { ru: 'Всегда округлять до тысяч', uz: 'Har doim minglikkacha yaxlitlash' },
      { ru: 'Всегда сохранять все цифры', uz: 'Har doim barcha raqamlarni saqlash' },
      { ru: 'Выбирать точность случайно', uz: 'Aniqlikni tasodifiy tanlash' },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Чем важнее каждая единица, тем точнее запись. Для общего масштаба выбираем удобный крупный разряд.',
      uz: "Har bir birlik qanchalik muhim bo'lsa, yozuv shunchalik aniq bo'ladi. Umumiy miqyos uchun qulay katta xonani tanlaymiz.",
    },
    wrong: [
      null,
      { ru: 'Тысячи слишком грубы для кода или оплаты.', uz: "Mingliklar kod yoki to'lov uchun juda qo'pol." },
      { ru: 'Для обзора лишние цифры могут мешать.', uz: "Umumiy ko'rishda ortiqcha raqamlar xalaqit berishi mumkin." },
      { ru: 'Точность выбирают по смыслу ситуации.', uz: "Aniqlik vaziyat ma'nosiga ko'ra tanlanadi." },
    ],
    audio: {
      intro: {
        ru: ['Сначала определяем назначение числа. Код и платёж требуют точности, а общий поток можно показать приблизительно.'],
        uz: ["Avval sonning vazifasini aniqlaymiz. Kod va to'lov aniqlikni talab qiladi, umumiy oqimni esa taqribiy ko'rsatish mumkin."],
      },
      on_correct: {
        ru: 'Если важна каждая единица, число не округляем. Для быстрого обзора выбираем удобный крупный разряд.',
        uz: "Har bir birlik muhim bo'lsa, sonni yaxlitlamaymiz. Tez ko'rish uchun qulay katta xonani tanlaymiz.",
      },
      on_wrong: [
        null,
        { ru: 'Смысл числа определяет допустимую точность.', uz: "Sonning ma'nosi mumkin bo'lgan aniqlikni belgilaydi." },
        { ru: 'Иногда приблизительная запись понятнее.', uz: "Ba'zan taqribiy yozuv tushunarliroq bo'ladi." },
        { ru: 'Выбор точности должен объясняться задачей.', uz: 'Aniqlik tanlovi vazifa bilan tushuntirilishi kerak.' },
      ],
    },
  },
  s11: {
    eyebrow: { ru: 'Разбор ошибки', uz: 'Xatoni tahlil qilish' },
    title: { ru: 'Bit посмотрел не на тот разряд', uz: "Bit noto'g'ri xonaga qaradi" },
    lead: {
      ru: 'Bit округлял 84 768 до сотен и оставил неверный результат. Проследим три типичные ошибки.',
      uz: "Bit 84 768 sonini yuzlikkacha yaxlitlab, noto'g'ri natija qoldirdi. Uchta odatiy xatoni kuzatamiz.",
    },
    instruction: {
      ru: 'Для сотен смотрим на десятки. Цифра 6 ведёт вверх, поэтому правильный результат 84 800.',
      uz: "Yuzlik uchun o'nlarga qaraymiz. 6 raqami yuqoriga olib boradi, shuning uchun to'g'ri natija 84 800.",
    },
    model: {
      kind: 'roundingError',
      badge: { ru: 'Черновик Bit', uz: 'Bit qoralamasi' },
      number: '84 768',
      target: { ru: 'до сотен', uz: 'yuzlikkacha' },
      drafts: [
        { value: '84 700', label: { ru: 'посмотрел на 7 сотен', uz: '7 yuzlikka qaradi' } },
        { value: '85 000', label: { ru: 'округлил каждую цифру', uz: 'har bir raqamni yaxlitladi' } },
        { value: '84 868', label: { ru: 'сохранил правые цифры', uz: "o'ng raqamlarni saqladi" } },
      ],
      result: '84 800',
    },
    options: ['84 800', '84 700', '85 000', '84 868'],
    correctIndex: 0,
    correctText: {
      ru: 'Проверяем только десятки, увеличиваем сотни и заменяем десятки с единицами нулями.',
      uz: "Faqat o'nlarni tekshiramiz, yuzlarni oshiramiz va o'nlar bilan birlarni nolga almashtiramiz.",
    },
    wrong: [
      null,
      { ru: 'Целевая цифра 7 не принимает решение. Нужно смотреть на 6 десятков.', uz: "Maqsad raqami 7 qaror qilmaydi. 6 o'nlikka qarash kerak." },
      { ru: 'Нельзя округлять каждую цифру независимо.', uz: "Har bir raqamni mustaqil yaxlitlab bo'lmaydi." },
      { ru: 'После округления до сотен две правые цифры становятся нулями.', uz: "Yuzlikkacha yaxlitlashdan keyin o'ngdagi ikki raqam nol bo'ladi." },
    ],
    audio: {
      intro: {
        ru: ['Bit округляет восемьдесят четыре тысячи семьсот шестьдесят восемь до сотен. Проверим его рассуждение.'],
        uz: ["Bit sakson to'rt ming yetti yuz oltmish sakkizni yuzlikkacha yaxlitlayapti. Uning fikrini tekshiramiz."],
      },
      on_correct: {
        ru: 'Решение принимает шесть в десятках. Сотни увеличиваются, а десятки и единицы становятся нулями.',
        uz: "Qarorni o'nlardagi olti qiladi. Yuzlar oshadi, o'nlar va birlar esa nolga aylanadi.",
      },
      on_wrong: [
        null,
        { ru: 'Смотри на цифру сразу справа от сотен.', uz: "Yuzlarning darhol o'ngidagi raqamga qarang." },
        { ru: 'Округляем число до одного выбранного разряда.', uz: 'Sonni bitta tanlangan xonagacha yaxlitlaymiz.' },
        { ru: 'Правые цифры после решения заменяем нулями.', uz: "Qarordan keyin o'ngdagi raqamlarni nolga almashtiramiz." },
      ],
    },
  },
  s12: {
    eyebrow: { ru: 'Городской перенос', uz: "Shahar vaziyatiga ko'chirish" },
    title: { ru: 'Обнови главное табло', uz: 'Asosiy tabloni yangilang' },
    lead: {
      ru: 'На табло нужно показать число посетителей с точностью до тысяч.',
      uz: "Tabloda tashrifchilar sonini minglikkacha aniqlikda ko'rsatish kerak.",
    },
    instruction: {
      ru: 'Округли 286 471 до ближайших тысяч.',
      uz: '286 471 sonini eng yaqin minglikkacha yaxlitlang.',
    },
    model: {
      kind: 'roundingFocus',
      badge: { ru: 'Финальное табло', uz: 'Yakuniy tablo' },
      number: '286 471',
      targetIndex: 2,
      inspectIndex: 3,
      result: '?',
      direction: 'down',
    },
    options: ['286 000', '287 000', '286 400', '280 000'],
    correctIndex: 0,
    correctText: {
      ru: 'В сотнях стоит 4, поэтому тысячи сохраняются, а три правые цифры становятся нулями.',
      uz: "Yuzlar xonasida 4 turibdi, shuning uchun minglar saqlanadi, o'ngdagi uchta raqam nol bo'ladi.",
    },
    wrong: [
      null,
      { ru: '287 000 получилось бы при сотнях от 5 до 9. Здесь стоит 4.', uz: "287 000 yuzlar 5 dan 9 gacha bo'lganda hosil bo'lardi. Bu yerda 4 turibdi." },
      { ru: '286 400 сохраняет сотни. После округления до тысяч нужны три нуля.', uz: '286 400 yuzlarni saqlaydi. Minglikkacha yaxlitlashdan keyin uchta nol kerak.' },
      { ru: '280 000 округлено до десятков тысяч, а не до тысяч.', uz: "280 000 o'n minglikkacha yaxlitlangan, minglikkacha emas." },
    ],
    audio: {
      intro: {
        ru: ['Округли двести восемьдесят шесть тысяч четыреста семьдесят один до ближайших тысяч.'],
        uz: ["Ikki yuz sakson olti ming to'rt yuz yetmish birni eng yaqin minglikkacha yaxlitlang."],
      },
      on_correct: {
        ru: 'В сотнях стоит четыре. Тысячи сохраняются, а три правые цифры становятся нулями.',
        uz: "Yuzlar xonasida to'rt turibdi. Minglar saqlanadi, o'ngdagi uchta raqam nol bo'ladi.",
      },
      on_wrong: [
        null,
        { ru: 'Четыре не увеличивает тысячи.', uz: "To'rt minglarni oshirmaydi." },
        { ru: 'После округления до тысяч справа остаются три нуля.', uz: "Minglikkacha yaxlitlashdan keyin o'ngda uchta nol qoladi." },
        { ru: 'Сохрани точность до тысяч, не до десятков тысяч.', uz: "O'n minglikkacha emas, minglikkacha aniqlikni saqlang." },
      ],
    },
  },
  s13: {
    eyebrow: { ru: 'Точность результата', uz: 'Natija aniqligi' },
    title: { ru: 'Круглое число хранит коридор возможных значений', uz: "Yaxlit son mumkin bo'lgan qiymatlar oralig'ini saqlaydi" },
    lead: {
      ru: 'После финальной миссии посмотрим глубже: результат 84 800 не раскрывает исходное число точно, но задаёт его границы.',
      uz: "Yakuniy missiyadan keyin chuqurroq qaraymiz: 84 800 natijasi boshlang'ich sonni aniq ko'rsatmaydi, ammo uning chegaralarini belgilaydi.",
    },
    instruction: {
      ru: 'До сотен все числа от 84 750 до 84 849 округляются к 84 800. Число 84 850 уже переходит к следующей сотне.',
      uz: "Yuzlikkacha 84 750 dan 84 849 gacha bo'lgan barcha sonlar 84 800 ga yaxlitlanadi. 84 850 esa keyingi yuzlikka o'tadi.",
    },
    model: {
      kind: 'accuracyCorridor',
      badge: { ru: 'Коридор округления', uz: "Yaxlitlash oralig'i" },
      rows: [
        { label: { ru: 'нижняя граница', uz: 'quyi chegara' }, value: '84 750' },
        { label: { ru: 'круглый результат', uz: 'yaxlit natija' }, value: '84 800' },
        { label: { ru: 'верхняя граница', uz: 'yuqori chegara' }, value: '84 849' },
        { label: { ru: 'следующий шаг', uz: 'keyingi qadam' }, value: '84 850 → 84 900' },
      ],
    },
    options: [
      { ru: 'Результат задаёт диапазон, но не единственное исходное число', uz: "Natija oraliqni belgilaydi, ammo yagona boshlang'ich sonni emas" },
      { ru: 'Исходное число обязательно равно 84 800', uz: "Boshlang'ich son albatta 84 800 ga teng" },
      { ru: 'Все числа до 84 899 дадут 84 800', uz: '84 899 gacha barcha sonlar 84 800 ni beradi' },
      { ru: 'По округлению нельзя узнать даже порядок величины', uz: "Yaxlitlashdan son miqyosini ham bilib bo'lmaydi" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Округлённая запись показывает масштаб и коридор точных значений. Чем крупнее выбранный разряд, тем шире этот коридор.',
      uz: "Yaxlit yozuv miqyosni va aniq qiymatlar oralig'ini ko'rsatadi. Tanlangan xona qanchalik katta bo'lsa, oraliq shunchalik keng bo'ladi.",
    },
    fact: {
      ru: 'При округлении до сотен отличие от точного числа не превышает 50.',
      uz: 'Yuzlikkacha yaxlitlashda aniq sondan farq 50 dan oshmaydi.',
    },
    wrong: [
      null,
      { ru: 'Одному круглому результату соответствует много точных чисел.', uz: "Bitta yaxlit natijaga ko'p aniq sonlar mos keladi." },
      { ru: 'На числе 84 850 начинается переход к 84 900.', uz: "84 850 sonidan 84 900 ga o'tish boshlanadi." },
      { ru: 'Круглый результат сохраняет общий масштаб исходного числа.', uz: "Yaxlit natija boshlang'ich sonning umumiy miqyosini saqlaydi." },
    ],
    audio: {
      intro: {
        ru: [
          'Нижняя граница коридора равна восьмидесяти четырём тысячам семистам пятидесяти. Это число округляется к восьмидесяти четырём тысячам восьмистам.',
          'Круглый результат восемьдесят четыре тысячи восемьсот может получиться из многих точных чисел.',
          'Верхняя граница этого коридора равна восьмидесяти четырём тысячам восьмистам сорока девяти. Она ещё даёт тот же результат.',
          'С восьмидесяти четырёх тысяч восьмисот пятидесяти начинается следующий коридор. Число округляется к восьмидесяти четырём тысячам девятистам.',
        ],
        uz: [
          "Oraliqning quyi chegarasi sakson to'rt ming yetti yuz ellik. Bu son sakson to'rt ming sakkiz yuzga yaxlitlanadi.",
          "Sakson to'rt ming sakkiz yuz yaxlit natijasi ko'p aniq sonlardan hosil bo'lishi mumkin.",
          "Bu oraliqning yuqori chegarasi sakson to'rt ming sakkiz yuz qirq to'qqiz. U ham ayni natijani beradi.",
          "Sakson to'rt ming sakkiz yuz ellikdan keyingi oraliq boshlanadi. Son sakson to'rt ming to'qqiz yuzga yaxlitlanadi.",
        ],
      },
      on_correct: {
        ru: 'Чем крупнее выбранный разряд округления, тем шире коридор возможных исходных значений.',
        uz: "Yaxlitlash xonasi qanchalik katta bo'lsa, mumkin bo'lgan boshlang'ich qiymatlar oralig'i shunchalik keng bo'ladi.",
      },
      on_wrong: [
        null,
        { ru: 'Один округлённый результат может получиться из многих точных чисел.', uz: "Bitta yaxlit natija ko'p aniq sonlardan hosil bo'lishi mumkin." },
        { ru: 'Следующая сотня начинается с восьмидесяти четырёх тысяч восьмисот пятидесяти.', uz: "Keyingi yuzlik sakson to'rt ming sakkiz yuz ellikdan boshlanadi." },
        { ru: 'Округление сохраняет масштаб числа, хотя скрывает часть точности.', uz: "Yaxlitlash aniqlikning bir qismini yashirsa ham, son miqyosini saqlaydi." },
      ],
    },
  },
  s14: {
    eyebrow: { ru: 'Итог и мост', uz: "Yakun va ko'prik" },
    title: { ru: 'Табло показывает нужную точность', uz: "Tablo kerakli aniqlikni ko'rsatadi" },
    lead: {
      ru: 'Соберём выбор точности и четыре шага округления в одну памятку.',
      uz: "Aniqlikni tanlash va yaxlitlashning to'rt qadamini bitta eslatmaga birlashtiramiz.",
    },
    instruction: {
      ru: 'Сначала выбираем точность, затем проверяем соседнюю цифру справа и обнуляем всю правую часть.',
      uz: "Avval aniqlikni tanlaymiz, keyin o'ngdagi qo'shni raqamni tekshirib, butun o'ng qismini nollaymiz.",
    },
    model: {
      kind: 'reward',
      badge: { ru: 'Модуль округления восстановлен', uz: 'Yaxlitlash moduli tiklandi' },
      number: { ru: 'ТОЧНО ≈ ОКРУГЛЁННО', uz: 'ANIQ ≈ YAXLIT' },
    },
    options: [
      { ru: 'Выбрать разряд, проверить цифру справа, решить направление и записать нули', uz: "Xonani tanlash, o'ngdagi raqamni tekshirish, yo'nalishni hal qilish va nollar yozish" },
      { ru: 'Округлить каждую цифру отдельно', uz: 'Har bir raqamni alohida yaxlitlash' },
      { ru: 'Смотреть только на целевой разряд', uz: 'Faqat maqsad xonasiga qarash' },
      { ru: 'Всегда округлять до тысяч', uz: 'Har doim minglikkacha yaxlitlash' },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Алгоритм работает для десятков, сотен и тысяч, а контекст помогает выбрать нужную точность.',
      uz: "Algoritm o'nlik, yuzlik va mingliklar uchun ishlaydi, vaziyat esa kerakli aniqlikni tanlashga yordam beradi.",
    },
    bridge: {
      ru: 'В следующем уроке чтение, разрядный состав, сравнение и округление соединятся в одной задаче.',
      uz: "Keyingi darsda o'qish, xona tarkibi, taqqoslash va yaxlitlash bitta vazifada birlashadi.",
    },
    wrong: [
      null,
      { ru: 'Число округляется целиком до выбранного разряда.', uz: 'Son tanlangan xonagacha yaxlitlanadi.' },
      { ru: 'Решение принимает цифра сразу справа.', uz: "Qarorni darhol o'ngdagi raqam qiladi." },
      { ru: 'Точность выбирают по смыслу задачи.', uz: "Aniqlik vazifa ma'nosiga ko'ra tanlanadi." },
    ],
    audio: {
      intro: {
        ru: ['Миссия завершена. Соединим выбор точности и шаги округления в одну памятку.'],
        uz: ["Missiya yakunlandi. Aniqlikni tanlash va yaxlitlash qadamlarini bitta eslatmaga birlashtiramiz."],
      },
      on_correct: {
        ru: 'Выбираем разряд, смотрим на соседнюю цифру справа, принимаем решение и заменяем правую часть нулями.',
        uz: "Xonani tanlaymiz, o'ngdagi qo'shni raqamga qaraymiz, qaror qilamiz va o'ng qismini nollar bilan almashtiramiz.",
      },
      on_wrong: [
        null,
        { ru: 'Округление выполняем до одного выбранного разряда.', uz: 'Yaxlitlashni bitta tanlangan xonagacha bajaramiz.' },
        { ru: 'Проверочная цифра находится сразу справа.', uz: "Tekshiruvchi raqam darhol o'ngda joylashadi." },
        { ru: 'Контекст определяет полезную точность.', uz: 'Vaziyat foydali aniqlikni belgilaydi.' },
      ],
    },
  },
};
const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'rounding-mission', template: 'TheoryScreen', goal: 'Distinguish exact data from useful approximation', misconceptions: ['always round', 'never round'], active: false, scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', subtype: 'foundation-target-map', template: 'TheoryScreen', goal: 'Connect target place to round neighbors and right-side zeros', misconceptions: ['ordinary neighbors', 'wrong scale'], active: false, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'multi-number-line', template: 'TheoryScreen', goal: 'Compare tens, hundreds, and thousands on three scales', misconceptions: ['same neighbors at every precision'], active: false, scored: false, scope: null },
  { id: 's3', type: 'exploration', subtype: 'midpoint-decision-contrast', template: 'TheoryScreen', goal: 'Derive the zero-to-four and five-to-nine threshold', misconceptions: ['five rounds down'], active: false, scored: false, scope: null },
  { id: 's4', type: 'exploration', subtype: 'threshold-carry-reveal', template: 'TheoryScreen', goal: 'Explain midpoint rounding and carrying through nine', misconceptions: ['five rounds down', 'carry stops at nine'], active: false, scored: false, scope: null },
  { id: 's5', type: 'exploration', subtype: 'three-precision-comparison', template: 'TheoryScreen', goal: 'Round one number to tens, hundreds, and thousands', misconceptions: ['one result for all targets'], active: false, scored: false, scope: null },
  { id: 's6', type: 'rule', subtype: 'rule-assembly-reveal', template: 'TheoryScreen', goal: 'Assemble the four-step rounding rule', misconceptions: ['inspect target digit', 'keep right digits'], active: false, scored: false, scope: null },
  { id: 's7', type: 'test', subtype: 'numeric-mini-check', template: 'NumInputScreen', goal: 'Round a multi-digit number to the nearest hundred', misconceptions: ['round up on four', 'keep tens'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's8', type: 'exploration', subtype: 'worked-precision-table', template: 'TheoryScreen', goal: 'Apply the rule at three precisions to a new number', misconceptions: ['wrong decision digit'], active: false, scored: false, scope: null },
  { id: 's9', type: 'exploration', subtype: 'worked-examples-checkpoint', template: 'WorkedExamplesScreen', goal: 'Explain four completed solutions including a million carry', misconceptions: ['place and carry errors'], active: false, scored: false, scope: null },
  { id: 's10', type: 'exploration', subtype: 'strategy-context-precision', template: 'TheoryScreen', goal: 'Choose exact or approximate precision by context', misconceptions: ['always use thousands'], active: false, scored: false, scope: null },
  { id: 's11', type: 'case', subtype: 'error-walkthrough', template: 'TheoryScreen', goal: 'Repair three typical rounding errors', misconceptions: ['inspect target digit', 'round every digit', 'keep right digits'], active: false, scored: false, scope: null },
  { id: 's12', type: 'test', subtype: 'final-transfer', template: 'MCScreen', goal: 'Round city dashboard data to the nearest thousand', misconceptions: ['round up on four', 'keep hundreds', 'wrong target'], active: true, scored: true, scope: 'final' },
  { id: 's13', type: 'exploration', subtype: 'accuracy-corridor', template: 'TheoryScreen', goal: 'Interpret a rounded value as an interval of possible exact values', misconceptions: ['one rounded value has one exact source', 'upper boundary extends too far'], active: false, scored: false, scope: null },
  { id: 's14', type: 'summary', subtype: 'theory-summary', template: 'TheoryScreen', goal: 'Summarize precision choice and bridge to integrated number work', misconceptions: ['partial algorithm'], active: false, scored: false, scope: null },
];

const TOTAL_SCREENS = 15;
const FREE_NAV = false;
const MOBILE_DESIGN_W = 390;
const NOTION_FLOW = SCREEN_META.map((meta, screen) => ({ screen, meta, contentKeys: [meta.id] }));

const LESSON_META = {
  lessonId: 'num-4-05-v1',
  lessonTitle: {
    ru: 'Урок 5. Округление многозначных чисел',
    uz: "5-dars. Ko'p xonali sonlarni yaxlitlash",
  },
  skillTags: ['multi_digit_rounding', 'round_to_tens', 'round_to_hundreds', 'round_to_thousands', 'exact_vs_approximate', 'rounding_carry', 'rounding_interval'],
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

function useCanAnswer(audio) {
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
    const timer = window.setTimeout(() => setDelayElapsed(true), 1200);
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

// The same canonical Bit used by the approved grade 4 base lesson.
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

const FeedbackBlock = ({ show, correct, children }) => {
  const lang = useLang();
  const revealRef = useRevealScroll(show);
  return (
    <div ref={revealRef} className={`feedback ${show ? 'feedback-visible' : ''}`} aria-hidden={!show} aria-live="polite">
      <div className={`feedback-card ${correct ? 'feedback-correct' : 'feedback-hint'}`}>
        <BitSVG state={correct ? 'nod' : 'awkward'} />
        <div>
          <strong>{correct ? (lang === 'uz' ? 'YECHIM' : 'РЕШЕНИЕ') : (lang === 'uz' ? "YANA O'YLANG" : 'ПРОВЕРЬ СТРАТЕГИЮ')}</strong>
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    hook: lang === 'uz' ? 'Missiya' : 'Миссия',
    diagnostic: lang === 'uz' ? 'Diagnostika' : 'Диагностика',
    exploration: lang === 'uz' ? 'Kashfiyot' : 'Исследование',
    rule: lang === 'uz' ? 'Qoida' : 'Правило',
    practice: lang === 'uz' ? 'Mashq' : 'Практика',
    test: lang === 'uz' ? 'Tekshiruv' : 'Проверка',
    case: lang === 'uz' ? 'Vazifa' : 'Задача',
    summary: lang === 'uz' ? 'Yakun' : 'Итог',
  };
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const MOBILE_AUTO_SCROLL_TARGETS = [
  '.feedback-visible',
  '.theory-callout',
  '.worked-example-card',
  '.bridge-card',
];

const Stage = ({ screen, eyebrow, audio, children, nav }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const contentRef = useRef(null);
  const pad = isMobile ? 14 : 48;
  const meta = SCREEN_META[screen];

  useEffect(() => {
    const scroller = contentRef.current;
    if (!isMobile || !scroller) return undefined;

    scroller.scrollTo({ top: 0, behavior: 'auto' });
    let frameId = 0;
    let settleTimer = 0;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const revealCurrentTarget = () => {
      const target = MOBILE_AUTO_SCROLL_TARGETS
        .map((selector) => scroller.querySelector(selector))
        .find(Boolean);
      if (!target) return;

      const viewport = scroller.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const safeTop = viewport.top + 10;
      const safeBottom = viewport.bottom - 14;
      let nextTop = scroller.scrollTop;

      if (targetRect.bottom > safeBottom) {
        nextTop += targetRect.bottom - safeBottom;
      } else if (targetRect.top < safeTop) {
        nextTop -= safeTop - targetRect.top;
      } else {
        return;
      }

      const maxTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      scroller.scrollTo({
        top: Math.max(0, Math.min(nextTop, maxTop)),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    };

    const scheduleReveal = () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
      frameId = requestAnimationFrame(revealCurrentTarget);
      settleTimer = window.setTimeout(revealCurrentTarget, 720);
    };

    const observer = new MutationObserver(scheduleReveal);
    observer.observe(scroller, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'aria-hidden'],
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
    };
  }, [isMobile, screen]);

  return (
    <main className={`stage stage-${meta.type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}>
          <div className="progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title"><span className="status-dot" /><span>{t(eyebrow)}</span></div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={meta.type} />
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section ref={contentRef} className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        {children}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{nav}</footer>
    </main>
  );
};

const ModelPanel = ({ model, solved, revealRows = null }) => {
  const t = useT();
  if (!model) return null;
  const plainDigits = String(model.number ?? '').replace(/\s/g, '').split('');
  const customNumberKinds = new Set(['targetMap', 'multiNumberLine', 'roundingFocus', 'precision', 'roundingError']);
  return (
    <div className={`model-panel model-${model.kind} ${solved ? 'model-solved' : ''}`}>
      <div className="model-heading">
        <span>{t(model.badge)}</span>
        {model.kind === 'city' && <i aria-hidden="true">● ● ●</i>}
      </div>
      {model.number && !customNumberKinds.has(model.kind) && <div className="model-number">{t(model.number)}</div>}
      {(model.kind === 'dashboard' || model.kind === 'contexts') && (
        <div className={`context-cards context-cards-${model.cards.length}`}>
          {model.cards.map((card, index) => (
            <div className={`context-card context-${card.tone ?? 'cyan'}`} style={{ '--model-delay': `${index * 120}ms` }} key={`${card.value}-${index}`}>
              <span>{t(card.label)}</span><strong>{card.value}</strong><em>{t(card.result)}</em>
            </div>
          ))}
        </div>
      )}
      {model.kind === 'targetMap' && (
        <div className="target-map">
          <div className="target-map-number">{model.number}</div>
          {model.rows.map((row, index) => (
            <div className="target-map-row" style={{ '--model-delay': `${index * 130}ms` }} key={t(row.label)}>
              <span>{t(row.label)}</span><strong>{row.lower}</strong><i aria-hidden="true">—</i><strong>{row.upper}</strong><em>{row.zeros} × 0</em>
            </div>
          ))}
        </div>
      )}
      {model.kind === 'multiNumberLine' && (
        <div className="multi-number-lines">
          <div className="multi-line-source">{model.number}</div>
          {model.lines.map((line, index) => (
            <div className="number-line-row" style={{ '--model-delay': `${index * 150}ms` }} key={t(line.label)}>
              <div className="number-line-meta"><span>{t(line.label)}</span><em>{line.inspect} → {line.result}</em></div>
              <div className="number-line-track">
                <span>{line.lower}</span><span>{line.upper}</span>
                <i className="number-line-marker" style={{ '--line-position': `${line.position}%` }}><b>{model.number}</b></i>
                <u className="number-line-midpoint" />
              </div>
            </div>
          ))}
        </div>
      )}
      {model.kind === 'decisionContrast' && (
        <div className="decision-contrast">
          <div className="decision-scale"><strong>{model.lower}</strong><span>{model.midpoint}</span><strong>{model.upper}</strong></div>
          <div className="decision-cases">
            {model.cases.map((item, index) => (
              <div className={`decision-case decision-${item.direction}`} style={{ '--model-delay': `${index * 140}ms` }} key={item.value}>
                <span>{item.value}</span><i>{item.inspect}</i><b aria-hidden="true">{item.direction === 'up' ? '↗' : '↘'}</b><strong>{item.result}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
      {model.kind === 'carry' && (
        <div className="carry-examples">
          {model.examples.map((example, index) => (
            <div className="carry-example" style={{ '--model-delay': `${index * 170}ms` }} key={example.from}>
              <span>{t(example.note)}</span>
              <div><strong>{example.from}</strong><i aria-hidden="true">→</i><strong>{example.to}</strong></div>
              <small>{example.target}<b> + 1</b> · {example.inspect}</small>
            </div>
          ))}
        </div>
      )}
      {model.kind === 'precision' && (
        <div className="precision-board">
          <div className="precision-source">{model.number}</div>
          {model.rows.map((row, index) => (
            <div className="precision-row" style={{ '--model-delay': `${index * 130}ms` }} key={t(row.label)}>
              <span>{t(row.label)}</span><i>{row.inspect}</i><b aria-hidden="true">→</b><strong>{row.value}</strong>
            </div>
          ))}
        </div>
      )}
      {model.kind === 'roundingFocus' && (
        <div className="rounding-focus">
          <div className="rounding-digits">
            {plainDigits.map((digit, index) => (
              <span className={index === model.targetIndex ? 'round-target' : index === model.inspectIndex ? 'round-inspect' : ''} key={`${digit}-${index}`}>{digit}</span>
            ))}
          </div>
          <div className={`rounding-result rounding-${model.direction}`}><i aria-hidden="true">{model.direction === 'up' ? '↗' : '↘'}</i><strong>{model.result}</strong></div>
        </div>
      )}
      {model.kind === 'roundingError' && (
        <div className="rounding-error-board">
          <div className="rounding-error-source"><span>{model.number}</span><em>{t(model.target)}</em></div>
          <div className="rounding-error-drafts">
            {model.drafts.map((draft, index) => (
              <div style={{ '--model-delay': `${index * 120}ms` }} key={draft.value}><span>{t(draft.label)}</span><strong>{draft.value}</strong></div>
            ))}
          </div>
          <div className="rounding-error-repair"><span aria-hidden="true">✓</span><strong>{model.result}</strong></div>
        </div>
      )}
      {model.groups && (
        <div className="class-groups">
          {model.groups.map((group, index) => (
            <div className={`class-group group-${group.tone ?? (index ? 'accent' : 'cyan')}`} key={`${group.value}-${index}`}>
              <strong>{group.value}</strong><span>{t(group.label)}</span>
            </div>
          ))}
        </div>
      )}
      {model.columns && (
        <div className="place-table" style={{ gridTemplateColumns: `repeat(${model.columns.length}, minmax(0, 1fr))` }}>
          {model.columns.map((column, index) => (
            <div className="place-cell" key={`${column.value}-${index}`}>
              <span>{t(column.label)}</span><strong>{column.value}</strong>
            </div>
          ))}
        </div>
      )}
      {model.rows && !['targetMap', 'precision'].includes(model.kind) && (
        <div className="model-rows">
          {model.rows.map((row, index) => (
            <div
              className={revealRows === null ? '' : `audio-reveal ${revealRows >= index + 1 ? 'is-visible' : ''}`}
              aria-hidden={revealRows === null ? undefined : revealRows < index + 1}
              key={`${row.value}-${index}`}
            >
              <span>{t(row.label)}</span><strong>{row.value}</strong>
            </div>
          ))}
        </div>
      )}
      {model.steps && (
        <ol className="model-steps">
          {model.steps.map((step, index) => <li key={`${t(step)}-${index}`}>{t(step)}</li>)}
        </ol>
      )}
    </div>
  );
};

const NavBack = ({ onClick, hidden = false }) => {
  const lang = useLang();
  return hidden ? <span /> : (
    <button type="button" className="btn btn-ghost" onClick={onClick}>
      <span aria-hidden="true">←</span> {lang === 'uz' ? 'Orqaga' : 'Назад'}
    </button>
  );
};

const NavNext = ({ onClick, disabled, finish = false, label }) => {
  const lang = useLang();
  return (
    <button type="button" className={`btn btn-white-accent ${!disabled ? 'btn-ready' : ''}`} disabled={FREE_NAV ? false : disabled} onClick={onClick}>
      {label ?? (finish ? (lang === 'uz' ? 'Darsni yakunlash' : 'Завершить урок') : (lang === 'uz' ? 'Davom etish' : 'Дальше'))}
      <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

const ChoiceScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const resetOnReturn = screen === 0 || SCREEN_META[screen].type === 'exploration';
  const restorableAnswer = resetOnReturn ? null : storedAnswer;
  const restored = restorableAnswer?.solved === true;
  const [picked, setPicked] = useState(restorableAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(restorableAnswer?.attempts ?? 0);
  const [wrongIndices, setWrongIndices] = useState(() => new Set(restorableAnswer?.wrongIndices ?? []));
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const isFinal = screen === TOTAL_SCREENS - 1;
  const optionOrder = buildOptionOrder(c.options.length, c.correctIndex, screen);

  const choose = (index) => {
    if (!canAnswer || solved || wrongIndices.has(index)) return;
    const nextAttempts = attempts + 1;
    const correct = index === c.correctIndex;
    setPicked(index);
    setAttempts(nextAttempts);
    if (!correct) {
      const nextWrong = new Set(wrongIndices);
      nextWrong.add(index);
      setWrongIndices(nextWrong);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio?.on_wrong?.[index] ?? c.wrong?.[index]));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.instruction),
        options: c.options.map((option) => t(option)),
        correctIndex: c.correctIndex,
        correctAnswer: t(c.options[c.correctIndex]),
        studentAnswerIndex: index,
        studentAnswer: t(c.options[index]),
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        wrongIndices: [...nextWrong],
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
      });
      return;
    }
    setSolved(true);
    playSfx('correct');
    audio.pushOneOff(t(c.audio?.on_correct ?? c.correctText));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.instruction),
      options: c.options.map((option) => t(option)),
      correctIndex: c.correctIndex,
      correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: index,
      studentAnswer: t(c.options[index]),
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      wrongIndices: [...wrongIndices],
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
    });
  };

  const proceed = () => {
    if (isFinal) finishLesson();
    else onNext();
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={proceed} disabled={!canAdvance} finish={isFinal} /></>}
    >
      <div className="screen-stack">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DATA CENTER</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach"><BitSVG state={solved ? 'happy' : 'present'} /></div>
        </div>
        <ModelPanel model={c.model} solved={solved} />
        <section className="question-card" aria-labelledby={`question-${screen}`}>
          <div className="question-topline">
            <span>{lang === 'uz' ? 'SIZNING QARORINGIZ' : 'ТВОЁ РЕШЕНИЕ'}</span>
            {!canAnswer && <small>{lang === 'uz' ? 'Avval tushuntirishni tinglang' : 'Сначала дослушай объяснение'}</small>}
          </div>
          <h2 id={`question-${screen}`}>{t(c.instruction)}</h2>
          <div className="options-grid">
            {optionOrder.map((sourceIndex, displayIndex) => {
              const option = c.options[sourceIndex];
              const isWrong = wrongIndices.has(sourceIndex);
              const isCorrect = solved && sourceIndex === c.correctIndex;
              return (
                <button
                  type="button"
                  className={`option ${isWrong ? 'option-picked-wrong' : ''} ${isCorrect ? 'option-correct' : ''} ${solved && !isCorrect ? 'option-dismissed' : ''}`}
                  key={`${t(option)}-${sourceIndex}`}
                  disabled={!canAnswer || solved || isWrong}
                  onClick={() => choose(sourceIndex)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + displayIndex)}</span>
                  <span>{t(option)}</span>
                </button>
              );
            })}
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>
            {t(solved ? c.correctText : c.wrong?.[picked])}
          </FeedbackBlock>
          {solved && c.fact && <div className="fact-card"><strong>{lang === 'uz' ? 'FAKT' : 'ФАКТ'}</strong><p>{t(c.fact)}</p></div>}
          {solved && c.bridge && <div className="bridge-card"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>}
        </section>
      </div>
    </Stage>
  );
};

const normalizeNumberEntry = (value) => String(value ?? '').replace(/\s/g, '');

const NumberInputScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const restored = storedAnswer?.solved === true;
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '');
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [feedback, setFeedback] = useState(restored ? c.correctText : (storedAnswer?.feedback ?? null));
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const target = c.options[c.correctIndex];

  const submit = () => {
    if (!canAnswer || solved || !normalizeNumberEntry(value)) return;
    const nextAttempts = attempts + 1;
    const entered = normalizeNumberEntry(value);
    const correct = entered === normalizeNumberEntry(target);
    setAttempts(nextAttempts);

    if (!correct) {
      const matchedIndex = c.options.findIndex((option, index) => index !== c.correctIndex && normalizeNumberEntry(option) === entered);
      const wrongText = matchedIndex >= 0 ? c.wrong[matchedIndex] : c.inputWrongDefault;
      setFeedback(wrongText);
      playSfx('wrong');
      audio.pushOneOff(t(matchedIndex >= 0 ? c.audio?.on_wrong?.[matchedIndex] : c.inputWrongAudio));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.instruction),
        options: null,
        correctIndex: null,
        correctAnswer: target,
        studentAnswerIndex: null,
        studentAnswer: entered,
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        feedback: wrongText,
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
      });
      return;
    }

    setValue(target);
    setSolved(true);
    setFeedback(c.correctText);
    playSfx('correct');
    audio.pushOneOff(t(c.audio?.on_correct ?? c.correctText));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.instruction),
      options: null,
      correctIndex: null,
      correctAnswer: target,
      studentAnswerIndex: null,
      studentAnswer: target,
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
    });
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DATA CENTER</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach"><BitSVG state={solved ? 'happy' : 'present'} /></div>
        </div>
        <ModelPanel model={c.model} solved={solved} />
        <section className="question-card" aria-labelledby={`question-${screen}`}>
          <div className="question-topline">
            <span>{lang === 'uz' ? 'SONNI KIRITING' : 'ВВЕДИ ЧИСЛО'}</span>
            {!canAnswer && <small>{lang === 'uz' ? 'Avval tushuntirishni tinglang' : 'Сначала дослушай объяснение'}</small>}
          </div>
          <h2 id={`question-${screen}`}>{t(c.instruction)}</h2>
          <div className="number-entry-row">
            <input
              className={`answer-input ${solved ? 'answer-input-correct' : ''}`}
              value={value}
              onChange={(event) => {
                setValue(event.target.value.replace(/[^0-9\s]/g, ''));
                if (!solved) setFeedback(null);
              }}
              onKeyDown={(event) => { if (event.key === 'Enter') submit(); }}
              inputMode="numeric"
              autoComplete="off"
              aria-label={lang === 'uz' ? 'Son javobi' : 'Числовой ответ'}
              placeholder="0"
              maxLength={10}
              disabled={!canAnswer || solved}
            />
            <button type="button" className="btn btn-white-accent btn-ready btn-check" onClick={submit} disabled={!canAnswer || solved || !normalizeNumberEntry(value)}>
              {lang === 'uz' ? 'Tekshirish' : 'Проверить'}
            </button>
          </div>
          <FeedbackBlock show={feedback !== null} correct={solved}>{t(feedback)}</FeedbackBlock>
          {solved && c.fact && <div className="fact-card"><strong>{lang === 'uz' ? 'FAKT' : 'ФАКТ'}</strong><p>{t(c.fact)}</p></div>}
          {solved && c.bridge && <div className="bridge-card"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>}
        </section>
      </div>
    </Stage>
  );
};

const useTheoryAdvanceGate = (audio) => (
  FREE_NAV || audio.muted || audio.completed
);

const theoryMoodFor = (subtype) => {
  if (subtype.includes('error')) return 'awkward';
  if (subtype.includes('rule')) return 'idea';
  if (subtype.includes('strategy')) return 'focus';
  if (subtype.includes('summary')) return 'nod';
  if (subtype.includes('table') || subtype.includes('class')) return 'point';
  if (subtype.includes('foundation')) return 'think';
  return 'present';
};

const TheoryExplanation = ({ c, label, canAdvance, variant = 'default', revealed = null }) => {
  const lang = useLang();
  const t = useT();
  return (
    <section
      className={`theory-callout theory-callout-${variant}${revealed === null ? '' : ` audio-reveal ${revealed ? 'is-visible' : ''}`}`}
      aria-hidden={revealed === null ? undefined : !revealed}
    >
      <div className="question-topline">
        <span>{label}</span>
        {!canAdvance && <small>{lang === 'uz' ? 'Tushuntirish davom etmoqda' : 'Объяснение продолжается'}</small>}
      </div>
      <h2>{t(c.instruction)}</h2>
      <div className="theory-answer">
        <span className="theory-answer-mark" aria-hidden="true">→</span>
        <p>{t(c.correctText)}</p>
      </div>
      {c.fact && <div className="fact-card"><strong>{lang === 'uz' ? 'FAKT' : 'ФАКТ'}</strong><p>{t(c.fact)}</p></div>}
      {c.bridge && <div className="bridge-card"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>}
    </section>
  );
};

const TheoryBody = ({ screen, c, meta, label, canAdvance, audioReveal = null }) => {
  const lang = useLang();
  const t = useT();

  if (meta.type === 'hook') {
    return (
      <div className="hook-theory-layout">
        <div className="hook-mission-scene">
          <div className="hook-signal" aria-hidden="true"><i /><i /><i /><i /></div>
          <ModelPanel model={c.model} solved />
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="mission" />
      </div>
    );
  }

  if (meta.subtype.includes('foundation')) {
    return (
      <div className="foundation-theory-layout">
        <div className="foundation-model-wrap">
          <ModelPanel model={c.model} solved />
          <div className="foundation-scale-legend">
            <span>{lang === 'uz' ? 'xona' : 'разряд'}</span><i aria-hidden="true">→</i>
            <span>{lang === 'uz' ? "qo'shnilar" : 'соседи'}</span><i aria-hidden="true">→</i>
            <span>{lang === 'uz' ? 'nollar' : 'нули'}</span>
          </div>
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="foundation" />
      </div>
    );
  }

  if (meta.type === 'rule') {
    return (
      <div className="rule-theory-layout">
        <ModelPanel model={c.model} solved />
        <div className="rule-assembly-line" aria-hidden="true">
          {(c.model?.steps ?? []).map((step, index) => <i style={{ '--theory-delay': `${index * 150}ms` }} key={`${t(step)}-${index}`}>{index + 1}</i>)}
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="rule" />
      </div>
    );
  }

  if (meta.subtype.includes('strategy')) {
    return (
      <div className="strategy-theory-layout">
        <ModelPanel model={c.model} solved />
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="strategy" />
      </div>
    );
  }

  if (meta.subtype.includes('error')) {
    if (c.model?.kind === 'roundingError') {
      return (
        <div className="error-theory-layout error-rounding-layout">
          <ModelPanel model={c.model} solved />
          <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="error" />
        </div>
      );
    }
    const rows = c.model?.rows ?? [];
    return (
      <div className="error-theory-layout">
        <div className="error-walkthrough-board">
          {rows.map((row, index) => (
            <div className={`error-walkthrough-row ${index ? 'error-row-draft' : 'error-row-source'}`} style={{ '--theory-delay': `${index * 170}ms` }} key={`${row.value}-${index}`}>
              <span>{t(row.label)}</span><strong>{row.value}</strong>
            </div>
          ))}
          <div className="error-repair-arrow" aria-hidden="true">↓</div>
          <div className="error-repair-result"><span>{lang === 'uz' ? "to'g'ri yozuv" : 'верная запись'}</span><strong>{t(c.options[c.correctIndex]).match(/[0-9 ]+/)?.[0]?.trim() || '72 045'}</strong></div>
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="error" />
      </div>
    );
  }

  if (meta.type === 'summary') {
    return (
      <div className="summary-theory-layout">
        <div className="summary-signal"><BitSVG state="happy" /><strong>{t(c.model?.number)}</strong></div>
        <div className="summary-theory-cards">
          <div><span>01</span><p>{lang === 'uz' ? 'Vaziyatga mos aniqlik va maqsad xonasini tanlang.' : 'Выбери точность по ситуации и отметь целевой разряд.'}</p></div>
          <div><span>02</span><p>{lang === 'uz' ? "Darhol o'ngdagi raqam bo'yicha pastga yoki yuqoriga qaror qiling." : 'По соседней цифре справа реши, округлять вниз или вверх.'}</p></div>
          <div><span>03</span><p>{lang === 'uz' ? "Tanlangan xonadan o'ngdagi barcha raqamlarni nolga almashtiring." : 'Замени все цифры справа от выбранного разряда нулями.'}</p></div>
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="summary" />
      </div>
    );
  }

  if (meta.subtype === 'accuracy-corridor') {
    const visible = audioReveal?.visible ?? 5;
    return (
      <div className={`animated-theory-layout animated-theory-${screen}`}>
        <ModelPanel model={c.model} solved revealRows={visible} />
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="animated" revealed={visible >= 5} />
      </div>
    );
  }

  return (
    <div className={`animated-theory-layout animated-theory-${screen}`}>
      <ModelPanel model={c.model} solved />
      <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="animated" />
    </div>
  );
};

function useFinaleReveal(count = 4, interval = 500) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const frame = requestAnimationFrame(() => setVisible(count));
      return () => cancelAnimationFrame(frame);
    }
    const resetFrame = requestAnimationFrame(() => setVisible(0));
    const timers = Array.from({ length: count }, (_, index) => (
      window.setTimeout(() => setVisible(index + 1), 300 + index * interval)
    ));
    return () => {
      cancelAnimationFrame(resetFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [count, interval]);
  return visible;
}

const FinaleScreen = ({ screen, answers = [], onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s14;
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, 's14-finale-intro'),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText, lang, 's14-finale-result'),
  ], [c.audio, c.correctText, lang]);
  const audio = useAudio(segments);
  const visible = useFinaleReveal(4, 500);
  const scoredIndexes = useMemo(
    () => SCREEN_META.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null),
    [],
  );
  const answered = scoredIndexes.filter((index) => answers[index] !== undefined).length;
  const firstTry = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const complete = visible >= 4;
  const totalScored = scoredIndexes.length;
  const solvedCount = scoredIndexes.filter((index) => answers[index]?.correct === true).length;
  const rewardReady = complete && solvedCount === totalScored;
  const rewardTitle = firstTry === totalScored
    ? { ru: 'Мастер округления', uz: 'Yaxlitlash ustasi' }
    : firstTry >= Math.max(1, totalScored - 1)
      ? { ru: 'Знаток точности', uz: 'Aniqlik bilimdoni' }
      : { ru: 'Исследователь оценок', uz: 'Taxmin tadqiqotchisi' };
  const takeaways = lang === 'uz'
    ? [
      'Vaziyatga mos aniqlik va maqsad xonasini tanlang.',
      "Darhol o'ngdagi raqam bo'yicha pastga yoki yuqoriga qaror qiling.",
      "Tanlangan xonadan o'ngdagi barcha raqamlarni nolga almashtiring.",
    ]
    : [
      'Выбери точность по ситуации и отметь целевой разряд.',
      'По соседней цифре справа реши, округлять вниз или вверх.',
      'Замени все цифры справа от выбранного разряда нулями.',
    ];

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={finishLesson} disabled={false} finish /></>}>
      <div className="screen-stack finale-screen">
        <header className="finale-heading">
          <span>{lang === 'uz' ? 'YAKUNIY BOSQICH' : 'ФИНАЛЬНЫЙ ЭТАП'}</span>
          <h1>{t(c.title)}</h1>
          <p>{lang === 'uz'
            ? "Dars boshida aralashib ketgan tablo tuzatildi: stansiya kodi aniq, umumiy ko'rsatkich esa kerakli aniqlikda ko'rsatiladi."
            : 'Табло, перепутавшее данные в начале урока, исправлено: код станции показан точно, а обзорный показатель — с нужной точностью.'}</p>
        </header>
        <div className="finale-layout">
          <div className="finale-main">
            <div className="finale-mastery">
              {takeaways.map((item, index) => (
                <article className={`finale-takeaway ${visible >= index + 1 ? 'is-visible' : ''}`} key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></article>
              ))}
            </div>
            <div className={`finale-proof ${visible >= 3 ? 'is-visible' : ''}`}>
              <span>{lang === 'uz' ? "BOSHLANG'ICH MISSIYA YECHIMI" : 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ'}</span><strong>{t(c.model.number)}</strong><p>{t(c.correctText)}</p>
            </div>
            <div className={`finale-bridge ${complete ? 'is-visible' : ''}`}><span aria-hidden="true">→</span><div><strong>{lang === 'uz' ? 'KEYINGI MISSIYA' : 'СЛЕДУЮЩАЯ МИССИЯ'}</strong><p>{t(c.bridge)}</p></div></div>
          </div>
          <aside className={`finale-reward ${rewardReady ? 'is-complete' : ''}`} role="status" aria-live="polite" aria-atomic="true">
            {rewardReady && <div className="finale-confetti" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>}
            <div className="finale-medal" aria-hidden="true">{rewardReady ? '★' : '🔒'}</div>
            <div className="finale-reward-copy">
              <span>{rewardReady ? (lang === 'uz' ? 'UNVON OLINDI' : 'ЗВАНИЕ ПОЛУЧЕНО') : (lang === 'uz' ? 'MUKOFOT KUTILMOQDA' : 'НАГРАДА ЖДЁТ')}</span>
              <h2>{rewardReady ? t(rewardTitle) : (lang === 'uz' ? 'Unvonni oching' : 'Открой звание')}</h2>
              {!complete ? (
                <div className="finale-status finale-status-neutral"><strong>…</strong><p>{lang === 'uz' ? 'Bilimlar jamlanmoqda' : 'Знания собираются вместе'}</p></div>
              ) : rewardReady ? (
                <div className="finale-status"><strong>{firstTry}/{scoredIndexes.length}</strong><p>{lang === 'uz' ? 'birinchi urinishda' : 'с первой попытки'}</p><small>{answered}/{scoredIndexes.length} {lang === 'uz' ? 'mashq bajarildi' : 'заданий выполнено'}</small></div>
              ) : (
                <div className="finale-status finale-status-neutral"><strong>{solvedCount}/{totalScored}</strong><p>{lang === 'uz' ? 'yechildi' : 'решено'}</p><small>{answered}/{totalScored} {lang === 'uz' ? 'mashq bajarildi' : 'заданий выполнено'}</small></div>
              )}
            </div>
            <div className="finale-reward-bit"><BitSVG state={rewardReady ? 'happy' : 'present'} /></div>
          </aside>
        </div>
      </div>
    </Stage>
  );
};

const TheoryScreen = ({ screen, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const meta = SCREEN_META[screen];
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-intro`),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText, lang, `s${screen}-explanation`),
  ], [c.audio, c.correctText, lang, screen]);
  const audio = useAudio(segments);
  const revealCount = meta.subtype === 'accuracy-corridor' ? 5 : 0;
  const audioReveal = useAudioSegmentReveal(audio, segments, revealCount);
  const stageAudio = revealCount
    ? { ...audio, replay: audioReveal.replay, toggleMute: audioReveal.toggleMute }
    : audio;
  const canAdvance = useTheoryAdvanceGate(audio);
  const isFinal = screen === TOTAL_SCREENS - 1;
  const proceed = () => {
    if (isFinal) finishLesson();
    else onNext();
  };
  const label = meta.type === 'rule'
    ? (lang === 'uz' ? 'QOIDA' : 'ПРАВИЛО')
    : meta.subtype.includes('error')
      ? (lang === 'uz' ? 'XATONI TUZATISH' : 'РАЗБОР ОШИБКИ')
      : meta.subtype.includes('strategy')
        ? (lang === 'uz' ? 'ISHONCHLI USUL' : 'НАДЁЖНЫЙ СПОСОБ')
        : meta.type === 'summary'
          ? (lang === 'uz' ? 'ESLAB QOLING' : 'ЗАПОМНИ')
          : (lang === 'uz' ? 'BIT TUSHUNTIRADI' : 'БИТ ОБЪЯСНЯЕТ');

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={stageAudio}
      nav={(
        <>
          <NavBack onClick={onPrev} hidden={screen === 0} />
          <NavNext onClick={proceed} disabled={!canAdvance} finish={isFinal} />
        </>
      )}
    >
      <div className={`screen-stack theory-screen theory-${meta.subtype}`}>
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DATA CENTER</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory">
            <BitSVG state={theoryMoodFor(meta.subtype)} />
          </div>
        </div>
        <TheoryBody
          screen={screen}
          c={c}
          meta={meta}
          label={label}
          canAdvance={canAdvance}
          audioReveal={revealCount ? audioReveal : null}
        />
      </div>
    </Stage>
  );
};

const WorkedExamplesScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro, lang, `s${screen}-intro`),
    ...c.items.flatMap((item, index) => [
      ...localizedSegments(item.audio?.intro, lang, `s${screen}-example-${index}-task`),
      ...localizedSegments(item.audio?.on_correct ?? item.correctText, lang, `s${screen}-example-${index}-answer`),
    ]),
  ], [c.audio, c.items, lang, screen]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio);

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack worked-examples-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · EXAMPLE LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory"><BitSVG state="focus" /></div>
        </div>
        <div className="worked-examples-grid">
          {c.items.map((item, index) => (
            <article className="worked-example-card" style={{ '--example-delay': `${index * 110}ms` }} key={t(item.question)}>
              <span className="worked-example-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{t(item.question)}</h2>
                <strong>{t(item.options[item.correctIndex])}</strong>
                <p>{t(item.correctText)}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="worked-examples-finish">
          <BitSVG state="nod" />
          <p>{t(c.completionText)}</p>
        </div>
      </div>
    </Stage>
  );
};
const SCREENS = [
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  TheoryScreen,
  NumberInputScreen,
  TheoryScreen,
  WorkedExamplesScreen,
  TheoryScreen,
  TheoryScreen,
  ChoiceScreen,
  TheoryScreen,
  FinaleScreen,
];

export default function Grade4Dars05({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished }) {
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
    const miniAnswer = answers[7];
    const finalAnswer = answers[12];
    const miniScore = miniAnswer?.firstTry ? 1 : 0;
    const finalScore = finalAnswer?.firstTry ? 1 : 0;
    const finalTotal = 1;
    const totalQuestions = 2;
    const correctAnswers = miniScore + finalScore;
    const scoredAnswers = [miniAnswer, finalAnswer].filter(Boolean);
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang] ?? LESSON_META.lessonTitle.ru,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      finalScore,
      finalTotal,
      passed: totalQuestions ? correctAnswers / totalQuestions >= 0.6 : false,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredAnswers.reduce((sum, answer) => sum + (answer.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars05 preview]', payload);
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
          screen={current}
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
    radial-gradient(circle at 10% 14%, rgba(22,143,163,.12), transparent 30%),
    radial-gradient(circle at 90% 84%, rgba(255,91,53,.10), transparent 32%),
    linear-gradient(145deg, #F7F8F4 0%, #EEF3F1 100%);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g4z, 1);
}
.lesson-root h1, .lesson-root h2, .lesson-root h3,
.lesson-root p, .lesson-root ol { margin: 0; padding: 0; }
.lesson-root button { font: inherit; }
.preview-language {
  position: fixed;
  top: 9px;
  right: 9px;
  z-index: 30;
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},.6);
}
.preview-language button {
  padding: 4px 9px;
  border: 0;
  border-radius: 999px;
  color: ${T.ink2};
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  font-weight: 900;
}
.preview-language .preview-active { color: #FFFFFF; background: ${T.accent}; }
.stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: rgba(245,245,240,.86);
  box-shadow: 0 0 50px -24px rgba(${T.shadowBase},.28);
}
.stage-header {
  flex: 0 0 auto;
  padding-top: 17px;
  padding-bottom: 12px;
  background: rgba(245,245,240,.94);
  backdrop-filter: blur(14px);
  z-index: 3;
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(135,148,157,.22);
}
.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.55), 0 0 3px rgba(255,91,53,.42);
  transition: width .45s cubic-bezier(.4,0,.2,1);
}
.stage-chrome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.chrome-title, .chrome-actions, .audio-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}
.chrome-title {
  min-width: 0;
  color: ${T.ink2};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.chrome-title > span:last-child { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.status-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.65);
}
.chrome-actions { flex: 0 0 auto; }
.screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-size: 10px;
  font-weight: 800;
}
.screen-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
}
.icon-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: ${T.ink2};
  background: rgba(255,255,255,.75);
  cursor: pointer;
  box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},.3);
}
.stage-content {
  flex: 1 1 auto;
  min-height: 0;
  padding-top: 16px;
  padding-bottom: 28px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(135,148,157,.35) transparent;
}
.stage-nav {
  flex: 0 0 auto;
  min-height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  background: rgba(245,245,240,.97);
  box-shadow: 0 -12px 28px -25px rgba(${T.shadowBase},.45);
  z-index: 3;
}
.btn {
  min-height: 48px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease, opacity .2s ease;
}
.btn-ghost { color: ${T.ink}; background: transparent; }
.btn-ghost:hover { background: ${T.paper}; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},.28); }
.btn-white-accent {
  margin-left: auto;
  color: ${T.accent};
  background: ${T.paper};
  box-shadow: 0 8px 22px -6px rgba(255,91,53,.30), 0 0 0 1px rgba(255,91,53,.12);
}
.btn-white-accent.btn-ready:hover { color: ${T.paper}; background: ${T.accent}; transform: translateY(-1px); box-shadow: 0 12px 28px -6px rgba(255,91,53,.50); }
.btn:disabled { opacity: .42; cursor: not-allowed; transform: none; box-shadow: none; }
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
.audio-reveal {
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px) scale(.985);
  filter: blur(3px);
  transition: opacity .5s ease, transform .6s cubic-bezier(.16,1,.3,1), filter .45s ease, visibility 0s linear .5s;
}
.audio-reveal.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
  filter: blur(0);
  transition-delay: 0s;
}
.screen-heading { display: grid; grid-template-columns: minmax(0,1fr) 118px; align-items: center; gap: 20px; }
.heading-copy { min-width: 0; }
.lesson-kicker {
  display: inline-block;
  margin-bottom: 8px;
  color: ${T.cyan};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .15em;
}
.heading-copy h1 {
  max-width: 760px;
  font-family: 'Source Serif 4', serif;
  font-size: clamp(29px, 4.6vw, 47px);
  line-height: 1.04;
  letter-spacing: -.025em;
  font-weight: 650;
}
.heading-copy p { max-width: 720px; margin-top: 10px; color: ${T.ink2}; font-size: 15px; line-height: 1.52; }
.bit-coach { width: 118px; height: 118px; display: flex; align-items: center; justify-content: center; border-radius: 28px; background: rgba(255,255,255,.66); box-shadow: 0 12px 26px -16px rgba(${T.shadowBase},.28); }
.bit-coach .g1-char { width: 92px; height: 115px; overflow: visible; }
.g1-char {
  display: block;
  height: 100%;
  width: auto;
  filter: drop-shadow(0 6px 12px rgba(58,53,48,.22));
}
.g1-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: g4blink 4.4s infinite;
}
@keyframes g4blink {
  0%, 93%, 100% { transform: scaleY(1); }
  96.5% { transform: scaleY(.12); }
}
.g1-bit-ant {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: g4antbob 2.2s ease-in-out infinite;
}
@keyframes g4antbob {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}
.g1-bit-wave {
  transform-box: fill-box;
  transform-origin: bottom left;
  animation: g4wavebig 1s ease-in-out infinite;
}
@keyframes g4wavebig {
  0%, 100% { transform: rotate(2deg); }
  50% { transform: rotate(-26deg); }
}
.bit-wave-left,
.bit-wave-right,
.bit-think-hand,
.bit-point-arm,
.bit-idea-bulb,
.bit-focus-hands,
.bit-focus-scan,
.bit-nod-hand,
.bit-nod-check {
  transform-box: fill-box;
  transform-origin: center;
}
.bit-double-wave .bit-wave-left { transform-origin: bottom right; animation: bit-wave-left 1.05s ease-in-out infinite; }
.bit-double-wave .bit-wave-right { transform-origin: bottom left; animation: bit-wave-right 1.05s ease-in-out infinite; }
.bit-think-hand { animation: bit-think-tap 1.8s ease-in-out infinite; }
.bit-point-arm { transform-origin: left center; animation: bit-point 1.45s ease-in-out infinite; }
.bit-point-target { transform-box: fill-box; transform-origin: center; animation: bit-target 1.45s ease-in-out infinite; }
.bit-idea-bulb { animation: bit-idea 1.55s ease-in-out infinite; }
.bit-focus-hands { transform-origin: center bottom; animation: bit-focus 1.7s ease-in-out infinite; }
.bit-focus-scan { animation: bit-scan 1.7s ease-in-out infinite; }
.bit-nod-hand { animation: bit-nod-hand 1.35s ease-in-out infinite; }
.bit-nod-check { animation: bit-check 1.35s ease-in-out infinite; }
@keyframes bit-wave-left { 0%,100% { transform: rotate(2deg); } 50% { transform: rotate(25deg); } }
@keyframes bit-wave-right { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(-25deg); } }
@keyframes bit-think-tap { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(-2px,-3px) rotate(-7deg); } }
@keyframes bit-point { 0%,100% { transform: translateX(0) rotate(0); } 48% { transform: translateX(4px) rotate(-5deg); } }
@keyframes bit-target { 0%,100% { opacity: .38; transform: scale(.72); } 50% { opacity: 1; transform: scale(1.1); } }
@keyframes bit-idea { 0%,100% { opacity: .72; transform: translateY(1px) scale(.9); } 50% { opacity: 1; transform: translateY(-3px) scale(1.08); } }
@keyframes bit-focus { 0%,100% { transform: scale(.96); } 50% { transform: scale(1.05); } }
@keyframes bit-scan { 0%,100% { opacity: .42; transform: translateY(-3px); } 50% { opacity: 1; transform: translateY(6px); } }
@keyframes bit-nod-hand { 0%,100% { transform: rotate(0); } 48% { transform: rotate(-11deg); } }
@keyframes bit-check { 0%,100% { transform: scale(.86); opacity: .72; } 50% { transform: scale(1.08); opacity: 1; } }
.model-panel {
  position: relative;
  padding: 19px;
  overflow: hidden;
  border-radius: 20px;
  background: ${T.navy};
  color: ${T.paper};
  box-shadow: 0 15px 34px -18px rgba(23,59,82,.58);
}
.model-panel::after { content: ''; position: absolute; width: 190px; height: 190px; right: -80px; top: -95px; border-radius: 50%; background: rgba(149,201,61,.12); pointer-events: none; }
.model-heading { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 13px; color: rgba(255,255,255,.74); font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
.model-heading i { color: ${T.lime}; font-style: normal; letter-spacing: .18em; }
.model-number { position: relative; z-index: 1; font-family: 'JetBrains Mono', monospace; font-size: clamp(31px, 6vw, 52px); font-weight: 800; letter-spacing: .08em; text-align: center; white-space: pre-wrap; }
.class-groups { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
.class-group { min-height: 92px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; border-radius: 15px; background: rgba(255,255,255,.10); }
.class-group strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(28px,5vw,42px); letter-spacing: .08em; }
.class-group span { color: rgba(255,255,255,.74); font-size: 12px; font-weight: 700; }
.group-cyan { box-shadow: inset 0 0 0 2px rgba(22,143,163,.65); }
.group-accent { box-shadow: inset 0 0 0 2px rgba(255,91,53,.68); }
.place-table { position: relative; z-index: 1; display: grid; gap: 7px; }
.place-cell { min-width: 0; min-height: 82px; padding: 8px 4px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 7px; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; }
.place-cell span { min-height: 28px; display: flex; align-items: center; color: rgba(255,255,255,.70); font-size: 9px; line-height: 1.15; }
.place-cell strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(21px,3.7vw,31px); }
.model-rows { position: relative; z-index: 1; display: grid; gap: 9px; }
.model-rows > div { min-height: 58px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between; gap: 14px; border-radius: 13px; background: rgba(255,255,255,.10); }
.model-rows span { color: rgba(255,255,255,.72); font-size: 12px; font-weight: 750; }
.model-rows strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px,4vw,29px); }
.model-accuracyCorridor .model-rows { padding-left: 15px; }
.model-accuracyCorridor .model-rows::before { content: ''; position: absolute; left: 3px; top: 13px; bottom: 13px; width: 4px; border-radius: 4px; background: linear-gradient(${T.lime} 0 74%, ${T.accent} 74% 100%); }
.model-accuracyCorridor .model-rows > div:nth-child(2) { color: ${T.navy}; background: ${T.lime}; box-shadow: 0 10px 24px -16px rgba(149,201,61,.72); }
.model-accuracyCorridor .model-rows > div:nth-child(2) span { color: rgba(23,59,82,.72); }
.model-accuracyCorridor .model-rows > div:last-child { color: #FFD9CF; background: rgba(255,91,53,.17); box-shadow: inset 3px 0 0 ${T.accent}; }
.model-steps { position: relative; z-index: 1; list-style: none; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; counter-reset: none; }
.model-steps li { min-height: 64px; padding: 11px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; font-size: 12px; line-height: 1.35; font-weight: 720; }
.model-solved { box-shadow: 0 15px 34px -18px rgba(34,122,83,.58), inset 0 0 0 2px rgba(149,201,61,.26); }
.context-cards { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.context-cards-3 { grid-template-columns: repeat(3,minmax(0,1fr)); }
.context-card { min-width: 0; min-height: 112px; padding: 13px; display: flex; flex-direction: column; justify-content: center; gap: 8px; border-radius: 15px; background: rgba(255,255,255,.10); animation: digit-group-in .48s ease var(--model-delay) both; }
.context-card span { color: rgba(255,255,255,.68); font-size: 10px; font-weight: 780; text-transform: uppercase; letter-spacing: .08em; }
.context-card strong { font: 800 clamp(20px,3.4vw,30px)/1.1 'JetBrains Mono', monospace; }
.context-card em { width: fit-content; padding: 5px 8px; border-radius: 8px; color: ${T.navy}; background: ${T.lime}; font-size: 10px; font-style: normal; font-weight: 850; }
.context-accent { box-shadow: inset 0 0 0 2px rgba(255,91,53,.46); }
.context-cyan { box-shadow: inset 0 0 0 2px rgba(22,143,163,.55); }
.context-lime { box-shadow: inset 0 0 0 2px rgba(149,201,61,.54); }
.target-map { position: relative; z-index: 1; display: grid; gap: 8px; }
.target-map-number, .multi-line-source, .precision-source { color: ${T.paper}; font: 800 clamp(27px,4.8vw,43px)/1 'JetBrains Mono', monospace; letter-spacing: .06em; text-align: center; }
.target-map-row { min-height: 54px; padding: 9px 12px; display: grid; grid-template-columns: minmax(70px,.7fr) 1fr auto 1fr auto; align-items: center; gap: 8px; border-radius: 13px; background: rgba(255,255,255,.10); animation: digit-group-in .48s ease var(--model-delay) both; }
.target-map-row > span { color: #9DE3E7; font-size: 11px; font-weight: 850; text-transform: uppercase; }
.target-map-row strong { font: 800 clamp(16px,2.5vw,22px)/1 'JetBrains Mono', monospace; text-align: center; }
.target-map-row i { color: rgba(255,255,255,.42); font-style: normal; }
.target-map-row em { padding: 5px 7px; border-radius: 8px; color: ${T.navy}; background: ${T.lime}; font: 850 10px/1 'JetBrains Mono', monospace; font-style: normal; }
.multi-number-lines { position: relative; z-index: 1; display: grid; gap: 12px; }
.multi-line-source { margin-bottom: 3px; }
.number-line-row { padding: 10px 12px 14px; border-radius: 14px; background: rgba(255,255,255,.09); animation: digit-group-in .5s ease var(--model-delay) both; }
.number-line-meta { margin-bottom: 16px; display: flex; justify-content: space-between; gap: 12px; }
.number-line-meta span { color: #9DE3E7; font-size: 10px; font-weight: 850; text-transform: uppercase; letter-spacing: .08em; }
.number-line-meta em { color: ${T.lime}; font: 800 11px/1 'JetBrains Mono', monospace; font-style: normal; }
.number-line-track { position: relative; height: 32px; display: flex; justify-content: space-between; align-items: end; border-top: 3px solid rgba(255,255,255,.38); }
.number-line-track > span { color: rgba(255,255,255,.78); font: 750 10px/1 'JetBrains Mono', monospace; }
.number-line-marker { position: absolute; top: -10px; left: var(--line-position); width: 17px; height: 17px; border: 4px solid ${T.navy}; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}, 0 0 14px rgba(255,91,53,.6); transform: translateX(-50%); animation: marker-drop .7s cubic-bezier(.16,1,.3,1) .4s both; }
.number-line-marker b { position: absolute; left: 50%; bottom: 17px; padding: 4px 6px; border-radius: 7px; color: ${T.navy}; background: ${T.paper}; font: 850 9px/1 'JetBrains Mono', monospace; white-space: nowrap; transform: translateX(-50%); }
.number-line-midpoint { position: absolute; top: -7px; left: 50%; width: 2px; height: 12px; background: ${T.lime}; transform: translateX(-50%); }
@keyframes marker-drop { from { opacity: 0; transform: translate(-50%,-12px) scale(.7); } to { opacity: 1; transform: translate(-50%,0) scale(1); } }
.decision-contrast { position: relative; z-index: 1; display: grid; gap: 13px; }
.decision-scale { height: 48px; padding: 0 10px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border-radius: 13px; background: linear-gradient(90deg,rgba(22,143,163,.20) 0 49.8%,rgba(149,201,61,.18) 50.2% 100%); }
.decision-scale strong { font: 800 15px/1 'JetBrains Mono', monospace; }
.decision-scale strong:last-child { text-align: right; }
.decision-scale span { padding: 7px; border-radius: 8px; color: ${T.navy}; background: ${T.lime}; font: 850 11px/1 'JetBrains Mono', monospace; }
.decision-cases { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.decision-case { min-width: 0; min-height: 88px; padding: 10px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 7px; border-radius: 13px; background: rgba(255,255,255,.10); animation: digit-group-in .48s ease var(--model-delay) both; }
.decision-case span, .decision-case strong { font: 800 14px/1 'JetBrains Mono', monospace; }
.decision-case strong { text-align: right; }
.decision-case i { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 8px; color: ${T.navy}; background: ${T.paper}; font: 900 12px/1 'JetBrains Mono', monospace; font-style: normal; }
.decision-case b { color: ${T.lime}; text-align: right; font-size: 20px; }
.carry-examples { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
.carry-example { min-height: 146px; padding: 14px; display: flex; flex-direction: column; justify-content: center; gap: 12px; border-radius: 15px; background: rgba(255,255,255,.10); animation: digit-group-in .5s ease var(--model-delay) both; }
.carry-example > span { color: #9DE3E7; font-size: 10px; font-weight: 850; text-transform: uppercase; }
.carry-example > div { display: flex; align-items: center; justify-content: center; gap: 12px; }
.carry-example strong { font: 800 clamp(20px,3.2vw,30px)/1 'JetBrains Mono', monospace; }
.carry-example i { color: ${T.lime}; font-style: normal; font-size: 22px; animation: carry-arrow 1.4s ease-in-out infinite; }
.carry-example small { color: rgba(255,255,255,.66); font: 700 11px/1 'JetBrains Mono', monospace; text-align: center; }
.carry-example small b { color: ${T.lime}; }
@keyframes carry-arrow { 50% { transform: translateX(5px); } }
.precision-board { position: relative; z-index: 1; display: grid; gap: 8px; }
.precision-source { margin-bottom: 4px; }
.precision-row { min-height: 55px; padding: 9px 12px; display: grid; grid-template-columns: 1fr 34px auto 1fr; align-items: center; gap: 9px; border-radius: 13px; background: rgba(255,255,255,.10); animation: digit-group-in .48s ease var(--model-delay) both; }
.precision-row span { color: #9DE3E7; font-size: 11px; font-weight: 850; }
.precision-row i { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 9px; color: ${T.navy}; background: ${T.lime}; font: 900 12px/1 'JetBrains Mono', monospace; font-style: normal; }
.precision-row b { color: rgba(255,255,255,.58); }
.precision-row strong { font: 800 clamp(18px,3vw,26px)/1 'JetBrains Mono', monospace; text-align: right; }
.rounding-focus { position: relative; z-index: 1; display: grid; gap: 17px; }
.rounding-digits { display: flex; justify-content: center; gap: 7px; }
.rounding-digits span { width: clamp(38px,7vw,57px); height: clamp(50px,8vw,68px); display: grid; place-items: center; border-radius: 12px; background: rgba(255,255,255,.10); font: 800 clamp(24px,4vw,37px)/1 'JetBrains Mono', monospace; animation: data-digit-in .55s cubic-bezier(.16,1,.3,1) both; }
.rounding-digits .round-target { box-shadow: inset 0 0 0 3px ${T.cyan}; background: rgba(22,143,163,.24); }
.rounding-digits .round-inspect { color: ${T.navy}; background: ${T.lime}; box-shadow: 0 0 18px rgba(149,201,61,.36); animation: digit-anchor-pulse 1.35s ease-in-out infinite; }
@keyframes digit-anchor-pulse { 50% { transform: translateY(-5px); box-shadow: 0 15px 28px -15px rgba(149,201,61,.72); } }
.rounding-result { display: flex; align-items: center; justify-content: center; gap: 14px; }
.rounding-result i { color: ${T.lime}; font-style: normal; font-size: 28px; }
.rounding-result strong { color: ${T.paper}; font: 800 clamp(27px,5vw,43px)/1 'JetBrains Mono', monospace; }
.rounding-error-board { position: relative; z-index: 1; display: grid; gap: 9px; }
.rounding-error-source { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.rounding-error-source span { font: 800 clamp(26px,4vw,38px)/1 'JetBrains Mono', monospace; }
.rounding-error-source em { padding: 6px 9px; border-radius: 9px; color: ${T.navy}; background: ${T.lime}; font-size: 10px; font-style: normal; font-weight: 850; }
.rounding-error-drafts { display: grid; gap: 7px; }
.rounding-error-drafts > div { min-height: 49px; padding: 8px 11px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-radius: 12px; color: #FFD9A0; background: rgba(169,111,19,.17); box-shadow: inset 3px 0 0 ${T.warn}; animation: digit-group-in .48s ease var(--model-delay) both; }
.rounding-error-drafts span { font-size: 10px; font-weight: 760; }
.rounding-error-drafts strong { font: 800 19px/1 'JetBrains Mono', monospace; }
.rounding-error-repair { min-height: 54px; padding: 8px 12px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 13px; color: ${T.navy}; background: ${T.successSoft}; animation: explanation-copy-in .55s ease .52s both; }
.rounding-error-repair span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; color: ${T.paper}; background: ${T.success}; }
.rounding-error-repair strong { font: 850 25px/1 'JetBrains Mono', monospace; }
.theory-screen .model-panel {
  animation: digit-group-in .48s cubic-bezier(.22,.8,.3,1) .08s both;
}
.theory-screen .class-group,
.theory-screen .place-cell,
.theory-screen .model-rows > div,
.theory-screen .model-steps > li {
  animation: digit-group-in .48s cubic-bezier(.22,.8,.3,1) both;
}
.theory-screen .class-group:nth-child(1),
.theory-screen .place-cell:nth-child(1),
.theory-screen .model-rows > div:nth-child(1),
.theory-screen .model-steps > li:nth-child(1) { animation-delay: .16s; }
.theory-screen .class-group:nth-child(2),
.theory-screen .place-cell:nth-child(2),
.theory-screen .model-rows > div:nth-child(2),
.theory-screen .model-steps > li:nth-child(2) { animation-delay: .27s; }
.theory-screen .place-cell:nth-child(3),
.theory-screen .model-rows > div:nth-child(3),
.theory-screen .model-steps > li:nth-child(3) { animation-delay: .38s; }
.theory-screen .model-rows > div:nth-child(4),
.theory-screen .model-steps > li:nth-child(4) { animation-delay: .49s; }
.theory-screen .place-cell:nth-child(4) { animation-delay: .49s; }
.theory-screen .place-cell:nth-child(5) { animation-delay: .60s; }
.theory-screen .place-cell:nth-child(6) { animation-delay: .71s; }
@keyframes digit-group-in {
  from { opacity: .35; transform: translateY(9px) scale(.94); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.theory-callout {
  padding: 20px 22px;
  border-radius: 20px;
  background: ${T.paper};
  box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.30);
  animation: explanation-copy-in .56s cubic-bezier(.22,.8,.3,1) .38s both;
}
@keyframes explanation-copy-in {
  from { opacity: .2; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}
.theory-callout h2 {
  font-family: 'Source Serif 4', serif;
  font-size: clamp(20px,3vw,28px);
  line-height: 1.2;
  font-weight: 620;
}
.theory-answer {
  margin-top: 14px;
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 34px minmax(0,1fr);
  align-items: start;
  gap: 10px;
  border-radius: 14px;
  color: ${T.ink};
  background: ${T.cyanSoft};
  box-shadow: inset 4px 0 0 ${T.cyan};
}
.theory-answer-mark {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: ${T.paper};
  background: ${T.cyan};
  font-weight: 900;
}
.theory-answer p { color: ${T.ink2}; font-size: 14px; line-height: 1.5; }
.hook-theory-layout { display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; }
.hook-mission-scene { position: relative; min-width: 0; }
.hook-mission-scene .model-panel { height: auto; min-height: 0; }
.hook-signal { position: absolute; z-index: 2; top: 18px; right: 18px; display: flex; align-items: end; gap: 4px; }
.hook-signal i { width: 4px; border-radius: 999px; background: ${T.lime}; animation: data-digit-in .65s cubic-bezier(.16,1,.3,1) both; }
.hook-signal i:nth-child(1) { height: 8px; animation-delay: .1s; }
.hook-signal i:nth-child(2) { height: 14px; animation-delay: .2s; }
.hook-signal i:nth-child(3) { height: 20px; animation-delay: .3s; }
.hook-signal i:nth-child(4) { height: 27px; animation-delay: .4s; }
@keyframes data-digit-in {
  from { opacity: 0; transform: translateY(9px) scale(.9); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
.theory-callout-mission { display: flex; flex-direction: column; justify-content: center; background: ${T.accentSoft}; box-shadow: inset 4px 0 0 ${T.accent}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.foundation-theory-layout { display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; }
.foundation-model-wrap { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.foundation-model-wrap .model-panel { flex: 0 0 auto; }
.foundation-scale-legend { padding: 9px 12px; display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 7px; border-radius: 12px; color: ${T.ink2}; background: ${T.cyanSoft}; font-size: 10px; font-weight: 850; text-align: center; text-transform: uppercase; }
.foundation-scale-legend i { color: ${T.cyan}; font-style: normal; }
.foundation-recap-strip { padding: 18px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; border-radius: 20px; background: ${T.navy}; }
.foundation-recap-card { min-width: 0; min-height: 130px; padding: 12px 8px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 11px; border-radius: 15px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.foundation-recap-card span { color: rgba(255,255,255,.68); font-size: 11px; text-align: center; }
.foundation-recap-card strong { font: 800 38px/1 'JetBrains Mono', monospace; }
.rule-theory-layout { position: relative; }
.rule-assembly-line { width: min(480px,86%); height: 34px; margin: -7px auto 5px; display: grid; grid-template-columns: repeat(4,1fr); align-items: center; position: relative; }
.rule-assembly-line::before { content: ''; position: absolute; left: 14%; right: 14%; height: 3px; border-radius: 999px; background: ${T.lime}; transform: scaleX(0); transform-origin: left; animation: rule-line-in .7s ease .55s forwards; }
.rule-assembly-line i { z-index: 1; width: 28px; height: 28px; margin: auto; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; font-style: normal; font: 900 12px/1 'JetBrains Mono', monospace; animation: digit-group-in .45s ease var(--theory-delay) both; }
@keyframes rule-line-in { to { transform: scaleX(1); } }
.theory-callout-rule { box-shadow: inset 4px 0 0 ${T.lime}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.strategy-route { padding: 16px; display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: stretch; gap: 9px; border-radius: 20px; background: ${T.navy}; }
.strategy-route > i { align-self: center; color: ${T.lime}; font-style: normal; font-weight: 900; }
.strategy-route-step { min-width: 0; min-height: 92px; padding: 11px; display: flex; flex-direction: column; justify-content: center; gap: 8px; border-radius: 14px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.strategy-route-step span { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 9px; color: ${T.navy}; background: ${T.lime}; font: 900 11px/1 'JetBrains Mono', monospace; }
.strategy-route-step p { font-size: 12px; line-height: 1.35; font-weight: 720; }
.theory-callout-strategy { margin-top: 14px; box-shadow: inset 4px 0 0 ${T.success}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.error-theory-layout { display: grid; grid-template-columns: minmax(270px,.82fr) minmax(0,1.18fr); gap: 16px; }
.error-theory-layout.error-rounding-layout { grid-template-columns: 1fr; gap: 14px; align-items: start; }
.error-rounding-layout > .model-panel { height: auto; min-height: 0; }
.error-walkthrough-board { padding: 17px; display: flex; flex-direction: column; justify-content: center; gap: 8px; border-radius: 20px; background: ${T.navy}; }
.error-walkthrough-row, .error-repair-result { min-height: 56px; padding: 9px 13px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-radius: 13px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.error-walkthrough-row span, .error-repair-result span { color: rgba(255,255,255,.68); font-size: 11px; font-weight: 800; text-transform: uppercase; }
.error-walkthrough-row strong, .error-repair-result strong { font: 800 25px/1 'JetBrains Mono', monospace; }
.error-row-draft { box-shadow: inset 4px 0 0 ${T.warn}; }
.error-repair-arrow { color: ${T.lime}; text-align: center; font-size: 22px; font-weight: 900; }
.error-repair-result { color: ${T.navy}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.error-repair-result span { color: ${T.success}; }
.theory-callout-error { box-shadow: inset 4px 0 0 ${T.warn}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.summary-signal { min-height: 120px; padding: 8px 24px; display: flex; align-items: center; justify-content: center; gap: 24px; border-radius: 20px; color: ${T.paper}; background: ${T.navy}; }
.summary-signal .g1-char { width: 78px; height: 98px; }
.summary-signal strong { font: 800 clamp(27px,5vw,45px)/1 'JetBrains Mono', monospace; letter-spacing: .05em; }
.summary-theory-cards { margin-top: 12px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
.summary-theory-cards > div { min-height: 90px; padding: 13px; display: grid; grid-template-columns: 31px minmax(0,1fr); gap: 9px; align-items: start; border-radius: 15px; background: ${T.paper}; box-shadow: 0 10px 25px -18px rgba(${T.shadowBase},.3); animation: digit-group-in .48s ease both; }
.summary-theory-cards > div:nth-child(2) { animation-delay: .12s; }
.summary-theory-cards > div:nth-child(3) { animation-delay: .24s; }
.summary-theory-cards span { color: ${T.accent}; font: 900 11px/1 'JetBrains Mono', monospace; }
.summary-theory-cards p { color: ${T.ink2}; font-size: 12px; line-height: 1.42; }
.theory-callout-summary { margin-top: 12px; box-shadow: inset 4px 0 0 ${T.lime}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.finale-screen { gap: 10px; }
.finale-heading { min-width: 0; padding: 12px 15px; border-radius: 17px; background: linear-gradient(135deg,${T.paper},${T.cyanSoft}); box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.38); }.finale-heading > span { display: block; margin-bottom: 4px; color: ${T.accent}; font: 900 9px/1 'JetBrains Mono',monospace; letter-spacing: .15em; }.finale-heading h1 { color: ${T.navy}; font: 650 clamp(20px,3vw,28px)/1.08 'Source Serif 4',serif; overflow-wrap: anywhere; }.finale-heading p { max-width: 760px; margin-top: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.42; overflow-wrap: anywhere; }
.finale-layout { min-width: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(248px,.42fr); gap: 10px; align-items: stretch; }.finale-main { min-width: 0; display: flex; flex-direction: column; gap: 9px; }.finale-mastery { min-width: 0; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.finale-takeaway { min-width: 0; min-height: 88px; padding: 10px; display: grid; grid-template-columns: 28px minmax(0,1fr); align-items: start; gap: 7px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 10px 24px -19px rgba(${T.shadowBase},.36); opacity: 0; transform: translateY(8px); transition: opacity .34s ease,transform .34s ease; }.finale-takeaway.is-visible { opacity: 1; transform: none; }.finale-takeaway > span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: ${T.paper}; background: ${T.cyan}; font: 900 10px/1 'JetBrains Mono',monospace; }.finale-takeaway:nth-child(2) > span { background: ${T.accent}; }.finale-takeaway:nth-child(3) > span { background: ${T.success}; }.finale-takeaway p { color: ${T.ink}; font-size: 11px; line-height: 1.38; font-weight: 720; overflow-wrap: anywhere; }
.finale-proof,.finale-bridge { min-width: 0; opacity: 0; transform: translateY(7px); transition: opacity .34s ease,transform .34s ease; }.finale-proof.is-visible,.finale-bridge.is-visible { opacity: 1; transform: none; }.finale-proof { padding: 9px 12px; display: grid; grid-template-columns: auto minmax(0,.7fr) minmax(0,1.3fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }.finale-proof > span,.finale-bridge strong { color: ${T.success}; font: 900 9px/1.2 'JetBrains Mono',monospace; letter-spacing: .1em; }.finale-proof > strong { min-width: 0; color: ${T.navy}; font: 800 12px/1.25 'JetBrains Mono',monospace; overflow-wrap: anywhere; }.finale-proof p,.finale-bridge p { color: ${T.ink2}; font-size: 11px; line-height: 1.35; overflow-wrap: anywhere; }
.finale-bridge { padding: 9px 11px; display: grid; grid-template-columns: 30px minmax(0,1fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.accentSoft}; }.finale-bridge > span { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px; color: ${T.paper}; background: ${T.accent}; font-weight: 900; }.finale-bridge strong { color: ${T.accent}; }.finale-bridge p { margin-top: 3px; }
.finale-reward { position: relative; min-width: 0; min-height: 206px; padding: 15px 76px 14px 62px; display: flex; align-items: center; overflow: hidden; border-radius: 18px; color: ${T.paper}; background: linear-gradient(145deg,${T.navy},#0f2c40); box-shadow: 0 16px 32px -22px rgba(${T.shadowBase},.58); }.finale-reward-copy { position: relative; z-index: 2; min-width: 0; }.finale-reward-copy > span { color: ${T.lime}; font: 900 9px/1.2 'JetBrains Mono',monospace; letter-spacing: .12em; }.finale-reward-copy h2 { margin-top: 5px; font: 650 19px/1.05 'Source Serif 4',serif; overflow-wrap: anywhere; }.finale-status { margin-top: 10px; }.finale-status strong { display: block; color: ${T.lime}; font: 850 25px/1 'JetBrains Mono',monospace; }.finale-status p { margin-top: 3px; font-size: 11px; line-height: 1.25; font-weight: 800; }.finale-status small { display: block; margin-top: 3px; color: rgba(255,255,255,.68); font-size: 9px; line-height: 1.3; }.finale-status-neutral strong { font-size: 22px; }
.finale-medal { position: absolute; z-index: 2; left: 11px; top: 50%; width: 39px; height: 39px; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; box-shadow: 0 0 0 5px rgba(149,201,61,.14); transform: translateY(-50%) scale(.78); transition: transform .38s ease; }.finale-reward.is-complete .finale-medal { transform: translateY(-50%) scale(1); }.finale-reward-bit { position: absolute; z-index: 1; right: 1px; bottom: -5px; width: 76px; height: 96px; }.finale-reward-bit .g1-char { width: 100%; height: 100%; }.finale-reward.is-complete .finale-reward-bit { animation: finale-bit-float 3.2s ease-in-out infinite; }
.finale-confetti i { position: absolute; z-index: 0; top: 12px; left: 20%; width: 5px; height: 9px; border-radius: 3px; background: ${T.lime}; opacity: 0; }.finale-confetti i:nth-child(2) { left: 34%; background: ${T.accent}; transform: rotate(24deg); }.finale-confetti i:nth-child(3) { left: 49%; background: ${T.cyan}; transform: rotate(-20deg); }.finale-confetti i:nth-child(4) { left: 63%; top: 22px; background: ${T.paper}; }.finale-confetti i:nth-child(5) { left: 78%; background: ${T.accent}; transform: rotate(38deg); }.finale-confetti i:nth-child(6) { left: 27%; top: 34px; background: ${T.cyan}; }.finale-confetti i:nth-child(7) { left: 57%; top: 42px; background: ${T.lime}; transform: rotate(-34deg); }.finale-confetti i:nth-child(8) { left: 86%; top: 34px; background: ${T.paper}; }.finale-reward.is-complete .finale-confetti i { animation: finale-confetti-fall 1.45s ease-out both; }.finale-reward.is-complete .finale-confetti i:nth-child(even) { animation-delay: .1s; }
@keyframes finale-bit-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes finale-confetti-fall { 0% { opacity: 0; translate: 0 -8px; } 20% { opacity: .9; } 100% { opacity: 0; translate: 5px 78px; rotate: 160deg; } }
.worked-examples-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.worked-example-card { min-height: 132px; padding: 15px; display: grid; grid-template-columns: 38px minmax(0,1fr); gap: 11px; border-radius: 17px; background: ${T.paper}; box-shadow: 0 12px 28px -20px rgba(${T.shadowBase},.34); animation: digit-group-in .5s ease var(--example-delay) both; }
.worked-example-number { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 11px; color: ${T.paper}; background: ${T.cyan}; font: 900 11px/1 'JetBrains Mono', monospace; }
.worked-example-card h2 { color: ${T.ink}; font-family: 'Source Serif 4', serif; font-size: 16px; line-height: 1.28; font-weight: 650; }
.worked-example-card strong { display: block; margin-top: 8px; color: ${T.success}; font: 800 17px/1.3 'JetBrains Mono', monospace; }
.worked-example-card p { margin-top: 6px; color: ${T.ink2}; font-size: 12px; line-height: 1.4; }
.worked-examples-finish { padding: 8px 15px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 15px; color: ${T.success}; background: ${T.successSoft}; font-weight: 800; animation: explanation-copy-in .55s ease .55s both; }
.worked-examples-finish .g1-char { width: 54px; height: 68px; }
.question-card { padding: 22px; border-radius: 20px; background: ${T.paper}; box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.question-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; color: ${T.accent}; font-size: 10px; font-weight: 900; letter-spacing: .14em; }
.question-topline small { color: ${T.warn}; font-size: 10px; letter-spacing: 0; }
.question-card h2 { max-width: 780px; font-family: 'Source Serif 4', serif; font-size: clamp(21px,3.2vw,30px); line-height: 1.18; font-weight: 620; }
.options-grid { margin-top: 16px; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.option {
  min-height: 58px;
  padding: 11px 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  border: 0;
  border-radius: 14px;
  background: #F8F8F4;
  color: ${T.ink};
  cursor: pointer;
  text-align: left;
  line-height: 1.34;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.16), 0 6px 16px -10px rgba(${T.shadowBase},.22);
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease, opacity .18s ease;
}
.option:hover:not(:disabled) { transform: translateY(-1px); background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px rgba(255,91,53,.24), 0 10px 20px -12px rgba(255,91,53,.34); }
.option:disabled { cursor: default; }
.option-letter { width: 32px; height: 32px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; background: ${T.paper}; color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 900; box-shadow: 0 4px 12px -8px rgba(${T.shadowBase},.3); }
.option-picked-wrong { color: ${T.warn}; background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.28); opacity: .64; }
.option-correct { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.28), 0 8px 20px -12px rgba(34,122,83,.35); }
.option-correct .option-letter { color: ${T.paper}; background: ${T.success}; }
.option-dismissed { opacity: .42; }
.number-entry-row { margin-top: 16px; display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: 10px; }
.answer-input {
  width: 100%;
  min-width: 0;
  min-height: 58px;
  padding: 10px 16px;
  border: 0;
  border-radius: 14px;
  outline: none;
  background: #F8F8F4;
  color: ${T.ink};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(21px,4vw,29px);
  font-weight: 800;
  letter-spacing: .07em;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.20), 0 6px 16px -10px rgba(${T.shadowBase},.22);
  transition: box-shadow .18s ease, background .18s ease;
}
.answer-input:focus { background: ${T.paper}; box-shadow: inset 0 0 0 2px rgba(22,143,163,.48), 0 8px 22px -12px rgba(22,143,163,.35); }
.answer-input-correct { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.30); }
.answer-input:disabled { opacity: .72; }
.number-entry-row .answer-input { grid-column: 1 / -1; }
.btn-check { grid-column: 2; justify-self: end; }
.feedback { max-height: 0; margin-top: 0; overflow: hidden; opacity: 0; transition: max-height .38s ease, margin-top .38s ease, opacity .28s ease; }
.feedback-visible { max-height: 420px; margin-top: 14px; opacity: 1; }
.feedback-card { min-height: 94px; padding: 12px 15px 12px 7px; display: grid; grid-template-columns: 82px minmax(0,1fr); align-items: center; gap: 10px; border-radius: 15px; }
.feedback-card .g1-char { width: 76px; height: 92px; }
.feedback-card strong { display: block; margin-bottom: 5px; font-family: 'Source Serif 4', serif; font-size: 13px; letter-spacing: .08em; }
.feedback-card p { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.feedback-correct { background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.feedback-correct strong { color: ${T.success}; }
.feedback-hint { background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; }
.feedback-hint strong { color: ${T.warn}; }
.fact-card, .bridge-card { margin-top: 12px; padding: 13px 15px; display: flex; align-items: flex-start; gap: 11px; border-radius: 13px; }
.fact-card { background: ${T.cyanSoft}; color: ${T.cyan}; }
.fact-card strong { font-size: 10px; letter-spacing: .14em; }
.fact-card p, .bridge-card p { color: ${T.ink2}; font-size: 13px; line-height: 1.42; }
.bridge-card { background: ${T.accentSoft}; }
.bridge-card > span { color: ${T.accent}; font-weight: 900; }
.compact-heading { grid-template-columns: minmax(0,1fr) auto; }
.rapid-score { width: 96px; height: 96px; display: flex; align-items: baseline; justify-content: center; border-radius: 26px; background: ${T.navy}; color: ${T.paper}; box-shadow: 0 12px 26px -15px rgba(23,59,82,.55); }
.rapid-score strong { align-self: center; font-family: 'JetBrains Mono', monospace; font-size: 38px; }
.rapid-score span { align-self: center; color: rgba(255,255,255,.62); font-size: 14px; }
.rapid-dots { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.rapid-dots i { height: 7px; border-radius: 999px; background: rgba(135,148,157,.24); transition: background .2s ease, box-shadow .2s ease; }
.rapid-dots i.current { background: ${T.accent}; box-shadow: 0 0 9px rgba(255,91,53,.45); }
.rapid-dots i.done { background: ${T.success}; }
.test-complete { margin-top: 14px; padding: 10px 16px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 15px; background: ${T.successSoft}; color: ${T.success}; font-weight: 800; }
.test-complete .g1-char { width: 62px; height: 74px; }
@keyframes bit-nod { 0%,100% { transform: translateY(0) rotate(0); } 45% { transform: translateY(-5px) rotate(-3deg); } 70% { transform: translateY(1px) rotate(2deg); } }
.lesson-root button:focus-visible { outline: 3px solid rgba(22,143,163,.42); outline-offset: 3px; }
@media (max-width: 760px) {
  .screen-heading { grid-template-columns: minmax(0,1fr) 94px; }
  .bit-coach { width: 94px; height: 102px; }
  .bit-coach .g1-char { width: 78px; height: 100px; }
  .options-grid { grid-template-columns: 1fr; }
  .error-theory-layout { grid-template-columns: 1fr; }
  .finale-layout { grid-template-columns: 1fr; }
  .finale-reward { min-height: 132px; }
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
  .stage { width: 390px; }
  .stage-header { padding-top: 10px; padding-bottom: 8px; }
  .stage-content { padding-top: 10px; padding-bottom: 18px; scrollbar-width: none; }
  .stage-content::-webkit-scrollbar { display: none; }
  .stage-nav { min-height: 66px; padding-top: 8px; }
  .screen-type { display: none; }
  .chrome-title { max-width: 170px; font-size: 11px; }
  .screen-stack { gap: 12px; }
  .screen-heading { grid-template-columns: minmax(0,1fr) 76px; gap: 8px; }
  .heading-copy h1 { font-size: 27px; }
  .heading-copy p { margin-top: 7px; font-size: 13px; line-height: 1.4; }
  .lesson-kicker { margin-bottom: 5px; font-size: 11px; }
  .bit-coach { width: 76px; height: 82px; border-radius: 20px; }
  .bit-coach .g1-char { width: 62px; height: 78px; }
  .model-panel { padding: 13px; border-radius: 16px; }
  .model-heading { margin-bottom: 9px; font-size: 11px; }
  .model-number { font-size: 30px; }
  .class-groups { gap: 7px; }
  .class-group { min-height: 72px; }
  .class-group strong { font-size: 27px; }
  .class-group span { font-size: 10px; }
  .place-table { gap: 4px; }
  .place-cell { min-height: 64px; padding: 5px 2px; }
  .place-cell span { min-height: 24px; font-size: 7px; }
  .place-cell strong { font-size: 20px; }
  .model-steps { grid-template-columns: 1fr; gap: 5px; }
  .model-steps li { min-height: 42px; padding: 8px; }
  .question-card { padding: 14px; border-radius: 16px; }
  .question-card h2 { font-size: 20px; }
  .options-grid { margin-top: 11px; gap: 7px; }
  .option { min-height: 50px; padding: 8px 10px; font-size: 12px; }
  .option-letter { width: 29px; height: 29px; }
  .feedback-card { grid-template-columns: 66px minmax(0,1fr); min-height: 80px; padding: 8px 10px 8px 3px; }
  .feedback-card .g1-char { width: 62px; height: 76px; }
  .feedback-card p { font-size: 12px; }
  .btn { min-height: 48px; padding: 0 14px; font-size: 12px; }
  .number-entry-row { gap: 7px; }
  .answer-input { min-height: 50px; padding: 8px 11px; font-size: 20px; }
  .lesson-preview .stage-header { padding-top: 60px; }
  .rapid-score { width: 72px; height: 72px; border-radius: 20px; }
  .rapid-score strong { font-size: 30px; }
  .theory-callout { padding: 14px; border-radius: 16px; }
  .theory-answer { padding: 11px; grid-template-columns: 30px minmax(0,1fr); }
  .theory-answer p { font-size: 12px; }
  .foundation-recap-strip { padding: 12px; gap: 6px; }
  .foundation-recap-card { min-height: 90px; padding: 8px 4px; }
  .foundation-recap-card span { font-size: 9px; }
  .foundation-recap-card strong { font-size: 28px; }
  .context-cards, .context-cards-3, .carry-examples, .decision-cases { grid-template-columns: 1fr; }
  .context-card { min-height: 82px; }
  .target-map-row { grid-template-columns: minmax(58px,.7fr) 1fr auto 1fr; padding: 8px; gap: 4px; }
  .target-map-row em { display: none; }
  .target-map-row strong { font-size: 14px; }
  .number-line-row { padding: 8px 8px 13px; }
  .number-line-marker b { font-size: 11px; }
  .decision-case { min-height: 70px; }
  .carry-example { min-height: 102px; }
  .precision-row { grid-template-columns: minmax(78px,1fr) 29px auto 1fr; gap: 5px; padding: 8px; }
  .precision-row strong { font-size: 16px; }
  .rounding-digits { gap: 4px; }
  .rounding-digits span { width: 39px; height: 49px; font-size: 23px; }
  .rounding-error-source span { font-size: 25px; }
  .rounding-error-drafts strong { font-size: 16px; }
  .strategy-route { padding: 11px; grid-template-columns: 1fr; gap: 6px; }
  .strategy-route > i { transform: rotate(90deg); text-align: center; }
  .strategy-route-step { min-height: 62px; }
  .summary-theory-cards { grid-template-columns: 1fr; }
  .worked-examples-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .worked-example-card { min-height: 0; padding: 9px; grid-template-columns: 30px minmax(0,1fr); gap: 7px; }
  .worked-example-number { width: 30px; height: 30px; }
  .worked-example-card h2 { font-size: 13px; }
  .worked-example-card strong { margin-top: 5px; font-size: 14px; }
  .worked-example-card p { margin-top: 4px; font-size: 10px; }
  .summary-signal { min-height: 96px; }
  .finale-heading { padding: 11px 12px; }.finale-heading h1 { font-size: 22px; }.finale-mastery { grid-template-columns: 1fr; gap: 6px; }.finale-takeaway { min-height: 0; padding: 8px 9px; }.finale-proof { grid-template-columns: 1fr; gap: 5px; }.finale-reward { min-height: 116px; padding: 11px 65px 11px 51px; }.finale-reward-copy h2 { font-size: 17px; }.finale-medal { left: 8px; width: 34px; height: 34px; }.finale-reward-bit { width: 62px; height: 78px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .finale-takeaway,.finale-proof,.finale-bridge { opacity: 1 !important; transform: none !important; }
  .finale-confetti { display: none; }
}
`;
