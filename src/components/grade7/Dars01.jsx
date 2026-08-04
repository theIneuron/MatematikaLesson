import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { useAudio, useSfx } from '@lesson/runtime'

const LESSON_ID = 'math-7-01-v1'
const HOOK_SCREEN = 0
const FIRST_THEORY_SCREEN = 1
const LAST_THEORY_SCREEN = 7
const FIRST_APPLICATION_SCREEN = 8
const LAST_APPLICATION_SCREEN = 12
const PRACTICE_SCREEN = 13
const SUMMARY_SCREEN = 14
const TOTAL_SCREENS = SUMMARY_SCREEN + 1
const FREE_NAV = import.meta.env.DEV

const C = {
  bg: '#F6F4EF',
  paper: '#ffffff',
  text: '#0E0E10',
  muted: '#5A5A60',
  primary: '#FF4F28',
  primarySoft: '#FFE8E1',
  green: '#1F7A4D',
  greenSoft: '#E3F0E8',
  yellow: '#D8A93A',
  yellowSoft: '#FBF3D6',
  blue: '#019ACB',
  blueSoft: '#EAF6FB',
  red: '#FF4F28',
  redSoft: '#FFE8E1',
  subtle: '#A7A6A2',
  line: 'rgba(167, 166, 162, .25)',
  inkSoft: '#FDFBF7',
}

const F = {
  sans: '"Manrope", "Inter", system-ui, sans-serif',
  serif: '"Source Serif 4", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
}

const MOTION_STYLES = `
@keyframes g7-fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes g7-ambient-float {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(8px, -14px); }
  66% { transform: translate(-10px, 8px); }
}
@keyframes g7-wrong-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
@keyframes g7-option-pop {
  0% { transform: scale(.96); }
  55% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
@keyframes g7-hook-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes g7-hook-sheen {
  0% { transform: translateX(-130%); }
  55%, 100% { transform: translateX(250%); }
}
@keyframes g7-result-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.055); }
}
@keyframes g7-score-pop {
  0% { opacity: 0; transform: translateY(-8px) scale(.8); }
  100% { opacity: 1; transform: none; }
}
@keyframes g7-success-settle {
  0% { opacity: 0; transform: scale(.62) rotate(-10deg); }
  58% { opacity: 1; transform: scale(1.16) rotate(3deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}
@keyframes g7-error-nudge {
  0%, 100% { transform: translateX(0); }
  30% { transform: translateX(-3px); }
  70% { transform: translateX(3px); }
}
@keyframes g7-slot-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 79, 40, 0); }
  50% { box-shadow: 0 0 0 4px rgba(255, 79, 40, .10); }
}
@keyframes g7-rule-in {
  from { opacity: 0; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes g7-confetti-fall {
  0% { opacity: 0; transform: translate3d(0, -12px, 0) rotate(0); }
  18% { opacity: .9; }
  100% { opacity: 0; transform: translate3d(var(--g7-confetti-x), 72px, 0) rotate(var(--g7-confetti-r)); }
}
@keyframes g7-teach-reveal {
  0% { opacity: 0; transform: translateY(9px) scale(.98); }
  70% { opacity: 1; transform: translateY(0) scale(1.012); }
  100% { opacity: 1; transform: none; }
}
@keyframes g7-teach-focus {
  0%, 100% { box-shadow: 0 0 0 0 rgba(1, 154, 203, 0); }
  50% { box-shadow: 0 0 0 4px rgba(1, 154, 203, .10); }
}
@keyframes g7-formula-scan {
  0% { transform: translateX(-125%); opacity: 0; }
  20% { opacity: .8; }
  70%, 100% { transform: translateX(270%); opacity: 0; }
}
@keyframes g7-solution-dock {
  0% { opacity: 1; transform: translateY(6px) scale(.985); }
  72% { opacity: 1; transform: translateY(0) scale(1.006); }
  100% { opacity: 1; transform: none; }
}
@keyframes g7-formula-lock {
  0% { transform: scale(.97); color: #0E0E10; }
  62% { transform: scale(1.035); color: #1F7A4D; }
  100% { transform: none; color: #1F7A4D; }
}
@keyframes g7-flow-arrive {
  0% { opacity: 0; transform: translateX(-8px) scale(.96); }
  70% { opacity: 1; transform: translateX(0) scale(1.02); }
  100% { opacity: 1; transform: none; }
}
@keyframes g7-path-draw {
  from { transform: scaleX(0); opacity: 0; }
  to { transform: scaleX(1); opacity: 1; }
}
@keyframes g7-bracket-breathe {
  0%, 100% { transform: scaleY(1); opacity: .72; }
  50% { transform: scaleY(1.08); opacity: 1; }
}
@keyframes g7-level-lift {
  0% { opacity: 0; transform: translateY(8px); }
  72% { opacity: 1; transform: translateY(-2px); }
  100% { opacity: 1; transform: none; }
}
@keyframes g7-lane-scan {
  0% { transform: translateX(0); }
  50%, 100% { transform: translateX(var(--g7-lane-distance)); }
}
@keyframes g7-audit-strike {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes g7-rule-pop {
  0% { opacity: 0; transform: translateY(7px) scale(.94); }
  70% { opacity: 1; transform: translateY(0) scale(1.025); }
  100% { opacity: 1; transform: none; }
}
.g7-fade-up { animation: g7-fade-in-up .4s ease-out both; }
.g7-delay-1 { animation-delay: .12s; }
.g7-delay-2 { animation-delay: .24s; }
.g7-delay-3 { animation-delay: .36s; }
.g7-panel { animation: g7-fade-in-up .4s ease-out both; }
.g7-option {
  min-width: 0;
  width: 100%;
  transition: transform .16s ease, box-shadow .2s ease, background .2s ease;
}
.g7-option:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #FDFBF7 !important;
  box-shadow: 0 10px 22px -6px rgba(58, 53, 48, .22) !important;
}
.g7-option:active:not(:disabled) { transform: translateY(0) scale(.985); }
.g7-option.g7-selected {
  animation: g7-option-pop .5s cubic-bezier(.34, 1.56, .64, 1) both;
}
.g7-option.g7-selected:hover { background: #FFE8E1 !important; }
.g7-option.g7-correct-choice,
.g7-option.g7-correct-choice:hover {
  background: #E3F0E8 !important;
}
.g7-primary-action, .g7-ghost-action, .g7-icon-action {
  transition: transform .16s ease, box-shadow .2s ease, background .2s ease;
}
.g7-input {
  transition: box-shadow .2s ease, background .2s ease, transform .2s ease;
}
.g7-input:focus {
  box-shadow: 0 10px 22px -6px rgba(255, 79, 40, .30), 0 0 0 1px rgba(255, 79, 40, .20) !important;
  transform: translateY(-1px);
}
.g7-primary-action:hover:not(:disabled) {
  background: #FF4F28 !important;
  color: #FFFFFF !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -6px rgba(255, 79, 40, .45) !important;
}
.g7-primary-action svg { transition: transform .2s ease; }
.g7-primary-action:hover:not(:disabled) svg { transform: translateX(2px); }
.g7-primary-action:active:not(:disabled),
.g7-ghost-action:active:not(:disabled),
.g7-icon-action:active:not(:disabled) { transform: scale(.96); }
.g7-ghost-action:hover:not(:disabled) { background: #FFFFFF !important; }
.g7-icon-action:hover:not(:disabled) { color: #FF4F28 !important; }
.g7-wrong-shake { animation: g7-wrong-shake .4s ease; }
.g7-ambient-orb {
  position: absolute;
  border-radius: 50%;
  opacity: .7;
  animation: g7-ambient-float 15s ease-in-out infinite;
}
.g7-hook-visual {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  animation:
    g7-fade-in-up .4s ease-out .12s both,
    g7-hook-float 5.5s ease-in-out .55s infinite;
}
.g7-hook-visual::after {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 42%;
  pointer-events: none;
  background: linear-gradient(105deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0));
  transform: translateX(-130%);
  animation: g7-hook-sheen 3.4s ease-in-out infinite;
}
.g7-result-a, .g7-result-b {
  transform-box: fill-box;
  transform-origin: center;
  animation: g7-result-pulse 2.8s ease-in-out infinite;
}
.g7-result-b { animation-delay: -1.4s; }
.g7-score-pop { animation: g7-score-pop .4s cubic-bezier(.34, 1.3, .5, 1) both; }
.g7-success-mark, .g7-error-mark {
  flex: 0 0 auto;
  display: inline-grid;
  place-items: center;
}
.g7-success-mark { animation: g7-success-settle .52s cubic-bezier(.34, 1.56, .64, 1) both; }
.g7-error-mark { animation: g7-error-nudge .38s ease both; }
.g7-sequence-filled { animation: g7-option-pop .45s cubic-bezier(.34, 1.56, .64, 1) both; }
.g7-sequence-next { animation: g7-slot-pulse 1.6s ease-in-out infinite; }
.g7-rule-in { animation: g7-rule-in .4s ease-out both; }
.g7-lesson-root,
.g7-lesson-root *,
.g7-lesson-root *::before,
.g7-lesson-root *::after {
  box-sizing: border-box;
}
.g7-textbook-math {
  display: inline-block;
  max-width: 100%;
  color: inherit;
  font-family: "Source Serif 4", Georgia, serif;
  font-weight: 700;
  font-variant-numeric: lining-nums tabular-nums;
  line-height: 1.12;
  letter-spacing: .005em;
  vertical-align: middle;
}
.g7-math-row {
  display: block;
  min-height: 1em;
  white-space: normal;
}
.g7-math-row + .g7-math-row { margin-top: .28em; }
.g7-math-fragment { white-space: pre-wrap; }
.g7-math-frac {
  display: inline-flex;
  min-width: 1.55em;
  margin: 0 .12em;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  line-height: .92;
  text-align: center;
  vertical-align: middle;
  transform: translateY(.08em);
}
.g7-math-frac-num,
.g7-math-frac-den {
  display: block;
  padding: .03em .2em;
  white-space: nowrap;
}
.g7-math-frac-num {
  padding-bottom: .09em;
  border-bottom: .075em solid currentColor;
}
.g7-math-frac-den { padding-top: .09em; }
.g7-inline-math {
  margin: 0 .08em;
  font-size: 1.04em;
  white-space: nowrap;
}
.g7-math-button {
  justify-content: center !important;
  text-align: center !important;
}
.g7-math-button .g7-textbook-math { font-size: 1.14em; }
.g7-control-block {
  display: grid;
  gap: 9px;
  align-content: start;
}
.g7-action-row {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  flex-wrap: wrap;
}
.g7-confetti {
  position: absolute;
  top: 0;
  width: 6px;
  height: 10px;
  border-radius: 2px;
  pointer-events: none;
  animation: g7-confetti-fall 1.8s ease-in infinite;
}
.g7-teach-step {
  opacity: .22;
  transform: scale(.985);
  transition: opacity .3s ease, transform .3s ease, box-shadow .3s ease, background .3s ease;
}
.g7-teach-step.g7-visible {
  opacity: 1;
  transform: none;
  animation: g7-teach-reveal .48s cubic-bezier(.16, 1, .3, 1) both;
}
.g7-teach-step.g7-active {
  background: #EAF6FB !important;
  animation:
    g7-teach-reveal .48s cubic-bezier(.16, 1, .3, 1) both,
    g7-teach-focus 2.2s ease-in-out .5s infinite;
}
.g7-question-visual {
  position: relative;
  overflow: hidden;
}
.g7-question-visual::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 38%;
  height: 3px;
  border-radius: 99px;
  background: #019ACB;
  animation: g7-formula-scan 2.4s ease-in-out infinite;
}
.g7-question-visual.g7-solved::after { display: none; }
.g7-question-visual.g7-solved .g7-practice-formula {
  animation: g7-formula-lock .52s cubic-bezier(.16, 1, .3, 1) both;
}
.g7-solution-frame { animation: g7-solution-dock .5s cubic-bezier(.16, 1, .3, 1) both; }
.g7-solution-frame > .g7-panel { animation: none; }
.g7-practice-dot {
  transition: width .25s ease, background .25s ease, box-shadow .25s ease;
}
.g7-theory-flow-node {
  animation: g7-flow-arrive .48s cubic-bezier(.16, 1, .3, 1) both;
}
.g7-theory-connector {
  transform-origin: left center;
  animation: g7-path-draw .4s ease-out both;
}
.g7-bracket-mark {
  display: inline-block;
  color: #FF4F28;
  transform-origin: center;
  animation: g7-bracket-breathe 2s ease-in-out infinite;
}
.g7-level-active {
  animation:
    g7-level-lift .45s cubic-bezier(.16, 1, .3, 1) both,
    g7-teach-focus 2.2s ease-in-out .45s infinite;
}
.g7-lane-cursor {
  --g7-lane-distance: 156px;
  animation: g7-lane-scan 2.4s cubic-bezier(.4, 0, .2, 1) infinite;
}
.g7-audit-wrong {
  position: relative;
}
.g7-audit-wrong::after {
  content: "";
  position: absolute;
  left: 8%;
  right: 8%;
  top: 50%;
  height: 3px;
  border-radius: 99px;
  background: #FF4F28;
  transform-origin: left center;
  animation: g7-audit-strike .42s ease-out both;
}
.g7-rule-card {
  animation: g7-rule-pop .45s cubic-bezier(.16, 1, .3, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .g7-fade-up, .g7-panel, .g7-option, .g7-wrong-shake, .g7-ambient-orb,
  .g7-hook-visual, .g7-hook-visual::after, .g7-result-a, .g7-result-b,
  .g7-score-pop, .g7-success-mark, .g7-error-mark, .g7-sequence-filled,
  .g7-sequence-next, .g7-rule-in, .g7-confetti, .g7-teach-step,
  .g7-question-visual::after, .g7-practice-formula, .g7-solution-frame,
  .g7-theory-flow-node, .g7-theory-connector, .g7-bracket-mark,
  .g7-level-active, .g7-lane-cursor, .g7-audit-wrong::after, .g7-rule-card {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
@media (max-width: 720px) {
  .g7-lane-cursor { --g7-lane-distance: 92px; }
}
`

const L = (uz, ru, en) => ({ uz, ru, en })
const A = (uz, ru, en) => L(
  `[O'zbekcha tallaffuz] ${uz}`,
  `[Русское произношение] ${ru}`,
  `[English pronunciation] ${en}`,
)
const tr = (value, lang) => value?.[lang] ?? value?.uz ?? value ?? ''

const MATH_OPERAND = String.raw`(?:\([^()\n]+\)|[−-]?\d+(?:[.,]\d+)?|[A-Za-zА-Яа-яЁё]+(?:\([^()\n]*\))?)`
const FRACTION_RE = new RegExp(`(${MATH_OPERAND})\\s*/\\s*(${MATH_OPERAND})`, 'g')
const EMBEDDED_MATH_RE = /(?:\([^()\n]*\)|[−-]?\d+(?:[.,]\d+)?)(?:\s*[+−·×:÷/=≠→]\s*(?:\([^()\n]*\)|[−-]?\d+(?:[.,]\d+)?))+/g

const mathSource = (value, lang) => String(tr(value, lang) ?? '')

const unwrapMathGroup = (value) => {
  const source = String(value).trim()
  return source.startsWith('(') && source.endsWith(')')
    ? source.slice(1, -1).trim()
    : source
}

function MathFraction({ numerator, denominator, color }) {
  return (
    <span className="g7-math-frac" style={{ color }} aria-hidden="true">
      <span className="g7-math-frac-num">{unwrapMathGroup(numerator)}</span>
      <span className="g7-math-frac-den">{unwrapMathGroup(denominator)}</span>
    </span>
  )
}

function renderMathRow(source, fractionColor) {
  const pieces = []
  const fractionRe = new RegExp(FRACTION_RE.source, 'g')
  let lastIndex = 0
  let match
  let key = 0
  while ((match = fractionRe.exec(source)) !== null) {
    if (match.index > lastIndex) {
      pieces.push(<span className="g7-math-fragment" key={`text-${key}`}>{source.slice(lastIndex, match.index)}</span>)
    }
    pieces.push(
      <MathFraction
        key={`fraction-${key}`}
        numerator={match[1]}
        denominator={match[2]}
        color={fractionColor}
      />,
    )
    lastIndex = match.index + match[0].length
    key += 1
  }
  if (lastIndex < source.length) {
    pieces.push(<span className="g7-math-fragment" key={`text-${key}`}>{source.slice(lastIndex)}</span>)
  }
  return pieces.length ? pieces : source
}

function TextbookMath({ value, lang, fractionColor, className = '', style = {} }) {
  const source = mathSource(value, lang)
  return (
    <span
      className={`g7-textbook-math${className ? ` ${className}` : ''}`}
      role="math"
      aria-label={source}
      style={style}
    >
      {source.split('\n').map((row, index) => (
        <span className="g7-math-row" key={`${row}-${index}`}>
          {renderMathRow(row, fractionColor)}
        </span>
      ))}
    </span>
  )
}

function RichMathText({ value, lang }) {
  const source = mathSource(value, lang)
  const pieces = []
  const embeddedMathRe = new RegExp(EMBEDDED_MATH_RE.source, 'g')
  let lastIndex = 0
  let match
  let key = 0
  while ((match = embeddedMathRe.exec(source)) !== null) {
    if (match.index > lastIndex) pieces.push(source.slice(lastIndex, match.index))
    pieces.push(<TextbookMath value={match[0]} key={`math-${key}`} className="g7-inline-math" />)
    lastIndex = match.index + match[0].length
    key += 1
  }
  if (lastIndex < source.length) pieces.push(source.slice(lastIndex))
  return pieces.length ? pieces : source
}

const isMathOnly = (value, lang) => {
  const source = mathSource(value, lang)
  return /\d/.test(source)
    && /[+−·×:÷/=≠→()]/.test(source)
    && !/[A-Za-zА-Яа-яЁё]{2,}/.test(source)
}

const hasVerticalFraction = (value, lang) => /\//.test(mathSource(value, lang))

const UI = {
  back: L('Orqaga', 'Назад', 'Back'),
  next: L('Davom etish', 'Дальше', 'Continue'),
  check: L('Tekshirish', 'Проверить', 'Check'),
  retry: L('Yana urinib ko‘ring', 'Попробуй ещё раз', 'Try again'),
  hint: L('Maslahat', 'Подсказка', 'Hint'),
  finish: L('Darsni tugatish', 'Завершить урок', 'Finish lesson'),
  correct: L('To‘g‘ri yo‘l topildi.', 'Верный ход найден.', 'You found the correct step.'),
  choose: L('Variantni tanlang', 'Выбери вариант', 'Choose an option'),
  selected: L('Tanlangan', 'Выбрано', 'Selected'),
  reset: L('Qayta boshlash', 'Начать заново', 'Start again'),
  listening: L('Ovoz ketmoqda', 'Идёт озвучивание', 'Narration is playing'),
  replay: L('Qayta tinglash', 'Повторить озвучивание', 'Replay narration'),
  mute: L('Ovozni o‘chirish', 'Выключить звук', 'Mute'),
  unmute: L('Ovozni yoqish', 'Включить звук', 'Unmute'),
}

