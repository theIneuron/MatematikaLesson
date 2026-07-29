import { lazy } from 'react'

// 8-sinf NAZARIY darslari.
// Reja: src/books/grade8/DARSLAR_REJASI_8SINF.md.
// Etalon: src/books/grade8/ETALON_8SINF.md.
export const grade8Nazariy = [
  {
    slug: 'dars01-ratsional-ifodalar-va-kasrlar',
    title: 'Dars 1. Ratsional ifodalar va ratsional kasrlar',
    desc: "Formulani tadqiq qilish, gipoteza, maxrajning nolga teng bo'lmaslik sharti, mumkin va taqiqlangan qiymatlar. 16 ta interaktiv bosqich, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars01.jsx')),
  },
]
