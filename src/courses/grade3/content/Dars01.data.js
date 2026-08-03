// ============================================================================
// Dars01.data.js — СКЕЛЕТ УРОКА 1 (3 класс)
// Тема: сотни, десятки и единицы. Блок Б1, сюжет «Bit sayyorasi Lumo».
//
// СТАТУС: скелет. Роли, механики, числа и misconception'ы решены; тексты и
// озвучка ещё не написаны — поля с пометкой TODO. Валидатор сейчас справедливо
// падает на отсутствии локалей: это и есть список того, что осталось.
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

const TODO = { uz: '', ru: '', en: '' };   // помечает ненаписанный текст

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
        { visual: { type: 'razryad', h: 3, t: 4, o: 5, mode: 'digits' }, caption: TODO },
        { visual: { type: 'razryad', h: 4, t: 3, o: 5, mode: 'digits' }, caption: TODO },
        { visual: { type: 'razryad', h: 5, t: 4, o: 3, mode: 'digits' }, caption: TODO },
      ],
      eyebrow: TODO,
      lead: TODO,
      audio: { intro: TODO },   // TODO: 3 сегмента
      doneText: TODO,
    },

    // -------------------------------------- 6 discovery_line (числовая прямая)
    {
      id: 's6',
      role: 'discovery_line',
      interaction: 'numline_point',
      goal: 'Найти 470 на прямой 300–800: сначала предсказание, потом проверка.',
      // §3.4 предсказание до анимации: ребёнок ставит метку, ПОТОМ маркер идёт
      // сам — одна арка +100, затем семь по +10.
      numberLine: { min: 300, max: 800, step: 100, target: 470, arcs: [100, 10] },
      eyebrow: TODO,
      lead: TODO,
      q: TODO,
      audio: { intro: TODO, on_correct: TODO },
      doneText: TODO,
      info: TODO,
      infoBadge: TODO,
    },

    // ----------------------------------------- 7 bridge (10 сотен = 1000)
    {
      id: 's7',
      role: 'bridge',
      goal: 'Мостик вперёд: десять сотен дают тысячу. Разбирает M4.',
      placeLabels: PLACE_LABELS,
      stages: [
        { visual: { type: 'units', place: 'hundreds', count: 10, columns: 5 }, caption: TODO },
        { visual: { type: 'bignum', value: 1000, accent: true }, caption: TODO },
      ],
      eyebrow: TODO,
      lead: TODO,
      audio: { intro: TODO },   // TODO: 2 сегмента
      doneText: TODO,
    },

    // ----------------------------------------------------------- 8 ПРАВИЛО
    {
      id: 's8',
      role: 'rule',
      goal: 'Правило открывается ПОСЛЕ ответа ребёнка (§3.3).',
      placeLabels: PLACE_LABELS,
      // Подписи разрядов скрыты как «?». Ребёнок тапает нужный столбец.
      visual: { type: 'razryad', h: 3, t: 4, o: 5, mode: 'digits' },
      correctCell: 'h',
      eyebrow: TODO,
      checkQ: TODO,     // TODO: вопрос, ответ на который выводится из экранов 2–7
      checkOk: TODO,
      checkNo: TODO,
      rule: TODO,
      audio: { rule: TODO },   // TODO: сегменты правила, звучат на on_event:answered
    },

    // ------------------------------------------- 9 guided_practice (сборка)
    {
      id: 's9',
      role: 'guided_practice',
      interaction: 'build_number',
      goal: 'Собрать заданное число разрядной консолью. Опора сильная.',
      placeLabels: PLACE_LABELS,
      eyebrow: TODO,
      rounds: [
        { target: 362, q: TODO, audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO] } },
        { target: 530, q: TODO, audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO] } },
        { target: 407, q: TODO, audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO] } },
      ],
      doneText: TODO,
    },

    // ---------------------------------- 10 independent_practice (сколько чего)
    {
      id: 's10',
      role: 'independent_practice',
      interaction: 'mc_rounds',
      goal: 'Назвать состав числа без опоры. Неверные варианты — M1 и M2.',
      placeLabels: PLACE_LABELS,
      optionCols: 2,
      eyebrow: TODO,
      rounds: [
        {
          q: TODO,
          visual: { type: 'razryad', h: 5, t: 2, o: 8, mode: 'concrete' },
          options: [TODO, TODO, TODO],   // верный + M1 (перестановка) + M2 (сумма цифр)
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
        {
          q: TODO,
          visual: { type: 'razryad', h: 8, t: 0, o: 6, mode: 'concrete' },
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
        {
          q: TODO,
          visual: { type: 'razryad', h: 1, t: 9, o: 0, mode: 'concrete' },
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
      ],
      doneText: TODO,
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
      eyebrow: TODO,
      rounds: [
        {
          // «пятьсот два» записали как 52
          q: TODO,
          wrongWriting: 52,
          rightWriting: 502,
          visual: { type: 'razryad', h: 5, t: 0, o: 2, mode: 'concrete' },
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
        {
          q: TODO,
          wrongWriting: 37,
          rightWriting: 307,
          visual: { type: 'razryad', h: 3, t: 0, o: 7, mode: 'concrete' },
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
        {
          q: TODO,
          wrongWriting: 64,
          rightWriting: 640,
          visual: { type: 'razryad', h: 6, t: 4, o: 0, mode: 'concrete' },
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
      ],
      doneText: TODO,
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
      eyebrow: TODO,
      rounds: [
        {
          q: TODO,
          decomposition: [500, 20, 8],
          answerNumber: 528,
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
        {
          q: TODO,
          decomposition: [700, 0, 3],
          answerNumber: 703,
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
        {
          q: TODO,
          decomposition: [600, 40, 0],
          answerNumber: 640,
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
      ],
      doneText: TODO,
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
      eyebrow: TODO,
      lead: TODO,
      context: TODO,
      q: TODO,
      // §6.2 три ступени подсказки, ни одна не даёт ответ.
      escalation: [TODO, TODO, TODO],
      strongHint: TODO,
      audio: { intro: TODO, on_correct: TODO, on_wrong: TODO },
      fact: TODO,
      factBadge: TODO,
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
      eyebrow: TODO,
      rounds: [
        {
          q: TODO,
          visual: { type: 'bignum', value: 219 },
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
        {
          q: TODO,
          visual: { type: 'bignum', value: 905 },
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
        {
          q: TODO,
          visual: { type: 'bignum', value: 470 },
          options: [TODO, TODO, TODO],
          correct: 0,
          hints: [TODO, TODO, TODO],
          audio: { intro: TODO, on_correct: TODO, on_wrong: [TODO, TODO, TODO] },
        },
      ],
      doneText: TODO,
    },

    // ------------------------------------------------------- 15 summary
    {
      id: 's15',
      role: 'summary',
      // Та же сцена, что на экране 1, но препятствие снято (§1.3).
      scene: 'LumoCityScene',
      goal: 'Итог, правило-recap, факт-награда, мостик к уроку 2.',
      eyebrow: TODO,
      lead: TODO,
      rule: TODO,
      ruleBadge: TODO,
      praise: TODO,
      fact: TODO,        // TODO: факт про красного карлика — район Lumo
      factBadge: TODO,
      bridge: TODO,      // TODO: одна фраза про урок 2 (чтение и запись чисел)
      bridgeBadge: TODO,
      audio: TODO,       // TODO: 3 сегмента
    },
  ],
};

export default LESSON;
