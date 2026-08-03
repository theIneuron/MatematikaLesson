// ============================================================================
// Dars01.data.js — СКЕЛЕТ УРОКА 1 (3 класс)
// Тема: сотни, десятки и единицы. Блок Б1, сюжет «Bit sayyorasi Lumo».
//
// СТАТУС: контент написан целиком — 15 экранов, три локали (uz, ru, en), озвучка.
// Узбекская математическая терминология — draft: требует валидации узбекским
// методистом. Английский написан здесь впервые, раньше уроки были на двух языках.
//
// Контракт: src/books/grade3/ETALON_3SINF_v2.md
// Проверка:  node scripts/validate-grade3.mjs --data src/courses/grade3/content/Dars01.data.js
//
// ---------------------------------------------------------------------------
// ЧТО ЭТОТ УРОК ДОЛЖЕН СДЕЛАТЬ С РЕБЁНКОМ
//
// Ядро: в трёхзначном числе МЕСТО цифры задаёт её значение. Сотня собрана из
// десятков, десяток из единиц — это не определение, а то, что ребёнок увидит.
// Ноль в разряде значит «здесь ровно ноль», а не «здесь ничего нет».
//
// Опора из 2 класса: двузначное число как десятки и единицы (72 = 7 о'нлик 2 бирлик).
//
// MISCONCEPTION'Ы, под каждую — свой экран или свой неверный вариант:
//   M1  перестановка цифр: 345 и 435 «одно и то же»       -> экран 5, вариант в 10
//   M2  сложение разрядов вместо чтения: 3 + 4 + 5 = 12    -> вариант в 10 и 14
//   M3  пропуск нуля при записи: «пятьсот два» -> 52       -> ЭКРАН 11 целиком
//   M4  «десять десятков» и «десять сотен» смешиваются     -> экран 7, вариант в 14
//
// M3 — главная. Под неё отдельный экран «найди ошибку» и три примера с нулём
// на экране 4 (703 и 640) заранее, до того как ребёнок ошибётся сам.
//
// ---------------------------------------------------------------------------
// ЧТО НОВОГО ПРОТИВ СТАРОГО Dars01
//
// В старом уроке 15 экранов, но роли «найди ошибку» и «обратная задача»
// отсутствовали — как и во всех 19 эталонных уроках 3 класса. Эталон v2 сделал
// их обязательными, и они занимают два из пяти test-экранов, а не добавляются
// сверху: урок остаётся 15 экранов и 830 расчётных секунд из 900.
//
// Экран 11 «найди ошибку» отрабатывает M3 напрямую: ребёнок видит чужую запись
// и находит, что в ней не так. Экран 12 «обратная задача» разворачивает экран 4:
// там число превращалось в разложение, здесь разложение превращается в число.
// ---------------------------------------------------------------------------

// Подписи разрядов — нужны почти каждому экрану, поэтому объявлены один раз.
export const PLACE_LABELS = {
  uz: { h: 'yuzlik', t: "o'nlik", o: 'birlik' },
  ru: { h: 'сотни', t: 'десятки', o: 'единицы' },
  en: { h: 'hundreds', t: 'tens', o: 'ones' },
};

