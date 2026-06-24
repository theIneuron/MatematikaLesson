import { lazy } from 'react'

// 1-sinf darslari. Yangi darslar shu yerga qo'shiladi.
export const grade1 = [
  {
    slug: 'dars01-sanash-1-5',
    title: 'Dars 1. Predmetlarni sanash va 1–5 sonlar',
    desc: 'Predmetlarni birma-bir sanash, kardinallik, raqam ↔ miqdor (1–5).',
    Component: lazy(() => import('../components/grade1/Dars01.jsx')),
  },
]