const SOURCE_SCREENS = [
  {
    type: 'hook',
    scope: 'hook',
    phase: L('Muammo', 'Проблема', 'Problem'),
    kicker: L('BIR YOZUV — IKKI JAVOB', 'ОДНА ЗАПИСЬ — ДВА ОТВЕТА', 'ONE EXPRESSION — TWO ANSWERS'),
    title: L('Nega ikkita javob chiqdi?', 'Почему получились два ответа?', 'Why are there two answers?'),
    lead: L(
      'Bir xil 18 − 6 : 3 + 4 ifodasi uchun 20 va 8 javoblari olingan.',
      'Для одного выражения 18 − 6 : 3 + 4 получили ответы 20 и 8.',
      'The same expression, 18 − 6 : 3 + 4, produced the answers 20 and 8.',
    ),
    hint: L(
      'Muammo sonlarda emas, amallarni qaysi tartibda bajarishda bo‘lishi mumkin.',
      'Проблема может быть не в числах, а в порядке выполнения действий.',
      'The issue may be the order of operations rather than the numbers.',
    ),
    audio: A(
      'Bir xil sonli ifoda ikki xil javob berdi. Sababini topish uchun amallar tartibini tekshiramiz.',
      'Одно числовое выражение дало два разных ответа. Проверим порядок действий и найдём причину.',
      'One numerical expression produced two answers. Check the order of operations to find the reason.',
    ),
  },
  {
    type: 'exploration',
    scope: null,
    phase: L('Muammo', 'Проблема', 'Problem'),
    kicker: L('KIRISH DIAGNOSTIKASI', 'ВХОДНАЯ ДИАГНОСТИКА', 'ENTRY CHECK'),
    title: L('Uchta tayanch ko‘nikma', 'Три опорных навыка', 'Three foundation skills'),
    lead: L(
      'Qavslar, amal darajasi va chapdan o‘ngga tartibni qisqa topshiriqlarda eslang.',
      'Вспомни скобки, приоритет действий и движение слева направо.',
      'Recall brackets, operation priority and left-to-right order.',
    ),
    hint: L(
      'Bu baho emas. Javoblar keyingi tushuntirishni moslashtirishga yordam beradi.',
      'Это не оценка. Ответы помогут настроить дальнейшее объяснение.',
      'This is not a grade. Your answers help shape the explanation.',
    ),
    audio: A(
      'Yangi mavzu oldidan uchta tanish ko‘nikmani faollashtiramiz. Har bir qatorda bitta javobni tanlang.',
      'Перед новой темой активируем три знакомых навыка. Выбери один ответ в каждой строке.',
      'Before the new topic, activate three familiar skills. Choose one answer in each row.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Tuzilish', 'Структура', 'Structure'),
    kicker: L('IFODANING ANATOMIYASI', 'АНАТОМИЯ ВЫРАЖЕНИЯ', 'ANATOMY OF AN EXPRESSION'),
    title: L('Sonlar va amal belgilarini ajrating', 'Отдели числа от знаков действий', 'Separate numbers from operation signs'),
    lead: L(
      '18 − 6 : 3 + 4 yozuvidagi barcha amal belgilarini tanlang.',
      'Выбери все знаки действий в записи 18 − 6 : 3 + 4.',
      'Select every operation sign in 18 − 6 : 3 + 4.',
    ),
    hint: L(
      'Amal belgisi ikki son bilan nima qilish kerakligini ko‘rsatadi.',
      'Знак действия показывает, что нужно сделать с числами.',
      'An operation sign tells us what to do with the numbers.',
    ),
    audio: A(
      'Ifodada sonlar va amal belgilari bor. Ayirish, bo‘lish va qo‘shish belgilarini tanlang.',
      'В выражении есть числа и знаки действий. Выбери знаки вычитания, деления и сложения.',
      'The expression contains numbers and operation signs. Select subtraction, division and addition.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Tuzilish', 'Структура', 'Structure'),
    kicker: L('MATEMATIK OBYEKT', 'МАТЕМАТИЧЕСКИЙ ОБЪЕКТ', 'MATHEMATICAL OBJECT'),
    title: L('Ifoda, tenglik yoki taqiqlangan yozuv?', 'Выражение, равенство или недопустимая запись?', 'Expression, equality or invalid notation?'),
    lead: L(
      'Har bir yozuvning turini aniqlang.',
      'Определи тип каждой записи.',
      'Identify the type of each notation.',
    ),
    hint: L(
      'Tenglikda tenglik belgisi bor. Nolga bo‘lish mumkin emas.',
      'В равенстве есть знак равенства. Делить на ноль нельзя.',
      'An equality has an equals sign. Division by zero is undefined.',
    ),
    audio: A(
      'Uchta yozuvni sonli ifoda, sonli tenglik va taqiqlangan yozuv guruhlariga ajrating.',
      'Распредели три записи по группам: числовое выражение, числовое равенство и недопустимая запись.',
      'Sort the three notations into numerical expression, numerical equality and invalid notation.',
    ),
  },
  {
    type: 'exploration',
    scope: null,
    phase: L('Tuzilish', 'Структура', 'Structure'),
    kicker: L('IFODA VA QIYMAT', 'ВЫРАЖЕНИЕ И ЗНАЧЕНИЕ', 'EXPRESSION AND VALUE'),
    title: L('Yozuvdan songacha bo‘lgan yo‘l', 'Путь от записи к числу', 'The path from notation to number'),
    lead: L(
      'Uchta bosqichni mantiqiy tartibga qo‘ying.',
      'Расположи три этапа в логическом порядке.',
      'Arrange the three stages in logical order.',
    ),
    hint: L(
      'Avval yozuvni ko‘ramiz, keyin hisoblaymiz, oxirida qiymat olamiz.',
      'Сначала видим запись, затем вычисляем, в конце получаем значение.',
      'First we see the notation, then calculate, and finally obtain its value.',
    ),
    audio: A(
      'Ifoda va uning qiymati bir xil obyekt emas. Ularni hisoblash jarayoni bog‘laydi.',
      'Выражение и его значение не один и тот же объект. Их связывает вычисление.',
      'An expression and its value are not the same object. Calculation connects them.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Model', 'Модель', 'Model'),
    kicker: L('QAVSLAR TUZILISHNI O‘ZGARTIRADI', 'СКОБКИ МЕНЯЮТ СТРУКТУРУ', 'BRACKETS CHANGE STRUCTURE'),
    title: L('Bir xil sonlar — boshqa qiymatlar', 'Те же числа — другие значения', 'Same numbers — different values'),
    lead: L(
      '2 + 3 · 4 va (2 + 3) · 4 ifodalarining qiymatini toping.',
      'Найди значения выражений 2 + 3 · 4 и (2 + 3) · 4.',
      'Find the values of 2 + 3 · 4 and (2 + 3) · 4.',
    ),
    hint: L(
      'Birinchi ifodada ko‘paytirish, ikkinchisida qavs ichidagi qo‘shish avval bajariladi.',
      'В первом выражении сначала умножение, во втором — сложение в скобках.',
      'Multiply first in the first expression; add inside the brackets first in the second.',
    ),
    audio: A(
      'Sonlar va amal belgilari bir xil. Ammo qavslar qaysi amal birinchi bajarilishini o‘zgartiradi.',
      'Числа и знаки действий одинаковы. Но скобки меняют действие, которое выполняется первым.',
      'The numbers and operation signs are the same. Brackets change which operation comes first.',
    ),
  },
  {
    type: 'rule',
    scope: null,
    phase: L('Model', 'Модель', 'Model'),
    kicker: L('AMALLAR IERARXIYASI', 'ИЕРАРХИЯ ДЕЙСТВИЙ', 'OPERATION HIERARCHY'),
    title: L('Uch darajali tartibni tuzing', 'Собери трёхуровневый порядок', 'Build the three-level order'),
    lead: L(
      'Amal guruhlarini bajarilish tartibida joylashtiring.',
      'Расположи группы действий в порядке выполнения.',
      'Arrange the operation groups in execution order.',
    ),
    hint: L(
      'Qavs ichidagi amal birinchi. Bir xil darajadagi amallar chapdan o‘ngga bajariladi.',
      'Сначала действие в скобках. Действия одного уровня выполняются слева направо.',
      'Operations in brackets come first. Equal-priority operations go from left to right.',
    ),
    audio: A(
      'Birinchi daraja qavslar. Ikkinchi daraja ko‘paytirish va bo‘lish. Uchinchi daraja qo‘shish va ayirish.',
      'Первый уровень это скобки. Второй уровень это умножение и деление. Третий уровень это сложение и вычитание.',
      'The first level is brackets. The second is multiplication and division. The third is addition and subtraction.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Model', 'Модель', 'Model'),
    kicker: L('QADAMMA-QADAM', 'ПОШАГОВЫЙ РАЗБОР', 'STEP BY STEP'),
    title: L('Amallarni tartib bilan bajaring', 'Выполни действия по порядку', 'Perform the operations in order'),
    lead: L(
      '36 : (9 − 3) + 5 · 2 ifodasidagi amallarni tartiblang.',
      'Расположи действия выражения 36 : (9 − 3) + 5 · 2.',
      'Order the operations in 36 : (9 − 3) + 5 · 2.',
    ),
    hint: L(
      'Qavs ichidagi amal birinchi, qo‘shish esa oxirgi bajariladi.',
      'Действие в скобках выполняется первым, а сложение — последним.',
      'The operation in brackets comes first and addition comes last.',
    ),
    audio: A(
      'Qavsni hisoblang. Keyin bo‘lish va ko‘paytirishni chapdan o‘ngga, qo‘shishni esa oxirida bajaring.',
      'Вычисли скобки. Затем выполни деление и умножение слева направо, а сложение оставь напоследок.',
      'Evaluate the brackets. Then divide and multiply from left to right, and add at the end.',
    ),
  },
  {
    type: 'rule',
    scope: null,
    phase: L('Qoida', 'Правило', 'Rule'),
    kicker: L('QOIDANI YIG‘ING', 'СОБЕРИ ПРАВИЛО', 'BUILD THE RULE'),
    title: L('Amallar tartibi', 'Порядок действий', 'Order of operations'),
    lead: L(
      'To‘rtta qoida qismini to‘g‘ri ketma-ketlikka qo‘ying.',
      'Расположи четыре части правила в правильной последовательности.',
      'Arrange the four parts of the rule in the correct sequence.',
    ),
    hint: L(
      'Bir xil darajadagi amallar chapdan o‘ngga bajariladi. Tekshirish oxirida keladi.',
      'Действия одного уровня идут слева направо. Проверка выполняется в конце.',
      'Equal-priority operations go left to right. Verification comes last.',
    ),
    audio: A(
      'Qoidani yodlashdan oldin uning to‘rtta qismini to‘g‘ri tartibga qo‘ying.',
      'Прежде чем запоминать правило, расположи его четыре части в верном порядке.',
      'Before memorising the rule, arrange its four parts in the correct order.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Amaliyot', 'Практика', 'Practice'),
    kicker: L('FAOL TAHLIL', 'АКТИВНЫЙ РАЗБОР', 'ACTIVE WALKTHROUGH'),
    title: L('Keyingi amalni boshqaring', 'Управляй следующим действием', 'Control the next operation'),
    lead: L(
      '42 − 18 : 3 · 2 ifodasida amallarni to‘g‘ri tartiblang.',
      'Расположи действия в выражении 42 − 18 : 3 · 2.',
      'Order the operations in 42 − 18 : 3 · 2.',
    ),
    hint: L(
      'Bo‘lish va ko‘paytirish teng darajada. Eng chapdagisidan boshlang.',
      'Деление и умножение равноправны. Начни с самого левого.',
      'Division and multiplication have equal priority. Start with the leftmost one.',
    ),
    audio: A(
      'Bo‘lish va ko‘paytirish teng darajada turadi. Shuning uchun avval chapdagi bo‘lishni bajaring.',
      'Деление и умножение имеют равный приоритет. Поэтому сначала выполни деление слева.',
      'Division and multiplication have equal priority. Therefore, perform the leftmost division first.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Amaliyot', 'Практика', 'Practice'),
    kicker: L('TAYANCH BILAN MASHQ', 'ПРАКТИКА С ОПОРОЙ', 'GUIDED PRACTICE'),
    title: L('To‘rtta qadamli zinapoya', 'Лестница из четырёх шагов', 'A four-step ladder'),
    lead: L(
      '7 + 24 : (8 − 2) · 3 ifodasidagi amallarni tartiblang.',
      'Расположи действия в выражении 7 + 24 : (8 − 2) · 3.',
      'Order the operations in 7 + 24 : (8 − 2) · 3.',
    ),
    hint: L(
      'Avval qavs, keyin bo‘lish, ko‘paytirish va qo‘shish.',
      'Сначала скобки, затем деление, умножение и сложение.',
      'Start with brackets, then division, multiplication and addition.',
    ),
    audio: A(
      'Har bir to‘g‘ri qadam ifodani qisqartiradi. Tartibni qavsdan boshlang.',
      'Каждый верный шаг сокращает выражение. Начни порядок со скобок.',
      'Each correct step makes the expression shorter. Begin the sequence with the brackets.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Amaliyot', 'Практика', 'Practice'),
    kicker: L('MUSTAQIL YECHIM', 'САМОСТОЯТЕЛЬНОЕ РЕШЕНИЕ', 'INDEPENDENT SOLUTION'),
    title: L('Birinchi amal va yakuniy qiymat', 'Первое действие и итоговое значение', 'First operation and final value'),
    lead: L(
      '60 − 4 · (9 + 3) : 6 ifodasini hisoblang.',
      'Вычисли выражение 60 − 4 · (9 + 3) : 6.',
      'Evaluate 60 − 4 · (9 + 3) : 6.',
    ),
    hint: L(
      'Qavs ichidagi qo‘shishdan boshlang. Keyin chapdan o‘ngga yuring.',
      'Начни со сложения в скобках. Затем двигайся слева направо.',
      'Begin with the addition in brackets, then move from left to right.',
    ),
    audio: A(
      'Birinchi amalni tanlang va hisoblashning yakuniy qiymatini kiriting.',
      'Выбери первое действие и введи итоговое значение выражения.',
      'Choose the first operation and enter the final value of the expression.',
    ),
  },
  {
    type: 'case',
    scope: 'module-mikro',
    phase: L('Strategiya', 'Стратегия', 'Strategy'),
    kicker: L('O‘Z SO‘ZINGIZ BILAN', 'СВОИМИ СЛОВАМИ', 'IN YOUR OWN WORDS'),
    title: L('To‘g‘ri va qulay usul', 'Верный и удобный способ', 'A correct and convenient method'),
    lead: L(
      '25 · 17 · 4 ni qanday qulay hisoblash mumkinligini tushuntiring.',
      'Объясни, как удобно вычислить 25 · 17 · 4.',
      'Explain a convenient way to calculate 25 · 17 · 4.',
    ),
    hint: L(
      '25 va 4 ko‘paytmasi qulay yaxlit son beradi.',
      'Произведение 25 и 4 даёт удобное круглое число.',
      'The product of 25 and 4 gives a convenient round number.',
    ),
    audio: A(
      'Qaysi ko‘paytuvchilarni avval birlashtirish qulayligini va nima uchunligini ikki jumlada tushuntiring.',
      'В двух предложениях объясни, какие множители удобно объединить сначала и почему.',
      'In two sentences, explain which factors are convenient to group first and why.',
    ),
  },
  {
    type: 'case',
    scope: 'module-mikro',
    phase: L('Audit', 'Аудит', 'Audit'),
    kicker: L('XATO AUDITI', 'АУДИТ ОШИБКИ', 'ERROR AUDIT'),
    title: L('Birinchi noto‘g‘ri qadam qayerda?', 'Где первый неверный шаг?', 'Where is the first incorrect step?'),
    lead: L(
      'Yechimda yozilgan: 48 − 12 : 3 → 36 : 3 → 12.',
      'В решении записано: 48 − 12 : 3 → 36 : 3 → 12.',
      'The solution says: 48 − 12 : 3 → 36 : 3 → 12.',
    ),
    hint: L(
      'Ayirishdan oldin yuqori darajali amal bor.',
      'Перед вычитанием есть действие более высокого приоритета.',
      'A higher-priority operation must happen before subtraction.',
    ),
    audio: A(
      'Faqat noto‘g‘ri javobni emas, birinchi xato o‘tishni toping. Keyingi xatolar undan kelib chiqadi.',
      'Найди не только неверный ответ, а первый ошибочный переход. Остальные ошибки следуют из него.',
      'Find not merely the wrong answer, but the first incorrect transition. Every later error follows from it.',
    ),
  },
  {
    type: 'test',
    scope: 'final',
    phase: L('Yakun', 'Финал', 'Final'),
    kicker: L('YAKUNIY TEKSHIRUV', 'ФИНАЛЬНАЯ ПРОВЕРКА', 'FINAL CHECK'),
    title: L('Natija va sabab', 'Результат и основание', 'Result and reason'),
    lead: L(
      '64 : (10 − 2) + 3 · 7 ifodasini hisoblang va birinchi amalni asoslang.',
      'Вычисли 64 : (10 − 2) + 3 · 7 и обоснуй первое действие.',
      'Evaluate 64 : (10 − 2) + 3 · 7 and justify the first operation.',
    ),
    hint: L(
      'Birinchi amal qavs ichida. Yakuniy qiymat yigirmadan katta.',
      'Первое действие находится в скобках. Итоговое значение больше двадцати.',
      'The first operation is inside brackets. The final value is greater than twenty.',
    ),
    audio: A(
      'Yakuniy tekshiruvda birinchi amalni, ifodaning qiymatini va qoida sababini ko‘rsating.',
      'В финальной проверке укажи первое действие, значение выражения и основание правила.',
      'For the final check, give the first operation, the value and the rule that explains your choice.',
    ),
  },
  {
    type: 'summary',
    scope: null,
    phase: L('Xulosa', 'Итог', 'Summary'),
    kicker: L('ASOSIY G‘OYA', 'ГЛАВНАЯ ИДЕЯ', 'CORE IDEA'),
    title: L('Bitta ifoda — bitta tekshirilgan qiymat', 'Одно выражение — одно проверенное значение', 'One expression — one verified value'),
    lead: L(
      'Tartib tasodifiy emas: u sonli ifodaning tuzilishini saqlaydi.',
      'Порядок не случаен: он сохраняет структуру числового выражения.',
      'The order is not arbitrary: it preserves the structure of a numerical expression.',
    ),
    hint: L('', '', ''),
    audio: A(
      'Sonli ifodani hisoblashda avval qavslar, keyin ko‘paytirish va bo‘lish, so‘ng qo‘shish va ayirish bajariladi.',
      'В числовом выражении сначала выполняют действия в скобках, затем умножение и деление, после них сложение и вычитание.',
      'In a numerical expression, evaluate brackets first, then multiplication and division, followed by addition and subtraction.',
    ),
  },
]

