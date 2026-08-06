import { lazy } from 'react'

// 11-sinf darslari.
// Temalar manbasi: src/books/Math_1-11_Поурочно_RUz.xlsx, «11 класс» varag'i
// (58 satr: 50 dars + 7 PK + IK). Reja O'ZGARTIRILMAYDI.
// Yondashuv: src/books/grade11/PODXOD_11SINF.md — avval asbob, keyin darslar.
// Yadro `components/grade11/core.jsx`, asboblar `components/grade11/tools.jsx`.
//
// Ishlab chiqarish tartibi dars raqami bo'yicha EMAS, asbob bo'yicha:
// pilot = Dars 12, keyin 9-11, 13, 14 (Б2 yopiladi), keyin qolgan bloklar.
export const grade11Nazariy = [
  {
    slug: 'dars12-logarifmik-tengsizliklar',
    title: 'Dars 12. Logarifmik tengsizliklar',
    desc: "Asos birdan katta va kichik holatlar, argumentga shart, javobni nuqta bilan tekshirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars12.jsx')),
    // Dars til almashtirgichini O'ZI yuqori panelida chizadi. Previuning
    // qo'shimcha almashtirgichi kerak emas: u darsning ovoz tugmasi ustiga
    // tushib, uni bosilmaydigan qilib qo'yardi.
    ownLangSwitch: true,
  },
]
