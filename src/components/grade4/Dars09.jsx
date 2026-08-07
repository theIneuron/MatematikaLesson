import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// 4-SINF · 9-DARS · Ko'p xonali sonni bir xonali songa ko'paytirish
// Dars01 vizual/audio kontrakti asosida. 15 ekran, ichki majburiy o'tishlar yo'q.

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

const TOTAL_SCREENS = 15;
const MOBILE_DESIGN_W = 390;

const LESSON_META = {
  lessonId: 'num-4-09-v1',
  slug: 'dars09-kop-xonali-sonni-bir-xonali-songa-kopaytirish',
  lessonTitle: {
    uz: "9-dars. Ko'p xonali sonni bir xonali songa ko'paytirish",
    ru: 'Урок 9. Умножение многозначного числа на однозначное',
  },
  skillTags: ['equal_groups', 'place_value', 'column_multiplication', 'carry', 'internal_zero', 'estimation'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'OptionalPrediction', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'OptionalPrediction', scored: false, scope: null },
  { id: 's4', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's5', type: 'exploration', template: 'OptionalPrediction', scored: false, scope: null },
  { id: 's6', type: 'exploration', template: 'OptionalPrediction', scored: false, scope: null },
  { id: 's7', type: 'exploration', template: 'OptionalPrediction', scored: false, scope: null },
  { id: 's8', type: 'practice', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'practice', template: 'Construction', scored: true, scope: 'module-mikro' },
  { id: 's10', type: 'practice', template: 'DigitGrid', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'practice', template: 'ErrorRepair', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'practice', template: 'Matching', scored: true, scope: 'module-mikro' },
  { id: 's13', type: 'case', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'summary', template: 'SummaryScreen', scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Teng guruhlar', ru: 'Равные группы' },
    title: { uz: 'Natija kattaligi mosmi?', ru: 'Подходит ли величина ответа?' },
    question: {
      uz: "Har qutida 2 408 ta detal. 3 ta qutida 6 024 ta detal bo'ladimi?",
      ru: 'В каждой коробке 2 408 деталей. В трёх коробках будет 6 024 детали?',
    },
    options: [
      { uz: 'Ha, natija mos.', ru: 'Да, ответ подходит.' },
      { uz: "Yo'q, natija juda kichik.", ru: 'Нет, ответ слишком мал.' },
    ],
    wrong: [
      { uz: "Bitta qutida 2 408 ta detal bor; uchta quti uchun 6 024 juda kichik.", ru: 'В одной коробке 2 408 деталей; для трёх коробок 6 024 слишком мало.' },
      { uz: "Taxmin to'g'ri yo'nalishda: uchta guruh 7 200 atrofida bo'ladi.", ru: 'Оценка верна: три группы дают около 7 200.' },
    ],
    audio: {
      uz: [
        'Zaynab uchta bir xil qutini sanadi.',
        "Har bir qutida ikki ming to'rt yuz sakkizta detal bor.",
        "U jami olti ming yigirma to'rtta detal chiqdi dedi.",
        'Sizningcha, bu natija uchta guruhga mos keladimi?',
      ],
      ru: [
        'Зайнаб посчитала три одинаковые коробки.',
        'В каждой коробке две тысячи четыреста восемь деталей.',
        'Она получила шесть тысяч двадцать четыре детали.',
        'Как ты думаешь, подходит ли такой ответ для трёх групп?',
      ],
    },
  },
  s1: {
    eyebrow: { uz: 'Xona qiymatini eslaymiz', ru: 'Вспоминаем разряды' },
    title: { uz: "Sonni xona qo'shiluvchilariga ajrating", ru: 'Разложи число на разрядные слагаемые' },
    question: { uz: "2 408 sonining yoyiq yozuvini tanlang.", ru: 'Выбери разложение числа 2 408.' },
    options: [
      { uz: '2 000 + 400 + 0 + 8', ru: '2 000 + 400 + 0 + 8' },
      { uz: '2 000 + 40 + 8', ru: '2 000 + 40 + 8' },
      { uz: '200 + 400 + 8', ru: '200 + 400 + 8' },
    ],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri yoyiq yozuv.", ru: 'Верное разложение.' },
      { uz: '4 yuzlar xonasida turib, 400 ni bildiradi.', ru: 'Цифра 4 стоит в сотнях и означает 400.' },
      { uz: 'Chapdagi 2 minglar xonasida turib, 2 000 ni bildiradi.', ru: 'Цифра 2 слева стоит в тысячах и означает 2 000.' },
    ],
    audio: {
      uz: [
        "Ko'paytirishdan oldin sonning xona qiymatlarini ko'ramiz.",
        "Ikki ming to'rt yuz sakkizda ikki minglik, to'rt yuzlik, nol o'nlik va sakkiz birlik bor.",
      ],
      ru: [
        'Перед умножением рассмотрим разрядные значения числа.',
        'В числе две тысячи четыреста восемь есть две тысячи, четыре сотни, ноль десятков и восемь единиц.',
      ],
    },
  },
  s2: {
    eyebrow: { uz: 'Yoyiq model', ru: 'Развёрнутая модель' },
    title: { uz: 'Har bir xona miqdorini uch marta olamiz', ru: 'Берём значение каждого разряда три раза' },
    lead: { uz: '2 408 × 3', ru: '2 408 × 3' },
    audio: {
      uz: [
        "Ikki mingni uch marta olsak, olti ming bo'ladi.",
        "To'rt yuzni uch marta olsak, bir ming ikki yuz bo'ladi.",
        "Nol o'nlik nol bo'lib qoladi.",
        "Sakkiz birlikni uch marta olsak, yigirma to'rt bo'ladi.",
        "Barcha qismlarning yig'indisi yetti ming ikki yuz yigirma to'rt.",
      ],
      ru: [
        'Две тысячи, взятые три раза, дают шесть тысяч.',
        'Четыре сотни, взятые три раза, дают одну тысячу двести.',
        'Ноль десятков остаётся нулём.',
        'Восемь единиц, взятые три раза, дают двадцать четыре.',
        'Сумма всех частей равна семи тысячам двумстам двадцати четырём.',
      ],
    },
  },
  s3: {
    eyebrow: { uz: 'Ustun yozuvi', ru: 'Запись столбиком' },
    title: { uz: "Ko'paytiruvchini qayerga yozamiz?", ru: 'Куда записать множитель?' },
    question: { uz: '3 ni ustunda qayerga yozamiz?', ru: 'Где записать 3 в столбике?' },
    options: [
      { uz: 'Minglar ostiga', ru: 'Под тысячами' },
      { uz: 'Yuzlar ostiga', ru: 'Под сотнями' },
      { uz: 'Birlar ostiga', ru: 'Под единицами' },
    ],
    closedSet: true,
    wrong: [
      { uz: "Ko'paytiruvchini birlar ostiga yozing.", ru: 'Запиши множитель под единицами.' },
      { uz: "Ko'paytiruvchi butun sonni necha marta olishni bildiradi.", ru: 'Множитель показывает, сколько раз берут всё число.' },
      { uz: "To'g'ri joylashuv.", ru: 'Верное расположение.' },
    ],
    audio: {
      uz: [
        "Bir xonali ko'paytiruvchi birliklar ustuniga yoziladi.",
        "Hisob o'ngdagi birlar xonasidan boshlanadi.",
        "Shunda har bir natija o'z xona ustunida qoladi.",
      ],
      ru: [
        'Однозначный множитель записывают под единицами.',
        'Вычисление начинается с правого разряда единиц.',
        'Тогда каждая цифра результата остаётся в своём столбце.',
      ],
    },
  },
  s4: {
    eyebrow: { uz: "Ko'chirish", ru: 'Перенос' },
    title: { uz: "Ustunda ko'paytirishni kuzating", ru: 'Проследи умножение столбиком' },
    lead: { uz: '3 746 × 4 = 14 984', ru: '3 746 × 4 = 14 984' },
    audio: {
      uz: [
        "Olti to'rt marta olinsa, yigirma to'rt bo'ladi.",
        "To'rt birlikni yozib, ikki o'nlikni ko'chiramiz.",
        "To'rt to'rt marta o'n olti, ko'chgan ikki bilan o'n sakkiz.",
        "Sakkiz o'nlikni yozib, bir yuzlikni ko'chiramiz.",
        "Yetti to'rt marta yigirma sakkiz, ko'chgan bir bilan yigirma to'qqiz.",
        "To'qqiz yuzlikni yozib, ikki minglikni ko'chiramiz.",
        "Uch to'rt marta o'n ikki, ko'chgan ikki bilan o'n to'rt.",
        "Natija o'n to'rt ming to'qqiz yuz sakson to'rt.",
      ],
      ru: [
        'Шесть, взятое четыре раза, даёт двадцать четыре.',
        'Записываем четыре единицы и переносим два десятка.',
        'Четыре, взятое четыре раза, даёт шестнадцать, а с переносом восемнадцать.',
        'Записываем восемь десятков и переносим одну сотню.',
        'Семь, взятое четыре раза, даёт двадцать восемь, а с переносом двадцать девять.',
        'Записываем девять сотен и переносим две тысячи.',
        'Три, взятое четыре раза, даёт двенадцать, а с переносом четырнадцать.',
        'Получается четырнадцать тысяч девятьсот восемьдесят четыре.',
      ],
    },
  },
  s5: {
    eyebrow: { uz: "Ko'chirishning ma'nosi", ru: 'Смысл переноса' },
    title: { uz: "24 birlikni qanday almashtiramiz?", ru: 'Как разменять 24 единицы?' },
    question: { uz: '124 × 6 da 24 birlik nimaga teng?', ru: 'Чему равны 24 единицы в примере 124 × 6?' },
    options: [
      { uz: "2 o'nlik va 4 birlik", ru: '2 десятка и 4 единицы' },
      { uz: "24 o'nlik", ru: '24 десятка' },
      { uz: "4 o'nlik va 2 birlik", ru: '4 десятка и 2 единицы' },
    ],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri. 24 birlik 2 o'nlik va 4 birlik.", ru: 'Верно. Двадцать четыре единицы равны двум десяткам и четырём единицам.' },
      { uz: "20 birlikni 2 o'nlikka almashtiring.", ru: 'Замени двадцать единиц двумя десятками.' },
      { uz: "24 sonidagi raqamlarning o'rnini almashtirmang.", ru: 'Не меняй цифры в числе двадцать четыре местами.' },
    ],
    audio: {
      uz: [
        "Ko'chirilgan raqam o'zidan paydo bo'lmaydi.",
        "Olti guruhdagi to'rt birlik yigirma to'rt birlik bo'ladi.",
        "Yigirma birlik ikki o'nlikka aylanadi, to'rt birlik esa o'z xonasida qoladi.",
        "Olti guruhdagi ikki o'nlik o'n ikki o'nlik bo'ladi.",
        "Ko'chgan ikki o'nlik bilan jami o'n to'rt o'nlik hosil bo'ladi.",
        "To'rt o'nlikni yozib, bir yuzlikni ko'chiramiz.",
        "Olti yuzlikka ko'chgan bir yuzlik qo'shilsa, yetti yuzlik bo'ladi.",
      ],
      ru: [
        'Переносимая цифра не появляется сама по себе.',
        'Четыре единицы в шести группах дают двадцать четыре единицы.',
        'Двадцать единиц превращаются в два десятка, а четыре единицы остаются на месте.',
        'Два десятка в шести группах дают двенадцать десятков.',
        'С двумя перенесёнными десятками получается четырнадцать десятков.',
        'Записываем четыре десятка и переносим одну сотню.',
        'Шесть сотен и одна перенесённая сотня дают семь сотен.',
      ],
    },
  },
  s6: {
    eyebrow: { uz: 'Ichki nol', ru: 'Внутренний ноль' },
    title: { uz: "Nol turgan xona yo'qolmaydi", ru: 'Разряд с нулём не исчезает' },
    question: { uz: '4 052 × 6 da 0 × 6 + 3 nechaga teng?', ru: 'Чему равно 0 × 6 + 3 в примере 4 052 × 6?' },
    options: [{ uz: '0', ru: '0' }, { uz: '3', ru: '3' }, { uz: '6', ru: '6' }],
    closedSet: true,
    wrong: [
      { uz: "Ko'chgan 3 ni ham qo'shing.", ru: 'Прибавь перенос три.' },
      { uz: "To'g'ri. Nol xonasi ko'chgan 3 ni saqlaydi.", ru: 'Верно. Разряд с нулём сохраняет перенос три.' },
      { uz: "Nolni olti marta olish oltini bermaydi.", ru: 'Ноль, взятый шесть раз, не даёт шесть.' },
    ],
    audio: {
      uz: [
        "Nol turgan xona yo'qolmaydi.",
        "Nolni olti marta olsak, nol bo'ladi.",
        "Lekin oldingi xonadan ko'chgan uch yuzlik shu xonaga qo'shiladi.",
        "Shuning uchun bu ustunda uch yoziladi.",
      ],
      ru: [
        'Разряд с нулём не исчезает.',
        'Ноль, взятый шесть раз, остаётся нулём.',
        'Но три сотни из предыдущего переноса прибавляются в этом разряде.',
        'Поэтому в этом столбце записывается три.',
      ],
    },
  },
  s7: {
    eyebrow: { uz: 'Qulay strategiya', ru: 'Удобная стратегия' },
    title: { uz: "Qaysi usul qisqaroq?", ru: 'Какой способ короче?' },
    question: { uz: '4 999 × 7 uchun qulay usulni taxmin qiling.', ru: 'Предположи удобный способ для 4 999 × 7.' },
    options: [
      { uz: 'Ustunda hisoblash', ru: 'Вычислить столбиком' },
      { uz: '(5 000 − 1) × 7', ru: '(5 000 − 1) × 7' },
      { uz: '4 999 + 7', ru: '4 999 + 7' },
    ],
    closedSet: true,
    wrong: [
      { uz: "Ustun ishlaydi, lekin yaqin 5 000 dan foydalanish qisqaroq.", ru: 'Столбик работает, но использовать близкое число 5 000 короче.' },
      { uz: "To'g'ri. 4 999 soni 5 000 dan bir kam.", ru: 'Верно. Число 4 999 на один меньше 5 000.' },
      { uz: "Ko'paytirishda 4 999 soni yetti marta olinadi.", ru: 'При умножении число 4 999 берут семь раз.' },
    ],
    audio: {
      uz: [
        "Ba'zan ustun eng qisqa yo'l bo'lmaydi.",
        "To'rt ming to'qqiz yuz to'qson to'qqiz besh mingdan bir kam.",
        "Besh mingni yetti marta olib, ortiqcha olingan yettini ayiramiz.",
      ],
      ru: [
        'Иногда столбик не самый короткий путь.',
        'Четыре тысячи девятьсот девяносто девять на один меньше пяти тысяч.',
        'Берём пять тысяч семь раз и вычитаем лишние семь.',
      ],
    },
  },
  s8: {
    eyebrow: { uz: 'Mustahkamlash', ru: 'Закрепление' },
    title: { uz: 'Teng ifodani toping', ru: 'Найди равное выражение' },
    question: { uz: '4 999 × 7 ifodasiga qaysi yozuv aynan teng?', ru: 'Какая запись точно равна выражению 4 999 × 7?' },
    options: [
      { uz: '(5 000 × 7) − 7', ru: '(5 000 × 7) − 7' },
      { uz: '(5 000 × 7) + 7', ru: '(5 000 × 7) + 7' },
      { uz: '4 999 + 7', ru: '4 999 + 7' },
    ],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri teng ifoda.", ru: 'Верное равное выражение.' },
      { uz: "Yettita ortiqcha birlik qo'shilmaydi, ayiriladi.", ru: 'Семь лишних единиц не прибавляют, а вычитают.' },
      { uz: "Ko'paytirish sonni yetti marta olishni bildiradi.", ru: 'Умножение означает взять число семь раз.' },
    ],
    audio: {
      uz: [
        "To'rt ming to'qqiz yuz to'qson to'qqiz besh mingdan bir kam.",
        "U yetti marta olinganda qaysi teng ifoda hosil bo'lishini tanlang.",
      ],
      ru: [
        'Четыре тысячи девятьсот девяносто девять на один меньше пяти тысяч.',
        'Выбери выражение, которое точно описывает семь таких групп.',
      ],
    },
  },
  s9: {
    eyebrow: { uz: 'Xona modeli', ru: 'Разрядная модель' },
    title: { uz: 'Oraliq natijalarni joylashtiring', ru: 'Расположи промежуточные результаты' },
    question: { uz: "Har bir kartani mos ko'paytma ostiga qo'ying.", ru: 'Поставь каждую карточку под подходящее произведение.' },
    audio: {
      uz: ["Ikki ming uch yuz olti sonining har bir xona miqdorini to'rt marta oling."],
      ru: ['Возьми каждое разрядное значение числа две тысячи триста шесть четыре раза.'],
    },
  },
  s10: {
    eyebrow: { uz: 'Ustun kataklari', ru: 'Ячейки столбика' },
    title: { uz: "Natija kataklarini to'ldiring", ru: 'Заполни ячейки ответа' },
    question: { uz: '5 847 × 3', ru: '5 847 × 3' },
    audio: {
      uz: ["Besh ming sakkiz yuz qirq yettini uch marta olib, natijani xonalar bo'yicha yozing."],
      ru: ['Возьми число пять тысяч восемьсот сорок семь три раза и запиши ответ по разрядам.'],
    },
  },
  s11: {
    eyebrow: { uz: 'Xatoni tuzatish', ru: 'Исправление ошибки' },
    title: { uz: "Yo'qolgan nol xonasini tiklang", ru: 'Восстанови разряд с нулём' },
    question: { uz: "Jasurning yechimi: 3 017 × 5 = 15 □ 85", ru: 'Решение Жасура: 3 017 × 5 = 15 □ 85' },
    audio: {
      uz: [
        "Jasur ichki nol xonasini tashlab yubordi va son qisqarib qoldi.",
        "Bo'sh yuzlar xonasiga mos raqamni qo'ying.",
      ],
      ru: [
        'Жасур пропустил внутренний нулевой разряд, и число стало короче.',
        'Поставь подходящую цифру в пустой разряд сотен.',
      ],
    },
  },
  s12: {
    eyebrow: { uz: 'Taxmin bilan tekshirish', ru: 'Проверка оценкой' },
    title: { uz: 'Aniq natijani taxmin bilan juftlang', ru: 'Соедини точный ответ с оценкой' },
    question: { uz: "Har aniq natijani eng yaqin taxmin bilan juftlang.", ru: 'Соедини каждый точный ответ с ближайшей оценкой.' },
    audio: {
      uz: ["Taxmin oxirgi raqamlarni emas, natijaning umumiy kattaligini tekshiradi."],
      ru: ['Оценка проверяет не последние цифры, а общую величину ответа.'],
    },
  },
  s13: {
    eyebrow: { uz: 'Ombor vazifasi', ru: 'Задача про склад' },
    title: { uz: 'Oltita bir xil quti', ru: 'Шесть одинаковых коробок' },
    question: { uz: '6 ta quti. Har birida 2 375 ta detal. Jami nechta detal?', ru: '6 коробок. В каждой 2 375 деталей. Сколько всего деталей?' },
    audio: {
      uz: [
        "Bekzod ombordagi oltita bir xil qutini sanayapti.",
        "Har qutidagi ikki ming uch yuz yetmish beshta detal olti marta olinadi.",
        "Javob taxminan o'n to'rt ming to'rt yuz atrofida bo'lishi kerak.",
      ],
      ru: [
        'Бекзод считает шесть одинаковых коробок на складе.',
        'Количество две тысячи триста семьдесят пять берётся шесть раз.',
        'Ответ должен быть около четырнадцати тысяч четырёхсот.',
      ],
    },
  },
  s14: {
    eyebrow: { uz: 'Yakun', ru: 'Итог' },
    title: { uz: "Bir xonali songa ko'paytirish", ru: 'Умножение на однозначное число' },
    audio: {
      uz: [
        "Ko'p xonali sonni bir xonali songa ko'paytirishda har bir xona miqdori ko'paytiriladi.",
        "O'nta kichik xona birligi bitta katta xona birligiga almashtiriladi.",
        "Ichki nol o'z xonasini va unga kelgan ko'chirilgan qiymatni saqlaydi.",
        "Taxmin natijaning kattaligini tekshiradi.",
      ],
      ru: [
        'При умножении многозначного числа на однозначное умножается значение каждого разряда.',
        'Десять меньших разрядных единиц заменяются одной большей.',
        'Внутренний ноль сохраняет свой разряд и пришедший перенос.',
        'Оценка проверяет величину результата.',
      ],
    },
  },
};

let runtimeConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  voiceGender: 'f',
  previewMode: false,
};

const configureLesson = (next) => {
  runtimeConfig = { ...runtimeConfig, ...next };
};

const LangContext = createContext('uz');
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
    this.timer = null;
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
    this.emit({ completed: false, currentSegment: null, visualOnly: false });
  }

  start() {
    if (!this.queue.length) {
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.playCurrent();
  }

  simulate(segment, duration = null) {
    this.isPlaying = false;
    this.emit({ completed: false, currentSegment: segment.id, visualOnly: true });
    const wait = duration
      ?? Math.max(1150, Math.min(2350, String(segment.text).length * 31));
    this.timer = window.setTimeout(() => {
      this.timer = null;
      this.index += 1;
      this.playCurrent();
    }, wait);
  }

  playPreviewSpeech(segment) {
    const speech = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const Utterance = typeof window !== 'undefined'
      ? (window.SpeechSynthesisUtterance || globalThis.SpeechSynthesisUtterance)
      : null;
    if (!speech || !Utterance) {
      this.simulate(segment);
      return;
    }

    try {
      speech.cancel();
      const utterance = new Utterance(String(segment.text));
      utterance.lang = this.lang === 'uz' ? 'uz-UZ' : 'ru-RU';
      utterance.rate = 0.94;
      utterance.onstart = () => {
        this.isPlaying = true;
        this.emit({ completed: false, currentSegment: segment.id, visualOnly: false });
      };
      utterance.onend = () => {
        this.isPlaying = false;
        this.index += 1;
        this.playCurrent();
      };
      utterance.onerror = () => {
        this.isPlaying = false;
        this.simulate(segment);
      };
      this.previewUtterance = utterance;
      this.timer = window.setTimeout(() => {
        this.timer = null;
        try {
          speech.speak(utterance);
        } catch {
          this.simulate(segment);
        }
      }, 50);
    } catch {
      this.simulate(segment);
    }
  }

  playCurrent() {
    const segment = this.queue[this.index];
    if (!segment) {
      this.isPlaying = false;
      this.emit({ completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase });
      return;
    }

    if (this.muted) {
      this.simulate(segment);
      return;
    }

    if (!runtimeConfig.ttsApiBase) {
      if (runtimeConfig.previewMode) {
        this.playPreviewSpeech(segment);
      } else {
        this.simulate(segment);
      }
      return;
    }

    const audio = this.ensureAudio();
    if (!audio) {
      this.index += 1;
      this.playCurrent();
      return;
    }
    audio.onended = () => {
      this.isPlaying = false;
      this.index += 1;
      this.playCurrent();
    };
    audio.onerror = audio.onended;
    audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, segment.text, runtimeConfig.voiceGender);
    const promise = audio.play();
    if (promise?.then) {
      promise.then(() => {
        this.isPlaying = true;
        this.emit({ completed: false, currentSegment: segment.id, visualOnly: false });
      }).catch(() => {
        this.simulate(segment, 1250);
      });
    }
  }

  pushOneOff(text) {
    if (!text) return;
    this.loadQueue([{ id: `feedback-${Date.now()}`, text }]);
    this.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    this.stop(false);
    this.index = 0;
    this.emit({ muted: this.muted, completed: false });
    this.start();
  }

  stop(emit = true) {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.onended = null;
        this.audio.onerror = null;
      } catch {
        // Audio is optional in preview.
      }
    }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
    }
    if (runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Browser speech is optional in local preview.
      }
    }
    this.previewUtterance = null;
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
  const [state, setState] = useState({
    isPlaying: false,
    muted: audioEngineInstance?.muted ?? false,
    completed: false,
    currentSegment: null,
    visualOnly: !runtimeConfig.ttsApiBase,
  });

  /* eslint-disable react-hooks/refs -- stable segment identity prevents audio restart loops */
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    prevKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.onStateChange = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.loadQueue(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 240);
    return () => {
      window.clearTimeout(timer);
      engine.stop(false);
      engine.onStateChange = null;
    };
  }, [stableSegments, lang]);

  return {
    ...state,
    replay: () => {
      const engine = getAudioEngine();
      if (!engine) return;
      engine.loadQueue(stableSegments);
      engine.start();
    },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

function useNarration(audioValue, screen) {
  const lang = useLang();
  const segments = useMemo(() => {
    const texts = audioValue?.[lang] ?? audioValue?.ru ?? [];
    return (Array.isArray(texts) ? texts : [texts])
      .filter(Boolean)
      .map((text, index) => ({ id: `s${screen}-beat-${index}`, text }));
  }, [audioValue, lang, screen]);
  const audio = useAudio(segments);
  const activeIndex = segments.findIndex((segment) => segment.id === audio.currentSegment);
  const beat = activeIndex >= 0 ? activeIndex : (audio.completed ? Math.max(0, segments.length - 1) : 0);
  const caption = activeIndex >= 0 ? segments[activeIndex]?.text : '';
  return { ...audio, beat, caption, segmentCount: segments.length };
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try {
    const sound = new Audio(url);
    sound.play().catch(() => {});
  } catch {
    // Sound effects are optional.
  }
};

// Dars01 dagi canonical Bit SVG. Geometriya va holatlar o'zgartirilmagan.
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

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  return (
    <div className="audio-controls">
      <button
        type="button"
        className="icon-btn"
        onClick={audio.toggleMute}
        aria-label={audio.muted
          ? (lang === 'uz' ? 'Ovozni yoqish' : 'Включить звук')
          : (lang === 'uz' ? "Ovozni o'chirish" : 'Выключить звук')}
      >
        {audio.muted ? '🔇' : '🔊'}
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={audio.replay}
        aria-label={lang === 'uz' ? 'Qayta eshitish' : 'Повторить'}
      >
        ↻
      </button>
    </div>
  );
};

const NavBack = ({ onClick, hidden = false }) => {
  const lang = useLang();
  if (hidden) return <span />;
  return (
    <button type="button" className="btn btn-ghost" onClick={onClick}>
      ← {lang === 'uz' ? 'Orqaga' : 'Назад'}
    </button>
  );
};

const NavNext = ({ onClick, finish = false }) => {
  const lang = useLang();
  return (
    <button type="button" className="btn btn-white-accent" onClick={onClick}>
      {finish
        ? (lang === 'uz' ? 'Darsni yakunlash' : 'Завершить урок')
        : (lang === 'uz' ? 'Davom etish' : 'Продолжить')} →
    </button>
  );
};

const FeedbackBlock = ({ visible, correct, children }) => {
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!visible) {
      const resetFrame = requestAnimationFrame(() => setMounted(false));
      return () => cancelAnimationFrame(resetFrame);
    }
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setMounted(true));
    });
    const scrollTimer = window.setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 180);
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      window.clearTimeout(scrollTimer);
    };
  }, [visible]);
  if (!visible) return null;
  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={`feedback-block ${correct ? 'feedback-correct' : 'feedback-wrong'} ${mounted ? 'feedback-visible' : ''}`}
    >
      <span aria-hidden="true">{correct ? '✓' : '↻'}</span>
      <p>{children}</p>
    </div>
  );
};

const PageTitle = ({ c, lead, bitState = null }) => {
  const t = useT();
  return (
    <div className={`page-title ${bitState ? 'page-title-bit' : ''}`}>
      <div>
        <span>{t(c.eyebrow)}</span>
        <h1>{t(c.title)}</h1>
        {lead && <p>{typeof lead === 'string' ? lead : t(lead)}</p>}
      </div>
      {bitState && <BitSVG state={bitState} />}
    </div>
  );
};

const MiniCoach = ({ state, cue }) => (
  <div className="math-mini-coach" aria-hidden="true">
    <BitSVG state={state} />
    <span>{cue}</span>
  </div>
);

const SensorFactorySVG = ({ beat }) => (
  <svg
    className={`sensor-factory-svg beat-${Math.max(0, Math.min(4, beat))}`}
    viewBox="0 0 600 112"
    aria-hidden="true"
    focusable="false"
  >
    <path className="factory-belt" d="M35 92 H560" />
    {[0, 1, 2].map((group) => {
      const x = 50 + group * 145;
      return (
        <g className={`sensor-bay ${beat >= group ? 'bay-online' : ''}`} key={group}>
          <rect x={x} y="18" width="112" height="62" rx="14" />
          {[0, 1, 2, 3].map((part) => (
            <circle cx={x + 24 + part * 21} cy="42" r="6" key={part} />
          ))}
          <text x={x + 56} y="67">2 408</text>
        </g>
      );
    })}
    <path className="factory-output-arrow" d="M472 49 H500 M491 40 L502 49 L491 58" />
    <g className={`factory-counter ${beat >= 4 ? 'counter-ready' : ''}`}>
      <rect x="510" y="23" width="72" height="54" rx="14" />
      <text x="546" y="56">7 224</text>
    </g>
    {[73, 218, 363, 522].map((x) => <circle className="belt-wheel" cx={x} cy="94" r="5" key={x} />)}
  </svg>
);

const PlaceConveyorSVG = ({ beat }) => (
  <svg
    className={`place-conveyor-svg ${beat >= 1 ? 'multiplier-docked' : ''}`}
    viewBox="0 0 600 104"
    aria-hidden="true"
    focusable="false"
  >
    <path className="place-conveyor-track" d="M54 83 H548" />
    {["2", "4", "0", "8"].map((digit, index) => {
      const x = 166 + index * 92;
      return (
        <g className={index === 3 ? 'place-crate unit-crate' : 'place-crate'} key={`${digit}-${index}`}>
          <rect x={x} y="27" width="66" height="48" rx="12" />
          <text x={x + 33} y="58">{digit}</text>
          <text className="place-power" x={x + 33} y="20">{`10${['³', '²', '¹', '⁰'][index]}`}</text>
        </g>
      );
    })}
    <g className="conveyor-multiplier">
      <rect x="54" y="35" width="70" height="38" rx="19" />
      <text x="89" y="60">×3</text>
    </g>
    {[92, 202, 294, 386, 478].map((x) => <circle className="conveyor-wheel" cx={x} cy="85" r="5" key={x} />)}
  </svg>
);

