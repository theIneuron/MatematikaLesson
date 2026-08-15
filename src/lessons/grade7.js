import { lazy } from 'react'

// 7-sinf darslari. Reja: src/books/grade7/DARSLAR_REJASI_7SINF.md (48 dars).
// Kirish nuqtasi: START_GRADE7.md (ildizda). Sinf ETALONI -- 1-dars.
//
// 5-dars 2026-08-15 da ro'yxatdan OLIB TASHLANDI (metodist qarori): u eski
// yondashuvda yig'ilgan va yangi etalonga tushmaydi, shuning uchun NOLDAN
// qayta yoziladi. Eski fayllar o'chirilmadi -- ular
// `_archive/unused-code/grade7-dars05/` da yotibdi va u yerdan
// IMPORT QILINMAYDI (CLAUDE.md §6.4). Kerak bo'lsa, ular ongli ravishda
// loyihaga qaytariladi, arxivdan ulanmaydi.
export const grade7Nazariy = [
  {
    // Sinf ETALONI. Yangi darslar shu naqsh bo'yicha yig'iladi:
    // qoidani o'quvchi YIG'ADI, qo'l YOZUVNING ICHIDA ishlaydi, qoida esa
    // xuk savoliga javob beradi. Holat: src/books/grade7/DARS01_HOLAT.md
    slug: 'dars01-sonli-ifodalar',
    title: 'Dars 1. Sonli ifodalar',
    desc: "Amallar tartibi va ifodaning qiymati. Ikki kalkulyator, bitta yozuv, ikki xil son. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars01.jsx')),
  },
]
