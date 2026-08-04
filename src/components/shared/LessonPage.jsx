import { Suspense, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './LessonPage.css'

function LessonPage({ lesson, gradeId, subjectId, sectionId }) {
  const { Component } = lesson
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const supportsThreeLanguages = gradeId === '7-sinf' || gradeId === '8-sinf'
  const isGrade3 = gradeId === '3-sinf'
  const requestedLang = searchParams.get('lang')
  const previewLang = ['uz', 'ru', 'en'].includes(requestedLang) ? requestedLang : 'uz'

  // Darsdan chiqqanda aynan shu bo'lim (sinf+fan+bo'lim) darslar ro'yxatiga qaytamiz,
  // eng yuqoridagi "Fanni tanlang" ga emas.
  const backTo =
    gradeId && subjectId && sectionId
      ? `/?subject=${subjectId}&grade=${gradeId}&section=${sectionId}`
      : '/'

  const previewProps = supportsThreeLanguages
    ? {
        studentName: searchParams.get('student') || 'Aziza',
        lang: previewLang,
        onFinished: (payload) => console.log('[Lesson preview] onFinished', payload),
      }
    : isGrade3
      ? { onFinished: () => navigate(backTo) }
      : {}

  useEffect(() => {
    if (!isGrade3) return undefined
    const closeLesson = () => navigate(backTo)
    window.addEventListener('grade3:lesson-finished', closeLesson)
    window.addEventListener('grade3:practice-finished', closeLesson)
    return () => {
      window.removeEventListener('grade3:lesson-finished', closeLesson)
      window.removeEventListener('grade3:practice-finished', closeLesson)
    }
  }, [backTo, isGrade3, navigate])

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
