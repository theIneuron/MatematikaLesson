import { lazy } from 'react'

// 3-sinf INFORMATIKA darslari. Yangi fan: birinchi dars 2026-08-04 da yig'ildi.
//
// Kod daraxti: src/courses/informatika3/ (yangi sxema — kontent alohida, karkas
// bitta nusxada). Karkas grade3 dan olinadi, chunki dars mexanikasi fanga bog'liq
// emas: src/courses/informatika3/kit/index.js dagi izohga qarang.
//
// Dars ketma-ketligi (taklif, metodist tasdiqlashi kerak):
//   1. Kompyuter nima?              <- TAYYOR
//   2. Buyruq va dastur
//   3. Fayl va papka
//   4. Klaviatura va sichqoncha bilan ishlash
//   5. Internet nima va xavfsizlik
export const informatika3Nazariy = [
  {
    slug: 'dars01-kompyuter-nima',
    title: 'Dars 1. Kompyuter nima?',
    desc: "Kompyuter — ma'lumotni qabul qiladigan, qayta ishlaydigan, saqlaydigan va natijani chiqaradigan qurilma; kirish va chiqish qurilmalari; protsessor, xotira, disk; kompyuter o'ylamaydi, buyruqni bajaradi.",
    Component: lazy(() => import('../courses/informatika3/lessons/Dars01.jsx')),
  },
]
