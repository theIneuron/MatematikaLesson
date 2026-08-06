import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PracticeHost from './PracticeHost.jsx';
import { createPracticeQuestion } from './QuestionFactory.jsx';
import { getGrade3PracticeSource } from './sourceRegistry.js';

const MOBILE_W = 390;

function usePracticeZoom() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => root.style.setProperty('--g3pqz', String(window.innerWidth < 640 ? window.innerWidth / MOBILE_W : 1));
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--g3pqz');
    };
  }, []);
}

export default function PracticeBank({ bank }) {
  usePracticeZoom();
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState({});
  const lessonNumber = Number(bank.title?.match(/Dars\s+(\d+)/i)?.[1]);
  const source = bank.source || getGrade3PracticeSource(lessonNumber);
  const items = useMemo(() => bank.items.map((spec, itemIndex) => {
    const baseSource = spec.source || source;
    const sourcedSpec = {
      ...spec,
      source: baseSource
        ? {
          ...baseSource,
          skill: baseSource.skills?.length
            ? baseSource.skills[itemIndex % baseSource.skills.length]
            : baseSource.skill,
        }
        : null,
    };
    return {
      ...sourcedSpec,
      Component: spec.text ? createPracticeQuestion(sourcedSpec) : spec.Component || createPracticeQuestion(sourcedSpec),
    };
  }), [bank, source]);
  const current = items[index] || items[0];

  const chip = (active, result) => ({
    padding: '6px 10px',
    borderRadius: 999,
    border: `1.5px solid ${active ? '#2563EB' : result?.correct ? '#1F7A4D' : result ? '#B9382F' : '#D6DAE3'}`,
    background: active ? '#2563EB' : result?.correct ? '#E3F0E8' : result ? '#FDECEC' : '#fff',
    color: active ? '#fff' : result?.correct ? '#1F7A4D' : result ? '#B9382F' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif",
    fontSize: 12.5,
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  const completed = Object.values(results).filter((result) => result?.correct).length;

  // Panel: 10 ta chipning oxirgilari ekrandan chiqib ketardi va ularga o'tib bo'lmasdi
  // (scrollbar yashirilgan, sichqoncha g'ildiragi gorizontal siljitmaydi).
  // Yechim uch qismdan: chip qisqargan (imzo faqat faol chipda), faol chip o'zi ko'rinishga
  // suriladi, chetdan chiqqanda o'q tugmalari chiqadi.
  const navRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const syncEdges = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const hidden = nav.scrollWidth - nav.clientWidth;
    setEdges({ left: nav.scrollLeft > 2, right: hidden > 2 && nav.scrollLeft < hidden - 2 });
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    syncEdges();
    const onResize = () => syncEdges();
    nav.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      nav.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', onResize);
    };
  }, [syncEdges, items.length]);

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.children?.[index];
    active?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
    const timer = setTimeout(syncEdges, 350);
    return () => clearTimeout(timer);
  }, [index, syncEdges]);

  const scrollBy = (direction) => {
    const nav = navRef.current;
    if (nav) nav.scrollBy({ left: direction * Math.max(160, nav.clientWidth * 0.7), behavior: 'smooth' });
  };

  // Sichqoncha g'ildiragi gorizontal siljitsin: aks holda tachpadsiz oxirgi chiplarga yetib bo'lmaydi.
  const onWheel = (event) => {
    const nav = navRef.current;
    if (!nav || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    nav.scrollLeft += event.deltaY;
  };

  return (
    <div className="g3-practice-bank-root">
      <style>{`
        .g3-practice-bank-root {
          position: fixed;
          inset: 0;
          z-index: 900;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #fff;
          zoom: var(--g3pqz, 1);
          font-family: 'Manrope', system-ui, sans-serif;
        }
        .g3-practice-bank-header {
          min-height: 52px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          padding: 7px 112px 7px 148px;
          border-bottom: 1px solid #EEF0F4;
          background: rgba(255,255,255,.97);
        }
        .g3-practice-bank-title {
          order: 1;
          min-width: 120px;
          max-width: 280px;
          overflow: hidden;
          color: #1F2430;
          font-size: 13.5px;
          font-weight: 900;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .g3-practice-bank-navwrap {
          order: 2;
          position: relative;
          display: flex;
          flex: 1;
          min-width: 0;
        }
        .g3-practice-bank-nav {
          display: flex;
          flex: 1;
          min-width: 0;
          gap: 7px;
          overflow-x: auto;
          overscroll-behavior-x: contain;
          padding-bottom: 2px;
          scroll-padding-inline: 34px;
          scrollbar-width: none;
        }
        .g3-practice-bank-nav::-webkit-scrollbar { display: none; }
        .g3-practice-nav-arrow {
          position: absolute;
          top: 50%;
          z-index: 2;
          width: 28px;
          height: 28px;
          transform: translateY(-50%);
          display: grid;
          place-items: center;
          border: 1.5px solid #D6DAE3;
          border-radius: 999px;
          background: #fff;
          color: #2563EB;
          font: 900 17px 'Manrope', system-ui, sans-serif;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(38, 49, 62, .18);
        }
        .g3-practice-nav-arrow.is-left { left: 2px; }
        .g3-practice-nav-arrow.is-right { right: -2px; }
        .g3-practice-bank-score {
          order: 3;
          flex-shrink: 0;
          padding: 4px 9px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 900;
        }
        .lesson-back {
          top: 8px;
          left: 8px;
          z-index: 1100;
          min-height: 36px;
          box-sizing: border-box;
          padding: 7px 11px;
          font-size: 12px;
        }
        @media (max-width: 900px) {
          .g3-practice-bank-header { padding-left: 140px; }
          .g3-practice-bank-title { display: none; }
        }
        /* Telefonda chip lentasi IKKINCHI qatorga tushadi: bitta qatorda unga "orqaga"
           tugmasi bilan hisob orasida ~140px qolib, faqat bitta kesilgan chip ko'rinardi. */
        @media (max-width: 639.98px) {
          .g3-practice-bank-root { width: 390px; }
          .g3-practice-bank-header {
            flex-wrap: wrap;
            row-gap: 5px;
            gap: 7px;
            padding: 6px 108px 6px 140px;
          }
          .g3-practice-bank-navwrap {
            order: 4;
            flex: 0 0 auto;
            box-sizing: border-box;
            width: calc(100% + 248px);
            margin-left: -140px;
            margin-right: -108px;
            padding-inline: 6px;
          }
          .g3-practice-bank-score { padding-inline: 7px; font-size: 11.5px; }
        }
      `}</style>
      <header className="g3-practice-bank-header">
        <div style={{ display: 'contents' }}>
          <strong className="g3-practice-bank-title" title={bank.title}>{bank.title}</strong>
          <div style={{ display: 'contents' }}>
            <span className="g3-practice-bank-score" aria-label={`${completed} / ${items.length}`} style={{ color: completed === items.length ? '#1F7A4D' : '#596170', background: completed === items.length ? '#E3F0E8' : '#F1F3F6' }}>{completed}/{items.length}</span>
          </div>
        </div>
        <div className="g3-practice-bank-navwrap">
          {edges.left && (
            <button type="button" className="g3-practice-nav-arrow is-left" aria-label="Oldingi topshiriqlar" onClick={() => scrollBy(-1)}>‹</button>
          )}
          <nav className="g3-practice-bank-nav" ref={navRef} onWheel={onWheel} aria-label="Amaliyot topshiriqlari">
            {items.map((item, i) => (
              <button key={item.id} type="button" title={item.label} aria-label={`${i + 1}. ${item.label}`}
                style={chip(i === index, results[item.id])} onClick={() => setIndex(i)}>
                {results[item.id]?.correct ? '✓ ' : ''}{i + 1}. {item.level}{i === index ? ` ${item.label}` : ''}
              </button>
            ))}
          </nav>
          {edges.right && (
            <button type="button" className="g3-practice-nav-arrow is-right" aria-label="Keyingi topshiriqlar" onClick={() => scrollBy(1)}>›</button>
          )}
        </div>
      </header>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <PracticeHost
          key={`${current.id}-${index}`}
          Question={current.Component}
          title={`${index + 1}/${items.length} · ${current.label}`}
          source={current.source}
          onResult={(result) => setResults((currentResults) => ({ ...currentResults, [current.id]: result }))}
        />
      </div>
    </div>
  );
}
