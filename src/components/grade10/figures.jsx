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
import React, { useEffect, useState } from 'react'
import { MATH_FONT, T, useSpin, useT, useTween } from './core.jsx'

// NOL KADRDA ham harakat bo'lsin.
//
// `useTween` boshlang'ich qiymat sifatida NISHONNI oladi -- ya'ni komponent
// paydo bo'lganda hech narsa qimirlamaydi, va birinchi replika QOTIB turgan
// rasm ustida aytiladi. Kadrlar oralig'ida harakat bor, kirishda esa yo'q.
//
// Bu ilgak birinchi kadrda nishonni bir marta o'zgartiradi: mount dan keyingi
// kadrda `true` bo'ladi, va shu bilan tween ishga tushadi. `prefers-reduced-
// motion` ni hurmat qilish `useTween` ning ichida qolaveradi.
export function useMounted() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return on
}

const rad = (d) => (d * Math.PI) / 180
// Ikki chiziqli yorliq: chizmadagi har yozuv fonda «halqa» bilan turadi, aks
// holda u chiziq ustiga tushib o'qilmay qoladi.
const halo = (size) => ({
  stroke: T.bg,
  strokeWidth: Math.max(3, size * 0.013),
  paintOrder: 'stroke',
})

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

// ============================================================
// MAXRAJ YO'QOLADI -- 2-darsning BIRINCHI guvohi.
//
// 8-sinf ta'rifi: `sin α = a / c`. Bu ta'rif YO'QOLMAYDI, u shu yerda birlik
// aylana ta'rifiga AYLANADI: gipotenuza birga qadar SIQILADI va maxraj o'zi
// yo'qoladi -- `a / 1`, keyin `a`. Ya'ni sinus nuqtaning BALANDLIGI.
//
// Nega siqilish kerak. Ikki alohida rasm («mana uchburchak, mana aylana»)
// o'quvchi uchun IKKI BOSHQA ta'rif bo'lib qoladi, va u ikkisini yodlashga
// urinadi. Siqilish esa bittasi ikkinchisiga aylanganini KO'RSATADI.
//
// Kadrlar: 0 -- gipotenuzasi `c` uchburchak; 1 -- `c` birga siqiladi, aylana
// chiziladi; 2 -- balandlik o'qqa ko'chiriladi: `a` bu ordinata.
//
// Kamera QO'ZG'ALMAYDI: aks holda gipotenuza siqilganda kamera yaqinlashib,
// uchburchak EKRANDA o'sha bo'yida qolardi -- ya'ni siqilish ko'rinmasdi.
// ============================================================
// `focus` -- 2-ekran (tayanch) uchun. Chizma savolga JAVOB berib boradi: har
// javobdan keyin ayni o'sha narsa yonadi. Nima uchun: tayanch ekranida uch
// savol uchburchak HAQIDA, uchburchak esa qimirlamay turardi -- o'quvchi
// savolni o'qiydi, chizma esa unda ishtirok etmaydi.
//   1 -- sinus nisbati: `a` va `c` yonadi, `b` so'nadi
//   2 -- birlik aylana chiziladi, va uchburchak undan CHIQIB turadi
//        (3-ekranning kelishuvi shu yerdan boshlanadi: sig'ishi uchun siqilish kerak)
//   3 -- o'qlar va gorizontal o'qqa proyeksiya: birinchi koordinata
export function HypShrink({ size = 268, step = 0, deg = 30, focus = 0, tight = false }) {
  const h = useTween(step >= 1 ? 1 : 1.62, 1250)
  const circ = useTween(step >= 1 || focus >= 2 ? 1 : 0, 700)
  const axes = useTween(step >= 1 || focus >= 3 ? 1 : 0, 620)
  const ratio = useTween(focus >= 1 && step === 0 ? 1 : 0, 560)
  const proj = useTween(focus >= 3 && step === 0 ? 1 : 0, 620)
  const cast = useTween(step >= 2 ? 1 : 0, 620)
  // KAMERA aylana bilan birga ortga chekinadi.
  //
  // 2-ekranda (tayanch) hali aylana yo'q, faqat uchburchak bor -- va standart
  // kamerada u kvadratning oltidan biriga sig'ib, chetda yotgan eskiz bo'lib
  // ko'rinardi (surat, 2026-08-13). Aylana YOKI o'qlar chiqqanda esa kamera
  // keng bo'lishi shart, aks holda ular kadrdan chiqadi.
  //
  // `Film` ga beriladigan indeks -- KAMERANING indeksi, figuraning kadri emas:
  // figura o'z kadrini `step` va `focus` proplaridan oladi. Shu bilan bitta
  // figura ikki xil ekranda ikki xil masshtabda ishlaydi va o'tish YUMSHOQ
  // bo'ladi: aylana paydo bo'lishi bilan kamera ortga chekinadi.
  //
  // `tight` SHART, va u faqat 2-ekranda beriladi. 3-ekranda kamera QOTIB
  // turishi kerak: u yerda gipotenuzaning O'ZI siqiladi, va ayni paytda kamera
  // ham qo'zg'alsa, o'quvchi nima kichrayganini ayirib bo'lmaydi -- uchburchakmi
  // yoki kadrmi. Guvoh ikkiga bo'linsa, guvoh bo'lmay qoladi.
  const view = tight && step === 0 && focus < 2 ? 0 : 1

  return (
    <Film
      size={size}
      step={view}
      cam={[{ x: 0.34, y: 0.66, r: 0.38 }, { x: 0.4, y: 0.6, r: 0.28 }]}
      draw={({ P, R }) => {
        const [ox, oy] = P(0, 0)
        const hx = h * Math.cos(rad(deg))
        const hy = h * Math.sin(rad(deg))
        const [px, py] = P(hx, hy)
        const [fx, fy] = P(hx, 0)
        const rDot = Math.max(4, R * 0.07)
        const fs = Math.max(11, Math.round(size * 0.052))
        const sq = Math.max(6, R * 0.09)
        const arcR = R * 0.3
        return (
          <g>
            {/* O'qlar va aylana AYRIM boshqariladi: 3-ekranda ikkisi ham
                gipotenuza birga tushganda keladi, 2-ekranda esa aylana ikkinchi
                savoldan keyin, o'qlar uchinchisidan keyin chiqadi. */}
            {circ > 0.01 ? (
              <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" opacity={circ} />
            ) : null}
            {axes > 0.01 ? (
              <g opacity={axes}>
                <line x1={ox - R * 1.2} y1={oy} x2={ox + R * 1.2} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
                <line x1={ox} y1={oy - R * 1.2} x2={ox} y2={oy + R * 1.2} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
              </g>
            ) : null}

            {/* Uchburchak: asos, balandlik, gipotenuza. Uchtasi ham HAR kadrda
                joyida -- faqat uzunligi o'zgaradi.
                `ratio` -- 2-ekranning birinchi javobi: sinus `a` ni `c` ga
                bo'ladi, demak asos ORQAGA chekinadi. */}
            <line x1={ox} y1={oy} x2={fx} y2={fy} stroke={T.ink3} strokeWidth="2.4" opacity={1 - ratio * 0.72} />
            <line x1={fx} y1={fy} x2={px} y2={py} stroke={T.graph} strokeWidth={2.8 + ratio * 1.4} />
            <line x1={ox} y1={oy} x2={px} y2={py} stroke={T.accent} strokeWidth={2.8 + ratio * 1.4} />

            {/* Uchinchi javob: birinchi koordinata bu ASOSning o'qdagi izi. */}
            {proj > 0.01 ? (
              <g opacity={proj}>
                <line x1={ox} y1={oy} x2={fx} y2={fy} stroke={T.accent} strokeWidth="3.6" />
                <line x1={fx} y1={fy - sq * 0.55} x2={fx} y2={fy + sq * 0.55} stroke={T.accent} strokeWidth="2.4" />
              </g>
            ) : null}
            <rect x={fx - sq} y={fy - sq} width={sq} height={sq} fill="none" stroke={T.ink3} strokeWidth="1" />
            <path
              d={'M ' + (ox + arcR) + ' ' + oy + ' A ' + arcR + ' ' + arcR + ' 0 0 0 '
                + (ox + arcR * Math.cos(rad(deg))) + ' ' + (oy - arcR * Math.sin(rad(deg)))}
              fill="none" stroke={T.ink2} strokeWidth="1.2"
            />
            <circle cx={ox} cy={oy} r={rDot * 0.5} fill={T.ink3} />
            <circle cx={px} cy={py} r={rDot} fill={T.accent} />

            {/* Balandlik O'QQA ko'chiriladi: shu qadamda `a` ordinata bo'lib
                qoladi, ya'ni ikkinchi koordinata. */}
            {cast > 0.01 ? (
              <g opacity={cast}>
                <line x1={px} y1={py} x2={ox} y2={py} stroke={T.graph} strokeWidth="1.3" strokeDasharray="4 4" />
                <line x1={ox - sq * 0.5} y1={py} x2={ox + sq * 0.5} y2={py} stroke={T.graph} strokeWidth="2.4" />
              </g>
            ) : null}

            <g fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" {...halo(size)}>
              {/* `c` yorlig'i `1` ga AYLANADI: shu bitta almashish butun
                  ekranning mazmuni, shuning uchun u `g10-valpop` bilan chiqadi. */}
              <text
                key={step >= 1 ? 'c1' : 'c0'} className={step >= 1 ? 'g10-valpop' : undefined}
                x={(ox + px) / 2 - fs * 0.7} y={(oy + py) / 2 - fs * 0.2}
                fill={T.accent} textAnchor="end"
              >
                {step >= 1 ? '1' : 'c'}
              </text>
              <text x={fx + fs * 0.4} y={(fy + py) / 2 + fs * 0.34} fill={T.graph} textAnchor="start">a</text>
              <text x={(ox + fx) / 2} y={fy + fs} fill={T.ink3} textAnchor="middle">b</text>
              {/* MAYDA yorliqning ham o'z POLI bor. `fs * 0.82` yozilganda
                  `fs` ning o'zi 11 px ga tushgan joyda 9 px chiqardi -- ya'ni
                  10,5 px polidan past, va tekshiruv buni 393 va 390 px da
                  ushladi (2026-08-13). Ko'paytiruvchi polni bosmaydi. */}
              <text x={ox + arcR * 0.82} y={oy - arcR * 0.3} fontSize={Math.max(11, fs * 0.82)} fill={T.ink2} textAnchor="start">α</text>
            </g>
          </g>
        )
      }}
    />
  )
}

// ============================================================
// UCHBURCHAK YO'QOLADI, NUQTA QOLADI -- 2-darsning IKKINCHI guvohi.
//
// Nuqta 60 dan 120 gradusga BORADI. To'qson gradusdan o'tganda uchburchak
// yo'qolishga MAJBUR: o'tkir burchak endi yo'q. Balandlik esa joyida qoladi va
// O'SHA -- ikki nuqtaning ordinatasi teng. Siljish esa belgisini almashtiradi.
//
// Shu bilan bir vaqtda ikki xato yopiladi:
//   `oba-rastut` -- burchak o'sdi, sinus O'SMADI, kosinus esa manfiy bo'ldi;
//   «120 gradusning kosinusi yo'q» -- uchburchak yo'q, koordinata bor.
//
// Etalon §2 dagi priyom: IKKI nuqta bir vaqtda ko'rinadi va proyeksiyalari
// solishtiriladi. Shuning uchun 60 gradusdagi nuqta yo'qolmaydi -- bo'sh
// halqa bo'lib qoladi.
//
// Uchburchakning so'nishi KADRGA emas, BURCHAKKA bog'langan: u aynan 90
// gradusdan o'tayotganda so'nadi. Kadrga bog'lansa, «o'tkir burchak
// qolmadi» degan gap tasodifiy paytda aytilardi.
// ============================================================
export function TriangleVanish({ size = 268, step = 0, from = 60, to = 120 }) {
  // Nuqta noldan KELADI. Bu bezak emas: burchak musbat yo'nalishda, o'ngdagi
  // o'qdan sanalishini aynan shu ko'rsatadi -- ya'ni bugungi kelishuvni.
  const live = useMounted()
  const at = useTween(step >= 1 ? to : (live ? from : 0), step >= 1 ? 1600 : 900)
  const cmp = useTween(step >= 2 ? 1 : 0, 640)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.52, r: 0.34 }]}
      draw={({ P, R }) => {
        const [ox, oy] = P(0, 0)
        const c = Math.cos(rad(at))
        const s = Math.sin(rad(at))
        const [px, py] = P(c, s)
        const [fx, fy] = P(c, 0)
        const [wx, wy] = P(Math.cos(rad(from)), Math.sin(rad(from)))
        const rDot = Math.max(4, R * 0.062)
        const fs = Math.max(11, Math.round(size * 0.05))
        const sq = Math.max(6, R * 0.085)
        // O'tkir burchak 88 gradusga qadar bor, 96 dan keyin yo'q. Oradagi
        // sakkiz gradus -- so'nish yo'li: sakrash bo'lmasin.
        const tri = at <= 88 ? 1 : at >= 96 ? 0 : (96 - at) / 8
        return (
          <g>
            <line x1={ox - R * 1.18} y1={oy} x2={ox + R * 1.18} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.18} x2={ox} y2={oy + R * 1.18} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />

            {/* Boshlang'ich nuqta QOLADI: ikkisi solishtiriladi. */}
            {step >= 1 ? (
              <g opacity=".75">
                <line x1={ox} y1={oy} x2={wx} y2={wy} stroke={T.ink3} strokeWidth="1.4" strokeDasharray="4 3" />
                <circle cx={wx} cy={wy} r={rDot * 0.92} fill="none" stroke={T.ink2} strokeWidth="2" />
              </g>
            ) : null}

            {/* Ikki balandlik BIR sathda: gorizontal punktir ularni tutashtiradi
                va tenglik ko'z bilan ko'rinadi. */}
            {cmp > 0.01 ? (
              <g opacity={cmp}>
                <line x1={wx} y1={wy} x2={px} y2={py} stroke={T.graph} strokeWidth="1.4" strokeDasharray="5 4" />
                <line x1={ox - sq * 0.55} y1={py} x2={ox + sq * 0.55} y2={py} stroke={T.graph} strokeWidth="2.4" />
              </g>
            ) : null}

            {/* Uchburchak: asos va to'g'ri burchak. So'nadi, balandlik qoladi. */}
            {tri > 0.01 ? (
              <g opacity={tri}>
                <line x1={ox} y1={oy} x2={fx} y2={fy} stroke={T.ink3} strokeWidth="2.2" />
                <rect x={fx - (c >= 0 ? sq : 0)} y={fy - sq} width={sq} height={sq} fill="none" stroke={T.ink3} strokeWidth="1" />
              </g>
            ) : null}

            {/* SILJISH: uchburchak yo'qolgach ham qoladi va manfiy bo'lganda
                issiq rangga o'tadi -- «chapga» degani shu. */}
            <line
              x1={ox} y1={oy} x2={fx} y2={fy}
              stroke={c < -0.02 ? T.tip : T.accent} strokeWidth="2.6" opacity={c < -0.02 ? 1 : 1 - tri * 0.55}
            />
            <line x1={ox} y1={oy} x2={px} y2={py} stroke={T.accent} strokeWidth="2.4" />
            <line x1={fx} y1={fy} x2={px} y2={py} stroke={T.graph} strokeWidth="2.8" />
            <circle cx={ox} cy={oy} r={rDot * 0.5} fill={T.ink3} />
            <circle cx={px} cy={py} r={rDot} fill={T.accent} />

            <g fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" {...halo(size)}>
              <text
                x={px + (c >= 0 ? fs * 0.42 : -fs * 0.42)} y={(fy + py) / 2 + fs * 0.34}
                fill={T.graph} textAnchor={c >= 0 ? 'start' : 'end'}
              >
                {cmp > 0.5 ? '√3/2' : 'a'}
              </text>
              {cmp > 0.5 ? (
                <g className="g10-valpop">
                  <text x={fx} y={oy + fs * 1.15} fill={T.tip} textAnchor="middle">−1/2</text>
                  <text x={(ox + wx) / 2} y={oy + fs * 1.15} fill={T.accent} textAnchor="middle">1/2</text>
                </g>
              ) : null}
              {tri > 0.5 ? (
                /* Ko'paytiruvchi 10,5 px polini bosmaydi -- `HypShrink` dagi
                   bilan bir xil sabab. */
                <text x={ox + R * 0.3} y={oy - R * 0.09} fontSize={Math.max(11, fs * 0.82)} fill={T.ink2} textAnchor="start" opacity={tri}>α</text>
              ) : null}
            </g>
          </g>
        )
      }}
    />
  )
}

// ============================================================
// NISBAT O'SADI VA UZILADI -- 2-darsning UCHINCHI guvohi (tangens).
//
// Tangens bu `y / x`, ya'ni ALLAQACHON o'qilgan ikki sonning nisbati: yangi
// kattalik yo'q. Nuqta yuqoriga borganda `y` deyarli o'zgarmaydi, `x` esa
// nolga intiladi -- va nisbat KO'Z OLDIDA o'sadi. Eng yuqorida bo'lish yo'q:
// ko'rsatkich chiziqchaga aylanadi.
//
// Nega «cheksizlik» yozilmaydi. Cheksizlikni SON qilib ko'rsatgan ekran
// o'quvchini keyin uni hisobga qo'yishga o'rgatadi. Shuning uchun ekranda
// aynan UZILISH turadi: qiymat yo'q.
//
// Kadrlar: 0 -- nuqta 45 gradusda, ikki son teng, nisbat bir; 1 -- nuqta
// yuqoriga BORADI, `x` qisqaradi, nisbat o'sadi; 2 -- nuqta tepada, `x` nol,
// ko'rsatkich uziladi.
// ============================================================
export function RatioRise({ size = 268, step = 0 }) {
  // Kirishda ham harakat: nuqta noldan qirq besh gradusga chiqadi va nisbat
  // nolda emas, BIRDA to'xtaydi -- ikki son teng bo'lgan joy shu.
  const live = useMounted()
  const at = useTween(step >= 2 ? 90 : step >= 1 ? 76 : (live ? 45 : 0), step >= 1 ? 1700 : 1000)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.56, r: 0.34 }]}
      draw={({ P, R }) => {
        const [ox, oy] = P(0, 0)
        const c = Math.cos(rad(at))
        const s = Math.sin(rad(at))
        const [px, py] = P(c, s)
        const [fx, fy] = P(c, 0)
        const rDot = Math.max(4, R * 0.062)
        const fs = Math.max(11, Math.round(size * 0.05))
        const broke = Math.abs(c) < 0.005
        const ratio = broke ? null : s / c
        // Katta son butun ko'rsatiladi: «5729,58» yorlig'i chizmadan chiqib
        // ketardi, va bu yerda muhimi ANIQLIK emas, O'SISH.
        const show = ratio === null ? '—'
          : Math.abs(ratio) >= 100 ? String(Math.round(ratio))
            : String(Math.round(ratio * 100) / 100).replace('.', ',')
        return (
          <g>
            <line x1={ox - R * 1.18} y1={oy} x2={ox + R * 1.18} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.18} x2={ox} y2={oy + R * 1.18} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />

            {/* Ikki proyeksiya: gorizontal `x`, tik `y`. Nuqta ko'tarilganda
                birinchisi ko'z oldida qisqaradi. */}
            <line x1={ox} y1={oy} x2={fx} y2={fy} stroke={T.accent} strokeWidth="3.4" />
            <line x1={fx} y1={fy} x2={px} y2={py} stroke={T.graph} strokeWidth="2.8" strokeDasharray="4 3" />
            <line x1={ox} y1={oy} x2={px} y2={py} stroke={T.ink3} strokeWidth="1.6" />
            <circle cx={ox} cy={oy} r={rDot * 0.5} fill={T.ink3} />
            <circle cx={px} cy={py} r={rDot} fill={T.accent} />

            <g fontFamily={MATH_FONT} fontWeight="700" {...halo(size)}>
              {/* Nisbat CHIZMADA turadi: o'sish shu yerda ko'rinadi. */}
              <text
                x={ox - R * 0.5} y={oy - R * 0.78} fontSize={fs * 1.12}
                fill={broke ? T.tip : T.accent} textAnchor="middle"
              >
                {'y/x = ' + show}
              </text>
              <text x={(ox + fx) / 2} y={oy + fs * 1.2} fontSize={fs} fill={T.accent} textAnchor="middle">
                {broke ? '0' : 'x'}
              </text>
              <text
                x={px + (c >= -0.02 ? fs * 0.4 : -fs * 0.4)} y={(fy + py) / 2 + fs * 0.34}
                fontSize={fs} fill={T.graph} textAnchor={c >= -0.02 ? 'start' : 'end'}
              >
                y
              </text>
            </g>
          </g>
        )
      }}
    />
  )
}

