// SCRATCH — yangi Dars01 (nat_5_01) dars qatlami. Bu bloklar Dars01.jsx ga ko'chiriladi.
// Infra Dars28 dan (joriy Dars01.jsx bazasi). Mashina _Dars01_machine_ref.jsx dan port.

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'nat_5_01',
  lessonTitle: { ru: 'Огромные числа вокруг нас', uz: 'Atrofimizdagi katta sonlar' }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',          scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'MCScreen',        scored: false, scope: null },       // 1
  { id: 's2',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 2 (GroupingReveal)
  { id: 's3',  type: 'rule',        template: 'custom',          scored: false, scope: null },       // 3
  { id: 's4',  type: 'test',        template: 'SpacesInteractive',scored: true, scope: 'practice' }, // 4 (PORT)
  { id: 's5',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 5 (PlaceGrid + fakt)
  { id: 's6',  type: 'rule',        template: 'custom',          scored: false, scope: null },       // 6
  { id: 's7',  type: 'test',        template: 'custom',          scored: true,  scope: 'practice' }, // 7 (odd-one-out)
  { id: 's8',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 8 (ZeroMorph merged rule)
  { id: 's9',  type: 'test',        template: 'DecInputScreen',  scored: true,  scope: 'practice' }, // 9 (write 1392000 + fakt)
  { id: 's10', type: 'exploration', template: 'custom',          scored: false, scope: null },       // 10 (light speed + fakt)
  { id: 's11', type: 'test',        template: 'DragMatch',       scored: true,  scope: 'practice' }, // 11 (PORT)
  { id: 's12', type: 'test',        template: 'custom',          scored: true,  scope: 'practice' }, // 12 (classification)
  { id: 's13', type: 'test',        template: 'DecInputScreen',  scored: true,  scope: 'final' },    // 13 (write 149600000 + fakt)
  { id: 's14', type: 'summary',     template: 'custom',          scored: false, scope: null }        // 14
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Вопрос урока', uz: 'Dars savoli' },
    global_q: { ru: 'Как прочитать огромные числа вокруг нас?', uz: "Atrofimizdagi katta sonlarni qanday o'qiymiz?" },
    lead: { ru: 'Земля летит вокруг Солнца. Расстояние до него — вот столько километров:', uz: "Yer Quyosh atrofida aylanadi. Ungacha masofa — mana shuncha kilometr:" },
    number_em: { ru: '149 600 000', uz: '149 600 000' },
    question: { ru: 'Сможешь прочитать это число?', uz: "Bu sonni o'qiy olasizmi?" },
    opt_yes: { ru: 'Прочту легко', uz: "Bemalol o'qiyman" },
    opt_no: { ru: 'Пока трудно', uz: 'Hozircha qiyin' },
    opt_idk: { ru: 'Хочу научиться', uz: "O'rganmoqchiman" },
    audio: {
      intro: { ru: 'Земля летит вокруг Солнца, и расстояние до него сто сорок девять миллионов шестьсот тысяч километров. Прочитать такое число с ходу трудно. Главный вопрос урока: как прочитать и представить себе огромные числа вокруг нас? Сможешь прочитать это число?', uz: "Yer Quyosh atrofida aylanadi, va ungacha masofa bir yuz qirq to'qqiz million olti yuz ming kilometr. Bunday sonni darrov o'qish qiyin. Darsning asosiy savoli: atrofimizdagi katta sonlarni qanday o'qish va tasavvur qilamiz? Bu sonni o'qiy olasizmi?" },
      on_correct: { ru: 'Тогда начнём.', uz: 'Unda boshlaymiz.' },
      on_wrong: { ru: 'Тогда начнём.', uz: 'Unda boshlaymiz.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz' },
    bridge: { ru: 'Сначала вспомним разряды из начальной школы.', uz: "Avval boshlang'ich sinfdagi xonalarni eslaymiz." },
    question: { ru: 'В числе 2 658 цифра 6 стоит в разряде…', uz: '2 658 sonida 6 raqami qaysi xonada turibdi…' },
    opt0: { ru: 'единиц', uz: 'birlar' },
    opt1: { ru: 'десятков', uz: "o'nlar" },
    opt2: { ru: 'сотен', uz: 'yuzlar' },
    opt3: { ru: 'тысяч', uz: 'minglar' },
    correctIndex: 2,
    correct_text: { ru: 'Верно. 2 658 — это 2 тысячи, 6 сотен, 5 десятков, 8 единиц. Разряд показывает, сколько стоит цифра.', uz: "To'g'ri. 2 658 — bu 2 mingta, 6 yuzta, 5 o'nta, 8 birta. Xona raqamning qiymatini ko'rsatadi." },
    wrong_0: { ru: 'Единицы — самый правый разряд, там стоит восьмёрка. Считай разряды справа налево.', uz: "Birlar — eng o'ngdagi xona, u yerda sakkiz turibdi. Xonalarni o'ngdan chapga sanang." },
    wrong_1: { ru: 'В десятках стоит пятёрка. Шестёрка — на разряд левее десятков.', uz: "O'nlar xonasida besh turibdi. Olti undan bitta chap tomonda." },
    wrong_3: { ru: 'В тысячах стоит двойка. Шестёрка — на разряд правее тысяч.', uz: "Minglar xonasida ikki turibdi. Olti undan bitta o'ng tomonda." },
    audio: {
      intro: { ru: 'Короткий разогрев. В числе две тысячи шестьсот пятьдесят восемь в каком разряде стоит цифра шесть? Выбери ответ.', uz: "Qisqa mashq. Ikki ming olti yuz ellik sakkiz sonida olti raqami qaysi xonada turibdi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Скоро эти разряды соберутся в классы.', uz: "To'g'ri. Tez orada bu xonalar sinflarga yig'iladi." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    bridge: { ru: 'Это число длинное. Разобьём его на части.', uz: "Bu son uzun. Uni qismlarga ajratamiz." },
    title: { ru: 'Разбиваем число на классы', uz: 'Sonni sinflarga ajratamiz' },
    btn_step: { ru: 'Дальше', uz: 'Davom etish' },
    btn_final: { ru: 'Дальше', uz: 'Davom etish' },
    number_grouped: { ru: '149 600 000', uz: '149 600 000' },
    audio: {
      ru: [
        'Чтобы прочитать число, поставим пробелы через каждые три цифры, считая справа. Первая группа справа это класс единиц.',
        'Следующая группа это класс тысяч.',
        'А слева стоит класс миллионов. Теперь число читается по группам, а не по одной цифре.'
      ],
      uz: [
        "Sonni o'qish uchun o'ngdan boshlab har uch xonadan keyin bo'sh joy qo'yamiz. O'ngdagi birinchi guruh bu birlar sinfi.",
        "Keyingi guruh bu minglar sinfi.",
        "Chapda esa millionlar sinfi turadi. Endi son bittalab emas, guruhlar bo'yicha o'qiladi."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Класс', uz: 'Sinf' },
    rule_1: { ru: 'Многозначное число делят на классы по три разряда, считая справа налево.', uz: "Ko'p xonali son o'ngdan chapga uch xonadan sinflarga ajratiladi." },
    rule_2: { ru: 'Каждый класс — это группа из трёх цифр. Между классами ставят пробел.', uz: "Har bir sinf — uchta raqamdan iborat guruh. Sinflar orasiga bo'sh joy qo'yiladi." },
    example: { ru: '149 600 000  →  149 | 600 | 000', uz: '149 600 000  →  149 | 600 | 000' },
    bridge_next: { ru: 'Теперь расставь пробелы сам.', uz: "Endi bo'sh joylarni o'zingiz qo'ying." },
    audio: { ru: 'Запомним правило. Многозначное число делят на классы по три разряда, считая справа налево. Каждый класс это группа из трёх цифр, и между классами ставят пробел.', uz: "Qoidani eslab qolamiz. Ko'p xonali son o'ngdan chapga uch xonadan sinflarga ajratiladi. Har bir sinf uchta raqamdan iborat guruh, va sinflar orasiga bo'sh joy qo'yiladi." }
  },

  s4: {
    eyebrow: { ru: 'Тренировка · 1 из 6', uz: 'Mashq · 6 dan 1' },
    bridge: { ru: 'Расстояние до Луны записано без пробелов. Раздели его на классы.', uz: "Oygacha masofa bo'shliqsiz yozilgan. Uni sinflarga ajrating." },
    label: { ru: 'Расставь пробелы', uz: "Bo'shliqlarni qo'ying" },
    context: { ru: 'Расстояние от Земли до Луны, км.', uz: 'Yerdan Oygacha masofa, km.' },
    raw: '384400',
    correct: '384 400',
    hint: { ru: 'Отсчитай три цифры справа и поставь пробел перед ними.', uz: "O'ngdan uchta xonani sanang va ulardan oldin bo'sh joy qo'ying." },
    fb_correct: { ru: 'Верно. Пробел через три цифры справа: 384 400. Это триста восемьдесят четыре тысячи четыреста.', uz: "To'g'ri. Bo'sh joy o'ngdan uch xonadan keyin: 384 400. Bu uch yuz sakson to'rt ming to'rt yuz." },
    fb_wrong: { ru: 'Считай три цифры справа и ставь пробел только там. Так число делится на класс тысяч и класс единиц.', uz: "O'ngdan uchta xonani sanang va faqat o'sha yerga bo'sh joy qo'ying. Shunda son minglar sinfi va birlar sinfiga bo'linadi." },
    audio: {
      intro: { ru: 'Расстояние до Луны записано без пробелов. Поставь пробел так, чтобы число делилось на классы. Потом нажми кнопку проверить.', uz: "Oygacha masofa bo'shliqsiz yozilgan. Son sinflarga bo'linishi uchun bo'sh joy qo'ying. Keyin tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Через три цифры справа число разделилось на классы.', uz: "To'g'ri. O'ngdan uch xonadan keyin son sinflarga bo'lindi." },
      on_wrong: { ru: 'Пока не так. Считай три цифры справа.', uz: "Hali emas. O'ngdan uchta xonani sanang." }
    }
  },

  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    bridge: { ru: 'Заглянем внутрь одного класса.', uz: "Bitta sinfning ichiga qaraymiz." },
    title: { ru: 'Три разряда в каждом классе', uz: 'Har bir sinfda uchta xona' },
    btn_step: { ru: 'Дальше', uz: 'Davom etish' },
    btn_final: { ru: 'Дальше', uz: 'Davom etish' },
    fact: { ru: 'Слово «миллион» появилось около 700 лет назад — раньше таких больших чисел почти не считали.', uz: "«Million» so'zi taxminan 700 yil avval paydo bo'lgan — ilgari bunday katta sonlarni deyarli sanashmagan." },
    fact_audio: { ru: 'Интересно: слово миллион появилось лишь около семисот лет назад. Раньше людям почти не приходилось считать такие большие количества.', uz: "Qiziq: million so'zi atigi yetti yuz yilcha avval paydo bo'lgan. Ilgari odamlarga bunday katta miqdorlarni sanash deyarli kerak bo'lmagan." },
    audio: {
      ru: [
        'В каждом классе всегда три разряда, и считаем их справа налево. Самый правый разряд это единицы.',
        'Слева от единиц стоит разряд десятков.',
        'Ещё левее разряд сотен. Эти три разряда повторяются в каждом классе, поэтому любое число читается по одному правилу.'
      ],
      uz: [
        "Har bir sinfda doimo uchta xona bor, va ularni o'ngdan chapga sanaymiz. Eng o'ngdagi xona bu birlar.",
        "Birlardan chapda o'nlar xonasi turadi.",
        "Undan ham chapda yuzlar xonasi. Bu uchta xona har bir sinfda takrorlanadi, shuning uchun har qanday son bitta qoida bilan o'qiladi."
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Как читать число', uz: "Sonni qanday o'qiymiz" },
    rule_1: { ru: 'Читаем слева направо: называем число в каждом классе и добавляем название класса.', uz: "Chapdan o'ngga o'qiymiz: har bir sinfdagi sonni aytamiz va sinf nomini qo'shamiz." },
    rule_2: { ru: 'Класс единиц название не получает — его просто называют.', uz: "Birlar sinfining nomi aytilmaydi — uni shunchaki aytamiz." },
    example: { ru: '384 400  →  триста восемьдесят четыре тысячи четыреста', uz: "384 400  →  uch yuz sakson to'rt ming to'rt yuz" },
    bridge_next: { ru: 'Проверим на слух: где чтение ошибочно?', uz: "Quloqqa solib tekshiramiz: qaysi o'qish xato?" },
    audio: { ru: 'Правило чтения. Идём слева направо, называем число в каждом классе и добавляем название класса. Класс единиц название не получает, его просто называют.', uz: "O'qish qoidasi. Chapdan o'ngga boramiz, har bir sinfdagi sonni aytamiz va sinf nomini qo'shamiz. Birlar sinfining nomi aytilmaydi, uni shunchaki aytamiz." }
  },

  s7: {
    eyebrow: { ru: 'Тренировка · 2 из 6', uz: 'Mashq · 6 dan 2' },
    bridge: { ru: 'Три числа прочитаны верно, одно — с ошибкой. Найди ошибку.', uz: "Uch son to'g'ri o'qilgan, bittasi — xato. Xatoni toping." },
    question: { ru: 'В каком числе чтение ошибочно?', uz: "Qaysi sonda o'qish xato?" },
    lead: { ru: 'Сравни число и его чтение. Тапни ошибочное.', uz: "Sonni va uning o'qilishini solishtiring. Xato bo'lganini bosing." },
    errorIdx: 1,
    items: [
      { num: '5 000', reading: { ru: 'пять тысяч', uz: 'besh ming' }, wrong: false },
      { num: '384 400', reading: { ru: 'триста восемьдесят четыре тысячи сорок', uz: "uch yuz sakson to'rt ming qirq" }, wrong: true },
      { num: '60 200', reading: { ru: 'шестьдесят тысяч двести', uz: 'oltmish ming ikki yuz' }, wrong: false },
      { num: '1 392 000', reading: { ru: 'один миллион триста девяносто две тысячи', uz: "bir million uch yuz to'qson ikki ming" }, wrong: false }
    ],
    correct_text: { ru: 'Верно. В 384 400 класс единиц это 400 — четыреста, а не сорок. Потерян ноль: правильно триста восемьдесят четыре тысячи четыреста.', uz: "To'g'ri. 384 400 da birlar sinfi 400 — to'rt yuz, qirq emas. Nol yo'qolgan: to'g'risi uch yuz sakson to'rt ming to'rt yuz." },
    wrong_0: { ru: 'Пять тысяч прочитано верно: в классе тысяч пятёрка, класс единиц пустой. Ищи число, где потеряли ноль.', uz: "Besh ming to'g'ri o'qilgan: minglar sinfida besh, birlar sinfi bo'sh. Nol yo'qolgan sonni qidiring." },
    wrong_2: { ru: 'Шестьдесят тысяч двести прочитано верно. Ищи, где в классе единиц вместо сотен назвали десятки.', uz: "Oltmish ming ikki yuz to'g'ri o'qilgan. Birlar sinfida yuzlar o'rniga o'nlar aytilgan sonni qidiring." },
    wrong_3: { ru: 'Один миллион триста девяносто две тысячи прочитано верно. Ошибка в другом числе.', uz: "Bir million uch yuz to'qson ikki ming to'g'ri o'qilgan. Xato boshqa sonda." },
    audio: {
      intro: { ru: 'Три числа прочитаны верно, а в одном чтение ошибочно. Найди число с ошибкой и тапни его.', uz: "Uch son to'g'ri o'qilgan, bittasida o'qish xato. Xato sonni toping va uni bosing." },
      on_correct: { ru: 'Верно. Ноль в классе единиц нельзя терять.', uz: "To'g'ri. Birlar sinfidagi nolni yo'qotib bo'lmaydi." },
      on_wrong: { ru: 'Это число прочитано правильно. Ищи потерянный ноль.', uz: "Bu son to'g'ri o'qilgan. Yo'qolgan nolni qidiring." }
    }
  },

  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    bridge: { ru: 'Вернёмся к числу Солнца и проверим, что делает ноль.', uz: "Quyosh soniga qaytamiz va nol nima qilishini tekshiramiz." },
    title: { ru: 'Ноль держит разряд', uz: 'Nol xonani ushlaydi' },
    btn_step: { ru: 'Дальше', uz: 'Davom etish' },
    btn_reveal: { ru: 'Почему так', uz: 'Nega bunday' },
    number_a: { ru: '149 600 000', uz: '149 600 000' },
    number_b: { ru: '14 960 000', uz: '14 960 000' },
    audio_explore: { ru: [
      'В числе Солнца много нулей, и они держат разряды. Уберём всего один ноль.',
      'Все цифры сдвинулись вправо, и получилось четырнадцать миллионов девятьсот шестьдесят тысяч — в десять раз меньше.'
    ], uz: [
      "Quyosh sonida nollar ko'p, va ular xonalarni ushlab turadi. Atigi bitta nolni olib tashlaymiz.",
      "Barcha raqamlar o'ngga surildi va o'n to'rt million to'qqiz yuz oltmish ming hosil bo'ldi — o'n barobar kichik."
    ] },
    warn: { ru: 'Если разряд пустой, в нём пишут ноль. Выбросить такой ноль нельзя — иначе цифры сдвинутся и число станет в разы меньше.', uz: "Agar xona bo'sh bo'lsa, unga nol yoziladi. Bunday nolni tashlab bo'lmaydi — aks holda raqamlar suriladi va son necha barobar kichik bo'lib qoladi." },
    audio_rule: { ru: 'Запомним. Если разряд пустой, в нём пишут ноль. Такой ноль выбрасывать нельзя, иначе остальные цифры сдвинутся и число станет другим.', uz: "Eslab qolamiz. Agar xona bo'sh bo'lsa, unga nol yoziladi. Bunday nolni tashlab bo'lmaydi, aks holda qolgan raqamlar suriladi va son boshqacha bo'lib qoladi." }
  },

  s9: {
    eyebrow: { ru: 'Тренировка · 3 из 6', uz: 'Mashq · 6 dan 3' },
    bridge: { ru: 'Теперь запиши число цифрами, не теряя нули.', uz: "Endi sonni raqamlar bilan yozing, nollarni yo'qotmay." },
    label: { ru: 'Запиши цифрами', uz: 'Raqamlar bilan yozing' },
    context: { ru: 'Диаметр Солнца, км.', uz: 'Quyosh diametri, km.' },
    question: { ru: 'Запиши цифрами: один миллион триста девяносто две тысячи.', uz: "Raqamlar bilan yozing: bir million uch yuz to'qson ikki ming." },
    placeholder: { ru: '0', uz: '0' },
    answer: '1392000',
    hint: { ru: 'Класс единиц здесь пустой — держи его тремя нулями.', uz: "Bu yerda birlar sinfi bo'sh — uni uchta nol bilan ushlang." },
    fb_correct: { ru: 'Правильно. Миллионы — 1, тысячи — 392, класс единиц пуст и держится нулями: 1 392 000.', uz: "To'g'ri. Millionlar — 1, minglar — 392, birlar sinfi bo'sh va nollar bilan ushlanadi: 1 392 000." },
    fb_wrong: { ru: 'Проверь класс единиц. Он пустой, держи его тремя нулями: миллион, потом триста девяносто две тысячи, потом три нуля.', uz: "Birlar sinfini tekshiring. U bo'sh, uni uchta nol bilan ushlang: million, keyin uch yuz to'qson ikki ming, keyin uchta nol." },
    fact: { ru: 'В нашей галактике около 100 000 000 000 звёзд — их не сосчитать поштучно.', uz: "Bizning galaktikamizda taxminan 100 000 000 000 yulduz bor — ularni bittalab sanab bo'lmaydi." },
    fact_audio: { ru: 'Кстати, в нашей галактике около ста миллиардов звёзд. Столько по одной не сосчитать за всю жизнь.', uz: "Aytgancha, bizning galaktikamizda yuz milliardga yaqin yulduz bor. Bunchani bittalab butun umr sanab bo'lmaydi." },
    audio: {
      intro: { ru: 'Запиши цифрами число один миллион триста девяносто две тысячи. Потом нажми кнопку проверить.', uz: "Bir million uch yuz to'qson ikki ming sonini raqamlar bilan yozing. Keyin tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Класс единиц пустой и держится тремя нулями.', uz: "To'g'ri. Birlar sinfi bo'sh va uchta nol bilan ushlanadi." },
      on_wrong: { ru: 'Проверь нули в пустом классе.', uz: "Bo'sh sinfdagi nollarni tekshiring." }
    }
  },

  s10: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    bridge: { ru: 'А вот число без единого нуля.', uz: "Mana birorta ham nolsiz son." },
    title: { ru: 'Самое плотное число', uz: 'Eng zich son' },
    btn_step: { ru: 'Дальше', uz: 'Davom etish' },
    btn_final: { ru: 'Дальше', uz: 'Davom etish' },
    number_grouped: { ru: '299 792 458', uz: '299 792 458' },
    fact: { ru: 'Свет от Солнца долетает до Земли примерно за 8 минут, проходя эти 149 600 000 км.', uz: "Quyoshdan yorug'lik Yergacha taxminan 8 daqiqada yetib keladi, shu 149 600 000 km ni bosib o'tib." },
    fact_audio: { ru: 'Интересно: свет от Солнца долетает до Земли примерно за восемь минут. За это время он проходит сто сорок девять миллионов шестьсот тысяч километров.', uz: "Qiziq: Quyoshdan yorug'lik Yergacha taxminan sakkiz daqiqada yetib keladi. Shu vaqtda u bir yuz qirq to'qqiz million olti yuz ming kilometrni bosib o'tadi." },
    audio: {
      ru: [
        'Скорость света очень плотное число, в нём нет ни одного нуля. В классе миллионов двести девяносто девять.',
        'В классе тысяч семьсот девяносто два.',
        'В классе единиц четыреста пятьдесят восемь. Читаем слева направо и получаем всё число.'
      ],
      uz: [
        "Yorug'lik tezligi juda zich son, unda birorta ham nol yo'q. Millionlar sinfida ikki yuz to'qson to'qqiz.",
        "Minglar sinfida yetti yuz to'qson ikki.",
        "Birlar sinfida to'rt yuz ellik sakkiz. Chapdan o'ngga o'qib, butun sonni olamiz."
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Тренировка · 4 из 6', uz: 'Mashq · 6 dan 4' },
    bridge: { ru: 'Собери числа урока с их чтением.', uz: "Darsdagi sonlarni o'qilishi bilan moslang." },
    title: { ru: 'Сопоставь число и чтение', uz: "Sonni o'qilishi bilan mosla" },
    lead: { ru: 'Тапни число, потом выбери его чтение.', uz: "Songa bosing, keyin o'qilishini tanlang." },
    pairs: [
      { number: '384 400', label: { ru: 'Луна, км', uz: 'Oy, km' }, reading: { ru: 'триста восемьдесят четыре тысячи четыреста', uz: "uch yuz sakson to'rt ming to'rt yuz" } },
      { number: '1 392 000', label: { ru: 'диаметр Солнца', uz: 'Quyosh diametri' }, reading: { ru: 'один миллион триста девяносто две тысячи', uz: "bir million uch yuz to'qson ikki ming" } },
      { number: '299 792 458', label: { ru: 'скорость света', uz: "yorug'lik tezligi" }, reading: { ru: 'двести девяносто девять миллионов семьсот девяносто две тысячи четыреста пятьдесят восемь', uz: "ikki yuz to'qson to'qqiz million yetti yuz to'qson ikki ming to'rt yuz ellik sakkiz" } }
    ],
    hint: { ru: 'Раздели число на классы по три справа и читай по классам слева направо.', uz: "Sonni o'ngdan uch xonadan sinflarga ajrating va chapdan o'ngga sinflar bo'yicha o'qing." },
    correct_text: { ru: 'Верно. Все числа прочитаны по классам.', uz: "To'g'ri. Barcha sonlar sinflar bo'yicha o'qildi." },
    audio: {
      intro: { ru: 'Сопоставь каждое число с тем, как оно читается. Тапни число, потом выбери чтение.', uz: "Har bir sonni qanday o'qilishi bilan mosla. Songa bosing, keyin o'qilishini tanlang." },
      on_correct: { ru: 'Верно, все числа сопоставлены по классам.', uz: "To'g'ri, barcha sonlar sinflar bo'yicha moslandi." },
      on_wrong: { ru: 'Это не то чтение. Раздели число на классы.', uz: "Bu o'qilishi mos emas. Sonni sinflarga ajrating." }
    }
  },

  s12: {
    eyebrow: { ru: 'Тренировка · 5 из 6', uz: 'Mashq · 6 dan 5' },
    bridge: { ru: 'Разложи числа по самому старшему классу.', uz: "Sonlarni eng yuqori sinfi bo'yicha ajrating." },
    title: { ru: 'До какого класса доходит число?', uz: 'Son qaysi sinfgacha yetadi?' },
    lead: { ru: 'Число появляется по одному. Тапни корзину, куда оно попадает.', uz: "Son bittalab chiqadi. U tushadigan savatni bosing." },
    bin_th: { ru: 'До класса тысяч', uz: 'Minglar sinfigacha' },
    bin_mln: { ru: 'До класса миллионов', uz: 'Millionlar sinfigacha' },
    cards: [
      { label: '7 500', bin: 'th' },
      { label: '384 400', bin: 'th' },
      { label: '60 200', bin: 'th' },
      { label: '1 392 000', bin: 'mln' },
      { label: '149 600 000', bin: 'mln' },
      { label: '299 792 458', bin: 'mln' }
    ],
    hint: { ru: 'Раздели на классы и посмотри, есть ли группа миллионов слева.', uz: "Sinflarga ajrating va chapda millionlar guruhi bor-yo'qligini qarang." },
    correct_text: { ru: 'Верно. Если слева есть третья группа — число доходит до миллионов.', uz: "To'g'ri. Agar chapda uchinchi guruh bo'lsa — son millionlargacha yetadi." },
    audio: {
      intro: { ru: 'Числа появляются по одному. Реши, до какого старшего класса доходит каждое, и тапни нужную корзину.', uz: "Sonlar bittalab chiqadi. Har biri qaysi yuqori sinfgacha yetishini aniqlang va kerakli savatni bosing." },
      on_correct: { ru: 'Верно. Третья группа слева — это миллионы.', uz: "To'g'ri. Chapdagi uchinchi guruh — bu millionlar." },
      on_wrong: { ru: 'Посчитай группы по три справа.', uz: "O'ngdan uchtalik guruhlarni sanang." }
    }
  },

  s13: {
    eyebrow: { ru: 'Проверка знаний', uz: 'Bilim tekshiruvi' },
    bridge: { ru: 'Финал — то самое число Солнца из начала урока.', uz: "Yakun — dars boshidagi o'sha Quyosh soni." },
    label: { ru: 'Запиши цифрами', uz: 'Raqamlar bilan yozing' },
    context: { ru: 'Расстояние от Земли до Солнца, км.', uz: 'Yerdan Quyoshgacha masofa, km.' },
    question: { ru: 'Запиши цифрами: сто сорок девять миллионов шестьсот тысяч.', uz: "Raqamlar bilan yozing: bir yuz qirq to'qqiz million olti yuz ming." },
    placeholder: { ru: '0', uz: '0' },
    answer: '149600000',
    hint: { ru: 'Миллионы, потом тысячи, потом пустой класс единиц из трёх нулей.', uz: "Millionlar, keyin minglar, keyin uchta noldan iborat bo'sh birlar sinfi." },
    fb_correct: { ru: 'Правильно. Миллионы — 149, тысячи — 600, класс единиц пуст: 149 600 000. Ты прочитал число из начала урока.', uz: "To'g'ri. Millionlar — 149, minglar — 600, birlar sinfi bo'sh: 149 600 000. Dars boshidagi sonni o'qidingiz." },
    fb_wrong: { ru: 'Не теряй нули. Сто сорок девять миллионов, шестьсот тысяч, и пустой класс единиц из трёх нулей.', uz: "Nollarni yo'qotmang. Bir yuz qirq to'qqiz million, olti yuz ming, va uchta noldan iborat bo'sh birlar sinfi." },
    fact: { ru: 'Память обычного смартфона — это миллиарды байтов. Большие числа окружают нас каждый день.', uz: "Oddiy smartfon xotirasi — milliardlab bayt. Katta sonlar bizni har kuni o'rab turadi." },
    fact_audio: { ru: 'Кстати, память обычного смартфона измеряется миллиардами байтов. Большие числа окружают нас каждый день.', uz: "Aytgancha, oddiy smartfon xotirasi milliardlab bayt bilan o'lchanadi. Katta sonlar bizni har kuni o'rab turadi." },
    audio: {
      intro: { ru: 'Запиши цифрами расстояние до Солнца: сто сорок девять миллионов шестьсот тысяч. Потом нажми кнопку проверить.', uz: "Quyoshgacha masofani raqamlar bilan yozing: bir yuz qirq to'qqiz million olti yuz ming. Keyin tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Ты записал число из начала урока без потерянных нулей.', uz: "To'g'ri. Dars boshidagi sonni nollarni yo'qotmay yozdingiz." },
      on_wrong: { ru: 'Проверь нули в пустом классе единиц.', uz: "Bo'sh birlar sinfidagi nollarni tekshiring." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    heading: { ru: 'Теперь ты читаешь любое огромное число', uz: "Endi istalgan katta sonni o'qiysiz" },
    title: { ru: 'Помнишь вопрос про Солнце? Теперь ответ у тебя есть.', uz: "Quyosh haqidagi savolni eslaysizmi? Endi javob sizda." },
    hook_close: { ru: 'Расстояние до Солнца 149 600 000 — это сто сорок девять миллионов шестьсот тысяч километров. В начале урока его было трудно прочитать, теперь — нет.', uz: "Quyoshgacha masofa 149 600 000 — bu bir yuz qirq to'qqiz million olti yuz ming kilometr. Dars boshida uni o'qish qiyin edi, endi — yo'q." },
    main_label: { ru: 'Главное', uz: 'Asosiysi' },
    main_1: { ru: 'Разбей число на классы по три цифры справа.', uz: "Sonni o'ngdan uch xonadan sinflarga ajrating." },
    main_2: { ru: 'В каждом классе три разряда; читай слева направо по классам.', uz: "Har bir sinfda uchta xona; chapdan o'ngga sinflar bo'yicha o'qing." },
    main_3: { ru: 'Ноль держит пустой разряд — без него число в разы меньше.', uz: "Nol bo'sh xonani ushlaydi — usiz son necha barobar kichik." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'разряды и классы из начальной школы', uz: "boshlang'ich sinfdagi xona va sinflar" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'сравнение и округление многозначных чисел', uz: "ko'p xonali sonlarni taqqoslash va yaxlitlash" },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: [
      'Вернёмся к вопросу урока: как прочитать огромные числа вокруг нас.',
      'Разбиваем число на классы по три цифры справа, в каждом классе три разряда, и читаем слева направо.',
      'Ноль держит пустой разряд, выбрасывать его нельзя, иначе число станет в разы меньше.',
      'Теперь даже расстояние до Солнца тебе по силам. Дальше нас ждёт сравнение и округление больших чисел.'
    ], uz: [
      "Dars savoliga qaytamiz: atrofimizdagi katta sonlarni qanday o'qiymiz.",
      "Sonni o'ngdan uch xonadan sinflarga ajratamiz, har bir sinfda uchta xona, va chapdan o'ngga o'qiymiz.",
      "Nol bo'sh xonani ushlaydi, uni tashlab bo'lmaydi, aks holda son necha barobar kichik bo'lib qoladi.",
      "Endi hatto Quyoshgacha masofa ham qo'lingizdan keladi. Keyingi safar katta sonlarni taqqoslash va yaxlitlash kutadi."
    ] }
  }
};
