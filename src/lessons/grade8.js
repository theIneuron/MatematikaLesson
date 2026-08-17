import { lazy } from 'react'

// 8-sinf NAZARIY darslari.
// Reja: src/books/grade8/DARSLAR_REJASI_8SINF.md
// Kontrakt: src/books/grade8/ETALON_8SINF.md
//
// 2026-08-13, metodist qarori: 8-sinfning HAMMA eski darslari o'chirildi.
// Nima uchun: `Dars01` (16 ekran) va `Dars07` monolit edi, ikkisida ovoz
// dvijokining o'z nusxasi yotardi (§1); `Dars03` (pilot) o'z ma'lumot
// kontraktiga mos emas edi (§21 p. 8); `Dars01v2` boshqa konsepsiya edi.
// O'chirilganlar: git tarixida (Dars01, Dars03, Dars07) va
// `_archive/unused-code/grade8-dars01v2/` da (Dars01v2, labkit).
//
// Endi sinf shu tartibda ishlaydi: `screens.jsx` — o'ram bir marta,
// `tools.jsx` — asboblar, `DarsNN.jsx` — FAQAT ma'lumot.
// Yangi dars: `node scripts/grade8-new-lesson.mjs <N> "<mavzu>"`.
export const grade8Nazariy = [
  {
    slug: 'dars01-ratsional-ifodalar-va-kasrlar',
    title: 'Dars 1. Ratsional ifodalar va ratsional kasrlar',
    desc: "Xuk: bitta yozuv, ikki mashina. 3-ekranda dastur misolni O'ZI yechadi (qo'l, uchuvchi son, chiziqning uzilishi), 4-ekranda o'quvchi shuni o'zi qiladi. Qoidani o'quvchi yig'adi. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars01.jsx')),
  },
]
