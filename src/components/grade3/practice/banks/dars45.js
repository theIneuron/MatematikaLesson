// Dars 45 amaliyoti — Kalendar: sutka, hafta, oy, yil.
// Nazariya: src/components/grade3/Dars45.jsx (num-3-45).
// 1 sutka = 24 soat, 1 hafta = 7 sutka, 1 yil = 12 oy; oydagi kun soni doimiy emas
// (30, 31 yoki 28), shuning uchun sanalar orasidagi kun kalendar bo'yicha sanaladi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 multi · 3 match · 4 choice · 5 match · 6 multi · 7 choice · 8 dnd · 9 order · 10 input
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS45_BANK = {
  title: 'Dars 45 · Kalendar: sutka, hafta, oy, yil',
  items: [

    /* 1 · order · 🟢 — o'lchovlar zinasi. */
    q('01', 'O\'lchovlar zinasi', '🟢', 'd45-ladder', 'order', '🪜', [2, 0, 3, 1],
      {
        e: 'Kichigidan kattasiga', s: "Kalendar to'rtta o'lchov bilan ishlaydi.",
        a: 'O\'lchovlarni kichigidan kattasiga tartiblang.',
        o: ['Hafta', 'Yil', 'Sutka', 'Oy'],
        y: "Sutka eng kichik, undan hafta, keyin oy, eng kattasi yil.",
        n: 'Qaysi o\'lchov ichida boshqasi to\'liq joylashadi?',
        r: '1 hafta = 7 sutka, 1 yil = 12 oy.',
      },
      {
        e: 'От меньшей к большей', s: 'Календарь работает с четырьмя мерками.',
        a: 'Расставь мерки от меньшей к большей.',
        o: ['Неделя', 'Год', 'Сутки', 'Месяц'],
        y: 'Сутки самые маленькие, потом неделя, потом месяц, самый большой год.',
        n: 'Какая мерка целиком помещается внутри другой?',
        r: '1 неделя = 7 суток, 1 год = 12 месяцев.',
      }, undefined, {
        en: {
          e: 'From the smallest to the largest', s: 'A calendar works with four measures.',
          a: 'Put the measures in order from the smallest to the largest.',
          o: ['A week', 'A year', 'A day', 'A month'],
          y: 'A day is the smallest, then a week, then a month, and a year is the largest.',
          n: 'Which measure fits whole inside another one?',
          r: '1 week = 7 days, 1 year = 12 months.',
        },
      }),

    /* 2 · multi · 🟢 — to'g'ri tengliklar. */
    q('02', 'To\'g\'ri tengliklar', '🟢', 'd45-true-equalities', 'multi', '✅', [0, 2],
      {
        e: 'Tekshiring', s: "To'rtta tenglik. Ikkitasi to'g'ri.",
        a: 'Qaysi tengliklar to\'g\'ri? Hammasini belgilang.',
        o: ['1 hafta = 7 sutka', '1 sutka = 12 soat', '1 yil = 12 oy', '1 oy = 7 hafta'],
        y: "Haftada yetti sutka, yilda o'n ikki oy. Sutkada esa yigirma to'rt soat, oyda to'rt haftadan sal ko'p.",
        n: 'Har tenglikni alohida tekshiring: kalendar qatori va soat strelkasi yordam beradi.',
        r: '1 sutka = 24 soat, 1 hafta = 7 sutka, 1 yil = 12 oy.',
      },
      {
        e: 'Проверь', s: 'Четыре равенства. Два из них верны.',
        a: 'Какие равенства верные? Отметь все.',
        o: ['1 неделя = 7 суток', '1 сутки = 12 часов', '1 год = 12 месяцев', '1 месяц = 7 недель'],
        y: 'В неделе семь суток, в году двенадцать месяцев. А в сутках двадцать четыре часа, в месяце чуть больше четырёх недель.',
        n: 'Проверь каждое отдельно: помогут строка календаря и часовая стрелка.',
        r: '1 сутки = 24 часа, 1 неделя = 7 суток, 1 год = 12 месяцев.',
      }, undefined, {
        en: {
          e: 'Check them', s: 'Four equalities. Two of them are true.',
          a: 'Which equalities are right? Mark them all.',
          o: ['1 week = 7 days', '1 day = 12 hours', '1 year = 12 months', '1 month = 7 weeks'],
          y: 'A week has seven days and a year has twelve months. And a day has twenty-four hours, while a month has a little more than four weeks.',
          n: 'Check each one separately: a calendar row and the hour hand will help.',
          r: '1 day = 24 hours, 1 week = 7 days, 1 year = 12 months.',
        },
      }),

    /* 3 · match · 🟢 — o'lchov va son. */
    q('03', 'O\'lchov va son', '🟢', 'd45-match-numbers', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch o\'lchov', s: 'Har o\'lchovning o\'z soni bor.',
        a: 'Har o\'lchovni uning soniga ulang.',
        left: ['Sutkadagi soat', 'Haftadagi sutka', 'Yildagi oy'],
        right: ['24', '7', '12'],
        y: "Sutkada 24 soat, haftada 7 sutka, yilda 12 oy.",
        n: 'Kalendar qatorida nechta katak bor? Soat strelkasi sutkada necha marta aylanadi?',
        r: '1 sutka = 24 soat, 1 hafta = 7 sutka, 1 yil = 12 oy.',
      },
      {
        e: 'Три мерки', s: 'У каждой мерки своё число.',
        a: 'Соедини каждую мерку с её числом.',
        left: ['Часов в сутках', 'Суток в неделе', 'Месяцев в году'],
        right: ['24', '7', '12'],
        y: 'В сутках 24 часа, в неделе 7 суток, в году 12 месяцев.',
        n: 'Сколько клеток в строке календаря? Сколько раз стрелка обходит круг за сутки?',
        r: '1 сутки = 24 часа, 1 неделя = 7 суток, 1 год = 12 месяцев.',
      }, undefined, {
        en: {
          e: 'Three measures', s: 'Every measure has a number of its own.',
          a: 'Connect each measure with its number.',
          left: ['Hours in a day', 'Days in a week', 'Months in a year'],
          right: ['24', '7', '12'],
          y: 'A day has 24 hours, a week has 7 days and a year has 12 months.',
          n: 'How many cells are there in a calendar row? How many times does the hand go round in a day?',
          r: '1 day = 24 hours, 1 week = 7 days, 1 year = 12 months.',
        },
      }),

    /* 4 · choice · 🟡 — nega yettita. */
    q('04', 'Nega yettita katak?', '🟡', 'd45-why-seven', 'choice', '🔒', 2,
      {
        e: 'Kalendar qatori', s: "Kalendar varag'ida har qatorda rosa yettita katak bor.",
        a: 'Nega aynan yettita?',
        o: ['Chunki shunday chiroyli', 'Chunki oyda yetti hafta bor', 'Chunki qator bitta haftani takrorlaydi', 'Chunki sutkada yetti soat bor'],
        y: "Kalendar qatori bu bitta hafta, haftada esa yetti kun bor. Shuning uchun qator har doim bir xil uzunlikda.",
        n: 'Bitta qator qancha vaqtni ko\'rsatadi?',
        by: [
          "Gap chiroylikda emas: qator haftani takrorlaydi.",
          "Oyda to'rt haftadan sal ko'p, yetti emas.",
          undefined,
          "Sutkada yigirma to'rt soat bor, yetti emas.",
        ],
        r: 'Kalendar qatori bitta hafta, unda 7 sutka bor.',
      },
      {
        e: 'Строка календаря', s: 'На листе календаря в каждой строке ровно семь клеток.',
        a: 'Почему именно семь?',
        o: ['Потому что так красиво', 'Потому что в месяце семь недель', 'Потому что строка повторяет одну неделю', 'Потому что в сутках семь часов'],
        y: 'Строка календаря это одна неделя, а в неделе семь дней. Поэтому строка всегда одинаковой длины.',
        n: 'Сколько времени показывает одна строка?',
        by: [
          'Дело не в красоте: строка повторяет неделю.',
          'В месяце чуть больше четырёх недель, а не семь.',
          undefined,
          'В сутках двадцать четыре часа, а не семь.',
        ],
        r: 'Строка календаря это одна неделя, в ней 7 суток.',
      }, undefined, {
        en: {
          e: 'A calendar row', s: 'On a calendar page every row has exactly seven cells.',
          a: 'Why exactly seven?',
          o: ['Because it looks nice', 'Because a month has seven weeks', 'Because a row repeats one week', 'Because a day has seven hours'],
          y: 'A calendar row is one week, and a week has seven days. That is why the row is always the same length.',
          n: 'How much time does one row show?',
          by: [
            'It is not about looks: the row repeats a week.',
            'A month has a little more than four weeks, not seven.',
            undefined,
            'A day has twenty-four hours, not seven.',
          ],
          r: 'A calendar row is one week and it has 7 days.',
        },
      }),

    /* 5 · match · 🟡 — oy va kun soni. */
    q('05', 'Oy va kun soni', '🟡', 'd45-month-days', 'match', '📅', [0, 1, 2],
      {
        e: 'Oylar har xil', s: "Oydagi kun soni doimiy emas.",
        a: 'Har oyni uning kun soniga ulang.',
        left: ['Yanvar', 'Aprel', 'Fevral'],
        right: ['31 kun', '30 kun', '28 kun'],
        y: "Yanvarda 31 kun, aprelda 30, fevralda esa 28. Shuning uchun oylarni bir xil deb hisoblab bo'lmaydi.",
        n: 'Kalendarga qarang: hamma oy bir xil uzunlikdami?',
        r: 'Oydagi kun soni doimiy emas: 30, 31 yoki 28.',
      },
      {
        e: 'Месяцы разные', s: 'Число дней в месяце непостоянно.',
        a: 'Соедини каждый месяц с числом его дней.',
        left: ['Январь', 'Апрель', 'Февраль'],
        right: ['31 день', '30 дней', '28 дней'],
        y: 'В январе 31 день, в апреле 30, в феврале 28. Поэтому месяцы нельзя считать одинаковыми.',
        n: 'Посмотри на календарь: все ли месяцы одной длины?',
        r: 'Число дней в месяце непостоянно: 30, 31 или 28.',
      }, undefined, {
        en: {
          e: 'The months are different', s: 'The number of days in a month is not always the same.',
          a: 'Connect each month with its number of days.',
          left: ['January', 'April', 'February'],
          right: ['31 days', '30 days', '28 days'],
          y: 'January has 31 days, April has 30 and February has 28. That is why months cannot be counted as equal.',
          n: 'Look at a calendar: are all the months the same length?',
          r: 'The number of days in a month varies: 30, 31 or 28.',
        },
      }),

    /* 6 · multi · 🟡 — 31 kunli oylar. */
    q('06', 'Uzun oylar', '🟡', 'd45-long-months', 'multi', '🎯', [0, 2],
      {
        e: '31 kunli oylar', s: "To'rtta oy. Ikkitasida 31 kun bor.",
        a: 'Qaysi oylarda 31 kun bor? Hammasini belgilang.',
        o: ['Yanvar', 'Aprel', 'Mart', 'Fevral'],
        y: "Yanvar va mart uzun oylar, ularda 31 kun. Aprelda 30, fevralda 28 kun.",
        n: 'Kalendardan yoki mushtdagi bo\'rtiqlar usulidan foydalaning.',
        r: 'Yilda 31 kunli oylar yettita.',
      },
      {
        e: 'Длинные месяцы', s: 'Четыре месяца. В двух по 31 дню.',
        a: 'В каких месяцах 31 день? Отметь все.',
        o: ['Январь', 'Апрель', 'Март', 'Февраль'],
        y: 'Январь и март длинные месяцы, в них 31 день. В апреле 30, в феврале 28.',
        n: 'Посмотри в календарь или воспользуйся счётом по костяшкам.',
        r: 'В году семь месяцев по 31 дню.',
      }, undefined, {
        en: {
          e: 'The long months', s: 'Four months. Two of them have 31 days.',
          a: 'Which months have 31 days? Mark them all.',
          o: ['January', 'April', 'March', 'February'],
          y: 'January and March are long months with 31 days. April has 30 and February has 28.',
          n: 'Look at a calendar or use the knuckle count.',
          r: 'A year has seven months of 31 days.',
        },
      }),

    /* 7 · choice · 🟡 — sutkada nechta soat. */
    q('07', 'Sutkada nechta soat?', '🟡', 'd45-day-hours', 'choice', '🔒', 1,
      {
        e: 'Bitta katak', s: "Kalendarning bitta katagi bu butun sutka.",
        a: 'Sutkada nechta soat bor?',
        o: ['12', '24', '60', '7'],
        y: "Sutkada yigirma to'rt soat bor. Bu soat strelkasining ikki marta to'liq aylanishi.",
        n: 'Soat strelkasi sutkada necha marta aylanadi?',
        by: [
          "O'n ikki bu sutkaning yarmi, strelkaning bir aylanasi.",
          undefined,
          "Oltmish bu soatdagi daqiqa.",
          "Yetti bu haftadagi kunlar.",
        ],
        r: '1 sutka = 24 soat.',
      },
      {
        e: 'Одна клетка', s: 'Одна клетка календаря это целые сутки.',
        a: 'Сколько часов в сутках?',
        o: ['12', '24', '60', '7'],
        y: 'В сутках двадцать четыре часа. Это два полных оборота часовой стрелки.',
        n: 'Сколько раз часовая стрелка обходит круг за сутки?',
        by: [
          'Двенадцать это половина суток, один оборот стрелки.',
          undefined,
          'Шестьдесят это минуты в часе.',
          'Семь это дни в неделе.',
        ],
        r: '1 сутки = 24 часа.',
      }, undefined, {
        en: {
          e: 'One cell', s: 'One cell of a calendar is a whole day.',
          a: 'How many hours are there in a day?',
          o: ['12', '24', '60', '7'],
          y: 'A day has twenty-four hours. That is two full turns of the hour hand.',
          n: 'How many times does the hour hand go round in a day?',
          by: [
            'Twelve is half a day, one turn of the hand.',
            undefined,
            'Sixty is the minutes in an hour.',
            'Seven is the days in a week.',
          ],
          r: '1 day = 24 hours.',
        },
      }),

    /* 8 · dnd · 🔴 — haftadan katta yoki kichik. */
    q('08', 'Haftaga nisbatan', '🔴', 'd45-vs-week', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Chegara — 1 hafta', s: "To'rtta muddat. Ularni bitta hafta bilan solishtiramiz.",
        a: 'Muddatlarni ajrating: qaysilari 1 haftadan uzun, qaysilari qisqa.',
        tokens: ['10 sutka', '5 sutka', '2 hafta', '3 sutka'],
        zones: ['1 haftadan uzun', '1 haftadan qisqa'],
        dndHint: 'Muddatlar tugadi.',
        y: "10 sutka va 2 hafta (14 sutka) yettidan ko'p. 5 va 3 sutka esa kam.",
        n: 'Haftalarni sutkaga aylantiring va 7 bilan solishtiring.',
        r: 'Solishtirishdan oldin muddatlar bitta o\'lchovga keltiriladi.',
      },
      {
        e: 'Граница — 1 неделя', s: 'Четыре срока. Сравниваем их с одной неделей.',
        a: 'Разложи сроки: какие длиннее 1 недели, а какие короче.',
        tokens: ['10 суток', '5 суток', '2 недели', '3 суток'],
        zones: ['Длиннее недели', 'Короче недели'],
        dndHint: 'Сроки закончились.',
        y: '10 суток и 2 недели (14 суток) больше семи. А 5 и 3 суток меньше.',
        n: 'Переведи недели в сутки и сравни с 7.',
        r: 'Перед сравнением сроки приводят к одной мерке.',
      }, undefined, {
        en: {
          e: 'The border is 1 week', s: 'Four stretches of time. We compare them with one week.',
          a: 'Sort the stretches: which ones are longer than 1 week and which are shorter.',
          tokens: ['10 days', '5 days', '2 weeks', '3 days'],
          zones: ['Longer than a week', 'Shorter than a week'],
          dndHint: 'No stretches left.',
          y: '10 days and 2 weeks (14 days) are more than seven. And 5 and 3 days are less.',
          n: 'Turn the weeks into days and compare with 7.',
          r: 'Before comparing, stretches of time are brought to one measure.',
        },
      }),

    /* 9 · order · 🔴 — muddat bo'yicha tartib. */
    q('09', 'Qisqasidan uzuniga', '🔴', 'd45-sort', 'order', '📈', [1, 3, 0, 2],
      {
        e: 'Bitta o\'lchovga keltiring', s: "To'rtta muddat turli o'lchovda yozilgan.",
        a: 'Muddatlarni qisqasidan uzuniga tartiblang.',
        o: ['1 hafta', '3 sutka', '1 oy', '10 sutka'],
        y: "3 sutka, keyin 1 hafta (7 sutka), keyin 10 sutka, oxirida 1 oy (30 kundan ortiq).",
        n: 'Avval haftani sutkaga aylantiring, keyin solishtiring.',
        r: 'Solishtirishdan oldin muddatlar bitta o\'lchovga keltiriladi.',
      },
      {
        e: 'Приведи к одной мерке', s: 'Четыре срока записаны в разных мерках.',
        a: 'Расставь сроки от самого короткого к самому длинному.',
        o: ['1 неделя', '3 суток', '1 месяц', '10 суток'],
        y: '3 суток, потом 1 неделя (7 суток), потом 10 суток, в конце 1 месяц (больше 30 дней).',
        n: 'Сначала переведи неделю в сутки, потом сравнивай.',
        r: 'Перед сравнением сроки приводят к одной мерке.',
      }, undefined, {
        en: {
          e: 'Bring them to one measure', s: 'Four stretches are written in different measures.',
          a: 'Put the stretches in order from the shortest to the longest.',
          o: ['1 week', '3 days', '1 month', '10 days'],
          y: '3 days, then 1 week (7 days), then 10 days, and 1 month (more than 30 days) at the end.',
          n: 'Turn the week into days first, then compare.',
          r: 'Before comparing, stretches of time are brought to one measure.',
        },
        orderBy: "muddat bo'yicha, avval sutkaga keltirib",
      }),

    /* 10 · input · 🔴 — sanalar orasidagi kunlar. */
    q('10', 'Sanalar orasida', '🔴', 'd45-between-dates', 'input', '🚀', ['14'],
      {
        e: 'Yakuniy mashq', s: "Ikki hafta davom etadigan lager 1-mayda boshlandi.",
        a: 'Lager necha kun davom etadi?',
        y: "Bitta haftada 7 sutka. Ikki haftada 7 · 2 = 14 kun.",
        n: 'Haftadagi kunlarni haftalar soniga ko\'paytiring.',
        r: '1 hafta = 7 sutka, shuning uchun haftalar 7 ga ko\'paytiriladi.',
        p: 'Javob',
      },
      {
        e: 'Итоговое задание', s: 'Лагерь на две недели начался 1 мая.',
        a: 'Сколько дней продлится лагерь?',
        y: 'В одной неделе 7 суток. За две недели 7 · 2 = 14 дней.',
        n: 'Умножь дни в неделе на число недель.',
        r: '1 неделя = 7 суток, поэтому недели умножают на 7.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Final task', s: 'A two-week camp started on the 1st of May.',
          a: 'How many days will the camp last?',
          y: 'One week has 7 days. Two weeks make 7 · 2 = 14 days.',
          n: 'Multiply the days in a week by the number of weeks.',
          r: '1 week = 7 days, so weeks are multiplied by 7.',
          p: 'Answer',
        },
      }),
  ],
};

export default DARS45_BANK;
