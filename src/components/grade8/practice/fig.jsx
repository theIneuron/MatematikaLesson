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
//   circ  aylana: markaz, vatarlar, diametr, RADIUSLAR, hamda aylanaga
//         ichki (`verts`) yoki tashqi (`tang`) chizilgan ko'pburchak va
//         punktir bissektrisalar/o'rta perpendikulyarlar (`cev`) —
//         hammasi BURCHAK bilan beriladi, koordinata hisoblanmaydi
//   vec   strelkali kesmalar: vektor, ixtiyoriy koordinata to'ri bilan
//   poly  ko'pburchak: uchlari, nomlari, tenglik shtrixlari, parallellik
//         strelkalari, to'g'ri burchak kvadratchasi va qo'shimcha kesmalar
//         (balandlik, diagonal), hamda `mids` — tomonning O'RTASINI
//         ko'rsatuvchi nuqta: o'rta chiziqning ta'rifi ko'z bilan emas,
//         BELGI bilan tekshiriladi, va `rmark` — ixtiyoriy nuqtadagi
//         to'g'ri burchak kvadratchasi (kesma tomonni kesgan joyda)
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

// ============================================================ KO'PBURCHAK
// Metodist qarori 2026-08-25 (`DARS31_40_AMALIYOT_SKELET.md` §0a.2): 37-40
// darslar to'rtburchaklar haqida, `fig.jsx` esa to'rtburchak chizolmasdi.
// «Qaysi kesma balandlik» degan savolni chizmasiz berish ta'rifni yodlatadi,
// ko'rsatmaydi — `DINAMIKA_VA_ILLUSTRATSIYA.md`.
//
// KOORDINATALAR TO'G'RIDAN-TO'G'RI KADRDA, avtomatik moslash YO'Q. Sabab:
// bitta topshiriqda olti figura yonma-yon turadi va ular BIR o'lchovda
// bo'lishi kerak — «asosi va balandligi bir xil, qiyaligi boshqa» degan
// fakt aynan shu bilan ko'rinadi (40-dars, 10-topshiriq). Avtomatik moslash
// har figurani o'z kadriga cho'zib, taqqoslashni buzardi. y pastga qarab
// o'sadi, ya'ni dars qatlamidagi `PGRAM`, `TRAP` yozuvi bilan bir xil.
//
// YASHIL RANG YO'Q (fayl boshidagi qoida): chizma javobdan qat'i nazar bir
// xil turadi. Figuraning o'zi siyoh rangda, qo'shimcha kesmalar va belgilar
// urg'u rangida — ular MASALANING bo'lagi, figuraning emas.
const polyEdges = (pts) => pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);
const unit = (a, b) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
};

