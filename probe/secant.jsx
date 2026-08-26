// HOSILA STENDI (11-sinf, B6 bloki, 43-45 darslar).
//   npx vite --port 5298 --strictPort
//   http://localhost:5298/probe/secant.html
//
// NEGA STEND. Kesuvchining urinmaga o'tishi -- HARAKAT, va uni koddan
// o'qib tasdiqlab bo'lmaydi: chiziq chizmadan chiqib ketganini, son
// yozuvi chizma ustiga tushib qolganini faqat ko'z ko'radi. B5 blokida
// stend proyeksiyada yig'ilib qolgan diagonalni va yarim birlik surilgan
// uchni ushlagan -- ikkisini ham o'lchov tekshiruvi ko'rmagan.
//
// Kartochkalar YONMA-YON: to'rtta rejim bitta asbobning rejimlari, ular
// bir xil qiyalik, bir xil qalinlik va bir xil rangda bo'lishi kerak.
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { STYLES } from '../src/components/grade11/core.jsx'
import { SecantBoard } from '../src/components/grade11/tools.jsx'

const Card = ({ w = 330, title, children }) => (
  <div style={{ width: w }}>
    <div style={{ font: '11px monospace', color: '#687078', marginBottom: 2 }}>{title}</div>
    {children}
  </div>
)

const sq = (x) => x * x
const cube3 = (x) => x * x * x - 3 * x + 3
const par = (x) => x * x - 5 * x
const down = (x) => -x * x + 4 * x

const XT = (list) => list.map((v) => ({ v }))

