/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useMemo, useState } from 'react';
import LessonNumPad from '../LessonNumPad';

const COLORS = {
  accent: '#FF4F28',
  accentSoft: '#FFE8E1',
  ok: '#1F7A4D',
  okSoft: '#E3F0E8',
  no: '#B9382F',
  noSoft: '#FDECEC',
  ink: '#111827',
  muted: '#5F6570',
  line: '#E4DECF',
  stage: 'linear-gradient(145deg, #F7FBFF 0%, #EEF6FF 55%, #FFF8E8 100%)',
};

const STYLE = {
  eyebrow: { color: COLORS.accent, fontSize: 13, fontWeight: 900, letterSpacing: '.05em', textTransform: 'uppercase' },
  setup: { color: '#374151', fontSize: 16, lineHeight: 1.38, margin: '4px 0 7px', whiteSpace: 'pre-line' },
  ask: { color: COLORS.ink, fontSize: 18, fontWeight: 850, lineHeight: 1.32, margin: 0 },
  askCard: {
    margin: '8px 0 7px',
    padding: '10px 13px',
    border: '1.5px solid #B9D7F0',
    borderRadius: 15,
    background: '#F7FBFF',
  },
  askLabel: {
    display: 'block',
    marginBottom: 5,
    color: '#145A86',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: '.06em',
    textTransform: 'uppercase',
  },
  instruction: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginTop: 8,
    color: '#526273',
    fontSize: 14,
    fontWeight: 750,
    lineHeight: 1.4,
  },
  option: {
    width: '100%',
    minHeight: 48,
    padding: '9px 12px',
    borderRadius: 14,
    border: `2px solid ${COLORS.line}`,
    background: '#fff',
    color: '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif",
    fontSize: 17,
    fontWeight: 800,
    cursor: 'pointer',
  },
};

