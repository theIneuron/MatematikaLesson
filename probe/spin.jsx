// AYLANISH JISMI STENDI (11-sinf, B4 bloki).
//   npx vite --port 5299 --strictPort
//   http://localhost:5299/probe/spin.html
//
// NEGA STEND. Asbob to'g'ri chizayotganini KODGA qarab tasdiqlab bo'lmaydi:
// 10-sinfda `Unroll` uch marta yozildi va ikkitasi aynan suratdan rad etildi
// (mayda uchburchak, ko'rinmas yo'naltiruvchilar). Darsni yig'ib ko'rgandan
// ko'ra kadr olish arzon.
//
// Stend BESHTA harakatni ham ko'rsatadi, chunki ular bitta asbobning
// rejimlari va bir biriga o'xshab ketishi kerak: bitta yassilanish, bitta
// chiziq qalinligi, bitta rang.
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { STYLES } from '../src/components/grade11/core.jsx'
import { SpinBoard } from '../src/components/grade11/tools.jsx'

// Profil funksiyalari: aylanganda mos jism chiqadi.
const CYL = () => 2                       // to'rtburchak -> silindr
const CONE = (x) => (2 * x) / 3           // uchburchak   -> konus
const BALL = (x) => Math.sqrt(Math.max(0, 4 - x * x))  // yarim doira -> shar

function App() {
  const [s, setS] = useState(0)
  useEffect(() => { const t = setInterval(() => setS((x) => (x + 1) % 3), 3600); return () => clearInterval(t) }, [])
  const spin = [0.34, 0.67, 1][s]
  const cut = [-1.4, 0, 1.4][s]
  const nd = [3, 6, 12][s]
  return (
    <div className="lesson-root" style={{ padding: 10 }}>
      <style>{STYLES}</style>
      <div id="stepnow" style={{ font: '12px monospace', marginBottom: 6 }}>{'step ' + s}</div>
      {/* BURISH TEKSHIRUVI: jism to'liq yig'ilgan, o'quvchi uni sudrab
          burishi mumkin. Chapga o'ngga -- yasovchi o'q atrofida yuradi,
          yuqoriga pastga -- ko'rish qiyasi o'zgaradi va asoslar ochiladi. */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 18 }}>
        <div id="rot-cyl" style={{ width: 330 }}>
          <SpinBoard fn={CYL} a={0} b={3} xDomain={[-0.4, 3.4]} yDomain={[-2.6, 2.6]} spin={1} showV height={158} caption="silindr, buriladi" interactive />
        </div>
        <div style={{ width: 330 }}>
          <SpinBoard fn={CONE} a={0} b={3} xDomain={[-0.4, 3.4]} yDomain={[-2.6, 2.6]} spin={1} showV height={158} caption="konus, buriladi" interactive tilt0={0.42} />
        </div>
        <div style={{ width: 330 }}>
          <SpinBoard fn={BALL} a={-2} b={2} xDomain={[-2.4, 2.4]} yDomain={[-2.4, 2.4]} spin={1} showV height={158} caption="shar, buriladi" interactive tilt0={0.55} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* 27-dars: to'rtburchak aylanib silindr beradi. */}
        <div style={{ width: 360 }}>
          <SpinBoard fn={CYL} a={0} b={3} xDomain={[-0.4, 3.4]} yDomain={[-2.6, 2.6]} spin={spin} showV vLabel="V" height={150} caption="silindr" interactive />
        </div>
        {/* 28-dars: uchburchak aylanib konus beradi. */}
        <div style={{ width: 360 }}>
          <SpinBoard fn={CONE} a={0} b={3} xDomain={[-0.4, 3.4]} yDomain={[-2.6, 2.6]} spin={spin} showV height={150} caption="konus" interactive tilt0={0.42} />
        </div>
        {/* 29-dars: kesim o'q bo'ylab yuradi, radius o'zgaradi. */}
        <div style={{ width: 360 }}>
          <SpinBoard fn={BALL} a={-2} b={2} xDomain={[-2.4, 2.4]} yDomain={[-2.4, 2.4]} mode="section" cut={cut} spin={1} height={150} caption="shar, kesim" tilt0={0.55} />
        </div>
        {/* 33-dars: disklar yig'indisi integralga yaqinlashadi. */}
        <div style={{ width: 360 }}>
          <SpinBoard fn={BALL} a={-2} b={2} xDomain={[-2.4, 2.4]} yDomain={[-2.4, 2.4]} mode="disks" disks={nd} spin={1} showV height={150} caption={'disklar: ' + nd} />
        </div>
        {/* 30-dars: yon sirt yoyiladi. */}
        <div style={{ width: 360 }}>
          <SpinBoard mode="net" solid="cyl" R={1.6} hh={2.6} spin={spin} height={150} caption="silindr yoyilmasi" />
        </div>
        <div style={{ width: 360 }}>
          <SpinBoard mode="net" solid="cone" R={1.6} hh={2.6} spin={spin} height={150} caption="konus yoyilmasi" />
        </div>
        {/* 26-dars: prizma yon yoqlari lentaga yoyiladi. */}
        <div style={{ width: 360 }}>
          <SpinBoard mode="net" solid="prism" sides={6} hh={2.4} spin={spin} height={150} caption="prizma yoyilmasi" />
        </div>
        {/* 32-dars: konus silindrga uch marta to'kiladi. */}
        <div style={{ width: 360 }}>
          <SpinBoard mode="pour" R={1.3} hh={2.6} fill={s + 1} height={150} caption="to'kish" />
        </div>
        {/* Haqiqiy telefon o'lchami: 212 px. */}
        <div style={{ width: 212 }}>
          <SpinBoard fn={CONE} a={0} b={3} xDomain={[-0.4, 3.4]} yDomain={[-2.6, 2.6]} spin={spin} showV height={132} caption="212 px" />
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('r')).render(<App />)
