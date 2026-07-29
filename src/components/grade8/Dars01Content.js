export const SUPPORTED_LANGS = ['uz', 'ru', 'en'];

export const TTS_LOCALES = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-GB',
};

export const L = (uz, ru, en) => ({ uz, ru, en });

export const UI = {
  back: L('Orqaga', 'Назад', 'Back'),
  next: L('Davom etish', 'Далее', 'Continue'),
  check: L('Tekshirish', 'Проверить', 'Check'),
  retry: L('Qayta urinib ko‘ring', 'Попробовать снова', 'Try again'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish lesson'),
  restart: L('Qaytadan boshlash', 'Начать заново', 'Start again'),
  listen: L('Tinglash', 'Прослушать', 'Listen'),
  replay: L('Qayta tinglash', 'Повторить', 'Replay'),
  soundOn: L('Ovozni yoqish', 'Включить звук', 'Turn sound on'),
  soundOff: L('Ovozni o‘chirish', 'Выключить звук', 'Turn sound off'),
  correct: L('To‘g‘ri', 'Верно', 'Correct'),
  hint: L('Maslahat', 'Подсказка', 'Hint'),
  review: L('Yana tekshiring', 'Проверь ещё раз', 'Check again'),
  undefined: L('Aniqlanmagan', 'Не определено', 'Undefined'),
  allowed: L('Mumkin', 'Допустимо', 'Allowed'),
  excluded: L('Mumkin emas', 'Запрещено', 'Excluded'),
  numerator: L('Surat', 'Числитель', 'Numerator'),
  denominator: L('Maxraj', 'Знаменатель', 'Denominator'),
  select: L('Tanlang', 'Выбери', 'Select'),
  clear: L('Tozalash', 'Очистить', 'Clear'),
  saved: L('Saqlandi', 'Сохранено', 'Saved'),
  language: L('Dars tili', 'Язык урока', 'Lesson language'),
  progress: L('Dars jarayoni', 'Прогресс урока', 'Lesson progress'),
  candidateValues: L('Tekshiriladigan qiymatlar', 'Проверяемые значения', 'Candidate values'),
  excludedValue: L('Mumkin bo‘lmagan qiymat', 'Недопустимое значение', 'Excluded value'),
};

export const META = {
  lessonId: 'g8-l01-rational-expressions',
  title: L(
    '1-dars. Ratsional ifodalar va ratsional kasrlar',
    'Урок 1. Рациональные выражения и рациональные дроби',
    'Lesson 1. Rational expressions and rational fractions',
  ),
  module: L('Formulalarning to‘g‘riligi', 'Корректность формул', 'Formula validity'),
};

export const SCREENS = [
  {
    id: 's0-problem',
    type: 'problem',
    eyebrow: L('MUAMMO', 'ПРОБЛЕМА', 'PROBLEM'),
    title: L(
      'Nega formula o‘zgaruvchining har bir qiymatini qabul qilmaydi?',
      'Почему формула принимает не каждое значение переменной?',
      'Why does the formula not accept every value of the variable?',
    ),
    lead: L(
      'Formulani tekshirishda hisoblab bo‘lmaydigan kirish qiymati topildi. Uni aniqlang va matematik sababini tushuntiring.',
      'При проверке формулы обнаружено входное значение, при котором расчёт невозможен. Найди его и объясни математическую причину.',
      'Testing the formula revealed an input value for which the calculation is impossible. Find it and explain the mathematical reason.',
    ),
    action: L('Formulani tadqiq qilish', 'Исследовать формулу', 'Investigate the formula'),
    audio: L(
      'Ka iks teng kasrga: suratda ikki iks qo‘shilgan bir, maxrajda iks ayirilgan uch. Formulani hisoblab bo‘lmaydigan qiymatni toping va sababini tushuntiring.',
      'Ка от икс равно дроби: два икс плюс один в числителе, икс минус три в знаменателе. Найди значение, при котором формулу нельзя вычислить, и объясни причину.',
      'K of x equals the fraction with two x plus one in the numerator and x minus three in the denominator. Find the value for which the formula cannot be calculated, and explain why.',
    ),
  },
  {
    id: 's1-prereq',
    type: 'diagnostic',
    eyebrow: L('ZARUR BILIMLAR', 'ЧТО УЖЕ ИЗВЕСТНО', 'SKILLS CHECK'),
    title: L(
      'Kerakli bilimlarni tekshiring',
      'Проверь необходимые знания',
      'Check the skills you need',
    ),
    lead: L(
      'Uchta qisqa topshiriqni bajaring. Bu yangi mavzu bo‘yicha baho emas.',
      'Выполни три коротких задания. Это не оценка по новой теме.',
      'Complete three short tasks. This is not a test on the new topic.',
    ),
    prompts: [
      L('Ifodaning qiymatini toping.', 'Найди значение выражения.', 'Find the value of the expression.'),
      L('Kasrning maxrajini ko‘rsating.', 'Укажи знаменатель дроби.', 'Identify the denominator of the fraction.'),
      L('Iksni toping.', 'Найди икс.', 'Solve for x.'),
    ],
    success: L(
      'Kerakli uchta vosita tayyor: qiymatni hisoblash, maxrajni topish va sodda tenglamani yechish.',
      'Три необходимых инструмента готовы: вычисление значения, определение знаменателя и решение простого уравнения.',
      'The three required tools are ready: evaluating an expression, identifying a denominator, and solving a simple equation.',
    ),
    hints: [
      L('Har bir topshiriqda faqat bitta qisqa qadam bor.', 'В каждом задании нужен только один короткий шаг.', 'Each task requires only one short step.'),
      L('Iks o‘rniga 2 ni qo‘ying, kasr chizig‘i ostiga qarang va tenglikning ikki tomoniga 3 ni qo‘shing.', 'Подставь 2 вместо икс, посмотри под дробную черту и прибавь 3 к обеим частям равенства.', 'Substitute 2 for x, look below the fraction bar, and add 3 to both sides of the equation.'),
    ],
    audio: L(
      'Yangi g‘oyani o‘rganishdan oldin uchta kerakli ko‘nikmani tekshiramiz: qiymatni hisoblash, maxrajni topish va sodda tenglamani yechish.',
      'Перед новой идеей проверим три необходимых навыка: вычисление значения, определение знаменателя и решение простого уравнения.',
      'Before studying the new idea, check three required skills: evaluating an expression, identifying a denominator, and solving a simple equation.',
    ),
  },
  {
    id: 's2-structure',
    type: 'exploration',
    eyebrow: L('TUZILISH', 'НАБЛЮДЕНИЕ', 'STRUCTURE'),
    title: L(
      'Ifodalarni ikki guruhga ajrating',
      'Раздели выражения на две группы',
      'Sort the expressions into two groups',
    ),
    lead: L(
      'Har bir ifodada maxrajda o‘zgaruvchi bor yoki yo‘qligini tekshiring.',
      'Проверь, есть ли переменная в знаменателе каждого выражения.',
      'Check whether each expression has a variable in its denominator.',
    ),
    groups: [
      L('Maxrajda o‘zgaruvchi yo‘q', 'В знаменателе нет переменной', 'No variable in the denominator'),
      L('Maxrajda o‘zgaruvchi bor', 'В знаменателе есть переменная', 'A variable is in the denominator'),
    ],
    success: L(
      'Ikkinchi guruhdagi ifodalar uchun bo‘lish amalini bajarish mumkinligini alohida tekshirish kerak.',
      'Для выражений второй группы нужно отдельно проверять, можно ли выполнить деление.',
      'For expressions in the second group, you must check separately whether the division can be performed.',
    ),
    hints: [
      L('Kasr chizig‘i ostidagi qismga qarang.', 'Смотри на часть под дробной чертой.', 'Look at the part below the fraction bar.'),
      L('O‘zgaruvchi maxrajda qatnashgan ikki ifodani toping.', 'Найди два выражения, где переменная находится в знаменателе.', 'Find the two expressions with a variable in the denominator.'),
    ],
    audio: L(
      'Ifodalarni tuzilishiga qarab ajrating. Asosiy belgi — o‘zgaruvchi maxrajda qatnashganmi yoki yo‘qmi.',
      'Раздели выражения по структуре. Главный признак — находится ли переменная в знаменателе.',
      'Sort the expressions by structure. The key feature is whether a variable appears in the denominator.',
    ),
  },
  {
    id: 's3-hypothesis',
    type: 'hypothesis',
    eyebrow: L('GIPOTEZA', 'ГИПОТЕЗА', 'HYPOTHESIS'),
    title: L(
      'Qaysi qiymat hisoblashni imkonsiz qilishi mumkin?',
      'Какое значение может сделать вычисление невозможным?',
      'Which value might make the calculation impossible?',
    ),
    lead: L(
      'Qiymat va ehtimoliy sababni tanlang. Hozircha bu baholanmaydigan taxmin.',
      'Выбери значение и возможную причину. Пока это неоцениваемое предположение.',
      'Choose a value and a possible reason. For now, this is an unscored prediction.',
    ),
    reasons: [
      L('Surat nolga teng bo‘ladi', 'Числитель станет равен нулю', 'The numerator will equal zero'),
      L('Maxraj nolga teng bo‘ladi', 'Знаменатель станет равен нулю', 'The denominator will equal zero'),
      L('Natija manfiy bo‘ladi', 'Результат станет отрицательным', 'The result will be negative'),
      L('O‘zgaruvchi ikki marta qatnashgan', 'Переменная встречается дважды', 'The variable appears twice'),
    ],
    action: L('Gipotezani saqlash', 'Сохранить гипотезу', 'Save hypothesis'),
    success: L(
      'Gipoteza saqlandi. Endi uni qiymatlar yordamida tekshiring.',
      'Гипотеза сохранена. Теперь проверь её на значениях.',
      'Hypothesis saved. Now test it using values.',
    ),
    audio: L(
      'Hisoblamasdan oldin taxmin qiling. Qaysi qiymat muammo tug‘dirishi mumkin va ifodaning qaysi qismini avval tekshirish kerak?',
      'Сделай прогноз до вычисления. Какое значение может вызвать проблему и какую часть выражения нужно проверить первой?',
      'Make a prediction before calculating. Which value might cause a problem, and which part of the expression should be checked first?',
    ),
  },
  {
    id: 's4-value-lab',
    type: 'exploration',
    eyebrow: L('TAJRIBA', 'ЭКСПЕРИМЕНТ', 'EXPERIMENT'),
    title: L('Qiymatlar jadvalini to‘ldiring', 'Заполни таблицу значений', 'Complete the value table'),
    lead: L(
      'Har bir iks qiymatini tanlang. Surat, maxraj va natija qanday o‘zgarishini kuzating.',
      'Выбирай каждое значение икс. Следи, как меняются числитель, знаменатель и результат.',
      'Select each value of x. Observe how the numerator, denominator, and result change.',
    ),
    undefined: L(
      'Maxraj 0 ga teng. Nolga bo‘lish aniqlanmagan.',
      'Знаменатель равен 0. Деление на ноль не определено.',
      'The denominator equals 0. Division by zero is undefined.',
    ),
    success: L(
      'Jadval to‘ldirildi. Faqat iks uchga teng bo‘lganda hisoblashni bajarib bo‘lmaydi.',
      'Таблица заполнена. Только при икс, равном трём, вычисление выполнить невозможно.',
      'The table is complete. The calculation is impossible only when x equals three.',
    ),
    hints: [
      L('To‘rtta qiymatning barchasini tekshiring.', 'Проверь все четыре значения.', 'Test all four values.'),
      L('Nolga teng bo‘lgan maxrajli qatorni tanlang.', 'Выбери строку с нулевым знаменателем.', 'Choose the row with a zero denominator.'),
    ],
    audio: L(
      'To‘rtta qiymatni tekshiring. Iks uchga teng bo‘lganda surat yettiga, maxraj esa nolga teng bo‘ladi. Nolga bo‘lish aniqlanmagan.',
      'Проверь четыре значения. При икс, равном трём, числитель равен семи, а знаменатель — нулю. Деление на ноль не определено.',
      'Test all four values. When x equals three, the numerator equals seven and the denominator equals zero. Division by zero is undefined.',
    ),
  },
  {
    id: 's5-boundary',
    type: 'contrast',
    eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'BOUNDARY CASE'),
    title: L('Ikki xil nol', 'Два разных нуля', 'Two different zeros'),
    lead: L(
      'Iks uchga teng bo‘lganda ikkala ifodani solishtiring.',
      'Сравни оба выражения при икс, равном трём.',
      'Compare both expressions when x equals three.',
    ),
    questionDefined: L('Qaysi ifoda aniqlangan?', 'Какое выражение определено?', 'Which expression is defined?'),
    questionUndefined: L('Qaysi ifoda aniqlanmagan?', 'Какое выражение не определено?', 'Which expression is undefined?'),
    success: L(
      'Nolli surat kasrning qiymatini nol qiladi. Nolli maxraj esa bo‘lishni aniqlanmagan qiladi.',
      'Нулевой числитель делает значение дроби равным нулю. Нулевой знаменатель делает деление неопределённым.',
      'A zero numerator makes the value of the fraction zero. A zero denominator makes the division undefined.',
    ),
    hints: [
      L('Nol bo‘lib turgan qismning o‘rnini solishtiring.', 'Сравни положение нуля.', 'Compare the position of zero.'),
      L('Nolga bo‘lish qaysi ifodada talab qilinadi?', 'В каком выражении требуется деление на ноль?', 'Which expression requires division by zero?'),
    ],
    audio: L(
      'Nolning o‘rni muhim. Suratdagi nol ruxsat etiladi va kasrning qiymati nol bo‘ladi. Maxrajdagi nol esa nolga bo‘lishni talab qiladi.',
      'Положение нуля имеет значение. Ноль в числителе допустим и даёт значение ноль. Ноль в знаменателе требует деления на ноль.',
      'The position of zero matters. Zero in the numerator is allowed and gives a value of zero. Zero in the denominator requires division by zero.',
    ),
  },
  {
    id: 's6-discovery',
    type: 'discovery',
    eyebrow: L('QONUNIYAT', 'ЗАКОНОМЕРНОСТЬ', 'PATTERN'),
    title: L('Shartni tuzing', 'Собери условие', 'Build the condition'),
    lead: L(
      'Taqiqlangan qiymatni topish qadamlarini to‘g‘ri tartibga joylashtiring.',
      'Расположи шаги поиска запрещённого значения в правильном порядке.',
      'Put the steps for finding an excluded value in the correct order.',
    ),
    steps: [
      L('Maxrajni toping', 'Найти знаменатель', 'Identify the denominator'),
      L('Maxraj qachon 0 bo‘lishini toping', 'Найти, когда знаменатель равен 0', 'Find when the denominator equals 0'),
      L('Topilgan qiymatni chiqarib tashlang', 'Исключить найденное значение', 'Exclude the value found'),
    ],
    success: L(
      'Mumkin qiymatlar maxraj nolga teng bo‘lmasligi sharti bilan aniqlanadi.',
      'Допустимые значения определяются условием, что знаменатель не равен нулю.',
      'Permissible values are determined by the condition that the denominator is not zero.',
    ),
    hints: [
      L('Avval tekshiriladigan qismni toping.', 'Сначала найди проверяемую часть.', 'First identify the part to check.'),
      L('Tartib: qism, nolga tenglik, chiqarib tashlash.', 'Порядок: часть, равенство нулю, исключение.', 'Order: part, equality to zero, exclusion.'),
    ],
    audio: L(
      'Umumiy usulni tuzing: maxrajni toping, uning qachon nol bo‘lishini aniqlang va shu qiymatni mumkin qiymatlar orasidan chiqaring.',
      'Собери общий способ: найди знаменатель, определи, когда он равен нулю, и исключи это значение.',
      'Build the general method: identify the denominator, find when it equals zero, and exclude that value.',
    ),
  },
  {
    id: 's7-rule',
    type: 'rule',
    eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
    title: L('Aniq matematik atamalar', 'Точные математические термины', 'Precise mathematical terms'),
    lead: L(
      'Tadqiqotda topilgan tuzilishlarni aniq nomlaymiz.',
      'Назовём точно структуры, найденные в исследовании.',
      'Let us name the structures found in the investigation precisely.',
    ),
    wholeLabel: L('Butun ratsional ifoda', 'Целое рациональное выражение', 'Polynomial expression'),
    fractionLabel: L('Ratsional kasr', 'Рациональная дробь', 'Rational expression'),
    wholeDefinition: L(
      'Maxrajida o‘zgaruvchi qatnashgan ifodaga bo‘lish yo‘q.',
      'Нет деления на выражение, содержащее переменную.',
      'There is no division by an expression containing a variable.',
    ),
    fractionDefinition: L(
      'A iks bo‘lingan B iks ko‘rinishida; B iks nolga teng emas.',
      'Имеет вид A от икс, делённое на B от икс; B от икс не равно нулю.',
      'It has the form A of x over B of x, where B of x is not zero.',
    ),
    instruction: L(
      'Har bir ifodani mos guruhga kiriting va uchinchi ifoda uchun taqiqlangan qiymatni toping.',
      'Отнеси каждое выражение к нужной группе и найди запрещённое значение для третьего выражения.',
      'Classify each expression and find the excluded value for the third expression.',
    ),
    success: L(
      'Birinchi ikki ifodaning maxrajida o‘zgaruvchi yo‘q. Uchinchi ifoda iks beshga teng bo‘lganda aniqlanmagan.',
      'В знаменателях первых двух выражений нет переменной. Третье выражение не определено при икс, равном пяти.',
      'The first two expressions have no variable in a denominator. The third expression is undefined when x equals five.',
    ),
    hints: [
      L('Maxrajda o‘zgaruvchi qatnashganini tekshiring.', 'Проверь, содержится ли переменная в знаменателе.', 'Check whether a denominator contains a variable.'),
      L('Uchinchi ifodada iks ayirilgan besh nolga teng bo‘ladigan qiymatni toping.', 'Для третьего выражения найди, когда икс минус пять равно нулю.', 'For the third expression, find when x minus five equals zero.'),
    ],
    audio: L(
      'Agar maxrajda o‘zgaruvchi bo‘lmasa, bu butun ratsional ifodadir. Ratsional kasrda maxraj nolga teng bo‘lishi mumkin emas.',
      'Если в знаменателе нет переменной, это целое рациональное выражение. В рациональной дроби знаменатель не может быть равен нулю.',
      'If no denominator contains a variable, the expression can be written as a polynomial expression. In a rational expression written as a fraction, the denominator cannot equal zero.',
    ),
  },
  {
    id: 's8-worked',
    type: 'worked',
    eyebrow: L('TAHLIL', 'РАЗБОР', 'WALKTHROUGH'),
    title: L(
      'Taqiqlangan qiymatni bosqichma-bosqich toping',
      'Найди запрещённое значение по шагам',
      'Find the excluded value step by step',
    ),
    lead: L(
      'Birinchi tekshiriladigan qismni va yakuniy qiymatni tanlang.',
      'Выбери часть, которую нужно проверить первой, и итоговое значение.',
      'Choose the part to check first and the final excluded value.',
    ),
    success: L(
      'Iks qo‘shilgan to‘rt nolga teng bo‘lganda iks minus to‘rtga teng, shuning uchun minus to‘rt taqiqlanadi.',
      'При икс плюс четыре, равном нулю, икс равен минус четырём, поэтому минус четыре исключается.',
      'When x plus four equals zero, x equals negative four, so negative four is excluded.',
    ),
    hints: [
      L('Cheklovni surat emas, maxraj yaratadi.', 'Ограничение создаёт знаменатель, а не числитель.', 'The denominator, not the numerator, creates the restriction.'),
      L('Iks qo‘shilgan to‘rt nolga teng bo‘lsa, iks nechaga teng?', 'Если икс плюс четыре равно нулю, чему равен икс?', 'If x plus four equals zero, what is x?'),
    ],
    audio: L(
      'Maxraj iks qo‘shilgan to‘rt. U nolga teng bo‘lmasligi kerak. Iks qo‘shilgan to‘rt nolga teng bo‘lganda iks minus to‘rtga teng.',
      'Знаменатель — икс плюс четыре. Он не должен быть равен нулю. Равенство икс плюс четыре нулю даёт икс равно минус четырём.',
      'The denominator is x plus four. It must not equal zero. Solving x plus four equals zero gives x equals negative four.',
    ),
  },
  {
    id: 's9-guided',
    type: 'guided',
    eyebrow: L('TAYANCH BILAN TEKSHIRUV', 'ПРОВЕРКА С ОПОРОЙ', 'GUIDED CHECK'),
    title: L(
      'Shartni va taqiqlangan qiymatni to‘ldiring',
      'Заполни условие и запрещённое значение',
      'Complete the condition and excluded value',
    ),
    lead: L('Mos belgini va sonni kiriting.', 'Вставь подходящий знак и число.', 'Enter the correct sign and number.'),
    success: L(
      'Ikki iks ayirilgan olti nolga teng emas, shuning uchun iks uchga teng emas.',
      'Два икс минус шесть не равно нулю, поэтому икс не равно трём.',
      'Two x minus six is not zero, so x is not equal to three.',
    ),
    hints: [
      L('Ikki iks ayirilgan olti qachon nolga teng bo‘lishini toping.', 'Найди, когда два икс минус шесть равно нулю.', 'Find when two x minus six equals zero.'),
      L('Ikki iks oltiga teng. Endi iksni toping.', 'Два икс равно шести. Теперь найди икс.', 'Two x equals six. Now solve for x.'),
    ],
    audio: L(
      'Maxraj ikki iks ayirilgan olti. U nolga teng bo‘lmasligi kerak. Maxrajni nolga tenglashtirib, chiqarib tashlanadigan qiymatni toping.',
      'Знаменатель — два икс минус шесть. Он не должен быть равен нулю. Приравняй знаменатель к нулю и найди исключаемое значение.',
      'The denominator is two x minus six. It must not equal zero. Set the denominator equal to zero and find the value to exclude.',
    ),
  },
  {
    id: 's10-strategy',
    type: 'strategy',
    eyebrow: L('USUL TANLASH', 'ВЫБОР СПОСОБА', 'STRATEGY'),
    title: L(
      'Qaysi usul barcha qiymatlarni hisobga oladi?',
      'Какой способ учитывает все значения?',
      'Which method accounts for every value?',
    ),
    methodA: L(
      'Nol, bir, ikki, uch, to‘rt va keyingi qiymatlarni birma-bir qo‘yish.',
      'Подставлять ноль, один, два, три, четыре и следующие значения по очереди.',
      'Substitute zero, one, two, three, four, and later values one at a time.',
    ),
    methodB: L(
      'Uch iks ayirilgan to‘qqiz nolga teng tenglamani yechish.',
      'Решить уравнение три икс минус девять равно нулю.',
      'Solve the equation three x minus nine equals zero.',
    ),
    success: L(
      'B usul to‘liq: uch iks ayirilgan to‘qqiz faqat iks uchga teng bo‘lganda nol bo‘ladi.',
      'Способ B полный: три икс минус девять равно нулю только при икс, равном трём.',
      'Method B is complete: three x minus nine equals zero only when x equals three.',
    ),
    hints: [
      L('Sonlar cheksiz ko‘p. Birma-bir tekshirish barcha qiymatlarni qamramaydi.', 'Чисел бесконечно много. Проверка по одному не охватывает все значения.', 'There are infinitely many numbers. Testing one at a time does not cover every value.'),
      L('Maxrajni nolga tenglashtirish to‘liq xulosa beradi.', 'Приравнивание знаменателя к нулю даёт полный вывод.', 'Setting the denominator equal to zero gives a complete conclusion.'),
    ],
    audio: L(
      'Qiymatlarni birma-bir tekshirish mumkin, lekin sonlar cheksiz ko‘p. Maxrajni nolga tenglashtirish to‘liq va ishonchli usul beradi.',
      'Можно проверять значения по одному, но чисел бесконечно много. Приравнивание знаменателя к нулю даёт полный и надёжный способ.',
      'Values can be tested one by one, but there are infinitely many numbers. Setting the denominator equal to zero gives a complete and reliable method.',
    ),
  },
  {
    id: 's11-independent',
    type: 'independent',
    eyebrow: L('MUSTAQIL', 'САМОСТОЯТЕЛЬНО', 'INDEPENDENT'),
    title: L(
      'Ifodaning turini va cheklovini aniqlang',
      'Определи тип выражения и ограничение',
      'Identify the expression type and restriction',
    ),
    lead: L(
      'Har bir ifodani tasniflang. Bo‘lish bilan bog‘liq taqiqlangan qiymat bo‘lsa, uni kiriting.',
      'Классифицируй каждое выражение. Если есть запрещённое из-за деления значение, введи его.',
      'Classify each expression. If division creates an excluded value, enter it.',
    ),
    success: L(
      'Birinchi ifodada bo‘lishdan kelib chiqadigan cheklov yo‘q. Ikkinchi ifoda iks beshga teng bo‘lganda aniqlanmagan.',
      'В первом выражении нет ограничений из-за деления. Второе выражение не определено при икс, равном пяти.',
      'The first expression has no restriction caused by division. The second is undefined when x equals five.',
    ),
    hints: [
      L('Maxrajda o‘zgaruvchi qatnashgan ifodani toping.', 'Найди выражение с переменной в знаменателе.', 'Find the expression with a variable in the denominator.'),
      L('Iks ayirilgan besh qachon nolga teng?', 'Когда икс минус пять равно нулю?', 'When does x minus five equal zero?'),
    ],
    audio: L(
      'Ikki ifodani mustaqil tasniflang. Tashqi ko‘rinishiga emas, maxrajda o‘zgaruvchi borligiga e’tibor bering.',
      'Самостоятельно классифицируй два выражения. Смотри не только на внешний вид, а на наличие переменной в знаменателе.',
      'Classify two expressions independently. Do not rely only on appearance; check whether a variable occurs in a denominator.',
    ),
  },
  {
    id: 's12-error',
    type: 'error',
    eyebrow: L('MODEL XATOSI', 'ОШИБКА МОДЕЛИ', 'MODEL ERROR'),
    title: L(
      'Birinchi noto‘g‘ri xulosani toping',
      'Найди первый неверный вывод',
      'Find the first incorrect conclusion',
    ),
    lead: L(
      'Noto‘g‘ri qadamni belgilang va haqiqiy taqiqlangan qiymatni kiriting.',
      'Отметь неверный шаг и введи настоящее запрещённое значение.',
      'Mark the incorrect step and enter the actual excluded value.',
    ),
    statements: [
      L('Iks to‘rtga teng bo‘lganda surat nolga teng.', 'При икс, равном четырём, числитель равен нулю.', 'When x equals four, the numerator equals zero.'),
      L('Shuning uchun iks to‘rtga teng qiymat taqiqlangan.', 'Поэтому икс, равное четырём, — запрещённое значение.', 'Therefore, x equals four is an excluded value.'),
      L('Boshqa cheklovlar yo‘q.', 'Других ограничений нет.', 'There are no other restrictions.'),
    ],
    success: L(
      'Ikkinchi qadam noto‘g‘ri. Iks to‘rtga teng bo‘lganda kasr nolga teng va aniqlangan. Haqiqiy cheklov: iks minus ikki emas.',
      'Второй шаг неверен. При икс, равном четырём, дробь равна нулю и определена. Настоящее ограничение: икс не равно минус двум.',
      'Step two is incorrect. When x equals four, the fraction equals zero and is defined. The actual restriction is x is not equal to negative two.',
    ),
    hints: [
      L('Nolga teng bo‘lgan qism suratmi yoki maxrajmi?', 'Какая часть равна нулю: числитель или знаменатель?', 'Which part equals zero: the numerator or the denominator?'),
      L('Iks qo‘shilgan ikki nolga teng tenglamani yeching.', 'Реши уравнение икс плюс два равно нулю.', 'Solve the equation x plus two equals zero.'),
    ],
    audio: L(
      'Yechimning har bir qadamini tekshiring. Nolli surat ruxsat etilganini, cheklov esa maxrajdan kelib chiqishini eslang.',
      'Проверь каждый шаг решения. Вспомни, что нулевой числитель допустим, а ограничение возникает из знаменателя.',
      'Check each step of the solution. Remember that a zero numerator is allowed and that the restriction comes from the denominator.',
    ),
  },
  {
    id: 's13-reverse',
    type: 'reverse',
    eyebrow: L('KONSTRUKTOR', 'КОНСТРУКТОР', 'CONSTRUCTOR'),
    title: L(
      'Berilgan cheklovli ratsional kasr tuzing',
      'Построй рациональную дробь с заданным ограничением',
      'Build a rational expression with the given restriction',
    ),
    lead: L(
      'Iks minus ikkiga teng bo‘lganda aniqlanmagan kasr tuzing.',
      'Построй дробь, не определённую при икс, равном минус двум.',
      'Build an expression that is undefined when x equals negative two.',
    ),
    chooseNumerator: L('Suratni tanlang', 'Выбери числитель', 'Choose a numerator'),
    chooseDenominator: L('Maxrajni tanlang', 'Выбери знаменатель', 'Choose a denominator'),
    question: L(
      'Kasrning qaysi qismi cheklovni yaratadi?',
      'Какая часть дроби создаёт ограничение?',
      'Which part of the fraction creates the restriction?',
    ),
    success: L(
      'Iks qo‘shilgan ikki ham, ikki iks qo‘shilgan to‘rt ham iks minus ikkiga teng bo‘lganda nolga aylanadi. Cheklovni maxraj yaratadi.',
      'И икс плюс два, и два икс плюс четыре равны нулю при икс, равном минус двум. Ограничение создаёт знаменатель.',
      'Both x plus two and two x plus four equal zero when x equals negative two. The denominator creates the restriction.',
    ),
    hints: [
      L('Minus ikkini har bir maxrajga qo‘ying.', 'Подставь минус два в каждый знаменатель.', 'Substitute negative two into each denominator.'),
      L('Bir nechta maxraj to‘g‘ri bo‘lishi mumkin.', 'Правильных знаменателей может быть несколько.', 'More than one denominator may be correct.'),
    ],
    audio: L(
      'Teskari masalani yeching. Minus ikki qiymatini taqiqlaydigan maxrajni tanlang. Bir nechta to‘g‘ri tuzilma mavjud.',
      'Реши обратную задачу. Выбери знаменатель, который запрещает значение минус два. Правильных конструкций несколько.',
      'Solve the reverse problem. Choose a denominator that excludes negative two. More than one construction is correct.',
    ),
  },
  {
    id: 's14-transfer',
    type: 'transfer',
    eyebrow: L('YANGI MODEL', 'НОВАЯ МОДЕЛЬ', 'NEW MODEL'),
    title: L(
      'Yangi formulani mustaqil tekshiring',
      'Самостоятельно проверь новую формулу',
      'Check a new formula independently',
    ),
    lead: L(
      'Taqiqlangan pe qiymatini toping, pe o‘n ikkiga teng qiymatni tekshiring va farqni tushuntiring.',
      'Найди запрещённое значение пэ, проверь пэ, равное двенадцати, и объясни различие.',
      'Find the excluded value of p, check p equals twelve, and explain the difference.',
    ),
    allowedQuestion: L('Pe o‘n ikkiga teng bo‘lishi mumkinmi?', 'Допустимо ли пэ, равное двенадцати?', 'Is p equals twelve permissible?'),
    reasons: [
      L('Surat nolga teng, maxraj esa nol emas', 'Числитель равен нулю, а знаменатель — нет', 'The numerator is zero and the denominator is not'),
      L('Har qanday nol formulani aniqlanmagan qiladi', 'Любой ноль делает формулу неопределённой', 'Any zero makes the formula undefined'),
      L('Manfiy qiymatlar doimo taqiqlangan', 'Отрицательные значения всегда запрещены', 'Negative values are always excluded'),
    ],
    success: L(
      'Ikki pe qo‘shilgan sakkiz nolga tengligidan pe minus to‘rtga teng. Pe o‘n ikkiga teng bo‘lganda surat nol, maxraj o‘ttiz ikki, shuning uchun formula aniqlangan.',
      'Из равенства два пэ плюс восемь нулю получаем пэ равно минус четырём. При пэ, равном двенадцати, числитель равен нулю, знаменатель — тридцати двум, поэтому формула определена.',
      'Solving two p plus eight equals zero gives p equals negative four. When p equals twelve, the numerator is zero and the denominator is thirty-two, so the formula is defined.',
    ),
    hints: [
      L('Avval ikki pe qo‘shilgan sakkiz nolga teng tenglamani yeching.', 'Сначала реши уравнение два пэ плюс восемь равно нулю.', 'Solve two p plus eight equals zero first.'),
      L('Pe o‘n ikkiga teng bo‘lganda surat va maxrajni alohida hisoblang.', 'При пэ, равном двенадцати, вычисли числитель и знаменатель отдельно.', 'When p equals twelve, calculate the numerator and denominator separately.'),
      L('Faqat nolli maxraj qiymatni taqiqlaydi.', 'Значение запрещает только нулевой знаменатель.', 'Only a zero denominator makes a value excluded.'),
    ],
    audio: L(
      'Yangi formulani tayanchsiz tekshiring. Maxrajni nolga tenglashtirib taqiqlangan qiymatni toping. Keyin pe o‘n ikkiga teng bo‘lganda surat va maxrajni alohida tekshiring.',
      'Проверь новую формулу без пошаговой опоры. Приравняй знаменатель к нулю, затем отдельно проверь числитель и знаменатель при пэ, равном двенадцати.',
      'Check the new formula without step-by-step support. Set the denominator equal to zero, then check the numerator and denominator separately when p equals twelve.',
    ),
  },
  {
    id: 's15-summary',
    type: 'summary',
    eyebrow: L('XULOSA', 'ВЫВОД', 'CONCLUSION'),
    title: L(
      'Tadqiqot xulosasini yakunlang',
      'Заверши вывод исследования',
      'Complete the investigation conclusion',
    ),
    lead: L(
      'Asosiy qoida va dastlabki gipotezangiz haqidagi xulosani to‘ldiring.',
      'Заверши главное правило и вывод о начальной гипотезе.',
      'Complete the main rule and the conclusion about your initial hypothesis.',
    ),
    promptCheck: L(
      'Taqiqlangan qiymatlarni topish uchun men qaysi qismni tekshiraman?',
      'Какую часть я проверяю, чтобы найти запрещённые значения?',
      'Which part do I check to find excluded values?',
    ),
    promptZero: L(
      'Agar maxraj nolga teng bo‘lmasa, nolli surat qanday holat?',
      'Если знаменатель не равен нулю, допустим ли нулевой числитель?',
      'If the denominator is not zero, is a zero numerator allowed?',
    ),
    promptHypothesis: L(
      'Dastlabki gipotezangiz tadqiqot bilan mos keldimi?',
      'Совпала ли начальная гипотеза с результатом исследования?',
      'Did your initial hypothesis match the investigation result?',
    ),
    matched: L('Mos keldi', 'Совпала', 'It matched'),
    revised: L('Tuzatildi', 'Была исправлена', 'It was revised'),
    success: L(
      'Ratsional kasrning qiymati mavjud bo‘lishi uchun maxraj nolga teng bo‘lmasligi kerak.',
      'Чтобы рациональная дробь имела значение, её знаменатель не должен быть равен нулю.',
      'For a rational expression to have a value, its denominator must not equal zero.',
    ),
    bridge: L(
      'Agar surat va maxrajni bir xil usulda o‘zgartirsak, kasrning qiymati har doim saqlanadimi?',
      'Если изменить числитель и знаменатель одинаковым способом, всегда ли значение дроби сохранится?',
      'If the numerator and denominator are changed in the same way, will the value of the fraction always stay the same?',
    ),
    audio: L(
      'Asosiy xulosani yakunlang. Taqiqlangan qiymat maxrajni nolga aylantiradi. Surat nolga teng bo‘lishi mumkin, agar maxraj nol bo‘lmasa.',
      'Заверши главный вывод. Запрещённое значение обращает знаменатель в ноль. Числитель может быть равен нулю, если знаменатель не равен нулю.',
      'Complete the main conclusion. An excluded value makes the denominator zero. The numerator may equal zero as long as the denominator is not zero.',
    ),
  },
];

