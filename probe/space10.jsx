// PRIBOR 6C NI TEKSHIRISH STENDI (10-sinf, B8 bloki, 50-55 darslar).
//
// SAVOL BITTA: 11-sinf uchun yozilgan `SpaceFrame` 10-sinfning QOBIG'I ichida
// ishlaydimi. Javob: ishlaydi, lekin TILI oqib ketadi -- shuning uchun u
// `space.jsx` dagi `Space3D` o'rami orqali olinadi. Asbobning o'zi tayyor -- u
// allaqachon bor, o'nta rejimi bilan: nuqta, masofa, o'rta, vektor, yig'indi,
// skalyar ko'paytma, tekislik, ikki yoqli burchak, perpendikulyar, almashtirish.
// Bu aynan B8 blokining mavzulari.
//
// NEGA IMPORT, NUSXA EMAS. Loyihaning qoidasi: umumiy kod umumiy modulga
// chiqariladi, nusxa olinmaydi (CLAUDE.md §5). 9-sinf 8-sinfning qatlamini
// shunday import qiladi.
//
// DIQQAT, METODISTGA SAVOL: bu asbob KABINET proyeksiyasini ishlatadi (chuqurlik
// o'qi 45 daraja va ikki barobar qisqa), 10-sinfning `Space` asbobi esa sinf
// kamerasini (burilish 0,4, ko'tarilish 0,46). Sabab sanab tekshirilgan:
// ortogonal kamerada (1;1;1) ko'rinishidagi vektor ekranda to'qqiz pikselga
// yig'iladi. Ya'ni bitta kursda ikki xil proyeksiya bo'ladi, va buni metodist
// bilishi kerak.
//
//   npx vite --port 5299 --strictPort
//   http://localhost:5299/probe/space10.html
import React from 'react'
import { createRoot } from 'react-dom/client'
import { LangProvider, STYLES } from '../src/components/grade10/core.jsx'
import { Space3D } from '../src/components/grade10/space.jsx'

// Til STENDGA ham so'rovdan keladi -- loyihaning naqshi (`?lang=`).
const LANG = new URLSearchParams(window.location.search).get('lang') || 'uz'

const Card = ({ w = 330, title, children }) => (
  <div style={{ width: w }}>
    <div style={{ font: '11px monospace', color: '#687078', marginBottom: 2 }}>{title}</div>
    {children}
  </div>
)

function App() {
  return (
    <LangProvider value={LANG}>
    <div className="lesson-root" style={{ padding: 10 }}>
      <style>{STYLES}</style>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Card title="50 koordinatalar: nuqta va proyeksiyalari">
          <Space3D
            mode="point" box={[4, 4, 4]} axisNums
            points={[{ at: [2, 3, 4], label: 'A', proj: true, coords: true }]}
            value="coords"
          />
        </Card>
        <Card title="51 vektor: (2;2;1) -- eng xatarli yo'nalish">
          <Space3D
            mode="vec" box={[4, 4, 4]}
            vectors={[{ from: [0, 0, 0], to: [2, 2, 1], label: 'a', coords: true }]}
            value="len"
          />
        </Card>
        <Card title="52 amallar: uchburchak qoidasi">
          <Space3D
            mode="sum" box={[4, 4, 4]}
            sum={{ a: [3, 0, 0], b: [0, 3, 2], rule: 'triangle' }}
          />
        </Card>
        <Card title="53 skalyar ko'paytma: burchak">
          <Space3D
            mode="dot" box={[4, 4, 4]}
            vectors={[
              { from: [0, 0, 0], to: [3, 0, 0], label: 'a' },
              { from: [0, 0, 0], to: [0, 3, 3], label: 'b' },
            ]}
            value="angle"
          />
        </Card>
        <Card title="54 tekislik tenglamasi va normal">
          <Space3D
            mode="plane" box={[4, 4, 4]}
            planes={[{ n: [1, 1, 1], d: -3, label: 'a', normal: true }]}
            value="eq"
          />
        </Card>
        <Card title="55 masofa: halol chizg'ich" >
          <Space3D
            mode="drop" box={[4, 4, 4]}
            points={[{ at: [3, 2, 3], label: 'M' }]}
            drop={{ from: [3, 2, 3], to: 'plane:Oxy' }}
            value="dist"
          />
        </Card>
        {/* RAKURS ISHLAYDIMI: bitta sahna, ikki burilish. Chizma o'zgarishi
            KERAK, aks holda burish tugmasi yolg'on gapiradi. */}
        <Card title="rakurs 0: burilishdan oldin">
          <Space3D
            mode="vec" box={[4, 4, 4]} yaw={0}
            vectors={[{ from: [0, 0, 0], to: [2, 3, 1], label: 'a', coords: true }]}
          />
        </Card>
        <Card title="rakurs 0,8: burilishdan keyin">
          <Space3D
            mode="vec" box={[4, 4, 4]} yaw={0.8}
            vectors={[{ from: [0, 0, 0], to: [2, 3, 1], label: 'a', coords: true }]}
          />
        </Card>
        <Card w={212} title="telefon 212: nuqta o'qiladimi">
          <Space3D
            mode="point" box={[4, 4, 4]}
            points={[{ at: [2, 3, 4], label: 'A', proj: true }]}
          />
        </Card>
      </div>
      <div id="stepnow" style={{ fontFamily: 'monospace', marginTop: 6 }}>step 0</div>
    </div>
    </LangProvider>
  )
}
createRoot(document.getElementById('r')).render(<App />)
