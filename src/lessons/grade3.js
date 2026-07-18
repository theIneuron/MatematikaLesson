import { lazy } from 'react'

// 3-sinf NAZARIY darslari (Dars01–…). Yangi dars shu yerga qo'shiladi.
// Reja: DARSLAR_REJASI_1-11.md «3 класс» (51 dars + 7 nazorat).
// Syujet: src/books/grade3/SYUJET_3SINF.md («Bit sayyorasi Lumo»).
// Etalon kontrakt (meros): src/books/grade2/ETALON_2SINF.md → grade-3 etaloni Dars01.
export const grade3Nazariy = [
  {
    slug: 'dars01-yuzlik-onlik-birlik',
    title: "Dars 1. Yuzliklar, o'nliklar va birliklar",
    desc: "O'nta o'nlik — bitta yuzlik; uch xonali son = yuzlik + o'nlik + birlik (345 = 3 yuzlik 4 o'nlik 5 birlik); nol o'rinni saqlaydi (305).",
    Component: lazy(() => import('../components/grade3/Dars01.jsx')),
  },
]

// 3-sinf AMALIY darslari — hali yo'q (keyin qo'shiladi).
export const grade3Amaliy = []
