// Dars 49 amaliyoti — Tengsizliklar, rost va yolg'on mulohazalar.
// Nazariya: src/components/grade3/Dars49.jsx (num-3-49).
// Mulohaza yo rost, yo yolg'on bo'ladi (savol va iltimos mulohaza emas);
// ≤ va ≥ belgilari tenglikda ham rost, shuning uchun 5 ≤ 5 rost.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 match · 2 input · 3 dnd · 4 input · 5 multi · 6 choice · 7 order · 8 multi · 9 order · 10 choice
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS49_BANK = {
  title: 'Dars 49 · Rost va yolg\'on mulohazalar',
  items: [

    /* 1 · match · 🟢 — belgi va o'qilishi. */
    q('01', 'Belgi qanday o\'qiladi', '🟢', 'd49-match-signs', 'match', '🔗', [0, 1, 2],
      {
        e: 'To\'rt belgi', s: "Har belgining o'z nomi bor va u to'liq o'qiladi.",
        a: 'Har belgini uning o\'qilishiga ulang.',
        left: ['<', '≤', '='],
        right: ['kichik', 'kichik yoki teng', 'teng'],
        y: "«Kichik yoki teng» belgisi ikki qismdan iborat: kichik yoki teng.",
        n: 'Belgi ostida chiziq bormi? U tenglikni qo\'shadi.',
        r: '≤ belgisi ikki shartdan kamida bittasi bajarilsa rost bo\'ladi.',
      },
      {
        e: 'Четыре знака', s: 'У каждого знака своё название, и читают его целиком.',
        a: 'Соедини каждый знак с его чтением.',
        left: ['<', '≤', '='],
        right: ['меньше', 'меньше или равно', 'равно'],
        y: 'Знак «меньше или равно» состоит из двух частей: меньше или равно.',
        n: 'Есть ли под знаком черта? Она добавляет равенство.',
        r: 'Знак ≤ верен, если выполняется хотя бы одна из двух частей.',
      }),

    /* 2 · input · 🟢 — nechta shart bajarildi. */
    q('02', 'Nechta shart bajarildi?', '🟢', 'd49-five-le-five', 'input', '✅', ['1'],
      {
        e: 'Taxtadagi yozuv', s: "Shahar taxtasida yozuv yonyapti: 5 ≤ 5. Belgi ikki shartdan iborat: kichik yoki teng.",
        a: 'Shu ikki shartdan nechtasi bajarildi?',
        y: "Besh beshdan kichik emas, lekin besh beshga teng. Bitta shart bajarildi — shuning uchun butun yozuv rost.",
        n: 'Har shartni alohida tekshiring: kichikmi? tengmi?',
        r: "≤ belgisi kamida bitta shart bajarilsa rost bo'ladi.",
        p: 'Javob',
      },
      {
        e: 'Надпись на табло', s: 'На городском табло горит запись: 5 ≤ 5. Знак состоит из двух условий: меньше или равно.',
        a: 'Сколько из этих двух условий выполнено?',
        y: 'Пять не меньше пяти, но пять равно пяти. Одно условие выполнено — поэтому вся запись истинна.',
        n: 'Проверь каждое условие отдельно: меньше? равно?',
        r: 'Знак ≤ верен, если выполнено хотя бы одно условие.',
        p: 'Ответ',
      }, 'numeric'),

    /* 3 · dnd · 🟢 — mulohazami yoki yo'q. */
    q('03', 'Bu mulohazami?', '🟢', 'd49-is-statement', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: 'Rost yoki yolg\'on deb bo\'ladimi?', s: "To'rtta yozuv. Mulohaza har doim yo rost, yo yolg'on bo'ladi.",
        a: 'Yozuvlarni ajrating: qaysilari mulohaza, qaysilari emas.',
        tokens: ['7 > 3', 'Hozir soat necha?', '4 + 4 = 9', 'Daftarni oching'],
        zones: ['Mulohaza', 'Mulohaza emas'],
        dndHint: 'Yozuvlar tugadi.',
        y: "7 > 3 rost, 4 + 4 = 9 yolg'on — ikkalasi ham mulohaza. Savol va iltimosga esa rost yoki yolg'on deb javob berib bo'lmaydi.",
        n: 'Bu yozuvga «rost» yoki «yolg\'on» deb javob berib bo\'ladimi?',
        r: 'Mulohaza — rost yoki yolg\'on deb baholanadigan tasdiq.',
      },
      {
        e: 'Можно сказать истина или ложь?', s: 'Четыре записи. Высказывание всегда либо истинно, либо ложно.',
        a: 'Разложи записи: какие высказывания, а какие нет.',
        tokens: ['7 > 3', 'Который сейчас час?', '4 + 4 = 9', 'Открой тетрадь'],
        zones: ['Высказывание', 'Не высказывание'],
        dndHint: 'Записи закончились.',
        y: '7 > 3 истинно, 4 + 4 = 9 ложно — обе записи высказывания. А вопросу и просьбе нельзя ответить «истина» или «ложь».',
        n: 'Можно ли ответить на эту запись словом «истина» или «ложь»?',
        r: 'Высказывание — это утверждение, которое можно оценить как истинное или ложное.',
      }),

    /* 4 · input · 🟡 — birorta shart bajarilmadi. */
    q('04', 'Nechta shart bajarildi?', '🟡', 'd49-three-ge-seven', 'input', '🔎', ['0'],
      {
        e: 'Boshqa yozuv', s: "Yozuv berilgan: 3 ≥ 7. Belgi ikki shartdan iborat: katta yoki teng.",
        a: 'Shu ikki shartdan nechtasi bajarildi?',
        y: "Uch yettidan katta emas va yettiga teng ham emas. Birorta shart bajarilmadi — demak yozuv yolg'on.",
        n: 'Ikkala qismni ham tekshiring: kattami? tengmi?',
        r: "Birorta shart bajarilmasa, yozuv yolg'on bo'ladi.",
        p: 'Javob',
      },
      {
        e: 'Другая запись', s: 'Дана запись: 3 ≥ 7. Знак состоит из двух условий: больше или равно.',
        a: 'Сколько из этих двух условий выполнено?',
        y: 'Три не больше семи и не равно семи. Ни одно условие не выполнено — значит запись ложная.',
        n: 'Проверь обе части: больше? равно?',
        r: 'Если не выполнено ни одно условие, запись ложная.',
        p: 'Ответ',
      }, 'numeric'),

    /* 5 · multi · 🟡 — rost yozuvlar. */
    q('05', 'Rost yozuvlar', '🟡', 'd49-true-records', 'multi', '🎯', [0, 2],
      {
        e: 'Tekshiring', s: "To'rtta yozuv. Ikkitasi rost.",
        a: 'Qaysi yozuvlar rost? Hammasini belgilang.',
        o: ['6 ≤ 6', '6 < 6', '9 ≥ 4', '4 > 9'],
        y: "6 ≤ 6 rost, chunki tenglik bor. 9 ≥ 4 rost, chunki to'qqiz to'rtdan katta.",
        n: 'Har belgini ikki qismga ajrating va kamida bittasi bajarilganini tekshiring.',
        r: '≤ va ≥ belgilari tenglikda ham rost.',
      },
      {
        e: 'Проверь', s: 'Четыре записи. Две из них истинные.',
        a: 'Какие записи истинные? Отметь все.',
        o: ['6 ≤ 6', '6 < 6', '9 ≥ 4', '4 > 9'],
        y: '6 ≤ 6 истинно, потому что есть равенство. 9 ≥ 4 истинно, потому что девять больше четырёх.',
        n: 'Раздели каждый знак на две части и проверь, выполнена ли хотя бы одна.',
        r: 'Знаки ≤ и ≥ верны и при равенстве.',
      }),

    /* 6 · choice · 🟡 — nega savol mulohaza emas. */
    q('06', 'Nega mulohaza emas?', '🟡', 'd49-why-not', 'choice', '🔒', 1,
      {
        e: 'Savolni ko\'ramiz', s: "«Hozir soat necha?» degan yozuv berilgan.",
        a: 'Nega bu mulohaza emas?',
        o: [
          'Chunki unda son yo\'q',
          'Chunki unga rost yoki yolg\'on deb javob berib bo\'lmaydi',
          'Chunki u juda qisqa',
          'Chunki unda belgi yo\'q',
        ],
        y: "Bu savol, unga son bilan javob beriladi, rost so'zi bilan emas. Mulohaza esa har doim yo rost, yo yolg'on bo'ladi.",
        n: 'Bu yozuvga «rost» deb javob berib bo\'ladimi?',
        by: [
          "Sonning bor-yo'qligi hal qilmaydi: «Bugun payshanba» ham mulohaza.",
          undefined,
          "Uzunlik hal qilmaydi: «7 > 3» ham qisqa, lekin mulohaza.",
          "Belgi shart emas: mulohaza so'zlar bilan ham yozilishi mumkin.",
        ],
        r: 'Savol va iltimos mulohaza emas.',
      },
      {
        e: 'Смотрим на вопрос', s: 'Дана запись «Который сейчас час?».',
        a: 'Почему это не высказывание?',
        o: [
          'Потому что в ней нет числа',
          'Потому что на неё нельзя ответить «истина» или «ложь»',
          'Потому что она слишком короткая',
          'Потому что в ней нет знака',
        ],
        y: 'Это вопрос, на него отвечают числом, а не словом «истина». А высказывание всегда либо истинно, либо ложно.',
        n: 'Можно ли ответить на эту запись словом «истина»?',
        by: [
          'Наличие числа не решает: «Сегодня четверг» тоже высказывание.',
          undefined,
          'Длина не решает: «7 > 3» тоже короткая, но это высказывание.',
          'Знак не обязателен: высказывание можно записать и словами.',
        ],
        r: 'Вопрос и просьба не являются высказываниями.',
      }),

    /* 7 · order · 🟡 — tekshiruv qadamlari. */
    q('07', 'Qanday tekshiramiz', '🟡', 'd49-check-steps', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "5 ≤ 5 yozuvini tekshiramiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Bitta shart bajarildi — yozuv rost', 'Belgini ikki qismga ajrataman', 'Har qismni alohida tekshiraman'],
        y: "Avval belgini qismlarga ajratamiz, keyin har birini tekshiramiz, oxirida xulosa chiqaramiz.",
        n: 'Tekshirishdan oldin belgi bilan nima qilish kerak?',
        r: 'Belgi to\'liq o\'qiladi va qismlarga ajratib tekshiriladi.',
      },
      {
        e: 'Три шага', s: 'Проверяем запись 5 ≤ 5.',
        a: 'Выбери шаги по порядку.',
        o: ['Одно условие выполнено — запись истинна', 'Разделяю знак на две части', 'Проверяю каждую часть отдельно'],
        y: 'Сначала разделяем знак на части, потом проверяем каждую, в конце делаем вывод.',
        n: 'Что нужно сделать со знаком до проверки?',
        r: 'Знак читают целиком и проверяют по частям.',
      }),

    /* 8 · multi · 🔴 — yolg'on yozuvlar. */
    q('08', 'Yolg\'on yozuvlar', '🔴', 'd49-false-records', 'multi', '🔎', [1, 3],
      {
        e: 'Xatoni toping', s: "To'rtta yozuv. Ikkitasi yolg'on.",
        a: 'Qaysi yozuvlar yolg\'on? Hammasini belgilang.',
        o: ['8 ≥ 8', '8 > 8', '5 ≤ 9', '9 ≤ 5'],
        y: "8 > 8 yolg'on, chunki sakkiz o'zidan katta emas. 9 ≤ 5 ham yolg'on: to'qqiz beshdan kichik ham, teng ham emas.",
        n: 'Belgida tenglik bormi? Bu javobni o\'zgartiradi.',
        r: '> belgisi tenglikni qabul qilmaydi, ≥ esa qabul qiladi.',
      },
      {
        e: 'Найди ошибку', s: 'Четыре записи. Две из них ложные.',
        a: 'Какие записи ложные? Отметь все.',
        o: ['8 ≥ 8', '8 > 8', '5 ≤ 9', '9 ≤ 5'],
        y: '8 > 8 ложно, потому что восемь не больше самого себя. 9 ≤ 5 тоже ложно: девять и не меньше пяти, и не равно.',
        n: 'Есть ли в знаке равенство? Это меняет ответ.',
        r: 'Знак > не принимает равенство, а знак ≥ принимает.',
      }),

    /* 9 · order · 🔴 — sonlarni tartiblash. */
    q('09', 'Qaysi son mos keladi', '🔴', 'd49-sort-numbers', 'order', '📈', [2, 0, 3, 1],
      {
        e: 'Chegara — 6', s: "To'rtta son. Ularni kichigidan kattasiga tartiblang.",
        a: 'Sonlarni kichigidan kattasiga tartiblang.',
        o: ['6', '9', '4', '7'],
        y: '4, keyin 6, keyin 7, oxirida 9. Endi ko\'rinadi: 4 ≤ 6 rost, 7 ≤ 6 esa yolg\'on.',
        n: 'Sonlarni odatdagidek solishtiring.',
        r: 'Tartiblangan qatorda tengsizlikning rostligi darrov ko\'rinadi.',
      },
      {
        e: 'Граница — 6', s: 'Четыре числа. Расставь их от меньшего к большему.',
        a: 'Расставь числа от меньшего к большему.',
        o: ['6', '9', '4', '7'],
        y: '4, потом 6, потом 7, в конце 9. Теперь видно: 4 ≤ 6 истинно, а 7 ≤ 6 ложно.',
        n: 'Сравнивай числа как обычно.',
        r: 'В упорядоченном ряду истинность неравенства видна сразу.',
      }),

    /* 10 · choice · 🔴 — tenglik va tengsizlik. */
    q('10', 'Qaysi gap to\'g\'ri?', '🔴', 'd49-final', 'choice', '🚀', 2,
      {
        e: 'Yakuniy mashq', s: "Ikki yozuv: 5 ≤ 5 va 5 < 5.",
        a: 'Ular haqida qaysi gap to\'g\'ri?',
        o: [
          'Ikkalasi ham rost',
          'Ikkalasi ham yolg\'on',
          'Birinchisi rost, ikkinchisi yolg\'on',
          'Birinchisi yolg\'on, ikkinchisi rost',
        ],
        y: "5 ≤ 5 rost, chunki tenglik bor. 5 < 5 esa yolg'on: besh o'zidan kichik emas, chiziqsiz belgi tenglikni qabul qilmaydi.",
        n: 'Belgi ostidagi chiziq bormi? U tenglikni qo\'shadi.',
        by: [
          "Ikkinchisi rost emas: chiziqsiz belgi tenglikni qabul qilmaydi.",
          "Birinchisi rost: unda tenglik bor.",
          undefined,
          "Aksincha: chiziqli belgi rost, chiziqsizi yolg'on.",
        ],
        r: 'Chiziq belgiga tenglikni qo\'shadi va javobni o\'zgartiradi.',
      },
      {
        e: 'Итоговое задание', s: 'Две записи: 5 ≤ 5 и 5 < 5.',
        a: 'Какое утверждение про них верно?',
        o: [
          'Обе истинные',
          'Обе ложные',
          'Первая истинная, вторая ложная',
          'Первая ложная, вторая истинная',
        ],
        y: '5 ≤ 5 истинно, потому что есть равенство. А 5 < 5 ложно: пять не меньше самого себя, знак без черты равенство не принимает.',
        n: 'Есть ли черта под знаком? Она добавляет равенство.',
        by: [
          'Вторая не истинна: знак без черты не принимает равенство.',
          'Первая истинна: в ней есть равенство.',
          undefined,
          'Наоборот: знак с чертой истинен, без черты ложен.',
        ],
        r: 'Черта добавляет знаку равенство и меняет ответ.',
      }),
  ],
};

export default DARS49_BANK;
