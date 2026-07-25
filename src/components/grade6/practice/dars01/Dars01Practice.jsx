import { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../../../grade5/practice/PracticeHost.jsx';
import D01_01 from './D01_01.jsx';
import D01_02 from './D01_02.jsx';
import D01_03 from './D01_03.jsx';
import D01_04 from './D01_04.jsx';
import D01_05 from './D01_05.jsx';
import D01_06 from './D01_06.jsx';
import D01_07 from './D01_07.jsx';
import D01_08 from './D01_08.jsx';
import D01_09 from './D01_09.jsx';
import D01_10 from './D01_10.jsx';

const ITEMS = [
  { id: '01', label: 'Tanlash', level: 'Oson', color: '#06b6d4', C: D01_01 },
  { id: '02', label: "Fikr", level: 'Oson', color: '#14b8a6', C: D01_02 },
  { id: '03', label: 'Bo‘sh katak', level: 'Oson', color: '#f59e0b', C: D01_03 },
  { id: '04', label: 'Guruhlash', level: 'Oson', color: '#14b8a6', C: D01_04 },
  { id: '05', label: 'Moslashtirish', level: "O‘rta", color: '#06b6d4', C: D01_05 },
  { id: '06', label: 'Saralash', level: "O‘rta", color: '#f59e0b', C: D01_06 },
  { id: '07', label: 'Juftliklar', level: "O‘rta", color: '#06b6d4', C: D01_07 },
  { id: '08', label: 'Xatoni top', level: 'Qiyin', color: '#14b8a6', C: D01_08 },
  { id: '09', label: 'Yashirin son', level: 'Qiyin', color: '#14b8a6', C: D01_09 },
  { id: '10', label: 'Final missiya', level: 'Qiyin', color: '#f59e0b', C: D01_10 },
];

const TITLE = "Dars 1 · Bo‘luvchilar va karrali sonlar";

export default function Dars01Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const item = ITEMS[idx];

  return (
    <div className="g6p-root">
      <style>{`
        .g6p-root{position:fixed;inset:0;overflow:hidden;background:#fff7ed;display:flex;flex-direction:column;
          zoom:var(--pqz,1);font-family:'Manrope',system-ui,-apple-system,sans-serif}
        .g6p-tabs{flex:none;display:grid;grid-template-columns:repeat(10,minmax(36px,1fr));gap:5px;align-items:center;
          padding:48px 10px 7px;background:#fff7ed;border-bottom:1px solid #fed7aa}
        .g6p-tab{min-width:0;border-radius:999px;padding:6px 7px;font:700 11px inherit;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .g6p-host{flex:1;min-height:0;overflow:hidden}
        .g6p-host>div{height:100%;min-height:0!important;background:#fff7ed}
        .g6p-host>div>div{background:#fff7ed!important}
        .g6p-host>div>div:nth-child(2){min-height:0;overflow:hidden;padding:7px 12px!important}
        .g6p-host>div>div:last-child{padding:7px 12px!important}
        @media(max-width:900px){.g6p-tab span{display:none}}
        @media(max-width:639.98px){.g6p-root{width:390px}.g6p-tabs{padding-top:45px;grid-template-columns:repeat(10,1fr);gap:3px}.g6p-tab{padding:6px 2px;font-size:10px}}
      `}</style>
      <div className="g6p-tabs" aria-label="Topshiriqlar">
        {ITEMS.map((x, i) => {
          const active = i === idx;
          return (
            <button key={x.id} type="button" className="g6p-tab" onClick={() => setIdx(i)}
              style={{
                color: active ? '#334155' : '#64748b', background: active ? `${x.color}28` : '#fff',
                border: `1.5px solid ${active ? x.color : '#dbe2ea'}`,
                boxShadow: active ? `0 4px 12px ${x.color}25` : 'none',
              }}>
              {i + 1}<span>. {x.label} · {x.level}</span>
            </button>
          );
        })}
      </div>
      <div className="g6p-host">
        <PracticeHost key={item.id} Question={item.C} title={TITLE} />
      </div>
    </div>
  );
}
