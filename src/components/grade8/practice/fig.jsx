// AMALIYOT CHIZMALARI — kichik o'lchamli SVG figuralar (metodist qarori
// 2026-08-24: «Grafik rasmlari ham bo'lsin, usullarimizga mos holda chizmali
// misollar qo'sh»).
//
// NEGA `plot.jsx` DAN OLINMADI. Dars qatlamidagi `plot.jsx` ning kadri QAT'IY
// 420px keng va 196px baland (`VB_W`, `PAD` — modul ichida konstanta), u
// `useT()` orqali `LangProvider` ni talab qiladi, chizmani ANIMATSIYA bilan
// chizadi va `PLOT_STYLES` ni sahifaga inyeksiya qilishni kutadi. Amaliyotda
// esa chizma KARTA ichida turadi: `Zones` ning guruh sarlavhasi 92px,
// `Choice` ning varianti 118px, `MatchPairs` ning katagi 76px. Ya'ni bu boshqa
// o'lcham sinfi va boshqa vazifa — bosiladigan asbob emas, YOZUV bo'lagi.
// `plot.jsx` ni ikki o'lchamga moslash 14 darsning chizmasiga tegish degani,
// metodist esa faqat 7-11 amaliyotini so'radi. Shuning uchun bu yerda
// ALOHIDA, kichik render turadi — `frac.jsx` qanday sababdan alohida tursa,
// o'sha sababdan (papka ichida bitta nusxa, hamma mexanika shundan oladi).
//
// NIMA CHIZADI:
//   hyp   giperbola y = k/x, ikki tarmoq; `touch` — ATAYLAB xato variant,
//         tarmoqlari o'qqa tegadi (З2 ni ko'z bilan ko'rsatish uchun)
//   lin   to'g'ri proporsionallik y = kx — to'g'ri chiziq (З27 ning varianti)
//   pts   faqat o'qlar va belgilangan nuqta: k ni O'QUVCHI hisoblaydi,
//         egri chiziqning shaklidan taniy olmasin
//   axis  son o'qi: butun bo'linmalar, nuqtalar va «?» belgisi
//
// RANGLAR amaliyot palitrasidan (`kit.jsx` dagi `C`). YASHIL RANG YO'Q:
// tekshiruv skripti xato javobdan keyin yashil qolganini nuqson deb hisoblaydi
// (grade8-practice-check.mjs), chizma esa javobdan qat'i nazar bir xil turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';

const INK = '#1f2430';
const AX = '#9aa1ad';
const GRID = '#eef0f4';
const CURVE = '#2C5FA8';
const HOT = '#fe5b1a';
const MONO = "'JetBrains Mono', ui-monospace, monospace";

// Kadr: x va y bir xil diapazonda (`R`), ya'ni giperbola cho'zilmaydi.
const box = (w, h, R) => {
  const m = 5;
  const cx = w / 2;
  const cy = h / 2;
  const sx = (w / 2 - m) / R;
  const sy = (h / 2 - m) / R;
  return {
    w, h, R,
    px: (x) => cx + x * sx,
    py: (y) => cy - y * sy,
  };
};

// Egri chiziq TARMOQLARGA bo'linadi: kadrdan chiqqan joyda uzilib, keyingi
// tarmoq yangi yo'ldan boshlanadi. Shu sababli y = k/x ikki bo'lak bo'lib
// chiziladi va nolda o'qqa ULANMAYDI — darsning asosiy fakti (З2).
const branches = (fn, R) => {
  const step = R / 90;
  const out = [];
  let cur = [];
  for (let x = -R; x <= R + 1e-9; x += step) {
    if (Math.abs(x) < 1e-6) { if (cur.length > 1) out.push(cur); cur = []; continue; }
    const y = fn(x);
    if (!Number.isFinite(y) || Math.abs(y) > R) { if (cur.length > 1) out.push(cur); cur = []; continue; }
    cur.push([x, y]);
  }
  if (cur.length > 1) out.push(cur);
  return out;
};

const dOf = (pts, f) => pts.map(([x, y], i) => (i ? 'L' : 'M') + f.px(x).toFixed(1) + ',' + f.py(y).toFixed(1)).join(' ');

const Axes = ({ f, grid }) => (
  <g>
    {grid ? (
      <g stroke={GRID} strokeWidth="1">
        {[-4, -2, 2, 4].map((v) => <line key={'gx' + v} x1={f.px(v)} y1={f.py(-f.R)} x2={f.px(v)} y2={f.py(f.R)} />)}
        {[-4, -2, 2, 4].map((v) => <line key={'gy' + v} x1={f.px(-f.R)} y1={f.py(v)} x2={f.px(f.R)} y2={f.py(v)} />)}
      </g>
    ) : null}
    <g stroke={AX} strokeWidth="1.4" strokeLinecap="round">
      <line x1={f.px(-f.R)} y1={f.py(0)} x2={f.px(f.R)} y2={f.py(0)} />
      <line x1={f.px(0)} y1={f.py(f.R)} x2={f.px(0)} y2={f.py(-f.R)} />
    </g>
    <g fill={AX}>
      <polygon points={`${f.px(f.R)},${f.py(0)} ${f.px(f.R) - 5},${f.py(0) - 2.6} ${f.px(f.R) - 5},${f.py(0) + 2.6}`} />
      <polygon points={`${f.px(0)},${f.py(f.R)} ${f.px(0) - 2.6},${f.py(f.R) + 5} ${f.px(0) + 2.6},${f.py(f.R) + 5}`} />
    </g>
  </g>
);

