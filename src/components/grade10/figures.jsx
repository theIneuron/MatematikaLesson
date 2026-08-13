// ============================================================================
// 10-sinf: POKADR FIGURALAR UCHUN UMUMIY KARKAS.
//
// NEGA BU FAYL BOR. 3-darsda uchta pokadr figura bor -- `WheelBridge`,
// `EquiFig`, `RightTriangleLimit` -- va ularning har biri o'z ichida BIR XIL
// narsani qaytadan yozadi: kamera (markaz va masshtab yumshoq siljiydi),
// kadr indeksi, uzluksiz aylanish, `prefers-reduced-motion` ni hurmat qilish.
// Uchtasi birga ~400 satr, va yarmidan ko'pi shu o'ram.
//
// Metodist 2026-08-13: «deyarli har slaydda animatsion tushuntirish bor».
// 52 dars oldinda. Har figura uchun o'ramni qaytadan yozish -- 52 marta bir
// xil ish va 52 joyda bir xil xato.
//
// SHUNING UCHUN: `Film` o'ramni bir marta oladi, figura esa faqat CHIZADI.
//
// FIGURA NIMA OLADI (`draw` funksiyasiga):
//   P(x, y)  -- birlik koordinatani ekran nuqtasiga o'giradi: P(1,0) -- o'ngda
//               radius uchida, P(0,0) -- markaz. Kamera qanday bo'lsa ham
//               figura O'ZINI birlik koordinatada yozadi.
//   R        -- joriy masshtab (piksel), ya'ni birlik uzunlik.
//   cx, cy   -- kameraning joriy markazi
//   step     -- kadr raqami
//   spin     -- uzluksiz aylanish burchagi (kerak bo'lsa)
//   size     -- kvadrat tomoni
//
// QOIDA (etalon §5.1): obyektlar bir-birini ALMASHTIRMAYDI, biri ikkinchisiga
// AYLANADI. Shuning uchun umumiy chiziqlar (markaz, radius, balandlik) hamma
// kadrda O'SHA joyda qoladi, faqat atrofidagi narsa paydo bo'ladi va yo'qoladi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { MATH_FONT, T, useSpin, useTween } from './core.jsx'

// Kamera holati kadr bo'yicha. `x`, `y` -- kvadratning ulushi, `r` -- birlik
// uzunlik ham ulushda. Ro'yxat kadrlardan qisqa bo'lsa, oxirgisi qoladi.
const camAt = (cams, step) => {
  const list = Array.isArray(cams) && cams.length ? cams : [{ x: 0.5, y: 0.5, r: 0.34 }]
  return list[Math.min(step, list.length - 1)]
}

export function Film({
  size = 268,
  step = 0,
  cam = [],
  // Uzluksiz aylanish: kadr -> daraja/sekund. Faqat kerakli kadrda yonadi.
  // «Ovoz «aylanadi» deyayotganda ekranda AYLANISHI kerak» (etalon §5.1).
  spinAt = {},
  ms = 820,
  draw,
  title,
}) {
  const c = camAt(cam, step)
  // Kamera YUMSHOQ suriladi. Sakrash bo'lsa, o'quvchi uchun bu boshqa rasm.
  const cx = useTween(size * c.x, ms)
  const cy = useTween(size * c.y, ms)
  const R = useTween(size * c.r, ms)
  const spin = useSpin(spinAt[step] || 0, 0)

  const P = (x, y) => [cx + R * x, cy - R * y]

  return (
    <div className="g10-circle-wrap">
      <svg
        className="g10-circle g10-circle-locked"
        width={size}
        height={size}
        style={{ maxWidth: size, maxHeight: size }}
        viewBox={'0 0 ' + size + ' ' + size}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={title || undefined}
      >
        {draw ? draw({ P, R, cx, cy, step, spin, size, T }) : null}
      </svg>
    </div>
  )
}

