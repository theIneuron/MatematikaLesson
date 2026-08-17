import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Grade6TheoryTheme.css';
import {
  T,
  configureLesson,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  Stage,
  NavBack,
  NavNext,
  BackLabel,
  QuestionScreen,
  RevealScreen,
  PickDivisors,
  DragMatch,
  Classify,
  WhyCard,
  FactCard,
  Floaters,
  useIntroStages,
  Frac,
  mt,
  STYLES,
} from './Dars01.jsx';
import { GRADE6_LIFE_CONTEXTS } from './Grade6LifeContexts.js';
import { GRADE6_CONCEPT_BRIDGES } from './Grade6ConceptBridges.js';

const FACT_BADGE = {
  uz: 'Bilasizmi? · Matematika',
  ru: 'Знаете ли вы? · Математика',
};

const localized = (value, lang) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.uz ?? value.ru ?? '';
};

// Har bir slayd uchun ovozli matnning ishonchli zaxirasi. Kontentdagi `intro`
// yoki `audio` tasodifan bo'sh qolsa, TTS navbati bo'sh bo'lib ketmasin:
// ekranda ko'rinayotgan sarlavha, savol va qadamlar o'qib beriladi.
const slideNarration = (slide, lang) => {
  const directAudio = localized(slide?.audio, lang);
  if (Array.isArray(directAudio)) return directAudio.filter(Boolean).join(' ');
  if (String(directAudio || '').trim()) return String(directAudio).trim();

  const parts = [
    localized(slide?.intro, lang),
    localized(slide?.title, lang),
    localized(slide?.prompt, lang),
    localized(slide?.subtitle, lang),
    ...(slide?.steps || []).map((step) => localized(step, lang)),
  ];
  return parts.filter(Boolean).join(' ');
};

const slideNarrationByLanguage = (slide) => ({
  uz: slideNarration(slide, 'uz'),
  ru: slideNarration(slide, 'ru'),
});

const revealNarration = (slide, lang) => {
  const directAudio = localized(slide?.audio, lang);
  if (Array.isArray(directAudio)) return directAudio.filter(Boolean);
  if (String(directAudio || '').trim()) return [String(directAudio).trim()];
  const steps = (slide?.steps || []).map((step) => localized(step, lang)).filter(Boolean);
  return steps.length ? steps : [slideNarration(slide, lang)].filter(Boolean);
};

// “To'g'ri” va “Nega shunday” alohida audio bosqichlaridir. Birinchi izohni
// bu yerga ham qo'shish uni “Nega shunday” ichida ikkinchi marta o'qitardi.
const correctText = () => ({
  uz: "Javob to'g'ri.",
  ru: 'Ответ верный.',
});

// Pedagogik tartib: yangi tushuncha hali izohlanmasidan oldin o'quvchiga
// savol bermaymiz. Avval barcha ta'rif, qoida, formula va tushuntirilgan
// namunalar; undan keyin kirish savoli va mustaqil mashqlar keladi.
function sequenceTheorySlides(slides, lifeContext, conceptBridges = []) {
  if (!Array.isArray(slides) || slides.length < 4) return slides;
  const questionTypes = new Set(['question', 'multi', 'match', 'classify']);
  const titleSlide = slides[0];
  const summarySlide = slides[slides.length - 1];
  const middleSlides = [
    ...(lifeContext ? [lifeContext] : []),
    ...conceptBridges,
    ...slides.slice(1, -1).filter((slide) => !slide?.isLifeContext && !slide?.isConceptBridge),
  ];
  const explanations = middleSlides.filter((slide) => !questionTypes.has(slide?.type));
  const questions = middleSlides.filter((slide) => questionTypes.has(slide?.type));
  return [
    titleSlide,
    ...explanations,
    ...questions,
    summarySlide,
  ];
}

function keepAuthoredTheorySequence(slides) {
  if (!Array.isArray(slides) || slides.length < 2) return slides;
  const titleSlide = slides[0];
  const summarySlide = slides[slides.length - 1];
  const authoredMiddle = slides
    .slice(1, -1)
    .filter((slide) => !slide?.isLifeContext && !slide?.isConceptBridge);
  return [
    titleSlide,
    ...authoredMiddle,
    summarySlide,
  ];
}

function FractionBar({ numerator, denominator, color = 'accent', label }) {
  return (
    <div className="fth-bar-wrap">
      {label && <p className="small fth-bar-label">{label}</p>}
      <div className={`fth-bar fth-bar-${color}`}>
        {Array.from({ length: denominator }, (_, index) => (
          <span key={index} className={index < numerator ? 'filled' : ''}/>
        ))}
      </div>
    </div>
  );
}

