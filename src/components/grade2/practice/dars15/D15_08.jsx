// Dars 15 · Amaliyot 08 — mustaqil jsx-question (per-task split).
// Kontrakt: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== CORE ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)', stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  gold: '#FFC23C', goldSoft: '#FFD873', leaf: '#7CE0A3', leaf2: '#3Fb572',
};
const STARS = [[8,18,0],[22,9,1.1],[37,26,.5],[52,12,1.7],[68,20,.8],[81,10,2.1],[91,30,1.3],[14,40,1.9],[46,44,.6],[63,38,1.4],[77,46,2.3],[30,54,1],[88,52,.4],[6,62,1.6]];
const Stage = ({ children, style }) => (
  <div style={{ position:'relative', overflow:'hidden', background:C.stage, border:'1px solid '+C.stageBd, borderRadius:16, padding:'12px 10px', margin:'10px 0', ...style }}>
    <div aria-hidden="true" style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
      {STARS.map((s,i)=><span key={i} className="px-star" style={{ position:'absolute', left:s[0]+'%', top:s[1]+'%', width:i%4===0?3:2, height:i%4===0?3:2, borderRadius:'50%', background:'#dbe7ff', animationDelay:s[2]+'s' }} />)}
    </div>
    <div style={{ position:'relative' }}>{children}</div>
  </div>
);
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
function makeTrueFalse(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const [picked,setPicked]=useState(null),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ if(initialAnswer?.studentAnswer?.value!=null){ setPicked(initialAnswer.studentAnswer.value?'t':'f'); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(picked!=null && !checked); },[picked,checked,onReady]);
    const check=useCallback(()=>{ const val=picked==='t'; const correct=val===cfg.answer; setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:[{id:'t',label:t.yes},{id:'f',label:t.no}], studentAnswer:{value:val}, correctAnswer:{value:cfg.answer}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[picked,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    const mkBtn=(key,label)=>{ const on=picked===key, show=checked&&on; let bd=C.line,bg=C.paper,col=C.ink;
      if(on){ bd=C.acc; bg=C.accSoft; } if(show){ const ok=(key==='t')===cfg.answer; bd=ok?C.ok:C.no; bg=ok?C.okSoft:C.noSoft; col=ok?C.ok:C.no; }
      return <button key={key} type="button" disabled={isReview||checked} onClick={()=>setPicked(key)} style={{ flex:'1 1 45%', padding:'20px 14px', borderRadius:14, border:'2px solid '+bd, background:bg, color:col, fontSize:20, fontWeight:800, cursor:(isReview||checked)?'default':'pointer', minHeight:66 }}>{label}</button>;
    };
    return (<div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {cfg.stage && <Stage>{cfg.stage(t)}</Stage>}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display:'flex', gap:10 }}>{mkBtn('t',t.yes)}{mkBtn('f',t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>);
  }
  return Comp;
}
/* ===== 08 · truefalse · To'g'ri/Noto'g'ri · truefalse ===== */
const D08 = makeTrueFalse({ tag:'truefalse', level:'🟢', answer:false,
  stage:(t)=>(<div style={{ textAlign:'center', ...S.mono, fontSize:38, fontWeight:800, color:C.gold }}>4 × 5 = 25</div>) });

D08.T = {
  uz: { eyebrow:"To'g'ri yoki noto'g'ri", setup:'Yozuvni tekshiring.', ask:"4 × 5 = 25 — bu to'g'rimi?", yes:"To'g'ri", no:"Noto'g'ri",
    correct:"To'g'ri javob: Noto'g'ri. 4 × 5 = 20, 25 emas.", wrong:"4 tadan… yo'q, 5 tadan to'rt marta sanang: 5, 10, 15, 20. 25 chiqadimi?", rule:"4 × 5 = 20 (25 emas) — yozuv noto'g'ri." },
  ru: { eyebrow:'Верно или неверно', setup:'Проверь запись.', ask:'4 × 5 = 25 — это верно?', yes:'Верно', no:'Неверно',
    correct:'Правильный ответ: Неверно. 4 × 5 = 20, а не 25.', wrong:'Считай по 5 четыре раза: 5, 10, 15, 20. Получается 25?', rule:'4 × 5 = 20 (не 25) — запись неверна.' },
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

export default function D15_08(props) {
  return (<><style>{FX_CSS}</style><D08 {...props} /></>);
}
