// ============================================================================
// grade3/kit/world.jsx — СРЕДА LUMO
//
// Источник: src/components/grade3/Dars01.jsx, версия ИЗ КОММИТА (HEAD).
// Перенесено ДОСЛОВНО, механическим извлечением по диапазонам строк: это чертёж
// сцены, где смысл в координатах. Перепечатка гарантированно внесла бы ошибку.
//
// Что это за мир (SYUJET_3SINF.md): планета Бита — Lumo. Тёплое небо красного
// карлика, город с сотнями горящих окон, инопланетная флора, парящие кристаллы.
// Окна не декорация: «в городе сотни огней» — это и есть мотив разряда, с которого
// начинается урок про сотни, десятки и единицы.
//
// PLAT_Y = 176 — линия пола, на ней стоят персонажи.
// viewBox сцены 400x230.
//
// HookScene — СЦЕНА-ОБРАМЛЕНИЕ (ETALON v2 §1.3): стоит на первом и последнем
// экране урока в двух состояниях. gathered=false — препятствие («как сосчитать
// сотни огней»), gathered=true — снято: экипаж радуется, Bit ликует. Одна сцена,
// один флаг — не два разных компонента, иначе финал не читается как решённое начало.
// ============================================================================

import { BitSVG, RanoSVG, AnvarSVG, ZuhraSVG, JasurSVG } from './cast.jsx';

// ---------------------------------------------------------------------------
// ГЕОМЕТРИЯ И РАСКЛАДКА СЦЕНЫ — внутренние константы модуля.
// PLAT_Y задаёт линию пола; всё остальное расставлено относительно неё.
// TOWN и FAR_TOWN — два плана города: близкий пастельный и далёкий туманный.
// Далёкий нужен, чтобы город читался как БОЛЬШОЙ: огней действительно сотни.
// ---------------------------------------------------------------------------
const PLAT_Y = 176;

const FAR_TOWN = [[-8, 30, 130], [22, 24, 122], [52, 34, 134], [92, 26, 118], [124, 32, 128], [162, 24, 116], [190, 36, 126], [234, 26, 120], [266, 34, 132], [304, 24, 118], [332, 32, 128], [370, 30, 122]];

const TOWN = [
  [-4, 44, 102, '#F2B49A', '#DF8A6C', 'pitch'], // marjon
  [44, 38, 122, '#F5D592', '#E0AE5A', 'dome'],  // sariq — gumbaz
  [86, 40, 90, '#BEA9E0', '#9A7CC6', 'pitch'],  // siyohrang
  [130, 34, 118, '#A6D8C2', '#7CB69E', 'flat'], // mint
  [168, 50, 82, '#F6BCC6', '#E489A2', 'dome'],  // pushti — gumbaz
  [222, 36, 116, '#F3CB9E', '#DCA265', 'flat'], // shaftoli
  [262, 46, 94, '#AECDEC', '#83A9D2', 'pitch'], // ko'k
  [312, 34, 120, '#F0AE94', '#DB8062', 'flat'], // marjon-2
  [350, 52, 100, '#C6B0E4', '#9E82CA', 'dome']  // siyohrang — gumbaz
];

const LAMPS = [118, 210, 300];

const SPORES = [[120, 150, '#8FE0D0'], [252, 132, '#C6A6F0'], [318, 116, '#FFD98A'], [70, 132, '#8FD8F0'], [186, 120, '#B0F0C0'], [292, 150, '#F0A0C8']];

const houseWindows = (x, w, topY, idx) => {
  const out = []; const startX = x + 7; const innerW = w - 14;
  const cols = Math.max(1, Math.round(innerW / 11));
  const stepX = cols > 1 ? innerW / (cols - 1) : 0;
  const rows = Math.floor((PLAT_Y - 10 - (topY + 12)) / 12);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const wx = startX + c * stepX; const wy = topY + 14 + r * 12;
      if (wy > PLAT_Y - 10) continue;
      const flick = (c + r + idx) % 4 === 0;
      out.push(<rect key={`${r}-${c}`} className={flick ? 'lm-cwin' : ''} style={flick ? { animationDelay: `${(r % 5) * 0.6}s` } : undefined} x={wx - 3} y={wy - 3.4} width="6" height="6.8" rx="1.6" fill="url(#lmGlow)" stroke="rgba(120,80,30,0.35)" strokeWidth="0.6"/>);
    }
  }
  return out;
};

