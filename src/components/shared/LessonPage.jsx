import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import './LessonPage.css'

function LessonPage({ lesson, gradeId, subjectId, sectionId }) {
  const { Component } = lesson

  // Darsdan chiqqanda aynan shu bo'lim (sinf+fan+bo'lim) darslar ro'yxatiga qaytamiz,
  // eng yuqoridagi "Fanni tanlang" ga emas.
  const backTo =
    gradeId && subjectId && sectionId
      ? `/?subject=${subjectId}&grade=${gradeId}&section=${sectionId}`
      : '/'

  return (
    <div className="lesson-page">
      <Link to={backTo} className="lesson-back">← Darslar ro'yxati</Link>
      <div className="lesson-frame">
        <Suspense fallback={<div className="lesson-loading">Yuklanmoqda…</div>}>
          <Component />
        </Suspense>
      </div>
    </div>
  )
}

export default LessonPage
