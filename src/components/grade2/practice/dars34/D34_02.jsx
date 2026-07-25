// Dars 34 · Amaliyot 02 — mustaqil topshiriq fayli (monolitdan bo'lindi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. PracticeHost "Tekshirish" beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================== CORE ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #24306e 0%, #151d49 62%, #0a1030 100%)', stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
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
const IconRetry = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>);
const S = {
  wrap: { maxWidth:640, margin:'0 auto', padding:'4px 2px 8px' },
  eyebrow: { fontSize:12, fontWeight:800, letterSpacing:'.04em', color:C.acc, textTransform:'uppercase' },
  setup: { fontSize:16, lineHeight:1.5, margin:'6px 0 12px', color:'#374151' },
  ask: { fontSize:17, fontWeight:700, margin:'14px 0 12px', color:C.ink },
  mono: { fontFamily:"'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div className="px-drop" style={{ display:'flex', alignItems:'flex-start', gap:10, marginTop:16, padding:'13px 15px', borderRadius:14, fontSize:15, lineHeight:1.45, fontWeight:600, background: ok?C.okSoft:C.noSoft, color: ok?C.ok:C.no }}>
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
function beep(ok){ try{ const ctx=new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value=ok?880:220; g.gain.value=0.06; o.start(); o.stop(ctx.currentTime+0.12);}catch(e){} }
/* ---- Variant tartibini aralashtirish (deterministik) ---- */
let Q_SHUFFLE = true;   // 30-39 darslarda true
let _QBASE = 34;          // dars raqami — pozitsiya boshlanishi
let _QSEQ = 0;           // variantli savol tartib raqami (aniqlash tartibida)
function _hash(s){ let h=2166136261>>>0; s=String(s); for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function permFromSeed(n, seedStr){ const a=Array.from({length:n},(_,i)=>i); let s=(_hash(seedStr)||1)>>>0; for(let i=n-1;i>0;i--){ s=(Math.imul(s,1103515245)+12345)>>>0; const j=s%(i+1); const tmp=a[i]; a[i]=a[j]; a[j]=tmp; } return a; }
function orderFor(cfg, n){ return (Q_SHUFFLE && cfg && cfg.shuffle!==false && n>1) ? permFromSeed(n, cfg.tag) : Array.from({length:n},(_,i)=>i); }
// To'g'ri javob pozitsiyasini dars bo'ylab teng taqsimlab, chalg'ituvchilarni tag bo'yicha aralashtirish.
function orderTarget(cfg, n, correctOrig, qi){
  const idn=Array.from({length:n},(_,i)=>i);
  if(!(Q_SHUFFLE && cfg && cfg.shuffle!==false && n>1) || correctOrig<0) return idn;
  const target=(((_QBASE+qi)%n)+n)%n; const others=[]; for(let i=0;i<n;i++){ if(i!==correctOrig) others.push(i); }
  let s=(_hash(cfg.tag+'|d')||1)>>>0; for(let i=others.length-1;i>0;i--){ s=(Math.imul(s,1103515245)+12345)>>>0; const j=s%(i+1); const tmp=others[i]; others[i]=others[j]; others[j]=tmp; }
  const ord=new Array(n); ord[target]=correctOrig; let k=0; for(let pos=0;pos<n;pos++){ if(pos!==target) ord[pos]=others[k++]; } return ord;
}

/* ============================== FACTORIES ============================== */
// 4-option MC. reveal-fix: only the picked option is colored after check (correct NOT auto-revealed on wrong).
function makeMC(cfg) {
  const _qi = _QSEQ++;
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const ord = orderTarget(cfg, t.opts.length, cfg.correctIdx, _qi); const dispOpts = ord.map((oi)=>t.opts[oi]); const dCorrect = ord.indexOf(cfg.correctIdx);
    const [picked,setPicked]=useState(null),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ if(initialAnswer?.studentAnswer?.idx!=null){ setPicked(initialAnswer.studentAnswer.idx); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(picked!=null && !checked); },[picked,checked,onReady]);
    const check = useCallback(()=>{ const correct = picked===dCorrect; setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:dispOpts.map((l,i)=>({id:String(i),label:l})), studentAnswer:{idx:picked,label:dispOpts[picked]}, correctAnswer:{idx:dCorrect,label:t.opts[cfg.correctIdx]}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[picked,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        {cfg.stage && <Stage>{cfg.stage(t,{picked,checked,fb})}</Stage>}
        <p style={S.ask}>{t.ask}</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:9 }}>
          {dispOpts.map((o,i)=><button key={i} type="button" className="px-rise px-press" style={{ ...optStyle(picked,i,dCorrect,checked,isReview,{half:cfg.half!==false,center:true,mono:cfg.mono!==false,fs:cfg.fs||22}), animationDelay:(i*0.05)+'s' }} disabled={isReview||checked} onClick={()=>setPicked(i)}>{o}</button>)}
        </div>
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
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
// Multiselect (choose all that apply). green=correct pick, red=wrong pick after check.
function makeMultiselect(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const ord = orderFor(cfg, t.opts.length); const dispOpts = ord.map((oi)=>t.opts[oi]);
    const [sel,setSel]=useState([]),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ const sa=initialAnswer?.studentAnswer; if(sa?.sel){ setSel(sa.sel); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(sel.length>0 && !checked); },[sel,checked,onReady]);
    const toggle = (i)=>{ if(isReview||checked) return; setSel((s)=>s.includes(i)?s.filter((x)=>x!==i):[...s,i]); };
    const check = useCallback(()=>{ const want = dispOpts.map((o,i)=>o.ok?i:-1).filter((x)=>x>=0); const correct = sel.length===want.length && want.every((i)=>sel.includes(i)); setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:dispOpts.map((o,i)=>({id:String(i),label:o.label})), studentAnswer:{sel}, correctAnswer:{sel:want}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[sel,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    const box = (o,i)=>{ const on = sel.includes(i); let bd=C.line,bg=C.paper,col=C.ink;
      if(on){ bd=C.acc; bg=C.accSoft; } if(checked&&on){ bd=o.ok?C.ok:C.no; bg=o.ok?C.okSoft:C.noSoft; col=o.ok?C.ok:C.no; }
      return (<button key={i} type="button" className="px-rise px-press" disabled={isReview||checked} onClick={()=>toggle(i)} style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'14px 15px', borderRadius:13, border:'2px solid '+bd, background:bg, color:col, ...S.mono, fontSize:20, fontWeight:800, cursor:(isReview||checked)?'default':'pointer', marginBottom:9, animationDelay:(i*0.05)+'s' }}>
        <span style={{ width:24, height:24, borderRadius:7, border:'2px solid '+(on?bd:C.ink3), background:on?bd:'#fff', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{on?'✓':''}</span>
        {o.label}
      </button>); };
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        {cfg.stage && <Stage>{cfg.stage(t,{sel,checked})}</Stage>}
        <p style={S.ask}>{t.ask}</p>
        {dispOpts.map((o,i)=>box(o,i))}
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
}
// Find-wrong. Pick the one wrong row; on correct answer reveal ✓/✗ badges (allowed for find-wrong).
function makeFindwrong(cfg) {
  const _qi = _QSEQ++;
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const [picked,setPicked]=useState(null),[fb,setFb]=useState(null),[checked,setChecked]=useState(false),[reveal,setReveal]=useState(false);
    const timer = useRef(null); useEffect(()=>()=>clearTimeout(timer.current),[]);
    useEffect(()=>{ if(initialAnswer?.studentAnswer?.idx!=null){ setPicked(initialAnswer.studentAnswer.idx); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); setReveal(!!initialAnswer.correct); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(picked!=null && !checked); },[picked,checked,onReady]);
    const rows = orderTarget(cfg, t.rows.length, t.rows.findIndex((r)=>!r.ok), _qi).map((oi)=>t.rows[oi]); const correctIdx = rows.findIndex((r)=>!r.ok);
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
          <button key={i} type="button" className="px-rise px-press" style={{ ...rowStyle(i), animationDelay:(i*0.05)+'s' }} disabled={isReview||checked} onClick={()=>setPicked(i)}>
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

/* ===== EXTRA FACTORIES ===== */
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
      return <motion.button key={key} type="button" whileTap={{scale:.95}} disabled={isReview||checked} onClick={()=>setPicked(key)} style={{ flex:'1 1 45%', padding:'20px 14px', borderRadius:14, border:'2px solid '+bd, background:bg, color:col, fontSize:20, fontWeight:800, cursor:(isReview||checked)?'default':'pointer', minHeight:66 }}>{label}</motion.button>;
    };
    return (<div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {cfg.stage && <Stage>{cfg.stage(t)}</Stage>}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display:'flex', gap:10 }}>{cfg.swap ? [mkBtn('f',t.no),mkBtn('t',t.yes)] : [mkBtn('t',t.yes),mkBtn('f',t.no)]}</div>
      {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>);
  }
  return Comp;
}
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
          {Array.from({ length:cells }).map((_,i)=>(<motion.div key={i} animate={built[i]?{scale:[1,1.15,1]}:{}} style={{ width:56, height:66, borderRadius:12, border:'2px solid '+(built[i]?cBd:C.line), background:built[i]?cBg:C.paper, display:'flex', alignItems:'center', justifyContent:'center', ...S.mono, fontSize:32, fontWeight:800, color:cCol }}>{built[i]||''}</motion.div>))}
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
          {cfg.digits.map((d,i)=>(<motion.button key={i} type="button" whileTap={{scale:.9}} disabled={isReview||checked} onClick={()=>tap(d)} style={{ width:58, height:56, borderRadius:13, border:'2px solid '+C.line, background:C.paper, ...S.mono, fontSize:24, fontWeight:800, color:C.ink, cursor:(isReview||checked)?'default':'pointer' }}>{d}</motion.button>))}
          <button type="button" disabled={isReview||checked} onClick={back} style={{ width:58, height:56, borderRadius:13, border:'2px solid '+C.line, background:C.paper, ...S.mono, fontSize:20, fontWeight:800, color:C.no, cursor:(isReview||checked)?'default':'pointer' }}>⌫</button>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>);
  }
  return Comp;
}

