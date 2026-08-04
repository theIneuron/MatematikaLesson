// ============================================================================
// informatika3/content/Dars01.data.js — УРОК 1 ИНФОРМАТИКИ, 3 КЛАСС
// Тема: что такое компьютер. Первый урок нового предмета.
//
// СТАТУС: контент написан целиком — 15 экранов, три локали (uz, ru, en), озвучка.
// Узбекская терминология информатики — DRAFT: требует валидации узбекским
// методистом (kompyuter, qurilma, kirish/chiqish qurilmasi, protsessor, xotira,
// dastur, buyruq). Это не перевод с русского, а принятые в школьной информатике
// Узбекистана слова, но подтверждать их должен предметник, а не я.
//
// ---------------------------------------------------------------------------
// ЧТО ЭТОТ УРОК ДОЛЖЕН СДЕЛАТЬ С РЕБЁНКОМ
//
// Ядро: компьютер — не предмет с экраном, а машина, которая ПРИНИМАЕТ данные,
// ОБРАБАТЫВАЕТ их, ХРАНИТ и ВЫДАЁТ результат. Четыре шага, а не список деталей.
// В школьной информатике эта модель называется IPOS (input, processing, output,
// storage) и в начальной школе даётся именно так.
//
// Ребёнок уходит с урока, умея:
//   1. узнать компьютер там, где нет экрана и клавиатуры (банкомат, телефон,
//      стиральная машина);
//   2. отличить устройство ввода от устройства вывода ПО ПРИЗНАКУ — куда идут
//      данные, а не по заученному списку названий;
//   3. назвать три части внутри корпуса и то, что каждая делает;
//   4. сказать, почему компьютер не думает.
//
// MISCONCEPTION'Ы, под каждую — свой экран или свой неверный вариант:
//   M1  «компьютер — это то, что с экраном на столе»      -> ЭКРАН 1 и 2
//   M2  «экран (или мышь) сам работает и сам думает»       -> экраны 3, 4
//   M3  «ввод и вывод отличаются видом устройства»         -> ЭКРАН 5 целиком
//   M4  «память и диск — одно и то же»                     -> экран 4, раунды 9 и 10
//   M5  «компьютер умный, он сам догадается и исправит»    -> ЭКРАН 12 целиком
//
// M5 — главная и самая дорогая. Пока она держится, вся дальнейшая информатика
// читается неверно: «программа» становится просьбой, а не последовательностью
// команд, и любая своя ошибка объясняется тем, что «компьютер не понял».
//
// ---------------------------------------------------------------------------
// ГДЕ ЗДЕСЬ 3D И ПОЧЕМУ ТОЛЬКО ЗДЕСЬ
//
// Модель на three.js стоит на экранах 3 и 4 и больше нигде. Причина в том, что
// именно на этих двух экранах плоская картинка врёт: у компьютера есть СТОРОНЫ
// (спереди экран, сбоку блок) и есть ВНУТРИ (процессор, память, диск лежат в
// корпусе). Остальные тринадцать экранов про направление данных и про смысл
// частей — там перспектива только мешала бы читать. Изометрические блоки разряда
// в математике методист отклонил по той же логике, и это решение здесь учтено.
//
// ---------------------------------------------------------------------------
// СЮЖЕТ
//
// Тот же, что в математике: планета Lumo, робот-провожатый Bit, экипаж
// (Ra'no, Anvar, Zuhra, Jasur). Новых персонажей не добавлено — канон-5 фиксирован
// (SYUJET_3SINF.md). Ход урока даёт сам Bit: он робот, и внутри у него компьютер,
// поэтому объяснять устройство компьютера ему естественно, а не притянуто.
// ============================================================================

// ---------------------------------------------------------------------------
// НАЗВАНИЯ УСТРОЙСТВ И ЧАСТЕЙ — объявлены один раз и переиспользуются.
// Иначе «клавиатура» пишется в уроке одиннадцать раз, и на двенадцатый она
// станет «клавишной панелью»: расхождение в названии ребёнок читает как
// разные предметы.
// ---------------------------------------------------------------------------
const N = {
  keyboard: { uz: 'Klaviatura', ru: 'Клавиатура', en: 'Keyboard' },
  mouse: { uz: 'Sichqoncha', ru: 'Мышь', en: 'Mouse' },
  mic: { uz: 'Mikrofon', ru: 'Микрофон', en: 'Microphone' },
  camera: { uz: 'Kamera', ru: 'Камера', en: 'Camera' },
  monitor: { uz: 'Ekran', ru: 'Экран', en: 'Screen' },
  printer: { uz: 'Printer', ru: 'Принтер', en: 'Printer' },
  speaker: { uz: 'Karnay', ru: 'Колонка', en: 'Speaker' },
  cpu: { uz: 'Protsessor', ru: 'Процессор', en: 'Processor' },
  ram: { uz: 'Xotira', ru: 'Память', en: 'Memory' },
  disk: { uz: 'Disk', ru: 'Диск', en: 'Disk' },
  unit: { uz: 'Sistema bloki', ru: 'Системный блок', en: 'System unit' },
  phone: { uz: 'Telefon', ru: 'Телефон', en: 'Phone' },
  washer: { uz: 'Kir yuvish mashinasi', ru: 'Стиральная машина', en: 'Washing machine' },
  atm: { uz: 'Bankomat', ru: 'Банкомат', en: 'Cash machine' },
  hammer: { uz: "Bolg'a", ru: 'Молоток', en: 'Hammer' },
  computer: { uz: 'Kompyuter', ru: 'Компьютер', en: 'Computer' },
};

// Три ответа классификации. Один и тот же набор на всех упражнениях: ребёнок
// сравнивает устройства, а не разбирается каждый раз в новых формулировках.
const KIND_OPTIONS = [
  { uz: 'Kirish qurilmasi', ru: 'Устройство ввода', en: 'Input device' },
  { uz: 'Chiqish qurilmasi', ru: 'Устройство вывода', en: 'Output device' },
  { uz: 'Ichki qism', ru: 'Внутренняя часть', en: 'Inner part' },
];

// Подписи цепочки. Ключи совпадают с блоками IOChain.
const CHAIN_LABELS = {
  input: { uz: 'Kirish', ru: 'Ввод', en: 'Input' },
  process: { uz: 'Qayta ishlash', ru: 'Обработка', en: 'Processing' },
  output: { uz: 'Chiqish', ru: 'Вывод', en: 'Output' },
  memory: { uz: 'Xotira', ru: 'Память', en: 'Memory' },
};

const CHAIN_NOTES = {
  input: { uz: "ma'lumot keladi", ru: 'данные приходят', en: 'data comes in' },
  process: { uz: 'protsessor ishlaydi', ru: 'работает процессор', en: 'the processor works' },
  output: { uz: 'natija chiqadi', ru: 'результат выходит', en: 'the result comes out' },
  memory: { uz: 'saqlab qoladi', ru: 'хранит', en: 'keeps it' },
};

const chain = (props = {}) => ({
  type: 'scene',
  name: 'ChainScene',
  props: { labels: CHAIN_LABELS, notes: CHAIN_NOTES, ...props },
});

const one = (kind, label, role = 'none') => ({
  type: 'scene',
  name: 'DeviceScene',
  props: { items: [{ key: kind, kind, label, role }], size: 86 },
});

// ---------------------------------------------------------------------------
// ПРЕДМЕТЫ ПЕРВОГО ЭКРАНА. Экспортируются: сцену обрамления HookScreen
// подключает по имени и своих пропов ей не передаёт, поэтому список привязывается
// к сцене в lessons/Dars01.jsx.
//
// Молоток в наборе обязателен. Без него экран доказывает «внутри всего есть
// компьютер» — ложная модель ничем не лучше той, которую мы снимаем.
// ---------------------------------------------------------------------------
export const HOOK_ITEMS = [
  { key: 'phone', kind: 'phone', label: N.phone, hasComputer: true },
  { key: 'washer', kind: 'washer', label: N.washer, hasComputer: true },
  { key: 'atm', kind: 'atm', label: N.atm, hasComputer: true },
  { key: 'hammer', kind: 'hammer', label: N.hammer, hasComputer: false },
];

// Команды экрана 12. Вторая строка — та, где ошибся человек, а не компьютер.
export const THINK_HEADERS = {
  cmd: { uz: 'Buyruq', ru: 'Команда', en: 'Command' },
  out: { uz: 'Kompyuter qildi', ru: 'Компьютер сделал', en: 'The computer did' },
};

export const THINK_ROWS = [
  {
    cmd: { uz: "besh va uchni qo'sh", ru: 'сложи пять и три', en: 'add five and three' },
    out: { uz: 'sakkiz', ru: 'восемь', en: 'eight' },
  },
  {
    cmd: { uz: 'beshdan uchni ayir', ru: 'вычти из пяти три', en: 'subtract three from five' },
    out: { uz: 'ikki', ru: 'два', en: 'two' },
    bad: true,
  },
];

