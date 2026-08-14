// ФИГУРА СТЕНДИ. Yangi figura darsga ulashdan OLDIN shu yerda ko'riladi.
//   npx vite --port 5299 --strictPort
//   http://localhost:5299/probe/figures.html
// O'lchamlar 330 va 212: 212 -- haqiqiy telefondagi chizma o'lchami.
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { STYLES } from '../src/components/grade10/core.jsx'
import { QuadNames, SignScales } from '../src/components/grade10/figures.jsx'

function App() {
  const [s, setS] = useState(0)
  useEffect(() => { const t = setInterval(() => setS((x) => (x + 1) % 3), 3400); return () => clearInterval(t) }, [])
  return (
    <div className="lesson-root" style={{ padding: 10 }}>
      <style>{STYLES}</style>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <SignScales size={300} step={s} />
        <SignScales size={300} step={s} angles={[40, 220, 130]} tan />
        <QuadNames size={300} step={s} deg={s >= 2 ? 210 : null} />
        <SignScales size={212} step={s} angles={[40, 220, 130]} tan />
      </div>
      <div id="stepnow" style={{ fontFamily: 'monospace', marginTop: 6 }}>{'step ' + s}</div>
    </div>
  )
}
createRoot(document.getElementById('r')).render(<App />)
