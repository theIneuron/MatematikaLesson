// Dars 41 amaliyoti — Fazoviy shakllar: piramida va konus.
// Nazariya: src/components/grade3/Dars41.jsx (num-3-41).
// Fazoviy shaklning balandligi bor va u varaqqa sig'maydi; piramidaning asosi
// ko'pburchak va yon yoqlari bitta uchda uchrashadi (nomni asos beradi), konusning
// asosi doira va yoni silliq; ko'rinmaydigan yoqlar ham sanaladi.
//
// Raskladka (TIPLAR_AMALIYOT_3SINF.md §5.1):
//   1 multi · 2 order · 3 dnd · 4 multi · 5 match · 6 order · 7 input · 8 dnd · 9 choice · 10 input
// UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

import { q } from './_helpers.js';

export const DARS41_BANK = {
  title: 'Dars 41 · Piramida va konus',
  items: [

    /* 1 · multi · 🟢 — fazoviy shakllar. */
    q('01', 'Qaysilari fazoviy?', '🟢', 'd41-spatial', 'multi', '📦', [1, 3],
      {
        e: 'Varaqqa yotadimi?', s: "To'rtta shakl. Fazoviy shaklning balandligi bor va u varaqqa yotmaydi.",
        a: 'Qaysi shakllar fazoviy? Hammasini belgilang.',
        o: ['Kvadrat', 'Piramida', 'Uchburchak', 'Konus'],
        y: "Piramida va konusning balandligi bor, shuning uchun ular varaqqa yotmaydi. Kvadrat va uchburchak esa tekis.",
        n: 'Shaklni kaft bilan yopib bo\'ladimi yoki u kaftdan baland turadimi?',
        r: 'Fazoviy shaklning balandligi bor, u varaqqa sig\'maydi.',
      },
      {
        e: 'Ляжет ли на лист?', s: 'Четыре фигуры. У пространственной есть высота, и на лист она не ложится.',
        a: 'Какие фигуры пространственные? Отметь все.',
        o: ['Квадрат', 'Пирамида', 'Треугольник', 'Конус'],
        y: 'У пирамиды и конуса есть высота, поэтому на лист они не ложатся. А квадрат и треугольник плоские.',
        n: 'Фигуру можно накрыть ладонью или она поднимается над ней?',
        r: 'У пространственной фигуры есть высота, на лист она не помещается.',
      }, undefined, {
        en: {
          e: 'Will it lie flat on paper?', s: 'Four shapes. A solid shape has height and does not lie flat on paper.',
          a: 'Which shapes are solid? Mark them all.',
          o: ['A square', 'A pyramid', 'A triangle', 'A cone'],
          y: 'A pyramid and a cone have height, so they do not lie flat on paper. And a square and a triangle are flat.',
          n: 'Can the shape be covered by your palm, or does it rise above it?',
          r: 'A solid shape has height and does not fit onto a sheet of paper.',
        },
      }),

    /* 2 · order · 🟢 — piramidani ajratish. */
    q('02', 'Piramidani ajratamiz', '🟢', 'd41-parts', 'order', '🪜', [1, 2, 0],
      {
        e: 'Uch qadam', s: "Piramidani qismlarga ajratib ko'ramiz.",
        a: 'Qadamlarni tartib bilan tanlang.',
        o: ['Yon yoqlar bitta uchda uchrashadi', 'Pastdagi tekis shaklga qarayman', 'Bu ko\'pburchak, uni asos deyishadi'],
        y: "Avval pastga qaraymiz, u yerda ko'pburchak yotadi — asos. Keyin yon yoqlarga qaraymiz: ular bitta uchda uchrashadi.",
        n: 'Piramidada avval nimaga qaraladi: pastigami yoki yon tomonigami?',
        r: 'Piramidaning pastida ko\'pburchak — asos, yon yoqlari bitta uchda uchrashadi.',
      },
      {
        e: 'Три шага', s: 'Разбираем пирамиду по частям.',
        a: 'Выбери шаги по порядку.',
        o: ['Боковые грани сходятся в одной вершине', 'Смотрю на плоскую фигуру внизу', 'Это многоугольник, его называют основанием'],
        y: 'Сначала смотрим вниз, там лежит многоугольник — основание. Потом смотрим на боковые грани: они сходятся в одной вершине.',
        n: 'С чего начинают разбор пирамиды: с низа или с боковой части?',
        r: 'Внизу пирамиды многоугольник — основание, а боковые грани сходятся в одной вершине.',
      }, undefined, {
        en: {
          e: 'Three steps', s: 'We take a pyramid apart piece by piece.',
          a: 'Pick the steps in order.',
          o: ['The side faces meet at one apex', 'I look at the flat shape at the bottom', 'It is a polygon and it is called the base'],
          y: 'First we look at the bottom, where a polygon lies — the base. Then we look at the side faces: they meet at one apex.',
          n: 'Where do you start taking a pyramid apart: at the bottom or at the side?',
          r: 'At the bottom of a pyramid is a polygon, the base, and the side faces meet at one apex.',
        },
      }),

    /* 3 · dnd · 🟢 — piramida yoki konus. */
    q('03', 'Piramida yoki konus?', '🟢', 'd41-pyramid-cone', 'dnd', '🔺', [0, 1, 0, 1],
      {
        e: 'Belgilarga qarang', s: "To'rtta belgi. Ba'zilari piramidaniki, ba'zilari konusniki.",
        a: 'Belgilarni ajrating: qaysilari piramidaniki, qaysilari konusniki.',
        tokens: ['Asosi ko\'pburchak', 'Asosi doira', 'Yon yoqlari qirrali', 'Yon sirti silliq'],
        zones: ['Piramida', 'Konus'],
        dndHint: 'Belgilar tugadi.',
        y: "Piramidaning asosi ko'pburchak va yon yoqlari qirrali. Konusning asosi doira, yon sirti esa silliq.",
        n: 'Asosda burchak bormi? Burchak bo\'lsa, qirra ham bo\'ladi.',
        r: 'Doirada burchak yo\'q, shuning uchun konusning yonida qirra ham yo\'q.',
      },
      {
        e: 'Смотри на признаки', s: 'Четыре признака. Одни у пирамиды, другие у конуса.',
        a: 'Разложи признаки: какие у пирамиды, а какие у конуса.',
        tokens: ['Основание многоугольник', 'Основание круг', 'Боковые грани с рёбрами', 'Боковая поверхность гладкая'],
        zones: ['Пирамида', 'Конус'],
        dndHint: 'Признаки закончились.',
        y: 'У пирамиды основание многоугольник и боковые грани с рёбрами. У конуса основание круг, а бок гладкий.',
        n: 'Есть ли углы у основания? Если есть углы, будут и рёбра.',
        r: 'У круга нет углов, поэтому у конуса нет и рёбер на боку.',
      }, undefined, {
        en: {
          e: 'Watch the signs', s: 'Four signs. Some belong to a pyramid, others to a cone.',
          a: 'Sort the signs: which belong to a pyramid and which to a cone.',
          tokens: ['The base is a polygon', 'The base is a circle', 'Side faces with edges', 'The side surface is smooth'],
          zones: ['A pyramid', 'A cone'],
          dndHint: 'No signs left.',
          y: 'A pyramid has a polygon base and side faces with edges. A cone has a circle base and a smooth side.',
          n: 'Does the base have corners? Where there are corners there are edges too.',
          r: 'A circle has no corners, so a cone has no edges on its side either.',
        },
      }),

    /* 4 · multi · 🟡 — umumiysi. */
    q('04', 'Umumiysi nima?', '🟡', 'd41-common', 'multi', '🤝', [0, 2],
      {
        e: 'Ikkalasida ham bor', s: "To'rtta belgi. Ikkitasi piramidada ham, konusda ham bor.",
        a: 'Qaysi belgilar ikkalasida ham bor? Hammasini belgilang.',
        o: ['Balandligi bor', 'Asosi doira', 'Bitta uchi bor', 'Yon yoqlari qirrali'],
        y: "Ikkalasi ham fazoviy, demak balandligi bor. Ikkalasida ham yon tomon bitta uchda tutashadi.",
        n: 'Har belgini avval piramidaga, keyin konusga qo\'llab ko\'ring.',
        r: 'Piramida ham, konus ham bitta uchda tutashadi va ikkalasi fazoviy.',
      },
      {
        e: 'Есть у обоих', s: 'Четыре признака. Два есть и у пирамиды, и у конуса.',
        a: 'Какие признаки есть у обоих? Отметь все.',
        o: ['Есть высота', 'Основание круг', 'Есть одна вершина', 'Боковые грани с рёбрами'],
        y: 'Обе фигуры пространственные, значит есть высота. И у обеих бок сходится в одной вершине.',
        n: 'Приложи каждый признак сначала к пирамиде, потом к конусу.',
        r: 'И пирамида, и конус сходятся в одной вершине, и обе пространственные.',
      }, undefined, {
        en: {
          e: 'Both of them have it', s: 'Four signs. Two of them belong to a pyramid and a cone alike.',
          a: 'Which signs do both of them have? Mark them all.',
          o: ['It has height', 'The base is a circle', 'It has one apex', 'Side faces with edges'],
          y: 'Both shapes are solid, so they have height. And in both the side meets at one apex.',
          n: 'Try every sign on the pyramid first and then on the cone.',
          r: 'Both a pyramid and a cone meet at one apex, and both are solid.',
        },
      }),

    /* 5 · match · 🟡 — asos va nom. */
    q('05', 'Asos nomni beradi', '🟡', 'd41-name-from-base', 'match', '🔗', [0, 1, 2],
      {
        e: 'Uch piramida', s: "Piramidaning nomini uning asosi beradi.",
        a: 'Har piramidani uning nomiga ulang.',
        left: ['Asosida uchburchak', 'Asosida kvadrat', 'Asosida beshburchak'],
        right: ['Uchburchakli piramida', 'To\'rtburchakli piramida', 'Beshburchakli piramida'],
        y: "Nom asosdan olinadi: asosida uchburchak bo'lsa — uchburchakli piramida.",
        n: 'Piramidaning pastida qanday shakl yotibdi?',
        r: 'Piramidaning nomini asos beradi.',
      },
      {
        e: 'Три пирамиды', s: 'Название пирамиде даёт её основание.',
        a: 'Соедини каждую пирамиду с её названием.',
        left: ['В основании треугольник', 'В основании квадрат', 'В основании пятиугольник'],
        right: ['Треугольная пирамида', 'Четырёхугольная пирамида', 'Пятиугольная пирамида'],
        y: 'Название берут от основания: если в основании треугольник — треугольная пирамида.',
        n: 'Какая фигура лежит внизу пирамиды?',
        r: 'Название пирамиде даёт основание.',
      }, undefined, {
        en: {
          e: 'Three pyramids', s: 'A pyramid gets its name from its base.',
          a: 'Connect each pyramid with its name.',
          left: ['A triangle at the base', 'A square at the base', 'A pentagon at the base'],
          right: ['A triangular pyramid', 'A quadrangular pyramid', 'A pentagonal pyramid'],
          y: 'The name comes from the base: a triangle at the base makes a triangular pyramid.',
          n: 'Which shape lies at the bottom of the pyramid?',
          r: 'A pyramid gets its name from its base.',
        },
      }),

    /* 6 · order · 🟡 — yoqlar soni bo'yicha. */
    q('06', 'Yon yoqlar soni', '🟡', 'd41-sort-faces', 'order', '📈', [1, 0, 2, 3],
      {
        e: "To'rtta piramida", s: "Yon yoqlar soni asosning tomonlari soniga teng.",
        a: "Piramidalarni yon yoqlari soni bo'yicha kamidan ko'piga tartiblang.",
        o: ['To\'rtburchakli piramida', 'Uchburchakli piramida', 'Beshburchakli piramida', 'Oltiburchakli piramida'],
        y: "Uchburchaklida 3 ta yon yoq, to'rtburchaklida 4 ta, beshburchaklida 5 ta, oltiburchaklida 6 ta.",
        n: 'Asosning har tomoniga bittadan yon yoq to\'g\'ri keladi.',
        r: 'Yon yoqlar soni asos tomonlari soniga teng.',
      },
      {
        e: 'Четыре пирамиды', s: 'Число боковых граней равно числу сторон основания.',
        a: 'Расставь пирамиды по числу боковых граней от меньшего к большему.',
        o: ['Четырёхугольная пирамида', 'Треугольная пирамида', 'Пятиугольная пирамида', 'Шестиугольная пирамида'],
        y: 'У треугольной 3 боковые грани, у четырёхугольной 4, у пятиугольной 5, у шестиугольной 6.',
        n: 'На каждую сторону основания приходится по одной боковой грани.',
        r: 'Число боковых граней равно числу сторон основания.',
      }, undefined, {
        en: {
          e: 'Four pyramids', s: 'The number of side faces equals the number of sides of the base.',
          a: 'Put the pyramids in order of their number of side faces, from the fewest to the most.',
          o: ['A quadrangular pyramid', 'A triangular pyramid', 'A pentagonal pyramid', 'A hexagonal pyramid'],
          y: 'A triangular one has 3 side faces, a quadrangular one 4, a pentagonal one 5 and a hexagonal one 6.',
          n: 'Every side of the base gets one side face.',
          r: 'The number of side faces equals the number of sides of the base.',
        },
        orderBy: "yon yoqlar soni bo'yicha",
      }),

    /* 7 · input · 🟡 — hamma yoqlar. */
    q('07', 'Hammasi nechta yoq?', '🟡', 'd41-total-faces', 'input', '🔢', ['5'],
      {
        e: 'Ko\'rinmagani ham sanaladi', s: "To'rtburchakli piramida: asosi kvadrat, yon yoqlari to'rtta.",
        a: 'Hammasi bo\'lib nechta yoq bor?',
        y: "To'rtta yon yoq va bitta asos, jami beshta. Asos ham yoq, garchi u pastda turgani uchun ko'rinmasa ham.",
        n: 'Yon yoqlarni sanang va asosni unutmang.',
        r: 'Ko\'rinmaydigan yoqlar ham sanaladi.',
        p: 'Javob',
      },
      {
        e: 'Невидимое тоже считается', s: 'Четырёхугольная пирамида: основание квадрат, боковых граней четыре.',
        a: 'Сколько всего граней?',
        y: 'Четыре боковые грани и одно основание, всего пять. Основание тоже грань, хотя его не видно снизу.',
        n: 'Посчитай боковые грани и не забудь основание.',
        r: 'Невидимые грани тоже считаются.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'The unseen ones count too', s: 'A quadrangular pyramid: the base is a square and there are four side faces.',
          a: 'How many faces are there altogether?',
          y: 'Four side faces and one base, five in all. The base is a face too, even though you cannot see it from below.',
          n: 'Count the side faces and do not forget the base.',
          r: 'Faces you cannot see count as well.',
          p: 'Answer',
        },
      }),

    /* 8 · dnd · 🔴 — tekis yoki fazoviy. */
    q('08', 'Tekis yoki fazoviy?', '🔴', 'd41-flat-or-spatial', 'dnd', '🧭', [0, 1, 0, 1],
      {
        e: 'Kaft bilan tekshiring', s: "To'rtta shakl. Ba'zilari varaqqa yotadi, ba'zilari yo'q.",
        a: 'Shakllarni ajrating: qaysilari tekis, qaysilari fazoviy.',
        tokens: ['Katta kvadrat', 'Kichik konus', 'Beshburchak', 'Uchburchakli piramida'],
        zones: ['Tekis', 'Fazoviy'],
        dndHint: 'Shakllar tugadi.',
        y: "O'lcham bu yerda hech nima: katta kvadrat ham tekisligicha qoladi, kichik konus esa baribir fazoviy.",
        n: 'Shaklda balandlik bormi? Gap o\'lchamda emas, balandlikda.',
        r: 'Tekis yoki fazoviy ekanini o\'lcham emas, balandlik hal qiladi.',
      },
      {
        e: 'Проверь ладонью', s: 'Четыре фигуры. Одни ложатся на лист, другие нет.',
        a: 'Разложи фигуры: какие плоские, а какие пространственные.',
        tokens: ['Большой квадрат', 'Маленький конус', 'Пятиугольник', 'Треугольная пирамида'],
        zones: ['Плоская', 'Пространственная'],
        dndHint: 'Фигуры закончились.',
        y: 'Размер здесь ничего не значит: большой квадрат всё равно плоский, а маленький конус всё равно пространственный.',
        n: 'Есть ли у фигуры высота? Дело не в размере, а в высоте.',
        r: 'Плоская фигура или пространственная, решает не размер, а высота.',
      }, undefined, {
        en: {
          e: 'Check with your palm', s: 'Four shapes. Some lie flat on paper, others do not.',
          a: 'Sort the shapes: which ones are flat and which are solid.',
          tokens: ['A big square', 'A small cone', 'A pentagon', 'A triangular pyramid'],
          zones: ['Flat', 'Solid'],
          dndHint: 'No shapes left.',
          y: 'Size means nothing here: a big square is still flat and a small cone is still solid.',
          n: 'Does the shape have height? It is not about size, it is about height.',
          r: 'Whether a shape is flat or solid is decided by height, not by size.',
        },
      }),

    /* 9 · choice · 🔴 — konusning farqi. */
    q('09', 'Konusning farqi', '🔴', 'd41-cone-difference', 'choice', '🔎', 1,
      {
        e: 'Nima bilan farq qiladi?', s: "Konus ham, piramida ham bitta uchda tutashadi.",
        a: 'Konus piramidadan nimasi bilan farq qiladi?',
        o: [
          'Konus har doim kichikroq',
          'Konusning asosi doira va yoni silliq',
          'Konusning balandligi yo\'q',
          'Konusda uch yo\'q',
        ],
        y: "Konusning asosi doira, doirada esa burchak yo'q — shuning uchun yon sirti silliq, qirrasiz.",
        n: 'Ikkala shaklning asosiga qarang: ular qanday?',
        by: [
          "O'lcham farq qilmaydi: konus katta ham, kichik ham bo'lishi mumkin.",
          undefined,
          "Balandlik ikkalasida ham bor, ular fazoviy shakllar.",
          "Uch ikkalasida ham bor, aynan shu ularni o'xshatadi.",
        ],
        r: 'Konusning asosi doira, yon sirti silliq va qirrasiz.',
      },
      {
        e: 'Чем отличается?', s: 'И конус, и пирамида сходятся в одной вершине.',
        a: 'Чем конус отличается от пирамиды?',
        o: [
          'Конус всегда меньше',
          'У конуса основание круг и гладкий бок',
          'У конуса нет высоты',
          'У конуса нет вершины',
        ],
        y: 'У конуса основание круг, а у круга нет углов — поэтому и бок гладкий, без рёбер.',
        n: 'Посмотри на основания обеих фигур: какие они?',
        by: [
          'Размер не отличает: конус бывает и большой, и маленький.',
          undefined,
          'Высота есть у обеих, это пространственные фигуры.',
          'Вершина есть у обеих, как раз это их и роднит.',
        ],
        r: 'У конуса основание круг, а боковая поверхность гладкая, без рёбер.',
      }, undefined, {
        en: {
          e: 'What is the difference?', s: 'Both a cone and a pyramid meet at one apex.',
          a: 'How is a cone different from a pyramid?',
          o: ['A cone is always smaller', 'A cone has a circle base and a smooth side', 'A cone has no height', 'A cone has no apex'],
          y: 'A cone has a circle base, and a circle has no corners — that is why its side is smooth, with no edges.',
          n: 'Look at the bases of both shapes: what are they?',
          by: [
            'Size does not tell them apart: a cone can be big or small.',
            undefined,
            'Both have height, they are solid shapes.',
            'Both have an apex, and that is exactly what they share.',
          ],
          r: 'A cone has a circle base and a smooth side surface with no edges.',
        },
      }),

    /* 10 · input · 🔴 — uchburchakli piramida. */
    q('10', 'Uchburchakli piramida', '🔴', 'd41-triangular', 'input', '🚀', ['4'],
      {
        e: 'Yakuniy mashq', s: "Piramidaning asosida uchburchak yotibdi.",
        a: 'Bu piramidada hammasi bo\'lib nechta yoq bor?',
        y: "Asos uchburchak, demak yon yoqlar uchta. Asos bilan birga to'rtta yoq.",
        n: 'Yon yoqlar soni asos tomonlari soniga teng. Asosni ham qo\'shing.',
        r: 'Yoqlar soni: asos tomonlari soni ortiqcha bitta asos.',
        p: 'Javob',
      },
      {
        e: 'Итоговое задание', s: 'В основании пирамиды лежит треугольник.',
        a: 'Сколько всего граней у этой пирамиды?',
        y: 'Основание треугольник, значит боковых граней три. Вместе с основанием получается четыре грани.',
        n: 'Число боковых граней равно числу сторон основания. Прибавь само основание.',
        r: 'Число граней: число сторон основания плюс одно основание.',
        p: 'Ответ',
      }, 'numeric', {
        en: {
          e: 'Final task', s: 'A triangle lies at the base of a pyramid.',
          a: 'How many faces does this pyramid have altogether?',
          y: 'The base is a triangle, so there are three side faces. Together with the base that makes four faces.',
          n: 'The number of side faces equals the number of sides of the base. Add the base itself.',
          r: 'The number of faces: the number of sides of the base plus one base.',
          p: 'Answer',
        },
      }),
  ],
};

export default DARS41_BANK;
