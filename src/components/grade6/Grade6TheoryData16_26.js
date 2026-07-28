const L = (uz, ru) => ({ uz, ru });
const lines = (...pairs) => pairs.map(([uz, ru]) => L(uz, ru));

const title = (titleText, subtitle, audio, visual) => ({
  type: 'title',
  eyebrow: L('Yangi mavzu', 'Новая тема'),
  title: titleText,
  subtitle,
  audio,
  visual,
});

const info = (titleText, stepLines, visual, eyebrow = L('Tushuntirish', 'Объяснение'), audio) => ({
  type: 'info',
  eyebrow,
  title: titleText,
  steps: stepLines,
  visual,
  ...(audio ? { audio } : {}),
});

const rule = (titleText, stepLines, visual, audio) => ({
  type: 'rule',
  eyebrow: L('Asosiy qoida', 'Главное правило'),
  title: titleText,
  steps: stepLines,
  visual,
  ...(audio ? { audio } : {}),
});

const question = ({
  title: titleText,
  prompt,
  intro,
  options,
  correct,
  why,
  wrong,
  visual,
  scored = true,
  eyebrow = L('Mashq', 'Практика'),
  fact,
  factVisual,
}) => ({
  type: 'question',
  scored,
  eyebrow,
  title: titleText,
  prompt,
  intro,
  options,
  correct,
  why,
  wrong,
  visual,
  ...(fact ? { fact, factVisual } : {}),
});

const multi = ({ title: titleText, intro, options, correctSet, why, wrong, scored = true }) => ({
  type: 'multi',
  scored,
  eyebrow: L('Bir nechta javob', 'Несколько ответов'),
  title: titleText,
  intro,
  options,
  correctSet,
  why,
  wrong,
});

const match = ({ title: titleText, prompt, intro, rows, why, wrong, scored = true }) => ({
  type: 'match',
  scored,
  eyebrow: L('Moslashtirish', 'Соответствие'),
  title: titleText,
  prompt,
  intro,
  rows,
  why,
  wrong,
});

const classify = ({
  title: titleText,
  prompt,
  intro,
  binA,
  binB,
  cards,
  why,
  wrong,
  scored = true,
}) => ({
  type: 'classify',
  scored,
  eyebrow: L('Tasniflash', 'Классификация'),
  title: titleText,
  prompt,
  intro,
  binA,
  binB,
  cards,
  why,
  wrong,
});

const summary = (titleText, points, close, audio) => ({
  type: 'summary',
  eyebrow: L('Dars yakuni', 'Итог урока'),
  title: titleText,
  points,
  close,
  audio,
});

const makeLesson = ({ id, title: lessonTitle, decorations, slides }) => ({
  id,
  title: lessonTitle,
  decorations,
  slides,
  scoredScreens: slides.flatMap((slide, index) => (slide.scored ? [index] : [])),
});

const DARS16 = (() => {
  const lessonTitle = L("Kasrlar va o'nli kasrlarga oid masalalar", 'Задачи с дробями и десятичными дробями');
  const slides = [
    title(
      lessonTitle,
      L(
        "Bugun hayotiy masalalarda kasr va o'nli kasrlarni birgalikda, lekin tartibli ishlatishni o'rganamiz.",
        'Сегодня научимся аккуратно применять обыкновенные и десятичные дроби в жизненных задачах.',
      ),
      L(
        "Bugungi mavzu kasrlar va o'nli kasrlarga oid masalalar. Masalani chalkashtirmaslik uchun avval kattalik va birliklarni aniqlaymiz, sonlarni bitta qulay ko'rinishga keltiramiz, keyin amalni tanlaymiz. Buni xarid, retsept va masofa misollarida ko'ramiz.",
        'Тема урока — задачи с обыкновенными и десятичными дробями. Чтобы не запутаться, сначала определим величины и единицы, приведём числа к удобному виду, а затем выберем действие. Разберём покупки, рецепты и расстояния.',
      ),
      { type: 'chain', items: ['3/4', '0,75', '75%'] },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("Ichimlikning jami hajmini toping", 'Найдите общий объём напитка'),
      prompt: L("Idishga 3/4 litr sharbat va 0,5 litr suv quyildi. Jami necha litr bo'ldi?", 'В сосуд налили 3/4 литра сока и 0,5 литра воды. Каков общий объём?'),
      intro: L(
        "Idishda to'rtdan uch litr sharbat va nol butun o'ndan besh litr suv bor. Sonlar turli ko'rinishda yozilgan. To'rtdan uch litr nol butun yuzdan yetmish besh litrga tengligini eslab, jami hajmni tanlang.",
        'В сосуде три четверти литра сока и ноль целых пять десятых литра воды. Числа записаны по-разному. Вспомните, что три четверти литра равны нулю целым семидесяти пяти сотым литра, и выберите общий объём.',
      ),
      options: ['0,8 l', '1,0 l', '1,25 l', '1,75 l'],
      correct: 2,
      why: lines(
        ["3/4 litr = 0,75 litr.", '3/4 литра = 0,75 литра.'],
        ["0,75 + 0,5 = 1,25. Jami 1,25 litr.", '0,75 + 0,5 = 1,25. Всего 1,25 литра.'],
      ),
      wrong: L("Avval 3/4 ni 0,75 ga aylantiring, keyin hajmlarni qo'shing.", 'Сначала замените 3/4 на 0,75, затем сложите объёмы.'),
      visual: { type: 'equation', expression: '3/4 l + 0,5 l = ?' },
    }),
    info(
      L("Masalani to'rt qadamda yechamiz", 'Решаем задачу за четыре шага'),
      lines(
        ["Shartdan nima ma'lum va nimani topish kerakligini ajrating.", 'Выделите, что известно и что требуется найти.'],
        ["Barcha o'lchov birliklarini bir xil qiling.", 'Приведите все единицы измерения к одному виду.'],
        ["Kasrlarni bitta qulay ko'rinishga keltirib, amalni bajaring.", 'Приведите дроби к удобному виду и выполните действие.'],
        ["Javobni mazmunan tekshiring: u taxminiy natijaga mosmi?", 'Проверьте смысл ответа: согласуется ли он с примерной оценкой?'],
      ),
      { type: 'steps', items: [L('Ma’lum va noma’lum', 'Дано и неизвестно'), L('Birliklar', 'Единицы'), L('Hisoblash', 'Вычисление'), L('Tekshirish', 'Проверка')] },
    ),
    info(
      L("Qaysi ko'rinish qulay?", 'Какая запись удобнее?'),
      lines(
        ["Pul va uzunliklarda o'nli kasr ko'pincha qulay: 1/2 = 0,5.", 'Для денег и длины часто удобна десятичная дробь: 1/2 = 0,5.'],
        ["Bo'lak va ulushlarda oddiy kasr qulay: 0,25 = 1/4.", 'Для частей и долей удобна обыкновенная дробь: 0,25 = 1/4.'],
        ["Muhimi, bitta amalda sonlarni aralashtirmasdan avval bir ko'rinishga keltirishdir.", 'Главное — перед действием привести числа к одному виду, а не смешивать записи.'],
      ),
      {
        type: 'panels',
        panels: [
          { title: L("O'nli ko'rinish", 'Десятичная запись'), lines: ['1/2 = 0,5', '1/4 = 0,25'], color: 'blue' },
          { title: L('Oddiy kasr', 'Обыкновенная дробь'), lines: ['0,75 = 3/4', '0,2 = 1/5'], color: 'yellow' },
        ],
      },
    ),
    rule(
      L("Avval bir xil ko'rinish, keyin amal", 'Сначала один вид записи, затем действие'),
      lines(
        ["Qo'shish va ayirishdan oldin sonlarni oddiy yoki o'nli kasr ko'rinishida birxillashtiring.", 'Перед сложением и вычитанием приведите числа к обыкновенным или десятичным дробям.'],
        ["Sonning kasr qismini topishda butun sonni shu kasrga ko'paytiring.", 'Чтобы найти дробную часть числа, умножьте число на эту дробь.'],
        ["Qismiga ko'ra butunni topishda berilgan qismni kasrga bo'ling.", 'Чтобы найти целое по его части, разделите известную часть на дробь.'],
      ),
      { type: 'cards', items: [{ label: 'a · m/n', color: 'yellow' }, 'a : m/n', '0,5 = 1/2'] },
    ),
    question({
      title: L("Xarid uchun qancha sarflandi?", 'Сколько потратили на покупку?'),
      prompt: L("80 000 so'mning 3/8 qismi kitobga sarflandi. Necha so'm sarflangan?", 'На книгу потратили 3/8 от 80 000 сумов. Сколько это?'),
      intro: L(
        "Sakson ming so'mning sakkizdan uch qismini topamiz. Butun summani sakkizga bo'lib, natijani uchga ko'paytiring.",
        'Найдём три восьмых от восьмидесяти тысяч сумов. Разделите всю сумму на восемь и умножьте результат на три.',
      ),
      options: ["20 000 so'm", "30 000 so'm", "40 000 so'm", "50 000 so'm"],
      correct: 1,
      why: lines(
        ["80 000 : 8 = 10 000.", '80 000 : 8 = 10 000.'],
        ["10 000 · 3 = 30 000. Kitobga 30 000 so'm sarflangan.", '10 000 · 3 = 30 000. На книгу потратили 30 000 сумов.'],
      ),
      wrong: L("Avval summaning 1/8 qismini, keyin 3/8 qismini toping.", 'Сначала найдите 1/8 суммы, затем 3/8.'),
      visual: { type: 'chain', items: ['80 000 : 8', '10 000 · 3', '30 000'] },
    }),
    info(
      L("Retseptda kasrlarni qo'shish", 'Сложение дробей в рецепте'),
      lines(
        ["Xamir uchun 3/4 stakan sut va 1/2 stakan suv kerak.", 'Для теста нужны 3/4 стакана молока и 1/2 стакана воды.'],
        ["Umumiy maxraj 4: 1/2 = 2/4.", 'Общий знаменатель равен 4: 1/2 = 2/4.'],
        ["3/4 + 2/4 = 5/4 = 1 1/4 stakan suyuqlik.", '3/4 + 2/4 = 5/4 = 1 1/4 стакана жидкости.'],
      ),
      { type: 'chain', items: ['3/4 + 1/2', '3/4 + 2/4', '1 1/4'] },
    ),
    question({
      title: L("Yo'lning qancha qismi qoldi?", 'Сколько пути осталось?'),
      prompt: L("Sayyoh 12,5 kilometr yo'lning 0,4 kilometrini yurdi. Qancha yo'l qoldi?", 'Турист прошёл 0,4 километра из 12,5 километра. Сколько осталось?'),
      intro: L(
        "Butun yo'l o'n ikki butun o'ndan besh kilometr. Undan nol butun o'ndan to'rt kilometr yurildi. Qolgan masofani ayirish bilan toping.",
        'Весь путь равен двенадцати целым пяти десятым километра. Пройдено ноль целых четыре десятых километра. Найдите остаток вычитанием.',
      ),
      options: ['8,5 km', '12,1 km', '12,9 km', '16,5 km'],
      correct: 1,
      why: lines(
        ["12,5 − 0,4 = 12,1.", '12,5 − 0,4 = 12,1.'],
        ["Yurilgan masofa ayirilgani uchun javob 12,5 dan kichik bo'lishi kerak.", 'Так как пройденное расстояние вычитают, ответ должен быть меньше 12,5.'],
      ),
      wrong: L("Yurilgan masofani jami masofadan ayiring va vergullarni bir ustunga yozing.", 'Вычтите пройденное расстояние из всего пути, расположив запятые друг под другом.'),
      visual: { type: 'equation', expression: '12,5 − 0,4 = ?' },
    }),
    question({
      title: L("Sinfning 2/5 qismini toping", 'Найдите 2/5 класса'),
      prompt: L("Sinfda 45 o'quvchi bor. Ularning 2/5 qismi sport to'garagiga qatnaydi. Nechta o'quvchi qatnaydi?", 'В классе 45 учеников. 2/5 из них посещают спортивный кружок. Сколько учеников?'),
      intro: L(
        "Qirq besh o'quvchining beshdan ikki qismini toping. Avval qirq beshni beshga bo'ling, so'ng ikkiga ko'paytiring.",
        'Найдите две пятых от сорока пяти учеников. Сначала разделите сорок пять на пять, затем умножьте на два.',
      ),
      options: ['9', '16', '18', '20'],
      correct: 2,
      why: lines(
        ["45 : 5 = 9 — bu sinfning 1/5 qismi.", '45 : 5 = 9 — это 1/5 класса.'],
        ["9 · 2 = 18. To'garakka 18 o'quvchi qatnaydi.", '9 · 2 = 18. Кружок посещают 18 учеников.'],
      ),
      wrong: L("Butunni maxrajga bo'ling, keyin suratga ko'paytiring.", 'Разделите целое на знаменатель, затем умножьте на числитель.'),
      visual: { type: 'chain', items: ['45 : 5', '9 · 2', '18'] },
    }),
    info(
      L("Ikki bosqichli budjet masalasi", 'Двухшаговая задача о бюджете'),
      lines(
        ["Oilada 150 000 so'm bor. Uning 0,2 qismi yo'lga sarflandi: 150 000 · 0,2 = 30 000.", 'В семье есть 150 000 сумов. На дорогу потратили 0,2 суммы: 150 000 · 0,2 = 30 000.'],
        ["120 000 so'm qoldi. Qolgan pulning 2/5 qismi oziq-ovqatga ketdi: 120 000 · 2/5 = 48 000.", 'Осталось 120 000 сумов. На продукты ушло 2/5 остатка: 120 000 · 2/5 = 48 000.'],
        ["Masalada ikkinchi ulush boshlang'ich puldan emas, qolgan puldan olinadi.", 'Во втором действии долю находят не от начальной суммы, а от остатка.'],
      ),
      {
        type: 'panels',
        panels: [
          { title: L('1-bosqich', 'Шаг 1'), lines: ['150 000 − 30 000 = 120 000'], color: 'blue' },
          { title: L('2-bosqich', 'Шаг 2'), lines: ['120 000 · 2/5 = 48 000'], color: 'yellow' },
        ],
      },
    ),
    multi({
      title: L("Qiymati 0,75 ga teng yozuvlarni belgilang", 'Отметьте записи, равные 0,75'),
      intro: L(
        "Nol butun yuzdan yetmish beshga teng bo'lgan barcha oddiy kasr va foiz yozuvlarini belgilang.",
        'Отметьте все обыкновенные дроби и проценты, равные нулю целым семидесяти пяти сотым.',
      ),
      options: ['3/4', '75%', '7/10', '6/8'],
      correctSet: [0, 1, 3],
      why: lines(
        ["3/4 = 0,75 va 6/8 qisqartirilganda 3/4 bo'ladi.", '3/4 = 0,75, а 6/8 после сокращения равно 3/4.'],
        ["75% = 75/100 = 0,75. Ammo 7/10 = 0,7.", '75% = 75/100 = 0,75. Но 7/10 = 0,7.'],
      ),
      wrong: L("Har bir yozuvni yuzdan birlar yoki o'nli kasr ko'rinishiga keltiring.", 'Приведите каждую запись к сотым или к десятичной дроби.'),
    }),
    match({
      title: L("Masalani kerakli amal bilan juftlang", 'Соедините задачу с нужным действием'),
      prompt: L("Har bir vaziyat uchun birinchi bajariladigan amalni tanlang.", 'Для каждой ситуации выберите первое действие.'),
      intro: L(
        "Masalani to'liq hisoblash shart emas. Undagi ma'no bo'yicha qo'shish, ayirish yoki kasr qismini topish amalini juftlang.",
        'Полностью вычислять не нужно. По смыслу соедините ситуацию со сложением, вычитанием или нахождением дробной части.',
      ),
      rows: [
        { left: L('Ikki idishdagi suvni birlashtirish', 'Объединить воду из двух сосудов'), correct: L("Qo'shish", 'Сложение') },
        { left: L("Yo'lning qolgan qismini topish", 'Найти оставшийся путь'), correct: L('Ayirish', 'Вычитание') },
        { left: L('Pulning 3/5 qismini topish', 'Найти 3/5 суммы'), correct: L("Ko'paytirish", 'Умножение') },
      ],
      why: lines(
        ["Birlashtirishda qo'shamiz, qoldiqni topishda ayiramiz.", 'При объединении складываем, при нахождении остатка вычитаем.'],
        ["Sonning kasr qismini topishda sonni kasrga ko'paytiramiz.", 'Чтобы найти дробную часть числа, умножаем число на дробь.'],
      ),
      wrong: L("Vaziyatdagi 'jami', 'qoldi' va 'qismi' so'zlariga e'tibor bering.", 'Обратите внимание на слова «всего», «осталось» и «часть».'),
    }),
    info(
      L("Javobni taxmin bilan tekshiring", 'Проверяйте ответ оценкой'),
      lines(
        ["3/8 soni 1/2 dan kichik, demak 80 000 ning 3/8 qismi 40 000 dan kichik bo'lishi kerak.", '3/8 меньше 1/2, значит 3/8 от 80 000 должно быть меньше 40 000.'],
        ["12,5 dan 0,4 ayirilsa, natija 12 ga yaqin bo'lishi kerak.", 'Если из 12,5 вычесть 0,4, результат должен быть близок к 12.'],
        ["Taxmin hisobdagi katta xatoni tez topishga yordam beradi.", 'Оценка помогает быстро заметить крупную ошибку в вычислениях.'],
      ),
      { type: 'cards', items: [{ label: '3/8 < 1/2', color: 'yellow' }, '30 000 < 40 000', '12,5 − 0,4 ≈ 12'] },
    ),
    question({
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("Xariddan keyin qancha pul qoldi?", 'Сколько денег осталось после покупки?'),
      prompt: L("240 000 so'mning 3/8 qismiga kiyim olindi. Qancha pul qoldi?", 'На одежду потратили 3/8 от 240 000 сумов. Сколько денег осталось?'),
      intro: L(
        "Avval ikki yuz qirq ming so'mning sakkizdan uch qismini toping. Keyin sarflangan pulni boshlang'ich summadan ayiring.",
        'Сначала найдите три восьмых от двухсот сорока тысяч сумов. Затем вычтите потраченную сумму из начальной.',
      ),
      options: ["90 000 so'm", "120 000 so'm", "150 000 so'm", "180 000 so'm"],
      correct: 2,
      why: lines(
        ["240 000 : 8 · 3 = 90 000 so'm sarflandi.", '240 000 : 8 · 3 = 90 000 сумов потрачено.'],
        ["240 000 − 90 000 = 150 000 so'm qoldi.", '240 000 − 90 000 = 150 000 сумов осталось.'],
      ),
      wrong: L("Masala ikki amalga ega: avval sarflangan qismni, keyin qoldiqni toping.", 'В задаче два действия: сначала найдите потраченную часть, затем остаток.'),
      fact: L("Ikki bosqichli masalada har bir oraliq natijaning nimani bildirishini yozish xatoni kamaytiradi.", 'В двухшаговой задаче полезно подписывать смысл каждого промежуточного результата.'),
      factVisual: '240 000 − 90 000 = 150 000',
      visual: { type: 'chain', items: ['240 000 · 3/8', '90 000', '150 000'] },
    }),
    summary(
      L("Hayotiy masalalarni tartibli yecha olasiz", 'Вы умеете решать жизненные задачи по порядку'),
      lines(
        ["Avval kattaliklar va o'lchov birliklari aniqlanadi.", 'Сначала определяются величины и единицы измерения.'],
        ["Sonlar bitta qulay ko'rinishga keltiriladi.", 'Числа приводятся к одному удобному виду.'],
        ["Amal bajarilib, javob taxmin va masala mazmuni bilan tekshiriladi.", 'Действие выполняется, а ответ проверяется оценкой и смыслом задачи.'],
      ),
      L("Endi kasr va o'nli kasr bir masalada uchrasa ham, ularni bosqichma-bosqich ishlata olasiz.", 'Теперь вы можете по шагам работать с обыкновенными и десятичными дробями в одной задаче.'),
      L(
        "Dars yakunlandi. Masalani yechishda avval ma'lum va noma'lumni, keyin birliklarni aniqlaymiz. Sonlarni bitta qulay ko'rinishga keltirib, amalni bajaramiz va javobni taxmin bilan tekshiramiz.",
        'Урок завершён. Сначала определяем известное и неизвестное, затем единицы. Приводим числа к удобному виду, выполняем действие и проверяем ответ оценкой.',
      ),
    ),
  ];
  return makeLesson({ id: 'word_6_16', title: lessonTitle, decorations: ['3/4', '0,5', '75%', '12,5', '2/5', '1,25'], slides });
})();

