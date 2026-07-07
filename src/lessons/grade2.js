import { lazy } from 'react'

// 2-sinf NAZARIY darslari (Dars01–…). Yangi dars shu yerga qo'shiladi.
// Reja: DARSLAR_REJASI_1-11.md «2 класс» (39 dars + 7 nazorat).
// Etalon kontrakt: src/books/grade2/ETALON_2SINF.md.
export const grade2Nazariy = [
  {
    slug: 'dars01-onliklar-va-birliklar',
    title: "Dars 1. O'nliklar va birliklar",
    desc: "O'nta birlik — bitta o'nlik (dasta); ikki xonali son = o'nliklar + birliklar (45 = 4 o'nlik 5 birlik).",
    Component: lazy(() => import('../components/grade2/Dars01.jsx')),
  },
]

// 2-sinf AMALIY mashqlari (jsx-question, PracticeHost preview orqali).
export const grade2Amaliy = [
  {
    slug: 'amaliyot01-onliklar-va-birliklar',
    title: "Amaliyot 1. O'nliklar va birliklar",
    desc: "Dasta (o'nlik) va tayoqchalardan (birlik) sonni toping — tap-tanlash.",
    Component: lazy(() => import('../components/grade2/practice/Amaliyot01Page.jsx')),
  },
]
