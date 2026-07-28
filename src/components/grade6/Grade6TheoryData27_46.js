const L = (uz, ru) => ({ uz, ru });
const P = (...pairs) => pairs.map(([uz, ru]) => L(uz, ru));

const eq = (expression) => ({ type: 'equation', expression });
const chain = (...items) => ({ type: 'chain', items });
const cards = (...items) => ({ type: 'cards', items });
const panels = (...items) => ({ type: 'panels', panels: items });

const C = (title, steps, visual, rule = false) => ({
  type: rule ? 'rule' : 'info',
  eyebrow: rule ? L('Asosiy qoida', 'Главное правило') : L('Tushuntirish', 'Объяснение'),
  title,
  steps,
  visual,
});

const Q = (title, prompt, intro, options, correct, why, wrong, visual) => ({
  type: 'question',
  scored: true,
  eyebrow: L('Mashq', 'Практика'),
  title,
  prompt,
  intro,
  options,
  correct,
  why,
  wrong,
  visual,
});

const M = (title, intro, options, correctSet, why, wrong) => ({
  type: 'multi',
  scored: true,
  eyebrow: L('Bir nechta javob', 'Несколько ответов'),
  title,
  intro,
  options,
  correctSet,
  why,
  wrong,
});

const MATCH = (title, prompt, intro, rows, why, wrong) => ({
  type: 'match',
  scored: true,
  eyebrow: L('Moslashtirish', 'Соответствие'),
  title,
  prompt,
  intro,
  rows,
  why,
  wrong,
});

const CLS = (title, prompt, intro, binA, binB, items, why, wrong) => ({
  type: 'classify',
  scored: true,
  eyebrow: L('Tasniflash', 'Классификация'),
  title,
  prompt,
  intro,
  binA,
  binB,
  cards: items.map(([label, value]) => ({ label, value })),
  why,
  wrong,
});

const makeLesson = ({ id, title, subtitle, decorations, visual, hook, concepts, tasks, summary }) => {
  const slides = [{
    type: 'title',
    eyebrow: L('Yangi mavzu', 'Новая тема'),
    title,
    subtitle,
    audio: L(`${title.uz}. ${subtitle.uz}`, `${title.ru}. ${subtitle.ru}`),
    visual,
  }, { ...hook, scored: false, eyebrow: L('Kirish savoli', 'Вводный вопрос') }];

  let taskIndex = 0;
  concepts.forEach((concept, conceptIndex) => {
    slides.push(concept);
    const shouldHave = Math.floor(((conceptIndex + 1) * tasks.length) / concepts.length);
    while (taskIndex < shouldHave) slides.push(tasks[taskIndex++]);
  });
  while (taskIndex < tasks.length) slides.push(tasks[taskIndex++]);

  slides.push({
    type: 'summary',
    eyebrow: L('Dars yakuni', 'Итог урока'),
    title: L(`${title.uz}: xulosa`, `${title.ru}: итог`),
    points: summary,
    close: L(
      `Siz ${title.uz.toLowerCase()} mavzusining asosiy qoidalarini o'rgandingiz.`,
      `Вы освоили основные правила темы «${title.ru.toLowerCase()}».`,
    ),
    audio: L(
      `Dars yakuni. ${summary.map((item) => item.uz).join(' ')}`,
      `Итог урока. ${summary.map((item) => item.ru).join(' ')}`,
    ),
  });

  return {
    id: `grade6_theory_${id}`,
    title,
    decorations,
    slides,
    scoredScreens: slides.flatMap((slide, index) => (slide.scored ? [index] : [])),
  };
};

const D27 = makeLesson({
  id: 27,
  title: L("Ratsional sonlarni qo'shish", 'Сложение рациональных чисел'),
  subtitle: L("Bir xil va har xil ishorali sonlarni koordinata chizig'i hamda qoidalar bilan qo'shamiz.", 'Сложим числа с одинаковыми и разными знаками по правилам и на координатной прямой.'),
  decorations: ['−4', '+7', '−3+8', '5+(−9)'],
  visual: chain('−3', '+ 5', '2'),
  hook: Q(
    L('Harorat qanday o‘zgardi?', 'Как изменилась температура?'),
    L("Ertalab harorat −3°C edi, kunduzi 5°C ga ko'tarildi. Yangi haroratni toping.", 'Утром было −3°C, днём потеплело на 5°C. Найдите новую температуру.'),
    L("Manfiy uchdan o'ngga besh birlik siljiymiz.", 'От минус трёх переместимся на пять единиц вправо.'),
    ['−8°C', '−2°C', '2°C', '8°C'], 2,
    P(["−3 + 5 = 2.", '−3 + 5 = 2.'], ["Ko'tarilish musbat yo'nalishdagi siljishdir.", 'Потепление — движение в положительном направлении.']),
    L("−3 dan o'ngga 5 birlik sanang.", 'От −3 отсчитайте 5 единиц вправо.'), eq('−3 + 5 = ?'),
  ),
  concepts: [
    C(L("Qo'shish — chiziqda siljish", 'Сложение — движение по прямой'), P(
      ["Musbat son qo'shilsa, koordinata chizig'ida o'ngga yuramiz.", 'При добавлении положительного числа движемся вправо.'],
      ["Manfiy son qo'shilsa, chapga yuramiz.", 'При добавлении отрицательного числа движемся влево.'],
    ), { type: 'numberLine', points: [{ at: 22, label: '−3' }, { at: 66, label: '2' }] }),
    C(L('Bir xil ishorali sonlar', 'Числа с одинаковыми знаками'), P(
      ["Modullarni qo'shib, umumiy ishorani saqlaymiz.", 'Складываем модули и сохраняем общий знак.'],
      ["−4 + (−6) = −(4 + 6) = −10.", '−4 + (−6) = −(4 + 6) = −10.'],
    ), chain('−4 + (−6)', '−(4+6)', '−10'), true),
    C(L('Har xil ishorali sonlar', 'Числа с разными знаками'), P(
      ["Katta moduldan kichik modulni ayiramiz.", 'Из большего модуля вычитаем меньший.'],
      ["Javobga moduli katta sonning ishorasini qo'yamiz: −9 + 4 = −5.", 'Ставим знак числа с большим модулем: −9 + 4 = −5.'],
    ), panels(
      { title: L('Modullar', 'Модули'), lines: ['9 − 4 = 5'], color: 'yellow' },
      { title: L('Ishora', 'Знак'), lines: ['|−9| > |4| → −5'], color: 'blue' },
    ), true),
    C(L('Nol bilan bog‘liq xossalar', 'Свойства нуля'), P(
      ["a + 0 = a: nol sonni o'zgartirmaydi.", 'a + 0 = a: ноль не меняет число.'],
      ["Qarama-qarshi sonlar yig'indisi nol: a + (−a) = 0.", 'Сумма противоположных чисел равна нулю: a + (−a) = 0.'],
    ), cards('a + 0 = a', 'a + (−a) = 0')),
    C(L("Qavs ichidagi manfiy son", 'Отрицательное число в скобках'), P(
      ["5 + (−8) yozuvi beshga manfiy sakkizni qo'shishni bildiradi.", 'Запись 5 + (−8) означает прибавить к пяти минус восемь.'],
      ["Har xil ishoralar qoidasiga ko'ra 8 − 5 = 3 va javob −3.", 'По правилу разных знаков 8 − 5 = 3, ответ −3.'],
    ), chain('5 + (−8)', '8 − 5', '−3')),
    C(L('Amallar xossalari', 'Свойства сложения'), P(
      ["O'rin almashtirish: a + b = b + a.", 'Переместительное свойство: a + b = b + a.'],
      ["Guruhlash: (a + b) + c = a + (b + c). Qulay juftlarni avval qo'shish mumkin.", 'Сочетательное свойство позволяет сначала складывать удобные пары.'],
    ), cards('−7 + 7 = 0', '0 + 12 = 12')),
    C(L('Hayotiy tekshiruv', 'Проверка смыслом'), P(
      ["Qarz manfiy, tushum musbat son bilan ifodalanishi mumkin.", 'Долг можно обозначить отрицательным, поступление — положительным числом.'],
      ["−20 000 + 35 000 = 15 000: tushum qarzdan katta bo'lgani uchun natija musbat.", '−20 000 + 35 000 = 15 000: поступление больше долга, поэтому результат положительный.'],
    ), chain('−20 000', '+35 000', '15 000')),
    C(L('Xatoni oldindan ko‘ring', 'Предупредите ошибку'), P(
      ["Har xil ishorali sonlarda modullar qo'shilmaydi, ayiriladi.", 'У чисел с разными знаками модули не складывают, а вычитают.'],
      ["Ishorani sonning o'ziga emas, moduli kattaroq songa qarab tanlang.", 'Знак выбирают по числу с большим модулем.'],
    ), panels(
      { title: L("Noto'g'ri", 'Неверно'), lines: ['−8 + 3 = −11'], color: 'yellow' },
      { title: L("To'g'ri", 'Верно'), lines: ['−8 + 3 = −5'], color: 'green' },
    )),
  ],
  tasks: [
    Q(L('Bir xil ishoralarni qo‘shing', 'Сложите числа одного знака'), L('−7 + (−5) ni hisoblang.', 'Вычислите −7 + (−5).'), L("Modullarni qo'shib, manfiy ishorani saqlang.", 'Сложите модули и сохраните знак минус.'), ['−12', '−2', '2', '12'], 0, P(["7 + 5 = 12.", '7 + 5 = 12.'], ["Ikkala son manfiy, shuning uchun javob −12.", 'Оба числа отрицательны, поэтому ответ −12.']), L("Ikkala sonning ishorasi bir xil.", 'Знаки чисел одинаковы.'), eq('−7 + (−5) = ?')),
    Q(L('Har xil ishoralarni qo‘shing', 'Сложите числа разных знаков'), L('−13 + 8 ni toping.', 'Найдите −13 + 8.'), L("13 dan 8 ni ayiring va moduli katta sonning ishorasini oling.", 'Вычтите 8 из 13 и возьмите знак числа с большим модулем.'), ['−21', '−5', '5', '21'], 1, P(["13 − 8 = 5.", '13 − 8 = 5.'], ["|−13| katta, demak javob −5.", '|−13| больше, значит ответ −5.']), L('Modullarni taqqoslang.', 'Сравните модули.'), eq('−13 + 8 = ?')),
    M(L("Yig'indisi nol bo'lganlarni tanlang", 'Выберите суммы, равные нулю'), L('Qarama-qarshi sonlar juftlarini toping.', 'Найдите пары противоположных чисел.'), ['−6 + 6', '4 + (−3)', '−9 + 9', '−2 + (−2)'], [0, 2], P(["−6 va 6 qarama-qarshi; −9 va 9 ham qarama-qarshi.", '−6 и 6 противоположны; −9 и 9 тоже.'], ["Qarama-qarshi sonlar yig'indisi nol.", 'Сумма противоположных чисел равна нулю.']), L('Faqat modullari teng, ishoralari qarama-qarshi juftlarni tanlang.', 'Выберите пары с равными модулями и разными знаками.')),
    Q(L('Qulay usulda hisoblang', 'Вычислите удобным способом'), L('−12 + 7 + 12 ni toping.', 'Найдите −12 + 7 + 12.'), L("Avval −12 va 12 ni qo'shing.", 'Сначала сложите −12 и 12.'), ['−7', '0', '7', '31'], 2, P(["−12 + 12 = 0.", '−12 + 12 = 0.'], ["0 + 7 = 7.", '0 + 7 = 7.']), L('Qarama-qarshi sonlarni guruhlang.', 'Сгруппируйте противоположные числа.'), chain('−12 + 12', '0', '+7 = 7')),
    Q(L('Hisobdagi qoldiq', 'Остаток на счёте'), L("Hisobda −25 000 so'm qarz bor edi. 40 000 so'm tushdi. Qoldiq qancha?", 'На счёте был долг 25 000 сумов. Поступило 40 000 сумов. Каков остаток?'), L("Qarzni manfiy, tushumni musbat son bilan yozing.", 'Запишите долг отрицательным, поступление положительным числом.'), ["−65 000 so'm", "−15 000 so'm", "15 000 so'm", "65 000 so'm"], 2, P(["−25 000 + 40 000 = 15 000.", '−25 000 + 40 000 = 15 000.'], ["Tushum qarzni yopib, 15 000 so'm qoldirdi.", 'Поступление погасило долг, осталось 15 000 сумов.']), L('40 000 dan 25 000 ni ayiring.', 'Вычтите 25 000 из 40 000.'), eq('−25 000 + 40 000 = ?')),
  ],
  summary: P(
    ["Bir xil ishoralarda modullar qo'shiladi va ishora saqlanadi.", 'При одинаковых знаках модули складывают и знак сохраняют.'],
    ["Har xil ishoralarda modullar ayiriladi va katta modulning ishorasi olinadi.", 'При разных знаках модули вычитают и берут знак большего модуля.'],
    ["Qarama-qarshi sonlar yig'indisi nolga teng.", 'Сумма противоположных чисел равна нулю.'],
  ),
});

const D28 = makeLesson({
  id: 28,
  title: L('Ratsional sonlarni ayirish', 'Вычитание рациональных чисел'),
  subtitle: L("Ayirishni qarama-qarshi sonni qo'shishga aylantirib, ishoralarni xatosiz boshqaramiz.", 'Заменим вычитание сложением противоположного числа и разберёмся со знаками.'),
  decorations: ['7−(−3)', '−5−8', 'a−b', '−(−4)'],
  visual: chain('7 − (−3)', '7 + 3', '10'),
  hook: Q(L('Harorat pasaydi', 'Температура понизилась'), L("Harorat 4°C edi, 7°C ga pasaydi. Yangi harorat necha daraja?", 'Было 4°C, температура понизилась на 7°C. Какой стала температура?'), L("To'rt sonidan chapga yetti birlik siljiymiz.", 'От четырёх переместимся на семь единиц влево.'), ['−11°C', '−3°C', '3°C', '11°C'], 1, P(["4 − 7 = −3.", '4 − 7 = −3.'], ["Noldan 3 birlik chapda −3 turadi.", 'На 3 единицы левее нуля находится −3.']), L('Koordinata chizig‘ida chapga yuring.', 'Двигайтесь по прямой влево.'), eq('4 − 7 = ?')),
  concepts: [
    C(L('Ayirishning asosiy qoidasi', 'Главное правило вычитания'), P(["a − b = a + (−b).", 'a − b = a + (−b).'], ["Ayiriluvchining ishorasini qarama-qarshisiga almashtirib, qo'shishga o'tamiz.", 'Меняем знак вычитаемого на противоположный и переходим к сложению.']), chain('a − b', 'a + (−b)'), true),
    C(L('Musbat sonni ayirish', 'Вычитание положительного числа'), P(["6 − 9 = 6 + (−9).", '6 − 9 = 6 + (−9).'], ["Har xil ishorali sonlar yig'indisi: 9 − 6 = 3, javob −3.", 'Сумма чисел разных знаков: 9 − 6 = 3, ответ −3.']), chain('6 − 9', '6 + (−9)', '−3')),
    C(L('Manfiy sonni ayirish', 'Вычитание отрицательного числа'), P(["Manfiy sonni ayirishda ayirish amali qo'shishga aylanadi.", 'Два минуса рядом превращаются в плюс.'], ["7 − (−4) = 7 + 4 = 11.", '7 − (−4) = 7 + 4 = 11.']), chain('7 − (−4)', '7 + 4', '11'), true),
    C(L('Manfiy sondan ayirish', 'Вычитание из отрицательного числа'), P(["−5 − 3 = −5 + (−3).", '−5 − 3 = −5 + (−3).'], ["Bir xil manfiy ishoralar: 5 + 3 = 8, javob −8.", 'Одинаковые отрицательные знаки: 5 + 3 = 8, ответ −8.']), eq('−5 − 3 = −8')),
    C(L('Qavslarni ehtiyotkor oching', 'Осторожно раскрывайте скобки'), P(["−(−6) ifoda 6 ga teng, chunki −6 ning qarama-qarshisi 6.", '−(−6) равно 6, потому что противоположное числу −6 есть 6.'], ["3 − (−6) = 3 + 6 = 9.", '3 − (−6) = 3 + 6 = 9.']), cards('−(−6)=6', '3−(−6)=9')),
    C(L('Masofa va ayirma', 'Расстояние и разность'), P(["Ikki koordinata orasidagi masofa |b − a| formula bilan topiladi.", 'Расстояние между координатами находят по формуле |b − a|.'], ["−4 va 5 orasidagi masofa |5 − (−4)| = 9.", 'Расстояние между −4 и 5 равно |5 − (−4)| = 9.']), chain('5 − (−4)', '9')),
    C(L('Hisobni tekshirish', 'Проверка вычисления'), P(["a − b = c bo'lsa, c + b = a bo'lishi kerak.", 'Если a − b = c, то c + b = a.'], ["−2 − 5 = −7 ni tekshiramiz: −7 + 5 = −2.", 'Проверим −2 − 5 = −7: −7 + 5 = −2.']), panels({ title: L('Ayirish', 'Вычитание'), lines: ['−2−5=−7'], color: 'yellow' }, { title: L('Tekshirish', 'Проверка'), lines: ['−7+5=−2'], color: 'green' })),
    C(L('Keng tarqalgan xato', 'Частая ошибка'), P(["−8 − (−3) da sonlar moduli shunchaki qo'shilmaydi.", 'В выражении −8 − (−3) модули не складывают.'], ["Avval qo'shishga aylantiring: −8 + 3 = −5.", 'Сначала замените сложением: −8 + 3 = −5.']), panels({ title: L("Noto'g'ri", 'Неверно'), lines: ['−8−(−3)=−11'], color: 'yellow' }, { title: L("To'g'ri", 'Верно'), lines: ['−8+3=−5'], color: 'green' })),
  ],
  tasks: [
    Q(L('Manfiy sonni ayiring', 'Вычтите отрицательное число'), L('8 − (−5) ni toping.', 'Найдите 8 − (−5).'), L("Ikki minusni qo'shishga aylantiring.", 'Замените два минуса плюсом.'), ['3', '−3', '13', '−13'], 2, P(["8 − (−5) = 8 + 5.", '8 − (−5) = 8 + 5.'], ["8 + 5 = 13.", '8 + 5 = 13.']), L('Ayirishni qo‘shishga almashtiring.', 'Замените вычитание сложением.'), chain('8−(−5)', '8+5', '13')),
    Q(L('Manfiy sondan ayiring', 'Вычтите из отрицательного числа'), L('−6 − 7 ni hisoblang.', 'Вычислите −6 − 7.'), L('−6 ga manfiy 7 ni qo‘shing.', 'К −6 прибавьте −7.'), ['−13', '−1', '1', '13'], 0, P(["−6 − 7 = −6 + (−7).", '−6 − 7 = −6 + (−7).'], ["Modullar yig'indisi 13, ishora manfiy.", 'Сумма модулей 13, знак отрицательный.']), L('Bir xil manfiy ishoralar qoidasini ishlating.', 'Примените правило одинаковых отрицательных знаков.'), eq('−6 − 7 = ?')),
    M(L('Musbat natijalarni tanlang', 'Выберите положительные результаты'), L('Har bir ayirishni avval qo‘shishga aylantiring.', 'Сначала замените каждое вычитание сложением.'), ['4−(−2)', '−3−5', '−7−(−9)', '2−8'], [0, 2], P(["4−(−2)=6 va −7−(−9)=2.", '4−(−2)=6 и −7−(−9)=2.'], ["Qolgan ikki natija manfiy.", 'Два остальных результата отрицательны.']), L('Ikki minus yonma-yon turgan misollarni tekshiring.', 'Проверьте примеры с двумя минусами рядом.')),
    Q(L('Nuqtalar orasidagi masofa', 'Расстояние между точками'), L('A(−6) va B(4) orasidagi masofani toping.', 'Найдите расстояние между A(−6) и B(4).'), L('O‘ng koordinatadan chap koordinatani ayiring.', 'Вычтите левую координату из правой.'), ['2', '10', '−10', '24'], 1, P(["4 − (−6) = 4 + 6.", '4 − (−6) = 4 + 6.'], ["Masofa 10 birlik.", 'Расстояние равно 10 единицам.']), L('Masofa manfiy bo‘lmaydi.', 'Расстояние не бывает отрицательным.'), eq('|4 − (−6)| = ?')),
    Q(L('Liftning yangi qavati', 'Новый этаж лифта'), L('Lift 3-qavatda edi va 8 qavat pastga tushdi. Qaysi qavatga keldi?', 'Лифт был на 3-м этаже и спустился на 8 этажей. На каком этаже оказался?'), L('Pastga tushish ayirish bilan ifodalanadi.', 'Движение вниз выражается вычитанием.'), ['−11', '−5', '5', '11'], 1, P(["3 − 8 = −5.", '3 − 8 = −5.'], ["Lift shartli −5-qavatga keldi.", 'Лифт оказался на условном этаже −5.']), L('3 dan chapga 8 birlik siljing.', 'От 3 переместитесь на 8 единиц влево.'), eq('3 − 8 = ?')),
  ],
  summary: P(
    ["Ayirish — kamayuvchiga ayiriluvchining qarama-qarshisini qo'shishdir.", 'Вычитание — это прибавление числа, противоположного вычитаемому.'],
    ["a − (−b) = a + b.", 'a − (−b) = a + b.'],
    ["Natijani qo'shish amali bilan tekshirish mumkin.", 'Результат можно проверить сложением.'],
  ),
});

