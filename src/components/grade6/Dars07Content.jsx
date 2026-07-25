import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const UI = {
  uz: {
    next: 'Davom',
    back: 'Orqaga',
    check: 'Tekshirish',
    retry: 'Qayta urinish',
    correct: "To'g'ri",
    why: 'Nega shunday',
    fact: 'Bilasizmi?',
    topic: 'Dars mavzusi',
    ready: 'Boshlashga tayyormisiz?',
    yes: 'Ha, boshlaymiz',
    curious: "O'rganmoqchiman",
    summary: "Dars o'tildi",
    result: 'topshiriq birinchi urinishda bajarildi',
    main: 'Asosiysi',
    finish: 'Darsni yakunlash',
    soundOn: 'Ovozni yoqish',
    soundOff: "Ovozni o'chirish",
    replay: 'Qayta eshitish',
    pickAll: "Barcha mos javoblarni belgilang",
    eq: 'Teng kasr',
    notEq: 'Teng emas',
  },
  ru: {
    next: 'Продолжить',
    back: 'Назад',
    check: 'Проверить',
    retry: 'Попробовать снова',
    correct: 'Верно',
    why: 'Почему так',
    fact: 'Знаете ли вы?',
    topic: 'Тема урока',
    ready: 'Готовы начать?',
    yes: 'Да, начнём',
    curious: 'Хочу разобраться',
    summary: 'Урок пройден',
    result: 'заданий выполнено с первой попытки',
    main: 'Главное',
    finish: 'Завершить урок',
    soundOn: 'Включить звук',
    soundOff: 'Выключить звук',
    replay: 'Повторить',
    pickAll: 'Отметьте все подходящие ответы',
    eq: 'Равная дробь',
    notEq: 'Не равна',
  },
};

const L = (uz, ru) => ({ uz, ru });

