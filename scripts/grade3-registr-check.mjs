// grade3-registr-check.mjs — обращение к ученику: узбекский на «siz», русский на «ты».
//
// Правило методиста (в CLAUDE.md §1 и в памяти проекта): родители в Узбекистане чувствительны
// к тону, поэтому в UZ формальное «siz», а в RU дружеское «ты» и прошедшее время без
// привязки к полу. 2026-08-10 методист сказал, что в этом месте есть ошибки.
//
// Ищем в UZ строках формы на «sen»:
//   - местоимения sen / sening / senga / seni / senda / sendan / sen'ga;
//   - повелительное наклонение без -ng/-ing: «tanla», «bos», «ter», «qara», «sana»…
//     (у формы на siz это «tanlang», «bosing», «tering», «qarang», «sanang»);
//   - притяжательное 2 л. ед. ч.: «javobing», «ishing» вместо «javobingiz».
// В RU строках ищем обращение на «вы»: «вы», «вам», «ваш», «введите», «нажмите», «посмотрите».
//
// Запуск: node scripts/grade3-registr-check.mjs [файл … | --dir src/components/grade3]
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const DIR = (() => { const i = args.indexOf('--dir'); return i >= 0 ? args[i + 1] : 'src/components/grade3'; })();
const files = args.length && !args[0].startsWith('--')
  ? args
  : fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort().map((f) => path.join(DIR, f));

// «sen» и его падежи. Слово целиком, чтобы не ловить «sentabr», «sensor».
const SEN = /\b(sen|sening|senga|seni|senda|sendan|sensiz)\b/i;
// Повелительные глаголы уроков. Беда в том, что «ayir», «qo'sh», «bo'l», «sana» живут и как
// части речи счёта («besh ayir bir» — пять минус один, «10-sana» — дата). Поэтому команду
// узнаём по МЕСТУ: голая основа стоит в КОНЦЕ предложения. «Ustunda ayir.» — команда,
// «besh ayir bir bu to'rt» — нет.
const IMP = ["tanla", "bos", "ter", "qara", "sana", "top", "yoz", "ayt", "hisobla", "solishtir",
  "qo'sh", "ayir", "bo'l", "ko'paytir", "tekshir", "belgila", "joyla", "sur", "yech", "esla",
  "o'qi", "unutma", "yaxlitla", "taqqosla", "kirit", "boshla", "sanab chiq", "eslab qol"];

const RU_VY = /\b(вы|вам|вас|ваш\w*|введите|нажмите|посмотрите|выберите|наберите|сравните|решите|попробуйте|запишите)\b/i;
// «вы» законно внутри слов и в цитатах героя — но обращение к ученику всегда с большой пользы
// не имеет; исключаем служебные совпадения вроде «выше», «выбор» ловит \b и так.

const CYR = /[А-Яа-яЁё]/;
let err = 0;
const rows = [];

const readObj = (src, decl) => {
  const a = src.indexOf(decl);
  if (a < 0) return null;
  const open = decl.trim().endsWith('[') ? '\n];' : '\n};';
  const b = src.indexOf(open, a);
  if (b < 0) return null;
  try { return eval(`(${src.slice(a + decl.length - 1, b + 2)})`); } catch { return null; }
};

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const name = path.basename(file);
  const blocks = ['const CONTENT = {', 'const LESSON_META = {', 'const SCREEN_META = [', 'const BRIDGES = {', 'const S14_PAYOFF = {']
    .map((d) => readObj(src, d)).filter(Boolean);
  if (!blocks.length) { rows.push(`${name}: данные не прочитаны`); err++; continue; }

  const walk = (node, p, lang) => {
    if (typeof node === 'string') {
      if (lang === 'uz') {
        if (SEN.test(node)) { rows.push(`${name} ${p} — узбекский на «sen»: «${node.slice(0, 70)}»`); err++; return; }
        // команда без -ng в конце предложения; перед основой только пробел или начало строки
        // (дефис отсекает «10-sana» — это дата, а не «посчитай»)
        for (const v of IMP) {
          // «o'qi» и «sana» — ещё и существительные (ось, дата). Команда узнаётся по дополнению
          // в винительном: «ekanini o'qi», «o'nliklarni sana». «Simmetriya o'qi» — ось.
          const needsObj = v === "o'qi" || v === 'sana';
          const head = needsObj ? '(^|\\s)\\S*ni\\s' : '(^|\\s)';
          const re = new RegExp(`${head}${v}([.!?:]|$)`, 'i');
          if (re.test(node)) {
            const siz = /[aeiou]$/i.test(v) ? `${v}ng` : `${v}ing`;
            rows.push(`${name} ${p} — команда на «sen» («${v}» вместо «${siz}»): «${node.slice(0, 70)}»`); err++; return;
          }
        }
      } else if (lang === 'ru' && CYR.test(node)) {
        const m = node.match(RU_VY);
        if (m) { rows.push(`${name} ${p} — русский на «вы» («${m[0]}»): «${node.slice(0, 70)}»`); err++; }
      }
      return;
    }
    if (!node || typeof node !== 'object') return;
    for (const [k, v] of Object.entries(node)) {
      const lg = k === 'uz' || k.endsWith('_uz') ? 'uz' : (k === 'ru' || k.endsWith('_ru') ? 'ru' : lang);
      walk(v, `${p}.${k}`, lg);
    }
  };
  blocks.forEach((b, i) => walk(b, ['CONTENT', 'LESSON_META', 'SCREEN_META', 'BRIDGES', 'S14_PAYOFF'][i] || 'block', null));
}

rows.forEach((r) => console.log(r));
console.log(err ? `\nнарушений регистра: ${err}` : `чисто: узбекский на «siz», русский на «ты» (уроков ${files.length})`);
process.exit(err ? 1 : 0);
