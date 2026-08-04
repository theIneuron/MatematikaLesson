/* eslint-disable react-refresh/only-export-components */
// ============================================================================
// informatika3/kit/devices.jsx — НАБОР УСТРОЙСТВ И ЧАСТЕЙ КОМПЬЮТЕРА
//
// Это математический аналог `grade3/kit/mathviz.jsx`: там материальная модель
// разряда, здесь материальная модель устройства. Смысл тот же — ребёнок должен
// узнавать предмет, а не читать его название.
//
// ПОЧЕМУ ИКОНКИ, А НЕ ФОТО:
//   1. Фото клавиатуры конкретной модели ребёнок опознаёт как «эту клавиатуру»,
//      а нужен признак класса: много кнопок, ими вводят.
//   2. Растр уезжает на Vercel каждым деплоем — шесть PNG из public/assets уже
//      вынесены в _archive/heavy именно по этой причине.
//   3. Иконка масштабируется под мобильный зум 390px без потери резкости.
//
// ЦВЕТОВОЙ КОД (соблюдается всюду, где видно устройство):
//   синий   — устройство ВВОДА  (данные идут в компьютер)
//   зелёный — устройство ВЫВОДА (данные идут из компьютера)
//   оранжевый — часть ВНУТРИ компьютера (обработка и память)
//   серый   — предмет, который компьютером не является
//
// Ни одной фразы на UZ/RU здесь нет и быть не может (src/courses/README.md, п.2):
// подписи приходят из content/DarsNN.data.js через проп `label`.
// ============================================================================

import React from 'react';
// Внутри kit/ обращаемся к каркасу 3 класса НАПРЯМУЮ, а не через свой index.js:
// index.js реэкспортирует этот файл, и импорт из него дал бы цикл модулей.
// Правило «только через kit/index.js» относится к урокам, сценам и экранам.
import { T, useT } from '../../grade3/kit/index.js';

// ---------------------------------------------------------------------------
// Роли устройства -> цвет. Оттенки взяты из палитры эталона (PALETTE, §7):
// blue #019ACB, success #1F7A4D, accent #FF4F28.
// ---------------------------------------------------------------------------
export const ROLE_COLOR = {
  input: { line: '#017BA3', fill: '#EAF6FB', soft: '#D3ECF6' },
  output: { line: '#1F7A4D', fill: '#E8F6ED', soft: '#D3EADC' },
  inside: { line: '#D1462B', fill: '#FFF3EC', soft: '#FFE0D3' },
  none: { line: '#7A7A80', fill: '#F1F0EC', soft: '#E3E2DC' },
};