const SCREENS = [
  {
    ...SOURCE_SCREENS[0],
    id: 'hook-duel',
    type: 'hook',
    phase: L('Muammo', 'Проблема', 'Problem'),
    kicker: L('MATEMATIK DUEL', 'МАТЕМАТИЧЕСКАЯ ДУЭЛЬ', 'MATH DUEL'),
    title: L('Ikkala o‘quvchi ham haq bo‘lishi mumkinmi?', 'Могут ли оба ученика быть правы?', 'Can both students be right?'),
    lead: L(
      'Aziza 20, Bekzod esa 8 javobini oldi. Yozuv bir xil — natijalar boshqa.',
      'Азиза получила 20, а Бекзод — 8. Запись одна, результаты разные.',
      'Aziza got 20, while Bekzod got 8. The expression is identical, but the results differ.',
    ),
    waitsForChoice: true,
    audioSteps: [
      A(
        'Oldimizda bitta ifoda: o‘n sakkiz ayiruv olti bo‘lingan uch qo‘shuv to‘rt.',
        'Перед нами одно выражение: восемнадцать минус шесть разделить на три плюс четыре.',
        'Here is one expression: eighteen minus six divided by three plus four.',
      ),
      A(
        'Aziza shu ifoda uchun yigirma javobini oldi.',
        'Азиза получила для этого выражения ответ двадцать.',
        'Aziza obtained twenty for this expression.',
      ),
      A(
        'Bekzod esa sakkiz javobini oldi. Yozuv o‘zgarmadi.',
        'Бекзод получил восемь. При этом запись не изменилась.',
        'Bekzod obtained eight, although the expression did not change.',
      ),
      A(
        'Nega bitta yozuv ikki javob berdi? Hozircha hisoblamang. Eng kuchli taxminingizni tanlang.',
        'Почему одна запись дала два ответа? Пока не вычисляйте. Выберите самую убедительную гипотезу.',
        'Why did one expression produce two answers? Do not calculate yet. Choose your strongest hypothesis.',
      ),
    ],
  },
  {
    ...SOURCE_SCREENS[4],
    id: 'theory-expression-value',
    type: 'teaching',
    phase: L('Tushuncha', 'Понятие', 'Concept'),
    kicker: L('IFODA VA UNING QIYMATI', 'ВЫРАЖЕНИЕ И ЕГО ЗНАЧЕНИЕ', 'EXPRESSION AND ITS VALUE'),
    title: L('Ifoda — yo‘l, qiymat — natija', 'Выражение — путь, значение — результат', 'An expression is the route; its value is the result'),
    lead: L(
      'Sonli ifodani hisoblash natijasida olingan son uning qiymati deyiladi.',
      'Результат вычисления числового выражения называется его значением.',
      'The result of evaluating a numerical expression is called its value.',
    ),
    audioSteps: [
      A(
        'Besh ko‘paytirilgan ikki — o‘n. Faqat shu bo‘lak o‘rniga o‘n yozamiz, qolgan yozuvni saqlaymiz.',
        'Пять умножить на два — десять. Заменяем только этот фрагмент, сохраняя остальную запись.',
        'Five times two is ten. Replace only that part and preserve the rest of the expression.',
      ),
      A(
        'Yetti qo‘shuv o‘n — o‘n yetti. Hisoblash yakunlandi.',
        'Семь плюс десять — семнадцать. Вычисление завершено.',
        'Seven plus ten is seventeen. The evaluation is complete.',
      ),
      A(
        'O‘n yetti — sonli ifodani hisoblash natijasi, ya’ni uning qiymati.',
        'Семнадцать — результат вычисления числового выражения, то есть его значение.',
        'Seventeen is the result of evaluating the numerical expression, so it is its value.',
      ),
    ],
  },
  {
    ...SOURCE_SCREENS[5],
    id: 'theory-brackets',
    type: 'teaching',
    phase: L('Taqqoslash', 'Сравнение', 'Comparison'),
    kicker: L('QAVSLAR YO‘LNI O‘ZGARTIRADI', 'СКОБКИ МЕНЯЮТ МАРШРУТ', 'BRACKETS CHANGE THE ROUTE'),
    title: L('Bir xil sonlar — ikki xil tuzilish', 'Одни числа — две разные структуры', 'The same numbers — two different structures'),
    lead: L(
      '2 + 3 · 4 va (2 + 3) · 4 ifodalarini yonma-yon taqqoslaymiz.',
      'Сравним рядом выражения 2 + 3 · 4 и (2 + 3) · 4.',
      'Compare 2 + 3 × 4 and (2 + 3) × 4 side by side.',
    ),
    audioSteps: [
      A(
        'Qavssiz ifodada avval uchni to‘rtga ko‘paytiramiz. O‘n ikki ustiga ikki qo‘shsak, o‘n to‘rt chiqadi.',
        'В выражении без скобок сначала умножаем три на четыре. К двенадцати прибавляем два и получаем четырнадцать.',
        'Without brackets, multiply three by four first. Add two to twelve and get fourteen.',
      ),
      A(
        'Ikkinchi ifodada qavs ikki qo‘shuv uchni bitta guruhga aylantiradi. Avval besh, keyin besh ko‘paytirilgan to‘rt — yigirma.',
        'Во втором выражении скобки объединяют два плюс три в одну группу. Сначала получаем пять, затем пять умножить на четыре — двадцать.',
        'In the second expression, brackets group two plus three. First get five, then five times four gives twenty.',
      ),
      A(
        'Sonlar va belgilar o‘xshash, lekin tuzilish boshqa. Qavslar ichidagi amal har doim birinchi bajariladi.',
        'Числа и знаки похожи, но структура разная. Действие внутри скобок всегда выполняется первым.',
        'The numbers and signs look similar, but the structure differs. Operations inside brackets always come first.',
      ),
    ],
  },
  {
    ...SOURCE_SCREENS[6],
    id: 'theory-priority',
    type: 'teaching',
    phase: L('2-qoida', 'Правило 2', 'Rule 2'),
    kicker: L('KEYINGI NAVBAT — KO‘PAYTIRISH VA BO‘LISH', 'ЗАТЕМ — УМНОЖЕНИЕ И ДЕЛЕНИЕ', 'THEN MULTIPLICATION AND DIVISION'),
    title: L('Ko‘paytirish va bo‘lish ustuvorroq', 'Умножение и деление имеют более высокий приоритет', 'Multiplication and division have higher priority'),
    lead: L(
      'Qavslar bo‘lmasa, ko‘paytirish va bo‘lish qo‘shish hamda ayirishdan oldin bajariladi.',
      'Если скобок нет, умножение и деление выполняют раньше сложения и вычитания.',
      'Without brackets, multiplication and division come before addition and subtraction.',
    ),
    audioSteps: [
      A(
        'O‘n sakkiz ayiruv olti bo‘lingan uch qo‘shuv to‘rt ifodasida bo‘lish eng yuqori amal.',
        'В выражении восемнадцать минус шесть разделить на три плюс четыре деление имеет больший приоритет.',
        'In eighteen minus six divided by three plus four, division has the higher priority.',
      ),
      A(
        'Endi ayirish va qo‘shish teng darajada. Chapdan o‘ngga o‘n sakkizdan ikkini ayirib, o‘n olti olamiz.',
        'Теперь вычитание и сложение равноправны. Слева направо вычитаем два из восемнадцати и получаем шестнадцать.',
        'Subtraction and addition now have equal priority. From the left, subtract two from eighteen to get sixteen.',
      ),
      A(
        'O‘n olti qo‘shuv to‘rt — yigirma. Har o‘tishda faqat hisoblangan bo‘lak almashtirildi.',
        'Шестнадцать плюс четыре — двадцать. В каждом переходе заменялся только вычисленный фрагмент.',
        'Sixteen plus four is twenty. At each transition, only the evaluated part was replaced.',
      ),
    ],
  },
  {
    ...SOURCE_SCREENS[7],
    id: 'theory-equal-priority',
    type: 'teaching',
    phase: L('3-qoida', 'Правило 3', 'Rule 3'),
    kicker: L('TENG DARAJA — CHAPDAN O‘NGGA', 'ОДИН УРОВЕНЬ — СЛЕВА НАПРАВО', 'SAME PRIORITY — LEFT TO RIGHT'),
    title: L('Teng amallarda eng chapdagidan boshlang', 'При равных действиях начинайте слева', 'For equal-priority operations, start from the left'),
    lead: L(
      'Ko‘paytirish va bo‘lish teng darajada; qo‘shish va ayirish ham teng darajada.',
      'Умножение и деление равноправны; сложение и вычитание тоже равноправны.',
      'Multiplication and division share a priority; addition and subtraction share another.',
    ),
    audioSteps: [
      A(
        'Bo‘lish va ko‘paytirish teng darajada. Bu ko‘paytirish har doim oldin degani emas.',
        'Деление и умножение равноправны. Это не означает, что умножение всегда выполняется раньше.',
        'Division and multiplication have equal priority. This does not mean multiplication always comes first.',
      ),
      A(
        'Teng darajada chapdan o‘ngga yuramiz. Avval yigirma to‘rtni oltiga bo‘lib, to‘rt olamiz.',
        'При равном приоритете идём слева направо. Сначала делим двадцать четыре на шесть и получаем четыре.',
        'With equal priority, work from left to right. First divide twenty-four by six to get four.',
      ),
      A(
        'Keyin to‘rtni uchga ko‘paytiramiz. To‘g‘ri qiymat o‘n ikki.',
        'Затем умножаем четыре на три. Верное значение — двенадцать.',
        'Then multiply four by three. The correct value is twelve.',
      ),
      A(
        'Qo‘shish va ayirish ham teng darajada. Yigirma ayiruv sakkiz qo‘shuv uch ifodasini chapdan o‘ngga hisoblab, o‘n besh olamiz.',
        'Сложение и вычитание тоже равноправны. Вычисляем двадцать минус восемь плюс три слева направо и получаем пятнадцать.',
        'Addition and subtraction also have equal priority. Evaluate twenty minus eight plus three left to right to get fifteen.',
      ),
    ],
  },
  {
    ...SOURCE_SCREENS[7],
    id: 'theory-worked-example',
    type: 'teaching',
    phase: L('Namuna', 'Пример', 'Example'),
    kicker: L('TO‘LIQ MISOL', 'ПОЛНЫЙ ПРИМЕР', 'COMPLETE EXAMPLE'),
    title: L('Barcha qoidalarni birga qo‘llaymiz', 'Применяем все правила вместе', 'Apply all the rules together'),
    lead: L(
      '36 : (9 − 3) + 5 · 2 ifodasini qadam-baqadam qisqartiramiz.',
      'Пошагово упростим выражение 36 : (9 − 3) + 5 · 2.',
      'We will simplify 36 : (9 − 3) + 5 · 2 step by step.',
    ),
    audioSteps: [
      A(
        'Birinchi qadam qavs ichida: to‘qqiz ayiruv uch — olti.',
        'Первый шаг внутри скобок: девять минус три — шесть.',
        'The first step is inside the brackets: nine minus three is six.',
      ),
      A(
        'Endi bo‘lish va ko‘paytirish darajasi. Chapdan o‘ngga: o‘ttiz olti bo‘lingan olti — olti.',
        'Теперь уровень деления и умножения. Слева направо: тридцать шесть разделить на шесть — шесть.',
        'Now use the division and multiplication level. From the left, thirty-six divided by six is six.',
      ),
      A(
        'Besh ko‘paytirilgan ikki — o‘n. Ifoda olti qo‘shuv o‘nga aylandi.',
        'Пять умножить на два — десять. Выражение стало шесть плюс десять.',
        'Five times two is ten. The expression has become six plus ten.',
      ),
      A(
        'Olti qo‘shuv o‘n — o‘n olti. Har safar eng yuqori darajadagi eng chap amal tanlandi.',
        'Шесть плюс десять — шестнадцать. Каждый раз выбирали самое левое действие наивысшего приоритета.',
        'Six plus ten is sixteen. Each time we chose the leftmost operation at the highest priority.',
      ),
    ],
  },
  {
    ...SOURCE_SCREENS[13],
    id: 'theory-error-detective',
    type: 'teaching',
    scope: null,
    phase: L('Xato detektivi', 'Детектив ошибки', 'Error detective'),
    kicker: L('BIRINCHI XATO QADAMNI TOPING', 'НАЙДИТЕ ПЕРВЫЙ ОШИБОЧНЫЙ ШАГ', 'FIND THE FIRST BROKEN STEP'),
    title: L('Xatoni natijadan emas, qadamdan qidiring', 'Ищите ошибку не в ответе, а в шаге', 'Find the error in the step, not the answer'),
    lead: L(
      'Bekzod 18 − 6 : 3 + 4 ifodasidan qanday qilib 8 olganini tekshiramiz.',
      'Проверим, как Бекзод получил 8 из выражения 18 − 6 : 3 + 4.',
      'Audit how Bekzod obtained 8 from 18 − 6 ÷ 3 + 4.',
    ),
    audioSteps: [
      A(
        'Bekzod o‘n sakkizdan oltini ayirib, o‘n ikki oldi. Keyin o‘n ikkini uchga bo‘lib, to‘rtga yana to‘rt qo‘shdi va sakkiz oldi. Birinchi xato dastlabki o‘tishda.',
        'Бекзод вычел шесть из восемнадцати, получил двенадцать, затем разделил на три и прибавил четыре. Так получилось восемь. Первая ошибка находится в первом переходе.',
        'Bekzod subtracted six from eighteen, divided twelve by three, then added four to obtain eight. The first error is in the first transition.',
      ),
      A(
        'To‘g‘ri yo‘l olti bo‘lingan uchdan boshlanadi. Natija ikki, shuning uchun yozuv o‘n sakkiz ayiruv ikki qo‘shuv to‘rtga aylanadi.',
        'Правильный путь начинается с шести разделить на три. Получаем два, поэтому запись становится восемнадцать минус два плюс четыре.',
        'The correct route starts with six divided by three. The result is two, so the expression becomes eighteen minus two plus four.',
      ),
      A(
        'Endi ayirish va qo‘shish teng darajada. Chapdan o‘ngga o‘n sakkiz ayiruv ikki — o‘n olti.',
        'Теперь вычитание и сложение равноправны. Слева направо: восемнадцать минус два — шестнадцать.',
        'Subtraction and addition now have equal priority. From the left, eighteen minus two is sixteen.',
      ),
      A(
        'O‘n olti qo‘shuv to‘rt — yigirma. Demak, Azizaning yigirma javobi to‘g‘ri, Bekzod esa bo‘lish ustuvorligini buzgan.',
        'Шестнадцать плюс четыре — двадцать. Значит, ответ Азизы верен, а Бекзод нарушил приоритет деления.',
        'Sixteen plus four is twenty. Aziza is correct, while Bekzod violated division priority.',
      ),
    ],
  },
  {
    ...SOURCE_SCREENS[8],
    id: 'theory-rule-map',
    type: 'teaching',
    phase: L('Qoida xaritasi', 'Карта правила', 'Rule map'),
    kicker: L('UCH DARAJA VA TEKSHIRISH', 'ТРИ УРОВНЯ И ПРОВЕРКА', 'THREE LEVELS AND A CHECK'),
    title: L('Endi duelning javobi aniq', 'Теперь ответ в дуэли однозначен', 'Now the duel has one clear answer'),
    lead: L(
      'Qoidani bitta xaritaga yig‘amiz va 18 − 6 : 3 + 4 ifodasiga qaytamiz.',
      'Соберём правило в одну карту и вернёмся к выражению 18 − 6 : 3 + 4.',
      'Build one rule map, then return to 18 − 6 ÷ 3 + 4.',
    ),
    audioSteps: [
      A(
        'Birinchi: qavs ichidagi amallar. Qavs ichida ham shu tartib ishlaydi.',
        'Первое: действия в скобках. Внутри скобок действует тот же порядок.',
        'First: operations inside brackets. The same order also applies within the brackets.',
      ),
      A(
        'Ikkinchi: ko‘paytirish va bo‘lishni chapdan o‘ngga bajaring.',
        'Второе: выполняйте умножение и деление слева направо.',
        'Second: perform multiplication and division from left to right.',
      ),
      A(
        'Uchinchi: qo‘shish va ayirishni chapdan o‘ngga bajaring.',
        'Третье: выполняйте сложение и вычитание слева направо.',
        'Third: perform addition and subtraction from left to right.',
      ),
      A(
        'Tekshirish yangi amal darajasi emas. Har bir o‘tishni nazorat qiling. Duelda olti bo‘lingan uch birinchi bajariladi va yagona qiymat yigirma bo‘ladi. Endi qoidani birgalikdagi mashqlarda qo‘llaymiz.',
        'Проверка — не новый уровень действий. Контролируйте каждый переход. В дуэли первым выполняется шесть разделить на три, поэтому единственное значение равно двадцати. Теперь применим правило вместе.',
        'Checking is not another operation level. Verify every transition. In the duel, six divided by three comes first, so the only value is twenty. Now apply the rule together in guided practice.',
      ),
    ],
  },
  {
    ...SOURCE_SCREENS[5],
    id: 'guided-brackets',
    type: 'guided-pair',
    phase: L('Amaliyot · 1', 'Практика · 1', 'Practice · 1'),
    kicker: L('QAVSLARNI TEKSHIRING', 'ПРОВЕРЬТЕ СКОБКИ', 'CHECK THE BRACKETS'),
    title: L('Qavslar qiymatni qanday o‘zgartiradi?', 'Как скобки изменяют значение?', 'How do brackets change the value?'),
    lead: L(
      '4 + 2 · 5 va (4 + 2) · 5 uchun avval prognoz, so‘ng qiymatlarni tanlang.',
      'Сначала сделайте прогноз, затем найдите значения 4 + 2 · 5 и (4 + 2) · 5.',
      'Predict first, then find the values of 4 + 2 × 5 and (4 + 2) × 5.',
    ),
    hint: L('Qavsli ifodada 4 + 2 birinchi hisoblanadi.', 'В выражении со скобками сначала вычисляется 4 + 2.', 'In the bracketed expression, evaluate 4 + 2 first.'),
    audio: A(
      'Qaysi ifoda kattaroq bo‘lishini prognoz qiling. Keyin har bir ifodaning qiymatini tanlang.',
      'Предскажите, какое выражение больше. Затем выберите значение каждого выражения.',
      'Predict which expression is greater. Then choose the value of each expression.',
    ),
  },
  {
    ...SOURCE_SCREENS[7],
    id: 'guided-full-sequence',
    type: 'guided-sequence-full',
    phase: L('Amaliyot · 2', 'Практика · 2', 'Practice · 2'),
    kicker: L('TO‘LIQ MISOLNI YIG‘ING', 'СОБЕРИТЕ ПОЛНЫЙ ПРИМЕР', 'BUILD THE COMPLETE EXAMPLE'),
    title: L('Zanjirni bo‘shliqsiz yig‘ing', 'Соберите цепочку без пропусков', 'Build the chain without gaps'),
    lead: L(
      '48 : (10 − 4) · 3 + 2 ifodasida har bir keyingi amalni tanlang.',
      'Выбирайте каждое следующее действие в выражении 48 : (10 − 4) · 3 + 2.',
      'Choose each next operation in 48 ÷ (10 − 4) × 3 + 2.',
    ),
    hint: L('Avval qavs; keyin ÷ va × chapdan o‘ngga.', 'Сначала скобки; затем ÷ и × слева направо.', 'Start with brackets; then ÷ and × from left to right.'),
    audio: A(
      'Avval qavsni hisoblang. Keyin teng darajadagi bo‘lish va ko‘paytirishni chapdan o‘ngga davom ettiring.',
      'Сначала вычислите скобки. Затем продолжайте равноправные деление и умножение слева направо.',
      'Evaluate the brackets first. Then continue with equal-priority division and multiplication from left to right.',
    ),
  },
  {
    ...SOURCE_SCREENS[9],
    id: 'guided-equal-priority',
    type: 'guided-sequence-equal',
    phase: L('Amaliyot · 3', 'Практика · 3', 'Practice · 3'),
    kicker: L('TENG DARAJANI BOSHQARING', 'УПРАВЛЯЙТЕ РАВНЫМ ПРИОРИТЕТОМ', 'CONTROL EQUAL PRIORITY'),
    title: L('Teng daraja — faqat chapdan o‘ngga', 'Равный приоритет — только слева направо', 'Equal priority means left to right'),
    lead: L(
      '42 − 18 : 3 · 2 ifodasi uchun avval 30 yoki 39 ni prognoz qiling, keyin yo‘lni tuzing.',
      'Сначала выберите прогноз 30 или 39 для 42 − 18 : 3 · 2, затем постройте решение.',
      'First predict 30 or 39 for 42 − 18 ÷ 3 × 2, then build the solution.',
    ),
    hint: L('18 : 3 · 2 — uzluksiz teng darajali zanjir.', '18 : 3 · 2 — непрерывная цепочка равноправных действий.', '18 ÷ 3 × 2 is one continuous equal-priority chain.'),
    audio: A(
      'Natijani prognoz qiling. Keyin bo‘lish va ko‘paytirishni chapdan o‘ngga bajaring.',
      'Сделайте прогноз. Затем выполните деление и умножение слева направо.',
      'Predict the result. Then evaluate division and multiplication from left to right.',
    ),
  },
  {
    ...SOURCE_SCREENS[13],
    id: 'guided-error-audit',
    type: 'guided-error',
    phase: L('Amaliyot · 4', 'Практика · 4', 'Practice · 4'),
    kicker: L('BIRINCHI XATONI BELGILANG', 'ОТМЕТЬТЕ ПЕРВУЮ ОШИБКУ', 'MARK THE FIRST ERROR'),
    title: L('Birinchi noto‘g‘ri o‘tishni toping', 'Найдите первый неверный переход', 'Find the first incorrect transition'),
    lead: L(
      '40 − 18 : 3 · 2 → 40 − 6 · 2 → 34 · 2 → 68 yechim yo‘lini tekshiring.',
      'Проверьте решение: 40 − 18 : 3 · 2 → 40 − 6 · 2 → 34 · 2 → 68.',
      'Audit this solution: 40 − 18 ÷ 3 × 2 → 40 − 6 × 2 → 34 × 2 → 68.',
    ),
    hint: L('Birinchi o‘tish to‘g‘ri. Keyingi o‘tishda ko‘paytirish saqlanishi kerak.', 'Первый переход верен. В следующем переходе умножение ещё должно сохраниться.', 'The first transition is valid. Multiplication must still remain in the next transition.'),
    audio: A(
      'Birinchi o‘tish to‘g‘ri bo‘lishi mumkin. Xato ilk bor paydo bo‘lgan o‘tishni toping.',
      'Первый переход может быть верным. Найдите переход, в котором ошибка появляется впервые.',
      'The first transition may be valid. Find where the error first appears.',
    ),
  },
  {
    ...SOURCE_SCREENS[14],
    id: 'guided-readiness',
    type: 'guided-final',
    scope: 'module-mikro',
    phase: L('Amaliyot · 5', 'Практика · 5', 'Practice · 5'),
    kicker: L('JAVOBNI ASOSLANG', 'ОБОСНУЙТЕ ОТВЕТ', 'JUSTIFY THE ANSWER'),
    title: L('Mustaqil ishga tayyormisiz?', 'Готовы к самостоятельной работе?', 'Are you ready for independent practice?'),
    lead: L(
      '72 : (11 − 3) · 2 − 5 ifodasida birinchi amal, qavs qiymati, qoida va natijani ko‘rsating.',
      'Для 72 : (11 − 3) · 2 − 5 укажите первое действие, значение скобок, правило и результат.',
      'For 72 ÷ (11 − 3) × 2 − 5, give the first operation, bracket value, rule and result.',
    ),
    hint: L('11 − 3 = 8. Keyin ÷ va × chapdan o‘ngga.', '11 − 3 = 8. Затем ÷ и × слева направо.', '11 − 3 = 8. Then evaluate ÷ and × from left to right.'),
    audio: A(
      'Bu tayanchli yakuniy mashq. Birinchi amalni, qavs qiymatini, sababni va butun ifoda qiymatini kiriting.',
      'Это последняя тренировка с опорой. Укажите первое действие, значение скобок, основание и итог.',
      'This is the final guided check. Give the first operation, bracket value, reason and final value.',
    ),
  },
  {
    ...SOURCE_SCREENS[11],
    id: 'independent-practice',
    type: 'practice-pack',
    scope: 'final',
    phase: L('Mustaqil ish', 'Самостоятельная работа', 'Independent practice'),
    kicker: L('8 TA TOPSHIRIQ — BITTA TRENAJOR', '8 ЗАДАНИЙ — ОДИН ТРЕНАЖЁР', '8 TASKS — ONE PRACTICE PACK'),
    title: L('Amallar tartibini mustaqil qo‘llang', 'Примените порядок действий самостоятельно', 'Apply the order of operations independently'),
    lead: L(
      'Har bir to‘g‘ri javobdan keyin yechim ochiladi. Faqat shundan so‘ng keyingi topshiriq paydo bo‘ladi.',
      'После каждого верного ответа откроется решение. Только затем появится следующее задание.',
      'After each correct answer, the solution opens. Only then does the next task appear.',
    ),
    audioSteps: [
      A(
        'Oldingizda sakkizta turli topshiriq bor. Xato javobda shu topshiriqda qolasiz. To‘g‘ri javobdan keyin yechimni ko‘rib, keyingisiga o‘tasiz.',
        'Перед вами восемь разных заданий. После ошибки вы останетесь на текущем задании. После верного ответа изучите решение и переходите дальше.',
        'You have eight different tasks. A wrong answer keeps you on the same task. After a correct answer, study the solution and continue.',
      ),
      A(
        'Birinchi topshiriq. Yigirma yetti ayiruv o‘n besh bo‘lingan besh qo‘shuv olti ifodasida qaysi amal birinchi bajariladi?',
        'Первое задание. Какое действие выполняется первым в выражении двадцать семь минус пятнадцать разделить на пять плюс шесть?',
        'Task one. Which operation is performed first in twenty-seven minus fifteen divided by five plus six?',
      ),
    ],
  },
  {
    ...SOURCE_SCREENS[15],
    id: 'summary',
    type: 'summary',
    phase: L('Xulosa', 'Итог', 'Summary'),
    kicker: L('QOIDA MUSTAHKAMLANDI', 'ПРАВИЛО ЗАКРЕПЛЕНО', 'RULE CONSOLIDATED'),
    title: L('Endi tartib natijani boshqaradi', 'Теперь порядок управляет результатом', 'Now the order controls the result'),
    lead: L(
      'Qavslar, amal darajasi va chapdan o‘ngga yurish — bitta aniq algoritm.',
      'Скобки, уровни действий и движение слева направо образуют единый алгоритм.',
      'Brackets, operation levels and left-to-right movement form one clear algorithm.',
    ),
    audioSteps: [
      A(
        'Dars yakunlandi. Avval qavslar, keyin ko‘paytirish va bo‘lish, so‘ng qo‘shish va ayirish. Teng darajada doimo chapdan o‘ngga yuring.',
        'Урок завершён. Сначала скобки, затем умножение и деление, после них сложение и вычитание. При равном приоритете всегда двигайтесь слева направо.',
        'The lesson is complete. Use brackets first, then multiplication and division, followed by addition and subtraction. At equal priority, always move from left to right.',
      ),
    ],
  },
]

function useIsMobile(breakpoint = 720) {
  const [mobile, setMobile] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  ))
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const update = () => setMobile(window.innerWidth < breakpoint)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [breakpoint])
  return mobile
}

function AmbientMotion({ mobile }) {
  const size = (desktop, compact) => mobile ? compact : desktop
  const orbs = [
    {
      width: size(90, 58),
      height: size(90, 58),
      left: '5%',
      top: '9%',
      background: 'radial-gradient(circle at 30% 30%, rgba(255, 79, 40, .10), rgba(255, 79, 40, .02))',
      animationDelay: '0s',
    },
    {
      width: size(130, 82),
      height: size(130, 82),
      right: '3%',
      bottom: '6%',
      background: 'radial-gradient(circle at 30% 30%, rgba(1, 154, 203, .10), rgba(1, 154, 203, .02))',
      animationDelay: '-5s',
    },
    {
      width: size(58, 38),
      height: size(58, 38),
      left: '42%',
      top: '62%',
      background: 'radial-gradient(circle at 30% 30%, rgba(255, 79, 40, .10), rgba(255, 79, 40, .02))',
      animationDelay: '-9s',
    },
  ]
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {orbs.map((orb, index) => <span key={index} className="g7-ambient-orb" style={orb} />)}
    </div>
  )
}

function CelebrationParticles() {
  const particles = [
    [8, C.primary, '-10px', '170deg', '-.2s'],
    [19, C.blue, '13px', '-140deg', '-.7s'],
    [31, C.yellow, '-8px', '190deg', '-1.1s'],
    [44, C.green, '10px', '-165deg', '-.4s'],
    [57, C.primary, '-14px', '155deg', '-1.3s'],
    [69, C.blue, '9px', '-185deg', '-.9s'],
    [82, C.yellow, '-11px', '145deg', '-1.5s'],
    [92, C.green, '8px', '-175deg', '-.5s'],
  ]
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit', pointerEvents: 'none' }}>
      {particles.map(([left, color, shift, rotation, delay], index) => (
        <span
          className="g7-confetti"
          key={index}
          style={{
            left: `${left}%`,
            background: color,
            animationDelay: delay,
            '--g7-confetti-x': shift,
            '--g7-confetti-r': rotation,
          }}
        />
      ))}
    </div>
  )
}

