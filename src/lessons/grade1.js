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
]