// ---------------------------------------------------------------------------
// РИСУНКИ. Каждый — содержимое <svg viewBox="0 0 100 100"> без обёртки:
// обёртку с размером даёт DeviceIcon, поэтому одна иконка не знает, какого она
// размера, и её можно поставить и в кнопку варианта, и в центр рамки.
//
// Штрих 3.2 при 100 единицах — та же зрительная плотность, что у линий рамок
// эталона; тоньше на телефоне пропадает.
// ---------------------------------------------------------------------------
const S = { fill: 'none', strokeWidth: 3.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const KEY_XS = [22, 34, 46, 58, 70];

const SHAPES = {
  // --- ввод ---------------------------------------------------------------
  keyboard: (c) => (
    <>
      <rect x="10" y="34" width="80" height="42" rx="8" fill={c.fill} stroke={c.line} {...S}/>
      {[44, 55].flatMap((y) => KEY_XS.map((x) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="8" height="7" rx="2.2" fill={c.soft} stroke={c.line} strokeWidth="2"/>
      )))}
      <rect x="34" y="65" width="32" height="7" rx="2.2" fill={c.soft} stroke={c.line} strokeWidth="2"/>
    </>
  ),

  mouse: (c) => (
    <>
      <path d="M50 24c14 0 22 11 22 26s-8 26-22 26-22-11-22-26 8-26 22-26z" fill={c.fill} stroke={c.line} {...S}/>
      <path d="M50 26v20" stroke={c.line} {...S}/>
      <rect x="46" y="32" width="8" height="12" rx="4" fill={c.soft} stroke={c.line} strokeWidth="2.4"/>
      <path d="M50 24c0-8 6-12 12-12" stroke={c.line} {...S}/>
    </>
  ),

  mic: (c) => (
    <>
      <rect x="40" y="16" width="20" height="38" rx="10" fill={c.fill} stroke={c.line} {...S}/>
      <path d="M42 30h16M42 38h16" stroke={c.line} strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M30 46c0 11 9 20 20 20s20-9 20-20" stroke={c.line} {...S}/>
      <path d="M50 66v14M36 84h28" stroke={c.line} {...S}/>
    </>
  ),

  camera: (c) => (
    <>
      <circle cx="50" cy="46" r="26" fill={c.fill} stroke={c.line} {...S}/>
      <circle cx="50" cy="46" r="12" fill={c.soft} stroke={c.line} strokeWidth="2.8"/>
      <circle cx="55" cy="41" r="3.4" fill={c.line} stroke="none"/>
      <path d="M28 68c-4 6-6 12-6 16h56c0-4-2-10-6-16" fill={c.fill} stroke={c.line} {...S}/>
    </>
  ),

  scanner: (c) => (
    <>
      <rect x="12" y="46" width="76" height="26" rx="7" fill={c.fill} stroke={c.line} {...S}/>
      <rect x="26" y="18" width="48" height="24" rx="4" fill={c.soft} stroke={c.line} strokeWidth="2.6"/>
      <path d="M22 59h56" stroke={c.line} strokeWidth="3.6" strokeLinecap="round"/>
    </>
  ),

  // --- вывод --------------------------------------------------------------
  monitor: (c) => (
    <>
      <rect x="12" y="20" width="76" height="50" rx="7" fill={c.fill} stroke={c.line} {...S}/>
      <rect x="20" y="28" width="60" height="34" rx="3" fill={c.soft} stroke="none"/>
      <path d="M42 70v10h16V70M32 82h36" stroke={c.line} {...S}/>
    </>
  ),

  printer: (c) => (
    <>
      <rect x="30" y="14" width="40" height="20" rx="3" fill={c.soft} stroke={c.line} strokeWidth="2.6"/>
      <rect x="14" y="34" width="72" height="32" rx="7" fill={c.fill} stroke={c.line} {...S}/>
      <rect x="30" y="60" width="40" height="26" rx="3" fill="#FFFFFF" stroke={c.line} {...S}/>
      <path d="M38 70h24M38 78h16" stroke={c.line} strokeWidth="2.4" strokeLinecap="round"/>
      <circle cx="76" cy="44" r="3" fill={c.line} stroke="none"/>
    </>
  ),

  speaker: (c) => (
    <>
      <rect x="18" y="20" width="34" height="60" rx="6" fill={c.fill} stroke={c.line} {...S}/>
      <circle cx="35" cy="38" r="7" fill={c.soft} stroke={c.line} strokeWidth="2.4"/>
      <circle cx="35" cy="62" r="10" fill={c.soft} stroke={c.line} strokeWidth="2.4"/>
      <path d="M62 38c5 7 5 17 0 24M72 30c9 12 9 28 0 40" stroke={c.line} {...S}/>
    </>
  ),

  // --- внутри -------------------------------------------------------------
  cpu: (c) => (
    <>
      <rect x="26" y="26" width="48" height="48" rx="6" fill={c.fill} stroke={c.line} {...S}/>
      <rect x="38" y="38" width="24" height="24" rx="3" fill={c.soft} stroke={c.line} strokeWidth="2.6"/>
      {[36, 50, 64].map((v) => (
        <React.Fragment key={v}>
          <path d={`M${v} 26v-9`} stroke={c.line} {...S}/>
          <path d={`M${v} 74v9`} stroke={c.line} {...S}/>
          <path d={`M26 ${v}h-9`} stroke={c.line} {...S}/>
          <path d={`M74 ${v}h9`} stroke={c.line} {...S}/>
        </React.Fragment>
      ))}
    </>
  ),

  ram: (c) => (
    <>
      <path d="M10 36h80v22a4 4 0 0 1-4 4H58l-4 6h-8l-4-6H14a4 4 0 0 1-4-4z" fill={c.fill} stroke={c.line} {...S}/>
      {[20, 34, 48, 62, 76].map((x) => (
        <rect key={x} x={x} y="42" width="10" height="12" rx="2" fill={c.soft} stroke={c.line} strokeWidth="2"/>
      ))}
    </>
  ),

  disk: (c) => (
    <>
      <rect x="16" y="22" width="68" height="56" rx="7" fill={c.fill} stroke={c.line} {...S}/>
      <circle cx="50" cy="50" r="19" fill={c.soft} stroke={c.line} strokeWidth="2.6"/>
      <circle cx="50" cy="50" r="4" fill={c.line} stroke="none"/>
      <path d="M74 30 58 44" stroke={c.line} {...S}/>
    </>
  ),

  // --- предметы для первого экрана ----------------------------------------
  phone: (c) => (
    <>
      <rect x="32" y="12" width="36" height="76" rx="8" fill={c.fill} stroke={c.line} {...S}/>
      <rect x="38" y="22" width="24" height="50" rx="3" fill={c.soft} stroke="none"/>
      <path d="M44 17h12" stroke={c.line} strokeWidth="2.6" strokeLinecap="round"/>
      <circle cx="50" cy="80" r="3.2" fill="none" stroke={c.line} strokeWidth="2.4"/>
    </>
  ),

  washer: (c) => (
    <>
      <rect x="18" y="14" width="64" height="72" rx="8" fill={c.fill} stroke={c.line} {...S}/>
      <circle cx="50" cy="56" r="19" fill={c.soft} stroke={c.line} strokeWidth="2.8"/>
      <circle cx="50" cy="56" r="9" fill="#FFFFFF" stroke={c.line} strokeWidth="2.2"/>
      <circle cx="70" cy="26" r="3.4" fill={c.line} stroke="none"/>
      <path d="M28 26h22" stroke={c.line} strokeWidth="2.6" strokeLinecap="round"/>
    </>
  ),

  atm: (c) => (
    <>
      <rect x="20" y="10" width="60" height="80" rx="7" fill={c.fill} stroke={c.line} {...S}/>
      <rect x="29" y="19" width="42" height="26" rx="3" fill={c.soft} stroke={c.line} strokeWidth="2.4"/>
      {[54, 66].flatMap((y) => [36, 48, 60].map((x) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="8" height="7" rx="2" fill="#FFFFFF" stroke={c.line} strokeWidth="1.8"/>
      )))}
      <path d="M32 80h36" stroke={c.line} strokeWidth="3.6" strokeLinecap="round"/>
    </>
  ),

  hammer: (c) => (
    <>
      <path d="M26 22h34l8 12H34z" fill={c.fill} stroke={c.line} {...S}/>
      <path d="M60 22h10a6 6 0 0 1 0 12H60" fill={c.soft} stroke={c.line} {...S}/>
      <path d="M42 34 38 84h10l4-50" fill={c.soft} stroke={c.line} {...S}/>
    </>
  ),

  book: (c) => (
    <>
      <path d="M18 22h26a6 6 0 0 1 6 6v54a6 6 0 0 0-6-6H18z" fill={c.fill} stroke={c.line} {...S}/>
      <path d="M82 22H56a6 6 0 0 0-6 6v54a6 6 0 0 1 6-6h26z" fill={c.soft} stroke={c.line} {...S}/>
    </>
  ),
};

