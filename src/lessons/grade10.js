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
]