const D29 = makeLesson({
  id: 29,
  title: L("Ratsional sonlarni ko'paytirish va bo'lish", 'Умножение и деление рациональных чисел'),
  subtitle: L("Modullar bilan hisoblab, natija ishorasini ishoralar jadvali orqali aniqlaymiz.", 'Вычислим модули и определим знак результата по таблице знаков.'),
  decorations: ['−3·4', '−6:(−2)', '(−)·(−)', '(+)·(−)'],
  visual: panels({ title: L('Bir xil ishora', 'Одинаковые знаки'), lines: ['+'], color: 'green' }, { title: L('Har xil ishora', 'Разные знаки'), lines: ['−'], color: 'yellow' }),
  hook: Q(L('Qarzning o‘zgarishi', 'Изменение долга'), L("Qarz har kuni 4 000 so'mdan 3 kun oshdi. O'zgarishni qanday son ifodalaydi?", 'Долг увеличивался на 4 000 сумов в день 3 дня. Каким числом выражается изменение?'), L("Qarzning ortishini manfiy o'zgarish deb olamiz.", 'Рост долга считаем отрицательным изменением.'), ["−12 000 so'm", "−7 000 so'm", "7 000 so'm", "12 000 so'm"], 0, P(["3 · (−4 000) = −12 000.", '3 · (−4 000) = −12 000.'], ["Har xil ishoralar natijasi manfiy.", 'Произведение разных знаков отрицательно.']), L('Modullarni ko‘paytirib, ishorani aniqlang.', 'Умножьте модули и определите знак.'), eq('3 · (−4 000) = ?')),
  concepts: [
    C(L("Ko'paytirishda ishoralar", 'Знаки при умножении'), P(["Bir xil ishoralar ko'paytmasi musbat.", 'Произведение одинаковых знаков положительно.'], ["Har xil ishoralar ko'paytmasi manfiy.", 'Произведение разных знаков отрицательно.']), cards('(+)·(+)=+', '(−)·(−)=+', '(+)·(−)=−'), true),
    C(L("Bo'lishda ham shu qoida", 'То же правило при делении'), P(["Bir xil ishorali sonlar bo'linmasi musbat.", 'Частное чисел с одинаковыми знаками положительно.'], ["Har xil ishorali sonlar bo'linmasi manfiy.", 'Частное чисел с разными знаками отрицательно.']), cards('(−):(−)=+', '(−):(+)=−'), true),
    C(L('Hisoblash tartibi', 'Порядок вычисления'), P(["Avval modullarni ko'paytiring yoki bo'ling.", 'Сначала умножьте или разделите модули.'], ["Keyin ishoralar jadvali bilan natija ishorasini qo'ying.", 'Затем поставьте знак результата по таблице знаков.']), { type: 'steps', items: [L('Modullar', 'Модули'), L('Ishoralar', 'Знаки'), L('Javob', 'Ответ')] }),
    C(L('Nolning xossalari', 'Свойства нуля'), P(["a · 0 = 0 va 0 : a = 0, agar a nolga teng bo'lmasa.", 'a · 0 = 0 и 0 : a = 0, если a не равен нулю.'], ["Nolga bo'lish mumkin emas.", 'Делить на ноль нельзя.']), panels({ title: L('Mumkin', 'Можно'), lines: ['0:7=0'], color: 'green' }, { title: L('Mumkin emas', 'Нельзя'), lines: ['7:0'], color: 'yellow' }), true),
    C(L('Bir va minus bir', 'Единица и минус единица'), P(["a · 1 = a: birga ko'paytirish sonni o'zgartirmaydi.", 'a · 1 = a: умножение на один не меняет число.'], ["a · (−1) = −a: minus bir sonning ishorasini almashtiradi.", 'a · (−1) = −a: минус один меняет знак числа.']), cards('a·1=a', 'a·(−1)=−a')),
    C(L('Kasrlar bilan ratsional amallar', 'Действия с рациональными дробями'), P(["Ishora qoidasi kasrlarda ham o'zgarmaydi.", 'Правило знаков не меняется и для дробей.'], ["−2/3 · 9/4 = −18/12 = −3/2.", '−2/3 · 9/4 = −18/12 = −3/2.']), chain('−2/3 · 9/4', '−18/12', '−3/2')),
    C(L("Ko'paytuvchilar soni", 'Число отрицательных множителей'), P(["Manfiy ko'paytuvchilar soni juft bo'lsa, natija musbat.", 'Если отрицательных множителей чётное число, результат положительный.'], ["Ularning soni toq bo'lsa, natija manfiy.", 'Если их нечётное число, результат отрицательный.']), panels({ title: L('2 ta minus', '2 минуса'), lines: ['(−2)·(−3)=+6'], color: 'green' }, { title: L('3 ta minus', '3 минуса'), lines: ['(−2)·(−3)·(−1)=−6'], color: 'yellow' })),
    C(L('Amallar tartibi', 'Порядок действий'), P(["Qavs, ko'paytirish va bo'lish, so'ng qo'shish va ayirish bajariladi.", 'Сначала скобки, затем умножение и деление, потом сложение и вычитание.'], ["Bir xil bosqichdagi amallar chapdan o'ngga bajariladi.", 'Действия одной ступени выполняются слева направо.']), chain('qavs', '· va :', '+ va −')),
    C(L('Natijani baholang', 'Оцените результат'), P(["−48 : 6 javobi manfiy bo'lishi shart, chunki ishoralar har xil.", 'Ответ −48 : 6 должен быть отрицательным, потому что знаки разные.'], ["Modullar bo'yicha 48 : 6 = 8, demak javob −8.", 'По модулям 48 : 6 = 8, значит ответ −8.']), chain('−48 : 6', '−8')),
  ],
  tasks: [
    Q(L("Ko'paytmani toping", 'Найдите произведение'), L('(−7) · (−6) ni hisoblang.', 'Вычислите (−7) · (−6).'), L('Ikkala ko‘paytuvchi manfiy.', 'Оба множителя отрицательны.'), ['−42', '−13', '13', '42'], 3, P(["7 · 6 = 42.", '7 · 6 = 42.'], ["Bir xil ishoralar natijasi musbat.", 'Одинаковые знаки дают плюс.']), L('Minus karra minus — plus.', 'Минус на минус даёт плюс.'), eq('(−7) · (−6) = ?')),
    Q(L("Bo'linmani toping", 'Найдите частное'), L('54 : (−9) ni toping.', 'Найдите 54 : (−9).'), L('Ishoralar har xil.', 'Знаки разные.'), ['−6', '−5', '5', '6'], 0, P(["54 : 9 = 6.", '54 : 9 = 6.'], ["Har xil ishoralar natijasi −6.", 'Разные знаки дают −6.']), L('Modullarni bo‘ling va minus qo‘ying.', 'Разделите модули и поставьте минус.'), eq('54 : (−9) = ?')),
    M(L('Musbat natijalarni belgilang', 'Отметьте положительные результаты'), L('Manfiy ko‘paytuvchilar sonini sanang.', 'Посчитайте отрицательные множители.'), ['(−2)·(−5)', '(−3)·4', '(−1)·(−2)·6', '7:(−1)'], [0, 2], P(["Birinchi va uchinchi ifodada minuslar soni juft.", 'В первом и третьем выражениях число минусов чётное.'], ["Juft sonli minuslar musbat natija beradi.", 'Чётное число минусов даёт положительный результат.']), L('Har bir ifodadagi minuslar sonini sanang.', 'Посчитайте минусы в каждом выражении.')),
    Q(L('Kasrlarni ko‘paytiring', 'Умножьте дроби'), L('−3/5 · 10/9 ni hisoblang.', 'Вычислите −3/5 · 10/9.'), L('Avval 3 bilan 9 ni, 10 bilan 5 ni qisqartiring.', 'Сократите 3 и 9, 10 и 5.'), ['−2/3', '−3/2', '2/3', '3/2'], 0, P(["−3/5 · 10/9 = −1/1 · 2/3.", '−3/5 · 10/9 = −1/1 · 2/3.'], ["Natija −2/3.", 'Результат −2/3.']), L('Ishora manfiy, kasrni qisqartiring.', 'Знак отрицательный, сократите дробь.'), chain('−3/5·10/9', '−2/3')),
    Q(L('Amallar tartibi', 'Порядок действий'), L('−4 + 3 · (−2) ni toping.', 'Найдите −4 + 3 · (−2).'), L('Avval ko‘paytirishni bajaring.', 'Сначала выполните умножение.'), ['−14', '−10', '2', '10'], 1, P(["3 · (−2) = −6.", '3 · (−2) = −6.'], ["−4 + (−6) = −10.", '−4 + (−6) = −10.']), L('Qo‘shishdan oldin ko‘paytirish bajariladi.', 'Умножение выполняется раньше сложения.'), chain('−4+3·(−2)', '−4+(−6)', '−10')),
  ],
  summary: P(
    ["Bir xil ishoralar ko'paytma va bo'linmada musbat natija beradi.", 'Одинаковые знаки при умножении и делении дают плюс.'],
    ["Har xil ishoralar manfiy natija beradi.", 'Разные знаки дают минус.'],
    ["Nolga bo'lish mumkin emas; amallar tartibi doim saqlanadi.", 'Делить на ноль нельзя; порядок действий всегда соблюдается.'],
  ),
});

const D30 = makeLesson({
  id: 30,
  title: L('Koordinata tekisligi', 'Координатная плоскость'),
  subtitle: L("Nuqtaning x va y koordinatalarini choraklar bo'yicha o'qiymiz va belgilaymiz.", 'Научимся читать и отмечать координаты x и y по четвертям.'),
  decorations: ['A(2;3)', 'x', 'y', 'O(0;0)'],
  visual: { type: 'coordinatePlane', points: [{ x: 3, y: 2, label: 'A(3;2)' }, { x: -2, y: 3, label: 'B(−2;3)', color: 'blue' }] },
  hook: Q(L('Nuqtaning manzili', 'Адрес точки'), L('A nuqta 3 birlik o‘ngda va 2 birlik yuqorida. Uning koordinatasi qaysi?', 'Точка A находится на 3 единицы вправо и 2 вверх. Каковы её координаты?'), L('Avval x, keyin y yoziladi.', 'Сначала записывают x, затем y.'), ['A(2;3)', 'A(3;2)', 'A(−3;2)', 'A(3;−2)'], 1, P(["O'ngga 3 — x = 3.", 'Вправо 3 — x = 3.'], ["Yuqoriga 2 — y = 2, demak A(3;2).", 'Вверх 2 — y = 2, значит A(3;2).']), L('Koordinatalar tartibini eslang: x; y.', 'Помните порядок координат: x; y.'), { type: 'coordinatePlane', points: [{ x: 3, y: 2, label: 'A' }] }),
  concepts: [
    C(L('Ikki koordinata o‘qi', 'Две координатные оси'), P(["Gorizontal o'q x, vertikal o'q y deb ataladi.", 'Горизонтальная ось называется x, вертикальная — y.'], ["Ular O(0;0) sanoq boshida kesishadi.", 'Они пересекаются в начале координат O(0;0).']), { type: 'coordinatePlane', points: [{ x: 0, y: 0, label: 'O' }] }),
    C(L('Koordinatalar tartibi', 'Порядок координат'), P(["A(x;y) yozuvida birinchi son gorizontal o'rinni bildiradi.", 'В записи A(x;y) первое число задаёт горизонтальное положение.'], ["Ikkinchi son vertikal o'rinni bildiradi.", 'Второе число задаёт вертикальное положение.']), chain('A(x;y)', 'avval x', 'keyin y'), true),
    C(L('Yo‘nalishlar va ishoralar', 'Направления и знаки'), P(["O'ngda x musbat, chapda x manfiy.", 'Справа x положителен, слева x отрицателен.'], ["Yuqorida y musbat, pastda y manfiy.", 'Сверху y положителен, снизу y отрицателен.']), panels({ title: L('Gorizontal', 'Горизонталь'), lines: ['chap − | + o‘ng'], color: 'blue' }, { title: L('Vertikal', 'Вертикаль'), lines: ['past − | + yuqori'], color: 'yellow' })),
    C(L('To‘rtta chorak', 'Четыре четверти'), P(["I chorakda (+;+), II chorakda (−;+).", 'В I четверти (+;+), во II (−;+).'], ["III chorakda (−;−), IV chorakda (+;−).", 'В III четверти (−;−), в IV (+;−).']), cards('I (+;+)', 'II (−;+)', 'III (−;−)', 'IV (+;−)'), true),
    C(L('Nuqtani belgilash', 'Как отметить точку'), P(["Masalan, B(−3;2): O dan 3 birlik chapga yuramiz.", 'Например, B(−3;2): от O идём на 3 единицы влево.'], ["So'ng 2 birlik yuqoriga chiqib nuqtani qo'yamiz.", 'Затем поднимаемся на 2 единицы вверх и ставим точку.']), { type: 'coordinatePlane', points: [{ x: -3, y: 2, label: 'B(−3;2)', color: 'blue' }] }),
    C(L('O‘qlardagi nuqtalar', 'Точки на осях'), P(["Nuqta x o'qida bo'lsa, uning y koordinatasi nol.", 'У точки на оси x координата y равна нулю.'], ["Nuqta y o'qida bo'lsa, uning x koordinatasi nol.", 'У точки на оси y координата x равна нулю.']), cards('C(4;0)', 'D(0;−3)')),
    C(L('Koordinatalardan masofa', 'Расстояния по координатам'), P(["y koordinatalari bir xil nuqtalar orasidagi gorizontal masofa |x₂−x₁|.", 'Для точек с одинаковым y горизонтальное расстояние равно |x₂−x₁|.'], ["x koordinatalari bir xil nuqtalar orasidagi vertikal masofa |y₂−y₁|.", 'Для точек с одинаковым x вертикальное расстояние равно |y₂−y₁|.']), panels({ title: 'A(−2;1), B(4;1)', lines: ['|4−(−2)|=6'], color: 'green' }, { title: 'C(3;−1), D(3;5)', lines: ['|5−(−1)|=6'], color: 'yellow' })),
    C(L('Hayotiy qo‘llanish', 'Применение в жизни'), P(["Xarita kataklari, o'yin maydoni va kompyuter grafikasi koordinatalardan foydalanadi.", 'Карты, игровые поля и компьютерная графика используют координаты.'], ["Har bir nuqta ikki sonli aniq manzilga ega.", 'Каждая точка имеет точный адрес из двух чисел.']), { type: 'coordinatePlane', points: [{ x: 2, y: -2, label: L('Uy', 'Дом') }, { x: -3, y: 3, label: L('Maktab', 'Школа'), color: 'green' }] }),
  ],
  tasks: [
    Q(L('Chorakni aniqlang', 'Определите четверть'), L('P(−4;3) qaysi chorakda?', 'В какой четверти находится P(−4;3)?'), L('x manfiy, y musbat.', 'x отрицателен, y положителен.'), ['I', 'II', 'III', 'IV'], 1, P(["(−;+) belgilar II chorakka tegishli.", 'Знаки (−;+) соответствуют II четверти.'], ["P nuqta II chorakda.", 'Точка P находится во II четверти.']), L('Choraklar ishora jadvalini tekshiring.', 'Проверьте таблицу знаков четвертей.'), { type: 'coordinatePlane', points: [{ x: -4, y: 3, label: 'P' }] }),
    Q(L('Koordinatani o‘qing', 'Прочитайте координату'), L('Nuqta 2 birlik chapda va 4 birlik pastda. Koordinatasini toping.', 'Точка на 2 единицы слева и на 4 вниз. Найдите координаты.'), L('Chap va past yo‘nalishlar manfiy.', 'Слева и снизу координаты отрицательны.'), ['(2;4)', '(−2;4)', '(2;−4)', '(−2;−4)'], 3, P(["Chapga 2: x = −2.", 'Влево 2: x = −2.'], ["Pastga 4: y = −4.", 'Вниз 4: y = −4.']), L('Avval x, keyin y ni yozing.', 'Запишите сначала x, потом y.'), { type: 'coordinatePlane', points: [{ x: -2, y: -4, label: 'K' }] }),
    CLS(L('Nuqtalarni guruhlang', 'Распределите точки'), L('Nuqtalarni yuqori va pastki yarim tekislikka ajrating.', 'Распределите точки по верхней и нижней полуплоскости.'), L("y musbat bo'lsa yuqori, y manfiy bo'lsa pastki yarim tekislik.", 'При положительном y точка сверху, при отрицательном — снизу.'), L('Yuqorida', 'Сверху'), L('Pastda', 'Снизу'), [[L('A(2;3)', 'A(2;3)'), true], [L('B(−1;−4)', 'B(−1;−4)'), false], [L('C(5;1)', 'C(5;1)'), true], [L('D(3;−2)', 'D(3;−2)'), false]], P(["A va C da y musbat.", 'У A и C координата y положительна.'], ["B va D da y manfiy.", 'У B и D координата y отрицательна.']), L('Ikkinchi koordinataga qarang.', 'Смотрите на вторую координату.')),
    Q(L('O‘qdagi nuqta', 'Точка на оси'), L('Qaysi nuqta y o‘qida joylashgan?', 'Какая точка лежит на оси y?'), L("y o'qida x koordinatasi nol bo'ladi.", 'На оси y координата x равна нулю.'), ['A(3;0)', 'B(0;−5)', 'C(2;2)', 'D(−1;4)'], 1, P(["B nuqtada x = 0.", 'У точки B координата x = 0.'], ["Shuning uchun B y o'qida.", 'Поэтому B лежит на оси y.']), L('Birinchi koordinatasi nol bo‘lgan nuqtani toping.', 'Найдите точку с первой координатой ноль.'), cards('x=0 → y o‘qi')),
    Q(L('Gorizontal masofa', 'Горизонтальное расстояние'), L('A(−3;2) va B(5;2) orasidagi masofani toping.', 'Найдите расстояние между A(−3;2) и B(5;2).'), L('y koordinatalari teng, x koordinatalari ayirmasining modulini oling.', 'y одинаковы, возьмите модуль разности x.'), ['2', '8', '−8', '15'], 1, P(["|5 − (−3)| = |8|.", '|5 − (−3)| = |8|.'], ["Masofa 8 birlik.", 'Расстояние равно 8 единицам.']), L('Masofa musbat bo‘ladi.', 'Расстояние положительно.'), eq('|5−(−3)| = ?')),
  ],
  summary: P(
    ["Nuqta koordinatasi A(x;y) tartibida yoziladi.", 'Координаты точки записывают в порядке A(x;y).'],
    ["Ishoralar nuqtaning qaysi chorakda ekanini bildiradi.", 'Знаки координат определяют четверть.'],
    ["O'qlardagi nuqtalarning koordinatalaridan biri nol bo'ladi.", 'У точек на осях одна из координат равна нулю.'],
  ),
});

const D31 = makeLesson({
  id: 31,
  title: L('Harfli ifodalar', 'Буквенные выражения'),
  subtitle: L("Son o'rniga harf ishlatib, ifodaning qiymatini topamiz va hayotiy formulalarni yozamiz.", 'Заменим числа буквами, найдём значения выражений и запишем жизненные формулы.'),
  decorations: ['3a+2', 'P=2(a+b)', 'x=5', '7m'],
  visual: chain('a = 4', '3a + 2', '14'),
  hook: Q(L('Bir xil narxli daftarlar', 'Тетради одной цены'), L("Bitta daftar 4 000 so'm. n ta daftar qancha turadi?", 'Одна тетрадь стоит 4 000 сумов. Сколько стоят n тетрадей?'), L("Miqdor noma'lum bo'lgani uchun uni n harfi bilan belgilaymiz.", 'Количество неизвестно, поэтому обозначим его буквой n.'), ['4 000+n', '4 000−n', '4 000n', '4 000:n'], 2, P(["Narx miqdorga ko'paytiriladi.", 'Цена умножается на количество.'], ["Jami narx 4 000n.", 'Общая стоимость равна 4 000n.']), L("Bir dona narxini daftarlar soniga ko'paytiring.", 'Умножьте цену одной штуки на количество.'), eq('4 000 · n')),
  concepts: [
    C(L('Harf nimani bildiradi?', 'Что обозначает буква?'), P(["Harf o'zgaruvchi yoki noma'lum sonning o'rnini egallaydi.", 'Буква заменяет переменное или неизвестное число.'], ["a ning qiymati o'zgarsa, ifodaning qiymati ham o'zgaradi.", 'Если меняется a, меняется и значение выражения.']), cards('a', 'x', 'm', 'n')),
    C(L("Ko'paytirishning qisqa yozuvi", 'Краткая запись умножения'), P(["3 · a o'rniga 3a yoziladi.", 'Вместо 3 · a пишут 3a.'], ["1 · x = x, shuning uchun 1 koeffitsiyenti yozilmaydi.", '1 · x = x, поэтому коэффициент 1 не пишут.']), chain('3·a', '3a'), true),
    C(L('Ifodaning qiymati', 'Значение выражения'), P(["Harfning berilgan qiymatini ifodaga qo'yamiz.", 'Подставляем данное значение буквы в выражение.'], ["a = 5 bo'lsa, 2a + 3 = 2 · 5 + 3 = 13.", 'При a = 5 получаем 2a + 3 = 2 · 5 + 3 = 13.']), chain('a=5', '2·5+3', '13')),
    C(L('Koeffitsiyent va had', 'Коэффициент и член'), P(["5x yozuvida 5 — sonli ko'paytuvchi, ya'ni koeffitsiyent.", 'В записи 5x число 5 — коэффициент.'], ["5x+7 ifodasida 5x va 7 alohida hadlardir.", '5x и 7 — отдельные члены выражения.']), panels({ title: L('Koeffitsiyent', 'Коэффициент'), lines: ['5x → 5'], color: 'yellow' }, { title: L('Hadlar', 'Члены'), lines: ['5x + 7'], color: 'blue' })),
    C(L('Formulalar — qisqa qoida', 'Формула — краткое правило'), P(["To'g'ri to'rtburchak perimetri P = 2(a + b).", 'Периметр прямоугольника P = 2(a + b).'], ["Yo'l formulasi s = v · t: masofa tezlik va vaqt ko'paytmasi.", 'Формула пути s = v · t: расстояние равно произведению скорости и времени.']), cards('P=2(a+b)', 's=v·t'), true),
    C(L('Birliklarni unutmang', 'Не забывайте единицы'), P(["Ifodadagi kattaliklar bir xil birlikda bo'lishi kerak.", 'Величины в выражении должны быть в согласованных единицах.'], ["Tezlik km/soat, vaqt soatda berilsa, masofa kilometrda chiqadi.", 'Если v в километрах в час, а t в часах, то s получится в километрах.']), chain('km/soat · soat', 'km')),
    C(L('Amallar tartibi saqlanadi', 'Порядок действий сохраняется'), P(["Harfli ifodada ham avval qavs va ko'paytirish bajariladi.", 'В буквенном выражении сначала выполняют скобки и умножение.'], ["x = 4 da 3(x + 2) = 3 · 6 = 18.", 'При x = 4: 3(x + 2) = 3 · 6 = 18.']), chain('3(4+2)', '3·6', '18')),
  ],
  tasks: [
    Q(L('Qiymatni toping', 'Найдите значение'), L('a = 6 bo‘lsa, 4a − 5 ni hisoblang.', 'При a = 6 вычислите 4a − 5.'), L('a o‘rniga 6 ni qo‘ying.', 'Подставьте 6 вместо a.'), ['19', '24', '29', '35'], 0, P(["4 · 6 = 24.", '4 · 6 = 24.'], ["24 − 5 = 19.", '24 − 5 = 19.']), L('Avval ko‘paytirishni bajaring.', 'Сначала выполните умножение.'), chain('4·6−5', '24−5', '19')),
    MATCH(L('Yozuvlarni moslashtiring', 'Сопоставьте записи'), L('Har bir uzun yozuvga uning qisqa ko‘rinishini toping.', 'Подберите краткую запись.'), L('Ko‘paytirish belgisi harf oldida yozilmasligi mumkin.', 'Знак умножения перед буквой можно не писать.'), [{ left: '7 · x', correct: '7x' }, { left: '1 · a', correct: 'a' }, { left: 'm · m', correct: 'm²' }], P(["7 · x = 7x, 1 · a = a, m · m = m².", '7 · x = 7x, 1 · a = a, m · m = m².'], ["Bular bir xil ma'nodagi yozuvlar.", 'Это равнозначные записи.']), L('Koeffitsiyent va daraja yozuvlarini eslang.', 'Вспомните коэффициент и степень.')),
    Q(L('Formula bilan masofa', 'Расстояние по формуле'), L('v = 60 km/soat, t = 3 soat. s = v · t bo‘yicha masofani toping.', 'v = 60 км/ч, t = 3 ч. Найдите путь по формуле s = v · t.'), L('Tezlikni vaqtga ko‘paytiring.', 'Умножьте скорость на время.'), ['20 km', '63 km', '180 km', '360 km'], 2, P(["s = 60 · 3.", 's = 60 · 3.'], ["s = 180 kilometr.", 's = 180 километров.']), L('60 ni 3 ga ko‘paytiring.', 'Умножьте 60 на 3.'), eq('s = 60 · 3')),
    Q(L('Perimetr formulasi', 'Формула периметра'), L('a = 7 cm, b = 4 cm. P = 2(a+b) ni toping.', 'a = 7 см, b = 4 см. Найдите P = 2(a+b).'), L('Avval qavs ichini hisoblang.', 'Сначала вычислите сумму в скобках.'), ['11 cm', '18 cm', '22 cm', '28 cm'], 2, P(["7 + 4 = 11.", '7 + 4 = 11.'], ["2 · 11 = 22 cm.", '2 · 11 = 22 см.']), L('Perimetr barcha tomonlar yig‘indisi.', 'Периметр — сумма всех сторон.'), chain('2(7+4)', '2·11', '22')),
    M(L('Harfli ifodalarni tanlang', 'Выберите буквенные выражения'), L('Tarkibida harf qatnashgan ifodalarni belgilang.', 'Отметьте выражения, содержащие букву.'), ['3x+2', '17−5', 'a/4', '6·8'], [0, 2], P(["3x+2 va a/4 da harflar bor.", 'В 3x+2 и a/4 есть буквы.'], ["Qolganlari sonli ifodalar.", 'Остальные выражения числовые.']), L('Harf qatnashgan yozuvlarni qidiring.', 'Найдите записи с буквами.')),
    Q(L('Qavsli ifoda', 'Выражение со скобками'), L('x = 5 bo‘lsa, 2(x+3) ni toping.', 'При x = 5 найдите 2(x+3).'), L('Avval x o‘rniga 5 ni qo‘ying va qavsni hisoblang.', 'Подставьте 5 и вычислите скобки.'), ['10', '13', '16', '20'], 2, P(["5 + 3 = 8.", '5 + 3 = 8.'], ["2 · 8 = 16.", '2 · 8 = 16.']), L('Qavs birinchi bajariladi.', 'Скобки выполняются первыми.'), chain('2(5+3)', '2·8', '16')),
  ],
  summary: P(
    ["Harf sonning o'zgaruvchi yoki noma'lum qiymatini bildiradi.", 'Буква обозначает переменное или неизвестное число.'],
    ["Ifoda qiymati harf o'rniga son qo'yib topiladi.", 'Значение выражения находят подстановкой числа вместо буквы.'],
    ["Formulalar hayotiy bog'lanishlarni qisqa yozadi.", 'Формулы кратко записывают жизненные зависимости.'],
  ),
});