export const DEVICE_KEYS = Object.keys(SHAPES);

/**
 * Одна иконка устройства.
 *
 * @param kind  ключ из DEVICE_KEYS
 * @param role  'input' | 'output' | 'inside' | 'none' — задаёт цвет
 * @param size  сторона в пикселях (clamp задаётся снаружи через style)
 * @param dim   приглушить (устройство ещё не разобрано)
 */
export const DeviceIcon = React.memo(({ kind, role = 'none', size = 64, dim = false, style }) => {
  const draw = SHAPES[kind];
  if (!draw) {
    // Молча ничего не нарисовать — худший вариант: экран выглядит рабочим и пустым.
    console.error(`[devices] нет рисунка «${kind}». Есть: ${DEVICE_KEYS.join(', ')}`);
    return <span className="mono" style={{ color: '#C0392B' }}>⟨{kind}?⟩</span>;
  }
  const c = ROLE_COLOR[role] || ROLE_COLOR.none;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'block', opacity: dim ? 0.34 : 1, transition: 'opacity .35s ease', ...style }}
    >
      {draw(c)}
    </svg>
  );
});
DeviceIcon.displayName = 'DeviceIcon';

/**
 * Карточка устройства: иконка плюс подпись. Подпись — локализованный узел из
 * данных урока, поэтому localize идёт здесь, а не в данных.
 */
export const DeviceCard = React.memo(({
  kind, role = 'none', label, size = 76, selected = false, dim = false, onClick, badge,
}) => {
  const t = useT();
  const c = ROLE_COLOR[role] || ROLE_COLOR.none;
  const inner = (
    <>
      {badge && (
        <span
          className="mono"
          style={{
            position: 'absolute', top: 6, right: 8, fontSize: 11, fontWeight: 800,
            color: c.line, letterSpacing: 0.4,
          }}
        >
          {t(badge)}
        </span>
      )}
      <DeviceIcon kind={kind} role={role} size={size} dim={dim}/>
      {label && (
        <span
          style={{
            fontWeight: 700, fontSize: 'clamp(11px, 1.7vw, 14px)', color: T.ink,
            textAlign: 'center', lineHeight: 1.15,
          }}
        >
          {t(label)}
        </span>
      )}
    </>
  );
  const box = {
    position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 6, padding: 'clamp(8px, 1.6vw, 12px)', borderRadius: 14,
    background: selected ? c.fill : T.paper,
    border: `2px solid ${selected ? c.line : 'rgba(167,166,162,.22)'}`,
    boxShadow: selected ? `0 10px 24px -16px ${c.line}` : '0 6px 16px -12px rgba(58,53,48,.3)',
    transition: 'background .3s ease, border-color .3s ease, box-shadow .3s ease, transform .2s ease',
    minWidth: 'clamp(84px, 16vw, 118px)',
  };
  if (!onClick) return <div style={box}>{inner}</div>;
  return (
    <button type="button" onClick={onClick} style={{ ...box, cursor: 'pointer', font: 'inherit' }}>
      {inner}
    </button>
  );
});
DeviceCard.displayName = 'DeviceCard';