function App() {
  const [s, setS] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setS((x) => (x + 1) % 5), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="lesson-root" style={{ padding: 10 }}>
      <style>{STYLES}</style>
      <div id="stepnow" style={{ font: '12px monospace', marginBottom: 8 }}>{'step ' + s}</div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* 43-dars, darslik 13-rasm: B nuqta A ga yaqinlashadi, nisbat 2 ga intiladi. */}
        <Card title="43 secant: x*x, x0=1, nisbat -> 2">
          <SecantBoard
            fn={sq} xDomain={[-0.6, 3.4]} yDomain={[-1, 9]}
            xTicks={XT([1, 2, 3])} yTicks={XT([2, 4, 6, 8])}
            mode="secant" x0={1} hs={[2, 1, 0.5, 0.25]} phase={s}
            hLabel="h" riseLabel="Δy" ratioLabel="Δy / h" slopeLabel="k"
            curveLabel="y = x²" height={178}
          />
        </Card>

        {/* Urinma paydo bo'lganda oxirgi kesuvchi XIRA bo'lib qoladi:
            ikkisi solishtiriladi. */}
        <Card title="43 secant: urinma + ENG KENG kesuvchi (first)">
          <SecantBoard
            fn={sq} xDomain={[-0.6, 3.4]} yDomain={[-1, 9]}
            xTicks={XT([1, 2, 3])} yTicks={XT([2, 4, 6, 8])}
            mode="secant" x0={1} hs={[2, 1, 0.5, 0.25]} phase={9} keepSecant="first" 
            hLabel="h" riseLabel="Δy" ratioLabel="Δy / h" slopeLabel="k"
            height={178}
          />
        </Card>

        {/* 43-dars, fizik ma'no: o'rtacha tezlik va oniy tezlik. */}
        <Card title="43 speed: s=t*t, t0=2, oniy 4">
          <SecantBoard
            fn={sq} xDomain={[-0.4, 4.4]} yDomain={[-1, 17]}
            xTicks={XT([1, 2, 3, 4])} yTicks={XT([4, 8, 12, 16])}
            mode="speed" x0={2} hs={[2, 1, 0.5]} phase={s} keepSecant
            hLabel="Δt" riseLabel="Δs" ratioLabel="o'rtacha" slopeLabel="oniy"
            curveLabel="s(t)" height={178}
          />
        </Card>

        {/* 45-dars, darslik 34-bet 1-misol: k = -1, urinma y = -x - 4. */}
        <Card title="45 tangent: x*x-5x, x0=2, k=-1">
          <SecantBoard
            fn={par} xDomain={[-0.6, 5.4]} yDomain={[-7.5, 2]}
            xTicks={XT([1, 2, 3, 4, 5])} yTicks={XT([-6, -4, -2])}
            mode="tangent" x0={2} slopeTriangle
            eq="y = −x − 4" slopeLabel="k" height={178}
          />
        </Card>

        {/* 45-dars, darslik 44-bet 4-misol: statsionar nuqtalar -1 va 1. */}
        <Card title="45 sign: x^3-3x+3, +/-/+">
          <SecantBoard
            fn={cube3} xDomain={[-2.4, 2.4]} yDomain={[-4, 10]}
            xTicks={XT([-2, -1, 1, 2])} yTicks={XT([1, 5])}
            mode="sign"
            signs={[{ from: -2.4, to: -1, sign: '+' }, { from: -1, to: 1, sign: '−' }, { from: 1, to: 2.4, sign: '+' }]}
            marks={[{ v: -1, label: '−1' }, { v: 1, label: '1' }]}
            height={190}
          />
        </Card>

        <Card title="45 sign + hosila grafigi">
          <SecantBoard
            fn={cube3} xDomain={[-2.4, 2.4]} yDomain={[-4, 10]}
            xTicks={XT([-2, -1, 1, 2])} yTicks={XT([1, 5])}
            mode="sign" showDeriv derivLabel="f ′"
            signs={[{ from: -2.4, to: -1, sign: '+' }, { from: -1, to: 1, sign: '−' }, { from: 1, to: 2.4, sign: '+' }]}
            marks={[{ v: -1, label: '−1' }, { v: 1, label: '1' }]}
            height={190}
          />
        </Card>

        {/* MANFIY qiyalik: kesuvchi ham, urinma ham pastga qarab ketadi. */}
        <Card title="43 secant: -x*x+4x, x0=3, k manfiy">
          <SecantBoard
            fn={down} xDomain={[-0.4, 4.6]} yDomain={[-3, 5]}
            xTicks={XT([1, 2, 3, 4])} yTicks={XT([2, 4])}
            mode="secant" x0={3} hs={[1.4, 0.7, 0.35]} phase={s}
            hLabel="h" riseLabel="Δy" ratioLabel="Δy / h" slopeLabel="k"
            height={178}
          />
        </Card>

        {/* TIK urinma: chiziq oynadan chiqib ketmasligi kerak. */}
        <Card title="43 secant: x^3, x0=1.5, k=6,75 (tik)">
          <SecantBoard
            fn={(x) => x * x * x} xDomain={[-0.4, 2.6]} yDomain={[-1, 15]}
            xTicks={XT([1, 2])} yTicks={XT([4, 8, 12])}
            mode="secant" x0={1.5} hs={[0.8, 0.4, 0.2]} phase={s}
            hLabel="h" ratioLabel="Δy / h" slopeLabel="k" height={178}
          />
        </Card>

        {/* 44-dars: f va f' ustma-ust -- «hosila -- YANGI funksiya». */}
        <Card title="44: f=x*x va f' = 2x">
          <SecantBoard
            fn={sq} xDomain={[-2.6, 2.6]} yDomain={[-5, 7]}
            xTicks={XT([-2, -1, 1, 2])} yTicks={XT([-4, 2, 6])}
            mode="sign" showDeriv derivLabel="f ′ = 2x"
            signs={[{ from: -2.6, to: 0, sign: '−' }, { from: 0, to: 2.6, sign: '+' }]}
            marks={[{ v: 0, label: '0' }]}
            height={190}
          />
        </Card>

        {/* TELEFON. 393 px ekranda asbob taxminan 212 px joy oladi. */}
        <Card w={212} title="telefon 212: secant">
          <SecantBoard
            fn={sq} xDomain={[-0.6, 3.4]} yDomain={[-1, 9]}
            xTicks={XT([1, 2, 3])} yTicks={XT([4, 8])}
            mode="secant" x0={1} hs={[2, 1, 0.5]} phase={s}
            hLabel="h" ratioLabel="Δy / h" slopeLabel="k" height={168}
          />
        </Card>
        <Card w={212} title="telefon 212: sign">
          <SecantBoard
            fn={cube3} xDomain={[-2.4, 2.4]} yDomain={[-4, 10]}
            xTicks={XT([-2, -1, 1, 2])} yTicks={XT([1, 5])}
            mode="sign"
            signs={[{ from: -2.4, to: -1, sign: '+' }, { from: -1, to: 1, sign: '−' }, { from: 1, to: 2.4, sign: '+' }]}
            marks={[{ v: -1, label: '−1' }, { v: 1, label: '1' }]}
            height={182}
          />
        </Card>
      </div>
    </div>
  )
}

createRoot(document.getElementById('r')).render(<App />)