const D32 = makeLesson({
  id: 32,
  title: L('Qavslarni ochish', 'Раскрытие скобок'),
  subtitle: L("Taqsimot qonuni va qavs oldidagi ishora yordamida ifodalarni soddalashtiramiz.", 'Упростим выражения по распределительному закону и знаку перед скобками.'),
  decorations: ['3(a+2)', '−(x−5)', 'a(b+c)', '−2(x+4)'],
  visual: chain('3(x+2)', '3x+6'),
  hook: Q(L('Uchta bir xil to‘plam', 'Три одинаковых набора'), L('Har bir qutida x ta qalam va 2 ta ruchka bor. 3 qutidagi buyumlar ifodasi qaysi?', 'В каждой коробке x карандашей и 2 ручки. Как записать число предметов в 3 коробках?'), L('Har bir qutidagi x+2 soni uch marta olinadi.', 'Количество x+2 берётся три раза.'), ['3x+2', '3x+6', 'x+6', '6x'], 1, P(["3(x+2)=3x+3·2.", '3(x+2)=3x+3·2.'], ["Natija 3x+6.", 'Результат 3x+6.']), L('3 ni qavs ichidagi har bir hadga ko‘paytiring.', 'Умножьте 3 на каждый член в скобках.'), chain('3(x+2)', '3x+6')),
  concepts: [
    C(L('Taqsimot qonuni', 'Распределительный закон'), P(["a(b+c)=ab+ac.", 'a(b+c)=ab+ac.'], ["Qavs tashqarisidagi ko'paytuvchi ichkaridagi har bir hadga ko'paytiriladi.", 'Множитель перед скобками умножается на каждый член внутри.']), chain('a(b+c)', 'ab+ac'), true),
    C(L('Ayirmali qavs', 'Скобки с разностью'), P(["a(b−c)=ab−ac.", 'a(b−c)=ab−ac.'], ["Masalan, 4(x−3)=4x−12.", 'Например, 4(x−3)=4x−12.']), chain('4(x−3)', '4x−12')),
    C(L('Qavs oldida plus', 'Плюс перед скобками'), P(["Qavs oldida plus bo'lsa, ichkaridagi ishoralar o'zgarmaydi.", 'Если перед скобками плюс, знаки внутри не меняются.'], ["+(x−5)=x−5.", '+(x−5)=x−5.']), cards('+(a−b)=a−b')),
    C(L('Qavs oldida minus', 'Минус перед скобками'), P(["Minus qavs ichidagi har bir hadning ishorasini almashtiradi.", 'Минус меняет знак каждого члена в скобках.'], ["−(x−5)=−x+5.", '−(x−5)=−x+5.']), chain('−(x−5)', '−x+5'), true),
    C(L('Manfiy ko‘paytuvchi', 'Отрицательный множитель'), P(["−2(x+4)=−2x−8.", '−2(x+4)=−2x−8.'], ["−2(x−4)=−2x+8: minus karra minus plus.", '−2(x−4)=−2x+8: минус на минус даёт плюс.']), panels({ title: '−2(x+4)', lines: ['−2x−8'], color: 'yellow' }, { title: '−2(x−4)', lines: ['−2x+8'], color: 'green' })),
    C(L('Tekshirish uchun son qo‘ying', 'Проверка подстановкой'), P(["Qavsli va ochilgan ifodaga bir xil x qiymatini qo'ying.", 'Подставьте одно и то же значение x в исходное и раскрытое выражение.'], ["x=2 da 3(x+1)=9 va 3x+3=9.", 'При x=2: 3(x+1)=9 и 3x+3=9.']), panels({ title: L('Qavsli', 'Со скобками'), lines: ['3(2+1)=9'], color: 'blue' }, { title: L('Ochiq', 'Раскрыто'), lines: ['3·2+3=9'], color: 'green' })),
    C(L('Teskari amal: qavsga olish', 'Обратное действие'), P(["Umumiy ko'paytuvchini qavs tashqarisiga chiqarish mumkin.", 'Общий множитель можно вынести за скобки.'], ["6x+12=6(x+2).", '6x+12=6(x+2).']), chain('6x+12', '6(x+2)')),
    C(L('Xatolarni oldini oling', 'Как избежать ошибок'), P(["Ko'paytuvchini faqat birinchi hadga emas, barcha hadlarga tarqating.", 'Умножайте не только первый, а каждый член в скобках.'], ["Qavs oldida minus bo'lsa, hech bir ishorani o'zgarishsiz qoldirmang.", 'При минусе перед скобками меняйте каждый знак.']), panels({ title: L("Noto'g'ri", 'Неверно'), lines: ['3(x+2)=3x+2'], color: 'yellow' }, { title: L("To'g'ri", 'Верно'), lines: ['3x+6'], color: 'green' })),
  ],
  tasks: [
    Q(L('Qavsni oching', 'Раскройте скобки'), L('5(a+3) ga teng ifodani tanlang.', 'Выберите выражение, равное 5(a+3).'), L('5 ni ikkala hadga ko‘paytiring.', 'Умножьте 5 на оба члена.'), ['5a+3', '5a+8', '5a+15', '15a'], 2, P(["5·a=5a.", '5·a=5a.'], ["5·3=15, demak 5a+15.", '5·3=15, значит 5a+15.']), L('Ikkinchi hadni ham 5 ga ko‘paytiring.', 'Умножьте на 5 и второй член.'), chain('5(a+3)', '5a+15')),
    Q(L('Minusli qavs', 'Минус перед скобками'), L('−(m+7) ni oching.', 'Раскройте −(m+7).'), L('Har bir hadning ishorasini almashtiring.', 'Измените знак каждого члена.'), ['−m+7', 'm−7', '−m−7', 'm+7'], 2, P(["m ning ishorasi minusga aylanadi.", 'Знак m становится минусом.'], ["+7 ning ishorasi −7 bo'ladi.", 'Знак +7 становится −7.']), L('Minus qavsdagi barcha ishoralarni o‘zgartiradi.', 'Минус меняет все знаки в скобках.'), chain('−(m+7)', '−m−7')),
    MATCH(L('Qavsli va ochiq yozuv', 'Скобки и раскрытая запись'), L('Teng ifodalarni bog‘lang.', 'Соедините равные выражения.'), L('Taqsimot qonuni va ishoralar qoidasidan foydalaning.', 'Используйте распределительный закон и правило знаков.'), [{ left: '2(x+5)', correct: '2x+10' }, { left: '−(a−4)', correct: '−a+4' }, { left: '−3(y+2)', correct: '−3y−6' }], P(["Har bir qavs to'liq ochildi.", 'Каждые скобки раскрыты полностью.'], ["Minuslar ham ko'paytirish qoidasiga bo'ysunadi.", 'Минусы подчиняются правилу умножения.']), L('Har bir hadga tashqi ko‘paytuvchini tarqating.', 'Распределите внешний множитель на каждый член.')),
    Q(L('Qiymat bilan tekshiring', 'Проверьте значением'), L('x=4 da −2(x−3) ning qiymatini toping.', 'При x=4 найдите −2(x−3).'), L('Avval qavs ichini hisoblash eng qulay.', 'Удобнее сначала вычислить скобки.'), ['−14', '−2', '2', '14'], 1, P(["4−3=1.", '4−3=1.'], ["−2·1=−2.", '−2·1=−2.']), L('Qavs birinchi bajariladi.', 'Сначала скобки.'), chain('−2(4−3)', '−2·1', '−2')),
    Q(L('Umumiy ko‘paytuvchini chiqaring', 'Вынесите общий множитель'), L('8x+24 ifodasini qavsli ko‘rinishga keltiring.', 'Представьте 8x+24 со скобками.'), L('Ikkala hadning umumiy ko‘paytuvchisi 8.', 'Общий множитель обоих членов — 8.'), ['8(x+3)', '8(x+24)', '4(2x+24)', '24(x+1)'], 0, P(["8x:8=x.", '8x:8=x.'], ["24:8=3, demak 8(x+3).", '24:8=3, значит 8(x+3).']), L('8 ni qavs tashqarisiga chiqaring.', 'Вынесите 8 за скобки.'), chain('8x+24', '8(x+3)')),
  ],
  summary: P(
    ["Tashqi ko'paytuvchi qavs ichidagi har bir hadga ko'payadi.", 'Внешний множитель умножается на каждый член в скобках.'],
    ["Qavs oldidagi minus barcha ishoralarni almashtiradi.", 'Минус перед скобками меняет все знаки.'],
    ["Qavsga olish qavsni ochishga teskari amaldir.", 'Вынесение общего множителя — действие, обратное раскрытию скобок.'],
  ),
});

const D33 = makeLesson({
  id: 33,
  title: L("O'xshash hadlarni ixchamlash", 'Приведение подобных слагаемых'),
  subtitle: L("Bir xil harfli qismlarni topib, ularning koeffitsiyentlarini qo'shamiz yoki ayiramiz.", 'Найдём одинаковые буквенные части и сложим или вычтем коэффициенты.'),
  decorations: ['3x+5x', '7a−2a', '4x+3y', '−m+m'],
  visual: chain('3x + 5x', '8x'),
  hook: Q(L('Bir xil qalamlar', 'Одинаковые карандаши'), L('3 ta x so‘mlik qalamga yana 5 ta shunday qalam qo‘shildi. Jami narx qanday yoziladi?', 'К 3 карандашам ценой x добавили ещё 5 таких же. Как записать общую стоимость?'), L('Bir xil narxli qalamlar soni 3+5 bo‘ladi.', 'Число одинаковых карандашей равно 3+5.'), ['8', '8x', '15x', '3x+5'], 1, P(["3x+5x=(3+5)x.", '3x+5x=(3+5)x.'], ["Natija 8x.", 'Результат 8x.']), L('Koeffitsiyentlarni qo‘shing.', 'Сложите коэффициенты.'), chain('3x+5x', '(3+5)x', '8x')),
  concepts: [
    C(L("O'xshash had nima?", 'Что такое подобные слагаемые?'), P(["Harfli qismlari aynan bir xil bo'lgan hadlar o'xshash.", 'Слагаемые с одинаковой буквенной частью называются подобными.'], ["4x va −7x o'xshash; 4x va 4y o'xshash emas.", '4x и −7x подобны; 4x и 4y не подобны.']), panels({ title: L("O'xshash", 'Подобные'), lines: ['4x, −7x'], color: 'green' }, { title: L("O'xshash emas", 'Не подобные'), lines: ['4x, 4y'], color: 'yellow' }), true),
    C(L('Ixchamlash qoidasi', 'Правило приведения'), P(["Koeffitsiyentlar qo'shiladi yoki ayiriladi.", 'Коэффициенты складывают или вычитают.'], ["Harfli qism o'zgarishsiz qoladi: 7a−2a=5a.", 'Буквенная часть не меняется: 7a−2a=5a.']), chain('7a−2a', '(7−2)a', '5a'), true),
    C(L('Yashirin koeffitsiyentlar', 'Скрытые коэффициенты'), P(["x yozuvida koeffitsiyent 1.", 'В записи x коэффициент равен 1.'], ["−x yozuvida koeffitsiyent −1.", 'В записи −x коэффициент равен −1.']), cards('x=1x', '−x=−1x')),
    C(L('Sonli hadlar alohida', 'Числовые слагаемые отдельно'), P(["3x+7+2x−4 da harfli hadlar va sonlar alohida jamlanadi.", 'В 3x+7+2x−4 буквенные и числовые члены объединяют отдельно.'], ["Natija 5x+3.", 'Результат 5x+3.']), chain('3x+2x', '5x', '7−4=3')),
    C(L('Turli harflarni qo‘shib bo‘lmaydi', 'Разные буквы не объединяют'), P(["2a+3b ifoda ixcham holatda, chunki a va b turli.", '2a+3b уже приведено, потому что a и b различны.'], ["ab va a² ham bir xil harfli qism emas.", 'ab и a² тоже имеют разные буквенные части.']), cards('2a+3b', 'ab+a²')),
    C(L('Qavsdan keyin ixchamlash', 'Приведение после скобок'), P(["Avval qavslarni oching, keyin o'xshash hadlarni toping.", 'Сначала раскройте скобки, затем найдите подобные.'], ["2(x+3)+x = 2x+6+x = 3x+6.", '2(x+3)+x = 2x+6+x = 3x+6.']), chain('2(x+3)+x', '2x+6+x', '3x+6')),
    C(L('Qiymat bilan tekshirish', 'Проверка значением'), P(["Boshlang'ich va ixcham ifodaga bir xil qiymat qo'ying.", 'Подставьте одно значение в исходное и упрощённое выражение.'], ["x=2 da 3x+5x=16 va 8x=16.", 'При x=2: 3x+5x=16 и 8x=16.']), panels({ title: L('Boshlang‘ich', 'Исходное'), lines: ['3·2+5·2=16'], color: 'blue' }, { title: L('Ixcham', 'Упрощённое'), lines: ['8·2=16'], color: 'green' })),
    C(L('Tartibli yozish', 'Аккуратная запись'), P(["Bir xil harfli hadlarni yonma-yon guruhlash xatoni kamaytiradi.", 'Группировка одинаковых буквенных частей уменьшает ошибки.'], ["Ishorani har bir had bilan birga ko'chiring.", 'Переносите знак вместе с каждым членом.']), chain('4x−3+2x+7', '4x+2x−3+7', '6x+4')),
  ],
  tasks: [
    Q(L('Hadlarni ixchamlang', 'Приведите слагаемые'), L('9m−4m ni soddalashtiring.', 'Упростите 9m−4m.'), L('Koeffitsiyentlarni ayiring.', 'Вычтите коэффициенты.'), ['5', '5m', '13m', '36m'], 1, P(["9−4=5.", '9−4=5.'], ["Harfli qism m qoladi: 5m.", 'Буквенная часть m сохраняется: 5m.']), L('Faqat koeffitsiyentlar o‘zgaradi.', 'Меняются только коэффициенты.'), chain('9m−4m', '5m')),
    CLS(L('Hadlarni ajrating', 'Разделите слагаемые'), L('x li va y li hadlarni guruhlang.', 'Распределите члены с x и y.'), L('Harfli qismga qarang.', 'Смотрите на буквенную часть.'), L('x li hadlar', 'Слагаемые с x'), L('y li hadlar', 'Слагаемые с y'), [['3x', true], ['−2y', false], ['7x', true], ['5y', false]], P(["3x va 7x ning harfli qismi x.", 'У 3x и 7x буквенная часть x.'], ["−2y va 5y ning harfli qismi y.", 'У −2y и 5y буквенная часть y.']), L('Koeffitsiyent emas, harfli qism hal qiladi.', 'Смотрите не на коэффициент, а на букву.')),
    Q(L('Sonli hadlar bilan', 'С числовыми слагаемыми'), L('4x+6+3x−2 ni soddalashtiring.', 'Упростите 4x+6+3x−2.'), L('x li hadlarni va sonlarni alohida birlashtiring.', 'Объедините отдельно члены с x и числа.'), ['7x+4', '7x+8', '12x+4', '7x−4'], 0, P(["4x+3x=7x.", '4x+3x=7x.'], ["6−2=4, natija 7x+4.", '6−2=4, результат 7x+4.']), L('Ikki guruh hosil qiling.', 'Составьте две группы.'), chain('4x+3x', '7x', '6−2=4')),
    Q(L('Yashirin koeffitsiyent', 'Скрытый коэффициент'), L('5a−a ni soddalashtiring.', 'Упростите 5a−a.'), L('a = 1a ekanini eslang.', 'Помните, что a = 1a.'), ['4', '4a', '5a', '6a'], 1, P(["5a−1a=(5−1)a.", '5a−1a=(5−1)a.'], ["Natija 4a.", 'Результат 4a.']), L('Ikkinchi hadning koeffitsiyenti 1.', 'Коэффициент второго члена равен 1.'), chain('5a−1a', '4a')),
    Q(L('Qavs va hadlar', 'Скобки и слагаемые'), L('3(x+2)−x ni soddalashtiring.', 'Упростите 3(x+2)−x.'), L('Avval qavsni oching.', 'Сначала раскройте скобки.'), ['2x+2', '2x+6', '3x+6', '4x+2'], 1, P(["3(x+2)=3x+6.", '3(x+2)=3x+6.'], ["3x−x=2x, natija 2x+6.", '3x−x=2x, результат 2x+6.']), L('Qavs ochilgach o‘xshash hadlarni toping.', 'После раскрытия скобок найдите подобные.'), chain('3x+6−x', '2x+6')),
  ],
  summary: P(
    ["O'xshash hadlarning harfli qismlari bir xil bo'ladi.", 'У подобных слагаемых одинаковые буквенные части.'],
    ["Faqat koeffitsiyentlar qo'shiladi yoki ayiriladi.", 'Складывают или вычитают только коэффициенты.'],
    ["Qavslarni ochgandan keyin ham hadlarni ixchamlash mumkin.", 'После раскрытия скобок также приводят подобные слагаемые.'],
  ),
});

const D34 = makeLesson({
  id: 34,
  title: L('Chiziqli tenglamalar', 'Линейные уравнения'),
  subtitle: L("Tenglik muvozanatini saqlab, noma'lumni bosqichma-bosqich yolg'iz qoldiramiz.", 'Сохраняя равновесие, шаг за шагом оставим неизвестное одно.'),
  decorations: ['2x+3=11', 'x−5=7', '3x=18', 'x/4=6'],
  visual: chain('2x+3=11', '2x=8', 'x=4'),
  hook: Q(L('Yashirin son', 'Скрытое число'), L('Bir sonning ikki baravariga 3 qo‘shilsa 11 chiqadi. Sonni toping.', 'Если к удвоенному числу прибавить 3, получится 11. Найдите число.'), L('Tenglama 2x+3=11 ko‘rinishida yoziladi.', 'Составим уравнение 2x+3=11.'), ['3', '4', '5', '7'], 1, P(["2·4+3=8+3.", '2·4+3=8+3.'], ["Natija 11, demak x=4.", 'Получаем 11, значит x=4.']), L('Variantlarni tenglamaga qo‘yib tekshiring.', 'Подставьте варианты в уравнение.'), eq('2x+3=11')),
  concepts: [
    C(L('Tenglama va ildiz', 'Уравнение и корень'), P(["Noma'lum qatnashgan tenglik tenglama deyiladi.", 'Равенство с неизвестным называется уравнением.'], ["Tenglikni to'g'ri qiladigan qiymat tenglamaning ildizi.", 'Значение, превращающее равенство в верное, называется корнем.']), cards('3x+2=14', 'x=4')),
    C(L('Muvozanat qoidasi', 'Правило равновесия'), P(["Tenglamaning ikki tomoniga bir xil sonni qo'shish yoki ayirish mumkin.", 'К обеим частям можно прибавить или вычесть одно число.'], ["Ikki tomonni bir xil nolga teng bo'lmagan songa ko'paytirish yoki bo'lish mumkin.", 'Обе части можно умножить или разделить на одно ненулевое число.']), panels({ title: L('Chap tomon', 'Левая часть'), lines: ['2x+3'], color: 'blue' }, { title: L('O‘ng tomon', 'Правая часть'), lines: ['11'], color: 'yellow' }), true),
    C(L('Qo‘shiluvchini yo‘qotish', 'Убираем слагаемое'), P(["x+7=12 da ikki tomondan 7 ni ayiramiz.", 'В x+7=12 вычитаем 7 из обеих частей.'], ["x=5.", 'x=5.']), chain('x+7=12', 'x=12−7', 'x=5')),
    C(L('Koeffitsiyentni yo‘qotish', 'Убираем коэффициент'), P(["4x=28 da ikki tomonni 4 ga bo'lamiz.", 'В 4x=28 делим обе части на 4.'], ["x=7.", 'x=7.']), chain('4x=28', 'x=28:4', 'x=7')),
    C(L('Ikki bosqichli tenglama', 'Уравнение в два шага'), P(["3x−5=16 da avval ikki tomonga 5 qo'shamiz: 3x=21.", 'В 3x−5=16 сначала прибавим 5: 3x=21.'], ["Keyin 3 ga bo'lamiz: x=7.", 'Затем делим на 3: x=7.']), chain('3x−5=16', '3x=21', 'x=7'), true),
    C(L('Qavsli tenglama', 'Уравнение со скобками'), P(["2(x+3)=14 da avval ikki tomonni 2 ga bo'lish qulay: x+3=7.", 'В 2(x+3)=14 удобно сначала разделить на 2: x+3=7.'], ["So'ng x=4.", 'Затем x=4.']), chain('2(x+3)=14', 'x+3=7', 'x=4')),
    C(L('Noma‘lum ikki tomonda', 'Неизвестное в обеих частях'), P(["5x−4=3x+10 da x li hadlarni chapga, sonlarni o'ngga yig'amiz.", 'В 5x−4=3x+10 собираем x слева, числа справа.'], ["5x−3x=10+4, demak 2x=14 va x=7.", '5x−3x=10+4, значит 2x=14 и x=7.']), chain('5x−4=3x+10', '2x=14', 'x=7'), true),
    C(L('Tekshirish majburiy', 'Обязательная проверка'), P(["Topilgan ildizni boshlang'ich tenglamaga qo'ying.", 'Подставьте найденный корень в исходное уравнение.'], ["3·7−5=16: chap tomon o'ng tomonga teng.", '3·7−5=16: левая часть равна правой.']), panels({ title: L('Chap', 'Слева'), lines: ['3·7−5=16'], color: 'green' }, { title: L('O‘ng', 'Справа'), lines: ['16'], color: 'blue' })),
    C(L('Amal tartibini teskari yuring', 'Обратный порядок действий'), P(["Noma'lum bilan bajarilgan oxirgi amalni avval bekor qiling.", 'Сначала отмените последнее действие над неизвестным.'], ["2x+9=25 da avval 9 ni, keyin 2 koeffitsiyentini yo'qotamiz.", 'В 2x+9=25 сначала убираем 9, затем коэффициент 2.']), { type: 'steps', items: [L('9 ni ayirish', 'Вычесть 9'), L('2 ga bo‘lish', 'Разделить на 2'), L('Tekshirish', 'Проверить')] }),
  ],
  tasks: [
    Q(L('Sodda tenglama', 'Простое уравнение'), L('x−8=15 tenglamani yeching.', 'Решите x−8=15.'), L('Ikki tomonga 8 qo‘shing.', 'Прибавьте 8 к обеим частям.'), ['7', '23', '−23', '120'], 1, P(["x=15+8.", 'x=15+8.'], ["x=23.", 'x=23.']), L('Ayirishni qarama-qarshi amal bilan bekor qiling.', 'Отмените вычитание обратным действием.'), chain('x−8=15', 'x=23')),
    Q(L('Koeffitsiyentli tenglama', 'Уравнение с коэффициентом'), L('−3x=18 tenglamani yeching.', 'Решите −3x=18.'), L('Ikki tomonni −3 ga bo‘ling.', 'Разделите обе части на −3.'), ['−6', '−3', '3', '6'], 0, P(["x=18:(−3).", 'x=18:(−3).'], ["x=−6.", 'x=−6.']), L('Har xil ishorali bo‘linma manfiy.', 'Частное разных знаков отрицательно.'), chain('−3x=18', 'x=−6')),
    Q(L('Ikki bosqich', 'Два шага'), L('4x+6=30 tenglamani yeching.', 'Решите 4x+6=30.'), L('Avval 6 ni ayiring, keyin 4 ga bo‘ling.', 'Сначала вычтите 6, затем разделите на 4.'), ['5', '6', '8', '9'], 1, P(["4x=30−6=24.", '4x=30−6=24.'], ["x=24:4=6.", 'x=24:4=6.']), L('Amallarni teskari tartibda bekor qiling.', 'Отменяйте действия в обратном порядке.'), chain('4x+6=30', '4x=24', 'x=6')),
    Q(L('Qavsli tenglama', 'Уравнение со скобками'), L('3(x−2)=21 tenglamani yeching.', 'Решите 3(x−2)=21.'), L('Avval 3 ga bo‘ling.', 'Сначала разделите на 3.'), ['5', '7', '9', '23'], 2, P(["x−2=7.", 'x−2=7.'], ["x=9.", 'x=9.']), L('So‘ng ikki tomonga 2 qo‘shing.', 'Затем прибавьте 2.'), chain('3(x−2)=21', 'x−2=7', 'x=9')),
    Q(L('Ikki tomonda x', 'x в обеих частях'), L('6x−5=4x+9 tenglamani yeching.', 'Решите 6x−5=4x+9.'), L('4x ni chapga, −5 ni o‘ngga o‘tkazing.', 'Перенесите 4x влево, −5 вправо.'), ['2', '5', '7', '14'], 2, P(["6x−4x=9+5.", '6x−4x=9+5.'], ["2x=14, x=7.", '2x=14, x=7.']), L('O‘xshash hadlarni ikki tomonda to‘plang.', 'Соберите подобные слагаемые.'), chain('6x−4x=9+5', '2x=14', 'x=7')),
  ],
  summary: P(
    ["Tenglama ildizi tenglikni to'g'ri qiladigan qiymatdir.", 'Корень уравнения превращает равенство в верное.'],
    ["Ikki tomonda bir xil amal bajarilsa, tenglik saqlanadi.", 'Если выполнить одно действие с обеими частями, равенство сохраняется.'],
    ["Yechim boshlang'ich tenglamaga qo'yib tekshiriladi.", 'Решение проверяют подстановкой в исходное уравнение.'],
  ),
});

