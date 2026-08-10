// Dars 9 amaliyoti — Ko'paytirish jadvali.
// Manba: 3-sinf darsligi (Burxonov va b., 2019), jadvalli ko'paytirish va bo'lish bo'limi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 multi · 3 match · 4 GRID · 5 multi · 6 choice · 7 order · 8 input · 9 GRID · 10 choice
// 4 va 9 — raskladkadan ataylab chetlanish: metodist qaroriga ko'ra ustunda ko'paytirish
// shu darsda tanishtiriladi (ko'chirishsiz oson holatlar), to'liq usul 21-darsda.
// Sahna modeli — TENG QATORLAR massivi (artKit `array`): bola ko'paytmani teng
// qo'shiluvchilar sifatida ko'radi.
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS09_BANK = {
  title: "Dars 9 · Ko'paytirish jadvali",
  items: [

    /* 1 · match · 🟢 — ko'paytma va natija. Eski D09_03 (match_product). */
    q('01', 'Moslashtiring', '🟢', 'd09-match-product', 'match', '🔗', [0, 1, 2],
      {
        e: 'Jadval faktlari', s: "Uchta ko'paytma va uchta natija aralashib ketgan.",
        a: "Har ko'paytmani uning natijasiga ulang.",
        left: ['6 × 7', '6 × 9', '8 × 9'],
        right: ['42', '54', '72'],
        y: '6 × 7 = 42, 6 × 9 = 54, 8 × 9 = 72.',
        n: "Bilganingizdan boshlang: 6 × 7 eng kichigi, 8 × 9 eng kattasi.",
        r: 'Jadval faktlari: 6 × 7 = 42, 6 × 9 = 54, 8 × 9 = 72.',
      },
      {
        e: 'Факты таблицы', s: 'Три произведения и три результата перемешались.',
        a: 'Соедини каждое произведение с его результатом.',
        left: ['6 × 7', '6 × 9', '8 × 9'],
        right: ['42', '54', '72'],
        y: '6 × 7 = 42, 6 × 9 = 54, 8 × 9 = 72.',
        n: 'Начни с того, что знаешь: 6 × 7 самое маленькое, 8 × 9 самое большое.',
        r: 'Факты таблицы: 6 × 7 = 42, 6 × 9 = 54, 8 × 9 = 72.',
      }, undefined, {
        en: {
          e: 'Table facts', s: 'Three products and three results got mixed up.',
          a: 'Connect each product with its result.',
          left: ['6 × 7', '6 × 9', '8 × 9'],
          right: ['42', '54', '72'],
          y: '6 × 7 = 42, 6 × 9 = 54, 8 × 9 = 72.',
          n: 'Start from what you know: 6 × 7 is the smallest and 8 × 9 is the largest.',
          r: 'Table facts: 6 × 7 = 42, 6 × 9 = 54, 8 × 9 = 72.',
        },
      }),

    /* 2 · multi · 🟢 — 72 ga teng ko'paytmalar. Eski D09_10 (factor_pairs). */
    q('02', '72 ga teng', '🟢', 'd09-equals-72', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil natija', s: "To'rtta ko'paytma. Ikkitasi bir xil natija beradi.",
        a: "Qaysi ko'paytmalar 72 ga teng? Hammasini belgilang.",
        o: ['8 × 9', '7 × 9', '9 × 8', '8 × 8'],
        y: '8 × 9 = 72 va 9 × 8 = 72 — ko\'paytuvchilar o\'rni almashsa ham natija o\'zgarmaydi. 7 × 9 = 63, 8 × 8 = 64.',
        n: 'Har ko\'paytmani alohida hisoblang va 72 bilan solishtiring.',
        r: "Ko'paytuvchilar o'rni almashtirilsa, ko'paytma o'zgarmaydi: 8 × 9 = 9 × 8 = 72.",
      },
      {
        e: 'Одинаковый результат', s: 'Четыре произведения. Два дают одинаковый результат.',
        a: 'Какие произведения равны 72? Отметь все.',
        o: ['8 × 9', '7 × 9', '9 × 8', '8 × 8'],
        y: '8 × 9 = 72 и 9 × 8 = 72 — от перестановки множителей результат не меняется. А 7 × 9 = 63, 8 × 8 = 64.',
        n: 'Посчитай каждое произведение отдельно и сравни с 72.',
        r: 'От перестановки множителей произведение не меняется: 8 × 9 = 9 × 8 = 72.',
      }, undefined, {
        en: {
          e: 'The same result', s: 'Four products. Two of them give the same result.',
          a: 'Which products are equal to 72? Mark them all.',
          o: ['8 × 9', '7 × 9', '9 × 8', '8 × 8'],
          y: '8 × 9 = 72 and 9 × 8 = 72 — swapping the factors does not change the result. And 7 × 9 = 63, 8 × 8 = 64.',
          n: 'Work out every product separately and compare it with 72.',
          r: 'Swapping the factors does not change the product: 8 × 9 = 9 × 8 = 72.',
        },
      }),

    /* 3 · match · 🟢 — yig'indi va ko'paytma. Eski D09_01 (sum_to_product). */
    q('03', "Yig'indidan ko'paytmaga", '🟢', 'd09-sum-to-product', 'match', '➕', [0, 1, 2],
      {
        e: 'Qisqa yozuv', s: "Teng qo'shiluvchilar yig'indisi ko'paytma bilan qisqa yoziladi.",
        a: "Har yig'indini uning ko'paytmasiga ulang.",
        left: ['8 + 8 + 8', '7 + 7 + 7 + 7', '9 + 9'],
        right: ['3 × 8', '4 × 7', '2 × 9'],
        y: "Qo'shiluvchilar SONI birinchi ko'paytuvchi, qo'shiluvchining o'zi ikkinchisi.",
        n: "Har yig'indida nechta qo'shiluvchi bor? O'sha son birinchi turadi.",
        r: "Teng qo'shiluvchilar yig'indisi ko'paytma bilan yoziladi: 8 + 8 + 8 = 3 × 8.",
      },
      {
        e: 'Короткая запись', s: 'Сумму одинаковых слагаемых записывают короче — произведением.',
        a: 'Соедини каждую сумму с её произведением.',
        left: ['8 + 8 + 8', '7 + 7 + 7 + 7', '9 + 9'],
        right: ['3 × 8', '4 × 7', '2 × 9'],
        y: 'КОЛИЧЕСТВО слагаемых — первый множитель, само слагаемое — второй.',
        n: 'Сколько слагаемых в каждой сумме? Это число и стоит первым.',
        r: 'Сумма одинаковых слагаемых пишется произведением: 8 + 8 + 8 = 3 × 8.',
      }, undefined, {
        en: {
          e: 'The short record', s: 'A sum of equal parts is written shorter, as a product.',
          a: 'Connect each sum with its product.',
          left: ['8 + 8 + 8', '7 + 7 + 7 + 7', '9 + 9'],
          right: ['3 × 8', '4 × 7', '2 × 9'],
          y: 'The NUMBER of parts is the first factor and the part itself is the second one.',
          n: 'How many parts are there in each sum? That number goes first.',
          r: 'A sum of equal parts is written as a product: 8 + 8 + 8 = 3 × 8.',
        },
      }),

    /* 4 · GRID · 🟡 — ustunda ko'paytirish bilan TANISHUV, ko'chirishsiz.
       Metodist qarori 2026-08-06: ustun 9-darsda tanishtiriladi (oson holatlar), to'liq
       usul esa 21-darsda. Raskladkada bu o'rinda dnd turardi — ataylab almashtirildi,
       sabab shu izohda (§5.1 "raskladka — topshiriq, taqiq emas"). */
    q('04', "Ustunda ko'paytirish", '🟡', 'd09-grid-12x3', 'grid', '⌨️', undefined,
      {
        e: 'Yangi yozuv', s: "Ko'paytmani ustunda ham yozish mumkin: xona xona ostida. Bu misolda ko'chirish yo'q.",
        a: '12 × 3 ni ustunda hisoblang.',
        gridHint: "Katakni bosing va raqamni tanlang. O'ngdan chapga: avval birliklar, keyin o'nliklar.",
        y: "Birliklar: 2 × 3 = 6. O'nliklar: 1 × 3 = 3. Javob 36.",
        n: "Har xonani alohida ko'paytiring: avval birlikni 3 ga, keyin o'nlikni 3 ga.",
        r: "Ustunda har xona alohida ko'paytiriladi, o'ngdan chapga.",
      },
      {
        e: 'Новая запись', s: 'Произведение можно записать и столбиком: разряд под разрядом. В этом примере переноса нет.',
        a: 'Вычисли 12 × 3 столбиком.',
        gridHint: 'Нажми клетку и выбери цифру. Справа налево: сначала единицы, потом десятки.',
        y: 'Единицы: 2 × 3 = 6. Десятки: 1 × 3 = 3. Ответ 36.',
        n: 'Умножай каждый разряд отдельно: сначала единицы на 3, потом десятки на 3.',
        r: 'В столбике каждый разряд умножается отдельно, справа налево.',
      }, undefined, {
        en: {
          e: 'A new record', s: 'A product can also be written in a column, place under place. This example has no carry.',
          a: 'Work out 12 × 3 in a column.',
          gridHint: 'Tap a cell and pick a digit. From right to left: the ones first, then the tens.',
          y: 'Ones: 2 × 3 = 6. Tens: 1 × 3 = 3. The answer is 36.',
          n: 'Multiply every place separately: the ones by 3 first, then the tens by 3.',
          r: 'In a column every place is multiplied separately, from right to left.',
        },
        grid: {
          op: 'mul',
          cols: 2,
          rows: [
            { id: 'a', cells: ['1', '2'] },
            { id: 'b', sign: true, cells: ['', '3'], line: true },
            { id: 'res', cells: ['3', '6'], fill: 'all' },
          ],
        },
      }),

    /* 5 · multi · 🟡 — nol va bir qoidasi. Eski D09_06 (zero_rule). */
    q('05', 'Nolga teng', '🟡', 'd09-zero-multi', 'multi', '0️⃣', [0, 2],
      {
        e: 'Nol va bir', s: "To'rtta ifoda. Ba'zilarida ko'paytuvchilardan biri nol.",
        a: 'Qaysi ifodalar 0 ga teng? Hammasini belgilang.',
        o: ['99 × 0', '84 × 1', '0 × 7', '1 × 6'],
        y: '99 × 0 = 0 va 0 × 7 = 0: sonni nol marta olsak, hech narsa qolmaydi. 84 × 1 = 84, 1 × 6 = 6.',
        n: "Ko'paytuvchilardan biri nol bo'lsa, natija qanday bo'ladi? Bir bo'lsa-chi?",
        r: 'Nolga ko\'paytirish doim nol. Birga ko\'paytirish son o\'zini beradi.',
      },
      {
        e: 'Ноль и единица', s: 'Четыре выражения. В некоторых один из множителей — ноль.',
        a: 'Какие выражения равны 0? Отметь все.',
        o: ['99 × 0', '84 × 1', '0 × 7', '1 × 6'],
        y: '99 × 0 = 0 и 0 × 7 = 0: если взять число ноль раз, не останется ничего. А 84 × 1 = 84, 1 × 6 = 6.',
        n: 'Что получается, если один из множителей ноль? А если единица?',
        r: 'Умножение на ноль всегда даёт ноль. Умножение на единицу даёт само число.',
      }, undefined, {
        en: {
          e: 'Zero and one', s: 'Four expressions. In some of them one of the factors is zero.',
          a: 'Which expressions are equal to 0? Mark them all.',
          o: ['99 × 0', '84 × 1', '0 × 7', '1 × 6'],
          y: '99 × 0 = 0 and 0 × 7 = 0: if you take a number zero times, nothing is left. And 84 × 1 = 84, 1 × 6 = 6.',
          n: 'What comes out if one of the factors is zero? And what if it is one?',
          r: 'Multiplying by zero always gives zero. Multiplying by one gives the number itself.',
        },
      }),

    /* 6 · choice · 🟡 — 7 × 8. Eski D09_02 (simple_product), 4-chi variant qo'shildi. */
    q('06', 'Jadval fakti', '🟡', 'd09-7x8', 'choice', '✖️', 0,
      {
        e: 'Eslab qoling', s: "Bu fakt jadvalda eng ko'p adashtiradigan faktlardan biri.",
        a: '7 × 8 nechaga teng?',
        o: ['56', '54', '63', '48'],
        y: '7 × 8 = 56. Eslab qolish uchun: 5, 6, 7, 8 — beshu olti yettiu sakkiz.',
        n: 'Bilgan faktdan boring: 7 × 7 = 49, unga yana bitta 7 ni qo\'shing.',
        by: [
          undefined,
          'Bu 6 × 9 ning natijasi. 7 × 7 = 49 dan boshlab bitta 7 qo\'shing.',
          'Bu 7 × 9 ning natijasi — bitta 7 ortiqcha. Nechta 7 kerak edi?',
          'Bu 6 × 8 ning natijasi — bitta 8 yetishmayapti. Nechta 8 kerak edi?',
        ],
        r: '7 × 8 = 56. Qo\'shni faktdan chiqarish mumkin: 7 × 7 + 7.',
      },
      {
        e: 'Запомни', s: 'Этот факт таблицы путают чаще других.',
        a: 'Чему равно 7 × 8?',
        o: ['56', '54', '63', '48'],
        y: '7 × 8 = 56. Чтобы запомнить: 5, 6, 7, 8 — пять шесть семь восемь.',
        n: 'Иди от знакомого факта: 7 × 7 = 49, прибавь к нему ещё одну семёрку.',
        by: [
          undefined,
          'Это результат 6 × 9. Начни с 7 × 7 = 49 и прибавь одну семёрку.',
          'Это результат 7 × 9 — одна семёрка лишняя. Сколько семёрок было нужно?',
          'Это результат 6 × 8 — одной восьмёрки не хватает. Сколько восьмёрок было нужно?',
        ],
        r: '7 × 8 = 56. Можно вывести из соседнего факта: 7 × 7 + 7.',
      }, undefined, {
        en: {
          e: 'Remember this one', s: 'This table fact gets mixed up more often than the others.',
          a: 'How much is 7 × 8?',
          o: ['56', '54', '63', '48'],
          y: '7 × 8 = 56. Here is a way to remember: 5, 6, 7, 8 — five six seven eight.',
          n: 'Start from a fact you know: 7 × 7 = 49, then add one more seven.',
          by: [
            undefined,
            'That is the result of 6 × 9. Start from 7 × 7 = 49 and add one seven.',
            'That is the result of 7 × 9 — one seven too many. How many sevens did you need?',
            'That is the result of 6 × 8 — one eight short. How many eights did you need?',
          ],
          r: '7 × 8 = 56. You can get it from the neighbouring fact: 7 × 7 + 7.',
        },
      }),

    /* 7 · order · 🟡 — qulay guruhlash. Eski D09_07 (qulay_mul). */
    q('07', 'Qulay yo\'l', '🟡', 'd09-grouping', 'order', '🪜', [1, 0, 2],
      {
        e: 'Guruhlash', s: "2 × 7 × 5 ni hisoblashning qulay yo'li bor, lekin qadamlar aralashgan.",
        a: 'Qulay hisoblash qadamlarini tartib bilan tanlang.',
        o: ['7 ni 10 ga ko\'paytiraman', '2 va 5 ni juftlayman', 'Javob 70 ni yozaman'],
        y: 'Avval 2 × 5 = 10, keyin 7 × 10 = 70. O\'nlik bilan ko\'paytirish eng oson.',
        n: "Qaysi ikki ko'paytuvchi yumaloq son beradi? O'shalarni birinchi juftlang.",
        r: "Ko'paytuvchilarni guruhlash mumkin: 2 × 7 × 5 = 7 × (2 × 5) = 70.",
      },
      {
        e: 'Группировка', s: 'У 2 × 7 × 5 есть удобный путь, но шаги перепутались.',
        a: 'Выбери шаги удобного счёта по порядку.',
        o: ['Умножаю 7 на 10', 'Соединяю в пару 2 и 5', 'Записываю ответ 70'],
        y: 'Сначала 2 × 5 = 10, потом 7 × 10 = 70. Умножать на десяток проще всего.',
        n: 'Какие два множителя дают круглое число? Их и соединяй первыми.',
        r: 'Множители можно группировать: 2 × 7 × 5 = 7 × (2 × 5) = 70.',
      }, undefined, {
        en: {
          e: 'Grouping', s: '2 × 7 × 5 has a handy path, but the steps got mixed up.',
          a: 'Pick the steps of the handy way, in order.',
          o: ['I multiply 7 by 10', 'I pair up the 2 and the 5', 'I write down the answer 70'],
          y: 'First 2 × 5 = 10, then 7 × 10 = 70. Multiplying by a ten is the easiest of all.',
          n: 'Which two factors give a round number? Those are the ones to pair up first.',
          r: 'Factors can be grouped: 2 × 7 × 5 = 7 × (2 × 5) = 70.',
        },
      }),

    /* 8 · input · 🔴 — yashiringan ko'paytuvchi. Eski D09_05 (missing_factor). */
    q('08', "Yashiringan ko'paytuvchi", '🔴', 'd09-missing-factor', 'input', '🧩', ['9'],
      {
        e: "Noma'lum son", s: "6 ni noma'lum songa ko'paytirganda 54 chiqdi.",
        a: '6 × ? = 54. Yashiringan ko\'paytuvchini yozing.',
        y: '6 × 9 = 54. Tekshiruv: 54 ni 6 ga bo\'lsak, 9 chiqadi.',
        n: "Jadvaldagi 6 lik qatorni yodga oling: 42, 48, 54, 60...",
        r: "Yashiringan ko'paytuvchi jadvalni teskari bilishdan topiladi: 54 = 6 × 9.",
        p: 'Javob',
      },
      {
        e: 'Неизвестное число', s: 'При умножении 6 на неизвестное число получилось 54.',
        a: '6 × ? = 54. Запиши спрятанный множитель.',
        y: '6 × 9 = 54. Проверка: если 54 разделить на 6, получится 9.',
        n: 'Вспомни строку шестёрки в таблице: 42, 48, 54, 60...',
        r: 'Спрятанный множитель находят обратным ходом по таблице: 54 = 6 × 9.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The unknown number', s: 'Multiplying 6 by an unknown number gave 54.',
          a: '6 × ? = 54. Write the hidden factor.',
          y: '6 × 9 = 54. Check: 54 divided by 6 gives 9.',
          n: 'Remember the row of sixes in the table: 42, 48, 54, 60 and so on.',
          r: 'The hidden factor is found by going back through the table: 54 = 6 × 9.',
          p: 'Answer',
        },
      }),

    /* 9 · GRID · 🔴 — ustunda ko'paytirish, ko'chirishsiz. Bu o'rinda raskladkada dnd
       turardi, lekin u 2-topshiriq bilan (o'rin almashtirish) takrorlanardi. */
    q('09', "Ustunda: 21 × 4", '🔴', 'd09-grid-21x4', 'grid', '⌨️', undefined,
      {
        e: 'Ustunda hisoblang', s: "Yana ustun, endi ko'paytuvchi 4. Bu misolda ham ko'chirish yo'q.",
        a: '21 × 4 ni ustunda hisoblang.',
        gridHint: "Katakni bosing va raqamni tanlang. Har xonani alohida ko'paytiring.",
        y: "Birliklar: 1 × 4 = 4. O'nliklar: 2 × 4 = 8. Javob 84.",
        n: "Avval birlikni 4 ga ko'paytiring, keyin o'nlikni. Natijalar o'z xonasida qoladi.",
        r: "Har xona alohida ko'paytiriladi: 21 × 4 = 20 × 4 + 1 × 4 = 84.",
      },
      {
        e: 'Посчитай столбиком', s: 'Снова столбик, теперь множитель 4. Здесь тоже нет переноса.',
        a: 'Вычисли 21 × 4 столбиком.',
        gridHint: 'Нажми клетку и выбери цифру. Умножай каждый разряд отдельно.',
        y: 'Единицы: 1 × 4 = 4. Десятки: 2 × 4 = 8. Ответ 84.',
        n: 'Сначала умножь единицы на 4, потом десятки. Результаты остаются в своих разрядах.',
        r: 'Каждый разряд умножается отдельно: 21 × 4 = 20 × 4 + 1 × 4 = 84.',
      }, undefined, {
        en: {
          e: 'Work it out in a column', s: 'A column again, and this time the factor is 4. There is no carry here either.',
          a: 'Work out 21 × 4 in a column.',
          gridHint: 'Tap a cell and pick a digit. Multiply every place separately.',
          y: 'Ones: 1 × 4 = 4. Tens: 2 × 4 = 8. The answer is 84.',
          n: 'Multiply the ones by 4 first, then the tens. The results stay in their own places.',
          r: 'Every place is multiplied separately: 21 × 4 = 20 × 4 + 1 × 4 = 84.',
        },
        grid: {
          op: 'mul',
          cols: 2,
          rows: [
            { id: 'a', cells: ['2', '1'] },
            { id: 'b', sign: true, cells: ['', '4'], line: true },
            { id: 'res', cells: ['8', '4'], fill: 'all' },
          ],
        },
      }),

    /* 10 · choice · 🔴 — masala. Eski D09_08 (word_commut), 4-chi variant qo'shildi. */
    q('10', 'Qaysi navdan ko\'p?', '🔴', 'd09-word-commut', 'choice', '🍇', 0,
      {
        e: 'Yakuniy mashq', s: "Husayni uzumdan 9 savat, har birida 8 kg. Toifi uzumdan 8 savat, har birida 9 kg.",
        a: "Qaysi navdan ko'proq uzum uzilgan?",
        o: ['Ikkalasidan teng', 'Husaynidan', 'Toifidan', 'Aniqlab bo\'lmaydi'],
        y: 'Husayni: 9 × 8 = 72 kg. Toifi: 8 × 9 = 72 kg. Ko\'paytuvchilar o\'rni almashgan, natija bir xil.',
        n: "Har navni alohida hisoblang: 9 × 8 va 8 × 9. Ular teng chiqadimi?",
        by: [
          undefined,
          "Husaynida 9 savat 8 kg dan — 9 × 8. Endi toifini ham hisoblang va solishtiring.",
          "Toifida 8 savat 9 kg dan — 8 × 9. Endi husaynini ham hisoblang va solishtiring.",
          "Ikkala son ham berilgan, demak hisoblab solishtirish mumkin.",
        ],
        r: "Ko'paytuvchilar o'rni almashtirilsa, ko'paytma o'zgarmaydi: 9 × 8 = 8 × 9 = 72.",
      },
      {
        e: 'Итоговое задание', s: 'Винограда хусайни 9 корзин по 8 кг. Винограда тоифи 8 корзин по 9 кг.',
        a: 'Какого сорта собрали больше?',
        o: ['Поровну', 'Хусайни', 'Тоифи', 'Определить нельзя'],
        y: 'Хусайни: 9 × 8 = 72 кг. Тоифи: 8 × 9 = 72 кг. Множители переставлены, результат тот же.',
        n: 'Посчитай каждый сорт отдельно: 9 × 8 и 8 × 9. Получились ли они равны?',
        by: [
          undefined,
          'У хусайни 9 корзин по 8 кг — это 9 × 8. Теперь посчитай тоифи и сравни.',
          'У тоифи 8 корзин по 9 кг — это 8 × 9. Теперь посчитай хусайни и сравни.',
          'Оба числа даны, значит посчитать и сравнить можно.',
        ],
        r: 'От перестановки множителей произведение не меняется: 9 × 8 = 8 × 9 = 72.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'There are 9 baskets of husayni grapes with 8 kg in each. And 8 baskets of toifi grapes with 9 kg in each.',
          a: 'Which kind of grapes was picked more of?',
          o: ['The same amount', 'Husayni', 'Toifi', 'It cannot be worked out'],
          y: 'Husayni: 9 × 8 = 72 kg. Toifi: 8 × 9 = 72 kg. The factors are swapped, so the result is the same.',
          n: 'Work out each kind separately: 9 × 8 and 8 × 9. Did they come out equal?',
          by: [
            undefined,
            'Husayni has 9 baskets of 8 kg — that is 9 × 8. Now work out the toifi and compare.',
            'Toifi has 8 baskets of 9 kg — that is 8 × 9. Now work out the husayni and compare.',
            'Both numbers are given, so it can be worked out and compared.',
          ],
          r: 'Swapping the factors does not change the product: 9 × 8 = 8 × 9 = 72.',
        },
      }),
  ],
};

export default DARS09_BANK;
