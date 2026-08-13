import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

// 4-sinf, 8-dars: Ko'p xonali sonlarni qo'shish va ayirish.
// Dars01 metodik yoyiga mos, LMS uchun self-contained nazariy dars.

const B = (uz, ru, en) => ({ uz, ru, en });
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');

const T = {
  bg: '#F5F5F0',
  paper: '#FFFFFF',
  ink: '#12212C',
  ink2: '#4E606C',
  ink3: '#82919A',
  navy: '#173B52',
  cyan: '#168FA3',
  cyanSoft: '#E4F5F6',
  blue: '#019ACB',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  lime: '#95C93D',
  success: '#247553',
  successSoft: '#E7F4EC',
  warn: '#A96F13',
  warnSoft: '#FFF4D8',
  danger: '#B85C32',
  shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 16;
const LESSON_META = {
  lessonId: 'num-4-08-v1',
  lessonTitle: B(
    "8-dars. Ko'p xonali sonlarni qo'shish va ayirish",
    'Урок 8. Сложение и вычитание многозначных чисел',
    'Lesson 8. Adding and subtracting multi-digit numbers',
  ),
  skillTags: ['column_addition', 'column_subtraction', 'regrouping', 'zero_chain', 'inverse_check'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'diagnostic-choice', template: 'MCScreen', active: true, goal: 'align-by-ones', misconceptions: ['left-alignment'], scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'exploration', subtype: 'foundation-review', template: 'ReasoningRounds', active: true, goal: 'restore-place-value-exchange', misconceptions: ['place-label-confusion'], scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'step-by-step', template: 'AnimatedExplanation', active: true, goal: 'model-to-column-alignment', misconceptions: ['left-alignment'], scored: false, scope: null },
  { id: 's3', type: 'exploration', subtype: 'step-by-step', template: 'AnimatedExplanation', active: true, goal: 'add-without-regrouping', misconceptions: ['calculate-from-left'], scored: false, scope: null },
  { id: 's4', type: 'exploration', subtype: 'step-by-step', template: 'AnimatedExplanation', active: true, goal: 'add-with-regrouping', misconceptions: ['write-two-digits-in-cell', 'forget-carry'], scored: false, scope: null },
  { id: 's5', type: 'practice', subtype: 'digit-carry-builder', template: 'ColumnConstruction', active: true, goal: 'guided-addition', misconceptions: ['forget-carry'], scored: false, scope: null },
  { id: 's6', type: 'exploration', subtype: 'reasoning', template: 'ReasoningRounds', active: true, goal: 'repair-addition-errors', misconceptions: ['write-two-digits-in-cell', 'forget-carry'], scored: false, scope: null },
  { id: 's7', type: 'exploration', subtype: 'step-by-step', template: 'AnimatedExplanation', active: true, goal: 'subtract-without-exchange', misconceptions: ['subtract-smaller-from-larger-digit'], scored: false, scope: null },
  { id: 's8', type: 'exploration', subtype: 'step-by-step', template: 'AnimatedExplanation', active: true, goal: 'subtract-with-exchange', misconceptions: ['donor-not-reduced'], scored: false, scope: null },
  { id: 's9', type: 'exploration', subtype: 'zero-chain-reasoning', template: 'ReasoningRounds', active: true, goal: 'exchange-through-zeroes', misconceptions: ['borrow-directly-from-zero', 'lose-intermediate-nines'], scored: false, scope: null },
  { id: 's10', type: 'rule', subtype: 'rule-builder', template: 'RuleBuilder', active: true, goal: 'assemble-algorithm', misconceptions: ['unordered-algorithm'], scored: false, scope: null },
  { id: 's11', type: 'test', subtype: 'rapid-console', template: 'RapidTestConsole', active: true, goal: 'four-first-try-checks', misconceptions: ['left-alignment', 'forget-carry', 'borrow-directly-from-zero', 'lose-intermediate-nines'], scored: true, scope: 'final', scoreUnits: 4 },
  { id: 's12', type: 'practice', subtype: 'matching-strategy', template: 'MatchingBoard', active: true, goal: 'estimate-and-inverse-check', misconceptions: ['estimate-as-exact-answer', 'wrong-inverse'], scored: false, scope: null },
  { id: 's13', type: 'case', subtype: 'guided-transfer', template: 'ReasoningRounds', active: true, goal: 'library-addition-transfer', misconceptions: ['wrong-operation', 'forget-carry'], scored: false, scope: null },
  { id: 's14', type: 'case', subtype: 'independent-transfer', template: 'ReasoningRounds', active: true, goal: 'library-subtraction-transfer', misconceptions: ['borrow-directly-from-zero', 'wrong-inverse'], scored: false, scope: null },
  { id: 's15', type: 'summary', subtype: 'claim-title', template: 'custom', active: true, goal: 'reflect-and-finish', misconceptions: [], scored: false, scope: null },
];

let runtimeConfig = {
  ttsApiBase: '',
  voiceGender: 'f',
  correctSoundUrl: '',
  wrongSoundUrl: '',
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
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? value.uz ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  ));
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, [breakpoint]);
  return mobile;
}

const L = (uz, ru, en) => ({ uz, ru, en });
const Y = L('Yechim', 'Решение', 'Solution');

