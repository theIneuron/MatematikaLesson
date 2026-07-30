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

/** Deterministic shuffle of indices 0..n-1. Same seed → same order (stable within a lesson screen). */
export const seededIndexOrder = (length, seed) => {
  const order = Array.from({ length }, (_, i) => i);
  let state = Math.abs(Number(seed) || 1) >>> 0;
  if (state === 0) state = 1;
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