const FX = `
  .g3-question-shell {
    width: 100%;
    max-width: 1060px;
    height: 100%;
    min-height: 0;
    margin: 0 auto;
    padding: 2px;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: minmax(0, 1.04fr) minmax(330px, .96fr);
    grid-auto-flow: row;
    gap: 18px;
    align-items: start;
    align-content: start;
    overflow: hidden;
  }
  .g3-question-context-item {
    grid-column: 1;
    min-width: 0;
  }
  .g3-question-work-item {
    grid-column: 2;
    min-width: 0;
  }
  .g3-question-context-panel,
  .g3-question-work-panel {
    display: flex;
    min-width: 0;
    flex-direction: column;
    overflow: hidden;
  }
  .g3-question-context-panel { gap: 0; }
  .g3-question-work-panel { gap: 10px; }
  .g3-question-instruction,
  .g3-question-ask-label {
    display: none !important;
  }
  @media (min-width: 720px) {
    .g3-question-shell {
      max-width: 700px;
      grid-template-columns: minmax(0, 1fr);
      column-gap: 0;
      row-gap: 6px;
      align-content: center;
    }
    .g3-question-shell > .g3-question-context-panel {
      grid-column: 1;
      grid-row: 1;
    }
    .g3-question-shell > .g3-question-work-panel {
      grid-column: 1;
      grid-row: 2;
    }
    .g3-question-work-panel > .g3-question-ask-card,
    .g3-question-work-panel > .g3-practice-pop {
      margin-block: 0 !important;
    }
    .g3-question-shell.g3-question-input .g3-numeric-answer-zone {
      grid-column: 1;
      grid-row: 3;
    }
    .g3-question-shell.g3-question-input.g3-result-correct .g3-question-ask-card {
      display: none;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-question-instruction {
      display: none !important;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong {
      row-gap: 6px;
    }
  }
  @media (min-width: 720px) and (max-height: 800px) {
    .g3-question-shell.g3-question-input .g3-question-setup {
      margin: 4px 0 6px !important;
      font-size: 16px !important;
      line-height: 1.35 !important;
    }
    .g3-question-shell.g3-question-input .g3-practice-stage {
      min-height: 76px;
      margin-top: 4px;
      padding: 7px 10px;
      border-radius: 15px;
    }
    .g3-question-shell.g3-question-input .g3-practice-stage-inner {
      gap: 4px;
    }
    .g3-question-shell.g3-question-input .g3-context-group {
      font-size: 28px !important;
    }
    .g3-question-shell.g3-question-input .g3-practice-visual {
      font-size: 24px !important;
    }
    .g3-question-shell.g3-question-input .g3-question-work-panel {
      gap: 6px;
    }
    .g3-question-shell.g3-question-input .g3-question-ask-card {
      padding: 8px 12px;
      border-radius: 12px;
    }
    .g3-question-shell.g3-question-input .g3-question-ask-label,
    .g3-question-shell.g3-question-input .g3-question-instruction {
      display: none !important;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-lesson-numpad {
      gap: 5px !important;
      padding: 16px 9px 9px !important;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-lesson-numpad__display {
      height: 48px !important;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-lesson-numpad__grid {
      gap: 5px !important;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-lesson-numpad__key,
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-lesson-numpad__spacer {
      height: 40px !important;
    }
  }
  .g3-practice-stage {
    position: relative;
    overflow: hidden;
    min-height: 86px;
    margin: 5px 0 0;
    padding: 9px;
    border-radius: 15px;
    background: ${COLORS.stage};
    border: 1px solid #C7DDF2;
    box-shadow: 0 8px 24px rgba(57, 96, 128, .08);
  }
  .g3-practice-stage-inner {
    position: relative;
    display: grid;
    place-items: center;
    gap: 6px;
    text-align: center;
  }
  .g3-answer-zone { min-height: 0; }
  .g3-mobile-step-button {
    width: min(100%, 320px);
    min-height: 48px;
    margin: 10px auto 0;
    border: 0;
    border-radius: 15px;
    color: #fff;
    background: #2563EB;
    font: 850 16px 'Manrope', system-ui, sans-serif;
    cursor: pointer;
  }
  .g3-mobile-back-button {
    display: none;
  }
  .g3-practice-pop { animation: g3-practice-pop .35s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes g3-practice-pop { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: none; } }
  .g3-practice-star { animation: g3-practice-star 3s ease-in-out infinite; }
  @keyframes g3-practice-star { 50% { opacity: .95; transform: scale(1.7); } }
  .g3-practice-visual.is-correct { animation: g3-practice-verify .7s cubic-bezier(.34,1.4,.64,1) both; }
  @keyframes g3-practice-verify {
    0% { transform: scale(.96); color: #145A86; }
    55% { transform: scale(1.07); color: #1F7A4D; }
    100% { transform: none; color: #1F7A4D; }
  }
  .g3-model-cell, .g3-model-bar, .g3-model-dot, .g3-model-hand, .g3-model-trace {
    transition: transform .65s cubic-bezier(.34,1.2,.64,1), background .55s ease, opacity .45s ease, stroke-dashoffset .9s ease;
  }
  .g3-model.is-correct .g3-model-cell { background: #32A96B !important; border-color: #8DE0B0 !important; transform: translateY(-3px); }
  .g3-model.is-correct .g3-model-bar { transform: scaleY(1) !important; background: linear-gradient(#8DE0B0,#32A96B) !important; }
  .g3-model.is-correct .g3-model-dot { transform: translateY(-5px) scale(1.08); background: #FFD166 !important; }
  .g3-model.is-correct .g3-model-hand.minute { transform: rotate(120deg) !important; }
  .g3-model.is-correct .g3-model-hand.hour { transform: rotate(35deg) !important; }
  .g3-model.is-correct .g3-model-trace { stroke-dashoffset: 0 !important; transform: rotate(0deg) !important; }
  .g3-context-group { animation: g3-context-float 2.4s ease-in-out infinite; }
  .g3-context-item { transition: transform .5s cubic-bezier(.34,1.4,.64,1), filter .4s ease; }
  .g3-model.is-correct .g3-context-group { animation: g3-context-confirm .6s cubic-bezier(.34,1.56,.64,1) both; }
  .g3-model.is-correct .g3-context-item { transform: translateY(-3px) scale(1.12); filter: saturate(1.18); }
  @keyframes g3-context-float { 50% { transform: translateY(-3px); } }
  @keyframes g3-context-confirm { 50% { transform: translateY(-7px) scale(1.05); } }
  .g3-model-check { animation: g3-model-check .55s .25s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes g3-model-check { from { opacity: 0; transform: scale(.35); } to { opacity: 1; transform: none; } }
  @media (max-width: 719.98px) {
    .g3-question-shell {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    .g3-question-shell.g3-mobile-context .g3-question-work-item { display: none !important; }
    .g3-question-shell.g3-mobile-answer .g3-question-context-item { display: none !important; }
    .g3-question-shell.g3-result-correct .g3-answer-zone,
    .g3-question-shell.g3-result-correct .g3-mobile-back-button {
      display: none !important;
    }
    .g3-answer-multi.is-compact {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .g3-question-shell > .g3-question-context-item,
    .g3-question-shell > .g3-question-work-item {
      width: 100%;
      max-width: 650px;
      margin-inline: auto;
      box-sizing: border-box;
    }
    .g3-mobile-back-button {
      display: inline-flex;
      align-self: flex-start;
      margin-bottom: 5px;
      padding: 5px 9px;
      border: 1.5px solid #D6DAE3;
      border-radius: 999px;
      color: #526273;
      background: #fff;
      font: 800 12px 'Manrope', system-ui, sans-serif;
      cursor: pointer;
    }
    .g3-practice-stage {
      min-height: 82px;
      padding: 8px;
    }
  }
  @media (max-height: 760px) {
    .g3-question-setup { font-size: 15px !important; line-height: 1.3 !important; }
    .g3-practice-stage { min-height: 72px; padding-block: 6px; }
    .g3-practice-stage-inner { gap: 4px; }
    .g3-context-group { font-size: 28px !important; }
    .g3-practice-visual { font-size: 23px !important; }
    .g3-question-ask-card { margin-block: 4px !important; padding: 8px 10px !important; }
    .g3-answer-zone { gap: 6px !important; }
    .g3-answer-zone button { min-height: 42px !important; padding-block: 7px !important; }
    .g3-practice-pop { margin-top: 4px !important; padding: 7px 9px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .g3-practice-pop, .g3-practice-star, .g3-practice-visual, .g3-model-check, .g3-context-group { animation: none !important; }
    .g3-model-cell, .g3-model-bar, .g3-model-dot, .g3-model-hand, .g3-model-trace { transition: none !important; }
  }
`;

function useRegisteredCheck(check, registerCheck) {
  useEffect(() => {
    registerCheck?.(check);
  }, [check, registerCheck]);
}

function useMobilePracticeMode() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 719.98px)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(max-width: 719.98px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return mobile;
}

const UNIT_ALIASES = Object.freeze({
  kg: 'kg', 'кг': 'kg', kilogram: 'kg', kilograms: 'kg', kilogramm: 'kg', килограмм: 'kg', килограмма: 'kg', килограммов: 'kg',
  g: 'g', 'г': 'g', gram: 'g', gramm: 'g', грамм: 'g', грамма: 'g', граммов: 'g',
  mg: 'mg', 'мг': 'mg',
  km: 'km', 'км': 'km',
  m: 'm', 'м': 'm', metr: 'm', meter: 'm', метр: 'm', метра: 'm', метров: 'm',
  dm: 'dm', 'дм': 'dm',
  cm: 'cm', 'см': 'cm',
  mm: 'mm', 'мм': 'mm',
  'km²': 'km2', 'км²': 'km2', km2: 'km2', 'км2': 'km2',
  'm²': 'm2', 'м²': 'm2', m2: 'm2', 'м2': 'm2',
  'dm²': 'dm2', 'дм²': 'dm2', dm2: 'dm2', 'дм2': 'dm2',
  'cm²': 'cm2', 'см²': 'cm2', cm2: 'cm2', 'см2': 'cm2',
  'mm²': 'mm2', 'мм²': 'mm2', mm2: 'mm2', 'мм2': 'mm2',
  l: 'l', 'л': 'l', litr: 'l', liter: 'l', литр: 'l', литра: 'l', литров: 'l',
  ml: 'ml', 'мл': 'ml',
  h: 'h', soat: 'h', час: 'h', часа: 'h', часов: 'h',
  min: 'min', minut: 'min', 'мин': 'min', минута: 'min', минуты: 'min', минут: 'min',
  s: 's', sec: 's', sekund: 's', 'с': 's', секунда: 's', секунды: 's', секунд: 's',
});

