// Dars 6 amaliyoti — Son o'qi va shkala.
// Manba: 3-sinf darsligi (Burxonov va b., 2019), 1-bobdagi sonlar ketma-ketligi mashqlari.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 choice · 2 match · 3 input · 4 order · 5 dnd · 6 order · 7 multi · 8 input · 9 choice · 10 dnd
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS06_BANK = {
  title: "Dars 6 · Son o'qi va shkala",
  items: [

    /* 1 · choice · 🟢 — shkalani o'qish. Eski D06_01, 4-chi variant qo'shildi. */
    q('01', "Shkalani o'qing", '🟢', 'd06-read-250', 'choice', '📏', 0,
      {
        e: "Son o'qi", s: "Shkalada katta belgi 200 da turibdi. Har kichik belgi — bitta o'nlik.",
        a: "Strelka qaysi sonni ko'rsatyapti?",
        o: ['250', '240', '205', '2050'],
        y: "200 dan o'nliklab sanaymiz: 210, 220, 230, 240, 250 — strelka 250 da.",
        n: "Katta belgidan strelkagacha kichik belgilarni sanang. Har kichik belgi — o'nlik.",
        by: [
          undefined,
          "Bitta belgini kam sanadingiz. 200 dan strelkagacha nechta kichik belgi bor?",
          "Kichik belgi birlik emas, O'NLIK. Beshta o'nlik qancha bo'ladi?",
          "Bu to'rt xonali son. Shkala 200 dan 300 gacha, javob shu oraliqda bo'lishi kerak.",
        ],
        r: "Son o'qida katta belgi — yuzlik, kichik belgi — o'nlik.",
      },
      {
        e: 'Числовая ось', s: 'На шкале большая метка стоит на 200. Каждая маленькая метка — один десяток.',
        a: 'Какое число показывает стрелка?',
        o: ['250', '240', '205', '2050'],
        y: 'От 200 считаем десятками: 210, 220, 230, 240, 250 — стрелка на 250.',
        n: 'Посчитай маленькие метки от большой метки до стрелки. Каждая метка — десяток.',
        by: [
          undefined,
          'Ты не досчитал одну метку. Сколько маленьких меток от 200 до стрелки?',
          'Маленькая метка — не единица, а ДЕСЯТОК. Сколько будет пять десятков?',
          'Это четырёхзначное число. Шкала идёт от 200 до 300, ответ должен быть в этом промежутке.',
        ],
        r: 'На числовой оси большая метка — сотня, маленькая — десяток.',
      }, undefined, {
        en: {
          e: 'The number line', s: 'On the scale the big mark stands at 200. Every small mark is one ten.',
          a: 'Which number is the arrow pointing at?',
          o: ['250', '240', '205', '2050'],
          y: 'From 200 we count in tens: 210, 220, 230, 240, 250 — the arrow is at 250.',
          n: 'Count the small marks from the big mark up to the arrow. Every mark is a ten.',
          by: [
            undefined,
            'You stopped one mark too early. How many small marks are there from 200 to the arrow?',
            'A small mark is not a one, it is a TEN. How much is five tens?',
            'That is a four-digit number. The scale runs from 200 to 300, so the answer must be inside.',
          ],
          r: 'On the number line a big mark is a hundred and a small one is a ten.',
        },
        art: { line: { from: 200, to: 300, values: [250] } },
      }),

    /* 2 · match · 🟢 — nuqta va son. Eski D06_07 (match_points). */
    q('02', "O'qdagi nuqtalar", '🟢', 'd06-match-points', 'match', '📍', [0, 1, 2],
      {
        e: "Nuqtalar", s: "O'qda 200 dan 300 gacha uchta nuqta belgilangan.",
        a: 'Har nuqtani uning soniga ulang.',
        left: ['Chap chet', "O'rta", "O'ng chet"],
        right: ['205', '250', '295'],
        y: "205 — 200 dan sal keyin, 250 — aynan o'rtada, 295 — 300 dan sal oldin.",
        n: "Nuqtaning joyi sonni aytib beradi: chap chetga yaqin — kichik, o'ng chetga yaqin — katta.",
        r: "O'qdagi joy sonni aytib beradi: chapda kichik, o'ngda katta sonlar.",
      },
      {
        e: 'Точки', s: 'На оси от 200 до 300 отмечены три точки.',
        a: 'Соедини каждую точку с её числом.',
        left: ['Левый край', 'Середина', 'Правый край'],
        right: ['205', '250', '295'],
        y: '205 — чуть после 200, 250 — ровно посередине, 295 — чуть до 300.',
        n: 'Место точки подсказывает число: ближе к левому краю — меньше, ближе к правому — больше.',
        r: 'Место на оси подсказывает число: слева маленькие, справа большие.',
      }, undefined, {
        en: {
          e: 'The points', s: 'Three points are marked on the line from 200 to 300.',
          a: 'Connect each point with its number.',
          left: ['The left edge', 'The middle', 'The right edge'],
          right: ['205', '250', '295'],
          y: '205 is just after 200, 250 is exactly in the middle, 295 is just before 300.',
          n: 'The spot of a point hints at the number: closer to the left edge means smaller, closer to the right means larger.',
          r: 'The spot on the line hints at the number: small ones on the left, large ones on the right.',
        },
        art: { line: { from: 200, to: 300, values: [205, 250, 295] } },
      }),

    /* 3 · input · 🟢 — oraliqdagi yumaloq son. Eski D06_03 (between_round). */
    q('03', 'Oraliqdagi yumaloq son', '🟢', 'd06-between-round', 'input', '⭕', ['250'],
      {
        e: 'Yumaloq son', s: "246 bilan 256 orasida bitta yumaloq o'nlik yashiringan.",
        a: "246 bilan 256 orasidagi yumaloq o'nlikni yozing.",
        y: "250: u 246 dan katta, 256 dan kichik va nol bilan tugaydi.",
        n: "246 dan bittalab sanang: 247, 248, 249... Qaysi son nol bilan tugaydi?",
        r: "246 < 250 < 256 — oraliqda yotgan yumaloq o'nlik.",
        p: 'Javob',
      },
      {
        e: 'Круглое число', s: 'Между 246 и 256 спрятался один круглый десяток.',
        a: 'Запиши круглый десяток, который стоит между 246 и 256.',
        y: '250: он больше 246, меньше 256 и заканчивается нулём.',
        n: 'Считай от 246 по одному: 247, 248, 249... Какое число заканчивается нулём?',
        r: '246 < 250 < 256 — круглый десяток, лежащий в промежутке.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'A round number', s: 'One round ten is hiding between 246 and 256.',
          a: 'Write the round ten that stands between 246 and 256.',
          y: '250: it is greater than 246, less than 256 and it ends with a zero.',
          n: 'Count on from 246 one by one: 247, 248, 249 and so on. Which number ends with a zero?',
          r: '246 < 250 < 256 — the round ten that lies inside the gap.',
          p: 'Answer',
        },
      }),

    /* 4 · order · 🟡 — o'qdagi tartib. Eski D06_10 (line_order). */
    q('04', "O'qdagi tartib", '🟡', 'd06-line-order', 'order', '➡️', [1, 2, 0],
      {
        e: "Chapdan o'ngga", s: "Uchta son o'qda o'z joyida turadi, lekin kartalar aralashib ketgan.",
        a: "Kartalarni o'qdagi tartibda tanlang: avval eng chapdagisi.",
        o: ['256', '242', '250'],
        y: "O'qda chapdan o'ngga: 242, 250, 256 — kichikdan kattaga.",
        n: "O'qda chapda eng kichik son turadi. Yuzliklar teng — o'nliklarni solishtiring.",
        r: "Son o'qida chapdan o'ngga sonlar o'sib boradi.",
      },
      {
        e: 'Слева направо', s: 'Три числа стоят на оси каждое на своём месте, но карточки перемешались.',
        a: 'Выбери карточки в порядке оси: сначала самая левая.',
        o: ['256', '242', '250'],
        y: 'На оси слева направо: 242, 250, 256 — от меньшего к большему.',
        n: 'Слева на оси стоит самое маленькое число. Сотни равны — сравнивай десятки.',
        r: 'На числовой оси слева направо числа растут.',
      }, undefined, {
        en: {
          e: 'From left to right', s: 'Three numbers each have their own spot on the line, but the cards got mixed up.',
          a: 'Pick the cards in the order of the line: the leftmost one first.',
          o: ['256', '242', '250'],
          y: 'On the line from left to right: 242, 250, 256 — from the smallest to the largest.',
          n: 'The smallest number stands on the left of the line. The hundreds are equal, so compare the tens.',
          r: 'Along the number line the numbers grow from left to right.',
        },
        optionArt: [{ plate: '256' }, { plate: '242' }, { plate: '250' }],
        art: { line: { from: 240, to: 260, values: [242, 250, 256] } },
      }),

    /* 5 · dnd · 🟡 — chap yoki o'ng. Eski D06_05 (line_direction). */
    q('05', 'Qaysi tomonda?', '🟡', 'd06-direction', 'dnd', '↔️', [0, 1, 1, 0],
      {
        e: "250 dan qaysi tomonda?", s: "O'qda 250 belgilangan. To'rt son shu belgidan chapda yoki o'ngda yotadi.",
        a: "Sonlarni ajrating: qaysilari 250 dan chapda, qaysilari o'ngda turadi.",
        tokens: ['230', '280', '255', '195'],
        zones: ['250 dan chapda', "250 dan o'ngda"],
        dndHint: 'Sonlar tugadi.',
        y: "230 va 195 — 250 dan kichik, demak chapda. 280 va 255 — katta, demak o'ngda.",
        n: "Chapda — 250 dan KICHIK sonlar. Har sonni 250 bilan solishtiring.",
        r: "O'qda chap tomon — kichik sonlar, o'ng tomon — katta sonlar.",
      },
      {
        e: 'С какой стороны от 250?', s: 'На оси отмечено 250. Четыре числа лежат левее или правее этой метки.',
        a: 'Разложи числа: какие стоят левее 250, а какие правее.',
        tokens: ['230', '280', '255', '195'],
        zones: ['Левее 250', 'Правее 250'],
        dndHint: 'Числа закончились.',
        y: '230 и 195 меньше 250, значит слева. 280 и 255 больше, значит справа.',
        n: 'Слева — числа МЕНЬШЕ 250. Сравни каждое число с 250.',
        r: 'На оси слева маленькие числа, справа большие.',
      }, undefined, {
        en: {
          e: 'Which side of 250?', s: 'The line has 250 marked. Four numbers lie to the left or to the right of that mark.',
          a: 'Sort the numbers: which ones stand to the left of 250 and which to the right.',
          tokens: ['230', '280', '255', '195'],
          zones: ['Left of 250', 'Right of 250'],
          dndHint: 'No numbers left.',
          y: '230 and 195 are less than 250, so they go left. 280 and 255 are greater, so they go right.',
          n: 'On the left are the numbers LESS than 250. Compare every number with 250.',
          r: 'On the line the small numbers are on the left and the large ones on the right.',
        },
        tokenArt: [{ plate: '230' }, { plate: '280' }, { plate: '255' }, { plate: '195' }],
        art: { line: { from: 190, to: 290, values: [250] } },
      }),

    /* 6 · order · 🟡 — qadamlab yurish. Eski D06_06 (line_step). */
    q('06', "O'ngga yurish", '🟡', 'd06-steps', 'order', '👣', [2, 1, 0, 3],
      {
        e: 'Qadam sayin', s: "Strelka 280 dan boshlab o'ngga o'nliklab yuradi.",
        a: 'Strelka bosib o\'tadigan sonlarni tartib bilan tanlang.',
        o: ['300', '290', '280', '310'],
        y: '280, 290, 300, 310: har qadam — bitta o\'nlik. 290 dan keyin o\'nliklar to\'lib yangi yuzlik boshlanadi.',
        n: "O'ngga yurish — qo'shish. 280 ga 10 ni qo'shing, keyin yana 10 ni.",
        r: "O'qda o'ngga yurish — qo'shish: 280 + 10 = 290, 290 + 10 = 300.",
      },
      {
        e: 'Шаг за шагом', s: 'Стрелка идёт вправо от 280 десятками.',
        a: 'Выбери по порядку числа, через которые пройдёт стрелка.',
        o: ['300', '290', '280', '310'],
        y: '280, 290, 300, 310: каждый шаг — один десяток. После 290 десятки заполняются и начинается новая сотня.',
        n: 'Идти вправо — значит прибавлять. Прибавь к 280 десять, потом ещё десять.',
        r: 'Движение вправо по оси — это сложение: 280 + 10 = 290, 290 + 10 = 300.',
      }, undefined, {
        en: {
          e: 'Step by step', s: 'The arrow moves right from 280 in tens.',
          a: 'Pick the numbers the arrow passes through, in order.',
          o: ['300', '290', '280', '310'],
          y: '280, 290, 300, 310: every step is one ten. After 290 the tens are full and a new hundred starts.',
          n: 'Moving right means adding. Add ten to 280, then another ten.',
          r: 'Moving right along the line is addition: 280 + 10 = 290, 290 + 10 = 300.',
        },
        optionArt: [{ plate: '300' }, { plate: '290' }, { plate: '280' }, { plate: '310' }],
        art: { line: { from: 280, to: 310, values: [290, 300] } },
      }),

    /* 7 · multi · 🟡 — oraliqqa tushadigan sonlar. Eski D06_08 (interval_member). */
    q('07', 'Oraliqda yotadi', '🟡', 'd06-interval', 'multi', '🚧', [0, 2, 3],
      {
        e: 'Oraliq', s: "400 dan 500 gacha oraliqni olamiz.",
        a: 'Qaysi sonlar shu oraliqda yotadi? Hammasini belgilang.',
        o: ['470', '370', '405', '499'],
        y: '470, 405 va 499 — hammasi 400 dan katta va 500 dan kichik. 370 esa 400 dan oldin.',
        n: "Oraliqdagi son 400 dan katta VA 500 dan kichik bo'lishi kerak. Har sonning yuzligiga qarang.",
        r: 'Oraliqdagi son ikkala chegara orasida bo\'ladi: 400 < son < 500.',
      },
      {
        e: 'Промежуток', s: 'Возьмём участок от 400 до 500.',
        a: 'Какие числа лежат в этом промежутке? Отметь все.',
        o: ['470', '370', '405', '499'],
        y: '470, 405 и 499 — все больше 400 и меньше 500. А 370 стоит до 400.',
        n: 'Число в промежутке должно быть больше 400 И меньше 500. Смотри на сотни каждого числа.',
        r: 'Число в промежутке лежит между обеими границами: 400 < число < 500.',
      }, undefined, {
        en: {
          e: 'The stretch', s: 'Let us take the stretch from 400 to 500.',
          a: 'Which numbers lie inside this stretch? Mark them all.',
          o: ['470', '370', '405', '499'],
          y: '470, 405 and 499 are all greater than 400 and less than 500. And 370 stands before 400.',
          n: 'A number inside the stretch has to be greater than 400 AND less than 500. Look at the hundreds of each number.',
          r: 'A number inside a stretch lies between both borders: 400 < the number < 500.',
        },
        optionArt: [{ plate: '470' }, { plate: '370' }, { plate: '405' }, { plate: '499' }],
        art: { line: { from: 400, to: 500, values: [405, 470, 499] } },
      }),

    /* 8 · input · 🔴 — orada nechta son. Eski D06_09 (count_between). */
    q('08', 'Orada nechta son?', '🔴', 'd06-count-between', 'input', '🔢', ['9'],
      {
        e: 'Sanash', s: "246 bilan 256 — ikki chegara. Ular orasidagi sonlarni sanaymiz.",
        a: '246 bilan 256 ORASIDA nechta son bor?',
        y: '247, 248, 249, 250, 251, 252, 253, 254, 255 — jami 9 ta son.',
        n: "247 dan 255 gacha sanab chiqing. Chetki sonlar 246 va 256 sanalmaydi.",
        r: "Ikki son orasidagi sonlar chetlarisiz sanaladi: 246 bilan 256 orasida 9 ta son.",
        p: 'Javob',
      },
      {
        e: 'Счёт', s: 'Число 246 и число 256 — две границы. Считаем числа между ними.',
        a: 'Сколько чисел стоит МЕЖДУ 246 и 256?',
        y: '247, 248, 249, 250, 251, 252, 253, 254, 255 — всего 9 чисел.',
        n: 'Посчитай от 247 до 255. Сами границы 246 и 256 не считаются.',
        r: 'Числа между двумя числами считают без самих границ: между 246 и 256 их 9.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Counting', s: 'The numbers 246 and 256 are two borders. We count the numbers between them.',
          a: 'How many numbers stand BETWEEN 246 and 256?',
          y: '247, 248, 249, 250, 251, 252, 253, 254, 255 — nine numbers in all.',
          n: 'Count from 247 up to 255. The borders 246 and 256 do not count themselves.',
          r: 'Numbers between two numbers are counted without the borders: there are 9 between 246 and 256.',
          p: 'Answer',
        },
      }),

    /* 9 · choice · 🔴 — shkala yangi joyda. Eski D06_04 (line_read2), 4-chi variant. */
    q('09', 'Yangi shkala', '🔴', 'd06-read-470', 'choice', '🧭', 0,
      {
        e: "Boshqa shkala", s: "Endi katta belgi 400 da. Kichik belgilar avvalgidek o'nliklar.",
        a: "Strelka qaysi sonni ko'rsatyapti?",
        o: ['470', '480', '407', '4070'],
        y: "400 dan o'nliklab sanaymiz: 410, 420, 430, 440, 450, 460, 470 — strelka 470 da.",
        n: "Kichik belgi birlik emas, o'nlik. Katta belgidan boshlab sanang.",
        by: [
          undefined,
          "Bitta belgini ortiqcha sanadingiz. Strelkagacha nechta kichik belgi bor?",
          "Kichik belgi o'nlikni bildiradi, birlikni emas. Yettita o'nlik qancha?",
          "Bu to'rt xonali son. Shkala 400 dan 500 gacha, javob shu oraliqda bo'lsin.",
        ],
        r: "Son o'qida katta belgi — yuzlik, kichik belgi — o'nlik.",
      },
      {
        e: 'Другая шкала', s: 'Теперь большая метка на 400. Маленькие метки, как и раньше, десятки.',
        a: 'Какое число показывает стрелка?',
        o: ['470', '480', '407', '4070'],
        y: 'От 400 считаем десятками: 410, 420, 430, 440, 450, 460, 470 — стрелка на 470.',
        n: 'Маленькая метка — не единица, а десяток. Считай от большой метки.',
        by: [
          undefined,
          'Ты посчитал на одну метку больше. Сколько маленьких меток до стрелки?',
          'Маленькая метка означает десяток, а не единицу. Сколько это — семь десятков?',
          'Это четырёхзначное число. Шкала идёт от 400 до 500, ответ должен быть внутри.',
        ],
        r: 'На числовой оси большая метка — сотня, маленькая — десяток.',
      }, undefined, {
        en: {
          e: 'A different scale', s: 'Now the big mark is at 400. The small marks are tens, just like before.',
          a: 'Which number is the arrow pointing at?',
          o: ['470', '480', '407', '4070'],
          y: 'From 400 we count in tens: 410, 420, 430, 440, 450, 460, 470 — the arrow is at 470.',
          n: 'A small mark is not a one, it is a ten. Count from the big mark.',
          by: [
            undefined,
            'You counted one mark too many. How many small marks are there up to the arrow?',
            'A small mark means a ten, not a one. How much is seven tens?',
            'That is a four-digit number. The scale runs from 400 to 500, so the answer must be inside.',
          ],
          r: 'On the number line a big mark is a hundred and a small one is a ten.',
        },
        art: { line: { from: 400, to: 500, values: [470] } },
      }),

    /* 10 · dnd · 🔴 — oraliqlarga taqsimlash. Eski D06_02 (numline_between20). */
    q('10', 'Qaysi oraliqqa?', '🔴', 'd06-sort-intervals', 'dnd', '🚀', [0, 1, 0, 1],
      {
        e: 'Yakuniy mashq', s: "O'q ikki oraliqqa bo'lingan: 240 dan 260 gacha va 260 dan 280 gacha.",
        a: 'Sonlarni ajrating: qaysilari 240 bilan 260 orasida, qaysilari 260 bilan 280 orasida.',
        tokens: ['242', '265', '258', '279'],
        zones: ['240 va 260 orasida', '260 va 280 orasida'],
        dndHint: 'Sonlar tugadi.',
        y: '242 va 258 — birinchi oraliqda. 265 va 279 — ikkinchisida, chunki ular 260 dan katta.',
        n: 'Har sonni 260 bilan solishtiring: kichikmi yoki kattami?',
        r: "Oraliqni chegaralar belgilaydi: 240 < 242 < 260, 260 < 265 < 280.",
      },
      {
        e: 'Итоговое задание', s: 'Ось разделена на два промежутка: от 240 до 260 и от 260 до 280.',
        a: 'Разложи числа: какие между 240 и 260, а какие между 260 и 280.',
        tokens: ['242', '265', '258', '279'],
        zones: ['Между 240 и 260', 'Между 260 и 280'],
        dndHint: 'Числа закончились.',
        y: '242 и 258 — в первом промежутке. 265 и 279 — во втором, они больше 260.',
        n: 'Сравни каждое число с 260: меньше оно или больше?',
        r: 'Промежуток задаётся границами: 240 < 242 < 260, 260 < 265 < 280.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'The line is split into two stretches: from 240 to 260 and from 260 to 280.',
          a: 'Sort the numbers: which ones are between 240 and 260 and which between 260 and 280.',
          tokens: ['242', '265', '258', '279'],
          zones: ['Between 240 and 260', 'Between 260 and 280'],
          dndHint: 'No numbers left.',
          y: '242 and 258 are in the first stretch. 265 and 279 are in the second, they are greater than 260.',
          n: 'Compare every number with 260: is it less or greater?',
          r: 'A stretch is set by its borders: 240 < 242 < 260, 260 < 265 < 280.',
        },
        tokenArt: [{ plate: '242' }, { plate: '265' }, { plate: '258' }, { plate: '279' }],
        art: { line: { from: 240, to: 280, values: [242, 258, 265, 279] } },
      }),
  ],
};

export default DARS06_BANK;
