// ============================================================================
// 9-sinf: SINFNING O'Z ASBOBLARI.
//
// NEGA BU FAYL BOR. 1-dars 8-sinf karkasida yig'ilgandan keyin metodist aytdi:
// «faqat nusxa chiqdi, o'z mexanikangizni bering». Haq gap: karkas bilan birga
// 8-sinfning ASBOBLARI ham ko'chib kelgan edi, asbob esa sinfning yuzi.
//
// Bu yerdagi beshta asbob mavzudan O'ZIDAN chiqadi. Funksiya — bu «kirish ->
// chiqish» mashinasi, aniqlanish sohasi esa mashina ISHLAMAY QOLADIGAN joy.
// Shu ikki gapdan besh mexanika keladi:
//
//   Machine — sonni mashinaga solasiz, u JUFTLIK chiqaradi va juftliklar
//             lotokda YIG'ILADI: ekran oxirida bu o'quvchining o'z jadvali.
//   Board   — moslik taxtasi: bitta x dan IKKINCHI strelka o'tmaydi, bitta y
//             ga esa ikkita strelka o'tadi. Ta'rif asbobning ichida yashaydi.
//   Trace   — iz JUFTLIKLARDAN yig'iladi: nuqta qo'yiladi, keyin ular
//             birlashtiriladi. Grafik chizilmaydi, u KELIB CHIQADI.
//   Gate    — o'tkazish punkti: sonlar navbat bilan keladi, o'quvchi ularni
//             «o'tadi» va «qiymat yo'q» ga ajratadi, javob esa uning
//             ajratishidan YIG'ILADI, tayyor variantdan tanlanmaydi.
//   Sweep   — tik chizg'ich: o'quvchi uni chizma bo'ylab yuritadi va
//             kesishishlar sonini kuzatadi. Javobni tanlamaydi, DALIL yig'adi.
//
// NIMA BU YERDA YO'Q: shapka, navigatsiya, ovoz dvijoki, sahna — ular umumiy
// qatlamdan keladi (`../grade8/core.jsx`, `../grade8/screens.jsx`). Sinfning
// o'zgarishi ASBOBda, o'ramda emas: o'quvchi tugmani qaytadan izlamaydi.
//
// TEGIB BO'LMAYDIGAN QOIDA: hamma harakat TUGMA yoki chizmaga BOSISH bilan
// bajariladi, sudrab tashlash bilan EMAS. Ikki sabab: telefonda sudrash
// noaniq, va faqat sudrab o'tiladigan ekran tekshiruv skriptini butunlay
// to'xtatadi (7-sinfda shunday bo'lgan).
//
// CSS SATRI: ichida teskari apostrof va teskari chiziq BO'LMASIN, hatto
// izohda ham — satr uziladi va brauzer oq sahifa beradi.
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Ask, Choice, L, MATH_FONT, Note, RuleCard, Slot, T, fmt, useInstructionGate, useSfx, useT,
} from '../grade8/core.jsx'

const TXT = {
  input: L('KIRISH', 'ВХОД', 'INPUT'),
  output: L('CHIQISH', 'ВЫХОД', 'OUTPUT'),
  tray: L('juftliklar', 'пары', 'pairs'),
  jam: L("mashina hisoblay olmadi", 'машина не смогла посчитать', 'the machine could not compute'),
  none: L("bunday joy yo'q", 'такого места нет', 'there is no such place'),
  crossings: L('kesishish', 'пересечений', 'crossings'),
  connect: L('Birlashtirish', 'Соединить', 'Connect'),
  passes: L("o'tadi", 'проходит', 'passes'),
  blocked: L("qiymat yo'q", 'значения нет', 'no value'),
  answer: L('Javob', 'Ответ', 'Answer'),
  left: L('payt x', 'момент x', 'moment x'),
  right: L('balandlik y', 'высота y', 'height y'),
  ruleFirst: L('Qoidada nima BIRINCHI keladi?', 'Что в правиле идёт первым?', 'What comes first in the rule?'),
  ruleNext: L('Keyin nima keladi?', 'Что идёт дальше?', 'What comes next?'),
  ruleHere: L("Qoida shu yerda yig'iladi", 'Правило собирается здесь', 'The rule is built here'),
  placeNext: L('Keyingi nuqtani qo\'yish', 'Поставить следующую точку', 'Place the next point'),
  nextStep: L('Keyingi qadam', 'Следующий шаг', 'Next step'),
  evenCheck: L('Juftlik sinovi', 'Проверка на чётность', 'Even check'),
  oddCheck: L('Toqlik sinovi', 'Проверка на нечётность', 'Odd check'),
  matches: L('mos keldi', 'совпало', 'matches'),
  noMatch: L('mos kelmadi', 'не совпало', 'does not match'),
  saTest: L('Sonni qo\'yib tekshirish', 'Проверить числом', 'Check with a number'),
  saConfirm: L('Javobni tasdiqlash', 'Подтвердить ответ', 'Confirm the answer'),
  saTryAgain: L(
    "Bo'yalgan oraliqlar hali mos emas, qayta tekshiring",
    'Закрашенные промежутки пока не совпадают, проверь снова',
    'The painted intervals do not match yet, check again',
  ),
  saHint: L(
    "Grafikka qarang: egri chiziq shu oraliqda Ox dan yuqorimi yoki pastmi?",
    'Посмотри на график: кривая на этом промежутке выше оси Ox или ниже?',
    'Look at the graph: is the curve above the Ox axis on this interval, or below?',
  ),
  ovConfirm: L('Javobni tasdiqlash', 'Подтвердить ответ', 'Confirm the answer'),
  ovTryAgain: L(
    "Bo'yalgan oraliqlar hali mos emas: yuqoridagi ikkala qatorga ham qarang",
    'Закрашенные промежутки пока не совпадают: посмотри на обе полосы сверху',
    'The painted intervals do not match yet: look at both strips above',
  ),
}

// ============================================================
// UMUMIY YORDAMCHI: TEKISLIK. Trace va Sweep ikkisi ham shundan foydalanadi,
// shuning uchun u BIR marta yozilgan.
//
// Bosish koordinatasi NISBAT bilan hisoblanadi: telefonda kadr zoom bilan
// kattalashadi, piksel yolg'on gapiradi, nisbat esa qisqaradi. Kadr maydonini
// hisobga olish SHART: preserveAspectRatio kadrni butun sig'diradi va
// markazlashtiradi, shuning uchun chapda yoki tepada bo'sh yo'l qoladi.
// ============================================================
const VB = { w: 420, h: 200, l: 34, r: 16, t: 14, b: 26 }

export const scaleOf = ({ from, to, yFrom, yTo }) => {
  const left = VB.l
  const right = VB.w - VB.r
  const top = VB.t
  const bottom = VB.h - VB.b
  return {
    left, right, top, bottom, from, to, yFrom, yTo,
    px: (x) => left + ((x - from) / (to - from)) * (right - left),
    py: (y) => bottom - ((y - yFrom) / (yTo - yFrom)) * (bottom - top),
    xOf: (p) => from + ((p - left) / (right - left)) * (to - from),
    yOf: (p) => yFrom + ((bottom - p) / (bottom - top)) * (yTo - yFrom),
  }
}

export const pathOf = (f, sc) => {
  const n = 240
  let d = ''
  let open = false
  for (let i = 0; i <= n; i += 1) {
    const x = sc.from + ((sc.to - sc.from) * i) / n
    let y
    try { y = f(x) } catch { y = null }
    if (y === null || y === undefined || !isFinite(y) || y < sc.yFrom || y > sc.yTo) {
      open = false
      continue
    }
    d += (open ? 'L' : 'M') + sc.px(x).toFixed(2) + ' ' + sc.py(y).toFixed(2)
    open = true
  }
  return d
}

// QADAM MOSLASHUVCHAN: ilgari HAR BIR butun son chizilardi (keyin juftlari
// filtrlanardi) — kichik oraliqda (0…7) bu 3-4 chiziq berardi, lekin katta
// oraliqda (0…140, zarb shkalasi) 70 GA YAQIN chiziq va yozuv bir-birining
// ustiga tushib, chapdagi belgi ustunga o'xshab qolardi (metodist: «визуально
// не понятны»). Endi qadam «nice number» bilan hisoblanadi — necha bo'lsa ham
// oraliq, taxminan 5 chiziq chiqadi.
const niceStep = (span) => {
  if (!span || span <= 0) return 1
  const raw = span / 5
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const norm = raw / mag
  const step = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10
  return step * mag
}

// Tekislik FAQAT chizadi: unga bosish hech bir asbobga kerak emas (xuk
// savolga o'tdi, 2026-08-21). Bosish ishlovchisi olib tashlandi — ishlatilmagan
// kod fayl haqida yolg'on gapirishni boshlaydi.
export const Plane = ({ sc, xLabel, yLabel, children }) => {
  const t = useT()
  const xStep = niceStep(sc.to - sc.from)
  const yStep = niceStep(sc.yTo - sc.yFrom)
  const xs = []
  for (let v = Math.ceil(sc.from / xStep) * xStep; v <= sc.to; v += xStep) xs.push(v)
  const ys = []
  for (let v = Math.ceil(sc.yFrom / yStep) * yStep; v <= sc.yTo; v += yStep) ys.push(v)

  return (
    <svg
      className="g9-plane"
      viewBox={'0 0 ' + VB.w + ' ' + VB.h}
      preserveAspectRatio="xMidYMid meet"
      role="img"
    >
      <g className="g9-grid">
        {xs.map((v) => <line key={'gx' + v} x1={sc.px(v)} y1={sc.top} x2={sc.px(v)} y2={sc.bottom}/>)}
        {ys.map((v) => <line key={'gy' + v} x1={sc.left} y1={sc.py(v)} x2={sc.right} y2={sc.py(v)}/>)}
      </g>
      <g className="g9-ax">
        <line x1={sc.left} y1={sc.bottom} x2={sc.right} y2={sc.bottom}/>
        <line x1={sc.left} y1={sc.bottom} x2={sc.left} y2={sc.top}/>
      </g>
      <g className="g9-tick">
        {xs.map((v) => (
          <text key={'tx' + v} x={sc.px(v)} y={sc.bottom + 12} textAnchor="middle">{v}</text>
        ))}
        {ys.filter((v) => v > 0).map((v) => (
          <text key={'ty' + v} x={sc.left - 6} y={sc.py(v) + 3} textAnchor="end">{v}</text>
        ))}
      </g>
      {/* O'Q YORLIQLARI: shkala yozuvlaridan ATAYIN uzoqlashtirilgan —
          y-yorlig'i eng tepadagi songa, x-yorlig'i esa oxirgi songa yopishib
          qolardi va bitta so'zga o'xshab qolardi ("10x, daq"). */}
      <g className="g9-axlab">
        <text x={sc.right} y={sc.bottom + 20} textAnchor="end">{t(xLabel)}</text>
        <text x={sc.left - 6} y={sc.top - 4} textAnchor="end">{t(yLabel)}</text>
      </g>
      {children}
    </svg>
  )
}

// ============================================================
// 0. FACTCARD — «BILASIZMI?» KARTOCHKASI.
//
// 5-sinfda har bir dars faylida qayta yozilgan edi (infra ko'chirish
// taqiqlangan qoida), shuning uchun bu yerda BIR MARTA. Ekran ULARDAN
// TUGAGANDAN KEYIN chiqadi (o'quvchi allaqachon yechgan), savol yoki
// razbor paytida EMAS — 615px balandlikda joy shunga yetmaydi.
//
// Ovozga o'qilmaydi: bu qo'shimcha qiziqarli fakt, darsning asosiy
// yo'lida emas.
// ============================================================
export function FactCard({ badge, text }) {
  const t = useT()
  return (
    <div className="g9-fact">
      <div className="g9-fact-anim" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} style={{ animationDelay: (i * 0.14) + 's' }} />
        ))}
      </div>
      <div className="g9-fact-body">
        <p className="g9-fact-badge"><span className="g9-fact-dot" />{t(badge)}</p>
        <p className="g9-fact-text">{t(text)}</p>
      </div>
    </div>
  )
}