const CarryCapsuleSVG = ({ beat, activePlace }) => {
  const transfers = [
    { value: '2', from: 344, to: 278, reveal: beat >= 2 },
    { value: '1', from: 278, to: 212, reveal: beat >= 4 },
    { value: '2', from: 212, to: 146, reveal: beat >= 6 },
  ];
  return (
    <svg
      className={`carry-capsule-svg active-place-${activePlace}`}
      viewBox="0 0 420 92"
      aria-hidden="true"
      focusable="false"
    >
      {transfers.map((transfer, index) => (
        <g className={`carry-transfer ${transfer.reveal ? 'transfer-visible' : ''}`} key={`${transfer.value}-${index}`}>
          <path d={`M${transfer.from} 73 C${transfer.from} 18 ${transfer.to} 18 ${transfer.to} 59`} />
          <g className="carry-capsule" transform={`translate(${transfer.to - 15} 12)`}>
            <rect width="30" height="22" rx="11" />
            <text x="15" y="16">{transfer.value}</text>
          </g>
        </g>
      ))}
      {[146, 212, 278, 344].map((x, index) => (
        <circle className={`carry-station station-${index}`} cx={x} cy="72" r="7" key={x} />
      ))}
    </svg>
  );
};

const ZeroCheckpointSVG = ({ beat }) => (
  <svg
    className={`zero-checkpoint-svg ${beat >= 2 ? 'accepts-carry' : ''} ${beat >= 3 ? 'checkpoint-done' : ''}`}
    viewBox="0 0 600 108"
    aria-hidden="true"
    focusable="false"
  >
    <path className="checkpoint-track" d="M48 63 H552" />
    <g className="zero-sensor">
      <rect x="232" y="18" width="136" height="72" rx="18" />
      <text className="zero-sensor-formula" x="300" y="48">0 × 6</text>
      <text className="zero-sensor-result" x="300" y="74">0</text>
    </g>
    <g className="checkpoint-carry">
      <rect x="64" y="28" width="54" height="38" rx="19" />
      <text x="91" y="54">+3</text>
    </g>
    <path className="checkpoint-arrow" d="M385 54 H445 M435 44 L447 54 L435 64" />
    <g className="checkpoint-output">
      <circle cx="503" cy="54" r="27" />
      <text x="503" y="62">3</text>
    </g>
    {[74, 174, 426, 526].map((x) => <circle className="checkpoint-wheel" cx={x} cy="65" r="5" key={x} />)}
  </svg>
);