const farWindows = (x, w, ty, idx) => {
  const out = []; const cols = Math.max(1, Math.round((w - 6) / 7));
  const stepX = cols > 1 ? (w - 6) / (cols - 1) : 0;
  const rows = Math.floor((PLAT_Y - 6 - (ty + 6)) / 9);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if ((c * 5 + r * 7 + idx * 3) % 3 === 0) continue;
      out.push(<circle key={`${r}-${c}`} cx={x + 3 + c * stepX} cy={ty + 8 + r * 9} r="0.9" fill="#FFE6A6" opacity="0.72"/>);
    }
  }
  return out;
};

const CRYSTALS = [{ x: 114, s: 0.85, tint: '#7FE0D8' }, { x: 322, s: 0.85, tint: '#BEA0F0' }, { x: 370, s: 0.72, tint: '#8FD8F0' }];

const FLOATERS = [{ x: 120, y: 92, s: 0.85, tint: '#7FE0D8', d: 0 }, { x: 292, y: 78, s: 1.0, tint: '#BEA0F0', d: 1.3 }];

const CREATURES = [{ x: 100, y: 62, s: 1.0, tint: '#B4E4F0', d: 0 }, { x: 246, y: 48, s: 0.8, tint: '#F0C0E0', d: 1.1 }, { x: 320, y: 70, s: 0.9, tint: '#C6E8A6', d: 0.5 }];

const GROUND_FLOWERS = [[38, '#8FE0D0'], [116, '#F0A0C8'], [300, '#8FD8F0'], [352, '#C6A6F0'], [388, '#FFD98A']];

const MINI_HOUSES = [
  [10, 30, 34, '#F2B49A', '#DF8A6C', 'pitch'], [50, 24, 44, '#F5D592', '#E0AE5A', 'dome'],
  [80, 34, 26, '#BEA9E0', '#9A7CC6', 'pitch'], [120, 26, 40, '#A6D8C2', '#7CB69E', 'flat'],
  [152, 30, 30, '#F6BCC6', '#E489A2', 'dome'], [188, 26, 42, '#AECDEC', '#83A9D2', 'pitch'], [220, 30, 32, '#F3CB9E', '#DCA265', 'flat']
];

const LUMO_CAST = [
  { key: 'rano',  El: RanoSVG,  hook: { mood: 'pointing' } },
  { key: 'anvar', El: AnvarSVG, hook: { pose: 'door' } },
  { key: 'zuhra', El: ZuhraSVG, hook: { mood: 'pointing' } },
  { key: 'jasur', El: JasurSVG, hook: { pose: 'pointing' } }
];

// ---------------------------------------------------------------------------
// ЭЛЕМЕНТЫ СРЕДЫ
// ---------------------------------------------------------------------------
export const Cloud = ({ x, y, s }) => (
  <g fill="#FFFFFF" opacity="0.72">
    <ellipse cx={x} cy={y} rx={20 * s} ry={9 * s}/>
    <ellipse cx={x - 15 * s} cy={y + 3 * s} rx={13 * s} ry={7 * s}/>
    <ellipse cx={x + 15 * s} cy={y + 3 * s} rx={13 * s} ry={7 * s}/>
  </g>
);

