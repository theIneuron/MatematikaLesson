// Dars 7 amaliyoti — Ustunda qo'shish va ayirish.
// Manba: 3-sinf darsligi (Burxonov va b., 2019), 2-bob; 1000 ichida qo'shish va ayirish.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 order · 3 multi · 4 dnd · 5 choice · 6 GRID · 7 order · 8 match · 9 GRID · 10 input
// 1-19 darslar ichida GRID (katakma-katak ustun) FAQAT shu darsda — yozma usul shu yerda.
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS07_BANK = {
  title: "Dars 7 · Ustunda qo'shish va ayirish",
  items: [

    /* 1 · match · 🟢 — misol va javobi. Eski D07_02 (match_calc). */
    q('01', 'Misol va javob', '🟢', 'd07-match-calc', 'match', '🔗', [0, 1, 2],
      {
        e: 'Yumaloq sonlar', s: "Uchta misol yechilgan, javoblar aralashib ketgan.",
        a: 'Har misolni uning javobiga ulang.',
        left: ['140 + 440', '780 − 650', '920 − 410'],
        right: ['580', '130', '510'],
        y: '140 + 440 = 580, 780 − 650 = 130, 920 − 410 = 510.',
        n: "Har misolni xonama-xona hisoblang: avval yuzliklar, keyin o'nliklar. Birliklar bu yerda nol.",
        r: "Yumaloq sonlarni xonama-xona qo'shish va ayirish oson: birliklar aralashmaydi.",
      },
      {
        e: 'Круглые числа', s: 'Три примера решены, ответы перемешались.',
        a: 'Соедини каждый пример с его ответом.',
        left: ['140 + 440', '780 − 650', '920 − 410'],
        right: ['580', '130', '510'],
        y: '140 + 440 = 580, 780 − 650 = 130, 920 − 410 = 510.',
        n: 'Считай каждый пример по разрядам: сначала сотни, потом десятки. Единицы здесь нулевые.',
        r: 'Круглые числа удобно складывать и вычитать по разрядам: единицы не мешают.',
      }, undefined, {
        en: {
          e: 'Round numbers', s: 'Three examples are solved, but the answers got mixed up.',
          a: 'Connect each example with its answer.',
          left: ['140 + 440', '780 − 650', '920 − 410'],
          right: ['580', '130', '510'],
          y: '140 + 440 = 580, 780 − 650 = 130, 920 − 410 = 510.',
          n: 'Work through every example place by place: the hundreds first, then the tens. The ones here are zeros.',
          r: 'Round numbers are easy to add and subtract place by place: the ones do not get in the way.',
        },
      }),

    /* 2 · order · 🟢 — ustunda amal tartibi. */
    q('02', 'Qaysi xonadan boshlaymiz?', '🟢', 'd07-order-steps', 'order', '🪜', [2, 0, 1],
      {
        e: 'Ustun tartibi', s: "Ustunda hisoblash aniq tartibda boradi, lekin qadamlar aralashib ketgan.",
        a: 'Qadamlarni to\'g\'ri tartibda tanlang.',
        o: ["O'nliklarni qo'shaman", 'Yuzliklarni qo\'shaman', 'Birliklarni qo\'shaman'],
        y: "Ustunda hisob o'ngdan chapga boradi: avval birliklar, keyin o'nliklar, oxirida yuzliklar.",
        n: "Ko'chirish qaysi tomonga ketadi? Demak boshlash ham o'sha tomondan.",
        r: "Ustunda amal o'ngdan chapga bajariladi: birlik, o'nlik, yuzlik.",
      },
      {
        e: 'Порядок в столбике', s: 'В столбике считают в строгом порядке, но шаги перепутались.',
        a: 'Выбери шаги в правильном порядке.',
        o: ['Складываю десятки', 'Складываю сотни', 'Складываю единицы'],
        y: 'В столбике счёт идёт справа налево: сначала единицы, потом десятки, в конце сотни.',
        n: 'В какую сторону уходит перенос? Значит, с той стороны и начинаем.',
        r: 'В столбике действие выполняется справа налево: единицы, десятки, сотни.',
      }, undefined, {
        en: {
          e: 'Order in the column', s: 'In a column you work in a strict order, but the steps got mixed up.',
          a: 'Pick the steps in the right order.',
          o: ['I add the tens', 'I add the hundreds', 'I add the ones'],
          y: 'In a column you work from right to left: the ones first, then the tens, and the hundreds last.',
          n: 'Which way does a carry travel? That is the side you start from.',
          r: 'In a column the work goes from right to left: ones, tens, hundreds.',
        },
      }),

    /* 3 · multi · 🟢 — qayerda ko'chirish bo'ladi. */
    q('03', "Ko'chirish bo'ladimi?", '🟢', 'd07-carry-multi', 'multi', '🔺', [1, 2],
      {
        e: "Ko'chirishni oldindan ko'ring", s: "To'rtta misol. Ba'zilarida birliklar o'ndan oshadi.",
        a: "Qaysi misollarda birliklardan KO'CHIRISH bo'ladi? Hammasini belgilang.",
        o: ['323 + 571', '436 + 345', '476 + 378', '243 + 122'],
        y: '436 + 345: 6 + 5 = 11. 476 + 378: 6 + 8 = 14. Ikkalasida ham birliklar o\'ndan oshadi.',
        n: 'Har misolda faqat BIRLIKLARNI qo\'shing va natijani 10 bilan solishtiring.',
        r: "Birliklar yig'indisi 10 ga yetsa, bitta o'nlik keyingi xonaga ko'chadi.",
      },
      {
        e: 'Будет ли перенос?', s: 'Четыре примера. В некоторых единицы переваливают за десяток.',
        a: 'В каких примерах будет ПЕРЕНОС из единиц? Отметь все.',
        o: ['323 + 571', '436 + 345', '476 + 378', '243 + 122'],
        y: '436 + 345: 6 + 5 = 11. 476 + 378: 6 + 8 = 14. В обоих единицы переваливают за десяток.',
        n: 'В каждом примере сложи только ЕДИНИЦЫ и сравни результат с 10.',
        r: 'Если сумма единиц дошла до 10, один десяток переходит в следующий разряд.',
      }, undefined, {
        en: {
          e: 'Will there be a carry?', s: 'Four examples. In some of them the ones spill over a ten.',
          a: 'In which examples will there be a CARRY out of the ones? Mark them all.',
          o: ['323 + 571', '436 + 345', '476 + 378', '243 + 122'],
          y: '436 + 345: 6 + 5 = 11. 476 + 378: 6 + 8 = 14. In both the ones spill over a ten.',
          n: 'In every example add only the ONES and compare the result with 10.',
          r: 'If the sum of the ones reaches 10, one ten moves into the next place.',
        },
      }),

    /* 4 · dnd · 🟡 — xona xona ostidami. Eski D07_04 (col_align). */
    q('04', 'Xona xona ostida', '🟡', 'd07-align', 'dnd', '📐', [0, 1, 0, 1],
      {
        e: 'Yozuv qoidasi', s: "Ustun yozuvida har raqam o'z xonasi ostida turishi kerak.",
        a: 'Yozuvlarni ajrating: qaysilarida xona xona ostida, qaysilarida surilgan.',
        tokens: ['436 va 345', '436 va 45', '243 va 122', '243 va 22'],
        zones: ["Xona xona ostida", 'Surilgan yozuv'],
        dndHint: 'Yozuvlar tugadi.',
        y: "Uch xonali sonlar bir-birining ostida to'g'ri turadi. Ikki xonali son o'ngga tekislanadi, aks holda razryadlar adashadi.",
        n: "Har juftlikda raqamlar soni bir xilmi? Turlicha bo'lsa, tekislashga ehtiyot bo'ling.",
        r: "Ustun yozuvining qoidasi: birlik birlik ostida, o'nlik o'nlik ostida.",
      },
      {
        e: 'Разряд под разрядом', s: 'В столбике каждая цифра должна стоять под своим разрядом.',
        a: 'Разложи записи: где разряд стоит под разрядом, а где со сдвигом.',
        tokens: ['436 и 345', '436 и 45', '243 и 122', '243 и 22'],
        zones: ['Разряд под разрядом', 'Запись со сдвигом'],
        dndHint: 'Записи закончились.',
        y: 'Трёхзначные числа встают друг под друга ровно. Двузначное надо выровнять по правому краю, иначе разряды перепутаются.',
        n: 'В каждой паре одинаковое ли количество цифр? Если разное — будь осторожен с выравниванием.',
        r: 'Правило столбика: единицы под единицами, десятки под десятками.',
      }, undefined, {
        en: {
          e: 'Place under place', s: 'In a column every digit has to stand under its own place.',
          a: 'Sort the records: where place stands under place and where the writing is shifted.',
          tokens: ['436 and 345', '436 and 45', '243 and 122', '243 and 22'],
          zones: ['Place under place', 'Shifted writing'],
          dndHint: 'No records left.',
          y: 'Three-digit numbers line up evenly under each other. A two-digit one has to be lined up by the right edge, otherwise the places get mixed up.',
          n: 'Does each pair have the same number of digits? If not, be careful with the lining up.',
          r: 'The column rule: ones under ones, tens under tens.',
        },
      }),

    /* 5 · choice · 🟡 — XATONI TOPING. Eski D07_07, 4-chi variant qo'shildi. */
    q('05', 'Xatoni toping', '🟡', 'd07-find-error', 'choice', '🔎', 1,
      {
        e: 'Xatoni toping', s: "To'rtta yechim. Bittasida qarz hisobga olinmagan.",
        a: 'Qaysi yozuv XATO?',
        o: ['323 + 571 = 894', '347 − 128 = 229', '243 − 122 = 121', '436 + 345 = 781'],
        y: "347 − 128 = 219 bo'lishi kerak: birlikka qarz berilgach, o'nlik 4 emas, 3 bo'lib qoladi.",
        n: "Ayirishda qarz olingan bo'lsa, qo'shni xona 1 ga kamayishi kerak.",
        by: [
          "Bu misolda ko'chirish ham, qarz ham yo'q: 3+1, 2+7, 3+5. Tekshirib ko'ring.",
          undefined,
          "Bu misolda qarz kerak emas: har xonada yuqoridagi raqam kattaroq. Tekshirib ko'ring.",
          "Bu misolda birliklardan ko'chirish bor va u hisobga olingan. Tekshirib ko'ring.",
        ],
        r: "Qarz olingan xona 1 ga kamayadi: 347 − 128 = 219, 229 emas.",
      },
      {
        e: 'Найди ошибку', s: 'Четыре решения. В одном не учтён заём.',
        a: 'Какая запись НЕВЕРНА?',
        o: ['323 + 571 = 894', '347 − 128 = 229', '243 − 122 = 121', '436 + 345 = 781'],
        y: 'Должно быть 347 − 128 = 219: после займа в единицы десяток становится не 4, а 3.',
        n: 'Если при вычитании занимали, соседний разряд должен уменьшиться на 1.',
        by: [
          'В этом примере нет ни переноса, ни займа: 3+1, 2+7, 3+5. Проверь.',
          undefined,
          'В этом примере заём не нужен: в каждом разряде верхняя цифра больше. Проверь.',
          'В этом примере есть перенос из единиц, и он учтён. Проверь.',
        ],
        r: 'Разряд, из которого занимали, уменьшается на 1: 347 − 128 = 219, а не 229.',
      }, undefined, {
        en: {
          e: 'Find the mistake', s: 'Four solutions. In one of them the borrow was not counted.',
          a: 'Which record is WRONG?',
          o: ['323 + 571 = 894', '347 − 128 = 229', '243 − 122 = 121', '436 + 345 = 781'],
          y: 'It should be 347 − 128 = 219: after the ones borrowed, the tens digit becomes 3, not 4.',
          n: 'If you borrowed while subtracting, the neighbour place has to go down by 1.',
          by: [
            'This example has no carry and no borrow: 3+1, 2+7, 3+5. Check it.',
            undefined,
            'This example needs no borrow: in every place the top digit is bigger. Check it.',
            'This example does have a carry out of the ones, and it was counted. Check it.',
          ],
          r: 'The place you borrowed from goes down by 1: 347 − 128 = 219, not 229.',
        },
      }),

    /* 6 · GRID · 🟡 — qo'shish, ko'chirish bilan. Eski D07_05 (col_add_carry). */
    q('06', "Ustunda qo'shish", '🟡', 'd07-grid-add', 'grid', '⌨️', undefined,
      {
        e: "Ustunda qo'shish", s: "436 va 345 xona xona ostida turibdi. O'ngdan chapga qo'shamiz.",
        a: '436 + 345 ni ustunda hisoblang.',
        gridHint: "Katakni bosing va raqamni tanlang. Ko'chirish bo'lmasa, yuqoridagi katak bo'sh qoladi.",
        y: "Birliklar: 6 + 5 = 11 — 1 yoziladi, 1 o'nlik ko'chadi. O'nliklar: 3 + 4 + 1 = 8. Yuzliklar: 4 + 3 = 7.",
        n: "6 + 5 bir xonaga sig'maydi: 1 ni yozing, 1 o'nlikni yuqoriga ko'chiring.",
        r: "O'n birlik to'lsa, 1 o'nlik keyingi xonaga ko'chadi.",
      },
      {
        e: 'Сложение столбиком', s: '436 и 345 стоят разряд под разрядом. Складываем справа налево.',
        a: 'Вычисли 436 + 345 столбиком.',
        gridHint: 'Нажми клетку и выбери цифру. Если переноса нет, верхняя клетка остаётся пустой.',
        y: 'Единицы: 6 + 5 = 11 — пишем 1, один десяток переносим. Десятки: 3 + 4 + 1 = 8. Сотни: 4 + 3 = 7.',
        n: '6 + 5 не помещается в один разряд: запиши 1, а один десяток перенеси наверх.',
        r: 'Когда набирается десять единиц, один десяток переходит в следующий разряд.',
      }, undefined, {
        en: {
          e: 'Adding in a column', s: '436 and 345 stand place under place. We work from right to left.',
          a: 'Work out 436 + 345 in a column.',
          gridHint: 'Tap a cell and pick a digit. If there is no carry, the top cell stays empty.',
          y: 'Ones: 6 + 5 = 11 — write 1 and carry one ten. Tens: 3 + 4 + 1 = 8. Hundreds: 4 + 3 = 7.',
          n: '6 + 5 does not fit into one place: write 1 and carry one ten upstairs.',
          r: 'When ten ones come together, one ten moves into the next place.',
        },
        grid: {
          op: 'add',
          cols: 3,
          rows: [
            // fill faqat [1]: ko'chirish YO'Q joyda (sotni, birlik) katak umuman
            // bosilmaydi — aks holda bola "ko'chirish yo'q" deb 0 yozadi va xato
            // hisoblanadi, garchi tushunchasi to'g'ri bo'lsa ham (metodist, 2026-08-24).
            { id: 'carry', kind: 'carry', cells: ['', '1', ''], fill: [1] },
            { id: 'a', cells: ['4', '3', '6'] },
            { id: 'b', sign: true, cells: ['3', '4', '5'], line: true },
            { id: 'sum', cells: ['7', '8', '1'], fill: 'all' },
          ],
          // O'ngdan chapga: avval birlik natijasi, keyin undan chiqqan o'tkazish,
          // keyin o'nlik, oxirida yuzlik — darsda o'rgatilgan tartib bilan bir xil.
          fillOrder: [
            ['sum', 2],
            ['carry', 1], ['sum', 1],
            ['sum', 0],
          ],
        },
      }),

    /* 7 · order · 🟡 — qarz olish qadamlari. */
    q('07', 'Qarz qanday olinadi?', '🟡', 'd07-borrow-order', 'order', '🤝', [1, 2, 0],
      {
        e: 'Qarz qadamlari', s: "347 − 128 da birliklar yetmaydi: 7 dan 8 ayrilmaydi.",
        a: 'Qarz olish qadamlarini tartib bilan tanlang.',
        o: ["O'nliklar sonini 1 ga kamaytiraman", "Birliklar yetmasligini ko'raman", "Qo'shni o'nlikdan 1 ni olaman"],
        y: "Avval yetmasligini ko'ramiz, keyin qo'shnidan qarz olamiz, so'ng o'sha qo'shnini 1 ga kamaytiramiz.",
        n: "Qarz olishdan oldin nimani bilish kerak? Va qarz olingandan keyin nima o'zgaradi?",
        r: "Birlik yetmasa, qo'shni o'nlikdan 1 qarz olinadi — o'sha o'nlik 1 ga kamayadi.",
      },
      {
        e: 'Шаги займа', s: 'В 347 − 128 не хватает единиц: из 7 не вычесть 8.',
        a: 'Выбери шаги займа по порядку.',
        o: ['Уменьшаю число десятков на 1', 'Вижу, что единиц не хватает', 'Беру 1 у соседнего десятка'],
        y: 'Сначала видим нехватку, потом занимаем у соседа, затем этого соседа уменьшаем на 1.',
        n: 'Что нужно понять до займа? И что меняется после займа?',
        r: 'Если единиц не хватает, занимают 1 у соседнего десятка — этот десяток уменьшается на 1.',
      }, undefined, {
        en: {
          e: 'The borrowing steps', s: 'In 347 − 128 there are not enough ones: 8 cannot be taken from 7.',
          a: 'Pick the borrowing steps in order.',
          o: ['I make the number of tens smaller by 1', 'I see that there are not enough ones', 'I take 1 from the neighbouring ten'],
          y: 'First we see that ones are short, then we borrow from the neighbour, and then that neighbour goes down by 1.',
          n: 'What do you have to notice before borrowing? And what changes after it?',
          r: 'If the ones are short, you borrow 1 from the neighbouring ten, and that ten goes down by 1.',
        },
      }),

    /* 8 · match · 🔴 — misol va javobi, qarz bilan. */
    q('08', 'Ayirish natijalari', '🔴', 'd07-match-sub', 'match', '➖', [0, 1, 2],
      {
        e: 'Uch ayirish', s: "Uchta ayirish: bittasida qarz yo'q, ikkitasida bor.",
        a: 'Har misolni uning javobiga ulang.',
        left: ['243 − 122', '347 − 128', '856 − 477'],
        right: ['121', '219', '379'],
        y: '243 − 122 = 121 (qarzsiz), 347 − 128 = 219 (bir qarz), 856 − 477 = 379 (ikki qarz).',
        n: "Har misolda birliklarni solishtiring: yuqoridagi kichik bo'lsa, qarz kerak.",
        r: "Qarz ketma-ket bo'lishi mumkin: har safar qo'shni xona 1 ga kamayadi.",
      },
      {
        e: 'Три вычитания', s: 'Три примера: в одном займа нет, в двух есть.',
        a: 'Соедини каждый пример с его ответом.',
        left: ['243 − 122', '347 − 128', '856 − 477'],
        right: ['121', '219', '379'],
        y: '243 − 122 = 121 (без займа), 347 − 128 = 219 (один заём), 856 − 477 = 379 (два займа).',
        n: 'В каждом примере сравни единицы: если верхняя меньше, нужен заём.',
        r: 'Заём может идти подряд: каждый раз соседний разряд уменьшается на 1.',
      }, undefined, {
        en: {
          e: 'Three subtractions', s: 'Three examples: one without a borrow, two with one.',
          a: 'Connect each example with its answer.',
          left: ['243 − 122', '347 − 128', '856 − 477'],
          right: ['121', '219', '379'],
          y: '243 − 122 = 121 (no borrow), 347 − 128 = 219 (one borrow), 856 − 477 = 379 (two borrows).',
          n: 'In every example compare the ones: if the top one is smaller, a borrow is needed.',
          r: 'Borrows can come one after another: each time the neighbour place goes down by 1.',
        },
      }),

    /* 9 · GRID · 🔴 — ayirish, ketma-ket qarz bilan. Eski D07_10 (col_sub_borrow2). */
    q('09', 'Ustunda ayirish', '🔴', 'd07-grid-sub', 'grid', '⌨️', undefined,
      {
        e: 'Ustunda ayirish', s: "856 dan 477 ni ayiramiz. Bu yerda qarz ikki marta kerak bo'ladi.",
        a: '856 − 477 ni ustunda hisoblang.',
        gridHint: "Katakni bosing va sonni yozing. Xona yetmasa, ustiga o'nlik qo'shilgan ikki xonali sonni yozing (masalan, 16).",
        y: "Birliklar: 16 − 7 = 9 (o'nlikdan qarz). O'nliklar: 14 − 7 = 7 (yuzlikdan qarz). Yuzliklar: 7 − 4 = 3.",
        n: "6 dan 7 ayrilmaydi — o'nlikdan qarz oling. Endi o'nlik 4 bo'ldi, undan ham 7 ayrilmaydi.",
        r: "Qarz ketma-ket bo'lishi mumkin: har safar qo'shni xona 1 ga kamayadi.",
      },
      {
        e: 'Вычитание столбиком', s: 'Из 856 вычитаем 477. Здесь заём понадобится дважды.',
        a: 'Вычисли 856 − 477 столбиком.',
        gridHint: 'Нажми клетку и впиши число. Если в разряде не хватает, впиши над ним двузначное число с добавленным десятком (например, 16).',
        y: 'Единицы: 16 − 7 = 9 (заём у десятка). Десятки: 14 − 7 = 7 (заём у сотни). Сотни: 7 − 4 = 3.',
        n: 'Из 6 не вычесть 7 — займи у десятка. Теперь десяток стал 4, из него тоже не вычесть 7.',
        r: 'Заём может идти подряд: каждый раз соседний разряд уменьшается на 1.',
      }, undefined, {
        en: {
          e: 'Subtracting in a column', s: 'We subtract 477 from 856. Here a borrow is needed twice.',
          a: 'Work out 856 − 477 in a column.',
          gridHint: 'Tap a cell and type the number. If a place is short, write the two-digit number with the extra ten above it (for example, 16).',
          y: 'Ones: 16 − 7 = 9 (borrowed from the tens). Tens: 14 − 7 = 7 (borrowed from the hundreds). Hundreds: 7 − 4 = 3.',
          n: '7 cannot be taken from 6 — borrow from the tens. Now the tens are 4, and 7 cannot be taken from that either.',
          r: 'Borrows can come one after another: each time the neighbour place goes down by 1.',
        },
        grid: {
          op: 'sub',
          cols: 3,
          rows: [
            // Maktabda o'rgatilgan usul: xona yetmasa, uning ustiga O'NLIK QO'SHILGAN
            // ikki xonali son yoziladi (6 -> 16, 4 -> 14). Qo'shni xona esa faqat 1 ga
            // kamayadi va bitta raqam bilan yoziladi (8 -> 7) — ikkinchi marta qarz
            // bermasa, ikki xonali bo'lishga hojat yo'q.
            { id: 'borrow', kind: 'carry', cells: ['7', '14', '16'], fill: 'all', struckRow: 'a' },
            { id: 'a', cells: ['8', '5', '6'] },
            { id: 'b', sign: true, cells: ['4', '7', '7'], line: true },
            { id: 'res', cells: ['3', '7', '9'], fill: 'all' },
          ],
          // O'ngdan chapga, xona-baxona: avval shu xonaning (kerak bo'lsa ikki xonali)
          // yozuvi, keyin o'sha xonaning natijasi — qo'shish itemidagi bilan bir xil qolip.
          fillOrder: [
            ['borrow', 2], ['res', 2],
            ['borrow', 1], ['res', 1],
            ['borrow', 0], ['res', 0],
          ],
        },
      }),

    /* 10 · input · 🔴 — ikki qadamli masala. Eski D07_09 (case_two_step). */
    q('10', 'Nechta kitob qoldi?', '🔴', 'd07-two-step', 'input', '📚', ['200'],
      {
        e: 'Yakuniy mashq', s: "Do'konda 680 ta kitob bor edi. Birinchi kuni 210 tasi sotildi, ikkinchi kuni 60 tasi ko'p sotildi.",
        a: "Do'konda nechta kitob qoldi?",
        y: '2-kun: 210 + 60 = 270 ta. Jami sotildi: 210 + 270 = 480. Qoldi: 680 − 480 = 200 ta.',
        n: "Avval 2-kunda nechta sotilganini toping, keyin ikkala kunni qo'shing va 680 dan ayiring.",
        r: '680 − (210 + 270) = 200 — masala ikki qadamda yechiladi.',
        p: 'Javob',
      },
      {
        e: 'Итоговое задание', s: 'В магазине было 680 книг. В первый день продали 210, во второй — на 60 больше.',
        a: 'Сколько книг осталось в магазине?',
        y: '2-й день: 210 + 60 = 270. Всего продано: 210 + 270 = 480. Осталось: 680 − 480 = 200.',
        n: 'Сначала найди, сколько продали во второй день, потом сложи оба дня и вычти из 680.',
        r: '680 − (210 + 270) = 200 — задача решается в два шага.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Final task', s: 'A shop had 680 books. On the first day 210 were sold, on the second 60 more than that.',
          a: 'How many books are left in the shop?',
          y: 'Day 2: 210 + 60 = 270. Sold in all: 210 + 270 = 480. Left: 680 − 480 = 200.',
          n: 'First find how many were sold on the second day, then add both days and subtract from 680.',
          r: '680 − (210 + 270) = 200 — the problem is solved in two steps.',
          p: 'Answer',
        },
      }),
  ],
};

export default DARS07_BANK;