const CONTENT = {
  s0: {
    eyebrow: L('Yangi missiya', 'Новая миссия', 'New mission'),
    topic: L("8-dars. Ko'p xonali sonlarni qo'shish va ayirish", 'Урок 8. Сложение и вычитание многозначных чисел', 'Lesson 8. Adding and subtracting multi-digit numbers'),
    title: L('Kutubxona hisobini tiklaymiz', 'Восстановим расчёт библиотеки', 'Restore the library calculation'),
    lead: L("Kutubxonada 72 384 ta kitob bor edi. Yana 8 596 ta kitob keldi. Bit sonlarni ustun usulida yozishi kerak.", 'В библиотеке было 72 384 книги. Поступило ещё 8 596 книг. Биту нужно записать числа столбиком.', 'The library had 72,384 books. Another 8,596 books arrived. Bit needs to use the column method.'),
    question: L("Bit sonlarni ustun qilib qo'shmoqchi. U sonlarni to'g'ri joylashtira oldimi?", 'Бит хочет сложить числа столбиком. Правильно ли он расположил числа?', 'Bit wants to add the numbers using the column method. Has he aligned them correctly?'),
    options: [
      L("Yo'q, sonlar chapdan tekislangan.", 'Нет, числа выровнены слева.', 'No, the numbers are aligned on the left.'),
      L("Ha, sonlar o'ngdan tekislanishi kerak.", 'Да, числа нужно выровнять справа.', 'Yes, the numbers should be aligned on the right.'),
    ],
    correctIndex: 1,
    correctText: L("To'g'ri. Bit sonlarni o'ngdan tekisladi: birlar birlar ostida turibdi.", 'Верно. Бит выровнял числа справа: единицы стоят под единицами.', 'Correct. Bit aligned the numbers on the right: the ones are under the ones.'),
    wrong: [
      L("Sonlar chapdan emas, o'ngdan tekislangan. 8 596 sonidagi 6 birlik 72 384 sonidagi 4 birlik ostida turibdi.", 'Числа выровнены не слева, а справа. 6 единиц числа 8 596 стоят под 4 единицами числа 72 384.', 'The numbers are aligned on the right, not the left. The 6 ones in 8,596 are under the 4 ones in 72,384.'),
      null,
    ],
    wrongAudio: [
      L("Sonlar chapdan emas, o'ngdan tekislangan. Sakkiz ming besh yuz to'qson olti sonidagi olti birlik yetmish ikki ming uch yuz sakson to'rt sonidagi to'rt birlik ostida turibdi.", 'Числа выровнены не слева, а справа. Шесть единиц числа восемь тысяч пятьсот девяносто шесть стоят под четырьмя единицами числа семьдесят две тысячи триста восемьдесят четыре.', 'The numbers are aligned on the right, not the left. The six ones in eight thousand five hundred and ninety-six are under the four ones in seventy-two thousand three hundred and eighty-four.'),
      null,
    ],
    solution: { title: Y, steps: [
      L("8 596 sonining oxirgi raqami 6 birlikni bildiradi.", 'Последняя цифра числа 8 596 показывает 6 единиц.', 'The final digit of 8,596 represents 6 ones.'),
      L("6 raqami 72 384 sonidagi 4 birlik ostiga yoziladi.", 'Цифру 6 записываем под 4 единицами числа 72 384.', 'Write the digit 6 under the 4 ones in 72,384.'),
    ]},
    audio: {
      intro: L("Lumo City kutubxonasida yetmish ikki ming uch yuz sakson to'rtta kitob bor edi. Yana sakkiz ming besh yuz to'qson oltita kitob keldi. Bit sonlarni ustun qilib qo'shmoqchi. U sonlarni to'g'ri joylashtira oldimi?", 'В библиотеке Lumo City было семьдесят две тысячи триста восемьдесят четыре книги. Поступило ещё восемь тысяч пятьсот девяносто шесть книг. Бит хочет сложить числа столбиком. Правильно ли он расположил числа?', 'The Lumo City library had seventy-two thousand three hundred and eighty-four books. Another eight thousand five hundred and ninety-six books arrived. Bit wants to add the numbers using the column method. Has he aligned them correctly?'),
      on_correct: L("To'g'ri. Bit sonlarni o'ngdan tekisladi. Birlar birlar ostida turibdi.", 'Верно. Бит выровнял числа справа. Единицы стоят под единицами.', 'Correct. Bit aligned the numbers on the right. The ones are under the ones.'),
      on_wrong: L("Sonlar chapdan emas, o'ngdan tekislangan. Birliklar bir chiziqda turibdi.", 'Числа выровнены не слева, а справа. Единицы стоят на одной линии.', 'The numbers are aligned on the right, not the left. The ones are in the same column.'),
    },
  },

  s1: {
    eyebrow: L('Tayanchni eslaymiz', 'Вспоминаем опору', 'Recall the foundation'),
    title: L('Uchta qisqa tekshiruv', 'Три короткие проверки', 'Three quick checks'),
    rounds: [
      { id: 'place', question: L("4 862 sonida 6 raqami qaysi xonada turibdi?", 'В каком разряде стоит цифра 6 в числе 4 862?', 'Which place is the digit 6 in within 4,862?'), options: [L("o'nlar", 'десятки', 'tens'), L('yuzlar', 'сотни', 'hundreds'), L('birlar', 'единицы', 'ones')], correctIndex: 0, wrong: [null, L("6 o'ngdan ikkinchi turibdi, shuning uchun u yuzlik emas, o'nlik.", 'Цифра 6 стоит второй справа, поэтому это не сотни, а десятки.', 'The digit 6 is second from the right, so it is in the tens, not the hundreds.'), L("Birlar xonasida eng o'ngdagi 2 turibdi. Uning chapidagi 6 o'nlikni bildiradi.", 'В разряде единиц стоит крайняя правая цифра 2. Цифра 6 слева от неё обозначает десятки.', 'The far-right digit 2 is in the ones place. The 6 to its left represents tens.')], wrongAudio: [null, L("Olti o'ngdan ikkinchi turibdi, shuning uchun u yuzlik emas, o'nlik.", 'Цифра шесть стоит второй справа, поэтому это не сотни, а десятки.', 'The digit six is second from the right, so it is in the tens, not the hundreds.'), L("Birlar xonasida eng o'ngdagi ikki turibdi. Uning chapidagi olti o'nlikni bildiradi.", 'В разряде единиц стоит крайняя правая цифра два. Цифра шесть слева от неё обозначает десятки.', 'The far-right digit two is in the ones place. The six to its left represents tens.')], correctAudio: L("To'g'ri. Olti o'ngdan ikkinchi raqam, demak u o'nlar xonasida.", 'Верно. Цифра шесть стоит второй справа, значит, она находится в разряде десятков.', 'Correct. Six is the second digit from the right, so it is in the tens place.') },
      { id: 'exchange', question: L('10 birlik nimaga teng?', 'Чему равны 10 единиц?', 'What are 10 ones equal to?'), options: [L("1 o'nlik", '1 десяток', '1 ten'), L("10 o'nlik", '10 десятков', '10 tens'), L('1 yuzlik', '1 сотня', '1 hundred')], correctIndex: 0, wrong: [null, L("10 birlikni yiriklashtirsak, 10 o'nlik emas, 1 o'nlik hosil bo'ladi.", 'При укрупнении 10 единиц получаем не 10 десятков, а 1 десяток.', 'Regrouping 10 ones makes 1 ten, not 10 tens.'), L("1 yuzlik uchun 100 birlik kerak. 10 birlik faqat 1 o'nlikni beradi.", 'Для 1 сотни нужны 100 единиц. 10 единиц дают только 1 десяток.', 'One hundred needs 100 ones. Ten ones make only 1 ten.')], wrongAudio: [null, L("O'nta birlikni yiriklashtirsak, o'nta o'nlik emas, bitta o'nlik hosil bo'ladi.", 'При укрупнении десяти единиц получаем не десять десятков, а один десяток.', 'Regrouping ten ones makes one ten, not ten tens.'), L("Bitta yuzlik uchun yuzta birlik kerak. O'nta birlik faqat bitta o'nlikni beradi.", 'Для одной сотни нужны сто единиц. Десять единиц дают только один десяток.', 'One hundred needs one hundred ones. Ten ones make only one ten.')], correctAudio: L("To'g'ri. O'nta birlikni yiriklashtirsak, bitta o'nlik hosil bo'ladi.", 'Верно. Десять единиц укрупняются в один десяток.', 'Correct. Ten ones regroup as one ten.') },
      { id: 'align', question: L('205 sonini 4 731 ostiga qanday joylashtiramiz?', 'Как разместить число 205 под числом 4 731?', 'How should 205 be placed under 4,731?'), options: [L('5 ni 1 birligi ostiga', '5 под 1 единицей', '5 under the 1 one'), L('2 ni 4 mingligi ostiga', '2 под 4 тысячами', '2 under the 4 thousands'), L('0 ni 1 birligi ostiga', '0 под 1 единицей', '0 under the 1 one')], correctIndex: 0, wrong: [null, L("205 dagi 2 yuzlikni bildiradi. Uni 4 minglik ostiga emas, 7 yuzlik ostiga yozamiz.", 'Цифра 2 в числе 205 обозначает сотни. Её ставим под 7 сотнями, а не под 4 тысячами.', 'The 2 in 205 represents hundreds. Put it under the 7 hundreds, not under the 4 thousands.'), L("205 dagi 0 o'nlikni bildiradi. U 1 birlik ostiga emas, 3 o'nlik ostiga tushadi.", 'Цифра 0 в числе 205 обозначает десятки. Она стоит под 3 десятками, а не под 1 единицей.', 'The 0 in 205 represents tens. It goes under the 3 tens, not under the 1 one.')], wrongAudio: [null, L("Ikki yuzlikni bildiradi. Uni to'rt minglik ostiga emas, yetti yuzlik ostiga yozamiz.", 'Два обозначает сотни. Его ставим под семью сотнями, а не под четырьмя тысячами.', 'Two represents hundreds. Put it under the seven hundreds, not under the four thousands.'), L("Nol o'nlikni bildiradi. U bir birlik ostiga emas, uch o'nlik ostiga tushadi.", 'Ноль обозначает десятки. Он стоит под тремя десятками, а не под одной единицей.', 'Zero represents tens. It goes under the three tens, not under the one.')], correctAudio: L("To'g'ri. Ikki yuz besh sonining besh birligi to'rt ming yetti yuz o'ttiz bir sonining bir birligi ostida turadi.", 'Верно. Пять единиц числа двести пять стоят под одной единицей числа четыре тысячи семьсот тридцать один.', 'Correct. The five ones in two hundred and five sit under the one in four thousand seven hundred and thirty-one.') },
    ],
    correctText: L("To'g'ri. Xona qiymati va 10 dan 1 ga almashtirish tiklandi.", 'Верно. Разрядные значения и обмен десяти единиц на одну восстановлены.', 'Correct. Place value and the ten-to-one exchange are restored.'),
    wrongText: L("Xonalarni o'ngdan sanang va 10 ta kichik xona birligi keyingi xonaning 1 birligini berishini eslang.", 'Считай разряды справа и вспомни, что 10 единиц одного разряда дают 1 единицу следующего.', 'Count places from the right and recall that 10 units of one place make 1 unit of the next.'),
    solution: { title: Y, steps: [L("Xonalar o'ngdan boshlanadi: birlar, o'nlar, yuzlar.", 'Разряды начинаются справа: единицы, десятки, сотни.', 'Places begin on the right: ones, tens, hundreds.'), L("10 birlik = 1 o'nlik.", '10 единиц = 1 десяток.', '10 ones = 1 ten.'), L('Ustun yozuvida birlar birlar ostida turadi.', 'В записи столбиком единицы стоят под единицами.', 'In the column method, ones are placed under ones.')]},
    audio: {
      intro: L("Xona qiymati va almashtirishni uch qadamda eslang. Xonalarni o'ngdan sanang, o'nta birlikni bitta o'nlikka almashtiring va sonlarni birlar bo'yicha tekislang.", 'Вспомни разрядные значения и обмен за три шага. Считай разряды справа, обмени десять единиц на один десяток и выровняй числа по единицам.', 'Recall place value and exchange in three steps. Count places from the right, exchange ten ones for one ten, and align the numbers by their ones places.'),
      on_correct: L("To'g'ri. Kerakli tayanch tiklandi.", 'Верно. Нужная опора восстановлена.', 'Correct. The required foundation is restored.'),
      on_wrong: L("Eng o'ngdagi raqamdan boshlab xona qiymatini tekshiring.", 'Проверь разрядное значение, начиная с крайней правой цифры.', 'Check place value starting with the digit on the far right.'),
    },
  },

  s2: {
    eyebrow: L('Tushuntirish · 1-qadam', 'Объяснение · шаг 1', 'Explanation · step 1'),
    title: L('32 415 va 6 203 ni tekislaymiz', 'Выравниваем 32 415 и 6 203', 'Align 32,415 and 6,203'),
    lead: L("6 203 sonining raqamlarini o'z xonalariga joylashtiring.", 'Помести цифры числа 6 203 в их разряды.', 'Place the digits of 6,203 into their correct places.'),
    steps: [
      { place: 'ones', prompt: L("3 raqamini qayerga qo'yamiz?", 'Куда поместить цифру 3?', 'Where should the digit 3 go?'), result: L('3 birligi 5 birligi ostida.', '3 единицы под 5 единицами.', '3 ones under 5 ones.') },
      { place: 'tens', prompt: L("0 raqamini qayerga qo'yamiz?", 'Куда поместить цифру 0?', 'Where should the digit 0 go?'), result: L("0 o'nligi 1 o'nligi ostida.", '0 десятков под 1 десятком.', '0 tens under 1 ten.') },
      { place: 'hundreds', prompt: L("2 raqamini qayerga qo'yamiz?", 'Куда поместить цифру 2?', 'Where should the digit 2 go?'), result: L('2 yuzligi 4 yuzligi ostida.', '2 сотни под 4 сотнями.', '2 hundreds under 4 hundreds.') },
      { place: 'thousands', prompt: L("6 raqamini qayerga qo'yamiz?", 'Куда поместить цифру 6?', 'Where should the digit 6 go?'), result: L('6 mingligi 2 mingligi ostida.', '6 тысяч под 2 тысячами.', '6 thousands under 2 thousands.') },
    ],
    doneText: L("6 203 sonida o'n minglik yo'q. Uning katagi bo'sh qoladi.", 'В числе 6 203 нет десятков тысяч. Соответствующая клетка остаётся пустой.', 'There are no ten-thousands in 6,203, so that box stays empty.'),
    solution: { title: Y, steps: [L("Eng o'ngdagi 3 raqami birliklarni bildiradi.", 'Крайняя правая цифра 3 показывает единицы.', 'The digit 3 on the far right represents ones.'), L("Keyingi raqamlar o'ngdan chapga o'nlar, yuzlar va minglar xonalariga joylashadi.", 'Следующие цифры справа налево занимают десятки, сотни и тысячи.', 'The next digits from right to left occupy the tens, hundreds and thousands places.')]},
    audio: {
      uz: [
        "O'ttiz ikki ming to'rt yuz o'n beshga olti ming ikki yuz uchni qo'shish uchun sonlarni xona bo'yicha tekislaymiz.",
        "Uch birlikni besh birlik ostiga qo'ying.",
        "Nol o'nlikni bir o'nlik ostiga qo'ying.",
        "Ikki yuzlikni to'rt yuzlik ostiga qo'ying.",
        "Olti minglikni ikki minglik ostiga qo'ying. O'n minglik katagi bo'sh qoladi.",
      ],
      ru: [
        'Чтобы сложить тридцать две тысячи четыреста пятнадцать и шесть тысяч двести три, выровняем числа по разрядам.',
        'Помести три единицы под пять единиц.',
        'Помести ноль десятков под один десяток.',
        'Помести две сотни под четыре сотни.',
        'Помести шесть тысяч под две тысячи. Клетка десятков тысяч остаётся пустой.',
      ],
      en: [
        'To add thirty-two thousand four hundred and fifteen and six thousand two hundred and three, align the numbers by place value.',
        'Place three ones under five ones.',
        'Place zero tens under one ten.',
        'Place two hundreds under four hundreds.',
        'Place six thousands under two thousands. The ten-thousands box stays empty.',
      ],
    },
  },

  s3: {
    eyebrow: L('Tushuntirish · 2-qadam', 'Объяснение · шаг 2', 'Explanation · step 2'),
    title: L("Almashtirishsiz qo'shish", 'Сложение без укрупнения', 'Addition without regrouping'),
    expression: '32 415 + 6 203',
    rounds: [
      { place: 'ones', expression: '5 + 3', options: ['8', '2', '5'], correctIndex: 0 },
      { place: 'tens', expression: '1 + 0', options: ['1', '4', '0'], correctIndex: 0 },
      { place: 'hundreds', expression: '4 + 2', options: ['6', '2', '4'], correctIndex: 0 },
      { place: 'thousands', expression: '2 + 6', options: ['8', '6', '2'], correctIndex: 0 },
      { place: 'tenThousands', expression: '3 + 0', options: ['3', '9', '0'], correctIndex: 0 },
    ],
    correctText: L("To'g'ri. Faol ustun aniq hisoblandi.", 'Верно. Активный столбец вычислен точно.', 'Correct. The active column has been calculated accurately.'),
    wrongText: L("Faqat faol ustundagi raqamlarni qo'shing.", 'Складывай только цифры активного столбца.', 'Add only the digits in the active column.'),
    resultText: L('32 415 + 6 203 = 38 618', '32 415 + 6 203 = 38 618', '32,415 + 6,203 = 38,618'),
    solution: { title: Y, steps: [L('5 + 3 = 8 birlik.', '5 + 3 = 8 единиц.', '5 + 3 = 8 ones.'), L("1 + 0 = 1 o'nlik; 4 + 2 = 6 yuzlik.", '1 + 0 = 1 десяток; 4 + 2 = 6 сотен.', '1 + 0 = 1 ten; 4 + 2 = 6 hundreds.'), L("2 + 6 = 8 minglik; 3 + 0 = 3 o'n minglik.", '2 + 6 = 8 тысяч; 3 + 0 = 3 десятка тысяч.', '2 + 6 = 8 thousands; 3 + 0 = 3 ten-thousands.')]},
    audio: {
      uz: ['Hisoblashni birlar xonasidan boshlang.', "Besh birlik va uch birlik sakkiz birlik bo'ladi.", "Bir o'nlik va nol o'nlik bir o'nlik bo'ladi.", "To'rt yuzlik va ikki yuzlik olti yuzlik bo'ladi.", "Ikki minglik va olti minglik sakkiz minglik bo'ladi.", "Uch o'n minglik va nol o'n minglik uch o'n minglik bo'ladi.", "Natija o'ttiz sakkiz ming olti yuz o'n sakkiz."],
      ru: ['Начинай вычисление с единиц.', 'Пять единиц плюс три единицы дают восемь.', 'Один десяток плюс ноль десятков дают один десяток.', 'Четыре сотни плюс две сотни дают шесть сотен.', 'Две тысячи плюс шесть тысяч дают восемь тысяч.', 'Три десятка тысяч плюс ноль десятков тысяч дают три десятка тысяч.', 'Результат: тридцать восемь тысяч шестьсот восемнадцать.'],
      en: ['Start calculating in the ones place.', 'Five ones plus three ones make eight ones.', 'One ten plus zero tens makes one ten.', 'Four hundreds plus two hundreds make six hundreds.', 'Two thousands plus six thousands make eight thousands.', 'Three ten-thousands plus zero ten-thousands make three ten-thousands.', 'The result is thirty-eight thousand six hundred and eighteen.'],
    },
  },

  s4: {
    eyebrow: L('Tushuntirish · 3-qadam', 'Объяснение · шаг 3', 'Explanation · step 3'),
    title: L("Qo'shishda yiriklashtirish", 'Укрупнение при сложении', 'Regrouping in addition'),
    expression: '28 467 + 15 785',
    instruction: L("Har bir yiriklashtirishni ketma-ket oching.", 'Открывай каждое укрупнение по порядку.', 'Reveal each regrouping step in order.'),
    steps: [
      { place: 'ones', expression: '7 + 5 = 12', action: L("2 birlikni yozamiz, 1 o'nlikni ko'chiramiz.", 'Записываем 2 единицы, переносим 1 десяток.', 'Write 2 ones and carry 1 ten.') },
      { place: 'tens', expression: '6 + 8 + 1 = 15', action: L("5 o'nlikni yozamiz, 1 yuzlikni ko'chiramiz.", 'Записываем 5 десятков, переносим 1 сотню.', 'Write 5 tens and carry 1 hundred.') },
      { place: 'hundreds', expression: '4 + 7 + 1 = 12', action: L("2 yuzlikni yozamiz, 1 minglikni ko'chiramiz.", 'Записываем 2 сотни, переносим 1 тысячу.', 'Write 2 hundreds and carry 1 thousand.') },
      { place: 'thousands', expression: '8 + 5 + 1 = 14', action: L("4 minglikni yozamiz, 1 o'n minglikni ko'chiramiz.", 'Записываем 4 тысячи, переносим 1 десяток тысяч.', 'Write 4 thousands and carry 1 ten-thousand.') },
      { place: 'tenThousands', expression: '2 + 1 + 1 = 4', action: L("4 o'n minglikni yozamiz.", 'Записываем 4 десятка тысяч.', 'Write 4 ten-thousands.') },
    ],
    resultText: L('28 467 + 15 785 = 44 252', '28 467 + 15 785 = 44 252', '28,467 + 15,785 = 44,252'),
    solution: { title: Y, steps: [L("12 birlik = 1 o'nlik + 2 birlik.", '12 единиц = 1 десяток + 2 единицы.', '12 ones = 1 ten + 2 ones.'), L("Ko'chgan 1 keyingi ustundagi yig'indiga qo'shiladi.", 'Перенесённая единица добавляется к сумме следующего столбца.', 'The carried unit is added to the sum in the next column.'), L("Natija 44 252.", 'Результат: 44 252.', 'The result is 44,252.')]},
    audio: {
      uz: [
        "Yigirma sakkiz ming to'rt yuz oltmish yettiga o'n besh ming yetti yuz sakson beshni qo'shamiz.",
        "Yetti birlik va besh birlik o'n ikki birlik bo'ladi. Ikki birlikni yozib, bir o'nlikni ko'chiramiz.",
        "Olti o'nlik, sakkiz o'nlik va ko'chgan bir o'nlik jami o'n besh o'nlik bo'ladi. Besh o'nlikni yozib, bir yuzlikni ko'chiramiz.",
        "To'rt yuzlik, yetti yuzlik va ko'chgan bir yuzlik jami o'n ikki yuzlik bo'ladi. Ikki yuzlikni yozib, bir minglikni ko'chiramiz.",
        "Sakkiz minglik, besh minglik va ko'chgan bir minglik jami o'n to'rt minglik bo'ladi. To'rt minglikni yozib, bir o'n minglikni ko'chiramiz.",
        "Ikki o'n minglik, bir o'n minglik va ko'chgan bir o'n minglik jami to'rt o'n minglik bo'ladi.",
        "Natija qirq to'rt ming ikki yuz ellik ikki.",
      ],
      ru: [
        'Складываем двадцать восемь тысяч четыреста шестьдесят семь и пятнадцать тысяч семьсот восемьдесят пять.',
        'Семь единиц плюс пять единиц дают двенадцать. Записываем две единицы и переносим один десяток.',
        'Шесть десятков плюс восемь десятков и один перенесённый десяток дают пятнадцать десятков. Записываем пять десятков и переносим одну сотню.',
        'Четыре сотни плюс семь сотен и одна перенесённая сотня дают двенадцать сотен. Записываем две сотни и переносим одну тысячу.',
        'Восемь тысяч плюс пять тысяч и одна перенесённая тысяча дают четырнадцать тысяч. Записываем четыре тысячи и переносим один десяток тысяч.',
        'Два десятка тысяч плюс один десяток тысяч и один перенесённый десяток тысяч дают четыре десятка тысяч.',
        'Результат: сорок четыре тысячи двести пятьдесят два.',
      ],
      en: [
        'Add twenty-eight thousand four hundred and sixty-seven and fifteen thousand seven hundred and eighty-five.',
        'Seven ones plus five ones make twelve ones. Write two ones and carry one ten.',
        'Six tens plus eight tens plus the carried ten make fifteen tens. Write five tens and carry one hundred.',
        'Four hundreds plus seven hundreds plus the carried hundred make twelve hundreds. Write two hundreds and carry one thousand.',
        'Eight thousands plus five thousands plus the carried thousand make fourteen thousands. Write four thousands and carry one ten-thousand.',
        'Two ten-thousands plus one ten-thousand plus the carried ten-thousand make four ten-thousands.',
        'The result is forty-four thousand two hundred and fifty-two.',
      ],
    },
  },

  s5: {
    eyebrow: L('Birga ishlaymiz', 'Решаем вместе', 'Work together'),
    title: L('63 708 + 8 596 natijasini tuzing', 'Составь результат 63 708 + 8 596', 'Build the result of 63,708 + 8,596'),
    instruction: L("Har bosqichda natija raqami va keyingi xonaga ko'chadigan raqamni kiriting.", 'На каждом шаге введи цифру ответа и перенос в следующий разряд.', 'At each step, enter the answer digit and the carry to the next place.'),
    rounds: [
      { place: 'ones', expression: '8 + 6 = 14', expectedDigit: 4, expectedCarry: 1 },
      { place: 'tens', expression: '0 + 9 + 1 = 10', expectedDigit: 0, expectedCarry: 1 },
      { place: 'hundreds', expression: '7 + 5 + 1 = 13', expectedDigit: 3, expectedCarry: 1 },
      { place: 'thousands', expression: '3 + 8 + 1 = 12', expectedDigit: 2, expectedCarry: 1 },
      { place: 'tenThousands', expression: '6 + 0 + 1 = 7', expectedDigit: 7, expectedCarry: 0 },
    ],
    correctText: L("To'g'ri. Yoziladigan raqam ustunda qoldi, ko'chirish keyingi xonaga o'tdi.", 'Верно. Записываемая цифра осталась в столбце, перенос перешёл в следующий разряд.', 'Correct. The answer digit stays in the column and the carry moves to the next place.'),
    wrongDigitText: L("Yig'indining birlik raqamini shu ustunga yozing.", 'Запиши в этот столбец цифру единиц суммы.', 'Write the ones digit of the column sum here.'),
    wrongCarryText: L("Yig'indi 10 yoki undan katta bo'lsa, 1 keyingi xonaga ko'chadi.", 'Если сумма равна десяти или больше, перенеси 1 в следующий разряд.', 'If the sum is ten or more, carry 1 to the next place.'),
    resultText: L('63 708 + 8 596 = 72 304', '63 708 + 8 596 = 72 304', '63,708 + 8,596 = 72,304'),
    solution: { title: Y, steps: [L("Birlar: 8 + 6 = 14. 4 ni yozamiz, 1 ni ko'chiramiz.", 'Единицы: 8 + 6 = 14. Пишем 4, переносим 1.', 'Ones: 8 + 6 = 14. Write 4 and carry 1.'), L("O'nlar: 0 + 9 + 1 = 10. 0 ni yozamiz, 1 ni ko'chiramiz.", 'Десятки: 0 + 9 + 1 = 10. Пишем 0, переносим 1.', 'Tens: 0 + 9 + 1 = 10. Write 0 and carry 1.'), L("Yuzlar: 7 + 5 + 1 = 13. 3 ni yozamiz, 1 minglikni ko'chiramiz.", 'Сотни: 7 + 5 + 1 = 13. Пишем 3 и переносим 1 тысячу.', 'Hundreds: 7 + 5 + 1 = 13. Write 3 and carry 1 thousand.'), L("Minglar: 3 + 8 + 1 = 12. 2 ni yozamiz, 1 o'n minglikni ko'chiramiz.", 'Тысячи: 3 + 8 + 1 = 12. Пишем 2 и переносим 1 десяток тысяч.', 'Thousands: 3 + 8 + 1 = 12. Write 2 and carry 1 ten-thousand.'), L("O'n minglar: 6 + 0 + 1 = 7. Natija 72 304.", 'Десятки тысяч: 6 + 0 + 1 = 7. Результат: 72 304.', 'Ten-thousands: 6 + 0 + 1 = 7. The result is 72,304.')]},
    audio: {
      intro: L("Oltmish uch ming yetti yuz sakkizga sakkiz ming besh yuz to'qson oltini qo'shing. Birliklardan boshlang va ko'chirishlarni alohida ko'rsating.", 'Сложи шестьдесят три тысячи семьсот восемь и восемь тысяч пятьсот девяносто шесть. Начинай с единиц и отдельно указывай переносы.', 'Add sixty-three thousand seven hundred and eight and eight thousand five hundred and ninety-six. Start with the ones and enter each carry separately.'),
      steps: {
        uz: ["Sakkiz birlik va olti birlik o'n to'rt birlik bo'ladi. To'rt birlikni yozing, bir o'nlikni ko'chiring.", "Nol o'nlik, to'qqiz o'nlik va ko'chgan bir o'nlik jami o'n o'nlik bo'ladi. Nol o'nlikni yozing, bir yuzlikni ko'chiring.", "Yetti yuzlik, besh yuzlik va ko'chgan bir yuzlik jami o'n uch yuzlik bo'ladi. Uch yuzlikni yozing, bir minglikni ko'chiring.", "Uch minglik, sakkiz minglik va ko'chgan bir minglik jami o'n ikki minglik bo'ladi. Ikki minglikni yozing, bir o'n minglikni ko'chiring.", "Olti o'n minglik, nol o'n minglik va ko'chgan bir o'n minglik jami yetti o'n minglik bo'ladi. Yetti o'n minglikni yozing. Bu safar ko'chirish yo'q."],
        ru: ['Восемь единиц плюс шесть единиц дают четырнадцать единиц. Запиши четыре единицы и перенеси один десяток.', 'Ноль десятков плюс девять десятков и один перенесённый десяток дают десять десятков. Запиши ноль десятков и перенеси одну сотню.', 'Семь сотен плюс пять сотен и одна перенесённая сотня дают тринадцать сотен. Запиши три сотни и перенеси одну тысячу.', 'Три тысячи плюс восемь тысяч и одна перенесённая тысяча дают двенадцать тысяч. Запиши две тысячи и перенеси один десяток тысяч.', 'Шесть десятков тысяч плюс ноль десятков тысяч и один перенесённый десяток тысяч дают семь десятков тысяч. Запиши семь десятков тысяч. Переноса больше нет.'],
        en: ['Eight ones plus six ones make fourteen ones. Write four ones and carry one ten.', 'Zero tens plus nine tens plus the carried ten make ten tens. Write zero tens and carry one hundred.', 'Seven hundreds plus five hundreds plus the carried hundred make thirteen hundreds. Write three hundreds and carry one thousand.', 'Three thousands plus eight thousands plus the carried thousand make twelve thousands. Write two thousands and carry one ten-thousand.', 'Six ten-thousands plus zero ten-thousands plus the carried ten-thousand make seven ten-thousands. Write seven ten-thousands. There is no carry this time.'],
      },
      wrongDigit: L("Ustunga yig'indining faqat birlik raqamini yozing.", 'Запиши в столбец только цифру единиц суммы.', 'Write only the ones digit of the column sum.'),
      wrongCarry: L("Yig'indi o'n yoki undan katta bo'lsa, keyingi xonaga bir birlik ko'chiring.", 'Если сумма равна десяти или больше, перенеси одну единицу в следующий разряд.', 'If the sum is ten or more, carry one unit to the next place.'),
      on_correct: L("To'g'ri. Ustun raqami va ko'chirish ajratildi.", 'Верно. Цифра столбца и перенос разделены.', 'Correct. The column digit and carry are separated.'),
      on_wrong: L("Yig'indini birlik va o'nlik qismlariga ajrating.", 'Раздели сумму столбца на единицы и десятки.', 'Split the column sum into its ones and tens parts.'),
    },
  },

  s6: {
    eyebrow: L('Bitning xatosi', 'Ошибка Бита', "Bit's error"),
    title: L('Birinchi xatoni toping', 'Найди первую ошибку', 'Find the first error'),
    lead: L("Bitning ikki yechimida ham xato birinchi noto'g'ri qadamdan boshlangan.", 'В двух решениях Бита ошибка начинается с первого неверного шага.', "In both of Bit's solutions, the error begins at the first incorrect step."),
    rounds: [
      {
        id: 'write12',
        bitWork: '7 + 5 = 12 → [12]',
        question: L("Birliklar katagiga nima yoziladi?", 'Что нужно записать в клетку единиц?', 'What should be written in the ones box?'),
        options: [L("2 ni yozib, 1 o'nlikni ko'chirish", 'Записать 2 и перенести 1 десяток', 'Write 2 and carry 1 ten'), L('12 ni bitta katakka yozish', 'Записать 12 в одну клетку', 'Write 12 in one box'), L("1 ni yozib, 2 ni ko'chirish", 'Записать 1 и перенести 2', 'Write 1 and carry 2')],
        correctIndex: 0,
        wrong: [null, L("Bir katakda bitta raqam turadi. 2 birlikni yozing, 1 o'nlikni keyingi ustunga o'tkazing.", 'В одной клетке стоит одна цифра. Запиши 2 единицы, а 1 десяток перенеси.', 'One digit belongs in each box. Write 2 ones and carry 1 ten.'), L("Bu yozuvda birlik va o'nlik raqamlari almashib ketgan. 12 birlikdan 2 birlik yoziladi, 1 o'nlik ko'chiriladi.", 'Здесь цифры единиц и десятков перепутаны. Из 12 единиц записываем 2 единицы и переносим 1 десяток.', 'The ones and tens digits have been reversed. From 12 ones, write 2 ones and carry 1 ten.')],
        wrongAudio: [null, L("Bir katakda bitta raqam turadi. Ikki birlikni yozing, bir o'nlikni keyingi ustunga o'tkazing.", 'В одной клетке стоит одна цифра. Запиши две единицы, а один десяток перенеси.', 'One digit belongs in each box. Write two ones and carry one ten.'), L("Bu yozuvda birlik va o'nlik raqamlari almashib ketgan. O'n ikki birlikdan ikki birlik yoziladi, bir o'nlik ko'chiriladi.", 'Здесь цифры единиц и десятков перепутаны. Из двенадцати единиц записываем две единицы и переносим один десяток.', 'The ones and tens digits have been reversed. From twelve ones, write two ones and carry one ten.')],
      },
      {
        id: 'forgotCarry',
        bitWork: '6 + 8 = 14',
        question: L("Oldingi ustundan 1 o'nlik ko'chgan bo'lsa, yangi yig'indi qancha?", 'Какова новая сумма, если из предыдущего столбца перенесён 1 десяток?', 'What is the new sum if 1 ten was carried from the previous column?'),
        options: ['14', '15', '16'],
        correctIndex: 1,
        wrong: [L("14 faqat ikki asosiy raqam yig'indisi. Ko'chgan 1 o'nlikni ham qo'shing.", '14 — сумма только двух основных цифр. Добавь перенесённый десяток.', 'Fourteen is the sum of the two original digits only. Add the carried ten.'), null, L("16 chiqishi uchun ko'chgan 1 ikki marta qo'shilgan bo'lardi. 6 + 8 = 14; ko'chgan 1 ni faqat bir marta qo'shib, 15 ni olamiz.", 'Чтобы получить 16, перенесённая единица должна быть добавлена дважды. 6 + 8 = 14; добавляем перенос только один раз и получаем 15.', 'A result of 16 would count the carried one twice. 6 + 8 = 14; add the carry once to get 15.')],
        wrongAudio: [L("O'n to'rt faqat ikki asosiy raqam yig'indisi. Ko'chgan bir o'nlikni ham qo'shing.", 'Четырнадцать, это сумма только двух основных цифр. Добавь перенесённый десяток.', 'Fourteen is the sum of the two original digits only. Add the carried ten.'), null, L("O'n olti chiqishi uchun ko'chgan bir ikki marta qo'shilgan bo'lardi. Olti bilan sakkiz o'n to'rt; ko'chgan birni faqat bir marta qo'shib, o'n beshni olamiz.", 'Чтобы получить шестнадцать, перенос должен быть добавлен дважды. Шесть плюс восемь, четырнадцать; добавляем перенос только один раз и получаем пятнадцать.', 'A result of sixteen would count the carried one twice. Six plus eight is fourteen; add the carry once to get fifteen.')],
      },
    ],
    correctText: L("To'g'ri. Birinchi noto'g'ri qadam aniqlandi va tuzatildi.", 'Верно. Первый неверный шаг найден и исправлен.', 'Correct. The first incorrect step has been found and fixed.'),
    wrong: [
      L("Bir katakda bitta raqam turadi. 2 birlikni yozing, 1 o'nlikni keyingi ustunga o'tkazing.", 'В одной клетке стоит одна цифра. Запиши 2 единицы, а 1 десяток перенеси.', 'One digit belongs in each box. Write 2 ones and carry 1 ten.'),
      L("14 faqat ikki asosiy raqam yig'indisi. Ko'chgan 1 o'nlikni ham qo'shing.", '14 — сумма только двух основных цифр. Добавь перенесённый десяток.', 'Fourteen is the sum of the two original digits only. Add the carried ten.'),
    ],
    solution: { title: Y, steps: [L("12 birlikdan 2 birlik yoziladi va 1 o'nlik ko'chiriladi.", 'Из 12 единиц записываются 2 единицы и переносится 1 десяток.', 'From 12 ones, write 2 ones and carry 1 ten.'), L("Keyingi ustunda ko'chgan 1 yig'indiga qo'shiladi.", 'В следующем столбце перенесённая единица добавляется к сумме.', 'The carried unit is added in the next column.')]},
    audio: {
      intro: L("Bitning ikki yechimida ham birinchi noto'g'ri qadamni toping.", 'Найди первый неверный шаг в каждом из двух решений Бита.', "Find the first incorrect step in each of Bit's two solutions."),
      steps: [L("Yetti birlik va besh birlik o'n ikki birlik bo'ladi. Katakka ikki birlik yoziladi, bir o'nlik ko'chiriladi.", 'Семь единиц плюс пять единиц дают двенадцать единиц. В клетку записываются две единицы, а один десяток переносится.', 'Seven ones plus five ones make twelve ones. Write two ones in the box and carry one ten.'), L("Olti o'nlik va sakkiz o'nlik o'n to'rt o'nlik bo'ladi. Ko'chgan bir o'nlikni qo'shsak, o'n besh o'nlik bo'ladi.", 'Шесть десятков плюс восемь десятков дают четырнадцать десятков. С перенесённым десятком получается пятнадцать десятков.', 'Six tens plus eight tens make fourteen tens. Adding the carried ten makes fifteen tens.')],
      on_correct: L("To'g'ri. Birinchi xato tuzatildi.", 'Верно. Первая ошибка исправлена.', 'Correct. The first error has been fixed.'),
      on_wrong: L("Natija katagi bilan ko'chadigan raqamni ajrating.", 'Раздели цифру ответа и перенос.', 'Separate the answer digit from the carry.'),
    },
  },

  s7: {
    eyebrow: L('Tushuntirish · 4-qadam', 'Объяснение · шаг 4', 'Explanation · step 4'),
    title: L('Almashtirishsiz ayirish', 'Вычитание без размена', 'Subtraction without exchanging'),
    story: L('Omborda 15 430 ta kitob bor edi. 3 210 tasi filiallarga berildi.', 'На складе было 15 430 книг. В филиалы передали 3 210 книг.', 'The warehouse held 15,430 books. It sent 3,210 books to the branches.'),
    question: L('Qolgan kitoblar sonini topish uchun qaysi amal kerak?', 'Какое действие нужно, чтобы найти оставшееся количество книг?', 'Which operation finds the number of books remaining?'),
    options: [L('Ayirish', 'Вычитание', 'Subtraction'), L("Qo'shish", 'Сложение', 'Addition'), L('Taqqoslash', 'Сравнение', 'Comparison')],
    correctIndex: 0,
    correctText: L("To'g'ri. Boshlang'ich miqdordan berilgan miqdorni ayiramiz.", 'Верно. Из начального количества вычитаем переданное количество.', 'Correct. Subtract the amount sent from the starting amount.'),
    wrong: [null, L("Qo'shish miqdorni oshiradi. Bu yerda kitoblarning bir qismi chiqib ketgan.", 'Сложение увеличит количество. Здесь часть книг ушла со склада.', 'Addition increases the amount. Here, some books left the warehouse.'), L("Taqqoslash miqdorlarning katta, kichik yoki tengligini bildiradi, lekin aniq qoldiqni hisoblamaydi.", 'Сравнение показывает, какое количество больше, меньше или равно другому, но не вычисляет точный остаток.', 'Comparison shows whether one amount is greater than, less than or equal to another, but it does not calculate the exact remainder.')],
    steps: [L('Birlar ostiga birlar', 'Единицы под единицами', 'Ones under ones'), '0 − 0 = 0', '3 − 1 = 2', '4 − 2 = 2', '5 − 3 = 2', '1 − 0 = 1'],
    resultText: L('15 430 − 3 210 = 12 220', '15 430 − 3 210 = 12 220', '15,430 − 3,210 = 12,220'),
    solution: { title: Y, steps: [L("Sonlarni birlar xonasi bo'yicha tekislaymiz.", 'Выравниваем числа по разряду единиц.', 'Align the numbers by their ones places.'), L('Birliklardan boshlab yuqoridagi raqamdan pastdagi raqamni ayiramiz.', 'Начиная с единиц, вычитаем нижнюю цифру из верхней.', 'Starting with the ones, subtract the lower digit from the upper digit.'), L('Maydalash talab qilinmaydi. Natija 12 220.', 'Размен не требуется. Результат 12 220.', 'No exchange is needed. The result is 12,220.')]},
    audio: {
      intro: L("Omborda o'n besh ming to'rt yuz o'ttizta kitob bor edi. Uch ming ikki yuz o'ntasi berildi. Qoldiqni topadigan amalni tanlang.", 'На складе было пятнадцать тысяч четыреста тридцать книг. Три тысячи двести десять передали. Выбери действие для нахождения остатка.', 'The warehouse held fifteen thousand four hundred and thirty books. Three thousand two hundred and ten were sent away. Choose the operation that finds how many remain.'),
      steps: {
        uz: ["Sonlarni birlar xonasi bo'yicha tekislaymiz.", "Nol birlikdan nol birlikni ayirsak, nol birlik qoladi.", "Uch o'nlikdan bir o'nlikni ayirsak, ikki o'nlik qoladi.", "To'rt yuzlikdan ikki yuzlikni ayirsak, ikki yuzlik qoladi.", "Besh minglikdan uch minglikni ayirsak, ikki minglik qoladi.", "Bir o'n minglikdan nol o'n minglikni ayirsak, bir o'n minglik qoladi. Natija o'n ikki ming ikki yuz yigirma."],
        ru: ['Выравниваем числа по разряду единиц.', 'Из нуля единиц вычитаем ноль единиц, остаётся ноль.', 'Из трёх десятков вычитаем один десяток, остаются два десятка.', 'Из четырёх сотен вычитаем две сотни, остаются две сотни.', 'Из пяти тысяч вычитаем три тысячи, остаются две тысячи.', 'Из одного десятка тысяч вычитаем ноль десятков тысяч, остаётся один десяток тысяч. Результат: двенадцать тысяч двести двадцать.'],
        en: ['Align the numbers by their ones places.', 'Zero ones minus zero ones leaves zero ones.', 'Three tens minus one ten leaves two tens.', 'Four hundreds minus two hundreds leaves two hundreds.', 'Five thousands minus three thousands leaves two thousands.', 'One ten-thousand minus zero ten-thousands leaves one ten-thousand. The result is twelve thousand two hundred and twenty.'],
      },
      on_correct: L("To'g'ri. Qoldiq ayirish bilan topiladi.", 'Верно. Остаток находится вычитанием.', 'Correct. Subtraction finds the amount remaining.'),
      on_wrong: L("Boshlang'ich miqdor kamayganini ko'rsatadigan amalni tanlang.", 'Выбери действие, которое показывает уменьшение.', 'Choose the operation that shows a decrease.'),
    },
  },

  s8: {
    eyebrow: L('Tushuntirish · 5-qadam', 'Объяснение · шаг 5', 'Explanation · step 5'),
    title: L('Ayirishda maydalash', 'Размен при вычитании', 'Exchanging in subtraction'),
    expression: '63 241 − 27 856',
    question: L("1 birlikdan 6 birlikni ayirib bo'lmaydi. Eng yaqin qaysi xonadan maydalaymiz?", 'Из 1 единицы нельзя вычесть 6 единиц. Из какого ближайшего разряда выполним размен?', 'You cannot subtract 6 ones from 1 one. Which is the nearest place we can exchange from?'),
    options: [L("o'nlar xonasidan", 'из разряда десятков', 'the tens place'), L('yuzlar xonasidan', 'из разряда сотен', 'the hundreds place'), L('minglar xonasidan', 'из разряда тысяч', 'the thousands place')],
    correctIndex: 0,
    correctText: L("To'g'ri. Eng yaqin nol bo'lmagan xona o'nlar xonasi.", 'Верно. Ближайший ненулевой разряд — десятки.', 'Correct. The nearest non-zero place is the tens place.'),
    wrong: [null, L("Yuzlarga borish shart emas. O'nlar xonasidagi 4 maydalash uchun yetarli.", 'До сотен идти не нужно. В десятках уже есть 4.', 'There is no need to move to the hundreds. The tens place already contains 4.'), L("Avval birliklarga eng yaqin nol bo'lmagan xonani tekshiring.", 'Сначала проверь ближайший к единицам ненулевой разряд.', 'First check the nearest non-zero place to the ones.')],
    wrongAudio: [null, L("Yuzlarga borish shart emas. O'nlar xonasidagi to'rt maydalash uchun yetarli.", 'До сотен идти не нужно. В десятках уже есть четыре.', 'There is no need to move to the hundreds. The tens place already contains four.'), L("Avval birliklarga eng yaqin nol bo'lmagan xonani tekshiring.", 'Сначала проверь ближайший к единицам ненулевой разряд.', 'First check the nearest non-zero place to the ones.')],
    states: ['6 | 3 | 2 | 4 | 1', '6 | 3 | 2 | 3 | 11', '6 | 3 | 1 | 13 | 11', '6 | 2 | 11 | 13 | 11', '5 | 12 | 11 | 13 | 11'],
    resultText: L('63 241 − 27 856 = 35 385', '63 241 − 27 856 = 35 385', '63,241 − 27,856 = 35,385'),
    solution: { title: Y, steps: [L("4 o'nlikni 3 ga kamaytirib, 11 birlik hosil qilamiz: 6 | 3 | 2 | 3 | 11.", 'Уменьшаем 4 десятка до 3 и получаем 11 единиц: 6 | 3 | 2 | 3 | 11.', 'Reduce 4 tens to 3 tens and make 11 ones: 6 | 3 | 2 | 3 | 11.'), L("Keyingi har yetishmovchilikda eng yaqin nol bo'lmagan chap xonadan maydalaymiz.", 'При каждой следующей нехватке выполняем размен из ближайшего ненулевого разряда слева.', 'For each later shortage, exchange from the nearest non-zero place on the left.'), L("Yakuniy holat 5 | 12 | 11 | 13 | 11. O'n minglar: 5 − 2 = 3. Natija 35 385.", 'Итоговое состояние: 5 | 12 | 11 | 13 | 11. Десятки тысяч: 5 − 2 = 3. Результат: 35 385.', 'The final state is 5 | 12 | 11 | 13 | 11. Ten-thousands: 5 − 2 = 3. The result is 35,385.')]},
    audio: {
      intro: L("Oltmish uch ming ikki yuz qirq birdan yigirma yetti ming sakkiz yuz ellik oltini ayiramiz. Birliklarga eng yaqin nol bo'lmagan xonani tanlang.", 'Вычитаем двадцать семь тысяч восемьсот пятьдесят шесть из шестидесяти трёх тысяч двухсот сорока одного. Выбери ближайший к единицам ненулевой разряд.', 'Subtract twenty-seven thousand eight hundred and fifty-six from sixty-three thousand two hundred and forty-one. Choose the nearest non-zero place to the ones.'),
      steps: {
        uz: ["Boshlang'ich holatda olti o'n minglik, uch minglik, ikki yuzlik, to'rt o'nlik va bir birlik bor.", "To'rt o'nlikdan bir o'nlikni maydalaymiz. Uch o'nlik qoladi, bir birlik o'n bir birlik bo'ladi. O'n bir birlikdan olti birlikni ayirsak, besh birlik qoladi.", "Ikki yuzlikdan bir yuzlikni maydalaymiz. Bir yuzlik qoladi, uch o'nlik o'n uch o'nlik bo'ladi. O'n uch o'nlikdan besh o'nlikni ayirsak, sakkiz o'nlik qoladi.", "Uch minglikdan bir minglikni maydalaymiz. Ikki minglik qoladi, bir yuzlik o'n bir yuzlik bo'ladi. O'n bir yuzlikdan sakkiz yuzlikni ayirsak, uch yuzlik qoladi.", "Olti o'n minglikdan bir o'n minglikni maydalaymiz. Besh o'n minglik qoladi, ikki minglik o'n ikki minglik bo'ladi. O'n ikki minglikdan yetti minglikni ayirsak, besh minglik qoladi. O'n minglar ustunida besh o'n minglikdan ikki o'n minglikni ayirsak, uch o'n minglik qoladi. Natija o'ttiz besh ming uch yuz sakson besh."],
        ru: ['В исходном состоянии есть шесть десятков тысяч, три тысячи, две сотни, четыре десятка и одна единица.', 'Размениваем один десяток из четырёх. Остаются три десятка, а одна единица становится одиннадцатью единицами. Из одиннадцати единиц вычитаем шесть, остаётся пять.', 'Размениваем одну сотню из двух. Остаётся одна сотня, а три десятка становятся тринадцатью десятками. Из тринадцати десятков вычитаем пять, остаётся восемь.', 'Размениваем одну тысячу из трёх. Остаются две тысячи, а одна сотня становится одиннадцатью сотнями. Из одиннадцати сотен вычитаем восемь, остаётся три.', 'Размениваем один десяток тысяч из шести. Остаются пять десятков тысяч, а две тысячи становятся двенадцатью тысячами. Из двенадцати тысяч вычитаем семь, остаётся пять. В столбце десятков тысяч из пяти вычитаем два, остаётся три. Результат: тридцать пять тысяч триста восемьдесят пять.'],
        en: ['The starting state has six ten-thousands, three thousands, two hundreds, four tens and one one.', 'Exchange one ten from the four tens. Three tens remain, and one one becomes eleven ones. Eleven ones minus six ones leaves five ones.', 'Exchange one hundred from the two hundreds. One hundred remains, and three tens become thirteen tens. Thirteen tens minus five tens leaves eight tens.', 'Exchange one thousand from the three thousands. Two thousands remain, and one hundred becomes eleven hundreds. Eleven hundreds minus eight hundreds leaves three hundreds.', 'Exchange one ten-thousand from the six ten-thousands. Five ten-thousands remain, and two thousands become twelve thousands. Twelve thousands minus seven thousands leaves five thousands. In the ten-thousands column, five minus two leaves three. The result is thirty-five thousand three hundred and eighty-five.'],
      },
      on_correct: L("To'g'ri. Eng yaqin nol bo'lmagan xona tanlandi.", 'Верно. Выбран ближайший ненулевой разряд.', 'Correct. The nearest non-zero place has been chosen.'),
      on_wrong: L("Birliklardan chapga qarab birinchi nol bo'lmagan raqamni toping.", 'Двигайся от единиц влево до первой ненулевой цифры.', 'Move left from the ones to the first non-zero digit.'),
    },
  },

  s9: {
    eyebrow: L('Nollar zanjiri', 'Цепочка нулей', 'Chain of zeros'),
    title: L("Birinchi nol bo'lmagan xonani toping", 'Найди первый ненулевой разряд', 'Find the first non-zero place'),
    expression: '40 005 − 17 268',
    question: L("5 birlik 8 birlikni ayirish uchun yetmaydi. Qaysi raqamdan maydalashni boshlaymiz?", 'Пяти единиц недостаточно, чтобы вычесть 8. С какой цифры начнём размен?', 'Five ones are not enough to subtract 8 ones. Which digit should the exchange begin from?'),
    options: [L("4 o'n minglikdan", 'с 4 десятков тысяч', 'the 4 ten-thousands'), L("0 o'nlikdan", 'с 0 десятков', 'the 0 tens'), L('0 yuzlikdan', 'с 0 сотен', 'the 0 hundreds')],
    correctIndex: 0,
    correctText: L("To'g'ri. Chapdagi birinchi nol bo'lmagan raqam 4.", 'Верно. Первая ненулевая цифра слева — 4.', 'Correct. The first non-zero digit on the left is 4.'),
    wrong: [null, L("Nol o'nlikni maydalab bo'lmaydi. Chapga qarab davom eting.", 'Ноль десятков нельзя разменять. Продолжай двигаться влево.', 'Zero tens cannot be exchanged. Continue moving left.'), L("Nol yuzlikni maydalab bo'lmaydi. Birinchi nol bo'lmagan xonani toping.", 'Ноль сотен нельзя разменять. Найди первый ненулевой разряд.', 'Zero hundreds cannot be exchanged. Find the first non-zero place.')],
    states: ['4 | 0 | 0 | 0 | 5', '3 | 10 | 0 | 0 | 5', '3 | 9 | 10 | 0 | 5', '3 | 9 | 9 | 10 | 5', '3 | 9 | 9 | 9 | 15'],
    resultText: L('40 005 − 17 268 = 22 737', '40 005 − 17 268 = 22 737', '40,005 − 17,268 = 22,737'),
    solution: { title: Y, steps: [L("4 o'n minglikdan 1 tasini maydalaymiz: 3 o'n minglik va 10 minglik hosil bo'ladi.", 'Размениваем 1 из 4 десятков тысяч: остаются 3 десятка тысяч и появляются 10 тысяч.', 'Exchange 1 of the 4 ten-thousands: 3 ten-thousands remain and 10 thousands are formed.'), L("Minglar xonasidagi 10 minglikdan 1 minglik, keyin 1 yuzlik va 1 o'nlik ketma-ket maydalanadi. Oraliq xonalar 9 ga aylanadi.", 'Из 10 единиц в разряде тысяч размениваем 1 тысячу, затем последовательно 1 сотню и 1 десяток. Промежуточные разряды становятся равны 9.', 'From the 10 units in the thousands place, exchange 1 thousand, then exchange 1 hundred and 1 ten in sequence. The intermediate places become 9.'), L('Ayiramiz: 15 − 8 = 7; 9 − 6 = 3; 9 − 2 = 7; 9 − 7 = 2; 3 − 1 = 2. Natija 22 737.', 'Вычитаем: 15 − 8 = 7; 9 − 6 = 3; 9 − 2 = 7; 9 − 7 = 2; 3 − 1 = 2. Результат: 22 737.', 'Subtract: 15 − 8 = 7; 9 − 6 = 3; 9 − 2 = 7; 9 − 7 = 2; 3 − 1 = 2. The result is 22,737.')]},
    audio: {
      intro: L("Qirq ming beshdan o'n yetti ming ikki yuz oltmish sakkizni ayiramiz. Chapdagi birinchi nol bo'lmagan raqamni tanlang.", 'Вычитаем семнадцать тысяч двести шестьдесят восемь из сорока тысяч пяти. Выбери первую ненулевую цифру слева.', 'Subtract seventeen thousand two hundred and sixty-eight from forty thousand and five. Choose the first non-zero digit on the left.'),
      steps: {
        uz: ["Boshlang'ich holat: to'rt, nol, nol, nol, besh.", "O'n minglar xonasida uch qoladi, minglar xonasida o'n hosil bo'ladi.", "Minglar xonasidagi o'nta minglikdan bitta minglikni yuzliklarga maydalaymiz. To'qqiz minglik qoladi, yuzlar xonasida o'n hosil bo'ladi.", "Yuzlar xonasidagi o'nta yuzlikdan bitta yuzlikni o'nliklarga maydalaymiz. To'qqiz yuzlik qoladi, o'nlar xonasida o'n hosil bo'ladi.", "O'nlar xonasidagi o'nta o'nlikdan birini birliklarga maydalaymiz. To'qqiz o'nlik va o'n besh birlik hosil bo'ladi. O'n beshdan sakkizni ayirsak yetti; to'qqizdan oltini ayirsak uch; to'qqizdan ikkini ayirsak yetti; to'qqizdan yettini ayirsak ikki; uchdan birni ayirsak ikki qoladi. Natija yigirma ikki ming yetti yuz o'ttiz yetti."],
        ru: ['Исходное состояние: четыре, ноль, ноль, ноль, пять.', 'В разряде десятков тысяч остаётся три, а в разряде тысяч появляется десять.', 'Из десяти единиц в разряде тысяч одну тысячу размениваем на сотни. Остаются девять тысяч, а в разряде сотен появляется десять.', 'Из десяти единиц в разряде сотен одну сотню размениваем на десятки. Остаются девять сотен, а в разряде десятков появляется десять.', 'Один из десяти десятков размениваем на единицы. Остаются девять десятков и пятнадцать единиц. Пятнадцать минус восемь равно семь; девять минус шесть равно три; девять минус два равно семь; девять минус семь равно два; три минус один равно два. Результат: двадцать две тысячи семьсот тридцать семь.'],
        en: ['The starting state is four, zero, zero, zero, five.', 'The ten-thousands place becomes three, and the thousands place becomes ten.', 'From the ten units in the thousands place, exchange one thousand for ten hundreds. Nine thousands remain, and the hundreds place becomes ten.', 'From the ten units in the hundreds place, exchange one hundred for ten tens. Nine hundreds remain, and the tens place becomes ten.', 'Exchange one of the ten tens for ones. Nine tens and fifteen ones remain. Fifteen minus eight is seven; nine minus six is three; nine minus two is seven; nine minus seven is two; three minus one is two. The result is twenty-two thousand seven hundred and thirty-seven.'],
      },
      on_correct: L("To'g'ri. Maydalash to'rt raqamidan boshlanadi.", 'Верно. Размен начинается с цифры четыре.', 'Correct. The exchange begins from the digit four.'),
      on_wrong: L("Nol xona birligini bera olmaydi. Chapga qarab davom eting.", 'Нулевой разряд не может отдать единицу. Продолжай двигаться влево.', 'A zero place cannot provide a unit. Continue moving left.'),
    },
  },

  s10: {
    eyebrow: L('Qoida', 'Правило', 'Rule'),
    title: L("Ustun usulidagi qoidani yig'ing", 'Собери правило вычисления столбиком', 'Build the column-method rule'),
    fragments: [L("Sonlarni birlar xonasi bo'yicha tekislaymiz.", 'Выравниваем числа по разряду единиц.', 'Align the numbers by their ones places.'), L('Hisoblashni birlar ustunidan boshlaymiz.', 'Начинаем вычисление со столбца единиц.', 'Start calculating in the ones column.'), L("Qo'shishda 10 ta kichik xona birligini keyingi xonaning 1 birligiga almashtiramiz.", 'При сложении заменяем 10 единиц одного разряда 1 единицей следующего.', 'In addition, regroup 10 units of one place as 1 unit of the next place.'), L("Ayirishda yuqoridagi raqam yetmasa, eng yaqin nol bo'lmagan chap xonadan maydalaymiz.", 'При вычитании, если верхней цифры недостаточно, выполняем размен из ближайшего ненулевого разряда слева.', 'In subtraction, if the upper digit is too small, exchange from the nearest non-zero place on the left.'), L('Natijani taxmin va teskari amal bilan tekshiramiz.', 'Проверяем результат оценкой и обратным действием.', 'Check the result with an estimate and an inverse operation.')],
    correctOrder: [0, 1, 2, 3, 4],
    correctText: L("To'g'ri. Qoida tekislashdan boshlanadi va tekshirish bilan tugaydi.", 'Верно. Правило начинается с выравнивания и заканчивается проверкой.', 'Correct. The rule begins with alignment and ends with checking.'),
    wrongText: L('Avval yozuvni tayyorlang, keyin hisoblang, oxirida tekshiring.', 'Сначала подготовь запись, затем вычисли и в конце проверь.', 'Set out the calculation first, calculate next, and check at the end.'),
    solution: { title: Y, steps: [L("1. Xona bo'yicha tekislang.", '1. Выровняй по разрядам.', '1. Align by place value.'), L('2. Birliklardan boshlang.', '2. Начинай с единиц.', '2. Start with the ones.'), L("3. Zarur bo'lsa yiriklashtiring yoki maydalang.", '3. При необходимости выполни укрупнение или размен.', '3. Regroup or exchange when needed.'), L('4. Taxmin va teskari amal bilan tekshiring.', '4. Проверь оценкой и обратным действием.', '4. Check with an estimate and an inverse operation.')]},
    audio: {
      uz: ["Qoida qismlarini to'g'ri ketma-ketlikda yig'ing.", "Avval sonlarni birlar xonasi bo'yicha tekislaymiz.", 'Hisoblashni birliklardan boshlaymiz.', "Qo'shishda o'nta kichik xona birligini keyingi xonaning bitta birligiga yiriklashtiramiz.", "Ayirishda raqam yetmasa, eng yaqin nol bo'lmagan chap xonadan maydalaymiz.", 'Oxirida natijani taxmin va teskari amal bilan tekshiramiz.'],
      ru: ['Собери части правила в верной последовательности.', 'Сначала выравниваем числа по разряду единиц.', 'Начинаем вычисление с единиц.', 'При сложении укрупняем десять единиц разряда в одну единицу следующего разряда.', 'При вычитании, если цифры недостаточно, выполняем размен из ближайшего ненулевого разряда слева.', 'В конце проверяем результат оценкой и обратным действием.'],
      en: ['Build the rule in the correct order.', 'First, align the numbers by their ones places.', 'Start calculating with the ones.', 'In addition, regroup ten units of a place as one unit of the next place.', 'In subtraction, when the upper digit is too small, exchange from the nearest non-zero place on the left.', 'Finally, check the result with an estimate and an inverse operation.'],
    },
  },

  s11: {
    eyebrow: L('Tezkor tekshiruv', 'Быстрая проверка', 'Rapid check'),
    title: L("To'rtta mikrotest", 'Четыре микротеста', 'Four micro-tests'),
    rounds: [
      {
        id: 'alignment', kind: 'choice', prompt: L("84 215 − 9 730 misoli qaysi yozuvda to'g'ri tekislangan?", 'В какой записи верно выровнено выражение 84 215 − 9 730?', 'Which layout correctly aligns 84,215 − 9,730?'), options: ['− 9 | 7 | 3 | 0 | □', '− □ | 9 | 7 | 3 | 0', '□ | 9 | 7 | 3 | 0'], correctIndex: 1,
        wrong: [L("Chapdan tekislash bir xil xonalarni turli ustunlarga suradi. Birliklarni o'ng chetda ustma-ust qo'ying.", 'Выравнивание слева сдвигает одинаковые разряды в разные столбцы. Совмести единицы у правого края.', 'Left alignment puts matching places in different columns. Line up the ones at the right edge.'), null, L("Amal belgisi qaysi hisob bajarilishini ko'rsatadi. Uni yozuvdan olib tashlamang.", 'Знак действия показывает, какое вычисление нужно выполнить. Не убирай его из записи.', 'The operation sign shows which calculation to perform. Do not omit it from the layout.')],
        wrongAudio: [L("Chapdan tekislash bir xil xonalarni turli ustunlarga suradi. Birliklarni o'ng chetda ustma-ust qo'ying.", 'Выравнивание слева сдвигает одинаковые разряды в разные столбцы. Совмести единицы у правого края.', 'Left alignment puts matching places in different columns. Line up the ones at the right edge.'), null, L("Amal belgisi qaysi hisob bajarilishini ko'rsatadi. Uni yozuvdan olib tashlamang.", 'Знак действия показывает, какое вычисление нужно выполнить. Не убирай его из записи.', 'The operation sign shows which calculation to perform. Do not omit it from the layout.')],
        correctAudio: L("To'g'ri. Bo'sh o'n minglar katagi chapda qoldi, birliklar esa o'ng chetda ustma-ust turibdi.", 'Верно. Пустая клетка десятков тысяч осталась слева, а единицы совмещены у правого края.', 'Correct. The empty ten-thousands box stays on the left, and the ones line up at the right edge.'),
      },
      {
        id: 'carry', kind: 'choice', prompt: L("7 + 5 = 12. Birliklar katagiga nima yoziladi va nima ko'chadi?", '7 + 5 = 12. Что записывается в единицах и что переносится?', '7 + 5 = 12. What is written in the ones column and what is carried?'), options: [L("2 yoziladi, 1 o'nlik ko'chadi", 'Записывается 2, переносится 1 десяток', 'Write 2 and carry 1 ten'), L('12 bitta katakka yoziladi', '12 записывается в одну клетку', 'Write 12 in one box'), L("1 yoziladi, 2 ko'chadi", 'Записывается 1, переносится 2', 'Write 1 and carry 2')], correctIndex: 0,
        wrong: [null, L("Bir katakda faqat bitta raqam turadi. 12 birlikdan 2 yoziladi, 1 o'nlik ko'chadi.", 'В одной клетке может стоять только одна цифра. Из 12 единиц пишем 2, а 1 десяток переносим.', 'Only one digit belongs in a box. From 12 ones, write 2 and carry 1 ten.'), L("Birlik va o'nlik raqamlarini almashtirmang: 12 birlikdan 2 yoziladi, 1 ko'chadi.", 'Не меняй местами цифры единиц и десятков: из 12 единиц пишем 2 и переносим 1.', 'Do not reverse the ones and tens digits: from 12 ones, write 2 and carry 1.')],
        wrongAudio: [null, L("Bir katakda faqat bitta raqam turadi. O'n ikki birlikdan ikki yoziladi, bir o'nlik ko'chadi.", 'В одной клетке может стоять только одна цифра. Из двенадцати единиц пишем две, а один десяток переносим.', 'Only one digit belongs in a box. From twelve ones, write two and carry one ten.'), L("Birlik va o'nlik raqamlarini almashtirmang. O'n ikki birlikdan ikki yoziladi, bir ko'chadi.", 'Не меняй местами цифры единиц и десятков. Из двенадцати единиц пишем две и переносим одну.', 'Do not reverse the ones and tens digits. From twelve ones, write two and carry one.')],
        correctAudio: L("To'g'ri. O'n ikki birlikdan ikki birlik yoziladi va bir o'nlik ko'chiriladi.", 'Верно. Из двенадцати единиц записываем две и переносим один десяток.', 'Correct. From twelve ones, write two ones and carry one ten.'),
      },
      {
        id: 'zeroChain', kind: 'choice', prompt: L("40 005 − 17 268 da ayirishdan oldingi holatni tanlang.", 'Выбери состояние разрядов перед вычитанием в 40 005 − 17 268.', 'Choose the place-value state before subtracting in 40,005 − 17,268.'), options: ['3 | 9 | 9 | 9 | 15', '3 | 9 | 0 | 9 | 15', '4 | 0 | 0 | −1 | 15'], correctIndex: 0,
        wrong: [null, L("Maydalash o'tgan har bir oraliq nol 9 ga aylanadi. Yuzlar xonasida 0 qolmaydi.", 'Каждый промежуточный ноль, через который проходит размен, становится 9. В сотнях ноль не остаётся.', 'Every intermediate zero crossed by the exchange becomes 9. The hundreds place does not stay zero.'), L("Noldan bevosita birlik olib bo'lmaydi va xona manfiy bo'lib qolmaydi. Birinchi nol bo'lmagan xonadan boshlang.", 'Нельзя взять единицу непосредственно из нуля, и разряд не становится отрицательным. Начни с первого ненулевого разряда.', 'You cannot take a unit directly from zero, and a place does not become negative. Start at the first non-zero place.')],
        wrongAudio: [null, L("Maydalash o'tgan har bir oraliq nol to'qqizga aylanadi. Yuzlar xonasida nol qolmaydi.", 'Каждый промежуточный ноль, через который проходит размен, становится девятью. В сотнях ноль не остаётся.', 'Every intermediate zero crossed by the exchange becomes nine. The hundreds place does not stay zero.'), L("Noldan bevosita birlik olib bo'lmaydi va xona manfiy bo'lib qolmaydi. Birinchi nol bo'lmagan xonadan boshlang.", 'Нельзя взять единицу непосредственно из нуля, и разряд не становится отрицательным. Начни с первого ненулевого разряда.', 'You cannot take a unit directly from zero, and a place does not become negative. Start at the first non-zero place.')],
        correctAudio: L("To'g'ri. Oraliq nollarning har biri to'qqizga aylandi, birliklar esa o'n besh bo'ldi.", 'Верно. Каждый промежуточный ноль превратился в девять, а единицы стали пятнадцатью.', 'Correct. Every intermediate zero became nine, and the ones became fifteen.'),
      },
      { id: 'numeric', kind: 'number', prompt: L('60 002 − 24 785 ni hisoblang.', 'Вычисли 60 002 − 24 785.', 'Calculate 60,002 − 24,785.'), answer: 35217, correctAudio: L("To'g'ri. Oltmish ming ikkidan yigirma to'rt ming yetti yuz sakson beshni ayirsak, o'ttiz besh ming ikki yuz o'n yetti qoladi.", 'Верно. Шестьдесят тысяч два минус двадцать четыре тысячи семьсот восемьдесят пять равно тридцати пяти тысячам двумстам семнадцати.', 'Correct. Sixty thousand and two minus twenty-four thousand seven hundred and eighty-five equals thirty-five thousand two hundred and seventeen.') },
    ],
    correctText: L("To'g'ri. Mikrotest aniq bajarildi.", 'Верно. Микротест выполнен точно.', 'Correct. The micro-test is accurate.'),
    wrong: {
      alignment: L("Birlar ustuni va amal belgisini tekshiring.", 'Проверь столбец единиц и знак действия.', 'Check the ones column and operation sign.'),
      carry: L("12 sonining birlik va o'nlik raqamlarini ajrating.", 'Раздели число 12 на цифры единиц и десятков.', 'Separate 12 into its ones and tens digits.'),
      zeroChain: L("Birinchi nol bo'lmagan xonadan barcha oraliq xonalarni tekshiring.", 'Проверь все промежуточные разряды от первой ненулевой цифры.', 'Check every intermediate place from the first non-zero digit.'),
      numeric: L("Maydalashdan keyingi holat 5 | 9 | 9 | 9 | 12. Keyin ustunlar bo'yicha ayiring.", 'После размена состояние равно 5 | 9 | 9 | 9 | 12. Затем вычитай по столбцам.', 'After exchanging, the state is 5 | 9 | 9 | 9 | 12. Then subtract by columns.'),
    },
    solution: { title: Y, steps: [L('Birlar birlar ostida turadi.', 'Единицы стоят под единицами.', 'Ones are placed under ones.'), L("12 birlikdan 2 yoziladi, 1 o'nlik ko'chadi.", 'Из 12 единиц пишем 2 и переносим 1 десяток.', 'From 12 ones, write 2 and carry 1 ten.'), L('40 005 uchun holat 3 | 9 | 9 | 9 | 15.', 'Для 40 005 состояние 3 | 9 | 9 | 9 | 15.', 'For 40,005, the state is 3 | 9 | 9 | 9 | 15.'), L('60 002 − 24 785 = 35 217.', '60 002 − 24 785 = 35 217.', '60,002 − 24,785 = 35,217.')]},
    audio: {
      intro: L("To'rtta qisqa tekshiruvni bajaring. Tekislash, ko'chirish, nollar zanjiri va aniq natijani tekshiramiz.", 'Выполни четыре короткие проверки: выравнивание, перенос, цепочку нулей и точный результат.', 'Complete four quick checks: alignment, carrying, the chain of zeros and an exact result.'),
      on_correct: L("To'g'ri. Bu mikrotest yakunlandi.", 'Верно. Этот микротест завершён.', 'Correct. This micro-test is complete.'),
      on_wrong: L("Faol savoldagi bitta matematik belgini qayta tekshiring.", 'Ещё раз проверь один математический признак активного вопроса.', 'Check the key mathematical feature in the active question again.'),
      wrong: { numeric: L("Oltmish ming ikkidan yigirma to'rt ming yetti yuz sakson beshni ayirishda nollar zanjirini to'liq saqlang.", 'При вычитании двадцати четырёх тысяч семисот восьмидесяти пяти из шестидесяти тысяч двух полностью сохрани цепочку нулей.', 'When subtracting twenty-four thousand seven hundred and eighty-five from sixty thousand and two, keep the complete chain of zeros.') },
    },
  },

  s12: {
    eyebrow: L('Strategiyani tanlash', 'Выбор стратегии', 'Choose a strategy'),
    title: L('Taxmin va teskari amal', 'Оценка и обратное действие', 'Estimate and inverse operation'),
    estimateQuestion: L("28 467 + 15 785 javobining kattaligini qaysi yozuv tekshiradi?", 'Какая запись проверяет величину ответа 28 467 + 15 785?', 'Which expression checks the size of the answer to 28,467 + 15,785?'),
    estimateOptions: ['28 000 + 16 000 ≈ 44 000', '28 000 − 16 000 ≈ 12 000', '28 000 + 16 000 = 44 252'],
    estimateCorrectIndex: 0,
    estimateCorrectText: L("To'g'ri. Taxmin javob 44 ming atrofida bo'lishini ko'rsatadi.", 'Верно. Оценка показывает, что ответ должен быть около 44 тысяч.', 'Correct. The estimate shows that the answer should be about 44 thousand.'),
    estimateCorrectAudio: L("Taxmin javob qirq to'rt ming atrofida bo'lishini ko'rsatadi.", 'Оценка показывает, что ответ должен быть около сорока четырёх тысяч.', 'The estimate shows that the answer should be about forty-four thousand.'),
    estimateWrong: [null, L("Asosiy hisobda miqdorlar qo'shilmoqda, ayirilmayapti.", 'В исходном вычислении количества складываются, а не вычитаются.', 'The original calculation adds the amounts; it does not subtract them.'), L("Taxmin aniq javob emas. Yaxlitlangan sonlar faqat kattalikni ko'rsatadi.", 'Оценка не является точным ответом. Округлённые числа показывают только величину.', 'An estimate is not the exact answer. Rounded numbers only show the expected size.')],
    estimateWrongAudio: [null, L("Asosiy hisobda miqdorlar qo'shilmoqda, ayirilmayapti.", 'В исходном вычислении количества складываются, а не вычитаются.', 'The original calculation adds the amounts; it does not subtract them.'), L("Taxmin aniq javob emas. Yaxlitlangan sonlar faqat kattalikni ko'rsatadi.", 'Оценка не является точным ответом. Округлённые числа показывают только величину.', 'An estimate is not the exact answer. Rounded numbers only show the expected size.')],
    calculations: [{ id: 'a', text: '28 467 + 15 785 = 44 252' }, { id: 'b', text: '63 241 − 27 856 = 35 385' }, { id: 'c', text: '40 005 − 17 268 = 22 737' }],
    checks: [{ id: 'b-check', text: '35 385 + 27 856 = 63 241' }, { id: 'c-check', text: '22 737 + 17 268 = 40 005' }, { id: 'a-check', text: '44 252 − 15 785 = 28 467' }],
    pairs: { a: 'a-check', b: 'b-check', c: 'c-check' },
    matchingInstruction: L('Har bir aniq hisobni uning teskari amali bilan juftlang.', 'Соедини каждое точное вычисление с его обратной проверкой.', 'Match each exact calculation to its inverse-operation check.'),
    pairCorrectText: L("To'g'ri. Teskari amal boshlang'ich sonni qaytardi.", 'Верно. Обратное действие вернуло исходное число.', 'Correct. The inverse operation returned the starting number.'),
    pairWrongText: L("Bu juftlikdagi uchta son bir xil bog'lanishni tuzmaydi.", 'Три числа в этой паре не образуют одну связь.', 'The three numbers in this pair do not form one fact family.'),
    aria: { selectedLeft: L('Chap kartochka tanlandi', 'Выбрана левая карточка', 'Left card selected'), selectedRight: L("O'ng kartochka tanlandi", 'Выбрана правая карточка', 'Right card selected'), pairConnected: L('Juft chiziq bilan ulandi', 'Пара соединена линией', 'Pair connected with a line'), wrongPair: L('Juft mos kelmadi', 'Пара не совпала', 'Pair does not match') },
    solution: { title: Y, steps: [L('Taxmin javobning taxminiy kattaligini tekshiradi.', 'Оценка проверяет примерную величину ответа.', 'An estimate checks the approximate size of the answer.'), L("Qo'shishni yig'indidan bir qo'shiluvchini ayirish bilan tekshiramiz.", 'Сложение проверяем вычитанием одного слагаемого из суммы.', 'Check addition by subtracting one addend from the sum.'), L("Ayirishni ayirma va ayriluvchini qo'shish bilan tekshiramiz.", 'Вычитание проверяем сложением разности и вычитаемого.', 'Check subtraction by adding the difference and subtrahend.') ]},
    audio: { intro: L("Taxmin javob kattaligini, teskari amal aniq hisobni tekshiradi. Avval taxminni tanlang, keyin hisoblarni teskari amallar bilan juftlang.", 'Оценка проверяет величину ответа, а обратное действие проверяет точный расчёт. Сначала выбери оценку, затем соедини вычисления с обратными проверками.', 'An estimate checks the answer size, while an inverse operation checks the exact calculation. Choose the estimate, then match calculations to inverse checks.'), on_correct: L("To'g'ri. Taxmin va teskari amal o'z vazifasida ishlatildi.", 'Верно. Оценка и обратное действие использованы по назначению.', 'Correct. The estimate and inverse operation have each been used correctly.'), on_wrong: L("Taxminiy kattalik bilan aniq tenglikni farqlang.", 'Различай примерную величину и точное равенство.', 'Distinguish an approximate size from an exact equality.') },
  },

  s13: {
    eyebrow: L('Kutubxona missiyasi', 'Миссия библиотеки', 'Library mission'),
    title: L("Jami nechta kitob bo'ldi?", 'Сколько книг стало всего?', 'How many books are there altogether?'),
    story: L("Kutubxonada 72 384 ta kitob bor edi. Yana 8 596 ta kitob keldi.", 'В библиотеке было 72 384 книги. Поступило ещё 8 596 книг.', 'The library had 72,384 books. Another 8,596 books arrived.'),
    stages: [
      { id: 'operation', kind: 'choice', prompt: L("Qaysi amal miqdorlar bog'lanishini ko'rsatadi?", 'Какое действие показывает связь величин?', 'Which operation represents the relationship between the amounts?'), options: [L("Qo'shish", 'Сложение', 'Addition'), L('Ayirish', 'Вычитание', 'Subtraction'), L("Ko'paytirish", 'Умножение', 'Multiplication')], correctIndex: 0, wrong: [null, L('Ayirish miqdorni kamaytiradi, lekin yangi kitoblar kelganda jami miqdor oshadi.', 'Вычитание уменьшает количество, но после поступления новых книг общее количество растёт.', 'Subtraction decreases an amount, but the total grows when new books arrive.'), L("Bu yerda teng guruhlar yo'q. Boshlang'ich miqdorga kelgan miqdorni qo'shish kerak.", 'Здесь нет равных групп. Нужно прибавить поступившее количество к начальному.', 'There are no equal groups here. Add the arriving amount to the starting amount.')], correctAudio: L("To'g'ri. Kitoblar keldi, shuning uchun qo'shamiz.", 'Верно. Книги поступили, поэтому складываем.', 'Correct. Books arrived, so we add.') },
      { id: 'estimate', kind: 'choice', prompt: L("Javob taxminan qancha bo'lishi kerak?", 'Каким примерно должен быть ответ?', 'About how large should the answer be?'), options: ['≈ 81 000', '≈ 64 000', '≈ 720 000'], correctIndex: 0, wrong: [null, L("Bu taxmin yangi kitoblarni qo'shish o'rniga ayirgandagi miqdorga yaqin.", 'Эта оценка близка к результату вычитания новых книг вместо сложения.', 'This estimate is close to subtracting the new books instead of adding them.'), L("Bu taxmin boshlang'ich miqdordan deyarli o'n baravar katta. Xonalar sonini saqlang.", 'Эта оценка почти в десять раз больше начального количества. Сохрани число разрядов.', 'This estimate is almost ten times the starting amount. Keep the same order of magnitude.')], correctAudio: L("To'g'ri. Yetmish ikki mingga qariyb to'qqiz ming qo'shilsa, javob sakson bir ming atrofida bo'ladi.", 'Верно. Если к семидесяти двум тысячам прибавить около девяти тысяч, ответ будет около восьмидесяти одной тысячи.', 'Correct. Adding about nine thousand to seventy-two thousand gives an answer near eighty-one thousand.') },
      { id: 'answer', kind: 'number', prompt: L('Aniq natijani kiriting.', 'Введи точный результат.', 'Enter the exact result.'), answer: 80980, correctAudio: L("To'g'ri. Ustun usulidagi aniq natija sakson ming to'qqiz yuz sakson.", 'Верно. Точный результат вычисления столбиком: восемьдесят тысяч девятьсот восемьдесят.', 'Correct. The exact column-method result is eighty thousand nine hundred and eighty.') },
      { id: 'check', kind: 'choice', prompt: L('Qaysi teskari amal javobni tekshiradi?', 'Какое обратное действие проверяет ответ?', 'Which inverse operation checks the answer?'), options: ['80 980 − 8 596 = 72 384', '80 980 + 8 596 = 72 384', '72 384 − 8 596 = 80 980'], correctIndex: 0, wrong: [null, L("Yig'indiga yana qo'shiluvchini qo'shish boshlang'ich miqdorni qaytarmaydi. Teskari amal ayirishdir.", 'Повторное прибавление слагаемого к сумме не возвращает начальное количество. Обратное действие — вычитание.', 'Adding the addend to the sum again does not return the starting amount. The inverse operation is subtraction.'), L("Tekshiruv yig'indidan kelgan miqdorni ayirishi kerak. Boshlang'ich miqdordan ayirish boshqa savolni yechadi.", 'Для проверки нужно вычесть поступившее количество из суммы. Вычитание из начального количества решает другую задачу.', 'The check must subtract the arriving amount from the sum. Subtracting it from the starting amount answers a different question.')], correctAudio: L("To'g'ri. Yig'indidan kelgan kitoblar sonini ayirsak, boshlang'ich miqdor qaytdi.", 'Верно. Если из суммы вычесть число поступивших книг, вернётся исходное количество.', 'Correct. Subtracting the arriving books from the total returns the starting amount.') },
    ],
    correctText: L("To'g'ri. Amal, taxmin, aniq hisob va tekshiruv bir-biriga mos.", 'Верно. Действие, оценка, точный расчёт и проверка согласуются.', 'Correct. The operation, estimate, exact calculation and check are consistent.'),
    wrong: { operation: L("Kitoblar keldi, shuning uchun yangi miqdor oshadi.", 'Книги поступили, поэтому новое количество увеличивается.', 'Books arrived, so the new amount increases.'), estimate: L("72 mingga yana 9 mingga yaqin miqdor qo'shiladi.", 'К 72 тысячам добавляется ещё около 9 тысяч.', 'About 9 thousand is added to 72 thousand.'), answer: L("Birliklardan boshlang va ko'chirishlarni qo'shing.", 'Начинай с единиц и учитывай переносы.', 'Start with the ones and include each carry.'), check: L("Qo'shishni yig'indidan bir qo'shiluvchini ayirish bilan tekshiring.", 'Проверь сложение вычитанием одного слагаемого из суммы.', 'Check addition by subtracting one addend from the sum.') },
    solution: { title: Y, steps: [L("Kitoblar keldi, shuning uchun qo'shamiz.", 'Книги поступили, поэтому складываем.', 'Books arrived, so add.'), L('72 000 + 9 000 ≈ 81 000.', '72 000 + 9 000 ≈ 81 000.', '72,000 + 9,000 ≈ 81,000.'), L('72 384 + 8 596 = 80 980.', '72 384 + 8 596 = 80 980.', '72,384 + 8,596 = 80,980.'), L('80 980 − 8 596 = 72 384.', '80 980 − 8 596 = 72 384.', '80,980 − 8,596 = 72,384.')]},
    audio: { intro: L("Kutubxonada yetmish ikki ming uch yuz sakson to'rtta kitob bor edi. Yana sakkiz ming besh yuz to'qson oltita kitob keldi. Amalni tanlang, taxmin qiling, hisoblang va tekshiring.", 'В библиотеке было семьдесят две тысячи триста восемьдесят четыре книги. Поступило ещё восемь тысяч пятьсот девяносто шесть. Выбери действие, оцени, вычисли и проверь.', 'The library had seventy-two thousand three hundred and eighty-four books. Another eight thousand five hundred and ninety-six arrived. Choose the operation, estimate, calculate and check.'), on_correct: L("To'g'ri. Kutubxona hisobi to'liq tekshirildi.", 'Верно. Расчёт библиотеки полностью проверен.', 'Correct. The library calculation has been fully checked.'), on_wrong: L("Faol bosqichning vazifasini tekshiring.", 'Проверь назначение текущего шага.', 'Check the purpose of the current step.') },
  },

  s14: {
    eyebrow: L('Yangi vaziyat', 'Новая ситуация', 'New situation'),
    title: L('Omborda nechta kitob qoldi?', 'Сколько книг осталось на складе?', 'How many books remain in the warehouse?'),
    story: L('Omborda 72 000 ta kitob bor edi. 18 756 tasi filiallarga yuborildi.', 'На складе было 72 000 книг. В филиалы отправили 18 756 книг.', 'The warehouse held 72,000 books. It sent 18,756 books to the branches.'),
    stages: [
      { id: 'operation', kind: 'choice', prompt: L('Qaysi amal qoldiqni topadi?', 'Какое действие найдёт остаток?', 'Which operation finds the amount remaining?'), options: [L('Ayirish', 'Вычитание', 'Subtraction'), L("Qo'shish", 'Сложение', 'Addition'), L("Ko'paytirish", 'Умножение', 'Multiplication')], correctIndex: 0, wrong: [null, L("Qo'shish miqdorni oshiradi, lekin kitoblar ombordan chiqib ketgan.", 'Сложение увеличивает количество, но книги были отправлены со склада.', 'Addition increases an amount, but books have left the warehouse.'), L("Bu yerda teng guruhlar tuzilmayapti. Qolgan miqdor boshlang'ich miqdordan yuborilganini ayirish bilan topiladi.", 'Здесь не образуются равные группы. Остаток находят вычитанием отправленного количества из начального.', 'There are no equal groups here. Find the remainder by subtracting the sent amount from the starting amount.')], correctAudio: L("To'g'ri. Kitoblar yuborildi, shuning uchun ayiramiz.", 'Верно. Книги отправили, поэтому вычитаем.', 'Correct. Books were sent away, so we subtract.') },
      { id: 'estimate', kind: 'choice', prompt: L('Javob taxminan qancha?', 'Каков примерный ответ?', 'What is the approximate answer?'), options: ['≈ 53 000', '≈ 91 000', '≈ 63 000'], correctIndex: 0, wrong: [null, L("Bu taxmin yuborilgan miqdorni ayirish o'rniga qo'shgandagi natijaga yaqin.", 'Эта оценка близка к результату сложения отправленного количества вместо вычитания.', 'This estimate is close to adding the sent amount instead of subtracting it.'), L("Bu taxmin yuborilgan miqdorning faqat yarmiga yaqin qismini ayirgandek chiqadi. Ayiriluvchi qariyb o'n to'qqiz ming.", 'Такая оценка получается, если вычесть лишь около половины отправленного количества. Вычитаемое близко к девятнадцати тысячам.', 'This estimate is like subtracting only about half the sent amount. The subtrahend is close to nineteen thousand.')], correctAudio: L("To'g'ri. Yetmish ikki mingdan qariyb o'n to'qqiz mingni ayirsak, javob ellik uch ming atrofida.", 'Верно. Семьдесят две тысячи минус около девятнадцати тысяч дают ответ около пятидесяти трёх тысяч.', 'Correct. Seventy-two thousand minus about nineteen thousand gives an answer near fifty-three thousand.') },
      { id: 'answer', kind: 'number', prompt: L('Aniq qoldiqni kiriting.', 'Введи точный остаток.', 'Enter the exact amount remaining.'), answer: 53244, correctAudio: L("To'g'ri. Nollar zanjiri saqlanganda aniq qoldiq ellik uch ming ikki yuz qirq to'rt.", 'Верно. При полном размене через цепочку нулей точный остаток равен пятидесяти трём тысячам двумстам сорока четырём.', 'Correct. Keeping the full chain of zeros gives an exact remainder of fifty-three thousand two hundred and forty-four.') },
      { id: 'check', kind: 'choice', prompt: L("Qaysi teskari amal boshlang'ich miqdorni qaytaradi?", 'Какое обратное действие возвращает начальное количество?', 'Which inverse operation returns the starting amount?'), options: ['53 244 + 18 756 = 72 000', '53 244 − 18 756 = 72 000', '72 000 + 18 756 = 53 244'], correctIndex: 0, wrong: [null, L("Ayirishni yana ayirish bilan tekshirmaymiz. Qoldiq va yuborilgan miqdorni qo'shib, boshlang'ich miqdorni qaytaramiz.", 'Вычитание не проверяют повторным вычитанием. Сложи остаток и отправленное количество, чтобы вернуть начальное.', 'Do not check subtraction with another subtraction. Add the remainder and sent amount to return the starting amount.'), L("Yuborilgan miqdorni boshlang'ich miqdorga qo'shish uni yanada oshiradi. Uni qoldiqqa qo'shish kerak.", 'Прибавление отправленного количества к начальному только увеличивает его. Нужно прибавить его к остатку.', 'Adding the sent amount to the starting amount makes it larger. Add it to the remainder instead.')], correctAudio: L("To'g'ri. Ayirma va ayriluvchini qo'shish boshlang'ich yetmish ikki mingni qaytardi.", 'Верно. Сумма разности и вычитаемого вернула исходные семьдесят две тысячи.', 'Correct. Adding the difference and subtrahend returned the original seventy-two thousand.') },
    ],
    correctText: L("To'g'ri. Natija taxminga mos va teskari amal 72 000 ni qaytardi.", 'Верно. Результат согласуется с оценкой, а обратное действие вернуло 72 000.', 'Correct. The result agrees with the estimate, and the inverse operation returns 72,000.'),
    wrong: { operation: L("Kitoblar ombordan chiqarildi, shuning uchun miqdor kamayadi.", 'Книги отправили со склада, поэтому количество уменьшается.', 'Books left the warehouse, so the amount decreases.'), estimate: L('18 756 ni 19 mingga yaxlitlab, 72 mingdan ayiring.', 'Округли 18 756 до 19 тысяч и вычти из 72 тысяч.', 'Round 18,756 to 19 thousand and subtract from 72 thousand.'), answer: L("Avval birliklarga eng yaqin nol bo'lmagan xona — 2 minglikdan maydalang: 7 | 1 | 9 | 9 | 10. Minglar ustunida 1 dan 8 ni ayirish uchun keyin 7 o'n minglikdan maydalang.", 'Сначала выполни размен из ближайшего к единицам ненулевого разряда — из 2 тысяч: 7 | 1 | 9 | 9 | 10. Затем, чтобы вычесть 8 тысяч из 1 тысячи, выполни размен из 7 десятков тысяч.', 'First exchange from the nearest non-zero place to the ones — the 2 thousands: 7 | 1 | 9 | 9 | 10. Then, to subtract 8 thousands from 1 thousand, exchange from the 7 ten-thousands.'), check: L("Ayirishni ayirma va ayriluvchini qo'shish bilan tekshiring.", 'Проверь вычитание сложением разности и вычитаемого.', 'Check subtraction by adding the difference and subtrahend.') },
    solution: { title: Y, steps: [L('Kitoblar yuborildi, shuning uchun ayiramiz. 72 000 − 19 000 ≈ 53 000.', 'Книги отправили, поэтому вычитаем. 72 000 − 19 000 ≈ 53 000.', 'Books were sent away, so subtract. 72,000 − 19,000 ≈ 53,000.'), L("Birliklar uchun 2 minglikdan 1 minglikni maydalaymiz: 7 | 1 | 9 | 9 | 10.", 'Для единиц размениваем 1 из 2 тысяч: 7 | 1 | 9 | 9 | 10.', 'For the ones, exchange 1 of the 2 thousands: 7 | 1 | 9 | 9 | 10.'), L("Birlar: 10 − 6 = 4; o'nlar: 9 − 5 = 4; yuzlar: 9 − 7 = 2.", 'Единицы: 10 − 6 = 4; десятки: 9 − 5 = 4; сотни: 9 − 7 = 2.', 'Ones: 10 − 6 = 4; tens: 9 − 5 = 4; hundreds: 9 − 7 = 2.'), L("Minglarda 1 − 8 yetmaydi. 7 o'n minglik 6 bo'ladi, 1 minglik 11 minglik bo'ladi: 11 − 8 = 3; 6 − 1 = 5. 72 000 − 18 756 = 53 244; tekshiruv 53 244 + 18 756 = 72 000.", 'В тысячах 1 − 8 выполнить нельзя. 7 десятков тысяч становятся 6, а 1 тысяча превращается в 11 тысяч: 11 − 8 = 3; 6 − 1 = 5. 72 000 − 18 756 = 53 244; проверка: 53 244 + 18 756 = 72 000.', 'In the thousands column, 1 − 8 cannot be done. The 7 ten-thousands become 6, and 1 thousand becomes 11 thousands: 11 − 8 = 3; 6 − 1 = 5. 72,000 − 18,756 = 53,244; check: 53,244 + 18,756 = 72,000.')]},
    audio: {
      intro: L("Omborda yetmish ikki mingta kitob bor edi. O'n sakkiz ming yetti yuz ellik oltitasi yuborildi. Qoldiqni taxmin qiling, hisoblang va tekshiring.", 'На складе было семьдесят две тысячи книг. Восемнадцать тысяч семьсот пятьдесят шесть отправили. Оцени остаток, вычисли и проверь.', 'The warehouse held seventy-two thousand books. Eighteen thousand seven hundred and fifty-six were sent away. Estimate the remainder, calculate and check.'),
      wrong: {
        operation: L("Kitoblar ombordan chiqarildi, shuning uchun ayirish amalini tanlang.", 'Книги отправили со склада, поэтому выбери вычитание.', 'Books left the warehouse, so choose subtraction.'),
        estimate: L("O'n sakkiz ming yetti yuz ellik oltini o'n to'qqiz mingga yaxlitlab, yetmish ikki mingdan ayiring.", 'Округли восемнадцать тысяч семьсот пятьдесят шесть до девятнадцати тысяч и вычти из семидесяти двух тысяч.', 'Round eighteen thousand seven hundred and fifty-six to nineteen thousand and subtract from seventy-two thousand.'),
        answer: L("Avval birliklarga eng yaqin nol bo'lmagan xona, ikki minglikdan maydalang. Keyin minglar ustunida bir minglikdan sakkiz minglikni ayirish uchun yetti o'n minglikdan maydalang.", 'Сначала выполни размен из ближайшего к единицам ненулевого разряда, из двух тысяч. Затем, чтобы вычесть восемь тысяч из одной тысячи, выполни размен из семи десятков тысяч.', 'First exchange from the nearest non-zero place to the ones, the two thousands. Then, to subtract eight thousands from one thousand, exchange from the seven ten-thousands.'),
        check: L("Ayirishni ayirma va ayriluvchini qo'shish bilan tekshiring.", 'Проверь вычитание сложением разности и вычитаемого.', 'Check subtraction by adding the difference and subtrahend.'),
      },
      on_correct: L("To'g'ri. Natija va tekshiruv mos.", 'Верно. Результат и проверка согласуются.', 'Correct. The result and check agree.'),
      on_wrong: L("Javob ellik uch ming atrofida bo'lishi kerak.", 'Ответ должен быть около пятидесяти трёх тысяч.', 'The answer should be about fifty-three thousand.'),
    },
  },

  s15: {
    eyebrow: L('Missiya yakuni', 'Итог миссии', 'Mission complete'),
    title: L('Kutubxona hisobi tiklandi', 'Расчёт библиотеки восстановлен', 'The library calculation is restored'),
    hookClose: L("72 384 ta kitobga 8 596 ta kitob to'g'ri qo'shildi. Tizim jami 80 980 ta kitobni qayd etdi.", 'К 72 384 книгам верно добавлены 8 596 книг. Система зафиксировала 80 980 книг.', 'The 8,596 new books were correctly added to 72,384. The system recorded 80,980 books.'),
    reflectionStart: L('Ustun usulida hisoblashda avval men…', 'При вычислении столбиком сначала я…', 'When using the column method, first I…'),
    reflectionQuestion: L("Birinchi to'g'ri harakatni tanlang.", 'Выбери первое верное действие.', 'Choose the correct first action.'),
    reflectionOptions: [L("sonlarni birlar xonasi bo'yicha tekislayman", 'выравниваю числа по разряду единиц', 'align the numbers by their ones places'), L('raqamlarni chapdan tekislayman', 'выравниваю цифры слева', 'align the digits on the left'), L('darhol eng katta xonadan hisoblayman', 'сразу считаю со старшего разряда', 'start calculating from the greatest place')],
    reflectionCorrectIndex: 0,
    reflectionCorrectText: L("To'g'ri. Xona bo'yicha tekislash keyingi barcha qadamlarning ma'nosini saqlaydi.", 'Верно. Выравнивание по разрядам сохраняет смысл всех последующих шагов.', 'Correct. Aligning by place value preserves the meaning of every later step.'),
    reflectionWrong: [null, L("Chapdan tekislash bir xil xonalarni turli ustunlarga suradi.", 'Выравнивание слева сдвигает одинаковые разряды в разные столбцы.', 'Aligning on the left moves matching places into different columns.'), L("Hisoblashdan oldin sonlarni xona bo'yicha tekislash kerak.", 'До вычисления нужно выровнять числа по разрядам.', 'Before calculating, align the numbers by place value.')],
    mainLabel: L('Asosiy qoida', 'Главное правило', 'Key rule'),
    main: [L('Birlar ostiga birlar yoziladi.', 'Единицы записываются под единицами.', 'Ones are written under ones.'), L("Qo'shishda 10 ta kichik birlik keyingi xonaning 1 birligiga yiriklashtiriladi.", 'При сложении 10 меньших единиц укрупняются в 1 единицу следующего разряда.', 'In addition, 10 smaller units are regrouped as 1 unit of the next place.'), L("Ayirishda eng yaqin nol bo'lmagan chap xonadan maydalash boshlanadi.", 'При вычитании размен начинается с ближайшего ненулевого разряда слева.', 'In subtraction, exchange begins from the nearest non-zero place on the left.'), L('Javob taxmin va teskari amal bilan tekshiriladi.', 'Ответ проверяется оценкой и обратным действием.', 'The answer is checked with an estimate and an inverse operation.')],
    awardTitle: L('Aniq hisob ustasi', 'Мастер точных вычислений', 'Master of Exact Calculation'),
    claimLabel: L('Unvonni olish', 'Получить звание', 'Claim title'),
    earnedLabel: L('Siz olgan unvon', 'Полученное звание', 'Title earned'),
    scoreLabel: L('Birinchi urinishdagi natija', 'Результат с первой попытки', 'First-attempt score'),
    finishLabel: L('Darsni tugatish', 'Завершить урок', 'Finish lesson'),
    nextLabel: L('Keyingi missiya', 'Следующая миссия', 'Next mission'),
    nextText: L("Ko'p xonali sonni bir xonali songa ustun usulida ko'paytirish.", 'Умножение многозначного числа на однозначное столбиком.', 'Multiplying a multi-digit number by a one-digit number using the column method.'),
    audio: { intro: L("Kutubxona hisobi tiklandi. Tekislash, qo'shishda ko'chirish, ayirishda maydalash va tekshirish bitta usulga birlashdi. Yakuniy fikrni to'ldiring.", 'Расчёт библиотеки восстановлен. Выравнивание, перенос при сложении, размен при вычитании и проверка объединились в один способ. Заверши итоговую мысль.', 'The library calculation is restored. Alignment, carrying in addition, exchanging in subtraction and checking now form one method. Complete the final reflection.'), on_correct: L("To'g'ri. Endi unvonni olish mumkin.", 'Верно. Теперь можно получить звание.', 'Correct. The title can now be claimed.'), on_wrong: L("Hisoblashdan oldingi ustun yozuvini eslang.", 'Вспомни запись столбиком перед вычислением.', 'Recall the column layout before calculating.'), on_claim: L("Aniq hisob ustasi unvoni olindi. Siz natijani topdingiz va tekshirdingiz.", 'Звание Мастер точных вычислений получено. Вы нашли результат и проверили его.', 'The Master of Exact Calculation title has been earned. You found the result and checked it.') },
  },
};