export const AlienBloom = ({ x, s, tint }) => {
  const b = PLAT_Y; const hy = b - 44 * s;
  return (
    <g>
      <ellipse cx={x} cy={b} rx={11 * s} ry={3.2 * s} fill="rgba(50,40,30,0.2)"/>
      <path d={`M${x} ${b} Q${x - 5 * s} ${b - 22 * s} ${x} ${hy}`} stroke="#3C7A50" strokeWidth={3.6 * s} fill="none" strokeLinecap="round"/>
      <path d={`M${x - 1 * s} ${b - 18 * s} Q${x - 15 * s} ${b - 22 * s} ${x - 18 * s} ${b - 12 * s} Q${x - 8 * s} ${b - 12 * s} ${x - 1 * s} ${b - 18 * s} Z`} fill="#54A86E"/>
      <path d={`M${x + 1 * s} ${b - 28 * s} Q${x + 15 * s} ${b - 32 * s} ${x + 18 * s} ${b - 22 * s} Q${x + 8 * s} ${b - 22 * s} ${x + 1 * s} ${b - 28 * s} Z`} fill="#54A86E"/>
      <circle cx={x} cy={hy} r={17 * s} fill={tint} opacity="0.22"/>
      {Array.from({ length: 7 }).map((_, i) => { const a = (i / 7) * Math.PI * 2; const px = x + Math.cos(a) * 9 * s; const py = hy + Math.sin(a) * 9 * s; return <ellipse key={i} cx={px} cy={py} rx={7 * s} ry={4 * s} fill={tint} transform={`rotate(${a * 180 / Math.PI} ${px} ${py})`}/>; })}
      <circle cx={x} cy={hy} r={6.5 * s} fill={tint}/>
      <circle className="lm-glow" cx={x} cy={hy} r={4 * s} fill="#FFF7D6"/>
    </g>
  );
};

export const AlienShroom = ({ x, s, tint }) => {
  const b = PLAT_Y;
  return (
    <g>
      <ellipse cx={x} cy={b} rx={14 * s} ry={3.6 * s} fill="rgba(50,40,30,0.2)"/>
      <path d={`M${x - 5 * s} ${b} Q${x - 6 * s} ${b - 24 * s} ${x} ${b - 30 * s} Q${x + 6 * s} ${b - 24 * s} ${x + 5 * s} ${b} Z`} fill="#EFE2C8"/>
      <circle cx={x} cy={b - 32 * s} r={20 * s} fill={tint} opacity="0.16"/>
      <path d={`M${x - 22 * s} ${b - 30 * s} Q${x} ${b - 54 * s} ${x + 22 * s} ${b - 30 * s} Q${x} ${b - 40 * s} ${x - 22 * s} ${b - 30 * s} Z`} fill={tint}/>
      <path d={`M${x - 22 * s} ${b - 30 * s} Q${x} ${b - 54 * s} ${x + 22 * s} ${b - 30 * s}`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.2 * s}/>
      <g fill="rgba(255,255,255,0.95)"><circle cx={x - 8 * s} cy={b - 36 * s} r={2.6 * s}/><circle cx={x + 7 * s} cy={b - 34 * s} r={2.2 * s}/><circle cx={x} cy={b - 44 * s} r={2.2 * s}/></g>
      <circle className="lm-glow" cx={x} cy={b - 38 * s} r={2.8 * s} fill="#FFF7D6"/>
    </g>
  );
};

export const AlienLantern = ({ x, s, tint }) => {
  const b = PLAT_Y; const hy = b - 40 * s;
  return (
    <g>
      <ellipse cx={x} cy={b} rx={10 * s} ry={3 * s} fill="rgba(50,40,30,0.2)"/>
      <path d={`M${x} ${b} Q${x + 12 * s} ${b - 26 * s} ${x - 2 * s} ${hy}`} stroke="#3C7A50" strokeWidth={3.4 * s} fill="none" strokeLinecap="round"/>
      <path d={`M${x + 5 * s} ${b - 16 * s} Q${x + 18 * s} ${b - 20 * s} ${x + 20 * s} ${b - 10 * s} Q${x + 10 * s} ${b - 10 * s} ${x + 5 * s} ${b - 16 * s} Z`} fill="#54A86E"/>
      <circle cx={x - 2 * s} cy={hy + 3 * s} r={16 * s} fill={tint} opacity="0.2"/>
      <path d={`M${x - 2 * s} ${hy - 10 * s} Q${x - 12 * s} ${hy + 2 * s} ${x - 2 * s} ${hy + 13 * s} Q${x + 8 * s} ${hy + 2 * s} ${x - 2 * s} ${hy - 10 * s} Z`} fill={tint}/>
      <ellipse className="lm-glow" cx={x - 3 * s} cy={hy + 2 * s} rx={3.4 * s} ry={5 * s} fill="#FFF7D6"/>
    </g>
  );
};