const D35 = makeLesson({
  id: 35,
  title: L('Tenglama yordamida masalalar yechish', 'Решение задач с помощью уравнений'),
  subtitle: L("Masala shartini noma'lum, ifoda va tenglamaga aylantirib, javobni mazmunan tekshiramiz.", 'Переведём условие задачи на язык неизвестного, выражения и уравнения.'),
  decorations: ['x', '2x+5=29', 'shart', 'tekshiruv'],
  visual: chain(L('Shart', 'Условие'), L('Tenglama', 'Уравнение'), L('Javob', 'Ответ')),
  hook: Q(L('Yashirin miqdor', 'Неизвестное количество'), L('Qutida bir nechta olma bor edi. 7 ta qo‘shilgach 19 ta bo‘ldi. Avval nechta edi?', 'В коробке были яблоки. После добавления 7 стало 19. Сколько было?'), L('Avvalgi sonni x deb olib, x+7=19 yozamiz.', 'Обозначим начальное число x и запишем x+7=19.'), ['12', '19', '26', '133'], 0, P(["x=19−7.", 'x=19−7.'], ["x=12 ta olma.", 'x=12 яблок.']), L('Qo‘shilgan 7 ni jami sondan ayiring.', 'Вычтите добавленные 7 из общего числа.'), eq('x+7=19')),
  concepts: [
    C(L('Masalani yechish rejasi', 'План решения задачи'), P(["Noma'lumni tanlang, bog'lanishlarni ifoda bilan yozing va tenglama tuzing.", 'Выберите неизвестное, запишите связи выражениями и составьте уравнение.'], ["Tenglamani yeching, tekshiring va birlikli javob yozing.", 'Решите, проверьте и запишите ответ с единицей.']), { type: 'steps', items: [L('x ni tanlash', 'Выбрать x'), L('Ifoda', 'Выражение'), L('Tenglama', 'Уравнение'), L('Tekshirish', 'Проверка')] }, true),
    C(L('Noma‘lumni aniq belgilang', 'Точно определите неизвестное'), P(["x nimani va qaysi birlikda bildirishini yozing.", 'Запишите, что обозначает x и в каких единицах.'], ["Masalan: x — birinchi savatdagi olma soni.", 'Например: x — число яблок в первой корзине.']), cards(L('x — kitoblar soni', 'x — число книг'), L('x — masofa, km', 'x — расстояние, км'))),
    C(L("So'zlarni ifodaga aylantirish", 'Перевод слов в выражение'), P(["x dan 5 ta ko'p — x+5; x dan 5 ta kam — x−5.", 'На 5 больше x — x+5; на 5 меньше — x−5.'], ["x dan 3 marta ko'p — 3x; x ning yarmi — x/2.", 'В 3 раза больше x — 3x; половина x — x/2.']), panels({ title: L('Ko‘p/kam', 'Больше/меньше'), lines: ['x+5', 'x−5'], color: 'yellow' }, { title: L('Marta/qism', 'Во сколько/часть'), lines: ['3x', 'x/2'], color: 'blue' })),
    C(L('Jami tenglikni beradi', 'Общее количество даёт равенство'), P(["Ikki javondagi kitoblar jami 38 bo'lsa, ularning ifodalari yig'indisi 38 ga teng.", 'Если на двух полках всего 38 книг, сумма выражений равна 38.'], ["x va x+6 uchun: x+(x+6)=38.", 'Для x и x+6: x+(x+6)=38.']), chain('x', 'x+6', 'jami 38')),
    C(L('Ketma-ket sonlar', 'Последовательные числа'), P(["Ketma-ket natural sonlar x, x+1, x+2 ko'rinishida yoziladi.", 'Последовательные натуральные числа: x, x+1, x+2.'], ["Ularning yig'indisi 36 bo'lsa: x+(x+1)+(x+2)=36.", 'Если их сумма 36: x+(x+1)+(x+2)=36.']), cards('x', 'x+1', 'x+2')),
    C(L('Perimetr masalasi', 'Задача на периметр'), P(["To'g'ri to'rtburchak eni x, bo'yi x+3 bo'lsin.", 'Пусть ширина прямоугольника x, длина x+3.'], ["Perimetr 30 bo'lsa: 2(x+x+3)=30.", 'Если периметр 30: 2(x+x+3)=30.']), chain('2(x+x+3)=30', '4x+6=30', 'x=6'), true),
    C(L('Yechimni shartga qaytaring', 'Верните решение в условие'), P(["x ba'zan yakuniy javob emas, faqat oraliq noma'lum.", 'Иногда x — не окончательный ответ, а промежуточное неизвестное.'], ["Agar ikkinchi son x+6 bo'lsa va x=16 chiqsa, ikkinchi son 22.", 'Если второе число x+6 и x=16, второе число равно 22.']), chain('x=16', 'x+6', '22')),
    C(L('Mazmuniy cheklov', 'Смысловое ограничение'), P(["Odamlar soni, buyumlar miqdori kabi kattaliklar manfiy yoki kasr bo'la olmaydi.", 'Число людей или предметов не может быть отрицательным или дробным.'], ["Yechim shartga mos kelmasa, tenglama yoki modelni qayta tekshiring.", 'Если решение не соответствует смыслу, проверьте модель и уравнение.']), panels({ title: L('Hisob', 'Вычисление'), lines: ['x=−3'], color: 'yellow' }, { title: L('Mazmun', 'Смысл'), lines: [L('−3 ta kitob bo‘lmaydi', '−3 книги невозможны')], color: 'green' })),
    C(L('Javobni to‘liq yozing', 'Полный ответ'), P(["Faqat x=12 deb emas, masala savoliga mos gap bilan javob bering.", 'Пишите не только x=12, но и ответ на вопрос задачи.'], ["Masalan: birinchi savatda 12 ta olma bo'lgan.", 'Например: в первой корзине было 12 яблок.']), cards(L('Javob: 12 ta olma.', 'Ответ: 12 яблок.'))),
  ],
  tasks: [
    Q(L('Ikki son', 'Два числа'), L('Bir son ikkinchisidan 8 ga katta. Yig‘indisi 40. Kichik sonni toping.', 'Одно число на 8 больше другого. Их сумма 40. Найдите меньшее.'), L('Kichik son x, katta son x+8.', 'Меньшее x, большее x+8.'), ['12', '16', '20', '24'], 1, P(["x+(x+8)=40, ya'ni 2x=32.", 'x+(x+8)=40, то есть 2x=32.'], ["x=16.", 'x=16.']), L('Ikki son ifodasini qo‘shing.', 'Сложите выражения для двух чисел.'), chain('x+x+8=40', '2x=32', 'x=16')),
    Q(L('Kitob javonlari', 'Книжные полки'), L('Ikkinchi javonda birinchidan 5 ta ko‘p kitob bor. Jami 31 ta. Birinchi javonda nechta?', 'На второй полке на 5 книг больше. Всего 31. Сколько на первой?'), L('Birinchi javon x, ikkinchi x+5.', 'Первая полка x, вторая x+5.'), ['11', '13', '15', '18'], 1, P(["x+x+5=31.", 'x+x+5=31.'], ["2x=26, x=13.", '2x=26, x=13.']), L('Jami tenglamani tuzing.', 'Составьте уравнение по общему числу.'), eq('x+(x+5)=31')),
    Q(L('Ketma-ket sonlar', 'Последовательные числа'), L('Uchta ketma-ket son yig‘indisi 51. O‘rtadagi sonni toping.', 'Сумма трёх последовательных чисел 51. Найдите среднее.'), L('Sonlar x, x+1, x+2.', 'Числа x, x+1, x+2.'), ['16', '17', '18', '19'], 1, P(["3x+3=51, 3x=48, x=16.", '3x+3=51, 3x=48, x=16.'], ["O'rtadagi son x+1=17.", 'Среднее число x+1=17.']), L('Savolda x emas, o‘rtadagi son so‘ralgan.', 'Требуется не x, а среднее число.'), chain('x=16', 'x+1=17')),
    Q(L('Perimetr', 'Периметр'), L('To‘g‘ri to‘rtburchak eni x, bo‘yi x+4. Perimetri 32 cm. Enini toping.', 'Ширина x, длина x+4. Периметр 32 см. Найдите ширину.'), L('2(x+x+4)=32 tenglamani yeching.', 'Решите 2(x+x+4)=32.'), ['4 cm', '6 cm', '8 cm', '12 cm'], 1, P(["4x+8=32, 4x=24.", '4x+8=32, 4x=24.'], ["x=6 cm.", 'x=6 см.']), L('Perimetr ikki uzunlik va ikki en yig‘indisi.', 'Периметр — сумма двух длин и двух ширин.'), chain('4x+8=32', 'x=6')),
    Q(L('Yosh masalasi', 'Задача о возрасте'), L('Ota o‘g‘lidan 24 yosh katta. Ularning yoshi jami 54. O‘g‘il necha yosh?', 'Отец на 24 года старше сына. Вместе им 54 года. Сколько лет сыну?'), L('O‘g‘il x, ota x+24.', 'Сыну x, отцу x+24.'), ['12', '15', '24', '39'], 1, P(["x+x+24=54, 2x=30.", 'x+x+24=54, 2x=30.'], ["x=15 yosh.", 'x=15 лет.']), L('Topilgan yoshlarni qo‘shib tekshiring.', 'Проверьте сумму возрастов.'), eq('x+(x+24)=54')),
  ],
  summary: P(
    ["Avval x nimani bildirishini aniq yozish kerak.", 'Сначала нужно точно определить, что обозначает x.'],
    ["Masala so'zlari ifoda va tenglamaga aylantiriladi.", 'Условие переводят в выражения и уравнение.'],
    ["Yechim shartga qaytarilib, birlik va mazmun bilan tekshiriladi.", 'Решение возвращают в условие и проверяют по смыслу и единицам.'],
  ),
});

const D36 = makeLesson({
  id: 36,
  title: L('Iqtisodiy va ishga oid masalalar', 'Экономические задачи и задачи на работу'),
  subtitle: L("Narx, miqdor, qiymat hamda ish unumdorligi formulalarini tenglama bilan bog'laymiz.", 'Свяжем формулы стоимости и производительности с уравнениями.'),
  decorations: ['C=p·n', 'A=r·t', 'narx', 'unumdorlik'],
  visual: panels({ title: L('Xarid', 'Покупка'), lines: ['C=p·n'], color: 'yellow' }, { title: L('Ish', 'Работа'), lines: ['A=r·t'], color: 'blue' }),
  hook: Q(L('Xarid qiymati', 'Стоимость покупки'), L("5 ta bir xil daftar uchun 30 000 so'm to'landi. Bitta daftar narxi qancha?", 'За 5 одинаковых тетрадей заплатили 30 000 сумов. Сколько стоит одна?'), L('Jami qiymatni miqdorga bo‘ling.', 'Разделите общую стоимость на количество.'), ["5 000 so'm", "6 000 so'm", "25 000 so'm", "35 000 so'm"], 1, P(["30 000 : 5 = 6 000.", '30 000 : 5 = 6 000.'], ["Bitta daftar 6 000 so'm.", 'Одна тетрадь стоит 6 000 сумов.']), L('C=p·n formulasidan p=C:n.', 'Из C=p·n получаем p=C:n.'), eq('p=30 000:5')),
  concepts: [
    C(L('Narx formulasi', 'Формула стоимости'), P(["Jami qiymat C = p · n, bu yerda p — birlik narx, n — miqdor.", 'Общая стоимость C = p · n, где p — цена единицы, n — количество.'], ["p=C:n va n=C:p formulalari teskari amallar bilan olinadi.", 'Формулы p=C:n и n=C:p получают обратными действиями.']), cards('C=p·n', 'p=C:n', 'n=C:p'), true),
    C(L('Chegirma va yangi narx', 'Скидка и новая цена'), P(["Chegirma summasi eski narxning berilgan foizi.", 'Сумма скидки — заданный процент старой цены.'], ["Yangi narx = eski narx − chegirma summasi.", 'Новая цена = старая цена − сумма скидки.']), chain('200 000·15%', '30 000', '170 000')),
    C(L('Daromad va xarajat', 'Доход и расход'), P(["Foyda = daromad − xarajat.", 'Прибыль = доход − расход.'], ["Natija manfiy bo'lsa, bu zarar miqdorini bildiradi.", 'Отрицательный результат означает убыток.']), panels({ title: L('Foyda', 'Прибыль'), lines: ['daromad−xarajat'], color: 'green' }, { title: L('Zarar', 'Убыток'), lines: ['xarajat>daromad'], color: 'yellow' })),
    C(L('Ish formulasi', 'Формула работы'), P(["Bajarilgan ish A = r · t, bu yerda r — vaqt birligidagi unumdorlik.", 'Выполненная работа A = r · t, где r — производительность за единицу времени.'], ["r=A:t, t=A:r.", 'r=A:t, t=A:r.']), cards('A=r·t', 'r=A:t', 't=A:r'), true),
    C(L('Birgalikdagi ish', 'Совместная работа'), P(["Ikki ishchi bir vaqtda ishlasa, unumdorliklari qo'shiladi.", 'При совместной работе производительности складываются.'], ["Birinchisi soatiga 5 ta, ikkinchisi soatiga 7 ta detal tayyorlasa, birgalikda soatiga 12 ta detal tayyorlaydi.", 'Первый делает 5, второй 7 деталей в час: вместе 12 деталей в час.']), chain('5 detal/soat', '+7 detal/soat', '12 detal/soat')),
    C(L('Ish qismlari usuli', 'Метод долей работы'), P(["Butun ishni 1 deb olish mumkin.", 'Всю работу можно принять за 1.'], ["Ish 6 soatda tugasa, bir soatlik unumdorlik 1/6 ish.", 'Если работа выполняется за 6 часов, производительность равна 1/6 работы в час.']), cards('A=1', 'r=1/6')),
    C(L('Birliklarni moslashtirish', 'Согласование единиц'), P(["Soatlik unumdorlik bilan vaqt soatda bo'lishi kerak.", 'Для часовой производительности время должно быть в часах.'], ["30 minut = 0,5 soat.", '30 минут = 0,5 часа.']), chain('30 min', '0,5 soat')),
    C(L('Tenglama tuzish', 'Составление уравнения'), P(["Birlik narxi x so'm, 4 buyum va 8 000 so'm yetkazish jami 68 000 bo'lsa: 4x+8 000=68 000.", 'Если цена единицы x, 4 товара и доставка 8 000 стоят 68 000: 4x+8 000=68 000.'], ["Tenglamadan x=15 000 so'm.", 'Из уравнения x=15 000 сумов.']), chain('4x+8 000=68 000', '4x=60 000', 'x=15 000')),
    C(L('Natijani hayotiy tekshiring', 'Проверьте смысл результата'), P(["Narx, vaqt va buyum soni manfiy chiqmasligi kerak.", 'Цена, время и количество предметов не должны быть отрицательными.'], ["Birliklar ham savolga mos bo'lishi shart.", 'Единицы ответа должны соответствовать вопросу.']), panels({ title: L('Son', 'Число'), lines: [L('musbat va mantiqli', 'положительное и разумное')], color: 'green' }, { title: L('Birlik', 'Единица'), lines: [L("so'm, soat, dona", 'сум, час, штука')], color: 'blue' })),
  ],
  tasks: [
    Q(L('Birlik narx', 'Цена единицы'), L("8 kg meva 96 000 so'm turadi. 1 kg narxini toping.", '8 кг фруктов стоят 96 000 сумов. Найдите цену 1 кг.'), L('Jami qiymatni kilogramm soniga bo‘ling.', 'Разделите стоимость на число килограммов.'), ["8 000 so'm", "12 000 so'm", "88 000 so'm", "104 000 so'm"], 1, P(["96 000:8=12 000.", '96 000:8=12 000.'], ["1 kg mevaning narxi 12 000 so'm.", 'Цена 1 кг — 12 000 сумов.']), L('p=C:n formulasini ishlating.', 'Используйте p=C:n.'), eq('p=96 000:8')),
    Q(L('Chegirmali narx', 'Цена со скидкой'), L("240 000 so'mlik sumkaga 25% chegirma berildi. Yangi narx qancha?", 'На сумку за 240 000 сумов скидка 25%. Какова новая цена?'), L('Avval chegirma summasini toping.', 'Сначала найдите сумму скидки.'), ["60 000 so'm", "180 000 so'm", "215 000 so'm", "300 000 so'm"], 1, P(["240 000·25%=60 000.", '240 000·25%=60 000.'], ["240 000−60 000=180 000.", '240 000−60 000=180 000.']), L('Chegirmani eski narxdan ayiring.', 'Вычтите скидку из старой цены.'), chain('240 000·25%', '60 000', '180 000')),
    Q(L('Bir ishchining unumdorligi', 'Производительность работника'), L('Usta 6 soatda 48 detal tayyorladi. Soatlik unumdorligi nechta?', 'Мастер изготовил 48 деталей за 6 часов. Какова производительность?'), L('Ishni vaqtga bo‘ling.', 'Разделите работу на время.'), ['6 detal', '8 detal', '42 detal', '54 detal'], 1, P(["r=A:t=48:6.", 'r=A:t=48:6.'], ["r=8, ya'ni soatiga 8 ta detal.", 'r=8 деталей в час.']), L('r=A:t formulasini ishlating.', 'Используйте r=A:t.'), eq('48:6=8')),
    Q(L('Birgalikdagi ish', 'Совместная работа'), L('Ikki uskuna soatiga 9 va 11 detal tayyorlaydi. 5 soatda jami nechta detal?', 'Два станка делают 9 и 11 деталей в час. Сколько за 5 часов?'), L('Avval unumdorliklarni qo‘shing.', 'Сначала сложите производительности.'), ['20', '45', '55', '100'], 3, P(["9+11=20, ya'ni soatiga 20 ta detal.", '9+11=20 деталей в час.'], ["20·5=100 detal.", '20·5=100 деталей.']), L('Birgalikdagi unumdorlik vaqtga ko‘payadi.', 'Совместную производительность умножьте на время.'), chain('9+11=20', '20·5=100')),
    Q(L('Tenglama bilan xarid', 'Покупка с уравнением'), L("3 ta bir xil futbolka va 15 000 so'm yetkazish jami 195 000 so'm. Bitta futbolka narxi?", '3 одинаковые футболки и доставка 15 000 сумов стоят 195 000. Цена одной футболки?'), L('3x+15 000=195 000 tenglamani yeching.', 'Решите 3x+15 000=195 000.'), ["45 000 so'm", "60 000 so'm", "65 000 so'm", "180 000 so'm"], 1, P(["3x=180 000.", '3x=180 000.'], ["x=60 000 so'm.", 'x=60 000 сумов.']), L('Avval yetkazish haqini ayiring.', 'Сначала вычтите доставку.'), chain('3x=180 000', 'x=60 000')),
  ],
  summary: P(
    ["Xarid qiymati C=p·n formula bilan topiladi.", 'Стоимость покупки находят по формуле C=p·n.'],
    ["Ish miqdori A=r·t, birgalikdagi unumdorliklar esa qo'shiladi.", 'Работа A=r·t, совместные производительности складываются.'],
    ["Iqtisodiy masalada son, birlik va hayotiy ma'no birgalikda tekshiriladi.", 'В экономической задаче проверяют число, единицу и жизненный смысл.'],
  ),
});

