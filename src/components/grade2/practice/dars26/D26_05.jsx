// Dars 26 · Amaliyot 05 — mustaqil topshiriq fayli (monolitdan bo'lindi).
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

/* ============================== URAN SCENE — ko'pburchaklar ============================== */
function polyPoints(n, cx, cy, r, rot) { rot = (rot==null?-Math.PI/2:rot); return Array.from({length:n},(_,i)=>{ const a=rot+i*2*Math.PI/n; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; }); }
const COLS = ['#FFC23C','#5BD6F2','#7CE0A3','#FF9A6B','#c792ea','#7fd0ff','#ffd166'];
// Oddiy ko'pburchak (to'ldirilgan, framer-motion aylanish/kirish)
const ShapeSVG = ({ n, r = 42, fill = 'rgba(255,194,60,.18)', stroke = '#FFC23C', box = 110 }) => {
  const pts = polyPoints(n, box/2, box/2, r);
  return (
    <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`}>
      <motion.polygon initial={{ scale:0, rotate:-20, opacity:0 }} animate={{ scale:1, rotate:0, opacity:1 }} transition={{ type:'spring', stiffness:120 }}
        points={pts.map(p=>p.join(',')).join(' ')} fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
};
const CircleSVG = ({ r = 42, box = 110 }) => (
  <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`}><motion.circle initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring' }} cx={box/2} cy={box/2} r={r} fill="rgba(91,214,242,.16)" stroke="#5BD6F2" strokeWidth="3" /></svg>
);

/* ---- IMZO: POLY-COUNT — tomon yoki burchaklarni bosib sanash ---- */
function makePolyCount(cfg) {
  function Comp(props) {
    const { lang='uz', mode='answer', initialAnswer=null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props||{};
    const t = Comp.T[lang]||Comp.T.uz; const isReview = mode==='review';
    const [tapped,setTapped]=useState([]),[fb,setFb]=useState(null),[checked,setChecked]=useState(false);
    useEffect(()=>{ const sa=initialAnswer?.studentAnswer; if(sa?.tapped){ setTapped(sa.tapped); if(typeof initialAnswer.correct==='boolean'){ setFb({correct:initialAnswer.correct}); setChecked(true); } } },[initialAnswer]);
    useEffect(()=>{ onReady?.(tapped.length>0 && !checked); },[tapped,checked,onReady]);
    const box=200, cx=box/2, cy=105, R=78; const pts=polyPoints(cfg.n,cx,cy,R);
    const tap=(i)=>{ if(isReview||checked) return; setTapped(a=>a.includes(i)?a:[...a,i]); };
    const check=useCallback(()=>{ const correct=tapped.length===cfg.n; setFb({correct}); setChecked(true); correct?playCorrect?.():playWrong?.();
      onSubmit?.({ questionText:t.ask, options:[], studentAnswer:{tapped,count:tapped.length}, correctAnswer:{count:cfg.n}, correct, meta:{tag:cfg.tag,level:cfg.level} }); },[tapped,t,playCorrect,playWrong,onSubmit]);
    const cref=useRef(check); cref.current=check; useEffect(()=>{ registerCheck?.(()=>cref.current()); },[registerCheck]);
    const done = checked && fb?.correct, bad = checked && !fb?.correct;
    return (
      <div style={S.wrap}>
        <div style={S.eyebrow}>{t.eyebrow}</div>
        <p style={S.setup}>{t.setup}</p>
        <p style={S.ask}>{t.ask}</p>
        <Stage>
          <svg width="100%" viewBox={`0 0 ${box} 210`} style={{ maxWidth:box, display:'block', margin:'0 auto' }}>
            <polygon points={pts.map(p=>p.join(',')).join(' ')} fill="rgba(255,255,255,.05)" stroke={C.stageBd} strokeWidth="2" />
            {cfg.mode==='side' && pts.map((p,i)=>{ const q=pts[(i+1)%cfg.n]; const on=tapped.includes(i);
              return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={on?C.acc:C.sink2} strokeWidth={on?7:5} strokeLinecap="round" style={{cursor:(isReview||checked)?'default':'pointer'}} onClick={()=>tap(i)} />; })}
            {cfg.mode==='vertex' && pts.map((p,i)=>{ const q=pts[(i+1)%cfg.n]; return <line key={'e'+i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={C.sink2} strokeWidth="4" strokeLinecap="round" />; })}
            {cfg.mode==='vertex' && pts.map((p,i)=>{ const on=tapped.includes(i);
              return <circle key={i} cx={p[0]} cy={p[1]} r={on?12:9} fill={on?C.acc:C.gold} stroke="#fff" strokeWidth="2" style={{cursor:(isReview||checked)?'default':'pointer'}} onClick={()=>tap(i)} />; })}
          </svg>
          <div style={{ textAlign:'center', marginTop:4, ...S.mono, fontSize:22, fontWeight:800, color: done?C.leaf:bad?'#ffb4a8':C.goldSoft }}>{t.counter}: {tapped.length}</div>
        </Stage>
        {fb && <FB ok={fb.correct} text={fb.correct?t.correct:t.wrong} />}
        {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
      </div>
    );
  }
  return Comp;
}

/* ===== 05 · VisualMC · ko'pburchak EMAS ===== */
const D05 = makeVisualMC({ tag:'not_poly', level:'🟡', correctIdx:2, items:[{n:3},{n:5},{c:true},{n:4}], render:(it,i)=> it.c?<CircleSVG r={38} />:<ShapeSVG n={it.n} r={38} stroke={COLS[i]} fill={COLS[i]+'22'} /> });
D05.T = {
  uz: { eyebrow:'Xatoni top', setup:'Ko‘pburchak faqat to‘g‘ri kesmalardan tuziladi va yopiq bo‘ladi.', ask:'Quyidagilardan qaysi biri ko‘pburchak EMAS?',
    correct:"To'g'ri. Doiraning tomonlari yo‘q — u ko‘pburchak emas.", wrong:'Ko‘pburchakning tomonlari to‘g‘ri chiziq (kesma). Qaysi shaklda tomon yo‘q?', rule:'Doira ko‘pburchak emas — uning tomonlari (kesmalari) yo‘q.' },
  ru: { eyebrow:'Найди лишнее', setup:'Многоугольник состоит только из прямых отрезков и замкнут.', ask:'Какая из фигур НЕ многоугольник?',
    correct:'Верно. У круга нет сторон — он не многоугольник.', wrong:'Стороны многоугольника — прямые (отрезки). У какой фигуры нет сторон?', rule:'Круг не многоугольник — у него нет сторон.' },
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
export default function Task_26_05(props) {
  return (
    <React.Fragment>
      <style>{__FX_CSS}</style>
      <D05 {...props} />
    </React.Fragment>
  );
}
