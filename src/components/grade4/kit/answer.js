// Javob payloadining yagona shakli.
//
// Alohida modul, chunki bir nechta mexanika fayli (inputs.jsx, pickers.jsx)
// undan foydalanadi. Har birida nusxa turganda audit paketi identifikatorni
// ikki marta e'lon qilib parse xatosi bergan edi (CLAUDE.md §5).
export const makeAnswer = ({
  screen, meta, question, options, correctIndex, picked, right, firstTry, attempts,
}) => ({
  stage: meta.scope,
  screenIdx: screen,
  question,
  options,
  correctIndex,
  correctAnswer: options[correctIndex],
  studentAnswerIndex: picked,
  studentAnswer: options[picked] ?? String(picked),
  correct: right,
  firstTry,
  attempts,
  solved: right,
});
