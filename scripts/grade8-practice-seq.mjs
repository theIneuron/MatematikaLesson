// ============================================================================
// 8-sinf amaliyoti: MEXANIKALARNING POZITSIYALARGA TAQSIMOTI (1-darsning
// o'nta mexanikasi, har darsda boshqa tartibda).
//
// NEGA ALOHIDA SKRIPT. `grade8-practice-layout.mjs` ESKI o'ntalikni biladi
// (`TypeExpr`, `SlotsBank`, `HoleSlider`, `NumberLine`, …) — u 3-6 darslar
// uchun yozilgan. 1, 2 va 7-darsdan boshlab amaliyot BOSHQA o'ntalikda
// ishlaydi (`DARS07_11_AMALIYOT_SKELET.md` §1), va taqsimot shartlari ham
// boshqa. Ikkisini bir faylga qo'shish o'sha faylning ma'nosini buzardi.
//
// SKRIPT IKKI ISH QILADI:
//   1) hujjatlarda yozilgan jadvalni TEKSHIRADI (`node ... check`)
//   2) yangi darslar uchun tartib IZLAYDI (`node ... find <birinchi> <soni>`)
//
// TAQSIMOT TASODIFIY EMAS: u backtracking bilan topilgan va jadvalga
// YOZILGAN. Qayta hisoblash emas, jadval — haqiqat manbai: amaliyot
// fayllari unga qarab yig'iladi.
//
// SHARTLAR (TIPLAR_AMALIYOT_8SINF.md §7):
//   1. 1-pozitsiyada boshqaruvi tushuntirishni talab qiladigan tip turmaydi
//      -> faqat A `Choice`, C `TrueFalse`, F `MarkAll`
//   2. og'ir boshqaruv (D, G, H, I, J) faqat 4-pozitsiyadan boshlab
//   3. har mexanika GURUH ichida har xil pozitsiyada turadi. 12-darsdan
//      boshlab guruh UCHTA darsdan yig'iladi va shart istisnosiz bajariladi;
//      7-11 da guruh beshta edi va 1-pozitsiya takrorlangan (u yerga faqat
//      uchta tip qo'yish mumkin)
//   4. hech bir tartib boshqa darsning tartibi bilan ustma-ust tushmaydi, va
//      undan kamida MIN_DIFF pozitsiyada farq qiladi; birinchi UCHTALIK ham
//      takrorlanmaydi (15-darsdan boshlab)
//   5. yonma-yon bir xil mexanika turmaydi — o'z-o'zidan bajariladi, chunki
//      har mexanika darsda bir marta ishlatiladi
//
// Ishga tushirish:
//   node scripts/grade8-practice-seq.mjs check
//   node scripts/grade8-practice-seq.mjs find 21 3
// ============================================================================

const M = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const NAME = {
  A: 'Choice', B: 'Zones', C: 'TrueFalse', D: 'PairSlots', E: 'TypeValue',
  F: 'MarkAll', G: 'CodeLock', H: 'ClozeBank', I: 'SwapOrder', J: 'MatchPairs',
};
const LIGHT1 = ['A', 'C', 'F'];   // 1-pozitsiyaga ruxsat etilgan
// Ikki tartib bir-biridan kamida shu qadar pozitsiyada farq qilishi kerak.
// NEGA. 'Ustma-ust tushmasin' degan shart o'z-o'zidan yetmaydi: 2026-08-24 da
// izlash 18-darsga 15-darsning tartibini bergan, faqat oxirgi ikki pozitsiya
// almashgan holda. Rasman boshqa tartib, amalda esa o'quvchi uchun O'SHA
// amaliyot. Oltita pozitsiya, va bundan tashqari BOSHLANISHI ham boshqa
// bo'lishi kerak: o'quvchi amaliyotni birinchi uch topshiriq bilan tanib
// oladi. 1-14 darslarda birinchi uchtaliklar takrorlangan (5 va 9 — CBF;
// 6, 10, 14 — FAC), bu tarix va tegilmaydi; 15-darsdan shart kuchda.
const MIN_DIFF = 6;
const diff = (a, b) => { let d = 0; for (let i = 0; i < 10; i += 1) if (a[i] !== b[i]) d += 1; return d; };
const HEAVY = new Set(['D', 'G', 'H', 'I', 'J']);

