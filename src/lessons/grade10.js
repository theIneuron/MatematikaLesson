import { lazy } from 'react'

// 10-sinf darslari. Reja: src/books/grade10/DARSLAR_REJASI_10SINF.md (53 dars).
// Yondashuv: src/books/grade10/PODXOD_10SINF.md — avval asboblar, keyin darslar.
// Yadro `components/grade10/core.jsx`, asboblar `components/grade10/tools.jsx`.
//
// Ishlab chiqarish tartibi dars raqami bo'yicha EMAS, asbob bo'yicha:
// pilot = Dars 3 (1-asbob, birlik aylana), keyin 1, 2, 4, 5.
export const grade10Nazariy = [
  {
    slug: 'dars03-trigonometrik-doira',
    title: 'Dars 3. Trigonometrik doira',
    desc: "Birlik aylana: nuqta koordinatalari kosinus va sinus. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars03.jsx')),
  },
]
