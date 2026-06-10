import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import './LessonPage.css'

function LessonPage({ lesson }) {
  const { Component } = lesson

  return (
    <div className="lesson-page">
      <Link to="/" className="lesson-back">← Darsliklar</Link>
      <div className="lesson-frame">
        <Suspense fallback={<div className="lesson-loading">Yuklanmoqda…</div>}>
          <Component />
        </Suspense>
      </div>
    </div>
  )
}

export default LessonPage
