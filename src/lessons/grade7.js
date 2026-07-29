import { lazy } from 'react'

// 7-sinf NAZARIY darslari. Barcha yangi komponentlar components/grade7/ ichida yaratiladi.
// Reja: src/books/grade7/DARSLAR_REJASI_7SINF.md.
export const grade7Nazariy = [
  {
    slug: 'dars01-sonli-ifodalar',
    title: 'Dars 1. Sonli ifodalar',
    desc: 'Lumo Nexus hisoblash protokoli: 16 ta interaktiv ekran, UZ/RU/EN va moslashuvchan desktop/mobile interfeys.',
    Component: lazy(() => import('../components/grade7/Dars01.jsx')),
  },
]
