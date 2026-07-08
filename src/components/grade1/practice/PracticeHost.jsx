// PracticeHost (1-sinf) — LOKAL PREVIEW uchun platforma host'ini taqlid qiluvchi qobiq.
// Maqsad: jsx-question kontraktidagi props'ni (onReady, registerCheck, onSubmit,
// playCorrect/playWrong) berib, native "Tekshirish" tugmasini chiqarish — shunda
// mashqni local saytda alohida sinab ko'rsa bo'ladi.
// 1-sinf (6–7 yosh): kattaroq shrift, kattaroq tegish maydonlari.
// Ichida UZ/RU almashtirgich bor. Ozvuchka yo'q (faqat to'g'ri/noto'g'ri beep cue).
// Grade5 practice/PracticeHost bilan bir xil kontrakt; faqat o'lchamlar bolalar uchun.
//
// Layout (MOBIL_DESKTOP_MOSLASH.md naqshi): host balandligi 100% — savol zonasi
// ICHKI skroll (overscroll-behavior: contain), "Tekshirish" paneli pastda doim
// ko'rinadi, body-skroll yo'q. Feedback chiqqanda savol zonasi pastiga avtoskroll.

import React, { useState, useRef, useCallback, useEffect } from 'react';

// usePracticeZoom — amaliyot sahifasi uchun mobil yagona masshtab qatlami
// (MOBIL_DESKTOP_MOSLASH.md, etalon kenglik 390px). <640px: root 390px kenglikda
// joylashadi va real ekranga zoom bilan masshtablanadi; desktop: --pqz=1, tegilmaydi.
export const PQ_MOBILE_W = 390;
export function usePracticeZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const apply = () => {
      const z = window.innerWidth < breakpoint ? window.innerWidth / PQ_MOBILE_W : 1;
      root.style.setProperty('--pqz', String(z));
    };
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--pqz');
    };
  }, [breakpoint]);
}

const IconOk = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const IconRetry = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>);

// preview "to'g'ri/noto'g'ri" signal — qisqa beep (ovoz/narratsiya emas)
function beep(ok) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = ok ? 880 : 220;
    g.gain.value = 0.06;
    o.start();
    o.stop(ctx.currentTime + 0.12);
  } catch (e) { /* preview-only */ }
}

const UI = {
  uz: { check: 'Tekshirish', retry: 'Qayta urinish', correct: "Barakalla!", wrong: 'Maslahat' },
  ru: { check: 'Проверить', retry: 'Заново', correct: 'Молодец!', wrong: 'Подсказка' },
};

