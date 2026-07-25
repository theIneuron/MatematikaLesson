// Dars 29 · Amaliyot 03 — mustaqil topshiriq fayli (monolitdan bo'lindi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. PracticeHost "Tekshirish" beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================== CORE ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #17565b 0%, #0c363f 62%, #071f26 100%)', stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
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
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review'; const items = cfg.items;
    const [picked,setPicked]=useState(null),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ if(initialAnswer?.studentAnswer?.idx!=null){ setPicked(initialAnswer.studentAnswer.idx); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(picked!=null && !checked); },[picked,checked,onReady]);
    const check=useCallback(()=>{ const correct=picked===cfg.correctIdx; setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:items.map((_,i)=>({id:String(i),label:'variant '+(i+1)})), studentAnswer:{idx:picked}, correctAnswer:{idx:cfg.correctIdx}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[picked,t,playCorrect,playWrong,onSubmit]);
    useReg(check,registerCheck);
    const boxStyle=(i)=>{ const on=picked===i, show=checked&&on; let bd=C.line,bg=C.paper;
      if(on&&!checked){ bd=C.acc; bg=C.accSoft; } if(show){ const ok=i===cfg.correctIdx; bd=ok?C.ok:C.no; bg=ok?C.okSoft:C.noSoft; }
      return { border:'2px solid '+bd, background:bg, borderRadius:14, padding:'10px', cursor:(isReview||checked)?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', minHeight:104 }; };
    return (<div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {cfg.stage && <Stage>{cfg.stage(t,{picked,checked,correct:fb?.correct,pickedCorrect:checked&&picked===cfg.correctIdx})}</Stage>}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {items.map((it,i)=>(<motion.button key={i} type="button" whileTap={{scale:.96}} disabled={isReview||checked} onClick={()=>setPicked(i)} style={boxStyle(i)}>{cfg.render(it,i,{picked:picked===i,checked,correct:fb?.correct,isTarget:i===cfg.correctIdx})}</motion.button>))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>);
  }
  return Comp;
}

/* ============================== URAN SCENE — shakl yasash ============================== */
function polyPoints(n, cx, cy, r, rot) { rot=(rot==null?-Math.PI/2:rot); return Array.from({length:n},(_,i)=>{ const a=rot+i*2*Math.PI/n; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; }); }
// Yopiq / ochiq shakl (variantlar uchun)
const PolyFig = ({ n, closed=true, r=38, stroke='#FFC23C', box=100 }) => {
  const pts=polyPoints(n, box/2, box/2, r); const d=pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ')+(closed?' Z':'');
  return (<svg width={box} height={box} viewBox={`0 0 ${box} ${box}`}><path d={d} fill={closed?stroke+'22':'none'} stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>{pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill="#fff"/>)}</svg>);
};

/* ---- Buyum ikonalari (8-topshiriq variantlari) ---- */
const ChessIcon = () => { const n=4, s=76/n, o=12, cells=[]; for(let r=0;r<n;r++){ for(let c=0;c<n;c++){ if((r+c)%2===0) cells.push(<rect key={r+'-'+c} x={o+c*s} y={o+r*s} width={s} height={s} fill="#2b2b3a"/>); } }
  return (<svg width={96} height={96} viewBox="0 0 100 100"><rect x={o} y={o} width={76} height={76} fill="#f4f4f0" stroke="#2b2b3a" strokeWidth="2.5"/>{cells}</svg>); };
const BallIcon = () => (<svg width={96} height={96} viewBox="0 0 100 100">
  <circle cx={50} cy={50} r={34} fill="#ffffff" stroke="#2b2b3a" strokeWidth="2.5"/>
  <path d="M50 34 L61 43 L57 57 L43 57 L39 43 Z" fill="#2b2b3a"/>
  <line x1={50} y1={16} x2={50} y2={34} stroke="#2b2b3a" strokeWidth="2"/>
  <line x1={61} y1={43} x2={80} y2={38} stroke="#2b2b3a" strokeWidth="2"/>
  <line x1={57} y1={57} x2={70} y2={74} stroke="#2b2b3a" strokeWidth="2"/>
  <line x1={43} y1={57} x2={30} y2={74} stroke="#2b2b3a" strokeWidth="2"/>
  <line x1={39} y1={43} x2={20} y2={38} stroke="#2b2b3a" strokeWidth="2"/>
</svg>);
const PizzaIcon = () => (<svg width={96} height={96} viewBox="0 0 100 100">
  <circle cx={50} cy={50} r={34} fill="#F4C430" stroke="#d98a2b" strokeWidth="3"/>
  <circle cx={50} cy={50} r={27} fill="#e8532b" opacity="0.85"/>
  <circle cx={44} cy={40} r={5} fill="#a11d1d"/>
  <circle cx={61} cy={46} r={5} fill="#a11d1d"/>
  <circle cx={45} cy={60} r={5} fill="#a11d1d"/>
  <circle cx={61} cy={62} r={4} fill="#a11d1d"/>
</svg>);
const TvIcon = ({ lit=false }) => (<svg width={116} height={96} viewBox="0 0 116 96">
  <rect x={8} y={10} width={100} height={64} rx={7} fill="#2b2b3a"/>
  <motion.rect x={16} y={18} width={84} height={48} rx={4} initial={false} animate={{ fill: lit?'#FFD11A':'#8a94a6' }} transition={{ duration:0.55 }} />
  {lit && <motion.text initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.4 }} x={58} y={46} textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#2b2b3a" fontFamily="system-ui, -apple-system, sans-serif">coddy camp</motion.text>}
  <line x1={40} y1={74} x2={31} y2={88} stroke="#2b2b3a" strokeWidth="5" strokeLinecap="round"/>
  <line x1={76} y1={74} x2={85} y2={88} stroke="#2b2b3a" strokeWidth="5" strokeLinecap="round"/>
</svg>);

