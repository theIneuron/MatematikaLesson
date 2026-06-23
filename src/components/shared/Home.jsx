import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

function Home({ grades }) {
  // Standart: darslari bor birinchi sinf ochiq turadi.
  const firstActive = grades.find((g) => g.lessons.length > 0) || grades[0]
  const [activeId, setActiveId] = useState(firstActive ? firstActive.id : null)
  const active = grades.find((g) => g.id === activeId) || firstActive
  const lessons = active ? active.lessons : []

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">Matematika</h1>
        <p className="home__subtitle">Interaktiv darsliklar</p>
      </header>

      <nav className="home__grades">
        {grades.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`grade-tab${g.id === activeId ? ' grade-tab--active' : ''}`}
            onClick={() => setActiveId(g.id)}
          >
            {g.label}
            <span className="grade-tab__count">
              {g.lessons.length > 0 ? g.lessons.length : 'tez orada'}
            </span>
          </button>
        ))}
      </nav>

      {lessons.length > 0 ? (
        <main className="home__grid">
          {lessons.map((lesson, i) => (
            <Link
              key={lesson.slug}
              to={`/${active.id}/${lesson.slug}`}
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
        <main className="home__empty">Bu sinf darslari tez orada qo'shiladi.</main>
      )}

      <footer className="home__footer">
        {active ? `${active.label} · ${lessons.length} ta darslik` : ''}
      </footer>
    </div>
  )
}

export default Home