const buildTtsUrl = (base, text, gender) => (
  `${base}/api/tts?text=${encodeURIComponent(String(text).slice(0, 1000))}&g=${gender === 'm' ? 'm' : 'f'}`
);

class AudioEngine {
  constructor() {
    this.queue = [];
    this.index = 0;
    this.audio = null;
    this.previewUtterance = null;
    this.previewTimer = null;
    this.lang = 'uz';
    this.muted = false;
    this.isPlaying = false;
    this.onStateChange = null;
  }

  emit(extra = {}) {
    this.onStateChange?.({ isPlaying: this.isPlaying, muted: this.muted, ...extra });
  }

  ensureAudio() {
    if (!this.audio && typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'auto';
    }
    return this.audio;
  }

  setLang(lang) { this.lang = lang; }

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
    if (runtimeConfig.ttsApiBase) {
      const audio = this.ensureAudio();
      if (!audio) { done?.(); return; }
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
      audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, text, runtimeConfig.voiceGender);
      const promise = audio.play();
      promise?.then?.(() => {
        this.isPlaying = true;
        this.emit({ currentSegment: id });
      }).catch(() => {
        this.isPlaying = false;
        this.emit({ completed: true, currentSegment: null });
        done?.();
      });
      return;
    }
    if (!runtimeConfig.previewMode || typeof window === 'undefined' || !window.speechSynthesis) {
      done?.();
      return;
    }
    window.speechSynthesis.cancel();
    const Utterance = window.SpeechSynthesisUtterance || globalThis.SpeechSynthesisUtterance;
    if (!Utterance) { done?.(); return; }
    const utterance = new Utterance(String(text));
    utterance.lang = SPEECH_LOCALES[this.lang] ?? SPEECH_LOCALES.uz;
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
    utterance.onerror = utterance.onend;
    this.previewUtterance = utterance;
    this.previewTimer = window.setTimeout(() => {
      this.previewTimer = null;
      if (this.previewUtterance !== utterance || this.muted) return;
      try { window.speechSynthesis.speak(utterance); } catch { done?.(); }
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
      } catch { /* best effort */ }
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
    if (runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* best effort */ }
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
  const localized = audioValue[lang] ?? '';
  const values = Array.isArray(localized) ? localized : [localized];
  return values.filter(Boolean).map((text, index) => ({ id: `${prefix}-${index}`, text }));
};

