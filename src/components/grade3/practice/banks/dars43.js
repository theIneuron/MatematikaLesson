// Dars 43 amaliyoti — Vaqt: soat, daqiqa, soniya.
// Nazariya: src/components/grade3/Dars43.jsx (num-3-43).
// Vaqt o'nlab emas, oltmishlab sanaladi: 1 soat = 60 daqiqa, 1 daqiqa = 60 soniya;
// soatni kalta strelka, daqiqani uzuni ko'rsatadi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 order · 2 match · 3 choice · 4 input · 5 choice · 6 match · 7 dnd · 8 order · 9 multi · 10 input
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS43_BANK = {
  title: 'Dars 43 · Vaqt: soat, daqiqa, soniya',
  items: [

    /* 1 · order · 🟢 — o'lchovlar zinasi. */
    q('01', 'O\'lchovlar zinasi', '🟢', 'd43-ladder', 'order', '🪜', [2, 1, 0],
      {
        e: 'Kichigidan kattasiga', s: "Vaqtning uchta o'lchovi bor.",
        a: 'O\'lchovlarni kichigidan kattasiga tartiblang.',
        o: ['Soat', 'Daqiqa', 'Soniya'],
        y: "Soniya eng kichik, undan keyin daqiqa, eng kattasi soat. Har qadamda oltmish marta ortadi.",
        n: 'Qaysi o\'lchovda oltmishtasi keyingisini beradi?',
        r: '1 daqiqa = 60 soniya, 1 soat = 60 daqiqa.',
      },
      {
        e: 'От меньшей к большей', s: 'У времени три мерки.',
        a: 'Расставь мерки от меньшей к большей.',
        o: ['Час', 'Минута', 'Секунда'],
        y: 'Секунда самая маленькая, потом минута, самая большая час. На каждом шаге в шестьдесят раз больше.',
        n: 'В какой мерке шестьдесят штук дают следующую?',
        r: '1 минута = 60 секунд, 1 час = 60 минут.',
      }, undefined, {
        en: {
          e: 'From the smallest to the largest', s: 'Time has three measures.',
          a: 'Put the measures in order from the smallest to the largest.',
          o: ['An hour', 'A minute', 'A second'],
          y: 'A second is the smallest, then a minute, and an hour is the largest. Each step is sixty times bigger.',
          n: 'In which measure do sixty of them make the next one?',
          r: '1 minute = 60 seconds, 1 hour = 60 minutes.',
        },
      }),

    /* 2 · match · 🟢 — strelka va nima ko'rsatadi. */
    q('02', 'Strelkalar', '🟢', 'd43-hands', 'match', '🕐', [0, 1, 2],
      {
        e: 'Uch strelka', s: "Soatda uchta strelka bor: kalta, uzun va eng ingichka.",
        a: 'Har strelkani u ko\'rsatadigan o\'lchovga ulang.',
        left: ['Kalta strelka', 'Uzun strelka', 'Eng ingichka strelka'],
        right: ['Soat', 'Daqiqa', 'Soniya'],
        y: "Kalta strelka soatni ko'rsatadi, uzuni daqiqani, eng ingichkasi soniyani.",
        n: 'Qaysi strelka tez yuradi, qaysi biri sekin?',
        r: 'Soatni kalta strelka, daqiqani uzuni ko\'rsatadi.',
      },
      {
        e: 'Три стрелки', s: 'На часах три стрелки: короткая, длинная и самая тонкая.',
        a: 'Соедини каждую стрелку с меркой, которую она показывает.',
        left: ['Короткая стрелка', 'Длинная стрелка', 'Самая тонкая стрелка'],
        right: ['Час', 'Минута', 'Секунда'],
        y: 'Короткая стрелка показывает часы, длинная минуты, самая тонкая секунды.',
        n: 'Какая стрелка идёт быстро, а какая медленно?',
        r: 'Часы показывает короткая стрелка, минуты длинная.',
      }, undefined, {
        en: {
          e: 'Three hands', s: 'A clock has three hands: a short one, a long one and the thinnest one.',
          a: 'Connect each hand with the measure it shows.',
          left: ['The short hand', 'The long hand', 'The thinnest hand'],
          right: ['Hours', 'Minutes', 'Seconds'],
          y: 'The short hand shows the hours, the long one the minutes and the thinnest one the seconds.',
          n: 'Which hand moves fast and which one slowly?',
          r: 'The hours are shown by the short hand and the minutes by the long one.',
        },
      }),

    /* 3 · choice · 🟢 — soatda nechta daqiqa. */
    q('03', 'Soatda nechta daqiqa?', '🟢', 'd43-hour-minutes', 'choice', '🔒', 1,
      {
        e: 'Bir aylana', s: "Uzun strelka butun aylanani bosib o'tdi, kaltasi esa bir bo'linmaga siljidi.",
        a: 'Bitta soatda nechta daqiqa bor?',
        o: ['100', '60', '24', '30'],
        y: "Bitta soatda oltmish daqiqa bor. Vaqt o'nlab emas, oltmishlab sanaladi.",
        n: 'Vaqt o\'nlab sanalmaydi. Aylanadagi bo\'linmalarni sanang.',
        by: [
          "Yuz bu o'nlab hisob, vaqt esa oltmishlab sanaladi.",
          undefined,
          "Yigirma to'rt bu sutkadagi soat, soatdagi daqiqa emas.",
          "O'ttiz daqiqa bu yarim soat.",
        ],
        r: '1 soat = 60 daqiqa.',
      },
      {
        e: 'Один круг', s: 'Длинная стрелка прошла весь круг, а короткая сдвинулась на одно деление.',
        a: 'Сколько минут в одном часе?',
        o: ['100', '60', '24', '30'],
        y: 'В одном часе шестьдесят минут. Время считают не десятками, а шестидесятками.',
        n: 'Время не считают десятками. Посчитай деления на круге.',
        by: [
          'Сто это счёт десятками, а время считают шестидесятками.',
          undefined,
          'Двадцать четыре это часы в сутках, а не минуты в часе.',
          'Тридцать минут это полчаса.',
        ],
        r: '1 час = 60 минут.',
      }, undefined, {
        en: {
          e: 'One full circle', s: 'The long hand went all the way round and the short one moved by one mark.',
          a: 'How many minutes are there in one hour?',
          o: ['100', '60', '24', '30'],
          y: 'There are sixty minutes in one hour. Time is counted in sixties, not in tens.',
          n: 'Time is not counted in tens. Count the marks around the circle.',
          by: [
            'A hundred is counting in tens, and time is counted in sixties.',
            undefined,
            'Twenty-four is the hours in a day, not the minutes in an hour.',
            'Thirty minutes is half an hour.',
          ],
          r: '1 hour = 60 minutes.',
        },
      }),

    /* 4 · input · 🟡 — ikki soatda. */
    q('04', 'Ikki soatda', '🟡', 'd43-two-hours', 'input', '🔢', ['120'],
      {
        e: 'Ko\'paytiramiz', s: "Bitta soatda 60 daqiqa bor.",
        a: 'Ikki soatda nechta daqiqa bor?',
        y: "60 ni 2 ga ko'paytiramiz, 120 daqiqa chiqadi.",
        n: 'Bitta soatdagi daqiqalarni soatlar soniga ko\'paytiring.',
        r: 'Soatlarni daqiqaga aylantirishda 60 ga ko\'paytiriladi.',
        p: 'Javob',
      },
      {
        e: 'Умножаем', s: 'В одном часе 60 минут.',
        a: 'Сколько минут в двух часах?',
        y: 'Умножаем 60 на 2, получается 120 минут.',
        n: 'Умножь минуты в одном часе на число часов.',
        r: 'Чтобы перевести часы в минуты, умножают на 60.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'We multiply', s: 'There are 60 minutes in one hour.',
          a: 'How many minutes are there in two hours?',
          y: 'We multiply 60 by 2 and get 120 minutes.',
          n: 'Multiply the minutes in one hour by the number of hours.',
          r: 'To turn hours into minutes you multiply by 60.',
          p: 'Answer',
        },
      }),

    /* 5 · choice · 🟡 — yarim soat. */
    q('05', 'Yarim soat', '🟡', 'd43-half-hour', 'choice', '🔒', 2,
      {
        e: 'Yarmi qancha?', s: "Bitta soatda 60 daqiqa bor.",
        a: 'Yarim soat necha daqiqa?',
        o: ['15 daqiqa', '20 daqiqa', '30 daqiqa', '50 daqiqa'],
        y: "60 ni 2 ga bo'lamiz, 30 daqiqa chiqadi. Uzun strelka yarim aylanani bosib o'tadi.",
        n: 'Oltmishning yarmini toping.',
        by: [
          "Bu chorak soat: 60 ni 4 ga bo'lgani.",
          "Bu soatning uchdan bir qismi, yarmi emas.",
          undefined,
          "Bu yarmidan ko'p. Oltmishni ikkiga bo'ling.",
        ],
        r: 'Yarim soat 30 daqiqaga teng.',
      },
      {
        e: 'Сколько половина?', s: 'В одном часе 60 минут.',
        a: 'Сколько минут в получасе?',
        o: ['15 минут', '20 минут', '30 минут', '50 минут'],
        y: 'Делим 60 на 2, получается 30 минут. Длинная стрелка проходит половину круга.',
        n: 'Найди половину шестидесяти.',
        by: [
          'Это четверть часа: 60 разделить на 4.',
          'Это треть часа, а не половина.',
          undefined,
          'Это больше половины. Раздели шестьдесят на два.',
        ],
        r: 'Полчаса равны 30 минутам.',
      }, undefined, {
        en: {
          e: 'How much is a half?', s: 'There are 60 minutes in one hour.',
          a: 'How many minutes are there in half an hour?',
          o: ['15 minutes', '20 minutes', '30 minutes', '50 minutes'],
          y: 'We divide 60 by 2 and get 30 minutes. The long hand goes half way round.',
          n: 'Find half of sixty.',
          by: [
            'That is a quarter of an hour: 60 divided by 4.',
            'That is a third of an hour, not a half.',
            undefined,
            'That is more than a half. Divide sixty by two.',
          ],
          r: 'Half an hour is 30 minutes.',
        },
      }),

    /* 6 · match · 🟡 — vaqt va daqiqalar. */
    q('06', 'Vaqt va daqiqalar', '🟡', 'd43-match-minutes', 'match', '⏱️', [0, 1, 2],
      {
        e: 'Bir xil vaqt', s: "Bitta vaqtni ikki xil aytish mumkin.",
        a: 'Har yozuvni unga teng daqiqalarga ulang.',
        left: ['Yarim soat', 'Chorak soat', 'Bir soat'],
        right: ['30 daqiqa', '15 daqiqa', '60 daqiqa'],
        y: "Yarim soat 30 daqiqa, chorak soat 15 daqiqa, butun soat 60 daqiqa.",
        n: 'Oltmishni ikkiga va to\'rtga bo\'ling.',
        r: 'Soatning qismlari 60 ni bo\'lish bilan topiladi.',
      },
      {
        e: 'Одно и то же время', s: 'Одно время можно назвать двумя способами.',
        a: 'Соедини каждую запись с равным ей числом минут.',
        left: ['Полчаса', 'Четверть часа', 'Один час'],
        right: ['30 минут', '15 минут', '60 минут'],
        y: 'Полчаса это 30 минут, четверть часа 15 минут, целый час 60 минут.',
        n: 'Раздели шестьдесят на два и на четыре.',
        r: 'Части часа находят делением 60.',
      }, undefined, {
        en: {
          e: 'One and the same time', s: 'One stretch of time can be named in two ways.',
          a: 'Connect each record with the number of minutes that equals it.',
          left: ['Half an hour', 'A quarter of an hour', 'One hour'],
          right: ['30 minutes', '15 minutes', '60 minutes'],
          y: 'Half an hour is 30 minutes, a quarter of an hour is 15 minutes and a whole hour is 60 minutes.',
          n: 'Divide sixty by two and by four.',
          r: 'Parts of an hour are found by dividing 60.',
        },
      }),

    /* 7 · dnd · 🟡 — soatdan katta yoki kichik. */
    q('07', 'Soatga nisbatan', '🟡', 'd43-vs-hour', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Chegara — 1 soat', s: "To'rtta vaqt. Ularni bitta soat bilan solishtiramiz.",
        a: 'Vaqtlarni ajrating: qaysilari 1 soatdan katta, qaysilari kichik.',
        tokens: ['90 daqiqa', '45 daqiqa', '120 daqiqa', '30 daqiqa'],
        zones: ['1 soatdan katta', '1 soatdan kichik'],
        dndHint: 'Vaqtlar tugadi.',
        y: "90 va 120 daqiqa oltmishdan katta. 45 va 30 daqiqa esa kichik.",
        n: 'Har vaqtni 60 daqiqa bilan solishtiring.',
        r: 'Solishtirishdan oldin hammasi daqiqaga keltiriladi.',
      },
      {
        e: 'Граница — 1 час', s: 'Четыре промежутка времени. Сравниваем их с одним часом.',
        a: 'Разложи время: какое больше 1 часа, а какое меньше.',
        tokens: ['90 минут', '45 минут', '120 минут', '30 минут'],
        zones: ['Больше 1 часа', 'Меньше 1 часа'],
        dndHint: 'Время закончилось.',
        y: '90 и 120 минут больше шестидесяти. А 45 и 30 минут меньше.',
        n: 'Сравни каждое время с 60 минутами.',
        r: 'Перед сравнением всё приводят к минутам.',
      }, undefined, {
        en: {
          e: 'The border is 1 hour', s: 'Four stretches of time. We compare them with one hour.',
          a: 'Sort the times: which ones are more than 1 hour and which are less.',
          tokens: ['90 minutes', '45 minutes', '120 minutes', '30 minutes'],
          zones: ['More than 1 hour', 'Less than 1 hour'],
          dndHint: 'No times left.',
          y: '90 and 120 minutes are more than sixty. And 45 and 30 minutes are less.',
          n: 'Compare every time with 60 minutes.',
          r: 'Before comparing, everything is brought to minutes.',
        },
      }),

    /* 8 · order · 🔴 — vaqt bo'yicha tartib. */
    q('08', 'Qaysi biri qisqaroq?', '🔴', 'd43-sort', 'order', '📈', [1, 3, 0, 2],
      {
        e: 'Bitta o\'lchovga keltiring', s: "To'rtta vaqt turli o'lchovda yozilgan.",
        a: 'Vaqtlarni qisqasidan uzuniga tartiblang.',
        o: ['1 soat', '30 daqiqa', '2 soat', '90 daqiqa'],
        y: "30 daqiqa, keyin 1 soat (60 daqiqa), keyin 90 daqiqa, oxirida 2 soat (120 daqiqa).",
        n: 'Avval soatlarni daqiqaga aylantiring, keyin solishtiring.',
        r: 'Solishtirishdan oldin vaqt bitta o\'lchovga keltiriladi.',
      },
      {
        e: 'Приведи к одной мерке', s: 'Четыре промежутка записаны в разных мерках.',
        a: 'Расставь время от самого короткого к самому длинному.',
        o: ['1 час', '30 минут', '2 часа', '90 минут'],
        y: '30 минут, потом 1 час (60 минут), потом 90 минут, в конце 2 часа (120 минут).',
        n: 'Сначала переведи часы в минуты, потом сравнивай.',
        r: 'Перед сравнением время приводят к одной мерке.',
      }, undefined, {
        en: {
          e: 'Bring them to one measure', s: 'Four stretches are written in different measures.',
          a: 'Put the times in order from the shortest to the longest.',
          o: ['1 hour', '30 minutes', '2 hours', '90 minutes'],
          y: '30 minutes, then 1 hour (60 minutes), then 90 minutes, and 2 hours (120 minutes) at the end.',
          n: 'Turn the hours into minutes first, then compare.',
          r: 'Before comparing, time is brought to one and the same measure.',
        },
        orderBy: "vaqt bo'yicha, avval daqiqaga keltirib",
      }),

    /* 9 · multi · 🔴 — to'g'ri gaplar. */
    q('09', 'To\'g\'ri gaplar', '🔴', 'd43-true-facts', 'multi', '✅', [0, 2],
      {
        e: 'Vaqt qanday sanaladi', s: "To'rtta gap. Ikkitasi to'g'ri.",
        a: 'Qaysi gaplar to\'g\'ri? Hammasini belgilang.',
        o: [
          'Bir daqiqada 60 soniya bor',
          'Bir soatda 100 daqiqa bor',
          'Vaqt o\'nlab emas, oltmishlab sanaladi',
          'Uzun strelka soatni ko\'rsatadi',
        ],
        y: "Daqiqada oltmish soniya, soatda oltmish daqiqa. Soatni esa kalta strelka ko'rsatadi.",
        n: 'Har gapni tekshiring: oltmish yoki yuzmi, kalta yoki uzunmi?',
        r: 'Vaqt oltmishlab sanaladi, soatni kalta strelka ko\'rsatadi.',
      },
      {
        e: 'Как считают время', s: 'Четыре утверждения. Два из них верны.',
        a: 'Какие утверждения верны? Отметь все.',
        o: [
          'В одной минуте 60 секунд',
          'В одном часе 100 минут',
          'Время считают не десятками, а шестидесятками',
          'Длинная стрелка показывает часы',
        ],
        y: 'В минуте шестьдесят секунд, в часе шестьдесят минут. А часы показывает короткая стрелка.',
        n: 'Проверь каждое: шестьдесят или сто, короткая или длинная?',
        r: 'Время считают шестидесятками, часы показывает короткая стрелка.',
      }, undefined, {
        en: {
          e: 'How time is counted', s: 'Four statements. Two of them are true.',
          a: 'Which statements are true? Mark them all.',
          o: ['There are 60 seconds in one minute', 'There are 100 minutes in one hour', 'Time is counted in sixties, not in tens', 'The long hand shows the hours'],
          y: 'A minute has sixty seconds and an hour has sixty minutes. And the hours are shown by the short hand.',
          n: 'Check each one: sixty or a hundred, short hand or long one?',
          r: 'Time is counted in sixties, and the hours are shown by the short hand.',
        },
      }),

    /* 10 · input · 🔴 — dars davomiyligi. */
    q('10', 'Dars qancha davom etdi?', '🔴', 'd43-lesson-length', 'input', '🚀', ['45'],
      {
        e: 'Yakuniy mashq', s: "Dars 1 soat davom etishi kerak edi, lekin 15 daqiqa oldin tugadi.",
        a: 'Dars necha daqiqa davom etdi?',
        y: "1 soat bu 60 daqiqa. 60 − 15 = 45 daqiqa.",
        n: 'Avval soatni daqiqaga aylantiring, keyin ayiring.',
        r: 'Ayirishdan oldin vaqt bitta o\'lchovga keltiriladi.',
        p: 'Javob',
      },
      {
        e: 'Итоговое задание', s: 'Урок должен был идти 1 час, но закончился на 15 минут раньше.',
        a: 'Сколько минут шёл урок?',
        y: '1 час это 60 минут. 60 − 15 = 45 минут.',
        n: 'Сначала переведи час в минуты, потом вычитай.',
        r: 'Перед вычитанием время приводят к одной мерке.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Final task', s: 'A lesson was meant to last 1 hour but ended 15 minutes early.',
          a: 'How many minutes did the lesson last?',
          y: '1 hour is 60 minutes. 60 − 15 = 45 minutes.',
          n: 'Turn the hour into minutes first, then subtract.',
          r: 'Before subtracting, time is brought to one and the same measure.',
          p: 'Answer',
        },
      }),
  ],
};

export default DARS43_BANK;
