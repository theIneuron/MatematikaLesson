// 1-sinf amaliyot namunalari — 10 ta prototip, mexanika oilalari bo'yicha (P1–P26, столбиksiz).
// Mustaqil: chip-navigatsiya + PracticeHost (UZ/RU + native "Tekshirish"). Ozvuchka yo'q.
import React, { useState } from 'react';
import PracticeHost from './PracticeHost.jsx';
import Amaliyot01 from './Amaliyot01.jsx';
import Amaliyot02 from './Amaliyot02.jsx';
import Amaliyot03 from './Amaliyot03.jsx';
import Amaliyot04 from './Amaliyot04.jsx';
import Amaliyot05 from './Amaliyot05.jsx';
import Amaliyot06 from './Amaliyot06.jsx';
import Amaliyot07 from './Amaliyot07.jsx';
import Amaliyot08 from './Amaliyot08.jsx';
import Amaliyot09 from './Amaliyot09.jsx';
import Amaliyot10 from './Amaliyot10.jsx';
import Amaliyot11 from './Amaliyot11.jsx';
import Amaliyot12 from './Amaliyot12.jsx';
import Amaliyot13 from './Amaliyot13.jsx';
import Amaliyot14 from './Amaliyot14.jsx';
import Amaliyot15 from './Amaliyot15.jsx';
import Amaliyot16 from './Amaliyot16.jsx';
import Amaliyot17 from './Amaliyot17.jsx';
import Amaliyot18 from './Amaliyot18.jsx';
import Amaliyot19 from './Amaliyot19.jsx';
import Amaliyot20 from './Amaliyot20.jsx';
import Amaliyot21 from './Amaliyot21.jsx';
import Amaliyot22 from './Amaliyot22.jsx';
import Amaliyot23 from './Amaliyot23.jsx';
import Amaliyot24 from './Amaliyot24.jsx';
import Amaliyot25 from './Amaliyot25.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · mazmun · blok · qiyinlik
const ITEMS = [
  { id: '01', label: '1. Sanash', C: Amaliyot01 },            // P1 · Sanash — nechta olma? (Blok 1 · 🟢)
  { id: '02', label: '2. Juftlar', C: Amaliyot02 },           // P3 · Juftlarni ula: misol ↔ javob (Blok 2 · 🟢)
  { id: '03', label: '3. Taqqoslash', C: Amaliyot03 },        // P4 · Belgini qo'y: 6 __ 8 (Blok 1 · 🟡)
  { id: '04', label: '4. Son uyi', C: Amaliyot04 },           // P6 · Sonning tarkibi: 7 = 4 va __ (Blok 1 · 🟡)
  { id: '05', label: '5. O\'nlik', C: Amaliyot05 },           // P9 · Ten-frame: 10 gacha nechta? (Blok 3 · 🟡)
  { id: '06', label: '6. O\'nlikdan o\'tish', C: Amaliyot06 }, // P8 · 8 + 5 bosqichma-bosqich (Blok 4 · 🔴)
  { id: '07', label: '7. Razryad', C: Amaliyot07 },           // P21 · 47 = 4 o'nlik + 7 birlik (Blok 5 · 🟡)
  { id: '08', label: '8. Xatoni top', C: Amaliyot08 },        // P13 · 53 + 4 = 93? (Blok 5 · 🔴)
  { id: '09', label: '9. Masala jadvali', C: Amaliyot09 },    // P24 · bor edi / keldi / hammasi (Blok 6 · 🟡)
  { id: '10', label: '10. Uzunlik', C: Amaliyot10 },          // P26 · 1 dm = ? sm (Blok 7 · 🟡)
  { id: '11', label: '11. Massa', C: Amaliyot11 },            // P26 · qaysi og'irroq? tarozi (Blok 7 · 🟡)
  { id: '12', label: '12. Sonlar nuri', C: Amaliyot12 },      // P7 · chigirtka sakraydi: 4 dan 3 (Blok 2 · 🟡)
  { id: '13', label: '13. Qonuniyat', C: Amaliyot13 },        // P17 · qatorni davom ettir (Blok 6 · 🟡)
  { id: '14', label: '14. O\'lchash', C: Amaliyot14 },        // P16 · qalam necha sm? chizg'ich (Blok 7 · 🟡)
  { id: '15', label: '15. Saralash', C: Amaliyot15 },         // P10 · doira/kvadrat savatlarga (Blok 7 · 🟡)
  { id: '16', label: '16. Ikki qadam', C: Amaliyot16 },       // P25 · 4+3, keyin −2 (Blok 6 · 🔴)
  { id: '17', label: '17. Topib bos', C: Amaliyot17 },        // P11 · barcha doiralarni top (Blok 7 · 🟢)
  { id: '18', label: '18. Bo\'sh joy', C: Amaliyot18 },       // P5 · 2 3 4 _ 6 7 (Blok 1 · 🟡)
  { id: '19', label: '19. O\'nliklab', C: Amaliyot19 },       // P23 · 20 30 _ 50 (Blok 5 · 🟡)
  { id: '20', label: '20. Qaysi amal', C: Amaliyot20 },       // P14 · qo'shish yoki ayirish? (Blok 6 · 🟡)
  { id: '21', label: '21. Ortiqcha', C: Amaliyot21 },         // P18 · ortiqchani top (razogrev · 🟡)
  { id: '22', label: '22. To\'g\'ri/noto\'g\'ri', C: Amaliyot22 }, // P12 · 6 + 2 = 9? (Blok 1 · 🟢)
  { id: '23', label: '23. Yechimni tuz', C: Amaliyot23 },     // P15 · 4 + 2 = 6 fishkalardan (Blok 6 · 🟡)
  { id: '24', label: '24. Kvest-sandiq', C: Amaliyot24 },     // P19 · sandiqni och: 8 + 6 (kvest · 🔴)
  { id: '25', label: '25. Diagramma', C: Amaliyot25 },        // P20 · nechta olma? piktogramma (ma'lumot · 🟡)
];

export default function PracticePreview() {
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'),
    background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif", whiteSpace: 'nowrap',
  });

  return (
    <div style={{ width: '100%', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '10px 12px', borderBottom: '1px solid #eef0f4', marginBottom: 6,
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>1-sinf amaliyot namunalari (25 ta)</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {item.label}
          </button>
        ))}
      </div>

      <PracticeHost key={q.id} Question={q.C} />
    </div>
  );
}
