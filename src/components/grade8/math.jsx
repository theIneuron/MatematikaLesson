// ============================================================================
// 8-sinf: MATEMATIKA MAYDONI — o'quvchi javobni YOZADI, tanlamaydi.
// Kontrakt: src/books/grade8/ETALON_8SINF.md §10.1 va §2.1
//
// Ichida: MathField (maydon + telefonda ekran klaviaturasi), javobni
// baholovchi judgeExpr / judgeOdz — ular `mathcore.js` ustida ishlaydi.
//
// Muhim qoidalar:
//   - satrni satr bilan solishtirmaydi: 2/(x-3) va -2/(3-x) bitta javob
//   - razbor bo'lmasa — bu javob xatosi EMAS, urinish SANALMAYDI
//   - xato javobga «noto'g'ri» deyilmaydi: SON va ikki qiymat ko'rsatiladi
//   - ekran klaviaturasi FAQAT telefonda (balandlik budjeti, §14)
// ============================================================================
// eslint-disable-next-line no-unused-vars -- LMS xom jsx ni KLASSIK rejimda yuklaydi
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { L, MATH_FONT, T, UI_TXT, useT } from './core.jsx'
import { checkIdentity, checkOdz, domainHoles, parse } from './mathcore.js'

const TXT = {
  place: L('javobni yozing', 'запиши ответ', 'type your answer'),
  placeOdz: L("ODZ ni yozing, masalan  a != 2", 'запиши ОДЗ, например  a != 2', 'type the domain, e.g.  a != 2'),
  placeNum: L('son', 'число', 'number'),
  none: L("qisqartirish mumkin emas", 'сокращать нечего', 'nothing to reduce'),
  wrongVar: L('Topshiriqda boshqa harf turgan.', 'В задании стоит другая буква.', 'The task uses a different letter.'),
  domainMine: L(
    'Bu qiymatda sizning yozuvingizda qiymat yo\'q, javobda esa bor. Yozuvlar teng emas.',
    'При этом значении у твоей записи значения нет, а у ответа есть. Записи не равны.',
    'At this value your record has no value while the answer does. The records are not equal.',
  ),
  domainRef: L(
    "Bu qiymatda javobda qiymat yo'q, sizning yozuvingizda esa bor. Aniqlanish sohasi boshqa.",
    'При этом значении у ответа значения нет, а у твоей записи есть. Область определения другая.',
    'At this value the answer has no value while your record does. The domain differs.',
  ),
  odzExtra: L(
    'Bu qiymatni taqiqlash shart emas: qo\'ying va ko\'ring, kasr hisoblanadi.',
    'Это значение запрещать не надо: подставь и посмотри, дробь считается.',
    'This value need not be excluded: substitute it and the fraction still works.',
  ),
  odzMissing: L(
    'Bitta shart yetmaydi: maxrajda yana bir ko\'paytuvchi bor.',
    'Одного условия не хватает: в знаменателе есть ещё один множитель.',
    'One condition is missing: the denominator has another factor.',
  ),
  odzForm: L(
    "ODZ « != » bilan yoziladi, masalan  a != 2.",
    'ОДЗ записывают через « != », например  a != 2.',
    'Write the domain with « != », for example  a != 2.',
  ),
}

// --------------------------------------------------------------------------
// Telefonmi. Klaviatura balandligi faqat telefonda budjetga kiradi.
// --------------------------------------------------------------------------
export function useIsPhone(breakpoint = 640) {
  const [phone, setPhone] = useState(() => (typeof window === 'undefined' ? false : window.innerWidth < breakpoint))
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const apply = () => setPhone(window.innerWidth < breakpoint)
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [breakpoint])
  return phone
}

