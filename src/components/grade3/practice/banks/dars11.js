// Dars 11 amaliyoti — Yig'indini ko'paytirish.
// Nazariya: src/components/grade3/Dars11.jsx (num-3-11).
// Bank newBanks.js dan ko'chirildi va §1A kanoniga keltirildi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 multi · 3 match · 4 choice · 5 multi · 6 dnd · 7 order · 8 choice · 9 input · 10 order
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS11_BANK = {
  title: "Dars 11 · Yig'indini ko'paytirish",
  items: [

    /* 1 · match · 🟢 — son va uning qulay yoyilmasi. */
    q('01', 'Qulay yoyilma', '🟢', 'd11-match-split', 'match', '🔗', [0, 1, 2],
      {
        e: 'Sonni yoying', s: "Ko'paytirishdan oldin sonni xona qo'shiluvchilariga ajratamiz.",
        a: 'Har sonni uning yoyilmasiga ulang.',
        left: ['14', '23', '46'],
        right: ['10 + 4', '20 + 3', '40 + 6'],
        y: "Har son o'nlik va birlikka ajraladi: 14 = 10 + 4, 23 = 20 + 3, 46 = 40 + 6.",
        n: "Sonning birinchi raqami o'nliklarni bildiradi: 14 da 1 o'nlik, ya'ni 10.",
        r: "Ikki xonali son o'nlik va birlik yig'indisi sifatida yoziladi.",
      },
      {
        e: 'Разложи число', s: 'Перед умножением раскладываем число на разрядные слагаемые.',
        a: 'Соедини каждое число с его разложением.',
        left: ['14', '23', '46'],
        right: ['10 + 4', '20 + 3', '40 + 6'],
        y: 'Каждое число делится на десятки и единицы: 14 = 10 + 4, 23 = 20 + 3, 46 = 40 + 6.',
        n: 'Первая цифра числа показывает десятки: в 14 один десяток, то есть 10.',
        r: 'Двузначное число записывают как сумму десятков и единиц.',
      }, undefined, {
        en: {
          e: 'Split the number', s: 'Before multiplying we split a number into its place parts.',
          a: 'Connect each number with its split.',
          left: ['14', '23', '46'],
          right: ['10 + 4', '20 + 3', '40 + 6'],
          y: 'Every number splits into tens and ones: 14 = 10 + 4, 23 = 20 + 3, 46 = 40 + 6.',
          n: 'The first digit of a number shows the tens: 14 has one ten, that is 10.',
          r: 'A two-digit number is written as a sum of tens and ones.',
        },
        leftArt: [{ plate: '14' }, { plate: '23' }, { plate: '46' }],
      }),

    /* 2 · multi · 🟢 — 18 × 5 ga teng yozuvlar. Eski 07. */
    q('02', 'Teng yozuvlar', '🟢', 'd11-equal-forms', 'multi', '⚖️', [0, 1, 3],
      {
        e: 'Bir xil qiymat', s: "18 × 5 qiymati 90 ga teng. To'rtta yozuv berilgan.",
        a: 'Qaysi yozuvlar 18 × 5 ga teng? Hammasini belgilang.',
        o: ['10 × 5 + 8 × 5', '9 × 10', '18 + 5', '20 × 5 − 2 × 5'],
        y: "Uchala yozuv ham 90 beradi. 18 + 5 esa qo'shish, u 23 ga teng.",
        n: "Har yozuvni hisoblang va 90 bilan solishtiring. Ko'paytirish va qo'shishni chalkashtirmang.",
        r: "Sonni qo'shiluvchilarga ham, qulay ayirmaga ham ajratish mumkin.",
      },
      {
        e: 'Одно значение', s: 'Значение 18 × 5 равно 90. Даны четыре записи.',
        a: 'Какие записи равны 18 × 5? Отметь все.',
        o: ['10 × 5 + 8 × 5', '9 × 10', '18 + 5', '20 × 5 − 2 × 5'],
        y: 'Три записи дают 90. А 18 + 5 — это сложение, оно равно 23.',
        n: 'Посчитай каждую запись и сравни с 90. Не путай умножение со сложением.',
        r: 'Число можно разложить и на слагаемые, и на удобную разность.',
      }, undefined, {
        en: {
          e: 'One value', s: 'The value of 18 × 5 is 90. Here are four records.',
          a: 'Which records are equal to 18 × 5? Mark them all.',
          o: ['10 × 5 + 8 × 5', '9 × 10', '18 + 5', '20 × 5 − 2 × 5'],
          y: 'Three records give 90. And 18 + 5 is an addition, it equals 23.',
          n: 'Work out every record and compare it with 90. Do not mix multiplication up with addition.',
          r: 'A number can be split into parts to add, or into a handy difference.',
        },
      }),

    /* 3 · match · 🟢 — yoyilma va natija. */
    q('03', 'Yoyilma va natija', '🟢', 'd11-match-result', 'match', '🧮', [0, 1, 2],
      {
        e: 'Ikki bo\'lak', s: "Har yoyilmada ikki ko'paytma bor. Ularni qo'shsak, javob chiqadi.",
        a: 'Har yoyilmani uning natijasiga ulang.',
        left: ['20 × 4 + 3 × 4', '30 × 3 + 2 × 3', '50 × 2 + 4 × 2'],
        right: ['92', '96', '108'],
        y: '20 × 4 + 3 × 4 = 92, 30 × 3 + 2 × 3 = 96, 50 × 2 + 4 × 2 = 108.',
        n: 'Har yoyilmada avval ikki ko\'paytmani hisoblang, keyin ularni qo\'shing.',
        r: "Yoyilmadagi har bo'lak alohida ko'paytiriladi, natijalar qo'shiladi.",
      },
      {
        e: 'Две части', s: 'В каждом разложении два произведения. Сложив их, получим ответ.',
        a: 'Соедини каждое разложение с его результатом.',
        left: ['20 × 4 + 3 × 4', '30 × 3 + 2 × 3', '50 × 2 + 4 × 2'],
        right: ['92', '96', '108'],
        y: '20 × 4 + 3 × 4 = 92, 30 × 3 + 2 × 3 = 96, 50 × 2 + 4 × 2 = 108.',
        n: 'В каждом разложении сначала посчитай два произведения, потом сложи их.',
        r: 'Каждая часть разложения умножается отдельно, результаты складываются.',
      }, undefined, {
        en: {
          e: 'Two parts', s: 'Each split has two products in it. Add them and you get the answer.',
          a: 'Connect each split with its result.',
          left: ['20 × 4 + 3 × 4', '30 × 3 + 2 × 3', '50 × 2 + 4 × 2'],
          right: ['92', '96', '108'],
          y: '20 × 4 + 3 × 4 = 92, 30 × 3 + 2 × 3 = 96, 50 × 2 + 4 × 2 = 108.',
          n: 'In every split work out the two products first, then add them together.',
          r: 'Every part of a split is multiplied separately and the results are added.',
        },
      }),

    /* 4 · choice · 🟡 — qaysi yoyilma to'g'ri. Eski 04, 4-chi variant qo'shildi. */
    q('04', 'Ikki model', '🟡', 'd11-two-models', 'choice', '🧩', 2,
      {
        e: 'Qaysi yozuv to\'g\'ri?', s: '46 ta kristall ikki teng qatorda joylashgan.',
        a: '46 × 2 ga teng yozuvni tanlang.',
        o: ['40 × 2 + 6', '46 + 2', '40 × 2 + 6 × 2', '40 + 6 × 2'],
        y: "40 va 6 ning HAR BIRI 2 ga ko'paytiriladi: 80 + 12 = 92.",
        n: "Sonni yoyganda ikkala bo'lak ham ko'paytuvchiga ko'payishi kerak.",
        by: [
          "Bu yerda 6 ko'paytirilmay qolgan. Yoyilmada nechta bo'lak ko'paytirilishi kerak?",
          "Bu qo'shish, ko'paytirish emas. 46 ni ikki marta olish qanday yoziladi?",
          undefined,
          "Bu yerda 40 ko'paytirilmay qolgan. Ikkala bo'lak ham 2 ga ko'payishi kerak.",
        ],
        r: '(40 + 6) × 2 = 40 × 2 + 6 × 2.',
      },
      {
        e: 'Какая запись верна?', s: '46 кристаллов лежат в двух равных рядах.',
        a: 'Выбери запись, равную 46 × 2.',
        o: ['40 × 2 + 6', '46 + 2', '40 × 2 + 6 × 2', '40 + 6 × 2'],
        y: 'КАЖДОЕ из чисел 40 и 6 умножается на 2: 80 + 12 = 92.',
        n: 'Когда раскладываешь число, обе части должны умножиться на множитель.',
        by: [
          'Здесь 6 осталась неумноженной. Сколько частей разложения нужно умножить?',
          'Это сложение, а не умножение. Как записать, что 46 взяли дважды?',
          undefined,
          'Здесь 40 осталось неумноженным. Обе части должны умножиться на 2.',
        ],
        r: '(40 + 6) × 2 = 40 × 2 + 6 × 2.',
      }, undefined, {
        en: {
          e: 'Which record is right?', s: '46 crystals are lying in two equal rows.',
          a: 'Pick the record that equals 46 × 2.',
          o: ['40 × 2 + 6', '46 + 2', '40 × 2 + 6 × 2', '40 + 6 × 2'],
          y: 'EACH of the numbers 40 and 6 is multiplied by 2: 80 + 12 = 92.',
          n: 'When you split a number, both parts have to be multiplied by the factor.',
          by: [
            'Here the 6 was left unmultiplied. How many parts of the split have to be multiplied?',
            'That is an addition, not a multiplication. How do you write that 46 was taken twice?',
            undefined,
            'Here the 40 was left unmultiplied. Both parts have to be multiplied by 2.',
          ],
          r: '(40 + 6) × 2 = 40 × 2 + 6 × 2.',
        },
      }),

    /* 5 · multi · 🟡 — qaysi yoyilmalar 23 × 4 ga teng. */
    q('05', "23 × 4 ga teng", '🟡', 'd11-equal-23x4', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil ko\'paytma', s: "23 × 4 ni turlicha yozish mumkin. To'rtta yozuv berilgan.",
        a: 'Qaysi yozuvlar 23 × 4 ga teng? Hammasini belgilang.',
        o: ['20 × 4 + 3 × 4', '20 × 4 + 3', '4 × 23', '23 + 4'],
        y: "20 × 4 + 3 × 4 = 92 va 4 × 23 = 92. Qolganlari 83 va 27 beradi.",
        n: "Yoyilmada ikkala bo'lak ham ko'payishi kerak. Ko'paytuvchilar o'rni almashsa, natija o'zgarmaydi.",
        r: "23 × 4 = 20 × 4 + 3 × 4 = 4 × 23 = 92.",
      },
      {
        e: 'Одно произведение', s: '23 × 4 можно записать по-разному. Даны четыре записи.',
        a: 'Какие записи равны 23 × 4? Отметь все.',
        o: ['20 × 4 + 3 × 4', '20 × 4 + 3', '4 × 23', '23 + 4'],
        y: '20 × 4 + 3 × 4 = 92 и 4 × 23 = 92. Остальные дают 83 и 27.',
        n: 'В разложении обе части должны умножиться. От перестановки множителей результат не меняется.',
        r: '23 × 4 = 20 × 4 + 3 × 4 = 4 × 23 = 92.',
      }, undefined, {
        en: {
          e: 'One product', s: '23 × 4 can be written in different ways. Here are four records.',
          a: 'Which records are equal to 23 × 4? Mark them all.',
          o: ['20 × 4 + 3 × 4', '20 × 4 + 3', '4 × 23', '23 + 4'],
          y: '20 × 4 + 3 × 4 = 92 and 4 × 23 = 92. The others give 83 and 27.',
          n: 'In a split both parts have to be multiplied. Swapping the factors does not change the result.',
          r: '23 × 4 = 20 × 4 + 3 × 4 = 4 × 23 = 92.',
        },
      }),

    /* 6 · dnd · 🟡 — bo'laklarni o'z ko'paytmasiga. */
    q('06', "Bo'laklarni joylang", '🟡', 'd11-sort-parts', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: '32 × 3', s: "32 ni 30 va 2 ga ajratdik. Endi har bo'lakni 3 ga ko'paytiramiz.",
        a: "Ajrating: nima o'nliklardan, nima birliklardan chiqqan.",
        tokens: ['30 × 3', '2 × 3', '90', '6'],
        zones: ["O'nliklardan", 'Birliklardan'],
        dndHint: 'Kartalar tugadi.',
        y: "O'nliklardan: 30 × 3 = 90. Birliklardan: 2 × 3 = 6. Jami 96.",
        n: "32 da nechta o'nlik, nechta birlik bor? Har bo'lak o'z ko'paytmasini beradi.",
        r: "32 × 3 = 30 × 3 + 2 × 3 = 90 + 6 = 96.",
      },
      {
        e: '32 × 3', s: 'Мы разложили 32 на 30 и 2. Теперь каждую часть умножаем на 3.',
        a: 'Разложи: что получилось из десятков, а что из единиц.',
        tokens: ['30 × 3', '2 × 3', '90', '6'],
        zones: ['Из десятков', 'Из единиц'],
        dndHint: 'Карточки закончились.',
        y: 'Из десятков: 30 × 3 = 90. Из единиц: 2 × 3 = 6. Всего 96.',
        n: 'Сколько в 32 десятков и сколько единиц? Каждая часть даёт своё произведение.',
        r: '32 × 3 = 30 × 3 + 2 × 3 = 90 + 6 = 96.',
      }, undefined, {
        en: {
          e: '32 × 3', s: 'We split 32 into 30 and 2. Now we multiply each part by 3.',
          a: 'Sort them: what came out of the tens and what out of the ones.',
          tokens: ['30 × 3', '2 × 3', '90', '6'],
          zones: ['Out of the tens', 'Out of the ones'],
          dndHint: 'No cards left.',
          y: 'Out of the tens: 30 × 3 = 90. Out of the ones: 2 × 3 = 6. That makes 96.',
          n: 'How many tens and how many ones are in 32? Each part gives a product of its own.',
          r: '32 × 3 = 30 × 3 + 2 × 3 = 90 + 6 = 96.',
        },
      }),

    /* 7 · order · 🟡 — qadamlar. Eski 03. */
    q('07', 'Qadamlar', '🟡', 'd11-steps', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "32 × 3 ni yig'indini ko'paytirish usulida yechamiz.",
        a: 'Qadamlarni to\'g\'ri tartibga keltiring.',
        o: ['90 + 6 = 96', '32 = 30 + 2', '30 × 3 = 90 va 2 × 3 = 6'],
        y: "Avval yoyamiz, so'ng bo'laklarni ko'paytiramiz, oxirida natijalarni qo'shamiz.",
        n: "Ko'paytirishdan oldin nima qilish kerak? Qo'shishdan oldin-chi?",
        r: "Yoyish, keyin har bo'lakni ko'paytirish, keyin qo'shish.",
      },
      {
        e: 'Три шага', s: 'Решаем 32 × 3 способом умножения суммы.',
        a: 'Расставь шаги в правильном порядке.',
        o: ['90 + 6 = 96', '32 = 30 + 2', '30 × 3 = 90 и 2 × 3 = 6'],
        y: 'Сначала раскладываем, потом умножаем части, в конце складываем результаты.',
        n: 'Что нужно сделать до умножения? А до сложения?',
        r: 'Разложить, потом умножить каждую часть, потом сложить.',
      }, undefined, {
        en: {
          e: 'Three steps', s: 'We are solving 32 × 3 by multiplying a sum.',
          a: 'Put the steps in the right order.',
          o: ['90 + 6 = 96', '32 = 30 + 2', '30 × 3 = 90 and 2 × 3 = 6'],
          y: 'First we split, then we multiply the parts, and at the end we add the results.',
          n: 'What has to be done before the multiplying? And before the adding?',
          r: 'Split, then multiply every part, then add.',
        },
      }),

    /* 8 · choice · 🔴 — teskari yig'ish. Eski 08, 4-chi variant qo'shildi. */
    q('08', 'Teskari yig\'ish', '🔴', 'd11-reverse', 'choice', '↩️', 1,
      {
        e: 'Asl ko\'paytma', s: "30 × 4 + 6 × 4 yozuvi bitta ko'paytmadan hosil bo'lgan.",
        a: "Bu yozuv qaysi ko'paytmadan hosil bo'lgan?",
        o: ['34 × 6', '36 × 4', '30 × 10', '36 × 6'],
        y: "Umumiy ko'paytuvchi 4, qo'shiluvchilar 30 va 6: (30 + 6) × 4 = 36 × 4.",
        n: "Ikkala ko'paytmada bir xil turgan son — umumiy ko'paytuvchi. Qolganlari qo'shiladi.",
        by: [
          "Bu yerda sonlar aralashib ketgan: 4 umumiy ko'paytuvchi edi, 6 esa qo'shiluvchi.",
          undefined,
          "Bu yerda 4 yo'qolgan va 6 ham. Umumiy ko'paytuvchini toping.",
          "Umumiy ko'paytuvchi 6 emas, 4: u ikkala ko'paytmada ham turibdi.",
        ],
        r: 'a × c + b × c = (a + b) × c.',
      },
      {
        e: 'Исходное произведение', s: 'Запись 30 × 4 + 6 × 4 получилась из одного произведения.',
        a: 'Из какого произведения получилась эта запись?',
        o: ['34 × 6', '36 × 4', '30 × 10', '36 × 6'],
        y: 'Общий множитель 4, слагаемые 30 и 6: (30 + 6) × 4 = 36 × 4.',
        n: 'Число, которое стоит в обоих произведениях, — общий множитель. Остальные складываются.',
        by: [
          'Здесь числа перепутались: 4 был общим множителем, а 6 — слагаемым.',
          undefined,
          'Здесь потерялись и 4, и 6. Найди общий множитель.',
          'Общий множитель не 6, а 4: он стоит в обоих произведениях.',
        ],
        r: 'a × c + b × c = (a + b) × c.',
      }, undefined, {
        en: {
          e: 'The original product', s: 'The record 30 × 4 + 6 × 4 came out of a single product.',
          a: 'Which product did this record come from?',
          o: ['34 × 6', '36 × 4', '30 × 10', '36 × 6'],
          y: 'The shared factor is 4 and the parts are 30 and 6: (30 + 6) × 4 = 36 × 4.',
          n: 'The number that stands in both products is the shared factor. The other ones are added.',
          by: [
            'The numbers got mixed up here: 4 was the shared factor and 6 was a part.',
            undefined,
            'Both the 4 and the 6 got lost here. Find the shared factor.',
            'The shared factor is not 6 but 4: it stands in both products.',
          ],
          r: 'a × c + b × c = (a + b) × c.',
        },
      }),

    /* 9 · input · 🔴 — yetishmayotgan birlik. Eski 05. */
    q('09', 'Yetishmayotgan son', '🔴', 'd11-missing', 'input', '🧩', ['3'],
      {
        e: "Bo'sh katak", s: '(40 + □) × 2 = 86 tenglik berilgan.',
        a: 'Bo\'sh katakka qaysi son yoziladi?',
        y: '43 × 2 = 86, demak □ = 3. Tekshiruv: 40 × 2 + 3 × 2 = 80 + 6 = 86.',
        n: "40 × 2 = 80. 86 gacha yana qancha yetmayapti va u nechaga ko'paytirilgan?",
        r: "Yoyilmadagi qismlar asl sonni hosil qiladi: 40 + 3 = 43.",
        p: 'Javob',
      },
      {
        e: 'Пустая клетка', s: 'Дано равенство (40 + □) × 2 = 86.',
        a: 'Какое число пишется в пустую клетку?',
        y: '43 × 2 = 86, значит □ = 3. Проверка: 40 × 2 + 3 × 2 = 80 + 6 = 86.',
        n: '40 × 2 = 80. Сколько не хватает до 86 и на что это число было умножено?',
        r: 'Части разложения складываются в исходное число: 40 + 3 = 43.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The empty cell', s: 'Here is the equality (40 + □) × 2 = 86.',
          a: 'Which number goes into the empty cell?',
          y: '43 × 2 = 86, so □ = 3. Check: 40 × 2 + 3 × 2 = 80 + 6 = 86.',
          n: '40 × 2 = 80. How much is missing up to 86, and what was that number multiplied by?',
          r: 'The parts of a split add up to the original number: 40 + 3 = 43.',
          p: 'Answer',
        },
      }),

    /* 10 · order · 🔴 — natijalarni tartiblash. Eski 06 va 10. */
    q('10', 'Natijalar tartibi', '🔴', 'd11-order-results', 'order', '🚀', [1, 3, 0, 2],
      {
        e: 'Yakuniy mashq', s: "To'rtta ko'paytma. Har birini yig'indini ko'paytirish usulida hisoblang.",
        a: "Ko'paytmalarni natijasi bo'yicha kichigidan kattasiga tartiblang.",
        o: ['24 × 6', '23 × 4', '48 × 5', '12 × 8'],
        y: '23 × 4 = 92, 12 × 8 = 96, 24 × 6 = 144, 48 × 5 = 240.',
        n: "Har ko'paytmani yoyib hisoblang: 20 × 6 + 4 × 6 va hokazo.",
        r: "Qulay yoyilma hisobni tezlashtiradi, natija o'zgarmaydi.",
      },
      {
        e: 'Итоговое задание', s: 'Четыре произведения. Посчитай каждое способом умножения суммы.',
        a: 'Расставь произведения по результату от меньшего к большему.',
        o: ['24 × 6', '23 × 4', '48 × 5', '12 × 8'],
        y: '23 × 4 = 92, 12 × 8 = 96, 24 × 6 = 144, 48 × 5 = 240.',
        n: 'Считай каждое произведение через разложение: 20 × 6 + 4 × 6 и так далее.',
        r: 'Удобное разложение ускоряет счёт, результат не меняется.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Four products. Work each one out by multiplying a sum.',
          a: 'Put the products in order of their result, from the smallest to the largest.',
          o: ['24 × 6', '23 × 4', '48 × 5', '12 × 8'],
          y: '23 × 4 = 92, 12 × 8 = 96, 24 × 6 = 144, 48 × 5 = 240.',
          n: 'Work out every product through a split: 20 × 6 + 4 × 6 and so on.',
          r: 'A handy split speeds up the counting and the result stays the same.',
        },
      }),
  ],
};

export default DARS11_BANK;
