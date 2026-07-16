// Amaliyot namunalari — 7 format bo'yicha 10 ta namuna mashq (bitta sahifa, chiplar).
// Mustaqil: chip-navigatsiya + PracticeHost (UZ/RU + Tekshirish).
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
import Amaliyot26 from './Amaliyot26.jsx';
import Amaliyot27 from './Amaliyot27.jsx';

const ITEMS = [
  { id: '01', label: '1. Tekstli', full: 'Amaliyot 1 — tekstli masala (B1)', C: Amaliyot01 },
  { id: '02', label: '2. Foiz', full: 'Amaliyot 2 — chegirma % (B4)', C: Amaliyot02 },
  { id: '03', label: '3. Mantiqiy', full: 'Amaliyot 3 — qonuniyat', C: Amaliyot03 },
  { id: '04', label: "4. Mini-o'yin", full: 'Amaliyot 4 — kasr qisqartirish (B2)', C: Amaliyot04 },
  { id: '05', label: '5. Jadval', full: 'Amaliyot 5 — chek + foiz (B4)', C: Amaliyot05 },
  { id: '06', label: '6. Klassifikatsiya', full: 'Amaliyot 6 — kasr turlari (B3)', C: Amaliyot06 },
  { id: '07', label: '7. Birliklar', full: 'Amaliyot 7 — sm/sm²/sm³ (B5)', C: Amaliyot07 },
  { id: '08', label: '8. Vizual', full: 'Amaliyot 8 — kasr va ½ (B2)', C: Amaliyot08 },
  { id: '09', label: '9. Yuza', full: "Amaliyot 9 — to'rtburchak yuzasi (B5)", C: Amaliyot09 },
  { id: '10', label: '10. Oshxona', full: 'Amaliyot 10 — retsept (B3)', C: Amaliyot10 },
  { id: '11', label: '11. Sonlar nuri', full: 'Amaliyot 11 — sonlar nurida nuqta · interaktiv (B1)', C: Amaliyot11 },
  { id: '12', label: '12. Kasr fabrikasi', full: "Amaliyot 12 — 3/4 ni yig'ish · interaktiv (B2)", C: Amaliyot12 },
  { id: '13', label: '13. Xona dizayneri', full: 'Amaliyot 13 — yuza + perimetr · interaktiv (B5)', C: Amaliyot13 },
  { id: '14', label: '14. Sonlar konstruktori', full: "Amaliyot 14 — razryaddan sonni yig'ish · interaktiv (B1)", C: Amaliyot14 },
  { id: '15', label: '15. Kasr solishtirish', full: 'Amaliyot 15 — polosa-model + >/=/< (B2)', C: Amaliyot15 },
  { id: '16', label: '16. Yaxlitlash', full: 'Amaliyot 16 — nurda mingga yaxlitlash · interaktiv (B1)', C: Amaliyot16 },
  { id: '17', label: '17. Daraja', full: 'Amaliyot 17 — kub 4³ (B1)', C: Amaliyot17 },
  { id: '18', label: "18. Kasr qo'shish", full: 'Amaliyot 18 — 1/2 + 1/3 har xil maxraj (B3)', C: Amaliyot18 },
  { id: '19', label: '19. Aralash son', full: "Amaliyot 19 — 7/4 → 1 3/4 o'tkazish (B3)", C: Amaliyot19 },
  { id: '20', label: "20. O'nli solishtirish", full: 'Amaliyot 20 — 0,45 va 0,5 (B4)', C: Amaliyot20 },
  { id: '21', label: "21. Столбик +", full: "Amaliyot 21 — ustunda qo'shish (perenos) · interaktiv (B1)", C: Amaliyot21 },
  { id: '22', label: '22. Foiz-setka', full: "Amaliyot 22 — 35% ni bo'yash · interaktiv (B4)", C: Amaliyot22 },
  { id: '23', label: '23. Uchburchak yuzasi', full: 'Amaliyot 23 — ½·asos·balandlik (B5)', C: Amaliyot23 },
  { id: '24', label: '24. Hajm — kubiklar', full: 'Amaliyot 24 — 3×2×4 · interaktiv (B5)', C: Amaliyot24 },
  { id: '25', label: '25. Столбик −', full: 'Amaliyot 25 — ustunda ayirish (zaём) · interaktiv (B1)', C: Amaliyot25 },
  { id: '26', label: '26. Столбик ×', full: "Amaliyot 26 — ustunda ko'paytirish · interaktiv (B1)", C: Amaliyot26 },
  { id: '27', label: "27. Столбик ÷", full: "Amaliyot 27 — burchak usulida bo'lish · interaktiv (B1)", C: Amaliyot27 },
];

export default function PracticePreview() {
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#fe5b1a' : '#d6dae3'),
    background: active ? '#fe5b1a' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif", whiteSpace: 'nowrap',
  });

  return (
    <div style={{ width: '100%', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '10px 12px', borderBottom: '1px solid #eef0f4', marginBottom: 6,
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Amaliyot namunalari (27 ta format-namuna)</strong>
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
