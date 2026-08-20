// ============================================================================
// 4-SINF · Dars 42 · Tenglamalar
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri, 40-43-betlar.
// Syujet: Lumo City boshqaruv markazi (SYUJET_4SINF.md, 6-blok). Ish tuguni
// yangi: muhrlangan buyurtma stoli. 41-darsdan ko'prik — panjara-oyna
// tasdiqlandi, lekin buyurtmadagi panellar soni muhr ostida qoldi.
//
// YADRO. Noma'lum sonni x harfi bilan belgilaymiz va yozuvni tenglama qilib
// tuzamiz: x + 240 = 360. Noma'lum qo'shiluvchi yig'indidan ma'lum
// qo'shiluvchini ayirish bilan topiladi. Noma'lum kamayuvchi esa ayirmaga
// ayriluvchini qo'shish bilan: x - 240 = 510, x = 510 + 240.
//
// RITM: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
//
// Infratuzilma ko'chirilmaydi, `kit/` dan import qilinadi (CLAUDE.md §5).
// ============================================================================
import {
  BarModel, BitSVG, Caption, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, Plate,
  RecordRow, RevealScreen, RuleRows, SlotScreen, StepList, SummaryScreen, T,
  TheoryLessonRoot, assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'eq-4-42-v2',
  slug: 'dars42-tenglamalar',
  lessonTitle: {
    uz: '42-dars. Tenglamalar',
    ru: 'Урок 42. Уравнения',
    en: 'Lesson 42. Equations',
  },
  skillTags: ['equation_meaning', 'unknown_addend', 'unknown_minuend', 'substitution_check', 'word_to_equation'],
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

const FRAME_COUNTS = [4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3];

// ---------------------------------------------------------------------------
// KONTENT: UZ (asosiy), RU, EN + har ekran uchun ovoz.
// Ovozda son va belgi so'z bilan: audio_rules talabi.
// ---------------------------------------------------------------------------
const CONTENT = {
  s0: {
    eyebrow: { uz: 'Muhrlangan buyurtma', ru: 'Опечатанный заказ', en: 'The sealed order' },
    title: {
      uz: 'Muhr ostida qancha?',
      ru: 'Сколько под печатью?',
      en: 'How many under the seal?',
    },
    question: {
      uz: 'Buyurtmani qaysi yozuv aniq ifodalaydi?',
      ru: 'Какая запись точно выражает заказ?',
      en: 'Which record expresses the order exactly?',
    },
    options: [
      { uz: 'x + 240 = 360', ru: 'x + 240 = 360', en: 'x + 240 = 360' },
      { uz: '240 + 360 = x', ru: '240 + 360 = x', en: '240 + 360 = x' },
      { uz: 'x = 240 + 360', ru: 'x = 240 + 360', en: 'x = 240 + 360' },
      { uz: 'x - 240 = 360', ru: 'x - 240 = 360', en: 'x - 240 = 360' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yetkazilgan 240 ta va muhr ostidagi x birga 360 tani beradi.",
      ru: 'Верно. Доставленные 240 и скрытое печатью x вместе дают 360.',
      en: 'Correct. The delivered 240 and the hidden x together make 360.',
    },
    wrong: [
      null,
      {
        uz: "Bu yerda ikkala son qo'shilgan. Lekin 360 — bu jami, uni qo'shiluvchi qilib bo'lmaydi.",
        ru: 'Здесь оба числа сложены. Но 360 — это итог, его нельзя брать слагаемым.',
        en: 'Here both numbers are added. But 360 is the total, it cannot be a part.',
      },
      {
        uz: "Bu ham jamini yana qo'shadi. Noma'lum qism jamidan katta bo'lolmaydi.",
        ru: 'Здесь итог складывают ещё раз. Неизвестная часть не может быть больше итога.',
        en: 'This adds the total once more. The unknown part cannot exceed the total.',
      },
      {
        uz: "Bunda x jami bo'lib qoladi, 360 esa qism. Aslida teskarisi.",
        ru: 'Тогда x становится итогом, а 360 — частью. На самом деле наоборот.',
        en: 'Then x becomes the total and 360 a part. In fact it is the other way round.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Panjara-oyna tasdiqlandi va buyurtma boshqaruv markaziga tushdi.",
          "Buyurtmada jami uch yuz oltmish panel yozilgan. Omborga ikki yuz qirqtasi yetkazilgan.",
          "Qolgan panellar soni muhr ostida. Bit uni iks harfi bilan belgiladi.",
          "Mashina faqat aniq yozuvni tushunadi. Buyurtmani qaysi yozuv ifodalaydi? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Решётчатое окно утвердили, и заказ поступил в центр управления.',
          'В заказе записано всего триста шестьдесят панелей. На склад доставлено двести сорок.',
          'Число оставшихся панелей скрыто печатью. Bit обозначил его буквой икс.',
          'Машина понимает только точную запись. Какая запись выражает заказ? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The lattice window was approved and the order reached the control centre.',
          'The order says three hundred and sixty panels in all. Two hundred and forty were delivered to the store.',
          'The number of panels still missing is hidden under a seal. Bit marked it with the letter x.',
          'The machine understands only an exact record. Which record expresses the order? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Tenglama nima', ru: 'Что такое уравнение', en: 'What an equation is' },
    title: {
      uz: 'Noma\'lumi bor tenglik',
      ru: 'Равенство с неизвестным',
      en: 'An equality with an unknown',
    },
    lead: {
      uz: "Ichida noma'lum son harf bilan belgilangan tenglik tenglama deyiladi.",
      ru: 'Равенство, в котором неизвестное число обозначено буквой, называют уравнением.',
      en: 'An equality in which an unknown number is written as a letter is called an equation.',
    },
    note: {
      uz: "Tenglamani yechish — harf o'rniga tenglikni to'g'ri qiladigan sonni topish.",
      ru: 'Решить уравнение — найти число, при котором равенство становится верным.',
      en: 'To solve an equation is to find the number that makes the equality true.',
    },
    audio: {
      intro: {
        uz: [
          "Yozuvni yaqindan ko'ramiz. Chap tomonda iks va ikki yuz qirq, o'ng tomonda uch yuz oltmish.",
          "O'rtada tenglik belgisi turibdi. Demak ikki tomon bir xil qiymatga ega.",
          "Iks bu noma'lum son. Uning o'rniga to'g'ri son qo'yilsa, tenglik haqiqiy bo'ladi.",
          "Ichida noma'lum harf bo'lgan bunday tenglik tenglama deb ataladi.",
        ],
        ru: [
          'Рассмотрим запись поближе. Слева икс и двести сорок, справа триста шестьдесят.',
          'Посередине стоит знак равенства. Значит, обе стороны имеют одинаковое значение.',
          'Икс это неизвестное число. Если вместо него поставить верное число, равенство станет истинным.',
          'Такое равенство с неизвестной буквой называют уравнением.',
        ],
        en: [
          'Let us look at the record closely. On the left there is x and two hundred and forty, on the right three hundred and sixty.',
          'In the middle stands the equals sign. So both sides have the same value.',
          'The letter x is the unknown number. Put the right number in its place and the equality becomes true.',
          'Such an equality with an unknown letter is called an equation.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Qaysi yozuv', ru: 'Какая запись', en: 'Which record' },
    title: {
      uz: 'Qaysi biri tenglama?',
      ru: 'Что из этого уравнение?',
      en: 'Which one is an equation?',
    },
    question: {
      uz: 'Terminalda to\'rt yozuv bor. Qaysi biri tenglama?',
      ru: 'На терминале четыре записи. Какая из них уравнение?',
      en: 'There are four records on the terminal. Which one is an equation?',
    },
    options: [
      { uz: 'x + 240 = 360', ru: 'x + 240 = 360', en: 'x + 240 = 360' },
      { uz: '240 + 360', ru: '240 + 360', en: '240 + 360' },
      { uz: 'x + 240', ru: 'x + 240', en: 'x + 240' },
      { uz: '360 = 360', ru: '360 = 360', en: '360 = 360' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bu yerda tenglik belgisi ham, noma'lum harf ham bor.",
      ru: 'Верно. Здесь есть и знак равенства, и неизвестная буква.',
      en: 'Correct. Here there is both an equals sign and an unknown letter.',
    },
    wrong: [
      null,
      {
        uz: "Bu shunchaki ifoda: tenglik belgisi ham, noma'lum ham yo'q.",
        ru: 'Это просто выражение: нет ни знака равенства, ни неизвестного.',
        en: 'That is just an expression: no equals sign and no unknown.',
      },
      {
        uz: "Noma'lum bor, lekin tenglik belgisi yo'q. Bu harfli ifoda.",
        ru: 'Неизвестное есть, а знака равенства нет. Это буквенное выражение.',
        en: 'There is an unknown but no equals sign. That is a letter expression.',
      },
      {
        uz: "Tenglik bor, lekin noma'lum yo'q. Bunda topadigan narsa qolmagan.",
        ru: 'Равенство есть, а неизвестного нет. Здесь уже нечего находить.',
        en: 'There is an equality but no unknown. Nothing is left to find here.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Boshqaruv terminalida to'rtta yozuv chiqdi.",
          "Tenglama bo'lishi uchun ikkita shart kerak: tenglik belgisi va noma'lum harf.",
          "Qaysi biri tenglama? Javobni tanlang.",
        ],
        ru: [
          'На терминале управления появились четыре записи.',
          'Чтобы запись была уравнением, нужны два признака: знак равенства и неизвестная буква.',
          'Какая из них уравнение? Выбери ответ.',
        ],
        en: [
          'Four records appeared on the control terminal.',
          'To be an equation a record needs two things: an equals sign and an unknown letter.',
          'Which one is an equation? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Qism va jami', ru: 'Часть и целое', en: 'Part and whole' },
    title: {
      uz: 'Qism qanday topiladi?',
      ru: 'Как находят часть?',
      en: 'How is a part found?',
    },
    lead: {
      uz: 'Jami ikki qismdan yig\'ilgan. Bir qism ma\'lum, ikkinchisi yashirin.',
      ru: 'Целое собрано из двух частей. Одна часть известна, вторая скрыта.',
      en: 'The whole is made of two parts. One part is known, the other is hidden.',
    },
    note: {
      uz: "Noma'lum qo'shiluvchi yig'indidan ma'lum qo'shiluvchini ayirish bilan topiladi.",
      ru: 'Неизвестное слагаемое находят вычитанием известного слагаемого из суммы.',
      en: 'An unknown addend is found by subtracting the known addend from the sum.',
    },
    audio: {
      intro: {
        uz: [
          "Buyurtmani tasma ko'rinishida chizamiz. Butun tasma uch yuz oltmish panel.",
          "Uning bir bo'lagi ikki yuz qirq: bular yetkazilgan panellar.",
          "Qolgan bo'lak esa iks. Ikki bo'lak birga butun tasmani beradi.",
          "Demak yashirin bo'lakni topish uchun butundan ma'lum bo'lakni ayiramiz.",
        ],
        ru: [
          'Нарисуем заказ в виде полосы. Вся полоса это триста шестьдесят панелей.',
          'Один её кусок равен двумстам сорока, это доставленные панели.',
          'Оставшийся кусок это икс. Два куска вместе дают всю полосу.',
          'Значит, чтобы найти скрытый кусок, вычтем из целого известный кусок.',
        ],
        en: [
          'Let us draw the order as a bar. The whole bar is three hundred and sixty panels.',
          'One piece of it is two hundred and forty: those are the delivered panels.',
          'The remaining piece is x. The two pieces together make the whole bar.',
          'So to find the hidden piece we subtract the known piece from the whole.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Amalni tanlang', ru: 'Выбери действие', en: 'Choose the action' },
    title: {
      uz: 'Iksni qaysi amal ochadi?',
      ru: 'Какое действие откроет x?',
      en: 'Which action opens x?',
    },
    question: {
      uz: 'x + 240 = 360. Iksni topish uchun qaysi amal kerak?',
      ru: 'x + 240 = 360. Какое действие нужно, чтобы найти x?',
      en: 'x + 240 = 360. Which action is needed to find x?',
    },
    slots: [
      { label: { uz: '360 - 240', ru: '360 - 240', en: '360 - 240' }, caption: { uz: 'ayirish', ru: 'вычитание', en: 'subtraction' } },
      { label: { uz: '360 + 240', ru: '360 + 240', en: '360 + 240' }, caption: { uz: "qo'shish", ru: 'сложение', en: 'addition' } },
      { label: { uz: '240 - 360', ru: '240 - 360', en: '240 - 360' }, caption: { uz: 'teskari', ru: 'наоборот', en: 'reversed' } },
    ],
    correctSlot: 0,
    correctText: {
      uz: "To'g'ri. Butundan ma'lum qismni ayiramiz: iks bir yuz yigirmaga teng.",
      ru: 'Верно. Из целого вычитаем известную часть: x равен ста двадцати.',
      en: 'Correct. We subtract the known part from the whole: x equals one hundred and twenty.',
    },
    wrong: [
      null,
      {
        uz: "Qo'shsak, javob butundan katta chiqadi. Qism butundan katta bo'lolmaydi.",
        ru: 'Если сложить, ответ будет больше целого. Часть не может быть больше целого.',
        en: 'Adding gives a result larger than the whole. A part cannot exceed the whole.',
      },
      {
        uz: "Bu yerda kichik sondan katta son ayirilgan. Butun har doim oldin turadi.",
        ru: 'Здесь из меньшего числа вычитают большее. Целое всегда стоит первым.',
        en: 'Here the larger number is taken from the smaller one. The whole always comes first.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Endi o'zingiz tanlaysiz. Tenglamada iks va ikki yuz qirq qo'shilib, uch yuz oltmish beradi.",
          "Yashirin qismni ochish uchun butundan ma'lum qismni olish kerak.",
          "Qaysi amal to'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Теперь выбираешь ты. В уравнении икс и двести сорок вместе дают триста шестьдесят.',
          'Чтобы открыть скрытую часть, нужно взять от целого известную часть.',
          'Какое действие верное? Выбери ответ.',
        ],
        en: [
          'Now it is your choice. In the equation x and two hundred and forty together give three hundred and sixty.',
          'To open the hidden part we take the known part away from the whole.',
          'Which action is right? Choose an answer.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Tekshirish', ru: 'Проверка', en: 'The check' },
    title: {
      uz: 'Topilgan sonni qaytarib qo\'yamiz',
      ru: 'Возвращаем найденное число',
      en: 'We put the found number back',
    },
    lead: {
      uz: "Javob topilgach, uni harf o'rniga qo'yamiz va tenglik chindan to'g'ri ekanini ko'ramiz.",
      ru: 'Найдя ответ, ставим его вместо буквы и смотрим, стало ли равенство верным.',
      en: 'Once the answer is found we put it in place of the letter and see whether the equality is true.',
    },
    note: {
      uz: 'Ikki tomon bir xil son bergandagina javob qabul qilinadi.',
      ru: 'Ответ принимают только тогда, когда обе стороны дают одно число.',
      en: 'The answer is accepted only when both sides give the same number.',
    },
    audio: {
      intro: {
        uz: [
          "Iks bir yuz yigirmaga teng chiqdi. Bu hali javob emas, bu taxmin.",
          "Uni tenglamaga qaytarib qo'yamiz: bir yuz yigirma va ikki yuz qirq.",
          "Chap tomon uch yuz oltmish bo'ldi. O'ng tomon ham uch yuz oltmish.",
          "Ikki tomon bir xil. Demak javob to'g'ri va buyurtma ochiladi.",
        ],
        ru: [
          'Икс получился равным ста двадцати. Это ещё не ответ, это предположение.',
          'Вернём его в уравнение: сто двадцать и двести сорок.',
          'Левая сторона стала тремястами шестьюдесятью. Правая тоже триста шестьдесят.',
          'Обе стороны одинаковы. Значит, ответ верный и заказ открывается.',
        ],
        en: [
          'The x came out equal to one hundred and twenty. That is not the answer yet, only a guess.',
          'We put it back into the equation: one hundred and twenty and two hundred and forty.',
          'The left side became three hundred and sixty. The right side is three hundred and sixty too.',
          'Both sides are the same. So the answer is right and the order opens.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Ikkinchi buyurtma',
      ru: 'Второй заказ',
      en: 'The second order',
    },
    question: {
      uz: 'x + 1425 = 4907. Iks nechaga teng?',
      ru: 'x + 1425 = 4907. Чему равен x?',
      en: 'x + 1425 = 4907. What does x equal?',
    },
    answer: 3482,
    unit: { uz: 'dona', ru: 'шт.', en: 'pcs' },
    correctText: {
      uz: "To'g'ri. To'rt ming to'qqiz yuz yetti minus bir ming to'rt yuz yigirma besh uch ming to'rt yuz sakson ikki.",
      ru: 'Верно. Четыре тысячи девятьсот семь минус тысяча четыреста двадцать пять — три тысячи четыреста восемьдесят два.',
      en: 'Correct. Four thousand nine hundred and seven minus one thousand four hundred and twenty five is three thousand four hundred and eighty two.',
    },
    wrong: {
      uz: "Hali emas. Bu ham qism va jami masalasi: jamidan ma'lum qismni ayiring.",
      ru: 'Пока нет. Это тоже задача про часть и целое: вычти из целого известную часть.',
      en: 'Not yet. This is a part and whole task too: subtract the known part from the whole.',
    },
    hintAfter: {
      uz: "Ustunda yozing: to'rt ming to'qqiz yuz yettidan bir ming to'rt yuz yigirma beshni ayiring.",
      ru: 'Запиши столбиком: из четырёх тысяч девятисот семи вычти тысячу четыреста двадцать пять.',
      en: 'Write it in a column: take one thousand four hundred and twenty five from four thousand nine hundred and seven.',
    },
    audio: {
      intro: {
        uz: [
          "Ikkinchi buyurtma keldi. Jami to'rt ming to'qqiz yuz yetti detal.",
          "Bir ming to'rt yuz yigirma beshtasi allaqachon omborda.",
          "Qolgani nechta? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Пришёл второй заказ. Всего четыре тысячи девятьсот семь деталей.',
          'Тысяча четыреста двадцать пять уже на складе.',
          'Сколько осталось? Набери ответ и подтверди.',
        ],
        en: [
          'A second order has arrived. Four thousand nine hundred and seven parts in all.',
          'One thousand four hundred and twenty five are already in the store.',
          'How many are left? Type the answer and confirm.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Boshqa turdagi', ru: 'Другой вид', en: 'A different kind' },
    title: {
      uz: 'Noma\'lum boshida tursa',
      ru: 'Когда неизвестное в начале',
      en: 'When the unknown comes first',
    },
    lead: {
      uz: 'Ombordan bir qismi olindi va qoldiq ma\'lum. Endi butunning o\'zi noma\'lum.',
      ru: 'Со склада забрали часть, и остаток известен. Теперь неизвестно само целое.',
      en: 'A part was taken from the store and the remainder is known. Now the whole itself is unknown.',
    },
    note: {
      uz: "Noma'lum kamayuvchi ayirmaga ayriluvchini qo'shish bilan topiladi.",
      ru: 'Неизвестное уменьшаемое находят прибавлением вычитаемого к разности.',
      en: 'An unknown minuend is found by adding the subtrahend to the difference.',
    },
    audio: {
      intro: {
        uz: [
          "Yangi yozuv keldi: iks minus ikki yuz qirq teng besh yuz o'n.",
          "Bu safar iks boshida turibdi. Demak noma'lum butunning o'zi.",
          "Tasmada butun ikki bo'lakdan yig'ilgan: olingan ikki yuz qirq va qolgan besh yuz o'n.",
          "Butunni tiklash uchun ikki bo'lakni qo'shamiz. Iks yetti yuz ellikka teng.",
        ],
        ru: [
          'Пришла новая запись: икс минус двести сорок равно пятистам десяти.',
          'На этот раз икс стоит в начале. Значит, неизвестно само целое.',
          'На полосе целое собрано из двух кусков: забранных двухсот сорока и оставшихся пятисот десяти.',
          'Чтобы восстановить целое, сложим два куска. Икс равен семистам пятидесяти.',
        ],
        en: [
          'A new record has arrived: x minus two hundred and forty equals five hundred and ten.',
          'This time x stands first. So the unknown is the whole itself.',
          'On the bar the whole is made of two pieces: the two hundred and forty taken and the five hundred and ten left.',
          'To restore the whole we add the two pieces. So x equals seven hundred and fifty.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Amalni tanlang', ru: 'Выбери действие', en: 'Choose the action' },
    title: {
      uz: 'Butunni qanday tiklaymiz?',
      ru: 'Как восстановить целое?',
      en: 'How do we restore the whole?',
    },
    question: {
      uz: 'x - 2400 = 5100. Iksni topish uchun nima qilamiz?',
      ru: 'x - 2400 = 5100. Что сделаем, чтобы найти x?',
      en: 'x - 2400 = 5100. What do we do to find x?',
    },
    options: [
      { uz: "5100 ga 2400 ni qo'shamiz", ru: 'К 5100 прибавим 2400', en: 'Add 2400 to 5100' },
      { uz: '5100 dan 2400 ni ayiramiz', ru: 'Из 5100 вычтем 2400', en: 'Subtract 2400 from 5100' },
      { uz: '2400 dan 5100 ni ayiramiz', ru: 'Из 2400 вычтем 5100', en: 'Subtract 5100 from 2400' },
      { uz: "5100 ni 2400 ga ko'paytiramiz", ru: 'Умножим 5100 на 2400', en: 'Multiply 5100 by 2400' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ayirmaga ayriluvchini qo'shsak, kamayuvchi tiklanadi: iks yetti ming besh yuz.",
      ru: 'Верно. Прибавив вычитаемое к разности, восстановим уменьшаемое: x равен семи тысячам пятистам.',
      en: 'Correct. Adding the subtrahend to the difference restores the minuend: x equals seven thousand five hundred.',
    },
    wrong: [
      null,
      {
        uz: "Ayirsak, butun yana kichrayadi. Bu yerda esa butunni tiklash kerak.",
        ru: 'Если вычесть, целое станет ещё меньше. А здесь целое нужно восстановить.',
        en: 'Subtracting makes the whole smaller still. Here the whole has to be restored.',
      },
      {
        uz: "Sonlar o'rin almashgan: kichikdan kattani ayirib bo'lmaydi.",
        ru: 'Числа поменялись местами: из меньшего нельзя вычесть большее.',
        en: 'The numbers swapped places: you cannot take a larger number from a smaller one.',
      },
      {
        uz: "Tenglamada ko'paytirish yo'q. Bu yerda faqat qo'shish va ayirish bog'lanadi.",
        ru: 'В уравнении нет умножения. Здесь связаны только сложение и вычитание.',
        en: 'There is no multiplication in the equation. Only addition and subtraction are linked here.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Uchinchi buyurtma: iks minus ikki ming to'rt yuz teng besh ming yuz.",
          "Iks boshida, demak noma'lum butunning o'zi.",
          "Uni qaysi amal tiklaydi? Javobni tanlang.",
        ],
        ru: [
          'Третий заказ: икс минус две тысячи четыреста равно пяти тысячам ста.',
          'Икс в начале, значит неизвестно само целое.',
          'Какое действие его восстановит? Выбери ответ.',
        ],
        en: [
          'A third order: x minus two thousand four hundred equals five thousand one hundred.',
          'The x comes first, so the unknown is the whole itself.',
          'Which action restores it? Choose an answer.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Gapdan tenglamaga', ru: 'От фразы к уравнению', en: 'From a sentence to an equation' },
    title: {
      uz: 'Gapni tenglamaga aylantiramiz',
      ru: 'Превращаем фразу в уравнение',
      en: 'We turn a sentence into an equation',
    },
    lead: {
      uz: 'Buyurtmalar so\'z bilan keladi. Mashinaga esa yozuv kerak.',
      ru: 'Заказы приходят словами. А машине нужна запись.',
      en: 'Orders arrive in words. The machine needs a record.',
    },
    note: {
      uz: "Avval noma'lumni harf bilan belgilaymiz, keyin gapdagi bog'lanishni yozamiz.",
      ru: 'Сначала обозначаем неизвестное буквой, затем записываем связь из фразы.',
      en: 'First we mark the unknown with a letter, then we write down the link from the sentence.',
    },
    audio: {
      intro: {
        uz: [
          "Buyurtma so'z bilan keldi: noma'lum songa to'rt yuz yigirma qo'shilsa, olti yuz hosil bo'ladi.",
          "Darslik shunday mulohaza yuritishni o'rgatadi. Noma'lum sonni iks harfi bilan belgilaymiz.",
          "Endi gapni yozuvga ko'chiramiz: iks va to'rt yuz yigirma qo'shilib olti yuz beradi.",
          "Tenglama tayyor. Uni yechish esa endi tanish ish.",
        ],
        ru: [
          'Заказ пришёл словами: если к неизвестному числу прибавить четыреста двадцать, получится шестьсот.',
          'Учебник учит рассуждать так. Обозначим неизвестное число буквой икс.',
          'Теперь перенесём фразу в запись: икс и четыреста двадцать вместе дают шестьсот.',
          'Уравнение готово. А решить его уже знакомое дело.',
        ],
        en: [
          'The order came in words: if four hundred and twenty is added to an unknown number, the result is six hundred.',
          'The textbook teaches this way of reasoning. Let us mark the unknown number with the letter x.',
          'Now we move the sentence into a record: x and four hundred and twenty together give six hundred.',
          'The equation is ready. Solving it is already familiar work.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Yozuvni tuzing', ru: 'Составь запись', en: 'Build the record' },
    title: {
      uz: 'Bu gap qaysi tenglama?',
      ru: 'Какое уравнение у этой фразы?',
      en: 'Which equation fits this sentence?',
    },
    question: {
      uz: '1562 soni x dan 837 ga ko\'p. Qaysi yozuv to\'g\'ri?',
      ru: 'Число 1562 больше x на 837. Какая запись верна?',
      en: 'The number 1562 is 837 more than x. Which record is right?',
    },
    options: [
      { uz: 'x + 837 = 1562', ru: 'x + 837 = 1562', en: 'x + 837 = 1562' },
      { uz: 'x - 837 = 1562', ru: 'x - 837 = 1562', en: 'x - 837 = 1562' },
      { uz: 'x + 1562 = 837', ru: 'x + 1562 = 837', en: 'x + 1562 = 837' },
      { uz: '837 - x = 1562', ru: '837 - x = 1562', en: '837 - x = 1562' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Kichik songa farqni qo'shsak, katta son chiqadi. Iks yetti yuz yigirma beshga teng.",
      ru: 'Верно. Прибавив разницу к меньшему числу, получим большее. Икс равен семистам двадцати пяти.',
      en: 'Correct. Adding the difference to the smaller number gives the larger one. So x equals seven hundred and twenty five.',
    },
    wrong: [
      null,
      {
        uz: "Bunda iks kattaroq bo'lib qoladi. Gapda esa katta son bir ming besh yuz oltmish ikki.",
        ru: 'Тогда икс окажется большим числом. А в фразе большее число — тысяча пятьсот шестьдесят два.',
        en: 'Then x would be the larger number. But in the sentence the larger number is one thousand five hundred and sixty two.',
      },
      {
        uz: "Bu yerda katta va kichik son o'rin almashgan.",
        ru: 'Здесь большее и меньшее числа поменялись местами.',
        en: 'Here the larger and the smaller numbers have swapped places.',
      },
      {
        uz: "Bunda farqdan katta son ayirilyapti. Farq har doim kichikroq bo'ladi.",
        ru: 'Здесь из разницы вычитают большее число. Разница всегда меньше.',
        en: 'Here the larger number is taken from the difference. A difference is always smaller.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Yangi so'zli buyurtma: bir ming besh yuz oltmish ikki soni iksdan sakkiz yuz o'ttiz yettiga ko'p.",
          "Demak iks kichik son, unga farqni qo'shsak katta son chiqadi.",
          "Qaysi yozuv to'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Новый словесный заказ: число тысяча пятьсот шестьдесят два больше икса на восемьсот тридцать семь.',
          'Значит, икс это меньшее число, и если прибавить к нему разницу, получится большее.',
          'Какая запись верна? Выбери ответ.',
        ],
        en: [
          'A new order in words: the number one thousand five hundred and sixty two is eight hundred and thirty seven more than x.',
          'So x is the smaller number, and adding the difference to it gives the larger one.',
          'Which record is right? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Uch qadamli qoida',
      ru: 'Правило в три шага',
      en: 'The rule in three steps',
    },
    lead: {
      uz: 'Har qanday tenglamada shu uch qadam ishlaydi.',
      ru: 'В любом уравнении работают эти три шага.',
      en: 'These three steps work in any equation.',
    },
    audio: {
      intro: {
        uz: [
          "Qoidani yig'amiz. Birinchi qadam: noma'lum qo'shiluvchini topish uchun yig'indidan ma'lum qo'shiluvchini ayiramiz.",
          "Ikkinchi qadam: noma'lum kamayuvchini topish uchun ayirmaga ayriluvchini qo'shamiz.",
          "Uchinchi qadam har doim bir xil: topilgan sonni harf o'rniga qo'yib tekshiramiz.",
        ],
        ru: [
          'Соберём правило. Первый шаг: чтобы найти неизвестное слагаемое, вычитаем из суммы известное слагаемое.',
          'Второй шаг: чтобы найти неизвестное уменьшаемое, прибавляем к разности вычитаемое.',
          'Третий шаг всегда один и тот же: подставляем найденное число вместо буквы и проверяем.',
        ],
        en: [
          'Let us put the rule together. Step one: to find an unknown addend, subtract the known addend from the sum.',
          'Step two: to find an unknown minuend, add the subtrahend to the difference.',
          'Step three is always the same: put the found number in place of the letter and check.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Qaysi yo\'l tez?', ru: 'Какой путь быстрее?', en: 'Which way is quicker?' },
    title: {
      uz: 'Ustun kerakmi?',
      ru: 'Нужен ли столбик?',
      en: 'Is a column needed?',
    },
    question: {
      uz: 'x + 998 = 1000. Bu tenglamani qanday yechgan qulay?',
      ru: 'x + 998 = 1000. Как удобнее решить это уравнение?',
      en: 'x + 998 = 1000. What is the convenient way to solve it?',
    },
    options: [
      { uz: 'Og\'zaki: 1000 gacha ikki yetishmaydi', ru: 'Устно: до 1000 не хватает двух', en: 'Mentally: two are missing to reach 1000' },
      { uz: 'Ustunda ayirish yozib', ru: 'Записав вычитание столбиком', en: 'By writing a column subtraction' },
      { uz: 'Sonlarni birma-bir sinab', ru: 'Перебирая числа по одному', en: 'By trying numbers one by one' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Sonlar juda yaqin, shuning uchun javob og'zaki ko'rinadi: iks ikkiga teng.",
      ru: 'Верно. Числа очень близки, поэтому ответ виден устно: икс равен двум.',
      en: 'Correct. The numbers are very close, so the answer is seen at once: x equals two.',
    },
    wrong: [
      null,
      {
        uz: "Ustun ham to'g'ri javob beradi, lekin bu yerda ortiqcha ish: sonlar juda yaqin.",
        ru: 'Столбик тоже даст верный ответ, но здесь это лишняя работа: числа очень близки.',
        en: 'A column would also give the right answer, but it is extra work here: the numbers are very close.',
      },
      {
        uz: "Sinab ko'rish uzoq yo'l. Tenglamada bog'lanish bor, uni ishlatish tezroq.",
        ru: 'Перебор — долгий путь. В уравнении есть связь, ею пользоваться быстрее.',
        en: 'Trying numbers is a long road. The equation has a link, and using it is faster.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Boshqaruv markazida oxirgi buyurtma qoldi: iks va to'qqiz yuz to'qson sakkiz teng bir ming.",
          "Ba'zan yozib o'tirish shart emas: sonlarga qarab javob ko'rinadi.",
          "Bu tenglamani qanday yechgan qulay? Javobni tanlang.",
        ],
        ru: [
          'В центре управления остался последний заказ: икс и девятьсот девяносто восемь равно тысяче.',
          'Иногда записывать не нужно: ответ виден по самим числам.',
          'Как удобнее решить это уравнение? Выбери ответ.',
        ],
        en: [
          'One last order is left in the control centre: x and nine hundred and ninety eight equals one thousand.',
          'Sometimes there is no need to write: the answer is visible in the numbers themselves.',
          'What is the convenient way to solve it? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Bit qayerda adashdi?',
      ru: 'Где ошибся Bit?',
      en: 'Where did Bit go wrong?',
    },
    question: {
      uz: 'Bit x - 240 = 510 ni yechdi va 270 chiqardi. Xato qayerda?',
      ru: 'Bit решил x - 240 = 510 и получил 270. Где ошибка?',
      en: 'Bit solved x - 240 = 510 and got 270. Where is the error?',
    },
    steps: [
      { uz: 'x - 240 = 510', ru: 'x - 240 = 510', en: 'x - 240 = 510' },
      { uz: 'x = 510 - 240', ru: 'x = 510 - 240', en: 'x = 510 - 240' },
      { uz: 'x = 270', ru: 'x = 270', en: 'x = 270' },
      { uz: '270 - 240 = 30', ru: '270 - 240 = 30', en: '270 - 240 = 30' },
    ],
    options: [
      { uz: "Ayirish o'rniga qo'shish kerak edi", ru: 'Вместо вычитания нужно было сложение', en: 'Addition was needed instead of subtraction' },
      { uz: "Qo'shish o'rniga ayirish kerak edi", ru: 'Вместо сложения нужно было вычитание', en: 'Subtraction was needed instead of addition' },
      { uz: 'Sonlar noto\'g\'ri ko\'chirilgan', ru: 'Числа переписаны неверно', en: 'The numbers were copied wrongly' },
      { uz: 'Xato yo\'q, javob to\'g\'ri', ru: 'Ошибки нет, ответ верный', en: 'There is no error, the answer is right' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Iks kamayuvchi, uni tiklash uchun ayirmaga ayriluvchini qo'shamiz: yetti yuz ellik.",
      ru: 'Верно. Икс — уменьшаемое, и чтобы его восстановить, к разности прибавляют вычитаемое: семьсот пятьдесят.',
      en: 'Correct. The x is the minuend, and to restore it we add the subtrahend to the difference: seven hundred and fifty.',
    },
    wrong: [
      null,
      {
        uz: "Bit aynan shunday qilgan va shu sababli adashgan. Bu yerda teskarisi kerak.",
        ru: 'Bit именно так и сделал, поэтому и ошибся. Здесь нужно наоборот.',
        en: 'That is exactly what Bit did, and that is why he was wrong. Here the opposite is needed.',
      },
      {
        uz: "Sonlar to'g'ri ko'chirilgan. Xato amalni tanlashda.",
        ru: 'Числа переписаны верно. Ошибка в выборе действия.',
        en: 'The numbers were copied correctly. The error is in the choice of action.',
      },
      {
        uz: "Tekshirish buni ochib beradi: ikki yuz yetmishdan ikki yuz qirq ayirilsa, o'ttiz chiqadi, besh yuz o'n emas.",
        ru: 'Проверка это показывает: из двухсот семидесяти вычесть двести сорок — получится тридцать, а не пятьсот десять.',
        en: 'The check shows it: two hundred and seventy minus two hundred and forty is thirty, not five hundred and ten.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bit yangi tenglamani yechdi va javobni tekshirmasdan yubordi.",
          "Uning yozuvi ekranda. Oxirgi qatorda tekshirish ham berilgan.",
          "Xato qayerda? Javobni tanlang.",
        ],
        ru: [
          'Bit решил новое уравнение и отправил ответ, не проверив.',
          'Его запись на экране. В последней строке дана и проверка.',
          'Где ошибка? Выбери ответ.',
        ],
        en: [
          'Bit solved a new equation and sent the answer without checking.',
          'His record is on the screen. The last line shows the check as well.',
          'Where is the error? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Muhr ochiladimi?',
      ru: 'Печать откроется?',
      en: 'Will the seal open?',
    },
    question: {
      uz: 'Muhrni ochish uchun qaysi yozuvni yuborish kerak?',
      ru: 'Какую запись нужно отправить, чтобы снять печать?',
      en: 'Which record must be sent to lift the seal?',
    },
    options: [
      { uz: 'x = 360 - 240, x = 120', ru: 'x = 360 - 240, x = 120', en: 'x = 360 - 240, x = 120' },
      { uz: 'x = 360 + 240, x = 600', ru: 'x = 360 + 240, x = 600', en: 'x = 360 + 240, x = 600' },
      { uz: 'x = 240, tekshirilmagan', ru: 'x = 240, без проверки', en: 'x = 240, unchecked' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yozuv ham, tekshirish ham joyida: muhr ochildi va qolgan panellar yo'lga chiqdi.",
      ru: 'Верно. И запись, и проверка на месте: печать снята, оставшиеся панели отправлены.',
      en: 'Correct. Both the record and the check are in place: the seal is lifted and the remaining panels are on their way.',
    },
    wrong: [
      null,
      {
        uz: "Bunda javob butundan katta. Muhr ochilmaydi.",
        ru: 'Здесь ответ больше целого. Печать не снимется.',
        en: 'Here the answer is larger than the whole. The seal will not open.',
      },
      {
        uz: "Bu yetkazilgan panellar soni, qolgani emas. Tekshirish ham qilinmagan.",
        ru: 'Это число доставленных панелей, а не оставшихся. И проверка не сделана.',
        en: 'That is the number of delivered panels, not the remaining ones. And no check was made.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Boshqaruv markazi muhrni faqat to'liq yozuv bilan ochadi: yechim va tekshirish birga.",
          "Uchta variant tayyorlandi.",
          "Qaysi birini yuboramiz? Javobni tanlang.",
        ],
        ru: [
          'Центр управления снимает печать только по полной записи: решение вместе с проверкой.',
          'Подготовлены три варианта.',
          'Какой отправим? Выбери ответ.',
        ],
        en: [
          'The control centre lifts the seal only for a full record: the solution together with the check.',
          'Three versions have been prepared.',
          'Which one shall we send? Choose an answer.',
        ],
      },
    },
  },

  s15: {
    eyebrow: { uz: 'Mukofot', ru: 'Награда', en: 'Reward' },
    stageLabel: { uz: 'YAKUNIY BOSQICH', ru: 'ФИНАЛЬНЫЙ ЭТАП', en: 'FINAL STAGE' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: "Qoidani tanlang va tenglamani tushunganingizni ko'rsating.",
      ru: 'Выбери правило и покажи, что понимаешь уравнение.',
      en: 'Choose the rule and show that you understand equations.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Noma\'lum qo\'shiluvchi qanday topiladi?',
      ru: 'Как находят неизвестное слагаемое?',
      en: 'How is an unknown addend found?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: "Yig'indidan ma'lum qo'shiluvchini ayirib", ru: 'Вычитанием известного слагаемого из суммы', en: 'By subtracting the known addend from the sum' },
      { uz: "Ikki qo'shiluvchini qo'shib", ru: 'Сложением двух слагаемых', en: 'By adding the two addends' },
      { uz: "Yig'indini ikkiga bo'lib", ru: 'Делением суммы на два', en: 'By dividing the sum by two' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "Shunday. Butundan ma'lum qismni olsak, yashirin qism qoladi.",
      ru: 'Именно так. Убрав от целого известную часть, получаем скрытую.',
      en: 'Exactly. Take the known part from the whole and the hidden part is left.',
    },
    reflectionWrong: {
      uz: "Hali emas. Tasmani eslang: butun ikki qismdan yig'ilgan.",
      ru: 'Пока нет. Вспомни полосу: целое собрано из двух частей.',
      en: 'Not yet. Remember the bar: the whole is made of two parts.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Darsning uch qoidasi', ru: 'Три правила урока', en: 'The three rules of the lesson' },
    main: [
      { uz: "Tenglama — ichida harf bo'lgan tenglik.", ru: 'Уравнение — это равенство с буквой внутри.', en: 'An equation is an equality with a letter inside.' },
      { uz: "Noma'lum qo'shiluvchi: yig'indidan ma'lumini ayiramiz.", ru: 'Неизвестное слагаемое: вычитаем из суммы известное.', en: 'Unknown addend: subtract the known one from the sum.' },
      { uz: "Noma'lum kamayuvchi: ayirmaga ayriluvchini qo'shamiz.", ru: 'Неизвестное уменьшаемое: прибавляем вычитаемое к разности.', en: 'Unknown minuend: add the subtrahend to the difference.' },
      { uz: "Javob harf o'rniga qo'yilib tekshiriladi.", ru: 'Ответ проверяют подстановкой вместо буквы.', en: 'The answer is checked by putting it in place of the letter.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Tenglama muhandisi', ru: 'Инженер уравнений', en: 'Equation engineer' },
        text: { uz: 'Barcha oltita vazifa birinchi urinishda yechildi.', ru: 'Все шесть заданий решены с первой попытки.', en: 'All six tasks were solved on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: "Noma'lum izlovchisi", ru: 'Искатель неизвестного', en: 'Seeker of the unknown' },
        text: { uz: "Siz qism va butunni ishonchli ajratasiz.", ru: 'Ты уверенно различаешь часть и целое.', en: 'You tell a part from a whole with confidence.' },
      },
      {
        min: 0,
        title: { uz: 'Buyurtma xodimi', ru: 'Сотрудник заказов', en: 'Order clerk' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Muhr ochildi. Endi markaz javobni yuborishdan oldin uni qanday tekshirishni so'raydi.",
      ru: 'Печать снята. Теперь центр просит показать, как проверять ответ до отправки.',
      en: 'The seal is lifted. Now the centre asks how to check an answer before sending it.',
    },
    audio: {
      intro: {
        uz: [
          "Buyurtma yopildi: qolgan panellar yo'lga chiqdi.",
          "Endi bitta savol qoldi. Qoidani tanlang va unvonni oling.",
          "Noma'lum qo'shiluvchi qanday topiladi? Javobni tanlang.",
        ],
        ru: [
          'Заказ закрыт: оставшиеся панели отправлены.',
          'Остался один вопрос. Выбери правило и получи звание.',
          'Как находят неизвестное слагаемое? Выбери ответ.',
        ],
        en: [
          'The order is closed: the remaining panels are on their way.',
          'One question is left. Choose the rule and claim your title.',
          'How is an unknown addend found? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Darsning ikki tayanchi: TASMA (qism va butun ko'rinadi) va PLITALAR
// (tenglama yozuvi qismlarga ajraladi). Animatsiya faqat matematik holat
// o'zgarishini ko'rsatadi: yashirin bo'lak ochiladi, plita yonadi, tekshiruv
// qatori tushadi. Bezak uchun harakat yo'q.
// ---------------------------------------------------------------------------
// s0 va s14: buyurtma stoli. `opened` — muhr ochilgan holat.
const OrderDesk = ({ opened }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 900 300">
      <defs>
        <linearGradient id="d42panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123246" />
          <stop offset="100%" stopColor="#0A2233" />
        </linearGradient>
      </defs>
      <rect x="40" y="24" width="820" height="252" rx="20" fill="url(#d42panel)" stroke="rgba(144,228,235,.28)" strokeWidth="2" />
      <text x="72" y="62" fill="#9DE3E7" fontSize="14" fontWeight="800" letterSpacing="3" fontFamily="JetBrains Mono, monospace">
        {t({ uz: 'BUYURTMA', ru: 'ЗАКAЗ', en: 'ORDER' })}
      </text>

      {/* jami */}
      <rect x="72" y="82" width="240" height="86" rx="14" fill="rgba(121,211,218,.12)" stroke="rgba(144,228,235,.4)" strokeWidth="1.6" />
      <text x="192" y="118" textAnchor="middle" fill="#9DE3E7" fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'jami panel', ru: 'всего панелей', en: 'panels in all' })}
      </text>
      <text x="192" y="152" textAnchor="middle" fill="#EAF9FB" fontSize="34" fontWeight="800" fontFamily="JetBrains Mono, monospace">360</text>

      {/* yetkazilgan */}
      <rect x="332" y="82" width="240" height="86" rx="14" fill="rgba(149,201,61,.14)" stroke="rgba(149,201,61,.45)" strokeWidth="1.6" />
      <text x="452" y="118" textAnchor="middle" fill={T.lime} fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'yetkazilgan', ru: 'доставлено', en: 'delivered' })}
      </text>
      <text x="452" y="152" textAnchor="middle" fill="#EAF9FB" fontSize="34" fontWeight="800" fontFamily="JetBrains Mono, monospace">240</text>

      {/* muhr ostidagi */}
      <rect
        x="592"
        y="82"
        width="240"
        height="86"
        rx="14"
        fill={opened ? 'rgba(149,201,61,.18)' : 'rgba(255,91,53,.16)'}
        stroke={opened ? T.lime : '#FFB39B'}
        strokeWidth="2"
      />
      <text x="712" y="118" textAnchor="middle" fill={opened ? T.lime : '#FFB39B'} fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {opened
          ? t({ uz: 'muhr ochildi', ru: 'печать снята', en: 'seal lifted' })
          : t({ uz: 'muhr ostida', ru: 'под печатью', en: 'under seal' })}
      </text>
      <text x="712" y="152" textAnchor="middle" fill="#EAF9FB" fontSize="34" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {opened ? '120' : 'x'}
      </text>

      {/* Yozuv qatori. Javob berilmaguncha BO'SH turadi: aks holda savolning
          javobi ekranda ko'rinib qoladi (METODIK_PROFIL: javob harakatdan
          keyin ochiladi). */}
      <rect
        x="72"
        y="196"
        width="760"
        height="60"
        rx="14"
        fill="rgba(1,13,22,.5)"
        stroke={opened ? 'rgba(149,201,61,.5)' : 'rgba(144,228,235,.22)'}
        strokeWidth="1.4"
        strokeDasharray={opened ? undefined : '9 7'}
      />
      <text
        x="452"
        y="234"
        textAnchor="middle"
        fill={opened ? '#EAF9FB' : 'rgba(157,227,231,.65)'}
        fontSize={opened ? 26 : 15}
        fontWeight="800"
        fontFamily={opened ? 'JetBrains Mono, monospace' : 'Manrope, sans-serif'}
      >
        {opened
          ? '120 + 240 = 360'
          : t({ uz: 'yozuv hali tanlanmagan', ru: 'запись ещё не выбрана', en: 'the record is not chosen yet' })}
      </text>
    </FitSvg>
  );
};

// s1, s12: tenglama plitalari. `labels` — bo'lak nomlari kadr bilan ochiladi.
const EqPlates = ({ frame = 0, left = 'x', known = '240', total = '360', labels = true, solvedValue = null }) => {
  const t = useT();
  const show = solvedValue !== null ? 4 : frame;
  return (
    <FitSvg viewBox="0 0 620 200">
      <Plate x={54} y={54} w={116} h={78} text={solvedValue !== null ? String(solvedValue) : left} kind={solvedValue !== null ? 'result' : 'unknown'} lit={show >= 1} />
      <Plate x={170} y={54} w={54} h={78} text="+" kind="sign" />
      <Plate x={224} y={54} w={140} h={78} text={known} kind="known" />
      <Plate x={364} y={54} w={54} h={78} text="=" kind="sign" />
      <Plate x={418} y={54} w={148} h={78} text={total} kind="known" lit={show >= 2} />
      {labels && show >= 2 && (
        <g>
          <Caption x={112} y={152} text={t({ uz: "qo'shiluvchi", ru: 'слагаемое', en: 'addend' })} tone={T.accent} />
          <Caption x={294} y={152} text={t({ uz: "qo'shiluvchi", ru: 'слагаемое', en: 'addend' })} />
          <Caption x={492} y={152} text={t({ uz: "yig'indi", ru: 'сумма', en: 'sum' })} />
        </g>
      )}
      {labels && show >= 3 && (
        <g>
          <rect x="196" y="170" width="228" height="26" rx="13" fill={T.accentSoft} />
          <text x="310" y="188" textAnchor="middle" fill={T.accent} fontSize="13" fontWeight="800" letterSpacing="2" fontFamily="Manrope, sans-serif">
            {t({ uz: 'TENGLAMA', ru: 'УРАВНЕНИЕ', en: 'EQUATION' })}
          </text>
        </g>
      )}
    </FitSvg>
  );
};

// s5: topilgan sonni qaytarib qo'yish.
const CheckLine = ({ frame = 0 }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 620 190">
      <Plate x={64} y={30} w={116} h={64} text={frame >= 1 ? '120' : 'x'} kind={frame >= 1 ? 'result' : 'unknown'} lit={frame >= 1} />
      <Plate x={180} y={30} w={48} h={64} text="+" kind="sign" />
      <Plate x={228} y={30} w={132} h={64} text="240" kind="known" />
      <Plate x={360} y={30} w={48} h={64} text="=" kind="sign" />
      <Plate x={408} y={30} w={140} h={64} text="360" kind="known" />
      {frame >= 2 && (
        <g>
          <rect x={128} y={110} width={356} height={44} rx="13" fill={T.successSoft} stroke={T.success} strokeWidth="1.8" />
          <text x={306} y={140} textAnchor="middle" fill={T.success} fontSize="22" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            360 = 360
          </text>
        </g>
      )}
      {frame >= 3 && (
        <Caption x={306} y={176} text={t({ uz: 'ikki tomon bir xil — javob qabul qilindi', ru: 'обе стороны равны — ответ принят', en: 'both sides equal — the answer is accepted' })} tone={T.success} />
      )}
    </FitSvg>
  );
};

// s9, s10: gap kartasi va undan chiqadigan tenglama.
const SentenceToEq = ({ frame = 0, sentence, equation, solved = false }) => {
  const t = useT();
  const show = solved ? 4 : frame;
  return (
    <FitSvg viewBox="0 0 700 210">
      <rect x={44} y={26} width={612} height={62} rx="15" fill="#FBFDF7" stroke="rgba(23,59,82,.12)" strokeWidth="1.6" />
      <text x={350} y={64} textAnchor="middle" fill={T.ink} fontSize="16" fontWeight="700" fontFamily="Manrope, sans-serif">
        {sentence}
      </text>
      <g opacity={show >= 1 ? 1 : 0.2}>
        <path d="M350 94 L350 118" stroke={T.cyan} strokeWidth="2.4" />
        <path d="M344 112 L350 122 L356 112 Z" fill={T.cyan} />
        <Caption x={430} y={114} text={t({ uz: "iks bilan belgilaymiz", ru: 'обозначим иксом', en: 'mark it with x' })} tone={T.cyan} />
      </g>
      <g opacity={show >= 2 ? 1 : 0.2}>
        <rect x={186} y={130} width={328} height={58} rx="15" fill={solved ? T.successSoft : T.accentSoft} stroke={solved ? T.success : T.accent} strokeWidth="2" />
        <text x={350} y={168} textAnchor="middle" fill={solved ? T.success : T.accent} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {equation}
        </text>
      </g>
    </FitSvg>
  );
};


// ---------------------------------------------------------------------------
// EKRANLAR
// ---------------------------------------------------------------------------
const Screen0 = (props) => (
  <ChoiceScreen
    {...props}
    plain
    ratio="30 / 11"
    ordinal={3}
    figure={({ solved }) => (
      <div className="hero-scene">
        <div className="hero-head">
          <span>LUMO CITY · BOSHQARUV MARKAZI · BUYURTMA STOLI</span>
          <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
            {solved ? 'OCHILDI' : 'MUHR'}
          </span>
        </div>
        <div className="hero-body">
          <OrderDesk opened={solved} />
        </div>
        <div className="d42-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'happy' : 'think'} /></div>
      </div>
    )}
  />
);
const Screen1 = (props) => <RevealScreen {...props} ratio="62 / 20" figure={({ frame }) => <EqPlates frame={frame} />} />;
const Screen2 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="76 / 23"
    figure={({ solved, picked }) => (
      <RecordRow
        records={['x + 240 = 360', '240 + 360', 'x + 240', '360 = 360']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        cardW={168}
        cardH={92}
        gap={18}
        size={21}
      />
    )}
  />
);
const Screen3 = (props) => (
  <RevealScreen {...props} ratio="66 / 23" figure={({ frame }) => <BarModel mode="part" whole="360" known="240" frame={frame} />} />
);
const Screen4 = (props) => (
  <SlotScreen
    {...props}
    ratio="66 / 23"
    figure={({ solved }) => <BarModel mode="part" whole="360" known="240" frame={3} solvedValue={solved ? 120 : null} />}
  />
);
const Screen5 = (props) => <RevealScreen {...props} ratio="62 / 19" figure={({ frame }) => <CheckLine frame={frame} />} />;
const Screen6 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 23"
    figure={({ solved }) => <BarModel mode="part" whole="4907" known="1425" frame={3} solvedValue={solved ? 3482 : null} />}
  />
);
const Screen7 = (props) => (
  <RevealScreen {...props} ratio="66 / 23" figure={({ frame }) => <BarModel mode="whole" whole="510" known="240" frame={frame} />} />
);
const Screen8 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={2}
    ratio="66 / 23"
    figure={({ solved }) => <BarModel mode="whole" whole="5100" known="2400" frame={3} solvedValue={solved ? 7500 : null} />}
  />
);
const Screen9 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="70 / 21"
      figure={({ frame }) => (
        <SentenceToEq
          frame={frame}
          sentence={t({
            uz: "Noma'lum songa 420 qo'shilsa, 600 hosil bo'ladi",
            ru: 'Если к неизвестному числу прибавить 420, получится 600',
            en: 'If 420 is added to an unknown number, the result is 600',
          })}
          equation="x + 420 = 600"
        />
      )}
    />
  );
};
const Screen10 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={4}
      ratio="70 / 21"
      figure={({ solved }) => (
        <SentenceToEq
          frame={1}
          solved={solved}
          sentence={t({
            uz: "1562 soni x dan 837 ga ko'p",
            ru: 'Число 1562 больше x на 837',
            en: 'The number 1562 is 837 more than x',
          })}
          equation={solved ? 'x + 837 = 1562' : '?'}
        />
      )}
    />
  );
};
// QOIDA kartasi: umumiy `RuleRows` bloki, mazmuni darsniki.
const RuleCard = ({ frame }) => {
  const t = useT();
  return (
    <RuleRows
      frame={frame}
      rows={[
        {
          tone: T.cyan,
          head: t({ uz: "Noma'lum qo'shiluvchi", ru: 'Неизвестное слагаемое', en: 'Unknown addend' }),
          body: t({ uz: "yig'indidan ma'lum qo'shiluvchini ayiramiz", ru: 'вычитаем из суммы известное слагаемое', en: 'subtract the known addend from the sum' }),
          formula: 'x = c - b',
        },
        {
          tone: T.accent,
          head: t({ uz: "Noma'lum kamayuvchi", ru: 'Неизвестное уменьшаемое', en: 'Unknown minuend' }),
          body: t({ uz: "ayirmaga ayriluvchini qo'shamiz", ru: 'прибавляем к разности вычитаемое', en: 'add the subtrahend to the difference' }),
          formula: 'x = c + b',
        },
        {
          tone: T.success,
          head: t({ uz: 'Tekshirish', ru: 'Проверка', en: 'The check' }),
          body: t({ uz: "topilgan sonni harf o'rniga qo'yamiz", ru: 'подставляем найденное число вместо буквы', en: 'put the found number in place of the letter' }),
          formula: null,
        },
      ]}
    />
  );
};

const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={5}
    ratio="62 / 20"
    figure={({ solved }) => (
      <EqPlates known="998" total="1000" labels={false} frame={2} solvedValue={solved ? 2 : null} />
    )}
  />
);
const Screen13 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      plain
      ratio="auto"
      ordinal={6}
      figure={({ solved, picked }) => (
        <StepList
          steps={CONTENT.s13.steps.map((step) => t(step))}
          badIndex={1}
          revealBad={solved}
          badLabel={t({ uz: 'xato shu yerda', ru: 'ошибка здесь', en: 'the error is here' })}
          showHint={picked !== null && !solved}
          hint={t({
            uz: "Oxirgi qatorni tekshiring: u tenglamaga mos kelyaptimi?",
            ru: 'Проверь последнюю строку: сходится ли она с уравнением?',
            en: 'Check the last line: does it agree with the equation?',
          })}
        />
      )}
    />
  );
};
const Screen14 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={7}
    ratio="72 / 23"
    figure={({ solved, picked }) => (
      <RecordRow
        records={['x = 360 - 240\nx = 120', 'x = 360 + 240\nx = 600', 'x = 240']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={720}
        cardW={216}
        cardH={108}
        gap={24}
        size={17}
      />
    )}
  />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

// ---------------------------------------------------------------------------
// Darsning o'z uslublari. Umumiy qatlam — KIT_STYLES.
// ---------------------------------------------------------------------------
const LESSON_STYLES = `
.d42-hero-bit {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 60px;
  height: 75px;
  transform: translateY(-50%);
  pointer-events: none;
}
.d42-hero-bit svg { width: 100%; height: 100%; }

`;

export default function Grade4Dars42(props) {
  return (
    <TheoryLessonRoot
      {...props}
      lessonMeta={LESSON_META}
      screenMeta={SCREEN_META}
      totalScreens={TOTAL_SCREENS}
      frameCounts={FRAME_COUNTS}
      content={CONTENT}
      screens={SCREENS}
      styles={KIT_STYLES + LESSON_STYLES}
    />
  );
}
