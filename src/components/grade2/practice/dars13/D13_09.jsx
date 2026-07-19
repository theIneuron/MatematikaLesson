// Dars 13 · Amaliyot 09 — mustaqil jsx-question (per-task split).
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
function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = C.paper, bd = C.line, col = '#374151';
  if (on) { bg = C.accSoft; bd = C.acc; col = C.ink; }
  if (show) { const ok = i === correctIdx; bg = ok?C.okSoft:C.noSoft; bd = ok?C.ok:C.no; col = ok?C.ok:C.no; }
  return { flex: opts.half?'1 1 45%':undefined, display: opts.half?undefined:'block', width: opts.half?undefined:'100%',
    textAlign: opts.center?'center':'left', padding:'14px 14px', borderRadius:13, border:'2px solid '+bd,
    background:bg, color:col, fontSize: opts.fs||16, fontWeight:800, cursor:(isReview||checked)?'default':'pointer',
    marginBottom: opts.half?0:9, fontFamily: opts.mono?"'JetBrains Mono', monospace":'inherit', minHeight:66 };
}
/* ============================== FACTORIES ============================== */
// 4-option MC. reveal-fix: only the picked option is colored after check (correct NOT auto-revealed on wrong).
function makeMC(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const [picked,setPicked]=useState(null),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ if(initialAnswer?.studentAnswer?.idx!=null){ setPicked(initialAnswer.studentAnswer.idx); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(picked!=null && !checked); },[picked,checked,onReady]);
    const check = useCallback(()=>{ const correct = picked===cfg.correctIdx; setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:t.opts.map((l,i)=>({id:String(i),label:l})), studentAnswer:{idx:picked,label:t.opts[picked]}, correctAnswer:{idx:cfg.correctIdx,label:t.opts[cfg.correctIdx]}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[picked,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        {cfg.stage && <Stage>{cfg.stage(t,{picked,checked,fb})}</Stage>}
        <p style={S.ask}>{t.ask}</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:9 }}>
          {t.opts.map((o,i)=><button key={i} type="button" style={optStyle(picked,i,cfg.correctIdx,checked,isReview,{half:cfg.half!==false,center:true,mono:cfg.mono!==false,fs:cfg.fs||22})} disabled={isReview||checked} onClick={()=>setPicked(i)}>{o}</button>)}
        </div>
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
}
/* ============================== JUPITER SCENE (massiv/ko'chat) ============================== */
const Sprout = ({ s = 20, delay = 0 }) => (
  <span className="px-drop" style={{ width:s, height:s, borderRadius:'50% 50% 50% 0', transform:'rotate(45deg)', display:'inline-block', background:'radial-gradient(circle at 34% 30%, #b8f4cf, #3Fb572 62%, #2f8f57)', boxShadow:'0 0 5px rgba(63,181,114,.5)', animationDelay:delay+'s' }} />
);
// r qator × c ustun ko'chat massivi. hideCols: ustun sonini ko'rsatmaslik (faktor yashirin bo'lsa)
const ArrayDots = ({ r, c, gap = 7, s = 20 }) => (
  <div style={{ display:'flex', flexDirection:'column', gap, alignItems:'center' }}>
    {Array.from({ length:r }).map((_,ri)=>(
      <div key={ri} style={{ display:'flex', gap }}>
        {Array.from({ length:c }).map((_,ci)=><Sprout key={ci} s={s} delay={(ri*c+ci)*0.02} />)}
      </div>
    ))}
  </div>
);
// Yashirin faktor massivi:  r × ⬜ = total  (tanlangan variant katakka qo'yiladi)
const FactorViz = ({ r, c, total, val }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
    <ArrayDots r={r} c={c} s={18} />
    <div style={{ display:'flex', alignItems:'center', gap:8, ...S.mono, fontSize:28, fontWeight:800, color:C.sink }}>
      <span>{r}</span><span style={{ color:C.gold }}>×</span>
      <span style={{ minWidth:50, height:46, border:'2px '+(val!=null?'solid '+C.acc:'dashed '+C.gold), borderRadius:10, display:'inline-flex', alignItems:'center', justifyContent:'center', color: val!=null?'#fff':C.gold, background: val!=null?'rgba(255,79,40,.18)':C.stile }}>{val!=null?val:'⬜'}</span>
      <span style={{ color:C.gold }}>=</span><span>{total}</span>
    </div>
  </div>
);
/* ===== 09 · missing_factor · MC (variantli) · missing_factor ===== */
const D09 = makeMC({ tag:'missing_factor', level:'🔴', correctIdx:0, half:true, fs:24,
  stage:(t,st)=>(<FactorViz r={3} c={4} total={12} val={st.picked!=null?t.opts[st.picked]:null} />) });

D09.T = {
  uz: { eyebrow:"Yashirin ko'paytuvchi", setup:'Massivda 3 qator bor, jami 12 ta. Har qatorda nechta?', ask:"Yashirin ko'paytuvchini tanlang: 3 × ⬜ = 12.", opts:['4','3','6','5'],
    correct:"To'g'ri. 3 × 4 = 12. Har qatorda 4 tadan.", wrong:"Bir qatordagi ko'chatlarni sanang. 3 ni nechaga ko'paytirsak 12 bo'ladi?", rule:"3 × 4 = 12 → yashirin ko'paytuvchi 4." },
  ru: { eyebrow:'Скрытый множитель', setup:'В массиве 3 ряда, всего 12. Сколько в каждом ряду?', ask:'Выбери скрытый множитель: 3 × ⬜ = 12.', opts:['4','3','6','5'],
    correct:'Верно. 3 × 4 = 12. В каждом ряду по 4.', wrong:'Посчитай ростки в одном ряду. На что умножить 3, чтобы вышло 12?', rule:'3 × 4 = 12 → скрытый множитель 4.' },
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

export default function D13_09(props) {
  return (<><style>{FX_CSS}</style><D09 {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D13_09.audio = {
  uz: { intro: "Massivda 3 qator bor, jami 12 ta. Har qatorda nechta? Yashirin ko'paytuvchini tanlang. 3 ko'paytirish qancha teng 12.", on_correct: "To'g'ri. 3 ko'paytirish 4 teng 12. Har qatorda 4 tadan.", on_wrong: "Bir qatordagi ko'chatlarni sanang. 3 ni nechaga ko'paytirsak 12 bo'ladi?" },
  ru: { intro: "В массиве 3 ряда, всего 12. Сколько в каждом ряду? Выбери скрытый множитель. 3 умножить на сколько равно 12.", on_correct: "Верно. 3 умножить на 4 равно 12. В каждом ряду по 4.", on_wrong: "Посчитай ростки в одном ряду. На что умножить 3, чтобы вышло 12?" },
};
