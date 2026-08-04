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

// 4-sinf AMALIY mashg'ulotlari. Har nazariy darsga 10 tekshiriladigan topshiriq
// (ETALON_4SINF §9). Amaliyot ovozsiz ishlaydi.
export const grade4Amaliy = [
  {
    slug: 'dars01-amaliyot-sinflar',
    title: "Dars 1. Amaliyot: sonlar sinflari",
    desc: "10 topshiriq: sinf chegarasi, xona qiymati, ichki nollar, xatoni topish va yangi shaklga ko'chirish.",
    Component: lazy(() => import('../components/grade4/Dars01Practice.jsx')),
  },
]
