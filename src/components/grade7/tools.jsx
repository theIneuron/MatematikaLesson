// ============================================================================
// 7-sinf ASBOBLARI. Hammasi shu faylda, boshqa sinf bilan BO'LISHILMAYDI --
// 11-sinf naqshi (src/components/grade11/tools.jsx). Yadro ./core.jsx.
// Kontrakt: src/books/grade7/ETALON_7SINF.md
//
// ASBOBLAR (matematikani KO'RSATADI):
//   SubstituteRows -- sonli guvoh: ifoda, son qo'yish, qiymat
//   Transform      -- qadamba-qadam qayta yozish: qismni va amalni tanlash
//   DistributeDemo -- ko'paytuvchi yoylar bilan har bir qo'shiluvchiga boradi
//   SignFlipDemo   -- qavs oldidagi minus ishoralarni birma-bir ag'daradi
//   MergeDemo      -- o'xshash qo'shiluvchilar bittaga qo'shiladi
//   FlipTwiceDemo  -- ikki minus ishorani ikki marta ag'daradi
//   CrateScene     -- yashiklar sahnasi: faqat buyumlar, personaj YO'Q
//   ExplainClip    -- mini-rolik, nuqtalar bilan qadamga qaytish
//
//   BuildValue     -- teskari yo'l: qiymat berilgan, yozuvni o'quvchi yig'adi
//
// JAVOB SHAKLLARI (javobni QABUL QILADI, hech nima ko'rsatmaydi):
//   Probe, ProbeChain (blits paneli ham), RuleGate, SlotFill, AuditRows
// Bu farq kontraktda ishlatiladi: 11-ekran ASBOBSIZ, lekin javob shakli bor.
//
// Xato javob naqshi (1, 2 va 5-sinfdan, metodist qarori 2026-08-05):
//   1. tovush playWrong()  2. variant SARIQ bo'ladi va o'chadi
//   3. pastda Feedback bloki  4. 300 ms keyin AYNAN SHU razbor OVOZ bilan
// To'g'ri javobda: playCorrect(), variant yashil, xatolar kaskad bilan yig'iladi.
//
// TEG: har xato variantda ixtiyoriy `tag` bo'ladi va asbob uni onSolved
// payloadida qaytaradi. Baho FAQAT blitsda, qolgan ekranlar teg yozadi (8.5).
//
// import React SHART: LMS xom jsx ni KLASSIK rejimda yuklaydi.
// ============================================================================
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ACT,
  Ask,
  Btn,
  CallToAct,
  DoneRow,
  T,
  Expr,
  Feedback,
  FitRow,
  Fx,
  looksMath,
  Hint,
  L,
  MATH_FONT,
  Options,
  Panel,
  RuleCard,
  Slot,
  TapMark,
  UI_TXT,
  useLang,
  useNarratedSteps,
  useSfx,
  useT,
  useShuffled,
} from './core.jsx'

export const UI = {
  check: L('Tekshirish', 'Проверить', 'Check'),
  again: L('Qaytadan', 'Заново', 'Reset'),
  another: L('Boshqa son bilan', 'Подставить другое число', 'Try another number'),
  pickPart: L('Qismni tanlang', 'Выберите часть', 'Pick a part'),
  nextRow: L('Keyingi qatorni hisoblash', 'Посчитать следующую строку', 'Compute the next row'),
  whichNum: L("Qaysi sonni qo'yamiz?", 'Какое число подставить?', 'Which number shall we substitute?'),
  // QIYMAT YO'Q. Nolga bo'lishda natija joyi BO'SH qolardi, va bo'shliq
  // «hisoblanmadi» degan taassurot berardi, «qiymat yo'q» degan emas
  // (QA 2026-08-23, 2-dars 7-ekran). Endi joyda belgi turadi.
  noValue: L("qiymat yo'q", 'значения нет', 'no value'),
  // Nuqta noto'g'ri qo'yilganda. Javobni AYTMAYDI -- qaysi nuqta kerakligini
  // emas, shartga QAYTARADI (asbob nazoratchi, oracle emas).
  missPoint: L(
    "Bu boshqa nuqta. Shartni yana bir bor o'qing va qaytadan belgilang.",
    'Это другая точка. Перечитай условие и отметь заново.',
    'That is a different point. Read the condition again and mark it once more.',
  ),
  askPart: L("Nimani birinchi hisoblaymiz? Yozuvdagi amal belgisini bosing.", 'Что считаем первым? Нажми на знак действия в записи.', 'What do we do first? Tap an operation sign in the expression.'),
  askAct: L('Bu qaysi bosqich amali?', 'Какой это ступени действие?', 'Which stage is this operation?'),
  ruleFirst: L('Qoidada nima BIRINCHI keladi?', 'Что в правиле идёт первым?', 'What comes first in the rule?'),
  ruleNext: L('Keyin nima keladi?', 'Что идёт дальше?', 'What comes next?'),
  // Bo'sh ramka NIMA QILISH kerakligini aytadi. Ilgari u yerda yozuv kursori
  // miltillardi, va ramka KIRITISH MAYDONIGA o'xshab qolgandi: QA «yozish
  // kerakka o'xshaydi, pastdagilarni bosish emas» dedi (2026-08-23).
  ruleHere: L(
    "Pastdan bo'lak tanlang -- qoida shu yerda yig'iladi",
    'Выбери часть снизу — правило соберётся здесь',
    'Pick a part below and the rule is built here',
  ),
  step: L('qadam', 'шаг', 'step'),
  ftMul: L('Muljitellar:', 'Множителей:', 'Factors:'),
  ftNums: L('Sonlar:', 'Числа:', 'Numbers:'),
  ftSum: L("Qo'shiluvchilar:", 'Слагаемых:', 'Terms:'),
  // HADLAR LENTASI (TermStrip, B4). Tur nomi HADLAR SONI bilan chiqadi:
  // darslik turlarni aynan shu bilan ajratadi (38-bet).
  tsCut: L(
    "Belgini bosing: ko'phad hadlarga ajraladi",
    'Нажми на знак: многочлен разделится на члены',
    'Tap a sign: the polynomial splits into terms',
  ),
  tsHads: L('Hadlar:', 'Членов:', 'Terms:'),
  agCells: L('Kataklar:', 'Клеток:', 'Cells:'),
  // UCHNI KO'CHIRISH QANDAY BOSHLANISHINI EKRANNING O'ZI AYTSIN. Chizmaning
  // to'q sariq ramkasi «bu yerda harakat bor» deydi, lekin NIMA qilish
  // kerakligini aytmaydi: sichqonchada kursor o'zgaradi, telefonda esa hech
  // qanday ishora yo'q. Metodist 2026-08-25: «a kak mne stavit novuyu
  // tochku?» -- ya'ni ishora yetmagan.
  fgTapNode: L(
    "Setkadagi nuqtani bosing -- uch o'sha yerga ko'chadi",
    'Нажми на точку сетки — вершина переедет туда',
    'Tap a point on the grid and the vertex moves there',
  ),
  fgSum: L("Burchaklar yig'indisi:", 'Сумма углов:', 'Angle sum:'),
  fgGuess: L('taxmin', 'предположение', 'a guess'),
  fgMeasure: L("O'lchov", 'Измерение', 'The measurement'),
  tsKind: [
    L('Birhad', 'Одночлен', 'Monomial'),
    L('Ikkihad', 'Двучлен', 'Binomial'),
    L('Uchhad', 'Трёхчлен', 'Trinomial'),
    L("To'rthad", 'Четырёхчлен', 'Four-term polynomial'),
    L("Ko'phad", 'Многочлен', 'Polynomial'),
  ],
  dlMiss: L(
    "Bu nuqtagacha masofa",
    'До этой точки расстояние',
    'The distance to this point is',
  ),
  dlNeed: L('kerak esa', 'а нужно', 'but we need'),
  eqPick: L(
    "Amalni tanlang. U IKKALA tomonga birdan qo'llanadi.",
    'Выбери действие. Оно применится сразу к обеим частям.',
    'Pick an operation. It applies to both sides at once.',
  ),
  // BuildValue o'lchagichi. «Hozir» -- o'quvchi yig'gan yozuvning qiymati,
  // «kerak» -- topshiriqning maqsadi. Ikkalasi YONMA-YON turadi.
  bvTarget: L('Kerak', 'Нужно', 'Target'),
  bvYours: L('Sizda chiqdi', 'У тебя вышло', 'You got'),
  bvIsRight: L('Javob', 'Ответ', 'Answer'),
  bvHere: L('Shu yerga', 'Сюда', 'Here'),
  bvUndo: L('Bitta orqaga', 'На шаг назад', 'One step back'),
  bvLeft: L('qoldi', 'осталось', 'left'),
  bvEmpty: L(
    "Kartalarni bosib yozuv yig'ing",
    'Собери запись, нажимая карточки',
    'Build the expression by tapping cards',
  ),
}

// Xato/to'g'ri javobning umumiy ishlovi: tovush + ovozli razbor.
export function useAnswerFx(audio) {
  const sfx = useSfx()
  const t = useT()
  return {
    right: () => sfx.playCorrect(),
    wrong: (hint) => {
      sfx.playWrong()
      if (audio && audio.say && hint) audio.say(t(hint))
    },
    // Yozuvning ICHIDAGI bosish: baho emas, kalkulyator klavishasi.
    tap: () => sfx.playTap(),
  }
}

// ============================================================
// Probe -- bitta savol, aynan 4 variant.
// unscored=true (prognoz): yashil/qizil YO'Q, javob shunchaki yozib olinadi.
// ============================================================
export function Probe({ data, cols = 2, unscored = false, onSolved, disabled, minH, audio, fbSlot = 82, zone = true }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [ok, setOk] = useState(false)
  // Xato variantlarning TEGLARI. Baho emas, teg: qaysi yanglish tushuncha ishga
  // tushdi (ETALON_7SINF.md 8.5). Yakunda kamchilik SO'Z bilan ataladi.
  const [tags, setTags] = useState([])

  const items = useMemo(() => data.items.map((it) => ({ id: it.id, label: t(it.label) })), [data.items, t])

  const pick = (opt) => {
    const src = data.items.find((it) => it.id === opt.id)
    if (unscored) {
      setPicked(opt.id)
      // Prognoz: to'g'ri-noto'g'ri YO'Q, lekin javobdan keyin izoh chiqadi.
      // Variantning O'Z izohi bo'lsa, aynan u chiqadi (§8.3: har bir variantga
      // o'z razbori). Bo'lmasa -- hamma uchun umumiy `afterPredict`.
      const own = src && src.hint ? src.hint : data.afterPredict
      if (own) { setOk(false); setHint(own) }
      if (onSolved) onSolved({ picked: opt.id, correct: null })
      return
    }
    if (src && src.correct) {
      setPicked(opt.id)
      setOk(true)
      setHint(data.ok || null)
      fx.right()
      if (audio && audio.say && data.ok) audio.say(t(data.ok))
      if (onSolved) onSolved({ picked: opt.id, correct: true, attempts: wrong.length + 1, tags })
      return
    }
    setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
    if (src && src.tag) setTags((prev) => (prev.indexOf(src.tag) === -1 ? prev.concat(src.tag) : prev))
    setOk(false)
    setHint(src && src.hint ? src.hint : null)
    fx.wrong(src && src.hint ? src.hint : null)
  }

  return (
    <>
      {/* Savol va variantlar BITTA ZONADA: yorliq, savol, variantlar.
          11-sinf tuzilishi -- ekranda «osilib qolgan» element bo'lmaydi. */}
      <div className={zone ? 'g7-zone' : 'g7-nozone'}>
        {data.question ? <p className="g7-qpill">{t(data.question)}</p> : null}
        {/* Qayerga bosish kerakligi KO'RINIB tursin (texnik topshiriq 5-band).
            Belgi variantlar bilan BIR CHIZIQDA: variantlar cheklangan
            kenglikda, ya'ni belgi ham o'sha ustunda turishi kerak. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'inherit' }}>
        <CallToAct kind="pick" done={!!picked || disabled} />
        <Options
          items={items}
          picked={picked}
          wrong={wrong}
          onPick={pick}
          disabled={disabled || (unscored && !!picked)}
          cols={cols}
          minH={minH}
          neutral={unscored}
        />
        </div>
      </div>
      {/* fbSlot={0} -- joyni OLDINDAN band qilmaslik. Sahnali slaydlarda
          shu 80px sahnaga beriladi: javobdan keyin variantlar yig'ilib,
          razborga joy o'zi bo'shaydi. */}
      {fbSlot > 0 ? (
        <Slot mh={fbSlot}>
          <Feedback show={!!hint} ok={ok} tone={unscored ? 'neutral' : undefined}>
            {hint ? t(hint) : null}
          </Feedback>
        </Slot>
      ) : (
        <Feedback show={!!hint} ok={ok} tone={unscored ? 'neutral' : undefined}>
          {hint ? t(hint) : null}
        </Feedback>
      )}
    </>
  )
}

// ============================================================
// ProbeChain -- savollar birma-bir. Javob berilgani QATORGA yig'iladi, joy
// keyingi savolga bo'shaydi. BLITS-panel ham shu asbob: to'rt savol bitta
// panelda, javob berilgani qatorga tushadi.
//
// onItem -- har savol yopilganda: {index, correct, attempts, tags}. Blits
// YAGONA baholanadigan ekran, unga birinchi urinishlar soni kerak (8.5).
//
// `question` -- butun zanjir uchun SAVOL, yozuvning USTIDA turadi. Ilgari
// ekranda faqat yozuv va to'rt variant bo'lardi: `7 · 4 − 5 =` nimani
// so'rayotgani hech qayerda aytilmasdi (metodist 2026-08-14).
// Savolni SO'Z bilan beradigan bandda `question: null` yoziladi -- u o'zi
// savol, tepasiga yana bittasini qo'yish TAKROR bo'lardi.
// ============================================================
export function ProbeChain({ items, cols = 4, question, onSolved, onStep, onItem, disabled, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState([])
  const [okId, setOkId] = useState(null)
  const [ok, setOk] = useState(false)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [qTags, setQTags] = useState([])   // hozirgi savolning teglari
  const [allTags, setAllTags] = useState([])

  const current = items[idx]
  // Bandning O'Z savoli zanjir savolidan USTUN. `null` ham javob: u savolni
  // O'CHIRADI, ya'ni «hech narsa berilmagan» bilan «ataylab yo'q» farqlanadi.
  const ask = current && current.question !== undefined ? current.question : question

  const pick = (opt) => {
    const src = current.items.find((it) => it.id === opt.id)
    if (src && src.correct) {
      setOkId(opt.id)
      setOk(true)
      setHint(current.ok || null)
      fx.right()
      if (audio && audio.say && current.ok) audio.say(t(current.ok))
      // YIG'ILGAN QATOR MATN EMAS, MANBA bo'lib saqlanadi. Ilgari bu yerda
      // `t(prompt) + ' ' + t(label)` turardi, ya'ni satr JAVOB BERILGAN
      // paytdagi tilda muzlab qolardi: o'quvchi tilni almashtirsa, tepadagi
      // yashil qatorlar eski tilda qolaverardi (QA 2026-08-25: ruscha
      // ekranda o'zbekcha va inglizcha qatorlar turardi). Endi til
      // CHIZILAYOTGANDA hal qilinadi.
      const row = { prompt: current.prompt, label: src.label }
      if (onItem) onItem({ index: idx, id: opt.id, correct: true, attempts: wrong.length + 1, tags: qTags })
      setTimeout(() => {
        setDone((prev) => prev.concat(row))
        setWrong([])
        setQTags([])
        setOkId(null)
        setOk(false)
        setHint(null)
        const next = idx + 1
        setIdx(next)
        if (onStep) onStep(next)
        if (next >= items.length && onSolved) onSolved({ correct: true, tags: allTags })
      }, 1900)  // maqtov o'qilishga ulgursin (1100ms da ko'z yetmasdi)
      return
    }
    setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
    if (src && src.tag) {
      setQTags((prev) => (prev.indexOf(src.tag) === -1 ? prev.concat(src.tag) : prev))
      setAllTags((prev) => (prev.indexOf(src.tag) === -1 ? prev.concat(src.tag) : prev))
    }
    setOk(false)
    setHint(src && src.hint ? src.hint : null)
    fx.wrong(src && src.hint ? src.hint : null)
  }

  return (
    <>
      {done.map((row, i) => (
        <DoneRow key={i}>{t(row.prompt) + ' ' + t(row.label)}</DoneRow>
      ))}
      {current ? (
        <div className="g7-in" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Ask tight>{ask ? t(ask) : null}</Ask>
          {/* `wrap` -- savol SO'Z bilan berilgan holat. `.g7-expr` da
              `white-space: nowrap` turadi va proza chetga chiqib KO'RINMAY
              qoladi: skroll yo'q, shuning uchun kesilgani bilinmaydi
              (ETALON_7SINF.md §6.2, 11-sinfda 557px chiqib ketgan edi). */}
          {/* `wrap` -- savol PROZA bilan berilgan. Unda bosqich rangi
              o'chiriladi: gapdagi tire amal belgisi emas.
              To'g'ri javob YOZUVGA KELIB TUSHADI: son yozuvning o'ng
              chetida qalqib chiqadi va shundan keyingina qator yig'iladi.
              Bu darsning o'sha qo'l yozuvi -- kadrlarda, yo'laklarda va
              qayta yozishda son AYNAN shunday tug'iladi. */}
          <Expr
            size="row"
            plain={current.wrap}
            className={current.wrap ? 'g7-wrap' : undefined}
            tail={okId && !current.wrap ? (
              <span className="g7-tf-tok is-born g7-probe-val">
                {t((current.items.find((x) => x.id === okId) || {}).label)}
              </span>
            ) : null}
          >
            {t(current.prompt)}
          </Expr>
          <CallToAct kind="pick" done={!!okId || disabled} />
          {/* Namoyish faqat TO'G'RI JAVOBDAN KEYIN. Ilgari u savoldan OLDIN,
              markazlangan oq kartochkada turardi va O'SHA IFODANI boshqa
              yozuvda takrorlardi (3 · (4 + 5) va 3 ( 4 + 5 )) -- metodist
              2026-08-10 da aynan shuni belgilab ko'rsatdi. Endi takror yo'q:
              avval savol, javobdan keyin esa yoylar NEGA shunday ekanini
              ko'rsatadi, yig'ilgan variantlar joyida. */}
          {current.viz && okId ? (
            <div className="g7-in" style={{ paddingBlock: 2 }}>{current.viz(true)}</div>
          ) : null}
          <Options
            items={current.items.map((it) => ({ id: it.id, label: t(it.label) }))}
            picked={okId}
            wrong={wrong}
            onPick={pick}
            disabled={disabled}
            cols={cols}
          />
        </div>
      ) : null}
      <Feedback show={!!hint} ok={ok}>{hint ? t(hint) : null}</Feedback>
    </>
  )
}

// ============================================================
// RuleGate -- SAVOL-OLDIN-QOIDA (3-sinf naqshi, Dars13-16).
// Qoida kartochkasi FAQAT to'g'ri javobdan keyin ochiladi.
// swap bo'lsa: kartochka O'RNIGA jamlanma keladi (pastga QO'SHILMAYDI).
// ============================================================
export function RuleGate({ probe, rule, swap, onSolved, onStep, disabled, audio }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [swapped, setSwapped] = useState(false)

  const solved = (res) => {
    setOpen(true)
    if (onStep) onStep('rule')
    if (onSolved) onSolved(res)
  }

  const card = swapped && swap ? swap : rule

  return (
    <>
      {!open ? (
        <Probe data={probe} cols={2} minH={48} audio={audio} disabled={disabled} onSolved={solved} />
      ) : (
        <>
          <DoneRow>{t(probe.shortAnswer)}</DoneRow>
          {rule.demo ? (
            <div className="g7-panel g7-panel-paper" style={{ padding: '4px 8px', maxWidth: 380, width: '100%', margin: '0 auto' }}>
              {rule.demo}
            </div>
          ) : null}
          {/* Formulalar LawBox ramkasida (11-sinf naqshi): asosiy yozuv oddiy
              ish satridan farq qilib turadi. `laws` bo'lmasa eski `lines`
              rejimi ishlaydi. */}
          {/* AKKORDEON rejimi (texnik topshiriq, 8-ekran): o'quvchi qoidalarni
              BIRMA-BIR ochadi. `accordion` bo'lmasa eski kartochka ishlaydi. */}
          {card.accordion ? (
            <>
              <span className="g7-zone-cap">{t(card.badge)}</span>
              <RuleAccordion laws={card.laws} hintLabel={card.openHint} />
            </>
          ) : (
            <RuleCard
              badge={t(card.badge)}
              lawLabel={card.lawLabel ? t(card.lawLabel) : null}
              laws={card.laws ? card.laws.map((w) => ({ formula: w.formula, note: w.note ? t(w.note) : null })) : null}
              lines={(card.lines || []).map((l) => t(l))}
              example={card.example ? t(card.example) : null}
            />
          )}
          {/* Slot FAQAT `swap` bo'lganda: aks holda 44px BO'SH joy egallanardi va
              uch ramkali qoida kartochkasi 615px da sig'masdan kesilardi. */}
          {swap && !swapped ? (
            <Slot mh={44} style={{ alignItems: 'center' }}>
              <Btn tone="soft" ready onClick={() => { setSwapped(true); if (onStep) onStep('both') }}>
                {t(swap.button)}
              </Btn>
            </Slot>
          ) : null}
        </>
      )}
    </>
  )
}

// ============================================================
// SlotFill -- bo'sh kataklarni to'ldirish: belgilar yoki bo'laklar.
// Tekshiruv SON QO'YIB bajariladi.
// ============================================================
export function SlotFill({ template, parts, answer, checkNote, wrongs, onSolved, onStep, prompt, promptCap, tightAsk, wide, noReset, disabled, audio }) {
  // Bo'laklar banki ham aralashadi: to'g'ri bo'lak birinchi turmasin (§8.3).
  parts = useShuffled(parts)
  const t = useT()
  const fx = useAnswerFx(audio)
  const [filled, setFilled] = useState(() => answer.map(() => null))
  const [active, setActive] = useState(0)
  const [checked, setChecked] = useState(false)
  const [hint, setHint] = useState(null)
  const [tags, setTags] = useState([])
  const [tries, setTries] = useState(0)
  const complete = filled.every((v) => v !== null)
  const correct = checked && filled.join('|') === answer.join('|')

  const put = (partId) => {
    if (correct) return
    fx.tap()
    const next = filled.slice()
    next[active] = partId
    setFilled(next)
    setChecked(false)
    setHint(null)
    const empty = next.findIndex((v) => v === null)
    setActive(empty === -1 ? active : empty)
  }

  const check = () => {
    setChecked(true)
    if (filled.join('|') === answer.join('|')) {
      fx.right()
      if (onStep) onStep('checked')
      if (onSolved) onSolved({ correct: true, filled, attempts: tries + 1, tags })
      return
    }
    setTries((n) => n + 1)
    const key = filled.join('|')
    const exact = (wrongs || []).find((x) => x.key === key)
    const fallback = (wrongs || []).find((x) => x.key === '*')
    const h = (exact && exact.hint) || (fallback && fallback.hint) || null
    const tag = exact && exact.tag ? exact.tag : null
    if (tag) setTags((prev) => (prev.indexOf(tag) === -1 ? prev.concat(tag) : prev))
    setHint(h)
    fx.wrong(h)
  }

  const reset = () => {
    setFilled(answer.map(() => null))
    setActive(0)
    setChecked(false)
    setHint(null)
  }

  // BO'LAKLARNING SHRIFTI HAM BUTUN NABORGA (metodist qoidasi 2026-08-22).
  // Bo'laklar doim matematik monoshriftda va 800 vaznda terilardi. Son uchun
  // bu to'g'ri, ammo «proporsionallik emas» kabi SO'Z bo'lak yirik va o'ta
  // qalin bo'lib chiqardi -- QA aynan shuni ko'rsatdi. Endi qoida javob
  // variantlaridagi bilan bir xil: yo hammasi yozuv, yo hammasi proza.
  const partsMath = parts.length > 0 && parts.every((p) => looksMath(t(p.label)))

  const labelOf = (id) => {
    const p = parts.find((x) => x.id === id)
    return p ? t(p.label) : ''
  }

  // `wide` -- topshiriq matni uzun bo'lgan ekran uchun (12-ekran): 660px da
  // inglizcha matn uchinchi satrga o'tib, ekran 23px oshib ketardi
  // (o'lchov 2026-08-14).
  return (
    <div className="g7-col">
      {/* Topshiriq e'loni endi UMUMIY asbob (core.jsx `Ask`): shakl bitta
          joyda turadi, ilgari o'sha razmetka bu yerda va `BracketGap` da
          ikki marta ko'chirilgan edi. */}
      <Ask kind="task" tight={tightAsk} cap={promptCap ? t(promptCap) : undefined}>{prompt ? t(prompt) : null}</Ask>
      {/* YOZUV KO'CHIRILMAYDI, KICHRAYADI (QA 2026-08-22, 19-dars 10-slayd).
          Ilgari panel `flex-wrap` bilan edi, va uzun yozuv so'z chegarasida
          uchga bo'linib ketardi: "= 5x ayirish" birinchi qatorda, "4y"
          ikkinchisida yolg'iz, kataklar esa uchinchisida. Endi butun yozuv
          bitta qatorda turadi va joyga qarab bir xil koeffitsiyent bilan
          kichrayadi (`FitRow`). Telefonda ko'chirish qoladi. */}
      <div className="g7-panel g7-panel-paper g7-expr g7-expr-big g7-slotfill-panel" style={{ display: 'flex', alignItems: 'center', minHeight: 48 }}>
        <FitRow min={0.56}>
          <div className="g7-fitflex">
        {template.map((piece, i) => {
          if (typeof piece === 'string') return <span key={i}>{piece}</span>
          const idx = piece.slot
          const value = filled[idx]
          return (
            <button
              type="button"
              key={i}
              onClick={() => { setActive(idx); setHint(null) }}
              className={'g7-frame' + (active === idx && !correct ? ' g7-picked' : '')}
              style={{
                // O'LCHAM `em` DA, PIKSELDA EMAS: yozuv sig'dirish uchun
                // kichrayganda katak ham u bilan birga kichrayishi kerak.
                // Piksel bilan berilgan katak kichraymay qolib, yonidagi
                // harfning ustiga chiqib turardi.
                minWidth: '1.53em',
                minHeight: '1.47em',
                padding: '0 .27em',
                cursor: 'pointer',
                font: 'inherit',
                color: value ? (correct ? '#1F7A4D' : '#14161A') : '#9AA1AC',
                background: 'rgba(255,255,255,.75)',
              }}
            >
              {value ? labelOf(value) : '?'}
            </button>
          )
        })}
          </div>
        </FitRow>
      </div>

      <Slot mh={50}>
        {/* MARKAZDA va YIRIK. Ilgari bo'laklar chap chetda, mayda shriftda
            turardi va yozuvdan uzoqda edi -- ko'z ular orasida sakrardi
            (metodist 2026-08-14). Endi ular yozuvning TAGIDA, o'sha o'qda. */}
        <div className="g7-partsrow">
          <CallToAct kind="tap" done={correct || disabled} />
          {parts.map((p) => (
            <button
              type="button"
              key={p.id}
              className={'g7-opt g7-part ' + (partsMath ? 'is-math' : 'is-prose')}
              disabled={correct || disabled}
              onClick={() => put(p.id)}
            >
              {t(p.label)}
            </button>
          ))}
        </div>
      </Slot>

      {/* JAVOB TO'G'RI BO'LGACH TUGMALAR KERAK EMAS: tekshirishga narsa
          qolmadi, «Qaytadan» ham ma'nosiz. Ilgari o'chgan tugma joyida
          turardi va 46 px olib turardi -- aynan yechilgan holatda, ya'ni
          ekran eng tor bo'lgan paytda (razbor va xulosa qo'shilganda).
          2026-08-17: walker tuzatilgach ma'lum bo'ldi, yetti darsda shu
          sababdan ham budjet oshib ketgan. Kontent QISQARADI, o'smaydi. */}
      <Slot mh={correct ? 0 : 46}>
        {!correct ? (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Btn mark="check" tone="accent" ready={complete && !disabled} onClick={check} disabled={!complete || disabled}>
              {t(UI.check)}
            </Btn>
            {/* `noReset` -- amaliyotda «Qaytadan» YO'Q (metodist qarori
                2026-08-20: u kerak emas). Uyani bosib tarkibini almashtirish
                mumkin, ya'ni tugmasiz ham hech qayerda qotib qolinmaydi.
                Nazariy darslarga tegilmadi: 1-12 darslar shu ko'rinishda
                topshirilgan. */}
            {noReset ? null : <Btn tone="ghost" onClick={reset}>{t(UI.again)}</Btn>}
          </div>
        ) : null}
      </Slot>

      <Slot mh={58}>
        {correct && checkNote ? <Feedback show ok>{t(checkNote)}</Feedback> : null}
        {!correct ? <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback> : null}
      </Slot>
    </div>
  )
}

// ============================================================
// RuleAccordion -- uch qoida, o'quvchi BIRMA-BIR ochadi (texnik topshiriq,
// 8-ekran). Har qoidada: formula, qisqa tushuntirish va misol.
// Bir vaqtda BITTASI ochiq: uchtasi birdan ochilsa 615px ga sig'maydi va
// diqqat ham tarqaladi.
// ============================================================
export function RuleAccordion({ laws, hintLabel }) {
  const t = useT()
  const [open, setOpen] = useState(-1)
  return (
    <div className="g7-acc">
      {laws.map((law, i) => {
        const isOpen = open === i
        return (
          <div key={i} className={'g7-acc-item' + (isOpen ? ' is-open' : '')}>
            <button
              type="button"
              className="g7-acc-head"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="g7-acc-formula">{law.formula}</span>
              <span className="g7-acc-sign" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="g7-acc-body" hidden={!isOpen}>
              <p className="g7-acc-note">{t(law.note)}</p>
              {law.example ? <p className="g7-acc-ex">{law.example}</p> : null}
            </div>
          </div>
        )
      })}
      {open < 0 && hintLabel ? <CallToAct kind="tap" text={hintLabel} /> : null}
    </div>
  )
}

// ============================================================
// CompareCards -- IKKI YONMA-YON KARTOCHKA: ko'paytuvchi va qo'shiluvchi.
// Texnik topshiriq 2026-08-10, 4-ekran: farqni RANG, YOY va qisqa misol
// bilan ko'rsatish. Foto yo'q -- yoylar oddiy SVG, qolgani CSS.
// Chapdagi yoylar HAR BIR qo'shiluvchiga boradi, o'ngda yoy umuman yo'q:
// qo'shiluvchi taqsimlanmaydi.
// ============================================================
export function CompareCards({ left, right }) {
  const t = useT()
  const card = (d, tone, arcs) => (
    <div className="g7-cmp" style={{ borderTopColor: tone }}>
      <span className="g7-cmp-cap" style={{ color: tone, background: tone === T.graph ? T.graphSoft : T.accentSoft }}>
        {t(d.cap)}
      </span>
      <div className="g7-cmp-expr" style={{ color: tone }}>{d.expr}</div>
      <svg viewBox="0 0 200 26" className="g7-cmp-arc" aria-hidden="true">
        {arcs ? (
          <g fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round">
            <path d="M40 4 C 40 20, 108 20, 108 6" />
            <path d="M40 4 C 40 24, 166 24, 166 6" />
            <path d="M104 10 l4 -5 l4 5" fill={tone} stroke="none" />
            <path d="M162 10 l4 -5 l4 5" fill={tone} stroke="none" />
          </g>
        ) : null}
      </svg>
      <p className="g7-cmp-note">{t(d.note)}</p>
      <div className="g7-cmp-res">{d.res}</div>
    </div>
  )
  return (
    <div className="g7-cmp-row">
      {card(left, T.graph, true)}
      {card(right, T.accent, false)}
    </div>
  )
}

// ============================================================
// AuditRows -- BIRINCHI xato qadamni topish. Javobdan keyin xato
// SON QO'YIB isbotlanadi, «bu yerda xato» degan matn bilan emas.
// ============================================================
// `prompt` -- TOPSHIRIQ. Qatorlar tugma ekani ham, ULARDAN QAYSI BIRI
// so'ralayotgani ham ekranda yozilmagan edi: sarlavha mavzuni ataydi,
// «birinchi xato qator» esa faqat ovozda aytilardi (metodist 2026-08-14).
// Yechilgach e'lon YO'QOLADI -- uning o'rniga isbot topshirig'i keladi
// (§6.1: yangi qadam avvalgisini almashtiradi, ustiga qo'shilmaydi).
export function AuditRows({ rows, answerId, hints, tags, proof, prompt, promptCap, onSolved, onStep, disabled, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [hitTags, setHitTags] = useState([])
  const solved = picked === answerId

  // SHRIFT QARORI BUTUN TUZOQQA, QATORGA EMAS (metodist qarori 2026-08-22).
  // Qoida javob variantlaridagi bilan bir xil: yo HAMMA qator yozuv
  // shriftida, yo hammasi proza shriftida. Aralashtirish taqiqlanadi --
  // ilgari tuzoqning hamma qatori, jumladan «juftlikning birinchi soni y»
  // kabi GAPLAR ham, matematik monoshriftda terilardi, va bitta sinfning
  // bitta prozasi ikki ekranda ikki xil ko'rinardi.
  // Qator matni Fx dan O'TKAZILMAYDI: Fx son va harfni boshqa shriftga
  // olib chiqadi, ya'ni blok ichiga IKKINCHI shrift kirardi -- aynan shu
  // rad etilgan.
  const mathRows = rows.length > 0 && rows.every((r) => looksMath(t(r.text)))

  const pick = (id) => {
    if (solved) return
    if (id === answerId) {
      setPicked(id)
      setHint(null)
      fx.right()
      if (onStep) onStep('proof')
      if (onSolved) onSolved({ correct: true, attempts: wrong.length + 1, tags: hitTags })
      return
    }
    setWrong((prev) => (prev.indexOf(id) === -1 ? prev.concat(id) : prev))
    const tag = tags ? tags[id] : null
    if (tag) setHitTags((prev) => (prev.indexOf(tag) === -1 ? prev.concat(tag) : prev))
    setHint(hints[id] || null)
    fx.wrong(hints[id])
  }

  return (
    <>
      {!solved ? <Ask kind="task" tight cap={promptCap ? t(promptCap) : undefined}>{prompt ? t(prompt) : null}</Ask> : null}
      <div className={'g7-panel g7-panel-paper g7-auditrows' + (mathRows ? ' is-math' : '')} style={{ display: 'flex', flexDirection: 'column', gap: solved ? 2 : 4 }}>
        {/* Qator topilgach ekranda FAQAT IKKI qator qoladi: boshlang'ich
            yozuv va topilgan qator. Qolganlari kerak emas -- isbot aynan
            shu ikkitasini solishtiradi, va ular ketgach isbot shakli
            uchun joy bo'shaydi (o'lchov 2026-08-14: beshta yirik qator
            bilan ekran 179px oshib ketardi). */}
        {(solved ? rows.filter((r, i) => i === 0 || r.id === answerId) : rows).map((row, i) => {
          const isWrongPick = wrong.indexOf(row.id) !== -1
          const isAnswer = solved && row.id === answerId
          return (
            <button
              type="button"
              key={row.id}
              className={'g7-opt' + (isAnswer ? ' g7-opt-ok' : '') + (isWrongPick ? ' g7-opt-tip' : '')}
              style={{
                // SHRIFT INLINE DA EMAS, USLUBDA. Ilgari bu yerda faqat
                // shrift OILASI ko'chirilardi, yozuvning qolgan sozlamalari
                // esa yo'q edi: vazn 500 (panelda 600), jadval raqamlari
                // yo'q, so'z oralig'i yo'q. Natijada bitta sinfning bitta
                // yozuvi ikki ekranda ikki xil ko'rinardi (metodist
                // 2026-08-22, ikki surat yonma-yon). Endi sozlama
                // `.g7-auditrows .g7-opt` da, va u yozuv paneli bilan bir xil.

                /* yechilgach qatorlar KOMPAKT: ikkinchi savolga joy bo'shaydi.
                   2026-08-13: 26 -> 23. Tuzoq ekranida qatorlar ustiga qarshi
                   misol yig'ilishi qo'shiladi va noutbukda 12px oshib ketardi.
                   Kichraytirish faqat YECHILGAN holatga tegadi. */
                // Metodist qarori 2026-08-14: javobdan keyin qatorlar
                // KICHRAYMAYDI va o'lcham hamma yerdagidek -- yagona
                // son o'lchami.
                minHeight: solved ? 26 : 34,
                padding: solved ? '2px 12px' : '2px 12px',
                fontSize: solved ? 'clamp(14px, 1.7vw, 18px)' : 'var(--g7-num)',
                transition: 'min-height .4s, padding .4s, font-size .4s',
              }}
              disabled={solved || isWrongPick || disabled}
              onClick={() => pick(row.id)}
            >
              <span className="g7-opt-badge">{i + 1}</span>
              {/* `t()` MAJBURIY: qatorda so'z bo'lsa (masalan «javob»),
                  u ruscha versiyada ham o'zbekcha bo'lib turardi. Oddiy
                  satr ham ishlaydi -- `t()` uni o'zgartirmaydi. */}
              <span className="g7-opt-text">{t(row.text)}</span>
            </button>
          )
        })}
      </div>
      {/* Qatorlar TUGMA ekani ko'rinib tursin: boshqa asboblarda bu belgi
          bor edi, bu yerda esa yo'q edi -- yozuvlar oddiy ro'yxatga
          o'xshardi. Javob berilgach belgi yo'qoladi. */}
      {/* Belgi panel bilan BIR CHIZIQDA: panel torayganda u chekkada
          osilib qolmasin. */}
      <CallToAct kind="tap" done={solved || disabled} />
      {solved && proof ? <DoneRow>{t(proof)}</DoneRow> : null}
      {!solved ? (
        <Slot mh={70}>
          <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback>
        </Slot>
      ) : null}
    </>
  )
}

// ============================================================
// SubstituteRows -- SONLI GUVOH, darsning asosiy asbobi.
// Harf tanlangan songa AYLANADI, keyin qatorlar birma-bir hisoblanadi.
// Xato yozuv «noto'g'ri» so'zi bilan emas, IKKI XIL SON bilan rad etiladi.
// ============================================================
// `letter` -- son qo'yiladigan harf. Sarlavhada «a = 4» deb ko'rsatiladi,
// shuning uchun harf QOTIB QOLMAYDI: 12-ekranda o'zgaruvchi m.
// `runs` -- QIYMATLAR JADVALI (2-dars, 3-ekran). Bittadan katta bo'lsa,
// har tugagan qo'yish qatorga muzlab qoladi va tanlash YANA ochiladi:
// o'quvchi son qo'yishni `runs` marta O'Z QO'LI bilan bajaradi, savol esa
// faqat shundan keyin ochiladi. Etalon §1.4 talab qiladi: qiymat kamida
// ikkita, amalda uchta son bilan ko'rsatiladi.
export function SubstituteRows({ rows, numbers, question, options, onSolved, onStep, compareNote, disabled, letter = 'a', audio, okText, askFirst = false, runs = 1 }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [n, setN] = useState(numbers.length === 1 ? numbers[0] : null)
  const [used, setUsed] = useState(numbers.length === 1 ? [numbers[0]] : [])
  const [kept, setKept] = useState([])
  const [shown, setShown] = useState(0)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [ok, setOk] = useState(false)
  const [round, setRound] = useState(0)
  const [tags, setTags] = useState([])

  // Jadval variantlar YIG'ILGANDAN keyin ko'rinadi (askFirst rejimi).
  const [rowsIn, setRowsIn] = useState(false)
  useEffect(() => {
    if (!askFirst) { setRowsIn(true); return undefined }
    if (!picked) return undefined
    const tmr = setTimeout(() => setRowsIn(true), 620)
    return () => clearTimeout(tmr)
  }, [askFirst, picked])

  // QIYMAT YO'Q: dars bo'sh satr qaytargan (nolga bo'lish) yoki hisob cheksiz
  // chiqqan. Bo'shliq o'rniga so'z turadi -- shunda «qiymat yo'q» ekani
  // KO'RINADI, «hisoblanmay qolgan» ko'rinmaydi.
  const noVal = (v) => v === '' || v === null || v === undefined || (typeof v === 'number' && !isFinite(v))

  const allShown = shown >= rows.length
  const sourceVal = useMemo(() => {
    const src = rows.find((r) => r.role === 'source')
    return src && n !== null ? src.val(n) : null
  }, [rows, n])

  const chooseNumber = (value) => {
    setN(value)
    setShown(0)
    setUsed((prev) => (prev.indexOf(value) === -1 ? prev.concat(value) : prev))
    if (onStep) onStep('sub')
  }

  const revealNext = () => {
    const next = shown + 1
    setShown(next)
    if (onStep) onStep('row' + next)
  }

  // Son tanlangach qatorlar O'ZI ochiladi, har biri pauza bilan. Ilgari har
  // qatorga alohida tugma bosish kerak edi -- uch ortiqcha bosish, va
  // hisoblash o'quvchi uchun «amal» emas, KUZATUV.
  useEffect(() => {
    // askFirst -- 7-ekran naqshi: AVVAL savol, javobdan KEYIN qatorlar.
    // Shunda son qo'yish javobni OSHKOR QILMAYDI, balki uni ISBOTLAYDI.
    if (askFirst && !rowsIn) return undefined
    if (n === null || shown >= rows.length || disabled) return undefined
    const tmr = setTimeout(revealNext, shown === 0 ? 420 : 620)
    return () => clearTimeout(tmr)
  }, [n, shown, disabled, rowsIn]) // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (opt) => {
    const src = options.find((o) => o.id === opt.id)
    if (src && src.correct) {
      setPicked(opt.id)
      setOk(true)
      setHint(okText || null)
      fx.right()
      if (audio && audio.say && okText) audio.say(t(okText))
      if (onSolved) onSolved({ picked: opt.id, correct: true, attempts: wrong.length + 1, tags })
      return
    }
    setWrong((prev) => (prev.indexOf(opt.id) === -1 ? prev.concat(opt.id) : prev))
    if (src && src.tag) setTags((prev) => (prev.indexOf(src.tag) === -1 ? prev.concat(src.tag) : prev))
    setOk(false)
    setHint(src && src.hint ? src.hint : null)
    fx.wrong(src && src.hint ? src.hint : null)
  }

  const anotherNumber = () => {
    const rest = numbers.filter((v) => v !== n)
    if (!rest.length) return
    setN(rest[round % rest.length])
    setRound((r) => r + 1)
    setShown(0)
  }

  // Tugagan qo'yish JADVALGA muzlab qoladi, so'ng tanlash yana ochiladi.
  // Kechikish shart: qator qiymati 420 ms davomida tug'iladi, darrov
  // muzlatilsa harakat ko'rinmay qoladi.
  const runsDone = runs <= 1 || kept.length >= runs
  useEffect(() => {
    if (runs <= 1 || askFirst) return undefined
    if (n === null || shown < rows.length) return undefined
    if (kept.some((k) => k.n === n)) return undefined
    const tmr = setTimeout(() => {
      setKept((prev) => (prev.some((k) => k.n === n) ? prev : prev.concat({ n, vals: rows.map((r) => r.val(n)) })))
      if (used.length < runs) { setN(null); setShown(0) }
    }, 520)
    return () => clearTimeout(tmr)
  }, [runs, askFirst, n, shown, rows, kept, used])

  return (
    <>
      {/* Jadval joyi BIRINCHI soniyadan band: ekran to'ladi, O'SMAYDI (§6.1).
          KARTOCHKA YO'Q: `g7-zone` oq kartochka chizadi, va bo'sh holatda
          ekranning tepasida katta BO'SH OQ to'rtburchak turardi -- u
          «sinib qolgan» degan taassurot berardi (surat 2026-08-15).
          Zahira joy ko'rinmasligi kerak, u shunchaki bo'lishi kerak. */}
      {runs > 1 ? (
        <div
          style={kept.length > 2
            ? { display: 'grid', gridTemplateColumns: 'repeat(2, auto)', justifyContent: 'center', columnGap: 22, rowGap: 2, minHeight: Math.ceil(runs / 2) * 30 }
            : { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minHeight: runs * 30 }}
        >
          {/* UCHTA VA UNDAN KO'P qator IKKI USTUNGA joylashadi. Bitta ustunda
              ular 139 px egallardi va savol bilan razbor bilan birga ekran
              budjetdan oshib ketardi (o'lchov 2026-08-17, walker tuzatilgach).
              DIQQAT: izoh `map` ning ICHIGA, JSX elementidan oldin
              qo'yilmaydi -- bu sintaksis xatosi va sahifa ochilmay qoladi.
              Bu loyihada shu xato allaqachon bir necha marta bo'lgan. */}
          {kept.map((k) => (
            <div
              key={k.n}
              className="g7-expr g7-expr-row"
              style={{ display: 'flex', gap: 10, alignItems: 'center', minHeight: 26 }}
            >
              <span className="g7-dim">{letter + ' = ' + k.n}</span>
              <span style={{ opacity: 0.5 }}>&rarr;</span>
              <span className="g7-num">{k.vals.join('   ')}</span>
            </div>
          ))}
        </div>
      ) : null}

      {/* askFirst rejimida son tanlash YO'Q: avval savol, isbot keyin. */}
      {!askFirst && numbers.length > 1 && n === null ? (
        <div className="g7-zone">
          <span className="g7-zone-cap">{t(UI_TXT.question)}</span>
          <p className="g7-qpill">{t(UI.whichNum)}</p>
          <CallToAct kind="pick" done={disabled} />
          <Options
            items={numbers.filter((v) => used.indexOf(v) === -1).map((v) => ({ id: String(v), label: letter + ' = ' + v }))}
            picked={null}
            wrong={[]}
            onPick={(o) => chooseNumber(Number(o.id))}
            disabled={disabled}
            cols={2}
            minH={40}
            collapse={false}
            badges={false}
          />
        </div>
      ) : null}

      {/* askFirst rejimida tekshirish jadvali JAVOBDAN KEYIN chiqadi: shunda
          u javobni oshkor qilmaydi VA joyni band qilmaydi (615px noutbukda
          to'rt variant bilan birga 46px oshib ketardi).
          KECHIKISH shart: variantlar yig'ilishi 0,5 s davom etadi, jadval
          esa darrov chiqsa, o'sha lahzada ekran 30px oshib ketadi. */}
      <div className="g7-zone" style={{ gap: 4, display: (askFirst && !rowsIn) || (runs > 1 && runsDone) ? 'none' : undefined }}>
        <span className="g7-zone-cap">{t(UI_TXT.zoneCheck)}</span>
        {/* USTUNLAR MAZMUNDAN, ULUSHDAN EMAS.
            Ilgari qator o'zi panjara edi: ustunlar ulush bilan (1fr) va eni
            620 px bilan qotirilgan. Uzun yozuv katakka sig'masdi va `nowrap`
            tufayli QO'SHNI kataklar ustiga chizilardi -- strelka bilan
            tenglik yozuv ostida yo'qolardi (QA 2026-08-22, 19-dars 7-slayd,
            558 px yozuv 250 px katakda).
            Endi panjara BITTA, hamma qatorlarga umumiy, va ustun eni eng
            uzun mazmundan chiqadi. Qatorlar `display: contents` bilan
            panjaraga tushadi -- shu tufayli strelkalar va tenglik belgilari
            qatorlar bo'ylab bir o'qda turadi, ilgari buni 620 px chegarasi
            ushlab turgandi. Sig'masa -- butun jadval birgalikda kichrayadi
            (`FitRow`), qator qatorga ko'chmaydi. */}
        {/* SHRIFT O'LCHAMI TASHQI TUGUNDA. `g7-expr-row` o'lchamni piksel
            bilan qotiradi, va u jadvalning O'ZIDA turganda sig'dirish
            koeffitsiyenti umuman ta'sir qilmasdi: koeffitsiyent hisoblanardi,
            eni esa o'zgarmasdi (31-dars 7-ekran, ingliz tili). Endi o'lcham
            sig'diruvchining USTIDA turadi, jadval esa uni MEROS qilib oladi. */}
        <FitRow min={0.7} className="g7-expr-row">
          <div
            className="g7-expr g7-subgrid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, max-content) max-content minmax(0, max-content) max-content max-content',
              alignItems: 'center',
              // O'LCHAMLAR `em` DA: sig'dirish shriftni kichraytiradi, va
              // piksel bilan berilgan bo'shliq bilan eng kam kenglik u bilan
              // birga kichraymay qolardi. O'shanda o'lchov yolg'on chiqardi
              // -- koeffitsiyent hisoblanardi, yozuv esa baribir chetidan
              // ellik piksel oshib turardi (31-dars, 7-ekran, ingliz tili).
              columnGap: '.13em',
              rowGap: '.07em',
              gridAutoRows: 'minmax(1.07em, auto)',
            }}
          >
            {rows.map((row, i) => {
              const isDone = i < shown
              const val = n !== null ? row.val(n) : null
              const matches = row.role === 'source' || (isDone && val === sourceVal)
              return (
                <div key={row.id} className="g7-sub-row" style={{ display: 'contents' }}>
                  <span>{row.expr}</span>
                  <span style={{ opacity: n === null ? 0.25 : 0.5 }}>→</span>
                  <span className={n === null ? 'g7-dim' : 'g7-in'}>{n === null ? '' : row.sub(n)}</span>
                  <span style={{ opacity: isDone ? 0.5 : 0.15 }}>=</span>
                  <span
                    className={(isDone ? (matches ? 'g7-num g7-pop' : 'g7-pop') : '') + (isDone && noVal(val) ? ' g7-sub-none' : '')}
                    style={{ minWidth: '1.47em', textAlign: 'right', opacity: isDone ? 1 : 0.15 }}
                    aria-label={isDone && noVal(val) ? t(UI.noValue) : undefined}
                  >
                    {isDone ? (noVal(val) ? '✗' : val) : '?'}
                  </span>
                </div>
              )
            })}
          </div>
        </FitRow>
      </div>

      {/* Slot FAQAT compareNote bor ekranda: bo'sh holda ham 40px egallardi,
          va aynan shu 40px 7-ekranni noutbukda 28px ga chiqarib yuborgandi
          (o'lchov 2026-08-15). Zahira slot kelajakdagi qator uchun bo'ladi,
          hech qachon to'lmaydigan joy uchun emas (§6.1). */}
      {compareNote ? (
        <Slot mh={40}>
          {allShown ? (
            <div className="g7-shakebox"><Expr size="mid" tone="#E8552B" pop>{compareNote}</Expr></div>
          ) : null}
        </Slot>
      ) : null}

      {(allShown && runsDone) || askFirst ? (
        <Slot mh={picked ? 46 : 84}>
          <div className="g7-in g7-zone" style={{ gap: 7 }}>
            <span className="g7-zone-cap">{t(UI_TXT.question)}</span>
            <p className="g7-qpill">{t(question)}</p>
            <CallToAct kind="pick" done={!!picked || disabled} />
            <Options
              items={options.map((o) => ({ id: o.id, label: t(o.label) }))}
              picked={picked}
              wrong={wrong}
              onPick={pick}
              disabled={disabled}
              cols={2}
            />
          </div>
        </Slot>
      ) : null}

      {hint || picked ? (
        <Slot mh={72}>
          <Feedback show={!!hint} ok={ok}>{hint ? t(hint) : null}</Feedback>
          {picked && numbers.length > 1 && runs <= 1 && !hint ? (
            <Btn tone="ghost" onClick={anotherNumber}>{t(UI.another)}</Btn>
          ) : null}
        </Slot>
      ) : null}
    </>
  )
}

