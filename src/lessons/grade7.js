import { lazy } from 'react'

// 7-sinf darslari. Reja: src/books/grade7/DARSLAR_REJASI_7SINF.md (48 dars).
// Yondashuv: src/books/grade7/PODXOD_7SINF.md — avval asboblar, keyin darslar.
// Yadro `components/grade7/core.jsx`, asboblar `components/grade7/tools.jsx`.
//
// Ishlab chiqarish tartibi dars raqami bo'yicha EMAS, asbob bo'yicha:
// pilot = Dars 5, keyin 1-4, keyin qolgan bloklar.
export const grade7Nazariy = [
  {
    // 1-4-sinf darslarining tuzilishi 7-sinf kontraktiga ko'chirilgan variant:
    // qoidani o'quvchi YIG'ADI, qo'l YOZUVNING ICHIDA ishlaydi, qoida esa
    // xuk savoliga javob beradi. Raskadrovka: src/books/grade7/DARS01_SKELET.md
    slug: 'dars01-sonli-ifodalar',
    title: 'Dars 1. Sonli ifodalar',
    desc: "Amallar tartibi va ifodaning qiymati. Ikki kalkulyator, bitta yozuv, ikki xil son. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars01.jsx')),
  },
  {
    slug: 'dars05-qavslarni-ochish',
    title: 'Dars 5. Qavslarni ochish',
    desc: "Qavs oldidagi ko'paytuvchi, minus va plyus. Uch qoida, sonli guvoh bilan tekshirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars05.jsx')),
  },
  {
    // TZ bo'yicha NOLDAN yozilgan variant. Eski dars qabul qilinmaguncha
    // YONMA-YON turadi: metodist ikkalasini solishtira oladi.
    slug: 'dars05-qavslarni-ochish-v2',
    title: 'Dars 5 (v2). Qavslarni ochish',
    desc: "Texnik topshiriq bo'yicha noldan: sut rangli fon, mono formula, har ekranda «Bosing». 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars05v2.jsx')),
  },
]
