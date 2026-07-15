import { grade1Nazariy, grade1Amaliy, grade1Nazorat } from './grade1.js'
import { grade2Nazariy, grade2Amaliy } from './grade2.js'
import { grade5Nazariy, grade5Amaliy } from './grade5.js'

// Fanlar ro'yxati. Yangi fan qo'shish: shu yerga obyekt qo'shing.
// `id` URL bo'lagi bo'ladi (/<sinf>/<fan>/<bo'lim>/<slug>), `accent` qobiq rangi.
export const SUBJECTS = [
  { id: 'matematika', label: 'Matematika', accent: '#ff4f28' },
  { id: 'fizika', label: 'Fizika', accent: '#2f72ff' },
]

// Har fan ichidagi bo'limlar (papkalar). `id` URL bo'lagi bo'ladi.
export const SECTIONS = [
  { id: 'nazariy', label: "Nazariy mashg'ulotlar", icon: '📘' },
  { id: 'amaliy', label: "Amaliy mashg'ulotlar", icon: '✏️' },
  { id: 'nazorat', label: 'Nazorat (ПК va ИК)', icon: '🎯' },
]

// Sinf + fan -> bo'lim -> darslar registri. Darslar bo'lgan kombinatsiyalarni
// shu yerga yozamiz; qolganlari avtomatik "tez orada" bo'lib qoladi.
// Yangi sinf: lessons/gradeN.js yarating, import qiling, shu yerga bo'lim(lar) bilan ulang.
const REGISTRY = {
  '1-sinf': { matematika: { nazariy: grade1Nazariy, amaliy: grade1Amaliy, nazorat: grade1Nazorat } },
  '2-sinf': { matematika: { nazariy: grade2Nazariy, amaliy: grade2Amaliy } },
  '5-sinf': { matematika: { nazariy: grade5Nazariy, amaliy: grade5Amaliy } },
}

// 1..11 sinflar. Har sinfda barcha fanlar, har fanda barcha bo'limlar bor;
// darslari bo'lmagani "tez orada".
export const grades = Array.from({ length: 11 }, (_, i) => {
  const id = `${i + 1}-sinf`
  const reg = REGISTRY[id] || {}
  return {
    id,
    label: id,
    subjects: SUBJECTS.map((s) => {
      const secReg = reg[s.id] || {}
      const sections = SECTIONS.map((sec) => ({
        ...sec,
        lessons: secReg[sec.id] || [],
      }))
      const lessonCount = sections.reduce((n, sec) => n + sec.lessons.length, 0)
      return { ...s, sections, lessonCount }
    }),
  }
})

// Routing uchun: sinf + fan + bo'lim + slug bo'yicha darsni topish.
export function findLesson(gradeId, subjectId, sectionId, slug) {
  const grade = grades.find((g) => g.id === gradeId)
  const subject = grade && grade.subjects.find((s) => s.id === subjectId)
  const section = subject && subject.sections.find((sec) => sec.id === sectionId)
  return (section && section.lessons.find((l) => l.slug === slug)) || null
}

// Orqaga moslik uchun: bo'limsiz slug qaysi bo'limda ekanini topib beradi.
export function findLessonAnySection(gradeId, subjectId, slug) {
  const grade = grades.find((g) => g.id === gradeId)
  const subject = grade && grade.subjects.find((s) => s.id === subjectId)
  if (!subject) return null
  for (const sec of subject.sections) {
    const lesson = sec.lessons.find((l) => l.slug === slug)
    if (lesson) return { sectionId: sec.id, lesson }
  }
  return null
}