// --------------------------------------------------------------------------
// Javobni baholash. Qaytadi: { ok, why, note, at, mine, ref }
//   why: 'ok' | 'parse' | 'vars' | 'value' | 'domain'
// `hints` — aynan shu noto'g'ri yozuv uchun yozilgan razbor (dars ma'lumoti).
// Bo'lmasa — kontrprimer o'zi gapiradi: son va ikki qiymat.
// --------------------------------------------------------------------------
export function judgeExpr(mine, task) {
  const src = String(mine || '').trim()
  if (!src) return { ok: false, why: 'empty' }
  const hints = task.hints || {}
  const p = parse(src)
  if (p.error) return { ok: false, why: 'parse', note: UI_TXT.writeMore, at: p.error.pos }

  // Darsda yozilgan razbor bo'lsa — aynan u ishlatiladi.
  const keyed = matchHint(src, hints)

  const r = checkIdentity(src, task.answer, { seed: task.seed })
  if (r.ok) return { ok: true, points: r.points }
  if (r.why === 'vars') return { ok: false, why: 'vars', note: keyed || TXT.wrongVar }
  if (r.why === 'value') {
    return {
      ok: false, why: 'value', note: keyed || null,
      at: pointText(r.point), mine: r.mine, ref: r.ref,
    }
  }
  if (r.why === 'domain') {
    return {
      ok: false, why: 'domain',
      note: keyed || (r.side === 'mine' ? TXT.domainMine : TXT.domainRef),
      at: pointText(r.point),
    }
  }
  return { ok: false, why: r.why || 'no', note: keyed || null }
}

export function judgeOdz(mine, task) {
  const src = String(mine || '').trim()
  if (!src) return { ok: false, why: 'empty' }
  const hints = task.hints || {}
  const keyed = matchHint(src, hints)
  const ref = task.excluded || (task.of ? domainHoles(task.of, task.varName).holes : [])
  const r = checkOdz(src, ref, task.varName)
  if (r.ok) return { ok: true, excluded: r.excluded }
  if (r.why === 'parse') return { ok: false, why: 'parse', note: keyed || TXT.odzForm }
  if (r.why === 'extra') return { ok: false, why: 'extra', note: keyed || TXT.odzExtra, at: fmtNum(r.value) }
  return { ok: false, why: 'missing', note: keyed || TXT.odzMissing, at: fmtNum(r.value) }
}

// Razborlar kaliti — yozuvning o'zi. Bo'shliqlar va yulduzcha e'tiborga olinmaydi,
// shuning uchun «2a» va «2*a» bitta kalit.
function normKey(s) {
  return String(s || '').replace(/\s+/g, '').replace(/\*/g, '').replace(/[−–]/g, '-').toLowerCase()
}
function matchHint(src, hints) {
  const k = normKey(src)
  for (const key of Object.keys(hints)) if (normKey(key) === k) return hints[key]
  return null
}

function fmtNum(v) {
  if (v === null || v === undefined) return ''
  return Number.isInteger(v) ? String(v) : String(v)
}
function pointText(point) {
  if (!point) return ''
  return Object.keys(point).map((k) => k + ' = ' + fmtNum(point[k])).join(', ')
}

