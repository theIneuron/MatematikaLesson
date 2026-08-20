// Ekran gate'ining yagona qoidasi: tushuntirish ovozi tugagach (yoki ovoz
// o'chirilgan bo'lsa) ekran ochiladi.
//
// Alohida modul, chunki bu funksiya `mechanics.jsx` va `inputs.jsx` ning
// ikkalasiga ham kerak. Har ikkovida nusxa turganda audit paketi uni ikki
// marta e'lon qilib parse xatosi bergan edi (CLAUDE.md §5).
export const explanationDone = (audio) => audio.muted || audio.completed;