const DARS17 = (() => {
  const lessonTitle = L('Nisbat', 'Отношение');
  const slides = [
    title(
      lessonTitle,
      L("Bugun ikki miqdorni nisbat yordamida taqqoslash va nisbatni soddalashtirishni o'rganamiz.", 'Сегодня научимся сравнивать две величины с помощью отношения и упрощать отношения.'),
      L(
        "Bugungi mavzu nisbat. Nisbat ikki miqdordan biri ikkinchisiga nisbatan necha marta katta yoki uning qanday qismini tashkil qilishini ko'rsatadi. Rangli sharlar, retsept va sinf tarkibi misollarida nisbatning tartibi va soddalashtirilishini o'rganamiz.",
        'Тема урока — отношение. Отношение показывает, во сколько раз одна величина больше другой или какую часть от неё составляет. На примерах цветных шаров, рецепта и состава класса изучим порядок и упрощение отношений.',
      ),
      { type: 'cards', items: [{ label: '2 : 3', color: 'yellow' }, '4 : 6', '6 : 9'] },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("Olmalar va noklar nisbatini toping", 'Найдите отношение яблок к грушам'),
      prompt: L("Savatda 4 ta olma va 6 ta nok bor. Olmalar sonining noklar soniga nisbati soddalashtirilsa nima chiqadi?", 'В корзине 4 яблока и 6 груш. Чему равно сокращённое отношение числа яблок к числу груш?'),
      intro: L(
        "Savatda to'rtta olma va oltita nok bor. Olmalarni birinchi, noklarni ikkinchi yozamiz. To'rtning oltiga nisbatini ikkiga qisqartirib, javobni tanlang.",
        'В корзине четыре яблока и шесть груш. Число яблок записываем первым, число груш вторым. Сократите отношение четырёх к шести на два и выберите ответ.',
      ),
      options: ['1 : 3', '2 : 3', '3 : 2', '4 : 3'],
      correct: 1,
      why: lines(
        ["Olmalar va noklar nisbati 4 : 6.", 'Отношение яблок к грушам равно 4 : 6.'],
        ["Ikkala sonni 2 ga bo'lsak 2 : 3 hosil bo'ladi.", 'Если разделить оба числа на 2, получится 2 : 3.'],
      ),
      wrong: L("So'rovdagi tartibni saqlang: avval olma, keyin nok. Ikkala sonni 2 ga bo'ling.", 'Соблюдайте порядок: сначала яблоки, затем груши. Разделите оба числа на 2.'),
      visual: { type: 'chain', items: ['4 : 6', '2 : 3'], connector: L('qisqartiramiz →', 'сокращаем →') },
    }),
    info(
      L("Nisbat nimani ko'rsatadi?", 'Что показывает отношение?'),
      lines(
        ["a ning b ga nisbati a : b ko'rinishida yoziladi.", 'Отношение a к b записывают в виде a : b.'],
        ["Bu yozuv a miqdorni b miqdorga taqqoslaydi.", 'Эта запись сравнивает величину a с величиной b.'],
        ["Masalan, 2 : 3 nisbati har 2 ta birinchi turga 3 ta ikkinchi tur mos kelishini bildiradi.", 'Например, отношение 2 : 3 означает, что на каждые 2 единицы первого вида приходится 3 единицы второго.'],
      ),
      { type: 'equation', expression: 'a : b' },
      L('Yangi tushuncha', 'Новое понятие'),
      {
        uz: ["a ning b ga nisbati a nisbat b ko'rinishida yoziladi.", "Bu yozuv a miqdorni b miqdorga taqqoslaydi.", "Masalan, ikki nisbat uch har ikki dona birinchi turga uch dona ikkinchi tur mos kelishini bildiradi."],
        ru: ['Отношение a к b записывают как a к b.', 'Эта запись сравнивает величину a с величиной b.', 'Например, отношение два к трём означает, что на каждые две единицы первого вида приходится три единицы второго.'],
      },
    ),
    rule(
      L("Nisbat — ikki sonning bo'linmasi", 'Отношение — частное двух чисел'),
      lines(
        ["a : b nisbati a/b kasr bilan bir xil qiymatni bildiradi.", 'Отношение a : b имеет то же значение, что и дробь a/b.'],
        ["Nisbatning ikkinchi hadi nol bo'lishi mumkin emas.", 'Второй член отношения не может быть равен нулю.'],
        ["Nisbatning ikkala hadini bir xil noldan farqli songa ko'paytirish yoki bo'lish qiymatni o'zgartirmaydi.", 'Умножение или деление обоих членов отношения на одно ненулевое число не меняет его значения.'],
      ),
      { type: 'equation', expression: 'a : b = a/b,  b ≠ 0' },
      {
        uz: ["a ning b ga nisbati a bo'lingan b kasr bilan bir xil qiymatni bildiradi.", "Nisbatning ikkinchi hadi nol bo'lishi mumkin emas.", "Ikkala hadni bir xil noldan farqli songa ko'paytirish yoki bo'lish nisbatni o'zgartirmaydi."],
        ru: ['Отношение a к b равно дроби a, делённое на b.', 'Второй член отношения не может быть равен нулю.', 'Умножение или деление обоих членов на одно ненулевое число не меняет отношение.'],
      },
    ),
    info(
      L("Nisbatni soddalashtirish", 'Упрощение отношения'),
      lines(
        ["6 : 9 nisbatining ikkala hadi 3 ga bo'linadi.", 'Оба члена отношения 6 : 9 делятся на 3.'],
        ["6 ni 3 ga bo'lsak 2, 9 ni 3 ga bo'lsak 3 chiqadi.", '6 разделить на 3 равно 2, а 9 разделить на 3 равно 3.'],
        ["Shuning uchun 6 : 9 va 2 : 3 teng nisbatlardir.", 'Поэтому 6 : 9 и 2 : 3 — равные отношения.'],
      ),
      { type: 'chain', items: ['6 : 9', '2 : 3'], connector: L(': 3 →', ': 3 →') },
      L('Bosqichma-bosqich', 'Шаг за шагом'),
      {
        uz: ["Olti nisbat to'qqiz yozuvidagi ikkala had uchga bo'linadi.", "Oltini uchga bo'lsak ikki, to'qqizni uchga bo'lsak uch chiqadi.", "Shuning uchun olti nisbat to'qqiz va ikki nisbat uch teng nisbatlardir."],
        ru: ['Оба члена отношения шесть к девяти делятся на три.', 'Шесть разделить на три равно двум, девять разделить на три равно трём.', 'Поэтому отношения шесть к девяти и два к трём равны.'],
      },
    ),
    question({
      title: L("Qizil va ko'k sharlar nisbatini toping", 'Найдите отношение красных шаров к синим'),
      prompt: L("8 ta qizil va 12 ta ko'k shar bor. Qizil sharlarning ko'k sharlarga nisbati qanday?", 'Есть 8 красных и 12 синих шаров. Каково отношение красных шаров к синим?'),
      intro: L(
        "Sakkizta qizil va o'n ikkita ko'k shar bor. Avval sakkizning o'n ikkiga nisbatini yozing, so'ng ikkala hadni to'rtga bo'lib soddalashtiring.",
        'Есть восемь красных и двенадцать синих шаров. Запишите отношение восьми к двенадцати и сократите, разделив оба члена на четыре.',
      ),
      options: ['1 : 2', '2 : 3', '3 : 2', '4 : 5'],
      correct: 1,
      why: lines(
        ["Qizil : ko'k = 8 : 12.", 'Красные : синие = 8 : 12.'],
        ["8 va 12 ni 4 ga bo'lsak 2 : 3 hosil bo'ladi.", 'Если разделить 8 и 12 на 4, получится 2 : 3.'],
      ),
      wrong: L("Avval qizil sharlar sonini yozing va ikkala hadni 4 ga bo'ling.", 'Сначала запишите число красных шаров и разделите оба члена на 4.'),
      visual: { type: 'cards', items: [{ label: '8 qizil', color: 'yellow' }, { label: "12 ko'k", color: 'blue' }] },
    }),
    info(
      L("Nisbatda tartib muhim", 'В отношении важен порядок'),
      lines(
        ["2 ta qizil va 5 ta ko'k shar bo'lsa, qizilning ko'kka nisbati 2 : 5.", 'Если есть 2 красных и 5 синих шаров, отношение красных к синим равно 2 : 5.'],
        ["Ko'kning qizilga nisbati esa 5 : 2.", 'А отношение синих к красным равно 5 : 2.'],
        ["Savolda qaysi miqdor birinchi aytilgan bo'lsa, nisbatda ham o'sha birinchi yoziladi.", 'В отношении первой записывают величину, которая первой названа в вопросе.'],
      ),
      {
        type: 'panels',
        panels: [
          { title: L("Qizilning ko'kka", 'Красных к синим'), lines: ['2 : 5'], color: 'yellow' },
          { title: L("Ko'kning qizilga", 'Синих к красным'), lines: ['5 : 2'], color: 'blue' },
        ],
      },
      undefined,
      {
        uz: ["Ikki qizil va besh ko'k shar bo'lsa, qizilning ko'kka nisbati ikki nisbat besh.", "Ko'kning qizilga nisbati esa besh nisbat ikki.", "Savolda qaysi miqdor birinchi aytilsa, nisbatda ham o'sha birinchi yoziladi."],
        ru: ['Если есть два красных и пять синих шаров, отношение красных к синим равно два к пяти.', 'Отношение синих к красным равно пять к двум.', 'Первой записывают величину, которая первой названа в вопросе.'],
      },
    ),
    question({
      title: L("Retsept nisbatini toping", 'Найдите отношение в рецепте'),
      prompt: L("Ichimlik uchun 2 stakan suvga 1 stakan sirop qo'shiladi. Suvning siropga nisbati qanday?", 'Для напитка к 2 стаканам воды добавляют 1 стакан сиропа. Каково отношение воды к сиропу?'),
      intro: L(
        "Retseptda ikki stakan suv va bir stakan sirop bor. Savolda suvning siropga nisbati so'ralgan, shuning uchun suv miqdorini birinchi yozing.",
        'В рецепте два стакана воды и один стакан сиропа. Требуется отношение воды к сиропу, поэтому количество воды запишите первым.',
      ),
      options: ['1 : 1', '1 : 2', '2 : 1', '2 : 3'],
      correct: 2,
      why: lines(
        ["Suv miqdori 2 stakan, sirop miqdori 1 stakan.", 'Воды 2 стакана, сиропа 1 стакан.'],
        ["Suvning siropga nisbati 2 : 1.", 'Отношение воды к сиропу равно 2 : 1.'],
      ),
      wrong: L("Savoldagi tartibni saqlang: suv birinchi, sirop ikkinchi.", 'Соблюдайте порядок: вода первая, сироп второй.'),
      visual: { type: 'equation', expression: '2 stakan : 1 stakan' },
    }),
    question({
      title: L("3 : 4 ga teng nisbatni toping", 'Найдите отношение, равное 3 : 4'),
      prompt: L("Nisbatning ikkala hadini bir xil songa ko'paytirib hosil bo'ladigan yozuvni tanlang.", 'Выберите запись, полученную умножением обоих членов отношения на одно число.'),
      intro: L(
        "Uch nisbat to'rtga teng nisbatni toping. Ikkala hadni ham uchga ko'paytirishni sinab ko'ring.",
        'Найдите отношение, равное трём к четырём. Попробуйте умножить оба члена на три.',
      ),
      options: ['6 : 7', '6 : 8', '9 : 12', '12 : 15'],
      correct: 2,
      why: lines(
        ["3 · 3 = 9 va 4 · 3 = 12.", '3 · 3 = 9 и 4 · 3 = 12.'],
        ["Demak, 3 : 4 = 9 : 12.", 'Значит, 3 : 4 = 9 : 12.'],
      ),
      wrong: L("Nisbatning ikkala hadini aynan bir xil songa ko'paytiring.", 'Умножьте оба члена отношения на одно и то же число.'),
      visual: { type: 'chain', items: ['3 : 4', '9 : 12'], connector: L('· 3 →', '· 3 →') },
    }),
    info(
      L("Qismning qismga va qismning butunga nisbati", 'Отношение части к части и части к целому'),
      lines(
        ["2 ta qizil va 3 ta ko'k shar bo'lsa, jami 5 ta shar bor.", 'Если есть 2 красных и 3 синих шара, всего 5 шаров.'],
        ["Qizilning ko'kka nisbati 2 : 3 — bu qismning qismga nisbati.", 'Отношение красных к синим 2 : 3 — это отношение части к части.'],
        ["Qizilning jami sharlarga nisbati 2 : 5 — bu qismning butunga nisbati.", 'Отношение красных ко всем шарам 2 : 5 — это отношение части к целому.'],
      ),
      {
        type: 'panels',
        panels: [
          { title: L('Qism : qism', 'Часть : часть'), lines: ['2 : 3'], color: 'yellow' },
          { title: L('Qism : butun', 'Часть : целое'), lines: ['2 : 5'], color: 'green' },
        ],
      },
      undefined,
      {
        uz: ["Ikki qizil va uch ko'k shar bo'lsa, jami beshta shar bor.", "Qizilning ko'kka nisbati ikki nisbat uch, bu qismning qismga nisbati.", "Qizilning jami sharlarga nisbati ikki nisbat besh, bu qismning butunga nisbati."],
        ru: ['Если есть два красных и три синих шара, всего пять шаров.', 'Отношение красных к синим два к трём — это отношение части к части.', 'Отношение красных ко всем шарам два к пяти — это отношение части к целому.'],
      },
    ),
    multi({
      title: L("2 : 3 ga teng nisbatlarni belgilang", 'Отметьте отношения, равные 2 : 3'),
      intro: L(
        "Ikki nisbat uchning ikkala hadini bir xil songa ko'paytirish orqali hosil bo'ladigan barcha nisbatlarni belgilang.",
        'Отметьте все отношения, полученные умножением обоих членов отношения два к трём на одно число.',
      ),
      options: ['4 : 6', '6 : 9', '8 : 10', '10 : 15'],
      correctSet: [0, 1, 3],
      why: lines(
        ["4 : 6, 6 : 9 va 10 : 15 qisqartirilganda 2 : 3 bo'ladi.", 'Отношения 4 : 6, 6 : 9 и 10 : 15 сокращаются до 2 : 3.'],
        ["8 : 10 qisqartirilganda 4 : 5 bo'ladi.", 'Отношение 8 : 10 сокращается до 4 : 5.'],
      ),
      wrong: L("Har bir nisbatning ikkala hadini ularning umumiy bo'luvchisiga bo'ling.", 'Разделите оба члена каждого отношения на их общий делитель.'),
    }),
    match({
      title: L("Vaziyatni nisbat bilan juftlang", 'Соедините ситуацию с отношением'),
      prompt: L("So'rovdagi tartib bo'yicha mos nisbatni tanlang.", 'Выберите отношение в порядке, указанном в вопросе.'),
      intro: L(
        "Har bir vaziyatda birinchi va ikkinchi miqdorni aniqlang. Keyin mos nisbat bilan juftlang.",
        'В каждой ситуации определите первую и вторую величину, затем соедините с подходящим отношением.',
      ),
      rows: [
        { left: L("3 qalam, 5 daftar: qalamning daftarga", '3 карандаша, 5 тетрадей: карандашей к тетрадям'), correct: L('3 : 5', '3 : 5') },
        { left: L("6 oq, 2 qora: qorani oq rangga", '6 белых, 2 чёрных: чёрных к белым'), correct: L('2 : 6', '2 : 6') },
        { left: L("4 qiz, 8 o'g'il: qizlarning jami bolalarga", '4 девочки, 8 мальчиков: девочек ко всем детям'), correct: L('4 : 12', '4 : 12') },
      ],
      why: lines(
        ["Nisbatda savolda birinchi aytilgan miqdor birinchi yoziladi.", 'Первой в отношении записывают величину, названную первой.'],
        ["Qismning butunga nisbatida butun son qismlar yig'indisidan topiladi.", 'В отношении части к целому общее число находят сложением частей.'],
      ),
      wrong: L("Tartibni va 'jami' so'zini tekshiring.", 'Проверьте порядок и слово «всего».'),
    }),
    classify({
      title: L("Nisbatlarni 1 dan kichik yoki katta guruhga ajrating", 'Разделите отношения на меньшие и большие единицы'),
      prompt: L("Birinchi had ikkinchi haddan kichik bo'lsa, nisbat 1 dan kichik bo'ladi.", 'Если первый член меньше второго, отношение меньше 1.'),
      intro: L(
        "Har bir nisbatda birinchi va ikkinchi hadni taqqoslang. Nisbatni birdan kichik yoki birdan katta guruhiga joylang.",
        'Сравните первый и второй члены каждого отношения. Поместите отношение в группу меньше единицы или больше единицы.',
      ),
      binA: L('1 dan kichik', 'Меньше 1'),
      binB: L('1 dan katta', 'Больше 1'),
      cards: [
        { label: '2 : 5', value: true },
        { label: '7 : 3', value: false },
        { label: '4 : 9', value: true },
        { label: '6 : 2', value: false },
      ],
      why: lines(
        ["2 : 5 va 4 : 9 da birinchi had kichik, shuning uchun nisbat 1 dan kichik.", 'В 2 : 5 и 4 : 9 первый член меньше, поэтому отношение меньше 1.'],
        ["7 : 3 va 6 : 2 da birinchi had katta, shuning uchun nisbat 1 dan katta.", 'В 7 : 3 и 6 : 2 первый член больше, поэтому отношение больше 1.'],
      ),
      wrong: L("Har bir nisbatda birinchi hadni ikkinchi had bilan taqqoslang.", 'Сравните первый член каждого отношения со вторым.'),
    }),
    question({
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("Sinf tarkibining nisbatini toping", 'Найдите отношение состава класса'),
      prompt: L("Sinfda 12 qiz va 18 o'g'il bor. Qizlar sonining o'g'illar soniga qisqargan nisbati qanday?", 'В классе 12 девочек и 18 мальчиков. Каково сокращённое отношение числа девочек к числу мальчиков?'),
      intro: L(
        "O'n ikki qiz va o'n sakkiz o'g'il bor. Qizlarni birinchi yozing va ikkala sonni ularning eng katta umumiy bo'luvchisi oltiga bo'ling.",
        'В классе двенадцать девочек и восемнадцать мальчиков. Запишите девочек первыми и разделите оба числа на их наибольший общий делитель шесть.',
      ),
      options: ['2 : 3', '3 : 2', '12 : 30', '6 : 9'],
      correct: 0,
      why: lines(
        ["Qizlar : o'g'illar = 12 : 18.", 'Девочки : мальчики = 12 : 18.'],
        ["12 va 18 ni 6 ga bo'lsak 2 : 3 chiqadi.", 'Если разделить 12 и 18 на 6, получится 2 : 3.'],
      ),
      wrong: L("Qizlar sonini birinchi yozing va nisbatni oxirigacha qisqartiring.", 'Запишите число девочек первым и сократите отношение полностью.'),
      fact: L("Bir xil nisbatdagi retseptni ko'paytirsak, ta'm o'zgarmaydi.", 'Если увеличить рецепт в одном отношении, вкус не изменится.'),
      factVisual: '2 : 3 = 4 : 6',
      visual: { type: 'chain', items: ['12 : 18', '2 : 3'], connector: L(': 6 →', ': 6 →') },
    }),
    summary(
      L("Nisbatni yozish va soddalashtirishni o'rgandingiz", 'Вы научились записывать и упрощать отношения'),
      lines(
        ["Nisbat ikki miqdorni berilgan tartibda taqqoslaydi.", 'Отношение сравнивает две величины в заданном порядке.'],
        ["Ikkala hadni bir xil songa bo'lish nisbatni soddalashtiradi.", 'Деление обоих членов на одно число упрощает отношение.'],
        ["Qismning qismga va qismning butunga nisbatlari farqlanadi.", 'Различают отношение части к части и части к целому.'],
      ),
      L("Endi hayotiy vaziyatdagi ikki miqdorni nisbat bilan ifodalay olasiz.", 'Теперь вы можете выразить отношение двух величин в жизненной ситуации.'),
      L(
        "Dars yakunlandi. Nisbatda miqdorlarning tartibi muhim. Nisbatning ikkala hadini bir xil songa bo'lib soddalashtiramiz. Qismning qismga nisbatini qismning butunga nisbatidan farqlaymiz.",
        'Урок завершён. В отношении важен порядок величин. Отношение упрощают делением обоих членов на одно число. Отличайте отношение части к части от отношения части к целому.',
      ),
    ),
  ];
  return makeLesson({ id: 'ratio_6_17', title: lessonTitle, decorations: ['2 : 3', '4 : 6', '3 : 5', '1 : 2', '6 : 9', '12 : 18'], slides });
})();

