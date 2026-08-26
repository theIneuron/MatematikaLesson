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

const scaleOf = ({ from, to, yFrom, yTo }) => {
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

const pathOf = (f, sc) => {
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
const Plane = ({ sc, xLabel, yLabel, children }) => {
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
export function RecallMC({ intro, formula, steps, ask, items, after, cols = 1, audio, onSolved, onStep }) {
  const t = useT()
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
                    {isRevealed ? s.lines[s.lines.length - 1] : s.head + ' = ?'}
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
                    {line}
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

          <div className="g9-rmc" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
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
export function Gate({
  formula, f, queue, ask, answer, after, calcOf, warmup, chart, fact, onSolved, audio, onStep,
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
      <div className="g9-gate-head" style={{ fontFamily: MATH_FONT }}>{formula}</div>

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
              {explained ? (warmup.result || warmup.lines[warmup.lines.length - 1]) : warmup.head}
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
              <span className="g9-bin-cap">{t(TXT.passes)}</span>
              <span className="g9-bin-row" style={{ fontFamily: MATH_FONT }}>
                {passed.map((v) => <b key={'p' + v} className="g9-pair">{fmt(v)}</b>)}
              </span>
            </div>
            <div className="g9-bin is-no">
              <span className="g9-bin-cap">{t(TXT.blocked)}</span>
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
                    x = {fmt(cur.v)}
                  </span>
                  <button type="button" className="g9-go is-ok" disabled={!canAnswer}
                    onClick={() => send(true)}>{t(TXT.passes)}</button>
                  <button type="button" className="g9-go is-no" disabled={!canAnswer}
                    onClick={() => send(false)}>{t(TXT.blocked)}</button>
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
// 6. USLUBLAR. Prefiks g9-: umumiy qatlamning g8- klasslari bilan
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
.g9-rmc { display: grid; gap: 10px; width: 100%; max-width: 560px; margin: 0 auto; }
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
.g9-summary .g9-plane { max-height: min(17vh, 140px); }
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
}
`
