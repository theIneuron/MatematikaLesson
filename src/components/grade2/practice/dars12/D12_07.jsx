// Dars 12 · Amaliyot 07 — mustaqil jsx-question (per-task split).
// Kontrakt: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== CORE ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 58% 24%, #7a4231 0%, #431f15 60%, #260f09 100%)', stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
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
function NumPad({ value, setValue, disabled, max = 2, tone = 'idle' }) {
  const push = (d)=>{ if(disabled) return; setValue((v)=>(v.length>=max?v:v+d)); };
  const back = ()=>{ if(disabled) return; setValue((v)=>v.slice(0,-1)); };
  const keyStyle = { width:62, height:56, borderRadius:13, border:'2px solid '+C.line, background:C.paper, ...S.mono, fontSize:24, fontWeight:800, color:C.ink, cursor: disabled?'default':'pointer' };
  const dBd = tone==='ok'?C.ok:tone==='no'?C.no:C.acc;
  const dBg = tone==='ok'?C.okSoft:tone==='no'?C.noSoft:C.paper;
  const dCol = tone==='ok'?C.ok:tone==='no'?C.no:C.ink;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <div style={{ width:150, height:62, borderRadius:14, border:'2px solid '+dBd, background:dBg, display:'flex', alignItems:'center', justifyContent:'center', ...S.mono, fontSize:30, fontWeight:800, color:dCol, letterSpacing:3 }}>{value || '–'}</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 62px)', gap:8 }}>
        {[1,2,3,4,5,6,7,8,9].map((d)=>(<button key={d} type="button" disabled={disabled} onClick={()=>push(String(d))} style={keyStyle}>{d}</button>))}
        <span/>
        <button type="button" disabled={disabled} onClick={()=>push('0')} style={keyStyle}>0</button>
        <button type="button" disabled={disabled} onClick={back} style={{ ...keyStyle, fontSize:20, color:C.no }}>⌫</button>
      </div>
    </div>
  );
}
// Numpad question. Turns green when correct.
function makeNumpad(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const [val,setVal]=useState(''),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ if(initialAnswer?.studentAnswer?.value!=null){ setVal(String(initialAnswer.studentAnswer.value)); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(val!=='' && !checked); },[val,checked,onReady]);
    const check = useCallback(()=>{ const correct = Number(val)===cfg.answer; setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:[], studentAnswer:{value:val===''?null:Number(val)}, correctAnswer:{value:cfg.answer}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[val,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    const tone = checked?(fb?.correct?'ok':'no'):'idle';
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        {cfg.stage && <Stage>{cfg.stage(t,{val,checked,fb})}</Stage>}
        <p style={S.ask}>{t.ask}</p>
        <NumPad value={val} setValue={setVal} disabled={isReview||checked} max={cfg.max||2} tone={tone} />
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
}
/* ============================== MARS SCENE ============================== */
const Kema = ({ w = 130 }) => (
  <svg width={w} viewBox="0 0 130 66" aria-hidden="true">
    <defs>
      <linearGradient id="pxhull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E9EEF6"/><stop offset="100%" stopColor="#AEBCD2"/></linearGradient>
      <linearGradient id="pxflame" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FFE08A"/><stop offset="60%" stopColor="#FF9A3C"/><stop offset="100%" stopColor="#FF4F28"/></linearGradient>
    </defs>
    <ellipse cx="65" cy="58" rx="46" ry="6" fill="rgba(0,0,0,.25)"/>
    <g className="px-float">
      <path d="M30 33 Q65 6 100 33 L100 40 Q65 52 30 40 Z" fill="url(#pxhull)" stroke="#8697b0" strokeWidth="1.2"/>
      <circle cx="65" cy="30" r="7" fill="#22335c" stroke="#7fd0ff" strokeWidth="1.6"/>
      <path d="M30 36 L18 44 L30 40 Z" fill="#c0392b"/><path d="M100 36 L112 44 L100 40 Z" fill="#c0392b"/>
      <path d="M52 46 Q65 58 78 46 Z" fill="url(#pxflame)"/>
    </g>
  </svg>
);
const CargoCap = ({ text }) => (<div style={{ textAlign:'center', marginTop:6, fontSize:13.5, fontWeight:700, color:C.goldSoft }}>{text}</div>);
const marsMC = (t)=>(<div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}><Kema/><CargoCap text={t.scene} /></div>);
/* ===== 07 · twostep_np · numpad · twostep_np · JAMI (numpad, boshqa misol) ===== */
const D07 = makeNumpad({ tag:'twostep_np', level:'🟡', answer:70, max:3, stage:marsMC });

D07.T = {
  uz: { eyebrow:'Ikki amal · javob', setup:'Omborda 55 quti bor edi. 15 tasi sarflandi, keyin 30 tasi ortildi.', scene:'Mars bazasi · ombor', ask:'Endi nechta quti bor? Javobni tering.',
    correct:"To'g'ri. 55 − 15 = 40, keyin 40 + 30 = 70.", wrong:"Ikki amal: avval ayiring (55 − 15), keyin qo'shing. Oxirigacha bajaring.", rule:'55 − 15 = 40, keyin 40 + 30 = 70.' },
  ru: { eyebrow:'Два действия · ответ', setup:'На складе было 55 ящиков. 15 израсходовали, затем 30 загрузили.', scene:'База Марс · склад', ask:'Сколько ящиков теперь? Набери ответ.',
    correct:'Верно. 55 − 15 = 40, затем 40 + 30 = 70.', wrong:'Два действия: сначала вычти (55 − 15), потом прибавь. До конца.', rule:'55 − 15 = 40, затем 40 + 30 = 70.' },
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

export default function D12_07(props) {
  return (<><style>{FX_CSS}</style><D07 {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D12_07.audio = {
  uz: { intro: "Omborda 55 quti bor edi. 15 tasi sarflandi, keyin 30 tasi ortildi. Endi nechta quti bor? Javobni tering.", on_correct: "To'g'ri. 55 ayirish 15 teng 40, keyin 40 qo'shish 30 teng 70.", on_wrong: "Ikki amal. Avval ayiring 55 ayirish 15, keyin qo'shing. Oxirigacha bajaring." },
  ru: { intro: "На складе было 55 ящиков. 15 израсходовали, затем 30 загрузили. Сколько ящиков теперь? Набери ответ.", on_correct: "Верно. 55 минус 15 равно 40, затем 40 плюс 30 равно 70.", on_wrong: "Два действия. Сначала вычти 55 минус 15, потом прибавь. До конца." },
};
