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
import { MATH_FONT, T, useSpin, useTween } from './core.jsx'

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
export function LevelLine({ size = 268, step = 0, a = 0.5, axis = 'y', arcs = false }) {
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
const CURVES = {
  sin: { fn: (x) => Math.sin(x), dom: [-3.4, 3.4], rng: [-1.15, 1.15] },
  line: { fn: (x) => 0.45 * x, dom: [-2.2, 2.2], rng: [-1, 1] },
  // Aylana funksiya EMAS, lekin o'qlar unga ham kerak: sinusning keng
  // o'qlarini olsak, chizma bir tomonga og'ib qoladi (stendda ko'rindi).
  circle: { fn: () => 0, dom: [-1.7, 1.7], rng: [-1, 1] },
  // KO'RSATKICHLI va LOGARIFMIK egri chiziqlar (5-blok). Ikkalasi ham `y = x`
  // ga nisbatan bir-birining aksi, va shu ikki qatorda ko'rinadi.
  // `asym` -- ASIMPTOTA: egri chiziq unga yaqinlashadi, lekin tegmaydi. Bu
  // 27-darsning shohidi: qiymatlar to'plami noldan boshlanadi, LEKIN nolni
  // o'z ichiga olmaydi.
  // ASIMPTOTA O'QNING O'ZI. Birinchi redaksiyada egri chiziq siljitilgan edi va
  // chizilgan o'qni KESIB o'tardi -- `y = 2^x` esa hech qachon kesmaydi.
  // Stend shuni ko'rsatdi (2026-08-14): shohid yolg'on gapirardi.
  exp: { fn: (x) => Math.pow(2, x) / 3, dom: [-3.2, 1.55], rng: [0, 1.15], asym: 0 },
  log: { fn: (x) => Math.log2(x) / 2.4, dom: [0.05, 1.6], rng: [-1.15, 1.15], vasym: 0 },
}

export function Plane({ size = 268, step = 0, curve = 'sin', show = 'point', at = 1.1 }) {
  const grow = useTween(step >= 1 ? 1 : 0, 1800)
  const band = useTween(step >= 2 ? 1 : 0, 800)
  const ring = curve === 'circle'
  const C = CURVES[curve] || CURVES.sin

  return (
    <Film
      size={size}
      step={step}
      cam={[{ x: 0.5, y: 0.5, r: 0.3 }]}
      draw={({ P, R, size: S }) => {
        const [ox, oy] = P(0, 0)
        const rDot = Math.max(4, R * 0.06)
        const fs = Math.max(11, Math.round(S * 0.048))
        // Kamera birlik uzunlikni R piksel qiladi. Gorizontal bo'yicha 3,4 ta
        // birlik sig'ishi kerak, shuning uchun X ni siqamiz.
        const kx = 0.42
        const PX = (x, y) => P(x * kx, y)

        // Egri chiziq FORMULADAN.
        const pts = []
        const N = 120
        for (let i = 0; i <= N; i += 1) {
          const x = C.dom[0] + ((C.dom[1] - C.dom[0]) * i) / N
          pts.push({ x, y: C.fn(x) })
        }
        const cut = Math.max(1, Math.round(pts.length * (ring ? 1 : grow)))
        const dPath = pts.slice(0, cut)
          .map((p, i) => (i ? 'L' : 'M') + PX(p.x, p.y).join(' '))
          .join(' ')

        // Yuruvchi nuqta: `grow` bo'ylab.
        const px = C.dom[0] + (C.dom[1] - C.dom[0]) * (ring ? 1 : grow) * 0.999
        const py = C.fn(px)
        const [sx, sy] = PX(px, py)
        const [vx] = PX(at, 0)

        return (
          <g>
            {/* O'qlar HAR kadrda o'sha joyda: ular umumiy chiziq. */}
            <line x1={PX(C.dom[0] - 0.2, 0)[0]} y1={oy} x2={PX(C.dom[1] + 0.2, 0)[0]} y2={oy} stroke={T.ink3} strokeWidth="1.4" />
            <line x1={ox} y1={PX(0, -1.35)[1]} x2={ox} y2={PX(0, 1.35)[1]} stroke={T.ink3} strokeWidth="1.4" />
            <text x={PX(C.dom[1] + 0.2, 0)[0]} y={oy - fs * 0.45} textAnchor="end" fontFamily={MATH_FONT} fontSize={fs} fill={T.ink3}>x</text>
            {/* `y` CHAPDA turadi: qiymatlar polosasi vertikal o'qni bosadi va
                yorliq uning tagida qolib ketardi. */}
            <text x={ox - fs * 0.5} y={PX(0, 1.35)[1] + fs * 0.9} textAnchor="end" fontFamily={MATH_FONT} fontSize={fs} fill={T.ink3}>y</text>

            {/* POLOSALAR: `dom` gorizontal, `rng` vertikal. */}
            {show === 'dom' ? (
              <rect
                x={PX(C.dom[0], 0)[0]} y={oy - Math.max(5, R * 0.05)}
                width={PX(C.dom[1], 0)[0] - PX(C.dom[0], 0)[0]} height={Math.max(10, R * 0.1)}
                fill={T.ok} opacity={band * 0.35} rx={4}
              />
            ) : null}
            {show === 'rng' ? (
              <rect
                x={ox - Math.max(5, R * 0.05)} y={PX(0, C.rng[1])[1]}
                width={Math.max(10, R * 0.1)} height={PX(0, C.rng[0])[1] - PX(0, C.rng[1])[1]}
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
                x1={PX(C.vasym, 0)[0]} y1={PX(0, -1.3)[1]}
                x2={PX(C.vasym, 0)[0]} y2={PX(0, 1.3)[1]}
                stroke={T.ok} strokeWidth="2" strokeDasharray="6 4" opacity=".75"
              />
            ) : null}

            {/* EGRI CHIZIQ yoki AYLANA (funksiya emas). */}
            {ring
              ? <circle cx={ox} cy={oy} r={R * 0.62} fill="none" stroke={T.accent} strokeWidth="2.4" />
              : <path d={dPath} fill="none" stroke={T.accent} strokeWidth="2.4" strokeLinecap="round" />}

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