// ============================================================
// JUFTLIK IKKI TOMONGA O'QILADI -- 2-darsning 5-ekrani.
//
// NEGA BU FIGURA BOR. 5-ekranda ko'rsatish UMUMAN yo'q edi: sarlavha «juftlik
// ikki tomonga ham o'qiladi» deb turardi, ekranda esa ikkita asbob ketma-ket
// chiqardi va o'quvchi ikki marta nuqta qo'yardi. Ya'ni ekran O'ZI aytgan
// narsani ko'rsatmasdi. Tekshiruv buni tuta olmasdi ham: u «aytildi, lekin
// ko'rsatilmadi» ni ushlaydi, hech narsa va'da qilmagan ekran esa u uchun toza.
//
// Kadrlar:
//   0  nuqta noldan KELADI va burchakka turadi; proyeksiyalar tushadi, ikki
//      son o'z o'qlarida turadi;
//   1  TO'G'RI o'qish: sonlar o'qlardan uchib, pastdagi juftlik yozuviga
//      yig'iladi;
//   2  TESKARI o'qish: o'sha sonlar yozuvdan qaytib o'qlarga tushadi, ulardan
//      yo'l-yo'riq chiziqlari o'sadi va kesishgan joyda nuqta yonadi.
//
// Ya'ni bitta harakat ikki tomonga qaytariladi. Almashish yo'q: aylana, o'qlar
// va nuqta hamma kadrda o'sha joyda -- ko'chadigan narsa faqat IKKI SON.
// ============================================================
export function PairBothWays({ size = 268, step = 0, deg = 135, labels = ['−√2/2', '√2/2'] }) {
  const live = useMounted()
  const at = useTween(live ? deg : 0, 1000)
  // 0 -- sonlar o'qlarda, 1 -- sonlar yozuvda. 2-kadrda yana nolga qaytadi,
  // va aynan shu qaytish TESKARI o'qish bo'ladi.
  const u = useTween(step === 1 ? 1 : 0, 1250)
  const guide = useTween(step >= 2 ? 1 : 0, 1250)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.42, r: 0.3 }]}
      draw={({ P, R }) => {
        const [ox, oy] = P(0, 0)
        const c = Math.cos(rad(at))
        const s = Math.sin(rad(at))
        const [px, py] = P(c, s)
        const rDot = Math.max(4, R * 0.062)
        const fs = Math.max(11, Math.round(size * 0.05))
        // Sonning ikki uyi: o'qdagi joyi va yozuvdagi joyi. Oradagi yo'l `u`.
        const home = [P(c, -0.17), P(-0.24, s)]
        const slot = [P(-0.32, -1.3), P(0.34, -1.3)]
        const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]
        const [cx1, cy1] = mix(home[0], slot[0], u)
        const [sx1, sy1] = mix(home[1], slot[1], u)
        // Teskari o'qishda yo'l-yo'riq chiziqlari o'qdan NUQTAGA qarab o'sadi.
        const gx = P(c, 0)
        const gy = P(0, s)
        return (
          <g>
            <line x1={ox - R * 1.2} y1={oy} x2={ox + R * 1.2} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.2} x2={ox} y2={oy + R * 1.2} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />

            {/* Juftlik yozuvi: bo'sh QUTI qavslar bilan HAR kadrda turadi,
                sonlar esa kelib-ketadi. Bo'sh quti «ko'chish shu yerga boradi»
                deb turadi, ya'ni yo'nalish oldindan ko'rinadi. Ortidagi yengil
                to'rtburchak usiz qavslar chizmadan ajralib, tarqoq belgi bo'lib
                ko'rinardi (surat, 2026-08-13). */}
            <rect
              x={P(-0.86, -1.3)[0]} y={P(0, -1.3)[1] - fs * 1.05}
              width={P(0.86, 0)[0] - P(-0.86, 0)[0]} height={fs * 1.55}
              rx={fs * 0.42} fill="rgba(23,26,29,.035)" stroke={T.line || 'rgba(23,26,29,.10)'} strokeWidth="1"
            />
            <g fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.ink3} {...halo(size)}>
              <text x={P(-0.72, -1.3)[0]} y={P(-0.72, -1.3)[1]} textAnchor="middle">(</text>
              <text x={P(0, -1.3)[0]} y={P(0, -1.3)[1]} textAnchor="middle">;</text>
              <text x={P(0.74, -1.3)[0]} y={P(0.74, -1.3)[1]} textAnchor="middle">)</text>
            </g>

            {/* Proyeksiyalar: nuqtadan ikkala o'qqa. Teskari yo'l boshlanganda
                ular SO'NADI: aks holda o'sib boradigan yo'l-yo'riq chizig'i
                aynan o'sha joyda yotadi va harakat KO'RINMAYDI -- ikki chiziq
                bir-birining ustida (surat, 2026-08-13). */}
            <g opacity={1 - guide * 0.85}>
              <line x1={px} y1={py} x2={gx[0]} y2={gx[1]} stroke={T.accent} strokeWidth="1.4" strokeDasharray="4 3" />
              <line x1={px} y1={py} x2={gy[0]} y2={gy[1]} stroke={T.graph} strokeWidth="1.4" strokeDasharray="4 3" />
            </g>
            <line x1={gx[0] - 1} y1={oy - R * 0.05} x2={gx[0] - 1} y2={oy + R * 0.05} stroke={T.accent} strokeWidth="2.6" />
            <line x1={ox - R * 0.05} y1={gy[1]} x2={ox + R * 0.05} y2={gy[1]} stroke={T.graph} strokeWidth="2.6" />

            {/* TESKARI yo'l: o'qdagi izlardan nuqtaga qarab chiziq o'sadi. */}
            {guide > 0.01 ? (
              <g opacity={guide}>
                <line x1={gx[0]} y1={gx[1]} x2={gx[0] + (px - gx[0]) * guide} y2={gx[1] + (py - gx[1]) * guide} stroke={T.accent} strokeWidth="2.2" />
                <line x1={gy[0]} y1={gy[1]} x2={gy[0] + (px - gy[0]) * guide} y2={gy[1] + (py - gy[1]) * guide} stroke={T.graph} strokeWidth="2.2" />
              </g>
            ) : null}

            <line x1={ox} y1={oy} x2={px} y2={py} stroke={T.ink3} strokeWidth="1.6" />
            <circle cx={ox} cy={oy} r={rDot * 0.5} fill={T.ink3} />
            {/* Nuqta teskari o'qish oxirida YONADI: yo'l-yo'riq chiziqlari
                kesishgan joy aynan u ekani ko'rinadi. */}
            {guide > 0.9 ? (
              <circle cx={px} cy={py} r={rDot * 1.7} fill="none" stroke={T.accent} strokeWidth="2" opacity={(guide - 0.9) * 6} />
            ) : null}
            <circle cx={px} cy={py} r={rDot} fill={T.accent} />

            <g fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" {...halo(size)}>
              <text x={cx1} y={cy1} fill={T.accent} textAnchor="middle">{labels[0]}</text>
              <text x={sx1} y={sy1} fill={T.graph} textAnchor="middle">{labels[1]}</text>
            </g>
          </g>
        )
      }}
    />
  )
}

// ============================================================
// CHEGARA O'LCHANADI -- 2-darsning 7-ekrani.
//
// NEGA BU FIGURA BOR. Ekran «koordinata birdan katta bo'la olmaydi, nisbat esa
// bo'la oladi» deydi. Ilgari bu shunchaki AYTILARDI, chizmada esa oltmish
// gradusdagi qimirlamaydigan nuqta turardi. Endi chegara o'lchanadi: aylana
// yonida bitta shkalada uchta ustun turadi va shkalada BIR belgisi bor.
//
// Kadrlar:
//   0  nuqta oltmish gradusda, ikki ustun -- kosinus va sinus, ikkisi ham
//      belgidan past;
//   1  nuqta aylanani AYLANIB chiqadi, ustunlar u bilan nafas oladi va
//      belgidan BIRON MARTA ham o'tmaydi -- chegara da'vo emas, kuzatuv;
//   2  tangens ustuni yonadi va belgidan o'tib ketadi.
//
// Nima uchun aylanib chiqish, bitta burchak emas: bitta burchakda «shunchaki
// shu yerda kichik» deb o'ylash mumkin. Butun aylanada esa istisno yo'qligi
// ko'rinadi.
// ============================================================
export function BoundBars({ size = 268, step = 0, deg = 60 }) {
  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.28, y: 0.5, r: 0.22 }]}
      spinAt={{ 1: 54 }}
      draw={({ P, R, spin }) => {
        const [ox, oy] = P(0, 0)
        const at = step === 1 ? deg + spin : deg
        const c = Math.cos(rad(at))
        const s = Math.sin(rad(at))
        const [px, py] = P(c, s)
        const rDot = Math.max(4, R * 0.07)
        const fs = Math.max(11, Math.round(size * 0.046))
        // Shkala: tag chizig'i va bir birlikning balandligi.
        const yB = size * 0.84
        const unit = size * 0.4
        const bw = size * 0.075
        const bx = [size * 0.6, size * 0.72, size * 0.84]
        const one = yB - unit
        // Tangens uziladigan joyda ustun ham chizilmaydi.
        const tv = Math.abs(c) < 0.02 ? null : Math.abs(s / c)
        const bars = [
          { v: Math.abs(c), tone: T.accent, name: 'cos', on: true },
          { v: Math.abs(s), tone: T.graph, name: 'sin', on: true },
          { v: tv, tone: T.tip, name: 'tg', on: step >= 2 },
        ]
        const dec = (v) => v.toFixed(2).replace('.', ',')
        return (
          <g>
            <line x1={ox - R * 1.2} y1={oy} x2={ox + R * 1.2} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.2} x2={ox} y2={oy + R * 1.2} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />
            <line x1={ox} y1={oy} x2={px} y2={oy} stroke={T.accent} strokeWidth="3" />
            <line x1={px} y1={oy} x2={px} y2={py} stroke={T.graph} strokeWidth="2.6" />
            <line x1={ox} y1={oy} x2={px} y2={py} stroke={T.ink3} strokeWidth="1.5" />
            <circle cx={px} cy={py} r={rDot} fill={T.accent} />

            {/* BIR belgisi: uchala ustun uchun bitta chiziq. */}
            <line x1={size * 0.55} y1={one} x2={size * 0.93} y2={one} stroke={T.ink2} strokeWidth="1.4" strokeDasharray="5 4" />
            <line x1={size * 0.55} y1={yB} x2={size * 0.93} y2={yB} stroke={T.ink3} strokeWidth="1.4" />

            {bars.map((b, i) => {
              if (!b.on) return null
              const v = b.v === null ? null : b.v
              const hgt = v === null ? 0 : Math.min(v, 1.9) * unit
              return (
                <g key={b.name}>
                  {v !== null ? (
                    <rect
                      x={bx[i] - bw / 2} y={yB - hgt} width={bw} height={hgt}
                      fill={b.tone} opacity={b.name === 'tg' ? 0.9 : 0.72} rx={2}
                    />
                  ) : null}
                  <text
                    x={bx[i]} y={yB + fs * 1.15} textAnchor="middle"
                    fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={b.tone} {...halo(size)}
                  >
                    {b.name}
                  </text>
                  {/* TANGENS ustunining SONI yozilmaydi -- hech qachon.
                      Ekranning topshirig'i aynan shu sonni hisoblash, va uni
                      chizmada yozib qo'yish javobni harakatdan OLDIN berish
                      bo'lardi. Ustunning belgidan o'tgani ko'rinadi, qancha
                      o'tgani esa o'quvchining ishi. Kosinus va sinus sonlari
                      qoladi: ular berilgan ma'lumot, javob emas. */}
                  {step !== 1 && b.name !== 'tg' ? (
                    <text
                      x={bx[i]} y={yB - hgt - fs * 0.4} textAnchor="middle"
                      fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={b.tone} {...halo(size)}
                    >
                      {v === null ? '—' : dec(v)}
                    </text>
                  ) : null}
                </g>
              )
            })}
            <text
              x={size * 0.53} y={one + fs * 0.36} textAnchor="end"
              fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.ink2} {...halo(size)}
            >
              1
            </text>
          </g>
        )
      }}
    />
  )
}

// ============================================================
// AYLANA GRAFIKKA YOZILADI -- 6-darsning ASOSIY guvohi.
//
// Etalon §2 dagi priyom: «yoyilma: nuqtaning ordinatasi sinusoidani chizadi».
// Ya'ni grafik alohida tema emas: bu O'SHA nuqta, faqat balandligi VAQT bo'ylab
// yozilgan. Shuning uchun chapda aylana, o'ngda vaqt o'qi, va ular orasida
// ko'chiruvchi chiziq -- balandlik aynan shu chiziq bilan o'ngga ko'chadi.
//
// NEGA AMPLITUDA RADIUSGA TENG QILINGAN. Grafikning balandligi va aylananing
// radiusi ekranda BIR XIL uzunlik. Aks holda «qiymat birdan katta bo'lmaydi»
// degan gap grafikda tekshirilmaydi: to'lqin qanchalik baland ekani masshtabga
// bog'liq bo'lib qoladi. Bir xil uzunlikda esa polosa ko'z bilan o'lchanadi.
//
// Kadrlar:
//   0  aylana va bo'sh vaqt o'qi, nuqta nolda
//   1  nuqta aylanani AYLANIB chiqadi, egri chiziq o'zi chiziladi
//   2  bitta to'lqin tugadi, davr belgilanadi: to'lqin uzunligi = to'liq aylana
//   3  polosa: to'lqin minus birdan bir orasidan chiqmaydi
//
// `pick` -- nima ko'chiriladi: `sin` (balandlik, gorizontal ko'chiruvchi) yoki
// `cos` (siljish). Siljish gorizontal uzunlik, shuning uchun u vaqt o'qida TIK
// kesma bo'lib qo'yiladi va ikkisi bir xil rangda, bir xil uzunlikda turadi --
// «burdik» degani shu.
// ============================================================
export function Unroll({ size = 268, step = 0, from = 0, label = 'y = sin α', turns = 1 }) {
  const live = useMounted()
  // Nuqta va egri chiziq BIR vaqtda o'sadi: bittasi ikkinchisini chizadi.
  const at = useTween(step >= 1 ? 360 * turns : (live ? 0 : 0), 4200)
  const band = useTween(step >= 3 ? 1 : 0, 700)
  const mark = useTween(step >= 2 ? 1 : 0, 700)

  // Grafik chizmaning O'NG yarmida, aylana chapda. Ikkisi bitta kvadratda
  // turadi, shuning uchun o'lchamlar ulushda.
  const cxC = 0.21
  const R = 0.17
  const gx0 = 0.42
  const gx1 = 0.965
  const yMid = 0.5

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: cxC, y: yMid, r: R }]}
      draw={({ P, size: S }) => {
        const [ox, oy] = P(0, 0)
        const amp = R * S
        const px = (u) => gx0 * S + (gx1 - gx0) * S * u
        // Chizilayotgan qiymat -- HAR DOIM balandlik, faqat sanoq `from` dan
        // boshlanadi. Kosinus uchun `from = 90`: nuqta tepadan yo'lga chiqadi va
        // uning balandligi kosinus to'lqinini chizadi, chunki `sin(90 + t)` bu
        // `cos t`. Ya'ni yangi qurilma ham, burilgan chizma ham kerak emas:
        // qurilma AYNI O'SHA, boshlanish nuqtasi boshqa. Va bu darsning mazmuni
        // ham shu -- kosinus o'sha to'lqin, sanoq chorak aylana oldin boshlangan.
        //
        // Birinchi variant chizmani BURIB, siljishni tikka qo'ymoqchi edi.
        // Ko'chiruvchi diagonal bo'lib chiqdi, keyin esa nuqta burilgan, o'q
        // yorliqlari esa burilmagan holat paydo bo'ldi -- chizma o'ziga qarshi
        // gapirardi (surat, 2026-08-13). Rad etildi.
        const val = (d) => Math.sin(rad(from + d))
        const c = Math.cos(rad(from + at))
        const s = Math.sin(rad(from + at))
        const [ptx, pty] = P(c, s)
        const v = val(at)
        const u = Math.min(1, at / (360 * turns))
        const nowX = px(u)
        const nowY = yMid * S - amp * v
        const fs = Math.max(11, Math.round(S * 0.045))
        const rDot = Math.max(3.6, amp * 0.09)

        // Egri chiziq: nuqta bosib o'tgan yo'l. Nuqta qancha yursa, chiziq
        // shuncha uzun -- ya'ni chiziqni nuqta CHIZADI, tayyor turmaydi.
        const N = 96
        const pts = []
        for (let i = 0; i <= N; i += 1) {
          const d = (at * i) / N
          pts.push([px((d / (360 * turns))), yMid * S - amp * val(d)])
        }
        const path = pts.length > 1 ? 'M ' + pts.map(([x, y]) => x + ' ' + y).join(' L ') : ''
        const tone = from === 0 ? T.graph : T.accent
        return (
          <g>
            {/* POLOSA: minus birdan birgacha. To'lqin undan chiqmaydi. */}
            {band > 0.01 ? (
              <g opacity={band}>
                <rect
                  x={gx0 * S} y={yMid * S - amp} width={(gx1 - gx0) * S} height={amp * 2}
                  fill="rgba(23,108,112,.07)" stroke="none"
                />
                <line x1={gx0 * S} y1={yMid * S - amp} x2={gx1 * S} y2={yMid * S - amp} stroke={T.ink2} strokeWidth="1.2" strokeDasharray="5 4" />
                <line x1={gx0 * S} y1={yMid * S + amp} x2={gx1 * S} y2={yMid * S + amp} stroke={T.ink2} strokeWidth="1.2" strokeDasharray="5 4" />
              </g>
            ) : null}

            {/* AYLANA va o'qlari */}
            <line x1={ox - R * S * 1.25} y1={oy} x2={ox + R * S * 1.25} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * S * 1.25} x2={ox} y2={oy + R * S * 1.25} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R * S} fill="none" stroke={T.ink3} strokeWidth="1.4" />

            {/* VAQT o'qi */}
            <line x1={gx0 * S} y1={yMid * S} x2={gx1 * S} y2={yMid * S} stroke="rgba(23,26,29,.32)" strokeWidth="1.2" />

            {/* O'lchanadigan uzunlik AYLANADA: chizma burilgani uchun ikki
                holatda ham u TIKKA turadi, va ko'chiruvchi ikkisida ham
                gorizontal bo'ladi. */}
            <line x1={ptx} y1={oy} x2={ptx} y2={pty} stroke={tone} strokeWidth="3.2" />
            <line x1={ox} y1={oy} x2={ptx} y2={pty} stroke={T.ink3} strokeWidth="1.4" />
            <circle cx={ptx} cy={pty} r={rDot * 1.1} fill={T.accent} />

            {/* Nima chizilayotgani YOZILADI: grafik o'z nomi bilan turadi. */}
            <text
              x={gx1 * S} y={yMid * S - amp * 1.32} textAnchor="end"
              fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={tone} {...halo(size)}
            >
              {label}
            </text>
            {/* Sanoq QAYERDAN boshlangani: boshlanish nuqtasi halqa bilan
                belgilanadi. Kosinusda u tepada, va farq shundan ko'rinadi. */}
            <circle
              cx={P(Math.cos(rad(from)), Math.sin(rad(from)))[0]}
              cy={P(Math.cos(rad(from)), Math.sin(rad(from)))[1]}
              r={rDot * 1.5} fill="none" stroke={T.ink2} strokeWidth="1.6" opacity=".7"
            />

            {/* KO'CHIRUVCHI: uzunlik o'ngga ko'chadi va grafikdagi joyini topadi. */}
            {at > 1 ? (
              <g>
                <line
                  x1={ptx} y1={pty} x2={nowX} y2={nowY}
                  stroke={tone} strokeWidth="1.1" strokeDasharray="3 3" opacity=".7"
                />
                <line x1={nowX} y1={yMid * S} x2={nowX} y2={nowY} stroke={tone} strokeWidth="3" />
                <circle cx={nowX} cy={nowY} r={rDot} fill={tone} />
              </g>
            ) : null}

            {path ? <path d={path} fill="none" stroke={tone} strokeWidth="2.6" strokeLinecap="round" /> : null}

            {/* DAVR: bitta to'lqin uzunligi = to'liq aylana. */}
            {mark > 0.01 ? (
              <g opacity={mark}>
                <line x1={gx0 * S} y1={yMid * S + amp * 1.5} x2={gx1 * S} y2={yMid * S + amp * 1.5} stroke={T.tip} strokeWidth="2" />
                <line x1={gx0 * S} y1={yMid * S + amp * 1.35} x2={gx0 * S} y2={yMid * S + amp * 1.65} stroke={T.tip} strokeWidth="2" />
                <line x1={gx1 * S} y1={yMid * S + amp * 1.35} x2={gx1 * S} y2={yMid * S + amp * 1.65} stroke={T.tip} strokeWidth="2" />
                <text
                  x={(gx0 + gx1) * S / 2} y={yMid * S + amp * 1.5 + fs * 1.5} textAnchor="middle"
                  fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.tip} {...halo(size)}
                >
                  2π
                </text>
              </g>
            ) : null}

            {band > 0.5 ? (
              /* Yorliqlar polosaning ICHIDA, chap chetidan o'ngga. Tashqarida
                 turganda ular kichik chizmada (212 px, haqiqiy telefon) aylanaga
                 tegib ketardi -- surat ko'rsatdi (2026-08-13). */
              <g fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.ink2} {...halo(size)}>
                <text x={gx0 * S + fs * 0.25} y={yMid * S - amp + fs * 1.05} textAnchor="start">1</text>
                <text x={gx0 * S + fs * 0.25} y={yMid * S + amp - fs * 0.35} textAnchor="start">−1</text>
              </g>
            ) : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================