// ============================================================
// Transform -- qadamba-qadam qayta yozish. Darsning ish oti.
// O'quvchi IFODANING QISMINI tanlaydi, keyin AMALNI tanlaydi.
// «Darrov javob» tugmasi YO'Q -- uni bosadigan joy yo'q.
// ============================================================
// `ask` va `askAct` -- TOPSHIRIQ MATNI. Standart matn 1 va 5-darslardan
// keladi va «nimani birinchi hisoblaymiz» deb so'raydi -- amallar tartibi
// darsining savoli. 4-darsda esa savol boshqa: qaysi XOSSANI qo'llaymiz.
// Shu sababli matn almashtiriladigan bo'ldi (2026-08-21).
export function Transform({ start, steps, parts, actions, onSolved, onStep, footNote, disabled, audio, ask, askAct }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [lines, setLines] = useState([start])
  const [part, setPart] = useState(null)
  // Qo'shilayotgan JUFT: to'g'ri amaldan keyin 420 ms davomida shu juft
  // bir-biriga siljiydi, so'ng yangi qator keladi.
  const [merging, setMerging] = useState(null)
  const [hint, setHint] = useState(null)
  const [shake, setShake] = useState(0)
  const [tags, setTags] = useState([])
  const [misses, setMisses] = useState(0)

  const stepIdx = lines.length - 1
  const step = steps[stepIdx]
  const finished = stepIdx >= steps.length
  const currentParts = step ? step.parts || parts || [] : []

  const fail = (h, tag) => {
    setHint(h || null)
    setShake((s) => s + 1)
    setMisses((m) => m + 1)
    if (tag) setTags((prev) => (prev.indexOf(tag) === -1 ? prev.concat(tag) : prev))
    fx.wrong(h)
  }

  const act = (actionId) => {
    if (!step) return
    if (step.part && part !== step.part) {
      const w = (step.wrongs || []).find((x) => x.action === actionId && (!x.part || x.part === part))
      fail(w ? w.hint : step.needPart, w ? w.tag : null)
      return
    }
    if (actionId === step.action) {
      fx.right()
      // JUFT AVVAL QO'SHILADI, keyin yangi qator keladi. Bu darsning bitta
      // qo'l yozuvi: kadrlarda va yo'laklarda ikkita son bir-biriga siljib
      // BITTA songa aylanadi, bu yerda esa shu paytgacha qator shunchaki
      // paydo bo'lardi. Endi hamma joyda bir xil: hisoblash KO'RINADI.
      setMerging(part)
      setTimeout(() => {
        setMerging(null)
        const next = lines.concat(step.to)
        setLines(next)
        setPart(null)
        setHint(null)
        if (onStep) onStep('step' + next.length)
        if (next.length - 1 >= steps.length && onSolved) {
          onSolved({ correct: true, lines: next, attempts: misses + 1, tags })
        }
      }, 420) // §7.1: yozuv ICHIDAGI harakatning belgilangan vaqti
      return
    }
    const w = (step.wrongs || []).find((x) => x.action === actionId)
    fail(w ? w.hint : null, w ? w.tag : null)
  }

  return (
    <>
      {/* Topshiriq e'loni umumiy `Ask` bilan -- darsdagi qolgan ekranlar
          kabi. Ilgari bu yerda o'z razmetkasi turardi: yorliqsiz va
          kartochkali, ya'ni boshqa ekranlardan farq qilardi va balandroq edi. */}
      {!finished ? <Ask kind="task" tight>{t(part ? (askAct || UI.askAct) : (ask || UI.askPart))}</Ask> : null}
      {/* Ramka YIRIKROQ: qatorlar markazda va ular uchun joy oldindan band. */}
      {/* Balandlik OLDINDAN band: o'tgan qatorlar ixcham (27px), joriy qator
          yirik (46px), pastda esa bo'sh qator uchun joy. Panel to'ladi,
          O'SMAYDI (§6.1). */}
      <Slot mh={steps.length * 36 + 64} style={{ alignItems: 'stretch', justifyContent: 'flex-start' }}>
      <div className="g7-panel g7-panel-paper" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Qatorlar SODDA: yozuv va boshqa hech narsa. 2026-08-13 da bu yerga
            o'qituvchi gapi qo'shib ko'rildi va qator flex-konteynerga o'raldi --
            natijada noutbukda 133px oshib ketdi. Gap 4-ekranda, alohida
            `SolutionSteps` blokida qoladi: u yerda o'lchov toza. */}
        {lines.map((line, i) => {
          const live = !finished && i === lines.length - 1
          if (!live) {
            // O'TGAN QATORLAR IXCHAM. Ilgari hamma qator bir xil yirik edi va
            // panel har qadamda o'sardi: 170 -> 214 -> 258px, noutbukda 65px
            // oshib ketardi (o'lchov 2026-08-14 -- obhod buni ko'rmagan,
            // chunki u asbobni oxirigacha to'g'ri o'tmaydi).
            // Ixchamlashtirish METODIK jihatdan ham to'g'ri: ish JORIY
            // qatorda ketadi, o'tganlari esa daftardagidek yuqorida turadi.
            return (
              <div key={i} className={'g7-expr g7-expr-row g7-tf-past' + (i === lines.length - 1 && i > 0 ? ' g7-pop' : '')}>
                <Fx>{line}</Fx>
              </div>
            )
          }
          // FAOL QATOR: o'quvchi CHIPSNI emas, YOZUVNING O'ZINI bosadi.
          // Amal belgisini bosish uning IKKI YONIDAGI sonni ham oladi -- ya'ni
          // «juftni tanlash» bitta harakat. Ilgari bu ikkita alohida savol edi
          // (mayda chipslar va uchta tugma), va o'quvchi nimaga javob
          // berayotganini tushunmasdi (metodist surati 2026-08-13).
          const toks = String(line).split(' ')
          // Qavs songa YOPISHIB keladi: «(12», «2)». Juftni solishtirishda u
          // olib tashlanadi, aks holda «12 − 4» hech qachon mos kelmaydi va
          // qavsli ekran (10-ekran) QOTIB qoladi -- metodist 2026-08-13 da
          // aynan shuni topdi.
          const bare = (x) => String(x === undefined ? '' : x).replace(/[()]/g, '')
          const trioAt = (k) => [bare(toks[k - 1]), toks[k], bare(toks[k + 1])].join(' ')
          return (
            <div key={i} className="g7-expr g7-expr-row g7-tf-live" style={{ minHeight: 31 }}>
              {toks.map((tok, k) => {
                const isOp = ['+', '−', '·', ':'].indexOf(tok) !== -1
                const trio = isOp ? trioAt(k) : null
                const can = isOp && currentParts.indexOf(trio) !== -1
                const inPart = part && trio && part === trio
                const lit = part && (part === trio || (!isOp && ((toks[k + 1] && part === trioAt(k + 1)) || (toks[k - 1] && part === trioAt(k - 1)))))
                // Qo'shilish: chap son o'ngga, o'ng son chapga siljiydi,
                // belgi esa ular bilan birga so'nadi.
                const mL = merging && toks[k + 1] && merging === trioAt(k + 1)
                const mR = merging && toks[k - 1] && merging === trioAt(k - 1)
                const mOp = merging && trio && merging === trio
                const mCls = mL ? ' is-mergeL' : mR ? ' is-mergeR' : mOp ? ' is-mergeOp' : ''
                return can ? (
                  <button
                    key={k}
                    type="button"
                    className={'g7-tf-op' + (inPart ? ' is-picked' : '') + (!part && !disabled ? ' is-hint' : '') + mCls}
                    disabled={disabled || !!merging}
                    onClick={() => { fx.tap(); setPart(trio); setHint(null) }}
                  >
                    {tok}
                  </button>
                ) : (
                  <span key={k} className={'g7-tf-tok' + stageOf(tok) + (lit ? ' is-lit' : '') + mCls}>{tok}</span>
                )
              })}
            </div>
          )
        })}
      </div>
      </Slot>


      <Slot mh={72}>
        {!finished && part ? (
          <div className="g7-shakebox" style={{ width: '100%' }}>
            <div key={shake} className={shake ? 'g7-shake' : undefined}>
              <Options
                items={actions.map((a) => ({ id: a.id, label: t(a.label) }))}
                picked={null}
                wrong={[]}
                onPick={(o) => act(o.id)}
                disabled={disabled}
                cols={3}
                minH={40}
                collapse={false}
                badges={false}
              />
            </div>
          </div>
        ) : finished && footNote ? (
          /* FAQAT yakunda. Ilgari bu satr birinchi soniyadan turardi va
             o'quvchi hali hech nima hisoblamasdan «Qiymat topildi» degan
             yozuvni o'qirdi (metodist surati 2026-08-14). */
          /* `t()` MAJBURIY: `footNote` uch tilli obyekt, va u to'g'ridan
             to'g'ri berilsa React yiqiladi (xato 31). Bu nuqson ANCHADAN
             beri turgan, lekin tekshiruv walkeri Transform ni YAKUNIGA
             yetkazmagani uchun ko'rinmagan (topildi 2026-08-17). */
          /* PROZA: `.g7-expr` da nowrap turadi, shuning uchun uzun gap
             chetga chiqib ketadi va skroll yo'q ekan, KESILGANI bilinmaydi.
             4-darsda telefonda 271px (ru) va 353px (en) oshib ketgan edi
             (o'lchov 2026-08-21). Sinfning naqshi shu: proza -- `plain` va
             `g7-wrap` bilan (Probe dagi savol kabi). */
          <Expr size="sm" plain className="g7-wrap">{t(footNote)}</Expr>
        ) : null}
      </Slot>

      {/* Yakunda razborga o'rin kerak emas: xato endi bo'lishi mumkin emas.
          Bo'sh slot 58 px olib turardi -- aynan yechilgan holatda. */}
      <Slot mh={finished ? 0 : 58}>
        <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================================
// DINAMIK NAMOYISHCHILAR -- savol va qoidani HARAKAT bilan ko'rsatadi.
// Bular ham ASBOB: bir marta yoziladi, hamma darsda ishlatiladi. Har biri
// balandligi QAT'IY (budjet 400px), shuning uchun slaydni yormaydi.
//
//   DistributeDemo -- ko'paytuvchi har bir qo'shiluvchiga yoy bo'ylab boradi
//   SignFlipDemo   -- qavs oldidagi minus ishoralarni birma-bir ag'daradi
//   MergeDemo      -- o'xshash qo'shiluvchilar bittaga qo'shilib ketadi
//   FlipTwiceDemo  -- ikki minus ishorani ikki marta ag'daradi
// ============================================================================

// Ko'paytuvchi qavs ichidagi HAR BIR qo'shiluvchiga boradi.
export function DistributeDemo({ factor = '3', t1 = 'a', t2 = '5', op = '+', run = 0, h = 58 }) {
  return (
    <svg viewBox="0 0 320 62" style={{ width: '100%', height: h, display: 'block' }} aria-hidden="true">
      <g fontFamily={MATH_FONT} fontSize="21" fontWeight="700" fill="#14161A">
        <text x="26" y="26" textAnchor="middle">{factor}</text>
        <text x="48" y="26" textAnchor="middle">(</text>
        <text x="70" y="26" textAnchor="middle">{t1}</text>
        <text x="94" y="26" textAnchor="middle">{op}</text>
        <text x="118" y="26" textAnchor="middle">{t2}</text>
        <text x="140" y="26" textAnchor="middle">)</text>
      </g>
      <g fill="none" stroke="#E8552B" strokeWidth="2" strokeLinecap="round">
        <path key={'p1-' + run} d="M26 34 C 26 52, 70 52, 70 36" className="g7-arc" style={{ animationDelay: '.05s' }} />
        <path key={'p2-' + run} d="M26 34 C 40 58, 118 58, 118 36" className="g7-arc" style={{ animationDelay: '.45s' }} />
      </g>
      <g fill="#E8552B" stroke="none">
        <polygon key={'a1-' + run} points="70,33 66,41 74,41" className="g7-arc-tip" style={{ animationDelay: '.35s' }} />
        <polygon key={'a2-' + run} points="118,33 114,41 122,41" className="g7-arc-tip" style={{ animationDelay: '.75s' }} />
      </g>
    </svg>
  )
}

// Qavs oldidagi minus HAR BIR qo'shiluvchining ishorasini ag'daradi.
export function SignFlipDemo({ before = '−( a − 7 )', pairs = [['a', '−a'], ['− 7', '+ 7']], run = 0, h = 56 }) {
  return (
    <div key={run} style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', height: h, justifyContent: 'center' }}>
      <div className="g7-expr g7-expr-row" style={{ opacity: 0.5 }}>{before}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {pairs.map((pair, i) => (
          <span key={i} className="g7-flip" style={{ animationDelay: 0.25 + i * 0.45 + 's' }}>
            <span className="g7-flip-old">{pair[0]}</span>
            <span className="g7-flip-new">{pair[1]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// O'xshash qo'shiluvchilar bittaga qo'shiladi: chiplar yaqinlashib qo'shiladi.
export function MergeDemo({ left = '4x', right = '3x', result = 'x', op = '−', run = 0, h = 46 }) {
  return (
    <div key={run} style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', height: h }}>
      <span className="g7-chip g7-merge-l">{left}</span>
      <span className="g7-chip-op">{op}</span>
      <span className="g7-chip g7-merge-r">{right}</span>
      <span className="g7-chip-op">=</span>
      <span className="g7-chip g7-chip-ok g7-merge-res">{result}</span>
    </div>
  )
}

// Ikki minus: ishora ikki marta ag'dariladi va boshiga qaytadi.
export function FlipTwiceDemo({ value = '4', run = 0, h = 46 }) {
  return (
    <div key={run} style={{ display: 'flex', gap: 7, alignItems: 'center', justifyContent: 'center', height: h }}>
      <span className="g7-chip g7-flip1">−</span>
      <span className="g7-chip g7-flip2">−</span>
      <span className="g7-chip">{value}</span>
      <span className="g7-chip-op">=</span>
      <span className="g7-chip g7-chip-ok g7-merge-res">+{value}</span>
    </div>
  )
}

// ============================================================================
// SAHNA va MINI-ROLIK.
//
// `CrateScene` -- qavsning FIZIK modeli: uchta bir xil yashik, har birida
// bitta muhrlangan `a` bloki va beshta batareya. Ya'ni 3(a + 5) ni ko'z bilan
// ko'rish mumkin. Holatlar: closed -> open -> regroup -> result.
// Qayta guruhlash aynan taqsimot qonuni: hamma `a` chapga, hamma batareya
// o'ngga. Personaj YO'Q -- faqat buyumlar.
//
// `ExplainClip` -- «mini-rolik»: qadamlar o'z-o'zidan ketma-ket o'ynaydi,
// pastda izoh almashadi, nuqtalarni bosib qadamga qaytish mumkin.
// 3-sinf naqshi: sahna balandligi DERAZAGA moslashadi (clamp + 100dvh),
// shuning uchun past ekranda ham skroll paydo bo'lmaydi.
// ============================================================================

// ============================================================================
// PlotScene -- QAVSNING YUZA MODELI (area model).
//
// Nega aynan yuza. Jahon metodikasida qavsni ochish AYNAN shu model bilan
// kiritiladi: o'quvchi to'g'ri to'rtburchak yuzini ikki xil hisoblashni
// allaqachon biladi, demak 3(a + 5) va 3a + 15 tengligi YANGI QOIDA emas,
// eski bilimning harflar bilan yozilishi. Yashiklar modeli buni ko'rsatmasdi:
// yashikni QAYTA SANASH kerak edi, sanash esa tenglikni isbotlamaydi.
// Darslik dunyosi ham shu: 19-betda maydon a ga b, yer olingach yuza oshadi.
//
// Sahna: kengligi 3 m issiqxona. Uzunligi `a` edi, yana 5 m qo'shildi.
// Fazalar:
//   old     -- faqat eski qism, tepasida `a`
//   grown   -- o'ng tomonga 5 m lik yangi qism O'SADI
//   whole   -- chok so'nadi, butun figura bitta bo'ladi -> 3(a + 5)
//   cut     -- chok punktir bo'ladi va ikki qism ajraladi
//   counted -- yangi qismda 15 ta birlik kvadrat birma-bir yonadi -> 3a va 15
//
// `plain` -- bezaksiz rejim: o'simlik nuqtalari olib tashlanadi va sahna
// SOF TO'G'RI TO'RTBURCHAK bo'lib qoladi (metodist 2026-08-10: «если не
// понравится, можем сделать как прямоугольник»). Bitta bayroq, qayta yozish emas.
// ============================================================================

const PLOT = {
  x0: 64,          // figuraning chap cheti
  yTop: 32,        // yuqori cheti
  row: 38,         // 1 metr = 38 px balandlik
  rows: 3,         // kengligi 3 metr
  oldW: 300,       // `a` -- uzunligi NOMA'LUM, shuning uchun kataksiz
  unit: 40,        // 1 metr = 40 px uzunlik
}

// `plain` YOQILGAN (metodist 2026-08-10: «лучше сделай прямоугольником»):
// o'simlik nuqtalari YO'Q, sof to'g'ri to'rtburchak. Bezakni qaytarish uchun
// `plain={false}` yetarli -- kod o'chirilmagan.
export function PlotScene({ phase = 'old', label = 'a', per = 5, plain = true }) {
  const grown = phase !== 'old'
  const whole = phase === 'whole'
  const cut = phase === 'cut' || phase === 'counted'
  const counted = phase === 'counted'

  const { x0, yTop, row, rows, oldW, unit } = PLOT
  const h = row * rows
  const newW = per * unit
  const seamX = x0 + oldW
  const shift = cut ? 7 : 0

  const oldFill = whole ? T.accentSoft : T.graphSoft
  const oldLine = whole ? T.accent : T.graph

  return (
    <svg viewBox="0 0 620 170" className="g7-scene-svg" aria-hidden="true">
      {/* Butun chizma bitta guruhda: o'smaguncha u MARKAZDA turadi, aks holda
          figura kartochkaning chap yarmida qolib, o'ng yarmi bo'sh oq dog'
          bo'lardi (2026-08-10 suratlar, 5-slayd). O'sish paytida guruh
          chapga suriladi -- «joy ochildi» degan harakat. */}
      <g className="g7-plot-shift" style={{ transform: 'translateX(' + (grown ? 0 : newW / 2) + 'px)' }}>
      {/* Kenglik o'lchovi: 3 m. Chapda, figuradan tashqarida. */}
      <g stroke={T.ink3} strokeWidth="1.4">
        <line x1="40" y1={yTop} x2="40" y2={yTop + h} />
        <line x1="34" y1={yTop} x2="46" y2={yTop} />
        <line x1="34" y1={yTop + h} x2="46" y2={yTop + h} />
      </g>
      <text x="22" y={yTop + h / 2 + 6} textAnchor="middle" fontFamily="'Manrope', sans-serif" fontSize="16" fontWeight="700" fill={T.ink2}>3</text>

      {/* ESKI QISM: uzunligi a. Kataklar YO'Q -- a noma'lum. */}
      <g className="g7-plot-part" style={{ transform: 'translateX(' + -shift + 'px)' }}>
        <rect x={x0} y={yTop} width={oldW} height={h} rx="6" fill={oldFill} stroke={oldLine} strokeWidth="2.4" style={{ transition: 'fill .5s ease, stroke .5s ease' }} />
        {[1, 2].map((r) => (
          <line key={r} x1={x0} y1={yTop + r * row} x2={x0 + oldW} y2={yTop + r * row} stroke={oldLine} strokeWidth="1" opacity="0.32" />
        ))}
        {!plain
          ? [0, 1, 2].map((r) =>
              [0, 1, 2, 3, 4].map((c) => (
                <circle key={r + '-' + c} cx={x0 + 34 + c * 58} cy={yTop + row * r + row / 2} r="4" fill={T.graph} opacity="0.24" />
              )),
            )
          : null}
        <text x={x0 + oldW / 2} y={yTop - 12} textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fontWeight="700" fill={T.ink}>{label}</text>
        <g className="g7-plot-num" style={{ opacity: counted ? 1 : 0 }}>
          {/* Son kataklar va nuqtalar ustida turadi -- ostiga yorug' pod
              qo'yilmasa, o'qilmaydi. */}
          <rect x={x0 + oldW / 2 - 40} y={yTop + h / 2 - 21} width="80" height="42" rx="10" fill={T.paperSolid} opacity="0.88" />
          <text x={x0 + oldW / 2} y={yTop + h / 2 + 11} textAnchor="middle" fontFamily={MATH_FONT} fontSize="30" fontWeight="700" fill={T.graph}>
            {rows}<tspan fontStyle="italic">{label}</tspan>
          </text>
        </g>
      </g>

      {/* YANGI QISM: 5 metr. Kengligi 0 dan o'sadi -- «polosani prirezali». */}
      <g className="g7-plot-part" style={{ transform: 'translateX(' + shift + 'px)', opacity: grown ? 1 : 0, transition: 'transform .5s cubic-bezier(.3,0,.2,1), opacity .3s ease' }}>
        <rect className="g7-plot-grow" x={seamX} y={yTop} width={grown ? newW : 0} height={h} rx="6" fill={T.accentSoft} stroke={T.accent} strokeWidth="2.4" />
        {/* Qatorlar YANGI qismda ham davom etadi: kenglik ikkalasida bir xil,
            uch metr. Aks holda ikki figura ko'rinadi, bitta emas. */}
        {grown
          ? [1, 2].map((r) => (
              <line key={'nr' + r} x1={seamX} y1={yTop + r * row} x2={seamX + newW} y2={yTop + r * row} stroke={T.accent} strokeWidth="1" opacity={counted ? 0 : 0.3} style={{ transition: 'opacity .3s ease' }} />
            ))
          : null}
        {!plain && grown
          ? [0, 1, 2].map((r) =>
              [0, 1, 2, 3, 4].map((c) => (
                <circle key={'nd' + r + '-' + c} cx={seamX + 20 + c * unit} cy={yTop + row * r + row / 2} r="4" fill={T.graph} opacity={counted ? 0 : 0.24} style={{ transition: 'opacity .3s ease' }} />
              )),
            )
          : null}
        {/* Birlik kvadratlar: 3 qator x 5 ustun. Sanash SHU YERDA ishlaydi --
            yangi qismning har tomoni MA'LUM, shuning uchun 15 ni a ni
            bilmasdan ayta olamiz. Darsning butun ma'nosi shu. */}
        {[0, 1, 2].map((r) =>
          Array.from({ length: per }).map((_, c) => (
            <rect
              key={r + '-' + c}
              className="g7-plot-cell"
              x={seamX + c * unit + 3}
              y={yTop + r * row + 3}
              width={unit - 6}
              height={row - 6}
              rx="3"
              fill={T.accent}
              style={{ opacity: counted ? 0.26 : 0, transitionDelay: (r * per + c) * 0.055 + 's' }}
            />
          )),
        )}
        <text x={seamX + newW / 2} y={yTop - 12} textAnchor="middle" fontFamily={MATH_FONT} fontSize="18" fontWeight="700" fill={T.ink} style={{ opacity: grown ? 1 : 0, transition: 'opacity .4s ease .2s' }}>{per}</text>
        <g className="g7-plot-num" style={{ opacity: counted ? 1 : 0 }}>
          <rect x={seamX + newW / 2 - 40} y={yTop + h / 2 - 21} width="80" height="42" rx="10" fill={T.paperSolid} opacity="0.88" />
          <text x={seamX + newW / 2} y={yTop + h / 2 + 11} textAnchor="middle" fontFamily={MATH_FONT} fontSize="30" fontWeight="700" fill={T.accent}>{rows * per}</text>
        </g>
      </g>

      {/* CHOKNI YOPADIGAN YAMOQ. Ikki to'rtburchakning O'Z chegarasi va O'Z
          yumaloq burchagi bor, shuning uchun chiziqni «o'chirish» YETMAYDI:
          ustidan bir xil rangli yamoq qo'yiladi, keyin yuqori va pastki
          chegara chok ustidan QAYTA chiziladi. Shundagina figura bitta. */}
      <g style={{ opacity: whole ? 1 : 0, transition: 'opacity .45s ease' }}>
        <rect x={seamX - 7} y={yTop - 2} width="14" height={h + 4} fill={T.accentSoft} />
        <line x1={seamX - 8} y1={yTop} x2={seamX + 8} y2={yTop} stroke={T.accent} strokeWidth="2.4" />
        <line x1={seamX - 8} y1={yTop + h} x2={seamX + 8} y2={yTop + h} stroke={T.accent} strokeWidth="2.4" />
        {[1, 2].map((r) => (
          <line key={'sr' + r} x1={seamX - 8} y1={yTop + r * row} x2={seamX + 8} y2={yTop + r * row} stroke={T.accent} strokeWidth="1" opacity="0.3" />
        ))}
      </g>

      {/* CHOK. Butun bo'lganda so'nadi, kesilganda punktir bo'lib qaytadi. */}
      <line
        className="g7-plot-seam"
        x1={seamX} y1={yTop - 4} x2={seamX} y2={yTop + h + 4}
        stroke={cut ? T.ink : T.accent}
        strokeWidth={cut ? 2 : 2.4}
        strokeDasharray={cut ? '7 6' : 'none'}
        style={{ opacity: !grown ? 0 : whole ? 0 : 1 }}
      />
      </g>
    </svg>
  )
}

// Mini-rolik: qadamlar o'zi ketma-ket o'ynaydi, nuqtalar bilan qaytish mumkin.
export function ExplainClip({ steps, render, autoMs = 1900, onDone }) {
  const t = useT()
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return undefined
    if (i >= steps.length - 1) {
      setPlaying(false)
      if (onDone) onDone()
      return undefined
    }
    const timer = setTimeout(() => setI((n) => n + 1), autoMs)
    return () => clearTimeout(timer)
  }, [i, playing, steps.length, autoMs, onDone])

  const goto = (n) => { setPlaying(false); setI(n) }
  const replay = () => { setI(0); setPlaying(true) }

  return (
    <>
      <div className="g7-scene g7-scene-clip">{render(steps[i].state)}</div>
      <Slot mh={30}>
        <p className="g7-clip-cap" key={i}>{t(steps[i].caption)}</p>
      </Slot>
      <div className="g7-clip-bar">
        {steps.map((s, n) => (
          <button
            key={n}
            type="button"
            className={'g7-clip-dot' + (n === i ? ' g7-clip-dot-on' : '') + (n < i ? ' g7-clip-dot-past' : '')}
            onClick={() => goto(n)}
            aria-label={String(n + 1)}
          />
        ))}
        <button type="button" className="g7-clip-replay" onClick={replay} aria-label="replay">↺</button>
      </div>
    </>
  )
}

// ============================================================================
// UCHTA YANGI ASBOB (2026-08-13, metodist qarori). 1-4-sinf darslaridan
// ko'chirilgan usullar, 7-sinf kontraktiga moslangan.
//
//   StepOrder   -- o'quvchi amallar tartibini YOZUVNING O'ZIDA belgilaydi,
//                  asbob esa UNING tartibi bo'yicha hisoblaydi va natijani
//                  qoida bo'yicha natija bilan yonma-yon qo'yadi.
//                  (4-sinf DividerPlacement usuli: qo'l yozuvning ichida)
//   BracketGap  -- o'quvchi qavsni yozuv ichidagi tirqishga qo'yadi.
//                  (o'sha 4-sinf usuli, ajratgich o'rniga qavs)
//   RuleBuilder -- qoidani o'quvchi bo'laklardan YIG'ADI, tayyor kartochkani
//                  o'qimaydi. (4-sinf RuleBuilderScreen)
//
// Uchalasi ham 5.1 qoidalariga bo'ysunadi: «javobni ko'rsatish» tugmasi YO'Q,
// asbob faqat o'quvchi qadam qo'ygandan KEYIN ishga tushadi, oxirgi qatorni
// asbob yozmaydi.
//
// ARIFMETIKA SHU YERDA. Asbob javobni jadvaldan qidirmaydi, HISOBLAYDI --
// shuning uchun uni istalgan darsga istalgan son bilan berish mumkin.
// ============================================================================

const STAGE2 = ['·', ':']
// Belgi qaysi bosqichda ekanini QAYTARADI. Rang shu yerdan keladi, ya'ni
// bitta joydan: yozuv, yo'lak va kino bir xil bo'yaladi.
// KO'RSATUVCHI QURILMA. Metodist qarori 2026-08-13: «sichqoncha tortadi,
// barmoq bosadi». Sabab -- telefonda tortish sahifa SKROLLI bilan raqobat
// qiladi va brauzer ko'pincha jestni o'zi olib qo'yadi: o'quvchi qavsni emas,
// ekranni tortadi. Shuning uchun tortish FAQAT aniq ko'rsatuvchi qurilmada
// (sichqoncha) yoqiladi, barmoqda esa avvalgidek bosish qoladi.
export const canDrag = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const stageOf = (tok) => (STAGE2.indexOf(tok) !== -1 ? ' is-s2' : (tok === '+' || tok === '−' ? ' is-s1' : ''))

const applyOp = (a, op, b) => {
  if (op === '+') return a + b
  if (op === '−') return a - b
  if (op === '·') return a * b
  if (op === ':') return b === 0 ? NaN : a / b
  return NaN
}

// Qoida bo'yicha: avval II bosqich chapdan o'ngga, so'ng I bosqich chapdan o'ngga.
export const evalByRule = (nums, ops) => {
  const n = nums.slice()
  const o = ops.slice()
  for (let i = 0; i < o.length;) {
    if (STAGE2.indexOf(o[i]) !== -1) {
      n.splice(i, 2, applyOp(n[i], o[i], n[i + 1]))
      o.splice(i, 1)
    } else i++
  }
  while (o.length) {
    n.splice(0, 2, applyOp(n[0], o[0], n[1]))
    o.splice(0, 1)
  }
  return n[0]
}

// O'quvchi bergan tartib bo'yicha: `order` -- amal indekslari bosilgan navbatda.
export const evalByOrder = (nums, ops, order) => {
  const n = nums.slice()
  const live = ops.map((op, i) => ({ op, i }))
  order.forEach((opIdx) => {
    const pos = live.findIndex((x) => x.i === opIdx)
    if (pos === -1) return
    n.splice(pos, 2, applyOp(n[pos], live[pos].op, n[pos + 1]))
    live.splice(pos, 1)
  })
  return n[0]
}

// Qavs `from..to` (nums indekslari, ikki chekkasi ham kiradi) ichini oladi.
export const evalWithBracket = (nums, ops, from, to) => {
  const inner = evalByRule(nums.slice(from, to + 1), ops.slice(from, to))
  const n = nums.slice(0, from).concat([inner], nums.slice(to + 1))
  const o = ops.slice(0, from).concat(ops.slice(to))
  return evalByRule(n, o)
}

// Butun son butun bo'lib qoladi; kasr uch xonagacha, RU va UZ da VERGUL bilan
// (darslik ham vergul yozadi, 12-bet), EN da nuqta bilan.
export const fmtNum = (v, lang) => {
  if (v === null || v === undefined || !isFinite(v)) return '—'
  const r = Math.round(v * 1000) / 1000
  const s = String(r)
  return lang === 'en' ? s : s.replace('.', ',')
}

const exprText = (nums, ops, labels) =>
  nums.map((x, i) => {
    const s = labels && labels[i] !== undefined ? labels[i] : String(x)
    return i ? ' ' + ops[i - 1] + ' ' + s : s
  }).join('')

// ============================================================
// StepOrder -- amallar tartibini o'quvchi belgilaydi.
// Amal belgisini bosish unga NAVBAT RAQAMINI beradi. Hamma raqam qo'yilgach
// asbob ikkita sonni yonma-yon qo'yadi: o'quvchi tartibi va qoida tartibi.
// Bu 1-dars uchun SON GUVOHINING o'rnini bosadi: darsda harf yo'q, shuning
// uchun son qo'yish emas, IKKI TARTIB bilan qayta hisoblash ishlatiladi
// (PODXOD_7SINF.md §9).
// ============================================================
// `prompt` -- TOPSHIRIQ. Bu asbobda «to'g'ri javob» yo'q, shuning uchun
// o'quvchi undan nima kutilayotganini o'zi taxmin qila olmaydi: belgilarni
// bosish kerakligini ham, ularni QAYSI MA'NODA bosishini ham (hisoblash
// navbati) faqat ovoz aytardi. Ovoz o'chiq bo'lsa ekran jim edi.
export function StepOrder({
  nums, ops, ruleOrder, yoursLabel, ruleLabel, note, sameNote, tag, prompt,
  onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const lang = useLang()
  const fx = useAnswerFx(audio)
  const [order, setOrder] = useState([])
  const [fired, setFired] = useState(false)
  // Sichqoncha amal ustida bo'lsa, uning IKKI SONI yoritiladi: amal nimani
  // biriktirishini ko'rsatadi, lekin QAYSI BIRI birinchi ekanini AYTMAYDI.
  // Telefonda hover yo'q -- u yerda bosish o'zi shu ishni bajaradi.
  const [hoverOp, setHoverOp] = useState(null)

  const done = order.length === ops.length
  // Sonlarni endi YO'LAKLAR o'zi hisoblaydi va ko'rsatadi (CollapseTrack),
  // shuning uchun bu yerda ular saqlanmaydi. Faqat TARTIBLAR solishtiriladi.
  const same = done && order.join(',') === (ruleOrder || []).join(',')

  useEffect(() => {
    if (!done || fired) return
    setFired(true)
    fx.right()
    if (onStep) onStep('done')
    // Bu ekranda «xato javob» yo'q: har ikkala tartib ham ko'rsatiladi.
    // Teg esa o'quvchi qoidadan boshqa tartib qo'ygan bo'lsa yoziladi --
    // aynan o'sha yanglish tushuncha ishga tushgan bo'ladi (§8.5).
    if (onSolved) onSolved({ correct: true, attempts: 1, tags: !same && tag ? [tag] : [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, fired])

  const tapOp = (i) => {
    if (disabled || done) return
    if (order.indexOf(i) !== -1) return
    fx.tap()
    setOrder((prev) => prev.concat(i))
  }

  const reset = () => {
    if (disabled) return
    setOrder([])
    setFired(false)
  }

  return (
    <>
      {/* Topshiriq YECHILGANDAN KEYIN HAM qoladi (§5.3: ekranga qaytgan
          o'quvchi savolni va o'z javobini ko'radi). Tor shakl: bu ekranda
          ikkita yo'lak va izoh uchun joy oldindan band qilingan. */}
      <Ask kind="task" tight>{prompt ? t(prompt) : null}</Ask>
      <div className="g7-panel g7-panel-paper g7-steporder">
        <div className="g7-so-row">
          {nums.map((x, i) => (
            <React.Fragment key={'n' + i}>
              {i ? (
                <button
                  type="button"
                  className={'g7-so-op' + stageOf(ops[i - 1]) + (order.indexOf(i - 1) !== -1 ? ' is-set' : '')}
                  disabled={disabled || done || order.indexOf(i - 1) !== -1}
                  onClick={() => tapOp(i - 1)}
                  onMouseEnter={() => setHoverOp(i - 1)}
                  onMouseLeave={() => setHoverOp(null)}
                  onFocus={() => setHoverOp(i - 1)}
                  onBlur={() => setHoverOp(null)}
                  aria-label={ops[i - 1]}
                >
                  <span className={'g7-so-sign' + stageOf(ops[i - 1])}>{ops[i - 1]}</span>
                  <span className="g7-so-num">
                    {order.indexOf(i - 1) !== -1 ? order.indexOf(i - 1) + 1 : ''}
                  </span>
                </button>
              ) : null}
              <span className={'g7-so-val' + (hoverOp !== null && (hoverOp === i || hoverOp === i - 1) ? ' is-lit' : '')}>{x}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* QADAM HISOBI. Metodist 2026-08-14: bosgandan keyin nima
          bo'lganini ko'rish kerak edi -- belgi burchagida 11 px raqam
          yetarli emas. Endi «qadam 1 / 3» yozuv ostida turadi. */}
      {/* Tartib qo'yilgach bu qator KERAK EMAS: belgi ham, hisoblagich ham,
          «Qaytadan» ham. Bo'sh 34px esa layfxak yangi shaklga o'tgach
          budjetdan chiqib ketardi (o'lchov 2026-08-14, 3-ekran +3px).
          Ekran QISQARADI, o'smaydi -- §6.1 buni taqiqlamaydi. */}
      <Slot mh={done ? 0 : 34}>
        <div className="g7-so-bar" style={done ? { display: 'none' } : undefined}>
          <CallToAct kind="tap" done={done || disabled} />
          <span className="g7-so-count">
            {t(UI.step)} {Math.min(order.length + (done ? 0 : 1), ops.length)} / {ops.length}
          </span>
          {order.length && !done ? (
            <Btn tone="ghost" onClick={reset}>{t(UI.again)}</Btn>
          ) : null}
        </div>
      </Slot>

      {/* Ikki YO'LAK BIRINCHI soniyadan joy egallaydi: ekran «o'sib» ketmaydi,
          faqat to'ladi (§6.1). Ikkalasi BIR VAQTDA yig'iladi -- ma'no aynan
          ularning AJRALIB ketishida, shuning uchun ular yonma-yon ketishi
          kerak, navbat bilan emas. */}
      {/* IKKI YO'LAK BIRINCHI soniyadan KO'RINADI, bo'sh bo'lsa ham.
          Metodist 2026-08-14: ilgari bu yer javobgacha BO'SH turardi va
          o'quvchi nima uchun bosayotganini bilmasdi. Endi u nima to'lishini
          oldindan ko'radi: o'z tartibi va qoida tartibi. */}
      <Slot mh={96}>
        <div className="g7-so-out">
          {done ? (
            <>
              <CollapseTrack nums={nums} ops={ops} order={order} label={t(yoursLabel)} tone="tip" />
              <CollapseTrack nums={nums} ops={ops} order={ruleOrder || order} label={t(ruleLabel)} tone="ok" />
            </>
          ) : (
            <>
              <div className="g7-so-out-row is-wait">
                <span className="g7-so-out-cap">{t(yoursLabel)}</span>
                <span className="g7-so-wait">{'—'}</span>
              </div>
              <div className="g7-so-out-row is-rule is-wait">
                <span className="g7-so-out-cap">{t(ruleLabel)}</span>
                <span className="g7-so-wait">{'—'}</span>
              </div>
            </>
          )}
        </div>
      </Slot>

      <Slot mh={58}>
        {done ? (
          <Feedback show ok={!same} tone={same ? 'neutral' : undefined}>
            {same ? t(sameNote || note) : t(note)}
          </Feedback>
        ) : null}
      </Slot>
    </>
  )
}

// ============================================================
// BracketGap -- qavsni yozuv ichiga QO'YISH. 4-sinfdagi ajratgich usuli:
// o'quvchi tayyor yozuvlardan birini TANLAMAYDI, qavsni o'zi qo'yadi.
// Shu sababli bu ekran «to'rt variantdan bittasi» kvotasiga KIRMAYDI.
//
// Tirqishlar: 0 dan nums.length gacha. Birinchi bosish -- ochuvchi qavs,
// ikkinchisi -- yopuvchi. `answer` {from, to}: qavs nums[from..to] ni oladi.
// ============================================================
export function BracketGap({ rounds, onSolved, onStep, disabled, audio }) {
  const t = useT()
  const lang = useLang()
  const fx = useAnswerFx(audio)
  const [ri, setRi] = useState(0)
  const [open, setOpen] = useState(null)
  const [okRounds, setOkRounds] = useState([])
  const [hint, setHint] = useState(null)
  const [tags, setTags] = useState([])
  const [misses, setMisses] = useState(0)

  const r = rounds[ri]
  const finished = ri >= rounds.length

  const settle = (from, to) => {
    const value = evalWithBracket(r.nums, r.ops, from, to)
    const key = from + '-' + to
    const hit = from === r.answer.from && to === r.answer.to
    if (hit) {
      fx.right()
      // Qator MANBA bo'lib saqlanadi: sonning yozilishi tilga bog'liq
      // (fmtNum), tayyor satr esa tilni almashtirganda o'zgarmasdi.
      const row = { expr: exprText(r.nums.slice(from, to + 1), r.ops.slice(from, to), r.labels && r.labels.slice(from, to + 1)), value }
      setOkRounds((prev) => prev.concat(row))
      setHint(null)
      setOpen(null)
      const next = ri + 1
      setRi(next)
      if (onStep) onStep('ok' + (ri + 1))
      if (next >= rounds.length && onSolved) {
        onSolved({ correct: true, attempts: misses + 1, tags })
      }
      return
    }
    const h = (r.hints && r.hints[key]) || (r.hints && r.hints['*']) || null
    const tg = (r.tagsBy && r.tagsBy[key]) || r.tag || null
    if (tg) setTags((prev) => (prev.indexOf(tg) === -1 ? prev.concat(tg) : prev))
    setMisses((m) => m + 1)
    setHint(h)
    setOpen(null)
    fx.wrong(h)
  }


  return (
    <>
      {okRounds.map((row, i) => <DoneRow key={i}>{'( ' + row.expr + ' ) → ' + fmtNum(row.value, lang)}</DoneRow>)}

      {!finished ? (
        <>
          <Ask kind="task">{r.prompt ? t(r.prompt) : null}</Ask>

          <div className="g7-panel g7-panel-paper g7-brgap">
            <div className="g7-so-row">
              {/* Tirqishlar IKKI XIL. Ochuvchi qavs son OLDIDA, yopuvchi esa
                  son ORTIDA -- BELGIDAN OLDIN. Ilgari ikkalasi ham son oldida
                  turardi va yopuvchi qavs belgidan KEYIN tushardi:
                  «18 − 6 : ) 3» -- matematik jihatdan ma'nosiz yozuv
                  (metodist surati 2026-08-13). */}
              {/* BO'SH TIRQISH JOY EGALLAMAYDI (metodist surati 2026-08-14).
                  Ilgari har tirqish 26px turardi qachonki u bo'sh bo'lsa ham,
                  va yozuv uzilib ketardi: 18 [bo'shliq] − [.] 6 [bo'shliq] : ...
                  Endi tirqish faqat KERAK bo'lganda ochiladi:
                    ochuvchi  -- qavs qo'yilmagunicha hammasi,
                                 qo'yilgach faqat TANLANGANI qoladi;
                    yopuvchi  -- faqat ochuvchidan O'NGDAGILARI.
                  Qolgani nolga yig'iladi, ya'ni yozuv zich turadi. */}
              {r.nums.map((x, i) => {
                const openOn = open === null || open === i
                const closeOn = open !== null && i >= open
                return (
                <React.Fragment key={'b' + i}>
                  <button
                    type="button"
                    className={'g7-brgap-slot' + (open === i ? ' is-open' : '') + (open === null && !disabled ? ' is-hint' : '') + (openOn ? '' : ' is-idle')}
                    /* Qo'yilgan ochuvchi qavsni BOSIB OLIB TASHLASH mumkin.
                       Ilgari u qulflanardi: o'quvchi noto'g'ri joyni tanlasa,
                       fikridan qaytolmasdi va MAJBURAN xato javob berardi
                       (metodist 2026-08-14: «ya oshibayus kuda stavit»). */
                    disabled={disabled || (open !== null && open !== i)}
                    onClick={() => { fx.tap(); setHint(null); setOpen(open === i ? null : i) }}
                    aria-label="("
                    aria-hidden={openOn ? undefined : 'true'}
                    tabIndex={openOn ? undefined : -1}
                  >
                    {/* Tirqishda NUQTA emas, XIRA QAVS turadi. Nuqta darsdagi
                        KO'PAYTIRISH belgisi bilan bir xil edi va o'quvchi
                        «· 3» ni «uchga ko'paytirish» deb o'qirdi -- ko'z
                        chalg'irdi va qavs noto'g'ri joyga qo'yilardi
                        (metodist surati 2026-08-14). Xira qavs esa darrov
                        aytadi: bu yerga QAVS qo'yiladi. */}
                    <span>{open === i ? '(' : (open === null ? '(' : '')}</span>
                  </button>
                  <span className="g7-so-val">{r.labels && r.labels[i] !== undefined ? r.labels[i] : x}</span>
                  <button
                    type="button"
                    className={'g7-brgap-slot' + (closeOn ? ' is-close is-hint' : ' is-idle')}
                    disabled={disabled || !closeOn}
                    onClick={() => { if (closeOn) settle(open, i) }}
                    aria-label=")"
                    aria-hidden={closeOn ? undefined : 'true'}
                    tabIndex={closeOn ? undefined : -1}
                  >
                    <span>{closeOn ? ')' : ''}</span>
                  </button>
                  {i < r.nums.length - 1 ? (
                    <span className="g7-so-sign g7-so-sign-flat">{r.ops[i]}</span>
                  ) : null}
                </React.Fragment>
                )
              })}
            </div>
          </div>

          <Slot mh={30}>
            <CallToAct kind="tap" done={disabled} />
          </Slot>

          {/* Qavssiz qiymat BIRINCHI soniyadan turadi: o'quvchi nimadan
              boshlaganini ko'rib tursin. */}
          {/* Proza HINT bilan chiqadi, Expr bilan EMAS: `.g7-expr` monoshrift va
              `white-space: nowrap`, ya'ni gap chetga chiqib KO'RINMAY qolardi
              (ETALON_7SINF.md §6.2). Faqat matematika monoshrift bilan. */}
          <Slot mh={30}>
            {r.baseNote ? <Hint>{t(r.baseNote)}</Hint> : null}
          </Slot>
        </>
      ) : null}

      <Slot mh={62}>
        <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================
// RuleBuilder -- qoidani o'quvchi YIG'ADI (4-sinf usuli). Tayyor kartochka
// to'g'ri yig'ilgandan KEYIN ochiladi va yig'ish maydonini ALMASHTIRADI:
// ikkalasi birga 400px ga sig'maydi (§6.1, «yangi qadam avvalgisini
// almashtiradi»).
// ============================================================
// `help` -- BIRINCHI xatodan KEYIN ochiladigan lug'at (metodist qarori
// 2026-08-13). §8.4: yordam urinishlar bo'yicha o'sadi va JAVOBNI ochmaydi.
// Bosqichlar lug'ati javob emas: tartibni u aytmaydi, faqat qaysi amal qaysi
// bosqichda ekanini eslatadi.
export function RuleBuilder({
  fragments, answer, wrongHint, tag, rule, after, help, onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [built, setBuilt] = useState([])
  const [solved, setSolved] = useState(false)
  const [hint, setHint] = useState(null)
  const [misses, setMisses] = useState(0)

  // Variantlar har kirishda aralashadi (§8.3).
  const shuffled = useMemo(() => {
    const a = fragments.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp
    }
    return a
  }, [fragments])

  const complete = built.length === answer.length

  const [dragOn] = useState(() => canDrag())
  const [over, setOver] = useState(false)

  // ZANJIR (metodist qarori 2026-08-13). Ilgari o'quvchi beshta bo'lakni
  // BIR YO'LA tartiblardi -- bu 120 ta variant, va yordam faqat xatodan keyin
  // kelardi. Endi har qadamda BITTA savol: «keyin nima?». Qolgan bo'laklar
  // variant bo'lib turadi, to'g'risi qatorga qo'shiladi, xatosi izoh beradi.
  // Qadamlar oson, natija esa o'sha -- qoidani o'quvchi O'ZI yig'adi.
  const add = (id) => {
    if (disabled || solved || built.indexOf(id) !== -1) return
    if (id === answer[built.length]) {
      setHint(null)
      const next = built.concat(id)
      setBuilt(next)
      if (next.length === answer.length) {
        setSolved(true)
        fx.right()
        if (onStep) onStep('ok')
        if (onSolved) onSolved({ correct: true, attempts: misses + 1, tags: misses && tag ? [tag] : [] })
      }
      return
    }
    setMisses((m) => m + 1)
    setHint(wrongHint || null)
    fx.wrong(wrongHint)
  }

  // Tortish HTML5 drag bilan: u faqat sichqonchada yoqiladi, shuning uchun
  // telefondagi skroll bilan raqobatga umuman kirmaydi.
  const dragProps = (id) => (dragOn ? {
    draggable: !disabled && !solved,
    onDragStart: (e) => { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move' },
  } : {})

  const dropProps = dragOn ? {
    onDragOver: (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (!over) setOver(true) },
    onDragLeave: () => setOver(false),
    onDrop: (e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.getData('text/plain')) },
  } : {}

  const drop = (id) => {
    if (disabled || solved) return
    setHint(null)
    setBuilt((prev) => prev.filter((x) => x !== id))
  }

  const check = () => {
    if (built.join('|') === answer.join('|')) {
      setSolved(true)
      fx.right()
      if (onStep) onStep('ok')
      if (onSolved) onSolved({ correct: true, attempts: misses + 1, tags: misses && tag ? [tag] : [] })
      return
    }
    setMisses((m) => m + 1)
    setHint(wrongHint || null)
    fx.wrong(wrongHint)
  }

  const labelOf = (id) => {
    const f = fragments.find((x) => x.id === id)
    return f ? t(f.label) : ''
  }

  if (solved) {
    return (
      <>
        {/* Yig'ilgan zanjir satri OLIB TASHLANDI (metodist 2026-08-14):
            javob chiqqach u kerak emas -- o'sha gap qoida kartochkasida
            yana bir marta turadi, faqat darslik so'zlari bilan. Ikkitasi
            birga esa ekranning yarmini yeb qo'yardi. */}
        <RuleCard {...rule} />
        {after}
      </>
    )
  }

  return (
    <>
      <div className={'g7-panel g7-panel-paper g7-rb-built' + (over ? ' is-over' : '') + (dragOn ? ' is-drag' : '')} {...dropProps}>
        {built.length ? (
          built.map((id, i) => (
            <button
              type="button"
              key={id}
              className="g7-rb-chip is-built"
              disabled={disabled}
              onClick={() => drop(id)}
            >
              <span className="g7-rb-no">{i + 1}</span>
              {labelOf(id)}
            </button>
          ))
        ) : (
          /* Bo'sh maydon NIMA QILISH kerakligini aytadi. Avval u yerda uchta
             nuqta turardi va ramka nima ekani tushunarsiz edi (metodist
             2026-08-14); keyin yozuv kursori qo'yildi, va u yangi chalkashlik
             tug'dirdi -- ramka KIRITISH MAYDONIGA o'xshab qoldi, go'yo javobni
             YOZISH kerak (QA 2026-08-23). Kursor olib tashlandi, gap esa
             pastdagi bo'lakni BOSISHGA chaqiradi. */
          <span className="g7-rb-empty">{t(UI.ruleHere)}</span>
        )}
      </div>

      <div className="g7-zone" style={{ gap: 4, paddingBottom: 6 }}>
        <p className="g7-qpill">{t(built.length ? UI.ruleNext : UI.ruleFirst)}</p>
      </div>
      <Slot mh={104}>
        <div className="g7-rb-pool">
          <CallToAct kind="tap" done={complete || disabled} />
          {/* Har qadamda FAQAT IKKI variant: to'g'risi va bitta yaqin xatosi
              (metodist qarori 2026-08-13). Beshta bo'lakni birdan ko'rish
              o'quvchini bosib qo'yardi. Xato variant qolganlardan olinadi,
              ya'ni u har doim ishonarli. */}
          {shuffled
            .filter((f) => built.indexOf(f.id) === -1)
            .filter((f, _i, rest) => {
              const right = answer[built.length]
              if (f.id === right) return true
              const others = rest.filter((x) => x.id !== right)
              return others.length ? others[built.length % others.length].id === f.id : false
            })
            .map((f) => (
            <button
              type="button"
              key={f.id}
              className="g7-rb-chip"
              disabled={disabled || built.indexOf(f.id) !== -1}
              onClick={() => add(f.id)}
              {...dragProps(f.id)}
            >
              {t(f.label)}
            </button>
          ))}
        </div>
      </Slot>


      <Slot mh={56}>
        <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback>
      </Slot>

      {misses > 0 && help ? help : null}
    </>
  )
}

// ============================================================
// HookMachines -- XUK SAHNASI. Metodist qarori 2026-08-13: 1-ekranda sahna
// bo'lishi va u HARAKATLANISHI kerak (1-4-sinf naqshi: elementlar kaskad
// bilan kiradi va keyin «yashaydi»).
//
// Sahna JUMBOQ QO'YADI, uni YECHMAYDI. Ikkala mashina bir xil ko'rinadi,
// hech biri to'g'ri deb belgilanmaydi, hisoblash TARTIBI ko'rsatilmaydi --
// aks holda 1-ekrandagi taxminning ma'nosi qolmaydi (§6.5: xukda na ball,
// na yashil rang, na belgi).
//
// Personaj YO'Q (§7.4). Rasm fayli ham yo'q -- faqat SVG va CSS.
// ============================================================
// YETTI SEGMENTLI RAQAM. Shrift EMAS, GEOMETRIYA: har raqam yettita
// ko'pburchak. Sababi ikkita. Birinchi -- haqiqiy kalkulyator ko'rinishi
// aynan shunday chiqadi, o'chgan segmentlar ham xira ko'rinib turadi.
// Ikkinchi -- xususiy shrift ishlatish TAQIQLANGAN (CLAUDE.md §5), o'zimiz
// chizgan shakl esa hech kimga tegishli emas.
const SEG_ON = {
  '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc',
  '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg',
  '-': 'g', '−': 'g', ' ': '',
}
// Katak 22 x 38, qalinlik 4. Nuqtalar qo'lda emas, bitta jadvaldan.
const SEG_PTS = {
  a: '4,1 18,1 15,5 7,5',
  b: '19,2 19,17 15.5,14.5 15.5,6',
  c: '19,21 19,36 15.5,32 15.5,23.5',
  d: '4,37 18,37 15,33 7,33',
  e: '3,21 3,36 6.5,32 6.5,23.5',
  f: '3,2 3,17 6.5,14.5 6.5,6',
  g: '4,19 18,19 15,22 7,22',
}
function SegDigit({ ch, x, y, scale = 1 }) {
  const on = SEG_ON[ch] === undefined ? 'abcdefg' : SEG_ON[ch]
  return (
    <g transform={'translate(' + x + ',' + y + ') scale(' + scale + ')'}>
      {Object.keys(SEG_PTS).map((k) => (
        <polygon
          key={k}
          /* `g7-lcdseg`, `g7-seg` EMAS. Eski nom yuqori paneldagi progress
             bo'laklari bilan URISHARDI, va telefon uslublarida o'sha nom
             `display: none` bilan yopilardi -- ya'ni TELEFONDA kalkulyator
             raqamlari umuman ko'rinmasdi. Xuk esa aynan «sonlar farq qildi»
             ustiga qurilgan: telefonda darsning birinchi ekrani ma'nosini
             yo'qotardi (2026-08-14 o'lchovi, 860px dan pastda). */
          className={'g7-lcdseg' + (on.indexOf(k) !== -1 ? ' is-on' : '')}
          points={SEG_PTS[k]}
        />
      ))}
    </g>
  )
}

// Sonni segmentli raqamlarga yoyadi va O'NGGA tekislaydi -- kalkulyatorda
// son har doim o'ng chetdan boshlanadi.
function SegNumber({ value, cx, y, scale = 1, cells = 3 }) {
  const s = String(value)
  const w = 26 * scale
  const chars = s.split('')
  const pad = cells - chars.length
  const all = (pad > 0 ? Array(pad).fill(' ') : []).concat(chars)
  const total = all.length * w
  const x0 = cx - total / 2
  return (
    <g>
      {all.map((ch, i) => (
        <SegDigit key={i} ch={ch} x={x0 + i * w} y={y} scale={scale} />
      ))}
    </g>
  )
}

// `fix` -- YAKUNDAGI intreaktiv. O'quvchi oddiy kalkulyatorni BOSADI, u
// qoida bo'yicha qayta hisoblaydi: sakkiz yigirmaga aylanadi, «teng emas»
// esa «teng» bo'ladi. Dars o'quvchi mashinani O'RGATGANI bilan tugaydi.
// Tugma alohida qatorda EMAS -- yakunning balandlik budjetida bo'sh qator
// yo'q, shuning uchun bosiladigan narsa mashinaning O'ZI.
//   fix = { value, sign, hint, doneHint, onFix }
export function HookMachines({ tokens, left, right, sign = '≠', fix }) {
  const t = useT()
  const [fixed, setFixed] = useState(false)
  const n = tokens.length
  const step = 34
  const x0 = 310 - ((n - 1) * step) / 2
  const canFix = !!fix && !fixed
  const leftVal = fixed && fix ? fix.value : left.value
  const shownSign = fixed && fix && fix.sign ? fix.sign : sign
  const doFix = () => {
    if (!canFix) return
    setFixed(true)
    if (fix.onFix) fix.onFix()
  }
  return (
    /* Topshiriq satri sahnaning TASHQARISIDA turadi. Ilgari u `g7-hookscene`
       ICHIDA edi, o'sha blokda esa `max-height` bor: sahna balandligi
       cheklangani uchun satr blokdan chiqib ketardi va uni keyingi kartochka
       yopib qo'yardi (metodist surati 2026-08-14). */
    <div className="g7-scenewrap">
    <div className="g7-scene g7-hookscene">
      <svg viewBox="0 0 620 176" className="g7-scene-svg" role="img" aria-label={tokens.join(' ')}>
        {/* Yozuv lentasi: belgilar birma-bir tushadi */}
        <rect className="g7-hk-tape" x={x0 - 22} y="4" width={(n - 1) * step + 44} height="40" rx="11" />
        {tokens.map((tok, i) => (
          <text
            key={i}
            /* Amal belgisi bosqich rangida -- darsdagi hamma yozuv kabi. */
            className={'g7-hk-tok' + stageOf(tok)}
            x={x0 + i * step}
            y="32"
            textAnchor="middle"
            style={{ animationDelay: (0.08 * i).toFixed(2) + 's' }}
          >
            {tok}
          </text>
        ))}

        {/* Ikki kabel: yozuv ikkala mashinaga BIR XIL ketadi */}
        <path className="g7-hk-wire" d="M262 46 C 200 62, 168 66, 152 84" style={{ animationDelay: '.62s' }} />
        <path className="g7-hk-wire" d="M358 46 C 420 62, 452 66, 468 84" style={{ animationDelay: '.62s' }} />
        {/* Kabel bo'ylab yuguradigan impuls: sahna tirik turadi */}
        <path className="g7-hk-pulse" d="M262 46 C 200 62, 168 66, 152 84" style={{ animationDelay: '1.5s' }} />
        <path className="g7-hk-pulse" d="M358 46 C 420 62, 452 66, 468 84" style={{ animationDelay: '1.5s' }} />

        {/* Mashinalar. Ikkalasi BIR XIL: hech qaysisi ajratib ko'rsatilmaydi */}
        {[{ cx: 148, val: leftVal, cap: left.cap, d: 1.0, wide: false }, { cx: 468, val: right.value, cap: right.cap, d: 1.0, wide: true }].map((m, i) => (
          <g
            key={i}
            className={'g7-hk-dev' + (i === 0 && canFix ? ' is-fixable' : '') + (i === 0 && fixed ? ' is-fixed' : '')}
            style={{ animationDelay: (m.d).toFixed(2) + 's' }}
            role={i === 0 && canFix ? 'button' : undefined}
            tabIndex={i === 0 && canFix ? 0 : undefined}
            aria-label={i === 0 && fix ? t(fix.hint) : undefined}
            onClick={i === 0 ? doFix : undefined}
            onKeyDown={i === 0 && canFix ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doFix() } } : undefined}
          >
            {/* Korpus. Ikkita mashina endi BIR XIL EMAS: oddiysi ixcham va
                qalin ramkali, muhandisligi keng va tugmalar qatoriga ega.
                Farq xukning O'ZI haqida -- ular boshqa-boshqa asboblar. */}
            <rect className="g7-hk-body" x={m.cx - (m.wide ? 104 : 84)} y="80" width={m.wide ? 208 : 168} height={m.wide ? 74 : 62} rx="14" />
            {/* LCD: to'q maydon, ichida xira segmentlar ham ko'rinadi */}
            <rect className="g7-hk-lcd" x={m.cx - (m.wide ? 88 : 68)} y={88} width={m.wide ? 176 : 136} height="38" rx="6" />
            <rect className="g7-hk-gloss" x={m.cx - (m.wide ? 84 : 64)} y="91" width={m.wide ? 168 : 128} height="8" rx="4" />
            {/* KURSOR: son chiqquncha miltillab turadi, keyin so'nadi */}
            <rect className="g7-hk-cur" x={m.cx + (m.wide ? 66 : 56)} y="97" width="4" height="24"
              style={{ animationDelay: (m.d + 0.1).toFixed(2) + 's' }} />
            {/* `key` da qiymat turibdi: son o'zgarganda guruh QAYTA
                chiziladi va yonish animatsiyasi boshidan ketadi -- ya'ni
                raqamlar «qayta terilgandek» ko'rinadi. */}
            {/* Qayta hisoblagach son KUTMAYDI: kirish animatsiyasining
                kechikishi faqat birinchi chiqishda kerak edi. */}
            <g key={'num' + m.val} className="g7-hk-num" style={{ animationDelay: (fixed && i === 0 ? 0 : m.d + 0.85).toFixed(2) + 's' }}>
              <SegNumber value={m.val} cx={m.cx + (m.wide ? 40 : 30)} y={91} scale={0.82} cells={3} />
            </g>
            {/* Bosish nishoni: ramka element ICHIDA va besh marta chaqnaydi
                (metodist qoidasi -- pulsatsiya cheksiz emas). */}
            {i === 0 && canFix ? (
              <rect className="g7-hk-tap" x={m.cx - 86} y="78" width="172" height="66" rx="15" />
            ) : null}
            {/* Muhandislik mashinasida tugmalar qatori */}
            {m.wide ? (
              <g className="g7-hk-keys">
                {[0, 1, 2, 3, 4, 5].map((k) => (
                  <rect key={k} x={m.cx - 84 + k * 29} y="132" width="24" height="14" rx="4" />
                ))}
              </g>
            ) : null}
            <text className="g7-hk-cap" x={m.cx} y={m.wide ? 170 : 158} textAnchor="middle">{t(m.cap)}</text>
          </g>
        ))}

        {/* «Teng emas» -- oxirida chiqadi va pulsatsiya qiladi. Yakunda u
            «teng» ga AYLANADI: `key` almashgani uchun belgi qayta chiziladi. */}
        <g key={'sg' + shownSign} className={'g7-hk-ne' + (fixed ? ' is-fixed' : '')} style={{ animationDelay: fixed ? '0s' : '2.05s' }}>
          <circle className="g7-hk-ring" cx="310" cy="112" r="21" />
          <text x="310" y="120" textAnchor="middle">{shownSign}</text>
        </g>

      </svg>
    </div>
      {/* Topshiriq SVG ning ICHIDA emas. Sahna telefonda kichrayadi va u
          bilan birga SVG matni ham kichrayardi: yozuv mashina imzolari
          ustiga tushib, o'qilmay qolardi. Oddiy matn esa sahna o'lchamidan
          MUSTAQIL va har ekranda bir xil o'qiladi. */}
      {fix ? (
        <p className={'g7-hk-ask' + (fixed ? ' is-done' : '')}>
          {!fixed ? <i className="g7-hk-ask-dot" aria-hidden="true" /> : null}
          {t(fixed ? fix.doneHint : fix.hint)}
        </p>
      ) : null}
    </div>
  )
}

// ============================================================
// LawReveal -- QONUN JONLANADI. Qoida yig'ilgandan KEYIN uning qismlari
// birma-bir yonadi: qavs, uchinchi bosqich, ikkinchi, birinchi. So'ngida
// chiziq chapdan o'ngga o'tadi -- «bitta bosqich ichida chapdan o'ngga».
// Javobni ochmaydi: o'quvchi qoidani ALLAQACHON yig'ib bo'lgan.
// ============================================================
// ============================================================
// StairsReveal -- QOIDA LESTNITSASI (metodist tasdiqladi 2026-08-14).
// Qoida endi satr emas, RASM: to'rt pog'ona, ular bo'ylab yozuv yuqoridan
// pastga tushadi. Har pog'onada o'z chipi yonadi -- qavs, uchinchi, ikkinchi,
// birinchi bosqich. Pastda esa chiziq chapdan o'ngga o'tadi: «bitta bosqich
// ichida chapdan o'ngga».
//
// Nega lestnitsa: «bosqich» so'zining O'ZI pog'ona degani, va o'quvchi
// qoidani kontrol ishda aynan shu rasm bilan eslaydi.
// Harakat BIR MARTA o'tadi va to'xtaydi (§7.1, pulsatsiya cheksiz emas).
// Faqat CSS va SVG, rasm fayli yo'q (CLAUDE.md §5).
// ============================================================
// ============================================================================
// EquationBalance -- B2 BLOKINING ASBOBI: «tenglama va yechimlar to'plami».
// Etalon §2 shu asbobni blokning ASOSIY asbobi deb ataydi.
//
// ASOSIY QOIDA, VA U ASBOBNING O'ZIGA QURILGAN: «faqat chap tomonga» degan
// tugma YO'Q. Har qanday amal IKKALA TOMONGA BIR VAQTDA qo'llanadi. O'quvchi
// tenglikni buza olmaydi -- u faqat QULAY yoki noqulay amalni tanlashi
// mumkin. Etalon §2 B2 aynan shuni talab qiladi: «tugma yo'q, amal ikkala
// tomonga ketadi».
//
// ARIFMETIKA HISOBLANADI, jadvaldan olinmaydi. Holat uchta son bilan
// beriladi: a, b, c -- ya'ni a karra x qo'shuv b teng c. Amal shu uchta
// songa qo'llanadi, qatorlar esa har safar QAYTA CHIZILADI. Shu sababli
// asbob blokdagi har bir darsga yaraydi, faqat sonlar boshqa.
//
// NAZORATCHI, ORACLE EMAS (§8.1). Asbob javobni ko'rsatmaydi: u o'quvchi
// tanlagan amalni bajaradi. Agar amal yechimga yaqinlashtirmasa, qator
// QO'SHILMAYDI -- yozuv chayqaladi va razbor chiqadi.
//
//   start   = { a, b, c }
//   actions = [{ id, label, kind: 'add'|'sub'|'mul'|'div', n, hint }]
//   done    -- yechilgan qatordagi izoh
// ============================================================================
// HOLAT TO'RTTA SON bilan beriladi: a karra x qo'shuv b teng k karra x qo'shuv c.
// `k` yozilmasa nol -- 8-darsning ma'lumotlari o'zgarishsiz ishlayveradi.
// O'ZGARUVCHINI ikkala tomondan ayirish ham oddiy amal: aynan shu 9-darsdagi
// «al-jabr» ning o'zi. Ko'chirish yangi qoida emas, u tarozining QISQA yozuvi.
const eqK = (st) => st.k || 0

const eqApply = (st, act) => {
  const n = act.n
  const k = eqK(st)
  if (act.kind === 'add') return { a: st.a, b: st.b + n, k, c: st.c + n }
  if (act.kind === 'sub') return { a: st.a, b: st.b - n, k, c: st.c - n }
  if (act.kind === 'addx') return { a: st.a + n, b: st.b, k: k + n, c: st.c }
  if (act.kind === 'subx') return { a: st.a - n, b: st.b, k: k - n, c: st.c }
  if (act.kind === 'mul') return { a: st.a * n, b: st.b * n, k: k * n, c: st.c * n }
  if (act.kind === 'div') return { a: st.a / n, b: st.b / n, k: k / n, c: st.c / n }
  return st
}

// Qadam FOYDALIMI. Tartib: avval o'ng tomondagi o'zgaruvchi ketadi, keyin
// chapdagi ozod had, oxirida koeffitsiyent birga aylanadi. Boshqa amallar
// qonuniy, lekin yechimga yaqinlashtirmaydi -- ular qator qo'shmaydi.
const eqProgress = (st, next) => {
  if (eqK(st) !== 0) return eqK(next) === 0 && next.a !== 0
  if (st.b !== 0) return next.b === 0 && next.a === st.a
  if (st.a !== 1) return next.a === 1 && next.b === 0
  return false
}

// Sonni yozish: butun son oddiy chiqadi, kasr esa VERGUL bilan (matematika
// darsligining yozuvi), minus esa qisqa tire emas, MINUS belgisi bilan.
const eqNum = (n) => {
  const r = Math.round(n * 1000) / 1000
  return String(r).replace('.', ',').replace('-', '−')
}

// Bitta tomonni yozish. Ikkala tomon ham SHU funksiya bilan chiziladi:
// chap va o'ng bir xil qoidaga bo'ysunadi, ya'ni ular teng huquqli.
const eqSide = (coef, free) => {
  if (coef === 0) return eqNum(free)
  const head = coef === 1 ? 'x' : coef === -1 ? '−x' : eqNum(coef) + 'x'
  if (free === 0) return head
  return head + (free > 0 ? ' + ' : ' − ') + eqNum(Math.abs(free))
}

const eqLeft = (st) => eqSide(st.a, st.b)
const eqRight = (st) => eqSide(eqK(st), st.c)

export function EquationBalance({ start, actions, done, onSolved, onStep, disabled, audio }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [rows, setRows] = useState([start])
  const [hint, setHint] = useState(null)
  const [shake, setShake] = useState(0)
  const [tags, setTags] = useState([])
  const [misses, setMisses] = useState(0)
  // Qo'llanayotgan amal: 420 ms davomida ikkala tomonda ham ko'rinadi,
  // keyin yangi qator keladi. Darsning bitta qo'l yozuvi (§7.1).
  const [applying, setApplying] = useState(null)

  const st = rows[rows.length - 1]
  const solved = st.a === 1 && st.b === 0 && eqK(st) === 0

  // Nechta qator bo'lishini OLDINDAN bilamiz: ozod had bo'lsa bitta qadam,
  // koeffitsiyent birdan boshqa bo'lsa yana bitta. Shu sababli joyni chamalab
  // emas, ANIQ band qilamiz -- ilgari 172 px olinardi va 3-ekran noutbukda
  // 35 px oshib ketardi.
  const maxRows = 1 + ((start.k || 0) !== 0 ? 1 : 0) + (start.b !== 0 ? 1 : 0) + (start.a !== 1 ? 1 : 0)
  // Har qatorda tovoqlar bor, amal chiqqanda esa tagida yana bitta satr.
  const steps = maxRows - 1
  const rowsH = 52 + steps * 38 + 24
  // To'rt tugma ikki ustunda -- ikki qator. Yechilgach ularning o'rniga bitta
  // satr keladi, ya'ni joy KAMAYADI, oshmaydi.
  const actsH = 46

  const pick = (act) => {
    if (solved || applying) return
    const next = eqApply(st, act)
    if (!eqProgress(st, next)) {
      setHint(act.hint || null)
      setShake((s) => s + 1)
      setMisses((m) => m + 1)
      if (act.tag) setTags((prev) => (prev.indexOf(act.tag) === -1 ? prev.concat(act.tag) : prev))
      fx.wrong(act.hint)
      return
    }
    fx.right()
    setApplying(act)
    setTimeout(() => {
      setApplying(null)
      setHint(null)
      const list = rows.concat(next)
      setRows(list)
      if (onStep) onStep('step' + list.length)
      if (next.a === 1 && next.b === 0 && eqK(next) === 0 && onSolved) {
        onSolved({ correct: true, root: next.c, attempts: misses + 1, tags })
      }
    }, 420)
  }

  return (
    <>
      {!solved ? <Ask kind="task" tight>{t(UI.eqPick)}</Ask> : null}
      {/* Balandlik OLDINDAN band: qatorlar qo'shilganda ekran O'SMAYDI (§6.1). */}
      <Slot mh={rowsH} style={{ alignItems: 'stretch', justifyContent: 'flex-start' }}>
        <div className="g7-eqb g7-shakebox">
          {rows.map((r, i) => {
            const live = i === rows.length - 1
            return (
              <div key={i} className={'g7-eqb-row' + (live ? ' is-live' : '') + (live && shake ? ' g7-shake' : '')}>
                {/* IKKI TOVOQ. Tenglamaning ikki tomoni SO'Z emas, ikkita
                    ko'rinadigan buyum: shundagina «ikkala tomonga» degan gap
                    ekranda tasdig'ini topadi. */}
                <span className="g7-eqb-plate"><Fx>{eqLeft(r)}</Fx></span>
                <span className="g7-eqb-eq">=</span>
                <span className="g7-eqb-plate"><Fx>{eqRight(r)}</Fx></span>
                {/* AMAL IKKALA TOVOQ TAGIDA BIR VAQTDA chiqadi. */}
                {live && applying ? (
                  <>
                    <span className="g7-eqb-op g7-eqb-op-l">{t(applying.label)}</span>
                    <span className="g7-eqb-op g7-eqb-op-r">{t(applying.label)}</span>
                  </>
                ) : null}
              </div>
            )
          })}
          {/* BO'SH QATORLAR. Pastdagi joy keyingi qadamlar uchun band, va
              bo'sh joy shuni AYTIB TURADI: qancha qator qolgani ko'rinadi.
              Aks holda ekranning yarmi sababsiz bo'sh turardi. */}
          {Array.from({ length: Math.max(0, maxRows - rows.length) }).map((_, i) => (
            <div key={'g' + i} className="g7-eqb-row is-ghost">
              <span className="g7-eqb-plate" />
              <span className="g7-eqb-eq">=</span>
              <span className="g7-eqb-plate" />
            </div>
          ))}
          {!solved ? (
            <span className="g7-eqb-cnt">{t(UI.step)} {Math.min(rows.length, steps)} / {steps}</span>
          ) : null}
        </div>
      </Slot>

      {/* AMALLAR RO'YXATI -- bu VARIANTLAR EMAS. `Options` javob variantlari
          uchun: u tanlanganini belgilab qo'yadi va to'rtta variantni butun
          kenglikka yoyadi. Bu yerda esa tanlov QAYTARILADI, xato amal esa
          «tanlangan» bo'lib qolmaydi -- u shunchaki ishlamaydi. Shuning
          uchun asbobning o'z qatori: ixcham tugmalar, bitta satrda.
          Yana bir sabab: yadro `−11x` dagi HARFNI ko'rib, uni matn deb
          hisoblaydi va tugmalarni ikki ustunga yoyib yuborardi. */}
      <Slot mh={actsH}>
        {!solved ? (
          <div className="g7-eqb-acts">
            {actions.map((a) => (
              <button
                key={a.id}
                type="button"
                className="g7-eqb-act"
                disabled={disabled || !!applying}
                onClick={() => pick(a)}
              >
                <Fx>{t(a.label)}</Fx>
              </button>
            ))}
          </div>
        ) : done ? (
          <DoneRow prose>{t(done)}</DoneRow>
        ) : null}
      </Slot>

      {/* Yechilgach razborga joy KERAK EMAS: xato endi bo'lishi mumkin emas.
          Bo'sh slot 58 px olib turardi va 3-4 ekranlar noutbukda 13 px oshib
          ketardi. Kontent QISQARADI, o'smaydi -- skroll paydo bo'lmaydi. */}
      <Slot mh={solved ? 0 : 58}>
        <Feedback show={!!hint} ok={false}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================================
// FactorTape -- B3 BLOKINING ASBOBI: MULJITELLAR LENTASI.
//
// Darslik darajani MULJITELLAR KO'PAYTMASI orqali ta'riflaydi (26-bet):
// a karra a karra ... karra a teng a ning n-darajasi. Va shu yerda ikkinchi
// juftlik turadi: bir xil sonlar YIG'INDISI ko'paytirishga aylanadi
// (a qo'shuv a qo'shuv a teng 3a), bir xil sonlar KO'PAYTMASI esa darajaga.
//
// BLOKNING ASOSIY XATOSI shu ikki qavatning aralashib ketishi: a kvadrat
// qo'shuv a kvadrat ni o'quvchi a to'rtinchi daraja deb yozadi. Lenta
// ularni JISMONAN ajratadi: yig'indi lentasi KOEFFITSIYENTNI o'stiradi,
// ko'paytma lentasi esa KO'RSATKICHNI. Ularni bitta lentaga qo'shib
// bo'lmaydi, chunki asbob qo'shmaydi.
//
// LENTA ICHIDA va LENTA TASHQARISIDA. `outside` -- lentaga KIRMAYDIGAN
// qism: 2a kubda ikkilik tashqarida, (2a) kubda esa har muljitel ichida.
// Aynan shu farq «2a³ va (2a)³ bir xil» xatosini yopadi.
//
// ASBOB SANAYDI, javob bermaydi: xato javobda u lentadagi elementlar
// sonini takrorlaydi, natijani esa aytmaydi (§8.1).
// ============================================================================
// KENGAYTIRISH (14-dars): `groups` va `cross`.
//   groups -- lentani GURUHLARGA bo'ladi: a³ karra a⁴ da uchta va to'rtta,
//            (a³)⁴ da esa to'rtta guruh uchtadan. Ko'rsatkichlar nega
//            qo'shiladi va nega ko'paytiriladi -- shu bo'linishda ko'rinadi.
//   cross  -- oxiridan nechta element O'CHIRILADI: bo'lish shunday ishlaydi,
//            umumiy muljitellar qisqaradi.
// KENGAYTIRISH (15-dars): `mixed`.
//   mixed -- lenta HAR XIL elementlardan iborat: 2 · a · 3 · b · a.
//   Bir had standart shaklga aynan shu tarzda keltiriladi: sonlar birga
//   ko'paytiriladi, bir xil harflar sanaladi.
//   ASBOB JAVOBNI YIG'MAYDI: u faqat lentada NIMA borligini sanab beradi
//   (sonlar ro'yxati va har harfning soni). Ko'paytirishni va yozuvni
//   o'quvchi o'zi qiladi -- aks holda tanlash bo'sh ishga aylanadi.
export function FactorTape({
  expr, item, count, join = '·', outside, options, answer, wrongs, note,
  groups, cross = 0, mixed,
  onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [tags, setTags] = useState([])
  const isSum = join === '+'

  const reveal = () => {
    if (open || disabled) return
    fx.tap()
    setOpen(true)
    if (onStep) onStep('open')
  }

  const pick = (o) => {
    if (picked || disabled) return
    if (o.id === answer) {
      fx.right()
      setPicked(o.id)
      setHint(note || null)
      if (onSolved) onSolved({ correct: true, attempts: wrong.length + 1, tags })
      return
    }
    const w = (wrongs || []).find((x) => x.key === o.id) || (wrongs || []).find((x) => x.key === '*')
    setWrong((prev) => (prev.indexOf(o.id) === -1 ? prev.concat(o.id) : prev))
    setHint(w ? w.hint : null)
    if (w && w.tag) setTags((prev) => (prev.indexOf(w.tag) === -1 ? prev.concat(w.tag) : prev))
    fx.wrong(w ? w.hint : null)
  }

  const list = mixed && mixed.length ? mixed : null
  const total = list ? list.length : count
  const cells = []
  for (let i = 0; i < total; i += 1) cells.push(i)

  // LENTADA NIMA BOR. Sonlar alohida, harflar alohida sanaladi. Bu hisob
  // ma'lumotdan olinmaydi, u lentaning o'zidan chiqadi.
  let tally = null
  if (list) {
    const nums = []
    const letters = {}
    list.forEach((e) => {
      const v = String(e).trim()
      if (/^[−-]?\d+(?:[.,]\d+)?$/.test(v)) nums.push(v)
      else letters[v] = (letters[v] || 0) + 1
    })
    tally = { nums, letters: Object.keys(letters).sort().map((k) => ({ k, n: letters[k] })) }
  }

  return (
    <>
      <Slot mh={44}>
        {/* O'ram: Slot ichida element o'zi markazga kelmaydi. */}
        <div className="g7-ft-head">
        {/* HAQIQIY <button>, div EMAS. Sabab ikkitasi va ikkalasi ham
            jiddiy: klaviatura bilan o'tish, va tekshiruv skripti tugmalarni
            izlaydi -- div ni ko'rmaydi. Aynan shu xato `DistanceLine` da
            ham bo'lgan (10-dars, 2026-08-17). */}
        {open ? (
          <span className="g7-ft-src is-open"><Fx>{expr}</Fx></span>
        ) : (
          <button type="button" className="g7-ft-src" onClick={reveal} disabled={disabled}>
            <Fx>{expr}</Fx>
            {!disabled ? <TapMark /> : null}
          </button>
        )}
        </div>
      </Slot>

      {/* LENTA. Tashqaridagi qism qavsdan TASHQARIDA turadi va shu bilan
          «lentaga kirmadi» degani ko'rinadi. */}
      <Slot mh={78}>
        {open ? (
          <div className="g7-ft">
            {outside ? <span className="g7-ft-out"><Fx>{outside}</Fx></span> : null}
            <span className="g7-ft-tape">
              {cells.map((i) => {
                let edge = false
                if (groups && groups.length) {
                  let acc = 0
                  for (let g = 0; g < groups.length - 1; g += 1) {
                    acc += groups[g]
                    if (acc === i) edge = true
                  }
                }
                const gone = cross > 0 && i >= count - cross
                return (
                  <span
                    key={i}
                    className={'g7-ft-cell' + (edge ? ' is-edge' : '') + (gone ? ' is-gone' : '')}
                    style={{ animationDelay: (i * 90) + 'ms' }}
                  >
                    {i ? <span className="g7-ft-join">{join}</span> : null}
                    {/* Element ALOHIDA o'ramda: o'chirish chizig'i faqat
                        unga tushadi. Aks holda chiziq ajratgichni ham
                        kesib o'tadi va ko'paytirish nuqtasi MINUSGA
                        o'xshab qoladi (surat 2026-08-20). */}
                    <span className="g7-ft-val"><Fx>{list ? String(list[i]) : item}</Fx></span>
                  </span>
                )
              })}
            </span>
            {tally ? (
              <span className="g7-ft-cnt">
                {t(UI.ftNums)} {tally.nums.join(' · ')}
                {tally.letters.map((x) => '   ' + x.k + ': ' + x.n).join('')}
              </span>
            ) : (
              <span className={'g7-ft-cnt' + (isSum ? ' is-sum' : '')}>
                {t(isSum ? UI.ftSum : UI.ftMul)} {count}
                {cross > 0 ? ' − ' + cross + ' = ' + (count - cross) : ''}
              </span>
            )}
          </div>
        ) : null}
      </Slot>

      <Slot mh={54}>
        {open ? (
          <Options
            items={options.map((o) => ({ id: o.id, label: t(o.label) }))}
            picked={picked}
            wrong={wrong}
            onPick={pick}
            disabled={disabled}
            cols={4}
          />
        ) : null}
      </Slot>

      <Slot mh={58}>
        <Feedback show={!!hint} ok={!!picked}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================================
// QuantityCard -- KATTALIKLAR JADVALI (11-dars). KO'RSATUVCHI asbob:
// u savol bermaydi va javobni tekshirmaydi, u masalaning TUZILISHINI ushlab
// turadi. Interaktiv qism yonida turadi (Probe, SlotFill).
//
// Nega kerak. Darslik masalani tenglamaga aylantirishning OLTI qadamini
// beradi, va ularning uchtasi kattaliklar haqida: qanday kattaliklar bor,
// qaysi biri noma'lum, qaysi birini harf bilan belgilaymiz. Bu qadamlar
// yozuvda ko'rinmaydi -- ular boshda qoladi va shu sababli yo'qoladi.
// Jadval ularni ekranga chiqaradi: har qator bitta kattalik, va uning
// yonida yo savol belgisi, yo topilgan ifoda turadi.
//
//   rows: [{ id, cap, expr }]  -- expr bo'lmasa savol belgisi chiziladi
//   mark:   qaysi qator HARF bilan belgilangani (to'q sariq ramka)
//   answer: qaysi qatorda JAVOB turgani (yashil ramka)
//
// IKKI HOLAT IKKI RANG. Ilgari bitta `mark` bor edi va u to'q sariq bilan
// bo'yalardi. 6-ekranda esa topshiriq «javob YUQORI qatorda» deb turgan
// paytda to'q sariq PASTGI qatorda edi -- rang topshiriqqa qarshi o'qilardi
// (surat 2026-08-17). Endi harf va javob boshqa ranglar bilan ko'rsatiladi:
// to'q sariq -- «shu yerga harf qo'ydik», yashil -- «javob shu yerda».
// ============================================================================
export function QuantityCard({ rows, mark, answer, caption }) {
  const t = useT()
  return (
    <div className="g7-qc">
      {caption ? <span className="g7-qc-cap">{t(caption)}</span> : null}
      {rows.map((r) => (
        <div
          key={r.id}
          className={'g7-qc-row' + (r.id === mark ? ' is-mark' : '') + (r.id === answer ? ' is-answer' : '')}
        >
          <span className="g7-qc-name">{t(r.cap)}</span>
          <span className="g7-qc-val">
            {r.expr ? <Fx>{r.expr}</Fx> : <span className="g7-qc-wait">?</span>}
          </span>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// DistanceLine -- 10-DARSNING ASBOBI: MASOFA O'QI.
//
// Darslik modulni STR. 6 da shunday ta'riflaydi: «sonning moduli uning son
// o'qida 0 sonidan qancha uzoqligini bildiradi». Ya'ni modul -- MASOFA.
// Asbob aynan shu ta'rifni ekranga chiqaradi va undan boshqa hech narsa
// qilmaydi: o'quvchi markazdan berilgan masofada turgan nuqtalarni topadi.
//
// ASOSIY QOIDA, VA U ASBOBGA QURILGAN: bitta nuqta topilgach masala YOPILMAYDI.
// Blokning eng qimmat xatosi -- «ikkita ildiz o'rniga bitta» -- shu tarzda
// mumkin bo'lmay qoladi, xuddi 8-darsda bir tomonga amal qo'llash mumkin
// bo'lmagani kabi. Nechta nuqta kerakligini asbob O'ZI hisoblaydi: masofa
// noldan katta bo'lsa ikkita, nolga teng bo'lsa bitta.
//
// NAZORATCHI, ORACLE EMAS (§8.1). Xato nuqta bosilsa, asbob javobni
// ko'rsatmaydi -- u HAQIQIY masofani aytadi: «bu yergacha uch, kerak esa besh».
//
//   center -- modul ichidagi ifoda nolga aylanadigan son
//   dist   -- masofa (modulning o'ng tomoni)
// ============================================================================
export function DistanceLine({ center = 0, dist, from, to, audio, onSolved, onStep, disabled, done, label, tag }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [hits, setHits] = useState([])
  const [miss, setMiss] = useState(null)
  const [shake, setShake] = useState(0)
  // Xato nuqta ham TEG yozadi (§8.5): yakun ekrani kamchilikni shundan biladi.
  // Asbob teg yozmasa, o'qdagi ekranlar yakunga hech narsa bermay qolardi.
  const [tags, setTags] = useState([])

  const need = dist === 0 ? 1 : 2
  const solved = hits.length >= need
  const W = 620
  const pad = 40
  const x = (v) => pad + ((v - from) / (to - from)) * (W - 2 * pad)
  const marks = []
  for (let v = from; v <= to; v += 1) marks.push(v)

  const tap = (v) => {
    if (solved || disabled) return
    if (hits.indexOf(v) !== -1) return
    const d = Math.abs(v - center)
    if (d !== dist) {
      setMiss({ v, d })
      setShake((n) => n + 1)
      if (tag) setTags((prev) => (prev.indexOf(tag) === -1 ? prev.concat(tag) : prev))
      fx.wrong(null)
      return
    }
    fx.right()
    const list = hits.concat(v)
    setHits(list)
    setMiss(null)
    if (onStep) onStep('hit' + list.length)
    if (list.length >= need && onSolved) {
      onSolved({ correct: true, roots: list.slice().sort((p, q) => p - q), attempts: 1, tags })
    }
  }

  return (
    <>
      <Slot mh={150} style={{ alignItems: 'stretch' }}>
        <div className={'g7-dl' + (shake ? ' g7-shakebox' : '')}>
          {/* O'q va bosish zonalari BITTA o'ramda: o'ram svg ning o'lchamini
              oladi, shuning uchun foizlar aynan svg ga tushadi. Hisoblagich
              satri o'ramdan TASHQARIDA qoladi -- aks holda vertikal foiz
              undan ham hisoblanardi. */}
          <div className="g7-dl-box">
          <svg viewBox={'0 0 ' + W + ' 128'} className={'g7-dl-svg' + (shake && miss ? ' g7-shake' : '')} role="img" aria-label={String(dist)}>
            <line className="g7-dl-axis" x1={pad} y1="82" x2={W - pad} y2="82" />
            {marks.map((v) => (
              <g key={v}>
                <line className="g7-dl-tick" x1={x(v)} y1="77" x2={x(v)} y2="87" />
                <text className="g7-dl-num" x={x(v)} y="106" textAnchor="middle">{v}</text>
              </g>
            ))}
            {/* MARKAZ -- modul ichidagi ifoda nolga aylanadigan nuqta. */}
            <circle className="g7-dl-center" cx={x(center)} cy="82" r="7" />
            {/* TOPILGAN NUQTALAR va ular bilan markaz orasidagi MASOFA. */}
            {hits.map((v) => (
              <g key={'h' + v}>
                <path
                  className="g7-dl-span"
                  d={'M ' + x(center) + ' 60 L ' + x(center) + ' 46 L ' + x(v) + ' 46 L ' + x(v) + ' 60'}
                />
                <text className="g7-dl-span-num" x={(x(center) + x(v)) / 2} y="38" textAnchor="middle">{dist}</text>
                <circle className="g7-dl-hit" cx={x(v)} cy="82" r="9" />
              </g>
            ))}
            {/* XATO NUQTA: haqiqiy masofa ko'rsatiladi, javob emas. */}
            {miss && !solved ? (
              <g>
                <path
                  className="g7-dl-span is-miss"
                  d={'M ' + x(center) + ' 60 L ' + x(center) + ' 46 L ' + x(miss.v) + ' 46 L ' + x(miss.v) + ' 60'}
                />
                <text className="g7-dl-span-num is-miss" x={(x(center) + x(miss.v)) / 2} y="38" textAnchor="middle">{miss.d}</text>
                <circle className="g7-dl-miss" cx={x(miss.v)} cy="82" r="8" />
              </g>
            ) : null}
          </svg>
          {/* BOSISH ZONALARI -- HTML tugmalari, SVG doiralari EMAS.
              Sabab ikkita va ikkalasi ham jiddiy: klaviatura bilan o'tish
              (SVG doirasiga fokus tushmaydi) va ekran o'quvchisi uchun nom.
              Joylashuv foizda beriladi, chunki svg kenglik bo'yicha
              cho'ziladi -- piksel bu yerda ishlamaydi. */}
          <div className="g7-dl-zones" aria-hidden={solved || disabled ? 'true' : 'false'}>
            {marks.map((v) => (
              <button
                key={'z' + v}
                type="button"
                className="g7-dl-zone"
                style={{ left: (x(v) / W) * 100 + '%', top: (82 / 128) * 100 + '%' }}
                disabled={solved || disabled}
                aria-label={String(v)}
                onClick={() => tap(v)}
              />
            ))}
          </div>
          </div>
          <span className="g7-dl-cnt">{t(label)} {hits.length} / {need}</span>
        </div>
      </Slot>

      <Slot mh={58}>
        <Feedback show={!!miss && !solved} ok={false}>
          {miss && !solved ? t(UI.dlMiss) + ' ' + miss.d + ', ' + t(UI.dlNeed) + ' ' + dist : null}
        </Feedback>
        {solved && done ? <DoneRow prose>{t(done)}</DoneRow> : null}
      </Slot>
    </>
  )
}

// ============================================================================
// SolutionSet -- YECHIMLAR TO'PLAMI TABLICHKASI (etalon §1.5).
// Uchta katak: bitta son, hamma son, bittasi ham yo'q. Tenglama va ayniyat
// SO'Z bilan emas, shu tablichka bilan farqlanadi.
// ============================================================================
export function SolutionSet({ kind, caption }) {
  const t = useT()
  const cells = [
    { id: 'one', label: L('bitta son', 'одно число', 'one number') },
    { id: 'all', label: L('hamma son', 'все числа', 'every number') },
    { id: 'none', label: L('bittasi ham yo\'q', 'ни одного', 'none') },
  ]
  return (
    <div className="g7-set">
      {caption ? <span className="g7-set-cap">{t(caption)}</span> : null}
      <div className="g7-set-row">
        {cells.map((c) => (
          <span key={c.id} className={'g7-set-cell' + (c.id === kind ? ' is-on' : '') + (kind ? '' : ' is-wait')}>{t(c.label)}</span>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// TwoRoutes -- XUK SAHNASI: BITTA MANBA, IKKI YO'L, IKKI TABLO.
//
// Bu 1-darsning naqshi, umumlashtirilgani. U yerda manba yozuv lentasi va
// ikkita kalkulyator edi. Bu yerda manba ikki ko'rinishda bo'ladi, tablolar
// esa ikki yo'lni ko'rsatadi. Sinf bitta qo'l yozuvida qoladi, va uchta
// o'xshash asbob o'rniga BITTASI turadi (CLAUDE.md §5).
//
// SODDA BO'LISHI SHART (metodist 2026-08-15, «prosto smysl day»): sahnada
// ortiqcha narsa yo'q. Manba, ikki chiziq, ikki tablo, halqa -- tamom.
//
//   source = { kind: 'gate',  outer, sign, inner }  -- qavs darvozasi (5-dars)
//   source = { kind: 'plain', tokens }              -- oddiy yozuv (3-dars)
//   rows   = [{ tokens, value }, { tokens, value }] -- ikki tablo
//   sign   -- tablolar orasidagi halqa: «teng emas» yoki «teng»
//   fix    -- yakundagi interaktiv: yuqori tablo bosiladi
//
// XUKDA MEXANIKA KO'RSATILMAYDI. Sahna ikki yo'lni yonma-yon qo'yadi va
// qaysi biri to'g'ri ekanini AYTMAYDI (§8.1). Tushuntirish javobdan keyin.
//
// Faqat SVG, rasm fayli yo'q (CLAUDE.md §5).
// ============================================================================
// BO'LAKLAR KENGLIK BO'YICHA TERILADI, QOTIB QOLGAN QADAM BO'YICHA EMAS.
// Ilgari har bo'lak qo'shnisidan 34 px narida turardi, kengligi qanday
// bo'lishidan qat'i nazar. Bir belgili bo'lak uchun bu yetarli edi, ammo
// «jami» to'rt belgi, ya'ni 60 px: u yonidagi «40» ustiga chiqib ketardi va
// yozuv «jam40 kg» bo'lib o'qilardi (metodist 2026-08-22, o'zbekcha).
// Monoshriftda belgi kengligi 0.6em, shuning uchun bo'lakning kengligi ANIQ
// hisoblanadi. Qator maydonga sig'masa, u SIQILADI (shrift ham, oraliq ham),
// ustma-ust tushmaydi.
const MONO_CH = 0.6
const monoRow = (tokens, fs, cx, maxW) => {
  const ws = tokens.map((tok) => Array.from(String(tok)).length * fs * MONO_CH)
  const gap = fs * 0.42
  const full = ws.reduce((a, b) => a + b, 0) + gap * Math.max(0, tokens.length - 1)
  const k = maxW && full > maxW ? maxW / full : 1
  let x = cx - (full * k) / 2
  const xs = ws.map((w) => {
    const c = x + (w * k) / 2
    x += (w + gap) * k
    return c
  })
  return { xs, fs: fs * k }
}

export function TwoRoutes({ source, rows, sign = '≠', fix }) {
  const t = useT()
  const [fixed, setFixed] = useState(false)
  const canFix = !!fix && !fixed
  const doFix = () => {
    if (!canFix) return
    setFixed(true)
    if (fix.onFix) fix.onFix()
  }
  const shownSign = fixed && fix && fix.sign ? fix.sign : sign
  // BELGI SO'Z BO'LISHI HAM MUMKIN. Sahnaning ko'p yozuvi matematika, lekin
  // ba'zi darsda tabloda so'z turadi (12-darsda «jami», 42-darsda «kerak»).
  // So'z uch tilda boshqacha, shuning uchun har belgi t() dan o'tadi: L(...)
  // ham, oddiy satr ham qabul qilinadi. Buni qilmasak, ruscha ekranda
  // o'zbekcha so'z qolardi (QA 2026-08-23).
  const tk = (arr) => (arr || []).map((x) => t(x))
  const topTokens = tk(fixed && fix ? fix.tokens : rows[0].tokens)
  const topValue = fixed && fix ? fix.value : rows[0].value

  // Tablo ichidagi yozuv: har belgi O'Z bosqich rangida, darsdagi hamma
  // yozuv kabi.
  // TABLO O'LCHAMI qiymat uzunligidan hisoblanadi. Qotib qolgan 48px
  // maydonga to'rt xonali son sig'masdi va yozuv uning ustiga chiqib
  // ketardi (surat 2026-08-16).
  const cells = Math.max.apply(null, rows.concat(fix ? [fix] : []).map((r) => String(r.value).length))
  const lcdW = 16 + cells * 17
  const lcdX = 592 - lcdW - 12
  const numCx = lcdX + lcdW / 2

  const rowText = (tokens, y) => {
    const row = monoRow(tokens, 21, 340 + (lcdX - 340) / 2, lcdX - 340 - 18)
    return tokens.map((tok, i) => (
      <text
        key={i}
        className={'g7-gt-tok' + stageOf(tok)}
        x={row.xs[i]}
        y={y}
        textAnchor="middle"
        style={{ fontSize: row.fs.toFixed(1) + 'px', animationDelay: (1.15 + 0.06 * i).toFixed(2) + 's' }}
      >
        {tok}
      </text>
    ))
  }

  return (
    <div className="g7-scenewrap">
      <div className="g7-scene g7-hookscene">
        <svg viewBox="0 0 620 176" className="g7-scene-svg" role="img" aria-label={rows.map((r) => tk(r.tokens).join(' ')).join('; ')}>
          {/* MANBA. Ikki ko'rinish: qavs darvozasi yoki oddiy yozuv. */}
          <g className="g7-gt-gate">
            {source.kind === 'gate' ? (
              <>
                {/* Chapda tashqi son, keyin ishora nishoni, keyin qavs. */}
                <text className="g7-gt-outer" x="40" y="99" textAnchor="middle">{t(source.outer)}</text>
                <circle className="g7-gt-badge" cx="88" cy="88" r="18" />
                <text className="g7-gt-badgetxt" x="88" y="97" textAnchor="middle">{source.sign}</text>
                <rect className="g7-gt-box" x="114" y="54" width="152" height="68" rx="16" />
                <text className="g7-gt-par" x="128" y="101" textAnchor="middle">(</text>
                <text className="g7-gt-par" x="254" y="101" textAnchor="middle">)</text>
                {(() => {
                  // Qavs ichi: ikki qavs ORASIDAGI maydon, 132 dan 250 gacha.
                  const inner = tk(source.inner)
                  const row = monoRow(inner, 25, 191, 88)
                  return inner.map((tok, i) => (
                    <text
                      key={i}
                      className={'g7-gt-in' + stageOf(tok)}
                      x={row.xs[i]}
                      y="99"
                      textAnchor="middle"
                      style={{ fontSize: row.fs.toFixed(1) + 'px', animationDelay: (0.18 + 0.09 * i).toFixed(2) + 's' }}
                    >
                      {tok}
                    </text>
                  ))
                })()}
              </>
            ) : (
              <>
                <rect className="g7-gt-box" x="16" y="58" width="248" height="60" rx="14" />
                {(() => {
                  // Ramka x = 16, kengligi 248: markaz 140, ichki maydon 224.
                  const plain = tk(source.tokens)
                  const row = monoRow(plain, 25, 140, 224)
                  return plain.map((tok, i) => (
                    <text
                      key={i}
                      className={'g7-gt-in' + stageOf(tok)}
                      x={row.xs[i]}
                      y="97"
                      textAnchor="middle"
                      style={{ fontSize: row.fs.toFixed(1) + 'px', animationDelay: (0.18 + 0.09 * i).toFixed(2) + 's' }}
                    >
                      {tok}
                    </text>
                  ))
                })()}
              </>
            )}
          </g>

          {/* IKKI YO'L. Bitta qavsdan ikkita chiqish -- 1-darsdagi ikki kabel
              kabi. Impuls sahnani tirik qiladi va hech nima aytmaydi. */}
          <path className="g7-gt-wire" d="M270 88 C 300 78, 312 60, 338 48" style={{ animationDelay: '.66s' }} />
          <path className="g7-gt-wire" d="M270 88 C 300 98, 312 116, 338 128" style={{ animationDelay: '.66s' }} />
          <path className="g7-gt-pulse" d="M270 88 C 300 78, 312 60, 338 48" style={{ animationDelay: '1.6s' }} />
          <path className="g7-gt-pulse" d="M270 88 C 300 98, 312 116, 338 128" style={{ animationDelay: '1.6s' }} />

          {/* YUQORI TABLO. Yakunda aynan u bosiladi. */}
          <g
            className={'g7-gt-board' + (canFix ? ' is-fixable' : '') + (fixed ? ' is-fixed' : '')}
            style={{ animationDelay: '.95s' }}
            role={canFix ? 'button' : undefined}
            tabIndex={canFix ? 0 : undefined}
            aria-label={canFix && fix ? t(fix.hint) : undefined}
            onClick={canFix ? doFix : undefined}
            onKeyDown={canFix ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doFix() } } : undefined}
          >
            <rect className="g7-gt-plate" x="340" y="16" width="252" height="60" rx="13" />
            {/* TO'Q MAYDON son ostida. Yetti segmentli raqam yorug' plashka
                ustida KO'RINMAYDI: uning yoqilmagan segmentlari xira bo'ladi,
                yoqilganlari esa oq fonda yo'qoladi (surat 2026-08-15).
                1-darsda ular aynan shuning uchun LCD ustida turadi. */}
            <rect className="g7-gt-lcd" x={lcdX} y="25" width={lcdW} height="30" rx="5" />
            <g key={'ta' + topTokens.join('')}>{rowText(topTokens, 53)}</g>
            <g key={'va' + topValue} className="g7-gt-num" style={{ animationDelay: (fixed ? 0 : 1.55).toFixed(2) + 's' }}>
              <SegNumber value={topValue} cx={numCx} y={28} scale={0.62} cells={cells} />
            </g>
            {canFix ? <rect className="g7-gt-tap" x="342" y="18" width="248" height="56" rx="12" /> : null}
          </g>

          {/* PASTKI TABLO. */}
          <g className="g7-gt-board" style={{ animationDelay: '1.12s' }}>
            <rect className="g7-gt-plate" x="340" y="100" width="252" height="60" rx="13" />
            <rect className="g7-gt-lcd" x={lcdX} y="109" width={lcdW} height="30" rx="5" />
            {rowText(tk(rows[1].tokens), 137)}
            <g className="g7-gt-num" style={{ animationDelay: '1.72s' }}>
              <SegNumber value={rows[1].value} cx={numCx} y={112} scale={0.62} cells={cells} />
            </g>
          </g>

          {/* «Teng emas» ikki son ORASIDA turadi -- 1-darsdagi kabi. Yakunda
              u «teng» ga aylanadi: `key` almashgani uchun qayta chiziladi. */}
          <g key={'sg' + shownSign} className={'g7-gt-ne' + (fixed ? ' is-fixed' : '')} style={{ animationDelay: fixed ? '0s' : '2.1s' }}>
            <circle className="g7-gt-ring" cx={numCx} cy="88" r="19" />
            <text className="g7-gt-netxt" x={numCx} y="96" textAnchor="middle">{shownSign}</text>
          </g>
        </svg>
      </div>
    </div>
  )
}

// ============================================================================
// RideScene -- 2-DARSNING XUK SAHNASI. Yo'l, ikkita safar, ular ustida BITTA
// yozuv: 12 karra a.
//
// Nega yo'l. Darslikning o'zi 2-paragrafni shu misol bilan boshlaydi:
// velosipedchi soatiga o'n ikki kilometr, 2 soatda 24, 3 soatda 36, a soatda
// 12 karra a. O'zgaruvchi shu yerda ko'rinadi: yozuv BITTA, safar esa ko'p.
//
// `tap` -- yakundagi interaktiv. Sahnani bosish yangi safar qo'shadi va
// yozuvni qayta hisoblaydi. Bu YANGI SAVOL emas (§4.2): o'quvchi hech nima
// tanlamaydi, allaqachon bilgan qoidani sahnaga qo'llaydi.
//
// Faqat SVG, rasm fayli yo'q (CLAUDE.md §5).
// ============================================================================
const RIDE = { x0: 58, x1: 566, y: 118, max: 72 }

export function RideScene({ speed = 12, runs = [2, 3], letter = 'a', tap, size }) {
  const [extra, setExtra] = useState([])
  const { x0, x1, y, max } = RIDE
  const at = (km) => x0 + (Math.min(km, max) / max) * (x1 - x0)
  const list = runs.concat(extra)

  const nextVal = tap && tap.values ? tap.values[extra.length] : undefined
  const onTap = () => {
    if (nextVal === undefined) return
    setExtra((prev) => prev.concat(nextVal))
    if (tap.onTap) tap.onTap(nextVal)
  }
  const live = nextVal !== undefined

  const body = (
    <svg viewBox="0 0 620 170" className="g7-scene-svg" aria-hidden="true">
      {/* BITTA YOZUV butun sahna ustida. Sonlar yozuvda EMAS -- ular pastda,
          har safarning tagida. Shuning uchun «bitta yozuv, ko'p qiymat»
          ko'z bilan o'qiladi. */}
      <text x="310" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="30" fontWeight="700" fill={T.ink}>
        {speed}
        <tspan fill={T.stage2} dx="8">&#183;</tspan>
        <tspan fontStyle="italic" dx="8">{letter}</tspan>
      </text>

      {/* YO'L */}
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={T.ink3} strokeWidth="2.4" strokeLinecap="round" />
      {[0, 12, 24, 36, 48, 60].map((km) => (
        <g key={km}>
          <line x1={at(km)} y1={y - 5} x2={at(km)} y2={y + 5} stroke={T.ink3} strokeWidth="1.4" />
          <text x={at(km)} y={y + 24} textAnchor="middle" fontFamily="'Manrope', sans-serif" fontSize="12" fill={T.ink3}>{km}</text>
        </g>
      ))}
      <text x={x1 + 22} y={y + 5} textAnchor="middle" fontFamily="'Manrope', sans-serif" fontSize="12" fill={T.ink3}>km</text>

      {/* SAFARLAR. Har biri o'z bayrog'i, tepasida a ning qiymati, tagida
          bosib o'tilgan masofa. Oxirgisi accent -- «hozir o'zgargan». */}
      {list.map((a, i) => {
        const km = speed * a
        const isLast = i === list.length - 1 && extra.length > 0
        const col = isLast ? T.accent : T.graph
        return (
          <g key={a + '-' + i} className="g7-ride-run" style={{ animationDelay: (i * 0.18) + 's' }}>
            <line x1={at(km)} y1={y} x2={at(km)} y2={y - 46} stroke={col} strokeWidth="2.2" />
            <circle cx={at(km)} cy={y} r="5.5" fill={col} />
            <rect x={at(km) - 30} y={y - 74} width="60" height="28" rx="8" fill={T.paperSolid} stroke={col} strokeWidth="1.6" />
            <text x={at(km)} y={y - 55} textAnchor="middle" fontFamily={MATH_FONT} fontSize="18" fontWeight="700" fill={col}>{km}</text>
            <text x={at(km)} y={y + 44} textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ink2}>
              <tspan fontStyle="italic">{letter}</tspan>
              <tspan dx="4">=</tspan>
              <tspan dx="4">{a}</tspan>
            </text>
          </g>
        )
      })}

    </svg>
  )

  // Bosish belgisi SVG ning ICHIGA kirmaydi -- TapMark HTML elementi.
  // U KELAJAKDAGI safar joyida turadi, mavjudining ustida emas: birinchi
  // qo'yishda belgi 36 ustiga tushib, o'sha safarning bayrog'ini va
  // «a teng 3» yozuvini YOPIB qo'ygandi (surat 2026-08-15).
  // DARS01_HOLAT.md §10.7: belgi TURGAN JOYI muhim, ko'rinishi yetarli emas.
  const hand = live ? (
    <span className="g7-ride-hand" style={{ left: (at(speed * nextVal) / 620) * 100 + '%' }}>
      <TapMark />
    </span>
  ) : null

  const cls = 'g7-scene' + (size === 'hero' ? ' g7-scene-hero' : size === 'mid' ? ' g7-ride-mid' : '')
  if (!tap) return <div className={cls}>{body}</div>
  return (
    <button type="button" className={cls + ' g7-ride-tap'} onClick={onTap} disabled={!live}>
      {body}
      {hand}
    </button>
  )
}

// ============================================================
// ReadViz -- YOZUVNI O'QISH namoyishi (2-ekran, metodist tasdiqladi
// 2026-08-14). To'g'ri javobdan KEYIN chiqadi va javobni YOZUVNING
// O'ZIDA ko'rsatadi -- so'z bilan takrorlamaydi.
//   count   -- har amal belgisi ustida navbat raqami: 1, 2, 3, 4
//   pair    -- belgi va uning IKKI SONI yoritiladi, qolgani xiralashadi
//   bracket -- qavs ichidagi qism yoritiladi, tashqarisi xiralashadi
// ============================================================
export function ReadViz({ tokens, mode, mark }) {
  const isOp = (tok) => ['+', '−', '·', ':'].indexOf(tok) !== -1
  let opNo = 0
  return (
    <div className="g7-rv">
      {tokens.map((tok, i) => {
        const op = isOp(tok)
        if (op) opNo += 1
        let lit = false
        if (mode === 'pair') lit = i >= mark - 1 && i <= mark + 1
        if (mode === 'bracket') lit = i >= mark[0] && i <= mark[1]
        const dim = (mode === 'pair' || mode === 'bracket') && !lit
        return (
          <span
            key={i}
            className={'g7-rv-tok' + stageOf(tok) + (lit ? ' is-lit' : '') + (dim ? ' is-dim' : '')}
            style={{ animationDelay: (i * 0.07).toFixed(2) + 's' }}
          >
            {tok}
            {mode === 'count' && op ? <i className="g7-rv-no">{opNo}</i> : null}
          </span>
        )
      })}
    </div>
  )
}

export function StairsReveal({ items, sweep }) {
  const n = items.length
  const W = 620
  const H = 150
  const stepW = (W - 60) / n
  const stepH = (H - 46) / n
  return (
    <div className="g7-stairs">
      <svg viewBox={'0 0 ' + W + ' ' + H} className="g7-stairs-svg" role="img" aria-label={items.map((x) => (x && x.label) || x).join(' ')}>
        {items.map((x, i) => {
          const xL = 30 + i * stepW
          const yT = 22 + i * stepH
          const tone = x && x.tone ? x.tone : 'off'
          return (
            <g key={i} className={'g7-stair is-' + tone} style={{ animationDelay: (i * 0.45).toFixed(2) + 's' }}>
              {/* Pog'onaning YUZASI va undan pastga tushadigan QIRRASI --
                  ikkalasi birga haqiqiy lestnitsani beradi. */}
              <rect className="g7-stair-top" x={xL} y={yT} width={stepW - 6} height="10" rx="5" />
              {i < n - 1 ? (
                <rect className="g7-stair-riser" x={xL + stepW - 12} y={yT + 8} width="6" height={stepH} rx="3" />
              ) : null}
              {/* Pog'ona yorlig'i: qavs, III, II, I */}
              <text className="g7-stair-lab" x={xL + (stepW - 6) / 2} y={yT - 8} textAnchor="middle">
                {(x && x.label !== undefined ? x.label : x)}
              </text>
            </g>
          )
        })}
        {/* Yozuv pog'onalar bo'ylab pastga tushadi */}
        <circle className="g7-stair-ball" cx={30 + (stepW - 6) / 2} cy="15" r="10" />
      </svg>
      {sweep ? <p className="g7-stairs-sweep">{sweep}</p> : null}
    </div>
  )
}

export function LawReveal({ items, sweep }) {
  return (
    <div className="g7-lawrev">
      {items.map((x, i) => (
        <React.Fragment key={i}>
          {i ? (
            <span className="g7-lawrev-arr" style={{ animationDelay: (i * 0.42 - 0.14).toFixed(2) + 's' }}>
              {'→'}
            </span>
          ) : null}
          {/* Qism O'Z bosqichining rangida yonadi -- darsda yozuvlar shu
              ranglar bilan yozilgan, ya'ni qoida tanish ranglardan yig'iladi.
              Ro'yxat elementi `{ label, tone }` bo'lishi ham mumkin. */}
          <span
            className={'g7-lawrev-chip' + (x && x.tone ? ' is-' + x.tone : '')}
            style={{ animationDelay: (i * 0.42).toFixed(2) + 's' }}
          >
            {x && x.label !== undefined ? x.label : x}
          </span>
        </React.Fragment>
      ))}
      {sweep ? (
        <span className="g7-lawrev-sweep" style={{ animationDelay: (items.length * 0.42).toFixed(2) + 's' }}>
          {sweep}
        </span>
      ) : null}
    </div>
  )
}

// ============================================================
// TwoValues -- ikkita oq kartochka, o'rtasida aylanada «teng emas» belgisi.
// ETALON_7SINF.md §6.5 xuk uchun aynan shu shaklni talab qiladi. Qoida
// ekranida O'SHA blok qaytadan chiqadi: bittasi so'nadi, ikkinchisi yashil
// bo'ladi -- xuk savoli javobini QOIDA ekranida oladi (2 va 3-sinf usuli).
// 390 da kartochkalar bir-birining OSTIGA tushadi (§6.2).
// ============================================================
export function TwoValues({ left, right, dim, ok, sign = '≠' }) {
  const t = useT()
  const card = (d, side) => (
    <div className={'g7-tv' + (dim === side ? ' is-dim' : '') + (ok === side ? ' is-ok' : '')}>
      <span className="g7-tv-cap">{t(d.cap)}</span>
      <span className="g7-tv-val">{d.value}</span>
    </div>
  )
  return (
    <div className="g7-tv-row">
      {card(left, 'left')}
      {/* Belgi HECH QACHON «teng» ga aylanmaydi: sakkiz bilan yigirma qoida
          topilgandan keyin ham teng emas. Yashil rang «qaysi biri QIYMAT»
          ekanini bildiradi, tenglikni emas. Ilgari bu yerda `=` chiqardi --
          matematik jihatdan YOLG'ON edi. */}
      <span className="g7-tv-ne" aria-hidden="true">{sign}</span>
      {card(right, 'right')}
    </div>
  )
}

// ============================================================
// CollapseTrack -- YO'LAK: yozuv BERILGAN TARTIB bo'yicha o'zi yig'iladi.
// Har qadamda juft bir-biriga siljiydi va bitta songa aylanadi.
//
// Bu asbob JAVOB BERILGANDAN KEYIN ishlaydi: 2-ekranda to'g'ri javobdan
// so'ng, 3 va 7-ekranlarda o'quvchi tartibni qo'ygandan so'ng. Shuning
// uchun u javobni ochib qo'ymaydi -- allaqachon ma'lum narsani KO'RSATADI.
//
// Kadrlar tartibdan HISOBLANADI, qo'lda yozilmaydi: bitta yo'lak istalgan
// yozuv va istalgan tartib uchun ishlaydi.
// ============================================================
const interleave = (nums, ops, lang) =>
  nums.flatMap((x, i) => (i ? [ops[i - 1], fmtNum(x, lang)] : [fmtNum(x, lang)]))

export const collapseFrames = (nums, ops, order, lang) => {
  const frames = []
  const n = nums.slice()
  const live = ops.map((op, i) => ({ op, i }))
  frames.push({ toks: interleave(n, live.map((l) => l.op), lang) })
  order.forEach((opIdx) => {
    const pos = live.findIndex((x) => x.i === opIdx)
    if (pos === -1) return
    // Belgilar ro'yxatida son 2k o'rinda, amal 2k+1 o'rinda turadi.
    frames.push({ toks: interleave(n, live.map((l) => l.op), lang), merge: [pos * 2, pos * 2 + 2] })
    const val = applyOp(n[pos], live[pos].op, n[pos + 1])
    n.splice(pos, 2, val)
    live.splice(pos, 1)
    frames.push({ toks: interleave(n, live.map((l) => l.op), lang), born: pos * 2 })
  })
  return frames
}

export function CollapseTrack({ nums, ops, order, label, tone, delay = 0, stepMs = 520, onDone }) {
  const lang = useLang()
  const frames = useMemo(() => collapseFrames(nums, ops, order, lang), [nums, ops, order, lang])
  const [i, setI] = useState(0)
  const [started, setStarted] = useState(delay === 0)

  useEffect(() => {
    if (started) return undefined
    const tmr = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(tmr)
  }, [started, delay])

  useEffect(() => {
    if (!started || i >= frames.length - 1) return undefined
    const tmr = setTimeout(() => setI((v) => v + 1), stepMs)
    return () => clearTimeout(tmr)
  }, [started, i, frames.length, stepMs])

  const f = frames[started ? i : 0]
  const done = i >= frames.length - 1

  useEffect(() => {
    if (done && onDone) onDone()
  }, [done, onDone])

  return (
    <div className={'g7-track-row' + (tone ? ' is-' + tone : '') + (done ? ' is-done' : '')}>
      <span className="g7-track-cap">{label}</span>
      <span className="g7-track-expr">
        {f.toks.map((tok, k) => (
          <span
            key={i + '-' + k}
            className={
              'g7-film-tok' + stageOf(tok) +
              (f.merge && f.merge[0] === k ? ' is-mergeL' : '') +
              (f.merge && f.merge[1] === k ? ' is-mergeR' : '') +
              (f.born === k ? ' is-born' : '')
            }
          >
            {tok}
          </span>
        ))}
      </span>
    </div>
  )
}

// ============================================================
// CollapseFilm -- TUSHUNTIRISH KADRLARI. Metodist qarori 2026-08-13:
// 3-7-ekranlarda tushuntirish EKRANDA ko'rinishi kerak, ovozda emas.
//
// Har kadrda ikkita son BIR-BIRIGA SILJIYDI va bitta songa aylanadi -- ya'ni
// harakat aynan MATEMATIK o'zgarishni ko'rsatadi (§7.1). Kengligi emas,
// faqat `transform` o'zgaradi: 390 da yozuv kesilmasin.
//
// Kadrni OVOZ boshqaradi (`useNarratedSteps`, §7.2): bo'lak tugagach keyingi
// kadr keladi; ovoz o'chiq bo'lsa -- taymer bo'yicha. Pastdagi nuqtalar bilan
// o'quvchi orqaga qaytishi mumkin (6-sinf naqshi).
//
// `frames[k]`:
//   tokens -- ekrandagi belgilar ro'yxati
//   merge  -- [chap, o'ng] qo'shiluvchi indekslari: ular BIR-BIRIGA siljiydi
//   born   -- shu kadrda TUG'ILGAN son indeksi: u paydo bo'ladi
//   cap    -- kadr izohi (SO'Z bilan, matematik yozuv emas)
// ============================================================
export function CollapseFilm({ frames, audio, onDone, hold = false }) {
  const t = useT()
  const caps = useMemo(() => frames.map((f) => t(f.cap)), [frames, t])
  const voiced = useNarratedSteps(audio, caps)
  const [manual, setManual] = useState(null)

  // POL. `useNarratedSteps` ovoz bo'laklariga ergashadi, TTS ishlamasa esa
  // navbat BIR ZUMDA oxirigacha uchib ketadi va kino umuman ko'rinmay qoladi
  // (2026-08-13 da aynan shunday bo'ldi: 5-ekran darrov asbobni ko'rsatdi).
  // Shuning uchun kadr sekundiga bir martadan tez ALMASHMAYDI. Bu §7.2 dagi
  // qorovulning teskarisi: u kechikishdan, bu esa SHOSHILISHDAN saqlaydi.
  const target = Math.min(voiced, frames.length - 1)
  const [gate, setGate] = useState(0)
  useEffect(() => {
    if (gate >= target) return undefined
    const tmr = setTimeout(() => setGate((g) => (g < target ? g + 1 : g)), 1500)
    return () => clearTimeout(tmr)
  }, [gate, target])

  const idx = manual === null ? gate : manual
  const last = gate >= frames.length - 1

  useEffect(() => {
    if (last && onDone) onDone()
  }, [last, onDone])

  const f = frames[idx]

  return (
    <>
      <div className="g7-panel g7-panel-paper g7-film">
        <div className="g7-film-row">
          {f.tokens.map((tok, i) => {
            const isL = f.merge && f.merge[0] === i
            const isR = f.merge && f.merge[1] === i
            const isBorn = f.born === i
            const cls =
              'g7-film-tok' + stageOf(tok) +
              (isL ? ' is-mergeL' : '') +
              (isR ? ' is-mergeR' : '') +
              (isBorn ? ' is-born' : '')
            return (
              <span key={idx + '-' + i} className={cls}>
                {tok}
              </span>
            )
          })}
        </div>
      </div>

      {/* Izoh SO'Z bilan. Balandligi oldindan band: kadr almashganda ekran
          sakramaydi. */}
      <Slot mh={44}>
        <p className="g7-film-cap" key={idx}>{caps[idx]}</p>
      </Slot>

      {/* Nuqtalar: o'quvchi kadrga qaytishi mumkin. Oldinga o'tkazmaydi --
          kino o'zi ketadi, aks holda o'quvchi tushuntirishni «tez o'tkazib»
          yuborardi. */}
      {frames.length > 1 ? (
        <div className="g7-clip-bar">
          {frames.map((_, n) => (
            <button
              key={n}
              type="button"
              className={'g7-clip-dot' + (n === idx ? ' g7-clip-dot-on' : '') + (n < idx ? ' g7-clip-dot-past' : '')}
              onClick={() => { if (n <= gate) setManual(n) }}
              aria-label={String(n + 1)}
            />
          ))}
          {manual !== null ? (
            <button type="button" className="g7-clip-replay" onClick={() => setManual(null)} aria-label="now">{'▸'}</button>
          ) : null}
        </div>
      ) : null}
      {hold ? null : null}
    </>
  )
}

// ============================================================
// HistoryTape -- BOSILGAN YO'L. Har bajarilgan qadam kichik plashka qoldiradi:
// «6 : 3 -> 2». Ekran oxirida BUTUN yo'l ko'rinib turadi.
//
// Ikki vazifasi bor. Birinchi -- usul bajarilgach ekran BO'SHAB qolmaydi.
// Ikkinchi va muhimi -- 8-ekranda ikkala usulning lentasi yonma-yon qo'yiladi
// va ular BIR XIL ekani ko'rinadi: qoida shu yerdan chiqadi.
//
// Belgi bosqich rangida: lenta ham o'sha bog'lovchi rangni davom ettiradi.
// ============================================================
export function HistoryTape({ items, label }) {
  const t = useT()
  if (!items || !items.length) return null
  return (
    <div className="g7-tape">
      {label ? <span className="g7-tape-cap">{t(label)}</span> : null}
      <div className="g7-tape-row">
        {items.map((it, i) => (
          <span key={i} className="g7-tape-chip" style={{ animationDelay: (i * 0.06).toFixed(2) + 's' }}>
            {String(it).split(/(\s[·:+−]\s)/).map((part, k) => (
              <span key={k} className={stageOf(part.trim())}>{part}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// SolutionSteps -- O'QITUVCHI YECHIMI. Metodist qarori 2026-08-13 (surat:
// darslikdagi to'liq yechim). Har qator OLDINGISIDAN kelib chiqadi, yonida
// esa o'qituvchining TIRIK gapi turadi -- «avval qavs ichini hisoblaymiz».
//
// Qatorlar BIRMA-BIR o'sadi, pachka bo'lib chiqmaydi (1-4-sinf naqshi).
// O'quvchi O'Z harakatini qilgandan KEYIN ishga tushadi: shuning uchun bu
// javobni ochish emas, allaqachon olingan javobning YO'LINI ko'rsatish (§8.1).
//
// Atamalar so'zma-so'z (§3), izoh esa jonli tilda -- metodist 2026-08-13.
// ============================================================
// `rowH` -- bitta qatorning balandligi. Ramka BUTUN yechim uchun joyni
// BIRINCHI soniyadan band qiladi va qator qo'shilganda O'SMAYDI (§6.1,
// metodist talabi 2026-08-13). Aks holda ekran har qatorda sakraydi va
// budjetdan oshib ketishi mumkin.
export function SolutionSteps({ lines, label, stepMs = 1250, rowH = 44, onDone }) {
  const t = useT()
  const [n, setN] = useState(1)
  const last = n >= lines.length

  useEffect(() => {
    if (last) { if (onDone) onDone(); return undefined }
    const tmr = setTimeout(() => setN((v) => v + 1), stepMs)
    return () => clearTimeout(tmr)
  }, [n, last, stepMs, onDone])

  return (
    <div className="g7-panel g7-panel-paper g7-sol" style={{ minHeight: lines.length * rowH + (label ? 26 : 0) }}>
      {label ? <span className="g7-sol-cap">{t(label)}</span> : null}
      {lines.slice(0, n).map((ln, i) => (
        <div key={i} className="g7-sol-row">
          {/* Amal belgilari BOSQICH rangida: yozuvda ko'z avval AMALGA tushadi,
              songa emas -- mavzu aynan amallar tartibi haqida. Ranglar butun
              darsdagi bilan bir xil (metodist qarori 2026-08-13). */}
          <span className="g7-sol-expr">
            {String(ln.expr).split(' ').map((tok, k) => (
              <span key={k} className={'g7-sol-tok' + stageOf(tok) + (tok === '(' || tok === ')' ? ' is-par' : '')}>
                {tok}
              </span>
            ))}
          </span>
          <span className="g7-sol-say">{t(ln.say)}</span>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// NumberLineTracks -- SON O'QIDA ikki yo'l. 7-ekran uchun (metodist qarori
// 2026-08-13): «bitta bosqich ichida chapdan o'ngga» ni SO'Z bilan emas,
// HARAKAT bilan ko'rsatish.
//
// Yuqorida qoida bo'yicha: nuqta 20 dan 5 ga ORQAGA, so'ng 3 ga OLDINGA -- 18.
// Pastda esa «avval qo'shish»: 5 va 3 qo'shilib 8 bo'ladi, nuqta 8 ga orqaga
// ketadi -- 12. Ikki nuqta boshqa joyda TO'XTAYDI, va buni ko'rish uchun
// hech qanday izoh kerak emas.
//
// Javobni ochmaydi: o'quvchi 7-ekranda tartibni O'ZI qo'ygandan keyin
// chiziladi (§8.1).
// ============================================================
// `manual` -- sakrashni TAYMER emas, O'QUVCHI boshqaradi: u chiziqni bosadi
// va keyingi sakrash chiziladi. Ikki sabab. Birinchi -- kontrakt: qadamni
// taymer yetaklashi mumkin emas (ETALON_7SINF.md §7). Ikkinchi -- 7-ekranda
// o'quvchi javob bergandan KEYIN faqat tomosha qilardi, ya'ni darsning
// eng muhim xulosasi uning qo'lidan chiqib ketardi (metodist 2026-08-14).
export function NumberLineTracks({ from = 10, to = 22, tracks, audio, stepMs = 2200, manual, prompt }) {
  const t = useT()
  const fx = useAnswerFx(audio)
  // BOSQICHMA-BOSQICH ochilish (metodist qarori 2026-08-13). Ilgari hamma
  // yoylar deyarli birdan chiqardi va o'quvchi harakatni ko'rib ulgurmasdi.
  const total = tracks.reduce((n, tr) => n + tr.jumps.length + 1, 0)
  const [tick, setTick] = useState(manual ? 1 : 0)
  useEffect(() => {
    if (manual) return undefined
    if (tick >= total) return undefined
    const tmr = setTimeout(() => setTick((v) => v + 1), stepMs)
    return () => clearTimeout(tmr)
  }, [tick, total, stepMs, manual])
  const done = tick >= total
  const advance = () => {
    if (!manual || done) return
    fx.tap()
    setTick((v) => v + 1)
  }
  // Nechta element ochilgani: yo'lak boshlanishi + har sakrash.
  let seen = 0
  const W = 620
  const pad = 44
  const x = (v) => pad + ((v - from) / (to - from)) * (W - 2 * pad)
  const ticks = []
  for (let v = from; v <= to; v += 2) ticks.push(v)

  return (
    <>
    {/* TURTKI. Metodist 2026-08-14: topshiriqdan OLDIN o'quvchini ekranga
        tegishga undash kerak. Ilgari bu yerda faqat pastdagi «Bosing»
        belgisi turardi -- ikkita yo'lakdan KEYIN, ya'ni ko'z unga
        yetmasdi va chiziq shunchaki turaverardi.
        Endi taklif TEPADA, sahnaning o'zi esa chaqnaydi (besh marta,
        keyin tinchiydi -- pulsatsiya cheksiz emas). */}
    {manual && !done ? <Ask kind="task" tight>{prompt ? t(prompt) : null}</Ask> : null}
    <div
      className={'g7-nl' + (manual && !done ? ' is-tappable' : '') + (manual && tick <= 1 ? ' is-inviting' : '')}
      role={manual && !done ? 'button' : undefined}
      tabIndex={manual && !done ? 0 : undefined}
      onClick={manual ? advance : undefined}
      onKeyDown={manual && !done ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance() } } : undefined}
    >
      {/* BOSISH STIKERI: tegish belgisi birinchi bosishgacha uradi. */}
      {manual && tick <= 1 ? <TapMark /> : null}
      {tracks.map((tr, i) => {
        const base = seen
        seen += tr.jumps.length + 1
        const shownJumps = Math.max(0, Math.min(tr.jumps.length, tick - base))
        const rowOn = tick > base - 1
        if (!rowOn) return <div key={i} className="g7-nl-row is-wait" />
        return (
        <div key={i} className="g7-nl-row">
          <span className="g7-nl-cap">{t(tr.cap)}</span>
          <svg viewBox={'0 0 ' + W + ' 74'} className="g7-nl-svg" role="img" aria-label={String(tr.end)}>
            <line className="g7-nl-axis" x1={pad} y1="52" x2={W - pad} y2="52" />
            {ticks.map((v) => (
              <g key={v}>
                <line className="g7-nl-tick" x1={x(v)} y1="47" x2={x(v)} y2="57" />
                <text className="g7-nl-num" x={x(v)} y="70" textAnchor="middle">{v}</text>
              </g>
            ))}
            {tr.jumps.slice(0, shownJumps).map((j, k) => {
              const x1 = x(j.from)
              const x2 = x(j.to)
              const mid = (x1 + x2) / 2
              const back = j.to < j.from
              // Yoyning BALANDLIGI navbat bo'yicha o'zgaradi: ikkita sakrash
              // bir xil balandlikda bo'lsa, ular ustma-ust tushadi va yorliqlar
              // aralashib ketadi (metodist surati 2026-08-13).
              const apex = k === 0 ? 12 : 26
              // O'Q UCHI harakat YO'NALISHINI ko'rsatadi: orqaga -- chapga,
              // oldinga -- o'ngga. Busiz ikkala yoy bir xil ko'rinadi va
              // «orqaga qadam, oldinga qadam» degan ma'no ekranda yo'qoladi.
              // Uch aynan BORIB TO'XTAGAN nuqtada turadi va harakat tomonga
              // qaraydi. Ilgari orqaga va oldinga uchun bir xil shakl
              // chizilardi va yo'nalish o'qilmasdi (metodist surati).
              const dir = x2 >= x1 ? 1 : -1
              const head = 'M' + x2 + ' 48 l ' + (-9 * dir) + ' -5 l 0 10 z'
              return (
                <g key={k} className="g7-nl-jump">
                  <path
                    className={'g7-nl-arc' + (back ? ' is-back' : ' is-fwd')}
                    d={'M' + x1 + ' 48 Q ' + mid + ' ' + apex + ' ' + x2 + ' 48'}
                  />
                  <path className={'g7-nl-head' + (back ? ' is-back' : ' is-fwd')} d={head} />
                  <text className="g7-nl-lab" x={mid} y={apex + 2} textAnchor="middle">{j.label}</text>
                </g>
              )
            })}
            {shownJumps >= tr.jumps.length ? (
              <>
                <circle className="g7-nl-dot" cx={x(tr.end)} cy="52" r="7" />
                <text className="g7-nl-end" x={x(tr.end)} y="38" textAnchor="middle">{tr.end}</text>
              </>
            ) : (
              <circle className="g7-nl-dot is-start" cx={x(tr.jumps[0].from)} cy="52" r="7" />
            )}
          </svg>
        </div>
        )
      })}
      {/* Bosish nishoni chiziqning O'ZIDA emas, pastida: sahna bosiladi,
          belgi esa qayerga bosishni aytadi. Hamma sakrash chizilgach
          belgi yo'qoladi. */}
      {manual ? <CallToAct kind="tap" done={done} /> : null}
    </div>
    </>
  )
}

export { UI as TOOL_UI }

// ============================================================================
// BuildValue -- O'QUVCHI YOZUVNI O'ZI YIG'ADI (amaliyot 5-tipi,
// PODXOD_7SINF.md §8 «O'zi yig'adi»).
//
// NEGA KERAK. Sinfning qolgan asboblari YOZUVNI beradi va QIYMATNI so'raydi.
// Bu asbob teskari ishlaydi: qiymat berilgan, yozuvni o'quvchi yig'adi.
// Shu sababli to'g'ri javob BITTA emas -- va aynan shuning uchun asbob
// javobni SAQLAMAYDI. U o'quvchi yig'gan yozuvning qiymatini hisoblaydi.
//
// O'LCHAGICH -- NAZORATCHI, ORACLE EMAS (etalon §8.1). U o'quvchining O'Z
// yozuvini o'qiydi: nima yig'ilgan bo'lsa, qiymati shu. Javobni u aytmaydi
// va aytolmaydi ham, chunki javob ko'p. Har plitka bosilganda son QAYTA
// hisoblanadi: o'quvchi bittasi ikkinchisiga qanday bog'liqligini KO'RADI --
// DINAMIKA_VA_ILLUSTRATSIYA.md §1 dagi «sovariatsiya» roli.
//
// PLITKA BIR MARTA ISHLATILADI. To'plam chegaralangan bo'lsa, javobni
// tasodifan bosib topib olish mumkin emas: har plitka yozuvda o'z o'rnini
// talab qiladi.
//
//   target      -- kerakli qiymat (son)
//   tiles       -- [{ id, label, kind: 'num' | 'op' | 'open' | 'close' }]
//   needBracket -- qavssiz yozuv qabul qilinmaydi (qizil daraja)
//   hints       -- urinishlar bo'yicha O'SADIGAN yordam (§8.4). Massiv:
//                  [birinchi xato, ikkinchi, uchinchi]. Javobni ochmaydi.
//   bracketHint -- qavs talab qilingan, lekin qo'yilmagan holat uchun
//   okNote      -- to'g'ri javobdan keyingi izoh: QAYSI qoida ishlagani
// ============================================================================
const BV_PREC = { '·': 2, ':': 2, '+': 1, '−': 1 }

// Yig'ilgan yozuvni hisoblaydi. Yozuv hali tugallanmagan bo'lsa null
// qaytaradi -- bu «xato» emas, «hali yozuv emas» degani. Shuning uchun
// o'lchagichda shu holatda chiziqcha turadi, xato belgisi emas.
export const evalSeq = (items) => {
  const out = []
  const ops = []
  let expectNum = true
  const apply = () => {
    const op = ops.pop()
    const b = out.pop()
    const a = out.pop()
    if (op === undefined || a === undefined || b === undefined) return false
    if (op === '+') { out.push(a + b); return true }
    if (op === '−') { out.push(a - b); return true }
    if (op === '·') { out.push(a * b); return true }
    if (op === ':') {
      if (b === 0) return false
      out.push(a / b)
      return true
    }
    return false
  }
  for (let i = 0; i < items.length; i += 1) {
    const it = items[i]
    if (!it) return null
    if (it.kind === 'num') {
      if (!expectNum) return null
      out.push(Number(it.value !== undefined ? it.value : it.label))
      expectNum = false
    } else if (it.kind === 'op') {
      if (expectNum) return null
      while (ops.length && BV_PREC[ops[ops.length - 1]] >= BV_PREC[it.label]) {
        if (!apply()) return null
      }
      ops.push(it.label)
      expectNum = true
    } else if (it.kind === 'open') {
      if (!expectNum) return null
      ops.push('(')
    } else if (it.kind === 'close') {
      if (expectNum) return null
      while (ops.length && ops[ops.length - 1] !== '(') {
        if (!apply()) return null
      }
      if (ops.pop() !== '(') return null
      expectNum = false
    } else return null
  }
  if (expectNum) return null
  while (ops.length) {
    if (ops[ops.length - 1] === '(') return null
    if (!apply()) return null
  }
  if (out.length !== 1) return null
  return out[0]
}

// Bosqich rangi -- sinfning tili (START_GRADE7.md §3): ikkinchi bosqich
// ko'k, birinchi bosqich binafsha, qavs feruza. Son oddiy siyoh rangida.
const bvTone = (it) => {
  if (!it) return T.ink
  if (it.kind === 'open' || it.kind === 'close') return T.graph
  if (it.label === '·' || it.label === ':') return T.stage2
  if (it.label === '+' || it.label === '−') return T.stage1
  return T.ink
}

// ============================================================================
// BuildValue -- O'QUVCHI YOZUVNI O'ZI YIG'ADI (amaliyot 5-tipi).
//
// EKRANNING TARTIBI (metodist qarori 2026-08-20):
//   1. SAVOL yuqorida;
//   2. BO'SH MAYDON -- yozuv shu yerda yig'iladi;
//   3. KARTALAR pastda: sonlar, amal belgilari VA QAVSLAR. Hammasini
//      o'quvchi o'zi qo'yadi.
// Yon ustundagi o'lchagich OLIB TASHLANDI.
//
// QIYMAT FAQAT «TEKSHIRISH» DAN KEYIN KO'RINADI. Jonli o'lchagich topshiriqni
// «sonni tutib olish» ga aylantirardi: kartalarni aylantirib, son maqsadga
// tenglashishini kutish yetardi -- o'ylash kerak emasdi (etalon §8.1, asbob
// NAZORATCHI, oracle emas). To'g'ri javobda javob ko'rsatiladi, xatoda esa
// O'QUVCHI YIG'GAN yozuvning qiymati.
//
// KARTA ISTALGAN JOYGA QO'YILADI. Bu eng muhim qism va u ikkinchi urinishda
// to'g'ri qilindi. Ilgari yozuv faqat OXIRIDAN yig'ilardi, ya'ni «(7 + 3) · 2»
// uchun qavsni YETTIDAN OLDIN bosish kerak edi. Odam esa avval «7 + 3» ni
// yozadi, keyin uni qavsga olmoqchi bo'ladi -- va olib bo'lmasdi, hammasini
// o'chirish kerak edi. Metodist aynan shu yerda «javob topilmaydi» dedi.
// Endi yozuvda TIRQISHLAR bor: tirqishni bosib joyni tanlaysiz, keyin kartani
// bosasiz -- u shu yerga tushadi.
//
//   target      -- kerakli qiymat
//   tiles       -- [{ id, label, kind: 'num' | 'op' | 'open' | 'close' }]
//   useAll      -- hamma karta ishlatilishi shart
//   needBracket -- qavssiz yozuv qabul qilinmaydi
//   wrongs      -- [{ value, bracket?, hint, tag }] razbor AYNAN shu yo'lga
//   hints       -- urinishlar bo'yicha o'sadigan zaxira yordam (§8.4)
//   okNote      -- to'g'ri javobdan keyingi izoh: qaysi qoida ishlagani
// ============================================================================
// `given`     -- yozuv ustida turadigan berilgan satrlar: [{ text, bad }].
//               `bad: true` -- chuqur satr (chet kishining xato qadami).
// `answerSeq`  -- javob QIYMAT emas, YOZUVNING O'ZI: karta yorliqlari massivi.
//               «Xato satrni tuzatib yozing» janri shunday tekshiriladi:
//               90 − 4 · 2 va 90 − 8 qiymati bir xil (82), lekin KEYINGI
//               qator faqat birinchisi. Qiymat bo'yicha tekshirish ikkinchisini
//               ham qabul qilardi, ya'ni qadam tashlab ketilishini sezmasdi.
export function BuildValue({
  target, tiles, needBracket, useAll, prompt, promptCap, hints, wrongs,
  bracketHint, okNote, given, answerSeq, onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const lang = useLang()
  const fx = useAnswerFx(audio)
  const [seq, setSeq] = useState([])
  const [pos, setPos] = useState(0)      // karta QO'YILADIGAN joy
  const [tries, setTries] = useState(0)
  const [hint, setHint] = useState(null)
  const [solved, setSolved] = useState(false)
  const [shake, setShake] = useState(0)
  const [shown, setShown] = useState(null)

  const byId = useMemo(() => {
    const map = {}
    tiles.forEach((x) => { map[x.id] = x })
    return map
  }, [tiles])

  const items = seq.map((id) => byId[id])
  const value = evalSeq(items)
  const hasBr = items.some((x) => x && x.kind === 'open')
  const left = tiles.length - seq.length
  const complete = !useAll || left === 0
  // `answerSeq` rejimida yozuv hisoblanmasligi ham mumkin (masalan yarim
  // qator), lekin tekshirishga ruxsat beriladi: javob qiymat emas, YOZUV.
  const ready = (answerSeq ? seq.length > 0 : value !== null) && complete && !solved

  const put = (id) => {
    if (solved || disabled) return
    fx.tap()
    setSeq((prev) => prev.slice(0, pos).concat(id, prev.slice(pos)))
    setPos((p) => p + 1)
    setHint(null)
    setShown(null)
  }
  // «Bitta orqaga» -- kursordan OLDINGI belgini o'chiradi (klaviaturadagi
  // backspace kabi), oxirgisini emas: kursor o'rtada turgan bo'lishi mumkin.
  const undo = () => {
    if (solved || disabled || pos === 0) return
    fx.tap()
    setSeq((prev) => prev.slice(0, pos - 1).concat(prev.slice(pos)))
    setPos((p) => Math.max(0, p - 1))
    setHint(null)
    setShown(null)
  }
  const seqLabels = items.map((x) => (x ? x.label : ''))
  const seqOk = !!answerSeq && seqLabels.join('|') === answerSeq.join('|')

  const check = () => {
    if (!ready) return
    setShown(answerSeq ? null : value)
    if (answerSeq ? seqOk : (value === target && (!needBracket || hasBr))) {
      setSolved(true)
      fx.right()
      if (onStep) onStep('ok')
      if (onSolved) onSolved({ correct: true, attempts: tries + 1, tags: [], value })
      return
    }
    const n = tries + 1
    setTries(n)
    setShake((s) => s + 1)
    // Razbor QAVSGA HAM qaraydi: bir xil qiymat qavssiz ham, ortiqcha qavs
    // bilan ham chiqadi, sabab esa har xil. `bracket: true|false` shuni
    // ajratadi; ko'rsatilmasa, ikkisiga ham to'g'ri keladi.
    const line = seqLabels.join(' ')
    const byValue = (wrongs || []).find((x) => (
      (x.line !== undefined && x.line === line)
      || (x.line === undefined && x.value === value && (x.bracket === undefined || x.bracket === hasBr))
    ))
    const list = hints || []
    const h = (needBracket && !hasBr && bracketHint)
      ? bracketHint
      : (byValue ? byValue.hint : (list[Math.min(n - 1, list.length - 1)] || null))
    setHint(h)
    fx.wrong(h)
  }

  // Tirqish: karta shu yerga tushadi. Yozuv bo'sh bo'lsa ham bittasi turadi.
  const slot = (i) => (
    <button
      key={'s' + i}
      type="button"
      className={'g7-bv-slot' + (pos === i ? ' is-at' : '')}
      onClick={() => { if (!solved && !disabled) { fx.tap(); setPos(i) } }}
      disabled={solved || disabled}
      aria-label={t(UI.bvHere)}
      data-slot={i}
    />
  )

  return (
    <>
      <Ask kind="task" tight cap={promptCap ? t(promptCap) : undefined}>{prompt ? t(prompt) : null}</Ask>

      {/* BERILGAN SATRLAR. Chet kishining yechimi: birinchi qator -- asl
          yozuv, keyingisi -- xato qadam. Ular O'QILADI, bosilmaydi. */}
      {given && given.length ? (
        <div className="g7-panel g7-panel-quiet" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {given.map((row, i) => (
            <div
              key={i}
              className="g7-expr g7-expr-row"
              style={{ fontFamily: MATH_FONT, color: row.bad ? T.tip : T.ink2, fontWeight: row.bad ? 800 : 700 }}
            >
              <Fx>{typeof row.text === 'string' ? row.text : t(row.text)}</Fx>
            </div>
          ))}
        </div>
      ) : null}

      {/* BO'SH MAYDON. Balandligi boshidan band: yozuv o'sganda maydon
          sakramaydi, va yechilgan holat ham shu joyga sig'adi (§6.1). */}
      <div
        className="g7-panel g7-panel-paper g7-bv-field"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 104 }}
      >
        <div
          key={'sh' + shake}
          className="g7-expr g7-expr-mid"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: MATH_FONT,
            ...(shake ? { animation: 'g7-shake .3s ease' } : null),
          }}
        >
          {items.length === 0 ? (
            <>
              {slot(0)}
              {/* `white-space: normal` MAJBURIY: `.g7-expr` da nowrap turadi va
                  bu proza satri 390px da jimgina kesilardi. */}
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 600,
                  color: T.ink3, whiteSpace: 'normal', textAlign: 'center', maxWidth: '100%',
                }}
              >
                {t(UI.bvEmpty)}
              </span>
            </>
          ) : (
            <>
              {items.map((it, i) => (
                <React.Fragment key={i}>
                  {slot(i)}
                  {/* Belgining O'ZI ham nishon: bosilsa, kursor uning oldiga
                      ko'chadi. Tirqish tor, belgi esa katta -- barmoq bilan
                      shunisi qulay. */}
                  <button
                    type="button"
                    className="g7-pop g7-bv-tok"
                    style={{ color: bvTone(it), fontWeight: 800 }}
                    disabled={solved || disabled}
                    onClick={() => { fx.tap(); setPos(i) }}
                  >
                    {it.label}
                  </button>
                </React.Fragment>
              ))}
              {slot(items.length)}
            </>
          )}
        </div>

        {/* NATIJA SATRI. Tekshirishdan KEYIN paydo bo'ladi va joyi boshidan
            band. To'g'ri javobda -- javob, xatoda -- O'QUVCHI YIG'GAN son. */}
        <div style={{ minHeight: 30, display: 'flex', alignItems: 'center', gap: 8 }}>
          {shown !== null ? (
            <>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.ink3 }}>
                {solved ? t(UI.bvIsRight) : t(UI.bvYours)}
              </span>
              <b
                key={'v' + shown}
                className="g7-snap"
                style={{
                  fontFamily: MATH_FONT, fontSize: 'var(--g7-num)', fontWeight: 800,
                  lineHeight: 1, color: solved ? T.ok : T.tip,
                }}
              >
                {fmtNum(shown, lang)}
              </b>
            </>
          ) : null}
        </div>
      </div>

      {/* KARTALAR PASTDA. Yechilgach ular va tugmalar yo'qoladi, o'rniga izoh
          keladi (§6.1: yangi qadam avvalgisini almashtiradi). */}
      {!solved ? (
        <>
          <div className="g7-options g7-options-dense" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {tiles.map((tile) => {
              const used = seq.indexOf(tile.id) !== -1
              return (
                <button
                  key={tile.id}
                  type="button"
                  className={'g7-opt g7-part' + (used ? ' g7-dim' : '')}
                  disabled={used || disabled}
                  style={{ color: bvTone(tile) }}
                  onClick={() => put(tile.id)}
                >
                  {tile.label}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {useAll ? (
              <span style={{ fontSize: 11.5, fontWeight: 700, color: left ? T.tip : T.ok }}>
                {t(UI.bvLeft)} {left}
              </span>
            ) : null}
            {/* «Qaytadan» tugmasi YO'Q (metodist qarori 2026-08-20): u kerak
                emas, «Bitta orqaga» kursordan oldingi belgini oladi va
                yozuvni bosqichma-bosqich tozalash uchun yetarli. */}
            <Btn tone="soft" onClick={undo} disabled={disabled || pos === 0}>{t(UI.bvUndo)}</Btn>
            <Btn onClick={check} disabled={!ready || disabled} ready={ready} mark="check">{t(UI.check)}</Btn>
          </div>
        </>
      ) : null}

      <Slot mh={58}>
        {solved && okNote ? <Feedback show ok>{t(okNote)}</Feedback> : null}
        {!solved && hint ? <Feedback show ok={false}>{t(hint)}</Feedback> : null}
      </Slot>
    </>
  )
}

// ============================================================================
// SortZones -- YOZUVLARNI ZONALARGA AJRATISH.
//
// Nega kerak. «Belgini tanish» janri boshqa sinflarda `choice` bilan
// beriladi: to'rt variant, bittasi to'g'ri. 7-sinfda bu yaramaydi (etalon
// §1.1). Bu asbob o'sha janrni boshqa yo'l bilan beradi: ekranda ALTI yozuv
// va uchta zona, va o'quvchi HAR BIRINI joylashtiradi. Bitta yozuvni tanish
// emas, oltitasini hisoblash kerak.
//
// BOSISH BILAN ISHLAYDI, tortish bilan emas (3-sinf kanoni §3.6: telefonda
// barmoq zonadan chetga tushadi va tortish bilan topshiriq o'tolmaydigan
// bo'lib qoladi). Naqsh: kartani bos -- tanlanadi; zonani bos -- tushadi.
// Zonadagi kartani bosish: agar qo'lda karta bo'lsa, u shu zonaga tushadi;
// bo'sh bo'lsa -- bosilgan karta qo'lga qaytadi.
//
// HAMMASI YOKI HECH NARSA (amaliyot qoidasi): yarim to'g'ri javob butunlay
// noto'g'ri hisoblanadi, xato joylashganlar belgilanadi.
//
//   zones: [{ id, label }]              -- uchtadan ko'p emas (390px)
//   items: [{ id, text, zone }]         -- oltitadan ko'p emas
//   wrongs: [{ key?, hint, tag }]       -- `key` -- xato joylashganlar id lari
// ============================================================================
export function SortZones({ zones, items, prompt, promptCap, wrongs, okNote, onSolved, onStep, disabled, audio }) {
  // Kartochkalar ham aralashadi (§8.3). Ilgari ular ZONA bo'yicha guruh
  // bo'lib turardi -- 12 ekrandan 8 tasida «birinchi yarmi chapga» degan
  // qoida javob berardi, mazmunga qaramasdan.
  items = useShuffled(items)
  const t = useT()
  const fx = useAnswerFx(audio)
  const [place, setPlace] = useState({})   // itemId -> zoneId
  const [picked, setPicked] = useState(null)
  const [checked, setChecked] = useState(false)
  const [tries, setTries] = useState(0)
  const [hint, setHint] = useState(null)
  const [solved, setSolved] = useState(false)

  const pool = items.filter((it) => !place[it.id])
  const all = items.every((it) => place[it.id])
  const wrongIds = items.filter((it) => place[it.id] && place[it.id] !== it.zone).map((it) => it.id)

  const tapItem = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    if (solved || disabled) return
    fx.tap()
    setHint(null)
    setChecked(false)
    // Zonadagi kartani bosish: qo'lda karta bo'lsa -- u shu zonaga tushadi.
    if (place[id] && picked) {
      const zone = place[id]
      setPlace((prev) => ({ ...prev, [picked]: zone }))
      setPicked(null)
      return
    }
    if (place[id]) {
      setPlace((prev) => { const next = { ...prev }; delete next[id]; return next })
      setPicked(null)
      return
    }
    setPicked(picked === id ? null : id)
  }

  const tapZone = (zoneId) => {
    if (solved || disabled || !picked) return
    fx.tap()
    setHint(null)
    setChecked(false)
    setPlace((prev) => ({ ...prev, [picked]: zoneId }))
    setPicked(null)
  }

  const check = () => {
    if (!all || solved || disabled) return
    setChecked(true)
    if (!wrongIds.length) {
      setSolved(true)
      fx.right()
      if (onStep) onStep('ok')
      if (onSolved) onSolved({ correct: true, attempts: tries + 1, tags: [] })
      return
    }
    const n = tries + 1
    setTries(n)
    const key = wrongIds.slice().sort().join(',')
    const list = wrongs || []
    const exact = list.find((x) => x.key === key)
    const any = list.find((x) => x.key === undefined || x.key === '*')
    const h = (exact && exact.hint) || (any && any.hint) || null
    setHint(h)
    fx.wrong(h)
  }

  const chip = (it, inZone) => {
    const bad = checked && wrongIds.indexOf(it.id) !== -1
    const good = checked && place[it.id] && !bad
    return (
      <button
        key={it.id}
        type="button"
        className={'g7-sz-chip' + (picked === it.id ? ' is-picked' : '') + (bad ? ' is-bad' : '') + (good ? ' is-good' : '')}
        disabled={solved || disabled}
        onClick={(e) => tapItem(it.id, e)}
        data-item={it.id}
      >
        <Fx>{typeof it.text === 'string' ? it.text : t(it.text)}</Fx>
      </button>
    )
  }

  return (
    <>
      <Ask kind="task" tight cap={promptCap ? t(promptCap) : undefined}>{prompt ? t(prompt) : null}</Ask>

      {/* USTUNLAR SONI zonalar soniga teng. CSS da uchta qotib turgan edi va
          ikki zonali ekranda o'ngda BO'SH ustun qolardi (surat 2026-08-21). */}
      <div className="g7-sz-zones" style={{ gridTemplateColumns: 'repeat(' + zones.length + ', minmax(0, 1fr))' }}>
        {zones.map((z) => (
          <div key={z.id} className="g7-sz-zone">
            <span className="g7-sz-cap">{t(z.label)}</span>
            {/* Zonaning ichi -- tushirish maydoni. Balandligi boshidan band:
                kartalar kelganda zona o'smaydi va ekran sakramaydi. */}
            {/* Zona -- DIV, tugma emas: uning ichida kartalar turadi, va
                tugma ichidagi tugma yaroqsiz HTML (React 2026-08-20 da
                aynan shundan ogohlantirdi). Bosish DIV da, kartalar esa
                o'z bosishini yuqoriga o'tkazmaydi. */}
            <div
              className={'g7-sz-drop' + (picked ? ' is-open' : '')}
              role={picked ? 'button' : undefined}
              tabIndex={picked ? 0 : undefined}
              onClick={() => tapZone(z.id)}
              onKeyDown={(e) => { if (picked && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); tapZone(z.id) } }}
              data-zone={z.id}
            >
              <span className="g7-sz-in">
                {items.filter((it) => place[it.id] === z.id).map((it) => chip(it, true))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* KARTALAR PASTDA -- amaliyotning umumiy shakli. */}
      <Slot mh={54}>
        {pool.length ? (
          <div className="g7-sz-pool">{pool.map((it) => chip(it, false))}</div>
        ) : null}
      </Slot>

      <Slot mh={solved ? 0 : 46}>
        {!solved ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Btn onClick={check} disabled={!all || disabled} ready={all} mark="check">{t(UI.check)}</Btn>
          </div>
        ) : null}
      </Slot>

      <Slot mh={58}>
        {solved && okNote ? <Feedback show ok>{t(okNote)}</Feedback> : null}
        {!solved && hint ? <Feedback show ok={false}>{t(hint)}</Feedback> : null}
      </Slot>
    </>
  )
}

// ============================================================================
// HADLAR LENTASI (TermStrip) -- B4 blokining asbobi, 18-dars.
//
// NIMA UCHUN. Darslik ko'phadni «bir nechta birhadning ALGEBRAIK yig'indisi»
// deb ta'riflaydi (38-bet). «Algebraik» so'zi bitta narsani bildiradi: minus
// hadning O'ZIGA tegishli. O'quvchi buni yozuvda ko'rmaydi -- u minusni
// hadlar ORASIDAGI amal deb o'qiydi, va 19-darsda qavs oldidagi minusni
// faqat birinchi hadga tarqatadi.
//
// ASBOB NAZORATCHI, oracle emas (§8.1). Lenta FAQAT qo'shuv va ayirish
// belgilari bo'yicha kesiladi: ko'paytirish nuqtasida kesish tugmasi YO'Q,
// ya'ni 3a · 2b ni ikki hadga bo'lib yuborish JISMONAN mumkin emas. Kesilgan
// joyda belgi O'CHADI va had ostidagi chipda PAYDO BO'LADI -- minus hadning
// yoniga ko'chib o'tgani ko'rinadi, aytilmaydi.
//
// Birinchi hadning minusi tugma EMAS: u kesuvchi belgi emas, u hadning
// qismi. Shu bilan «−2x² ning minusi qayerdan keldi» savoli o'zi yopiladi.
//
// SANOQ OXIRIDA. Hadlar soni va tur nomi (Birhad, Ikkihad, Uchhad,
// To'rthad) faqat BARCHA kesiklar qo'yilgach chiqadi: aks holda asbob
// o'quvchidan oldin javob berib qo'yadi.
//
//   strips: [{ parts: ['9a⁶b²c', '−2a³bc⁴', '+2ab', '−5ac'], cap }]
//           birinchi qismda belgi bo'lishi mumkin (u hadning qismi),
//           qolganlari + yoki − bilan boshlanadi.
//   options/answer/wrongs -- bo'lmasa, lentaning kesilishi javob bo'ladi.
// ============================================================================
const tsSplit = (raw) => {
  const s = String(raw).trim()
  if (s[0] === '+' || s[0] === '−' || s[0] === '-') {
    return { sign: s[0] === '-' ? '−' : s[0], body: s.slice(1).trim() }
  }
  return { sign: '', body: s }
}

export function TermStrip({
  strips, showKind = true, caption,
  options, answer, wrongs, note, cols = 4,
  onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const list = useMemo(() => (strips || []).map((s) => ({
    cap: s.cap,
    parts: s.parts.map(tsSplit),
  })), [strips])
  const [cuts, setCuts] = useState(() => (strips || []).map((s) => s.parts.slice(1).map(() => false)))
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [tags, setTags] = useState([])

  const done = (rows) => rows.every((r) => r.every(Boolean))
  const allCut = done(cuts)

  const cut = (si, i) => {
    if (disabled || cuts[si][i]) return
    fx.tap()
    const next = cuts.map((row, k) => (k === si ? row.map((v, j) => (j === i ? true : v)) : row))
    setCuts(next)
    if (onStep) onStep('cut')
    if (done(next)) {
      if (onStep) onStep('cut-all')
      // Variantlar bo'lmasa, kesishning O'ZI topshiriq: asbob shu yerda
      // yopiladi va keyingi ekranga yo'l ochiladi.
      if (!options && onSolved) onSolved({ correct: true, attempts: 1, tags: [] })
    }
  }

  const pick = (o) => {
    if (picked || disabled) return
    if (o.id === answer) {
      fx.right()
      setPicked(o.id)
      setHint(note || null)
      if (onSolved) onSolved({ correct: true, attempts: wrong.length + 1, tags })
      return
    }
    const w = (wrongs || []).find((x) => x.key === o.id) || (wrongs || []).find((x) => x.key === '*')
    setWrong((prev) => (prev.indexOf(o.id) === -1 ? prev.concat(o.id) : prev))
    setHint(w ? w.hint : null)
    if (w && w.tag) setTags((prev) => (prev.indexOf(w.tag) === -1 ? prev.concat(w.tag) : prev))
    fx.wrong(w ? w.hint : null)
  }

  const kindOf = (n) => UI.tsKind[Math.min(n, 5) - 1] || UI.tsKind[4]

  return (
    <>
      {caption ? <div className="g7-ts-cap">{t(caption)}</div> : null}

      <Slot mh={list.length > 1 ? 98 : 82}>
        <div className={'g7-ts-wrap' + (list.length > 1 ? ' is-pair' : '')}>
          {list.map((strip, si) => {
            const n = strip.parts.length
            const row = cuts[si]
            return (
              <div className="g7-ts" key={si}>
                {strip.cap ? <span className="g7-ts-lbl">{t(strip.cap)}</span> : null}
                <span className="g7-ts-row">
                  {strip.parts.map((p, i) => (
                    <React.Fragment key={i}>
                      {i ? (
                        <button
                          type="button"
                          className={'g7-ts-op' + (row[i - 1] ? ' is-gone' : '')}
                          onClick={() => cut(si, i - 1)}
                          disabled={disabled || row[i - 1]}
                        >
                          {p.sign || '+'}
                        </button>
                      ) : null}
                      <span className="g7-ts-term">
                        <Fx>{(i === 0 ? p.sign : '') + p.body}</Fx>
                      </span>
                    </React.Fragment>
                  ))}
                </span>

                {/* Chip faqat had IKKI TOMONDAN ajratilganda chiqadi: chap
                    chegara -- oldingi kesik, o'ng chegara -- keyingisi. */}
                <span className="g7-ts-out">
                  {strip.parts.map((p, i) => {
                    const left = i === 0 ? true : row[i - 1]
                    const right = i === n - 1 ? true : row[i]
                    if (!left || !right) return null
                    return (
                      <span className="g7-ts-chip" key={i}>
                        <Fx>{(p.sign || (i === 0 ? '' : '+')) + p.body}</Fx>
                      </span>
                    )
                  })}
                </span>

                {row.every(Boolean) ? (
                  <span className="g7-ts-cnt">
                    <span>{t(UI.tsHads)} {n}</span>
                    {showKind ? <span className="g7-ts-kind">{t(kindOf(n))}</span> : null}
                  </span>
                ) : list.length > 1 ? null : (
                  <span className="g7-ts-cnt is-wait">{t(UI.tsCut)}</span>
                )}
              </div>
            )
          })}
          {list.length > 1 && !allCut ? (
            <span className="g7-ts-cnt is-wait">{t(UI.tsCut)}</span>
          ) : null}
        </div>
      </Slot>

      <Slot mh={options ? 54 : 0}>
        {options && allCut ? (
          <Options
            items={options.map((o) => ({ id: o.id, label: t(o.label) }))}
            picked={picked}
            wrong={wrong}
            onPick={pick}
            disabled={disabled}
            cols={cols}
          />
        ) : null}
      </Slot>

      <Slot mh={58}>
        <Feedback show={!!hint} ok={!!picked}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================================
// HADLAR USTUNI (TermColumns) -- B4 asbobining IKKINCHI REJIMI, 19-dars.
//
// DARSLIKNING O'ZI shu ko'rinishni beradi (44-bet): ko'phadlar yig'indisini
// sonlarni qo'shishga o'xshab USTUN usulida topish qulay, o'xshash hadlar
// birining ostiga ikkinchisi turadi. Ya'ni bu yangi mexanika emas: 18-darsda
// lenta hadlarni AJRATGAN edi, bu yerda o'sha hadlar ustunga TERILADI.
//
// NAZORATCHI shundan: qo'shish faqat USTUN ICHIDA bo'ladi. Ustunlar orasida
// hech narsa qo'shilmaydi, chunki bosish ustunga tegishli. Blokning eng
// qimmat xatosi -- 3x² qo'shuv 2x ni 5x³ deb yozish -- shu bilan JISMONAN
// mumkin bo'lmaydi.
//
// QAVS OLDIDAGI MINUS. `op` qatorga tegishli. Minus bo'lsa, ustun ochilganda
// SHU QATORNING hadi ishorasini almashtiradi va eski ishora o'chirilgan holda
// yonida qoladi: minus BARCHA hadlarga tarqalgani ko'rinadi, aytilmaydi. Bu
// 18-darsning «ishora hadning qismi» chizig'ining davomi.
//
// ASBOB HISOBLAMAYDI (§8.1). U hadlarni yonma-yon qo'yadi va ishorani
// almashtiradi -- qo'shishni o'quvchi o'zi qiladi va javobni variantlardan
// tanlaydi. Aks holda asbob javobni berib qo'yardi.
//
//   rows: [{ op, cells: ['3a', '−4b'] }]   -- `null` yacheyka BO'SH ustun
//   options/answer/wrongs -- barcha ustunlar ochilgach paydo bo'ladi
// ============================================================================
const tcFlip = (raw) => {
  const { sign, body } = tsSplit(raw)
  if (sign === '−') return '+' + body
  return '−' + body
}

export function TermColumns({
  rows, caption, options, answer, wrongs, note, cols = 2,
  onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const width = rows.reduce((m, r) => Math.max(m, r.cells.length), 0)
  const [open, setOpen] = useState(() => rows[0].cells.map(() => false))
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [tags, setTags] = useState([])
  const allOpen = open.every(Boolean)

  const openCol = (i) => {
    if (disabled || open[i]) return
    fx.tap()
    const next = open.map((v, j) => (j === i ? true : v))
    setOpen(next)
    if (onStep) onStep('col')
    if (next.every(Boolean) && onStep) onStep('col-all')
  }

  const pick = (o) => {
    if (picked || disabled) return
    if (o.id === answer) {
      fx.right()
      setPicked(o.id)
      setHint(note || null)
      if (onSolved) onSolved({ correct: true, attempts: wrong.length + 1, tags })
      return
    }
    const w = (wrongs || []).find((x) => x.key === o.id) || (wrongs || []).find((x) => x.key === '*')
    setWrong((prev) => (prev.indexOf(o.id) === -1 ? prev.concat(o.id) : prev))
    setHint(w ? w.hint : null)
    if (w && w.tag) setTags((prev) => (prev.indexOf(w.tag) === -1 ? prev.concat(w.tag) : prev))
    fx.wrong(w ? w.hint : null)
  }

  // Ustun ochilganda pastda TURGAN juft: minusli qatorning hadi ishorasi
  // almashgan holda. Bu javob EMAS -- bu qo'shiluvchilar.
  const pairOf = (i) => rows
    .map((r) => {
      const cell = r.cells[i]
      if (!cell) return null
      if (r.op === '−') return tcFlip(cell)
      return cell
    })
    .filter(Boolean)

  return (
    <>
      {caption ? <div className="g7-ts-cap">{t(caption)}</div> : null}

      <Slot mh={118}>
        <div className="g7-tc" style={{ gridTemplateColumns: 'auto repeat(' + width + ', minmax(0, auto))' }}>
          {rows.map((r, ri) => (
            <React.Fragment key={ri}>
              <span className="g7-tc-op">{r.op ? <Fx>{r.op}</Fx> : null}</span>
              {r.cells.map((cell, i) => (
                <span className={'g7-tc-cell' + (open[i] && r.op === '−' ? ' is-flip' : '')} key={i}>
                  {cell ? <Fx>{open[i] && r.op === '−' ? tcFlip(cell) : cell}</Fx> : null}
                </span>
              ))}
            </React.Fragment>
          ))}

          <span className="g7-tc-op" />
          {open.map((isOpen, i) => (
            <span className="g7-tc-res" key={i}>
              {isOpen ? (
                <span className="g7-tc-pair"><Fx>{pairOf(i).join(' ')}</Fx></span>
              ) : (
                // Bu yerda `TapMark` ISHLAMAYDI: u katta emoji qo'l va u
                // kichik tugmadan chiqib ketadi (surat 2026-08-21). Slot
                // belgisi -- `SlotFill` dagi bilan bir xil tilda.
                <button
                  type="button"
                  className="g7-tc-tap"
                  onClick={() => openCol(i)}
                  disabled={disabled}
                >
                  ?
                </button>
              )}
            </span>
          ))}
        </div>
      </Slot>

      <Slot mh={options ? 54 : 0}>
        {options && allOpen ? (
          <Options
            items={options.map((o) => ({ id: o.id, label: t(o.label) }))}
            picked={picked}
            wrong={wrong}
            onPick={pick}
            disabled={disabled}
            cols={cols}
          />
        ) : null}
      </Slot>

      <Slot mh={58}>
        <Feedback show={!!hint} ok={!!picked}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================================
// YUZA TO'RTBURCHAGI (AreaGrid) -- B4 blokining KO'PAYTIRISH asbobi
// (etalon § 2, 3-asbob). Darslikning o'zi shu modelni so'raydi: modellar
// asosida qo'shish (45-bet), shakllarning yuzini toping (47 va 49-betlar),
// yig'indi kvadratining geometrik ko'rinishi (57-bet).
//
// NAZORATCHI SHUNDAN: kataklar SONI tomonlar hadlarining ko'paytmasiga
// teng va u KO'RINADI. To'rtta katak turgan joyda ikkita ko'paytma yozib
// bo'lmaydi, ya'ni (a + b)(c + d) ni ac qo'shuv bd deb yozish mumkin emas:
// ikki katak bo'sh qoladi va ular ekranda ko'rinib turadi. Variantlar esa
// HAMMA katak ochilmaguncha chiqmaydi.
//
// ASBOB HISOBLAMAYDI (§8.1). Katak ochilganda u KO'PAYTUVCHILAR JUFTINI
// ko'rsatadi, natijani emas: koeffitsiyent va ko'rsatkichlar ustida ishlash
// B3 blokining ishi va u o'quvchida qoladi.
//
//   left:  ['−2a⁴']            -- chap tomon (qatorlar)
//   top:   ['14ab', '+2,5b']   -- yuqori tomon (ustunlar)
// ============================================================================
export function AreaGrid({
  left, top, caption, options, answer, wrongs, note, cols = 2,
  onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const rows = left.length
  const colsN = top.length
  const [open, setOpen] = useState(() => left.map(() => top.map(() => false)))
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [tags, setTags] = useState([])

  const allOpen = open.every((r) => r.every(Boolean))
  const openCount = open.reduce((n, r) => n + r.filter(Boolean).length, 0)

  const tap = (i, j) => {
    if (disabled || open[i][j]) return
    fx.tap()
    const next = open.map((r, ri) => r.map((v, cj) => (ri === i && cj === j ? true : v)))
    setOpen(next)
    if (onStep) onStep('cell')
    if (next.every((r) => r.every(Boolean)) && onStep) onStep('cell-all')
  }

  const pick = (o) => {
    if (picked || disabled) return
    if (o.id === answer) {
      fx.right()
      setPicked(o.id)
      setHint(note || null)
      if (onSolved) onSolved({ correct: true, attempts: wrong.length + 1, tags })
      return
    }
    const w = (wrongs || []).find((x) => x.key === o.id) || (wrongs || []).find((x) => x.key === '*')
    setWrong((prev) => (prev.indexOf(o.id) === -1 ? prev.concat(o.id) : prev))
    setHint(w ? w.hint : null)
    if (w && w.tag) setTags((prev) => (prev.indexOf(w.tag) === -1 ? prev.concat(w.tag) : prev))
    fx.wrong(w ? w.hint : null)
  }

  // Ustun yorliqlari + har qator uchun bitta yorliq ustuni.
  // KATAK KENGLIGI MAZMUNDAN. `1fr` bo'lganda kataklar butun kenglikka
  // cho'zilib ketardi va to'rtburchak ikki uzun tasmaga o'xshab qolardi
  // (surat 2026-08-21) -- ya'ni YUZA modeli o'qilmasdi.
  const gridCols = 'auto repeat(' + colsN + ', minmax(104px, max-content))'

  // Katakdagi JUFT: qavsdagi had ishorasi bilan olinadi. Qo'shuv belgisi
  // tashlanadi (3a karra qo'shuv besh degan yozuv bo'lmaydi), manfiy had
  // esa qavsga olinadi -- matematik yozuv shunday.
  const pairText = (rowCap, colCap) => {
    const c = String(colCap).trim()
    // IKKI QATORLI to'rtburchakda chap yorliq ham hadning ISHORASI bilan
    // keladi (21-dars: `2a` va `−3`). Musbat had oldidagi qo'shuv belgisi
    // katakda tashlanadi -- `+3 · x` degan yozuv bo'lmaydi; manfiy had esa
    // birinchi ko'paytuvchi bo'lganda qavsga olinmaydi.
    const r0 = String(rowCap).trim()
    const r = r0.charAt(0) === '+' ? r0.slice(1).trim() : r0
    if (c.charAt(0) === '+') return r + ' · ' + c.slice(1).trim()
    if (c.charAt(0) === '−') return r + ' · (' + c + ')'
    return r + ' · ' + c
  }

  return (
    <>
      {caption ? <div className="g7-ts-cap">{t(caption)}</div> : null}

      <Slot mh={rows * 52 + 34}>
        <div className="g7-ag" style={{ gridTemplateColumns: gridCols }}>
          <span className="g7-ag-corner" />
          {top.map((cap, j) => (
            <span className="g7-ag-top" key={j}><Fx>{cap}</Fx></span>
          ))}
          {left.map((rowCap, i) => (
            <React.Fragment key={i}>
              <span className="g7-ag-left"><Fx>{rowCap}</Fx></span>
              {top.map((colCap, j) => (
                <span className="g7-ag-cell" key={j}>
                  {open[i][j] ? (
                    <span className="g7-ag-pair"><Fx>{pairText(rowCap, colCap)}</Fx></span>
                  ) : (
                    <button
                      type="button"
                      className="g7-ag-tap"
                      onClick={() => tap(i, j)}
                      disabled={disabled}
                    >
                      ?
                    </button>
                  )}
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </Slot>

      {/* Sanoq MARKAZDA: `Slot` ustun yo'nalishida, ya'ni markazlash uchun
          `alignItems` kerak -- aks holda satr chap chetda qolib ketadi. */}
      <Slot mh={22} style={{ alignItems: 'center' }}>
        <span className={'g7-ts-cnt' + (allOpen ? '' : ' is-wait')}>
          {t(UI.agCells)} {openCount} / {rows * colsN}
        </span>
      </Slot>

      <Slot mh={options ? 54 : 0}>
        {options && allOpen ? (
          <Options
            items={options.map((o) => ({ id: o.id, label: t(o.label) }))}
            picked={picked}
            wrong={wrong}
            onPick={pick}
            disabled={disabled}
            cols={cols}
          />
        ) : null}
      </Slot>

      <Slot mh={58}>
        <Feedback show={!!hint} ok={!!picked}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================================
// KOORDINATALAR TEKISLIGI (Plane) -- B6 blokining asbobi, etalon § 2 dagi
// 4-asbob («funksiyaning to'rt oynasi») ning TOR ko'rinishi.
//
// NEGA TOR. 8-sinfda `plot.jsx` bor va u 868 qator: surgichlar, parametrik
// egri chiziqlar, nuqtani sudrash. Uni bu yerga ULAB bo'lmaydi -- u 8-sinf
// yadrosiga va palitrasiga bog'langan, ya'ni bitta darsga ikkinchi yadro va
// begona rang keladi. Metodist qarori 2026-08-21: «tor tekislik». Shuning
// uchun bu yerda faqat B6 uchun kerak bo'lgani yozilgan.
//
// 8-SINFDAN KOD OLINMADI, TO'RT QARORI OLINDI:
//   1. CHIZIQ FUNKSIYADAN quriladi. Dars `f` beradi, nuqtalar ro'yxatini
//      emas: ro'yxat berilsa, muallif noto'g'ri grafik chizadi va buni hech
//      qanday tekshiruv tutmaydi.
//   2. BOSISH MATEMATIK KOORDINATADA tekshiriladi, piksel bilan emas:
//      telefonda dars zoom bilan kichrayadi va piksel yolg'on gapiradi.
//      `rect` orqali olingan ulush o'lchamsiz, shuning uchun xavfsiz.
//   3. O'qlar strelka, bo'linma va son bilan; boshi O deb belgilanadi
//      (METODIK_PROFIL_MATEMATIKA.md ning must-bandi).
//   4. Asbob NAZORATCHI: natijani ko'rsatadi, javobni AYTMAYDI. Nuqta
//      qo'yilgach uning koordinatalari yoziladi, «to'g'ri» degan so'z emas.
//
// Prop lar:
//   range   {x0,x1,y0,y1}   ko'rinadigan maydon. MAYDONNI DARS TANLAYDI --
//                           o'z funksiyasiga qarab: tik chiziq tor oynadan
//                           tez chiqib ketadi (y teng ikki x qo'shuv bir
//                           default oynada x bo'yicha atigi to'rt birlik
//                           ko'rinadi). Masshtabni esa ASBOB teng saqlaydi.
//   fn      [{id,f,label}]  chiziqlar, HAR BIRI funksiyadan
//   dots    [{x,y}]         tayyor nuqtalar (o'qish topshiriqlari uchun)
//   pick    {x,y}           o'quvchi qo'yishi kerak bo'lgan nuqta
//   labels  true            tayyor nuqtalarni imzolash. DEFAULT O'CHIQ:
//                           imzo «koordinatani o'qing» topshirig'ida javobni
//                           berib qo'yadi
//   options/answer/wrongs/note   qolgan asboblardagi bilan bir xil
// ============================================================================
export function Plane({
  range, fn, dots, pick, labels, caption, options, answer, wrongs, note, cols = 2,
  onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const fx = useAnswerFx(audio)
  // Default maydon kadr nisbatiga mos: 14 ga 8 (nisbat 1,75), ya'ni bo'sh
  // joy qolmaydi. Dars boshqa maydon bersa, asbob uni MARKAZGA qo'yadi va
  // masshtabni teng saqlaydi -- shunda tekislik kvadrat bo'lib chiqadi.
  const R = { x0: -7, x1: 7, y0: -4, y1: 4, ...(range || {}) }
  const [put, setPut] = useState(null)      // o'quvchi qo'ygan nuqta
  // NOTO'G'RI QO'YILGAN nuqta: ko'rsatiladi va o'chadi. Ilgari asbob HAR
  // QANDAY tugunni qabul qilardi -- «kesishgan nuqtani belgilang» topshirig'i
  // bajarilmagan bo'lsa ham ekran ochilaverardi va keyingi savol ma'nosini
  // yo'qotardi (QA 2026-08-22, 38-dars). Sinf qoidasi: noto'g'ri javob
  // OLDINGA O'TKAZMAYDI.
  const [miss, setMiss] = useState(null)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [tags, setTags] = useState([])

  // Kadr: viewBox QAT'IY, o'lcham CSS bilan keladi. Balandlik viewBox ga
  // kiritilib ketsa, chizma telefonda BUTUNLAY kichrayadi (10-sinf grabli).
  const VW = 420
  const VH = 250
  const P = { l: 34, r: 16, t: 14, b: 26 }
  // MASHTAB IKKI O'QDA BIR XIL, va buni ASBOB ta'minlaydi, dars emas.
  // Boshda maydon shunchaki cho'zilgan edi: x bo'yicha qadam 37 piksel,
  // y bo'yicha 21 -- ya'ni y teng x to'g'ri chizig'i qirq besh daraja
  // ostida ketmasdi va qiyalik KO'Z BILAN noto'g'ri o'qilardi (statik
  // tekshiruv 2026-08-21). Endi bir birlik ikki o'qda bir xil piksel, va
  // maydon kadr o'rtasiga qo'yiladi.
  const availW = VW - P.l - P.r
  const availH = VH - P.t - P.b
  const k = Math.min(availW / (R.x1 - R.x0), availH / (R.y1 - R.y0))
  const w = k * (R.x1 - R.x0)
  const h = k * (R.y1 - R.y0)
  const ox = P.l + (availW - w) / 2
  const oy = P.t + (availH - h) / 2
  const sx = (x) => ox + (x - R.x0) * k
  const sy = (y) => oy + h - (y - R.y0) * k

  // Nuqta qo'yish TUGAGANMI. `pick` berilmagan bo'lsa, ekran o'qishga
  // mo'ljallangan va variantlar darrov chiqadi.
  const ready = !pick || !!put

  const ints = (a, b) => {
    const out = []
    for (let v = Math.ceil(a); v <= Math.floor(b); v += 1) out.push(v)
    return out
  }

  // KO'RSATMA QULFI BIR MARTA ISHLAYDI -- `Figure` dagi bilan bir xil sabab:
  // razbor ham ovoz, va u gapirayotganda tekislik yana o'lik bo'lib qolardi.
  const opened = useRef(false)
  if (!disabled) opened.current = true
  const blocked = disabled && !opened.current
  const live = !!pick && !put && !blocked

  // BOSISH: ulush -> matematik koordinata -> eng yaqin butun tugun.
  const tap = (e) => {
    if (blocked || !pick || put) return
    const box = e.currentTarget.getBoundingClientRect()
    if (!box.width || !box.height) return
    const vx = ((e.clientX - box.left) / box.width) * VW
    const vy = ((e.clientY - box.top) / box.height) * VH
    // TESKARI HISOB `sx` va `sy` NING AYNAN TESKARISI bo'lishi shart.
    // Ilgari bu yerda kadrning chap MAYDONI (P.l) turardi, tekislikning
    // boshi esa `ox` da: maydon kadrga to'liq sig'masa, asbob uni MARKAZGA
    // qo'yadi va ox P.l dan katta bo'ladi. 12 ga 8 oynada farq 27,5 piksel,
    // ya'ni ROSA BIR birlik: o'quvchi to'rtga bosardi, nuqta esa beshga
    // tushardi (QA 2026-08-22, 36-dars 3-slayd). Vertikal bo'yicha ham
    // shunday: pastki chegara VH - P.b emas, oy + h.
    // `Figure` asbobida bu allaqachon to'g'ri yozilgan, `Plane` esa eski
    // ko'rinishda qolib ketgan edi.
    const mx = R.x0 + ((vx - ox) / w) * (R.x1 - R.x0)
    const my = R.y0 + ((oy + h - vy) / h) * (R.y1 - R.y0)
    const gx = Math.round(mx)
    const gy = Math.round(my)
    if (gx < R.x0 || gx > R.x1 || gy < R.y0 || gy > R.y1) return
    // TEGDIMI. `pick` topshiriqning javobi, va u TEKSHIRILADI. Nuqta baribir
    // ko'rsatiladi -- o'quvchi qayerga bosganini ko'rishi kerak, -- lekin
    // noto'g'ri bo'lsa o'chadi va ekran ochilmaydi.
    if (gx !== pick.x || gy !== pick.y) {
      setMiss({ x: gx, y: gy })
      setHint(UI.missPoint)
      fx.wrong(UI.missPoint)
      return
    }
    setMiss(null)
    setHint(null)
    fx.tap()
    setPut({ x: gx, y: gy })
    if (onStep) onStep('dot')
  }

  // Noto'g'ri nuqta chizmada QOLMAYDI: ko'rsatiladi va so'nadi, chizma esa
  // yana toza bo'ladi.
  useEffect(() => {
    if (!miss) return undefined
    const tmr = setTimeout(() => setMiss(null), 1400)
    return () => clearTimeout(tmr)
  }, [miss])

  const choose = (o) => {
    if (picked || disabled) return
    if (o.id === answer) {
      fx.right()
      setPicked(o.id)
      setHint(note || null)
      if (onSolved) onSolved({ correct: true, attempts: wrong.length + 1, tags })
      return
    }
    const bad = (wrongs || []).find((x) => x.key === o.id) || (wrongs || []).find((x) => x.key === '*')
    setWrong((prev) => (prev.indexOf(o.id) === -1 ? prev.concat(o.id) : prev))
    setHint(bad ? bad.hint : null)
    if (bad && bad.tag) setTags((prev) => (prev.indexOf(bad.tag) === -1 ? prev.concat(bad.tag) : prev))
    fx.wrong(bad ? bad.hint : null)
  }

  // CHIZIQ: `f` bo'yicha namuna olinadi, maydondan chiqqan qismi tashlanadi.
  // 7-sinfda chiziqlar to'g'ri, lekin namuna olish umumiy: keyingi blokda
  // boshqa funksiya kelsa, asbob o'zgarmaydi.
  const polyOf = (f) => {
    const pts = []
    const N = 64
    for (let i = 0; i <= N; i += 1) {
      const x = R.x0 + ((R.x1 - R.x0) * i) / N
      const y = f(x)
      if (!isFinite(y) || y < R.y0 || y > R.y1) { pts.push(null); continue }
      pts.push(sx(x).toFixed(1) + ',' + sy(y).toFixed(1))
    }
    const runs = []
    let cur = []
    pts.forEach((p) => {
      if (p === null) { if (cur.length > 1) runs.push(cur); cur = [] } else cur.push(p)
    })
    if (cur.length > 1) runs.push(cur)
    return runs
  }

  const shown = (put ? [{ x: put.x, y: put.y, mine: true }] : [])
    .concat(miss ? [{ x: miss.x, y: miss.y, mine: true, miss: true }] : [])
    .concat(dots || [])

  return (
    <>
      {/* TOPSHIRIQ EKRANIDA MATN TOPSHIRIQ SHAKLIDA. Nuqta QO'YILADIGAN
          ekranda yozuv 13,5 px va och kulrang edi: QA uni umuman payqamadi
          va «belgilash kerakligi bilinib tursin» dedi (2026-08-22). Endi
          bunday ekranda u sinfning odatiy topshiriq shaklida turadi --
          TOPSHIRIQ yorlig'i va qora qalin matn, xuddi SlotFill dagidek.
          O'qish ekranida (nuqta tayyor) yozuv izohligicha qoladi: u yerda
          harakat talab qilinmaydi. */}
      {caption ? (
        pick
          ? <Ask kind="task" tight>{t(caption)}</Ask>
          : <div className="g7-ts-cap">{t(caption)}</div>
      ) : null}

      <Slot mh={VH + 6} className="g7-drawslot" style={{ alignItems: 'center' }}>
        <div className="g7-pl-wrap">
          <svg
            viewBox={'0 0 ' + VW + ' ' + VH}
            className={'g7-pl-svg' + (live ? ' is-live' : '')}
            onClick={tap}
            role="img"
            aria-label={t(caption || UI.agCells)}
          >
            {ints(R.x0, R.x1).map((x) => (
              <line key={'gx' + x} className="g7-pl-grid" x1={sx(x)} y1={sy(R.y0)} x2={sx(x)} y2={sy(R.y1)} />
            ))}
            {ints(R.y0, R.y1).map((y) => (
              <line key={'gy' + y} className="g7-pl-grid" x1={sx(R.x0)} y1={sy(y)} x2={sx(R.x1)} y2={sy(y)} />
            ))}

            <line className="g7-pl-ax" x1={sx(R.x0)} y1={sy(0)} x2={sx(R.x1)} y2={sy(0)} />
            <line className="g7-pl-ax" x1={sx(0)} y1={sy(R.y0)} x2={sx(0)} y2={sy(R.y1)} />
            <polygon
              className="g7-pl-arrow"
              points={(sx(R.x1) + 8) + ',' + sy(0) + ' ' + sx(R.x1) + ',' + (sy(0) - 4) + ' ' + sx(R.x1) + ',' + (sy(0) + 4)}
            />
            <polygon
              className="g7-pl-arrow"
              points={sx(0) + ',' + (sy(R.y1) - 8) + ' ' + (sx(0) - 4) + ',' + sy(R.y1) + ' ' + (sx(0) + 4) + ',' + sy(R.y1)}
            />

            {ints(R.x0, R.x1).filter((x) => x !== 0).map((x) => (
              <g key={'tx' + x}>
                <line className="g7-pl-tick" x1={sx(x)} y1={sy(0) - 3} x2={sx(x)} y2={sy(0) + 3} />
                <text className="g7-pl-num" x={sx(x)} y={sy(0) + 15} textAnchor="middle">{x}</text>
              </g>
            ))}
            {ints(R.y0, R.y1).filter((y) => y !== 0).map((y) => (
              <g key={'ty' + y}>
                <line className="g7-pl-tick" x1={sx(0) - 3} y1={sy(y)} x2={sx(0) + 3} y2={sy(y)} />
                <text className="g7-pl-num" x={sx(0) - 8} y={sy(y) + 4} textAnchor="end">{y}</text>
              </g>
            ))}
            <text className="g7-pl-num" x={sx(0) - 8} y={sy(0) + 15} textAnchor="end">O</text>
            <text className="g7-pl-axname" x={sx(R.x1) + 4} y={sy(0) + 16}>x</text>
            <text className="g7-pl-axname" x={sx(0) + 8} y={sy(R.y1) - 2}>y</text>

            {(fn || []).map((fi, i) => polyOf(fi.f).map((run, k) => (
              <polyline key={'f' + i + '_' + k} className={'g7-pl-line g7-pl-l' + (i % 2)} points={run.join(' ')} />
            )))}

            {shown.map((d, i) => (
              <g key={'d' + i} className={'g7-pl-dotg' + (d.mine ? ' is-mine' : '') + (d.miss ? ' is-miss' : '')}>
                <line className="g7-pl-guide" x1={sx(d.x)} y1={sy(d.y)} x2={sx(d.x)} y2={sy(0)} />
                <line className="g7-pl-guide" x1={sx(d.x)} y1={sy(d.y)} x2={sx(0)} y2={sy(d.y)} />
                <circle className="g7-pl-dot" cx={sx(d.x)} cy={sy(d.y)} r="5" />
                {/* ASBOB ORAKUL EMAS (§8.1). O'quvchining O'Z nuqtasi
                    imzolanadi -- u qayerga bosganini bilishi kerak. Tayyor
                    nuqtalar esa imzosiz turadi: «koordinatalarni o'qing»
                    topshirig'ida imzo javobni BERIB QO'YARDI. Imzo kerak
                    bo'lsa, dars `labels` beradi -- masalan avvalgi ekranda
                    allaqachon topilgan nuqta uchun. */}
                {d.mine || labels ? (() => {
                  // IMZO KADRDAN CHIQMASIN. Nuqta o'ng chekkada bo'lsa imzo
                  // ramkadan oshib ketardi, tepada bo'lsa -- yuqoridan.
                  // Shrift monoshirift, ya'ni imzo eni ANIQ hisoblanadi:
                  // belgi eni 0,6em, o'lchami 12,5 px.
                  const txt = '(' + d.x + '; ' + d.y + ')'
                  const wLab = txt.length * 12.5 * 0.6
                  const left = sx(d.x) + 10 + wLab > VW - P.r
                  const top = sy(d.y) - 8 < P.t + 4
                  return (
                    <text
                      className="g7-pl-lab"
                      x={left ? sx(d.x) - 10 : sx(d.x) + 10}
                      y={top ? sy(d.y) + 18 : sy(d.y) - 8}
                      textAnchor={left ? 'end' : 'start'}
                    >
                      {txt}
                    </text>
                  )
                })() : null}
              </g>
            ))}
          </svg>
        </div>
      </Slot>

      <Slot mh={options ? 54 : 0}>
        {options && ready ? (
          <Options
            items={options.map((o) => ({ id: o.id, label: t(o.label) }))}
            picked={picked}
            wrong={wrong}
            onPick={choose}
            disabled={disabled}
            cols={cols}
          />
        ) : null}
      </Slot>

      <Slot mh={58}>
        <Feedback show={!!hint} ok={!!picked}>{hint ? t(hint) : null}</Feedback>
      </Slot>
    </>
  )
}

// ============================================================================
// CHIZMA (Figure) -- B7 blokining asbobi, etalon § 2 dagi 5-asbob
// («chizmada isbot») ning tor ko'rinishi.
//
// NEGA KLIK, SUDRASH EMAS. Etalon uch joyda HARAKAT talab qiladi: teng
// yonli uchburchakda uchni surganda tomonlar tengligi yo'qoladi (82-bet),
// burchaklar yig'indisi surilganda qayta hisoblanadi (124-bet), va katta
// burchak qarshisida katta tomon yotadi (131 va 138-betlar). Buning uchun
// sichqoncha bilan sudrash SHART emas: uch to'rning boshqa TUGUNIGA
// ko'chiriladi, va hamma son qayta hisoblanadi. Klik mexanikasi `Plane` da
// allaqachon yozilgan va tekshirilgan -- shu yerda u qayta ishlatiladi
// (metodist qarori 2026-08-21).
//
// O'LCHOV -- TAXMIN, LEKIN 42-DARSDAN. Etalonning B7 izohi qat'iy: «o'lchov
// isbot emas» talabi § 9 dan boshlanadi, 40 va 41-darslarda esa o'lchash
// TEMANING O'ZI. Shuning uchun «taxmin» yorlig'i darsdan keladi (`guess`),
// asbobda qotib qolgan emas.
//
// BURCHAKLAR YIG'INDISI HAR DOIM ANIQ 180. Ikki burchak butun darajaga
// yaxlitlanadi, uchinchisi esa AYIRMA bilan olinadi. Aks holda yaxlitlash
// tufayli yig'indi 179 yoki 181 chiqib qolardi, va aynan «yig'indi 180»
// darsi buzilardi.
//
// Prop lar:
//   pts     {A:{x,y}, B:{x,y}, ...}   tugunlardagi nuqtalar
//   seg     [['A','B'], ...]          chiziqlar; berilmasa pts bo'yicha yopiq
//   move    'C'                       o'quvchi ko'chira oladigan uch
//   pick    {x,y}                     uni qayerga qo'yish kerak
//   show    {sides,angles,sum}        nima yoziladi
//   mark    ['AB','B']                yoritiladigan tomon va burchaklar
//   dim     ['CA']                    o'chib turadigan elementlar
//   guess   true                      o'lchov natijasiga «taxmin» yorlig'i
//   notes   [{x,y,text,mark,dim}]     ERKIN YORLIQ to'r nuqtasida. Nima uchun:
//                                     asbob burchakni faqat UCHBURCHAK uchun
//                                     hisoblaydi (uchta nuqta). Ikki chiziq
//                                     kesishgan joyda yoki kesuvchi bo'lgan
//                                     chizmada (40 va 45-darslar) burchak
//                                     qiymati DARSDAN keladi va shu yorliq
//                                     bilan qo'yiladi. Yorliqni yoritish yoki
//                                     xiralashtirish ham mumkin -- «juftlar
//                                     bittalab yoritiladi» talabi shundan
//                                     bajariladi (etalon § 2, B7)
//   options/answer/wrongs/note        qolgan asboblardagi bilan bir xil
// ============================================================================
export function Figure({
  pts, seg, move, pick, show, mark, dim, guess, notes, caption,
  options, answer, wrongs, note, cols = 2,
  onSolved, onStep, disabled, audio,
}) {
  const t = useT()
  const fx = useAnswerFx(audio)
  const [moved, setMoved] = useState(null)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [hint, setHint] = useState(null)
  const [tags, setTags] = useState([])

  const VW = 420
  const VH = 250
  const P = { l: 18, r: 18, t: 18, b: 18 }
  const R = { x0: -6, x1: 6, y0: -4, y1: 4 }
  // Masshtab teng, maydon markazda -- `Plane` dagi bilan bir xil hisob.
  const availW = VW - P.l - P.r
  const availH = VH - P.t - P.b
  const k = Math.min(availW / (R.x1 - R.x0), availH / (R.y1 - R.y0))
  const w = k * (R.x1 - R.x0)
  const h = k * (R.y1 - R.y0)
  const ox = P.l + (availW - w) / 2
  const oy = P.t + (availH - h) / 2
  const sx = (x) => ox + (x - R.x0) * k
  const sy = (y) => oy + h - (y - R.y0) * k

  // Joriy holat: ko'chirilgan uch bo'lsa, uning o'rni almashadi.
  const now = { ...pts }
  if (move && moved) now[move] = moved

  const names = Object.keys(now)
  const links = seg || names.map((n, i) => [n, names[(i + 1) % names.length]])
  const ready = !move || !!moved
  // KO'RSATMA QULFI BIR MARTA ISHLAYDI. `disabled` ovoz gapirayotganda yopiladi
  // -- va razbor ham OVOZ: noto'g'ri tugun bosilgach «bu boshqa nuqta» o'qila
  // boshlaydi va chizma yana o'lik bo'lib qoladi. Metodist 2026-08-25:
  // «ne poluchaetsya najat» -- u aynan shu paytda bosardi. Qoida esa
  // KO'RSATMA haqida: javob ko'rsatma eshitilgunча berilmasin. Ko'rsatma bir
  // marta ochilgach, chizma ochiq qoladi.
  const opened = useRef(false)
  if (!disabled) opened.current = true
  const blocked = disabled && !opened.current
  const waiting = !!move && !moved && !blocked

  const ints = (a, b) => {
    const out = []
    for (let v = Math.ceil(a); v <= Math.floor(b); v += 1) out.push(v)
    return out
  }

  const tap = (e) => {
    if (blocked || !move || moved) return
    const box = e.currentTarget.getBoundingClientRect()
    if (!box.width || !box.height) return
    const vx = ((e.clientX - box.left) / box.width) * VW
    const vy = ((e.clientY - box.top) / box.height) * VH
    const mx = R.x0 + ((vx - ox) / w) * (R.x1 - R.x0)
    const my = R.y0 + ((oy + h - vy) / h) * (R.y1 - R.y0)
    const gx = Math.round(mx)
    const gy = Math.round(my)
    if (gx < R.x0 || gx > R.x1 || gy < R.y0 || gy > R.y1) return
    // TEGDIMI. Topshiriq tugunni ATAB aytadi («C ni nol ikki tuguniga
    // ko'chiring»), ya'ni javob ma'lum va TEKSHIRILADI. Ilgari uch ISTALGAN
    // tugunga ko'chardi, va undan keyingi xulosa ma'nosini yo'qotardi
    // (QA 2026-08-22: «belgilashi ishlamayapti, hamma joyda»).
    //
    // `pick` RO'YXAT ham bo'ladi. Ba'zi topshiriq tugunni ATAMAYDI, SHART
    // beradi: «A dagi burchak to'g'ri bo'lsin». Bunday shartni bitta emas,
    // bir NECHA tugun bajaradi -- 44-darsda A ustidagi butun ustun. Bitta
    // tugunni kutish o'quvchini to'g'ri o'ylagani uchun rad etardi
    // (metodist 2026-08-25). Endi shartga mos tugunlar ro'yxat bo'lib
    // beriladi.
    const spots = Array.isArray(pick) ? pick : (pick ? [pick] : null)
    if (spots && !spots.some((p) => p.x === gx && p.y === gy)) {
      setHint(UI.missPoint)
      fx.wrong(UI.missPoint)
      return
    }
    setHint(null)
    fx.tap()
    setMoved({ x: gx, y: gy })
    if (onStep) onStep('move')
  }

  const choose = (o) => {
    if (picked || disabled) return
    if (o.id === answer) {
      fx.right()
      setPicked(o.id)
      setHint(note || null)
      if (onSolved) onSolved({ correct: true, attempts: wrong.length + 1, tags })
      return
    }
    const bad = (wrongs || []).find((x) => x.key === o.id) || (wrongs || []).find((x) => x.key === '*')
    setWrong((prev) => (prev.indexOf(o.id) === -1 ? prev.concat(o.id) : prev))
    setHint(bad ? bad.hint : null)
    if (bad && bad.tag) setTags((prev) => (prev.indexOf(bad.tag) === -1 ? prev.concat(bad.tag) : prev))
    fx.wrong(bad ? bad.hint : null)
  }

  // O'LCHOVLAR. Tomon uzunligi to'r birligida, bir kasr xonasi bilan.
  const dist = (a, b) => Math.sqrt((now[a].x - now[b].x) ** 2 + (now[a].y - now[b].y) ** 2)
  const lenTxt = (a, b) => {
    const d = dist(a, b)
    return (Math.round(d * 10) / 10).toFixed(1).replace('.', ',')
  }

  // Uchdagi burchak, darajada.
  const angAt = (v, a, b) => {
    const ux = now[a].x - now[v].x
    const uy = now[a].y - now[v].y
    const vx2 = now[b].x - now[v].x
    const vy2 = now[b].y - now[v].y
    const dot = ux * vx2 + uy * vy2
    const m1 = Math.sqrt(ux * ux + uy * uy)
    const m2 = Math.sqrt(vx2 * vx2 + vy2 * vy2)
    if (!m1 || !m2) return 0
    let c = dot / (m1 * m2)
    if (c > 1) c = 1
    if (c < -1) c = -1
    return (Math.acos(c) * 180) / Math.PI
  }

  // Uchburchak burchaklari: ikkitasi yaxlitlanadi, uchinchisi AYIRMA bilan.
  // Shunda yig'indi har doim aniq 180 chiqadi.
  // BURCHAK FAQAT YOPIQ UCHBURCHAKDA hisoblanadi. Uch nuqta bo'lishi
  // yetarli emas: `seg` ochiq siniq chiziq bergan bo'lsa (masalan nur va
  // to'g'ri chiziq), uchburchak yo'q va burchak yozib bo'lmaydi -- aks holda
  // asbob ma'nosiz uchta son chiqarardi. Ochiq chizmada burchak `notes`
  // bilan beriladi.
  const closed = names.length === 3 && names.every((n, i) => {
    const m = names[(i + 1) % 3]
    return (seg || []).length === 0 || links.some(([a, b]) => (a === n && b === m) || (a === m && b === n))
  })
  let angles = null
  if (closed) {
    const [A, B, C] = names
    const a1 = Math.round(angAt(A, B, C))
    const a2 = Math.round(angAt(B, A, C))
    angles = { [A]: a1, [B]: a2, [C]: 180 - a1 - a2 }
  }

  // IMZOLARNING JOYI CHIZMADAN HISOBLANADI, KOORDINATA ISHORASIDAN EMAS.
  //
  // Ilgari uzunlik kesmaning O'RTASIDAN olti piksel YUQORIGA qo'yilardi, va
  // bu faqat GORIZONTAL tomon uchun to'g'ri edi: qiya tomonda imzo chiziqning
  // USTIGA tushardi va uni kesib o'tardi. Burchak esa uchning yoniga «x
  // musbatmi» degan qoida bilan qo'yilardi -- ya'ni chizmaning shakliga
  // umuman qaramasdan, va tomonga yopishib qolardi (QA 2026-08-22, 41-dars:
  // «sonlar chiziq ustida yoki zich joylashib qolgan»).
  //
  // Endi: uzunlik tomonning NORMALI bo'yicha va figuradan TASHQARIGA,
  // burchak esa bissektrisa bo'yicha ICHKARIGA, uch nomi -- markazdan
  // TASHQARIGA. Uchtasi uch tomonga ketadi va bir-biriga tegmaydi.
  const cxs = names.reduce((acc, n) => acc + sx(now[n].x), 0) / (names.length || 1)
  const cys = names.reduce((acc, n) => acc + sy(now[n].y), 0) / (names.length || 1)

  // Tomon imzosi: o'rta nuqta va tashqariga qaragan normal.
  const sideLabelAt = (a, b) => {
    const x1 = sx(now[a].x)
    const y1 = sy(now[a].y)
    const x2 = sx(now[b].x)
    const y2 = sy(now[b].y)
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    let nx = -(y2 - y1)
    let ny = x2 - x1
    const ln = Math.hypot(nx, ny) || 1
    nx /= ln
    ny /= ln
    // Markazdan NARIGA: ichkariga qaragan bo'lsa, teskarisiga aylantiramiz.
    // YASSI chizmada markaz chiziqning O'ZIDA yotadi va «tashqari» degan
    // yo'nalish yo'q -- proyeksiya nolga yaqin bo'ladi va ishora tasodifiy
    // chiqadi. Shunday holatda uzunliklar YUQORIGA olinadi, burchaklar esa
    // pastga: ikkalasi har xil tomonga ketadi va ustma-ust tushmaydi.
    const proj = (mx - cxs) * nx + (my - cys) * ny
    if (Math.abs(proj) < 1) { if (ny > 0) { nx = -nx; ny = -ny } }
    else if (proj < 0) { nx = -nx; ny = -ny }
    return { x: mx + nx * 19, y: my + ny * 19 }
  }

  // Burchak imzosi: bissektrisa bo'yicha ichkariga. Burchak nolga yoki 180 ga
  // yaqin bo'lsa (yassi uchburchak, 41-darsning 7-ekrani) bissektrisa
  // tomonning O'ZI bo'ylab ketadi va imzo uzunlik imzosining ustiga tushadi --
  // shunday holatda perpendikulyar olinadi va imzo PASTGA chiqadi, uzunliklar
  // esa yuqorida qoladi.
  const angLabelAt = (n, text) => {
    const rest = names.filter((m) => m !== n)
    const px = sx(now[n].x)
    const py = sy(now[n].y)
    if (rest.length < 2) return { x: px, y: py + 20 }
    let ux = sx(now[rest[0]].x) - px
    let uy = sy(now[rest[0]].y) - py
    let vx = sx(now[rest[1]].x) - px
    let vy = sy(now[rest[1]].y) - py
    const lu = Math.hypot(ux, uy) || 1
    const lv = Math.hypot(vx, vy) || 1
    ux /= lu; uy /= lu; vx /= lv; vy /= lv
    const dot = ux * vx + uy * vy
    let bx
    let by
    let off = 22
    if (dot > 0.94 || dot < -0.94) {
      bx = -uy
      by = ux
      if (by < 0) { bx = -bx; by = -by }
      // Yassi chizmada uchning NOMI ham pastda turadi, shuning uchun burchak
      // undan pastroqqa tushadi.
      off = 34
    } else {
      bx = ux + vx
      by = uy + vy
      const lb = Math.hypot(bx, by) || 1
      bx /= lb; by /= lb
      // O'TKIR BURCHAKDA YOZUV TOMONLAR ORASIGA SIG'MAYDI. Uchdan 22 px
      // narida ikki tomon orasidagi bo'shliq atigi 2 * 22 * sin(burchak / 2)
      // ga teng: 34 daraja uchun bu 13 px, «34» yozuvi esa 15 px -- yozuv
      // ikkala chiziq ustiga chiqib, o'qilmay qolardi (QA 2026-08-25,
      // 44-dars, uchini o'zi ko'chiradigan ekran).
      //
      // Endi masofa burchakdan hisoblanadi: yozuvning yarmi chiziqqacha
      // yetmasligi kerak. To'g'ri burchakda hisob 13 px beradi, ya'ni 22 dan
      // kichik -- demak keng burchakli chizmalarda HECH NIMA o'zgarmaydi.
      // Faqat 51 darajadan tor burchak yozuvni uzoqroqqa suradi. Masofa
      // uchburchakning ichida qolishi uchun qisqa tomonning yarmidan
      // oshmaydi.
      const half = Math.acos(Math.max(-1, Math.min(1, dot))) / 2
      const wide = String(text === undefined || text === null ? '' : text).length * 3.75 + 5
      const sin = Math.sin(half)
      if (sin > 0.02) {
        const need = wide / sin
        const room = Math.min(lu, lv) * 0.45
        off = Math.max(off, Math.min(need, room, 50))
      }
    }
    return { x: px + bx * off, y: py + by * off }
  }

  // Uch nomi: markazdan tashqariga. Uch markazning O'ZIDA bo'lsa (yassi
  // chizmadagi o'rta nuqta) yo'nalish yo'q -- nom pastga tushadi.
  const nameLabelAt = (n) => {
    const px = sx(now[n].x)
    const py = sy(now[n].y)
    let dx = px - cxs
    let dy = py - cys
    const ld = Math.hypot(dx, dy)
    if (ld < 2) return { x: px, y: py + 16 }
    dx /= ld; dy /= ld
    return { x: px + dx * 15, y: py + dy * 15 }
  }

  const isMark = (id) => (mark || []).indexOf(id) !== -1
  const isDim = (id) => (dim || []).indexOf(id) !== -1
  const segId = (a, b) => a + b
  // IKKI YOZUV BIR-BIRINI BOSMASIN. Uchlar yaqin bo'lganda (shart tugunni
  // atamasa, o'quvchi C ni A ning yoniga qo'yishi mumkin) ikkala yozuv ham
  // uchidan bir xil masofada turadi va ustma-ust tushadi -- o'qib bo'lmaydi.
  // Shuning uchun avval uchala joy hisoblanadi, keyin yaqinlari bir-biridan
  // ITARILADI. Keng chizmada hech nima o'zgarmaydi: shart faqat o'n yetti
  // pikseldan yaqin yozuvlarga tegadi.
  const angSpots = {}
  if (show && show.angles && angles) {
    names.forEach((n) => { angSpots[n] = angLabelAt(n, angles[n] + '°') })
    for (let pass = 0; pass < 2; pass += 1) {
      for (let i = 0; i < names.length; i += 1) {
        for (let j = i + 1; j < names.length; j += 1) {
          const a = angSpots[names[i]]
          const b = angSpots[names[j]]
          let dx = b.x - a.x
          let dy = b.y - a.y
          let d = Math.hypot(dx, dy)
          if (d >= 17) continue
          if (d < 0.01) { dx = 0; dy = 1; d = 1 }
          const push = (17 - d) / 2
          a.x -= (dx / d) * push
          a.y -= (dy / d) * push
          b.x += (dx / d) * push
          b.y += (dy / d) * push
        }
      }
    }
  }

  const segCls = (a, b) => {
    const id1 = segId(a, b)
    const id2 = segId(b, a)
    let c = 'g7-fg-seg'
    if (isMark(id1) || isMark(id2)) c += ' is-mark'
    if (isDim(id1) || isDim(id2)) c += ' is-dim'
    return c
  }

  return (
    <>
      {/* TOPSHIRIQ EKRANIDA MATN TOPSHIRIQ SHAKLIDA. Nuqta QO'YILADIGAN
          ekranda yozuv 13,5 px va och kulrang edi: QA uni umuman payqamadi
          va «belgilash kerakligi bilinib tursin» dedi (2026-08-22). Endi
          bunday ekranda u sinfning odatiy topshiriq shaklida turadi --
          TOPSHIRIQ yorlig'i va qora qalin matn, xuddi SlotFill dagidek.
          O'qish ekranida (nuqta tayyor) yozuv izohligicha qoladi: u yerda
          harakat talab qilinmaydi. */}
      {caption ? (
        pick
          ? <Ask kind="task" tight>{t(caption)}</Ask>
          : <div className="g7-ts-cap">{t(caption)}</div>
      ) : null}

      <Slot mh={VH + 6} className="g7-drawslot" style={{ alignItems: 'center' }}>
        <div className="g7-pl-wrap">
          <svg
            viewBox={'0 0 ' + VW + ' ' + VH}
            className={'g7-fg-svg' + (waiting ? ' is-live' : '')}
            onClick={tap}
            role="img"
            aria-label={t(caption || UI.agCells)}
          >
            {/* To'r TUGUNLAR bilan beriladi, chiziq bilan emas: chizmada
                asosiy narsa figura, to'r esa faqat qayerga bosish mumkinligini
                ko'rsatadi. */}
            {/* NUQTALAR ISHLAYOTGANINI KO'RSATADI. Kutish paytida ular
                yiriklashadi va to'qlashadi -- shundagina «bosish mumkin»
                degan ma'no chiqadi; oddiy holatda esa qog'oz foni bo'lib
                qoladi (metodist 2026-08-26: «ular ishchi ekani bilinsin»).
                Bir marta TO'LQIN o'tadi: ko'chadigan uchdan boshlab, chetga
                qarab. Harakat bir martalik, chunki uzluksiz miltillash
                chizmaning o'zi bilan raqobat qilardi -- sinfda hamma puls
                sanoqli (5 marta) va reduced-motion da o'chadi. */}
            {ints(R.x0, R.x1).map((x) => ints(R.y0, R.y1).map((y) => {
              const far = waiting && move && now[move]
                ? Math.hypot(x - now[move].x, y - now[move].y)
                : 0
              return (
                <circle
                  key={'n' + x + '_' + y}
                  className={'g7-fg-node' + (waiting ? ' is-live' : '')}
                  cx={sx(x)}
                  cy={sy(y)}
                  r={waiting ? 2.2 : 1.4}
                  style={waiting ? { animationDelay: Math.min(far * 0.05, 0.62).toFixed(2) + 's' } : undefined}
                />
              )
            }))}

            {/* NUQTA NOMLARI FAQAT KO'CHIRISH PAYTIDA. Topshiriq nuqtani
                RAQAM bilan ataydi («C ni uch ; uch nuqtaga ko'chiring»), to'r
                esa yalang'och nuqtalardan iborat edi -- qaysi nuqta ekanini
                aniqlashning IMKONI yo'q edi (metodist 2026-08-25: «kak ponyat
                i nayti tochku (3; 3)»). Mexanika ishlagan, ko'rsatma
                o'qilmagan.
                Raqamlar uch ko'chirilishi bilan YO'QOLADI: geometriya
                chizmasi koordinata tekisligi emas, ular faqat shu paytda
                kerak. */}
            {waiting ? (
              <g className="g7-fg-axis">
                {ints(R.x0, R.x1).map((x) => (
                  <text key={'ax' + x} x={sx(x)} y={oy + h + 14} textAnchor="middle">{x}</text>
                ))}
                {ints(R.y0, R.y1).map((y) => (
                  <text key={'ay' + y} x={ox - 13} y={sy(y) + 3.5} textAnchor="middle">{y}</text>
                ))}
              </g>
            ) : null}

            {links.map(([a, b], i) => (
              <line
                key={'s' + i}
                className={segCls(a, b)}
                x1={sx(now[a].x)} y1={sy(now[a].y)}
                x2={sx(now[b].x)} y2={sy(now[b].y)}
              />
            ))}

            {/* Tomon uzunliklari: o'rtasida, chiziqdan bir oz nariroqda. */}
            {show && show.sides ? links.map(([a, b], i) => {
              const p = sideLabelAt(a, b)
              return (
                <text
                  key={'l' + i}
                  className={'g7-fg-len' + (isDim(segId(a, b)) ? ' is-dim' : '')}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {lenTxt(a, b)}
                </text>
              )
            }) : null}

            {/* Burchaklar: uchning yonida. */}
            {show && show.angles && angles ? names.map((n) => {
              // BURCHAK GRADUS BELGISI BILAN YOZILADI (metodist 2026-08-25):
              // chizmadagi «34» son bo'lib turardi, «34°» esa BURCHAK ekanini
              // aytadi. Belgi joy hisobiga ham kiradi: yozuv o'z eni bilan
              // beriladi, ya'ni tomonlar orasidagi masofa u bilan birga
              // o'lchanadi.
              const txt = angles[n] + '°'
              const p = angSpots[n]
              return (
                <text
                  key={'a' + n}
                  className={'g7-fg-ang' + (isMark(n) ? ' is-mark' : '') + (isDim(n) ? ' is-dim' : '')}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {txt}
                </text>
              )
            }) : null}

            {(notes || []).map((nt, i) => (
              <text
                key={'nt' + i}
                className={'g7-fg-ang' + (nt.mark ? ' is-mark' : '') + (nt.dim ? ' is-dim' : '')}
                x={sx(nt.x)}
                y={sy(nt.y)}
                textAnchor="middle"
              >
                {nt.text}
              </text>
            ))}

            {names.map((n) => (
              <g key={'p' + n} className={'g7-fg-ptg' + (move === n ? ' is-move' : '')}>
                <circle className="g7-fg-pt" cx={sx(now[n].x)} cy={sy(now[n].y)} r="4.5" />
                <text
                  className="g7-fg-name"
                  x={nameLabelAt(n).x}
                  y={nameLabelAt(n).y}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {n}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </Slot>

      {/* O'LCHOV NATIJASI «TAXMIN» deb imzolanadi -- faqat dars shuni
          so'raganda (42-darsdan boshlab). */}
      {/* O'LCHOV NATIJASI «TAXMIN» DEB IMZOLANADI (etalon § 9). Yig'indi
          ko'rsatilgan bo'lsa -- yig'indining yonida; yig'indi yo'q, lekin
          tomon yoki burchak o'lchangan bo'lsa -- alohida satrda. Aks holda
          `guess` bayrog'i darsda qo'yilib, ekranda ko'rinmay ketardi. */}
      <Slot mh={(show && show.sum) || (guess && show && (show.sides || show.angles)) ? 26 : 0}>
        {show && show.sum && angles ? (
          <span className={'g7-fg-sum' + (guess ? ' is-guess' : '')}>
            {t(UI.fgSum)} {names.map((n) => angles[n]).reduce((s2, v) => s2 + v, 0)}
            {guess ? ' -- ' + t(UI.fgGuess) : ''}
          </span>
        ) : guess && show && (show.sides || show.angles) ? (
          <span className="g7-fg-sum is-guess">
            {t(UI.fgMeasure)} -- {t(UI.fgGuess)}
          </span>
        ) : null}
      </Slot>

      <Slot mh={options ? 54 : 0}>
        {options && ready ? (
          <Options
            items={options.map((o) => ({ id: o.id, label: t(o.label) }))}
            picked={picked}
            wrong={wrong}
            onPick={choose}
            disabled={disabled}
            cols={cols}
          />
        ) : null}
      </Slot>

      <Slot mh={58}>
        <Feedback
          show={!!hint || waiting}
          ok={!!picked}
          tone={!hint && waiting ? 'neutral' : undefined}
          cap={!hint && waiting ? ACT.tap : undefined}
        >
          {hint ? t(hint) : (waiting ? t(UI.fgTapNode) : null)}
        </Feedback>
      </Slot>
    </>
  )
}