/* ===== VISUAL MC — variantlar rasm (SVG) ko'rinishida, reveal-fix bilan ===== */
function makeVisualMC(cfg) {
  const _qi = _QSEQ++;
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const ord = orderTarget(cfg, cfg.items.length, cfg.correctIdx, _qi); const items = ord.map((oi)=>cfg.items[oi]); const dCorrect = ord.indexOf(cfg.correctIdx);
    const [picked,setPicked]=useState(null),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ if(initialAnswer?.studentAnswer?.idx!=null){ setPicked(initialAnswer.studentAnswer.idx); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(picked!=null && !checked); },[picked,checked,onReady]);
    const check=useCallback(()=>{ const correct=picked===dCorrect; setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:items.map((_,i)=>({id:String(i),label:'variant '+(i+1)})), studentAnswer:{idx:picked}, correctAnswer:{idx:dCorrect}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[picked,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    const boxStyle=(i)=>{ const on=picked===i, show=checked&&on; let bd=C.line,bg=C.paper;
      if(on&&!checked){ bd=C.acc; bg=C.accSoft; } if(show){ const ok=i===dCorrect; bd=ok?C.ok:C.no; bg=ok?C.okSoft:C.noSoft; }
      return { border:'2px solid '+bd, background:bg, borderRadius:14, padding:'10px', cursor:(isReview||checked)?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', minHeight:104 }; };
    return (<div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {cfg.stage && <Stage>{cfg.stage(t,{picked,checked,correct:fb?.correct,pickedCorrect:checked&&picked===dCorrect})}</Stage>}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {items.map((it,i)=>(<motion.button key={i} type="button" className="px-rise" whileTap={{scale:.96}} disabled={isReview||checked} onClick={()=>setPicked(i)} style={{ ...boxStyle(i), animationDelay:(i*0.05)+'s' }}>{cfg.render(it,i,{picked:picked===i,checked,correct:fb?.correct,isTarget:i===dCorrect})}</motion.button>))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>);
  }
  return Comp;
}

/* ============================== NEPTUN SCENE — kalendar ============================== */
/* ---- IMZO: KALENDAR-KATAK (CalendarGrid) — sanani topib bosish ---- */
function makeCalendar(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const [pick,setPick]=useState(null),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ if(initialAnswer?.studentAnswer?.value!=null){ setPick(initialAnswer.studentAnswer.value); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(pick!=null && !checked); },[pick,checked,onReady]);
    const check=useCallback(()=>{ const correct=pick===cfg.target; setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:[], studentAnswer:{value:pick}, correctAnswer:{value:cfg.target}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[pick,t,playCorrect,playWrong,onSubmit]);
    const cref=useRef(check); cref.current=check; useEffect(()=>{ registerCheck?.(()=>cref.current()); },[registerCheck]);
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        <p style={S.ask}>{t.ask}</p>
        <Stage>
          <div style={{ maxWidth:280, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
              {t.dow.map((d,i)=><div key={'h'+i} style={{ textAlign:'center', fontSize:11, fontWeight:800, color: i>=5?C.acc:C.goldSoft, padding:'2px 0' }}>{d}</div>)}
              {Array.from({length:cfg.days}).map((_,i)=>{ const d=i+1; const on=pick===d; let bg='rgba(255,255,255,.05)', col=C.sink, bd='transparent';
                if(on&&!checked){ bg=C.accSoft; col=C.ink; bd=C.acc; } if(checked&&on){ const ok=d===cfg.target; bg=ok?C.okSoft:C.noSoft; col=ok?C.ok:C.no; bd=ok?C.ok:C.no; }
                return <motion.button key={d} type="button" whileTap={{scale:.9}} disabled={isReview||checked} onClick={()=>setPick(d)} style={{ aspectRatio:'1', borderRadius:8, border:'2px solid '+bd, background:bg, color:col, ...S.mono, fontSize:14, fontWeight:800, cursor:(isReview||checked)?'default':'pointer' }}>{d}</motion.button>; })}
            </div>
          </div>
          <div style={{ textAlign:'center', marginTop:8, fontSize:13.5, fontWeight:700, color:C.goldSoft }}>{t.hint}</div>
        </Stage>
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
}

/* ===== 02 · MC · Dushanbadan keyin ===== */
const D02 = makeMC({ tag:'after_mon', level:'🟢', correctIdx:0, half:true, fs:17, mono:false });
D02.T = {
  uz: { eyebrow:'Hafta kunlari', setup:'Hafta kunlari doim bir xil tartibda keladi.', ask:'Dushanbadan keyin haftaning qaysi kuni keladi?', opts:['Seshanba','Yakshanba','Chorshanba','Juma'],
    correct:"To'g'ri. Dushanbadan keyin Seshanba keladi.", wrong:'Hafta kunlari tartibini eslang: Dushanba, so‘ng qaysi kun?', rule:'Dushanba → Seshanba.' },
  ru: { eyebrow:'Дни недели', setup:'Дни недели всегда идут в одном порядке.', ask:'Какой день недели идёт после понедельника?', opts:['Вторник','Воскресенье','Среда','Пятница'],
    correct:'Верно. После понедельника — вторник.', wrong:'Вспомни порядок: понедельник, а дальше?', rule:'Понедельник → вторник.' },
};

const __FX_CSS = `
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
        .px-rise { animation: pxrise .42s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes pxrise { 0% { opacity:0; transform:translateY(9px); } 100% { opacity:1; transform:translateY(0); } }
        .px-press { transition: transform .09s ease, box-shadow .12s ease; }
        .px-press:active:not(:disabled) { transform:scale(.965); }
        .px-press:hover:not(:disabled) { box-shadow:0 3px 12px rgba(15,15,16,.08); }
        @media (prefers-reduced-motion: reduce) { * { animation:none !important; transition:none !important; } }
      `;
export default function Task_34_02(props) {
  return (
    <React.Fragment>
      <style>{__FX_CSS}</style>
      <D02 {...props} />
    </React.Fragment>
  );
}