export const SLIDES = [
  {
    type: 'title',
    eyebrow: L('Yangi mavzu', 'Новая тема'),
    title: L("Kasrning asosiy xossasi", 'Основное свойство дроби'),
    subtitle: L(
      "Bugun kasrning qiymatini o'zgartirmasdan uning surat va maxrajini o'zgartirishni o'rganamiz.",
      'Сегодня научимся менять числитель и знаменатель, не изменяя значения дроби.',
    ),
    audio: L(
      "Bugungi mavzu kasrning asosiy xossasi. Bugun kasrning qiymatini o'zgartirmasdan uning surat va maxrajini o'zgartirishni o'rganamiz. Buning uchun kasr bo'laklarini yanada mayda teng bo'laklarga ajratamiz va natijani kuzatamiz.",
      'Тема урока — основное свойство дроби. Сегодня мы научимся менять числитель и знаменатель, не изменяя значения дроби. Для этого разделим части дроби на более мелкие равные части и проследим за результатом.',
    ),
  },
  {
    type: 'question',
    scored: false,
    eyebrow: L('Eslab olamiz', 'Вспомним'),
    title: L("Yarimni mayda bo'laklarga ajrating", 'Разделим половину на мелкие части'),
    prompt: L(
      "Lentaning yarmi bo'yalgan. Har bir yarimni yana ikkita teng bo'lakka ajratsak, bo'yalgan qism qaysi kasr bo'ladi?",
      'Половина ленты закрашена. Если каждую половину разделить ещё на две равные части, какой дробью станет закрашенная часть?',
    ),
    intro: L(
      "Lentaning ikkidan bir qismi bo'yalgan. Endi har bir yarimni yana ikkita teng bo'lakka ajrating. Bo'yalgan maydon o'zgarmaydi, faqat bo'laklar soni ortadi. Javobni tanlang.",
      'Одна вторая ленты закрашена. Теперь разделите каждую половину ещё на две равные части. Закрашенная площадь не изменится, увеличится только число частей. Выберите ответ.',
    ),
    options: ['1/4', '2/4', '3/4', '2/3'],
    correct: 1,
    why: [
      L("Butun lenta to'rtta teng bo'lakka ajraldi.", 'Вся лента разделилась на четыре равные части.'),
      L("Oldingi yarim endi shu bo'laklarning ikkitasini egallaydi: 1/2 = 2/4.", 'Прежняя половина теперь занимает две части из четырёх: 1/2 = 2/4.'),
    ],
    wrong: L("Bo'yalgan maydonni emas, jami va bo'yalgan yangi bo'laklarni sanang.", 'Считайте не площадь, а общее число новых частей и число закрашенных частей.'),
    visual: 'half',
  },
  {
    type: 'info',
    eyebrow: L('Kashfiyot', 'Открытие'),
    title: L("Bo'laklar ko'paydi, qiymat o'zgarmadi", 'Частей стало больше, значение не изменилось'),
    steps: [
      L("Avval lenta 2 ta teng bo'lakdan iborat edi va 1 tasi bo'yalgan: 1/2.", 'Сначала лента состояла из двух равных частей, одна была закрашена: 1/2.'),
      L("Har bir bo'lakni ikkiga ajratgach, jami 4 ta bo'lak va 2 ta bo'yalgan qism hosil bo'ldi: 2/4.", 'После деления каждой части пополам получилось четыре части, из них две закрашены: 2/4.'),
      L("Bo'yalgan uzunlik o'smadi ham, kamaymadi ham. Shuning uchun 1/2 va 2/4 teng kasrlar.", 'Закрашенная длина не увеличилась и не уменьшилась. Поэтому 1/2 и 2/4 — равные дроби.'),
    ],
    visual: 'split',
  },
  {
    type: 'rule',
    eyebrow: L('Asosiy qoida', 'Главное правило'),
    title: L("Surat va maxrajni bir xil songa ko'paytiramiz", 'Умножаем числитель и знаменатель на одно число'),
    steps: [
      L("Kasrning surat va maxrajini bir xil natural songa ko'paytirsak, kasrning qiymati o'zgarmaydi.", 'Если числитель и знаменатель дроби умножить на одно и то же натуральное число, значение дроби не изменится.'),
      L("Masalan: 2/3 = (2 × 4)/(3 × 4) = 8/12.", 'Например: 2/3 = (2 × 4)/(3 × 4) = 8/12.'),
      L("Biz bo'yalgan maydonni o'zgartirmadik, faqat har bir eski bo'lakni to'rttadan mayda bo'lakka ajratdik.", 'Мы не изменили закрашенную площадь, а лишь разделили каждую прежнюю часть ещё на четыре части.'),
    ],
    visual: 'multiply',
  },
  {
    type: 'info',
    eyebrow: L('Nega ishlaydi?', 'Почему это работает?'),
    title: L("Bir butunni yana teng bo'lib chiqamiz", 'Снова делим целое на равные части'),
    steps: [
      L("Surat bo'yalgan bo'laklar sonini, maxraj esa jami teng bo'laklar sonini bildiradi.", 'Числитель показывает число закрашенных частей, а знаменатель — число всех равных частей.'),
      L("Har bir bo'lakni bir xil miqdorda maydalasak, bo'yalgan va jami bo'laklar aynan bir xil marta ko'payadi.", 'Если каждую часть одинаково раздробить, число закрашенных и общее число частей увеличатся в одинаковое число раз.'),
      L("Shu sabab ularning nisbati, ya'ni kasrning qiymati o'zgarmaydi.", 'Поэтому их отношение, то есть значение дроби, не меняется.'),
    ],
    visual: 'ratio',
  },
  {
    type: 'question',
    scored: true,
    eyebrow: L('Mashq', 'Практика'),
    title: L("Bir xil songa ko'paytiring", 'Умножьте на одно число'),
    prompt: L("3/5 kasrining surat va maxrajini 2 ga ko'paytirsak, qaysi kasr hosil bo'ladi?", 'Какая дробь получится, если числитель и знаменатель дроби 3/5 умножить на 2?'),
    intro: L("Beshdan uch kasrini oling. Suratni ham, maxrajni ham ikkiga ko'paytiring. To'g'ri natijani tanlang.", 'Возьмём дробь три пятых. Умножьте и числитель, и знаменатель на два. Выберите верный результат.'),
    options: ['5/7', '6/10', '3/10', '6/5'],
    correct: 1,
    why: [
      L("Surat: 3 × 2 = 6.", 'Числитель: 3 умножить на 2 равно 6.'),
      L("Maxraj: 5 × 2 = 10. Demak, 3/5 = 6/10.", 'Знаменатель: 5 умножить на 2 равно 10. Значит, 3/5 = 6/10.'),
    ],
    wrong: L("Bir xil amal suratga ham, maxrajga ham bajarilishi kerak.", 'Одно и то же действие нужно выполнить и с числителем, и со знаменателем.'),
    fact: L("Teng kasrlar son o'qida aynan bitta nuqtada joylashadi.", 'Равные дроби находятся в одной и той же точке числовой прямой.'),
    visual: 'threeFifths',
  },
  {
    type: 'info',
    eyebrow: L('Teskari yo‘l', 'Обратный путь'),
    title: L("Endi bo'laklarni yiriklashtiramiz", 'Теперь укрупним части'),
    steps: [
      L("6/8 kasrida surat ham, maxraj ham 2 ga bo'linadi.", 'В дроби 6/8 и числитель, и знаменатель делятся на 2.'),
      L("6 ni 2 ga bo'lsak 3, 8 ni 2 ga bo'lsak 4 chiqadi.", 'Если 6 разделить на 2, получится 3, а если 8 разделить на 2, получится 4.'),
      L("Demak, 6/8 = 3/4. Bu amal kasrni qisqartirish deyiladi.", 'Значит, 6/8 = 3/4. Это действие называется сокращением дроби.'),
    ],
    visual: 'reduce',
  },
  {
    type: 'question',
    scored: true,
    eyebrow: L('Mashq', 'Практика'),
    title: L("Kasrni qisqartiring", 'Сократите дробь'),
    prompt: L("10/15 kasrining surat va maxrajini 5 ga bo'ling.", 'Разделите числитель и знаменатель дроби 10/15 на 5.'),
    intro: L("O'n beshdan o'n kasrida surat va maxraj beshga bo'linadi. Ikkalasini ham beshga bo'lib, qisqargan kasrni tanlang.", 'В дроби десять пятнадцатых числитель и знаменатель делятся на пять. Разделите оба числа на пять и выберите сокращённую дробь.'),
    options: ['5/10', '2/3', '2/10', '10/3'],
    correct: 1,
    why: [
      L("10 : 5 = 2.", '10 разделить на 5 равно 2.'),
      L("15 : 5 = 3. Shuning uchun 10/15 = 2/3.", '15 разделить на 5 равно 3. Поэтому 10/15 = 2/3.'),
    ],
    wrong: L("Surat va maxrajni aynan bitta umumiy bo'luvchiga bo'ling.", 'Разделите числитель и знаменатель на один и тот же общий делитель.'),
    visual: 'tenFifteen',
  },
  {
    type: 'question',
    scored: true,
    eyebrow: L('Muhim shart', 'Важное условие'),
    title: L("Qaysi amal kasr qiymatini saqlaydi?", 'Какое действие сохраняет значение дроби?'),
    prompt: L("4/6 kasridan 2/3 ni olish uchun nima qilish kerak?", 'Что нужно сделать с дробью 4/6, чтобы получить 2/3?'),
    intro: L("Oltidan to'rt kasrini uchdan ikkiga aylantirish kerak. Surat va maxraj bilan bir xil amal bajariladigan javobni toping.", 'Нужно превратить дробь четыре шестых в две третьих. Найдите ответ, где с числителем и знаменателем выполняется одно действие.'),
    options: [
      L("Ikkalasini 2 ga bo'lish", 'Оба разделить на 2'),
      L("Faqat suratni 2 ga bo'lish", 'Только числитель разделить на 2'),
      L("Ikkalasidan 2 ni ayirish", 'Из обоих вычесть 2'),
      L("Faqat maxrajni 2 ga bo'lish", 'Только знаменатель разделить на 2'),
    ],
    correct: 0,
    why: [
      L("4 va 6 ning umumiy bo'luvchisi 2.", 'Общий делитель чисел 4 и 6 равен 2.'),
      L("4 : 2 = 2 va 6 : 2 = 3. Bir xil songa bo'lish qiymatni saqlaydi.", '4 разделить на 2 равно 2, а 6 разделить на 2 равно 3. Деление на одно число сохраняет значение.'),
    ],
    wrong: L("Ayirish kasrning asosiy xossasi emas. Umumiy ko'paytuvchi yoki bo'luvchini izlang.", 'Вычитание не является основным свойством дроби. Ищите общий множитель или делитель.'),
    visual: 'fourSixths',
  },
  {
    type: 'info',
    eyebrow: L("Son o'qida", 'На числовой прямой'),
    title: L("Turli yozuv — bitta nuqta", 'Разные записи — одна точка'),
    steps: [
      L("1/2, 2/4 va 3/6 kasrlarining yozilishi har xil.", 'Дроби 1/2, 2/4 и 3/6 записаны по-разному.'),
      L("Lekin ularning har biri butunning aynan yarmini bildiradi.", 'Но каждая из них обозначает ровно половину целого.'),
      L("Shuning uchun son o'qida uchalasi ham bir xil nuqtaga tushadi.", 'Поэтому на числовой прямой все три дроби попадают в одну точку.'),
    ],
    visual: 'numberLine',
  },
  {
    type: 'multi',
    scored: true,
    eyebrow: L('Bir nechta javob', 'Несколько ответов'),
    title: L("3/4 ga teng kasrlarni toping", 'Найдите дроби, равные 3/4'),
    prompt: L("Barcha teng kasrlarni belgilang va tekshiring.", 'Отметьте все равные дроби и проверьте ответ.'),
    intro: L("To'rtdan uchga teng bo'lgan barcha kasrlarni belgilang. Surat va maxraj bir xil marta o'zgarganini tekshiring.", 'Отметьте все дроби, равные трём четвёртым. Проверьте, во сколько раз изменились числитель и знаменатель.'),
    options: ['6/8', '9/12', '6/10', '12/16'],
    correctSet: [0, 1, 3],
    why: [
      L("3/4 ni 2, 3 va 4 ga kengaytirsak 6/8, 9/12 va 12/16 chiqadi.", 'Если расширить 3/4 в 2, 3 и 4 раза, получим 6/8, 9/12 и 12/16.'),
      L("6/10 qisqarsa 3/5 bo'ladi, shuning uchun u 3/4 ga teng emas.", 'Дробь 6/10 сокращается до 3/5, поэтому она не равна 3/4.'),
    ],
    wrong: L("Har bir variantda surat va maxraj nechta marta o'zgarganini alohida tekshiring.", 'В каждом варианте отдельно проверьте, во сколько раз изменились числитель и знаменатель.'),
  },
  {
    type: 'match',
    scored: true,
    eyebrow: L('Moslashtirish', 'Соответствие'),
    title: L("Teng kasrlarni juftlang", 'Соедините равные дроби'),
    prompt: L("Har bir chap kasr uchun o'ng tomondagi teng kasrni tanlang.", 'Для каждой дроби слева выберите равную дробь справа.'),
    intro: L("Har bir kasrni uning teng yozuvi bilan moslang. Surat va maxraj bir xil songa ko'payganini tekshiring.", 'Соедините каждую дробь с равной ей записью. Проверьте, что числитель и знаменатель умножены на одно число.'),
    rows: [
      { left: '1/2', options: ['3/4', '2/4', '4/5'], correct: '2/4' },
      { left: '2/3', options: ['4/5', '6/9', '3/8'], correct: '6/9' },
      { left: '3/5', options: ['9/15', '6/8', '4/10'], correct: '9/15' },
    ],
    why: [
      L("1/2 ni 2 ga kengaytirsak 2/4; 2/3 ni 3 ga kengaytirsak 6/9 chiqadi.", 'Если расширить 1/2 в 2 раза, получим 2/4; если расширить 2/3 в 3 раза, получим 6/9.'),
      L("3/5 ni 3 ga kengaytirsak 9/15 bo'ladi.", 'Если расширить 3/5 в 3 раза, получим 9/15.'),
    ],
    wrong: L("Har bir juftda surat va maxraj uchun bitta umumiy ko'paytiruvchini toping.", 'В каждой паре найдите один общий множитель для числителя и знаменателя.'),
  },
  {
    type: 'classify',
    scored: true,
    eyebrow: L('Tasniflash', 'Классификация'),
    title: L("Tengmi yoki teng emasmi?", 'Равны или не равны?'),
    prompt: L("Har bir juftlikni mos guruhga ajrating.", 'Распределите каждую пару в подходящую группу.'),
    intro: L("Har bir kasr juftligini tekshiring. Ular teng bo'lsa teng kasr guruhiga, aks holda teng emas guruhiga joylashtiring.", 'Проверьте каждую пару дробей. Равные поместите в группу равных, остальные — в группу неравных.'),
    cards: [
      { label: '2/6 = 1/3', value: true },
      { label: '4/10 = 2/5', value: true },
      { label: '6/10 = 3/4', value: false },
      { label: '8/12 = 2/3', value: true },
    ],
    why: [
      L("2/6, 4/10 va 8/12 kasrlarini umumiy bo'luvchiga qisqartirsak o'ngdagi kasrlar chiqadi.", 'Если сократить 2/6, 4/10 и 8/12 на общий делитель, получатся дроби справа.'),
      L("6/10 esa 3/5 ga qisqaradi, 3/4 ga emas.", 'А дробь 6/10 сокращается до 3/5, а не до 3/4.'),
    ],
    wrong: L("Kasrlarni qisqartirib, eng sodda ko'rinishlarini taqqoslang.", 'Сократите дроби и сравните их простейшие виды.'),
  },
  {
    type: 'number',
    scored: true,
    eyebrow: L('Yakuniy masala', 'Финальная задача'),
    title: L("Noma'lum suratni toping", 'Найдите неизвестный числитель'),
    prompt: L("?/18 = 2/3 bo'lsa, savol belgisi o'rnida qaysi son turadi?", 'Если ?/18 = 2/3, какое число стоит вместо вопросительного знака?'),
    intro: L("Uch maxraj o'n sakkizga necha marta ko'payganini toping. Keyin suratni ham aynan shuncha marta ko'paytiring. Javobni tanlang.", 'Определите, во сколько раз знаменатель три увеличился до восемнадцати. Затем во столько же раз увеличьте числитель. Выберите ответ.'),
    options: ['6', '9', '12', '15'],
    correct: 2,
    why: [
      L("3 dan 18 hosil bo'lishi uchun 3 ni 6 ga ko'paytiramiz.", 'Чтобы из 3 получить 18, нужно умножить 3 на 6.'),
      L("Suratni ham 6 ga ko'paytiramiz: 2 × 6 = 12. Demak, 12/18 = 2/3.", 'Числитель тоже умножаем на 6: 2 умножить на 6 равно 12. Значит, 12/18 = 2/3.'),
    ],
    wrong: L("Avval maxrajlar orasidagi ko'paytiruvchini toping, so'ng shu sonni suratga qo'llang.", 'Сначала найдите множитель между знаменателями, затем примените его к числителю.'),
    fact: L("Kasrlarni umumiy maxrajga keltirish ham aynan shu asosiy xossaga tayanadi.", 'Приведение дробей к общему знаменателю основано на этом же свойстве.'),
    visual: 'unknown',
  },
  {
    type: 'summary',
    eyebrow: L('Dars yakuni', 'Итог урока'),
    title: L("Kasrning asosiy xossasi", 'Основное свойство дроби'),
    points: [
      L("Surat va maxrajni bir xil natural songa ko'paytirish kasr qiymatini o'zgartirmaydi.", 'Умножение числителя и знаменателя на одно натуральное число не меняет значение дроби.'),
      L("Surat va maxrajni umumiy bo'luvchiga bo'lish ham qiymatni saqlaydi va kasrni qisqartiradi.", 'Деление числителя и знаменателя на общий делитель сохраняет значение и сокращает дробь.'),
      L("Teng kasrlar turlicha yozilsa ham, son o'qida bitta nuqtani bildiradi.", 'Равные дроби записываются по-разному, но обозначают одну точку на числовой прямой.'),
    ],
    audio: L(
      "Dars o'tildi. Asosiysini yig'amiz. Kasrning surat va maxrajini bir xil natural songa ko'paytirsak, kasrning qiymati o'zgarmaydi. Ularni bir xil umumiy bo'luvchiga bo'lsak ham qiymat saqlanadi, kasr esa qisqaradi. Teng kasrlar turlicha yoziladi, lekin bir xil miqdorni bildiradi. Keyingi darsda bu xossadan kasrlarni qisqartirishda foydalanamiz.",
      'Урок пройден. Соберём главное. Если числитель и знаменатель дроби умножить на одно натуральное число, значение дроби не изменится. При делении на один общий делитель значение тоже сохраняется, а дробь сокращается. Равные дроби записываются по-разному, но обозначают одно количество. На следующем уроке применим это свойство для сокращения дробей.',
    ),
  },
];