// --------------------------------------------------------------------------
// MathField. kind: 'expr' | 'odz' | 'number'
// `none` — «qisqartirish mumkin emas» tugmasi; barcha topshiriqlarda turadi,
// aks holda o'quvchi uni PAYDO BO'LGANI uchun bosadi (raskadrovka, ekran 9).
// --------------------------------------------------------------------------
export const MathField = ({
  value, onChange, onSubmit, kind = 'expr', disabled, done,
  none, onNone, noneLabel, placeholder, label, width,
}) => {
  const t = useT()
  const phone = useIsPhone()
  const ref = useRef(null)
  const [focus, setFocus] = useState(false)

  const insert = useCallback((text) => {
    const el = ref.current
    const cur = String(value || '')
    if (!el) { onChange(cur + text); return }
    const a = el.selectionStart == null ? cur.length : el.selectionStart
    const b = el.selectionEnd == null ? a : el.selectionEnd
    const next = cur.slice(0, a) + text + cur.slice(b)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      const pos = a + text.length
      try { el.setSelectionRange(pos, pos) } catch { /* ba'zi brauzerlar */ }
    })
  }, [value, onChange])

  const backspace = useCallback(() => {
    const el = ref.current
    const cur = String(value || '')
    if (!el) { onChange(cur.slice(0, -1)); return }
    const a = el.selectionStart == null ? cur.length : el.selectionStart
    const b = el.selectionEnd == null ? a : el.selectionEnd
    if (a === b && a === 0) return
    const from = a === b ? a - 1 : a
    const next = cur.slice(0, from) + cur.slice(b)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      try { el.setSelectionRange(from, from) } catch { /* ba'zi brauzerlar */ }
    })
  }, [value, onChange])

  const ph = placeholder || (kind === 'odz' ? TXT.placeOdz : kind === 'number' ? TXT.placeNum : TXT.place)

  return (
    // `width` berilgan bo'lsa maydon KONTENT bo'yicha qisqaradi. Aks holda
    // «son qo'ying» maydoni butun kenglikka cho'zilib, ikki belgili son uchun
    // 1600 piksel egallardi.
    <div className={'g8-field-wrap' + (width ? ' g8-field-narrow' : '')}>
      <div className={'g8-field' + (done ? ' g8-field-done' : '') + (focus ? ' g8-field-on' : '')}>
        {label ? <span className="g8-field-label">{t(label)}</span> : null}
        <input
          ref={ref}
          className="g8-input"
          style={width ? { width } : undefined}
          value={value || ''}
          placeholder={t(ph)}
          disabled={disabled || done}
          inputMode={kind === 'number' ? 'numeric' : 'text'}
          autoComplete="off"
          spellCheck="false"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && onSubmit) { e.preventDefault(); onSubmit() } }}
        />
        {onSubmit ? (
          <button type="button" className="g8-field-go" onClick={onSubmit} disabled={disabled || done || !String(value || '').trim()}>
            {t(UI_TXT.check)}
          </button>
        ) : null}
      </div>
      {/* Tugma YOZUV bilan emas, TUGMA bilan beriladi (§10.1). Yozuvi darsga
          qarab o'zgaradi: 1-darsda «taqiqlangan qiymat yo'q», 3-darsda
          «qisqartirish mumkin emas» — shuning uchun `noneLabel`. */}
      {none ? (
        <button type="button" className="g8-none" onClick={onNone} disabled={disabled || done}>
          {t(noneLabel || TXT.none)}
        </button>
      ) : null}
      {phone && !done && !disabled ? <Keyboard kind={kind} onKey={insert} onBack={backspace} /> : null}
    </div>
  )
}

// Ekran klaviaturasi. Ikki qator (§10.1). Kompyuterda YO'Q.
const ROW_NUM = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'x', 'y', 'n']
const ROW_OP = ['+', '-', '*', '/', '(', ')', '^', 'sqrt(', 'abs(', '!=']

const Keyboard = ({ kind, onKey, onBack }) => (
  <div className="g8-kb">
    <div className="g8-kb-row">
      {ROW_NUM.map((k) => (
        <button type="button" key={k} className="g8-key" onClick={() => onKey(k)}>{k}</button>
      ))}
    </div>
    <div className="g8-kb-row">
      {ROW_OP.filter((k) => kind !== 'number' || k === '-').map((k) => (
        <button type="button" key={k} className="g8-key" onClick={() => onKey(k)}>
          {k === 'sqrt(' ? '√(' : k === 'abs(' ? '|(' : k === '!=' ? '≠' : k}
        </button>
      ))}
      <button type="button" className="g8-key g8-key-w" onClick={onBack}>⌫</button>
    </div>
  </div>
)