function PolyMarks({ pts, ticks, arrows, right, mids, rmark }) {
  const edges = polyEdges(pts);
  const out = [];
  // O'RTA NUQTA. `ticks` bu ish uchun yaramaydi: shtrix «bu tomon anovi
  // tomonga TENG» degan ma'noni beradi, «bu nuqta tomonning o'rtasi» degan
  // ma'noni emas — uch tomonning o'rtasini shtrix bilan ko'rsatish uchun
  // har tomonga boshqa sondagi shtrix kerak bo'lardi (1, 2, 3), ya'ni
  // 100x74 kadrda o'n ikkita belgi. Shuning uchun o'rta NUQTA bilan
  // belgilanadi, izohi topshiriqning shartida turadi. Nuqta siyoh rangda:
  // u FIGURANING ma'lumoti, savolning o'zi emas (savol — urg'u rangidagi
  // kesma). Metodist qarori 2026-08-25.
  (mids || []).forEach((e) => {
    const [a, b] = edges[e];
    out.push(<circle key={'md' + e} cx={(a[0] + b[0]) / 2} cy={(a[1] + b[1]) / 2} r="2.4" fill={INK} />);
  });
  // Tenglik shtrixi: tomonning o'rtasida, unga PERPENDIKULYAR qisqa chiziq.
  // `n` — nechta shtrix: bir juft teng tomon bitta, ikkinchi juft ikkita.
  (ticks || []).forEach((t, k) => {
    const [a, b] = edges[t.e];
    const [ux, uy] = unit(a, b);
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    for (let i = 0; i < (t.n || 1); i += 1) {
      const off = ((t.n || 1) - 1) / 2 - i;
      const cx = mx + ux * off * 3.4;
      const cy = my + uy * off * 3.4;
      out.push(<line key={`tk${k}_${i}`} x1={cx - uy * 3.4} y1={cy + ux * 3.4} x2={cx + uy * 3.4} y2={cy - ux * 3.4}
        stroke={HOT} strokeWidth="1.6" strokeLinecap="round" />);
    }
  });
  // Parallellik strelkasi: tomonning o'rtasida, tomon YO'NALISHIGA qaragan
  // uchburchakcha. Shtrix bilan aralashmaydi — shakli boshqa.
  (arrows || []).forEach((t, k) => {
    const [a, b] = edges[t.e];
    const [ux, uy] = unit(a, b);
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    for (let i = 0; i < (t.n || 1); i += 1) {
      const off = ((t.n || 1) - 1) / 2 - i;
      const cx = mx + ux * off * 4.2;
      const cy = my + uy * off * 4.2;
      out.push(<polyline key={`ar${k}_${i}`} fill="none" stroke={HOT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        points={`${cx - ux * 2.6 - uy * 2.8},${cy - uy * 2.6 + ux * 2.8} ${cx + ux * 2.6},${cy + uy * 2.6} ${cx - ux * 2.6 + uy * 2.8},${cy - uy * 2.6 - ux * 2.8}`} />);
    }
  });
  // To'g'ri burchak: uchdan ikki tomonga qarab kichik kvadrat.
  (right || []).forEach((v) => {
    const n = pts.length;
    const here = pts[v];
    const [px, py] = unit(here, pts[(v - 1 + n) % n]);
    const [nx, ny] = unit(here, pts[(v + 1) % n]);
    const s = 6;
    out.push(<polyline key={`rt${v}`} fill="none" stroke={AX} strokeWidth="1.3"
      points={`${here[0] + px * s},${here[1] + py * s} ${here[0] + (px + nx) * s},${here[1] + (py + ny) * s} ${here[0] + nx * s},${here[1] + ny * s}`} />);
  });
  // TO'G'RI BURCHAK IXTIYORIY NUQTADA. Yuqoridagi `right` faqat UCHDA
  // ishlaydi: u ko'pburchakning ikki tomoni orasidagi burchakni belgilaydi.
  // Bu esa kesma bilan tomon kesishgan joyda kerak bo'ladi — masalan yon
  // tomonga tushirilgan perpendikulyar (42-07 dagi tuzoq): perpendikulyarlik
  // KO'RINSIN, aks holda o'quvchi razbordagi «yon tomonga tik» degan gapni
  // tekshira olmaydi. `at` — burchakning uchi, `to1` va `to2` — ikki
  // yo'nalish qaragan nuqtalar (koordinata, uch indeksi emas).
  (rmark || []).forEach((m, k) => {
    const [ax, ay] = unit(m.at, m.to1);
    const [bx, by] = unit(m.at, m.to2);
    const s2 = m.s || 5;
    out.push(<polyline key={'rm' + k} fill="none" stroke={AX} strokeWidth="1.3"
      points={`${m.at[0] + ax * s2},${m.at[1] + ay * s2} ${m.at[0] + (ax + bx) * s2},${m.at[1] + (ay + by) * s2} ${m.at[0] + bx * s2},${m.at[1] + by * s2}`} />);
  });
  return <g>{out}</g>;
}

export function Fig({ spec, size }) {
  const kind = spec.fig;
  const w = spec.w || (kind === 'axis' ? 150 : 104);
  const h = spec.h || (kind === 'axis' ? 46 : 78);

  if (kind === 'poly') {
    const pts = spec.pts;
    const at = (v) => (typeof v === 'number' ? pts[v] : v);
    const lbl = Math.max(8, Math.round((size && size < 16 ? 8 : 9)));
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }} role="img">
        <polygon points={pts.map((p) => `${p[0]},${p[1]}`).join(' ')} fill="#f8fafc" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
        {(spec.segs || []).map((s, i) => {
          const a = at(s.from);
          const b = at(s.to);
          return <line key={'sg' + i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={HOT} strokeWidth="1.6"
            strokeLinecap="round" strokeDasharray={s.dash ? '3 2.5' : undefined} />;
        })}
        <PolyMarks pts={pts} ticks={spec.ticks} arrows={spec.arrows} right={spec.right} mids={spec.mids} rmark={spec.rmark} />
        {/* Uchning nomi figuradan TASHQARIDA turadi: markazdan uchga qarab
            siljitiladi, ya'ni u hech qachon tomonning ustiga tushmaydi. */}
        {(spec.names || []).map((nm, i) => {
          if (!nm) return null;
          const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
          const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
          const [ux, uy] = unit([cx, cy], pts[i]);
          return (
            <text key={'nm' + i} x={pts[i][0] + ux * 7} y={pts[i][1] + uy * 7 + lbl * 0.36} textAnchor="middle"
              fontFamily={MONO} fontSize={lbl} fontWeight="800" fill={INK}>{nm}</text>
          );
        })}
      </svg>
    );
  }

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
        {/* ORALIQNING O'ZI (metodist qarori 2026-08-25, 21-30 skeleti §0a.2).
            Ikki doiracha to'plamni ANGLATMAYDI: `[0;3]` va `(0;3)` ning
            farqi doirachada, lekin ular orasidagi sonlar hech qayerda
            chizilmasdi. Endi oraliq o'qning ustida qalin chiziq bo'lib
            turadi, doirachalar esa uning ustiga tushadi (shuning uchun bu
            blok `marks` dan OLDIN).
            `from`/`to` berilmasa — chegara cheksiz, uchida strelka.
            Qo'shimcha maydon: `spans` bo'lmasa hech narsa chizilmaydi, ya'ni
            7-20 darslarning chizmalari o'zgarmaydi. */}
        {(spec.spans || []).map((sp, i) => {
          const x1 = sp.from === undefined ? m - 6 : px(sp.from);
          const x2 = sp.to === undefined ? w - m + 6 : px(sp.to);
          return (
            <g key={'s' + i}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={HOT} strokeWidth="5"
                strokeLinecap="butt" opacity="0.32" />
              {sp.from === undefined ? (
                <polygon points={`${x1 - 5},${y} ${x1},${y - 3.4} ${x1},${y + 3.4}`} fill={HOT} opacity="0.32" />
              ) : null}
              {sp.to === undefined ? (
                <polygon points={`${x2 + 5},${y} ${x2},${y - 3.4} ${x2},${y + 3.4}`} fill={HOT} opacity="0.32" />
              ) : null}
            </g>
          );
        })}
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

  // ============================================================ AYLANA
  // Metodist tasdig'i 2026-08-25 (`DARS41_50_AMALIYOT_SKELET.md` §0a.2):
  // 48-49 darslar aylana haqida, `poly` esa faqat ko'pburchak chizadi.
  // Aylanada TOMON yo'q — markaz, radius, vatar va diametr bor.
  //
  // NUQTALAR BURCHAK BILAN BERILADI (gradus, noldan soat miliga qarshi):
  // shu sababli vatarning markazdan o'tishi yoki o'tmasligi, ikki vatarning
  // perpendikulyar yoki qiya kesishishi KOORDINATA hisoblamasdan aniqlanadi.
  //   { fig: 'circ', chords: [{ a: 20, b: 200 }] }        -- diametr
  //   { fig: 'circ', chords: [{ a: 30, b: 150, names: ['A','B'] }] }
  // `center` bo'lmasa markaz nuqtasi chizilmaydi (default: chiziladi).
  //
  // BELGI QO'YILMAYDI: perpendikulyarlik kvadratchasi ham, shtrix ham yo'q —
  // 48-06 va 49-01 topshiriqlarida aynan shu narsalar SO'RALADI, ya'ni belgi
  // javobni ochib qo'yardi (skelet §2). Yashil rang yo'q (fayl boshidagi qoida).
  if (kind === 'circ') {
    const r = spec.r || Math.min(w, h) / 2 - 10;
    const cx = spec.cx || w / 2;
    const cy = spec.cy || h / 2;
    const at = (deg) => {
      const t = (deg * Math.PI) / 180;
      return [cx + r * Math.cos(t), cy - r * Math.sin(t)];
    };
    const lbl = size && size < 16 ? 8 : 9;
    // RADIUS, ICHKI VA TASHQI KO'PBURCHAK — hammasi GRADUS bilan beriladi,
    // ya'ni `circ` ning bor modelidan chiqmaydi (metodist tasdig'i 2026-08-25,
    // `DARS51_55_AMALIYOT_SKELET.md` §0a.2). Koordinata hisoblanmaydi:
    //   radii: [150, 70]              -- markazdan chiqqan kesmalar
    //   verts: [90, 210, 330]         -- aylanaga ICHKI chizilgan ko'pburchak
    //   tang:  [90, 210, 330]         -- aylanaga TASHQI chizilgan ko'pburchak
    //                                    (tomonlari shu nuqtalarda urinadi)
    //   plain: true                   -- HAMMA chiziq siyoh rangida: rang
    //                                    javobni ochib qo'ymasligi kerak bo'lgan
    //                                    topshiriqlarda (51-03: ichki va markaziy
    //                                    burchakni faqat GEOMETRIYA ajratadi)
    //   cev: true                     -- punktir: `tang` da bissektrisalar
    //                                    (uchdan markazga), `verts` da o'rta
    //                                    perpendikulyarlar (markazdan tomonning
    //                                    o'rtasiga)
    // `tang` da uchlar aylanadan TASHQARIDA yotadi, ya'ni `r` ni kichikroq
    // berish kerak — kadr avtomatik kengaymaydi.
    const rr = (spec.radii || []).map((x) => (typeof x === 'number' ? { at: x } : x));
    const vn = spec.vnames || [];
    const vpts = (spec.verts || []).map(at);
    const tang = spec.tang || [];
    const tpts = tang.map((t, i) => {
      const u = tang[(i + 1) % tang.length] + (i + 1 === tang.length ? 360 : 0);
      const m = ((t + u) / 2) * (Math.PI / 180);
      const d = (((u - t) / 2) * Math.PI) / 180;
      const q = r / Math.cos(d);
      return [cx + q * Math.cos(m), cy - q * Math.sin(m)];
    });
    const poly = tpts.length ? tpts : vpts;
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const cev = !spec.cev ? [] : tpts.length
      ? tpts.map((q) => [[cx, cy], q])
      : vpts.map((q, i) => [[cx, cy], mid(q, vpts[(i + 1) % vpts.length])]);
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }} role="img">
        {tpts.length ? <polygon points={tpts.map((q) => `${q[0]},${q[1]}`).join(' ')} fill="#f8fafc" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" /> : null}
        <circle cx={cx} cy={cy} r={r} fill={tpts.length ? 'none' : '#f8fafc'} stroke={INK} strokeWidth="1.6" />
        {vpts.length ? <polygon points={vpts.map((q) => `${q[0]},${q[1]}`).join(' ')} fill="none" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" /> : null}
        {cev.map((c, i) => <line key={'cv' + i} x1={c[0][0]} y1={c[0][1]} x2={c[1][0]} y2={c[1][1]} stroke={HOT} strokeWidth="1.3" strokeLinecap="round" strokeDasharray="3 2.5" />)}
        {rr.map((q, i) => {
          const b = at(q.at);
          return <line key={'rd' + i} x1={cx} y1={cy} x2={b[0]} y2={b[1]} stroke={INK} strokeWidth="1.5" strokeLinecap="round" />;
        })}
        {rr.map((q, i) => {
          if (!q.name) return null;
          const b = at(q.at);
          const [ux, uy] = unit([cx, cy], b);
          return <text key={'rn' + i} x={b[0] + ux * 7} y={b[1] + uy * 7 + lbl * 0.36} textAnchor="middle"
            fontFamily={MONO} fontSize={lbl} fontWeight="800" fill={INK}>{q.name}</text>;
        })}
        {poly.map((q, i) => {
          if (!vn[i]) return null;
          const [ux, uy] = unit([cx, cy], q);
          return <text key={'vn' + i} x={q[0] + ux * 7} y={q[1] + uy * 7 + lbl * 0.36} textAnchor="middle"
            fontFamily={MONO} fontSize={lbl} fontWeight="800" fill={INK}>{vn[i]}</text>;
        })}
        {(spec.chords || []).map((c, i) => {
          const p = at(c.a);
          const q = at(c.b);
          return (
            <g key={'ch' + i}>
              <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={spec.plain ? INK : HOT} strokeWidth="1.6" strokeLinecap="round" />
              {(c.names || []).map((nm, k) => {
                if (!nm) return null;
                const [ux, uy] = unit([cx, cy], k ? q : p);
                const b = k ? q : p;
                return (
                  <text key={'n' + k} x={b[0] + ux * 7} y={b[1] + uy * 7 + lbl * 0.36} textAnchor="middle"
                    fontFamily={MONO} fontSize={lbl} fontWeight="800" fill={INK}>{nm}</text>
                );
              })}
            </g>
          );
        })}
        {spec.center === false ? null : (
          <g>
            <circle cx={cx} cy={cy} r="2.2" fill={INK} />
            <text x={cx - 6} y={cy + lbl + 2} textAnchor="middle" fontFamily={MONO} fontSize={lbl} fontWeight="800" fill={INK}>O</text>
          </g>
        )}
      </svg>
    );
  }

  // ============================================================ VEKTOR
  // Metodist tasdig'i 2026-08-25 (`DARS51_55_AMALIYOT_SKELET.md` §0a.2):
  // 53-55 darslar vektor haqida, vektor esa YO'NALISHGA ega kesma — strelkasiz
  // u shunchaki kesma bo'lib qoladi va darsning butun mavzusi yo'qoladi.
  // З112 («teng vektorlar bitta nuqtadan chiqishi kerak») FAQAT chizmada rad
  // etiladi: bir xil strelkani turli joyga qo'yish kerak, buni yozuv aytmaydi.
  //
  //   { fig: 'vec', w: 60, h: 44, arrows: [{ from: [8, 34], to: [50, 12] }] }
  //   { fig: 'vec', w: 90, h: 60, segs: [{ from: [..], to: [..] }],  -- strelkasiz
  //     arrows: [{ from: [..], to: [..] }] }                        kesma
  //   { fig: 'vec', grid: { x: [-1, 8], y: [-1, 7] },
  //     arrows: [{ from: [2, 5], to: [7, 1], name: 'AB' }], dots: [...] }
  //
  // `grid` bo'lsa koordinatalar KATAK birligida, bo'lmasa xom viewBox
  // koordinatasida (`poly` dagi kabi — bir topshiriqdagi hamma strelka bitta
  // o'lchovda bo'lishi uchun avtomatik moslash ATAYLAB yo'q).
  // `ref: true` — solishtirish uchun turgan vektor: siyoh rangida, ingichka.
  if (kind === 'vec') {
    const g = spec.grid;
    const M = 7;
    const gx = g ? (w - 2 * M) / (g.x[1] - g.x[0]) : 1;
    const gy = g ? (h - 2 * M) / (g.y[1] - g.y[0]) : 1;
    const P = (q) => (g ? [M + (q[0] - g.x[0]) * gx, h - M - (q[1] - g.y[0]) * gy] : q);
    const lbl = size && size < 16 ? 8 : 9;
    const head = (a, b, sz) => {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const L = Math.hypot(dx, dy) || 1;
      const ux = dx / L;
      const uy = dy / L;
      const base = [b[0] - ux * sz, b[1] - uy * sz];
      const k = sz * 0.42;
      return `${b[0]},${b[1]} ${base[0] - uy * k},${base[1] + ux * k} ${base[0] + uy * k},${base[1] - ux * k}`;
    };
    const ticks = [];
    if (g) {
      for (let x = Math.ceil(g.x[0]); x <= g.x[1]; x += 1) ticks.push(['v', x]);
      for (let y = Math.ceil(g.y[0]); y <= g.y[1]; y += 1) ticks.push(['h', y]);
    }
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }} role="img">
        {ticks.map(([d, v], i) => (d === 'v'
          ? <line key={'g' + i} x1={P([v, g.y[0]])[0]} y1={P([v, g.y[0]])[1]} x2={P([v, g.y[1]])[0]} y2={P([v, g.y[1]])[1]} stroke="#e0e5ec" strokeWidth="1" />
          : <line key={'g' + i} x1={P([g.x[0], v])[0]} y1={P([g.x[0], v])[1]} x2={P([g.x[1], v])[0]} y2={P([g.x[1], v])[1]} stroke="#e0e5ec" strokeWidth="1" />))}
        {g ? <line x1={P([g.x[0], 0])[0]} y1={P([g.x[0], 0])[1]} x2={P([g.x[1], 0])[0]} y2={P([g.x[1], 0])[1]} stroke={AX} strokeWidth="1.2" /> : null}
        {g ? <line x1={P([0, g.y[0]])[0]} y1={P([0, g.y[0]])[1]} x2={P([0, g.y[1]])[0]} y2={P([0, g.y[1]])[1]} stroke={AX} strokeWidth="1.2" /> : null}
        {(spec.segs || []).map((g, i) => {
          const a = P(g.from);
          const b = P(g.to);
          return <line key={'sg' + i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={INK} strokeWidth="1.3"
            strokeLinecap="round" strokeDasharray={g.dash ? '3 2.5' : undefined} />;
        })}
        {(spec.arrows || []).map((v, i) => {
          const a = P(v.from);
          const b = P(v.to);
          const col = v.ref ? INK : HOT;
          const wd = v.ref ? 1.4 : 1.9;
          const sz = v.ref ? 5.2 : 6;
          const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
          const ux = (b[0] - a[0]) / L;
          const uy = (b[1] - a[1]) / L;
          return (
            <g key={'v' + i}>
              <line x1={a[0]} y1={a[1]} x2={b[0] - ux * sz * 0.6} y2={b[1] - uy * sz * 0.6} stroke={col} strokeWidth={wd} strokeLinecap="round" strokeDasharray={v.dash ? '3 2.5' : undefined} />
              <polygon points={head(a, b, sz)} fill={col} />
              {v.name ? (
                <text x={(a[0] + b[0]) / 2 - uy * 8} y={(a[1] + b[1]) / 2 + ux * 8 + lbl * 0.36} textAnchor="middle"
                  fontFamily={MONO} fontSize={lbl} fontWeight="800" fill={col}>{v.name}</text>
              ) : null}
            </g>
          );
        })}
        {(spec.dots || []).map((d, i) => {
          const q = P(d.at);
          return (
            <g key={'d' + i}>
              <circle cx={q[0]} cy={q[1]} r="2.2" fill={INK} />
              {d.name ? <text x={q[0] + (d.dx || 0)} y={q[1] + (d.dy || -5)} textAnchor="middle" fontFamily={MONO} fontSize={lbl} fontWeight="800" fill={INK}>{d.name}</text> : null}
            </g>
          );
        })}
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
              <text x={f.px(p.x) + (p.x < 0 ? 6 : -6)} y={f.py(p.y) + (high ? 13 : -6)}
                textAnchor={p.x < 0 ? 'start' : 'end'}
                fontFamily={MONO} fontSize={size && size < 16 ? 9 : 10} fontWeight="800" fill={INK}>{p.label}</text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
