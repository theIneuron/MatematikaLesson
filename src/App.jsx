import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import Home from './components/shared/Home.jsx'
import LessonPage from './components/shared/LessonPage.jsx'
import Trenajyor from './components/trenajyor/Trenajyor.jsx'
import Lesson3D from './lab/dars01_3d/app.jsx'
import ManimPage from './lab/manim_dars01/ManimPage.jsx'
import Grade3ManimLesson from './lab/grade3_dars01_manim/Dars01.jsx'
import { grades, findLesson, findLessonAnySection } from './lessons/index.js'
import './App.css'

// Yangi havola: /<sinf>/<fan>/<bo'lim>/<slug>. Darsni registrdan topib ko'rsatadi.
function LessonRoute() {
  const { gradeId, subjectId, sectionId, slug } = useParams()
  const lesson = findLesson(gradeId, subjectId, sectionId, slug)
  if (!lesson) return <Navigate to="/" replace />
  return (
    <LessonPage
      lesson={lesson}
      gradeId={gradeId}
      subjectId={subjectId}
      sectionId={sectionId}
    />
  )
}

// Orqaga moslik: bo'limsiz /<sinf>/<fan>/<slug> -> dars qaysi bo'limda bo'lsa o'shanga.
function LegacySectionlessRedirect() {
  const { gradeId, subjectId, slug } = useParams()
  const hit = findLessonAnySection(gradeId, subjectId, slug)
  if (!hit) return <Navigate to="/" replace />
  return <Navigate to={`/${gradeId}/${subjectId}/${hit.sectionId}/${slug}`} replace />
}

// Orqaga moslik: eski 2-bo'lakli /<sinf>/<slug> -> matematikaga yo'naltiriladi.
function LegacyGradeRedirect() {
  const { gradeId, slug } = useParams()
  return <Navigate to={`/${gradeId}/matematika/${slug}`} replace />
}

// Juda eski /dars/<slug> havolalar -> 5-sinf matematikaga.
function LegacyDarsRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/5-sinf/matematika/${slug}`} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home grades={grades} />} />
      <Route path="/trenajyor" element={<Trenajyor lang="uz" />} />
      {/* LAB (tajriba): Grade2 Dars01 3D-prototip — izolyatsiya, etalonga tegmaydi */}
      <Route path="/lab/dars01-3d" element={<Lesson3D />} />
      {/* LAB: Grade2 Dars01 Manim tushuntirish-klipi (video) */}
      <Route path="/lab/dars01-manim" element={<ManimPage />} />
      {/* LAB: Grade3 Dars01 DUBLIKAT + Manim video-recap QOIDA'dan keyin (integratsiya) */}
      <Route path="/lab/grade3-dars01-manim" element={<Grade3ManimLesson />} />
      <Route path="/:gradeId/:subjectId/:sectionId/:slug" element={<LessonRoute />} />
      <Route path="/dars/:slug" element={<LegacyDarsRedirect />} />
      <Route path="/:gradeId/:subjectId/:slug" element={<LegacySectionlessRedirect />} />
      <Route path="/:gradeId/:slug" element={<LegacyGradeRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