function normalizeUnit(value) {
  const key = String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  return UNIT_ALIASES[key] || key;
}

function normalizeAnswerCore(value) {
  let normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^[xх]\s*=\s*/iu, '')
    .replaceAll('×', '*')
    .replaceAll('х', '*')
    .replaceAll('x', '*')
    .replaceAll('÷', ':')
    .replace(/\s+/g, '');

  // In grade 3 materials a dot between groups of three digits is a thousands
  // separator, not a decimal separator: 1.000 = 1 000 = 1000.
  if (/^[+-]?\d{1,3}(?:\.\d{3})+$/.test(normalized)) {
    normalized = normalized.replaceAll('.', '');
  }
  return normalized.replace(',', '.');
}

export function parsePracticeAnswer(value) {
  const raw = String(value ?? '').trim().replace(/^[xх]\s*=\s*/iu, '');
  const withUnit = raw.match(/^([+-]?\d[\d\s]*(?:[.,]\d+)?)\s*([a-zа-яёʻʼ’'°]+(?:[²³23])?)$/iu);
  if (!withUnit) {
    return { value: normalizeAnswerCore(raw), unit: null };
  }
  return {
    value: normalizeAnswerCore(withUnit[1]),
    unit: normalizeUnit(withUnit[2]),
  };
}

export function normalizePracticeAnswer(value) {
  return parsePracticeAnswer(value).value;
}

export function inputAnswerVariants(value) {
  const raw = String(value ?? '').trim();
  const variants = [raw];
  const numberWithUnit = raw.match(/^([+-]?\d[\d\s]*(?:[.,]\d+)?)\s*(?:[a-zа-яёʻʼ’'°²³]+(?:\s*\/\s*[a-zа-яёʻʼ’'°²³]+)?)$/iu);
  if (numberWithUnit) variants.push(numberWithUnit[1]);
  return variants;
}

function sameSet(a, b) {
  return a.length === b.length && [...a].sort((x, y) => x - y).every((v, i) => v === [...b].sort((x, y) => x - y)[i]);
}

export function isCorrectAnswer(spec, answer) {
  if (spec.type === 'choice') return answer === spec.correct;
  if (spec.type === 'input') {
    const accepted = Array.isArray(spec.correct) ? spec.correct : [spec.correct];
    const submitted = parsePracticeAnswer(answer);
    return accepted.some((value) => {
      const expected = parsePracticeAnswer(value);
      if (expected.value !== submitted.value) return false;
      if (!submitted.unit) return true;
      return Boolean(expected.unit) && expected.unit === submitted.unit;
    });
  }
  if (spec.type === 'multi') return sameSet(answer, spec.correct);
  if (spec.type === 'order') return answer.length === spec.correct.length && answer.every((v, i) => v === spec.correct[i]);
  return false;
}

function hasAnswer(spec, answer) {
  if (spec.type === 'choice') return answer !== null;
  if (spec.type === 'input') return normalizePracticeAnswer(answer).length > 0;
  if (spec.type === 'multi') return answer.length > 0;
  if (spec.type === 'order') return answer.length === spec.correct.length;
  return false;
}

function answerForSubmit(spec, answer, text) {
  if (spec.type === 'choice') return { idx: answer, label: text.options?.[answer] };
  if (spec.type === 'input') return { value: answer };
  return { indices: answer, labels: answer.map((i) => text.options?.[i]) };
}

function correctForSubmit(spec, text) {
  if (spec.type === 'choice') return { idx: spec.correct, label: text.options?.[spec.correct] };
  if (spec.type === 'input') return { value: Array.isArray(spec.correct) ? spec.correct[0] : spec.correct };
  return { indices: spec.correct, labels: spec.correct.map((i) => text.options?.[i]) };
}

const ACTION_COPY = {
  uz: {
    choice: 'Bitta javobni tanlang.',
    multi: "Barcha to'g'ri javoblarni belgilang.",
    order: 'Kartalarni birinchi qadamdan boshlab tanlang.',
    input: 'Javobni yozing.',
    numericInput: 'Javobni faqat son bilan yozing. Birlikni yozish shart emas.',
    fractionInput: "Javobni kasr ko'rinishida yozing. Masalan: 1/2.",
    question: 'Savol',
    wrong: "Yana urinib ko'ring.",
  },
  ru: {
    choice: 'Выбери один ответ.',
    multi: 'Отметь все верные ответы.',
    order: 'Нажимай карточки, начиная с первого шага.',
    input: 'Запиши ответ.',
    numericInput: 'Запиши в ответе только число. Единицу писать не нужно.',
    fractionInput: 'Запиши ответ в виде дроби. Например: 1/2.',
    question: 'Вопрос',
    wrong: 'Попробуй ещё.',
  },
};

function actionCopy(spec, lang) {
  const copy = ACTION_COPY[lang] || ACTION_COPY.uz;
  if (spec.type !== 'input') return copy[spec.type] || copy.choice;
  const accepted = Array.isArray(spec.correct) ? spec.correct : [spec.correct];
  const first = String(accepted[0] ?? '').trim();
  if (/^[+-]?\d+\s*\/\s*\d+$/.test(first)) return copy.fractionInput;
  if (inputAnswerVariants(first).some((value) => /^[+-]?\d[\d\s]*(?:[.,]\d+)?$/.test(value))) {
    return copy.numericInput;
  }
  return copy.input;
}

export function sceneKind(spec, text) {
  const explicit = spec.scene || spec.sceneKind || spec.meta?.scene;
  if (explicit) return explicit;
  const corpus = `${spec.tag || ''} ${text.eyebrow || ''} ${text.setup || ''} ${text.ask || ''} ${text.visual || ''}`.toLowerCase();
  if (/kasr|ulush|fraction|surat|maxraj/.test(corpus)) return 'fraction';
  if (/perimetr|chegara/.test(corpus)) return 'perimeter';
  if (/yuza|maydon|area|sm²|m²/.test(corpus)) return 'area';
  if (/kalendar|calendar|hafta|oylar|sana/.test(corpus)) return 'calendar';
  if (/soat|vaqt|minut|time/.test(corpus)) return 'time';
  if (/massa|kilogram|gramm|kg|mass/.test(corpus)) return 'mass';
  if (/diagram|jadval|piktogram|ma'lumot|data|chart/.test(corpus)) return 'data';
  if (/tenglama|noma'lum|equation/.test(corpus)) return 'equation';
  if (/qoldiq|remainder/.test(corpus)) return 'remainder';
  if (/bo'lish|bo'lin|taqsim|divide|quotient/.test(corpus)) return 'division';
  if (/guruh|tadan|har bir.{0,24}ta|savatda|qutida|rafda|ko'paytir|ko'paytma|marta|product/.test(corpus)) return 'multiplication';
  if (/qo'sh|ayir|yig'indi|farq|addition|subtraction/.test(corpus)) return 'operation';
  if (/taqqos|tengsizlik|rost|yolg'on|katta|kichik|compare/.test(corpus)) return 'compare';
  if (/so'm|pul|narx|qaytim|xarid|money/.test(corpus)) return 'money';
  if (/harorat|termometr|°c|temperature/.test(corpus)) return 'temperature';
  if (/rim|roman|\b[ivxlc]+\b/.test(corpus)) return 'roman';
  if (/ketma-ket|qonuniyat|davom ettir|sequence/.test(corpus)) return 'sequence';
  if (/uzunlik|metr|santimetr|millimetr|length/.test(corpus)) return 'length';
  if (/razryad|yuzlik|o'nlik|birlik|yumaloq|son o'qi|raqam/.test(corpus)) return 'place';
  if (/konus|piramida|kub|parallelepiped|fazoviy/.test(corpus)) return 'solid';
  if (/uchburchak|to'rtburchak|kvadrat|burchak|simmetri|parallel|shakl/.test(corpus)) return 'geometry';
  return spec.type === 'order' ? 'order' : spec.type === 'multi' ? 'classify' : 'process';
}

function fractionParts(text) {
  const corpus = `${text.visual || ''} ${text.setup || ''} ${text.ask || ''}`;
  const match = corpus.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return { numerator: 1, denominator: 4 };
  const denominator = Math.max(2, Math.min(12, Number(match[2])));
  return {
    numerator: Math.max(0, Math.min(denominator, Number(match[1]))),
    denominator,
  };
}

function contextEmoji(text, spec) {
  const corpus = `${text.setup || ''} ${text.ask || ''} ${text.visual || ''}`.toLowerCase();
  if (/olma/.test(corpus)) return '🍎';
  if (/uzum/.test(corpus)) return '🍇';
  if (/kitob/.test(corpus)) return '📘';
  if (/qalam/.test(corpus)) return '✏️';
  if (/gul/.test(corpus)) return '🌼';
  if (/meva/.test(corpus)) return '🍊';
  if (/shar/.test(corpus)) return '⚽';
  if (/chiroq/.test(corpus)) return '💡';
  if (/pul|so'm|narx/.test(corpus)) return '🪙';
  return spec?.emoji && !['🧭', '🧩', '🚀', '🔎', '✅'].includes(spec.emoji) ? spec.emoji : '●';
}

function SemanticModel({ kind, correct, text, spec }) {
  const common = { minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 };
  const cls = `g3-model ${correct ? 'is-correct' : ''}`;

  if (kind === 'fraction') {
    const parts = fractionParts(text);
    return (
      <div className={cls} aria-hidden="true" style={common}>
        {Array.from({ length: parts.denominator }).map((_, i) => (
          <span key={i} className="g3-model-cell" style={{
            width: Math.max(16, Math.min(30, 230 / parts.denominator)),
            height: 40,
            border: '2px solid #9CBBD2',
            borderRadius: 6,
            background: correct && i < parts.numerator ? '#32A96B' : '#FFFFFF',
            transitionDelay: `${i * .06}s`,
          }} />
        ))}
      </div>
    );
  }

  if (kind === 'perimeter' || kind === 'geometry') {
    return (
      <div className={cls} aria-hidden="true" style={common}>
        <svg width="136" height="58" viewBox="0 0 136 58">
          <rect x="13" y="8" width="110" height="42" rx="7" fill="#FFFFFF" stroke="#7FA6C2" strokeWidth="3" />
          <rect className="g3-model-trace" x="13" y="8" width="110" height="42" rx="7" fill="none" stroke="#8DE0B0" strokeWidth="5" strokeLinecap="round" pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: correct ? 0 : 1 }} />
        </svg>
      </div>
    );
  }

  if (kind === 'area') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, display: 'grid', gridTemplateColumns: 'repeat(4, 28px)', gap: 4 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="g3-model-cell" style={{ width: 28, height: 20, border: '1.5px solid #9CBBD2', borderRadius: 4, background: '#FFFFFF', transitionDelay: `${i * .045}s` }} />
        ))}
      </div>
    );
  }

  if (kind === 'time') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, position: 'relative', width: 64, height: 64, minHeight: 64, margin: '0 auto', border: '3px solid #7FA6C2', borderRadius: '50%', background: '#FFFFFF' }}>
        <span className="g3-model-hand minute" style={{ position: 'absolute', left: 29, top: 8, width: 4, height: 25, borderRadius: 3, background: '#FFD166', transformOrigin: '2px 24px', transform: 'rotate(0deg)' }} />
        <span className="g3-model-hand hour" style={{ position: 'absolute', left: 29, top: 16, width: 4, height: 17, borderRadius: 3, background: '#8DE0B0', transformOrigin: '2px 16px', transform: 'rotate(-35deg)' }} />
        <span style={{ position: 'absolute', left: 27, top: 27, width: 8, height: 8, borderRadius: '50%', background: '#243447' }} />
      </div>
    );
  }

  if (kind === 'mass' || kind === 'equation') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, position: 'relative', width: 170, margin: '0 auto' }}>
        <span className="g3-model-trace" style={{ position: 'absolute', left: 30, right: 30, top: 21, height: 4, borderRadius: 4, background: '#7FA6C2', transform: correct ? 'rotate(0deg)' : 'rotate(-5deg)', transformOrigin: 'center' }} />
        <span className="g3-model-cell" style={{ width: 42, height: 30, borderRadius: 8, border: '2px solid #9CBBD2', background: '#FFFFFF' }} />
        <span style={{ width: 7, height: 48, borderRadius: 4, background: '#7FA6C2' }} />
        <span className="g3-model-cell" style={{ width: 42, height: 30, borderRadius: 8, border: '2px solid #9CBBD2', background: '#FFFFFF' }} />
      </div>
    );
  }

  if (kind === 'data') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, alignItems: 'flex-end', height: 56 }}>
        {[.42, .68, 1, .55].map((height, i) => (
          <span key={i} className="g3-model-bar" style={{ width: 24, height: 45 * height, borderRadius: '6px 6px 2px 2px', background: '#76A8CB', transform: 'scaleY(.35)', transformOrigin: 'bottom', transitionDelay: `${i * .1}s` }} />
        ))}
      </div>
    );
  }

  if (kind === 'length') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, position: 'relative', width: 220, height: 42, margin: '0 auto', alignItems: 'flex-end', borderBottom: '5px solid #7FA6C2' }}>
        {Array.from({ length: 11 }).map((_, i) => (
          <span key={i} className={i === 8 ? 'g3-model-cell' : ''} style={{ width: 2, height: i % 5 === 0 ? 24 : 13, background: i === 8 && correct ? '#32A96B' : '#6E96B4' }} />
        ))}
      </div>
    );
  }

  if (kind === 'multiplication') {
    return null;
  }

  if (kind === 'remainder' || kind === 'division') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 12 }}>
        {[0, 1, 2].map((group) => (
          <span key={group} style={{ display: 'flex', gap: 3, padding: 6, border: '1.5px solid #9CBBD2', borderRadius: 9, background: '#FFFFFF' }}>
            {[0, 1, 2].map((dot) => <i key={dot} className="g3-model-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#6E96B4', transitionDelay: `${(group * 3 + dot) * .045}s` }} />)}
          </span>
        ))}
        {kind === 'remainder' && <span style={{ display: 'flex', gap: 3 }}>{[0, 1].map((dot) => <i key={dot} className="g3-model-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF9D78' }} />)}</span>}
      </div>
    );
  }

  if (kind === 'money') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 9 }}>
        {[1, 2, 3, 4].map((coin, i) => (
          <span key={coin} className="g3-context-group" style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#8A5B00', background: '#FFE39A', border: '2px solid #E9B949', fontSize: 18, animationDelay: `${i * .12}s` }}>₸</span>
        ))}
      </div>
    );
  }

  if (kind === 'temperature') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 12 }}>
        <span style={{ position: 'relative', width: 22, height: 58, borderRadius: 14, background: '#FFFFFF', border: '3px solid #9CBBD2' }}>
          <i className="g3-model-bar" style={{ position: 'absolute', left: 6, right: 6, bottom: 6, height: correct ? 42 : 24, borderRadius: 8, background: '#FF7657', transformOrigin: 'bottom' }} />
        </span>
        <span className="g3-context-group" style={{ color: '#145A86', fontSize: 24, fontWeight: 900 }}>°C</span>
      </div>
    );
  }

  if (kind === 'calendar') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 4 }}>
        {['D', 'S', 'C', 'P', 'J', 'S', 'Y'].map((day, i) => (
          <span key={`${day}-${i}`} className="g3-context-group" style={{ width: 28, height: 34, display: 'grid', placeItems: 'center', borderRadius: 7, color: i > 4 ? '#B9382F' : '#145A86', background: '#FFFFFF', border: '1.5px solid #9CBBD2', fontSize: 11, fontWeight: 900, animationDelay: `${i * .08}s` }}>{day}</span>
        ))}
      </div>
    );
  }

  if (kind === 'roman') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 7 }}>
        {['I', 'V', 'X'].map((symbol, i) => (
          <span key={symbol} className="g3-context-group" style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 10, color: '#145A86', background: '#FFFFFF', border: '2px solid #9CBBD2', fontFamily: 'serif', fontSize: 23, fontWeight: 900, animationDelay: `${i * .15}s` }}>{symbol}</span>
        ))}
      </div>
    );
  }

  if (kind === 'solid') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 14 }}>
        {['🧊', '🔺', '🔶'].map((shape, i) => <span key={shape} className="g3-context-group" style={{ fontSize: 34, animationDelay: `${i * .16}s` }}>{shape}</span>)}
      </div>
    );
  }

  if (kind === 'sequence') {
    const item = contextEmoji(text, spec);
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 8 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ display: 'contents' }}>
            <i className="g3-context-group" style={{ width: 28 + i * 4, height: 28 + i * 4, display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#145A86', background: '#FFFFFF', border: '2px solid #9CBBD2', fontStyle: 'normal', fontSize: item === '●' ? 12 : 17, animationDelay: `${i * .1}s` }}>{item}</i>
            {i < 4 && <b style={{ color: '#7FA6C2' }}>→</b>}
          </span>
        ))}
      </div>
    );
  }

  if (kind === 'operation') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 10 }}>
        {[0, 1].map((group) => (
          <span key={group} className="g3-model-cell" style={{ display: 'flex', gap: 4, padding: 8, border: '2px solid #9CBBD2', borderRadius: 11, background: '#FFFFFF', transform: correct ? `translateX(${group === 0 ? 5 : -5}px)` : 'none' }}>
            {[0, 1, 2].map((dot) => <i key={dot} style={{ width: 11, height: 11, borderRadius: '50%', background: group === 0 ? '#FFD166' : '#9EC5FF' }} />)}
          </span>
        ))}
        <b style={{ color: '#557087', fontSize: 22 }}>{correct ? '=' : '↔'}</b>
      </div>
    );
  }

  if (kind === 'compare') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 12 }}>
        <span className="g3-model-bar" style={{ width: 78, height: 18, borderRadius: 9, background: '#76A8CB', transform: 'scaleY(.7)' }} />
        <b style={{ color: correct ? '#1F7A4D' : '#557087', fontSize: 24 }}>{correct ? '✓' : '?'}</b>
        <span className="g3-model-bar" style={{ width: 54, height: 18, borderRadius: 9, background: '#76A8CB', transform: 'scaleY(.7)' }} />
      </div>
    );
  }

  if (kind === 'place') {
    return (
      <div className={cls} aria-hidden="true" style={common}>
        {['Y', "O'", 'B'].map((label, i) => (
          <span key={label} className="g3-model-cell" style={{ width: 52, height: 45, display: 'grid', placeItems: 'center', borderRadius: 9, border: '2px solid #9CBBD2', color: '#243447', background: '#FFFFFF', fontSize: 14, fontWeight: 900, transitionDelay: `${i * .1}s` }}>{label}</span>
        ))}
      </div>
    );
  }

  const item = contextEmoji(text, spec);
  if (kind === 'classify') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 18 }}>
        {[0, 1].map((group) => (
          <span key={group} className="g3-context-group" style={{ minWidth: 78, minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 7, borderRadius: 12, background: '#FFFFFF', border: '2px solid #9CBBD2', animationDelay: `${group * .18}s` }}>
            {[0, 1, 2].map((i) => <i key={i} className="g3-context-item" style={{ color: group ? '#FF7657' : '#145A86', fontStyle: 'normal', fontSize: item === '●' ? 15 : 19 }}>{item}</i>)}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={cls} aria-hidden="true" style={{ ...common, gap: 14 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="g3-context-group" style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', borderRadius: 14, color: '#145A86', background: '#FFFFFF', border: '2px solid #9CBBD2', fontSize: item === '●' ? 18 : 25, animationDelay: `${i * .16}s` }}>{item}</span>
      ))}
    </div>
  );
}