const Stage = ({ screen, audio, onPrev, onNext, finish = false, children }) => {
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const isMobile = useIsMobile();
  const contentRef = useRef(null);
  const pad = isMobile ? 14 : 48;

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [screen]);

  return (
    <main className={`stage stage-${SCREEN_META[screen].type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}>
          <div className="progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title"><i /> <span>{t(c.eyebrow)}</span></div>
          <div className="chrome-actions">
            {audio && <AudioIndicator audio={audio} />}
            <b>{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</b>
          </div>
        </div>
      </header>
      <section ref={contentRef} className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        {children}
        {audio?.caption && (audio.muted || audio.visualOnly) && (
          <div className="audio-caption" role="status">{audio.caption}</div>
        )}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
        <NavBack onClick={onPrev} hidden={screen === 0} />
        <NavNext onClick={onNext} finish={finish} />
      </footer>
    </main>
  );
};

const OptionGrid = ({ options, picked, correctIndex = null, solved = false, showWrong = false, onPick, disabled = false }) => {
  const t = useT();
  return (
    <div className="options">
      {options.map((option, index) => {
        const isCorrect = solved && index === correctIndex;
        const isWrong = picked === index && (solved || showWrong) && index !== correctIndex;
        return (
          <button
            type="button"
            key={`${index}-${t(option)}`}
            className={`option ${picked === index ? 'option-picked' : ''} ${isCorrect ? 'option-correct' : ''} ${isWrong ? 'option-wrong' : ''}`}
            onClick={() => onPick(index)}
            disabled={disabled}
            aria-pressed={picked === index}
          >
            <b>{String.fromCharCode(65 + index)}</b>
            <span>{t(option)}</span>
          </button>
        );
      })}
    </div>
  );
};

const OptionalPrediction = ({ options, correctIndex, picked, onPick, feedback }) => {
  const t = useT();
  return (
    <div className="optional-content">
      <span className="optional-label">{t({ uz: 'IXTIYORIY TAXMIN', ru: 'НЕОБЯЗАТЕЛЬНАЯ ГИПОТЕЗА' })}</span>
      <OptionGrid options={options} picked={picked} onPick={onPick} />
      <FeedbackBlock visible={picked !== null} correct={picked === correctIndex}>
        {picked !== null ? t(feedback[picked]) : ''}
      </FeedbackBlock>
    </div>
  );
};

const sanitizeNumeric = (value) => String(value ?? '')
  .replace(/[^0-9]/g, '')
  .replace(/^0+(?=\d)/, '')
  .slice(0, 8);

function Screen0({ screen, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s0;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);

  const pick = (index) => {
    setPicked(index);
    onAnswer({
      stage: 'hook',
      screenIdx: screen,
      question: t(c.question),
      options: c.options.map((option) => t(option)),
      correctIndex: 1,
      correctAnswer: t(c.options[1]),
      studentAnswerIndex: index,
      studentAnswer: t(c.options[index]),
      correct: index === 1,
      firstTry: index === 1,
      attempts: 1,
      solved: true,
    });
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="hook-scene">
          <div className="hook-copy">
            <span>{t({ uz: 'ZAYNABNING HISOBI', ru: 'РАСЧЁТ ЗАЙНАБ' })}</span>
            <strong>3 × 2 408</strong>
            <p>{t(c.question)}</p>
          </div>
          <div className={`box-groups beat-${audio.beat}`} aria-hidden="true">
            {[0, 1, 2].map((box) => (
              <div className="detail-box" key={box} style={{ '--box-delay': `${box * 100}ms` }}>
                <i /><i /><i /><i />
                <b>2 408</b>
              </div>
            ))}
          </div>
          <div className={`hook-estimate ${audio.beat >= 2 ? 'estimate-visible' : ''}`}>
            <span>6 024</span>
            <i />
            <span>≈ 7 200</span>
          </div>
          <BitSVG state="think" />
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionGrid options={c.options} picked={picked} onPick={pick} />
          <FeedbackBlock visible={picked !== null} correct>
            {t({
              uz: "Ajoyib, avval sonning har bir xonasini uch marta olamiz.",
              ru: 'Хорошо. Сначала возьмём каждый разряд числа три раза.',
            })}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s1;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);
  const feedback = [
    { uz: "To'g'ri. Nol o'nlar xonasini saqlab turibdi.", ru: 'Верно. Ноль сохраняет разряд десятков.' },
    { uz: '4 yuzlar xonasida turib, 400 ni bildiradi.', ru: 'Цифра 4 стоит в сотнях и означает 400.' },
    { uz: 'Chapdagi 2 minglar xonasida turib, 2 000 ni bildiradi.', ru: 'Цифра 2 слева стоит в тысячах и означает 2 000.' },
  ];
  const reveal = audio.beat >= 1 || audio.completed;

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="place-model" aria-label={t(c.question)}>
          <div className="source-number">2 408</div>
          <div className={`split-arrow ${reveal ? 'revealed' : ''}`}>↓</div>
          <div className={`place-cards ${reveal ? 'revealed' : ''}`}>
            {[
              ['2 000', { uz: 'minglik', ru: 'тысячи' }],
              ['400', { uz: 'yuzlik', ru: 'сотни' }],
              ['0', { uz: "o'nlik", ru: 'десятки' }],
              ['8', { uz: 'birlik', ru: 'единицы' }],
            ].map(([value, label], index) => (
              <div className={index === 2 ? 'zero-card' : ''} key={value} style={{ '--reveal-delay': `${index * 90}ms` }}>
                <strong>{value}</strong><span>{t(label)}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="question-card optional-question">
          <h2>{t(c.question)}</h2>
          <OptionalPrediction options={c.options} correctIndex={0} picked={picked} onPick={setPicked} feedback={feedback} />
        </section>
      </div>
    </Stage>
  );
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s2;
  const audio = useNarration(c.audio, screen);
  const parts = [
    ['2 000 × 3', '6 000'],
    ['400 × 3', '1 200'],
    ['0 × 3', '0'],
    ['8 × 3', '24'],
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} lead={c.lead} />
        <section className="expanded-model">
          <SensorFactorySVG beat={audio.beat} />
          <div className="expanded-source">2 408 = 2 000 + 400 + 0 + 8</div>
          <div className="expanded-parts">
            {parts.map(([formula, value], index) => (
              <div className={`expanded-part ${audio.beat === index ? 'active' : ''} ${audio.beat >= index ? 'revealed' : ''}`} key={formula}>
                <span>{formula}</span>
                <div className="triplicate" aria-hidden="true"><i /><i /><i /></div>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className={`expanded-sum ${audio.beat >= 4 || audio.completed ? 'revealed' : ''}`}>
            <span>6 000 + 1 200 + 0 + 24</span>
            <strong>= 7 224</strong>
          </div>
        </section>
        <div className="key-idea">
          <span>× 3</span>
          <p>{t({ uz: "Har bir xona miqdori uch marta olindi.", ru: 'Значение каждого разряда взято три раза.' })}</p>
        </div>
      </div>
    </Stage>
  );
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s3;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);
  const reveal = audio.beat >= 1 || audio.completed;
  const feedback = [
    { uz: "Ko'paytiruvchi butun sonni necha marta olishni bildiradi; uni birlar ostiga yozing.", ru: 'Множитель показывает, сколько раз берут всё число; запиши его под единицами.' },
    { uz: "Ko'paytiruvchi yuzlikni emas, butun sonni ko'paytiradi.", ru: 'Множитель относится не только к сотням, а ко всему числу.' },
    { uz: "To'g'ri. Bir xonali ko'paytiruvchi birlar ostiga yoziladi.", ru: 'Верно. Однозначный множитель записывается под единицами.' },
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="column-placement">
          <PlaceConveyorSVG beat={audio.beat} />
          <div className="place-headings">
            {[{ uz: 'ming', ru: 'тыс.' }, { uz: 'yuz', ru: 'сот.' }, { uz: "o'n", ru: 'дес.' }, { uz: 'bir', ru: 'ед.' }].map((label) => <span key={t(label)}>{t(label)}</span>)}
          </div>
          <div className="column-number"><span>2</span><span>4</span><span>0</span><span>8</span></div>
          <div className={`falling-multiplier ${reveal ? 'placed' : ''}`}>×<b>3</b></div>
          <div className={`start-marker ${audio.beat >= 1 ? 'revealed' : ''}`}>{t({ uz: "shu yerdan boshlaymiz", ru: 'начинаем отсюда' })} ↑</div>
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionalPrediction options={c.options} correctIndex={2} picked={picked} onPick={setPicked} feedback={feedback} />
        </section>
      </div>
    </Stage>
  );
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s4;
  const audio = useNarration(c.audio, screen);
  const activePlace = audio.beat <= 1 ? 3 : audio.beat <= 3 ? 2 : audio.beat <= 5 ? 1 : 0;
  const formulas = [
    '6 × 4 = 24',
    "24 = 2 o'nlik + 4 birlik",
    '4 × 4 + 2 = 18',
    "18 = 1 yuzlik + 8 o'nlik",
    '7 × 4 + 1 = 29',
    '29 = 2 minglik + 9 yuzlik',
    '3 × 4 + 2 = 14',
    '3 746 × 4 = 14 984',
  ];
  const resultDigits = ['1', '4', '9', '8', '4'];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} lead={c.lead} />
        <section className="carry-model">
          <div className="carry-grid">
            <div className="carry-row carry-tokens" aria-hidden="true">
              <span className={audio.beat >= 6 ? 'shown' : ''}>2</span>
              <span className={audio.beat >= 4 ? 'shown' : ''}>1</span>
              <span className={audio.beat >= 2 ? 'shown' : ''}>2</span>
              <span />
            </div>
            <div className="carry-row top-number">
              {['3', '7', '4', '6'].map((digit, index) => <span className={index === activePlace ? 'active-place' : ''} key={`${digit}-${index}`}>{digit}</span>)}
            </div>
            <div className="carry-row multiplier-row"><i>×</i><span /><span /><span /><span>4</span></div>
            <div className="carry-rule" />
            <div className="carry-row result-row">
              {resultDigits.map((digit, index) => {
                const thresholds = [6, 6, 4, 2, 0];
                return <span className={audio.beat >= thresholds[index] ? 'shown' : ''} key={`${digit}-${index}`}>{digit}</span>;
              })}
            </div>
          </div>
          <CarryCapsuleSVG beat={audio.beat} activePlace={activePlace} />
          <MiniCoach state="point" cue="10 → 1" />
          <div className="active-equation">{formulas[Math.min(audio.beat, formulas.length - 1)]}</div>
        </section>
        <div className="key-idea">
          <span>10 → 1</span>
          <p>{t({ uz: "To'liq o'nlik keyingi xonaga o'tadi.", ru: 'Полный десяток переходит в следующий разряд.' })}</p>
        </div>
      </div>
    </Stage>
  );
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s5;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);
  const exchanged = audio.beat >= 2 || audio.completed;
  const feedback = [
    { uz: "To'g'ri. 20 birlik 2 o'nlikka aylanadi, 4 birlik qoladi.", ru: 'Верно. Двадцать единиц превращаются в два десятка, четыре единицы остаются.' },
    { uz: "Birlar xonasida faqat 4 birlik qoladi; 20 birlik 2 o'nlikka aylanadi.", ru: 'В единицах остаётся 4; двадцать единиц превращаются в два десятка.' },
    { uz: "24 sonida 2 o'nlik va 4 birlik bor; raqamlarning o'rnini almashtirmang.", ru: 'В числе 24 есть 2 десятка и 4 единицы; не меняй цифры местами.' },
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className={`exchange-model ${exchanged ? 'exchanged' : ''}`}>
          <div className="unit-cloud" aria-label="24">
            {Array.from({ length: 24 }, (_, index) => <i key={index} style={{ '--dot': index }} />)}
          </div>
          <div className="exchange-arrow">→</div>
          <div className="exchange-result">
            <div className="ten-rods"><span /><span /></div>
            <div className="single-units"><i /><i /><i /><i /></div>
            <strong>{t({ uz: "2 o'nlik + 4 birlik", ru: '2 десятка + 4 единицы' })}</strong>
          </div>
          <div className={`exchange-total ${audio.beat >= 6 || audio.completed ? 'revealed' : ''}`}>124 × 6 = 744</div>
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionalPrediction options={c.options} correctIndex={0} picked={picked} onPick={setPicked} feedback={feedback} />
        </section>
      </div>
    </Stage>
  );
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s6;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);
  const feedback = [
    { uz: "Nolning ko'paytmasi nol, ammo ko'chgan 3 ni ham qo'shish kerak.", ru: 'Произведение нуля равно нулю, но нужно прибавить перенос 3.' },
    { uz: "To'g'ri. Nol xonasi ko'chirilgan 3 ni qabul qiladi.", ru: 'Верно. Разряд с нулём принимает перенос 3.' },
    { uz: "Bu ustunda nol olti marta olinadi; oltita emas, nol hosil bo'ladi. Keyin ko'chgan 3 qo'shiladi.", ru: 'В этом разряде ноль берётся шесть раз; получается не шесть, а ноль. Затем прибавляется перенос 3.' },
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="zero-carry-model">
          <ZeroCheckpointSVG beat={audio.beat} />
          <MiniCoach state="focus" cue="0 + 3" />
          <div className="mini-column">
            <div><span>4</span><span className="zero-place">0</span><span>5</span><span>2</span></div>
            <div className="mini-multiplier">× <b>6</b></div>
          </div>
          <div className={`zero-equation ${audio.beat >= 1 ? 'revealed' : ''}`}>
            0 × 6 <b className={audio.beat >= 2 ? 'shown' : ''}>+ 3</b> = <strong className={audio.beat >= 3 ? 'shown' : ''}>3</strong>
          </div>
          <div className={`zero-final ${audio.beat >= 3 || audio.completed ? 'revealed' : ''}`}>4 052 × 6 = 24 312</div>
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionalPrediction options={c.options} correctIndex={1} picked={picked} onPick={setPicked} feedback={feedback} />
        </section>
      </div>
    </Stage>
  );
}

function Screen7({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s7;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);
  const proved = audio.beat >= 2 || audio.completed;
  const feedback = [
    { uz: "Ustun usuli ishlaydi, lekin yaqin 5 000 dan foydalanish qisqaroq.", ru: 'Столбик работает, но использование близкого числа 5 000 короче.' },
    { uz: "To'g'ri. 4 999 soni 5 000 dan bir kam.", ru: 'Верно. Число 4 999 на один меньше 5 000.' },
    { uz: "Ko'paytirishda 4 999 soni yetti marta olinadi; unga faqat 7 qo'shilmaydi.", ru: 'При умножении число 4 999 берут семь раз, а не просто прибавляют 7.' },
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="strategy-model">
          <div className="strategy-source">4 999 × 7</div>
          <div className="strategy-bridge">
            <span>4 999</span><i>+1</i><strong>5 000</strong>
          </div>
          <div className={`strategy-proof ${proved ? 'revealed' : ''}`}>
            <span>(5 000 − 1) × 7</span>
            <span>35 000 − 7</span>
            <strong>= 34 993</strong>
          </div>
          <div className={`estimate-band ${proved ? 'revealed' : ''}`}><i /><b>34 993</b><span>≈ 35 000</span></div>
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionalPrediction options={c.options} correctIndex={1} picked={picked} onPick={setPicked} feedback={feedback} />
        </section>
      </div>
    </Stage>
  );
}

function ScoredChoice({
  screen,
  c,
  options = c.options,
  correctIndex,
  feedback,
  feedbackAudio,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
  bitState = null,
  visual = null,
}) {
  const t = useT();
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [feedbackIndex, setFeedbackIndex] = useState(
    storedAnswer?.studentAnswerIndex ?? null,
  );
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true);

  const pick = (index) => {
    if (solved) return;
    const attempts = attemptsRef.current + 1;
    attemptsRef.current = attempts;
    const correct = index === correctIndex;
    if (!correct) firstTryRef.current = false;
    setPicked(index);
    setFeedbackIndex(index);
    setSolved(correct);
    playSfx(correct ? 'correct' : 'wrong');
    audio.pushOneOff(t(feedbackAudio[index]));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.question),
      options: options.map((option) => t(option)),
      correctIndex,
      correctAnswer: t(options[correctIndex]),
      studentAnswerIndex: index,
      studentAnswer: t(options[index]),
      correct,
      firstTry: correct && firstTryRef.current && attempts === 1,
      attempts,
      solved: correct,
    });
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} bitState={bitState} />
        {visual}
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionGrid
            options={options}
            picked={picked}
            correctIndex={correctIndex}
            solved={solved}
            showWrong={feedbackIndex !== null && !solved}
            onPick={pick}
            disabled={solved}
          />
          <FeedbackBlock visible={feedbackIndex !== null} correct={solved}>
            {feedbackIndex !== null ? t(feedback[feedbackIndex]) : ''}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

function Screen8(props) {
  const c = CONTENT.s8;
  const feedback = [
    {
      uz: "To'g'ri. Yetti guruhdagi bittadan ortiqcha birlik, jami 7 ayiriladi.",
      ru: 'Верно. В семи группах взято по одной лишней единице, поэтому вычитаем 7.',
    },
    {
      uz: 'Besh ming yetti marta olinganda har guruhda bittadan ortiqcha bor; jami 7 ayiriladi.',
      ru: 'При семи группах по пять тысяч взято семь лишних единиц; их нужно вычесть.',
    },
    {
      uz: "Ko'paytirish sonni yetti marta olishni bildiradi, unga faqat 7 qo'shishni emas.",
      ru: 'Умножение означает взять число семь раз, а не просто прибавить семь.',
    },
  ];
  const feedbackAudio = [
    {
      uz: "To'g'ri. Besh ming yetti marta olinib, yettita ortiqcha birlik ayiriladi.",
      ru: 'Верно. Пять тысяч берут семь раз и вычитают семь лишних единиц.',
    },
    {
      uz: 'Ortiqcha olingan yettita birlikni ayirish kerak.',
      ru: 'Семь лишних единиц нужно вычесть.',
    },
    {
      uz: "Ko'paytirish sonni yetti marta olishni bildiradi.",
      ru: 'Умножение означает взять число семь раз.',
    },
  ];
  return (
    <ScoredChoice
      {...props}
      c={c}
      correctIndex={0}
      feedback={feedback}
      feedbackAudio={feedbackAudio}
      visual={(
        <div className="compact-proof" aria-hidden="true">
          <span>4 999 = 5 000 − 1</span><i>→</i><strong>× 7</strong>
        </div>
      )}
    />
  );
}

function Screen9({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s9;
  const audio = useNarration(c.audio, screen);
  const slotLabels = ['2 000 × 4', '300 × 4', '0 × 4', '6 × 4'];
  const cards = ['8 000', '1 200', '0', '24'];
  const correct = ['8 000', '1 200', '0', '24'];
  const [placed, setPlaced] = useState(storedAnswer?.correct ? correct : [null, null, null, null]);
  const [selected, setSelected] = useState(null);
  const [wrongSlots, setWrongSlots] = useState([]);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [message, setMessage] = useState(storedAnswer?.correct
    ? { uz: "To'g'ri. Oraliq natijalar 9 224 ga yig'iladi.", ru: 'Верно. Промежуточные результаты складываются в 9 224.' }
    : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true);

  const available = cards.filter((card) => !placed.includes(card));

  const evaluate = (next) => {
    if (next.some((value) => value === null)) return;
    const attempts = attemptsRef.current + 1;
    attemptsRef.current = attempts;
    const incorrect = next.map((value, index) => value !== correct[index] ? index : -1).filter((index) => index >= 0);
    const isCorrect = incorrect.length === 0;
    if (!isCorrect) firstTryRef.current = false;
    setWrongSlots(incorrect);
    setSolved(isCorrect);
    const nextMessage = isCorrect
      ? { uz: "To'g'ri. 8 000, 1 200, 0 va 24 ning yig'indisi 9 224.", ru: 'Верно. Сумма 8 000, 1 200, 0 и 24 равна 9 224.' }
      : incorrect.includes(2)
        ? { uz: "Nol o'nlik to'rt marta olinsa ham nol; uning xona o'rni saqlanadi.", ru: 'Ноль десятков, взятый четыре раза, остаётся нулём; его место сохраняется.' }
        : { uz: "Ajratilgan kartada qaysi xona miqdori ko'paytirilganini tekshiring.", ru: 'Проверь, значение какого разряда умножено на выделенной карточке.' };
    setMessage(nextMessage);
    playSfx(isCorrect ? 'correct' : 'wrong');
    audio.pushOneOff(isCorrect
      ? t({ uz: "To'g'ri. Sakkiz ming, bir ming ikki yuz, nol va yigirma to'rt yig'indisi to'qqiz ming ikki yuz yigirma to'rt.", ru: 'Верно. Сумма восьми тысяч, одной тысячи двухсот, нуля и двадцати четырёх равна девяти тысячам двумстам двадцати четырём.' })
      : t({ uz: 'Ajratilgan kartaning xona qiymatini yana tekshiring.', ru: 'Ещё раз проверь разрядное значение выделенной карточки.' }));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.question),
      options: cards,
      correctIndex: null,
      correctAnswer: correct.join(' | '),
      studentAnswerIndex: null,
      studentAnswer: next.join(' | '),
      correct: isCorrect,
      firstTry: isCorrect && firstTryRef.current && attempts === 1,
      attempts,
      solved: isCorrect,
    });
  };

  const placeCard = (slotIndex) => {
    if (solved) return;
    if (placed[slotIndex] !== null) {
      const next = [...placed];
      next[slotIndex] = null;
      setPlaced(next);
      setWrongSlots([]);
      setMessage(null);
      return;
    }
    if (selected === null) return;
    const next = [...placed];
    next[slotIndex] = selected;
    setPlaced(next);
    setSelected(null);
    setWrongSlots([]);
    setMessage(null);
    evaluate(next);
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="construction-board">
          <div className="construction-formula">(2 000 × 4) + (300 × 4) + (0 × 4) + (6 × 4)</div>
          <div className="construction-slots">
            {slotLabels.map((label, index) => (
              <button
                type="button"
                key={label}
                className={`construction-slot ${placed[index] !== null ? 'filled' : ''} ${wrongSlots.includes(index) ? 'slot-wrong' : ''}`}
                onClick={() => placeCard(index)}
                disabled={solved}
                aria-label={`${label}: ${placed[index] ?? t({ uz: "bo'sh", ru: 'пусто' })}`}
              >
                <small>{label}</small>
                <strong>{placed[index] ?? '···'}</strong>
              </button>
            ))}
          </div>
          <div className="card-bank" aria-label={t({ uz: 'Kartalar', ru: 'Карточки' })}>
            {available.map((card) => (
              <button
                type="button"
                key={card}
                className={`math-card ${selected === card ? 'selected' : ''}`}
                onClick={() => setSelected(card)}
                disabled={solved}
                aria-pressed={selected === card}
              >
                {card}
              </button>
            ))}
          </div>
          <div className={`construction-total ${solved ? 'revealed' : ''}`}>8 000 + 1 200 + 0 + 24 = <b>9 224</b></div>
        </section>
        <FeedbackBlock visible={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen10({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s10;
  const audio = useNarration(c.audio, screen);
  const target = ['1', '7', '5', '4', '1'];
  const initial = storedAnswer?.correct ? target : [null, null, null, null, null];
  const [digits, setDigits] = useState(initial);
  const [active, setActive] = useState(() => initial.every(Boolean) ? null : 4);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [message, setMessage] = useState(storedAnswer?.correct
    ? { uz: "To'g'ri. Natija 17 541.", ru: 'Верно. Результат равен 17 541.' }
    : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true);

  const hints = [
    { uz: "5 ni uch marta olsak, 15; ko'chgan 2 bilan 17 bo'ladi.", ru: 'Пять, взятое три раза, даёт 15; с переносом 2 получается 17.' },
    { uz: "5 ni uch marta olsak, 15; ko'chgan 2 bilan 17 bo'ladi.", ru: 'Пять, взятое три раза, даёт 15; с переносом 2 получается 17.' },
    { uz: "8 ni uch marta olsak, 24; ko'chgan 1 bilan 25 bo'ladi. 5 yoziladi.", ru: 'Восемь, взятое три раза, даёт 24; с переносом 1 получается 25. Записываем 5.' },
    { uz: "4 ni uch marta olgandagi 12 ga ko'chgan 2 ni qo'shing.", ru: 'К двенадцати от четырёх, взятого три раза, прибавь перенос 2.' },
    { uz: "7 ni uch marta olsak, 21; 1 yozilib, 2 o'nlik ko'chadi.", ru: 'Семь, взятое три раза, даёт 21; записываем 1 и переносим 2 десятка.' },
  ];
  const hintsAudio = [
    { uz: "Beshni uch marta olsak, o'n besh, ko'chgan ikki bilan o'n yetti bo'ladi.", ru: 'Пять, взятое три раза, даёт пятнадцать, с переносом два получается семнадцать.' },
    { uz: "Beshni uch marta olsak, o'n besh, ko'chgan ikki bilan o'n yetti bo'ladi.", ru: 'Пять, взятое три раза, даёт пятнадцать, с переносом два получается семнадцать.' },
    { uz: "Sakkizni uch marta olsak, yigirma to'rt, ko'chgan bir bilan yigirma besh bo'ladi. Besh yoziladi.", ru: 'Восемь, взятое три раза, даёт двадцать четыре, с переносом один получается двадцать пять. Записываем пять.' },
    { uz: "To'rtni uch marta olgandagi o'n ikkiga ko'chgan ikkini qo'shing.", ru: 'К двенадцати от четырёх, взятого три раза, прибавь перенос два.' },
    { uz: "Yettini uch marta olsak, yigirma bir, bir yozilib, ikki o'nlik ko'chadi.", ru: 'Семь, взятое три раза, даёт двадцать один, записываем один и переносим два десятка.' },
  ];

  const enterDigit = (digit) => {
    if (active === null || digits[active] !== null) return;
    attemptsRef.current += 1;
    if (digit !== target[active]) {
      firstTryRef.current = false;
      setWrongIndex(active);
      setMessage(hints[active]);
      playSfx('wrong');
      audio.pushOneOff(t(hintsAudio[active]));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.question),
        options: null,
        correctIndex: null,
        correctAnswer: '17 541',
        studentAnswerIndex: null,
        studentAnswer: digits.map((value) => value ?? '□').join(''),
        correct: false,
        firstTry: false,
        attempts: attemptsRef.current,
        solved: false,
      });
      return;
    }
    const next = [...digits];
    next[active] = digit;
    setDigits(next);
    setWrongIndex(null);
    setMessage(null);
    const nextActive = [4, 3, 2, 1, 0].find((index) => next[index] === null) ?? null;
    setActive(nextActive);
    if (nextActive === null) {
      const success = { uz: "To'g'ri. Natija o'n yetti ming besh yuz qirq bir.", ru: 'Верно. Получается семнадцать тысяч пятьсот сорок один.' };
      setMessage(success);
      playSfx('correct');
      audio.pushOneOff(t(success));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.question),
        options: null,
        correctIndex: null,
        correctAnswer: '17 541',
        studentAnswerIndex: null,
        studentAnswer: '17 541',
        correct: true,
        firstTry: firstTryRef.current,
        attempts: attemptsRef.current,
        solved: true,
      });
    }
  };

  const solved = digits.every(Boolean);
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="digit-task">
          <div className="digit-column">
            <span>5 847</span>
            <span>× 3</span>
            <i />
          </div>
          <p className="direction-hint">{t({ uz: "O'ngdan boshlash qulay, lekin katakni o'zingiz tanlashingiz mumkin.", ru: 'Удобно начать справа, но ты можешь выбрать любую ячейку.' })}</p>
          <div className="digit-slots" role="group" aria-label={t({ uz: 'Natija kataklari', ru: 'Ячейки ответа' })}>
            {digits.map((digit, index) => (
              <button
                type="button"
                key={index}
                className={`${active === index ? 'active' : ''} ${digit !== null ? 'locked' : ''} ${wrongIndex === index ? 'wrong' : ''}`}
                onClick={() => digit === null && setActive(index)}
                disabled={digit !== null}
                aria-label={`${index + 1}: ${digit ?? t({ uz: "bo'sh", ru: 'пусто' })}`}
              >
                {digit ?? '□'}
              </button>
            ))}
          </div>
          <div className="keypad" aria-label={t({ uz: 'Raqamlar paneli', ru: 'Цифровая панель' })}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
              <button type="button" key={digit} onClick={() => enterDigit(String(digit))} disabled={solved}>{digit}</button>
            ))}
          </div>
        </section>
        <FeedbackBlock visible={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen11(props) {
  const c = CONTENT.s11;
  const options = [{ uz: '0', ru: '0' }, { uz: '3', ru: '3' }, { uz: '5', ru: '5' }];
  const feedback = [
    { uz: "To'g'ri. Yuzlar katagidagi 0 yozuvni 15 085 qilib tiklaydi.", ru: 'Верно. Ноль в разряде сотен восстанавливает запись 15 085.' },
    { uz: "Katakni olib tashlash yoki 3 yozish mumkin emas; aks holda o'ngdagi raqamlarning xona qiymati o'zgaradi.", ru: 'Нельзя убрать ячейку или записать 3, иначе изменится разрядное значение цифр справа.' },
    { uz: "Bu katak ko'paytiruvchi uchun emas, natijaning yuzlar xonasi uchun.", ru: 'Эта ячейка относится не к множителю, а к разряду сотен результата.' },
  ];
  const feedbackAudio = [
    { uz: "To'g'ri. Natija o'n besh ming sakson besh.", ru: 'Верно. Результат равен пятнадцати тысячам восьмидесяти пяти.' },
    { uz: "Yuzlar xonasining o'rnini saqlaydigan raqamni tekshiring.", ru: 'Проверь цифру, которая сохраняет место разряда сотен.' },
    { uz: "Bo'sh katak natijaning yuzlar xonasida turibdi.", ru: 'Пустая ячейка стоит в разряде сотен результата.' },
  ];
  return (
    <ScoredChoice
      {...props}
      c={{ ...c, options }}
      options={options}
      correctIndex={0}
      feedback={feedback}
      feedbackAudio={feedbackAudio}
      bitState="awkward"
      visual={(
        <div className="error-equation">
          <span>3 017 × 5</span><i>=</i><strong>15 <b>□</b> 85</strong>
        </div>
      )}
    />
  );
}

function Screen12({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s12;
  const audio = useNarration(c.audio, screen);
  const left = ['2 408 × 3 = 7 224', '6 110 × 4 = 24 440', '1 995 × 5 = 9 975'];
  const right = ['≈ 10 000', '≈ 7 200', '≈ 24 000'];
  const mapping = [1, 2, 0];
  const [activeLeft, setActiveLeft] = useState(null);
  const [matches, setMatches] = useState(storedAnswer?.correct ? mapping : [null, null, null]);
  const [message, setMessage] = useState(storedAnswer?.correct
    ? { uz: "To'g'ri. Barcha aniq natijalar eng yaqin taxmin bilan juftlandi.", ru: 'Верно. Все точные результаты соединены с ближайшей оценкой.' }
    : null);
  const [wrongRight, setWrongRight] = useState(null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true);
  const solved = matches.every((value, index) => value === mapping[index]);

  const chooseRight = (rightIndex) => {
    if (activeLeft === null || solved) return;
    attemptsRef.current += 1;
    if (mapping[activeLeft] !== rightIndex) {
      firstTryRef.current = false;
      setWrongRight(rightIndex);
      const hint = { uz: 'Yaqin minglik yoki yuzlikdan foydalanib yana taxmin qiling.', ru: 'Снова оцени выражение с помощью ближайших тысяч или сотен.' };
      setMessage(hint);
      playSfx('wrong');
      audio.pushOneOff(t(hint));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.question),
        options: right,
        correctIndex: null,
        correctAnswer: mapping.join(','),
        studentAnswerIndex: null,
        studentAnswer: `${activeLeft}:${rightIndex}`,
        correct: false,
        firstTry: false,
        attempts: attemptsRef.current,
        solved: false,
      });
      return;
    }
    const next = [...matches];
    next[activeLeft] = rightIndex;
    setMatches(next);
    setActiveLeft(null);
    setWrongRight(null);
    const done = next.every((value, index) => value === mapping[index]);
    setMessage(done
      ? { uz: "To'g'ri. Taxminlar natijalarning umumiy kattaligiga mos.", ru: 'Верно. Оценки соответствуют общей величине результатов.' }
      : null);
    if (done) {
      playSfx('correct');
      audio.pushOneOff(t({ uz: "To'g'ri. Uchala natija eng yaqin taxmin bilan juftlandi.", ru: 'Верно. Все три результата соединены с ближайшей оценкой.' }));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.question),
        options: right,
        correctIndex: null,
        correctAnswer: mapping.join(','),
        studentAnswerIndex: null,
        studentAnswer: next.join(','),
        correct: true,
        firstTry: firstTryRef.current,
        attempts: attemptsRef.current,
        solved: true,
      });
    }
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="matching-board">
          <div className="matching-column">
            {left.map((item, index) => (
              <button
                type="button"
                key={item}
                className={`${activeLeft === index ? 'selected' : ''} ${matches[index] !== null ? 'matched' : ''}`}
                onClick={() => matches[index] === null && setActiveLeft(index)}
                disabled={matches[index] !== null || solved}
              >
                <span>{item}</span>
                {matches[index] !== null && <b>{right[matches[index]]}</b>}
              </button>
            ))}
          </div>
          <div className="matching-arrow" aria-hidden="true">↔</div>
          <div className="matching-column right-column">
            {right.map((item, index) => {
              const used = matches.includes(index);
              return (
                <button
                  type="button"
                  key={item}
                  className={`${used ? 'matched' : ''} ${wrongRight === index ? 'wrong' : ''}`}
                  onClick={() => chooseRight(index)}
                  disabled={used || solved}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>
        <FeedbackBlock visible={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen13({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s13;
  const audio = useNarration(c.audio, screen);
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '');
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [message, setMessage] = useState(storedAnswer?.correct
    ? { uz: "To'g'ri. Jami 14 250 ta detal.", ru: 'Верно. Всего 14 250 деталей.' }
    : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true);

  const submit = () => {
    const normalized = sanitizeNumeric(value);
    if (!normalized || solved) return;
    attemptsRef.current += 1;
    const correct = normalized === '14250';
    if (!correct) firstTryRef.current = false;
    setSolved(correct);
    const numeric = Number(normalized);
    const nextMessage = correct
      ? { uz: "To'g'ri. Jami 14 250 ta detal.", ru: 'Верно. Всего 14 250 деталей.' }
      : Math.abs(numeric - 14400) > 2000
        ? { uz: "Javob 14 400 atrofida bo'lishi kerak. Natijaning umumiy kattaligini tekshiring.", ru: 'Ответ должен быть около 14 400. Проверь общую величину результата.' }
        : { uz: "Natija taxminga yaqin. Birlar xonasidan boshlab ko'chirishlarni tekshiring.", ru: 'Ответ близок к оценке. Проверь переносы, начиная с единиц.' };
    setMessage(nextMessage);
    playSfx(correct ? 'correct' : 'wrong');
    const spokenFeedback = correct
      ? { uz: "To'g'ri. Jami o'n to'rt ming ikki yuz ellikta detal.", ru: 'Верно. Всего четырнадцать тысяч двести пятьдесят деталей.' }
      : Math.abs(numeric - 14400) > 2000
        ? { uz: "Javob o'n to'rt ming to'rt yuz atrofida bo'lishi kerak. Natijaning umumiy kattaligini tekshiring.", ru: 'Ответ должен быть около четырнадцати тысяч четырёхсот. Проверь общую величину результата.' }
        : { uz: "Natija taxminga yaqin. Birlar xonasidan boshlab ko'chirishlarni tekshiring.", ru: 'Ответ близок к оценке. Проверь переносы, начиная с единиц.' };
    audio.pushOneOff(t(spokenFeedback));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.question),
      options: null,
      correctIndex: null,
      correctAnswer: '14250',
      studentAnswerIndex: null,
      studentAnswer: normalized,
      correct,
      firstTry: correct && firstTryRef.current && attemptsRef.current === 1,
      attempts: attemptsRef.current,
      solved: correct,
    });
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="warehouse-scene" aria-hidden="true">
          <div className="warehouse-boxes">{Array.from({ length: 6 }, (_, index) => <span key={index}>2 375</span>)}</div>
          <div className="warehouse-estimate">2 400 × 6 ≈ 14 400</div>
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <div className="input-row">
            <input
              className={`answer-input ${solved ? 'input-correct' : message ? 'input-wrong' : ''}`}
              inputMode="numeric"
              value={value}
              placeholder="0"
              disabled={solved}
              aria-label={t({ uz: 'Javob', ru: 'Ответ' })}
              onChange={(event) => {
                setValue(sanitizeNumeric(event.target.value));
                setMessage(null);
              }}
              onKeyDown={(event) => event.key === 'Enter' && submit()}
            />
            <button type="button" className="btn btn-white-accent" disabled={!value || solved} onClick={submit}>
              {t({ uz: 'Tekshirish', ru: 'Проверить' })}
            </button>
          </div>
          <FeedbackBlock visible={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

function Screen14({ screen, finishLesson, onPrev }) {
  const t = useT();
  const c = CONTENT.s14;
  const audio = useNarration(c.audio, screen);
  const corrected = audio.beat >= 3 || audio.completed;
  const rules = [
    { uz: "Har bir xona ko'payadi", ru: 'Умножается каждый разряд' },
    { uz: "To'liq o'nlik keyingi xonaga o'tadi", ru: 'Полные десятки переходят дальше' },
    { uz: "Nol xona o'rnini saqlaydi", ru: 'Ноль сохраняет разряд' },
    { uz: 'Javobni taxmin bilan tekshiring', ru: 'Проверяй ответ оценкой' },
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish>
      <div className="screen-stack summary-screen">
        <PageTitle c={c} bitState="happy" />
        <section className="summary-correction">
          <div className="summary-wrong"><small>{t({ uz: 'Hookdagi taxmin', ru: 'Гипотеза из начала' })}</small><span>6 024</span></div>
          <div className={`summary-parts ${corrected ? 'corrected' : ''}`}>
            <span>6 000</span><i>+</i><span>1 200</span><i>+</i><span>0</span><i>+</i><span>24</span>
          </div>
          <div className={`summary-answer ${corrected ? 'revealed' : ''}`}>= 7 224</div>
        </section>
        <section className="rule-grid">
          {rules.map((rule, index) => (
            <div className={audio.beat === index ? 'active' : ''} key={t(rule)}>
              <b>{index + 1}</b><span>{t(rule)}</span>
            </div>
          ))}
        </section>
        <div className="next-bridge">
          <span>{t({ uz: 'KEYINGI DARS', ru: 'СЛЕДУЮЩИЙ УРОК' })}</span>
          <strong>{t({ uz: "Ko'p xonali sonni ikki xonali songa ko'paytirish", ru: 'Умножение многозначного числа на двузначное' })}</strong>
        </div>
      </div>
    </Stage>
  );
}

const SCREENS = [
  Screen0,
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
  Screen11,
  Screen12,
  Screen13,
  Screen14,
];

export default function Grade4Dars09({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
}) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = preview ? previewLang : langProp;
  useMobileZoom();
  useEffect(() => {
    configureLesson({
      ttsApiBase: ttsApiBase || '',
      voiceGender: voiceGender || 'f',
      correctSoundUrl: correctSoundUrl || '',
      wrongSoundUrl: wrongSoundUrl || '',
      previewMode: preview,
    });
  }, [correctSoundUrl, ttsApiBase, voiceGender, wrongSoundUrl, preview]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- the LMS payload requires elapsed time from mount
  const startTimeRef = useRef(Date.now());
  const finishedRef = useRef(false);

  const recordAnswer = useCallback((answer) => {
    setAnswers((previous) => {
      const next = [...previous];
      const old = previous[answer.screenIdx];
      next[answer.screenIdx] = {
        ...answer,
        firstTry: old?.firstTry === false ? false : answer.firstTry,
      };
      return next;
    });
  }, []);

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const scoredIndexes = SCREEN_META
      .map((meta, index) => meta.scored ? index : null)
      .filter((index) => index !== null);
    const correctAnswers = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
    const totalQuestions = scoredIndexes.length;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      studentName: studentName || null,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: Math.round((correctAnswers / totalQuestions) * 100),
      finalScore: correctAnswers,
      finalTotal: totalQuestions,
      passed: correctAnswers / totalQuestions >= 0.6,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredIndexes.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    onFinished?.(payload);
  }, [answers, lang, onFinished, studentName]);

  const CurrentScreen = SCREENS[current];
  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        {preview && (
          <div className="preview-language" aria-label="Preview language">
            {['ru', 'uz'].map((code) => (
              <button
                type="button"
                key={code}
                className={previewLang === code ? 'preview-active' : ''}
                onClick={() => setPreviewLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={current}
          screen={current}
          storedAnswer={answers[current]}
          onAnswer={recordAnswer}
          onPrev={() => setCurrent((value) => Math.max(0, value - 1))}
          onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

const STYLES = `
  .lesson-page:has(.lesson-root),
  .lesson-frame:has(.lesson-root) {
    width: 100%;
    height: 100%;
    min-height: 0 !important;
    overflow: hidden !important;
    overscroll-behavior: none;
  }

  .lesson-root,
  .lesson-root * {
    box-sizing: border-box;
  }

  .lesson-root h1,
  .lesson-root h2,
  .lesson-root h3,
  .lesson-root p {
    margin: 0;
  }

  .lesson-root {
    width: 100%;
    min-height: 100dvh;
    overflow: hidden;
    color: ${T.ink};
    background:
      radial-gradient(circle at 8% 8%, rgba(22, 143, 163, .10), transparent 29%),
      radial-gradient(circle at 92% 92%, rgba(255, 91, 53, .08), transparent 31%),
      ${T.bg};
    font-family: Manrope, Arial, sans-serif;
  }

  .stage {
    width: min(936px, 100%);
    height: 100dvh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background: transparent;
  }

  .stage-header {
    flex: none;
    padding-top: 12px;
    padding-bottom: 9px;
    background: rgba(245, 245, 240, .92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(23, 59, 82, .07);
    z-index: 5;
  }

  .progress-track {
    height: 6px;
    margin-bottom: 10px;
    overflow: hidden;
    border-radius: 99px;
    background: rgba(135, 148, 157, .20);
  }

  .progress-bar {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
    box-shadow: 0 0 12px rgba(255, 91, 53, .34);
    transition: width .5s cubic-bezier(.16, 1, .3, 1);
  }

  .stage-chrome,
  .chrome-title,
  .chrome-actions,
  .audio-controls {
    display: flex;
    align-items: center;
  }

  .stage-chrome {
    justify-content: space-between;
    gap: 16px;
    min-height: 42px;
  }

  .chrome-title {
    min-width: 0;
    gap: 9px;
    color: ${T.ink2};
    font-size: 12px;
    font-weight: 850;
  }

  .chrome-title i {
    width: 9px;
    height: 9px;
    flex: none;
    border-radius: 50%;
    background: ${T.lime};
    box-shadow: 0 0 11px rgba(149, 201, 61, .72);
  }

  .chrome-title span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chrome-actions {
    flex: none;
    gap: 10px;
  }

  .chrome-actions > b {
    color: ${T.ink3};
    font: 850 11px/1 'JetBrains Mono', monospace;
  }

  .audio-controls {
    gap: 5px;
  }

  .icon-btn {
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: ${T.paper};
    color: ${T.navy};
    cursor: pointer;
    box-shadow: 0 8px 20px -15px rgba(${T.shadowBase}, .52);
  }

  .stage-content {
    min-height: 0;
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 18px;
    padding-bottom: 24px;
    scrollbar-color: rgba(22, 143, 163, .25) transparent;
  }

  .stage-nav {
    min-height: 72px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 10px;
    padding-bottom: 12px;
    background: rgba(245, 245, 240, .94);
    border-top: 1px solid rgba(23, 59, 82, .08);
    backdrop-filter: blur(12px);
    z-index: 5;
  }

  .btn {
    min-width: 124px;
    min-height: 50px;
    padding: 0 18px;
    border: 0;
    border-radius: 15px;
    font: 850 13px/1 Manrope, sans-serif;
    cursor: pointer;
    transition: transform .2s ease, background .2s ease, color .2s ease;
  }

  .btn:hover:not(:disabled),
  .icon-btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn-ghost {
    background: transparent;
    color: ${T.ink2};
  }

  .btn-ghost:hover {
    background: ${T.paper};
    box-shadow: 0 10px 24px -17px rgba(${T.shadowBase}, .45);
  }

  .btn-white-accent {
    background: ${T.paper};
    color: ${T.accent};
    box-shadow: 0 13px 28px -18px rgba(255, 91, 53, .60);
  }

  .btn-white-accent:hover:not(:disabled) {
    background: ${T.accent};
    color: white;
  }

  .btn:disabled,
  button:disabled {
    cursor: default;
    opacity: .54;
  }

  .screen-stack {
    display: grid;
    gap: 14px;
  }

  .page-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-height: 88px;
  }

  .page-title > div {
    min-width: 0;
  }

  .page-title > div > span,
  .question-card > span,
  .hook-copy > span,
  .next-bridge > span {
    display: block;
    margin-bottom: 7px;
    color: ${T.cyan};
    font-size: 10px;
    font-weight: 950;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .page-title h1 {
    max-width: 770px;
    font: 750 clamp(27px, 4vw, 41px)/1.05 'Source Serif 4', Georgia, serif;
    letter-spacing: -.025em;
  }

  .page-title p {
    margin-top: 8px;
    color: ${T.ink2};
    font: 850 18px/1.25 'JetBrains Mono', monospace;
  }

  .page-title-bit .g1-char {
    width: 72px;
    height: 90px;
    flex: none;
  }

  .math-mini-coach {
    z-index: 3;
    width: max-content;
    max-width: 100%;
    display: grid;
    grid-template-columns: 68px auto;
    align-items: center;
    gap: 5px;
    pointer-events: none;
  }

  .math-mini-coach .g1-char {
    width: 68px;
    height: 84px;
  }

  .math-mini-coach > span {
    padding: 7px 10px;
    border: 1px solid rgba(255, 91, 53, .22);
    border-radius: 999px;
    color: #FF5B35;
    background: #FFF0EA;
    font: 900 13px/1 'JetBrains Mono', monospace;
  }

  .carry-model > .math-mini-coach,
  .zero-carry-model > .math-mini-coach {
    position: absolute;
    top: 8px;
    right: 10px;
  }

  .sensor-factory-svg,
  .place-conveyor-svg,
  .carry-capsule-svg,
  .zero-checkpoint-svg {
    width: 100%;
    display: block;
    overflow: visible;
  }

  .sensor-factory-svg {
    height: 112px;
  }

  .factory-belt,
  .place-conveyor-track,
  .checkpoint-track {
    fill: none;
    stroke: #173B52;
    stroke-width: 4;
    stroke-linecap: round;
    opacity: .16;
  }

  .sensor-bay {
    opacity: .28;
    transform: translateY(7px);
    transition: opacity .42s ease, transform .52s cubic-bezier(.16, 1, .3, 1);
  }

  .sensor-bay.bay-online {
    opacity: 1;
    transform: translateY(0);
  }

  .sensor-bay rect {
    fill: #E4F5F6;
    stroke: rgba(22, 143, 163, .32);
    stroke-width: 2;
  }

  .sensor-bay circle {
    fill: #168FA3;
  }

  .sensor-bay text,
  .factory-counter text {
    fill: #173B52;
    font: 900 12px/1 'JetBrains Mono', monospace;
    text-anchor: middle;
  }

  .factory-output-arrow {
    fill: none;
    stroke: #FF5B35;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .factory-counter {
    opacity: .2;
    transform: scale(.9);
    transform-origin: 546px 50px;
    transition: opacity .45s ease, transform .55s cubic-bezier(.16, 1, .3, 1);
  }

  .factory-counter.counter-ready {
    opacity: 1;
    transform: scale(1);
  }

  .factory-counter rect {
    fill: #E7F4EC;
    stroke: rgba(36, 117, 83, .38);
    stroke-width: 2;
  }

  .factory-counter text {
    fill: #247553;
  }

  .belt-wheel,
  .conveyor-wheel,
  .checkpoint-wheel {
    fill: #173B52;
    opacity: .28;
  }

  .place-conveyor-svg {
    height: 104px;
    margin-bottom: 2px;
  }

  .place-crate rect {
    fill: #E4F5F6;
    stroke: rgba(22, 143, 163, .32);
    stroke-width: 2;
  }

  .place-crate.unit-crate rect {
    fill: #FFF0EA;
    stroke: rgba(255, 91, 53, .46);
  }

  .place-crate text,
  .conveyor-multiplier text {
    fill: #173B52;
    font: 900 17px/1 'JetBrains Mono', monospace;
    text-anchor: middle;
  }

  .place-crate .place-power {
    fill: #82919A;
    font-size: 9px;
  }

  .conveyor-multiplier {
    transform: translateX(0);
    transition: transform .85s cubic-bezier(.16, 1, .3, 1);
  }

  .conveyor-multiplier rect {
    fill: #FF5B35;
  }

  .conveyor-multiplier text {
    fill: #FFFFFF;
    font-size: 13px;
  }

  .place-conveyor-svg.multiplier-docked .conveyor-multiplier {
    transform: translateX(388px);
  }

  .carry-capsule-svg {
    position: absolute;
    top: 34px;
    width: min(420px, 80%);
    height: 92px;
    pointer-events: none;
  }

  .carry-transfer {
    opacity: .14;
    transition: opacity .4s ease;
  }

  .carry-transfer.transfer-visible {
    opacity: 1;
  }

  .carry-transfer > path {
    fill: none;
    stroke: #FF5B35;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 7 6;
  }

  .carry-capsule rect {
    fill: #FF5B35;
  }

  .carry-capsule text {
    fill: #FFFFFF;
    font: 900 12px/1 'JetBrains Mono', monospace;
    text-anchor: middle;
  }

  .carry-station {
    fill: #E4F5F6;
    stroke: #168FA3;
    stroke-width: 2;
  }

  .zero-checkpoint-svg {
    height: 108px;
    grid-column: 1 / -1;
    margin-bottom: -4px;
  }

  .zero-sensor rect {
    fill: #FFF4D8;
    stroke: rgba(169, 111, 19, .42);
    stroke-width: 2;
  }

  .zero-sensor text,
  .checkpoint-carry text,
  .checkpoint-output text {
    fill: #173B52;
    font: 900 15px/1 'JetBrains Mono', monospace;
    text-anchor: middle;
  }

  .zero-sensor-result {
    fill: #A96F13 !important;
    font-size: 17px !important;
  }

  .checkpoint-carry {
    transform: translateX(0);
    transition: transform .78s cubic-bezier(.16, 1, .3, 1);
  }

  .checkpoint-carry rect {
    fill: #FF5B35;
  }

  .checkpoint-carry text {
    fill: #FFFFFF;
    font-size: 12px;
  }

  .zero-checkpoint-svg.accepts-carry .checkpoint-carry {
    transform: translateX(180px);
  }

  .checkpoint-arrow {
    fill: none;
    stroke: #FF5B35;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: .22;
    transition: opacity .35s ease;
  }

  .checkpoint-output {
    opacity: .18;
    transform: scale(.85);
    transform-origin: 503px 54px;
    transition: opacity .4s ease, transform .5s cubic-bezier(.16, 1, .3, 1);
  }

  .checkpoint-output circle {
    fill: #E7F4EC;
    stroke: rgba(36, 117, 83, .42);
    stroke-width: 2;
  }

  .checkpoint-output text {
    fill: #247553;
    font-size: 20px;
  }

  .zero-checkpoint-svg.checkpoint-done .checkpoint-arrow,
  .zero-checkpoint-svg.checkpoint-done .checkpoint-output {
    opacity: 1;
    transform: scale(1);
  }

  .question-card,
  .place-model,
  .expanded-model,
  .column-placement,
  .carry-model,
  .exchange-model,
  .zero-carry-model,
  .strategy-model,
  .construction-board,
  .digit-task,
  .matching-board,
  .warehouse-scene,
  .summary-correction {
    padding: 17px 19px;
    border-radius: 22px;
    background: ${T.paper};
    box-shadow: 0 18px 42px -31px rgba(${T.shadowBase}, .56);
  }

  .question-card h2 {
    font: 750 clamp(18px, 2.6vw, 25px)/1.28 'Source Serif 4', Georgia, serif;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 14px;
  }

  .option {
    min-height: 56px;
    padding: 10px 13px;
    border: 0;
    border-radius: 15px;
    display: flex;
    align-items: center;
    gap: 11px;
    background: #F8F8F4;
    color: ${T.ink};
    text-align: left;
    font: 750 13px/1.35 Manrope, sans-serif;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(135, 148, 157, .17), 0 8px 17px -14px rgba(${T.shadowBase}, .35);
    transition: transform .2s ease, background .2s ease, opacity .2s ease;
  }

  .option:hover:not(:disabled),
  .option-picked {
    transform: translateY(-2px);
    background: ${T.accentSoft};
  }

  .option b {
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: ${T.paper};
    color: ${T.cyan};
    font: 900 12px/1 'JetBrains Mono', monospace;
  }

  .option-correct {
    background: ${T.successSoft};
    box-shadow: inset 0 0 0 2px rgba(34, 122, 83, .28);
  }

  .option-correct b {
    background: ${T.success};
    color: white;
  }

  .option-wrong {
    background: ${T.warnSoft};
    box-shadow: inset 0 0 0 2px rgba(169, 111, 19, .25);
  }

  .optional-content {
    margin-top: 12px;
  }

  .optional-label {
    display: inline-block;
    color: ${T.ink3};
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .10em;
  }

  .feedback-block {
    max-height: 0;
    margin-top: 0;
    padding: 0 14px;
    overflow: hidden;
    opacity: 0;
    border-radius: 15px;
    display: grid;
    grid-template-columns: 38px 1fr;
    align-items: center;
    gap: 9px;
    transform: translateY(8px);
    transition: max-height .38s ease, padding .34s ease, margin .34s ease, opacity .28s ease, transform .34s ease;
  }

  .feedback-visible {
    max-height: 180px;
    margin-top: 12px;
    padding: 11px 14px;
    opacity: 1;
    transform: translateY(0);
  }

  .feedback-block > span {
    width: 34px;
    height: 34px;
    border-radius: 11px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, .72);
    font-weight: 950;
  }

  .feedback-block p {
    color: ${T.ink2};
    font-size: 13px;
    line-height: 1.45;
  }

  .feedback-correct {
    background: ${T.successSoft};
    box-shadow: inset 4px 0 ${T.success};
  }

  .feedback-correct > span {
    color: ${T.success};
  }

  .feedback-wrong {
    background: ${T.warnSoft};
    box-shadow: inset 4px 0 ${T.warn};
  }

  .feedback-wrong > span {
    color: ${T.warn};
  }

  .audio-caption {
    position: sticky;
    bottom: 4px;
    z-index: 4;
    width: fit-content;
    max-width: min(680px, 100%);
    margin: 13px auto 0;
    padding: 9px 13px;
    border-radius: 12px;
    background: rgba(23, 59, 82, .94);
    color: white;
    text-align: center;
    font-size: 12px;
    line-height: 1.4;
    box-shadow: 0 12px 28px -18px rgba(23, 59, 82, .8);
  }

  .hook-scene {
    min-height: 238px;
    padding: 22px;
    border-radius: 26px;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(200px, .85fr) minmax(320px, 1.55fr) 100px;
    align-items: center;
    gap: 18px;
    color: white;
    background:
      linear-gradient(rgba(255, 255, 255, .025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, .025) 1px, transparent 1px),
      ${T.navy};
    background-size: 25px 25px;
    box-shadow: 0 24px 58px -35px rgba(23, 59, 82, .80);
  }

  .hook-copy {
    position: relative;
    z-index: 2;
  }

  .hook-copy > span {
    color: #7DE1EE;
  }

  .hook-copy strong {
    display: block;
    font: 950 clamp(25px, 4vw, 40px)/1 'JetBrains Mono', monospace;
  }

  .hook-copy p {
    margin-top: 12px;
    color: rgba(255, 255, 255, .76);
    font-size: 13px;
    line-height: 1.45;
  }

  .hook-scene > .g1-char {
    width: 90px;
    height: 113px;
    z-index: 2;
  }

  .box-groups {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    transition: transform .6s cubic-bezier(.16, 1, .3, 1);
  }

  .box-groups.beat-2,
  .box-groups.beat-3 {
    transform: scale(.92) translateX(-5px);
  }

  .detail-box {
    min-width: 0;
    aspect-ratio: 1.15;
    padding: 12px;
    border-radius: 17px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    background: rgba(255, 255, 255, .09);
    box-shadow: inset 0 0 0 1px rgba(125, 225, 238, .18);
    animation: boxJoin .65s cubic-bezier(.16, 1, .3, 1) both;
    animation-delay: var(--box-delay);
  }

  .detail-box i {
    min-height: 20px;
    border-radius: 6px;
    background: linear-gradient(145deg, ${T.cyan}, #5BD6F2);
  }

  .detail-box b {
    grid-column: 1 / -1;
    color: white;
    text-align: center;
    font: 850 12px/1 'JetBrains Mono', monospace;
  }

  .hook-estimate {
    position: absolute;
    left: 39%;
    right: 17%;
    bottom: 14px;
    display: flex;
    align-items: center;
    gap: 9px;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity .45s ease, transform .45s ease;
  }

  .hook-estimate.estimate-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hook-estimate span {
    color: #BDEEF3;
    font: 800 10px/1 'JetBrains Mono', monospace;
  }

  .hook-estimate i {
    height: 4px;
    flex: 1;
    border-radius: 9px;
    background: linear-gradient(90deg, ${T.warn}, ${T.lime});
  }

  .place-model {
    display: grid;
    justify-items: center;
    gap: 10px;
  }

  .source-number,
  .expanded-source,
  .construction-formula,
  .active-equation,
  .strategy-source,
  .compact-proof,
  .error-equation {
    color: ${T.navy};
    font: 900 clamp(20px, 3vw, 29px)/1.2 'JetBrains Mono', monospace;
  }

  .split-arrow {
    color: ${T.accent};
    font-size: 25px;
    opacity: .25;
    transition: opacity .4s ease, transform .4s ease;
  }

  .split-arrow.revealed {
    opacity: 1;
    transform: translateY(3px);
  }

  .place-cards {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 9px;
  }

  .place-cards > div {
    min-height: 75px;
    padding: 10px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 5px;
    opacity: 0;
    transform: translateY(-12px);
    background: ${T.cyanSoft};
    transition: opacity .48s ease, transform .58s cubic-bezier(.16, 1, .3, 1);
    transition-delay: var(--reveal-delay);
  }

  .place-cards.revealed > div {
    opacity: 1;
    transform: translateY(0);
  }

  .place-cards strong {
    color: ${T.navy};
    font: 900 19px/1 'JetBrains Mono', monospace;
  }

  .place-cards span {
    color: ${T.ink2};
    font-size: 10px;
    font-weight: 850;
  }

  .place-cards .zero-card {
    background: ${T.warnSoft};
    box-shadow: inset 0 0 0 2px rgba(169, 111, 19, .18);
  }

  .expanded-model {
    display: grid;
    gap: 14px;
  }

  .expanded-source {
    text-align: center;
    font-size: clamp(18px, 2.8vw, 26px);
  }

  .expanded-parts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .expanded-part {
    min-height: 118px;
    padding: 11px 7px;
    border-radius: 16px;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 9px;
    opacity: .34;
    background: #F8F8F4;
    transition: opacity .4s ease, transform .4s ease, background .4s ease;
  }

  .expanded-part.revealed {
    opacity: 1;
  }

  .expanded-part.active {
    transform: translateY(-5px);
    background: ${T.cyanSoft};
    box-shadow: 0 12px 24px -19px rgba(22, 143, 163, .75);
  }

  .expanded-part > span,
  .expanded-part > strong {
    font: 850 12px/1.2 'JetBrains Mono', monospace;
  }

  .expanded-part > strong {
    color: ${T.success};
    font-size: 17px;
  }

  .triplicate {
    display: flex;
    gap: 4px;
  }

  .triplicate i {
    width: 22px;
    height: 16px;
    border-radius: 5px;
    background: ${T.cyan};
    opacity: .74;
  }

  .expanded-sum {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 13px;
    padding: 12px;
    border-radius: 15px;
    opacity: 0;
    transform: translateY(10px);
    background: ${T.successSoft};
    transition: opacity .52s ease, transform .52s ease;
  }

  .expanded-sum.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .expanded-sum span,
  .expanded-sum strong {
    font: 900 16px/1.2 'JetBrains Mono', monospace;
  }

  .expanded-sum strong {
    color: ${T.success};
  }

  .key-idea {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 15px;
    border-radius: 16px;
    background: ${T.cyanSoft};
    box-shadow: inset 4px 0 ${T.cyan};
  }

  .key-idea > span {
    min-width: 72px;
    color: ${T.cyan};
    font: 950 18px/1 'JetBrains Mono', monospace;
  }

  .key-idea p {
    color: ${T.ink2};
    font-size: 13px;
    line-height: 1.4;
  }

  .column-placement {
    position: relative;
    min-height: 276px;
    display: grid;
    justify-content: center;
    align-content: center;
  }

  .place-headings,
  .column-number {
    width: min(420px, 100%);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .place-headings span {
    padding-bottom: 6px;
    color: ${T.ink3};
    text-align: center;
    font-size: 9px;
    font-weight: 850;
  }

  .column-number span {
    height: 54px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: ${T.cyanSoft};
    color: ${T.navy};
    font: 950 25px/1 'JetBrains Mono', monospace;
    box-shadow: inset 0 0 0 1px rgba(22, 143, 163, .12);
  }

  .falling-multiplier {
    position: absolute;
    left: 50%;
    top: 126px;
    width: min(420px, calc(100% - 40px));
    color: ${T.accent};
    text-align: right;
    padding-right: 4%;
    font: 900 21px/1 'JetBrains Mono', monospace;
    opacity: .35;
    transform: translateY(-10px);
    transition: opacity .55s ease, transform .72s cubic-bezier(.16, 1, .3, 1);
  }

  .falling-multiplier.placed {
    top: 218px;
    opacity: 1;
    transform: translate(-50%, 0);
  }

  .start-marker {
    position: absolute;
    right: 23%;
    bottom: 4px;
    color: ${T.cyan};
    font-size: 10px;
    font-weight: 850;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity .4s ease, transform .4s ease;
  }

  .start-marker.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .carry-model {
    min-height: 275px;
    position: relative;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 12px;
    overflow: hidden;
  }

  .carry-grid {
    width: min(420px, 88%);
    display: grid;
    gap: 5px;
  }

  .carry-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
  }

  .carry-row span {
    min-height: 42px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    font: 950 24px/1 'JetBrains Mono', monospace;
    transition: background .22s ease, transform .22s ease, opacity .3s ease;
  }

  .carry-tokens span {
    min-height: 27px;
    opacity: 0;
    color: ${T.accent};
    font-size: 15px;
  }

  .carry-tokens span.shown,
  .result-row span.shown {
    opacity: 1;
    animation: resultDrop .42s cubic-bezier(.16, 1, .3, 1) both;
  }

  .top-number {
    grid-template-columns: 1fr repeat(4, 1fr);
  }

  .top-number span:first-child {
    grid-column: 2;
  }

  .top-number .active-place {
    background: ${T.cyan};
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 18px -13px rgba(22, 143, 163, .85);
  }

  .multiplier-row {
    color: ${T.accent};
  }

  .multiplier-row i {
    grid-column: 1;
    text-align: center;
    font: 950 20px/1 'JetBrains Mono', monospace;
  }

  .multiplier-row span:last-child {
    grid-column: 5;
    font-size: 22px;
  }

  .carry-rule {
    height: 3px;
    border-radius: 9px;
    background: ${T.navy};
  }

  .result-row span {
    opacity: .13;
    color: ${T.success};
  }

  .carry-path {
    position: absolute;
    top: 36px;
    width: min(420px, 80%);
    height: 86px;
    overflow: visible;
    pointer-events: none;
  }

  .carry-path path {
    fill: none;
    stroke: ${T.accent};
    stroke-width: 2.5;
    stroke-linecap: round;
    opacity: .24;
    stroke-dasharray: 7 7;
  }

  .active-equation {
    min-height: 42px;
    padding: 10px 14px;
    border-radius: 13px;
    background: ${T.accentSoft};
    color: ${T.navy};
    font-size: 15px;
    animation: equationIn .42s ease both;
  }

  .exchange-model {
    min-height: 235px;
    display: grid;
    grid-template-columns: 1fr 48px 1fr;
    align-items: center;
    gap: 14px;
    overflow: hidden;
  }

  .unit-cloud {
    min-height: 145px;
    display: grid;
    grid-template-columns: repeat(6, 16px);
    place-content: center;
    gap: 5px;
  }

  .unit-cloud i {
    width: 16px;
    height: 16px;
    border-radius: 5px;
    background: ${T.cyan};
    opacity: .82;
    transition: opacity .42s ease, transform .62s cubic-bezier(.16, 1, .3, 1);
  }

  .exchange-model.exchanged .unit-cloud i:nth-child(-n+20) {
    opacity: 0;
    transform: translateX(150px) scale(.35);
  }

  .exchange-arrow {
    color: ${T.accent};
    text-align: center;
    font-size: 28px;
  }

  .exchange-result {
    display: grid;
    justify-items: center;
    gap: 10px;
    opacity: .22;
    transition: opacity .55s ease;
  }

  .exchanged .exchange-result {
    opacity: 1;
  }

  .ten-rods,
  .single-units {
    display: flex;
    gap: 8px;
  }

  .ten-rods span {
    width: 25px;
    height: 88px;
    border-radius: 8px;
    background: linear-gradient(${T.cyan}, #5BD6F2);
  }

  .single-units i {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    background: ${T.accent};
  }

  .exchange-result strong {
    color: ${T.ink2};
    font-size: 11px;
  }

  .exchange-total {
    grid-column: 1 / -1;
    justify-self: center;
    padding: 9px 14px;
    border-radius: 12px;
    opacity: 0;
    background: ${T.successSoft};
    color: ${T.success};
    font: 900 18px/1 'JetBrains Mono', monospace;
    transition: opacity .5s ease, transform .5s ease;
    transform: translateY(8px);
  }

  .exchange-total.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .zero-carry-model {
    min-height: 330px;
    position: relative;
    display: grid;
    grid-template-columns: .9fr 1.25fr;
    align-items: center;
    gap: 20px;
    overflow: hidden;
  }

  .mini-column {
    justify-self: center;
    display: grid;
    gap: 9px;
  }

  .mini-column > div:first-child {
    display: grid;
    grid-template-columns: repeat(4, 45px);
  }

  .mini-column span {
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    background: ${T.cyanSoft};
    font: 950 23px/1 'JetBrains Mono', monospace;
  }

  .mini-column .zero-place {
    background: ${T.warnSoft};
    color: ${T.warn};
    box-shadow: inset 0 0 0 2px rgba(169, 111, 19, .22);
  }

  .mini-multiplier {
    color: ${T.accent};
    text-align: right;
    font: 900 21px/1 'JetBrains Mono', monospace;
  }

  .zero-equation {
    padding: 17px;
    border-radius: 17px;
    opacity: .22;
    background: #F8F8F4;
    color: ${T.navy};
    font: 900 clamp(19px, 3vw, 28px)/1.2 'JetBrains Mono', monospace;
    transition: opacity .45s ease;
  }

  .zero-equation.revealed {
    opacity: 1;
  }

  .zero-equation b,
  .zero-equation strong {
    opacity: .13;
    transition: opacity .45s ease, color .45s ease;
  }

  .zero-equation .shown {
    opacity: 1;
  }

  .zero-equation strong {
    color: ${T.success};
  }

  .carry-three {
    position: absolute;
    left: 34%;
    top: 28px;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    opacity: 0;
    background: ${T.accent};
    color: white;
    font: 950 17px/1 'JetBrains Mono', monospace;
  }

  .carry-three.travelling {
    opacity: 1;
    animation: carryTravel .72s cubic-bezier(.16, 1, .3, 1) both;
  }

  .zero-final {
    grid-column: 1 / -1;
    justify-self: center;
    padding: 9px 14px;
    border-radius: 12px;
    opacity: 0;
    background: ${T.successSoft};
    color: ${T.success};
    font: 900 17px/1 'JetBrains Mono', monospace;
    transform: translateY(9px);
    transition: opacity .45s ease, transform .45s ease;
  }

  .zero-final.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .strategy-model {
    min-height: 225px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 15px;
  }

  .strategy-source {
    grid-column: 1 / -1;
    text-align: center;
  }

  .strategy-bridge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 17px;
    border-radius: 16px;
    background: ${T.cyanSoft};
    font: 900 17px/1 'JetBrains Mono', monospace;
  }

  .strategy-bridge i {
    color: ${T.accent};
    font-style: normal;
  }

  .strategy-proof {
    display: grid;
    justify-items: center;
    gap: 7px;
    padding: 14px;
    border-radius: 16px;
    opacity: .18;
    background: ${T.successSoft};
    font: 850 14px/1.2 'JetBrains Mono', monospace;
    transition: opacity .52s ease, transform .52s ease;
    transform: translateX(-10px);
  }

  .strategy-proof.revealed {
    opacity: 1;
    transform: translateX(0);
  }

  .strategy-proof strong {
    color: ${T.success};
    font-size: 20px;
  }

  .estimate-band {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 9px;
    opacity: 0;
    transition: opacity .45s ease;
  }

  .estimate-band.revealed {
    opacity: 1;
  }

  .estimate-band i {
    height: 5px;
    flex: 1;
    border-radius: 9px;
    background: linear-gradient(90deg, ${T.cyan}, ${T.lime});
  }

  .estimate-band b,
  .estimate-band span {
    font: 850 11px/1 'JetBrains Mono', monospace;
  }

  .compact-proof,
  .error-equation {
    min-height: 78px;
    padding: 14px 18px;
    border-radius: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 13px;
    background: ${T.cyanSoft};
    font-size: clamp(17px, 2.7vw, 25px);
  }

  .compact-proof i,
  .error-equation i {
    color: ${T.accent};
    font-style: normal;
  }

  .error-equation {
    background: ${T.warnSoft};
  }

  .error-equation strong b {
    min-width: 43px;
    min-height: 48px;
    border-radius: 11px;
    display: inline-grid;
    place-items: center;
    background: white;
    color: ${T.warn};
  }

  .construction-board {
    display: grid;
    gap: 15px;
  }

  .construction-formula {
    text-align: center;
    font-size: clamp(15px, 2.5vw, 22px);
  }

  .construction-slots {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 9px;
  }

  .construction-slot {
    min-height: 82px;
    padding: 9px;
    border: 0;
    border-radius: 15px;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 8px;
    background: #F8F8F4;
    color: ${T.ink};
    cursor: pointer;
    box-shadow: inset 0 0 0 2px rgba(22, 143, 163, .13);
  }

  .construction-slot small {
    color: ${T.ink3};
    font: 800 9px/1.2 'JetBrains Mono', monospace;
  }

  .construction-slot strong {
    font: 900 17px/1 'JetBrains Mono', monospace;
  }

  .construction-slot.filled {
    background: ${T.cyanSoft};
  }

  .construction-slot.slot-wrong {
    background: ${T.warnSoft};
    animation: shake .38s ease both;
  }

  .card-bank {
    min-height: 66px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 10px;
    border-radius: 15px;
    background: ${T.accentSoft};
  }

  .math-card {
    min-width: 84px;
    min-height: 46px;
    padding: 8px 12px;
    border: 0;
    border-radius: 12px;
    background: white;
    color: ${T.navy};
    font: 900 14px/1 'JetBrains Mono', monospace;
    cursor: pointer;
    box-shadow: 0 8px 18px -14px rgba(${T.shadowBase}, .5);
  }

  .math-card.selected {
    background: ${T.accent};
    color: white;
    transform: translateY(-3px);
  }

  .construction-total {
    min-height: 44px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    opacity: .16;
    background: ${T.successSoft};
    color: ${T.success};
    font: 900 16px/1 'JetBrains Mono', monospace;
    transition: opacity .45s ease;
  }

  .construction-total.revealed {
    opacity: 1;
  }

  .digit-task {
    display: grid;
    justify-items: center;
    gap: 12px;
  }

  .digit-column {
    width: 185px;
    display: grid;
    justify-items: end;
    gap: 5px;
    color: ${T.navy};
    font: 950 25px/1.15 'JetBrains Mono', monospace;
  }

  .digit-column i {
    width: 100%;
    height: 3px;
    border-radius: 9px;
    background: ${T.navy};
  }

  .direction-hint {
    color: ${T.ink3};
    text-align: center;
    font-size: 11px;
  }

  .digit-slots {
    display: flex;
    gap: 8px;
  }

  .digit-slots button {
    width: 54px;
    height: 58px;
    border: 0;
    border-radius: 13px;
    background: #F8F8F4;
    color: ${T.ink3};
    font: 950 24px/1 'JetBrains Mono', monospace;
    cursor: pointer;
    box-shadow: inset 0 0 0 2px rgba(135, 148, 157, .16);
  }

  .digit-slots button.active {
    background: ${T.cyanSoft};
    color: ${T.cyan};
    box-shadow: inset 0 0 0 3px rgba(22, 143, 163, .34), 0 0 0 5px rgba(22, 143, 163, .08);
  }

  .digit-slots button.locked {
    opacity: 1;
    background: ${T.successSoft};
    color: ${T.success};
  }

  .digit-slots button.wrong {
    background: ${T.warnSoft};
    color: ${T.warn};
    animation: shake .38s ease both;
  }

  .keypad {
    width: min(490px, 100%);
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 7px;
  }

  .keypad button {
    min-height: 46px;
    border: 0;
    border-radius: 12px;
    background: ${T.paper};
    color: ${T.navy};
    font: 900 16px/1 'JetBrains Mono', monospace;
    cursor: pointer;
    box-shadow: 0 8px 17px -14px rgba(${T.shadowBase}, .52), inset 0 0 0 1px rgba(135, 148, 157, .15);
  }

  .matching-board {
    display: grid;
    grid-template-columns: 1fr 42px 1fr;
    align-items: center;
    gap: 10px;
  }

  .matching-column {
    display: grid;
    gap: 9px;
  }

  .matching-column button {
    min-height: 61px;
    padding: 9px 12px;
    border: 0;
    border-radius: 14px;
    display: grid;
    align-content: center;
    gap: 5px;
    background: #F8F8F4;
    color: ${T.navy};
    text-align: left;
    font: 850 12px/1.3 'JetBrains Mono', monospace;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(135, 148, 157, .15);
  }

  .matching-column button.selected {
    background: ${T.accentSoft};
    box-shadow: inset 0 0 0 2px rgba(255, 91, 53, .27);
  }

  .matching-column button.matched {
    opacity: 1;
    background: ${T.successSoft};
    color: ${T.success};
  }

  .matching-column button.wrong {
    background: ${T.warnSoft};
    animation: shake .38s ease both;
  }

  .matching-column button b {
    color: ${T.success};
    font-size: 10px;
  }

  .matching-arrow {
    color: ${T.cyan};
    text-align: center;
    font-size: 26px;
  }

  .right-column button {
    text-align: center;
    font-size: 15px;
  }

  .warehouse-scene {
    display: grid;
    gap: 12px;
    background: linear-gradient(145deg, ${T.cyanSoft}, ${T.paper});
  }

  .warehouse-boxes {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
  }

  .warehouse-boxes span {
    min-height: 66px;
    display: grid;
    place-items: center;
    border-radius: 12px 12px 7px 7px;
    background: ${T.navy};
    color: white;
    font: 800 10px/1 'JetBrains Mono', monospace;
    box-shadow: inset 0 7px rgba(255, 255, 255, .07);
    animation: boxJoin .55s cubic-bezier(.16, 1, .3, 1) both;
  }

  .warehouse-estimate {
    justify-self: center;
    padding: 9px 14px;
    border-radius: 12px;
    background: white;
    color: ${T.cyan};
    font: 900 16px/1 'JetBrains Mono', monospace;
  }

  .input-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    margin-top: 14px;
  }

  .answer-input {
    min-height: 54px;
    padding: 10px 15px;
    border: 0;
    border-radius: 14px;
    outline: 0;
    background: #F8F8F4;
    color: ${T.ink};
    font: 900 24px/1 'JetBrains Mono', monospace;
    box-shadow: inset 0 0 0 1px rgba(135, 148, 157, .18);
  }

  .answer-input:focus {
    box-shadow: 0 0 0 3px rgba(22, 143, 163, .24);
  }

  .input-correct {
    background: ${T.successSoft};
    color: ${T.success};
  }

  .input-wrong {
    background: ${T.warnSoft};
    color: ${T.warn};
  }

  .summary-screen {
    padding-bottom: 5px;
  }

  .summary-correction {
    min-height: 150px;
    display: grid;
    grid-template-columns: .72fr 1.55fr .7fr;
    align-items: center;
    gap: 14px;
  }

  .summary-wrong {
    display: grid;
    justify-items: center;
    gap: 6px;
    color: ${T.warn};
  }

  .summary-wrong small {
    color: ${T.ink3};
    font-size: 9px;
  }

  .summary-wrong span,
  .summary-answer {
    font: 950 24px/1 'JetBrains Mono', monospace;
  }

  .summary-wrong span {
    text-decoration: line-through;
    text-decoration-thickness: 3px;
  }

  .summary-parts {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    opacity: .22;
    transition: opacity .62s ease;
  }

  .summary-parts.corrected {
    opacity: 1;
  }

  .summary-parts span {
    padding: 8px 10px;
    border-radius: 10px;
    background: ${T.cyanSoft};
    color: ${T.navy};
    font: 850 12px/1 'JetBrains Mono', monospace;
  }

  .summary-parts i {
    color: ${T.accent};
    font-style: normal;
    font-weight: 950;
  }

  .summary-answer {
    opacity: 0;
    color: ${T.success};
    transform: translateY(-10px);
    transition: opacity .42s ease, transform .42s ease;
  }

  .summary-answer.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .rule-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 9px;
  }

  .rule-grid > div {
    min-height: 59px;
    padding: 9px 12px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${T.paper};
    box-shadow: 0 12px 28px -22px rgba(${T.shadowBase}, .52);
    transition: background .25s ease, transform .25s ease;
  }

  .rule-grid > div.active {
    transform: translateY(-3px);
    background: ${T.cyanSoft};
  }

  .rule-grid b {
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: ${T.navy};
    color: white;
    font: 900 12px/1 'JetBrains Mono', monospace;
  }

  .rule-grid span {
    color: ${T.ink2};
    font-size: 12px;
    font-weight: 800;
  }

  .next-bridge {
    padding: 12px 16px;
    border-radius: 16px;
    background: ${T.navy};
    color: white;
  }

  .next-bridge > span {
    color: #7DE1EE;
  }

  .next-bridge strong {
    font: 750 16px/1.3 'Source Serif 4', Georgia, serif;
  }

  .g1-char-bit {
    overflow: visible;
    filter: drop-shadow(0 6px 12px rgba(58, 53, 48, .22));
  }

  .g1-eyes {
    transform-box: fill-box;
    transform-origin: center;
    animation: g4blink 4.4s infinite;
  }

  .g1-bit-ant {
    transform-box: fill-box;
    transform-origin: bottom center;
    animation: g4antbob 2.2s ease-in-out infinite;
  }

  .g1-bit-wave,
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

  .g1-bit-wave { animation: g4wavebig 1s ease-in-out infinite; }
  .bit-double-wave .bit-wave-left { transform-origin: bottom right; animation: bitWaveLeft 1.05s ease-in-out infinite; }
  .bit-double-wave .bit-wave-right { transform-origin: bottom left; animation: bitWaveRight 1.05s ease-in-out infinite; }
  .bit-think-hand { animation: bitThinkTap 1.8s ease-in-out infinite; }
  .bit-nod-hand { animation: bitNodHand 1.35s ease-in-out infinite; }
  .bit-nod-check { animation: bitCheck 1.35s ease-in-out infinite; }

  button:focus-visible,
  input:focus-visible {
    outline: 3px solid rgba(22, 143, 163, .42);
    outline-offset: 3px;
  }

  @keyframes boxJoin {
    from { opacity: 0; transform: translateY(11px) scale(.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes resultDrop {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes equationIn {
    from { opacity: .35; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes carryTravel {
    from { transform: translate(0, 0) scale(.75); }
    to { transform: translate(130px, 76px) scale(1); }
  }
  @keyframes shake {
    25% { transform: translateX(-4px); }
    50% { transform: translateX(4px); }
    75% { transform: translateX(-2px); }
  }
  @keyframes g4blink {
    0%, 93%, 100% { transform: scaleY(1); }
    96.5% { transform: scaleY(.12); }
  }
  @keyframes g4antbob {
    0%, 100% { transform: rotate(-10deg); }
    50% { transform: rotate(10deg); }
  }
  @keyframes g4wavebig {
    0%, 100% { transform: rotate(2deg); }
    50% { transform: rotate(-26deg); }
  }
  @keyframes bitWaveLeft {
    0%, 100% { transform: rotate(2deg); }
    50% { transform: rotate(25deg); }
  }
  @keyframes bitWaveRight {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(-25deg); }
  }
  @keyframes bitThinkTap {
    0%, 100% { transform: translate(0) rotate(0); }
    50% { transform: translate(-2px, -3px) rotate(-7deg); }
  }
  @keyframes bitNodHand {
    0%, 100% { transform: rotate(0); }
    48% { transform: rotate(-11deg); }
  }
  @keyframes bitCheck {
    0%, 100% { transform: scale(.86); opacity: .72; }
    50% { transform: scale(1.08); opacity: 1; }
  }

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
    box-shadow: 0 8px 20px -14px rgba(58,53,48,.6);
  }

  .preview-language button {
    min-width: 44px;
    min-height: 44px;
    padding: 4px 9px;
    border: 0;
    border-radius: 999px;
    color: #50616D;
    background: transparent;
    cursor: pointer;
    font-size: 10px;
    font-weight: 900;
  }

  .preview-language .preview-active {
    color: #FFFFFF;
    background: #FF5B35;
  }

  @media (max-width: 639.98px) {
    .lesson-root {
      min-height: 100dvh;
    }

    .stage {
      width: 390px;
      max-width: 100%;
      height: 100dvh;
    }

    .stage-header {
      padding-top: 60px;
      padding-bottom: 7px;
    }

    .progress-track {
      margin-bottom: 7px;
    }

    .stage-chrome {
      min-height: 38px;
    }

    .chrome-title {
      max-width: 175px;
      font-size: 10px;
    }

    .chrome-actions {
      gap: 5px;
    }

    .icon-btn {
      width: 44px;
      height: 44px;
      border-radius: 12px;
    }

    .stage-content {
      padding-top: 11px;
      padding-bottom: 18px;
      scrollbar-width: none;
    }

    .stage-content::-webkit-scrollbar {
      display: none;
    }

    .stage-nav {
      min-height: 66px;
      padding-top: 8px;
      padding-bottom: 9px;
    }

    .btn {
      min-width: 104px;
      min-height: 48px;
      padding: 0 12px;
      font-size: 11px;
    }

    .screen-stack {
      gap: 10px;
    }

    .page-title {
      min-height: 69px;
      gap: 8px;
    }

    .page-title h1 {
      font-size: 25px;
    }

    .page-title p {
      margin-top: 5px;
      font-size: 13px;
    }

    .page-title-bit .g1-char {
      width: 58px;
      height: 73px;
    }

    .math-mini-coach {
      grid-template-columns: 60px auto;
    }

    .math-mini-coach .g1-char {
      width: 60px;
      height: 74px;
    }

    .math-mini-coach > span {
      padding: 6px 8px;
      font-size: 11px;
    }

    .carry-model > .math-mini-coach,
    .zero-carry-model > .math-mini-coach {
      position: static;
      grid-column: 1 / -1;
      justify-self: end;
      margin-bottom: -9px;
    }

    .sensor-factory-svg {
      height: 86px;
    }

    .place-conveyor-svg {
      height: 82px;
    }

    .carry-capsule-svg {
      top: 92px;
      width: 88%;
      height: 78px;
    }

    .zero-checkpoint-svg {
      height: 82px;
    }

    .question-card,
    .place-model,
    .expanded-model,
    .column-placement,
    .carry-model,
    .exchange-model,
    .zero-carry-model,
    .strategy-model,
    .construction-board,
    .digit-task,
    .matching-board,
    .warehouse-scene,
    .summary-correction {
      padding: 13px;
      border-radius: 18px;
    }

    .question-card h2 {
      font-size: 18px;
    }

    .options {
      grid-template-columns: 1fr;
      gap: 7px;
      margin-top: 10px;
    }

    .option {
      min-height: 48px;
      padding: 8px 10px;
      font-size: 11px;
    }

    .option b {
      width: 29px;
      height: 29px;
    }

    .feedback-visible {
      max-height: 210px;
    }

    .feedback-block p {
      font-size: 11px;
    }

    .hook-scene {
      min-height: 205px;
      padding: 15px;
      grid-template-columns: 1fr 1.35fr 65px;
      gap: 8px;
      border-radius: 20px;
    }

    .hook-copy strong {
      font-size: 22px;
    }

    .hook-copy p {
      font-size: 10px;
    }

    .hook-scene > .g1-char {
      width: 63px;
      height: 80px;
    }

    .detail-box {
      padding: 6px;
      gap: 3px;
      border-radius: 11px;
    }

    .detail-box i {
      min-height: 15px;
    }

    .detail-box b {
      font-size: 8px;
    }

    .hook-estimate {
      left: 37%;
      right: 19%;
    }

    .place-cards {
      gap: 5px;
    }

    .place-cards > div {
      min-height: 61px;
      padding: 7px 4px;
    }

    .place-cards strong {
      font-size: 14px;
    }

    .expanded-parts {
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }

    .expanded-part {
      min-height: 82px;
      gap: 5px;
    }

    .expanded-sum {
      flex-wrap: wrap;
      gap: 7px;
      text-align: center;
    }

    .expanded-sum span,
    .expanded-sum strong {
      font-size: 12px;
    }

    .column-placement {
      min-height: 240px;
    }

    .falling-multiplier {
      top: 101px;
    }

    .falling-multiplier.placed {
      top: 189px;
    }

    .carry-model {
      min-height: 245px;
    }

    .carry-grid {
      width: 96%;
    }

    .carry-row span {
      min-height: 36px;
      font-size: 20px;
    }

    .carry-path {
      width: 88%;
    }

    .active-equation {
      font-size: 12px;
    }

    .exchange-model {
      min-height: 205px;
      grid-template-columns: 1fr 25px 1fr;
      gap: 5px;
    }

    .unit-cloud {
      grid-template-columns: repeat(6, 11px);
      gap: 3px;
    }

    .unit-cloud i {
      width: 11px;
      height: 11px;
    }

    .ten-rods span {
      width: 19px;
      height: 62px;
    }

    .exchange-result strong {
      font-size: 8px;
    }

    .zero-carry-model {
      min-height: 310px;
      gap: 7px;
    }

    .mini-column > div:first-child {
      grid-template-columns: repeat(4, 34px);
    }

    .mini-column span {
      height: 43px;
      font-size: 18px;
    }

    .zero-equation {
      padding: 11px;
      font-size: 18px;
    }

    .strategy-model {
      min-height: 205px;
      gap: 8px;
    }

    .strategy-bridge {
      padding: 11px 6px;
      font-size: 11px;
    }

    .strategy-proof {
      padding: 10px 4px;
      font-size: 10px;
    }

    .compact-proof,
    .error-equation {
      min-height: 64px;
      padding: 10px;
      font-size: 15px;
    }

    .construction-slots {
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }

    .construction-slot {
      min-height: 66px;
    }

    .digit-slots {
      gap: 5px;
    }

    .digit-slots button {
      width: 48px;
      height: 51px;
      font-size: 21px;
    }

    .keypad {
      gap: 5px;
    }

    .keypad button {
      min-height: 44px;
    }

    .matching-board {
      grid-template-columns: 1fr 28px 1fr;
      gap: 5px;
    }

    .matching-column button {
      min-height: 56px;
      padding: 7px;
      font-size: 9px;
    }

    .right-column button {
      font-size: 12px;
    }

    .warehouse-boxes {
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
    }

    .warehouse-boxes span {
      min-height: 42px;
    }

    .input-row {
      grid-template-columns: 1fr;
    }

    .summary-correction {
      min-height: 125px;
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .summary-parts {
      order: 2;
    }

    .summary-answer {
      order: 3;
      text-align: center;
    }

    .rule-grid {
      grid-template-columns: 1fr;
      gap: 6px;
    }

    .rule-grid > div {
      min-height: 50px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lesson-root *,
    .lesson-root *::before,
    .lesson-root *::after {
      animation-duration: .01ms !important;
      animation-delay: 0ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      scroll-behavior: auto !important;
    }

    .place-cards > div,
    .expanded-part,
    .expanded-sum,
    .sensor-bay,
    .factory-counter,
    .conveyor-multiplier,
    .carry-transfer,
    .checkpoint-carry,
    .checkpoint-output,
    .exchange-result,
    .exchange-total,
    .zero-equation,
    .zero-final,
    .strategy-proof,
    .estimate-band,
    .summary-parts,
    .summary-answer {
      opacity: 1 !important;
      transform: none !important;
    }

    .place-conveyor-svg.multiplier-docked .conveyor-multiplier {
      transform: translateX(388px) !important;
    }

    .zero-checkpoint-svg.accepts-carry .checkpoint-carry {
      transform: translateX(180px) !important;
    }
  }
`;
