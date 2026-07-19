// Dars 15 · Amaliyot 02 — mustaqil jsx-question (per-task split).
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
// Multiselect (choose all that apply). green=correct pick, red=wrong pick after check.
function makeMultiselect(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const [sel,setSel]=useState([]),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ const sa=initialAnswer?.studentAnswer; if(sa?.sel){ setSel(sa.sel); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(sel.length>0 && !checked); },[sel,checked,onReady]);
    const toggle = (i)=>{ if(isReview||checked) return; setSel((s)=>s.includes(i)?s.filter((x)=>x!==i):[...s,i]); };
    const check = useCallback(()=>{ const want = t.opts.map((o,i)=>o.ok?i:-1).filter((x)=>x>=0); const correct = sel.length===want.length && want.every((i)=>sel.includes(i)); setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:t.opts.map((o,i)=>({id:String(i),label:o.label})), studentAnswer:{sel}, correctAnswer:{sel:want}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[sel,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    const box = (o,i)=>{ const on = sel.includes(i); let bd=C.line,bg=C.paper,col=C.ink;
      if(on){ bd=C.acc; bg=C.accSoft; } if(checked&&on){ bd=o.ok?C.ok:C.no; bg=o.ok?C.okSoft:C.noSoft; col=o.ok?C.ok:C.no; }
      return (<button key={i} type="button" disabled={isReview||checked} onClick={()=>toggle(i)} style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'14px 15px', borderRadius:13, border:'2px solid '+bd, background:bg, color:col, ...S.mono, fontSize:20, fontWeight:800, cursor:(isReview||checked)?'default':'pointer', marginBottom:9 }}>
        <span style={{ width:24, height:24, borderRadius:7, border:'2px solid '+(on?bd:C.ink3), background:on?bd:'#fff', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{on?'✓':''}</span>
        {o.label}
      </button>); };
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        {cfg.stage && <Stage>{cfg.stage(t,{sel,checked})}</Stage>}
        <p style={S.ask}>{t.ask}</p>
        {t.opts.map((o,i)=>box(o,i))}
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
}
/* ===== 02 · pattern5 · multiselect · pattern5 ===== */
const D02 = makeMultiselect({ tag:'pattern5', level:'🟡' });

D02.T = {
  uz: { eyebrow:'×5 naqshi', setup:"5 ga ko'paytmaning oxiri doim 0 yoki 5 bo'ladi.", ask:"Qaysi sonlar 5 ga ko'paytma bo'la oladi? 2 tasini belgilang:",
    opts:[{ label:'15', ok:true }, { label:'20', ok:true }, { label:'18', ok:false }, { label:'22', ok:false }],
    correct:"To'g'ri. 15 = 5 × 3, 20 = 5 × 4 — oxiri 5 va 0. 18, 22 mos emas.", wrong:"Oxirgi raqamga qarang: 5 ga ko'paytmaning oxiri 0 yoki 5.", rule:'×5 oxiri 0 yoki 5: 15, 20 mos; 18, 22 emas.' },
  ru: { eyebrow:'Признак ×5', setup:'Произведение на 5 всегда оканчивается на 0 или 5.', ask:'Какие числа могут быть произведением на 5? Отметь 2:',
    opts:[{ label:'15', ok:true }, { label:'20', ok:true }, { label:'18', ok:false }, { label:'22', ok:false }],
    correct:'Верно. 15 = 5 × 3, 20 = 5 × 4 — на 5 и 0. 18, 22 — нет.', wrong:'Смотри на последнюю цифру: у ×5 она 0 или 5.', rule:'×5 оканчивается на 0 или 5: 15, 20 — да; 18, 22 — нет.' },
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

export default function D15_02(props) {
  return (<><style>{FX_CSS}</style><D02 {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D15_02.audio = {
  uz: { intro: "5 ga ko'paytmaning oxiri doim 0 yoki 5 bo'ladi. Qaysi sonlar 5 ga ko'paytma bo'la oladi? 2 tasini belgilang.", on_correct: "To'g'ri. 15 teng 5 ko'paytirish 3, 20 teng 5 ko'paytirish 4, oxiri 5 va 0. 18, 22 mos emas.", on_wrong: "Oxirgi raqamga qarang. 5 ga ko'paytmaning oxiri 0 yoki 5." },
  ru: { intro: "Произведение на 5 всегда оканчивается на 0 или 5. Какие числа могут быть произведением на 5? Отметь 2.", on_correct: "Верно. 15 равно 5 умножить на 3, 20 равно 5 умножить на 4, на 5 и 0. 18, 22, нет.", on_wrong: "Смотри на последнюю цифру. У умножить на 5 она 0 или 5." },
};
