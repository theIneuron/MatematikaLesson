// grade9-lesson-audit.mjs — статическая проверка урока 9 класса по контракту
// `src/books/grade9/ETALON_9SINF_v2.md` (редакция 2, действующая). Первая редакция лежит
// рядом в `ETALON_9SINF.md` и остаётся как история: по ней собран пилотный урок 15, но
// нумерация пунктов в сообщениях ниже — по v2.
// Образец — `grade3-lesson-audit.mjs`: там эталон И ЕСТЬ скрипт, и это единственная схема,
// которая держится дольше месяца.
//
// Данные экранов (`const S1 … const S15`) и план урока (`const PLAN`) вырезаются из файла
// и читаются как настоящий JS — не угадываются регулярками. Поэтому у каждой строки известен
// её ПУТЬ: озвучка это или экранный текст, разбор неверного варианта или подпись кнопки.
//
// Что проверяется (§6.1 эталона):
//    1) 15 экранов: TOTAL = SCREENS = S1..S15 = PLAN
//    2) PLAN: роли в порядке §4.1, теги из словаря §7.4, цвет поля особых экранов
//    3) пороги режимов ответа §4.6: выбора не больше трёх, записи не меньше трёх,
//       ответ-множество выбором — только на экранах 1 и 14
//    4) экран роли `paper` не тянет ни один прибор; правило — на экране роли `rule`
//    5) оценивается только блиц: у остальных экранов onAnswer передаёт `tag`
//    6) три языка у каждого L(), UZ без кириллицы и с ASCII-апострофом
//    7) озвучка: цифр нет, запрещённых символов нет, кавычек и длинного тире нет
//    8) варианты: ровно 4, у каждого неверного непустой разбор
//    9) кнопки «показать ответ» нет нигде (§5.0)
//   10) термины §3: «числовая прямая» запрещена, только «числовая ось»
//   11) реестр: LESSON_ID, slug, номер и тема совпадают с src/lessons/grade9.js
//   12) import React на месте, механики в файле урока нет
//   13) freeNav: при --release обязан быть false (§6.3)
//
// Чего этот скрипт НЕ делает: прокрутка и обрезка внутри карточек меряются в браузере —
// `scripts/grade9-noscroll.mjs`, каждый шаг открытия, пять размеров, три языка.
//
// Запуск:
//   node scripts/grade9-lesson-audit.mjs src/components/grade9/Dars15.jsx
//   node scripts/grade9-lesson-audit.mjs src/components/grade9/Dars15.jsx --release
import fs from 'node:fs';

const argv = process.argv.slice(2);
const RELEASE = argv.includes('--release');
const file = argv.find((a) => !a.startsWith('--')) || 'src/components/grade9/Dars15.jsx';
const src = fs.readFileSync(file, 'utf8');

const out = { err: [], warn: [], info: [] };
const E = (m) => out.err.push(m);
const W = (m) => out.warn.push(m);
const I = (m) => out.info.push(m);

