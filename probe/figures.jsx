// FIGURA STENDI. Yangi figura darsga ulashdan OLDIN shu yerda ko'riladi.
//   npx vite --port 5299 --strictPort
//   http://localhost:5299/probe/figures.html
// O'lchamlar 360 va 212: 212 -- haqiqiy telefondagi chizma o'lchami.
//
// STENDDA AYNAN ISHLANAYOTGAN FIGURALAR TURADI. O'n ikkitasi birga turganda
// suratda detal ko'rinmaydi -- yorliqlar to'qnashdimi, egri chiziq kadrdan
// chiqdimi, bilib bo'lmaydi, va tekshiruvning ma'nosi yo'qoladi. Eskilarini
// tekshirish kerak bo'lsa, ular vaqtincha qaytariladi.
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { STYLES } from '../src/components/grade10/core.jsx'
import { DomainBand, LevelLine, Plane } from '../src/components/grade10/figures.jsx'

function App() {
  const [s, setS] = useState(0)
  useEffect(() => { const t = setInterval(() => setS((x) => (x + 1) % 3), 3600); return () => clearInterval(t) }, [])
  return (
    <div className="lesson-root" style={{ padding: 10 }}>
      <style>{STYLES}</style>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* 33-dars: yechim uchastkasi -- yuza va uning o'qdagi izi. */}
        <Plane size={360} step={s} curve="exp" show="none" level={8} region="below" />
        <Plane size={212} step={s} curve="exp" show="none" level={8} region="below" />
        <Plane size={360} step={s} curve="expdown" show="none" level={4} region="below" xmin={-2.6} xmax={3.15} ymax={9} tx={[-2, -1, 1, 2, 3]} ty={[1, 2, 4, 8]} />
        {/* 34-dars: yechim YOYI. */}
        <LevelLine size={360} step={s} a={0.5} arcs arcSide="up" />
        <LevelLine size={212} step={s} a={0.5} arcs arcSide="up" />
        <LevelLine size={360} step={s} a={0.5} arcs arcSide="down" />
        {/* 33-dars: ISHORALAR LENTASI. Nollar o'qni kesadi, ishoralar bittalab
            chiqadi, javob esa oxirida bo'yaladi. */}
        <DomainBand
          size={360} step={s >= 1 ? 1 : 0} lo={-5} hi={5} ticks={[-4, -2, 0, 2, 4]}
          zeros={[{ v: -1, kind: 'num' }, { v: 2, kind: 'den' }]}
          signs={[{ from: -5, to: -1, sign: '+' }, { from: -1, to: 2, sign: '−' }, { from: 2, to: 5, sign: '+' }]}
          pick={s >= 1 ? 3 : 0}
          sol={s >= 2 ? [{ from: -5, to: -1, openR: false }, { from: 2, to: 5, openL: true }] : []}
        />
        <DomainBand
          size={212} step={s >= 1 ? 1 : 0} lo={-5} hi={5} ticks={[-4, -2, 0, 2, 4]}
          zeros={[{ v: -1, kind: 'num' }, { v: 2, kind: 'den' }]}
          signs={[{ from: -5, to: -1, sign: '+' }, { from: -1, to: 2, sign: '−' }, { from: 2, to: 5, sign: '+' }]}
          pick={s >= 1 ? 3 : 0}
          sol={s >= 2 ? [{ from: -5, to: -1, openR: false }, { from: 2, to: 5, openL: true }] : []}
        />
      </div>
      <div id="stepnow" style={{ fontFamily: 'monospace', marginTop: 6 }}>{'step ' + s}</div>
    </div>
  )
}
createRoot(document.getElementById('r')).render(<App />)
