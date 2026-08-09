// Dars 2 amaliyoti — Sonlarni o'qish va yozish.
// Manba: 3-sinf darsligi (Burxonov va b., 2019), 1-bob 1-6-dars; mashq daftari 3-8-betlar.
// Kombinatorika: darslik 15-bet, 1-topshiriq (9, 0, 4 raqamlaridan uch xonali sonlar).
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 choice · 2 match · 3 multi · 4 dnd · 5 match · 6 input · 7 dnd · 8 order · 9 input · 10 order
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS02_BANK = {
  title: "Dars 2 · Sonlarni o'qish va yozish",
  items: [

    /* 1 · choice · 🟢 — 340 ni o'qish. Eski D02_01, 4-chi variant qo'shildi. */
    q('01', "Sonni o'qing", '🟢', 'd02-read-340', 'choice', '🔤', 0,
      {
        e: "Sonni o'qing", s: "«Yulduzcha» ko'rik-tanlovida 340 nafar ishtirokchi qatnashdi.",
        a: "340 soni qanday o'qiladi?",
        o: ['uch yuz qirq', "uch yuz to'rt", "o'ttiz to'rt", "uch yuz o'n to'rt"],
        y: "340 = 3 yuzlik va 4 o'nlik: uch yuz qirq.",
        n: "Avval yuzliklarni o'qing, keyin o'nliklarni.",
        by: [
          undefined,
          "Bu o'qilishda 4 birlik bo'lib qoladi. 4 raqami 340 da qaysi razryadda turibdi?",
          "Bu o'qilishda yuzlik umuman yo'q. Sonning birinchi raqamini unutdingizmi?",
          "Bu o'qilishda o'nlik ham, birlik ham bor. 340 da birlik nechta?",
        ],
        r: "Son razryadlar bo'yicha o'qiladi: 340 — uch yuz (300) qirq (40). Oxirgi 0 alohida o'qilmaydi.",
      },
      {
        e: 'Прочитай число', s: 'В конкурсе «Юлдузча» участвовали 340 человек.',
        a: 'Как читается число 340?',
        o: ['триста сорок', 'триста четыре', 'тридцать четыре', 'триста четырнадцать'],
        y: '340 = 3 сотни и 4 десятка: триста сорок.',
        n: 'Сначала читай сотни, потом десятки.',
        by: [
          undefined,
          'В этом чтении получается 4 единицы. В каком разряде стоит цифра 4 в числе 340?',
          'В этом чтении вообще нет сотен. Ты не потерял первую цифру числа?',
          'В этом чтении есть и десятки, и единицы. Сколько единиц в числе 340?',
        ],
        r: 'Число читается по разрядам: 340 — триста (300) сорок (40). Ноль в конце отдельно не читается.',
      }, undefined, {
        art: { plate: '340' },
      }),

    /* 2 · match · 🟢 — son va uning o'qilishi. Eski D02_03. */
    q('02', 'Moslashtiring', '🟢', 'd02-match-read', 'match', '🔗', [0, 1, 2],
      {
        e: 'Moslashtiring', s: "Do'kon displeylarida sonlar, kartochkalarda esa o'qilishlari.",
        a: "Har sonni o'z o'qilishiga ulang.",
        left: ['680', '430', '903'],
        right: ['olti yuz sakson', "to'rt yuz o'ttiz", "to'qqiz yuz uch"],
        y: "680 — olti yuz sakson, 430 — to'rt yuz o'ttiz, 903 — to'qqiz yuz uch.",
        n: "Har sonni razryadlab o'qing: avval yuzligi, keyin o'nligi, oxirida birligi.",
        r: "O'qishda nol tushib qolmasin: 903 — to'qqiz yuz uch, o'nlik yo'q.",
      },
      {
        e: 'Соедини пары', s: 'На дисплеях магазинов числа, на карточках их чтение.',
        a: 'Соедини каждое число с его чтением.',
        left: ['680', '430', '903'],
        right: ['шестьсот восемьдесят', 'четыреста тридцать', 'девятьсот три'],
        y: '680 — шестьсот восемьдесят, 430 — четыреста тридцать, 903 — девятьсот три.',
        n: 'Читай каждое число по разрядам: сначала сотни, потом десятки, в конце единицы.',
        r: 'При чтении ноль не должен теряться: 903 — девятьсот три, десятков нет.',
      }, undefined, {
        art: { plates: ['680', '430', '903'] },
        artSpotlight: [{ plate: '680' }, { plate: '430' }, { plate: '903' }],
        leftArt: [{ plate: '680' }, { plate: '430' }, { plate: '903' }],
      }),

    /* 3 · multi · 🟢 — nol o'nliklar o'rnida. */
    q('03', "Nol qayerda?", '🟢', 'd02-zero-tens-multi', 'multi', '0️⃣', [0, 1, 3],
      {
        e: 'Diqqat, nol', s: "Displeyda to'rtta son. Ba'zilarida o'nlik umuman yo'q.",
        a: "Qaysi sonlarda o'nlik YO'Q? Hammasini belgilang.",
        o: ['903', '807', '430', '605'],
        y: "903, 807 va 605 da o'rtadagi raqam nol — o'nlik yo'q. 430 da esa 3 o'nlik bor.",
        n: "Har sonning O'RTASIDAGI raqamga qarang: o'nliklar razryadi o'sha yerda.",
        r: "O'rtadagi nol o'nlik yo'qligini bildiradi, lekin joyni saqlaydi: 903, 807, 605.",
      },
      {
        e: 'Внимание, ноль', s: 'На дисплее четыре числа. В некоторых десятков нет совсем.',
        a: 'В каких числах НЕТ десятков? Отметь все.',
        o: ['903', '807', '430', '605'],
        y: 'В 903, 807 и 605 средняя цифра ноль — десятков нет. А в 430 три десятка.',
        n: 'Смотри на СРЕДНЮЮ цифру каждого числа: там стоит разряд десятков.',
        r: 'Ноль в середине показывает, что десятков нет, но место сохраняет: 903, 807, 605.',
      }, undefined, {
        art: { plates: ['903', '807', '430', '605'] },
        optionArt: [{ plate: '903' }, { plate: '807' }, { plate: '430' }, { plate: '605' }],
      }),

    /* 4 · dnd · 🟡 — «yonma-yon yopishtirish» tuzog'i. Eski D02_06 (concat_trap).
       Ikkita son diktant qilinadi, mezon bitta: yozuv to'g'rimi. */
    q('04', "To'g'ri yozuvmi?", '🟡', 'd02-concat-sort', 'dnd', '🗂️', [0, 1, 0, 1],
      {
        e: "Qaysi yozuv to'g'ri?", s: "O'qituvchi ikki sonni aytdi: sakkiz yuz to'qson va to'qqiz yuz besh. Jurnalga turlicha yozishibdi.",
        a: "Yozuvlarni ajrating: qaysilari to'g'ri, qaysilari xato.",
        tokens: ['890', '8090', '905', '9005'],
        zones: ["To'g'ri yozuv", "Noto'g'ri yozuv"],
        dndHint: 'Yozuvlar tugadi.',
        y: "890 va 905 to'g'ri yozilgan. 8090 va 9005 da yuzlik bilan qolgani yonma-yon yozib yuborilgan.",
        n: "Har yozuvda nechta raqam borligini sanang. Uch xonali sonda faqat uchta katak bo'ladi.",
        r: "Sakkiz yuz (800) va to'qson (90) yonma-yon yozilmaydi, qo'shiladi: 890.",
      },
      {
        e: 'Какая запись верна?', s: 'Учитель продиктовал два числа: восемьсот девяносто и девятьсот пять. В журнал записали по-разному.',
        a: 'Разложи записи: где число записано верно, а где с ошибкой.',
        tokens: ['890', '8090', '905', '9005'],
        zones: ['Верная запись', 'Неверная запись'],
        dndHint: 'Записи закончились.',
        y: '890 и 905 записаны верно. В 8090 и 9005 сотни и остальное написали рядом, вместо того чтобы сложить.',
        n: 'Посчитай, сколько цифр в каждой записи. В трёхзначном числе только три клетки.',
        r: 'Восемьсот (800) и девяносто (90) не пишутся рядом, а складываются: 890.',
      }, undefined, {
        art: { plates: ['890', '8090', '905', '9005'] },
        tokenArt: [{ plate: '890' }, { plate: '8090' }, { plate: '905' }, { plate: '9005' }],
      }),

    /* 5 · match · 🟡 — o'xshash o'qilishlar. Eski D02_10 (discriminate). */
    q('05', 'Sinchiklab ulang', '🟡', 'd02-discriminate', 'match', '🧐', [0, 1, 2],
      {
        e: 'Sinchiklab ulang', s: "O'qilishlar juda o'xshash: bitta bo'g'in farq qiladi.",
        a: "Har sonni o'z o'qilishiga ulang.",
        left: ['490', '409', '400'],
        right: ["to'rt yuz to'qson", "to'rt yuz to'qqiz", "to'rt yuz"],
        y: "To'qson — o'nliklar (90), to'qqiz — birliklar (9). 490, 409 va 400 — uch xil son.",
        n: "So'zning oxiriga qarang: «to'qson» o'nlik, «to'qqiz» birlik.",
        r: "490 — to'rt yuz to'qson, 409 — to'rt yuz to'qqiz: bitta bo'g'in farqi, boshqa-boshqa sonlar.",
      },
      {
        e: 'Соедини внимательно', s: 'Чтения очень похожи: отличается один слог.',
        a: 'Соедини каждое число с его чтением.',
        left: ['490', '409', '400'],
        right: ['четыреста девяносто', 'четыреста девять', 'четыреста'],
        y: 'Девяносто — десятки (90), девять — единицы (9). 490, 409 и 400 — три разных числа.',
        n: 'Смотри на конец слова: «девяносто» — десятки, «девять» — единицы.',
        r: '490 — четыреста девяносто, 409 — четыреста девять: один слог разницы, разные числа.',
      }, undefined, {
        art: { plates: ['490', '409', '400'] },
        artSpotlight: [{ plate: '490', lit: 1 }, { plate: '409', lit: 2 }, { plate: '400' }],
        leftArt: [{ plate: '490' }, { plate: '409' }, { plate: '400' }],
      }),

    /* 6 · input · 🟡 — so'zdan songa. Eski D02_04 (write_num). */
    q('06', 'Sonni yozing', '🟡', 'd02-write-410', 'input', '✍️', ['410'],
      {
        e: 'Sonni yozing', s: "Orif akaning otarida to'rt yuz o'nta qo'y va echki bor. Jurnalga yozish kerak.",
        a: "«To'rt yuz o'n» sonini raqamlar bilan yozing.",
        y: "To'rt yuz o'n = 410: 4 yuzlik, 1 o'nlik, 0 birlik.",
        n: "Har razryad O'Z katagiga yoziladi. «To'rt yuz» va «o'n» yonma-yon yopishtirilmaydi.",
        r: "To'rt yuz (400) + o'n (10) = 410 — uch xonali son, 40010 emas.",
        p: 'Javob',
      },
      {
        e: 'Запиши число', s: 'В отаре Орифа-ака четыреста десять овец и коз. Нужно записать в журнал.',
        a: 'Запиши число «четыреста десять» цифрами.',
        y: 'Четыреста десять = 410: 4 сотни, 1 десяток, 0 единиц.',
        n: 'Каждый разряд пишется в СВОЮ клетку. «Четыреста» и «десять» не склеиваются рядом.',
        r: 'Четыреста (400) + десять (10) = 410 — трёхзначное число, а не 40010.',
        p: 'Ответ',
      }, 'numeric', {
        art: { pv: { h: 4, t: 1 }, captions: { h: 'yuzlik', t: "o'nlik" } },
      }),

    /* 7 · dnd · 🟡 — KOMBINATORIKA. Darslik 15-bet, 1-topshiriq: 9, 0, 4 raqamlari. */
    q('07', 'Eng katta son', '🟡', 'd02-combi-max', 'dnd', '🎯', [0, 2, 1],
      {
        e: 'Kombinatorika', s: "Uchta raqam-karta berilgan: 9, 0 va 4. Ulardan uch xonali sonlar yasash mumkin.",
        a: 'Kartalarni shunday joylangki, ENG KATTA uch xonali son hosil bo\'lsin.',
        tokens: ['9', '0', '4'],
        zones: ['Yuzliklar', "O'nliklar", 'Birliklar'],
        dndHint: 'Kartalar tugadi.',
        y: "Eng katta son — 940: eng katta raqam eng qimmat joyga, yuzlikka tushadi.",
        n: "Qaysi joy eng qimmat? O'sha joyga eng katta raqamni qo'ying.",
        r: "Raqamlarni kamayish tartibida joylaymiz: 9, 4, 0 → 940.",
      },
      {
        e: 'Комбинаторика', s: 'Даны три карточки с цифрами: 9, 0 и 4. Из них можно составлять трёхзначные числа.',
        a: 'Разложи карточки так, чтобы получилось САМОЕ БОЛЬШОЕ трёхзначное число.',
        tokens: ['9', '0', '4'],
        zones: ['Сотни', 'Десятки', 'Единицы'],
        dndHint: 'Карточки закончились.',
        y: 'Самое большое число — 940: самая большая цифра встаёт на самое дорогое место, в сотни.',
        n: 'Какое место самое дорогое? Туда и ставь самую большую цифру.',
        r: 'Ставим цифры по убыванию: 9, 4, 0 → 940.',
      }, undefined, {
        art: { plates: ['9', '0', '4'] },
        tokenArt: [{ digit: '9', kind: 'h' }, { digit: '0', kind: 't' }, { digit: '4', kind: 'o' }],
        zoneArt: [{ piece: 'h', count: 1 }, { piece: 't', count: 1 }, { piece: 'o', count: 1 }],
      }),

    /* 8 · order · 🔴 — KOMBINATORIKA, teskari vazifa. Eski D02_09 (digits_min). */
    q('08', 'Eng kichik son', '🔴', 'd02-combi-min', 'order', '🔻', [2, 1, 0],
      {
        e: 'Kombinatorika', s: "Yana o'sha kartalar: 9, 0 va 4. Endi teskari vazifa.",
        a: "Kartalarni shunday tartiblangki, ENG KICHIK uch xonali son hosil bo'lsin.",
        o: ['9', '0', '4'],
        y: "Eng kichik son — 409. Nol birinchi turolmaydi, shuning uchun 4 boshlaydi, 0 esa o'rtaga tushadi.",
        n: "Kichik raqam oldinda turishi kerak. Lekin nol birinchi turolmaydi — unda son uch xonali bo'lmay qoladi.",
        r: "Nol sonni boshlay olmaydi: eng kichigi 409, 049 emas.",
      },
      {
        e: 'Комбинаторика', s: 'Снова те же карточки: 9, 0 и 4. Теперь обратная задача.',
        a: 'Расставь карточки так, чтобы получилось САМОЕ МАЛЕНЬКОЕ трёхзначное число.',
        o: ['9', '0', '4'],
        y: 'Самое маленькое число — 409. Ноль не может стоять первым, поэтому начинает 4, а 0 уходит в середину.',
        n: 'Маленькая цифра должна стоять впереди. Но ноль не может быть первым — тогда число перестанет быть трёхзначным.',
        r: 'Ноль не может начинать число: самое маленькое — 409, а не 049.',
      }, undefined, {
        orderBy: "raqamlarni sonda joylashtirish — kattalik bo'yicha emas",
        art: { plates: ['9', '0', '4'] },
        optionArt: [{ digit: '9', kind: 'h' }, { digit: '0', kind: 't' }, { digit: '4', kind: 'o' }],
      }),

    /* 9 · input · 🔴 — aytilmagan razryad. Eski D02_05 (write_zero). */
    q('09', 'Nol bilan yozing', '🔴', 'd02-write-904', 'input', '🕳️', ['904'],
      {
        e: 'Nol bilan yozing', s: "Displey sonni so'z bilan ko'rsatdi. Diqqat: o'nliklar aytilmagan.",
        a: "«To'qqiz yuz to'rt» sonini raqamlar bilan yozing.",
        y: "To'qqiz yuz to'rt = 904: 9 yuzlik, 0 o'nlik, 4 birlik.",
        n: "To'qqiz yuz — 9 yuzlik, to'rt — 4 birlik. O'nlik aytilmadi — o'sha razryadga nima yoziladi?",
        r: "Aytilmagan razryad o'rniga 0 yoziladi: to'qqiz yuz to'rt = 904, 94 emas.",
        p: 'Javob',
      },
      {
        e: 'Запиши с нулём', s: 'Дисплей показал число словами. Внимание: десятки не названы.',
        a: 'Запиши число «девятьсот четыре» цифрами.',
        y: 'Девятьсот четыре = 904: 9 сотен, 0 десятков, 4 единицы.',
        n: 'Девятьсот — 9 сотен, четыре — 4 единицы. Десятки не названы — что пишется в этом разряде?',
        r: 'Вместо неназванного разряда пишется 0: девятьсот четыре = 904, а не 94.',
        p: 'Ответ',
      }, 'numeric', {
        art: { pv: { h: 9, o: 4 }, captions: { h: 'yuzlik', o: 'birlik' } },
      }),

    /* 10 · order · 🔴 — KOMBINATORIKA: barcha variantlarni tartiblash. */
    q('10', 'Barcha sonlar', '🔴', 'd02-combi-all', 'order', '🚀', [1, 3, 0, 2],
      {
        e: 'Yakuniy mashq', s: "9, 0 va 4 raqamlaridan atigi to'rtta uch xonali son yasash mumkin. Hammasi shu yerda.",
        a: "Bu sonlarni kichigidan kattasiga qarab tartiblang.",
        o: ['904', '409', '940', '490'],
        y: "409, 490, 904, 940. Nol boshda turolmagani uchun yuzlikda faqat 4 yoki 9 bo'la oladi.",
        n: "Avval yuzligiga qarang: qaysi sonlar 4 bilan boshlanadi? Ular kichikroq.",
        r: "Nol boshda turolmaydi, shuning uchun uchta raqamdan olti emas, atigi to'rtta son chiqadi.",
      },
      {
        e: 'Итоговое задание', s: 'Из цифр 9, 0 и 4 можно составить всего четыре трёхзначных числа. Все они здесь.',
        a: 'Расставь эти числа от меньшего к большему.',
        o: ['904', '409', '940', '490'],
        y: '409, 490, 904, 940. Ноль не может стоять первым, поэтому в сотнях бывает только 4 или 9.',
        n: 'Сначала смотри на сотни: какие числа начинаются с 4? Они меньше.',
        r: 'Ноль не может стоять первым, поэтому из трёх цифр получается не шесть чисел, а всего четыре.',
      }, undefined, {
        optionArt: [{ plate: '904' }, { plate: '409' }, { plate: '940' }, { plate: '490' }],
      }),
  ],
};

export default DARS02_BANK;
