// Dars 15 · Amaliyot 04 — mustaqil jsx-question (per-task split).
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
// Order: tap step cards in the correct sequence (1,2). Signature type for two-step lesson.
function makeOrder(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const [order,setOrder]=useState([]),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ const sa=initialAnswer?.studentAnswer; if(sa?.order){ setOrder(sa.order); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    const n = t.cards.length;
    useEffect(()=>{ onReady?.(order.length===n && !checked); },[order,checked,onReady,n]);
    const tap = (i)=>{ if(isReview||checked) return; setOrder((o)=> o.includes(i)? o.filter((x)=>x!==i) : (o.length<n? [...o,i] : o)); };
    const check = useCallback(()=>{ const correct = order.length===n && order.every((ci,pos)=>t.cards[ci].pos===pos); setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:t.cards.map((c,i)=>({id:String(i),label:c.txt})), studentAnswer:{order}, correctAnswer:{order:t.cards.map((c,i)=>[i,c.pos]).sort((a,b)=>a[1]-b[1]).map((x)=>x[0])}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[order,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    const cardStyle = (i)=>{ const rank=order.indexOf(i); const on=rank>=0; let bd=on?C.acc:C.line, bg=on?C.accSoft:C.paper, col=C.ink;
      if(checked){ const okp=t.cards[i].pos===rank; bd=okp?C.ok:C.no; bg=okp?C.okSoft:C.noSoft; col=okp?C.ok:C.no; }
      return { display:'flex', alignItems:'center', gap:12, width:'100%', padding:'15px 15px', borderRadius:13, border:'2px solid '+bd, background:bg, color:col, ...S.mono, fontSize:20, fontWeight:800, cursor:(isReview||checked)?'default':'pointer', marginBottom:10, minHeight:56 }; };
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        {cfg.stage && <Stage>{cfg.stage(t,{})}</Stage>}
        <p style={S.ask}>{t.ask}</p>
        {t.cards.map((c,i)=>{ const rank=order.indexOf(i); return (
          <button key={i} type="button" style={cardStyle(i)} disabled={isReview||checked} onClick={()=>tap(i)}>
            <span style={{ width:30, height:30, borderRadius:'50%', flex:'0 0 auto', background: rank>=0?C.acc:'#e5e7eb', color: rank>=0?'#fff':'#9ca3af', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800 }}>{rank>=0?rank+1:'?'}</span>
            <span>{c.txt}</span>
          </button>
        ); })}
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
}
/* ===== 04 · skiporder · order · skiporder ===== */
const D04 = makeOrder({ tag:'skiporder', level:'🟢' });

D04.T = {
  uz: { eyebrow:'Tartiblash', setup:"Panellar 5 tadan qo'shiladi: 5, 10, 15, 20.", ask:"Ko'paytmalarni kichikdan kattaga tartiblang:",
    cards:[{ txt:'15', pos:2 }, { txt:'5', pos:0 }, { txt:'20', pos:3 }, { txt:'10', pos:1 }],
    correct:"To'g'ri. 5 tadan: 5, 10, 15, 20.", wrong:"5 tadan sanang: har son avvalgidan 5 ko'p. Eng kichigidan boshlang.", rule:'5, 10, 15, 20 — har qadam +5.' },
  ru: { eyebrow:'Упорядочи', setup:'Панели прибавляются по 5: 5, 10, 15, 20.', ask:'Расставь произведения от меньшего к большему:',
    cards:[{ txt:'15', pos:2 }, { txt:'5', pos:0 }, { txt:'20', pos:3 }, { txt:'10', pos:1 }],
    correct:'Верно. По 5: 5, 10, 15, 20.', wrong:'Считай по 5: каждое на 5 больше. Начни с наименьшего.', rule:'5, 10, 15, 20 — шаг +5.' },
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

export default function D15_04(props) {
  return (<><style>{FX_CSS}</style><D04 {...props} /></>);
}