const DARS18 = (() => {
  const lessonTitle = L('Proporsiya', 'Пропорция');
  const slides = [
    title(
      lessonTitle,
      L("Bugun ikki nisbatning tengligini tekshirish va proporsiyadagi noma'lum hadni topishni o'rganamiz.", 'Сегодня научимся проверять равенство двух отношений и находить неизвестный член пропорции.'),
      L(
        "Bugungi mavzu proporsiya. Proporsiya ikki nisbatning tengligidir. Uning asosiy xossasi chetki hadlar ko'paytmasi o'rta hadlar ko'paytmasiga teng bo'lishidir. Narx va mahsulot miqdori misollarida noma'lum hadni topamiz.",
        'Тема урока — пропорция. Пропорция — это равенство двух отношений. Её основное свойство: произведение крайних членов равно произведению средних. На примерах цены и количества товара найдём неизвестный член.',
      ),
      { type: 'equation', expression: 'a : b = c : d' },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("Qalamlar narxini davom ettiring", 'Продолжите расчёт стоимости ручек'),
      prompt: L("2 ta qalam 6 000 so'm bo'lsa, shu narxda 4 ta qalam necha so'm turadi?", 'Если 2 ручки стоят 6 000 сумов, сколько стоят 4 ручки по той же цене?'),
      intro: L(
        "Ikki qalam olti ming so'm turadi. Qalamlar soni ikki marta oshsa, umumiy narx ham ikki marta oshadi. To'rtta qalam narxini tanlang.",
        'Две ручки стоят шесть тысяч сумов. Если число ручек увеличится в два раза, общая стоимость тоже увеличится в два раза. Выберите цену четырёх ручек.',
      ),
      options: ["8 000 so'm", "10 000 so'm", "12 000 so'm", "24 000 so'm"],
      correct: 2,
      why: lines(
        ["4 ta qalam 2 ta qalamdan 2 marta ko'p.", '4 ручки в 2 раза больше, чем 2 ручки.'],
        ["6 000 · 2 = 12 000. Nisbatlar teng: 2 : 4 = 6 000 : 12 000.", '6 000 · 2 = 12 000. Отношения равны: 2 : 4 = 6 000 : 12 000.'],
      ),
      wrong: L("Qalamlar soni necha marta oshganini toping va narxni ham shuncha marta oshiring.", 'Определите, во сколько раз увеличилось число ручек, и во столько же раз увеличьте цену.'),
      visual: { type: 'panels', panels: [{ title: L('2 ta qalam', '2 ручки'), lines: ["6 000 so'm"], color: 'yellow' }, { title: L('4 ta qalam', '4 ручки'), lines: ['?'], color: 'blue' }] },
    }),
    info(
      L("Proporsiya — teng nisbatlar", 'Пропорция — равные отношения'),
      lines(
        ["Ikki nisbat teng bo'lsa, ular proporsiya hosil qiladi.", 'Если два отношения равны, они образуют пропорцию.'],
        ["a : b = c : d yozuvida a va d — chetki hadlar.", 'В записи a : b = c : d числа a и d — крайние члены.'],
        ["b va c esa o'rta hadlar deb ataladi.", 'Числа b и c называют средними членами.'],
      ),
      {
        type: 'panels',
        panels: [
          { title: L('Chetki hadlar', 'Крайние члены'), lines: ['a, d'], color: 'yellow' },
          { title: L("O'rta hadlar", 'Средние члены'), lines: ['b, c'], color: 'blue' },
        ],
      },
      L('Yangi tushuncha', 'Новое понятие'),
      {
        uz: ["Ikki nisbat teng bo'lsa, ular proporsiya hosil qiladi.", "a nisbat b, teng c nisbat d yozuvida a va d chetki hadlardir.", "b va c esa o'rta hadlar deb ataladi."],
        ru: ['Если два отношения равны, они образуют пропорцию.', 'В записи a к b равно c к d числа a и d являются крайними членами.', 'Числа b и c называют средними членами.'],
      },
    ),
    rule(
      L("Proporsiyaning asosiy xossasi", 'Основное свойство пропорции'),
      lines(
        ["a : b = c : d bo'lsa, chetki hadlar ko'paytmasi o'rta hadlar ko'paytmasiga teng.", 'Если a : b = c : d, произведение крайних членов равно произведению средних.'],
        ["Formula: a · d = b · c.", 'Формула: a · d = b · c.'],
        ["Bu tenglik proporsiyani tekshirish va noma'lum hadni topish uchun ishlatiladi.", 'Это равенство используют для проверки пропорции и нахождения неизвестного члена.'],
      ),
      { type: 'equation', expression: 'a · d = b · c' },
      {
        uz: ["a nisbat b, teng c nisbat d bo'lsa, chetki hadlar ko'paytmasi o'rta hadlar ko'paytmasiga teng.", "Formula: a karra d teng b karra c.", "Bu tenglik proporsiyani tekshirish va noma'lum hadni topish uchun ishlatiladi."],
        ru: ['Если a к b равно c к d, произведение крайних членов равно произведению средних.', 'Формула: a умножить на d равно b умножить на c.', 'Это равенство используют для проверки пропорции и нахождения неизвестного члена.'],
      },
    ),
    info(
      L("Proporsiyani tekshiramiz", 'Проверяем пропорцию'),
      lines(
        ["2 : 3 = 8 : 12 yozuvini tekshiramiz.", 'Проверим запись 2 : 3 = 8 : 12.'],
        ["Chetki hadlar ko'paytmasi: 2 · 12 = 24.", 'Произведение крайних членов: 2 · 12 = 24.'],
        ["O'rta hadlar ko'paytmasi: 3 · 8 = 24. Ko'paytmalar teng, demak bu proporsiya.", 'Произведение средних членов: 3 · 8 = 24. Произведения равны, значит это пропорция.'],
      ),
      { type: 'steps', items: ['2 · 12 = 24', '3 · 8 = 24', L('24 = 24 — proporsiya', '24 = 24 — пропорция')] },
      L('Tekshirish', 'Проверка'),
      {
        uz: ["Ikki nisbat uch, teng sakkiz nisbat o'n ikki yozuvini tekshiramiz.", "Chetki hadlar ko'paytmasi ikki karra o'n ikki, yigirma to'rt.", "O'rta hadlar ko'paytmasi uch karra sakkiz, yigirma to'rt. Ko'paytmalar teng, demak bu proporsiya."],
        ru: ['Проверим равенство два к трём и восемь к двенадцати.', 'Произведение крайних членов: два умножить на двенадцать равно двадцати четырём.', 'Произведение средних членов: три умножить на восемь равно двадцати четырём. Произведения равны, значит это пропорция.'],
      },
    ),
    question({
      title: L("Noma'lum hadni toping", 'Найдите неизвестный член'),
      prompt: L("3 : 5 = 9 : x proporsiyada x nimaga teng?", 'Чему равен x в пропорции 3 : 5 = 9 : x?'),
      intro: L(
        "Uch nisbat besh, teng to'qqiz nisbat x proporsiyada chetki va o'rta hadlar ko'paytmasini tenglashtiring. Uch karra x besh karra to'qqizga teng.",
        'В пропорции три к пяти равно девять к x приравняйте произведения крайних и средних членов. Три умножить на x равно пяти умножить на девять.',
      ),
      options: ['12', '15', '18', '45'],
      correct: 1,
      why: lines(
        ["3 · x = 5 · 9 = 45.", '3 · x = 5 · 9 = 45.'],
        ["x = 45 : 3 = 15.", 'x = 45 : 3 = 15.'],
      ),
      wrong: L("Chetki hadlar va o'rta hadlar ko'paytmalarini tenglashtiring, so'ng 3 ga bo'ling.", 'Приравняйте произведения крайних и средних членов, затем разделите на 3.'),
      visual: { type: 'chain', items: ['3 · x = 5 · 9', '3x = 45', 'x = 15'] },
    }),
    info(
      L("Noma'lum hadni topish tartibi", 'Порядок нахождения неизвестного члена'),
      lines(
        ["Noma'lum qatnashgan ko'paytmani bir tomonda yozing.", 'Запишите произведение с неизвестным в одной части равенства.'],
        ["Ma'lum ikki hadni o'zaro ko'paytiring.", 'Перемножьте два известных члена.'],
        ["Hosil bo'lgan ko'paytmani noma'lum yonidagi songa bo'ling.", 'Разделите полученное произведение на число рядом с неизвестным.'],
      ),
      { type: 'steps', items: [L("Ko'paytmalarni tenglashtir", 'Приравняй произведения'), L("Ma'lumlarni ko'paytir", 'Перемножь известные'), L("Noma'lum yonidagi songa bo'l", 'Раздели на множитель при неизвестном')] },
    ),
    question({
      title: L("4 : 7 = x : 21 proporsiyani yeching", 'Решите пропорцию 4 : 7 = x : 21'),
      prompt: L("x ning qiymatini toping.", 'Найдите значение x.'),
      intro: L(
        "To'rt nisbat yetti, teng x nisbat yigirma bir. Chetki hadlar ko'paytmasi to'rt karra yigirma bir, o'rta hadlar ko'paytmasi yetti karra x bo'ladi.",
        'Четыре к семи равно x к двадцати одному. Произведение крайних равно четырём умножить на двадцать один, а произведение средних — семи умножить на x.',
      ),
      options: ['7', '12', '17', '28'],
      correct: 1,
      why: lines(
        ["4 · 21 = 7 · x, ya'ni 84 = 7x.", '4 · 21 = 7 · x, то есть 84 = 7x.'],
        ["x = 84 : 7 = 12.", 'x = 84 : 7 = 12.'],
      ),
      wrong: L("4 ni 21 ga ko'paytiring va natijani 7 ga bo'ling.", 'Умножьте 4 на 21 и разделите результат на 7.'),
      visual: { type: 'equation', expression: '4 : 7 = x : 21' },
    }),
    question({
      title: L("Qaysi tenglik proporsiya?", 'Какое равенство является пропорцией?'),
      prompt: L("Chetki va o'rta hadlar ko'paytmalari teng bo'lgan yozuvni tanlang.", 'Выберите равенство, в котором произведения крайних и средних членов равны.'),
      intro: L(
        "Har bir yozuvda chetki va o'rta hadlar ko'paytmasini tekshiring. Faqat teng ko'paytmali yozuv proporsiya bo'ladi.",
        'В каждой записи сравните произведения крайних и средних членов. Пропорцией будет только равенство с одинаковыми произведениями.',
      ),
      options: ['2 : 5 = 4 : 8', '2 : 5 = 6 : 15', '3 : 4 = 8 : 9', '4 : 7 = 12 : 14'],
      correct: 1,
      why: lines(
        ["2 · 15 = 30 va 5 · 6 = 30.", '2 · 15 = 30 и 5 · 6 = 30.'],
        ["Ko'paytmalar teng, demak 2 : 5 = 6 : 15 proporsiya.", 'Произведения равны, значит 2 : 5 = 6 : 15 — пропорция.'],
      ),
      wrong: L("Har bir variantda birinchi sonni to'rtinchi songa, ikkinchi sonni uchinchi songa ko'paytiring.", 'В каждом варианте умножьте первое число на четвёртое, а второе на третье.'),
      visual: { type: 'cards', items: ['a · d', 'b · c', { label: 'a · d = b · c', color: 'yellow' }] },
    }),
    info(
      L("Jadvaldan proporsiya tuzamiz", 'Составляем пропорцию по таблице'),
      lines(
        ["3 kilogramm olma 24 000 so'm tursa, 1 kilogramm narxi 8 000 so'm.", 'Если 3 килограмма яблок стоят 24 000 сумов, цена 1 килограмма равна 8 000 сумов.'],
        ["5 kilogramm uchun x so'm to'lanadi.", 'За 5 килограммов заплатят x сумов.'],
        ["Miqdorlar tartibini ikkala nisbatda bir xil saqlaymiz: 3 : 5 = 24 000 : x.", 'Сохраняем одинаковый порядок величин в обоих отношениях: 3 : 5 = 24 000 : x.'],
      ),
      {
        type: 'panels',
        panels: [
          { title: L('Miqdor', 'Количество'), lines: ['3 kg', '5 kg'], color: 'yellow' },
          { title: L('Narx', 'Стоимость'), lines: ["24 000 so'm", "x so'm"], color: 'blue' },
        ],
      },
      undefined,
      {
        uz: ["Uch kilogramm olma yigirma to'rt ming so'm tursa, bir kilogramm narxi sakkiz ming so'm.", "Besh kilogramm uchun x so'm to'lanadi.", "Tartibni saqlaymiz: uch nisbat besh, teng yigirma to'rt ming nisbat x."],
        ru: ['Если три килограмма яблок стоят двадцать четыре тысячи сумов, один килограмм стоит восемь тысяч.', 'За пять килограммов заплатят x сумов.', 'Сохраняем порядок: три к пяти равно двадцать четыре тысячи к x.'],
      },
    ),
    multi({
      title: L("To'g'ri proporsiyalarni belgilang", 'Отметьте верные пропорции'),
      intro: L(
        "Har bir tenglikda chetki va o'rta hadlar ko'paytmasini hisoblang. Teng natija beradigan barcha yozuvlarni belgilang.",
        'В каждом равенстве вычислите произведения крайних и средних членов. Отметьте все записи с равными результатами.',
      ),
      options: ['2 : 3 = 4 : 6', '3 : 5 = 9 : 15', '4 : 6 = 8 : 10', '5 : 8 = 15 : 24'],
      correctSet: [0, 1, 3],
      why: lines(
        ["Birinchi, ikkinchi va to'rtinchi yozuvlarda ko'paytmalar teng.", 'В первой, второй и четвёртой записях произведения равны.'],
        ["4 · 10 = 40, ammo 6 · 8 = 48. Uchinchi yozuv proporsiya emas.", '4 · 10 = 40, но 6 · 8 = 48. Третья запись не является пропорцией.'],
      ),
      wrong: L("Har bir tenglikni a · d = b · c xossasi bilan tekshiring.", 'Проверьте каждое равенство по свойству a · d = b · c.'),
    }),
    match({
      title: L("Proporsiyani yechimi bilan juftlang", 'Соедините пропорцию с её решением'),
      prompt: L("Har bir proporsiyada noma'lum hadni toping.", 'Найдите неизвестный член каждой пропорции.'),
      intro: L(
        "Chetki va o'rta hadlar ko'paytmalarini tenglashtiring. Har bir proporsiyani x ning mos qiymati bilan juftlang.",
        'Приравняйте произведения крайних и средних членов. Соедините каждую пропорцию с подходящим значением x.',
      ),
      rows: [
        { left: '2 : 3 = 8 : x', correct: L('x = 12', 'x = 12') },
        { left: '5 : 7 = x : 21', correct: L('x = 15', 'x = 15') },
        { left: '4 : x = 2 : 4', correct: L('x = 8', 'x = 8') },
      ],
      why: lines(
        ["Birinchi proporsiyada x = 12, ikkinchisida x = 15, uchinchisida x = 8.", 'В первой пропорции x = 12, во второй x = 15, в третьей x = 8.'],
        ["Har safar noma'lum had ma'lum hadlar ko'paytmasini qolgan hadga bo'lish orqali topildi.", 'Каждый раз неизвестный член находили делением произведения известных членов на оставшийся член.'],
      ),
      wrong: L("Ko'paytmalarni tenglashtirib, x yonidagi ko'paytuvchiga bo'ling.", 'Приравняйте произведения и разделите на множитель при x.'),
    }),
    info(
      L("Proporsiyada tartibni buzmaslik", 'Не нарушайте порядок в пропорции'),
      lines(
        ["Agar chap nisbatda kilogramm kilogramm bilan taqqoslansa, o'ng nisbatda ham narx narx bilan taqqoslanadi.", 'Если слева килограммы сравниваются с килограммами, справа цены сравниваются с ценами.'],
        ["3 : 5 = 24 000 : x yozuvi tartibni saqlaydi.", 'Запись 3 : 5 = 24 000 : x сохраняет порядок.'],
        ["3 : 24 000 = 5 : x yozuvi ham to'g'ri, chunki ikkala tomonda miqdorning narxga nisbati olingan.", 'Запись 3 : 24 000 = 5 : x тоже верна, потому что с обеих сторон взято отношение количества к цене.'],
      ),
      { type: 'cards', items: [{ label: '3 : 5 = 24 000 : x', color: 'yellow' }, { label: '3 : 24 000 = 5 : x', color: 'green' }] },
      undefined,
      {
        uz: ["Chap nisbatda kilogramm kilogramm bilan taqqoslansa, o'ng nisbatda narx narx bilan taqqoslanadi.", "Uch nisbat besh, teng yigirma to'rt ming nisbat x tartibni saqlaydi.", "Uch nisbat yigirma to'rt ming, teng besh nisbat x yozuvi ham to'g'ri, chunki ikkala tomonda miqdorning narxga nisbati olingan."],
        ru: ['Если слева килограммы сравниваются с килограммами, справа цены сравниваются с ценами.', 'Три к пяти равно двадцать четыре тысячи к x сохраняет порядок.', 'Три к двадцати четырём тысячам равно пять к x тоже верно: с обеих сторон сравниваются количество и цена.'],
      },
    ),
    question({
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("8 kilogramm olma narxini toping", 'Найдите стоимость 8 килограммов яблок'),
      prompt: L("5 kilogramm olma 40 000 so'm turadi. Shu narxda 8 kilogramm necha so'm turadi?", '5 килограммов яблок стоят 40 000 сумов. Сколько стоят 8 килограммов по той же цене?'),
      intro: L(
        "Besh kilogramm qirq ming so'm. Sakkiz kilogramm narxini x deb oling. Besh nisbat sakkiz, teng qirq ming nisbat x proporsiyani tuzing va yeching.",
        'Пять килограммов стоят сорок тысяч сумов. Обозначьте цену восьми килограммов через x. Составьте и решите пропорцию пять к восьми равно сорок тысяч к x.',
      ),
      options: ["48 000 so'm", "56 000 so'm", "64 000 so'm", "72 000 so'm"],
      correct: 2,
      why: lines(
        ["5 · x = 8 · 40 000 = 320 000.", '5 · x = 8 · 40 000 = 320 000.'],
        ["x = 320 000 : 5 = 64 000 so'm.", 'x = 320 000 : 5 = 64 000 сумов.'],
      ),
      wrong: L("5 : 8 = 40 000 : x proporsiyani tuzing va ko'paytmalarni tenglashtiring.", 'Составьте пропорцию 5 : 8 = 40 000 : x и приравняйте произведения.'),
      fact: L("Proporsiya xarid, retsept, xarita va tezlikka oid ko'plab masalalarda ishlatiladi.", 'Пропорции применяют в задачах о покупках, рецептах, картах и скорости.'),
      factVisual: '5 : 8 = 40 000 : 64 000',
      visual: { type: 'chain', items: ['5 : 8 = 40 000 : x', '5x = 320 000', 'x = 64 000'] },
    }),
    summary(
      L("Proporsiyani tekshirish va yechishni o'rgandingiz", 'Вы научились проверять и решать пропорции'),
      lines(
        ["Proporsiya — ikki nisbatning tengligi.", 'Пропорция — равенство двух отношений.'],
        ["Chetki hadlar ko'paytmasi o'rta hadlar ko'paytmasiga teng.", 'Произведение крайних членов равно произведению средних.'],
        ["Noma'lum had ma'lum hadlar ko'paytmasini qolgan hadga bo'lish bilan topiladi.", 'Неизвестный член находят делением произведения известных членов на оставшийся член.'],
      ),
      L("Endi proporsiyani tekshira, tuza va noma'lum hadini topa olasiz.", 'Теперь вы можете проверить и составить пропорцию, а также найти её неизвестный член.'),
      L(
        "Dars yakunlandi. Proporsiya ikki nisbatning tengligidir. Uni chetki va o'rta hadlar ko'paytmalari orqali tekshiramiz. Noma'lum hadni topishda ma'lum hadlarni ko'paytirib, qolgan hadga bo'lamiz.",
        'Урок завершён. Пропорция — равенство двух отношений. Проверяем её по произведениям крайних и средних членов. Для нахождения неизвестного умножаем известные члены и делим на оставшийся.',
      ),
    ),
  ];
  return makeLesson({ id: 'proportion_6_18', title: lessonTitle, decorations: ['2 : 3', '4 : 6', 'a : b', 'c : d', '3x = 45', 'x = 15'], slides });
})();

const DARS19 = (() => {
  const lessonTitle = L("To'g'ri va teskari proporsional miqdorlar", 'Прямо и обратно пропорциональные величины');
  const slides = [
    title(
      lessonTitle,
      L("Bugun ikki miqdor birga qanday o'zgarishini hayotiy misollar orqali farqlashni o'rganamiz.", 'Сегодня научимся по жизненным примерам различать, как совместно изменяются две величины.'),
      L(
        "Bugungi mavzu to'g'ri va teskari proporsional miqdorlar. Bir xil narxda mahsulot ko'paysa, xarajat ham ko'payadi. Bir xil ishda ishchilar ko'paysa, vaqt kamayadi. Shu ikki bog'lanishni tushunarli jadval va formulalar bilan farqlaymiz.",
        'Тема урока — прямо и обратно пропорциональные величины. При одной цене больше товара означает больше расходов. При одном объёме работы больше работников означает меньше времени. Различим эти связи по таблицам и формулам.',
      ),
      { type: 'panels', panels: [{ title: L("Birga o'sadi", 'Растут вместе'), lines: ['x ↑  y ↑'], color: 'yellow' }, { title: L("Biri o'ssa, biri kamayadi", 'Одна растёт, другая убывает'), lines: ['x ↑  y ↓'], color: 'blue' }] },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("Daftar soni oshsa, narx nima bo'ladi?", 'Что произойдёт со стоимостью?'),
      prompt: L("Bitta daftar 4 000 so'm. Daftarlar soni 2 marta oshsa, umumiy narx qanday o'zgaradi?", 'Одна тетрадь стоит 4 000 сумов. Как изменится общая стоимость, если число тетрадей увеличится в 2 раза?'),
      intro: L(
        "Bitta daftar narxi o'zgarmaydi. Daftarlar soni ikki marta oshmoqda. Umumiy xarajat qanday o'zgarishini tanlang.",
        'Цена одной тетради не меняется. Количество тетрадей увеличивается в два раза. Выберите, как изменится общая стоимость.',
      ),
      options: [L('2 marta kamayadi', 'Уменьшится в 2 раза'), L("O'zgarmaydi", 'Не изменится'), L('2 marta oshadi', 'Увеличится в 2 раза'), L('4 marta oshadi', 'Увеличится в 4 раза')],
      correct: 2,
      why: lines(
        ["Daftarlar soni 2 marta oshsa, bir xil narxda xarajat ham 2 marta oshadi.", 'Если число тетрадей увеличится в 2 раза, при одной цене стоимость тоже увеличится в 2 раза.'],
        ["Bu to'g'ri proporsional bog'lanish.", 'Это прямая пропорциональная зависимость.'],
      ),
      wrong: L("Bir dona narxi o'zgarmaganini hisobga oling.", 'Учтите, что цена одной тетради не изменилась.'),
      visual: { type: 'chain', items: ["2 daftar — 8 000 so'm", "4 daftar — 16 000 so'm"] },
    }),
    info(
      L("To'g'ri proporsionallik", 'Прямая пропорциональность'),
      lines(
        ["Bir miqdor necha marta oshsa, ikkinchisi ham shuncha marta oshadi.", 'Во сколько раз увеличивается одна величина, во столько же раз увеличивается другая.'],
        ["Bir miqdor necha marta kamaysa, ikkinchisi ham shuncha marta kamayadi.", 'При уменьшении одной величины другая уменьшается во столько же раз.'],
        ["Masalan, bir xil narxda mahsulot miqdori va umumiy xarajat.", 'Пример: количество товара и общая стоимость при постоянной цене.'],
      ),
      { type: 'chain', items: ['x · 2', 'y · 2'], connector: '→' },
      L("Birga o'zgarish", 'Совместное изменение'),
    ),
    info(
      L("Teskari proporsionallik", 'Обратная пропорциональность'),
      lines(
        ["Bir miqdor necha marta oshsa, ikkinchisi shuncha marta kamayadi.", 'Во сколько раз увеличивается одна величина, во столько же раз уменьшается другая.'],
        ["Bir xil ishni ko'proq ishchi qisqaroq vaqtda bajaradi.", 'Один и тот же объём работы большее число работников выполняет за меньшее время.'],
        ["Masalan, ishchilar soni 2 marta oshsa, ish vaqti 2 marta kamayadi.", 'Например, если число работников увеличится в 2 раза, время работы уменьшится в 2 раза.'],
      ),
      { type: 'chain', items: [L('4 ishchi — 6 soat', '4 работника — 6 часов'), L('8 ishchi — 3 soat', '8 работников — 3 часа')] },
      L("Qarama-qarshi o'zgarish", 'Противоположное изменение'),
    ),
    rule(
      L("Bog'lanishni qanday ajratamiz?", 'Как различать зависимости?'),
      lines(
        ["Ikkala miqdor bir xil marta va bir yo'nalishda o'zgarsa — to'g'ri proporsional.", 'Если обе величины изменяются в одно число раз и в одном направлении, зависимость прямая.'],
        ["Biri necha marta oshganda ikkinchisi shuncha marta kamaysa — teskari proporsional.", 'Если при увеличении одной величины другая во столько же раз уменьшается, зависимость обратная.'],
        ["Avval hayotiy ma'noni tekshiring, keyin proporsiya tuzing.", 'Сначала проверьте жизненный смысл, затем составляйте пропорцию.'],
      ),
      { type: 'panels', panels: [{ title: L("To'g'ri", 'Прямая'), lines: ['x ↑  y ↑', 'x ↓  y ↓'], color: 'yellow' }, { title: L('Teskari', 'Обратная'), lines: ['x ↑  y ↓', 'x ↓  y ↑'], color: 'blue' }] },
    ),
    question({
      title: L("5 kilogramm guruch narxini toping", 'Найдите стоимость 5 килограммов риса'),
      prompt: L("3 kilogramm guruch 24 000 so'm turadi. Bir xil narxda 5 kilogramm necha so'm?", '3 килограмма риса стоят 24 000 сумов. Сколько стоят 5 килограммов по той же цене?'),
      intro: L(
        "Mahsulot ko'paysa, bir xil narxda umumiy xarajat ham ko'payadi. Bu to'g'ri proporsional bog'lanish. Avval bir kilogramm narxini toping.",
        'При увеличении количества товара общая стоимость при одной цене тоже растёт. Это прямая зависимость. Сначала найдите цену одного килограмма.',
      ),
      options: ["32 000 so'm", "36 000 so'm", "40 000 so'm", "48 000 so'm"],
      correct: 2,
      why: lines(
        ["1 kilogramm narxi 24 000 : 3 = 8 000 so'm.", 'Цена 1 килограмма: 24 000 : 3 = 8 000 сумов.'],
        ["5 kilogramm narxi 8 000 · 5 = 40 000 so'm.", 'Цена 5 килограммов: 8 000 · 5 = 40 000 сумов.'],
      ),
      wrong: L("Avval bir kilogramm narxini, keyin besh kilogramm narxini toping.", 'Сначала найдите цену одного килограмма, затем пяти килограммов.'),
      visual: { type: 'chain', items: ['24 000 : 3', '8 000 · 5', '40 000'] },
    }),
    info(
      L("To'g'ri proporsionallik formulasi", 'Формула прямой пропорциональности'),
      lines(
        ["To'g'ri proporsional miqdorlar y = k · x formula bilan bog'lanadi.", 'Прямо пропорциональные величины связаны формулой y = k · x.'],
        ["k — o'zgarmas koeffitsiyent. U y ni x ga bo'lish orqali topiladi.", 'k — постоянный коэффициент. Его находят делением y на x.'],
        ["Narx masalasida k bir dona yoki bir kilogramm narxidir.", 'В задаче о стоимости k — цена одной штуки или одного килограмма.'],
      ),
      { type: 'equation', expression: 'y = k · x,   k = y/x' },
    ),
    question({
      title: L("Ish vaqti qanday o'zgaradi?", 'Как изменится время работы?'),
      prompt: L("4 ta bir xil nasos hovuzni 6 soatda to'ldiradi. 8 ta shunday nasos necha soatda to'ldiradi?", '4 одинаковых насоса наполняют бассейн за 6 часов. За сколько часов справятся 8 насосов?'),
      intro: L(
        "Nasoslar soni ikki marta oshdi. Bir xil hovuzni to'ldirish vaqti ikki marta kamayadi. Bu teskari proporsional bog'lanish.",
        'Число насосов увеличилось в два раза. Время заполнения того же бассейна уменьшится в два раза. Это обратная пропорциональность.',
      ),
      options: ['2 soat', '3 soat', '8 soat', '12 soat'],
      correct: 1,
      why: lines(
        ["Nasoslar soni 4 dan 8 ga, ya'ni 2 marta oshdi.", 'Число насосов увеличилось с 4 до 8, то есть в 2 раза.'],
        ["Vaqt 6 : 2 = 3 soatgacha kamayadi.", 'Время уменьшится до 6 : 2 = 3 часов.'],
      ),
      wrong: L("Nasoslar ko'payganda vaqt kamayishini unutmang.", 'Помните: при увеличении числа насосов время уменьшается.'),
      visual: { type: 'chain', items: [L('4 nasos — 6 soat', '4 насоса — 6 часов'), L('8 nasos — 3 soat', '8 насосов — 3 часа')] },
    }),
    info(
      L("Teskari proporsionallik formulasi", 'Формула обратной пропорциональности'),
      lines(
        ["Teskari proporsional miqdorlarda ko'paytma o'zgarmaydi.", 'У обратно пропорциональных величин произведение остаётся постоянным.'],
        ["Formula: x · y = k.", 'Формула: x · y = k.'],
        ["Nasoslar misolida 4 · 6 = 24 va 8 · 3 = 24.", 'В примере с насосами 4 · 6 = 24 и 8 · 3 = 24.'],
      ),
      { type: 'equation', expression: 'x · y = k' },
    ),
    info(
      L("Ikki bog'lanishni yonma-yon solishtiramiz", 'Сравним две зависимости'),
      lines(
        ["Mahsulot miqdori va narx: 2 marta ko'p mahsulot — 2 marta ko'p xarajat.", 'Количество товара и стоимость: в 2 раза больше товара — в 2 раза больше стоимость.'],
        ["Ishchilar soni va vaqt: 2 marta ko'p ishchi — 2 marta kam vaqt.", 'Число работников и время: в 2 раза больше работников — в 2 раза меньше времени.'],
        ["Har doim 'miqdor oshsa, ikkinchisi nima qiladi?' degan savolni bering.", 'Всегда задавайте вопрос: «Что происходит со второй величиной при увеличении первой?»'],
      ),
      {
        type: 'panels',
        panels: [
          { title: L("To'g'ri", 'Прямая'), lines: [L('Ko‘p mahsulot', 'Больше товара'), L('Ko‘p xarajat', 'Больше стоимость')], color: 'yellow' },
          { title: L('Teskari', 'Обратная'), lines: [L('Ko‘p ishchi', 'Больше работников'), L('Kam vaqt', 'Меньше времени')], color: 'blue' },
        ],
      },
    ),
    multi({
      title: L("To'g'ri proporsional vaziyatlarni belgilang", 'Отметьте прямо пропорциональные ситуации'),
      intro: L(
        "Bir miqdor necha marta oshganda ikkinchisi ham shuncha marta oshadigan barcha vaziyatlarni belgilang.",
        'Отметьте все ситуации, где при увеличении одной величины другая увеличивается во столько же раз.',
      ),
      options: [
        L('Bir xil narxda daftar soni va xarajat', 'Число тетрадей и стоимость при одной цене'),
        L('Bir xil yo‘lda tezlik va vaqt', 'Скорость и время на одном пути'),
        L('Bir xil tezlikda vaqt va masofa', 'Время и расстояние при одной скорости'),
        L('Bir ishda ishchilar soni va vaqt', 'Число работников и время одной работы'),
      ],
      correctSet: [0, 2],
      why: lines(
        ["Daftar ko'paysa xarajat, vaqt ko'paysa bir xil tezlikdagi masofa ham ko'payadi.", 'Чем больше тетрадей, тем больше стоимость; чем больше время, тем больше расстояние при одной скорости.'],
        ["Bir yo'lda tezlik va vaqt hamda bir ishda ishchilar va vaqt teskari bog'langan.", 'Скорость и время на одном пути, а также число работников и время одной работы связаны обратно.'],
      ),
      wrong: L("Har bir vaziyatda birinchi miqdor oshganda ikkinchisi oshadimi yoki kamayadimi, tekshiring.", 'В каждой ситуации проверьте, растёт или уменьшается вторая величина при росте первой.'),
    }),
    match({
      title: L("Vaziyatni bog'lanish turi bilan juftlang", 'Соедините ситуацию с видом зависимости'),
      prompt: L("Har bir juft miqdor to'g'ri yoki teskari proporsional ekanini aniqlang.", 'Определите, являются ли величины прямо или обратно пропорциональными.'),
      intro: L(
        "Miqdorlardan biri oshganda ikkinchisining qanday o'zgarishini tasavvur qiling va mos tur bilan juftlang.",
        'Представьте, как изменится вторая величина при увеличении первой, и соедините с подходящим видом.',
      ),
      rows: [
        { left: L('Litrlar soni va yoqilg‘i narxi', 'Количество литров и стоимость топлива'), correct: L("To'g'ri — xarajat oshadi", 'Прямая — стоимость растёт') },
        { left: L('Bir yo‘ldagi tezlik va vaqt', 'Скорость и время на одном пути'), correct: L('Teskari — vaqt kamayadi', 'Обратная — время уменьшается') },
        { left: L('Bir xil tezlikdagi vaqt va masofa', 'Время и расстояние при одной скорости'), correct: L("To'g'ri — masofa oshadi", 'Прямая — расстояние растёт') },
      ],
      why: lines(
        ["Ko'proq litr ko'proq narx, ko'proq vaqt ko'proq masofa beradi.", 'Больше литров — больше стоимость; больше времени — больше расстояние.'],
        ["Bir xil masofada tezlik oshsa, vaqt kamayadi.", 'На одном расстоянии при увеличении скорости время уменьшается.'],
      ),
      wrong: L("Birinchi miqdorni ikki marta oshirib ko'ring: ikkinchisi nima qiladi?", 'Мысленно увеличьте первую величину в два раза: что произойдёт со второй?'),
    }),
    info(
      L("Masalani yechishdan oldingi uch savol", 'Три вопроса перед решением'),
      lines(
        ["Nima o'zgarmayapti: bir dona narximi, masofami yoki ish hajmimi?", 'Что остаётся постоянным: цена единицы, расстояние или объём работы?'],
        ["Birinchi miqdor oshsa, ikkinchisi oshadimi yoki kamayadimi?", 'Если первая величина растёт, вторая растёт или уменьшается?'],
        ["Bir xil marta o'zgarish bormi? Shundan keyin formula yoki proporsiyani tanlang.", 'Есть ли изменение в одинаковое число раз? Только после этого выбирайте формулу или пропорцию.'],
      ),
      { type: 'steps', items: [L("O'zgarmasni top", 'Найди постоянное'), L("Yo'nalishni aniqlang", 'Определи направление'), L('Formula tanlang', 'Выбери формулу')] },
    ),
    question({
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("Ish necha kunda tugaydi?", 'За сколько дней выполнят работу?'),
      prompt: L("6 ishchi ishni 10 kunda bajaradi. Bir xil unum bilan 12 ishchi shu ishni necha kunda bajaradi?", '6 работников выполняют работу за 10 дней. За сколько дней выполнят её 12 работников с той же производительностью?'),
      intro: L(
        "Ishchilar soni olti kishidan o'n ikki kishiga, ya'ni ikki marta oshdi. Ish hajmi o'zgarmaydi, shuning uchun vaqt ikki marta kamayadi.",
        'Число работников увеличилось с шести до двенадцати, то есть в два раза. Объём работы не меняется, поэтому время уменьшится в два раза.',
      ),
      options: ['4 kun', '5 kun', '12 kun', '20 kun'],
      correct: 1,
      why: lines(
        ["Ishchilar soni 12 : 6 = 2 marta oshdi.", 'Число работников увеличилось в 12 : 6 = 2 раза.'],
        ["Vaqt 10 : 2 = 5 kungacha kamayadi. Tekshiruv: 6 · 10 = 12 · 5.", 'Время уменьшится до 10 : 2 = 5 дней. Проверка: 6 · 10 = 12 · 5.'],
      ),
      wrong: L("Bu teskari bog'lanish: ishchilar ko'payganda vaqt kamayadi.", 'Это обратная зависимость: при увеличении числа работников время уменьшается.'),
      fact: L("Teskari proporsionallikda ikki miqdorning ko'paytmasi o'zgarmaydi.", 'При обратной пропорциональности произведение двух величин остаётся постоянным.'),
      factVisual: '6 · 10 = 12 · 5',
      visual: { type: 'chain', items: [L('6 ishchi — 10 kun', '6 работников — 10 дней'), L('12 ishchi — 5 kun', '12 работников — 5 дней')] },
    }),
    summary(
      L("To'g'ri va teskari bog'lanishni farqlay olasiz", 'Вы различаете прямую и обратную зависимости'),
      lines(
        ["To'g'ri bog'lanishda miqdorlar bir xil yo'nalishda va bir xil marta o'zgaradi.", 'При прямой зависимости величины изменяются в одном направлении и в одно число раз.'],
        ["Teskari bog'lanishda biri necha marta oshsa, ikkinchisi shuncha marta kamayadi.", 'При обратной зависимости одна величина растёт, а другая во столько же раз уменьшается.'],
        ["To'g'ri bog'lanish uchun y = k · x, teskari bog'lanish uchun x · y = k.", 'Для прямой зависимости y = k · x, для обратной x · y = k.'],
      ),
      L("Endi vaziyat ma'nosiga qarab bog'lanish turini va to'g'ri formulani tanlay olasiz.", 'Теперь вы можете по смыслу ситуации выбрать вид зависимости и нужную формулу.'),
      L(
        "Dars yakunlandi. Miqdorlar birga oshsa yoki birga kamaysa, ular to'g'ri proporsional. Biri necha marta oshganda ikkinchisi shuncha marta kamaysa, ular teskari proporsional. Formuladan oldin vaziyatning ma'nosini tekshiramiz.",
        'Урок завершён. Если величины вместе растут или уменьшаются, они прямо пропорциональны. Если при росте одной другая во столько же раз уменьшается, они обратно пропорциональны. Перед формулой проверяем смысл ситуации.',
      ),
    ),
  ];
  return makeLesson({ id: 'proportional_6_19', title: lessonTitle, decorations: ['x ↑ y ↑', 'x ↑ y ↓', 'y = kx', 'xy = k', '2 marta', '1/2'], slides });
})();