// Строка в файле по куску текста: сообщение обязано называть экран И строку.
// Две тонкости. Первая: в исходнике апостроф внутри одинарных кавычек экранирован
// (`o\'quvchi`), поэтому вычисленная строка в файле дословно не встречается — ищем
// самый длинный кусок без кавычек. Вторая: один и тот же текст бывает в двух местах
// (озвучка и подпись), поэтому ищем ВНУТРИ блока своего экрана.
const RANGE = {}; // n -> { from, to } смещения в src
const lineOf = (needle, n) => {
  if (!needle || typeof needle !== 'string') return 0;
  const r = (n && RANGE[n]) || { from: 0, to: src.length };
  const hay = src.slice(r.from, r.to);
  const cands = [needle.slice(0, 60)];
  const chunks = needle.split(/['"\\]/).filter((c) => c.trim().length >= 12).sort((a, b) => b.length - a.length);
  if (chunks[0]) cands.push(chunks[0].slice(0, 60));
  for (const c of cands) {
    const i = hay.indexOf(c);
    if (i >= 0) return src.slice(0, r.from + i).split('\n').length;
  }
  return 0;
};
const where = (n, needle) => {
  const l = lineOf(needle, n);
  return `экран ${n}${l ? `, строка ${l}` : ''}`;
};
const cut = (s) => String(s).replace(/\s+/g, ' ').slice(0, 70);

// ============================================================
// Контракт §4.1 и §7.4 — единственный источник истины для машины
// ============================================================
const ROLES = [
  'hook', 'support', 'explain1', 'explain2', 'explain3', 'explain4', 'explain5',
  'rule', 'drill', 'guided', 'paper', 'trap', 'transfer', 'blitz', 'summary',
];
const FIELD = { 1: 'cool', 8: 'accent', 15: 'ok' };       // §4.3, остальные — white
// §4.6. Режим ответа экрана. `pick` ставится ТОЛЬКО когда единственное действие ученика на
// экране — нажать один из четырёх вариантов. Выбор внутри фазы прибора (какое число
// подставить, какой корень поставить на ось, какую теорему взять) — это `drive`, а не
// `pick`: там ученик ведёт прибор, а не сдаёт ответ. От этого различения зависит порог
// «не больше трёх выборных экранов», поэтому оно записано здесь, рядом с проверкой.
const ANSWER = ['pick', 'build', 'type', 'drive', 'none'];
const TOOLS = ['SignAxis', 'ParabolaAxis', 'AxisStill', 'NumberAxis', 'LiveProduct'];

// §7.4. Словарь ЗАКРЫТ: тег берётся из §2 или из четырёх общих. Своих не изобретаем.
const TAGS = new Set([
  // Б1
  'vetvi-znak', 'odin-promezhutok', 'nul-vs-znachenie', 'a-otricatelnoe', 'sdvig-storona',
  // Б2
  'postoronniy-koren', 'sokratili-po-slagaemomu', 'zabyl-vtoroe', 'peresechenie-na-glaz',
  // Б3
  'delenie-bez-znaka', 'kratnyy-mnozhitel', 'granica-pri-strogom', 'nul-znamenatelya',
  'sistema-vs-sovokupnost',
  // Б4
  'chlen-vs-summa', 'an-kak-a1n', 'q-kak-raznost', 'q-ne-menshe-odnogo',
  // Б5
  'ishody-neravnovozmozhny', 'veroyatnost-bolshe-odnogo', 'chastota-vs-veroyatnost',
  'sin-bolshe-odnogo', 'sinus-summy', 'gradusy-i-radiany',
  // Б6
  'podobie-kak-raznost', 'svoystvo-vmesto-priznaka', 'izmeril-znachit-dokazal',
  'vektor-kak-otrezok', 'ploshchad-v-k-raz',
  // Б7
  'sinusov-ne-k-toy-konfiguracii', 'kosinusov-znak-plyus', 'ploshchad-ne-tot-ugol',
  'sinus-tupogo-otricatelen',
  // общие: ошибка работы, а не ошибка блока
  'support', 'bumaga', 'check', 'obratnoe',
]);

// ============================================================
// Вырезаем данные из файла и читаем их как настоящий JS
// ============================================================
const L = (uz, ru, en) => ({ uz, ru, en });
const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) });
const evalTop = (name, open, close) => {
  const head = `\nconst ${name} = ${open}`;
  const start = src.indexOf(head);
  if (start < 0) return null;
  const end = src.indexOf(`\n${close}\n`, start);
  if (end < 0) return null;
  const from = start + `\nconst ${name} = `.length;
  const to = end + 1 + close.length;
  const m = name.match(/^S(\d+)$/);
  if (m) RANGE[Number(m[1])] = { from, to };
  try {
    return new Function('L', 'A', `return (${src.slice(from, to)})`)(L, A);
  } catch (e) {
    E(`${name} не читается как JS: ${e.message}`);
    return null;
  }
};

const TOTAL = Number((src.match(/const TOTAL = (\d+)/) || [])[1]);
const screensArr = ((src.match(/const SCREENS = \[([\s\S]*?)\n\]/) || [, ''])[1].match(/Screen\d+/g) || []);
const S = {};
for (let n = 1; n <= 20; n += 1) {
  const obj = evalTop(`S${n}`, '{', '}');
  if (obj) S[n] = obj;
}
const nums = Object.keys(S).map(Number).sort((a, b) => a - b);
const PLAN = evalTop('PLAN', '[', ']');

