import FractionTheoryLesson from './FractionTheoryLesson.jsx';

const L = (uz, ru) => ({ uz, ru });

const LESSON = {
  id: 'decimal_6_14',
  title: L("O'nli kasrlarni ko'paytirish va bo'lish", 'Умножение и деление десятичных дробей'),
  scoredScreens: [5, 7, 8, 10, 11, 12, 13],
  decorations: ['0,6', '1,25', '3,4', '0,08', '12,5', '2,75'],
  slides: [
    {
      type: 'title',
      eyebrow: L('Yangi mavzu', 'Новая тема'),
      title: L("O'nli kasrlarni ko'paytirish va bo'lish", 'Умножение и деление десятичных дробей'),
      subtitle: L(
        "Bugun o'nli kasrlarni ko'paytirish, bo'lish va vergul o'rnini nazorat qilishni o'rganamiz.",
        'Сегодня научимся умножать и делить десятичные дроби и контролировать положение запятой.',
      ),
      audio: L(
        "Bugungi mavzu o'nli kasrlarni ko'paytirish va bo'lish. Bugun o'nli kasrlarni ko'paytirish, bo'lish va vergul o'rnini nazorat qilishni o'rganamiz.",
        'Тема урока — умножение и деление десятичных дробей. Сегодня научимся умножать и делить десятичные дроби и контролировать положение запятой.',
      ),
      visual: { type: 'equation', expression: '1,2 × 0,3 = 0,36' },
    },
    {
      type: 'question',
      scored: false,
      eyebrow: L('Xona qiymati', 'Разрядное значение'),
      title: L("3,47 sonida 4 raqami qaysi xonada?", 'В каком разряде находится цифра 4 в числе 3,47?'),
      prompt: L("Verguldan keyingi birinchi xona nomini tanlang.", 'Выберите название первого разряда после запятой.'),
      intro: L(
        "Uch butun yuzdan qirq yetti sonida verguldan keyingi birinchi raqam to'rt. Bu raqam qaysi kasr xonasini bildirishini tanlang.",
        'В числе три целых сорок семь сотых первая цифра после запятой — четыре. Выберите разряд, который она обозначает.',
      ),
      options: [
        L("O'ndan birlar", 'Десятые'),
        L('Yuzdan birlar', 'Сотые'),
        L('Birlar', 'Единицы'),
        L('Mingdan birlar', 'Тысячные'),
      ],
      correct: 0,
      why: [
        L("Verguldan keyingi birinchi xona o'ndan birlar xonasi.", 'Первый разряд после запятой — десятые.'),
        L("3,47 sonida 4 raqami to'rtta o'ndan birni bildiradi.", 'В числе 3,47 цифра 4 обозначает четыре десятых.'),
      ],
      wrong: L("Verguldan keyin xonalarni chapdan o'ngga sanang: o'ndan birlar, yuzdan birlar.", 'Считайте разряды после запятой слева направо: десятые, сотые.'),
      visual: { type: 'cards', items: ['3', ',', '4', '7'], highlight: 2 },
    },
    {
      type: 'info',
      eyebrow: L('O‘nlik darajalari', 'Степени десяти'),
      title: L("10, 100 va 1000 ga ko'paytirish", 'Умножение на 10, 100 и 1000'),
      steps: [
        L("10 ga ko'paytirganda vergul bir xona o'ngga siljiydi: 2,35 × 10 = 23,5.", 'При умножении на 10 запятая сдвигается на один разряд вправо: 2,35 × 10 = 23,5.'),
        L("100 ga ko'paytirganda vergul ikki xona o'ngga siljiydi: 2,35 × 100 = 235.", 'При умножении на 100 запятая сдвигается на два разряда вправо: 2,35 × 100 = 235.'),
        L("1000 ga ko'paytirishda uch xona kerak bo'lsa, oxiriga nol qo'shamiz: 2,35 × 1000 = 2350.", 'При умножении на 1000 нужны три разряда, поэтому при необходимости дописываем ноль: 2,35 × 1000 = 2350.'),
      ],
      visual: { type: 'chain', items: ['2,35', '23,5', '235', '2350'], connector: '× 10 →' },
    },
    {
      type: 'rule',
      eyebrow: L('Teskari yo‘nalish', 'Обратное направление'),
      title: L("10, 100 va 1000 ga bo'lish", 'Деление на 10, 100 и 1000'),
      steps: [
        L("10 ga bo'lganda vergul bir xona chapga siljiydi: 47,2 : 10 = 4,72.", 'При делении на 10 запятая сдвигается на один разряд влево: 47,2 : 10 = 4,72.'),
        L("100 ga bo'lganda vergul ikki xona chapga siljiydi: 47,2 : 100 = 0,472.", 'При делении на 100 запятая сдвигается на два разряда влево: 47,2 : 100 = 0,472.'),
        L("Yetishmagan xonalar bosh tomondan nollar bilan to'ldiriladi.", 'Недостающие разряды слева заполняются нулями.'),
      ],
      visual: {
        type: 'steps',
        items: [
          L('Bo‘luvchidagi nollarni sanang', 'Посчитайте нули в делителе'),
          L('Vergulni shuncha xona chapga suring', 'Сдвиньте запятую влево на столько разрядов'),
          L('Bo‘sh xonaga nol yozing', 'Заполните пустой разряд нулём'),
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Ko‘paytirish algoritmi', 'Алгоритм умножения'),
      title: L("Ikki o'nli kasrni ko'paytirish", 'Умножение двух десятичных дробей'),
      steps: [
        L("Avval vergullarga e'tibor bermay, sonlarni natural sonlardek ko'paytiramiz: 12 × 3 = 36.", 'Сначала не учитываем запятые и умножаем числа как натуральные: 12 × 3 = 36.'),
        L("1,2 va 0,3 da jami ikki kasr xonasi bor.", 'В числах 1,2 и 0,3 всего два знака после запятой.'),
        L("Natijada o'ngdan ikki raqam ajratamiz: 1,2 × 0,3 = 0,36.", 'В результате отделяем справа две цифры: 1,2 × 0,3 = 0,36.'),
      ],
      visual: {
        type: 'panels',
        panels: [
          { title: L('Vergulsiz hisob', 'Счёт без запятых'), lines: ['12 × 3 = 36'] },
          { title: L('Ikki kasr xonasi', 'Два десятичных знака'), lines: ['0,36'] },
        ],
      },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Mashq', 'Практика'),
      title: L("2,4 × 0,5 ni hisoblang", 'Вычислите 2,4 × 0,5'),
      prompt: L("24 × 5 ni hisoblab, natijada ikki kasr xonasini ajrating.", 'Вычислите 24 × 5 и отделите в результате два знака после запятой.'),
      intro: L(
        "Ikki butun o'ndan to'rt bilan nol butun o'ndan beshni ko'paytiring. Vergulsiz yigirma to'rt karra besh bir yuz yigirma. Ikkita kasr xonasini ajrating.",
        'Умножьте две целых четыре десятых на ноль целых пять десятых. Без запятых двадцать четыре умножить на пять равно ста двадцати. Отделите два десятичных знака.',
      ),
      options: ['12', '1,2', '0,12', '120'],
      correct: 1,
      why: [
        L("24 × 5 = 120.", '24 × 5 = 120.'),
        L("Ko'paytuvchilarda jami ikki kasr xonasi bor. Shuning uchun 120 yozuvida o'ngdan ikki raqam ajratilib, 1,20, ya'ni 1,2 hosil bo'ladi.", 'В множителях всего два десятичных знака, поэтому из 120 получаем 1,20, то есть 1,2.'),
      ],
      wrong: L("Ikkala ko'paytuvchidagi verguldan keyingi raqamlar sonini qo'shing.", 'Сложите количество цифр после запятой в обоих множителях.'),
      fact: L("0,5 ga ko'paytirish sonning yarmini topish bilan bir xil.", 'Умножить на 0,5 — то же самое, что найти половину числа.'),
      factVisual: '2,4 × 0,5 = 1,2',
      visual: { type: 'chain', items: ['2,4 × 0,5', '24 × 5 = 120', '1,2'] },
    },
    {
      type: 'info',
      eyebrow: L('Bo‘lish algoritmi', 'Алгоритм деления'),
      title: L("O'nli kasrni natural songa bo'lish", 'Деление десятичной дроби на натуральное число'),
      steps: [
        L("8,4 : 4 misolida 8 ni 4 ga bo'lib, natijaga 2 yozamiz.", 'В примере 8,4 : 4 делим 8 на 4 и записываем в результате 2.'),
        L("Bo'linuvchidagi vergulga yetganda, bo'linmaga ham vergul qo'yamiz.", 'Когда доходим до запятой в делимом, ставим запятую и в частном.'),
        L("4 ni 4 ga bo'lib 1 ni olamiz: 8,4 : 4 = 2,1.", 'Делим 4 на 4 и получаем 1: 8,4 : 4 = 2,1.'),
      ],
      visual: { type: 'chain', items: ['8,4 : 4', '8 : 4 = 2', '4 : 4 = 1', '2,1'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Bo‘lish mashqi', 'Практика деления'),
      title: L("7,5 : 3 ni hisoblang", 'Вычислите 7,5 : 3'),
      prompt: L("Bo'linmadagi vergul o'rnini saqlab, natijani toping.", 'Сохраните положение запятой в частном и найдите результат.'),
      intro: L(
        "Yetti butun o'ndan beshni uchga bo'ling. Yetti butun o'ndan besh yetmish beshta o'ndan birga teng. Yetmish beshni uchga bo'lib, javobni o'ndan birlarda yozing.",
        'Разделите семь целых пять десятых на три. Семь целых пять десятых — это семьдесят пять десятых. Разделите семьдесят пять на три и запишите ответ в десятых.',
      ),
      options: ['25', '2,5', '0,25', '2,05'],
      correct: 1,
      why: [
        L("75 : 3 = 25.", '75 : 3 = 25.'),
        L("75 soni o'ndan birlarda olingan, shuning uchun 25 ta o'ndan bir 2,5 ga teng.", '75 взято в десятых, поэтому 25 десятых равны 2,5.'),
      ],
      wrong: L("Natijani tekshirish uchun tanlagan soningizni 3 ga ko'paytiring.", 'Для проверки умножьте выбранный результат на 3.'),
      visual: { type: 'equation', expression: '7,5 : 3 = ?' },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('O‘nli kasrga bo‘lish', 'Деление на десятичную дробь'),
      title: L("4,8 : 0,6 ni hisoblang", 'Вычислите 4,8 : 0,6'),
      prompt: L("Ikkala sonni 10 ga ko'paytirib, bo'luvchini natural songa aylantiring.", 'Умножьте оба числа на 10, чтобы делитель стал натуральным числом.'),
      intro: L(
        "To'rt butun o'ndan sakkizni nol butun o'ndan oltiga bo'lish uchun bo'linuvchi va bo'luvchini o'nga ko'paytiring. Qirq sakkizni oltiga bo'ling.",
        'Чтобы разделить четыре целых восемь десятых на ноль целых шесть десятых, умножьте делимое и делитель на десять. Разделите сорок восемь на шесть.',
      ),
      options: ['0,8', '8', '80', '7,2'],
      correct: 1,
      why: [
        L("4,8 : 0,6 = 48 : 6.", '4,8 : 0,6 = 48 : 6.'),
        L("48 : 6 = 8.", '48 : 6 = 8.'),
      ],
      wrong: L("Vergulni ikkala sonda ham bir xil bir xona o'ngga suring.", 'Сдвиньте запятую в обоих числах одинаково на один разряд вправо.'),
      visual: { type: 'chain', items: ['4,8 : 0,6', '48 : 6', '?'] },
    },
    {
      type: 'info',
      eyebrow: L('Muhim nazorat', 'Важная проверка'),
      title: L("Vergulni taxminiy qiymat bilan tekshiring", 'Проверяйте запятую оценкой результата'),
      steps: [
        L("3,9 × 2,1 taxminan 4 × 2 ga, ya'ni 8 ga yaqin bo'lishi kerak.", 'Произведение 3,9 × 2,1 должно быть близко к 4 × 2, то есть к 8.'),
        L("Aniq hisob 39 × 21 = 819; ikki kasr xonasi ajratilib 8,19 olinadi.", 'Точный расчёт: 39 × 21 = 819; отделяем два десятичных знака и получаем 8,19.'),
        L("0,819 yoki 81,9 natijalar taxminiy bahoga mos emas, demak vergul noto'g'ri qo'yilgan.", 'Результаты 0,819 и 81,9 не соответствуют оценке, значит запятая поставлена неверно.'),
      ],
      visual: { type: 'chain', items: ['3,9 × 2,1', '≈ 4 × 2', '8,19'] },
    },
    {
      type: 'multi',
      scored: true,
      eyebrow: L('Bir nechta javob', 'Несколько ответов'),
      title: L("To'g'ri tengliklarni belgilang", 'Отметьте верные равенства'),
      intro: L(
        "Vergulning siljishi va kasr xonalari sonini tekshirib, barcha to'g'ri tengliklarni belgilang.",
        'Проверьте перемещение запятой и число десятичных знаков, затем отметьте все верные равенства.',
      ),
      options: ['3,7 × 10 = 37', '5,2 : 100 = 0,052', '0,4 × 0,3 = 0,12', '8,4 : 0,7 = 1,2'],
      correctSet: [0, 1, 2],
      why: [
        L("Birinchi uchta tenglikda vergul va kasr xonalari to'g'ri hisoblangan.", 'В первых трёх равенствах запятая и число десятичных знаков определены верно.'),
        L("8,4 : 0,7 = 84 : 7 = 12, 1,2 emas.", '8,4 : 0,7 = 84 : 7 = 12, а не 1,2.'),
      ],
      wrong: L("Bo'lishda bo'luvchini natural qilish uchun vergulni ikkala sonda teng suring.", 'При делении сдвигайте запятую в обоих числах одинаково, чтобы делитель стал натуральным.'),
    },
    {
      type: 'match',
      scored: true,
      eyebrow: L('Moslashtirish', 'Соответствие'),
      title: L("Ifodalarni javoblari bilan juftlang", 'Соедините выражения с ответами'),
      prompt: L("Har bir amal uchun to'g'ri natijani tanlang.", 'Для каждого действия выберите верный результат.'),
      intro: L(
        "O'nlik darajasiga ko'ra vergulni suring yoki oddiy hisobni bajaring va mos natijani toping.",
        'Сдвиньте запятую по степени десяти или выполните обычное вычисление и найдите подходящий результат.',
      ),
      rows: [
        { left: '6,25 × 10', correct: L('62,5', '62,5') },
        { left: '48,3 : 100', correct: L('0,483', '0,483') },
        { left: '1,2 × 0,4', correct: L('0,48', '0,48') },
      ],
      why: [
        L("10 ga ko'paytirishda vergul bir xona o'ngga, 100 ga bo'lishda ikki xona chapga siljiydi.", 'При умножении на 10 запятая сдвигается вправо на один разряд, при делении на 100 — влево на два.'),
        L("1,2 × 0,4 = 0,48.", '1,2 × 0,4 = 0,48.'),
      ],
      wrong: L("Har bir ifodada amal turini va vergul nechta xona siljishini alohida tekshiring.", 'В каждом выражении отдельно проверьте действие и число разрядов сдвига запятой.'),
    },
    {
      type: 'classify',
      scored: true,
      eyebrow: L('Xatoni topamiz', 'Ищем ошибку'),
      title: L("Hisoblarni to'g'ri va xato guruhiga ajrating", 'Разделите вычисления на верные и ошибочные'),
      prompt: L("Har bir tenglikni taxminiy baho yoki teskari amal bilan tekshiring.", 'Проверьте каждое равенство оценкой или обратным действием.'),
      intro: L(
        "Natijaning kattaligiga ham e'tibor bering. Birdan kichik musbat o'nli kasrga ko'paytirish natijani kamaytiradi, shunday songa bo'lish esa natijani kattalashtirishi mumkin.",
        'Обращайте внимание и на величину результата. Умножение на число меньше единицы уменьшает результат, а деление на такое число может увеличить его.',
      ),
      binA: L("To'g'ri", 'Верно'),
      binB: L('Xato', 'Ошибка'),
      cards: [
        { label: '2,5 × 0,4 = 1', value: true },
        { label: '7,2 : 0,8 = 9', value: true },
        { label: '4,6 × 10 = 4,60', value: false },
        { label: '3,6 : 3 = 0,12', value: false },
      ],
      why: [
        L("2,5 × 0,4 = 1 va 7,2 : 0,8 = 9 tengliklari to'g'ri.", 'Равенства 2,5 × 0,4 = 1 и 7,2 : 0,8 = 9 верны.'),
        L("4,6 × 10 = 46; 3,6 : 3 = 1,2.", '4,6 × 10 = 46; 3,6 : 3 = 1,2.'),
      ],
      wrong: L("Vergulni qayerga qo'yishni taxminiy butun qiymat bilan solishtiring.", 'Сравните положение запятой с примерной целой величиной результата.'),
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("3,75 : 1,5 ni hisoblang", 'Вычислите 3,75 : 1,5'),
      prompt: L("Ikkala sonni 10 ga ko'paytirib, 37,5 : 15 ni hisoblang.", 'Умножьте оба числа на 10 и вычислите 37,5 : 15.'),
      intro: L(
        "Uch butun yuzdan yetmish beshni bir butun o'ndan beshga bo'lish uchun ikkala sonda vergulni bir xona o'ngga suring. O'ttiz yetti butun o'ndan beshni o'n beshga bo'ling.",
        'Чтобы разделить три целых семьдесят пять сотых на одну целую пять десятых, сдвиньте запятую в обоих числах на один разряд вправо. Разделите тридцать семь целых пять десятых на пятнадцать.',
      ),
      options: ['0,25', '2,5', '25', '5,25'],
      correct: 1,
      why: [
        L("3,75 : 1,5 = 37,5 : 15.", '3,75 : 1,5 = 37,5 : 15.'),
        L("37,5 : 15 = 2,5. Tekshiruv: 2,5 × 1,5 = 3,75.", '37,5 : 15 = 2,5. Проверка: 2,5 × 1,5 = 3,75.'),
      ],
      wrong: L("Natijani teskari amal bilan tekshiring: tanlangan sonni 1,5 ga ko'paytiring.", 'Проверьте результат обратным действием: умножьте выбранное число на 1,5.'),
      fact: L("Bo'linuvchi va bo'luvchini bir xil 10, 100 yoki 1000 ga ko'paytirish bo'linmani o'zgartirmaydi.", 'Умножение делимого и делителя на одно и то же число 10, 100 или 1000 не меняет частное.'),
      factVisual: '3,75 : 1,5 = 2,5',
      visual: { type: 'chain', items: ['3,75 : 1,5', '37,5 : 15', '2,5'] },
    },
    {
      type: 'summary',
      eyebrow: L('Dars yakuni', 'Итог урока'),
      title: L("O'nli kasrlar bilan amallarni o'rgandingiz", 'Вы научились действиям с десятичными дробями'),
      points: [
        L("10, 100 va 1000 ga ko'paytirishda vergul o'ngga, bo'lishda chapga siljiydi.", 'При умножении на 10, 100 и 1000 запятая сдвигается вправо, при делении — влево.'),
        L("Ko'paytmadagi kasr xonalari soni ko'paytuvchilardagi kasr xonalari jami bilan aniqlanadi.", 'Число десятичных знаков в произведении равно их общему числу в множителях.'),
        L("O'nli kasrga bo'lishda bo'luvchi natural bo'lguncha vergul ikkala sonda teng suriladi.", 'При делении на десятичную дробь запятую в обоих числах сдвигают одинаково, пока делитель не станет натуральным.'),
      ],
      close: L(
        "Endi o'nli kasrlarni ko'paytirish va bo'lishda vergul o'rnini ishonchli aniqlay olasiz.",
        'Теперь вы умеете уверенно определять положение запятой при умножении и делении десятичных дробей.',
      ),
      audio: L(
        "O'nli kasrlar bilan amallarni o'rgandingiz. O'n, yuz va mingga ko'paytirishda vergul o'ngga, bo'lishda chapga siljiydi. Ko'paytmadagi kasr xonalari soni ko'paytuvchilardagi kasr xonalari jami bilan aniqlanadi. O'nli kasrga bo'lishda bo'luvchi natural bo'lguncha vergul ikkala sonda teng suriladi. Endi o'nli kasrlarni ko'paytirish va bo'lishda vergul o'rnini ishonchli aniqlay olasiz.",
        'Вы научились действиям с десятичными дробями. При умножении на десять, сто и тысячу запятая перемещается вправо, а при делении — влево. Число знаков после запятой в произведении равно общему числу знаков после запятой в множителях. При делении на десятичную дробь запятая в обоих числах перемещается одинаково, пока делитель не станет натуральным числом. Теперь вы умеете уверенно определять положение запятой.',
      ),
    },
  ],
};

export default function Dars14(props) {
  return <FractionTheoryLesson lesson={LESSON} {...props}/>;
}