const DARS20 = (() => {
  const lessonTitle = L('Masshtab', 'Масштаб');
  const slides = [
    title(
      lessonTitle,
      L("Bugun xaritadagi masofani haqiqiy masofaga va haqiqiy masofani xaritadagi uzunlikka aylantirishni o'rganamiz.", 'Сегодня научимся переводить расстояние на карте в реальное расстояние и обратно.'),
      L(
        "Bugungi mavzu masshtab. Masshtab xaritadagi bir birlik haqiqiy hayotda nechta shunday birlikka tengligini ko'rsatadi. Birliklarni bir xil qilishni, xaritadagi va haqiqiy masofa formulalarini hamda yo'nalish uzunligini topishni o'rganamiz.",
        'Тема урока — масштаб. Масштаб показывает, скольким таким же единицам на местности соответствует одна единица на карте. Научимся приводить единицы, находить реальные расстояния, длины на карте и длину маршрута.',
      ),
      { type: 'equation', expression: '1 : 100 000' },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("Xaritadagi 3 santimetr nimani bildiradi?", 'Что означают 3 сантиметра на карте?'),
      prompt: L("Xaritada 1 santimetr 100 metrga teng. 3 santimetr haqiqiy hayotda qancha?", 'На карте 1 сантиметр соответствует 100 метрам. Сколько это на местности для 3 сантиметров?'),
      intro: L(
        "Xaritadagi har bir santimetr haqiqatda yuz metrni bildiradi. Uch santimetr uchun yuz metrni uchga ko'paytiring.",
        'Каждый сантиметр на карте означает сто метров на местности. Для трёх сантиметров умножьте сто метров на три.',
      ),
      options: ['30 m', '100 m', '300 m', '3 000 m'],
      correct: 2,
      why: lines(
        ["1 santimetrga 100 metr mos keladi.", 'Одному сантиметру соответствуют 100 метров.'],
        ["3 · 100 = 300 metr.", '3 · 100 = 300 метров.'],
      ),
      wrong: L("Bir santimetrga mos masofani xaritadagi santimetrlar soniga ko'paytiring.", 'Умножьте расстояние для одного сантиметра на число сантиметров на карте.'),
      visual: { type: 'chain', items: ['1 cm — 100 m', '3 cm — 300 m'] },
    }),
    info(
      L("Masshtab nimani bildiradi?", 'Что означает масштаб?'),
      lines(
        ["1 : n masshtabda xaritadagi 1 birlik haqiqatda n birlikka teng.", 'В масштабе 1 : n одна единица на карте равна n единицам на местности.'],
        ["1 : 100 000 masshtabda 1 santimetr haqiqatda 100 000 santimetr.", 'В масштабе 1 : 100 000 один сантиметр на карте равен 100 000 сантиметров на местности.'],
        ["100 000 santimetr 1 kilometrga teng.", '100 000 сантиметров равны 1 километру.'],
      ),
      { type: 'chain', items: ['1 cm', '100 000 cm', '1 km'] },
      L('Yangi tushuncha', 'Новое понятие'),
      {
        uz: ["Bir nisbat n masshtabda xaritadagi bir birlik haqiqatda n birlikka teng.", "Bir nisbat yuz ming masshtabda bir santimetr haqiqatda yuz ming santimetr.", "Yuz ming santimetr bir kilometrga teng."],
        ru: ['В масштабе один к n одна единица на карте равна n единицам на местности.', 'В масштабе один к ста тысячам один сантиметр равен ста тысячам сантиметров на местности.', 'Сто тысяч сантиметров равны одному километру.'],
      },
    ),
    rule(
      L("Masshtabning ikki asosiy formulasi", 'Две основные формулы масштаба'),
      lines(
        ["Haqiqiy masofa = xaritadagi masofa · masshtab soni.", 'Реальное расстояние = расстояние на карте · число масштаба.'],
        ["Xaritadagi masofa = haqiqiy masofa : masshtab soni.", 'Расстояние на карте = реальное расстояние : число масштаба.'],
        ["Hisoblashdan oldin ikkala masofani bir xil o'lchov birligiga keltiring.", 'Перед вычислением приведите оба расстояния к одной единице измерения.'],
      ),
      { type: 'panels', panels: [{ title: L('Haqiqiy masofa', 'Реальное расстояние'), lines: ['L = l · n'], color: 'yellow' }, { title: L('Xaritadagi masofa', 'Расстояние на карте'), lines: ['l = L : n'], color: 'blue' }] },
    ),
    info(
      L("Uzunlik birliklarini eslab olamiz", 'Вспомним единицы длины'),
      lines(
        ["1 metr = 100 santimetr.", '1 метр = 100 сантиметров.'],
        ["1 kilometr = 1 000 metr.", '1 километр = 1 000 метров.'],
        ["Shuning uchun 1 kilometr = 100 000 santimetr.", 'Поэтому 1 километр = 100 000 сантиметров.'],
      ),
      { type: 'chain', items: ['1 km', '1 000 m', '100 000 cm'] },
    ),
    question({
      title: L("Xaritadagi masofadan haqiqiy masofani toping", 'Найдите реальное расстояние по карте'),
      prompt: L("Masshtab 1 : 100 000. Xaritada ikki joy orasida 4 santimetr. Haqiqiy masofa qancha?", 'Масштаб 1 : 100 000. На карте между двумя местами 4 сантиметра. Каково реальное расстояние?'),
      intro: L(
        "Bir nisbat yuz ming masshtabda bir santimetr bir kilometrga teng. Xaritadagi to'rt santimetrni kilometrga aylantiring.",
        'В масштабе один к ста тысячам один сантиметр равен одному километру. Переведите четыре сантиметра на карте в километры.',
      ),
      options: ['0,4 km', '4 km', '40 km', '400 km'],
      correct: 1,
      why: lines(
        ["1 : 100 000 masshtabda 1 cm = 1 km.", 'В масштабе 1 : 100 000 один сантиметр равен одному километру.'],
        ["4 · 1 km = 4 km.", 'Четыре сантиметра на карте соответствуют четырём километрам.'],
      ),
      wrong: L("Bu masshtabda xaritadagi har bir santimetr bir kilometrga teng.", 'В этом масштабе каждый сантиметр на карте равен одному километру.'),
      visual: { type: 'chain', items: ['4 cm', '400 000 cm', '4 km'] },
    }),
    info(
      L("Haqiqiy masofadan xaritadagi uzunlikni topish", 'Находим длину на карте по реальному расстоянию'),
      lines(
        ["Masshtab 1 : 500 000 bo'lsa, 1 santimetr 5 kilometrga teng.", 'В масштабе 1 : 500 000 один сантиметр равен 5 километрам.'],
        ["Haqiqiy masofa 15 kilometr.", 'Реальное расстояние равно 15 километрам.'],
        ["Xaritadagi uzunlik 15 : 5 = 3 santimetr.", 'Длина на карте равна 15 : 5 = 3 сантиметрам.'],
      ),
      { type: 'chain', items: ['15 km', ': 5 km', '3 cm'] },
      undefined,
      {
        uz: ["Bir nisbat besh yuz ming masshtabda bir santimetr besh kilometrga teng.", "Haqiqiy masofa o'n besh kilometr.", "Xaritadagi uzunlik o'n beshni beshga bo'lib, uch santimetr bo'ladi."],
        ru: ['В масштабе один к пятистам тысячам один сантиметр равен пяти километрам.', 'Реальное расстояние равно пятнадцати километрам.', 'Длина на карте: пятнадцать разделить на пять, получаем три сантиметра.'],
      },
    ),
    question({
      title: L("1 : 200 000 masshtabdagi masofani toping", 'Найдите расстояние в масштабе 1 : 200 000'),
      prompt: L("Xaritada masofa 3,5 santimetr. Haqiqiy masofa necha kilometr?", 'На карте расстояние равно 3,5 сантиметра. Сколько это километров на местности?'),
      intro: L(
        "Bir nisbat ikki yuz ming masshtabda bir santimetr ikki kilometrga teng. Uch butun o'ndan besh santimetrni ikki kilometrga ko'paytiring.",
        'В масштабе один к двумстам тысячам один сантиметр равен двум километрам. Умножьте три целых пять десятых сантиметра на два километра.',
      ),
      options: ['5 km', '6 km', '7 km', '70 km'],
      correct: 2,
      why: lines(
        ["1 : 200 000 masshtabda 1 cm = 2 km.", 'В масштабе 1 : 200 000 один сантиметр равен 2 километрам.'],
        ["3,5 · 2 = 7 kilometr.", '3,5 · 2 = 7 километров.'],
      ),
      wrong: L("Avval bir santimetrga necha kilometr mos kelishini toping.", 'Сначала определите, сколько километров соответствует одному сантиметру.'),
      visual: { type: 'equation', expression: '3,5 cm · 2 km = ?' },
    }),
    question({
      title: L("Xaritadagi uzunlikni toping", 'Найдите длину на карте'),
      prompt: L("Masshtab 1 : 500. Haqiqiy uzunlik 20 metr. Chizmada necha santimetr bo'ladi?", 'Масштаб 1 : 500. Реальная длина 20 метров. Сколько сантиметров будет на чертеже?'),
      intro: L(
        "Avval yigirma metrni ikki ming santimetrga aylantiring. So'ng haqiqiy uzunlikni masshtab soni besh yuzga bo'ling.",
        'Сначала переведите двадцать метров в две тысячи сантиметров. Затем разделите реальную длину на число масштаба пятьсот.',
      ),
      options: ['2 cm', '4 cm', '10 cm', '40 cm'],
      correct: 1,
      why: lines(
        ["20 metr = 2 000 santimetr.", '20 метров = 2 000 сантиметров.'],
        ["2 000 : 500 = 4 santimetr.", '2 000 : 500 = 4 сантиметра.'],
      ),
      wrong: L("Birliklarni santimetrga keltiring va haqiqiy uzunlikni 500 ga bo'ling.", 'Переведите длину в сантиметры и разделите реальную длину на 500.'),
      visual: { type: 'chain', items: ['20 m', '2 000 cm', '4 cm'] },
    }),
    info(
      L("Masshtabdagi eng ko'p uchraydigan xato", 'Самая частая ошибка с масштабом'),
      lines(
        ["1 : 100 000 yozuvidagi 100 000 soni santimetrni bildiradi, kilometrni emas.", 'Число 100 000 в записи 1 : 100 000 означает сантиметры, а не километры.'],
        ["Shuning uchun avval 100 000 santimetrni 1 kilometrga aylantiramiz.", 'Поэтому сначала переводим 100 000 сантиметров в 1 километр.'],
        ["Birlik almashtirilmasa, javob 100 yoki 1 000 marta xato chiqishi mumkin.", 'Без перевода единиц ответ может отличаться в 100 или 1 000 раз.'],
      ),
      { type: 'cards', items: [{ label: '100 000 cm', color: 'yellow' }, '1 000 m', { label: '1 km', color: 'green' }] },
    ),
    multi({
      title: L("To'g'ri fikrlarni belgilang", 'Отметьте верные утверждения'),
      intro: L(
        "Masshtab va uzunlik birliklari haqidagi barcha to'g'ri fikrlarni belgilang.",
        'Отметьте все верные утверждения о масштабе и единицах длины.',
      ),
      options: [
        L('1 : 100 000 da 1 cm = 1 km', 'В масштабе 1 : 100 000 один сантиметр равен одному километру'),
        L('1 km = 10 000 cm', '1 километр = 10 000 сантиметров'),
        L('Haqiqiy masofa xaritadagi masofadan katta', 'Реальное расстояние больше расстояния на карте'),
        L('Xaritadagi masofani topishda haqiqiy masofa masshtab soniga bo‘linadi', 'Для длины на карте реальное расстояние делят на число масштаба'),
      ],
      correctSet: [0, 2, 3],
      why: lines(
        ["1 kilometr 100 000 santimetrga teng, 10 000 santimetrga emas.", 'Один километр равен 100 000 сантиметров, а не 10 000.'],
        ["Haqiqiy masofa xaritadagidan katta; xaritadagi uzunlik haqiqiy masofani masshtab soniga bo'lish orqali topiladi.", 'Реальное расстояние больше длины на карте, а длину на карте находят делением.'],
      ),
      wrong: L("1 kilometrdagi santimetrlar sonini va ikki formulani eslang.", 'Вспомните число сантиметров в километре и две формулы.'),
    }),
    match({
      title: L("Masshtabni bir santimetr ma'nosi bilan juftlang", 'Соедините масштаб со значением одного сантиметра'),
      prompt: L("Har bir masshtabda xaritadagi 1 santimetr haqiqatda qancha ekanini toping.", 'Определите, чему равен на местности 1 сантиметр карты в каждом масштабе.'),
      intro: L(
        "Masshtab sonini santimetrdan kilometrga aylantiring va mos qiymat bilan juftlang.",
        'Переведите число масштаба из сантиметров в километры и соедините с подходящим значением.',
      ),
      rows: [
        { left: '1 : 100 000', correct: L('1 cm = 1 km', '1 см = 1 км') },
        { left: '1 : 200 000', correct: L('1 cm = 2 km', '1 см = 2 км') },
        { left: '1 : 500 000', correct: L('1 cm = 5 km', '1 см = 5 км') },
      ],
      why: lines(
        ["100 000, 200 000 va 500 000 santimetr mos ravishda 1, 2 va 5 kilometr.", '100 000, 200 000 и 500 000 сантиметров равны соответственно 1, 2 и 5 километрам.'],
        ["Shu qiymatlar xaritadagi bir santimetrning haqiqiy ma'nosidir.", 'Это и есть реальные значения одного сантиметра на карте.'],
      ),
      wrong: L("Har bir sonni 100 000 santimetrga, ya'ni bir kilometrga taqqoslang.", 'Сравните каждое число со 100 000 сантиметров, то есть с одним километром.'),
    }),
    info(
      L("Yo'nalish bir necha bo'lakdan iborat bo'lsa", 'Если маршрут состоит из нескольких участков'),
      lines(
        ["Avval xaritadagi barcha bo'laklar uzunligini qo'shing.", 'Сначала сложите длины всех участков на карте.'],
        ["Keyin jami xarita uzunligini masshtab bo'yicha haqiqiy masofaga aylantiring.", 'Затем переведите общую длину на карте в реальное расстояние по масштабу.'],
        ["Har bir bo'lakni alohida aylantirib qo'shish ham bir xil natija beradi.", 'Можно перевести каждый участок отдельно и сложить — результат будет тем же.'],
      ),
      { type: 'chain', items: ['2,4 cm + 1,6 cm', '4 cm', L('haqiqiy masofa', 'реальное расстояние')] },
    ),
    question({
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("Ikki bo'lakli yo'nalish uzunligini toping", 'Найдите длину маршрута из двух участков'),
      prompt: L("Masshtab 1 : 250 000. Xaritadagi yo'nalish 2,4 cm va 1,6 cm bo'laklardan iborat. Haqiqiy masofa qancha?", 'Масштаб 1 : 250 000. Маршрут на карте состоит из участков 2,4 см и 1,6 см. Каково реальное расстояние?'),
      intro: L(
        "Avval xaritadagi ikki bo'lakni qo'shing. Jami to'rt santimetr chiqadi. Bir nisbat ikki yuz ellik ming masshtabda bir santimetr ikki butun o'ndan besh kilometrga teng.",
        'Сначала сложите два участка на карте. Получится четыре сантиметра. В масштабе один к двумстам пятидесяти тысячам один сантиметр равен двум целым пяти десятым километра.',
      ),
      options: ['4 km', '6 km', '8 km', '10 km'],
      correct: 3,
      why: lines(
        ["2,4 + 1,6 = 4 santimetr.", '2,4 + 1,6 = 4 сантиметра.'],
        ["1 cm = 2,5 km, demak 4 · 2,5 = 10 kilometr.", '1 сантиметр = 2,5 километра, значит 4 · 2,5 = 10 километров.'],
      ),
      wrong: L("Avval bo'laklarni qo'shing, keyin bir santimetrga mos 2,5 kilometrga ko'paytiring.", 'Сначала сложите участки, затем умножьте на 2,5 километра для одного сантиметра.'),
      fact: L("Xarita, arxitektura chizmasi va maketlarda turli masshtablar ishlatiladi.", 'Разные масштабы применяют на картах, архитектурных чертежах и макетах.'),
      factVisual: '4 cm · 2,5 km = 10 km',
      visual: { type: 'chain', items: ['2,4 + 1,6', '4 cm', '10 km'] },
    }),
    summary(
      L("Masshtab bilan masofalarni topishni o'rgandingiz", 'Вы научились находить расстояния по масштабу'),
      lines(
        ["1 : n masshtab xaritadagi 1 birlik haqiqatda n birlik ekanini bildiradi.", 'Масштаб 1 : n означает, что 1 единица на карте равна n единицам на местности.'],
        ["Haqiqiy masofa ko'paytirish, xaritadagi masofa bo'lish orqali topiladi.", 'Реальное расстояние находят умножением, расстояние на карте — делением.'],
        ["Hisoblashdan oldin o'lchov birliklari bir xil qilinadi.", 'Перед вычислением единицы измерения приводят к одному виду.'],
      ),
      L("Endi xarita va chizmalardagi masshtabni hayotiy masofaga aylantira olasiz.", 'Теперь вы можете переводить масштаб карты или чертежа в реальные расстояния.'),
      L(
        "Dars yakunlandi. Masshtab xaritadagi bir birlik haqiqatda nechta birlikka tengligini ko'rsatadi. Haqiqiy masofani topishda ko'paytiramiz, xaritadagi masofani topishda bo'lamiz. Eng avval birliklarni bir xil qilamiz.",
        'Урок завершён. Масштаб показывает, скольким единицам на местности равна одна единица на карте. Для реального расстояния умножаем, для длины на карте делим. Сначала обязательно приводим единицы.',
      ),
    ),
  ];
  return makeLesson({ id: 'scale_6_20', title: lessonTitle, decorations: ['1 : 100 000', '1 cm', '1 km', '2,5 km', '4 cm', '10 km'], slides });
})();

