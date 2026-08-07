import { lazy } from 'react'

// 9-sinf darslari. Reja: src/books/grade9/DARSLAR_REJASI_9SINF.md (52 o'quv dars,
// PK va IK kirmaydi). Temalar manbasi: Math_1-11_Поурочно_RUz_v4 (2).xlsx, «9 класс».
// Yondashuv: src/books/grade9/PODXOD_9SINF.md — avval asbob, keyin darslar.
// Kontrakt: src/books/grade9/ETALON_9SINF.md.
//
// Yadro `components/shared/lesson-core.jsx`, mayda asboblar
// `components/shared/lesson-tools.jsx`, 1-asbob `components/grade9/tools.jsx`.
//
// Ishlab chiqarish tartibi dars raqami bo'yicha EMAS, asbob bo'yicha:
// pilot = Dars 15 (1-asbob eng keng: 13 dars), keyin 14, 6, 17.
export const grade9Nazariy = [
  {
    slug: 'dars15-oraliqlar-usuli',
    title: 'Dars 15. Oraliqlar usuli',
    desc: "Sonlar o'qi va ishoralar: javob to'plam bo'lib yig'iladi, ishora son qo'yib tekshiriladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars15.jsx')),
  },
]
