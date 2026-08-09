// Dars 1 amaliyoti — Yuzliklar, o'nliklar va birliklar.
// Manba: 3-sinf darsligi (Burxonov va b., 2019), 1-bob 1-5-dars; mashq daftari 3-7-betlar.
//
// Bu bank eski qo'lda yozilgan D01_01…D01_10 fayllarining o'rniga keladi: matematika
// o'sha-o'sha, mexanikalar TIPLAR_AMALIYOT_3SINF.md §5.1 raskladkasiga ko'chirildi:
//   1 order · 2 input · 3 choice · 4 input · 5 order · 6 dnd · 7 match · 8 dnd · 9 multi · 10 choice
// Murakkablik o'qi o'zgarmaydi: 🟢🟢🟢🟡🟡🟡🟡🔴🔴🔴.
//
// Har bir noto'g'ri variantga o'z tahlili (`by`) — u BELGIga ishora qiladi, javobni bermaydi.
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS01_BANK = {
  title: "Dars 1 · Yuzliklar, o'nliklar va birliklar",
  items: [

    /* 1 · order · 🟢 — 751 razryadlari. Eski D01_01 (razryad_count) shu yerda tartiblashga o'tdi. */
    q('01', 'Sonni yig\'ing: 751', '🟢', 'd01-place-order', 'order', '🔢', [1, 2, 0],
      {
        e: 'Razryadlar', s: "Kartochkalarda 751 sonining razryadlari yozilgan, lekin ular aralashib ketgan.",
        a: '751 sonini yozish uchun kartochkalarni chapdan o\'ngga tartiblang.',
        o: ['1 birlik', '7 yuzlik', "5 o'nlik"],
        y: "751 = 7 yuzlik, 5 o'nlik, 1 birlik. Yozuvda avval yuzlik, keyin o'nlik, oxirida birlik turadi.",
        n: "Sonni chapdan o'qing: eng katta razryad birinchi turadi.",
        r: "O'ngdan chapga sanaganda 1-o'rin — birlik, 2-o'rin — o'nlik, 3-o'rin — yuzlik.",
      },
      {
        e: 'Разряды', s: 'На карточках записаны разряды числа 751, но карточки перемешались.',
        a: 'Расставь карточки слева направо, чтобы получилось число 751.',
        o: ['1 единица', '7 сотен', '5 десятков'],
        y: '751 = 7 сотен, 5 десятков, 1 единица. В записи сначала сотни, потом десятки, в конце единицы.',
        n: 'Читай число слева: самый крупный разряд стоит первым.',
        r: 'Если считать справа налево: 1-е место — единицы, 2-е — десятки, 3-е — сотни.',
      }, undefined, {
        art: { plate: '751' },
        optionArt: [{ piece: 'o', count: 1 }, { piece: 'h', count: 7 }, { piece: 't', count: 5 }],
      }),

    /* 2 · input · 🟢 — 9 yuzlik + 3 o'nlik = 930. Eski D01_02 (pv_build). */
    q('02', "Sonni yig'ing", '🟢', 'd01-build-930', 'input', '🧱', ['930'],
      {
        e: "Sonni yig'ing", s: "9 ta yuzlik va 3 ta o'nlik berilgan. Birlik haqida hech narsa aytilmagan.",
        a: "9 yuzlik va 3 o'nlikdan qanday son hosil bo'ladi?",
        y: "9 yuzlik va 3 o'nlik — bu 930. Birlik yo'q, uning o'rnida 0 turadi.",
        n: "Birliklar nechta? Shartda aytilmagan — bo'sh razryadda nima yoziladi?",
        r: "Bo'sh razryadda 0 yoziladi: 9 yuzlik 3 o'nlik = 930.",
        p: 'Javob',
      },
      {
        e: 'Собери число', s: 'Даны 9 сотен и 3 десятка. Про единицы ничего не сказано.',
        a: 'Какое число получится из 9 сотен и 3 десятков?',
        y: '9 сотен и 3 десятка — это 930. Единиц нет, на их месте стоит 0.',
        n: 'Сколько единиц? В условии их нет — что пишется в пустом разряде?',
        r: 'В пустом разряде пишется 0: 9 сотен 3 десятка = 930.',
        p: 'Ответ',
      }, 'numeric', {
        art: { pv: { h: 9, t: 3 }, captions: { h: 'yuzlik', t: "o'nlik" } },
      }),

    /* 3 · choice · 🟢 — rasmdagi son 307. Eski D01_03 (pv_read), 4-chi variant qo'shildi. */
    q('03', 'Rasmdagi son', '🟢', 'd01-read-307', 'choice', '🖼️', 0,
      {
        e: "Rasmni o'qing", s: "Devorda 3 ta panel va 7 ta alohida chiroq bor. Lenta umuman yo'q.",
        a: 'Rasmda qanday son tasvirlangan?',
        o: ['307', '37', '370', '703'],
        y: "3 panel — 300, lenta yo'q — 0 o'nlik, 7 chiroq — 7. Bu 307.",
        n: "Panellar nechta, lentalar nechta, chiroqlar nechta — har birini o'z razryadiga qo'ying.",
        by: [
          undefined,
          "Bu sonda yuzlik yo'q. Panellarni qayta sanang — ular qaysi razryadni bildiradi?",
          "Bu sonda oxirgi razryad bo'sh. Alohida chiroqlar qaysi razryadga tushadi?",
          "Razryadlar joyini almashtirib yubordingiz. Rasmda nimasi ko'p — panelmi yoki chiroqmi?",
        ],
        r: "O'nlik bo'lmasa, uning o'rnida 0 yoziladi — aks holda son 10 marta kichrayadi: 307, 37 emas.",
      },
      {
        e: 'Прочитай рисунок', s: 'На стене 3 панели и 7 отдельных лампочек. Лент нет совсем.',
        a: 'Какое число изображено на рисунке?',
        o: ['307', '37', '370', '703'],
        y: '3 панели — 300, лент нет — 0 десятков, 7 лампочек — 7. Это 307.',
        n: 'Сколько панелей, сколько лент, сколько лампочек — положи каждое в свой разряд.',
        by: [
          undefined,
          'В этом числе нет сотен. Пересчитай панели — какой разряд они показывают?',
          'В этом числе пустой последний разряд. В какой разряд попадают отдельные лампочки?',
          'Разряды поменялись местами. Чего на рисунке больше — панелей или лампочек?',
        ],
        r: 'Если десятков нет, на их месте пишется 0 — иначе число станет в 10 раз меньше: 307, а не 37.',
      }, undefined, {
        art: { pv: { h: 3, o: 7 }, captions: { h: 'yuzlik', o: 'birlik' } },
        optionArt: [{ plate: '307' }, { plate: '37' }, { plate: '370' }, { plate: '703' }],
      }),

    /* 4 · input · 🟡 — 9 yuzlik + 9 o'nlik = 990. Eski D01_04 (pv_compose). */
    q('04', 'Sonni yozing', '🟡', 'd01-compose-990', 'input', '✍️', ['990'],
      {
        e: 'Sonni yozing', s: "Tarkibi shunday: 9 ta yuzlik va 9 ta o'nlik.",
        a: "9 yuzlik va 9 o'nlikdan qanday son hosil bo'ladi?",
        y: '9 yuzlik va 9 o\'nlik = 990. Birlik yo\'q — oxirida 0.',
        n: "9 yuzlik — 900, 9 o'nlik — 90. Birliklar-chi? Bo'sh razryadda nima turadi?",
        r: "Bo'sh razryadga 0 yoziladi, aks holda son buziladi: 990, 99 emas.",
        p: 'Javob',
      },
      {
        e: 'Запиши число', s: 'Состав такой: 9 сотен и 9 десятков.',
        a: 'Какое число получится из 9 сотен и 9 десятков?',
        y: '9 сотен и 9 десятков = 990. Единиц нет — в конце 0.',
        n: '9 сотен — 900, 9 десятков — 90. А единицы? Что стоит в пустом разряде?',
        r: 'В пустой разряд пишется 0, иначе число исказится: 990, а не 99.',
        p: 'Ответ',
      }, 'numeric', {
        art: { pv: { h: 9, t: 9 }, captions: { h: 'yuzlik', t: "o'nlik" } },
      }),

    /* 5 · order · 🟡 — bir xil raqamlardan tuzilgan sonlarni tartiblash.
       Eski D01_05 (numline_between) o'rnida: o'sha razryadlab taqqoslash, kuchliroq shaklda. */
    q('05', "O'sish tartibida", '🟡', 'd01-sort-asc', 'order', '📈', [2, 0, 3, 1],
      {
        e: "Son o'qi", s: "To'rt son bir xil raqamlardan tuzilgan, faqat raqamlar joyi boshqa.",
        a: 'Sonlarni kichigidan kattasiga qarab tartiblang.',
        o: ['427', '472', '407', '470'],
        y: "407, 427, 470, 472. Hammasida 4 yuzlik bor, shuning uchun o'nliklarga qarab taqqoslanadi.",
        n: "Yuzliklar teng bo'lsa, keyingi razryadga o'ting: o'nliklarni taqqoslang.",
        r: 'Sonlarni chapdan taqqoslang: yuzlik, keyin o\'nlik, keyin birlik.',
      },
      {
        e: 'Числовая прямая', s: 'Четыре числа составлены из одних и тех же цифр, отличается только их место.',
        a: 'Расставь числа от меньшего к большему.',
        o: ['427', '472', '407', '470'],
        y: '407, 427, 470, 472. Во всех по 4 сотни, поэтому сравниваем по десяткам.',
        n: 'Если сотни равны, переходи к следующему разряду: сравнивай десятки.',
        r: 'Сравнивай числа слева: сотни, потом десятки, потом единицы.',
      }, undefined, {
        art: { line: { from: 400, to: 500, values: [407, 427, 470, 472] } },
        optionArt: [{ plate: '427' }, { plate: '472' }, { plate: '407' }, { plate: '470' }],
      }),

    /* 6 · dnd · 🟡 — 903: nol o'rtada. Eski D01_06 (zero_place). */
    q('06', 'Diqqat, razryad!', '🟡', 'd01-zero-middle', 'dnd', '0️⃣', [0, 1, 2],
      {
        e: 'Diqqat, razryad!', s: 'Displeyda 903 soni. Uning raqamlarini rafga joylash kerak.',
        a: "Har bir raqamni o'z razryad rafiga qo'ying.",
        tokens: ['9', '0', '3'],
        zones: ['Yuzliklar', "O'nliklar", 'Birliklar'],
        dndHint: 'Raqamlar tugadi.',
        y: "903 da o'nlik yo'q — o'rtada 0 turibdi: 9 yuzlik, 0 o'nlik, 3 birlik.",
        n: "Raqamni chapdan o'nga oling va shu tartibda rafga qo'ying. Nol ham raqam.",
        r: "Nol ham razryadni egallaydi: u joyni saqlab turadi. 903 = 9 yuzlik, 0 o'nlik, 3 birlik.",
      },
      {
        e: 'Внимание, разряд!', s: 'На дисплее число 903. Его цифры нужно разложить по полкам.',
        a: 'Положи каждую цифру на полку своего разряда.',
        tokens: ['9', '0', '3'],
        zones: ['Сотни', 'Десятки', 'Единицы'],
        dndHint: 'Цифры закончились.',
        y: 'В 903 нет десятков — в середине стоит 0: 9 сотен, 0 десятков, 3 единицы.',
        n: 'Бери цифры слева направо и в том же порядке клади на полки. Ноль — тоже цифра.',
        r: 'Ноль тоже занимает разряд: он сохраняет место. 903 = 9 сотен, 0 десятков, 3 единицы.',
      }, undefined, {
        art: { plate: '903' },
        zoneArt: [{ piece: 'h', count: 1 }, { piece: 't', count: 1 }, { piece: 'o', count: 1 }],
        tokenArt: [{ digit: '9', kind: 'h' }, { digit: '0', kind: 't' }, { digit: '3', kind: 'o' }],
      }),

    /* 7 · match · 🟡 — raqamning qiymati joyiga bog'liq. Eski D01_07 (digit_value). */
    q('07', 'Raqamning qiymati', '🟡', 'd01-digit-value', 'match', '🔗', [0, 1, 2],
      {
        e: 'Raqamning qiymati', s: "Displeyda 854 soni turibdi. Bir xil raqam turli joyda turli qiymat beradi.",
        a: 'Har bir raqamni uning qiymatiga ulang.',
        left: ['yuzliklar', "o'nliklar", 'birliklar'],
        right: ['800', '50', '4'],
        y: '854 = 800 + 50 + 4. 8 yuzliklar joyida, 5 o\'nliklar joyida, 4 birliklar joyida turibdi.',
        n: "Raqamning qiymati uning turgan joyiga bog'liq: chapdan birinchi joy — yuzlik.",
        r: 'Bir xil raqam turli joyda turli qiymat beradi: 854 = 800 + 50 + 4.',
      },
      {
        e: 'Значение цифры', s: 'На дисплее число 854. Одна и та же цифра на разных местах значит разное.',
        a: 'Соедини каждую цифру с её значением.',
        left: ['сотни', 'десятки', 'единицы'],
        right: ['800', '50', '4'],
        y: '854 = 800 + 50 + 4. 8 стоит на месте сотен, 5 — на месте десятков, 4 — на месте единиц.',
        n: 'Значение цифры зависит от её места: первое место слева — сотни.',
        r: 'Одна и та же цифра на разных местах даёт разное значение: 854 = 800 + 50 + 4.',
      }, undefined, {
        // Kartalar: yirik raqam va razryad nomi. Ilgari uchala karta ham "854" ko'rinishida
        // edi va bir qarashda farq bilinmasdi. Sahna tanlangan satr razryadini yoritadi —
        // bu javobni ochmaydi, chunki bola O'ZI bosgan raqam yoritiladi.
        art: { plate: '854' },
        artSpotlight: [{ plate: '854', lit: 0 }, { plate: '854', lit: 1 }, { plate: '854', lit: 2 }],
        leftArt: [{ digit: '8', kind: 'h' }, { digit: '5', kind: 't' }, { digit: '4', kind: 'o' }],
      }),

    /* 8 · dnd · 🔴 — bir xil raqamlar, nol turli joyda. Eski D01_08 (pv_bins) kuchaytirilgan. */
    q('08', 'Nol qayerda turibdi?', '🔴', 'd01-zero-place-sort', 'dnd', '🗂️', [1, 0, 1, 0],
      {
        e: 'Masala · Nolning joyi', s: "Kitob do'konining to'rtta rafida sonlar yozilgan. Hammasi bir xil raqamlardan tuzilgan.",
        a: "Sonlarni ajrating: qaysilarida nol o'nliklar o'rnida, qaysilarida birliklar o'rnida.",
        tokens: ['680', '608', '860', '806'],
        zones: ["Nol — o'nliklar o'rnida", "Nol — birliklar o'rnida"],
        dndHint: 'Sonlar tugadi.',
        y: "608 va 806 da o'rtadagi razryad bo'sh, 680 va 860 da esa oxirgi razryad bo'sh.",
        n: "Har sonning o'rtasiga qarang: o'sha joy o'nliklar razryadi.",
        r: "Nolning joyi sonni butunlay o'zgartiradi: 680 va 608 — bir xil raqamlar, turli sonlar.",
      },
      {
        e: 'Задача · Место нуля', s: 'На четырёх полках книжного магазина записаны числа. Все они из одних и тех же цифр.',
        a: 'Разложи числа: где ноль на месте десятков, а где на месте единиц.',
        tokens: ['680', '608', '860', '806'],
        zones: ['Ноль — на месте десятков', 'Ноль — на месте единиц'],
        dndHint: 'Числа закончились.',
        y: 'В 608 и 806 пустой средний разряд, а в 680 и 860 — последний.',
        n: 'Смотри на середину каждого числа: это место десятков.',
        r: 'Место нуля полностью меняет число: 680 и 608 — одни цифры, разные числа.',
      }, undefined, {
        art: { plates: ['680', '608', '860', '806'] },
        tokenArt: [{ plate: '680' }, { plate: '608' }, { plate: '860' }, { plate: '806' }],
      }),

    /* 9 · multi · 🔴 — sonlar qatori, qo'shnilar. Eski D01_09 (neighbour) kengaytirilgan. */
    q('09', 'Sonlar qatori', '🔴', 'd01-neighbours', 'multi', '🔢', [1, 2, 3],
      {
        e: 'Sonlar qatori', s: 'Sanashda sonlar ketma-ket aytiladi: ... 928, ?, ?, ?, 932 ...',
        a: '928 bilan 932 orasida qaysi sonlar aytiladi? Hammasini belgilang.',
        o: ['927', '929', '930', '931', '933'],
        y: '928, 929, 930, 931, 932 — orasida 929, 930 va 931 turadi.',
        n: "928 dan bittalab sanang va 932 ga yetganda to'xtang. Chegaralarning o'zi hisobga olinmaydi.",
        r: "Sondan oldingi son 1 ga kam, keyingisi 1 ga ko'p: 929, 930, 931.",
      },
      {
        e: 'Ряд чисел', s: 'При счёте числа называют по порядку: ... 928, ?, ?, ?, 932 ...',
        a: 'Какие числа называют между 928 и 932? Отметь все.',
        o: ['927', '929', '930', '931', '933'],
        y: '928, 929, 930, 931, 932 — между ними стоят 929, 930 и 931.',
        n: 'Считай от 928 по одному и остановись, дойдя до 932. Сами границы не считаются.',
        r: 'Число перед данным на 1 меньше, следующее — на 1 больше: 929, 930, 931.',
      }, undefined, {
        art: { line: { from: 928, to: 932, values: [929, 930, 931] } },
        optionArt: [{ plate: '927' }, { plate: '929' }, { plate: '930' }, { plate: '931' }, { plate: '933' }],
      }),

    /* 10 · choice · 🔴 — 10 yuzlik = 1000. Eski D01_10, input dan choice ga. */
    q('10', 'Yakuniy mashq', '🔴', 'd01-thousand-transfer', 'choice', '🚀', 0,
      {
        e: 'Yakuniy mashq', s: 'Bitda 9 ta yuzlik panel bor edi. U yana 100 ta birlik olib keldi.',
        a: "9 yuzlik va 100 birlik jami nechta birlik bo'ladi?",
        o: ['1000', '190', '910', '109'],
        y: '9 yuzlik — 900 birlik. 900 + 100 = 1000 birlik.',
        n: "Avval 9 yuzlikni birliklarda yozing, keyin 100 ni qo'shing.",
        by: [
          undefined,
          "Yuzlikni o'nlik bilan almashtirib yubordingiz. Bitta yuzlikda nechta birlik bor?",
          "Qo'shilayotgan son 100 ta birlik, 10 ta emas. Uni yana bir marta o'qing.",
          "Raqamlarni qo'shib yubordingiz. Bu yerda razryadlar qo'shiladi, raqamlar emas.",
        ],
        r: '10 yuzlik = 1000 birlik = 1 minglik.',
      },
      {
        e: 'Итоговое задание', s: 'У Бита было 9 сотенных панелей. Он принёс ещё 100 единиц.',
        a: 'Сколько всего единиц составляют 9 сотен и 100 единиц?',
        o: ['1000', '190', '910', '109'],
        y: '9 сотен — это 900 единиц. 900 + 100 = 1000 единиц.',
        n: 'Сначала запиши 9 сотен в единицах, затем прибавь 100.',
        by: [
          undefined,
          'Ты принял сотни за десятки. Сколько единиц в одной сотне?',
          'Прибавляют 100 единиц, а не 10. Перечитай условие ещё раз.',
          'Ты сложил цифры. Здесь складываются разряды, а не цифры.',
        ],
        r: '10 сотен = 1000 единиц = 1 тысяча.',
      }, undefined, {
        // Sahnada faqat 9 panel: "900 + 100" ni yozib qo'ysak, birinchi qadam bolaga
        // tayyor beriladi. Yuzlikni birlikka o'girish — topshiriqning o'zagi.
        art: { pv: { h: 9 }, captions: { h: 'yuzlik' }, sum: { parts: ['900', '100'], total: '1000' } },
        optionArt: [{ plate: '1000' }, { plate: '190' }, { plate: '910' }, { plate: '109' }],
      }),
  ],
};

export default DARS01_BANK;
