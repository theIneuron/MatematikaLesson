export const isGrade3Explanation = (meta) =>
  meta?.type === 'exploration' || meta?.type === 'rule';

export const grade3AudioLabels = (lang, muted) => ({
  sound: muted
    ? (lang === 'uz' ? 'Ovozni yoqish' : 'Включить звук')
    : (lang === 'uz' ? "Ovozni o'chirish" : 'Выключить звук'),
  mute: muted
    ? (lang === 'uz' ? 'Ovozni yoqish' : 'Включить звук')
    : (lang === 'uz' ? "Ovozni o'chirish" : 'Выключить звук'),
  replay: lang === 'uz' ? 'Ovozni qayta eshitish' : 'Повторить озвучку',
});

export const restoreGrade3LessonIndex = (savedIndex, screenCount) =>
  Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < screenCount
    ? savedIndex
    : 0;

export const restoreGrade3LessonLanguage = (savedLanguage) =>
  savedLanguage === 'ru' ? 'ru' : 'uz';

/** Fresh for each mounted lesson shell; stable for the lifetime of that mount. */
export const createGrade3RunSeed = () => {
  const randomValues = new Uint32Array(2);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(randomValues);
  } else {
    randomValues[0] = Math.floor(Math.random() * 0x100000000);
    randomValues[1] = Math.floor(Math.random() * 0x100000000);
  }
  return `${Date.now().toString(36)}:${randomValues[0].toString(36)}:${randomValues[1].toString(36)}`;
};

/**
 * Stable 32-bit FNV-1a hash with an avalanche pass.
 * String lesson/screen identifiers must not collapse to the same numeric seed.
 */
const stableSeed = (seed) => {
  if (typeof seed === 'number' && Number.isFinite(seed)) {
    return (Math.abs(Math.trunc(seed)) >>> 0) || 1;
  }

  const value = String(seed ?? '');
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b);
  hash ^= hash >>> 16;
  return (hash >>> 0) || 1;
};

/** Deterministic shuffle of indices 0..n-1. Same seed → same order (stable within a lesson screen). */
export const seededIndexOrder = (length, seed) => {
  const order = Array.from({ length }, (_, i) => i);
  let state = stableSeed(seed);
  for (let i = length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  return order;
};

/** Remap MC options + per-option wrong/hint keys to a new display order. */
export const remapMcOrder = (content, options, correctIdx, order) => {
  const next = { ...(content || {}) };
  order.forEach((oldI, newI) => {
    next[`wrong_${newI}`] = content?.[`wrong_${oldI}`];
    next[`hint_${newI}`] = content?.[`hint_${oldI}`];
    next[`audio_hint_${newI}`] = content?.[`audio_hint_${oldI}`];
  });
  return {
    options: order.map((i) => options[i]),
    correctIdx: order.indexOf(correctIdx),
    content: next,
  };
};