const D37 = makeLesson({
  id: 37,
  title: L('Aylana va doira', 'Окружность и круг'),
  subtitle: L("Markaz, radius, diametr, vatar va yoyni farqlab, aylana bilan doira orasidagi farqni tushunamiz.", 'Различим центр, радиус, диаметр, хорду и дугу, поймём разницу между окружностью и кругом.'),
  decorations: ['O', 'r', 'd=2r', '◯'],
  visual: { type: 'circle', mode: 'radius', segmentLabel: 'r', caption: L('O — markaz, r — radius', 'O — центр, r — радиус') },
  hook: Q(L('Chegara yoki ichki qism?', 'Граница или внутренняя часть?'), L('Velosiped g‘ildiragining tashqi cheti qaysi tushunchaga mos?', 'Какому понятию соответствует внешний обод колеса?'), L('Faqat chegarani tasavvur qiling.', 'Представьте только границу.'), [L('Aylana', 'Окружность'), L('Doira', 'Круг'), L('Radius', 'Радиус'), L('Markaz', 'Центр')], 0, P(["Aylana — markazdan teng masofadagi nuqtalar chegarasi.", 'Окружность — граница из точек, равноудалённых от центра.'], ["G'ildirakning tashqi cheti aylanaga o'xshaydi.", 'Обод колеса похож на окружность.']), L('Ichki yuza emas, tashqi chiziq so‘ralgan.', 'Спрашивается граница, а не внутренняя область.'), { type: 'circle', mode: 'radius' }),
  concepts: [
    C(L('Aylana ta’rifi', 'Определение окружности'), P(["Berilgan O nuqtadan bir xil masofadagi barcha nuqtalar aylana hosil qiladi.", 'Все точки на одинаковом расстоянии от O образуют окружность.'], ["Bu bir xil masofa radius deb ataladi.", 'Это одинаковое расстояние называется радиусом.']), { type: 'circle', mode: 'radius', segmentLabel: 'r' }, true),
    C(L('Doira ta’rifi', 'Определение круга'), P(["Aylana va uning ichidagi barcha nuqtalar birgalikda doira deyiladi.", 'Окружность вместе со всеми внутренними точками называется кругом.'], ["Disk, tanganing yuzi va dumaloq stol usti doiraga misol.", 'Диск, поверхность монеты и круглого стола — примеры круга.']), panels({ title: L('Aylana', 'Окружность'), lines: [L('faqat chegara', 'только граница')], color: 'blue' }, { title: L('Doira', 'Круг'), lines: [L('chegara va ichki qism', 'граница и внутри')], color: 'yellow' })),
    C(L('Radius', 'Радиус'), P(["Markazni aylananing istalgan nuqtasi bilan tutashtirgan kesma radius.", 'Отрезок от центра до любой точки окружности — радиус.'], ["Bitta aylanadagi barcha radiuslar teng.", 'Все радиусы одной окружности равны.']), { type: 'circle', mode: 'radius', segmentLabel: 'r' }),
    C(L('Diametr', 'Диаметр'), P(["Markazdan o'tib, aylananing ikki nuqtasini tutashtirgan kesma diametr.", 'Отрезок через центр, соединяющий две точки окружности, — диаметр.'], ["Diametr ikki radiusga teng: d=2r.", 'Диаметр равен двум радиусам: d=2r.']), { type: 'circle', mode: 'diameter', segmentLabel: 'd', caption: 'd=2r' }, true),
    C(L('Vatar va yoy', 'Хорда и дуга'), P(["Aylananing ikki nuqtasini tutashtirgan kesma vatar deyiladi.", 'Отрезок, соединяющий две точки окружности, называется хордой.'], ["Shu nuqtalar orasidagi aylana bo'lagi yoy deyiladi; diametr eng uzun vatar.", 'Часть окружности между точками — дуга; диаметр — самая длинная хорда.']), cards(L('vatar — kesma', 'хорда — отрезок'), L('yoy — aylana bo‘lagi', 'дуга — часть окружности'))),
    C(L('Ichki, tashqi va aylana nuqtasi', 'Внутри, снаружи и на окружности'), P(["Markazgacha masofa r dan kichik bo'lsa, nuqta doira ichida.", 'Если расстояние до центра меньше r, точка внутри круга.'], ["Masofa r ga teng bo'lsa aylanada, r dan katta bo'lsa tashqarida.", 'Если равно r — на окружности, больше r — снаружи.']), cards('OA<r', 'OB=r', 'OC>r')),
    C(L('Sirkul bilan yasash', 'Построение циркулем'), P(["Sirkul ignasi markazga, qalam uchi radius masofasiga qo'yiladi.", 'Иглу циркуля ставят в центр, карандаш — на расстояние радиуса.'], ["Sirkul ochilishi o'zgarmasa, barcha nuqtalar markazdan teng masofada chiqadi.", 'Если раствор не меняется, все точки равноудалены от центра.']), { type: 'steps', items: [L('Markaz', 'Центр'), L('Radiusni ochish', 'Задать радиус'), L('Aylantirish', 'Повернуть')] }),
  ],
  tasks: [
    Q(L('Diametrni toping', 'Найдите диаметр'), L('Radius 6 cm bo‘lsa, diametr qancha?', 'Радиус равен 6 см. Чему равен диаметр?'), L('d=2r formulasini ishlating.', 'Используйте d=2r.'), ['3 cm', '6 cm', '12 cm', '36 cm'], 2, P(["d=2·6.", 'd=2·6.'], ["d=12 cm.", 'd=12 см.']), L('Diametr ikki radiusdan iborat.', 'Диаметр состоит из двух радиусов.'), eq('d=2·6')),
    Q(L('Radiusni toping', 'Найдите радиус'), L('Diametr 18 cm. Radiusni toping.', 'Диаметр равен 18 см. Найдите радиус.'), L('r=d:2.', 'r=d:2.'), ['6 cm', '9 cm', '18 cm', '36 cm'], 1, P(["r=18:2.", 'r=18:2.'], ["r=9 cm.", 'r=9 см.']), L('Diametrni ikkiga bo‘ling.', 'Разделите диаметр пополам.'), eq('r=18:2')),
    MATCH(L('Tushunchalarni moslashtiring', 'Сопоставьте понятия'), L('Har bir geometrik nomga ta’rifini toping.', 'Подберите определение.'), L('Kesmaning markazdan o‘tishi yoki o‘tmasligiga e’tibor bering.', 'Обратите внимание, проходит ли отрезок через центр.'), [{ left: L('Radius', 'Радиус'), correct: L('Markazdan aylanagacha kesma', 'От центра до окружности') }, { left: L('Diametr', 'Диаметр'), correct: L('Markazdan o‘tuvchi eng uzun vatar', 'Хорда через центр') }, { left: L('Yoy', 'Дуга'), correct: L('Aylananing ikki nuqta orasidagi qismi', 'Часть окружности между точками') }], P(["Radius markazdan chiqadi, diametr markazdan o'tadi, yoy esa egri qism.", 'Радиус идёт от центра, диаметр через центр, дуга — кривая часть.'], ["Ta'riflar shaklning asosiy belgisini aytadi.", 'Определения указывают главный признак.']), L('Markaz so‘ziga e’tibor bering.', 'Обратите внимание на слово «центр».')),
    CLS(L('Aylana va doira', 'Окружность и круг'), L('Misollarni chegara va ichki yuzaga ajrating.', 'Разделите примеры на границу и заполненную область.'), L('Faqat chetmi yoki ichki qism ham bormi?', 'Только край или есть внутренняя часть?'), L('Aylana', 'Окружность'), L('Doira', 'Круг'), [[L('Halqaning cheti', 'Обод кольца'), true], [L('Dumaloq likopcha yuzi', 'Поверхность тарелки'), false], [L('Soat gardishi', 'Обод часов'), true], [L('Tanga yuzi', 'Поверхность монеты'), false]], P(["Halqa va gardish chegara; likopcha va tanga yuzi ichki qism bilan olinadi.", 'Обод — граница; поверхности тарелки и монеты включают внутренность.'], ["Aylana bir o'lchamli chegara, doira esa yuza.", 'Окружность — граница, круг — область.']), L('Ichki qism bo‘lsa, doira guruhiga qo‘ying.', 'Если есть внутренняя часть, выбирайте круг.')),
    Q(L('Nuqtaning o‘rni', 'Положение точки'), L('r=5 cm va OA=7 cm. A nuqta qayerda?', 'r=5 см и OA=7 см. Где точка A?'), L('OA ni radius bilan taqqoslang.', 'Сравните OA с радиусом.'), [L('Markazda', 'В центре'), L('Doira ichida', 'Внутри круга'), L('Aylanada', 'На окружности'), L('Doira tashqarisida', 'Вне круга')], 3, P(["OA=7>5=r.", 'OA=7>5=r.'], ["A nuqta doira tashqarisida.", 'Точка A вне круга.']), L('Markazgacha masofa radiusdan katta.', 'Расстояние до центра больше радиуса.'), cards('OA=7', 'r=5', '7>5')),
    Q(L('Eng uzun vatar', 'Самая длинная хорда'), L('Aylanadagi eng uzun vatar qaysi?', 'Какая хорда окружности самая длинная?'), L('Markazdan o‘tuvchi vatarni eslang.', 'Вспомните хорду, проходящую через центр.'), [L('Radius', 'Радиус'), L('Diametr', 'Диаметр'), L('Yoy', 'Дуга'), L('Markaz', 'Центр')], 1, P(["Diametr markazdan o'tadi.", 'Диаметр проходит через центр.'], ["U aylanadagi eng uzun vatardir.", 'Это самая длинная хорда окружности.']), L('Bu kesma ikki radiusga teng.', 'Этот отрезок равен двум радиусам.'), { type: 'circle', mode: 'diameter', segmentLabel: 'd' }),
  ],
  summary: P(
    ["Aylana — chegara, doira — chegara bilan ichki qism.", 'Окружность — граница, круг — граница и внутренняя область.'],
    ["Radius — markazdan aylanagacha bo'lgan kesma, diametr esa markazdan o'tuvchi eng uzun vatardir.", 'Радиус идёт от центра до окружности, диаметр проходит через центр.'],
    ["d=2r va r=d:2.", 'd=2r и r=d:2.'],
  ),
});

const D38 = makeLesson({
  id: 38,
  title: L('Aylana uzunligi', 'Длина окружности'),
  subtitle: L("π sonining ma'nosini tushunib, radius yoki diametr orqali aylana uzunligini hisoblaymiz.", 'Поймём смысл числа π и вычислим длину окружности по радиусу или диаметру.'),
  decorations: ['π≈3,14', 'C=2πr', 'C=πd', 'r'],
  visual: { type: 'circle', mode: 'diameter', segmentLabel: 'd', caption: 'C=πd=2πr' },
  hook: Q(L('G‘ildirak cheti', 'Обод колеса'), L('Diametri 1 m bo‘lgan g‘ildirak cheti taxminan necha metr?', 'Какова примерно длина обода колеса диаметром 1 м?'), L("Aylana uzunligi diametrning taxminan 3,14 baravariga teng.", 'Длина окружности примерно в 3,14 раза больше диаметра.'), ['1 m', '2 m', '3,14 m', '6,28 m'], 2, P(["C=πd≈3,14·1.", 'C=πd≈3,14·1.'], ["C≈3,14 metr.", 'C≈3,14 метра.']), L('Diametrni π ga ko‘paytiring.', 'Умножьте диаметр на π.'), eq('C≈3,14·1')),
  concepts: [
    C(L('π soni', 'Число π'), P(["Har qanday aylana uzunligining diametriga nisbati bir xil son — π.", 'Отношение длины любой окружности к диаметру равно числу π.'], ["Hisoblarda π≈3,14 deb olinadi.", 'В вычислениях берут π≈3,14.']), cards('π=C:d', 'π≈3,14'), true),
    C(L('Diametr orqali formula', 'Формула через диаметр'), P(["Aylana uzunligi C=πd.", 'Длина окружности C=πd.'], ["Diametr ma'lum bo'lsa, uni π ga ko'paytiramiz.", 'Если известен диаметр, умножаем его на π.']), eq('C=πd'), true),
    C(L('Radius orqali formula', 'Формула через радиус'), P(["d=2r bo'lgani uchun C=2πr.", 'Так как d=2r, то C=2πr.'], ["Radius ma'lum bo'lsa, 2, π va r ni ko'paytiramiz.", 'Если известен радиус, умножаем 2, π и r.']), chain('C=πd', 'd=2r', 'C=2πr'), true),
    C(L('O‘lchov birligi', 'Единица измерения'), P(["Aylana uzunligi chiziqli kattalik: mm, cm, m yoki km.", 'Длина окружности — линейная величина: мм, см, м или км.'], ["Uni cm² kabi yuza birligida yozmaymiz.", 'Её не записывают в единицах площади, например см².']), panels({ title: L("To'g'ri", 'Верно'), lines: ['C=31,4 cm'], color: 'green' }, { title: L("Noto'g'ri", 'Неверно'), lines: ['C=31,4 cm²'], color: 'yellow' })),
    C(L('Hisoblash namunasi', 'Пример вычисления'), P(["r=5 cm bo'lsa, C=2·3,14·5.", 'При r=5 см: C=2·3,14·5.'], ["C=31,4 cm.", 'C=31,4 см.']), chain('2·3,14·5', '31,4 cm')),
    C(L('Teskari masala', 'Обратная задача'), P(["C ma'lum bo'lsa, d=C:π.", 'Если C известно, d=C:π.'], ["Masalan, C=18,84 cm bo'lsa, d=18,84:3,14=6 cm.", 'Например, при C=18,84 см: d=18,84:3,14=6 см.']), chain('d=C:π', '18,84:3,14', '6 cm')),
    C(L('Yarim aylana chegarasi', 'Граница полуокружности'), P(["Yarim aylananing egri qismi C:2=πr.", 'Длина дуги полуокружности C:2=πr.'], ["Yarim doira perimetrida egri qismga diametr ham qo'shiladi: P=πr+2r.", 'В периметр полукруга входит дуга и диаметр: P=πr+2r.']), panels({ title: L('Yoy', 'Дуга'), lines: ['πr'], color: 'blue' }, { title: L('Yarim doira perimetri', 'Периметр полукруга'), lines: ['πr+2r'], color: 'yellow' })),
    C(L('Amaliy qo‘llanish', 'Практическое применение'), P(["G'ildirakning bir aylanishda bosgan yo'li uning aylana uzunligiga teng.", 'Путь колеса за один оборот равен длине его окружности.'], ["Aylanishlar soni n bo'lsa, yo'l s=n·C.", 'При n оборотах путь s=n·C.']), chain('1 aylanish=C', 'n aylanish=nC')),
  ],
  tasks: [
    Q(L('Radiusdan uzunlik', 'Длина по радиусу'), L('r=4 cm, π=3,14. C ni toping.', 'r=4 см, π=3,14. Найдите C.'), L('C=2πr.', 'C=2πr.'), ['12,56 cm', '25,12 cm', '50,24 cm', '16 cm'], 1, P(["C=2·3,14·4.", 'C=2·3,14·4.'], ["C=25,12 cm.", 'C=25,12 см.']), L('2 ni unutmasdan ko‘paytiring.', 'Не забудьте множитель 2.'), eq('C=2·3,14·4')),
    Q(L('Diametrdan uzunlik', 'Длина по диаметру'), L('d=10 m, π=3,14. C ni toping.', 'd=10 м, π=3,14. Найдите C.'), L('C=πd.', 'C=πd.'), ['3,14 m', '13,14 m', '31,4 m', '62,8 m'], 2, P(["C=3,14·10.", 'C=3,14·10.'], ["C=31,4 m.", 'C=31,4 м.']), L('Diametr bo‘lsa, yana 2 ga ko‘paytirmang.', 'Если дан диаметр, не умножайте ещё раз на 2.'), eq('C=3,14·10')),
    M(L('To‘g‘ri formulalarni tanlang', 'Выберите верные формулы'), L('Aylana uzunligiga tegishli tengliklarni belgilang.', 'Отметьте формулы длины окружности.'), ['C=πd', 'C=2πr', 'S=πr²', 'd=2r'], [0, 1], P(["C=πd va C=2πr aylana uzunligi formulalari.", 'C=πd и C=2πr — формулы длины окружности.'], ["S=πr² yuza, d=2r esa diametr bog'lanishi.", 'S=πr² — площадь, d=2r — связь диаметра.']), L('C harfi bilan yozilgan formulalarni tekshiring.', 'Проверьте формулы с буквой C.')),
    Q(L('Diametrni tiklang', 'Найдите диаметр'), L('C=25,12 cm va π=3,14. d ni toping.', 'C=25,12 см и π=3,14. Найдите d.'), L('d=C:π.', 'd=C:π.'), ['4 cm', '8 cm', '12,56 cm', '78,88 cm'], 1, P(["d=25,12:3,14.", 'd=25,12:3,14.'], ["d=8 cm.", 'd=8 см.']), L('Aylana uzunligini π ga bo‘ling.', 'Разделите длину окружности на π.'), eq('d=25,12:3,14')),
    Q(L('G‘ildirak yo‘li', 'Путь колеса'), L('C=2 m bo‘lgan g‘ildirak 15 marta aylandi. Necha metr yo‘l bosdi?', 'Колесо с длиной окружности 2 м сделало 15 оборотов. Какой путь?'), L('Har aylanishda 2 metr.', 'За каждый оборот 2 метра.'), ['7,5 m', '17 m', '30 m', '45 m'], 2, P(["s=n·C=15·2.", 's=n·C=15·2.'], ["s=30 m.", 's=30 м.']), L('Aylanishlar sonini bir aylanish yo‘liga ko‘paytiring.', 'Умножьте число оборотов на путь одного оборота.'), eq('15·2=30')),
  ],
  summary: P(
    ["π=C:d va hisoblarda π≈3,14.", 'π=C:d, в вычислениях π≈3,14.'],
    ["Aylana uzunligi C=πd=2πr.", 'Длина окружности C=πd=2πr.'],
    ["Aylana uzunligi chiziqli birlikda yoziladi.", 'Длину окружности записывают в линейных единицах.'],
  ),
});

const D39 = makeLesson({
  id: 39,
  title: L('Doira yuzi', 'Площадь круга'),
  subtitle: L("Radius kvadrati va π yordamida doira yuzini hisoblaymiz hamda aylana uzunligidan farqlaymiz.", 'Вычислим площадь круга через квадрат радиуса и π, отличим её от длины окружности.'),
  decorations: ['S=πr²', 'r²', 'cm²', 'π≈3,14'],
  visual: { type: 'circle', mode: 'radius', segmentLabel: 'r', caption: 'S=πr²' },
  hook: Q(L('Dumaloq gilam', 'Круглый ковёр'), L('Radiusi 2 m bo‘lgan dumaloq gilam yuzi qaysi ifoda bilan topiladi?', 'Как найти площадь круглого ковра радиусом 2 м?'), L('Doira yuzi formulasi S=πr².', 'Формула площади круга S=πr².'), ['2π', '4π', '8π', '16π'], 1, P(["r²=2²=4.", 'r²=2²=4.'], ["S=4π m².", 'S=4π м².']), L("Radiusni kvadratga ko'taring.", 'Возведите радиус в квадрат.'), eq('S=π·2²')),
  concepts: [
    C(L('Yuza nimani o‘lchaydi?', 'Что измеряет площадь?'), P(["Yuza doiraning ichki qismi qancha joy egallashini bildiradi.", 'Площадь показывает размер внутренней области круга.'], ["Shu sabab birlik kvadrat ko'rinishida: cm², m².", 'Поэтому единицы квадратные: см², м².']), panels({ title: L('Aylana uzunligi', 'Длина окружности'), lines: ['cm'], color: 'blue' }, { title: L('Doira yuzi', 'Площадь круга'), lines: ['cm²'], color: 'yellow' })),
    C(L('Asosiy formula', 'Главная формула'), P(["Doira yuzi S=πr².", 'Площадь круга S=πr².'], ["r² — radiusning o'ziga ko'paytmasi: r²=r·r.", 'r² — произведение радиуса на себя: r²=r·r.']), chain('S=πr²', 'r²=r·r'), true),
    C(L('Hisoblash tartibi', 'Порядок вычисления'), P(["Avval radius kvadratini toping.", 'Сначала найдите квадрат радиуса.'], ["Keyin natijani π ga ko'paytiring.", 'Затем умножьте результат на π.']), { type: 'steps', items: [L('r²', 'r²'), L('π ga ko‘paytirish', 'Умножить на π'), L('Kvadrat birlik', 'Квадратная единица')] }),
    C(L('Namuna', 'Пример'), P(["r=5 cm: S=3,14·5².", 'r=5 см: S=3,14·5².'], ["S=3,14·25=78,5 cm².", 'S=3,14·25=78,5 см².']), chain('5²=25', '3,14·25', '78,5 cm²')),
    C(L('Diametr berilganda', 'Если дан диаметр'), P(["Avval radiusni toping: r=d:2.", 'Сначала найдите радиус: r=d:2.'], ["So'ng S=πr² formulasini qo'llang.", 'Затем примените S=πr².']), chain('d=12', 'r=6', 'S=36π')),
    C(L('Yarim va chorak doira', 'Полукруг и четверть круга'), P(["Yarim doira yuzi S/2, chorak doira yuzi S/4.", 'Площадь полукруга S/2, четверти круга S/4.'], ["Avval to'liq doira yuzini topib, keyin bo'lish ishonchli.", 'Сначала найдите площадь полного круга, затем делите.']), cards('Syarim=πr²/2', 'Schorak=πr²/4')),
    C(L('Halqa yuzi', 'Площадь кольца'), P(["Tashqi radius R, ichki radius r bo'lsa, halqa yuzi kattadan kichik doira yuzini ayirish bilan topiladi.", 'Площадь кольца равна разности площадей кругов радиусов R и r.'], ["S=πR²−πr²=π(R²−r²).", 'S=πR²−πr²=π(R²−r²).']), chain('πR²−πr²', 'π(R²−r²)')),
    C(L('Formula tanlash', 'Выбор формулы'), P(["Chegara uzunligi so'ralsa C=2πr.", 'Если нужна длина границы, используйте C=2πr.'], ["Ichki yuza so'ralsa S=πr².", 'Если нужна внутренняя площадь, используйте S=πr².']), panels({ title: L('Chet', 'Граница'), lines: ['C=2πr'], color: 'blue' }, { title: L('Ichki qism', 'Внутри'), lines: ['S=πr²'], color: 'yellow' })),
  ],
  tasks: [
    Q(L('Radiusdan yuza', 'Площадь по радиусу'), L('r=3 cm, π=3,14. S ni toping.', 'r=3 см, π=3,14. Найдите S.'), L('3²=9 ni π ga ko‘paytiring.', 'Умножьте 3²=9 на π.'), ['9,42 cm²', '18,84 cm²', '28,26 cm²', '56,52 cm²'], 2, P(["S=3,14·9.", 'S=3,14·9.'], ["S=28,26 cm².", 'S=28,26 см².']), L("Radiusni ikki marta oshirmang; uning kvadratini hisoblang.", 'Не умножайте радиус на два, возведите в квадрат.'), eq('S=3,14·3²')),
    Q(L('Diametrdan yuza', 'Площадь по диаметру'), L('d=10 m. π=3,14 bo‘lsa, S ni toping.', 'd=10 м. При π=3,14 найдите S.'), L('Avval r=5 m.', 'Сначала r=5 м.'), ['31,4 m²', '62,8 m²', '78,5 m²', '314 m²'], 2, P(["r=10:2=5.", 'r=10:2=5.'], ["S=3,14·25=78,5 m².", 'S=3,14·25=78,5 м².']), L('Formulada diametr emas, radius qatnashadi.', 'В формуле используется радиус, а не диаметр.'), chain('d=10', 'r=5', 'S=78,5')),
    MATCH(L('Savol va formula', 'Вопрос и формула'), L('Har bir kattalikka mos formulani toping.', 'Подберите формулу.'), L('Chegara, ichki yuza va diametrni farqlang.', 'Различайте границу, площадь и диаметр.'), [{ left: L('Aylana uzunligi', 'Длина окружности'), correct: 'C=2πr' }, { left: L('Doira yuzi', 'Площадь круга'), correct: 'S=πr²' }, { left: L('Diametr', 'Диаметр'), correct: 'd=2r' }], P(["C uzunlik, S yuza, d diametrni bildiradi.", 'C обозначает длину, S площадь, d диаметр.'], ["Har bir formula o'z kattaligiga tegishli.", 'Каждая формула относится к своей величине.']), L('Harf belgilariga qarang.', 'Смотрите на буквенные обозначения.')),
    Q(L('Yarim doira yuzi', 'Площадь полукруга'), L('r=4 cm bo‘lgan yarim doira yuzini π bilan yozing.', 'Запишите через π площадь полукруга радиусом 4 см.'), L('To‘liq yuza 16π, yarmini oling.', 'Полная площадь 16π, возьмите половину.'), ['4π cm²', '8π cm²', '16π cm²', '32π cm²'], 1, P(["S=π·4²=16π.", 'S=π·4²=16π.'], ["Yarmi 8π cm².", 'Половина равна 8π см².']), L('To‘liq doira yuzini 2 ga bo‘ling.', 'Разделите площадь круга на 2.'), chain('16π:2', '8π')),
    Q(L('Halqa yuzi', 'Площадь кольца'), L('R=5 cm va r=3 cm. Halqa yuzini π bilan toping.', 'R=5 см и r=3 см. Найдите площадь кольца через π.'), L('π(R²−r²).', 'π(R²−r²).'), ['2π cm²', '8π cm²', '16π cm²', '34π cm²'], 2, P(["5²−3²=25−9.", '5²−3²=25−9.'], ["S=16π cm².", 'S=16π см².']), L('Kvadratlar ayirmasini hisoblang.', 'Вычислите разность квадратов.'), chain('π(25−9)', '16π')),
  ],
  summary: P(
    ["Doira yuzi S=πr² formula bilan topiladi.", 'Площадь круга находят по формуле S=πr².'],
    ["Yuza kvadrat birliklarda yoziladi.", 'Площадь записывают в квадратных единицах.'],
    ["Diametr berilsa, avval r=d:2 topiladi.", 'Если дан диаметр, сначала находят r=d:2.'],
  ),
});

