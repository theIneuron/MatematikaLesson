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

const ITEMS = [
  { id: '01', label: '1. Sanash', full: 'P1 · Sanash — nechta olma? (Blok 1 · 🟢)', C: Amaliyot01 },
  { id: '02', label: '2. Juftlar', full: 'P3 · Juftlarni ula: misol ↔ javob (Blok 2 · 🟢)', C: Amaliyot02 },
  { id: '03', label: '3. Taqqoslash', full: 'P4 · Belgini qo\'y: 6 __ 8 (Blok 1 · 🟡)', C: Amaliyot03 },
  { id: '04', label: '4. Son uyi', full: 'P6 · Sonning tarkibi: 7 = 4 va __ (Blok 1 · 🟡)', C: Amaliyot04 },
  { id: '05', label: '5. O\'nlik', full: 'P9 · Ten-frame: 10 gacha nechta? (Blok 3 · 🟡)', C: Amaliyot05 },
  { id: '06', label: '6. O\'nlikdan o\'tish', full: 'P8 · 8 + 5 bosqichma-bosqich (Blok 4 · 🔴)', C: Amaliyot06 },
  { id: '07', label: '7. Razryad', full: 'P21 · 47 = 4 o\'nlik + 7 birlik (Blok 5 · 🟡)', C: Amaliyot07 },
  { id: '08', label: '8. Xatoni top', full: 'P13 · 53 + 4 = 93? (Blok 5 · 🔴)', C: Amaliyot08 },
  { id: '09', label: '9. Masala jadvali', full: 'P24 · bor edi / keldi / hammasi (Blok 6 · 🟡)', C: Amaliyot09 },
  { id: '10', label: '10. Uzunlik', full: 'P26 · 1 dm = ? sm (Blok 7 · 🟡)', C: Amaliyot10 },
  { id: '11', label: '11. Massa', full: 'P26 · qaysi og\'irroq? tarozi (Blok 7 · 🟡)', C: Amaliyot11 },
  { id: '12', label: '12. Sonlar nuri', full: 'P7 · chigirtka sakraydi: 4 dan 3 (Blok 2 · 🟡)', C: Amaliyot12 },
  { id: '13', label: '13. Qonuniyat', full: 'P17 · qatorni davom ettir (Blok 6 · 🟡)', C: Amaliyot13 },
  { id: '14', label: '14. O\'lchash', full: 'P16 · qalam necha sm? chizg\'ich (Blok 7 · 🟡)', C: Amaliyot14 },
  { id: '15', label: '15. Saralash', full: 'P10 · doira/kvadrat savatlarga (Blok 7 · 🟡)', C: Amaliyot15 },
  { id: '16', label: '16. Ikki qadam', full: 'P25 · 4+3, keyin −2 (Blok 6 · 🔴)', C: Amaliyot16 },
  { id: '17', label: '17. Topib bos', full: 'P11 · barcha doiralarni top (Blok 7 · 🟢)', C: Amaliyot17 },
  { id: '18', label: '18. Bo\'sh joy', full: 'P5 · 2 3 4 _ 6 7 (Blok 1 · 🟡)', C: Amaliyot18 },
  { id: '19', label: '19. O\'nliklab', full: 'P23 · 20 30 _ 50 (Blok 5 · 🟡)', C: Amaliyot19 },
  { id: '20', label: '20. Qaysi amal', full: 'P14 · qo\'shish yoki ayirish? (Blok 6 · 🟡)', C: Amaliyot20 },
  { id: '21', label: '21. Ortiqcha', full: 'P18 · ortiqchani top (razogrev · 🟡)', C: Amaliyot21 },
  { id: '22', label: '22. To\'g\'ri/noto\'g\'ri', full: 'P12 · 6 + 2 = 9? (Blok 1 · 🟢)', C: Amaliyot22 },
  { id: '23', label: '23. Yechimni tuz', full: 'P15 · 4 + 2 = 6 fishkalardan (Blok 6 · 🟡)', C: Amaliyot23 },
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>1-sinf amaliyot namunalari (23 ta · mexanika oilalari)</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {item.label}
          </button>
        ))}
      </div>

      <PracticeHost key={q.id} Question={q.C} title={q.full} />
    </div>
  );
}
