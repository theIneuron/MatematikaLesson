import { lazy } from 'react'

// 8-sinf NAZARIY darslari.
// Reja: src/books/grade8/DARSLAR_REJASI_8SINF.md.
export const grade8Nazariy = [
  {
    slug: 'dars03-kasrlarni-qisqartirish',
    title: 'Dars 3. Ratsional kasrlarni qisqartirish',
    desc: "PILOT: o'quvchi javobni YOZADI, tekshiruv son qo'yib bajariladi. ODZ birinchi qatorda. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars03.jsx')),
  },
  {
    slug: 'dars01-ratsional-ifodalar-va-kasrlar',
    title: 'Dars 1. Ratsional ifodalar va ratsional kasrlar',
    desc: "Maxraj orqali taqiqlangan qiymatni topish, nol surat va nol maxrajni farqlash. 16 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars01.jsx')),
  },
  {
    slug: 'dars07-teskari-proporsionallik-va-grafik',
    title: 'Dars 7. Teskari proporsionallik va uning grafigi',
    desc: "y = k/x modelini tajriba, jadval, formula va giperbola orqali o'rganish. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars07.jsx')),
  },
]
