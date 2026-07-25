import FractionTheoryLesson from './FractionTheoryLesson.jsx';

const L = (uz, ru) => ({ uz, ru });

const LESSON = {
  id: 'frac_6_09',
  title: L("Kasrlarni umumiy maxrajga keltirish", 'Приведение дробей к общему знаменателю'),
  scoredScreens: [5, 7, 8, 10, 11, 12, 13],
  decorations: ['1/4', '1/6', '3/12', '2/12', '5/8', '2/3'],
  slides: [
    {
      type: 'title',
      eyebrow: L('Yangi mavzu', 'Новая тема'),
      title: L("Kasrlarni umumiy maxrajga keltirish", 'Приведение дробей к общему знаменателю'),
      subtitle: L(
        "Bugun turli maxrajli kasrlarni qiymatini o'zgartirmasdan bir xil maxrajda yozishni o'rganamiz.",
        'Сегодня научимся записывать дроби с разными знаменателями с одинаковым знаменателем, не меняя их значения.',
      ),
      audio: L(
        "Bugungi mavzu kasrlarni umumiy maxrajga keltirish. Turli maxrajli kasrlarni taqqoslash yoki ular ustida amal bajarish uchun ularni bir xil ulushlarda yozamiz. Buning uchun maxrajlarning eng kichik umumiy karralisini topamiz.",
        'Тема урока — приведение дробей к общему знаменателю. Чтобы сравнивать дроби с разными знаменателями и выполнять с ними действия, запишем их в одинаковых долях. Для этого найдём наименьшее общее кратное знаменателей.',
      ),
      visual: { type: 'equation', expression: L('1/4 = 3/12   va   1/6 = 2/12', '1/4 = 3/12   и   1/6 = 2/12') },
    },
    {
      type: 'question',
      scored: false,
      eyebrow: L('Eslab olamiz', 'Вспомним'),
      title: L("6 va 8 ning EKUKini toping", 'Найдите НОК чисел 6 и 8'),
      prompt: L("6 ga ham, 8 ga ham bo'linadigan eng kichik natural son qaysi?", 'Какое наименьшее натуральное число делится и на 6, и на 8?'),
      intro: L(
        "Umumiy maxrajni topishda EKUK kerak bo'ladi. Olti va sakkizning karralilarini solishtirib, eng kichik umumiy karralini tanlang.",
        'Для нахождения общего знаменателя нужен НОК. Сравните кратные шести и восьми и выберите наименьшее общее кратное.',
      ),
      options: ['12', '16', '24', '48'],
      correct: 2,
      why: [
        L("24 : 6 = 4 va 24 : 8 = 3.", '24 разделить на 6 равно 4, а 24 разделить на 8 равно 3.'),
        L("24 dan kichik musbat son ikkala songa ham bo'linmaydi, demak EKUK 24.", 'Ни одно меньшее положительное число не делится на оба числа, значит НОК равен 24.'),
      ],
      wrong: L("Ikkala sonning karralilarini yozing va birinchi umumiy sonni toping.", 'Выпишите кратные обоих чисел и найдите первое общее число.'),
      visual: {
        type: 'panels',
        panels: [
          { title: L('6 ning karralilari', 'Кратные 6'), lines: ['6, 12, 18, 24'] },
          { title: L('8 ning karralilari', 'Кратные 8'), lines: ['8, 16, 24, 32'] },
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Tushuncha', 'Понятие'),
      title: L("Umumiy maxraj nima?", 'Что такое общий знаменатель?'),
      steps: [
        L("Ikki yoki undan ortiq kasrning maxraji bir xil bo'lsa, ular umumiy maxrajga ega bo'ladi.", 'Если знаменатели двух или нескольких дробей одинаковы, у них общий знаменатель.'),
        L("Masalan, 3/12 va 2/12 kasrlarining umumiy maxraji 12.", 'Например, у дробей 3/12 и 2/12 общий знаменатель 12.'),
        L("Kasrlarni umumiy maxrajga keltirganda ularning qiymati o'zgarmaydi.", 'При приведении к общему знаменателю значения дробей не меняются.'),
      ],
      visual: { type: 'equation', expression: '3/12     2/12' },
    },
    {
      type: 'rule',
      eyebrow: L('Algoritm', 'Алгоритм'),
      title: L("Eng kichik umumiy maxrajni topish", 'Как найти наименьший общий знаменатель'),
      steps: [
        L("Birinchi qadam: kasrlar maxrajlarining EKUKini topamiz.", 'Первый шаг: находим НОК знаменателей дробей.'),
        L("Ikkinchi qadam: umumiy maxrajni har bir eski maxrajga bo'lib, qo'shimcha ko'paytuvchini topamiz.", 'Второй шаг: делим общий знаменатель на каждый прежний знаменатель и находим дополнительный множитель.'),
        L("Uchinchi qadam: har bir kasrning surat va maxrajini o'z qo'shimcha ko'paytuvchisiga ko'paytiramiz.", 'Третий шаг: умножаем числитель и знаменатель каждой дроби на её дополнительный множитель.'),
      ],
      visual: {
        type: 'steps',
        items: [
          L('EKUK(4, 6) = 12', 'НОК(4, 6) = 12'),
          L('12 : 4 = 3; 12 : 6 = 2', '12 : 4 = 3; 12 : 6 = 2'),
          L('1/4 = 3/12; 1/6 = 2/12', '1/4 = 3/12; 1/6 = 2/12'),
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Namuna', 'Пример'),
      title: L("1/4 va 1/6 ni umumiy maxrajga keltiramiz", 'Приведём 1/4 и 1/6 к общему знаменателю'),
      steps: [
        L("4 va 6 ning EKUKi 12, demak eng kichik umumiy maxraj 12.", 'НОК чисел 4 и 6 равен 12, значит наименьший общий знаменатель — 12.'),
        L("Birinchi kasr uchun qo'shimcha ko'paytuvchi 3: 1/4 = 3/12.", 'Дополнительный множитель первой дроби равен 3: 1/4 = 3/12.'),
        L("Ikkinchi kasr uchun qo'shimcha ko'paytuvchi 2: 1/6 = 2/12.", 'Дополнительный множитель второй дроби равен 2: 1/6 = 2/12.'),
      ],
      visual: {
        type: 'panels',
        panels: [
          { title: L('Birinchi kasr × 3', 'Первая дробь × 3'), lines: ['1/4 = 3/12'] },
          { title: L('Ikkinchi kasr × 2', 'Вторая дробь × 2'), lines: ['1/6 = 2/12'] },
        ],
      },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Mashq', 'Практика'),
      title: L("2/3 va 5/6 ni umumiy maxrajga keltiring", 'Приведите 2/3 и 5/6 к общему знаменателю'),
      prompt: L("Eng kichik umumiy maxraj 6. Qaysi juftlik to'g'ri?", 'Наименьший общий знаменатель равен 6. Какая пара верна?'),
      intro: L(
        "Uch va olti maxrajlarining EKUKi olti. Birinchi kasrni ikki marta kengaytiring, ikkinchi kasrni o'zgartirmang.",
        'НОК знаменателей три и шесть равен шести. Расширьте первую дробь в два раза, а вторую оставьте без изменения.',
      ),
      options: [
        L('4/6 va 5/6', '4/6 и 5/6'),
        L('2/6 va 5/6', '2/6 и 5/6'),
        L('4/12 va 10/12', '4/12 и 10/12'),
        L('2/3 va 10/6', '2/3 и 10/6'),
      ],
      correct: 0,
      why: [
        L("2/3 ning surat va maxrajini 2 ga ko'paytirsak 4/6 chiqadi.", 'Если умножить числитель и знаменатель 2/3 на 2, получится 4/6.'),
        L("5/6 allaqachon 6 maxrajga ega. To'g'ri juftlik 4/6 va 5/6.", 'У дроби 5/6 знаменатель уже равен 6. Верная пара: 4/6 и 5/6.'),
      ],
      wrong: L("Umumiy maxraj 6 bo'lishi va ikkala kasrning qiymati saqlanishi kerak.", 'Общий знаменатель должен быть равен 6, а значения обеих дробей должны сохраниться.'),
      fact: L("Agar bir maxraj ikkinchisiga bo'linsa, katta maxraj umumiy maxraj bo'la oladi.", 'Если один знаменатель делится на другой, больший знаменатель может быть общим.'),
      factVisual: '2/3 = 4/6',
      visual: { type: 'equation', expression: '2/3 = ?/6     5/6' },
    },
    {
      type: 'info',
      eyebrow: L('Muhim farq', 'Важное различие'),
      title: L("Har qanday umumiy maxraj va eng kichik umumiy maxraj", 'Общий и наименьший общий знаменатель'),
      steps: [
        L("Maxrajlarning ko'paytmasi doim umumiy maxraj bo'la oladi, lekin u eng kichik bo'lmasligi mumkin.", 'Произведение знаменателей всегда может быть общим знаменателем, но не всегда наименьшим.'),
        L("Masalan, 4 va 6 uchun 24 umumiy maxraj, ammo eng kichik umumiy maxraj 12.", 'Например, для 4 и 6 число 24 — общий знаменатель, но наименьший общий знаменатель равен 12.'),
        L("Eng kichik umumiy maxraj sonlarni ixcham saqlaydi va keyingi hisobni yengillashtiradi.", 'Наименьший общий знаменатель сохраняет числа компактными и облегчает дальнейшие вычисления.'),
      ],
      visual: {
        type: 'panels',
        panels: [
          { title: L('Mumkin', 'Можно'), lines: ['24, 36, 48, ...'] },
          { title: L('Eng kichigi', 'Наименьший'), lines: ['12'] },
        ],
      },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Mashq', 'Практика'),
      title: L("8 va 12 uchun eng kichik umumiy maxraj", 'Наименьший общий знаменатель для 8 и 12'),
      prompt: L("8 va 12 ning EKUKini toping.", 'Найдите НОК чисел 8 и 12.'),
      intro: L(
        "Sakkiz va o'n ikki maxrajlarini umumiy karralilarga ajrating. Eng kichik umumiy sonni tanlang.",
        'Рассмотрите общие кратные знаменателей восемь и двенадцать. Выберите наименьшее общее число.',
      ),
      options: ['16', '20', '24', '96'],
      correct: 2,
      why: [
        L("24 soni 8 ga ham, 12 ga ham qoldiqsiz bo'linadi.", 'Число 24 делится без остатка и на 8, и на 12.'),
        L("24 dan kichik umumiy karrali yo'q, shuning uchun EKUK 24.", 'Меньшего общего кратного нет, поэтому НОК равен 24.'),
      ],
      wrong: L("8 ning 8, 16, 24 karralilari va 12 ning 12, 24 karralilarini solishtiring.", 'Сравните кратные 8: 8, 16, 24 и кратные 12: 12, 24.'),
      visual: {
        type: 'panels',
        panels: [
          { title: L('8 ning karralilari', 'Кратные 8'), lines: ['8, 16, 24'] },
          { title: L('12 ning karralilari', 'Кратные 12'), lines: ['12, 24, 36'] },
        ],
      },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L("Qo'shimcha ko'paytuvchi", 'Дополнительный множитель'),
      title: L("3/10 va 7/15 uchun ko'paytuvchilarni toping", 'Найдите множители для 3/10 и 7/15'),
      prompt: L("Umumiy maxraj 30. Birinchi va ikkinchi kasrning qo'shimcha ko'paytuvchilari qaysi?", 'Общий знаменатель равен 30. Каковы дополнительные множители первой и второй дроби?'),
      intro: L(
        "O'ttizni har bir maxrajga bo'ling. O'ttiz bo'lingan o'n va o'ttiz bo'lingan o'n besh natijalarini tartib bilan tanlang.",
        'Разделите тридцать на каждый знаменатель. Выберите по порядку результаты деления тридцати на десять и тридцати на пятнадцать.',
      ),
      options: [
        L('3 va 2', '3 и 2'),
        L('2 va 3', '2 и 3'),
        L('10 va 15', '10 и 15'),
        L('30 va 30', '30 и 30'),
      ],
      correct: 0,
      why: [
        L("30 : 10 = 3, demak 3/10 kasrining qo'shimcha ko'paytuvchisi 3.", '30 разделить на 10 равно 3, значит дополнительный множитель дроби 3/10 равен 3.'),
        L("30 : 15 = 2, demak 7/15 kasrining qo'shimcha ko'paytuvchisi 2.", '30 разделить на 15 равно 2, значит дополнительный множитель дроби 7/15 равен 2.'),
      ],
      wrong: L("Umumiy maxrajni eski maxrajga bo'ling; tartibni almashtirmang.", 'Разделите общий знаменатель на прежний знаменатель и не меняйте порядок.'),
      visual: {
        type: 'panels',
        panels: [
          { title: L('30 : 10', '30 : 10'), lines: ['3/10 → 9/30'] },
          { title: L('30 : 15', '30 : 15'), lines: ['7/15 → 14/30'] },
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Qo‘llash', 'Применение'),
      title: L("Umumiy maxraj kasrlarni taqqoslashga yordam beradi", 'Общий знаменатель помогает сравнивать дроби'),
      steps: [
        L("5/8 va 2/3 kasrlarining eng kichik umumiy maxraji 24.", 'Наименьший общий знаменатель дробей 5/8 и 2/3 равен 24.'),
        L("5/8 = 15/24, 2/3 = 16/24.", '5/8 = 15/24, а 2/3 = 16/24.'),
        L("Maxrajlar teng bo'lganda suratlarni taqqoslaymiz: 15 soni 16 dan kichik, demak 5/8 kasri 2/3 kasridan kichik.", 'При равных знаменателях сравниваем числители: 15 меньше 16, значит 5/8 меньше 2/3.'),
      ],
      visual: { type: 'chain', items: ['5/8 = 15/24', '15/24 < 16/24', '16/24 = 2/3'] },
    },
    {
      type: 'multi',
      scored: true,
      eyebrow: L('Bir nechta javob', 'Несколько ответов'),
      title: L("4 va 6 uchun umumiy maxrajlarni belgilang", 'Отметьте общие знаменатели для 4 и 6'),
      intro: L(
        "To'rtga ham, oltiga ham qoldiqsiz bo'linadigan barcha sonlarni belgilang.",
        'Отметьте все числа, которые делятся без остатка и на четыре, и на шесть.',
      ),
      options: ['12', '18', '24', '36'],
      correctSet: [0, 2, 3],
      why: [
        L("12, 24 va 36 sonlari 4 ga ham, 6 ga ham bo'linadi.", 'Числа 12, 24 и 36 делятся и на 4, и на 6.'),
        L("18 soni 4 ga bo'linmaydi, shuning uchun u umumiy maxraj bo'la olmaydi.", 'Число 18 не делится на 4, поэтому не может быть общим знаменателем.'),
      ],
      wrong: L("Har bir sonni avval 4 ga, keyin 6 ga bo'lib tekshiring.", 'Проверьте каждое число делением сначала на 4, затем на 6.'),
    },
    {
      type: 'match',
      scored: true,
      eyebrow: L('Moslashtirish', 'Соответствие'),
      title: L("Maxrajlar juftini EKUKi bilan moslang", 'Соедините пару знаменателей с их НОК'),
      prompt: L("Har bir juftlik uchun eng kichik umumiy maxrajni tanlang.", 'Для каждой пары выберите наименьший общий знаменатель.'),
      intro: L(
        "Chapdagi maxrajlar juftining eng kichik umumiy karralisini topib, o'ngdagi javob bilan juftlang.",
        'Найдите наименьшее общее кратное каждой пары знаменателей слева и соедините с ответом справа.',
      ),
      rows: [
        { left: '4; 6', correct: L('12', '12') },
        { left: '5; 10', correct: L('10', '10') },
        { left: '8; 12', correct: L('24', '24') },
      ],
      why: [
        L("EKUK(4, 6) = 12; EKUK(5, 10) = 10; EKUK(8, 12) = 24.", 'НОК(4, 6) = 12; НОК(5, 10) = 10; НОК(8, 12) = 24.'),
        L("Har bir natija juftlikdagi ikkala songa ham bo'linadi.", 'Каждый результат делится на оба числа своей пары.'),
      ],
      wrong: L("Har bir juft uchun karralilar qatoridagi birinchi umumiy sonni toping.", 'Для каждой пары найдите первое общее число в рядах кратных.'),
    },
    {
      type: 'classify',
      scored: true,
      eyebrow: L('To‘g‘rimi?', 'Верно ли?'),
      title: L("Kengaytirishlarni tekshiring", 'Проверьте расширение дробей'),
      prompt: L("Har bir tenglikni to'g'ri yoki xato guruhiga joylang.", 'Распределите каждое равенство в группу верных или ошибочных.'),
      intro: L(
        "Surat va maxraj bir xil songa ko'paytirilganini tekshiring. Tengliklarni ikki guruhga ajrating.",
        'Проверьте, умножены ли числитель и знаменатель на одно число. Разделите равенства на две группы.',
      ),
      binA: L("To'g'ri", 'Верно'),
      binB: L('Xato', 'Ошибка'),
      cards: [
        { label: '1/3 = 4/12', value: true },
        { label: '2/5 = 6/10', value: false },
        { label: '3/4 = 9/12', value: true },
        { label: '5/6 = 10/18', value: false },
      ],
      why: [
        L("1/3 = 4/12 va 3/4 = 9/12 tengliklarida ikkala son bir xil marta ko'paygan.", 'В равенствах 1/3 = 4/12 и 3/4 = 9/12 оба числа увеличены в одинаковое число раз.'),
        L("Xato tengliklarda surat va maxraj turli marta o'zgargan.", 'В ошибочных равенствах числитель и знаменатель изменены в разное число раз.'),
      ],
      wrong: L("Eski surat va maxrajdan yangi sonlarga o'tish ko'paytuvchilarini solishtiring.", 'Сравните множители перехода от прежних числителя и знаменателя к новым.'),
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("7/12 va 5/18 ni eng kichik umumiy maxrajga keltiring", 'Приведите 7/12 и 5/18 к наименьшему общему знаменателю'),
      prompt: L("EKUK(12, 18) = 36. To'g'ri juftlikni toping.", 'НОК(12, 18) = 36. Найдите верную пару.'),
      intro: L(
        "O'n ikki va o'n sakkizning EKUKi o'ttiz olti. Birinchi kasr uchun qo'shimcha ko'paytuvchi uch, ikkinchisi uchun ikki. Natijani tanlang.",
        'НОК чисел двенадцать и восемнадцать равен тридцати шести. Дополнительный множитель первой дроби — три, второй — два. Выберите результат.',
      ),
      options: [
        L('21/36 va 10/36', '21/36 и 10/36'),
        L('14/36 va 15/36', '14/36 и 15/36'),
        L('21/24 va 10/18', '21/24 и 10/18'),
        L('7/36 va 5/36', '7/36 и 5/36'),
      ],
      correct: 0,
      why: [
        L("7/12 ni 3 ga kengaytirsak 21/36 hosil bo'ladi.", 'Если расширить 7/12 на 3, получится 21/36.'),
        L("5/18 ni 2 ga kengaytirsak 10/36 hosil bo'ladi.", 'Если расширить 5/18 на 2, получится 10/36.'),
      ],
      wrong: L("Har bir kasrning surat va maxrajini o'z qo'shimcha ko'paytuvchisiga ko'paytiring.", 'Умножьте числитель и знаменатель каждой дроби на её дополнительный множитель.'),
      fact: L("Eng kichik umumiy maxraj — berilgan maxrajlarning EKUKidir.", 'Наименьший общий знаменатель — это НОК данных знаменателей.'),
      factVisual: '7/12 = 21/36',
      visual: {
        type: 'panels',
        panels: [
          { title: L('× 3', '× 3'), lines: ['7/12 = 21/36'] },
          { title: L('× 2', '× 2'), lines: ['5/18 = 10/36'] },
        ],
      },
    },
    {
      type: 'summary',
      eyebrow: L('Dars yakuni', 'Итог урока'),
      title: L("Umumiy maxrajni topishni o'rgandingiz", 'Вы научились находить общий знаменатель'),
      points: [
        L("Eng kichik umumiy maxraj — maxrajlarning EKUKi.", 'Наименьший общий знаменатель — НОК знаменателей.'),
        L("Qo'shimcha ko'paytuvchi umumiy maxrajni eski maxrajga bo'lish orqali topiladi.", 'Дополнительный множитель находят делением общего знаменателя на прежний.'),
        L("Surat va maxraj bir xil qo'shimcha ko'paytuvchiga ko'paytiriladi.", 'Числитель и знаменатель умножают на один дополнительный множитель.'),
      ],
      close: L(
        "Endi turli maxrajli kasrlarni bir xil, eng kichik umumiy maxrajda yozishni bilasiz.",
        'Теперь вы умеете записывать дроби с разными знаменателями с одинаковым наименьшим общим знаменателем.',
      ),
      audio: L(
        "Dars yakunlandi. Kasrlarni umumiy maxrajga keltirish uchun maxrajlarning EKUKini topamiz. So'ng har bir qo'shimcha ko'paytuvchini aniqlab, kasrning surat va maxrajini shu songa ko'paytiramiz.",
        'Урок завершён. Чтобы привести дроби к общему знаменателю, находим НОК знаменателей. Затем определяем дополнительный множитель каждой дроби и умножаем на него числитель и знаменатель.',
      ),
    },
  ],
};

export default function Dars09(props) {
  return <FractionTheoryLesson lesson={LESSON} {...props}/>;
}