// TASDIQLANGAN JADVAL. 1-6 — `DARS02_06_AMALIYOT_SKELET.md`,
// 7-11 — `DARS07_11_AMALIYOT_SKELET.md` §3, 12-14 — `DARS12_14_AMALIYOT_SKELET.md` §1,
// 15-20 — `DARS15_20_AMALIYOT_SKELET.md` §1.
// DIQQAT: 3-6 darslar amalda hali ESKI o'ntalikda turadi (o'sha hujjatning
// §11 i), jadvaldagi qatorlar esa ko'chirishdan keyingi holat uchun.
export const SEQ = {
  1: 'ABCDEFGHIJ',
  2: 'CABEDFGJHI',
  3: 'FCEJBIADGH',
  4: 'AFCHGEBIJD',
  5: 'CBFIAJDHEG',
  6: 'FACDHBJGIE',
  7: 'FCBEJAHGDI',
  8: 'AFEDCJBHIG',
  9: 'CBFHAIEDGJ',
  10: 'FACGBHIJED',
  11: 'CEAJFDGIBH',
  12: 'CEBHDJIFAG',
  13: 'ABFCJHGDEI',
  14: 'FACGHBDEIJ',
  15: 'CFBJIDHEAG',
  16: 'AEFGHIDBCJ',
  17: 'FAEBGCIJDH',
  18: 'CBEFJAGIDH',
  19: 'FECHGIDABJ',
  20: 'ACFGDEIHJB',
};

// 1-6 GURUHI GURUH SHARTIDAN OZOD. Sabab tarixiy: «har mexanika guruh ichida
// har xil pozitsiyada» sharti 7-11 skeletida kiritilgan, 1-6 tartiblari esa
// undan oldin yozilgan (va 3-6 darslar amalda hali eski o'ntalikda turadi).
// Shuning uchun u guruh ma'lumot uchun tekshiriladi, nuqson deb sanalmaydi.
const LEGACY = new Set([1, 2, 3, 4, 5, 6]);

// Bir dars ichidagi shartlar.
function checkOne(n, s) {
  const bad = [];
  if (s.length !== 10 || new Set(s).size !== 10) bad.push('o\'nta mexanika bir marta bo\'lishi kerak');
  if (!LIGHT1.includes(s[0])) bad.push(`1-pozitsiyada ${s[0]} (${NAME[s[0]]}) — boshqaruv tushuntirishni talab qiladi`);
  for (let i = 0; i < 3; i += 1) if (HEAVY.has(s[i])) bad.push(`${i + 1}-pozitsiyada og'ir tip ${s[i]}`);
  return bad;
}

// Bir GURUH (masalan 12-14) ichidagi shartlar.
function checkGroup(nums) {
  const bad = [];
  const rows = nums.map((n) => SEQ[n]);
  for (const m of M) {
    const pos = nums.map((n, i) => rows[i].indexOf(m) + 1);
    const dup = pos.filter((p, i) => pos.indexOf(p) !== i);
    const hard = dup.filter((p) => p !== 1);
    if (hard.length) bad.push(`${m} (${NAME[m]}) ${hard[0]}-pozitsiyada ikki marta`);
  }
  const seen = new Map();
  for (const [n, s] of Object.entries(SEQ)) {
    if (seen.has(s)) bad.push(`${n} va ${seen.get(s)}-darslarning tartibi bir xil`);
    seen.set(s, n);
  }
  return { bad, rows };
}

// JUFT-JUFT shartlar: ikki tartib bir-biridan yetarlicha uzoqmi va
// boshlanishi boshqacha-mi. 15-darsdan boshlab kuchda; ikki dars ham 14 dan
// kichik bo'lgan juftlik ma'lumot uchun ko'rsatiladi, nuqson sanalmaydi.
function checkPairs() {
  const nums = Object.keys(SEQ).map(Number).sort((a, b) => a - b);
  const soft = [];
  const hard = [];
  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      const [a, b] = [nums[i], nums[j]];
      const legacy = a <= 14 && b <= 14;
      const d = diff(SEQ[a], SEQ[b]);
      if (d < MIN_DIFF) (legacy ? soft : hard).push(`${a} va ${b}: faqat ${d} pozitsiyada farq qiladi (kamida ${MIN_DIFF} kerak)`);
      if (SEQ[a].slice(0, 3) === SEQ[b].slice(0, 3)) (legacy ? soft : hard).push(`${a} va ${b}: birinchi uchtalik bir xil (${SEQ[a].slice(0, 3)})`);
    }
  }
  return { soft, hard };
}

function check() {
  let fails = 0;
  for (const [n, s] of Object.entries(SEQ)) {
    const bad = checkOne(n, s);
    if (bad.length) { fails += bad.length; bad.forEach((b) => console.log(`  XATO ${n}-dars: ${b}`)); }
  }
  const groups = [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11], [12, 13, 14], [15, 16, 17], [18, 19, 20]];
  for (const g of groups) {
    const { bad } = checkGroup(g);
    const tag = `${g[0]}-${g[g.length - 1]} guruhi`;
    const legacy = LEGACY.has(g[0]);
    if (bad.length) {
      if (!legacy) fails += bad.length;
      bad.forEach((b) => console.log(`  ${legacy ? 'ESKI' : 'XATO'} ${tag}: ${b}`));
    } else console.log(`  ${tag}: toza`);
  }
  const { soft, hard } = checkPairs();
  hard.forEach((b) => { fails += 1; console.log(`  XATO juftlik: ${b}`); });
  soft.forEach((b) => console.log(`  ESKI juftlik: ${b}`));
  if (!hard.length) console.log(`  juftliklar: toza (har tartib boshqasidan kamida ${MIN_DIFF} pozitsiyada farq qiladi, boshlanishi ham boshqa)`);
  // Ma'lumot uchun: birinchi va oxirgi pozitsiyalar guruh bo'yicha.
  for (const g of groups) {
    const last = g.map((n) => SEQ[n][9]);
    console.log(`  ${g[0]}-${g[g.length - 1]}: 1-poz ${g.map((n) => SEQ[n][0]).join(' ')} | 10-poz ${last.join(' ')}${new Set(last).size === g.length ? '' : ' (takror bor)'}`);
  }
  console.log(fails ? `\n${fails} ta nuqson` : '\nHamma shart bajarildi.');
  return fails;
}

