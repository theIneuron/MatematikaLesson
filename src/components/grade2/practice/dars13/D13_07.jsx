// Dars 13 · Amaliyot 07 — mustaqil jsx-question (per-task split).
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
/* ===== 07 · findwrong_conv · findwrong · findwrong ===== */
const D07 = makeFindwrong({ tag:'findwrong', level:'🟡', colors:['#FFC23C','#5BD6F2','#7CE0A3','#FF9A6B'] });

D07.T = {
  uz: { eyebrow:'Xatoni top', setup:"To'rt ko'paytirish qo'shishga aylantirilgan, bittasi noto'g'ri.", ask:"Noto'g'ri aylantirilgan qatorni toping.",
    rows:[{ txt:'3 × 2 = 2 + 2 + 2', ok:true }, { txt:'2 × 4 = 4 + 4', ok:true }, { txt:'3 × 5 = 5 + 5 + 5', ok:true }, { txt:'4 × 2 = 2 + 2 + 2', ok:false }],
    correct:"To'g'ri. 4 × 2 = 2 + 2 + 2 + 2 (to'rt marta), uch marta emas.", wrong:"Har birida son necha marta qo'shilgan? Ko'paytuvchiga qarang.", rule:"4 × 2 — 2 ni to'rt marta: 2 + 2 + 2 + 2." },
  ru: { eyebrow:'Найди ошибку', setup:'Четыре умножения превращены в сложение, одно неверно.', ask:'Найди неверно превращённую строку.',
    rows:[{ txt:'3 × 2 = 2 + 2 + 2', ok:true }, { txt:'2 × 4 = 4 + 4', ok:true }, { txt:'3 × 5 = 5 + 5 + 5', ok:true }, { txt:'4 × 2 = 2 + 2 + 2', ok:false }],
    correct:'Верно. 4 × 2 = 2 + 2 + 2 + 2 (четыре раза), а не три.', wrong:'Сколько раз складывается число? Смотри на множитель.', rule:'4 × 2 — это 2 четыре раза: 2 + 2 + 2 + 2.' },
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

export default function D13_07(props) {
  return (<><style>{FX_CSS}</style><D07 {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D13_07.audio = {
  uz: { intro: "To'rt ko'paytirish qo'shishga aylantirilgan, bittasi noto'g'ri. Noto'g'ri aylantirilgan qatorni toping.", on_correct: "To'g'ri. 4 ko'paytirish 2 teng 2 qo'shish 2 qo'shish 2 qo'shish 2 to'rt marta, uch marta emas.", on_wrong: "Har birida son necha marta qo'shilgan? Ko'paytuvchiga qarang." },
  ru: { intro: "Четыре умножения превращены в сложение, одно неверно. Найди неверно превращённую строку.", on_correct: "Верно. 4 умножить на 2 равно 2 плюс 2 плюс 2 плюс 2 четыре раза, а не три.", on_wrong: "Сколько раз складывается число? Смотри на множитель." },
};