const D40 = makeLesson({
  id: 40,
  title: L("O'q simmetriyasi", 'Осевая симметрия'),
  subtitle: L("Simmetriya o'qiga nisbatan aks nuqtalarni teng masofada yasaymiz va shakllardagi o'qlarni topamiz.", 'Построим зеркальные точки на равном расстоянии от оси и найдём оси фигур.'),
  decorations: ['A↔A′', 'l', 'oyna', 'teng masofa'],
  visual: { type: 'symmetry', left: 'A', right: "A′", caption: L("l — simmetriya o'qi", 'l — ось симметрии') },
  hook: Q(L('Ko‘zgu aksi', 'Зеркальное отражение'), L('Nuqta o‘qdan chapda 3 katakda. Uning aksi qayerda bo‘ladi?', 'Точка слева на расстоянии 3 клеток от оси. Где её образ?'), L('Aks nuqta o‘qning boshqa tomonida shu masofada turadi.', 'Образ находится с другой стороны на том же расстоянии.'), [L('Chapda 6 katak', 'Слева в 6 клетках'), L('O‘q ustida', 'На оси'), L('O‘ngda 3 katak', 'Справа в 3 клетках'), L('O‘ngda 6 katak', 'Справа в 6 клетках')], 2, P(["Nuqta va aksi o'qdan teng masofada.", 'Точка и образ равноудалены от оси.'], ["Tomon almashadi, masofa 3 katakligicha qoladi.", 'Сторона меняется, расстояние остаётся 3 клетки.']), L('Ko‘zgu qoidasini eslang.', 'Вспомните правило зеркала.'), { type: 'symmetry', left: 'A', right: "A′", caption: L('3 katak ↔ 3 katak', '3 клетки ↔ 3 клетки') }),
  concepts: [
    C(L("Simmetriya o'qi", 'Ось симметрии'), P(["Shaklni ikki mos ko'zgu qismga ajratadigan to'g'ri chiziq simmetriya o'qi deyiladi.", 'Прямая, делящая фигуру на зеркально равные части, — ось симметрии.'], ["Shakl o'q bo'ylab buklansa, ikki qism ustma-ust tushadi.", 'При сгибании по оси половины совпадают.']), { type: 'symmetry', left: '◖', right: '◖', caption: L('Buklanganda ustma-ust', 'Совпадают при сгибании') }, true),
    C(L('Aks nuqtalar xossasi', 'Свойство симметричных точек'), P(["AA′ kesma simmetriya o'qiga perpendikulyar.", 'Отрезок AA′ перпендикулярен оси симметрии.'], ["O'q AA′ kesmani teng ikkiga bo'ladi.", 'Ось делит AA′ пополам.']), cards('AA′ ⟂ l', 'AO=OA′'), true),
    C(L('O‘q ustidagi nuqta', 'Точка на оси'), P(["Nuqta simmetriya o'qida yotsa, akslantirganda o'z joyida qoladi.", 'Точка на оси при отражении остаётся на месте.'], ["Bunday nuqta o'ziga o'zi simmetrik.", 'Такая точка симметрична самой себе.']), { type: 'symmetry', left: 'O', right: 'O', caption: L('O o‘qda', 'O на оси') }),
    C(L('Shaklni akslantirish', 'Отражение фигуры'), P(["Har bir uchning aksini alohida yasang.", 'Постройте образ каждой вершины.'], ["So'ng aks nuqtalarni asl shakldagi tartibda tutashtiring.", 'Затем соедините образы в том же порядке.']), { type: 'steps', items: [L('Uchlar', 'Вершины'), L('Teng masofa', 'Равные расстояния'), L('Tutashtirish', 'Соединить')] }),
    C(L('Shakllarning o‘qlari', 'Оси фигур'), P(["Kvadratning 4 ta, to'g'ri to'rtburchakning 2 ta simmetriya o'qi bor.", 'У квадрата 4 оси, у прямоугольника 2.'], ["Teng yonli uchburchakning 1 ta, turli tomonli uchburchakning 0 ta o'qi bor.", 'У равнобедренного треугольника 1 ось, у разностороннего 0.']), panels({ title: L('Kvadrat', 'Квадрат'), lines: ['4'], color: 'blue' }, { title: L('To‘g‘ri to‘rtburchak', 'Прямоугольник'), lines: ['2'], color: 'yellow' })),
    C(L('Koordinatada akslantirish', 'Отражение в координатах'), P(["y o'qiga nisbatan (x;y) → (−x;y).", 'Относительно оси y: (x;y) → (−x;y).'], ["x o'qiga nisbatan (x;y) → (x;−y).", 'Относительно оси x: (x;y) → (x;−y).']), panels({ title: L('y o‘qiga', 'Относительно y'), lines: ['(x;y)→(−x;y)'], color: 'blue' }, { title: L('x o‘qiga', 'Относительно x'), lines: ['(x;y)→(x;−y)'], color: 'yellow' }), true),
    C(L('Hayotdagi simmetriya', 'Симметрия в жизни'), P(["Kapalak qanotlari, barg va ko'plab naqshlarda o'q simmetriyasi ko'rinadi.", 'Осевая симметрия видна в крыльях бабочки, листьях и орнаментах.'], ["Mukammal tabiiy shakllarda ham kichik farqlar bo'lishi mumkin.", 'Даже в природных формах возможны небольшие различия.']), { type: 'symmetry', left: '❧', right: '❧', caption: L('Naqshdagi simmetriya', 'Симметрия орнамента') }),
  ],
  tasks: [
    Q(L('Aks koordinata', 'Координаты образа'), L('A(3;−2) ni y o‘qiga nisbatan akslantiring.', 'Отразите A(3;−2) относительно оси y.'), L('x ishorasi almashadi, y o‘zgarmaydi.', 'Знак x меняется, y остаётся.'), ['(−3;−2)', '(3;2)', '(−3;2)', '(2;−3)'], 0, P(["3 → −3.", '3 → −3.'], ["−2 o'zgarmaydi: A′(−3;−2).", '−2 не меняется: A′(−3;−2).']), L('y o‘qiga aksda birinchi koordinata o‘zgaradi.', 'При отражении относительно y меняется первая координата.'), { type: 'coordinatePlane', points: [{ x: 3, y: -2, label: 'A' }, { x: -3, y: -2, label: "A′", color: 'blue' }] }),
    Q(L('x o‘qiga aks', 'Отражение относительно x'), L('B(−4;5) ning x o‘qiga nisbatan aksi qaysi?', 'Каков образ B(−4;5) относительно оси x?'), L('y ishorasi almashadi.', 'Меняется знак y.'), ['(4;5)', '(−4;−5)', '(4;−5)', '(−5;4)'], 1, P(["x=−4 o'zgarmaydi.", 'x=−4 не меняется.'], ["y=5 → −5.", 'y=5 → −5.']), L('Ikkinchi koordinata ishorasini almashtiring.', 'Измените знак второй координаты.'), cards('(−4;5)→(−4;−5)')),
    MATCH(L('Shakl va o‘qlar soni', 'Фигура и число осей'), L('Shakllarni simmetriya o‘qlari soni bilan moslashtiring.', 'Сопоставьте фигуры и число осей.'), L('Shaklni mumkin bo‘lgan yo‘nalishlarda buklashni tasavvur qiling.', 'Представьте сгибание фигуры.'), [{ left: L('Kvadrat', 'Квадрат'), correct: '4' }, { left: L('To‘g‘ri to‘rtburchak', 'Прямоугольник'), correct: '2' }, { left: L('Teng yonli uchburchak', 'Равнобедренный треугольник'), correct: '1' }], P(["Kvadratda 4, to'g'ri to'rtburchakda 2, teng yonli uchburchakda 1 o'q.", 'У квадрата 4, прямоугольника 2, равнобедренного треугольника 1 ось.'], ["O'qlar shaklni teng ko'zgu qismlarga ajratadi.", 'Оси делят фигуру на зеркальные половины.']), L('Diagonal va o‘rta chiziqlarni tekshiring.', 'Проверьте диагонали и средние линии.')),
    M(L('To‘g‘ri xossalarni tanlang', 'Выберите верные свойства'), L('O‘q simmetriyasiga tegishli fikrlarni belgilang.', 'Отметьте свойства осевой симметрии.'), [L('Nuqta va aksi o‘qdan teng masofada', 'Точка и образ равноудалены от оси'), L('Barcha koordinatalar ishorasi almashadi', 'Знаки всех координат всегда меняются'), L('O‘q AA′ ni teng ikkiga bo‘ladi', 'Ось делит AA′ пополам'), L('O‘qdagi nuqta joyini o‘zgartiradi', 'Точка на оси меняет место')], [0, 2], P(["Teng masofa va kesmaning teng bo'linishi asosiy xossalardir.", 'Равные расстояния и деление отрезка пополам — основные свойства.'], ["Koordinata o'zgarishi tanlangan o'qqa bog'liq.", 'Изменение координат зависит от выбранной оси.']), L('Geometrik ta’rifga tayangan fikrlarni tanlang.', 'Выберите свойства из определения.')),
    Q(L('O‘qdagi nuqta', 'Точка на оси'), L('C nuqta simmetriya o‘qida yotadi. Uning aksi qayerda?', 'Точка C лежит на оси симметрии. Где её образ?'), L('O‘qdagi nuqta o‘z joyida qoladi.', 'Точка на оси остаётся на месте.'), [L('C ning o‘zida', 'Совпадает с C'), L('O‘qdan chapda', 'Слева от оси'), L('O‘qdan o‘ngda', 'Справа от оси'), L('Aniqlab bo‘lmaydi', 'Нельзя определить')], 0, P(["C dan o'qqacha masofa nol.", 'Расстояние от C до оси равно нулю.'], ["Aksi ham shu nuqtaning o'zi.", 'Её образ совпадает с ней.']), L('Nol masofa boshqa tomonda ham nol bo‘lib qoladi.', 'Нулевое расстояние остаётся нулевым.'), cards('C=C′')),
    Q(L('Teng masofa', 'Равные расстояния'), L('A nuqta o‘qdan 4 cm uzoqda. A′ aksi o‘qdan qancha uzoqda?', 'Точка A на расстоянии 4 см от оси. Каково расстояние образа A′?'), L('Aks nuqtalar o‘qdan teng masofada.', 'Симметричные точки равноудалены от оси.'), ['0 cm', '2 cm', '4 cm', '8 cm'], 2, P(["A dan o'qqacha 4 cm.", 'От A до оси 4 см.'], ["A′ dan o'qqacha ham 4 cm.", 'От A′ до оси тоже 4 см.']), L('Masofa o‘zgarmaydi.', 'Расстояние не меняется.'), { type: 'symmetry', left: 'A', right: "A′", caption: '4 cm ↔ 4 cm' }),
  ],
  summary: P(
    ["O'q simmetriyasi shaklni ko'zgu kabi akslantiradi.", 'Осевая симметрия отражает фигуру как зеркало.'],
    ["Nuqta va aksi o'qdan teng masofada, ularni tutashtiruvchi kesma o'qqa perpendikulyar.", 'Точка и образ равноудалены от оси, соединяющий отрезок перпендикулярен оси.'],
    ["y o'qiga aksda x, x o'qiga aksda y ishorasi almashadi.", 'При отражении относительно y меняется знак x, относительно x — знак y.'],
  ),
});

const D41 = makeLesson({
  id: 41,
  title: L('Markaziy simmetriya', 'Центральная симметрия'),
  subtitle: L("Nuqtani markaz atrofida 180° burishga teng akslantirib, koordinatalar qoidasini o'rganamiz.", 'Отразим точку через центр как поворот на 180° и изучим правило координат.'),
  decorations: ['O', 'A↔A′', '180°', '(x;y)→(−x;−y)'],
  visual: { type: 'symmetry', left: 'A', right: "A′", caption: L('O — AA′ kesmaning o‘rtasi', 'O — середина AA′') },
  hook: Q(L('Markazdan narigi tomon', 'По другую сторону центра'), L('A nuqta O dan 3 katak o‘ngda. Markaziy simmetrik A′ qayerda?', 'Точка A на 3 клетки справа от O. Где центрально-симметричная A′?'), L("O nuqta AA′ kesmaning o'rtasi bo'lishi kerak.", 'O должен быть серединой отрезка.'), [L('3 katak o‘ngda', 'На 3 клетки справа'), L('3 katak chapda', 'На 3 клетки слева'), L('6 katak chapda', 'На 6 клеток слева'), L('O nuqtada', 'В точке O')], 1, P(["A va A′ O ning qarama-qarshi tomonlarida.", 'A и A′ лежат по разные стороны от O.'], ["OA=OA′=3 katak.", 'OA=OA′=3 клетки.']), L('Markaz ikki nuqta orasining aynan o‘rtasida.', 'Центр находится точно посередине.'), chain('A', 'O', "A′")),
  concepts: [
    C(L('Markaziy simmetriya ta’rifi', 'Определение центральной симметрии'), P(["A va A′ nuqtalar O ga nisbatan simmetrik, agar O AA′ kesmaning o'rtasi bo'lsa.", 'A и A′ симметричны относительно O, если O — середина AA′.'], ["OA=OA′ va nuqtalar bir to'g'ri chiziqda yotadi.", 'OA=OA′ и точки лежат на одной прямой.']), cards('A—O—A′', 'OA=OA′'), true),
    C(L('180 daraja burilish', 'Поворот на 180 градусов'), P(["Markaziy simmetriya shaklni O atrofida 180° burish bilan bir xil.", 'Центральная симметрия равносильна повороту на 180°.'], ["Yuqori-o'ng qism pastki-chap qismga o'tadi.", 'Верхняя правая часть переходит в нижнюю левую.']), chain('180°', L('qarama-qarshi tomon', 'противоположная сторона'))),
    C(L('Koordinatalar qoidasi', 'Правило координат'), P(["Sanoq boshiga nisbatan (x;y) → (−x;−y).", 'Относительно начала координат (x;y) → (−x;−y).'], ["Ikkala koordinataning ham ishorasi almashadi.", 'Меняются знаки обеих координат.']), chain('(x;y)', '(−x;−y)'), true),
    C(L('Markazning o‘zi', 'Сам центр'), P(["O markaz akslantirilganda o'z joyida qoladi.", 'Центр O при преобразовании остаётся на месте.'], ["Chunki O dan O gacha masofa nol.", 'Потому что расстояние от O до O равно нулю.']), cards('O=O′')),
    C(L('Shaklni yasash', 'Построение фигуры'), P(["Har bir uchni O dan narigi tomonga xuddi shu masofaga ko'chiring.", 'Перенесите каждую вершину на другую сторону от O на то же расстояние.'], ["Hosil bo'lgan nuqtalarni asl tartibda tutashtiring.", 'Соедините полученные точки в исходном порядке.']), { type: 'steps', items: [L('O bilan tutashtirish', 'Соединить с O'), L('Teng masofa', 'Равное расстояние'), L('Uchlarni ulash', 'Соединить вершины')] }),
    C(L('Markaziy simmetrik shakllar', 'Центрально-симметричные фигуры'), P(["Parallelogramm, to'g'ri to'rtburchak va aylana markaziy simmetriyaga ega.", 'Параллелограмм, прямоугольник и окружность имеют центральную симметрию.'], ["Oddiy uchburchak markaziy simmetriyaga ega emas.", 'Обычный треугольник не имеет центральной симметрии.']), panels({ title: L('Bor', 'Есть'), lines: [L('parallelogramm, aylana', 'параллелограмм, окружность')], color: 'green' }, { title: L("Yo'q", 'Нет'), lines: [L('uchburchak', 'треугольник')], color: 'yellow' })),
    C(L('O‘q va markaziy simmetriya farqi', 'Осевая и центральная симметрия'), P(["O'q simmetriyasida ko'zgu chizig'i, markaziy simmetriyada bitta markaz nuqtasi bor.", 'В осевой симметрии есть линия-зеркало, в центральной — точка-центр.'], ["Markaziy simmetriya 180° burilishga, o'q simmetriyasi esa ko'zgu aksiga teng.", 'Центральная симметрия — поворот на 180°, осевая — отражение.']), panels({ title: L("O'q", 'Осевая'), lines: [L('chiziqqa nisbatan', 'относительно прямой')], color: 'blue' }, { title: L('Markaziy', 'Центральная'), lines: [L('nuqtaga nisbatan', 'относительно точки')], color: 'yellow' })),
  ],
  tasks: [
    Q(L('Koordinatani akslantiring', 'Отразите координаты'), L('A(4;−3) ning O(0;0) ga nisbatan aksi qaysi?', 'Каков образ A(4;−3) относительно O(0;0)?'), L('Ikkala koordinata ishorasini almashtiring.', 'Измените знаки обеих координат.'), ['(−4;3)', '(4;3)', '(−4;−3)', '(3;−4)'], 0, P(["4 → −4.", '4 → −4.'], ["−3 → 3, demak A′(−4;3).", '−3 → 3, значит A′(−4;3).']), L('Markaziy simmetriyada ikkala ishora o‘zgaradi.', 'При центральной симметрии меняются оба знака.'), { type: 'coordinatePlane', points: [{ x: 4, y: -3, label: 'A' }, { x: -4, y: 3, label: "A′", color: 'blue' }] }),
    Q(L('O‘rta nuqta', 'Середина отрезка'), L('A(−2;5) va A′(2;−5) uchun simmetriya markazi qaysi?', 'Каков центр симметрии для A(−2;5) и A′(2;−5)?'), L('Koordinatalarning o‘rtacha qiymatini oling.', 'Найдите средние координаты.'), ['(0;0)', '(2;5)', '(−2;−5)', '(4;−10)'], 0, P(["(−2+2):2=0.", '(−2+2):2=0.'], ["(5−5):2=0, markaz O(0;0).", '(5−5):2=0, центр O(0;0).']), L('Qarama-qarshi koordinatalarning o‘rtasi nol.', 'Середина противоположных координат — ноль.'), cards('A—O—A′')),
    MATCH(L('Simmetriya turlarini ajrating', 'Различите виды симметрии'), L('Har bir xususiyatni turiga moslashtiring.', 'Сопоставьте свойства с видом.'), L('Chiziq va nuqta farqiga qarang.', 'Различайте прямую и точку.'), [{ left: L('Ko‘zgu chizig‘i bor', 'Есть линия-зеркало'), correct: L("O'q simmetriyasi — chiziqqa nisbatan", 'Осевая симметрия — относительно прямой') }, { left: L('180° burilishga teng', 'Равна повороту на 180°'), correct: L('Markaziy simmetriya — yarim burilish', 'Центральная симметрия — полуоборот') }, { left: L('O — AA′ ning o‘rtasi', 'O — середина AA′'), correct: L('Markaziy simmetriya — o‘rta nuqta', 'Центральная симметрия — середина') }], P(["Ko'zgu chizig'i o'q simmetriyasiga, 180° va o'rta nuqta markaziy simmetriyaga tegishli.", 'Линия-зеркало относится к осевой, поворот и середина — к центральной.'], ["Har ikki tur masofa va shaklni saqlaydi.", 'Оба вида сохраняют расстояния и форму.']), L('Asosiy tayanch: chiziqmi yoki markazmi?', 'Главный вопрос: прямая или центр?')),
    M(L('Markaziy simmetriyali shakllar', 'Центрально-симметричные фигуры'), L('Markaziy simmetriyaga ega shakllarni tanlang.', 'Выберите фигуры с центральной симметрией.'), [L('Aylana', 'Окружность'), L('Parallelogramm', 'Параллелограмм'), L('Teng tomonli uchburchak', 'Равносторонний треугольник'), L('To‘g‘ri to‘rtburchak', 'Прямоугольник')], [0, 1, 3], P(["Aylana, parallelogramm va to'g'ri to'rtburchak 180° burilganda o'ziga tushadi.", 'Окружность, параллелограмм и прямоугольник совпадают при повороте на 180°.'], ["Uchburchak 180° burilganda o'ziga tushmaydi.", 'Треугольник не совпадает с собой при повороте на 180°.']), L('Shaklni 180 daraja burishni tasavvur qiling.', 'Представьте поворот на 180 градусов.')),
    Q(L('Markazgacha masofa', 'Расстояние до центра'), L('OA=7 cm bo‘lsa, OA′ qancha?', 'Если OA=7 см, чему равно OA′?'), L("O nuqta AA′ kesmaning o'rtasi.", 'O — середина отрезка.'), ['3,5 cm', '7 cm', '14 cm', '49 cm'], 1, P(["OA=OA′.", 'OA=OA′.'], ["OA′=7 cm.", 'OA′=7 см.']), L('Simmetrik nuqtalar markazdan teng masofada.', 'Симметричные точки равноудалены от центра.'), chain('OA', '=', 'OA′')),
    Q(L('Ikki marta akslantirish', 'Двойное преобразование'), L('Nuqtani bir markazga nisbatan ikki marta akslantirsak nima bo‘ladi?', 'Что произойдёт, если дважды отразить точку относительно одного центра?'), L('Birinchi aks A ni A′ ga, ikkinchisi A′ ni yana A ga olib keladi.', 'Первое преобразование переводит A в A′, второе возвращает A.'), [L('Boshlang‘ich joyiga qaytadi', 'Вернётся на исходное место'), L('Markazda qoladi', 'Останется в центре'), L('Ikki marta uzoqlashadi', 'Удалится вдвое'), L('Aniqlab bo‘lmaydi', 'Нельзя определить')], 0, P(["180°+180°=360°.", '180°+180°=360°.'], ["To'liq burilish nuqtani boshlang'ich joyiga qaytaradi.", 'Полный оборот возвращает точку.']), L('Ikki yarim burilish bir to‘liq burilish.', 'Два полуоборота дают полный оборот.'), chain('180°+180°', '360°')),
  ],
  summary: P(
    ["Markaziy simmetriyada O nuqta AA′ kesmaning o'rtasi.", 'При центральной симметрии O — середина AA′.'],
    ["Bu akslantirish 180° burilishga teng.", 'Это преобразование равно повороту на 180°.'],
    ["O(0;0) ga nisbatan (x;y) → (−x;−y).", 'Относительно O(0;0): (x;y) → (−x;−y).'],
  ),
});

