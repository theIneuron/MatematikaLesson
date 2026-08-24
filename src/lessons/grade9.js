import { lazy } from 'react'

// 9-sinf darslari. Reja: src/books/grade9/DARSLAR_REJASI_9SINF.md (52 o'quv dars,
// PK va IK kirmaydi). Temalar manbasi: Math_1-11_Поурочно_RUz_v4 (2).xlsx, «9 класс».
// Yondashuv: src/books/grade9/PODXOD_9SINF.md — avval asbob, keyin darslar.
// Kontrakt: src/books/grade9/ETALON_9SINF.md.
//
// Yadro `components/shared/lesson-core.jsx`, mayda asboblar
// `components/shared/lesson-tools.jsx`, 1-asbob `components/grade9/tools.jsx`.
//
// Ishlab chiqarish tartibi dars raqami bo'yicha EMAS, asbob bo'yicha:
// pilot = Dars 15 (1-asbob eng keng: 13 dars), keyin 14, 6, 17.
export const grade9Nazariy = [
  {
    // 2026-08-20. 1-dars 8-sinf karkasida yig'ildi, keyin metodist «faqat
    // nusxa chiqdi» deganidan keyin SINFNING O'Z ASBOBLARIGA ko'chirildi
    // (`grade9/asboblar.jsx`: mashina, taxta, iz, punkt, chizg'ich).
    // Fayl nomi va slug sinf rejasi bo'yicha.
    slug: 'dars01-funksiya',
    title: 'Dars 1. Funksiya',
    desc: "To'p uchirish: qiymatlar mashinasi, vaqt sirg'ituvchisi, moslik taxtasi, juftliklardan iz, aniqlanish sohasi o'tkazish punkti. Qoidani o'quvchi o'zi yig'adi, keyin mashqlar, xato qatorni topish va qadamlab yechim. Ta'rif darslikdan (9-§, 37-bet). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars01.jsx')),
  },
  {
    slug: 'dars15-oraliqlar-usuli',
    title: 'Dars 15. Oraliqlar usuli',
    desc: "Sonlar o'qi va ishoralar: javob to'plam bo'lib yig'iladi, ishora son qo'yib tekshiriladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars15.jsx')),
  },
]
