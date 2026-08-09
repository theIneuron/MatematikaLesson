// Dars 14 amaliyoti — Ko'paytirish va bo'lishning bog'lanishi.
// Nazariya: src/components/grade3/Dars14.jsx (num-3-14).
// Bank newBanks.js dan ko'chirildi va §1A kanoniga keltirildi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 choice · 2 dnd · 3 match · 4 input · 5 dnd · 6 choice · 7 order · 8 input · 9 order · 10 multi
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS14_BANK = {
  title: "Dars 14 · Komponentlar bog'lanishi",
  items: [

    /* 1 · choice · 🟢 — komponent nomi. Eski 01, 4-chi variant qo'shildi. */
    q('01', 'Komponent nomi', '🟢', 'd14-component-name', 'choice', '🏷️', 2,
      {
        e: 'Nomlar', s: "7 × 6 = 42 tengligida 7 va 6 — ko'paytuvchilar.",
        a: '42 nima deb ataladi?',
        o: ["Bo'linma", "Yig'indi", "Ko'paytma", 'Ayirma'],
        y: "42 — ko'paytma: ko'paytirish natijasi shunday ataladi.",
        n: "Tenglikda qaysi amal turibdi? Natijaning nomi amal nomidan chiqadi.",
        by: [
          "Bo'linma — bo'lishning natijasi. Bu yerda esa ko'paytirish turibdi.",
          "Yig'indi — qo'shishning natijasi. Bu yerda qo'shish yo'q.",
          undefined,
          'Ayirma — ayirishning natijasi. Bu yerda ayirish yo\'q.',
        ],
        r: "Ko'paytuvchi × ko'paytuvchi = ko'paytma.",
      },
      {
        e: 'Названия', s: 'В равенстве 7 × 6 = 42 числа 7 и 6 — множители.',
        a: 'Как называется 42?',
        o: ['Частное', 'Сумма', 'Произведение', 'Разность'],
        y: '42 — произведение: так называется результат умножения.',
        n: 'Какое действие стоит в равенстве? Название результата идёт от названия действия.',
        by: [
          'Частное — результат деления. А здесь умножение.',
          'Сумма — результат сложения. Здесь сложения нет.',
          undefined,
          'Разность — результат вычитания. Здесь вычитания нет.',
        ],
        r: 'Множитель × множитель = произведение.',
      }),

    /* 2 · dnd · 🟢 — komponentlarni nomlariga. */
    q('02', 'Nomlarni joylang', '🟢', 'd14-sort-names', 'dnd', '🗂️', [0, 0, 1],
      {
        e: 'Ikki amal', s: "7 × 6 = 42 va 42 : 6 = 7 — ikki amal, turli nomlar.",
        a: "Ajrating: nima ko'paytirishdan, nima bo'lishdan chiqqan.",
        tokens: ['42', '35', '7'],
        zones: ["Ko'paytma", "Bo'linma"],
        dndHint: 'Kartalar tugadi.',
        y: "42 = 7 × 6 va 35 = 5 × 7 — ko'paytmalar. 7 = 42 : 6 — bo'linma.",
        n: "Har son qaysi amaldan chiqqan? Ko'paytirishdan chiqsa — ko'paytma.",
        r: "Ko'paytirish natijasi — ko'paytma, bo'lish natijasi — bo'linma.",
      },
      {
        e: 'Два действия', s: '7 × 6 = 42 и 42 : 6 = 7 — два действия, разные названия.',
        a: 'Разложи: что получилось умножением, а что делением.',
        tokens: ['42', '35', '7'],
        zones: ['Произведение', 'Частное'],
        dndHint: 'Карточки закончились.',
        y: '42 = 7 × 6 и 35 = 5 × 7 — произведения. А 7 = 42 : 6 — частное.',
        n: 'Из какого действия получилось каждое число? Из умножения — значит произведение.',
        r: 'Результат умножения — произведение, результат деления — частное.',
      }),

    /* 3 · match · 🟢 — noma'lum komponent va usuli. */
    q('03', 'Qanday topiladi?', '🟢', 'd14-how-find', 'match', '🔗', [0, 1, 2],
      {
        e: "Noma'lumni topish", s: "Har tenglikda bitta komponent noma'lum. Uni topish usuli turlicha.",
        a: 'Har tenglikni uni yechadigan amalga ulang.',
        left: ['□ × 8 = 56', '54 : □ = 6', '□ : 7 = 8'],
        right: ['56 : 8', '54 : 6', '8 × 7'],
        y: "Noma'lum ko'paytuvchi va bo'luvchi bo'lish bilan, bo'linuvchi esa ko'paytirish bilan topiladi.",
        n: "Noma'lum qaysi o'rinda turibdi: ko'paytuvchimi, bo'luvchimi yoki bo'linuvchimi?",
        r: "Ko'paytuvchi = ko'paytma : ma'lum ko'paytuvchi; bo'linuvchi = bo'luvchi × bo'linma.",
      },
      {
        e: 'Как найти?', s: 'В каждом равенстве неизвестен один компонент. Способ поиска у каждого свой.',
        a: 'Соедини каждое равенство с действием, которое его решает.',
        left: ['□ × 8 = 56', '54 : □ = 6', '□ : 7 = 8'],
        right: ['56 : 8', '54 : 6', '8 × 7'],
        y: 'Неизвестный множитель и делитель находят делением, а делимое — умножением.',
        n: 'На каком месте стоит неизвестное: множитель, делитель или делимое?',
        r: 'Множитель = произведение : известный множитель; делимое = делитель × частное.',
      }),

    /* 4 · input · 🟡 — noma'lum ko'paytuvchi. Eski 02. */
    q('04', "Noma'lum ko'paytuvchi", '🟡', 'd14-missing-factor', 'input', '🧩', ['7'],
      {
        e: "Bo'sh katak", s: '□ × 8 = 56 tenglik berilgan.',
        a: "Noma'lum ko'paytuvchini yozing.",
        y: '56 : 8 = 7. Tekshiruv: 7 × 8 = 56.',
        n: "Noma'lum ko'paytuvchi ko'paytmani ma'lum ko'paytuvchiga bo'lib topiladi.",
        r: "Noma'lum ko'paytuvchi bo'lish orqali topiladi.",
        p: 'Javob',
      },
      {
        e: 'Пустая клетка', s: 'Дано равенство □ × 8 = 56.',
        a: 'Запиши неизвестный множитель.',
        y: '56 : 8 = 7. Проверка: 7 × 8 = 56.',
        n: 'Неизвестный множитель находят делением произведения на известный множитель.',
        r: 'Неизвестный множитель находится делением.',
        p: 'Ответ',
      }, 'numeric', {
        art: { array: { rows: 7, cols: 8 } },
      }),

    /* 5 · dnd · 🟡 — oilaga kiradimi. Eski 07 (multi) dnd ga o'tdi. */
    q('05', 'Oilaga kiradimi?', '🟡', 'd14-family-sort', 'dnd', '👨‍👩‍👧', [0, 0, 1, 0],
      {
        e: '5, 8 va 40 oilasi', s: "Uch son bitta tengliklar oilasini tuzadi: ikki ko'paytirish va ikki bo'lish.",
        a: 'Tengliklarni ajrating: qaysilari oilaga kiradi, qaysilari kirmaydi.',
        tokens: ['5 × 8 = 40', '8 × 5 = 40', '40 : 8 = 6', '40 : 5 = 8'],
        zones: ['Oilaga kiradi', 'Kirmaydi'],
        dndHint: 'Tengliklar tugadi.',
        y: "Uchtasi oilaga kiradi. 40 : 8 = 6 esa noto'g'ri: 40 : 8 = 5.",
        n: 'Har tenglikni tekshiring: unda faqat shu uch son qatnashadimi va natija to\'g\'rimi?',
        r: "Oilada ikkita ko'paytirish va ikkita bo'lish tengligi bo'ladi.",
      },
      {
        e: 'Семья 5, 8 и 40', s: 'Три числа образуют одну семью равенств: два умножения и два деления.',
        a: 'Разложи равенства: какие входят в семью, а какие нет.',
        tokens: ['5 × 8 = 40', '8 × 5 = 40', '40 : 8 = 6', '40 : 5 = 8'],
        zones: ['Входит в семью', 'Не входит'],
        dndHint: 'Равенства закончились.',
        y: 'Три равенства входят. А 40 : 8 = 6 неверно: 40 : 8 = 5.',
        n: 'Проверь каждое равенство: участвуют ли в нём только эти три числа и верен ли результат?',
        r: 'В семье два равенства на умножение и два на деление.',
      }),

    /* 6 · choice · 🟡 — noma'lum bo'luvchi. Eski 04, 4-chi variant qo'shildi. */
    q('06', "Noma'lum bo'luvchi", '🟡', 'd14-missing-divisor', 'choice', '🔐', 1,
      {
        e: "Bo'luvchini toping", s: '54 : □ = 6 tenglik berilgan.',
        a: "Bo'luvchini toping.",
        o: ['6', '9', '48', '60'],
        y: "54 : 9 = 6. Bo'luvchi bo'linuvchini bo'linmaga bo'lib topiladi: 54 : 6 = 9.",
        n: "Bo'luvchi = bo'linuvchi : bo'linma. Ikkala ma'lum sonni oling.",
        by: [
          "6 — bu bo'linma, u allaqachon berilgan. Bo'luvchi boshqa son.",
          undefined,
          "Bu ayirma: 54 − 6. Lekin bu yerda bo'lish turibdi, ayirish emas.",
          "Bu yig'indi: 54 + 6. Bo'luvchi bo'linuvchidan katta bo'la olmaydi.",
        ],
        r: "Bo'luvchi = bo'linuvchi : bo'linma.",
      },
      {
        e: 'Найди делитель', s: 'Дано равенство 54 : □ = 6.',
        a: 'Найди делитель.',
        o: ['6', '9', '48', '60'],
        y: '54 : 9 = 6. Делитель находят делением делимого на частное: 54 : 6 = 9.',
        n: 'Делитель = делимое : частное. Возьми оба известных числа.',
        by: [
          '6 — это частное, оно уже дано. Делитель — другое число.',
          undefined,
          'Это разность: 54 − 6. Но здесь деление, а не вычитание.',
          'Это сумма: 54 + 6. Делитель не может быть больше делимого.',
        ],
        r: 'Делитель = делимое : частное.',
      }),

    /* 7 · order · 🟡 — tengliklar oilasi. Eski 03. */
    q('07', 'Tengliklar oilasi', '🟡', 'd14-family-order', 'order', '👨‍👩‍👧‍👦', [1, 3, 0, 2],
      {
        e: 'To\'rt tenglik', s: '5, 7 va 35 sonlari bitta oilani tuzadi.',
        a: "Avval ikki ko'paytmani, keyin ikki bo'linmani joylang.",
        o: ['35 : 5 = 7', '5 × 7 = 35', '35 : 7 = 5', '7 × 5 = 35'],
        y: "To'rtta tenglik bir xil bog'lanishni ko'rsatadi: ikki ko'paytirish, keyin ikki bo'lish.",
        n: "Avval ko'paytirish tengliklarini toping, keyin bo'lishlarni.",
        r: "Ko'paytuvchilar o'rin almashadi; bo'lish teskari amal.",
      },
      {
        e: 'Четыре равенства', s: 'Числа 5, 7 и 35 образуют одну семью.',
        a: 'Сначала поставь два умножения, потом два деления.',
        o: ['35 : 5 = 7', '5 × 7 = 35', '35 : 7 = 5', '7 × 5 = 35'],
        y: 'Четыре равенства показывают одну и ту же связь: два умножения, потом два деления.',
        n: 'Сначала найди равенства на умножение, потом на деление.',
        r: 'Множители меняются местами; деление — обратное действие.',
      }),

    /* 8 · input · 🔴 — noma'lum bo'linuvchi. Eski 05 va 10. */
    q('08', "Noma'lum bo'linuvchi", '🔴', 'd14-missing-dividend', 'input', '🔢', ['56'],
      {
        e: "Bo'linuvchini toping", s: '□ : 7 = 8 tenglik berilgan.',
        a: "Bo'linuvchini yozing.",
        y: "8 × 7 = 56. Bo'linuvchi bo'luvchini bo'linmaga ko'paytirib topiladi.",
        n: "Bo'lishda eng katta son — bo'linuvchi. U ikki ma'lum sonning ko'paytmasi.",
        r: "Bo'linuvchi = bo'luvchi × bo'linma.",
        p: 'Javob',
      },
      {
        e: 'Найди делимое', s: 'Дано равенство □ : 7 = 8.',
        a: 'Запиши делимое.',
        y: '8 × 7 = 56. Делимое находят умножением делителя на частное.',
        n: 'В делении самое большое число — делимое. Оно равно произведению двух известных чисел.',
        r: 'Делимое = делитель × частное.',
        p: 'Ответ',
      }, 'numeric'),

    /* 9 · order · 🔴 — tekshiruv qadamlari. Eski 09. */
    q('09', 'Tekshiruv qadamlari', '🔴', 'd14-check-order', 'order', '🔎', [1, 2, 0],
      {
        e: 'Xatoni tekshiruv topadi', s: "Jasur 36 : 4 = 8 dedi. Javobni tekshirib ko'ramiz.",
        a: 'Tekshiruv qadamlarini tartib bilan tanlang.',
        o: ["36 emas, demak javob xato", "Bo'linmani bo'luvchiga ko'paytiraman: 8 × 4", 'Natija 32 chiqdi'],
        y: "8 × 4 = 32, bu 36 emas. Demak bo'linma 8 emas, 9: 9 × 4 = 36.",
        n: 'Tekshiruvda avval nima qilinadi? Natijani nima bilan solishtiramiz?',
        r: "Bo'lishni ko'paytirish bilan tekshiramiz: bo'linma × bo'luvchi = bo'linuvchi.",
      },
      {
        e: 'Ошибку находит проверка', s: 'Жасур сказал, что 36 : 4 = 8. Проверим ответ.',
        a: 'Выбери шаги проверки по порядку.',
        o: ['Не 36, значит ответ неверный', 'Умножаю частное на делитель: 8 × 4', 'Получилось 32'],
        y: '8 × 4 = 32, а не 36. Значит частное не 8, а 9: 9 × 4 = 36.',
        n: 'Что делают первым при проверке? С чем сравнивают результат?',
        r: 'Деление проверяют умножением: частное × делитель = делимое.',
      }),

    /* 10 · multi · 🔴 — nol va bir. Eski 08. */
    q('10', 'Nol va bir', '🔴', 'd14-zero-one', 'multi', '🚀', [0, 2],
      {
        e: 'Yakuniy mashq', s: "To'rtta ifoda. Ba'zilarida nol yoki bir qatnashadi.",
        a: 'Qaysi ifodalar 0 ga teng? Hammasini belgilang.',
        o: ['99 × 0', '99 × 1', '0 : 5', '5 : 5'],
        y: "99 × 0 = 0 va 0 : 5 = 0. 99 × 1 = 99, 5 : 5 = 1.",
        n: "Sonni nol marta olsak nima qoladi? Nolni teng qismlarga bo'lsak-chi?",
        r: 'Nolga ko\'paytirish nol beradi; nolni songa bo\'lsak ham nol chiqadi.',
      },
      {
        e: 'Итоговое задание', s: 'Четыре выражения. В некоторых участвует ноль или единица.',
        a: 'Какие выражения равны 0? Отметь все.',
        o: ['99 × 0', '99 × 1', '0 : 5', '5 : 5'],
        y: '99 × 0 = 0 и 0 : 5 = 0. А 99 × 1 = 99, 5 : 5 = 1.',
        n: 'Что останется, если взять число ноль раз? А если разделить ноль на равные части?',
        r: 'Умножение на ноль даёт ноль; деление нуля на число тоже даёт ноль.',
      }),
  ],
};

export default DARS14_BANK;
