// ============================================================================
// 4-SINF · Dars 11 · Ko'p xonali sonni uch xonali songa ko'paytirish
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", 5-nashr 2020, 86-89-betlar.
// Skelet: src/books/grade4/Dars11_SCENARIO.md (metodist tasdiqlagan).
// Syujet: Lumo City transport deposining quyosh panellari (SYUJET_4SINF.md, 2-blok).
//
// Ritm: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan oltita ekran: s2, s4, s6, s8, s10, s13.
//
// Infratuzilma ko'chirilmaydi, `kit/` dan import qilinadi (CLAUDE.md §5).
// ============================================================================
import {
  ChoiceScreen, FitSvg, KIT_STYLES, RevealScreen, SlotScreen, T,
  SummaryScreen, TheoryLessonRoot, assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'mul3-4-11-v2',
  slug: 'dars11-kop-xonali-sonni-uch-xonali-songa-kopaytirish',
  lessonTitle: {
    uz: "11-dars. Ko'p xonali sonni uch xonali songa ko'paytirish",
    ru: 'Урок 11. Умножение многозначного числа на трёхзначное',
    en: 'Lesson 11. Multiplying a multi-digit number by a three-digit number',
  },
  skillTags: ['partial_products', 'row_shift', 'internal_zero', 'place_value', 'estimation'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', scored: false, scope: null },
  { id: 's2', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's3', type: 'exploration', scored: false, scope: null },
  { id: 's4', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's5', type: 'exploration', scored: false, scope: null },
  { id: 's6', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's7', type: 'exploration', scored: false, scope: null },
  { id: 's8', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'exploration', scored: false, scope: null },
  { id: 's10', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'rule', scored: false, scope: null },
  { id: 's12', type: 'strategy', scored: false, scope: null },
  { id: 's13', type: 'error-analysis', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'life-case', scored: false, scope: 'final' },
  { id: 's15', type: 'summary', scored: false, scope: null },
];

const TOTAL_SCREENS = SCREEN_META.length;
assertScreenTypeLabels(SCREEN_META, LESSON_META.lessonId);

// Har ekrandagi ovoz bo'laklari soni: kadr shu bo'lakka ergashadi.
const FRAME_COUNTS = [5, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3];

// ---------------------------------------------------------------------------
// KONTENT: UZ (asosiy), RU, EN + har ekran uchun ovoz.
// Ovoz ekran matnidan kengroq: ekranda formula, ovozda sabab.
// ---------------------------------------------------------------------------
const CONTENT = {
  s0: {
    eyebrow: { uz: 'Quyosh panellari', ru: 'Солнечные панели', en: 'Solar panels' },
    title: {
      uz: 'Panellar quvvati yetmayaptimi?',
      ru: 'Не хватает мощности панелей?',
      en: 'Are the panels short of power?',
    },
    question: {
      uz: "Bit hisobida nima yetishmayapti?",
      ru: 'Чего не хватает в расчёте Bit?',
      en: "What is missing from Bit's calculation?",
    },
    options: [
      { uz: "Yuzliklar qatori", ru: 'Строки сотен', en: 'The hundreds row' },
      { uz: "Panellar soni", ru: 'Числа панелей', en: 'The number of panels' },
      { uz: "Panel quvvati", ru: 'Мощности панели', en: 'The power of one panel' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bit to'rt yuzta panelni hisobga olmagan, shuning uchun yuzliklar qatori yo'q.",
      ru: 'Верно. Bit не учёл четыреста панелей, поэтому строки сотен нет.',
      en: 'Correct. Bit did not count four hundred panels, so the hundreds row is missing.',
    },
    wrong: [
      null,
      {
        uz: "Panellar soni to'g'ri sanalgan: hammasi bo'lib to'rt yuz ellik to'qqizta panel bor. Xato hisob yozuvida.",
        ru: 'Панели сосчитаны верно: всего четыреста пятьдесят девять панелей. Ошибка в записи расчёта.',
        en: 'The panels are counted correctly: there are four hundred and fifty-nine panels in all. The error is in the written calculation.',
      },
      {
        uz: "Bitta panel quvvati ham to'g'ri: uch yuz yetmish besh vatt. Xato ko'paytirish yozuvida.",
        ru: 'Мощность одной панели тоже верна: триста семьдесят пять ватт. Ошибка в записи умножения.',
        en: 'The power of one panel is also right: three hundred and seventy-five watts. The error is in the multiplication.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Lumo City muhandislik markazi transport deposiga quyosh panellarini o'rnatdi.",
          "Hammasi bo'lib to'rt yuz ellik to'qqizta panel bor. Har bir panel uch yuz yetmish besh vatt quvvat beradi.",
          "Depoga kamida bir yuz yetmish ming vatt kerak. Bit hisobladi va yigirma ikki ming bir yuz yigirma besh vatt chiqdi.",
          "Bu depo uchun juda kam. Lekin panellar ham, quvvat ham to'g'ri sanalgan.",
          "Demak xato hisob yozuvining ichida. Bit nimani tushirib qoldirgan deb o'ylaysiz? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Инженерный центр Lumo City установил солнечные панели над транспортным депо.',
          'Всего четыреста пятьдесят девять панелей. Каждая панель даёт триста семьдесят пять ватт.',
          'Депо нужно не меньше ста семидесяти тысяч ватт. Bit посчитал и получил двадцать две тысячи сто двадцать пять ватт.',
          'Для депо это очень мало. Но и панели, и мощность сосчитаны верно.',
          'Значит, ошибка внутри записи расчёта. Как ты думаешь, что пропустил Bit? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The Lumo City engineering centre has installed solar panels over the transport depot.',
          'There are four hundred and fifty-nine panels in all. Each panel gives three hundred and seventy-five watts.',
          'The depot needs at least one hundred and seventy thousand watts. Bit calculated and got twenty-two thousand one hundred and twenty-five watts.',
          'That is far too little for the depot. Yet both the panels and the power were counted correctly.',
          'So the error is inside the written calculation. What do you think Bit left out? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Tayanch', ru: 'Опора', en: 'What you know' },
    title: {
      uz: "Bir xonaliga ko'paytiramiz va siljitamiz",
      ru: 'Умножаем на однозначное и сдвигаем',
      en: 'Multiply by one digit, then shift',
    },
    lead: {
      uz: "O'nga ko'paytirish sonni bitta xonaga, yuzga ko'paytirish ikkita xonaga chapga suradi.",
      ru: 'Умножение на десять сдвигает число на один разряд, на сто — на два разряда влево.',
      en: 'Multiplying by ten shifts the number one place, by a hundred two places to the left.',
    },
    note: {
      uz: "Shu uchta qadam keyingi hamma qatorlarning asosi bo'ladi.",
      ru: 'Эти три шага — основа всех следующих строк.',
      en: 'These three steps are the basis of every row that follows.',
    },
    audio: {
      intro: {
        uz: [
          "Yangi usulni boshlashdan oldin uchta tanish qadamni tiklaymiz.",
          "Uch yuz yetmish beshni to'qqizga ko'paytiramiz, uch ming uch yuz yetmish besh chiqadi. Bu oddiy bir xonaliga ko'paytirish.",
          "Endi o'nga ko'paytiramiz. Raqamlar bitta xonaga chapga suriladi va oxirida nol paydo bo'ladi.",
          "Yuzga ko'paytirganda esa raqamlar ikkita xonaga suriladi va ikkita nol qo'shiladi. Shu siljish bugungi darsning kaliti.",
        ],
        ru: [
          'Прежде чем взяться за новый способ, восстановим три знакомых шага.',
          'Умножим триста семьдесят пять на девять, получится три тысячи триста семьдесят пять. Это обычное умножение на однозначное число.',
          'Теперь умножим на десять. Цифры сдвигаются на один разряд влево, и в конце появляется ноль.',
          'А при умножении на сто цифры сдвигаются на два разряда и добавляются два нуля. Именно этот сдвиг и есть ключ сегодняшнего урока.',
        ],
        en: [
          'Before we take on the new method, let us bring back three familiar steps.',
          'Multiply three hundred and seventy-five by nine and you get three thousand three hundred and seventy-five. That is ordinary one-digit multiplication.',
          'Now multiply by ten. The digits move one place to the left and a zero appears at the end.',
          'And multiplying by a hundred moves the digits two places and adds two zeros. That shift is the key to this lesson.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: "Ikkinchi qator", ru: 'Строка десятков', en: 'The tens row' },
    title: { uz: "376 ni 68 ga ko'paytiramiz", ru: 'Умножаем 376 на 68', en: 'Multiplying 376 by 68' },
    question: {
      uz: "O'nliklar qatori qaysi son bo'ladi?",
      ru: 'Какое число даёт строка десятков?',
      en: 'Which number does the tens row give?',
    },
    options: [
      { uz: '22 560', ru: '22 560', en: '22 560' },
      { uz: '2 256', ru: '2 256', en: '2 256' },
      { uz: '225 600', ru: '225 600', en: '225 600' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Oltilik o'nliklarda turadi, ya'ni oltmish. Uch yuz yetmish oltini oltmishga ko'paytirsak, yigirma ikki ming besh yuz oltmish chiqadi.",
      ru: 'Верно. Шестёрка стоит в десятках, то есть это шестьдесят. Триста семьдесят шесть на шестьдесят даёт двадцать две тысячи пятьсот шестьдесят.',
      en: 'Correct. The six stands in the tens, so it means sixty. Three hundred and seventy-six times sixty gives twenty-two thousand five hundred and sixty.',
    },
    wrong: [
      null,
      {
        uz: "Bu oltiga ko'paytirilgan. Lekin oltilik o'nliklar xonasida turibdi, demak oltmishga ko'paytirish kerak.",
        ru: 'Здесь умножено на шесть. Но шестёрка стоит в разряде десятков, значит умножать надо на шестьдесят.',
        en: 'This is multiplied by six. But the six stands in the tens place, so you must multiply by sixty.',
      },
      {
        uz: "Bu olti yuzga ko'paytirilgan. Oltilik o'nliklarda, yuzliklarda emas, shuning uchun siljish bitta xona bo'ladi.",
        ru: 'Здесь умножено на шестьсот. Шестёрка в десятках, а не в сотнях, поэтому сдвиг только на один разряд.',
        en: 'This is multiplied by six hundred. The six is in the tens, not the hundreds, so the shift is only one place.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Endi o'zingiz sinab ko'ring. Darslikdagi misol: uch yuz yetmish oltini oltmish sakkizga ko'paytiramiz.",
          "Birinchi qator tayyor: uch yuz yetmish oltini sakkizga ko'paytirsak, uch ming sakkiz chiqdi.",
          "Ikkinchi qatorni topish kerak. Ko'paytuvchidagi oltilik qaysi xonada turganiga qarang va javobni tanlang.",
        ],
        ru: [
          'Теперь попробуй сам. Пример из учебника: умножаем триста семьдесят шесть на шестьдесят восемь.',
          'Первая строка уже готова: триста семьдесят шесть на восемь дало три тысячи восемь.',
          'Осталось найти вторую строку. Посмотри, в каком разряде стоит шестёрка множителя, и выбери ответ.',
        ],
        en: [
          'Now try it yourself. The example from the textbook: multiply three hundred and seventy-six by sixty-eight.',
          'The first row is ready: three hundred and seventy-six times eight gave three thousand and eight.',
          'The second row is left to find. Look at which place the six of the multiplier stands in, and choose your answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: "Nechta qator kerak", ru: 'Сколько нужно строк', en: 'How many rows' },
    title: {
      uz: "Ko'paytuvchidagi har raqam bitta qator beradi",
      ru: 'Каждая цифра множителя даёт одну строку',
      en: 'Each digit of the multiplier gives one row',
    },
    lead: {
      uz: "Ikki xonali ko'paytuvchi ikkita to'liqsiz ko'paytma, uch xonali esa uchta to'liqsiz ko'paytma beradi.",
      ru: 'Двузначный множитель даёт два неполных произведения, трёхзначный — три.',
      en: 'A two-digit multiplier gives two partial products, a three-digit multiplier gives three.',
    },
    note: {
      uz: "Darslik atamasi: to'liqsiz ko'paytma.",
      ru: 'Термин учебника: неполное произведение.',
      en: 'The textbook term: partial product.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikning sakson oltinchi betida uch yuz yetmish besh soni avval ikki xonali, keyin uch xonali songa ko'paytirilgan.",
          "Ikki xonali ellik to'qqizga ko'paytirganda ikkita qator chiqdi: birliklar qatori va o'nliklar qatori.",
          "To'rt yuz ellik to'qqizga ko'paytirganda esa uchinchi qator qo'shiladi: yuzliklar qatori.",
          "Qoida oddiy. Ko'paytuvchida nechta raqam bo'lsa, shuncha to'liqsiz ko'paytma yoziladi. Bit aynan shu uchinchi qatorni unutgan edi.",
        ],
        ru: [
          'На восемьдесят шестой странице учебника число триста семьдесят пять умножили сначала на двузначное, потом на трёхзначное число.',
          'При умножении на двузначное пятьдесят девять получились две строки: строка единиц и строка десятков.',
          'А при умножении на четыреста пятьдесят девять добавляется третья строка, строка сотен.',
          'Правило простое. Сколько цифр в множителе, столько неполных произведений и записывают. Именно третью строку и забыл Bit.',
        ],
        en: [
          'On page eighty-six of the textbook the number three hundred and seventy-five was multiplied first by a two-digit, then by a three-digit number.',
          'Multiplying by the two-digit fifty-nine gave two rows: the ones row and the tens row.',
          'Multiplying by four hundred and fifty-nine adds a third row, the hundreds row.',
          'The rule is simple. However many digits the multiplier has, that many partial products are written. That third row is exactly what Bit forgot.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: "Ko'paytuvchiga qaraymiz", ru: 'Смотрим на множитель', en: 'Look at the multiplier' },
    title: { uz: '4972 × 418', ru: '4972 × 418', en: '4972 × 418' },
    question: {
      uz: "Bu misolda nechta to'liqsiz ko'paytma yoziladi?",
      ru: 'Сколько неполных произведений записывают в этом примере?',
      en: 'How many partial products are written in this example?',
    },
    options: [
      { uz: 'Uchta', ru: 'Три', en: 'Three' },
      { uz: 'Ikkita', ru: 'Два', en: 'Two' },
      { uz: "To'rtta", ru: 'Четыре', en: 'Four' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ko'paytuvchi to'rt yuz o'n sakkiz uch xonali, demak uchta to'liqsiz ko'paytma bo'ladi.",
      ru: 'Верно. Множитель четыреста восемнадцать трёхзначный, значит будет три неполных произведения.',
      en: 'Correct. The multiplier four hundred and eighteen has three digits, so there will be three partial products.',
    },
    wrong: [
      null,
      {
        uz: "Ikkita qator ikki xonali ko'paytuvchiga to'g'ri kelardi. Bu yerda ko'paytuvchida uchta raqam bor.",
        ru: 'Две строки подошли бы для двузначного множителя. Здесь в множителе три цифры.',
        en: 'Two rows would fit a two-digit multiplier. Here the multiplier has three digits.',
      },
      {
        uz: "Qatorlar soni ko'paytiriluvchiga emas, ko'paytuvchiga qarab olinadi. To'rt ming to'qqiz yuz yetmish ikkida to'rtta raqam bor, lekin sanash kerak bo'lgani ko'paytuvchi.",
        ru: 'Число строк берут по множителю, а не по множимому. В четырёх тысячах девятистах семидесяти двух четыре цифры, но считать надо множитель.',
        en: 'The number of rows comes from the multiplier, not from the number being multiplied. Four thousand nine hundred and seventy-two has four digits, but it is the multiplier you count.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning saksan yettinchi betidagi ikkinchi mashqdan misol olamiz.",
          "To'rt ming to'qqiz yuz yetmish ikkini to'rt yuz o'n sakkizga ko'paytiramiz.",
          "Yozuvni boshlashdan oldin nechta qator kerakligini aniqlang. Qaysi songa qarash kerakligini eslang.",
        ],
        ru: [
          'Возьмём пример из второго задания на восемьдесят седьмой странице учебника.',
          'Умножаем четыре тысячи девятьсот семьдесят два на четыреста восемнадцать.',
          'Прежде чем начать запись, определи, сколько нужно строк. Вспомни, на какое число при этом смотрят.',
        ],
        en: [
          'Let us take an example from task two on page eighty-seven of the textbook.',
          'We multiply four thousand nine hundred and seventy-two by four hundred and eighteen.',
          'Before starting the written work, decide how many rows are needed. Remember which number you look at for that.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Model', ru: 'Модель', en: 'Model' },
    title: {
      uz: 'Panellar uchta guruhga bo\'linadi',
      ru: 'Панели делятся на три группы',
      en: 'The panels split into three groups',
    },
    lead: {
      uz: "To'rt yuz ellik to'qqiz = to'rt yuz + ellik + to'qqiz. Har bir qism o'z guruhini beradi.",
      ru: 'Четыреста пятьдесят девять — это четыреста плюс пятьдесят плюс девять. Каждая часть даёт свою группу.',
      en: 'Four hundred and fifty-nine is four hundred plus fifty plus nine. Each part gives its own group.',
    },
    note: {
      uz: "Guruhlar quvvati qo'shilib, barcha panellarning quvvatini beradi.",
      ru: 'Мощности групп складываются и дают мощность всех панелей.',
      en: 'The group powers add up to the power of all the panels.',
    },
    audio: {
      intro: {
        uz: [
          "Endi panellarga qaraymiz. Ularni uchta guruhga ajratamiz.",
          "Birinchi guruhda to'qqizta panel. Ularning quvvati uch ming uch yuz yetmish besh vatt.",
          "Ikkinchi guruhda ellikta panel. Ularning quvvati o'n sakkiz ming yetti yuz ellik vatt.",
          "Uchinchi guruhda to'rt yuzta panel, va aynan shu guruh eng kattasi. Uni tashlab yuborsak, hisob kichkina bo'lib qoladi.",
        ],
        ru: [
          'Теперь посмотрим на панели. Разделим их на три группы.',
          'В первой группе девять панелей. Их мощность три тысячи триста семьдесят пять ватт.',
          'Во второй группе пятьдесят панелей. Их мощность восемнадцать тысяч семьсот пятьдесят ватт.',
          'В третьей группе четыреста панелей, и именно она самая большая. Если её пропустить, расчёт получается крошечным.',
        ],
        en: [
          'Now look at the panels. Let us split them into three groups.',
          'The first group has nine panels. Their power is three thousand three hundred and seventy-five watts.',
          'The second group has fifty panels. Their power is eighteen thousand seven hundred and fifty watts.',
          'The third group has four hundred panels, and it is the largest of all. Leave it out and the calculation becomes tiny.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Yuzliklar qatori', ru: 'Строка сотен', en: 'The hundreds row' },
    title: {
      uz: 'Yuzliklar qatori qayerdan boshlanadi?',
      ru: 'Где начинается строка сотен?',
      en: 'Where does the hundreds row begin?',
    },
    question: {
      uz: "150 000 qatorini qaysi xonadan boshlab yozamiz?",
      ru: 'С какого разряда начинаем писать строку 150 000?',
      en: 'From which place do we start writing the row 150 000?',
    },
    slots: [
      { label: { uz: 'Birliklardan', ru: 'С единиц', en: 'From the ones' }, caption: { uz: 'siljish 0', ru: 'сдвиг 0', en: 'shift 0' } },
      { label: { uz: "O'nliklardan", ru: 'С десятков', en: 'From the tens' }, caption: { uz: 'siljish 1', ru: 'сдвиг 1', en: 'shift 1' } },
      { label: { uz: 'Yuzliklardan', ru: 'С сотен', en: 'From the hundreds' }, caption: { uz: 'siljish 2', ru: 'сдвиг 2', en: 'shift 2' } },
    ],
    correctSlot: 2,
    correctText: {
      uz: "To'g'ri. To'rtlik yuzliklar xonasida turadi, shuning uchun qator ikkita xonaga suriladi.",
      ru: 'Верно. Четвёрка стоит в разряде сотен, поэтому строка сдвигается на два разряда.',
      en: 'Correct. The four stands in the hundreds place, so the row moves two places.',
    },
    wrong: [
      {
        uz: "Birliklardan boshlash birinchi qatorga to'g'ri keladi. To'rtlik esa yuzliklarda turibdi.",
        ru: 'С единиц начинают первую строку. А четвёрка стоит в сотнях.',
        en: 'The first row starts from the ones. But the four stands in the hundreds.',
      },
      {
        uz: "Bitta xona siljish o'nliklar qatoriga tegishli. Yuzliklar uchun siljish ikkita xona bo'ladi.",
        ru: 'Сдвиг на один разряд относится к строке десятков. Для сотен сдвиг равен двум разрядам.',
        en: 'A shift of one place belongs to the tens row. For the hundreds the shift is two places.',
      },
      null,
    ],
    audio: {
      intro: {
        uz: [
          "Uchinchi guruhning quvvati topildi: bir yuz ellik ming vatt.",
          "Endi bu sonni ustunga to'g'ri qo'yish kerak. Qator qaysi xonadan boshlansa, javob ham shunga bog'liq.",
          "Ko'paytuvchidagi to'rtlik qaysi xonada turganini eslang va kerakli katakni bosing.",
        ],
        ru: [
          'Мощность третьей группы найдена: сто пятьдесят тысяч ватт.',
          'Теперь это число надо правильно поставить в столбик. От того, с какого разряда начинается строка, зависит и ответ.',
          'Вспомни, в каком разряде стоит четвёрка множителя, и нажми нужную клетку.',
        ],
        en: [
          'The power of the third group is found: one hundred and fifty thousand watts.',
          'Now this number must be placed correctly in the column. The answer depends on which place the row starts from.',
          'Remember which place the four of the multiplier stands in, and tap the right cell.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Model', ru: 'Модель', en: 'Model' },
    title: {
      uz: "Uch qator bitta natijani beradi",
      ru: 'Три строки дают один результат',
      en: 'Three rows give one result',
    },
    lead: {
      uz: "Qatorlar birliklar xonasi bo'yicha tekislanadi va qo'shiladi.",
      ru: 'Строки выравнивают по разряду единиц и складывают.',
      en: 'The rows are lined up by the ones place and added.',
    },
    note: {
      uz: "Bir yuz yetmish ikki ming bir yuz yigirma besh vatt — barcha panellarning quvvati.",
      ru: 'Сто семьдесят две тысячи сто двадцать пять ватт — полная мощность всех панелей.',
      en: 'One hundred and seventy-two thousand one hundred and twenty-five watts is the full power of all the panels.',
    },
    audio: {
      intro: {
        uz: [
          "Uchala guruh tayyor. Endi ularni bitta ustunga yig'amiz.",
          "Muhim shart: qatorlar bir birining tagida xona ostiga xona bo'lib turishi kerak, aks holda qo'shish noto'g'ri chiqadi.",
          "Uch ming uch yuz yetmish besh, o'n sakkiz ming yetti yuz ellik va bir yuz ellik ming qo'shiladi.",
          "Natija bir yuz yetmish ikki ming bir yuz yigirma besh vatt. Depoga kerak bo'lganidan ko'proq, demak panellar yetadi.",
        ],
        ru: [
          'Все три группы готовы. Теперь соберём их в один столбик.',
          'Важное условие: строки должны стоять разряд под разрядом, иначе сложение выйдет неверным.',
          'Складываем три тысячи триста семьдесят пять, восемнадцать тысяч семьсот пятьдесят и сто пятьдесят тысяч.',
          'Получается сто семьдесят две тысячи сто двадцать пять ватт. Это больше, чем нужно депо, значит панелей хватает.',
        ],
        en: [
          'All three groups are ready. Now we collect them into one column.',
          'One condition matters: the rows must stand place under place, otherwise the addition comes out wrong.',
          'We add three thousand three hundred and seventy-five, eighteen thousand seven hundred and fifty, and one hundred and fifty thousand.',
          'The result is one hundred and seventy-two thousand one hundred and twenty-five watts. That is more than the depot needs, so the panels are enough.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: "Uch qatorni qo'shamiz", ru: 'Складываем три строки', en: 'Adding three rows' },
    title: { uz: '727 × 641', ru: '727 × 641', en: '727 × 641' },
    question: {
      uz: "Uchala qator qo'shilganda qaysi natija chiqadi?",
      ru: 'Какой результат даёт сложение всех трёх строк?',
      en: 'Which result does adding all three rows give?',
    },
    options: [
      { uz: '466 007', ru: '466 007', en: '466 007' },
      { uz: '29 807', ru: '29 807', en: '29 807' },
      { uz: '73 427', ru: '73 427', en: '73 427' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yetti yuz yigirma yetti qo'shuv yigirma to'qqiz ming sakson qo'shuv to'rt yuz o'ttiz olti ming ikki yuz. Natija to'rt yuz oltmish olti ming yetti.",
      ru: 'Верно. Семьсот двадцать семь плюс двадцать девять тысяч восемьдесят плюс четыреста тридцать шесть тысяч двести. Итог четыреста шестьдесят шесть тысяч семь.',
      en: 'Correct. Seven hundred and twenty-seven plus twenty-nine thousand and eighty plus four hundred and thirty-six thousand two hundred. The result is four hundred and sixty-six thousand and seven.',
    },
    wrong: [
      null,
      {
        uz: "Bu yerda faqat ikkita qator qo'shilgan, yuzliklar qatori tushib qolgan. Oltilik olti yuzni bildiradi.",
        ru: 'Здесь сложены только две строки, строка сотен пропала. Шестёрка означает шестьсот.',
        en: 'Only two rows are added here, the hundreds row has been dropped. The six means six hundred.',
      },
      {
        uz: "Yuzliklar qatori bitta xonaga siljigan. To'rt yuz o'ttiz olti ming ikki yuz o'rniga qirq uch ming olti yuz yigirma olingan.",
        ru: 'Строка сотен сдвинута на один разряд. Вместо четырёхсот тридцати шести тысяч двухсот взято сорок три тысячи шестьсот двадцать.',
        en: 'The hundreds row is shifted by one place. Instead of four hundred and thirty-six thousand two hundred it took forty-three thousand six hundred and twenty.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning saksan yettinchi betidan yana bir misol: yetti yuz yigirma yettini olti yuz qirq birga ko'paytiramiz.",
          "Uchala to'liqsiz ko'paytma ekranda tayyor turibdi.",
          "Ularni diqqat bilan qo'shing va to'g'ri natijani tanlang. Har bir qator qaysi xonadan boshlanganiga e'tibor bering.",
        ],
        ru: [
          'Ещё пример с восемьдесят седьмой страницы учебника: умножаем семьсот двадцать семь на шестьсот сорок один.',
          'Все три неполных произведения уже готовы на экране.',
          'Сложи их внимательно и выбери верный результат. Обрати внимание, с какого разряда начинается каждая строка.',
        ],
        en: [
          'Another example from page eighty-seven of the textbook: multiply seven hundred and twenty-seven by six hundred and forty-one.',
          'All three partial products are already on the screen.',
          'Add them carefully and choose the right result. Notice which place each row starts from.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: "Nolli ko'paytuvchi", ru: 'Множитель с нулём', en: 'A multiplier with a zero' },
    title: {
      uz: "Ko'paytuvchidagi nol tasmani bo'sh qoldiradi",
      ru: 'Ноль в множителе оставляет полосу пустой',
      en: 'A zero in the multiplier leaves a band empty',
    },
    lead: {
      uz: "607 da o'nliklar yo'q, shuning uchun faqat ikkita to'liqsiz ko'paytma yoziladi.",
      ru: 'В числе 607 нет десятков, поэтому записывают только два неполных произведения.',
      en: 'The number 607 has no tens, so only two partial products are written.',
    },
    note: {
      uz: "Darslik, 88-bet: nima uchun bunday hollarda faqat ikkita qator yoziladi.",
      ru: 'Учебник, страница 88: почему в таких случаях пишут только две строки.',
      en: 'Textbook, page 88: why only two rows are written in such cases.',
    },
    audio: {
      intro: {
        uz: [
          "Endi maxsus holatni ko'ramiz. Depoda boshqa turdagi panellar ham bor: besh yuz yigirma to'rt vattdan.",
          "Panellar soni olti yuz yetti. Bu sonda o'nliklar yo'q, o'rtada nol turibdi.",
          "Nolga ko'paytirsak, butun qator nol bo'ladi. Nolni qo'shish esa natijani o'zgartirmaydi.",
          "Shuning uchun bunday hollarda bo'sh qatorni yozmaydilar. Faqat birliklar va yuzliklar qatori qoladi, ya'ni ikkita qator.",
        ],
        ru: [
          'Теперь разберём особый случай. В депо есть панели другого типа, по пятьсот двадцать четыре ватта.',
          'Панелей шестьсот семь. В этом числе нет десятков, посередине стоит ноль.',
          'При умножении на ноль вся строка становится нулевой. А прибавление нуля результат не меняет.',
          'Поэтому в таких случаях пустую строку не записывают. Остаются только строка единиц и строка сотен, то есть две строки.',
        ],
        en: [
          'Now let us look at a special case. The depot also has panels of another type, of five hundred and twenty-four watts each.',
          'There are six hundred and seven panels. This number has no tens, a zero stands in the middle.',
          'Multiplying by zero makes the whole row zero. And adding zero does not change the result.',
          'So in such cases the empty row is not written. Only the ones row and the hundreds row remain, that is two rows.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Boshqa panellar', ru: 'Другие панели', en: 'Other panels' },
    title: { uz: '524 × 607', ru: '524 × 607', en: '524 × 607' },
    question: {
      uz: 'Bu panellarning quvvati qancha?',
      ru: 'Какова мощность этих панелей?',
      en: 'What is the power of these panels?',
    },
    options: [
      { uz: '318 068', ru: '318 068', en: '318 068' },
      { uz: '35 108', ru: '35 108', en: '35 108' },
      { uz: '3 668', ru: '3 668', en: '3 668' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uch ming olti yuz oltmish sakkiz qo'shuv uch yuz o'n to'rt ming to'rt yuz. Natija uch yuz o'n sakkiz ming oltmish sakkiz.",
      ru: 'Верно. Три тысячи шестьсот шестьдесят восемь плюс триста четырнадцать тысяч четыреста. Итог триста восемнадцать тысяч шестьдесят восемь.',
      en: 'Correct. Three thousand six hundred and sixty-eight plus three hundred and fourteen thousand four hundred. The result is three hundred and eighteen thousand and sixty-eight.',
    },
    wrong: [
      null,
      {
        uz: "Bu yerda nol tashlab yuborilgan va olti yuz yetti oltmish yetti deb olingan. Nol o'z xonasida qolishi kerak.",
        ru: 'Здесь ноль выброшен и шестьсот семь принято за шестьдесят семь. Ноль должен остаться на своём месте.',
        en: 'Here the zero was dropped and six hundred and seven was read as sixty-seven. The zero must stay in its place.',
      },
      {
        uz: "Bu faqat birliklar qatori. Yuzliklar qatori ham kerak, chunki ko'paytuvchida olti yuz bor.",
        ru: 'Это только строка единиц. Нужна ещё строка сотен, ведь в множителе есть шестьсот.',
        en: 'This is only the ones row. The hundreds row is needed too, because the multiplier contains six hundred.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning saksan sakkizinchi betidagi to'rtinchi mashq: besh yuz yigirma to'rtni olti yuz yettiga ko'paytiramiz.",
          "Yodda tuting: o'rtadagi nol tufayli faqat ikkita to'liqsiz ko'paytma bo'ladi.",
          "Yuzliklar qatorining siljishi qanchaligini tekshiring va javobni tanlang.",
        ],
        ru: [
          'Четвёртое задание на восемьдесят восьмой странице учебника: умножаем пятьсот двадцать четыре на шестьсот семь.',
          'Помни: из-за нуля посередине неполных произведений будет только два.',
          'Проверь, каким должен быть сдвиг строки сотен, и выбери ответ.',
        ],
        en: [
          'Task four on page eighty-eight of the textbook: multiply five hundred and twenty-four by six hundred and seven.',
          'Remember: because of the zero in the middle there will be only two partial products.',
          'Check what the shift of the hundreds row should be, and choose your answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Darslik rejasi', ru: 'План учебника', en: 'The textbook plan' },
    title: {
      uz: 'Uch xonali songa ko\'paytirish rejasi',
      ru: 'План умножения на трёхзначное число',
      en: 'The plan for multiplying by a three-digit number',
    },
    lead: {
      uz: "Darslikdagi reja, uch xonali ko'paytuvchi uchun kengaytirilgan.",
      ru: 'План из учебника, расширенный для трёхзначного множителя.',
      en: 'The textbook plan, extended for a three-digit multiplier.',
    },
    note: {
      uz: "Nol qatnashsa, bo'sh qator yozilmaydi.",
      ru: 'Если есть ноль, пустую строку не пишут.',
      en: 'If there is a zero, the empty row is not written.',
    },
    audio: {
      intro: {
        uz: [
          "Ochganimizni qoida qilib yig'amiz. Darslikdagi reja to'rt qadamdan iborat edi.",
          "Birinchi qadam: birliklar soniga ko'paytirib, birinchi to'liqsiz ko'paytmani hosil qilaman.",
          "Ikkinchi qadam: o'nliklar soniga ko'paytirib, ikkinchisini bitta xona chapga surib yozaman. Uchinchi qadam: yuzliklar soniga ko'paytirib, uchinchisini ikkita xona chapga surib yozaman.",
          "To'rtinchi qadam: to'liqsiz ko'paytmalarni qo'shaman va javobni o'qiyman. Agar ko'paytuvchida nol bo'lsa, o'sha qator yozilmaydi.",
        ],
        ru: [
          'Соберём открытое в правило. План в учебнике состоял из четырёх шагов.',
          'Первый шаг: умножаю на число единиц и получаю первое неполное произведение.',
          'Второй шаг: умножаю на число десятков и пишу второе со сдвигом на один разряд влево. Третий шаг: умножаю на число сотен и пишу третье со сдвигом на два разряда.',
          'Четвёртый шаг: складываю неполные произведения и читаю ответ. Если в множителе есть ноль, эту строку не пишут.',
        ],
        en: [
          'Let us gather what we found into a rule. The textbook plan had four steps.',
          'Step one: I multiply by the number of ones and get the first partial product.',
          'Step two: I multiply by the number of tens and write the second one shifted one place to the left. Step three: I multiply by the number of hundreds and write the third shifted two places.',
          'Step four: I add the partial products and read the answer. If the multiplier has a zero, that row is not written.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: "Qaysi yo'l qulay", ru: 'Какой путь удобнее', en: 'Which path is easier' },
    title: { uz: '321 × 940', ru: '321 × 940', en: '321 × 940' },
    question: {
      uz: 'Bu misolda qaysi yo\'l qulayroq?',
      ru: 'Какой путь удобнее в этом примере?',
      en: 'Which path is more convenient here?',
    },
    options: [
      {
        uz: "321 × 94 ni hisoblab, natijaga bitta nol qo'shish",
        ru: 'Посчитать 321 × 94 и приписать к результату один ноль',
        en: 'Work out 321 × 94 and add one zero to the result',
      },
      {
        uz: 'Uchta to\'liqsiz ko\'paytma yozish',
        ru: 'Записать три неполных произведения',
        en: 'Write three partial products',
      },
      {
        uz: "321 × 900 va 321 × 40 ni alohida hisoblab qo'shish",
        ru: 'Посчитать 321 × 900 и 321 × 40 отдельно и сложить',
        en: 'Work out 321 × 900 and 321 × 40 separately and add',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Nol oxirida turgani uchun uni vaqtincha ajratish mumkin: uch yuz yigirma bir karra to'qson to'rt o'ttiz ming bir yuz yetmish to'rt, oxiriga nol qo'shsak uch yuz bir ming yetti yuz qirq.",
      ru: 'Верно. Ноль стоит в конце, поэтому его можно временно отделить: триста двадцать один умножить на девяносто четыре будет тридцать тысяч сто семьдесят четыре, припишем ноль и получим триста одна тысяча семьсот сорок.',
      en: 'Correct. The zero stands at the end, so it can be set aside for a moment: three hundred and twenty-one times ninety-four is thirty thousand one hundred and seventy-four, add a zero and you get three hundred and one thousand seven hundred and forty.',
    },
    wrong: [
      null,
      {
        uz: "Bu yo'l ham to'g'ri javob beradi, lekin bitta qator butunlay noldan iborat bo'ladi. Nol oxirida turganda uni ajratish qisqaroq.",
        ru: 'Этот путь тоже даёт верный ответ, но одна строка окажется целиком нулевой. Когда ноль стоит в конце, отделить его короче.',
        en: 'This path also gives the right answer, but one row will be entirely zeros. When the zero is at the end, setting it aside is shorter.',
      },
      {
        uz: "Bu ham to'g'ri, lekin ikkita katta ko'paytirish bajarasiz. Oxirgi nolni ajratsangiz, bitta ko'paytirish yetadi.",
        ru: 'Это тоже верно, но ты выполнишь два больших умножения. Если отделить последний ноль, хватит одного.',
        en: 'This is right too, but you carry out two large multiplications. Setting aside the final zero leaves just one.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning saksan sakkizinchi betida yana bir misol bor: uch yuz yigirma birni to'qqiz yuz qirqqa ko'paytirish.",
          "Bu yerda nol o'rtada emas, oxirida turibdi. Shuning uchun uchta yo'l ham to'g'ri javob beradi.",
          "Savol boshqacha: qaysi biri qulayroq va kamroq ish talab qiladi? Tanlang va sababini eshiting.",
        ],
        ru: [
          'На восемьдесят восьмой странице учебника есть ещё пример: умножить триста двадцать один на девятьсот сорок.',
          'Здесь ноль стоит не посередине, а в конце. Поэтому все три пути дают верный ответ.',
          'Вопрос в другом: какой из них удобнее и требует меньше работы? Выбери и послушай почему.',
        ],
        en: [
          'On page eighty-eight of the textbook there is one more example: multiply three hundred and twenty-one by nine hundred and forty.',
          'Here the zero stands not in the middle but at the end. So all three paths give the right answer.',
          'The question is different: which one is more convenient and takes less work? Choose and hear why.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bit ning yechimi", ru: 'Работа Bit', en: "Bit's work" },
    title: {
      uz: "Bit yechimini tekshiramiz: 861 × 323",
      ru: 'Проверяем решение Bit: 861 × 323',
      en: "Checking Bit's work: 861 × 323",
    },
    question: {
      uz: 'Qaysi qator noto\'g\'ri yozilgan?',
      ru: 'Какая строка записана неверно?',
      en: 'Which row is written incorrectly?',
    },
    options: [
      { uz: 'Yuzliklar qatori', ru: 'Строка сотен', en: 'The hundreds row' },
      { uz: "O'nliklar qatori", ru: 'Строка десятков', en: 'The tens row' },
      { uz: 'Birliklar qatori', ru: 'Строка единиц', en: 'The ones row' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yuzliklar qatori ikkita xona o'rniga bitta xonaga surilgan. To'g'ri qiymat ikki yuz ellik sakkiz ming uch yuz.",
      ru: 'Верно. Строка сотен сдвинута на один разряд вместо двух. Правильное значение двести пятьдесят восемь тысяч триста.',
      en: 'Correct. The hundreds row is shifted by one place instead of two. The correct value is two hundred and fifty-eight thousand three hundred.',
    },
    wrong: [
      null,
      {
        uz: "O'nliklar qatori to'g'ri: sakkiz yuz oltmish bir karra yigirma o'n yetti ming ikki yuz, bitta xonaga surilgan.",
        ru: 'Строка десятков верна: восемьсот шестьдесят один на двадцать даёт семнадцать тысяч двести, сдвиг на один разряд.',
        en: 'The tens row is right: eight hundred and sixty-one times twenty gives seventeen thousand two hundred, shifted one place.',
      },
      {
        uz: "Birliklar qatori ham to'g'ri: sakkiz yuz oltmish bir karra uch ikki ming besh yuz sakson uch, siljishsiz.",
        ru: 'Строка единиц тоже верна: восемьсот шестьдесят один на три даёт две тысячи пятьсот восемьдесят три, без сдвига.',
        en: 'The ones row is right too: eight hundred and sixty-one times three gives two thousand five hundred and eighty-three, with no shift.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Bit darslikning saksan yettinchi betidagi oltinchi mashqni ishladi va menga tekshirish uchun berdi.",
          "Uchala to'liqsiz ko'paytma ham to'g'ri hisoblangan, lekin natija juda kichkina chiqdi.",
          "Demak xato hisobda emas, qatorning o'rnida. Ustunga qarang va noto'g'ri turgan qatorni toping.",
        ],
        ru: [
          'Bit решил шестое задание с восемьдесят седьмой страницы учебника и дал мне на проверку.',
          'Все три неполных произведения посчитаны верно, но результат вышел слишком маленьким.',
          'Значит, ошибка не в вычислении, а в месте строки. Посмотри на столбик и найди строку, стоящую не там.',
        ],
        en: [
          'Bit solved task six from page eighty-seven of the textbook and gave it to me to check.',
          'All three partial products are calculated correctly, but the result came out far too small.',
          'So the error is not in the arithmetic but in the position of a row. Look at the column and find the row that stands in the wrong place.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: "The city's decision" },
    title: {
      uz: 'Depo uchun yakuniy javob',
      ru: 'Итоговый ответ для депо',
      en: 'The final answer for the depot',
    },
    question: {
      uz: 'Panellar depoga yetadimi?',
      ru: 'Хватает ли панелей для депо?',
      en: 'Are the panels enough for the depot?',
    },
    options: [
      { uz: "Ha, 2 125 vatt ortadi", ru: 'Да, останется 2 125 ватт', en: 'Yes, 2 125 watts are left over' },
      { uz: "Yo'q, quvvat yetmaydi", ru: 'Нет, мощности не хватает', en: 'No, there is not enough power' },
      { uz: "Aniqlab bo'lmaydi", ru: 'Определить нельзя', en: 'It cannot be decided' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bir yuz yetmish ikki ming bir yuz yigirma beshdan bir yuz yetmish mingni ayirsak, ikki ming bir yuz yigirma besh vatt ortadi.",
      ru: 'Верно. Из ста семидесяти двух тысяч ста двадцати пяти вычтем сто семьдесят тысяч и получим две тысячи сто двадцать пять ватт запаса.',
      en: 'Correct. Take one hundred and seventy thousand from one hundred and seventy-two thousand one hundred and twenty-five and two thousand one hundred and twenty-five watts are left.',
    },
    wrong: [
      null,
      {
        uz: "Yetmaydi degan javob Bit ning eski hisobiga to'g'ri kelardi. To'liq hisobda quvvat kerakligidan ko'proq.",
        ru: 'Ответ не хватает подходил к старому расчёту Bit. В полном расчёте мощности больше, чем нужно.',
        en: 'The answer not enough matched the old calculation of Bit. In the full calculation there is more power than needed.',
      },
      {
        uz: "Aniqlash mumkin: ikkala son ham ma'lum. Panellar quvvatidan deponing ehtiyojini ayirish yetarli.",
        ru: 'Определить можно: оба числа известны. Достаточно вычесть потребность депо из мощности панелей.',
        en: 'It can be decided: both numbers are known. It is enough to subtract the need of the depot from the power of the panels.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Endi shahar qaroriga qaytamiz. Panellarning to'liq quvvati bir yuz yetmish ikki ming bir yuz yigirma besh vatt.",
          "Depo esa kamida bir yuz yetmish ming vatt so'ragan edi.",
          "Ikki sonni taqqoslang va muhandislik markazi qanday qaror qabul qilishi kerakligini ayting.",
        ],
        ru: [
          'Теперь вернёмся к решению города. Полная мощность панелей сто семьдесят две тысячи сто двадцать пять ватт.',
          'А депо просило не меньше ста семидесяти тысяч ватт.',
          'Сравни два числа и скажи, какое решение должен принять инженерный центр.',
        ],
        en: [
          'Now back to the decision of the city. The full power of the panels is one hundred and seventy-two thousand one hundred and twenty-five watts.',
          'And the depot asked for at least one hundred and seventy thousand watts.',
          'Compare the two numbers and say what decision the engineering centre should take.',
        ],
      },
    },
  },

  // Yakuniy ekran etalon Dars01 tuzilishi bo'yicha: bitta refleksiya savoli
  // unvonni ochadi, yonida qoida recapi va keyingi missiyaga ko'prik turadi.
  s15: {
    eyebrow: { uz: 'Missiya mukofoti', ru: 'Награда за миссию', en: 'Mission award' },
    stageLabel: { uz: 'Yakuniy bosqich', ru: 'Финальный этап', en: 'Final stage' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: "Yuzliklar qatori qayerdan boshlanishini ayting va unvonni oling.",
      ru: 'Скажи, с какого разряда начинается строка сотен, и получи звание.',
      en: 'Say where the hundreds row starts and claim your title.',
    },
    questionKicker: { uz: 'Yakuniy savol', ru: 'Финальный вопрос', en: 'Final question' },
    stepLabel: { uz: '1 qadam', ru: '1 шаг', en: '1 step' },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    // .find() birinchi mos keladiganini oladi, shuning uchun min bo'yicha kamayish tartibida.
    awards: [
      { min: 5, title: { uz: 'Qator muhandisi', ru: 'Инженер строк', en: 'Row engineer' } },
      { min: 3, title: { uz: "Ustun yig'uvchisi", ru: 'Сборщик столбика', en: 'Column builder' } },
      { min: 0, title: { uz: 'Muhandis yordamchisi', ru: 'Помощник инженера', en: "Engineer's assistant" } },
    ],
    reflectionQuestion: {
      uz: "Yuzliklar qatori ustunda qanday yoziladi?",
      ru: 'Как записывается строка сотен в столбике?',
      en: 'How is the hundreds row written in the column?',
    },
    reflectionStart: {
      uz: "Yuzliklar qatorini yozish uchun men uni…",
      ru: 'Чтобы записать строку сотен, я…',
      en: 'To write the hundreds row, I…',
    },
    reflectionOptions: [
      { uz: 'ikkita xona chapga suraman', ru: 'сдвигаю на два разряда влево', en: 'shift it two places to the left' },
      { uz: 'bitta xona chapga suraman', ru: 'сдвигаю на один разряд влево', en: 'shift it one place to the left' },
      { uz: 'hech qayerga surmayman', ru: 'никуда не сдвигаю', en: 'do not shift it at all' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "To'g'ri. Ko'paytuvchining yuzliklar raqami yuzlarni bildiradi, shuning uchun qator ikkita xonaga suriladi. Unvon ochildi.",
      ru: 'Верно. Цифра сотен множителя означает сотни, поэтому строка сдвигается на два разряда. Звание открыто.',
      en: 'Correct. The hundreds digit of the multiplier means hundreds, so the row shifts two places. The title is unlocked.',
    },
    reflectionWrong: {
      uz: "Bitta xona siljish o'nliklar qatoriga tegishli. Yuzliklar uchun nechta xona kerakligini eslang.",
      ru: 'Сдвиг на один разряд относится к строке десятков. Вспомни, сколько разрядов нужно для сотен.',
      en: 'A shift of one place belongs to the tens row. Remember how many places the hundreds need.',
    },
    mainLabel: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    main: [
      {
        uz: "Ko'paytuvchida nechta raqam, shuncha qator.",
        ru: 'Сколько цифр в множителе, столько строк.',
        en: 'As many digits in the multiplier, as many rows.',
      },
      {
        uz: "O'nliklar qatori bitta xonaga suriladi.",
        ru: 'Строка десятков сдвигается на один разряд.',
        en: 'The tens row shifts one place.',
      },
      {
        uz: 'Yuzliklar qatori ikkita xonaga suriladi.',
        ru: 'Строка сотен сдвигается на два разряда.',
        en: 'The hundreds row shifts two places.',
      },
      {
        uz: "Nol qatnashsa, bo'sh qator yozilmaydi.",
        ru: 'Если есть ноль, пустую строку не пишут.',
        en: 'If there is a zero, the empty row is not written.',
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Shu quvvatni depolar orasida teng taqsimlash, ya'ni yozma bo'lishni o'rganish.",
      ru: 'Разделить эту мощность между депо поровну, то есть освоить письменное деление.',
      en: 'Share this power equally between the depots, that is, take up written division.',
    },
    audio: {
      intro: {
        uz: [
          "Missiya bajarildi. Quyosh panellari ishga tushdi va depo quvvat oldi.",
          "Bugun siz uch xonali songa ko'paytirishni o'rgandingiz: har raqam o'z qatorini beradi, yuzliklar qatori ikkita xonaga suriladi, nol esa qator yozdirmaydi.",
          "Unvonni ochish uchun bitta savol qoldi. Yuzliklar qatori ustunda qanday yozilishini tanlang.",
        ],
        ru: [
          'Миссия выполнена. Солнечные панели запущены, и депо получило мощность.',
          'Теперь ты умеешь умножать на трёхзначное число. Каждая цифра даёт свою строку, строка сотен сдвигается на два разряда, а ноль строку не создаёт.',
          'До звания остался один вопрос. Выбери, как записывается строка сотен в столбике.',
        ],
        en: [
          'Mission complete. The solar panels are running and the depot has its power.',
          'Today you learned to multiply by a three-digit number: each digit gives its own row, the hundreds row shifts two places, and a zero creates no row.',
          'One question stands between you and the title. Choose how the hundreds row is written in the column.',
        ],
      },
    },
  },
};

// ===========================================================================
// CHIZMALAR
//
// Ikki qoida:
//   1) Rasm haqiqiyga yaqin: panel — alyumin ramka, to'q ko'k monokristall
//      xujayralar, kumush shinalar, shisha yaltirashi; depo — qiya tomli
//      sanoat binosi, panellar tom ustida turadi.
//   2) viewBox nisbati model zonasiga yaqin (taxminan 1.75), shuning uchun
//      chizma katta oq maydonda suzib qolmaydi.
// ===========================================================================

const PanelDefs = () => (
  <defs>
    <linearGradient id="d11cell" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stopColor="#1E5384" />
      <stop offset="45%" stopColor="#123A5E" />
      <stop offset="100%" stopColor="#0A2039" />
    </linearGradient>
    <linearGradient id="d11frame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#E4EAEE" />
      <stop offset="50%" stopColor="#B4C0C9" />
      <stop offset="100%" stopColor="#8A97A2" />
    </linearGradient>
    <linearGradient id="d11glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.26" />
      <stop offset="34%" stopColor="#FFFFFF" stopOpacity="0.06" />
      <stop offset="58%" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="d11sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#0B2032" />
      <stop offset="62%" stopColor="#153B50" />
      <stop offset="100%" stopColor="#1D4E63" />
    </linearGradient>
    <linearGradient id="d11wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1B4257" />
      <stop offset="100%" stopColor="#102B3D" />
    </linearGradient>
    <linearGradient id="d11roof" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#2A5C74" />
      <stop offset="100%" stopColor="#1A4258" />
    </linearGradient>
  </defs>
);

// Bitta quyosh paneli. `accent` — ramka rangi (guruhni ajratish uchun);
// xujayralar har doim to'q ko'k qoladi, aks holda panel haqiqiyligini yo'qotadi.
const Panel = ({ x, y, w, h, cols = 3, rows = 2, dim = false, accent = null }) => {
  const pad = Math.max(0.9, w * 0.045);
  const cw = (w - pad * (cols + 1)) / cols;
  const ch = (h - pad * (rows + 1)) / rows;
  if (cw <= 0.4 || ch <= 0.4) {
    return <rect x={x} y={y} width={w} height={h} rx="1.2" fill="#123A5E" opacity={dim ? 0.3 : 1} />;
  }
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cx = x + pad + c * (cw + pad);
      const cy = y + pad + r * (ch + pad);
      cells.push(
        <g key={`${r}-${c}`}>
          <rect x={cx} y={cy} width={cw} height={ch} rx={Math.min(1.2, cw * 0.12)} fill="url(#d11cell)" />
          {cw > 4 && (
            <>
              <line x1={cx + cw * 0.36} y1={cy + 0.6} x2={cx + cw * 0.36} y2={cy + ch - 0.6} stroke="#A9C0CF" strokeWidth={Math.max(0.3, cw * 0.03)} opacity="0.5" />
              <line x1={cx + cw * 0.68} y1={cy + 0.6} x2={cx + cw * 0.68} y2={cy + ch - 0.6} stroke="#A9C0CF" strokeWidth={Math.max(0.3, cw * 0.03)} opacity="0.5" />
            </>
          )}
        </g>,
      );
    }
  }
  const r = Math.min(2.2, w * 0.05);
  return (
    <g opacity={dim ? 0.34 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={accent || 'url(#d11frame)'} />
      <rect x={x + 0.8} y={y + 0.8} width={w - 1.6} height={h - 1.6} rx={Math.max(0.6, r - 0.7)} fill="#0A1E33" />
      {cells}
      <rect x={x} y={y} width={w} height={h} rx={r} fill="url(#d11glass)" />
    </g>
  );
};

// Panellar to'plami: berilgan to'rtburchakni panellar bilan aniq to'ldiradi.
const PanelBlock = ({ x, y, w, h, cols, rows, gap = 2, dim = false, accent = null }) => {
  const pw = (w - gap * (cols - 1)) / cols;
  const ph = (h - gap * (rows - 1)) / rows;
  const out = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      out.push(
        <Panel
          key={`${r}-${c}`}
          x={x + c * (pw + gap)}
          y={y + r * (ph + gap)}
          w={pw}
          h={ph}
          cols={pw > 9 ? 3 : 2}
          rows={ph > 9 ? 2 : 1}
          dim={dim}
          accent={accent}
        />,
      );
    }
  }
  return <g>{out}</g>;
};

// s0 va s14 — depo binosi va uning qiya tomidagi panellar.
const RoofScene = ({ solved = false, mode = 'hook' }) => {
  const t = useT();
  // Yetishmayotgan guruh FAQAT bola javob bergach yonadi: ovoz kadri uni
  // oldindan ochib qo'ysa, savol ma'nosini yo'qotadi.
  const showThird = mode === 'final' || solved;
  // Guruh kengliklari panellar soniga qarab tartiblangan: 9 eng kichik,
  // 400 eng katta. Teskarisi bolani chalg'itadi.
  const groups = [
    { key: 'g9', label: '9', w: 44, cols: 2, color: null, dim: false },
    { key: 'g50', label: '50', w: 108, cols: 5, color: '#8FBF4F', dim: false },
    { key: 'g400', label: '400', w: 236, cols: 11, color: '#F0784A', dim: !showThird },
  ];
  const gapX = 14;
  const rowCount = 4;
  return (
    <div className="hero-scene">
      <div className="hero-head">
        <span>
          {t({
            uz: 'LUMO CITY · DEPO · QUYOSH PANELLARI',
            ru: 'LUMO CITY · ДЕПО · СОЛНЕЧНЫЕ ПАНЕЛИ',
            en: 'LUMO CITY · DEPOT · SOLAR PANELS',
          })}
        </span>
        <span className={showThird ? 'hero-state' : 'hero-state hero-state-alert'}>
          {showThird ? '172 125 W' : '22 125 W'}
        </span>
      </div>
      <div className="hero-body">
        <FitSvg viewBox="0 0 560 250">
          <PanelDefs />
          <defs>
            <radialGradient id="d11sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE9C4" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#FFCF97" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FFCF97" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="560" height="250" rx="16" fill="url(#d11sky)" />
          <circle cx="498" cy="44" r="44" fill="url(#d11sun)" />
          <circle cx="498" cy="44" r="13" fill="#FFEFD4" />
          <path d="M58 40 q16 -11 33 -3 q10 -13 26 -5 q13 -9 23 4 q-41 8 -82 4 Z" fill="#8FB2C6" opacity="0.16" />

          {/* yer */}
          <rect x="0" y="214" width="560" height="36" fill="#081926" />
          <rect x="0" y="212" width="560" height="3" fill="#2A6180" opacity="0.6" />

          {/* depo: devor */}
          <path d="M96 214 L96 162 L464 162 L464 214 Z" fill="url(#d11wall)" />
          <path d="M96 162 L464 162" stroke="#3E7F9C" strokeWidth="1.4" opacity="0.6" />
          <rect x="246" y="178" width="88" height="36" rx="3" fill="#0A2334" stroke="#2F6A86" strokeWidth="1.3" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={`gate-${i}`} x={251 + i * 21} y={182} width="16" height="28" rx="2" fill="#14384D" />
          ))}
          {[118, 148, 178, 388, 418].map((wx) => (
            <rect key={wx} x={wx} y={182} width="20" height="13" rx="2" fill="#FFCF9A" opacity="0.38" />
          ))}

          {/* tom tekisligi: qiya, perspektivada */}
          <path d="M84 162 L150 92 L494 92 L464 162 Z" fill="url(#d11roof)" />
          <path d="M84 162 L150 92 L494 92 L464 162 Z" fill="none" stroke="#4A93AF" strokeWidth="1.6" opacity="0.45" />

          {/* panellar tom tekisligining ichida: har qator uchun tom qirralari
              hisoblanadi va guruhlar shu kenglikka siqiladi */}
          {Array.from({ length: rowCount }, (_, r) => {
            const y = 143 - r * 15;
            const k = (162 - y) / 70;
            const edgeL = 84 + k * 66 + 9;
            const edgeR = 464 + k * 30 - 9;
            const avail = edgeR - edgeL;
            const raw = groups.reduce((sum, g) => sum + g.w, 0) + gapX * (groups.length - 1);
            const k2 = avail / raw;
            let cursor = edgeL;
            return (
              <g key={`row-${r}`}>
                <rect x={edgeL - 4} y={y + 12} width={avail + 8} height="1.8" fill="#93A8B5" opacity="0.28" />
                {groups.map((group) => {
                  const w = group.w * k2;
                  const x = cursor;
                  cursor += w + gapX * k2;
                  return (
                    <PanelBlock
                      key={group.key}
                      x={x}
                      y={y}
                      w={w}
                      h={12}
                      cols={group.cols}
                      rows={1}
                      gap={1.6}
                      accent={group.color}
                      dim={group.dim}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* guruh yorliqlari — tom ostida, devorga tushmaydi */}
          {(() => {
            const edgeL = 84 + (162 - 143) / 70 * 66 + 9;
            const edgeR = 464 + (162 - 143) / 70 * 30 - 9;
            const raw = groups.reduce((sum, g) => sum + g.w, 0) + gapX * (groups.length - 1);
            const k2 = (edgeR - edgeL) / raw;
            let cursor = edgeL;
            return groups.map((group) => {
              const x = cursor + (group.w * k2) / 2;
              cursor += group.w * k2 + gapX * k2;
              return (
                <g key={`label-${group.key}`}>
                  <path d={`M${x} 158 L${x} 168`} stroke={group.color || '#9DE3E7'} strokeWidth="1.4" opacity="0.55" />
                  <rect x={x - 22} y="168" width="44" height="20" rx="7" fill="#06131F" opacity="0.82" />
                  <text
                    x={x}
                    y="182"
                    textAnchor="middle"
                    fill={group.dim ? '#8DA0AC' : (group.color || '#9DE3E7')}
                    fontSize="13"
                    fontWeight="800"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {group.label}
                  </text>
                </g>
              );
            });
          })()}

          {!showThird && (
            <g>
              <rect x="352" y="34" width="106" height="26" rx="9" fill="#4A2114" opacity="0.92" />
              <text x="405" y="51" textAnchor="middle" fill="#FFC0A8" fontSize="13" fontWeight="800" fontFamily="Manrope, sans-serif">
                400 ?
              </text>
              <path d="M405 60 L405 78" stroke="#F0784A" strokeWidth="1.8" strokeDasharray="4 4" />
              <path d="M405 82 l-5 -8 h10 z" fill="#F0784A" />
            </g>
          )}
        </FitSvg>
      </div>
    </div>
  );
};


// s1, s2 — siljish: 375 × 9, × 10, × 100
const ShiftFigure = ({ frame = 0, solved = false, mode = 's1' }) => {
  const rows = mode === 's1'
    ? [
      { label: '375 × 9', value: '3375', shift: 0, on: frame >= 1 },
      { label: '375 × 10', value: '3750', shift: 1, on: frame >= 2 },
      { label: '375 × 100', value: '37500', shift: 2, on: frame >= 3 },
    ]
    : [
      { label: '376 × 8', value: '3008', shift: 0, on: true },
      { label: '376 × 60', value: solved ? '22560' : '?', shift: 1, on: solved },
    ];
  const colors = [T.ink3, T.cyan, T.accent];
  return (
    <FitSvg viewBox="0 0 520 232">
      {rows.map((row, index) => {
        const y = 34 + index * 62;
        const color = colors[row.shift];
        return (
          <g key={row.label} opacity={row.on ? 1 : 0.32} style={{ transition: 'opacity .45s' }}>
            <text x="24" y={y + 27} fill={T.ink2} fontSize="15" fontWeight="700" fontFamily="Manrope, sans-serif">
              {row.label}
            </text>
            {row.shift > 0 && (
              <g>
                <path
                  d={`M164 ${y + 21} L${190 + row.shift * 30} ${y + 21}`}
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray="5 4"
                />
                <path d={`M${190 + row.shift * 30} ${y + 21} l-8 -5 v10 z`} fill={color} />
                <text x={`${177 + row.shift * 15}`} y={y + 11} textAnchor="middle" fill={color} fontSize="10" fontWeight="800" fontFamily="Manrope, sans-serif">
                  +{row.shift}
                </text>
              </g>
            )}
            <rect
              x={204 + row.shift * 30}
              y={y}
              width="228"
              height="42"
              rx="12"
              fill={row.on ? '#FFFFFF' : '#F3F6F5'}
              stroke={color}
              strokeWidth="2"
            />
            <text
              x={318 + row.shift * 30}
              y={y + 28}
              textAnchor="middle"
              fill={T.ink}
              fontSize="21"
              fontWeight="800"
              fontFamily="JetBrains Mono, monospace"
            >
              {row.value}
            </text>
          </g>
        );
      })}
    </FitSvg>
  );
};

// s3, s4 — ko'paytuvchining raqamlari va ularga mos qatorlar
const RowsFigure = ({ frame = 0, solved = false, reveal = true, multiplier = '459', product = '375' }) => {
  const t = useT();
  const digits = multiplier.split('');
  const names = [
    { uz: 'yuzliklar', ru: 'сотни', en: 'hundreds' },
    { uz: "o'nliklar", ru: 'десятки', en: 'tens' },
    { uz: 'birliklar', ru: 'единицы', en: 'ones' },
  ];
  const colors = [T.accent, T.cyan, T.ink3];
  const visible = solved ? digits.length : Math.min(frame, digits.length);
  const boxW = 96;
  const gap = 22;
  const startX = (520 - (digits.length * boxW + (digits.length - 1) * gap)) / 2;
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x="260" y="32" textAnchor="middle" fill={T.ink} fontSize="23" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {product} × {multiplier}
      </text>
      {digits.map((digit, index) => {
        const on = index < visible || solved;
        const x = startX + index * (boxW + gap);
        const color = colors[index];
        return (
          <g key={index} opacity={on ? 1 : 0.3} style={{ transition: 'opacity .45s' }}>
            <rect x={x} y="56" width={boxW} height="50" rx="12" fill="#FFFFFF" stroke={color} strokeWidth="2" />
            <text x={x + boxW / 2} y="92" textAnchor="middle" fill={T.ink} fontSize="26" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {digit}
            </text>
            <path d={`M${x + boxW / 2} 110 L${x + boxW / 2} 130`} stroke={color} strokeWidth="2" />
            <path d={`M${x + boxW / 2} 132 l-5 -8 h10 z`} fill={color} />
            <rect x={x - 6} y="136" width={boxW + 12} height="30" rx="9" fill="#F4F8F8" />
            <text x={x + boxW / 2} y="156" textAnchor="middle" fill={color} fontSize="12" fontWeight="800" fontFamily="Manrope, sans-serif">
              {names[index] ? t(names[index]) : ''}
            </text>
            <rect x={x + 6} y="176" width={boxW - 12} height="12" rx="6" fill={color} opacity="0.85" />
          </g>
        );
      })}
      {reveal && (
        <text x="260" y="214" textAnchor="middle" fill={T.ink2} fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
          {t({
            uz: `${digits.length} ta raqam, ${digits.length} ta qator`,
            ru: `${digits.length} цифры, ${digits.length} строки`,
            en: `${digits.length} digits, ${digits.length} rows`,
          })}
        </text>
      )}
    </FitSvg>
  );
};

// s5, s6 — 459 uchta qismga bo'linadi: proporsional lenta va uchta karta.
const BandsFigure = ({ frame = 0, solved = false, picked = null, mode = 's5' }) => {
  const t = useT();
  const open = mode === 's6' ? (solved ? 3 : 2) : frame;
  const parts = [
    { n: 400, w: 400 / 459, color: T.accent, expr: '375 × 400', value: '150000', on: open >= 3 },
    { n: 50, w: 50 / 459, color: T.cyan, expr: '375 × 50', value: '18750', on: open >= 2 },
    { n: 9, w: 9 / 459, color: T.ink3, expr: '375 × 9', value: '3375', on: open >= 1 },
  ];
  const barX = 34;
  const barW = 452;
  let cursor = barX;
  const laid = parts.map((part) => {
    const w = barW * part.w;
    const item = { ...part, x: cursor, w };
    cursor += w;
    return item;
  });
  return (
    <FitSvg viewBox="0 0 520 232">
      <PanelDefs />
      <text x="260" y="26" textAnchor="middle" fill={T.ink} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        459 = 400 + 50 + 9
      </text>
      {/* proporsional lenta: 400 qism qanchalik katta ekani ko'rinadi */}
      <rect x={barX - 3} y="42" width={barW + 6} height="44" rx="9" fill="#EEF2F1" />
      {laid.map((part) => (
        <g key={part.n} opacity={part.on ? 1 : 0.32} style={{ transition: 'opacity .45s' }}>
          <rect x={part.x} y="45" width={Math.max(2.5, part.w - 3)} height="38" rx="6" fill="#0A1E33" />
          {part.w > 26 && (
            <PanelBlock
              x={part.x + 2}
              y={47}
              w={part.w - 7}
              h={34}
              cols={Math.max(1, Math.round((part.w - 7) / 26))}
              rows={2}
              gap={2}
              accent={part.color}
            />
          )}
          <text
            x={part.x + Math.max(6, part.w / 2)}
            y="102"
            textAnchor="middle"
            fill={part.color}
            fontSize="14"
            fontWeight="800"
            fontFamily="JetBrains Mono, monospace"
          >
            {part.n}
          </text>
        </g>
      ))}
      {/* uchta karta: har qismning ko'paytmasi */}
      {laid.map((part, index) => {
        const x = 34 + index * 155;
        return (
          <g key={`card-${part.n}`} opacity={part.on ? 1 : 0.32} style={{ transition: 'opacity .45s' }}>
            <rect x={x} y="118" width="146" height="72" rx="13" fill="#FFFFFF" stroke={part.color} strokeWidth="2" />
            <rect x={x} y="118" width="146" height="6" rx="3" fill={part.color} />
            <text x={x + 73} y="150" textAnchor="middle" fill={T.ink2} fontSize="13" fontWeight="700" fontFamily="JetBrains Mono, monospace">
              {part.expr}
            </text>
            <text x={x + 73} y="178" textAnchor="middle" fill={part.on ? T.ink : T.ink3} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {part.on ? part.value : '?'}
            </text>
          </g>
        );
      })}
      {mode === 's6' && (
        <text x="260" y="214" textAnchor="middle" fill={solved ? T.success : T.ink2} fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
          {solved
            ? t({ uz: 'Yuzliklar qatori ikkita xonaga suriladi', ru: 'Строка сотен сдвигается на два разряда', en: 'The hundreds row shifts two places' })
            : t({ uz: 'Uchinchi karta ustunda qayerga tushadi?', ru: 'Куда в столбике попадает третья карта?', en: 'Where does the third card go in the column?' })}
        </text>
      )}
      {picked !== null && mode === 's6' && !solved && (
        <circle cx="260" cy="226" r="4" fill={T.accent} />
      )}
    </FitSvg>
  );
};

// Ustun yozuvi: s7, s8, s10, s13. Darslikdagidek — oxirgi nollarsiz, siljish bilan.
const ColumnFigure = ({
  top, bottom, rows, total, frame = 0, solved = false, revealAll = false, badRow = -1,
}) => {
  const shown = revealAll || solved ? rows.length : Math.min(frame, rows.length);
  const digitW = 15;
  const right = 344;
  const totalOn = revealAll || solved || frame >= rows.length + 1;
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x={right} y="36" textAnchor="end" fill={T.ink} fontSize="23" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {top}
      </text>
      <text x={right} y="66" textAnchor="end" fill={T.ink} fontSize="23" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        × {bottom}
      </text>
      <line x1={right - 210} y1="76" x2={right} y2="76" stroke={T.ink} strokeWidth="2.2" />
      {rows.map((row, index) => {
        const on = index < shown;
        const bad = index === badRow && solved;
        const y = 104 + index * 33;
        const color = bad ? T.accent : [T.ink3, T.cyan, T.accent][index] ?? T.ink;
        return (
          <g key={index} opacity={on ? 1 : 0.24} style={{ transition: 'opacity .45s' }}>
            <text x={right - 214} y={y} textAnchor="start" fill={color} fontSize="13" fontWeight="700" fontFamily="JetBrains Mono, monospace">
              {row.note}
            </text>
            <text
              x={right - row.shift * digitW}
              y={y}
              textAnchor="end"
              fill={bad ? T.accent : T.ink}
              fontSize="21"
              fontWeight="800"
              fontFamily="JetBrains Mono, monospace"
              style={{ transition: 'all .45s' }}
            >
              {row.value}
            </text>
            {bad && (
              <rect
                x={right - row.shift * digitW - row.value.length * digitW - 7}
                y={y - 18}
                width={row.value.length * digitW + 14}
                height="25"
                rx="7"
                fill="none"
                stroke={T.accent}
                strokeWidth="2"
                strokeDasharray="5 4"
              />
            )}
          </g>
        );
      })}
      <g opacity={totalOn ? 1 : 0.24} style={{ transition: 'opacity .45s' }}>
        <line
          x1={right - 210}
          y1={104 + rows.length * 33 - 22}
          x2={right}
          y2={104 + rows.length * 33 - 22}
          stroke={T.ink}
          strokeWidth="2.2"
        />
        <text
          x={right}
          y={104 + rows.length * 33 + 6}
          textAnchor="end"
          fill={T.success}
          fontSize="24"
          fontWeight="800"
          fontFamily="JetBrains Mono, monospace"
        >
          {total}
        </text>
      </g>
    </FitSvg>
  );
};

// s11 — darslik rejasi
const RuleFigure = ({ frame = 0 }) => {
  const t = useT();
  const steps = [
    {
      n: '1',
      text: { uz: "Birliklar soniga ko'paytiraman", ru: 'Умножаю на число единиц', en: 'I multiply by the ones' },
      shift: '+0', color: T.ink3,
    },
    {
      n: '2',
      text: { uz: "O'nliklar soniga ko'paytiraman", ru: 'Умножаю на число десятков', en: 'I multiply by the tens' },
      shift: '+1', color: T.cyan,
    },
    {
      n: '3',
      text: { uz: "Yuzliklar soniga ko'paytiraman", ru: 'Умножаю на число сотен', en: 'I multiply by the hundreds' },
      shift: '+2', color: T.accent,
    },
    {
      n: '4',
      text: { uz: "Qatorlarni qo'shaman va javobni o'qiyman", ru: 'Складываю строки и читаю ответ', en: 'I add the rows and read the answer' },
      shift: '', color: T.success,
    },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      {steps.map((step, index) => {
        const on = frame >= index || frame >= steps.length - 1;
        const y = 10 + index * 54;
        return (
          <g key={step.n} opacity={on ? 1 : 0.3} style={{ transition: 'opacity .45s' }}>
            <rect x="22" y={y} width="476" height="44" rx="13" fill="#FFFFFF" stroke="rgba(23,59,82,.14)" strokeWidth="1.6" />
            <rect x="22" y={y} width="6" height="44" rx="3" fill={step.color} />
            <circle cx="56" cy={y + 22} r="14" fill={step.color} />
            <text x="56" y={y + 27} textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {step.n}
            </text>
            <text x="84" y={y + 27} fill={T.ink} fontSize="14" fontWeight="650" fontFamily="Manrope, sans-serif">
              {t(step.text)}
            </text>
            {step.shift && (
              <text x="482" y={y + 27} textAnchor="end" fill={step.color} fontSize="13" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                {step.shift}
              </text>
            )}
          </g>
        );
      })}
    </FitSvg>
  );
};

// s12 — ikki yo'l yonma-yon, ramkalar bir xil o'lchamda va markazda
const PathFigure = ({ solved = false }) => {
  const t = useT();
  const cardW = 216;
  const gap = 32;
  const x1 = (520 - (cardW * 2 + gap)) / 2;
  const x2 = x1 + cardW + gap;
  return (
    <FitSvg viewBox="0 0 520 232">
      <g>
        <rect x={x1} y="22" width={cardW} height="184" rx="15" fill="#FFFFFF" stroke={solved ? T.success : T.cyan} strokeWidth={solved ? 2.6 : 2} />
        <rect x={x1} y="22" width={cardW} height="7" rx="3.5" fill={solved ? T.success : T.cyan} />
        <text x={x1 + cardW / 2} y="54" textAnchor="middle" fill={solved ? T.success : T.cyan} fontSize="12" fontWeight="800" fontFamily="Manrope, sans-serif">
          {t({ uz: 'Nolni ajratamiz', ru: 'Отделяем ноль', en: 'Set the zero aside' })}
        </text>
        <text x={x1 + cardW / 2} y="94" textAnchor="middle" fill={T.ink} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          321 × 94
        </text>
        <text x={x1 + cardW / 2} y="126" textAnchor="middle" fill={T.ink} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          30174
        </text>
        <text x={x1 + cardW / 2} y="154" textAnchor="middle" fill={T.ink3} fontSize="12" fontFamily="Manrope, sans-serif">
          {t({ uz: '+ bitta nol', ru: '+ один ноль', en: '+ one zero' })}
        </text>
        <text x={x1 + cardW / 2} y="188" textAnchor="middle" fill={solved ? T.success : T.ink} fontSize="21" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          301740
        </text>
      </g>
      <g>
        <rect x={x2} y="22" width={cardW} height="184" rx="15" fill="#F8FAF9" stroke="rgba(23,59,82,.18)" strokeWidth="2" />
        <rect x={x2} y="22" width={cardW} height="7" rx="3.5" fill={T.ink3} />
        <text x={x2 + cardW / 2} y="54" textAnchor="middle" fill={T.ink2} fontSize="12" fontWeight="800" fontFamily="Manrope, sans-serif">
          {t({ uz: 'Uchta qator', ru: 'Три строки', en: 'Three rows' })}
        </text>
        {[
          { v: '0', note: '× 0', dim: true },
          { v: '1284', note: '× 40', dim: false },
          { v: '2889', note: '× 900', dim: false },
        ].map((row, index) => (
          <g key={row.note}>
            <text x={x2 + 22} y={92 + index * 30} fill={T.ink3} fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">
              {row.note}
            </text>
            <text
              x={x2 + cardW - 22 - index * 13}
              y={92 + index * 30}
              textAnchor="end"
              fill={row.dim ? T.ink3 : T.ink}
              fontSize="18"
              fontWeight="800"
              fontFamily="JetBrains Mono, monospace"
            >
              {row.v}
            </text>
          </g>
        ))}
        <text x={x2 + cardW / 2} y="192" textAnchor="middle" fill={T.ink3} fontSize="11" fontFamily="Manrope, sans-serif">
          {t({ uz: 'bitta qator butunlay nol', ru: 'одна строка целиком нулевая', en: 'one row is all zeros' })}
        </text>
      </g>
    </FitSvg>
  );
};

// ===========================================================================
// EKRANLAR
// ===========================================================================
const Screen0 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 15" ordinal={0} figure={({ solved }) => <RoofScene solved={solved} />} />
);
const Screen1 = (props) => <RevealScreen {...props} figure={({ frame }) => <ShiftFigure frame={frame} mode="s1" />} />;
const Screen2 = (props) => (
  <ChoiceScreen {...props} ordinal={1} figure={({ solved }) => <ShiftFigure mode="s2" solved={solved} />} />
);
const Screen3 = (props) => <RevealScreen {...props} figure={({ frame }) => <RowsFigure frame={frame} />} />;
const Screen4 = (props) => (
  <ChoiceScreen {...props} ordinal={2} figure={({ solved }) => <RowsFigure multiplier="418" product="4972" solved={solved} frame={3} reveal={solved} />} />
);
const Screen5 = (props) => <RevealScreen {...props} figure={({ frame }) => <BandsFigure frame={frame} mode="s5" />} />;
const Screen6 = (props) => (
  <SlotScreen {...props} figure={({ solved, picked }) => <BandsFigure mode="s6" solved={solved} picked={picked} />} />
);
const Screen7 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <ColumnFigure
        top="375"
        bottom="459"
        frame={frame}
        rows={[
          { value: '3375', shift: 0, note: '375 × 9' },
          { value: '1875', shift: 1, note: '375 × 50' },
          { value: '1500', shift: 2, note: '375 × 400' },
        ]}
        total="172125"
      />
    )}
  />
);
const Screen8 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={3}
    figure={({ solved }) => (
      <ColumnFigure
        top="727"
        bottom="641"
        revealAll
        solved={solved}
        rows={[
          { value: '727', shift: 0, note: '727 × 1' },
          { value: '2908', shift: 1, note: '727 × 40' },
          { value: '4362', shift: 2, note: '727 × 600' },
        ]}
        total={solved ? '466007' : '?'}
      />
    )}
  />
);
const Screen9 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <ColumnFigure
        top="524"
        bottom="607"
        frame={frame}
        rows={[
          { value: '3668', shift: 0, note: '524 × 7' },
          { value: '3144', shift: 2, note: '524 × 600' },
        ]}
        total="318068"
      />
    )}
  />
);
const Screen10 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={4}
    figure={({ solved }) => (
      <ColumnFigure
        top="524"
        bottom="607"
        revealAll
        solved={solved}
        rows={[
          { value: '3668', shift: 0, note: '524 × 7' },
          { value: '3144', shift: 2, note: '524 × 600' },
        ]}
        total={solved ? '318068' : '?'}
      />
    )}
  />
);
const Screen11 = (props) => <RevealScreen {...props} figure={({ frame }) => <RuleFigure frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen {...props} ordinal={5} stack figure={({ solved }) => <PathFigure solved={solved} />} />
);
const Screen13 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={6}
    figure={({ solved }) => (
      <ColumnFigure
        top="861"
        bottom="323"
        revealAll
        badRow={2}
        rows={[
          { value: '2583', shift: 0, note: '861 × 3' },
          { value: '1722', shift: 1, note: '861 × 20' },
          // Bit yuzliklar qatorini bitta xonaga surgan; to'g'ri javobdan keyin
          // qator o'z o'rniga qaytadi va natija tuzatiladi.
          { value: '2583', shift: solved ? 2 : 1, note: '861 × 300' },
        ]}
        total={solved ? '278103' : '45633'}
      />
    )}
  />
);
const Screen14 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 15" ordinal={7} figure={({ solved }) => <RoofScene mode="final" solved={solved} />} />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

export default function Grade4Dars11(props) {
  return (
    <TheoryLessonRoot
      {...props}
      lessonMeta={LESSON_META}
      screenMeta={SCREEN_META}
      totalScreens={TOTAL_SCREENS}
      frameCounts={FRAME_COUNTS}
      content={CONTENT}
      screens={SCREENS}
      styles={KIT_STYLES}
    />
  );
}