function useMobileZoom() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => root.style.setProperty('--g6d7z', String(window.innerWidth < 640 ? window.innerWidth / 390 : 1));
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--g6d7z');
    };
  }, []);
}

function useNarrator({ lang, muted, ttsApiBase, voiceGender }) {
  const tokenRef = useRef(0);
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);
  const lastRef = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    tokenRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsPlaying(false);
  }, []);

  const say = useCallback((text, token) => new Promise((resolve) => {
    if (!text || muted || token !== tokenRef.current) {
      resolve();
      return;
    }
    setIsPlaying(true);
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setIsPlaying(false);
      resolve();
    };
    const watchdog = window.setTimeout(finish, Math.min(16000, Math.max(2500, String(text).length * 85)));

    if (ttsApiBase) {
      const base = ttsApiBase.replace(/\/$/, '');
      const audio = new Audio(`${base}/api/tts?text=${encodeURIComponent(text)}&g=${voiceGender || 'm'}`);
      audioRef.current = audio;
      audio.onended = () => { clearTimeout(watchdog); finish(); };
      audio.onerror = () => { clearTimeout(watchdog); finish(); };
      audio.play().catch(() => { clearTimeout(watchdog); finish(); });
      return;
    }

    if (!window.speechSynthesis) {
      clearTimeout(watchdog);
      finish();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'uz' ? 'uz-UZ' : 'ru-RU';
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utteranceRef.current = utterance;
    utterance.onend = () => { clearTimeout(watchdog); finish(); };
    utterance.onerror = () => { clearTimeout(watchdog); finish(); };
    window.speechSynthesis.speak(utterance);
  }), [lang, muted, ttsApiBase, voiceGender]);

  const play = useCallback(async (items, onStep) => {
    stop();
    const list = (Array.isArray(items) ? items : [items]).filter(Boolean);
    lastRef.current = list;
    const token = tokenRef.current;
    for (let index = 0; index < list.length; index += 1) {
      if (token !== tokenRef.current) return false;
      onStep?.(index);
      await say(list[index], token);
    }
    return token === tokenRef.current;
  }, [say, stop]);

  const replay = useCallback(() => play(lastRef.current), [play]);
  useEffect(() => stop, [stop]);
  return { play, stop, replay, isPlaying };
}

