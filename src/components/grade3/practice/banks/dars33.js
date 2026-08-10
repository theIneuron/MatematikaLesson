// Dars 33 amaliyoti — Perimetr.
// Nazariya: src/components/grade3/Dars33.jsx (num-3-33).
// Perimetr — shakl chekkasi bo'ylab yo'l: hamma tomon uzunliklarining yig'indisi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 input · 3 multi · 4 match · 5 input · 6 dnd · 7 order · 8 choice · 9 dnd · 10 choice
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS33_BANK = {
  title: 'Dars 33 · Perimetr',
  items: [

    /* 1 · order · 🟢 — chekka bo'ylab yurish. */
    q('01', 'Chekka bo\'ylab', '🟢', 'd33-walk', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "Tomonlari 5 m va 3 m bo'lgan panelni tasma bilan o'raymiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Perimetr 16 metr', 'Chekka bo\'ylab hamma tomonni topaman', 'Hammasini qo\'shaman: 5 va 3 va 5 va 3'],
        y: "Avval tomonlarni topamiz, keyin ularni qo'shamiz, oxirida javobni yozamiz.",
        n: 'Qo\'shishdan oldin nima kerak?',
        r: 'Perimetr bu hamma tomon uzunliklarining yig\'indisi.',
      },
      {
        e: 'Три шага', s: 'Панель со сторонами 5 м и 3 м обматываем лентой.',
        a: 'Выбери шаги по порядку.',
        o: ['Периметр 16 метров', 'Нахожу все стороны по краю', 'Складываю всё: 5 и 3 и 5 и 3'],
        y: 'Сначала находим стороны, потом складываем их, в конце пишем ответ.',
        n: 'Что нужно до сложения?',
        r: 'Периметр это сумма длин всех сторон.',
      }, undefined, {
        en: {
          e: 'Three steps', s: 'We wrap tape around a panel with sides of 5 m and 3 m.',
          a: 'Pick the steps in order.',
          o: ['The perimeter is 16 metres', 'I find all the sides along the edge', 'I add them all up: 5 and 3 and 5 and 3'],
          y: 'First we find the sides, then we add them up, and at the end we write the answer.',
          n: 'What is needed before the adding?',
          r: 'The perimeter is the sum of the lengths of all the sides.',
        },
      }),

    /* 2 · input · 🟢 — to'rtburchak perimetri. */
    q('02', 'To\'rtburchak', '🟢', 'd33-rect', 'input', '🔢', ['20'],
      {
        e: 'Oddiy hisob', s: "To'rtburchakning uzunligi 7 m, eni 3 m.",
        a: 'Perimetri necha metr?',
        y: '7 va 3 va 7 va 3 ni qo\'shsak, 20 metr chiqadi.',
        n: 'To\'rtburchakda tomonlar to\'rtta: qarama-qarshilari teng.',
        r: 'To\'rtburchakning qarama-qarshi tomonlari teng.',
        p: 'Javob',
      },
      {
        e: 'Простой счёт', s: 'Длина прямоугольника 7 м, ширина 3 м.',
        a: 'Чему равен периметр в метрах?',
        y: 'Складываем 7 и 3 и 7 и 3, получается 20 метров.',
        n: 'У прямоугольника четыре стороны: противоположные равны.',
        r: 'У прямоугольника противоположные стороны равны.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'An easy count', s: 'A rectangle is 7 m long and 3 m wide.',
          a: 'How many metres is the perimeter?',
          y: 'We add 7 and 3 and 7 and 3 and get 20 metres.',
          n: 'A rectangle has four sides: the opposite ones are equal.',
          r: 'In a rectangle the opposite sides are equal.',
          p: 'Answer',
        },
      }),

    /* 3 · multi · 🟢 — perimetr nima. */
    q('03', 'Perimetr nima?', '🟢', 'd33-what', 'multi', '🎯', [0, 2],
      {
        e: 'Ta\'rifni aniqlaymiz', s: "To'rtta gap. Ikkitasi perimetr haqida to'g'ri.",
        a: 'Qaysi gaplar to\'g\'ri? Hammasini belgilang.',
        o: [
          'Perimetr bu chekka bo\'ylab yo\'l',
          'Perimetr bu shakl ichidagi kataklar soni',
          'Perimetr hamma tomon uzunliklarining yig\'indisi',
          'Perimetr bu eng uzun tomon',
        ],
        y: "Perimetr chekkadan o'tadi va hamma tomonlarning yig'indisiga teng.",
        n: 'Perimetr shaklning ichida boradimi yoki chekkasidan?',
        r: 'Perimetr bu chekka bo\'ylab yo\'l, ichkaridagi narsa emas.',
      },
      {
        e: 'Уточняем определение', s: 'Четыре утверждения. Два из них верны про периметр.',
        a: 'Какие утверждения верны? Отметь все.',
        o: [
          'Периметр это путь по краю',
          'Периметр это число клеток внутри фигуры',
          'Периметр это сумма длин всех сторон',
          'Периметр это самая длинная сторона',
        ],
        y: 'Периметр идёт по краю и равен сумме всех сторон.',
        n: 'Периметр проходит внутри фигуры или по её краю?',
        r: 'Периметр это путь по краю, а не то, что внутри.',
      }, undefined, {
        en: {
          e: 'Sharpen the definition', s: 'Four statements. Two of them are true about the perimeter.',
          a: 'Which statements are true? Mark them all.',
          o: ['The perimeter is the path along the edge', 'The perimeter is the number of cells inside a shape', 'The perimeter is the sum of the lengths of all the sides', 'The perimeter is the longest side'],
          y: 'The perimeter runs along the edge and equals the sum of all the sides.',
          n: 'Does the perimeter run inside a shape or along its edge?',
          r: 'The perimeter is the path along the edge, not what is inside.',
        },
      }),

    /* 4 · match · 🟡 — shakl va perimetr. */
    q('04', 'Shakl va perimetr', '🟡', 'd33-match-shape', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch to\'rtburchak', s: 'Har birining uzunligi va eni berilgan.',
        a: 'Har shaklni uning perimetriga ulang.',
        left: ['4 m va 2 m', '5 m va 5 m', '6 m va 3 m'],
        right: ['12 m', '20 m', '18 m'],
        y: '4+2+4+2 = 12, 5+5+5+5 = 20, 6+3+6+3 = 18.',
        n: 'Har shaklda to\'rtta tomonni qo\'shing.',
        r: 'Perimetr hamma tomonlarning yig\'indisi.',
      },
      {
        e: 'Три прямоугольника', s: 'У каждого даны длина и ширина.',
        a: 'Соедини каждую фигуру с её периметром.',
        left: ['4 м и 2 м', '5 м и 5 м', '6 м и 3 м'],
        right: ['12 м', '20 м', '18 м'],
        y: '4+2+4+2 = 12, 5+5+5+5 = 20, 6+3+6+3 = 18.',
        n: 'В каждой фигуре сложи четыре стороны.',
        r: 'Периметр это сумма всех сторон.',
      }, undefined, {
        en: {
          e: 'Three rectangles', s: 'Each one is given by its length and width.',
          a: 'Connect each shape with its perimeter.',
          left: ['4 m and 2 m', '5 m and 5 m', '6 m and 3 m'],
          right: ['12 m', '20 m', '18 m'],
          y: '4+2+4+2 = 12, 5+5+5+5 = 20, 6+3+6+3 = 18.',
          n: 'For every shape add up the four sides.',
          r: 'The perimeter is the sum of all the sides.',
        },
      }),

    /* 5 · input · 🟡 — yo'qolgan tomon. */
    q('05', 'Yo\'qolgan tomon', '🟡', 'd33-missing-side', 'input', '🧩', ['4'],
      {
        e: 'Teskari masala', s: "To'rtburchakning perimetri 18 m, uzunligi 5 m.",
        a: 'Eni necha metr?',
        y: "Ikkita uzunlik 10 metr. 18 dan 10 ni ayirsak 8, uni ikkiga bo'lsak 4 metr chiqadi.",
        n: 'Avval ikkita uzunlikni perimetrdan ayiring, keyin qolganini ikkiga bo\'ling.',
        r: 'Perimetrdan ma\'lum tomonlarni ayirib, qolganini topamiz.',
        p: 'Javob',
      },
      {
        e: 'Обратная задача', s: 'Периметр прямоугольника 18 м, длина 5 м.',
        a: 'Чему равна ширина в метрах?',
        y: 'Две длины это 10 метров. Из 18 вычитаем 10, получаем 8, делим на два, выходит 4 метра.',
        n: 'Сначала вычти из периметра две длины, потом раздели остаток на два.',
        r: 'Из периметра вычитают известные стороны и находят остальные.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The problem in reverse', s: 'A rectangle has a perimeter of 18 m and a length of 5 m.',
          a: 'How many metres is the width?',
          y: 'Two lengths are 10 metres. We subtract 10 from 18 and get 8, then divide by two and get 4 metres.',
          n: 'Subtract the two lengths from the perimeter first, then divide what is left by two.',
          r: 'The known sides are subtracted from the perimeter and the rest are found.',
          p: 'Answer',
        },
      }),

    /* 6 · dnd · 🟡 — perimetr 12 mi. */
    q('06', 'Perimetr 12 mi?', '🟡', 'd33-is12', 'dnd', '🎯', [0, 1, 0, 1],
      {
        e: 'Tekshiring', s: "To'rtta to'rtburchak. Ikkitasining perimetri 12 m.",
        a: 'Shakllarni ajrating: qaysilarining perimetri 12 m, qaysilariniki boshqa.',
        tokens: ['4 m va 2 m', '4 m va 3 m', '3 m va 3 m', '5 m va 2 m'],
        zones: ['Perimetr 12 m', 'Perimetr boshqa'],
        dndHint: 'Shakllar tugadi.',
        y: '4+2+4+2 = 12 va 3+3+3+3 = 12. Qolganlari 14 va 14 beradi.',
        n: 'Uzunlik va enni qo\'shib, natijani ikkiga ko\'paytiring.',
        r: 'Perimetr uzunlik va en yig\'indisining ikki barobari.',
      },
      {
        e: 'Проверь', s: 'Четыре прямоугольника. У двух периметр 12 м.',
        a: 'Разложи фигуры: у каких периметр 12 м, а у каких другой.',
        tokens: ['4 м и 2 м', '4 м и 3 м', '3 м и 3 м', '5 м и 2 м'],
        zones: ['Периметр 12 м', 'Периметр другой'],
        dndHint: 'Фигуры закончились.',
        y: '4+2+4+2 = 12 и 3+3+3+3 = 12. Остальные дают 14 и 14.',
        n: 'Сложи длину и ширину, а результат умножь на два.',
        r: 'Периметр это удвоенная сумма длины и ширины.',
      }, undefined, {
        en: {
          e: 'Check them', s: 'Four rectangles. Two of them have a perimeter of 12 m.',
          a: 'Sort the shapes: which ones have a perimeter of 12 m and which have a different one.',
          tokens: ['4 m and 2 m', '4 m and 3 m', '3 m and 3 m', '5 m and 2 m'],
          zones: ['Perimeter 12 m', 'A different perimeter'],
          dndHint: 'No shapes left.',
          y: '4+2+4+2 = 12 and 3+3+3+3 = 12. The others give 14 and 14.',
          n: 'Add the length and the width and multiply the result by two.',
          r: 'The perimeter is twice the sum of the length and the width.',
        },
      }),

    /* 7 · order · 🟡 — perimetr bo'yicha tartib. */
    q('07', 'Kichigidan kattasiga', '🟡', 'd33-sort', 'order', '📈', [2, 0, 3, 1],
      {
        e: 'To\'rt shakl', s: 'Har birining tomonlari berilgan.',
        a: 'Shakllarni perimetri bo\'yicha kichigidan kattasiga tartiblang.',
        o: ['3 m va 3 m', '7 m va 4 m', '2 m va 2 m', '6 m va 2 m'],
        y: '2+2+2+2 = 8, keyin 12, keyin 16, oxirida 22.',
        n: 'Har shaklning perimetrini hisoblang, keyin solishtiring.',
        r: 'Solishtirishdan oldin hammasini bir xil kattalikka aylantiramiz.',
      },
      {
        e: 'Четыре фигуры', s: 'У каждой даны стороны.',
        a: 'Расставь фигуры по периметру от меньшего к большему.',
        o: ['3 м и 3 м', '7 м и 4 м', '2 м и 2 м', '6 м и 2 м'],
        y: '2+2+2+2 = 8, потом 12, потом 16, в конце 22.',
        n: 'Посчитай периметр каждой фигуры, потом сравни.',
        r: 'Перед сравнением всё приводят к одной величине.',
      }, undefined, {
        en: {
          e: 'Four shapes', s: 'Each one is given by its sides.',
          a: 'Put the shapes in order of their perimeter, from the smallest to the largest.',
          o: ['3 m and 3 m', '7 m and 4 m', '2 m and 2 m', '6 m and 2 m'],
          y: '2+2+2+2 = 8, then 12, then 16, and 22 at the end.',
          n: 'Work out the perimeter of every shape, then compare them.',
          r: 'Before comparing, everything is brought to one and the same measure.',
        },
      }),

    /* 8 · choice · 🔴 — kvadrat perimetri. */
    q('08', 'Kvadrat', '🔴', 'd33-square', 'choice', '🔒', 2,
      {
        e: 'Hamma tomon teng', s: "Kvadratning perimetri 24 m.",
        a: 'Bitta tomoni necha metr?',
        o: ['12', '8', '6', '4'],
        y: "Kvadratda to'rtta teng tomon bor. 24 ni 4 ga bo'lsak, 6 metr chiqadi.",
        n: 'Kvadratda nechta teng tomon bor?',
        by: [
          "Bu perimetrning yarmi, ya'ni ikkita tomon.",
          "24 ni 3 ga bo'lgansiz. Kvadratda esa to'rtta tomon.",
          undefined,
          "24 ni 6 ga bo'lgansiz. Tomonlar soni boshqa.",
        ],
        r: "Kvadratning to'rtta tomoni teng, shuning uchun perimetr 4 ga bo'linadi.",
      },
      {
        e: 'Все стороны равны', s: 'Периметр квадрата 24 м.',
        a: 'Чему равна одна сторона в метрах?',
        o: ['12', '8', '6', '4'],
        y: 'У квадрата четыре равные стороны. Делим 24 на 4, получается 6 метров.',
        n: 'Сколько равных сторон у квадрата?',
        by: [
          'Это половина периметра, то есть две стороны.',
          'Ты разделил 24 на 3. А у квадрата четыре стороны.',
          undefined,
          'Ты разделил 24 на 6. Число сторон другое.',
        ],
        r: 'У квадрата четыре равные стороны, поэтому периметр делят на 4.',
      }, undefined, {
        en: {
          e: 'All the sides are equal', s: 'A square has a perimeter of 24 m.',
          a: 'How many metres is one side?',
          o: ['12', '8', '6', '4'],
          y: 'A square has four equal sides. We divide 24 by 4 and get 6 metres.',
          n: 'How many equal sides does a square have?',
          by: [
            'That is half the perimeter, which is two sides.',
            'You divided 24 by 3. But a square has four sides.',
            undefined,
            'You divided 24 by 6. The number of sides is different.',
          ],
          r: 'A square has four equal sides, so the perimeter is divided by 4.',
        },
      }),

    /* 9 · dnd · 🔴 — perimetr yoki boshqa kattalik. */
    q('09', 'Perimetr kerakmi?', '🔴', 'd33-need-perimeter', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Hayotdan', s: "To'rtta vaziyat. Ba'zilarida chekka bo'ylab o'lchash kerak.",
        a: 'Ishlarni ajrating: qayerda perimetr kerak, qayerda kerak emas.',
        tokens: [
          'Bog\' atrofiga panjara qo\'yish',
          'Xonaga gilam to\'shash',
          'Rasm chetiga ramka qilish',
          'Devorga bo\'yoq surtish',
        ],
        zones: ['Perimetr kerak', 'Perimetr kerak emas'],
        dndHint: 'Vaziyatlar tugadi.',
        y: "Panjara va ramka chekka bo'ylab boradi, gilam va bo'yoq esa ichkarini qoplaydi.",
        n: 'Bu narsa chekka bo\'ylab boradimi yoki ichkarini to\'ldiradimi?',
        r: 'Chekka bo\'ylab boradigan hamma narsa perimetr bilan hisoblanadi.',
      },
      {
        e: 'Из жизни', s: 'Четыре ситуации. В некоторых нужно мерить по краю.',
        a: 'Разложи дела: где нужен периметр, а где нет.',
        tokens: [
          'Поставить забор вокруг сада',
          'Постелить ковёр в комнате',
          'Сделать рамку по краю картины',
          'Покрасить стену',
        ],
        zones: ['Нужен периметр', 'Периметр не нужен'],
        dndHint: 'Ситуации закончились.',
        y: 'Забор и рамка идут по краю, а ковёр и краска закрывают внутреннее.',
        n: 'Эта вещь идёт по краю или заполняет внутреннее?',
        r: 'Всё, что идёт по краю, считают через периметр.',
      }, undefined, {
        en: {
          e: 'From real life', s: 'Four situations. In some of them you have to measure along the edge.',
          a: 'Sort the jobs: where the perimeter is needed and where it is not.',
          tokens: ['Put a fence around a garden', 'Lay a carpet in a room', 'Make a frame along the edge of a picture', 'Paint a wall'],
          zones: ['The perimeter is needed', 'The perimeter is not needed'],
          dndHint: 'No situations left.',
          y: 'A fence and a frame run along the edge, while a carpet and paint cover what is inside.',
          n: 'Does this thing run along the edge or fill what is inside?',
          r: 'Anything that runs along the edge is worked out through the perimeter.',
        },
      }),

    /* 10 · choice · 🔴 — masala. */
    q('10', 'Panjara masalasi', '🔴', 'd33-story', 'choice', '🚀', 1,
      {
        e: 'Yakuniy mashq', s: "Bog' to'rtburchak shaklida: uzunligi 9 m, eni 6 m. Atrofiga panjara qo'yiladi, bitta joyda 2 m darvoza qoldiriladi.",
        a: 'Necha metr panjara kerak?',
        o: ['30 m', '28 m', '15 m', '54 m'],
        y: "Perimetr 9+6+9+6 = 30 metr. Darvoza uchun 2 metr ayiriladi, 28 metr qoladi.",
        n: 'Avval to\'liq perimetrni toping, keyin darvozani ayiring.',
        by: [
          "Bu to'liq perimetr. Darvoza uchun 2 metrni ayirish unutilgan.",
          undefined,
          "Bu faqat uzunlik va en. Tomonlar esa to'rtta.",
          "Bu uzunlik bilan enni ko'paytirgani, u boshqa kattalik.",
        ],
        r: 'Perimetrdan ochiq qolgan qism ayiriladi.',
      },
      {
        e: 'Итоговое задание', s: 'Сад прямоугольный: длина 9 м, ширина 6 м. Вокруг ставят забор, в одном месте оставляют калитку 2 м.',
        a: 'Сколько метров забора нужно?',
        o: ['30 м', '28 м', '15 м', '54 м'],
        y: 'Периметр 9+6+9+6 = 30 метров. Вычитаем 2 метра на калитку, остаётся 28 метров.',
        n: 'Сначала найди полный периметр, потом вычти калитку.',
        by: [
          'Это полный периметр. Ты забыл вычесть 2 метра на калитку.',
          undefined,
          'Это только длина и ширина. А сторон четыре.',
          'Это произведение длины и ширины, а это другая величина.',
        ],
        r: 'Из периметра вычитают открытый участок.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'A garden is a rectangle: 9 m long and 6 m wide. A fence is put around it, with a 2 m gate left in one place.',
          a: 'How many metres of fence are needed?',
          o: ['30 m', '28 m', '15 m', '54 m'],
          y: 'The perimeter is 9+6+9+6 = 30 metres. We subtract 2 metres for the gate and 28 metres are left.',
          n: 'Find the full perimeter first, then subtract the gate.',
          by: [
            'That is the full perimeter. You forgot to subtract the 2 metres for the gate.',
            undefined,
            'That is only the length and the width. But there are four sides.',
            'That is the length multiplied by the width, and that is a different measure.',
          ],
          r: 'The open stretch is subtracted from the perimeter.',
        },
      }),
  ],
};

export default DARS33_BANK;
