// grade3-keep-last-round.mjs — `grade3-keep-last-question.mjs` ning uchinchi qismi.
// Bu skript RAUND ekranlarini tuzatadi (`round` + `val`/`bins` holati): terish raundlari,
// ustun mashqi, raqamlarni xonalarga ajratish (metodist skrinshotidagi Dars01 s9 «4 / 4»)
// va son yig'ish (Dars01 s8). U yerda ham javobdan keyin butun blok yechilib, ekranda faqat
// natija boksi qolardi.
//
// Metodist qoidasi 2026-08-05: oxirgi savol EKRANDA QOLADI (javobi bilan), natija boksi esa
// uning ostida yumshoq (`reveal-soft`) chiqadi. Qaytib kelganda ham oxirgi savol ko'rinadi.
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('src/components/grade3');
const read = (f) => fs.readFileSync(path.join(DIR, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(DIR, f), s, 'utf8');
const must = (src, needle, where) => { if (!src.includes(needle)) throw new Error(`${where}: topilmadi -> ${needle.slice(0, 70)}`); };
const one = (src, needle, where) => {
  const n = src.split(needle).length - 1;
  if (n !== 1) throw new Error(`${where}: ${n} marta uchradi (1 kutilgan) -> ${needle.slice(0, 60)}`);
};

// komponentni faqat o'z chegarasida oladi (faylda bir xil nomli holatlar ko'p)
const sliceComponent = (whole, anchor, where) => {
  one(whole, anchor, where);
  const a = whole.indexOf(anchor);
  const nl = whole.indexOf('\nconst ', whole.indexOf('</Stage>', a));
  if (nl < 0) throw new Error(`${where}: komponent oxiri topilmadi`);
  return { head: whole.slice(0, a), body: whole.slice(a, nl), tail: whole.slice(nl) };
};

let changed = 0;

// ---- 1) «round + val + checked» shakli: Dars02 s9, Dars03 s8, Dars07 ColumnPractice ----
for (const [file, delay] of [['Dars02.jsx', '1000'], ['Dars03.jsx', '1000'], ['Dars07.jsx', '1100']]) {
  const whole = read(file);
  const where = `${file} (round+val)`;
  if (whole.includes('if (round + 1 < items.length) setVal')) { console.log(`${file}: allaqachon tuzatilgan`); continue; }
  // faqat SHU komponent ichida ishlaymiz (faylda boshqa `val` li ekranlar ham bor)
  const anchor = 'const [round, setRound] = useState(props.storedAnswer ? items.length : 0);';
  one(whole, anchor, where);
  const a = whole.indexOf(anchor);
  const nl = whole.indexOf('\nconst ', whole.indexOf('</Stage>', a));
  if (nl < 0) throw new Error(`${where}: komponent oxiri topilmadi`);
  const head = whole.slice(0, a), tail = whole.slice(nl);
  let src = whole.slice(a, nl);
  must(src, '{!done && (', where);
  one(src, `if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); setVal(''); setRound((r) => r + 1); }, ${delay});`, where);

  src = src.replace(
    `if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); setVal(''); setRound((r) => r + 1); }, ${delay});`,
    `if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); if (round + 1 < items.length) setVal(''); setRound((r) => r + 1); }, ${delay});`
  );
  // oxirgi javob maydonda qolsin; qaytib kelganda ham ko'rinsin
  one(src, "const [val, setVal] = useState('');", where);
  src = src.replace("const [val, setVal] = useState('');",
    "const [val, setVal] = useState(props.storedAnswer ? String(items[items.length - 1].ans) : '');");
  // savol bloki done bo'lganda ham render bo'ladi
  one(src, '{!done && (', where);
  src = src.replace('{!done && (', '{it && (');
  src = src.split('>{round + 1} / {items.length}<').join('>{Math.min(round + 1, items.length)} / {items.length}<');
  // kirish o'chadi
  src = src.replace('<NumPad value={val} setValue={setVal} disabled={!canAct || checked}',
    '<NumPad value={val} setValue={setVal} disabled={!canAct || checked || done}');
  src = src.replace("disabled={!canAct || checked || val === ''}", "disabled={!canAct || checked || done || val === ''}");
  src = src.replace('{done && (\n          <div className="frame-success fade-up">', '{done && (\n          <div className="frame-success reveal-soft">');
  write(file, head + src + tail); changed += 1; console.log(`${file}: raund ekrani tuzatildi`);
}

// ---- 2) Dars01 s8 — SON YIG'ISH (h/tn/o konsoli) ----
{
  const file = 'Dars01.jsx';
  const where = `${file} s8 (son yig'ish)`;
  const w8 = sliceComponent(read(file), 'const [round, setRound] = useState(props.storedAnswer ? S8_TARGETS.length : 0);', where);
  let src = w8.body;
  if (!src.includes('if (round + 1 < S8_TARGETS.length)')) {
    one(src, 'if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); setH(0); setTn(0); setO(0); setRound((r) => r + 1); }, 950);', where);
    src = src.replace(
      'if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); setH(0); setTn(0); setO(0); setRound((r) => r + 1); }, 950);',
      'if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); if (round + 1 < S8_TARGETS.length) { setH(0); setTn(0); setO(0); } setRound((r) => r + 1); }, 950);'
    );
    // qaytib kelganda oxirgi son yig'ilgan holda ko'rinadi
    const LAST = 'S8_TARGETS[S8_TARGETS.length - 1]';
    one(src, '  const [h, setH] = useState(0);\n  const [tn, setTn] = useState(0);\n  const [o, setO] = useState(0);', where);
    src = src.replace('  const [h, setH] = useState(0);\n  const [tn, setTn] = useState(0);\n  const [o, setO] = useState(0);',
      `  const [h, setH] = useState(props.storedAnswer ? Math.floor(${LAST} / 100) : 0);\n` +
      `  const [tn, setTn] = useState(props.storedAnswer ? Math.floor((${LAST} % 100) / 10) : 0);\n` +
      `  const [o, setO] = useState(props.storedAnswer ? ${LAST} % 10 : 0);`);
    one(src, '        {!done && (\n          <>\n            <div className="mono fade-up" style={{ textAlign: \'center\', color: T.accent, fontWeight: 800 }}>{round + 1} / {S8_TARGETS.length}</div>', where);
    src = src.replace('        {!done && (\n          <>\n            <div className="mono fade-up" style={{ textAlign: \'center\', color: T.accent, fontWeight: 800 }}>{round + 1} / {S8_TARGETS.length}</div>',
      '        {target !== undefined && (\n          <>\n            <div className="mono fade-up" style={{ textAlign: \'center\', color: T.accent, fontWeight: 800 }}>{Math.min(round + 1, S8_TARGETS.length)} / {S8_TARGETS.length}</div>');
    src = src.replace('<RazryadConsole vals={{ h, t: tn, o }} labels={labels} onStep={step} disabled={checked}/>',
      '<RazryadConsole vals={{ h, t: tn, o }} labels={labels} onStep={step} disabled={checked || done}/>');
    src = src.replace('<BigNum v={built} accent={checked && correct}/>\n              <button className="btn-white-accent" disabled={!canAct || checked} onClick={check}>{t(c.check_label)}</button>',
      '<BigNum v={built} accent={(checked && correct) || done}/>\n              <button className="btn-white-accent" disabled={!canAct || checked || done} onClick={check}>{t(c.check_label)}</button>');
    src = src.replace('        {done && (\n          <div className="frame-success fade-up">\n            <Reaction state="correct" praise={`${S8_TARGETS.length} / ${S8_TARGETS.length}`}/>',
      '        {done && (\n          <div className="frame-success reveal-soft">\n            <Reaction state="correct" praise={`${S8_TARGETS.length} / ${S8_TARGETS.length}`}/>');
    write(file, w8.head + src + w8.tail); changed += 1; console.log(`${file}: s8 (son yig'ish) tuzatildi`);
  }

  // ---- 3) Dars01 s9 — RAQAMLARNI XONALARGA AJRATISH (metodist skrinshoti) ----
  const w9 = `${file} s9 (tasniflash)`;
  const c9 = sliceComponent(read(file), 'const [round, setRound] = useState(props.storedAnswer ? S9_NUMS.length : 0);', w9);
  src = c9.body;
  if (!src.includes('if (round + 1 < S9_NUMS.length)')) {
    one(src, "if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); setBins({ h: null, t: null, o: null }); setSel(null); setRound((r) => r + 1); }, 1100); }", w9);
    src = src.replace(
      "if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); setBins({ h: null, t: null, o: null }); setSel(null); setRound((r) => r + 1); }, 1100); }",
      "if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); if (round + 1 < S9_NUMS.length) setBins({ h: null, t: null, o: null }); setSel(null); setRound((r) => r + 1); }, 1100); }"
    );
    // qaytib kelganda oxirgi son xonalarga joylangan holda (indekslar: 0=yuzlik, 1=o'nlik, 2=birlik)
    one(src, "const [bins, setBins] = useState({ h: null, t: null, o: null });", w9);
    src = src.replace("const [bins, setBins] = useState({ h: null, t: null, o: null });",
      "const [bins, setBins] = useState(props.storedAnswer ? { h: 0, t: 1, o: 2 } : { h: null, t: null, o: null });");
    one(src, "{!done && phase === 'play' && (", w9);
    src = src.replace("{!done && phase === 'play' && (", "{phase === 'play' && (");
    src = src.split('>{round + 1} / {S9_NUMS.length}<').join('>{Math.min(round + 1, S9_NUMS.length)} / {S9_NUMS.length}<');
    src = src.replace('disabled={!canAct || checked || flyingIdx !== null}', 'disabled={!canAct || checked || done || flyingIdx !== null}');
    src = src.replace('        {done && (\n          <div className="frame-success fade-up">\n            <Reaction state="correct" praise={`${S9_NUMS.length} / ${S9_NUMS.length}`}/>',
      '        {done && (\n          <div className="frame-success reveal-soft">\n            <Reaction state="correct" praise={`${S9_NUMS.length} / ${S9_NUMS.length}`}/>');
    // qolgan chalg'ituvchi chiplar done bo'lganda YASHIRINADI (faqat son va to'ldirilgan xonalar qoladi)
    src = src.replace('.map(([d, i]) => !usedIdx.has(i) && flyingIdx !== i && (', '.map(([d, i]) => !done && !usedIdx.has(i) && flyingIdx !== i && (');
    write(file, c9.head + src + c9.tail); changed += 1; console.log(`${file}: s9 (tasniflash) tuzatildi`);
  }
}

console.log(`\nJami tuzatish: ${changed}`);