export const AlienCrystal = ({ x, s, tint }) => {
  const b = PLAT_Y;
  return (
    <g>
      <ellipse cx={x} cy={b} rx={17 * s} ry={5 * s} fill={tint} opacity="0.14"/>
      <path d={`M${x - 2 * s} ${b} L${x - 8 * s} ${b - 15 * s} L${x - 4 * s} ${b - 21 * s} L${x} ${b - 11 * s} Z`} fill={tint} opacity="0.85"/>
      <path d={`M${x + 1 * s} ${b} L${x + 2 * s} ${b - 24 * s} L${x + 6 * s} ${b - 13 * s} L${x + 8 * s} ${b} Z`} fill={tint}/>
      <path d={`M${x + 6 * s} ${b} L${x + 12 * s} ${b - 12 * s} L${x + 13 * s} ${b} Z`} fill={tint} opacity="0.7"/>
      <path d={`M${x + 2 * s} ${b - 24 * s} L${x + 3 * s} ${b - 20 * s}`} stroke="rgba(255,255,255,0.7)" strokeWidth={1 * s} strokeLinecap="round"/>
    </g>
  );
};

export const Lamp = ({ x, h = 34 }) => {
  const b = PLAT_Y;
  return (
    <g>
      <rect x={x - 1.4} y={b - h} width="2.8" height={h} rx="1.4" fill="#7A6448"/>
      <path d={`M${x} ${b - h} q0 -5 7 -5`} stroke="#7A6448" strokeWidth="2.4" fill="none"/>
      <circle cx={x + 8} cy={b - h - 3} r="6.5" fill="#FFE39A" opacity="0.4"/>
      <circle className="lm-glow" cx={x + 8} cy={b - h - 3} r="3.4" fill="url(#lmGlow)"/>
    </g>
  );
};

export const LandingPod = ({ x, s = 1 }) => {
  const b = PLAT_Y;
  return (
    <g>
      <path d={`M${x - 15 * s} ${b} L${x - 10 * s} ${b - 14 * s} M${x + 15 * s} ${b} L${x + 10 * s} ${b - 14 * s}`} stroke="#8A93A0" strokeWidth={2.8 * s} strokeLinecap="round"/>
      <ellipse cx={x} cy={b} rx={24 * s} ry={4 * s} fill="#8FD8EE" opacity="0.22"/>
      <ellipse cx={x} cy={b - 20 * s} rx={21 * s} ry={13 * s} fill="#D9E0E8"/>
      <ellipse cx={x} cy={b - 24 * s} rx={21 * s} ry={9 * s} fill="#EEF3F7"/>
      <path d={`M${x - 21 * s} ${b - 19 * s} Q${x} ${b - 12 * s} ${x + 21 * s} ${b - 19 * s}`} stroke="#FF7A4A" strokeWidth={2.6 * s} fill="none"/>
      <path d={`M${x - 11 * s} ${b - 27 * s} A ${11 * s} ${11 * s} 0 0 1 ${x + 11 * s} ${b - 27 * s} Z`} fill="#8FD8EE"/>
      <path d={`M${x - 11 * s} ${b - 27 * s} A ${11 * s} ${11 * s} 0 0 1 ${x + 11 * s} ${b - 27 * s}`} fill="none" stroke="#B9C6D2" strokeWidth={1.4 * s}/>
      <ellipse cx={x - 4 * s} cy={b - 31 * s} rx={3 * s} ry={2 * s} fill="rgba(255,255,255,0.75)"/>
    </g>
  );
};

export const FloatCrystal = ({ x, y, s, tint, d = 0 }) => (
  <g className="lm-float" style={{ animationDelay: `${d}s` }}>
    <circle cx={x} cy={y} r={13 * s} fill={tint} opacity="0.16"/>
    <path d={`M${x} ${y - 13 * s} L${x + 8 * s} ${y} L${x} ${y + 13 * s} L${x - 8 * s} ${y} Z`} fill={tint} opacity="0.9"/>
    <path d={`M${x} ${y - 13 * s} L${x + 8 * s} ${y} L${x} ${y} Z`} fill="rgba(255,255,255,0.42)"/>
  </g>
);