// ISHORA BU YO'NALISH -- 4-darsning ASOSIY guvohi.
//
// Nuqta aylana bo'ylab yuradi, chizma tagida esa ikki (yoki uch) ishorali
// shkala turadi. Ishora shkalada AYNAN o'sha paytda almashadi, qachonki nuqta
// o'qdan o'tadi. Shundan keyin mnemonika kerak emas: ishorani bilish uchun
// yo'nalishga qarash yetarli.
//
// NEGA SHKALA, oddiy son emas. Son almashganda «minus paydo bo'ldi» deb
// aytish mumkin, lekin QAYSI PAYTDA almashgani ko'rinmaydi. Ustun esa nol
// chizig'idan o'tadi, va o'tish payti ko'z bilan bog'lanadi: nuqta o'qda --
// ustun nolda.
//
// `tan` -- uchinchi shkala: tangens. U ikki ishoradan chiqadi, shuning uchun
// 5-ekranda ikkisi bilan birga turadi.
// ============================================================
export function SignScales({ size = 268, step = 0, angles = [30, 130, 210], tan = false }) {
  const live = useMounted()
  const target = angles[Math.min(step, angles.length - 1)]
  const at = useTween(live ? target : 0, step === 0 ? 1100 : 1500)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.26, y: 0.44, r: 0.2 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const c = Math.cos(rad(at))
        const s = Math.sin(rad(at))
        const [px, py] = P(c, s)
        const [fx] = P(c, 0)
        const rDot = Math.max(4, R * 0.08)
        const fs = Math.max(11, Math.round(S * 0.044))
        // Shkala: nol chizig'i va bir birlikning balandligi.
        const y0 = S * 0.5
        const unit = S * 0.27
        const bw = S * 0.07
        const bx = tan ? [S * 0.58, S * 0.72, S * 0.86] : [S * 0.62, S * 0.8]
        const tv = Math.abs(c) < 0.03 ? null : s / c
        const bars = [
          { v: c, tone: T.accent, name: 'cos' },
          { v: s, tone: T.graph, name: 'sin' },
        ]
        if (tan) bars.push({ v: tv, tone: T.tip, name: 'tg' })
        // O'qdan o'tish PAYTI: nol chizig'i yonadi.
        const near = Math.min(Math.abs(c), Math.abs(s)) < 0.09
        return (
          <g>
            {/* AYLANA va nuqta */}
            <line x1={ox - R * 1.3} y1={oy} x2={ox + R * 1.3} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.3} x2={ox} y2={oy + R * 1.3} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.4" />
            <line x1={ox} y1={oy} x2={fx} y2={oy} stroke={T.accent} strokeWidth="3" />
            <line x1={fx} y1={oy} x2={px} y2={py} stroke={T.graph} strokeWidth="2.6" />
            <line x1={ox} y1={oy} x2={px} y2={py} stroke={T.ink3} strokeWidth="1.3" />
            <circle cx={px} cy={py} r={rDot} fill={T.accent} />

            {/* NOL chizig'i: ishora almashadigan joy. */}
            <line
              x1={S * 0.52} y1={y0} x2={S * 0.95} y2={y0}
              stroke={near ? T.tip : T.ink3} strokeWidth={near ? 2.2 : 1.3}
            />

            {bars.map((b, i) => {
              const v = b.v
              const h = v === null ? 0 : Math.min(Math.abs(v), 1.45) * unit
              const up = v !== null && v >= 0
              return (
                <g key={b.name}>
                  {v === null ? null : (
                    <rect
                      x={bx[i] - bw / 2} y={up ? y0 - h : y0}
                      width={bw} height={Math.max(1, h)}
                      fill={b.tone} opacity=".72" rx={2}
                    />
                  )}
                  <text
                    x={bx[i]} y={y0 + unit * 1.42} textAnchor="middle"
                    fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={b.tone} {...halo(size)}
                  >
                    {b.name}
                  </text>
                  {/* ISHORA ustunning ICHIDA, nol chizig'i yonida.
                      Ilgari u ustunning UCHIDA turardi, va uzun ustunda (masalan
                      tangens 1,19) pastdagi nom yozuviga tegib, uni chizib
                      tashlardi -- stendda `tg` ustidan chiziq o'tib turdi
                      (2026-08-13). Nol chizig'i yonida joy har doim bir xil, va
                      ma'no ham aynan shu yerda: ishora nolda almashadi. */}
                  <text
                    x={bx[i]} y={up ? y0 - fs * 0.42 : y0 + fs * 1.02}
                    textAnchor="middle"
                    fontFamily={MATH_FONT} fontSize={fs * 1.15} fontWeight="700"
                    fill={v === null ? T.tip : T.paper}
                  >
                    {v === null ? '—' : Math.abs(v) < 0.02 ? '0' : up ? '+' : '−'}
                  </text>
                </g>
              )
            })}
          </g>
        )
      }}
    />
  )
}

// ============================================================
// CHORAKLAR NOM OLADI -- 4-darsning 4-ekrani.
//
// Bu yerda «chorak» so'zi SINFDA BIRINCHI MARTA aytiladi: 2 va 3-darsda u
// ataylab yo'q. Shuning uchun ekran ikki qadamda ishlaydi: avval qismlar nom
// oladi, keyin har biriga ishoralar juftligi yoziladi.
//
// Juftlik YOZILADI, lekin yodlash uchun emas: har juftlik o'z choragida
// turadi, ya'ni o'quvchi uni chizmadan o'qiydi, jadvaldan emas.
// ============================================================
export function QuadNames({ size = 268, step = 0, deg = null }) {
  const live = useMounted()
  const names = useTween(live ? 1 : 0, 700)
  const pairs = useTween(step >= 1 ? 1 : 0, 700)
  const at = useTween(deg === null ? 0 : deg, 1300)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.34 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const fs = Math.max(11, Math.round(S * 0.05))
        const rDot = Math.max(4, R * 0.062)
        const ROMAN = ['I', 'II', 'III', 'IV']
        const PAIR = ['(+; +)', '(−; +)', '(−; −)', '(+; −)']
        const mid = [45, 135, 225, 315]
        return (
          <g>
            <line x1={ox - R * 1.22} y1={oy} x2={ox + R * 1.22} y2={oy} stroke="rgba(23,26,29,.34)" strokeWidth="1.2" />
            <line x1={ox} y1={oy - R * 1.22} x2={ox} y2={oy + R * 1.22} stroke="rgba(23,26,29,.34)" strokeWidth="1.2" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.4" />

            {mid.map((d, i) => {
              // Nom va juftlik BIR guruh bo'lib, chorakning o'rtasida turadi.
              // Ilgari juftlik pastga surilardi va pastdagi choraklarda nom
              // o'qqa tegib qolardi (stend, 2026-08-13).
              const cxq = Math.cos(rad(d)) * 0.54
              const cyq = Math.sin(rad(d)) * 0.54
              const [lx, ly] = P(cxq, cyq + 0.13)
              const [qx, qy] = P(cxq, cyq - 0.17)
              return (
                <g key={d}>
                  <text
                    x={lx} y={ly} textAnchor="middle" opacity={names}
                    fontFamily={MATH_FONT} fontSize={fs * 1.1} fontWeight="700" fill={T.ink2} {...halo(size)}
                  >
                    {ROMAN[i]}
                  </text>
                  {pairs > 0.01 ? (
                    <text
                      x={qx} y={qy} textAnchor="middle" opacity={pairs}
                      fontFamily={MATH_FONT} fontSize={Math.max(11, fs * 0.92)} fontWeight="700" fill={T.accent} {...halo(size)}
                    >
                      {PAIR[i]}
                    </text>
                  ) : null}
                </g>
              )
            })}

            {deg !== null ? (
              <g>
                <line
                  x1={ox} y1={oy}
                  x2={P(Math.cos(rad(at)), Math.sin(rad(at)))[0]}
                  y2={P(Math.cos(rad(at)), Math.sin(rad(at)))[1]}
                  stroke={T.accent} strokeWidth="2.4"
                />
                <circle
                  cx={P(Math.cos(rad(at)), Math.sin(rad(at)))[0]}
                  cy={P(Math.cos(rad(at)), Math.sin(rad(at)))[1]}
                  r={rDot} fill={T.accent}
                />
              </g>
            ) : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================
// ZERKALO GORIZONTAL O'Q BO'YLAB -- 5-darsning BIRINCHI guvohi.
//
// Nuqta o'q bo'ylab aks etadi: SILJISH o'sha joyda qoladi, BALANDLIK esa
// ishorasini almashtiradi. Shundan `cos(−α) = cos α` va `sin(−α) = −sin α`
// kelib chiqadi -- va bu ikki yodlanadigan formula emas, BITTA rasm.
//
// NEGA AKS ETTIRISH, ikkinchi nuqtani shunchaki qo'yish emas. Ikki nuqta
// alohida qo'yilganda ular IKKI BOSHQA nuqta bo'lib ko'rinadi va tenglikni
// yana yodlash kerak bo'ladi. Aks etganda esa ko'rinadi: gorizontal kesma
// QIMIRLAMADI, tik kesma esa aylanib tushdi. Ya'ni tenglik va qarama-qarshilik
// bitta harakatdan chiqadi.
//
// Kadrlar:
//   0  nuqta musbat burchakda, ikki proyeksiya
//   1  nuqta o'q bo'ylab pastga AKS ETADI (manfiy burish shu yerda kiritiladi)
//   2  ikki nuqta birga: siljish bitta, balandliklar qarama-qarshi
// ============================================================
export function MirrorAxis({ size = 268, step = 0, deg = 60 }) {
  const live = useMounted()
  // Aks etish -- burchakning ISHORASI bo'yicha: `k = 1` yuqorida, `k = −1`
  // pastda. Oraliq holat esa nuqtaning o'q bo'ylab tushishi.
  // Boshlang'ich qiymat HAR DOIM «yuqorida», nishon esa kadr bo'yicha. Shu
  // sababli figura 1-kadrda ochilganda ham aks etish KO'RINADI: xuk ekrani
  // aynan shunday ishlatadi. Ilgari `useTween` nishondan boshlanardi va
  // birinchi kadrda qo'yilgan figura umuman qimirlamasdi.
  const k = useTween(live ? (step >= 1 ? -1 : 1) : 1, 1400)
  const both = useTween(step >= 2 ? 1 : 0, 640)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.34 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const c = Math.cos(rad(deg))
        const s = Math.sin(rad(deg)) * k
        const [px, py] = P(c, s)
        const [fx, fy] = P(c, 0)
        const [ux, uy] = P(c, Math.sin(rad(deg)))
        const rDot = Math.max(4, R * 0.062)
        const fs = Math.max(11, Math.round(S * 0.05))
        const down = k < -0.05
        return (
          <g>
            <line x1={ox - R * 1.2} y1={oy} x2={ox + R * 1.2} y2={oy} stroke="rgba(23,26,29,.34)" strokeWidth="1.3" />
            <line x1={ox} y1={oy - R * 1.2} x2={ox} y2={oy + R * 1.2} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />

            {/* Boshlang'ich nuqta 2-kadrda QOLADI: ikkisi solishtiriladi. */}
            {both > 0.01 ? (
              <g opacity={both}>
                <line x1={ox} y1={oy} x2={ux} y2={uy} stroke={T.ink3} strokeWidth="1.4" strokeDasharray="4 3" />
                <line x1={fx} y1={fy} x2={ux} y2={uy} stroke={T.graph} strokeWidth="2.4" />
                <circle cx={ux} cy={uy} r={rDot * 0.92} fill="none" stroke={T.ink2} strokeWidth="2" />
              </g>
            ) : null}

            {/* SILJISH: aks etishda U QIMIRLAMAYDI. Shuning uchun u doim bir
                xil rangda va bir xil uzunlikda -- ko'z shuni ushlaydi. */}
            <line x1={ox} y1={oy} x2={fx} y2={fy} stroke={T.accent} strokeWidth="3.4" />
            {/* BALANDLIK: aylanib tushadi va ishorasini almashtiradi. */}
            <line x1={fx} y1={fy} x2={px} y2={py} stroke={T.graph} strokeWidth="2.8" />
            <line x1={ox} y1={oy} x2={px} y2={py} stroke={T.ink3} strokeWidth="1.5" />
            <circle cx={ox} cy={oy} r={rDot * 0.5} fill={T.ink3} />
            <circle cx={px} cy={py} r={rDot} fill={T.accent} />

            <g fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" {...halo(size)}>
              {/* Burchak yorlig'i ishorasi bilan: manfiy burish shu yerda
                  ko'rinadi, ta'rifdan oldin. */}
              <text
                x={ox + R * 0.3} y={oy + (down ? fs * 1.25 : -fs * 0.4)}
                textAnchor="start" fontSize={Math.max(11, fs * 0.92)} fill={T.ink2}
              >
                {(down ? '−' : '') + String(deg) + '°'}
              </text>
              {both > 0.5 ? (
                <g className="g10-valpop">
                  <text x={(ox + fx) / 2} y={oy - fs * 0.45} textAnchor="middle" fill={T.accent}>
                    cos
                  </text>
                  <text x={px + fs * 0.45} y={(fy + py) / 2 + fs * 0.34} textAnchor="start" fill={T.graph}>
                    −sin
                  </text>
                  <text x={ux + fs * 0.45} y={(fy + uy) / 2 + fs * 0.34} textAnchor="start" fill={T.graph}>
                    sin
                  </text>
                </g>
              ) : null}
            </g>
          </g>
        )
      }}
    />
  )
}