function useScreenAudio(c, screen) {
  const lang = useLang();
  const value = c.audio?.intro ?? c.audio;
  const segments = useMemo(() => {
    const localized = localizedSegments(value, lang, `s${screen}`);
    // Explanation/rule arrays contain an intro followed by action-bound beats.
    // Only the intro is automatic; later beats are narrated by their own click.
    return c.audio?.intro ? localized : localized.slice(0, 1);
  }, [value, c.audio, lang, screen]);
  return useAudio(segments);
}

function useCanAnswer(audio) {
  return audio.muted || audio.completed;
}

function useAdvanceGate(solved, audio) {
  const [delayElapsed, setDelayElapsed] = useState(false);
  useEffect(() => {
    if (!solved) return undefined;
    const timer = window.setTimeout(() => setDelayElapsed(true), 900);
    return () => window.clearTimeout(timer);
  }, [solved]);
  if (!solved) return false;
  if (audio.muted) return true;
  return delayElapsed && !audio.isPlaying;
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined' || typeof Audio === 'undefined') return;
  try {
    const sound = new Audio(url);
    sound.volume = 0.6;
    sound.play()?.catch?.(() => {});
  } catch { /* non-blocking */ }
};

const reactionCopy = (correct, lang) => (
  correct
    ? { uz: "Aniq topdingiz!", ru: 'Точно найдено!', en: 'Exactly right!' }[lang]
    : { uz: "Yana bir belgini tekshiring.", ru: 'Проверьте ещё один признак.', en: 'Check one more clue.' }[lang]
);