function IconButton({ label, onClick, children, active = false }) {
  return (
    <button
      type="button"
      className="g7-icon-action"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        width: 26,
        height: 26,
        borderRadius: 8,
        border: 0,
        background: 'transparent',
        color: active ? C.primary : C.text,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function PrimaryButton({ children, onClick, disabled = false, style = {}, ...props }) {
  return (
    <button
      {...props}
      type="button"
      className="g7-primary-action"
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 42,
        border: 0,
        borderRadius: 12,
        padding: '10px 18px',
        background: C.paper,
        color: C.primary,
        font: `700 14px ${F.sans}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled
          ? '0 4px 12px -4px rgba(58, 53, 48, .14)'
          : '0 8px 22px -4px rgba(255, 79, 40, .35), 0 0 0 1px rgba(255, 79, 40, .12)',
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function QuietButton({ children, onClick, disabled = false, style = {}, ...props }) {
  return (
    <button
      {...props}
      type="button"
      className="g7-ghost-action"
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 42,
        border: 0,
        borderRadius: 12,
        padding: '9px 15px',
        background: 'transparent',
        color: C.text,
        font: `750 14px ${F.sans}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function Panel({ children, tone = 'plain', style = {}, ...props }) {
  const tones = {
    plain: { background: C.paper, accent: null },
    orange: { background: C.primarySoft, accent: C.primary },
    blue: { background: C.blueSoft, accent: C.blue },
    green: { background: C.greenSoft, accent: C.green },
    yellow: { background: C.yellowSoft, accent: C.yellow },
  }
  return (
    <div {...props} className="g7-panel" style={{
      border: 0,
      borderLeft: tones[tone].accent ? `4px solid ${tones[tone].accent}` : 0,
      background: tones[tone].background,
      borderRadius: tone === 'plain' ? 16 : 12,
      padding: 17,
      boxShadow: '0 8px 22px -6px rgba(58, 53, 48, .14)',
      ...style,
    }}>
      {children}
    </div>
  )
}

function Feedback({ ok, children }) {
  return (
    <motion.div
      className="g7-fade-up"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 9,
        border: 0,
        borderLeft: `4px solid ${ok ? C.green : C.red}`,
        background: ok ? C.greenSoft : C.redSoft,
        color: C.text,
        borderRadius: 12,
        padding: '10px 13px',
        font: `700 13px/1.4 ${F.sans}`,
        boxShadow: ok
          ? '0 6px 16px -6px rgba(31, 122, 77, .22)'
          : '0 6px 16px -6px rgba(255, 79, 40, .22)',
      }}
    >
      <span className={ok ? 'g7-success-mark' : 'g7-error-mark'}>
        {ok ? <Check size={18} /> : <X size={18} />}
      </span>
      <span>{children}</span>
    </motion.div>
  )
}

function ChoiceGrid({ options, selected, onSelect, lang, mobile, columns = 2, locked = false }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: mobile || columns === 1 ? '1fr' : `repeat(${columns}, minmax(0, 1fr))`,
      gap: mobile ? 8 : 10,
    }}>
      {options.map((option, index) => {
        const isSelected = selected === option.id
        const mathOnly = isMathOnly(option.label, lang)
        const fraction = hasVerticalFraction(option.label, lang)
        return (
          <button
            type="button"
            className={`g7-option g7-fade-up${mathOnly ? ' g7-math-button' : ''}${isSelected ? ' g7-selected' : ''}`}
            key={option.id}
            disabled={locked}
            onClick={() => onSelect(option)}
            style={{
              minHeight: fraction ? (mobile ? 56 : 62) : mobile ? 42 : 48,
              borderRadius: 12,
              border: '1px solid transparent',
              background: isSelected ? C.primarySoft : C.paper,
              color: C.text,
              padding: mobile ? '8px 11px' : '11px 14px',
              textAlign: mathOnly ? 'center' : 'left',
              font: `750 ${mobile ? 13 : 14}px/1.3 ${F.sans}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: mathOnly ? 'center' : 'flex-start',
              gap: 10,
              cursor: locked ? 'default' : 'pointer',
              animationDelay: `${Math.min(0.36, index * 0.08)}s`,
              boxShadow: isSelected
                ? '0 8px 22px -6px rgba(255, 79, 40, .35)'
                : '0 6px 16px -6px rgba(58, 53, 48, .14)',
            }}
          >
            {option.code && (
              <span style={{
                color: C.primary,
                font: `800 12px ${F.mono}`,
                minWidth: 20,
              }}>
                {option.code}
              </span>
            )}
            <span><RichMathText value={option.label} lang={lang} /></span>
          </button>
        )
      })}
    </div>
  )
}

const TEACHING_LESSONS = [
  {
    variant: 'flow',
    formula: '7 + 5 · 2',
    prediction: {
      prompt: L(
        'Qaysi bo‘lakni birinchi hisoblaymiz?',
        'Какой фрагмент вычислим первым?',
        'Which part should we calculate first?',
      ),
      audio: A(
        'Ifodani kuzating. Qaysi bo‘lakni birinchi hisoblash kerakligini tanlang.',
        'Рассмотрите выражение. Выберите фрагмент, который нужно вычислить первым.',
        'Inspect the expression. Choose the part that should be calculated first.',
      ),
      options: [
        { id: 'sum', label: L('7 + 5', '7 + 5', '7 + 5') },
        { id: 'product', label: L('5 · 2', '5 · 2', '5 · 2') },
      ],
      correct: 'product',
    },
    steps: [
      {
        equation: '7 + 5 · 2  →  7 + 10',
        text: L('Faqat 5 · 2 o‘rniga 10 yozamiz.', 'Заменяем только 5 · 2 числом 10.', 'Replace only 5 · 2 with 10.'),
      },
      {
        equation: '7 + 10  →  17',
        text: L('Qolgan qo‘shishni bajaramiz.', 'Выполняем оставшееся сложение.', 'Perform the remaining addition.'),
      },
      {
        equation: '17',
        text: L('17 — ifodaning qiymati.', '17 — значение выражения.', '17 is the value of the expression.'),
      },
    ],
    rule: L(
      'Sonli ifodani hisoblash natijasida olingan son uning qiymati deyiladi.',
      'Результат вычисления числового выражения называется его значением.',
      'The result of evaluating a numerical expression is called its value.',
    ),
  },
  {
    variant: 'compare',
    formula: L('QAVSSIZ  ↔  QAVS BILAN', 'БЕЗ СКОБОК  ↔  СО СКОБКАМИ', 'WITHOUT BRACKETS  ↔  WITH BRACKETS'),
    prediction: {
      prompt: L(
        'Qavsli ifodada qaysi amal birinchi?',
        'Какое действие первое в выражении со скобками?',
        'Which operation comes first in the expression with brackets?',
      ),
      audio: A(
        'Ikki ifodani solishtiring. Qavsli ifodada qaysi amal birinchi bajarilishini tanlang.',
        'Сравните два выражения. Выберите первое действие в выражении со скобками.',
        'Compare the two expressions. Choose the first operation in the expression with brackets.',
      ),
      options: [
        { id: 'inside', label: L('2 + 3', '2 + 3', '2 + 3') },
        { id: 'multiply', label: L('3 · 4', '3 · 4', '3 · 4') },
      ],
      correct: 'inside',
    },
    steps: [
      {
        equation: '2 + 3 · 4  →  2 + 12  →  14',
        text: L('Qavssiz: avval ko‘paytirish.', 'Без скобок: сначала умножение.', 'Without brackets: multiply first.'),
      },
      {
        equation: '(2 + 3) · 4  →  5 · 4  →  20',
        text: L('Qavs bilan: avval guruh ichida.', 'Со скобками: сначала внутри группы.', 'With brackets: work inside the group first.'),
      },
      {
        equation: '14 ≠ 20',
        text: L('Sonlar emas, guruhlash o‘zgardi.', 'Изменились не числа, а группировка.', 'The grouping changed, not the numbers.'),
      },
    ],
    rule: L('Qavslar ifodaning tuzilishini belgilaydi: avval qavs ichidagi amallar bajariladi.', 'Скобки задают структуру выражения: сначала выполняют действия внутри скобок.', 'Brackets define the expression structure: evaluate inside the brackets first.'),
  },
  {
    variant: 'hierarchy',
    formula: '18 − 6 : 3 + 4',
    prediction: {
      prompt: L(
        'Qaysi amal birinchi bajariladi?',
        'Какое действие выполняется первым?',
        'Which operation is performed first?',
      ),
      audio: A(
        'Ifodadagi birinchi bajariladigan amalni tanlang.',
        'Выберите действие, которое выполняется в выражении первым.',
        'Choose the operation that is performed first in the expression.',
      ),
      options: [
        { id: 'subtract', label: L('18 − 6', '18 − 6', '18 − 6') },
        { id: 'divide', label: L('6 : 3', '6 : 3', '6 : 3') },
        { id: 'add', label: L('3 + 4', '3 + 4', '3 + 4') },
      ],
      correct: 'divide',
    },
    levels: [
      L('Qavslar', 'Скобки', 'Brackets'),
      L('× va ÷', '× и ÷', '× and ÷'),
      L('+ va −', '+ и −', '+ and −'),
    ],
    steps: [
      {
        equation: '18 − 6 : 3 + 4  →  18 − 2 + 4',
        text: L('Faqat 6 : 3 o‘rniga 2 yozamiz.', 'Заменяем только 6 : 3 числом 2.', 'Replace only 6 ÷ 3 with 2.'),
      },
      {
        equation: '18 − 2 + 4  →  16 + 4',
        text: L('Endi teng amallar chapdan o‘ngga.', 'Теперь равноправные действия идут слева направо.', 'Now evaluate equal-priority operations left to right.'),
      },
      {
        equation: '16 + 4  →  20',
        text: L('Oxirgi qo‘shishni bajaramiz.', 'Выполняем последнее сложение.', 'Perform the final addition.'),
      },
    ],
    rule: L('Ko‘paytirish va bo‘lish qo‘shish va ayirishdan yuqori ustuvorlikka ega.', 'Умножение и деление имеют более высокий приоритет, чем сложение и вычитание.', 'Multiplication and division have higher priority than addition and subtraction.'),
  },
  {
    variant: 'lane',
    formula: '24 : 6 · 3',
    prediction: {
      prompt: L(
        'Bo‘lishmi yoki ko‘paytirishmi — qaysi biri birinchi?',
        'Деление или умножение — что выполняется первым?',
        'Division or multiplication — which comes first?',
      ),
      audio: A(
        'Bo‘lish va ko‘paytirish teng darajada. Qaysi amal birinchi bajarilishini tanlang.',
        'Деление и умножение равноправны. Выберите действие, которое выполняется первым.',
        'Division and multiplication have equal priority. Choose which operation is performed first.',
      ),
      options: [
        { id: 'divide', label: L('24 : 6', '24 : 6', '24 : 6') },
        { id: 'multiply', label: L('6 · 3', '6 · 3', '6 · 3') },
      ],
      correct: 'divide',
    },
    steps: [
      {
        equation: L('÷ va × — teng daraja', '÷ и × равноправны', '÷ and × have equal priority'),
        text: L('Ko‘paytirish bo‘lishdan oldin degani emas.', 'Это не значит, что умножение раньше деления.', 'Multiplication does not automatically come before division.'),
      },
      {
        equation: '24 : 6 · 3  →  4 · 3',
        text: L('Eng chap amal — 24 : 6.', 'Самое левое действие — 24 : 6.', 'The leftmost operation is 24 ÷ 6.'),
      },
      {
        equation: '4 · 3  →  12',
        text: L('So‘ng keyingi amal.', 'Затем следующее действие.', 'Then perform the next operation.'),
      },
      {
        equation: '20 − 8 + 3  →  12 + 3  →  15',
        text: L('+ va − ham chapdan o‘ngga.', '+ и − тоже выполняются слева направо.', '+ and − also go from left to right.'),
      },
    ],
    rule: L('Teng darajadagi amallar chapdan o‘ngga bajariladi: × va ÷; + va −.', 'Действия одного уровня выполняются слева направо: × и ÷; + и −.', 'Equal-priority operations are performed left to right: × and ÷; + and −.'),
  },
  {
    variant: 'worked',
    formula: '36 : (9 − 3) + 5 · 2',
    prediction: {
      prompt: L(
        'Qaysi bo‘lakdan boshlaymiz?',
        'С какого фрагмента начнём?',
        'Which part should we start with?',
      ),
      audio: A(
        'To‘liq misolni kuzating va birinchi bajariladigan bo‘lakni tanlang.',
        'Рассмотрите полный пример и выберите первый вычисляемый фрагмент.',
        'Inspect the complete example and choose the first part to evaluate.',
      ),
      options: [
        { id: 'bracket', label: L('9 − 3', '9 − 3', '9 − 3') },
        { id: 'divide', label: L('36 : 9', '36 : 9', '36 : 9') },
        { id: 'multiply', label: L('5 · 2', '5 · 2', '5 · 2') },
      ],
      correct: 'bracket',
    },
    steps: [
      {
        equation: '36 : (9 − 3) + 5 · 2  →  36 : 6 + 5 · 2',
        text: L('1. Qavs ichidagi bo‘lakni almashtirdik.', '1. Заменили выражение внутри скобок.', '1. Replace the expression inside the brackets.'),
      },
      {
        equation: '36 : 6 + 5 · 2  →  6 + 5 · 2',
        text: L('2. Eng chap yuqori amal — bo‘lish.', '2. Левое действие высокого уровня — деление.', '2. The leftmost higher-priority operation is division.'),
      },
      {
        equation: '6 + 5 · 2  →  6 + 10',
        text: L('3. Endi ko‘paytirish.', '3. Теперь умножение.', '3. Now multiply.'),
      },
      {
        equation: '6 + 10  →  16',
        text: L('4. Oxirida qo‘shish.', '4. В конце сложение.', '4. Finish with addition.'),
      },
    ],
    rule: L('Har o‘tishda faqat bitta bo‘lak o‘zgaradi, qolgan yozuv aynan saqlanadi.', 'В каждом переходе изменяется только один фрагмент, остальная запись сохраняется.', 'At each transition, only one part changes and the rest of the expression is preserved.'),
  },
  {
    variant: 'audit',
    formula: '18 − 6 : 3 + 4',
    prediction: {
      prompt: L(
        'Bekzod yo‘lidagi birinchi noto‘g‘ri o‘tishni tanlang.',
        'Выберите первый неверный переход в решении Бекзода.',
        'Choose the first incorrect transition in Bekzod’s solution.',
      ),
      audio: A(
        'Bekzodning yechim yo‘lini tekshiring. Birinchi noto‘g‘ri o‘tishni tanlang.',
        'Проверьте решение Бекзода. Выберите первый неверный переход.',
        'Audit Bekzod’s solution. Choose the first incorrect transition.',
      ),
      options: [
        { id: 'first', label: L('18 − 6 : 3 + 4 → 12 : 3 + 4', '18 − 6 : 3 + 4 → 12 : 3 + 4', '18 − 6 ÷ 3 + 4 → 12 ÷ 3 + 4') },
        { id: 'second', label: L('12 : 3 + 4 → 4 + 4', '12 : 3 + 4 → 4 + 4', '12 ÷ 3 + 4 → 4 + 4') },
        { id: 'third', label: L('4 + 4 → 8', '4 + 4 → 8', '4 + 4 → 8') },
      ],
      correct: 'first',
    },
    steps: [
      {
        equation: '18 − 6 : 3 + 4  →  12 : 3 + 4  →  4 + 4  →  8  ✕',
        text: L('Birinchi o‘tishda ayirish erta bajarildi.', 'В первом переходе вычитание выполнено слишком рано.', 'Subtraction was performed too early in the first transition.'),
        wrong: true,
      },
      {
        equation: '18 − 6 : 3 + 4  →  18 − 2 + 4',
        text: L('To‘g‘ri boshlanish — 6 : 3.', 'Правильное начало — 6 : 3.', 'The correct start is 6 ÷ 3.'),
      },
      {
        equation: '18 − 2 + 4  →  16 + 4',
        text: L('Keyin chapdan o‘ngga ayirish.', 'Затем вычитание слева направо.', 'Then subtract from left to right.'),
      },
      {
        equation: '16 + 4  →  20',
        text: L('Yagona to‘g‘ri qiymat — 20.', 'Единственное верное значение — 20.', 'The only correct value is 20.'),
      },
    ],
    rule: L('8 javobi 18 − 6 dan noto‘g‘ri boshlash natijasida chiqdi; bo‘lish ustuvorligi buzildi.', 'Ответ 8 появился из-за неверного начала с 18 − 6: был нарушен приоритет деления.', 'The answer 8 came from incorrectly starting with 18 − 6 and violating division priority.'),
  },
  {
    variant: 'rule-map',
    formula: L('QAVS → × ÷ → + −', 'СКОБКИ → × ÷ → + −', 'BRACKETS → × ÷ → + −'),
    prediction: {
      prompt: L(
        'Qavslardan keyin qaysi amal guruhi keladi?',
        'Какая группа действий идёт после скобок?',
        'Which operation group comes after brackets?',
      ),
      audio: A(
        'Qoida xaritasini xotiradan tiklang. Qavslardan keyingi guruhni tanlang.',
        'Восстановите карту правила по памяти. Выберите группу после скобок.',
        'Rebuild the rule map from memory. Choose the group that follows brackets.',
      ),
      options: [
        { id: 'high', label: L('× va ÷', '× и ÷', '× and ÷') },
        { id: 'low', label: L('+ va −', '+ и −', '+ and −') },
        { id: 'check', label: L('Tekshirish', 'Проверка', 'Checking') },
      ],
      correct: 'high',
    },
    steps: [
      {
        equation: L('1. Qavslar', '1. Скобки', '1. Brackets'),
        text: L('Ichkaridan tashqariga.', 'Изнутри наружу.', 'Work from the inside out.'),
      },
      {
        equation: L('2. × va ÷', '2. × и ÷', '2. × and ÷'),
        text: L('Chapdan o‘ngga.', 'Слева направо.', 'Move from left to right.'),
      },
      {
        equation: L('3. + va −', '3. + и −', '3. + and −'),
        text: L('Chapdan o‘ngga.', 'Слева направо.', 'Move from left to right.'),
      },
      {
        equation: L('O‘zini tekshirish', 'Самопроверка', 'Self-check'),
        text: L('Bu amal darajasi emas.', 'Это не уровень действий.', 'This is not an operation level.'),
      },
    ],
    rule: L('Uch amal darajasi bor. Tekshirish esa har bir o‘tishni nazorat qilish odati.', 'Есть три уровня действий. Проверка — отдельная привычка контролировать каждый переход.', 'There are three operation levels. Checking is a separate habit of verifying each transition.'),
  },
]

function TheoryStepCard({ step, visible, active, mobile, lang, className = '', style = {} }) {
  return (
    <div
      className={`g7-teach-step${visible ? ' g7-visible' : ''}${active ? ' g7-active' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden={!visible}
      style={{
        minHeight: mobile ? 58 : 74,
        borderRadius: 12,
        padding: mobile ? '9px 11px' : '11px 12px',
        background: C.paper,
        boxShadow: '0 6px 16px -6px rgba(58, 53, 48, .14)',
        display: 'grid',
        alignContent: 'center',
        gap: 5,
        ...style,
      }}
    >
      <strong style={{
        color: step.wrong ? C.red : active ? C.blue : C.text,
        font: `800 ${mobile ? 14 : 16}px/1.25 ${F.serif}`,
      }}>
        <TextbookMath value={step.equation} lang={lang} fractionColor={step.wrong ? C.red : active ? C.blue : undefined} />
      </strong>
      <span style={{ color: C.muted, font: `650 ${mobile ? 10.5 : 11.5}px/1.38 ${F.sans}` }}>
        <RichMathText value={step.text} lang={lang} />
      </span>
    </div>
  )
}

function TheoryFormula({ children, mobile, tone = 'plain', style = {} }) {
  return (
    <Panel tone={tone} style={{ padding: mobile ? 12 : 15, textAlign: 'center', ...style }}>
      <div style={{
        color: C.text,
        font: `800 ${mobile ? 23 : 30}px/1.15 ${F.serif}`,
        letterSpacing: '-.01em',
      }}>
        {typeof children === 'string' || typeof children === 'number'
          ? <TextbookMath value={children} />
          : children}
      </div>
    </Panel>
  )
}

function TheoryVisual({ lesson, revealedPhase, activePhase, mobile, lang }) {
  const visible = (index) => index <= revealedPhase
  const active = (index) => index === activePhase

  if (lesson.variant === 'flow') {
    return (
      <Panel style={{ padding: mobile ? 12 : 16 }}>
        <div style={{ color: C.muted, font: `800 10px ${F.mono}`, letterSpacing: '.13em', textTransform: 'uppercase', marginBottom: 9 }}>
          {tr(L('Ifodadan qiymatga', 'От выражения к значению', 'From expression to value'), lang)}
        </div>
        <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: 'stretch', gap: mobile ? 5 : 7 }}>
          {lesson.steps.map((step, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: 'center', gap: mobile ? 4 : 7 }}>
              <TheoryStepCard
                {...{ step, index, mobile, lang }}
                visible={visible(index)}
                active={active(index)}
                className={visible(index) ? 'g7-theory-flow-node' : ''}
                style={{ width: '100%', minHeight: mobile ? 50 : 88, textAlign: 'center' }}
              />
              {index < lesson.steps.length - 1 && (
                <ArrowRight
                  className={visible(index + 1) ? 'g7-theory-connector' : ''}
                  aria-hidden="true"
                  size={18}
                  color={visible(index + 1) ? C.primary : C.subtle}
                  style={{ flex: '0 0 auto', opacity: visible(index + 1) ? 1 : .24, transform: mobile ? 'rotate(90deg)' : undefined }}
                />
              )}
            </div>
          ))}
        </div>
      </Panel>
    )
  }

  if (lesson.variant === 'compare') {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <TheoryFormula mobile={mobile}>{tr(lesson.formula, lang)}</TheoryFormula>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 8 }}>
          {lesson.steps.slice(0, 2).map((step, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <TheoryStepCard
                {...{ step, index, mobile, lang }}
                visible={visible(index)}
                active={active(index)}
                style={{
                  minHeight: mobile ? 68 : 94,
                  textAlign: 'center',
                  borderTop: `3px solid ${index === 1 ? C.primary : C.blue}`,
                }}
              />
            </div>
          ))}
          <TheoryStepCard
            step={lesson.steps[2]}
            index={2}
            mobile={mobile}
            lang={lang}
            visible={visible(2)}
            active={active(2)}
            style={{
              gridColumn: mobile ? undefined : '1 / -1',
              minHeight: mobile ? 54 : 66,
              textAlign: 'center',
              background: visible(2) ? C.yellowSoft : C.paper,
            }}
          />
        </div>
      </div>
    )
  }

  if (lesson.variant === 'hierarchy') {
    const activeLevel = revealedPhase < 0 ? -1 : revealedPhase < 2 ? 1 : 2
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <TheoryFormula mobile={mobile}>{tr(lesson.formula, lang)}</TheoryFormula>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '.7fr 1.3fr', gap: 8, alignItems: 'stretch' }}>
          <Panel tone="blue" style={{ padding: mobile ? 10 : 13, display: 'grid', gap: 6 }}>
            {lesson.levels.map((level, index) => {
              const isActive = index === activeLevel
              const isKnown = index === 0 || index < activeLevel
              return (
                <div
                  key={index}
                  className={isActive ? 'g7-level-active' : ''}
                  style={{
                    minHeight: mobile ? 35 : 41,
                    borderRadius: 10,
                    background: isActive ? C.paper : isKnown ? C.greenSoft : 'rgba(255,255,255,.45)',
                    color: isActive ? C.blue : isKnown ? C.green : C.muted,
                    display: 'grid',
                    gridTemplateColumns: '28px 1fr',
                    alignItems: 'center',
                    gap: 7,
                    padding: '6px 9px',
                    font: `800 ${mobile ? 12 : 13}px ${F.sans}`,
                  }}
                >
                  <span style={{ font: `900 11px ${F.mono}` }}>0{index + 1}</span>
                  <span>{tr(level, lang)}</span>
                </div>
              )
            })}
          </Panel>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: 7 }}>
            {lesson.steps.map((step, index) => (
              <TheoryStepCard key={index} {...{ step, index, mobile, lang }} visible={visible(index)} active={active(index)} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (lesson.variant === 'lane') {
    const cursorPhase = activePhase >= 0 ? activePhase : revealedPhase
    const focusIndex = cursorPhase < 2 ? 0 : cursorPhase === 2 ? 1 : -1
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <Panel tone="yellow" style={{ padding: mobile ? 12 : 15, textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ color: C.muted, font: `800 10px ${F.mono}`, letterSpacing: '.13em', textTransform: 'uppercase' }}>
            {tr(L('Chapdan o‘ngga skaner', 'Сканер слева направо', 'Left-to-right scanner'), lang)}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: mobile ? 8 : 12, marginTop: 8 }}>
            <span style={{
              padding: mobile ? '5px 8px' : '6px 11px',
              borderRadius: 10,
              borderBottom: `4px solid ${focusIndex === 0 && revealedPhase >= 0 ? C.blue : 'transparent'}`,
              background: focusIndex === 0 && revealedPhase >= 0 ? C.blueSoft : 'transparent',
              color: focusIndex === 0 ? C.blue : C.text,
              fontSize: mobile ? 24 : 31,
              transition: 'background .35s ease, border-color .35s ease, color .35s ease',
            }}>
              <TextbookMath value="24 : 6" />
            </span>
            <span style={{
              padding: mobile ? '5px 8px' : '6px 11px',
              borderRadius: 10,
              borderBottom: `4px solid ${focusIndex === 1 ? C.blue : 'transparent'}`,
              background: focusIndex === 1 ? C.blueSoft : 'transparent',
              color: focusIndex === 1 ? C.blue : C.text,
              fontSize: mobile ? 24 : 31,
              transition: 'background .35s ease, border-color .35s ease, color .35s ease',
            }}>
              <TextbookMath value="· 3" />
            </span>
          </div>
        </Panel>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : `repeat(${Math.min(lesson.steps.length, 4)}, 1fr)`, gap: 7 }}>
          {lesson.steps.map((step, index) => (
            <TheoryStepCard key={index} {...{ step, index, mobile, lang }} visible={visible(index)} active={active(index)} />
          ))}
        </div>
      </div>
    )
  }

  if (lesson.variant === 'worked') {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <TheoryFormula mobile={mobile}>{tr(lesson.formula, lang)}</TheoryFormula>
        <Panel style={{ padding: mobile ? 10 : 13 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
            {lesson.steps.map((step, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 7, alignItems: 'stretch' }}>
                <span style={{
                  width: 26,
                  height: 26,
                  marginTop: 5,
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  background: visible(index) ? (active(index) ? C.blueSoft : C.greenSoft) : C.inkSoft,
                  color: active(index) ? C.blue : visible(index) ? C.green : C.subtle,
                  font: `900 11px ${F.mono}`,
                }}>
                  {index + 1}
                </span>
                <TheoryStepCard {...{ step, index, mobile, lang }} visible={visible(index)} active={active(index)} style={{ minHeight: mobile ? 48 : 55 }} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    )
  }

  if (lesson.variant === 'audit') {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <TheoryFormula mobile={mobile}>{tr(lesson.formula, lang)}</TheoryFormula>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '.78fr 1.22fr', gap: 8 }}>
          <Panel tone="orange" style={{ padding: mobile ? 10 : 12 }}>
            <div style={{ color: C.red, font: `800 10px ${F.mono}`, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 7 }}>
              {tr(L('Shubhali yo‘l', 'Подозрительный путь', 'Suspicious route'), lang)}
            </div>
            <TheoryStepCard
              step={lesson.steps[0]}
              index={0}
              mobile={mobile}
              lang={lang}
              visible={visible(0)}
              active={active(0)}
              className={visible(0) ? 'g7-audit-wrong' : ''}
              style={{ minHeight: mobile ? 58 : 92, background: C.redSoft }}
            />
          </Panel>
          <Panel tone="green" style={{ padding: mobile ? 10 : 12 }}>
            <div style={{ color: C.green, font: `800 10px ${F.mono}`, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 7 }}>
              {tr(L('Qoidani tiklaymiz', 'Восстанавливаем правило', 'Repair the route'), lang)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: 6 }}>
              {lesson.steps.slice(1).map((step, offset) => {
                const index = offset + 1
                return <TheoryStepCard key={index} {...{ step, index, mobile, lang }} visible={visible(index)} active={active(index)} style={{ minHeight: mobile ? 52 : 92 }} />
              })}
            </div>
          </Panel>
        </div>
      </div>
    )
  }

  if (lesson.variant === 'rule-map') {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: 7 }}>
          {lesson.steps.slice(0, 3).map((step, index) => (
            <TheoryStepCard
              key={index}
              {...{ step, index, mobile, lang }}
              visible={visible(index)}
              active={active(index)}
              className={visible(index) ? 'g7-rule-card' : ''}
              style={{
                minHeight: mobile ? 72 : 94,
                textAlign: 'center',
                background: visible(index) ? [C.primarySoft, C.blueSoft, C.yellowSoft][index] : C.paper,
                animationDelay: `${index * .08}s`,
              }}
            />
          ))}
        </div>
        <Panel tone="yellow" style={{ padding: mobile ? 10 : 12, opacity: visible(3) ? 1 : .2, transition: 'opacity .3s ease', display: 'grid', gridTemplateColumns: '26px 1fr', gap: 8, alignItems: 'center' }}>
          <ShieldCheck size={20} color={C.yellow} />
          <div style={{ display: 'grid', gap: 2 }}>
            <strong style={{ color: C.text, font: `800 ${mobile ? 12 : 13}px ${F.sans}` }}>
              <RichMathText value={lesson.steps[3].equation} lang={lang} />
            </strong>
            <span style={{ color: C.muted, font: `650 ${mobile ? 10.5 : 11.5}px/1.35 ${F.sans}` }}>
              <RichMathText value={lesson.steps[3].text} lang={lang} />
            </span>
          </div>
        </Panel>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 8, opacity: visible(3) ? 1 : .2, transition: 'opacity .3s ease' }}>
          <Panel tone="green" style={{ padding: mobile ? 10 : 12, textAlign: 'center' }}>
            <div style={{ font: `850 ${mobile ? 16 : 19}px ${F.serif}`, color: C.text }}>
              <TextbookMath value="18 − " />
              <span style={{ color: C.primary }}><TextbookMath value="6 : 3" /></span>
              <TextbookMath value=" + 4 → 18 − 2 + 4 → " />
              <span style={{ color: C.green }}><TextbookMath value="20" /></span>
            </div>
          </Panel>
          <Panel tone="orange" style={{ padding: mobile ? 10 : 12, textAlign: 'center' }}>
            <div style={{ font: `800 ${mobile ? 14 : 17}px ${F.serif}`, color: C.text }}>
              <span style={{ color: C.red }}><TextbookMath value="18 − 6" /></span>
              <TextbookMath value=" : 3 + 4 → 8" />
            </div>
            <div style={{ marginTop: 3, color: C.muted, font: `650 ${mobile ? 10 : 11}px/1.35 ${F.sans}` }}>
              {tr(L('Bo‘lish ustuvorligi buzildi.', 'Нарушен приоритет деления.', 'Division priority was violated.'), lang)}
            </div>
          </Panel>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <TheoryFormula mobile={mobile}>{tr(lesson.formula, lang)}</TheoryFormula>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : `repeat(${lesson.steps.length}, 1fr)`, gap: 7 }}>
        {lesson.steps.map((step, index) => (
          <TheoryStepCard key={index} {...{ step, index, mobile, lang }} visible={visible(index)} active={active(index)} />
        ))}
      </div>
    </div>
  )
}