// ============================================================
// TO'LIQ AYLANA O'SHA NUQTAGA QAYTARADI -- 5-darsning IKKINCHI guvohi.
//
// Etalon §2 dagi priyom `period-bez-vozvrata` uchun: «to'liq aylana nuqtani
// o'sha joyga qaytaradi». Ya'ni davr bu «funksiya qaytadan boshlanadi» degan
// so'z emas, balki NUQTANING O'SHA JOYGA qaytishi. Shuning uchun boshlang'ich
// joy halqa bilan belgilanadi va nuqta aylanib kelib, aynan uning ustiga
// tushadi -- ustma-ust.
//
// `turns` -- nechta aylana. Ikkitasi kerak: bitta aylana bilan o'quvchi «uch
// yuz oltmish qo'shildi» deb xususiy holni yodlaydi, ikkitasi bilan qoida
// ko'rinadi.
// ============================================================
export function SameSpot({ size = 268, step = 0, deg = 30, turns = 1 }) {
  const live = useMounted()
  const at = useTween(step >= 1 ? deg + 360 * turns : (live ? deg : deg), step >= 1 ? 2600 : 0)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.36 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const [sx, sy] = P(Math.cos(rad(deg)), Math.sin(rad(deg)))
        const c = Math.cos(rad(at))
        const s = Math.sin(rad(at))
        const [px, py] = P(c, s)
        const rDot = Math.max(4, R * 0.062)
        const fs = Math.max(11, Math.round(S * 0.05))
        const done = at >= deg + 360 * turns - 1
        return (
          <g>
            <line x1={ox - R * 1.18} y1={oy} x2={ox + R * 1.18} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.18} x2={ox} y2={oy + R * 1.18} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />

            {/* BOSHLANG'ICH joy: halqa. Nuqta aynan uning ustiga qaytadi. */}
            <circle cx={sx} cy={sy} r={rDot * 1.75} fill="none" stroke={T.ink2} strokeWidth="2" opacity=".8" />

            <line x1={ox} y1={oy} x2={px} y2={py} stroke={T.accent} strokeWidth="2.4" />
            <circle cx={ox} cy={oy} r={rDot * 0.5} fill={T.ink3} />
            <circle cx={px} cy={py} r={rDot} fill={T.accent} />

            {done ? (
              <g fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.ok} {...halo(size)} className="g10-valpop">
                <text x={ox} y={oy - R * 0.25} textAnchor="middle">{'+ ' + 360 * turns + '°'}</text>
              </g>
            ) : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================================
// BLOK 2 NING SHOHIDI: GORIZONTAL CHIZIQ IKKITA NUQTA BERADI.
//
// `sin x = a` da eng ko'p uchraydigan xato -- bitta ildiz yozish. Sabab: ekranda
// bitta nuqta ko'rsatiladi. Bu figura chiziqni tushiradi va IKKALA kesishishni
// birdan yoqadi, keyin ular ekranda QOLADI: javob berilayotganda ikkinchisi
// ko'rinib turadi.
//
// `axis`: `y` -- gorizontal (sinus), `x` -- vertikal (kosinus).
// `a` birdan katta bo'lsa chiziq aylanadan yuqorida to'xtaydi va nuqta umuman
// paydo bo'lmaydi -- `sin x = 2` ning javobi aynan shu.
// ============================================================================
// `arcSide` -- 34-DARSNING SHOHIDI. Tenglamada yechim ikki NUQTA edi,
// tengsizlikda esa ular orasidagi butun YOY. `up` -- chiziqdan yuqoridagi yoy
// (`sin x > a`), `down` -- pastdagisi. Yoy chiziqning o'zidan va ikki
// kesishish nuqtasidan chiqadi, ya'ni yangi hisob yo'q.
export function LevelLine({ size = 268, step = 0, a = 0.5, axis = 'y', arcs = false, arcSide = null }) {
  const vert = axis === 'x'
  const start = 1.42
  // `a` birdan katta bo'lsa chiziq KAMERADAN chiqib ketadi va ekranda umuman
  // ko'rinmaydi -- ya'ni «to'g'ri chiziq aylananing yonidan o'tdi» degan
  // shohid yo'q bo'ladi. Stend shuni ko'rsatdi: `a = 2` da faqat aylana
  // qolgan edi. Shuning uchun chiziq ko'rinadigan joyda to'xtaydi, yozuvda
  // esa HAQIQIY qiymat turadi.
  const stop = Math.abs(a) <= 1 ? a : Math.sign(a) * 1.22
  const at = useTween(step >= 1 ? stop : start, 1500)
  const settled = Math.abs(at - stop) < 0.02
  const cut = Math.abs(a) <= 1 ? Math.sqrt(Math.max(0, 1 - a * a)) : null

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.36 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const rDot = Math.max(4, R * 0.062)
        const fs = Math.max(11, Math.round(S * 0.05))
        // Chiziqning ikki uchi va kesishish nuqtalari BIR hisobdan chiqadi.
        const end0 = vert ? P(at, -1.3) : P(-1.3, at)
        const end1 = vert ? P(at, 1.3) : P(1.3, at)
        const pts = cut === null ? [] : (vert ? [[a, cut], [a, -cut]] : [[cut, a], [-cut, a]])
        const tag = (vert ? 'x = ' : 'y = ') + String(a).replace('.', ',').replace('-', '−')

        return (
          <g>
            <line x1={ox - R * 1.18} y1={oy} x2={ox + R * 1.18} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.18} x2={ox} y2={oy + R * 1.18} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />

            <line
              x1={end0[0]} y1={end0[1]} x2={end1[0]} y2={end1[1]}
              stroke={T.accent} strokeWidth="2" strokeDasharray="6 4" opacity=".85"
            />

            {/* YECHIM YOYI: ikki nuqta orasidagi butun uchastka. */}
            {settled && arcSide && cut !== null ? (() => {
              const ang = (pt) => Math.atan2(pt[1], pt[0])
              const a0 = ang(pts[1])
              const a1 = ang(pts[0])
              // Yuqoridagi yoy: burchak kichikdan kattaga soat miliga QARSHI.
              const from = arcSide === 'up' ? Math.min(a0, a1) : Math.max(a0, a1)
              const to = arcSide === 'up' ? Math.max(a0, a1) : Math.min(a0, a1) + 2 * Math.PI
              const q = []
              const N4 = 64
              for (let i = 0; i <= N4; i += 1) {
                const t = from + ((to - from) * i) / N4
                q.push(P(Math.cos(t), Math.sin(t)))
              }
              return (
                <path
                  d={q.map((p, i) => (i ? 'L' : 'M') + p.join(' ')).join(' ')}
                  fill="none" stroke={T.ok} strokeWidth={Math.max(5, R * 0.09)}
                  strokeLinecap="round" opacity=".55"
                />
              )
            })() : null}

            {settled && pts.length ? pts.map((pt, i) => {
              const sp = P(pt[0], pt[1])
              return <circle key={i} cx={sp[0]} cy={sp[1]} r={rDot} fill={T.accent} />
            }) : null}

            {settled && arcs && pts.length ? pts.map((pt, i) => {
              const d = ((Math.atan2(pt[1], pt[0]) * 180) / Math.PI + 360) % 360
              const lp = P(pt[0] * 1.26, pt[1] * 1.26)
              return (
                <text
                  key={'l' + i} x={lp[0]} y={lp[1]} textAnchor="middle" dominantBaseline="middle"
                  fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.ink2} {...halo(size)}
                >
                  {Math.round(d) + '°'}
                </text>
              )
            }) : null}

            {settled ? (
              <text
                // Vertikal holatda yozuv chiziqning YONIDA turadi: stendda u
                // chiziq ustiga tushib «x =↓0,5» bo'lib o'qilgan edi.
                x={vert ? P(stop, 0)[0] + fs * 0.7 : ox - R * 0.14}
                y={vert ? P(0, -1.16)[1] : P(0, stop)[1] - fs * 0.45}
                textAnchor={vert ? 'start' : 'end'}
                fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.accent} {...halo(size)}
              >
                {tag}
              </text>
            ) : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================================
// BIR QIYMATLILIK OYNASI. `arcsin` shu yerdan tug'iladi.
//
// Gorizontal chiziq ikkita nuqta beradi, teskari amal esa BITTA son berishi
// shart. Kelishuv: aylananing bir bo'lagi tanlanadi, va javob faqat undan
// olinadi. Figura oynani bo'yaydi va tashqaridagi nuqtani SO'NDIRADI, lekin
// o'chirmaydi: u bor, shunchaki javobga olinmaydi.
// ============================================================================
export function WindowArc({ size = 268, step = 0, a = 0.5, from = -90, to = 90, axis = 'y' }) {
  const vert = axis === 'x'
  const paint = useTween(step >= 1 ? 1 : 0, 800)
  const pick = useTween(step >= 2 ? 1 : 0, 700)
  const cut = Math.abs(a) <= 1 ? Math.sqrt(Math.max(0, 1 - a * a)) : 0
  // ARKKOSINUS uchun chiziq VERTIKAL. Gorizontal chiziq bilan `0…180` oynasiga
  // IKKALA nuqta ham tushadi (ikkovining balandligi bir xil), ya'ni oyna hech
  // narsani ajratmaydi -- stendda aynan shu chiqdi.
  const pts = vert ? [[a, cut], [a, -cut]] : [[cut, a], [-cut, a]]
  const inWin = (pt) => {
    const d = ((Math.atan2(pt[1], pt[0]) * 180) / Math.PI + 360) % 360
    const lo = ((from % 360) + 360) % 360
    const hi = ((to % 360) + 360) % 360
    return lo <= hi ? d >= lo && d <= hi : d >= lo || d <= hi
  }

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.36 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const rDot = Math.max(4, R * 0.062)
        const fs = Math.max(11, Math.round(S * 0.05))
        const A0 = P(Math.cos(rad(from)), Math.sin(rad(from)))
        const A1 = P(Math.cos(rad(to)), Math.sin(rad(to)))
        const big = Math.abs(to - from) > 180 ? 1 : 0

        return (
          <g>
            <line x1={ox - R * 1.18} y1={oy} x2={ox + R * 1.18} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.18} x2={ox} y2={oy + R * 1.18} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />

            <g opacity={paint}>
              <path
                d={'M ' + A0[0] + ' ' + A0[1] + ' A ' + R + ' ' + R + ' 0 ' + big + ' 0 ' + A1[0] + ' ' + A1[1]}
                fill="none" stroke={T.ok} strokeWidth={Math.max(4, R * 0.075)} strokeLinecap="round" opacity=".5"
              />
            </g>

            <line
              x1={vert ? P(a, -1.3)[0] : P(-1.3, a)[0]} y1={vert ? P(a, -1.3)[1] : P(-1.3, a)[1]}
              x2={vert ? P(a, 1.3)[0] : P(1.3, a)[0]} y2={vert ? P(a, 1.3)[1] : P(1.3, a)[1]}
              stroke={T.accent} strokeWidth="2" strokeDasharray="6 4" opacity=".8"
            />

            {pts.map((pt, i) => {
              const sp = P(pt[0], pt[1])
              const here = inWin(pt)
              // Tanlash IKKINCHI kadrda bo'ladi. Birinchi kadrda ikkala nuqta
              // ham bir xil: oyna endi bo'yaldi, javob hali olinmadi. Rangni
              // darrov o'zgartirsak, ikkinchi kadr bo'sh qoladi.
              const dim = here ? 0 : pick
              const op = 1 - dim * 0.72
              const tone = dim > 0.5 ? T.ink3 : T.accent
              return (
                <g key={i} opacity={op}>
                  <line x1={ox} y1={oy} x2={sp[0]} y2={sp[1]} stroke={tone} strokeWidth={dim > 0.5 ? 1.6 : 2.4} />
                  <circle cx={sp[0]} cy={sp[1]} r={rDot} fill={tone} />
                </g>
              )
            })}
            <circle cx={ox} cy={oy} r={rDot * 0.5} fill={T.ink3} />

            {step >= 2 ? (
              <g fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.ok} {...halo(size)} className="g10-valpop">
                <text x={ox} y={oy + R * 1.36} textAnchor="middle">
                  {/* Minus TIPOGRAFIK bo'lishi kerak: `-90` klaviatura defisi. */}
                  {String(from).replace('-', '−') + '°  …  ' + String(to).replace('-', '−') + '°'}
                </text>
              </g>
            ) : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================================
// SERIYA: BITTA NUQTA, KO'P YOZUV.
//
// To'liq aylana nuqtani o'sha joyga qaytaradi, ya'ni bitta nuqtaga cheksiz ko'p
// yozuv mos keladi. Figura yozuvlarni BIRIN-KETIN chiqaradi: `n` harfi keyin
// shu qatordan o'sib chiqadi, ta'rifdan emas.
// ============================================================================
export function SeriesTicks({ size = 268, step = 0, deg = 30, turns = 2, alt = false }) {
  const shown = Math.min(step, turns)
  // `alt` -- 10-DARS uchun: ikkita seriya bitta yozuvga yig'ilganda nuqta ikki
  // joy orasida ALMASHIB boradi, qadam esa yarim aylana bo'lib qoladi.
  // Formula: (−1)^k · burchak + 180°k. k = 0, 1, 2, 3 -> 30, 150, 390, 510.
  const valueAt = (k) => (alt ? (k % 2 === 0 ? deg : 180 - deg) + 360 * Math.floor(k / 2) : deg + 360 * k)
  const at = useTween(valueAt(shown), 2200)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.34 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const sp = P(Math.cos(rad(deg)), Math.sin(rad(deg)))
        const pp = P(Math.cos(rad(at)), Math.sin(rad(at)))
        // `alt` da ikkinchi joy ham HALQA bilan belgilanadi: nuqta ular
        // orasida almashib boradi, va ikkalasi ham ko'rinib turishi kerak.
        const ap = P(Math.cos(rad(180 - deg)), Math.sin(rad(180 - deg)))
        const rDot = Math.max(4, R * 0.062)
        const fs = Math.max(11, Math.round(S * 0.046))
        const rows = []
        for (let k = 0; k <= shown; k += 1) rows.push(valueAt(k) + '°')

        return (
          <g>
            <line x1={ox - R * 1.18} y1={oy} x2={ox + R * 1.18} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.18} x2={ox} y2={oy + R * 1.18} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />

            <circle cx={sp[0]} cy={sp[1]} r={rDot * 1.75} fill="none" stroke={T.ink2} strokeWidth="2" opacity=".8" />
            {alt ? <circle cx={ap[0]} cy={ap[1]} r={rDot * 1.75} fill="none" stroke={T.ink2} strokeWidth="2" opacity=".8" /> : null}
            <line x1={ox} y1={oy} x2={pp[0]} y2={pp[1]} stroke={T.accent} strokeWidth="2.4" />
            <circle cx={ox} cy={oy} r={rDot * 0.5} fill={T.ink3} />
            <circle cx={pp[0]} cy={pp[1]} r={rDot} fill={T.accent} />

            <g fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.ink2} {...halo(size)}>
              <text x={ox} y={oy + R * 1.4} textAnchor="middle">{rows.join('   ')}</text>
            </g>
          </g>
        )
      }}
    />
  )
}

// ============================================================================
// KOORDINATA TEKISLIGI. 4-ASBOBNING SODDALASHTIRILGAN KO'RINISHI.
//
// `PODXOD_10SINF.md` §7: 7, 31 va 34-darslar uchun bitta oyna, jadval va
// formula yetadi. Bu yerda o'sha bitta oyna.
//
// NIMA QILADI (`show` bilan tanlanadi):
//   `point` -- nuqta grafik bo'ylab yuradi, IKKALA o'qqa proyeksiya tushiradi;
//   `vline` -- vertikal to'g'ri chiziq chizma bo'ylab suriladi. Funksiya
//              bo'lmagan egri chiziqda u BIR joyda ikki marta kesadi -- shu
//              darsning shohidi;
//   `dom`   -- gorizontal polosa: qaysi `x` lar umuman olinadi;
//   `rng`   -- vertikal polosa: qanday `y` lar chiqadi.
//
// `curve`: `sin` (funksiya), `circle` (funksiya EMAS), `line` (to'g'ri chiziq).
// Egri chiziq FORMULADAN chiziladi, nuqtalar ro'yxatidan emas -- shuning uchun
// «grafik jadvaldan olinmaydi» degan gap chizmada ham rost bo'ladi.
// ============================================================================
// IKKI TURDAGI EGRI CHIZIQ.
//
// 1-7 darslarning egri chiziqlari NORMALLASHTIRILGAN: `rng` -- chizmadagi
// balandlik, va qiymat yozilmaydi. Sinus uchun bu to'g'ri: uning qiymati
// baribir birdan oshmaydi.
//
// 5-BLOK uchun bu YARAMAYDI. `2^x = 8` tenglamasining shohidi -- sakkiz
// darajasidagi gorizontal egri chiziqni QAYERDA uchratishi, va uchrashuv
// `x = 3` deb yozilgan joyda bo'lishi kerak. Normallashtirilgan chizmada u
// boshqa joyda turadi, ya'ni SHOHID YOLG'ON GAPIRADI. Shuning uchun blok 5
// ning egri chiziqlari HAQIQIY qiymatlarda yoziladi (`ymax` bor), o'qlarda
// esa bo'linmalar imzolanadi (`tx`, `ty`).
//
// `asym` -- ASIMPTOTA: egri chiziq unga yaqinlashadi, lekin tegmaydi. Bu
// 27-darsning shohidi: qiymatlar to'plami noldan boshlanadi, LEKIN nolni
// o'z ichiga olmaydi. ASIMPTOTA O'QNING O'ZI: birinchi redaksiyada egri chiziq
// siljitilgan edi va chizilgan o'qni KESIB o'tardi -- `y = 2^x` esa hech
// qachon kesmaydi. Stend shuni ko'rsatdi (2026-08-14).
const CURVES = {
  sin: { fn: (x) => Math.sin(x), dom: [-3.4, 3.4], rng: [-1.15, 1.15] },
  line: { fn: (x) => 0.45 * x, dom: [-2.2, 2.2], rng: [-1, 1] },
  // Aylana funksiya EMAS, lekin o'qlar unga ham kerak: sinusning keng
  // o'qlarini olsak, chizma bir tomonga og'ib qoladi (stendda ko'rindi).
  circle: { fn: () => 0, dom: [-1.7, 1.7], rng: [-1, 1] },
  // KO'RSATKICHLI: asos birdan katta -- o'sadi; asos birdan kichik -- kamayadi.
  // Ikkalasi `Oy` o'qiga nisbatan bir-birining aksi, va 27-darsda shu ko'rinadi.
  exp: {
    fn: (x) => Math.pow(2, x), dom: [-3, 3.1], ymax: 9, asym: 0,
    tx: [-2, -1, 1, 2, 3], ty: [1, 2, 4, 8],
  },
  expdown: {
    fn: (x) => Math.pow(0.5, x), dom: [-3.1, 3], ymax: 9, asym: 0,
    tx: [-3, -2, -1, 1, 2], ty: [1, 2, 4, 8],
  },
  // ASOS BIRGA TENG: to'g'ri chiziq. 27-darsning 7-ekrani -- nega `a ≠ 1`.
  // ASIMPTOTA YO'Q ATAYIN: bu chiziq o'qqa yaqinlashmaydi, u shunchaki
  // gorizontal. Uzuq chiziq bo'lsa, ekran yolg'on gapirardi.
  one: { fn: () => 1, dom: [-3, 3], ymax: 9, tx: [-2, -1, 1, 2], ty: [1, 2] },
  // ASOSI UCH: 13-ekranda `(1; 3)` nuqtasi berilgan, asos esa izlanadi.
  expthree: {
    fn: (x) => Math.pow(3, x), dom: [-2, 1.2], ymax: 9, asym: 0,
    tx: [-1, 1], ty: [1, 3],
  },
  // LOGARIFMIK egri chiziq -- ko'rsatkichlining `y = x` ga nisbatan aksi.
  // Qiymatlar PASTGA ham ketadi, shuning uchun `ymin` kerak: `ymax` sxemasi
  // pastki chegarani nol deb hisoblaydi, logarifmda esa u manfiy.
  // `vasym` -- TIK asimptota: egri chiziq unga yaqinlashadi va yetmaydi.
  // `kx` va `camX`: logarifmda `x` noldan sakkizgacha ketadi, ya'ni HAMMASI
  // o'ngda. Ko'rsatkichlining 0,42 siqilishi va markazdagi kamerasi bilan
  // egri chiziq kadrdan chiqib ketadi -- stendda shunday ko'rindi.
  // Boshi chapda 14 foizda, sakkiz esa 86 foizda turadi.
  log: {
    fn: (x) => Math.log2(x), dom: [0.055, 8.6], ymin: -4.2, ymax: 3.3, vasym: 0,
    kx: 0.3, camX: 0.14, tx: [1, 2, 4, 8], ty: [-3, -2, -1, 1, 2, 3],
  },
  // Asosi birdan KICHIK logarifm: o'sha egri chiziq, faqat pastga ketadi.
  logdown: {
    fn: (x) => -Math.log2(x), dom: [0.055, 8.6], ymin: -3.3, ymax: 4.2, vasym: 0,
    kx: 0.3, camX: 0.14, tx: [1, 2, 4, 8], ty: [-3, -2, -1, 1, 2, 3],
  },
  // JUFTLIK: ko'rsatkichli va logarifmik BIR oynada, orasida `y = x`.
  //
  // 30-darsning yuragi shu: ikkalasi bir-birining AKSI, va shuni ko'rsatish
  // uchun ikkala o'qning masshtabi BIR XIL bo'lishi shart (`ky` majburan
  // `kx` ga teng). Aks holda «aks» degan gap chizmada yolg'on bo'ladi:
  // to'g'ri chiziq qiyshiq ketadi va nuqtalar bir-biriga tushmaydi.
  pair: {
    fn: (x) => Math.log2(x), dom: [0.06, 8.5], ymin: -4.5, ymax: 8.5,
    kx: 0.2077, ky: 0.2077, camX: 0.38,
    also: { fn: (x) => Math.pow(2, x), dom: [-4.5, 3.09] },
    mirror: [-4.2, 8.2],
    tx: [-2, 1, 2, 4, 8], ty: [-2, 1, 2, 4, 8],
  },
}

// Gorizontal `level` darajasi bilan uchrashuv NUQTASI. Yechim formuladan
// olinmaydi (egri chiziq har xil bo'lishi mumkin), ikkiga bo'lish bilan
// izlanadi: monoton egri chiziqda bu aniq va bitta javob beradi.
const meetAt = (C, level) => {
  let a = C.dom[0]
  let b = C.dom[1]
  const fa = C.fn(a) - level
  const fb = C.fn(b) - level
  if (fa === 0) return a
  if (fb === 0) return b
  if (fa * fb > 0) return null
  for (let i = 0; i < 60; i += 1) {
    const m = (a + b) / 2
    if ((C.fn(a) - level) * (C.fn(m) - level) <= 0) b = m
    else a = m
  }
  return (a + b) / 2
}

const fmtTick = (v) => String(v).replace('.', ',').replace('-', '−')

