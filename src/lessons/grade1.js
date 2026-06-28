import { lazy } from 'react'

// 1-sinf darslari. Yangi darslar shu yerga qo'shiladi.
export const grade1 = [
  {
    slug: 'dars01-sanash-1-5',
    title: 'Dars 1. Predmetlarni sanash va 1–5 sonlar',
    desc: 'Predmetlarni birma-bir sanash, kardinallik, raqam ↔ miqdor (1–5).',
    Component: lazy(() => import('../components/grade1/Dars01.jsx')),
  },
  {
    slug: 'dars02-raqamlar-1-5',
    title: 'Dars 2. Raqamlar 1–5',
    desc: 'Raqam shaklini tanish (1–5), raqam ↔ miqdor, 1–5 tartiblash.',
    Component: lazy(() => import('../components/grade1/Dars02.jsx')),
  },
  {
    slug: 'dars03-sonlar-6-10-nol',
    title: 'Dars 3. Sonlar 6–10 va 0 soni',
    desc: "6–10 ni \"5 va yana\" bilan sanash, son ↔ miqdor, 6–10 tartiblash, nol (bo'sh uy).",
    Component: lazy(() => import('../components/grade1/Dars03.jsx')),
  },
  {
    slug: 'dars04-taqqoslash-10',
    title: 'Dars 4. Sonlarni taqqoslash (10 gacha)',
    desc: "Ikki to'plamni sanab taqqoslash, katta / kichik / teng, > < = belgilari.",
    Component: lazy(() => import('../components/grade1/Dars04.jsx')),
  },
  {
    slug: 'dars05-sonning-tarkibi-2-5',
    title: 'Dars 5. Sonning tarkibi 2–5',
    desc: "Sonni ikki qismga bo'lish (ikki savat), 2–5 tarkibi, juftlar; tap/drag bilan.",
    Component: lazy(() => import('../components/grade1/Dars05.jsx')),
  },
  {
    slug: 'dars06-son-tarkibi-6-10',
    title: 'Dars 6. Son tarkibi 6–10',
    desc: "Ikki rangli ten-frame (qizil/yashil): sonni ikki qismga bo'lish (6–10), o'nlik juftlari; Dars05 metodi.",
    Component: lazy(() => import('../components/grade1/Dars06.jsx')),
  },
  {
    slug: 'dars07-qoshish-manosi',
    title: "Dars 7. Qo'shishning ma'nosi",
    desc: "Ikki guruhni birlashtirish — qo'shish (+); birlashsa ko'payadi (10 ichida).",
    Component: lazy(() => import('../components/grade1/Dars07.jsx')),
  },
]
