import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const gradeLessonCount = (g) =>
  g.subjects.reduce((sum, s) => sum + s.lessons.length, 0)

function Home({ grades }) {
  // Darslari bor birinchi sinf ochiq turadi.
  const firstGrade = grades.find((g) => gradeLessonCount(g) > 0) || grades[0]
  const [activeGradeId, setActiveGradeId] = useState(firstGrade.id)
  const activeGrade = grades.find((g) => g.id === activeGradeId) || firstGrade

  // Tanlangan sinfdagi darslari bor birinchi fan ochiq turadi.
  const firstSubject =
    activeGrade.subjects.find((s) => s.lessons.length > 0) ||
    activeGrade.subjects[0]
  const [activeSubjectId, setActiveSubjectId] = useState(firstSubject.id)
  const activeSubject =
    activeGrade.subjects.find((s) => s.id === activeSubjectId) || firstSubject
  const lessons = activeSubject ? activeSubject.lessons : []
  const accent = activeSubject ? activeSubject.accent : '#ff4f28'

  // Sinf almashganda: agar tanlangan fan bu sinfda bo'sh bo'lsa, darslari bor
  // fanga avtomatik o'tamiz (bo'sh ekranda qolib ketmaslik uchun).
  const selectGrade = (id) => {
    setActiveGradeId(id)
    const g = grades.find((x) => x.id === id)
    const keep = g.subjects.find(
      (s) => s.id === activeSubjectId && s.lessons.length > 0,
    )
    if (!keep) {
      const fallback = g.subjects.find((s) => s.lessons.length > 0) || g.subjects[0]
      setActiveSubjectId(fallback.id)
    }
  }

  return (
    <div className="home" style={{ '--accent': accent }}>
      <header className="home__header">
        <h1 className="home__brand">by.sultoniii</h1>
        <p className="home__subtitle">Interaktiv darsliklar — Matematika va Fizika</p>
      </header>

      <nav className="home__grades" aria-label="Sinflar">
        {grades.map((g) => {
          const count = gradeLessonCount(g)
          return (
            <button
              key={g.id}
              type="button"
              className={`grade-tab${g.id === activeGradeId ? ' grade-tab--active' : ''}`}
              onClick={() => selectGrade(g.id)}
            >
              {g.label}
              <span className="grade-tab__count">{count > 0 ? count : '—'}</span>
            </button>
          )
        })}
      </nav>

      <nav className="home__subjects" aria-label="Fanlar">
        {activeGrade.subjects.map((s) => {
          const isActive = s.id === activeSubjectId
          return (
            <button
              key={s.id}
              type="button"
              className={`subject-tab${isActive ? ' subject-tab--active' : ''}`}
              style={{ '--accent': s.accent }}
              onClick={() => setActiveSubjectId(s.id)}
            >
              {s.label}
              <span className="subject-tab__count">
                {s.lessons.length > 0 ? `${s.lessons.length} ta` : 'tez orada'}
              </span>
            </button>
          )
        })}
      </nav>

      {lessons.length > 0 ? (
        <main className="home__grid">
          {lessons.map((lesson, i) => (
            <Link
              key={lesson.slug}
              to={`/${activeGrade.id}/${activeSubject.id}/${lesson.slug}`}
              className="lesson-card"
            >
              <span className="lesson-card__num">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="lesson-card__title">{lesson.title}</h2>
              <p className="lesson-card__desc">{lesson.desc}</p>
              <span className="lesson-card__cta">Boshlash →</span>
            </Link>
          ))}
        </main>
      ) : (
        <main className="home__empty">
          {activeGrade.label} · {activeSubject ? activeSubject.label : ''} darslari tez orada qo'shiladi.
        </main>
      )}

      <footer className="home__footer">
        {activeGrade.label} · {activeSubject ? activeSubject.label : ''} ·{' '}
        {lessons.length} ta darslik
      </footer>
    </div>
  )
}

export default Home