export function Plane({
  size = 268, step = 0, curve = 'sin', show = 'point', at = 1.1,
  // 5-blok: chegaralarni va bo'linmalarni dars o'zi tanlaydi. 27-darsning
  // `(0; 1)` ekranida `ymax` kichik bo'lishi kerak, 28-darsning sakkiz
  // darajasida esa katta.
  xmin, xmax, ymax, tx, ty, level = null, mark = null,
  // TENGSIZLIK: yechim -- nuqta emas, UCHASTKA. `region` egri chiziq
  // darajadan PAST (yoki BALAND) bo'lgan joyni bo'yaydi va uni gorizontal
  // o'qqa tushiradi. Darslikning o'z usuli, 123-bet: «yechim shunday x lar
  // to'plamiki, ularda grafik `y = b` to'g'ri chiziqdan pastda yotadi».
  region = null,
}) {
  const grow = useTween(step >= 1 ? 1 : 0, 1800)
  const band = useTween(step >= 2 ? 1 : 0, 800)
  const lift = useTween(step >= 1 ? 1 : 0, 900)
  const ring = curve === 'circle'
  const C0 = CURVES[curve] || CURVES.sin
  const C = {
    ...C0,
    dom: [xmin === undefined ? C0.dom[0] : xmin, xmax === undefined ? C0.dom[1] : xmax],
    ymax: ymax === undefined ? C0.ymax : ymax,
    tx: tx === undefined ? C0.tx : tx,
    ty: ty === undefined ? C0.ty : ty,
  }
  // HAQIQIY qiymatni chizmadagi balandlikka o'giruvchi koeffitsiyent. `ymax`
  // yo'q bo'lsa (1-7 darslarning egri chiziqlari) hech narsa o'zgarmaydi.
  // IKKI TOMONGA KETADIGAN QIYMATLAR (`ymin`). Logarifmda qiymatlar pastga
  // ham ketadi, `ymax` sxemasi esa pastki chegarani nol deb hisoblaydi.
  // `ymin` bo'lsa: butun oraliq kadrga sig'diriladi va kamera shunga suriladi.
  // `ymin` YO'Q bo'lsa hech narsa o'zgarmaydi -- 26-28-darslar tekshirilgan.
  const twoWay = C.ymin !== undefined
  // `ky` egri chiziqda ATAYIN berilgan bo'lishi mumkin: juftlikda ikkala
  // o'qning masshtabi bir xil bo'lishi shart.
  const ky = C.ky !== undefined
    ? C.ky
    : (C.ymax === undefined ? 1 : (twoWay ? 2.24 / (C.ymax - C.ymin) : 1.12 / C.ymax))
  const camX = C.camX === undefined ? 0.5 : C.camX
  const camY = C.ymax === undefined ? 0.5 : (twoWay ? 0.5 + 0.3 * ky * (C.ymax + C.ymin) / 2 : 0.6)
  const rngTop = C.ymax ? C.ymax : (C.rng ? C.rng[1] : 1)
  const rngBottom = C.ymax ? (twoWay ? C.ymin : 0) : (C.rng ? C.rng[0] : -1)
  // 5-BLOKDA EGRI CHIZIQ BIRINCHI KADRDAN CHIZILGAN.
  //
  // 1-7 darslarda `grow` bilan o'sadi, va nol kadrda faqat bitta nuqta
  // qoladi. Stendda (2026-08-14) bu shunday ko'rindi: chap chetda yolg'iz
  // nuqta va ikkita uzuq chiziq -- buzilgan asbob. Blok 5 da funksiyaning
  // O'ZI dars mavzusi, u ochilmaydi: slot birinchi soniyadan to'la (§5.2),
  // harakat esa nuqta, polosa va gorizontalda bo'ladi.
  // JUFTLIKDA IKKINCHI EGRI CHIZIQ BIRDANIGA CHIQMAYDI.
  //
  // Tadqiqotlar «qo'shilgan grafik» xatosini nomlaydi: ko'rsatkichli va
  // logarifmik bir vaqtda paydo bo'lsa, o'quvchi ularni bitta rasm deb ko'radi
  // va qaysi biri qaysi ekanini ajratmaydi. Shuning uchun tanish egri chiziq
  // (`also`) birinchi kadrdan turadi, ASOSIYSI esa ikkinchi kadrda O'ZINI
  // CHIZADI -- bu ham «ko'z oldida chiziladi» tamoyili
  // (`src/books/DINAMIKA_VA_ILLUSTRATSIYA.md` §2 va §5).
  const grown = C.also ? grow : (C.ymax ? 1 : grow)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: camX, y: camY, r: 0.3 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const rDot = Math.max(4, R * 0.06)
        const fs = Math.max(11, Math.round(S * 0.048))
        // Kamera birlik uzunlikni R piksel qiladi. Gorizontal bo'yicha 3,4 ta
        // birlik sig'ishi kerak, shuning uchun X ni siqamiz. Logarifmda `x`
        // noldan sakkizgacha ketadi, va u o'z siqilishini beradi (`kx`).
        const kx = C.kx === undefined ? 0.42 : C.kx
        const PX = (x, y) => P(x * kx, y * ky)

        // Egri chiziq FORMULADAN.
        const pts = []
        const N = 160
        for (let i = 0; i <= N; i += 1) {
          const x = C.dom[0] + ((C.dom[1] - C.dom[0]) * i) / N
          pts.push({ x, y: C.fn(x) })
        }
        const cut = Math.max(1, Math.round(pts.length * (ring ? 1 : grown)))
        const dPath = pts.slice(0, cut)
          .map((p, i) => (i ? 'L' : 'M') + PX(p.x, p.y).join(' '))
          .join(' ')

        // Yuruvchi nuqta: `grow` bo'ylab.
        const px = C.dom[0] + (C.dom[1] - C.dom[0]) * (ring ? 1 : grow) * 0.999
        const py = C.fn(px)
        const [sx, sy] = PX(px, py)
        const [vx] = PX(at, 0)
        const yTop = C.ymax ? C.ymax * 1.02 : 1.35
        // Manfiy daraja chizilgan o'qdan PASTDA qolmasligi kerak: 28-darsda
        // gorizontal minus ikkida turadi, va u ko'rinishi shart.
        const yBot = C.ymax
          ? (twoWay
            ? C.ymin * 1.02
            : Math.min(-C.ymax * 0.06, level !== null && level < 0 ? level * 1.3 : 0))
          : -1.35
        // Uchrashuv: bor yoki YO'Q. Yo'qligi ham shohid.
        const met = level === null ? null : meetAt(C, level)

        return (
          <g>
            {/* O'qlar HAR kadrda o'sha joyda: ular umumiy chiziq. */}
            <line x1={PX(C.dom[0] - 0.2, 0)[0]} y1={oy} x2={PX(C.dom[1] + 0.2, 0)[0]} y2={oy} stroke={T.ink3} strokeWidth="1.4" />
            <line x1={ox} y1={PX(0, yTop)[1]} x2={ox} y2={PX(0, yBot)[1]} stroke={T.ink3} strokeWidth="1.4" />
            {/* O'Q YORLIQLARI BO'LINMALAR IMZOSI BILAN TO'QNASHMAYDI.
                Stend 2026-08-14: `y` eng yuqori bo'linma imzosining ustiga
                tushdi («4» va «y» bir joyda), `x` esa nuqtaning tik izi bilan
                kesishdi. Bo'linmalar bo'lganda yorliqlar chetga chiqadi. */}
            <text
              x={PX(C.dom[1] + (C.tx ? 0.3 : 0.2), 0)[0]}
              y={C.tx ? oy + fs * 1.35 : oy - fs * 0.45}
              textAnchor={C.tx ? 'middle' : 'end'}
              fontFamily={MATH_FONT} fontSize={fs} fill={T.ink3} {...halo(size)}
            >x</text>
            {/* `y` CHAPDA turadi: qiymatlar polosasi vertikal o'qni bosadi va
                yorliq uning tagida qolib ketardi. */}
            <text
              x={C.ty ? ox - fs * 0.55 : ox - fs * 0.5}
              y={PX(0, yTop)[1] + (C.ty ? -fs * 0.3 : fs * 0.9)}
              textAnchor="end" fontFamily={MATH_FONT} fontSize={fs} fill={T.ink3} {...halo(size)}
            >y</text>

            {/* YECHIM UCHASTKASI. Avval yuza (egri chiziq bilan daraja
                orasi), keyin uning o'qdagi izi -- IKKI kadrda, bir vaqtda
                emas: kadrda bitta narsa harakat qiladi
                (`DINAMIKA_VA_ILLUSTRATSIYA.md` §2). Rangi BIR XIL: boshqa
                rang bo'lsa, o'quvchi ularni ikki har xil narsa deb o'qiydi. */}
            {region && met !== null ? (() => {
              const lo = region === 'below' ? C.dom[0] : met
              const hi = region === 'below' ? met : C.dom[1]
              // O'suvchi egri chiziqda «pastda» chapda, kamayuvchida o'ngda.
              const up = C.fn(C.dom[1]) > C.fn(C.dom[0])
              const a = up ? lo : (region === 'below' ? met : C.dom[0])
              const b = up ? hi : (region === 'below' ? C.dom[1] : met)
              const pts2 = []
              const N3 = 90
              for (let i = 0; i <= N3; i += 1) {
                const x = a + ((b - a) * i) / N3
                pts2.push(PX(x, C.fn(x)))
              }
              const top = pts2.map((p, i) => (i ? 'L' : 'M') + p.join(' ')).join(' ')
              const back = ` L ${PX(b, level)[0]} ${PX(0, level)[1]} L ${PX(a, level)[0]} ${PX(0, level)[1]} Z`
              return (
                <g>
                  <path d={top + back} fill={T.ok} opacity={0.28 * lift} stroke="none" />
                  {step >= 2 ? (
                    <rect
                      x={Math.min(PX(a, 0)[0], PX(b, 0)[0])} y={oy - Math.max(5, R * 0.05)}
                      width={Math.abs(PX(b, 0)[0] - PX(a, 0)[0])} height={Math.max(10, R * 0.1)}
                      fill={T.ok} opacity={band * 0.55} rx={4}
                    />
                  ) : null}
                </g>
              )
            })() : null}

            {/* BO'LINMALAR IMZOSI. Ular bo'lmasa gorizontal «sakkiz darajada»
                degan gap chizmada tekshirilmaydi -- 28-darsning shohidi shunga
                tayanadi. Faqat `ymax` bor egri chiziqlarda chiqadi. */}
            {C.tx ? C.tx.map((v) => (
              <g key={'tx' + v}>
                <line x1={PX(v, 0)[0]} y1={oy - 3} x2={PX(v, 0)[0]} y2={oy + 3} stroke={T.ink3} strokeWidth="1.2" />
                <text
                  x={PX(v, 0)[0]} y={oy + fs * 1.25} textAnchor="middle"
                  fontFamily={MATH_FONT} fontSize={Math.max(10.5, fs * 0.86)} fill={T.ink3} {...halo(size)}
                >{fmtTick(v)}</text>
              </g>
            )) : null}
            {C.ty ? C.ty.map((v) => (
              <g key={'ty' + v}>
                <line x1={ox - 3} y1={PX(0, v)[1]} x2={ox + 3} y2={PX(0, v)[1]} stroke={T.ink3} strokeWidth="1.2" />
                <text
                  x={ox - fs * 0.45} y={PX(0, v)[1] + fs * 0.34} textAnchor="end"
                  fontFamily={MATH_FONT} fontSize={Math.max(10.5, fs * 0.86)} fill={T.ink3} {...halo(size)}
                >{fmtTick(v)}</text>
              </g>
            )) : null}

            {/* POLOSALAR: `dom` gorizontal, `rng` vertikal. */}
            {show === 'dom' ? (
              <rect
                x={PX(C.dom[0], 0)[0]} y={oy - Math.max(5, R * 0.05)}
                width={PX(C.dom[1], 0)[0] - PX(C.dom[0], 0)[0]} height={Math.max(10, R * 0.1)}
                fill={T.ok} opacity={band * 0.35} rx={4}
              />
            ) : null}
            {/* Qiymatlar polosasi o'qning O'NG tomonida: bo'linmalar imzosi
                chapda turadi, va markazlangan polosa ularni bosardi (stend
                2026-08-14). Bo'linmalar yo'q bo'lsa (1-7 darslar) -- o'sha
                joyda, markazda. */}
            {show === 'rng' ? (
              <rect
                x={C.ty ? ox : ox - Math.max(5, R * 0.05)} y={PX(0, rngTop)[1]}
                width={Math.max(10, R * 0.1)} height={PX(0, rngBottom)[1] - PX(0, rngTop)[1]}
                fill={T.ok} opacity={band * 0.35} rx={4}
              />
            ) : null}

            {/* ASIMPTOTA: uzuq chiziq, egri chiziq unga yetmaydi. */}
            {C.asym !== undefined ? (
              <line
                x1={PX(C.dom[0] - 0.2, C.asym)[0]} y1={PX(0, C.asym)[1]}
                x2={PX(C.dom[1] + 0.2, C.asym)[0]} y2={PX(0, C.asym)[1]}
                stroke={T.ok} strokeWidth="2" strokeDasharray="6 4" opacity=".75"
              />
            ) : null}
            {C.vasym !== undefined ? (
              <line
                x1={PX(C.vasym, 0)[0]} y1={PX(0, yBot)[1]}
                x2={PX(C.vasym, 0)[0]} y2={PX(0, yTop)[1]}
                stroke={T.ok} strokeWidth="2" strokeDasharray="6 4" opacity=".75"
              />
            ) : null}

            {/* `y = x` -- AKS CHIZIG'I. Juftlikda u ikkala egri chiziq
                orasida turadi va aks ekanini ko'rsatadi. */}
            {C.mirror ? (
              <line
                x1={PX(C.mirror[0], C.mirror[0])[0]} y1={PX(C.mirror[0], C.mirror[0])[1]}
                x2={PX(C.mirror[1], C.mirror[1])[0]} y2={PX(C.mirror[1], C.mirror[1])[1]}
                stroke={T.ink3} strokeWidth="1.4" strokeDasharray="5 5" opacity=".7"
              />
            ) : null}

            {/* EGRI CHIZIQ yoki AYLANA (funksiya emas). */}
            {ring
              ? <circle cx={ox} cy={oy} r={R * 0.62} fill="none" stroke={T.accent} strokeWidth="2.4" />
              : <path d={dPath} fill="none" stroke={T.accent} strokeWidth="2.4" strokeLinecap="round" />}

            {/* IKKINCHI egri chiziq (juftlik). Rangi boshqa: ular bir xil
                emas, ular bir-birining aksi. */}
            {C.also ? (
              <path
                d={(() => {
                  const q = []
                  const N2 = 140
                  for (let i = 0; i <= N2; i += 1) {
                    const x = C.also.dom[0] + ((C.also.dom[1] - C.also.dom[0]) * i) / N2
                    q.push((i ? 'L' : 'M') + PX(x, C.also.fn(x)).join(' '))
                  }
                  return q.join(' ')
                })()}
                fill="none" stroke={T.tip} strokeWidth="2.4" strokeLinecap="round"
              />
            ) : null}

            {/* GORIZONTAL `level` darajada: uchrashuv soni -- ildizlar soni.
                Musbat darajada bitta, nol va manfiyda -- birontasi ham yo'q.
                28-darsning shohidi. */}
            {level !== null ? (
              <g>
                <line
                  x1={PX(C.dom[0] - 0.2, level)[0]} y1={PX(0, level)[1]}
                  x2={PX(C.dom[1] + 0.2, level)[0]} y2={PX(0, level)[1]}
                  stroke={T.tip} strokeWidth="2" strokeDasharray="7 4"
                  opacity={0.35 + 0.65 * lift}
                />
                {met !== null && step >= 1 ? (
                  <g opacity={lift}>
                    <line
                      x1={PX(met, level)[0]} y1={PX(0, level)[1]}
                      x2={PX(met, level)[0]} y2={oy}
                      stroke={T.ink3} strokeWidth="1.2" strokeDasharray="4 4"
                    />
                    <circle cx={PX(met, level)[0]} cy={PX(0, level)[1]} r={rDot} fill={T.accent} />
                    <circle cx={PX(met, level)[0]} cy={oy} r={rDot * 0.62} fill={T.ink2} />
                  </g>
                ) : null}
              </g>
            ) : null}

            {/* VERTIKAL CHIZIQ: funksiya bo'lmasa IKKI marta kesadi. */}
            {show === 'vline' ? (
              <g>
                <line
                  x1={ring ? ox + R * 0.62 * 0.5 : vx} y1={PX(0, -1.3)[1]}
                  x2={ring ? ox + R * 0.62 * 0.5 : vx} y2={PX(0, 1.3)[1]}
                  stroke={T.ink2} strokeWidth="2" strokeDasharray="6 4"
                />
                {ring ? [1, -1].map((k) => (
                  <circle
                    key={k}
                    cx={ox + R * 0.62 * 0.5}
                    cy={oy - k * R * 0.62 * Math.sqrt(1 - 0.25)}
                    r={rDot} fill={T.tip}
                  />
                )) : (
                  <circle cx={vx} cy={PX(at, C.fn(at))[1]} r={rDot} fill={T.accent} />
                )}
              </g>
            ) : null}

            {/* NUQTA va IKKALA proyeksiya: kirish va chiqish bir vaqtda. */}
            {show === 'point' && !ring ? (
              <g>
                <line x1={sx} y1={sy} x2={sx} y2={oy} stroke={T.ink3} strokeWidth="1.2" strokeDasharray="4 4" />
                <line x1={sx} y1={sy} x2={ox} y2={sy} stroke={T.ink3} strokeWidth="1.2" strokeDasharray="4 4" />
                <circle cx={sx} cy={oy} r={rDot * 0.62} fill={T.ink2} />
                <circle cx={ox} cy={sy} r={rDot * 0.62} fill={T.ink2} />
                <circle cx={sx} cy={sy} r={rDot} fill={T.accent} />
              </g>
            ) : null}

            {/* BELGILANGAN NUQTA yoki NUQTALAR: `(0; 1)` kabi. Yozuvsiz,
                chunki formulaning matni uch tilda bir xil bo'lishi kerak.
                Juftlikda ikkita nuqta kerak: `(0; 1)` va `(1; 0)` -- ular
                bir-biriga o'tadi, va aks shundan ko'rinadi. */}
            {mark ? (Array.isArray(mark[0]) ? mark : [mark]).map((m, i) => (
              // Juftlikda ikkinchi nuqta ikkinchi egri chiziq bilan birga
              // keladi: u o'sha nuqtaning aksi, va oldin chiqsa ma'nosi yo'q.
              <g key={'m' + i} opacity={C.also && i > 0 ? grow : 1}>
                <circle cx={PX(m[0], m[1])[0]} cy={PX(m[0], m[1])[1]} r={rDot} fill={T.tip} />
                <text
                  x={PX(m[0], m[1])[0] + (i % 2 ? -fs * 0.5 : fs * 0.5)}
                  /* Toq yorliq bo'linmalar imzosidan PASTGA tushadi: 212 px
                     da u `−2` bilan to'qnashardi (stend 2026-08-15). */
                  y={PX(m[0], m[1])[1] + (i % 2 ? fs * 2.35 : -fs * 0.4)}
                  textAnchor={i % 2 ? 'end' : 'start'}
                  fontFamily={MATH_FONT} fontSize={Math.max(11, fs * 0.9)} fontWeight="700" fill={T.ink2} {...halo(size)}
                >{'(' + fmtTick(m[0]) + '; ' + fmtTick(m[1]) + ')'}</text>
              </g>
            )) : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================================
// TANGENSLAR CHIZIG'I. 12-DARSNING SHOHIDI.
//
// O'ng tomonda vertikal chiziq (`x = 1`). Markazdan chiqqan nur AYLANADAN
// KEYIN ham davom etadi va shu chiziqni kesadi -- kesish balandligi tangens.
//
// NIMA ISBOTLANADI. Nurni yarim aylanaga burasak, aylanadagi nuqta BOSHQA
// bo'ladi (diametral qarama-qarshi), kesish esa O'SHA joyda qoladi. Ya'ni
// tangensning davri yuz sakson, uch yuz oltmish emas. Buni gapirib emas,
// ko'rsatib aytish kerak: `step` 2 da nur aylanib, kesish qimirlamaydi.
//
// `deg` -- boshlang'ich burchak. `step`: 0 chizma, 1 kesish, 2 yarim aylana.
// ============================================================================
export function TanLine({ size = 268, step = 0, deg = 30 }) {
  const turn = useTween(step >= 2 ? deg + 180 : deg, 2200)
  const mark = useTween(step >= 1 ? 1 : 0, 700)
  // Kesish EKRANDAN chiqib ketmasligi kerak: `tg 120` minus bir butun yetti,
  // kamera esa bir butun oltigacha ko'rsatadi -- belgisi ko'rinmay qolardi.
  // Shuning uchun chizishda chegaralanadi, o'lchov esa haqiqiy.
  const tvRaw = Math.tan(rad(deg))
  const tv = Math.max(-1.15, Math.min(1.15, tvRaw))

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.42, y: 0.5, r: 0.3 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const rDot = Math.max(4, R * 0.062)
        const fs = Math.max(11, Math.round(S * 0.05))
        const c = Math.cos(rad(turn))
        const s = Math.sin(rad(turn))
        const [px, py] = P(c, s)
        // Nur chizig'i: markazdan `x = 1` gacha. Burchak yuz sakson dan katta
        // bo'lsa nur ORQAGA cho'ziladi -- kesish o'sha yerda qoladi.
        const [tx, ty] = P(1, tv)
        // TO'LIQ CHIZIQ, nur emas: nuqta chap yarmida bo'lganda kesish o'ng
        // tomonda qoladi, va nurning davomi TESKARI tomonga ketardi -- ko'zga
        // kesish qayerdan chiqqani ko'rinmasdi (stend, 2026-08-14).
        const [ax, ay] = P(-1.18, -1.18 * tv)
        const [ex, ey] = P(1.18, 1.18 * tv)

        return (
          <g>
            <line x1={ox - R * 1.25} y1={oy} x2={ox + R * 1.45} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.25} x2={ox} y2={oy + R * 1.25} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />

            {/* TANGENSLAR CHIZIG'I -- doim ekranda, u o'lchov asbobi. */}
            <line
              x1={P(1, -1.25)[0]} y1={P(1, -1.25)[1]} x2={P(1, 1.25)[0]} y2={P(1, 1.25)[1]}
              stroke={T.ink2} strokeWidth="2"
            />

            {/* NUR: markazdan chetgacha, aylanadan keyin ham davom etadi. */}
            <line x1={ax} y1={ay} x2={ex} y2={ey} stroke={T.accent} strokeWidth="1.6" strokeDasharray="5 4" opacity=".7" />
            <line x1={ox} y1={oy} x2={px} y2={py} stroke={T.accent} strokeWidth="2.4" />
            <circle cx={ox} cy={oy} r={rDot * 0.5} fill={T.ink3} />
            <circle cx={px} cy={py} r={rDot} fill={T.accent} />

            {/* KESISH: burchak o'zgarganda ham SHU yerda qoladi. */}
            <g opacity={mark}>
              <line x1={P(1, 0)[0]} y1={P(1, 0)[1]} x2={tx} y2={ty} stroke={T.ok} strokeWidth="3.4" strokeLinecap="round" />
              <circle cx={tx} cy={ty} r={rDot} fill={T.ok} />
              <text
                x={tx + fs * 0.5} y={ty} dominantBaseline="middle"
                fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={T.ok} {...halo(size)}
              >
                {'tg'}
              </text>
            </g>
          </g>
        )
      }}
    />
  )
}

// ============================================================================
// YO'QOLGAN ILDIZLAR. 13-DARSNING SHOHIDI.
//
// Tenglamani `cos x` ga bo'lish qulay ko'rinadi, lekin `cos x = 0` bo'lgan
// nuqtalar YECHIM edi va bo'lishdan keyin javobda qolmaydi. Buni gap bilan
// aytish foydasiz: o'quvchi «ehtiyot bo'ling» degan gapni eslamaydi. Shuning
// uchun ikkala seriya ekranda YONADI, keyin bo'linish paytida bittasi
// SO'NADI -- va ekranda ko'rinib turadi, nima yo'qolgani.
//
// `keep` -- qoladigan burchaklar, `lost` -- bo'lishda yo'qoladigan.
// `step`: 0 aylana, 1 ikkala guruh yonadi, 2 `lost` so'nadi.
// ============================================================================
export function LostRoots({ size = 268, step = 0, keep = [30, 150], lost = [90, 270] }) {
  const show = useTween(step >= 1 ? 1 : 0, 700)
  const fade = useTween(step >= 2 ? 1 : 0, 900)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.34 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const rDot = Math.max(4, R * 0.066)
        const fs = Math.max(11, Math.round(S * 0.048))
        const dot = (d, tone, op) => {
          const p = P(Math.cos(rad(d)), Math.sin(rad(d)))
          const l = P(Math.cos(rad(d)) * 1.24, Math.sin(rad(d)) * 1.24)
          return (
            <g key={tone + d} opacity={op}>
              <line x1={ox} y1={oy} x2={p[0]} y2={p[1]} stroke={tone} strokeWidth="2" />
              <circle cx={p[0]} cy={p[1]} r={rDot} fill={tone} />
              <text
                x={l[0]} y={l[1]} textAnchor="middle" dominantBaseline="middle"
                fontFamily={MATH_FONT} fontSize={fs} fontWeight="700" fill={tone} {...halo(size)}
              >
                {d + '°'}
              </text>
            </g>
          )
        }

        return (
          <g>
            <line x1={ox - R * 1.2} y1={oy} x2={ox + R * 1.2} y2={oy} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * 1.2} x2={ox} y2={oy + R * 1.2} stroke="rgba(23,26,29,.28)" strokeWidth="1" />
            <circle cx={ox} cy={oy} r={R} fill="none" stroke={T.ink3} strokeWidth="1.5" />
            <circle cx={ox} cy={oy} r={rDot * 0.5} fill={T.ink3} />

            {/* QOLADIGAN seriya -- doim yorqin. */}
            {keep.map((d) => dot(d, T.accent, show))}
            {/* YO'QOLADIGAN seriya -- ikkinchi kadrda so'nadi, lekin o'chmaydi:
                u bor edi, va shuni ko'rish kerak. */}
            {lost.map((d) => dot(d, T.ok, show * (1 - fade * 0.82)))}
          </g>
        )
      }}
    />
  )
}

