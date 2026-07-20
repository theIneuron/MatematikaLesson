// React qobiq — til, navigatsiya, progress, audio (WebSpeech preview), UI atomlari.
// DEMO (izolyatsiya). WebSpeech faqat preview uchun (production TTS emas).
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { SCREENS } from "./screens.jsx";
import { ORDER } from "./content.js";
import "./styles.css";

// --- Til --------------------------------------------------------------------
const LangCtx = createContext("uz");
export const useLang = () => useContext(LangCtx);
export const useT = () => { const l = useLang(); return (o) => (o && (o[l] ?? o.uz ?? o.ru)) ?? ""; };

// --- Narrator (WebSpeech) ---------------------------------------------------
export function useNarration(segments, lang, autoplay = true) {
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const raw = Array.isArray(segments) ? segments : segments ? [segments] : [];
  // har segment matn yoki {ru,uz} bo'lishi mumkin — hammasini stringga lokalizatsiya qilamiz
  const segs = raw.map((s) => (typeof s === "string" ? s : (s && (s[lang] ?? s.uz ?? s.ru)) || ""));
  const timer = useRef(null);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const play = useCallback((from = 0) => {
    stop();
    const synth = window.speechSynthesis;
    let i = from;
    setIdx(i);
    const speakOne = () => {
      if (i >= segs.length) return;
      setIdx(i);
      const text = segs[i];
      if (synth && !muted) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang === "ru" ? "ru-RU" : "uz-UZ";
        u.rate = 0.98; u.pitch = 1.05;
        u.onend = () => { i++; if (i < segs.length) speakOne(); };
        u.onerror = () => { i++; timer.current = setTimeout(speakOne, 1400); };
        synth.speak(u);
      } else {
        // ovozsiz: taxminiy tezlikda taglavhani surib boramiz
        const dur = Math.max(1600, text.length * 55);
        i++; if (i < segs.length) timer.current = setTimeout(speakOne, dur);
      }
    };
    speakOne();
  }, [segs, lang, muted, stop]);

  useEffect(() => { if (autoplay) play(0); return stop; /* eslint-disable-next-line */ }, [lang]);
  useEffect(() => stop, [stop]);

  return { idx, text: segs[idx] || "", muted, setMuted, play, stop, count: segs.length };
}

// --- UI atomlari ------------------------------------------------------------
export function Eyebrow({ children }) { return <span className="l3-eyebrow">{children}</span>; }

export function Caption({ nar }) {
  if (!nar.text) return null;
  return (
    <div className="l3-caption">
      <button className={`l3-spk ${nar.muted ? "off" : ""}`} onClick={() => { nar.setMuted(!nar.muted); }} title="Ovoz">
        {nar.muted ? "🔇" : "🔊"}
      </button>
      <p key={nar.idx} className="l3-cap-text">{nar.text}</p>
      <button className="l3-replay" onClick={() => nar.play(0)} title="Qayta">↻</button>
    </div>
  );
}

export function Options({ opts, picked, correct, onPick, disabled, cols }) {
  return (
    <div className="l3-opts" style={{ gridTemplateColumns: `repeat(${cols || opts.length}, 1fr)` }}>
      {opts.map((o, i) => {
        let cls = "l3-opt";
        if (picked != null) {
          if (i === picked) cls += i === correct ? " ok" : " no";
          else if (i === correct && picked !== correct) cls += " reveal";
        }
        return <button key={i} className={cls} disabled={disabled || picked != null} onClick={() => onPick(i)}>{o}</button>;
      })}
    </div>
  );
}

export function Feedback({ show, ok, children }) {
  if (!show) return null;
  return <div className={`l3-fb ${ok ? "ok" : "no"}`}>{children}</div>;
}

export function PrimaryBtn({ children, onClick, disabled }) {
  return <button className="l3-primary" onClick={onClick} disabled={disabled}>{children}</button>;
}

// --- Frame (ekran qobig'i) --------------------------------------------------
export function Frame({ eyebrow, title, sub, nar, children, footer }) {
  return (
    <div className="l3-card">
      <div className="l3-head">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {title && <h1 className="l3-title">{title}</h1>}
        {sub && <p className="l3-sub">{sub}</p>}
      </div>
      {nar && <Caption nar={nar} />}
      {children}
      {footer}
    </div>
  );
}

// --- Progress (yo'l xaritasi 1/16) ------------------------------------------
function Progress({ i, n }) {
  return (
    <div className="l3-progress">
      <div className="l3-progress-bar"><i style={{ width: `${((i + 1) / n) * 100}%` }} /></div>
      <span className="l3-progress-txt">{i + 1} / {n}</span>
    </div>
  );
}

// --- App --------------------------------------------------------------------
export default function App() {
  const [lang, setLang] = useState("uz");
  const [i, setI] = useState(0);
  const n = ORDER.length;
  const Screen = SCREENS[ORDER[i]];
  const next = () => setI((v) => Math.min(n - 1, v + 1));
  const prev = () => setI((v) => Math.max(0, v - 1));

  return (
    <LangCtx.Provider value={lang}>
      <div className="l3-root">
        <div className="l3-topbar">
          <div className="l3-brand">Dars01 · 3D <span className="l3-tag">prototip</span></div>
          <Progress i={i} n={n} />
          <div className="l3-lang">
            <button className={lang === "uz" ? "on" : ""} onClick={() => setLang("uz")}>UZ</button>
            <button className={lang === "ru" ? "on" : ""} onClick={() => setLang("ru")}>RU</button>
          </div>
        </div>

        <div className="l3-stage-wrap">
          <Screen key={ORDER[i] + lang} onNext={next} onPrev={prev} isFirst={i === 0} isLast={i === n - 1} idx={i} />
        </div>

        <div className="l3-nav">
          <button className="l3-nav-btn ghost" onClick={prev} disabled={i === 0}>← Orqaga</button>
          <button className="l3-nav-btn" onClick={next} disabled={i === n - 1}>{i === n - 1 ? "Tugadi" : "Davom →"}</button>
        </div>
      </div>
    </LangCtx.Provider>
  );
}