function Stage({ spec, text, status }) {
  const items = text.tiles || [];
  const correct = status === 'correct';
  const kind = sceneKind(spec, text);
  const hero = contextEmoji(text, spec);
  return (
    <div className="g3-practice-stage g3-question-context-item">
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[8, 19, 32, 47, 61, 74, 88].map((left, i) => (
          <i key={left} className="g3-practice-star" style={{ position: 'absolute', left: `${left}%`, top: `${12 + (i % 3) * 25}%`, width: 3, height: 3, borderRadius: '50%', background: '#76A8CB', opacity: .28, animationDelay: `${i * .3}s` }} />
        ))}
      </div>
      <div className="g3-practice-stage-inner">
        <div className="g3-context-group" aria-hidden="true" style={{ fontSize: 34 }}>{hero === '●' ? '✨' : hero}</div>
        {text.visual && <div className={`g3-practice-visual ${correct ? 'is-correct' : ''}`} style={{ color: correct ? '#1F7A4D' : '#145A86', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 28, fontWeight: 900, letterSpacing: '.02em' }}>{text.visual}</div>}
        {!spec.hideModel && <SemanticModel kind={kind} correct={correct} text={text} spec={spec} />}
        {items.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {items.map((item, i) => (
              <span key={`${item}-${i}`} style={{ padding: '7px 10px', borderRadius: 10, color: '#243447', background: '#FFFFFF', border: '1px solid #9CBBD2', fontWeight: 800 }}>{item}</span>
            ))}
          </div>
        )}
        {correct && <span className="g3-model-check" aria-hidden="true" style={{ position: 'absolute', right: 5, top: 3, width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#fff', background: COLORS.ok, fontSize: 19, fontWeight: 900 }}>✓</span>}
      </div>
    </div>
  );
}

function Feedback({ correct, children }) {
  return (
    <div className="g3-practice-pop g3-question-work-item" role="status" style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginTop: 8, padding: '10px 12px', borderRadius: 14, color: correct ? COLORS.ok : COLORS.no, background: correct ? COLORS.okSoft : COLORS.noSoft, fontSize: 14, fontWeight: 750, lineHeight: 1.4 }}>
      <span aria-hidden="true">{correct ? '✓' : '↗'}</span>
      <span>{children}</span>
    </div>
  );
}

