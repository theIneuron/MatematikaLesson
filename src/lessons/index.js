import { grade1 } from './grade1.js'
import { grade5 } from './grade5.js'

// Fanlar ro'yxati. Yangi fan qo'shish: shu yerga obyekt qo'shing.
// `id` URL bo'lagi bo'ladi (/<sinf>/<fan>/<slug>), `accent` qobiq rangi.
export const SUBJECTS = [
  { id: 'matematika', label: 'Matematika', accent: '#ff4f28' },
  { id: 'fizika', label: 'Fizika', accent: '#2f72ff' },
]

// Sinf + fan -> darslar registri. Darslar bo'lgan kombinatsiyalarni shu yerga
// yozamiz; qolganlari avtomatik "tez orada" bo'lib qoladi.
// Yangi sinf darsligi: lessons/gradeN.js yarating, import qiling, shu yerga ulang.
const REGISTRY = {
  '1-sinf': { matematika: grade1 },
  '5-sinf': { matematika: grade5 },
}

// 1..11 sinflar. Har sinfda barcha fanlar bor; darslari bo'lmagani "tez orada".
export const grades = Array.from({ length: 11 }, (_, i) => {
  const id = `${i + 1}-sinf`
  const reg = REGISTRY[id] || {}
  return {
    id,
    label: id,
    subjects: SUBJECTS.map((s) => ({
      ...s,
      lessons: reg[s.id] || [],
    })),
  }
})

// Routing uchun: sinf + fan + slug bo'yicha darsni topish.
export function findLesson(gradeId, subjectId, slug) {
  const grade = grades.find((g) => g.id === gradeId)
  const subject = grade && grade.subjects.find((s) => s.id === subjectId)
  return (subject && subject.lessons.find((l) => l.slug === slug)) || null
}