export const PRACTICE = [
  {
    id: 'p1',
    prompt: L(
      'Qaysi ifodaning maxrajida o‘zgaruvchi bor?',
      'В каком выражении переменная находится в знаменателе?',
      'Which expression has a variable in its denominator?',
    ),
    answer: 'b',
  },
  {
    id: 'p2',
    prompt: L('Surat va maxrajni ko‘rsating.', 'Укажи числитель и знаменатель.', 'Identify the numerator and denominator.'),
    answer: { numerator: '2a-1', denominator: 'a+6' },
  },
  {
    id: 'p3',
    prompt: L('Ifodaning qiymatini toping.', 'Найди значение выражения.', 'Find the value of the expression.'),
    answer: '7/2',
  },
  {
    id: 'p4',
    prompt: L('Taqiqlangan iks qiymatini toping.', 'Найди запрещённое значение икс.', 'Find the excluded value of x.'),
    answer: -3,
  },
  {
    id: 'p5',
    prompt: L(
      'Har bir ifodani bo‘lish bilan bog‘liq cheklovi bilan moslang.',
      'Сопоставь каждое выражение с ограничением, связанным с делением.',
      'Match each expression to its restriction caused by division.',
    ),
    answer: ['x!=-2', 'x!=1', 'none'],
  },
  {
    id: 'p6',
    prompt: L(
      'Taqiqlangan qiymatni to‘liq topish uchun qaysi amalni bajarish kerak?',
      'Какое действие полностью определит запрещённое значение?',
      'Which action will determine the excluded value completely?',
    ),
    answer: 'solve-denominator',
  },
  {
    id: 'p7',
    prompt: L(
      'Iks to‘rtga teng bo‘lganda aniqlanmagan ratsional kasr tuzing.',
      'Построй рациональную дробь, не определённую при икс, равном четырём.',
      'Build a rational expression that is undefined when x equals four.',
    ),
    answer: ['x-4', '2x-8'],
  },
  {
    id: 'p8',
    prompt: L(
      'Qaysi ifoda aniqlangan va nolga teng? Qaysi ifoda aniqlanmagan?',
      'Какое выражение определено и равно нулю? Какое не определено?',
      'Which expression is defined and equals zero? Which expression is undefined?',
    ),
    answer: { definedZero: 'u', undefined: 'v' },
  },
  {
    id: 'p9',
    prompt: L(
      'Xatoni tuzating va haqiqiy taqiqlangan qiymatni toping.',
      'Исправь ошибку и найди настоящее запрещённое значение.',
      'Correct the error and find the actual excluded value.',
    ),
    answer: 6,
  },
  {
    id: 'p10',
    prompt: L(
      'Taqiqlangan te qiymatini toping. Keyin te to‘rtga teng qiymatni tekshiring.',
      'Найди запрещённое значение тэ. Затем проверь тэ, равное четырём.',
      'Find the excluded value of t. Then check t equals four.',
    ),
    answer: { excluded: -2, fourAllowed: true, value: 0 },
  },
];

export const text = (value, lang) => {
  if (!value || typeof value !== 'object') return String(value ?? '');
  return value[lang] ?? '';
};

export function validateLocalizedContent(value, path = 'content', issues = []) {
  if (!value || typeof value !== 'object') return issues;
  const keys = Object.keys(value);
  const hasLocaleKey = keys.some((key) => SUPPORTED_LANGS.includes(key));
  if (hasLocaleKey) {
    SUPPORTED_LANGS.forEach((lang) => {
      if (typeof value[lang] !== 'string' || !value[lang].trim()) {
        issues.push(`${path}.${lang}`);
      }
    });
    return issues;
  }
  Object.entries(value).forEach(([key, child]) => {
    validateLocalizedContent(child, `${path}.${key}`, issues);
  });
  return issues;
}

if (import.meta.env?.DEV) {
  const issues = validateLocalizedContent({ UI, META, SCREENS, PRACTICE });
  if (issues.length) {
    console.error('[Grade 8 Dars01] Missing UZ/RU/EN strings:', issues);
  }
}