function Rule({ children }) {
  return <div className="g3-practice-pop g3-question-work-item" style={{ marginTop: 6, padding: '8px 10px', border: '1.5px solid #FFD99A', borderRadius: 13, color: '#9A5200', background: '#FFF6E8', fontSize: 13, fontWeight: 800 }}>💡 {children}</div>;
}

function optionStyle({ active, status, correct, wrong }) {
  if (status === 'correct' && correct) return { ...STYLE.option, color: COLORS.ok, background: COLORS.okSoft, border: `2px solid ${COLORS.ok}`, cursor: 'default' };
  if (status === 'wrong' && wrong) return { ...STYLE.option, color: COLORS.no, background: COLORS.noSoft, border: `2px solid ${COLORS.no}` };
  if (active) return { ...STYLE.option, color: COLORS.ink, background: COLORS.accentSoft, border: `2px solid ${COLORS.accent}` };
  return STYLE.option;
}

export function seededOrder(length, seedText) {
  const order = Array.from({ length }, (_, i) => i);
  let state = 2166136261;
  const rawSeed = String(seedText || 'g3');
  const attemptMatch = rawSeed.match(/^(?:(.*):)?(-?\d+)$/);
  const source = attemptMatch ? (attemptMatch[1] || 'g3') : rawSeed;
  for (let i = 0; i < source.length; i += 1) {
    state ^= source.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  if (state === 0) state = 1;
  for (let i = length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  if (!attemptMatch || length < 2) return order;
  const attempt = Number(attemptMatch[2]);
  const offset = ((attempt % length) + length) % length;
  return order.slice(offset).concat(order.slice(0, offset));
}

function Choice({ spec, text, answer, setAnswer, locked, status, optionOrder }) {
  const order = optionOrder || text.options.map((_, i) => i);
  return (
    <div className="g3-answer-zone g3-question-work-item" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 9 }}>
      {order.map((originalIndex, displayIndex) => {
        const option = text.options[originalIndex];
        return (
          <button key={`${option}-${displayIndex}`} type="button" disabled={locked} onClick={() => setAnswer(originalIndex)}
            style={optionStyle({ active: answer === originalIndex, status, correct: originalIndex === spec.correct, wrong: answer === originalIndex && originalIndex !== spec.correct })}>
            {option}
          </button>
        );
      })}
    </div>
  );
}