export default function PracticeHost({ Question, lang: langProp = 'uz', title }) {
  const [lang, setLang] = useState(langProp);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(null);
  const [qKey, setQKey] = useState(0);
  const [fitZ, setFitZ] = useState(1);
  const checkFnRef = useRef(null);
  const scrollRef = useRef(null);
  const fitRef = useRef(null);
  const ui = UI[lang] || UI.uz;

  const onReady = useCallback((v) => setReady(!!v), []);
  const registerCheck = useCallback((fn) => { checkFnRef.current = fn; }, []);
  const onSubmit = useCallback((res) => setResult(res || { correct: false }), []);
  const playCorrect = useCallback(() => beep(true), []);
  const playWrong = useCallback(() => beep(false), []);

  const reset = useCallback(() => {
    setResult(null); setReady(false); checkFnRef.current = null;
    setFitZ(1);
    setQKey((k) => k + 1);
  }, []);

  // FIT-ZOOM: savol kontenti (sahna-animatsiya + variantlar + feedback) mavjud
  // maydonga sig'masa — butunlay proporsional kichrayadi (zoom), skroll o'rniga.
  // zoom tashqi masshtab: ichki o'lchovlar (scrollHeight) o'z px'ida qoladi, shuning
  // uchun ResizeObserver zanjiri tsiklga tushmaydi. 0.55 dan pastga tushirmaymiz
  // (o'qish/tegish qulayligi) — undan baland kontent uchun ichki skroll zaxira qoladi.
  useEffect(() => {
    const outer = scrollRef.current, inner = fitRef.current;
    if (!outer || !inner) return;
    const compute = () => {
      const availH = outer.clientHeight;
      const availW = outer.clientWidth;
      const natH = inner.scrollHeight;
      const natW = inner.scrollWidth;
      if (!natH || !availH) return;
      let z = Math.min(1, availH / natH, availW / (natW || 1));
      z = Math.max(0.55, Math.round(z * 100) / 100);
      setFitZ((p) => (Math.abs(p - z) > 0.015 ? z : p));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(outer); ro.observe(inner);
    return () => ro.disconnect();
  }, [qKey, lang]);

  // til almashganda mashqni tozalab qayta yuklash
  useEffect(() => { reset(); }, [lang, reset]);

  // feedback chiqqanda uni ko'rinishga olib kelish — savol zonasining ichki skrolli
  // pastiga (double-rAF: fade-up joylashgach). Faqat javob natijasida, mountda emas.
  useEffect(() => {
    if (!result) return;
    const el = scrollRef.current;
    if (!el) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
    }));
    return () => cancelAnimationFrame(raf);
  }, [result]);

  const runCheck = () => { checkFnRef.current && checkFnRef.current(); };

  const chip = (active) => ({
    padding: '6px 13px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'),
    background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif",
  });
  const btnBase = { padding: '14px 24px', fontSize: 18, fontWeight: 800, borderRadius: 16, fontFamily: "'Manrope', system-ui, sans-serif" };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, maxWidth: 700, margin: '0 auto', width: '100%' }}>
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        borderBottom: '1px solid #eef0f4', fontFamily: "'Manrope', system-ui, sans-serif",
      }}>
        <strong style={{ fontSize: 13, color: '#6b7280', flex: 1 }}>{title || ''}</strong>
        <button type="button" style={chip(lang === 'uz')} onClick={() => setLang('uz')}>UZ</button>
        <button type="button" style={chip(lang === 'ru')} onClick={() => setLang('ru')}>RU</button>
      </div>

      <div ref={scrollRef} style={{
        flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden',
        overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch',
      }}>
        <div ref={fitRef} style={{ zoom: fitZ, padding: '14px 12px 16px' }}>
          <Question
            key={qKey + '-' + lang}
            lang={lang}
            mode="answer"
            initialAnswer={null}
            onReady={onReady}
            registerCheck={registerCheck}
            onSubmit={onSubmit}
            playCorrect={playCorrect}
            playWrong={playWrong}
            studentName="O'quvchi"
          />
        </div>
      </div>

      <div style={{
        flexShrink: 0, padding: '10px 12px', background: '#fff', borderTop: '1px solid #eef0f4',
        display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center',
      }}>
        {result && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 800, color: result.correct ? '#1a7f43' : '#c0392b', fontFamily: "'Manrope', system-ui, sans-serif" }}>
            {result.correct ? <IconOk /> : <IconNo />}
            {result.correct ? ui.correct : ui.wrong}
          </div>
        )}
        {/* To'g'ri javobda tugma yo'q (tugadi). Noto'g'rida — savol o'zi qayta javob berishga
            ruxsat bersa (ready), "Tekshirish" qayta ko'rinadi (веди-до-верного, "qayta urinish"siz).
            Faqat savol o'zini qulflaganda (eski prototiplar) "Qayta urinish" zaxira sifatida chiqadi. */}
        {result && result.correct ? null : (result && !ready ? (
          <button type="button" onClick={reset}
            style={{ ...btnBase, fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #d6dae3', background: '#fff', color: '#374151', cursor: 'pointer' }}>
            <IconRetry /> {ui.retry}
          </button>
        ) : (
          <button type="button" disabled={!ready} onClick={runCheck}
            style={{ ...btnBase, minWidth: 210, border: 'none', cursor: ready ? 'pointer' : 'not-allowed', color: '#fff', background: ready ? '#2563eb' : '#c2c8d2' }}>
            {ui.check}
          </button>
        ))}
      </div>
    </div>
  );
}