export const THINK_NOTE = {
  uz: "Bola qo'shishni xohladi, lekin ayirishni yozdi. Kompyuter yozilganini bajardi.",
  ru: 'Ребёнок хотел сложение, а написал вычитание. Компьютер сделал написанное.',
  en: 'The child wanted addition but wrote subtraction. The computer did what was written.',
};

// Предметы вокруг нас (экран 2). Здесь молотка нет: экран уже про то, где
// компьютер есть, а не про то, где его нет.
const AROUND_ITEMS = [
  { key: 'phone', kind: 'phone', label: N.phone, hasComputer: true },
  { key: 'atm', kind: 'atm', label: N.atm, hasComputer: true },
  { key: 'washer', kind: 'washer', label: N.washer, hasComputer: true },
  { key: 'monitor', kind: 'monitor', label: N.computer, hasComputer: true },
];

const around = (upto, focusKey) => ({
  type: 'scene',
  name: 'AroundUsScene',
  props: { items: AROUND_ITEMS, upto, focusKey, gathered: true },
});

// Модель компьютера. hint показывается один раз, на первой стадии: подсказка
// «модель можно повернуть» нужна там, где ребёнок впервые её видит.
const model = (highlight, label, extra = {}) => ({
  type: 'scene',
  name: 'Computer3D',
  props: { highlight, label, ...extra },
});

const EYEBROW = {
  world: { uz: 'Kompyuter dunyosi', ru: 'Мир компьютера', en: 'The computer world' },
  parts: { uz: 'Qismlar', ru: 'Части', en: 'Parts' },
  inside: { uz: 'Ichkarida', ru: 'Внутри', en: 'Inside' },
  flow: { uz: "Ma'lumot yo'li", ru: 'Путь данных', en: 'The data path' },
  rule: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
  practice: { uz: 'Mashq', ru: 'Практика', en: 'Practice' },
  check: { uz: 'Tekshiruv', ru: 'Проверка', en: 'Check' },
  task: { uz: 'Hayotiy masala', ru: 'Жизненная задача', en: 'Real task' },
  end: { uz: 'Yakun', ru: 'Итог', en: 'Summary' },
};