const D42 = makeLesson({
  id: 42,
  title: L('Uchburchak: elementlari, turlari va perimetri', 'Треугольник: элементы, виды и периметр'),
  subtitle: L("Uchlar, tomonlar va burchaklarni nomlab, uchburchaklarni tomonlari hamda burchaklari bo'yicha ajratamiz.", 'Назовём вершины, стороны и углы, классифицируем треугольники по сторонам и углам.'),
  decorations: ['△ABC', 'P=a+b+c', '60°', 'a=b'],
  visual: { type: 'triangle', label: L('ABC uchburchak', 'Треугольник ABC'), base: 'c' },
  hook: Q(L('Perimetrni toping', 'Найдите периметр'), L('Tomonlari 5 cm, 6 cm va 7 cm bo‘lgan uchburchak perimetri qancha?', 'Чему равен периметр треугольника со сторонами 5, 6 и 7 см?'), L('Perimetr barcha tomonlar yig‘indisi.', 'Периметр — сумма всех сторон.'), ['13 cm', '18 cm', '30 cm', '210 cm'], 1, P(["P=5+6+7.", 'P=5+6+7.'], ["P=18 cm.", 'P=18 см.']), L('Uchta tomon uzunligini qo‘shing.', 'Сложите длины трёх сторон.'), eq('P=5+6+7')),
  concepts: [
    C(L('Uchburchak elementlari', 'Элементы треугольника'), P(["ABC uchburchagida A, B, C — uchlar.", 'В треугольнике ABC точки A, B, C — вершины.'], ["AB, BC, CA — tomonlar; ∠A, ∠B, ∠C — burchaklar.", 'AB, BC, CA — стороны; ∠A, ∠B, ∠C — углы.']), { type: 'triangle', label: '△ABC', base: 'AB' }),
    C(L('Burchaklar yig‘indisi', 'Сумма углов'), P(["Har qanday uchburchakning ichki burchaklari yig'indisi 180°.", 'Сумма внутренних углов любого треугольника равна 180°.'], ["Noma'lum burchak 180° dan qolgan ikki burchakni ayirish bilan topiladi.", 'Неизвестный угол находят, вычитая два известных из 180°.']), chain('∠A+∠B+∠C', '180°'), true),
    C(L('Tomonlari bo‘yicha turlar', 'Виды по сторонам'), P(["Uch tomoni teng — teng tomonli; ikki tomoni teng — teng yonli.", 'Три равные стороны — равносторонний; две — равнобедренный.'], ["Barcha tomonlari har xil — turli tomonli.", 'Все стороны разные — разносторонний.']), cards(L('teng tomonli', 'равносторонний'), L('teng yonli', 'равнобедренный'), L('turli tomonli', 'разносторонний')), true),
    C(L('Burchaklari bo‘yicha turlar', 'Виды по углам'), P(["Barcha burchaklari 90° dan kichik — o'tkir burchakli.", 'Все углы меньше 90° — остроугольный.'], ["Bitta burchagi 90° — to'g'ri burchakli; 90° dan katta — o'tmas burchakli.", 'Один угол 90° — прямоугольный; больше 90° — тупоугольный.']), panels({ title: L('90°', '90°'), lines: [L('to‘g‘ri burchakli', 'прямоугольный')], color: 'blue' }, { title: L('>90°', '>90°'), lines: [L('o‘tmas burchakli', 'тупоугольный')], color: 'yellow' })),
    C(L('Teng yonli uchburchak xossasi', 'Свойство равнобедренного треугольника'), P(["Teng tomonlar qarshisidagi asos burchaklari teng.", 'Углы при основании равнобедренного треугольника равны.'], ["Agar uchidagi burchak 40° bo'lsa, qolgan 140° ikki teng qismga bo'linib, 70° dan chiqadi.", 'Если угол при вершине 40°, оставшиеся 140° делятся поровну: по 70°.']), chain('180°−40°', '140°:2', '70°')),
    C(L('Teng tomonli uchburchak', 'Равносторонний треугольник'), P(["Uchala tomoni teng bo'lgani uchun uchala burchagi ham teng.", 'Так как все стороны равны, все углы тоже равны.'], ["180°:3=60°, demak har burchagi 60°.", '180°:3=60°, значит каждый угол 60°.']), cards('a=b=c', '60°;60°;60°')),
    C(L('Perimetr formulasi', 'Формула периметра'), P(["Umumiy holda P=a+b+c.", 'В общем случае P=a+b+c.'], ["Teng tomonli uchburchakda P=3a.", 'Для равностороннего треугольника P=3a.']), cards('P=a+b+c', 'P=3a'), true),
    C(L('Uchburchak tengsizligi', 'Неравенство треугольника'), P(["Istalgan ikki tomon yig'indisi uchinchi tomondan katta bo'lishi kerak.", 'Сумма любых двух сторон должна быть больше третьей.'], ["2, 3, 6 kesmalardan uchburchak yasab bo'lmaydi, chunki 2+3<6.", 'Из 2, 3, 6 треугольник не построить, так как 2+3<6.']), panels({ title: L('Mumkin', 'Можно'), lines: ['4+5>7'], color: 'green' }, { title: L('Mumkin emas', 'Нельзя'), lines: ['2+3<6'], color: 'yellow' }), true),
  ],
  tasks: [
    Q(L('Noma‘lum burchak', 'Неизвестный угол'), L('Burchaklari 50° va 60°. Uchinchi burchakni toping.', 'Два угла равны 50° и 60°. Найдите третий.'), L('180° dan ikkalasini ayiring.', 'Вычтите оба угла из 180°.'), ['60°', '70°', '80°', '110°'], 1, P(["50°+60°=110°.", '50°+60°=110°.'], ["180°−110°=70°.", '180°−110°=70°.']), L('Burchaklar yig‘indisi 180°.', 'Сумма углов 180°.'), eq('180°−50°−60°')),
    Q(L('Tomon bo‘yicha tur', 'Вид по сторонам'), L('Tomonlari 8 cm, 8 cm va 5 cm. Bu qaysi uchburchak?', 'Стороны 8, 8 и 5 см. Какой это треугольник?'), L('Ikki tomon teng.', 'Две стороны равны.'), [L('Teng tomonli', 'Равносторонний'), L('Teng yonli', 'Равнобедренный'), L('Turli tomonli', 'Разносторонний'), L('To‘g‘ri burchakli', 'Прямоугольный')], 1, P(["8 cm va 8 cm teng.", 'Стороны 8 см и 8 см равны.'], ["Ikki teng tomoni bor uchburchak teng yonli.", 'Треугольник с двумя равными сторонами — равнобедренный.']), L('Tomonlar soni va tengligini tekshiring.', 'Проверьте равенство сторон.'), { type: 'triangle', label: L('Teng yonli', 'Равнобедренный'), base: '5' }),
    MATCH(L('Turlarni moslashtiring', 'Сопоставьте виды'), L('Har bir tavsifga uchburchak turini toping.', 'Подберите вид к описанию.'), L('Tomon va burchak belgilari aralashmasin.', 'Не смешивайте признаки сторон и углов.'), [{ left: L('Uch tomoni teng', 'Три равные стороны'), correct: L('Teng tomonli', 'Равносторонний') }, { left: L('Bitta burchagi 90°', 'Один угол 90°'), correct: L('To‘g‘ri burchakli', 'Прямоугольный') }, { left: L('Bitta burchagi 110°', 'Один угол 110°'), correct: L('O‘tmas burchakli', 'Тупоугольный') }], P(["Teng tomonli uchburchak tomonlariga ko'ra, qolgan ikki tur esa burchaklariga ko'ra aniqlanadi.", 'Равносторонний определяется сторонами, два других — углами.'], ["110° 90° dan katta.", '110° больше 90°.']), L('90 daraja chegarasini eslang.', 'Помните границу 90 градусов.')),
    Q(L('Teng yonli burchaklar', 'Углы равнобедренного треугольника'), L('Uchidagi burchagi 36° bo‘lgan teng yonli uchburchakning asos burchagi necha daraja?', 'Угол при вершине равнобедренного треугольника 36°. Найдите угол при основании.'), L('Qolgan burchaklar teng.', 'Оставшиеся углы равны.'), ['36°', '54°', '72°', '144°'], 2, P(["180°−36°=144°.", '180°−36°=144°.'], ["144°:2=72°.", '144°:2=72°.']), L('Qolgan yig‘indini ikkiga bo‘ling.', 'Разделите остаток на два.'), chain('180−36=144', '144:2=72')),
    Q(L('Teng tomonli perimetr', 'Периметр равностороннего'), L('Tomoni 9 cm bo‘lgan teng tomonli uchburchak perimetrini toping.', 'Найдите периметр равностороннего треугольника со стороной 9 см.'), L('P=3a.', 'P=3a.'), ['12 cm', '18 cm', '27 cm', '81 cm'], 2, P(["P=3·9.", 'P=3·9.'], ["P=27 cm.", 'P=27 см.']), L('Uchta teng tomon bor.', 'Есть три равные стороны.'), eq('P=3·9')),
    M(L('Uchburchak yasash mumkin', 'Можно построить треугольник'), L('Uchburchak tengsizligini qanoatlantiradigan tomonlar to‘plamini tanlang.', 'Выберите наборы, удовлетворяющие неравенству треугольника.'), ['3;4;5', '2;3;6', '5;5;8', '1;2;4'], [0, 2], P(["3+4>5 va 5+5>8.", '3+4>5 и 5+5>8.'], ["2+3<6 hamda 1+2<4 bo'lgani uchun qolganlari mumkin emas.", '2+3<6 и 1+2<4, поэтому остальные невозможны.']), L('Eng katta tomonni qolgan ikkitasi yig‘indisi bilan solishtiring.', 'Сравните наибольшую сторону с суммой двух других.')),
  ],
  summary: P(
    ["Uchburchakning 3 uchi, 3 tomoni va 3 burchagi bor; burchaklar yig'indisi 180°.", 'У треугольника 3 вершины, стороны и угла; сумма углов 180°.'],
    ["Uchburchaklar tomonlari va burchaklari bo'yicha tasniflanadi.", 'Треугольники классифицируют по сторонам и углам.'],
    ["P=a+b+c; istalgan ikki tomon yig'indisi uchinchi tomondan katta.", 'P=a+b+c; сумма любых двух сторон больше третьей.'],
  ),
});

const D43 = makeLesson({
  id: 43,
  title: L('Uchburchak va murakkab shakllar yuzi', 'Площадь треугольника и сложных фигур'),
  subtitle: L("Asos va balandlik orqali uchburchak yuzini topib, katakli hamda murakkab shakllarni qismlarga ajratamiz.", 'Найдём площадь треугольника по основанию и высоте, разберём клетчатые и сложные фигуры.'),
  decorations: ['S=ah/2', 'a', 'h', 'cm²'],
  visual: { type: 'triangle', label: L('Asos va balandlik', 'Основание и высота'), base: 'a', height: 'h' },
  hook: Q(L("To'g'ri to'rtburchakning yarmi", 'Половина прямоугольника'), L('Asosi 8 cm, balandligi 5 cm bo‘lgan uchburchak yuzi qancha?', 'Площадь треугольника с основанием 8 см и высотой 5 см?'), L('U shu asos va balandlikli to‘g‘ri to‘rtburchak yuzining yarmi.', 'Это половина площади прямоугольника с теми же основанием и высотой.'), ['13 cm²', '20 cm²', '40 cm²', '80 cm²'], 1, P(["8·5=40.", '8·5=40.'], ["40:2=20 cm².", '40:2=20 см².']), L('S=a·h:2.', 'S=a·h:2.'), eq('S=8·5:2')),
  concepts: [
    C(L('Balandlik nima?', 'Что такое высота?'), P(["Balandlik — uchburchak uchidan qarshi tomon yotgan to'g'ri chiziqqa tushirilgan perpendikulyar.", 'Высота — перпендикуляр из вершины к прямой противоположной стороны.'], ["U asos bilan 90° burchak hosil qiladi.", 'Она образует с основанием угол 90°.']), { type: 'triangle', label: L('h ⟂ a', 'h ⟂ a'), base: 'a', height: 'h' }, true),
    C(L('Uchburchak yuzi formulasi', 'Формула площади треугольника'), P(["S=a·h/2, bu yerda a — asos, h — shu asosga tushirilgan balandlik.", 'S=a·h/2, где a — основание, h — высота к нему.'], ["Asos va balandlik bir xil uzunlik birligida bo'lishi kerak.", 'Основание и высота должны быть в одинаковых единицах.']), eq('S=a·h/2'), true),
    C(L('Nega ikkiga bo‘lamiz?', 'Почему делим на два?'), P(["Ikki bir xil uchburchakdan parallelogramm yoki to'g'ri to'rtburchak tuzish mumkin.", 'Из двух одинаковых треугольников можно составить параллелограмм или прямоугольник.'], ["Shuning uchun bitta uchburchak yuzi a·h ning yarmi.", 'Поэтому площадь одного треугольника равна половине a·h.']), chain('2S=a·h', 'S=a·h/2')),
    C(L('To‘g‘ri burchakli uchburchak', 'Прямоугольный треугольник'), P(["Katetlar o'zaro perpendikulyar, biri asos, ikkinchisi balandlik bo'la oladi.", 'Катеты перпендикулярны: один может быть основанием, другой высотой.'], ["Katetlar 6 va 4 bo'lsa, S=6·4:2=12.", 'При катетах 6 и 4: S=6·4:2=12.']), chain('6·4:2', '12')),
    C(L('Noma‘lum balandlik', 'Неизвестная высота'), P(["S va a ma'lum bo'lsa, h=2S:a.", 'Если известны S и a, то h=2S:a.'], ["S=30 cm², a=10 cm bo'lsa, h=60:10=6 cm.", 'При S=30 см², a=10 см: h=60:10=6 см.']), chain('h=2S:a', '60:10', '6 cm')),
    C(L('Katakli shakl yuzi', 'Площадь по клеткам'), P(["To'liq kataklarni sanang, yarim kataklarni juftlab bir butun qiling.", 'Сосчитайте целые клетки, половинки объедините попарно.'], ["Bir katak tomoni 1 cm bo'lsa, bir katak yuzi 1 cm².", 'Если сторона клетки 1 см, площадь клетки 1 см².']), cards(L('6 to‘liq', '6 целых'), L('4 yarim=2 to‘liq', '4 половины=2 целых'), 'S=8')),
    C(L('Murakkab shaklni bo‘lish', 'Разбиение сложной фигуры'), P(["Shaklni to'g'ri to'rtburchak va uchburchak kabi sodda qismlarga ajrating.", 'Разбейте фигуру на прямоугольники и треугольники.'], ["Qismlar kesishmasa, ularning yuzalarini qo'shing.", 'Если части не перекрываются, сложите их площади.']), { type: 'steps', items: [L('Ajratish', 'Разбить'), L('Har bir yuzani topish', 'Найти площади'), L('Qo‘shish', 'Сложить')] }, true),
    C(L('Ortiqcha qismni ayirish', 'Вычитание лишней части'), P(["Ba'zan katta to'rtburchak yuzidan kesib olingan kichik qismni ayirish qulay.", 'Иногда удобно вычесть вырезанную часть из большого прямоугольника.'], ["L-shakl yuzi = katta to'rtburchak yuzi − kesilgan qism yuzi.", 'Г-образная фигура: Sбольшая−Sмалая.']), chain('S=L katta', '− kesilgan qism', 'L shakl')),
    C(L('Birlik va taxmin', 'Единицы и оценка'), P(["Yuza javobi cm², m² kabi kvadrat birlikda yoziladi.", 'Ответ площади записывают в см², м² и других квадратных единицах.'], ["Natija shakl joylashgan katta to'rtburchak yuzidan oshmasligi kerak.", 'Результат не должен превышать площадь охватывающего прямоугольника.']), panels({ title: L('Birlik', 'Единица'), lines: ['cm²'], color: 'green' }, { title: L('Tekshiruv', 'Проверка'), lines: [L('S murakkab < S katta', 'S сложной < S большой')], color: 'yellow' })),
  ],
  tasks: [
    Q(L('Uchburchak yuzi', 'Площадь треугольника'), L('a=12 cm, h=7 cm. S ni toping.', 'a=12 см, h=7 см. Найдите S.'), L('S=a·h:2.', 'S=a·h:2.'), ['19 cm²', '42 cm²', '84 cm²', '168 cm²'], 1, P(["12·7=84.", '12·7=84.'], ["84:2=42 cm².", '84:2=42 см².']), L('Ko‘paytmani ikkiga bo‘ling.', 'Разделите произведение на два.'), eq('12·7:2')),
    Q(L('Balandlikni toping', 'Найдите высоту'), L('S=48 cm², a=12 cm. h ni toping.', 'S=48 см², a=12 см. Найдите h.'), L('h=2S:a.', 'h=2S:a.'), ['4 cm', '6 cm', '8 cm', '24 cm'], 2, P(["2S=96.", '2S=96.'], ["h=96:12=8 cm.", 'h=96:12=8 см.']), L('Yuzani ikki marta olib, asosga bo‘ling.', 'Удвойте площадь и разделите на основание.'), chain('2·48:12', '8')),
    MATCH(L('Shakl va formula', 'Фигура и формула'), L('Har bir shaklga yuza formulasini moslashtiring.', 'Сопоставьте фигуру и формулу.'), L('Balandlik va tomon belgilariga qarang.', 'Смотрите на обозначения сторон и высоты.'), [{ left: L('Uchburchak', 'Треугольник'), correct: 'S=ah/2' }, { left: L('To‘g‘ri to‘rtburchak', 'Прямоугольник'), correct: 'S=ab' }, { left: L('Doira', 'Круг'), correct: 'S=πr²' }], P(["Uchburchak yuzi ah/2, to'g'ri to'rtburchak yuzi ab, doira yuzi esa πr² formula bilan topiladi.", 'Треугольник — половина, прямоугольник — произведение, круг — πr².'], ["Formulalar shakl xossalaridan kelib chiqadi.", 'Формулы следуют из свойств фигур.']), L('Shakl nomini formula harflari bilan bog‘lang.', 'Свяжите название фигуры с формулой.')),
    Q(L('Qo‘shma shakl', 'Составная фигура'), L('6×4 to‘rtburchakka yuzi 9 cm² uchburchak qo‘shildi. Jami yuza?', 'К прямоугольнику 6×4 добавили треугольник площадью 9 см². Общая площадь?'), L('Qismlar kesishmasa, yuzalar qo‘shiladi.', 'Если части не перекрываются, площади складываются.'), ['24 cm²', '30 cm²', '33 cm²', '54 cm²'], 2, P(["To'g'ri to'rtburchak yuzi 6·4=24.", 'Площадь прямоугольника 6·4=24.'], ["24+9=33 cm².", '24+9=33 см².']), L('Ikki sodda qism yuzini qo‘shing.', 'Сложите площади двух частей.'), chain('24+9', '33')),
    Q(L('Kesib olingan qism', 'Вырезанная часть'), L('10×8 to‘rtburchakdan 3×4 qism kesildi. Qolgan yuza?', 'Из прямоугольника 10×8 вырезали часть 3×4. Оставшаяся площадь?'), L("Katta to'rtburchak yuzidan kesilgan qism yuzini ayiring.", 'Вычтите площадь выреза.'), ['12', '56', '68', '92'], 2, P(["10·8=80.", '10·8=80.'], ["3·4=12; 80−12=68.", '3·4=12; 80−12=68.']), L('Ikkala to‘rtburchak yuzini hisoblang.', 'Вычислите площади обоих прямоугольников.'), chain('80−12', '68')),
  ],
  summary: P(
    ["Uchburchak yuzi S=a·h/2.", 'Площадь треугольника S=a·h/2.'],
    ["Balandlik asosga perpendikulyar bo'lishi kerak.", 'Высота должна быть перпендикулярна основанию.'],
    ["Murakkab shakl yuzasi qismlarni qo'shish yoki ortiqcha qismini ayirish bilan topiladi.", 'Площадь сложной фигуры находят сложением частей или вычитанием лишнего.'],
  ),
});

const D44 = makeLesson({
  id: 44,
  title: L('Fazoviy shakllar hajmi va o‘lchov birliklari', 'Объём пространственных фигур и единицы'),
  subtitle: L("Kub va to'g'ri burchakli parallelepiped hajmini hisoblab, kub birliklarni aylantiramiz.", 'Вычислим объём куба и прямоугольного параллелепипеда, переведём кубические единицы.'),
  decorations: ['V=abh', 'V=a³', 'cm³', '1 l=1 dm³'],
  visual: { type: 'cube', label: 'V=a·b·h' },
  hook: Q(L('Qutining hajmi', 'Объём коробки'), L('Uzunligi 5 cm, eni 3 cm, balandligi 4 cm qutining hajmi?', 'Каков объём коробки 5 см × 3 см × 4 см?'), L('Uch o‘lchamni ko‘paytiring.', 'Перемножьте три измерения.'), ['12 cm³', '20 cm³', '47 cm³', '60 cm³'], 3, P(["V=5·3·4.", 'V=5·3·4.'], ["V=60 cm³.", 'V=60 см³.']), L('V=a·b·h.', 'V=a·b·h.'), eq('V=5·3·4')),
  concepts: [
    C(L('Hajm nima?', 'Что такое объём?'), P(["Hajm jism fazoda qancha joy egallashini bildiradi.", 'Объём показывает, сколько места тело занимает в пространстве.'], ["U uch o'lchamga bog'liq: uzunlik, en va balandlik.", 'Он зависит от трёх измерений: длины, ширины и высоты.']), { type: 'cube', label: L('uzunlik × en × balandlik', 'длина × ширина × высота') }),
    C(L('Parallelepiped formulasi', 'Формула параллелепипеда'), P(["To'g'ri burchakli parallelepiped hajmi V=a·b·h.", 'Объём прямоугольного параллелепипеда V=a·b·h.'], ["Barcha o'lchamlar bir xil birlikda bo'lishi kerak.", 'Все измерения должны быть в одинаковых единицах.']), eq('V=a·b·h'), true),
    C(L('Kub hajmi', 'Объём куба'), P(["Kubning barcha qirralari a ga teng.", 'Все рёбра куба равны a.'], ["V=a·a·a=a³.", 'V=a·a·a=a³.']), { type: 'cube', label: 'V=a³' }, true),
    C(L('Kub birliklar', 'Кубические единицы'), P(["Hajm mm³, cm³, dm³, m³ kabi kub birliklarda yoziladi.", 'Объём записывают в мм³, см³, дм³, м³.'], ["cm³ — qirrasi 1 cm bo'lgan kub hajmi.", 'см³ — объём куба с ребром 1 см.']), cards('1 cm³', '1 dm³', '1 m³')),
    C(L('Birliklarni aylantirish', 'Перевод единиц'), P(["1 dm=10 cm bo'lsa, 1 dm³=10³ cm³=1000 cm³.", 'Если 1 дм=10 см, то 1 дм³=10³ см³=1000 см³.'], ["1 m³=1000 dm³.", '1 м³=1000 дм³.']), chain('1 dm³', '1000 cm³'), true),
    C(L('Litr bilan bog‘lanish', 'Связь с литрами'), P(["1 litr=1 dm³.", '1 литр=1 дм³.'], ["1 millilitr=1 cm³; demak 1000 ml=1 l.", '1 миллилитр=1 см³; значит 1000 мл=1 л.']), cards('1 l=1 dm³', '1 ml=1 cm³'), true),
    C(L('Noma‘lum o‘lcham', 'Неизвестное измерение'), P(["V, a va b ma'lum bo'lsa, h=V:(a·b).", 'Если известны V, a и b, то h=V:(a·b).'], ["V=120, a=6, b=5 bo'lsa, h=120:30=4.", 'Если V=120, a=6, b=5, то h=120:30=4.']), chain('h=V:(ab)', '120:30', '4')),
    C(L('Idish sig‘imi', 'Вместимость сосуда'), P(["Idishning ichki hajmi uning qancha suyuqlik sig'dirishini ko'rsatadi.", 'Внутренний объём сосуда показывает его вместимость.'], ["O'lchamlar dm da bo'lsa, natija dm³ va son jihatdan litrga teng.", 'Если размеры в дм, результат в дм³ численно равен литрам.']), chain('2 dm·3 dm·4 dm', '24 dm³', '24 l')),
    C(L('Yuza va hajmni farqlang', 'Различайте площадь и объём'), P(["Yuza ikki o'lchamdan va kvadrat birlikdan foydalanadi.", 'Площадь использует два измерения и квадратные единицы.'], ["Hajm uch o'lchamdan va kub birlikdan foydalanadi.", 'Объём использует три измерения и кубические единицы.']), panels({ title: L('Yuza', 'Площадь'), lines: ['a·b, cm²'], color: 'yellow' }, { title: L('Hajm', 'Объём'), lines: ['a·b·h, cm³'], color: 'blue' })),
  ],
  tasks: [
    Q(L('Kub hajmi', 'Объём куба'), L('Qirrasi 4 cm bo‘lgan kub hajmini toping.', 'Найдите объём куба с ребром 4 см.'), L('V=a³.', 'V=a³.'), ['12 cm³', '16 cm³', '48 cm³', '64 cm³'], 3, P(["V=4³=4·4·4.", 'V=4³=4·4·4.'], ["V=64 cm³.", 'V=64 см³.']), L('Uchta 4 ni ko‘paytiring.', 'Перемножьте три четвёрки.'), eq('4³=64')),
    Q(L('Balandlikni toping', 'Найдите высоту'), L('V=180 cm³, a=9 cm, b=5 cm. h ni toping.', 'V=180 см³, a=9 см, b=5 см. Найдите h.'), L('h=V:(a·b).', 'h=V:(a·b).'), ['2 cm', '4 cm', '20 cm', '45 cm'], 1, P(["a·b=9·5=45.", 'a·b=9·5=45.'], ["h=180:45=4 cm.", 'h=180:45=4 см.']), L('Hajmni asos yuziga bo‘ling.', 'Разделите объём на площадь основания.'), chain('180:(9·5)', '4')),
    MATCH(L('Birliklarni moslashtiring', 'Сопоставьте единицы'), L('Teng hajmlarni bog‘lang.', 'Соедините равные объёмы.'), L('Litr, millilitr va kub birliklar bog‘lanishini eslang.', 'Вспомните связь литров и кубических единиц.'), [{ left: '1 l', correct: '1 dm³' }, { left: '1 ml', correct: '1 cm³' }, { left: '1 m³', correct: '1000 dm³' }], P(["1 l=1 dm³, 1 ml=1 cm³, 1 m³=1000 dm³.", '1 л=1 дм³, 1 мл=1 см³, 1 м³=1000 дм³.'], ["Har bir uzunlik o'n marta o'zgarsa, hajm ming marta o'zgaradi.", 'При увеличении длины в 10 раз объём меняется в 1000 раз.']), L('Kub birlikda uchta o‘lcham bor.', 'В кубической единице три измерения.')),
    Q(L('Hajmni aylantiring', 'Переведите объём'), L('3 dm³ necha cm³?', 'Сколько см³ в 3 дм³?'), L('1 dm³=1000 cm³.', '1 дм³=1000 см³.'), ['30 cm³', '300 cm³', '3000 cm³', '30 000 cm³'], 2, P(["3·1000=3000.", '3·1000=3000.'], ["3 dm³=3000 cm³.", '3 дм³=3000 см³.']), L('3 ni 1000 ga ko‘paytiring.', 'Умножьте 3 на 1000.'), eq('3·1000=3000')),
    Q(L('Akvarium sig‘imi', 'Вместимость аквариума'), L('Ichki o‘lchamlari 5 dm × 3 dm × 4 dm. Necha litr sig‘adi?', 'Внутренние размеры 5 дм × 3 дм × 4 дм. Сколько литров вмещает?'), L('Hajm dm³ da chiqadi va litrga teng.', 'Объём получится в дм³ и равен литрам.'), ['12 l', '20 l', '60 l', '600 l'], 2, P(["V=5·3·4=60 dm³.", 'V=5·3·4=60 дм³.'], ["60 dm³=60 litr.", '60 дм³=60 литров.']), L('Uch o‘lchamni ko‘paytiring.', 'Перемножьте три измерения.'), chain('5·3·4', '60 dm³', '60 l')),
  ],
  summary: P(
    ["Parallelepiped hajmi V=a·b·h, kub hajmi V=a³.", 'Объём параллелепипеда V=a·b·h, куба V=a³.'],
    ["Hajm kub birliklarda yoziladi; 1 dm³=1000 cm³.", 'Объём записывают в кубических единицах; 1 дм³=1000 см³.'],
    ["1 litr=1 dm³ va 1 millilitr=1 cm³.", '1 литр=1 дм³ и 1 миллилитр=1 см³.'],
  ),
});

