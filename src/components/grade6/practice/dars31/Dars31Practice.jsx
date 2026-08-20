import { useCallback, useEffect, useRef, useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D31_01 from './D31_01.jsx';
import D31_02 from './D31_02.jsx';
import D31_03 from './D31_03.jsx';
import D31_04 from './D31_04.jsx';
import D31_05 from './D31_05.jsx';
import D31_06 from './D31_06.jsx';
import D31_07 from './D31_07.jsx';
import D31_08 from './D31_08.jsx';
import D31_09 from './D31_09.jsx';
import D31_10 from './D31_10.jsx';

const ITEMS = [D31_01, D31_02, D31_03, D31_04, D31_05, D31_06, D31_07, D31_08, D31_09, D31_10];
const TITLE = {
  "uz": "Dars 31 amaliyoti. Harfli ifodalar",
  "ru": "Практика к уроку 31. Буквенные выражения",
  "en": "Lesson 31 practice. Expressions with letters"
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

export default function Dars31Practice() {
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
          key={`31-${index}`}
          Question={Question}
          lang={lang}
          onLangChange={setLang}
          onReset={scrollBodyToTop}
          title={TITLE}
          showLanguageSwitch
          langs={['uz', 'ru', 'en']}
        />
      </div>
    </div>
  );
}