function TheoryPrediction({ prediction, selected, onSelect, lang, mobile }) {
  return (
    <Panel tone="yellow" style={{ padding: mobile ? 12 : 16, display: 'grid', gap: 11 }} data-testid="theory-prediction">
      <div style={{ display: 'grid', gap: 4 }}>
        <span style={{ color: C.yellow, font: `850 10px ${F.mono}`, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          {tr(L('Avval taxmin qiling', 'Сначала предположите', 'Predict first'), lang)}
        </span>
        <strong style={{ color: C.text, font: `800 ${mobile ? 16 : 19}px/1.35 ${F.serif}` }}>
          <RichMathText value={prediction.prompt} lang={lang} />
        </strong>
      </div>
      <ChoiceGrid
        options={prediction.options}
        selected={selected}
        onSelect={onSelect}
        lang={lang}
        mobile={mobile}
        columns={prediction.options.length === 2 ? 2 : 3}
      />
      <span style={{ color: C.muted, font: `650 11px/1.4 ${F.sans}` }}>
        {tr(L(
          'Bu baho emas: taxminingizdan keyin yechim dalillar bilan ochiladi.',
          'Это не оценка: после прогноза решение раскроется с доказательствами.',
          'This is not graded: after your prediction, the solution will unfold with evidence.',
        ), lang)}
      </span>
    </Panel>
  )
}

function TeachingActivity({ screenIdx, lang, audio, mobile, storedAnswer, onAnswer }) {
  const lesson = TEACHING_LESSONS[screenIdx - FIRST_THEORY_SCREEN]
  const [prediction, setPrediction] = useState(storedAnswer?.picked ?? null)
  const [revealedPhase, setRevealedPhase] = useState(-1)
  const segmentMatch = audio.currentSegment?.match(new RegExp(`^s${screenIdx}_step_(\\d+)$`))
  const activePhase = segmentMatch ? Number(segmentMatch[1]) : -1
  const explanationReady = Boolean(prediction)

  useEffect(() => {
    if (!prediction || audio.waitingFor?.type !== 'prediction_picked') return
    audio.triggerEvent('prediction_picked')
  }, [audio, prediction])

  useEffect(() => {
    if (!explanationReady) return undefined
    const nextPhase = audio.muted
      ? lesson.steps.length - 1
      : activePhase
    if (nextPhase < 0) return undefined
    const frame = window.requestAnimationFrame(() => {
      setRevealedPhase((current) => Math.max(current, nextPhase))
    })
    return () => window.cancelAnimationFrame(frame)
  }, [activePhase, audio.muted, explanationReady, lesson.steps.length])

  useEffect(() => {
    if (!explanationReady || audio.muted || audio.waitingFor || activePhase >= 0 || revealedPhase >= 0) return undefined
    const timer = window.setTimeout(() => setRevealedPhase(0), 1800)
    return () => window.clearTimeout(timer)
  }, [activePhase, audio.muted, audio.waitingFor, explanationReady, revealedPhase])

  const complete = revealedPhase >= lesson.steps.length - 1
  const choosePrediction = (option) => {
    if (prediction) return
    setPrediction(option.id)
    onAnswer({
      type: 'theory-prediction',
      correct: null,
      picked: option.id,
      matchedRule: option.id === lesson.prediction.correct,
    })
    audio.triggerEvent('prediction_picked')
  }

  return (
    <div style={{ display: 'grid', gap: mobile ? 8 : 10 }}>
      {!explanationReady && (
        <TheoryPrediction
          prediction={lesson.prediction}
          selected={prediction}
          onSelect={choosePrediction}
          lang={lang}
          mobile={mobile}
        />
      )}

      {explanationReady && (
        <>
      <div aria-label={tr(L('Tushuntirish bosqichlari', 'Этапы объяснения', 'Explanation stages'), lang)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {lesson.steps.map((_, index) => (
          <span
            key={index}
            className="g7-practice-dot"
            style={{
              width: index === activePhase ? 22 : 8,
              height: 8,
              borderRadius: 99,
              background: index <= revealedPhase ? (index === activePhase ? C.blue : C.green) : C.line,
              boxShadow: index === activePhase ? '0 0 10px rgba(1, 154, 203, .35)' : 'none',
            }}
          />
        ))}
        <span style={{ marginLeft: 5, color: C.muted, font: `700 10px ${F.mono}` }}>
          {Math.max(0, Math.min(revealedPhase + 1, lesson.steps.length))} / {lesson.steps.length}
        </span>
      </div>

      <TheoryVisual {...{ lesson, revealedPhase, activePhase, mobile, lang }} />

      {complete && (
        <div className="g7-solution-frame">
          <Panel tone="green" style={{ padding: mobile ? 11 : 13, display: 'flex', alignItems: 'flex-start', gap: 9 }}>
            <ShieldCheck size={19} color={C.green} style={{ flex: '0 0 auto' }} />
            <div>
              <div style={{ color: C.green, font: `800 10px ${F.mono}`, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 3 }}>
                {tr(L('Qoidani eslab qoling', 'Запомните правило', 'Remember the rule'), lang)}
              </div>
              <div style={{ color: C.text, font: `750 ${mobile ? 11.5 : 13}px/1.42 ${F.sans}` }}>
                <RichMathText value={lesson.rule} lang={lang} />
              </div>
            </div>
          </Panel>
        </div>
      )}
        </>
      )}
    </div>
  )
}

function HookVisual({ lang, revealedPhase, instant }) {
  const showExpression = instant || revealedPhase >= 0
  const showAziza = instant || revealedPhase >= 1
  const showBekzod = instant || revealedPhase >= 2
  const revealTransition = instant ? 'none' : 'opacity .35s ease'
  return (
    <div className="g7-hook-visual" style={{ width: '100%', maxWidth: 620, margin: '0 auto' }}>
      <svg viewBox="0 0 620 190" role="img" aria-label="18 minus 6 divided by 3 plus 4" style={{ width: '100%', display: 'block' }}>
        <defs>
          <filter id="grade7-hook-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#3A3530" floodOpacity=".12" />
          </filter>
        </defs>
        <rect x="12" y="18" width="596" height="154" rx="16" fill={C.paper} filter="url(#grade7-hook-shadow)" />
        <motion.path
          d="M310 36V154"
          stroke={C.line}
          strokeDasharray="7 7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />
        <foreignObject x="155" y="40" width="310" height="48" style={{ opacity: showExpression ? 1 : 0, transition: revealTransition }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: C.text, fontSize: 32 }}>
            <TextbookMath value="18 − 6 : 3 + 4" />
          </div>
        </foreignObject>
        <circle className={showAziza ? 'g7-result-a' : undefined} cx="170" cy="125" r="32" fill={C.primarySoft} stroke={C.primary} strokeOpacity=".3" style={{ opacity: showAziza ? 1 : 0, transition: revealTransition }} />
        <circle className={showBekzod ? 'g7-result-b' : undefined} cx="450" cy="125" r="32" fill={C.blueSoft} stroke={C.blue} strokeOpacity=".3" style={{ opacity: showBekzod ? 1 : 0, transition: revealTransition }} />
        <text x="170" y="132" textAnchor="middle" fontFamily={F.serif} fontWeight="900" fontSize="23" fill={C.primary} style={{ opacity: showAziza ? 1 : 0, transition: revealTransition }}>20</text>
        <text x="450" y="132" textAnchor="middle" fontFamily={F.serif} fontWeight="900" fontSize="23" fill={C.blue} style={{ opacity: showBekzod ? 1 : 0, transition: revealTransition }}>8</text>
        <text x="117" y="132" textAnchor="end" fontFamily={F.mono} fontWeight="800" fontSize="12" fill={C.muted} style={{ opacity: showAziza ? 1 : 0, transition: revealTransition }}>
          {tr(L('AZIZA', 'АЗИЗА', 'AZIZA'), lang)}
        </text>
        <text x="503" y="132" fontFamily={F.mono} fontWeight="800" fontSize="12" fill={C.muted} style={{ opacity: showBekzod ? 1 : 0, transition: revealTransition }}>
          {tr(L('BEKZOD', 'БЕКЗОД', 'BEKZOD'), lang)}
        </text>
      </svg>
    </div>
  )
}

function HookActivity({ lang, storedAnswer, onAnswer, mobile, audio }) {
  const options = [
    { id: 'numbers-changed', label: L('Kimdir sonlarni o‘zgartirgan', 'Кто-то изменил числа', 'Someone changed the numbers') },
    { id: 'different-order', label: L('Amallar turli tartibda bajarilgan', 'Действия выполнили в разном порядке', 'The operations were performed in different orders') },
    { id: 'both-valid', label: L('Ikkala tartib ham mumkin', 'Оба порядка допустимы', 'Both orders are valid') },
  ]
  const selected = storedAnswer?.picked ?? null
  const [fallbackReady, setFallbackReady] = useState(false)
  const [revealedPhase, setRevealedPhase] = useState(audio.muted ? 2 : -1)
  const segmentMatch = audio.currentSegment?.match(/^s0_step_(\d+)$/)
  const activePhase = segmentMatch ? Number(segmentMatch[1]) : -1
  const narrationWaiting = audio.waitingFor?.type === 'option_picked'
  const showOptions = Boolean(selected) || audio.muted || narrationWaiting || fallbackReady

  useEffect(() => {
    if (audio.muted) {
      const frame = window.requestAnimationFrame(() => setRevealedPhase(2))
      return () => window.cancelAnimationFrame(frame)
    }
    if (activePhase < 0) return undefined
    const frame = window.requestAnimationFrame(() => {
      setRevealedPhase((current) => Math.max(current, Math.min(activePhase, 2)))
    })
    return () => window.cancelAnimationFrame(frame)
  }, [activePhase, audio.muted])

  useEffect(() => {
    if (showOptions || audio.isPlaying || activePhase >= 0) return undefined
    const timer = window.setTimeout(() => {
      setRevealedPhase(2)
      setFallbackReady(true)
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [activePhase, audio.isPlaying, showOptions])

  const chooseHypothesis = (option) => {
    if (selected) return
    onAnswer({ type: 'hook', picked: option.id, correct: null })
    audio.triggerEvent('option_picked')
    if (!audio.muted) {
      window.setTimeout(() => audio.pushOneOff(tr(
        A(
          'Gipoteza yozib olindi. Keyingi ekranlarda uni dalillar bilan tekshiramiz.',
          'Гипотеза записана. На следующих экранах проверим её с помощью доказательств.',
          'Your hypothesis is recorded. Test it with evidence on the next screens.',
        ),
        lang,
      )), 120)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <HookVisual lang={lang} revealedPhase={revealedPhase} instant={audio.muted} />
      {showOptions && (
        <div className="g7-fade-up">
          <ChoiceGrid
            options={options}
            selected={selected}
            onSelect={chooseHypothesis}
            lang={lang}
            mobile={mobile}
            columns={3}
          />
        </div>
      )}
      {selected && (
        <Panel tone="yellow" style={{ padding: mobile ? 10 : 12, display: 'flex', alignItems: 'flex-start', gap: 9 }}>
          <Sparkles size={18} color={C.yellow} style={{ flex: '0 0 auto' }} />
          <span style={{ color: C.text, font: `700 ${mobile ? 11 : 12.5}px/1.42 ${F.sans}` }}>
            {tr(L(
              'Gipoteza qabul qilindi. 2–8-slaydlarda uni dalillar bilan tekshiramiz.',
              'Гипотеза принята. На слайдах 2–8 проверим её доказательствами.',
              'Hypothesis recorded. Test it with evidence on slides 2–8.',
            ), lang)}
          </span>
        </Panel>
      )}
    </div>
  )
}

const GUIDED_DATA = {
  pair: {
    values: ['14', '20', '24', '30'],
    result: L(
      'Qavslar qiymatni 14 dan 30 ga o‘zgartirdi.',
      'Скобки изменили значение с 14 на 30.',
      'The brackets changed the value from 14 to 30.',
    ),
    solution: [
      {
        text: L('4 + 2 · 5 → 4 + 10 → 14', '4 + 2 · 5 → 4 + 10 → 14', '4 + 2 × 5 → 4 + 10 → 14'),
        audio: A('Qavssiz ifodada avval ikki beshga ko‘paytiriladi. Natija o‘n to‘rt.', 'Без скобок сначала два умножаем на пять. Получаем четырнадцать.', 'Without brackets, multiply two by five first. The result is fourteen.'),
      },
      {
        text: L('(4 + 2) · 5 → 6 · 5 → 30', '(4 + 2) · 5 → 6 · 5 → 30', '(4 + 2) × 5 → 6 × 5 → 30'),
        audio: A('Qavsli ifodada avval to‘rtga ikki qo‘shiladi. Natija o‘ttiz.', 'Со скобками сначала складываем четыре и два. Получаем тридцать.', 'With brackets, add four and two first. The result is thirty.'),
      },
    ],
  },
  fullSequence: {
    formula: '48 : (10 − 4) · 3 + 2',
    items: [
      { id: 'bracket', label: '10 − 4 = 6' },
      { id: 'divide', label: '48 : 6 = 8' },
      { id: 'multiply', label: '8 · 3 = 24' },
      { id: 'add', label: '24 + 2 = 26' },
    ],
    order: ['bracket', 'divide', 'multiply', 'add'],
    result: L('Ifodaning qiymati 26 ga teng.', 'Значение выражения равно 26.', 'The value of the expression is 26.'),
    solution: [
      { text: '48 : (10 − 4) · 3 + 2 → 48 : 6 · 3 + 2', audio: A('Avval qavs: o‘n ayiruv to‘rt — olti.', 'Сначала скобки: десять минус четыре — шесть.', 'Start with the brackets: ten minus four is six.') },
      { text: '48 : 6 · 3 + 2 → 8 · 3 + 2', audio: A('Chapdagi bo‘lish: qirq sakkiz bo‘lingan olti — sakkiz.', 'Слева выполняем деление: сорок восемь разделить на шесть — восемь.', 'Divide on the left: forty-eight divided by six is eight.') },
      { text: '8 · 3 + 2 → 24 + 2', audio: A('Sakkizni uchga ko‘paytirib, yigirma to‘rt olamiz.', 'Восемь умножить на три — двадцать четыре.', 'Eight times three is twenty-four.') },
      { text: '24 + 2 → 26', audio: A('Oxirida yigirma to‘rtga ikki qo‘shamiz. Javob yigirma olti.', 'В конце прибавляем два. Ответ — двадцать шесть.', 'Finally add two. The answer is twenty-six.') },
    ],
  },
  equalPriority: {
    formula: '42 − 18 : 3 · 2',
    prediction: {
      prompt: L('Hisoblamasdan taxmin qiling: 30 yoki 39?', 'Не вычисляя до конца, спрогнозируйте: 30 или 39?', 'Predict before finishing: 30 or 39?'),
      options: [{ id: '30', label: '30' }, { id: '39', label: '39' }],
    },
    items: [
      { id: 'divide', label: '18 : 3 = 6' },
      { id: 'multiply', label: '6 · 2 = 12' },
      { id: 'subtract', label: '42 − 12 = 30' },
    ],
    order: ['divide', 'multiply', 'subtract'],
    result: L(
      'Javob 30. 39 faqat mavjud bo‘lmagan 18 : (3 · 2) qavslarini qo‘shganda chiqadi.',
      'Ответ 30. Число 39 получается, только если добавить отсутствующие скобки: 18 : (3 · 2).',
      'The answer is 30. You get 39 only by adding brackets that are not present: 18 ÷ (3 × 2).',
    ),
    solution: [
      { text: '42 − 18 : 3 · 2 → 42 − 6 · 2', audio: A('Bo‘lish va ko‘paytirish teng darajada. Chapdagi bo‘lishdan boshlaymiz.', 'Деление и умножение равноправны. Начинаем с деления слева.', 'Division and multiplication share a priority. Start with the division on the left.') },
      { text: '42 − 6 · 2 → 42 − 12', audio: A('Endi olti ikkiga ko‘paytiriladi.', 'Теперь шесть умножаем на два.', 'Now multiply six by two.') },
      { text: '42 − 12 → 30', audio: A('Qirq ikkidan o‘n ikkini ayirib, o‘ttiz olamiz.', 'Сорок два минус двенадцать — тридцать.', 'Forty-two minus twelve is thirty.') },
    ],
  },
  readiness: {
    formula: '72 : (11 − 3) · 2 − 5',
    firstOptions: [
      { id: 'brackets', label: '11 − 3' },
      { id: 'division', label: '72 : 11' },
      { id: 'subtract', label: '2 − 5' },
    ],
    reasonOptions: [
      { id: 'brackets-first', label: L('Qavs ichidagi amal birinchi', 'Действие в скобках выполняется первым', 'The operation in brackets comes first') },
      { id: 'left-only', label: L('Har doim eng chap amal birinchi', 'Всегда первым идёт самое левое действие', 'The leftmost operation always comes first') },
      { id: 'largest', label: L('Eng katta sonli amal birinchi', 'Сначала действие с самым большим числом', 'The operation with the largest number comes first') },
    ],
    solution: [
      { text: '11 − 3 = 8', audio: A('Avval qavs: o‘n birdan uchni ayirib, sakkiz olamiz.', 'Сначала скобки: одиннадцать минус три — восемь.', 'Start with the brackets: eleven minus three is eight.') },
      { text: '72 : 8 = 9', audio: A('Yetmish ikkini sakkizga bo‘lib, to‘qqiz olamiz.', 'Семьдесят два разделить на восемь — девять.', 'Seventy-two divided by eight is nine.') },
      { text: '9 · 2 = 18', audio: A('To‘qqizni ikkiga ko‘paytirib, o‘n sakkiz olamiz.', 'Девять умножить на два — восемнадцать.', 'Nine times two is eighteen.') },
      { text: '18 − 5 = 13', audio: A('O‘n sakkizdan beshni ayiramiz. Javob o‘n uch.', 'Восемнадцать минус пять — тринадцать.', 'Eighteen minus five is thirteen.') },
    ],
  },
}

function ProgressiveSolution({
  steps,
  lang,
  mobile,
  audio,
  testId = 'guided-solution',
  onComplete,
  onViewed,
  initiallyExpanded = false,
  completeLabel,
}) {
  const [visibleCount, setVisibleCount] = useState(initiallyExpanded ? steps.length : 1)
  const solutionRef = useRef(null)
  const announcedFirstRef = useRef(false)
  const viewedRef = useRef(initiallyExpanded)
  const pushOneOff = audio?.pushOneOff
  const muted = audio?.muted
  const speakStep = useCallback((index) => {
    const text = steps[index]?.audio ?? steps[index]?.text ?? steps[index]
    if (!muted && text) pushOneOff?.(tr(text, lang))
  }, [lang, muted, pushOneOff, steps])

  useEffect(() => {
    if (announcedFirstRef.current) return undefined
    announcedFirstRef.current = true
    if (steps.length <= 1 && onViewed && !viewedRef.current) {
      viewedRef.current = true
      onViewed()
    }
    const speechFrame = initiallyExpanded
      ? null
      : window.requestAnimationFrame(() => speakStep(0))
    const scrollTimer = window.setTimeout(() => {
      const solution = solutionRef.current
      const scrollArea = solution?.closest('main')
      if (!solution || !scrollArea) return
      const solutionRect = solution.getBoundingClientRect()
      const scrollRect = scrollArea.getBoundingClientRect()
      if (solutionRect.bottom > scrollRect.bottom - 8) {
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        solution.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' })
      }
    }, 180)
    return () => {
      if (speechFrame !== null) window.cancelAnimationFrame(speechFrame)
      window.clearTimeout(scrollTimer)
    }
  }, [initiallyExpanded, onViewed, speakStep, steps.length])

  const revealNext = () => {
    if (visibleCount >= steps.length) {
      onComplete?.()
      return
    }
    speakStep(visibleCount)
    const nextCount = visibleCount + 1
    setVisibleCount(nextCount)
    if (nextCount >= steps.length && !viewedRef.current) {
      viewedRef.current = true
      onViewed?.()
    }
  }

  return (
    <div ref={solutionRef} className="g7-solution-frame" data-testid={testId}>
      <Panel tone="green" style={{ padding: mobile ? 12 : 14, display: 'grid', gap: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="g7-success-mark"><Check size={19} color={C.green} /></span>
          <strong style={{ color: C.green, font: `850 11px ${F.mono}`, letterSpacing: '.1em', textTransform: 'uppercase' }}>
            {tr(L('Yechim qadamlari', 'Шаги решения', 'Solution steps'), lang)}
          </strong>
        </div>
        {steps.map((step, index) => {
          const revealed = index < visibleCount
          return (
            <div
              aria-hidden={!revealed}
              className={revealed ? 'g7-rule-in' : undefined}
              key={`${index}-${tr(step.text ?? step, lang)}`}
              style={{
                minHeight: mobile ? 22 : 24,
                display: 'grid',
                gridTemplateColumns: '24px 1fr',
                gap: 8,
                alignItems: 'start',
                visibility: revealed ? 'visible' : 'hidden',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'none' : 'translateX(8px)',
                transition: 'opacity .24s ease, transform .24s ease',
              }}
            >
              <span style={{ width: 22, height: 22, borderRadius: 7, display: 'grid', placeItems: 'center', background: C.paper, color: C.green, font: `850 10px ${F.mono}` }}>
                {index + 1}
              </span>
              <span style={{ color: C.text, font: `700 ${mobile ? 12 : 13}px/1.4 ${F.sans}` }}>
                <RichMathText value={step.text ?? step} lang={lang} />
              </span>
            </div>
          )
        })}
        {(visibleCount < steps.length || onComplete) && (
          <PrimaryButton
            data-testid={visibleCount < steps.length ? 'solution-next-step' : 'practice-task-advance'}
            onClick={revealNext}
            disabled={Boolean(audio?.isPlaying)}
            style={{ justifySelf: 'end', marginTop: 2 }}
          >
            {visibleCount < steps.length
              ? tr(L('Keyingi yechim qadami', 'Следующий шаг решения', 'Next solution step'), lang)
              : completeLabel}
            <ArrowRight size={17} />
          </PrimaryButton>
        )}
      </Panel>
    </div>
  )
}

function SequenceActivity({ lang, storedAnswer, onAnswer, mobile, audio, data, activityId }) {
  const sfx = useSfx()
  const { formula, items, order, result, solution, prediction } = data
  const [chosen, setChosen] = useState(storedAnswer?.chosen ?? [])
  const [predictionChoice, setPredictionChoice] = useState(storedAnswer?.prediction ?? null)
  const [mistakes, setMistakes] = useState(storedAnswer?.mistakes ?? 0)
  const [wrongText, setWrongText] = useState(null)
  const complete = chosen.length === order.length
  const choose = (item) => {
    if (complete || chosen.includes(item.id) || (prediction && !predictionChoice)) return
    const expected = order[chosen.length]
    if (item.id !== expected) {
      const nextMistakes = mistakes + 1
      setMistakes(nextMistakes)
      const hint = chosen.length === 0
        ? L('Eng yuqori darajadagi eng chap amalni toping.', 'Найдите самое левое действие наивысшего приоритета.', 'Find the leftmost operation with the highest priority.')
        : L('Oldingi qadamdan hosil bo‘lgan ifodaga qarang.', 'Посмотрите на выражение, полученное на предыдущем шаге.', 'Look at the expression produced by the previous step.')
      setWrongText(hint)
      sfx.playWrong()
      audio.pushOneOff(tr(hint, lang))
      return
    }
    setWrongText(null)
    const next = [...chosen, item.id]
    setChosen(next)
    if (next.length === order.length) {
      sfx.playCorrect()
      onAnswer({ type: 'sequence', correct: mistakes === 0, chosen: next, prediction: predictionChoice, mistakes })
    }
  }
  const reset = () => {
    if (storedAnswer) return
    setChosen([])
    setWrongText(null)
  }
  return (
    <div data-testid="guided-activity" data-activity-id={activityId} style={{ display: 'grid', gap: 11 }}>
      <Panel tone="blue" style={{ padding: mobile ? 11 : 14, textAlign: 'center' }}>
        <strong style={{ fontSize: mobile ? 22 : 29 }}><TextbookMath value={formula} /></strong>
      </Panel>
      {prediction && !complete && (
        <Panel tone="yellow" style={{ display: 'grid', gap: 8, padding: mobile ? 10 : 12 }}>
          <span style={{ color: C.text, font: `750 ${mobile ? 12 : 13}px ${F.sans}` }}>
            <RichMathText value={prediction.prompt} lang={lang} />
          </span>
          <ChoiceGrid
            options={prediction.options}
            selected={predictionChoice}
            onSelect={(option) => setPredictionChoice(option.id)}
            lang={lang}
            mobile={mobile}
            columns={prediction.options.length}
            locked={Boolean(storedAnswer)}
          />
        </Panel>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${order.length}, minmax(0, 1fr))`, gap: mobile ? 6 : 9 }}>
        {order.map((_, index) => {
          const item = items.find((candidate) => candidate.id === chosen[index])
          return (
            <div key={`${index}-${item?.id ?? 'empty'}`} className={item ? 'g7-sequence-filled' : index === chosen.length ? 'g7-sequence-next' : undefined} style={{
              minHeight: mobile ? 46 : 58,
              borderRadius: 12,
              border: `1.5px dashed ${item ? C.primary : C.subtle}`,
              background: item ? C.primarySoft : C.paper,
              display: 'grid',
              placeItems: 'center',
              padding: 7,
              textAlign: 'center',
              color: item ? C.text : C.muted,
              font: `750 ${mobile ? 10 : 12}px/1.25 ${F.sans}`,
            }}>
              {item ? <RichMathText value={item.label} lang={lang} /> : index + 1}
            </div>
          )
        })}
      </div>
      <div key={`sequence-options-${mistakes}`} className={wrongText ? 'g7-wrong-shake' : undefined} style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : `repeat(${Math.min(items.length, 4)}, minmax(0, 1fr))`, gap: 8 }}>
        {items.map((item) => {
          const used = chosen.includes(item.id)
          return (
            <button
              type="button"
              className="g7-option"
              data-testid="guided-option"
              data-option-id={item.id}
              key={item.id}
              disabled={used || complete || (prediction && !predictionChoice)}
              onClick={() => choose(item)}
              style={{ minHeight: mobile ? 40 : 47, border: `1px solid ${C.line}`, borderRadius: 11, background: used ? C.inkSoft : C.paper, color: used ? C.subtle : C.text, padding: '8px 10px', font: `750 ${mobile ? 11 : 13}px/1.25 ${F.sans}`, cursor: used || complete ? 'default' : 'pointer' }}
            >
              <RichMathText value={item.label} lang={lang} />
            </button>
          )
        })}
      </div>
      {!complete && chosen.length > 0 && (
        <QuietButton onClick={reset} style={{ justifySelf: 'start' }}>
          <RotateCcw size={16} /> {tr(UI.reset, lang)}
        </QuietButton>
      )}
      {wrongText && <Feedback ok={false}><RichMathText value={wrongText} lang={lang} /></Feedback>}
      {complete && (
        <>
          <Feedback ok><RichMathText value={result} lang={lang} /></Feedback>
          <ProgressiveSolution
            steps={solution}
            lang={lang}
            mobile={mobile}
            audio={audio}
            initiallyExpanded={Boolean(storedAnswer?.solutionViewed)}
            onViewed={() => onAnswer({ ...storedAnswer, solutionViewed: true })}
          />
        </>
      )}
    </div>
  )
}

function PairValuesActivity({ lang, storedAnswer, onAnswer, mobile, audio }) {
  const sfx = useSfx()
  const data = GUIDED_DATA.pair
  const [prediction, setPrediction] = useState(storedAnswer?.prediction ?? null)
  const [left, setLeft] = useState(storedAnswer?.left ?? null)
  const [right, setRight] = useState(storedAnswer?.right ?? null)
  const [mistakes, setMistakes] = useState(storedAnswer?.mistakes ?? 0)
  const [message, setMessage] = useState(storedAnswer ? 'ok' : null)
  const predictionOptions = [
    { id: 'left', label: L('Chapdagi katta', 'Слева больше', 'Left is greater') },
    { id: 'right', label: L('O‘ngdagi katta', 'Справа больше', 'Right is greater') },
    { id: 'equal', label: L('Teng', 'Равны', 'Equal') },
  ]
  const check = () => {
    if (left !== '14' || right !== '30') {
      const nextMistakes = mistakes + 1
      setMistakes(nextMistakes)
      setMessage('wrong')
      sfx.playWrong()
      audio.pushOneOff(tr(A(
        'Chapda avval ikki beshga ko‘payadi. O‘ngda esa qavs ichidagi to‘rt qo‘shuv ikki birinchi.',
        'Слева сначала два умножаем на пять. Справа первым выполняется четыре плюс два в скобках.',
        'On the left, multiply two by five first. On the right, calculate four plus two inside the brackets first.',
      ), lang))
      return
    }
    setMessage('ok')
    sfx.playCorrect()
    onAnswer({ type: 'pair-values', correct: mistakes === 0, prediction, left, right, mistakes })
  }
  const card = (expression, value, setValue, fieldId) => (
    <Panel tone="orange" style={{ display: 'grid', gap: 10, textAlign: 'center', padding: mobile ? 11 : 15 }}>
      <strong style={{ fontSize: mobile ? 23 : 29 }}><TextbookMath value={expression} /></strong>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {data.values.map((option) => (
          <button
            type="button"
            className={`g7-option${value === option ? ' g7-selected' : ''}`}
            data-testid="guided-option"
            data-field-id={fieldId}
            data-option-id={option}
            key={option}
            disabled={Boolean(storedAnswer)}
            onClick={() => { setValue(option); setMessage(null) }}
            style={{ minHeight: 38, borderRadius: 9, border: `1px solid ${value === option ? C.primary : C.line}`, background: value === option ? C.primary : C.paper, color: value === option ? C.paper : C.text, font: `800 13px ${F.mono}` }}
          >
            {option}
          </button>
        ))}
      </div>
    </Panel>
  )
  return (
    <div data-testid="guided-activity" data-activity-id="bracket-comparison" style={{ display: 'grid', gap: 10 }}>
      <Panel tone="yellow" style={{ display: 'grid', gap: 8, padding: mobile ? 10 : 12 }}>
        <span style={{ font: `750 ${mobile ? 12 : 13}px ${F.sans}` }}>
          {tr(L('Avval taxmin qiling: qaysi qiymat katta bo‘ladi?', 'Сначала спрогнозируйте: какое значение будет больше?', 'First predict: which value will be greater?'), lang)}
        </span>
        <ChoiceGrid options={predictionOptions} selected={prediction} onSelect={(option) => setPrediction(option.id)} lang={lang} mobile={mobile} columns={3} locked={Boolean(storedAnswer)} />
      </Panel>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 10 }}>
        {card('4 + 2 · 5', left, setLeft, 'left')}
        {card('(4 + 2) · 5', right, setRight, 'right')}
      </div>
      <PrimaryButton data-testid="guided-check" disabled={!prediction || !left || !right || Boolean(storedAnswer)} onClick={check} style={{ justifySelf: 'end' }}>
        <Check size={17} /> {tr(UI.check, lang)}
      </PrimaryButton>
      {message === 'wrong' && <Feedback ok={false}>{tr(L('Qavslar faqat sonlarni emas, birinchi amalni ham o‘zgartiradi.', 'Скобки меняют не числа, а первое действие.', 'Brackets change the first operation, not the numbers.'), lang)}</Feedback>}
      {message === 'ok' && (
        <>
          <Feedback ok><RichMathText value={data.result} lang={lang} /></Feedback>
          <ProgressiveSolution
            steps={data.solution}
            lang={lang}
            mobile={mobile}
            audio={audio}
            initiallyExpanded={Boolean(storedAnswer?.solutionViewed)}
            onViewed={() => onAnswer({ ...storedAnswer, solutionViewed: true })}
          />
        </>
      )}
    </div>
  )
}

function DualAnswerActivity({ lang, storedAnswer, onAnswer, mobile, audio }) {
  const sfx = useSfx()
  const data = GUIDED_DATA.readiness
  const [first, setFirst] = useState(storedAnswer?.first ?? null)
  const [reason, setReason] = useState(storedAnswer?.reason ?? null)
  const [bracketValue, setBracketValue] = useState(storedAnswer?.bracketValue ?? '')
  const [value, setValue] = useState(storedAnswer?.value ?? '')
  const [mistakes, setMistakes] = useState(storedAnswer?.mistakes ?? 0)
  const [message, setMessage] = useState(storedAnswer ? null : null)
  const check = () => {
    let feedback = null
    if (first !== 'brackets') feedback = L('Avval qavs ichidagi 11 − 3 ni tanlang.', 'Сначала выберите 11 − 3 внутри скобок.', 'Choose 11 − 3 inside the brackets first.')
    else if (String(bracketValue).trim() !== '8') feedback = L('11 − 3 qiymatini yana tekshiring.', 'Ещё раз вычислите 11 − 3.', 'Calculate 11 − 3 once more.')
    else if (reason !== 'brackets-first') feedback = L('Qavslar butun guruhni birinchi qilishini eslang.', 'Вспомните: скобки делают всю группу первым действием.', 'Remember: brackets make the grouped operation come first.')
    else if (String(value).trim() !== '13') feedback = L('8 dan keyin ÷ va × ni chapdan o‘ngga bajaring.', 'После 8 выполните ÷ и × слева направо.', 'After 8, perform ÷ and × from left to right.')
    if (feedback) {
      setMistakes((count) => count + 1)
      setMessage(feedback)
      sfx.playWrong()
      audio.pushOneOff(tr(feedback, lang))
      return
    }
    setMessage(null)
    sfx.playCorrect()
    onAnswer({ type: 'guided-readiness', correct: mistakes === 0, first, reason, bracketValue, value, mistakes })
  }
  const valueField = (label, fieldId, fieldValue, setFieldValue) => (
    <label style={{ display: 'grid', gap: 5, color: C.muted, font: `700 11px ${F.sans}` }}>
      <RichMathText value={label} lang={lang} />
      <input
        className="g7-input"
        data-testid="guided-field"
        data-field-id={fieldId}
        inputMode="numeric"
        value={fieldValue}
        disabled={Boolean(storedAnswer)}
        onChange={(event) => { setFieldValue(event.target.value); setMessage(null) }}
        placeholder="0"
        style={{ width: '100%', height: 42, border: `1.5px solid ${C.line}`, borderRadius: 11, padding: '0 12px', background: C.paper, color: C.text, font: `850 17px ${F.mono}`, outline: 'none', boxSizing: 'border-box' }}
      />
    </label>
  )
  return (
    <div data-testid="guided-activity" data-activity-id="readiness-check" style={{ display: 'grid', gap: 10 }}>
      <Panel tone="blue" style={{ padding: mobile ? 11 : 14, textAlign: 'center' }}>
        <strong style={{ fontSize: mobile ? 22 : 29 }}><TextbookMath value={data.formula} /></strong>
      </Panel>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 10 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <span style={{ font: `800 10px ${F.mono}`, color: C.muted, textTransform: 'uppercase' }}>{tr(L('1. Birinchi amal', '1. Первое действие', '1. First operation'), lang)}</span>
          <ChoiceGrid options={data.firstOptions} selected={first} onSelect={(option) => { setFirst(option.id); setMessage(null) }} lang={lang} mobile={mobile} columns={1} locked={Boolean(storedAnswer)} />
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <span style={{ font: `800 10px ${F.mono}`, color: C.muted, textTransform: 'uppercase' }}>{tr(L('2. Nega?', '2. Почему?', '2. Why?'), lang)}</span>
          <ChoiceGrid options={data.reasonOptions} selected={reason} onSelect={(option) => { setReason(option.id); setMessage(null) }} lang={lang} mobile={mobile} columns={1} locked={Boolean(storedAnswer)} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 10 }}>
        {valueField(L('3. Qavs qiymati', '3. Значение скобок', '3. Bracket value'), 'bracket', bracketValue, setBracketValue)}
        {valueField(L('4. Yakuniy qiymat', '4. Итоговое значение', '4. Final value'), 'final', value, setValue)}
      </div>
      <PrimaryButton data-testid="guided-check" disabled={!first || !reason || !String(bracketValue).trim() || !String(value).trim() || Boolean(storedAnswer)} onClick={check} style={{ justifySelf: 'end' }}>
        <ShieldCheck size={17} /> {tr(UI.check, lang)}
      </PrimaryButton>
      {message && <Feedback ok={false}><RichMathText value={message} lang={lang} /></Feedback>}
      {storedAnswer && (
        <>
          <Feedback ok>{tr(L('Birinchi amal, sabab va ikkala qiymat to‘g‘ri.', 'Первое действие, основание и оба значения верны.', 'The first operation, reason, and both values are correct.'), lang)}</Feedback>
          <ProgressiveSolution
            steps={data.solution}
            lang={lang}
            mobile={mobile}
            audio={audio}
            initiallyExpanded={Boolean(storedAnswer.solutionViewed)}
            onViewed={() => onAnswer({ ...storedAnswer, solutionViewed: true })}
          />
        </>
      )}
    </div>
  )
}

function ErrorAuditActivity({ lang, storedAnswer, onAnswer, mobile, audio }) {
  const options = [
    {
      id: 'first',
      label: L('18 : 3 = 6 o‘tishi', 'Переход 18 : 3 = 6', 'The transition 18 ÷ 3 = 6'),
      correct: false,
      wrong: L(
        'Bu o‘tish to‘g‘ri. Bo‘lish eng yuqori darajadagi chap amal edi.',
        'Этот переход верен: деление было самым левым действием высокого приоритета.',
        'This transition is valid: division was the leftmost higher-priority operation.',
      ),
    },
    {
      id: 'second',
      label: L('40 − 6 · 2 → 34 · 2 o‘tishi', 'Переход 40 − 6 · 2 → 34 · 2', 'The transition 40 − 6 × 2 → 34 × 2'),
      correct: true,
      wrong: L('', '', ''),
    },
    {
      id: 'third',
      label: L('34 · 2 = 68 o‘tishi', 'Переход 34 · 2 = 68', 'The transition 34 × 2 = 68'),
      correct: false,
      wrong: L(
        'Bu hisob arifmetik jihatdan to‘g‘ri, ammo yechim oldingi o‘tishda buzilgan.',
        'Это вычисление арифметически верно, но решение было нарушено в предыдущем переходе.',
        'This calculation is arithmetically valid, but the route broke in the previous transition.',
      ),
    },
  ]
  const solution = [
    { text: '40 − 18 : 3 · 2 → 40 − 6 · 2', audio: A('Avval o‘n sakkizni uchga bo‘lamiz va olti olamiz.', 'Сначала делим восемнадцать на три и получаем шесть.', 'First divide eighteen by three to get six.') },
    { text: '40 − 6 · 2 → 40 − 12', audio: A('Endi olti ikkiga ko‘paytiriladi. Qirq o‘z joyida qoladi.', 'Теперь шесть умножаем на два. Число сорок остаётся на месте.', 'Now multiply six by two. Forty stays unchanged.') },
    { text: '40 − 12 → 28', audio: A('Qirqdan o‘n ikkini ayirib, yigirma sakkiz olamiz.', 'Сорок минус двенадцать — двадцать восемь.', 'Forty minus twelve is twenty-eight.') },
  ]
  return (
    <div data-testid="guided-activity" data-activity-id="error-audit" style={{ display: 'grid', gap: 10 }}>
      <Panel tone="yellow" style={{ padding: mobile ? 11 : 14, display: 'grid', gap: 5, textAlign: 'center' }}>
        {['40 − 18 : 3 · 2', '↓', '40 − 6 · 2', '↓', '34 · 2', '↓', '68'].map((line, index) => (
          <strong key={`${line}-${index}`} style={{ color: index === 1 || index === 3 || index === 5 ? C.primary : C.text, fontSize: index % 2 ? 14 : mobile ? 17 : 20 }}>
            <TextbookMath value={line} />
          </strong>
        ))}
      </Panel>
      <QuizActivity
        lang={lang}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        mobile={mobile}
        audio={audio}
        options={options}
        correctText={L(
          'Birinchi xato ikkinchi o‘tishda: 6 · 2 ayirishdan oldin bajarilishi kerak.',
          'Первая ошибка во втором переходе: 6 · 2 нужно выполнить до вычитания.',
          'The first error is in the second transition: 6 × 2 must be evaluated before subtraction.',
        )}
        solution={solution}
        type="error-audit"
      />
    </div>
  )
}

function QuizActivity({ lang, storedAnswer, onAnswer, mobile, audio, options, correctText, solution, type }) {
  const sfx = useSfx()
  const [selected, setSelected] = useState(storedAnswer?.picked ?? null)
  const [wrongText, setWrongText] = useState(null)
  const [mistakes, setMistakes] = useState(storedAnswer?.mistakes ?? 0)
  const resolved = Boolean(storedAnswer)
  const choose = (option) => {
    if (resolved) return
    setSelected(option.id)
    if (!option.correct) {
      setMistakes((count) => count + 1)
      setWrongText(option.wrong)
      sfx.playWrong()
      audio.pushOneOff(tr(A(
        'Bu variant birinchi sababni ko‘rsatmaydi. Oldingi o‘tishni tekshiring.',
        'Этот вариант не показывает первую причину. Проверь предыдущий переход.',
        'This option does not identify the first cause. Inspect the earlier transition.',
      ), lang))
      return
    }
    setWrongText(null)
    sfx.playCorrect()
    onAnswer({ type, correct: mistakes === 0, picked: option.id, mistakes })
  }
  return (
    <div style={{ display: 'grid', gap: 11 }}>
      <ChoiceGrid options={options} selected={selected} onSelect={choose} lang={lang} mobile={mobile} columns={1} locked={resolved} />
      {wrongText && <Feedback ok={false}><RichMathText value={wrongText} lang={lang} /></Feedback>}
      {resolved && (
        <>
          <Feedback ok><RichMathText value={correctText} lang={lang} /></Feedback>
          {solution && (
            <ProgressiveSolution
              steps={solution}
              lang={lang}
              mobile={mobile}
              audio={audio}
              initiallyExpanded={Boolean(storedAnswer?.solutionViewed)}
              onViewed={() => onAnswer({ ...storedAnswer, solutionViewed: true })}
            />
          )}
        </>
      )}
    </div>
  )
}

const PRACTICE_TASKS = [
  {
    id: 'priority-first',
    type: 'mc',
    prompt: L('Qaysi amal birinchi bajariladi?', 'Какое действие выполняется первым?', 'Which operation is performed first?'),
    formula: '27 − 15 : 5 + 6',
    result: '27 − 3 + 6 = 30',
    skills: ['priority'],
    options: [
      { id: 'subtract', label: '27 − 15' },
      { id: 'divide', label: '15 : 5' },
      { id: 'add', label: '5 + 6' },
    ],
    correct: 'divide',
    questionAudio: A('Yigirma yetti ayiruv o‘n besh bo‘lingan besh qo‘shuv olti ifodasida birinchi amalni toping.', 'Найдите первое действие в выражении двадцать семь минус пятнадцать разделить на пять плюс шесть.', 'Find the first operation in twenty-seven minus fifteen divided by five plus six.'),
    hints: [
      L('Qaysi amalning darajasi yuqoriroq: − yoki : ?', 'У какого действия приоритет выше: у − или у : ?', 'Which operation has higher priority: − or ÷?'),
      L('Bo‘lishni qidiring: 15 : 5.', 'Найдите деление: 15 : 5.', 'Find the division: 15 ÷ 5.'),
    ],
    solution: [
      { text: L('15 : 5 = 3 — bo‘lish birinchi.', '15 : 5 = 3 — деление первое.', '15 ÷ 5 = 3 — division comes first.'), audio: A('O‘n beshni beshga bo‘lib, uch olamiz.', 'Пятнадцать разделить на пять — три.', 'Fifteen divided by five is three.') },
      { text: '27 − 3 + 6 → 24 + 6 → 30', audio: A('So‘ng ayirish va qo‘shishni chapdan o‘ngga bajaramiz. Javob o‘ttiz.', 'Затем выполняем вычитание и сложение слева направо. Ответ — тридцать.', 'Then subtract and add from left to right. The answer is thirty.') },
    ],
  },
  {
    id: 'equal-chain',
    type: 'input',
    prompt: L('Ifodaning qiymatini kiriting.', 'Введите значение выражения.', 'Enter the value of the expression.'),
    formula: '32 : 8 · 5 − 7',
    result: '4 · 5 − 7 = 13',
    answer: 13,
    skills: ['left-to-right'],
    questionAudio: A('O‘ttiz ikki bo‘lingan sakkiz ko‘paytirilgan besh ayiruv yetti ifodasining qiymatini kiriting.', 'Введите значение выражения тридцать два разделить на восемь умножить на пять минус семь.', 'Enter the value of thirty-two divided by eight times five minus seven.'),
    hints: [
      L(': va · teng darajada. Eng chapidan boshlang.', ': и · равноправны. Начните с самого левого.', '÷ and × share a priority. Start with the leftmost one.'),
      L('Birinchi qadam: 32 : 8 = 4.', 'Первый шаг: 32 : 8 = 4.', 'First step: 32 ÷ 8 = 4.'),
    ],
    solution: [
      { text: '32 : 8 · 5 − 7 → 4 · 5 − 7', audio: A('Chapdan boshlaymiz: o‘ttiz ikki bo‘lingan sakkiz — to‘rt.', 'Начинаем слева: тридцать два разделить на восемь — четыре.', 'Start from the left: thirty-two divided by eight is four.') },
      { text: '4 · 5 − 7 → 20 − 7', audio: A('To‘rtni beshga ko‘paytirib, yigirma olamiz.', 'Четыре умножить на пять — двадцать.', 'Four times five is twenty.') },
      { text: '20 − 7 → 13', audio: A('Yigirmadan yettini ayirib, o‘n uch olamiz.', 'Двадцать минус семь — тринадцать.', 'Twenty minus seven is thirteen.') },
    ],
  },
  {
    id: 'build-new-solution',
    type: 'order',
    prompt: L('Hisoblash qadamlarini tartib bilan bosing.', 'Нажмите шаги вычисления по порядку.', 'Select the calculation steps in order.'),
    formula: '54 : (8 − 2) + 7 · 3',
    result: '54 : 6 + 21 = 30',
    skills: ['brackets', 'priority'],
    items: [
      { id: 'multiply', label: '7 · 3 = 21' },
      { id: 'bracket', label: '8 − 2 = 6' },
      { id: 'add', label: '9 + 21 = 30' },
      { id: 'divide', label: '54 : 6 = 9' },
    ],
    correctOrder: ['bracket', 'divide', 'multiply', 'add'],
    questionAudio: A('Hisoblash qadamlarini to‘g‘ri tartibda tanlang.', 'Выберите шаги вычисления в правильном порядке.', 'Choose the calculation steps in the correct order.'),
    hints: [
      L('Avval qavsni toping.', 'Сначала найдите скобки.', 'Find the brackets first.'),
      L('Qavsdan keyin yuqori darajadagi eng chap amalni tanlang.', 'После скобок выберите самое левое действие высокого приоритета.', 'After the brackets, choose the leftmost higher-priority operation.'),
      L('Oxirgi qadam ikki tayyor natijani qo‘shish bo‘ladi.', 'Последним шагом сложите два готовых результата.', 'The final step is to add the two completed results.'),
    ],
    solution: [
      { text: '54 : (8 − 2) + 7 · 3 → 54 : 6 + 7 · 3', audio: A('Avval qavs ichidagi sakkiz ayiruv ikkini hisoblaymiz.', 'Сначала вычисляем восемь минус два в скобках.', 'First calculate eight minus two inside the brackets.') },
      { text: '54 : 6 + 7 · 3 → 9 + 7 · 3', audio: A('Yuqori darajada chapdagi bo‘lishni bajaramiz.', 'На верхнем уровне выполняем деление слева.', 'At the higher priority, perform the division on the left.') },
      { text: '9 + 7 · 3 → 9 + 21', audio: A('Keyin yettini uchga ko‘paytiramiz.', 'Затем умножаем семь на три.', 'Then multiply seven by three.') },
      { text: '9 + 21 → 30', audio: A('Oxirida to‘qqizga yigirma birni qo‘shamiz.', 'В конце складываем девять и двадцать один.', 'Finally add nine and twenty-one.') },
    ],
  },
  {
    id: 'spot-first-division',
    type: 'multi',
    prompt: L('Birinchi amal bo‘lish bo‘lgan ikkita ifodani tanlang.', 'Выберите два выражения, где первым выполняется деление.', 'Select the two expressions where division comes first.'),
    formula: L('Ifodani hisoblamang — faqat birinchi amalni aniqlang.', 'Не вычисляйте — определите только первое действие.', 'Do not evaluate—identify only the first operation.'),
    result: L('30 − 12 : 3 va 24 : 6 · 2', '30 − 12 : 3 и 24 : 6 · 2', '30 − 12 ÷ 3 and 24 ÷ 6 × 2'),
    skills: ['priority', 'structure'],
    options: [
      { id: 'a', label: '30 − 12 : 3' },
      { id: 'b', label: '(30 − 12) : 3' },
      { id: 'c', label: '24 : 6 · 2' },
      { id: 'd', label: '7 + 4 · 5' },
    ],
    correctIds: ['a', 'c'],
    questionAudio: A('Birinchi amal bo‘lish bo‘lgan ikkita ifodani tanlang.', 'Выберите два выражения, в которых первым выполняется деление.', 'Select the two expressions where division is performed first.'),
    hints: [
      L('Qavs bo‘lsa, u bo‘lishdan ham oldin bajariladi.', 'Если есть скобки, они выполняются раньше деления.', 'If brackets are present, they come before division.'),
      L('Ko‘paytirish ham bo‘lish bilan teng darajada: eng chap amalni tekshiring.', 'Умножение равноправно делению: проверьте самое левое действие.', 'Multiplication shares a priority with division: inspect the leftmost operation.'),
    ],
    solution: [
      { text: L('30 − 12 : 3 da bo‘lish ayirishdan oldin.', 'В 30 − 12 : 3 деление раньше вычитания.', 'In 30 − 12 ÷ 3, division comes before subtraction.'), audio: A('Birinchi ifodada bo‘lish ayirishdan yuqori darajada.', 'В первом выражении деление имеет приоритет над вычитанием.', 'In the first expression, division has priority over subtraction.') },
      { text: L('24 : 6 · 2 da : va · teng; chapdagi : birinchi.', 'В 24 : 6 · 2 действия : и · равноправны; левое : выполняется первым.', 'In 24 ÷ 6 × 2, ÷ and × share a priority, so the leftmost ÷ comes first.'), audio: A('Uchinchi ifodada bo‘lish va ko‘paytirish teng. Chapdagi bo‘lish birinchi.', 'В третьем выражении деление и умножение равноправны. Первым идёт деление слева.', 'In the third expression, division and multiplication share a priority. The division on the left comes first.') },
    ],
  },
  {
    id: 'bracket-and-final',
    type: 'pair',
    prompt: L('Qavs qiymati va yakuniy qiymatni kiriting.', 'Введите значение скобок и итоговое значение.', 'Enter the bracket value and the final value.'),
    formula: '(17 − 9) · 5 + 4',
    result: '8 · 5 + 4 = 44',
    skills: ['brackets', 'calculation'],
    fields: [
      { id: 'bracket', label: L('Qavs qiymati', 'Значение скобок', 'Bracket value'), answer: 8 },
      { id: 'final', label: L('Yakuniy qiymat', 'Итоговое значение', 'Final value'), answer: 44 },
    ],
    questionAudio: A('Qavs ichidagi qiymatni va butun ifodaning qiymatini kiriting.', 'Введите значение в скобках и значение всего выражения.', 'Enter the value inside the brackets and the value of the whole expression.'),
    hints: [
      L('Avval 17 − 9 ni hisoblang.', 'Сначала вычислите 17 − 9.', 'Calculate 17 − 9 first.'),
      L('Qavsdan keyin 8 · 5, so‘ng + 4.', 'После скобок: 8 · 5, затем + 4.', 'After the brackets: 8 × 5, then + 4.'),
    ],
    solution: [
      { text: '(17 − 9) = 8', audio: A('O‘n yettidan to‘qqizni ayirib, sakkiz olamiz.', 'Семнадцать минус девять — восемь.', 'Seventeen minus nine is eight.') },
      { text: '8 · 5 + 4 → 40 + 4 → 44', audio: A('Sakkizni beshga ko‘paytirib qirq olamiz, so‘ng to‘rt qo‘shamiz. Javob qirq to‘rt.', 'Восемь умножить на пять — сорок, затем прибавляем четыре. Ответ — сорок четыре.', 'Eight times five is forty, then add four. The answer is forty-four.') },
    ],
  },
  {
    id: 'independent-error-audit',
    type: 'mc',
    prompt: L('Birinchi noto‘g‘ri o‘tishni toping.', 'Найдите первый неверный переход.', 'Find the first incorrect transition.'),
    formula: '50 − 24 : 6 · 3\n→ 50 − 4 · 3\n→ 46 · 3\n→ 138',
    result: '50 − 24 : 6 · 3 → 50 − 4 · 3 → 50 − 12 → 38',
    skills: ['error-audit', 'priority'],
    options: [
      { id: 'first', label: L('1-o‘tish', '1-й переход', 'Transition 1') },
      { id: 'second', label: L('2-o‘tish', '2-й переход', 'Transition 2') },
      { id: 'third', label: L('3-o‘tish', '3-й переход', 'Transition 3') },
    ],
    correct: 'second',
    questionAudio: A('Yechimdagi birinchi xato qadamni toping.', 'Найдите первый ошибочный шаг в решении.', 'Find the first incorrect step in the solution.'),
    hints: [
      L('Har bir o‘tishda faqat bitta amal bajarilganini tekshiring.', 'Проверьте, что в каждом переходе выполнено только одно действие.', 'Check that each transition performs only one operation.'),
      L('50 − 4 · 3 da qaysi amal yuqori darajada?', 'Какое действие имеет более высокий приоритет в 50 − 4 · 3?', 'Which operation has higher priority in 50 − 4 × 3?'),
    ],
    solution: [
      { text: L('1-o‘tish to‘g‘ri: 24 : 6 = 4.', '1-й переход верен: 24 : 6 = 4.', 'Transition 1 is valid: 24 ÷ 6 = 4.'), audio: A('Birinchi o‘tish to‘g‘ri: yigirma to‘rt oltiga bo‘linib, to‘rt olindi.', 'Первый переход верен: двадцать четыре разделили на шесть и получили четыре.', 'The first transition is valid: twenty-four divided by six is four.') },
      { text: L('2-o‘tish xato: 4 · 3 ayirishdan oldin.', '2-й переход неверен: 4 · 3 нужно выполнить до вычитания.', 'Transition 2 is wrong: evaluate 4 × 3 before subtraction.'), audio: A('Ikkinchi o‘tishda xato: to‘rtni uchga ko‘paytirish ayirishdan oldin bajarilishi kerak.', 'Ошибка во втором переходе: четыре умножить на три нужно выполнить до вычитания.', 'The second transition is wrong: four times three must be evaluated before subtraction.') },
      { text: '50 − 4 · 3 → 50 − 12 → 38', audio: A('To‘g‘ri yakun: ellik ayiruv o‘n ikki — o‘ttiz sakkiz.', 'Верное завершение: пятьдесят минус двенадцать — тридцать восемь.', 'The correct ending is fifty minus twelve, which is thirty-eight.') },
    ],
  },
  {
    id: 'place-brackets',
    type: 'mc',
    prompt: L('Qiymati 18 bo‘ladigan ifodani tanlang.', 'Выберите выражение со значением 18.', 'Choose the expression whose value is 18.'),
    formula: L('Qavslar qayerda turishi kerak?', 'Где должны стоять скобки?', 'Where should the brackets go?'),
    result: '(24 : 6 + 2) · 3 = 18',
    skills: ['brackets', 'structure'],
    options: [
      { id: 'a', label: '(24 : 6 + 2) · 3' },
      { id: 'b', label: '24 : (6 + 2) · 3' },
      { id: 'c', label: '24 : 6 + 2 · 3' },
      { id: 'd', label: '24 : (6 + 2 · 3)' },
    ],
    correct: 'a',
    questionAudio: A('Qiymati o‘n sakkiz bo‘ladigan qavsli ifodani tanlang.', 'Выберите выражение со скобками, значение которого равно восемнадцати.', 'Choose the bracketed expression whose value is eighteen.'),
    hints: [
      L('18 ni 3 ga bo‘lsak, qavs ichida 6 bo‘lishi kerak.', 'Если 18 разделить на 3, внутри скобок должно быть 6.', 'Since 18 ÷ 3 = 6, the brackets should evaluate to 6.'),
      L('24 : 6 + 2 = 6 bo‘ladigan guruhni qidiring.', 'Ищите группу, где 24 : 6 + 2 = 6.', 'Look for the group where 24 ÷ 6 + 2 = 6.'),
    ],
    solution: [
      { text: '(24 : 6 + 2) · 3 → (4 + 2) · 3', audio: A('Qavs ichida avval yigirma to‘rtni oltiga bo‘lib, to‘rt olamiz.', 'В скобках сначала двадцать четыре делим на шесть и получаем четыре.', 'Inside the brackets, first divide twenty-four by six to get four.') },
      { text: '(4 + 2) · 3 → 6 · 3 → 18', audio: A('Qavs ichida to‘rtga ikki qo‘shamiz, so‘ng oltini uchga ko‘paytiramiz. Javob o‘n sakkiz.', 'В скобках складываем четыре и два, затем шесть умножаем на три. Ответ — восемнадцать.', 'Add four and two inside the brackets, then multiply six by three. The answer is eighteen.') },
    ],
  },
  {
    id: 'compare-routes',
    type: 'mc',
    prompt: L('Qaysi yechim yo‘li to‘g‘ri?', 'Какой путь решения верен?', 'Which solution route is correct?'),
    formula: 'A: 36 − 16 : 4 · 2 → 36 − 4 · 2 → 28\nB: 36 − 16 : 4 · 2 → 36 − 16 : 8 → 34',
    result: 'A: 36 − 16 : 4 · 2 → 36 − 4 · 2 → 28',
    skills: ['left-to-right', 'error-audit'],
    options: [
      { id: 'a', label: L('A yo‘li', 'Путь A', 'Route A') },
      { id: 'b', label: L('B yo‘li', 'Путь B', 'Route B') },
      { id: 'both', label: L('Ikkalasi ham', 'Оба пути', 'Both routes') },
    ],
    correct: 'a',
    questionAudio: A('Ikki yechim yo‘lini solishtiring va to‘g‘risini tanlang.', 'Сравните два пути решения и выберите верный.', 'Compare the two solution routes and choose the valid one.'),
    hints: [
      L(': va · teng darajada; yozuvda chapdagi amalni toping.', ': и · равноправны; найдите действие, стоящее левее.', '÷ and × share a priority; find the operation farther left.'),
      L('16 : 4 ni 4 · 2 dan oldin bajarish kerak.', '16 : 4 нужно выполнить раньше 4 · 2.', '16 ÷ 4 must be evaluated before 4 × 2.'),
    ],
    solution: [
      { text: '36 − 16 : 4 · 2 → 36 − 4 · 2', audio: A('Bo‘lish va ko‘paytirish teng. Chapdagi o‘n olti bo‘lingan to‘rtni birinchi bajaramiz.', 'Деление и умножение равноправны. Сначала выполняем стоящее слева шестнадцать разделить на четыре.', 'Division and multiplication share a priority. First evaluate sixteen divided by four on the left.') },
      { text: '36 − 4 · 2 → 36 − 8 → 28', audio: A('Keyin to‘rtni ikkiga ko‘paytiramiz va o‘ttiz oltidan sakkizni ayiramiz. Javob yigirma sakkiz.', 'Затем умножаем четыре на два и вычитаем восемь из тридцати шести. Ответ — двадцать восемь.', 'Then multiply four by two and subtract eight from thirty-six. The answer is twenty-eight.') },
    ],
  },
]

function PracticeQuestionVisual({ task, status, lang, mobile }) {
  const solved = status === 'correct'
  const visibleValue = solved ? task.result : task.formula
  const formulaSource = mathSource(task.formula, lang)
  const resultSource = mathSource(task.result, lang)
  const maxRows = Math.max(formulaSource.split('\n').length, resultSource.split('\n').length)
  const containsFraction = hasVerticalFraction(task.formula, lang) || hasVerticalFraction(task.result, lang)
  const mathOnly = isMathOnly(visibleValue, lang) || containsFraction
  const reservedHeight = maxRows >= 4
    ? (mobile ? 122 : 148)
    : maxRows >= 2
      ? (mobile ? 82 : 98)
      : containsFraction
        ? (mobile ? 82 : 96)
        : (mobile ? 68 : 82)
  return (
    <Panel
      data-testid="practice-question"
      tone={solved ? 'green' : status === 'wrong' ? 'yellow' : 'blue'}
      style={{ padding: mobile ? 13 : 16 }}
    >
      <div
        className={`g7-question-visual${solved ? ' g7-solved' : ''}`}
        style={{ minHeight: reservedHeight, display: 'grid', placeItems: 'center', textAlign: 'center' }}
      >
        <strong className="g7-practice-formula" style={{
          color: solved ? C.green : C.text,
          fontFamily: mathOnly ? F.serif : F.sans,
          fontSize: mathOnly ? (mobile ? 23 : 31) : (mobile ? 14 : 17),
          lineHeight: mathOnly ? 1.12 : 1.42,
          letterSpacing: '-.01em',
          whiteSpace: 'pre-line',
        }}>
          {mathOnly
            ? <TextbookMath value={visibleValue} lang={lang} />
            : <RichMathText value={visibleValue} lang={lang} />}
        </strong>
      </div>
    </Panel>
  )
}

function PracticeSolution({ task, taskIndex, total, lang, mobile, audio, onAdvance }) {
  const completeLabel = taskIndex + 1 === total
    ? tr(L('Natijani ko‘rish', 'Посмотреть результат', 'View result'), lang)
    : tr(L('Keyingi topshiriq', 'Следующее задание', 'Next task'), lang)
  return (
    <ProgressiveSolution
      steps={task.solution}
      lang={lang}
      mobile={mobile}
      audio={audio}
      testId="practice-solution"
      onComplete={onAdvance}
      completeLabel={completeLabel}
    />
  )
}

function PracticePack({ lang, storedAnswer, onAnswer, mobile, audio }) {
  const sfx = useSfx()
  const restoredResults = storedAnswer?.taskResults ?? []
  const restoredIndex = Math.min(storedAnswer?.completedCount ?? 0, PRACTICE_TASKS.length)
  const [taskIndex, setTaskIndex] = useState(restoredIndex)
  const [results, setResults] = useState(restoredResults)
  const [status, setStatus] = useState('idle')
  const [inputValue, setInputValue] = useState('')
  const [pairValues, setPairValues] = useState({})
  const [selectedIds, setSelectedIds] = useState([])
  const [orderedIds, setOrderedIds] = useState([])
  const [wrongChoices, setWrongChoices] = useState([])
  const [wrongPulse, setWrongPulse] = useState(0)
  const [hintText, setHintText] = useState(null)
  const [wrongCount, setWrongCount] = useState(0)
  const firstTryRef = useRef(true)
  const announcedRef = useRef(restoredIndex === 0 ? 0 : -1)
  const done = taskIndex >= PRACTICE_TASKS.length
  const task = done ? null : PRACTICE_TASKS[taskIndex]

  const resetControls = useCallback(() => {
    setStatus('idle')
    setInputValue('')
    setPairValues({})
    setSelectedIds([])
    setOrderedIds([])
    setWrongChoices([])
    setHintText(null)
    setWrongCount(0)
    firstTryRef.current = true
  }, [])

  useEffect(() => {
    if (done || audio.muted || taskIndex === 0 || announcedRef.current === taskIndex) return undefined
    announcedRef.current = taskIndex
    const timer = window.setTimeout(() => audio.pushOneOff(tr(task.questionAudio, lang)), 260)
    return () => window.clearTimeout(timer)
  }, [audio, done, lang, task, taskIndex])

  const markWrong = (choiceId = null) => {
    if (!task || status === 'correct') return
    firstTryRef.current = false
    setStatus('wrong')
    setWrongPulse((value) => value + 1)
    const nextWrongCount = wrongCount + 1
    setWrongCount(nextWrongCount)
    if (choiceId) setWrongChoices((current) => current.includes(choiceId) ? current : [...current, choiceId])
    const hints = task.hints ?? []
    const hint = hints[Math.min(nextWrongCount - 1, Math.max(0, hints.length - 1))]
    setHintText(hint)
    sfx.playWrong()
    if (!audio.muted && hint) audio.pushOneOff(tr(hint, lang))
  }

  const markCorrect = () => {
    if (!task || status === 'correct') return
    const nextResults = [...results]
    nextResults[taskIndex] = firstTryRef.current
    setResults(nextResults)
    setStatus('correct')
    setHintText(null)
    sfx.playCorrect()
    const completedCount = taskIndex + 1
    onAnswer({
      type: 'practice-pack',
      correct: completedCount === PRACTICE_TASKS.length ? true : null,
      solved: completedCount === PRACTICE_TASKS.length,
      completedCount,
      taskResults: nextResults,
    })
  }

  const advance = () => {
    const nextIndex = Math.min(taskIndex + 1, PRACTICE_TASKS.length)
    resetControls()
    setTaskIndex(nextIndex)
  }

  const submitInput = () => {
    const numeric = Number(String(inputValue).replace(',', '.').trim())
    if (!Number.isFinite(numeric)) return
    if (numeric === task.answer) markCorrect()
    else markWrong()
  }

  const submitPair = () => {
    const correct = task.fields.every((field) => Number(String(pairValues[field.id] ?? '').replace(',', '.').trim()) === field.answer)
    if (correct) markCorrect()
    else markWrong()
  }

  const submitMulti = () => {
    const chosen = [...selectedIds].sort()
    const expected = [...task.correctIds].sort()
    if (chosen.length === expected.length && chosen.every((id, index) => id === expected[index])) markCorrect()
    else markWrong()
  }

  const chooseOrderItem = (item) => {
    if (status === 'correct' || orderedIds.includes(item.id)) return
    const expected = task.correctOrder[orderedIds.length]
    if (item.id !== expected) {
      markWrong(item.id)
      window.setTimeout(() => setOrderedIds([]), 420)
      return
    }
    setStatus('idle')
    const next = [...orderedIds, item.id]
    setOrderedIds(next)
    if (next.length === task.correctOrder.length) markCorrect()
  }

  if (done) {
    const firstTryCount = results.filter(Boolean).length
    return (
      <Panel data-testid="practice-pack" data-status="complete" tone="green" style={{ textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 8, padding: mobile ? 16 : 20 }}>
        <ShieldCheck size={30} color={C.green} />
        <strong style={{ color: C.text, font: `800 ${mobile ? 21 : 26}px ${F.serif}` }}>
          {tr(L('8 ta topshiriq bajarildi', 'Все 8 заданий выполнены', 'All 8 tasks are complete'), lang)}
        </strong>
        <span data-testid="practice-first-try" style={{ color: C.green, font: `850 15px ${F.mono}` }}>{firstTryCount} / {PRACTICE_TASKS.length}</span>
        <span style={{ color: C.muted, font: `650 12px/1.4 ${F.sans}` }}>
          {tr(L('Endi yakuniy xulosaga o‘tishingiz mumkin.', 'Теперь можно перейти к итогам.', 'You can now continue to the summary.'), lang)}
        </span>
      </Panel>
    )
  }

  return (
    <div data-testid="practice-pack" data-status={status} style={{ display: 'grid', gap: mobile ? 9 : 11 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {PRACTICE_TASKS.map((_, index) => (
          <span
            key={index}
            className="g7-practice-dot"
            style={{
              width: index === taskIndex ? 20 : 8,
              height: 8,
              borderRadius: 99,
              background: index < taskIndex ? C.green : index === taskIndex ? C.primary : C.line,
              boxShadow: index === taskIndex ? '0 0 9px rgba(255, 79, 40, .32)' : 'none',
            }}
          />
        ))}
        <span data-testid="practice-progress" style={{ marginLeft: 6, color: C.muted, font: `750 10px ${F.mono}` }}>{taskIndex + 1} / {PRACTICE_TASKS.length}</span>
      </div>

      <div data-testid="practice-task" data-task-id={task.id} style={{ display: 'grid', gap: mobile ? 9 : 11 }}>
        <h2 style={{ margin: 0, color: C.text, font: `750 ${mobile ? 17 : 20}px/1.3 ${F.serif}` }}>
          {tr(task.prompt, lang)}
        </h2>

        <PracticeQuestionVisual task={task} status={status} lang={lang} mobile={mobile} />

        <div key={wrongPulse} className={`g7-control-block${status === 'wrong' ? ' g7-wrong-shake' : ''}`}>
        {task.type === 'mc' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: mobile
              ? '1fr'
              : `repeat(${task.options.length === 4 ? 2 : Math.min(task.options.length, 3)}, minmax(0, 1fr))`,
            gap: 8,
          }}>
            {task.options.map((option) => {
              const wrong = wrongChoices.includes(option.id)
              const correct = status === 'correct' && option.id === task.correct
              const mathOnly = isMathOnly(option.label, lang)
              return (
                <button
                  type="button"
                  className={`g7-option${mathOnly ? ' g7-math-button' : ''}${correct ? ' g7-selected g7-correct-choice' : ''}`}
                  data-testid="practice-option"
                  data-option-id={option.id}
                  key={option.id}
                  disabled={status === 'correct'}
                  onClick={() => option.id === task.correct ? markCorrect() : markWrong(option.id)}
                  style={{
                    minHeight: mobile ? 46 : 52,
                    border: `1px solid ${correct ? C.green : wrong ? C.primary : C.line}`,
                    borderRadius: 11,
                    background: correct ? C.greenSoft : wrong ? C.primarySoft : C.paper,
                    color: wrong ? C.muted : C.text,
                    padding: '9px 11px',
                    font: `750 ${mobile ? 12 : 13}px ${F.sans}`,
                    cursor: status === 'correct' ? 'default' : 'pointer',
                  }}
                >
                  <RichMathText value={option.label} lang={lang} />
                </button>
              )
            })}
          </div>
        )}

        {task.type === 'input' && (
          <div className="g7-action-row">
            <input
              className="g7-input"
              data-testid="practice-field"
              data-field-id="answer"
              inputMode="decimal"
              value={inputValue}
              disabled={status === 'correct'}
              onChange={(event) => { setInputValue(event.target.value); if (status === 'wrong') setStatus('idle') }}
              onKeyDown={(event) => event.key === 'Enter' && submitInput()}
              aria-label={tr(L('Javob', 'Ответ', 'Answer'), lang)}
              style={{
                width: 132,
                minHeight: 42,
                border: `1px solid ${status === 'wrong' ? C.primary : C.line}`,
                borderRadius: 11,
                background: C.paper,
                color: C.text,
                padding: '8px 12px',
                textAlign: 'center',
                font: `800 18px ${F.mono}`,
                outline: 0,
              }}
            />
            <PrimaryButton data-testid="practice-check" disabled={!inputValue.trim() || status === 'correct'} onClick={submitInput}>
              <Check size={17} /> {tr(UI.check, lang)}
            </PrimaryButton>
          </div>
        )}

        {task.type === 'multi' && (
          <div style={{ display: 'grid', gap: 9 }}>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 8 }}>
              {task.options.map((option) => {
                const selected = selectedIds.includes(option.id)
                const verified = status === 'correct' && selected
                const mathOnly = isMathOnly(option.label, lang)
                return (
                  <button
                    type="button"
                    className={`g7-option${mathOnly ? ' g7-math-button' : ''}${selected ? ' g7-selected' : ''}${verified ? ' g7-correct-choice' : ''}`}
                    data-testid="practice-option"
                    data-option-id={option.id}
                    key={option.id}
                    disabled={status === 'correct'}
                    onClick={() => {
                      setSelectedIds((current) => current.includes(option.id) ? current.filter((id) => id !== option.id) : [...current, option.id])
                      if (status === 'wrong') setStatus('idle')
                    }}
                    style={{
                      minHeight: 44,
                      border: `1px solid ${verified ? C.green : selected ? C.primary : C.line}`,
                      borderRadius: 11,
                      background: verified ? C.greenSoft : selected ? C.primarySoft : C.paper,
                      color: C.text,
                      padding: '9px 11px',
                      font: `750 ${mobile ? 12 : 13}px ${F.sans}`,
                      cursor: status === 'correct' ? 'default' : 'pointer',
                    }}
                  >
                    <RichMathText value={option.label} lang={lang} />
                  </button>
                )
              })}
            </div>
            <div className="g7-action-row">
              <PrimaryButton data-testid="practice-check" disabled={selectedIds.length === 0 || status === 'correct'} onClick={submitMulti}>
                <Check size={17} /> {tr(UI.check, lang)}
              </PrimaryButton>
            </div>
          </div>
        )}

        {task.type === 'pair' && (
          <div style={{ display: 'grid', gap: 9 }}>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 9 }}>
              {task.fields.map((field) => (
                <label key={field.id} style={{ display: 'grid', gap: 5, color: C.muted, font: `700 11px ${F.sans}` }}>
                  <RichMathText value={field.label} lang={lang} />
                  <input
                    className="g7-input"
                    data-testid="practice-field"
                    data-field-id={field.id}
                    inputMode="decimal"
                    value={pairValues[field.id] ?? ''}
                    disabled={status === 'correct'}
                    onChange={(event) => {
                      setPairValues((current) => ({ ...current, [field.id]: event.target.value }))
                      if (status === 'wrong') setStatus('idle')
                    }}
                    style={{
                      minHeight: 42,
                      border: `1px solid ${status === 'wrong' ? C.primary : C.line}`,
                      borderRadius: 11,
                      background: C.paper,
                      color: C.text,
                      padding: '8px 11px',
                      textAlign: 'center',
                      font: `800 17px ${F.mono}`,
                      outline: 0,
                    }}
                  />
                </label>
              ))}
            </div>
            <div className="g7-action-row">
              <PrimaryButton data-testid="practice-check" disabled={task.fields.some((field) => !String(pairValues[field.id] ?? '').trim()) || status === 'correct'} onClick={submitPair}>
                <Check size={17} /> {tr(UI.check, lang)}
              </PrimaryButton>
            </div>
          </div>
        )}

        {task.type === 'order' && (
          <div style={{ display: 'grid', gap: 9 }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${task.correctOrder.length}, minmax(0, 1fr))`, gap: 6 }}>
              {task.correctOrder.map((_, index) => {
                const item = task.items.find((candidate) => candidate.id === orderedIds[index])
                return (
                  <div key={`${index}-${item?.id ?? 'empty'}`} className={item ? 'g7-sequence-filled' : index === orderedIds.length ? 'g7-sequence-next' : undefined} style={{
                    minHeight: mobile ? 38 : 44,
                    borderRadius: 10,
                    border: `1px dashed ${item ? C.green : C.subtle}`,
                    background: item ? C.greenSoft : C.paper,
                    display: 'grid',
                    placeItems: 'center',
                    padding: 5,
                    color: item ? C.text : C.muted,
                    textAlign: 'center',
                    font: `750 ${mobile ? 9 : 11}px/1.2 ${F.sans}`,
                  }}>
                    {item ? <RichMathText value={item.label} lang={lang} /> : index + 1}
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : `repeat(${task.items.length}, minmax(0, 1fr))`, gap: 7 }}>
              {task.items.map((item) => {
                const used = orderedIds.includes(item.id)
                const wrong = wrongChoices.includes(item.id)
                return (
                  <button
                    type="button"
                    className={`g7-option${isMathOnly(item.label, lang) ? ' g7-math-button' : ''}`}
                    data-testid="practice-option"
                    data-option-id={item.id}
                    key={item.id}
                    disabled={used || status === 'correct'}
                    onClick={() => chooseOrderItem(item)}
                    style={{
                      minHeight: mobile ? 40 : 44,
                      border: `1px solid ${wrong ? C.primary : C.line}`,
                      borderRadius: 10,
                      background: used ? C.greenSoft : wrong ? C.primarySoft : C.paper,
                      color: used ? C.green : C.text,
                      padding: '7px 8px',
                      font: `750 ${mobile ? 10 : 11}px/1.2 ${F.sans}`,
                      cursor: used || status === 'correct' ? 'default' : 'pointer',
                    }}
                  >
                    <RichMathText value={item.label} lang={lang} />
                  </button>
                )
              })}
            </div>
          </div>
        )}
        </div>

        {status === 'wrong' && hintText && (
          <Feedback ok={false}><RichMathText value={hintText} lang={lang} /></Feedback>
        )}

        {status === 'correct' && (
          <PracticeSolution task={task} taskIndex={taskIndex} total={PRACTICE_TASKS.length} lang={lang} mobile={mobile} audio={audio} onAdvance={advance} />
        )}
      </div>
    </div>
  )
}

function getPracticeStats(answers) {
  const pack = answers[PRACTICE_SCREEN] ?? {}
  const total = PRACTICE_TASKS.length
  const results = Array.isArray(pack.taskResults) ? pack.taskResults.slice(0, total) : []
  const completed = Math.min(Number(pack.completedCount) || results.length, total)
  const solved = pack.solved === true && completed === total
  const firstTryCorrect = results.slice(0, completed).filter(Boolean).length
  return {
    total,
    completed,
    solved,
    masteryPercent: Math.round((completed / total) * 100),
    firstTryCorrect,
    firstTryPercent: solved ? Math.round((firstTryCorrect / total) * 100) : null,
    results,
  }
}

function SummaryActivity({ lang, studentName, answers, mobile }) {
  const stats = getPracticeStats(answers)
  const message = stats.solved
    ? L(
        'Barcha sakkiz vazifa yechildi. Birinchi urinish natijasi tezlikni emas, qaysi ko‘nikmani yana mustahkamlashni ko‘rsatadi.',
        'Все восемь задач решены. Результат первой попытки показывает не скорость, а навык, который стоит ещё укрепить.',
        'All eight tasks are solved. The first-attempt result shows which skill to strengthen, not how fast you are.',
      )
    : L(
        'Yakuniy natija uchun mustaqil mashqdagi barcha 8 vazifani bajaring.',
        'Для итогового результата выполните все 8 заданий самостоятельной практики.',
        'Complete all 8 independent-practice tasks to receive the final result.',
      )
  const rules = [
    L('Qavs ichidagi amallar birinchi bajariladi.', 'Действия в скобках выполняются первыми.', 'Operations in brackets come first.'),
    L('Ko‘paytirish va bo‘lish chapdan o‘ngga bajariladi.', 'Умножение и деление выполняются слева направо.', 'Multiplication and division go from left to right.'),
    L('Qo‘shish va ayirish ham chapdan o‘ngga bajariladi.', 'Сложение и вычитание тоже выполняются слева направо.', 'Addition and subtraction also go from left to right.'),
  ]
  const skillGroups = [
    { id: 'brackets', label: L('Qavslar', 'Скобки', 'Brackets'), taskIds: ['build-new-solution', 'bracket-and-final', 'place-brackets'] },
    { id: 'priority', label: L('Ustuvorlik', 'Приоритет', 'Priority'), taskIds: ['priority-first', 'spot-first-division', 'independent-error-audit'] },
    { id: 'left-to-right', label: L('Chapdan o‘ngga', 'Слева направо', 'Left to right'), taskIds: ['equal-chain', 'compare-routes'] },
  ]
  return (
    <div data-testid="summary-status" data-status={stats.solved ? 'complete' : 'incomplete'} style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '0.76fr 1.24fr', gap: 12 }}>
      <Panel tone={stats.solved ? 'orange' : 'yellow'} style={{ position: 'relative', overflow: 'hidden', display: 'grid', alignContent: 'center', justifyItems: 'center', textAlign: 'center', gap: 7 }}>
        {stats.solved && <div data-testid="summary-confetti"><CelebrationParticles /></div>}
        {stats.solved ? <Sparkles className="g7-result-a" size={27} color={C.primary} /> : <Clock3 size={26} color={C.primary} />}
        <strong data-testid="summary-score" className="g7-score-pop" style={{ font: `900 ${mobile ? 36 : 48}px ${F.serif}`, color: C.primary }}>
          {stats.completed} / {stats.total}
        </strong>
        <span data-testid="summary-completed" style={{ font: `800 12px ${F.sans}`, color: C.text }}>
          {tr(stats.solved ? L('O‘zlashtirildi', 'Освоено', 'Mastered') : L('Tekshiruv tugallanmagan', 'Проверка не завершена', 'Check incomplete'), lang)}
        </span>
        <span style={{ font: `800 13px ${F.sans}`, color: C.text }}>{studentName}</span>
        {stats.solved && (
          <span data-testid="summary-first-try" style={{ font: `800 12px ${F.mono}`, color: C.green }}>
            {tr(L('Birinchi urinishda', 'С первой попытки', 'First try'), lang)}: {stats.firstTryCorrect} / {stats.total}
          </span>
        )}
        <span style={{ font: `650 12px/1.4 ${F.sans}`, color: C.muted }}>{tr(message, lang)}</span>
      </Panel>
      <Panel style={{ display: 'grid', gap: 10 }}>
        {rules.map((rule, index) => (
          <div className="g7-rule-in" key={index} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 9, alignItems: 'start', animationDelay: `${.12 + index * .1}s` }}>
            <span style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              display: 'grid',
              placeItems: 'center',
              background: C.greenSoft,
              color: C.green,
              font: `900 12px ${F.mono}`,
            }}>
              {index + 1}
            </span>
            <span style={{ font: `700 ${mobile ? 12 : 14}px/1.45 ${F.sans}`, color: C.text }}>{tr(rule, lang)}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 8, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {skillGroups.map((skill) => {
            const indexes = skill.taskIds.map((id) => PRACTICE_TASKS.findIndex((task) => task.id === id))
            const firstTry = indexes.filter((index) => stats.results[index] === true).length
            return (
              <div key={skill.id} style={{ padding: '7px 5px', borderRadius: 9, background: C.inkSoft, textAlign: 'center', display: 'grid', gap: 2 }}>
                <span style={{ color: C.text, font: `750 ${mobile ? 9 : 10}px ${F.sans}` }}>{tr(skill.label, lang)}</span>
                <span style={{ color: C.green, font: `850 10px ${F.mono}` }}>{firstTry} / {indexes.length}</span>
              </div>
            )
          })}
        </div>
        <Panel tone="yellow" style={{ padding: 8, color: C.text, font: `650 ${mobile ? 10 : 11}px/1.35 ${F.sans}` }}>
          {tr(L(
            'O‘zini tekshirish — to‘rtinchi amal darajasi emas: har bir o‘tishda faqat tanlangan bo‘lak o‘zgarganini tekshiring.',
            'Самопроверка — не четвёртый уровень действий: убедитесь, что в каждом переходе изменился только выбранный фрагмент.',
            'Self-checking is not a fourth operation level: verify that only the selected part changes in each transition.',
          ), lang)}
        </Panel>
      </Panel>
    </div>
  )
}

function Activity({ screenIdx, lang, storedAnswer, onAnswer, mobile, audio, studentName, answers }) {
  const screenType = SCREENS[screenIdx]?.type
  if (screenType === 'hook') return <HookActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} />
  if (screenType === 'teaching') return <TeachingActivity {...{ screenIdx, lang, audio, mobile, storedAnswer, onAnswer }} />
  if (screenType === 'practice-pack') return <PracticePack {...{ lang, storedAnswer, onAnswer, mobile, audio }} />
  if (screenType === 'summary') return <SummaryActivity {...{ lang, studentName, answers, mobile }} />
  if (screenType === 'guided-pair') return <PairValuesActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} />
  if (screenType === 'guided-error') return <ErrorAuditActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} />
  if (screenType === 'guided-final') return <DualAnswerActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} />
  if (screenType === 'guided-sequence-full') {
    return <SequenceActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} data={GUIDED_DATA.fullSequence} activityId="full-sequence" />
  }
  if (screenType === 'guided-sequence-equal') {
    return <SequenceActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} data={GUIDED_DATA.equalPriority} activityId="equal-priority" />
  }
  return null
}

