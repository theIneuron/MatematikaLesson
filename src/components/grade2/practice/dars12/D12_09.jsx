// Dars 12 · Amaliyot 09 — mustaqil jsx-question (per-task split).
// Kontrakt: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== CORE ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 58% 24%, #7a4231 0%, #431f15 60%, #260f09 100%)', stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
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
// Find-wrong. Pick the one wrong row; on correct answer reveal ✓/✗ badges (allowed for find-wrong).
function makeFindwrong(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const [picked,setPicked]=useState(null),[fb,setFb]=useState(null),[checked,setChecked]=useState(false),[reveal,setReveal]=useState(false);
    const timer = useRef(null); useEffect(()=>()=>clearTimeout(timer.current),[]);
    useEffect(()=>{ if(initialAnswer?.studentAnswer?.idx!=null){ setPicked(initialAnswer.studentAnswer.idx); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); setReveal(!!initialAnswer.correct); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(picked!=null && !checked); },[picked,checked,onReady]);
    const rows = t.rows; const correctIdx = rows.findIndex((r)=>!r.ok);
    const check = useCallback(()=>{ const correct = picked===correctIdx; setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.(); if(correct) timer.current=setTimeout(()=>setReveal(true),400);
      onSubmit?.({ questionText:t.ask, options:rows.map((r,i)=>({id:String(i),label:r.txt})), studentAnswer:{idx:picked}, correctAnswer:{idx:correctIdx}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[picked,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    const rowStyle = (i)=>{ const on=picked===i, show=checked&&on; let bg=C.paper,bd=C.line,col='#374151';
      if(on){ bg=C.accSoft; bd=C.acc; col=C.ink; } if(show){ const ok=i===correctIdx; bg=ok?C.okSoft:C.noSoft; bd=ok?C.ok:C.no; col=ok?C.ok:C.no; }
      return { display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, width:'100%', padding:'15px 15px', borderRadius:13, border:'2px solid '+bd, background:bg, color:col, fontSize:21, fontWeight:800, cursor:(isReview||checked)?'default':'pointer', marginBottom:9, ...S.mono, minHeight:56 }; };
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        <p style={S.ask}>{t.ask}</p>
        {rows.map((r,i)=>(
          <button key={i} type="button" style={rowStyle(i)} disabled={isReview||checked} onClick={()=>setPicked(i)}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
              <span style={{ width:24, height:24, borderRadius:'50%', background:cfg.colors[i], color:'#16223c', fontSize:13, fontWeight:800, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{i+1}</span>
              <span>{r.txt}</span>
            </span>
            {reveal && !r.ok && <span className="px-pop" style={{ fontSize:15, fontWeight:800, color:C.no }}>✗</span>}
            {reveal && r.ok && <span className="px-pop" style={{ fontSize:16, color:C.ok }}>✓</span>}
          </button>
        ))}
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
}
/* ===== 09 · findtrap · findwrong · findtrap · XATONI TOPISH ===== */
const D09 = makeFindwrong({ tag:'findtrap', level:'🟡', colors:['#FFC23C','#5BD6F2','#7CE0A3','#FF9A6B'] });

D09.T = {
  uz: { eyebrow:'Xatoni top', setup:"To'rt xil masala yechilgan, bittasi noto'g'ri hisoblangan.", ask:"Noto'g'ri hisoblangan qatorni toping.",
    rows:[{ txt:'40 − 10 + 5 = 35', ok:true }, { txt:'30 + 20 − 15 = 35', ok:true }, { txt:'50 − 20 + 10 = 40', ok:true }, { txt:'25 + 25 − 10 = 30', ok:false }],
    correct:"To'g'ri. 25 + 25 − 10 = 40 bo'lishi kerak, 30 emas.", wrong:'Har birini ikki amalda tekshiring: avval chapdan, keyin natijaga.', rule:'25 + 25 = 50, 50 − 10 = 40 (30 emas).' },
  ru: { eyebrow:'Найди ошибку', setup:'Решены четыре задачи, одна посчитана неверно.', ask:'Найди строку с неверным ответом.',
    rows:[{ txt:'40 − 10 + 5 = 35', ok:true }, { txt:'30 + 20 − 15 = 35', ok:true }, { txt:'50 − 20 + 10 = 40', ok:true }, { txt:'25 + 25 − 10 = 30', ok:false }],
    correct:'Верно. Должно быть 25 + 25 − 10 = 40, а не 30.', wrong:'Проверь каждую в два действия: сначала слева, потом к результату.', rule:'25 + 25 = 50, 50 − 10 = 40 (не 30).' },
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

export default function D12_09(props) {
  return (<><style>{FX_CSS}</style><D09 {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D12_09.audio = {
  uz: { intro: "To'rt xil masala yechilgan, bittasi noto'g'ri hisoblangan. Noto'g'ri hisoblangan qatorni toping.", on_correct: "To'g'ri. 25 qo'shish 25 ayirish 10 teng 40 bo'lishi kerak, 30 emas.", on_wrong: "Har birini ikki amalda tekshiring. Avval chapdan, keyin natijaga." },
  ru: { intro: "Решены четыре задачи, одна посчитана неверно. Найди строку с неверным ответом.", on_correct: "Верно. Должно быть 25 плюс 25 минус 10 равно 40, а не 30.", on_wrong: "Проверь каждую в два действия. Сначала слева, потом к результату." },
};