const D45 = makeLesson({
  id: 45,
  title: L('Ma’lumotlar bilan ishlash', 'Работа с данными'),
  subtitle: L("Jadval va ma'lumotlar qatorini o'qib, moda, mediana, o'rtacha qiymat va o'zgarish kengligini topamiz.", 'Прочитаем таблицы и ряды данных, найдём моду, медиану, среднее и размах.'),
  decorations: ['x̄', 'moda', 'mediana', 'max−min'],
  visual: {
    type: 'dataTable',
    caption: L('Haftalik ob-havo kuzatuvi', 'Наблюдение за погодой за неделю'),
    columns: [L('Kun', 'День'), L('Harorat', 'Температура'), L('Holat', 'Погода')],
    rows: [
      [L('Dushanba', 'Понедельник'), '12°C', L('Bulutli', 'Облачно')],
      [L('Seshanba', 'Вторник'), '15°C', L('Quyoshli', 'Солнечно')],
      [L('Chorshanba', 'Среда'), '13°C', L('Yomg‘irli', 'Дождливо')],
    ],
  },
  hook: Q(L('Eng ko‘p uchragan qiymat', 'Самое частое значение'), L('2, 3, 3, 5, 7 qatorida qaysi son eng ko‘p uchraydi?', 'Какое число чаще всего встречается в ряду 2, 3, 3, 5, 7?'), L('Takrorlanish sonini sanang.', 'Посчитайте частоты.'), ['2', '3', '5', '7'], 1, P(["3 soni ikki marta uchraydi.", 'Число 3 встречается дважды.'], ["Qolganlari bir martadan, demak moda 3.", 'Остальные по одному разу, значит мода 3.']), L('Eng katta sonni emas, eng ko‘p uchragan sonni toping.', 'Найдите не наибольшее, а самое частое число.'), cards('2', '3', '3', '5', '7')),
  concepts: [
    C(L('Ma’lumotlar qatori qanday hosil bo‘ladi?', 'Как образуется ряд данных?'), P(["Anvar bir hafta davomida matematikadan olgan baholarini daftariga ketma-ket yozdi: 5, 4, 4, 3, 4, 5.", 'Анвар записал в тетрадь оценки по математике за неделю: 5, 4, 4, 3, 4, 5.'], ["Bu sonlar Anvarning matematikadan olgan baholari haqidagi ma'lumotlardan iborat. Shuning uchun 5, 4, 4, 3, 4, 5 qatori ma'lumotlar qatori deyiladi.", 'Эти числа содержат данные об оценках Анвара по математике. Поэтому ряд 5, 4, 4, 3, 4, 5 называют рядом данных.']), {
      type: 'dataTable',
      caption: L('Anvarning matematika baholari', 'Оценки Анвара по математике'),
      columns: [L('Dushanba', 'Понедельник'), L('Seshanba', 'Вторник'), L('Chorshanba', 'Среда'), L('Payshanba', 'Четверг'), L('Juma', 'Пятница'), L('Shanba', 'Суббота')],
      rows: [['5', '4', '4', '3', '4', '5']],
    }),
    C(L('Kundalik odatlardan ham ma’lumot olinadi', 'Данные можно получить из ежедневных привычек'), P(["Anvar har kuni necha soat dars qilgani va telefondan necha soat foydalanganini bir hafta davomida yozib bordi.", 'Анвар в течение недели записывал, сколько часов в день он учился и пользовался телефоном.'], ["Dars vaqti 2, 2, 3, 2, 3, 1, 2 — bitta ma'lumotlar qatori. Telefon vaqti 1, 2, 1, 2, 1, 3, 2 esa ikkinchi ma'lumotlar qatoridir.", 'Время учёбы 2, 2, 3, 2, 3, 1, 2 — один ряд данных. Время использования телефона 1, 2, 1, 2, 1, 3, 2 — второй ряд данных.']), {
      type: 'dataTable',
      caption: L('Anvarning bir haftalik vaqti, soatlarda', 'Время Анвара за неделю, в часах'),
      columns: [L('Faoliyat', 'Занятие'), L('Du', 'Пн'), L('Se', 'Вт'), L('Ch', 'Ср'), L('Pa', 'Чт'), L('Ju', 'Пт'), L('Sh', 'Сб'), L('Ya', 'Вс')],
      rows: [
        [L('Dars qilish', 'Учёба'), '2', '2', '3', '2', '3', '1', '2'],
        [L('Telefon', 'Телефон'), '1', '2', '1', '2', '1', '3', '2'],
      ],
    }),
    C(L('Jadvalni o‘qish', 'Чтение таблицы'), P(["Jadval sarlavhasi nima o'lchanganini, qatorlar o'quvchilarni, ustunlar esa fanlarni bildiradi.", 'Заголовок показывает, что измеряли, строки обозначают учеников, а столбцы — предметы.'], ["Madina ikkala fandan ham 9 ball olganini qator va ustun kesishgan kataklardan ko'ramiz.", 'По ячейкам на пересечении строки и столбца видим, что Мадина получила 9 баллов по обоим предметам.']), {
      type: 'dataTable',
      caption: L('O‘quvchilar natijalari', 'Результаты учеников'),
      columns: [L('O‘quvchi', 'Ученик'), L('Matematika', 'Математика'), L('Ona tili', 'Родной язык')],
      rows: [
        [L('Ali', 'Али'), '8', '7'],
        [L('Madina', 'Мадина'), '9', '9'],
        [L('Jasur', 'Жасур'), '7', '8'],
      ],
      highlightRow: 1,
    }),
    C(L('Moda', 'Мода'), P(["Rangli shakllarda ko'k rang eng ko'p uchragani kabi, sonlar qatorida eng ko'p takrorlangan qiymat moda bo'ladi.", 'Как синий цвет чаще всего встречался среди фигур, так и самое частое значение числового ряда называют модой.'], ["2, 4, 4, 6 qatorida 4 soni ikki marta uchraydi, shuning uchun moda 4.", 'В ряду 2, 4, 4, 6 число 4 встречается дважды, поэтому мода равна 4.']), {
      type: 'dataTable',
      caption: L('Sonlarning takrorlanishi', 'Частота чисел'),
      columns: [L('Son', 'Число'), L('Necha marta?', 'Сколько раз?')],
      rows: [['2', '1'], ['4', '2'], ['6', '1']],
      highlightRow: 1,
    }, true),
    C(L('Mediana', 'Медиана'), P(["Tartiblangan qatorning o'rtasidagi qiymat mediana.", 'Медиана — среднее по положению значение упорядоченного ряда.'], ["Qiymatlar soni juft bo'lsa, o'rtadagi ikki sonning o'rtacha qiymati olinadi.", 'При чётном числе значений берут среднее двух центральных.']), panels({ title: L('Toq sonli qator', 'Нечётный ряд'), lines: ['2;4;7 → 4'], color: 'green' }, { title: L('Juft sonli qator', 'Чётный ряд'), lines: ['2;4;6;8 → 5'], color: 'yellow' }), true),
    C(L('O‘rtacha arifmetik', 'Среднее арифметическое'), P(["Barcha qiymatlar yig'indisini ularning soniga bo'lamiz.", 'Сумму всех значений делим на их количество.'], ["x̄=(x₁+x₂+...+xₙ):n.", 'x̄=(x₁+x₂+...+xₙ):n.']), chain('4+6+8=18', '18:3', '6'), true),
    C(L('O‘zgarish kengligi', 'Размах'), P(["Eng katta qiymatdan eng kichik qiymatni ayirish o'zgarish kengligini beradi.", 'Размах равен разности максимального и минимального значений.'], ["R=max−min.", 'R=max−min.']), chain('2;5;9;11', '11−2', '9')),
    C(L('Ustunli diagramma', 'Столбчатая диаграмма'), P(["Ustun balandligi qiymat yoki takrorlanish sonini ifodalaydi.", 'Высота столбца показывает значение или частоту.'], ["O'qlar nomi va masshtabini tekshirib o'qing.", 'Читайте названия осей и масштаб.']), { type: 'dataBars', items: [{ label: 'A', value: 3 }, { label: 'B', value: 6 }, { label: 'C', value: 4 }] }),
    C(L('Xulosa chiqarish', 'Вывод по данным'), P(["Faqat bitta ko'rsatkichga qarab qat'iy xulosa qilmang.", 'Не делайте окончательный вывод по одному показателю.'], ["O'rtacha umumiy darajani, mediana markazni, moda esa eng odatiy qiymatni ko'rsatadi.", 'Среднее показывает общий уровень, медиана — центр, мода — типичное значение.']), cards(L('o‘rtacha — daraja', 'среднее — уровень'), L('mediana — markaz', 'медиана — центр'), L('moda — tez-tez', 'мода — частое'))),
  ],
  tasks: [
    Q(L('O‘rtachani toping', 'Найдите среднее'), L('6, 8, 10, 12 sonlarining o‘rtacha qiymati qancha?', 'Найдите среднее чисел 6, 8, 10, 12.'), L('Yig‘indini 4 ga bo‘ling.', 'Разделите сумму на 4.'), ['8', '9', '10', '36'], 1, P(["6+8+10+12=36.", '6+8+10+12=36.'], ["36:4=9.", '36:4=9.']), L('Qiymatlar soni to‘rtta.', 'Значений четыре.'), chain('36:4', '9')),
    Q(L('Medianani toping', 'Найдите медиану'), L('3, 5, 8, 9, 12 qatorining medianasi?', 'Медиана ряда 3, 5, 8, 9, 12?'), L('Tartiblangan beshta qiymatning o‘rtadagisini oling.', 'Возьмите центральное из пяти значений.'), ['5', '7', '8', '9'], 2, P(["O'rtadagi uchinchi qiymat 8.", 'Среднее по положению, третье значение — 8.'], ["Mediana 8.", 'Медиана равна 8.']), L('Qiymatlarni joylashuviga qarang.', 'Смотрите на положение значения.'), cards('3', '5', { label: '8', color: 'green' }, '9', '12')),
    Q(L('Juft qator medianasi', 'Медиана чётного ряда'), L('2, 4, 7, 11 qatorining medianasi?', 'Медиана ряда 2, 4, 7, 11?'), L('O‘rtadagi 4 va 7 ning o‘rtachasini toping.', 'Найдите среднее 4 и 7.'), ['4', '5', '5,5', '7'], 2, P(["(4+7):2=11:2.", '(4+7):2=11:2.'], ["Mediana 5,5.", 'Медиана 5,5.']), L('Juft qatorning ikkita markaziy qiymati bor.', 'У чётного ряда два центральных значения.'), eq('(4+7):2=5,5')),
    MATCH(L('Ko‘rsatkich va qoida', 'Показатель и правило'), L('Har bir statistik ko‘rsatkichni hisoblash usuli bilan bog‘lang.', 'Сопоставьте показатель и способ вычисления.'), L('Takrorlanish, tartib va yig‘indi tushunchalarini ajrating.', 'Различайте частоту, порядок и сумму.'), [{ left: L('Moda', 'Мода'), correct: L('Eng ko‘p takrorlangan qiymat', 'Самое частое значение') }, { left: L('Mediana', 'Медиана'), correct: L('Tartiblangan qator markazi', 'Центр упорядоченного ряда') }, { left: L('O‘rtacha', 'Среднее'), correct: L('Yig‘indi qiymatlar soniga bo‘linadi', 'Сумма делится на число значений') }], P(["Har bir ko'rsatkich ma'lumotning boshqa xususiyatini ko'rsatadi.", 'Каждый показатель описывает своё свойство данных.'], ["Ularni bir-biri bilan almashtirib bo'lmaydi.", 'Их нельзя подменять друг другом.']), L('Kalit so‘zlarni toping.', 'Найдите ключевые слова.')),
    Q(L('O‘zgarish kengligi', 'Размах'), L('Haroratlar −2, 1, 4, 7, 3. O‘zgarish kengligi qancha?', 'Температуры −2, 1, 4, 7, 3. Найдите размах.'), L('Eng katta qiymat 7, eng kichik qiymat −2.', 'Max=7, min=−2.'), ['5', '7', '9', '−9'], 2, P(["R=7−(−2).", 'R=7−(−2).'], ["R=9.", 'R=9.']), L('Manfiy sonni ayirish qo‘shishga aylanadi.', 'Вычитание отрицательного превращается в сложение.'), eq('7−(−2)=9')),
    Q(L('Diagrammani o‘qing', 'Прочитайте диаграмму'), L('A=3, B=6, C=4 bo‘lsa, B va A orasidagi farq qancha?', 'Если A=3, B=6, C=4, какова разность B и A?'), L('Ustun qiymatlarini ayiring.', 'Вычтите значения столбцов.'), ['2', '3', '6', '9'], 1, P(["6−3=3.", '6−3=3.'], ["B ustuni A dan 3 birlik baland.", 'Столбец B выше A на 3 единицы.']), L('B qiymatidan A qiymatini ayiring.', 'Вычтите A из B.'), { type: 'dataBars', items: [{ label: 'A', value: 3 }, { label: 'B', value: 6 }, { label: 'C', value: 4 }] }),
  ],
  summary: P(
    ["Moda — eng ko'p uchraydigan qiymat, mediana esa tartiblangan qatorning markaziy qiymati.", 'Мода — самое частое, медиана — центральное значение упорядоченного ряда.'],
    ["O'rtacha qiymat yig'indini qiymatlar soniga bo'lish bilan topiladi.", 'Среднее находят делением суммы на число значений.'],
    ["O'zgarish kengligi max−min; diagrammada o'q va masshtab tekshiriladi.", 'Размах равен max−min; у диаграммы проверяют оси и масштаб.'],
  ),
});

const D46 = makeLesson({
  id: 46,
  title: L('6-sinf geometriya va ma’lumotlar bo‘limi yakuni', 'Итог раздела геометрии и данных 6 класса'),
  subtitle: L("Aylana, simmetriya, uchburchak, yuza, hajm va ma'lumotlar tahlilini yagona tizimda takrorlaymiz.", 'Свяжем в единую систему окружность, симметрию, треугольник, площадь, объём и анализ данных.'),
  decorations: ['C=2πr', 'S=ah/2', 'V=abh', 'x̄'],
  visual: panels({ title: L('Geometriya', 'Геометрия'), lines: ['C; S; V'], color: 'yellow' }, { title: L('Ma’lumot', 'Данные'), lines: [L('moda; mediana; o‘rtacha', 'мода; медиана; среднее')], color: 'blue' }),
  hook: Q(L('Qaysi formula hajmga tegishli?', 'Какая формула относится к объёму?'), L('Quyidagi formulalardan fazoviy jism hajmini tanlang.', 'Выберите формулу объёма пространственного тела.'), L('Hajm uch o‘lcham ko‘paytmasi bilan bog‘liq.', 'Объём связан с произведением трёх измерений.'), ['C=2πr', 'S=πr²', 'S=ah/2', 'V=abh'], 3, P(["V harfi hajmni bildiradi.", 'Буква V обозначает объём.'], ["a, b, h uchta o'lcham: V=abh.", 'a, b, h — три измерения: V=abh.']), L('Uch o‘lchamli formulani qidiring.', 'Найдите формулу с тремя измерениями.'), cards('C', 'S', 'V')),
  concepts: [
    C(L('Formula xaritasi', 'Карта формул'), P(["Aylana uzunligi C=2πr, doira yuzi S=πr².", 'Длина окружности C=2πr, площадь круга S=πr².'], ["Uchburchak yuzi S=ah/2, parallelepiped hajmi V=abh.", 'Площадь треугольника S=ah/2, объём параллелепипеда V=abh.']), cards('C=2πr', 'S=πr²', 'S=ah/2', 'V=abh'), true),
    C(L('Birlik formula tanlashga yordam beradi', 'Единица помогает выбрать формулу'), P(["cm — uzunlik, cm² — yuza, cm³ — hajm.", 'см — длина, см² — площадь, см³ — объём.'], ["Savol birligini oldindan aniqlash noto'g'ri formula tanlashdan saqlaydi.", 'Предварительный выбор единицы помогает избежать неверной формулы.']), chain('cm', 'cm²', 'cm³')),
    C(L('Simmetriya xaritasi', 'Карта симметрий'), P(["O'q simmetriyasi ko'zgu chizig'iga nisbatan aks.", 'Осевая симметрия — отражение относительно прямой.'], ["Markaziy simmetriya nuqta atrofida 180° burilish.", 'Центральная симметрия — поворот на 180° вокруг точки.']), panels({ title: L("O'q", 'Осевая'), lines: ['(x;y)→(−x;y)'], color: 'blue' }, { title: L('Markaziy', 'Центральная'), lines: ['(x;y)→(−x;−y)'], color: 'yellow' })),
    C(L('Uchburchak xaritasi', 'Карта треугольника'), P(["Burchaklar yig'indisi 180°, perimetr P=a+b+c.", 'Сумма углов 180°, периметр P=a+b+c.'], ["Yuza uchun tomonning o'zi emas, unga perpendikulyar balandlik kerak.", 'Для площади нужна не любая сторона, а высота к основанию.']), { type: 'triangle', label: '△ABC', base: 'a', height: 'h' }),
    C(L('Ma’lumot ko‘rsatkichlari', 'Показатели данных'), P(["Moda — eng ko'p takrorlangan, mediana — tartiblangan qator markazi.", 'Мода — самое частое, медиана — центр упорядоченного ряда.'], ["O'rtacha — yig'indi qiymatlar soniga bo'lingan natija; kenglik max−min.", 'Среднее — сумма, делённая на число значений; размах max−min.']), cards(L('moda', 'мода'), L('mediana', 'медиана'), L('o‘rtacha', 'среднее'), 'max−min')),
    C(L('Masalani yechish algoritmi', 'Алгоритм решения задачи'), P(["Rasm yoki jadvalni o'qing, berilgan va topiladigan kattalikni birlik bilan yozing.", 'Прочитайте рисунок или таблицу, запишите данные и искомое с единицами.'], ["Formula tanlang, sonlarni qo'ying, hisoblang va mazmunan tekshiring.", 'Выберите формулу, подставьте числа, вычислите и проверьте смысл.']), { type: 'steps', items: [L('Tahlil', 'Анализ'), L('Formula', 'Формула'), L('Hisob', 'Вычисление'), L('Tekshirish', 'Проверка')] }, true),
    C(L('Kursdan keyingi ko‘nikma', 'Главный навык курса'), P(["Matematika qoidani yodlashdan tashqari, vaziyatga mos model tanlashdir.", 'Математика — не только запоминание правил, но и выбор модели ситуации.'], ["Chizma, formula, birlik va mantiq bir-birini tekshiradi.", 'Чертёж, формула, единица и логика проверяют друг друга.']), chain(L('Vaziyat', 'Ситуация'), L('Model', 'Модель'), L('Javob', 'Ответ'))),
  ],
  tasks: [
    Q(L('Aylana uzunligi', 'Длина окружности'), L('r=5 cm, π=3,14. C ni toping.', 'r=5 см, π=3,14. Найдите C.'), L('C=2πr.', 'C=2πr.'), ['15,7 cm', '31,4 cm', '78,5 cm', '157 cm'], 1, P(["C=2·3,14·5.", 'C=2·3,14·5.'], ["C=31,4 cm.", 'C=31,4 см.']), L('Bu chegara uzunligi, yuza emas.', 'Это длина границы, не площадь.'), eq('2·3,14·5')),
    Q(L('Doira yuzi', 'Площадь круга'), L('r=4 cm. Yuzani π bilan yozing.', 'r=4 см. Запишите площадь через π.'), L('S=πr².', 'S=πr².'), ['4π cm²', '8π cm²', '16π cm²', '32π cm²'], 2, P(["4²=16.", '4²=16.'], ["S=16π cm².", 'S=16π см².']), L("Radiusni kvadratga ko'taring.", 'Возведите радиус в квадрат.'), eq('S=π·4²')),
    Q(L('Uchburchak yuzi', 'Площадь треугольника'), L('a=10 cm, h=6 cm. S ni toping.', 'a=10 см, h=6 см. Найдите S.'), L('S=ah/2.', 'S=ah/2.'), ['16 cm²', '30 cm²', '60 cm²', '120 cm²'], 1, P(["10·6=60.", '10·6=60.'], ["60:2=30 cm².", '60:2=30 см².']), L('Asos va balandlik ko‘paytmasining yarmini oling.', 'Возьмите половину произведения.'), eq('10·6:2')),
    Q(L('Hajm', 'Объём'), L('4×3×5 cm qutining hajmi?', 'Объём коробки 4×3×5 см?'), L('Uch o‘lchamni ko‘paytiring.', 'Перемножьте три измерения.'), ['12 cm³', '20 cm³', '47 cm³', '60 cm³'], 3, P(["V=4·3·5.", 'V=4·3·5.'], ["V=60 cm³.", 'V=60 см³.']), L('Javob kub birlikda.', 'Ответ в кубических единицах.'), eq('V=4·3·5')),
    Q(L('Simmetrik nuqta', 'Симметричная точка'), L('A(−2;4) ni O(0;0) ga nisbatan akslantiring.', 'Отразите A(−2;4) относительно O(0;0).'), L('Ikkala koordinata ishorasini almashtiring.', 'Измените знаки обеих координат.'), ['(2;−4)', '(−2;−4)', '(2;4)', '(4;−2)'], 0, P(["−2→2 va 4→−4.", '−2→2 и 4→−4.'], ["A′(2;−4).", 'A′(2;−4).']), L('Markaziy simmetriya qoidasi.', 'Правило центральной симметрии.'), { type: 'coordinatePlane', points: [{ x: -2, y: 4, label: 'A' }, { x: 2, y: -4, label: "A′", color: 'blue' }] }),
    Q(L('Ma’lumotlar o‘rtachasi', 'Среднее данных'), L('4, 7, 7, 10 sonlarining o‘rtachasi?', 'Среднее чисел 4, 7, 7, 10?'), L('Yig‘indini 4 ga bo‘ling.', 'Разделите сумму на 4.'), ['7', '7,5', '8', '28'], 0, P(["4+7+7+10=28.", '4+7+7+10=28.'], ["28:4=7.", '28:4=7.']), L("O'rtachani topishda barcha qiymatlar yig'indisini ularning soniga bo'ling.", 'Мода тоже 7, но здесь и среднее равно 7.'), chain('28:4', '7')),
    MATCH(L('Kattalik va birlik', 'Величина и единица'), L('Har bir kattalikni mos birlik bilan bog‘lang.', 'Сопоставьте величину и единицу.'), L('Daraja soniga e’tibor bering.', 'Обратите внимание на степень единицы.'), [{ left: L('Aylana uzunligi', 'Длина окружности'), correct: 'cm' }, { left: L('Doira yuzi', 'Площадь круга'), correct: 'cm²' }, { left: L('Quti hajmi', 'Объём коробки'), correct: 'cm³' }], P(["Uzunlik chiziqli, yuza kvadrat, hajm kub birlikda.", 'Длина в линейных, площадь в квадратных, объём в кубических единицах.'], ["Birlik javob turini ko'rsatadi.", 'Единица показывает вид ответа.']), L('cm, cm² va cm³ ni farqlang.', 'Различайте см, см² и см³.')),
  ],
  summary: P(
    ["Formula tanlashda kattalik turi va o'lchov birligi birinchi tekshiriladi.", 'При выборе формулы сначала проверяют величину и единицу.'],
    ["Geometrik chizma, formula va hisob bir-biriga mos bo'lishi kerak.", 'Чертёж, формула и вычисление должны соответствовать друг другу.'],
    ["Ma'lumotlarni tahlil qilishda moda, mediana, o'rtacha va o'zgarish kengligi turli ma'no beradi.", 'Мода, медиана, среднее и размах описывают данные по-разному.'],
  ),
});

export const GRADE6_THEORY_27_46 = {
  27: D27,
  28: D28,
  29: D29,
  30: D30,
  31: D31,
  32: D32,
  33: D33,
  34: D34,
  35: D35,
  36: D36,
  37: D37,
  38: D38,
  39: D39,
  40: D40,
  41: D41,
  42: D42,
  43: D43,
  44: D44,
  45: D45,
  46: D46,
};
