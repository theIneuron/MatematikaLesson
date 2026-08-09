// Dars 29 amaliyoti — Kasrlarni taqqoslash.
// Nazariya: src/components/grade3/Dars29.jsx (num-3-29).
// Maxraj mos kelsa suratlarni sanaymiz (3/8 < 5/8), surat mos kelsa maxrajlarga
// qaraymiz (2/3 > 2/5).
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 input · 2 order · 3 dnd · 4 input · 5 multi · 6 match · 7 order · 8 multi · 9 choice · 10 dnd
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS29_BANK = {
  title: 'Dars 29 · Kasrlarni taqqoslash',
  items: [

    /* 1 · input · 🟢 — nechta bo'lak ko'p. */
    q('01', 'Nechtaga ko\'p?', '🟢', 'd29-how-many-more', 'input', '🔢', ['2'],
      {
        e: 'Maxraj bir xil', s: "Ikki kasr: 3/8 va 5/8. Bo'laklar bir xil kattalikda.",
        a: '5/8 da 3/8 ga qaraganda nechta bo\'lak ko\'p?',
        y: "5 − 3 = 2 ta bo'lak. Maxraj bir xil, shuning uchun faqat suratlarni sanaymiz.",
        n: 'Bo\'laklar bir xil, demak faqat ularning sonini solishtiring.',
        r: 'Maxraj bir xil bo\'lsa, suratlarni sanaymiz: 3/8 < 5/8.',
        p: 'Javob',
      },
      {
        e: 'Знаменатель одинаковый', s: 'Две дроби: 3/8 и 5/8. Части одинакового размера.',
        a: 'На сколько частей в 5/8 больше, чем в 3/8?',
        y: '5 − 3 = 2 части. Знаменатель одинаковый, поэтому считаем только числители.',
        n: 'Части одинаковые, значит сравнивай только их количество.',
        r: 'При одинаковом знаменателе считаем числители: 3/8 < 5/8.',
        p: 'Ответ',
      }),

    /* 2 · order · 🟢 — bir xil maxraj. */
    q('02', 'Bir xil maxraj', '🟢', 'd29-same-denom', 'order', '📈', [1, 3, 0, 2],
      {
        e: 'Sakkizdan bo\'laklar', s: "To'rtta kasrda maxraj bir xil: 8.",
        a: 'Kasrlarni kichigidan kattasiga qarab tartiblang.',
        o: ['5/8', '1/8', '7/8', '3/8'],
        y: '1/8 < 3/8 < 5/8 < 7/8: bo\'laklar bir xil, faqat soni har xil.',
        n: 'Maxraj bir xil bo\'lsa, faqat suratlarni tartiblang.',
        r: 'Maxraj mos kelsa, suratlarni sanaymiz.',
      },
      {
        e: 'Восьмые части', s: 'У четырёх дробей знаменатель одинаковый: 8.',
        a: 'Расставь дроби от меньшей к большей.',
        o: ['5/8', '1/8', '7/8', '3/8'],
        y: '1/8 < 3/8 < 5/8 < 7/8: части одинаковые, отличается только их количество.',
        n: 'Если знаменатель одинаковый, расставляй только по числителям.',
        r: 'Если знаменатели совпадают, считаем числители.',
      }),

    /* 3 · dnd · 🟢 — nimaga qarash kerak. */
    q('03', 'Nimaga qaraymiz?', '🟢', 'd29-what-to-check', 'dnd', '🔍', [0, 1, 0, 1],
      {
        e: 'Ikki yo\'l', s: "To'rtta juftlik. Ba'zilarida maxraj mos keladi, ba'zilarida surat.",
        a: 'Juftliklarni ajrating: qayerda suratlarni sanaymiz, qayerda maxrajlarga qaraymiz.',
        tokens: ['3/8 va 5/8', '2/3 va 2/5', '1/4 va 3/4', '4/7 va 4/9'],
        zones: ['Suratlarni sanaymiz', 'Maxrajlarga qaraymiz'],
        dndHint: 'Juftliklar tugadi.',
        y: "Maxraj mos kelsa suratlarni sanaymiz; surat mos kelsa maxrajlarga qaraymiz.",
        n: 'Har juftlikda nima bir xil: chiziq ustidagi son yoki tagidagi?',
        r: 'Avval nima mos kelganiga qaraymiz.',
      },
      {
        e: 'Два пути', s: 'Четыре пары. В одних совпадает знаменатель, в других числитель.',
        a: 'Разложи пары: где считаем числители, а где смотрим на знаменатели.',
        tokens: ['3/8 и 5/8', '2/3 и 2/5', '1/4 и 3/4', '4/7 и 4/9'],
        zones: ['Считаем числители', 'Смотрим на знаменатели'],
        dndHint: 'Пары закончились.',
        y: 'Если совпадает знаменатель — считаем числители; если числитель — смотрим на знаменатели.',
        n: 'Что одинаково в каждой паре: число над чертой или под чертой?',
        r: 'Сначала смотрим, что совпало.',
      }),

    /* 4 · input · 🟡 — qaysi maxraj yirikroq bo'lak beradi. */
    q('04', 'Yirik bo\'lak', '🟡', 'd29-bigger-piece', 'input', '📏', ['3'],
      {
        e: 'Surat bir xil', s: "Ikki kasr: 2/3 va 2/5. Ikkalasida ham ikkitadan bo'lak olingan.",
        a: 'Qaysi maxrajda bo\'lak yirikroq? Maxrajni yozing.',
        y: "3: butun 3 ga bo'linsa, bo'laklar yirikroq bo'ladi. Shuning uchun 2/3 > 2/5.",
        n: "Bo'laklar soni bir xil. Qaysi butun kamroq bo'lakka bo'lingan?",
        r: "Surat mos kelsa, maxraji kichigi katta kasr bo'ladi.",
        p: 'Javob',
      },
      {
        e: 'Крупная часть', s: 'Две дроби: 2/3 и 2/5. В обеих взяли по две части.',
        a: 'При каком знаменателе часть крупнее? Запиши знаменатель.',
        y: '3: если целое разделить на 3, части выйдут крупнее. Поэтому 2/3 > 2/5.',
        n: 'Число частей одинаковое. Какое целое разделили на меньше частей?',
        r: 'Если числители совпадают, больше та дробь, у которой знаменатель меньше.',
        p: 'Ответ',
      }, 'numeric'),

    /* 5 · multi · 🟡 — 1/2 dan katta. */
    q('05', 'Yarmidan katta', '🟡', 'd29-gt-half', 'multi', '🎯', [1, 3],
      {
        e: 'Yarim bilan solishtiring', s: "To'rtta kasr. Ba'zilari yarmidan katta.",
        a: 'Qaysi kasrlar 1/2 dan KATTA? Hammasini belgilang.',
        o: ['3/8', '5/8', '2/5', '4/7'],
        y: '5/8 va 4/7 — surat maxrajning yarmidan katta: 8 ning yarmi 4, 7 ning yarmi 3 dan sal ko\'p.',
        n: 'Har kasrda maxrajning yarmini toping va suratni u bilan solishtiring.',
        r: "Surat maxrajning yarmidan katta bo'lsa, kasr yarmidan katta.",
      },
      {
        e: 'Сравни с половиной', s: 'Четыре дроби. Некоторые больше половины.',
        a: 'Какие дроби БОЛЬШЕ 1/2? Отметь все.',
        o: ['3/8', '5/8', '2/5', '4/7'],
        y: '5/8 и 4/7 — числитель больше половины знаменателя: половина от 8 это 4, от 7 — чуть больше 3.',
        n: 'В каждой дроби найди половину знаменателя и сравни с ней числитель.',
        r: 'Если числитель больше половины знаменателя, дробь больше половины.',
      }),

    /* 6 · match · 🟡 — juftlik va belgi. */
    q('06', 'Belgini tanlang', '🟡', 'd29-match-sign', 'match', '⚖️', [0, 1, 2],
      {
        e: 'Uch juftlik', s: "Har juftlikda o'z taqqoslash yo'li bor.",
        a: 'Har juftlikni mos belgiga ulang.',
        left: ['3/8 va 5/8', '2/3 va 2/5', '4/9 va 4/9'],
        right: ['kichik', 'katta', 'teng'],
        y: '3/8 < 5/8 (suratlar), 2/3 > 2/5 (maxrajlar), 4/9 = 4/9.',
        n: 'Har juftlikda avval nima mos kelganini aniqlang.',
        r: 'Maxraj mos kelsa suratlarni, surat mos kelsa maxrajlarni solishtiramiz.',
      },
      {
        e: 'Три пары', s: 'В каждой паре свой способ сравнения.',
        a: 'Соедини каждую пару с нужным знаком.',
        left: ['3/8 и 5/8', '2/3 и 2/5', '4/9 и 4/9'],
        right: ['меньше', 'больше', 'равно'],
        y: '3/8 < 5/8 (по числителям), 2/3 > 2/5 (по знаменателям), 4/9 = 4/9.',
        n: 'В каждой паре сначала определи, что совпало.',
        r: 'Совпал знаменатель — сравниваем числители, совпал числитель — знаменатели.',
      }),

    /* 7 · order · 🟡 — bir xil surat. */
    q('07', 'Bir xil surat', '🟡', 'd29-same-num', 'order', '📉', [3, 1, 0, 2],
      {
        e: 'Ikkitadan bo\'lak', s: "To'rtta kasrda surat bir xil: 2.",
        a: 'Kasrlarni kichigidan kattasiga qarab tartiblang.',
        o: ['2/5', '2/7', '2/3', '2/9'],
        y: '2/9 < 2/7 < 2/5 < 2/3: maxraj qancha katta bo\'lsa, bo\'lak shuncha mayda.',
        n: "Bo'laklar soni bir xil. Maxraj katta bo'lsa, bo'lak mayda bo'ladi.",
        r: "Surat mos kelsa, maxraji kattasi kichik kasr bo'ladi.",
      },
      {
        e: 'По две части', s: 'У четырёх дробей числитель одинаковый: 2.',
        a: 'Расставь дроби от меньшей к большей.',
        o: ['2/5', '2/7', '2/3', '2/9'],
        y: '2/9 < 2/7 < 2/5 < 2/3: чем больше знаменатель, тем мельче часть.',
        n: 'Число частей одинаковое. Чем больше знаменатель, тем мельче часть.',
        r: 'Если числители совпадают, меньше та дробь, у которой знаменатель больше.',
      }),

    /* 8 · multi · 🔴 — butundan katta. */
    q('08', 'Butundan katta', '🔴', 'd29-gt-one', 'multi', '⭕', [1, 2],
      {
        e: 'Bir butun chegara', s: "To'rtta kasr. Ba'zilari butundan katta.",
        a: 'Qaysi kasrlar BUTUNDAN katta? Hammasini belgilang.',
        o: ['5/8', '9/8', '7/5', '4/5'],
        y: '9/8 va 7/5 — surat maxrajdan katta, demak kasr butundan ham katta.',
        n: 'Har kasrda suratni maxraj bilan solishtiring.',
        r: "Surat maxrajdan katta bo'lsa, kasr butundan katta.",
      },
      {
        e: 'Больше целого', s: 'Четыре дроби. Некоторые больше целого.',
        a: 'Какие дроби БОЛЬШЕ целого? Отметь все.',
        o: ['5/8', '9/8', '7/5', '4/5'],
        y: 'У 9/8 и 7/5 числитель больше знаменателя, значит и дробь больше целого.',
        n: 'В каждой дроби сравни числитель со знаменателем.',
        r: 'Если числитель больше знаменателя, дробь больше целого.',
      }),

    /* 9 · choice · 🔴 — hech nima mos kelmasa. */
    q('09', 'Hech nima mos kelmadi', '🔴', 'd29-neither', 'choice', '🧐', 0,
      {
        e: 'Uchinchi yo\'l', s: "Ikki kasr: 3/8 va 4/5. Na surat, na maxraj mos keladi.",
        a: 'Qaysi kasr katta?',
        o: ['4/5', '3/8', 'Teng', 'Solishtirib bo\'lmaydi'],
        y: "3/8 yarmidan kichik (8 ning yarmi 4), 4/5 esa yarmidan katta. Demak 4/5 > 3/8.",
        n: "Hech nima mos kelmasa, ikkalasini ham YARIM bilan solishtiring.",
        by: [
          undefined,
          "3/8 da surat 8 ning yarmidan kichik, demak kasr yarmidan kichik.",
          "Bir kasr yarmidan kichik, ikkinchisi katta. Ular teng bo'lolmaydi.",
          "Har qanday ikki kasrni solishtirish mumkin: yarim orqali yo'l bor.",
        ],
        r: "Hech nima mos kelmasa, yarim bilan solishtirish yordam beradi.",
      },
      {
        e: 'Третий путь', s: 'Две дроби: 3/8 и 4/5. Не совпадают ни числители, ни знаменатели.',
        a: 'Какая дробь больше?',
        o: ['4/5', '3/8', 'Равны', 'Сравнить нельзя'],
        y: '3/8 меньше половины (половина от 8 это 4), а 4/5 больше половины. Значит 4/5 > 3/8.',
        n: 'Если ничего не совпало, сравни обе с ПОЛОВИНОЙ.',
        by: [
          undefined,
          'У 3/8 числитель меньше половины от 8, значит дробь меньше половины.',
          'Одна дробь меньше половины, другая больше. Равными они быть не могут.',
          'Любые две дроби сравнить можно: помогает сравнение с половиной.',
        ],
        r: 'Если ничего не совпало, помогает сравнение с половиной.',
      }),

    /* 10 · dnd · 🔴 — yarim chegarasi. */
    q('10', 'Yarim chegarasi', '🔴', 'd29-half-sort', 'dnd', '🚀', [1, 0, 1, 0],
      {
        e: 'Yakuniy mashq', s: "To'rtta kasr. Har birini yarim bilan solishtiring.",
        a: 'Kasrlarni ajrating: qaysilari yarmidan katta, qaysilari kichik.',
        tokens: ['3/8', '4/5', '2/7', '5/9'],
        zones: ['Yarmidan katta', 'Yarmidan kichik'],
        dndHint: 'Kasrlar tugadi.',
        y: '4/5 va 5/9 — surat maxrajning yarmidan katta. 3/8 va 2/7 — kichik.',
        n: "Har kasrda maxrajning yarmini toping: 8 ning yarmi 4, 9 ning yarmi 4 dan sal ko'p.",
        r: 'Yarim bilan solishtirish har xil kasrlarni ham taqqoslashga yordam beradi.',
      },
      {
        e: 'Граница — половина', s: 'Четыре дроби. Сравни каждую с половиной.',
        a: 'Разложи дроби: какие больше половины, а какие меньше.',
        tokens: ['3/8', '4/5', '2/7', '5/9'],
        zones: ['Больше половины', 'Меньше половины'],
        dndHint: 'Дроби закончились.',
        y: 'У 4/5 и 5/9 числитель больше половины знаменателя. У 3/8 и 2/7 меньше.',
        n: 'В каждой дроби найди половину знаменателя: половина от 8 это 4, от 9 — чуть больше 4.',
        r: 'Сравнение с половиной помогает сравнивать даже непохожие дроби.',
      }),
  ],
};

export default DARS29_BANK;
