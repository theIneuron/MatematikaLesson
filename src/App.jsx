import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import Home from './components/shared/Home.jsx'
import LessonPage from './components/shared/LessonPage.jsx'
import { grades } from './lessons/index.js'
import './App.css'

// Eski /dars/<slug> havolalarini 5-sinfga yo'naltirish (orqaga moslik).
function LegacyRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/5-sinf/${slug}`} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home grades={grades} />} />
      {grades.flatMap((grade) =>
        grade.lessons.map((lesson) => (
          <Route
            key={`${grade.id}/${lesson.slug}`}
            path={`/${grade.id}/${lesson.slug}`}
            element={<LessonPage lesson={lesson} />}
          />
        )),
      )}
      <Route path="/dars/:slug" element={<LegacyRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
