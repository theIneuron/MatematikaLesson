/* eslint-disable react-refresh/only-export-components */
// ============================================================================
// grade3/kit/numline.jsx — ЧИСЛОВАЯ ПРЯМАЯ С ПРЕДСКАЗАНИЕМ
//
// Источник: NumberLineAnim из Dars01.jsx (версия из коммита). Перенесено не копией,
// а с параметризацией: в оригинале границы 300–800, цель 470 и все арки прыжков были
// ЗАШИТЫ в константы и массивы. Такой компонент годился ровно для одного экрана
// одного урока — а числовая прямая нужна во многих темах 3 класса (округление,
// сравнение, сложение через разряд).
//
// Прыжки теперь вычисляются от цели: большие арки по сотне до круглого числа,
// потом маленькие по десятку до цели. Для 470 из 300 это одна арка +100 и семь по
// +10 — ровно как было в оригинале.
//
// РЕАЛИЗУЕТ §3.4: сначала ребёнок ставит метку сам, ПОТОМ маркер идёт по аркам.
// Пока метки нет (asking), прямая кликабельна и палец-подсказка мигает у начала.
// После метки прямая перестаёт принимать нажатия и показывает правду.
// ============================================================================

import { useRef } from 'react';
import { T } from './infra.js';

const W = 340;
const PAD = 26;
const Y = 66;
const CUE = '#F0A81E';   // цвет метки ребёнка: не зелёный и не красный, это ещё не оценка

/** Раскладка прыжков от начала до цели: сколько по сотне, сколько по десятку. */
export const planJumps = (min, target) => {
  const base = min + Math.floor((target - min) / 100) * 100;
  const big = [];
  for (let v = min; v < base; v += 100) big.push(v);
  const small = [];
  for (let v = base; v < target; v += 10) small.push(v);
  return { base, big, small };
};

/**
 * @param min,max границы прямой
 * @param step   шаг подписанных делений
 * @param target куда должен прийти маркер
 * @param phase  0 в начале, 1 после больших прыжков, 2 после малых
 * @param guess  метка ребёнка (null пока не поставил)
 * @param onGuess колбэк постановки метки; без него прямая не кликабельна
 */
export function NumberLine({ min, max, step = 100, target, phase = 0, guess = null, onGuess = null }) {
  const ref = useRef(null);
  const x = (v) => PAD + ((v - min) / (max - min)) * (W - 2 * PAD);
  const { base, big, small } = planJumps(min, target);
  const pos = phase >= 2 ? target : phase >= 1 ? base : min;
  const asking = guess === null && !!onGuess;

  const arc = (a, b, h) => `M ${x(a)} ${Y} Q ${(x(a) + x(b)) / 2} ${Y - h} ${x(b)} ${Y}`;

  const ticks = [];
  for (let v = min; v <= max; v += step) ticks.push(v);

  const handleClick = (e) => {
    if (!asking || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    // Округляем до десятка: попасть пальцем точно в 470 ребёнок не должен.
    let v = Math.round((min + ((svgX - PAD) / (W - 2 * PAD)) * (max - min)) / 10) * 10;
    v = Math.max(min, Math.min(max, v));
    onGuess(v);
  };

  return (
    <svg
      ref={ref}
      onClick={handleClick}
      viewBox={`0 0 ${W} 104`}
      style={{ width: 'min(360px, 98%)', height: 'auto', cursor: asking ? 'pointer' : 'default' }}
      aria-hidden={!asking}
    >
      {/* Прозрачная полоса для попадания пальцем: сама линия слишком тонкая. */}
      {asking && <rect x="0" y={Y - 26} width={W} height="52" fill="transparent"/>}

      {asking && (
        <g className="d2-nlcue-slide" style={{ pointerEvents: 'none' }} aria-hidden="true">
          <circle className="d2-nlcue-ring" cx={x(min)} cy={Y} r="7" fill="none" stroke={CUE} strokeWidth="2"/>
          <text className="d2-nlcue-hand" x={x(min)} y={Y + 30} textAnchor="middle" fontSize="19">👆</text>
        </g>
      )}

      <line x1={x(min)} y1={Y} x2={x(max)} y2={Y} stroke={T.ink3} strokeWidth="2"/>

      {/* Пройденный путь двумя цветами: сотнями оранжевым, десятками синим —
          те же цвета, что у разрядов в остальном уроке. */}
      {!asking && (
        <line x1={x(min)} y1={Y} x2={x(Math.min(pos, base))} y2={Y} stroke={T.accent} strokeWidth="4" strokeLinecap="round" style={{ transition: 'all 0.6s' }}/>
      )}
      {!asking && pos > base && (
        <line x1={x(base)} y1={Y} x2={x(pos)} y2={Y} stroke={T.blue} strokeWidth="4" strokeLinecap="round" style={{ transition: 'all 0.6s' }}/>
      )}

      {ticks.map((v) => (
        <g key={v}>
          <line x1={x(v)} y1={Y - 6} x2={x(v)} y2={Y + 6} stroke={T.ink2} strokeWidth="2.2"/>
          <text x={x(v)} y={Y + 20} textAnchor="middle" fontSize="11" fill={T.ink2} fontFamily="'JetBrains Mono', monospace">{v}</text>
        </g>
      ))}

      {/* Большие прыжки по сотне. */}
      {!asking && big.map((a, i) => (
        <g key={`b${a}`} style={{ opacity: phase >= 1 ? 1 : 0, transition: `opacity 0.4s ${i * 0.18}s` }}>
          <path d={arc(a, a + 100, 30)} fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3.5"/>
          <text x={(x(a) + x(a + 100)) / 2} y={Y - 34} textAnchor="middle" fontSize="10" fontWeight="800" fill={T.accent} fontFamily="'JetBrains Mono', monospace">+100</text>
        </g>
      ))}

      {/* Малые прыжки по десятку, появляются один за другим. */}
      {!asking && small.map((a, i) => (
        <path
          key={`s${a}`}
          d={arc(a, a + 10, 12)}
          fill="none"
          stroke={T.blue}
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ opacity: phase >= 2 ? 1 : 0, transition: `opacity 0.25s ${i * 0.14}s` }}
        />
      ))}

      {/* Метка ребёнка остаётся видна и после анимации: он сравнивает своё с правдой. */}
      {guess !== null && (
        <g>
          <line x1={x(guess)} y1={Y - 20} x2={x(guess)} y2={Y + 6} stroke={CUE} strokeWidth="2.5" strokeLinecap="round"/>
          <path d={`M ${x(guess) - 5} ${Y - 20} L ${x(guess) + 5} ${Y - 20} L ${x(guess)} ${Y - 13} Z`} fill={CUE}/>
        </g>
      )}

      {!asking && (
        <g style={{ transform: `translateX(${x(pos) - x(min)}px)`, transition: 'transform 0.7s cubic-bezier(0.34, 1.2, 0.4, 1)' }}>
          <text x={x(min)} y={Y - 13} textAnchor="middle" fontSize="14" fontWeight="800" fill={T.ink} fontFamily="'JetBrains Mono', monospace">{pos}</text>
          <circle cx={x(min)} cy={Y} r="6" fill={T.ink}/>
        </g>
      )}
    </svg>
  );
}