export const FlyCreature = ({ x, y, s, tint, d = 0 }) => (
  <g className="lm-fly" style={{ animationDelay: `${d}s` }}>
    <path d={`M${x - 9 * s} ${y} Q${x - 3 * s} ${y - 6 * s} ${x} ${y} Q${x + 3 * s} ${y - 6 * s} ${x + 9 * s} ${y} Q${x + 3 * s} ${y + 3 * s} ${x} ${y + 1 * s} Q${x - 3 * s} ${y + 3 * s} ${x - 9 * s} ${y} Z`} fill={tint} opacity="0.85"/>
    <circle cx={x} cy={y} r={1.6 * s} fill="rgba(255,255,255,0.85)"/>
  </g>
);

// FLORA стоит ЗДЕСЬ, а не среди прочих констант в начале файла: она хранит сами
// компоненты (C: AlienBloom), поэтому объявление обязано идти ПОСЛЕ них. При
// извлечении модуля константы были собраны наверх, и это дало
// «Cannot access 'AlienBloom' before initialization» — const не поднимается, в
// отличие от function. Порядок здесь такой же, как в исходном Dars01.jsx.
const FLORA = [
  { x: 20, s: 1.3, C: AlienBloom, tint: '#4FD8C2' },
  { x: 92, s: 1.05, C: AlienShroom, tint: '#CD8AE2' },
  { x: 302, s: 1.05, C: AlienLantern, tint: '#6FD0F0' },
  { x: 346, s: 1.18, C: AlienShroom, tint: '#F0A0C8' },
  { x: 386, s: 1.3, C: AlienBloom, tint: '#9BE86A' }
];