function Fraction({ value, size = 'md' }) {
  const [top, bottom] = String(value).split('/');
  if (!bottom) return <span className={`plain-number ${size}`}>{value}</span>;
  return (
    <span className={`fraction ${size}`} aria-label={value}>
      <span>{top}</span><span>{bottom}</span>
    </span>
  );
}

function FractionBar({ numerator, denominator, tone = 'orange', labels = false }) {
  return (
    <div className={`fraction-bar ${tone}`}>
      {Array.from({ length: denominator }, (_, index) => (
        <span key={index} className={index < numerator ? 'filled' : ''}>
          {labels ? index + 1 : ''}
        </span>
      ))}
    </div>
  );
}

function SlideVisual({ kind, lang = 'uz' }) {
  if (kind === 'half') return <div className="visual-stack"><FractionBar numerator={1} denominator={2}/><div className="visual-arrow">↓</div><FractionBar numerator={2} denominator={4}/></div>;
  if (kind === 'split') return <div className="compare-bars"><div><Fraction value="1/2" size="lg"/><FractionBar numerator={1} denominator={2}/></div><b>=</b><div><Fraction value="2/4" size="lg"/><FractionBar numerator={2} denominator={4} tone="blue"/></div></div>;
  if (kind === 'multiply') return <div className="equation-card"><Fraction value="2/3" size="xl"/><span>=</span><span className="formula-frac"><b>2 × 4</b><b>3 × 4</b></span><span>=</span><Fraction value="8/12" size="xl"/></div>;
  if (kind === 'ratio') return <div className="ratio-visual"><FractionBar numerator={2} denominator={3}/><span>{lang === 'uz' ? 'har bir bo‘lak × 3' : 'каждая часть × 3'}</span><FractionBar numerator={6} denominator={9} tone="blue"/></div>;
  if (kind === 'threeFifths') return <div className="compare-bars"><div><Fraction value="3/5" size="lg"/><FractionBar numerator={3} denominator={5}/></div><b>=</b><div><Fraction value="6/10" size="lg"/><FractionBar numerator={6} denominator={10} tone="blue"/></div></div>;
  if (kind === 'reduce') return <div className="equation-card"><Fraction value="6/8" size="xl"/><span>÷ 2</span><span>→</span><Fraction value="3/4" size="xl"/></div>;
  if (kind === 'tenFifteen') return <div className="equation-card"><Fraction value="10/15" size="xl"/><span>÷ 5</span><span>=</span><Fraction value="2/3" size="xl"/></div>;
  if (kind === 'fourSixths') return <div className="equation-card"><Fraction value="4/6" size="xl"/><span>÷ 2</span><span>=</span><Fraction value="2/3" size="xl"/></div>;
  if (kind === 'numberLine') return (
    <div className="number-line">
      <div className="number-line-track"><i/><i className="middle"/><i/></div>
      <span className="zero">0</span><span className="one">1</span>
      <div className="number-line-labels"><Fraction value="1/2"/><Fraction value="2/4"/><Fraction value="3/6"/></div>
    </div>
  );
  if (kind === 'unknown') return <div className="equation-card"><span className="unknown">?</span><span className="formula-frac"><b>?</b><b>18</b></span><span>=</span><Fraction value="2/3" size="xl"/></div>;
  return null;
}

