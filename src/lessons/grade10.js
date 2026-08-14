import { lazy } from 'react'

// 10-sinf darslari. Reja: src/books/grade10/DARSLAR_REJASI_10SINF.md (53 dars).
// Yondashuv: src/books/grade10/PODXOD_10SINF.md — avval asboblar, keyin darslar.
// Yadro `components/grade10/core.jsx`, asboblar `components/grade10/tools.jsx`.
//
// Ishlab chiqarish tartibi dars raqami bo'yicha EMAS, asbob bo'yicha:
// pilot = Dars 3 (1-asbob, birlik aylana), keyin 1, 2, 4, 5.
//
// Darsda faqat MA'LUMOT bo'ladi: o'ram `components/grade10/screens.jsx` da.
// Yangi dars karkasi buyruq bilan yasaladi:
//   node scripts/grade10-new-lesson.mjs <raqam> <slug> "<tema UZ>" "<tema EN>"
export const grade10Nazariy = [
  {
    slug: 'dars03-trigonometrik-doira',
    title: 'Dars 3. Trigonometrik doira',
    desc: "Birlik aylana: nuqta koordinatalari kosinus va sinus. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars03.jsx')),
  },
  {
    slug: 'dars01-radianlar',
    title: 'Dars 1. Radianlar',
    desc: "Burchak yoy uzunligi bilan o'lchanadi: radiusni yoy bo'ylab yotqizamiz. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars01.jsx')),
  },
  {
    slug: 'dars02-sin-cos-tg',
    title: 'Dars 2. sin/cos/tg',
    desc: "Nuqtaning koordinatalari: birinchi son kosinus, ikkinchisi sinus, nisbati tangens. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars02.jsx')),
  },
  {
    slug: 'dars04-ishoralar-qiymatlar',
    title: 'Dars 4. Ishoralar va qiymatlar',
    desc: "Ishora bu yo'nalish, yodlangan qoida emas. Choraklar, tangens ishorasi, o'tkir burchakka keltirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars04.jsx')),
  },
  {
    slug: 'dars05-juftlik-davr',
    title: 'Dars 5. Juftlik va davr',
    desc: "Ko'zgu: siljish qoladi, balandlik ishorasini almashtiradi. To'liq aylana o'sha nuqtaga qaytaradi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars05.jsx')),
  },
  {
    slug: 'dars06-grafiklar',
    title: 'Dars 6. Grafiklar',
    desc: "Grafik jadvaldan emas: aylana yoyiladi va nuqtaning balandligi egri chiziqni chizadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars06.jsx')),
  },
]