// ---------------------------------------------------------------------------
// ФОН ГОРОДА — тёплое небо, два плана домов, светящиеся окна, фонари, флора.
// Окна мигают неравномерно (lm-cwin со сдвигом задержки): город кажется живым,
// но мигание не отвлекает от задания — оно на фоне и aria-hidden.
// ---------------------------------------------------------------------------
export const LumoCityBg = ({ fill = false }) => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio={fill ? 'xMidYMid slice' : 'xMidYMax meet'} aria-hidden="true">
    <defs>
      <radialGradient id="lumocitybgvig" cx="50%" cy="43%" r="72%"><stop offset="0%" stopColor="#000" stopOpacity="0"/><stop offset="76%" stopColor="#000" stopOpacity="0"/><stop offset="100%" stopColor="#2A2018" stopOpacity="0.28"/></radialGradient>
    </defs>
    <rect x="0" y="0" width="400" height="230" fill="url(#lmSky)"/>
    {/* iliq quyosh (yuqori-o'ng) */}
    <circle cx="336" cy="38" r="42" fill="#FFE39A" opacity="0.4"/>
    <circle cx="336" cy="38" r="23" fill="url(#lmSun)"/>
    {/* O'ZGA SAYYORA OSMONI: halqali sayyora + oy */}
    <g>
      <circle cx="62" cy="44" r="15" fill="#C79AD6"/>
      <ellipse cx="62" cy="44" rx="25" ry="5.5" fill="none" stroke="#E6C8F0" strokeWidth="2.4" opacity="0.85"/>
      <ellipse cx="56" cy="39" rx="5" ry="3.2" fill="rgba(255,255,255,0.32)"/>
    </g>
    <g>
      <circle cx="150" cy="28" r="9" fill="#FBEAC6"/>
      <circle cx="154" cy="25" r="8" fill="url(#lmSky)"/>
    </g>
    <Cloud x={104} y={56} s={1.0}/>
    <Cloud x={244} y={40} s={0.8}/>
    {/* uchuvchi jonzotlar (osmon hayoti) */}
    {CREATURES.map((c, i) => <FlyCreature key={i} {...c}/>)}
    {/* uchar kristallar (havoda) */}
    {FLOATERS.map((f, i) => <FloatCrystal key={i} {...f}/>)}
    {/* UZOQ SHAHAR (xira, yuzlab chiroq) */}
    <g opacity="0.5">
      {FAR_TOWN.map(([x, w, ty], i) => (
        <g key={i}>
          <rect x={x} y={ty} width={w} height={230 - ty} rx="5" fill="#D6B4C0"/>
          {farWindows(x, w, ty, i + 1)}
        </g>
      ))}
    </g>
    {/* asosiy uylar — pastel; tom uchli/tekis/gumbaz; iliq derazalar */}
    {TOWN.map(([x, w, ty, body, roof, type], i) => (
      <g key={i}>
        {type === 'pitch' && <path d={`M${x - 3} ${ty + 2} L${x + w / 2 - 6} ${ty - 15} Q${x + w / 2} ${ty - 21} ${x + w / 2 + 6} ${ty - 15} L${x + w + 3} ${ty + 2} Z`} fill={roof}/>}
        {type === 'dome' && <path d={`M${x} ${ty + 2} A ${w / 2} ${w / 2.4} 0 0 1 ${x + w} ${ty + 2} Z`} fill={roof}/>}
        {type === 'flat' && <rect x={x - 3} y={ty - 8} width={w + 6} height="11" rx="4.5" fill={roof}/>}
        <rect x={x} y={ty} width={w} height={230 - ty} rx="9" fill={body}/>
        <rect x={x + 2} y={ty + 2} width="4" height={228 - ty} rx="2" fill="rgba(255,255,255,0.28)"/>
        {houseWindows(x, w, ty, i + 1)}
      </g>
    ))}
    {/* chiroq-ustunlar */}
    {LAMPS.map((x, i) => <Lamp key={i} x={x}/>)}
    {/* havoda porlovchi sporalar */}
    {SPORES.map(([sx, sy, c], i) => <circle key={i} className="lm-glow" style={{ animationDelay: `${i * 0.6}s` }} cx={sx} cy={sy} r="2.3" fill={c} opacity="0.85"/>)}
    {/* pol + yumshoq soya (grade1 naqsh) */}
    <rect x="0" y={PLAT_Y} width="400" height={230 - PLAT_Y} fill="url(#lmGround)"/>
    <line x1="0" y1={PLAT_Y} x2="400" y2={PLAT_Y} stroke="#C9A96E" strokeWidth="2"/>
    <ellipse cx="200" cy={PLAT_Y + 26} rx="180" ry="15" fill="#C9A96E" opacity="0.4"/>
    {/* shaharga eltuvchi yo'l */}
    <path d={`M168 230 L246 230 L216 ${PLAT_Y + 1} L198 ${PLAT_Y + 1} Z`} fill="#E4CDA0" opacity="0.6"/>
    <path d={`M198 ${PLAT_Y + 1} L216 ${PLAT_Y + 1} L214 ${PLAT_Y + 8} L200 ${PLAT_Y + 8} Z`} fill="#EFDCB4" opacity="0.5"/>
    {/* qo'ngan kema (old plan chap) */}
    <LandingPod x={52} s={1.05}/>
    {/* o'zga o'simlik + kristall + gullar (polda, old plan) */}
    {CRYSTALS.map(({ x, s, tint }, i) => <AlienCrystal key={i} x={x} s={s} tint={tint}/>)}
    {FLORA.map(({ x, s, C, tint }, i) => <C key={i} x={x} s={s} tint={tint}/>)}
    {GROUND_FLOWERS.map(([x, c], i) => (
      <g key={i}>
        <g fill={c} opacity="0.7"><circle cx={x - 2.6} cy={PLAT_Y + 8} r="1.6"/><circle cx={x + 2.6} cy={PLAT_Y + 8} r="1.6"/><circle cx={x} cy={PLAT_Y + 5.6} r="1.6"/><circle cx={x} cy={PLAT_Y + 10.4} r="1.6"/></g>
        <circle className="lm-glow" style={{ animationDelay: `${i * 0.5}s` }} cx={x} cy={PLAT_Y + 8} r="1.7" fill="#FFF4D0"/>
      </g>
    ))}
      {/* REALIZM: vinetka — chekka qorong'ilashuvi (chuqurlik + markazga fokus) */}
    <rect x="0" y="0" width="400" height="230" fill="url(#lumocitybgvig)" style={{ pointerEvents: 'none' }}/>
  </svg>
);

