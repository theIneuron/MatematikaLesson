// Dars 51 amaliyoti — Takrorlash: butun yo'l.
// Nazariya: src/components/grade3/Dars51.jsx (num-3-51).
// Kursning uchta asosiy qoidasi bir darsda: avval ko'paytirish va bo'lish, har xil
// o'lchovlar bittaga keltiriladi, javob esa har doim tekshiriladi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 input · 2 order · 3 dnd · 4 order · 5 match · 6 choice · 7 dnd · 8 multi · 9 input · 10 multi
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS51_BANK = {
  title: 'Dars 51 · Takrorlash: butun yo\'l',
  items: [

    /* 1 · input · 🟢 — amallar tartibi. */
    q('01', 'Avval nima?', '🟢', 'd51-order-of-ops', 'input', '🔢', ['15'],
      {
        e: 'Birinchi qoida', s: "3 + 6 · 2 ifodasi berilgan. Qavs yo'q.",
        a: 'Ifoda nechaga teng?',
        y: "Avval ko'paytirish: 6 · 2 = 12. Keyin qo'shish: 3 + 12 = 15.",
        n: 'Qavs bo\'lmasa, ko\'paytirish qo\'shishdan oldin bajariladi.',
        r: 'Qavs bo\'lmasa, ko\'paytirish va bo\'lish oldin bajariladi.',
        p: 'Javob',
      },
      {
        e: 'Первое правило', s: 'Дано выражение 3 + 6 · 2. Скобок нет.',
        a: 'Чему равно выражение?',
        y: 'Сначала умножение: 6 · 2 = 12. Потом сложение: 3 + 12 = 15.',
        n: 'Без скобок умножение выполняется раньше сложения.',
        r: 'Без скобок умножение и деление выполняются первыми.',
        p: 'Ответ',
      }, 'numeric'),

    /* 2 · order · 🟢 — uch qoidani tartiblash. */
    q('02', 'Amallar zinasi', '🟢', 'd51-ladder', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch pog\'ona', s: "Ifodani hisoblashda amallar aniq tartibda bajariladi.",
        a: 'Amallarni bajarilish tartibida joylang.',
        o: ['Qo\'shish va ayirish', 'Qavsdagi amal', 'Ko\'paytirish va bo\'lish'],
        y: "Avval qavs, keyin ko'paytirish va bo'lish, oxirida qo'shish va ayirish.",
        n: 'Qaysi amal boshqalardan ustun turadi?',
        r: 'Qavs, keyin ko\'paytirish va bo\'lish, oxirida qo\'shish va ayirish.',
      },
      {
        e: 'Три ступени', s: 'При вычислении выражения действия идут в строгом порядке.',
        a: 'Расставь действия в порядке выполнения.',
        o: ['Сложение и вычитание', 'Действие в скобках', 'Умножение и деление'],
        y: 'Сначала скобки, потом умножение и деление, в конце сложение и вычитание.',
        n: 'Какое действие сильнее остальных?',
        r: 'Скобки, потом умножение и деление, в конце сложение и вычитание.',
      }),

    /* 3 · dnd · 🟢 — yuza yoki perimetr. */
    q('03', 'Yuza yoki perimetr?', '🟢', 'd51-area-perimeter', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Geometriyani eslaymiz', s: "Yuza ichkaridagi kataklarni sanaydi, perimetr chekka yo'lini o'lchaydi.",
        a: 'Yozuvlarni ajrating: qaysilari yuzani, qaysilari perimetrni beradi.',
        tokens: ['4 · 3', '4 + 3 + 4 + 3', '6 · 5', '6 + 5 + 6 + 5'],
        zones: ['Yuza', 'Perimetr'],
        dndHint: 'Yozuvlar tugadi.',
        y: "Ko'paytirish ichkaridagi kataklarni beradi, qo'shish esa chekka bo'ylab yuradi.",
        n: 'Ko\'paytmami yoki yig\'indimi?',
        r: 'Yuza ko\'paytirish bilan, perimetr qo\'shish bilan topiladi.',
      },
      {
        e: 'Вспоминаем геометрию', s: 'Площадь считает клетки внутри, периметр меряет путь по краю.',
        a: 'Разложи записи: какие дают площадь, а какие периметр.',
        tokens: ['4 · 3', '4 + 3 + 4 + 3', '6 · 5', '6 + 5 + 6 + 5'],
        zones: ['Площадь', 'Периметр'],
        dndHint: 'Записи закончились.',
        y: 'Умножение даёт клетки внутри, а сложение идёт по краю.',
        n: 'Это произведение или сумма?',
        r: 'Площадь находят умножением, периметр сложением.',
      }),

    /* 4 · order · 🟡 — o'lchovga keltirish. */
    q('04', 'Bitta o\'lchovga', '🟡', 'd51-to-one-unit', 'order', '📏', [1, 2, 0],
      {
        e: 'Ikkinchi qoida', s: "2 m va 30 sm ni qo'shmoqchimiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['200 + 30 = 230 sm', 'Metr va santimetr har xil o\'lchov', '2 m ni santimetrga aylantiraman: 200 sm'],
        y: "Har xil o'lchovlarning soni qo'shilmaydi. Avval bitta o'lchovga keltiramiz, keyin qo'shamiz.",
        n: 'Qo\'shishdan oldin nima qilish kerak?',
        r: 'Har xil o\'lchovlar avval bittaga keltiriladi.',
      },
      {
        e: 'Второе правило', s: 'Хотим сложить 2 м и 30 см.',
        a: 'Выбери шаги по порядку.',
        o: ['200 + 30 = 230 см', 'Метр и сантиметр — разные мерки', 'Перевожу 2 м в сантиметры: 200 см'],
        y: 'Числа в разных мерках не складывают. Сначала приводим к одной мерке, потом складываем.',
        n: 'Что нужно сделать до сложения?',
        r: 'Разные мерки сначала приводят к одной.',
      }),

    /* 5 · match · 🟡 — o'lchovlar bog'lanishi. */
    q('05', 'O\'lchovlar bog\'lanishi', '🟡', 'd51-match-units', 'match', '🔗', [0, 1, 2],
      {
        e: 'Kursning o\'lchovlari', s: "Metr, kilogramm va soatning mayda o'lchov bilan o'z bog'lanishi bor.",
        a: 'Har o\'lchovni unga teng yozuvga ulang.',
        left: ['1 m', '1 kg', '1 soat'],
        right: ['100 sm', '1000 g', '60 daqiqa'],
        y: "Uzunlik va massa o'nlab, vaqt esa oltmishlab sanaladi.",
        n: 'Uzunlik va massa o\'nlab, vaqt boshqacha sanaladi.',
        r: 'Har kattalikning o\'z o\'lchov zinasi bor.',
      },
      {
        e: 'Мерки курса', s: 'У метра, килограмма и часа своя связь с мелкой меркой.',
        a: 'Соедини каждую мерку с равной ей записью.',
        left: ['1 м', '1 кг', '1 час'],
        right: ['100 см', '1000 г', '60 минут'],
        y: 'Длину и массу считают десятками, а время шестидесятками.',
        n: 'Длина и масса идут десятками, а время иначе.',
        r: 'У каждой величины своя лестница мерок.',
      }),

    /* 6 · choice · 🟡 — tekshirish. */
    q('06', 'Uchinchi qoida', '🟡', 'd51-check-rule', 'choice', '🔒', 1,
      {
        e: 'Javob topildi, keyin nima?', s: "x + 7 = 12 tenglamasi yechildi, ildiz 5 deb topildi.",
        a: 'Endi nima qilish kerak?',
        o: [
          'Hech nima, javob tayyor',
          'Ildizni qo\'yib tekshirish',
          'Tenglamani boshqa yo\'l bilan yechish',
          'Javobni yaxlitlash',
        ],
        y: "5 + 7 = 12, tenglik mos tushdi. Tekshirish ortiqcha qadam emas, yechimning bir qismi.",
        n: 'Topilgan son bilan yozuvni qayta o\'qing.',
        by: [
          "Javob tayyor emas: uni tekshirmaguncha xato sezilmay qolishi mumkin.",
          undefined,
          "Ikkinchi yo'l shart emas, tekshirish yetadi.",
          "Yaxlitlash bu yerda kerak emas, ildiz aniq son.",
        ],
        r: 'Topilgan javob har doim tekshiriladi.',
      },
      {
        e: 'Ответ найден, что дальше?', s: 'Уравнение x + 7 = 12 решено, корень получился 5.',
        a: 'Что нужно сделать теперь?',
        o: [
          'Ничего, ответ готов',
          'Подставить корень и проверить',
          'Решить уравнение другим способом',
          'Округлить ответ',
        ],
        y: '5 + 7 = 12, равенство сошлось. Проверка — не лишний шаг, а часть решения.',
        n: 'Перечитай запись, подставив найденное число.',
        by: [
          'Ответ ещё не готов: без проверки ошибка может остаться незамеченной.',
          undefined,
          'Второй способ не обязателен, проверки достаточно.',
          'Округление здесь ни при чём, корень — точное число.',
        ],
        r: 'Найденный ответ всегда проверяют.',
      }),

    /* 7 · dnd · 🟡 — kasr yoki butun. */
    q('07', 'Butundan katta yoki kichik?', '🟡', 'd51-fractions', 'dnd', '🍰', [0, 1, 0, 1],
      {
        e: 'Kasrlarni eslaymiz', s: "To'rtta kasr. Ularni bir butun bilan solishtiramiz.",
        a: 'Kasrlarni ajrating: qaysilari butundan katta, qaysilari kichik.',
        tokens: ['7/4', '3/4', '9/5', '2/5'],
        zones: ['Butundan katta', 'Butundan kichik'],
        dndHint: 'Kasrlar tugadi.',
        y: "7/4 va 9/5 da surat maxrajdan katta — bunday kasr butundan katta. 3/4 va 2/5 esa kichik.",
        n: 'Suratni maxraj bilan solishtiring.',
        r: 'Surat maxrajdan katta bo\'lsa, kasr butundan katta.',
      },
      {
        e: 'Вспоминаем дроби', s: 'Четыре дроби. Сравниваем их с одним целым.',
        a: 'Разложи дроби: какие больше целого, а какие меньше.',
        tokens: ['7/4', '3/4', '9/5', '2/5'],
        zones: ['Больше целого', 'Меньше целого'],
        dndHint: 'Дроби закончились.',
        y: 'У 7/4 и 9/5 числитель больше знаменателя — такая дробь больше целого. А 3/4 и 2/5 меньше.',
        n: 'Сравни числитель со знаменателем.',
        r: 'Если числитель больше знаменателя, дробь больше целого.',
      }),

    /* 8 · multi · 🔴 — to'g'ri yozuvlar. */
    q('08', 'To\'g\'ri yozuvlar', '🔴', 'd51-true-records', 'multi', '✅', [0, 2],
      {
        e: 'Kurs bo\'ylab', s: "To'rtta yozuv turli mavzudan. Ikkitasi to'g'ri.",
        a: 'Qaysi yozuvlar to\'g\'ri? Hammasini belgilang.',
        o: ['1 m = 100 sm', '1 soat = 100 daqiqa', '5 ≤ 5', '2/8 + 3/8 = 5/16'],
        y: "Metrda yuz santimetr bor, 5 ≤ 5 esa tenglik tufayli rost. Soatda oltmish daqiqa, kasrlarda esa maxraj o'zgarmaydi.",
        n: 'Har yozuvni o\'z mavzusining qoidasi bilan tekshiring.',
        r: 'Har kattalikning o\'z qoidasi bor, ularni aralashtirib bo\'lmaydi.',
      },
      {
        e: 'По всему курсу', s: 'Четыре записи из разных тем. Две из них верны.',
        a: 'Какие записи верные? Отметь все.',
        o: ['1 м = 100 см', '1 час = 100 минут', '5 ≤ 5', '2/8 + 3/8 = 5/16'],
        y: 'В метре сто сантиметров, а 5 ≤ 5 истинно из-за равенства. В часе шестьдесят минут, а у дробей знаменатель не меняется.',
        n: 'Проверь каждую запись правилом её темы.',
        r: 'У каждой величины своё правило, их нельзя смешивать.',
      }),

    /* 9 · input · 🔴 — tarkibli masala. */
    q('09', 'Tarkibli masala', '🔴', 'd51-story', 'input', '🧩', ['32'],
      {
        e: 'Reja kerak', s: "Birinchi javonda 8 kitob, ikkinchisida 3 marta ko'p.",
        a: 'Ikkala javonda jami nechta kitob bor?',
        y: "Avval ikkinchi javon: 8 · 3 = 24. Keyin jami: 8 + 24 = 32 kitob.",
        n: 'Avval yashiringan sonni toping, keyin savolga javob bering.',
        r: 'Tarkibli masalada birinchi amal javobni faqat tayyorlaydi.',
        p: 'Javob',
      },
      {
        e: 'Нужен план', s: 'На первой полке 8 книг, на второй в 3 раза больше.',
        a: 'Сколько книг всего на двух полках?',
        y: 'Сначала вторая полка: 8 · 3 = 24. Потом всего: 8 + 24 = 32 книги.',
        n: 'Сначала найди спрятанное число, потом отвечай на вопрос.',
        r: 'В составной задаче первое действие только готовит ответ.',
        p: 'Ответ',
      }, 'numeric'),

    /* 10 · multi · 🔴 — kursning uchta qoidasi. */
    q('10', 'Uchta qoida', '🔴', 'd51-three-rules', 'multi', '🚀', [0, 2],
      {
        e: 'Yakuniy mashq', s: "To'rtta gap. Ikkitasi kursning asosiy qoidasi.",
        a: 'Qaysi gaplar to\'g\'ri? Hammasini belgilang.',
        o: [
          'Qavs bo\'lmasa, ko\'paytirish qo\'shishdan oldin bajariladi',
          'Amallar har doim chapdan o\'ngga bajariladi',
          'Har xil o\'lchovlar avval bittaga keltiriladi',
          'Javob topilgach, tekshirish shart emas',
        ],
        y: "Ko'paytirish qo'shishdan kuchli, har xil o'lchovlar esa avval bittaga keltiriladi. Chapdan o'ngga faqat kuchi teng amallar hisoblanadi, tekshirish esa yechimning bir qismi.",
        n: 'Har gapni kursning uch qoidasi bilan solishtiring.',
        r: 'Uch qoida: amal tartibi, bitta o\'lchov, tekshirish.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре утверждения. Два из них — главные правила курса.',
        a: 'Какие утверждения верны? Отметь все.',
        o: [
          'Без скобок умножение выполняется раньше сложения',
          'Действия всегда выполняются слева направо',
          'Разные мерки сначала приводят к одной',
          'Когда ответ найден, проверка не нужна',
        ],
        y: 'Умножение сильнее сложения, а разные мерки сначала приводят к одной. Слева направо считают только равные по силе действия, а проверка — часть решения.',
        n: 'Сверь каждое утверждение с тремя правилами курса.',
        r: 'Три правила: порядок действий, одна мерка, проверка.',
      }),
  ],
};

export default DARS51_BANK;