function InputAnswer({ text, answer, setAnswer, locked, spec, status }) {
  const accepted = Array.isArray(spec.correct) ? spec.correct : [spec.correct];
  const numericAccepted = accepted
    .flatMap(inputAnswerVariants)
    .map(normalizePracticeAnswer)
    .filter((value) => /^\d+$/.test(value));
  const tapNumeric = numericAccepted.length > 0 && sceneKind(spec, text) !== 'equation';
  const maxDigits = Math.max(
    1,
    String(answer ?? '').length,
    ...numericAccepted.map((value) => value.length),
  );

  return (
    <div className="g3-answer-zone g3-numeric-answer-zone g3-question-work-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {tapNumeric ? (
        <LessonNumPad
          value={answer}
          setValue={setAnswer}
          disabled={locked}
          max={maxDigits}
          tone={status === 'correct' ? 'ok' : status === 'wrong' ? 'no' : 'idle'}
        />
      ) : (
        <label style={{ width: 'min(100%, 360px)' }}>
          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{text.ask}</span>
          <input value={answer} disabled={locked} inputMode={spec.inputMode || 'text'} placeholder={text.placeholder || '?'}
            onChange={(event) => setAnswer(event.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '15px', border: `2px solid ${status === 'correct' ? COLORS.ok : status === 'wrong' ? COLORS.no : COLORS.accent}`, borderRadius: 15, outline: 'none', textAlign: 'center', background: status === 'correct' ? COLORS.okSoft : status === 'wrong' ? COLORS.noSoft : '#fff', color: status === 'correct' ? COLORS.ok : status === 'wrong' ? COLORS.no : COLORS.ink, fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 25, fontWeight: 900 }} />
        </label>
      )}
    </div>
  );
}

