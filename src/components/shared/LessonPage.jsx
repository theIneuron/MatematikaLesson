import { Suspense } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './LessonPage.css'

function LessonPage({ lesson, gradeId, subjectId, sectionId }) {
  const { Component } = lesson
  const [searchParams, setSearchParams] = useSearchParams()
  const supportsThreeLanguages = gradeId === '7-sinf' || gradeId === '8-sinf'
  const requestedLang = searchParams.get('lang')
  const previewLang = ['uz', 'ru', 'en'].includes(requestedLang) ? requestedLang : 'uz'
  const previewProps = supportsThreeLanguages
    ? {
        studentName: searchParams.get('student') || 'Aziza',
        lang: previewLang,
        onFinished: (payload) => console.log('[Lesson preview] onFinished', payload),
      }
    : {}

  // Darsdan chiqqanda aynan shu bo'lim (sinf+fan+bo'lim) darslar ro'yxatiga qaytamiz,
  // eng yuqoridagi "Fanni tanlang" ga emas.
  const backTo =
    gradeId && subjectId && sectionId
      ? `/?subject=${subjectId}&grade=${gradeId}&section=${sectionId}`
      : '/'

  return (
    <div className="lesson-page">
      <Link to={backTo} className="lesson-back">← Darslar ro'yxati</Link>
      {supportsThreeLanguages && (
        <div className="lesson-language" aria-label="Preview language">
          {['uz', 'ru', 'en'].map((code) => (
            <button
              type="button"
              key={code}
              className={previewLang === code ? 'is-active' : ''}
              onClick={() => {
                const next = new URLSearchParams(searchParams)
                next.set('lang', code)
                setSearchParams(next, { replace: true })
              }}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <div className="lesson-frame">
        <Suspense fallback={<div className="lesson-loading">Yuklanmoqda…</div>}>
          <Component {...previewProps} />
        </Suspense>
      </div>
    </div>
  )
}

export default LessonPage