const DARS21 = (() => {
  const lessonTitle = L('Foizlar', 'Проценты');
  const slides = [
    title(
      lessonTitle,
      L("Bugun foizning ma'nosi, kasr va o'nli kasr bilan bog'lanishi hamda sonning foizini topishni o'rganamiz.", 'Сегодня узнаем смысл процента, его связь с дробями и научимся находить процент от числа.'),
      L(
        "Bugungi mavzu foizlar. Bir foiz butunning yuzdan bir qismidir. Foizni oddiy kasr va o'nli kasrga aylantiramiz, sonning berilgan foizini topamiz hamda sinf va xarid misollarida natijani tekshiramiz.",
        'Тема урока — проценты. Один процент — это одна сотая часть целого. Будем переводить проценты в обыкновенные и десятичные дроби, находить процент от числа и проверять результат на примерах класса и покупок.',
      ),
      { type: 'chain', items: ['25%', '25/100', '1/4', '0,25'] },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("Yuz katakning bo'yalgan qismini toping", 'Найдите закрашенную часть ста клеток'),
      prompt: L("100 ta teng katakdan 25 tasi bo'yalgan. Necha foiz bo'yalgan?", 'Из 100 равных клеток закрашены 25. Сколько это процентов?'),
      intro: L(
        "Butun yuzta teng katakka bo'lingan. Shundan yigirma beshtasi bo'yalgan. Foiz yuzdan nechta qism olinganini ko'rsatadi.",
        'Целое разделено на сто равных клеток. Закрашены двадцать пять. Процент показывает, сколько частей взято из ста.',
      ),
      options: ['10%', '20%', '25%', '75%'],
      correct: 2,
      why: lines(
        ["Foiz yuzdan olingan qismlar sonini bildiradi.", 'Процент показывает число частей из ста.'],
        ["100 katakdan 25 tasi 25%, ya'ni 25/100.", '25 клеток из 100 — это 25%, то есть 25/100.'],
      ),
      wrong: L("Bo'yalgan kataklar soni yuzdan nechta ekanini yozing.", 'Запишите, сколько закрашенных клеток приходится на сто.'),
      visual: { type: 'cards', items: [{ label: '25/100', color: 'yellow' }, '25%'] },
    }),
    info(
      L("Foiz — yuzdan bir ulush", 'Процент — одна сотая доля'),
      lines(
        ["1% = 1/100 = 0,01.", '1% = 1/100 = 0,01.'],
        ["25% = 25/100 = 1/4 = 0,25.", '25% = 25/100 = 1/4 = 0,25.'],
        ["100% butunning o'ziga, 50% esa yarmiga teng.", '100% равно целому, а 50% — половине.'],
      ),
      { type: 'panels', panels: [{ title: L('Foiz', 'Процент'), lines: ['1%', '25%', '50%'], color: 'yellow' }, { title: L('Kasr', 'Дробь'), lines: ['1/100', '1/4', '1/2'], color: 'blue' }] },
      L('Yangi tushuncha', 'Новое понятие'),
    ),
    rule(
      L("Foizni kasrga aylantirish", 'Перевод процентов в дробь'),
      lines(
        ["p% ni oddiy kasrga aylantirish uchun p ni 100 ga bo'lamiz.", 'Чтобы перевести p% в обыкновенную дробь, делим p на 100.'],
        ["p% = p/100.", 'p% = p/100.'],
        ["O'nli kasrga o'tishda vergulni ikki xona chapga suramiz: 35% = 0,35.", 'При переводе в десятичную дробь переносим запятую на два знака влево: 35% = 0,35.'],
      ),
      { type: 'equation', expression: 'p% = p/100' },
    ),
    info(
      L("Kasrni foizga aylantirish", 'Перевод дроби в проценты'),
      lines(
        ["O'nli kasrni foizga aylantirish uchun uni 100 ga ko'paytiramiz.", 'Чтобы перевести десятичную дробь в проценты, умножаем её на 100.'],
        ["0,6 · 100% = 60%.", '0,6 · 100% = 60%.'],
        ["Oddiy kasrni avval maxraji 100 bo'lgan kasrga yoki o'nli kasrga aylantirish mumkin.", 'Обыкновенную дробь можно сначала привести к знаменателю 100 или перевести в десятичную дробь.'],
      ),
      { type: 'chain', items: ['3/5', '0,6', '60%'] },
    ),
    question({
      title: L("35% ni o'nli kasrga aylantiring", 'Переведите 35% в десятичную дробь'),
      prompt: L("Foiz belgisini olib, sonni 100 ga bo'ling.", 'Уберите знак процента и разделите число на 100.'),
      intro: L(
        "O'ttiz besh foiz yuzdan o'ttiz beshga teng. Uni o'nli kasr ko'rinishida yozing.",
        'Тридцать пять процентов равны тридцати пяти сотым. Запишите это десятичной дробью.',
      ),
      options: ['0,035', '0,35', '3,5', '35'],
      correct: 1,
      why: lines(
        ["35% = 35/100.", '35% = 35/100.'],
        ["35 : 100 = 0,35.", '35 : 100 = 0,35.'],
      ),
      wrong: L("Foizni o'nli kasrga o'tkazishda vergul ikki xona chapga suriladi.", 'При переводе процентов в десятичную дробь запятая переносится на два знака влево.'),
      visual: { type: 'chain', items: ['35%', '35/100', '0,35'] },
    }),
    info(
      L("Sonning foizini topish", 'Нахождение процента от числа'),
      lines(
        ["a sonining p foizini topish uchun a ni p/100 ga ko'paytiramiz.", 'Чтобы найти p процентов от числа a, умножаем a на p/100.'],
        ["Formula: a · p/100.", 'Формула: a · p/100.'],
        ["Masalan, 150 ning 20 foizi: 150 · 20/100 = 30.", 'Например, 20 процентов от 150: 150 · 20/100 = 30.'],
      ),
      { type: 'equation', expression: 'a ning p% i = a · p/100' },
    ),
    question({
      title: L("150 ning 20 foizini toping", 'Найдите 20 процентов от 150'),
      prompt: L("150 sonini 20/100 ga ko'paytiring.", 'Умножьте 150 на 20/100.'),
      intro: L(
        "Bir yuz ellikning yigirma foizini topamiz. Yigirma foiz beshdan birga teng, shuning uchun bir yuz ellikni beshga bo'lish ham mumkin.",
        'Найдём двадцать процентов от ста пятидесяти. Двадцать процентов равны одной пятой, поэтому можно разделить сто пятьдесят на пять.',
      ),
      options: ['20', '30', '50', '75'],
      correct: 1,
      why: lines(
        ["20% = 20/100 = 1/5.", '20% = 20/100 = 1/5.'],
        ["150 : 5 = 30.", '150 : 5 = 30.'],
      ),
      wrong: L("20 foizni 1/5 ga aylantirib, 150 ni 5 ga bo'ling.", 'Замените 20 процентов на 1/5 и разделите 150 на 5.'),
      visual: { type: 'chain', items: ['150 · 20/100', '150 : 5', '30'] },
    }),
    question({
      title: L("0,6 ni foizda yozing", 'Запишите 0,6 в процентах'),
      prompt: L("O'nli kasrni 100 ga ko'paytiring.", 'Умножьте десятичную дробь на 100.'),
      intro: L(
        "Nol butun o'ndan olti kasrini foizga aylantiring. Vergulni ikki xona o'ngga surish yoki yuzga ko'paytirish mumkin.",
        'Переведите ноль целых шесть десятых в проценты. Можно умножить на сто или перенести запятую на два знака вправо.',
      ),
      options: ['0,6%', '6%', '60%', '600%'],
      correct: 2,
      why: lines(
        ["0,6 · 100% = 60%.", '0,6 · 100% = 60%.'],
        ["Tekshiruv: 60% = 60/100 = 0,6.", 'Проверка: 60% = 60/100 = 0,6.'],
      ),
      wrong: L("O'nli kasrni foizga aylantirishda 100 ga ko'paytiring.", 'При переводе десятичной дроби в проценты умножьте на 100.'),
      visual: { type: 'equation', expression: '0,6 · 100% = ?' },
    }),
    info(
      L("Bir son ikkinchisining necha foizi?", 'Сколько процентов одно число составляет от другого?'),
      lines(
        ["a soni b sonining necha foizi ekanini topish uchun a ni b ga bo'lamiz.", 'Чтобы узнать, сколько процентов число a составляет от b, делим a на b.'],
        ["Natijani 100 foizga ko'paytiramiz.", 'Результат умножаем на 100 процентов.'],
        ["Formula: a : b · 100%. Masalan, 15 soni 60 ning 25 foizi.", 'Формула: a : b · 100%. Например, 15 составляет 25 процентов от 60.'],
      ),
      { type: 'equation', expression: 'a : b · 100%' },
    ),
    multi({
      title: L("25% ga teng yozuvlarni belgilang", 'Отметьте записи, равные 25%'),
      intro: L(
        "Yigirma besh foizga teng barcha kasr va o'nli kasrlarni belgilang.",
        'Отметьте все обыкновенные и десятичные дроби, равные двадцати пяти процентам.',
      ),
      options: ['1/4', '0,25', '25/100', '2/5'],
      correctSet: [0, 1, 2],
      why: lines(
        ["1/4 = 25/100 = 0,25 = 25%.", '1/4 = 25/100 = 0,25 = 25%.'],
        ["2/5 = 0,4 = 40%.", '2/5 = 0,4 = 40%.'],
      ),
      wrong: L("Har bir yozuvni yuzdan birlar yoki o'nli kasr ko'rinishiga keltiring.", 'Приведите каждую запись к сотым или десятичной дроби.'),
    }),
    match({
      title: L("Foizni mos kasr bilan juftlang", 'Соедините процент с подходящей дробью'),
      prompt: L("Har bir foiz uchun teng oddiy yoki o'nli kasrni tanlang.", 'Для каждого процента выберите равную обыкновенную или десятичную дробь.'),
      intro: L(
        "Foizni yuzga bo'ling va kerak bo'lsa kasrni qisqartiring. Keyin mos yozuv bilan juftlang.",
        'Разделите процент на сто и при необходимости сократите дробь. Затем соедините с подходящей записью.',
      ),
      rows: [
        { left: '20%', correct: L('1/5', '1/5') },
        { left: '50%', correct: L('1/2', '1/2') },
        { left: '75%', correct: L('3/4', '3/4') },
      ],
      why: lines(
        ["20/100 = 1/5, 50/100 = 1/2, 75/100 = 3/4.", '20/100 = 1/5, 50/100 = 1/2, 75/100 = 3/4.'],
        ["Har bir juftlik bir xil butun ulushini bildiradi.", 'Каждая пара обозначает одну и ту же долю целого.'],
      ),
      wrong: L("Foiz sonini 100 maxrajli kasr qilib yozing va qisqartiring.", 'Запишите процент дробью со знаменателем 100 и сократите.'),
    }),
    classify({
      title: L("Foizlarni yarmidan kam va kam bo'lmagan guruhlarga ajrating", 'Разделите проценты относительно половины'),
      prompt: L("50 foiz yarmiga teng. Har bir kartani mos guruhga joylang.", '50 процентов равны половине. Поместите каждую карточку в подходящую группу.'),
      intro: L(
        "Har bir foizni ellik foiz bilan taqqoslang. Ellikdan kichiklarini birinchi, ellik yoki undan kattalarini ikkinchi guruhga joylang.",
        'Сравните каждый процент с пятидесятью процентами. Меньшие поместите в первую группу, равные или большие — во вторую.',
      ),
      binA: L('50% dan kam', 'Меньше 50%'),
      binB: L('50% yoki ko‘p', '50% или больше'),
      cards: [{ label: '15%', value: true }, { label: '50%', value: false }, { label: '72%', value: false }, { label: '40%', value: true }],
      why: lines(
        ["15% va 40% yarmidan kam.", '15% и 40% меньше половины.'],
        ["50% yarmiga teng, 72% esa yarmidan katta.", '50% равно половине, а 72% больше половины.'],
      ),
      wrong: L("Har bir sonni 50 foiz bilan taqqoslang.", 'Сравните каждое число с 50 процентами.'),
    }),
    question({
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("Qatnashuvchilar foizini toping", 'Найдите процент участников'),
      prompt: L("24 o'quvchidan 18 tasi sayohatda qatnashdi. Bu sinfning necha foizi?", 'Из 24 учеников 18 участвовали в экскурсии. Сколько это процентов класса?'),
      intro: L(
        "Qatnashganlar sonini jami o'quvchilar soniga bo'ling va yuz foizga ko'paytiring. O'n sakkizning yigirma to'rtga nisbati to'rtdan uchga teng.",
        'Разделите число участников на общее число учеников и умножьте на сто процентов. Отношение восемнадцати к двадцати четырём равно трём четвертям.',
      ),
      options: ['60%', '70%', '75%', '80%'],
      correct: 2,
      why: lines(
        ["18/24 = 3/4 = 0,75.", '18/24 = 3/4 = 0,75.'],
        ["0,75 · 100% = 75%.", '0,75 · 100% = 75%.'],
      ),
      wrong: L("18 ni 24 ga bo'ling, keyin natijani 100 foizga ko'paytiring.", 'Разделите 18 на 24, затем умножьте результат на 100 процентов.'),
      fact: L("Foizlar turli miqdorlarni bir xil yuzlik o'lchovida solishtirishga yordam beradi.", 'Проценты помогают сравнивать разные величины в единой шкале из ста частей.'),
      factVisual: '18/24 = 75%',
      visual: { type: 'chain', items: ['18/24', '3/4', '0,75', '75%'] },
    }),
    summary(
      L("Foizlarni kasrlar bilan bog'lay olasiz", 'Вы умеете связывать проценты с дробями'),
      lines(
        ["1 foiz butunning yuzdan bir qismidir.", '1 процент — одна сотая часть целого.'],
        ["p foiz p/100 kasrga teng.", 'p процентов равны дроби p/100.'],
        ["Sonning foizi sonni p/100 ga ko'paytirish bilan topiladi.", 'Процент от числа находят умножением числа на p/100.'],
      ),
      L("Endi foizni kasrga, kasrni foizga aylantirib, sonning foizini topa olasiz.", 'Теперь вы можете переводить проценты в дроби и обратно, а также находить процент от числа.'),
      L(
        "Dars yakunlandi. Bir foiz yuzdan bir qismdir. Foizni kasrga aylantirish uchun yuzga bo'lamiz, kasrni foizga aylantirish uchun yuzga ko'paytiramiz. Sonning foizini sonni p bo'lingan yuzga ko'paytirib topamiz.",
        'Урок завершён. Один процент — одна сотая. Процент переводим в дробь делением на сто, а дробь в проценты — умножением на сто. Процент от числа находим умножением числа на p, делённое на сто.',
      ),
    ),
  ];
  return makeLesson({ id: 'percent_6_21', title: lessonTitle, decorations: ['1%', '25%', '50%', '75%', '100%', '0,25'], slides });
})();

const DARS22 = (() => {
  const lessonTitle = L("Foizga oid masalalar", 'Задачи на проценты');
  const slides = [
    title(
      lessonTitle,
      L("Bugun chegirma, narx oshishi va noma'lum butunni topishga oid foizli masalalarni yechamiz.", 'Сегодня решим задачи о скидках, повышении цены и нахождении неизвестного целого.'),
      L(
        "Bugungi mavzu foizga oid masalalar. Masalada qism, foiz yoki butun noma'lum bo'lishi mumkin. Uch holatni farqlaymiz, chegirma va narx oshishini ikki qadamda hisoblaymiz hamda ketma-ket foizlar nega bir-birini bekor qilmasligini ko'ramiz.",
        'Тема урока — задачи на проценты. В задаче может быть неизвестна часть, процент или целое. Различим три случая, рассчитаем скидку и повышение цены в два шага и увидим, почему последовательные проценты не отменяют друг друга.',
      ),
      { type: 'cards', items: [{ label: '−10%', color: 'yellow' }, '200 000', { label: '180 000', color: 'green' }] },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("Chegirmadan keyingi narxni toping", 'Найдите цену после скидки'),
      prompt: L("200 000 so'mlik sumkaga 10% chegirma berildi. Yangi narx qancha?", 'На сумку стоимостью 200 000 сумов дали скидку 10%. Какова новая цена?'),
      intro: L(
        "Avval ikki yuz ming so'mning o'n foizini toping. Bu chegirma miqdori. Keyin uni eski narxdan ayiring.",
        'Сначала найдите десять процентов от двухсот тысяч сумов. Это сумма скидки. Затем вычтите её из старой цены.',
      ),
      options: ["20 000 so'm", "180 000 so'm", "190 000 so'm", "220 000 so'm"],
      correct: 1,
      why: lines(
        ["200 000 ning 10 foizi 20 000 so'm.", '10 процентов от 200 000 равны 20 000 сумов.'],
        ["200 000 − 20 000 = 180 000 so'm.", '200 000 − 20 000 = 180 000 сумов.'],
      ),
      wrong: L("Chegirma summasini javob deb olmang; uni eski narxdan ayiring.", 'Не принимайте сумму скидки за ответ; вычтите её из старой цены.'),
      visual: { type: 'chain', items: ['200 000 · 10%', '20 000', '180 000'] },
    }),
    info(
      L("Foizli masalalarning uch turi", 'Три типа задач на проценты'),
      lines(
        ["Butun va foiz berilsa, qism topiladi.", 'Если известны целое и процент, находят часть.'],
        ["Qism va butun berilsa, foiz topiladi.", 'Если известны часть и целое, находят процент.'],
        ["Qism va foiz berilsa, butun topiladi.", 'Если известны часть и процент, находят целое.'],
      ),
      { type: 'panels', panels: [{ title: L('Qism', 'Часть'), lines: ['a · p/100'], color: 'yellow' }, { title: L('Foiz', 'Процент'), lines: ['q : a · 100%'], color: 'blue' }, { title: L('Butun', 'Целое'), lines: ['q : p/100'], color: 'green' }] },
    ),
    rule(
      L("Uch asosiy formula", 'Три основные формулы'),
      lines(
        ["Qism = butun · p/100.", 'Часть = целое · p/100.'],
        ["Foiz = qism : butun · 100%.", 'Процент = часть : целое · 100%.'],
        ["Butun = qism : p/100.", 'Целое = часть : p/100.'],
      ),
      { type: 'steps', items: ['q = a · p/100', 'p = q : a · 100%', 'a = q : p/100'] },
    ),
    info(
      L("Chegirma va narx oshishi", 'Скидка и повышение цены'),
      lines(
        ["Chegirmada avval kamayish miqdori topilib, eski narxdan ayiriladi.", 'При скидке сначала находят величину уменьшения и вычитают её из старой цены.'],
        ["Narx oshganda avval oshish miqdori topilib, eski narxga qo'shiladi.", 'При повышении сначала находят величину увеличения и прибавляют её к старой цене.'],
        ["Yangi narxni bir qadamda ham topish mumkin: 15% chegirmada eski narxning 85 foizi qoladi.", 'Новую цену можно найти за один шаг: при скидке 15% остаётся 85% старой цены.'],
      ),
      { type: 'panels', panels: [{ title: L('Chegirma', 'Скидка'), lines: ['100% − p%'], color: 'yellow' }, { title: L('Oshish', 'Повышение'), lines: ['100% + p%'], color: 'blue' }] },
    ),
    question({
      title: L("Chegirma miqdorini toping", 'Найдите сумму скидки'),
      prompt: L("120 000 so'mlik poyabzalga 15% chegirma berildi. Chegirma necha so'm?", 'На обувь стоимостью 120 000 сумов дали скидку 15%. Какова сумма скидки?'),
      intro: L(
        "Bu savolda yangi narx emas, faqat chegirma miqdori so'ralgan. Bir yuz yigirma mingning o'n besh foizini toping.",
        'Вопрос просит не новую цену, а только сумму скидки. Найдите пятнадцать процентов от ста двадцати тысяч.',
      ),
      options: ["12 000 so'm", "15 000 so'm", "18 000 so'm", "102 000 so'm"],
      correct: 2,
      why: lines(
        ["120 000 · 15/100 = 18 000.", '120 000 · 15/100 = 18 000.'],
        ["Demak, chegirma miqdori 18 000 so'm.", 'Значит, сумма скидки равна 18 000 сумов.'],
      ),
      wrong: L("Savolda chegirma miqdori so'ralgan; uni eski narxdan ayirish shart emas.", 'Спрашивается сумма скидки; вычитать её из старой цены не нужно.'),
      visual: { type: 'equation', expression: '120 000 · 15/100 = ?' },
    }),
    info(
      L("Yangi narxni ikki usulda topish", 'Два способа найти новую цену'),
      lines(
        ["1-usul: o'zgarish miqdorini topib, eski narxga qo'shamiz yoki undan ayiramiz.", 'Способ 1: находим величину изменения и прибавляем к старой цене или вычитаем.'],
        ["2-usul: qolgan yoki yangi foizni topamiz. 20% chegirmada 80% qoladi.", 'Способ 2: находим оставшийся или новый процент. При скидке 20% остаётся 80%.'],
        ["Ikkala usul bir xil natija berishi kerak.", 'Оба способа должны давать одинаковый результат.'],
      ),
      { type: 'chain', items: ['100%', '−20%', '80%'] },
    ),
    question({
      title: L("Narx oshgandan keyingi qiymatni toping", 'Найдите цену после повышения'),
      prompt: L("80 000 so'mlik xizmat narxi 25% ga oshdi. Yangi narx qancha?", 'Цена услуги 80 000 сумов выросла на 25%. Какова новая цена?'),
      intro: L(
        "Sakson mingning yigirma besh foizi yigirma ming. Narx oshgani uchun bu miqdorni eski narxga qo'shing.",
        'Двадцать пять процентов от восьмидесяти тысяч равны двадцати тысячам. Цена выросла, поэтому прибавьте эту сумму к старой цене.',
      ),
      options: ["60 000 so'm", "85 000 so'm", "100 000 so'm", "105 000 so'm"],
      correct: 2,
      why: lines(
        ["80 000 · 25/100 = 20 000 so'm.", '80 000 · 25/100 = 20 000 сумов.'],
        ["80 000 + 20 000 = 100 000 so'm.", '80 000 + 20 000 = 100 000 сумов.'],
      ),
      wrong: L("Bu chegirma emas, narx oshishi. O'zgarish miqdorini eski narxga qo'shing.", 'Это не скидка, а повышение. Прибавьте величину изменения к старой цене.'),
      visual: { type: 'chain', items: ['80 000', '+20 000', '100 000'] },
    }),
    question({
      title: L("Qismiga ko'ra butunni toping", 'Найдите целое по его части'),
      prompt: L("48 soni noma'lum sonning 60 foiziga teng. Noma'lum sonni toping.", 'Число 48 равно 60 процентам неизвестного числа. Найдите неизвестное число.'),
      intro: L(
        "Qirq sakkiz bu butunning oltmish foizi, ya'ni nol butun o'ndan olti qismi. Butunni topish uchun qirq sakkizni nol butun o'ndan oltiga bo'ling.",
        'Сорок восемь — это шестьдесят процентов, то есть ноль целых шесть десятых целого. Чтобы найти целое, разделите сорок восемь на ноль целых шесть десятых.',
      ),
      options: ['60', '72', '80', '108'],
      correct: 2,
      why: lines(
        ["60% = 0,6.", '60% = 0,6.'],
        ["48 : 0,6 = 80. Tekshiruv: 80 · 0,6 = 48.", '48 : 0,6 = 80. Проверка: 80 · 0,6 = 48.'],
      ),
      wrong: L("Butun qismdan katta bo'lishi kerak. 48 ni 0,6 ga bo'ling.", 'Целое должно быть больше части. Разделите 48 на 0,6.'),
      visual: { type: 'equation', expression: 'x · 60% = 48' },
    }),
    info(
      L("Ketma-ket foizlar bir-birini bekor qilmaydi", 'Последовательные проценты не отменяют друг друга'),
      lines(
        ["100 000 so'mlik narx 20% oshsa 120 000 so'm bo'ladi.", 'Цена 100 000 сумов после повышения на 20% станет 120 000 сумов.'],
        ["Keyin 20% kamayish yangi 120 000 so'mdan olinadi: 24 000 so'm.", 'Затем уменьшение на 20% считают уже от 120 000 сумов: это 24 000 сумов.'],
        ["Yakuniy narx 96 000 so'm. Chunki ikkinchi foizning asosi o'zgargan.", 'Итоговая цена 96 000 сумов, потому что основание второго процента изменилось.'],
      ),
      { type: 'chain', items: ['100 000', '+20% → 120 000', '−20% → 96 000'] },
    ),
    multi({
      title: L("To'g'ri hisoblarni belgilang", 'Отметьте верные вычисления'),
      intro: L(
        "Har bir foizli hisobni tekshiring va natijasi to'g'ri bo'lgan barcha yozuvlarni belgilang.",
        'Проверьте каждое вычисление с процентами и отметьте все верные результаты.',
      ),
      options: [
        L('300 ning 10% i = 30', '10% от 300 = 30'),
        L('80 ning 25% i = 20', '25% от 80 = 20'),
        L('70 ning 50% i = 30', '50% от 70 = 30'),
        L('200 ning 5% i = 10', '5% от 200 = 10'),
      ],
      correctSet: [0, 1, 3],
      why: lines(
        ["300 ning 10 foizi 30, 80 ning 25 foizi 20, 200 ning 5 foizi 10.", '10 процентов от 300 равны 30, 25 процентов от 80 равны 20, 5 процентов от 200 равны 10.'],
        ["70 ning 50 foizi uning yarmi, ya'ni 35.", '50 процентов от 70 — это половина, то есть 35.'],
      ),
      wrong: L("10 foiz — o'ndan bir, 25 foiz — to'rtdan bir, 50 foiz — yarim.", '10 процентов — одна десятая, 25 процентов — четверть, 50 процентов — половина.'),
    }),
    match({
      title: L("Savol turini formula bilan juftlang", 'Соедините тип вопроса с формулой'),
      prompt: L("Har bir masalada qism, foiz yoki butun topilishini aniqlang.", 'Определите, что требуется найти: часть, процент или целое.'),
      intro: L(
        "Masalada qaysi kattalik noma'lum ekanini aniqlang va mos formula bilan juftlang.",
        'Определите неизвестную величину в задаче и соедините с подходящей формулой.',
      ),
      rows: [
        { left: L('200 ning 15 foizi', '15 процентов от 200'), correct: L('200 · 15/100', '200 · 15/100') },
        { left: L('30 soni 120 ning necha foizi', 'Сколько процентов 30 составляет от 120'), correct: L('30 : 120 · 100%', '30 : 120 · 100%') },
        { left: L('42 soni butunning 70 foizi', '42 — это 70 процентов целого'), correct: L('42 : 0,7', '42 : 0,7') },
      ],
      why: lines(
        ["Qism ko'paytirish, foiz bo'lish va yuzga ko'paytirish, butun esa qismni foiz kasriga bo'lish bilan topiladi.", 'Часть находят умножением, процент — делением и умножением на сто, целое — делением части на процентную дробь.'],
        ["Noma'lum kattalik formulani tanlashga yordam beradi.", 'Неизвестная величина подсказывает выбор формулы.'],
      ),
      wrong: L("Har bir satrda aynan nima so'ralayotganini aniqlang.", 'Определите, что именно требуется найти в каждой строке.'),
    }),
    info(
      L("Foizli masalada javobni tekshirish", 'Проверка ответа в задаче на проценты'),
      lines(
        ["Chegirmadan keyingi narx eski narxdan kichik bo'lishi kerak.", 'Цена после скидки должна быть меньше старой цены.'],
        ["Oshishdan keyingi narx eski narxdan katta bo'lishi kerak.", 'Цена после повышения должна быть больше старой цены.'],
        ["Agar foiz 100 dan kichik bo'lsa, qism odatda butundan kichik bo'ladi.", 'Если процент меньше 100, часть обычно меньше целого.'],
      ),
      { type: 'cards', items: [{ label: 'Chegirma → kichik', color: 'yellow' }, { label: 'Oshish → katta', color: 'blue' }, { label: 'p < 100% → qism < butun', color: 'green' }] },
    ),
    question({
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("12 foiz chegirmali narxni toping", 'Найдите цену со скидкой 12 процентов'),
      prompt: L("250 000 so'mlik buyumga 12% chegirma berildi. Yangi narx qancha?", 'На товар стоимостью 250 000 сумов дали скидку 12%. Какова новая цена?'),
      intro: L(
        "Avval ikki yuz ellik mingning o'n ikki foizini toping. Bu o'ttiz ming so'm bo'ladi. So'ng chegirmani eski narxdan ayiring.",
        'Сначала найдите двенадцать процентов от двухсот пятидесяти тысяч. Это тридцать тысяч сумов. Затем вычтите скидку из старой цены.',
      ),
      options: ["30 000 so'm", "208 000 so'm", "220 000 so'm", "238 000 so'm"],
      correct: 2,
      why: lines(
        ["250 000 · 12/100 = 30 000 so'm chegirma.", '250 000 · 12/100 = 30 000 сумов скидки.'],
        ["250 000 − 30 000 = 220 000 so'm yangi narx.", '250 000 − 30 000 = 220 000 сумов — новая цена.'],
      ),
      wrong: L("Chegirma miqdorini topgach, uni eski narxdan ayiring.", 'После нахождения суммы скидки вычтите её из старой цены.'),
      fact: L("Do'kondagi chegirma foizi va tejalgan pul bir xil narsa emas: biri ulush, ikkinchisi pul miqdori.", 'Процент скидки и сэкономленная сумма — не одно и то же: первое является долей, второе — денежной величиной.'),
      factVisual: '250 000 − 30 000 = 220 000',
      visual: { type: 'chain', items: ['250 000 · 12%', '30 000', '220 000'] },
    }),
    summary(
      L("Foizli masalalarning uch turini yecha olasiz", 'Вы умеете решать три типа задач на проценты'),
      lines(
        ["Butun va foizdan qism topiladi.", 'По целому и проценту находят часть.'],
        ["Qism va butundan foiz topiladi.", 'По части и целому находят процент.'],
        ["Qism va foizdan butun topiladi; chegirma ayiriladi, oshish qo'shiladi.", 'По части и проценту находят целое; скидку вычитают, повышение прибавляют.'],
      ),
      L("Endi xarid, chegirma va narx oshishiga oid masalalarni tartibli yecha olasiz.", 'Теперь вы можете последовательно решать задачи о покупках, скидках и повышении цен.'),
      L(
        "Dars yakunlandi. Foizli masalada avval qism, foiz yoki butundan qaysi biri noma'lumligini aniqlaymiz. Chegirmani eski narxdan ayiramiz, oshish miqdorini esa unga qo'shamiz. Javobni masala mazmuni bilan tekshiramiz.",
        'Урок завершён. Сначала определяем, что неизвестно: часть, процент или целое. Скидку вычитаем из старой цены, повышение прибавляем. Проверяем ответ по смыслу задачи.',
      ),
    ),
  ];
  return makeLesson({ id: 'percent_tasks_6_22', title: lessonTitle, decorations: ['10%', '15%', '25%', '−12%', '+20%', '0,6'], slides });
})();