// ============================================================
// 1. MACHINE — QIYMATLAR MASHINASI.
//
// O'quvchi son-kartochkani oladi va mashinaga soladi. Son voronkaga tushadi,
// formulada uning o'rni yoritiladi, pastdan JUFTLIK chiqadi va lotokda
// QOLADI. Ekran oxirida lotokda funksiyaning jadvali turadi — uni o'quvchi
// o'z qo'li bilan to'ldirgan.
//
// Taqiqlangan son voronkada TIQILIB QOLADI: mashina o'chadi va bajarilmagan
// amalni nomlaydi. Javobni mashina aytmaydi.
//
// `need` — nechta juftlik yig'ilishi kerak. `jamNeeded` — tiqilishni ham
// ko'rish shartmi (3-ekranda shart: aniqlanish sohasi shu yerda birinchi
// marta ko'zga tashlanadi).
// ============================================================
export function Machine({
  formula, f, chips, ask, jam, need, jamNeeded, targets, figure, after,
  onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [pairs, setPairs] = useState([])
  const [used, setUsed] = useState([])
  const [inside, setInside] = useState(null)
  const [stuck, setStuck] = useState(null)
  const [note, setNote] = useState(null)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  // TESKARI REJIM: berilgan qiymatni chiqaradigan kirishni topish. Mashina
  // o'sha mashina, o'zgargani SAVOL: qiymat berilgan, kirishni o'quvchi
  // qidiradi. 13-ekran shu rejimda ishlaydi.
  const goals = targets || null
  const hit = goals ? goals.filter((g) => pairs.some((p) => p.y === g)).length : 0

  // YOPILISH EFFEKTDA EMAS, HARAKAT ICHIDA. setState ni effektda chaqirish
  // kaskad renderlar beradi va linter buni xato deb ko'rsatadi (8-sinfda
  // shu grabla yozib qo'yilgan). Shuning uchun holat yangi qiymatlardan
  // JOYIDA hisoblanadi.
  const finish = (nextPairs, nextStuck) => {
    const ok = goals
      ? goals.filter((g) => nextPairs.some((q) => q.y === g)).length >= goals.length
      : nextPairs.length >= (need || chips.length)
    if (!ok) return false
    if (jamNeeded && nextStuck === null) return false
    setDone(true)
    if (after) setNote(after)
    if (audio && after) audio.say(t(after))
    if (onSolved) onSolved({ correct: true, tries: 1 })
    return true
  }

  const feed = (c) => {
    if (!canAnswer || done) return
    const y = f(c.v)
    setInside(c.v)
    if (y === null || y === undefined || !isFinite(y)) {
      setStuck(c.v)
      setNote(c.jam || jam || TXT.jam)
      sfx.playWrong()
      if (audio) audio.say(t(c.jam || jam || TXT.jam))
      if (stepRef.current) stepRef.current('jam')
      finish(pairs, c.v)
      return
    }
    const next = pairs.concat([{ x: c.v, y }])
    setStuck(null)
    setNote(null)
    setUsed(used.concat([c.v]))
    setPairs(next)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('m' + next.length)
    finish(next, stuck)
  }

  return (
    <>
      <Slot mh={40}>
        {ask ? <Ask>{t(ask)}</Ask> : null}
        {goals && !done ? (
          <span className="g9-target" style={{ fontFamily: MATH_FONT }}>
            {t(TXT.output)}: {fmt(goals[Math.min(hit, goals.length - 1)])}
          </span>
        ) : null}
      </Slot>

      {/* OBYEKT FIGURASI. Metodist 2026-08-21: poyezdka ko'rinmaydi, uni
          jadvaldan tasavvur qilish kerak. Endi mashinaga son solinganda
          figura HARAKATLANADI: kabina o'sha balandlikka ko'chadi. Figura
          ixtiyoriy — bermagan dars uchun hech narsa o'zgarmaydi. */}
      {figure ? (
        <div className="g9-mach-fig">
          {/* Tiqilib qolganda kabina O'Z JOYIDA qoladi va amber bo'ladi:
              mashina rad etdi, kabina esa pastga tushib ketmadi. */}
          {figure({
            x: inside,
            y: pairs.length ? pairs[pairs.length - 1].y : null,
            stuck: stuck !== null,
          })}
        </div>
      ) : null}

      <div className={'g9-mach' + (stuck !== null ? ' is-stuck' : '')}>
        <div className="g9-mach-in">
          <span className="g9-mach-cap">{t(TXT.input)}</span>
          <span className="g9-mach-slot" style={{ fontFamily: MATH_FONT }}>
            {inside === null ? '?' : fmt(inside)}
          </span>
        </div>
        <div className="g9-mach-body" style={{ fontFamily: MATH_FONT }}>{formula}</div>
        <div className="g9-mach-out">
          <span className="g9-mach-cap">{t(TXT.output)}</span>
          <span className="g9-mach-slot is-out" style={{ fontFamily: MATH_FONT }}>
            {stuck !== null ? '—' : (pairs.length ? fmt(pairs[pairs.length - 1].y) : '?')}
          </span>
        </div>
      </div>

      {/* 2026-08-22, metodist: BO'SH lotok yozuvi («JUFTLIKLAR» + nuqtalar)
          hech narsa aytmagan holda ekranda turardi — bu ORTIQCHA MATN edi.
          Birinchi juftlik tushmaguncha bu qutini UMUMAN ko'rsatmaymiz. */}
      {pairs.length > 0 ? (
        <div className="g9-tray">
          <span className="g9-tray-cap">{t(TXT.tray)}</span>
          <span className="g9-tray-row" style={{ fontFamily: MATH_FONT }}>
            {pairs.map((p, i) => (
              <b key={i} className="g9-pair" style={{ animationDelay: (i * 40) + 'ms' }}>
                ({fmt(p.x)}; {fmt(p.y)})
              </b>
            ))}
          </span>
        </div>
      ) : null}

      <div className="g9-chips">
        {chips.map((c) => (
          <button
            key={String(c.v)}
            type="button"
            className={'g9-chip'
              + (used.indexOf(c.v) !== -1 ? ' is-used' : '')
              + (stuck === c.v ? ' is-stuck' : '')}
            style={{ fontFamily: MATH_FONT }}
            disabled={!canAnswer || done || (!goals && used.indexOf(c.v) !== -1)}
            onClick={() => feed(c)}
          >
            {fmt(c.v)}
          </button>
        ))}
      </div>

      <Slot mh={52}>
        {note ? <Note kind={done ? 'ok' : 'no'}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 1A2. SAVOL, KEYIN GRAFIK VA JADVAL.
//
// 2026-08-23: TAYANCH ekrani uchun. Uch javobli savol (8-sinf qatlamining
// Choice + RuleCard naqshi), to'g'ri tanlovdan keyin YECHIM kartochkasi
// ochiladi, so'ngra funksiya grafigi (topilgan nuqta belgilangan) va
// qiymatlar jadvali chiqadi. Grafik va jadval BOSILMAYDI — ular
// tasdiqlovchi rasm, alohida mashq emas, shuning uchun alohida `canAnswer`
// yoki `onSolved` talab qilmaydi: ekran MC to'g'ri tanlovda hal bo'ladi.
// ============================================================
export function CheckReveal({ ask, items, done, card, graph, audio, onSolved, onStep }) {
  const t = useT()
  const sfx = useSfx()
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)

  const pick = (opt) => {
    if (picked) return
    const src = items.find((i) => i.id === opt.id)
    if (!src.right) {
      setWrong((prev) => (prev.indexOf(src.id) === -1 ? prev.concat(src.id) : prev))
      setNote(src.hint || null)
      sfx.playWrong()
      if (audio && src.hint) audio.say(t(src.hint))
      return
    }
    setPicked(src.id)
    setNote(done || null)
    sfx.playCorrect()
    if (audio && done) audio.say(t(done))
    if (onStep) onStep('card')
    if (onSolved) onSolved({ correct: true, tries: wrong.length + 1 })
  }

  const sc = useMemo(() => (graph
    ? scaleOf({ from: graph.from, to: graph.to, yFrom: graph.yFrom, yTo: graph.yTo })
    : null), [graph])

  return (
    <>
      <div>
        <Ask>{t(ask)}</Ask>
        <Choice
          items={items.map((i) => ({ id: i.id, label: t(i.label) }))}
          picked={picked}
          wrong={wrong}
          onPick={pick}
          cols={3}
          dense
        />
      </div>

      <RuleCard
        title={card.title ? t(card.title) : null}
        lines={card.lines.map((l) => t(l))}
        masked={!picked}
        lockLabel={card.locked}
      />

      {/* «To'g'ri» yozuvi grafik+jadval bilan ORTIQCHA takror bo'ladi —
          faqat xato-izoh yoki grafiksiz holatda ko'rsatiladi. */}
      <Slot mh={46}>
        {note && !(picked && graph) ? <Note kind={picked ? 'ok' : 'no'}>{t(note)}</Note> : null}
      </Slot>

      {picked && graph ? (
        <div className="g9-summary">
          {/* Ketma-ketlik ATAYIN: avval JADVAL sonlari (tez), keyin NUQTA
              grafikda (kechroq), oxirida CHIZIQ sekin chiziladi — hammasi
              bir zumda chiqsa, ko'z uchun tushunarsiz g'alva bo'lardi. */}
          <div className="g9-vtable">
            <div className="g9-vtable-row">
              <span className="g9-vtable-lbl">x</span>
              {graph.xs.map((x, i) => (
                <span
                  key={'x' + x}
                  className={'g9-vtable-cell' + (x === graph.x ? ' is-hit' : '')}
                  style={{ fontFamily: MATH_FONT, animationDelay: (i * 70) + 'ms' }}
                >
                  {fmt(x)}
                </span>
              ))}
            </div>
            <div className="g9-vtable-row">
              <span className="g9-vtable-lbl">y</span>
              {graph.xs.map((x, i) => (
                <span
                  key={'y' + x}
                  className={'g9-vtable-cell' + (x === graph.x ? ' is-hit' : '')}
                  style={{ fontFamily: MATH_FONT, animationDelay: (140 + i * 70) + 'ms' }}
                >
                  {fmt(graph.f(x))}
                </span>
              ))}
            </div>
          </div>
          <Plane sc={sc} xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}>
            <g className="g9-real"><path d={pathOf(graph.f, sc)}/></g>
            <g className="g9-dots">
              <circle cx={sc.px(graph.x)} cy={sc.py(graph.y)} r="4.6"/>
            </g>
          </Plane>
        </div>
      ) : null}
    </>
  )
}

// ============================================================
// 1A3. ESLATMA SAVOLI — TEPADA SOCHILGAN KARTOCHKALAR, PASTDA HARFLI
// JAVOBLAR.
//
// 2026-08-23: taxta-moslik (chapdan o'ngga strelka) o'rniga. Metodist
// so'ragan aniq qolip: tepada ma'lumot sochilib turadi (bosilmaydi, faqat
// ko'z bilan o'qiladi), pastda harfli (A/B/C) javob qatorlar — 2-sinf
// qolipidan OLINGAN KOD emas, xuddi shu TASHQI KO'RINISH, 9-sinfning o'z
// uslubida qayta yozilgan.
// ============================================================
// 2026-08-28: `figure` qo'shildi — 35-darsdan boshlanadigan GEOMETRIYA
// bloki uchun. U yerda savol chizmasiz ma'nosiz bo'ladi, lekin qo'l
// harakati o'sha-o'sha: variantni tanlash. Ya'ni yangi asbob yasash
// noto'g'ri bo'lardi (sinf qoidasi: asbob yangi HARAKATGA beriladi),
// to'g'risi — mavjud asbobga chizma slotini ochish. Berilmasa, hech
// narsa o'zgarmaydi.
// `steps[].lines` ARALASH KONTRAKT: oddiy satr XOM ko'rsatiladi (matematika
// uchun), L() esa tarjima qilinadi. Ilgari bu yerda faqat xom satr chiqarilardi
// va uchta darsda o'zbekcha so'z («umumiy», «yoki», «gipotenuza») uchala tilda
// ham o'zbekcha ko'rinardi (topildi 2026-08-28). Gate pribori allaqachon
// shunday ishlaydi, endi RecallMC ham.
export function RecallMC({ intro, formula, steps, ask, items, after, figure, cols = 1, audio, onSolved, onStep }) {
  const t = useT()
  const tLine = (l) => (typeof l === 'string' ? l : t(l))
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [revealed, setRevealed] = useState([])
  const [openId, setOpenId] = useState(null)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  // AKKORDEON: bir vaqtda FAQAT bittasining yechimi ochiq turadi — uchtasi
  // birga ochilsa, 615px balandlikdagi noutbukda karta pastki panel ostiga
  // chiqib ketardi (o'lchandi 2026-08-24). Oldingi javob TUGMADA qoladi,
  // faqat qatorlar yig'iladi.
  const tapStep = (s) => {
    if (!canAnswer || revealed.indexOf(s.id) !== -1) return
    setRevealed((p) => p.concat(s.id))
    setOpenId(s.id)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('reveal-' + s.id)
  }

  const allRevealed = !steps || !steps.length || revealed.length >= steps.length

  const pick = (it) => {
    if (!canAnswer || picked) return
    if (it.right) {
      setPicked(it.id)
      setNote(after || null)
      sfx.playCorrect()
      if (audio && after) audio.say(t(after))
      if (stepRef.current) stepRef.current('right')
      if (onSolved) onSolved({ correct: true, tries: wrong.length + 1 })
      return
    }
    setWrong((p) => (p.indexOf(it.id) === -1 ? p.concat(it.id) : p))
    setNote(it.hint || null)
    sfx.playWrong()
    if (audio && it.hint) audio.say(t(it.hint))
  }

  return (
    <>
      {figure ? <div className="g9-figslot">{figure}</div> : null}
      {steps && steps.length ? (
        <div className={'g9-scatter' + (note ? ' is-compact' : '')}>
          {intro && !note ? <div className="g9-theory-line is-note">{t(intro)}</div> : null}
          {formula ? (
            <div className="g9-hformula" style={{ fontFamily: MATH_FONT }}>{formula}</div>
          ) : null}
          <div className="g9-hstep-row">
            {steps.map((s) => {
              const isRevealed = revealed.indexOf(s.id) !== -1
              return (
                <button
                  key={s.id}
                  type="button"
                  className={'g9-hstep' + (isRevealed ? ' is-open' : '')}
                  disabled={!canAnswer || isRevealed}
                  onClick={() => tapStep(s)}
                >
                  <span className="g9-hstep-eq" style={{ fontFamily: MATH_FONT }}>
                    {/* head T() ORQALI. Ilgari `s.head + ' = ?'` deb yozilgan edi:
                        satrga qo'shilganda L() obyekti [object Object] bo'lib
                        chiqardi — ekran yiqilmaydi, xato ham bermaydi, shunchaki
                        noto'g'ri matn ko'rinadi (2026-08-27, Dars05/07/08 da 11 joy).
                        `tr` oddiy satrni o'zgarishsiz qaytaradi, shuning uchun
                        eski chaqiriqlar buzilmaydi. */}
                    {isRevealed ? tLine(s.lines[s.lines.length - 1]) : t(s.head) + ' = ?'}
                  </span>
                </button>
              )
            })}
          </div>
          {/* AKKORDEON: faqat OXIRGI bosilgan qadamning yechimi ko'rinadi —
              uchtasi birga chiqsa, 615px balandlikda savol pastki panel
              ostiga chiqib ketardi (o'lchandi 2026-08-24). MC javob kartochkasi
              (note) chiqganda bu ham qisqaradi — ikkisi birga sig'maydi
              (metodist QA, 2026-08-25). */}
          {(() => {
            const openStep = steps.find((s) => s.id === openId)
            return openStep && !note ? (
              <div className="g9-hderiv">
                {openStep.lines.map((line, i) => (
                  <div
                    key={i}
                    className="g9-hderiv-line"
                    style={{ fontFamily: MATH_FONT, animationDelay: (i * 200) + 'ms' }}
                  >
                    {tLine(line)}
                  </div>
                ))}
              </div>
            ) : null
          })()}
        </div>
      ) : null}

      {/* 2026-08-23: savol tushuntirish tugamaguncha chiqmaydi — metodist:
          «avval tushuntirilsin, keyin savol chiqsin». Endi tushuntirish
          O'QUVCHINING O'ZI bosishi bilan ochiladi (audio bilan bir vaqtda
          emas), shuning uchun savol ikkalasiga ham bog'liq: ovoz tugagan VA
          barcha qadamlar ochilgan. */}
      {canAnswer && allRevealed ? (
        <>
          <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

          <div className="g9-rmc" style={{ '--rmc-cols': cols }}>
            {items.map((it, i) => (
              <button
                key={it.id}
                type="button"
                className={'g9-rmc-opt'
                  + (picked === it.id ? ' is-ok' : '')
                  + (wrong.indexOf(it.id) !== -1 ? ' is-tip' : '')}
                style={{ animationDelay: (i * 90) + 'ms' }}
                disabled={!!picked}
                onClick={() => pick(it)}
              >
                <span className="g9-rmc-badge">{RMC_LETTERS[i]}</span>
                <span className="g9-rmc-text" style={{ fontFamily: MATH_FONT }}>{t(it.label)}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}

      <Slot mh={52}>
        {note ? <Note kind={picked ? 'ok' : 'no'}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}
const RMC_LETTERS = ['A', 'B', 'C', 'D']

// ============================================================
// 1B. VAQT SIRG'ITUVCHISI — UZLUKSIZ MASHINA.
//
// 2026-08-22: 3-ekran uchun yangi mexanika. Mashinaga son solish o'rniga
// o'quvchi vaqtni TORTADI, va figura HAR bir holatda jonli, `f(t)` dan
// hisoblanadi — CSS animatsiya emas, chunki sirg'ituvchi ixtiyoriy nuqtaga
// borishi kerak. Belgilangan paytlarni (`stops`) yetib borib YIG'ISH
// kerak, so'ng chegaradan tashqaridagi qulflangan nuqta (`beyond`) sinaladi.
// ============================================================
export function TimeScrubber({
  f, stops, beyond, beyondJam, figure, ask, after,
  onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [pos, setPos] = useState(stops[0])
  // BOSHLANG'ICH NUQTA OLDINDAN OLINGAN: sirg'ituvchi shu yerdan boshlanadi,
  // shuning uchun tortish HECH QACHON bu qiymatga "o'zgarish" hodisasini
  // bermaydi (brauzer eski = yangi bo'lsa hodisa chaqirmaydi) — birinchi
  // nuqta abadiy yig'ilmay qolardi.
  const [pairs, setPairs] = useState([{ x: stops[0], y: f(stops[0]) }])
  const [note, setNote] = useState(null)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])
  // Tugma YO'Q (2026-08-22, metodist): chegaradan tashqarini alohida bosish
  // bilan emas, sirg'ituvchini OXIRIGACHA tortib sinaydi. Shuning uchun
  // "tiqilish" holati tugma emas, pos > max dan JONLI chiqadi, va faqat
  // BIRINCHI kirishda ovoz/qadam chaqiriladi (aks holda u yerda tebranish
  // gapni qayta-qayta aytadi).
  const wasJammedRef = useRef(false)

  const max = stops[stops.length - 1]
  const top = beyond !== undefined ? beyond : max
  const near = (a, b) => Math.abs(a - b) < 0.12
  const jammed = pos > max

  const move = (v) => {
    setPos(v)
    if (v > max) {
      if (!wasJammedRef.current) {
        wasJammedRef.current = true
        setNote(beyondJam || null)
        sfx.playWrong()
        if (audio && beyondJam) audio.say(t(beyondJam))
        if (stepRef.current) stepRef.current('jam')
      }
      return
    }
    if (wasJammedRef.current) {
      wasJammedRef.current = false
      setNote(done ? (after || null) : null)
    }
    if (!canAnswer || done) return
    const hitStop = stops.find((s) => near(v, s) && !pairs.some((p) => p.x === s))
    if (hitStop === undefined) return
    const y = f(hitStop)
    const next = pairs.concat([{ x: hitStop, y }])
    setPairs(next)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('p' + next.length)
    if (next.length >= stops.length) {
      setDone(true)
      if (after) setNote(after)
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: 1 })
    }
  }

  const pct = (v) => ((v - stops[0]) / (top - stops[0])) * 100
  const domainPct = pct(max)
  // Belgi 0% yoki 100% da o'zining yarim eniga chiqib ketmasin (telefonda
  // 390px'da chetga urilib qirqilardi) — shuning uchun 8-92% oralig'iga
  // qistiriladi, halqa esa haqiqiy `pct(pos)` bilan aniq joyida qoladi.
  const badgePct = Math.max(8, Math.min(92, pct(pos)))

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      {figure ? (
        <div className="g9-mach-fig">{figure({ t: jammed ? null : pos, jammed })}</div>
      ) : null}

      <div className="g9-scrub-track">
        <div className="g9-scrub-badge" style={{ left: badgePct + '%' }}>
          t = {fmt(Math.round(pos * 10) / 10)}
        </div>
        <div className="g9-scrub-rail">
          <div className="g9-scrub-fill" style={{ width: pct(Math.min(pos, max)) + '%' }}/>
          <div className="g9-scrub-lock"
            style={{ left: domainPct + '%', width: (100 - domainPct) + '%' }}/>
          {stops.map((s) => (
            <span key={s}
              className={'g9-scrub-stop' + (pairs.some((p) => p.x === s) ? ' is-got' : '')}
              style={{ left: pct(s) + '%' }}
            />
          ))}
          <input
            type="range" min={stops[0]} max={top} step="0.05"
            value={pos} disabled={!canAnswer}
            onChange={(e) => move(Number(e.target.value))}
            className={'g9-scrub-input' + (jammed ? ' is-jammed' : '')}
          />
        </div>
      </div>

      {pairs.length > 0 ? (
        <div className="g9-tray">
          <span className="g9-tray-cap">{t(TXT.tray)}</span>
          <span className="g9-tray-row" style={{ fontFamily: MATH_FONT }}>
            {pairs.map((p, i) => (
              <b key={i} className="g9-pair" style={{ animationDelay: (i * 40) + 'ms' }}>
                ({fmt(p.x)}; {fmt(Math.round(p.y * 10) / 10)})
              </b>
            ))}
          </span>
        </div>
      ) : null}

      <Slot mh={52}>
        {/* metodist, 2026-08-26: chegaradan tashqari — bu xato javob emas,
            aniqlanish sohasi haqida ma'lumot, shuning uchun "no" (qizil)
            emas, "info" (ko'k) — xuddi ODZ qatlami rangi. */}
        {note ? <Note kind={jammed ? 'info' : 'ok'}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 1C. USHLASH O'YINI — REAKSIYA.
//
// 2026-08-22: 13-ekran uchun yangi mexanika. Bu yerda o'quvchi son solmaydi,
// vaqtni ham tortmaydi: figura O'ZI uchadi (loop bilan qayta-qayta), va
// o'quvchi bergan balandlikka figura yetganda SAHNAGA bosadi (§ «tugma yoki
// chizmaga bosish», sudrash yo'q). Bir nishonni BIR payt beradi, ikkinchisini
// IKKI xil payt — shu farq domenning o'zidan chiqadi, o'qituvchi aytmaydi.
// ============================================================
export function ReactionCatch({ figure, flight, flightMs, rounds, ask, audio, onSolved, onStep }) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [ri, setRi] = useState(0)
  const [caught, setCaught] = useState([])
  const [now, setNow] = useState(0)
  const [flash, setFlash] = useState(null)
  const [note, setNote] = useState(null)
  const [noteKind, setNoteKind] = useState('ok')
  const [done, setDone] = useState(false)
  const nowRef = useRef(0)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const FLIGHT = flight || 10
  const MS = flightMs || 6000

  useEffect(() => {
    if (!canAnswer || done) return undefined
    let raf = null
    let start = null
    const tick = (ts) => {
      if (start === null) start = ts
      const el = (ts - start) % MS
      const tt = (el / MS) * FLIGHT
      nowRef.current = tt
      setNow(tt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { if (raf !== null) cancelAnimationFrame(raf) }
  }, [canAnswer, done, ri, MS, FLIGHT])

  const round = rounds[Math.min(ri, rounds.length - 1)]

  const tap = () => {
    if (!canAnswer || done) return
    const tt = nowRef.current
    const tol = round.tol || 0.6
    const win = round.windows.find((w) => Math.abs(tt - w) <= tol && caught.indexOf(w) === -1)
    if (win === undefined) {
      setFlash('miss')
      sfx.playWrong()
      if (round.retry) {
        setNote(round.retry); setNoteKind('no'); if (audio) audio.say(t(round.retry))
      }
      setTimeout(() => setFlash(null), 240)
      return
    }
    const next = caught.concat([win])
    setCaught(next)
    setFlash('hit')
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('r' + ri + 'w' + next.length)
    setTimeout(() => setFlash(null), 240)
    if (next.length < round.windows.length) return
    if (round.after) {
      setNote(round.after); setNoteKind('ok'); if (audio) audio.say(t(round.after))
    }
    const nr = ri + 1
    if (nr >= rounds.length) {
      setDone(true)
      if (onSolved) onSolved({ correct: true, tries: 1 })
    } else {
      setTimeout(() => {
        setRi(nr); setCaught([]); setNote(null)
        if (stepRef.current) stepRef.current('r' + nr + 'start')
      }, 1100)
    }
  }

  return (
    <>
      <Slot mh={40}>
        {round.ask || ask ? <Ask>{t(round.ask || ask)}</Ask> : null}
        {!done ? (
          <span className="g9-target" style={{ fontFamily: MATH_FONT }}>
            {t(TXT.output)}: {round.label !== undefined ? round.label : fmt(round.target)}
          </span>
        ) : null}
      </Slot>

      <div
        className={'g9-react-stage' + (flash ? ' is-' + flash : '')}
        data-t={now.toFixed(2)}
        onClick={tap}
        role="button"
        tabIndex={0}
      >
        {figure ? figure({ t: now, target: round.target, windows: round.windows, caught }) : null}
      </div>

      {caught.length > 0 ? (
        <div className="g9-tray">
          <span className="g9-tray-cap">{t(TXT.tray)}</span>
          <span className="g9-tray-row" style={{ fontFamily: MATH_FONT }}>
            {caught.map((w, i) => (
              <b key={i} className="g9-pair" style={{ animationDelay: (i * 40) + 'ms' }}>
                x = {fmt(w)}
              </b>
            ))}
          </span>
        </div>
      ) : null}

      <Slot mh={52}>
        {note ? <Note kind={noteKind}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 1D. GRAFIK TANLASH — TO'RT VARIANTDAN BIRINI TOPISH.
//
// 2026-08-22: 7-ekranda chizish mexanikasi olib tashlandi (sudrash — sinf
// qoidasiga zid), o'rniga TAYYOR to'rt chiziqdan noto'g'risini bosib topish
// keldi. Umumiy PickBroken (grade8/feed.jsx) o'rniga sinfning O'ZI: bosilgan
// KARTOCHKANING USTIGA, chizmaning ichiga, javob NUQTA bo'lib chiqadi —
// nechta qiymat borligi gapdan oldin KO'ZGA ko'rinadi. PickBroken buni
// bermaydi (u faqat matn qaytaradi), shuning uchun bu yerda alohida.
// ============================================================
export function GraphPick({ items, ask, after, onSolved, audio, onStep }) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [note, setNote] = useState(null)
  const [noteKind, setNoteKind] = useState('ok')
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const pick = (it) => {
    if (!canAnswer || picked) return
    if (it.right) {
      setPicked(it.id)
      setNote(after || null)
      setNoteKind('ok')
      sfx.playCorrect()
      if (audio && after) audio.say(t(after))
      if (stepRef.current) stepRef.current('right')
      if (onSolved) onSolved({ correct: true, tries: wrong.length + 1 })
      return
    }
    setWrong((p) => (p.indexOf(it.id) === -1 ? p.concat(it.id) : p))
    setNote(it.hint || null)
    setNoteKind('no')
    sfx.playWrong()
    if (audio && it.hint) audio.say(t(it.hint))
  }

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>
      <div className="g8-pb g9-graphpick-grid">
        {items.map((it, i) => {
          const revealed = picked === it.id || wrong.indexOf(it.id) !== -1
          return (
            <button
              key={it.id}
              type="button"
              className={'g8-pb-card'
                + (picked === it.id ? ' is-ok' : '')
                + (wrong.indexOf(it.id) !== -1 ? ' is-tip' : '')}
              disabled={!!picked}
              onClick={() => pick(it)}
            >
              {it.render(revealed, i)}
            </button>
          )
        })}
      </div>
      <Slot mh={52}>
        {note ? <Note kind={noteKind}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 2. BOARD — MOSLIK TAXTASI.
//
// Chapda paytlar, o'ngda balandliklar. O'quvchi chapdagini bosadi, keyin
// o'ngdagini — strelka tortiladi. Asbob bitta x dan IKKINCHI strelkani
// O'TKAZMAYDI, bitta y ga esa ikkita strelkani bemalol o'tkazadi.
//
// Ya'ni funksiyaning ta'rifi asbobning ichida turadi: o'quvchi uni gapdan
// emas, TAQIQQA URILIB bilib oladi.
//
// `mode: 'audit'` — taxta TAYYOR strelkalar bilan keladi, ulardan bittasi
// ortiqcha (bitta x dan ikkinchi strelka). O'quvchi ortiqchasini bosib
// olib tashlaydi.
// ============================================================
export function Board({
  left, right, answer, ask, rejectNote, wrongNote, extra, mode, after, formulas,
  onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const audit = mode === 'audit'
  const [links, setLinks] = useState(() => (audit ? (extra || []).concat(answer) : []))
  const [pick, setPick] = useState(null)
  const [note, setNote] = useState(null)
  const [bad, setBad] = useState(null)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const ROW = 34
  // Ustun sarlavhasi 9-chi pikselda, birinchi yacheyka esa 5-chidan boshlanardi
  // va uni yopib qo'yardi. Qatorlar pastga tushirildi (o'lchandi 2026-08-20).
  const top = 32
  const xL = 96
  const xR = 300
  const yOf = (i) => top + i * ROW
  const height = top + Math.max(left.length, right.length) * ROW + 6

  const close = () => {
    setDone(true)
    if (after) setNote(after)
    if (audio && after) audio.say(t(after))
    if (onSolved) onSolved({ correct: true, tries: 1 })
  }

  // TAYYOR TAXTA: ortiqcha strelkani olib tashlash.
  const drop = (k) => {
    if (!canAnswer || done) return
    const link = links[k]
    const isExtra = (extra || []).some((e) => e.x === link.x && e.y === link.y)
    if (!isExtra) {
      setBad(k)
      setNote(wrongNote || null)
      sfx.playWrong()
      if (audio && wrongNote) audio.say(t(wrongNote))
      return
    }
    setLinks(links.filter((_, i) => i !== k))
    setBad(null)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('fixed')
    close()
  }

  const tapLeft = (i) => {
    if (!canAnswer || done || audit) return
    if (links.some((l) => l.x === left[i].v)) {
      // TAQIQ ASBOBNING ICHIDA: bitta paytdan ikkinchi strelka chiqmaydi.
      setBad('L' + i)
      setNote(rejectNote || null)
      sfx.playWrong()
      if (audio && rejectNote) audio.say(t(rejectNote))
      return
    }
    setBad(null)
    setNote(null)
    setPick(i)
  }

  const tapRight = (j) => {
    if (!canAnswer || done || audit || pick === null) return
    const x = left[pick].v
    const y = right[j].v
    const want = answer.find((a) => a.x === x)
    if (!want || want.y !== y) {
      setBad('R' + j)
      setNote((right[j].hint) || null)
      sfx.playWrong()
      if (audio && right[j].hint) audio.say(t(right[j].hint))
      return
    }
    const next = links.concat([{ x, y }])
    setLinks(next)
    setPick(null)
    setBad(null)
    setNote(null)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('b' + next.length)
    if (next.length >= answer.length) close()
  }

  const cell = (side, i, item) => {
    const y = yOf(i)
    const x = side === 'L' ? xL : xR
    const isPicked = side === 'L' && pick === i
    const isBad = bad === side + i
    return (
      <g key={side + i} className={'g9-bd-cell' + (isPicked ? ' is-on' : '') + (isBad ? ' is-bad' : '')}>
        <rect x={x - 46} y={y - 13} width="92" height="26" rx="8"/>
        <text x={x} y={y + 5} textAnchor="middle" fontFamily={MATH_FONT}>{item.label}</text>
        {canAnswer && !done && !audit ? (
          <rect
            x={x - 46} y={y - 13} width="92" height="26" rx="8"
            className="g9-bd-hit"
            // BARQAROR ATRIBUT: tekshiruv stendi yacheykani MATN bo'yicha
            // topolmaydi, chunki Playwright ning hasText i SVG uchun
            // ishlamaydi (innerText bo'sh). 8-sinfda qoida plitkalari xuddi
            // shunday data-id bilan adreslanadi.
            data-pick={side + item.v}
            onClick={() => (side === 'L' ? tapLeft(i) : tapRight(i))}
          />
        ) : null}
      </g>
    )
  }

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      <svg className="g9-board" viewBox={'0 0 400 ' + height} preserveAspectRatio="xMidYMid meet" role="img">
        <text x={xL} y="12" textAnchor="middle" className="g9-bd-cap">{t(TXT.left)}</text>
        <text x={xR} y="12" textAnchor="middle" className="g9-bd-cap">{t(TXT.right)}</text>

        {links.map((l, k) => {
          const i = left.findIndex((a) => a.v === l.x)
          const j = right.findIndex((b) => b.v === l.y)
          if (i < 0 || j < 0) return null
          const isExtra = (extra || []).some((e) => e.x === l.x && e.y === l.y)
          return (
            <g key={'l' + k} className={'g9-bd-link' + (audit && isExtra ? ' is-doubt' : '')}>
              <line
                className="g9-bd-line"
                x1={xL + 46} y1={yOf(i)} x2={xR - 48} y2={yOf(j)}
                style={{ animationDelay: (k * 120) + 'ms' }}
              />
              <circle
                className="g9-bd-dot"
                cx={xR - 48} cy={yOf(j)} r="3"
                style={{ animationDelay: (k * 120 + 420) + 'ms' }}
              />
              {audit && canAnswer && !done ? (
                <line
                  x1={xL + 46} y1={yOf(i)} x2={xR - 48} y2={yOf(j)}
                  className="g9-bd-linkhit"
                  data-link={l.x + '-' + l.y}
                  onClick={() => drop(k)}
                />
              ) : null}
            </g>
          )
        })}

        {left.map((item, i) => cell('L', i, item))}
        {right.map((item, j) => cell('R', j, item))}
      </svg>

      <Slot mh={52}>
        {note ? <Note kind={done ? 'ok' : 'no'}>{t(note)}</Note> : null}
      </Slot>
      {done && formulas ? <FormulaSet groups={formulas} /> : null}
    </>
  )
}

// ============================================================
// 3. TRACE — IZ JUFTLIKLARDAN.
//
// `mode: 'build'` — juftliklar kartochka bo'lib turadi, o'quvchi ularni
// birma-bir tekislikka qo'yadi (nuqta o'z koordinatasiga o'zi uchadi, mo'ljal
// olish kerak emas: bu ekran nuqta qo'yishni emas, IZNING KELIB CHIQISHINI
// o'rgatadi). Hammasi qo'yilgach «Birlashtirish» tugmasi izni chizadi.
//
// ============================================================
export function Trace({
  f, from, to, yFrom, yTo, pairs, ask, after, xLabel, yLabel,
  onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const sc = useMemo(() => scaleOf({ from, to, yFrom, yTo }), [from, to, yFrom, yTo])
  const [put, setPut] = useState([])
  const [joined, setJoined] = useState(false)
  const [note, setNote] = useState(null)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const list = pairs || []
  const all = put.length >= list.length

  const close = () => {
    if (done) return
    setDone(true)
    if (after) setNote(after)
    if (audio && after) audio.say(t(after))
    if (onSolved) onSolved({ correct: true, tries: 1 })
  }

  // QURISH: juftlik kartochkasi bosiladi, nuqta o'z joyiga uchadi.
  const place = (k) => {
    if (!canAnswer || done) return
    if (put.some((p) => p.i === k)) return
    const next = put.concat([{ i: k, x: list[k].x, y: list[k].y }])
    setPut(next)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('p' + next.length)
  }

  const join = () => {
    if (joined || !all) return
    setJoined(true)
    if (stepRef.current) stepRef.current('join')
    close()
  }

  const dots = put.slice().sort((a, b) => a.x - b.x)
  const line = dots.map((p, i) => (i ? 'L' : 'M') + sc.px(p.x).toFixed(1) + ' ' + sc.py(p.y).toFixed(1)).join('')

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      <Plane sc={sc} xLabel={xLabel} yLabel={yLabel}>
        {joined ? (
          <g className="g9-real"><path d={pathOf(f, sc)}/></g>
        ) : null}
        {joined ? <g className="g9-line"><path d={line}/></g> : null}
        <g className="g9-dots">
          {dots.map((p, i) => (
            <circle key={'d' + i} cx={sc.px(p.x)} cy={sc.py(p.y)} r="4.2"/>
          ))}
        </g>
      </Plane>

      <div className="g9-chips">
        {list.map((p, k) => (
          <button
            key={'c' + k}
            type="button"
            className={'g9-chip' + (put.some((q) => q.i === k) ? ' is-used' : '')}
            style={{ fontFamily: MATH_FONT }}
            disabled={!canAnswer || put.some((q) => q.i === k)}
            onClick={() => place(k)}
          >
            ({fmt(p.x)}; {fmt(p.y)})
          </button>
        ))}
      </div>

      <Slot mh={48}>
        {all && !joined ? (
          <button type="button" className="g9-go" onClick={join}>{t(TXT.connect)}</button>
        ) : null}
        {note ? <Note kind="ok">{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 3B1. FORMULA BOSISH BILAN OCHILADI. Harf o'zi hech narsa aytmaydi --
// o'quvchi ANIQ SHU harfni bosadi va ma'nosi ostida chiqadi. Bir vaqtda
// FAQAT BITTA izoh ochiq turadi (guruhlar orasida ham): ikkita formula
// qatori va uchta izohni birga ochib qo'yish 615 pikselli noutbukda
// pastki panelni bosib qoladi (o'lchandi 2026-08-24). Yangi harf
// bosilganda avvalgi izoh yopiladi, balandlik doim bir xil qoladi.
// ============================================================
export function FormulaSet({ groups }) {
  const t = useT()
  const [openAt, setOpenAt] = useState(null)
  const active = openAt ? groups[openAt.g][openAt.i] : null
  return (
    <div className="g9-ft-group">
      {groups.map((tokens, g) => (
        <div className="g9-ft-row" key={g} style={{ fontFamily: MATH_FONT }}>
          {tokens.map((tok, i) => (tok.label ? (
            <button
              type="button"
              key={i}
              className={'g9-ft-sym' + (openAt && openAt.g === g && openAt.i === i ? ' is-open' : '')}
              onClick={() => setOpenAt((o) => (o && o.g === g && o.i === i ? null : { g, i }))}
            >
              {tok.sym}
            </button>
          ) : (
            <span key={i} className="g9-ft-plain">{tok.sym}</span>
          )))}
        </div>
      ))}
      <div className="g9-ft-legend">
        {active ? (
          <span className="g9-ft-def">
            <b style={{ fontFamily: MATH_FONT }}>{active.sym}</b>{t(active.label)}
          </span>
        ) : null}
      </div>
    </div>
  )
}

// ============================================================
// 3B. QOIDANI O'ZI YIG'ISH. Ta'rif tayyor holda berilmaydi: o'quvchi uni
// bo'lak-bo'lak O'ZI tanlaydi. Har qadamda ANIQ IKKI variant — to'g'risi va
// bitta yaqin xato tushuncha — shuning uchun tanlov besh emas, bitta aniq
// ikkilanish. Xato variant navbatdagi qadamning O'Z tuzog'i, boshqa
// qadamlarga aloqasi yo'q.
//
// Yig'ilgan qatorlar RuleCard OCHILGUNCHA javob emas, ular o'quvchining
// o'zi tanlagan izohlar: shu sababli oxirgi qadamdan keyin qoida
// kartochkada ochiladi va uni ALMASHTIRADI (ikkalasi birga ekranga
// sig'maydi). Kartochka ostida formula turadi: harflar BOSILGANDA o'z
// ma'nosini ochadi, shuning uchun qoida endi o'qiladigan matn emas,
// tekshirib ko'riladigan belgi.
// ============================================================
export function RuleBuild({ steps, card, after, onSolved, onStep, audio }) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [at, setAt] = useState(0)
  const [hint, setHint] = useState(null)
  const [misses, setMisses] = useState(0)
  const done = at >= steps.length

  // Har qadamda to'g'ri va xato variant o'rni aralashadi, lekin QAYSI
  // ekanligi mexanika ichida emas, tashqi `steps` massivida yoziladi.
  //
  // GOTCHA (metodist ko'rsatdi, 2026-08-24): `useMemo(..., [steps])` ishlatilgan
  // edi, lekin `steps` — S8.render ichida yozilgan qatorli massiv, ya'ni ovoz
  // holati o'zgarib ekran qayta chizilganda YANGI massiv keladi. Yangi massiv
  // useMemo uchun YANGI qiymat, tartib QAYTA aralashadi va tugmalar ekranda
  // O'RIN ALMASHADI, xuddi o'quvchi hech narsa qilmagan bo'lsa ham. `useState`
  // faqat MOUNTDA ishlaydi, shuning uchun tartib butun ekran umrida bir xil.
  const [order] = useState(() => steps.map(() => Math.random() < 0.5))

  const pick = (id) => {
    if (!canAnswer || done) return
    const step = steps[at]
    if (id === step.id) {
      setHint(null)
      const next = at + 1
      setAt(next)
      sfx.playCorrect()
      if (next >= steps.length) {
        if (onStep) onStep('card')
        if (onSolved) onSolved({ correct: true, tries: misses + 1 })
      } else if (onStep) onStep('b' + next)
      return
    }
    setMisses((m) => m + 1)
    setHint(step.hint || null)
    sfx.playWrong()
    if (audio && step.hint) audio.say(t(step.hint))
  }

  return (
    <>
      <div className="g9-rb-built">
        {at > 0 ? steps.slice(0, at).map((s, i) => (
          <span key={s.id} className="g9-rb-line">
            <span className="g9-rb-no">{i + 1}</span>{t(s.label)}
          </span>
        )) : (
          <span className="g9-rb-empty">
            {t(TXT.ruleHere)}
            <i className="g9-rb-caret" aria-hidden="true" />
          </span>
        )}
      </div>

      {!done ? (
        <>
          <p className="g9-rb-ask">{t(at === 0 ? TXT.ruleFirst : TXT.ruleNext)}</p>
          <div className="g9-rb-opts">
            {(order[at] ? [steps[at], steps[at].wrong] : [steps[at].wrong, steps[at]]).map((o) => (
              <button
                type="button"
                key={o.id}
                className="g9-rb-chip"
                disabled={!canAnswer}
                onClick={() => pick(o.id)}
              >
                {t(o.label)}
              </button>
            ))}
          </div>
          <Note kind="no">{hint ? t(hint) : null}</Note>
        </>
      ) : (
        <>
          <RuleCard
            title={card.title ? t(card.title) : null}
            lines={card.lines.map((l) => t(l))}
            masked={false}
          />
          {card.formulas ? <FormulaSet groups={card.formulas} /> : null}
          <Note kind="plain">{after ? t(after) : null}</Note>
        </>
      )}
    </>
  )
}

// ============================================================
// 4. GATE — ANIQLANISH SOHASI O'TKAZISH PUNKTI.
//
// Formulaga sonlar NAVBAT bilan keladi. O'quvchi har birini «o'tadi» yoki
// «qiymat yo'q» ga yuboradi. Xato o'tkazilgan son shu yerda HISOBLANADI va
// ko'z oldida buziladi — asbob javobni aytmaydi, u faqat hisoblaydi.
//
// Oxirida javob o'quvchining AJRATISHIDAN yig'iladi: to'silgan sonlar shartga
// aylanadi. Tayyor variantlardan tanlash yo'q.
// ============================================================
// 2026-08-28: Gate 30-darsda EHTIMOLLIK uchun kerak bo'ldi — u yerda
// ham navbat kelib, ikkita savatga ajratiladi, lekin savatlar «o'tadi /
// qiymati yo'q» emas, «qulay / qulay emas». Asbobni nusxalash o'rniga
// UCH DONA yozuv parametrga chiqarildi: `capYes`, `capNo`, `varLabel`.
// Berilmasa — eski matn, ya'ni 14-17-darslar o'zgarmaydi. Sabab
// yozilgan grabli: umumiy mexanika begona chizmani sudrab keladi.
export function Gate({
  formula, f, queue, ask, answer, after, calcOf, warmup, chart, fact,
  capYes, capNo, varLabel, onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const sc = useMemo(() => (chart
    ? scaleOf({ from: chart.from, to: chart.to, yFrom: chart.yFrom, yTo: chart.yTo })
    : null), [chart])
  // 2026-08-24: metodist «avval tushuntirilsin, keyin savol chiqsin» —
  // 4-ekrandagi bilan bir xil qoida, endi 9, 10-ekranda ham: navbat
  // `warmup` bosilguncha YASHIRIN turadi. `warmup` BERILMAGANDA eski
  // xatti-harakat o'zgarmaydi: `explained` boshidanoq true.
  const [explained, setExplained] = useState(!warmup)
  const [at, setAt] = useState(0)
  const [passed, setPassed] = useState([])
  const [blocked, setBlocked] = useState([])
  const [shown, setShown] = useState(null)
  const [note, setNote] = useState(null)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const openWarmup = () => {
    if (!canAnswer || explained) return
    setExplained(true)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('warmup')
  }

  const cur = queue[Math.min(at, queue.length - 1)]
  const over = at >= queue.length

  const send = (asPass) => {
    if (!canAnswer || done || over) return
    const y = f(cur.v)
    const alive = y !== null && y !== undefined && isFinite(y)
    if (asPass !== alive) {
      // XATO AJRATISH: son shu yerda hisoblanadi.
      setShown({ v: cur.v, calc: calcOf ? calcOf(cur.v) : null, alive })
      setNote(cur.hint || null)
      sfx.playWrong()
      if (audio && cur.hint) audio.say(t(cur.hint))
      return
    }
    setShown(null)
    setNote(null)
    sfx.playCorrect()
    if (alive) setPassed((p) => p.concat([cur.v]))
    else setBlocked((p) => p.concat([cur.v]))
    const next = at + 1
    setAt(next)
    if (stepRef.current) stepRef.current('q' + next)
    if (next >= queue.length) {
      setDone(true)
      if (after) setNote(after)
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: 1 })
    }
  }

  return (
    <>
      {/* 2026-08-28: `formula` XOM chiqarilardi va L() berilganda ekran
          yiqilardi (30-dars, Playwright tutdi). t() qo'shildi: oddiy
          satrni u o'zgartirmasdan qaytaradi, shuning uchun 14-17-darslar
          tegilmagan. Bu sinfdagi to'rtinchi shunday joy. */}
      <div className="g9-gate-head" style={{ fontFamily: MATH_FONT }}>{t(formula)}</div>

      {/* 2026-08-24: metodist «javobdan keyin bu qisqarsin, o'rniga grafik
          va jadval chiqsin» — tushuntirish kartochkasi hal bo'lgach ENDI
          KERAK EMAS, joyni grafik-jadvalga bo'shatadi. */}
      {warmup && !done ? (
        <div className={'g9-scatter' + (explained ? ' is-compact' : '')}>
          {warmup.intro && !explained ? <div className="g9-theory-line is-note">{t(warmup.intro)}</div> : null}
          <button
            type="button"
            className={'g9-hstep' + (explained ? ' is-open' : '')}
            disabled={!canAnswer || explained}
            onClick={openWarmup}
          >
            <span className="g9-hstep-eq" style={{ fontFamily: MATH_FONT }}>
              {explained ? (warmup.result || warmup.lines[warmup.lines.length - 1]) : t(warmup.head)}
            </span>
          </button>
          {/* 615px balandlikda joy tanqis: xato javob kartochkasi (shown)
              chiqganda bu qator qisqaradi, aks holda ikkisi birga sig'may,
              pastki qator ko'rinmay qoladi (metodist QA, 2026-08-24). */}
          {explained && !shown ? (
            <div className="g9-hderiv">
              {warmup.lines.map((line, i) => (
                <div
                  key={i}
                  className="g9-hderiv-line"
                  style={{ fontFamily: MATH_FONT, animationDelay: (i * 260) + 'ms' }}
                >
                  {typeof line === 'string' ? line : t(line)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {explained ? (
        <>
          <div className="g9-gate">
            <div className="g9-bin">
              <span className="g9-bin-cap">{t(capYes || TXT.passes)}</span>
              <span className="g9-bin-row" style={{ fontFamily: MATH_FONT }}>
                {passed.map((v) => <b key={'p' + v} className="g9-pair">{fmt(v)}</b>)}
              </span>
            </div>
            <div className="g9-bin is-no">
              <span className="g9-bin-cap">{t(capNo || TXT.blocked)}</span>
              <span className="g9-bin-row" style={{ fontFamily: MATH_FONT }}>
                {blocked.map((v) => <b key={'b' + v} className="g9-pair">{fmt(v)}</b>)}
              </span>
            </div>
          </div>

          <Slot mh={92}>
            {!over ? (
              <div className="g9-queue" key={at}>
                <Ask>{t(ask)}</Ask>
                <div className="g9-queue-row">
                  <span className="g9-queue-num" style={{ fontFamily: MATH_FONT }}>
                    {(varLabel ? t(varLabel) + ' ' : 'x = ') + fmt(cur.v)}
                  </span>
                  <button type="button" className="g9-go is-ok" disabled={!canAnswer}
                    onClick={() => send(true)}>{t(capYes || TXT.passes)}</button>
                  <button type="button" className="g9-go is-no" disabled={!canAnswer}
                    onClick={() => send(false)}>{t(capNo || TXT.blocked)}</button>
                </div>
              </div>
            ) : chart ? null : (
              // 2026-08-24: «JAVOB» yozuvi grafik+jadval bilan ORTIQCHA —
              // javob endi shu yerda KO'RINADI (uzilish nuqtasi bo'lib),
              // qayta so'z bilan aytilmaydi.
              <div className="g9-ans" style={{ fontFamily: MATH_FONT }}>
                <span className="g9-ans-cap">{t(TXT.answer)}</span>
                <span className="g9-ans-body">{t(answer)}</span>
              </div>
            )}
          </Slot>

          <Slot mh={46}>
            {shown && shown.calc ? (
              <div className="g9-calc" style={{ fontFamily: MATH_FONT }}>{shown.calc}</div>
            ) : null}
          </Slot>
          {/* «Bitta son to'sildi...» grafik+jadval bilan ORTIQCHA takror
              bo'ladi — 615px balandlikda joy tanqis (CheckReveal'dagi bilan
              bir xil qoida). */}
          <Slot mh={52}>
            {note && !(done && chart) ? <Note kind={done ? 'ok' : 'no'}>{t(note)}</Note> : null}
          </Slot>

          {done && chart ? (
            <div className="g9-summary g9-summary-compact">
              <div className="g9-vtable">
                <div className="g9-vtable-row">
                  <span className="g9-vtable-lbl">x</span>
                  {queue.map((q, i) => (
                    <span
                      key={'x' + q.v}
                      className={'g9-vtable-cell' + (blocked.indexOf(q.v) !== -1 ? ' is-hit' : '')}
                      style={{ fontFamily: MATH_FONT, animationDelay: (i * 70) + 'ms' }}
                    >
                      {fmt(q.v)}
                    </span>
                  ))}
                </div>
                <div className="g9-vtable-row">
                  <span className="g9-vtable-lbl">y</span>
                  {queue.map((q, i) => {
                    const y = f(q.v)
                    const alive = y !== null && y !== undefined && isFinite(y)
                    return (
                      <span
                        key={'y' + q.v}
                        className={'g9-vtable-cell' + (!alive ? ' is-hit' : '')}
                        style={{ fontFamily: MATH_FONT, animationDelay: (140 + i * 70) + 'ms' }}
                      >
                        {alive ? fmt(y) : t(TXT.blocked)}
                      </span>
                    )
                  })}
                </div>
              </div>
              <Plane sc={sc} xLabel={chart.xLabel} yLabel={chart.yLabel}>
                <g className="g9-real"><path d={pathOf(f, sc)}/></g>
                <g className="g9-dots">
                  {passed.map((v) => (
                    <circle key={'d' + v} cx={sc.px(v)} cy={sc.py(f(v))} r="4.6"/>
                  ))}
                </g>
                {blocked.map((v) => (
                  <line
                    key={'asym' + v}
                    className="g9-asymptote"
                    x1={sc.px(v)} y1={sc.top} x2={sc.px(v)} y2={sc.bottom}
                  />
                ))}
              </Plane>
            </div>
          ) : null}
          {done && fact ? <FactCard badge={fact.badge} text={fact.text}/> : null}
        </>
      ) : null}
    </>
  )
}

// ============================================================
// 5. SWEEP — TIK CHIZG'ICH.
//
// O'quvchi tik chiziqni chizma bo'ylab yuritadi, hisoblagich kesishishlar
// sonini ko'rsatadi. Topshiriq: IKKI kesishish bo'lgan joyni topish. Agar
// bunday joy bo'lmasa — «bunday joy yo'q» tugmasini bosish; bu tugma HAR
// chizmada turadi, aks holda uni paydo bo'lgani uchun bosadilar.
//
// O'quvchi javobni tanlamaydi: u chizg'ichni yuritib DALIL yig'adi.
// ============================================================
export function Sweep({
  charts, ask, foundNote, emptyNote, wrongNote, after, xLabel, yLabel,
  onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [ci, setCi] = useState(0)
  const [note, setNote] = useState(null)
  const [done, setDone] = useState(false)
  // DALILSIZ «bunday joy yo'q» QABUL QILINMAYDI. Chizg'ichni yurgizmasdan
  // aytilgan javob taxmin bo'ladi, asbob esa dalil yig'ish uchun turadi.
  const [moves, setMoves] = useState(0)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const chart = charts[Math.min(ci, charts.length - 1)]
  const sc = useMemo(
    () => scaleOf({ from: chart.from, to: chart.to, yFrom: chart.yFrom, yTo: chart.yTo }),
    [chart],
  )
  // Chizma almashganda chizg'ich boshiga qaytadi. Ilgari buni effekt qilardi
  // va linter «setState effekt ichida» deb to'g'ri e'tiroz bildirdi: endi
  // ikkala holat BIR joyda va bir vaqtda yangilanadi.
  const [x, setX] = useState(charts[0].start === undefined ? charts[0].from : charts[0].start)

  const hits = chart.hits(x)
  const step = chart.step || 0.5

  const move = (d) => {
    if (!canAnswer || done) return
    setX((v) => Math.min(Math.max(v + d * step, chart.from), chart.to))
    setMoves((n) => n + 1)
    setNote(null)
  }

  const nextChart = () => {
    const n = ci + 1
    if (n >= charts.length) {
      setDone(true)
      if (after) setNote(after)
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: 1 })
      return
    }
    const nx = charts[n]
    setCi(n)
    setX(nx.start === undefined ? nx.from : nx.start)
    setMoves(0)
    setNote(null)
    if (stepRef.current) stepRef.current('s' + (n + 1))
  }

  // «Ikkita» — dalil topildi. Faqat haqiqatan ikki kesishish bo'lsa qabul qiladi.
  const claimTwo = () => {
    if (!canAnswer || done) return
    if (hits.length >= 2) {
      sfx.playCorrect()
      setNote(chart.found || foundNote || null)
      if (audio && (chart.found || foundNote)) audio.say(t(chart.found || foundNote))
      nextChart()
      return
    }
    sfx.playWrong()
    setNote(wrongNote || null)
    if (audio && wrongNote) audio.say(t(wrongNote))
  }

  const claimNone = () => {
    if (!canAnswer || done) return
    if (moves < (chart.minMoves || 0)) {
      sfx.playWrong()
      setNote(chart.sweepFirst || null)
      if (audio && chart.sweepFirst) audio.say(t(chart.sweepFirst))
      return
    }
    if (chart.hasTwo) {
      sfx.playWrong()
      setNote(chart.miss || null)
      if (audio && chart.miss) audio.say(t(chart.miss))
      return
    }
    sfx.playCorrect()
    setNote(chart.empty || emptyNote || null)
    if (audio && (chart.empty || emptyNote)) audio.say(t(chart.empty || emptyNote))
    nextChart()
  }

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      <div className="g9-sweep-top">
        <span className="g9-sweep-n">{ci + 1} / {charts.length}</span>
        <span className="g9-sweep-name">{t(chart.name)}</span>
        <span className={'g9-sweep-cnt' + (hits.length >= 2 ? ' is-two' : '')}>
          {t(TXT.crossings)}: <b style={{ fontFamily: MATH_FONT }}>{hits.length}</b>
        </span>
      </div>

      <Plane sc={sc} xLabel={xLabel} yLabel={yLabel}>
        <g className="g9-real">
          {/* Chizma FUNKSIYALARDAN quriladi, qo'lda yozilgan d-satridan emas:
              aylana ikkita yarim funksiya bilan beriladi. Qo'lda yozilgan
              yo'l muallifning xatosini yashiradi. */}
          {(chart.fns || (chart.f ? [chart.f] : [])).map((fn, i) => (
            <path key={'c' + i} d={pathOf(fn, sc)}/>
          ))}
        </g>
        <g className={'g9-ruler' + (hits.length >= 2 ? ' is-two' : '')}>
          <line x1={sc.px(x)} y1={sc.top} x2={sc.px(x)} y2={sc.bottom}/>
        </g>
        <g className="g9-dots">
          {hits.map((y, i) => (
            <circle key={'h' + i} cx={sc.px(x)} cy={sc.py(y)} r="4.2"/>
          ))}
        </g>
      </Plane>

      <div className="g9-sweep-ctl">
        <button type="button" className="g9-step" disabled={!canAnswer || done} onClick={() => move(-1)}>
          {'‹'}
        </button>
        <span className="g9-sweep-x" style={{ fontFamily: MATH_FONT }}>x = {fmt(x)}</span>
        <button type="button" className="g9-step" disabled={!canAnswer || done} onClick={() => move(1)}>
          {'›'}
        </button>
      </div>

      <div className="g9-sweep-say">
        <button type="button" className="g9-go" disabled={!canAnswer || done} onClick={claimTwo}>
          {t(TXT.crossings)}: 2
        </button>
        <button type="button" className="g9-go is-ghost" disabled={!canAnswer || done} onClick={claimNone}>
          {t(TXT.none)}
        </button>
      </div>

      <Slot mh={52}>
        {note ? <Note kind={done ? 'ok' : 'no'}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 6. MONOTONE — O'SISH YOKI KAMAYISHNING QADAMLAB ISBOTI.
//
// 2026-08-26, metodist: 3 va 4-ekran juda yengil chiqqan edi (ikkita
// hisoblash — bitta savol). Endi bitta ekran BITTA xossani (faqat
// o'sish YOKI faqat kamayish) to'liq isbot sifatida quradi: o'quvchi
// nuqtalarni birma-bir GRAFIKKA qo'yadi (bosish bilan, sudramasdan),
// har ikkinchi nuqtadan keyin x va y solishtiruvi jonlanadi, va oxirida
// umumiy xulosa (o'suvchi yoki kamayuvchi ta'rifining o'zi) ochiladi.
// Sudrash yo'q, formula tayyor holda sayohatga chiqmaydi — o'quvchi
// buni o'z qo'li bilan, qadam-baqadam yig'adi (§ «harakat tugma bilan»).
// ============================================================
export function Monotone({
  f, xs, from, to, yFrom, yTo, xLabel, yLabel, ask, ruleLine, after,
  onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const sc = useMemo(() => scaleOf({ from, to, yFrom, yTo }), [from, to, yFrom, yTo])
  const [placed, setPlaced] = useState(0)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const ys = xs.map((x) => f(x))
  const all = placed >= xs.length

  const place = () => {
    if (!canAnswer || all) return
    const next = placed + 1
    setPlaced(next)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('p' + next)
    if (next >= xs.length) {
      setDone(true)
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: 1 })
    }
  }

  const dots = xs.slice(0, placed)

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      <Plane sc={sc} xLabel={xLabel} yLabel={yLabel}>
        <g className="g9-real"><path d={pathOf(f, sc)} /></g>
        <g className="g9-dots">
          {dots.map((x, i) => (
            <circle
              key={i} cx={sc.px(x)} cy={sc.py(f(x))} r="4.6"
              className="g9-mono-dot" style={{ animationDelay: (i * 60) + 'ms' }}
            />
          ))}
        </g>
      </Plane>

      {placed > 0 ? (
        <div className="g9-vtable">
          <div className="g9-vtable-row">
            <span className="g9-vtable-lbl">x</span>
            {dots.map((x, i) => (
              <React.Fragment key={'x' + i}>
                {i > 0 ? <span className="g9-mono-rel">{'<'}</span> : null}
                <span className="g9-vtable-cell is-hit" style={{ fontFamily: MATH_FONT }}>{fmt(x)}</span>
              </React.Fragment>
            ))}
          </div>
          <div className="g9-vtable-row">
            <span className="g9-vtable-lbl">y</span>
            {dots.map((x, i) => (
              <React.Fragment key={'y' + i}>
                {i > 0 ? (
                  <span className="g9-mono-rel">{ys[i] > ys[i - 1] ? '<' : ys[i] < ys[i - 1] ? '>' : '='}</span>
                ) : null}
                <span className="g9-vtable-cell is-hit" style={{ fontFamily: MATH_FONT }}>{fmt(f(x))}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : null}

      <Slot mh={48}>
        {!all ? (
          <button type="button" className="g9-go" disabled={!canAnswer} onClick={place}>
            {t(TXT.placeNext)}
          </button>
        ) : null}
      </Slot>

      <Slot mh={62}>
        {done && ruleLine ? <Note kind="ok">{t(ruleLine)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 7. PARITY — JUFTLIK VA TOQLIKNI FARQLASH ISBOTI.
//
// 2026-08-26, metodist: «полное объяснение как доказательство, различать
// эти вещи в одном примере». Bitta funksiya, bitta x — lekin IKKALA sinov
// ham (juftlik VA toqlik) shu bir misolda ochiladi: shuning uchun aynan
// FARQLASH o'rgatiladi, faqat tayyor xulosa aytilmaydi. To'rt qadam:
// f(x) hisoblanadi va nuqta grafikka tushadi, f(−x) hisoblanadi va
// ikkinchi nuqta tushadi (Monotone'dagi kabi bosish bilan, sudramasdan),
// keyin ikkala sinov ham navbat bilan ochiladi — biri mos keladi, biri
// yo'q, va aynan shu qarama-qarshilikdan xulosa chiqadi.
// ============================================================
export function Parity({
  f, x, from, to, yFrom, yTo, xLabel, yLabel, ask, ruleLine, after,
  onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const sc = useMemo(() => scaleOf({ from, to, yFrom, yTo }), [from, to, yFrom, yTo])
  const [stage, setStage] = useState(0)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const fx = f(x)
  const fmx = f(-x)
  const evenOk = fmx === fx
  const oddOk = fmx === -fx

  const next = () => {
    if (!canAnswer || stage >= 4) return
    const n = stage + 1
    setStage(n)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('p' + n)
    if (n >= 4) {
      setDone(true)
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: 1 })
    }
  }

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      <Plane sc={sc} xLabel={xLabel} yLabel={yLabel}>
        <g className="g9-real"><path d={pathOf(f, sc)} /></g>
        <g className="g9-dots">
          {stage >= 1 ? <circle cx={sc.px(x)} cy={sc.py(fx)} r="4.6" /> : null}
          {stage >= 2 ? <circle cx={sc.px(-x)} cy={sc.py(fmx)} r="4.6" /> : null}
        </g>
      </Plane>

      <div className="g9-par-steps">
        {stage >= 1 ? (
          <div className="g9-par-line" style={{ fontFamily: MATH_FONT }}>
            f({fmt(x)}) = {fmt(fx)}
          </div>
        ) : null}
        {stage >= 2 ? (
          <div className="g9-par-line" style={{ fontFamily: MATH_FONT }}>
            f(−{fmt(x)}) = {fmt(fmx)}
          </div>
        ) : null}
        {stage >= 3 ? (
          <div className={'g9-par-line g9-par-check' + (evenOk ? ' is-ok' : ' is-no')}>
            <span className="g9-par-cap">{t(TXT.evenCheck)}</span>
            <span style={{ fontFamily: MATH_FONT }}>
              f(−{fmt(x)}) {evenOk ? '=' : '≠'} f({fmt(x)})
            </span>
            <span className="g9-par-verdict">{t(evenOk ? TXT.matches : TXT.noMatch)}</span>
          </div>
        ) : null}
        {stage >= 4 ? (
          <div className={'g9-par-line g9-par-check' + (oddOk ? ' is-ok' : ' is-no')}>
            <span className="g9-par-cap">{t(TXT.oddCheck)}</span>
            <span style={{ fontFamily: MATH_FONT }}>
              f(−{fmt(x)}) {oddOk ? '=' : '≠'} −f({fmt(x)})
            </span>
            <span className="g9-par-verdict">{t(oddOk ? TXT.matches : TXT.noMatch)}</span>
          </div>
        ) : null}
      </div>

      <Slot mh={48}>
        {!done ? (
          <button type="button" className="g9-go" disabled={!canAnswer} onClick={next}>
            {t(TXT.nextStep)}
          </button>
        ) : null}
      </Slot>

      <Slot mh={62}>
        {done && ruleLine ? <Note kind="ok">{t(ruleLine)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 9. SIGNAXIS — GRAFIK VA SON O'QI (PODXOD_9SINF.md, «Pribor 1»).
// SINFNING BOSH ASBOBI: 13 darsda ishlatiladi (Б1 1-6, Б3 14-20). Bu yerda
// UNING BIRINCHI, SODDA holati — faqat ikki turli haqiqiy nol, teshik nuqta
// yo'q (u 17-darsda qo'shiladi).
//
// Ikki bog'langan qism. Tepada — parabola (Plane). Pastda — son o'qi, xuddi
// shu nollar bilan, lekin tikligsiz: faqat har bir oraliqda ishora.
//
// TO'RT QADAM, hammasi BOSISH bilan: (1) ikkita nolni chipdan o'qqa qo'yish,
// (2) eng o'ng oraliqning ishorasini SONNI QO'YIB isbotlash — bu DALIL,
// taxmin emas, (3) qolgan ikki oraliqning ishorasini GRAFIKDAN o'qib topish
// (Ox dan yuqorimi, pastmi — noto'g'ri tanlov grafikka qaytaradi), (4)
// berilgan tengsizlikka mos oraliq(lar)ni bosib bo'yash. Javob YOZILMAYDI,
// YIG'ILADI: bo'yalgan joy — javobning o'zi.
//
// `strict`: true — qat'iy tengsizlik (>, <), chegara nuqta OCHIQ doira;
// false — qat'iy emas (≥, ≤), chegara nuqta TO'LIQ doira.
// `target`: 'gt' | 'ge' — musbat oraliqlar kerak; 'lt' | 'le' — manfiylar.
//
// `roots` elementi ODDIY SON yoki `{ x, excluded: true }` bo'lishi mumkin
// (2026-08-27, 17-dars: kasr-ratsional tengsizlik). Oddiy sonda nuqta turi
// `strict` ga qarab belgilanadi — bu numeratorning nol nuqtasi. `excluded:
// true` bo'lsa nuqta HAR DOIM ochiq, `strict` qiymatidan qat'i nazar — bu
// maxrajning nol nuqtasi, u qat'iy bo'lmagan tengsizlikda ham javobga
// kirmaydi, chunki bo'lishda nolga bo'lish aniqlanmagan.
// ============================================================
export function SignAxis({
  f, from, to, yFrom, yTo, roots, strict, target,
  ask, after, xLabel, yLabel,
  onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const sc = useMemo(() => scaleOf({ from, to, yFrom, yTo }), [from, to, yFrom, yTo])
  // O'ZINING kichik masshtabi: `scaleOf` katta tekislikning 200-balandlik
  // koordinatasiga moslangan, 74-balandlikdagi o'q panelida ishlatilsa,
  // chiziq CHARчavadan tashqarida chizilib, umuman ko'rinmay qoladi (2026-08-27
  // topilgan xato). Chap-o'ng chegara katta tekislik bilan BIR XIL, shu
  // sabab ikkala qism ustma-ust to'g'ri keladi.
  const AXIS_H = 74
  const axisSc = useMemo(() => ({
    left: VB.l,
    right: VB.w - VB.r,
    px: (x) => VB.l + ((x - from) / (to - from)) * ((VB.w - VB.r) - VB.l),
  }), [from, to])
  const baseY = AXIS_H / 2
  const r = useMemo(() => roots
    .map((v) => (typeof v === 'object' ? v : { x: v, excluded: false }))
    .sort((a, b) => a.x - b.x), [roots])

  const [placed, setPlaced] = useState([])
  const [tested, setTested] = useState(false)
  const [signs, setSigns] = useState({})
  const [wrongAt, setWrongAt] = useState(null)
  const [painted, setPainted] = useState([])
  const [note, setNote] = useState(null)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const bothPlaced = placed.length >= r.length
  const bounds = [from, ...r.map((rr) => rr.x), to]
  const intervalCount = r.length + 1
  const lastI = intervalCount - 1
  const mid = (i) => (bounds[i] + bounds[i + 1]) / 2
  const realSign = (i) => (f(mid(i)) > 0 ? '+' : '-')
  const allSigns = Object.keys(signs).length >= intervalCount

  const placeRoot = (k) => {
    if (!canAnswer || placed.includes(k)) return
    const next = placed.concat([k])
    setPlaced(next)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('root' + next.length)
  }

  const runTest = () => {
    if (!canAnswer || tested || !bothPlaced) return
    setSigns((s) => ({ ...s, [lastI]: realSign(lastI) }))
    setTested(true)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('test')
  }

  const pickSign = (i, guess) => {
    if (!canAnswer || !tested || signs[i] !== undefined) return
    const real = realSign(i)
    if (guess !== real) {
      setWrongAt(i)
      setNote(TXT.saHint)
      sfx.playWrong()
      return
    }
    setWrongAt(null)
    setNote(null)
    setSigns((s) => ({ ...s, [i]: real }))
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('sign' + i)
  }

  const togglePaint = (i) => {
    if (!canAnswer || !allSigns || done) return
    setPainted((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.concat([i])))
    setNote(null)
  }

  const wants = (i) => (target === 'gt' || target === 'ge' ? signs[i] === '+' : signs[i] === '-')

  const confirm = () => {
    if (!canAnswer || !allSigns || done) return
    const all = Array.from({ length: intervalCount }, (_, i) => i)
    const want = all.filter(wants)
    const ok = want.length === painted.length && want.every((i) => painted.includes(i))
    if (!ok) {
      sfx.playWrong()
      setNote(TXT.saTryAgain)
      return
    }
    sfx.playCorrect()
    setDone(true)
    setNote(after || null)
    if (audio && after) audio.say(t(after))
    if (stepRef.current) stepRef.current('paint')
    if (onSolved) onSolved({ correct: true, tries: 1 })
  }

  const labelOf = (i) => (signs[i] === undefined ? '?' : signs[i])

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      <Plane sc={sc} xLabel={xLabel} yLabel={yLabel}>
        <g className="g9-real"><path d={pathOf(f, sc)} /></g>
        <line className="g9-sa-ox" x1={sc.left} y1={sc.py(0)} x2={sc.right} y2={sc.py(0)} />
      </Plane>

      {!bothPlaced ? (
        <div className="g9-chips">
          {r.map((rr, k) => (
            <button
              key={'r' + k}
              type="button"
              className={'g9-chip' + (placed.includes(k) ? ' is-used' : '')}
              style={{ fontFamily: MATH_FONT }}
              disabled={!canAnswer || placed.includes(k)}
              onClick={() => placeRoot(k)}
            >
              x = {fmt(rr.x)}
            </button>
          ))}
        </div>
      ) : null}

      {bothPlaced ? (
        <svg className="g9-sa" viewBox={'0 0 ' + VB.w + ' ' + AXIS_H} preserveAspectRatio="xMidYMid meet" role="img">
          <line className="g9-sa-line" x1={axisSc.left} y1={baseY} x2={axisSc.right} y2={baseY} />
          {r.map((rr, k) => (
            <g key={'d' + k}>
              <circle
                className={'g9-sa-dot' + ((strict || rr.excluded) ? ' is-open' : ' is-filled')}
                cx={axisSc.px(rr.x)} cy={baseY} r="4.4"
              />
              <text className="g9-sa-rootlabel" x={axisSc.px(rr.x)} y={baseY + 20} textAnchor="middle"
                style={{ fontFamily: MATH_FONT }}>{fmt(rr.x)}</text>
            </g>
          ))}
          {Array.from({ length: intervalCount }, (_, i) => i).map((i) => {
            const x1 = axisSc.px(Math.max(bounds[i], from))
            const x2 = axisSc.px(Math.min(bounds[i + 1], to))
            const known = signs[i] !== undefined
            const isPainted = painted.includes(i)
            return (
              <g key={'seg' + i}>
                <line
                  className={'g9-sa-seg'
                    + (known ? ' is-known' : '')
                    + (isPainted ? ' is-painted' : '')
                    + (wrongAt === i ? ' is-wrong' : '')}
                  x1={x1} y1={baseY} x2={x2} y2={baseY}
                />
                <text className="g9-sa-sign" x={(x1 + x2) / 2} y={baseY - 10} textAnchor="middle">
                  {labelOf(i)}
                </text>
                {canAnswer && !done && allSigns ? (
                  <rect
                    x={x1} y={baseY - 26} width={Math.max(x2 - x1, 1)} height="52"
                    className="g9-sa-hit"
                    data-seg={i}
                    onClick={() => togglePaint(i)}
                  />
                ) : null}
              </g>
            )
          })}
        </svg>
      ) : null}

      {bothPlaced && !tested ? (
        <button type="button" className="g9-go" disabled={!canAnswer} onClick={runTest}>
          {t(TXT.saTest)}
        </button>
      ) : null}

      <Slot mh={26}>
        {tested && signs[lastI] !== undefined ? (
          <div className="g9-sa-note" style={{ fontFamily: MATH_FONT }}>
            x = {fmt(mid(lastI))}: f(x) {signs[lastI] === '+' ? '>' : '<'} 0
          </div>
        ) : null}
      </Slot>

      {tested && !allSigns ? (
        <div className="g9-sa-picks">
          {Array.from({ length: lastI }, (_, i) => i).filter((i) => signs[i] === undefined).map((i) => (
            <div key={'pk' + i} className="g9-sa-pickrow">
              <span className="g9-sa-picklabel" style={{ fontFamily: MATH_FONT }}>
                {i === 0 ? ('x < ' + fmt(bounds[1])) : (fmt(bounds[i]) + ' < x < ' + fmt(bounds[i + 1]))}
              </span>
              <button type="button" className="g9-chip" disabled={!canAnswer} onClick={() => pickSign(i, '+')}>+</button>
              <button type="button" className="g9-chip" disabled={!canAnswer} onClick={() => pickSign(i, '-')}>−</button>
            </div>
          ))}
        </div>
      ) : null}

      {allSigns && !done ? (
        <button type="button" className="g9-go" disabled={!canAnswer} onClick={confirm}>
          {t(TXT.saConfirm)}
        </button>
      ) : null}

      <Slot mh={52}>
        {note ? <Note kind={done ? 'ok' : 'no'}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 10. TRACK — TENGLAMA: HAR IKKI TOMONGA BIRDAN QADAM (PODXOD_9SINF.md,
// «Pribor 4»). 7 darsda ishlatiladi (Б2, 7-13). Bu yerda UNING BIRINCHI,
// SODDA holati — butun tenglama (maxrajda harf yo'q), begona ildiz xavfi
// yo'q, shuning uchun ⚠ belgisi hali ishlatilmaydi.
//
// Yozuv ostida doim kichik satr turadi: qaysi x larda tenglik to'g'ri.
// Boshida noma'lum (?), oxirida bitta son ({ 2 } kabi). Bu prибор
// KENGAYTIRILADI: 8-darsda (kasr-ratsional) `to.set` ichiga `risky: true`
// bilan begona ildiz qo'shiladi va ⚠ belgisi shu yerdan chiqadi — asbobning
// o'zi o'zgarmaydi, faqat ma'lumot boyiydi.
//
// Har qadamda TO'G'RI amal bilan bir yoki ikkita ISHORA XATOSI variant
// beriladi (qavs ochishda yoki had ko'chirishda) — noto'g'ri bosilganda
// asbob TAYYOR javob bermaydi, faqat izoh (`hint`) beradi.
// ============================================================
export function Track({
  start, steps, note, checkAsk, checkFn, onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [at, setAt] = useState(0)
  const [rec, setRec] = useState(start)
  const [wrong, setWrong] = useState([])
  const [msg, setMsg] = useState(null)
  const [msgOk, setMsgOk] = useState(false)
  const [done, setDone] = useState(false)
  const [checked, setChecked] = useState(false)
  const [verified, setVerified] = useState(null)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const step = steps[at]
  const set = rec.set || []
  const hasRisky = set.some((s) => s.risky)
  const needsCheck = !!checkFn && hasRisky

  const pick = (opt) => {
    if (!canAnswer || done) return
    const src = step.actions.find((a) => a.id === opt.id)
    if (!src) return
    if (src.right) {
      setRec(src.to)
      setWrong([])
      setMsg(src.note || null)
      setMsgOk(true)
      sfx.playCorrect()
      if (stepRef.current) stepRef.current('a' + (at + 1))
      if (audio && src.note) audio.say(t(src.note))
      const next = at + 1
      if (next >= steps.length) {
        setDone(true)
        // Xavfli nomzod bo'lsa, `onSolved` TEKSHIRUV bosilgach chaqiriladi
        // (`runCheck`): rad etish o'quvchining o'z bosishi bilan sodir
        // bo'ladi, avtomatik emas (PODXOD_9SINF.md, «Pribor 4»).
        if (!needsCheck && onSolved) onSolved({ correct: true, tries: 1 })
      } else {
        setAt(next)
      }
      return
    }
    setWrong((p) => (p.includes(opt.id) ? p : p.concat(opt.id)))
    setMsg(src.hint || null)
    setMsgOk(false)
    sfx.playWrong()
    if (audio && src.hint) audio.say(t(src.hint))
  }

  const runCheck = () => {
    if (!canAnswer || checked) return
    const result = {}
    set.forEach((s, i) => { result[i] = checkFn(s.value) })
    setVerified(result)
    setChecked(true)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('check')
    if (audio && note) audio.say(t(note))
    if (onSolved) onSolved({ correct: true, tries: 1 })
  }

  const showFinalNote = done && (!needsCheck || checked)

  return (
    <>
      <div className="g9-tr">
        <div className="g9-tr-rec" style={{ fontFamily: MATH_FONT }}>
          <span>{rec.left}</span>
          <span className="g9-tr-eq">=</span>
          <span>{rec.right}</span>
        </div>
        <div className="g9-tr-set" style={{ fontFamily: MATH_FONT }}>
          {'{ '}
          {set.length ? set.map((s, i) => {
            const v = verified ? verified[i] : undefined
            return (
              <span key={i} className={'g9-tr-item'
                + (s.risky && v === undefined ? ' is-risky' : '')
                + (v === false ? ' is-struck' : '')
                + (v === true ? ' is-ok' : '')}>
                {s.value}{s.risky && v === undefined ? ' ⚠' : ''}{i < set.length - 1 ? ', ' : ''}
              </span>
            )
          }) : <span className="g9-tr-unknown">?</span>}
          {' }'}
        </div>
      </div>

      <Slot mh={54}>
        {!done ? (
          <div className="g9-tr-ask">
            <Ask>{t(step.ask)}</Ask>
            <div className="g9-tr-acts">
              {step.actions.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={'g9-chip' + (wrong.includes(a.id) ? ' is-stuck' : '')}
                  style={{ fontFamily: MATH_FONT }}
                  disabled={!canAnswer}
                  onClick={() => pick(a)}
                >
                  {t(a.label)}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {done && needsCheck && !checked ? (
          <div className="g9-tr-ask">
            <Ask>{t(checkAsk)}</Ask>
            <button type="button" className="g9-go" disabled={!canAnswer} onClick={runCheck}>
              {t(TXT.saTest)}
            </button>
          </div>
        ) : null}
      </Slot>

      <Slot mh={52}>
        {showFinalNote && note ? <Note kind="ok">{t(note)}</Note> : (msg ? <Note kind={msgOk ? 'ok' : 'no'}>{t(msg)}</Note> : null)}
      </Slot>
    </>
  )
}

// ============================================================
// 11. OVERLAP — TENGSIZLIKLAR TIZIMI: IKKI QATORNI USTMA-UST QO'YISH
// (yangi prибор, 16-darsda birinchi marta, PODXOD_9SINF.md da oldindan
// rejalashtirilmagan — mavzudan chiqdi). 18-darsda («majmua») xuddi shu
// asbob `mode="or"` bilan qayta ishlatiladi: kod EMAS, gapga qarab
// tanlangan `mode` o'zgaradi.
//
// Har bir tengsizlikning yechimi allaqachon TOPILGAN va tayyor holda
// keladi (`layers[i].intervals`) — bu asbob ildiz IZLAMAYDI, u FAQAT
// ikki (yoki undan ortiq) tayyor yechimni bitta o'qda solishtiradi.
// Yuqorida har bir tengsizlikning o'z qatori (faqat ma'lumot uchun,
// bosilmaydi), pastda esa umumiy o'q: o'quvchi har ikkala qatorga ham
// mos keladigan (mode="and") yoki kamida bittasiga mos keladigan
// (mode="or") oraliqlarni bosib bo'yaydi. Chegara nuqtaning ochiq yoki
// yopiqligi HISOBLAB chiqariladi (qaysi tengsizlikdan kelgani qo'lda
// kuzatilmaydi): nuqta natijaga kirsa — yopiq, kirmasa — ochiq.
// ============================================================
export function Overlap({
  from, to, layers, mode = 'and', layerLabels,
  ask, after, onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)

  const axisSc = useMemo(() => ({
    left: VB.l,
    right: VB.w - VB.r,
    px: (x) => VB.l + ((x - from) / (to - from)) * ((VB.w - VB.r) - VB.l),
  }), [from, to])

  const covers = (layer, x) => layer.intervals.some((iv) => {
    const loOk = iv.openA ? x > iv.a : x >= iv.a
    const hiOk = iv.openB ? x < iv.b : x <= iv.b
    return loOk && hiOk
  })
  const combined = (x) => {
    const flags = layers.map((l) => covers(l, x))
    return mode === 'and' ? flags.every(Boolean) : flags.some(Boolean)
  }

  const bounds = useMemo(() => {
    const pts = new Set([from, to])
    layers.forEach((l) => l.intervals.forEach((iv) => {
      if (iv.a > from && iv.a < to) pts.add(iv.a)
      if (iv.b > from && iv.b < to) pts.add(iv.b)
    }))
    return Array.from(pts).sort((a, b) => a - b)
  }, [from, to, layers])
  const segCount = bounds.length - 1
  const mid = (i) => (bounds[i] + bounds[i + 1]) / 2
  const wants = (i) => combined(mid(i))

  const [painted, setPainted] = useState([])
  const [done, setDone] = useState(false)
  const [note, setNote] = useState(null)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const togglePaint = (i) => {
    if (!canAnswer || done) return
    setPainted((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.concat([i])))
    setNote(null)
  }

  const confirm = () => {
    if (!canAnswer || done) return
    const all = Array.from({ length: segCount }, (_, i) => i)
    const want = all.filter(wants)
    const ok = want.length === painted.length && want.every((i) => painted.includes(i))
    if (!ok) {
      sfx.playWrong()
      setNote(TXT.ovTryAgain)
      return
    }
    sfx.playCorrect()
    setDone(true)
    setNote(after || null)
    if (audio && after) audio.say(t(after))
    if (stepRef.current) stepRef.current('paint')
    if (onSolved) onSolved({ correct: true, tries: 1 })
  }

  const STRIP_H = 34
  const AXIS_H = 56

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      <div className="g9-ov">
        {layers.map((layer, li) => (
          <div key={'layer' + li} className="g9-ov-row">
            {layerLabels && layerLabels[li] ? (
              <div className="g9-ov-label">{t(layerLabels[li])}</div>
            ) : null}
            <svg className="g9-ov-strip" viewBox={'0 0 ' + VB.w + ' ' + STRIP_H} preserveAspectRatio="xMidYMid meet" role="img">
              <line className="g9-ov-base" x1={axisSc.left} y1={STRIP_H / 2} x2={axisSc.right} y2={STRIP_H / 2} />
              {layer.intervals.map((iv, ii) => {
                const x1 = axisSc.px(Math.max(iv.a, from))
                const x2 = axisSc.px(Math.min(iv.b, to))
                return <line key={'seg' + ii} className="g9-ov-seg" x1={x1} y1={STRIP_H / 2} x2={x2} y2={STRIP_H / 2} />
              })}
              {layer.intervals.flatMap((iv, ii) => ([
                (iv.a > from && iv.a < to) ? (
                  <circle key={ii + 'a'} className={'g9-ov-dot' + (iv.openA ? ' is-open' : ' is-filled')}
                    cx={axisSc.px(iv.a)} cy={STRIP_H / 2} r="4" />
                ) : null,
                (iv.b > from && iv.b < to) ? (
                  <circle key={ii + 'b'} className={'g9-ov-dot' + (iv.openB ? ' is-open' : ' is-filled')}
                    cx={axisSc.px(iv.b)} cy={STRIP_H / 2} r="4" />
                ) : null,
              ]))}
            </svg>
          </div>
        ))}

        <svg className="g9-ov-axis" viewBox={'0 0 ' + VB.w + ' ' + AXIS_H} preserveAspectRatio="xMidYMid meet" role="img">
          <line className="g9-sa-line" x1={axisSc.left} y1={AXIS_H / 2} x2={axisSc.right} y2={AXIS_H / 2} />
          {bounds.slice(1, -1).map((p, i) => (
            <g key={'b' + i}>
              <circle className={'g9-sa-dot' + (combined(p) ? ' is-filled' : ' is-open')}
                cx={axisSc.px(p)} cy={AXIS_H / 2} r="4.4" />
              <text className="g9-sa-rootlabel" x={axisSc.px(p)} y={AXIS_H / 2 + 20} textAnchor="middle"
                style={{ fontFamily: MATH_FONT }}>{fmt(p)}</text>
            </g>
          ))}
          {Array.from({ length: segCount }, (_, i) => i).map((i) => {
            const x1 = axisSc.px(Math.max(bounds[i], from))
            const x2 = axisSc.px(Math.min(bounds[i + 1], to))
            const isPainted = painted.includes(i)
            return (
              <g key={'s' + i}>
                <line className={'g9-sa-seg is-known' + (isPainted ? ' is-painted' : '')}
                  x1={x1} y1={AXIS_H / 2} x2={x2} y2={AXIS_H / 2} />
                {canAnswer && !done ? (
                  <rect x={x1} y={AXIS_H / 2 - 26} width={Math.max(x2 - x1, 1)} height="52"
                    className="g9-sa-hit" data-seg={i} onClick={() => togglePaint(i)} />
                ) : null}
              </g>
            )
          })}
        </svg>
      </div>

      {!done ? (
        <button type="button" className="g9-go" disabled={!canAnswer} onClick={confirm}>
          {t(TXT.ovConfirm)}
        </button>
      ) : null}

      <Slot mh={52}>
        {note ? <Note kind={done ? 'ok' : 'no'}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 12. SEQTABLE — KETMA-KETLIK JADVALI (PODXOD_9SINF.md, «Pribor 5»).
// 7 darsda ishlatiladi (B4, 21-27). BLOK B4 NING BOSH ASBOBI.
//
// NEGA YANGI ASBOB KERAK BO'LDI. B3 blokining uchta darsi yangi asbobsiz
// yig'ilgan edi va bu to'g'ri qaror edi: u yerda o'quvchining QO'L HARAKATI
// eskisi bo'lib qolgan (o'qqa nuqta qo'yish, oraliq bo'yash, yozma
// chiqarishni o'qish). Bu yerda harakat BOSHQA: jadvalni birma-bir
// to'ldirish va to'ldirilgan jadvaldan qonuniyatni ko'rish. Shu sababli
// asbob yangi.
//
// TO'LDIRISH CHAPDAN O'NGGA. Har katak uchun ANIQ IKKI variant: to'g'risi
// va bitta YAQIN xato (odatda tartib raqamini formulaga noto'g'ri qo'yish
// natijasi). Xato bosilsa katak bo'sh qoladi va izoh chiqadi — tayyor
// javob berilmaydi. Jadval to'lgach, u o'quvchining O'Z jadvali bo'ladi:
// keyingi ekranlarda formulani aynan undan o'qiydi.
//
// `rule` — jadval tepasidagi qoida (formula yoki rekurrent shart).
// `cells[i]` — { value, wrong, hint }: hammasi ODDIY SATR bo'lishi shart
// emas, `hint` tarjima qilinadi, `value` va `wrong` esa matematika, ular
// uch tilda bir xil ko'rinadi.
// ============================================================
export function SeqTable({
  rule, ns, cells, ask, after, onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [filled, setFilled] = useState([])
  const [note, setNote] = useState(null)
  const [wrongNow, setWrongNow] = useState(false)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const at = filled.length
  const cur = at < cells.length ? cells[at] : null

  // Tugmalar o'rni MOUNTDA bir marta aralashadi. `useMemo(..., [cells])`
  // ishlatilsa, ovoz holati o'zgarganda massiv yangi bo'lib keladi va
  // tugmalar o'rin almashadi (Dars08, RuleBuild bilan bo'lgan xato).
  const [flip] = useState(() => cells.map(() => Math.random() < 0.5))

  const pick = (val) => {
    if (!canAnswer || done || !cur) return
    if (val !== cur.value) {
      setWrongNow(true)
      setNote(cur.hint || null)
      sfx.playWrong()
      return
    }
    const next = filled.concat([val])
    setWrongNow(false)
    setNote(null)
    setFilled(next)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('cell' + next.length)
    if (next.length >= cells.length) {
      setDone(true)
      setNote(after || null)
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: 1 })
    }
  }

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      {rule ? (
        <div className="g9-seq-rule" style={{ fontFamily: MATH_FONT }}>{t(rule)}</div>
      ) : null}

      <div className="g9-seq" style={{ gridTemplateColumns: 'repeat(' + ns.length + ', 1fr)' }}>
        {ns.map((n, i) => (
          <div key={'h' + i} className="g9-seq-n" style={{ fontFamily: MATH_FONT }}>n = {n}</div>
        ))}
        {ns.map((n, i) => (
          <div
            key={'c' + i}
            className={'g9-seq-cell'
              + (i < filled.length ? ' is-set' : '')
              + (i === at && !done ? ' is-now' : '')
              + (i === at && wrongNow ? ' is-wrong' : '')}
            style={{ fontFamily: MATH_FONT }}
          >
            {i < filled.length ? filled[i] : (i === at ? '?' : '')}
          </div>
        ))}
      </div>

      <Slot mh={54}>
        {!done && cur ? (
          <div className="g9-chips">
            {(flip[at] ? [cur.wrong, cur.value] : [cur.value, cur.wrong]).map((v, k) => (
              <button
                key={'o' + k}
                type="button"
                className="g9-chip"
                style={{ fontFamily: MATH_FONT }}
                disabled={!canAnswer}
                onClick={() => pick(v)}
              >
                {v}
              </button>
            ))}
          </div>
        ) : null}
      </Slot>

      <Slot mh={52}>
        {note ? <Note kind={done ? 'ok' : 'no'}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 7C. SortRow — QATORNI TARTIBLASH VA O'RTASINI TOPISH.
//
// NEGA YANGI ASBOB. Sinfning qoidasi: yangi asbob yangi MAVZUGA emas,
// yangi QO'L HARAKATIGA beriladi. Statistikada shunday harakat bor —
// sonlarni o'sish tartibida terib chiqish. Uni SeqTable ham, RecallMC
// ham bajara olmaydi: u yerda javob tanlanadi, bu yerda esa qator
// QURILADI, va har qadamda qolganlarning eng kichigi izlanadi.
//
// NEGA AYNAN SHUNDAY ISHLAYDI. Mediana xatosining sababi deyarli har
// doim bitta — qator tartiblanmagan. Asbob shu xatoni jismonan imkonsiz
// qiladi: tartib buzilsa, son o'z joyiga tushmaydi. Qator to'lgach,
// o'rtasi O'ZI yonib turadi (toq bo'lsa bitta katak, juft bo'lsa
// ikkitasi) — bola medianani sanab emas, ko'rib topadi.
//
// Takrorlanuvchi sonlar bo'lishi mumkin (8, 2, 0, 5, −5, 4, 8): tanlov
// QIYMAT bo'yicha tekshiriladi, qaysi nusxa bosilgani ahamiyatsiz.
//
// `values` — xom, tartiblanmagan massiv (sonlar).
// `hint`   — tartib buzilganda chiqadigan izoh.
// `after`  — qator to'lgandagi xulosa.
// ============================================================
export function SortRow({ values, ask, hint, after, onSolved, audio, onStep }) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [placed, setPlaced] = useState([])
  const [note, setNote] = useState(null)
  const [wrongAt, setWrongAt] = useState(null)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  // Manba qator MOUNTDA bir marta aralashtiriladi emas — u allaqachon
  // tartibsiz berilgan. Lekin qaysi nusxa olinganini bilish uchun har
  // bir elementga indeks biriktiriladi.
  const taken = placed.map((p) => p.i)
  const rest = values.map((v, i) => ({ v, i })).filter((o) => !taken.includes(o.i))
  const need = rest.length ? Math.min.apply(null, rest.map((o) => o.v)) : null

  const pick = (o) => {
    if (!canAnswer || done) return
    if (o.v !== need) {
      setWrongAt(o.i)
      setNote(hint || null)
      sfx.playWrong()
      return
    }
    const next = placed.concat([o])
    setWrongAt(null)
    setNote(null)
    setPlaced(next)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('sort' + next.length)
    if (next.length >= values.length) {
      setDone(true)
      setNote(after || null)
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: 1 })
    }
  }

  // O'RTA KATAKLAR. Toq uzunlikda bitta, juftda ikkita. Faqat qator
  // to'lgandan keyin yonadi: yarim tartiblangan qatorning o'rtasi
  // mediana emas, va uni oldindan ko'rsatish yolg'on bo'lardi.
  const n = values.length
  const mid = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2]

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      <div className="g9-sort-bag">
        {values.map((v, i) => (
          taken.includes(i) ? (
            <span key={'g' + i} className="g9-sort-gone" style={{ fontFamily: MATH_FONT }}>{v}</span>
          ) : (
            <button
              key={'b' + i}
              type="button"
              className={'g9-sort-src' + (wrongAt === i ? ' is-wrong' : '')}
              style={{ fontFamily: MATH_FONT }}
              disabled={!canAnswer || done}
              onClick={() => pick({ v, i })}
            >
              {v}
            </button>
          )
        ))}
      </div>

      <div className="g9-sort-row" style={{ '--sort-cols': n }}>
        {values.map((_, k) => (
          <div
            key={'s' + k}
            className={'g9-sort-cell'
              + (k < placed.length ? ' is-set' : '')
              + (k === placed.length && !done ? ' is-now' : '')
              + (done && mid.indexOf(k) >= 0 ? ' is-mid' : '')}
            style={{ fontFamily: MATH_FONT }}
          >
            {k < placed.length ? placed[k].v : ''}
          </div>
        ))}
      </div>

      <Slot mh={52}>
        {note ? <Note kind={done ? 'ok' : 'no'}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 7D. FreqRun — NISBIY CHASTOTANING BARQARORLASHUVI.
//
// NEGA ASBOB KERAK. Katta sonlar qonunini gapirib berish mumkin emas:
// «tajribalar ko'paygan sari chastota barqarorlashadi» degan jumla
// bolaga isbot emas, iltimos bo'lib qoladi. Uni KO'RSATISH kerak —
// birinchi o'nlikda chastota sakraydi, ikki yuzinchidan keyin esa
// chiziqqa yopishib qoladi. Shuning uchun bu yerda bola tajribani
// O'ZI o'tkazadi: har bosishda navbatdagi partiya tashlanadi va
// siniq chiziq o'sib boradi.
//
// TASODIF QAT'IY BERILGAN (mulberry32, `seed`). Sabab ikkita: bir xil
// urinishda bir xil rasm chiqishi kerak (aks holda tushuntirish
// «bugun shunday chiqdi» ga aylanadi), va stend har safar bir xil
// natijani o'lchashi kerak. Generatorning YUQORI bitlari olinadi —
// past bitlar bo'yicha qiyshiq taqsimot 7-sinfda bir marta tutilgan.
//
// `p`      — nazariy ehtimollik, gorizontal chiziq shu yerda turadi.
// `batch`  — bitta bosishda nechta tajriba.
// `maxN`   — jami tajribalar soni, shunga yetganda ekran yechilgan.
// ============================================================
export function FreqRun({
  p = 0.5, plan = [10, 10, 10, 20, 50, 100, 150, 150], seed = 513,
  ask, runLabel, axisX, axisY, targetLabel, after, onSolved, audio, onStep,
}) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [pts, setPts] = useState([])   // [{ n, w }]
  const [hits, setHits] = useState(0)
  const [tot, setTot] = useState(0)
  const [note, setNote] = useState(null)
  const [done, setDone] = useState(false)
  const rndRef = useRef(null)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  if (!rndRef.current) {
    let a = seed >>> 0
    rndRef.current = () => {
      a = (a + 0x6D2B79F5) >>> 0
      let x = Math.imul(a ^ (a >>> 15), 1 | a)
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296
    }
  }

  const maxN = plan.reduce((a, b) => a + b, 0)
  const nextBatch = pts.length < plan.length ? plan[pts.length] : 0

  const run = () => {
    if (!canAnswer || done || !nextBatch) return
    let h = hits
    for (let i = 0; i < nextBatch; i += 1) { if (rndRef.current() < p) h += 1 }
    const n = tot + nextBatch
    setHits(h)
    setTot(n)
    setPts(pts.concat([{ n, w: h / n }]))
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('run' + n)
    if (n >= maxN) {
      setDone(true)
      setNote(after || null)
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: 1 })
    }
  }

  // CHIZMA. viewBox qat'iy, o'lchov CSS bilan beriladi — telefonda
  // ham, noutbukda ham bir xil nisbatda ko'rinadi.
  const W = 320, H = 150, PADL = 34, PADB = 22, PADT = 8, PADR = 8
  const x = (n) => PADL + (n / maxN) * (W - PADL - PADR)
  const y = (w) => PADT + (1 - w) * (H - PADT - PADB)
  const path = pts.map((o, i) => (i ? 'L' : 'M') + x(o.n).toFixed(1) + ' ' + y(o.w).toFixed(1)).join(' ')
  const last = pts.length ? pts[pts.length - 1] : null

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      <div className="g9-fr-wrap">
        <svg className="g9-fr-svg" viewBox={'0 0 ' + W + ' ' + H} role="img">
          {[0, 0.5, 1].map((v) => (
            <g key={'g' + v}>
              <line x1={PADL} y1={y(v)} x2={W - PADR} y2={y(v)} className="g9-fr-grid" />
              <text x={PADL - 5} y={y(v) + 3} className="g9-fr-tick" textAnchor="end">{v}</text>
            </g>
          ))}
          <line x1={PADL} y1={y(p)} x2={W - PADR} y2={y(p)} className="g9-fr-target" />
          <text x={W - PADR} y={y(p) - 4} className="g9-fr-tlab" textAnchor="end">
            {targetLabel ? t(targetLabel) : String(p)}
          </text>
          <line x1={PADL} y1={PADT} x2={PADL} y2={H - PADB} className="g9-fr-axis" />
          <line x1={PADL} y1={H - PADB} x2={W - PADR} y2={H - PADB} className="g9-fr-axis" />
          {path ? <path d={path} className="g9-fr-line" /> : null}
          {last ? <circle cx={x(last.n)} cy={y(last.w)} r="3.2" className="g9-fr-dot" /> : null}
          <text x={W - PADR} y={H - 6} className="g9-fr-ax" textAnchor="end">{axisX ? t(axisX) : ''}</text>
          <text x={PADL - 26} y={PADT + 6} className="g9-fr-ax" textAnchor="start">{axisY ? t(axisY) : ''}</text>
        </svg>

        <div className="g9-fr-read" style={{ fontFamily: MATH_FONT }}>
          <span>N = {tot}</span>
          <span>M = {hits}</span>
          <span>W = {tot ? (hits / tot).toFixed(4).replace('.', t(L(',', ',', '.'))) : '—'}</span>
        </div>
      </div>

      <Slot mh={54}>
        {!done ? (
          <div className="g9-chips">
            <button
              type="button"
              className="g9-chip"
              disabled={!canAnswer}
              onClick={run}
            >
              {(runLabel ? t(runLabel) + ' ' : '') + '+' + nextBatch}
            </button>
          </div>
        ) : null}
      </Slot>

      <Slot mh={52}>
        {note ? <Note kind="ok">{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 7E. TreeBranch — VARIANTLAR DARAXTI.
//
// NEGA ASBOB KERAK. Ko'paytirish qoidasini aytib berish mumkin, lekin
// «nega ko'paytiriladi, qo'shilmaydi» degan savolga so'z javob bermaydi.
// Javob CHIZMADA: birinchi tanlovning har bir shoxidan ikkinchi
// tanlovning HAMMA shoxlari chiqadi, shuning uchun yo'llar soni
// ko'payadi. Bola darajalarni birma-bir ochadi va shoxlar ko'payishini
// o'z ko'zi bilan ko'radi, pastdagi hisoblagich esa har qadamda
// ko'paytmani yozib boradi.
//
// `levels` — [{ cap, items: [...] }], har bir daraja bitta tanlov.
// Ikkitadan ko'p daraja bermaslik kerak: uchinchi darajada barglar
// telefonga sig'may qoladi.
// ============================================================
export function TreeBranch({ levels, ask, openLabel, after, onSolved, audio, onStep }) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [open, setOpen] = useState(0)
  const [note, setNote] = useState(null)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const openNext = () => {
    if (!canAnswer || done) return
    const n = open + 1
    setOpen(n)
    sfx.playCorrect()
    if (stepRef.current) stepRef.current('lvl' + n)
    if (n >= levels.length) {
      setDone(true)
      setNote(after || null)
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: 1 })
    }
  }

  const counts = levels.map((lv) => lv.items.length)
  const paths = counts.slice(0, open).reduce((a, b) => a * b, 1)

  // GEOMETRIYA. Ildiz chapda, darajalar o'ngga qarab ochiladi —
  // vertikal daraxt telefonda tor bo'lib qoladi, gorizontali esa
  // barglarni ustma-ust qo'ymaydi.
  const W = 330, H = 168, X0 = 18
  const colX = (i) => X0 + 46 + i * 118
  const leaves = counts.slice(0, Math.max(open, 1)).reduce((a, b) => a * b, 1)
  const rowY = (k, total) => (H / (total + 1)) * (k + 1)

  const nodes = []          // [{ x, y, label, px, py }]
  let prev = [{ x: X0, y: H / 2 }]
  for (let li = 0; li < open; li += 1) {
    const items = levels[li].items
    const next = []
    const total = prev.length * items.length
    let k = 0
    prev.forEach((par) => {
      items.forEach((it) => {
        const y = rowY(k, total)
        const x = colX(li)
        nodes.push({ x, y, label: it, px: par.x, py: par.y, li })
        next.push({ x, y })
        k += 1
      })
    })
    prev = next
  }

  return (
    <>
      <Slot mh={40}>{ask ? <Ask>{t(ask)}</Ask> : null}</Slot>

      <div className="g9-tree-wrap">
        <svg className="g9-tree-svg" viewBox={'0 0 ' + W + ' ' + H} role="img">
          <circle cx={X0} cy={H / 2} r="5" className="g9-tree-root" />
          {nodes.map((nd, i) => (
            <line key={'e' + i} x1={nd.px} y1={nd.py} x2={nd.x - 2} y2={nd.y} className="g9-tree-edge" />
          ))}
          {nodes.map((nd, i) => (
            <g key={'n' + i}>
              <circle cx={nd.x} cy={nd.y} r="3.4" className="g9-tree-dot" />
              <text x={nd.x + 6} y={nd.y + 3.4} className="g9-tree-lab">{t(nd.label)}</text>
            </g>
          ))}
          {levels.map((lv, i) => (
            i < open ? (
              <text key={'c' + i} x={colX(i)} y="10" className="g9-tree-cap">{t(lv.cap)}</text>
            ) : null
          ))}
        </svg>

        <div className="g9-tree-read" style={{ fontFamily: MATH_FONT }}>
          {open === 0 ? '?' : counts.slice(0, open).join(' · ') + ' = ' + paths}
        </div>
      </div>

      <Slot mh={54}>
        {!done ? (
          <div className="g9-chips">
            <button type="button" className="g9-chip" disabled={!canAnswer} onClick={openNext}>
              {openLabel ? t(openLabel) : '+'}
            </button>
          </div>
        ) : null}
      </Slot>

      <Slot mh={52}>
        {note ? <Note kind="ok">{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 7F. UnitCircle — BIRLIK AYLANA VA NUQTANI BURISH.
//
// NEGA ASBOB KERAK. Trigonometriyaning butun ta'rifi bitta harakatda:
// (1; 0) nuqtani burchakka BURISH va hosil bo'lgan nuqtaning
// koordinatalarini o'qish. Kosinus — abssissa, sinus — ordinata.
// Bu ta'rifni gapirib berish mumkin, lekin u faqat harakat ko'rilganda
// ta'rifga aylanadi: bola burchakni tanlaydi, nuqta aylana bo'ylab
// SILJIYDI (CSS transition, 0,6 s), proyeksiyalar esa u bilan birga
// qisqaradi va o'sadi.
//
// BURISH MUSBAT YO'NALISHDA, ya'ni soat strelkasiga TESKARI — shuning
// uchun SVG da burchak manfiy ishora bilan beriladi (ekran o'qi pastga
// qaragan).
//
// `marks` — [{ deg, label, x, y }], aylanadagi tanlanadigan burchaklar.
//     x va y — aniq qiymatlar YOZUVI (satr), hisob emas: 1/2 ni 0,5 deb
//     ko'rsatish bu darsda noto'g'ri bo'lardi.
// `tasks` — [{ ask, right, hint }], `right` — marks ichidagi indeks.
// ============================================================
export function UnitCircle({ marks, tasks, after, showCoords = true, onSolved, audio, onStep }) {
  const t = useT()
  const sfx = useSfx()
  const canAnswer = useInstructionGate(audio)
  const [at, setAt] = useState(0)
  const [sel, setSel] = useState(0)
  const [note, setNote] = useState(null)
  const [wrong, setWrong] = useState(null)
  const [done, setDone] = useState(false)
  const stepRef = useRef(onStep)
  useEffect(() => { stepRef.current = onStep }, [onStep])

  const cur = tasks[Math.min(at, tasks.length - 1)]
  const m = marks[sel]

  const pick = (i) => {
    if (!canAnswer || done) return
    setSel(i)
    if (i !== cur.right) {
      setWrong(i)
      setNote(cur.hint || null)
      sfx.playWrong()
      return
    }
    setWrong(null)
    setNote(null)
    sfx.playCorrect()
    const next = at + 1
    if (stepRef.current) stepRef.current('turn' + next)
    if (next >= tasks.length) {
      setDone(true)
      setNote(after || null)
      if (audio && after) audio.say(t(after))
      if (onSolved) onSolved({ correct: true, tries: 1 })
    } else {
      setAt(next)
    }
  }

  const W = 300, H = 200, CX = 150, CY = 100, R = 74
  const deg = m ? m.deg : 0
  const rad = (deg * Math.PI) / 180
  const px = CX + R * Math.cos(rad)
  const py = CY - R * Math.sin(rad)
  const big = deg > 180 ? 1 : 0
  const arc = 'M ' + (CX + R * 0.34) + ' ' + CY
    + ' A ' + (R * 0.34) + ' ' + (R * 0.34) + ' 0 ' + big + ' 0 '
    + (CX + R * 0.34 * Math.cos(rad)) + ' ' + (CY - R * 0.34 * Math.sin(rad))

  return (
    <>
      <Slot mh={40}>{cur && !done ? <Ask>{t(cur.ask)}</Ask> : null}</Slot>

      <div className="g9-uc-wrap">
        <svg className="g9-uc-svg" viewBox={'0 0 ' + W + ' ' + H} role="img">
          <line x1={CX - R - 18} y1={CY} x2={CX + R + 18} y2={CY} className="g9-uc-axis" />
          <line x1={CX} y1={CY - R - 16} x2={CX} y2={CY + R + 16} className="g9-uc-axis" />
          <text x={CX + R + 22} y={CY + 3} className="g9-uc-ax">x</text>
          <text x={CX - 4} y={CY - R - 20} className="g9-uc-ax" textAnchor="end">y</text>
          <circle cx={CX} cy={CY} r={R} className="g9-uc-circle" />
          {deg !== 0 ? <path d={arc} className="g9-uc-arc" /> : null}

          {/* proyeksiyalar: kosinus gorizontal, sinus vertikal */}
          <line x1={px} y1={py} x2={px} y2={CY} className="g9-uc-proj" style={{ transition: 'all .6s ease' }} />
          <line x1={px} y1={py} x2={CX} y2={py} className="g9-uc-proj" style={{ transition: 'all .6s ease' }} />
          <line x1={CX} y1={CY} x2={px} y2={py} className="g9-uc-rad" style={{ transition: 'all .6s ease' }} />
          <circle cx={px} cy={py} r="4.4" className="g9-uc-dot" style={{ transition: 'all .6s ease' }} />
          <circle cx={CX + R} cy={CY} r="3" className="g9-uc-start" />
        </svg>

        {showCoords && m ? (
          <div className="g9-uc-read" style={{ fontFamily: MATH_FONT }}>
            <span>cos = {m.x}</span>
            <span>sin = {m.y}</span>
          </div>
        ) : null}
      </div>

      <Slot mh={62}>
        {!done ? (
          <div className="g9-chips">
            {marks.map((mk, i) => (
              <button
                key={'m' + i}
                type="button"
                className={'g9-chip' + (wrong === i ? ' is-wrong' : '') + (sel === i ? ' is-on' : '')}
                style={{ fontFamily: MATH_FONT }}
                disabled={!canAnswer}
                onClick={() => pick(i)}
              >
                {mk.label}
              </button>
            ))}
          </div>
        ) : null}
      </Slot>

      <Slot mh={52}>
        {note ? <Note kind={done ? 'ok' : 'no'}>{t(note)}</Note> : null}
      </Slot>
    </>
  )
}

// ============================================================
// 7G. PolyPair — IKKITA KO'PBURCHAK YONMA-YON.
//
// Bu ASBOB EMAS, CHIZMA. Geometriya blokida (35-52-darslar) savollarning
// ko'pi ikkita figurani solishtirishga quriladi, va ularni so'z bilan
// tasvirlash mumkin emas: «tomoni 1 bo'lgan kvadrat va tomonlari 2 va 1
// bo'lgan to'rtburchak» — bola buni ko'rmaguncha taqqoslay olmaydi.
// Shuning uchun `RecallMC` ga `figure` sloti ochildi, bu esa o'sha
// slotga tushadigan chizma.
//
// Har bir figura O'Z YARMIDA alohida masshtablanadi: kichik figura
// ko'rinmay qolmasligi kerak, lekin masshtab TENG BO'LMAGANI ataylab —
// gap o'lchamda emas, SHAKLDA. Agar o'lchamlarni solishtirish kerak
// bo'lsa, `sameScale` beriladi.
//
// `a`, `b` — { pts: [[x, y], ...], cap, sides: ['1', '2', ...] }.
//     `sides[i]` — i-tomonning (pts[i] dan pts[i+1] gacha) yozuvi.
// ============================================================
// 2026-08-28: `axis` qo'shildi (36-dars, simmetriyalar). Simmetriyada
// ikkita figurani ko'rsatishning o'zi yetmaydi — ular ORASIDAGI o'q
// yoki markaz ko'rinishi kerak, aks holda chizma «shunchaki ikkita
// figura» bo'lib qoladi. 'v' — vertikal o'q, 'c' — markaz nuqtasi.
export function PolyPair({ a, b, sameScale = false, marks, axis }) {
  const t = useT()
  const W = 320, H = 130, PAD = 16

  const box = (pts) => {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    return { x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs),
      y0: Math.min.apply(null, ys), y1: Math.max.apply(null, ys) }
  }
  const shared = sameScale ? box(a.pts.concat(b.pts)) : null

  const place = (fig, ox) => {
    const bx = shared || box(fig.pts)
    const w = Math.max(bx.x1 - bx.x0, 0.001), h = Math.max(bx.y1 - bx.y0, 0.001)
    const half = W / 2 - PAD * 1.5
    const k = Math.min(half / w, (H - PAD * 2.4) / h)
    const dx = ox + (half - w * k) / 2
    const dy = PAD + 8 + ((H - PAD * 2.4) - h * k) / 2
    return fig.pts.map((pt) => [dx + (pt[0] - bx.x0) * k, dy + (bx.y1 - pt[1]) * k])
  }

  const draw = (fig, ox, cls) => {
    const P = place(fig, ox)
    const d = P.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + ' Z'
    const mid = (i) => {
      const q = P[(i + 1) % P.length]
      return [(P[i][0] + q[0]) / 2, (P[i][1] + q[1]) / 2]
    }
    const cx = P.reduce((acc, p) => acc + p[0], 0) / P.length
    const cy = P.reduce((acc, p) => acc + p[1], 0) / P.length
    return (
      <g>
        <path d={d} className={'g9-pp-poly ' + cls} />
        {(fig.sides || []).map((lab, i) => {
          if (!lab) return null
          const m = mid(i)
          // yozuv figuradan TASHQARIGA suriladi, aks holda chiziq ustiga tushadi
          const ux = m[0] - cx, uy = m[1] - cy
          const len = Math.sqrt(ux * ux + uy * uy) || 1
          return (
            <text
              key={'s' + i}
              x={m[0] + (ux / len) * 9}
              y={m[1] + (uy / len) * 9 + 3}
              className="g9-pp-lab"
              textAnchor="middle"
            >
              {lab}
            </text>
          )
        })}
        {fig.cap ? <text x={cx} y={H - 4} className="g9-pp-cap" textAnchor="middle">{t(fig.cap)}</text> : null}
      </g>
    )
  }

  return (
    <div className="g9-pp-wrap">
      <svg className="g9-pp-svg" viewBox={'0 0 ' + W + ' ' + H} role="img">
        {axis === 'v' ? (
          <line x1={W / 2} y1={10} x2={W / 2} y2={H - 12} className="g9-pp-axis" />
        ) : null}
        {axis === 'c' ? (
          <circle cx={W / 2} cy={H / 2 - 4} r="3.2" className="g9-pp-center" />
        ) : null}
        {draw(a, PAD / 2, 'is-a')}
        {draw(b, W / 2 + PAD / 2, 'is-b')}
        {marks ? <text x={W / 2} y={14} className="g9-pp-cap" textAnchor="middle">{t(marks)}</text> : null}
      </svg>
    </div>
  )
}

// ============================================================
// 7H. CircleFig — AYLANA, VATARLAR, YOY VA BURCHAKLAR.
//
// Yana ASBOB EMAS, CHIZMA (`RecallMC` ning `figure` slotiga tushadi).
// 37-39 va 44-darslar butunlay aylana ustida: ichki chizilgan burchak,
// urinma, ichki va tashqi chizilgan ko'pburchaklar. Ularning barchasida
// bir xil chizma kerak — aylana, undagi bir nechta nuqta, vatarlar va
// belgilangan yoy.
//
// Nuqtalar GRADUSDA beriladi (0° — o'ngda, musbat yo'nalish soat
// strelkasiga teskari), chunki masalalar ham gradusda gapiradi va
// koordinata hisoblash kerak emas.
//
// `pts`    — [{ deg, label }].
// `chords` — [[i, j], ...] nuqtalar indekslari bo'yicha.
// `arc`    — [i, j] yoyni ajratib ko'rsatadi (musbat yo'nalishda).
// `radii`  — [i, ...] markazdan shu nuqtalarga radius chiziladi.
// ============================================================
export function CircleFig({ pts = [], chords = [], arc, radii = [], showCenter = false, cap }) {
  const t = useT()
  const W = 300, H = 150, CX = 150, CY = 76, R = 58
  const P = pts.map((p) => {
    const a = (p.deg * Math.PI) / 180
    return { x: CX + R * Math.cos(a), y: CY - R * Math.sin(a), label: p.label, deg: p.deg }
  })

  let arcPath = null
  if (arc) {
    const [i, j] = arc
    let sweep = pts[j].deg - pts[i].deg
    while (sweep < 0) sweep += 360
    const big = sweep > 180 ? 1 : 0
    arcPath = 'M ' + P[i].x.toFixed(1) + ' ' + P[i].y.toFixed(1)
      + ' A ' + R + ' ' + R + ' 0 ' + big + ' 0 ' + P[j].x.toFixed(1) + ' ' + P[j].y.toFixed(1)
  }

  return (
    <div className="g9-cf-wrap">
      <svg className="g9-cf-svg" viewBox={'0 0 ' + W + ' ' + H} role="img">
        <circle cx={CX} cy={CY} r={R} className="g9-cf-circle" />
        {arcPath ? <path d={arcPath} className="g9-cf-arc" /> : null}
        {radii.map((i) => (
          <line key={'r' + i} x1={CX} y1={CY} x2={P[i].x} y2={P[i].y} className="g9-cf-radius" />
        ))}
        {chords.map((c, k) => (
          <line key={'c' + k} x1={P[c[0]].x} y1={P[c[0]].y} x2={P[c[1]].x} y2={P[c[1]].y} className="g9-cf-chord" />
        ))}
        {showCenter ? <circle cx={CX} cy={CY} r="2.6" className="g9-cf-dot" /> : null}
        {showCenter ? <text x={CX + 5} y={CY - 4} className="g9-cf-lab">O</text> : null}
        {P.map((p, i) => {
          // yozuv aylanadan TASHQARIGA suriladi
          const a = (pts[i].deg * Math.PI) / 180
          return (
            <g key={'p' + i}>
              <circle cx={p.x} cy={p.y} r="2.8" className="g9-cf-dot" />
              <text
                x={CX + (R + 11) * Math.cos(a)}
                y={CY - (R + 11) * Math.sin(a) + 3}
                className="g9-cf-lab"
                textAnchor="middle"
              >
                {p.label}
              </text>
            </g>
          )
        })}
        {cap ? <text x={CX} y={H - 4} className="g9-cf-cap" textAnchor="middle">{t(cap)}</text> : null}
      </svg>
    </div>
  )
}


// ------------------------------------------------------------
// 7I. POWERFIG — nuqtaning aylanaga nisbatan darajasi.
//
// Bu ASBOB EMAS, CHIZMA: qo'l bilan qiladigan yangi harakat yo'q,
// shuning uchun yangi asbob yasalmadi (7G `PolyPair` bilan bir xil
// mantiq). Ikkita rejimi bor va ikkalasi ham 42-darsning bitta
// g'oyasini ko'rsatadi: nuqtadan chiqqan ikki chiziqning kesmalari
// ko'paytmasi o'zgarmaydi.
//
//   mode='chords'  — ichkarida kesishgan ikkita vatar. `degs` to'rtta
//                    burchak beradi: A, B (birinchi vatar), C, D
//                    (ikkinchi vatar). Kesishish nuqtasi K hisoblab
//                    topiladi. `labels` — AK, KB, CK, KD yozuvlari.
//   mode='tangent' — tashqi P nuqtadan urinma va kesuvchi. `degs` da
//                    bitta burchak: kesuvchining UZOQ nuqtasi C.
//                    Urinish nuqtasi A va yaqin nuqta B hisoblanadi.
//                    `labels` — PA, PB, PC yozuvlari.
//
// Yozuvlar kesmaning o'rtasiga qo'yiladi va markazdan TASHQARIGA
// yetti piksel suriladi — shunda ular chiziqning ustiga tushmaydi.
// ------------------------------------------------------------
export function PowerFig({ mode = 'chords', degs = [], labels = [], cap }) {
  const t = useT()
  const W = 300, H = 150
  const CX = mode === 'tangent' ? 104 : 150
  const CY = 74
  const R = mode === 'tangent' ? 50 : 56

  const on = (deg) => {
    const a = (deg * Math.PI) / 180
    return { x: CX + R * Math.cos(a), y: CY - R * Math.sin(a) }
  }
  // yozuv kesmaning O'RTASIDAN, unga PERPENDIKULYAR suriladi. Radial
  // surish bu yerda ishlamaydi: u kesmaning yo'nalishiga deyarli mos
  // tushadi va yozuv chiziqning ustida qolib ketadi. Perpendikulyarning
  // ishorasi markazdan uzoqlashadigan tomonga qarab tanlanadi.
  // f = 0.32 yozuvni kesmaning TASHQI uchiga suradi. O'rtaga qo'yilsa,
  // ikkita kalta bo'lakning yozuvlari K atrofida ustma-ust tushadi:
  // o'lchov bo'yicha eng yaqin ikkita yozuv orasi 10,6 pikseldan
  // 17 pikselgacha ko'tarildi.
  const segLab = (p, q, f = 0.32) => {
    const mx = p.x + f * (q.x - p.x), my = p.y + f * (q.y - p.y)
    const vx = q.x - p.x, vy = q.y - p.y
    const vlen = Math.hypot(vx, vy) || 1
    let nx = -vy / vlen, ny = vx / vlen
    if (nx * (mx - CX) + ny * (my - CY) < 0) { nx = -nx; ny = -ny }
    return { x: mx + nx * 8, y: my + ny * 8 + 3 }
  }
  const ptLab = (p, away = 11) => {
    const dx = p.x - CX, dy = p.y - CY
    const len = Math.hypot(dx, dy) || 1
    return { x: p.x + (dx / len) * away, y: p.y + (dy / len) * away + 3 }
  }

  const lines = []
  const dots = []
  const texts = []

  if (mode === 'tangent') {
    const P = { x: 268, y: 96 }
    const d = Math.hypot(P.x - CX, P.y - CY)
    const phi = Math.atan2(P.y - CY, P.x - CX)
    const beta = Math.acos(Math.min(1, R / d))
    // ikkita urinish nuqtasidan PASTKISI olinadi
    const cand = [phi + beta, phi - beta].map((a) => ({ x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) }))
    const A = cand[0].y > cand[1].y ? cand[0] : cand[1]
    const C = on(degs[0] == null ? 128 : degs[0])
    // PC to'g'ri chizig'ining aylana bilan ikkinchi kesishishi
    const ux = C.x - P.x, uy = C.y - P.y
    const fx = P.x - CX, fy = P.y - CY
    const qa = ux * ux + uy * uy
    const qb = 2 * (fx * ux + fy * uy)
    const qc = fx * fx + fy * fy - R * R
    const disc = Math.max(0, qb * qb - 4 * qa * qc)
    const tNear = (-qb - Math.sqrt(disc)) / (2 * qa)
    const B = { x: P.x + tNear * ux, y: P.y + tNear * uy }

    lines.push({ a: P, b: A, cls: 'g9-cf-chord' })
    lines.push({ a: P, b: C, cls: 'g9-cf-chord' })
    dots.push({ p: A, label: 'A' }, { p: B, label: 'B' }, { p: C, label: 'C' })
    texts.push({ ...ptLab(P, 9), s: 'P', anchor: 'start' })
    dots.push({ p: P, label: null })
    if (labels[0]) texts.push({ ...segLab(P, A, 0.5), s: labels[0], anchor: 'middle' })
    if (labels[1]) texts.push({ ...segLab(P, B, 0.5), s: labels[1], anchor: 'middle' })
    if (labels[2]) texts.push({ ...segLab(B, C, 0.5), s: labels[2], anchor: 'middle' })
  } else {
    const [dA, dB, dC, dD] = degs.length === 4 ? degs : [165, 345, 65, 255]
    const A = on(dA), B = on(dB), C = on(dC), D = on(dD)
    const den = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x)
    const tt = den === 0 ? 0.5 : ((C.x - A.x) * (D.y - C.y) - (C.y - A.y) * (D.x - C.x)) / den
    const K = { x: A.x + tt * (B.x - A.x), y: A.y + tt * (B.y - A.y) }

    lines.push({ a: A, b: B, cls: 'g9-cf-chord' })
    lines.push({ a: C, b: D, cls: 'g9-cf-chord' })
    dots.push({ p: A, label: 'A' }, { p: B, label: 'B' }, { p: C, label: 'C' }, { p: D, label: 'D' })
    dots.push({ p: K, label: null })
    texts.push({ x: K.x + 5, y: K.y - 4, s: 'K', anchor: 'start' })
    // har bir yozuv o'z bo'lagining TASHQI uchidan hisoblanadi, shuning
    // uchun juftlikda birinchi bo'lib aylanadagi nuqta turadi
    const pairs = [A, B, C, D]
    pairs.forEach((pt, i) => {
      if (labels[i]) texts.push({ ...segLab(pt, K), s: labels[i], anchor: 'middle' })
    })
  }

  return (
    <div className="g9-cf-wrap">
      <svg className="g9-cf-svg" viewBox={'0 0 ' + W + ' ' + H} role="img">
        <circle cx={CX} cy={CY} r={R} className="g9-cf-circle" />
        {lines.map((l, i) => (
          <line key={'l' + i} x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} className={l.cls} />
        ))}
        {dots.map((d, i) => (
          <g key={'d' + i}>
            <circle cx={d.p.x} cy={d.p.y} r="2.8" className="g9-cf-dot" />
            {d.label ? (
              <text {...ptLab(d.p)} className="g9-cf-lab" textAnchor="middle">{d.label}</text>
            ) : null}
          </g>
        ))}
        {texts.map((x, i) => (
          <text key={'t' + i} x={x.x} y={x.y} className="g9-pf-seg" textAnchor={x.anchor}>{x.s}</text>
        ))}
        {cap ? <text x={W / 2} y={H - 4} className="g9-cf-cap" textAnchor="middle">{t(cap)}</text> : null}
      </svg>
    </div>
  )
}


// ------------------------------------------------------------
// 7J. ANGLEFIG — bitta nuqtadan chiqqan ikkita vektor.
//
// Bu ham ASBOB EMAS, CHIZMA (7G va 7I bilan bir xil mantiq): qo'l
// hech narsa qilmaydi, chizma faqat ko'rsatadi. 43-darsda ikkita
// ish qiladi — koordinatalarda berilgan vektorlarni va ular
// orasidagi burchakni ko'rsatadi.
//
//   vecs   — [{ x, y, label }] ikkita vektor, KOORDINATALARDA.
//            Masshtab avtomatik: eng katta koordinata maydonga
//            sig'diriladi, shuning uchun a(1;2) ham, a(-5;6) ham
//            bir xil chiroyli chiqadi.
//   axes   — koordinata o'qlarini chizish.
//   arc    — vektorlar orasidagi burchak yoyi.
//   arcLab — yoyning yozuvi, masalan burchakning nomi.
// ------------------------------------------------------------
export function AngleFig({ vecs = [], axes = false, arc = false, arcLab, cap }) {
  const t = useT()
  const W = 300, H = 150
  const OX = 150, OY = 78
  const span = Math.max(1, ...vecs.map((v) => Math.max(Math.abs(v.x), Math.abs(v.y))))
  const k = 56 / span
  const to = (v) => ({ x: OX + v.x * k, y: OY - v.y * k })

  const arrow = (p) => {
    const len = Math.hypot(p.x - OX, p.y - OY) || 1
    const ux = (p.x - OX) / len, uy = (p.y - OY) / len
    const ax = p.x - ux * 8, ay = p.y - uy * 8
    const px = -uy, py = ux
    return [p.x, p.y, ax + px * 3.4, ay + py * 3.4, ax - px * 3.4, ay - py * 3.4]
      .map((n) => n.toFixed(1)).join(' ').replace(/(\S+) (\S+) /g, '$1,$2 ')
  }

  let arcPath = null
  if (arc && vecs.length === 2) {
    const a0 = Math.atan2(vecs[0].y, vecs[0].x)
    const a1 = Math.atan2(vecs[1].y, vecs[1].x)
    let diff = a1 - a0
    while (diff > Math.PI) diff -= 2 * Math.PI
    while (diff < -Math.PI) diff += 2 * Math.PI
    const r = 22
    const p0 = { x: OX + r * Math.cos(a0), y: OY - r * Math.sin(a0) }
    const p1 = { x: OX + r * Math.cos(a1), y: OY - r * Math.sin(a1) }
    arcPath = {
      d: 'M ' + p0.x.toFixed(1) + ' ' + p0.y.toFixed(1) + ' A ' + r + ' ' + r + ' 0 0 '
        + (diff > 0 ? 0 : 1) + ' ' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1),
      lx: OX + (r + 11) * Math.cos(a0 + diff / 2),
      ly: OY - (r + 11) * Math.sin(a0 + diff / 2) + 3,
    }
  }

  return (
    <div className="g9-cf-wrap">
      <svg className="g9-cf-svg" viewBox={'0 0 ' + W + ' ' + H} role="img">
        {axes ? (
          <g>
            <line x1={OX - 74} y1={OY} x2={OX + 74} y2={OY} className="g9-af-axis" />
            <line x1={OX} y1={OY - 66} x2={OX} y2={OY + 66} className="g9-af-axis" />
          </g>
        ) : null}
        {arcPath ? <path d={arcPath.d} className="g9-af-arc" /> : null}
        {vecs.map((v, i) => {
          const p = to(v)
          return (
            <g key={'v' + i}>
              <line x1={OX} y1={OY} x2={p.x} y2={p.y} className="g9-af-vec" />
              <polygon points={arrow(p)} className="g9-af-head" />
              {v.label ? (
                <text
                  x={p.x + (p.x - OX) * 0.12 + (p.x >= OX ? 9 : -9)}
                  y={p.y + (p.y - OY) * 0.12 + (p.y >= OY ? 10 : -4)}
                  className="g9-cf-lab"
                  textAnchor="middle"
                >
                  {v.label}
                </text>
              ) : null}
            </g>
          )
        })}
        <circle cx={OX} cy={OY} r="2.6" className="g9-cf-dot" />
        <text x={OX - 8} y={OY + 11} className="g9-cf-lab">O</text>
        {arcPath && arcLab ? (
          <text x={arcPath.lx} y={arcPath.ly} className="g9-pf-seg" textAnchor="middle">{arcLab}</text>
        ) : null}
        {cap ? <text x={W / 2} y={H - 4} className="g9-cf-cap" textAnchor="middle">{t(cap)}</text> : null}
      </svg>
    </div>
  )
}


// ------------------------------------------------------------
// 7K. TRIFIG — uchburchak, ixtiyoriy balandlik bilan.
//
// Yana ASBOB EMAS, CHIZMA. 45-49-darslarning hammasida uchburchak
// kerak bo'ladi (proporsional kesmalar, sinus va kosinus, sinuslar
// va kosinuslar teoremasi), shuning uchun bu chizma umumiy qatlamga
// chiqarildi — 44-darsning `PiStrip` idan farqi shu.
//
//   sides    — [a, b, c] uzunliklar: a = BC, b = AC, c = AB.
//              Uchlar shu uzunliklardan hisoblanadi, qo'lda emas.
//   names    — uchlarning nomlari, sukut bo'yicha A, B, C.
//   edges    — { a, b, c } tomonlarning yozuvlari.
//   altitude — C uchidan AB ga tushirilgan balandlikni chizish.
//   altLab   — balandlikning yozuvi, footLab — asos nuqtasining nomi.
//   segs     — { left, right } balandlik ajratgan bo'laklar yozuvi.
//   right    — to'g'ri burchak belgisi: 'C' yoki 'D' (balandlik asosi).
// ------------------------------------------------------------
export function TriFig({
  sides = [3, 4, 5], names = ['A', 'B', 'C'], edges = {},
  altitude = false, altLab, footLab = 'D', segs = {}, right, angles = {}, cap,
}) {
  const t = useT()
  const W = 300, H = 150
  const [a, b, c] = sides
  // A = (0,0), B = (c,0), C — uchta uzunlikdan
  const cx = (b * b + c * c - a * a) / (2 * c)
  const cy = Math.sqrt(Math.max(0.0001, b * b - cx * cx))
  const raw = [{ x: 0, y: 0 }, { x: c, y: 0 }, { x: cx, y: cy }]
  const minX = Math.min(...raw.map((p) => p.x)), maxX = Math.max(...raw.map((p) => p.x))
  const maxY = Math.max(...raw.map((p) => p.y))
  const k = Math.min(232 / (maxX - minX), 92 / maxY)
  const ox = (W - (maxX - minX) * k) / 2 - minX * k
  const oy = 122
  const to = (p) => ({ x: ox + p.x * k, y: oy - p.y * k })
  const A = to(raw[0]), B = to(raw[1]), C = to(raw[2])
  const D = to({ x: cx, y: 0 })
  const G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 }

  const out = (p, d = 11) => {
    const dx = p.x - G.x, dy = p.y - G.y
    const l = Math.hypot(dx, dy) || 1
    return { x: p.x + (dx / l) * d, y: p.y + (dy / l) * d + 3 }
  }
  const mid = (p, q, d = 10) => {
    const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2
    const dx = mx - G.x, dy = my - G.y
    const l = Math.hypot(dx, dy) || 1
    return { x: mx + (dx / l) * d, y: my + (dy / l) * d + 3 }
  }
  // to'g'ri burchak belgisi: uchidan ikkita tomon bo'ylab kvadratcha
  const rightMark = (v, p1, p2, s = 9.5) => {
    const u1 = { x: (p1.x - v.x), y: (p1.y - v.y) }
    const u2 = { x: (p2.x - v.x), y: (p2.y - v.y) }
    const n1 = Math.hypot(u1.x, u1.y) || 1, n2 = Math.hypot(u2.x, u2.y) || 1
    const q1 = { x: v.x + (u1.x / n1) * s, y: v.y + (u1.y / n1) * s }
    const q2 = { x: v.x + (u2.x / n2) * s, y: v.y + (u2.y / n2) * s }
    const q3 = { x: q1.x + q2.x - v.x, y: q1.y + q2.y - v.y }
    return [q1, q3, q2].map((p) => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ')
  }

  return (
    <div className="g9-cf-wrap">
      <svg className="g9-cf-svg" viewBox={'0 0 ' + W + ' ' + H} role="img">
        <polygon
          points={[A, B, C].map((p) => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ')}
          className="g9-tf-body"
        />
        {altitude ? <line x1={C.x} y1={C.y} x2={D.x} y2={D.y} className="g9-tf-alt" /> : null}
        {right === 'C' ? <polyline points={rightMark(C, A, B)} className="g9-tf-right" /> : null}
        {altitude && right !== 'C' ? <polyline points={rightMark(D, C, B)} className="g9-tf-right" /> : null}
        {[[A, names[0]], [B, names[1]], [C, names[2]]].map(([p, n], i) => (
          <g key={'v' + i}>
            <circle cx={p.x} cy={p.y} r="2.6" className="g9-cf-dot" />
            <text {...out(p)} className="g9-cf-lab" textAnchor="middle">{n}</text>
          </g>
        ))}
        {altitude ? (
          <g>
            <circle cx={D.x} cy={D.y} r="2.4" className="g9-cf-dot" />
            <text x={D.x} y={D.y + 13} className="g9-cf-lab" textAnchor="middle">{footLab}</text>
            {altLab ? (
              <text x={(C.x + D.x) / 2 + 9} y={(C.y + D.y) / 2 + 3} className="g9-pf-seg">{altLab}</text>
            ) : null}
            {segs.left ? (
              <text x={(A.x + D.x) / 2} y={D.y + 13} className="g9-pf-seg" textAnchor="middle">{segs.left}</text>
            ) : null}
            {segs.right ? (
              <text x={(D.x + B.x) / 2} y={D.y + 13} className="g9-pf-seg" textAnchor="middle">{segs.right}</text>
            ) : null}
          </g>
        ) : null}
        {/* burchak yoyi: uchdan ikkita tomonga qarab kichik yoy va yozuv.
            45-darsda kerak bo'lmagandi, 46-darsda burchakning nomini
            chizmada ko'rsatish shart bo'lib qoldi. */}
        {[['A', A, B, C], ['B', B, C, A], ['C', C, A, B]].map(([key, v, p1, p2]) => {
          if (!angles[key]) return null
          const a1 = Math.atan2(p1.y - v.y, p1.x - v.x)
          const a2 = Math.atan2(p2.y - v.y, p2.x - v.x)
          let dd = a2 - a1
          while (dd > Math.PI) dd -= 2 * Math.PI
          while (dd < -Math.PI) dd += 2 * Math.PI
          const rr = 15
          const q1 = { x: v.x + rr * Math.cos(a1), y: v.y + rr * Math.sin(a1) }
          const q2 = { x: v.x + rr * Math.cos(a2), y: v.y + rr * Math.sin(a2) }
          const d = 'M ' + q1.x.toFixed(1) + ' ' + q1.y.toFixed(1) + ' A ' + rr + ' ' + rr
            + ' 0 0 ' + (dd > 0 ? 1 : 0) + ' ' + q2.x.toFixed(1) + ' ' + q2.y.toFixed(1)
          // uzun yozuv («90°−α») qisqasidan ko'ra uzoqroqqa suriladi,
          // aks holda u uchburchakning ichiga tushib, tomonni yopadi
          const off = rr + 10 + Math.max(0, String(angles[key]).length - 3) * 3.2
          const lx = v.x + off * Math.cos(a1 + dd / 2)
          const ly = v.y + off * Math.sin(a1 + dd / 2) + 3
          return (
            <g key={'ang' + key}>
              <path d={d} className="g9-af-arc" />
              <text x={lx} y={ly} className="g9-pf-seg" textAnchor="middle">{angles[key]}</text>
            </g>
          )
        })}
        {edges.c ? <text {...mid(A, B)} className="g9-pf-seg" textAnchor="middle">{edges.c}</text> : null}
        {edges.b ? <text {...mid(A, C)} className="g9-pf-seg" textAnchor="middle">{edges.b}</text> : null}
        {edges.a ? <text {...mid(B, C)} className="g9-pf-seg" textAnchor="middle">{edges.a}</text> : null}
        {cap ? <text x={W / 2} y={H - 4} className="g9-cf-cap" textAnchor="middle">{t(cap)}</text> : null}
      </svg>
    </div>
  )
}

// ============================================================
// 8. USLUBLAR. Prefiks g9-: umumiy qatlamning g8- klasslari bilan
// to'qnashmaydi. Shkala va ranglar YADRODAN olinadi (T, MATH_FONT) — sinf
// o'zining palitrasini yasamaydi, farq ASBOBDA.
//
// DIQQAT: bu shablon satr. Ichida teskari apostrof yoki teskari chiziq
// bo'lsa — hatto izohda ham — satr uziladi va brauzer oq sahifa ko'rsatadi.
// ============================================================
export const G9_STYLES = `
/* FON: metodist 8-9-sinf tetrad-to'rini rad etdi, 5-sinf 11-darsidagi
   silliq, bir xil fonni tanladi (2026-08-26). Umumiy .lesson-root fonini
   (to'r + ikki dog') to'liq almashtiradi — faqat shu darsda, chunki
   .g9-* qatlami faqat shu ekranga qo'shiladi. */
.lesson-root { background: #F6F4EF; }

/* g8-note-info — YANGI TUR (metodist, 2026-08-26): 3-ekranda «vaqt
   sirg'ituvchisi» chegaradan chiqsa, bu xato javob emas, aniqlanish
   sohasi haqida ma'lumot — Note komponentida shunday tur yo'q edi,
   ok/no ikkisi ham noto'g'ri ma'no berardi (yashil/qizil). Ko'k —
   tekshiruv qatlami rangi bilan bir xil (recolor, T.graph -> ko'k). */
.g8-note-info { background: #DFF3F9; box-shadow: inset 0 0 0 1px rgba(1,154,203,.26); }
.g8-note-info { border-left-color: #019ACB; color: #019ACB; box-shadow: none; }

/* GOTCHA topildi (metodist QA emas, o'z tekshiruvim, 2026-08-26):
   feed.jsx da .g8-tk-list li ikkita media so'rovda ikki xil font-size
   oladi — @media (max-height:720px) 18px qo'yadi, undan KEYIN keladigan
   @media (max-height:820px) buni 20px bilan qayta yozadi (ikkalasi ham
   615px balandlikda ishlaydi, oxirgisi g'olib chiqadi). Natijada 15-ekran
   ruscha matnda ikki qatorga o'raladi va "Keyingi dars..." pastga
   chiqib, ko'rinmay qoladi. Umumiy faylni tuzatish boshqa darslarga
   tegishi mumkin, shuning uchun faqat shu darsda 18px qaytariladi. */
@media (max-width: 760px), (max-height: 820px) {
  .g8-tk-list li { font-size: 18px; padding: 10px 14px; }
}

/* g9-fact — "Bilasizmi?" kartochkasi (metodist, 2026-08-26). Manba:
   5-sinf Dars01.jsx (u yerda har dars faylida qayta yozilgan), shu yerda
   BIR MARTA. 9 nuqta o'rniga rangi xuddi o'sha ko'k (info qatlami bilan
   bir xil) — faqat shu darsda ishlatiladi (S9, S13, S15). */
/* CircleFig (7H). Balandligi PolyPair kabi chegaralangan. */
.g9-cf-wrap { max-width: 520px; margin: 0 auto; display: flex; justify-content: center; }
.g9-cf-svg { width: 100%; height: auto; max-height: 150px; display: block; background: #FFF;
  border-radius: 12px; box-shadow: inset 0 0 0 1px rgba(14,14,16,.12); }
@media (max-height: 720px) { .g9-cf-svg { max-height: 106px; } }
@media (max-width: 640px) { .g9-cf-svg { max-height: 134px; } }
.g9-cf-circle { fill: none; stroke: rgba(14,14,16,.4); stroke-width: 1.3; }
.g9-cf-arc { fill: none; stroke: #C8452F; stroke-width: 2.6; }
.g9-cf-chord { stroke: #019ACB; stroke-width: 1.6; }
.g9-cf-radius { stroke: #2E7D4F; stroke-width: 1.4; stroke-dasharray: 4 3; }
.g9-cf-dot { fill: #0E0E10; }
.g9-cf-lab { font-family: 'JetBrains Mono', monospace; font-size: 9px; fill: #0E0E10; }
.g9-cf-cap { font-family: 'JetBrains Mono', monospace; font-size: 9px; fill: rgba(14,14,16,.55); }
.g9-pf-seg { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; fill: #01607F; }
.g9-af-axis { stroke: rgba(14,14,16,.28); stroke-width: 1; }
.g9-af-vec { stroke: #019ACB; stroke-width: 1.8; }
.g9-af-head { fill: #019ACB; }
.g9-af-arc { fill: none; stroke: #C8452F; stroke-width: 1.6; }
.g9-tf-body { fill: rgba(1,154,203,.10); stroke: #01607F; stroke-width: 1.6; }
.g9-tf-alt { stroke: #C8452F; stroke-width: 1.5; stroke-dasharray: 4 3; }
.g9-tf-right { fill: none; stroke: rgba(14,14,16,.62); stroke-width: 1.4; }

/* PolyPair (7G) va RecallMC chizma sloti. */
.g9-figslot { margin: 0 0 clamp(6px, 1.2vw, 10px); }
/* Chizma balandligi CHEGARALANADI: 615px balandlikdagi noutbukda savol
   va variantlar bilan birga sig'ishi kerak (36-darsda 34px chiqib
   ketgandi). preserveAspectRatio sukut bo'yicha meet, shuning uchun
   max-height SVG ni ichkariga sig'diradi. */
.g9-pp-wrap { max-width: 560px; margin: 0 auto; display: flex; justify-content: center; }
.g9-pp-svg { width: 100%; height: auto; max-height: 150px; display: block; background: #FFF;
  border-radius: 12px; box-shadow: inset 0 0 0 1px rgba(14,14,16,.12); }
@media (max-height: 720px) { .g9-pp-svg { max-height: 104px; } }
@media (max-width: 640px) { .g9-pp-svg { max-height: 132px; } }
.g9-pp-poly { fill: rgba(1,154,203,.14); stroke: #019ACB; stroke-width: 1.6; stroke-linejoin: round; }
.g9-pp-poly.is-b { fill: rgba(46,125,79,.14); stroke: #2E7D4F; }
.g9-pp-lab { font-family: 'JetBrains Mono', monospace; font-size: 9px; fill: #0E0E10; }
.g9-pp-cap { font-family: 'JetBrains Mono', monospace; font-size: 9px; fill: rgba(14,14,16,.55); }
.g9-pp-axis { stroke: #C8452F; stroke-width: 1.4; stroke-dasharray: 5 4; }
.g9-pp-center { fill: #C8452F; }

/* UnitCircle (7F). Burish CSS transition bilan, 0,6 s. */
.g9-uc-wrap { max-width: 560px; margin: 0 auto clamp(6px, 1.2vw, 10px); }
.g9-uc-svg { width: 100%; height: auto; display: block; background: #FFF; border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(14,14,16,.12); }
.g9-uc-axis { stroke: rgba(14,14,16,.35); stroke-width: 1; }
.g9-uc-ax { font-family: 'JetBrains Mono', monospace; font-size: 9px; fill: rgba(14,14,16,.55); }
.g9-uc-circle { fill: none; stroke: rgba(1,154,203,.55); stroke-width: 1.6; }
.g9-uc-arc { fill: none; stroke: #2E7D4F; stroke-width: 2; }
.g9-uc-rad { stroke: #019ACB; stroke-width: 1.6; }
.g9-uc-proj { stroke: rgba(200,69,47,.75); stroke-width: 1.3; stroke-dasharray: 4 3; }
.g9-uc-dot { fill: #019ACB; }
.g9-uc-start { fill: rgba(14,14,16,.4); }
.g9-uc-read { display: flex; gap: clamp(14px, 3vw, 28px); justify-content: center; margin-top: 8px;
  font-size: clamp(14px, 1.6vw, 17px); color: #0E0E10; }
.g9-chip.is-on { box-shadow: inset 0 0 0 2px #019ACB; }

/* TreeBranch (7E). Ildiz chapda, darajalar o'ngga ochiladi. */
.g9-tree-wrap { max-width: 620px; margin: 0 auto clamp(8px, 1.4vw, 12px); }
.g9-tree-svg { width: 100%; height: auto; display: block; background: #FFF; border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(14,14,16,.12); }
.g9-tree-root { fill: #0E0E10; }
.g9-tree-edge { stroke: rgba(1,154,203,.55); stroke-width: 1.2; }
.g9-tree-dot { fill: #019ACB; }
.g9-tree-lab { font-family: 'JetBrains Mono', monospace; font-size: 8px; fill: #0E0E10; }
.g9-tree-cap { font-family: 'JetBrains Mono', monospace; font-size: 8px; fill: rgba(14,14,16,.5);
  letter-spacing: .04em; text-transform: uppercase; }
.g9-tree-read { text-align: center; margin-top: 8px; font-size: clamp(15px, 1.8vw, 19px); color: #0E0E10; }

/* FreqRun (7D). Chizma o'lchovi CSS bilan, viewBox qat'iy. */
.g9-fr-wrap { max-width: 620px; margin: 0 auto clamp(8px, 1.4vw, 12px); }
.g9-fr-svg { width: 100%; height: auto; display: block; background: #FFF; border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(14,14,16,.12); }
.g9-fr-grid { stroke: rgba(14,14,16,.08); stroke-width: 1; }
.g9-fr-axis { stroke: rgba(14,14,16,.35); stroke-width: 1; }
.g9-fr-target { stroke: #2E7D4F; stroke-width: 1.4; stroke-dasharray: 5 4; }
.g9-fr-line { fill: none; stroke: #019ACB; stroke-width: 1.8; stroke-linejoin: round; }
.g9-fr-dot { fill: #019ACB; }
.g9-fr-tick, .g9-fr-ax, .g9-fr-tlab { font-family: 'JetBrains Mono', monospace; font-size: 8px; fill: rgba(14,14,16,.55); }
.g9-fr-tlab { fill: #2E7D4F; }
.g9-fr-read { display: flex; gap: clamp(10px, 2.4vw, 22px); justify-content: center;
  margin-top: 8px; font-size: clamp(13px, 1.5vw, 16px); color: #0E0E10; }

/* SortRow (7C). Manba sonlar tepada, tartiblangan qator pastda.
   Kataklar soni o'zgaruvchan, shuning uchun ustunlar soni CSS
   o'zgaruvchisi orqali beriladi: inline grid-template-columns telefonda
   media so'rovni bosib qolardi (9-sinfda bir marta uchragan xato). */
.g9-sort-bag { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
  margin: 0 0 clamp(10px, 1.8vw, 16px); }
.g9-sort-src { min-width: 52px; padding: 8px 12px; border-radius: 10px;
  border: 1px solid rgba(14,14,16,.16); background: #FFF; color: #0E0E10;
  font-size: clamp(15px, 1.7vw, 18px); cursor: pointer; transition: transform .12s ease; }
.g9-sort-src:hover:enabled { transform: translateY(-2px); }
.g9-sort-src.is-wrong { border-color: #C8452F; color: #C8452F; background: #FBEDEA; }
.g9-sort-src:disabled { opacity: .5; cursor: default; }
.g9-sort-gone { min-width: 52px; padding: 8px 12px; border-radius: 10px;
  border: 1px dashed rgba(14,14,16,.14); color: rgba(14,14,16,.22);
  font-size: clamp(15px, 1.7vw, 18px); text-align: center; }
.g9-sort-row { display: grid; grid-template-columns: repeat(var(--sort-cols, 5), 1fr);
  gap: 6px; margin: 0 auto clamp(8px, 1.4vw, 12px); max-width: 620px; }
.g9-sort-cell { min-height: 46px; display: flex; align-items: center; justify-content: center;
  border-radius: 10px; background: #FFF; box-shadow: inset 0 0 0 1px rgba(14,14,16,.12);
  font-size: clamp(15px, 1.7vw, 18px); color: #0E0E10; }
.g9-sort-cell.is-now { box-shadow: inset 0 0 0 2px rgba(1,154,203,.55); }
.g9-sort-cell.is-mid { background: #E8F6EC; box-shadow: inset 0 0 0 2px #2E7D4F; color: #2E7D4F; font-weight: 600; }
@media (max-width: 640px) {
  .g9-sort-row { gap: 4px; }
  .g9-sort-cell { min-height: 40px; font-size: 14px; }
  .g9-sort-src, .g9-sort-gone { min-width: 44px; padding: 7px 9px; font-size: 14px; }
}

.g9-fact { display: flex; gap: clamp(12px, 2.2vw, 18px); align-items: center;
  background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px;
  padding: clamp(10px, 1.8vw, 14px) clamp(12px, 2vw, 16px);
  box-shadow: 0 6px 16px -6px rgba(1,154,203,.22); flex-shrink: 0; }
.g9-fact-anim { flex-shrink: 0; width: clamp(52px, 8vw, 68px); height: clamp(52px, 8vw, 68px);
  display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(4px, 1vw, 7px); }
.g9-fact-anim span { width: 100%; aspect-ratio: 1; border-radius: 50%; background: #019ACB;
  box-shadow: 0 0 6px rgba(1,154,203,.6); animation: g9-fact-pulse 2.2s ease-in-out infinite; }
@keyframes g9-fact-pulse { 0%, 100% { opacity: .2; transform: scale(.7); } 50% { opacity: 1; transform: scale(1); } }
.g9-fact-body { flex: 1; min-width: 0; }
.g9-fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px;
  font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.1vw, 11px);
  font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #019ACB; }
.g9-fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB;
  box-shadow: 0 0 8px rgba(1,154,203,.55); flex-shrink: 0; }
.g9-fact-text { margin: 0; font-size: clamp(12.5px, 1.35vw, 14.5px); line-height: 1.4; color: #0E0E10; }
@media (prefers-reduced-motion: reduce) { .g9-fact-anim span { animation: none; opacity: 1; transform: none; } }

/* SAVOL KATTAROQ: metodist «savol vizual ko'rinmayapti» dedi. .g8-ask
   umumiy qatlamda, hamma sinf/dars uchun bitta — shu yerda o'zgartirib
   bo'lmaydi, chunki 40dan ortiq boshqa xuk shu o'lchamga sozlangan.
   Shuning uchun PickBroken/Ask endi ixtiyoriy askClass qabul qiladi
   (core.jsx, feed.jsx — orttirma, eskisi o'zgarmadi), va bu klass FAQAT
   shu ekranga qo'llanadi. */
.g9-ask-big { font-size: clamp(20px, 2.3vw, 28px) !important; font-weight: 600; }
@media (max-width: 480px) { .g9-ask-big { font-size: clamp(17px, 4.6vw, 21px) !important; } }

/* VARIANT KARTOCHKALARI KICHIKROQ: savol kattalashgach, to'rt kartochka
   nomutanosib ko'rindi (metodist: «визуально не красиво»). Xuddi shu
   yo'l — ixtiyoriy cardsClass, umumiy .g8-pb-card o'zgarmaydi. */
.lesson-root .g9-cards-small .g8-pb-card {
  font-size: clamp(15px, 1.4vw, 19px) !important;
  display: flex; align-items: center; justify-content: center; text-align: center;
}

/* JADVAL, 1-EKRAN (metodist QA 2026-08-25, "sahna kichik" 2026-08-26):
   jadval o'z qatorini kesib qo'ymasin deb siqilmaydi (flex-shrink:0,
   feed.jsx). Avval sahnani ham torraytirgan edim — bu ORTIQCHA bo'lib
   chiqdi: qator balandligi is-wide variantidan ham torroq qilinsa
   (38/34), jadvalning o'zi kamroq joy so'raydi va sahna HECH QANDAY
   qo'shimcha cheklovsiz o'zining tabiiy o'lchamida (~155px) sig'adi —
   xuddi shu darsning eng birinchi holatidagidek. g9-scene-compact
   nomi endi noto'g'ri (sahnani kichraytirmaydi), lekin klass DOMda
   jadval bilan opa-singil bo'lgani uchun CSS ~ tanlagichga kerak
   qoldirilgan. */
.g9-scene-compact ~ .g8-pf .g8-pf-row,
.g9-scene-compact ~ .g8-pf .g8-pf-row > span { min-height: 38px; }
.g9-scene-compact ~ .g8-pf .g8-pf-row.is-head,
.g9-scene-compact ~ .g8-pf .g8-pf-row.is-head > span { min-height: 34px; }

/* ---------- TO'P OSMONGA OTILDI ----------
   2026-08-22, beshinchi urinish: metodist «to'p yo'l ustida yurishi kerak»
   dedi — avvalgi kadrlar to'pni chizib qo'yilgan parabola YONIDAN
   yurgizardi (ikkisi mos kelmasdi). Endi bitta formuladan ikkisi ham
   chiqadi: parabola M40,140 Q100,-10 160,140 uchun
     x(t) = 40 + 120t              (chiziqli — nazorat nuqtasi x=100 o'rtada)
     y(t) = 140 - 300t + 300t^2
   Kadrlar shu ikki formuladan ONDAN NUQTADA (t = 0, .1, … 1) hisoblangan,
   qolgan-hammasi CSS chiziqli oraliq bilan to'ldiradi — 10%lik qadam
   parabolani ko'zga sezilmas holda taqriblaydi. Belgilangan balandlik
   aynan t=0.2 va t=0.8da kesib o'tiladi: 20% * 5600 + 600 = 1720ms,
   80% * 5600 + 600 = 5080ms — plashkalar ANIQ shu paytda chiqadi.
   Soya x(t) ni takrorlaydi, balandlikka TESKARI kattalashadi/xiralashadi. */
.g9-toss-ride { animation: g9-toss-ride 5600ms linear 600ms forwards; }
@keyframes g9-toss-ride {
  0%   { transform: translate(-60px, 75px); }
  10%  { transform: translate(-48px, 48px); }
  20%  { transform: translate(-36px, 27px); }
  30%  { transform: translate(-24px, 12px); }
  40%  { transform: translate(-12px, 3px); }
  50%  { transform: translate(0px, 0px); }
  60%  { transform: translate(12px, 3px); }
  70%  { transform: translate(24px, 12px); }
  80%  { transform: translate(36px, 27px); }
  90%  { transform: translate(48px, 48px); }
  100% { transform: translate(60px, 75px); }
}
.g9-toss-shadow {
  transform-box: fill-box; transform-origin: 50% 50%;
  animation: g9-toss-shadow 5600ms linear 600ms forwards;
}
@keyframes g9-toss-shadow {
  0%   { transform: translateX(-60px) scale(1); opacity: .9; }
  10%  { transform: translateX(-48px) scale(.76); opacity: .68; }
  20%  { transform: translateX(-36px) scale(.57); opacity: .52; }
  30%  { transform: translateX(-24px) scale(.43); opacity: .40; }
  40%  { transform: translateX(-12px) scale(.35); opacity: .32; }
  50%  { transform: translateX(0px) scale(.32); opacity: .30; }
  60%  { transform: translateX(12px) scale(.35); opacity: .32; }
  70%  { transform: translateX(24px) scale(.43); opacity: .40; }
  80%  { transform: translateX(36px) scale(.57); opacity: .52; }
  90%  { transform: translateX(48px) scale(.76); opacity: .68; }
  100% { transform: translateX(60px) scale(1); opacity: .9; }
}
/* AYLANISH: to'p uchayotganda o'z o'qi atrofida aylanadi. Metodist:
   «to'p qo'nganidan keyin ham aylanaveradi» — animatsiya infinite edi,
   TO'XTAMAS edi. Endi 800ms * 7 = 5600ms, aynan yo'l davomiyligicha (ride bilan bir
   xil kechikish, 600ms), va 7 to'liq aylanish 360gradusning ko'paytmasi —
   to'xtash payti g'aloti bo'lib chiqmaydi, to'p qo'nganda aylanish ham
   AYNI shu paytda to'xtaydi. */
.g9-toss-spin {
  transform-box: fill-box; transform-origin: 50% 50%;
  animation-name: g9-toss-spin; animation-duration: 800ms;
  animation-timing-function: linear; animation-delay: 600ms;
  animation-iteration-count: 7; animation-fill-mode: forwards;
}
@keyframes g9-toss-spin { to { transform: rotate(360deg); } }

.g9-plate { opacity: 0; animation: g9-fade 420ms ease-out forwards; }
.g9-plate-a { animation-delay: 1720ms; }
.g9-plate-b { animation-delay: 5080ms; }
@keyframes g9-fade { to { opacity: 1; } }
.g9-mach-fig { width: 100%; display: flex; justify-content: center; }
.g9-mach-fig svg { width: 100%; max-width: 340px; display: block;
  /* 2026-08-22 GOTCHA: keng viewBox (-125 -15 450 176) BO'SH joyni
     kattalashtirgan edi, chizmaning o'zi emasligi uchun to'p kichkina
     ko'rinishda qolgan (metodist: «hali ham kichkina»). To'g'ri yechim —
     to'pning HARAKAT MASOFASINI kengaytirish (dx 12'dan 24'ga, TossAt
     ichida), va viewBox'ni AYNAN shu yangi chizma chegarasiga moslash
     (-45 -15 290 176) — bo'sh joy yo'q, hammasi chizma.
     Eni balandlik bilan bog'liq (nisbat orqali), shuning uchun asosiy
     chegara — BALANDLIK. POTOLOK 615 PIKSELLI NOUTBUKDA O'LCHANDI
     (2026-08-22): sarlavha+savol+sirg'ituvchi+lotok+xulosa birga ~311px
     oladi, .g8-body esa shu balandlikda ~489px beradi — qolgan ~178px dan
     oshib ketsa, lotok pastki panel ostida KESILADI (skroll yo'q).
     25vh/615=154px, xavfsiz zaxira bilan. */
  max-height: min(25vh, 200px); }

/* ---------- MASHINA ---------- */
.g9-mach { width: 100%; max-width: 560px; margin: 0 auto; display: grid;
  grid-template-columns: auto 1fr auto; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: 18px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.08), 0 16px 34px -28px rgba(${T.shadow},.85);
  transition: box-shadow .3s ease; }
.g9-mach.is-stuck { box-shadow: inset 0 0 0 2px ${T.tip}, 0 16px 34px -28px rgba(${T.tipRgb},.6); }
.g9-mach-in, .g9-mach-out { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.g9-mach-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 9px;
  letter-spacing: .16em; text-transform: uppercase; color: ${T.ink3}; }
.g9-mach-slot { min-width: 54px; padding: 5px 10px; border-radius: 10px; text-align: center;
  font-size: clamp(17px, 1.9vw, 22px); background: ${T.bg}; color: ${T.ink};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.10); }
.g9-mach-slot.is-out { background: ${T.okSoft}; color: ${T.ok}; }
.g9-mach.is-stuck .g9-mach-slot.is-out { background: ${T.tipSoft}; color: ${T.tip}; }
.g9-mach-body { text-align: center; font-size: clamp(19px, 2.3vw, 26px); color: ${T.ink};
  padding: 6px 10px; border-left: 2px solid rgba(23,26,29,.10);
  border-right: 2px solid rgba(23,26,29,.10); }

/* ---------- LOTOK ---------- */
.g9-tray { width: 100%; max-width: 620px; margin: 0 auto; display: flex; align-items: center;
  gap: 12px; flex-wrap: wrap; padding: 14px 18px; border-radius: 16px; background: ${T.bg}; }
.g9-tray-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 9px;
  letter-spacing: .16em; text-transform: uppercase; color: ${T.ink3}; flex-shrink: 0; }
.g9-tray-row { display: flex; flex-wrap: wrap; gap: 10px; }
.g9-pair { font-weight: 700; font-size: clamp(16px, 2.1vw, 21px); color: ${T.ink};
  padding: 7px 14px; border-radius: 12px; background: ${T.paper};
  box-shadow: inset 0 0 0 1.4px rgba(23,26,29,.10), 0 6px 14px -10px rgba(23,26,29,.55);
  transition: transform .15s ease, box-shadow .15s ease;
  animation: g9-pop 340ms cubic-bezier(.22,.9,.3,1) both; }
.g9-pair:hover { transform: translateY(-2px);
  box-shadow: inset 0 0 0 1.4px ${T.accent}, 0 10px 18px -10px rgba(23,26,29,.55); }
@keyframes g9-pop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

/* ---------- SONLAR VA TUGMALAR ---------- */
.g9-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; width: 100%; }
.g9-chip { border: 0; cursor: pointer; padding: 8px 14px; border-radius: 12px;
  font-size: clamp(15px, 1.7vw, 19px); color: ${T.ink}; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.12); transition: transform .16s ease, opacity .2s ease; }
.g9-chip:hover:not(:disabled) { transform: translateY(-2px); }
.g9-chip:disabled { cursor: default; }
.g9-chip.is-used { opacity: .34; }
.g9-chip.is-stuck { box-shadow: inset 0 0 0 2px ${T.tip}; color: ${T.tip}; opacity: 1; }

/* ---------- SIGNAXIS: GRAFIK + SON O'QI (Pribor 1) ---------- */
.g9-sa-ox { stroke: rgba(23,26,29,.28); stroke-width: 1.4; }
.g9-sa { width: 100%; max-width: 460px; margin: 4px auto 0; display: block; }
.g9-sa-line { stroke: rgba(23,26,29,.28); stroke-width: 2; }
.g9-sa-dot { fill: ${T.ink}; stroke: ${T.bg}; stroke-width: 2; }
.g9-sa-dot.is-open { fill: ${T.bg}; stroke: ${T.ink}; stroke-width: 2; }
.g9-sa-rootlabel { font-size: 11px; fill: ${T.ink3}; }
.g9-sa-seg { stroke: rgba(23,26,29,.24); stroke-width: 6; stroke-linecap: round; }
.g9-sa-seg.is-known { stroke: ${T.ink2}; }
.g9-sa-seg.is-painted { stroke: ${T.ok}; }
.g9-sa-seg.is-wrong { stroke: ${T.tip}; }
.g9-sa-sign { font-size: 15px; font-weight: 700; fill: ${T.ink2}; }
.g9-sa-hit { fill: transparent; cursor: pointer; }
.g9-sa-hit:hover { fill: rgba(31,122,77,.08); }
.g9-sa-note { font-size: clamp(14px, 1.7vw, 17px); color: ${T.ink}; text-align: center; }
.g9-sa-picks { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.g9-sa-pickrow { display: flex; align-items: center; gap: 10px; }
.g9-sa-picklabel { font-size: clamp(14px, 1.6vw, 17px); color: ${T.ink2}; min-width: 6.5em; text-align: right; }

/* ---------- TRACK: TENGLAMA QADAMI (Pribor 4) ---------- */
.g9-tr { display: flex; flex-direction: column; align-items: center; gap: 10px;
  width: 100%; max-width: 560px; margin: 0 auto; padding: 18px 22px; border-radius: 18px;
  background: ${T.paper}; box-shadow: inset 0 0 0 1px rgba(23,26,29,.08); }
.g9-tr-rec { display: flex; align-items: center; gap: 12px;
  font-size: clamp(19px, 2.2vw, 26px); color: ${T.ink}; }
.g9-tr-eq { color: ${T.accent}; font-weight: 700; }
.g9-tr-set { font-size: clamp(14px, 1.6vw, 17px); color: ${T.ink2}; }
.g9-tr-item.is-risky { color: ${T.tip}; font-weight: 600; }
.g9-tr-item.is-struck { color: ${T.tip}; text-decoration: line-through; opacity: .7; }
.g9-tr-item.is-ok { color: ${T.ok}; font-weight: 600; }
.g9-tr-unknown { color: ${T.ink3}; }
.g9-tr-ask { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; }
.g9-tr-acts { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; width: 100%; }

/* ---------- SEQTABLE: KETMA-KETLIK JADVALI (Pribor 5) ---------- */
.g9-seq-rule { font-size: clamp(17px, 2vw, 22px); color: ${T.ink}; text-align: center;
  padding: 8px 14px; border-radius: 12px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.08); }
.g9-seq { display: grid; gap: 6px; width: 100%; max-width: 460px; margin: 2px auto 0; }
.g9-seq-n { font-size: clamp(12px, 1.5vw, 15px); color: ${T.ink3}; text-align: center; }
.g9-seq-cell { min-height: 44px; display: flex; align-items: center; justify-content: center;
  font-size: clamp(16px, 2vw, 21px); color: ${T.ink}; border-radius: 10px;
  background: ${T.paper}; box-shadow: inset 0 0 0 1px rgba(23,26,29,.10);
  transition: box-shadow .18s ease, color .18s ease; }
.g9-seq-cell.is-set { color: ${T.ok}; font-weight: 700; box-shadow: inset 0 0 0 1.4px ${T.ok}; }
.g9-seq-cell.is-now { box-shadow: inset 0 0 0 2px ${T.accent}; color: ${T.accent}; }
.g9-seq-cell.is-wrong { box-shadow: inset 0 0 0 2px ${T.tip}; color: ${T.tip}; }

/* ---------- OVERLAP: TENGSIZLIKLAR TIZIMI (Pribor 1 ustiga qurilgan) ---------- */
.g9-ov { display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 460px; margin: 4px auto 0; }
.g9-ov-row { display: flex; flex-direction: column; gap: 2px; }
.g9-ov-label { font-size: clamp(12px, 1.4vw, 14px); color: ${T.ink3}; }
.g9-ov-strip { width: 100%; display: block; }
.g9-ov-base { stroke: rgba(23,26,29,.18); stroke-width: 1.4; }
.g9-ov-seg { stroke: ${T.ink2}; stroke-width: 6; stroke-linecap: round; }
.g9-ov-dot { fill: ${T.ink2}; stroke: ${T.bg}; stroke-width: 2; }
.g9-ov-dot.is-open { fill: ${T.bg}; stroke: ${T.ink2}; stroke-width: 2; }
.g9-ov-axis { width: 100%; margin-top: 6px; display: block; }

/* ---------- QADAM-BAQADAM NAZARIYA + HARFLI JAVOB (4-ekran) ---------- */
/* 2026-08-23: avval avtomatik ketma-ketlik edi, metodist «yanada
   interaktivroq» dedi. Endi har bir hisoblash o'z-o'zidan CHIQMAYDI —
   o'quvchi BOSADI, va aynan shu bosish natijani ochadi. Savol esa hammasi
   ochilgach VA ovoz tugagach chiqadi: tushuntirish o'quvchining o'z
   qo'lida, taymerda emas. */
.g9-scatter { width: 100%; max-width: 620px; margin: 0 auto; display: flex;
  flex-direction: column; gap: 8px;
  padding: 18px 22px; border-radius: 18px;
  background: ${T.paper};
  box-shadow: 0 10px 26px -14px rgba(${T.shadow},.2), inset 0 0 0 1px ${T.line}; }
.g9-scatter.is-compact { padding: 8px 22px; }
.g9-theory-line.is-note { font-family: 'Manrope', system-ui, sans-serif;
  font-weight: 600; font-size: clamp(13px, 1.5vw, 15px); color: ${T.ink3}; margin-bottom: 4px; }
/* 2026-08-24: metodist «buncha aniqmas, chin YECHIM ko'rsat, qayerdan
   chiqdi» dedi. Endi formula OCHIQ chiqadi (h(t) = 0.1875 · t · (10 − t),
   3-ekrandagi BALL bilan bir xil), va har bir bosishda o'rniga qo'yish
   UCH qatorda — belgili, sonli, natija — ketma-ket ochiladi. */
.g9-hformula { font-weight: 700; font-size: clamp(15px, 1.8vw, 19px); color: ${T.accent};
  margin-bottom: 4px; }
/* g9-hstep (h ATAYIN, chunki .g9-step nomi Sweep asbobining +/- tugmasi
   uchun ALLAQACHON band edi — nom to'qnashuvi 40x34px qutiga majburlab,
   matnni tashqariga toshirib yubordi (2026-08-23, ekranda ko'rindi).
   BIR QATORDA UCHTASI (vertikal to'plam emas) — 615px balandlikda savol
   pastki panel ostiga chiqib ketardi, chunki har birining o'z akkordeon
   qatori balandlikni uch marta oshirardi (o'lchandi 2026-08-24). */
.g9-hstep-row { display: flex; gap: 8px; width: 100%; }
.g9-hstep { flex: 1; display: flex; align-items: center; justify-content: center;
  border: 0; cursor: pointer; padding: 10px 8px; border-radius: 12px;
  background: ${T.bg}; box-shadow: inset 0 0 0 1.4px rgba(23,26,29,.10);
  transition: transform .16s ease, box-shadow .2s ease, background .2s ease;
  animation: g9-hstep-invite 1400ms ease-in-out 2; }
.g9-hstep:hover:not(:disabled) { transform: translateY(-2px); }
.g9-hstep:disabled { cursor: default; }
.g9-hstep-eq { font-weight: 700; font-size: clamp(14px, 1.6vw, 17px); color: ${T.ink}; }
.g9-hstep.is-open { background: ${T.paper}; box-shadow: inset 0 0 0 1.4px ${T.ok}; cursor: default;
  animation: g9-hstep-reveal 380ms cubic-bezier(.22,.9,.3,1) both; }
.g9-hstep.is-open .g9-hstep-eq { color: ${T.ok}; }
.g9-hderiv { display: flex; flex-direction: column; gap: 2px; padding: 4px 4px 0; }
.g9-hderiv-line { opacity: 0; font-size: clamp(12px, 1.4vw, 14px); color: ${T.ink2};
  animation: g9-pop 300ms cubic-bezier(.22,.9,.3,1) both; }
.g9-hderiv-line:last-child { font-weight: 700; color: ${T.ok}; }
@keyframes g9-hstep-invite {
  0%, 100% { box-shadow: inset 0 0 0 1.4px rgba(23,26,29,.10); }
  50% { box-shadow: inset 0 0 0 1.4px ${T.accent}; }
}
@keyframes g9-hstep-reveal {
  0%   { transform: scale(.97); }
  55%  { transform: scale(1.03); }
  100% { transform: scale(1); }
}
/* Ustunlar soni INLINE stil emas, CSS o'zgaruvchisi orqali beriladi: inline stilni
   media so'rov perebit qila olmaydi, shuning uchun telefonda ikki ustun yonma-yon
   qolib, yonga chiqib ketardi (2026-08-27, RU/EN da topildi: ruscha va inglizcha
   variant matni o'zbekchadan uzunroq, 176+190 piksel 333 ga sig'maydi). */
.g9-rmc { display: grid; gap: 10px; width: 100%; max-width: 560px; margin: 0 auto;
  grid-template-columns: repeat(var(--rmc-cols, 1), 1fr); }
.g9-rmc-opt { display: flex; align-items: center; gap: 14px; border: 0; cursor: pointer;
  padding: 4px; border-radius: 14px; background: ${T.paper}; text-align: left;
  box-shadow: 0 8px 20px -14px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  opacity: 0; animation: g9-pop 380ms cubic-bezier(.22,.9,.3,1) both;
  transition: transform .2s ease, box-shadow .2s ease; }
.g9-rmc-opt:hover:not(:disabled) { transform: translateY(-2px); }
.g9-rmc-opt:disabled { cursor: default; }
.g9-rmc-badge { flex-shrink: 0; width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 15px;
  color: ${T.ink3}; background: ${T.bg}; }
.g9-rmc-text { flex: 1; padding: 0 14px 0 2px; font-weight: 600; font-size: clamp(15px, 1.6vw, 18px);
  color: ${T.ink}; }
.g9-rmc-opt.is-ok { box-shadow: 0 10px 24px -14px rgba(${T.okRgb},.5), inset 0 0 0 1.6px ${T.ok}; }
.g9-rmc-opt.is-ok .g9-rmc-badge { color: ${T.ok}; background: ${T.okSoft}; }
.g9-rmc-opt.is-ok .g9-rmc-text { color: ${T.ok}; }
.g9-rmc-opt.is-tip { box-shadow: 0 10px 24px -14px rgba(${T.tipRgb},.45), inset 0 0 0 1.6px ${T.tip}; }
.g9-rmc-opt.is-tip .g9-rmc-badge { color: ${T.tip}; background: ${T.tipSoft}; }
.g9-rmc-opt.is-tip .g9-rmc-text { color: ${T.tip}; }

.g9-go { border: 0; cursor: pointer; padding: 9px 18px; border-radius: 999px;
  font-family: 'Manrope', system-ui, sans-serif; font-size: 13.5px; font-weight: 700;
  color: ${T.ink}; background: ${T.paper}; box-shadow: inset 0 0 0 1.6px ${T.accent}; }
.g9-go.is-ok { box-shadow: inset 0 0 0 1.6px ${T.ok}; color: ${T.ok}; }
.g9-go.is-no { box-shadow: inset 0 0 0 1.6px ${T.tip}; color: ${T.tip}; }
.g9-go.is-ghost { box-shadow: inset 0 0 0 1.4px rgba(23,26,29,.18); color: ${T.ink2}; }
.g9-go.is-tried { box-shadow: inset 0 0 0 1.6px ${T.tip}; color: ${T.tip}; }
.g9-go:disabled { opacity: .45; cursor: default; }

/* ---------- VAQT SIRG'ITUVCHISI ---------- */
.g9-scrub-track { position: relative; width: 100%; max-width: 460px; margin: 0 auto;
  padding-top: 30px; }
.g9-scrub-badge { position: absolute; top: 0; left: 0; transform: translateX(-50%);
  font-family: ${MATH_FONT}; font-size: 13px; font-weight: 700; color: ${T.ink2};
  background: ${T.paper}; padding: 3px 9px; border-radius: 8px; white-space: nowrap;
  box-shadow: 0 6px 12px -6px rgba(23,26,29,.35); pointer-events: none; }
.g9-scrub-rail { position: relative; height: 10px; border-radius: 999px; background: ${T.bg};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.08); margin-top: 16px; }
.g9-scrub-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 999px;
  background: linear-gradient(90deg, ${T.accent}, ${T.tip}); pointer-events: none; }
.g9-scrub-lock { position: absolute; top: 0; bottom: 0; border-radius: 0 999px 999px 0;
  background: repeating-linear-gradient(45deg, rgba(23,26,29,.20) 0 4px, transparent 4px 8px);
  pointer-events: none; }
.g9-scrub-stop { position: absolute; top: 50%; width: 16px; height: 16px; border-radius: 50%;
  background: ${T.paper}; box-shadow: inset 0 0 0 2px rgba(23,26,29,.3); transform: translate(-50%, -50%);
  pointer-events: none; z-index: 1; }
.g9-scrub-stop.is-got { background: ${T.ok}; box-shadow: inset 0 0 0 2px ${T.ok}; }
.g9-scrub-input { position: absolute; top: 0; left: 0; width: 100%; height: 10px; z-index: 2;
  -webkit-appearance: none; appearance: none; background: transparent; outline: none; margin: 0; }
.g9-scrub-input::-webkit-slider-runnable-track { background: transparent; height: 10px; }
.g9-scrub-input::-moz-range-track { background: transparent; height: 10px; }
.g9-scrub-input::-webkit-slider-thumb { -webkit-appearance: none; width: 26px; height: 26px;
  border-radius: 50%; background: ${T.paper}; border: 3px solid ${T.accent}; cursor: pointer;
  box-shadow: 0 3px 10px -2px rgba(23,26,29,.45); transition: transform .12s ease, border-color .15s ease;
  /* WebKit qoidasi: yo'lakcha o'zining balandligidan KENGROQ tugmani
     MARKAZLAMAYDI, tepaga tekislaydi. margin-top = (yo'lakcha - tugma) / 2
     = (10 - 26) / 2 = -8px, aks holda tugma chiziqdan tepada muallaq turadi
     (metodist skrinshoti, 2026-08-22). */
  margin-top: -8px; }
.g9-scrub-input:active::-webkit-slider-thumb { transform: scale(1.14); }
.g9-scrub-input.is-jammed::-webkit-slider-thumb { border-color: ${T.tip}; }
.g9-scrub-input::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%;
  background: ${T.paper}; border: 3px solid ${T.accent}; cursor: pointer; }
.g9-scrub-input.is-jammed::-moz-range-thumb { border-color: ${T.tip}; }
.g9-scrub-input:disabled { opacity: .5; }

/* ---------- TEKISLIK ---------- */
.g9-plane { width: 100%; display: block; max-height: 32vh; touch-action: manipulation; }
.g9-grid line { stroke: rgba(${T.graphRgb},.14); stroke-width: 1; }
.g9-ax line { stroke: ${T.ink2}; stroke-width: 1.6; }
.g9-tick text { fill: ${T.ink3}; font-size: 10px; font-family: ${MATH_FONT}; }
.g9-axlab text { fill: ${T.ink2}; font-size: 10px; font-family: 'Manrope', system-ui, sans-serif; }
.g9-real path { fill: none; stroke: ${T.ink3}; stroke-width: 2.2; stroke-linecap: round;
  stroke-dasharray: 700; stroke-dashoffset: 700; animation: g9-trace-draw 1100ms 260ms ease-out forwards; }
.g9-line path { fill: none; stroke: ${T.accent}; stroke-width: 2.6; stroke-linecap: round;
  stroke-linejoin: round; stroke-dasharray: 700; stroke-dashoffset: 700;
  animation: g9-trace-draw 850ms ease-out forwards; }
@keyframes g9-trace-draw { to { stroke-dashoffset: 0; } }
/* Ovozda «tushadi» deyilgan (audio, S5): nuqta YUQORIDAN tushib, ozgina
   sekirib o'z joyiga o'tirishi kerak — statik "paydo bo'lish" emas. */
.g9-dots circle { fill: ${T.accent}; stroke: ${T.paper}; stroke-width: 1.6;
  transform-box: fill-box; transform-origin: center;
  animation: g9-dot-fall 420ms cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g9-dot-fall {
  0%   { opacity: 0; transform: translateY(-22px) scale(.4); }
  60%  { opacity: 1; transform: translateY(2px) scale(1.15); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.g9-ruler line { stroke: ${T.graph}; stroke-width: 2.4; }
.g9-ruler.is-two line { stroke: ${T.tip}; stroke-width: 3; }
/* TO'SILGAN X: funksiya o'zi shu joyda uzilgani uchun chiziq allaqachon
   ikkiga bo'lingan (pathOf chegaradan chiqganda uzadi) — chizilgan chiziq
   faqat QAYERDA ekanini ko'rsatadi, punktir bilan. */
.g9-asymptote { stroke: ${T.tip}; stroke-width: 1.6; stroke-dasharray: 4 4; opacity: .8; }

/* ---------- YECHIMDAN KEYINGI GRAFIK + JADVAL (2-ekran) ---------- */
/* POTOLOK 615 PIKSELLI NOUTBUKDA O'LCHANDI (2026-08-23): savol + YECHIM
   kartochkasi + grafik + jadval BITTA ekranda — grafikning balandligi
   umumiy .g9-plane qoidasidan (32vh) ATAYIN kichikroq, aks holda jadval
   pastki panel ostiga chiqib ketadi.
   BITTA ROMDA: YECHIM kartochkasi bilan bir xil qog'oz+soya, alohida
   ikki bo'lak bo'lib ko'rinmasin degan metodist talabi.
   KETMA-KETLIK: hammasi bir zumda chiqishi «ko'zni kesardi» — endi
   avval jadval sonlari (tez), keyin nuqta grafikda, oxirida chiziq
   SEKIN chiziladi (1400ms), uchi bosqich ANIQ ko'rinadigan qilib. */
.g9-summary { width: 100%; max-width: 560px; margin: 6px auto 0; display: flex;
  flex-direction: column; gap: 8px;
  padding: clamp(11px, 1.5vw, 16px) clamp(12px, 1.6vw, 18px);
  border-radius: 16px; background: ${T.paper};
  box-shadow: 0 10px 26px -12px rgba(${T.shadow},.22), inset 0 0 0 1px rgba(${T.accentRgb},.3);
  animation: g9-pop 340ms cubic-bezier(.22,.9,.3,1) both; }
/* 2026-08-27, metodist QA: 1366x615 balandlikda YECHIM kartochkasi + jadval
   + grafik birga 19px chiqib ketardi (o'ram kesib tashlardi, ko'zga
   ko'rinmasdan) — Dars01 va Dars02 ikkalasida ham, chunki ikkalasi ham shu
   umumiy blokni ishlatadi. 17vh dan 14vh ga tushirish shu 19px ni yopadi.
   DIQQAT: bu izohda teskari apostrof ISHLATILMASIN — shablon satr uziladi. */
.g9-summary .g9-plane { max-height: min(14vh, 120px); }
.g9-summary .g9-real path { animation-delay: 950ms; animation-duration: 1400ms; }
.g9-summary .g9-dots circle { animation-delay: 550ms; }
/* 6-ekranda (Gate) grafik+jadval JAVOB yozuvi olib tashlangach KENGROQ
   joy qoldi — metodist «kattaroq bo'lsin» dedi (o'lchandi 2026-08-24:
   615px balandlikda 130px dan ortiq bo'sh joy qoldi). */
.g9-summary-compact { max-width: 640px; margin-top: 6px; gap: 10px; }
.g9-summary-compact .g9-plane { max-height: min(26vh, 215px); }
.g9-summary-compact .g9-vtable-cell { font-size: clamp(15px, 1.9vw, 19px); padding: 6px 0; }
.g9-vtable { display: flex; flex-direction: column; gap: 4px; }
.g9-vtable-row { display: flex; align-items: center; gap: 6px; }
.g9-vtable-lbl { width: 16px; flex-shrink: 0; font-family: 'Manrope', system-ui, sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: ${T.ink3}; }
.g9-vtable-cell { flex: 1; text-align: center; padding: 3px 0; border-radius: 8px;
  font-weight: 700; font-size: clamp(13px, 1.5vw, 16px); color: ${T.ink2};
  background: ${T.bg}; opacity: 0;
  animation: g9-pop 320ms cubic-bezier(.22,.9,.3,1) both; }
.g9-vtable-cell.is-hit { color: ${T.ok}; background: rgba(${T.okRgb || '46,125,80'},.12);
  box-shadow: inset 0 0 0 1.4px ${T.ok}; }
/* MONOTONE (3, 4-ekran): jadval qatorlari orasidagi nisbat belgisi —
   flex:1 EMAS, kichik va qattiq kenglikda, aks holda son katakchalari
   bilan bir xil bo'lib qoladi va qator siqilib ketadi. */
.g9-mono-rel { flex: 0 0 auto; width: 20px; text-align: center; font-weight: 700;
  color: ${T.accent}; font-family: ${MATH_FONT}; font-size: clamp(14px, 1.7vw, 18px);
  opacity: 0; animation: g9-pop 260ms cubic-bezier(.22,.9,.3,1) both; animation-delay: 120ms; }

/* ---------- PARITY (5, 6-ekran): qadamlar ro'yxati ---------- */
.g9-par-steps { width: 100%; max-width: 560px; margin: 0 auto; display: flex;
  flex-direction: column; gap: 6px; }
.g9-par-line { padding: 7px 12px; border-radius: 10px; background: ${T.bg};
  font-size: clamp(14px, 1.6vw, 17px); color: ${T.ink};
  opacity: 0; animation: g9-pop 300ms cubic-bezier(.22,.9,.3,1) both; }
.g9-par-check { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.g9-par-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 10px;
  font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink3}; }
.g9-par-verdict { font-family: 'Manrope', system-ui, sans-serif; font-size: 12px; font-weight: 700; }
.g9-par-check.is-ok { box-shadow: inset 0 0 0 1.4px ${T.ok}; }
.g9-par-check.is-ok .g9-par-verdict { color: ${T.ok}; }
.g9-par-check.is-no { box-shadow: inset 0 0 0 1.4px ${T.tip}; }
.g9-par-check.is-no .g9-par-verdict { color: ${T.tip}; }

/* ---------- MINI-GRAFIK (7-ekran, GraphPick) ---------- */
/* 2x2 TO'R: metodist «kattaroq bo'lsin» dedi — to'rttasi bir qatorda
   turganda kartochka torayardi. Kompaund selektor (.g8-pb.g9-graphpick-grid)
   umumiy .g8-pb qoidasidan USTUN turishi uchun ataylab ikki klassli. */
.g8-pb.g9-graphpick-grid { display: grid; grid-template-columns: repeat(2, 1fr); }
.g8-pb.g9-graphpick-grid .g8-pb-card { min-width: 0; }
/* POTOLOK 615 PIKSELLI NOUTBUKDA O'LCHANDI (2026-08-22): 2x2 to'r ikki
   qatordan iborat, shuning uchun bittasi cheksiz kattalashsa, ikkinchi
   qator pastki panel ostiga, xulosa esa ekrandan tashqariga chiqib ketardi
   (metodist skrinshoti — xulosa umuman ko'rinmagan edi). 18vh/615=111px,
   ikki qator + orasi + xulosa uchun zaxira bilan sig'adi. */
.g9-mg-svg { width: 100%; max-width: 280px; display: block; margin: 0 auto;
  max-height: min(18vh, 150px); }
/* Kadr OCHILGANDA chiziqning o'zi chiziladi — sahna sukut holatda ham
   jonli. Kartochkalar orasidagi kechikish mountDelay bilan JSXdan keladi. */
.g9-mg-path { stroke-dasharray: 260; stroke-dashoffset: 260;
  animation: g9-trace-draw 700ms ease-out forwards; }
/* Bosilganda tik SKANER chapdan o'ngga yuradi (6 dan 114 gacha, ya'ni 108px),
   nuqta(lar) aynan skaner o'z joyiga yetganda chiqadi — javob KUZATIB
   topiladi, darrov emas. */
.g9-mg-scan { animation: g9-mg-sweep 900ms linear forwards; opacity: .8; }
@keyframes g9-mg-sweep {
  from { transform: translateX(0); }
  to   { transform: translateX(108px); }
}
.g9-mg-dot { opacity: 0; transform-box: fill-box; transform-origin: center;
  animation: g9-dot-fall 380ms cubic-bezier(.34,1.56,.64,1) both; }

/* ---------- USHLASH O'YINI ---------- */
.g9-react-stage { width: 100%; max-width: 420px; margin: 0 auto; display: flex; justify-content: center;
  cursor: pointer; border-radius: 14px; transition: background 160ms ease; user-select: none; }
.g9-react-stage svg { width: 100%; max-width: 420px; display: block;
  /* 2026-08-22 GOTCHA: bu yerda potolok UMUMAN yo'q edi — viewBox deyarli
     kvadrat (10 -15 180 170) bo'lgani uchun 420 kenglikda balandlik ~397px
     chiqardi va 615 pikselli noutbukda lotokni pastki panel ostiga surib
     yuborardi (3-ekranda topilgan xatoning o'zi, bu yerda tekshirilmagan
     edi). Potolok 3-ekrandagi bilan bir xil mantiqda o'lchandi. */
  max-height: min(30vh, 250px); }
.g9-react-stage.is-hit { background: rgba(56,142,96,.14); }
.g9-react-stage.is-miss { background: rgba(196,68,44,.12); }

/* ---------- TAXTA ---------- */
.g9-board { width: 100%; display: block; max-height: 34vh; }
.g9-bd-cap { fill: ${T.ink3}; font-size: 8px; letter-spacing: .14em;
  font-family: 'Manrope', system-ui, sans-serif; text-transform: uppercase; }
.g9-bd-cell rect { fill: ${T.paper}; stroke: rgba(23,26,29,.14); stroke-width: 1.2; }
.g9-bd-cell text { fill: ${T.ink}; font-size: 15px; }
.g9-bd-cell.is-on rect { stroke: ${T.accent}; stroke-width: 2.2; }
.g9-bd-cell.is-bad rect { stroke: ${T.tip}; stroke-width: 2.2; }
/* SPESIFIKLIK. Selektor g9-bd-cell rect (0,1,1) selektor g9-bd-hit (0,1,0)
   dan KUCHLI, shuning uchun bosish qatlami qog'oz rangiga bo'yalib matnni
   yopib qo'ydi: yacheykalar bo'sh oq quti bo'lib ko'rindi (2026-08-20).
   Selektor kuchaytirildi. */
.g9-bd-cell rect.g9-bd-hit { fill: transparent; stroke: none; cursor: pointer; }
/* STRELKA O'ZI CHIZILADI: 450ms ichida chapdan o'ngga o'sadi, keyin
   nuqta joyiga tushib sekiradi — 2 va 5-ekranning tili bilan bir xil,
   birdaniga «popadigan» statik chiziq emas. */
.g9-bd-line { stroke: ${T.ok}; stroke-width: 2.2;
  stroke-dasharray: 150; stroke-dashoffset: 150;
  animation: g9-trace-draw 450ms ease-out forwards; }
.g9-bd-dot { fill: ${T.ok}; opacity: 0; transform-box: fill-box; transform-origin: center;
  animation: g9-dot-fall 420ms cubic-bezier(.34,1.56,.64,1) both; }
/* TUZOQ TAXTASI (audit): shubhali strelka chizilgan chiziq bilan
   belgilanadi — bu STATIK belgi, chizish animatsiyasi kerak emas. */
.g9-bd-link.is-doubt .g9-bd-line { stroke: ${T.graph}; stroke-dasharray: 5 4; animation: none; }
.g9-bd-link.is-doubt .g9-bd-dot { fill: ${T.graph}; opacity: 1; animation: none; }
.g9-bd-link line.g9-bd-linkhit { stroke: transparent; stroke-width: 14; cursor: pointer; }

/* ---------- QOIDANI O'ZI YIG'ISH ---------- */
.g9-rb-built { width: 100%; max-width: 620px; margin: 0 auto; min-height: 40px;
  padding: 12px 16px; border-radius: 14px; background: ${T.paper};
  box-shadow: inset 0 0 0 1px ${T.line}; display: flex; flex-direction: column; gap: 8px; }
.g9-rb-line { display: flex; align-items: baseline; gap: 8px; width: 100%;
  font-size: clamp(15px, 1.7vw, 18px);
  color: ${T.ink}; animation: g9-pop 320ms cubic-bezier(.22,.9,.3,1) both; }
.g9-rb-no { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
  background: ${T.accent}; color: #fff; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; }
.g9-rb-empty { color: ${T.ink3}; font-style: italic; display: inline-flex; align-items: baseline; }
.g9-rb-caret { display: inline-block; width: 1.5px; height: 15px; margin-left: 4px;
  background: ${T.ink3}; animation: g9-rb-blink 1s step-end infinite; }
@keyframes g9-rb-blink { 50% { opacity: 0; } }
.g9-rb-ask { text-align: center; font-weight: 600; font-size: clamp(14px, 1.6vw, 16px);
  color: ${T.ink}; margin: 12px 0 0; }
.g9-rb-opts { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
  margin-top: 10px; }
.g9-rb-chip { border: 0; cursor: pointer; padding: 12px 20px; border-radius: 12px;
  font-size: clamp(14px, 1.6vw, 17px); font-weight: 600; color: ${T.ink}; background: ${T.paper};
  box-shadow: 0 8px 20px -14px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  transition: transform 120ms ease; }
.g9-rb-chip:hover:not(:disabled) { transform: translateY(-2px); }
.g9-rb-chip:disabled { cursor: default; opacity: .5; }

/* ---------- FORMULA BOSISH ---------- */
.g9-ft-group { width: 100%; max-width: 620px; margin: 10px auto 0; display: flex;
  flex-direction: column; gap: 10px; }
.g9-ft-row { display: flex; align-items: baseline; justify-content: center; gap: 2px;
  font-size: clamp(20px, 2.6vw, 28px); color: ${T.ink}; }
.g9-ft-plain { padding: 6px 2px; }
.g9-ft-sym { border: 0; cursor: pointer; background: transparent; color: ${T.accent};
  font-weight: 700; padding: 6px 8px; border-radius: 10px;
  font-size: clamp(20px, 2.6vw, 28px); font-family: ${MATH_FONT};
  box-shadow: inset 0 0 0 1.6px rgba(${T.accentRgb},.35); }
.g9-ft-sym.is-open { background: ${T.accent}; color: #fff; box-shadow: none; }
.g9-ft-legend { display: flex; flex-direction: column; gap: 4px; text-align: center;
  animation: g9-pop 260ms cubic-bezier(.22,.9,.3,1) both; }
.g9-ft-def { font-size: clamp(13px, 1.5vw, 15px); color: ${T.ink3}; }
.g9-ft-def b { color: ${T.accent}; font-size: clamp(16px, 1.9vw, 19px); margin-right: 8px; }

/* ---------- O'TKAZISH PUNKTI ---------- */
.g9-gate-head { text-align: center; font-size: clamp(20px, 2.4vw, 27px); color: ${T.ink}; }
.g9-gate { width: 100%; max-width: 560px; margin: 0 auto; display: grid;
  grid-template-columns: 1fr 1fr; gap: 10px; }
/* 2026-08-24: metodist «korzinalar konturli bo'lsin, ko'zga aniq
   tashlansin» — fon rangi yetarli emas edi, chekkasi ko'rinmasdi. */
.g9-bin { display: flex; flex-direction: column; gap: 5px; min-height: 58px;
  padding: 8px 12px; border-radius: 14px; background: ${T.okSoft};
  box-shadow: inset 0 0 0 1.6px ${T.ok}; }
.g9-bin.is-no { background: ${T.tipSoft}; box-shadow: inset 0 0 0 1.6px ${T.tip}; }
.g9-bin-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 9px;
  letter-spacing: .14em; text-transform: uppercase; color: ${T.ink3}; }
.g9-bin-row { display: flex; flex-wrap: wrap; gap: 5px; }
.g9-queue { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%;
  animation: g9-pop 300ms cubic-bezier(.22,.9,.3,1) both; }
.g9-queue-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: center; }
.g9-queue-num { font-size: clamp(19px, 2.1vw, 24px); color: ${T.ink}; padding: 4px 12px;
  border-radius: 10px; background: ${T.bg}; }
.g9-target { display: inline-block; margin-left: 10px; padding: 2px 10px; border-radius: 8px;
  background: ${T.okSoft}; color: ${T.ok}; font-size: clamp(14px, 1.5vw, 17px); font-weight: 600; }
.g9-calc { text-align: center; font-size: clamp(15px, 1.7vw, 19px); color: ${T.tip}; }
.g9-ans { display: flex; align-items: baseline; gap: 10px; padding: 8px 16px;
  border-radius: 14px; background: ${T.okSoft}; }
.g9-ans-cap { font-family: 'Manrope', system-ui, sans-serif; font-size: 9px;
  letter-spacing: .14em; text-transform: uppercase; color: ${T.ink3}; }
.g9-ans-body { font-size: clamp(18px, 2vw, 23px); color: ${T.ok}; font-weight: 600; }

/* ---------- CHIZG'ICH ---------- */
.g9-sweep-top { width: 100%; max-width: 560px; display: flex; align-items: center; gap: 10px; }
.g9-sweep-n { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink3}; }
.g9-sweep-name { flex: 1; font-family: 'Manrope', system-ui, sans-serif; font-size: 13px;
  color: ${T.ink2}; }
.g9-sweep-cnt { font-family: 'Manrope', system-ui, sans-serif; font-size: 12px; color: ${T.ink2}; }
.g9-sweep-cnt.is-two { color: ${T.tip}; font-weight: 700; }
.g9-sweep-ctl { display: flex; align-items: center; gap: 12px; }
.g9-sweep-x { font-size: 16px; color: ${T.ink2}; min-width: 76px; text-align: center; }
.g9-step { border: 0; cursor: pointer; width: 40px; height: 34px; border-radius: 10px;
  font-size: 20px; line-height: 1; color: ${T.ink}; background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(23,26,29,.14); }
.g9-step:disabled { opacity: .4; cursor: default; }
.g9-sweep-say { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }

/* ---------- TELEFON ---------- */
@media (max-width: 640px) {
  /* TELEFON. Uch blokni ustunga qo'yish mashinani 173 pikselga cho'zardi va
     3-ekran 33 piksel chiqib ketardi. Endi formula tepada, kirish va chiqish
     esa BIR QATORDA: o'quvchi ikkalasini yonma-yon ko'radi, balandlik esa
     ellik pikselga kamayadi (o'lchandi 2026-08-21). Lotok ham qator bo'lib
     qoladi va o'rab ketadi. */
  .g9-mach { grid-template-columns: 1fr 1fr; gap: 6px 10px; padding: 10px 12px; }
  .g9-mach-body { grid-column: 1 / -1; order: -1; border-left: 0; border-right: 0; padding: 2px; }
  .g9-gate { grid-template-columns: 1fr; }
  .g9-plane, .g9-board { max-height: 26vh; }
  .g9-mach-fig svg { max-height: 15vh; }
  /* Variantlar telefonda DOIM bitta ustun: ikki ustunli ekranlar ham. */
  .g9-rmc { grid-template-columns: 1fr; }
}
`

// ============================================================
// SINF PALITRASI (metodist qarori, 2026-08-06, 2026-08-27 sinf bo'yicha
// qat'iylashtirildi): 8-9-sinf standart palitrasi rad etildi, 5-sinf
// 11-darsi (`grade5/Dars11.jsx`) palitrasi tanlandi. T.* ranglar
// `G9_STYLES` ichida minglab qatorda qattiq yozilgan, CSS bilan tanlab
// bo'lmaydi — shuning uchun matn almashtirish (`recolor`, screens.jsx).
// Neytral (ink/paper/fon asosi) tegilmagan: ikkalasida ham deyarli bir
// xil, farq ko'zga ko'rinmaydi.
//
// BIR MARTA SHU YERDA: Dars01 avval o'z nusxasini saqlagan edi (o'sha
// paytda «faqat shu darsga» deb yozilgan), Dars02 esa umuman ulamagan
// edi — ikkala dars boshqa-boshqa ko'rinardi (metodist, 2026-08-27).
// Endi HAR BIR 9-sinf darsi shu konstantani import qiladi va
// `makeLesson({ ..., recolor: G9_RECOLOR })` ga uzatadi — rang faqat shu
// yerda o'zgaradi, har safar 45 faylni emas.
// ============================================================
export const G9_RECOLOR = [
  ['#C9542C', '#FF4F28'],       // accent: kulrang g'isht -> yorqin qizil-sariq
  ['#F8E7DE', '#FFE8E1'],       // accentSoft
  ['201,84,44', '255,79,40'],   // accentRgb
  ['#A55D19', '#FF4F28'],       // tip = tipInk = no (xato/eslatma) -> accent bilan bir xil, 5-sinfdagidek
  ['#FBEDD9', '#FFE8E1'],       // tipSoft -> accentSoft
  ['165,93,25', '255,79,40'],   // tipRgb
  ['#28774A', '#1F7A4D'],       // ok (to'g'ri javob) -> 5-sinf yashili
  ['#E5F2E9', '#E3F0E8'],       // okSoft
  ['40,119,74', '31,122,77'],   // okRgb
  ['#6B5B45', '#019ACB'],       // graph = cool (tekshiruv qatlami) -> 5-sinf ko'gi
  ['#EDE4D3', '#DFF3F9'],       // graphSoft = coolSoft
  ['107,91,69', '1,154,203'],   // graphRgb
]