// ============================================================================
// DARAJALAR POLOSASI. 26-DARSNING SHOHIDI.
//
// NEGA U KERAK. 26-darsning nomi «haqiqiy ko'rsatkichli daraja», ya'ni asosiy
// yangilik shu: ko'rsatkich butun ham, kasr ham, IRRATSIONAL ham bo'lishi
// mumkin. `2^√2` -- son, lekin buni gap bilan aytib bo'lmaydi: o'quvchi yoki
// «bunday son yo'q» deydi, yoki uni `2√2` bilan tenglashtiradi.
//
// SHOHID: polosa TORAYADI.
//   `2^1 = 2` va `2^2 = 4` -- ko'rsatkich bir va ikki orasida, demak qiymat
//   ikki va to'rt orasida. Keyin `2^1,4` va `2^1,5` -- polosa toraydi. Keyin
//   `2^1,41` va `2^1,42` -- polosa yana toraydi, va ichida BITTA son qoladi.
//
// ENG KUCHLI JOYI. `2√2` bu AYNAN `2^1,5`, ya'ni birinchi polosaning O'NG
// CHETI. Polosa keng bo'lganda xato javob uning chetida turadi va to'g'ri
// ko'rinadi; polosa torayganda esa u TASHQARIDA qoladi. Shohid taxminni
// rad etadi, lekin to'g'ri javobni aytmaydi -- etalon §2 shuni talab qiladi.
//
// IKKINCHI REJIM (`mode="squares"`): kvadratlar polosasi. Har son kvadratga
// o'tadi va HAMMASI o'ng yarimda tushadi. Minus to'rt chap yarimda qoladi,
// ya'ni `(−4)^(1/2)` son bermaydi -- shundan `a > 0` talabi chiqadi.
//
// `step`: 0 boshlang'ich polosa, 1 torayadi, 2 oxirgi torayish va yorliqlar.
// ============================================================================
const SQUEEZE = [
  { lo: 1.9, hi: 4.15, band: [2, 4], ticks: [2, 3, 4] },
  { lo: 2.55, hi: 2.95, band: [2.639, 2.8284], ticks: [2.6, 2.7, 2.8, 2.9] },
  { lo: 2.55, hi: 2.95, band: [2.657, 2.6753], ticks: [2.6, 2.7, 2.8, 2.9] },
]

// Chapdagi son -> kvadrati. Hammasi o'ng yarimda tushadi, va shu ko'rinadi.
const SQUARES = [-2, -1, 1, 2]
const SQ_TICKS = [-4, -2, -1, 1, 2, 4]
const SQ_EDGE = 4.7

// ============================================================================
// 5-ASBOB: JOIZ QIYMATLAR POLOSASI. 31-DARSNING SHOHIDI.
//
// NEGA U KERAK. Logarifmik tenglamada begona ildiz «tekshirdim, to'g'ri
// kelmadi» degan marosim emas: u BOSHIDANOQ joiz emas edi. Polosa yozuvning
// TAGIDA turadi va birinchi almashtirishdan OLDIN bo'yaladi -- shunda ildiz
// tushganda uning tashqarida ekani ko'rinadi, aytilmaydi.
//
// `from` -- bo'yalgan qismning chap chekkasi (ochiq nuqta, halqa bilan).
// `roots` -- [{ v, ok }] tushadigan ildizlar: `ok` bo'lsa polosa ichida
// qoladi va yonadi, aks holda so'nadi.
// `step`: 0 bo'sh polosa, 1 bo'yash, 2 ildizlar tushadi.
//
// 32-35-darslarga ham shu polosa ketadi, shuning uchun `hole` bor: polosa
// ICHIDA teshik (kasr tengsizlikda nolga bo'linadigan nuqta).
// ============================================================================
// ISHORALAR LENTASI (33-dars). `signs` berilsa polosa boshqa ishni bajaradi:
// `zeros` o'qni kesadi, `signs` har bo'lakka ishora qo'yadi, `sol` esa JAVOBni
// bo'yaydi. Ishoralar BITTALAB chiqadi (`pick`): kadrda bitta narsa harakat
// qiladi (DINAMIKA_VA_ILLUSTRATSIYA.md §2).
//
// Ishora RANGSIZ, javob esa rangli: aks holda o'quvchi ishorani javobning bir
// qismi deb o'qiydi.
export function DomainBand({
  size = 268, step = 0, lo = -1, hi = 9, from = 0, hole = null,
  roots = [], ticks = [0, 2, 4, 6, 8],
  zeros = [], signs = [], sol = [], pick = 0,
}) {
  const paint = useTween(step >= 1 ? 1 : 0, 900)
  const drop = useTween(step >= 2 ? 1 : 0, 1000)
  const shown = useTween(pick, 700)
  const solT = useTween(sol.length ? 1 : 0, 900)
  const signMode = signs.length > 0 || zeros.length > 0

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.28 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const fs = Math.max(11, Math.round(S * 0.05))
        const rDot = Math.max(4, R * 0.062)
        const V = (v) => P((3 * (v - (lo + hi) / 2)) / (hi - lo), 0)[0]
        const bandH = Math.max(10, R * 0.16)
        const fmt = (v) => String(v).replace('.', ',').replace('-', '−')

        return (
          <g>
            <line x1={V(lo)} y1={oy} x2={V(hi)} y2={oy} stroke={T.ink3} strokeWidth="1.6" />
            {ticks.map((v) => (
              <g key={'t' + v}>
                <line x1={V(v)} y1={oy - 4} x2={V(v)} y2={oy + 4} stroke={T.ink3} strokeWidth="1.2" />
                <text
                  x={V(v)} y={oy + fs * 1.55} textAnchor="middle"
                  fontFamily={MATH_FONT} fontSize={Math.max(10.5, fs * 0.8)} fill={T.ink3} {...halo(size)}
                >{fmt(v)}</text>
              </g>
            ))}

            {/* BO'YALGAN QISM: qayerda yozuv ma'noga ega. */}
            {!signMode ? (
              <g>
                <rect
                  x={V(from)} y={oy - bandH / 2}
                  width={Math.max(2, (V(hi) - V(from)) * paint)} height={bandH}
                  fill={T.ok} opacity={0.34} rx={3}
                />
                {/* Chap chekka OCHIQ: nuqtaning o'zi kirmaydi. */}
                <circle
                  cx={V(from)} cy={oy} r={rDot * 0.72}
                  fill={T.bg} stroke={T.ok} strokeWidth="2" opacity={paint}
                />
                {/* Polosa ICHIDAGI teshik (32-35-darslar uchun). */}
                {hole !== null ? (
                  <circle
                    cx={V(hole)} cy={oy} r={rDot * 0.72}
                    fill={T.bg} stroke={T.ok} strokeWidth="2" opacity={paint}
                  />
                ) : null}
              </g>
            ) : null}

            {/* JAVOB: bo'laklar bo'yaladi, ochiq chekka -- ichi bo'sh doira. */}
            {sol.map((s, i) => (
              <g key={'sol' + i} opacity={solT}>
                <rect
                  x={V(s.from)} y={oy - bandH / 2}
                  width={Math.max(2, (V(s.to) - V(s.from)) * solT)} height={bandH}
                  fill={T.ok} opacity={0.34} rx={3}
                />
                {s.openL !== false && s.from > lo ? (
                  <circle cx={V(s.from)} cy={oy} r={rDot * 0.72} fill={T.bg} stroke={T.ok} strokeWidth="2" />
                ) : null}
                {s.openR !== false && s.to < hi ? (
                  <circle cx={V(s.to)} cy={oy} r={rDot * 0.72} fill={T.bg} stroke={T.ok} strokeWidth="2" />
                ) : null}
              </g>
            ))}

            {/* NOLLAR O'QNI KESADI. Surat noli TO'LDIRILGAN (u javobga kiradi),
                maxraj noli ICHI BO'SH: u yerda yozuv ma'nosini yo'qotadi. */}
            {zeros.map((z) => (
              <g key={'z' + z.v} opacity={paint}>
                <line
                  x1={V(z.v)} y1={oy - bandH * 1.15} x2={V(z.v)} y2={oy + bandH * 1.15}
                  stroke={T.ink3} strokeWidth="1.2" strokeDasharray="3 3"
                />
                <circle
                  cx={V(z.v)} cy={oy} r={rDot * 0.72}
                  fill={z.kind === 'den' ? T.bg : T.ink2}
                  stroke={z.kind === 'den' ? T.ink2 : 'none'} strokeWidth="2"
                />
              </g>
            ))}

            {/* ISHORALAR BITTALAB. Rangsiz: ular javob emas, tekshiruv. */}
            {signs.map((s, i) => {
              const on = Math.max(0, Math.min(1, shown - i))
              const mid = (V(Math.max(s.from, lo)) + V(Math.min(s.to, hi))) / 2
              return (
                <text
                  key={'s' + i} x={mid} y={oy - bandH * 1.5}
                  textAnchor="middle" fontFamily={MATH_FONT} fontSize={fs * 1.15}
                  fontWeight="700" fill={T.ink2} opacity={on} {...halo(size)}
                >{s.sign}</text>
              )
            })}

            {/* ILDIZLAR TUSHADI. Tashqaridagisi so'nadi, lekin O'CHMAYDI:
                u topilgan edi, va shuni ko'rish kerak (13-darsdagi kabi). */}
            {roots.map((r) => {
              const y = oy - bandH * 2.2 * (1 - drop)
              // Tashqaridagi ildiz SO'NADI, lekin o'chmaydi: u topilgan edi,
              // va shuni ko'rish kerak (13-darsdagi so'ngan seriya kabi).
              const on = r.ok ? 1 : 1 - drop * 0.55
              return (
                <g key={'r' + r.v} opacity={step >= 1 ? 1 : 0}>
                  <circle cx={V(r.v)} cy={y} r={rDot} fill={r.ok ? T.accent : T.tip} opacity={on} />
                  <text
                    x={V(r.v)} y={y - fs * 0.9} textAnchor="middle"
                    fontFamily={MATH_FONT} fontSize={fs} fontWeight="700"
                    fill={r.ok ? T.accent : T.tip} opacity={on} {...halo(size)}
                  >{fmt(r.v)}</text>
                </g>
              )
            })}
          </g>
        )
      }}
    />
  )
}

// DARAJA YOZUVI chizmada: asos va KO'TARILGAN ko'rsatkich. `2^√2` ni bitta
// satrda yozib bo'lmaydi -- kichraytirilgan va ko'tarilgan matn kerak.
// Pol 9 px: koeffitsiyent polni TESHIB o'tmasligi kerak (START, grabli).
function Pw({ x, y, base, ex, fs, size, tone }) {
  return (
    <g fontFamily={MATH_FONT} fontWeight="700" fill={tone || T.ink2} {...halo(size)}>
      <text x={x} y={y} textAnchor="middle" fontSize={fs}>{base}</text>
      <text
        x={x + fs * 0.42} y={y - fs * 0.42} textAnchor="start"
        fontSize={Math.max(9, fs * 0.72)}
      >{ex}</text>
    </g>
  )
}

export function PowerBand({ size = 268, step = 0, mode = 'squeeze' }) {
  const sq = mode === 'squares'
  const w = SQUEEZE[Math.min(step, SQUEEZE.length - 1)]
  // Oyna va polosa YUMSHOQ suriladi: sakrash bo'lsa, o'quvchi uchun bu boshqa
  // rasm, va «toraydi» degan gap yolg'on bo'ladi (etalon §5.1).
  const lo = useTween(sq ? -SQ_EDGE : w.lo, 1100)
  const hi = useTween(sq ? SQ_EDGE : w.hi, 1100)
  const bl = useTween(sq ? 0 : w.band[0], 1100)
  const br = useTween(sq ? SQ_EDGE : w.band[1], 1100)
  const fill = useTween(step >= 1 ? 1 : 0, 800)
  const jump = useTween(step >= 1 ? 1 : 0, 1200)
  const late = useTween(step >= 2 ? 1 : 0, 700)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.52, r: 0.27 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const fs = Math.max(11, Math.round(S * 0.05))
        const rDot = Math.max(4, R * 0.062)
        // Qiymat -> chizmadagi nuqta. Oyna kengligi doim uch birlik: shuning
        // uchun torayish MASSHTAB o'zgarishi bo'lib ko'rinadi, silkinish emas.
        const V = (v) => P((3 * (v - (lo + hi) / 2)) / (hi - lo), 0)[0]
        const bandH = Math.max(10, R * 0.15)
        const x1 = V(bl)
        const x2 = V(br)
        const ticks = sq ? SQ_TICKS : w.ticks
        const label = (v) => (sq ? String(v).replace('-', '−') : String(v).replace('.', ','))
        // Oldingi kadrning polosasi XIRA bo'lib qoladi: torayish «shundan
        // SHUNGA» bo'lib o'qiladi, va `2√2` ning o'sha xira chetda turgani
        // ko'rinadi. Almashtirish emas, aynan torayish (etalon §5.1).
        const prev = !sq && step >= 2 ? SQUEEZE[1].band : null

        return (
          <g>
            {/* SON O'QI: hamma kadrda o'sha joyda. */}
            <line x1={V(lo)} y1={oy} x2={V(hi)} y2={oy} stroke={T.ink3} strokeWidth="1.6" />
            {ticks.map((v) => (
              <g key={'t' + v}>
                <line x1={V(v)} y1={oy - 4} x2={V(v)} y2={oy + 4} stroke={T.ink3} strokeWidth="1.2" />
                <text
                  x={V(v)} y={oy + fs * 1.5} textAnchor="middle"
                  fontFamily={MATH_FONT} fontSize={Math.max(10.5, fs * 0.8)} fill={T.ink3} {...halo(size)}
                >{label(v)}</text>
              </g>
            ))}

            {/* OLDINGI polosa xira konturda. */}
            {prev ? (
              <rect
                x={V(prev[0])} y={oy - bandH / 2} width={V(prev[1]) - V(prev[0])} height={bandH}
                fill="none" stroke={T.ok} strokeWidth="1.2" strokeDasharray="4 3" opacity={0.5} rx={3}
              />
            ) : null}

            {/* POLOSA. `squeeze` da u toraydi, `squares` da o'ng yarim to'ladi. */}
            <rect
              x={Math.min(x1, x2)} y={oy - bandH / 2}
              width={Math.max(2, Math.abs(x2 - x1))} height={bandH}
              fill={T.ok} opacity={(sq ? fill : 1) * 0.34} rx={3}
            />
            {!sq ? [x1, x2].map((x, i) => (
              <line
                key={'e' + i} x1={x} y1={oy - bandH * 0.85} x2={x} y2={oy + bandH * 0.85}
                stroke={T.ok} strokeWidth="2"
              />
            )) : null}

            {/* CHETLARNING IMZOSI. Uchinchi kadrda polosa o'n piksel: ikki
                yorliq bir-birining ustiga tushadi va o'qilmaydi (stend
                2026-08-14). Shuning uchun oxirgi kadrda chetlar imzolanmaydi,
                polosa ustida bitta yorliq turadi. */}
            {!sq && step === 0 ? (
              <g>
                <Pw x={x1} y={oy - bandH} base="2" ex="1" fs={fs} size={size} />
                <Pw x={x2} y={oy - bandH} base="2" ex="2" fs={fs} size={size} />
              </g>
            ) : null}
            {!sq && step === 1 ? (
              <g opacity={jump}>
                <Pw x={x1} y={oy - bandH} base="2" ex="1,4" fs={fs} size={size} />
                <Pw x={x2} y={oy - bandH} base="2" ex="1,5" fs={fs} size={size} />
              </g>
            ) : null}

            {/* `2√2` -- xato javob. U `2^1,5` ning o'zi, ya'ni birinchi
                polosaning o'ng cheti; torayganda tashqarida qoladi. Yorliq
                YUQORIDA, ikkinchi qatorda: pastda u `2,8` bo'linmasi bilan
                to'qnashardi. */}
            {!sq && step >= 1 ? (
              <g opacity={jump}>
                <line
                  x1={V(2.8284)} y1={oy - bandH * 3.1} x2={V(2.8284)} y2={oy - bandH * 0.7}
                  stroke={T.ink3} strokeWidth="1.2"
                />
                <text
                  x={V(2.8284)} y={oy - bandH * 3.35} textAnchor="middle"
                  fontFamily={MATH_FONT} fontSize={fs} fontWeight="700"
                  fill={T.ink3} {...halo(size)}
                >{'2√2'}</text>
              </g>
            ) : null}

            {/* Ichida qolgan BITTA son. */}
            {!sq && step >= 2 ? (
              <g opacity={late}>
                <circle cx={V(2.66514)} cy={oy} r={rDot * 0.7} fill={T.accent} />
                <line
                  x1={V(2.66514)} y1={oy - bandH * 1.15} x2={V(2.66514)} y2={oy - bandH * 0.7}
                  stroke={T.accent} strokeWidth="1.2"
                />
                <Pw
                  x={V(2.66514)} y={oy - bandH * 1.25} base="2" ex="√2"
                  fs={fs} size={size} tone={T.accent}
                />
              </g>
            ) : null}

            {/* SQUARES: har son kvadratiga o'tadi, hammasi o'ngda tushadi.
                Nuqtaning YONIDA yozuv yo'q: u bo'linmalar imzosi bilan
                to'qnashardi, va son o'qidan o'qilaveradi. Qaydan kelgani --
                xira halqa va uzuq yoy bilan ko'rinadi. */}
            {sq ? SQUARES.map((v) => {
              const from = V(v)
              const to = V(v * v)
              const at = from + (to - from) * jump
              const arc = 'M ' + from + ' ' + (oy - 2)
                + ' Q ' + (from + to) / 2 + ' ' + (oy - bandH * 2.4)
                + ' ' + to + ' ' + (oy - 2)
              return (
                <g key={'s' + v}>
                  {step >= 1 ? (
                    <g opacity={jump * 0.7}>
                      <path d={arc} fill="none" stroke={T.ink3} strokeWidth="1.2" strokeDasharray="4 3" />
                      <circle cx={from} cy={oy} r={rDot * 0.6} fill="none" stroke={T.ink3} strokeWidth="1.2" />
                    </g>
                  ) : null}
                  <circle cx={at} cy={oy} r={rDot * 0.72} fill={T.accent} />
                </g>
              )
            }) : null}

            {/* Chap yarimda kvadrat YO'Q, va minus to'rt aynan o'sha yerda.
                Imzo takrorlanmaydi: `−4` bo'linmasi o'qning tagida turadi. */}
            {sq && step >= 2 ? (
              <g opacity={late}>
                <circle
                  cx={V(-4)} cy={oy} r={rDot * 1.35} fill="none"
                  stroke={T.tip} strokeWidth="2" strokeDasharray="3 3"
                />
              </g>
            ) : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================================
// PRIBOR 7. MESHOK ISXODOV -- 37-dars, ehtimollik.
//
// `PODXOD_10SINF.md` §10 dagi qaror: ehtimollik uchun ASBOB yasaladi, bir
// martalik dars emas. Bu yerda uning KO'RSATUV qismi: kartochkalar bittalab
// yotqiziladi, qulaylik tug'diruvchilari yoritiladi, ular ostida kasr yig'iladi.
// Interaktiv qismi -- `tools.jsx` dagi `BagPick`.
//
// NEGA KARTOCHKA, NEGA SO'Z EMAS. «Oltita yoq» degan so'z bilan ekrandagi
// oltita kartochka boshqa-boshqa narsa. Darsning butun shohidi ikkinchisida:
// `OR` va `RO` alohida yotganda «isxod uchta» degan xato o'z-o'zidan yiqiladi.
//
// `step`: 0 -- kartochkalar yopiq (orqa tomoni); 1 -- bittalab yotqiziladi;
// 2 -- qulaylik tug'diruvchilari yoritiladi; 3 -- ostida kasr turadi.
// `trials` = { n, hits } -- o'ng tomonda chastota ustuni o'sadi.
// ============================================================================
export function Bag({ size = 268, step = 0, cards = [], trials = null }) {
  // Kartochka yozuvi TILGA bog'liq: gerb va raqam uch tilda uch xil. Shuning
  // uchun `label` `L(...)` bo'lishi ham mumkin, va tarjima shu yerda bo'ladi --
  // dars faylida uchta ro'yxat saqlanmasin.
  const t = useT()
  const lab = (x) => (x && typeof x === 'object' ? t(x) : x)
  const n = cards.length
  const cols = n <= 4 ? 2 : (n <= 9 ? 3 : 4)
  const rows = Math.max(1, Math.ceil(n / cols))
  // Kartochkalar BITTALAB chiqadi: kadrda bitta narsa harakat qiladi.
  const laid = useTween(step >= 1 ? n : 0, 260 * Math.min(n, 8))
  const lit = useTween(step >= 2 ? 1 : 0, 700)
  const frac = useTween(step >= 3 ? 1 : 0, 700)
  const bar = useTween(trials ? 1 : 0, 1100)
  const good = cards.filter((c) => c.good).length

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.46, r: 0.3 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const fs = Math.max(11, Math.round(S * 0.048))
        // Chastota ustuni bo'lsa, to'plam chapga suriladi va o'ng chekka unga qoladi.
        const shift = trials ? -R * 0.42 : 0
        const cellW = (2.55 * R) / cols
        const cellH = Math.min(cellW * 0.78, (1.9 * R) / rows)
        const cw = cellW * 0.86
        const ch = cellH * 0.84
        const topY = oy - (rows * cellH) / 2 - R * 0.18

        return (
          <g>
            {cards.map((c, i) => {
              const on = Math.max(0, Math.min(1, laid - i))
              const col = i % cols
              const row = Math.floor(i / cols)
              const x = ox + shift + (col - (cols - 1) / 2) * cellW - cw / 2
              const y = topY + row * cellH
              const hot = c.good ? lit : 0
              return (
                <g key={c.id || i} opacity={step >= 1 ? on : 1}>
                  <rect
                    x={x} y={y} width={cw} height={ch} rx={Math.max(4, cw * 0.12)}
                    fill={step >= 1 ? T.bg : T.ink3}
                    stroke={c.good ? T.ok : T.ink3}
                    strokeWidth={1.2 + 1.4 * hot}
                    opacity={step >= 1 ? 1 : 0.5}
                  />
                  {/* Yoritish kartochkaning ICHIDA: chekkasi joyida qoladi. */}
                  {c.good ? (
                    <rect
                      x={x} y={y} width={cw} height={ch} rx={Math.max(4, cw * 0.12)}
                      fill={T.ok} opacity={0.26 * hot} stroke="none"
                    />
                  ) : null}
                  {step >= 1 ? (
                    <text
                      x={x + cw / 2} y={y + ch / 2 + fs * 0.36} textAnchor="middle"
                      fontFamily={MATH_FONT} fontSize={fs} fontWeight="700"
                      fill={T.ink2} {...halo(size)}
                    >{lab(c.label)}</text>
                  ) : null}
                </g>
              )
            })}

            {/* KASR: surat -- yoritilganlar, maxraj -- hammasi. */}
            {step >= 3 ? (
              <g opacity={frac} fontFamily={MATH_FONT} fontWeight="700" {...halo(size)}>
                <text
                  x={ox + shift} y={topY + rows * cellH + fs * 1.5}
                  textAnchor="middle" fontSize={fs * 1.05} fill={T.ok}
                >{good}</text>
                <line
                  x1={ox + shift - fs * 0.62} y1={topY + rows * cellH + fs * 1.82}
                  x2={ox + shift + fs * 0.62} y2={topY + rows * cellH + fs * 1.82}
                  stroke={T.ink2} strokeWidth="1.6"
                />
                <text
                  x={ox + shift} y={topY + rows * cellH + fs * 3.0}
                  textAnchor="middle" fontSize={fs * 1.05} fill={T.ink2}
                >{n}</text>
              </g>
            ) : null}

            {/* TAJRIBA USTUNI. Bu -- o'lchov, hisob emas: u kasrning yonida
                turadi va u bilan mos tushishi kerak. */}
            {trials ? (() => {
              const bx = ox + R * 1.28
              const h = 1.7 * R
              const top = oy - h / 2
              const part = trials.n > 0 ? trials.hits / trials.n : 0
              return (
                <g>
                  <rect
                    x={bx - fs * 0.9} y={top} width={fs * 1.8} height={h}
                    fill="none" stroke={T.ink3} strokeWidth="1.2" rx={3}
                  />
                  <rect
                    x={bx - fs * 0.9} y={top + h * (1 - part * bar)}
                    width={fs * 1.8} height={h * part * bar}
                    fill={T.accent} opacity={0.5} rx={3}
                  />
                  <text
                    x={bx} y={top - fs * 0.4} textAnchor="middle"
                    fontFamily={MATH_FONT} fontSize={Math.max(11, fs * 0.92)} fontWeight="700"
                    fill={T.accent} opacity={bar} {...halo(size)}
                  >{String(Math.round(part * 100) / 100).replace('.', ',')}</text>
                  <text
                    x={bx} y={top + h + fs * 1.1} textAnchor="middle"
                    fontFamily={MATH_FONT} fontSize={Math.max(11, fs * 0.78)}
                    fill={T.ink3} opacity={bar} {...halo(size)}
                  >{trials.n}</text>
                </g>
              )
            })() : null}
          </g>
        )
      }}
    />
  )
}

