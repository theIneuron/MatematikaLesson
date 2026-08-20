import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// 4-sinf nazariy darslarining umumiy qobig'i (src/components/grade4/theoryShell).
//
// Auditlar har bir darsni yakka fayl deb tekshiradi va importlar ortiga
// qaramaydi. Kontrakt kodi (TTS URL, onFinished payloadi, 936px sahna, til
// validatsiyasi, javob gate'i) qobiqqa chiqarilgandan keyin ular "yo'q" deb
// hisoblab qolgan edi. Shu yordamchi dars matniga qobiq matnini qo'shib beradi
// — Grade4Finale.jsx uchun allaqachon shunday qilinadi.
// 11-20-darslar ko'rinish qatlamini `kit/` dan oladi, u esa ish qatlamini
// `theoryShell/` dan re-eksport qiladi. Shuning uchun kit ulangan bo'lsa
// ikkala papka ham qo'shiladi.
const SHELL_DIRS = ['theoryShell', 'kit'];

export async function withTheoryShellSource(source, grade4Dir) {
  const used = SHELL_DIRS.filter((name) => new RegExp(`from\\s+['"]\\./${name}/`).test(source));
  if (used.length === 0) return source;
  const dirs = used.includes('kit') ? SHELL_DIRS : used;
  // kit o'z ui.jsx, mechanics.jsx va styles.js sini beradi va theoryShell dagi
  // shu nomli fayllarni ALMASHTIRADI. Ikkalasi ham qo'shilsa, bir xil nom ikki
  // marta e'lon qilinadi va parser to'xtaydi.
  const superseded = new Set();
  if (used.includes('kit')) {
    try {
      for (const name of await readdir(path.join(grade4Dir, 'kit'))) superseded.add(name);
    } catch { /* kit yo'q — hech narsa almashtirilmaydi */ }
  }
  const parts = [];
  for (const dirName of dirs) {
    const dir = path.join(grade4Dir, dirName);
    let names;
    try {
      names = await readdir(dir);
    } catch {
      continue;
    }
    const files = names
      .filter((name) => /\.(jsx|js)$/.test(name))
      .filter((name) => dirName === 'kit' || !superseded.has(name))
      .sort();
    for (const name of files) {
      parts.push(await readFile(path.join(dir, name), 'utf8'));
    }
  }
  if (parts.length === 0) return source;
  // import va export yo'q qilinadi: qobiq bo'laklari bir-birini import qiladi
  // (masalan ui.jsx Bit.jsx dan BitSVG ni oladi), shuning uchun tozalanmasa
  // takroriy e'lon chiqadi. Bo'laklar blokka O'RALMAYDI — auditlar e'lonlarni
  // yuqori darajadagi AST tugunlari orasidan qidiradi.
  const inlined = parts.map((part) => part
    // `[^;]*?` muhim: `[\s\S]*?` bir necha import bayonotini birga yutib
    // yuborardi va keraksiz qatorlarni ham o'chirib tashlardi.
    .replace(/^import\s[^;]*?from\s+['"][^'"]+['"];[ \t]*$/gm, '')
    .replace(/^import\s+['"][^'"]+['"];[ \t]*$/gm, '')
    .replace(/^export\s*\{[^;{}]*\}\s*(?:from\s+['"][^'"]+['"])?;[ \t]*$/gm, '')
    .replace(/^export\s+default\s+/gm, 'const __shellDefault = ')
    .replace(/^export\s+(const|let|function|class)\b/gm, '$1'));
  // Darsning qobiqdan importi ham olib tashlanadi, aks holda import qilingan
  // nom bilan qobiqdagi e'lon to'qnashadi. Boshqa importlar joyida qoladi —
  // ular bo'yicha tekshiruvlar bor (masalan Grade4Finale).
  const lessonBody = source
    .replace(/^import\s[^;]*?from\s+['"]\.\/theoryShell\/[^'"]+['"];[ \t]*$/gm, '')
    .replace(/^import\s[^;]*?from\s+['"]\.\/kit\/[^'"]+['"];[ \t]*$/gm, '');
  return [lessonBody, ...inlined].join('\n');
}
