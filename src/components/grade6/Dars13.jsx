import FractionTheoryLesson from './FractionTheoryLesson.jsx';

const L = (uz, ru) => ({ uz, ru });

const LESSON = {
  id: 'frac_6_13',
  title: L("O'zaro teskari sonlar va sonni qismiga ko'ra topish", 'Взаимно обратные числа и нахождение числа по его части'),
  scoredScreens: [5, 7, 8, 10, 11, 12, 13],
  decorations: ['2/3', '3/2', '5/7', '7/5', '3/5', '5/8'],
  slides: [
    {
      type: 'title',
      eyebrow: L('Yangi mavzu', 'Новая тема'),
      title: L("O'zaro teskari sonlar va sonni qismiga ko'ra topish", 'Взаимно обратные числа и нахождение числа по его части'),
      subtitle: L(
        "Bugun ko'paytmasi 1 bo'lgan sonlarni va ma'lum qism orqali butun sonni topishni o'rganamiz.",
        'Сегодня изучим числа, произведение которых равно 1, и научимся находить целое по известной части.',
      ),
      audio: L(
        "Bugungi mavzu o'zaro teskari sonlar va sonni qismiga ko'ra topish. Bugun ko'paytmasi bir bo'lgan sonlarni va ma'lum qism orqali butun sonni topishni o'rganamiz.",
        'Тема урока — взаимно обратные числа и нахождение числа по его части. Сегодня изучим числа, произведение которых равно единице, и научимся находить целое по известной части.',
      ),
      visual: { type: 'equation', expression: '2/3 × 3/2 = 1' },
    },
    {
      type: 'question',
      scored: false,
      eyebrow: L('Kashfiyot', 'Открытие'),
      title: L("2/3 ni qaysi kasrga ko'paytirsak 1 chiqadi?", 'На какую дробь умножить 2/3, чтобы получить 1?'),
      prompt: L("Ko'paytuvchini tanlang.", 'Выберите множитель.'),
      intro: L(
        "Uchdan ikki kasrining surat va maxrajini o'rin almashtirib ko'ring. Hosil bo'lgan kasr bilan ko'paytma birga teng bo'lishi kerak.",
        'Поменяйте местами числитель и знаменатель дроби две трети. Произведение с полученной дробью должно быть равно единице.',
      ),
      options: ['2/3', '3/2', '1/3', '3/4'],
      correct: 1,
      why: [
        L("2/3 × 3/2 = 6/6.", '2/3 × 3/2 = 6/6.'),
        L("6/6 = 1, demak 2/3 va 3/2 o'zaro teskari sonlar.", '6/6 = 1, значит 2/3 и 3/2 — взаимно обратные числа.'),
      ],
      wrong: L("2/3 kasrining surat va maxrajini o'rin almashtiring.", 'Поменяйте местами числитель и знаменатель дроби 2/3.'),
      visual: { type: 'equation', expression: '2/3 × ? = 1' },
    },
    {
      type: 'info',
      eyebrow: L('Ta’rif', 'Определение'),
      title: L("O'zaro teskari sonlar", 'Взаимно обратные числа'),
      steps: [
        L("Ko'paytmasi 1 ga teng bo'lgan ikki son o'zaro teskari sonlar deyiladi.", 'Два числа, произведение которых равно 1, называют взаимно обратными.'),
        L("a/b kasrining teskari soni b/a bo'ladi, bunda a ham, b ham nolga teng emas.", 'Для дроби a/b обратной является дробь b/a, при этом a и b не равны нулю.'),
        L("Masalan, 5/7 va 7/5 o'zaro teskari, chunki ularning ko'paytmasi 1.", 'Например, 5/7 и 7/5 взаимно обратны, потому что их произведение равно 1.'),
      ],
      visual: { type: 'chain', items: ['5/7', '7/5', '5/7 × 7/5 = 1'] },
    },
    {
      type: 'rule',
      eyebrow: L('Muhim holatlar', 'Важные случаи'),
      title: L("Kasr, butun son, bir va nolning teskarisi", 'Обратные для дроби, целого числа, единицы и нуля'),
      steps: [
        L("a/b kasrining teskari sonini topish uchun surat bilan maxrajni o'rin almashtiramiz.", 'Чтобы найти число, обратное дроби a/b, меняем местами числитель и знаменатель.'),
        L("Butun n sonini n/1 deb yozamiz, shuning uchun uning teskarisi 1/n. Birning teskarisi yana bir.", 'Целое число n записываем как n/1, поэтому обратное ему равно 1/n. Обратное единице — единица.'),
        L("Nolning teskari soni mavjud emas, chunki 1/0 ifoda ma'noga ega emas.", 'У нуля нет обратного числа, потому что выражение 1/0 не имеет смысла.'),
      ],
      visual: {
        type: 'panels',
        panels: [
          { title: L('Teskari son bor', 'Обратное существует'), lines: ['4 → 1/4', '1 → 1'] },
          { title: L('Teskari son yo‘q', 'Обратного нет'), lines: ['0'] },
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Yangi masala turi', 'Новый тип задачи'),
      title: L("Butunni ma'lum qismiga ko'ra topish", 'Нахождение целого по известной части'),
      steps: [
        L("Agar sonning 3/5 qismi 18 bo'lsa, butun son noma'lum.", 'Если 3/5 числа равны 18, всё число неизвестно.'),
        L("Butunni topish uchun ma'lum qismni unga mos kasrga bo'lamiz: 18 : 3/5.", 'Чтобы найти целое, делим известную часть на соответствующую дробь: 18 : 3/5.'),
        L("18 × 5/3 = 30. Demak, izlangan son 30.", '18 × 5/3 = 30. Значит, искомое число равно 30.'),
      ],
      visual: { type: 'chain', items: ['3/5 qismi = 18', '18 : 3/5', '30'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Teskari son', 'Обратное число'),
      title: L("7/9 kasrining teskari sonini toping", 'Найдите число, обратное 7/9'),
      prompt: L("Surat va maxrajni o'rin almashtiring.", 'Поменяйте местами числитель и знаменатель.'),
      intro: L(
        "To'qqizdan yetti kasrining teskari sonini topish uchun surat yetti bilan maxraj to'qqizning o'rnini almashtiring.",
        'Чтобы найти число, обратное семи девятым, поменяйте местами числитель семь и знаменатель девять.',
      ),
      options: ['7/9', '9/7', '2/9', '9/2'],
      correct: 1,
      why: [
        L("7/9 ning surati 7, maxraji 9.", 'Числитель 7/9 равен 7, знаменатель — 9.'),
        L("Ularni o'rin almashtirsak 9/7 hosil bo'ladi; 7/9 × 9/7 = 1.", 'После перестановки получаем 9/7; 7/9 × 9/7 = 1.'),
      ],
      wrong: L("Kasrni o'zgartirmay qoldirmang; surat bilan maxraj joyini almashtiring.", 'Не оставляйте дробь без изменения; поменяйте местами числитель и знаменатель.'),
      fact: L("Har qanday nolga teng bo'lmagan sonning yagona teskari soni mavjud.", 'У любого ненулевого числа существует единственное обратное число.'),
      factVisual: '7/9 × 9/7 = 1',
      visual: { type: 'chain', items: ['7/9', '9/7', '1'] },
    },
    {
      type: 'info',
      eyebrow: L('Algoritm', 'Алгоритм'),
      title: L("Sonni qismiga ko'ra uch qadamda topamiz", 'Находим число по его части за три шага'),
      steps: [
        L("Ma'lum miqdor butunning qaysi kasr qismiga teng ekanini aniqlaymiz.", 'Определяем, какой дробной части целого равна известная величина.'),
        L("Ma'lum miqdorni shu kasrga bo'lamiz.", 'Делим известную величину на эту дробь.'),
        L("Bo'lishni teskari kasrga ko'paytirishga almashtirib, natijani tekshiramiz.", 'Заменяем деление умножением на обратную дробь и проверяем результат.'),
      ],
      visual: {
        type: 'steps',
        items: [
          L('Qismni bildirgan kasrni aniqlang', 'Определите дробь известной части'),
          L('Ma’lum miqdorni kasrga bo‘ling', 'Разделите известную величину на дробь'),
          L('Ko‘paytirib tekshiring', 'Проверьте умножением'),
        ],
      },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Butunni topamiz', 'Находим целое'),
      title: L("Sonning 3/5 qismi 18. Sonni toping", '3/5 числа равны 18. Найдите число'),
      prompt: L("18 ni 3/5 ga bo'ling.", 'Разделите 18 на 3/5.'),
      intro: L(
        "Ma'lum qism o'n sakkiz, unga mos kasr beshdan uch. O'n sakkizni beshdan uchga bo'lib, bo'lishni uchdan beshga ko'paytirishga almashtiring.",
        'Известная часть равна восемнадцати, ей соответствует дробь три пятых. Разделите восемнадцать на три пятых, заменив деление умножением на пять третьих.',
      ),
      options: ['30', '15', '12', '45'],
      correct: 0,
      why: [
        L("18 : 3/5 = 18 × 5/3.", '18 : 3/5 = 18 × 5/3.'),
        L("18 ni 3 ga bo'lsak 6; 6 × 5 = 30.", '18 разделить на 3 равно 6; 6 × 5 = 30.'),
      ],
      wrong: L("Ma'lum qismni kasrga ko'paytirmang; uni 3/5 ga bo'ling.", 'Не умножайте известную часть на дробь; разделите её на 3/5.'),
      visual: { type: 'chain', items: ['18 : 3/5', '18 × 5/3', '?'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Yana bir masala', 'Ещё одна задача'),
      title: L("Sonning 4/7 qismi 20. Sonni toping", '4/7 числа равны 20. Найдите число'),
      prompt: L("20 : 4/7 ifodasini hisoblang.", 'Вычислите выражение 20 : 4/7.'),
      intro: L(
        "Yettidan to'rt qism yigirmaga teng. Butunni topish uchun yigirmani yettidan to'rtga bo'ling, ya'ni to'rtdan yettiga ko'paytiring.",
        'Четыре седьмых равны двадцати. Чтобы найти целое, разделите двадцать на четыре седьмых, то есть умножьте на семь четвёртых.',
      ),
      options: ['28', '35', '80', '5'],
      correct: 1,
      why: [
        L("20 : 4/7 = 20 × 7/4.", '20 : 4/7 = 20 × 7/4.'),
        L("20 : 4 = 5 va 5 × 7 = 35.", '20 разделить на 4 равно 5, а 5 × 7 = 35.'),
      ],
      wrong: L("20 ni 4 ga bo'lib, natijani 7 ga ko'paytiring.", 'Разделите 20 на 4 и умножьте результат на 7.'),
      visual: { type: 'chain', items: ['4/7 qismi = 20', '20 × 7/4', '?'] },
    },
    {
      type: 'info',
      eyebrow: L('Ikki masalani farqlaymiz', 'Различаем две задачи'),
      title: L("Sonning qismini topish va qismiga ko'ra sonni topish", 'Нахождение части числа и числа по его части'),
      steps: [
        L("Son ma'lum bo'lsa va uning kasr qismi so'ralsa, sonni kasrga ko'paytiramiz.", 'Если число известно и требуется его дробная часть, умножаем число на дробь.'),
        L("Kasr qismning miqdori ma'lum bo'lsa va butun so'ralsa, ma'lum miqdorni kasrga bo'lamiz.", 'Если известна величина дробной части и требуется целое, делим известную величину на дробь.'),
        L("Tekshiruvda topilgan butunni berilgan kasrga ko'paytirib, ma'lum qismni qayta olishimiz kerak.", 'Для проверки умножаем найденное целое на данную дробь и должны получить известную часть.'),
      ],
      visual: {
        type: 'panels',
        panels: [
          { title: L('Qismni topish', 'Найти часть'), lines: ['30 × 3/5 = 18'] },
          { title: L('Butunni topish', 'Найти целое'), lines: ['18 : 3/5 = 30'] },
        ],
      },
    },
    {
      type: 'multi',
      scored: true,
      eyebrow: L('Bir nechta javob', 'Несколько ответов'),
      title: L("O'zaro teskari juftlarni belgilang", 'Отметьте взаимно обратные пары'),
      intro: L(
        "Har bir juftning ko'paytmasini tekshiring. Ko'paytmasi birga teng bo'lgan barcha juftlarni belgilang.",
        'Проверьте произведение каждой пары. Отметьте все пары, произведение которых равно единице.',
      ),
      options: ['2/5 va 5/2', '3/7 va 7/3', '4 va 1/4', '5/6 va 5/6'],
      correctSet: [0, 1, 2],
      why: [
        L("Birinchi uchta juftda surat va maxrajlar o'rin almashgan, ko'paytma 1.", 'В первых трёх парах числитель и знаменатель поменялись местами, произведение равно 1.'),
        L("5/6 × 5/6 = 25/36, bu 1 ga teng emas.", '5/6 × 5/6 = 25/36, это не равно 1.'),
      ],
      wrong: L("Juftlarni ko'paytiring; natija aynan 1 bo'lishi kerak.", 'Перемножьте числа в паре; результат должен быть ровно 1.'),
    },
    {
      type: 'match',
      scored: true,
      eyebrow: L('Moslashtirish', 'Соответствие'),
      title: L("Sonlarni teskarilari bilan juftlang", 'Соедините числа с обратными'),
      prompt: L("Chapdagi har bir son uchun uning teskari sonini tanlang.", 'Для каждого числа слева выберите обратное ему число.'),
      intro: L(
        "Kasrlarning surat va maxrajini o'rin almashtiring. Butun sonni maxraji bir bo'lgan kasr deb qarang.",
        'Поменяйте местами числитель и знаменатель дробей. Целое число рассматривайте как дробь со знаменателем один.',
      ),
      rows: [
        { left: '3/8', correct: L('8/3', '8/3') },
        { left: '5', correct: L('1/5', '1/5') },
        { left: '7/4', correct: L('4/7', '4/7') },
      ],
      why: [
        L("3/8 ning teskarisi 8/3, 5 ning teskarisi 1/5.", 'Обратное для 3/8 равно 8/3, а для 5 — 1/5.'),
        L("7/4 ning teskarisi 4/7.", 'Обратное для 7/4 равно 4/7.'),
      ],
      wrong: L("Har bir juftning ko'paytmasi 1 bo'lishini tekshiring.", 'Проверьте, что произведение чисел каждой пары равно 1.'),
    },
    {
      type: 'classify',
      scored: true,
      eyebrow: L('Amalni tanlaymiz', 'Выбираем действие'),
      title: L("Masalalarni ko'paytirish va bo'lish guruhiga ajrating", 'Разделите задачи на умножение и деление'),
      prompt: L("Qism topilsa ko'paytirish, butun topilsa bo'lish guruhini tanlang.", 'Если ищется часть, выберите умножение; если целое — деление.'),
      intro: L(
        "Har bir kartada nima ma'lum va nima noma'lum ekanini aniqlang. Son ma'lum bo'lsa, uning qismini sonni kasrga ko'paytirib topamiz. Qism ma'lum bo'lsa, butunni shu kasrga bo'lib topamiz.",
        'Определите, что известно и что требуется в каждой карточке. Если известно число, часть находим умножением; если известна часть, целое находим делением.',
      ),
      binA: L("Ko'paytirish", 'Умножение'),
      binB: L("Bo'lish", 'Деление'),
      cards: [
        { label: '40 ning 3/8 qismini topish', value: true },
        { label: '2/5 qismi 14 bo‘lgan sonni topish', value: false },
        { label: '24 ning 5/6 qismini topish', value: true },
        { label: '3/4 qismi 21 bo‘lgan sonni topish', value: false },
      ],
      why: [
        L("Butun son berilib qismi so'ralgan kartalarda ko'paytirish ishlatiladi.", 'Умножение используется там, где дано целое и требуется его часть.'),
        L("Qismning miqdori berilib butun so'ralgan kartalarda bo'lish ishlatiladi.", 'Деление используется там, где известна часть и требуется целое.'),
      ],
      wrong: L("Savolda butunmi yoki uning qismimi noma'lum ekanini yana tekshiring.", 'Ещё раз проверьте, неизвестно целое или его часть.'),
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("Sonning 5/8 qismi 25. Sonni toping", '5/8 числа равны 25. Найдите число'),
      prompt: L("25 ni 5/8 ga bo'lib, natijani tekshiring.", 'Разделите 25 на 5/8 и проверьте результат.'),
      intro: L(
        "Sakkizdan besh qism yigirma beshga teng. Butunni topish uchun yigirma beshni sakkizdan beshga bo'ling, ya'ni beshdan sakkizga ko'paytiring.",
        'Пять восьмых равны двадцати пяти. Чтобы найти целое, разделите двадцать пять на пять восьмых, то есть умножьте на восемь пятых.',
      ),
      options: ['30', '35', '40', '45'],
      correct: 2,
      why: [
        L("25 : 5/8 = 25 × 8/5.", '25 : 5/8 = 25 × 8/5.'),
        L("25 : 5 = 5 va 5 × 8 = 40. Tekshiruv: 40 × 5/8 = 25.", '25 разделить на 5 равно 5, а 5 × 8 = 40. Проверка: 40 × 5/8 = 25.'),
      ],
      wrong: L("25 ni 5 ga bo'lib, chiqqan natijani 8 ga ko'paytiring.", 'Разделите 25 на 5 и умножьте полученный результат на 8.'),
      fact: L("Sonni qismiga ko'ra topish amali kasrga bo'lishning hayotiy qo'llanishidir.", 'Нахождение числа по его части — практическое применение деления на дробь.'),
      factVisual: '25 : 5/8 = 40',
      visual: { type: 'chain', items: ['25 : 5/8', '25 × 8/5', '40'] },
    },
    {
      type: 'summary',
      eyebrow: L('Dars yakuni', 'Итог урока'),
      title: L("Teskari sonlar va butunni topishni o'rgandingiz", 'Вы изучили обратные числа и нахождение целого'),
      points: [
        L("O'zaro teskari sonlarning ko'paytmasi 1 ga teng.", 'Произведение взаимно обратных чисел равно 1.'),
        L("Nolga teng bo'lmagan kasrning teskarisi surat va maxrajni almashtirish bilan topiladi.", 'Обратное ненулевой дроби получают перестановкой числителя и знаменателя.'),
        L("Butun son ma'lum qismga ko'ra ma'lum miqdorni kasrga bo'lish orqali topiladi.", 'Целое по известной части находят делением известной величины на дробь.'),
      ],
      close: L(
        "Endi teskari sonni va butunni uning ma'lum qismi orqali topa olasiz.",
        'Теперь вы умеете находить обратное число и целое по его известной части.',
      ),
      audio: L(
        "Teskari sonlar va butunni topishni o'rgandingiz. O'zaro teskari sonlarning ko'paytmasi birga teng. Nolga teng bo'lmagan kasrning teskarisi surat va maxrajni almashtirish bilan topiladi. Butun son ma'lum qismga ko'ra ma'lum miqdorni kasrga bo'lish orqali topiladi. Endi teskari sonni va butunni uning ma'lum qismi orqali topa olasiz.",
        'Вы изучили обратные числа и нахождение целого. Произведение взаимно обратных чисел равно единице. Обратное для ненулевой дроби получают перестановкой числителя и знаменателя. Целое по известной части находят делением известной величины на дробь. Теперь вы умеете находить обратное число и целое по его известной части.',
      ),
    },
  ],
};

export default function Dars13(props) {
  return <FractionTheoryLesson lesson={LESSON} {...props}/>;
}