// ============================================================================
// PRIBOR 6A. FAZOVIY SAHNA -- 6-blok (38-43-darslar), keyin 7 va 8-bloklar.
//
// `PODXOD_10SINF.md` §9 dagi qaror (2026-08-06): SVG-proyeksiya, TIK o'q
// atrofida aylanish, ko'rinmas qirralar punktir, WebGL YO'Q. Koordinatalarni
// o'zimiz hisoblaymiz va chiziq bilan chizamiz.
//
// NEGA AYLANISH KERAK. Fazoning yassi rasmi YOLG'ON gapiradi: rasmda kesishgan
// ikki to'g'ri chiziq fazoda ayqash bo'lishi mumkin. O'quvchi sahnani
// burmaguncha buni bilmaydi. Bu noqulaylik emas, fanning mazmuni: geometriyada
// rasmga qarab isbotlanmaydi.
//
// KO'RINMAS QIRRA PUNKTIR. Qavariq jismda eng UZOQDAGI uch bitta bo'ladi, va
// undan chiqadigan uchta qirra ko'rinmaydi. Punktir bo'lmasa, karkas ag'darilib
// ko'rinadi va aylanish yordam berish o'rniga chalg'itadi.
// ============================================================================
const PITCH = 0.46 // ~26 daraja: kichik bo'lsa karkas yassilashadi, katta bo'lsa ustidan qaraladi

const rot3 = (p, yaw) => {
  const c = Math.cos(yaw)
  const s = Math.sin(yaw)
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]
}
// Ekranga tushirish: `x` -- o'ngga, `y` -- yuqoriga, `d` -- KO'ZDAN uzoqlik.
//
// KAMERA OG'ISHI kadrga berilishi mumkin, va bu qulaylik emas. 26 daraja
// og'ishda pastki yoq qirrasi va yuqorigi yoq qirrasi ekranda HECH QACHON
// kesishmaydi: balandlikdagi farq chuqurlikdagi siljishni har doim bosadi.
// Shart oddiy -- kotangens og'ish ikkitaning ildizidan katta bo'lmasligi
// kerak, ya'ni og'ish 35 darajadan katta. 39-darsning aldovi aynan shunga
// qoqilgan edi: matn «qirralar tutashdi» deyardi, chizmada esa ular hech qachon
// tutashmasdi (metodist ko'rdi, 2026-08-20). 40 darajada esa o'sha juftlik
// haqiqatan kesishadi, va burilish aldovni oladi.
const flat = (p, yaw, pitch = PITCH) => {
  const q = rot3(p, yaw)
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  return { x: q[0], y: q[2] * cp - q[1] * sp, d: q[1] * cp + q[2] * sp }
}
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k]
const norm3 = (a) => {
  const l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) || 1
  return mul3(a, 1 / l)
}
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross3 = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
// Rodrig formulasi: `w` ni `ax` o'qi atrofida `phi` ga burish.
const spinAround = (w, ax, phi) => {
  const c = Math.cos(phi)
  const s = Math.sin(phi)
  const dot = ax[0] * w[0] + ax[1] * w[1] + ax[2] * w[2]
  return add3(add3(mul3(w, c), mul3(cross3(ax, w), s)), mul3(ax, dot * (1 - c)))
}

// KUB -- darslikning o'z sahnasi (geom. 95-bet, 2-rasm). Uchlari nomlangan.
const CUBE_V = {
  A: [-0.5, -0.5, -0.5], B: [0.5, -0.5, -0.5], C: [0.5, 0.5, -0.5], D: [-0.5, 0.5, -0.5],
  A1: [-0.5, -0.5, 0.5], B1: [0.5, -0.5, 0.5], C1: [0.5, 0.5, 0.5], D1: [-0.5, 0.5, 0.5],
}
const CUBE_E = [
  ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
  ['A1', 'B1'], ['B1', 'C1'], ['C1', 'D1'], ['D1', 'A1'],
  ['A', 'A1'], ['B', 'B1'], ['C', 'C1'], ['D', 'D1'],
]
const SUB1 = { A1: 'A₁', B1: 'B₁', C1: 'C₁', D1: 'D₁' }
// Ustki asos uchlari darslikda pastki indeks bilan yoziladi: `A₁`, `B₁` va
// hokazo. Kub uchun ular qo'lda yozilgan, ko'pyoq uchun esa hisoblanadi.
const subOf = (id) => (SUB1[id] || (/1$/.test(id) ? id.replace(/1$/, '₁') : id))

// ============================================================================
// PRIBOR 6B. KO'PYOQ: PRIZMA VA PIRAMIDA -- 7-blok (44-49-darslar).
//
// NEGA GENERATOR, HAR DARSDA QO'LDA EMAS. Blok 7 da bir xil jism uch darsda
// uch xil ko'rinishda kerak: uchburchakli va to'rtburchakli prizma, og'ma
// prizma, parallelepiped, muntazam piramida. Ularning uchlarini qo'lda yozish
// -- bu 44-darsda bitta xato koordinata va butun blok bo'ylab ko'chib yuruvchi
// nuqson. Generator uchlarni DARSLIKDAGIDEK nomlaydi: asos `A B C ...`, ustki
// asos `A₁ B₁ C₁ ...`, piramidaning uchi `S` (geom. 44-45-bet).
//
// `skew` og'ma prizmani beradi (ustki asos siljiydi), piramidada esa uchning
// asos markazidan siljishini beradi: muntazam piramidada u nol.
// `plan` -- asosning O'Z ko'pburchagi: [[x, y], ...]. Aylana bo'yicha yasalgan
// asos muntazam ko'pburchak beradi, 45-darsda esa parallelogramm, to'g'ri
// to'rtburchak va kvadratni FARQLASH kerak, ya'ni asos qo'lda beriladi.
const polyBuild = ({ kind = 'prism', n = 4, h = 1, skew = [0, 0], r = 0.62, turn = 0, plan = null }) => {
  const NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const V = {}
  const E = []
  const base = []
  const count = plan ? plan.length : n
  for (let i = 0; i < count; i += 1) {
    const id = NAMES[i]
    if (plan) {
      V[id] = [plan[i][0], plan[i][1], -h / 2]
    } else {
      const t = turn + (i / n) * Math.PI * 2
      V[id] = [r * Math.cos(t), r * Math.sin(t), -h / 2]
    }
    base.push(id)
  }
  base.forEach((id, i) => E.push([id, base[(i + 1) % base.length]]))
  if (kind === 'pyramid') {
    V.S = [skew[0], skew[1], h / 2]
    base.forEach((id) => E.push([id, 'S']))
    return { V, E, base, top: ['S'] }
  }
  const top = base.map((id) => id + '1')
  base.forEach((id, i) => {
    V[top[i]] = [V[id][0] + skew[0], V[id][1] + skew[1], h / 2]
    E.push([id, top[i]])
  })
  top.forEach((id, i) => E.push([id, top[(i + 1) % top.length]]))
  return { V, E, base, top }
}

