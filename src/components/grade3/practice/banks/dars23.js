// Dars 23 amaliyoti — Ikki amalli masalalar.
// Nazariya: src/components/grade3/Dars23.jsx (num-3-23).
// Darsdagi misol: 45 + 54 = 99, 99 : 8 = 12 va 3 qoldiq — amaliyotda BOSHQA sonlar.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 input · 2 match · 3 input · 4 dnd · 5 match · 6 choice · 7 order · 8 multi · 9 order · 10 dnd
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS23_BANK = {
  title: 'Dars 23 · Ikki amalli masalalar',
  items: [

    /* 1 · input · 🟢 — birinchi qadam. */
    q('01', 'Birinchi qadam', '🟢', 'd23-step-one', 'input', '1️⃣', ['96'],
      {
        e: 'Avval nima topiladi?', s: "Omborga 54 ta detal keldi, keyin yana 42 ta. Ularni 8 ta qutiga teng joylash kerak.",
        a: 'Avval jami nechta detal borligini toping.',
        y: '54 + 42 = 96 ta detal. Bu birinchi qadam, taqsimlash keyin bo\'ladi.',
        n: "Savolga darrov javob bermang: avval taqsimlanadigan jami miqdorni toping.",
        r: 'Tarkibli masalada avval darrov topiladigani topiladi.',
        p: 'Javob',
      },
      {
        e: 'Что находят первым?', s: 'На склад привезли 54 детали, потом ещё 42. Их нужно разложить поровну по 8 коробкам.',
        a: 'Сначала найди, сколько всего деталей.',
        y: '54 + 42 = 96 деталей. Это первый шаг, раскладывание будет потом.',
        n: 'Не отвечай сразу на вопрос: сначала найди общее количество, которое будут раскладывать.',
        r: 'В составной задаче сначала находят то, что находится сразу.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'What is found first?', s: '54 parts were brought to the store, then 42 more. They have to be shared evenly into 8 boxes.',
          a: 'First find how many parts there are in all.',
          y: '54 + 42 = 96 parts. That is the first step, the sharing out comes later.',
          n: 'Do not answer the question straight away: first find the total that is going to be shared out.',
          r: 'In a two-step problem you first find what can be found straight away.',
          p: 'Answer',
        },
      }),

    /* 2 · match · 🟢 — qadam va amal. */
    q('02', 'Qadam va amal', '🟢', 'd23-match-step', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch masala', s: "Har masalada birinchi qadamda o'z amali bajariladi.",
        a: 'Har masalani birinchi qadam amaliga ulang.',
        left: ['54 ta va yana 42 ta keldi', '8 quti, har birida 12 ta', '96 tani 8 qutiga teng'],
        right: ["Qo'shish", "Ko'paytirish", "Bo'lish"],
        y: "Kelgan miqdorlar qo'shiladi, teng qutilardagi jami ko'paytiriladi, teng taqsimlash bo'lishdir.",
        n: 'Har masalada miqdor ortadimi, takrorlanadimi yoki taqsimlanadimi?',
        r: 'Amal vaziyatga qarab tanlanadi, kalit so\'zga emas.',
      },
      {
        e: 'Три задачи', s: 'В каждой задаче на первом шаге своё действие.',
        a: 'Соедини каждую задачу с действием первого шага.',
        left: ['Привезли 54, потом ещё 42', '8 коробок, в каждой по 12', '96 разложить по 8 коробкам'],
        right: ['Сложение', 'Умножение', 'Деление'],
        y: 'Привезённые количества складывают, общее в равных коробках умножают, равное раскладывание — это деление.',
        n: 'В каждой задаче количество растёт, повторяется или раскладывается?',
        r: 'Действие выбирают по ситуации, а не по ключевому слову.',
      }, undefined, {
        en: {
          e: 'Three problems', s: 'Each problem has its own operation on the first step.',
          a: 'Connect each problem with the operation of its first step.',
          left: ['54 were brought, then 42 more', '8 boxes with 12 in each', '96 shared into 8 boxes'],
          right: ['Addition', 'Multiplication', 'Division'],
          y: 'The amounts brought in are added, the total in equal boxes is multiplied, and sharing out evenly is a division.',
          n: 'In each problem, does the amount grow, repeat or get shared out?',
          r: 'The operation is chosen by the situation, not by a key word.',
        },
      }),

    /* 3 · input · 🟢 — ikkinchi qadam. */
    q('03', 'Ikkinchi qadam', '🟢', 'd23-step-two', 'input', '2️⃣', ['12'],
      {
        e: 'Endi javob', s: "96 ta detal 8 ta qutiga teng joylandi.",
        a: 'Har qutida nechta detal bor?',
        y: '96 : 8 = 12 ta detal. Bu masalaning savoliga javob.',
        n: "Jami miqdor topilgan. Endi uni qutilar soniga bo'ling.",
        r: 'Ikkinchi qadam savolga aynan javob beradi.',
        p: 'Javob',
      },
      {
        e: 'Теперь ответ', s: '96 деталей разложили поровну по 8 коробкам.',
        a: 'Сколько деталей в каждой коробке?',
        y: '96 : 8 = 12 деталей. Это и есть ответ на вопрос задачи.',
        n: 'Общее количество найдено. Теперь раздели его на число коробок.',
        r: 'Второй шаг даёт ответ ровно на вопрос задачи.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Now the answer', s: '96 parts were shared evenly into 8 boxes.',
          a: 'How many parts are there in each box?',
          y: '96 : 8 = 12 parts. That is the answer to the question of the problem.',
          n: 'The total has been found. Now divide it by the number of boxes.',
          r: 'The second step answers exactly the question of the problem.',
          p: 'Answer',
        },
      }),

    /* 4 · dnd · 🟡 — bir yoki ikki amal. */
    q('04', 'Necha amal kerak?', '🟡', 'd23-how-many-steps', 'dnd', '🗂️', [1, 0, 1, 0],
      {
        e: 'Qadamlar soni', s: "To'rtta masala. Ba'zilari bir amalda, ba'zilari ikki amalda yechiladi.",
        a: 'Masalalarni ajrating: qaysilari bir amalda, qaysilari ikki amalda yechiladi.',
        tokens: ['54 va 42 keldi, 8 qutiga', '96 tani 8 qutiga', '8 quti 12 tadan va yana 5 ta', '72 tani 9 rafga'],
        zones: ['Bir amal', 'Ikki amal'],
        dndHint: 'Masalalar tugadi.',
        y: "Ikki amal kerak bo'lgan joyda savolga darrov javob berib bo'lmaydi: avval oraliq son topiladi.",
        n: 'Masalada savolga javob berish uchun yetadigan son bormi yoki uni avval topish kerakmi?',
        r: 'Tarkibli masalada oraliq natija oldin topiladi.',
      },
      {
        e: 'Сколько действий?', s: 'Четыре задачи. Одни решаются одним действием, другие двумя.',
        a: 'Разложи задачи: какие решаются одним действием, а какие двумя.',
        tokens: ['Привезли 54 и 42, по 8 коробкам', '96 разложить по 8 коробкам', '8 коробок по 12 и ещё 5', '72 на 9 полок'],
        zones: ['Одно действие', 'Два действия'],
        dndHint: 'Задачи закончились.',
        y: 'Там, где нужны два действия, сразу ответить нельзя: сначала находят промежуточное число.',
        n: 'Есть ли в задаче число, которого хватает для ответа, или его надо сначала найти?',
        r: 'В составной задаче сначала находят промежуточный результат.',
      }, undefined, {
        en: {
          e: 'How many operations?', s: 'Four problems. Some are solved in one operation, others in two.',
          a: 'Sort the problems: which ones are solved in one operation and which in two.',
          tokens: ['54 and 42 brought in, into 8 boxes', '96 shared into 8 boxes', '8 boxes of 12 and 5 more', '72 onto 9 shelves'],
          zones: ['One operation', 'Two operations'],
          dndHint: 'No problems left.',
          y: 'Where two operations are needed, you cannot answer straight away: first you find an in-between number.',
          n: 'Does the problem have a number that is enough for the answer, or does it have to be found first?',
          r: 'In a two-step problem you first find the in-between result.',
        },
      }),

    /* 5 · match · 🟡 — masala va javob. */
    q('05', 'Masala va javob', '🟡', 'd23-match-answer', 'match', '📐', [0, 1, 2],
      {
        e: 'Uch masala', s: "Uchta tarkibli masala. Har biri ikki qadamda yechiladi.",
        a: 'Har masalani uning javobiga ulang.',
        left: ['54 + 42, keyin 8 qutiga', '8 quti 12 tadan, yana 5 ta', '45 + 54, keyin 9 rafga'],
        right: ['12', '101', '11'],
        y: '96 : 8 = 12; 8 × 12 + 5 = 101; 99 : 9 = 11.',
        n: 'Har masalada avval oraliq sonni toping, keyin savolga javob bering.',
        r: 'Ikki qadam: oraliq natija, keyin javob.',
      },
      {
        e: 'Задача и ответ', s: 'Три составные задачи. Каждая решается в два шага.',
        a: 'Соедини каждую задачу с её ответом.',
        left: ['54 + 42, потом по 8 коробкам', '8 коробок по 12, ещё 5', '45 + 54, потом на 9 полок'],
        right: ['12', '101', '11'],
        y: '96 : 8 = 12; 8 × 12 + 5 = 101; 99 : 9 = 11.',
        n: 'В каждой задаче сначала найди промежуточное число, потом ответь на вопрос.',
        r: 'Два шага: промежуточный результат, потом ответ.',
      }, undefined, {
        en: {
          e: 'The problem and the answer', s: 'Three two-step problems. Each one is solved in two steps.',
          a: 'Connect each problem with its answer.',
          left: ['54 + 42, then into 8 boxes', '8 boxes of 12, and 5 more', '45 + 54, then onto 9 shelves'],
          right: ['12', '101', '11'],
          y: '96 : 8 = 12; 8 × 12 + 5 = 101; 99 : 9 = 11.',
          n: 'In every problem find the in-between number first, then answer the question.',
          r: 'Two steps: the in-between result, then the answer.',
        },
      }),

    /* 6 · choice · 🟡 — qoldiqli javob. */
    q('06', 'Qoldiq bilan javob', '🟡', 'd23-with-rest', 'choice', '📦', 2,
      {
        e: 'Hamma sig\'madi', s: "45 ta va yana 54 ta detal keldi. Ularni 8 tadan qutiga joylash kerak.",
        a: 'Nechta to\'la quti chiqadi va nechta detal ortadi?',
        o: ['11 quti, 11 ta ortadi', '12 quti, ortmaydi', '12 quti, 3 ta ortadi', '99 quti, ortmaydi'],
        y: '45 + 54 = 99, keyin 99 : 8 = 12, qoldiq 3.',
        n: "Avval jami miqdorni toping, keyin uni 8 ga bo'ling va qoldiqni ko'ring.",
        by: [
          "Qoldiq 11 bo'luvchi 8 dan katta: undan yana bitta to'la quti chiqadi.",
          "99 soni 8 ga qoldiqsiz bo'linmaydi. Tekshirib ko'ring: 12 × 8 = 96.",
          undefined,
          "99 — bu detallar soni, qutilar emas. Har qutiga 8 tadan tushadi.",
        ],
        r: "Tarkibli masalada javob qoldiq bilan ham bo'lishi mumkin.",
      },
      {
        e: 'Поместились не все', s: 'Привезли 45 деталей, потом ещё 54. Их раскладывают по коробкам по 8.',
        a: 'Сколько выйдет полных коробок и сколько деталей останется?',
        o: ['11 коробок, останется 11', '12 коробок, ничего не останется', '12 коробок, останется 3', '99 коробок, ничего не останется'],
        y: '45 + 54 = 99, потом 99 : 8 = 12, остаток 3.',
        n: 'Сначала найди общее количество, потом раздели его на 8 и посмотри остаток.',
        by: [
          'Остаток 11 больше делителя 8: из него выйдет ещё одна полная коробка.',
          '99 не делится на 8 нацело. Проверь: 12 × 8 = 96.',
          undefined,
          '99 — это число деталей, а не коробок. В каждую коробку кладут по 8.',
        ],
        r: 'В составной задаче ответ может быть и с остатком.',
      }, undefined, {
        en: {
          e: 'Not everything fitted', s: '45 parts were brought in, then 54 more. They are put into boxes of 8.',
          a: 'How many full boxes will there be and how many parts will be left?',
          o: ['11 boxes, 11 left', '12 boxes, nothing left', '12 boxes, 3 left', '99 boxes, nothing left'],
          y: '45 + 54 = 99, then 99 : 8 = 12 with a remainder of 3.',
          n: 'Find the total first, then divide it by 8 and look at the remainder.',
          by: [
            'A remainder of 11 is larger than the divisor 8: one more full box comes out of it.',
            '99 does not divide by 8 exactly. Check: 12 × 8 = 96.',
            undefined,
            '99 is the number of parts, not of boxes. Each box holds 8.',
          ],
          r: 'In a two-step problem the answer can have a remainder too.',
        },
      }),

    /* 7 · order · 🟡 — yechim qadamlari. */
    q('07', 'Yechim qadamlari', '🟡', 'd23-solve-order', 'order', '🪜', [2, 0, 1],
      {
        e: 'Uch qadam', s: "«45 + 54 detal, 8 tadan qutiga» masalasini yechamiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['99 : 8 = 12, qoldiq 3', '12 ta to\'la quti, 3 ta ortdi', '45 + 54 = 99'],
        y: "Avval jami, keyin taqsimlash, oxirida javobni so'z bilan yozish.",
        n: 'Taqsimlashdan oldin nima kerak? Javobni yozishdan oldin-chi?',
        r: 'Tarkibli masala: oraliq natija, amal, javob.',
      },
      {
        e: 'Три шага', s: 'Решаем задачу «45 + 54 детали, по 8 в коробку».',
        a: 'Выбери шаги по порядку.',
        o: ['99 : 8 = 12, остаток 3', '12 полных коробок, 3 осталось', '45 + 54 = 99'],
        y: 'Сначала общее, потом раскладывание, в конце ответ словами.',
        n: 'Что нужно до раскладывания? А до записи ответа?',
        r: 'Составная задача: промежуточный результат, действие, ответ.',
      }, undefined, {
        en: {
          e: 'Three steps', s: 'We are solving the problem about 45 + 54 parts, 8 to a box.',
          a: 'Pick the steps in order.',
          o: ['99 : 8 = 12 with a remainder of 3', '12 full boxes, 3 left over', '45 + 54 = 99'],
          y: 'First the total, then the sharing out, and the answer in words at the end.',
          n: 'What is needed before the sharing out? And before writing the answer?',
          r: 'A two-step problem: the in-between result, the operation, the answer.',
        },
      }),

    /* 8 · multi · 🔴 — qaysi savollarga javob bor. */
    q('08', 'Javob berish mumkinmi?', '🔴', 'd23-answerable', 'multi', '❓', [0, 2],
      {
        e: 'Yetarli ma\'lumot bormi?', s: "Omborda 54 ta va yana 42 ta detal bor, ular 8 ta qutiga joylandi.",
        a: 'Bu shartga qaysi savollarga javob berish MUMKIN? Hammasini belgilang.',
        o: ['Jami nechta detal?', 'Detallar qanday rangda?', 'Har qutida nechta detal?', 'Qutilar qancha turadi?'],
        y: "Jami miqdor va har qutidagi miqdor shartdan topiladi. Rang va narx haqida ma'lumot yo'q.",
        n: 'Har savolga javob berish uchun kerakli sonlar shartda bormi?',
        r: 'Masalaga faqat shartdagi ma\'lumotdan chiqadigan savol beriladi.',
      },
      {
        e: 'Хватает ли данных?', s: 'На складе 54 детали и ещё 42, их разложили по 8 коробкам.',
        a: 'На какие вопросы по этому условию МОЖНО ответить? Отметь все.',
        o: ['Сколько всего деталей?', 'Какого цвета детали?', 'Сколько деталей в каждой коробке?', 'Сколько стоят коробки?'],
        y: 'Общее количество и количество в коробке находятся из условия. О цвете и цене данных нет.',
        n: 'Есть ли в условии числа, нужные для ответа на каждый вопрос?',
        r: 'Задаче задают только тот вопрос, ответ на который следует из условия.',
      }, undefined, {
        en: {
          e: 'Is there enough data?', s: 'The store has 54 parts and 42 more, and they were put into 8 boxes.',
          a: 'Which questions CAN be answered from this? Mark them all.',
          o: ['How many parts are there in all?', 'What colour are the parts?', 'How many parts are in each box?', 'How much do the boxes cost?'],
          y: 'The total and the amount in a box follow from the given facts. There is no data about the colour or the price.',
          n: 'Does the problem have the numbers needed to answer each question?',
          r: 'A problem is only asked the question that follows from what is given.',
        },
      }),

    /* 9 · order · 🔴 — natijalarni tartiblash. */
    q('09', 'Javoblar tartibi', '🔴', 'd23-order-answers', 'order', '📈', [2, 1, 0, 3],
      {
        e: 'Qaysi kichik?', s: "To'rtta tarkibli masala. Har birini yeching va javoblarni solishtiring.",
        a: 'Masalalarni javobi bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['96 : 8', '99 : 9', '72 : 9', '8 × 12 + 5'],
        y: '72 : 9 = 8, 96 : 8 = 12, 99 : 9 = 11... to\'g\'ri tartib: 8, 11, 12, 101.',
        n: 'Har masalani alohida hisoblang, keyin javoblarni razryadlab solishtiring.',
        r: 'Tarkibli masalada javob oxirgi qadamdan chiqadi.',
      },
      {
        e: 'Где меньше?', s: 'Четыре составные задачи. Реши каждую и сравни ответы.',
        a: 'Расставь задачи по ответу от меньшего к большему.',
        o: ['96 : 8', '99 : 9', '72 : 9', '8 × 12 + 5'],
        y: '72 : 9 = 8, 99 : 9 = 11, 96 : 8 = 12, 8 × 12 + 5 = 101.',
        n: 'Посчитай каждую задачу отдельно, потом сравни ответы по разрядам.',
        r: 'В составной задаче ответ получается на последнем шаге.',
      }, undefined, {
        en: {
          e: 'Where is it smaller?', s: 'Four two-step problems. Solve each one and compare the answers.',
          a: 'Put the problems in order of their answer, from the smallest to the largest.',
          o: ['96 : 8', '99 : 9', '72 : 9', '8 × 12 + 5'],
          y: '72 : 9 = 8, 99 : 9 = 11, 96 : 8 = 12, 8 × 12 + 5 = 101.',
          n: 'Work out every problem separately, then compare the answers place by place.',
          r: 'In a two-step problem the answer comes out on the last step.',
        },
      }),

    /* 10 · dnd · 🔴 — qaysi amal bilan boshlanadi. */
    q('10', 'Qaysi amaldan boshlanadi?', '🔴', 'd23-first-op', 'dnd', '🚀', [0, 1, 0, 1],
      {
        e: 'Yakuniy mashq', s: "To'rtta tarkibli masala. Birinchi qadam amali turlicha.",
        a: "Masalalarni ajrating: qaysilari qo'shishdan, qaysilari ko'paytirishdan boshlanadi.",
        tokens: ['54 va 42 keldi, 8 qutiga', '8 quti 12 tadan, yana 5 ta', '45 va 54 keldi, 9 rafga', '6 quti 9 tadan, yana 7 ta'],
        zones: ["Qo'shishdan", "Ko'paytirishdan"],
        dndHint: 'Masalalar tugadi.',
        y: "Kelgan miqdorlar avval qo'shiladi; teng qutilardagi jami avval ko'paytiriladi.",
        n: "Masalada nima birinchi ma'lum bo'ladi: umumiy miqdormi yoki teng guruhlarmi?",
        r: 'Birinchi qadam vaziyatga qarab tanlanadi, kalit so\'zga emas.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре составные задачи. Действие первого шага разное.',
        a: 'Разложи задачи: какие начинают со сложения, а какие с умножения.',
        tokens: ['Привезли 54 и 42, по 8 коробкам', '8 коробок по 12, ещё 5', 'Привезли 45 и 54, на 9 полок', '6 коробок по 9, ещё 7'],
        zones: ['Со сложения', 'С умножения'],
        dndHint: 'Задачи закончились.',
        y: 'Привезённые количества сначала складывают; общее в равных коробках сначала умножают.',
        n: 'Что становится известно первым: общее количество или равные группы?',
        r: 'Первый шаг выбирают по ситуации, а не по ключевому слову.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Four two-step problems. The operation of the first step is different in each.',
          a: 'Sort the problems: which ones start with an addition and which with a multiplication.',
          tokens: ['54 and 42 brought in, into 8 boxes', '8 boxes of 12, and 5 more', '45 and 54 brought in, onto 9 shelves', '6 boxes of 9, and 7 more'],
          zones: ['With an addition', 'With a multiplication'],
          dndHint: 'No problems left.',
          y: 'The amounts brought in are added first; the total in equal boxes is multiplied first.',
          n: 'Which becomes known first: the total or the equal groups?',
          r: 'The first step is chosen by the situation, not by a key word.',
        },
      }),
  ],
};

export default DARS23_BANK;