const pushFeedbackAudio = (audio, t, lang, correct, detail) => {
  audio.pushOneOff(`${reactionCopy(correct, lang)} ${t(detail)}`.trim());
};

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const muteLabel = audio.muted
    ? B('Ovozni yoqish', 'Включить звук', 'Turn sound on')[lang]
    : B("Ovozni o'chirish", 'Выключить звук', 'Turn sound off')[lang];
  const replayLabel = B('Qayta eshitish', 'Повторить', 'Replay')[lang];
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>↻</button>
      )}
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    hook: B('Missiya', 'Миссия', 'Mission'),
    exploration: B('Kashfiyot', 'Исследование', 'Exploration'),
    rule: B('Qoida', 'Правило', 'Rule'),
    practice: B('Mashq', 'Практика', 'Practice'),
    test: B('Tekshiruv', 'Проверка', 'Check'),
    case: B('Vazifa', 'Задача', 'Problem'),
    summary: B('Yakun', 'Итог', 'Summary'),
  };
  return <span className="screen-type">{labels[type]?.[lang] ?? type}</span>;
};

const NextLabel = () => B('Davom etish', 'Продолжить', 'Continue')[useLang()];
const BackLabel = () => B('Orqaga', 'Назад', 'Back')[useLang()];

const NavBack = ({ onClick, hidden = false }) => (
  hidden ? <span /> : <button type="button" className="btn btn-ghost" onClick={onClick}><span aria-hidden="true">←</span> <BackLabel /></button>
);

