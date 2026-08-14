// FIGURA STENDI. Yangi figura darsga ulashdan OLDIN shu yerda ko'riladi.
//   npx vite --port 5299 --strictPort
//   http://localhost:5299/probe/figures.html
// O'lchamlar 300 va 212: 212 -- haqiqiy telefondagi chizma o'lchami.
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { STYLES } from '../src/components/grade10/core.jsx'
import { LevelLine, Plane, SeriesTicks, WindowArc } from '../src/components/grade10/figures.jsx'

function App() {
  const [s, setS] = useState(0)
  useEffect(() => { const t = setInterval(() => setS((x) => (x + 1) % 3), 3600); return () => clearInterval(t) }, [])
  return (
    <div className="lesson-root" style={{ padding: 10 }}>
      <style>{STYLES}</style>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <LevelLine size={300} step={s} a={0.5} arcs />
        <LevelLine size={212} step={s} a={0.5} arcs />
        <LevelLine size={212} step={s} a={2} />
        <LevelLine size={212} step={s} a={0.5} axis="x" />
        <WindowArc size={300} step={s} a={0.5} from={-90} to={90} />
        <WindowArc size={212} step={s} a={0.5} from={-90} to={90} />
        <WindowArc size={300} step={s} a={0.5} from={0} to={180} axis="x" />
        <SeriesTicks size={300} step={s} deg={30} turns={2} />
        <SeriesTicks size={300} step={s} deg={30} turns={3} alt />
        <SeriesTicks size={212} step={s} deg={30} turns={3} alt />
        <SeriesTicks size={212} step={s} deg={30} turns={2} />
        <Plane size={300} step={s} curve="sin" show="point" />
        <Plane size={212} step={s} curve="sin" show="point" />
        <Plane size={300} step={s} curve="circle" show="vline" />
        <Plane size={300} step={s} curve="sin" show="dom" />
        <Plane size={212} step={s} curve="sin" show="rng" />
        <Plane size={300} step={s} curve="line" show="vline" at={1.1} />
      </div>
      <div id="stepnow" style={{ fontFamily: 'monospace', marginTop: 6 }}>{'step ' + s}</div>
    </div>
  )
}
createRoot(document.getElementById('r')).render(<App />)
