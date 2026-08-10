// Dars 3 amaliyoti — Razryad qo'shiluvchilari.
// Manba: 3-sinf darsligi (Burxonov va b., 2019), 1-bob 7-10-dars; mashq daftari 9-11-betlar.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 input · 2 choice · 3 dnd · 4 multi · 5 dnd · 6 match · 7 choice · 8 input · 9 order · 10 match
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS03_BANK = {
  title: "Dars 3 · Razryad qo'shiluvchilari",
  items: [

    /* 1 · input · 🟢 — yoyilmadan son. Eski D03_02 (compose_sum). */
    q('01', "Yig'indini toping", '🟢', 'd03-compose-446', 'input', '🧮', ['446'],
      {
        e: "Yig'indini toping", s: "Razryad qo'shiluvchilari yig'indisi berilgan.",
        a: "400 + 40 + 6 — qanday son hosil bo'ladi?",
        y: "400 + 40 + 6 = 446: yuzlik, o'nlik va birlik o'z joyiga tushdi.",
        n: "400 — yuzliklar, 40 — o'nliklar, 6 — birliklar. Har birini o'z razryad katagiga qo'ying.",
        r: "Yoyilmadan son yig'iladi: 400 + 40 + 6 = 446.",
        p: 'Javob',
      },
      {
        e: 'Найди сумму', s: 'Дана сумма разрядных слагаемых.',
        a: '400 + 40 + 6 — какое число получится?',
        y: '400 + 40 + 6 = 446: сотни, десятки и единицы встали на свои места.',
        n: '400 — сотни, 40 — десятки, 6 — единицы. Поставь каждое в свою разрядную клетку.',
        r: 'Из разложения собирается число: 400 + 40 + 6 = 446.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Find the sum', s: 'A sum of place values is given.',
          a: '400 + 40 + 6 — what number does it make?',
          y: '400 + 40 + 6 = 446: the hundreds, tens and ones took their places.',
          n: '400 is hundreds, 40 is tens, 6 is ones. Put each one into its own place cell.',
          r: 'A number is built back from its parts: 400 + 40 + 6 = 446.',
          p: 'Answer',
        },
      }),

    /* 2 · choice · 🟢 — yoyilma. Eski D03_01 (decompose), 4-chi variant qo'shildi. */
    q('02', 'Yoyilmani toping', '🟢', 'd03-decompose-427', 'choice', '🔍', 0,
      {
        e: "Razryad qo'shiluvchilari", s: "427 soni berilgan. Uni razryad qo'shiluvchilariga ajratamiz.",
        a: '427 sonining yoyilmasi qaysi?',
        o: ['400 + 20 + 7', '400 + 2 + 7', '40 + 20 + 7', '4 + 2 + 7'],
        y: "427 = 400 + 20 + 7: to'rt yuzlik, ikki o'nlik, yetti birlik.",
        n: "Har raqamning QIYMATINI oling: 4 yuzliklar joyida, 2 o'nliklar joyida.",
        by: [
          undefined,
          "Bu yerda 2 birlik bo'lib qolgan. 2 raqami 427 da qaysi razryadda turibdi?",
          "Bu yerda yuzlik yo'qolgan. 4 raqamining qiymati qancha?",
          "Bu yerda raqamlarning o'zi qo'shilgan. Ularni qo'shsangiz 427 qaytadimi?",
        ],
        r: "Yoyilmada har raqam o'z qiymati bilan yoziladi: 427 = 400 + 20 + 7.",
      },
      {
        e: 'Разрядные слагаемые', s: 'Дано число 427. Разложим его на разрядные слагаемые.',
        a: 'Какое разложение числа 427 верно?',
        o: ['400 + 20 + 7', '400 + 2 + 7', '40 + 20 + 7', '4 + 2 + 7'],
        y: '427 = 400 + 20 + 7: четыре сотни, два десятка, семь единиц.',
        n: 'Бери ЗНАЧЕНИЕ каждой цифры: 4 стоит на месте сотен, 2 — на месте десятков.',
        by: [
          undefined,
          'Здесь получилось 2 единицы. В каком разряде стоит цифра 2 в числе 427?',
          'Здесь потерялись сотни. Сколько стоит цифра 4?',
          'Здесь сложены сами цифры. Если их сложить, вернётся ли 427?',
        ],
        r: 'В разложении каждая цифра записывается со своим значением: 427 = 400 + 20 + 7.',
      }, undefined, {
        en: {
          e: 'Place values as parts', s: 'The number 427 is given. Let us split it into place values.',
          a: 'Which split of the number 427 is correct?',
          o: ['400 + 20 + 7', '400 + 2 + 7', '40 + 20 + 7', '4 + 2 + 7'],
          y: '427 = 400 + 20 + 7: four hundreds, two tens, seven ones.',
          n: 'Take the VALUE of every digit: the 4 stands in the hundreds place, the 2 in the tens.',
          by: [
            undefined,
            'Here the 2 turned into 2 ones. Which place does the digit 2 stand in inside 427?',
            'Here the hundreds got lost. How much is the digit 4 worth?',
            'Here the digits themselves were added. If you add them, do you get 427 back?',
          ],
          r: 'In a split every digit is written with its own value: 427 = 400 + 20 + 7.',
        },
        optionArt: [undefined, undefined, undefined, undefined],
      }),

    /* 3 · dnd · 🟢 — plitalarni tanlash. Eski D03_08 (build_plates). */
    q('03', 'Kerakli plitalar', '🟢', 'd03-plates-804', 'dnd', '🧱', [0, 1, 0, 1],
      {
        e: "Plitalarni tanlang", s: "804 sonini yig'ish kerak. Omborda to'rtta plita bor.",
        a: 'Plitalarni ajrating: qaysilari 804 uchun kerak, qaysilari kerak emas.',
        tokens: ['800', '40', '4', '80'],
        zones: ['804 uchun kerak', 'Kerak emas'],
        dndHint: 'Plitalar tugadi.',
        y: "804 = 800 + 4. O'nlik plitasi kerak emas — o'nliklar o'rnida 0 turibdi.",
        n: "804 da nechta yuzlik, nechta o'nlik, nechta birlik bor? Faqat bor razryadlarni oling.",
        r: "Nol razryadga plita olinmaydi: 804 = 800 + 4.",
      },
      {
        e: 'Выбери плитки', s: 'Нужно собрать число 804. На складе четыре плитки.',
        a: 'Разложи плитки: какие нужны для 804, а какие нет.',
        tokens: ['800', '40', '4', '80'],
        zones: ['Нужна для 804', 'Не нужна'],
        dndHint: 'Плитки закончились.',
        y: '804 = 800 + 4. Плитка десятков не нужна — на месте десятков стоит 0.',
        n: 'Сколько в 804 сотен, десятков, единиц? Бери только те разряды, которые есть.',
        r: 'На нулевой разряд плитка не берётся: 804 = 800 + 4.',
      }, undefined, {
        en: {
          e: 'Pick the tiles', s: 'You need to build the number 804. There are four tiles in the store.',
          a: 'Sort the tiles: which ones are needed for 804 and which are not.',
          tokens: ['800', '40', '4', '80'],
          zones: ['Needed for 804', 'Not needed'],
          dndHint: 'No tiles left.',
          y: '804 = 800 + 4. The tens tile is not needed — a 0 stands in the tens place.',
          n: 'How many hundreds, tens and ones are in 804? Take only the places that are really there.',
          r: 'An empty place gets no tile: 804 = 800 + 4.',
        },
        tokenArt: [{ plate: '800' }, { plate: '40' }, { plate: '4' }, { plate: '80' }],
      }),

    /* 4 · multi · 🟡 — yoyilmasi ikkita qo'shiluvchidan iborat sonlar. */
    q('04', "Ikkita qo'shiluvchi", '🟡', 'd03-two-addends', 'multi', '✌️', [0, 2, 3],
      {
        e: "Nechta qo'shiluvchi?", s: "Ba'zi sonlarning yoyilmasi uchta emas, ikkita qo'shiluvchidan iborat.",
        a: "Qaysi sonlarning yoyilmasida ATIGI IKKITA qo'shiluvchi bor? Hammasini belgilang.",
        o: ['903', '427', '750', '806'],
        y: "903 = 900 + 3, 750 = 700 + 50, 806 = 800 + 6 — har birida bitta razryad bo'sh. 427 da esa uchala razryad to'la.",
        n: "Har sonda nol bor-yo'qligini tekshiring: nol turgan razryad yoyilmaga qo'shiluvchi bermaydi.",
        r: "Bo'sh razryad yoyilmada qatnashmaydi, shuning uchun qo'shiluvchilar kamayadi.",
      },
      {
        e: 'Сколько слагаемых?', s: 'У некоторых чисел в разложении не три слагаемых, а два.',
        a: 'У каких чисел в разложении РОВНО ДВА слагаемых? Отметь все.',
        o: ['903', '427', '750', '806'],
        y: '903 = 900 + 3, 750 = 700 + 50, 806 = 800 + 6 — у каждого один разряд пустой. А у 427 все три разряда заполнены.',
        n: 'Проверь, есть ли в числе ноль: разряд с нулём не даёт слагаемого.',
        r: 'Пустой разряд не участвует в разложении, поэтому слагаемых становится меньше.',
      }, undefined, {
        en: {
          e: 'How many parts?', s: 'Some numbers split into two parts instead of three.',
          a: 'Which numbers split into EXACTLY TWO parts? Mark them all.',
          o: ['903', '427', '750', '806'],
          y: '903 = 900 + 3, 750 = 700 + 50, 806 = 800 + 6 — each of them has one empty place. And 427 has all three places filled.',
          n: 'Check whether the number has a zero: a place with a zero gives no part.',
          r: 'An empty place takes no part in the split, so there are fewer parts.',
        },
        optionArt: [{ plate: '903' }, { plate: '427' }, { plate: '750' }, { plate: '806' }],
      }),

    /* 5 · dnd · 🟡 — raqam va uning qiymati. Eski D03_05 (decompose_digit_trap). */
    q('05', 'Raqam yoki qiymat?', '🟡', 'd03-digit-vs-value', 'dnd', '⚖️', [0, 1, 0, 1],
      {
        e: 'Diqqat, tuzoq', s: "854 sonining yoyilmasi yozilmoqda. Kartalarning ba'zisi qiymat, ba'zisi shunchaki raqam.",
        a: "854 ning yoyilmasiga TUSHADIGAN kartalarni ajrating.",
        tokens: ['800', '5', '50', '8'],
        zones: ['Yoyilmaga tushadi', 'Tushmaydi'],
        dndHint: 'Kartalar tugadi.',
        y: "854 = 800 + 50 + 4. Yoyilmada raqamning o'zi emas, QIYMATI yoziladi: 8 emas, 800; 5 emas, 50.",
        n: "Yoyilmada raqam o'z qiymati bilan turadi. 5 raqami o'nliklar joyida — uning qiymati qancha?",
        r: "854 = 800 + 50 + 4. Raqamlarni oddiy qo'shsak (8 + 5 + 4 = 17) son qaytmaydi.",
      },
      {
        e: 'Внимание, ловушка', s: 'Записывают разложение числа 854. Часть карточек — значения, часть — просто цифры.',
        a: 'Отбери карточки, которые ВОЙДУТ в разложение 854.',
        tokens: ['800', '5', '50', '8'],
        zones: ['Войдёт в разложение', 'Не войдёт'],
        dndHint: 'Карточки закончились.',
        y: '854 = 800 + 50 + 4. В разложении пишется не сама цифра, а её ЗНАЧЕНИЕ: не 8, а 800; не 5, а 50.',
        n: 'В разложении цифра стоит со своим значением. Цифра 5 на месте десятков — сколько это?',
        r: '854 = 800 + 50 + 4. Если просто сложить цифры (8 + 5 + 4 = 17), число не вернётся.',
      }, undefined, {
        en: {
          e: 'Careful, a trap', s: 'Someone is writing the split of 854. Some cards are values, others are just digits.',
          a: 'Pick the cards that BELONG to the split of 854.',
          tokens: ['800', '5', '50', '8'],
          zones: ['Belongs to the split', 'Does not belong'],
          dndHint: 'No cards left.',
          y: '854 = 800 + 50 + 4. A split is written with the VALUE of a digit, not the digit itself: 800, not 8; 50, not 5.',
          n: 'In a split a digit stands with its value. The digit 5 is in the tens place — how much is that?',
          r: '854 = 800 + 50 + 4. Adding the bare digits (8 + 5 + 4 = 17) does not bring the number back.',
        },
        tokenArt: [{ plate: '800' }, { plate: '5' }, { plate: '50' }, { plate: '8' }],
      }),

    /* 6 · match · 🟡 — son va yoyilmasi. Eski D03_03 (match_expand). */
    q('06', 'Moslashtiring', '🟡', 'd03-match-expand', 'match', '🔗', [0, 1, 2],
      {
        e: 'Moslashtiring', s: "Har son o'z yoyilmasiga ulanishi kerak.",
        a: 'Har sonni uning yoyilmasiga ulang.',
        left: ['289', '341', '625'],
        right: ['200 + 80 + 9', '300 + 40 + 1', '600 + 20 + 5'],
        y: '289 = 200 + 80 + 9, 341 = 300 + 40 + 1, 625 = 600 + 20 + 5.',
        n: "Sonning birinchi raqami yoyilmadagi yuzlik bilan mos kelishi kerak.",
        r: "Yoyilma sonning razryadlarini ochib beradi: yuzlik, o'nlik, birlik.",
      },
      {
        e: 'Соедини пары', s: 'Каждое число должно соединиться со своим разложением.',
        a: 'Соедини каждое число с его разложением.',
        left: ['289', '341', '625'],
        right: ['200 + 80 + 9', '300 + 40 + 1', '600 + 20 + 5'],
        y: '289 = 200 + 80 + 9, 341 = 300 + 40 + 1, 625 = 600 + 20 + 5.',
        n: 'Первая цифра числа должна совпадать с сотнями в разложении.',
        r: 'Разложение раскрывает разряды числа: сотни, десятки, единицы.',
      }, undefined, {
        en: {
          e: 'Match the pairs', s: 'Every number has to meet its own split.',
          a: 'Connect each number with its split.',
          left: ['289', '341', '625'],
          right: ['200 + 80 + 9', '300 + 40 + 1', '600 + 20 + 5'],
          y: '289 = 200 + 80 + 9, 341 = 300 + 40 + 1, 625 = 600 + 20 + 5.',
          n: 'The first digit of the number must match the hundreds in the split.',
          r: 'A split opens up the places of a number: hundreds, tens, ones.',
        },
        leftArt: [{ plate: '289' }, { plate: '341' }, { plate: '625' }],
      }),

    /* 7 · choice · 🟡 — XATONI TOPING. Eski D03_10 (find_error), 4-chi variant qo'shildi. */
    q('07', 'Xatoni toping', '🟡', 'd03-find-error', 'choice', '🔎', 1,
      {
        e: 'Xatoni toping', s: "To'rtta yoyilma berilgan. Bittasida xato bor.",
        a: 'Qaysi yoyilma XATO?',
        o: ['427 = 400 + 20 + 7', '341 = 3 + 4 + 1', '750 = 700 + 50', '806 = 800 + 6'],
        y: "341 = 300 + 40 + 1 bo'lishi kerak. 3 + 4 + 1 = 8 — son qaytmaydi.",
        n: "Har yoyilmani tekshiring: qo'shiluvchilarni qo'shsangiz son qaytadimi?",
        by: [
          "Bu yoyilmani qo'shib ko'ring: natija 427 chiqadi. Demak xato bu yerda emas.",
          undefined,
          "Bu yoyilmada ikkita qo'shiluvchi bor, chunki birlik razryadi bo'sh. Qo'shib tekshiring.",
          "Bu yoyilmada ikkita qo'shiluvchi bor, chunki o'nlik razryadi bo'sh. Qo'shib tekshiring.",
        ],
        r: "Yoyilma tekshiruvi: qo'shiluvchilar yig'indisi sonning o'ziga teng bo'lishi shart.",
      },
      {
        e: 'Найди ошибку', s: 'Даны четыре разложения. В одном ошибка.',
        a: 'Какое разложение НЕВЕРНО?',
        o: ['427 = 400 + 20 + 7', '341 = 3 + 4 + 1', '750 = 700 + 50', '806 = 800 + 6'],
        y: 'Должно быть 341 = 300 + 40 + 1. А 3 + 4 + 1 = 8 — число не возвращается.',
        n: 'Проверь каждое разложение: если сложить слагаемые, вернётся ли число?',
        by: [
          'Сложи это разложение: получится 427. Значит, ошибка не здесь.',
          undefined,
          'Здесь два слагаемых, потому что разряд единиц пустой. Сложи и проверь.',
          'Здесь два слагаемых, потому что разряд десятков пустой. Сложи и проверь.',
        ],
        r: 'Проверка разложения: сумма слагаемых должна быть равна самому числу.',
      }, undefined, {
        en: {
          e: 'Find the mistake', s: 'Four splits are given. One of them is wrong.',
          a: 'Which split is WRONG?',
          o: ['427 = 400 + 20 + 7', '341 = 3 + 4 + 1', '750 = 700 + 50', '806 = 800 + 6'],
          y: 'It should be 341 = 300 + 40 + 1. And 3 + 4 + 1 = 8, so the number does not come back.',
          n: 'Check every split: if you add the parts, does the number come back?',
          by: [
            'Add this split up: you get 427. So the mistake is not here.',
            undefined,
            'There are two parts here because the ones place is empty. Add them up and check.',
            'There are two parts here because the tens place is empty. Add them up and check.',
          ],
          r: 'A split is checked like this: the parts added together must equal the number itself.',
        },
      }),

    /* 8 · input · 🔴 — razryadni ayirish. Eski D03_07 (strip_addends). */
    q('08', 'Razryadni o\'chiring', '🔴', 'd03-strip', 'input', '🔌', ['7'],
      {
        e: 'Razryadni o\'chiring', s: "Devorda 427 ta chiroq yonib turibdi: panellar, lentalar va yakka chiroqlar.",
        a: '427 − 400 − 20 = ? Nechta chiroq yonib qoldi?',
        y: "427 − 400 − 20 = 7: panellar va lentalar o'chdi, faqat 7 yakka chiroq qoldi.",
        n: "400 — bu barcha panellar, 20 — barcha lentalar. Ular o'chganda qaysi razryad qoladi?",
        r: "Sondan razryadni ayirsak, qolgan razryadlar o'zgarmaydi: 427 − 400 − 20 = 7.",
        p: 'Javob',
      },
      {
        e: 'Погаси разряд', s: 'На стене горят 427 огней: панели, ленты и отдельные лампочки.',
        a: '427 − 400 − 20 = ? Сколько огней осталось гореть?',
        y: '427 − 400 − 20 = 7: панели и ленты погасли, остались только 7 отдельных лампочек.',
        n: '400 — это все панели, 20 — все ленты. Какой разряд останется, когда они погаснут?',
        r: 'Если вычесть из числа разряд, остальные разряды не меняются: 427 − 400 − 20 = 7.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Switch a place off', s: '427 lights are on along the wall: panels, strips and separate bulbs.',
          a: '427 − 400 − 20 = ? How many lights are still on?',
          y: '427 − 400 − 20 = 7: the panels and the strips went out, only the 7 separate bulbs are left.',
          n: '400 is all the panels, 20 is all the strips. Which place is left when they go out?',
          r: 'When one place is taken away, the other places stay as they are: 427 − 400 − 20 = 7.',
          p: 'Answer',
        },
      }),

    /* 9 · order · 🔴 — yoyilmani kattadan kichikka. */
    q('09', 'Yoyilma tartibi', '🔴', 'd03-order-addends', 'order', '🪜', [1, 0, 3, 2],
      {
        e: 'Yoyilmani tuzing', s: 'Kartalarda 962 sonining qismlari va bitta ortiqcha karta bor.',
        a: "962 ning yoyilmasini kattadan kichikka qarab tuzing. Ortiqcha kartani oxirida qoldiring.",
        o: ['60', '900', '90', '2'],
        y: "962 = 900 + 60 + 2. 90 ortiqcha: 6 raqami o'nliklar joyida turibdi, demak uning qiymati 60.",
        n: "Sonning har raqamini o'z joyiga qarab o'qing: 9 yuzlik, 6 o'nlik, 2 birlik.",
        r: "Yoyilma kattadan kichikka yoziladi: 900 + 60 + 2.",
      },
      {
        e: 'Составь разложение', s: 'На карточках части числа 962 и одна лишняя карточка.',
        a: 'Составь разложение 962 от большего к меньшему. Лишнюю карточку оставь напоследок.',
        o: ['60', '900', '90', '2'],
        y: '962 = 900 + 60 + 2. Лишняя — 90: цифра 6 стоит на месте десятков, значит её значение 60.',
        n: 'Читай каждую цифру по её месту: 9 сотен, 6 десятков, 2 единицы.',
        r: 'Разложение пишется от большего к меньшему: 900 + 60 + 2.',
      }, undefined, {
        en: {
          e: 'Build the split', s: 'The cards hold the parts of 962 and one extra card.',
          a: 'Build the split of 962 from the largest part to the smallest. Leave the extra card for the end.',
          o: ['60', '900', '90', '2'],
          y: '962 = 900 + 60 + 2. The extra one is 90: the digit 6 stands in the tens place, so its value is 60.',
          n: 'Read every digit by its place: 9 hundreds, 6 tens, 2 ones.',
          r: 'A split is written from the largest part down: 900 + 60 + 2.',
        },
        orderBy: "yoyilma kamayish bo'yicha, oxirida ortiqcha karta",
        optionArt: [{ plate: '60' }, { plate: '900' }, { plate: '90' }, { plate: '2' }],
      }),

    /* 10 · match · 🔴 — masala. Eski D03_09 (case_sum) match shaklida. */
    q('10', 'Kim nechta bet o\'qidi?', '🔴', 'd03-case-sum', 'match', '📖', [0, 1, 2],
      {
        e: 'Yakuniy mashq', s: "Uch bola kitob o'qidi. Har biri o'qigan betlar razryad qo'shiluvchilari bilan yozilgan.",
        a: "Har bolani u o'qigan betlar soniga ulang.",
        left: ['100 + 60 + 2', '100 + 6 + 2', '600 + 10 + 2'],
        right: ['162', '108', '612'],
        y: "100 + 60 + 2 = 162, 100 + 6 + 2 = 108, 600 + 10 + 2 = 612.",
        n: "Har yoyilmada qo'shiluvchilarni razryadma-razryad qo'shing: avval yuzlik, keyin o'nlik, keyin birlik.",
        r: "Yoyilmadan son yig'iladi, lekin 60 va 6 har xil razryadga tushadi: 162 va 108.",
      },
      {
        e: 'Итоговое задание', s: 'Трое детей читали книгу. Прочитанные страницы записаны разрядными слагаемыми.',
        a: 'Соедини каждую запись с числом страниц.',
        left: ['100 + 60 + 2', '100 + 6 + 2', '600 + 10 + 2'],
        right: ['162', '108', '612'],
        y: '100 + 60 + 2 = 162, 100 + 6 + 2 = 108, 600 + 10 + 2 = 612.',
        n: 'В каждом разложении складывай по разрядам: сначала сотни, потом десятки, потом единицы.',
        r: 'Из разложения собирается число, но 60 и 6 попадают в разные разряды: 162 и 108.',
      }, undefined, {
        en: {
          e: 'Final task', s: 'Three children were reading a book. The pages they read are written as sums of place values.',
          a: 'Connect each record with the number of pages.',
          left: ['100 + 60 + 2', '100 + 6 + 2', '600 + 10 + 2'],
          right: ['162', '108', '612'],
          y: '100 + 60 + 2 = 162, 100 + 6 + 2 = 108, 600 + 10 + 2 = 612.',
          n: 'In every split add place by place: hundreds first, then tens, then ones.',
          r: 'A number is built back from its split, but 60 and 6 land in different places: 162 and 108.',
        },
      }),
  ],
};

export default DARS03_BANK;