const DARS23 = (() => {
  const lessonTitle = L("Proporsiyaga oid masalalar", 'Задачи на пропорции');
  const slides = [
    title(
      lessonTitle,
      L("Bugun hayotiy masaladan to'g'ri yoki teskari proporsiya tuzib, noma'lum miqdorni topishni o'rganamiz.", 'Сегодня научимся составлять прямую или обратную пропорцию по жизненной задаче и находить неизвестную величину.'),
      L(
        "Bugungi mavzu proporsiyaga oid masalalar. Masalani yechishdan oldin miqdorlar to'g'ri yoki teskari bog'langanini aniqlaymiz. Jadval tuzamiz, birliklarni tekshiramiz, proporsiyani yechamiz va javobni hayotiy ma'no bilan tekshiramiz.",
        'Тема урока — задачи на пропорции. Перед решением определим прямую или обратную связь величин. Составим таблицу, проверим единицы, решим пропорцию и оценим ответ по смыслу.',
      ),
      { type: 'steps', items: [L('Bog‘lanish', 'Зависимость'), L('Jadval', 'Таблица'), L('Proporsiya', 'Пропорция'), L('Tekshiruv', 'Проверка')] },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("Retseptni besh kishiga moslang", 'Измените рецепт для пяти человек'),
      prompt: L("3 kishiga 6 stakan suv kerak. 5 kishiga shu nisbatda necha stakan kerak?", 'Для 3 человек нужно 6 стаканов воды. Сколько нужно для 5 человек в том же отношении?'),
      intro: L(
        "Odamlar soni ko'payganda suv miqdori ham ko'payadi. Bu to'g'ri proporsional masala. Avval bir kishiga necha stakan suv to'g'ri kelishini toping.",
        'При увеличении числа людей количество воды тоже растёт. Это прямая пропорциональность. Сначала найдите, сколько стаканов приходится на одного человека.',
      ),
      options: ['8', '9', '10', '12'],
      correct: 2,
      why: lines(
        ["6 : 3 = 2, demak bir kishiga 2 stakan.", '6 : 3 = 2 стакана на одного человека.'],
        ["2 · 5 = 10 stakan.", '2 · 5 = 10 стаканов.'],
      ),
      wrong: L("Avval bir kishiga to'g'ri keladigan miqdorni toping.", 'Сначала найдите количество для одного человека.'),
      visual: { type: 'chain', items: [L('3 kishi — 6 stakan', '3 человека — 6 стаканов'), L('5 kishi — 10 stakan', '5 человек — 10 стаканов')] },
    }),
    info(
      L("Masalani yechish algoritmi", 'Алгоритм решения задачи'),
      lines(
        ["Masaladagi ikki bog'liq miqdorni aniqlang.", 'Определите две связанные величины.'],
        ["Ular to'g'ri yoki teskari proporsional ekanini tekshiring.", 'Проверьте, прямо или обратно они пропорциональны.'],
        ["Qiymatlarni bir xil tartibda jadvalga yozib, proporsiya tuzing.", 'Запишите значения в таблицу в одном порядке и составьте пропорцию.'],
        ["Noma'lumni topib, javob yo'nalishini tekshiring.", 'Найдите неизвестное и проверьте направление изменения ответа.'],
      ),
      { type: 'steps', items: [L('Miqdorlar', 'Величины'), L('Bog‘lanish turi', 'Вид связи'), L('Proporsiya', 'Пропорция'), L('Mazmuniy tekshiruv', 'Проверка смысла')] },
    ),
    info(
      L("To'g'ri proporsiya jadvali", 'Таблица прямой пропорции'),
      lines(
        ["4 metr mato 120 000 so'm turadi, 7 metr narxi x bo'lsin.", '4 метра ткани стоят 120 000 сумов, стоимость 7 метров обозначим x.'],
        ["Mato ko'paysa narx oshadi — bu to'g'ri proporsiya.", 'Чем больше ткани, тем выше стоимость — это прямая пропорция.'],
        ["Bir xil tartibda yozamiz: 4 : 7 = 120 000 : x.", 'Сохраняем порядок: 4 : 7 = 120 000 : x.'],
      ),
      { type: 'panels', panels: [{ title: L('Mato', 'Ткань'), lines: ['4 m', '7 m'], color: 'yellow' }, { title: L('Narx', 'Стоимость'), lines: ['120 000', 'x'], color: 'blue' }] },
      undefined,
      {
        uz: ["To'rt metr mato bir yuz yigirma ming so'm, yetti metr narxi x bo'lsin.", "Mato ko'paysa narx oshadi, bu to'g'ri proporsiya.", "Tartibni saqlaymiz: to'rt nisbat yetti, teng bir yuz yigirma ming nisbat x."],
        ru: ['Четыре метра ткани стоят сто двадцать тысяч сумов, стоимость семи метров обозначим x.', 'Чем больше ткани, тем выше стоимость: это прямая пропорция.', 'Сохраняем порядок: четыре к семи равно сто двадцать тысяч к x.'],
      },
    ),
    info(
      L("Teskari proporsiya jadvali", 'Таблица обратной пропорции'),
      lines(
        ["6 ishchi ishni 8 kunda bajaradi, 12 ishchi uchun vaqt x kun.", '6 работников выполняют работу за 8 дней, время для 12 работников обозначим x.'],
        ["Ishchilar ko'paysa vaqt kamayadi — bu teskari proporsiya.", 'Чем больше работников, тем меньше время — это обратная пропорция.'],
        ["Ko'paytma o'zgarmaydi: 6 · 8 = 12 · x.", 'Произведение постоянно: 6 · 8 = 12 · x.'],
      ),
      { type: 'panels', panels: [{ title: L('Ishchilar', 'Работники'), lines: ['6', '12'], color: 'yellow' }, { title: L('Kunlar', 'Дни'), lines: ['8', 'x'], color: 'blue' }] },
    ),
    question({
      title: L("7 metr mato narxini toping", 'Найдите стоимость 7 метров ткани'),
      prompt: L("4 metr mato 120 000 so'm turadi. 7 metr necha so'm turadi?", '4 метра ткани стоят 120 000 сумов. Сколько стоят 7 метров?'),
      intro: L(
        "Bu to'g'ri proporsional masala. To'rt nisbat yetti, teng bir yuz yigirma ming nisbat x proporsiyani yeching.",
        'Это задача на прямую пропорциональность. Решите пропорцию четыре к семи равно сто двадцать тысяч к x.',
      ),
      options: ["180 000 so'm", "200 000 so'm", "210 000 so'm", "240 000 so'm"],
      correct: 2,
      why: lines(
        ["4 · x = 7 · 120 000 = 840 000.", '4 · x = 7 · 120 000 = 840 000.'],
        ["x = 840 000 : 4 = 210 000 so'm.", 'x = 840 000 : 4 = 210 000 сумов.'],
      ),
      wrong: L("Mato ko'paygani uchun javob 120 000 dan katta bo'lishi kerak.", 'Ткани стало больше, поэтому ответ должен быть больше 120 000.'),
      visual: { type: 'chain', items: ['4x = 7 · 120 000', '4x = 840 000', 'x = 210 000'] },
    }),
    info(
      L("Birlik narxi usuli ham yordam beradi", 'Помогает и способ единичной величины'),
      lines(
        ["Ba'zan avval bir birlik qiymatini topish proporsiyadan ham sodda.", 'Иногда сначала найти значение одной единицы проще, чем составлять пропорцию.'],
        ["120 000 : 4 = 30 000 so'm — bir metr narxi.", '120 000 : 4 = 30 000 сумов — цена одного метра.'],
        ["30 000 · 7 = 210 000 so'm. Natija proporsiya bilan bir xil.", '30 000 · 7 = 210 000 сумов. Результат совпадает с пропорцией.'],
      ),
      { type: 'chain', items: ['120 000 : 4', '30 000', '30 000 · 7', '210 000'] },
    ),
    question({
      title: L("12 ishchi ishni necha kunda bajaradi?", 'За сколько дней выполнят работу 12 работников?'),
      prompt: L("6 ishchi ishni 8 kunda bajaradi. 12 ishchi shu ishni necha kunda bajaradi?", '6 работников выполняют работу за 8 дней. За сколько дней выполнят её 12 работников?'),
      intro: L(
        "Ishchilar soni ikki marta oshdi, vaqt ikki marta kamayishi kerak. Teskari proporsiya ko'paytmasidan foydalaning.",
        'Число работников увеличилось в два раза, время должно уменьшиться в два раза. Используйте постоянство произведения.',
      ),
      options: ['2 kun', '4 kun', '8 kun', '16 kun'],
      correct: 1,
      why: lines(
        ["6 · 8 = 48 ishchi-kun.", '6 · 8 = 48 человеко-дней.'],
        ["48 : 12 = 4 kun.", '48 : 12 = 4 дня.'],
      ),
      wrong: L("Ishchilar ko'payganda vaqt kamayadi. 6 · 8 ko'paytmani 12 ga bo'ling.", 'При увеличении числа работников время уменьшается. Разделите произведение 6 · 8 на 12.'),
      visual: { type: 'equation', expression: '6 · 8 = 12 · x' },
    }),
    info(
      L("Birliklar va tartibni tekshiring", 'Проверяйте единицы и порядок'),
      lines(
        ["Kilogrammni kilogramm, so'mni so'm bilan bir ustunga yozing.", 'Килограммы записывайте под килограммами, сумы — под сумами.'],
        ["Bir qatorda miqdorlar tartibi qanday bo'lsa, ikkinchi qatorda ham shunday bo'lsin.", 'Сохраняйте одинаковый порядок величин в обеих строках.'],
        ["Turli birliklar bo'lsa, proporsiyadan oldin ularni birxillashtiring.", 'Если единицы различаются, приведите их к одному виду до составления пропорции.'],
      ),
      { type: 'cards', items: [{ label: 'kg ↔ kg', color: 'yellow' }, { label: "so'm ↔ so'm", color: 'blue' }, { label: 'soat ↔ soat', color: 'green' }] },
    ),
    info(
      L("Xatoni javob yo'nalishidan topish", 'Ищем ошибку по направлению ответа'),
      lines(
        ["Ko'proq mahsulot narxi kam chiqsa, to'g'ri proporsiya noto'g'ri tuzilgan.", 'Если большее количество товара стоит меньше, прямая пропорция составлена неверно.'],
        ["Ko'proq ishchi uchun vaqt ko'p chiqsa, teskari bog'lanish hisobga olinmagan.", 'Если для большего числа работников время стало больше, обратная зависимость не учтена.'],
        ["Hisobdan oldin taxminiy yo'nalishni aytish kuchli tekshiruvdir.", 'Предварительное определение направления ответа — полезная проверка.'],
      ),
      { type: 'panels', panels: [{ title: L("To'g'ri", 'Прямая'), lines: [L('ko‘p → ko‘p', 'больше → больше')], color: 'yellow' }, { title: L('Teskari', 'Обратная'), lines: [L('ko‘p → kam', 'больше → меньше')], color: 'blue' }] },
    ),
    multi({
      title: L("To'g'ri proporsiyaga oid masalalarni belgilang", 'Отметьте задачи на прямую пропорцию'),
      intro: L(
        "Bir miqdor ko'payganda ikkinchisi ham ko'payadigan barcha vaziyatlarni belgilang.",
        'Отметьте все ситуации, где при увеличении одной величины другая тоже увеличивается.',
      ),
      options: [
        L('Bir xil narxda kilogramm va xarajat', 'Килограммы и стоимость при одной цене'),
        L('Bir ishda ishchilar va kunlar', 'Работники и дни одной работы'),
        L('Bir xil tezlikda vaqt va masofa', 'Время и расстояние при одной скорости'),
        L('Bir yo‘lda tezlik va vaqt', 'Скорость и время на одном пути'),
      ],
      correctSet: [0, 2],
      why: lines(
        ["Ko'proq mahsulot ko'proq xarajat, ko'proq vaqt ko'proq masofa beradi.", 'Больше товара означает большую стоимость, больше времени — большее расстояние.'],
        ["Ishchilar va kunlar hamda bir yo'ldagi tezlik va vaqt teskari bog'langan.", 'Работники и дни, а также скорость и время на одном пути связаны обратно.'],
      ),
      wrong: L("Birinchi miqdor oshganda ikkinchisi qanday o'zgarishini tasavvur qiling.", 'Представьте, как меняется вторая величина при увеличении первой.'),
    }),
    match({
      title: L("Masalani tenglama bilan juftlang", 'Соедините задачу с уравнением'),
      prompt: L("Vaziyatga mos to'g'ri yoki teskari proporsiya yozuvini tanlang.", 'Выберите запись прямой или обратной пропорции для ситуации.'),
      intro: L(
        "Miqdorlar o'zgarish yo'nalishini aniqlang va vaziyatni mos tenglama bilan juftlang.",
        'Определите направление изменения величин и соедините ситуацию с подходящим уравнением.',
      ),
      rows: [
        { left: L('3 kg — 24 000; 5 kg — x', '3 кг — 24 000; 5 кг — x'), correct: L('3 : 5 = 24 000 : x', '3 : 5 = 24 000 : x') },
        { left: L('4 ishchi — 9 kun; 6 ishchi — x', '4 работника — 9 дней; 6 работников — x'), correct: L('4 · 9 = 6 · x', '4 · 9 = 6 · x') },
        { left: L('2 soat — 120 km; 5 soat — x', '2 часа — 120 км; 5 часов — x'), correct: L('2 : 5 = 120 : x', '2 : 5 = 120 : x') },
      ],
      why: lines(
        ["Mahsulot-narx va vaqt-masofa to'g'ri, ishchilar-kunlar teskari bog'langan.", 'Количество-стоимость и время-расстояние связаны прямо, работники-дни — обратно.'],
        ["Teskari bog'lanishda mos qiymatlar ko'paytmasi teng bo'ladi.", 'При обратной зависимости равны произведения соответствующих значений.'],
      ),
      wrong: L("Avval bog'lanish turini, keyin yozuvni tanlang.", 'Сначала определите вид зависимости, затем выберите запись.'),
    }),
    info(
      L("Yoqilg'i sarfiga oid misol", 'Пример с расходом топлива'),
      lines(
        ["Avtomobil 100 kilometrga 8 litr yoqilg'i sarflaydi.", 'Автомобиль расходует 8 литров топлива на 100 километров.'],
        ["250 kilometr uchun x litr kerak. Masofa va yoqilg'i to'g'ri proporsional.", 'Для 250 километров требуется x литров. Расстояние и топливо прямо пропорциональны.'],
        ["100 : 250 = 8 : x, bundan x = 20 litr.", '100 : 250 = 8 : x, отсюда x = 20 литров.'],
      ),
      { type: 'chain', items: ['100 km — 8 l', '250 km — 20 l'] },
      undefined,
      {
        uz: ["Avtomobil yuz kilometrga sakkiz litr yoqilg'i sarflaydi.", "Ikki yuz ellik kilometrga x litr kerak. Masofa va yoqilg'i to'g'ri proporsional.", "Yuz nisbat ikki yuz ellik, teng sakkiz nisbat x. Bundan x yigirma litr."],
        ru: ['Автомобиль расходует восемь литров на сто километров.', 'На двести пятьдесят километров нужно x литров. Расстояние и топливо прямо пропорциональны.', 'Сто к двумстам пятидесяти равно восемь к x. Получаем двадцать литров.'],
      },
    ),
    question({
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("8 kilogramm olma narxini toping", 'Найдите стоимость 8 килограммов яблок'),
      prompt: L("5 kilogramm olma 45 000 so'm turadi. 8 kilogramm necha so'm?", '5 килограммов яблок стоят 45 000 сумов. Сколько стоят 8 килограммов?'),
      intro: L(
        "Olma miqdori va narx to'g'ri proporsional. Avval bir kilogramm narxini topib, sakkizga ko'paytirishingiz yoki proporsiya tuzishingiz mumkin.",
        'Количество яблок и стоимость прямо пропорциональны. Можно найти цену одного килограмма и умножить на восемь или составить пропорцию.',
      ),
      options: ["63 000 so'm", "72 000 so'm", "81 000 so'm", "90 000 so'm"],
      correct: 1,
      why: lines(
        ["45 000 : 5 = 9 000 so'm — bir kilogramm narxi.", '45 000 : 5 = 9 000 сумов — цена одного килограмма.'],
        ["9 000 · 8 = 72 000 so'm.", '9 000 · 8 = 72 000 сумов.'],
      ),
      wrong: L("Avval bir kilogramm narxini toping. Ko'proq olma narxi 45 000 dan katta bo'lishi kerak.", 'Сначала найдите цену одного килограмма. Стоимость большего количества должна быть выше 45 000.'),
      fact: L("Birlik qiymati usuli va proporsiya usuli bir xil matematik bog'lanishga tayangan.", 'Способ единичной величины и способ пропорции основаны на одной математической зависимости.'),
      factVisual: '45 000 : 5 · 8 = 72 000',
      visual: { type: 'chain', items: ['45 000 : 5', '9 000 · 8', '72 000'] },
    }),
    summary(
      L("Proporsiyali masalalarni ongli yecha olasiz", 'Вы умеете осознанно решать задачи на пропорции'),
      lines(
        ["Avval bog'liq miqdorlar va ularning o'zgarish yo'nalishi aniqlanadi.", 'Сначала определяют связанные величины и направление их изменения.'],
        ["To'g'ri yoki teskari proporsiya jadval asosida tuziladi.", 'Прямую или обратную пропорцию составляют по таблице.'],
        ["Natija birliklar va hayotiy ma'no bilan tekshiriladi.", 'Результат проверяют по единицам и жизненному смыслу.'],
      ),
      L("Endi retsept, xarid, ish va yoqilg'i masalalarida mos proporsiyani tanlay olasiz.", 'Теперь вы можете выбрать подходящую пропорцию в задачах о рецептах, покупках, работе и топливе.'),
      L(
        "Dars yakunlandi. Proporsiyali masalada avval miqdorlar to'g'ri yoki teskari bog'langanini aniqlaymiz. Jadvalda birliklar va tartibni saqlaymiz. Noma'lumni topgach, javob oshishi yoki kamayishi kerakligini tekshiramiz.",
        'Урок завершён. Сначала определяем прямую или обратную связь величин. В таблице сохраняем единицы и порядок. После нахождения неизвестного проверяем, должен ли ответ увеличиться или уменьшиться.',
      ),
    ),
  ];
  return makeLesson({ id: 'proportion_tasks_6_23', title: lessonTitle, decorations: ['3 : 5', '4x', 'xy = k', '8 l', '250 km', 'x = 20'], slides });
})();

