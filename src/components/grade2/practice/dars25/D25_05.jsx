// Dars 25 · Amaliyot 05 — mustaqil topshiriq fayli (monolitdan bo'lindi).
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
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {items.map((it,i)=>(<motion.button key={i} type="button" whileTap={{scale:.96}} disabled={isReview||checked} onClick={()=>setPicked(i)} style={boxStyle(i)}>{cfg.render(it,i)}</motion.button>))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>);
  }
  return Comp;
}

/* ============================== URAN SCENE — chiziqlar ============================== */
// Chiziq turi: 'kesma' (ikki uch nuqta), 'nur' (bir uch nuqta + o'q), 'togri' (ikki o'q)
// stroke: 'dark' (oq fonda ko'rinadigan to'q) yoki 'light' (to'q sahna panelida ko'rinadigan yorug')
const LineSVG = ({ kind, w = 200, delay = 0, tone = 'dark' }) => {
  const y = 28, x1 = 26, x2 = w - 26;
  const stroke = tone === 'light' ? '#EAF0F8' : '#26476b';
  const Arrow = ({ x, dir }) => (
    <motion.polygon initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: delay + 0.55, type: 'spring', stiffness: 300 }}
      points={dir > 0 ? `${x - 12},${y - 8} ${x + 2},${y} ${x - 12},${y + 8}` : `${x + 12},${y - 8} ${x - 2},${y} ${x + 12},${y + 8}`} fill={C.acc} />
  );
  const Dot = ({ x }) => (
    <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 0.55, type: 'spring', stiffness: 320 }} cx={x} cy={y} r={6.5} fill={C.gold} stroke={tone==='light'?'#0b1030':'#fff'} strokeWidth="2" />
  );
  return (
    <svg width={w} height="56" viewBox={`0 0 ${w} 56`}>
      <motion.path d={`M ${x1} ${y} L ${x2} ${y}`} stroke={stroke} strokeWidth="4.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration: 0.7 }} />
      {kind === 'togri' ? <Arrow x={x1} dir={-1} /> : <Dot x={x1} />}
      {(kind === 'togri' || kind === 'nur') ? <Arrow x={x2} dir={1} /> : <Dot x={x2} />}
    </svg>
  );
};
const lineStage = (kind) => ((t) => (<div style={{ display:'flex', justifyContent:'center', padding:'8px 0' }}><LineSVG kind={kind} tone="light" /></div>));
// Kvadrat — 4 ta rangli kesma (tomon)
const SegSquare = () => {
  const cols = ['#FFC23C', '#5BD6F2', '#7CE0A3', '#FF9A6B'];
  const P = [[40,20],[140,20],[140,120],[40,120]];
  return (
    <svg width="180" height="140" viewBox="0 0 180 140">
      {P.map((p,i)=>{ const q=P[(i+1)%4]; return (
        <motion.line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={cols[i]} strokeWidth="5" strokeLinecap="round" initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ delay:i*0.25, duration:0.4 }} />
      ); })}
      {P.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={5} fill="#fff" />)}
    </svg>
  );
};