// Yoy yo'li: 0 dan `to` gradusga, soat miliga QARSHI (musbat yo'nalish).
// To'liq aylanani bitta `A` bilan chizib bo'lmaydi -- ikkiga bo'linadi.
export const arcPath = (P, to) => {
  const [x0, y0] = P(1, 0)
  const d = Math.min(359.99, Math.max(0, to))
  const rad = (deg) => (deg * Math.PI) / 180
  const at = (deg) => P(Math.cos(rad(deg)), Math.sin(rad(deg)))
  const [x1, y1] = at(Math.min(d, 180))
  const r = Math.hypot(x1 - P(0, 0)[0], y1 - P(0, 0)[1])
  if (d <= 180) return `M ${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1}`
  const [x2, y2] = at(d)
  return `M ${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`
}

// KESMA -> YOY. Uzunlik SAQLANADI: shuning uchun bu «cho'zilish» emas,
// aynan EGILISH. 1-darsning yuragi shu: yoy bu O'SHA radius, faqat egilgan.
//
// Geometriya. Kesma A0 = (1; 0) nuqtadan boshlanadi va aylanaga TEGIB turadi
// (yuqoriga qarab). Egilish `bend = t` bo'lganda u radiusi 1/t bo'lgan aylana
// yoyi bo'ladi, markazi C = (1 - 1/t; 0):
//     x = (1 - 1/t) + (1/t)·cos(s·t),   y = (1/t)·sin(s·t)
// `t -> 0` da bu tik kesmaga (x = 1, y = s), `t = 1` da esa AYNAN birlik
// aylanaga aylanadi: x = cos s, y = sin s. Ya'ni oxirida yoy 1 radianga
// (57,3°) yetadi -- ta'rif shundan chiqadi.
export const wrapPath = (P, bend, len = 1) => {
  const N = 28
  const t = Math.max(1e-4, Math.min(1, bend))
  const pts = []
  for (let i = 0; i <= N; i += 1) {
    const s = (i / N) * len
    const x = (1 - 1 / t) + (1 / t) * Math.cos(s * t)
    const y = (1 / t) * Math.sin(s * t)
    pts.push(P(x, y))
  }
  return 'M ' + pts.map(([x, y]) => `${x} ${y}`).join(' L ')
}

// Yoyning BIR BO'LAGI: `from` dan `to` gacha (radianda, A0 dan sanaladi).
export const wrapArc = (P, from, to) => {
  const N = 24
  const pts = []
  for (let i = 0; i <= N; i += 1) {
    const s = from + ((to - from) * i) / N
    pts.push(P(Math.cos(s), Math.sin(s)))
  }
  return 'M ' + pts.map(([x, y]) => `${x} ${y}`).join(' L ')
}

// RADIUS KO'TARILADI: markazdan A0 ga suriladi va o'ngdan yuqoriga buriladi.
// `lift = 0` -- gorizontal radius (markazdan A0 ga), `lift = 1` -- A0 dan
// yuqoriga qarab turgan tik kesma, ya'ni egilishga TAYYOR holat.
export const liftPath = (P, lift, len = 1) => {
  const k = Math.max(0, Math.min(1, lift))
  const ang = (Math.PI / 2) * k
  const [x0, y0] = P(k, 0)
  const [x1, y1] = P(k + len * Math.cos(ang), len * Math.sin(ang))
  return `M ${x0} ${y0} L ${x1} ${y1}`
}

