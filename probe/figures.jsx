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
import { Space } from '../src/components/grade10/figures.jsx'

// PRIBOR 6B, KESIM (49-dars). Nuqta qirrada ULUSH bilan beriladi, shuning
// uchun burilishda u qirradan uzilmaydi. Ulushlar hisoblangan.
const CUT3 = [
  { id: 'M', on: ['A1', 'B1'], t: 0.5 },
  { id: 'N', on: ['B1', 'C1'], t: 0.5 },
  { id: 'K', on: ['D', 'D1'], t: 0.25 },
]
const CUT5 = CUT3.concat([
  { id: 'P', on: ['A', 'A1'], t: 0.75 },
  { id: 'H', on: ['C', 'C1'], t: 0.75 },
])
const PENT = { by: ['K', 'P', 'M', 'N', 'H'] }
// YOLG'ON: to'rtinchi nuqta shunchaki TANLANGAN. Boshlang'ich rakursda
// to'rtburchak qavariq va to'la ko'rinadi (kompaktligi 0,041 -- kvadratda
// 0,0625), bitta burilishda esa oltitadan beshta holatda proyeksiyada o'zini
// o'zi kesadi. Hisoblab tanlangan, ko'z bilan emas.
const CUT_FAKE = CUT3.concat([{ id: 'G', on: ['A', 'B'], t: 0.25 }])
const FAKE = { by: ['M', 'N', 'G', 'K'] }

// Ulushlar yorliqlar to'qnashmasligi va X kadrda qolishi shartidan
// hisoblangan: X nuqta AC ning 1,44 ulushida, N esa BC ning 0,77 ida.
const PYR = { kind: 'pyramid', n: 3, h: 1.2, r: 0.66, turn: 1.1 }
const PYR_CUTS = [
  { id: 'K', on: ['A', 'B'], t: 0.5 },
  { id: 'L', on: ['A', 'S'], t: 0.8 },
  { id: 'M', on: ['C', 'S'], t: 0.55 },
]
const PYR_MEETS = [
  { id: 'X', a: ['L', 'M'], b: ['A', 'C'] },
  { id: 'N', a: ['K', 'X'], b: ['B', 'C'] },
]
const TRACE = [
  { from: 'M', to: 'X', hidden: true, w: 1.4, tone: '#7f8c8d' },
  { from: 'A', to: 'X', hidden: true, w: 1.4, tone: '#7f8c8d' },
  { from: 'K', to: 'X', hidden: true, w: 1.4, tone: '#7f8c8d' },
]

// KUBNING ENG KATTA KESIMI -- muntazam oltiburchak, olti qirraning o'rtasi.
// Tekisligi katta diagonalga perpendikulyar, shuning uchun sinf kamerasida u
// YUZMA-YUZ turadi (kosinus 0,93) va polosaga aylanmaydi.
const CUT6 = [
  { id: 'U1', on: ['A1', 'B1'], t: 0.5, label: '' },
  { id: 'U2', on: ['B', 'B1'], t: 0.5, label: '' },
  { id: 'U3', on: ['B', 'C'], t: 0.5, label: '' },
  { id: 'U4', on: ['C', 'D'], t: 0.5, label: '' },
  { id: 'U5', on: ['D', 'D1'], t: 0.5, label: '' },
  { id: 'U6', on: ['D1', 'A1'], t: 0.5, label: '' },
]
// YETTIBURCHAK: tekislik yettita yoqning HAMMASINI kesadi. Og'ish azimuti
// kamera bo'ylab emas tanlangan (1,4 pi): aks holda tekislik qirradan
// ko'rinib polosaga aylanardi -- stendda shunday bo'lgan edi.
const PRISM5 = { kind: 'prism', n: 5, h: 1.0, r: 0.58, turn: 0.3 }
const CUT7 = [
  { id: 'W1', on: ['D1', 'E1'], t: 0.469, label: '' },
  { id: 'W2', on: ['E', 'E1'], t: 0.882, label: '' },
  { id: 'W3', on: ['A', 'A1'], t: 0.132, label: '' },
  { id: 'W4', on: ['A', 'B'], t: 0.547, label: '' },
  { id: 'W5', on: ['B', 'C'], t: 0.182, label: '' },
  { id: 'W6', on: ['C', 'C1'], t: 0.491, label: '' },
  { id: 'W7', on: ['C1', 'D1'], t: 0.83, label: '' },
]
const IDS = (a) => a.map((c) => c.id)

function App() {
  const [s, setS] = useState(0)
  useEffect(() => { const t = setInterval(() => setS((x) => (x + 1) % 3), 3600); return () => clearInterval(t) }, [])
  return (
    <div className="lesson-root" style={{ padding: 10 }}>
      <style>{STYLES}</style>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* HAQIQIY KESIM: beshburchak. Burilishda ko'pburchak buzilmaydi. */}
        <Space size={360} step={1} yaw={0.4 + s * 0.6} cube cuts={CUT5} cut={PENT} />
        {/* YOLG'ON KESIM: to'rtinchi nuqta chorakda, kerak joyi uch chorakda.
            0,4 da butun, bitta burilishda esa o'zini o'zi kesadi. */}
        <Space size={360} step={1} yaw={0.4 + s * 0.6} cube cuts={CUT_FAKE} cut={FAKE} />
        {/* Telefon o'lchami: beshburchak 212 da o'qiladimi. Kubning o'z
            yorliqlari berkitilgan -- kichik kadrda ular kesim uchlari bilan
            to'qnashadi. */}
        <Space
          size={212} step={1} yaw={0.4} cube cuts={CUT5} cut={PENT}
          hide={['A', 'B', 'C', 'D', 'A1', 'B1', 'C1', 'D1']}
        />
        {/* IZLAR USULI: X ikki chiziqning kesishishi, N esa qirradagi nuqta. */}
        <Space
          size={360} step={1} yaw={0.5 + s * 0.4}
          poly={PYR} cuts={PYR_CUTS} meets={PYR_MEETS} segs={TRACE}
          cut={{ by: ['K', 'L', 'M', 'N'] }}
        />
        {/* YOQ SINOVI: tomon bo'yalgan yoqdan chiqmaydi. */}
        <Space
          size={360} step={1} yaw={0.4 + s * 0.6} cube cuts={CUT3}
          faces={[{ by: ['A1', 'B1', 'C1', 'D1'] }]}
          segs={[{ from: 'M', to: 'N' }]}
        />
        {/* ENG KATTA KESIM: kubda oltiburchak, beshburchakli prizmada esa
            yettiburchak. Yorliqlar berkitilgan: ular bu yerda ma'no bermaydi. */}
        <Space size={360} step={1} yaw={0.4 + s * 0.5} cube cuts={CUT6} cut={{ by: IDS(CUT6) }} />
        <Space
          size={360} step={1} yaw={0.4 + s * 0.5}
          poly={PRISM5} cuts={CUT7} cut={{ by: IDS(CUT7) }}
        />
        <Space
          size={212} step={1} yaw={0.4}
          poly={PRISM5} cuts={CUT7} cut={{ by: IDS(CUT7) }}
        />
      </div>
      <div id="stepnow" style={{ fontFamily: 'monospace', marginTop: 6 }}>{'step ' + s}</div>
    </div>
  )
}
createRoot(document.getElementById('r')).render(<App />)
