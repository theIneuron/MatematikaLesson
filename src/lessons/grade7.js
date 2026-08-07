import { lazy } from 'react'

// 7-sinf darslari. Reja: src/books/grade7/DARSLAR_REJASI_7SINF.md (48 dars).
// Yondashuv: src/books/grade7/PODXOD_7SINF.md — avval asboblar, keyin darslar.
// Yadro `components/grade7/core.jsx`, asboblar `components/grade7/tools.jsx`.
//
// Ishlab chiqarish tartibi dars raqami bo'yicha EMAS, asbob bo'yicha:
// pilot = Dars 5, keyin 1-4, keyin qolgan bloklar.
export const grade7Nazariy = [
  {
    slug: 'dars05-qavslarni-ochish',
    title: 'Dars 5. Qavslarni ochish',
    desc: "Qavs oldidagi ko'paytuvchi, minus va plyus. Uch qoida, sonli guvoh bilan tekshirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars05.jsx')),
  },
]
