import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import Home from './components/shared/Home.jsx'
import LessonPage from './components/shared/LessonPage.jsx'
import { grades, findLesson } from './lessons/index.js'
import './App.css'

// Yangi havola: /<sinf>/<fan>/<slug>. Darsni registrdan topib ko'rsatadi.
function LessonRoute() {
  const { gradeId, subjectId, slug } = useParams()
  const lesson = findLesson(gradeId, subjectId, slug)
  if (!lesson) return <Navigate to="/" replace />
  return <LessonPage lesson={lesson} gradeId={gradeId} subjectId={subjectId} />
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
      <Route path="/:gradeId/:subjectId/:slug" element={<LessonRoute />} />
      <Route path="/dars/:slug" element={<LegacyDarsRedirect />} />
      <Route path="/:gradeId/:slug" element={<LegacyGradeRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