function Multi({ text, answer, setAnswer, locked, correct, status, optionOrder }) {
  const toggle = (idx) => setAnswer(answer.includes(idx) ? answer.filter((v) => v !== idx) : [...answer, idx]);
  const order = optionOrder || text.options.map((_, i) => i);
  const compactOptions = text.options.every((option) => String(option).length <= 8);
  return (
    <div className={`g3-answer-zone g3-answer-multi g3-question-work-item${compactOptions ? ' is-compact' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 9 }}>
      {order.map((originalIndex) => {
        const option = text.options[originalIndex];
        return (
          <button key={`${option}-${originalIndex}`} type="button" disabled={locked} onClick={() => toggle(originalIndex)}
            style={optionStyle({ active: answer.includes(originalIndex), status, correct: correct.includes(originalIndex), wrong: answer.includes(originalIndex) && !correct.includes(originalIndex) })}>
            <span aria-hidden="true" style={{ marginRight: 7 }}>{answer.includes(originalIndex) ? '☑' : '□'}</span>{option}
          </button>
        );
      })}
    </div>
  );
}

function Order({ text, answer, setAnswer, locked, status, optionOrder }) {
  const order = optionOrder || text.options.map((_, i) => i);
  const available = order.filter((i) => !answer.includes(i));
  return (
    <div className="g3-answer-zone g3-question-work-item">
      <div style={{ minHeight: 62, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 7, marginBottom: 12, padding: 10, border: `2px dashed ${COLORS.line}`, borderRadius: 14, background: '#FAF9F6' }}>
        {answer.length === 0 && <span style={{ color: COLORS.muted }}>{text.orderHint}</span>}
        {answer.map((idx, position) => (
          <button key={idx} type="button" disabled={locked} onClick={() => setAnswer(answer.filter((v) => v !== idx))}
            style={{ padding: '9px 12px', border: `2px solid ${status === 'correct' ? COLORS.ok : status === 'wrong' ? COLORS.no : COLORS.accent}`, borderRadius: 11, color: status === 'correct' ? COLORS.ok : status === 'wrong' ? COLORS.no : COLORS.ink, background: status === 'correct' ? COLORS.okSoft : status === 'wrong' ? COLORS.noSoft : COLORS.accentSoft, fontWeight: 900, cursor: locked ? 'default' : 'pointer' }}>
            {position + 1}. {text.options[idx]}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
        {available.map((idx) => (
          <button key={idx} type="button" disabled={locked} onClick={() => setAnswer([...answer, idx])}
            style={{ ...STYLE.option, width: 'auto', minHeight: 48, padding: '9px 14px' }}>
            {text.options[idx]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function createPracticeQuestion(spec) {
  function PracticeQuestion(props) {
    const {
      lang = 'uz',
      mode = 'answer',
      initialAnswer = null,
      shuffleSeed = 0,
      playCorrect,
      playWrong,
      onReady,
      onDraft,
      registerCheck,
      registerNarration,
      onSubmit,
    } = props || {};
    const text = spec.text[lang] || spec.text.uz;
    const empty = spec.type === 'choice' ? null : spec.type === 'input' ? '' : [];
    const initial = initialAnswer?.studentAnswer?.value ?? initialAnswer?.studentAnswer?.idx ?? initialAnswer?.studentAnswer?.indices ?? empty;
    const [answer, setAnswer] = useState(initial);
    const [result, setResult] = useState(typeof initialAnswer?.correct === 'boolean' ? initialAnswer.correct : null);
    const [lastWrongAnswer, setLastWrongAnswer] = useState(null);
    const mobile = useMobilePracticeMode();
    const [mobileStep, setMobileStep] = useState('context');
    const status = result === true ? 'correct' : result === false ? 'wrong' : 'idle';
    const locked = result === true || mode === 'review';
    const copy = ACTION_COPY[lang] || ACTION_COPY.uz;
    const answerKey = JSON.stringify(answer);
    const optionOrder = ['choice', 'multi', 'order'].includes(spec.type) && text.options?.length
      ? seededOrder(text.options.length, `${spec.tag || 'q'}:${shuffleSeed}`)
      : null;
    const ready = useMemo(
      () => hasAnswer(spec, answer) && !locked && answerKey !== lastWrongAnswer,
      [answer, answerKey, lastWrongAnswer, locked],
    );

    const updateAnswer = useCallback((next) => {
      setAnswer((current) => (typeof next === 'function' ? next(current) : next));
      if (result === false) setResult(null);
    }, [result]);

    useEffect(() => {
      onReady?.(ready);
    }, [onReady, ready]);

    useEffect(() => {
      onDraft?.({ studentAnswer: answerForSubmit(spec, answer, text) });
    }, [answer, onDraft, text]);

    useEffect(() => {
      registerNarration?.(`${text.setup || ''}. ${text.ask || ''}`);
    }, [registerNarration, text.ask, text.setup]);

    const check = useCallback(() => {
      if (!hasAnswer(spec, answer) || locked || answerKey === lastWrongAnswer) return;
      const correct = isCorrectAnswer(spec, answer);
      setResult(correct);
      setLastWrongAnswer(correct ? null : answerKey);
      if (correct) playCorrect?.(); else playWrong?.();
      onSubmit?.({
        questionText: text.ask,
        options: (text.options || []).map((label, idx) => ({ id: String(idx), label })),
        studentAnswer: answerForSubmit(spec, answer, text),
        correctAnswer: correctForSubmit(spec, text),
        correct,
        meta: { tag: spec.tag, level: spec.level, interaction: spec.type, source: spec.source },
      });
    }, [answer, answerKey, lastWrongAnswer, locked, onSubmit, playCorrect, playWrong, text]);

    useRegisteredCheck(check, registerCheck);

    return (
      <>
        <style>{FX}</style>
        <div
          className={`g3-question-shell g3-question-${spec.type}${mobile ? ` g3-mobile-${mobileStep}` : ''}${result === true ? ' g3-result-correct' : result === false ? ' g3-result-wrong' : ''}`}
          data-g3-narration={`${text.setup || ''}. ${text.ask || ''}`}
        >
          <section className="g3-question-context-panel g3-question-context-item">
            <div style={STYLE.eyebrow}>{spec.level} {text.eyebrow}</div>
            <p className="g3-question-setup" style={STYLE.setup}>{text.setup}</p>
            <Stage spec={spec} text={text} status={status} />
            {mobile && mobileStep === 'context' && (
              <button
                type="button"
                className="g3-mobile-step-button"
                onClick={() => setMobileStep('answer')}
              >
                {lang === 'uz' ? 'Javob berish' : 'Ответить'}
              </button>
            )}
          </section>
          <section className="g3-question-work-panel g3-question-work-item">
            {mobile && mobileStep === 'answer' && (
              <button
                type="button"
                className="g3-mobile-back-button"
                onClick={() => setMobileStep('context')}
              >
                {lang === 'uz' ? '← Shartga qaytish' : '← Вернуться к условию'}
              </button>
            )}
            <div className="g3-question-ask-card" style={STYLE.askCard}>
              <span className="g3-question-ask-label" style={STYLE.askLabel}>❓ {copy.question}</span>
              <p style={STYLE.ask}>{text.ask}</p>
              <div className="g3-question-instruction" style={STYLE.instruction}>
                <span aria-hidden="true">{spec.type === 'input' ? '✍️' : spec.type === 'order' ? '1️⃣' : '☝️'}</span>
                <span>{actionCopy(spec, lang)}</span>
              </div>
            </div>
            {spec.type === 'choice' && <Choice spec={spec} text={text} answer={answer} setAnswer={updateAnswer} locked={locked} status={status} optionOrder={optionOrder} />}
            {spec.type === 'multi' && <Multi text={text} answer={answer} setAnswer={updateAnswer} locked={locked} correct={spec.correct} status={status} optionOrder={optionOrder} />}
            {spec.type === 'order' && <Order text={text} answer={answer} setAnswer={updateAnswer} locked={locked} status={status} optionOrder={optionOrder} />}
            {result !== null && <Feedback correct={result}>{result ? text.correct : copy.wrong}</Feedback>}
            {result === true && text.rule && <Rule>{text.rule}</Rule>}
          </section>
          {spec.type === 'input' && <InputAnswer spec={spec} text={text} answer={answer} setAnswer={updateAnswer} locked={locked} status={status} />}
        </div>
      </>
    );
  }

  PracticeQuestion.displayName = `Grade3Practice_${spec.tag}`;
  return PracticeQuestion;
}