// Yangi guruh uchun izlash: QATOR-QATOR backtracking.
//
// NEGA USTUN-USTUN EMAS. Birinchi tahrir ustunlar bo'yicha yurgan va hamma
// shartni oxirida — o'nta pozitsiya to'lgandan keyin — tekshirgan edi. Shartlar
// kuchaygach (MIN_DIFF, head3) izlash amalda to'xtab qoldi: qidiruv daraxti
// kesilmagan holda o'sardi. Endi har QATOR to'liq tanlanadi va shartlar shu
// yerda, har pozitsiyada tekshiriladi — daraxt boshidan kesiladi.
function find(first, count) {
  const prevRows = Object.entries(SEQ).filter(([n]) => Number(n) < first).map(([, s]) => s);
  let seed = 20260824;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const shuf = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i -= 1) { const j = Math.floor(rnd() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; };
  const chosen = [];

  // Guruh ichida har mexanika har xil pozitsiyada turadi. Bu «ikki qator
  // hech bir pozitsiyada ustma-ust tushmaydi» degani, ya'ni ular o'nta
  // pozitsiyaning HAMMASIDA farq qiladi. Shu sababli guruh uchtadan
  // yig'iladi: 1-3 pozitsiyalarga faqat A, C, F va B, E qo'yish mumkin, ya'ni
  // to'rt yoki besh darsli guruhda bu shart bajarilmay qoladi.
  const rowOk = (row, upto) => {
    for (const r of chosen) for (let i = 0; i < upto; i += 1) if (r[i] === row[i]) return false;
    if (upto >= 3) {
      const h = row.slice(0, 3).join('');
      for (const q of prevRows) if (q.slice(0, 3) === h) return false;
      for (const r of chosen) if (r.slice(0, 3).join('') === h) return false;
    }
    return true;
  };

  // Bitta qator uchun nomzod: pozitsiyalar bo'yicha DFS, har qadamda kesish.
  const buildRow = (row, used) => {
    const pos = row.length + 1;
    if (pos === 11) return row.slice();   // MIN_DIFF ni `rowFar` tekshiradi
    for (const m of shuf(M)) {
      if (used.has(m)) continue;
      if (pos <= 3 && HEAVY.has(m)) continue;
      if (pos === 1 && !LIGHT1.includes(m)) continue;
      row.push(m); used.add(m);
      if (rowOk(row, row.length)) {
        const got = buildRow(row, used);
        if (got) { row.pop(); used.delete(m); return got; }
      }
      row.pop(); used.delete(m);
    }
    return null;
  };

  // MIN_DIFF ni har qator uchun ALOHIDA tekshirish kerak: yuqoridagi
  // `buildRow` ning oxirgi bosqichi shuni qiladi, lekin u «hammasi bilan»
  // solishtirishi kerak, «birortasi bilan» emas.
  const rowFar = (row) => {
    const s = row.join('');
    for (const q of prevRows.concat(chosen.map((r) => r.join('')))) if (diff(s, q) < MIN_DIFF) return false;
    return true;
  };
  const nextRow = () => {
    for (let t = 0; t < 20000; t += 1) {
      const row = buildRow([], new Set());
      if (!row) return null;
      if (rowFar(row)) return row;
    }
    return null;
  };

  for (let i = 0; i < count; i += 1) {
    const row = nextRow();
    if (!row) { console.log('topilmadi'); return; }
    chosen.push(row);
  }
  chosen.forEach((r, i) => console.log(`| **${first + i}** | ${r.join(' | ')} |`));
}

// CLI faqat TO'G'RIDAN-TO'G'RI chaqirilganda ishlaydi: `SEQ` ni import qilgan
// boshqa skript tekshiruvni qaytadan o'tkazib yubormasin.
if (process.argv[1] && process.argv[1].endsWith('grade8-practice-seq.mjs')) {
  const [cmd, a, b] = process.argv.slice(2);
  if (cmd === 'find') find(Number(a), Number(b || 5));
  else process.exit(check() ? 1 : 0);
}