// ============================================================
// RADIUS YOY BO'YLAB YOTADI -- 1-darsning ASOSIY kadri.
//
// Kadrlar:
//   0  aylana va gorizontal RADIUS. Ovoz: «radius birga teng».
//   1  radius A0 ga suriladi va tikka turadi -- «uni aylananing o'ziga
//      qo'yamiz» degan gap AYNAN shu payt aytiladi.
//   2  kesma EGILADI va aylanaga yotadi. Oxiri 1 radian: 57,3°.
//   3  yoy qoladi, yorlig'i bilan: «yoy = 1, burchak = 1 radian».
//
// Etalon §5.1: obyekt almashmaydi, AYLANADI. Shuning uchun aylana, markaz va
// A0 nuqtasi hamma kadrda O'SHA joyda turadi; faqat kesma harakat qiladi.
// ============================================================
export function RadiusBend({ size = 268, step = 0 }) {
  // Ko'tarilish 2-kadrga qadar tugaydi, egilish undan keyin boshlanadi:
  // ikkisi bir vaqtda ketsa, «ko'tardi» ham, «egdi» ham ko'rinmaydi.
  const lift = useTween(step >= 1 ? 1 : 0, 620)
  const bend = useTween(step >= 2 ? 1 : 0, 1150)
  const shown = step >= 2 ? bend : 0

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.4 }]}
      draw={({ P, R }) => {
        const [ox, oy] = P(0, 0)
        const [ax, ay] = P(1, 0)
        const rDot = Math.max(4, R * 0.06)
        const fs = Math.max(11, Math.round(size * 0.055))
        // Yoy oxiri: egilish tugaganda 1 radian.
        const end = shown > 0.02
          ? (() => {
            const t = Math.max(1e-4, shown)
            return P((1 - 1 / t) + (1 / t) * Math.cos(t), (1 / t) * Math.sin(t))
          })()
          : null
        return (
          <g>
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />
            <circle cx={ox} cy={oy} r={rDot * 0.6} fill={T.ink3} />
            <circle cx={ax} cy={ay} r={rDot * 0.7} fill={T.ink3} />

            {/* KESMA. Bitta obyekt: avval radius, keyin tik kesma, keyin yoy. */}
            <path
              d={shown > 0.02 ? wrapPath(P, shown) : liftPath(P, lift)}
              fill="none"
              stroke={T.accent}
              strokeWidth="4.2"
              strokeLinecap="round"
            />

            {end ? <circle cx={end[0]} cy={end[1]} r={rDot} fill={T.accent} /> : null}

            {/* Yorliq FAQAT oxirgi kadrda: undan oldin u javobni berib qo'yardi. */}
            {step >= 3 ? (
              <text
                x={ox} y={oy - R * 0.18}
                textAnchor="middle"
                fontFamily={MATH_FONT}
                fontSize={fs}
                fontWeight="700"
                fill={T.accent}
                stroke={T.bg}
                strokeWidth={Math.max(3, size * 0.013)}
                paintOrder="stroke"
              >
                1 rad
              </text>
            ) : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================
// VATAR VA YOY POYGASI -- 1-darsning FARQLASH kadri.
//
// NEGA BITTA UZUNLIK YETMAYDI. Uzunligi radiusga teng vatar 60° da tugaydi,
// o'sha uzunlikdagi yoy esa 57,3° da: farq 2,7 gradus, ya'ni ekranda TO'QQIZ
// piksel. Ko'rinmaydigan guvoh guvoh emas. Birinchi variant aynan shunday
// yasalgan edi va suratda ikki nuqta bir-birining ustida chiqdi (2026-08-13).
//
// SHUNING UCHUN oltitasi bir vaqtda yotqiziladi:
//   olti VATAR aylanani AYNAN yopadi (muntazam oltiburchak),
//   olti YOY esa yopmaydi -- 16 gradus qoladi, va bu ko'rinadi.
// Shu bilan `2π > 6` sababi ko'z bilan ko'riladi, va o'quvchi keyin o'zi
// yotqizadigan ish ham xuddi shu.
//
// Kadrlar: 0 -- bo'sh aylana, 1 -- poyga, 2 -- qoldiq va yorliqlar.
// ============================================================
export function ChordRace({ size = 268, step = 0, need = 6 }) {
  // Uzunlik birligi -- radius. Oxirida ikkalasi ham `need` ta radius uzunligi.
  const k = useTween(step >= 1 ? need : 0, 2400)
  const rad = (d) => (d * Math.PI) / 180
  const DEG = 180 / Math.PI

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.38 }]}
      draw={({ P, R }) => {
        const [ox, oy] = P(0, 0)
        const [ax, ay] = P(1, 0)
        const rDot = Math.max(3.4, R * 0.05)
        const fs = Math.max(11, Math.round(size * 0.05))

        // VATARLAR: uchlari 0, 60, 120 ... Har vatar uzunligi AYNAN 1.
        const full = Math.floor(k + 1e-6)
        const frac = k - full
        const vert = (i) => P(Math.cos(rad(i * 60)), Math.sin(rad(i * 60)))
        const chord = []
        for (let i = 0; i < Math.min(full, need); i += 1) chord.push([vert(i), vert(i + 1)])
        if (frac > 0.001 && full < need) {
          const [x1, y1] = vert(full)
          const [x2, y2] = vert(full + 1)
          chord.push([[x1, y1], [x1 + (x2 - x1) * frac, y1 + (y2 - y1) * frac]])
        }

        // YOYLAR: aylana bo'ylab, uzunligi k radian. Chegaralar har radianda.
        const marks = []
        for (let i = 1; i <= Math.min(full, need); i += 1) {
          const d = i * DEG
          const [mx1, my1] = P(Math.cos(rad(d)) * 0.94, Math.sin(rad(d)) * 0.94)
          const [mx2, my2] = P(Math.cos(rad(d)) * 1.06, Math.sin(rad(d)) * 1.06)
          marks.push(<line key={'m' + i} x1={mx1} y1={my1} x2={mx2} y2={my2} stroke={T.ink} strokeWidth="1.6" opacity=".75" />)
        }
        const arcEnd = P(Math.cos(Math.min(k, need)), Math.sin(Math.min(k, need)))
        const lab = (x, y, text, tone) => (
          <text
            x={x} y={y} textAnchor="middle"
            fontFamily={MATH_FONT} fontSize={fs} fontWeight="700"
            fill={tone} stroke={T.bg} strokeWidth={Math.max(3, size * 0.012)} paintOrder="stroke"
          >
            {text}
          </text>
        )
        return (
          <g>
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.4" />
            <circle cx={ax} cy={ay} r={rDot} fill={T.ink3} />

            {/* QOLDIQ: olti yoydan keyin yopilmagan bo'lak, 6 radiandan 2π gacha.
                Ayni shu bo'lak `2π > 6` ning ko'rinadigan isboti. */}
            {step >= 2 ? (
              <path
                d={wrapArc(P, need, 2 * Math.PI)}
                fill="none" stroke={T.tip} strokeWidth="7" strokeLinecap="round" opacity=".35"
              />
            ) : null}

            {/* Vatarlar zanjiri -- punktir: to'g'ri yo'l. */}
            {chord.map(([[x1, y1], [x2, y2]], i) => (
              <line key={'c' + i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.graph} strokeWidth="2.8" strokeDasharray="6 4" strokeLinecap="round" />
            ))}

            {/* Yoylar zanjiri -- aylana ustida. */}
            {k > 0.01 ? (
              <path d={wrapPath(P, 1, Math.min(k, need))} fill="none" stroke={T.accent} strokeWidth="4" strokeLinecap="round" />
            ) : null}
            {marks}
            {k > 0.01 ? <circle cx={arcEnd[0]} cy={arcEnd[1]} r={rDot * 1.3} fill={T.accent} /> : null}

            {step >= 2 ? (
              <g>
                {lab(P(0, 1.16)[0], P(0, 1.16)[1], '6 × 1', T.graph)}
                {lab(P(1.1, -0.42)[0], P(1.1, -0.42)[1], '≈ 16°', T.tip)}
              </g>
            ) : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================
// YOY O'ZI CHIZILADI. Bir figura -- uch joyda:
//   xukda      yoy uzunligi bir radius ekanini KO'RSATADI (chiziladi, turmaydi);
//   6-ekranda  nuqta 0 dan 180 gacha YURADI, yoy uning ortidan o'sadi;
//   qoidada    to'liq aylana chizilib, radian chegaralari birma-bir chiqadi.
//
// `to` -- gradus, `laid` -- radian chegaralarini ko'rsatish, `label` -- oxirdagi
// yozuv. Harakat kadr o'zgarganda boshlanadi: `step >= 1`.
// ============================================================
export function SweepArc({ size = 268, step = 1, to = 57.29578, laid = false, label = null, ms = 1400 }) {
  const grow = useTween(step >= 1 ? to : 0, ms)
  const DEG = 180 / Math.PI
  const rad = (d) => (d * Math.PI) / 180

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.4 }]}
      draw={({ P, R }) => {
        const [ox, oy] = P(0, 0)
        const [ax, ay] = P(1, 0)
        const rDot = Math.max(3.6, R * 0.055)
        const fs = Math.max(11, Math.round(size * 0.055))
        const end = P(Math.cos(rad(grow)), Math.sin(rad(grow)))
        const ticks = []
        if (laid) {
          for (let i = 1; i * DEG <= grow + 0.5; i += 1) {
            const d = i * DEG
            const [x1, y1] = P(Math.cos(rad(d)) * 0.93, Math.sin(rad(d)) * 0.93)
            const [x2, y2] = P(Math.cos(rad(d)) * 1.07, Math.sin(rad(d)) * 1.07)
            ticks.push(<line key={'t' + i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.ink} strokeWidth="1.7" opacity=".8" />)
          }
        }
        return (
          <g>
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.4" />
            <circle cx={ax} cy={ay} r={rDot * 0.8} fill={T.ink3} />
            {grow > 0.5 ? (
              <path d={wrapArc(P, 0, rad(grow))} fill="none" stroke={T.accent} strokeWidth="4.2" strokeLinecap="round" />
            ) : null}
            {ticks}
            {grow > 0.5 ? <circle cx={end[0]} cy={end[1]} r={rDot} fill={T.accent} /> : null}
            {label && grow > to - 1 ? (
              <text
                x={ox} y={oy - R * 0.16} textAnchor="middle"
                fontFamily={MATH_FONT} fontSize={fs} fontWeight="700"
                fill={T.accent} stroke={T.bg} strokeWidth={Math.max(3, size * 0.013)} paintOrder="stroke"
              >
                {label}
              </text>
            ) : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================
// KARUSEL AYLANADI -- 13-ekranning motivi.
//
// Ovoz: «karusel to'liq aylanani o'ttiz sekundda aylanadi». Demak ekranda ham
// AYNAN shu tezlikda aylanishi kerak: 360 / 30 = 12 daraja/sekund. Ilgari bu
// yerda qimirlamaydigan aylana turardi (etalon §5.1 buzilishi).
//
// Javob BERILMAYDI: besh sekundlik belgi qo'yilmaydi, aks holda o'quvchiga
// nuqtani qayerga qo'yishni aytib qo'ygan bo'lardik.
// ============================================================
export function Carousel({ size = 268, step = 1, secPerTurn = 30, seats = 6 }) {
  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.38 }]}
      spinAt={{ [step]: step >= 1 ? 360 / secPerTurn : 0 }}
      draw={({ P, R, spin }) => {
        const [ox, oy] = P(0, 0)
        const rad = (d) => (d * Math.PI) / 180
        const rSeat = Math.max(4, R * 0.09)
        const arms = Array.from({ length: seats }, (unused, i) => (i * 360) / seats + spin)
        return (
          <g>
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.4" />
            {arms.map((d, i) => {
              const [sx, sy] = P(Math.cos(rad(d)), Math.sin(rad(d)))
              return (
                <g key={i}>
                  <line x1={ox} y1={oy} x2={sx} y2={sy} stroke={T.ink3} strokeWidth="1.2" opacity=".6" />
                  {/* Bitta kabina AJRATILGAN: ko'z uni kuzatadi va aylanish
                      ko'rinadi. Hammasi bir xil bo'lsa, aylanish sezilmaydi. */}
                  <circle cx={sx} cy={sy} r={i === 0 ? rSeat : rSeat * 0.72} fill={i === 0 ? T.accent : T.graph} opacity={i === 0 ? 1 : 0.55} />
                </g>
              )
            })}
            <circle cx={ox} cy={oy} r={Math.max(3, R * 0.05)} fill={T.ink3} />
          </g>
        )
      }}
    />
  )
}