// `hide` -- shu KADRDA chizilmaydigan nuqtalar. Nuqta ro'yxati darsda bitta
// bo'ladi (kesmalar va tekisliklar unga id bilan murojaat qiladi), lekin har
// kadrga ularning hammasi kerak emas: 40-darsning 3-ekranida savol O, Q va M
// haqida, ekranda esa yana P va nomsiz ikki nuqta turardi -- o'quvchi qizil
// chiziqning uchini P deb o'qishi mumkin (metodist ko'rdi, 2026-08-20).
// ============================================================================
// PRIBOR 6B, YOYILMA. Jism yassi shaklga yoyiladi va sirt yuzasi yassi
// bo'laklar yuzalarining yig'indisiga aylanadi (geom. 59-61-bet).
//
// NEGA PROYEKSIYA YO'Q. Yoyilma -- YASSI shakl, uni burish ma'nosizdir: uning
// butun mazmuni shundaki, u qog'ozda yotadi va o'lchanadi. Shu sababli bu yerda
// kamera ham, `flat` ham ishlatilmaydi.
//
// BO'LAKLAR BITTALAB ochiladi (`step`), va `lit` bilan bittasi yoritiladi --
// darsda u jismdagi o'sha yoq bilan bir rangda bo'ladi, ya'ni o'quvchi yoq va
// bo'lakni ko'zi bilan ulaydi.
// ============================================================================
export function Net({
  size = 268, step = 0, kind = 'prism', n = 4,
  a = 1, h = 1.3, m = 1.2, lit = null,
}) {
  const show = useTween(step >= 1 ? 1 : 0, 700)
  const open = useTween(Math.min(step, 3), 900)

  // Bo'laklar NET birligida yasaladi, keyin kadrga siqiladi.
  //
  // ASOS n BURCHAKLI bo'lishi kerak: 48-darsda muntazam oltiburchakli prizma va
  // piramida bor, va kvadrat asos u yerda yolg'on gapiradi. Ko'pburchak berilgan
  // TOMON bo'ylab yurish bilan yasaladi: har qadamda yo'nalish tashqi burchakka
  // buriladi, va shakl o'zi yopiladi.
  // `turnSign` -- burilish tomoni. Ikkinchi asos tasmaning USTIGA ketishi kerak,
  // birinchisi esa OSTIGA; bir xil ishorada ular ustma-ust tushadi (stendda
  // ko'rindi, 2026-08-21).
  const walk = (p0, p1, count, side, turnSign) => {
    const out = [p0, p1]
    let dx = p1[0] - p0[0]
    let dy = p1[1] - p0[1]
    const len = Math.hypot(dx, dy) || 1
    dx /= len
    dy /= len
    const ang = turnSign * 2 * Math.PI / count
    const c = Math.cos(ang)
    const sn = Math.sin(ang)
    for (let i = 2; i < count; i += 1) {
      const nx = dx * c - dy * sn
      const ny = dx * sn + dy * c
      dx = nx
      dy = ny
      const last = out[out.length - 1]
      out.push([last[0] + dx * side, last[1] + dy * side])
    }
    return out
  }

  const pieces = []
  if (kind === 'prism') {
    for (let i = 0; i < n; i += 1) {
      pieces.push({
        id: 'lat' + i,
        kind: 'lat',
        pts: [[i * a, 0], [(i + 1) * a, 0], [(i + 1) * a, h], [i * a, h]],
      })
    }
    // Asoslar birinchi to'rtburchakning ostida va ustida, ikkalasi ham n burchak.
    pieces.push({ id: 'base0', kind: 'base', pts: walk([a, 0], [0, 0], n, a, 1) })
    pieces.push({ id: 'base1', kind: 'base', pts: walk([0, h], [a, h], n, a, 1) })
  } else {
    // Piramida: markazda muntazam n burchak, har tomonda tashqariga uchburchak.
    const R = a / (2 * Math.sin(Math.PI / n))
    const base = []
    for (let i = 0; i < n; i += 1) {
      const t = (i / n) * Math.PI * 2 + Math.PI / n
      base.push([R * Math.cos(t), R * Math.sin(t)])
    }
    pieces.push({ id: 'base0', kind: 'base', pts: base })
    for (let i = 0; i < n; i += 1) {
      const p1 = base[i]
      const p2 = base[(i + 1) % n]
      const mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
      const nl = Math.hypot(mid[0], mid[1]) || 1
      const apex = [mid[0] + (mid[0] / nl) * m, mid[1] + (mid[1] / nl) * m]
      pieces.push({ id: 'lat' + i, kind: 'lat', pts: [p1, p2, apex] })
    }
  }

  const xs = pieces.flatMap((q) => q.pts.map((t) => t[0]))
  const ys = pieces.flatMap((q) => q.pts.map((t) => t[1]))
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const pad = size * 0.09
  const k = Math.min((size - 2 * pad) / (maxX - minX), (size - 2 * pad) / (maxY - minY))
  const ox = (size - (maxX - minX) * k) / 2
  const oy = (size - (maxY - minY) * k) / 2
  const X = (t) => ox + (t[0] - minX) * k
  const Y = (t) => size - (oy + (t[1] - minY) * k)

  // Asos birinchi ochiladi, yon bo'laklar keyin: darslikdagi tartib
  // (59-bet, yoyilmani qog'ozdan yasash). Qoida oddiy bo'lishi kerak, aks holda
  // qaysi bo'lak qachon ochilgani prognonda tushunarsiz bo'ladi.
  const ready = (q) => (q.kind === 'base' ? open >= 1 : open >= 2)

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`} width="100%"
      style={{ display: 'block', maxWidth: size, margin: '0 auto' }}
      className="g10-net"
    >
      <g opacity={show}>
        {pieces.map((q, i) => {
          const on = ready(q)
          const isLit = lit === q.id
          return (
            <polygon
              key={q.id}
              points={q.pts.map((t) => `${X(t)},${Y(t)}`).join(' ')}
              fill={isLit ? T.accent : (q.kind === 'base' ? T.ok : '#6b8fa3')}
              opacity={on ? (isLit ? 0.42 : 0.22) : 0}
              stroke={isLit ? T.accent : (q.kind === 'base' ? T.ok : '#6b8fa3')}
              strokeWidth={isLit ? 2.4 : 1.4}
              style={{ transition: 'opacity .5s ease' }}
            />
          )
        })}
      </g>
    </svg>
  )
}

export function Space({
  size = 268, step = 0, yaw = 0,
  cube = false, pts = [], segs = [], planes = [], angleAt = null, hi = [], hide = [],
  arcAt = null, poly = null, faces = [], pitch = PITCH,
  cuts = [], meets = [], cut = null,
}) {
  // Aylanish YUMSHOQ: sakrash bo'lsa, bu bir sahnaning burilishi emas, ikki
  // boshqa rasm (DINAMIKA_VA_ILLUSTRATSIYA.md §2).
  const a = useTween(yaw, 900)
  // TEKISLIKNING to'g'ri chiziq atrofidagi burilishi ham yumshoq bo'lishi
  // kerak, va shu qoida unga ilgari yetib bormagan edi: `phi` to'g'ridan
  // to'g'ri qurilishga ketardi, ya'ni tekislik bir holatdan ikkinchisiga
  // SAKRARDI -- bu esa harakat emas, almashtirish (etalon §5.1).
  //
  // HAR TEKISLIKNING O'Z BURCHAGI. Ilgari bu yerda bitta umumiy `phi` turardi
  // («sahnada burilayotgan tekislik bittadan ko'p bo'lmaydi»), va bu 43-darsda
  // yiqilardi: ikki yoqli burchak -- umumiy qirrali IKKI yarimtekislik, va
  // umumiy burchak ularni bir-birining ustiga yopishtirib qo'yardi. Huklar soni
  // QAT'IY bo'lishi kerak, shuning uchun uchta: bir sahnada uchtadan ko'p
  // burilayotgan tekislik bo'lmaydi.
  const phiOf = (i) => (planes[i] && planes[i].around ? (planes[i].phi || 0) : 0)
  const phi0 = useTween(phiOf(0), 900)
  const phi1 = useTween(phiOf(1), 900)
  const phi2 = useTween(phiOf(2), 900)
  const phiAt = (i) => {
    if (i === 0) return phi0
    if (i === 1) return phi1
    if (i === 2) return phi2
    return phiOf(i)
  }
  const show = useTween(step >= 1 ? 1 : 0, 700)

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.34 }]}
      draw={({ P, R, size: S }) => {
        const fs = Math.max(11, Math.round(S * 0.05))
        const BODY = poly ? polyBuild(poly) : null
        const V = Object.assign({}, cube ? CUBE_V : {}, BODY ? BODY.V : {})
        pts.forEach((p) => { V[p.id] = p.at })

        // KESIM UCHLARI FAQAT QIRRALARDA yotadi (geom. 68-bet, izlar usulining
        // qoidalari). Shuning uchun nuqta koordinata bilan emas, QIRRA va
        // undagi ulush bilan beriladi: sahna burilganda nuqta qirradan uzilib
        // ketmaydi, va chizma yolg'on gapirmaydi.
        cuts.forEach((c) => {
          const p1 = V[c.on[0]]
          const p2 = V[c.on[1]]
          if (!p1 || !p2) return
          V[c.id] = add3(p1, mul3(sub3(p2, p1), c.t === undefined ? 0.5 : c.t))
        })

        // IZLAR USULI ikki chiziqning KESISHISH nuqtasini talab qiladi: LM va
        // AC ni davom ettirib X topiladi (geom. 65-bet). Nuqta hisoblanadi,
        // ko'z bilan qo'yilmaydi -- aks holda burilishda u chiziqlardan
        // qochadi. Bir tekislikda yotgan chiziqlar uchun yechim aniq; ayqash
        // holatda eng yaqin nuqta olinadi, va bu darsda uchramaydi.
        meets.forEach((m) => {
          const a1 = V[m.a[0]]
          const a2 = V[m.a[1]]
          const b1 = V[m.b[0]]
          const b2 = V[m.b[1]]
          if (!a1 || !a2 || !b1 || !b2) return
          const u = sub3(a2, a1)
          const v = sub3(b2, b1)
          const w = sub3(b1, a1)
          const uu = dot3(u, u)
          const vv = dot3(v, v)
          const uv = dot3(u, v)
          const det = uu * vv - uv * uv
          if (Math.abs(det) < 1e-9) return
          const t = (dot3(w, u) * vv - dot3(w, v) * uv) / det
          V[m.id] = add3(a1, mul3(u, t))
        })

        const F = {}
        Object.keys(V).forEach((k) => { F[k] = flat(V[k], a, pitch) })
        const XY = (k) => P(F[k].x, F[k].y)

        // Eng uzoqdagi uch: undan chiqadigan qirralar KO'RINMAYDI. Qoida
        // kubda ham, generator bergan ko'pyoqda ham bir xil: qavariq jismda
        // eng uzoq uch bitta.
        let far = null
        const bodyKeys = cube ? Object.keys(CUBE_V) : (BODY ? Object.keys(BODY.V) : [])
        bodyKeys.forEach((k) => { if (!far || F[k].d > F[far].d) far = k })

        const line = (k1, k2, opt) => {
          const [x1, y1] = XY(k1)
          const [x2, y2] = XY(k2)
          const hidden = opt && opt.hidden
          return (
            <line
              key={(opt && opt.key) || (k1 + k2)}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={(opt && opt.tone) || T.ink3}
              strokeWidth={(opt && opt.w) || 1.6}
              strokeDasharray={hidden ? '5 4' : undefined}
              /* YORITILGAN qirra ko'rinmas bo'lsa ham och bo'lib qolmaydi:
                 punktir uning orqada ekanini aytadi, xiralik esa uni yo'q
                 qiladi. 39-darsda juftlikning ikkinchisi shu sababli topilmay
                 turardi (metodist ko'rdi, 2026-08-20). */
              opacity={hidden ? (opt && opt.lit ? 0.9 : 0.55) : 1}
              strokeLinecap="round"
            />
          )
        }

        // TEKISLIK -- parallelogramm. Uch nuqta bilan yoki to'g'ri chiziq
        // atrofida burilib beriladi (38-darsning shohidi).
        const planeQuad = (pl, pi) => {
          let o
          let u
          let v
          if (pl.around) {
            const p1 = V[pl.around[0]]
            const p2 = V[pl.around[1]]
            const ax = norm3(sub3(p2, p1))
            const any = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
            const w0 = norm3(cross3(ax, any))
            // Kattaligi kadrdan CHIQMASLIGI kerak: stendda 1,15 da o'ng chekka
            // kesilib qolgan edi.
            o = mul3(add3(p1, p2), 0.5)
            u = mul3(ax, 0.85)
            v = mul3(spinAround(w0, ax, phiAt(pi)), 0.72)
          } else {
            const p1 = V[pl.by[0]]
            const p2 = V[pl.by[1]]
            const p3 = V[pl.by[2]]
            o = mul3(add3(add3(p1, p2), p3), 1 / 3)
            u = mul3(sub3(p2, p1), 0.95)
            v = mul3(sub3(p3, p1), 0.95)
          }
          // YARIM tekislik: qirradan FAQAT bir tomonga ketadi. Ikki yoqli
          // burchak ta'rifi yarimtekisliklar haqida (geom. 142-bet), va to'liq
          // tekislik u yerda boshqa shakl bo'lib qoladi. `half` ishorasi qaysi
          // tomon ekanini aytadi.
          const w = pl.half ? mul3(v, pl.half * 1.4) : null
          const corner = w ? [
            add3(o, mul3(u, -1)), add3(o, u),
            add3(add3(o, u), w), add3(add3(o, mul3(u, -1)), w),
          ] : [
            add3(add3(o, mul3(u, -1)), mul3(v, -1)), add3(add3(o, u), mul3(v, -1)),
            add3(add3(o, u), v), add3(add3(o, mul3(u, -1)), v),
          ]
          return corner.map((c) => {
            const f = flat(c, a, pitch)
            return P(f.x, f.y).join(',')
          }).join(' ')
        }

        // AYLANISH O'QI. Tekislik to'g'ri chiziq atrofida burilsa, o'sha chiziq
        // chizmada BO'LISHI kerak: 38-darsning 4-ekranida u yo'q edi, va
        // o'quvchiga «tekislik to'g'ri chiziq atrofida aylanadi» deyilardi,
        // chiziqning o'zi esa faqat uchta nuqta bilan ishora qilinardi
        // (metodist ko'rdi, 2026-08-20). Chekkalardan chiqib turadi: kesma emas,
        // TO'G'RI CHIZIQ ko'rinishi kerak.
        const axisEnds = (pl) => {
          const p1 = V[pl.around[0]]
          const p2 = V[pl.around[1]]
          const d = sub3(p2, p1)
          const f1 = flat(add3(p1, mul3(d, -0.2)), a, pitch)
          const f2 = flat(add3(p1, mul3(d, 1.2)), a, pitch)
          return [P(f1.x, f1.y), P(f2.x, f2.y)]
        }

        return (
          <g opacity={show}>
            {/* TEKISLIKLAR birinchi: ular fon, ustidan chiziq va nuqta yotadi. */}
            {planes.map((pl, i) => (
              <polygon
                key={'pl' + i}
                points={planeQuad(pl, i)}
                fill={pl.tone || T.ok}
                opacity={pl.dim ? 0.14 : 0.22}
                stroke={pl.tone || T.ok}
                strokeWidth="1.2"
              />
            ))}

            {/* YOQLAR -- to'ldirilgan ko'pburchaklar. Blok 7 ning butun mazmuni
                yoqlar haqida: asos yon yoqqa qarshi, yoyilma, kesim. Tekislik
                uch nuqta bilan quriladi va yoq bo'lolmaydi, shuning uchun bu
                alohida. Qirralardan OLDIN chiziladi: ular fon. */}
            {faces.map((fc, i) => (
              <polygon
                key={'fc' + i}
                points={fc.by.map((k) => XY(k).join(',')).join(' ')}
                fill={fc.tone || T.ok}
                opacity={fc.dim ? 0.16 : 0.3}
                stroke={fc.tone || T.ok}
                strokeWidth="1.2"
              />
            ))}

            {planes.map((pl, i) => {
              if (!pl.around || pl.axis === false) return null
              const [q1, q2] = axisEnds(pl)
              return (
                <line
                  key={'ax' + i}
                  x1={q1[0]} y1={q1[1]} x2={q2[0]} y2={q2[1]}
                  stroke={T.ink2} strokeWidth="2.2" strokeLinecap="round"
                />
              )
            })}

            {cube ? CUBE_E.map((e) => line(e[0], e[1], {
              hidden: e[0] === far || e[1] === far,
              lit: hi.indexOf(e.join('')) !== -1,
              tone: hi.indexOf(e.join('')) !== -1 ? T.accent : T.ink3,
              w: hi.indexOf(e.join('')) !== -1 ? 3 : 1.6,
            })) : null}

            {BODY ? BODY.E.map((e) => line(e[0], e[1], {
              key: 'be' + e[0] + e[1],
              hidden: e[0] === far || e[1] === far,
              lit: hi.indexOf(e.join('')) !== -1,
              tone: hi.indexOf(e.join('')) !== -1 ? T.accent : T.ink3,
              w: hi.indexOf(e.join('')) !== -1 ? 3 : 1.6,
            })) : null}

            {segs.map((sg, i) => line(sg.from, sg.to, {
              key: 'sg' + i, tone: sg.tone || T.accent, w: sg.w || 2.6, hidden: sg.hidden,
            }))}

            {/* KESIM -- ko'pburchak. Qirralardan KEYIN chiziladi: uning konturi
                jismning ustida o'qilishi kerak, aks holda kesim yoq bo'lib
                ko'rinadi. To'g'ri va NOTO'G'RI kesim bitta asbob bilan
                chiziladi: xato -- nuqtalarni ULASH TARTIBIDA, va uni boshqa
                figura bilan ko'rsatish xatoni yashirish bo'lardi (49-dars). */}
            {cut ? (
              <polygon
                points={cut.by.map((k) => XY(k).join(',')).join(' ')}
                fill={cut.tone || T.tip}
                opacity={cut.dim ? 0.2 : 0.34}
                stroke={cut.tone || T.tip}
                strokeWidth={cut.w || 2.6}
                strokeLinejoin="round"
              />
            ) : null}

            {/* TO'G'RI BURCHAK BELGISI -- kichik kvadrat, uchida.
                BELGI BITTA EMAS, BIR NECHTA bo'lishi mumkin: uch perpendikulyar
                haqidagi teoremada ikki to'g'ri burchak BIR VAQTDA turadi, va
                ikkinchisi paydo bo'lishi darsning butun mazmuni (41-dars).
                Bitta obyekt ham qabul qilinadi -- 38-40-darslar shunday beradi. */}
            {(angleAt ? [].concat(angleAt) : []).map((mark, mi) => {
              const [ox, oy] = XY(mark.at)
              const [ax1, ay1] = XY(mark.from)
              const [ax2, ay2] = XY(mark.to)
              // IKKI BELGI BIR UCHDA umumiy nurga ega bo'ladi (uch perpendikulyar
              // haqidagi teorema), va bir xil o'lchamda ular ustma-ust tushadi.
              // `scale` bilan ikkinchisi kattaroq chiziladi va ikkalasi
              // o'qiladi -- ichma-ich ikki kvadrat.
              const k = Math.max(9, R * 0.11) * (mark.scale || 1)
              const u1 = [(ax1 - ox), (ay1 - oy)]
              const u2 = [(ax2 - ox), (ay2 - oy)]
              const n1 = Math.hypot(u1[0], u1[1]) || 1
              const n2 = Math.hypot(u2[0], u2[1]) || 1
              const q1 = [ox + (u1[0] / n1) * k, oy + (u1[1] / n1) * k]
              const q2 = [ox + (u2[0] / n2) * k, oy + (u2[1] / n2) * k]
              const q3 = [q1[0] + q2[0] - ox, q1[1] + q2[1] - oy]
              return (
                <polyline
                  key={'ang' + mi}
                  points={q1.join(',') + ' ' + q3.join(',') + ' ' + q2.join(',')}
                  fill="none" stroke={mark.tone || T.tip} strokeWidth="1.8"
                />
              )
            })}

            {/* BURCHAK DUGASI podpis bilan. To'g'ri burchak kvadrat bilan
                belgilanadi, qolgan burchaklar esa dugani talab qiladi: 42-darsda
                og'ma va uning proyeksiyasi orasidagi burchak ko'rsatiladi.

                MUHIM. Duga burchak QAYERDA ekanini ko'rsatadi, uning KATTALIGINI
                emas: proyeksiya burchakni buzadi, va ekrandan gradus o'lchab
                bo'lmaydi. Shuning uchun darsda son hisoblanadi, chizmadan
                o'qilmaydi (etalon: «o'lchadim degani isbotladim emas»). */}
            {(arcAt ? [].concat(arcAt) : []).map((arc, ai) => {
              const [ox, oy] = XY(arc.at)
              const [x1, y1] = XY(arc.from)
              const [x2, y2] = XY(arc.to)
              const rr = Math.max(15, R * 0.19) * (arc.scale || 1)
              const unit = (dx, dy) => {
                const n = Math.hypot(dx, dy) || 1
                return [dx / n, dy / n]
              }
              const u1 = unit(x1 - ox, y1 - oy)
              const u2 = unit(x2 - ox, y2 - oy)
              const q1 = [ox + u1[0] * rr, oy + u1[1] * rr]
              const q2 = [ox + u2[0] * rr, oy + u2[1] * rr]
              const sweep = (u1[0] * u2[1] - u1[1] * u2[0]) > 0 ? 1 : 0
              const bis = unit(u1[0] + u2[0], u1[1] + u2[1])
              const tone = arc.tone || T.accent
              return (
                <g key={'arc' + ai}>
                  <path
                    d={`M ${q1[0]} ${q1[1]} A ${rr} ${rr} 0 0 ${sweep} ${q2[0]} ${q2[1]}`}
                    fill="none" stroke={tone} strokeWidth="2"
                  />
                  {arc.label ? (
                    <text
                      x={ox + bis[0] * (rr + fs * 1.05)}
                      y={oy + bis[1] * (rr + fs * 1.05) + fs * 0.32}
                      textAnchor="middle"
                      fontFamily={MATH_FONT} fontSize={Math.max(12, fs * 0.95)}
                      fontWeight="700" fill={tone} {...halo(size)}
                    >{arc.label}</text>
                  ) : null}
                </g>
              )
            })}

            {Object.keys(V).filter((k) => hide.indexOf(k) === -1).map((k) => {
              // KESIM UCHI YORLIQSIZ ham bo'ladi: yettiburchakda yetti harf
              // chizmani yopib qo'yadi, nuqtalarning O'ZI esa tomonlarni sanash
              // uchun kerak. Bo'sh `label` -- nuqta bor, harf yo'q.
              const own = pts.concat(cuts).find((q) => q.id === k) || {}
              const [x, y] = XY(k)
              const lbl = own.label === undefined ? subOf(k) : own.label
              return (
                <g key={'v' + k}>
                  <circle cx={x} cy={y} r={Math.max(3, R * 0.035)} fill={T.ink2} />
                  {lbl && (cube || BODY || own.label) ? (
                    <text
                      x={x + fs * 0.5} y={y - fs * 0.35}
                      fontFamily={MATH_FONT} fontSize={Math.max(11, fs * 0.82)}
                      fontWeight="700" fill={T.ink2} {...halo(size)}
                    >{lbl}</text>
                  ) : null}
                </g>
              )
            })}
          </g>
        )
      }}
    />
  )
}

// ============================================================================
// IKKI TO'G'RI CHIZIQ. 25-dars: sistemaning yechimi ikki chiziqning UMUMIY
// nuqtasi. Asbob shu qarorni ko'rsatadi va bitta savolga javob beradi:
// umumiy nuqta bormi.
//
// NEGA YANGI FIGURA. `Plane` bitta egri chiziq chizadi, bu yerda esa IKKITA
// to'g'ri chiziq kerak, va gap ularning bir-biriga nisbatida. Ikkita `Plane`
// qo'yish ikkita o'q beradi -- boshqa rasm, boshqa savol.
//
// SHOHID: og'ish bir xil bo'lsa, chiziqlar orasidagi TIK masofa hamma joyda
// bir xil. U uchta joyda o'lchanadi va uchalasi teng chiqadi -- «uchrashmaydi»
// shundan ko'rinadi, o'qituvchi aytgani uchun emas.
//
// Kadrlar: 0 -- faqat birinchi chiziq; 1 -- ikkinchisi paydo bo'ladi;
// 2 -- xulosa (og'ish teng bo'lsa tik masofalar, boshqa bo'lsa kesishish nuqtasi).
// ============================================================================
export function TwoLines({
  size = 268, step = 0,
  k1 = 0.5, b1 = -3, k2 = 0.5, b2 = 2,
  // Bir matematik birlik radiusning qanchasini oladi. Ikkala o'qda BIR XIL:
  // aks holda og'ish yolg'on ko'rinadi va «parallel» ko'z bilan tekshirilmaydi.
  u = 0.15,
  gapsAt = [-4, 0, 4],
  // 8-DARS: `y = x` ko'zgusi va juftlik nuqtasi. `mirror` punktir chiziqni
  // qo'yadi, `pairAt` esa birinchi chiziqdagi nuqtani va uning ko'zgudagi
  // juftligini ko'rsatadi -- teskari funksiyaning grafigi shu juftliklardan
  // yig'iladi (darslik 39-bet, 4-rasm).
  mirror = false,
  pairAt = null,
}) {
  const grow = useTween(step >= 1 ? 1 : 0, 1400)
  const mark = useTween(step >= 2 ? 1 : 0, 700)
  const same = Math.abs(k1 - k2) < 1e-9

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.52, r: 0.4 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const LIM = 1.13
        const fs = Math.max(11, Math.round(S * 0.05))
        // Chiziqning kadr ICHIDAGI bo'lagi: chetlari `y` bo'yicha ham
        // qirqiladi, aks holda chiziq kartochkadan chiqib ketadi.
        const seg = (k, b) => {
          const xs = []
          const N = 160
          for (let i = 0; i <= N; i += 1) {
            const x = (-LIM + (2 * LIM * i) / N) / u
            const y = k * x + b
            if (Math.abs(y * u) <= LIM) xs.push([x, y])
          }
          return xs
        }
        const path = (pts, t) => {
          const n = Math.max(2, Math.round(pts.length * t))
          return pts.slice(0, n).map((q, i) => (i ? 'L' : 'M') + P(q[0] * u, q[1] * u).join(' ')).join(' ')
        }
        const A = seg(k1, b1)
        const B = seg(k2, b2)
        const tick = (v) => String(v).replace('-', '−')
        const cross = same ? null : [(b2 - b1) / (k1 - k2), 0]
        if (cross) cross[1] = k1 * cross[0] + b1

        return (
          <g>
            <line x1={ox - R * LIM} y1={oy} x2={ox + R * LIM} y2={oy} stroke="rgba(23,26,29,.32)" strokeWidth="1" />
            <line x1={ox} y1={oy - R * LIM} x2={ox} y2={oy + R * LIM} stroke="rgba(23,26,29,.32)" strokeWidth="1" />

            {[-6, -4, -2, 2, 4, 6].filter((v) => Math.abs(v * u) < LIM - 0.04).map((v) => {
              const p0 = P(v * u, 0)
              return (
                <g key={'x' + v}>
                  <line x1={p0[0]} y1={p0[1] - 3} x2={p0[0]} y2={p0[1] + 3} stroke="rgba(23,26,29,.4)" strokeWidth="1" />
                  <text x={p0[0]} y={p0[1] + fs + 4} fontSize={fs} textAnchor="middle" fill={T.ink3}>{tick(v)}</text>
                </g>
              )
            })}
            {[-4, -2, 2, 4].filter((v) => Math.abs(v * u) < LIM - 0.04).map((v) => {
              const p0 = P(0, v * u)
              return (
                <g key={'y' + v}>
                  <line x1={p0[0] - 3} y1={p0[1]} x2={p0[0] + 3} y2={p0[1]} stroke="rgba(23,26,29,.4)" strokeWidth="1" />
                  <text x={p0[0] - 6} y={p0[1] + fs * 0.36} fontSize={fs} textAnchor="end" fill={T.ink3}>{tick(v)}</text>
                </g>
              )
            })}

            {mirror ? (
              <path
                d={path(seg(1, 0), 1)} fill="none" stroke="rgba(23,26,29,.35)"
                strokeWidth="1.4" strokeDasharray="5 4"
              />
            ) : null}

            <path d={path(A, 1)} fill="none" stroke={T.ink2} strokeWidth="2.2" strokeLinecap="round" />
            {grow > 0.01 ? (
              <path d={path(B, grow)} fill="none" stroke={T.accent} strokeWidth="2.2" strokeLinecap="round" />
            ) : null}

            {/* XULOSA KADRI. Og'ish teng bo'lsa tik masofa uch joyda
                o'lchanadi va uchalasi bir xil chiqadi. */}
            {mark > 0.01 && same ? gapsAt.map((x) => {
              const y1v = k1 * x + b1
              const y2v = k2 * x + b2
              if (Math.abs(y1v * u) > LIM || Math.abs(y2v * u) > LIM) return null
              const p1 = P(x * u, y1v * u)
              const p2 = P(x * u, y2v * u)
              return (
                <line
                  key={'g' + x}
                  x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]}
                  stroke={T.ok} strokeWidth={Math.max(3, R * 0.045)}
                  strokeLinecap="round" opacity={0.35 + 0.45 * mark}
                />
              )
            }) : null}

            {/* JUFTLIK: nuqta va uning ko'zgudagi juftligi. Punktir ularni
                bog'laydi, va `y = x` o'rtada qoladi. */}
            {pairAt !== null ? (() => {
              const y0 = k1 * pairAt + b1
              const p1 = P(pairAt * u, y0 * u)
              const p2 = P(y0 * u, pairAt * u)
              const rDot = Math.max(4, R * 0.052)
              return (
                <g opacity={grow > 0.01 ? 1 : 0.35}>
                  <line
                    x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]}
                    stroke="rgba(23,26,29,.4)" strokeWidth="1.2" strokeDasharray="4 4"
                  />
                  <circle cx={p1[0]} cy={p1[1]} r={rDot} fill={T.ink2} />
                  <circle cx={p2[0]} cy={p2[1]} r={rDot} fill={T.accent} opacity={grow} />
                </g>
              )
            })() : null}

            {mark > 0.01 && cross && Math.abs(cross[0] * u) < LIM && Math.abs(cross[1] * u) < LIM ? (
              <circle
                cx={P(cross[0] * u, cross[1] * u)[0]}
                cy={P(cross[0] * u, cross[1] * u)[1]}
                r={Math.max(4, R * 0.058)}
                fill={T.ok}
                opacity={mark}
              />
            ) : null}
          </g>
        )
      }}
    />
  )
}