// «Xato» variant: tarmoqlar o'qqa TEGADI. Ataylab shunday chiziladi —
// o'quvchi nolda qiymat yo'qligini chizmada ko'rib rad etsin.
const touching = (f) => {
  const a = f.R * 0.74;
  const c = f.R * 0.3;
  const q = (x1, y1, cx, cy, x2, y2) =>
    `M${f.px(x1).toFixed(1)},${f.py(y1).toFixed(1)} Q${f.px(cx).toFixed(1)},${f.py(cy).toFixed(1)} ${f.px(x2).toFixed(1)},${f.py(y2).toFixed(1)}`;
  return [q(0, a, c, c, a, 0), q(0, -a, -c, -c, -a, 0)];
};

export function Fig({ spec, size }) {
  const kind = spec.fig;
  const w = spec.w || (kind === 'axis' ? 150 : 104);
  const h = spec.h || (kind === 'axis' ? 46 : 78);

  if (kind === 'axis') {
    const from = spec.from;
    const to = spec.to;
    const m = 12;
    const px = (v) => m + ((v - from) / (to - from)) * (w - 2 * m);
    const y = h - 18;
    const ticks = [];
    for (let v = from; v <= to + 1e-9; v += (spec.step || 1)) ticks.push(Number(v.toFixed(4)));
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }} role="img">
        <line x1={m - 8} y1={y} x2={w - m + 8} y2={y} stroke={AX} strokeWidth="1.4" strokeLinecap="round" />
        <polygon points={`${w - m + 8},${y} ${w - m + 3},${y - 2.6} ${w - m + 3},${y + 2.6}`} fill={AX} />
        {ticks.map((v) => (
          <g key={'t' + v}>
            <line x1={px(v)} y1={y - 3.5} x2={px(v)} y2={y + 3.5} stroke={AX} strokeWidth="1.4" />
            {/* O'nli kasr VERGUL bilan: sinfning butun matematikasi shunday
                yozadi (5,5 va 5.5 emas). */}
            <text x={px(v)} y={y + 15} textAnchor="middle" fontFamily={MONO} fontSize="10" fontWeight="800" fill={INK}>{String(v).replace('.', ',')}</text>
          </g>
        ))}
        {(spec.marks || []).map((mk, i) => (
          <g key={'m' + i}>
            {mk.q ? (
              <text x={px(mk.at)} y={y - 8} textAnchor="middle" fontFamily={MONO} fontSize="12" fontWeight="800" fill={HOT}>?</text>
            ) : (
              <circle cx={px(mk.at)} cy={y} r="4" fill={mk.open ? '#fff' : HOT} stroke={HOT} strokeWidth="2" />
            )}
            {mk.label ? (
              <text x={px(mk.at)} y={y - 14} textAnchor="middle" fontFamily={MONO} fontSize="10" fontWeight="800" fill={HOT}>{mk.label}</text>
            ) : null}
          </g>
        ))}
      </svg>
    );
  }

  const f = box(w, h, spec.R || 7);
  const curves = [];
  if (kind === 'hyp' && spec.touch) curves.push(...touching(f));
  else if (kind === 'hyp') branches((x) => spec.k / x, f.R).forEach((b) => curves.push(dOf(b, f)));
  else if (kind === 'lin') branches((x) => spec.k * x, f.R).forEach((b) => curves.push(dOf(b, f)));

  const pts = spec.pts || (spec.pt ? [spec.pt] : []);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }} role="img">
      <Axes f={f} grid={spec.grid !== false} />
      {curves.map((d, i) => (
        <path key={'c' + i} d={d} fill="none" stroke={CURVE} strokeWidth="2.2" strokeLinecap="round" />
      ))}
      {pts.map((p, i) => {
        // Yozuv nuqtaning ustida turadi, lekin nuqta kadrning tepasiga yaqin
        // bo'lsa — TAGIDA: aks holda u chizmadan chiqib ketardi (o'lchov
        // 2026-08-24, dars07 05-topshiriq, (2; 6) yozuvi ramkadan chiqdi).
        const high = p.y > (spec.R || 7) * 0.55;
        return (
          <g key={'p' + i}>
            <circle cx={f.px(p.x)} cy={f.py(p.y)} r="3.6" fill={HOT} />
            {p.label ? (
              <text x={f.px(p.x) + (p.x < 0 ? -6 : 6)} y={f.py(p.y) + (high ? 13 : -6)}
                textAnchor={p.x < 0 ? 'end' : 'start'}
                fontFamily={MONO} fontSize={size && size < 16 ? 9 : 10} fontWeight="800" fill={INK}>{p.label}</text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