export default function Grade7Dars01({ studentName, lang = 'uz', onFinished }) {
  const safeLang = ['uz', 'ru', 'en'].includes(lang) ? lang : 'uz'
  const safeName = studentName || (safeLang === 'ru' ? 'Ученик' : safeLang === 'en' ? 'Student' : "O'quvchi")
  const mobile = useIsMobile()
  const startTimeRef = useRef(null)
  const finishedRef = useRef(false)
  const [screenIdx, setScreenIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (startTimeRef.current === null) startTimeRef.current = Date.now()
  }, [])

  const copy = SCREENS[screenIdx]
  const audioSegments = useMemo(() => {
    const steps = copy.audioSteps?.length ? copy.audioSteps : [copy.audio]
    const explanationSegments = steps.map((text, index) => ({
      id: `s${screenIdx}_step_${index}`,
      text: tr(text, safeLang),
      trigger: index === 0 ? 'on_mount' : 'after_previous',
      waits_for: copy.waitsForChoice && index === steps.length - 1
        ? { type: 'option_picked' }
        : null,
    }))
    const theoryLesson = screenIdx >= FIRST_THEORY_SCREEN && screenIdx <= LAST_THEORY_SCREEN
      ? TEACHING_LESSONS[screenIdx - FIRST_THEORY_SCREEN]
      : null
    if (!theoryLesson?.prediction) return explanationSegments
    return [
      {
        id: `s${screenIdx}_prediction`,
        text: tr(theoryLesson.prediction.audio, safeLang),
        trigger: 'on_mount',
        waits_for: { type: 'prediction_picked' },
      },
      ...explanationSegments.map((segment, index) => ({
        ...segment,
        trigger: index === 0 ? 'after_previous' : segment.trigger,
      })),
    ]
  }, [copy, safeLang, screenIdx])
  const audio = useAudio(audioSegments)

  const recordAnswer = useCallback((payload) => {
    setAnswers((current) => ({
      ...current,
      [screenIdx]: {
        ...payload,
        question: tr(SCREENS[screenIdx].title, safeLang),
        scope: SCREENS[screenIdx].scope,
      },
    }))
  }, [safeLang, screenIdx])

  const goNext = () => {
    if (screenIdx >= TOTAL_SCREENS - 1) return
    if (!FREE_NAV && !answers[screenIdx]) return
    setScreenIdx((index) => Math.min(index + 1, TOTAL_SCREENS - 1))
  }

  const goBack = () => {
    setScreenIdx((index) => Math.max(index - 1, 0))
  }

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return
    const stats = getPracticeStats(answers)
    if (!stats.solved) return
    finishedRef.current = true
    setFinished(true)
    const payload = {
      lessonId: LESSON_ID,
      lessonTitle: tr(L('Sonli ifodalar', 'Числовые выражения', 'Numerical expressions'), safeLang),
      durationSec: Math.max(1, Math.floor((Date.now() - (startTimeRef.current ?? Date.now())) / 1000)),
      totalQuestions: stats.total,
      correctAnswers: stats.completed,
      scorePercent: stats.masteryPercent,
      passed: stats.solved,
      firstTryStats: {
        total: stats.total,
        firstTryCorrect: stats.firstTryCorrect,
        scorePercent: stats.firstTryPercent ?? 0,
      },
      answers: stats.results.map((correct, index) => ({
        questionIndex: index,
        type: PRACTICE_TASKS[index].type,
        question: tr(PRACTICE_TASKS[index].prompt, safeLang),
        correct,
        response: null,
      })),
    }
    if (typeof onFinished === 'function') onFinished(payload)
  }, [answers, onFinished, safeLang])

  const progress = ((screenIdx + 1) / TOTAL_SCREENS) * 100
  const practiceStats = getPracticeStats(answers)
  const isTheoryScreen = screenIdx >= FIRST_THEORY_SCREEN && screenIdx <= LAST_THEORY_SCREEN
  const isApplicationScreen = screenIdx >= FIRST_APPLICATION_SCREEN && screenIdx <= LAST_APPLICATION_SCREEN
  const canContinue = FREE_NAV || (
    screenIdx === HOOK_SCREEN
      ? Boolean(answers[HOOK_SCREEN]?.picked)
      : screenIdx === PRACTICE_SCREEN
        ? answers[PRACTICE_SCREEN]?.solved === true
        : isTheoryScreen
          ? Boolean(answers[screenIdx]) && !audio.isPlaying
          : isApplicationScreen
            ? answers[screenIdx]?.solutionViewed === true && !audio.isPlaying
            : Boolean(answers[screenIdx])
  )
  const contentPadding = mobile ? '10px 12px 17px' : '16px 100px 34px'

  return (
    <div
      className="g7-lesson-root"
      data-testid="lesson-root"
      lang={safeLang}
      style={{
        height: '100dvh',
        background: C.bg,
        color: C.text,
        fontFamily: F.sans,
        overflow: 'hidden',
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: 936,
        height: '100%',
        margin: '0 auto',
        background: 'transparent',
        border: 0,
        borderRadius: 0,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <header style={{
          padding: mobile ? '48px 12px 8px' : '18px 100px 12px',
          background: C.bg,
          flexShrink: 0,
          boxSizing: 'border-box',
        }}>
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(167, 166, 162, .25)', overflow: 'hidden', marginBottom: mobile ? 9 : 12 }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              style={{ height: '100%', borderRadius: 999, background: C.primary, boxShadow: '0 0 10px rgba(255, 79, 40, .5)' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{
              minWidth: 0,
              color: C.muted,
              font: `700 ${mobile ? 10 : 11}px ${F.mono}`,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              <span style={{
                display: 'inline-block',
                width: 7,
                height: 7,
                marginRight: 10,
                borderRadius: '50%',
                background: C.primary,
                boxShadow: '0 0 8px rgba(255, 79, 40, .55)',
              }} />
              {tr(copy.phase, safeLang)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {!audio.muted && (
                <IconButton label={tr(UI.replay, safeLang)} onClick={audio.replay}>
                  <RotateCcw size={15} />
                </IconButton>
              )}
              <IconButton label={tr(audio.muted ? UI.unmute : UI.mute, safeLang)} onClick={audio.toggleMute} active={audio.muted}>
                {audio.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </IconButton>
              <span data-testid="slide-counter" style={{ color: C.text, font: `700 ${mobile ? 12 : 14}px ${F.mono}` }}>
                {String(screenIdx + 1).padStart(2, '0')} / {String(TOTAL_SCREENS).padStart(2, '0')}
              </span>
            </div>
          </div>
        </header>

        <main
          key={screenIdx}
          data-testid="lesson-slide"
          data-slide-id={copy.id}
          data-slide-index={screenIdx + 1}
          style={{
            flex: 1,
            minHeight: 0,
            padding: contentPadding,
            display: 'flex',
            flexDirection: 'column',
            gap: mobile ? 8 : 12,
            overflowY: 'auto',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          <AmbientMotion mobile={mobile} />
          <section className="g7-fade-up" style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                color: C.primary,
                font: `700 ${mobile ? 10 : 11}px ${F.mono}`,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                {tr(copy.kicker, safeLang)}
              </div>
              <h1 style={{
                margin: 0,
                color: C.text,
                font: `600 ${mobile ? 23 : 30}px/1.1 ${F.serif}`,
                letterSpacing: '-.005em',
              }}>
                {tr(copy.title, safeLang)}
              </h1>
              <p style={{
                margin: mobile ? '5px 0 0' : '7px 0 0',
                color: C.muted,
                font: `600 ${mobile ? 12 : 15}px/1.5 ${F.sans}`,
                maxWidth: 736,
              }}>
                <RichMathText value={copy.lead} lang={safeLang} />
              </p>
          </section>

          <section className="g7-fade-up g7-delay-2" style={{
            flex: '0 0 auto',
            minHeight: 0,
            width: '100%',
            paddingTop: mobile ? 0 : 14,
            display: 'block',
            position: 'relative',
            zIndex: 1,
          }}>
            <Activity
              key={screenIdx}
              screenIdx={screenIdx}
              lang={safeLang}
              studentName={safeName}
              storedAnswer={answers[screenIdx]}
              answers={answers}
              onAnswer={recordAnswer}
              mobile={mobile}
              audio={audio}
            />
          </section>
        </main>

        <footer style={{
          minHeight: mobile ? 58 : 63,
          borderTop: `1px solid ${C.line}`,
          padding: mobile ? '8px 12px' : '10px 100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: screenIdx > 0 ? 'space-between' : 'flex-end',
          gap: 10,
          background: C.bg,
          flexShrink: 0,
          boxSizing: 'border-box',
        }}>
          {screenIdx > 0 && (
            <QuietButton data-testid="lesson-back" onClick={goBack}>
              <ArrowLeft size={17} />
              {!mobile && tr(UI.back, safeLang)}
            </QuietButton>
          )}
          <div style={{ display: 'flex', gap: 8, marginLeft: screenIdx > 0 ? 0 : 'auto' }}>
            {screenIdx < TOTAL_SCREENS - 1 && (
              <PrimaryButton data-testid="lesson-next" onClick={goNext} disabled={!canContinue}>
                {tr(UI.next, safeLang)} <ArrowRight size={17} />
              </PrimaryButton>
            )}
            {screenIdx === SUMMARY_SCREEN && (
              <PrimaryButton
                data-testid="summary-finish"
                onClick={finishLesson}
                disabled={finished || !practiceStats.solved}
              >
                <Check size={18} />
                {finished
                  ? tr(L('Natija saqlandi', 'Результат сохранён', 'Result saved'), safeLang)
                  : tr(UI.finish, safeLang)}
              </PrimaryButton>
            )}
          </div>
        </footer>
      </div>
      <style>{MOTION_STYLES}</style>
    </div>
  )
}