const DARS24 = (() => {
  const lessonTitle = L("Koordinata to'g'ri chizig'i", 'Координатная прямая');
  const slides = [
    title(
      lessonTitle,
      L("Bugun musbat va manfiy sonlarni koordinata to'g'ri chizig'ida belgilash, o'qish va siljishni topishni o'rganamiz.", 'Сегодня научимся отмечать и читать положительные и отрицательные числа на координатной прямой и находить перемещение.'),
      L(
        "Bugungi mavzu koordinata to'g'ri chizig'i. Nol sanoq boshi bo'ladi, musbat sonlar uning o'ngida, manfiy sonlar chapida joylashadi. Harorat, qavat va dengiz sathiga oid misollarda nuqta koordinatasi hamda yo'nalishni o'rganamiz.",
        'Тема урока — координатная прямая. Ноль является началом отсчёта, положительные числа расположены справа, отрицательные — слева. На примерах температуры, этажей и уровня моря изучим координаты точек и направление.',
      ),
      { type: 'numberLine', points: [{ at: 8, label: '−4' }, { at: 50, label: '0' }, { at: 82, label: '3' }] },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("Harorat qaysi tomonga siljidi?", 'В какую сторону изменилась температура?'),
      prompt: L("Ertalab −3 daraja, tushda 2 daraja bo'ldi. Harorat koordinata chizig'ida qaysi tomonga siljidi?", 'Утром было −3 градуса, днём стало 2 градуса. В какую сторону произошло перемещение?'),
      intro: L(
        "Harorat minus uchdan ikki darajaga ko'tarildi. Kattaroq sonlar koordinata chizig'ining o'ng tomonida joylashadi. Yo'nalishni tanlang.",
        'Температура поднялась с минус трёх до двух градусов. Большие числа расположены правее на координатной прямой. Выберите направление.',
      ),
      options: [L('Chapga', 'Влево'), L("O'ngga", 'Вправо'), L("O'zgarmadi", 'Не изменилась'), L('Aniqlab bo‘lmaydi', 'Нельзя определить')],
      correct: 1,
      why: lines(
        ["2 soni −3 sonidan katta.", 'Число 2 больше числа −3.'],
        ["Kattaroq son chiziqda o'ngda joylashadi, demak siljish o'ngga.", 'Большее число расположено правее, значит перемещение направлено вправо.'],
      ),
      wrong: L("−3 dan 2 ga sanab ko'ring: yo'nalish o'ngga ketadi.", 'Посчитайте от −3 до 2: движение идёт вправо.'),
      visual: { type: 'numberLine', points: [{ at: 20, label: '−3' }, { at: 68, label: '2' }] },
    }),
    info(
      L("Koordinata to'g'ri chizig'ining qismlari", 'Элементы координатной прямой'),
      lines(
        ["Sanoq boshi O nuqta bilan belgilanadi va uning koordinatasi 0.", 'Начало отсчёта обозначают точкой O, его координата равна 0.'],
        ["Birlik kesma qo'shni butun sonlar orasidagi masofani belgilaydi.", 'Единичный отрезок задаёт расстояние между соседними целыми числами.'],
        ["Musbat yo'nalish odatda o'ngga strelka bilan ko'rsatiladi.", 'Положительное направление обычно указывают стрелкой вправо.'],
      ),
      { type: 'numberLine', points: [{ at: 15, label: '−2' }, { at: 32, label: '−1' }, { at: 50, label: 'O(0)' }, { at: 68, label: '1' }, { at: 85, label: '2' }] },
      L('Asosiy qismlar', 'Основные элементы'),
    ),
    rule(
      L("Sonlarning chiziqdagi joyi", 'Положение чисел на прямой'),
      lines(
        ["Noldan o'ngda musbat sonlar joylashadi.", 'Справа от нуля расположены положительные числа.'],
        ["Noldan chapda manfiy sonlar joylashadi.", 'Слева от нуля расположены отрицательные числа.'],
        ["Chiziqda o'ngroqda turgan son har doim kattaroq.", 'Число, расположенное правее, всегда больше.'],
      ),
      { type: 'panels', panels: [{ title: L('Chap tomon', 'Левая сторона'), lines: [L('manfiy sonlar', 'отрицательные числа'), '−3, −2, −1'], color: 'blue' }, { title: L("O'ng tomon", 'Правая сторона'), lines: [L('musbat sonlar', 'положительные числа'), '1, 2, 3'], color: 'yellow' }] },
    ),
    info(
      L("Nuqta koordinatasi qanday yoziladi?", 'Как записывают координату точки?'),
      lines(
        ["A nuqta −3 soniga mos kelsa, A(−3) deb yozamiz.", 'Если точка A соответствует числу −3, записываем A(−3).'],
        ["B(2) yozuvi B nuqtaning koordinatasi 2 ekanini bildiradi.", 'Запись B(2) означает, что координата точки B равна 2.'],
        ["Koordinata nuqtaning sanoq boshiga nisbatan joyini ko'rsatadi.", 'Координата показывает положение точки относительно начала отсчёта.'],
      ),
      { type: 'cards', items: [{ label: 'A(−3)', color: 'blue' }, { label: 'O(0)', color: 'yellow' }, { label: 'B(2)', color: 'green' }] },
    ),
    question({
      title: L("A nuqtaning koordinatasini toping", 'Найдите координату точки A'),
      prompt: L("A nuqta noldan chapga 4 birlik masofada. Uning koordinatasi nima?", 'Точка A находится на 4 единицы левее нуля. Какова её координата?'),
      intro: L(
        "Noldan chap tomondagi sonlar manfiy. A nuqta to'rt birlik chapda joylashgan. Koordinatasini tanlang.",
        'Числа слева от нуля отрицательные. Точка A расположена на четыре единицы левее. Выберите её координату.',
      ),
      options: ['−5', '−4', '4', '5'],
      correct: 1,
      why: lines(
        ["Chap yo'nalish manfiy sonlarga olib boradi.", 'Движение влево ведёт к отрицательным числам.'],
        ["Noldan 4 birlik chapdagi nuqta A(−4).", 'Точка в четырёх единицах слева от нуля — A(−4).'],
      ),
      wrong: L("Yo'nalish chapga bo'lgani uchun koordinata manfiy bo'ladi.", 'Так как направление влево, координата отрицательная.'),
      visual: { type: 'numberLine', points: [{ at: 18, label: 'A(?)' }, { at: 68, label: '0' }] },
    }),
    info(
      L("Qarama-qarshi sonlar", 'Противоположные числа'),
      lines(
        ["Noldan bir xil masofada, lekin turli tomonda joylashgan sonlar qarama-qarshi sonlardir.", 'Числа, расположенные на одинаковом расстоянии от нуля по разные стороны, называются противоположными.'],
        ["−5 va 5 qarama-qarshi sonlar.", '−5 и 5 — противоположные числа.'],
        ["Nol o'ziga qarama-qarshi bo'lgan yagona son.", 'Ноль — единственное число, противоположное самому себе.'],
      ),
      { type: 'numberLine', points: [{ at: 12, label: '−5' }, { at: 50, label: '0' }, { at: 88, label: '5' }] },
    ),
    question({
      title: L("−2 dan 5 birlik o'ngga siljing", 'Переместитесь на 5 единиц вправо от −2'),
      prompt: L("Qaysi songa kelasiz?", 'К какому числу вы придёте?'),
      intro: L(
        "Minus ikkidan boshlang. O'ngga besh birlik sanang: minus bir, nol, bir, ikki, uch.",
        'Начните с минус двух. Отсчитайте пять единиц вправо: минус один, ноль, один, два, три.',
      ),
      options: ['−7', '−3', '3', '7'],
      correct: 2,
      why: lines(
        ["O'ngga siljish sonni kattalashtiradi.", 'Движение вправо увеличивает число.'],
        ["−2 + 5 = 3.", '−2 + 5 = 3.'],
      ),
      wrong: L("−2 dan boshlab o'ngga beshta birlik kesmani sanang.", 'Отсчитайте пять единичных отрезков вправо от −2.'),
      visual: { type: 'numberLine', points: [{ at: 25, label: '−2' }, { at: 75, label: '3' }] },
    }),
    question({
      title: L("−7 ga qarama-qarshi sonni toping", 'Найдите число, противоположное −7'),
      prompt: L("Noldan bir xil masofada chiziqning boshqa tomonida qaysi son turadi?", 'Какое число находится на таком же расстоянии от нуля с другой стороны?'),
      intro: L(
        "Minus yetti noldan yetti birlik chapda. Unga qarama-qarshi son noldan yetti birlik o'ngda bo'ladi.",
        'Минус семь находится в семи единицах слева от нуля. Противоположное число расположено в семи единицах справа.',
      ),
      options: ['−14', '−7', '0', '7'],
      correct: 3,
      why: lines(
        ["−7 va 7 noldan bir xil 7 birlik masofada.", '−7 и 7 находятся на одинаковом расстоянии 7 единиц от нуля.'],
        ["Ular chiziqning turli tomonida, demak qarama-qarshi.", 'Они расположены по разные стороны, значит являются противоположными.'],
      ),
      wrong: L("Ishorani almashtiring, noldan masofani o'zgartirmang.", 'Измените знак, не меняя расстояние от нуля.'),
      visual: { type: 'numberLine', points: [{ at: 10, label: '−7' }, { at: 50, label: '0' }, { at: 90, label: '?' }] },
    }),
    info(
      L("Hayotdagi musbat va manfiy koordinatalar", 'Положительные и отрицательные координаты в жизни'),
      lines(
        ["Dengiz sathidan 200 metr balandlik +200, pastlik −200 bilan ifodalanadi.", 'Высоту 200 метров над уровнем моря обозначают +200, глубину ниже уровня — −200.'],
        ["Noldan yuqori harorat musbat, noldan past harorat manfiy.", 'Температура выше нуля положительная, ниже нуля — отрицательная.'],
        ["Yer ustidagi qavatlar musbat, yer osti qavatlari manfiy sonlar bilan belgilanishi mumkin.", 'Надземные этажи можно обозначать положительными, подземные — отрицательными числами.'],
      ),
      { type: 'cards', items: [{ label: '−200 m', color: 'blue' }, { label: '0', color: 'yellow' }, { label: '+200 m', color: 'green' }] },
    ),
    multi({
      title: L("Noldan chapda joylashgan sonlarni belgilang", 'Отметьте числа, расположенные слева от нуля'),
      intro: L(
        "Koordinata chizig'ida noldan chap tomonda joylashadigan barcha manfiy sonlarni belgilang.",
        'Отметьте все отрицательные числа, расположенные слева от нуля на координатной прямой.',
      ),
      options: ['−6', '3', '−1', '0'],
      correctSet: [0, 2],
      why: lines(
        ["−6 va −1 manfiy sonlar, ular noldan chapda.", '−6 и −1 — отрицательные числа, они расположены слева от нуля.'],
        ["3 noldan o'ngda, 0 esa sanoq boshida.", '3 находится справа от нуля, а 0 — в начале отсчёта.'],
      ),
      wrong: L("Faqat minus ishorali sonlarni belgilang; nol manfiy emas.", 'Отметьте только числа со знаком минус; ноль не является отрицательным.'),
    }),
    match({
      title: L("Nuqtalarni koordinatalari bilan juftlang", 'Соедините точку с её координатой'),
      prompt: L("Nuqtalarning noldan yo'nalishi va masofasiga qarang.", 'Учитывайте направление и расстояние точки от нуля.'),
      intro: L(
        "Har bir nuqtaning noldan chapda yoki o'ngda ekanini va masofasini aniqlang. So'ng koordinata bilan juftlang.",
        'Определите, слева или справа от нуля находится каждая точка и каково расстояние. Затем соедините с координатой.',
      ),
      rows: [
        { left: L('A: noldan 3 birlik chapda', 'A: на 3 единицы левее нуля'), correct: L('A(−3)', 'A(−3)') },
        { left: L('B: noldan 4 birlik o‘ngda', 'B: на 4 единицы правее нуля'), correct: L('B(4)', 'B(4)') },
        { left: L('O: sanoq boshi', 'O: начало отсчёта'), correct: L('O(0)', 'O(0)') },
      ],
      why: lines(
        ["Chapdagi koordinata manfiy, o'ngdagi musbat, sanoq boshi nol.", 'Координата слева отрицательная, справа положительная, начало отсчёта равно нулю.'],
        ["Masofa koordinataning son qismini beradi.", 'Расстояние определяет числовую часть координаты.'],
      ),
      wrong: L("Avval yo'nalishdan ishorani, keyin masofadan sonni aniqlang.", 'Сначала определите знак по направлению, затем число по расстоянию.'),
    }),
    classify({
      title: L("Sonlarni manfiy va musbat guruhga ajrating", 'Разделите числа на отрицательные и положительные'),
      prompt: L("Nol bu topshiriqda berilmagan. Har bir sonni ishorasiga qarab joylang.", 'Ноль в задании не дан. Распределите числа по знаку.'),
      intro: L(
        "Minus ishorali sonlarni manfiy guruhga, ishorasiz musbat sonlarni musbat guruhga joylang.",
        'Числа со знаком минус поместите в отрицательную группу, положительные числа — в положительную.',
      ),
      binA: L('Manfiy', 'Отрицательные'),
      binB: L('Musbat', 'Положительные'),
      cards: [{ label: '−8', value: true }, { label: '5', value: false }, { label: '−2', value: true }, { label: '11', value: false }],
      why: lines(
        ["−8 va −2 noldan chapda joylashadigan manfiy sonlar.", '−8 и −2 — отрицательные числа слева от нуля.'],
        ["5 va 11 noldan o'ngda joylashadigan musbat sonlar.", '5 и 11 — положительные числа справа от нуля.'],
      ),
      wrong: L("Minus ishorasiga e'tibor bering.", 'Обратите внимание на знак минус.'),
    }),
    question({
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("Haroratning yangi qiymatini toping", 'Найдите новую температуру'),
      prompt: L("Harorat −4 daraja edi. U 7 darajaga ko'tarildi. Yangi harorat qancha?", 'Температура была −4 градуса. Она повысилась на 7 градусов. Какова новая температура?'),
      intro: L(
        "Ko'tarilish koordinata chizig'ida o'ngga siljishni bildiradi. Minus to'rtdan o'ngga yetti birlik sanang.",
        'Повышение означает движение вправо по координатной прямой. Отсчитайте семь единиц вправо от минус четырёх.',
      ),
      options: ['−11°', '−3°', '3°', '11°'],
      correct: 2,
      why: lines(
        ["−4 dan o'ngga 4 birlik yursak 0 ga kelamiz.", 'От −4 четыре единицы вправо приводят к 0.'],
        ["Yana 3 birlik o'ngga yursak 3 chiqadi. −4 + 7 = 3.", 'Ещё три единицы вправо приводят к 3. −4 + 7 = 3.'],
      ),
      wrong: L("Ko'tarilishda o'ngga siljish kerak. −4 dan 7 birlik sanang.", 'При повышении двигайтесь вправо. Отсчитайте 7 единиц от −4.'),
      fact: L("Koordinata chizig'i harorat, balandlik, vaqt va moliyaviy o'zgarishlarni ko'rsatishda ishlatiladi.", 'Координатную прямую используют для температуры, высоты, времени и финансовых изменений.'),
      factVisual: '−4 + 7 = 3',
      visual: { type: 'numberLine', points: [{ at: 20, label: '−4' }, { at: 72, label: '3' }] },
    }),
    summary(
      L("Koordinata to'g'ri chizig'ini o'qiy olasiz", 'Вы умеете читать координатную прямую'),
      lines(
        ["Nol sanoq boshi, o'ng yo'nalish musbat, chap yo'nalish manfiy.", 'Ноль — начало отсчёта, направление вправо положительное, влево отрицательное.'],
        ["Nuqta koordinatasi uning sanoq boshiga nisbatan joyini ko'rsatadi.", 'Координата точки показывает её положение относительно нуля.'],
        ["Qarama-qarshi sonlar noldan teng masofada turli tomonda joylashadi.", 'Противоположные числа расположены на равном расстоянии от нуля по разные стороны.'],
      ),
      L("Endi nuqtaning koordinatasini topib, chiziqdagi siljishni hayotiy vaziyat bilan bog'lay olasiz.", 'Теперь вы можете находить координаты точек и связывать перемещение на прямой с жизненной ситуацией.'),
      L(
        "Dars yakunlandi. Nol sanoq boshi. Musbat sonlar o'ngda, manfiy sonlar chapda joylashadi. Nuqta koordinatasi uning joyini, qarama-qarshi sonlar esa noldan teng masofadagi ikki tomonni ko'rsatadi.",
        'Урок завершён. Ноль — начало отсчёта. Положительные числа справа, отрицательные слева. Координата показывает положение точки, а противоположные числа находятся на равном расстоянии по разные стороны нуля.',
      ),
    ),
  ];
  return makeLesson({ id: 'number_line_6_24', title: lessonTitle, decorations: ['−5', '−2', '0', '3', '7', 'A(−4)'], slides });
})();

const DARS25 = (() => {
  const lessonTitle = L('Sonning moduli', 'Модуль числа');
  const slides = [
    title(
      lessonTitle,
      L("Bugun sonning noldan masofasini modul orqali ifodalash va ikki nuqta orasidagi masofani topishni o'rganamiz.", 'Сегодня научимся выражать расстояние числа от нуля с помощью модуля и находить расстояние между точками.'),
      L(
        "Bugungi mavzu sonning moduli. Modul sonning koordinata chizig'ida noldan qancha masofada ekanini ko'rsatadi. Masofa manfiy bo'lmaydi. Musbat, manfiy va nolning modulini, modul qatnashgan tenglama hamda ikki nuqta orasidagi masofani o'rganamiz.",
        'Тема урока — модуль числа. Модуль показывает расстояние от числа до нуля на координатной прямой. Расстояние не бывает отрицательным. Изучим модуль положительного, отрицательного числа и нуля, уравнение с модулем и расстояние между точками.',
      ),
      { type: 'equation', expression: '|−4| = 4' },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("−4 soni noldan qancha uzoqda?", 'Как далеко число −4 от нуля?'),
      prompt: L("Koordinata chizig'ida −4 dan 0 gacha nechta birlik kesma bor?", 'Сколько единичных отрезков от −4 до 0 на координатной прямой?'),
      intro: L(
        "Minus to'rt noldan chapda joylashgan, lekin masofa yo'nalishni emas, uzunlikni bildiradi. Minus to'rtdan nolgacha birlik kesmalarni sanang.",
        'Минус четыре расположено слева от нуля, но расстояние показывает длину, а не направление. Посчитайте единичные отрезки от минус четырёх до нуля.',
      ),
      options: ['−4', '0', '4', '8'],
      correct: 2,
      why: lines(
        ["−4 dan 0 gacha 4 birlik kesma bor.", 'От −4 до 0 четыре единичных отрезка.'],
        ["Shuning uchun |−4| = 4.", 'Поэтому |−4| = 4.'],
      ),
      wrong: L("Masofa manfiy bo'lmaydi. Faqat birlik kesmalar sonini sanang.", 'Расстояние не бывает отрицательным. Сосчитайте число единичных отрезков.'),
      visual: { type: 'numberLine', points: [{ at: 18, label: '−4' }, { at: 68, label: '0' }] },
    }),
    info(
      L("Modul — noldan masofa", 'Модуль — расстояние от нуля'),
      lines(
        ["a sonining moduli |a| ko'rinishida yoziladi.", 'Модуль числа a записывают как |a|.'],
        ["|a| sonning koordinata chizig'ida noldan masofasidir.", '|a| — расстояние от числа до нуля на координатной прямой.'],
        ["Masofa manfiy bo'lmagani uchun har qanday sonning moduli 0 yoki musbat.", 'Поскольку расстояние неотрицательно, модуль любого числа равен нулю или положителен.'],
      ),
      { type: 'cards', items: [{ label: '|a|', color: 'yellow' }, L('noldan masofa', 'расстояние от нуля'), { label: '|a| ≥ 0', color: 'green' }] },
      L('Yangi tushuncha', 'Новое понятие'),
      {
        uz: ["a sonining moduli modul a deb o'qiladi.", "Modul a sonning koordinata chizig'ida noldan masofasidir.", "Masofa manfiy bo'lmagani uchun har qanday sonning moduli nol yoki musbat."],
        ru: ['Модуль числа a читают как модуль a.', 'Модуль a — расстояние от числа до нуля на координатной прямой.', 'Поскольку расстояние неотрицательно, модуль любого числа равен нулю или положителен.'],
      },
    ),
    rule(
      L("Modulni hisoblash qoidasi", 'Правило вычисления модуля'),
      lines(
        ["Agar a musbat yoki nol bo'lsa, |a| = a.", 'Если a положительно или равно нулю, |a| = a.'],
        ["Agar a manfiy bo'lsa, |a| = −a, ya'ni qarama-qarshi musbat son olinadi.", 'Если a отрицательно, |a| = −a, то есть берётся противоположное положительное число.'],
        ["Qisqa aytganda, modul sonning ishorasiz masofa qiymatidir.", 'Кратко: модуль — это расстояние без учёта знака числа.'],
      ),
      { type: 'panels', panels: [{ title: L('a ≥ 0 bo‘lsa', 'Если a ≥ 0'), lines: ['|a| = a'], color: 'yellow' }, { title: L('a < 0 bo‘lsa', 'Если a < 0'), lines: ['|a| = −a'], color: 'blue' }] },
      {
        uz: ["a musbat yoki nol bo'lsa, modul a teng a.", "a manfiy bo'lsa, modul a teng minus a, ya'ni qarama-qarshi musbat son olinadi.", "Modul sonning ishorasiz masofa qiymatidir."],
        ru: ['Если a положительно или равно нулю, модуль a равен a.', 'Если a отрицательно, модуль a равен минус a, то есть берётся противоположное положительное число.', 'Модуль — расстояние без учёта знака числа.'],
      },
    ),
    info(
      L("Uchta asosiy misol", 'Три основных примера'),
      lines(
        ["|5| = 5, chunki 5 noldan 5 birlik uzoqda.", '|5| = 5, потому что число 5 находится в пяти единицах от нуля.'],
        ["|−7| = 7, chunki −7 ham noldan 7 birlik uzoqda.", '|−7| = 7, потому что число −7 тоже находится в семи единицах от нуля.'],
        ["|0| = 0, chunki nolning o'zidan masofasi nol.", '|0| = 0, потому что расстояние от нуля до самого себя равно нулю.'],
      ),
      { type: 'cards', items: ['|5| = 5', { label: '|−7| = 7', color: 'yellow' }, '|0| = 0'] },
      undefined,
      {
        uz: ["Beshning moduli besh, chunki besh noldan besh birlik uzoqda.", "Minus yettining moduli yetti, chunki minus yetti ham noldan yetti birlik uzoqda.", "Nolning moduli nol, chunki nolning o'zidan masofasi nol."],
        ru: ['Модуль пяти равен пяти, потому что пять находится в пяти единицах от нуля.', 'Модуль минус семи равен семи, потому что минус семь тоже в семи единицах от нуля.', 'Модуль нуля равен нулю, потому что расстояние от нуля до себя равно нулю.'],
      },
    ),
    question({
      title: L("|−9| ni toping", 'Найдите |−9|'),
      prompt: L("−9 sonining noldan masofasi qancha?", 'Каково расстояние от числа −9 до нуля?'),
      intro: L(
        "Minus to'qqiz noldan to'qqiz birlik chapda. Modul masofani bildiradi va manfiy bo'lmaydi.",
        'Минус девять находится в девяти единицах слева от нуля. Модуль выражает расстояние и не бывает отрицательным.',
      ),
      options: ['−9', '0', '9', '18'],
      correct: 2,
      why: lines(
        ["−9 dan 0 gacha masofa 9 birlik.", 'Расстояние от −9 до 0 равно 9 единицам.'],
        ["Shuning uchun |−9| = 9.", 'Поэтому |−9| = 9.'],
      ),
      wrong: L("Modul ishorani emas, noldan masofani oladi.", 'Модуль учитывает не знак, а расстояние от нуля.'),
      visual: { type: 'equation', expression: '|−9| = ?' },
    }),
    info(
      L("Moduli bir xil bo'lgan ikki son", 'Два числа с одинаковым модулем'),
      lines(
        ["|x| = 4 tenglama x ning noldan 4 birlik masofada ekanini bildiradi.", 'Уравнение |x| = 4 означает, что x находится в четырёх единицах от нуля.'],
        ["Noldan 4 birlik chapda −4, o'ngda 4 joylashgan.", 'В четырёх единицах слева находится −4, справа — 4.'],
        ["Shuning uchun |x| = 4 tenglamaning ikki yechimi bor: x = −4 va x = 4.", 'Поэтому уравнение |x| = 4 имеет два решения: x = −4 и x = 4.'],
      ),
      { type: 'numberLine', points: [{ at: 16, label: '−4' }, { at: 50, label: '0' }, { at: 84, label: '4' }] },
      undefined,
      {
        uz: ["Modul x teng to'rt tenglama x ning noldan to'rt birlik masofada ekanini bildiradi.", "Noldan to'rt birlik chapda minus to'rt, o'ngda to'rt joylashgan.", "Shuning uchun yechimlar x teng minus to'rt va x teng to'rt."],
        ru: ['Уравнение модуль x равен четырём означает, что x находится в четырёх единицах от нуля.', 'В четырёх единицах слева находится минус четыре, справа — четыре.', 'Поэтому решения: x равно минус четырём и x равно четырём.'],
      },
    ),
    question({
      title: L("|x| = 6 tenglamaning yechimlarini toping", 'Найдите решения уравнения |x| = 6'),
      prompt: L("Noldan 6 birlik masofada qaysi ikki son joylashgan?", 'Какие два числа находятся на расстоянии 6 от нуля?'),
      intro: L(
        "Noldan olti birlik chapdagi va olti birlik o'ngdagi sonlarni toping. Ikkalasi ham bir xil modulga ega.",
        'Найдите числа в шести единицах слева и справа от нуля. Оба имеют одинаковый модуль.',
      ),
      options: ['0 va 6', '−6 va 0', '−6 va 6', '6 va 12'],
      correct: 2,
      why: lines(
        ["−6 va 6 noldan bir xil 6 birlik masofada.", '−6 и 6 находятся на одинаковом расстоянии 6 от нуля.'],
        ["Shuning uchun |−6| = 6 va |6| = 6.", 'Поэтому |−6| = 6 и |6| = 6.'],
      ),
      wrong: L("Noldan ikki tomonga olti birlik yuring.", 'Отсчитайте шесть единиц от нуля в обе стороны.'),
      visual: { type: 'numberLine', points: [{ at: 12, label: '−6' }, { at: 50, label: '0' }, { at: 88, label: '6' }] },
    }),
    question({
      title: L("|−3| + |5| ni hisoblang", 'Вычислите |−3| + |5|'),
      prompt: L("Avval har bir modulni alohida toping.", 'Сначала найдите каждый модуль отдельно.'),
      intro: L(
        "Minus uchning moduli uch, beshning moduli besh. Endi ikki musbat natijani qo'shing.",
        'Модуль минус трёх равен трём, модуль пяти равен пяти. Теперь сложите два положительных результата.',
      ),
      options: ['2', '3', '8', '−8'],
      correct: 2,
      why: lines(
        ["|−3| = 3 va |5| = 5.", '|−3| = 3 и |5| = 5.'],
        ["3 + 5 = 8.", '3 + 5 = 8.'],
      ),
      wrong: L("Avval modul ichidagi sonlarning noldan masofasini toping.", 'Сначала найдите расстояния чисел внутри модулей от нуля.'),
      visual: { type: 'equation', expression: '|−3| + |5| = ?' },
    }),
    info(
      L("Ikki nuqta orasidagi masofa", 'Расстояние между двумя точками'),
      lines(
        ["a va b koordinatali nuqtalar orasidagi masofa |a − b| formula bilan topiladi.", 'Расстояние между точками с координатами a и b находят по формуле |a − b|.'],
        ["−2 va 4 orasidagi masofa |−2 − 4| = |−6| = 6.", 'Расстояние между −2 и 4: |−2 − 4| = |−6| = 6.'],
        ["Qaysi sonni birinchi ayirishdan qat'i nazar, modul masofani musbat qiladi.", 'Независимо от порядка вычитания модуль делает расстояние положительным.'],
      ),
      { type: 'chain', items: ['|a − b|', '|−2 − 4|', '|−6|', '6'] },
      undefined,
      {
        uz: ["a va b koordinatali nuqtalar orasidagi masofa modul a minus b formula bilan topiladi.", "Minus ikki va to'rt orasidagi masofa modul minus ikki minus to'rt, modul minus olti, ya'ni olti.", "Ayirish tartibidan qat'i nazar, modul masofani musbat qiladi."],
        ru: ['Расстояние между точками a и b находят как модуль a минус b.', 'Расстояние между минус двумя и четырьмя: модуль минус два минус четыре, модуль минус шесть, то есть шесть.', 'Независимо от порядка вычитания модуль делает расстояние положительным.'],
      },
    ),
    multi({
      title: L("Qiymati 5 ga teng ifodalarni belgilang", 'Отметьте выражения, равные 5'),
      intro: L(
        "Har bir modul ichidagi sonning noldan masofasini toping va qiymati besh bo'lgan barcha ifodalarni belgilang.",
        'Найдите расстояние каждого числа от нуля и отметьте все выражения со значением пять.',
      ),
      options: ['|−5|', '|5|', '|0|', '|−3|'],
      correctSet: [0, 1],
      why: lines(
        ["−5 va 5 noldan 5 birlik masofada.", '−5 и 5 находятся в пяти единицах от нуля.'],
        ["|0| = 0, |−3| = 3.", '|0| = 0, |−3| = 3.'],
      ),
      wrong: L("Modulni sonning noldan masofasi sifatida hisoblang.", 'Вычисляйте модуль как расстояние числа от нуля.'),
    }),
    match({
      title: L("Modulli ifodani qiymati bilan juftlang", 'Соедините выражение с модулем и его значение'),
      prompt: L("Har bir ifodadagi sonning noldan masofasini toping.", 'Найдите расстояние каждого числа от нуля.'),
      intro: L(
        "Ishorani emas, noldan masofani oling va ifodani mos natija bilan juftlang.",
        'Учитывайте не знак, а расстояние от нуля и соедините выражение с результатом.',
      ),
      rows: [
        { left: '|−8|', correct: L('8', '8') },
        { left: '|3|', correct: L('3', '3') },
        { left: '|0|', correct: L('0', '0') },
      ],
      why: lines(
        ["−8 noldan 8 birlik, 3 noldan 3 birlik, 0 esa noldan 0 birlik masofada.", '−8 находится в 8, число 3 — в 3, а 0 — в 0 единицах от нуля.'],
        ["Barcha natijalar manfiy emas.", 'Все результаты неотрицательны.'],
      ),
      wrong: L("Har bir son va nol orasidagi birlik kesmalarni sanang.", 'Сосчитайте единичные отрезки между каждым числом и нулём.'),
    }),
    info(
      L("Modul haqida ikki muhim ogohlantirish", 'Два важных предупреждения о модуле'),
      lines(
        ["Modul son oldidagi minusni shunchaki o'chirish emas; u masofa tushunchasidir.", 'Модуль — не просто стирание минуса, а понятие расстояния.'],
        ["|x| = −3 kabi tenglamaning yechimi yo'q, chunki modul manfiy bo'lmaydi.", 'Уравнение |x| = −3 не имеет решений, потому что модуль не бывает отрицательным.'],
        ["|x| = 0 tenglamaning faqat bitta yechimi bor: x = 0.", 'Уравнение |x| = 0 имеет единственное решение: x = 0.'],
      ),
      { type: 'cards', items: [{ label: '|x| ≥ 0', color: 'green' }, { label: '|x| = −3 → yechim yo‘q', color: 'yellow' }, '|x| = 0 → x = 0'] },
      undefined,
      {
        uz: ["Modul minusni shunchaki o'chirish emas, u masofa tushunchasidir.", "Modul x teng minus uch tenglamaning yechimi yo'q, chunki modul manfiy bo'lmaydi.", "Modul x teng nol tenglamaning faqat x teng nol yechimi bor."],
        ru: ['Модуль — не просто удаление минуса, это расстояние.', 'Уравнение модуль x равен минус трём не имеет решений, потому что модуль не бывает отрицательным.', 'Уравнение модуль x равен нулю имеет единственное решение: x равен нулю.'],
      },
    ),
    question({
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("−7 va 2 orasidagi masofani toping", 'Найдите расстояние между −7 и 2'),
      prompt: L("Koordinata chizig'idagi ikki nuqta orasida nechta birlik kesma bor?", 'Сколько единичных отрезков между двумя точками на координатной прямой?'),
      intro: L(
        "Masofani modul a minus b formula bilan toping. Minus yettidan ikkini ayirsak minus to'qqiz, uning moduli to'qqiz.",
        'Найдите расстояние по формуле модуль a минус b. Минус семь минус два равно минус девять, его модуль равен девяти.',
      ),
      options: ['5', '7', '9', '14'],
      correct: 2,
      why: lines(
        ["|−7 − 2| = |−9|.", '|−7 − 2| = |−9|.'],
        ["|−9| = 9. Nuqtalar orasida 9 birlik kesma bor.", '|−9| = 9. Между точками 9 единичных отрезков.'],
      ),
      wrong: L("Koordinatalar ayirmasining modulini oling.", 'Возьмите модуль разности координат.'),
      fact: L("Modul masofa bo'lgani uchun geometriya, fizika va ma'lumotlar tahlilida ham ishlatiladi.", 'Поскольку модуль выражает расстояние, его используют в геометрии, физике и анализе данных.'),
      factVisual: '|−7 − 2| = 9',
      visual: { type: 'numberLine', points: [{ at: 12, label: '−7' }, { at: 75, label: '2' }] },
    }),
    summary(
      L("Sonning modulini va masofani topa olasiz", 'Вы умеете находить модуль числа и расстояние'),
      lines(
        ["|a| sonning noldan masofasidir va manfiy bo'lmaydi.", '|a| — расстояние от числа до нуля, оно неотрицательно.'],
        ["Qarama-qarshi sonlarning modullari teng.", 'Модули противоположных чисел равны.'],
        ["Ikki nuqta orasidagi masofa |a − b| bilan topiladi.", 'Расстояние между двумя точками находят по формуле |a − b|.'],
      ),
      L("Endi modulni masofa sifatida tushunib, modulli ifoda va sodda tenglamalarni yecha olasiz.", 'Теперь вы понимаете модуль как расстояние и можете решать простые выражения и уравнения с модулем.'),
      L(
        "Dars yakunlandi. Sonning moduli uning noldan masofasidir. Masofa manfiy bo'lmaydi, shuning uchun qarama-qarshi sonlarning modullari teng. Ikki nuqta orasidagi masofa koordinatalar ayirmasining moduli bilan topiladi.",
        'Урок завершён. Модуль числа — его расстояние от нуля. Расстояние не бывает отрицательным, поэтому модули противоположных чисел равны. Расстояние между точками находят как модуль разности координат.',
      ),
    ),
  ];
  return makeLesson({ id: 'absolute_6_25', title: lessonTitle, decorations: ['|−5|', '|3|', '|0|', '|x|', '−7', '7'], slides });
})();

