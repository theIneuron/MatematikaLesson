import { lazy } from 'react'

// 7-sinf NAZARIY darslari. Barcha yangi komponentlar components/grade7/ ichida yaratiladi.
// Reja: src/books/grade7/DARSLAR_REJASI_7SINF.md.
export const grade7Nazariy = [
  {
    slug: 'dars01-sonli-ifodalar',
    title: 'Dars 1. Sonli ifodalar',
    desc: 'Sonli ifodalar: qavslar, amallar tartibi va xatolar auditi. 16 ta interaktiv ekran, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade7/Dars01.jsx')),
  },
  {
    slug: 'dars07-teskari-proporsionallik-va-grafik',
    title: 'Dars 7. Teskari proporsionallik va uning grafigi',
    desc: "y = k/x modelini tajriba, jadval, formula va giperbola orqali o'rganish. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars07.jsx')),
  },
]
