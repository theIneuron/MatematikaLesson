import FractionTheoryLesson from './FractionTheoryLesson.jsx';

const L = (uz, ru) => ({ uz, ru });

const LESSON = {
  id: 'frac_6_11',
  title: L("Oddiy kasrlarni ko'paytirish", 'Умножение обыкновенных дробей'),
  scoredScreens: [5, 7, 8, 10, 11, 12, 13],
  decorations: ['2/3', '3/5', '2/5', '5/6', '1/2', '2/9'],
  slides: [
    {
      type: 'title',
      eyebrow: L('Yangi mavzu', 'Новая тема'),
      title: L("Oddiy kasrlarni ko'paytirish", 'Умножение обыкновенных дробей'),
      subtitle: L(
        "Bugun kasrlarni ko'paytirish, oldindan qisqartirish va natijani tekshirishni o'rganamiz.",
        'Сегодня научимся умножать дроби, выполнять сокращение до умножения и проверять результат.',
      ),
      audio: L(
        "Bugungi mavzu oddiy kasrlarni ko'paytirish. Bugun kasrlarni ko'paytirish, oldindan qisqartirish va natijani tekshirishni o'rganamiz.",
        'Тема урока — умножение обыкновенных дробей. Сегодня научимся умножать дроби, выполнять сокращение до умножения и проверять результат.',
      ),
      visual: { type: 'equation', expression: '2/3 × 3/5 = 2/5' },
    },
    {
      type: 'question',
      scored: false,
      eyebrow: L('Eslab olamiz', 'Вспомним'),
      title: L("12 ning 1/3 qismini toping", 'Найдите 1/3 от 12'),
      prompt: L("12 ni 3 ta teng qismga bo'lsak, bitta qism nechaga teng?", 'Чему равна одна часть, если разделить 12 на 3 равные части?'),
      intro: L(
        "Sonning uchdan bir qismini topish uchun uni uchta teng qismga bo'lamiz. O'n ikkini uchga bo'lib, bitta qismni tanlang.",
        'Чтобы найти одну треть числа, делим его на три равные части. Разделите двенадцать на три и выберите одну часть.',
      ),
      options: ['3', '4', '6', '9'],
      correct: 1,
      why: [
        L("12 : 3 = 4.", '12 разделить на 3 равно 4.'),
        L("Demak, 12 ning 1/3 qismi 4 ga teng.", 'Значит, одна треть от 12 равна 4.'),
      ],
      wrong: L("O'n ikkini kasrning maxraji bo'lgan 3 ga bo'ling.", 'Разделите двенадцать на знаменатель дроби, то есть на 3.'),
      visual: { type: 'equation', expression: '12 × 1/3 = ?' },
    },
    {
      type: 'info',
      eyebrow: L('Tushuncha', 'Понятие'),
      title: L("Kasrlarni ko'paytirish nimani bildiradi?", 'Что означает умножение дробей?'),
      steps: [
        L("2/3 × 3/5 ifodasi 3/5 miqdorning 2/3 qismini topishni bildiradi.", 'Выражение 2/3 × 3/5 означает нахождение двух третей от величины 3/5.'),
        L("Natijaning surati suratlar ko'paytmasidan, maxraji maxrajlar ko'paytmasidan hosil bo'ladi.", 'Числитель результата получают умножением числителей, а знаменатель — умножением знаменателей.'),
        L("2 × 3 = 6 va 3 × 5 = 15, demak 2/3 × 3/5 = 6/15 = 2/5.", '2 умножить на 3 равно 6, а 3 умножить на 5 равно 15, значит 2/3 × 3/5 = 6/15 = 2/5.'),
      ],
      visual: { type: 'chain', items: ['2/3 × 3/5', '6/15', '2/5'] },
    },
    {
      type: 'rule',
      eyebrow: L('Asosiy qoida', 'Главное правило'),
      title: L("Kasrlarni uch qadamda ko'paytiramiz", 'Умножаем дроби за три шага'),
      steps: [
        L("Birinchi qadam: imkon bo'lsa surat va maxrajdagi umumiy ko'paytuvchilarni qisqartiramiz.", 'Первый шаг: по возможности сокращаем общие множители в числителях и знаменателях.'),
        L("Ikkinchi qadam: qolgan suratlarni o'zaro, qolgan maxrajlarni o'zaro ko'paytiramiz.", 'Второй шаг: перемножаем оставшиеся числители и отдельно оставшиеся знаменатели.'),
        L("Uchinchi qadam: natija qisqarishini va javobning mantiqan to'g'riligini tekshiramiz.", 'Третий шаг: проверяем, сокращается ли результат и разумен ли полученный ответ.'),
      ],
      visual: {
        type: 'steps',
        items: [
          L('Umumiy ko‘paytuvchilarni qisqartiring', 'Сократите общие множители'),
          L('Suratlarni va maxrajlarni ko‘paytiring', 'Перемножьте числители и знаменатели'),
          L('Natijani tekshiring', 'Проверьте результат'),
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Namuna', 'Пример'),
      title: L("3/4 × 2/5 ni hisoblaymiz", 'Вычислим 3/4 × 2/5'),
      steps: [
        L("Suratlar ko'paytmasi: 3 × 2 = 6.", 'Произведение числителей: 3 × 2 = 6.'),
        L("Maxrajlar ko'paytmasi: 4 × 5 = 20.", 'Произведение знаменателей: 4 × 5 = 20.'),
        L("6/20 kasrini 2 ga qisqartiramiz va 3/10 ni olamiz.", 'Сокращаем дробь 6/20 на 2 и получаем 3/10.'),
      ],
      visual: { type: 'chain', items: ['3/4 × 2/5', '6/20', '3/10'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Mashq', 'Практика'),
      title: L("2/7 × 3/4 ni hisoblang", 'Вычислите 2/7 × 3/4'),
      prompt: L("Suratlar va maxrajlarni alohida ko'paytirib, natijani qisqartiring.", 'Отдельно перемножьте числители и знаменатели, затем сократите результат.'),
      intro: L(
        "Yettidan ikki bilan to'rtdan uchni ko'paytiring. Avval yigirma sakkizdan olti hosil bo'ladi, so'ng kasrni ikkiga qisqartiring.",
        'Умножьте две седьмых на три четвёртых. Сначала получится шесть двадцать восьмых, затем сократите дробь на два.',
      ),
      options: ['5/11', '3/14', '6/11', '1/7'],
      correct: 1,
      why: [
        L("2 × 3 = 6 va 7 × 4 = 28.", '2 умножить на 3 равно 6, а 7 умножить на 4 равно 28.'),
        L("6/28 ni 2 ga qisqartirsak 3/14 hosil bo'ladi.", 'Если сократить 6/28 на 2, получится 3/14.'),
      ],
      wrong: L("Suratlarni suratlar bilan, maxrajlarni maxrajlar bilan ko'paytiring.", 'Умножайте числители на числители, а знаменатели на знаменатели.'),
      fact: L("Ko'paytirishdan oldin qisqartirish hisobni qisqa va ishonchli qiladi.", 'Сокращение до умножения делает вычисление короче и надёжнее.'),
      factVisual: '2/7 × 3/4 = 3/14',
      visual: { type: 'equation', expression: '2/7 × 3/4 = ?' },
    },
    {
      type: 'info',
      eyebrow: L('Tezkor usul', 'Быстрый способ'),
      title: L("Ko'paytirishdan oldin qisqartirish", 'Сокращение до умножения'),
      steps: [
        L("5/6 × 3/10 da 5 bilan 10 ni 5 ga qisqartiramiz: 1 va 2 qoladi.", 'В произведении 5/6 × 3/10 сокращаем 5 и 10 на 5: остаются 1 и 2.'),
        L("3 bilan 6 ni 3 ga qisqartiramiz: 1 va 2 qoladi.", 'Сокращаем 3 и 6 на 3: остаются 1 и 2.'),
        L("Endi 1 × 1 ni va 2 × 2 ni ko'paytiramiz: natija 1/4.", 'Теперь умножаем 1 × 1 и 2 × 2: получаем 1/4.'),
      ],
      visual: {
        type: 'panels',
        panels: [
          { title: L('Qisqartirishdan oldin', 'До сокращения'), lines: ['5/6 × 3/10'] },
          { title: L('Qisqartirishdan keyin', 'После сокращения'), lines: ['1/2 × 1/2 = 1/4'] },
        ],
      },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Oldindan qisqartiring', 'Сократите заранее'),
      title: L("7/9 × 3/14 ni hisoblang", 'Вычислите 7/9 × 3/14'),
      prompt: L("7 bilan 14 ni, 3 bilan 9 ni qisqartirgandan keyingi natijani toping.", 'Найдите результат после сокращения 7 с 14 и 3 с 9.'),
      intro: L(
        "Yetti bilan o'n to'rtni yettiga, uch bilan to'qqizni uchga qisqartiring. Qolgan sonlarni ko'paytiring.",
        'Сократите 7 и 14 на семь, а 3 и 9 на три. Перемножьте оставшиеся числа.',
      ),
      options: ['1/6', '1/3', '3/14', '21/23'],
      correct: 0,
      why: [
        L("7 va 14 qisqargach 1 va 2, 3 va 9 qisqargach 1 va 3 qoladi.", 'После сокращения 7 и 14 остаются 1 и 2, а после сокращения 3 и 9 — 1 и 3.'),
        L("1/3 × 1/2 = 1/6.", '1/3 × 1/2 = 1/6.'),
      ],
      wrong: L("Ko'paytirishdan oldin diagonal joylashgan umumiy ko'paytuvchilarni qisqartiring.", 'До умножения сократите общие множители, расположенные по диагонали.'),
      visual: { type: 'chain', items: ['7/9 × 3/14', '1/3 × 1/2', '?'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Butun son va kasr', 'Целое число и дробь'),
      title: L("3 × 2/9 ni hisoblang", 'Вычислите 3 × 2/9'),
      prompt: L("3 sonini 3/1 ko'rinishida yozib yoki oldindan qisqartirib javobni toping.", 'Запишите число 3 как 3/1 или выполните сокращение заранее.'),
      intro: L(
        "Butun uch sonini maxraji bir bo'lgan kasr sifatida yozish mumkin. Uch bilan to'qqizni qisqartirib, qolgan sonlarni ko'paytiring.",
        'Целое число три можно записать как дробь со знаменателем один. Сократите три и девять, затем перемножьте оставшиеся числа.',
      ),
      options: ['6/9', '2/3', '5/9', '6/10'],
      correct: 1,
      why: [
        L("3 × 2/9 = 6/9.", '3 × 2/9 = 6/9.'),
        L("6/9 ni 3 ga qisqartirsak 2/3 hosil bo'ladi.", 'Если сократить 6/9 на 3, получится 2/3.'),
      ],
      wrong: L("Butun son kasrning suratiga ko'payadi; keyin natijani qisqartiring.", 'Целое число умножается на числитель дроби; затем сократите результат.'),
      visual: { type: 'chain', items: ['3 × 2/9', '6/9', '2/3'] },
    },
    {
      type: 'info',
      eyebrow: L('Hayotiy qo‘llash', 'Применение'),
      title: L("Sonning kasr qismini ko'paytirish bilan topamiz", 'Находим дробную часть числа умножением'),
      steps: [
        L("20 ning 3/5 qismini topish uchun 20 × 3/5 ni hisoblaymiz.", 'Чтобы найти 3/5 от 20, вычисляем 20 × 3/5.'),
        L("20 bilan 5 ni qisqartiramiz: 4 qoladi.", 'Сокращаем 20 и 5: остаётся 4.'),
        L("4 × 3 = 12. Demak, 20 ning 3/5 qismi 12.", '4 × 3 = 12. Значит, 3/5 от 20 равны 12.'),
      ],
      visual: { type: 'chain', items: ['20 × 3/5', '4 × 3', '12'] },
    },
    {
      type: 'multi',
      scored: true,
      eyebrow: L('Bir nechta javob', 'Несколько ответов'),
      title: L("To'g'ri ko'paytmalarni belgilang", 'Отметьте верные произведения'),
      intro: L(
        "Har bir tenglikda suratlar va maxrajlar to'g'ri ko'paytirilganini, javob esa qisqartirilganini tekshiring.",
        'В каждом равенстве проверьте умножение числителей и знаменателей и сокращение ответа.',
      ),
      options: ['1/2 × 2/3 = 1/3', '3/4 × 2/3 = 1/2', '2/5 × 5/6 = 1/3', '4/7 × 1/2 = 5/9'],
      correctSet: [0, 1, 2],
      why: [
        L("Birinchi uchta tenglikda ko'paytmalar to'g'ri hisoblangan va qisqartirilgan.", 'В первых трёх равенствах произведения вычислены и сокращены верно.'),
        L("4/7 × 1/2 = 4/14 = 2/7, 5/9 emas.", '4/7 × 1/2 = 4/14 = 2/7, а не 5/9.'),
      ],
      wrong: L("Surat va maxrajlarni alohida ko'paytirib, har bir natijani qisqartiring.", 'Отдельно перемножьте числители и знаменатели и сократите каждый результат.'),
    },
    {
      type: 'match',
      scored: true,
      eyebrow: L('Moslashtirish', 'Соответствие'),
      title: L("Ko'paytmalarni javoblari bilan juftlang", 'Соедините произведения с ответами'),
      prompt: L("Har bir ifoda uchun qisqartirilgan natijani tanlang.", 'Для каждого выражения выберите сокращённый результат.'),
      intro: L(
        "Har bir ko'paytmani oldindan qisqartirish usuli bilan hisoblang va mos javob bilan juftlang.",
        'Вычислите каждое произведение с предварительным сокращением и соедините с подходящим ответом.',
      ),
      rows: [
        { left: '2/3 × 3/4', correct: L('1/2', '1/2') },
        { left: '5/7 × 14/15', correct: L('2/3', '2/3') },
        { left: '3/8 × 4/9', correct: L('1/6', '1/6') },
      ],
      why: [
        L("2/3 × 3/4 = 1/2; 5/7 × 14/15 = 2/3.", '2/3 × 3/4 = 1/2; 5/7 × 14/15 = 2/3.'),
        L("3/8 × 4/9 = 12/72 = 1/6.", '3/8 × 4/9 = 12/72 = 1/6.'),
      ],
      wrong: L("Ko'paytirishdan avval diagonal sonlarni qisqartirish mumkinligini tekshiring.", 'Перед умножением проверьте, можно ли сократить числа по диагонали.'),
    },
    {
      type: 'classify',
      scored: true,
      eyebrow: L('Xatoni topamiz', 'Ищем ошибку'),
      title: L("Yechimlarni to'g'ri va xato guruhiga ajrating", 'Разделите решения на верные и ошибочные'),
      prompt: L("Har bir tenglikni qayta hisoblab, mos guruhni tanlang.", 'Пересчитайте каждое равенство и выберите подходящую группу.'),
      intro: L(
        "Suratni suratga, maxrajni maxrajga ko'paytirish qoidasini qo'llang. Qisqartirilmagan, lekin qiymati to'g'ri tenglik ham to'g'ri hisoblanadi.",
        'Примените правило умножения числителя на числитель и знаменателя на знаменатель. Несокращённое, но верное равенство тоже считается верным.',
      ),
      binA: L("To'g'ri", 'Верно'),
      binB: L('Xato', 'Ошибка'),
      cards: [
        { label: '2/3 × 1/5 = 2/15', value: true },
        { label: '3/4 × 2/7 = 5/11', value: false },
        { label: '5/6 × 3/10 = 15/60', value: true },
        { label: '1/2 × 4/5 = 4/7', value: false },
      ],
      why: [
        L("2/15 va 15/60 ko'paytirish qoidasiga mos; 15/60 keyin 1/4 ga qisqaradi.", '2/15 и 15/60 получены по правилу; 15/60 затем сокращается до 1/4.'),
        L("Xato tengliklarda surat va maxrajlar qo'shib yuborilgan.", 'В ошибочных равенствах числители и знаменатели были сложены.'),
      ],
      wrong: L("Kasrlarni ko'paytirishda sonlar qo'shilmaydi.", 'При умножении дробей числа не складывают.'),
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("14/15 × 5/21 ni hisoblang", 'Вычислите 14/15 × 5/21'),
      prompt: L("Ko'paytirishdan oldin barcha mumkin bo'lgan qisqartirishlarni bajaring.", 'До умножения выполните все возможные сокращения.'),
      intro: L(
        "O'n to'rt bilan yigirma birni yettiga, besh bilan o'n beshni beshga qisqartiring. Qolgan surat va maxrajlarni ko'paytiring.",
        'Сократите четырнадцать и двадцать один на семь, а пять и пятнадцать на пять. Перемножьте оставшиеся числители и знаменатели.',
      ),
      options: ['2/9', '10/36', '7/15', '19/36'],
      correct: 0,
      why: [
        L("14/21 qisqarganda 2/3, 5/15 qisqarganda 1/3 qoladi.", 'После сокращения 14 и 21 остаются 2 и 3, а после сокращения 5 и 15 — 1 и 3.'),
        L("2/3 × 1/3 = 2/9.", '2/3 × 1/3 = 2/9.'),
      ],
      wrong: L("14 bilan 21 ni 7 ga, 5 bilan 15 ni 5 ga qisqartirishdan boshlang.", 'Начните с сокращения 14 и 21 на 7, а 5 и 15 — на 5.'),
      fact: L("Oldindan qisqartirish natijani o'zgartirmaydi, faqat hisobni soddalashtiradi.", 'Предварительное сокращение не меняет результат, а только упрощает вычисление.'),
      factVisual: '14/15 × 5/21 = 2/9',
      visual: { type: 'chain', items: ['14/15 × 5/21', '2/3 × 1/3', '2/9'] },
    },
    {
      type: 'summary',
      eyebrow: L('Dars yakuni', 'Итог урока'),
      title: L("Kasrlarni ko'paytirishni o'rgandingiz", 'Вы научились умножать дроби'),
      points: [
        L("Suratlar o'zaro, maxrajlar o'zaro ko'paytiriladi.", 'Числители перемножаются между собой, знаменатели — между собой.'),
        L("Imkon bo'lsa ko'paytirishdan oldin umumiy ko'paytuvchilar qisqartiriladi.", 'По возможности общие множители сокращают до умножения.'),
        L("Sonning kasr qismi shu sonni kasrga ko'paytirish orqali topiladi.", 'Дробную часть числа находят умножением числа на дробь.'),
      ],
      close: L(
        "Endi oddiy kasrlarni tartibli va ixcham usulda ko'paytira olasiz.",
        'Теперь вы умеете умножать обыкновенные дроби последовательно и кратко.',
      ),
      audio: L(
        "Kasrlarni ko'paytirishni o'rgandingiz. Suratlar o'zaro, maxrajlar o'zaro ko'paytiriladi. Imkon bo'lsa ko'paytirishdan oldin umumiy ko'paytuvchilar qisqartiriladi. Sonning kasr qismi shu sonni kasrga ko'paytirish orqali topiladi. Endi oddiy kasrlarni tartibli va ixcham usulda ko'paytira olasiz.",
        'Вы научились умножать дроби. Числители умножаются друг на друга, а знаменатели — друг на друга. По возможности общие множители сокращаются до умножения. Дробная часть числа находится умножением этого числа на дробь. Теперь вы умеете умножать обыкновенные дроби последовательно и кратко.',
      ),
    },
  ],
};

export default function Dars11(props) {
  return <FractionTheoryLesson lesson={LESSON} {...props}/>;
}
