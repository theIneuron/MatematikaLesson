import { grade1 } from './grade1.js'
import { grade5 } from './grade5.js'

// Sinflar registri. Yangi sinf qo'shish: lessons/gradeN.js yarating,
// shu yerda import qilib, quyidagi massivga bitta obyekt qo'shing.
// `id` URL prefiksi bo'ladi (/<id>/<slug>), `label` Home'da ko'rinadi.
export const grades = [
  { id: '1-sinf', label: '1-sinf', lessons: grade1 },
  { id: '5-sinf', label: '5-sinf', lessons: grade5 },
]

// Faqat darslari bor sinflar (bo'shlari Home'da ko'rsatilmaydi, lekin
// kelajakda "Tez orada" sifatida ko'rsatish uchun grades to'liq qoladi).
export const activeGrades = grades.filter((g) => g.lessons.length > 0)
