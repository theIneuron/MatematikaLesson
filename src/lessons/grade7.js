import { lazy } from 'react'

// 7-sinf NAZARIY darslari. Barcha yangi komponentlar components/grade7/ ichida yaratiladi.
// Reja: src/books/grade7/DARSLAR_REJASI_7SINF.md.
export const grade7Nazariy = [
  {
    slug: 'dars01-sonli-ifodalar',
    title: 'Dars 1. Sonli ifodalar',
    desc: 'Yangi animatsion konsepsiyaning 3 ekranli prototipi.',
    Component: lazy(() => import('../components/grade7/Dars01.jsx')),
  },
]