const DARS26 = (() => {
  const lessonTitle = L("Ratsional sonlarni taqqoslash", 'Сравнение рациональных чисел');
  const slides = [
    title(
      lessonTitle,
      L("Bugun musbat va manfiy butun sonlar, kasrlar hamda o'nli kasrlarni koordinata chizig'i yordamida taqqoslashni o'rganamiz.", 'Сегодня научимся сравнивать положительные и отрицательные целые числа, дроби и десятичные дроби с помощью координатной прямой.'),
      L(
        "Bugungi mavzu ratsional sonlarni taqqoslash. Koordinata chizig'ida o'ngroqda joylashgan son kattaroq. Musbat son noldan va manfiy sondan katta, manfiy sonlarda esa nolga yaqin son kattaroq. Kasrlarni bir xil ko'rinishga keltirib taqqoslaymiz.",
        'Тема урока — сравнение рациональных чисел. На координатной прямой правее расположено большее число. Положительное число больше нуля и отрицательного, а среди отрицательных больше то, которое ближе к нулю. Дроби приведём к одному виду.',
      ),
      { type: 'cards', items: ['−2', { label: '−1', color: 'blue' }, { label: '0', color: 'yellow' }, { label: '1/2', color: 'green' }, '3'] },
    ),
    question({
      scored: false,
      eyebrow: L('Kirish savoli', 'Вводный вопрос'),
      title: L("Qaysi harorat yuqori?", 'Какая температура выше?'),
      prompt: L("Bir shaharda −2 daraja, boshqasida 3 daraja. Qaysi son kattaroq?", 'В одном городе −2 градуса, в другом 3 градуса. Какое число больше?'),
      intro: L(
        "Minus ikki noldan chapda, uch esa noldan o'ngda. Koordinata chizig'ida o'ngroqda turgan son kattaroq.",
        'Минус два находится слева от нуля, а три — справа. На координатной прямой число правее больше.',
      ),
      options: ['−2', '0', '3', L('Teng', 'Равны')],
      correct: 2,
      why: lines(
        ["Har qanday musbat son har qanday manfiy sondan katta.", 'Любое положительное число больше любого отрицательного.'],
        ["Shuning uchun 3 > −2.", 'Поэтому 3 > −2.'],
      ),
      wrong: L("Sonlarni koordinata chizig'ida tasavvur qiling: o'ngdagi son kattaroq.", 'Представьте числа на координатной прямой: число справа больше.'),
      visual: { type: 'numberLine', points: [{ at: 25, label: '−2' }, { at: 72, label: '3' }] },
    }),
    info(
      L("Asosiy taqqoslash qoidasi", 'Главное правило сравнения'),
      lines(
        ["Koordinata chizig'ida o'ngroqda joylashgan son kattaroq.", 'На координатной прямой число, расположенное правее, больше.'],
        ["Chap tomondagi son kichikroq.", 'Число слева меньше.'],
        ["a soni b dan chapda bo'lsa, a < b deb yozamiz.", 'Если a расположено левее b, записываем a < b.'],
      ),
      { type: 'numberLine', points: [{ at: 18, label: 'a' }, { at: 76, label: 'b' }] },
      L('Koordinata chizig‘i', 'Координатная прямая'),
    ),
    rule(
      L("Ishoralar bo'yicha tezkor qoida", 'Быстрое правило по знакам'),
      lines(
        ["Musbat son noldan va har qanday manfiy sondan katta.", 'Положительное число больше нуля и любого отрицательного числа.'],
        ["Nol har qanday manfiy sondan katta, lekin musbat sondan kichik.", 'Ноль больше любого отрицательного, но меньше положительного числа.'],
        ["Ikki manfiy sondan moduli kichik, ya'ni nolga yaqinrog'i kattaroq.", 'Из двух отрицательных чисел больше то, чей модуль меньше, то есть которое ближе к нулю.'],
      ),
      { type: 'chain', items: ['−5', '−2', '0', '3'], connector: '<' },
    ),
    info(
      L("Manfiy sonlarni taqqoslash", 'Сравнение отрицательных чисел'),
      lines(
        ["−1 soni −4 ga qaraganda nolga yaqinroq.", 'Число −1 ближе к нулю, чем −4.'],
        ["Shuning uchun −1 > −4.", 'Поэтому −1 > −4.'],
        ["Manfiy sonlarda modul katta bo'lsa, sonning o'zi kichikroq bo'ladi.", 'Среди отрицательных чисел число с большим модулем меньше.'],
      ),
      { type: 'numberLine', points: [{ at: 18, label: '−4' }, { at: 42, label: '−1' }, { at: 52, label: '0' }] },
    ),
    question({
      title: L("−4 va −1 ni taqqoslang", 'Сравните −4 и −1'),
      prompt: L("Qaysi tengsizlik to'g'ri?", 'Какое неравенство верно?'),
      intro: L(
        "Ikki son ham manfiy. Nolga yaqinroq bo'lgan minus bir koordinata chizig'ida o'ngroqda va kattaroq.",
        'Оба числа отрицательные. Минус один ближе к нулю, расположен правее и поэтому больше.',
      ),
      options: ['−4 > −1', '−4 = −1', '−4 < −1', '0 < −1'],
      correct: 2,
      why: lines(
        ["−4 koordinata chizig'ida −1 dan chapda.", '−4 находится левее −1 на координатной прямой.'],
        ["Shuning uchun −4 < −1.", 'Поэтому −4 < −1.'],
      ),
      wrong: L("Manfiy sonlardan nolga yaqinrog'i kattaroq.", 'Из отрицательных чисел больше то, которое ближе к нулю.'),
      visual: { type: 'numberLine', points: [{ at: 18, label: '−4' }, { at: 58, label: '−1' }, { at: 70, label: '0' }] },
    }),
    info(
      L("Kasrlarni bir xil ko'rinishga keltiring", 'Приводите дроби к одному виду'),
      lines(
        ["Oddiy va o'nli kasrlarni taqqoslashdan oldin ularni bir xil ko'rinishda yozish qulay.", 'Перед сравнением обыкновенной и десятичной дроби удобно записать их в одном виде.'],
        ["Masalan, −3/4 = −0,75.", 'Например, −3/4 = −0,75.'],
        ["Endi −0,75 va −0,6 ni taqqoslaymiz: −0,6 nolga yaqin, demak kattaroq.", 'Теперь сравниваем −0,75 и −0,6: −0,6 ближе к нулю, значит больше.'],
      ),
      { type: 'chain', items: ['−3/4', '−0,75', '<', '−0,6'] },
      undefined,
      {
        uz: ["Oddiy va o'nli kasrlarni taqqoslashdan oldin ularni bir xil ko'rinishda yozish qulay.", "Masalan, minus to'rtdan uch teng minus nol butun yuzdan yetmish besh.", "Minus nol butun yuzdan yetmish besh va minus nol butun o'ndan oltini taqqoslaymiz. Minus nol butun o'ndan olti nolga yaqin va kattaroq."],
        ru: ['Перед сравнением обыкновенной и десятичной дроби удобно записать их в одном виде.', 'Например, минус три четвёртых равны минус нулю целым семидесяти пяти сотым.', 'Сравним минус ноль целых семьдесят пять сотых и минус ноль целых шесть десятых. Второе число ближе к нулю и больше.'],
      },
    ),
    question({
      title: L("−0,7 va −0,3 ni taqqoslang", 'Сравните −0,7 и −0,3'),
      prompt: L("Qaysi son kattaroq?", 'Какое число больше?'),
      intro: L(
        "Ikkala son ham manfiy. Minus nol butun o'ndan uch nolga yaqinroq, shuning uchun koordinata chizig'ida o'ngroqda.",
        'Оба числа отрицательные. Минус ноль целых три десятых ближе к нулю и поэтому расположено правее.',
      ),
      options: ['−0,7', '−0,3', '0,7', L('Teng', 'Равны')],
      correct: 1,
      why: lines(
        ["|−0,3| = 0,3 soni |−0,7| = 0,7 dan kichik.", '|−0,3| = 0,3 меньше, чем |−0,7| = 0,7.'],
        ["Manfiy sonlardan moduli kichikrog'i kattaroq: −0,3 > −0,7.", 'Из отрицательных чисел больше число с меньшим модулем: −0,3 > −0,7.'],
      ),
      wrong: L("Manfiy sonlarda nolga yaqinroq son kattaroq.", 'Среди отрицательных чисел больше то, которое ближе к нулю.'),
      visual: { type: 'numberLine', points: [{ at: 24, label: '−0,7' }, { at: 56, label: '−0,3' }, { at: 78, label: '0' }] },
    }),
    question({
      title: L("−2/3 va −3/4 ni taqqoslang", 'Сравните −2/3 и −3/4'),
      prompt: L("Qaysi kasr kattaroq?", 'Какая дробь больше?'),
      intro: L(
        "Kasrlarni o'nli ko'rinishda taxmin qilamiz. Minus uchdan ikki taxminan minus nol butun yuzdan oltmish yetti, minus to'rtdan uch esa minus nol butun yuzdan yetmish besh. Nolga yaqinini tanlang.",
        'Оценим дроби десятичными числами. Минус две трети примерно равны минус нулю целым шестидесяти семи сотым, а минус три четверти — минус нулю целым семидесяти пяти сотым. Выберите число ближе к нулю.',
      ),
      options: ['−2/3', '−3/4', '0', L('Teng', 'Равны')],
      correct: 0,
      why: lines(
        ["−2/3 ≈ −0,67, −3/4 = −0,75.", '−2/3 ≈ −0,67, −3/4 = −0,75.'],
        ["−0,67 nolga yaqinroq, demak −2/3 > −3/4.", '−0,67 ближе к нулю, значит −2/3 > −3/4.'],
      ),
      wrong: L("Ikkala kasrni o'nli kasrga aylantirib, nolga yaqinini toping.", 'Переведите обе дроби в десятичные и найдите ближайшую к нулю.'),
      visual: { type: 'chain', items: ['−2/3 ≈ −0,67', '−3/4 = −0,75'] },
    }),
    info(
      L("Bir nechta sonni tartiblash", 'Упорядочивание нескольких чисел'),
      lines(
        ["Avval manfiy, nol va musbat sonlarni guruhlarga ajrating.", 'Сначала разделите числа на отрицательные, ноль и положительные.'],
        ["Manfiy sonlarni nolga uzoqligiga qarab: uzoqrog'i kichikroq.", 'Отрицательные числа располагайте по расстоянию от нуля: более далёкое меньше.'],
        ["Musbat sonlarni odatdagi tartibda yozing va barcha guruhlarni birlashtiring.", 'Положительные числа расположите в обычном порядке и объедините группы.'],
      ),
      { type: 'chain', items: ['−1,2', '−3/4', '0', '1/2', '2'] , connector: '<' },
    ),
    multi({
      title: L("−1 dan katta sonlarni belgilang", 'Отметьте числа, большие −1'),
      intro: L(
        "Koordinata chizig'ida minus birdan o'ngda joylashadigan barcha sonlarni belgilang.",
        'Отметьте все числа, расположенные правее минус единицы на координатной прямой.',
      ),
      options: ['−1,5', '−0,5', '0', '2'],
      correctSet: [1, 2, 3],
      why: lines(
        ["−0,5, 0 va 2 sonlari −1 dan o'ngda.", '−0,5, 0 и 2 расположены правее −1.'],
        ["−1,5 soni −1 dan chapda va kichikroq.", '−1,5 находится левее −1 и меньше него.'],
      ),
      wrong: L("−1 ni chiziqda belgilang va undan o'ngdagi sonlarni tanlang.", 'Отметьте −1 на прямой и выберите числа справа от него.'),
    }),
    match({
      title: L("Sonlar juftini to'g'ri belgi bilan juftlang", 'Соедините пару чисел с верным знаком'),
      prompt: L("Har bir juftlikda chapdagi va o'ngdagi sonni taqqoslang.", 'Сравните левое и правое число в каждой паре.'),
      intro: L(
        "Sonlarni koordinata chizig'ida tasavvur qiling yoki bir xil ko'rinishga keltiring. So'ng mos tengsizlik bilan juftlang.",
        'Представьте числа на координатной прямой или приведите их к одному виду. Затем соедините с верным неравенством.',
      ),
      rows: [
        { left: '−5 va −2', correct: L('−5 < −2', '−5 < −2') },
        { left: '−0,4 va 0', correct: L('−0,4 < 0', '−0,4 < 0') },
        { left: '1/2 va 0,4', correct: L('1/2 > 0,4', '1/2 > 0,4') },
      ],
      why: lines(
        ["−5 noldan uzoqroq, har qanday manfiy son noldan kichik.", '−5 дальше от нуля, а любое отрицательное число меньше нуля.'],
        ["1/2 = 0,5, shuning uchun 0,5 > 0,4.", '1/2 = 0,5, поэтому 0,5 > 0,4.'],
      ),
      wrong: L("Kasrlarni kerak bo'lsa o'nli ko'rinishga aylantiring.", 'При необходимости переведите дроби в десятичный вид.'),
    }),
    classify({
      title: L("Sonlarni noldan kichik va katta guruhga ajrating", 'Разделите числа относительно нуля'),
      prompt: L("Nolning o'zi berilmagan. Sonlarni ishorasi bo'yicha joylang.", 'Сам ноль не дан. Распределите числа по знаку.'),
      intro: L(
        "Manfiy ratsional sonlarni noldan kichik, musbat ratsional sonlarni noldan katta guruhga joylang.",
        'Отрицательные рациональные числа поместите в группу меньше нуля, положительные — в группу больше нуля.',
      ),
      binA: L('0 dan kichik', 'Меньше 0'),
      binB: L('0 dan katta', 'Больше 0'),
      cards: [{ label: '−2/3', value: true }, { label: '0,8', value: false }, { label: '−0,1', value: true }, { label: '5/4', value: false }],
      why: lines(
        ["−2/3 va −0,1 manfiy, demak noldan kichik.", '−2/3 и −0,1 отрицательны, значит меньше нуля.'],
        ["0,8 va 5/4 musbat, demak noldan katta.", '0,8 и 5/4 положительны, значит больше нуля.'],
      ),
      wrong: L("Son oldidagi minus ishorasiga e'tibor bering.", 'Обратите внимание на знак минус перед числом.'),
    }),
    question({
      eyebrow: L('Yakuniy topshiriq', 'Итоговое задание'),
      title: L("Sonlarni o'sish tartibida joylashtiring", 'Расположите числа по возрастанию'),
      prompt: L("−1,2; −3/4; 0,5 sonlarining to'g'ri tartibini toping.", 'Найдите правильный порядок чисел −1,2; −3/4; 0,5.'),
      intro: L(
        "Minus to'rtdan uch minus nol butun yuzdan yetmish beshga teng. Endi ikki manfiy sonning nolga uzoqligini va musbat nol butun o'ndan beshni taqqoslang.",
        'Минус три четверти равны минус нулю целым семидесяти пяти сотым. Сравните расстояния двух отрицательных чисел от нуля и положительное число ноль целых пять десятых.',
      ),
      options: ['−3/4 < −1,2 < 0,5', '−1,2 < −3/4 < 0,5', '0,5 < −3/4 < −1,2', '−1,2 < 0,5 < −3/4'],
      correct: 1,
      why: lines(
        ["−3/4 = −0,75. −1,2 soni −0,75 dan chapda va kichik.", '−3/4 = −0,75. Число −1,2 левее −0,75 и меньше.'],
        ["Har ikkala manfiy son 0,5 dan kichik. Tartib: −1,2 < −3/4 < 0,5.", 'Оба отрицательных числа меньше 0,5. Порядок: −1,2 < −3/4 < 0,5.'],
      ),
      wrong: L("−3/4 ni −0,75 ga aylantiring va sonlarni koordinata chizig'ida tasavvur qiling.", 'Замените −3/4 на −0,75 и представьте числа на координатной прямой.'),
      fact: L("Sonlarni tartiblash harorat, qarz, balandlik va statistik ma'lumotlarni solishtirishda kerak bo'ladi.", 'Упорядочивание чисел нужно для сравнения температуры, долгов, высот и статистических данных.'),
      factVisual: '−1,2 < −0,75 < 0,5',
      visual: { type: 'numberLine', points: [{ at: 14, label: '−1,2' }, { at: 34, label: '−3/4' }, { at: 76, label: '0,5' }] },
    }),
    summary(
      L("Ratsional sonlarni taqqoslay olasiz", 'Вы умеете сравнивать рациональные числа'),
      lines(
        ["Koordinata chizig'ida o'ngroqda turgan son kattaroq.", 'На координатной прямой число правее больше.'],
        ["Manfiy sonlardan nolga yaqinrog'i kattaroq.", 'Из отрицательных чисел больше то, которое ближе к нулю.'],
        ["Oddiy va o'nli kasrlarni taqqoslashdan oldin bir xil ko'rinishga keltiramiz.", 'Обыкновенные и десятичные дроби перед сравнением приводят к одному виду.'],
      ),
      L("Endi turli ko'rinishdagi musbat va manfiy ratsional sonlarni taqqoslab, tartiblay olasiz.", 'Теперь вы можете сравнивать и упорядочивать положительные и отрицательные рациональные числа в разных формах.'),
      L(
        "Dars yakunlandi. Koordinata chizig'ida o'ngdagi son kattaroq. Musbat son manfiy sondan katta. Ikki manfiy sondan nolga yaqinrog'i kattaroq. Turli kasrlarni esa avval bir xil ko'rinishga keltiramiz.",
        'Урок завершён. На координатной прямой число справа больше. Положительное число больше отрицательного. Из двух отрицательных больше ближайшее к нулю. Дроби разных видов сначала приводим к одному виду.',
      ),
    ),
  ];
  return makeLesson({ id: 'rational_compare_6_26', title: lessonTitle, decorations: ['−3/4', '−0,75', '0', '1/2', '−1,2', '0,5'], slides });
})();

export const GRADE6_THEORY_16_26 = {
  16: DARS16,
  17: DARS17,
  18: DARS18,
  19: DARS19,
  20: DARS20,
  21: DARS21,
  22: DARS22,
  23: DARS23,
  24: DARS24,
  25: DARS25,
  26: DARS26,
};
