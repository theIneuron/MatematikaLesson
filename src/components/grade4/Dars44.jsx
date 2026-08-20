// ============================================================================
// 4-SINF · Dars 44 · Murakkab masalalar
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri:
//   37-bet 3-topshiriq — omborxona masalasi (14 587 + 10 030 - 850), darslik
//     uni ATAYLAB ikki usulda yechishni so'raydi;
//   37-bet 6-topshiriq — Malikaning xaridi ("ikkalasiga qancha to'lagan
//     bo'lsa, shuncha");
//   103-bet 6-topshiriq — uchta sisterna (10 427 l, 4 574 l, 1 696 l kam).
// Syujet: boshqaruv markazining OMBOR HISOBI (SYUJET_4SINF.md, 6-blok).
// 43-darsdan ko'prik: post yopildi, endi hisob bir qadamda chiqmaydi.
//
// YADRO. Murakkab masalada javob birdan chiqmaydi: avval ORALIQ qiymat
// topiladi, u javob emas. Bir masalani ikki yo'l bilan yechish mumkin va
// ikkalasi bir xil javob beradi.
//
// RITM: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
// ============================================================================
import {
  BitSVG, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, RecordRow, StepRows,
  RevealScreen, RuleRows, StepList, SummaryScreen, T, TableFill, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'multistep-4-44-v2',
  slug: 'dars44-murakkab-masalalar',
  lessonTitle: {
    uz: '44-dars. Murakkab masalalar',
    ru: 'Урок 44. Составные задачи',
    en: 'Lesson 44. Multi-step problems',
  },
  skillTags: ['intermediate_value', 'solution_plan', 'two_ways', 'sum_of_parts', 'answer_check'],
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

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Ombor hisobi', ru: 'Складской учёт', en: 'The warehouse ledger' },
    title: {
      uz: 'Kun hisobi yopilmadi',
      ru: 'Учёт дня не закрылся',
      en: 'The day ledger did not close',
    },
    question: {
      uz: 'Bitning javobida nima noto\'g\'ri?',
      ru: 'Что не так с ответом Bit?',
      en: 'What is wrong with Bit answer?',
    },
    options: [
      { uz: "Bu oraliq javob, oxirgisi emas", ru: 'Это промежуточный ответ, а не итоговый', en: 'That is an intermediate answer, not the final one' },
      { uz: "Sonlar noto'g'ri qo'shilgan", ru: 'Числа сложены неверно', en: 'The numbers were added wrongly' },
      { uz: "Sotilganlar ikki marta ayirilgan", ru: 'Проданное вычли дважды', en: 'The sold goods were subtracted twice' },
      { uz: "Masalada ma'lumot yetishmaydi", ru: 'В задаче не хватает данных', en: 'The problem lacks data' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bu keltirilgandan keyingi son. Sotilganlar hali ayirilmagan, demak yo'l tugamagan.",
      ru: 'Верно. Это число после привоза. Проданное ещё не вычтено, значит путь не завершён.',
      en: 'Correct. That is the number after the delivery. The sold goods are not subtracted yet, so the path is unfinished.',
    },
    wrong: [
      null,
      {
        uz: "Qo'shish to'g'ri bajarilgan: tekshirib ko'rsangiz, o'sha son chiqadi. Muammo boshqa joyda.",
        ru: 'Сложение выполнено верно: если проверить, получится то же число. Дело в другом.',
        en: 'The addition is right: check it and you get the same number. The trouble is elsewhere.',
      },
      {
        uz: "Sotilganlar umuman ayirilmagan. Shuning uchun son kattaroq bo'lib qolgan.",
        ru: 'Проданное вообще не вычли. Поэтому число и осталось больше.',
        en: 'The sold goods were not subtracted at all. That is why the number stayed larger.',
      },
      {
        uz: "Ma'lumot yetarli: boshlang'ich son, keltirilgan va sotilgan berilgan.",
        ru: 'Данных достаточно: есть начальное число, привоз и продажа.',
        en: 'There is enough data: the starting number, the delivery and the sale are given.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Tekshiruv posti yopildi va ish ombor hisobiga o'tdi.",
          "Ertalab omborda o'n to'rt ming besh yuz sakson yetti quti bor edi. Kun davomida o'n ming o'ttizta keltirildi.",
          "Keyin sakkiz yuz ellikta sotuvga chiqarildi. Bit hisobga yigirma to'rt ming olti yuz o'n yetti deb yozdi.",
          "Hisob yopilmadi. Sizningcha, Bitning javobida nima noto'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Пост проверки закрылся, и работа перешла на складской учёт.',
          'Утром на складе было четырнадцать тысяч пятьсот восемьдесят семь коробок. За день привезли десять тысяч тридцать.',
          'Потом восемьсот пятьдесят отправили в продажу. Bit записал в учёт двадцать четыре тысячи шестьсот семнадцать.',
          'Учёт не закрылся. Как ты думаешь, что не так с ответом Bit? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The verification desk has closed and the work moved to the warehouse ledger.',
          'In the morning the store held fourteen thousand five hundred and eighty seven boxes. During the day ten thousand and thirty arrived.',
          'Then eight hundred and fifty went out for sale. Bit wrote twenty four thousand six hundred and seventeen into the ledger.',
          'The ledger did not close. What do you think is wrong with Bit answer? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Oraliq qiymat', ru: 'Промежуточное значение', en: 'The intermediate value' },
    title: {
      uz: 'Javob ikki qadamda',
      ru: 'Ответ в два шага',
      en: 'The answer takes two steps',
    },
    lead: {
      uz: "Masalada so'ralgan son darrov berilmagan: avval boshqa sonni topish kerak.",
      ru: 'Искомое число не дано сразу: сначала нужно найти другое число.',
      en: 'The number asked for is not given at once: another number has to be found first.',
    },
    note: {
      uz: "Oraliq qiymat javob emas. U keyingi qadamning materiali.",
      ru: 'Промежуточное значение — не ответ. Это материал для следующего шага.',
      en: 'An intermediate value is not the answer. It is the material for the next step.',
    },
    audio: {
      intro: {
        uz: [
          "Masalani qadamlarga ajratamiz. Savol shu: kun oxirida omborda nechta quti qoldi?",
          "Bir qadamda javob berib bo'lmaydi, chunki keltirilgandan keyingi son berilmagan.",
          "Birinchi qadam: bor edi va keltirildi qo'shiladi. Bu oraliq qiymat.",
          "Ikkinchi qadam: oraliq qiymatdan sotilganlar ayiriladi. Mana shu javob.",
        ],
        ru: [
          'Разложим задачу на шаги. Вопрос такой: сколько коробок осталось на складе к концу дня?',
          'За один шаг ответить нельзя, потому что число после привоза не дано.',
          'Первый шаг: складываем то, что было, и то, что привезли. Это промежуточное значение.',
          'Второй шаг: из промежуточного значения вычитаем проданное. Вот это и есть ответ.',
        ],
        en: [
          'Let us split the problem into steps. The question is: how many boxes were left in the store by the end of the day?',
          'One step is not enough, because the number after the delivery is not given.',
          'Step one: add what there was and what arrived. That is the intermediate value.',
          'Step two: take the sold goods from the intermediate value. That is the answer.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Rejani tuzing', ru: 'Составь план', en: 'Build the plan' },
    title: {
      uz: 'Qaysi savol birinchi?',
      ru: 'Какой вопрос первый?',
      en: 'Which question comes first?',
    },
    question: {
      uz: 'Javobga yetish uchun avval nimani topamiz?',
      ru: 'Что найдём сначала, чтобы дойти до ответа?',
      en: 'What do we find first to reach the answer?',
    },
    options: [
      { uz: 'Keltirilgandan keyin qancha bo\'ldi', ru: 'Сколько стало после привоза', en: 'How many there were after the delivery' },
      { uz: 'Qancha sotildi', ru: 'Сколько продали', en: 'How many were sold' },
      { uz: 'Ertalab qancha bor edi', ru: 'Сколько было утром', en: 'How many there were in the morning' },
      { uz: 'Kun oxirida qancha qoldi', ru: 'Сколько осталось к концу дня', en: 'How many were left at the end of the day' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bu son berilmagan, uni birinchi qadamda topamiz va keyin ishlatamiz.",
      ru: 'Верно. Это число не дано, его находим на первом шаге и потом используем.',
      en: 'Correct. That number is not given: we find it at the first step and use it afterwards.',
    },
    wrong: [
      null,
      {
        uz: "Sotilganlar soni allaqachon berilgan. Topish kerak bo'lgan sonni izlang.",
        ru: 'Число проданных уже дано. Ищи то число, которое нужно найти.',
        en: 'The number sold is already given. Look for the number that has to be found.',
      },
      {
        uz: "Ertalabki son ham berilgan. Bu qadam emas.",
        ru: 'Утреннее число тоже дано. Это не шаг.',
        en: 'The morning number is given as well. That is not a step.',
      },
      {
        uz: "Bu masalaning oxirgi savoli. Unga yetish uchun avvalroq bitta son kerak.",
        ru: 'Это последний вопрос задачи. Чтобы дойти до него, нужно одно число раньше.',
        en: 'That is the final question of the problem. To reach it one number is needed earlier.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ombor hisobida to'rt savol yozib qo'yilgan.",
          "Ulardan uchtasining javobi allaqachon ma'lum, bittasi esa topilishi kerak.",
          "Javobga yetish uchun avval nimani topamiz? Javobni tanlang.",
        ],
        ru: [
          'В складском учёте записаны четыре вопроса.',
          'На три из них ответ уже известен, а один нужно найти.',
          'Что найдём сначала, чтобы дойти до ответа? Выбери ответ.',
        ],
        en: [
          'Four questions are written in the warehouse ledger.',
          'Three of them are already answered and one has to be found.',
          'What do we find first to reach the answer? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Ikki qadam', ru: 'Два шага', en: 'Two steps' },
    title: {
      uz: 'Rejani sonlar bilan',
      ru: 'План в числах',
      en: 'The plan in numbers',
    },
    lead: {
      uz: 'Har qadam o\'z yozuviga ega. Ikkinchi qadam birinchisining natijasini oladi.',
      ru: 'У каждого шага своя запись. Второй шаг берёт результат первого.',
      en: 'Each step has its own record. The second step takes the result of the first.',
    },
    note: {
      uz: "Oraliq qiymat ostiga chiziq tortilmaydi: javob faqat oxirgi qatorda.",
      ru: 'Промежуточное значение не подчёркивают: ответ только в последней строке.',
      en: 'The intermediate value is not underlined: the answer is only in the last line.',
    },
    audio: {
      intro: {
        uz: [
          "Birinchi qadamni yozamiz: o'n to'rt ming besh yuz sakson yetti va o'n ming o'ttiz qo'shiladi.",
          "Yigirma to'rt ming olti yuz o'n yetti chiqadi. Bu Bit yozgan son, lekin bu oraliq qiymat.",
          "Ikkinchi qadam: shu sondan sakkiz yuz ellik ayiriladi.",
          "Yigirma uch ming yetti yuz oltmish yetti chiqadi. Kun hisobining javobi shu.",
        ],
        ru: [
          'Запишем первый шаг: складываем четырнадцать тысяч пятьсот восемьдесят семь и десять тысяч тридцать.',
          'Получается двадцать четыре тысячи шестьсот семнадцать. Это и есть число Bit, но оно промежуточное.',
          'Второй шаг: из этого числа вычитаем восемьсот пятьдесят.',
          'Получается двадцать три тысячи семьсот шестьдесят семь. Это и есть ответ учёта дня.',
        ],
        en: [
          'Let us write the first step: we add fourteen thousand five hundred and eighty seven and ten thousand and thirty.',
          'That gives twenty four thousand six hundred and seventeen. This is the number Bit wrote, but it is intermediate.',
          'Step two: from that number we take eight hundred and fifty.',
          'That gives twenty three thousand seven hundred and sixty seven. This is the answer of the day ledger.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Kun oxiridagi son',
      ru: 'Число на конец дня',
      en: 'The number at the end of the day',
    },
    question: {
      uz: 'Kun oxirida omborda nechta quti qoldi?',
      ru: 'Сколько коробок осталось на складе к концу дня?',
      en: 'How many boxes were left in the store at the end of the day?',
    },
    answer: 23767,
    unit: { uz: 'quti', ru: 'кор.', en: 'boxes' },
    correctText: {
      uz: "To'g'ri. Oraliq qiymatdan sakkiz yuz ellik ayirildi va hisob yopildi.",
      ru: 'Верно. Из промежуточного значения вычли восемьсот пятьдесят, и учёт закрылся.',
      en: 'Correct. Eight hundred and fifty was taken from the intermediate value and the ledger closed.',
    },
    wrong: {
      uz: "Hali emas. Ikkinchi qadamni bajaring: oraliq qiymatdan sotilganlarni ayiring.",
      ru: 'Пока нет. Выполни второй шаг: вычти проданное из промежуточного значения.',
      en: 'Not yet. Do the second step: take the sold goods from the intermediate value.',
    },
    hintAfter: {
      uz: "Oraliq qiymat yigirma to'rt ming olti yuz o'n yetti edi. Undan sakkiz yuz ellikni ayiring.",
      ru: 'Промежуточное значение было двадцать четыре тысячи шестьсот семнадцать. Вычти из него восемьсот пятьдесят.',
      en: 'The intermediate value was twenty four thousand six hundred and seventeen. Take eight hundred and fifty from it.',
    },
    audio: {
      intro: {
        uz: [
          "Birinchi qadam bajarildi, oraliq qiymat tayyor.",
          "Endi ikkinchi qadam sizniki.",
          "Kun oxirida nechta quti qoldi? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Первый шаг выполнен, промежуточное значение готово.',
          'Теперь второй шаг за тобой.',
          'Сколько коробок осталось к концу дня? Набери ответ и подтверди.',
        ],
        en: [
          'The first step is done and the intermediate value is ready.',
          'Now the second step is yours.',
          'How many boxes were left at the end of the day? Type the answer and confirm.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Ikkinchi yo\'l', ru: 'Второй путь', en: 'The second way' },
    title: {
      uz: 'Bitta masala, ikki yo\'l',
      ru: 'Одна задача, два пути',
      en: 'One problem, two ways',
    },
    lead: {
      uz: "Darslik shu masalani ataylab ikki usulda yechishni so'raydi.",
      ru: 'Учебник специально просит решить эту задачу двумя способами.',
      en: 'The textbook asks on purpose for this problem to be solved in two ways.',
    },
    note: {
      uz: 'Yo\'llar har xil, javob esa bitta. Bu javobning tekshiruvi ham bo\'ladi.',
      ru: 'Пути разные, а ответ один. Это заодно и проверка ответа.',
      en: 'The ways differ, the answer is one. That is also a check of the answer.',
    },
    audio: {
      intro: {
        uz: [
          "Kun davomida omborga keltirildi va ombordan olindi. Bu ikki harakatni birlashtirish mumkin.",
          "O'n ming o'ttizdan sakkiz yuz ellikni ayiramiz: to'qqiz ming bir yuz sakson.",
          "Bu kun davomidagi sof o'sish. Endi uni ertalabki songa qo'shamiz.",
          "O'n to'rt ming besh yuz sakson yetti va to'qqiz ming bir yuz sakson. Yana yigirma uch ming yetti yuz oltmish yetti.",
        ],
        ru: [
          'За день на склад привозили и со склада забирали. Эти два движения можно объединить.',
          'Из десяти тысяч тридцати вычтем восемьсот пятьдесят: девять тысяч сто восемьдесят.',
          'Это чистая прибавка за день. Теперь прибавим её к утреннему числу.',
          'Четырнадцать тысяч пятьсот восемьдесят семь и девять тысяч сто восемьдесят. Снова двадцать три тысячи семьсот шестьдесят семь.',
        ],
        en: [
          'During the day goods arrived at the store and left it. These two movements can be joined.',
          'From ten thousand and thirty we take eight hundred and fifty: nine thousand one hundred and eighty.',
          'That is the net gain for the day. Now we add it to the morning number.',
          'Fourteen thousand five hundred and eighty seven and nine thousand one hundred and eighty. Again twenty three thousand seven hundred and sixty seven.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Yo\'lni taniing', ru: 'Узнай путь', en: 'Recognise the way' },
    title: {
      uz: 'Qaysi yozuv ikkinchi yo\'l?',
      ru: 'Какая запись — второй путь?',
      en: 'Which record is the second way?',
    },
    question: {
      uz: 'Ikkinchi usul qaysi yozuv bilan mos keladi?',
      ru: 'Какой записи соответствует второй способ?',
      en: 'Which record matches the second way?',
    },
    options: [
      { uz: '14587 + (10030 - 850)', ru: '14587 + (10030 - 850)', en: '14587 + (10030 - 850)' },
      { uz: '(14587 + 10030) - 850', ru: '(14587 + 10030) - 850', en: '(14587 + 10030) - 850' },
      { uz: '14587 - (10030 - 850)', ru: '14587 - (10030 - 850)', en: '14587 - (10030 - 850)' },
      { uz: '(14587 - 850) + 10030', ru: '(14587 - 850) + 10030', en: '(14587 - 850) + 10030' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Avval kun davomidagi sof o'sish, keyin uni ertalabki songa qo'shish.",
      ru: 'Верно. Сначала чистая прибавка за день, затем её прибавляют к утреннему числу.',
      en: 'Correct. First the net gain for the day, then it is added to the morning number.',
    },
    wrong: [
      null,
      {
        uz: "Bu birinchi yo'l: avval qo'shildi, keyin ayirildi. Ikkinchisi boshqacha boshlanadi.",
        ru: 'Это первый путь: сначала сложили, потом вычли. Второй начинается иначе.',
        en: 'That is the first way: first added, then subtracted. The second one starts differently.',
      },
      {
        uz: "Bu yerda o'sish ayirilyapti. Kun davomida ombor kamaymadi, ko'paydi.",
        ru: 'Здесь прибавку вычитают. За день склад не уменьшился, а вырос.',
        en: 'Here the gain is subtracted. The store did not shrink during the day, it grew.',
      },
      {
        uz: "Bunda sotilganlar ertalabki sondan ayirilgan. Aslida ular keltirilgandan keyin olingan.",
        ru: 'Здесь проданное вычли из утреннего числа. На деле их взяли уже после привоза.',
        en: 'Here the sold goods are taken from the morning number. In fact they were taken after the delivery.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Hisobga to'rtta yozuv taklif qilindi.",
          "Ikkinchi usul kun davomidagi sof o'sishdan boshlanadi.",
          "Qaysi yozuv unga mos keladi? Javobni tanlang.",
        ],
        ru: [
          'В учёт предложили четыре записи.',
          'Второй способ начинается с чистой прибавки за день.',
          'Какая запись ему соответствует? Выбери ответ.',
        ],
        en: [
          'Four records were offered for the ledger.',
          'The second way starts from the net gain for the day.',
          'Which record matches it? Choose an answer.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Boshqa tuzilma', ru: 'Другая структура', en: 'A different structure' },
    title: {
      uz: 'Ikkalasiga qancha bo\'lsa, shuncha',
      ru: 'Столько же, сколько за оба',
      en: 'As much as for both together',
    },
    lead: {
      uz: 'Uchinchi son berilmagan: u birinchi ikkitasining yig\'indisiga teng.',
      ru: 'Третье число не дано: оно равно сумме первых двух.',
      en: 'The third number is not given: it equals the sum of the first two.',
    },
    note: {
      uz: "Bu yerda ham oraliq qiymat bor, faqat u yig'indi bo'lib chiqadi.",
      ru: 'Здесь тоже есть промежуточное значение, только оно оказывается суммой.',
      en: 'Here too there is an intermediate value, only it turns out to be a sum.',
    },
    audio: {
      intro: {
        uz: [
          "Ombor xarid hisobini ham yuritadi. Qalamlar uchun sakkiz ming ikki yuz ellik so'm to'landi.",
          "Rangli qog'ozlar uchun olti ming so'm to'landi.",
          "Bo'yoqlar uchun esa qalam va qog'ozga qancha to'langan bo'lsa, shuncha to'landi.",
          "Demak bo'yoqlar narxi ikkovining yig'indisi: o'n to'rt ming ikki yuz ellik so'm.",
        ],
        ru: [
          'Склад ведёт и учёт покупок. За карандаши заплатили восемь тысяч двести пятьдесят сумов.',
          'За цветную бумагу заплатили шесть тысяч сумов.',
          'А за краски заплатили столько же, сколько за карандаши и бумагу вместе.',
          'Значит, цена красок это сумма двух первых: четырнадцать тысяч двести пятьдесят сумов.',
        ],
        en: [
          'The store also keeps a purchase ledger. Eight thousand two hundred and fifty sums were paid for pencils.',
          'Six thousand sums were paid for coloured paper.',
          'And for the paints they paid as much as for the pencils and the paper together.',
          'So the price of the paints is the sum of the first two: fourteen thousand two hundred and fifty sums.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Jami qancha to\'landi?',
      ru: 'Сколько заплатили всего?',
      en: 'How much was paid in all?',
    },
    question: {
      uz: 'Uchala xarid uchun jami qancha to\'landi?',
      ru: 'Сколько заплатили за все три покупки?',
      en: 'How much was paid for all three purchases?',
    },
    answer: 28500,
    unit: { uz: "so'm", ru: 'сум', en: 'sums' },
    correctText: {
      uz: "To'g'ri. Uchta xarid qo'shildi: yigirma sakkiz ming besh yuz so'm.",
      ru: 'Верно. Три покупки сложены: двадцать восемь тысяч пятьсот сумов.',
      en: 'Correct. The three purchases are added: twenty eight thousand five hundred sums.',
    },
    wrong: {
      uz: "Hali emas. Avval bo'yoqlar narxini toping, keyin uchala sonni qo'shing.",
      ru: 'Пока нет. Сначала найди цену красок, потом сложи все три числа.',
      en: 'Not yet. First find the price of the paints, then add all three numbers.',
    },
    hintAfter: {
      uz: "Bo'yoqlar o'n to'rt ming ikki yuz ellik so'm. Uchala sonni qo'shing.",
      ru: 'Краски стоят четырнадцать тысяч двести пятьдесят сумов. Сложи все три числа.',
      en: 'The paints cost fourteen thousand two hundred and fifty sums. Add all three numbers.',
    },
    audio: {
      intro: {
        uz: [
          "Bo'yoqlar narxi topildi: o'n to'rt ming ikki yuz ellik so'm.",
          "Endi hisobni yopish kerak.",
          "Uchala xarid uchun jami qancha to'landi? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Цена красок найдена: четырнадцать тысяч двести пятьдесят сумов.',
          'Теперь нужно закрыть учёт.',
          'Сколько заплатили за все три покупки? Набери ответ и подтверди.',
        ],
        en: [
          'The price of the paints is found: fourteen thousand two hundred and fifty sums.',
          'Now the ledger has to be closed.',
          'How much was paid for all three purchases? Type the answer and confirm.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Uch qadam', ru: 'Три шага', en: 'Three steps' },
    title: {
      uz: 'Zanjir uzunroq bo\'lsa',
      ru: 'Когда цепочка длиннее',
      en: 'When the chain is longer',
    },
    lead: {
      uz: 'Ba\'zan oraliq qiymat bittadan ko\'p bo\'ladi va ular ketma-ket topiladi.',
      ru: 'Иногда промежуточных значений больше одного, и их находят подряд.',
      en: 'Sometimes there is more than one intermediate value, and they are found in a row.',
    },
    note: {
      uz: "Har qadamda qaysi son topilganini yozib borish adashishdan saqlaydi.",
      ru: 'Записывать, какое число найдено на каждом шаге, помогает не запутаться.',
      en: 'Writing down which number was found at each step keeps you from getting lost.',
    },
    audio: {
      intro: {
        uz: [
          "Omborda uchta sisterna bor. Ularda jami o'n ming to'rt yuz yigirma yetti litr benzin.",
          "Birinchi sisternada to'rt ming besh yuz yetmish to'rt litr.",
          "Ikkinchisida birinchisidan bir ming olti yuz to'qson olti litr kam: ikki ming sakkiz yuz yetmish sakkiz.",
          "Ikkovini qo'shsak, yetti ming to'rt yuz ellik ikki. Jamidan ayirsak, uchinchisida ikki ming to'qqiz yuz yetmish besh litr.",
        ],
        ru: [
          'На складе три цистерны. В них всего десять тысяч четыреста двадцать семь литров бензина.',
          'В первой цистерне четыре тысячи пятьсот семьдесят четыре литра.',
          'Во второй на тысячу шестьсот девяносто шесть литров меньше, чем в первой: две тысячи восемьсот семьдесят восемь.',
          'Сложим две первые: семь тысяч четыреста пятьдесят два. Вычтем из общего: в третьей две тысячи девятьсот семьдесят пять литров.',
        ],
        en: [
          'The store has three tanks. Together they hold ten thousand four hundred and twenty seven litres of petrol.',
          'The first tank holds four thousand five hundred and seventy four litres.',
          'The second holds one thousand six hundred and ninety six litres less than the first: two thousand eight hundred and seventy eight.',
          'Adding the first two gives seven thousand four hundred and fifty two. Taking that from the total leaves two thousand nine hundred and seventy five litres in the third.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Jadvalni to\'ldiring', ru: 'Заполни таблицу', en: 'Fill in the table' },
    title: {
      uz: 'Ikkinchi sisterna',
      ru: 'Вторая цистерна',
      en: 'The second tank',
    },
    question: {
      uz: 'Bo\'sh katakka qaysi son turadi?',
      ru: 'Какое число встанет в пустую клетку?',
      en: 'Which number goes into the empty cell?',
    },
    columns: [
      { uz: 'Sisterna', ru: 'Цистерна', en: 'Tank' },
      { uz: 'Qanday topiladi', ru: 'Как находим', en: 'How it is found' },
      { uz: 'Litr', ru: 'Литры', en: 'Litres' },
    ],
    rows: [
      [{ uz: '1', ru: '1', en: '1' }, { uz: 'berilgan', ru: 'дано', en: 'given' }, { uz: '4574', ru: '4574', en: '4574' }],
      [{ uz: '2', ru: '2', en: '2' }, { uz: '4574 - 1696', ru: '4574 - 1696', en: '4574 - 1696' }, null],
    ],
    chips: [
      { uz: '2878', ru: '2878', en: '2878' },
      { uz: '6270', ru: '6270', en: '6270' },
      { uz: '2788', ru: '2788', en: '2788' },
      { uz: '1696', ru: '1696', en: '1696' },
    ],
    correctChip: 0,
    correctText: {
      uz: "To'g'ri. Birinchisidan kamroq degani ayirish: ikki ming sakkiz yuz yetmish sakkiz litr.",
      ru: 'Верно. Меньше, чем в первой, значит вычитание: две тысячи восемьсот семьдесят восемь литров.',
      en: 'Correct. Less than the first means subtraction: two thousand eight hundred and seventy eight litres.',
    },
    wrong: [
      null,
      {
        uz: "Bu qo'shishning natijasi. Shartda esa kamroq deyilgan.",
        ru: 'Это результат сложения. А в условии сказано меньше.',
        en: 'That is the result of addition. But the problem says less.',
      },
      {
        uz: "Raqamlar o'rin almashgan. Ayirishni yana bir bor bajaring.",
        ru: 'Цифры переставлены. Выполни вычитание ещё раз.',
        en: 'The digits are swapped. Do the subtraction once more.',
      },
      {
        uz: "Bu farqning o'zi, sisternadagi miqdor emas.",
        ru: 'Это сама разница, а не количество в цистерне.',
        en: 'That is the difference itself, not the amount in the tank.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Sisternalar jadvali tuzildi. Birinchi qator to'liq.",
          "Ikkinchi qatorda hisob yozilgan, natija esa bo'sh.",
          "Bo'sh katakka qaysi son turadi? Javobni tanlang.",
        ],
        ru: [
          'Таблица цистерн составлена. Первая строка полная.',
          'Во второй строке записан расчёт, а результат пуст.',
          'Какое число встанет в пустую клетку? Выбери ответ.',
        ],
        en: [
          'The table of tanks is ready. The first row is complete.',
          'The second row shows the calculation and the result is empty.',
          'Which number goes into the empty cell? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Murakkab masala tartibi',
      ru: 'Порядок составной задачи',
      en: 'The order of a multi-step problem',
    },
    lead: {
      uz: 'Har murakkab masalada shu tartib ishlaydi.',
      ru: 'В любой составной задаче работает этот порядок.',
      en: 'This order works in any multi-step problem.',
    },
    audio: {
      intro: {
        uz: [
          "Qoidani yig'amiz. Birinchi qadam: savolni topib, unga nima yetishmayotganini aniqlash.",
          "Ikkinchi qadam: yetishmagan sonni alohida topish. Bu oraliq qiymat va u javob emas.",
          "Uchinchi qadam: oraliq qiymat bilan asosiy savolga javob berish va javobni mantiq bilan tekshirish.",
        ],
        ru: [
          'Соберём правило. Первый шаг: найти вопрос и понять, чего для него не хватает.',
          'Второй шаг: найти недостающее число отдельно. Это промежуточное значение, и оно не ответ.',
          'Третий шаг: с помощью промежуточного значения ответить на главный вопрос и проверить ответ на разумность.',
        ],
        en: [
          'Let us put the rule together. Step one: find the question and see what is missing for it.',
          'Step two: find the missing number on its own. That is the intermediate value and it is not the answer.',
          'Step three: use the intermediate value to answer the main question and check that the answer is reasonable.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Qaysi yo\'l tez?', ru: 'Какой путь быстрее?', en: 'Which way is quicker?' },
    title: {
      uz: 'Qaysi yo\'l qulayroq?',
      ru: 'Какой путь удобнее?',
      en: 'Which way is more convenient?',
    },
    question: {
      uz: 'Ombor 6000 ta oldi va 6000 ta berdi. Qaysi yo\'l qulay?',
      ru: 'Склад принял 6000 и отдал 6000. Какой путь удобнее?',
      en: 'The store took in 6000 and gave out 6000. Which way is convenient?',
    },
    options: [
      { uz: "Sof o'zgarishni topish: nol", ru: 'Найти чистое изменение: ноль', en: 'Find the net change: zero' },
      { uz: "Avval qo'shib, keyin ayirish", ru: 'Сначала сложить, потом вычесть', en: 'First add, then subtract' },
      { uz: 'Ikkala yo\'lni ham hisoblash', ru: 'Посчитать обоими путями', en: 'Calculate both ways' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Kelgan va ketgan teng, demak ombor o'zgarmadi va hisob bir qarashda yopiladi.",
      ru: 'Верно. Пришло и ушло поровну, значит склад не изменился и учёт закрывается сразу.',
      en: 'Correct. As much came in as went out, so the store did not change and the ledger closes at once.',
    },
    wrong: [
      null,
      {
        uz: "Bu ham to'g'ri javob beradi, lekin ikkita katta hisob kerak bo'ladi.",
        ru: 'Так тоже получится верно, но потребуются два больших вычисления.',
        en: 'This also gives the right answer, but it needs two large calculations.',
      },
      {
        uz: "Ikki yo'l tekshiruv uchun yaxshi, lekin bu yerda javob hisobsiz ko'rinadi.",
        ru: 'Два пути хороши для проверки, но здесь ответ виден без вычислений.',
        en: 'Two ways are good for checking, but here the answer is visible without calculating.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ombor yana bir kun ishladi: olti ming quti keldi va olti ming quti ketdi.",
          "Ba'zan sonlarga qarab javob darrov ko'rinadi.",
          "Qaysi yo'l qulay? Javobni tanlang.",
        ],
        ru: [
          'Склад отработал ещё день: шесть тысяч коробок пришло и шесть тысяч ушло.',
          'Иногда ответ виден прямо по числам.',
          'Какой путь удобнее? Выбери ответ.',
        ],
        en: [
          'The store worked another day: six thousand boxes came in and six thousand went out.',
          'Sometimes the answer is visible straight from the numbers.',
          'Which way is convenient? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Bit hisobni qayerda uzdi?',
      ru: 'Где Bit оборвал расчёт?',
      en: 'Where did Bit cut the calculation short?',
    },
    question: {
      uz: 'Bit yozuvida nima yetishmaydi?',
      ru: 'Чего не хватает в записи Bit?',
      en: 'What is missing from Bit record?',
    },
    steps: [
      { uz: 'Savol: kun oxirida nechta qoldi?', ru: 'Вопрос: сколько осталось к концу дня?', en: 'Question: how many were left at the end of the day?' },
      { uz: '1-qadam: 14587 + 10030 = 24617', ru: '1 шаг: 14587 + 10030 = 24617', en: 'Step 1: 14587 + 10030 = 24617' },
      { uz: 'Javob: 24617 quti', ru: 'Ответ: 24617 коробок', en: 'Answer: 24617 boxes' },
      { uz: 'Tekshirish: yozilmagan', ru: 'Проверка: не записана', en: 'Check: not written' },
    ],
    options: [
      { uz: 'Ikkinchi qadam bajarilmagan', ru: 'Второй шаг не выполнен', en: 'The second step was not done' },
      { uz: "Birinchi qadam noto'g'ri hisoblangan", ru: 'Первый шаг посчитан неверно', en: 'The first step was calculated wrongly' },
      { uz: 'Savol noto\'g\'ri yozilgan', ru: 'Вопрос записан неверно', en: 'The question was written wrongly' },
      { uz: 'Hammasi joyida', ru: 'Всё в порядке', en: 'Everything is fine' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Oraliq qiymat javob o'rniga yozilgan. Sotilganlarni ayirish qadami tushib qolgan.",
      ru: 'Верно. Промежуточное значение записали вместо ответа. Шаг с вычитанием проданного пропущен.',
      en: 'Correct. The intermediate value was written as the answer. The step subtracting the sold goods is missing.',
    },
    wrong: [
      null,
      {
        uz: "Birinchi qadam to'g'ri: qo'shish aniq bajarilgan. Muammo qadamlar sonida.",
        ru: 'Первый шаг верен: сложение выполнено точно. Дело в числе шагов.',
        en: 'The first step is right: the addition is exact. The trouble is in the number of steps.',
      },
      {
        uz: "Savol to'g'ri yozilgan. Aynan shu savolga javob berilmagan.",
        ru: 'Вопрос записан верно. Именно на него и не ответили.',
        en: 'The question is written correctly. It is exactly that question that was not answered.',
      },
      {
        uz: "Yozuv tugallanmagan: javob savolga mos kelmayapti.",
        ru: 'Запись не завершена: ответ не отвечает на вопрос.',
        en: 'The record is unfinished: the answer does not answer the question.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bitning hisob varaqasi ekranda. To'rt qator yozilgan.",
          "Savol ham, birinchi qadam ham bor. Lekin yozuv tugallanmagan.",
          "Nima yetishmaydi? Javobni tanlang.",
        ],
        ru: [
          'Расчётный лист Bit на экране. Записаны четыре строки.',
          'Есть и вопрос, и первый шаг. Но запись не завершена.',
          'Чего не хватает? Выбери ответ.',
        ],
        en: [
          'Bit calculation sheet is on the screen. Four lines are written.',
          'There is the question and the first step. But the record is unfinished.',
          'What is missing? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Qaysi yozuv kunni yopadi?',
      ru: 'Какая запись закроет день?',
      en: 'Which record closes the day?',
    },
    question: {
      uz: 'Ombor kunini qaysi yozuv yopadi?',
      ru: 'Какая запись закрывает день склада?',
      en: 'Which record closes the store day?',
    },
    options: [
      { uz: 'Ikki qadam va javob', ru: 'Два шага и ответ', en: 'Two steps and the answer' },
      { uz: 'Faqat birinchi qadam', ru: 'Только первый шаг', en: 'The first step only' },
      { uz: 'Faqat oxirgi ayirish', ru: 'Только последнее вычитание', en: 'The last subtraction only' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ikkala qadam ham yozilgan va javob savolga mos: hisob yopildi.",
      ru: 'Верно. Оба шага записаны, и ответ отвечает на вопрос: учёт закрыт.',
      en: 'Correct. Both steps are written and the answer matches the question: the ledger is closed.',
    },
    wrong: [
      null,
      {
        uz: "Bu oraliq qiymatda to'xtaydi. Savolga javob berilmaydi.",
        ru: 'Здесь всё останавливается на промежуточном значении. На вопрос не отвечено.',
        en: 'This stops at the intermediate value. The question is left unanswered.',
      },
      {
        uz: "Bunda birinchi qadam yo'q, shuning uchun ayirish qaysi sondan qilinganini bilib bo'lmaydi.",
        ru: 'Здесь нет первого шага, поэтому неясно, из какого числа вычитали.',
        en: 'Here the first step is missing, so it is unclear which number was reduced.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ombor uchta yozuvni ko'rib chiqmoqda. Kunni faqat bittasi yopadi.",
          "To'liq yozuvda savol, ikkala qadam va javob bo'lishi kerak.",
          "Qaysi yozuv kunni yopadi? Javobni tanlang.",
        ],
        ru: [
          'Склад рассматривает три записи. День закрывает только одна.',
          'В полной записи должны быть вопрос, оба шага и ответ.',
          'Какая запись закроет день? Выбери ответ.',
        ],
        en: [
          'The store is looking at three records. Only one closes the day.',
          'A complete record needs the question, both steps and the answer.',
          'Which record closes the day? Choose an answer.',
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
      uz: "Qoidani tanlang va murakkab masalani tushunganingizni ko'rsating.",
      ru: 'Выбери правило и покажи, что понимаешь составную задачу.',
      en: 'Choose the rule and show that you understand a multi-step problem.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Oraliq qiymat nima?',
      ru: 'Что такое промежуточное значение?',
      en: 'What is an intermediate value?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: 'Keyingi qadam uchun kerak bo\'lgan son', ru: 'Число, нужное для следующего шага', en: 'A number needed for the next step' },
      { uz: 'Masalaning javobi', ru: 'Ответ задачи', en: 'The answer to the problem' },
      { uz: 'Shartda berilgan son', ru: 'Число, данное в условии', en: 'A number given in the problem' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: 'Shunday. U yo\'lning o\'rtasida turadi va javob o\'rniga yozilmaydi.',
      ru: 'Именно так. Оно стоит посередине пути и вместо ответа не записывается.',
      en: 'Exactly. It stands in the middle of the path and is never written as the answer.',
    },
    reflectionWrong: {
      uz: "Hali emas. Ombor hisobini eslang: yigirma to'rt ming olti yuz o'n yetti javob emas edi.",
      ru: 'Пока нет. Вспомни складской учёт: двадцать четыре тысячи шестьсот семнадцать не были ответом.',
      en: 'Not yet. Remember the warehouse ledger: twenty four thousand six hundred and seventeen was not the answer.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Darsning to\'rt qoidasi', ru: 'Четыре правила урока', en: 'The four rules of the lesson' },
    main: [
      { uz: 'Avval savolni topamiz va nima yetishmasligini aniqlaymiz.', ru: 'Сначала находим вопрос и определяем, чего не хватает.', en: 'First find the question and see what is missing.' },
      { uz: 'Yetishmagan sonni alohida topamiz: bu oraliq qiymat.', ru: 'Недостающее число находим отдельно: это промежуточное значение.', en: 'Find the missing number on its own: that is the intermediate value.' },
      { uz: 'Oraliq qiymat javob emas, u keyingi qadam materiali.', ru: 'Промежуточное значение не ответ, это материал для следующего шага.', en: 'An intermediate value is not the answer, it is material for the next step.' },
      { uz: 'Bir masalani ikki yo\'l bilan yechish javobni tekshiradi.', ru: 'Решение двумя способами проверяет ответ.', en: 'Solving in two ways checks the answer.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Hisob muhandisi', ru: 'Инженер расчёта', en: 'Calculation engineer' },
        text: { uz: 'Barcha oltita vazifa birinchi urinishda yechildi.', ru: 'Все шесть заданий решены с первой попытки.', en: 'All six tasks were solved on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: 'Reja tuzuvchi', ru: 'Составитель плана', en: 'Plan maker' },
        text: { uz: "Siz oraliq qiymatni javobdan ishonchli ajratasiz.", ru: 'Ты уверенно отличаешь промежуточное значение от ответа.', en: 'You tell an intermediate value from the answer with confidence.' },
      },
      {
        min: 0,
        title: { uz: 'Ombor xodimi', ru: 'Сотрудник склада', en: 'Warehouse clerk' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Ombor kuni yopildi. Endi markaz yuklarni yo'lga chiqaradi: tezlik, vaqt va masofa hisobga tushadi.",
      ru: 'День склада закрыт. Теперь центр отправляет грузы в путь: в расчёт входят скорость, время и расстояние.',
      en: 'The store day is closed. Now the centre sends the loads on the road: speed, time and distance enter the calculation.',
    },
    audio: {
      intro: {
        uz: [
          "Ombor hisobi yopildi: ikki qadam ham yozildi.",
          "Endi bitta savol qoldi. Qoidani tanlang va unvonni oling.",
          "Oraliq qiymat nima? Javobni tanlang.",
        ],
        ru: [
          'Складской учёт закрыт: оба шага записаны.',
          'Остался один вопрос. Выбери правило и получи звание.',
          'Что такое промежуточное значение? Выбери ответ.',
        ],
        en: [
          'The warehouse ledger is closed: both steps are written.',
          'One question is left. Choose the rule and claim your title.',
          'What is an intermediate value? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Darsning tayanchi — QADAMLAR TAXTASI: har qadam alohida qatorda turadi,
// oraliq qiymat boshqa rangda, javob esa faqat oxirgi qatorda. Shunda
// "oraliq javob emas" g'oyasi ko'rinadi.
// ---------------------------------------------------------------------------

// s0, s14: ombor hisobi (to'q sahna).
const LedgerDesk = ({ closed }) => {
  const t = useT();
  const cells = [
    { label: t({ uz: 'ertalab bor edi', ru: 'было утром', en: 'in the morning' }), value: '14587', tone: 'rgba(121,211,218,.12)', stroke: 'rgba(144,228,235,.4)', text: '#9DE3E7' },
    { label: t({ uz: 'keltirildi', ru: 'привезли', en: 'delivered' }), value: '10030', tone: 'rgba(149,201,61,.14)', stroke: 'rgba(149,201,61,.45)', text: T.lime },
    { label: t({ uz: 'sotuvga chiqdi', ru: 'ушло в продажу', en: 'went to sale' }), value: '850', tone: 'rgba(255,91,53,.14)', stroke: '#FFB39B', text: '#FFB39B' },
  ];
  return (
    <FitSvg viewBox="0 0 900 300">
      <defs>
        <linearGradient id="d44panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123246" />
          <stop offset="100%" stopColor="#0A2233" />
        </linearGradient>
      </defs>
      <rect x="40" y="24" width="820" height="252" rx="20" fill="url(#d44panel)" stroke="rgba(144,228,235,.28)" strokeWidth="2" />
      <text x="72" y="60" fill="#9DE3E7" fontSize="14" fontWeight="800" letterSpacing="3" fontFamily="JetBrains Mono, monospace">
        {t({ uz: 'OMBOR HISOBI', ru: 'СКЛАДСКОЙ УЧЁТ', en: 'WAREHOUSE LEDGER' })}
      </text>
      {cells.map((cell, index) => (
        <g key={cell.value}>
          <rect x={72 + index * 260} y="78" width="240" height="82" rx="14" fill={cell.tone} stroke={cell.stroke} strokeWidth="1.6" />
          <text x={192 + index * 260} y="112" textAnchor="middle" fill={cell.text} fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
            {cell.label}
          </text>
          <text x={192 + index * 260} y="146" textAnchor="middle" fill="#EAF9FB" fontSize="30" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {cell.value}
          </text>
        </g>
      ))}
      <rect
        x="72"
        y="184"
        width="760"
        height="70"
        rx="14"
        fill="rgba(1,13,22,.5)"
        stroke={closed ? 'rgba(149,201,61,.5)' : 'rgba(255,179,155,.45)'}
        strokeWidth="1.6"
        strokeDasharray={closed ? undefined : '9 7'}
      />
      <text x="452" y="214" textAnchor="middle" fill={closed ? T.lime : '#FFB39B'} fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {closed
          ? t({ uz: 'kun hisobi yopildi', ru: 'учёт дня закрыт', en: 'the day ledger is closed' })
          : t({ uz: 'Bit yozgan javob', ru: 'ответ, записанный Bit', en: 'the answer Bit wrote' })}
      </text>
      <text x="452" y="244" textAnchor="middle" fill="#EAF9FB" fontSize="26" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {closed ? '23767' : '24617'}
      </text>
    </FitSvg>
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
          head: t({ uz: 'Savolni toping', ru: 'Найди вопрос', en: 'Find the question' }),
          body: t({ uz: "unga qaysi son yetishmayotganini aniqlang", ru: 'определите, какого числа для него не хватает', en: 'work out which number it is missing' }),
          formula: null,
        },
        {
          tone: T.accent,
          head: t({ uz: 'Oraliq qiymatni toping', ru: 'Найдите промежуточное', en: 'Find the intermediate' }),
          body: t({ uz: "u javob emas, u keyingi qadamning materiali", ru: 'это не ответ, это материал следующего шага', en: 'it is not the answer, it is material for the next step' }),
          formula: null,
        },
        {
          tone: T.success,
          head: t({ uz: 'Javobni yozing', ru: 'Запишите ответ', en: 'Write the answer' }),
          body: t({ uz: "javob savolga mos kelishini va mantiqiyligini tekshiring", ru: 'проверьте, что ответ отвечает на вопрос и разумен', en: 'check that the answer fits the question and is reasonable' }),
          formula: null,
        },
      ]}
    />
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
          <span>LUMO CITY · BOSHQARUV MARKAZI · OMBOR HISOBI</span>
          <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
            {solved ? 'YOPILDI' : 'HISOB'}
          </span>
        </div>
        <div className="hero-body">
          <LedgerDesk closed={solved} />
        </div>
        <div className="d44-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'nod' : 'think'} /></div>
      </div>
    )}
  />
);

const planRows = (t) => [
  {
    label: t({ uz: '1-QADAM', ru: '1 ШАГ', en: 'STEP 1' }),
    expr: '14587 + 10030 = 24617',
    kind: 'mid',
  },
  {
    label: t({ uz: 'JAVOB', ru: 'ОТВЕТ', en: 'ANSWER' }),
    expr: '24617 - 850',
    kind: 'final',
  },
];

const Screen1 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 15"
      figure={({ frame }) => (
        <StepRows
          frame={frame}
          rows={[
            { label: t({ uz: 'SAVOL', ru: 'ВОПРОС', en: 'QUESTION' }), expr: t({ uz: 'kun oxirida nechta?', ru: 'сколько к концу дня?', en: 'how many at the end?' }), kind: 'mid' },
            { label: t({ uz: '1-QADAM', ru: '1 ШАГ', en: 'STEP 1' }), expr: t({ uz: 'oraliq qiymat', ru: 'промежуточное', en: 'intermediate' }), kind: 'mid' },
            { label: t({ uz: '2-QADAM', ru: '2 ШАГ', en: 'STEP 2' }), expr: t({ uz: 'javob', ru: 'ответ', en: 'answer' }), kind: 'final' },
          ]}
        />
      )}
    />
  );
};
const Screen2 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={1}
      ratio="76 / 20"
      figure={({ solved, picked }) => (
        <RecordRow
          records={[
            t({ uz: 'keltirilgandan\nkeyin qancha?', ru: 'сколько после\nпривоза?', en: 'how many after\nthe delivery?' }),
            t({ uz: 'qancha\nsotildi?', ru: 'сколько\nпродали?', en: 'how many\nwere sold?' }),
            t({ uz: 'ertalab\nqancha edi?', ru: 'сколько было\nутром?', en: 'how many in\nthe morning?' }),
            t({ uz: 'kun oxirida\nqancha qoldi?', ru: 'сколько осталось\nк концу дня?', en: 'how many left at\nthe end of day?' }),
          ]}
          picked={picked}
          solved={solved}
          correctIndex={0}
          width={780}
          cardW={174}
          cardH={90}
          gap={16}
          top={26}
          size={13}
        />
      )}
    />
  );
};
const Screen3 = (props) => {
  const t = useT();
  return <RevealScreen {...props} ratio="66 / 15" figure={({ frame }) => <StepRows frame={frame} rows={planRows(t)} />} />;
};
const Screen4 = (props) => {
  const t = useT();
  return (
    <NumPadScreen
      {...props}
      ratio="66 / 15"
      figure={({ solved }) => <StepRows rows={planRows(t)} solvedValue={solved ? 23767 : null} />}
    />
  );
};
const Screen5 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 15"
      figure={({ frame }) => (
        <StepRows
          frame={frame}
          rows={[
            { label: t({ uz: '1-QADAM', ru: '1 ШАГ', en: 'STEP 1' }), expr: '10030 - 850 = 9180', kind: 'mid' },
            { label: t({ uz: 'JAVOB', ru: 'ОТВЕТ', en: 'ANSWER' }), expr: '14587 + 9180 = 23767', kind: 'final' },
          ]}
        />
      )}
    />
  );
};
const Screen6 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={2}
    ratio="78 / 21"
    figure={({ solved, picked }) => (
      <RecordRow
        records={['14587 + (10030 - 850)', '(14587 + 10030) - 850', '14587 - (10030 - 850)', '(14587 - 850) + 10030']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={780}
        cardW={176}
        cardH={84}
        gap={16}
        top={30}
        size={13}
      />
    )}
  />
);
const Screen7 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 20"
      figure={({ frame }) => (
        <StepRows
          frame={frame}
          rows={[
            { label: t({ uz: 'QALAM', ru: 'КАРАНДАШИ', en: 'PENCILS' }), expr: '8250', kind: 'mid' },
            { label: t({ uz: "QOG'OZ", ru: 'БУМАГА', en: 'PAPER' }), expr: '6000', kind: 'mid' },
            { label: t({ uz: "BO'YOQ", ru: 'КРАСКИ', en: 'PAINTS' }), expr: '8250 + 6000 = 14250', kind: 'final' },
          ]}
        />
      )}
    />
  );
};
const Screen8 = (props) => {
  const t = useT();
  return (
    <NumPadScreen
      {...props}
      ratio="66 / 20"
      figure={({ solved }) => (
        <StepRows
          rows={[
            { label: t({ uz: 'QALAM', ru: 'КАРАНДАШИ', en: 'PENCILS' }), expr: '8250', kind: 'mid' },
            { label: t({ uz: "QOG'OZ", ru: 'БУМАГА', en: 'PAPER' }), expr: '6000', kind: 'mid' },
            { label: t({ uz: "BO'YOQ", ru: 'КРАСКИ', en: 'PAINTS' }), expr: '14250', kind: 'mid' },
            { label: t({ uz: 'JAMI', ru: 'ВСЕГО', en: 'IN ALL' }), expr: '8250 + 6000 + 14250', kind: 'final' },
          ]}
          solvedValue={solved ? 28500 : null}
        />
      )}
    />
  );
};
const Screen9 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 20"
      figure={({ frame }) => (
        <StepRows
          frame={frame}
          rows={[
            { label: t({ uz: '1-SISTERNA', ru: '1 ЦИСТЕРНА', en: 'TANK 1' }), expr: '4574', kind: 'mid' },
            { label: t({ uz: '2-SISTERNA', ru: '2 ЦИСТЕРНА', en: 'TANK 2' }), expr: '4574 - 1696 = 2878', kind: 'mid' },
            { label: t({ uz: 'IKKOVI', ru: 'ОБЕ', en: 'BOTH' }), expr: '4574 + 2878 = 7452', kind: 'mid' },
            { label: t({ uz: '3-SISTERNA', ru: '3 ЦИСТЕРНА', en: 'TANK 3' }), expr: '10427 - 7452 = 2975', kind: 'final' },
          ]}
        />
      )}
    />
  );
};
const Screen10 = (props) => <TableFill {...props} />;
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={5}
      ratio="66 / 11"
      figure={({ solved }) => (
        <StepRows
          rows={[
            { label: t({ uz: 'KELDI', ru: 'ПРИШЛО', en: 'CAME IN' }), expr: '6000', kind: 'mid' },
            { label: t({ uz: 'KETDI', ru: 'УШЛО', en: 'WENT OUT' }), expr: solved ? '6000 - 6000 = 0' : '6000', kind: 'final' },
          ]}
          solvedValue={null}
        />
      )}
    />
  );
};
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
          badIndex={2}
          revealBad={solved}
          badLabel={t({ uz: 'oraliq qiymat', ru: 'промежуточное', en: 'intermediate' })}
          showHint={picked !== null && !solved}
          hint={t({
            uz: 'Savolni javob bilan solishtiring: ular mos kelyaptimi?',
            ru: 'Сравни вопрос с ответом: подходят ли они друг другу?',
            en: 'Compare the question with the answer: do they match?',
          })}
        />
      )}
    />
  );
};
const Screen14 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={7}
      ratio="72 / 23"
      figure={({ solved, picked }) => (
        <RecordRow
          records={[
            `14587 + 10030 = 24617\n24617 - 850 = 23767`,
            `14587 + 10030 = 24617\n${t({ uz: 'javob: 24617', ru: 'ответ: 24617', en: 'answer: 24617' })}`,
            `24617 - 850 = 23767\n${t({ uz: '1-qadam yo\'q', ru: 'нет 1 шага', en: 'no step 1' })}`,
          ]}
          picked={picked}
          solved={solved}
          correctIndex={0}
          width={720}
          cardW={216}
          cardH={108}
          gap={24}
          size={14}
        />
      )}
    />
  );
};
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

const LESSON_STYLES = `
.d44-hero-bit {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 60px;
  height: 75px;
  transform: translateY(-50%);
  pointer-events: none;
}
.d44-hero-bit svg { width: 100%; height: 100%; }
`;

export default function Grade4Dars44(props) {
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