/* ---- IMZO: CHIZIQ-SAVAT (LineSort) — chiziqlarni turi bo'yicha savatga ajratish ---- */
const D04_ITEMS = [{ kind:'nur' }, { kind:'togri' }, { kind:'kesma' }];
const D04_BASKETS = ['kesma', 'nur', 'togri'];
const D25_04_T = {
  uz: { eyebrow:'Chiziq-savat', setup:"Ra'no uchta chiziq chizdi. Har birini turi bo'yicha ajrating.", ask:'Avval chiziqni bosing, so‘ng uni to‘g‘ri savatga joylashtiring.',
    names:{ kesma:'Kesma', nur:'Nur', togri:"To'g'ri chiziq" },
    correct:"To'g'ri. Kesma — ikki uchi nuqta; nur — bir uchi nuqta; to'g'ri chiziq — ikki tomon cheksiz.", wrong:'Uchlarga qarang: nechta nuqta, nechta o‘q bor? Shunga qarab savatga soling.', rule:'Kesma=2 nuqta · Nur=1 nuqta+o‘q · To‘g‘ri chiziq=2 o‘q.' },
  ru: { eyebrow:'Сортировка линий', setup:'Рано начертила три линии. Разложи каждую по типу.', ask:'Сначала нажми линию, затем помести её в верную корзину.',
    names:{ kesma:'Отрезок', nur:'Луч', togri:'Прямая' },
    correct:'Верно. Отрезок — две точки; луч — одна точка; прямая — обе стороны бесконечны.', wrong:'Смотри на концы: сколько точек, сколько стрелок? По этому и клади.', rule:'Отрезок=2 точки · Луч=1 точка+стрелка · Прямая=2 стрелки.' },
};
function D25_04(props) {
  const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
  const t = D25_04_T[lang]||D25_04_T.uz; const isReview = mode==='review';
  const [assign,setAssign]=useState({}); const [active,setActive]=useState(null);
  const [fb,setFb]=useState(null),[checked,setChecked]=useState(false);
  useEffect(()=>{ const sa=initialAnswer?.studentAnswer; if(sa?.assign){ setAssign(sa.assign); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
  useEffect(()=>{ onReady?.(Object.keys(assign).length===D04_ITEMS.length && !checked); },[assign,checked,onReady]);
  const tapItem=(i)=>{ if(isReview||checked) return; setActive(i===active?null:i); };
  const tapBasket=(b)=>{ if(isReview||checked||active==null) return; setAssign(a=>{ const n={...a}; Object.keys(n).forEach(k=>{ if(n[k]===b && Number(k)!==active) {} }); n[active]=b; return n; }); setActive(null); };
  const check=useCallback(()=>{ const correct=D04_ITEMS.every((it,i)=>D04_BASKETS[assign[i]]===it.kind); setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
    onSubmit?.({ questionText:t.ask, options:D04_ITEMS.map((it,i)=>({id:String(i),label:it.kind})), studentAnswer:{assign}, correctAnswer:{assign:Object.fromEntries(D04_ITEMS.map((it,i)=>[i,D04_BASKETS.indexOf(it.kind)]))}, correct, meta:{tag:'linesort',level:'🟡'} }); },[assign,t,playCorrect,playWrong,onSubmit]);
  const cref=useRef(check); cref.current=check; useEffect(()=>{ registerCheck?.(()=>cref.current()); },[registerCheck]);
  const itemStyle=(i)=>{ const on=active===i, placed=assign[i]!=null; let bd=on?C.acc:(placed?C.ok:C.line), bg=on?C.accSoft:(placed?C.okSoft:C.paper);
    if(checked){ const ok=D04_BASKETS[assign[i]]===D04_ITEMS[i].kind; bd=ok?C.ok:C.no; bg=ok?C.okSoft:C.noSoft; }
    return { border:'2px solid '+bd, background:bg, borderRadius:12, padding:'4px 6px', cursor:(isReview||checked)?'default':'pointer', opacity:(placed&&!on&&!checked)?0.55:1 }; };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:14 }}>
        {D04_ITEMS.map((it,i)=>(<motion.button key={i} type="button" whileTap={{scale:.95}} disabled={isReview||checked} onClick={()=>tapItem(i)} style={itemStyle(i)}><LineSVG kind={it.kind} w={140} delay={i*0.15} /></motion.button>))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
        {D04_BASKETS.map((b,bi)=>{ const mine=Object.keys(assign).filter(k=>assign[k]===bi).map(Number);
          return (<motion.button key={bi} type="button" whileTap={{scale:.97}} disabled={isReview||checked||active==null} onClick={()=>tapBasket(bi)}
            style={{ minHeight:96, border:'2px dashed '+(active!=null?C.acc:C.line), borderRadius:14, background:C.stile, padding:'8px 4px', display:'flex', flexDirection:'column', alignItems:'center', gap:4, cursor:(active!=null&&!checked)?'pointer':'default' }}>
            <span style={{ fontSize:12.5, fontWeight:800, color:C.goldSoft }}>{t.names[b]}</span>
            {mine.map(mi=><LineSVG key={mi} kind={D04_ITEMS[mi].kind} w={104} delay={0} tone="light" />)}
          </motion.button>); })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

/* ===== 05 · MC · kesmalar soni ===== */
const D05 = makeMC({ tag:'count_seg', level:'🟡', correctIdx:3, half:true, fs:22, stage:(t)=>(<div style={{display:'flex',justifyContent:'center'}}><SegSquare /></div>) });
D05.T = {
  uz: { eyebrow:'Kesmalarni sanash', setup:'Anvar to‘rtburchak chizdi. Uning har bir tomoni alohida kesma.', ask:'To‘rtburchak nechta kesmadan (tomondan) tuzilgan?', opts:['3','5','8','4'],
    correct:"To'g'ri. To‘rtburchakning 4 ta tomoni — 4 ta kesma.", wrong:'Har bir tomonni bosib sanang: shakl atrofida nechta alohida kesma bor?', rule:'To‘rtburchak — 4 ta kesmadan iborat.' },
  ru: { eyebrow:'Счёт отрезков', setup:'Анвар начертил четырёхугольник. Каждая его сторона — отдельный отрезок.', ask:'Из скольких отрезков (сторон) состоит четырёхугольник?', opts:['3','5','8','4'],
    correct:'Верно. У четырёхугольника 4 стороны — 4 отрезка.', wrong:'Нажми каждую сторону и посчитай: сколько отдельных отрезков вокруг?', rule:'Четырёхугольник состоит из 4 отрезков.' },
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
export default function Task_25_05(props) {
  return (
    <React.Fragment>
      <style>{__FX_CSS}</style>
      <D05 {...props} />
    </React.Fragment>
  );
}
