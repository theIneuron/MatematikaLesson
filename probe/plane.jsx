// TEKIS CHIZMA STENDI (11-sinf, B7 bloki, 51, 54, 55-darslar).
//   npx vite --port 5297 --strictPort
//   http://localhost:5297/probe/plane.html
//
// NEGA STEND. Tekis chizmada aylananing aylana bo'lib qolishi, to'g'ri
// burchakning to'g'ri ko'rinishi va yozuvlarning chiziq ustiga tushmasligi
// -- faqat ko'z bilan tekshiriladigan narsalar. B5 blokida stend
// proyeksiyada yig'ilgan diagonalni ushlagan, B6 da esa chizmadan chiqib
// ketgan yozuvni.
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { STYLES } from '../src/components/grade11/core.jsx'
import { PlaneBoard } from '../src/components/grade11/tools.jsx'

const Card = ({ w = 330, title, children }) => (
  <div style={{ width: w }}>
    <div style={{ font: '11px monospace', color: '#687078', marginBottom: 2 }}>{title}</div>
    {children}
  </div>
)

function App() {
  const [s, setS] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setS((x) => (x + 1) % 4), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="lesson-root" style={{ padding: 10 }}>
      <style>{STYLES}</style>
      <div id="stepnow" style={{ font: '12px monospace', marginBottom: 8 }}>{'step ' + s}</div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* 51-dars: to'g'ri burchakli uchburchak, katetlar 3 va 4, gipotenuza 5. */}
        <Card title="51 to'g'ri burchakli: 3, 4, 5">
          <PlaneBoard
            pts={[
              { id: 'C', at: [0, 0], label: 'C', dy: 16 },
              { id: 'A', at: [4, 0], label: 'A', dx: 10, dy: 16 },
              { id: 'B', at: [0, 3], label: 'B', dy: -12 },
            ]}
            segs={[
              { from: 'C', to: 'A', label: '4' },
              { from: 'C', to: 'B', label: '3' },
              { from: 'A', to: 'B', label: '5', tone: 'accent' },
            ]}
            angles={[{ at: 'C', from: 'A', to: 'B', right: true }]}
            height={190}
          />
        </Card>

        {/* Balandlik: uchburchak va uning balandligi punktir bilan. */}
        <Card title="51 balandlik va yuza">
          <PlaneBoard
            pts={[
              { id: 'A', at: [0, 0], label: 'A', dy: 16 },
              { id: 'B', at: [6, 0], label: 'B', dy: 16 },
              { id: 'C', at: [4, 4], label: 'C', dy: -12 },
              { id: 'H', at: [4, 0], label: 'H', dy: 16, tone: 'accent' },
            ]}
            segs={[
              { from: 'A', to: 'B', label: 'a = 6' },
              { from: 'B', to: 'C' },
              { from: 'C', to: 'A' },
              { from: 'C', to: 'H', dash: '5 4', tone: 'accent', label: 'h = 4' },
            ]}
            angles={[{ at: 'H', from: 'B', to: 'C', right: true }]}
            fills={[{ ids: ['A', 'B', 'C'] }]}
            answer="12" answerLabel="S"
            height={190}
          />
        </Card>

        {/* Aylana: ichki burchak va markaziy burchak. */}
        <Card title="51 aylana: ichki burchak">
          <PlaneBoard
            circles={[{ at: [0, 0], r: 3 }]}
            pts={[
              { id: 'O', at: [0, 0], label: 'O', dy: 15 },
              { id: 'A', at: [-3, 0], label: 'A', dx: -12 },
              { id: 'B', at: [3, 0], label: 'B', dx: 12 },
              { id: 'C', at: [0.9, 2.86], label: 'C', dy: -12 },
            ]}
            segs={[
              { from: 'A', to: 'B', dash: '5 4', tone: 'dim' },
              { from: 'A', to: 'C' },
              { from: 'C', to: 'B' },
            ]}
            angles={[{ at: 'C', from: 'A', to: 'B', right: true, tone: 'accent' }]}
            height={190}
          />
        </Card>

        {/* Urinma: radius urinma nuqtasida perpendikular. */}
        <Card title="51 urinma va radius">
          <PlaneBoard
            circles={[{ at: [0, 0], r: 2.4 }]}
            pts={[
              { id: 'O', at: [0, 0], label: 'O', dy: 15 },
              { id: 'K', at: [2.4, 0], label: 'K', dy: 16 },
              { id: 'M', at: [2.4, 3], label: 'M', dy: -12 },
              { id: 'N', at: [2.4, -3], label: 'N', dy: 18 },
            ]}
            segs={[
              { from: 'O', to: 'K', label: 'r' },
              { from: 'M', to: 'N', tone: 'accent' },
            ]}
            angles={[{ at: 'K', from: 'O', to: 'M', right: true }]}
            height={190}
          />
        </Card>

        {/* O'xshashlik: ikki uchburchak, tenglik belgilari bilan. */}
        <Card title="51 o'xshashlik: k = 2">
          <PlaneBoard
            pts={[
              { id: 'A', at: [0, 0], label: 'A', dy: 16 },
              { id: 'B', at: [3, 0], label: 'B', dy: 16 },
              { id: 'C', at: [1, 2], label: 'C', dy: -12 },
              { id: 'D', at: [5, 0], label: 'D', dy: 16 },
              { id: 'E', at: [11, 0], label: 'E', dy: 16 },
              { id: 'F', at: [7, 4], label: 'F', dy: -12 },
            ]}
            segs={[
              { from: 'A', to: 'B', label: '3' },
              { from: 'B', to: 'C' },
              { from: 'C', to: 'A' },
              { from: 'D', to: 'E', label: '6', tone: 'accent' },
              { from: 'E', to: 'F', tone: 'accent' },
              { from: 'F', to: 'D', tone: 'accent' },
            ]}
            angles={[
              { at: 'A', from: 'B', to: 'C', label: 'α' },
              { at: 'D', from: 'E', to: 'F', label: 'α', tone: 'graph' },
            ]}
            height={190}
          />
        </Card>

        {/* Ochilish: element `showAt` bilan kadr bo'yicha chiqadi. */}
        <Card title="51 ochilish: showAt (step)">
          <PlaneBoard
            phase={s}
            pts={[
              { id: 'A', at: [0, 0], label: 'A', dy: 16 },
              { id: 'B', at: [5, 0], label: 'B', dy: 16 },
              { id: 'C', at: [2, 3.5], label: 'C', dy: -12, showAt: 1 },
              { id: 'M', at: [2.5, 0], label: 'M', dy: 16, tone: 'accent', showAt: 3 },
            ]}
            segs={[
              { from: 'A', to: 'B' },
              { from: 'B', to: 'C', showAt: 1 },
              { from: 'C', to: 'A', showAt: 1 },
              { from: 'C', to: 'M', dash: '5 4', tone: 'accent', showAt: 3, label: 'mediana' },
            ]}
            angles={[{ at: 'A', from: 'B', to: 'C', label: '60°', showAt: 2 }]}
            height={190}
          />
        </Card>

        {/* O'RTA CHIZIQ: tenglik belgilari ishlaydimi. */}
        <Card title="51 o'rta chiziq, tenglik belgilari">
          <PlaneBoard
            pts={[
              { id: 'A', at: [0, 0], label: 'A', dy: 16 },
              { id: 'B', at: [6, 0], label: 'B', dy: 16 },
              { id: 'C', at: [2, 4], label: 'C', dy: -12 },
              { id: 'M', at: [1, 2], label: 'M', dx: -13 },
              { id: 'N', at: [4, 2], label: 'N', dx: 13 },
            ]}
            segs={[
              { from: 'A', to: 'B', label: '6' },
              { from: 'A', to: 'C' },
              { from: 'C', to: 'B' },
              { from: 'M', to: 'N', tone: 'accent', label: '3' },
              { from: 'A', to: 'M', ticks: 1 },
              { from: 'M', to: 'C', ticks: 1 },
              { from: 'C', to: 'N', ticks: 2 },
              { from: 'N', to: 'B', ticks: 2 },
            ]}
            height={190}
          />
        </Card>

        {/* TELEFON: 393 px ekranda asbob ~212 px joy oladi. */}
        <Card w={212} title="telefon 212: uchburchak">
          <PlaneBoard
            pts={[
              { id: 'C', at: [0, 0], label: 'C', dy: 16 },
              { id: 'A', at: [4, 0], label: 'A', dy: 16 },
              { id: 'B', at: [0, 3], label: 'B', dy: -12 },
            ]}
            segs={[
              { from: 'C', to: 'A', label: '4' },
              { from: 'C', to: 'B', label: '3' },
              { from: 'A', to: 'B', label: '5', tone: 'accent' },
            ]}
            angles={[{ at: 'C', from: 'A', to: 'B', right: true }]}
            height={178}
          />
        </Card>
        <Card w={212} title="telefon 212: aylana">
          <PlaneBoard
            circles={[{ at: [0, 0], r: 3 }]}
            pts={[
              { id: 'O', at: [0, 0], label: 'O', dy: 15 },
              { id: 'A', at: [-3, 0], label: 'A', dx: -12 },
              { id: 'B', at: [3, 0], label: 'B', dx: 12 },
              { id: 'C', at: [0.9, 2.86], label: 'C', dy: -12 },
            ]}
            segs={[
              { from: 'A', to: 'B', dash: '5 4', tone: 'dim' },
              { from: 'A', to: 'C' },
              { from: 'C', to: 'B' },
            ]}
            angles={[{ at: 'C', from: 'A', to: 'B', right: true, tone: 'accent' }]}
            height={178}
          />
        </Card>
      </div>
    </div>
  )
}

createRoot(document.getElementById('r')).render(<App />)
