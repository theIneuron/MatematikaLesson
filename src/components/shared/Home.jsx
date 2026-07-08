import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

// Drill-down navigatsiya: Fan -> Sinf -> Bo'lim (nazariy/amaliy) -> Darslar.
function Home({ grades }) {
  const [subjectId, setSubjectId] = useState(null)
  const [gradeId, setGradeId] = useState(null)
  const [sectionId, setSectionId] = useState(null)

  // Fanlar meta (barcha sinflarda bir xil ro'yxat).
  const subjectMeta = grades[0].subjects.map((s) => ({
    id: s.id,
    label: s.label,
    accent: s.accent,
  }))
  const subjectTotal = (sid) =>
    grades.reduce((n, g) => {
      const s = g.subjects.find((x) => x.id === sid)
      return n + (s ? s.lessonCount : 0)
    }, 0)

  const subject = subjectMeta.find((s) => s.id === subjectId) || null
  const grade = grades.find((g) => g.id === gradeId) || null
  const gradeSubject =
    grade && subject ? grade.subjects.find((s) => s.id === subject.id) : null
  const section =
    gradeSubject && sectionId
      ? gradeSubject.sections.find((sec) => sec.id === sectionId)
      : null

  const accent = subject ? subject.accent : '#ff4f28'

  const back = () => {
    if (sectionId) setSectionId(null)
    else if (gradeId) setGradeId(null)
    else if (subjectId) setSubjectId(null)
  }

  // Joriy bosqich sarlavhasi
  let stepTitle = 'Fanni tanlang'
  if (subjectId && !gradeId) stepTitle = 'Sinfni tanlang'
  else if (gradeId && !sectionId) stepTitle = "Bo'limni tanlang"
  else if (sectionId) stepTitle = section ? section.label : 'Darslar'

  // Breadcrumb bo'laklari
  const crumbs = []
  if (subject) crumbs.push({ label: subject.label, onClick: () => { setGradeId(null); setSectionId(null) } })
  if (grade) crumbs.push({ label: grade.label, onClick: () => setSectionId(null) })
  if (section) crumbs.push({ label: section.label, onClick: null })

  return (
    <div className="home" style={{ '--accent': accent }}>
      <header className="home__header">
        <h1 className="home__brand">by.sultoniii</h1>
        <p className="home__subtitle">Interaktiv darsliklar — Matematika va Fizika</p>
      </header>

      {(subjectId || gradeId || sectionId) && (
        <div className="home__bar">
          <button type="button" className="home__back" onClick={back}>
            ← Orqaga
          </button>
          <nav className="home__crumbs" aria-label="Yo'l">
            {crumbs.map((c, i) => (
              <span key={i} className="crumb">
                {c.onClick ? (
                  <button type="button" className="crumb__link" onClick={c.onClick}>
                    {c.label}
                  </button>
                ) : (
                  <span className="crumb__current">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span className="crumb__sep">/</span>}
              </span>
            ))}
          </nav>
        </div>
      )}

      <h2 className="home__step">{stepTitle}</h2>

      {/* 1-bosqich: Fan */}
      {!subjectId && (
        <main className="home__grid">
          {subjectMeta.map((s) => {
            const total = subjectTotal(s.id)
            const disabled = total === 0
            return (
              <button
                key={s.id}
                type="button"
                className={`nav-card${disabled ? ' nav-card--disabled' : ''}`}
                style={{ '--accent': s.accent }}
                disabled={disabled}
                onClick={() => setSubjectId(s.id)}
              >
                <span className="nav-card__icon">{s.id === 'matematika' ? '🔢' : '⚛️'}</span>
                <span className="nav-card__title">{s.label}</span>
                <span className="nav-card__meta">
                  {disabled ? 'tez orada' : `${total} ta dars`}
                </span>
              </button>
            )
          })}
        </main>
      )}

      {/* Alohida bo'lim: Tez hisoblash trenajyori (pilot — 1-sinf) */}
      {!subjectId && (
        <Link to="/trenajyor" className="trz-banner">
          <span className="trz-banner__icon">⚡</span>
          <span className="trz-banner__text">
            <span className="trz-banner__title">Trenajyor — Tez hisoblash</span>
            <span className="trz-banner__meta">1-sinf · 60 soniyada imkon qadar ko'p misol</span>
          </span>
          <span className="trz-banner__cta">Boshlash →</span>
        </Link>
      )}

      {/* 2-bosqich: Sinf */}
      {subjectId && !gradeId && (
        <main className="home__grid home__grid--tight">
          {grades.map((g) => {
            const gs = g.subjects.find((s) => s.id === subjectId)
            const count = gs ? gs.lessonCount : 0
            const disabled = count === 0
            return (
              <button
                key={g.id}
                type="button"
                className={`nav-card nav-card--grade${disabled ? ' nav-card--disabled' : ''}`}
                disabled={disabled}
                onClick={() => setGradeId(g.id)}
              >
                <span className="nav-card__title">{g.label}</span>
                <span className="nav-card__meta">
                  {disabled ? 'tez orada' : `${count} ta dars`}
                </span>
              </button>
            )
          })}
        </main>
      )}

      {/* 3-bosqich: Bo'lim (nazariy / amaliy) */}
      {gradeId && !sectionId && gradeSubject && (
        <main className="home__grid">
          {gradeSubject.sections.map((sec) => {
            const count = sec.lessons.length
            const disabled = count === 0
            return (
              <button
                key={sec.id}
                type="button"
                className={`nav-card${disabled ? ' nav-card--disabled' : ''}`}
                disabled={disabled}
                onClick={() => setSectionId(sec.id)}
              >
                <span className="nav-card__icon">{sec.icon}</span>
                <span className="nav-card__title">{sec.label}</span>
                <span className="nav-card__meta">
                  {disabled ? 'tez orada' : `${count} ta dars`}
                </span>
              </button>
            )
          })}
        </main>
      )}

      {/* 4-bosqich: Darslar */}
      {sectionId && section && (
        section.lessons.length > 0 ? (
          <main className="home__grid">
            {section.lessons.map((lesson, i) => (
              <Link
                key={lesson.slug}
                to={`/${gradeId}/${subjectId}/${sectionId}/${lesson.slug}`}
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
          <main className="home__empty">Bu bo'lim darslari tez orada qo'shiladi.</main>
        )
      )}

      <footer className="home__footer">
        {subject ? subject.label : 'Matematika va Fizika'}
        {grade ? ` · ${grade.label}` : ''}
        {section ? ` · ${section.label} · ${section.lessons.length} ta dars` : ''}
      </footer>
    </div>
  )
}

export default Home
