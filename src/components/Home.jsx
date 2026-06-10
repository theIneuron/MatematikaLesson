import { Link } from 'react-router-dom'
import './Home.css'

function Home({ lessons }) {
  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">Matematika</h1>
        <p className="home__subtitle">5-sinf · Interaktiv darsliklar</p>
      </header>

      <main className="home__grid">
        {lessons.map((lesson, i) => (
          <Link key={lesson.slug} to={`/dars/${lesson.slug}`} className="lesson-card">
            <span className="lesson-card__num">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="lesson-card__title">{lesson.title}</h2>
            <p className="lesson-card__desc">{lesson.desc}</p>
            <span className="lesson-card__cta">Boshlash →</span>
          </Link>
        ))}
      </main>

      <footer className="home__footer">
        Jami {lessons.length} ta darslik
      </footer>
    </div>
  )
}

export default Home