// ---------------------------------------------------------------------------
// МИНИ-ГОРОД — компактная улица для финального экрана.
// ---------------------------------------------------------------------------
export const MiniCity = () => (
  <svg viewBox="0 0 260 92" style={{ width: 'min(300px, 88%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g>
      <circle cx="30" cy="16" r="8" fill="#C79AD6"/>
      <ellipse cx="30" cy="16" rx="13.5" ry="3" fill="none" stroke="#E6C8F0" strokeWidth="1.6" opacity="0.85"/>
    </g>
    <circle cx="228" cy="14" r="9" fill="#FFE39A" opacity="0.55"/>
    <circle cx="228" cy="14" r="5.5" fill="url(#lmSun)"/>
    <g className="lm-float"><path d="M120 14 L125 21 L120 28 L115 21 Z" fill="#7FE0D8" opacity="0.9"/></g>
    {MINI_HOUSES.map(([x, w, h, body, roof, type], i) => {
      const ty = 84 - h;
      return (
        <g key={i}>
          {type === 'pitch' && <path d={`M${x - 2} ${ty + 1} L${x + w / 2 - 4} ${ty - 8} Q${x + w / 2} ${ty - 12} ${x + w / 2 + 4} ${ty - 8} L${x + w + 2} ${ty + 1} Z`} fill={roof}/>}
          {type === 'dome' && <path d={`M${x} ${ty + 1} A ${w / 2} ${w / 2.4} 0 0 1 ${x + w} ${ty + 1} Z`} fill={roof}/>}
          {type === 'flat' && <rect x={x - 2} y={ty - 5} width={w + 4} height="7" rx="3" fill={roof}/>}
          <rect x={x} y={ty} width={w} height={84 - ty} rx="5" fill={body}/>
          {[0, 1].map((r) => [0, 1].map((cc) => {
            const wy = ty + 8 + r * 12;
            if (wy > 78) return null;
            return <rect key={`${r}-${cc}`} className={(i + r + cc) % 3 === 0 ? 'lm-cwin' : ''} x={x + 5 + cc * (w - 14)} y={wy} width="5" height="6" rx="1.4" fill="url(#lmGlow)"/>;
          }))}
        </g>
      );
    })}
    <rect x="0" y="84" width="260" height="8" rx="3" fill="#DAC090"/>
    {[[70, '#8FE0D0'], [140, '#F0A0C8'], [206, '#8FD8F0']].map(([x, c], i) => (
      <circle key={i} className="lm-glow" style={{ animationDelay: `${i * 0.6}s` }} cx={x} cy="88" r="2" fill={c}/>
    ))}
  </svg>
);

// ---------------------------------------------------------------------------
// ЭКИПАЖ НА СЦЕНЕ — только ряд персонажей, без фона.
//
// Вынесено из HookScene, чтобы сцена конкретного урока могла поставить свой слой
// поверх города и НЕ вкладывать одну .lm-scene в другую: вложение дало бы два фона
// и две системы координат для absolute-слоёв. Порядок фигур (Bit в центре, экипаж
// по сторонам) — часть канона, поэтому живёт в каркасе, а не в уроке.
// ---------------------------------------------------------------------------
export const LumoSceneCast = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene-cast">
      {LUMO_CAST.slice(0, 2).map(kid)}
      <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
      {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// СЦЕНА-ОБРАМЛЕНИЕ (ETALON v2 §1.3)
// Bit — хозяин, в центре; экипаж по сторонам. gathered переключает оба состояния.
// Урок, которому нужен свой слой поверх города, собирает сцену сам из LumoCityBg
// и LumoSceneCast — см. scenes/Dars01/LumoCityScene.jsx.
// ---------------------------------------------------------------------------
export const HookScene = ({ gathered = false }) => (
  <div className="lm-scene">
    <LumoCityBg fill/>
    <LumoSceneCast gathered={gathered}/>
  </div>
);