const LESSON = {
  id: 'inf-3-01',
  title: {
    uz: '1-dars. Kompyuter nima?',
    ru: 'Урок 1. Что такое компьютер?',
    en: 'Lesson 1. What is a computer?',
  },
  draft: true,

  // Сцены подключает lessons/Dars01.jsx: там же к двум из них привязываются
  // данные, потому что HookScreen и SummaryScreen своих пропов сценам не дают.
  scenes: {},

  screens: [
    // ------------------------------------------------------------- 1 hook ---
    {
      id: 's1',
      role: 'problem',
      interaction: 'mc',
      scene: 'HookShelfScene',
      goal: 'Снять M1: компьютер — не мебель с экраном. Предсказание до объяснения.',
      optionCols: 2,
      // Верный ответ — молоток. Остальные три предмета компьютер содержат, и
      // каждый неверный вариант получает свой разбор: он объясняет, ГДЕ там
      // компьютер, а не сообщает «неверно».
      correct: 3,
      options: [N.phone, N.washer, N.atm, N.hammer],
      eyebrow: EYEBROW.world,
      topic: {
        uz: 'Mavzu: kompyuter nima?',
        ru: 'Тема: что такое компьютер?',
        en: 'Topic: what is a computer?',
      },
      lead: {
        uz: "Bit deydi: mening ichimda kompyuter bor.",
        ru: 'Бит говорит: внутри меня есть компьютер.',
        en: 'Bit says: there is a computer inside me.',
      },
      q: {
        uz: "Bu buyumlarning qaysi birida kompyuter YO'Q?",
        ru: 'В каком из этих предметов компьютера НЕТ?',
        en: 'Which of these things has NO computer inside?',
      },
      audio: {
        intro: {
          uz: [
            'Bugun kompyuter nima ekanini bilib olamiz.',
            'Bit robot. Uning ichida kompyuter bor va shuning uchun u buyruqlarni bajaradi.',
            "Bit sizga to'rt buyumni ko'rsatmoqda.",
            "Ulardan uchtasining ichida kompyuter bor, bittasida yo'q. Qaysi biri deb o'ylab ko'ring.",
          ],
          ru: [
            'Сегодня узнаем, что такое компьютер.',
            'Бит это робот. Внутри у него компьютер, поэтому он выполняет команды.',
            'Бит показывает тебе четыре предмета.',
            'В трёх из них компьютер есть, в одном нет. Подумай, в каком.',
          ],
          en: [
            'Today we find out what a computer is.',
            'Bit is a robot. There is a computer inside him, so he follows commands.',
            'Bit is showing you four things.',
            'Three of them have a computer inside, one does not. Think which one.',
          ],
        },
        on_correct: {
          uz: "To'g'ri. Bolg'a hech narsa hisoblamaydi va eslab qolmaydi. U oddiy asbob.",
          ru: 'Верно. Молоток ничего не считает и не запоминает. Это простой инструмент.',
          en: 'Right. A hammer counts nothing and remembers nothing. It is a simple tool.',
        },
        on_wrong: [
          {
            uz: 'Telefonning ichida kichkina kompyuter bor. U hisoblaydi va ekranga chiqaradi.',
            ru: 'Внутри телефона есть маленький компьютер. Он считает и выводит на экран.',
            en: 'There is a small computer inside a phone. It computes and shows on the screen.',
          },
          {
            uz: 'Kir yuvish mashinasi ham buyruq boyicha ishlaydi. Ichida kichkina kompyuter bor.',
            ru: 'Стиральная машина тоже работает по команде. Внутри у неё маленький компьютер.',
            en: 'A washing machine also works by command. It has a small computer inside.',
          },
          {
            uz: "Bankomat tugmalarni o'qiydi, hisoblaydi va pul beradi. Bu ham kompyuter.",
            ru: 'Банкомат читает кнопки, считает и выдаёт деньги. Это тоже компьютер.',
            en: 'A cash machine reads the buttons, computes and gives money. That is a computer too.',
          },
          null,
        ],
      },
    },

    // ---------------------------------------------------- 2 recall (вокруг) --
    {
      id: 's2',
      role: 'recall',
      goal: 'Закрепить M1 с другой стороны: компьютер есть там, где экрана не видно.',
      eyebrow: EYEBROW.world,
      lead: {
        uz: 'Kompyuter atrofimizda',
        ru: 'Компьютер вокруг нас',
        en: 'Computers around us',
      },
      stages: [
        { visual: around(1, 'phone'), caption: { uz: 'telefon hisoblaydi', ru: 'телефон считает', en: 'a phone computes' } },
        { visual: around(2, 'atm'), caption: { uz: 'bankomat pul beradi', ru: 'банкомат выдаёт деньги', en: 'a cash machine gives money' } },
        { visual: around(3, 'washer'), caption: { uz: 'mashina dastur boyicha yuvadi', ru: 'машина стирает по программе', en: 'the machine washes by program' } },
        { visual: around(4, 'monitor'), caption: { uz: 'stol kompyuteri ham shunday', ru: 'настольный компьютер такой же', en: 'a desktop computer is the same' } },
      ],
      audio: {
        intro: {
          uz: [
            "Telefoningizda kompyuter bor. Siz raqam bosasiz, u hisoblaydi va ekranda ko'rsatadi.",
            "Bankomatda ham kompyuter bor. U tugmalarni o'qiydi va pulni sanaydi.",
            'Kir yuvish mashinasi dastur boyicha ishlaydi. Dastur bu buyruqlar ketma-ketligi.',
            "Stol kompyuteri esa eng tanish kompyuter. Endi uni yaqindan ko'ramiz.",
          ],
          ru: [
            'В твоём телефоне есть компьютер. Ты нажимаешь цифру, он считает и показывает на экране.',
            'В банкомате тоже есть компьютер. Он читает кнопки и считает деньги.',
            'Стиральная машина работает по программе. Программа это последовательность команд.',
            'А настольный компьютер самый знакомый из всех. Сейчас рассмотрим его вблизи.',
          ],
          en: [
            'Your phone has a computer inside. You press a digit, it computes and shows it on the screen.',
            'A cash machine has a computer too. It reads the buttons and counts the money.',
            'A washing machine works by a program. A program is a sequence of commands.',
            'And a desktop computer is the most familiar one. Now we will look at it closely.',
          ],
        },
      },
      doneText: {
        uz: 'Kompyuter — bu ekran emas. Bu ichida hisoblaydigan qismi bor qurilma.',
        ru: 'Компьютер — это не экран. Это устройство, внутри которого есть считающая часть.',
        en: 'A computer is not a screen. It is a device with a computing part inside.',
      },
    },

    // ------------------------------------------- 3 concrete_model (снаружи) --
    {
      id: 's3',
      role: 'concrete_model',
      goal: 'Части одного предмета, а не разные предметы (M2). Модель можно повернуть.',
      eyebrow: EYEBROW.parts,
      lead: {
        uz: 'Stol kompyuterining qismlari',
        ru: 'Части настольного компьютера',
        en: 'The parts of a desktop computer',
      },
      stages: [
        {
          visual: model('monitor', N.monitor, {
            hint: {
              uz: "Modelni barmoq bilan aylantirib ko'ring",
              ru: 'Модель можно повернуть пальцем',
              en: 'You can turn the model with your finger',
            },
          }),
          caption: { uz: "ekran natijani ko'rsatadi", ru: 'экран показывает результат', en: 'the screen shows the result' },
        },
        {
          visual: model('unit', N.unit),
          caption: { uz: 'sistema bloki ichida hammasi hisoblanadi', ru: 'внутри системного блока всё считается', en: 'everything is computed inside the system unit' },
        },
        {
          visual: model('keyboard', N.keyboard),
          caption: { uz: 'klaviatura bilan harf kiritamiz', ru: 'клавиатурой вводим буквы', en: 'with the keyboard we type letters' },
        },
        {
          visual: model('mouse', N.mouse),
          caption: { uz: "sichqoncha bilan ko'rsatamiz", ru: 'мышью указываем', en: 'with the mouse we point' },
        },
      ],
      audio: {
        intro: {
          uz: [
            "Bu ekran. U hisoblamaydi, faqat tayyor natijani ko'rsatadi.",
            "Bu sistema bloki. Barcha hisoblash aynan uning ichida bo'ladi.",
            'Bu klaviatura. Siz tugmani bosasiz va harf kompyuterga tushadi.',
            "Bu sichqoncha. U bilan ekranda kerakli joyni ko'rsatasiz.",
          ],
          ru: [
            'Это экран. Он не считает, а только показывает готовый результат.',
            'Это системный блок. Все вычисления происходят именно внутри него.',
            'Это клавиатура. Ты нажимаешь клавишу, и буква попадает в компьютер.',
            'Это мышь. Ею ты указываешь нужное место на экране.',
          ],
          en: [
            'This is the screen. It does not compute, it only shows the finished result.',
            'This is the system unit. All the computing happens inside it.',
            'This is the keyboard. You press a key and the letter goes into the computer.',
            'This is the mouse. With it you point at the place you need on the screen.',
          ],
        },
      },
      doneText: {
        uz: "Bular to'rt xil buyum emas. Bu bitta kompyuterning qismlari.",
        ru: 'Это не четыре разных предмета. Это части одного компьютера.',
        en: 'These are not four different things. They are parts of one computer.',
      },
    },

    // --------------------------------------------- 4 second_model (внутри) --
    {
      id: 's4',
      role: 'second_model',
      goal: 'Три части внутри корпуса и работа каждой. Развести память и диск (M4).',
      eyebrow: EYEBROW.inside,
      lead: {
        uz: 'Sistema bloki ichida nima bor?',
        ru: 'Что внутри системного блока?',
        en: 'What is inside the system unit?',
      },
      // Стадий ровно столько, сколько сегментов озвучки (§3.1): первая снимает
      // боковую стенку и показывает всё внутри, следующие три называют по части.
      stages: [
        {
          visual: model('unit', N.unit, { open: true }),
          caption: { uz: 'yon devor olindi', ru: 'боковая стенка снята', en: 'the side panel is off' },
        },
        {
          visual: model('cpu', N.cpu, { open: true }),
          caption: { uz: 'protsessor hisoblaydi', ru: 'процессор считает', en: 'the processor computes' },
        },
        {
          visual: model('ram', N.ram, { open: true }),
          caption: { uz: 'xotira hozirgi ishni ushlab turadi', ru: 'память держит текущую работу', en: 'memory holds the current work' },
        },
        {
          visual: model('disk', N.disk, { open: true }),
          caption: { uz: "disk o'chirilgandan keyin ham saqlaydi", ru: 'диск хранит и после выключения', en: 'the disk keeps things after shutdown' },
        },
      ],
      audio: {
        intro: {
          uz: [
            'Yon devorni oldik. Ichkarida uchta muhim qism bor.',
            'Birinchisi protsessor. U hisoblaydi va buyruqlarni bajaradi.',
            "Ikkinchisi xotira. U hozir ishlatilayotgan narsani ushlab turadi va o'chirsak yo'qoladi.",
            "Uchinchisi disk. Rasm va matnlar diskda qoladi, kompyuterni o'chirsak ham.",
          ],
          ru: [
            'Мы сняли боковую стенку. Внутри три важных части.',
            'Первая часть, процессор. Он считает и выполняет команды.',
            'Вторая часть, память. Она держит то, с чем работаешь сейчас, и при выключении теряется.',
            'Третья часть, диск. Рисунки и тексты остаются на диске, даже если выключить компьютер.',
          ],
          en: [
            'We removed the side panel. There are three important parts inside.',
            'The first one is the processor. It computes and carries out commands.',
            'The second part is memory. It holds what you work with right now.',
            'The third part is the disk. Pictures and texts stay there after shutdown.',
          ],
        },
      },
      doneText: {
        uz: 'Xotira — hozir uchun, disk — keyin uchun. Bu ikki xil narsa.',
        ru: 'Память — для сейчас, диск — для потом. Это две разные вещи.',
        en: 'Memory is for now, the disk is for later. These are two different things.',
      },
    },

    // ---------------------------------------------------- 5 discovery (I/O) --
    {
      id: 's5',
      role: 'discovery',
      type: 'exploration',
      interaction: 'pick_object',
      goal: 'Снять M3: признак — направление данных, а не вид устройства.',
      eyebrow: EYEBROW.flow,
      lead: {
        uz: "Ma'lumot qayerga ketadi?",
        ru: 'Куда идут данные?',
        en: 'Where does the data go?',
      },
      computerLabel: N.computer,
      flowLabels: {
        in: { uz: 'kompyuterga', ru: 'в компьютер', en: 'into the computer' },
        out: { uz: 'kompyuterdan', ru: 'из компьютера', en: 'out of the computer' },
      },
      pickHint: {
        uz: 'Qurilmani bosing va strelkaga qarang',
        ru: 'Нажми на устройство и посмотри на стрелку',
        en: 'Tap a device and watch the arrow',
      },
      devices: [
        {
          key: 'keyboard',
          kind: 'keyboard',
          role: 'input',
          direction: 'in',
          label: N.keyboard,
          say: {
            uz: 'Siz tugmani bosdingiz. Harf kompyuterga tushdi. Strelka ichkariga qaragan.',
            ru: 'Ты нажимаешь клавишу. Буква уходит в компьютер. Стрелка смотрит внутрь.',
            en: 'You pressed a key. The letter went into the computer. The arrow points inward.',
          },
        },
        {
          key: 'mic',
          kind: 'mic',
          role: 'input',
          direction: 'in',
          label: N.mic,
          say: {
            uz: 'Siz gapirdingiz. Ovoz kompyuterga kirdi. Strelka yana ichkariga.',
            ru: 'Ты говоришь слово. Звук входит в компьютер. Стрелка снова внутрь.',
            en: 'You said a word. The sound went into the computer. The arrow points inward again.',
          },
        },
        {
          key: 'monitor',
          kind: 'monitor',
          role: 'output',
          direction: 'out',
          label: N.monitor,
          say: {
            uz: "Endi teskari. Natija kompyuterdan chiqdi va ekranda ko'rindi.",
            ru: 'Теперь наоборот. Результат вышел из компьютера и появился на экране.',
            en: 'Now the other way. The result came out of the computer and appeared on the screen.',
          },
        },
        {
          key: 'printer',
          kind: 'printer',
          role: 'output',
          direction: 'out',
          label: N.printer,
          say: {
            uz: "Printer ham shunday. Ma'lumot kompyuterdan chiqib, qog'ozda qoladi.",
            ru: 'Принтер так же. Данные выходят из компьютера и остаются на бумаге.',
            en: 'The printer is the same. Data comes out of the computer and stays on paper.',
          },
        },
      ],
      audio: {
        intro: {
          uz: [
            "Qurilmalar ikki turga bo'linadi, lekin ko'rinishiga qarab emas.",
            "Har bir qurilmani bosing va strelka qayoqqa qaraganiga e'tibor bering.",
            "Torttasini ham bosib ko'ring. Keyin o'zingiz qoidani topasiz.",
          ],
          ru: [
            'Устройства делятся на два вида, но не по внешнему виду.',
            'Нажимай на каждое устройство и смотри, куда смотрит стрелка.',
            'Нажми все четыре. Дальше правило найдётся само.',
          ],
          en: [
            'Devices come in two kinds, but not by how they look.',
            'Tap each device and watch where the arrow points.',
            'Tap all four. Then you will find the rule yourself.',
          ],
        },
      },
      verdict: {
        uz: "Kirish qurilmasi ma'lumotni kompyuterga beradi. Chiqish qurilmasi kompyuterdan oladi.",
        ru: 'Устройство ввода даёт данные компьютеру. Устройство вывода получает их от компьютера.',
        en: 'An input device gives data to the computer. An output device takes it from the computer.',
      },
    },

    // ------------------------------------------------- 6 bridge (цепочка) ---
    {
      id: 's6',
      role: 'bridge',
      goal: 'Собрать всё в одну модель IPOS: ввод, обработка, вывод, память.',
      eyebrow: EYEBROW.flow,
      lead: {
        uz: 'Kompyuter qanday ishlaydi?',
        ru: 'Как работает компьютер?',
        en: 'How does a computer work?',
      },
      stages: [
        { visual: chain({ lit: 1, live: 'input' }) },
        { visual: chain({ lit: 2, live: 'process' }) },
        { visual: chain({ lit: 3, live: 'output' }) },
        { visual: chain({ lit: 4, live: 'memory' }) },
      ],
      audio: {
        intro: {
          uz: [
            "Klaviaturada harf bosdingiz. Bu kirish. Ma'lumot kompyuterga keldi.",
            'Protsessor bu harfni qayta ishlaydi. Bu qayta ishlash.',
            "Keyin harf ekranda ko'rinadi. Bu chiqish.",
            'Xotira esa harfni saqlab qoladi, keraklisini yana beradi.',
          ],
          ru: [
            'Ты нажимаешь букву на клавиатуре. Это ввод. Данные приходят в компьютер.',
            'Процессор обрабатывает эту букву. Это обработка.',
            'Потом буква появляется на экране. Это вывод.',
            'А память хранит букву и отдаёт её снова, когда нужно.',
          ],
          en: [
            'You pressed a letter on the keyboard. That is input. Data came into the computer.',
            'The processor works on that letter. That is processing.',
            'Then the letter appears on the screen. That is output.',
            'And memory keeps the letter and gives it back when needed.',
          ],
        },
      },
      doneText: {
        uz: 'Har qanday kompyuter shu zanjir boyicha ishlaydi. Telefon ham, bankomat ham.',
        ru: 'Любой компьютер работает по этой цепочке. И телефон, и банкомат.',
        en: 'Every computer works along this chain. A phone and a cash machine too.',
      },
      info: {
        uz: "Zanjir hech qachon buzilmaydi. Kirish bo'lmasa, chiqish ham bo'lmaydi.",
        ru: 'Цепочка не нарушается. Без ввода не будет и вывода.',
        en: 'The chain never breaks. Without input there is no output.',
      },
      infoBadge: { uz: 'Etibor bering', ru: 'Заметь', en: 'Notice' },
    },

    // ----------------------------------------------------------- 7 rule ----
    {
      id: 's7',
      role: 'rule',
      goal: 'Правило после вопроса: признак ребёнок назвал сам на экране 5.',
      eyebrow: EYEBROW.rule,
      visual: chain({ lit: 4 }),
      optionCols: 1,
      correctCell: 'ok',
      correct: 1,
      options: [
        { uz: 'Kattaligi bilan', ru: 'Размером', en: 'By size' },
        { uz: "Ma'lumotning yo'nalishi bilan", ru: 'Направлением данных', en: 'By the direction of the data' },
        { uz: 'Rangi bilan', ru: 'Цветом', en: 'By colour' },
      ],
      checkQ: {
        uz: 'Sichqoncha va printer nimasi bilan farq qiladi?',
        ru: 'Чем отличаются мышь и принтер?',
        en: 'What makes a mouse different from a printer?',
      },
      checkOk: {
        uz: "To'g'ri. Ikkalasi ham qurilma, lekin ma'lumot qarama-qarshi tomonga ketadi.",
        ru: 'Верно. Оба — устройства, но данные идут в противоположные стороны.',
        en: 'Right. Both are devices, but the data goes in opposite directions.',
      },
      checkNo: {
        uz: "Yonalishga qarang, ko'rinishga emas.",
        ru: 'Смотри на направление, а не на внешний вид.',
        en: 'Look at the direction, not at the looks.',
      },
      rule: {
        uz: "Kompyuter — ma'lumotni qabul qiladigan, qayta ishlaydigan, saqlaydigan va natijani chiqaradigan qurilma.",
        ru: 'Компьютер — устройство, которое принимает данные, обрабатывает их, хранит и выдаёт результат.',
        en: 'A computer is a device that takes in data, processes it, stores it and gives out a result.',
      },
      audio: {
        rule: {
          uz: [
            "Qoidani yozib olamiz. Kompyuter ma'lumotni qabul qiladi.",
            "Keyin uni qayta ishlaydi va kerak bo'lsa saqlaydi.",
            'Oxirida natijani chiqaradi. Tortta ish, bitta zanjir.',
          ],
          ru: [
            'Запишем правило. Компьютер принимает данные.',
            'Потом обрабатывает их и, если нужно, сохраняет.',
            'В конце выдаёт результат. Четыре дела, одна цепочка.',
          ],
          en: [
            'Let us write the rule. A computer takes in data.',
            'Then it processes the data and stores it if needed.',
            'At the end it gives out the result. Four jobs, one chain.',
          ],
        },
      },
    },

    // --------------------------------------- 8 guided_practice (ввод/вывод) --
    {
      id: 's8',
      role: 'guided_practice',
      interaction: 'classify',
      goal: 'Применить признак направления к трём разным устройствам.',
      eyebrow: EYEBROW.practice,
      optionCols: 1,
      rounds: [
        {
          q: { uz: 'Mikrofon qanday qurilma?', ru: 'Какое устройство микрофон?', en: 'What kind of device is a microphone?' },
          visual: one('mic', N.mic, 'none'),
          options: KIND_OPTIONS,
          correct: 0,
          audio: {
            intro: {
              uz: "Mikrofon ovozni oladi. Ovoz qayoqqa ketadi deb o'ylang.",
              ru: 'Микрофон берёт звук. Подумай, куда идёт этот звук.',
              en: 'A microphone takes sound. Think where that sound goes.',
            },
            on_correct: {
              uz: "To'g'ri. Ovoz kompyuterga kiradi, demak bu kirish qurilmasi.",
              ru: 'Верно. Звук входит в компьютер, значит это устройство ввода.',
              en: 'Right. The sound goes into the computer, so it is an input device.',
            },
            on_wrong: [
              null,
              {
                uz: "Chiqish bo'lganda ovoz kompyuterdan chiqar edi. Mikrofonda esa teskari.",
                ru: 'Если бы это был вывод, звук выходил бы из компьютера. У микрофона наоборот.',
                en: 'For output the sound would come out of the computer. With a microphone it is the reverse.',
              },
              {
                uz: 'Ichki qism korpus ichida turadi. Mikrofonni esa qolda tutasiz.',
                ru: 'Внутренняя часть стоит внутри корпуса. Микрофон же ты держишь в руке.',
                en: 'An inner part sits inside the case. A microphone you hold in your hand.',
              },
            ],
          },
        },
        {
          q: { uz: 'Printer qanday qurilma?', ru: 'Какое устройство принтер?', en: 'What kind of device is a printer?' },
          visual: one('printer', N.printer, 'none'),
          options: KIND_OPTIONS,
          correct: 1,
          audio: {
            intro: {
              uz: "Printer qog'ozga bosadi. Ma'lumot qayerdan keladi deb o'ylang.",
              ru: 'Принтер печатает на бумаге. Подумай, откуда приходят данные.',
              en: 'A printer prints on paper. Think where the data comes from.',
            },
            on_correct: {
              uz: "To'g'ri. Ma'lumot kompyuterdan chiqadi, demak bu chiqish qurilmasi.",
              ru: 'Верно. Данные выходят из компьютера, значит это устройство вывода.',
              en: 'Right. The data comes out of the computer, so it is an output device.',
            },
            on_wrong: [
              {
                uz: "Kirish bo'lganda printer kompyuterga narsa berar edi. U esa faqat chiqaradi.",
                ru: 'Если бы это был ввод, принтер давал бы что-то компьютеру. А он только выдаёт.',
                en: 'For input the printer would give something to the computer. It only gives out.',
              },
              null,
              {
                uz: 'Ichki qismlar korpusda yashiringan. Printer alohida turadi.',
                ru: 'Внутренние части спрятаны в корпусе. Принтер стоит отдельно.',
                en: 'Inner parts are hidden in the case. A printer stands separately.',
              },
            ],
          },
        },
        {
          q: { uz: 'Protsessor qanday qism?', ru: 'Какая часть процессор?', en: 'What kind of part is a processor?' },
          visual: one('cpu', N.cpu, 'none'),
          options: KIND_OPTIONS,
          correct: 2,
          audio: {
            intro: {
              uz: 'Protsessorni eslang. U qayerda turadi va nima qiladi.',
              ru: 'Вспомни процессор. Где он стоит и что делает.',
              en: 'Remember the processor. Where it sits and what it does.',
            },
            on_correct: {
              uz: "To'g'ri. Protsessor korpus ichida turadi va hisoblaydi.",
              ru: 'Верно. Процессор стоит внутри корпуса и считает.',
              en: 'Right. The processor sits inside the case and computes.',
            },
            on_wrong: [
              {
                uz: "Kirish qurilmasiga siz o'zingiz tegasiz. Protsessorga esa tegmaysiz.",
                ru: 'К устройству ввода прикасаешься ты. К процессору никто не прикасается.',
                en: 'You touch an input device yourself. You do not touch the processor.',
              },
              {
                uz: "Chiqish qurilmasi natijani ko'rsatadi. Protsessor natijani hisoblaydi.",
                ru: 'Устройство вывода показывает результат. Процессор его вычисляет.',
                en: 'An output device shows the result. The processor computes it.',
              },
              null,
            ],
          },
        },
      ],
      doneText: {
        uz: "Uchtasi ham to'g'ri. Siz yo'nalish boyicha ajratishni o'rganib oldingiz.",
        ru: 'Все три верно. Теперь ты различаешь их по направлению.',
        en: 'All three correct. You have learned to tell them apart by direction.',
      },
    },

    // --------------------------- 9 independent_practice (что делает часть) --
    {
      id: 's9',
      role: 'independent_practice',
      interaction: 'mc',
      goal: 'Работа частей внутри корпуса. Развести память и диск (M4).',
      eyebrow: EYEBROW.practice,
      optionCols: 1,
      rounds: [
        {
          q: { uz: 'Protsessor nima qiladi?', ru: 'Что делает процессор?', en: 'What does the processor do?' },
          visual: one('cpu', N.cpu, 'inside'),
          options: [
            { uz: "Natijani ekranda ko'rsatadi", ru: 'Показывает результат на экране', en: 'Shows the result on the screen' },
            { uz: 'Hisoblaydi va buyruqlarni bajaradi', ru: 'Считает и выполняет команды', en: 'Computes and carries out commands' },
            { uz: 'Faylni doim saqlaydi', ru: 'Хранит файл навсегда', en: 'Keeps a file forever' },
          ],
          correct: 1,
          audio: {
            intro: {
              uz: 'Protsessor kompyuterning ishchisi. Uning ishi nima edi.',
              ru: 'Процессор это работник компьютера. В чём была его работа.',
              en: 'The processor is the worker of the computer. What was its job.',
            },
            on_correct: {
              uz: "To'g'ri. Protsessor hisoblaydi va buyruq boyicha ish qiladi.",
              ru: 'Верно. Процессор считает и работает по команде.',
              en: 'Right. The processor computes and works by command.',
            },
            on_wrong: [
              {
                uz: 'Korsatish ekranning ishi. Protsessor esa hisoblaydi.',
                ru: 'Показывать это работа экрана. Процессор считает.',
                en: "Showing is the screen's job. The processor computes.",
              },
              null,
              {
                uz: 'Doim saqlash disk ishi. Protsessor saqlamaydi, hisoblaydi.',
                ru: 'Хранить навсегда это работа диска. Процессор не хранит, а считает.',
                en: "Keeping forever is the disk's job. The processor computes instead.",
              },
            ],
          },
        },
        {
          q: { uz: 'Xotira nima qiladi?', ru: 'Что делает память?', en: 'What does memory do?' },
          visual: one('ram', N.ram, 'inside'),
          options: [
            { uz: 'Hozir ishlatilayotgan narsani ushlab turadi', ru: 'Держит то, с чем работаешь сейчас', en: 'Holds what you are working with now' },
            { uz: 'Qogozga bosadi', ru: 'Печатает на бумаге', en: 'Prints on paper' },
            { uz: 'Ovozni kiritadi', ru: 'Вводит звук', en: 'Puts sound in' },
          ],
          correct: 0,
          audio: {
            intro: {
              uz: "Xotirani eslang. Kompyuterni o'chirsak, unda nima qoladi.",
              ru: 'Вспомни память. Что в ней остаётся, если выключить компьютер.',
              en: 'Remember memory. What stays in it when the computer is switched off.',
            },
            on_correct: {
              uz: "To'g'ri. Xotira hozirgi ish uchun. Ochirilsa, u bo'shaladi.",
              ru: 'Верно. Память нужна для текущей работы. При выключении она пустеет.',
              en: 'Right. Memory is for the current work. When the power goes off it empties.',
            },
            on_wrong: [
              null,
              {
                uz: 'Qogozga printer bosadi. Xotira esa korpus ichida ishlaydi.',
                ru: 'На бумаге печатает принтер. Память работает внутри корпуса.',
                en: 'The printer prints on paper. Memory works inside the case.',
              },
              {
                uz: 'Ovozni mikrofon kiritadi. Xotira faqat ushlab turadi.',
                ru: 'Звук вводит микрофон. Память только держит.',
                en: 'The microphone puts sound in. Memory only holds.',
              },
            ],
          },
        },
        {
          q: { uz: "Kompyuterni o'chirdik. Rasm qayerda qoladi?", ru: 'Мы выключили компьютер. Где остаётся рисунок?', en: 'We switched the computer off. Where does the picture stay?' },
          visual: one('disk', N.disk, 'inside'),
          options: [
            { uz: 'Xotirada', ru: 'В памяти', en: 'In memory' },
            { uz: 'Ekranda', ru: 'На экране', en: 'On the screen' },
            { uz: 'Diskda', ru: 'На диске', en: 'On the disk' },
          ],
          correct: 2,
          audio: {
            intro: {
              uz: "Rasm chizdingiz va kompyuterni o'chirdingiz. Ertaga uni qayerdan olasiz.",
              ru: 'Ты рисуешь рисунок и выключаешь компьютер. Откуда возьмёшь его завтра.',
              en: 'You drew a picture and switched the computer off. Where will you get it tomorrow.',
            },
            on_correct: {
              uz: "To'g'ri. Disk o'chirilgandan keyin ham saqlab qoladi.",
              ru: 'Верно. Диск хранит и после выключения.',
              en: 'Right. The disk keeps it even after shutdown.',
            },
            on_wrong: [
              {
                uz: "Xotira o'chirilganda bo'shaladi. Shuning uchun rasm unda qolmaydi.",
                ru: 'Память при выключении пустеет. Поэтому рисунок в ней не останется.',
                en: 'Memory empties when the power goes off. So the picture will not stay there.',
              },
              {
                uz: "Ekran hech narsani saqlamaydi. U faqat ko'rsatadi.",
                ru: 'Экран ничего не хранит. Он только показывает.',
                en: 'The screen stores nothing. It only shows.',
              },
              null,
            ],
          },
        },
      ],
      doneText: {
        uz: 'Xotira hozir uchun, disk keyin uchun. Endi ikkisini ajratasiz.',
        ru: 'Память — для сейчас, диск — для потом. Теперь ты их различаешь.',
        en: 'Memory for now, the disk for later. Now you tell them apart.',
      },
    },

    // ---------------------------------------------- 10 error_find (ошибка) --
    {
      id: 's10',
      role: 'error_find',
      interaction: 'error_spot',
      goal: 'Найти ошибку в чужом утверждении, а не воспроизвести правило.',
      eyebrow: EYEBROW.check,
      optionCols: 1,
      rounds: [
        {
          q: {
            uz: "Anvar aytdi: ekran ma'lumotni kompyuterga beradi. Xato qayerda?",
            ru: 'Анвар сказал: экран даёт данные компьютеру. Где ошибка?',
            en: 'Anvar said: the screen gives data to the computer. Where is the mistake?',
          },
          visual: one('monitor', N.monitor, 'none'),
          options: [
            { uz: "Xato yo'q, hammasi to'g'ri", ru: 'Ошибки нет, всё верно', en: 'No mistake, all correct' },
            { uz: "Ekran ko'rsatadi, ya'ni ma'lumot kompyuterdan chiqadi", ru: 'Экран показывает, то есть данные выходят из компьютера', en: 'The screen shows, so the data comes out of the computer' },
            { uz: 'Ekran korpus ichidagi qism', ru: 'Экран — часть внутри корпуса', en: 'The screen is a part inside the case' },
          ],
          correct: 1,
          audio: {
            intro: {
              uz: 'Anvar xato qildi. Strelka qayoqqa qaraganini eslang.',
              ru: 'Анвар ошибся. Вспомни, куда смотрела стрелка.',
              en: 'Anvar made a mistake. Remember where the arrow pointed.',
            },
            on_correct: {
              uz: "To'g'ri topdingiz. Ekran chiqish qurilmasi, u ma'lumot bermaydi.",
              ru: 'Верно. Экран это устройство вывода, он данные не даёт.',
              en: 'Well found. The screen is an output device, it does not give data.',
            },
            on_wrong: [
              {
                uz: 'Bu yerda xato bor. Ekran kompyuterga hech narsa bermaydi.',
                ru: 'Здесь ошибка есть. Экран ничего не даёт компьютеру.',
                en: 'There is a mistake here. The screen gives nothing to the computer.',
              },
              null,
              {
                uz: 'Ekran tashqarida turadi, korpus ichida emas. Lekin xato boshqa joyda.',
                ru: 'Экран стоит снаружи, не внутри корпуса. Но ошибка в другом.',
                en: 'The screen stands outside, not inside the case. But the mistake is elsewhere.',
              },
            ],
          },
        },
        {
          q: {
            uz: 'Zuhra aytdi: disk va xotira bir xil narsa. Xato qayerda?',
            ru: 'Зухра сказала: диск и память — одно и то же. Где ошибка?',
            en: 'Zuhra said: the disk and memory are the same thing. Where is the mistake?',
          },
          visual: one('ram', N.ram, 'none'),
          options: [
            { uz: "Xotira o'chirilsa bo'shaladi, disk esa saqlaydi", ru: 'Память при выключении пустеет, а диск хранит', en: 'Memory empties at shutdown, the disk keeps things' },
            { uz: "Xato yo'q, ikkisi bir xil", ru: 'Ошибки нет, они одинаковые', en: 'No mistake, they are the same' },
            { uz: "Disk hisoblaydi, xotira esa yo'q", ru: 'Диск считает, а память нет', en: 'The disk computes and memory does not' },
          ],
          correct: 0,
          audio: {
            intro: {
              uz: 'Zuhra ikki qismni aralashtirdi. Farqi nimada edi.',
              ru: 'Зухра перепутала две части. В чём была разница.',
              en: 'Zuhra mixed up two parts. What was the difference.',
            },
            on_correct: {
              uz: "To'g'ri. Ikkisi ham saqlaydi, lekin xotira faqat ish vaqtida.",
              ru: 'Верно. Обе хранят, но память — только во время работы.',
              en: 'Right. Both store, but memory only while the computer runs.',
            },
            on_wrong: [
              null,
              {
                uz: "Ular bir xil emas. Ochirilgandan keyin farqi ko'rinadi.",
                ru: 'Они не одинаковые. После выключения разница видна.',
                en: 'They are not the same. After shutdown the difference shows.',
              },
              {
                uz: 'Hisoblash protsessor ishi. Ikkisi ham hisoblamaydi.',
                ru: 'Считать это работа процессора. Ни диск, ни память не считают.',
                en: "Computing is the processor's job. Neither of them computes.",
              },
            ],
          },
        },
        {
          q: {
            uz: "Jasur aytdi: kompyuter mendan aqlli, u o'zi o'ylaydi. Xato qayerda?",
            ru: 'Джасур сказал: компьютер умнее меня, он сам думает. Где ошибка?',
            en: 'Jasur said: the computer is smarter than me, it thinks by itself. Where is the mistake?',
          },
          visual: one('cpu', N.cpu, 'none'),
          options: [
            { uz: 'Kompyuter faqat berilgan buyruqni bajaradi', ru: 'Компьютер выполняет только данную команду', en: 'A computer only carries out the command it is given' },
            { uz: 'Kompyuter hech narsa qilmaydi', ru: 'Компьютер вообще ничего не делает', en: 'A computer does nothing at all' },
            { uz: "Xato yo'q, kompyuter o'ylaydi", ru: 'Ошибки нет, компьютер думает', en: 'No mistake, the computer thinks' },
          ],
          correct: 0,
          audio: {
            intro: {
              uz: "Jasur adashdi. Kompyuter tez, lekin o'ylamaydi.",
              ru: 'Джасур ошибся. Компьютер быстрый, но он не думает.',
              en: 'Jasur is wrong. A computer is fast, but it does not think.',
            },
            on_correct: {
              uz: "To'g'ri. U juda tez hisoblaydi, lekin faqat aytilganini qiladi.",
              ru: 'Верно. Он считает очень быстро, но делает только то, что сказали.',
              en: 'Right. It computes very fast, but does only what it is told.',
            },
            on_wrong: [
              null,
              {
                uz: "Kompyuter juda ko'p ish qiladi. Faqat o'zi qaror qilmaydi.",
                ru: 'Компьютер делает очень много. Просто он не решает сам.',
                en: 'A computer does a great deal. It just does not decide by itself.',
              },
              {
                uz: 'Oylash odam ishi. Kompyuter buyruqni bajaradi.',
                ru: 'Думать это дело человека. Компьютер выполняет команду.',
                en: "Thinking is a person's job. The computer carries out a command.",
              },
            ],
          },
        },
      ],
      doneText: {
        uz: 'Uchta xatoni topdingiz. Xatoni topish bilishdan qiyinroq.',
        ru: 'Три ошибки найдены. Находить ошибку труднее, чем знать правило.',
        en: 'You found three mistakes. Finding a mistake is harder than knowing the rule.',
      },
    },

    // ------------------------------------------ 11 reverse_task (обратно) --
    {
      id: 's11',
      role: 'reverse_task',
      interaction: 'chain_slot',
      goal: 'Обратный ход: место в цепочке дано, часть надо назвать.',
      eyebrow: EYEBROW.check,
      optionCols: 1,
      rounds: [
        {
          q: {
            uz: 'Zanjirning bu joyida qaysi qism turadi?',
            ru: 'Какая часть стоит в этом месте цепочки?',
            en: 'Which part stands in this place of the chain?',
          },
          visual: chain({ lit: 4, unknown: 'process' }),
          options: [N.printer, N.cpu, N.keyboard],
          correct: 1,
          audio: {
            intro: {
              uz: 'Zanjirda bitta joy yopilgan. Oyla, u yerda nima qiladi.',
              ru: 'В цепочке одно место закрыто. Подумай, что там делают.',
              en: 'One place in the chain is covered. Think what happens there.',
            },
            on_correct: {
              uz: "To'g'ri. Qayta ishlash joyida protsessor turadi.",
              ru: 'Верно. На месте обработки стоит процессор.',
              en: 'Right. The processor stands in the processing place.',
            },
            on_wrong: [
              {
                uz: 'Printer chiqish joyida turadi, oxirida. Bu esa ortasi.',
                ru: 'Принтер стоит на выводе, в конце. А это середина.',
                en: 'A printer stands at the output, at the end. This is the middle.',
              },
              null,
              {
                uz: 'Klaviatura boshida, kirish joyida. Bu esa ortasi.',
                ru: 'Клавиатура в начале, на вводе. А это середина.',
                en: 'A keyboard is at the start, at the input. This is the middle.',
              },
            ],
          },
        },
        {
          q: {
            uz: 'Bu joyda qaysi qurilma ishlaydi?',
            ru: 'Какое устройство работает в этом месте?',
            en: 'Which device works in this place?',
          },
          visual: chain({ lit: 4, unknown: 'input' }),
          options: [N.speaker, N.mic, N.disk],
          correct: 1,
          audio: {
            intro: {
              uz: "Endi zanjirning boshi yopilgan. U yerga ma'lumot keladi.",
              ru: 'Теперь закрыто начало цепочки. Туда приходят данные.',
              en: 'Now the start of the chain is covered. Data comes in there.',
            },
            on_correct: {
              uz: "To'g'ri. Mikrofon ovozni kompyuterga kiritadi.",
              ru: 'Верно. Микрофон вводит звук в компьютер.',
              en: 'Right. A microphone puts sound into the computer.',
            },
            on_wrong: [
              {
                uz: 'Karnay ovozni chiqaradi. Boshida esa kiritadigan qurilma kerak.',
                ru: 'Колонка звук выводит. А в начале нужно устройство, которое вводит.',
                en: 'A speaker gives sound out. At the start we need a device that puts data in.',
              },
              null,
              {
                uz: 'Disk korpus ichida saqlaydi. U kirish qurilmasi emas.',
                ru: 'Диск хранит внутри корпуса. Он не устройство ввода.',
                en: 'A disk stores inside the case. It is not an input device.',
              },
            ],
          },
        },
        {
          q: {
            uz: "Bu joy o'chirilgandan keyin ham saqlaydi. Qaysi qism?",
            ru: 'Это место хранит и после выключения. Какая часть?',
            en: 'This place keeps things after shutdown. Which part?',
          },
          visual: chain({ lit: 4, unknown: 'memory' }),
          options: [N.disk, N.monitor, N.mouse],
          correct: 0,
          audio: {
            intro: {
              uz: "Oxirgi joy saqlash uchun. Ochirsak ham yo'qolmaydi.",
              ru: 'Последнее место нужно для хранения. Оно не теряется при выключении.',
              en: 'The last place is for storing. It is not lost at shutdown.',
            },
            on_correct: {
              uz: "To'g'ri. Disk uzoq saqlash uchun.",
              ru: 'Верно. Диск нужен для долгого хранения.',
              en: 'Right. The disk is for long storage.',
            },
            on_wrong: [
              null,
              {
                uz: "Ekran ko'rsatadi va saqlamaydi. Ochirsak, unda hech narsa qolmaydi.",
                ru: 'Экран показывает и не хранит. После выключения на нём ничего нет.',
                en: 'The screen shows and does not store. After shutdown nothing is left on it.',
              },
              {
                uz: "Sichqoncha ko'rsatish uchun. U saqlamaydi.",
                ru: 'Мышь — чтобы указывать. Она не хранит.',
                en: 'A mouse is for pointing. It does not store.',
              },
            ],
          },
        },
      ],
      doneText: {
        uz: "Zanjirni ikki tomonga o'qiy oldingiz. Bu tushunganingizni ko'rsatadi.",
        ru: 'Цепочка прочитана в обе стороны. Это и значит понять.',
        en: 'You read the chain both ways. That is what understanding means.',
      },
    },

    // ------------------------------------- 12 myth_check («компьютер думает») --
    {
      id: 's12',
      role: 'myth_check',
      type: 'exploration',
      scored: false,
      interaction: 'mc',
      scene: 'ThinkTestScene',
      goal: 'Снять M5: компьютер выполняет команду, а не догадывается о замысле.',
      optionCols: 1,
      correct: 1,
      options: [
        { uz: "Xatoni o'zi tuzatadi", ru: 'Сам исправит ошибку', en: 'It will fix the mistake itself' },
        { uz: 'Xato buyruqni ham bajaradi', ru: 'Выполнит и ошибочную команду', en: 'It will carry out the wrong command too' },
        { uz: 'Butunlay ishlamay qoladi', ru: 'Совсем перестанет работать', en: 'It will stop working completely' },
      ],
      eyebrow: EYEBROW.check,
      lead: {
        uz: 'Bit sinov otkazmoqchi',
        ru: 'Бит хочет провести проверку',
        en: 'Bit wants to run a test',
      },
      q: {
        uz: 'Bola qoshishni xohladi, lekin ayirishni yozdi. Kompyuter nima qiladi?',
        ru: 'Ребёнок хотел сложение, а написал вычитание. Что сделает компьютер?',
        en: 'The child wanted addition but wrote subtraction. What will the computer do?',
      },
      audio: {
        intro: {
          uz: [
            "Ko'p odam kompyuter o'ylaydi deb hisoblaydi. Buni tekshiramiz.",
            "Ikkita buyruq berildi. Birinchisi to'g'ri yozilgan.",
            "Ikkinchisida odam adashdi. Kompyuter nima qiladi deb o'ylang.",
          ],
          ru: [
            'Многие думают, что компьютер думает. Давай проверим.',
            'Дано две команды. Первая написана правильно.',
            'Во второй человек ошибся. Подумай, что сделает компьютер.',
          ],
          en: [
            'Many people think a computer thinks. Let us check.',
            'Two commands were given. The first one is written correctly.',
            'In the second one the person made a mistake. Think what the computer will do.',
          ],
        },
        on_correct: {
          uz: 'Ha. Kompyuter yozilganini bajaradi. U nima xohlaganingizni bilmaydi.',
          ru: 'Да. Компьютер делает написанное. Он не знает, чего ты хочешь.',
          en: 'Yes. The computer does what is written. It does not know what you wanted.',
        },
        on_wrong: [
          {
            uz: "Kompyuter xatoni tuzatmaydi. U qanday yozilgan bo'lsa, shunday bajaradi.",
            ru: 'Компьютер ошибку не исправляет. Он делает так, как написано.',
            en: 'A computer does not fix mistakes. It does exactly what is written.',
          },
          null,
          {
            uz: "To'xtamaydi. Buyruq to'g'ri yozilgan, faqat maqsad boshqa edi.",
            ru: 'Он не остановится. Команда написана правильно, просто замысел был другой.',
            en: 'It will not stop. The command is written correctly, only the intention was different.',
          },
        ],
      },
    },

    // ------------------------------------------- 13 life_problem (задача) --
    {
      id: 's13',
      role: 'life_problem',
      interaction: 'numpad',
      goal: 'Собрать цепочку под настоящую задачу экипажа: записать и услышать.',
      eyebrow: EYEBROW.task,
      lead: {
        uz: 'Zuhraga yordam kerak',
        ru: 'Зухре нужна помощь',
        en: 'Zuhra needs help',
      },
      context: {
        uz: "Zuhra she'r o'qib, ovozini kompyuterga yozib olmoqchi. Keyin uni ekipajga eshittirmoqchi.",
        ru: 'Зухра хочет прочитать стих и записать голос в компьютер. Потом дать экипажу послушать.',
        en: 'Zuhra wants to read a poem, record her voice into the computer and let the crew hear it.',
      },
      visual: {
        type: 'scene',
        name: 'DeviceScene',
        props: {
          items: [
            { key: 'mic', kind: 'mic', label: N.mic, role: 'none' },
            { key: 'speaker', kind: 'speaker', label: N.speaker, role: 'none' },
            { key: 'printer', kind: 'printer', label: N.printer, role: 'none' },
            { key: 'mouse', kind: 'mouse', label: N.mouse, role: 'none' },
          ],
        },
      },
      q: {
        uz: 'Zuhraga shu ishlar uchun nechta qurilma kerak?',
        ru: 'Сколько устройств нужно Зухре для этих двух дел?',
        en: 'How many devices does Zuhra need for these two jobs?',
      },
      answer: 2,
      escalation: [
        {
          uz: 'Ikki ish bor. Yozib olish va eshittirish. Har biriga qurilma kerak.',
          ru: 'Дел два. Записать и дать послушать. Для каждого нужно устройство.',
          en: 'There are two jobs. Recording and letting others hear. Each needs a device.',
        },
        {
          uz: 'Ovozni kompyuterga mikrofon kiritadi. Endi eshittirish uchun kim kerak.',
          ru: 'Звук в компьютер вводит микрофон. Теперь кто нужен, чтобы послушать.',
          en: 'The microphone puts the sound into the computer. Now who is needed to hear it.',
        },
        {
          uz: 'Mikrofon kirish uchun, karnay chiqish uchun. Ularni sanang.',
          ru: 'Микрофон для ввода, колонка для вывода. Посчитай их.',
          en: 'The microphone for input, the speaker for output. Count them.',
        },
      ],
      strongHint: {
        uz: "Printer qog'ozga bosadi, sichqoncha ko'rsatadi. Ovoz uchun ular kerak emas.",
        ru: 'Принтер печатает на бумаге, мышь указывает. Для звука они не нужны.',
        en: 'The printer prints on paper, the mouse points. Neither is needed for sound.',
      },
      audio: {
        intro: {
          uz: [
            "Zuhra she'r oqmoqchi va ovozini kompyuterga yozib olmoqchi.",
            'Keyin yozilgan ovozni ekipajga eshittirmoqchi.',
            'Ikki ish uchun nechta qurilma kerak deb sanang.',
          ],
          ru: [
            'Зухра хочет прочитать стих и записать голос в компьютер.',
            'Потом хочет дать экипажу послушать запись.',
            'Посчитай, сколько устройств нужно для этих двух дел.',
          ],
          en: [
            'Zuhra wants to read a poem and record her voice into the computer.',
            'Then she wants to let the crew hear the recording.',
            'Count how many devices are needed for these two jobs.',
          ],
        },
        on_correct: {
          uz: "To'g'ri, ikkita. Mikrofon ovozni kiritadi, karnay chiqaradi.",
          ru: 'Верно, два. Микрофон вводит звук, колонка выводит.',
          en: 'Right, two. The microphone puts the sound in, the speaker gives it out.',
        },
      },
      fact: {
        uz: "Birinchi kompyuterlar butun xonani egallagan, ammo zanjiri xuddi shunday bo'lgan.",
        ru: 'Первые компьютеры занимали целую комнату, но цепочка у них была такая же.',
        en: 'The first computers filled a whole room, yet their chain was exactly the same.',
      },
      factBadge: { uz: 'Bilasizmi?', ru: 'Знаешь ли ты?', en: 'Did you know?' },
    },

    // ------------------------------------ 14 final_diagnostic (проверка) --
    {
      id: 's14',
      role: 'final_diagnostic',
      interaction: 'mc',
      goal: 'Проверка на НОВЫХ устройствах и вопросах, не разобранных до этого.',
      eyebrow: EYEBROW.check,
      optionCols: 1,
      rounds: [
        {
          q: { uz: 'Kamera qanday qurilma?', ru: 'Какое устройство камера?', en: 'What kind of device is a camera?' },
          visual: one('camera', N.camera, 'none'),
          options: KIND_OPTIONS,
          correct: 0,
          audio: {
            intro: {
              uz: "Kamera bugun ko'rilmagan. Oylang, rasm qayoqqa ketadi.",
              ru: 'Камеру мы сегодня не разбирали. Подумай, куда идёт картинка.',
              en: 'We have not looked at a camera today. Think where the picture goes.',
            },
            on_correct: {
              uz: "To'g'ri. Kamera rasmni kompyuterga beradi, demak kirish.",
              ru: 'Верно. Камера даёт картинку компьютеру, значит это ввод.',
              en: 'Right. A camera gives the picture to the computer, so it is input.',
            },
            on_wrong: [
              null,
              {
                uz: "Chiqishda ma'lumot kompyuterdan chiqadi. Kamera esa beradi.",
                ru: 'При выводе данные выходят из компьютера. А камера их даёт.',
                en: 'At the output data comes out of the computer. A camera gives data in.',
              },
              {
                uz: "Kamera korpus ichida yashiringan emas. Uni ko'rib turasiz.",
                ru: 'Камера не спрятана внутри корпуса. Ты её видишь.',
                en: 'A camera is not hidden inside the case. You can see it.',
              },
            ],
          },
        },
        {
          q: {
            uz: "Rasmni qog'ozda olish uchun nima kerak?",
            ru: 'Что нужно, чтобы получить рисунок на бумаге?',
            en: 'What is needed to get the picture on paper?',
          },
          visual: chain({ lit: 4, unknown: 'output' }),
          options: [N.printer, N.mic, N.ram],
          correct: 0,
          audio: {
            intro: {
              uz: "Rasm ekranda tayyor. Endi uni qog'ozda ko'rmoqchisiz.",
              ru: 'Рисунок на экране готов. Теперь ты хочешь увидеть его на бумаге.',
              en: 'The picture on the screen is ready. Now you want it on paper.',
            },
            on_correct: {
              uz: "To'g'ri. Printer chiqish joyida turadi.",
              ru: 'Верно. Принтер стоит на месте вывода.',
              en: 'Right. The printer stands at the output place.',
            },
            on_wrong: [
              null,
              {
                uz: 'Mikrofon ovozni kiritadi. Qogoz uchun chiqish qurilmasi kerak.',
                ru: 'Микрофон вводит звук. Для бумаги нужно устройство вывода.',
                en: 'A microphone puts sound in. For paper we need an output device.',
              },
              {
                uz: "Xotira korpus ichida ushlab turadi. U qog'ozga bosmaydi.",
                ru: 'Память держит внутри корпуса. Она на бумаге не печатает.',
                en: 'Memory holds things inside the case. It does not print on paper.',
              },
            ],
          },
        },
        {
          q: {
            uz: 'Kompyuter eng avval nima qiladi?',
            ru: 'Что компьютер делает самым первым?',
            en: 'What does a computer do first of all?',
          },
          visual: chain({ lit: 4 }),
          options: [
            { uz: 'Natijani chiqaradi', ru: 'Выдаёт результат', en: 'Gives out the result' },
            { uz: "Ma'lumotni qabul qiladi", ru: 'Принимает данные', en: 'Takes in data' },
            { uz: 'Ozi qaror qiladi', ru: 'Сам принимает решение', en: 'Decides by itself' },
          ],
          correct: 1,
          audio: {
            intro: {
              uz: 'Zanjirni boshidan eslang. Birinchi qadam nima edi.',
              ru: 'Вспомни цепочку с начала. Каким был первый шаг.',
              en: 'Remember the chain from the start. What was the first step.',
            },
            on_correct: {
              uz: "To'g'ri. Avval qabul qiladi, keyin qayta ishlaydi va chiqaradi.",
              ru: 'Верно. Сначала принимает, потом обрабатывает и выдаёт.',
              en: 'Right. First it takes in, then processes and gives out.',
            },
            on_wrong: [
              {
                uz: 'Chiqarish oxirgi qadam. Avval nimadir kelishi kerak.',
                ru: 'Выдать — последний шаг. Сначала должно что-то прийти.',
                en: 'Giving out is the last step. Something must come in first.',
              },
              null,
              {
                uz: 'Qaror qilish kompyuter ishi emas. Buyruqni odam beradi.',
                ru: 'Решать — не дело компьютера. Команду даёт человек.',
                en: "Deciding is not the computer's job. A person gives the command.",
              },
            ],
          },
        },
      ],
      doneText: {
        uz: 'Yakuniy tekshiruv tugadi. Siz kompyuter zanjirini bilasiz.',
        ru: 'Итоговая проверка пройдена. Ты знаешь цепочку компьютера.',
        en: 'The final check is done. You know the computer chain.',
      },
    },

    // -------------------------------------------------------- 15 summary --
    {
      id: 's15',
      role: 'summary',
      eyebrow: EYEBROW.end,
      scene: 'HookShelfScene',
      lead: {
        uz: 'Bugun nimani bilib oldingiz',
        ru: 'Что ты теперь знаешь',
        en: 'What you have learned today',
      },
      rule: {
        uz: "Kompyuter ma'lumotni qabul qiladi, qayta ishlaydi, saqlaydi va natijani chiqaradi.",
        ru: 'Компьютер принимает данные, обрабатывает, хранит и выдаёт результат.',
        en: 'A computer takes in data, processes it, stores it and gives out a result.',
      },
      ruleBadge: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
      praise: {
        uz: 'Birinchi darsda siz kompyuterni tanidingiz va qismlarini ajratdingiz.',
        ru: 'После первого урока ты узнаёшь компьютер и различаешь его части.',
        en: 'In the first lesson you learned to recognise a computer and tell its parts apart.',
      },
      fact: {
        uz: "Bitning ismi ma'lumotning eng kichik bo'lagidan olingan. U ham bit deb ataladi.",
        ru: 'Имя Бита взято от самой маленькой части данных. Она тоже называется бит.',
        en: 'Bit is named after the smallest piece of data. It is also called a bit.',
      },
      factBadge: { uz: 'Bilasizmi?', ru: 'Знаешь ли ты?', en: 'Did you know?' },
      bridge: {
        uz: 'Keyingi darsda buyruq va dastur bilan tanishamiz. Kompyuterga topshiriq beramiz.',
        ru: 'На следующем уроке познакомимся с командой и программой. Дадим компьютеру задание.',
        en: 'Next lesson we will meet commands and programs. We will give the computer a task.',
      },
      bridgeBadge: { uz: 'Keyingi dars', ru: 'Следующий урок', en: 'Next lesson' },
      // Пять зон вместо шести математических: у информатики свой путь по программе.
      zones: ['#5A8FD6', '#7FC4D6', '#7FD69B', '#F0C24A', '#F2A65A'],
      audio: {
        uz: [
          'Bugun kompyuter nima ekanini bilib oldingiz.',
          "Kompyuter ekran emas. U ma'lumot bilan ishlaydigan qurilma.",
          'Kirish, qayta ishlash, chiqish va xotira. Tortta ish, bitta zanjir.',
          "Va eng muhimi. Kompyuter o'ylamaydi, u buyruqni bajaradi.",
          'Keyingi darsda buyruq va dastur bilan tanishamiz.',
        ],
        ru: [
          'Теперь ты знаешь, что такое компьютер.',
          'Компьютер это не экран. Это устройство, которое работает с данными.',
          'Ввод, обработка, вывод и память. Четыре дела, одна цепочка.',
          'И самое главное. Компьютер не думает, он выполняет команду.',
          'На следующем уроке познакомимся с командой и программой.',
        ],
        en: [
          'Today you found out what a computer is.',
          'A computer is not a screen. It is a device that works with data.',
          'Input, processing, output and memory. Four jobs, one chain.',
          'And the most important thing. A computer does not think, it carries out a command.',
          'Next lesson we will meet commands and programs.',
        ],
      },
    },
  ],
};

export default LESSON;