const NavNext = ({ onClick, disabled, finish = false, label }) => {
  const lang = useLang();
  return (
    <button type="button" className={`btn btn-white-accent ${!disabled ? 'btn-ready' : ''}`} disabled={disabled} onClick={onClick}>
      {label || (finish ? B('Darsni yakunlash', 'Завершить урок', 'Finish lesson')[lang] : <NextLabel />)}
      <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

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

const BitCoach = ({ text, mood = 'present' }) => (
  <aside className={`bit-coach bit-coach-${mood}`}><div className="bit-coach-figure"><BitSVG state={mood} /></div><p>{text}</p></aside>
);

const FeedbackBlock = ({ show, correct, children }) => {
  const lang = useLang();
  const label = correct
    ? B('YECHIM', 'РЕШЕНИЕ', 'SOLUTION')[lang]
    : B("YANA O'YLANG", 'ПРОВЕРЬТЕ СПОСОБ', 'CHECK THE METHOD')[lang];
  return (
    <div className={`feedback ${show ? 'feedback-visible' : ''}`} aria-hidden={!show} aria-live="polite">
      <div className={`feedback-card ${correct ? 'feedback-correct' : 'feedback-hint'}`} data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={show ? (correct ? 'solution' : 'wrong') : undefined}>
        <div className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'} /></div>
        <div className="feedback-copy"><strong>{label}</strong><div>{children}</div></div>
      </div>
    </div>
  );
};

const BitAnswerComment = ({ formula, label, children }) => {
  const lang = useLang();
  return (
    <div className="bit-answer-comment" data-g4-role="feedback-frame bit-answer-comment" data-g4-feedback="solution" aria-live="polite">
      <div className="bit-answer-comment-figure" data-g4-role="feedback-bit"><BitSVG state="nod" /></div>
      <div><span>{B('YECHIM', 'РЕШЕНИЕ', 'SOLUTION')[lang]}</span>{formula && <strong>{formula}</strong>}{label && <small>{label}</small>}{children}</div>
    </div>
  );
};

function Stage({ screen, eyebrow, audio, children, nav }) {
  const t = useT();
  const isMobile = useIsMobile();
  const pad = isMobile ? 14 : 48;
  const meta = SCREEN_META[screen];
  return (
    <main className={`stage stage-${meta.type} stage-screen-${screen + 1}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" role="progressbar" aria-valuemin="1" aria-valuemax={TOTAL_SCREENS} aria-valuenow={screen + 1}>
          <div className="progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title"><span className="status-dot" /><span>{t(eyebrow)}</span></div>
          <div className="chrome-actions"><ScreenTypeLabel type={meta.type} />{audio && <AudioIndicator audio={audio} />}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div>
        </div>
      </header>
      <section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{children}</section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{nav}</footer>
    </main>
  );
}

const Heading = ({ c, lead, hook = false }) => {
  const t = useT();
  return <header className="screen-heading"><div><span className="eyebrow" data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1>{lead && <p>{t(lead)}</p>}</div></header>;
};

const PlaceHeader = () => {
  const lang = useLang();
  const labels = {
    uz: ["O'N MING", 'MING', 'YUZ', "O'N", 'BIR'],
    ru: ['ДЕС. ТЫС.', 'ТЫС.', 'СОТ.', 'ДЕС.', 'ЕД.'],
    en: ['TEN THOUSANDS', 'THOUSANDS', 'HUNDREDS', 'TENS', 'ONES'],
  }[lang];
  return <div className="place-header">{labels.map((label) => <span key={label}>{label}</span>)}</div>;
};

const digitsOf = (number, size = 5) => {
  const clean = String(number).replace(/\D/g, '').padStart(size, ' ');
  return clean.slice(-size).split('');
};

function ColumnAlgorithm({ top, bottom, result, operator = '+', active = -1, carries = [], borrow = [], revealed = null, compact = false }) {
  const topDigits = digitsOf(top);
  const bottomDigits = digitsOf(bottom);
  const resultDigits = digitsOf(result);
  return (
    <div className={`column-algorithm ${compact ? 'column-compact' : ''}`}>
      <PlaceHeader />
      <div className="carry-row">{[0, 1, 2, 3, 4].map((index) => <span key={index}>{carries[index] ?? borrow[index] ?? ''}</span>)}</div>
      <div className="digit-row top-row">{topDigits.map((digit, index) => <span className={index === active ? 'digit-active' : ''} key={index}>{digit}</span>)}</div>
      <div className="digit-row bottom-row"><i>{operator}</i>{bottomDigits.map((digit, index) => <span className={index === active ? 'digit-active' : ''} key={index}>{digit}</span>)}</div>
      <div className="column-rule" />
      <div className="digit-row result-row">{resultDigits.map((digit, index) => {
        const isRevealed = digit.trim() !== '' && (revealed === null || revealed.includes(index));
        return <span className={isRevealed ? 'digit-revealed' : 'digit-hidden'} aria-hidden={!isRevealed} key={index}>{isRevealed ? digit : '\u00a0'}</span>;
      })}</div>
    </div>
  );
}

const PlaceValueGrid = ({ number, highlight = 4 }) => (
  <div className="place-value-grid"><PlaceHeader /><div>{digitsOf(number).map((digit, index) => <span className={index === highlight ? 'digit-active' : ''} key={index}>{digit}</span>)}</div></div>
);

const RegroupModel = ({ step = 0, count = 12, tens = 1, ones = 2 }) => (
  <div className="regroup-model">
    <div className={`unit-cloud ${step >= 0 ? 'model-active' : ''}`}>{Array.from({ length: count }, (_, index) => <i key={index} />)}</div>
    <span aria-hidden="true">→</span>
    <div className={`regroup-output ${step >= 1 ? 'model-active' : ''}`} aria-hidden={step < 1}>{tens > 0 && <><b>{tens}</b><small aria-hidden="true">10</small></>}{ones > 0 && <><b>{ones}</b><small aria-hidden="true">1</small></>}</div>
  </div>
);

const ZeroChainModel = ({ solved = false, state = null }) => {
  const nextState = (state ?? (solved ? '3 | 9 | 9 | 9 | 15' : '')).split('|').map((value) => value.trim()).filter(Boolean);
  return (
  <div className="zero-chain-model">
    <div><span>4</span><span>0</span><span>0</span><span>0</span><span>5</span></div>
    <i aria-hidden="true">↓</i>
    <div className={solved ? 'zero-state-solved' : ''}>{[0, 1, 2, 3, 4].map((index) => <span className={nextState[index] ? 'state-digit-visible' : 'state-digit-hidden'} key={index}>{nextState[index] ?? '·'}</span>)}</div>
  </div>
  );
};

const makeAnswer = ({ screen, question, options = null, correctIndex = null, correctAnswer = null, studentAnswerIndex = null, studentAnswer = null, firstTry, attempts, solved = true, ...extra }) => ({
  stage: SCREEN_META[screen].scope,
  screenIdx: screen,
  question,
  options,
  correctIndex,
  correctAnswer,
  studentAnswerIndex,
  studentAnswer,
  correct: firstTry,
  firstTry,
  attempts,
  solved,
  ...extra,
});

function ChoiceScreen({ screen, c, storedAnswer, onAnswer, onNext, onPrev, figure, resetOnReturn = false }) {
  const lang = useLang();
  const t = useT();
  const restored = !resetOnReturn && storedAnswer?.solved === true;
  const [picked, setPicked] = useState(restored ? c.correctIndex : null);
  const [solved, setSolved] = useState(restored);
  const [wrong, setWrong] = useState(() => new Set());
  const attempts = useRef(resetOnReturn ? 0 : (storedAnswer?.attempts ?? 0));
  const firstTry = useRef(resetOnReturn ? null : (storedAnswer?.firstTry ?? null));
  const firstPicked = useRef(resetOnReturn ? null : (storedAnswer?.studentAnswerIndex ?? null));
  const audio = useScreenAudio(c, screen);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const choose = (index) => {
    if (!canAnswer || solved || wrong.has(index)) return;
    const correct = index === c.correctIndex;
    attempts.current += 1;
    if (firstTry.current === null) {
      firstTry.current = correct;
      firstPicked.current = index;
    }
    setPicked(index);
    if (!correct) {
      setWrong((previous) => new Set([...previous, index]));
      playSfx('wrong');
      pushFeedbackAudio(audio, t, lang, false, c.wrongAudio?.[index] ?? c.wrong?.[index] ?? c.audio?.on_wrong ?? c.wrongText);
      return;
    }
    setSolved(true);
    playSfx('correct');
    pushFeedbackAudio(audio, t, lang, true, c.audio?.on_correct ?? c.correctText);
    onAnswer(makeAnswer({
      screen,
      question: t(c.question),
      options: c.options.map(t),
      correctIndex: c.correctIndex,
      correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: firstPicked.current,
      studentAnswer: t(c.options[firstPicked.current]),
      firstTry: firstTry.current,
      attempts: attempts.current,
    }));
  };

  const message = solved ? t(c.correctText) : (picked !== null ? t(c.wrong?.[picked] ?? c.wrongText) : '');
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className={`screen-stack choice-screen ${screen === 0 ? 'hook-screen' : ''}`} data-g4-screen={screen === 0 ? 'hook' : undefined}>
        <Heading c={c} lead={screen === 0 ? (c.lead ?? c.story) : (c.story ?? c.lead)} hook={screen === 0} />
        {screen === 0 && <h2 className="question-title" data-g4-role="hook-question">{t(c.question)}</h2>}
        {figure?.({ solved, picked })}
        {screen !== 0 && <h2 className="question-title">{t(c.question)}</h2>}
        <div className="answer-stage">
          <div className={`answer-layer answer-options-layer ${solved ? 'answer-layer-hidden' : ''}`}>
            <div className={`options-grid ${c.options.length === 3 ? 'options-three' : ''}`}>
              {c.options.map((option, index) => (
                <button
                  type="button"
                  className={`option ${wrong.has(index) ? 'option-wrong' : ''}`}
                  disabled={!canAnswer || solved || wrong.has(index)}
                  onClick={() => choose(index)}
                  data-g4-role={screen === 0 ? 'answer-card' : undefined}
                  data-g4-branch="choice"
                  data-g4-correct={index === c.correctIndex ? 'true' : 'false'}
                  key={index}
                ><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{t(option)}</span></button>
              ))}
            </div>
          </div>
          <div className={`answer-layer answer-proof-layer ${solved ? 'answer-layer-visible' : ''}`}>
            {solved && <BitAnswerComment formula={t(c.resultText ?? c.expression ?? (screen === 0 ? '72 384 + 8 596' : c.options[c.correctIndex]))}><p>{message}</p>{c.solution?.steps && <ul className="solution-steps">{c.solution.steps.map((step, index) => <li key={index}>{t(step)}</li>)}</ul>}</BitAnswerComment>}
          </div>
        </div>
        <FeedbackBlock show={picked !== null && !solved} correct={false}><p>{message}</p></FeedbackBlock>
      </div>
    </Stage>
  );
}

function GuidedChoiceStepsScreen({ screen, c, storedAnswer, onAnswer, onNext, onPrev, visual }) {
  const lang = useLang();
  const t = useT();
  const steps = c.steps ?? c.states ?? [];
  const restored = storedAnswer?.solved === true;
  const [picked, setPicked] = useState(restored ? c.correctIndex : null);
  const [choiceSolved, setChoiceSolved] = useState(restored);
  const [activeStep, setActiveStep] = useState(restored ? steps.length - 1 : -1);
  const [revealed, setRevealed] = useState(() => new Set(restored ? steps.map((_, index) => index) : []));
  const [wrong, setWrong] = useState(() => new Set());
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const firstPicked = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const completedRef = useRef(restored);
  const audio = useScreenAudio(c, screen);
  const canAnswer = useCanAnswer(audio);
  const complete = choiceSolved && revealed.size === steps.length;
  const canAdvance = useAdvanceGate(complete, audio);

  const choose = (index) => {
    if (!canAnswer || choiceSolved || wrong.has(index)) return;
    const correct = index === c.correctIndex;
    attempts.current += 1;
    if (firstTry.current === null) {
      firstTry.current = correct;
      firstPicked.current = index;
    }
    setPicked(index);
    if (!correct) {
      const detail = c.wrong?.[index] ?? c.wrongText;
      setWrong((previous) => new Set([...previous, index]));
      playSfx('wrong');
      pushFeedbackAudio(audio, t, lang, false, c.wrongAudio?.[index] ?? detail);
      return;
    }
    setChoiceSolved(true);
    playSfx('correct');
    pushFeedbackAudio(audio, t, lang, true, c.audio?.on_correct ?? c.correctText);
  };

  const revealStep = (index) => {
    if (!choiceSolved || index > revealed.size || revealed.has(index)) return;
    const next = new Set([...revealed, index]);
    setActiveStep(index);
    setRevealed(next);
    const narration = c.audio?.steps?.[lang]?.[index];
    if (narration) audio.pushOneOff(narration);
    if (next.size === steps.length && !completedRef.current) {
      completedRef.current = true;
      onAnswer(makeAnswer({
        screen,
        question: t(c.question),
        options: c.options.map(t),
        correctIndex: c.correctIndex,
        correctAnswer: t(c.options[c.correctIndex]),
        studentAnswerIndex: firstPicked.current,
        studentAnswer: t(c.options[firstPicked.current]),
        firstTry: firstTry.current,
        attempts: attempts.current,
        guidedSteps: steps.length,
      }));
    }
  };

  const wrongMessage = picked !== null && !choiceSolved ? t(c.wrong?.[picked] ?? c.wrongText) : '';
  const activeText = activeStep >= 0 ? t(steps[activeStep]) : t(c.correctText);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className="screen-stack guided-choice-screen" data-g4-guided-steps="true" data-qa-guided-choice="true" data-qa-guided-phase={choiceSolved ? 'steps' : 'choice'}>
        <Heading c={c} lead={c.story} />
        {visual?.({ choiceSolved, activeStep, revealed, complete })}
        {!choiceSolved ? (
          <>
            <h2 className="question-title">{t(c.question)}</h2>
            <div className="answer-stage">
              <div className="answer-layer answer-options-layer">
                <div className="options-grid options-three">{c.options.map((option, index) => <button type="button" className={`option ${wrong.has(index) ? 'option-wrong' : ''}`} disabled={!canAnswer || wrong.has(index)} onClick={() => choose(index)} data-g4-branch="choice" data-g4-correct={index === c.correctIndex ? 'true' : 'false'} key={index}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{t(option)}</span></button>)}</div>
              </div>
            </div>
            <FeedbackBlock show={Boolean(wrongMessage)} correct={false}><p>{wrongMessage}</p></FeedbackBlock>
          </>
        ) : (
          <div className="guided-step-stage" data-qa-guided-step-count={steps.length}>
            <BitCoach text={activeText} mood={complete ? 'nod' : 'point'} />
            <div className={`explanation-timeline timeline-count-${steps.length}`}>{steps.map((step, index) => {
              const isRevealed = revealed.has(index);
              return <button type="button" className={`${activeStep === index ? 'timeline-active' : ''} ${isRevealed ? 'timeline-visited' : ''}`} disabled={!canAnswer || index > revealed.size || isRevealed} onClick={() => revealStep(index)} data-qa-guided-step={index} key={index}><span>{isRevealed ? '✓' : index + 1}</span><strong>{isRevealed ? t(step) : `${B('Qadam', 'Шаг', 'Step')[lang]} ${index + 1}`}</strong></button>;
            })}</div>
            {complete && <BitAnswerComment formula={t(c.resultText)}><span className="sr-only" data-qa-guided-complete="true">complete</span><ul className="solution-steps">{c.solution.steps.map((step, index) => <li key={index}>{t(step)}</li>)}</ul></BitAnswerComment>}
          </div>
        )}
      </div>
    </Stage>
  );
}

function ReasoningRoundsScreen({ screen, c, storedAnswer, onAnswer, onNext, onPrev, visual }) {
  const lang = useLang();
  const t = useT();
  const restored = storedAnswer?.solved === true;
  const [round, setRound] = useState(restored ? c.rounds.length - 1 : 0);
  const [roundSolved, setRoundSolved] = useState(restored);
  const [completed, setCompleted] = useState(restored);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState('');
  const firstTry = useRef(storedAnswer?.subResults ?? Array(c.rounds.length).fill(null));
  const attempts = useRef(storedAnswer?.attemptsByRound ?? Array(c.rounds.length).fill(0));
  const current = c.rounds[Math.min(round, c.rounds.length - 1)];
  const audio = useScreenAudio(c, screen);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(completed, audio);

  const choose = (index) => {
    if (!canAnswer || roundSolved || wrong.has(index)) return;
    attempts.current[round] += 1;
    const correct = index === current.correctIndex;
    if (firstTry.current[round] === null) firstTry.current[round] = correct;
    if (!correct) {
      const wrongText = current.wrong?.[index] ?? current.wrongText ?? c.wrong?.[round] ?? c.wrongText;
      const wrongNarration = current.wrongAudio?.[index] ?? wrongText;
      setWrong((previous) => new Set([...previous, index]));
      setMessage(t(wrongText));
      playSfx('wrong');
      pushFeedbackAudio(audio, t, lang, false, wrongNarration);
      return;
    }
    const correctText = current.correctText ?? c.correctText;
    setRoundSolved(true);
    setMessage('');
    playSfx('correct');
    const stepNarration = Array.isArray(c.audio?.steps) ? c.audio.steps[round] : c.audio?.steps?.[lang]?.[round];
    pushFeedbackAudio(audio, t, lang, true, current.correctAudio ?? stepNarration ?? correctText);
    if (round === c.rounds.length - 1) {
      setCompleted(true);
      onAnswer(makeAnswer({
        screen,
        question: t(c.title),
        correctAnswer: c.rounds.map((item) => t(item.options[item.correctIndex])).join('; '),
        studentAnswer: 'completed',
        firstTry: firstTry.current.every(Boolean),
        attempts: attempts.current.reduce((sum, value) => sum + value, 0),
        subResults: [...firstTry.current],
        attemptsByRound: [...attempts.current],
      }));
    }
  };

  const nextRound = () => {
    if (!roundSolved || completed) return;
    setRound((value) => value + 1);
    setRoundSolved(false);
    setWrong(new Set());
    setMessage('');
  };
  const proof = current.proof ?? current.bitWork ?? `${current.expression ?? t(current.question)} = ${t(current.options[current.correctIndex])}`;

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className="screen-stack reasoning-screen" data-qa-round-console="reasoning" data-qa-round-count={c.rounds.length} data-qa-round={round}>
        <Heading c={c} lead={c.lead} />
        <div className="round-meter"><span>{round + 1} / {c.rounds.length}</span>{c.rounds.map((_, index) => <i className={index <= round ? 'round-active' : ''} key={index} />)}</div>
        {visual?.({ round, roundSolved, current })}
        <h2 className="question-title">{t(current.question ?? current.expression)}</h2>
        <div className="answer-stage">
          <div className={`answer-layer answer-options-layer ${roundSolved ? 'answer-layer-hidden' : ''}`}>
            <div className="options-grid options-three">{current.options.map((option, index) => <button type="button" className={`option ${wrong.has(index) ? 'option-wrong' : ''}`} disabled={!canAnswer || roundSolved || wrong.has(index)} onClick={() => choose(index)} data-g4-branch="choice" data-g4-correct={index === current.correctIndex ? 'true' : 'false'} key={index}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{t(option)}</span></button>)}</div>
          </div>
          <div className={`answer-layer answer-proof-layer ${roundSolved ? 'answer-layer-visible' : ''}`}>
            {roundSolved && <BitAnswerComment formula={proof} label={t(current.correctText ?? c.correctText)}>{completed && <span className="sr-only" data-qa-round-complete="true">complete</span>}{completed && c.solution?.steps && <ul className="solution-steps">{c.solution.steps.map((step, index) => <li key={index}>{t(step)}</li>)}</ul>}{!completed && <button type="button" className="btn btn-secondary" data-qa-round-next="true" disabled={!audio.muted && audio.isPlaying} onClick={nextRound}>{B('Keyingi qadam', 'Следующий шаг', 'Next step')[lang]} →</button>}</BitAnswerComment>}
          </div>
        </div>
        <FeedbackBlock show={Boolean(message) && !roundSolved} correct={false}><p>{message}</p></FeedbackBlock>
      </div>
    </Stage>
  );
}

function ExplanationScreen({ screen, c, storedAnswer, onAnswer, onNext, onPrev, visualKind }) {
  const lang = useLang();
  const t = useT();
  const restored = storedAnswer?.solved === true;
  const [phase, setPhase] = useState(restored ? c.steps.length - 1 : null);
  const [visited, setVisited] = useState(() => new Set(restored ? c.steps.map((_, index) => index) : []));
  const completedRef = useRef(restored);
  const audio = useScreenAudio(c, screen);
  const canReveal = useCanAnswer(audio);
  const finished = visited.size === c.steps.length;
  const canAdvance = useAdvanceGate(finished, audio);
  const activePhase = phase ?? 0;
  const openStep = (index) => {
    if (index > visited.size && !visited.has(index)) return;
    const nextVisited = new Set([...visited, index]);
    setPhase(index);
    setVisited(nextVisited);
    const step = c.steps[index];
    const localizedAudio = c.audio?.[lang];
    const narrationIndex = Math.min(index + 1, (localizedAudio?.length ?? 1) - 1);
    const narration = localizedAudio?.[narrationIndex] ?? t(step.action ?? step.result ?? step.prompt);
    const resultNarration = index === c.steps.length - 1 ? localizedAudio?.[narrationIndex + 1] : null;
    audio.pushOneOff([narration, resultNarration].filter(Boolean).join(' '));
    if (nextVisited.size === c.steps.length && !completedRef.current) {
      completedRef.current = true;
      onAnswer(makeAnswer({
        screen,
        question: t(c.title),
        correctAnswer: t(c.doneText ?? c.resultText ?? c.expression),
        studentAnswer: 'steps-completed',
        firstTry: true,
        attempts: c.steps.length,
        revealedSteps: c.steps.length,
      }));
    }
  };
  const renderVisual = () => {
    if (visualKind === 'align') {
      const placedCount = visited.size;
      const sourceDigits = digitsOf('6203');
      const placedDigits = sourceDigits.map((digit, index) => index >= 5 - placedCount ? digit : ' ').join('');
      return <div className="model-stack"><PlaceValueGrid number="32415" highlight={4 - activePhase} /><ColumnAlgorithm top="32415" bottom={placedDigits} result="     " active={4 - activePhase} /></div>;
    }
    const revealedDigits = [...visited].map((index) => 4 - index);
    const carryValues = ['', '', '', '', ''];
    if (visited.has(0)) carryValues[3] = '1';
    if (visited.has(1)) carryValues[2] = '1';
    if (visited.has(2)) carryValues[1] = '1';
    if (visited.has(3)) carryValues[0] = '1';
    const columnTotals = [12, 15, 12, 14, 4];
    const columnDigits = [2, 5, 2, 4, 4];
    return <div className="model-stack"><RegroupModel step={visited.size} count={columnTotals[activePhase]} tens={activePhase < 4 ? 1 : 0} ones={columnDigits[activePhase]} /><ColumnAlgorithm top="28467" bottom="15785" result="44252" active={Math.max(0, 4 - activePhase)} carries={carryValues} revealed={revealedDigits} /></div>;
  };
  const activeText = phase === null
    ? t(c.lead ?? c.instruction ?? c.expression)
    : t(c.steps[phase].action ?? c.steps[phase].result ?? c.steps[phase].prompt);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className="screen-stack explanation-screen" data-qa-explanation-steps={c.steps.length}>
        <Heading c={c} lead={c.lead ?? c.instruction} />
        <div className="explanation-layout"><div className="explanation-visual">{renderVisual()}</div><BitCoach text={activeText} mood={phase === null ? 'think' : finished ? 'nod' : 'point'} /></div>
        <div className={`explanation-timeline timeline-count-${c.steps.length}`}>{c.steps.map((step, index) => <button type="button" className={`${index === phase ? 'timeline-active' : ''} ${visited.has(index) ? 'timeline-visited' : ''}`} disabled={!canReveal || (index > visited.size && !visited.has(index))} onClick={() => openStep(index)} data-qa-explanation-step={index} key={index}><span>{visited.has(index) ? '✓' : index + 1}</span><strong>{step.expression ?? t(step.prompt ?? step.result ?? step.action)}</strong></button>)}</div>
        {finished && <div className="explanation-result" data-qa-explanation-complete="true"><BitAnswerComment formula={t(c.doneText ?? c.resultText ?? c.expression)}>{c.solution?.steps && <ul className="solution-steps">{c.solution.steps.map((step, index) => <li key={index}>{t(step)}</li>)}</ul>}</BitAnswerComment></div>}
      </div>
    </Stage>
  );
}

function ColumnRoundsScreen(props) {
  const c = props.c;
  const normalized = useMemo(() => ({
    ...c,
    rounds: c.rounds.map((item, roundIndex) => ({
      ...item,
      question: item.expression,
      correctText: c.correctText,
      correctAudio: L(
        [c.audio.uz[roundIndex + 1], roundIndex === c.rounds.length - 1 ? c.audio.uz[roundIndex + 2] : null].filter(Boolean).join(' '),
        [c.audio.ru[roundIndex + 1], roundIndex === c.rounds.length - 1 ? c.audio.ru[roundIndex + 2] : null].filter(Boolean).join(' '),
        [c.audio.en[roundIndex + 1], roundIndex === c.rounds.length - 1 ? c.audio.en[roundIndex + 2] : null].filter(Boolean).join(' '),
      ),
      wrong: [
        null,
        L("Bu variant faol ustun yig'indisiga teng emas. Ikkala raqamni qayta qo'shing.", 'Этот вариант не равен сумме активного столбца. Сложи обе цифры ещё раз.', 'This option does not equal the active-column sum. Add both digits again.'),
        L("Bu variant ustundagi raqamlardan faqat birini takrorlaydi. Ikkala raqam yig'indisi kerak.", 'Этот вариант повторяет только одну цифру столбца. Нужна сумма обеих цифр.', 'This option repeats only one digit from the column. Add both digits.'),
      ],
      wrongAudio: [
        null,
        L("Bu variant faol ustun yig'indisiga teng emas. Ikkala raqamni qayta qo'shing.", 'Этот вариант не равен сумме активного столбца. Сложи обе цифры ещё раз.', 'This option does not equal the active-column sum. Add both digits again.'),
        L("Bu variant ustundagi raqamlardan faqat birini takrorlaydi. Ikkala raqam yig'indisi kerak.", 'Этот вариант повторяет только одну цифру столбца. Нужна сумма обеих цифр.', 'This option repeats only one digit from the column. Add both digits.'),
      ],
      proof: `${item.expression} = ${item.options[item.correctIndex]}`,
    })),
  }), [c]);
  return <ReasoningRoundsScreen {...props} c={normalized} visual={({ round, roundSolved }) => {
    const revealed = Array.from({ length: round + (roundSolved ? 1 : 0) }, (_, index) => 4 - index);
    return <ColumnAlgorithm top="32415" bottom="6203" result="38618" active={4 - round} revealed={revealed} />;
  }} />;
}

function BuildPracticeScreen({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) {
  const lang = useLang();
  const t = useT();
  const target = c.rounds.flatMap((item) => [item.expectedDigit, item.expectedCarry]);
  const restored = storedAnswer?.solved === true;
  const [round, setRound] = useState(restored ? c.rounds.length - 1 : 0);
  const [slots, setSlots] = useState(restored ? target : Array(target.length).fill(null));
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [roundSolved, setRoundSolved] = useState(restored);
  const [complete, setComplete] = useState(restored);
  const [message, setMessage] = useState('');
  const firstTry = useRef(storedAnswer?.subResults ?? Array(c.rounds.length).fill(null));
  const attempts = useRef(storedAnswer?.attemptsByRound ?? Array(c.rounds.length).fill(0));
  const audio = useScreenAudio(c, screen);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(complete, audio);
  const current = c.rounds[round];
  const digitIndex = round * 2;
  const carryIndex = digitIndex + 1;

  const selectOrClear = (index) => {
    if (!canAnswer || roundSolved) return;
    if (slots[index] !== null) {
      const next = [...slots];
      next[index] = null;
      setSlots(next);
    }
    setSelectedSlot(index);
    setMessage('');
  };
  const place = (value) => {
    if (!canAnswer || roundSolved || ![digitIndex, carryIndex].includes(selectedSlot)) return;
    const next = [...slots];
    next[selectedSlot] = value;
    setSlots(next);
    setSelectedSlot(selectedSlot === digitIndex ? carryIndex : digitIndex);
    setMessage('');
  };
  const check = () => {
    if (!canAnswer || roundSolved || slots[digitIndex] === null || slots[carryIndex] === null) return;
    attempts.current[round] += 1;
    const digitCorrect = slots[digitIndex] === current.expectedDigit;
    const carryCorrect = slots[carryIndex] === current.expectedCarry;
    const correct = digitCorrect && carryCorrect;
    if (firstTry.current[round] === null) firstTry.current[round] = correct;
    if (!correct) {
      const detail = digitCorrect ? c.wrongCarryText : c.wrongDigitText;
      const narration = digitCorrect ? c.audio?.wrongCarry : c.audio?.wrongDigit;
      setMessage(t(detail));
      playSfx('wrong');
      pushFeedbackAudio(audio, t, lang, false, narration ?? detail);
      return;
    }
    setRoundSolved(true);
    setMessage('');
    playSfx('correct');
    pushFeedbackAudio(audio, t, lang, true, c.audio?.steps?.[lang]?.[round] ?? c.correctText);
    if (round === c.rounds.length - 1) {
      setComplete(true);
      onAnswer(makeAnswer({
        screen,
        question: t(c.title),
        correctAnswer: target.join(','),
        studentAnswer: slots.join(','),
        firstTry: firstTry.current.every(Boolean),
        attempts: attempts.current.reduce((sum, value) => sum + value, 0),
        subResults: [...firstTry.current],
        attemptsByRound: [...attempts.current],
        slots: [...slots],
      }));
    }
  };
  const nextRound = () => {
    if (!roundSolved || complete) return;
    const nextRoundIndex = round + 1;
    setRound(nextRoundIndex);
    setSelectedSlot(nextRoundIndex * 2);
    setRoundSolved(false);
    setMessage('');
  };

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className={`screen-stack build-screen ${roundSolved ? 'build-solved' : ''}`} data-qa-build-round-console="true" data-qa-build-round-count={c.rounds.length} data-qa-build-round={round}>
        <Heading c={c} lead={c.instruction} />
        <div className="round-meter"><span>{round + 1} / {c.rounds.length}</span>{c.rounds.map((_, index) => <i className={index <= round ? 'round-active' : ''} key={index} />)}</div>
        <div className="build-board" data-qa-build-round-answer={JSON.stringify([current.expectedDigit, current.expectedCarry])}>
          <div className="build-model"><ColumnAlgorithm top="63708" bottom="8596" result={complete ? '72304' : '     '} active={4 - round} /><strong>{current.expression}</strong></div>
          <div className="build-slots">
            <div className="build-slot-group"><span>{B('Yoziladigan raqam', 'Цифра ответа', 'Answer digit')[lang]}</span><button type="button" className={selectedSlot === digitIndex ? 'slot-selected' : ''} aria-label={`${B('Yoziladigan raqam', 'Цифра ответа', 'Answer digit')[lang]}: ${slots[digitIndex] ?? B("bo'sh", 'пусто', 'empty')[lang]}`} data-qa-build-slot={digitIndex} data-qa-filled={slots[digitIndex] !== null ? 'true' : 'false'} onClick={() => selectOrClear(digitIndex)}>{slots[digitIndex] ?? '·'}</button></div>
            <div className="build-slot-group carry-slots"><span>{B("Ko'chirish", 'Перенос', 'Carry')[lang]}</span><button type="button" className={selectedSlot === carryIndex ? 'slot-selected' : ''} aria-label={`${B("Ko'chirish", 'Перенос', 'Carry')[lang]}: ${slots[carryIndex] ?? B("bo'sh", 'пусто', 'empty')[lang]}`} data-qa-build-slot={carryIndex} data-qa-filled={slots[carryIndex] !== null ? 'true' : 'false'} onClick={() => selectOrClear(carryIndex)}>{slots[carryIndex] ?? '·'}</button></div>
          </div>
          <div className="card-tray">{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => <button type="button" data-qa-build-card={value} disabled={roundSolved} onClick={() => place(value)} key={value}>{value}</button>)}</div>
          <div className="inline-action"><button type="button" className="btn btn-white-accent" data-qa-build-round-check="true" disabled={roundSolved || slots[digitIndex] === null || slots[carryIndex] === null} onClick={check}>{B('Tekshirish', 'Проверить', 'Check')[lang]}</button></div>
        </div>
        {roundSolved && <BitAnswerComment formula={complete ? t(c.resultText) : `${current.expression}: ${current.expectedDigit} | ${current.expectedCarry}`} label={t(c.correctText)}>{complete && <span className="sr-only" data-qa-build-round-complete="true">complete</span>}{complete && c.solution?.steps && <ul className="solution-steps">{c.solution.steps.map((step, index) => <li key={index}>{t(step)}</li>)}</ul>}{!complete && <button type="button" className="btn btn-secondary" data-qa-build-round-next="true" disabled={!audio.muted && audio.isPlaying} onClick={nextRound}>{B('Keyingi ustun', 'Следующий столбец', 'Next column')[lang]} →</button>}</BitAnswerComment>}
        <FeedbackBlock show={Boolean(message)} correct={false}><p>{message}</p></FeedbackBlock>
      </div>
    </Stage>
  );
}

function RuleBuilderScreen({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) {
  const lang = useLang();
  const t = useT();
  const fragments = c.fragments.map(t);
  const restored = storedAnswer?.solved === true;
  const [built, setBuilt] = useState(restored ? c.correctOrder : []);
  const [checked, setChecked] = useState(restored);
  const [solved, setSolved] = useState(restored);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const audio = useScreenAudio(c, screen);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const add = (index) => {
    if (!canAnswer || solved || built.includes(index)) return;
    setBuilt((previous) => [...previous, index]);
    setChecked(false);
    const narration = c.audio?.[lang]?.[index + 1];
    if (narration) audio.pushOneOff(narration);
  };
  const remove = (index) => { if (!solved) { setBuilt((previous) => previous.filter((value) => value !== index)); setChecked(false); } };
  const check = () => {
    attempts.current += 1;
    const correct = built.join(',') === c.correctOrder.join(',');
    if (firstTry.current === null) firstTry.current = correct;
    setChecked(true);
    if (!correct) { playSfx('wrong'); pushFeedbackAudio(audio, t, lang, false, c.wrongText); return; }
    setSolved(true);
    playSfx('correct');
    pushFeedbackAudio(audio, t, lang, true, c.correctText);
    onAnswer(makeAnswer({ screen, question: t(c.title), options: fragments, correctAnswer: fragments.join(' '), studentAnswer: built.map((index) => fragments[index]).join(' '), firstTry: firstTry.current, attempts: attempts.current, built: [...built] }));
  };
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className="screen-stack rule-screen"><Heading c={c} />
        <div className="rule-builder" data-qa-rule-builder="true" data-qa-rule-answer={JSON.stringify(c.correctOrder)}>
          <div className="rule-built">{built.length === 0 && <span>{B("Qismlarni shu yerga yig'ing", 'Соберите части здесь', 'Build the rule here')[lang]}</span>}{built.map((index, slot) => <button type="button" data-qa-build-slot={slot} data-qa-filled="true" onClick={() => remove(index)} key={index}>{fragments[index]}</button>)}</div>
          <div className="fragment-tray">{[3, 0, 4, 1, 2].filter((index) => !built.includes(index)).map((index) => <button type="button" className="fragment" data-qa-build-card={index} disabled={!canAnswer} onClick={() => add(index)} key={index}>{fragments[index]}</button>)}</div>
          <div className="inline-action"><button type="button" className="btn btn-white-accent" data-qa-rule-check="true" disabled={built.length !== 5 || solved} onClick={check}>{B('Tekshirish', 'Проверить', 'Check')[lang]}</button></div>
        </div>
        {solved && <BitAnswerComment formula={t(c.correctText)}><span className="sr-only" data-qa-rule-complete="true">complete</span>{c.solution?.steps && <ul className="solution-steps">{c.solution.steps.map((step, index) => <li key={index}>{t(step)}</li>)}</ul>}</BitAnswerComment>}
        <FeedbackBlock show={checked && !solved} correct={false}><p>{t(c.wrongText)}</p></FeedbackBlock>
      </div>
    </Stage>
  );
}

function RapidTestConsoleScreen({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) {
  const lang = useLang();
  const t = useT();
  const restored = storedAnswer?.solved === true;
  const initialRound = Math.min(storedAnswer?.currentRound ?? (restored ? c.rounds.length - 1 : 0), c.rounds.length - 1);
  const initialWrongByRound = storedAnswer?.wrongByRound ?? Array.from({ length: c.rounds.length }, () => []);
  const [round, setRound] = useState(initialRound);
  const [roundSolved, setRoundSolved] = useState(storedAnswer?.roundSolved ?? restored);
  const [completed, setCompleted] = useState(restored);
  const wrongByRound = useRef(initialWrongByRound);
  const [wrong, setWrong] = useState(() => new Set(initialWrongByRound[initialRound] ?? []));
  const [numeric, setNumeric] = useState(storedAnswer?.numeric ?? (restored ? String(c.rounds[3].answer) : ''));
  const [message, setMessage] = useState(() => storedAnswer?.feedback ? t(storedAnswer.feedback) : '');
  const firstTry = useRef(storedAnswer?.subResults ?? Array(c.rounds.length).fill(null));
  const attempts = useRef(storedAnswer?.attemptsByRound ?? Array(c.rounds.length).fill(0));
  const [qaSnapshot, setQaSnapshot] = useState(() => ({ firstTry: storedAnswer?.subResults ?? Array(c.rounds.length).fill(null), attempts: storedAnswer?.attemptsByRound ?? Array(c.rounds.length).fill(0) }));
  const current = c.rounds[Math.min(round, c.rounds.length - 1)];
  const audio = useScreenAudio(c, screen);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(completed, audio);

  const persist = ({
    solved = false,
    currentRound = round,
    roundSolvedValue = roundSolved,
    numericValue = numeric,
    feedback = null,
    studentAnswer = 'in-progress',
  } = {}) => {
    const correctCount = firstTry.current.filter(Boolean).length;
    setQaSnapshot({ firstTry: [...firstTry.current], attempts: [...attempts.current] });
    onAnswer(makeAnswer({
      screen,
      question: t(c.title),
      correctAnswer: c.rounds.map((item) => item.kind === 'choice' ? t(item.options[item.correctIndex]) : String(item.answer)).join('; '),
      studentAnswer,
      firstTry: solved && correctCount === c.rounds.length,
      attempts: attempts.current.reduce((sum, value) => sum + value, 0),
      solved,
      currentRound,
      roundSolved: roundSolvedValue,
      subResults: [...firstTry.current],
      attemptsByRound: [...attempts.current],
      wrongByRound: wrongByRound.current.map((items) => [...items]),
      numeric: numericValue,
      feedback,
      correctCount,
      totalQuestions: c.rounds.length,
    }));
  };

  const mark = (correct, studentAnswer, wrongDetail = null, wrongNarration = null) => {
    attempts.current[round] += 1;
    if (firstTry.current[round] === null) firstTry.current[round] = correct;
    if (!correct) {
      const detail = wrongDetail ?? c.wrong[current.id];
      setMessage(t(detail));
      persist({ roundSolvedValue: false, feedback: detail, studentAnswer });
      playSfx('wrong');
      pushFeedbackAudio(audio, t, lang, false, wrongNarration ?? c.audio?.wrong?.[current.id] ?? detail);
      return;
    }
    setRoundSolved(true);
    setMessage('');
    playSfx('correct');
    pushFeedbackAudio(audio, t, lang, true, current.correctAudio ?? c.audio?.on_correct ?? c.correctText);
    if (round === c.rounds.length - 1) {
      setCompleted(true);
      persist({ solved: true, roundSolvedValue: true, feedback: null, studentAnswer });
    } else persist({ roundSolvedValue: true, feedback: null, studentAnswer });
  };
  const choose = (index) => {
    if (!canAnswer || roundSolved || wrong.has(index)) return;
    const correct = index === current.correctIndex;
    if (!correct) {
      const nextWrong = [...new Set([...wrong, index])];
      wrongByRound.current[round] = nextWrong;
      setWrong(new Set(nextWrong));
    }
    mark(correct, t(current.options[index]), current.wrong?.[index], current.wrongAudio?.[index]);
  };
  const submitNumber = () => {
    if (!canAnswer || roundSolved || numeric.trim() === '') return;
    mark(Number(numeric.replace(/\s/g, '')) === current.answer, numeric);
  };
  const nextRound = () => {
    if (!roundSolved || completed) return;
    const nextRoundIndex = round + 1;
    setRound(nextRoundIndex);
    setRoundSolved(false);
    setWrong(new Set(wrongByRound.current[nextRoundIndex] ?? []));
    setMessage('');
    persist({ currentRound: nextRoundIndex, roundSolvedValue: false, feedback: null });
  };
  const proof = current.kind === 'number'
    ? `60 002 − 24 785 = ${current.answer.toLocaleString('ru-RU')}`
    : t(current.options[current.correctIndex]);

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className="screen-stack rapid-console" data-qa-rapid-console="true" data-qa-score-units="4" data-qa-rapid-first-try={JSON.stringify(qaSnapshot.firstTry)} data-qa-rapid-attempts={JSON.stringify(qaSnapshot.attempts)} data-qa-rapid-wrong={JSON.stringify([...wrong])}><Heading c={c} />
        <div className="rapid-panel" data-qa-rapid-round={round}>
          <div className="quick-test-meter"><span>{B('Birinchi urinish hisoblanadi', 'Считается первая попытка', 'The first attempt counts')[lang]}</span><div>{c.rounds.map((_, index) => <i className={index <= round ? 'quick-meter-active' : ''} key={index} />)}</div><strong>{round + 1} / 4</strong></div>
          <h2 className="question-title">{t(current.prompt)}</h2>
          {round === 2 ? <ZeroChainModel solved={roundSolved} /> : <div className="rapid-proof">{current.id === 'alignment' ? '84 215 − 9 730' : current.id === 'carry' ? '7 + 5 = 12' : '60 002 − 24 785'}</div>}
          <div className="answer-stage">
            <div className={`answer-layer answer-options-layer ${roundSolved ? 'answer-layer-hidden' : ''}`}>
              {current.kind === 'choice' ? <div className="options-grid options-three">{current.options.map((option, index) => <button type="button" className={`option ${wrong.has(index) ? 'option-wrong' : ''}`} disabled={!canAnswer || roundSolved || wrong.has(index)} onClick={() => choose(index)} data-g4-branch="choice" data-g4-correct={index === current.correctIndex ? 'true' : 'false'} data-qa-rapid-option={index} key={index}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{t(option)}</span></button>)}</div> : <div className="numeric-row"><input type="text" inputMode="numeric" value={numeric} onChange={(event) => { setNumeric(event.target.value.replace(/[^0-9 ]/g, '')); setMessage(''); }} aria-label={t(current.prompt)} data-qa-answer={runtimeConfig.previewMode ? String(current.answer) : undefined} /><button type="button" className="btn btn-white-accent" disabled={!numeric.trim()} onClick={submitNumber}>{B('Tekshirish', 'Проверить', 'Check')[lang]}</button></div>}
            </div>
            <div className={`answer-layer answer-proof-layer ${roundSolved ? 'answer-layer-visible' : ''}`}>{roundSolved && <BitAnswerComment formula={proof} label={t(c.correctText)}>{completed && <><ul className="solution-steps">{c.solution.steps.map((step, index) => <li key={index}>{t(step)}</li>)}</ul><strong className="rapid-complete" data-qa-rapid-complete="true">{B('4 mikrotest tugadi', '4 микротеста завершены', '4 micro-tests complete')[lang]}</strong></>}{!completed && <button type="button" className="btn btn-secondary" data-qa-rapid-next="true" disabled={!audio.muted && audio.isPlaying} onClick={nextRound}>{B('Keyingi mikrotest', 'Следующий микротест', 'Next micro-check')[lang]} →</button>}</BitAnswerComment>}</div>
          </div>
        </div>
        <FeedbackBlock show={Boolean(message) && !roundSolved} correct={false}><p>{message}</p></FeedbackBlock>
      </div>
    </Stage>
  );
}

const readPoint = (element, board, side) => {
  const box = element.getBoundingClientRect();
  const host = board.getBoundingClientRect();
  return { x: side === 'left' ? box.right - host.left : box.left - host.left, y: box.top + box.height / 2 - host.top };
};

function MatchingLines({ boardRef, pairs = [], wrongPair = null, localeKey }) {
  const [geometry, setGeometry] = useState({ width: 0, height: 0, lines: [] });
  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const host = board.getBoundingClientRect();
        const allPairs = wrongPair ? [...pairs, { ...wrongPair, wrong: true }] : pairs;
        const lines = allPairs.map((pair) => {
          const left = board.querySelector(`[data-match-left="${pair.left}"]`);
          const right = board.querySelector(`[data-match-right="${pair.right}"]`);
          if (!left || !right) return null;
          return { from: readPoint(left, board, 'left'), to: readPoint(right, board, 'right'), wrong: pair.wrong };
        }).filter(Boolean);
        setGeometry({ width: host.width, height: host.height, lines });
      });
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(board);
    board.querySelectorAll('[data-match-left],[data-match-right]').forEach((node) => observer?.observe(node));
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [boardRef, pairs, wrongPair, localeKey]);
  return (
    <svg className="matching-connectors" width={geometry.width} height={geometry.height} viewBox={`0 0 ${geometry.width || 1} ${geometry.height || 1}`} aria-hidden="true">
      {geometry.lines.map((line, index) => {
        const bend = Math.max(24, (line.to.x - line.from.x) * 0.42);
        const path = `M ${line.from.x} ${line.from.y} C ${line.from.x + bend} ${line.from.y}, ${line.to.x - bend} ${line.to.y}, ${line.to.x} ${line.to.y}`;
        return <path key={`${path}-${index}`} className={line.wrong ? 'matching-connector-wrong' : 'matching-connector-correct'} d={path} fill="none" stroke={line.wrong ? T.danger : T.success} strokeWidth="4" strokeLinecap="round" />;
      })}
    </svg>
  );
}

function MatchingScreen({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) {
  const boardRef = useRef(null);
  const lang = useLang();
  const t = useT();
  const restored = storedAnswer?.solved === true;
  const [estimateSolved, setEstimateSolved] = useState(storedAnswer?.estimateSolved ?? restored);
  const [matchingStarted, setMatchingStarted] = useState(storedAnswer?.matchingStarted ?? restored);
  const [estimatePicked, setEstimatePicked] = useState(storedAnswer?.estimatePicked ?? (restored ? c.estimateCorrectIndex : null));
  const [selected, setSelected] = useState(null);
  const [pairs, setPairs] = useState(storedAnswer?.pairs ?? (restored ? { ...c.pairs } : {}));
  const [wrongPair, setWrongPair] = useState(null);
  const [message, setMessage] = useState(() => storedAnswer?.feedback ? t(storedAnswer.feedback) : '');
  const [lastCorrect, setLastCorrect] = useState(storedAnswer?.lastCorrect ?? (restored ? true : null));
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const timerRef = useRef(null);
  const audio = useScreenAudio(c, screen);
  const complete = estimateSolved && matchingStarted && Object.keys(pairs).length === c.calculations.length;
  const connectorPairs = useMemo(() => Object.entries(pairs).map(([left, right]) => ({ left, right })), [pairs]);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(complete, audio);
  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  const persist = ({
    solved = false,
    estimateSolvedValue = estimateSolved,
    matchingStartedValue = matchingStarted,
    estimatePickedValue = estimatePicked,
    pairsValue = pairs,
    feedback = null,
    lastCorrectValue = lastCorrect,
  } = {}) => {
    onAnswer(makeAnswer({
      screen,
      question: t(c.matchingInstruction),
      correctAnswer: Object.entries(c.pairs).map(([left, right]) => `${left}→${right}`).join(', '),
      studentAnswer: JSON.stringify(pairsValue),
      firstTry: firstTry.current === true,
      attempts: attempts.current,
      solved,
      estimateSolved: estimateSolvedValue,
      matchingStarted: matchingStartedValue,
      estimatePicked: estimatePickedValue,
      pairs: pairsValue,
      feedback,
      lastCorrect: lastCorrectValue,
    }));
  };

  const chooseEstimate = (index) => {
    if (!canAnswer || estimateSolved) return;
    attempts.current += 1;
    const correct = index === c.estimateCorrectIndex;
    if (firstTry.current === null) firstTry.current = correct;
    setEstimatePicked(index);
    if (!correct) {
      const detail = c.estimateWrong[index];
      firstTry.current = false;
      setMessage(t(detail));
      setLastCorrect(false);
      persist({ estimatePickedValue: index, feedback: detail, lastCorrectValue: false });
      playSfx('wrong');
      pushFeedbackAudio(audio, t, lang, false, c.estimateWrongAudio?.[index] ?? detail);
      return;
    }
    setEstimateSolved(true);
    setMessage('');
    setLastCorrect(true);
    persist({ estimateSolvedValue: true, estimatePickedValue: index, feedback: null, lastCorrectValue: true });
    playSfx('correct');
    pushFeedbackAudio(audio, t, lang, true, c.estimateCorrectAudio ?? c.estimateCorrectText);
  };

  const match = (rightId) => {
    if (!selected || pairs[selected] || Object.values(pairs).includes(rightId)) return;
    attempts.current += 1;
    const correct = c.pairs[selected] === rightId;
    if (firstTry.current === null) firstTry.current = correct;
    if (!correct) {
      firstTry.current = false;
      setWrongPair({ left: selected, right: rightId });
      setLastCorrect(false);
      setMessage(t(c.pairWrongText));
      persist({ feedback: c.pairWrongText, lastCorrectValue: false });
      playSfx('wrong');
      pushFeedbackAudio(audio, t, lang, false, c.pairWrongText);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setWrongPair(null), 1200);
      return;
    }
    const next = { ...pairs, [selected]: rightId };
    const done = Object.keys(next).length === c.calculations.length;
    setPairs(next);
    setSelected(null);
    setWrongPair(null);
    setLastCorrect(true);
    setMessage('');
    playSfx('correct');
    pushFeedbackAudio(audio, t, lang, true, done ? c.pairCorrectText : c.aria.pairConnected);
    if (done) {
      persist({ solved: true, pairsValue: next, feedback: null, lastCorrectValue: true });
    } else persist({ pairsValue: next, feedback: null, lastCorrectValue: true });
  };

  const startMatching = () => {
    setMatchingStarted(true);
    persist({ matchingStartedValue: true, feedback: null, lastCorrectValue: true });
  };

  const pairLabel = (leftId, rightId) => {
    const left = c.calculations.find((item) => item.id === leftId)?.text ?? leftId;
    const right = c.checks.find((item) => item.id === rightId)?.text ?? rightId;
    return `${left} → ${right}`;
  };

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className="screen-stack matching-screen" data-qa-matching-stage={!estimateSolved ? 'estimate' : !matchingStarted ? 'estimate-solution' : complete ? 'complete' : 'pairs'}><Heading c={c} />
        {!estimateSolved ? <section className="estimate-stage">
          <h2 className="question-title">{t(c.estimateQuestion)}</h2>
          <div className="options-grid options-three">{c.estimateOptions.map((option, index) => <button type="button" className={`option ${estimatePicked === index && index !== c.estimateCorrectIndex ? 'option-wrong' : ''}`} data-g4-branch="choice" data-g4-correct={index === c.estimateCorrectIndex ? 'true' : 'false'} onClick={() => chooseEstimate(index)} key={index}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span></button>)}</div>
          <FeedbackBlock show={Boolean(message)} correct={false}><p>{message}</p></FeedbackBlock>
        </section> : !matchingStarted ? <BitAnswerComment formula={c.estimateOptions[c.estimateCorrectIndex]} label={t(c.estimateCorrectText)}><button type="button" className="btn btn-secondary" data-qa-matching-start="true" disabled={!audio.muted && audio.isPlaying} onClick={startMatching}>{B('Juftlashni boshlash', 'Начать сопоставление', 'Start matching')[lang]} →</button></BitAnswerComment> : <>
          <h2 className="question-title">{t(c.matchingInstruction)}</h2>
          <section className="matching-board" ref={boardRef} data-g4-role="visual-frame" data-g4-mechanic="MatchingBoard" role="group" aria-label={t(c.matchingInstruction)}>
            <div className="matching-column">{c.calculations.map((item) => <button type="button" className={`match-card ${selected === item.id ? 'match-selected' : ''} ${pairs[item.id] ? 'match-done' : ''}`} aria-pressed={selected === item.id} aria-label={pairs[item.id] ? pairLabel(item.id, pairs[item.id]) : item.text} disabled={Boolean(pairs[item.id])} onClick={() => { setSelected(item.id); setMessage(t(c.aria.selectedLeft)); }} data-match-left={item.id} key={item.id}>{item.text}</button>)}</div>
            <MatchingLines boardRef={boardRef} pairs={connectorPairs} wrongPair={wrongPair} localeKey={lang} />
            <div className="matching-column">{c.checks.map((item) => {
              const leftId = Object.keys(pairs).find((key) => pairs[key] === item.id);
              return <button type="button" className={`match-card ${leftId ? 'match-done' : ''}`} aria-pressed={Boolean(leftId)} aria-label={leftId ? pairLabel(leftId, item.id) : item.text} disabled={Boolean(leftId)} onClick={() => match(item.id)} data-match-right={item.id} key={item.id}>{item.text}</button>;
            })}</div>
          </section>
          <span className="sr-only" aria-live="polite">{message}{Object.entries(pairs).map(([left, right]) => ` ${pairLabel(left, right)}.`).join('')}</span>
          {complete && <BitAnswerComment formula={t(c.pairCorrectText)}><ul className="solution-steps">{c.solution.steps.map((step, index) => <li key={index}>{t(step)}</li>)}</ul></BitAnswerComment>}
          <FeedbackBlock show={Boolean(message) && lastCorrect === false} correct={false}><p>{message}</p></FeedbackBlock>
        </>}
      </div>
    </Stage>
  );
}

const TITLE_STYLES = `
.g4-title-reveal-overlay{position:fixed;inset:0;z-index:120;display:grid;place-items:center;overflow:hidden;background:rgba(8,13,24,.78);animation:title-life 3.2s ease both}.g4-title-reveal-card{position:relative;width:100%;min-height:100dvh;display:grid;place-items:center;color:#fff;text-align:center;background:radial-gradient(circle,rgba(255,214,80,.2),transparent 34%)}.g4-title-reveal-rays{position:absolute;width:150vmax;height:150vmax;border-radius:50%;opacity:.28;background:repeating-conic-gradient(rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);animation:title-rays 3.2s linear 1}.g4-title-reveal-medal{z-index:2;width:112px;height:112px;border:6px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);font-size:52px;box-shadow:0 0 54px rgba(255,204,63,.5)}.g4-title-reveal-card h2{position:absolute;top:calc(50% + 82px);z-index:2;width:min(680px,calc(100vw - 48px));font:750 clamp(30px,5vw,58px)/1.05 'Source Serif 4',serif;text-shadow:0 4px 24px #000}.g4-title-card-stage{position:relative;min-height:116px;padding:14px 88px 14px 70px;border-radius:18px;color:#fff;background:linear-gradient(135deg,#173B52,#0E6978);overflow:hidden}.g4-title-card-stage .g1-char{position:absolute;right:4px;bottom:0;width:78px;height:98px}.g4-title-card-medal{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:#FFC23C}.g4-title-card-stage h2{font:750 clamp(17px,2.3vw,22px)/1.1 'Source Serif 4',serif}.g4-title-card-stage strong{color:#FFE284}.g4-title-claim{min-height:64px;width:100%;border:0;border-radius:16px;color:#fff;background:linear-gradient(135deg,#0E6978,#173B52);font-weight:850;cursor:pointer}@keyframes title-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}@keyframes title-rays{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.g4-title-reveal-overlay,.g4-title-reveal-rays{animation:none}.g4-title-reveal-rays{display:none}}
`;

function TitleReveal({ active, title, lang, onDone }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setTimeout(onDone, reduced ? 120 : 3900);
    return () => window.clearTimeout(timer);
  }, [active, onDone, reduced]);
  if (!active || typeof document === 'undefined') return null;
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-label={`${B('Unvon', 'Звание', 'Title')[lang]}: ${title}`}><div className="rank-boost-card g4-title-reveal-card"><div className="g4-title-reveal-rays" /><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} />)}</div><div className="rank-boost-medal g4-title-reveal-medal">★</div><h2>{title}</h2></div></div>, document.body);
}

function TitleCard({ title, score, earnedLabel, scoreLabel }) {
  const lang = useLang();
  return <div className="g4-title-card-stage" data-g4-role="title-card" role="status" aria-live="polite"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><div className="g4-title-card-medal" data-g4-role="reward-medal">★</div><span>{earnedLabel || B('SIZ OLGAN UNVON', 'ПОЛУЧЕННОЕ ЗВАНИЕ', 'TITLE EARNED')[lang]}</span><h2>{title}</h2><strong>{scoreLabel || B('Birinchi urinishdagi natija', 'Результат с первой попытки', 'First-attempt score')[lang]}: {score}/4</strong><div data-g4-role="reward-bit"><BitSVG state="happy" /></div></div>;
}

const CASE_SUCCESS_LABELS = {
  operation: L("Amal to'g'ri tanlandi.", 'Действие выбрано верно.', 'The operation is correct.'),
  estimate: L("Taxmin to'g'ri tanlandi.", 'Оценка выбрана верно.', 'The estimate is correct.'),
  answer: L('Aniq natija topildi.', 'Точный результат найден.', 'The exact result is correct.'),
  check: L("Teskari amal to'g'ri tanlandi.", 'Обратное действие выбрано верно.', 'The inverse operation is correct.'),
};

function MultiStageCaseScreen({ screen, c, storedAnswer, onAnswer, onNext, onPrev, visual }) {
  const lang = useLang();
  const t = useT();
  const restored = storedAnswer?.solved === true;
  const initialStage = Math.min(storedAnswer?.currentStage ?? (restored ? c.stages.length - 1 : 0), c.stages.length - 1);
  const initialWrongByStage = storedAnswer?.wrongByStage ?? Array.from({ length: c.stages.length }, () => []);
  const [stageIndex, setStageIndex] = useState(initialStage);
  const [stageSolved, setStageSolved] = useState(storedAnswer?.stageSolved ?? restored);
  const [complete, setComplete] = useState(restored);
  const wrongByStage = useRef(initialWrongByStage);
  const [wrong, setWrong] = useState(() => new Set(initialWrongByStage[initialStage] ?? []));
  const [numeric, setNumeric] = useState(storedAnswer?.numeric ?? '');
  const [message, setMessage] = useState(() => storedAnswer?.feedback ? t(storedAnswer.feedback) : '');
  const firstTry = useRef(storedAnswer?.subResults ?? Array(c.stages.length).fill(null));
  const attempts = useRef(storedAnswer?.attemptsByRound ?? Array(c.stages.length).fill(0));
  const current = c.stages[stageIndex];
  const audio = useScreenAudio(c, screen);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(complete, audio);

  const persist = ({
    solved = false,
    currentStage = stageIndex,
    stageSolvedValue = stageSolved,
    numericValue = numeric,
    feedback = null,
  } = {}) => {
    onAnswer(makeAnswer({
      screen,
      question: t(c.title),
      correctAnswer: c.stages.map((item) => item.kind === 'choice' ? t(item.options[item.correctIndex]) : String(item.answer)).join('; '),
      studentAnswer: solved ? 'case-completed' : 'case-in-progress',
      firstTry: solved && firstTry.current.every(Boolean),
      attempts: attempts.current.reduce((sum, value) => sum + value, 0),
      solved,
      currentStage,
      stageSolved: stageSolvedValue,
      subResults: [...firstTry.current],
      attemptsByRound: [...attempts.current],
      wrongByStage: wrongByStage.current.map((items) => [...items]),
      numeric: numericValue,
      feedback,
    }));
  };

  const mark = (correct, wrongDetail = null, wrongNarration = null) => {
    attempts.current[stageIndex] += 1;
    if (firstTry.current[stageIndex] === null) firstTry.current[stageIndex] = correct;
    if (!correct) {
      const detail = wrongDetail ?? c.wrong[current.id];
      setMessage(t(detail));
      persist({ stageSolvedValue: false, feedback: detail });
      playSfx('wrong');
      pushFeedbackAudio(audio, t, lang, false, wrongNarration ?? c.audio?.wrong?.[current.id] ?? detail);
      return;
    }
    setStageSolved(true);
    setMessage('');
    playSfx('correct');
    pushFeedbackAudio(audio, t, lang, true, current.correctAudio ?? c.audio?.on_correct ?? current.correctText ?? c.correctText);
    if (stageIndex === c.stages.length - 1) {
      setComplete(true);
      persist({ solved: true, stageSolvedValue: true, feedback: null });
    } else persist({ stageSolvedValue: true, feedback: null });
  };
  const choose = (index) => {
    if (!canAnswer || stageSolved || wrong.has(index)) return;
    const correct = index === current.correctIndex;
    if (!correct) {
      const nextWrong = [...new Set([...wrong, index])];
      wrongByStage.current[stageIndex] = nextWrong;
      setWrong(new Set(nextWrong));
    }
    mark(correct, current.wrong?.[index], current.wrongAudio?.[index]);
  };
  const submitNumber = () => {
    if (!canAnswer || stageSolved || numeric.trim() === '') return;
    mark(Number(numeric.replace(/\s/g, '')) === current.answer);
  };
  const nextStage = () => {
    if (!stageSolved || complete) return;
    const nextStageIndex = stageIndex + 1;
    setStageIndex(nextStageIndex);
    setStageSolved(false);
    setWrong(new Set(wrongByStage.current[nextStageIndex] ?? []));
    setNumeric('');
    setMessage('');
    persist({ currentStage: nextStageIndex, stageSolvedValue: false, numericValue: '', feedback: null });
  };
  const correctDisplay = current.kind === 'number' ? String(current.answer) : t(current.options[current.correctIndex]);

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className="screen-stack case-screen" data-qa-case-console="true" data-qa-case-count={c.stages.length} data-qa-case-stage={stageIndex}><Heading c={c} lead={c.story} />
        <div className="round-meter"><span>{stageIndex + 1} / {c.stages.length}</span>{c.stages.map((_, index) => <i className={index <= stageIndex ? 'round-active' : ''} key={index} />)}</div>
        {visual?.({ stageIndex, stageSolved, current })}
        <h2 className="question-title">{t(current.prompt)}</h2>
        <div className="answer-stage">
          <div className={`answer-layer answer-options-layer ${stageSolved ? 'answer-layer-hidden' : ''}`}>{current.kind === 'choice' ? <div className="options-grid options-three">{current.options.map((option, index) => <button type="button" className={`option ${wrong.has(index) ? 'option-wrong' : ''}`} disabled={!canAnswer || stageSolved || wrong.has(index)} onClick={() => choose(index)} data-g4-branch="choice" data-g4-correct={index === current.correctIndex ? 'true' : 'false'} key={index}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{t(option)}</span></button>)}</div> : <div className="numeric-row"><input type="text" inputMode="numeric" value={numeric} onChange={(event) => { setNumeric(event.target.value.replace(/[^0-9 ]/g, '')); setMessage(''); }} aria-label={t(current.prompt)} data-qa-answer={runtimeConfig.previewMode ? String(current.answer) : undefined} /><button type="button" className="btn btn-white-accent" disabled={!numeric.trim()} onClick={submitNumber}>{B('Tekshirish', 'Проверить', 'Check')[lang]}</button></div>}</div>
          <div className={`answer-layer answer-proof-layer ${stageSolved ? 'answer-layer-visible' : ''}`}>{stageSolved && <BitAnswerComment formula={correctDisplay} label={t(current.correctText ?? CASE_SUCCESS_LABELS[current.id] ?? c.correctText)}>{complete && <span className="sr-only" data-qa-case-complete="true">complete</span>}{complete && <ul className="solution-steps">{c.solution.steps.map((step, index) => <li key={index}>{t(step)}</li>)}</ul>}{!complete && <button type="button" className="btn btn-secondary" data-qa-case-next="true" disabled={!audio.muted && audio.isPlaying} onClick={nextStage}>{B('Keyingi bosqich', 'Следующий этап', 'Next stage')[lang]} →</button>}</BitAnswerComment>}</div>
        </div>
        <FeedbackBlock show={Boolean(message) && !stageSolved} correct={false}><p>{message}</p></FeedbackBlock>
      </div>
    </Stage>
  );
}

function SummaryScreen({ screen, c, answers, storedAnswer, onAnswer, titleState, setTitleState, onNext, onPrev }) {
  const lang = useLang();
  const t = useT();
  const claimedOnMount = titleState === 'claimed';
  const [reflection, setReflection] = useState(() => storedAnswer?.reflection ?? (claimedOnMount ? c.reflectionCorrectIndex : null));
  const [reflectionSolved, setReflectionSolved] = useState(() => storedAnswer?.solved === true || claimedOnMount);
  const [reflectionMessage, setReflectionMessage] = useState(() => storedAnswer?.feedback ? t(storedAnswer.feedback) : '');
  const reflectionAttempts = useRef(storedAnswer?.attempts ?? 0);
  const reflectionFirstTry = useRef(storedAnswer?.firstTry ?? null);
  const audio = useScreenAudio(c, screen);
  const finalBeat = audio.muted || audio.completed;
  const score = answers[11]?.correctCount ?? 0;
  const claimed = titleState === 'claimed';
  const revealing = titleState === 'revealing';
  const finishReveal = useCallback(() => setTitleState('claimed'), [setTitleState]);

  const chooseReflection = (index) => {
    if (!finalBeat || reflectionSolved) return;
    setReflection(index);
    const correct = index === c.reflectionCorrectIndex;
    reflectionAttempts.current += 1;
    if (reflectionFirstTry.current === null) reflectionFirstTry.current = correct;
    if (!correct) {
      const detail = c.reflectionWrong[index];
      setReflectionMessage(t(detail));
      onAnswer(makeAnswer({ screen, question: t(c.reflectionQuestion), options: c.reflectionOptions.map(t), correctIndex: c.reflectionCorrectIndex, correctAnswer: t(c.reflectionOptions[c.reflectionCorrectIndex]), studentAnswerIndex: index, studentAnswer: t(c.reflectionOptions[index]), firstTry: false, attempts: reflectionAttempts.current, solved: false, reflection: index, feedback: detail }));
      playSfx('wrong');
      pushFeedbackAudio(audio, t, lang, false, detail);
      return;
    }
    setReflectionSolved(true);
    setReflectionMessage('');
    onAnswer(makeAnswer({ screen, question: t(c.reflectionQuestion), options: c.reflectionOptions.map(t), correctIndex: c.reflectionCorrectIndex, correctAnswer: t(c.reflectionOptions[c.reflectionCorrectIndex]), studentAnswerIndex: index, studentAnswer: t(c.reflectionOptions[index]), firstTry: reflectionFirstTry.current, attempts: reflectionAttempts.current, solved: true, reflection: index, feedback: null }));
    playSfx('correct');
    pushFeedbackAudio(audio, t, lang, true, c.reflectionCorrectText);
  };
  const claim = () => {
    if (!finalBeat || !reflectionSolved || claimed || revealing) return;
    audio.pushOneOff(t(c.audio.on_claim));
    setTitleState('revealing');
  };
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!claimed} finish label={t(c.finishLabel)} /></>}>
      <div className="screen-stack summary-screen" data-qa-final-state={titleState}><style>{TITLE_STYLES}</style><TitleReveal active={revealing} title={t(c.awardTitle)} lang={lang} onDone={finishReveal} />
        <Heading c={c} lead={c.hookClose} />
        <div className="summary-grid"><section className="summary-payoff"><BitSVG state={claimed ? 'happy' : 'nod'} /><strong>80 980</strong><span>72 384 + 8 596</span></section><div><strong className="summary-label">{t(c.mainLabel)}</strong><ul>{c.main.map((point, index) => <li key={index}><span>✓</span>{t(point)}</li>)}</ul></div></div>
        {!claimed && <section className="final-reflection" data-g4-role="reflection"><span>{t(c.reflectionStart)}</span><strong>{t(c.reflectionQuestion)}</strong><div>{c.reflectionOptions.map((option, index) => <button type="button" className={reflection === index ? (reflectionSolved ? 'reflection-correct' : 'reflection-selected') : ''} aria-pressed={reflection === index} disabled={!finalBeat || reflectionSolved} onClick={() => chooseReflection(index)} data-g4-branch="choice" data-g4-correct={index === c.reflectionCorrectIndex ? 'true' : 'false'} key={index}>{t(option)}</button>)}</div></section>}
        <FeedbackBlock show={Boolean(reflectionMessage)} correct={false}><p>{reflectionMessage}</p></FeedbackBlock>
        {!claimed && !revealing && <button type="button" className="g4-title-claim" data-g4-role="title-claim" disabled={!finalBeat || !reflectionSolved} onClick={claim}>★ {t(c.claimLabel)}</button>}
        {claimed && <><TitleCard title={t(c.awardTitle)} score={score} earnedLabel={t(c.earnedLabel)} scoreLabel={t(c.scoreLabel)} /><div className="next-mission"><strong>{t(c.nextLabel)}</strong><span>{t(c.nextText)}</span></div></>}
      </div>
    </Stage>
  );
}

const Screen0 = (props) => <ChoiceScreen {...props} screen={0} c={CONTENT.s0} resetOnReturn figure={() => <div className="hook-story-frame" data-g4-role="hook-scene visual-frame"><div className="hook-story-bit" data-g4-role="hook-bit"><BitSVG state="think" /></div><div className="hook-story-model"><ColumnAlgorithm top="72384" bottom="8596" result="     " compact /></div></div>} />;
const Screen1 = (props) => <ReasoningRoundsScreen {...props} screen={1} c={CONTENT.s1} visual={({ round, roundSolved }) => <div className="foundation-model">{round === 0 ? <PlaceValueGrid number="4862" highlight={3} /> : round === 1 ? <RegroupModel step={roundSolved ? 1 : 0} count={10} tens={1} ones={0} /> : <PlaceValueGrid number="205" highlight={4} />}</div>} />;
const Screen2 = (props) => <ExplanationScreen {...props} screen={2} c={CONTENT.s2} visualKind="align" />;
const Screen3 = (props) => <ColumnRoundsScreen {...props} screen={3} c={CONTENT.s3} />;
const Screen4 = (props) => <ExplanationScreen {...props} screen={4} c={CONTENT.s4} visualKind="regroup" />;
const Screen5 = (props) => <BuildPracticeScreen {...props} screen={5} c={CONTENT.s5} />;
const Screen6 = (props) => <ReasoningRoundsScreen {...props} screen={6} c={CONTENT.s6} visual={({ current, roundSolved }) => <div className="bit-error-board"><BitSVG state={roundSolved ? 'point' : 'awkward'} /><div><span>{current.bitWork}</span>{roundSolved && <strong>{current.id === 'write12' ? '12 → 2 + 1↑' : '6 + 8 + 1↑ = 15'}</strong>}</div></div>} />;
const Screen7 = (props) => <GuidedChoiceStepsScreen {...props} screen={7} c={CONTENT.s7} visual={({ activeStep, complete }) => <ColumnAlgorithm top="15430" bottom="3210" result={complete ? '12220' : '     '} operator="−" active={activeStep < 0 ? -1 : Math.min(4, Math.max(0, 5 - activeStep))} />} />;
const Screen8 = (props) => <GuidedChoiceStepsScreen {...props} screen={8} c={CONTENT.s8} visual={({ activeStep, complete }) => {
  const borrow = activeStep >= 0 ? CONTENT.s8.states[activeStep].split('|').map((value) => value.trim()) : [];
  return <div className="state-reveal"><ColumnAlgorithm top="63241" bottom="27856" result={complete ? '35385' : '     '} operator="−" active={activeStep < 0 ? -1 : Math.max(0, 5 - activeStep)} borrow={borrow} />{activeStep >= 0 && <strong>{CONTENT.s8.states[activeStep]}</strong>}</div>;
}} />;
const Screen9 = (props) => <GuidedChoiceStepsScreen {...props} screen={9} c={CONTENT.s9} visual={({ activeStep, complete }) => <div className="state-reveal"><ZeroChainModel solved={complete} state={activeStep >= 0 ? CONTENT.s9.states[activeStep] : null} />{activeStep >= 0 && <strong>{CONTENT.s9.states[activeStep]}</strong>}</div>} />;
const Screen10 = (props) => <RuleBuilderScreen {...props} screen={10} c={CONTENT.s10} />;
const Screen11 = (props) => <RapidTestConsoleScreen {...props} screen={11} c={CONTENT.s11} />;
const Screen12 = (props) => <MatchingScreen {...props} screen={12} c={CONTENT.s12} />;
const Screen13 = (props) => <MultiStageCaseScreen {...props} screen={13} c={CONTENT.s13} visual={({ stageIndex, stageSolved }) => <div className="case-model"><span aria-hidden="true">📚</span><strong>{stageIndex === 0 ? '72 384  |  8 596' : stageIndex === 1 ? (stageSolved ? '72 000 + 9 000 ≈ 81 000' : '72 000  |  9 000') : stageIndex === 2 ? '72 384 + 8 596 = ?' : (stageSolved ? '80 980 − 8 596 = 72 384' : '80 980  |  8 596  |  72 384')}</strong></div>} />;
const Screen14 = (props) => <MultiStageCaseScreen {...props} screen={14} c={CONTENT.s14} visual={({ stageIndex, stageSolved }) => <div className="case-model case-zero">{stageIndex >= 2 ? <ColumnAlgorithm top="72000" bottom="18756" result={stageIndex > 2 || stageSolved ? '53244' : '     '} operator="−" /> : <strong>{stageIndex === 0 ? '72 000  |  18 756' : stageSolved ? '72 000 − 19 000 ≈ 53 000' : '72 000  |  19 000'}</strong>}</div>} />;
const Screen15 = (props) => <SummaryScreen {...props} screen={15} c={CONTENT.s15} />;

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15];

export default function Grade4Dars08({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
  previewMode,
}) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState(() => normalizeLang(langProp));
  const lang = normalizeLang(preview ? previewLang : langProp);
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: previewMode ?? preview });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [titleState, setTitleState] = useState('unclaimed');
  // eslint-disable-next-line react-hooks/purity -- duration is measured from mount.
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
    const rapid = answers[11];
    const totalQuestions = rapid?.totalQuestions ?? 4;
    const correctAnswers = rapid?.correctCount ?? 0;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      studentName: studentName || '',
      lang,
      durationSec: Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000)),
      totalQuestions,
      correctAnswers,
      scorePercent: Math.round((correctAnswers / totalQuestions) * 100),
      finalScore: correctAnswers,
      finalTotal: totalQuestions,
      passed: correctAnswers / totalQuestions >= 0.6,
      firstTryStats: { total: totalQuestions, firstTryCorrect: rapid?.subResults?.filter(Boolean).length ?? 0 },
      attemptsTotal: rapid?.attempts ?? 0,
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars08 preview]', payload);
  }, [answers, lang, onFinished, studentName]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));
  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="d8-root">
        {preview && <div className="preview-language" aria-label={B("Ko'rib chiqish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)} key={code}>{code.toUpperCase()}</button>)}</div>}
        <CurrentScreen key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onNext={current === TOTAL_SCREENS - 1 ? finishLesson : next} onPrev={previous} titleState={titleState} setTitleState={setTitleState} />
      </div>
    </LangContext.Provider>
  );
}

const STYLES = `
html:has(.d8-root),body:has(.d8-root),#root:has(.d8-root),.lesson-page:has(.d8-root),.lesson-frame:has(.d8-root){width:100%;height:100%;min-height:0!important;overflow:hidden!important;overscroll-behavior:none}html,body{margin:0;padding:0}.d8-root,.d8-root *{box-sizing:border-box}.d8-root{position:fixed;inset:0;overflow:clip;overscroll-behavior:none;contain:strict;isolation:isolate;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:radial-gradient(circle at 10% 14%,rgba(22,143,163,.12),transparent 30%),radial-gradient(circle at 90% 84%,rgba(255,91,53,.1),transparent 32%),linear-gradient(145deg,#F7F8F4,#EEF3F1);-webkit-font-smoothing:antialiased}.d8-root h1,.d8-root h2,.d8-root h3,.d8-root p,.d8-root ul{margin:0;padding:0}.d8-root button{font:inherit}.preview-language{position:fixed;top:8px;right:8px;z-index:40;display:flex;gap:3px;padding:3px;border-radius:999px;background:#fff;box-shadow:0 8px 20px -14px rgba(${T.shadowBase},.6)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;background:transparent;font-size:10px;font-weight:900}.preview-language .preview-active{color:#fff;background:${T.accent}}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;background:rgba(245,245,240,.9);box-shadow:0 0 50px -24px rgba(${T.shadowBase},.28)}.stage-header{flex:0 0 auto;padding-top:6px;padding-bottom:4px;background:rgba(245,245,240,.96);z-index:3}.progress-track{height:6px;margin-bottom:4px;border-radius:999px;overflow:hidden;background:rgba(135,148,157,.22)}.progress-bar{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .55s ease}.stage-chrome,.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center}.stage-chrome{justify-content:space-between;gap:12px}.chrome-title,.chrome-actions,.audio-controls{gap:8px}.chrome-title{min-width:0;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.status-dot{width:8px;height:8px;flex:0 0 auto;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font:700 12px/1 'JetBrains Mono',monospace}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:#fff;cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;position:relative;padding-top:8px;padding-bottom:8px;overflow:clip;display:flex;flex-direction:column;justify-content:center}.stage-nav{flex:0 0 auto;min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:9px;padding-bottom:max(9px,env(safe-area-inset-bottom));background:rgba(245,245,240,.98);box-shadow:0 -12px 28px -25px rgba(${T.shadowBase},.45);z-index:3}.btn{min-height:46px;padding:0 19px;border:0;border-radius:13px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:800;cursor:pointer;transition:transform .5s ease,background .5s ease,box-shadow .5s ease,opacity .5s ease}.btn:disabled{cursor:not-allowed;opacity:.42}.btn-ghost{color:${T.ink};background:transparent}.btn-white-accent{margin-left:auto;color:${T.accent};background:${T.paper};box-shadow:0 8px 22px -6px rgba(255,91,53,.3),0 0 0 1px rgba(255,91,53,.12)}.btn-ready{color:#fff;background:${T.accent}}.btn-secondary{min-height:39px;padding:0 13px;color:${T.cyan};background:${T.cyanSoft}}.screen-stack{width:100%;max-height:100%;display:flex;flex-direction:column;gap:9px}.screen-heading .eyebrow{color:${T.cyan};font-size:10px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.screen-heading h1{margin-top:3px;color:${T.navy};font:700 clamp(21px,3.1vw,31px)/1.08 'Source Serif 4',serif}.screen-heading p{margin-top:4px;color:${T.ink2};font-size:12px;line-height:1.35}.question-title{color:${T.navy};font:700 clamp(15px,2vw,19px)/1.25 'Source Serif 4',serif}
.hook-story-frame{min-height:142px;padding:9px 15px;border-radius:20px;display:grid;grid-template-columns:96px minmax(0,1fr);align-items:center;gap:14px;color:#fff;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 18px 38px -24px rgba(23,59,82,.75);overflow:hidden}.hook-story-bit{width:92px;height:116px;align-self:end}.hook-story-bit .g1-char{width:100%;height:100%}.hook-story-model{min-width:0}.hook-story-frame .column-algorithm{color:#fff;background:rgba(255,255,255,.1)}.hook-story-frame .place-header{color:rgba(255,255,255,.68)}
.options-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.options-three{grid-template-columns:repeat(3,minmax(0,1fr))}.option{min-height:54px;padding:9px 12px;border:0;border-radius:14px;display:flex;align-items:center;gap:8px;color:${T.ink};background:#fff;box-shadow:0 8px 20px -14px rgba(${T.shadowBase},.45);font-size:13px;font-weight:760;text-align:left;cursor:pointer;transition:transform .5s ease,opacity .5s ease,background .5s ease}.option:hover:not(:disabled){transform:translateY(-2px)}.option:disabled{cursor:default}.option-wrong{color:${T.danger};background:#FCEDE7;box-shadow:inset 4px 0 0 ${T.danger}}.option-letter{width:26px;height:26px;flex:0 0 26px;border-radius:8px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px/1 'JetBrains Mono',monospace}.answer-stage{position:relative;min-height:118px}.answer-layer{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;transition:opacity .55s ease,transform .55s ease}.answer-options-layer{opacity:1}.answer-layer-hidden{opacity:0;visibility:hidden;transform:translateY(-6px)}.answer-proof-layer{opacity:0;visibility:hidden;transform:translateY(8px)}.answer-layer-visible{opacity:1;visibility:visible;transform:none}.bit-answer-comment{min-height:74px;padding:8px 14px;border-radius:16px;display:grid;grid-template-columns:58px minmax(0,1fr);align-items:center;gap:12px;color:${T.ink};background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.bit-answer-comment-figure,.feedback-bit{width:54px;height:68px}.bit-answer-comment .g1-char,.feedback-bit .g1-char{width:100%;height:100%}.bit-answer-comment>div:last-child{display:flex;flex-direction:column;gap:3px}.bit-answer-comment span{color:${T.success};font-size:10px;font-weight:900;letter-spacing:.13em}.bit-answer-comment strong{color:${T.navy};font:800 17px/1.15 'JetBrains Mono',monospace}.bit-answer-comment p,.bit-answer-comment small{color:${T.ink2};font-size:12px;line-height:1.35}.solution-steps{list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 10px;color:${T.ink2};font-size:10px;line-height:1.22}.solution-steps li::before{content:'✓';margin-right:4px;color:${T.success};font-weight:900}.numeric-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}.numeric-row input{min-height:52px;width:100%;padding:0 14px;border:0;border-radius:13px;color:${T.navy};background:#fff;box-shadow:0 8px 22px -14px rgba(${T.shadowBase},.45);font:900 21px/1 'JetBrains Mono',monospace}.feedback{height:0;opacity:0;visibility:hidden;transition:height .5s ease,opacity .5s ease}.feedback:not(.feedback-visible){overflow:hidden}.feedback-visible{height:78px;opacity:1;visibility:visible}.feedback-card{height:74px;padding:7px 13px;border-radius:15px;display:grid;grid-template-columns:54px minmax(0,1fr);align-items:center;gap:10px}.feedback-correct{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.feedback-hint{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.feedback-copy strong{font-size:10px;letter-spacing:.12em}.feedback-copy p{margin-top:3px;color:${T.ink2};font-size:12px;line-height:1.3}
.place-header,.digit-row,.carry-row,.place-value-grid>div{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px}.place-header span{font-size:8px;font-weight:900;text-align:center;color:${T.ink3}}.column-algorithm,.place-value-grid{min-width:0;padding:9px 12px;border-radius:17px;color:${T.navy};background:#fff;box-shadow:0 12px 30px -22px rgba(${T.shadowBase},.48)}.carry-row{min-height:16px;color:${T.accent};font:900 10px/1 'JetBrains Mono',monospace;text-align:center}.digit-row{position:relative}.digit-row span,.place-value-grid>div span{min-height:32px;border-radius:8px;display:grid;place-items:center;background:rgba(22,143,163,.08);font:800 clamp(18px,3vw,28px)/1 'JetBrains Mono',monospace}.bottom-row{padding-left:0}.bottom-row i{position:absolute;left:-5px;top:6px;font-style:normal;font-weight:900}.column-rule{height:2px;margin:3px 0 4px;background:${T.navy}}.digit-active{color:#fff!important;background:${T.accent}!important;box-shadow:0 0 0 3px rgba(255,91,53,.15)}.result-row span{background:${T.successSoft}}.result-row .digit-hidden{color:transparent;background:rgba(22,143,163,.05)}.model-stack{display:grid;gap:7px}.place-value-grid>div{margin-top:5px}.regroup-model{min-height:74px;padding:8px 14px;border-radius:16px;display:flex;align-items:center;justify-content:center;gap:18px;background:${T.cyanSoft}}.unit-cloud{width:96px;display:grid;grid-template-columns:repeat(6,12px);gap:4px}.unit-cloud i{width:11px;height:11px;border-radius:50%;background:${T.cyan}}.regroup-output{display:grid;grid-template-columns:auto auto;gap:2px 7px;align-items:center;opacity:0;transition:opacity .55s ease}.regroup-output.model-active{opacity:1}.regroup-output b{font:900 24px/1 'JetBrains Mono',monospace}.regroup-output small{color:${T.ink2}}
.round-meter,.quick-test-meter{display:flex;align-items:center;gap:6px}.round-meter span,.quick-test-meter span{margin-right:auto;color:${T.cyan};font-size:10px;font-weight:900}.round-meter i,.quick-test-meter i{display:inline-block;width:28px;height:5px;margin-left:4px;border-radius:999px;background:rgba(135,148,157,.25)}.round-meter .round-active,.quick-test-meter .quick-meter-active{background:${T.accent};box-shadow:0 0 8px rgba(255,91,53,.35)}.explanation-layout{min-height:205px;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(210px,.65fr);gap:12px;align-items:center}.explanation-visual{min-width:0}.bit-coach{min-height:132px;padding:9px 12px;border-radius:17px;display:grid;grid-template-columns:76px minmax(0,1fr);align-items:center;gap:9px;background:${T.cyanSoft}}.bit-coach-figure{width:74px;height:94px}.bit-coach .g1-char{width:100%;height:100%}.bit-coach p{color:${T.ink2};font-size:12px;line-height:1.4;font-weight:720}.explanation-timeline{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.timeline-count-4{grid-template-columns:repeat(4,minmax(0,1fr))}.explanation-timeline button{min-height:48px;padding:6px;border:0;border-radius:12px;color:${T.ink2};background:#fff;display:flex;align-items:center;gap:6px;cursor:pointer}.explanation-timeline button:disabled{opacity:.42}.explanation-timeline span{width:24px;height:24px;flex:0 0 24px;border-radius:50%;display:grid;place-items:center;background:${T.cyanSoft};color:${T.cyan};font-size:10px;font-weight:900}.explanation-timeline strong{font-size:10px}.explanation-timeline .timeline-active,.explanation-timeline .timeline-visited{box-shadow:inset 0 0 0 2px ${T.cyan}}.explanation-result{min-height:74px}.foundation-model,.rapid-proof,.bit-error-board,.case-model{min-height:94px;padding:9px 14px;border-radius:17px;background:${T.cyanSoft}}.bit-error-board{display:grid;grid-template-columns:70px 1fr;align-items:center;gap:12px;background:${T.warnSoft}}.bit-error-board .g1-char{width:66px;height:82px}.bit-error-board div{display:grid;gap:7px}.bit-error-board span{font:900 23px/1 'JetBrains Mono',monospace}.case-model{display:flex;align-items:center;justify-content:center;gap:18px;color:${T.navy}}.case-model>span{font-size:38px}.case-model>strong{font:900 clamp(21px,3vw,30px)/1 'JetBrains Mono',monospace}.case-zero{justify-content:space-between}.case-zero .zero-chain-model{width:60%}
.zero-chain-model{min-height:94px;padding:9px;border-radius:17px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;background:${T.navy};color:#fff}.zero-chain-model>div{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}.zero-chain-model span{min-height:37px;border-radius:8px;display:grid;place-items:center;background:rgba(255,255,255,.11);font:900 19px/1 'JetBrains Mono',monospace}.zero-state-solved span{color:${T.navy};background:${T.lime}}.build-board,.rule-builder,.rapid-panel{padding:11px;border-radius:18px;background:rgba(255,255,255,.76);box-shadow:0 12px 30px -22px rgba(${T.shadowBase},.45)}.build-board{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(250px,.75fr);gap:8px 12px}.build-model{display:grid;gap:5px}.build-model>strong{text-align:center;color:${T.navy};font:900 15px/1 'JetBrains Mono',monospace}.build-slots{display:grid;gap:7px}.build-slot-group{display:grid;grid-template-columns:minmax(95px,1fr) 48px;gap:4px;align-items:center}.build-slot-group>span{color:${T.ink3};font-size:9px;font-weight:900}.build-slot-group button,.card-tray button{min-height:44px;border:0;border-radius:8px;background:${T.cyanSoft};color:${T.navy};font:900 15px/1 'JetBrains Mono',monospace;cursor:pointer}.build-slot-group .slot-selected{color:#fff;background:${T.accent};box-shadow:0 0 0 3px rgba(255,91,53,.15)}.card-tray{grid-column:1/-1;display:flex;justify-content:center;gap:7px}.card-tray button{min-width:44px;background:#fff;box-shadow:0 6px 16px -12px rgba(${T.shadowBase},.6)}.inline-action{grid-column:1/-1;display:flex;justify-content:flex-end}.rule-built{min-height:92px;padding:9px;border-radius:14px;display:flex;flex-wrap:wrap;align-content:flex-start;gap:6px;background:${T.cyanSoft}}.rule-built button,.fragment{min-height:44px;padding:7px 10px;border:0;border-radius:10px;background:#fff;color:${T.ink};font-size:11px;font-weight:750;cursor:pointer}.fragment-tray{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}.rapid-proof{display:grid;place-items:center;color:${T.navy};font:900 clamp(21px,3.5vw,33px)/1 'JetBrains Mono',monospace}.rapid-complete{color:${T.success}}
.matching-board{position:relative;min-height:250px;display:grid;grid-template-columns:minmax(0,1fr) 70px minmax(0,1fr);gap:10px;align-items:center}.matching-column{display:grid;gap:8px}.matching-column:last-child{grid-column:3}.match-card{position:relative;z-index:2;min-height:58px;padding:8px;border:0;border-radius:13px;color:${T.navy};background:#fff;box-shadow:0 8px 20px -14px rgba(${T.shadowBase},.5);font:800 12px/1.25 'JetBrains Mono',monospace;cursor:pointer}.match-selected{box-shadow:0 0 0 3px ${T.accent}}.match-done{color:${T.success};background:${T.successSoft}}.matching-connectors{position:absolute;inset:0;z-index:1;overflow:visible;pointer-events:none}.matching-connector-correct,.matching-connector-wrong{transition:d .55s ease,stroke .55s ease}.summary-grid{display:grid;grid-template-columns:minmax(200px,.7fr) minmax(0,1.3fr);gap:10px}.summary-payoff{min-height:118px;padding:8px;border-radius:17px;display:grid;grid-template-columns:75px 1fr;align-items:center;color:#fff;background:${T.navy}}.summary-payoff .g1-char{grid-row:1/3;width:70px;height:88px}.summary-payoff strong{font:900 27px/1 'JetBrains Mono',monospace}.summary-payoff span{color:rgba(255,255,255,.7);font-size:11px}.summary-label{display:block;margin-bottom:5px;color:${T.cyan};font-size:10px;text-transform:uppercase}.summary-grid ul{list-style:none;display:grid;grid-template-columns:repeat(2,1fr);gap:7px}.summary-grid li{padding:9px;border-radius:13px;display:flex;align-items:flex-start;gap:7px;background:#fff;font-size:11px;line-height:1.3}.summary-grid li span{color:${T.success};font-weight:900}.final-reflection{padding:10px;border-radius:15px;background:${T.cyanSoft}}.final-reflection>span{display:block;margin-bottom:3px;color:${T.ink2};font-size:10px}.final-reflection>strong{font:700 14px/1.2 'Source Serif 4',serif}.final-reflection>div{margin-top:7px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.final-reflection button{min-height:44px;padding:6px;border:0;border-radius:10px;background:#fff;color:${T.ink};font-size:10px;font-weight:750;cursor:pointer}.final-reflection .reflection-selected{color:#fff;background:${T.danger}}.final-reflection .reflection-correct{color:#fff;background:${T.success}}.next-mission{display:flex;gap:8px;align-items:center;padding:7px 10px;border-radius:12px;background:${T.cyanSoft};font-size:10px}.next-mission strong{color:${T.cyan}}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.d8-root button:focus-visible{outline:3px solid ${T.blue};outline-offset:2px}@media(max-width:639.98px){.stage-header{padding-top:5px;padding-bottom:3px}.stage-content{padding-top:5px;padding-bottom:5px}.stage-nav{min-height:58px;padding-top:6px}.screen-stack{gap:6px}.screen-heading h1{font-size:19px}.screen-heading p{font-size:10px;line-height:1.25}.hook-story-frame{min-height:115px;grid-template-columns:72px 1fr;padding:6px 9px;gap:7px}.hook-story-bit{width:70px;height:90px}.options-three{grid-template-columns:1fr}.option{min-height:42px;padding:6px 9px;font-size:11px}.option-letter{width:22px;height:22px;flex-basis:22px}.answer-stage{min-height:68px}.feedback-visible{height:68px}.feedback-card{height:65px}.bit-answer-comment{min-height:65px;grid-template-columns:46px 1fr}.bit-answer-comment-figure,.feedback-bit{width:44px;height:55px}.explanation-layout{min-height:171px;grid-template-columns:1fr 128px;gap:6px}.bit-coach{min-height:110px;padding:5px;grid-template-columns:48px 1fr}.bit-coach-figure{width:46px;height:60px}.bit-coach p{font-size:9px}.digit-row span,.place-value-grid>div span{min-height:26px;font-size:16px}.place-header span{font-size:6px}.explanation-timeline button{min-height:44px;padding:3px;gap:3px}.explanation-timeline span{width:19px;height:19px;flex-basis:19px}.explanation-timeline strong{font-size:8px}.foundation-model,.rapid-proof,.bit-error-board,.case-model,.zero-chain-model{min-height:75px}.build-board{grid-template-columns:1fr}.build-board>.column-algorithm{display:none}.matching-board{min-height:205px;grid-template-columns:1fr 24px 1fr;gap:4px}.match-card{min-height:50px;padding:5px;font-size:9px}.summary-grid{grid-template-columns:1fr}.summary-payoff{min-height:78px}.summary-grid ul{display:none}.final-reflection button{min-height:44px;font-size:8px}.g4-title-card-stage{min-height:86px}.round-meter i,.quick-test-meter i{width:18px}}
@media(max-height:780px){.stage-header{padding-top:4px;padding-bottom:2px}.stage-content{padding-top:4px;padding-bottom:4px}.stage-nav{min-height:56px;padding-top:5px;padding-bottom:5px}.screen-stack{gap:5px}.screen-heading h1{font-size:19px}.screen-heading p{font-size:10px}.hook-story-frame{min-height:106px}.explanation-layout{min-height:160px}.option{min-height:42px}.answer-stage{min-height:65px}.feedback-visible{height:66px}.feedback-card{height:63px}.matching-board{min-height:205px}.rule-screen .rule-built{min-height:82px}.rule-screen .fragment-tray{margin-top:4px}.summary-grid li{padding:6px}.final-reflection{padding:7px}}
@media(max-width:639.98px){.answer-stage{min-height:142px}.card-tray{flex-wrap:wrap;gap:4px}.build-model .column-algorithm{display:none}.build-board{padding:7px;gap:5px}.solution-steps{font-size:9px}.explanation-result .bit-answer-comment{min-height:70px}}
@media(max-width:639.98px) and (max-height:680px){.build-screen.build-solved .build-slots,.build-screen.build-solved .card-tray,.build-screen.build-solved .inline-action{display:none}.rule-screen .rule-builder{padding:5px}.rule-screen .rule-built,.rule-screen .fragment-tray{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3px}.rule-screen .rule-built{min-height:50px;padding:3px}.rule-screen .rule-built>span{grid-column:1/-1;align-self:center}.rule-screen .fragment-tray{margin-top:3px}.rule-screen .rule-built button,.rule-screen .fragment{min-height:44px;padding:3px 4px;font-size:9px;line-height:1.1}}
@media(min-width:640px) and (max-height:780px){.explanation-result{min-height:79px}.explanation-result .bit-answer-comment{min-height:79px;padding-top:5px;padding-bottom:5px}}
@media(prefers-reduced-motion:reduce){.d8-root *,.d8-root *::before,.d8-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
/* Grade 4 Dars01 local visual contract */
.lesson-frame .preview-language{display:none!important}
:is(.lesson-root,.d8-root):has([data-g4-screen="hook"]) .stage-content>.screen-stack{transform:none!important}
@media(max-width:639.98px){:is(.lesson-root,.d8-root):has([data-g4-screen="hook"]){width:100%!important;max-width:100%!important}:is(.lesson-root,.d8-root):has([data-g4-screen="hook"]) .stage{width:100%!important;max-width:100%!important}}
.hook-story-frame[data-g4-role~="hook-scene"]{grid-template-columns:minmax(0,1fr)!important}
.hook-story-frame[data-g4-role~="hook-scene"] .hook-story-model{grid-column:1/-1;width:100%;min-width:0;padding-right:116px}
@media(max-width:639.98px){.hook-story-frame[data-g4-role~="hook-scene"] .hook-story-model{padding-right:84px}}
:is(.lesson-root,.d8-root){font-family:'Manrope',system-ui,sans-serif}
:is(.lesson-root,.d8-root) h1{font-family:'Source Serif 4',Georgia,serif}
:is(.lesson-root,.d8-root) .question h2,
:is(.lesson-root,.d8-root) .question-card h2{font-family:'Manrope',system-ui,sans-serif}
.screen-count,[class*="formula"],[class*="equation"],[class*="proof-label"]{font-family:'JetBrains Mono',monospace}
.lead,.screen-heading p,.heading-copy p{font-size:clamp(14px,1.8vw,16px)}
[data-g4-role~="hook-title"],[data-g4-role~="hook-question"]{width:100%;text-align:left}
[data-g4-role~="hook-title"]{font:650 clamp(26px,4.2vw,36px)/1.08 'Source Serif 4',Georgia,serif;letter-spacing:-.012em}
[data-g4-role~="hook-question"]{font:750 clamp(17px,2.5vw,21px)/1.3 'Manrope',system-ui,sans-serif}
[data-g4-role~="visual-frame"]{position:relative;isolation:isolate;min-width:0;max-width:100%;overflow:hidden}
[data-g4-role~="visual-frame"] :is(img,svg,canvas,video){display:block;max-width:100%;max-height:100%}
[data-g4-role~="visual-frame"] :is(img,video){width:100%;height:100%;object-fit:contain}
[data-g4-role~="hook-scene"]{width:min(760px, 100%);min-width:0;margin-inline:auto}
[data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
[data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{position:relative;isolation:isolate;width:100%;min-width:0;min-height:206px;border-radius:24px;overflow:hidden;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
[data-g4-role~="hook-bit"]{position:absolute!important;right:42px!important;bottom:-4px!important;width:88px!important;height:110px!important;display:block!important;z-index:4}
[data-g4-role~="hook-bit"]>.bit,[data-g4-role~="hook-bit"]>.g1-char,[data-g4-role~="hook-bit"]>svg{width:100%!important;height:100%!important}
[data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;display:grid;grid-template-columns:62px minmax(0,1fr);align-items:center}
[data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:62px;height:76px}
[data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9);box-shadow:inset 4px 0 #A96F13}
[data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;grid-template-columns:51px minmax(0,1fr);background:linear-gradient(135deg,#FFFFFF,#E7F3EC);box-shadow:inset 4px 0 #227A53}
[data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px;height:64px}
[data-g4-role~="bit-answer-comment"] p,[data-g4-role~="bit-answer-comment"] .feedback-copy{font:700 clamp(15px,2vw,18px)/1.35 'Source Serif 4',Georgia,serif}
.rank-boost-overlay{animation-duration:3.8s}
@media(max-width:639.98px){
  [data-g4-role~="hook-title"]{font-size:25px}
  [data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
  [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  [data-g4-role~="hook-bit"]{right:12px!important;bottom:-7px!important;width:68px!important;height:85px!important}
  [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:54px;height:68px}
  [data-g4-feedback="solution"]{min-height:68px}
  [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px;height:59px}
}
:is(.lesson-root,.d8-root) [data-g4-role~="hook-title"]{font-size:clamp(26px,4.2vw,36px);font-family:'Source Serif 4',Georgia,serif}
:is(.lesson-root,.d8-root) [data-g4-role~="hook-question"]{font-size:clamp(17px,2.5vw,21px);font-family:'Manrope',system-ui,sans-serif}
:is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
:is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{width:min(760px,100%);margin-inline:auto;min-height:206px;border-radius:24px;overflow:hidden}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;grid-template-columns:62px minmax(0,1fr)}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:62px;height:76px}
:is(.lesson-root,.d8-root) [data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;grid-template-columns:51px minmax(0,1fr);background:linear-gradient(135deg,#FFFFFF,#E7F3EC)}
:is(.lesson-root,.d8-root) [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px;height:64px}
:is(.lesson-root,.d8-root) [data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9)}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-title"]{font-size:25px}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  :is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:54px;height:68px}
  :is(.lesson-root,.d8-root) [data-g4-feedback="solution"]{min-height:68px}
  :is(.lesson-root,.d8-root) [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px;height:59px}
}
`;
