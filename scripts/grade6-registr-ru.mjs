import fs from 'node:fs';
const src = fs.readFileSync('src/components/grade6/Dars01.jsx', 'utf8');
// Обращение на «вы»: повелительное на -ите/-йте и местоимения.
const imper = /(^|[\s(«"'—.,!?:;])(нажмите|выберите|введите|двигайте|перетащите|соберите|найдите|посмотрите|проверьте|сравните|запомните|попробуйте|тяните|отметьте|укажите|расставьте|разложите|подберите|обратите|прочитайте|решите|составьте|выполните|начните|продолжите|смотрите|сделайте|возьмите|считайте|дайте|вы|вас|вам|ваш|ваша|ваше|ваши)(?=[\s.,!?:;)»"'—]|$)/i;
const seen = new Set();
const lines = src.split('\n');
lines.forEach((line, i) => {
  for (const m of line.matchAll(/(?:\bru:\s*|tri\(\s*lang\s*,\s*)('([^']*)'|"([^"]*)")/g)) {
    const txt = m[2] !== undefined ? m[2] : m[3];
    if (imper.test(txt) && !seen.has(txt)) { seen.add(txt); console.log(`${i + 1}: ${txt}`); }
  }
});
console.log(seen.size ? `\nвсего: ${seen.size}` : 'обращений на «вы» в русских строках нет');
