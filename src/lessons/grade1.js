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
  {
    slug: 'dars08-ayirish-manosi',
    title: "Dars 8. Ayirishning ma'nosi",
    desc: "Olib tashlash/berish — ayirish (−); olinsa kamayadi (10 ichida).",
    Component: lazy(() => import('../components/grade1/Dars08.jsx')),
  },
  {
    slug: 'dars09-amallar-5-ichida',
    title: "Dars 9. 5 ichida qo'shish va ayirish",
    desc: "Son o'qida sakrash (+ oldinga, − orqaga); 5 ichida amaliyot.",
    Component: lazy(() => import('../components/grade1/Dars09.jsx')),
  },
  {
    slug: 'dars10-amallar-10-ichida',
    title: "Dars 10. 10 ichida qo'shish va ayirish",
    desc: "Son o'qi 0–10; aralash qo'shish va ayirish.",
    Component: lazy(() => import('../components/grade1/Dars10.jsx')),
  },
  {
    slug: 'dars11-orin-almashtirish',
    title: "Dars 11. O'rin almashtirish",
    desc: "3+2 = 2+3; qo'shiluvchilar o'rin almashsa, yig'indi o'zgarmaydi.",
    Component: lazy(() => import('../components/grade1/Dars11.jsx')),
  },
  {
    slug: 'dars12-tenglik-tengsizlik-qavslar',
    title: "Dars 12. Tenglik, tengsizlik va qavslar",
    desc: "Yozuv to'g'rimi-noto'g'rimi; =, >, < belgilari; qavs ichini avval sanaymiz (10 ichida).",
    Component: lazy(() => import('../components/grade1/Dars12.jsx')),
  },
  {
    slug: 'dars13-onlik-sanoq-birligi',
    title: "Dars 13. O'nlik — sanoq birligi",
    desc: "10 ta birlik = 1 o'nlik (dasta); maktab, Jasur qo'shiladi.",
    Component: lazy(() => import('../components/grade1/Dars13.jsx')),
  },
  {
    slug: 'dars14-sonlar-11-15',
    title: "Dars 14. Sonlar 11–15",
    desc: "1 o'nlik + birliklar = o'n bir...o'n besh (Rekenrek 2 qator).",
    Component: lazy(() => import('../components/grade1/Dars14.jsx')),
  },
  {
    slug: 'dars15-sonlar-16-20',
    title: "Dars 15. Sonlar 16–20",
    desc: "1 o'nlik + birliklar = o'n olti...yigirma; bozor sahnasi.",
    Component: lazy(() => import('../components/grade1/Dars15.jsx')),
  },
  {
    slug: 'dars16-ongacha-toldirish',
    title: "Dars 16. 10gacha to'ldirish",
    desc: "To'liq o'nlikgacha nechta yetishmaydi (8+2, 7+3); 10 katakli javon.",
    Component: lazy(() => import('../components/grade1/Dars16.jsx')),
  },
  {
    slug: 'dars17-otib-qoshish',
    title: "Dars 17. O'nlikdan o'tib qo'shish",
    desc: "8+5 = 8+2+3 = 10+3 = 13; avval 10 ga to'ldir, keyin qolganini.",
    Component: lazy(() => import('../components/grade1/Dars17.jsx')),
  },
  {
    slug: 'dars18-otib-qoshish-amaliyot',
    title: "Dars 18. O'tib qo'shish — amaliyot",
    desc: "20 ichida o'nlikdan o'tib qo'shish mashqi (bozor, olma).",
    Component: lazy(() => import('../components/grade1/Dars18.jsx')),
  },
  {
    slug: 'dars19-otib-ayirish',
    title: "Dars 19. O'nlikdan o'tib ayirish",
    desc: "13−5 = 13−3−2 = 10−2 = 8; avval 10 ga tushir, keyin qolganini.",
    Component: lazy(() => import('../components/grade1/Dars19.jsx')),
  },
  {
    slug: 'dars20-otib-ayirish-amaliyot',
    title: "Dars 20. O'tib ayirish — amaliyot",
    desc: "20 ichida o'nlikdan o'tib ayirish mashqi (uy sahnasi).",
    Component: lazy(() => import('../components/grade1/Dars20.jsx')),
  },
]