/* ---- IMZO: NUQTA-TO'R — nuqtalarni ulab shakl yasash ---- */
function makeDotBuild(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const cols=cfg.cols||4, rows=cfg.rows||4, gap=52, x0=30, y0=24;
    const [seq,setSeq]=useState([]),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ const sa=initialAnswer?.studentAnswer; if(sa?.seq){ setSeq(sa.seq); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    const closed=seq.length===cfg.target;
    useEffect(()=>{ onReady?.(seq.length===cfg.target && !checked); },[seq,checked,onReady]);
    const xy=(id)=>[x0+(id%cols)*gap, y0+Math.floor(id/cols)*gap];
    const gc=(id)=>[id%cols, Math.floor(id/cols)]; // grid ustun,qator
    const validShape=()=>{
      const P=seq.map(gc);
      if(cfg.shape==='triangle'){ if(P.length!==3) return false; const [a,b,c]=P; return ((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))!==0; }
      if(cfg.shape==='square'){ if(P.length!==4) return false; const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]); const mnx=Math.min(...xs),mxx=Math.max(...xs),mny=Math.min(...ys),mxy=Math.max(...ys); const side=mxx-mnx; if(side===0||side!==(mxy-mny)) return false; return [[mnx,mny],[mxx,mny],[mxx,mxy],[mnx,mxy]].every(cc=>P.some(p=>p[0]===cc[0]&&p[1]===cc[1])); }
      return seq.length===cfg.target;
    };
    const tap=(id)=>{ if(isReview||checked) return; setSeq(s=> s.includes(id)? s : (s.length>=cfg.target? s : [...s,id])); };
    const check=useCallback(()=>{ const correct=validShape(); setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:[], studentAnswer:{seq}, correctAnswer:{count:cfg.target,shape:cfg.shape}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[seq,t,playCorrect,playWrong,onSubmit]);
    const cref=useRef(check); cref.current=check; useEffect(()=>{ registerCheck?.(()=>cref.current()); },[registerCheck]);
    const W=x0*2+(cols-1)*gap, H=y0*2+(rows-1)*gap;
    const path = seq.map((id,i)=>{ const [x,y]=xy(id); return (i?'L':'M')+x+' '+y; }).join(' ')+(closed?' Z':'');
    const col = checked?(fb?.correct?C.ok:C.no):C.acc;
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        <p style={S.ask}>{t.ask}</p>
        <Stage>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth:W, display:'block', margin:'0 auto' }}>
            {seq.length>0 && <path d={path} fill={closed?col+'22':'none'} stroke={col} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
            {Array.from({length:cols*rows}).map((_,id)=>{ const [x,y]=xy(id); const on=seq.includes(id); const order=seq.indexOf(id);
              return (<g key={id}>
                <circle cx={x} cy={y} r={on?11:7} fill={on?col:'#B6C7D2'} stroke="#fff" strokeWidth="2" style={{cursor:(isReview||checked)?'default':'pointer'}} onClick={()=>tap(id)} />
                {on && <text x={x} y={y+4} fontSize="11" fontWeight="800" textAnchor="middle" fill="#fff" style={{pointerEvents:'none'}}>{order+1}</text>}
              </g>); })}
          </svg>
          <div style={{ textAlign:'center', marginTop:4, fontSize:13.5, fontWeight:700, color:C.goldSoft }}>{t.hint}: {seq.length}/{cfg.target}</div>
        </Stage>
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
}

/* ===== 03 · TrueFalse · ochiq shakl ===== */
const D03 = makeTrueFalse({ tag:'tf_open', level:'🟢', answer:false, stage:(t)=>(<div style={{display:'flex',justifyContent:'center'}}><PolyFig n={4} closed={false} stroke="#FF9A6B" /></div>) });
D03.T = {
  uz: { eyebrow:"To'g'ri yoki noto'g'ri", setup:'Ekranda chiziq boshi oxiriga ulanmagan shakl ko‘rsatilgan.', ask:'Bu shakl yopiqmi — ya‘ni chiziqning boshi oxiriga ulanganmi?', yes:'Ha', no:'Yo‘q',
    correct:"To'g'ri javob: Yo‘q. Chiziq boshi oxiriga ulanmagan — shakl ochiq.", wrong:'Shaklga qarang: boshlanish nuqtasi oxiri bilan tutashganmi? Bir joyi ochiq.', rule:'Yopiq shakl — boshi oxiriga ulanadi. Bu ochiq.' },
  ru: { eyebrow:'Верно или неверно', setup:'На экране фигура, у которой линия не соединена в конце.', ask:'Замкнута ли фигура — соединено ли начало с концом?', yes:'Да', no:'Нет',
    correct:'Правильно: Нет. Начало не соединено с концом — фигура открыта.', wrong:'Посмотри: соединено ли начало с концом? Одно место открыто.', rule:'Замкнутая — начало соединено с концом. Эта открыта.' },
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
        @media (prefers-reduced-motion: reduce) { * { animation:none !important; transition:none !important; } }
      `;
export default function Task_29_03(props) {
  return (
    <React.Fragment>
      <style>{__FX_CSS}</style>
      <D03 {...props} />
    </React.Fragment>
  );
}