// ---------- 1) число экранов ----------
if (TOTAL !== 15) E(`§4: в уроке должно быть ровно 15 экранов, TOTAL = ${TOTAL}`);
if (screensArr.length !== 15) E(`§4: массив SCREENS содержит ${screensArr.length} экранов вместо 15`);
if (nums.length !== 15) E(`§4: найдено ${nums.length} объектов данных S1..S15 (${nums.join(', ')})`);
if (TOTAL === 15 && screensArr.length === 15 && nums.length === 15) {
  I('экранов 15: TOTAL = SCREENS = S1..S15');
}

// ---------- 2) PLAN: роли, теги, цвет поля ----------
if (!PLAN) {
  E('§4.1: в файле урока нет плана `const PLAN = [ … ]` — пятнадцать строк вида '
    + "{ n, role, tag, field, answer, set }. Без него роль экрана проверить нечем");
} else {
  if (PLAN.length !== 15) E(`§4.1: в PLAN ${PLAN.length} строк вместо 15`);
  PLAN.forEach((p, i) => {
    const n = i + 1;
    if (p.n !== n) E(`§4.1: PLAN[${i}].n = ${p.n}, ожидался ${n}`);
    if (p.role !== ROLES[i]) E(`§4.1: ${where(n, p.role)} — роль "${p.role}", по эталону "${ROLES[i]}"`);
    const field = FIELD[n] || 'white';
    if (p.field !== field) E(`§4.3: экран ${n} — поле "${p.field}", по эталону "${field}"`);
    if (n === 1 || n === 15) {
      if (p.tag) E(`§4.2: экран ${n} тега не пишет, а объявлен "${p.tag}"`);
    } else if (!p.tag) {
      E(`§4.2: экран ${n} (${p.role}) не называет заблуждение — тега нет, в урок не берётся`);
    } else if (!TAGS.has(p.tag)) {
      E(`§7.4: экран ${n} — тег "${p.tag}" не из словаря §2, словарь закрыт`);
    }
    if (!ANSWER.includes(p.answer)) E(`§4.6: экран ${n} — режим ответа "${p.answer}", допустимы ${ANSWER.join(', ')}`);
  });

  // ---------- 3) пороги режимов ответа ----------
  const picks = PLAN.filter((p) => p.answer === 'pick');
  const writes = PLAN.filter((p) => p.answer === 'build' || p.answer === 'type');
  if (picks.length > 3) E(`§4.6: экранов с выбором из четырёх ${picks.length} (не больше трёх): ${picks.map((p) => p.n).join(', ')}`);
  if (writes.length < 3) E(`§4.6: экранов, где ответ записывает ученик, ${writes.length} (не меньше трёх)`);
  const badSet = PLAN.filter((p) => p.set && p.answer === 'pick' && p.n !== 1 && p.n !== 14);
  if (badSet.length) E(`§1 требование 1: ответ-множество сдаётся выбором на экранах ${badSet.map((p) => p.n).join(', ')} — оно собирается, а не выбирается`);
  if (!picks.length || !writes.length) W('§4.6: пороги посчитаны, но режимы ответа выглядят незаполненными');
  else I(`режимы ответа: выбор ${picks.length}, запись ${writes.length}, ведёт прибор ${PLAN.filter((p) => p.answer === 'drive').length}`);

  // ---------- 4) экран без прибора и место правила ----------
  const bodyOf = (n) => {
    const i = src.indexOf(`function Screen${n}(`);
    if (i < 0) return '';
    const j = src.indexOf('\nfunction ', i + 1);
    return src.slice(i, j < 0 ? src.length : j);
  };
  const paper = PLAN.find((p) => p.role === 'paper');
  if (paper) {
    const body = bodyOf(paper.n);
    const used = TOOLS.filter((t) => body.includes(t));
    if (used.length) E(`§4.1 и §5.0: экран ${paper.n} проходится БЕЗ прибора, а Screen${paper.n} использует ${used.join(', ')} (строка ${lineOf(`function Screen${paper.n}(`)})`);
    else I(`экран ${paper.n} проходится без прибора — проверено`);
  }
  const rule = PLAN.find((p) => p.role === 'rule');
  if (rule) {
    if (rule.n !== 8) E(`§4.1: правило обязано стоять на экране 8, объявлено на ${rule.n}`);
    if (!bodyOf(rule.n).includes('RuleGate')) E(`§5.2: правило на экране ${rule.n} обязано открываться только после верного ответа (RuleGate)`);
  }

  // ---------- 5) оценивается только блиц ----------
  const blitz = PLAN.find((p) => p.role === 'blitz');
  PLAN.forEach((p) => {
    if (p.n === 1 || p.n === 15 || (blitz && p.n === blitz.n)) return;
    const body = bodyOf(p.n);
    if (!body) return;
    if (body.includes('onAnswer(') && !/onAnswer\(\{[^}]*tag/.test(body)) {
      E(`§4.2: экран ${p.n} балла не даёт, он пишет тег — onAnswer должен передавать tag (строка ${lineOf(`function Screen${p.n}(`)})`);
    }
  });

  // ---------- поле особого экрана объявлено в разметке ----------
  [1, 8, 15].forEach((n) => {
    const body = bodyOf(n);
    if (body && !/field=/.test(body)) {
      E(`§4.3: экран ${n} — особый, его поле ${FIELD[n]}, но Frame не получает field= (строка ${lineOf(`function Screen${n}(`)})`);
    }
  });
}

// ---------- обход всех строк данных ----------
const strings = [];  // { n, path, lang, txt, spoken }
const optionSets = []; // { n, path, kind, items }

const isTri = (o) => {
  const k = Object.keys(o);
  return k.length === 3 && k.includes('uz') && k.includes('ru') && k.includes('en');
};

const walk = (node, n, path, spoken, parentKey) => {
  if (node === null || node === undefined) return;
  if (typeof node === 'string') { strings.push({ n, path: path.join('.'), lang: null, txt: node, spoken }); return; }
  if (typeof node !== 'object') return;
  if (typeof node === 'function') return;

  if (Array.isArray(node)) {
    if (parentKey === 'items' || parentKey === 'options' || parentKey === 'candidates') {
      optionSets.push({ n, path: path.join('.'), kind: parentKey, items: node });
    }
    if (parentKey === 'rows') optionSets.push({ n, path: path.join('.'), kind: 'rows', items: node });
    node.forEach((v, i) => walk(v, n, [...path, i], spoken, parentKey));
    return;
  }

  const keys = Object.keys(node);
  const some = ['uz', 'ru', 'en'].filter((k) => keys.includes(k));
  if (some.length && some.length < 3) {
    E(`§6: неполная тройка языков (есть ${some.join(', ')}) · ${where(n, String(node[some[0]]))} · ${path.join('.')}`);
    return;
  }
  if (isTri(node)) {
    ['uz', 'ru', 'en'].forEach((lang) => {
      const v = node[lang];
      if (typeof v !== 'string' || !v.trim()) {
        E(`§6: пустой ${lang.toUpperCase()} · ${where(n, String(node.ru || node.uz))} · ${path.join('.')}`);
        return;
      }
      strings.push({ n, path: path.join('.'), lang, txt: v, spoken });
    });
    return;
  }
  for (const k of keys) {
    if (typeof node[k] === 'function') continue;
    walk(node[k], n, [...path, k], spoken || k === 'audio', k);
  }
};
for (const n of nums) walk(S[n], n, [`S${n}`], false, null);

const spokenStr = strings.filter((s) => s.spoken && s.lang);
const screenStr = strings.filter((s) => !s.spoken && s.lang);
I(`строк с языком: озвучка ${spokenStr.length}, экранный текст ${screenStr.length}`);

// ---------- 7) гигиена озвучки ----------
const BAD_SYM = /[×÷=<>%$≠✗☐≤≥±]|—|────|\//;
// Кавычки перечислены кодами намеренно. ASCII `'` сюда не входит и войти не может:
// в узбекском это буква (`o'quvchi`), а не кавычка.
const QUOTES = /[\u00AB\u00BB\u201C\u201D\u201E\u0022]/;
for (const s of spokenStr) {
  const w = `${where(s.n, s.txt)} · ${s.path}.${s.lang}`;
  if (/\d/.test(s.txt)) E(`§7 озвучка: ЦИФРА, всё словами · ${w}: ${cut(s.txt)}`);
  if (BAD_SYM.test(s.txt)) E(`§7 озвучка: ЗАПРЕЩЁННЫЙ СИМВОЛ · ${w}: ${cut(s.txt)}`);
  if (QUOTES.test(s.txt)) E(`§7 озвучка: КАВЫЧКА · ${w}: ${cut(s.txt)}`);
  if (/\S:\s/.test(s.txt)) W(`§7 озвучка: двоеточие перед перечислением · ${w}: ${cut(s.txt)}`);
}
// мост: каждый экран со 2-го по 15-й начинается с аудиофразы на mount
for (const n of nums) {
  if (n === 1) continue;
  const a = S[n] && S[n].audio;
  if (!Array.isArray(a) || !a.length) { E(`§7: у экрана ${n} нет озвучки`); continue; }
  if (a[0].on !== 'mount') E(`§7: экран ${n} обязан начинаться с аудиофразы-моста (первый кусок on: 'mount', сейчас '${a[0].on}')`);
}

// ---------- 6) гигиена UZ и EN ----------
// Разрешён ровно один апостроф — ASCII U+0027. Запрещены модификаторы и типографские.
const BAD_APOS = /[ʻʼ‘’`´]/;
for (const s of strings.filter((x) => x.lang === 'uz')) {
  const w = `${where(s.n, s.txt)} · ${s.path}`;
  if (/[А-Яа-яЁё]/.test(s.txt)) E(`§7: КИРИЛЛИЦА в UZ · ${w}: ${cut(s.txt)}`);
  if (BAD_APOS.test(s.txt)) E(`§7: апостроф не ASCII в UZ · ${w}: ${cut(s.txt)}`);
}
for (const s of strings.filter((x) => x.lang === 'en')) {
  if (/[А-Яа-яЁё]/.test(s.txt)) E(`§7: КИРИЛЛИЦА в EN · ${where(s.n, s.txt)} · ${s.path}: ${cut(s.txt)}`);
}

// ---------- 8) варианты и разборы ----------
let optCount = 0;
// Экран 1 — прогноз, а не ответ: верного варианта там НЕТ и быть не должно (§4.1).
const hookN = PLAN ? (PLAN.find((p) => p.role === 'hook') || {}).n : 1;
const textOf = (v) => (v && typeof v === 'object' ? String(v.ru || v.uz || '') : String(v ?? ''));
for (const set of optionSets) {
  const { n, path, kind, items } = set;
  if (kind === 'rows') continue;
  optCount += 1;
  const first = items[0] || {};
  const anchor = [textOf(first.hint), textOf(first.label), String(first.v ?? '')]
    .sort((a, b) => b.length - a.length)[0] || '';
  if (items.length !== 4) {
    E(`§4.7: вариантов ${items.length}, должно быть ровно 4 · ${where(n, anchor)} · ${path}`);
  }
  const rightOf = (o) => o.correct === true || o.ok === true;
  const isHook = n === hookN && path.endsWith('probe.items');
  if (isHook) {
    if (items.some(rightOf)) E(`§4.1: экран ${n} — прогноз, верного варианта там нет · ${path}`);
    items.forEach((o, i) => {
      if (!o.hint) E(`§4.1: у прогноза каждый вариант получает свой отклик · ${where(n, textOf(o.label))} · ${path}[${i}]`);
    });
    continue;
  }
  if (!items.some(rightOf)) E(`§4.7: нет верного варианта · ${where(n, anchor)} · ${path}`);
  items.forEach((o, i) => {
    if (rightOf(o)) {
      if (o.hint) W(`разбор написан и на ВЕРНЫЙ вариант · экран ${n} · ${path}[${i}]`);
      return;
    }
    const h = o.hint;
    const empty = !h || (typeof h === 'object' && !['uz', 'ru', 'en'].every((k) => h[k] && String(h[k]).trim()));
    if (empty) E(`§4.7: у неверного варианта нет разбора · ${where(n, String(o.label || o.v || o.id))} · ${path}[${i}]`);
  });
}
// AuditRows: у каждой строки, кроме верной, свой разбор
for (const set of optionSets.filter((s) => s.kind === 'rows')) {
  const data = S[set.n];
  const answerId = data && data.answerId;
  const hints = (data && data.hints) || {};
  if (!answerId) { E(`§5.2: экран ${set.n}: у «найди ошибку» нет answerId`); continue; }
  set.items.forEach((r) => {
    if (r.id === answerId) return;
    if (!hints[r.id]) E(`§5.2: строка "${cut(r.text)}" без разбора · ${where(set.n, r.text)}`);
  });
}
I(`блоков вариантов: ${optCount}`);

// ---------- 9) «показать ответ» ----------
{
  const re = /показать ответ|показать решение|javobni ko'rsat|show(?: the)? answer/i;
  const hit = strings.find((s) => re.test(s.txt));
  if (hit) E(`§5.0: кнопки «показать ответ» нет ни на одном приборе · ${where(hit.n, hit.txt)}: ${cut(hit.txt)}`);
  if (re.test(src.replace(/[«»]/g, ''))) W('§5.0: в коде урока встречается «показать ответ» — проверьте, что это не кнопка');
}

// ---------- 10) термины §3 ----------
{
  const bans = [
    ['числовая прямая', 'учебник 9 класса говорит «числовая ось»'],
    ['числовой прямой', 'учебник 9 класса говорит «числовая ось»'],
    ["sonlar to'g'ri chizig'i", "учебник даёт `sonlar o'qi`"],
  ];
  for (const [bad, why] of bans) {
    const hit = strings.find((s) => s.txt.toLowerCase().includes(bad.toLowerCase()));
    if (hit) E(`§3: «${bad}» — ${why} · ${where(hit.n, hit.txt)} · ${hit.path}`);
  }
}

// ---------- 11) реестр уроков ----------
{
  const id = (src.match(/const LESSON_ID = '([^']+)'/) || [])[1];
  const m = id && id.match(/^mat_9_(\d+)$/);
  if (!m) E(`§6: LESSON_ID должен быть вида mat_9_<номер>, сейчас "${id}"`);
  else {
    const num = Number(m[1]);
    let reg = '';
    try { reg = fs.readFileSync('src/lessons/grade9.js', 'utf8'); } catch { W('src/lessons/grade9.js не прочитан'); }
    if (reg) {
      const slug = new RegExp(`slug:\\s*'(dars${num}-[^']+)'`).exec(reg);
      const title = new RegExp(`title:\\s*'Dars ${num}\\.`).test(reg);
      const imp = new RegExp(`grade9/Dars${num}\\.jsx`).test(reg);
      if (!slug) E(`§6: в src/lessons/grade9.js нет slug для урока ${num}`);
      if (!title) E(`§6: в src/lessons/grade9.js заголовок урока ${num} не начинается с «Dars ${num}.»`);
      if (!imp) E(`§6: в src/lessons/grade9.js нет импорта grade9/Dars${num}.jsx`);
      if (slug && title && imp) I(`реестр: ${id} → ${slug[1]}`);
    }
  }
}

// ---------- 12) техника ----------
if (!/^import React/m.test(src)) E('§6: нет `import React` — LMS грузит сырой jsx в КЛАССИЧЕСКОМ режиме, без него урок падает');
for (const [needle, why] of [
  ['<svg', 'графика рисуется в приборе, а не в файле урока'],
  ['getBoundingClientRect', 'измерения — дело прибора'],
  ['document.', 'обращение к DOM — дело ядра'],
  ['addEventListener', 'события — дело ядра'],
]) if (src.includes(needle)) E(`§6: в файле урока только данные, а найдено «${needle}» (строка ${lineOf(needle)}) — ${why}`);

// ---------- 13) навигация ----------
{
  const fn = (src.match(/freeNav:\s*(\w+)/) || [])[1];
  if (fn === undefined) W('§6.3: freeNav в configureLesson не найден');
  else if (RELEASE && fn !== 'false') E(`§6.3: перед сдачей класса freeNav обязан быть false, сейчас ${fn} (строка ${lineOf('freeNav:')})`);
  else I(`freeNav = ${fn}${RELEASE ? ' (режим сдачи)' : ' (фаза разработки)'}`);
}

// ---------- отчёт ----------
const tag = { err: 'ОШИБКА', warn: 'ПРЕДУПРЕЖДЕНИЕ', info: 'СПРАВКА' };
for (const k of ['err', 'warn', 'info']) {
  if (!out[k].length) continue;
  console.log(`\n${tag[k]} (${out[k].length}):`);
  out[k].forEach((m) => console.log('  ' + m));
}
console.log(`\n${file}: ошибок ${out.err.length}, предупреждений ${out.warn.length}`);
console.log('Прокрутка и обрезка внутри карточек здесь не меряются: node scripts/grade9-noscroll.mjs');
process.exit(out.err.length ? 1 : 0);
