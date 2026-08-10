// Dars 42 amaliyoti — Massa: gramm va kilogramm.
// Nazariya: src/components/grade3/Dars42.jsx (num-3-42).
// Massa ko'z bilan emas, tarozi bilan aniqlanadi (katta paxta qutisi kichik mix
// qutisidan yengil); 1 kg = 1000 g; qo'shish va ayirishdan oldin kattaliklar bitta
// o'lchovga keltiriladi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 input · 3 match · 4 dnd · 5 order · 6 choice · 7 multi · 8 input · 9 dnd · 10 choice
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS42_BANK = {
  title: 'Dars 42 · Massa: gramm va kilogramm',
  items: [

    /* 1 · match · 🟢 — narsa va o'lchov. */
    q('01', 'Qaysi o\'lchov?', '🟢', 'd42-match-unit', 'match', '🔗', [0, 1, 2],
      {
        e: 'O\'lchovni tanlang', s: "Yengil narsaga gramm, og'iriga kilogramm olinadi.",
        a: 'Har narsani unga mos massaga ulang.',
        left: ['Ruchka', 'Un qopi', 'Bir bo\'lak non'],
        right: ['10 gramm', '5 kilogramm', '400 gramm'],
        y: "Ruchka yengil — grammda. Un qopi og'ir — kilogrammda. Non oraliqda, uni ham grammda yozish qulay.",
        n: 'Narsa yengilmi yoki og\'irmi? O\'lchov shunga qarab tanlanadi.',
        r: 'O\'lchov narsaga qarab tanlanadi: yengilga gramm, og\'irga kilogramm.',
      },
      {
        e: 'Выбери мерку', s: 'Для лёгкого берут граммы, для тяжёлого килограммы.',
        a: 'Соедини каждый предмет с подходящей массой.',
        left: ['Ручка', 'Мешок муки', 'Кусок хлеба'],
        right: ['10 граммов', '5 килограммов', '400 граммов'],
        y: 'Ручка лёгкая — в граммах. Мешок муки тяжёлый — в килограммах. Хлеб посередине, его тоже удобно писать в граммах.',
        n: 'Предмет лёгкий или тяжёлый? От этого и зависит мерка.',
        r: 'Мерку выбирают по предмету: лёгкому граммы, тяжёлому килограммы.',
      }, undefined, {
        en: {
          e: 'Choose the measure', s: 'Light things are measured in grams, heavy ones in kilograms.',
          a: 'Connect each thing with the mass that fits it.',
          left: ['A pen', 'A sack of flour', 'A piece of bread'],
          right: ['10 grams', '5 kilograms', '400 grams'],
          y: 'A pen is light — grams. A sack of flour is heavy — kilograms. Bread is in between, and grams are handy for it too.',
          n: 'Is the thing light or heavy? That is what the measure depends on.',
          r: 'The measure is chosen by the thing: grams for light ones, kilograms for heavy ones.',
        },
      }),

    /* 2 · input · 🟢 — kilogrammda nechta gramm. */
    q('02', 'Kilogrammda nechta gramm?', '🟢', 'd42-kg-to-g', 'input', '🔢', ['1000'],
      {
        e: 'Ikki o\'lchov bog\'lanishi', s: "Gramm va kilogramm bir-biriga bog'langan.",
        a: 'Bitta kilogrammda nechta gramm bor?',
        y: "Bitta kilogrammda ming gramm bor. Shuning uchun 1 kg = 1000 g.",
        n: 'Yarim kilogramm besh yuz gramm. Demak butun kilogramm...',
        r: '1 kilogramm = 1000 gramm.',
        p: 'Javob',
      },
      {
        e: 'Связь двух мерок', s: 'Грамм и килограмм связаны между собой.',
        a: 'Сколько граммов в одном килограмме?',
        y: 'В одном килограмме тысяча граммов. Поэтому 1 кг = 1000 г.',
        n: 'Полкилограмма это пятьсот граммов. Значит целый килограмм...',
        r: '1 килограмм = 1000 граммов.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The link between the measures', s: 'The gram and the kilogram are linked to each other.',
          a: 'How many grams are there in one kilogram?',
          y: 'There are a thousand grams in one kilogram. That is why 1 kg = 1000 g.',
          n: 'Half a kilogram is five hundred grams. So a whole kilogram is...',
          r: '1 kilogram = 1000 grams.',
          p: 'Answer',
        },
      }),

    /* 3 · match · 🟢 — gramm va kilogramm. */
    q('03', 'Bir xil massa', '🟢', 'd42-match-equal', 'match', '⚖️', [0, 1, 2],
      {
        e: 'Ikki xil yozuv', s: "Bitta massani ikki xil o'lchovda yozish mumkin.",
        a: 'Har massani unga teng yozuvga ulang.',
        left: ['1 kg', '500 g', '2 kg'],
        right: ['1000 g', 'Kilogrammning yarmi', '2000 g'],
        y: "1 kg = 1000 g, 500 g bu kilogrammning yarmi, 2 kg = 2000 g.",
        n: 'Har kilogrammda ming gramm bor.',
        r: 'Kilogrammdan grammga o\'tishda 1000 ga ko\'paytiriladi.',
      },
      {
        e: 'Две записи', s: 'Одну и ту же массу можно записать в двух мерках.',
        a: 'Соедини каждую массу с равной ей записью.',
        left: ['1 кг', '500 г', '2 кг'],
        right: ['1000 г', 'Половина килограмма', '2000 г'],
        y: '1 кг = 1000 г, 500 г это половина килограмма, 2 кг = 2000 г.',
        n: 'В каждом килограмме тысяча граммов.',
        r: 'При переходе из килограммов в граммы умножают на 1000.',
      }, undefined, {
        en: {
          e: 'Two records', s: 'One and the same mass can be written in two measures.',
          a: 'Connect each mass with the record that equals it.',
          left: ['1 kg', '500 g', '2 kg'],
          right: ['1000 g', 'Half a kilogram', '2000 g'],
          y: '1 kg = 1000 g, 500 g is half a kilogram, 2 kg = 2000 g.',
          n: 'Every kilogram has a thousand grams in it.',
          r: 'Going from kilograms to grams you multiply by 1000.',
        },
      }),

    /* 4 · dnd · 🟡 — grammmi yoki kilogrammmi. */
    q('04', 'Grammmi yoki kilogrammmi?', '🟡', 'd42-sort-unit', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: 'Narsaga qarang', s: "To'rtta narsa. Ba'zilari yengil, ba'zilari og'ir.",
        a: 'Narsalarni ajrating: qaysilari grammda, qaysilari kilogrammda o\'lchanadi.',
        tokens: ['Olma', 'Arbuz', 'Daftar', 'Kartoshka qopi'],
        zones: ['Grammda', 'Kilogrammda'],
        dndHint: 'Narsalar tugadi.',
        y: "Olma va daftar yengil — grammda. Arbuz va kartoshka qopi og'ir — kilogrammda.",
        n: 'Narsani kaftda ushlab turish osonmi yoki uni ko\'tarish qiyinmi?',
        r: 'Yengil narsalar grammda, og\'irlari kilogrammda o\'lchanadi.',
      },
      {
        e: 'Смотри на предмет', s: 'Четыре предмета. Одни лёгкие, другие тяжёлые.',
        a: 'Разложи предметы: какие меряют в граммах, а какие в килограммах.',
        tokens: ['Яблоко', 'Арбуз', 'Тетрадь', 'Мешок картошки'],
        zones: ['В граммах', 'В килограммах'],
        dndHint: 'Предметы закончились.',
        y: 'Яблоко и тетрадь лёгкие — в граммах. Арбуз и мешок картошки тяжёлые — в килограммах.',
        n: 'Предмет легко держать на ладони или его тяжело поднять?',
        r: 'Лёгкие предметы меряют в граммах, тяжёлые в килограммах.',
      }, undefined, {
        en: {
          e: 'Watch the thing', s: 'Four things. Some are light, others heavy.',
          a: 'Sort the things: which ones are measured in grams and which in kilograms.',
          tokens: ['An apple', 'A watermelon', 'A notebook', 'A sack of potatoes'],
          zones: ['In grams', 'In kilograms'],
          dndHint: 'No things left.',
          y: 'An apple and a notebook are light — grams. A watermelon and a sack of potatoes are heavy — kilograms.',
          n: 'Is the thing easy to hold in your palm or hard to lift?',
          r: 'Light things are measured in grams, heavy ones in kilograms.',
        },
      }),

    /* 5 · order · 🟡 — massa bo'yicha tartib. */
    q('05', 'Yengilidan og\'iriga', '🟡', 'd42-sort-mass', 'order', '📈', [2, 0, 3, 1],
      {
        e: 'Bitta o\'lchovga keltiring', s: "To'rtta massa turli o'lchovda yozilgan.",
        a: 'Massalarni yengilidan og\'iriga tartiblang.',
        o: ['800 g', '2 kg', '300 g', '1 kg'],
        y: "300 g, keyin 800 g, keyin 1 kg (1000 g), oxirida 2 kg (2000 g). Solishtirishdan oldin hammasini grammga keltirdik.",
        n: 'Avval kilogrammlarni grammga aylantiring, keyin solishtiring.',
        r: 'Solishtirishdan oldin kattaliklar bitta o\'lchovga keltiriladi.',
      },
      {
        e: 'Приведи к одной мерке', s: 'Четыре массы записаны в разных мерках.',
        a: 'Расставь массы от самой лёгкой к самой тяжёлой.',
        o: ['800 г', '2 кг', '300 г', '1 кг'],
        y: '300 г, потом 800 г, потом 1 кг (1000 г), в конце 2 кг (2000 г). Перед сравнением всё перевели в граммы.',
        n: 'Сначала переведи килограммы в граммы, потом сравнивай.',
        r: 'Перед сравнением величины приводят к одной мерке.',
      }, undefined, {
        en: {
          e: 'Bring them to one measure', s: 'Four masses are written in different measures.',
          a: 'Put the masses in order from the lightest to the heaviest.',
          o: ['800 g', '2 kg', '300 g', '1 kg'],
          y: '300 g, then 800 g, then 1 kg (1000 g), and 2 kg (2000 g) at the end. Before comparing, everything was turned into grams.',
          n: 'Turn the kilograms into grams first, then compare.',
          r: 'Before comparing, measures are brought to one and the same unit.',
        },
        orderBy: "massa bo'yicha, avval bitta o'lchovga keltirib",
      }),

    /* 6 · choice · 🟡 — o'lcham yoki massa. */
    q('06', 'Qaysi quti og\'irroq?', '🟡', 'd42-size-vs-mass', 'choice', '🔒', 1,
      {
        e: 'Ko\'z aldaydi', s: "Omborda ikki quti. Kattasida paxta 300 g, kichigida mixlar 500 g.",
        a: 'Qaysi quti og\'irroq?',
        o: ['Katta quti, chunki u kattaroq', 'Kichik quti, unda 500 gramm', 'Ikkalasi teng', 'Chizg\'ich bilan o\'lchash kerak'],
        y: "Mixlar 500 gramm, paxta 300 gramm. O'lcham hal qilmaydi, massa hal qiladi.",
        n: 'Sonlarni solishtiring, quti hajmiga qaramang.',
        by: [
          "O'lcham massani bildirmaydi: paxta katta, lekin yengil.",
          undefined,
          "Sonlar har xil: 500 va 300 teng emas.",
          "Chizg'ich uzunlikni o'lchaydi, og'irlikni emas. Buning uchun tarozi kerak.",
        ],
        r: 'Massani ko\'z bilan emas, tarozi bilan aniqlaydilar.',
      },
      {
        e: 'Глаз обманывает', s: 'На складе две коробки. В большой вата 300 г, в маленькой гвозди 500 г.',
        a: 'Какая коробка тяжелее?',
        o: ['Большая, потому что она больше', 'Маленькая, в ней 500 граммов', 'Они равны', 'Нужно измерить линейкой'],
        y: 'Гвозди 500 граммов, вата 300 граммов. Решает не размер, а масса.',
        n: 'Сравни числа, не смотри на размер коробки.',
        by: [
          'Размер не говорит о массе: вата большая, но лёгкая.',
          undefined,
          'Числа разные: 500 и 300 не равны.',
          'Линейка измеряет длину, а не вес. Для этого нужны весы.',
        ],
        r: 'Массу определяют не на глаз, а весами.',
      }, undefined, {
        en: {
          e: 'The eye can fool you', s: 'There are two boxes in the store. The big one holds 300 g of cotton wool, the small one 500 g of nails.',
          a: 'Which box is heavier?',
          o: ['The big one, because it is bigger', 'The small one, it holds 500 grams', 'They are equal', 'It has to be measured with a ruler'],
          y: 'The nails are 500 grams and the cotton wool 300 grams. It is the mass that decides, not the size.',
          n: 'Compare the numbers, do not go by the size of the box.',
          by: [
            'Size says nothing about mass: cotton wool is big but light.',
            undefined,
            'The numbers are different: 500 and 300 are not equal.',
            'A ruler measures length, not weight. Scales are needed for that.',
          ],
          r: 'Mass is not worked out by eye, it is worked out with scales.',
        },
      }),

    /* 7 · multi · 🟡 — kilogrammga teng. */
    q('07', 'Kilogrammga teng', '🟡', 'd42-equals-kg', 'multi', '🎯', [0, 2],
      {
        e: 'Bir xil massa', s: "To'rtta yozuv. Ikkitasi bitta kilogrammga teng.",
        a: 'Qaysi yozuvlar 1 kilogrammga teng? Hammasini belgilang.',
        o: ['1000 g', '100 g', '500 g va yana 500 g', '10 g'],
        y: "1000 g bu aynan bir kilogramm. 500 va 500 ni qo'shsak ham ming gramm chiqadi.",
        n: 'Har yozuvni grammga keltiring va 1000 bilan solishtiring.',
        r: '1 kilogramm = 1000 gramm.',
      },
      {
        e: 'Одна и та же масса', s: 'Четыре записи. Две равны одному килограмму.',
        a: 'Какие записи равны 1 килограмму? Отметь все.',
        o: ['1000 г', '100 г', '500 г и ещё 500 г', '10 г'],
        y: '1000 г это ровно один килограмм. И 500 плюс 500 тоже дают тысячу граммов.',
        n: 'Переведи каждую запись в граммы и сравни с 1000.',
        r: '1 килограмм = 1000 граммов.',
      }, undefined, {
        en: {
          e: 'One and the same mass', s: 'Four records. Two of them equal one kilogram.',
          a: 'Which records are equal to 1 kilogram? Mark them all.',
          o: ['1000 g', '100 g', '500 g and 500 g more', '10 g'],
          y: '1000 g is exactly one kilogram. And 500 plus 500 also make a thousand grams.',
          n: 'Turn every record into grams and compare with 1000.',
          r: '1 kilogram = 1000 grams.',
        },
      }),

    /* 8 · input · 🔴 — toshlar massasi. */
    q('08', 'Uchta tosh', '🔴', 'd42-three-weights', 'input', '⚖️', ['600'],
      {
        e: 'Tarozida', s: "Tovoqda 200 grammdan uchta tosh bor.",
        a: 'Ularning massasi necha gramm?',
        y: "200 ni 3 ga ko'paytiramiz, 600 gramm chiqadi. Toshlar soni qo'shiladi, yonma-yon yozilmaydi.",
        n: 'Bitta toshning massasini toshlar soniga ko\'paytiring.',
        r: 'Bir xil massalar ko\'paytirish bilan qo\'shiladi.',
        p: 'Javob',
      },
      {
        e: 'На весах', s: 'На чаше три гири по 200 граммов.',
        a: 'Чему равна их масса в граммах?',
        y: 'Умножаем 200 на 3, получается 600 граммов. Гири складывают, а не пишут рядом.',
        n: 'Умножь массу одной гири на число гирь.',
        r: 'Одинаковые массы складывают умножением.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'On the scales', s: 'There are three weights of 200 grams each on the pan.',
          a: 'How many grams is their mass?',
          y: 'We multiply 200 by 3 and get 600 grams. The weights are added together, not written side by side.',
          n: 'Multiply the mass of one weight by the number of weights.',
          r: 'Equal masses are added together by multiplying.',
          p: 'Answer',
        },
      }),

    /* 9 · dnd · 🔴 — kilogrammdan katta yoki kichik. */
    q('09', 'Kilogrammga nisbatan', '🔴', 'd42-vs-kg', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Chegara — 1 kg', s: "To'rtta massa. Ularni bitta kilogramm bilan solishtiramiz.",
        a: 'Massalarni ajrating: qaysilari 1 kg dan katta, qaysilari kichik.',
        tokens: ['1500 g', '700 g', '2 kg', '250 g'],
        zones: ['1 kg dan katta', '1 kg dan kichik'],
        dndHint: 'Massalar tugadi.',
        y: "1500 g va 2 kg (2000 g) mingdan katta. 700 g va 250 g esa kichik.",
        n: 'Hammasini grammga keltiring va 1000 bilan solishtiring.',
        r: 'Solishtirishdan oldin bitta o\'lchovga keltiriladi.',
      },
      {
        e: 'Граница — 1 кг', s: 'Четыре массы. Сравниваем их с одним килограммом.',
        a: 'Разложи массы: какие больше 1 кг, а какие меньше.',
        tokens: ['1500 г', '700 г', '2 кг', '250 г'],
        zones: ['Больше 1 кг', 'Меньше 1 кг'],
        dndHint: 'Массы закончились.',
        y: '1500 г и 2 кг (2000 г) больше тысячи. А 700 г и 250 г меньше.',
        n: 'Переведи всё в граммы и сравни с 1000.',
        r: 'Перед сравнением приводят к одной мерке.',
      }, undefined, {
        en: {
          e: 'The border is 1 kg', s: 'Four masses. We compare them with one kilogram.',
          a: 'Sort the masses: which ones are more than 1 kg and which are less.',
          tokens: ['1500 g', '700 g', '2 kg', '250 g'],
          zones: ['More than 1 kg', 'Less than 1 kg'],
          dndHint: 'No masses left.',
          y: '1500 g and 2 kg (2000 g) are more than a thousand. And 700 g and 250 g are less.',
          n: 'Turn everything into grams and compare with 1000.',
          r: 'Before comparing, everything is brought to one measure.',
        },
      }),

    /* 10 · choice · 🔴 — masala. */
    q('10', 'Xaridlar', '🔴', 'd42-story', 'choice', '🚀', 1,
      {
        e: 'Yakuniy mashq', s: "Anvar 1 kg olma va 300 g uzum sotib oldi.",
        a: 'Xaridning umumiy massasi qancha?',
        o: ['400 g', '1300 g', '1003 g', '4 kg'],
        y: "1 kg bu 1000 gramm. 1000 + 300 = 1300 gramm.",
        n: 'Avval kilogrammni grammga aylantiring, keyin qo\'shing.',
        by: [
          "Bu yerda 1 va 300 qo'shilgan. Lekin 1 kg bu 1 emas, 1000 gramm.",
          undefined,
          "Sonlar yonma-yon yozilgan. Ularni qo'shish kerak edi.",
          "Kilogramm va gramm aralashib ketgan: 300 gramm 3 kilogramm emas.",
        ],
        r: 'Qo\'shishdan oldin kattaliklar bitta o\'lchovga keltiriladi.',
      },
      {
        e: 'Покупки', s: 'Анвар купил 1 кг яблок и 300 г винограда.',
        a: 'Чему равна общая масса покупки?',
        o: ['400 г', '1300 г', '1003 г', '4 кг'],
        y: '1 кг это 1000 граммов. 1000 + 300 = 1300 граммов.',
        n: 'Сначала переведи килограмм в граммы, потом складывай.',
        by: [
          'Здесь сложили 1 и 300. Но 1 кг это не 1, а 1000 граммов.',
          undefined,
          'Числа написали рядом. А их нужно было сложить.',
          'Килограммы и граммы перепутались: 300 граммов это не 3 килограмма.',
        ],
        r: 'Перед сложением величины приводят к одной мерке.',
      }, undefined, {
        en: {
          e: 'Shopping', s: 'Anvar bought 1 kg of apples and 300 g of grapes.',
          a: 'What is the total mass of the shopping?',
          o: ['400 g', '1300 g', '1003 g', '4 kg'],
          y: '1 kg is 1000 grams. 1000 + 300 = 1300 grams.',
          n: 'Turn the kilogram into grams first, then add.',
          by: [
            'Here 1 and 300 were added. But 1 kg is not 1, it is 1000 grams.',
            undefined,
            'The numbers were written side by side. But they had to be added.',
            'Kilograms and grams got mixed up: 300 grams is not 3 kilograms.',
          ],
          r: 'Before adding, measures are brought to one and the same unit.',
        },
      }),
  ],
};

export default DARS42_BANK;
