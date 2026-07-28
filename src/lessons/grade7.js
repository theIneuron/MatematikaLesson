import { lazy } from 'react'

// 7-sinf NAZARIY darslari. Barcha yangi komponentlar components/grade7/ ichida yaratiladi.
// Reja: src/books/grade7/DARSLAR_REJASI_7SINF.md.
export const grade7Nazariy = [
  {
    slug: 'dars01-sonli-ifodalar',
    title: 'Dars 1. Sonli ifodalar',
    desc: "Qavsli ko'p amalli sonli ifodaning qiymatini topish: qavslar, ko'paytirish va bo'lish, so'ng qo'shish va ayirish. Murakkab yakor misol, xato tahlili va vaqtli aniq sprint.",
    Component: lazy(() => import('../components/grade7/Dars01.jsx')),
  },
]
