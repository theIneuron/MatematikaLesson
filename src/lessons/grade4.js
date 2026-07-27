import { lazy } from 'react'

// 4-sinf NAZARIY darslari. Barcha yangi komponentlar faqat components/grade4/ ichida yaratiladi.
export const grade4Nazariy = [
  {
    slug: 'dars01-kop-xonali-sonlar-sinflari',
    title: "Dars 1. Ko'p xonali sonlar sinflari",
    desc: "Ko'p xonali sonni o'ngdan uch raqamli sinflarga ajratish, raqamning o'rin qiymatini aniqlash va ichki nol qatnashgan sonlarni tuzish.",
    Component: lazy(() => import('../components/grade4/Dars01.jsx')),
  },
]
