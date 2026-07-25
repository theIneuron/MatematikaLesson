export const isGrade3Explanation = (meta) =>
  meta?.type === 'exploration' || meta?.type === 'rule';

export const grade3AudioLabels = (lang, muted) => ({
  sound: muted
    ? (lang === 'uz' ? 'Ovozni yoqish' : 'Включить звук')
    : (lang === 'uz' ? "Ovozni o'chirish" : 'Выключить звук'),
  replay: lang === 'uz' ? 'Ovozni qayta eshitish' : 'Повторить озвучку',
});
