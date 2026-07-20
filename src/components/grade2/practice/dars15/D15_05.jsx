// Dars 15 · Amaliyot 05 — mustaqil jsx-question (per-task split).
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
/* ============================== JUPITER SCENE (panellar · ×4/×5) ============================== */
const Panel = ({ s = 18, delay = 0 }) => (
  <span className="px-drop" style={{ width:s, height:s, borderRadius:4, display:'inline-block', background:'linear-gradient(150deg,#7fd0ff,#2f7fc4 60%,#1c568f)', border:'1px solid #a9e0ff', boxShadow:'0 0 5px rgba(127,208,255,.5)', animationDelay:delay+'s' }} />
);
const GroupsViz = ({ n, k, s = 17 }) => (
  <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
    {Array.from({ length:n }).map((_,gi)=>(
      <div key={gi} style={{ display:'grid', gridTemplateColumns:`repeat(${k>3?Math.ceil(k/2):k}, ${s}px)`, gap:4, padding:'6px 7px', border:'1.5px solid '+C.ring, borderRadius:10, background:'rgba(127,208,255,.10)' }}>
        {Array.from({ length:k }).map((_,i)=><Panel key={i} s={s} delay={(gi*k+i)*0.03} />)}
      </div>
    ))}
  </div>
);
const GCap = ({ text }) => (<div style={{ textAlign:'center', marginTop:8, fontSize:13.5, fontWeight:700, color:C.goldSoft }}>{text}</div>);
const groups = (n,k)=>((t)=>(<div><GroupsViz n={n} k={k} /><GCap text={t.scene} /></div>));
/* ---- Dars15 uchun qo'shimcha usullar: raqamdan yasash + To'g'ri/Noto'g'ri ---- */
function makeBuildNum(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review'; const cells = cfg.cells;
    const [built,setBuilt]=useState(''),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ if(initialAnswer?.studentAnswer?.value!=null){ setBuilt(String(initialAnswer.studentAnswer.value)); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(built.length===cells && !checked); },[built,checked,onReady,cells]);
    const tap=(d)=>{ if(isReview||checked) return; setBuilt((b)=> b.length>=cells? b : b+d); };
    const back=()=>{ if(isReview||checked) return; setBuilt((b)=>b.slice(0,-1)); };
    const check=useCallback(()=>{ const correct = built!=='' && Number(built)===cfg.answer; setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:cfg.digits.map((d,i)=>({id:String(i),label:d})), studentAnswer:{value:built===''?null:Number(built)}, correctAnswer:{value:cfg.answer}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[built,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    const tone = checked?(fb?.correct?'ok':'no'):'idle';
    const cBd = tone==='ok'?C.ok:tone==='no'?C.no:C.acc, cCol = tone==='ok'?C.ok:tone==='no'?C.no:C.ink, cBg = tone==='ok'?C.okSoft:tone==='no'?C.noSoft:C.accSoft;
    return (<div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {cfg.stage && <Stage>{cfg.stage(t)}</Stage>}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <div style={{ display:'flex', gap:10 }}>
          {Array.from({ length:cells }).map((_,i)=>(<div key={i} style={{ width:56, height:66, borderRadius:12, border:'2px solid '+(built[i]?cBd:C.line), background:built[i]?cBg:C.paper, display:'flex', alignItems:'center', justifyContent:'center', ...S.mono, fontSize:32, fontWeight:800, color:cCol }}>{built[i]||''}</div>))}
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
          {cfg.digits.map((d,i)=>(<button key={i} type="button" disabled={isReview||checked} onClick={()=>tap(d)} style={{ width:58, height:56, borderRadius:13, border:'2px solid '+C.line, background:C.paper, ...S.mono, fontSize:24, fontWeight:800, color:C.ink, cursor:(isReview||checked)?'default':'pointer' }}>{d}</button>))}
          <button type="button" disabled={isReview||checked} onClick={back} style={{ width:58, height:56, borderRadius:13, border:'2px solid '+C.line, background:C.paper, ...S.mono, fontSize:20, fontWeight:800, color:C.no, cursor:(isReview||checked)?'default':'pointer' }}>⌫</button>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>);
  }
  return Comp;
}
/* ===== 05 · buildnum · raqamlardan yasash · buildnum ===== */
const D05 = makeBuildNum({ tag:'buildnum', level:'🟡', answer:30, cells:2, digits:['3','0','5','2'], stage:groups(6,5) });

D05.T = {
  uz: { eyebrow:'×5 · javob', setup:'6 guruh, har birida 5 tadan panel.', scene:'6 × 5', ask:'6 × 5 = ? Javobni raqamlardan yasang.',
    correct:"To'g'ri. 6 × 5 = 30. 5 tadan olti marta.", wrong:'5 tadan sanang: 5, 10, 15, 20, 25, … Olti qadam. Oxiri 0 yoki 5.', rule:'6 × 5 = 30.' },
  ru: { eyebrow:'×5 · ответ', setup:'6 групп по 5 панелей.', scene:'6 × 5', ask:'6 × 5 = ? Составь ответ из цифр.',
    correct:'Верно. 6 × 5 = 30. По 5 шесть раз.', wrong:'Считай по 5: 5, 10, 15, 20, 25, … Шесть шагов.', rule:'6 × 5 = 30.' },
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

export default function D15_05(props) {
  return (<><style>{FX_CSS}</style><D05 {...props} /></>);
}