export function MathVisual({ visual, lang }) {
  if (!visual) return null;

  if (visual.type === 'equation') {
    return (
      <div className="fth-equation" aria-label={localized(visual.expression, lang)}>
        {mt(localized(visual.expression, lang))}
      </div>
    );
  }

  if (visual.type === 'chain') {
    const connector = localized(visual.connector, lang) || '→';
    return (
      <div className="fth-chain">
        {visual.items.map((item, index) => (
          <React.Fragment key={`${localized(item, lang)}-${index}`}>
            <span className={index === visual.items.length - 1 ? 'is-final' : ''}>{mt(localized(item, lang))}</span>
            {index < visual.items.length - 1 && <b>{connector}</b>}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (visual.type === 'bars' || visual.type === 'fractionBars') {
    const groups = visual.groups || visual.bars || [];
    return (
      <div className="fth-bars">
        {groups.map((group, index) => (
          <React.Fragment key={index}>
            <FractionBar
              numerator={group.numerator}
              denominator={group.denominator}
              color={group.color}
              label={localized(group.label, lang)}
            />
            {index < groups.length - 1 && <span className="fth-equals">=</span>}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (visual.type === 'panels') {
    return (
      <div className="fth-panels">
        {visual.panels.map((panel, index) => (
          <div
            className={`fth-panel ${
              panel.color === 'yellow'
                ? 'fth-panel-yellow'
                : panel.color === 'green'
                  ? 'fth-panel-green'
                  : panel.color === 'blue' || (!panel.color && index % 2)
                    ? 'fth-panel-blue'
                    : ''
            }`}
            key={index}
          >
            <p className="small mono">{localized(panel.title, lang)}</p>
            {panel.lines.map((line, lineIndex) => (
              <div className="fth-panel-line" key={lineIndex}>{mt(localized(line, lang))}</div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === 'steps') {
    return (
      <div className="fth-mini-steps">
        {visual.items.map((item, index) => (
          <div key={index}>
            <span>{index + 1}</span>
            <p>{mt(localized(item, lang))}</p>
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === 'numberLine') {
    return (
      <div className="fth-number-line">
        <div className="fth-number-line-axis"/>
        {(visual.points || []).map((point, index) => (
          <div className="fth-number-point" style={{ left: `${point.at}%` }} key={index}>
            <i/>
            <span>{mt(localized(point.label, lang))}</span>
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === 'coordinatePlane') {
    return (
      <div className="fth-coordinate-plane" aria-label={localized(visual.label, lang)}>
        <span className="fth-axis fth-axis-x"/>
        <span className="fth-axis fth-axis-y"/>
        <b className="fth-axis-label fth-axis-label-x">x</b>
        <b className="fth-axis-label fth-axis-label-y">y</b>
        {(visual.points || []).map((point, index) => (
          <span
            className={`fth-plane-point fth-plane-point-${point.color || 'accent'}`}
            style={{ left: `${50 + point.x * 8}%`, top: `${50 - point.y * 8}%` }}
            key={index}
          >
            <i/>
            <em>{localized(point.label, lang)}</em>
          </span>
        ))}
      </div>
    );
  }

  if (visual.type === 'circle') {
    const mode = visual.mode || 'radius';
    return (
      <div className="fth-circle-visual">
        <div className="fth-circle-shape">
          <i className="fth-circle-center"/>
          <span className={`fth-circle-segment fth-circle-segment-${mode}`}/>
          <b className="fth-circle-o">O</b>
          <em>{localized(visual.segmentLabel, lang) || (mode === 'diameter' ? 'd' : 'r')}</em>
        </div>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'triangle') {
    return (
      <div className="fth-geometry-visual">
        <svg viewBox="0 0 320 190" role="img" aria-label={localized(visual.label, lang)}>
          <polygon points="42,158 278,158 174,30" className="fth-triangle-fill"/>
          {visual.height && <line x1="174" y1="30" x2="174" y2="158" className="fth-height-line"/>}
          {visual.height && <polyline points="174,145 187,145 187,158" className="fth-right-mark"/>}
          <text x="28" y="177">A</text>
          <text x="282" y="177">B</text>
          <text x="168" y="22">C</text>
          {visual.base && <text x="145" y="182">{localized(visual.base, lang)}</text>}
          {visual.height && <text x="183" y="100">{localized(visual.height, lang)}</text>}
        </svg>
      </div>
    );
  }

  if (visual.type === 'symmetry') {
    return (
      <div className="fth-symmetry-visual">
        <span className="fth-symmetry-axis"/>
        <div className="fth-symmetry-half fth-symmetry-left">{mt(localized(visual.left, lang))}</div>
        <div className="fth-symmetry-half fth-symmetry-right">{mt(localized(visual.right, lang))}</div>
        <p className="small">{localized(visual.caption, lang)}</p>
      </div>
    );
  }

  if (visual.type === 'dataBars') {
    return (
      <div className="fth-data-bars" aria-label={localized(visual.label, lang)}>
        {(visual.items || []).map((item, index) => (
          <div key={index}>
            <span style={{ height: `${Math.max(18, item.value * 8)}px` }}><b>{item.value}</b></span>
            <em>{localized(item.label, lang)}</em>
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === 'colorTiles') {
    return (
      <div className="fth-color-tiles-visual">
        <div className="fth-color-tiles" aria-label={localized(visual.label, lang)}>
          {(visual.tiles || []).map((tile, index) => (
            <span
              className={`fth-color-tile fth-color-tile-${tile}`}
              key={`${tile}-${index}`}
              aria-hidden="true"
            />
          ))}
        </div>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'dataTable') {
    const columns = visual.columns || [];
    return (
      <div className="fth-table-wrap">
        <table className="fth-data-table">
          {visual.caption && <caption>{localized(visual.caption, lang)}</caption>}
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th scope="col" key={index}>{localized(column, lang)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(visual.rows || []).map((row, rowIndex) => (
              <tr className={rowIndex === visual.highlightRow ? 'is-highlighted' : ''} key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td className={cellIndex === visual.highlightColumn ? 'is-highlighted-cell' : ''} key={cellIndex}>
                    {mt(localized(cell, lang))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (visual.type === 'mapRoute') {
    return (
      <div className="fth-map-route" aria-label={localized(visual.label, lang)}>
        <span className="fth-map-road fth-map-road-a"/>
        <span className="fth-map-road fth-map-road-b"/>
        <span className="fth-map-pin fth-map-pin-a"><b>A</b></span>
        <span className="fth-map-pin fth-map-pin-b"><b>B</b></span>
        <span className="fth-map-dots"/>
        <div className="fth-map-note">
          <b>{mt(localized(visual.mapDistance, lang))}</b>
          <span>{mt(localized(visual.scale, lang))}</span>
          {visual.realDistance && <em>{mt(localized(visual.realDistance, lang))}</em>}
        </div>
      </div>
    );
  }

  if (visual.type === 'priceTag') {
    return (
      <div className="fth-price-tag" aria-label={localized(visual.label, lang)}>
        <span className="fth-price-old">{mt(localized(visual.oldPrice, lang))}</span>
        <b>{mt(localized(visual.discount ?? visual.percent, lang))}</b>
        <span className="fth-price-arrow">→</span>
        <strong>{mt(localized(visual.newPrice, lang))}</strong>
      </div>
    );
  }

  if (visual.type === 'balance') {
    return (
      <div className="fth-balance" aria-label={localized(visual.label, lang)}>
        <div className="fth-balance-beam">
          <span className="fth-balance-pan fth-balance-left">{mt(localized(visual.left, lang))}</span>
          <i/>
          <span className="fth-balance-pan fth-balance-right">{mt(localized(visual.right, lang))}</span>
        </div>
        <span className="fth-balance-stand"/>
        {visual.result && <p className="small">{mt(localized(visual.result, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'fractionArea') {
    const rows = visual.rows || 3;
    const columns = visual.columns || 4;
    return (
      <div className="fth-concept-visual">
        <div
          className="fth-fraction-area"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          aria-label={localized(visual.label, lang)}
        >
          {Array.from({ length: rows * columns }, (_, index) => {
            const row = Math.floor(index / columns);
            const column = index % columns;
            const inBase = column < (visual.baseColumns || 0);
            const inOverlap = inBase && row < (visual.overlapRows || 0);
            return <span className={inOverlap ? 'is-overlap' : inBase ? 'is-base' : ''} key={index}/>;
          })}
        </div>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'ribbonCut') {
    return (
      <div className="fth-concept-visual">
        <div
          className="fth-ribbon-cut"
          style={{ gridTemplateColumns: `repeat(${visual.total || 8}, 1fr)` }}
        >
          {Array.from({ length: visual.total || 8 }, (_, index) => (
            <span className={index < (visual.filled || 0) ? 'is-filled' : ''} key={index}>
              <b>{index < (visual.filled || 0) ? index + 1 : ''}</b>
              <em>{localized(visual.segmentLabel, lang)}</em>
            </span>
          ))}
        </div>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'percentGrid') {
    return (
      <div className="fth-concept-visual">
        <div className="fth-percent-grid" aria-label={localized(visual.label, lang)}>
          {Array.from({ length: 100 }, (_, index) => (
            <span className={index < (visual.filled || 0) ? 'is-filled' : ''} key={index}/>
          ))}
        </div>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'groupBoxes') {
    return (
      <div className="fth-concept-visual">
        <div className="fth-group-boxes">
          {Array.from({ length: visual.groups || 4 }, (_, groupIndex) => (
            <div className="fth-group-box" key={groupIndex}>
              <span className="fth-notebook-stack">{visual.variable || 'x'}</span>
              <div className="fth-pencil-dots">
                {Array.from({ length: visual.fixed || 3 }, (_, index) => <i key={index}/>)}
              </div>
            </div>
          ))}
        </div>
        {visual.result && <p className="fth-concept-formula">{mt(localized(visual.result, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'circleRearrange') {
    const rays = Array.from({ length: 12 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 12;
      return {
        x: 82 + 64 * Math.cos(angle),
        y: 82 + 64 * Math.sin(angle),
      };
    });
    return (
      <div className="fth-concept-visual">
        <svg className="fth-circle-rearrange" viewBox="0 0 520 180" role="img" aria-label={localized(visual.label, lang)}>
          <circle cx="82" cy="82" r="64" className="fth-sector-circle"/>
          {rays.map((point, index) => (
            <line x1="82" y1="82" x2={point.x} y2={point.y} className="fth-sector-ray" key={index}/>
          ))}
          <path d="M168 82 H220" className="fth-rearrange-arrow"/>
          <polygon points="250,132 430,132 396,38 216,38" className="fth-sector-strip"/>
          {Array.from({ length: 8 }, (_, index) => (
            <line
              x1={228 + index * 23}
              y1={index % 2 ? 132 : 38}
              x2={251 + index * 23}
              y2={index % 2 ? 38 : 132}
              className="fth-sector-ray"
              key={index}
            />
          ))}
          <line x1="216" y1="150" x2="430" y2="150" className="fth-dimension-line"/>
          <text x="310" y="170">πr</text>
          <line x1="455" y1="38" x2="455" y2="132" className="fth-dimension-line"/>
          <text x="466" y="90">r</text>
        </svg>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'angleSum') {
    return (
      <div className="fth-concept-visual">
        <svg className="fth-angle-sum" viewBox="0 0 520 190" role="img" aria-label={localized(visual.label, lang)}>
          <polygon points="42,145 210,145 130,30" className="fth-angle-triangle"/>
          <circle cx="42" cy="145" r="17" className="fth-angle-a"/>
          <circle cx="210" cy="145" r="17" className="fth-angle-b"/>
          <circle cx="130" cy="30" r="17" className="fth-angle-c"/>
          <path d="M238 90 H292" className="fth-rearrange-arrow"/>
          <path d="M330 125 A70 70 0 0 1 470 125" className="fth-straight-angle"/>
          <path d="M330 125 A70 70 0 0 1 373 61" className="fth-straight-a"/>
          <path d="M373 61 A70 70 0 0 1 428 67" className="fth-straight-b"/>
          <path d="M428 67 A70 70 0 0 1 470 125" className="fth-straight-c"/>
          <line x1="318" y1="125" x2="482" y2="125" className="fth-dimension-line"/>
          <text x="385" y="155">180°</text>
        </svg>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'trianglePair') {
    return (
      <div className="fth-concept-visual">
        <svg className="fth-triangle-pair" viewBox="0 0 480 190" role="img" aria-label={localized(visual.label, lang)}>
          <polygon points="55,145 220,145 55,42" className="fth-pair-triangle-a"/>
          <polygon points="220,145 220,42 55,42" className="fth-pair-triangle-b"/>
          <line x1="55" y1="160" x2="220" y2="160" className="fth-dimension-line"/>
          <text x="132" y="182">{visual.base || 'a'}</text>
          <line x1="235" y1="42" x2="235" y2="145" className="fth-dimension-line"/>
          <text x="246" y="98">{visual.height || 'h'}</text>
          <path d="M270 92 H322" className="fth-rearrange-arrow"/>
          <text x="342" y="82">a·h</text>
          <text x="335" y="117">÷ 2</text>
        </svg>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'cubeLayers') {
    return (
      <div className="fth-concept-visual">
        <div className="fth-cube-layers">
          {Array.from({ length: visual.layers || 3 }, (_, layerIndex) => (
            <div className="fth-cube-layer" key={layerIndex}>
              <b>{layerIndex + 1}</b>
              <div style={{ gridTemplateColumns: `repeat(${visual.columns || 4}, 1fr)` }}>
                {Array.from({ length: (visual.columns || 4) * (visual.rows || 3) }, (_, index) => (
                  <span key={index}/>
                ))}
              </div>
            </div>
          ))}
        </div>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'equivalentFractions') {
    return (
      <div className="fth-equivalent-fractions">
        {(visual.pairs || []).map((pair, rowIndex) => (
          <div key={rowIndex}>
            {pair.map((fraction, index) => (
              <React.Fragment key={index}>
                <FractionBar
                  numerator={fraction.numerator}
                  denominator={fraction.denominator}
                  color={index ? 'green' : 'blue'}
                  label={localized(fraction.label, lang)}
                />
                {index < pair.length - 1 && <span className="fth-equals">=</span>}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === 'barModel') {
    return (
      <div className="fth-bar-model">
        {(visual.bars || []).map((bar, barIndex) => (
          <div className="fth-bar-model-row" key={barIndex}>
            <b>{localized(bar.label, lang)}</b>
            <div>
              {(bar.parts || []).map((part, partIndex) => (
                <span
                  className={`fth-bar-part fth-bar-part-${part.tone || 'blue'}`}
                  style={{ flex: part.size || 1 }}
                  key={partIndex}
                >
                  {mt(localized(part.value, lang))}
                </span>
              ))}
            </div>
          </div>
        ))}
        {visual.total && <p>{mt(localized(visual.total, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'circleCompare') {
    return (
      <div className="fth-circle-compare">
        <div>
          <span className="fth-outline-circle"/>
          <b>{localized(visual.leftLabel, lang)}</b>
        </div>
        <div>
          <span className="fth-filled-circle"/>
          <b>{localized(visual.rightLabel, lang)}</b>
        </div>
      </div>
    );
  }

  if (visual.type === 'foldSymmetry') {
    return (
      <div className="fth-concept-visual">
        <div className="fth-fold-symmetry">
          <span className="fth-fold-half fth-fold-left"/>
          <span className="fth-fold-half fth-fold-right"/>
          <i className="fth-fold-axis"/>
          <b className="fth-fold-point fth-fold-point-left">{visual.left || 'A'}</b>
          <b className="fth-fold-point fth-fold-point-right">{visual.right || 'A′'}</b>
          <em className="fth-fold-distance fth-fold-distance-left"/>
          <em className="fth-fold-distance fth-fold-distance-right"/>
        </div>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'centralRotation') {
    return (
      <div className="fth-concept-visual">
        <svg className="fth-central-rotation" viewBox="0 0 480 190" role="img" aria-label={localized(visual.label, lang)}>
          <circle cx="240" cy="95" r="8" className="fth-rotation-center"/>
          <line x1="95" y1="48" x2="385" y2="142" className="fth-rotation-line"/>
          <circle cx="95" cy="48" r="11" className="fth-rotation-point-a"/>
          <circle cx="385" cy="142" r="11" className="fth-rotation-point-b"/>
          <text x="71" y="40">A</text>
          <text x="397" y="158">A′</text>
          <text x="248" y="88">O</text>
          <path d="M168 119 A84 84 0 0 0 312 72" className="fth-rotation-arrow"/>
          <text x="214" y="166">180°</text>
        </svg>
        {visual.caption && <p className="small">{mt(localized(visual.caption, lang))}</p>}
      </div>
    );
  }

  if (visual.type === 'cube') {
    const caption = localized(visual.label, lang) || 'V = a · b · c';
    const isCube = String(caption).includes('a³');
    const edgeLabels = isCube ? ['a', 'a', 'a'] : ['a', 'b', 'c'];
    return (
      <div className="fth-cube-visual">
        <svg viewBox="0 0 360 235" role="img" aria-label={caption}>
          <polygon points="68,82 126,42 293,42 235,82" className="fth-solid-top"/>
          <polygon points="235,82 293,42 293,150 235,190" className="fth-solid-side"/>
          <polygon points="68,82 235,82 235,190 68,190" className="fth-solid-front"/>
          <polyline points="68,82 126,42 293,42 293,150 235,190 68,190 68,82 235,82 293,42" className="fth-solid-edge"/>
          <line x1="235" y1="82" x2="235" y2="190" className="fth-solid-edge"/>
          <line x1="68" y1="190" x2="126" y2="150" className="fth-solid-hidden"/>
          <line x1="126" y1="42" x2="126" y2="150" className="fth-solid-hidden"/>
          <line x1="126" y1="150" x2="293" y2="150" className="fth-solid-hidden"/>
          <text x="151" y="218" className="fth-solid-label">{edgeLabels[0]}</text>
          <text x="91" y="52" className="fth-solid-label">{edgeLabels[1]}</text>
          <text x="43" y="143" className="fth-solid-label">{edgeLabels[2]}</text>
        </svg>
        <b className="fth-cube-caption">{mt(caption)}</b>
      </div>
    );
  }

  if (visual.type === 'movementLine') {
    const min = visual.min ?? -10;
    const max = visual.max ?? 10;
    const span = Math.max(1, max - min);
    const position = (value) => `${((value - min) / span) * 100}%`;
    const start = visual.start ?? 0;
    const end = visual.end ?? start;
    const leftValue = Math.min(start, end);
    const ticks = Array.from({ length: span + 1 }, (_, index) => min + index);
    const direction = end >= start ? 'right' : 'left';
    return (
      <div
        className={`fth-movement-line is-${direction}`}
        role="img"
        aria-label={localized(visual.label, lang)}
      >
        <div className="fth-movement-axis"/>
        <div
          className="fth-movement-path"
          style={{
            left: position(leftValue),
            width: `${(Math.abs(end - start) / span) * 100}%`,
          }}
        >
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
            <path
              d={direction === 'right'
                ? 'M 0 27 Q 50 0 100 27 M 91 18 L 100 27 L 91 29'
                : 'M 100 27 Q 50 0 0 27 M 9 18 L 0 27 L 9 29'}
            />
          </svg>
        </div>
        {ticks.map((value) => (
          <span
            className={`fth-movement-tick${value === 0 ? ' is-zero' : ''}`}
            style={{ left: position(value) }}
            key={value}
          >
            <i/>
            {(value === min || value === max || value === 0 || value === start || value === end) && <b>{value}</b>}
          </span>
        ))}
        <span className="fth-movement-point is-start" style={{ left: position(start) }}>
          <i/><b>{localized(visual.startLabel, lang) || start}</b>
        </span>
        <span className="fth-movement-point is-end" style={{ left: position(end) }}>
          <i/><b>{localized(visual.endLabel, lang) || end}</b>
        </span>
        <p>{localized(visual.caption, lang)}</p>
      </div>
    );
  }

  if (visual.type === 'cards') {
    return (
      <div className="fth-cards">
        {visual.items.map((item, index) => {
          const tone = typeof item === 'object' && !item.uz && !item.ru ? item.color : null;
          const value = typeof item === 'object' && !item.uz && !item.ru ? item.label : item;
          return (
            <div
              className={[
                index === visual.highlight ? 'is-highlighted' : '',
                tone ? `fth-card-${tone}` : '',
              ].filter(Boolean).join(' ')}
              key={index}
            >
              {mt(localized(value, lang))}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

function FractionDrift({ items }) {
  const values = items?.length ? items : ['1/2', '2/3', '3/4', '4/5', '5/6', '7/8'];
  return (
    <div className="fth-drift" aria-hidden="true">
      {values.slice(0, 6).map((value, index) => {
        const parts = value.split('/');
        return (
          <span className={`fth-drift-${index + 1}`} key={`${value}-${index}`}>
            {parts.length === 2 ? <Frac n={parts[0]} d={parts[1]}/> : mt(value)}
          </span>
        );
      })}
    </div>
  );
}

function FactFractionIcon({ expression = '1/2 = 2/4' }) {
  return <div className="fth-fact-icon" aria-hidden="true">{mt(expression)}</div>;
}

function TitleScreen({ lesson, screen, totalScreens, onAnswer, onNext }) {
  const slide = lesson.slides[0];
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{
    id: `${lesson.id}_s0_topic`,
    text: slideNarration(slide, lang),
    trigger: 'on_mount',
    waits_for: null,
  }]);
  const [picked, setPicked] = useState(null);
  const pickedRef = useRef(false);
  const introDone = audio.muted || (audio.hasStarted && !audio.isBusy);
  const introStages = useIntroStages({ start: introDone, optionsReady: introDone });

  const pick = (value) => {
    if (pickedRef.current) return;
    pickedRef.current = true;
    setPicked(value);
    onAnswer({ stage: 'hook', screenIdx: screen, studentAnswer: value, correct: true });
    setTimeout(onNext, 240);
  };

  return (
    <Stage eyebrow={slide.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div className={`ttl-wrap${introStages.compact ? ' ttl-example-focus' : ''}`}>
        <Floaters/>
        <FractionDrift items={lesson.decorations}/>
        <p className="eyebrow ttl-kicker">{lang === 'uz' ? 'YANGI MAVZU' : 'НОВАЯ ТЕМА'}</p>
        <h1 className="display ttl-h1">{t(slide.title)}</h1>
        <span className="ttl-rule" aria-hidden="true"/>
        <p className="body ttl-sub">{t(slide.subtitle)}</p>
        {introStages.showExample && (
          <>
        <div className="ttl-hero fth-title-hero ttl-stage-reveal">
          <MathVisual visual={slide.visual} lang={lang}/>
        </div>
            <div className="ttl-prompt-slot">
            <p className={`small ttl-prompt${introStages.showPrompt ? ' is-visible' : ''}`}>
              {lang === 'uz' ? 'Boshlashga tayyormisiz?' : 'Готовы начать?'}
            </p>
            </div>
            <div className={`ttl-opts${introStages.showOptions ? ' is-visible' : ''}`}>
              <button className="option ttl-opt" disabled={picked !== null} onClick={() => pick('go')}>
                {lang === 'uz' ? 'Ha, boshlaymiz' : 'Да, начнём'}
              </button>
              <button className="option ttl-opt" disabled={picked !== null} onClick={() => pick('curious')}>
                {lang === 'uz' ? "Buni bilishni xohlayman" : 'Хочу разобраться'}
              </button>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
}

function RevealLessonScreen({ lesson, screen, ...props }) {
  const slide = lesson.slides[screen];
  const content = useMemo(() => ({
    eyebrow: slide.eyebrow,
    audio: {
      uz: revealNarration(slide, 'uz'),
      ru: revealNarration(slide, 'ru'),
    },
  }), [slide]);

  return (
    <RevealScreen
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={lesson.slides.length}
      renderStep={({ t, lang, step, refs }) => (
        <div className="rv-col g6-explanation-flow">
          <h2 className="title h-title g6-explanation-question fade-up">{mt(t(slide.title))}</h2>
          <div className="frame fade-up delay-1 fth-figure-frame">
            <MathVisual visual={slide.visual} lang={lang}/>
          </div>
          {slide.steps.slice(0, step + 1).map((line, index) => (
            <div ref={refs[index]} className="frame-tip g6-explanation-step fade-up" key={index}>
              <span className="g6-explanation-lamp" aria-hidden="true">💡</span>
              <p className="body g6-explanation-text">{mt(t(line))}</p>
            </div>
          ))}
        </div>
      )}
    />
  );
}

function SingleQuestionScreen({ lesson, screen, ...props }) {
  const slide = lesson.slides[screen];
  const lang = useLang();
  const options = (slide.options || []).map((option) => {
    const value = localized(option, lang);
    const rendered = mt(value);
    return /^\d+$/.test(value)
      ? <span className="fth-standalone-number">{rendered}</span>
      : rendered;
  });
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    correct_text: correctText(slide),
    wrong_default: slide.wrong,
    audio: {
      intro: slideNarrationByLanguage(slide),
      on_correct: { uz: "To'g'ri.", ru: 'Верно.' },
      on_wrong: slide.wrong,
    },
  };
  (slide.wrongByOption || []).forEach((wrongText, index) => {
    if (!wrongText) return;
    content[`wrong_${index}`] = wrongText;
    content[`audio_hint_${index}`] = wrongText;
  });
  const factAudio = slide.fact ? {
    uz: `Bilasizmi? ${slide.fact.uz}`,
    ru: `Знаете ли вы? ${slide.fact.ru}`,
  } : null;

  return (
    <QuestionScreen
      {...props}
      screen={screen}
      idx={screen}
      totalScreens={lesson.slides.length}
      screenMeta={{ scope: slide.scored ? 'practice' : 'hook' }}
      screenContent={content}
      titleNode={slide.title}
      question={<p className="body" style={{ color: T.ink2 }}>{mt(localized(slide.prompt, lang))}</p>}
      options={options}
      correctIdx={slide.correct}
      figure={lesson.etalonFlow && slide.visual
        ? (solved) => (solved ? null : <MathVisual visual={slide.visual} lang={lang}/>)
        : undefined}
      factOnCorrect={<WhyCard lines={{ uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) }}/>}
      factAudio={factAudio}
      interruptFeedbackOnSelection
      factNode={slide.fact ? (
        <FactCard
          text={slide.fact}
          badge={FACT_BADGE}
          anim={<FactFractionIcon expression={slide.factVisual || '1/2 = 2/4'}/>}
        />
      ) : null}
    />
  );
}

function MultiQuestionScreen({ lesson, screen, ...props }) {
  const slide = lesson.slides[screen];
  const lang = useLang();
  const optionValues = slide.options.map((option) => localized(option, lang));
  const correctValues = slide.correctSet.map((index) => optionValues[index]);
  const content = {
    eyebrow: slide.eyebrow,
    label: { uz: 'bir nechta javob', ru: 'несколько ответов' },
    context: {
      uz: "To'g'ri tanlovlar yashil bo'lib saqlanadi. Xato tanlovlarni qayta tekshiring.",
      ru: 'Верные варианты сохранятся зелёными. Ошибочные варианты проверьте ещё раз.',
    },
    question: slide.title,
    numbers: optionValues,
    divisors: correctValues,
    correct_text: correctText(slide),
    hint: slide.wrong,
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slideNarrationByLanguage(slide),
      on_correct: { uz: "To'g'ri, barcha javoblar topildi.", ru: 'Верно, все ответы найдены.' },
      on_wrong: slide.wrong,
    },
  };
  return (
    <PickDivisors
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={lesson.slides.length}
      retryMode
      whyNode={<WhyCard lines={content.why}/>}
    />
  );
}

function MatchQuestionScreen({ lesson, screen, ...props }) {
  const slide = lesson.slides[screen];
  const lang = useLang();
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    lead: slide.prompt,
    pairs: slide.rows.map((row) => ({
      number: localized(row.left, lang),
      label: row.label || { uz: 'mos javob', ru: 'подходящий ответ' },
      reading: row.correct,
    })),
    correct_text: correctText(slide),
    hint: slide.wrong,
    audio_hint: slide.wrong,
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slideNarrationByLanguage(slide),
      on_correct: { uz: "To'g'ri, barcha juftliklar joyida.", ru: 'Верно, все пары на своих местах.' },
      on_wrong: slide.wrong,
    },
  };
  return (
    <DragMatch
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={lesson.slides.length}
      factNode={<WhyCard lines={content.why}/>}
    />
  );
}

function ClassifyQuestionScreen({ lesson, screen, ...props }) {
  const slide = lesson.slides[screen];
  const lang = useLang();
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    lead: slide.prompt,
    bin_a: slide.binA,
    bin_b: slide.binB,
    cards: slide.cards.map((card) => ({ label: localized(card.label, lang), bin: card.value ? 'a' : 'b' })),
    hint: slide.wrong,
    audio_hint: slide.wrong,
    correct_text: correctText(slide),
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slideNarrationByLanguage(slide),
      on_correct: { uz: "To'g'ri, barcha kartalar ajratildi.", ru: 'Верно, все карточки распределены.' },
      on_wrong: { uz: 'Bu guruhga emas.', ru: 'Не в эту группу.' },
    },
  };
  return (
    <Classify
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={lesson.slides.length}
      whyNode={<WhyCard lines={content.why}/>}
    />
  );
}

// 8–46-darslar kirishi: mavzu e'loni emas, dars davomida tekshiriladigan
// mazmuniy taxmin. Birinchi muammoli savol shu yerda javobsiz ochiladi va
// tushuntirishlardan keyin o'z joyida yana uchrab, odatdagi feedback bilan
// mustaqil yechiladi.
function HookScreen({ lesson, screen, totalScreens, onAnswer, onNext }) {
  const titleSlide = lesson.slides[0];
  const hookSlide = lesson.slides.find((slide, index) => (
    index > 0 &&
    (slide?.type === 'question' || slide?.type === 'multi') &&
    Array.isArray(slide?.options) &&
    slide.options.length > 1
  ));
  const t = useT();
  const lang = useLang();
  const sourceOptions = hookSlide?.options || [
    { uz: 'Taxminim bor', ru: 'У меня есть предположение' },
    { uz: 'Dars davomida tekshiraman', ru: 'Проверю по ходу урока' },
  ];
  const options = sourceOptions.slice(0, 4);
  const hookTitle = hookSlide?.title || titleSlide.title;
  const hookPrompt = hookSlide?.prompt || titleSlide.subtitle;
  const hookVisual = hookSlide?.visual || titleSlide.visual;
  const audio = useAudio([{
    id: `${lesson.id}_hook`,
    text: [
      localized(hookTitle, lang),
      localized(hookPrompt, lang),
      lang === 'uz'
        ? 'Hozir taxmin qiling. Javobni dars davomida tekshiramiz.'
        : 'Сделайте предположение. Ответ проверим по ходу урока.',
    ].filter(Boolean).join(' '),
    trigger: 'on_mount',
    waits_for: { type: 'option_picked' },
  }]);
  const [picked, setPicked] = useState(null);
  const pickedRef = useRef(false);

  const pick = (index) => {
    if (pickedRef.current) return;
    pickedRef.current = true;
    setPicked(index);
    onAnswer({
      stage: 'hook',
      screenIdx: screen,
      question: localized(hookPrompt, lang),
      options: options.map((option) => localized(option, lang)),
      correctIndex: null,
      correctAnswer: null,
      studentAnswerIndex: index,
      studentAnswer: localized(options[index], lang),
      correct: null,
      firstTry: null,
    });
    audio.triggerEvent('option_picked');
    setTimeout(onNext, 320);
  };

  return (
    <Stage eyebrow={{ uz: 'Muammo', ru: 'Проблема' }} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div className="g6-hook">
        <Floaters/>
        <p className="eyebrow g6-hook-topic">{t(titleSlide.title)}</p>
        <h1 className="title g6-hook-title">{mt(t(hookTitle))}</h1>
        <p className="body g6-hook-prompt">{mt(t(hookPrompt))}</p>
        {hookVisual && (
          <div className="frame g6-hook-visual">
            <MathVisual visual={hookVisual} lang={lang}/>
          </div>
        )}
        <p className="small g6-hook-note">
          {lang === 'uz'
            ? 'Javobni hozir ochmaymiz — taxminingizni dars davomida tekshirasiz.'
            : 'Ответ пока не открываем — предположение проверим по ходу урока.'}
        </p>
        <div className="g6-hook-options">
          {options.map((option, index) => (
            <button
              className={`option${picked === index ? ' is-hook-picked' : ''}`}
              disabled={picked !== null}
              key={`${localized(option, lang)}-${index}`}
              onClick={() => pick(index)}
            >
              <span className="mono small">{String.fromCharCode(65 + index)}</span>
              <span>{mt(localized(option, lang))}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
}

function FinalChainScreen({
  lesson,
  screen,
  totalScreens,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
}) {
  const slide = lesson.slides[screen];
  const lang = useLang();
  const [partIndex, setPartIndex] = useState(storedAnswer?.complete ? slide.parts.length - 1 : 0);
  const [attempts, setAttempts] = useState(storedAnswer?.partAttempts || slide.parts.map(() => 0));
  const [firstTryCorrect, setFirstTryCorrect] = useState(
    storedAnswer?.firstTryParts || slide.parts.map(() => false),
  );
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [complete, setComplete] = useState(Boolean(storedAnswer?.complete));
  const transitionTimerRef = useRef(null);
  const part = slide.parts[partIndex];
  const audio = useAudio([{
    id: `${lesson.id}_final_intro`,
    text: slideNarration(slide, lang),
    trigger: 'on_mount',
    waits_for: null,
  }]);

  useEffect(() => () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
  }, []);

  const choose = (optionIndex) => {
    if (complete || picked !== null) return;
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    const isCorrect = optionIndex === part.correct;
    const nextAttempts = [...attempts];
    nextAttempts[partIndex] += 1;
    setAttempts(nextAttempts);
    setPicked(optionIndex);

    if (!isCorrect) {
      setFeedback(localized(part.wrong, lang));
      audio.speakLatestFeedback(
        localized(part.wrong, lang),
        `${lesson.id}_final_${partIndex}_wrong_${optionIndex}`,
      );
      transitionTimerRef.current = setTimeout(() => {
        transitionTimerRef.current = null;
        setPicked(null);
        setFeedback(null);
      }, 900);
      return;
    }

    const nextFirstTry = [...firstTryCorrect];
    if (nextAttempts[partIndex] === 1) nextFirstTry[partIndex] = true;
    setFirstTryCorrect(nextFirstTry);
    setFeedback(lang === 'uz' ? "To'g'ri." : 'Верно.');
    audio.speakLatestFeedback(
      lang === 'uz' ? "Javob to'g'ri." : 'Ответ верный.',
      `${lesson.id}_final_${partIndex}_correct`,
    );

    transitionTimerRef.current = setTimeout(() => {
      transitionTimerRef.current = null;
      if (partIndex < slide.parts.length - 1) {
        setPartIndex((value) => value + 1);
        setPicked(null);
        setFeedback(null);
        return;
      }
      const finalScore = nextFirstTry.filter(Boolean).length;
      const result = {
        stage: 'final',
        screenIdx: screen,
        question: localized(slide.title, lang),
        studentAnswer: nextFirstTry,
        correctAnswer: slide.parts.map((item) => item.correct),
        correct: finalScore >= (lesson.finalPass ?? 2),
        firstTry: finalScore >= (lesson.finalPass ?? 2),
        attempts: nextAttempts.reduce((sum, value) => sum + value, 0),
        conceptTag: 'rational_addition_final',
        finalScore,
        finalTotal: slide.parts.length,
        firstTryParts: nextFirstTry,
        partAttempts: nextAttempts,
        complete: true,
      };
      setComplete(true);
      onAnswer(result);
    }, 620);
  };

  const finalScore = complete
    ? (storedAnswer?.finalScore ?? firstTryCorrect.filter(Boolean).length)
    : firstTryCorrect.filter(Boolean).length;
  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext
        disabled={!complete || !audio.canAdvance}
        label={lang === 'uz' ? "Natijani ko'rish" : 'Посмотреть результат'}
        onClick={onNext}
      />
    </>
  );

  return (
    <Stage eyebrow={slide.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="fth-final-chain">
        <div className="fth-final-head">
          <div>
            <p className="small mono">{lang === 'uz' ? 'FINAL' : 'ФИНАЛ'}</p>
            <h2 className="title h-sub">{localized(slide.title, lang)}</h2>
          </div>
          <strong>{complete ? `${finalScore}/${slide.parts.length}` : `${partIndex + 1}/${slide.parts.length}`}</strong>
        </div>
        <div className="fth-final-progress" aria-hidden="true">
          {slide.parts.map((_, index) => (
            <i className={index < partIndex || complete ? 'is-done' : index === partIndex ? 'is-current' : ''} key={index}/>
          ))}
        </div>
        <div className="frame fth-final-card" key={partIndex}>
          <p className="body">{localized(part.prompt, lang)}</p>
          <div className="fth-final-options">
            {part.options.map((option, index) => {
              const selected = picked === index;
              const stateClass = selected ? (index === part.correct ? 'is-correct' : 'is-wrong') : '';
              return (
                <button
                  className={`option ${stateClass}`}
                  disabled={complete || picked !== null}
                  onClick={() => choose(index)}
                  key={`${option}-${index}`}
                >
                  {mt(localized(option, lang))}
                </button>
              );
            })}
          </div>
          <div className={`fth-final-feedback${feedback ? ' is-visible' : ''}`} aria-live="polite">
            {feedback || '\u00A0'}
          </div>
        </div>
        {complete && (
          <div className={finalScore >= (lesson.finalPass ?? 2) ? 'frame-success' : 'frame-warn'}>
            <p className="body">
              {finalScore >= (lesson.finalPass ?? 2)
                ? (lang === 'uz' ? `Final bajarildi: ${finalScore}/3.` : `Финал пройден: ${finalScore}/3.`)
                : (lang === 'uz' ? `Final natijasi: ${finalScore}/3. Qoidalarni qayta ko'rib chiqing.` : `Результат финала: ${finalScore}/3. Повторите правила.`)}
            </p>
          </div>
        )}
      </div>
    </Stage>
  );
}

function SummaryScreen({ lesson, screen, totalScreens, answers, onPrev, finishLesson }) {
  const slide = lesson.slides[lesson.slides.length - 1];
  const lang = useLang();
  const t = useT();
  const score = lesson.scoredScreens.filter((index) => answers[index]?.firstTry === true).length;
  const scorePercent = lesson.scoredScreens.length
    ? Math.round((score / lesson.scoredScreens.length) * 100)
    : 0;
  const passPercent = lesson.passPercent ?? 70;
  const finalAnswer = answers.find((answer) => answer?.stage === 'final');
  const finalScore = finalAnswer?.finalScore ?? 0;
  const passed = scorePercent >= passPercent
    && (lesson.finalPass === undefined || finalScore >= lesson.finalPass);
  const audio = useAudio([{
    id: `${lesson.id}_summary`,
    text: slideNarration(slide, lang),
    trigger: 'on_mount',
    waits_for: null,
  }]);
  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext
        disabled={!audio.canAdvance}
        label={lang === 'uz' ? 'Darsni yakunlash' : 'Завершить урок'}
        onClick={finishLesson}
      />
    </>
  );

  return (
    <Stage eyebrow={slide.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="fth-summary g6-final-slide">
        <div className="sm-head fade-up">
          <h2 className="title h-sub">{t(slide.title)}</h2>
        </div>
        <p className="small fade-up sm-result" style={{ margin: 0, color: T.ink3 }}>
          <span>{lang === 'uz' ? "Topshiriqlar bo'yicha natijangiz:" : 'Ваш результат по заданиям:'}</span>
          <strong className="sm-score fth-score">{score}/{lesson.scoredScreens.length}</strong>
        </p>
        {lesson.etalonFlow && (
          <p className={`fth-pass-note ${passed ? 'is-passed' : 'is-review'} fade-up`}>
            {passed
              ? (lang === 'uz' ? `Ajoyib, natijangiz ${scorePercent}%.` : `Отлично, ваш результат — ${scorePercent}%.`)
              : (lang === 'uz'
                ? `Natijangiz ${scorePercent}%. Qoidalarni yana bir ko'rib, qayta urinib ko'ring.`
                : `Ваш результат — ${scorePercent}%. Повторите правила и попробуйте ещё раз.`)}
          </p>
        )}
        {lesson.finalPass !== undefined && (
          <p className="fth-final-summary">
            {lang === 'uz' ? 'Final natijasi' : 'Результат финала'}: <b>{finalScore}/3</b>
          </p>
        )}
        <div className="frame sm-main fade-up delay-1">
          <p className="small mono fth-main-label">{lang === 'uz' ? 'Asosiysi' : 'Главное'}</p>
          <div className="fth-summary-list">
            {slide.points.map((point, index) => (
              <div key={index}><span>{index + 1}</span><p className="body">{mt(t(point))}</p></div>
            ))}
          </div>
        </div>
        <div className="frame-success sm-close fade-up delay-2">
          <p className="body">{localized(slide.close, lang)}</p>
        </div>
      </div>
    </Stage>
  );
}

const FRACTION_THEORY_STYLES = `
.fth-etalon {
  --etalon-orange: #F97316;
  --etalon-navy: #173B57;
  --etalon-bg: #FFFDF8;
  --etalon-card: #FFFFFF;
  --etalon-rule: #FFF2D6;
  --etalon-info: #EEF7FF;
  --etalon-correct: #EAF8EE;
  --etalon-error: #FDECEC;
  --etalon-border: #E2E8F0;
  --etalon-text: #1F2937;
  --etalon-muted: #64748B;
  color: var(--etalon-text);
  background-color: var(--etalon-bg);
  background-image:
    linear-gradient(rgba(23,59,87,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23,59,87,.025) 1px, transparent 1px),
    linear-gradient(180deg, #FFFDF8 0%, #FFF8EF 100%);
  background-size: 32px 32px, 32px 32px, 100% 100%;
}
.fth-etalon .lesson-shell { width: min(100%, 1080px); }
.fth-etalon .fth-drift { display: none; }
.fth-etalon h1,
.fth-etalon h2,
.fth-etalon h3 { color: var(--etalon-navy); }
.fth-etalon p { color: var(--etalon-muted); font-size: clamp(16px,2.25vw,18px); }
.fth-etalon .eyebrow,
.fth-etalon .stage-eyebrow { color: var(--etalon-orange); }
.fth-etalon button { min-height: 44px; }
.fth-etalon .primary-btn,
.fth-etalon .btn-primary {
  background: var(--etalon-orange);
  border-color: var(--etalon-orange);
}
.fth-etalon .paper,
.fth-etalon .card,
.fth-etalon .q-card,
.fth-etalon .result-card {
  background: var(--etalon-card);
  border-color: var(--etalon-border);
}
.fth-etalon .fth-panel-yellow { background: #FFF8E6; border-color: #FED7AA; }
.fth-etalon .fth-panel-blue { background: var(--etalon-info); border-color: #BFDBFE; }
.fth-etalon .fth-panel-green { background: var(--etalon-correct); border-color: #BBE2C5; }
.fth-etalon .fth-movement-axis { background: var(--etalon-navy); }
.fth-etalon .fth-movement-path {
  transform: scaleX(0);
  animation: etalonPathReveal 360ms ease-out 120ms forwards;
}
.fth-etalon .fth-movement-line.is-right .fth-movement-path { transform-origin: left center; }
.fth-etalon .fth-movement-line.is-left .fth-movement-path { transform-origin: right center; }
.fth-etalon .fth-movement-path path { stroke: var(--etalon-orange); }
.fth-etalon .fth-movement-point.is-start > i { background: var(--etalon-navy); }
.fth-etalon .fth-movement-point.is-end > i {
  background: var(--etalon-orange);
  box-shadow: 0 0 0 3px rgba(249,115,22,.18);
  animation: etalonPointArrive 280ms ease-out 420ms both;
}
@keyframes etalonPathReveal { to { transform: scaleX(1); } }
@keyframes etalonPointArrive {
  from { opacity: 0; transform: scale(.6); }
  to { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .fth-etalon *,
  .fth-etalon *::before,
  .fth-etalon *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
  .fth-etalon .fth-movement-path { transform: scaleX(1); }
}
.fth-lesson .frac,
.fth-lesson .frac .n,
.fth-lesson .frac .d {
  font-family: inherit;
  font-variation-settings: inherit;
  font-weight: inherit;
}
.fth-lesson .fth-standalone-number {
  font-family: 'JetBrains Mono', monospace;
  font-variation-settings: normal;
  font-weight: 700;
}
.fth-title-hero { width: 100%; max-width: 520px; }
.fth-figure-frame { display: flex; align-items: center; justify-content: center; min-height: clamp(100px, 19vw, 150px); padding: clamp(12px, 2.4vw, 20px); height: auto; max-height: none; overflow: hidden; box-sizing: border-box; }
.g6-hook-visual > *,
.fth-figure-frame > * { max-width: 100%; }
.fth-equation { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0.22em; color: #0E0E10; font-family: 'Fraunces', 'Source Serif 4', serif; font-size: clamp(27px, 5.2vw, 40px); font-weight: 600; line-height: 1.25; text-align: center; }
.fth-equation .frac-sm, .fth-chain .frac-sm, .fth-cards .frac-sm { font-size: 1em; }
.fth-equation .mnum, .fth-chain .mnum, .fth-cards .mnum { font-family: inherit; font-size: 1em; font-weight: inherit; }
.fth-chain { width: 100%; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(7px, 1.8vw, 14px); font-family: 'Fraunces', 'Source Serif 4', serif; font-size: clamp(24px, 4.8vw, 36px); font-weight: 600; }
.fth-chain > span { display: inline-flex; align-items: center; padding: 7px 11px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 5px 14px -8px rgba(58,53,48,.35); }
.fth-chain > span.is-final { color: #1F7A4D; background: #E3F0E8; }
.fth-chain > b { color: #FF4F28; font: 700 clamp(18px,3.7vw,27px) 'JetBrains Mono', monospace; }
.fth-bars { width: 100%; display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: clamp(8px,2vw,17px); }
.fth-bar-wrap { display: flex; flex-direction: column; gap: 7px; }
.fth-bar-label { margin: 0; text-align: center; color: #5A5A60; }
.fth-bar { min-height: clamp(44px,8vw,62px); display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; overflow: hidden; border: 2px solid #494550; border-radius: 12px; background: #FFFFFF; }
.fth-bar span { border-right: 1.5px solid #8A8883; }
.fth-bar span:last-child { border-right: none; }
.fth-bar-accent span.filled { background: #FFE8E1; }
.fth-bar-blue span.filled { background: #EAF6FB; }
.fth-bar-green span.filled { background: #E3F0E8; }
.fth-equals { color: #8A8883; font: 700 clamp(24px,5vw,36px) 'JetBrains Mono', monospace; }
.fth-panels { width: 100%; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
.fth-panel { min-width: 0; padding: clamp(10px,2vw,16px); border-radius: 14px; background: #FFF2ED; border: 1.5px solid rgba(255,79,40,.24); }
.fth-panel-blue { background: #EAF6FB; border-color: rgba(1,154,203,.24); }
.fth-panel-yellow { background: #FFF7CF; border-color: rgba(215,166,32,.32); }
.fth-panel-green { background: #E3F0E8; border-color: rgba(31,122,77,.28); }
.fth-panel > p { margin: 0 0 8px; color: #5A5A60; text-transform: uppercase; letter-spacing: .06em; }
.fth-panel-line { padding: 4px 0; font-family: 'Fraunces','Source Serif 4',serif; font-size: clamp(18px,3.4vw,26px); font-weight: 600; text-align: center; }
.fth-panel-line .frac-sm { font-size: 1em; }
.fth-mini-steps { width: 100%; display: flex; flex-direction: column; gap: 8px; }
.fth-mini-steps > div { display: grid; grid-template-columns: 27px 1fr; align-items: center; gap: 10px; padding: 8px 11px; border-radius: 12px; background: #FFFFFF; }
.fth-mini-steps > div > span, .fth-step-number { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: #FF4F28; color: #FFFFFF; font: 700 12px 'JetBrains Mono',monospace; }
.fth-mini-steps p { margin: 0; color: #0E0E10; font-family: 'Source Serif 4',serif; font-size: clamp(16px,2.8vw,21px); font-weight: 600; }
.fth-step-number { margin-right: 9px; vertical-align: 2px; }
.rv-lbl-b .fth-step-number { background: #1F7A4D; }
.fth-number-line { position: relative; width: 100%; height: 96px; padding-top: 34px; }
.fth-number-line-axis { position: absolute; left: 3%; right: 3%; top: 45px; height: 4px; border-radius: 4px; background: #494550; }
.fth-number-point { position: absolute; top: 33px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; }
.fth-number-point i { width: 4px; height: 26px; border-radius: 4px; background: #FF4F28; }
.fth-number-point span { color: #0E0E10; font-family: 'Fraunces',serif; font-size: clamp(17px,3vw,23px); font-weight: 600; }
.fth-movement-line { position:relative; width:min(100%,620px); min-height:132px; margin:0 auto; padding:56px 18px 30px; }
.fth-movement-axis { position:absolute; left:18px; right:18px; top:66px; height:4px; border-radius:4px; background:#494550; }
.fth-movement-path { position:absolute; top:34px; height:30px; }
.fth-movement-path svg { display:block; width:100%; height:100%; overflow:visible; }
.fth-movement-path path { fill:none; stroke:#019ACB; stroke-width:5; stroke-linecap:round; stroke-linejoin:round; vector-effect:non-scaling-stroke; }
.fth-movement-tick { position:absolute; top:61px; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:7px; }
.fth-movement-tick > i { width:2px; height:14px; background:#8A8883; }
.fth-movement-tick > b { color:#5A5A60; font:600 12px 'JetBrains Mono',monospace; }
.fth-movement-tick.is-zero > i { width:3px; height:19px; background:#0E0E10; }
.fth-movement-point { position:absolute; top:51px; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:10px; z-index:2; }
.fth-movement-point > i { width:16px; height:16px; border:3px solid #FFF; border-radius:50%; background:#FF4F28; box-shadow:0 0 0 3px rgba(255,79,40,.18); }
.fth-movement-point.is-end > i { background:#1F7A4D; box-shadow:0 0 0 3px rgba(31,122,77,.18); }
.fth-movement-point > b { padding:3px 7px; border-radius:8px; background:#FFF; color:#0E0E10; font:700 13px 'JetBrains Mono',monospace; box-shadow:0 4px 12px -8px rgba(58,53,48,.5); }
.fth-movement-line > p { position:absolute; left:12px; right:12px; bottom:0; margin:0; color:#5A5A60; font:600 clamp(13px,2.2vw,16px)/1.35 'Source Serif 4',serif; text-align:center; }
.fth-coordinate-plane { position: relative; width: min(100%,360px); max-width: 100%; aspect-ratio: 1.65; overflow: hidden; border-radius: 14px; background-color: #FFF; background-image: linear-gradient(rgba(1,154,203,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(1,154,203,.12) 1px,transparent 1px); background-size: 8% 16%; border: 1.5px solid rgba(1,154,203,.24); box-sizing: border-box; }
.g6-hook-visual .fth-coordinate-plane,
.fth-figure-frame .fth-coordinate-plane { width: min(100%, min(360px, 72vw)); }
.fth-axis { position: absolute; background: #494550; }
.fth-axis-x { left: 4%; right: 4%; top: 50%; height: 2px; }
.fth-axis-y { top: 5%; bottom: 5%; left: 50%; width: 2px; }
.fth-axis-label { position: absolute; font: 700 15px 'JetBrains Mono',monospace; }
.fth-axis-label-x { right: 5%; top: calc(50% + 7px); }
.fth-axis-label-y { left: calc(50% + 8px); top: 4%; }
.fth-plane-point { position: absolute; transform: translate(-50%,-50%); color: #FF4F28; }
.fth-plane-point i { display: block; width: 11px; height: 11px; border-radius: 50%; background: currentColor; box-shadow: 0 0 0 4px rgba(255,79,40,.15); }
.fth-plane-point em { position: absolute; left: 12px; top: -18px; white-space: nowrap; color: #0E0E10; font: 600 13px 'JetBrains Mono',monospace; font-style: normal; }
.fth-plane-point-blue { color: #019ACB; }
.fth-plane-point-green { color: #1F7A4D; }
.fth-circle-visual { display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; width: 100%; max-width: 100%; }
.fth-circle-shape { position: relative; width: min(100%, clamp(110px, 22vw, 160px)); aspect-ratio: 1; border: 5px solid #019ACB; border-radius: 50%; background: radial-gradient(circle at center,#FFF7CF 0 55%,#EAF6FB 56%); box-sizing: border-box; }
.g6-hook-visual .fth-circle-shape,
.fth-figure-frame .fth-circle-shape { width: min(100%, clamp(110px, 20vw, 150px)); max-width: 150px; }
.fth-circle-center { position: absolute; left: 50%; top: 50%; width: 10px; height: 10px; border-radius: 50%; background: #FF4F28; transform: translate(-50%,-50%); z-index: 2; }
.fth-circle-segment { position: absolute; top: calc(50% - 2px); height: 4px; background: #FF4F28; transform-origin: left center; }
.fth-circle-segment-radius { left: 50%; width: 44%; transform: rotate(-25deg); }
.fth-circle-segment-diameter { left: 5%; width: 90%; transform: none; }
.fth-circle-o { position: absolute; left: calc(50% - 18px); top: calc(50% + 7px); }
.fth-circle-shape em { position: absolute; right: 18%; top: 27%; font: 700 18px 'Fraunces',serif; font-style: normal; color: #FF4F28; }
.fth-circle-visual p { max-width: 220px; margin: 0; }
.fth-geometry-visual { width: min(100%,360px); max-width: 100%; }
.fth-geometry-visual svg { width: 100%; max-height: 190px; overflow: visible; }
.g6-hook-visual .fth-geometry-visual svg,
.fth-figure-frame .fth-geometry-visual svg { max-height: min(190px, 100%); overflow: hidden; }
.fth-triangle-fill { fill: #FFF7CF; stroke: #019ACB; stroke-width: 5; stroke-linejoin: round; }
.fth-height-line { stroke: #FF4F28; stroke-width: 4; stroke-dasharray: 8 6; }
.fth-right-mark { fill: none; stroke: #494550; stroke-width: 3; }
.fth-geometry-visual text { fill: #0E0E10; font: 700 16px 'JetBrains Mono',monospace; }
.fth-symmetry-visual { position: relative; width: min(100%,420px); min-height: 145px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; padding-bottom: 24px; }
.fth-symmetry-axis { position: absolute; left: 50%; top: 0; bottom: 24px; border-left: 3px dashed #FF4F28; }
.fth-symmetry-half { padding: 18px 12px; border-radius: 45% 12px 45% 12px; background: #EAF6FB; text-align: center; font: 700 clamp(22px,5vw,34px) 'Fraunces',serif; }
.fth-symmetry-right { transform: scaleX(-1); background: #FFF7CF; }
.fth-symmetry-visual p { position: absolute; left: 0; right: 0; bottom: 0; margin: 0; text-align: center; }
.fth-color-tiles-visual { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.fth-color-tiles { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(10px,2.3vw,18px); }
.fth-color-tile { width: clamp(54px,10vw,78px); aspect-ratio: 1; border: 3px solid rgba(73,69,80,.28); border-radius: 14px; box-shadow: 0 8px 18px -12px rgba(14,14,16,.55); }
.fth-color-tile-blue { background: #45B7DC; }
.fth-color-tile-yellow { background: #F7D857; }
.fth-color-tile-green { background: #63B985; }
.fth-color-tile-accent { background: #FF795A; }
.fth-color-tiles-visual p { margin: 0; text-align: center; }
.fth-table-wrap { width: min(100%,560px); overflow-x: auto; border: 1.5px solid rgba(1,154,203,.24); border-radius: 15px; background: #FFFFFF; box-shadow: 0 8px 22px -18px rgba(14,14,16,.5); }
.fth-data-table { width: 100%; border-collapse: collapse; color: #0E0E10; font-family: 'Source Serif 4',serif; font-size: clamp(14px,2.5vw,18px); text-align: center; }
.fth-data-table caption { padding: 8px 12px; background: #FFF7CF; color: #494550; font-weight: 700; }
.fth-data-table th { padding: 9px 12px; background: #EAF6FB; border-bottom: 2px solid rgba(1,154,203,.3); font-weight: 700; }
.fth-data-table td { padding: 8px 12px; border-top: 1px solid #E6E1D6; }
.fth-data-table th + th, .fth-data-table td + td { border-left: 1px solid #E6E1D6; }
.fth-data-table tbody tr:nth-child(even) { background: #FAF8F3; }
.fth-data-table tbody tr.is-highlighted { background: #E3F0E8; color: #1F7A4D; font-weight: 700; }
.fth-data-table td.is-highlighted-cell { background: #E3F0E8; color: #1F7A4D; font-weight: 700; }
.fth-map-route { position: relative; width: min(100%,470px); min-height: 180px; overflow: hidden; border: 2px solid rgba(1,154,203,.24); border-radius: 18px; background: #EAF6FB; background-image: linear-gradient(28deg,transparent 48%,rgba(31,122,77,.14) 49% 55%,transparent 56%),linear-gradient(-32deg,transparent 58%,rgba(31,122,77,.12) 59% 65%,transparent 66%); }
.fth-map-road { position: absolute; height: 9px; border-radius: 9px; background: #FFFFFF; border: 1px solid #B9B4AA; transform-origin: left center; }
.fth-map-road-a { width: 58%; left: 17%; top: 62%; transform: rotate(-24deg); }
.fth-map-road-b { width: 35%; left: 50%; top: 40%; transform: rotate(29deg); }
.fth-map-pin { position: absolute; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50% 50% 50% 6px; transform: rotate(-45deg); background: #FF4F28; color: #FFF; font: 700 14px 'JetBrains Mono',monospace; z-index: 3; }
.fth-map-pin > b { transform: rotate(45deg); }
.fth-map-pin-a { left: 12%; bottom: 24%; }
.fth-map-pin-b { right: 13%; top: 17%; background: #019ACB; }
.fth-map-dots { position: absolute; left: 22%; right: 21%; top: 48%; border-top: 4px dashed #FF4F28; transform: rotate(-21deg); }
.fth-map-note { position: absolute; right: 10px; bottom: 10px; display: grid; gap: 3px; padding: 7px 10px; border-radius: 10px; background: rgba(255,255,255,.94); text-align: right; }
.fth-map-note b, .fth-map-note span, .fth-map-note em { font: 700 12px 'JetBrains Mono',monospace; font-style: normal; }
.fth-map-note em { color: #1F7A4D; }
.fth-price-tag { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(10px,2.5vw,18px); padding: clamp(16px,3vw,24px); border: 3px solid #F0C43C; border-radius: 18px; background: #FFF7CF; font-family: 'Fraunces','Source Serif 4',serif; font-size: clamp(23px,4.5vw,34px); font-weight: 700; }
.fth-price-old { color: #68646E; text-decoration: line-through 3px #FF4F28; }
.fth-price-tag b { padding: 6px 10px; border-radius: 10px; background: #FF4F28; color: #FFF; font: 700 clamp(15px,3vw,21px) 'JetBrains Mono',monospace; }
.fth-price-arrow { color: #8A8883; }
.fth-price-tag strong { color: #1F7A4D; }
.fth-balance { position: relative; width: min(100%,440px); min-height: 175px; padding-bottom: 25px; }
.fth-balance-beam { position: absolute; left: 7%; right: 7%; top: 52px; height: 6px; border-radius: 6px; background: #494550; }
.fth-balance-beam > i { position: absolute; left: 50%; top: 0; width: 6px; height: 86px; background: #494550; transform: translateX(-50%); }
.fth-balance-pan { position: absolute; top: 18px; display: flex; align-items: center; justify-content: center; min-width: 102px; min-height: 50px; padding: 8px 12px; border: 3px solid #019ACB; border-radius: 10px 10px 45px 45px; background: #EAF6FB; font: 700 clamp(20px,4vw,29px) 'Fraunces',serif; }
.fth-balance-left { left: -4%; }
.fth-balance-right { right: -4%; border-color: #FF4F28; background: #FFF2ED; }
.fth-balance-stand { position: absolute; left: 50%; bottom: 25px; width: 112px; height: 16px; border-radius: 50%; background: #494550; transform: translateX(-50%); }
.fth-balance > p { position: absolute; left: 0; right: 0; bottom: 0; margin: 0; color: #1F7A4D; text-align: center; font-weight: 700; }
.fth-concept-visual { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.fth-concept-visual > p { margin: 0; text-align: center; }
.fth-fraction-area { width: min(100%,390px); display: grid; border: 3px solid #494550; border-radius: 12px; overflow: hidden; background: #FFF; }
.fth-fraction-area > span { min-height: clamp(37px,7vw,54px); border-right: 1.5px solid #8A8883; border-bottom: 1.5px solid #8A8883; }
.fth-fraction-area > span.is-base { background: #FFF7CF; }
.fth-fraction-area > span.is-overlap { background: #63B985; box-shadow: inset 0 0 0 3px rgba(31,122,77,.18); }
.fth-ribbon-cut { width: min(100%,620px); display: grid; overflow: hidden; border: 3px solid #494550; border-radius: 12px; background: #FFF; }
.fth-ribbon-cut > span { position: relative; min-width: 48px; min-height: 74px; display: flex; align-items: center; justify-content: center; border-right: 2px solid #8A8883; }
.fth-ribbon-cut > span:last-child { border-right: none; }
.fth-ribbon-cut > span.is-filled { background: #FFE8E1; }
.fth-ribbon-cut b { color: #FF4F28; font: 700 16px 'JetBrains Mono',monospace; }
.fth-ribbon-cut em { position: absolute; left: 2px; right: 2px; bottom: 4px; color: #5A5A60; font: 600 9px 'JetBrains Mono',monospace; font-style: normal; text-align: center; }
.fth-percent-grid { width: clamp(180px,35vw,260px); aspect-ratio: 1; display: grid; grid-template-columns: repeat(10,1fr); overflow: hidden; border: 3px solid #494550; border-radius: 10px; background: #FFF; }
.fth-percent-grid > span { border-right: 1px solid #B9B4AA; border-bottom: 1px solid #B9B4AA; }
.fth-percent-grid > span.is-filled { background: #F7D857; }
.fth-group-boxes { width: 100%; display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 9px; }
.fth-group-box { min-width: 0; min-height: 105px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 10px 6px; border: 3px solid #019ACB; border-radius: 14px 14px 24px 24px; background: #EAF6FB; box-shadow: inset 0 -8px 0 rgba(1,154,203,.08); }
.fth-notebook-stack { min-width: 42px; padding: 6px 9px; border: 2px solid #494550; border-radius: 5px; background: #FFF7CF; box-shadow: 4px 4px 0 #FFF,6px 6px 0 #494550; font: 700 clamp(18px,3vw,25px) 'Fraunces',serif; text-align: center; }
.fth-pencil-dots { display: flex; gap: 5px; }
.fth-pencil-dots i { width: 8px; height: 30px; border-radius: 5px 5px 2px 2px; background: #FF795A; transform: rotate(8deg); }
.fth-concept-formula { padding: 6px 12px; border-radius: 10px; background: #E3F0E8; color: #1F7A4D; font: 700 clamp(21px,4vw,29px) 'Fraunces',serif; }
.fth-circle-rearrange, .fth-angle-sum, .fth-triangle-pair { width: min(100%,520px); max-height: 190px; overflow: visible; }
.g6-hook-visual :is(.fth-circle-rearrange, .fth-angle-sum, .fth-triangle-pair),
.fth-figure-frame :is(.fth-circle-rearrange, .fth-angle-sum, .fth-triangle-pair) { max-width: 100%; overflow: hidden; }
.fth-sector-circle { fill: #FFF7CF; stroke: #019ACB; stroke-width: 4; }
.fth-sector-ray { stroke: #FF4F28; stroke-width: 2; }
.fth-rearrange-arrow { fill: none; stroke: #494550; stroke-width: 5; stroke-linecap: round; }
.fth-sector-strip { fill: #FFF7CF; stroke: #019ACB; stroke-width: 4; stroke-linejoin: round; }
.fth-dimension-line { fill: none; stroke: #494550; stroke-width: 2.5; stroke-linecap: round; }
.fth-circle-rearrange text, .fth-angle-sum text, .fth-triangle-pair text { fill: #0E0E10; font: 700 17px 'JetBrains Mono',monospace; }
.fth-angle-triangle { fill: #EAF6FB; stroke: #494550; stroke-width: 4; stroke-linejoin: round; }
.fth-angle-a { fill: #F7D857; stroke: #D7A620; stroke-width: 2; }
.fth-angle-b { fill: #63B985; stroke: #1F7A4D; stroke-width: 2; }
.fth-angle-c { fill: #FF9C84; stroke: #FF4F28; stroke-width: 2; }
.fth-straight-angle { fill: none; stroke: rgba(73,69,80,.2); stroke-width: 19; }
.fth-straight-a { fill: none; stroke: #D7A620; stroke-width: 12; }
.fth-straight-b { fill: none; stroke: #1F7A4D; stroke-width: 12; }
.fth-straight-c { fill: none; stroke: #FF4F28; stroke-width: 12; }
.fth-pair-triangle-a { fill: #EAF6FB; stroke: #019ACB; stroke-width: 4; stroke-linejoin: round; }
.fth-pair-triangle-b { fill: #FFF7CF; stroke: #FF4F28; stroke-width: 4; stroke-linejoin: round; }
.fth-cube-layers { width: min(100%,510px); display: flex; align-items: center; justify-content: center; gap: clamp(8px,2vw,16px); }
.fth-cube-layer { position: relative; flex: 1; max-width: 150px; padding: 9px; border: 2px solid #019ACB; border-radius: 12px; background: #EAF6FB; box-shadow: 5px 5px 0 rgba(1,154,203,.16); }
.fth-cube-layer > b { position: absolute; left: 5px; top: 5px; z-index: 2; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #FF4F28; color: #FFF; font: 700 11px 'JetBrains Mono',monospace; }
.fth-cube-layer > div { display: grid; gap: 2px; }
.fth-cube-layer span { aspect-ratio: 1; border: 1.5px solid #494550; border-radius: 3px; background: #FFF7CF; }
.fth-equivalent-fractions { width: 100%; display: grid; gap: 10px; }
.fth-equivalent-fractions > div { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: 9px; }
.fth-bar-model { width: min(100%,520px); display: flex; flex-direction: column; gap: 11px; }
.fth-bar-model-row { display: grid; grid-template-columns: 92px 1fr; align-items: center; gap: 10px; }
.fth-bar-model-row > b { color: #5A5A60; font: 700 13px 'Source Serif 4',serif; text-align: right; }
.fth-bar-model-row > div { min-height: 48px; display: flex; overflow: hidden; border: 2px solid #494550; border-radius: 11px; }
.fth-bar-part { display: flex; align-items: center; justify-content: center; min-width: 48px; border-right: 2px solid #494550; font: 700 clamp(19px,3.5vw,27px) 'Fraunces',serif; }
.fth-bar-part:last-child { border-right: none; }
.fth-bar-part-blue { background: #EAF6FB; }
.fth-bar-part-yellow { background: #FFF7CF; }
.fth-bar-model > p { align-self: flex-end; margin: 0; padding: 5px 10px; border-radius: 9px; background: #E3F0E8; color: #1F7A4D; font-weight: 700; }
.fth-circle-compare { width: min(100%,470px); display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.fth-circle-compare > div { display: flex; flex-direction: column; align-items: center; gap: 9px; }
.fth-outline-circle, .fth-filled-circle { width: clamp(105px,21vw,150px); aspect-ratio: 1; border: 7px solid #019ACB; border-radius: 50%; }
.fth-outline-circle { background: #FFF; }
.fth-filled-circle { background: #FFF7CF; box-shadow: inset 0 0 0 5px rgba(255,79,40,.12); }
.fth-circle-compare b { color: #494550; font: 700 clamp(14px,2.5vw,18px) 'Source Serif 4',serif; text-align: center; }
.fth-fold-symmetry { position: relative; width: min(100%,430px); height: 170px; perspective: 600px; }
.fth-fold-half { position: absolute; top: 15px; bottom: 15px; width: 42%; border: 3px solid #019ACB; background: #EAF6FB; }
.fth-fold-left { left: 8%; border-radius: 70px 12px 12px 70px; }
.fth-fold-right { right: 8%; border-radius: 12px 70px 70px 12px; background: #FFF7CF; }
.fth-fold-axis { position: absolute; left: 50%; top: 0; bottom: 0; border-left: 4px dashed #FF4F28; }
.fth-fold-point { position: absolute; top: 73px; display: flex; align-items: center; justify-content: center; width: 31px; height: 31px; border-radius: 50%; background: #1F7A4D; color: #FFF; font: 700 13px 'JetBrains Mono',monospace; }
.fth-fold-point-left { left: 20%; }
.fth-fold-point-right { right: 20%; }
.fth-fold-distance { position: absolute; top: 87px; width: 27%; border-top: 3px dotted #494550; }
.fth-fold-distance-left { left: 23%; }
.fth-fold-distance-right { right: 23%; }
.fth-central-rotation { width: min(100%,480px); max-height: 190px; overflow: visible; }
.fth-rotation-center { fill: #0E0E10; }
.fth-rotation-line { stroke: #494550; stroke-width: 3; stroke-dasharray: 8 6; }
.fth-rotation-point-a { fill: #FF4F28; }
.fth-rotation-point-b { fill: #019ACB; }
.fth-rotation-arrow { fill: none; stroke: #1F7A4D; stroke-width: 5; stroke-linecap: round; stroke-dasharray: 10 7; }
.fth-central-rotation text { fill: #0E0E10; font: 700 17px 'JetBrains Mono',monospace; }
.fth-data-bars { width: min(100%,420px); min-height: 160px; display: flex; align-items: flex-end; justify-content: center; gap: clamp(12px,3vw,28px); border-bottom: 3px solid #494550; padding: 12px 16px 0; }
.fth-data-bars > div { min-width: 46px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.fth-data-bars span { width: 100%; max-width: 58px; min-height: 18px; display: flex; align-items: flex-start; justify-content: center; padding-top: 5px; border-radius: 9px 9px 0 0; background: linear-gradient(#019ACB,#8AD5EA); color: #FFF; }
.fth-data-bars > div:nth-child(even) span { background: linear-gradient(#FF4F28,#FF9C84); }
.fth-data-bars b { font: 700 12px 'JetBrains Mono',monospace; }
.fth-data-bars em { min-height: 27px; text-align: center; font: 600 11px/1.2 'JetBrains Mono',monospace; font-style: normal; }
.fth-cube-visual { width: min(100%,430px); margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.fth-cube-visual svg { display: block; width: 100%; max-height: 235px; overflow: visible; }
.fth-solid-front { fill: #EAF6FB; stroke: none; }
.fth-solid-top { fill: #FFF3C4; stroke: none; }
.fth-solid-side { fill: #FFE0D6; stroke: none; }
.fth-solid-edge { fill: none; stroke: #263238; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
.fth-solid-hidden { stroke: #66757D; stroke-width: 3; stroke-dasharray: 8 7; stroke-linecap: round; }
.fth-solid-label { fill: #0E0E10; stroke: #FFFFFF; stroke-width: 6px; paint-order: stroke fill; font: italic 700 23px 'Source Serif 4',Georgia,serif; text-anchor: middle; }
.fth-cube-caption { position: static; max-width: 100%; padding: 7px 12px; border-radius: 10px; background: #E3F0E8; color: #174F36; font: 700 clamp(15px,2.8vw,19px) 'JetBrains Mono',monospace; line-height: 1.3; text-align: center; }
.fth-cards { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; font-family: 'Fraunces',serif; font-size: clamp(21px,4vw,30px); font-weight: 600; }
.fth-cards > div { padding: 9px 14px; border-radius: 12px; background: #FFFFFF; border: 1.5px solid #E6E1D6; }
.fth-cards > div.is-highlighted { color: #1F7A4D; background: #E3F0E8; border-color: rgba(31,122,77,.32); }
.fth-cards > div.fth-card-yellow { background: #FFF7CF; border-color: rgba(215,166,32,.32); }
.fth-cards > div.fth-card-blue { background: #EAF6FB; border-color: rgba(1,154,203,.24); }
.fth-cards > div.fth-card-green { color: #1F7A4D; background: #E3F0E8; border-color: rgba(31,122,77,.32); }
.fth-fact-icon { color: #019ACB; font-family: 'Fraunces',serif; font-size: 18px; font-weight: 600; }
.fth-drift { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.fth-drift > span { position: absolute; color: #FF4F28; opacity: .07; animation: ambFloat 17s ease-in-out infinite; }
.fth-drift-1 { left:5%;top:10%;font-size:31px}.fth-drift-2{right:8%;top:8%;font-size:24px;animation-delay:-3s!important;color:#019ACB!important}
.fth-drift-3{left:10%;bottom:14%;font-size:27px;animation-delay:-6s!important}.fth-drift-4{right:5%;bottom:12%;font-size:34px;animation-delay:-9s!important;color:#019ACB!important}
.fth-drift-5{left:42%;top:2%;font-size:21px;animation-delay:-12s!important}.fth-drift-6{right:20%;bottom:31%;font-size:24px;animation-delay:-14s!important}
.fth-summary { flex:1;display:flex;flex-direction:column;justify-content:center;gap:clamp(12px,2.2vw,18px); }
.fth-score { font-family:'Fraunces','Source Serif 4',serif; font-size:clamp(24px,5.2vw,38px); font-weight:600; }
.fth-main-label { color:#FF4F28;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px; }
.fth-summary-list { display:flex;flex-direction:column;gap:10px; }
.fth-summary-list > div { display:grid;grid-template-columns:26px 1fr;gap:10px;align-items:start; }
.fth-summary-list > div > span { display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#FFE8E1;color:#FF4F28;font:700 12px 'JetBrains Mono',monospace; }
.fth-summary-list p { margin:0; }
.fth-pass-note { margin:0; padding:9px 13px; border-radius:12px; font:700 clamp(14px,2.5vw,17px)/1.35 'Source Serif 4',serif; text-align:center; }
.fth-pass-note.is-passed { color:#174F36; background:#E3F0E8; }
.fth-pass-note.is-review { color:#87500A; background:#FFF3C4; }
.fth-final-summary { margin:0; color:#5A5A60; font:600 15px 'JetBrains Mono',monospace; text-align:center; }
.fth-final-chain { display:flex; flex:1; min-height:0; flex-direction:column; justify-content:center; gap:clamp(11px,2vw,17px); }
.fth-final-head { display:flex; align-items:center; justify-content:space-between; gap:16px; }
.fth-final-head p, .fth-final-head h2 { margin:0; }
.fth-final-head strong { color:#FF4F28; font:700 clamp(22px,4vw,30px) 'JetBrains Mono',monospace; }
.fth-final-progress { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; }
.fth-final-progress i { height:7px; border-radius:99px; background:#E6E1D6; }
.fth-final-progress i.is-current { background:#019ACB; }
.fth-final-progress i.is-done { background:#1F7A4D; }
.fth-final-card { display:flex; flex-direction:column; gap:14px; padding:clamp(15px,3vw,24px); }
.fth-final-card > p { margin:0; text-align:center; }
.fth-final-options { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
.fth-final-options .option { min-height:52px; }
.fth-final-options .option.is-correct { border-color:#1F7A4D; background:#E3F0E8; color:#174F36; }
.fth-final-options .option.is-wrong { border-color:#C45C21; background:#FFF3C4; color:#7A3A12; }
.fth-final-feedback { min-height:22px; color:#5A5A60; font:600 14px/1.35 'Source Serif 4',serif; text-align:center; opacity:0; }
.fth-final-feedback.is-visible { opacity:1; }
@media (max-width:639.98px) {
  .fth-figure-frame { min-height:90px; }
  .fth-panels { gap:8px; }
  .fth-panel { padding:9px; }
  .fth-bars { gap:6px; }
  .fth-ribbon-cut { justify-content: flex-start; overflow-x: auto; }
  .fth-group-boxes { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .fth-cube-layers { gap:6px; }
  .fth-cube-layer { padding:5px; }
  .fth-bar-model-row { grid-template-columns: 72px 1fr; }
  .fth-circle-compare { gap:10px; }
}
`;

export default function FractionTheoryLesson({
  lesson,
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  aiGradingEndpoint,
  onFinished,
}) {
  useMobileZoom();
  const sequencedLesson = useMemo(() => {
    const orderSlides = lesson.etalonFlow ? keepAuthoredTheorySequence : sequenceTheorySlides;
    const slides = orderSlides(
      lesson.slides,
      GRADE6_LIFE_CONTEXTS[lesson.id],
      GRADE6_CONCEPT_BRIDGES[lesson.id],
    );
    return {
      ...lesson,
      slides,
      scoredScreens: slides.flatMap((slide, index) => (slide?.scored ? [index] : [])),
    };
  }, [lesson]);
  const isPreview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '',
    studentName: safeName,
    voiceGender: voiceGender || 'm',
  });
  const safeOnFinished = useMemo(
    () => onFinished || ((payload) => console.log('[Preview] onFinished payload:', payload)),
    [onFinished],
  );
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startRef = useRef(0);
  const navLockRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const nextAnswers = [...previous];
      nextAnswers[current] = data;
      return nextAnswers;
    });
  }, [current]);

  const navGuard = () => {
    const now = Date.now();
    if (now - navLockRef.current < 350) return false;
    navLockRef.current = now;
    return true;
  };
  const next = () => { if (navGuard()) setCurrent((value) => Math.min(value + 1, sequencedLesson.slides.length - 1)); };
  const prev = () => { if (navGuard()) setCurrent((value) => Math.max(value - 1, 0)); };

  const finishLesson = useCallback(() => {
    const score = sequencedLesson.scoredScreens.filter((index) => answers[index]?.firstTry === true).length;
    const totalQuestions = sequencedLesson.scoredScreens.length;
    const scorePercent = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;
    const passPercent = sequencedLesson.passPercent ?? 70;
    const finalAnswer = answers.find((answer) => answer?.stage === 'final');
    const finalScore = finalAnswer?.finalScore ?? 0;
    const passed = sequencedLesson.finalPass !== undefined
      ? score >= Math.ceil(totalQuestions * (passPercent / 100)) && finalScore >= sequencedLesson.finalPass
      : scorePercent >= passPercent;
    safeOnFinished({
      lessonId: sequencedLesson.id,
      lessonTitle: sequencedLesson.title,
      studentName: safeName,
      durationSec: Math.floor((Date.now() - startRef.current) / 1000),
      totalQuestions,
      correctAnswers: score,
      scorePercent,
      finalScore: sequencedLesson.finalPass !== undefined ? finalScore : score,
      finalTotal: sequencedLesson.finalPass !== undefined ? 3 : totalQuestions,
      passed,
      firstTryStats: { total: totalQuestions, firstTryCorrect: score },
      answers: answers.filter(Boolean),
    });
  }, [answers, sequencedLesson, safeName, safeOnFinished]);

  const commonProps = {
    lesson: sequencedLesson,
    screen: current,
    totalScreens: sequencedLesson.slides.length,
    storedAnswer: answers[current],
    answers,
    onAnswer: recordAnswer,
    onNext: next,
    onPrev: prev,
    finishLesson,
  };

  let screenNode;
  const slideType = sequencedLesson.slides[current]?.type;
  if (current === 0) screenNode = <HookScreen {...commonProps}/>;
  else if (current === sequencedLesson.slides.length - 1) screenNode = <SummaryScreen {...commonProps}/>;
  else if (slideType === 'info' || slideType === 'rule') screenNode = <RevealLessonScreen {...commonProps}/>;
  else if (slideType === 'multi') screenNode = <MultiQuestionScreen {...commonProps}/>;
  else if (slideType === 'match') screenNode = <MatchQuestionScreen {...commonProps}/>;
  else if (slideType === 'classify') screenNode = <ClassifyQuestionScreen {...commonProps}/>;
  else if (slideType === 'finalChain') screenNode = <FinalChainScreen {...commonProps}/>;
  else screenNode = <SingleQuestionScreen {...commonProps}/>;

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <style>{FRACTION_THEORY_STYLES}</style>
      <div
        className={`lesson-root grade6-theory-etalon fth-lesson${lesson.etalonFlow ? ' fth-etalon' : ''}`}
        data-lesson-id={lesson.id}
      >
        {isPreview && (
          <div className="fth-lang-switch">
            {['ru', 'uz'].map((value) => (
              <button
                key={value}
                onClick={() => setPreviewLang(value)}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 99,
                  padding: '4px 12px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  background: previewLang === value ? '#FF4F28' : 'transparent',
                  color: previewLang === value ? '#FFFFFF' : '#5A5A60',
                }}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <React.Fragment key={`${current}-${lang}`}>{screenNode}</React.Fragment>
      </div>
      <style>{`.fth-lang-switch{position:fixed;top:10px;right:10px;z-index:1000;display:flex;gap:4px;background:#fff;border-radius:99px;padding:4px;box-shadow:0 4px 12px -4px rgba(58,53,48,.25)}`}</style>
    </LangContext.Provider>
  );
}
