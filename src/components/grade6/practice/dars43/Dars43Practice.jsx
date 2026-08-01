import { useCallback, useEffect, useRef, useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D43_01 from './D43_01.jsx';
import D43_02 from './D43_02.jsx';
import D43_03 from './D43_03.jsx';
import D43_04 from './D43_04.jsx';
import D43_05 from './D43_05.jsx';
import D43_06 from './D43_06.jsx';
import D43_07 from './D43_07.jsx';
import D43_08 from './D43_08.jsx';
import D43_09 from './D43_09.jsx';
import D43_10 from './D43_10.jsx';

const ITEMS = [D43_01, D43_02, D43_03, D43_04, D43_05, D43_06, D43_07, D43_08, D43_09, D43_10];
const TITLE = {
  "uz": "Dars 43 amaliyoti. Uchburchak va murakkab shakllar yuzi",
  "ru": "Практика к уроку 43. Площадь треугольника и сложных фигур"
};

const autoScrollBehavior = () => (
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
);

const afterLayout = (callback) => {
  let secondFrame;
  const firstFrame = window.requestAnimationFrame(() => {
    secondFrame = window.requestAnimationFrame(callback);
  });
  return () => {
    window.cancelAnimationFrame(firstFrame);
    if (secondFrame) window.cancelAnimationFrame(secondFrame);
  };
};

export default function Dars43Practice() {
  usePracticeZoom();
  const [index, setIndex] = useState(0);
  const [lang, setLang] = useState('uz');
  const bodyRef = useRef(null);
  const Question = ITEMS[index] || ITEMS[0];
  const scrollBodyToTop = useCallback(() => afterLayout(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: autoScrollBehavior() });
  }), []);

  useEffect(() => scrollBodyToTop(), [index, scrollBodyToTop]);

  return (
    <div className="g6-practice">
      <style>{`
        .g6-practice{position:fixed;inset:0;overflow:hidden;background:#fff7ed;display:flex;flex-direction:column;zoom:var(--pqz,1)}
        .g6-tabs{flex:none;display:grid;grid-template-columns:repeat(10,1fr);gap:5px;padding:48px 10px 7px;background:#fff7ed;border-bottom:1px solid #fed7aa}
        .g6-tabs button{padding:7px 3px;border:1.5px solid #fb923c;border-radius:999px;background:#fff;color:#9a3412;font-weight:800;cursor:pointer}.g6-tabs button.on{background:#ffedd5}
        .g6-body{flex:1;min-height:0;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:contain;scroll-behavior:smooth;scroll-padding-block:12px 104px;-webkit-overflow-scrolling:touch;scrollbar-gutter:stable}.g6-body>div{height:auto;min-height:100%!important;background:#fff7ed}.g6-body>div>div{background:#fff7ed!important}.g6-body>div>div:nth-child(2){min-height:0;overflow:visible;padding:7px 12px!important}.g6-body>div>div:last-child{padding:7px 12px!important;background:linear-gradient(transparent,#fff7ed 28%)!important}
        @media(max-width:639.98px){.g6-practice{width:390px}.g6-tabs{padding-top:45px;gap:3px}.g6-tabs button{font-size:11px;padding:6px 1px}}
        @media(prefers-reduced-motion:reduce){.g6-body{scroll-behavior:auto}}
      `}</style>
      <div className="g6-tabs">
        {ITEMS.map((_, itemIndex) => (
          <button
            type="button"
            className={itemIndex === index ? 'on' : ''}
            key={itemIndex}
            onClick={() => setIndex(itemIndex)}
          >
            {itemIndex + 1}
          </button>
        ))}
      </div>
      <div className="g6-body" ref={bodyRef}>
        <PracticeHost
          key={`43-${index}`}
          Question={Question}
          lang={lang}
          onLangChange={setLang}
          onReset={scrollBodyToTop}
          title={TITLE}
          showLanguageSwitch
        />
      </div>
    </div>
  );
}
