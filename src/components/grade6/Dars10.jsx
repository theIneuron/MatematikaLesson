import FractionTheoryLesson from './FractionTheoryLesson.jsx';

const L = (uz, ru) => ({ uz, ru });

const LESSON = {
  id: 'frac_6_10',
  title: L("Har xil maxrajli kasrlarni qo'shish va ayirish", 'Сложение и вычитание дробей с разными знаменателями'),
  scoredScreens: [5, 7, 8, 10, 11, 12, 13],
  decorations: ['1/3', '1/4', '7/12', '5/6', '13/15', '19/24'],
  slides: [
    {
      type: 'title',
      eyebrow: L('Yangi mavzu', 'Новая тема'),
      title: L("Har xil maxrajli kasrlarni qo'shish va ayirish", 'Сложение и вычитание дробей с разными знаменателями'),
      subtitle: L(
        "Bugun kasrlarni umumiy maxrajga keltirib, ularni qo'shish va ayirishni o'rganamiz.",
        'Сегодня научимся приводить дроби к общему знаменателю, а затем складывать и вычитать их.',
      ),
      audio: L(
        "Bugungi mavzu har xil maxrajli kasrlarni qo'shish va ayirish. Avval kasrlarni eng kichik umumiy maxrajga keltiramiz, so'ng suratlar ustida amal bajaramiz. Oxirida javobni tekshirib, kerak bo'lsa qisqartiramiz.",
        'Тема урока — сложение и вычитание дробей с разными знаменателями. Сначала приводим дроби к наименьшему общему знаменателю, затем выполняем действие с числителями. В конце проверяем и при необходимости сокращаем ответ.',
      ),
      visual: { type: 'equation', expression: '1/3 + 1/4 = 7/12' },
    },
    {
      type: 'question',
      scored: false,
      eyebrow: L('Eslab olamiz', 'Вспомним'),
      title: L("Bir xil maxrajli kasrlarni qo'shing", 'Сложите дроби с одинаковыми знаменателями'),
      prompt: L("2/7 + 3/7 yig'indisini toping.", 'Найдите сумму 2/7 + 3/7.'),
      intro: L(
        "Kasrlarning maxraji bir xil — yetti. Yettilik ulushlar o'zgarmaydi, faqat olingan ulushlar sonini qo'shamiz.",
        'Знаменатели дробей одинаковы и равны семи. Размер долей не меняется, складываем только количество взятых долей.',
      ),
      options: ['5/7', '5/14', '6/7', '1/7'],
      correct: 0,
      why: [
        L("Maxraj 7 o'zgarmaydi.", 'Знаменатель 7 не меняется.'),
        L("Suratlar qo'shiladi: 2 + 3 = 5. Demak, 2/7 + 3/7 = 5/7.", 'Числители складываются: 2 + 3 = 5. Значит, 2/7 + 3/7 = 5/7.'),
      ],
      wrong: L("Bir xil maxraj saqlanadi, faqat suratlarni qo'shing.", 'Одинаковый знаменатель сохраняется, сложите только числители.'),
      visual: {
        type: 'bars',
        groups: [
          { numerator: 2, denominator: 7, label: L('2/7', '2/7') },
          { numerator: 3, denominator: 7, color: 'blue', label: L('3/7', '3/7') },
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Asosiy tayanch', 'Основа'),
      title: L("Maxrajlar teng bo'lsa", 'Если знаменатели равны'),
      steps: [
        L("Bir xil maxraj kasr bo'laklarining kattaligi bir xil ekanini bildiradi.", 'Одинаковый знаменатель означает, что размеры долей одинаковы.'),
        L("Qo'shishda suratlarni qo'shamiz, ayirishda suratlarni ayiramiz.", 'При сложении складываем числители, при вычитании вычитаем числители.'),
        L("Maxraj o'zgarmaydi. Masalan, 2/7 + 3/7 = 5/7.", 'Знаменатель не меняется. Например, 2/7 + 3/7 = 5/7.'),
      ],
      visual: { type: 'equation', expression: '2/7 + 3/7 = 5/7' },
    },
    {
      type: 'rule',
      eyebrow: L('Algoritm', 'Алгоритм'),
      title: L("Har xil maxrajli kasrlar bilan uch qadam", 'Три шага для дробей с разными знаменателями'),
      steps: [
        L("1. Maxrajlarning EKUKini topib, kasrlarni umumiy maxrajga keltiramiz.", '1. Находим НОК знаменателей и приводим дроби к общему знаменателю.'),
        L("2. Yangi suratlarni qo'shamiz yoki ayiramiz, umumiy maxrajni saqlaymiz.", '2. Складываем или вычитаем новые числители, общий знаменатель сохраняем.'),
        L("3. Natijani tekshiramiz va imkon bo'lsa qisqartiramiz.", '3. Проверяем результат и, если возможно, сокращаем его.'),
      ],
      visual: {
        type: 'steps',
        items: [
          L('Umumiy maxrajni toping', 'Найдите общий знаменатель'),
          L('Suratlar ustida amal bajaring', 'Выполните действие с числителями'),
          L('Javobni qisqartiring', 'Сократите ответ'),
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Qo‘shish namunasi', 'Пример сложения'),
      title: L("1/3 + 1/4 ni hisoblaymiz", 'Вычислим 1/3 + 1/4'),
      steps: [
        L("3 va 4 ning EKUKi 12. Umumiy maxraj 12 bo'ladi.", 'НОК чисел 3 и 4 равен 12. Общий знаменатель — 12.'),
        L("1/3 = 4/12 va 1/4 = 3/12.", '1/3 = 4/12 и 1/4 = 3/12.'),
        L("4/12 + 3/12 = 7/12. 7 va 12 o'zaro tub, javob qisqarmaydi.", '4/12 + 3/12 = 7/12. Числа 7 и 12 взаимно простые, ответ не сокращается.'),
      ],
      visual: { type: 'chain', items: ['1/3 + 1/4', '4/12 + 3/12', '7/12'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Mashq', 'Практика'),
      title: L("1/2 + 1/3 ni hisoblang", 'Вычислите 1/2 + 1/3'),
      prompt: L("Eng kichik umumiy maxraj 6. To'g'ri yig'indini toping.", 'Наименьший общий знаменатель равен 6. Найдите верную сумму.'),
      intro: L(
        "Ikkidan birni oltidan uch, uchdan birni oltidan ikki ko'rinishida yozing. Endi suratlarni qo'shing.",
        'Запишите одну вторую как три шестых, а одну треть как две шестых. Затем сложите числители.',
      ),
      options: ['2/5', '5/6', '2/6', '1/6'],
      correct: 1,
      why: [
        L("1/2 = 3/6 va 1/3 = 2/6.", '1/2 = 3/6 и 1/3 = 2/6.'),
        L("3/6 + 2/6 = 5/6.", '3/6 + 2/6 = 5/6.'),
      ],
      wrong: L("Avval maxrajlarni tenglashtiring; surat va maxrajlarni alohida qo'shmang.", 'Сначала сделайте знаменатели равными; не складывайте отдельно числители и знаменатели.'),
      fact: L("Kasrlarni qo'shganda maxrajlar hech qachon shunchaki bir-biriga qo'shilmaydi.", 'При сложении дробей знаменатели никогда не складывают просто друг с другом.'),
      factVisual: '1/2 + 1/3 = 5/6',
      visual: { type: 'chain', items: ['1/2 + 1/3', '3/6 + 2/6', '?'] },
    },
    {
      type: 'info',
      eyebrow: L('Ayirish namunasi', 'Пример вычитания'),
      title: L("5/6 − 1/4 ni hisoblaymiz", 'Вычислим 5/6 − 1/4'),
      steps: [
        L("6 va 4 ning EKUKi 12. Demak, umumiy maxraj 12.", 'НОК чисел 6 и 4 равен 12. Значит, общий знаменатель — 12.'),
        L("5/6 = 10/12 va 1/4 = 3/12.", '5/6 = 10/12 и 1/4 = 3/12.'),
        L("10/12 − 3/12 = 7/12. Natija qisqarmaydi.", '10/12 − 3/12 = 7/12. Результат не сокращается.'),
      ],
      visual: { type: 'chain', items: ['5/6 − 1/4', '10/12 − 3/12', '7/12'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Mashq', 'Практика'),
      title: L("3/4 − 1/6 ni hisoblang", 'Вычислите 3/4 − 1/6'),
      prompt: L("Eng kichik umumiy maxraj 12. Natijani toping.", 'Наименьший общий знаменатель равен 12. Найдите результат.'),
      intro: L(
        "To'rtdan uchni o'n ikkidan to'qqiz, oltidan birni o'n ikkidan ikki ko'rinishiga keltiring. Keyin suratlarni ayiring.",
        'Приведите три четвёртых к девяти двенадцатым, а одну шестую — к двум двенадцатым. Затем вычтите числители.',
      ),
      options: ['2/2', '7/12', '2/12', '1/2'],
      correct: 1,
      why: [
        L("3/4 = 9/12 va 1/6 = 2/12.", '3/4 = 9/12 и 1/6 = 2/12.'),
        L("9/12 − 2/12 = 7/12.", '9/12 − 2/12 = 7/12.'),
      ],
      wrong: L("Umumiy maxraj 12 ni saqlang va 9 dan 2 ni ayiring.", 'Сохраните общий знаменатель 12 и вычтите 2 из 9.'),
      visual: { type: 'chain', items: ['3/4 − 1/6', '9/12 − 2/12', '?'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Xatoni chetlab o‘ting', 'Избегаем ошибки'),
      title: L("2/3 + 1/6 ning to'g'ri yechimini tanlang", 'Выберите верное решение 2/3 + 1/6'),
      prompt: L("Qaysi natija kasrlarni avval umumiy maxrajga keltirish orqali topilgan?", 'Какой результат получен после приведения дробей к общему знаменателю?'),
      intro: L(
        "Olti maxraj ikkala kasr uchun umumiy. Uchdan ikkini oltidan to'rtga aylantiring va oltidan birni qo'shing.",
        'Знаменатель шесть общий для обеих дробей. Превратите две трети в четыре шестых и прибавьте одну шестую.',
      ),
      options: ['3/9', '3/6', '5/6', '2/18'],
      correct: 2,
      why: [
        L("2/3 = 4/6.", '2/3 = 4/6.'),
        L("4/6 + 1/6 = 5/6. Surat va maxrajlarni alohida qo'shish xato.", '4/6 + 1/6 = 5/6. Складывать отдельно числители и знаменатели неверно.'),
      ],
      wrong: L("2/3 ni avval 4/6 ko'rinishiga keltiring.", 'Сначала приведите 2/3 к виду 4/6.'),
      visual: {
        type: 'panels',
        panels: [
          { title: L('Xato yo‘l', 'Неверно'), lines: ['(2 + 1)/(3 + 6) = 3/9'] },
          { title: L("To'g'ri yo‘l", 'Верно'), lines: ['4/6 + 1/6 = 5/6'] },
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Oxirgi qadam', 'Последний шаг'),
      title: L("Javobni qisqartirishni unutmang", 'Не забудьте сократить ответ'),
      steps: [
        L("7/10 + 1/6 uchun eng kichik umumiy maxraj 30.", 'Для 7/10 + 1/6 наименьший общий знаменатель равен 30.'),
        L("7/10 = 21/30 va 1/6 = 5/30; yig'indi 26/30.", '7/10 = 21/30 и 1/6 = 5/30; сумма равна 26/30.'),
        L("26/30 ni 2 ga qisqartiramiz: yakuniy javob 13/15.", 'Сокращаем 26/30 на 2: окончательный ответ 13/15.'),
      ],
      visual: { type: 'chain', items: ['7/10 + 1/6', '26/30', '13/15'] },
    },
    {
      type: 'multi',
      scored: true,
      eyebrow: L('Bir nechta javob', 'Несколько ответов'),
      title: L("To'g'ri hisoblangan tengliklarni belgilang", 'Отметьте верно вычисленные равенства'),
      intro: L(
        "Har bir tenglikda kasrlarni umumiy maxrajga keltirib tekshiring. Barcha to'g'ri javoblarni belgilang.",
        'Проверьте каждое равенство, приведя дроби к общему знаменателю. Отметьте все верные ответы.',
      ),
      options: ['1/2 + 1/4 = 3/4', '5/6 − 1/3 = 1/2', '2/5 + 1/10 = 1/2', '3/4 − 1/2 = 2/2'],
      correctSet: [0, 1, 2],
      why: [
        L("Birinchi uchta tenglik umumiy maxraj orqali tekshirilganda to'g'ri.", 'Первые три равенства верны при проверке через общий знаменатель.'),
        L("3/4 − 1/2 = 3/4 − 2/4 = 1/4, 2/2 emas.", '3/4 − 1/2 = 3/4 − 2/4 = 1/4, а не 2/2.'),
      ],
      wrong: L("Har bir misolda maxrajlarni tenglashtirib, suratlar ustida amal bajaring.", 'В каждом примере сделайте знаменатели равными и выполните действие с числителями.'),
    },
    {
      type: 'match',
      scored: true,
      eyebrow: L('Moslashtirish', 'Соответствие'),
      title: L("Misollarni javoblari bilan juftlang", 'Соедините примеры с ответами'),
      prompt: L("Har bir amal uchun to'g'ri, qisqartirilgan javobni tanlang.", 'Для каждого действия выберите верный сокращённый ответ.'),
      intro: L(
        "Misollarni umumiy maxraj orqali hisoblang. Zarur bo'lsa javobni qisqartiring va mos natijani tanlang.",
        'Вычислите примеры через общий знаменатель. При необходимости сократите ответ и выберите подходящий результат.',
      ),
      rows: [
        { left: '1/3 + 1/6', correct: L('1/2', '1/2') },
        { left: '7/8 − 1/4', correct: L('5/8', '5/8') },
        { left: '2/5 + 1/2', correct: L('9/10', '9/10') },
      ],
      why: [
        L("1/3 + 1/6 = 3/6 = 1/2; 7/8 − 1/4 = 5/8.", '1/3 + 1/6 = 3/6 = 1/2; 7/8 − 1/4 = 5/8.'),
        L("2/5 + 1/2 = 4/10 + 5/10 = 9/10.", '2/5 + 1/2 = 4/10 + 5/10 = 9/10.'),
      ],
      wrong: L("Har bir juft maxraj uchun EKUKni topishdan boshlang.", 'Начните с нахождения НОК каждой пары знаменателей.'),
    },
    {
      type: 'classify',
      scored: true,
      eyebrow: L('Tekshiruvchi', 'Проверка'),
      title: L("Yechimlarni to'g'ri va xato guruhiga ajrating", 'Разделите решения на верные и ошибочные'),
      prompt: L("Har bir tenglikni tekshirib, mos guruhni tanlang.", 'Проверьте каждое равенство и выберите подходящую группу.'),
      intro: L(
        "Natijani umumiy maxraj orqali qayta hisoblang. To'g'ri yechimni yashil guruhga, xato yechimni esa xato guruhiga joylang.",
        'Пересчитайте результат через общий знаменатель. Верное решение поместите в зелёную группу, ошибочное — во вторую.',
      ),
      binA: L("To'g'ri", 'Верно'),
      binB: L('Xato', 'Ошибка'),
      cards: [
        { label: '1/2 + 1/6 = 2/3', value: true },
        { label: '3/5 − 1/10 = 1/2', value: true },
        { label: '1/4 + 1/3 = 2/7', value: false },
        { label: '5/6 − 1/2 = 4/4', value: false },
      ],
      why: [
        L("1/2 + 1/6 = 4/6 = 2/3 va 3/5 − 1/10 = 5/10 = 1/2.", '1/2 + 1/6 = 4/6 = 2/3 и 3/5 − 1/10 = 5/10 = 1/2.'),
        L("Xato tengliklarda maxrajlar qo'shilgan yoki suratlar noto'g'ri ayirilgan.", 'В ошибочных равенствах сложены знаменатели или неверно вычтены числители.'),
      ],
      wrong: L("Maxrajlarni alohida qo'shmang yoki ayirmang; avval ularni tenglashtiring.", 'Не складывайте и не вычитайте знаменатели; сначала сделайте их равными.'),
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("5/8 + 1/6 ni hisoblang", 'Вычислите 5/8 + 1/6'),
      prompt: L("Eng kichik umumiy maxraj 24. Yakuniy natijani toping.", 'Наименьший общий знаменатель равен 24. Найдите окончательный результат.'),
      intro: L(
        "Sakkizdan beshni yigirma to'rtdan o'n besh, oltidan birni yigirma to'rtdan to'rt ko'rinishiga keltiring. So'ng suratlarni qo'shing.",
        'Приведите пять восьмых к пятнадцати двадцать четвёртым, а одну шестую — к четырём двадцать четвёртым. Затем сложите числители.',
      ),
      options: ['6/14', '19/24', '16/24', '5/48'],
      correct: 1,
      why: [
        L("5/8 = 15/24 va 1/6 = 4/24.", '5/8 = 15/24 и 1/6 = 4/24.'),
        L("15/24 + 4/24 = 19/24. 19 va 24 o'zaro tub.", '15/24 + 4/24 = 19/24. Числа 19 и 24 взаимно простые.'),
      ],
      wrong: L("Umumiy maxraj 24 ni saqlang va 15 bilan 4 ni qo'shing.", 'Сохраните общий знаменатель 24 и сложите 15 и 4.'),
      fact: L("Javobni qisqartirish mumkinligini tekshirish har bir kasr amalining yakuniy qadamidir.", 'Проверка возможности сокращения ответа — последний шаг любого действия с дробями.'),
      factVisual: '15/24 + 4/24 = 19/24',
      visual: { type: 'chain', items: ['5/8 + 1/6', '15/24 + 4/24', '19/24'] },
    },
    {
      type: 'summary',
      eyebrow: L('Dars yakuni', 'Итог урока'),
      title: L("Kasrlarni qo'shish va ayirishni o'rgandingiz", 'Вы научились складывать и вычитать дроби'),
      points: [
        L("Avval kasrlar eng kichik umumiy maxrajga keltiriladi.", 'Сначала дроби приводят к наименьшему общему знаменателю.'),
        L("Suratlar qo'shiladi yoki ayiriladi, umumiy maxraj saqlanadi.", 'Числители складывают или вычитают, общий знаменатель сохраняют.'),
        L("Yakuniy javob imkon bo'lsa qisqartiriladi.", 'Окончательный ответ при возможности сокращают.'),
      ],
      close: L(
        "Endi har xil maxrajli kasrlarni tartibli algoritm bilan qo'shish va ayirishni bilasiz.",
        'Теперь вы умеете складывать и вычитать дроби с разными знаменателями по чёткому алгоритму.',
      ),
      audio: L(
        "Dars yakunlandi. Har xil maxrajli kasrlarni qo'shish yoki ayirish uchun avval umumiy maxraj topiladi. So'ng suratlar ustida amal bajariladi, maxraj saqlanadi va javob kerak bo'lsa qisqartiriladi.",
        'Урок завершён. Чтобы сложить или вычесть дроби с разными знаменателями, сначала находят общий знаменатель. Затем выполняют действие с числителями, сохраняют знаменатель и при необходимости сокращают ответ.',
      ),
    },
  ],
};

export default function Dars10(props) {
  return <FractionTheoryLesson lesson={LESSON} {...props}/>;
}