const LESSON = {
  id: 'num-3-01-v2',
  title: {
    uz: "1-dars. Yuzliklar, o'nliklar va birliklar",
    ru: 'Урок 1. Сотни, десятки и единицы',
    en: 'Lesson 1. Hundreds, tens and ones',
  },
  draft: true,

  // Сцена-обрамление: одна на урок, стоит на экранах 1 и 15 (§1.3).
  // Компонент появится в scenes/Dars01/.
  scenes: {},

  screens: [
    // ---------------------------------------------------------------- 1 hook
    {
      id: 's1',
      role: 'problem',
      interaction: 'mc',
      scene: 'LumoCityScene',
      goal: 'Показать препятствие: огней сотни, считать по одному невозможно.',
      optionCols: 3,
      // Верный ответ не подтверждается словом: сцена переходит в собранное
      // состояние, и ребёнок видит следствие своего решения (§3.4).
      correct: 1,
      options: [
        { uz: 'Bittalab', ru: 'По одному', en: 'One by one' },
        { uz: "Yuzlab yig'ib", ru: 'Собирать по сто', en: 'In hundreds' },
        { uz: 'Bilmayman', ru: 'Не знаю', en: "I don't know" },
      ],
      eyebrow: { uz: 'Missiya', ru: 'Миссия', en: 'Mission' },
      topic: {
        uz: "Mavzu: yuzliklar, o'nliklar va birliklar",
        ru: 'Тема: сотни, десятки и единицы',
        en: 'Topic: hundreds, tens and ones',
      },
      lead: {
        uz: "Kema Bitning sayyorasiga qo'ndi. Bu Lumo.",
        ru: 'Корабль сел на планету Бита. Это Лумо.',
        en: "The ship landed on Bit's planet. This is Lumo.",
      },
      q: {
        uz: "Shahar chiroqlarini qanday tez sanaymiz?",
        ru: 'Как быстро сосчитать огни города?',
        en: 'How can we count the city lights quickly?',
      },
      audio: {
        intro: {
          uz: [
            "Bugun yuzliklar, o'nliklar va birliklar qanday tuzilganini bilib olamiz.",
            "O'tgan safar biz Bitni uyiga yetkazdik. Kema Lumoga qo'ndi.",
            "Bit o'z shahrini ko'rsatmoqda. Bu yerda chiroqlar juda ko'p, yuzlab.",
            "Ularni bittalab sanash uzoq. Tezroq yo'l kerak.",
          ],
          ru: [
            'Сегодня узнаем, как устроены сотни, десятки и единицы.',
            'В прошлый раз мы довезли Бита домой. Корабль сел на Лумо.',
            'Бит показывает свой город. Огней здесь очень много, целые сотни.',
            'Считать их по одному долго. Нужен способ быстрее.',
          ],
          en: [
            'Today we find out how hundreds, tens and ones are built.',
            'Last time we brought Bit home. The ship landed on Lumo.',
            'Bit is showing his city. There are very many lights here, hundreds of them.',
            'Counting them one by one takes long. We need a faster way.',
          ],
        },
        on_correct: {
          uz: "To'g'ri fikr. Yuzlab yig'amiz, va hammasi ko'rinadi.",
          ru: 'Верная мысль. Соберём по сто, и всё станет видно.',
          en: 'Good thinking. We will gather them in hundreds, and it will all show.',
        },
        on_wrong: [
          {
            uz: "Bunday bo'ladi, lekin juda uzoq. Shaharda tezroq yo'l bor.",
            ru: 'Так можно, но это очень долго. В городе есть путь быстрее.',
            en: 'You can, but it takes very long. The city has a faster way.',
          },
          null,
          {
            uz: "Hechqisi yo'q. Hozir Bit qanday qilishini ko'ramiz.",
            ru: 'Ничего страшного. Сейчас увидим, как это делает Бит.',
            en: 'That is fine. Now we will see how Bit does it.',
          },
        ],
      },
    },

    // --------------------------------------------------------- 2 recall (72)
    {
      id: 's2',
      role: 'recall',
      goal: 'Оживить опору 2 класса: 72 = 7 десятков и 2 единицы.',
      placeLabels: PLACE_LABELS,
      // Три стадии = три сегмента озвучки (§3.1).
      stages: [
        {
          visual: { type: 'units', place: 'tens', count: 7 },
          caption: { uz: "7 o'nlik", ru: '7 десятков', en: '7 tens' },
        },
        {
          visual: { type: 'units', place: 'ones', count: 2 },
          caption: { uz: '2 birlik', ru: '2 единицы', en: '2 ones' },
        },
        {
          visual: { type: 'razryad', t: 7, o: 2, mode: 'concrete' },
          caption: { uz: "72 = 7 o'nlik va 2 birlik", ru: '72 = 7 десятков и 2 единицы', en: '72 = 7 tens and 2 ones' },
        },
      ],
      eyebrow: { uz: 'Eslaymiz', ru: 'Вспомним', en: 'Recall' },
      lead: {
        uz: "O'nlik va birlik sizga tanish.",
        ru: 'Десятки и единицы тебе знакомы.',
        en: 'Tens and ones are familiar to you.',
      },
      audio: {
        intro: {
          uz: [
            "Avval sizga ikkinchi sinfdan tanish narsadan boshlaymiz.",
            "Yetmish ikkida yetti o'nlik bor, bu yetti lenta.",
            "Va yana ikki chiroq, bu ikki birlik. Hammasi birga, yetmish ikki.",
          ],
          ru: [
            'Начнём с того, что ты уже знаешь со второго класса.',
            'В числе семьдесят два семь десятков, это семь лент.',
            'И ещё два огонька, это две единицы. Всё вместе, семьдесят два.',
          ],
          en: [
            'We start with something you already know from year two.',
            'In seventy two there are seven tens, that is seven ribbons.',
            'And two more lights, that is two ones. All together, seventy two.',
          ],
        },
      },
      doneText: {
        uz: 'Barakalla, buni siz bilasiz. Keyingisiga o\'tamiz.',
        ru: 'Верно, это ты помнишь. Идём дальше.',
        en: 'Right, you remember this. Let us move on.',
      },
    },

    // ------------------------------------------- 3 concrete_model (unitizing)
    {
      id: 's3',
      role: 'concrete_model',
      goal: 'Десять десятков собираются в одну сотню. Это ядро урока.',
      placeLabels: PLACE_LABELS,
      stages: [
        {
          visual: { type: 'units', place: 'tens', count: 10, columns: 2 },
          caption: { uz: "10 o'nlik", ru: '10 десятков', en: '10 tens' },
        },
        {
          visual: { type: 'units', place: 'hundreds', count: 1 },
          caption: { uz: '1 yuzlik', ru: '1 сотня', en: '1 hundred' },
        },
        {
          visual: { type: 'razryad', h: 1, mode: 'concrete' },
          caption: { uz: "10 o'nlik = 1 yuzlik", ru: '10 десятков = 1 сотня', en: '10 tens = 1 hundred' },
        },
      ],
      eyebrow: { uz: 'Kashfiyot', ru: 'Открытие', en: 'Discovery' },
      lead: {
        uz: "O'nlikdan yuzlikka.",
        ru: 'От десятков к сотне.',
        en: 'From tens to a hundred.',
      },
      audio: {
        intro: {
          uz: [
            "O'nlab sanash tez. Lekin Bit shahrida o'nliklar juda ko'p.",
            "O'nta o'nlikni birga to'playmiz. Har o'nlik, bitta lenta.",
            "Qarang, nima bo'ldi. O'nta o'nlik bitta yuzlik bo'ldi.",
          ],
          ru: [
            'Считать десятками быстро. Но в городе Бита десятков очень много.',
            'Соберём десять десятков вместе. Каждый десяток, это одна лента.',
            'Смотри, что получилось. Десять десятков стали одной сотней.',
          ],
          en: [
            'Counting in tens is fast. But Bit\'s city has very many tens.',
            'We gather ten tens together. Each ten is one ribbon.',
            'Look what happened. Ten tens became one hundred.',
          ],
        },
      },
      doneText: {
        uz: "Bitta bunday panelni yuzlik deymiz. Yuzlik, bu yuzta birga.",
        ru: 'Одну такую панель называем сотня. Сотня, это сто вместе.',
        en: 'We call one such panel a hundred. A hundred is one hundred together.',
      },
    },

    // ------------------------------- 4 second_model (разложение + примеры)
    {
      id: 's4',
      role: 'second_model',
      goal: 'Число как сумма разрядов: 345 = 300 + 40 + 5. Три способа показа.',
      placeLabels: PLACE_LABELS,
      stages: [
        {
          visual: { type: 'bignum', value: 345 },
          caption: { uz: 'Uch yuz qirq besh', ru: 'Триста сорок пять', en: 'Three hundred and forty five' },
        },
        {
          visual: { type: 'razryad', h: 3, t: 4, o: 5, mode: 'digits' },
          caption: { uz: "3 yuzlik, 4 o'nlik, 5 birlik", ru: '3 сотни, 4 десятка, 5 единиц', en: '3 hundreds, 4 tens, 5 ones' },
        },
        {
          visual: { type: 'place', h: 3, t: 4, o: 5 },
          caption: { uz: '300 + 40 + 5', ru: '300 + 40 + 5', en: '300 + 40 + 5' },
        },
        {
          visual: { type: 'bignum', value: 345, accent: true },
          caption: { uz: '345 = 300 + 40 + 5', ru: '345 = 300 + 40 + 5', en: '345 = 300 + 40 + 5' },
        },
      ],
      // §3.2 — примеры с решениями. Два из трёх с нулём в разряде: это работа
      // против M3 ЗАРАНЕЕ, до того как ребёнок ошибётся на тесте.
      workedExamples: [
        { n: 528, parts: [500, 20, 8] },
        { n: 703, parts: [700, 0, 3] },
        { n: 640, parts: [600, 40, 0] },
      ],
      workedExamplesTitle: {
        uz: 'Yana misollar, qanday ishlaydi',
        ru: 'Ещё примеры, как это работает',
        en: 'More examples, how it works',
      },
      eyebrow: { uz: 'Ikki usul', ru: 'Два способа', en: 'Two ways' },
      lead: {
        uz: "Sonni razryadlarga ajratamiz.",
        ru: 'Разложим число по разрядам.',
        en: 'Let us split the number into places.',
      },
      audio: {
        intro: {
          uz: [
            "Uch yuz qirq besh sonini olamiz. Uni razryadlarga ajratamiz.",
            "Birinchi usul, razryad jadvali. Har raqam o'z o'rniga turadi.",
            "Ikkinchi usul, yoyilma. Uch yuz, qirq va besh.",
            "Ikki usul ham bitta son haqida. Raqamning o'rni uning qiymatini aytadi.",
          ],
          ru: [
            'Возьмём число триста сорок пять. Разберём его по разрядам.',
            'Первый способ, разрядная таблица. Каждая цифра встаёт на своё место.',
            'Второй способ, разложение. Триста, сорок и пять.',
            'Оба способа про одно число. Место цифры говорит, сколько она значит.',
          ],
          en: [
            'Let us take three hundred and forty five. We will split it into places.',
            'The first way is a place table. Each digit stands in its own place.',
            'The second way is expanding. Three hundred, forty and five.',
            'Both ways are about one number. The place of a digit tells its value.',
          ],
        },
      },
      doneText: {
        uz: "Nolli misollarga qarang. Nol ham o'z o'rnini egallaydi.",
        ru: 'Посмотри на примеры с нулём. Ноль тоже занимает своё место.',
        en: 'Look at the examples with zero. Zero also takes its own place.',
      },
    },

    // ------------------------------------------ 5 discovery (место решает)
    {
      id: 's5',
      role: 'discovery',
      goal: 'Те же цифры, разные числа: 345 / 435 / 543. Место задаёт значение.',
      placeLabels: PLACE_LABELS,
      // M1 разбирается здесь наглядно: цифры не меняются, число меняется.
      stages: [
        {
          visual: { type: 'razryad', h: 3, t: 4, o: 5, mode: 'digits' },
          caption: { uz: '345', ru: '345', en: '345' },
        },
        {
          visual: { type: 'razryad', h: 4, t: 3, o: 5, mode: 'digits' },
          caption: { uz: '435', ru: '435', en: '435' },
        },
        {
          visual: { type: 'razryad', h: 5, t: 4, o: 3, mode: 'digits' },
          caption: { uz: '543', ru: '543', en: '543' },
        },
      ],
      eyebrow: { uz: "O'rin hal qiladi", ru: 'Место решает', en: 'Place decides' },
      lead: {
        uz: "Bir xil raqamlar, boshqa sonlar.",
        ru: 'Одни и те же цифры, разные числа.',
        en: 'The same digits, different numbers.',
      },
      audio: {
        intro: {
          uz: [
            "Xuddi shu uchta raqamni olamiz, uch, to'rt va besh.",
            "Ularni boshqacha qo'yamiz. To'rt yuz o'ttiz besh chiqdi.",
            "Yana bir marta. Besh yuz qirq uch. Raqamlar bir xil, sonlar boshqa.",
          ],
          ru: [
            'Возьмём те же три цифры, три, четыре и пять.',
            'Поставим их иначе. Получилось четыреста тридцать пять.',
            'И ещё раз. Пятьсот сорок три. Цифры те же, а числа разные.',
          ],
          en: [
            'Let us take the same three digits, three, four and five.',
            'We place them differently. We got four hundred and thirty five.',
            'Once more. Five hundred and forty three. Same digits, different numbers.',
          ],
        },
      },
      doneText: {
        uz: "Demak, qaysi raqam ekani emas, qayerda turgani ham muhim.",
        ru: 'Значит, важно не только какие цифры, но и где они стоят.',
        en: 'So it matters not only which digits, but also where they stand.',
      },
    },

    // -------------------------------------- 6 discovery_line (числовая прямая)
    {
      id: 's6',
      role: 'discovery_line',
      interaction: 'numline_point',
      goal: 'Найти 470 на прямой 300–800: сначала предсказание, потом проверка.',
      // §3.4 предсказание до анимации: ребёнок ставит метку, ПОТОМ маркер идёт
      // сам — одна арка по сотне до 400, затем семь по десятку до 470.
      numberLine: { min: 300, max: 800, step: 100, target: 470 },
      eyebrow: { uz: "Son o'qida", ru: 'На числовой прямой', en: 'On the number line' },
      lead: {
        uz: "Sonlar o'z joyida turadi.",
        ru: 'У каждого числа своё место.',
        en: 'Every number has its own place.',
      },
      q: {
        uz: "To'rt yuz yetmish qayerda? Bosib ko'rsating.",
        ru: 'Где находится четыреста семьдесят? Нажми и покажи.',
        en: 'Where is four hundred and seventy? Tap and show.',
      },
      audio: {
        // Первый сегмент — большие прыжки, второй — малые: голос идёт вместе с маркером.
        intro: {
          uz: [
            "Uch yuzdan to'rt yuzga bitta katta qadam, yuzta.",
            "Keyin yettita kichik qadam, har biri o'nta. Mana to'rt yuz yetmish.",
          ],
          ru: [
            'От трёхсот до четырёхсот один большой шаг, целая сотня.',
            'Потом семь маленьких шагов, по десятку каждый. Вот четыреста семьдесят.',
          ],
          en: [
            'From three hundred to four hundred is one big step, a whole hundred.',
            'Then seven small steps, ten each. Here is four hundred and seventy.',
          ],
        },
      },
      doneText: {
        uz: "Yaxshi. Sonni yuzlab, keyin o'nlab topish oson.",
        ru: 'Хорошо. Число легко найти сначала сотнями, потом десятками.',
        en: 'Good. It is easy to find a number by hundreds first, then by tens.',
      },
      info: {
        uz: "Sonlar o'qda chapdan o'ngga o'sadi.",
        ru: 'На прямой числа растут слева направо.',
        en: 'On the line numbers grow from left to right.',
      },
      infoBadge: { uz: 'Foydali', ru: 'Полезно', en: 'Useful' },
    },

    // ----------------------------------------- 7 bridge (10 сотен = 1000)
    {
      id: 's7',
      role: 'bridge',
      goal: 'Мостик вперёд: десять сотен дают тысячу. Разбирает M4.',
      placeLabels: PLACE_LABELS,
      stages: [
        {
          visual: { type: 'units', place: 'hundreds', count: 10, columns: 5 },
          caption: { uz: '10 yuzlik', ru: '10 сотен', en: '10 hundreds' },
        },
        {
          visual: { type: 'bignum', value: 1000, accent: true },
          caption: { uz: '10 yuzlik = 1000', ru: '10 сотен = 1000', en: '10 hundreds = 1000' },
        },
      ],
      eyebrow: { uz: "Oldinga qarab", ru: 'Заглянем вперёд', en: 'A look ahead' },
      lead: {
        uz: "Yuzliklarni ham yig'ish mumkin.",
        ru: 'Сотни тоже можно собирать.',
        en: 'Hundreds can be gathered too.',
      },
      audio: {
        intro: {
          uz: [
            "O'nta o'nlik yuzlik bo'lgandi. Endi o'nta yuzlikni yig'amiz.",
            "Ming chiqdi. Bu keyingi darsda kerak bo'ladi.",
          ],
          ru: [
            'Десять десятков стали сотней. Теперь соберём десять сотен.',
            'Получилась тысяча. Она пригодится на следующем уроке.',
          ],
          en: [
            'Ten tens became a hundred. Now we gather ten hundreds.',
            'We got a thousand. It will be useful in the next lesson.',
          ],
        },
      },
      doneText: {
        uz: "O'nta o'nlik yuzlik, o'nta yuzlik ming. Har qadam o'n marta katta.",
        ru: 'Десять десятков сотня, десять сотен тысяча. Каждый шаг в десять раз больше.',
        en: 'Ten tens a hundred, ten hundreds a thousand. Each step is ten times bigger.',
      },
    },

    // ----------------------------------------------------------- 8 ПРАВИЛО
    {
      id: 's8',
      role: 'rule',
      goal: 'Правило открывается ПОСЛЕ ответа ребёнка (§3.3).',
      placeLabels: PLACE_LABELS,
      // Подписи разрядов скрыты как «?». Ребёнок тапает нужный столбец.
      // Вопрос отвечается из наблюдений экранов 4 и 5, а не из знания правила.
      visual: { type: 'razryad', h: 3, t: 4, o: 5, mode: 'digits' },
      correctCell: 'h',
      eyebrow: { uz: 'Asosiy qoida', ru: 'Главное правило', en: 'The main rule' },
      checkQ: {
        uz: "Qaysi ustundagi raqam eng katta qiymat beradi? Ustunni bosing.",
        ru: 'В каком столбце цифра даёт самое большое значение? Нажми на столбец.',
        en: 'In which column does a digit give the largest value? Tap the column.',
      },
      checkOk: {
        uz: "Ha. Chapdagi ustun yuzliklar, u eng kattasini beradi.",
        ru: 'Да. Левый столбец это сотни, он даёт самое большое.',
        en: 'Yes. The left column is hundreds, it gives the largest.',
      },
      checkNo: {
        uz: "Beshinchi ekranni eslang: raqamlar bir xil edi, o'rin o'zgardi.",
        ru: 'Вспомни пятый экран: цифры были те же, менялось место.',
        en: 'Recall screen five: the digits were the same, the place changed.',
      },
      rule: {
        uz: "Uch xonali sonda raqamning o'rni uning qiymatini belgilaydi: chapda yuzlik, o'rtada o'nlik, o'ngda birlik.",
        ru: 'В трёхзначном числе место цифры задаёт её значение: слева сотни, в середине десятки, справа единицы.',
        en: 'In a three digit number the place of a digit sets its value: hundreds on the left, tens in the middle, ones on the right.',
      },
      audio: {
        // Сегменты правила стоят на on_event:answered и молчат до ответа (§3.3).
        rule: {
          uz: [
            "Endi qoidani aytamiz. Raqamning o'rni uning qiymatini belgilaydi.",
            "Chapda yuzlik turadi, o'rtada o'nlik, o'ngda birlik.",
            "Shuning uchun uch yuz qirq besh va to'rt yuz o'ttiz besh boshqa sonlar.",
          ],
          ru: [
            'Теперь назовём правило. Место цифры задаёт её значение.',
            'Слева стоят сотни, в середине десятки, справа единицы.',
            'Поэтому триста сорок пять и четыреста тридцать пять разные числа.',
          ],
          en: [
            'Now let us name the rule. The place of a digit sets its value.',
            'Hundreds stand on the left, tens in the middle, ones on the right.',
            'That is why three hundred forty five and four hundred thirty five are different numbers.',
          ],
        },
      },
    },

    // ------------------------------------------- 9 guided_practice (сборка)
    {
      id: 's9',
      role: 'guided_practice',
      interaction: 'build_number',
      goal: 'Собрать заданное число разрядной консолью. Опора сильная.',
      placeLabels: PLACE_LABELS,
      eyebrow: { uz: 'Birga mashq', ru: 'Упражняемся вместе', en: 'Practise together' },
      // 530 и 407 выбраны намеренно: ноль в единицах и ноль в десятках. Ребёнок
      // впервые СОБИРАЕТ число с нулём, а не только читает его.
      rounds: [
        {
          target: 362,
          q: { uz: '362 sonini yig\'ing', ru: 'Собери число 362', en: 'Build the number 362' },
          audio: {
            intro: {
              uz: "Uch yuz oltmish ikkini yig'ing. Har razryadda plyusni bosing.",
              ru: 'Собери триста шестьдесят два. Нажимай плюс на каждом разряде.',
              en: 'Build three hundred and sixty two. Press plus on each place.',
            },
            on_correct: {
              uz: "To'g'ri. Uch yuzlik, olti o'nlik, ikki birlik.",
              ru: 'Верно. Три сотни, шесть десятков, две единицы.',
              en: 'Right. Three hundreds, six tens, two ones.',
            },
            on_wrong: [{
              uz: "Sonni chapdan o'qing: avval yuzlik, keyin o'nlik, keyin birlik.",
              ru: 'Читай число слева: сначала сотни, потом десятки, потом единицы.',
              en: 'Read the number from the left: hundreds first, then tens, then ones.',
            }],
          },
        },
        {
          target: 530,
          q: { uz: '530 sonini yig\'ing', ru: 'Собери число 530', en: 'Build the number 530' },
          audio: {
            intro: {
              uz: "Besh yuz o'ttiz. Birlik ustunida nechta bo'ladi?",
              ru: 'Пятьсот тридцать. Сколько будет в столбце единиц?',
              en: 'Five hundred and thirty. How many will be in the ones column?',
            },
            on_correct: {
              uz: "Ha. Birlik yo'q, shuning uchun oxirida nol turadi.",
              ru: 'Да. Единиц нет, поэтому в конце стоит ноль.',
              en: 'Yes. There are no ones, so a zero stands at the end.',
            },
            on_wrong: [{
              uz: "Besh yuz o'ttizda birlik bormi? Sanab ko'ring.",
              ru: 'Есть ли единицы в пятистах тридцати? Проверь на слух.',
              en: 'Are there any ones in five hundred and thirty? Listen again.',
            }],
          },
        },
        {
          target: 407,
          q: { uz: '407 sonini yig\'ing', ru: 'Собери число 407', en: 'Build the number 407' },
          audio: {
            intro: {
              uz: "To'rt yuz yetti. Bu yerda o'nlik ustuni bo'sh qoladi.",
              ru: 'Четыреста семь. Здесь столбец десятков останется пустым.',
              en: 'Four hundred and seven. Here the tens column will stay empty.',
            },
            on_correct: {
              uz: "To'g'ri. O'nlik yo'q, o'rtada nol turadi.",
              ru: 'Верно. Десятков нет, в середине стоит ноль.',
              en: 'Right. There are no tens, a zero stands in the middle.',
            },
            on_wrong: [{
              uz: "O'rtadagi ustunga qarang. To'rt yuz yettida o'nlik bormi?",
              ru: 'Посмотри на средний столбец. Есть ли десятки в четырёхстах семи?',
              en: 'Look at the middle column. Are there tens in four hundred and seven?',
            }],
          },
        },
      ],
      doneText: {
        uz: "Nol ham razryad. U bo'sh joyni saqlab turadi.",
        ru: 'Ноль тоже разряд. Он держит пустое место.',
        en: 'Zero is a place too. It holds the empty spot.',
      },
    },

    // ---------------------------------- 10 independent_practice (сколько чего)
    {
      id: 's10',
      role: 'independent_practice',
      interaction: 'mc_rounds',
      goal: 'Назвать состав числа без опоры. Неверные варианты — M1 и M2.',
      placeLabels: PLACE_LABELS,
      optionCols: 2,
      eyebrow: { uz: 'Mustaqil', ru: 'Самостоятельно', en: 'On your own' },
      // Неверные варианты не случайны: в каждом раунде один на M1 (перестановка
      // разрядов), один на M2 (сложение цифр вместо чтения по разрядам).
      rounds: [
        {
          q: {
            uz: '528 sonida nechta yuzlik, o\'nlik va birlik bor?',
            ru: 'Сколько сотен, десятков и единиц в числе 528?',
            en: 'How many hundreds, tens and ones are in 528?',
          },
          visual: { type: 'razryad', h: 5, t: 2, o: 8, mode: 'concrete' },
          correct: 0,
          options: [
            { uz: "5 yuzlik, 2 o'nlik, 8 birlik", ru: '5 сотен, 2 десятка, 8 единиц', en: '5 hundreds, 2 tens, 8 ones' },
            { uz: "8 yuzlik, 2 o'nlik, 5 birlik", ru: '8 сотен, 2 десятка, 5 единиц', en: '8 hundreds, 2 tens, 5 ones' },
            { uz: '15 birlik', ru: '15 единиц', en: '15 ones' },
          ],
          hints: [
            null,
            { uz: "Chapdagi raqamga qarang. U yuzlikni bildiradi.", ru: 'Посмотри на левую цифру. Она говорит о сотнях.', en: 'Look at the left digit. It tells the hundreds.' },
            { uz: "Raqamlarni qo'shmang. Har biri o'z razryadida turadi.", ru: 'Цифры не складывают. Каждая стоит в своём разряде.', en: 'Digits are not added. Each stands in its own place.' },
          ],
          audio: {
            intro: {
              uz: "Razryad jadvaliga qarang va javobni tanlang.",
              ru: 'Посмотри на разрядную таблицу и выбери ответ.',
              en: 'Look at the place table and choose the answer.',
            },
            on_correct: {
              uz: "Ha. Besh yuz yigirma sakkiz.",
              ru: 'Да. Пятьсот двадцать восемь.',
              en: 'Yes. Five hundred and twenty eight.',
            },
            on_wrong: [
              null,
              { uz: "Chapdagi raqamga qarang. U yuzlikni bildiradi.", ru: 'Посмотри на левую цифру. Она говорит о сотнях.', en: 'Look at the left digit. It tells the hundreds.' },
              { uz: "Raqamlarni qo'shmang. Har biri o'z razryadida turadi.", ru: 'Цифры не складывают. Каждая стоит в своём разряде.', en: 'Digits are not added. Each stands in its own place.' },
            ],
          },
        },
        {
          q: {
            uz: '806 sonida nechta yuzlik, o\'nlik va birlik bor?',
            ru: 'Сколько сотен, десятков и единиц в числе 806?',
            en: 'How many hundreds, tens and ones are in 806?',
          },
          visual: { type: 'razryad', h: 8, t: 0, o: 6, mode: 'concrete' },
          correct: 0,
          options: [
            { uz: "8 yuzlik, 0 o'nlik, 6 birlik", ru: '8 сотен, 0 десятков, 6 единиц', en: '8 hundreds, 0 tens, 6 ones' },
            { uz: "8 yuzlik, 6 o'nlik", ru: '8 сотен, 6 десятков', en: '8 hundreds, 6 tens' },
            { uz: '14 birlik', ru: '14 единиц', en: '14 ones' },
          ],
          hints: [
            null,
            { uz: "O'rtadagi ustunga qarang. U bo'sh, lekin u ham bor.", ru: 'Посмотри на средний столбец. Он пустой, но он есть.', en: 'Look at the middle column. It is empty, but it is there.' },
            { uz: "Sakkiz va olti alohida razryadlarda turadi.", ru: 'Восемь и шесть стоят в разных разрядах.', en: 'Eight and six stand in different places.' },
          ],
          audio: {
            intro: {
              uz: "Bu sonda bitta ustun bo'sh. Diqqat bilan qarang.",
              ru: 'В этом числе один столбец пустой. Посмотри внимательно.',
              en: 'In this number one column is empty. Look carefully.',
            },
            on_correct: {
              uz: "To'g'ri. Sakkiz yuz olti, o'nlik yo'q.",
              ru: 'Верно. Восемьсот шесть, десятков нет.',
              en: 'Right. Eight hundred and six, no tens.',
            },
            on_wrong: [
              null,
              { uz: "O'rtadagi ustunga qarang. U bo'sh, lekin u ham bor.", ru: 'Посмотри на средний столбец. Он пустой, но он есть.', en: 'Look at the middle column. It is empty, but it is there.' },
              { uz: "Sakkiz va olti alohida razryadlarda turadi.", ru: 'Восемь и шесть стоят в разных разрядах.', en: 'Eight and six stand in different places.' },
            ],
          },
        },
        {
          q: {
            uz: '190 sonida nechta yuzlik, o\'nlik va birlik bor?',
            ru: 'Сколько сотен, десятков и единиц в числе 190?',
            en: 'How many hundreds, tens and ones are in 190?',
          },
          visual: { type: 'razryad', h: 1, t: 9, o: 0, mode: 'concrete' },
          correct: 0,
          options: [
            { uz: "1 yuzlik, 9 o'nlik, 0 birlik", ru: '1 сотня, 9 десятков, 0 единиц', en: '1 hundred, 9 tens, 0 ones' },
            { uz: "9 yuzlik, 1 o'nlik, 0 birlik", ru: '9 сотен, 1 десяток, 0 единиц', en: '9 hundreds, 1 ten, 0 ones' },
            { uz: "1 yuzlik, 9 birlik", ru: '1 сотня, 9 единиц', en: '1 hundred, 9 ones' },
          ],
          hints: [
            null,
            { uz: "Birinchi raqam bitta. Yuzlik bitta.", ru: 'Первая цифра единица. Значит сотня одна.', en: 'The first digit is one. So there is one hundred.' },
            { uz: "To'qqiz o'rtada turadi. Bu o'nlik, birlik emas.", ru: 'Девятка стоит в середине. Это десятки, не единицы.', en: 'The nine stands in the middle. Those are tens, not ones.' },
          ],
          audio: {
            intro: {
              uz: "Endi bo'sh ustun oxirida. Javobni tanlang.",
              ru: 'Теперь пустой столбец в конце. Выбери ответ.',
              en: 'Now the empty column is at the end. Choose the answer.',
            },
            on_correct: {
              uz: "Ha. Bir yuz to'qson, birlik yo'q.",
              ru: 'Да. Сто девяносто, единиц нет.',
              en: 'Yes. One hundred and ninety, no ones.',
            },
            on_wrong: [
              null,
              { uz: "Birinchi raqam bitta. Yuzlik bitta.", ru: 'Первая цифра единица. Значит сотня одна.', en: 'The first digit is one. So there is one hundred.' },
              { uz: "To'qqiz o'rtada turadi. Bu o'nlik, birlik emas.", ru: 'Девятка стоит в середине. Это десятки, не единицы.', en: 'The nine stands in the middle. Those are tens, not ones.' },
            ],
          },
        },
      ],
      doneText: {
        uz: "Har raqam o'z ustunida. O'rin qiymatni belgilaydi.",
        ru: 'Каждая цифра в своём столбце. Место задаёт значение.',
        en: 'Each digit in its own column. The place sets the value.',
      },
    },

    // ----------------------------------------- 11 НАЙДИ ОШИБКУ (новое, M3)
    {
      id: 's11',
      role: 'error_find',
      interaction: 'error_spot',
      goal: 'Найти пропущенный ноль в чужой записи. Прямая отработка M3.',
      // Ошибка НЕ случайная описка: это ровно та misconception, под которую
      // на экране 4 заранее показали 703 и 640 (§2.3).
      placeLabels: PLACE_LABELS,
      optionCols: 3,
      eyebrow: { uz: 'Xatoni toping', ru: 'Найди ошибку', en: 'Find the mistake' },
      // Ошибку делает Anvar, а не безымянный «кто-то»: ребёнку легче искать чужую
      // ошибку, чем признавать свою, и персонаж из канона делает это безопасным.
      // Во всех трёх раундах ошибка ОДНА И ТА ЖЕ — пропущенный ноль. Ребёнок
      // должен увидеть закономерность, а не три разных случая.
      //
      // ВНИМАНИЕ на два разбора ниже: «Прочитай 52. Это не пятьсот два» и
      // «Число 64 намного меньше шестисот сорока». Валидатор помечает цифру в
      // озвучке предупреждением, и здесь оно оправдано осознанно: весь смысл
      // упражнения в КОНТРАСТЕ между записью 52 и произнесённым «пятьсот два».
      // Напишешь словами — контраст исчезнет, и разбор потеряет смысл.
      // Не «исправлять» на слова.
      rounds: [
        {
          q: {
            uz: "Anvar «besh yuz ikki» ni 52 deb yozdi. Nima xato?",
            ru: 'Анвар записал «пятьсот два» как 52. Что не так?',
            en: 'Anvar wrote "five hundred and two" as 52. What is wrong?',
          },
          wrongWriting: 52,
          rightWriting: 502,
          visual: { type: 'razryad', h: 5, t: 0, o: 2, mode: 'concrete' },
          correct: 0,
          options: [
            { uz: "O'nlik o'rniga nol qo'ymadi", ru: 'Не поставил ноль в десятках', en: 'He left out the zero in the tens' },
            { uz: 'Raqamlarni almashtirib qo\'ydi', ru: 'Перепутал цифры местами', en: 'He swapped the digits' },
            { uz: "To'g'ri yozgan", ru: 'Записал правильно', en: 'He wrote it correctly' },
          ],
          hints: [
            null,
            { uz: "Raqamlar joyida. Yetmagan narsani izlang.", ru: 'Цифры на своих местах. Ищи то, чего не хватает.', en: 'The digits are in place. Look for what is missing.' },
            { uz: "52 ni o'qing. Bu besh yuz ikki emas.", ru: 'Прочитай 52. Это не пятьсот два.', en: 'Read 52. That is not five hundred and two.' },
          ],
          audio: {
            intro: {
              uz: "Anvar sonni yozdi, lekin nimadir yetmaydi. Jadvalga qarang.",
              ru: 'Анвар записал число, но чего-то не хватает. Посмотри на таблицу.',
              en: 'Anvar wrote the number, but something is missing. Look at the table.',
            },
            on_correct: {
              uz: "Ha. O'nlik yo'q, lekin uning o'rni bor. Nol o'rinni saqlaydi.",
              ru: 'Да. Десятков нет, но их место есть. Ноль держит это место.',
              en: 'Yes. There are no tens, but their place exists. Zero holds that place.',
            },
            on_wrong: [
              null,
              { uz: "Raqamlar joyida. Yetmagan narsani izlang.", ru: 'Цифры на своих местах. Ищи то, чего не хватает.', en: 'The digits are in place. Look for what is missing.' },
              { uz: "52 ni o'qing. Bu besh yuz ikki emas.", ru: 'Прочитай 52. Это не пятьсот два.', en: 'Read 52. That is not five hundred and two.' },
            ],
          },
        },
        {
          q: {
            uz: "Yana bir yozuv: «uch yuz yetti» va 37. Nima xato?",
            ru: 'Ещё запись: «триста семь» и 37. Что не так?',
            en: 'Another writing: "three hundred and seven" and 37. What is wrong?',
          },
          wrongWriting: 37,
          rightWriting: 307,
          visual: { type: 'razryad', h: 3, t: 0, o: 7, mode: 'concrete' },
          correct: 0,
          options: [
            { uz: "O'nlik o'rniga nol qo'ymadi", ru: 'Не поставил ноль в десятках', en: 'He left out the zero in the tens' },
            { uz: 'Yuzlikni juda kichik oldi', ru: 'Взял слишком мало сотен', en: 'He took too few hundreds' },
            { uz: 'Yetti oxirida turmasligi kerak', ru: 'Семёрка не должна быть в конце', en: 'The seven should not be at the end' },
          ],
          hints: [
            null,
            { uz: "Yuzlik uchta, bu to'g'ri. Boshqa joyga qarang.", ru: 'Сотен три, это верно. Смотри в другое место.', en: 'There are three hundreds, that is right. Look elsewhere.' },
            { uz: "Yetti birlik, uning joyi oxirida. Xato boshqa joyda.", ru: 'Семь единиц, их место в конце. Ошибка в другом.', en: 'Seven ones belong at the end. The mistake is elsewhere.' },
          ],
          audio: {
            intro: {
              uz: "Xato o'sha xil. Qaysi ustun bo'sh qolganini toping.",
              ru: 'Ошибка того же рода. Найди, какой столбец остался пустым.',
              en: 'The same kind of mistake. Find which column was left empty.',
            },
            on_correct: {
              uz: "To'g'ri. Bo'sh o'nlik ham yozuvda ko'rinishi kerak.",
              ru: 'Верно. Пустые десятки тоже должны быть видны в записи.',
              en: 'Right. Empty tens must also show up in the writing.',
            },
            on_wrong: [
              null,
              { uz: "Yuzlik uchta, bu to'g'ri. Boshqa joyga qarang.", ru: 'Сотен три, это верно. Смотри в другое место.', en: 'There are three hundreds, that is right. Look elsewhere.' },
              { uz: "Yetti birlik, uning joyi oxirida. Xato boshqa joyda.", ru: 'Семь единиц, их место в конце. Ошибка в другом.', en: 'Seven ones belong at the end. The mistake is elsewhere.' },
            ],
          },
        },
        {
          q: {
            uz: "Oxirgisi: «olti yuz qirq» va 64. Nima xato?",
            ru: 'Последняя: «шестьсот сорок» и 64. Что не так?',
            en: 'The last one: "six hundred and forty" and 64. What is wrong?',
          },
          wrongWriting: 64,
          rightWriting: 640,
          visual: { type: 'razryad', h: 6, t: 4, o: 0, mode: 'concrete' },
          correct: 0,
          options: [
            { uz: 'Birlik o\'rniga nol qo\'ymadi', ru: 'Не поставил ноль в единицах', en: 'He left out the zero in the ones' },
            { uz: "O'nlik o'rniga nol qo'ymadi", ru: 'Не поставил ноль в десятках', en: 'He left out the zero in the tens' },
            { uz: "To'g'ri yozgan", ru: 'Записал правильно', en: 'He wrote it correctly' },
          ],
          hints: [
            null,
            { uz: "Bu safar bo'sh ustun oxirida, o'rtada emas.", ru: 'На этот раз пустой столбец в конце, а не в середине.', en: 'This time the empty column is at the end, not the middle.' },
            { uz: "64 olti yuz qirqdan ancha kichik. Sanab ko'ring.", ru: 'Число 64 намного меньше шестисот сорока. Сравни.', en: 'The number 64 is much smaller than six hundred and forty. Compare.' },
          ],
          audio: {
            intro: {
              uz: "Diqqat: bu yerda bo'sh ustun boshqa joyda turadi.",
              ru: 'Внимание: здесь пустой столбец стоит в другом месте.',
              en: 'Careful: here the empty column stands in a different place.',
            },
            on_correct: {
              uz: "Ha. Nol oxirida turgani sonni o'n marta kattalashtiradi.",
              ru: 'Да. Ноль в конце делает число в десять раз больше.',
              en: 'Yes. A zero at the end makes the number ten times bigger.',
            },
            on_wrong: [
              null,
              { uz: "Bu safar bo'sh ustun oxirida, o'rtada emas.", ru: 'На этот раз пустой столбец в конце, а не в середине.', en: 'This time the empty column is at the end, not the middle.' },
              { uz: "64 olti yuz qirqdan ancha kichik. Sanab ko'ring.", ru: 'Число 64 намного меньше шестисот сорока. Сравни.', en: 'The number 64 is much smaller than six hundred and forty. Compare.' },
            ],
          },
        },
      ],
      doneText: {
        uz: "Uch xatoning uchtasi ham bitta: nol tushib qolgan. Nol o'rinni saqlaydi.",
        ru: 'Все три ошибки одна и та же: пропал ноль. Ноль держит место.',
        en: 'All three mistakes are the same one: a zero went missing. Zero holds the place.',
      },
    },

    // ------------------------------------- 12 ОБРАТНАЯ ЗАДАЧА (новое)
    {
      id: 's12',
      role: 'reverse_task',
      interaction: 'family_find',
      goal: 'Из разложения восстановить число. Разворот экрана 4.',
      // На экране 4 число превращалось в разложение. Здесь наоборот: дано
      // разложение, нужно вернуть число (§2.4).
      placeLabels: PLACE_LABELS,
      optionCols: 3,
      eyebrow: { uz: 'Teskari yo\'l', ru: 'Обратный путь', en: 'The way back' },
      // Неверные варианты здесь другого рода, чем на экране 10: главный из них —
      // приписать части подряд (500, 20, 8 -> 5208) вместо сложения по разрядам.
      // Второй и третий раунд снова про пропавший ноль, но уже в обратную сторону:
      // ребёнок не находит чужую ошибку, а сам не должен её сделать.
      rounds: [
        {
          q: {
            uz: "500 + 20 + 8. Bu qaysi son?",
            ru: '500 + 20 + 8. Какое это число?',
            en: '500 + 20 + 8. Which number is this?',
          },
          decomposition: [500, 20, 8],
          answerNumber: 528,
          visual: { type: 'place', h: 5, t: 2, o: 8 },
          correct: 0,
          options: [
            { uz: '528', ru: '528', en: '528' },
            { uz: '5208', ru: '5208', en: '5208' },
            { uz: '852', ru: '852', en: '852' },
          ],
          hints: [
            null,
            { uz: "Qismlarni yonma-yon yozmang, ularni qo'shing.", ru: 'Части не приписывают подряд, их складывают.', en: 'The parts are not written side by side, they are added.' },
            { uz: "Yuzlik chapda qoladi. Tartibni o'zgartirmang.", ru: 'Сотни остаются слева. Порядок не меняется.', en: 'Hundreds stay on the left. The order does not change.' },
          ],
          audio: {
            intro: {
              uz: "Oldin sonni qismlarga ajratdik. Endi orqaga qaytamiz.",
              ru: 'Раньше мы делили число на части. Теперь пойдём обратно.',
              en: 'Before we split a number into parts. Now we go back.',
            },
            on_correct: {
              uz: "Ha. Besh yuz, yigirma va sakkiz birga besh yuz yigirma sakkiz.",
              ru: 'Да. Пятьсот, двадцать и восемь вместе дают пятьсот двадцать восемь.',
              en: 'Yes. Five hundred, twenty and eight together give five hundred and twenty eight.',
            },
            on_wrong: [
              null,
              { uz: "Qismlarni yonma-yon yozmang, ularni qo'shing.", ru: 'Части не приписывают подряд, их складывают.', en: 'The parts are not written side by side, they are added.' },
              { uz: "Yuzlik chapda qoladi. Tartibni o'zgartirmang.", ru: 'Сотни остаются слева. Порядок не меняется.', en: 'Hundreds stay on the left. The order does not change.' },
            ],
          },
        },
        {
          q: {
            uz: "700 + 0 + 3. Bu qaysi son?",
            ru: '700 + 0 + 3. Какое это число?',
            en: '700 + 0 + 3. Which number is this?',
          },
          decomposition: [700, 0, 3],
          answerNumber: 703,
          visual: { type: 'place', h: 7, t: 0, o: 3 },
          correct: 0,
          options: [
            { uz: '703', ru: '703', en: '703' },
            { uz: '73', ru: '73', en: '73' },
            { uz: '7003', ru: '7003', en: '7003' },
          ],
          hints: [
            null,
            { uz: "O'nlik nol, lekin uning o'rni yozuvda qoladi.", ru: 'Десятков ноль, но их место в записи остаётся.', en: 'There are zero tens, but their place stays in the writing.' },
            { uz: "Uch xonali son uchta raqamdan iborat.", ru: 'В трёхзначном числе три цифры.', en: 'A three digit number has three digits.' },
          ],
          audio: {
            intro: {
              uz: "Bu safar o'rtada nol turadi. Diqqat qiling.",
              ru: 'На этот раз в середине ноль. Будь внимателен.',
              en: 'This time there is a zero in the middle. Be careful.',
            },
            on_correct: {
              uz: "To'g'ri. Nol o'z o'rnini egallab turadi.",
              ru: 'Верно. Ноль занимает своё место.',
              en: 'Right. Zero takes its own place.',
            },
            on_wrong: [
              null,
              { uz: "O'nlik nol, lekin uning o'rni yozuvda qoladi.", ru: 'Десятков ноль, но их место в записи остаётся.', en: 'There are zero tens, but their place stays in the writing.' },
              { uz: "Uch xonali son uchta raqamdan iborat.", ru: 'В трёхзначном числе три цифры.', en: 'A three digit number has three digits.' },
            ],
          },
        },
        {
          q: {
            uz: "600 + 40 + 0. Bu qaysi son?",
            ru: '600 + 40 + 0. Какое это число?',
            en: '600 + 40 + 0. Which number is this?',
          },
          decomposition: [600, 40, 0],
          answerNumber: 640,
          visual: { type: 'place', h: 6, t: 4, o: 0 },
          correct: 0,
          options: [
            { uz: '640', ru: '640', en: '640' },
            { uz: '64', ru: '64', en: '64' },
            { uz: '604', ru: '604', en: '604' },
          ],
          hints: [
            null,
            { uz: "Birlik nol. Uni oxirida yozish kerak.", ru: 'Единиц ноль. Его нужно записать в конце.', en: 'There are zero ones. It must be written at the end.' },
            { uz: "Qirq bu o'nlik. U o'rtada turadi.", ru: 'Сорок это десятки. Они стоят в середине.', en: 'Forty means tens. They stand in the middle.' },
          ],
          audio: {
            intro: {
              uz: "Oxirgisi. Endi nol oxirida bo'ladi.",
              ru: 'Последнее. Теперь ноль будет в конце.',
              en: 'The last one. Now the zero will be at the end.',
            },
            on_correct: {
              uz: "Ha. Olti yuz qirq, birlik yo'q.",
              ru: 'Да. Шестьсот сорок, единиц нет.',
              en: 'Yes. Six hundred and forty, no ones.',
            },
            on_wrong: [
              null,
              { uz: "Birlik nol. Uni oxirida yozish kerak.", ru: 'Единиц ноль. Его нужно записать в конце.', en: 'There are zero ones. It must be written at the end.' },
              { uz: "Qirq bu o'nlik. U o'rtada turadi.", ru: 'Сорок это десятки. Они стоят в середине.', en: 'Forty means tens. They stand in the middle.' },
            ],
          },
        },
      ],
      doneText: {
        uz: "Sonni qismlarga ajratish va qaytarish, bu bitta yo'lning ikki tomoni.",
        ru: 'Разложить число и собрать обратно, это две стороны одного пути.',
        en: 'Splitting a number and putting it back are two sides of one path.',
      },
    },

    // ------------------------------------------- 13 case (жизненная задача)
    {
      id: 's13',
      role: 'life_problem',
      interaction: 'numpad',
      goal: 'Посчитать огни района Lumo. Ответ НАБИРАЕТСЯ, не выбирается.',
      // Проверка подлинности: убери огни и район — задание рассыплется.
      answer: 346,
      placeLabels: PLACE_LABELS,
      visual: { type: 'place', h: 3, t: 4, o: 6 },
      eyebrow: { uz: 'Hayotiy masala', ru: 'Задача из жизни', en: 'A real problem' },
      lead: {
        uz: "Bit shahar hududini ko'rsatmoqchi.",
        ru: 'Бит хочет показать район города.',
        en: 'Bit wants to show a district of the city.',
      },
      context: {
        uz: "Hududda 3 panel, 4 lenta va 6 chiroq bor. Bit jami sonni bilmoqchi.",
        ru: 'В районе 3 панели, 4 ленты и 6 огоньков. Бит хочет знать общее число.',
        en: 'The district has 3 panels, 4 ribbons and 6 lights. Bit wants the total.',
      },
      q: {
        uz: 'Hududda nechta chiroq bor?',
        ru: 'Сколько всего огней в районе?',
        en: 'How many lights are in the district?',
      },
      // §6.2 три ступени подсказки. Ни одна не даёт ответ: третья делает первый
      // шаг вместо ребёнка и оставляет ему завершение.
      escalation: [
        {
          uz: "Razryadlar bo'yicha sanang. Paneldan boshlang.",
          ru: 'Считай по разрядам. Начни с панелей.',
          en: 'Count by places. Start with the panels.',
        },
        {
          uz: "Panel yuzlik, lenta o'nlik, chiroq birlik. Har birini alohida.",
          ru: 'Панель это сотня, лента десяток, огонёк единица. Каждое отдельно.',
          en: 'A panel is a hundred, a ribbon a ten, a light a one. Each separately.',
        },
        {
          uz: "Uchta panel uch yuz beradi. Endi lenta va chiroqni qo'shing.",
          ru: 'Три панели дают триста. Теперь добавь ленты и огоньки.',
          en: 'Three panels give three hundred. Now add the ribbons and the lights.',
        },
      ],
      strongHint: {
        uz: "Uch yuz, keyin qirq, keyin olti. Yozib chiqing.",
        ru: 'Триста, потом сорок, потом шесть. Набери по порядку.',
        en: 'Three hundred, then forty, then six. Type them in order.',
      },
      audio: {
        intro: {
          uz: [
            "Bit hududni ko'rsatdi. Bu yerda panellar, lentalar va chiroqlar bor.",
            "Jami nechta chiroq ekanini hisoblang va raqam bilan yozing.",
          ],
          ru: [
            'Бит показал район. Здесь есть панели, ленты и огоньки.',
            'Посчитай, сколько всего огней, и набери число.',
          ],
          en: [
            'Bit showed the district. There are panels, ribbons and lights here.',
            'Work out how many lights in total and type the number.',
          ],
        },
        on_correct: {
          uz: "Ajoyib. Uch yuz qirq olti chiroq. Bit hududni ochdi.",
          ru: 'Отлично. Триста сорок шесть огней. Бит открыл район.',
          en: 'Excellent. Three hundred and forty six lights. Bit opened the district.',
        },
        on_wrong: {
          uz: "Yana bir bor. Panel, lenta va chiroqni alohida sanang.",
          ru: 'Ещё раз. Считай панели, ленты и огоньки по отдельности.',
          en: 'Once more. Count panels, ribbons and lights separately.',
        },
      },
      fact: {
        uz: "Lumo yulduzi qizil mitti. Bunday yulduzlar Quyoshdan xira, lekin yuz marta uzoq yashaydi.",
        ru: 'Звезда Лумо красный карлик. Такие звёзды тусклее Солнца, но живут в сотни раз дольше.',
        en: 'The star of Lumo is a red dwarf. Such stars are dimmer than the Sun but live hundreds of times longer.',
      },
      factBadge: { uz: 'Bilasizmi?', ru: 'Знаешь ли ты?', en: 'Did you know?' },
    },

    // -------------------------------------- 14 final_diagnostic (трансфер)
    {
      id: 's14',
      role: 'final_diagnostic',
      interaction: 'mc_rounds',
      goal: 'Новые числа, не встречавшиеся в уроке. Проверка переноса.',
      // §12 — итоговая диагностика не повторяет числа урока. Здесь 219, 905, 470
      // не использовались выше (470 был только как точка на прямой, без состава).
      placeLabels: PLACE_LABELS,
      optionCols: 2,
      eyebrow: { uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка', en: 'Final check' },
      // Числа 219, 905 и 470 по составу в уроке не разбирались: §12 требует, чтобы
      // диагностика не повторяла числа урока. Вопросы разные по типу — сколько
      // десятков, сколько десятков при нуле, какое разложение верно, — чтобы
      // проверялся перенос, а не запомненный ход одного задания.
      rounds: [
        {
          q: {
            uz: "219 sonida nechta o'nlik bor?",
            ru: 'Сколько десятков в числе 219?',
            en: 'How many tens are in 219?',
          },
          visual: { type: 'bignum', value: 219 },
          correct: 0,
          options: [
            { uz: '1', ru: '1', en: '1' },
            { uz: '2', ru: '2', en: '2' },
            { uz: '9', ru: '9', en: '9' },
          ],
          hints: [
            null,
            { uz: "Ikki chapda turadi, bu yuzlik.", ru: 'Двойка стоит слева, это сотни.', en: 'The two stands on the left, those are hundreds.' },
            { uz: "To'qqiz oxirida, bu birlik.", ru: 'Девятка в конце, это единицы.', en: 'The nine is at the end, those are ones.' },
          ],
          audio: {
            intro: {
              uz: "Yangi son. O'rta ustunga qarang.",
              ru: 'Новое число. Посмотри на средний столбец.',
              en: 'A new number. Look at the middle column.',
            },
            on_correct: { uz: "To'g'ri. O'rtada bir turadi.", ru: 'Верно. В середине стоит единица.', en: 'Right. A one stands in the middle.' },
            on_wrong: [
              null,
              { uz: "Ikki chapda turadi, bu yuzlik.", ru: 'Двойка стоит слева, это сотни.', en: 'The two stands on the left, those are hundreds.' },
              { uz: "To'qqiz oxirida, bu birlik.", ru: 'Девятка в конце, это единицы.', en: 'The nine is at the end, those are ones.' },
            ],
          },
        },
        {
          q: {
            uz: "905 sonida nechta o'nlik bor?",
            ru: 'Сколько десятков в числе 905?',
            en: 'How many tens are in 905?',
          },
          visual: { type: 'bignum', value: 905 },
          correct: 0,
          options: [
            { uz: '0', ru: '0', en: '0' },
            { uz: '9', ru: '9', en: '9' },
            { uz: '5', ru: '5', en: '5' },
          ],
          hints: [
            null,
            { uz: "To'qqiz chapda, bu yuzlik.", ru: 'Девятка слева, это сотни.', en: 'The nine is on the left, those are hundreds.' },
            { uz: "Besh oxirida, bu birlik. O'rtaga qarang.", ru: 'Пятёрка в конце, это единицы. Смотри в середину.', en: 'The five is at the end, those are ones. Look in the middle.' },
          ],
          audio: {
            intro: {
              uz: "Bu sonda o'rtada nol turadi. Javob ham nol bo'ladimi?",
              ru: 'В этом числе в середине ноль. Будет ли ответ нулём?',
              en: 'This number has a zero in the middle. Will the answer be zero?',
            },
            on_correct: { uz: "Ha. O'nlik yo'q, shuning uchun nol.", ru: 'Да. Десятков нет, поэтому ноль.', en: 'Yes. There are no tens, so zero.' },
            on_wrong: [
              null,
              { uz: "To'qqiz chapda, bu yuzlik.", ru: 'Девятка слева, это сотни.', en: 'The nine is on the left, those are hundreds.' },
              { uz: "Besh oxirida, bu birlik. O'rtaga qarang.", ru: 'Пятёрка в конце, это единицы. Смотри в середину.', en: 'The five is at the end, those are ones. Look in the middle.' },
            ],
          },
        },
        {
          q: {
            uz: '470 sonining yoyilmasi qaysi?',
            ru: 'Какое разложение числа 470 верно?',
            en: 'Which expansion of 470 is correct?',
          },
          visual: { type: 'bignum', value: 470 },
          correct: 0,
          options: [
            { uz: '400 + 70 + 0', ru: '400 + 70 + 0', en: '400 + 70 + 0' },
            { uz: '400 + 7 + 0', ru: '400 + 7 + 0', en: '400 + 7 + 0' },
            { uz: '4 + 70 + 0', ru: '4 + 70 + 0', en: '4 + 70 + 0' },
          ],
          hints: [
            null,
            { uz: "Yetti o'rtada turadi, demak u yetmish.", ru: 'Семёрка стоит в середине, значит это семьдесят.', en: 'The seven is in the middle, so it means seventy.' },
            { uz: "To'rt chapda turadi, demak u to'rt yuz.", ru: 'Четвёрка стоит слева, значит это четыреста.', en: 'The four is on the left, so it means four hundred.' },
          ],
          audio: {
            intro: {
              uz: "Oxirgi savol. Har raqam qancha qiymat berishini eslang.",
              ru: 'Последний вопрос. Вспомни, сколько значит каждая цифра.',
              en: 'The last question. Recall how much each digit means.',
            },
            on_correct: { uz: "Barakalla. O'rin qiymatni belgilaydi.", ru: 'Молодец. Место задаёт значение.', en: 'Well done. The place sets the value.' },
            on_wrong: [
              null,
              { uz: "Yetti o'rtada turadi, demak u yetmish.", ru: 'Семёрка стоит в середине, значит это семьдесят.', en: 'The seven is in the middle, so it means seventy.' },
              { uz: "To'rt chapda turadi, demak u to'rt yuz.", ru: 'Четвёрка стоит слева, значит это четыреста.', en: 'The four is on the left, so it means four hundred.' },
            ],
          },
        },
      ],
      doneText: {
        uz: "Siz yangi sonlarda ham o'rinni topdingiz. Bu eng muhimi.",
        ru: 'Даже в новых числах ты видишь место разрядов. Это самое главное.',
        en: 'You found the places even in new numbers. That is what matters most.',
      },
    },

    // ------------------------------------------------------- 15 summary
    {
      id: 's15',
      role: 'summary',
      // Та же сцена, что на экране 1, но препятствие снято (§1.3).
      scene: 'LumoCityScene',
      goal: 'Итог, правило-recap, факт-награда, мостик к уроку 2.',
      eyebrow: { uz: 'Yakun', ru: 'Итог', en: 'Summary' },
      lead: {
        uz: "Bit shahrini ko'rsatdi. Chiroqlarni yuzlab sanadingiz.",
        ru: 'Бит показал свой город, а ты умеешь считать огни сотнями.',
        en: 'Bit showed his city. You counted the lights in hundreds.',
      },
      // Правило-recap: ровно то, что ребёнок открыл сам на экране 8.
      rule: {
        uz: "Raqamning o'rni uning qiymatini belgilaydi: chapda yuzlik, o'rtada o'nlik, o'ngda birlik. Nol bo'sh o'rinni saqlaydi.",
        ru: 'Место цифры задаёт её значение: слева сотни, в середине десятки, справа единицы. Ноль держит пустое место.',
        en: 'The place of a digit sets its value: hundreds left, tens middle, ones right. Zero holds the empty place.',
      },
      ruleBadge: { uz: 'Eslab qoling', ru: 'Запомни', en: 'Remember' },
      praise: {
        uz: "Siz o'nlikdan yuzlikka, keyin mingga yetdingiz. Bir darsda uch pog'ona.",
        ru: 'От десятков к сотням, а потом к тысяче. Три ступени за один урок.',
        en: 'You went from tens to hundreds and reached a thousand. Three steps in one lesson.',
      },
      fact: {
        uz: "Lumoning qizil mitti yulduzi Quyoshdan kichik, lekin yuz marta uzoq yashaydi.",
        ru: 'Красный карлик Лумо меньше Солнца, но живёт в сотни раз дольше.',
        en: 'The red dwarf of Lumo is smaller than the Sun but lives hundreds of times longer.',
      },
      factBadge: { uz: 'Bilasizmi?', ru: 'Знаешь ли ты?', en: 'Did you know?' },
      // Мостик: одна фраза, продолжение сюжета, а не анонс программы.
      bridge: {
        uz: "Keyingi darsda Bit shahar nomlarini o'qishni o'rgatadi: son nomi va yozuvi.",
        ru: 'На следующем уроке Бит научит читать названия города: имя числа и его запись.',
        en: 'Next lesson Bit will teach reading the city names: a number name and its writing.',
      },
      bridgeBadge: { uz: 'Keyingi dars', ru: 'Следующий урок', en: 'Next lesson' },
      audio: {
        uz: [
          "Bugun siz yuzlik, o'nlik va birlikni ko'rdingiz.",
          "O'nta o'nlik yuzlik, o'nta yuzlik ming beradi.",
          "Eng muhimi: raqamning o'rni uning qiymatini belgilaydi.",
        ],
        ru: [
          'Сегодня мы увидели сотни, десятки и единицы.',
          'Десять десятков дают сотню, десять сотен дают тысячу.',
          'Самое главное: место цифры задаёт её значение.',
        ],
        en: [
          'Today you saw hundreds, tens and ones.',
          'Ten tens give a hundred, ten hundreds give a thousand.',
          'The main thing: the place of a digit sets its value.',
        ],
      },
    },
  ],
};

export default LESSON;