export const MATH_STYLES = `
/* ============ MATEMATIKA MAYDONI (11-sinf tili) ============
   Chegara chizig'i EMAS, ichki halqa va yumshoq soya: qog'oz yuza. */
.g8-field-wrap { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; min-width: 0; }
/* Tor maydon: kontent bo'yicha, chapga tekislanadi. */
.g8-field-narrow { align-self: flex-start; max-width: 100%; }
.g8-field-narrow .g8-input { flex: 0 0 auto; }
.g8-field {
  display: flex; align-items: center; gap: 10px;
  min-height: 44px;
  padding: 0 6px 0 13px;
  border: 0;
  border-radius: 13px;
  background: ${T.paper};
  box-shadow: 0 8px 20px -14px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  transition: box-shadow .24s cubic-bezier(.22,.61,.36,1);
  min-width: 0;
}
.g8-field-on { box-shadow: 0 10px 24px -14px rgba(${T.accentRgb},.4), inset 0 0 0 1.5px rgba(${T.accentRgb},.5); }
.g8-field-done { background: ${T.okSoft}; box-shadow: inset 0 0 0 1px rgba(${T.okRgb},.32); }
/* Yozuv QISQARADI va KO'CHADI. flex-shrink: 0 turgan paytda uzun yozuv
   maydonni va «Tekshirish» tugmasini o'ng chetdan CHIQARIB yuborardi: 390 px
   da tugma x = 475 da turgan, ya'ni ekranda YO'Q edi, va overflow clip
   sababli skroll ham yo'q — izsiz g'oyib bo'lgan (o'lchandi 2026-08-13,
   12-ekran). Bu §14 dagi «monoshirinali nowrap chetdan chiqib ketadi» ning
   aynan o'zi, faqat boshqa joyda.
   DIQQAT: STYLES ichida BEKTIK ishlatilmaydi — u shablon satrni uzib
   qo'yadi va fayl yig'ilmaydi (shu izohda aynan shunday bo'ldi). */
.g8-field-label {
  flex-shrink: 1;
  min-width: 0;
  max-width: 46%;
  overflow-wrap: anywhere;
  font-family: 'Manrope', sans-serif;
  font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
  line-height: 1.25;
  color: ${T.ink3}; font-weight: 700;
}
/* Kiritish maydoni SERIF: o'quvchi yozgan narsa ekranda ham darslikdagidek
   ko'rinishi kerak, jadval kabi emas. */
.g8-input {
  flex: 1; min-width: 40px;
  border: 0; outline: none; background: transparent;
  font-family: ${MATH_FONT};
  font-variant-numeric: tabular-nums lining-nums;
  font-weight: 600;
  word-spacing: .1em;
  font-size: clamp(16px, 1.5vw, 19px); color: ${T.ink};
  padding: 8px 0;
}
.g8-input::placeholder { color: ${T.ink4}; font-size: 13px; font-weight: 400; }
.g8-input:disabled { color: ${T.ink2}; }
.g8-field-go {
  flex-shrink: 0;
  height: 34px; padding: 0 14px;
  border: 0; border-radius: 10px;
  background: ${T.accent}; color: #fff;
  font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 18px -10px rgba(${T.accentRgb},.7);
  transition: transform .24s cubic-bezier(.22,.61,.36,1), background .24s;
}
.g8-field-go:hover:not(:disabled) { transform: translateY(-1px); background: #B44822; }
.g8-field-go:disabled { opacity: .3; cursor: not-allowed; box-shadow: none; transform: none; }
.g8-none {
  align-self: flex-start;
  min-height: 32px; padding: 0 12px;
  border: 0; border-radius: 10px;
  background: rgba(255,253,248,.6); color: ${T.ink2};
  font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px ${T.line};
  transition: transform .24s cubic-bezier(.22,.61,.36,1), color .24s;
}
.g8-none:hover:not(:disabled) { transform: translateY(-1px); color: ${T.ink}; }
.g8-none:disabled { opacity: .4; cursor: default; }

/* ============ KLAVIATURA: 44 + 44 piksel, FAQAT telefonda (§14) ============ */
.g8-kb { display: flex; flex-direction: column; gap: 5px; }
.g8-kb-row { display: flex; flex-wrap: wrap; gap: 4px; }
.g8-key {
  min-width: 26px; height: 30px; padding: 0 7px;
  border: 0; border-radius: 9px;
  background: ${T.paper}; color: ${T.ink};
  font-family: ${MATH_FONT}; font-weight: 600; font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px -9px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line};
}
.g8-key:active { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px rgba(${T.accentRgb},.4); }
.g8-key-w { min-width: 38px; }
`
