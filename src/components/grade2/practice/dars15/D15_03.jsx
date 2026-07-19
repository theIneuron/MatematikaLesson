// Dars 15 · Amaliyot 03 — mustaqil jsx-question (per-task split).
// Kontrakt: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== CORE ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)', stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  gold: '#FFC23C', goldSoft: '#FFD873', leaf: '#7CE0A3', leaf2: '#3Fb572',
};
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const S = {
  wrap: { maxWidth:640, margin:'0 auto', padding:'4px 2px 8px' },
  eyebrow: { fontSize:12, fontWeight:800, letterSpacing:'.04em', color:C.acc, textTransform:'uppercase' },
  setup: { fontSize:16, lineHeight:1.5, margin:'6px 0 12px', color:'#374151' },
  ask: { fontSize:17, fontWeight:700, margin:'14px 0 12px', color:C.ink },
  mono: { fontFamily:"'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginTop:16, padding:'13px 15px', borderRadius:14, fontSize:15, lineHeight:1.45, fontWeight:600, background: ok?C.okSoft:C.noSoft, color: ok?C.ok:C.no }}>
    {ok ? <IconOk/> : <IconNo/>}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="px-pop" style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, padding:'10px 13px', borderRadius:12, fontSize:13.5, fontWeight:700, background:'#FFF6E9', border:'1.5px solid #FFDFA6', color:'#B45309' }}>
    <span style={{ fontSize:15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) { const ref = useRef(check); ref.current = check; useEffect(()=>{ registerCheck?.(()=>ref.current()); }, [registerCheck]); }
// Match pairs: tap a left item, then a right item to connect. All pairs must match.
function makeMatch(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const [pairs,setPairs]=useState({}); const [activeL,setActiveL]=useState(null);
    const [fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ const sa=initialAnswer?.studentAnswer; if(sa?.pairs){ setPairs(sa.pairs); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    const nL = t.left.length;
    useEffect(()=>{ onReady?.(Object.keys(pairs).length===nL && !checked); },[pairs,checked,onReady,nL]);
    const tapL = (i)=>{ if(isReview||checked) return; setActiveL(i===activeL?null:i); };
    const tapR = (j)=>{ if(isReview||checked||activeL==null) return; setPairs((p)=>{ const np={...p}; Object.keys(np).forEach((k)=>{ if(np[k]===j) delete np[k]; }); np[activeL]=j; return np; }); setActiveL(null); };
    const check = useCallback(()=>{ const correct = t.left.every((l,i)=>pairs[i]===l.match); setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:t.left.map((l,i)=>({id:String(i),label:l.label})), studentAnswer:{pairs}, correctAnswer:{pairs:Object.fromEntries(t.left.map((l,i)=>[i,l.match]))}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[pairs,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    const palette = ['#FFC23C','#5BD6F2','#7CE0A3','#FF9A6B'];
    const colorForL = (i)=> (pairs[i]!=null ? palette[i%palette.length] : null);
    const colorForR = (j)=>{ const li = Object.keys(pairs).find((k)=>pairs[k]===j); return li!=null ? palette[Number(li)%palette.length] : null; };
    const lStyle = (i)=>{ const c=colorForL(i); const act=activeL===i; let bd=act?C.acc:(c||C.line), bg=act?C.accSoft:(c?c+'22':C.paper), col=C.ink;
      if(checked){ const okp=pairs[i]===t.left[i].match; bd=okp?C.ok:C.no; bg=okp?C.okSoft:C.noSoft; col=okp?C.ok:C.no; }
      return { width:'100%', padding:'13px 12px', borderRadius:12, border:'2px solid '+bd, background:bg, color:col, ...S.mono, fontSize:19, fontWeight:800, cursor:(isReview||checked)?'default':'pointer', marginBottom:8, minHeight:52 }; };
    const rStyle = (j)=>{ const c=colorForR(j); let bd=c||C.line, bg=c?c+'22':C.paper, col=C.ink;
      return { width:'100%', padding:'13px 12px', borderRadius:12, border:'2px '+(c?'solid':'dashed')+' '+bd, background:bg, color:col, ...S.mono, fontSize:19, fontWeight:800, cursor:(isReview||checked||activeL==null)?'default':'pointer', marginBottom:8, minHeight:52 }; };
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        <p style={S.ask}>{t.ask}</p>
        <div style={{ display:'flex', gap:14 }}>
          <div style={{ flex:1 }}>{t.left.map((l,i)=><button key={i} type="button" disabled={isReview||checked} onClick={()=>tapL(i)} style={lStyle(i)}>{l.label}</button>)}</div>
          <div style={{ flex:1 }}>{t.right.map((r,j)=><button key={j} type="button" disabled={isReview||checked||activeL==null} onClick={()=>tapR(j)} style={rStyle(j)}>{r}</button>)}</div>
        </div>
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
}
/* ===== 03 · match45 · match · match45 ===== */
const D03 = makeMatch({ tag:'match45', level:'🟡' });

D03.T = {
  uz: { eyebrow:'Juftlab ulash', setup:"Har ko'paytirishni javobiga ulang.", ask:"Chapdagini bosing, so'ng o'ngdan mos javobni tanlang:",
    left:[{ label:'4 × 4', match:1 }, { label:'3 × 5', match:0 }, { label:'5 × 5', match:2 }],
    right:['15','16','25'],
    correct:"To'g'ri. 4 × 4 = 16; 3 × 5 = 15; 5 × 5 = 25.", wrong:'Har birini sanang: 4 tadan yoki 5 tadan. Mos javobni toping.', rule:'4 × 4 = 16, 3 × 5 = 15, 5 × 5 = 25.' },
  ru: { eyebrow:'Соедини пары', setup:'Соедини каждое умножение с ответом.', ask:'Нажми слева, затем выбери ответ справа:',
    left:[{ label:'4 × 4', match:1 }, { label:'3 × 5', match:0 }, { label:'5 × 5', match:2 }],
    right:['15','16','25'],
    correct:'Верно. 4 × 4 = 16; 3 × 5 = 15; 5 × 5 = 25.', wrong:'Посчитай каждое: по 4 или по 5. Найди ответ.', rule:'4 × 4 = 16, 3 × 5 = 15, 5 × 5 = 25.' },
};

const FX_CSS = `
        .tabs { display:flex; gap:6px; overflow-x:auto; padding:8px 10px; border-bottom:1px solid #eef0f4; }
        .tabs::-webkit-scrollbar { display:none; }
        .tab { flex:0 0 auto; padding:7px 11px; border-radius:999px; font-size:12.5px; font-weight:700; white-space:nowrap; cursor:pointer; border:1.5px solid #e5e7eb; background:#fff; color:#6b7280; min-height:34px; }
        .tab.on { border-color:#0E0E10; background:#0E0E10; color:#fff; }
        .tab.ok { border-color:#1F7A4D; color:#1F7A4D; }
        .tab.on.ok { background:#1F7A4D; border-color:#1F7A4D; color:#fff; }
        .px-pop { animation: pxpop .4s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes pxpop { 0% { opacity:0; transform:scale(.3); } 100% { opacity:1; transform:scale(1); } }
        .px-star { opacity:.35; animation: pxtw 3.2s ease-in-out infinite; }
        @keyframes pxtw { 0%,100% { opacity:.18; transform:scale(1); } 50% { opacity:.95; transform:scale(1.6); } }
        .px-drop { animation: pxdrop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes pxdrop { 0% { opacity:0; transform:translateY(-6px) scale(.4); } 100% { opacity:1; transform:scale(1); } }
        .px-float { animation: pxfloat 3s ease-in-out infinite; }
        @keyframes pxfloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
        .px-pulse { animation: pxpulse 1.5s ease-in-out infinite; }
        @keyframes pxpulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation:none !important; transition:none !important; } }
      `;

export default function D15_03(props) {
  return (<><style>{FX_CSS}</style><D03 {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D15_03.audio = {
  uz: { intro: "Har ko'paytirishni javobiga ulang. Chapdagini bosing, so'ng o'ngdan mos javobni tanlang.", on_correct: "To'g'ri. 4 ko'paytirish 4 teng 16; 3 ko'paytirish 5 teng 15; 5 ko'paytirish 5 teng 25.", on_wrong: "Har birini sanang. 4 tadan yoki 5 tadan. Mos javobni toping." },
  ru: { intro: "Соедини каждое умножение с ответом. Нажми слева, затем выбери ответ справа.", on_correct: "Верно. 4 умножить на 4 равно 16; 3 умножить на 5 равно 15; 5 умножить на 5 равно 25.", on_wrong: "Посчитай каждое. По 4 или по 5. Найди ответ." },
};
