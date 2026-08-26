import { lazy } from 'react'

// 9-sinf darslari. Reja: src/books/grade9/DARSLAR_REJASI_9SINF.md (52 o'quv dars,
// PK va IK kirmaydi). Temalar manbasi: Math_1-11_Поурочно_RUz_v4 (2).xlsx, «9 класс».
// Yondashuv: src/books/grade9/PODXOD_9SINF.md — avval asbob, keyin darslar.
// Kontrakt: src/books/grade9/ETALON_9SINF.md.
//
// 2026-08-25: pilot bo'lgan Dars 15 (eski `grade9/tools.jsx` asbobida, birinchi
// etalon reduksiyasi bo'yicha) metodist qaroriga ko'ra o'chirildi — sinfning
// o'z asboblariga (`grade9/asboblar.jsx`) ko'chirilmasdan qolgan edi. Mavzu
// («15. Oraliqlar usuli») DARSLAR_REJASI_9SINF.md da qoladi, qayta yig'iladi.
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
]

// 9-sinf AMALIYOTI. Metodist qarori 2026-08-26: 52 dars x 10 topshiriq,
// har darsda AYNAN o'sha o'nta mexanika, faqat ketma-ketlik boshqa.
// Kontrakt: src/books/grade9/TIPLAR_AMALIYOT_9SINF.md.
// Amaliyot ovozsiz. Marshrut: /9-sinf/matematika/amaliy/<slug>.
export const grade9Amaliy = [
  {
    slug: 'dars01-amaliyot',
    title: "Dars 1 amaliyoti — funksiya va aniqlanish sohasi (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: juftliklardan funksiyani ajratish, jadvalni ikki tomonga to'ldirish, grafik bo'yicha to'rtta hukm, tekislikka nuqta qo'yish, formulalarni taqiq turi bo'yicha guruhlash, ikkita taqiqni yozish, sohani o'qda ko'rsatish, yechim qadamlarini tartibga solish, birinchi xato qatorni topish, to'rtta yozuvni sohasi bilan moslashtirish. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars01/Dars01Practice.jsx')),
  },
]
