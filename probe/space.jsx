// FAZOVIY KARKAS STENDI (11-sinf, B5 bloki, 35-41 darslar).
//   npx vite --port 5299 --strictPort
//   http://localhost:5299/probe/space.html
//
// NEGA STEND. Asbob to'g'ri chizayotganini KODGA qarab tasdiqlab
// bo'lmaydi. B4 blokida stend shar-sigarani, o'lchovsiz yoyilmani va
// jism ichidagi yolg'on yoyni ushlagan -- ularning birortasini o'lchov
// tekshiruvi ko'rmaydi, chunki u gabaritni o'lchaydi, ma'noni emas.
//
// Stend O'NTA rejimni ham yonma-yon ko'rsatadi: ular bitta asbobning
// rejimlari va bir-biriga o'xshab ketishi kerak -- bitta qiya, bitta
// chiziq qalinligi, bitta rang.
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { STYLES } from '../src/components/grade11/core.jsx'
import { SpaceFrame } from '../src/components/grade11/tools.jsx'

const Card = ({ w = 330, title, children }) => (
  <div style={{ width: w }}>
    <div style={{ font: '11px monospace', color: '#687078', marginBottom: 2 }}>{title}</div>
    {children}
  </div>
)

function App() {
  const [s, setS] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setS((x) => (x + 1) % 3), 3200)
    return () => clearInterval(t)
  }, [])
  const step = [1, 2, 3][s]
  // λ < 1 da strelka qisqa bo'lishi TABIIY -- vektor qisqaradi. Stendda
  // yolg'on ogohlantirish chiqmasligi uchun 1,5 dan boshlanadi.
  const kk = [1.5, 2, -1][s]
  const tt = [0.35, 0.7, 1][s]

  return (
    <div className="lesson-root" style={{ padding: 10 }}>
      <style>{STYLES}</style>
      <div id="stepnow" style={{ font: '12px monospace', marginBottom: 8 }}>{'step ' + s}</div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* 35-dars: nuqta va uning proyeksiyalari. Darslik 2- va 3-rasm. */}
        <Card title="35 point: A(2;3;4), proyeksiyalar">
          <SpaceFrame
            mode="point" box={[5, 5, 5]} frame axisNums interactive
            points={[{ at: [2, 3, 4], label: 'A', proj: true, coords: true }]}
            height={172}
          />
        </Card>
        {/* 35-dars: manfiy koordinatalar, oktanta. */}
        <Card title="35 point: P(-2;3;-4), manfiy">
          <SpaceFrame
            mode="point" box={[[-4, 4], [-4, 4], [-4, 4]]} frame
            points={[{ at: [-2, 3, -4], label: 'P', proj: true, coords: true }]}
            height={172}
          />
        </Card>
        {/* 40-dars: AB parallelepipedning diagonali. */}
        <Card title="40 dist: A(1;1;1) B(4;3;3)">
          <SpaceFrame
            mode="dist" box={[5, 4, 4]}
            points={[{ at: [1, 1, 1], label: 'A', dx: -9, dy: -5 }, { at: [4, 3, 3], label: 'B', dy: 4, dx: 9 }]}
            value="dist" height={172}
          />
        </Card>
        {/* 35-dars: kesma o'rtasi. */}
        <Card title="35 mid: A(0;1;4) B(4;3;0) -> C">
          <SpaceFrame
            mode="mid" box={[5, 4, 5]}
            points={[{ at: [0, 1, 4], label: 'A' }, { at: [4, 3, 0], label: 'B' }]}
            value="coords" height={172}
          />
        </Card>
        {/* 35-dars: λ nisbatda bo'lish. */}
        <Card title="35 mid: λ = 2">
          <SpaceFrame
            mode="mid" box={[5, 4, 5]} ratio={2}
            points={[{ at: [0, 1, 4], label: 'A' }, { at: [4, 3, 0], label: 'B' }]}
            value="coords" height={172}
          />
        </Card>
        {/* 36-dars: teng vektorlar boshqa joyda. ERKIN vektor. */}
        <Card title="36 vec: teng vektorlar (2;2;1)">
          <SpaceFrame
            mode="vec" box={[3, 6, 4]}
            vectors={[
              { from: [1, 0, 0], to: [1, 3, 2], label: 'a', coords: true },
              { from: [1, 2, 1], to: [1, 5, 3], label: 'b', tone: 'accent', coords: true },
            ]}
            height={172}
          />
        </Card>
        {/* 36-dars: uchburchak qoidasi. */}
        <Card title="36 sum: uchburchak">
          <SpaceFrame
            mode="sum" box={[5, 5, 4]}
            sum={{ a: [0, 3, 1], b: [1, 1, 2], rule: 'triangle', step }}
            height={172}
          />
        </Card>
        {/* 36-dars: parallelogramm qoidasi. */}
        <Card title="36 sum: parallelogramm">
          <SpaceFrame
            mode="sum" box={[5, 5, 4]}
            sum={{ a: [0, 3, 1], b: [1, 1, 2], rule: 'parallelogram', step }}
            height={172}
          />
        </Card>
        {/* 36-dars: parallelepiped qoidasi -- uchta vektor. */}
        <Card title="36 sum: parallelepiped">
          <SpaceFrame
            mode="sum" box={[5, 5, 5]}
            sum={{ a: [0, 3, 0], b: [2, 0, 0], c: [0, 0, 3], rule: 'box', step }}
            height={172}
          />
        </Card>
        {/* 36-dars: songa ko'paytirish, λ manfiy. */}
        <Card title="36 vec: λa">
          <SpaceFrame
            mode="vec" box={[[-2, 2], [-4, 4], [-3, 4]]} lambda={kk}
            vectors={[{ from: [0, 0, 0], to: [0, 2, 1], label: 'a', coords: true }]}
            height={172}
          />
        </Card>
        {/* 37-dars: skalyar ko'paytma NOL -- to'g'ri burchak belgisi. */}
        <Card title="37 dot: a·b = 0">
          <SpaceFrame
            mode="dot" box={[[0, 3], [-2, 4], [0, 3]]}
            vectors={[
              { from: [0, 0, 0], to: [1, 3, 1], label: 'a' },
              { from: [0, 0, 0], to: [1, -1, 2], label: 'b', tone: 'accent' },
            ]}
            value="dot" height={172}
          />
        </Card>
        {/* 37-dars: o'tkir burchak, son musbat. */}
        <Card title="37 dot: a·b = 6">
          <SpaceFrame
            mode="dot" box={[3, 4, 4]}
            vectors={[
              { from: [0, 0, 0], to: [1, 3, 1], label: 'a' },
              { from: [0, 0, 0], to: [0, 1, 3], label: 'b', tone: 'accent' },
            ]}
            value="dot" height={172}
          />
        </Card>
        {/* 37-dars: o'tmas burchak, son MANFIY -- belgi burchakni aytadi. */}
        <Card title="37 dot: a·b < 0">
          <SpaceFrame
            mode="dot" box={[[0, 3], [-3, 4], [0, 4]]}
            vectors={[
              { from: [0, 0, 0], to: [1, 3, 1], label: 'a' },
              { from: [0, 0, 0], to: [0, -2, 1], label: 'b', tone: 'accent' },
            ]}
            value="angle" height={172}
          />
        </Card>
        {/* 38-dars: tekislik, normal strelkasi va tenglama. */}
        <Card title="38 plane: x+2y+2z=6">
          <SpaceFrame
            mode="plane" box={[6, 4, 4]}
            planes={[{ n: [1, 2, 2], d: -6, label: 'α' }]}
            points={[{ at: [2, 1, 1], label: 'M', tone: 'accent' }]}
            value="eq" height={172}
          />
        </Card>
        {/* 39-dars: ikki tekislik, ikki juft burchak, javob o'tkiri. */}
        <Card title="39 dihedral: 45 va 135">
          <SpaceFrame
            mode="dihedral" box={[[-1, 4], [-1, 4], [-1, 4]]}
            planes={[
              { n: [0, 0, 1], d: 0, label: 'α', normal: false },
              { n: [1, 0, 1], d: -2, label: 'β', normal: false, tone: 'accent' },
            ]}
            height={186}
          />
        </Card>
        {/* 40-dars: halol chizg'ich. Perpendikular -- masofa va son. */}
        <Card title="40 drop: Oz gacha, perpendikular">
          <SpaceFrame
            mode="drop" box={[4, 4, 5]}
            points={[{ at: [3, 3, 3], label: 'A' }]}
            drop={{ from: [3, 3, 3], to: 'axis:Oz', foot: [0, 0, 3] }}
            value="dist" height={172}
          />
        </Card>
        {/* 40-dars: qiya -- so'z bor, SON YO'Q. */}
        <Card title="40 drop: qiya, son yo'q">
          <SpaceFrame
            mode="drop" box={[4, 4, 5]}
            points={[{ at: [3, 3, 3], label: 'A' }]}
            drop={{ from: [3, 3, 3], to: 'axis:Oz', foot: [0, 0, 0] }}
            value="dist" height={172}
          />
        </Card>
        {/* 40-dars: nuqtadan tekislikkacha. */}
        <Card title="40 drop: tekislikkacha">
          <SpaceFrame
            mode="drop" box={[5, 5, 5]}
            planes={[{ n: [1, 2, 2], d: -6, label: 'α', normal: false }]}
            points={[{ at: [4, 4, 4], label: 'A' }]}
            drop={{ from: [4, 4, 4], to: 'plane' }}
            value="dist" height={172}
          />
        </Card>
        {/* 41-dars: parallel ko'chirish. */}
        <Card title="41 map: parallel ko'chirish">
          <SpaceFrame
            mode="map" box={[6, 6, 5]}
            map={{ kind: 'shift', shape: 'tetra', vec: [3, 2, 1], t: tt }}
            height={172}
          />
        </Card>
        {/* 41-dars: markaziy simmetriya. */}
        <Card title="41 map: markaziy simmetriya">
          <SpaceFrame
            mode="map" box={[[-3, 3], [-3, 3], [-3, 3]]}
            map={{ kind: 'center', shape: 'tetra', center: [0, 0, 0], t: tt }}
            height={172}
          />
        </Card>
        {/* 41-dars: Oxy tekisligiga nisbatan simmetriya. */}
        <Card title="41 map: Oxy ga nisbatan">
          <SpaceFrame
            mode="map" box={[[-1, 3], [-1, 3], [-3, 3]]}
            map={{ kind: 'plane', shape: 'cube', plane: 'Oxy', t: tt }}
            height={172}
          />
        </Card>
        {/* 41-dars: gomotetiya, k ning ishorasi bilan. */}
        <Card title="41 map: gomotetiya k">
          <SpaceFrame
            mode="map" box={[[-3, 3], [-3, 3], [-3, 3]]}
            map={{ kind: 'homothety', shape: 'tetra', center: [0, 0, 0], k: kk, t: 1 }}
            value="coords" valueLabel="A₁" height={172}
          />
        </Card>
        {/* HAQIQIY TELEFON o'lchami: 212 px. O'qilmasa -- dars ham
            o'qilmaydi. */}
        <Card w={212} title="212 px: point">
          <SpaceFrame
            mode="point" box={[5, 5, 5]} frame axisNums
            points={[{ at: [2, 3, 4], label: 'A', proj: true }]}
            height={150}
          />
        </Card>
        <Card w={212} title="212 px: dihedral">
          <SpaceFrame
            mode="dihedral" box={[[-1, 4], [-1, 4], [-1, 4]]}
            planes={[
              { n: [0, 0, 1], d: 0, label: 'α', normal: false },
              { n: [1, 0, 1], d: -2, label: 'β', normal: false, tone: 'accent' },
            ]}
            height={150}
          />
        </Card>
      </div>
    </div>
  )
}

createRoot(document.getElementById('r')).render(<App />)