function WhyCard({ slide, lang, visible, factVisible }) {
  return (
    <>
      {visible >= 0 && (
        <div className="why-card fade-up">
          <div className="why-title"><span/>{UI[lang].why}</div>
          <div className="why-list">
            {slide.why.map((line, index) => visible > index && (
              <div className="why-row fade-up" key={index}>
                <b>{index + 1}</b><p>{line[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {slide.fact && factVisible && (
        <div className="fact-card fade-up">
          <strong>{UI[lang].fact}</strong>
          <p>{slide.fact[lang]}</p>
        </div>
      )}
    </>
  );
}

function QuestionSlide({ slide, lang, narrator, stored, onSolved }) {
  const localizedOptions = useMemo(
    () => (slide.options || []).map((option) => typeof option === 'string' ? option : option[lang]),
    [slide.options, lang],
  );
  const order = useMemo(() => localizedOptions.map((_, index) => index).sort(() => Math.random() - 0.5), [localizedOptions]);
  const [picked, setPicked] = useState(stored?.picked ?? null);
  const [wrong, setWrong] = useState([]);
  const [solved, setSolved] = useState(Boolean(stored?.correct));
  const [attempted, setAttempted] = useState(false);
  const [whyVisible, setWhyVisible] = useState(stored?.correct ? slide.why.length : -1);
  const [factVisible, setFactVisible] = useState(Boolean(stored?.correct && slide.fact));

  const complete = useCallback(async (firstTry, answer) => {
    setSolved(true);
    setPicked(answer);
    const sequence = [
      UI[lang].correct,
      UI[lang].why,
      ...slide.why.map((line) => line[lang]),
    ];
    await narrator.play(sequence, (index) => {
      if (index === 1) setWhyVisible(0);
      if (index >= 2) setWhyVisible(index - 1);
    });
    if (slide.fact) {
      setFactVisible(true);
      await narrator.play(`${UI[lang].fact} ${slide.fact[lang]}`);
    }
    onSolved({ correct: true, firstTry, picked: answer });
  }, [lang, narrator, onSolved, slide]);

  const choose = (originalIndex) => {
    if (solved) return;
    narrator.stop();
    setPicked(originalIndex);
    if (originalIndex === slide.correct) {
      complete(!attempted, originalIndex);
    } else {
      setAttempted(true);
      setWrong((prev) => [...new Set([...prev, originalIndex])]);
      narrator.play(slide.wrong[lang]);
    }
  };

  return (
    <div className="question-layout">
      <SlideVisual kind={slide.visual} lang={lang}/>
      <p className="question-prompt">{slide.prompt[lang]}</p>
      <div className="option-grid">
        {order.map((originalIndex, position) => {
          const isCorrect = solved && originalIndex === slide.correct;
          const isWrong = wrong.includes(originalIndex);
          return (
            <button
              type="button"
              className={`option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              onClick={() => choose(originalIndex)}
              disabled={solved}
              key={originalIndex}
            >
              <b>{String.fromCharCode(65 + position)}</b>
              <span>{localizedOptions[originalIndex].includes('/') ? <Fraction value={localizedOptions[originalIndex]}/> : localizedOptions[originalIndex]}</span>
            </button>
          );
        })}
      </div>
      {picked != null && !solved && <div className="wrong-card fade-up">{slide.wrong[lang]}</div>}
      {solved && <div className="correct-card fade-up">✓ {UI[lang].correct}</div>}
      {solved && <WhyCard slide={slide} lang={lang} visible={whyVisible} factVisible={factVisible}/>}
    </div>
  );
}

function MultiSlide({ slide, lang, narrator, stored, onSolved }) {
  const [selected, setSelected] = useState(stored?.picked || []);
  const [checked, setChecked] = useState(Boolean(stored?.correct));
  const [attempted, setAttempted] = useState(false);
  const [whyVisible, setWhyVisible] = useState(stored?.correct ? slide.why.length : -1);
  const ok = selected.length === slide.correctSet.length && selected.every((value) => slide.correctSet.includes(value));
  const toggle = (index) => !checked && setSelected((prev) => prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index]);
  const check = async () => {
    narrator.stop();
    setChecked(true);
    if (!ok) {
      setAttempted(true);
      narrator.play(slide.wrong[lang]);
      return;
    }
    const firstTry = !attempted;
    await narrator.play([UI[lang].correct, UI[lang].why, ...slide.why.map((x) => x[lang])], (index) => {
      if (index === 1) setWhyVisible(0);
      if (index >= 2) setWhyVisible(index - 1);
    });
    onSolved({ correct: true, firstTry, picked: selected });
  };
  const retry = () => { setChecked(false); setSelected((prev) => prev.filter((x) => slide.correctSet.includes(x))); };
  return (
    <div className="question-layout">
      <p className="question-prompt">{slide.prompt[lang]}</p>
      <p className="micro-copy">{UI[lang].pickAll}</p>
      <div className="option-grid">
        {slide.options.map((option, index) => {
          const cls = checked ? (slide.correctSet.includes(index) ? 'correct' : selected.includes(index) ? 'wrong' : '') : selected.includes(index) ? 'selected' : '';
          return <button type="button" className={`option ${cls}`} key={option} onClick={() => toggle(index)}><b>✓</b><Fraction value={option}/></button>;
        })}
      </div>
      {!checked && <button className="check-button" disabled={!selected.length} onClick={check}>{UI[lang].check}</button>}
      {checked && !ok && <><div className="wrong-card">{slide.wrong[lang]}</div><button className="retry-button" onClick={retry}>{UI[lang].retry}</button></>}
      {checked && ok && <><div className="correct-card">✓ {UI[lang].correct}</div><WhyCard slide={slide} lang={lang} visible={whyVisible}/></>}
    </div>
  );
}

function MatchSlide({ slide, lang, narrator, stored, onSolved }) {
  const [answers, setAnswers] = useState(stored?.picked || {});
  const [checked, setChecked] = useState(Boolean(stored?.correct));
  const [attempted, setAttempted] = useState(false);
  const [whyVisible, setWhyVisible] = useState(stored?.correct ? slide.why.length : -1);
  const ready = Object.keys(answers).length === slide.rows.length;
  const ok = ready && slide.rows.every((row, index) => answers[index] === row.correct);
  const check = async () => {
    narrator.stop(); setChecked(true);
    if (!ok) { setAttempted(true); narrator.play(slide.wrong[lang]); return; }
    await narrator.play([UI[lang].correct, UI[lang].why, ...slide.why.map((x) => x[lang])], (index) => {
      if (index === 1) setWhyVisible(0); if (index >= 2) setWhyVisible(index - 1);
    });
    onSolved({ correct: true, firstTry: !attempted, picked: answers });
  };
  return (
    <div className="question-layout">
      <p className="question-prompt">{slide.prompt[lang]}</p>
      <div className="match-list">
        {slide.rows.map((row, index) => (
          <div className="match-row" key={row.left}>
            <Fraction value={row.left} size="lg"/><span>↔</span>
            <div>{row.options.map((option) => {
              const state = checked ? (option === row.correct ? 'correct' : answers[index] === option ? 'wrong' : '') : answers[index] === option ? 'selected' : '';
              return <button type="button" className={state} disabled={checked} key={option} onClick={() => setAnswers((prev) => ({ ...prev, [index]: option }))}><Fraction value={option}/></button>;
            })}</div>
          </div>
        ))}
      </div>
      {!checked && <button className="check-button" disabled={!ready} onClick={check}>{UI[lang].check}</button>}
      {checked && !ok && <><div className="wrong-card">{slide.wrong[lang]}</div><button className="retry-button" onClick={() => {
        setAnswers((prev) => Object.fromEntries(
          Object.entries(prev).filter(([index, value]) => slide.rows[Number(index)]?.correct === value),
        ));
        setChecked(false);
      }}>{UI[lang].retry}</button></>}
      {checked && ok && <><div className="correct-card">✓ {UI[lang].correct}</div><WhyCard slide={slide} lang={lang} visible={whyVisible}/></>}
    </div>
  );
}

function ClassifySlide({ slide, lang, narrator, stored, onSolved }) {
  const [answers, setAnswers] = useState(stored?.picked || {});
  const [checked, setChecked] = useState(Boolean(stored?.correct));
  const [attempted, setAttempted] = useState(false);
  const [whyVisible, setWhyVisible] = useState(stored?.correct ? slide.why.length : -1);
  const ready = Object.keys(answers).length === slide.cards.length;
  const ok = ready && slide.cards.every((card, index) => answers[index] === card.value);
  const check = async () => {
    narrator.stop(); setChecked(true);
    if (!ok) { setAttempted(true); narrator.play(slide.wrong[lang]); return; }
    await narrator.play([UI[lang].correct, UI[lang].why, ...slide.why.map((x) => x[lang])], (index) => {
      if (index === 1) setWhyVisible(0); if (index >= 2) setWhyVisible(index - 1);
    });
    onSolved({ correct: true, firstTry: !attempted, picked: answers });
  };
  return (
    <div className="question-layout">
      <p className="question-prompt">{slide.prompt[lang]}</p>
      <div className="classify-list">
        {slide.cards.map((card, index) => (
          <div className="classify-row" key={card.label}>
            <span>{card.label}</span>
            {[true, false].map((value) => {
              const state = checked ? (value === card.value ? 'correct' : answers[index] === value ? 'wrong' : '') : answers[index] === value ? 'selected' : '';
              return <button type="button" className={state} disabled={checked} key={String(value)} onClick={() => setAnswers((prev) => ({ ...prev, [index]: value }))}>{value ? UI[lang].eq : UI[lang].notEq}</button>;
            })}
          </div>
        ))}
      </div>
      {!checked && <button className="check-button" disabled={!ready} onClick={check}>{UI[lang].check}</button>}
      {checked && !ok && <><div className="wrong-card">{slide.wrong[lang]}</div><button className="retry-button" onClick={() => {
        setAnswers((prev) => Object.fromEntries(
          Object.entries(prev).filter(([index, value]) => slide.cards[Number(index)]?.value === value),
        ));
        setChecked(false);
      }}>{UI[lang].retry}</button></>}
      {checked && ok && <><div className="correct-card">✓ {UI[lang].correct}</div><WhyCard slide={slide} lang={lang} visible={whyVisible}/></>}
    </div>
  );
}

const styles = `
*{box-sizing:border-box}.d7-root{--ink:#172033;--muted:#64748b;--paper:#fff;--bg:#f6f4ef;--orange:#ff4f28;--green:#1f7a4d;--greenSoft:#e3f0e8;--blue:#019acb;position:fixed;inset:0;overflow:hidden;background:var(--bg);color:var(--ink);font-family:Manrope,system-ui,sans-serif;zoom:var(--g6d7z,1)}
.d7-stage{height:100%;max-width:936px;margin:auto;display:flex;flex-direction:column}.d7-header{flex:none;padding:12px 18px 9px;border-bottom:1px solid #e7e3dc;background:#f6f4efee;display:flex;align-items:center;gap:12px}.d7-eyebrow{padding:6px 11px;border-radius:999px;background:#ffe8e1;color:var(--orange);font:800 11px/1.1 "JetBrains Mono",monospace;letter-spacing:.09em;text-transform:uppercase;white-space:nowrap}.d7-progress{height:6px;flex:1;background:#e7e3dc;border-radius:99px;overflow:hidden}.d7-progress span{display:block;height:100%;background:var(--orange);transition:width .35s}.d7-count{font:800 12px "JetBrains Mono",monospace;color:var(--muted)}.audio-tools{display:flex;gap:5px}.icon-btn{border:0;background:#fff;width:34px;height:34px;border-radius:11px;cursor:pointer;box-shadow:0 3px 12px #17203312}.icon-btn.playing{color:var(--orange);animation:pulse 1s infinite}
.d7-content{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:18px 22px 24px;overscroll-behavior:contain}.d7-inner{max-width:790px;margin:0 auto}.slide-title{font-family:"Source Serif 4",Georgia,serif;font-size:clamp(25px,4vw,35px);line-height:1.12;margin:0 0 9px}.slide-subtitle{font-size:16px;line-height:1.5;color:var(--muted);margin:0 0 15px;max-width:720px}.topic-card{display:grid;grid-template-columns:1.2fr .8fr;gap:20px;align-items:center;background:#fff;border-radius:22px;padding:24px;box-shadow:0 12px 35px #17203312}.topic-art{display:grid;place-items:center;min-height:210px;border-radius:18px;background:linear-gradient(145deg,#fff0ea,#eaf8fc)}.topic-art .compare-bars{width:95%}.start-panel{margin-top:16px;padding:14px 17px;border-left:4px solid var(--orange);border-radius:15px;background:#fff}.start-panel strong{display:block;margin-bottom:10px}.start-actions{display:flex;gap:9px;flex-wrap:wrap}.start-actions button,.check-button{border:0;border-radius:13px;background:var(--orange);color:white;padding:12px 18px;font-weight:800;cursor:pointer}.start-actions button:last-child{background:#172033}
.info-card,.rule-card{background:#fff;border-radius:20px;padding:19px;box-shadow:0 10px 30px #17203310}.rule-card{border-left:5px solid var(--orange)}.step-list{display:grid;gap:9px;margin-top:15px}.step-row{display:grid;grid-template-columns:32px 1fr;gap:10px;align-items:start;padding:11px 12px;border-radius:13px;background:#f8fafc}.step-row b,.why-row b{display:grid;place-items:center;width:27px;height:27px;border-radius:9px;background:var(--orange);color:#fff}.step-row p,.why-row p,.fact-card p{margin:2px 0 0;line-height:1.45}.question-layout{display:grid;gap:12px}.question-prompt{font-size:clamp(17px,2.4vw,21px);font-weight:800;line-height:1.4;margin:0}.micro-copy{font-size:13px;color:var(--muted);margin:-5px 0 0}.option-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.option{min-height:58px;border:2px solid transparent;border-radius:15px;background:#fff;box-shadow:0 6px 18px #17203310;display:flex;align-items:center;gap:12px;padding:10px 13px;text-align:left;color:var(--ink);font:800 16px Manrope;cursor:pointer}.option>b{display:grid;place-items:center;width:30px;height:30px;flex:none;border-radius:10px;background:#eef1f5;color:#64748b}.option.selected{border-color:var(--orange);background:#fff3ee}.option.correct,.match-row button.correct,.classify-row button.correct{border-color:var(--green);background:var(--greenSoft);color:var(--green)}.option.wrong,.match-row button.wrong,.classify-row button.wrong{border-color:#dc2626;background:#fee2e2;color:#991b1b}.wrong-card,.correct-card{padding:11px 14px;border-radius:14px;font-weight:750;line-height:1.4}.wrong-card{background:#fee2e2;color:#991b1b;border-left:4px solid #dc2626}.correct-card{background:var(--greenSoft);color:var(--green);border-left:4px solid var(--green)}.why-card{padding:15px 16px;border-radius:17px;background:#eaf6fb;border-left:5px solid var(--blue)}.why-title{display:flex;align-items:center;gap:8px;color:var(--blue);font:800 12px "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.08em}.why-title span{width:9px;height:9px;border-radius:50%;background:var(--blue)}.why-list{display:grid;gap:8px;margin-top:11px}.why-row{display:grid;grid-template-columns:30px 1fr;gap:9px;align-items:start}.why-row b{background:var(--blue)}.fact-card{padding:14px 16px;border-radius:17px;background:#fff7d9;border-left:5px solid #d8a93a}.fact-card strong{color:#936c00;font:800 12px "JetBrains Mono",monospace;text-transform:uppercase}.check-button{justify-self:start;min-width:170px}.check-button:disabled{background:#cbd5e1;cursor:not-allowed}.retry-button{justify-self:start;padding:10px 15px;border:1px solid #cbd5e1;border-radius:12px;background:#fff;color:#334155;font-weight:800;cursor:pointer}
.fraction{display:inline-grid;grid-template-rows:1fr 1fr;text-align:center;vertical-align:middle;font-family:"JetBrains Mono",monospace;font-weight:900;line-height:1}.fraction span:first-child{border-bottom:2px solid currentColor;padding:0 5px 3px}.fraction span:last-child{padding:3px 5px 0}.fraction.lg{font-size:25px}.fraction.xl{font-size:34px}.fraction-bar{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;width:100%;height:52px;border:3px solid #334155;border-radius:13px;overflow:hidden;background:#fff}.fraction-bar span{display:grid;place-items:center;border-right:2px solid #334155;color:#fff;font-weight:900}.fraction-bar span:last-child{border:0}.fraction-bar span.filled{background:#ff7959}.fraction-bar.blue span.filled{background:#24acd3}.visual-stack,.ratio-visual{max-width:600px;margin:0 auto;display:grid;gap:8px}.visual-arrow{text-align:center;color:var(--orange);font-size:24px}.compare-bars{display:grid;grid-template-columns:1fr 35px 1fr;gap:10px;align-items:center;margin:4px auto 14px;max-width:670px}.compare-bars>div{display:grid;gap:7px;text-align:center}.compare-bars>b{text-align:center;font-size:28px}.equation-card{display:flex;align-items:center;justify-content:center;gap:16px;min-height:115px;padding:15px;border-radius:19px;background:#fff;box-shadow:0 8px 24px #17203312;font:900 22px "JetBrains Mono",monospace}.formula-frac{display:grid;grid-template-rows:1fr 1fr;text-align:center}.formula-frac b:first-child{border-bottom:2px solid;padding-bottom:4px}.formula-frac b:last-child{padding-top:4px}.unknown{display:grid;place-items:center;width:52px;height:52px;border-radius:15px;background:#fff0ea;color:var(--orange);font-size:30px}.ratio-visual span{text-align:center;color:var(--orange);font-weight:800}.number-line{position:relative;height:125px;margin:5px 15px 15px}.number-line-track{position:absolute;left:3%;right:3%;top:48px;height:5px;background:#334155}.number-line-track i{position:absolute;top:-9px;width:4px;height:22px;background:#334155}.number-line-track i:first-child{left:0}.number-line-track .middle{left:50%;background:var(--orange);height:30px;top:-13px}.number-line-track i:last-child{right:0}.number-line .zero,.number-line .one{position:absolute;top:67px;font-weight:900}.number-line .zero{left:2%}.number-line .one{right:2%}.number-line-labels{position:absolute;left:50%;top:2px;transform:translateX(-50%);display:flex;gap:9px;color:var(--orange)}
.match-list,.classify-list{display:grid;gap:8px}.match-row{display:grid;grid-template-columns:70px 28px 1fr;align-items:center;padding:9px 11px;border-radius:15px;background:#fff}.match-row>span{text-align:center;color:var(--orange);font-size:21px}.match-row>div{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.match-row button,.classify-row button{border:2px solid #e2e8f0;border-radius:11px;background:#f8fafc;padding:8px;color:var(--ink);font-weight:800;cursor:pointer}.match-row button.selected,.classify-row button.selected{border-color:var(--orange);background:#fff3ee}.classify-row{display:grid;grid-template-columns:1.1fr .8fr .8fr;gap:7px;align-items:center;padding:9px 11px;border-radius:14px;background:#fff}.classify-row>span{font:800 15px "JetBrains Mono",monospace}.summary-card{background:#fff;border-radius:22px;padding:22px;box-shadow:0 12px 35px #17203312}.score-box{display:flex;align-items:baseline;gap:10px;padding:15px;border-radius:16px;background:var(--greenSoft);color:var(--green);margin:12px 0}.score-box strong{font:900 34px "JetBrains Mono",monospace}.summary-points{display:grid;gap:9px}.summary-points div{padding:11px 13px;border-left:4px solid var(--orange);border-radius:12px;background:#fff3ee}.summary-points b{margin-right:8px;color:var(--orange)}
.d7-nav{flex:none;display:flex;justify-content:space-between;gap:10px;padding:10px 18px 14px;border-top:1px solid #e7e3dc;background:#f6f4ef}.nav-btn{min-width:120px;border:0;border-radius:13px;padding:12px 18px;font-weight:850;cursor:pointer}.nav-btn.back{background:#fff;color:#334155}.nav-btn.next{background:#172033;color:#fff}.nav-btn.next.ready{background:var(--orange);animation:readyPulse 1.6s infinite}.nav-btn:disabled{opacity:.38;cursor:not-allowed;animation:none}.fade-up{animation:fadeUp .35s both}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}}@keyframes pulse{50%{transform:scale(1.07)}}@keyframes readyPulse{50%{box-shadow:0 0 0 7px #ff4f2820}}
@media(max-width:639.98px){.d7-root{width:390px}.d7-header{padding:9px 10px 7px;gap:7px}.d7-eyebrow{max-width:132px;overflow:hidden;text-overflow:ellipsis}.d7-content{padding:12px 13px 18px}.topic-card{grid-template-columns:1fr;padding:15px;gap:11px}.topic-art{min-height:145px}.slide-title{font-size:24px}.slide-subtitle{font-size:14px}.option{min-height:52px;padding:8px 10px}.compare-bars{gap:5px}.equation-card{min-height:92px;gap:9px}.match-row{grid-template-columns:53px 20px 1fr;padding:7px}.match-row>div{gap:3px}.match-row button{padding:6px 3px}.classify-row{grid-template-columns:1fr .7fr .7fr;padding:7px}.classify-row button{padding:7px 3px;font-size:11px}.d7-nav{padding:8px 11px 10px}.nav-btn{min-width:105px;padding:11px}.summary-card{padding:15px}}
@media(prefers-reduced-motion:reduce){.d7-root *{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}
`;

export default function Dars07({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender = 'm',
  onFinished,
}) {
  useMobileZoom();
  const preview = langProp == null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const [muted, setMuted] = useState(false);
  const narrator = useNarrator({ lang, muted, ttsApiBase, voiceGender });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ready, setReady] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const startRef = useRef(Date.now());
  const slide = SLIDES[current];
  const ui = UI[lang];

  useEffect(() => {
    setVisibleSteps(0);
    setReady(slide.type === 'question' || slide.type === 'multi' || slide.type === 'match' || slide.type === 'classify' || slide.type === 'number');
    const content = slide.type === 'title' || slide.type === 'summary'
      ? [slide.audio[lang]]
      : slide.type === 'info' || slide.type === 'rule'
        ? slide.steps.map((step) => step[lang])
        : [slide.intro[lang]];
    narrator.play(content, (index) => {
      if (slide.type === 'info' || slide.type === 'rule') setVisibleSteps(index + 1);
    }).then((completed) => {
      if (!completed) return;
      if (slide.type === 'title') setReady(true);
      if (slide.type === 'info' || slide.type === 'rule' || slide.type === 'summary') {
        setVisibleSteps(slide.steps?.length || 0);
        setReady(true);
      }
    });
    return narrator.stop;
  }, [current, lang]); // narrator methods are stable; screen/lang intentionally restart narration.

  const record = useCallback((result) => {
    setAnswers((prev) => ({ ...prev, [current]: result }));
    setReady(true);
  }, [current]);

  const scoredSlides = SLIDES.filter((item) => item.scored);
  const firstTryScore = SLIDES.reduce(
    (total, item, index) => total + (item.scored && answers[index]?.firstTry ? 1 : 0),
    0,
  );

  const finish = () => {
    const score = scoredSlides.reduce((total, item) => {
      const screenIndex = SLIDES.indexOf(item);
      return total + (answers[screenIndex]?.firstTry ? 1 : 0);
    }, 0);
    onFinished?.({
      lessonId: 'frac_6_07',
      lessonTitle: "Kasrning asosiy xossasi",
      studentName: studentName || "O'quvchi",
      durationSec: Math.floor((Date.now() - startRef.current) / 1000),
      totalQuestions: scoredSlides.length,
      correctAnswers: score,
      scorePercent: Math.round((score / scoredSlides.length) * 100),
      finalScore: score,
      finalTotal: scoredSlides.length,
      passed: true,
      answers: Object.entries(answers).map(([screen, value]) => ({ screen: Number(screen), ...value })),
    });
  };

  const renderBody = () => {
    if (slide.type === 'title') return (
      <div className="topic-card">
        <div>
          <div className="d7-eyebrow">{ui.topic}</div>
          <h1 className="slide-title" style={{ marginTop: 12 }}>{slide.title[lang]}</h1>
          <p className="slide-subtitle">{slide.subtitle[lang]}</p>
          {ready && <div className="start-panel fade-up"><strong>{ui.ready}</strong><div className="start-actions"><button onClick={() => setCurrent(1)}>{ui.yes}</button><button onClick={() => setCurrent(1)}>{ui.curious}</button></div></div>}
        </div>
        <div className="topic-art"><SlideVisual kind="split" lang={lang}/></div>
      </div>
    );
    if (slide.type === 'info' || slide.type === 'rule') return (
      <div className={slide.type === 'rule' ? 'rule-card' : 'info-card'}>
        <SlideVisual kind={slide.visual} lang={lang}/>
        <div className="step-list">
          {slide.steps.map((step, index) => visibleSteps > index && <div className="step-row fade-up" key={index}><b>{index + 1}</b><p>{step[lang]}</p></div>)}
        </div>
      </div>
    );
    if (slide.type === 'multi') return <MultiSlide key={current} slide={slide} lang={lang} narrator={narrator} stored={answers[current]} onSolved={record}/>;
    if (slide.type === 'match') return <MatchSlide key={current} slide={slide} lang={lang} narrator={narrator} stored={answers[current]} onSolved={record}/>;
    if (slide.type === 'classify') return <ClassifySlide key={current} slide={slide} lang={lang} narrator={narrator} stored={answers[current]} onSolved={record}/>;
    if (slide.type === 'question' || slide.type === 'number') return <QuestionSlide key={current} slide={slide} lang={lang} narrator={narrator} stored={answers[current]} onSolved={record}/>;
    return (
      <div className="summary-card">
        <h1 className="slide-title">{slide.title[lang]}</h1>
        <div className="score-box"><strong>{firstTryScore}/{scoredSlides.length}</strong><span>{ui.result}</span></div>
        <h3>{ui.main}</h3>
        <div className="summary-points">{slide.points.map((point, index) => <div key={index}><b>{index + 1}.</b>{point[lang]}</div>)}</div>
      </div>
    );
  };

  return (
    <div className="d7-root">
      <style>{styles}</style>
      {preview && <div style={{ position: 'fixed', right: 10, top: 54, zIndex: 50, display: 'flex', gap: 4 }}><button className="icon-btn" onClick={() => setPreviewLang('uz')}>UZ</button><button className="icon-btn" onClick={() => setPreviewLang('ru')}>RU</button></div>}
      <div className="d7-stage">
        <header className="d7-header">
          <div className="d7-eyebrow">{slide.eyebrow[lang]}</div>
          <div className="d7-progress"><span style={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}/></div>
          <div className="d7-count">{current + 1}/{SLIDES.length}</div>
          <div className="audio-tools">
            <button title={ui.replay} className={`icon-btn ${narrator.isPlaying ? 'playing' : ''}`} onClick={narrator.replay}>↻</button>
            <button
              title={muted ? ui.soundOn : ui.soundOff}
              className="icon-btn"
              onClick={() => {
                narrator.stop();
                setMuted((value) => !value);
                if (slide.type === 'title' || slide.type === 'summary') setReady(true);
                if (slide.type === 'info' || slide.type === 'rule') {
                  setVisibleSteps(slide.steps.length);
                  setReady(true);
                }
              }}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </header>
        <main className="d7-content">
          <div className="d7-inner">
            {slide.type !== 'title' && slide.type !== 'summary' && <h1 className="slide-title">{slide.title[lang]}</h1>}
            {renderBody()}
          </div>
        </main>
        {slide.type !== 'title' && (
          <nav className="d7-nav">
            <button className="nav-btn back" disabled={current === 0} onClick={() => { narrator.stop(); setCurrent((value) => Math.max(0, value - 1)); }}>{ui.back}</button>
            {slide.type === 'summary'
              ? <button className="nav-btn next ready" onClick={finish}>{ui.finish}</button>
              : <button className={`nav-btn next ${ready ? 'ready' : ''}`} disabled={!ready} onClick={() => { narrator.stop(); setCurrent((value) => Math.min(SLIDES.length - 1, value + 1)); }}>{ui.next}</button>}
          </nav>
        )}
      </div>
    </div>
  );
}
