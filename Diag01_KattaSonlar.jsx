// Diag01 — 5-sinf · 1-mavzu «Atrofimizdagi katta sonlar» · BILIM DARAJASI DIAGNOSTIKASI
// 10 topshiriq: soddadan murakkabga (10-topshiriq eng qiyin). RU + UZ. Vizualizatsiya + geymifikatsiya.
// Mustaqil .jsx (faqat React importi) — artifacts / lokal previewda prokliklash uchun.
// Barcha javoblar Node bilan qayta tekshirilgan (razryad, sinf, o'qish/yozish, nol roli).
//
// Metodik izoh:
//   • UZ registri — «siz» (rasmiy). Apostrof — oddiy '. son ≠ raqam.
//   • UZ matematik terminlar (razryad, sinf, xona qo'shiluvchisi) — draft; o'zbek metodisti tasdig'ini talab qiladi.
//   • Diagnostika: har topshiriq bir urinish (retry yo'q), ball birinchi javob bo'yicha — toza daraja o'lchovi uchun.

import React, { useState, useEffect, useRef } from 'react';

/* ─────────────────────────  yordamchi funksiyalar  ───────────────────────── */

// 3 xonadan bo'sh joy bilan ajratish: 148906 -> "148 906" (nbsp)
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

// sonni sinflarga (3 xonadan) bo'lish, o'ngdan: index 0 = birliklar sinfi
const classesOf = (value) => {
  const s = String(value);
  const arr = [];
  for (let i = s.length; i > 0; i -= 3) arr.push(s.slice(Math.max(0, i - 3), i));
  return arr; // [birliklar, minglar, millionlar...]
};

/* ─────────────────────────  ikonalar  ───────────────────────── */
const IconOk = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const IconStar = ({ on }) => (<svg width="18" height="18" viewBox="0 0 24 24" fill={on ? '#f5b301' : 'none'} stroke={on ? '#f5b301' : '#c8cedb'} strokeWidth="1.8" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);

/* ─────────────────────────  vizual bloklar  ───────────────────────── */

// 4-xonali razryad jadvali (T2, T3): value berilsa raqamlar bilan, valueLabel — belgilangan razryad qiymati
function PlaceTable4({ value, highlight = -1, valueLabel = null, empty = false, lang }) {
  const s = String(value).padStart(4, '0').split('');
  const labels = lang === 'ru'
    ? ['Тысячи', 'Сотни', 'Десятки', 'Единицы']
    : ['Minglar', 'Yuzliklar', "O'nliklar", 'Birliklar'];
  return (
    <div className="d5-pt">
      {s.map((d, i) => (
        <div key={i} className={'d5-pt-col' + (i === highlight ? ' hi' : '')}>
          <div className="d5-pt-lab">{labels[i]}</div>
          <div className="d5-pt-cell">{empty ? '' : d}</div>
          {i === highlight && valueLabel ? <div className="d5-pt-val">{valueLabel}</div> : <div className="d5-pt-val" />}
        </div>
      ))}
    </div>
  );
}

// Sinflar bo'yicha rangli guruhlar (T4, T8)
function ClassGroups({ value, highlight = -1, lang }) {
  const cls = classesOf(value); // idx 0 = birliklar
  const labels = lang === 'ru'
    ? ['Класс единиц', 'Класс тысяч', 'Класс миллионов']
    : ['Birliklar sinfi', 'Minglar sinfi', 'Millionlar sinfi'];
  const tone = ['u', 'th', 'ml']; // birlik / ming / million ranglari
  const order = cls.map((_, i) => i).reverse(); // yuqoridan pastga: million -> birlik
  return (
    <div className="d5-cg">
      {order.map((idx) => (
        <div key={idx} className={'d5-cg-grp ' + tone[idx] + (idx === highlight ? ' hi' : '')}>
          <div className="d5-cg-num">{cls[idx]}</div>
          <div className="d5-cg-lab">{labels[idx]}</div>
        </div>
      ))}
    </div>
  );
}

// So'z-chiplar (T5, T7) — so'zlardan songa o'tkazish uchun ko'rgazma
function WordChips({ items }) {
  return (
    <div className="d5-wc">
      {items.map((w, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="d5-wc-plus">+</span>}
          <span className="d5-wc-chip">{w}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

// Xona qo'shiluvchilari (T6) — rangli bloklar 5000 + 300 + 20 + 7
function AddendBars({ addends }) {
  return (
    <div className="d5-ab">
      {addends.map((a, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="d5-ab-plus">+</span>}
          <span className="d5-ab-bar">{fmt(a)}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─────────────────────────  interfeys matnlari  ───────────────────────── */
const UI = {
  uz: {
    topic: 'Atrofimizdagi katta sonlar',
    mission: 'Kosmik missiya · 10 stansiya',
    station: 'Stansiya',
    check: 'Tekshirish',
    next: 'Keyingi',
    finish: 'Yakunlash',
    correct: "To'g'ri!",
    wrong: 'Xato',
    right: "To'g'ri javob",
    ball: 'Ball',
    orderHint: "Raqamni bosib joyga qo'ying. Bo'shatish uchun yana bosing.",
    typeHere: 'Javobni yozing',
    result: 'Missiya yakunlandi',
    yourLevel: 'Sizning darajangiz',
    code: 'Missiya kodi',
    again: 'Qaytadan',
    of: '/',
  },
  ru: {
    topic: 'Большие числа вокруг нас',
    mission: 'Космическая миссия · 10 станций',
    station: 'Станция',
    check: 'Проверить',
    next: 'Дальше',
    finish: 'Завершить',
    correct: 'Верно!',
    wrong: 'Ошибка',
    right: 'Правильный ответ',
    ball: 'Балл',
    orderHint: 'Нажмите на цифру, чтобы поставить её в ряд. Нажмите ещё раз, чтобы убрать.',
    typeHere: 'Впишите ответ',
    result: 'Миссия завершена',
    yourLevel: 'Ваш уровень',
    code: 'Код миссии',
    again: 'Заново',
    of: '/',
  },
};

// Daraja darajalari (10 balldan)
const bandOf = (score, lang) => {
  const B = lang === 'ru'
    ? [
        { max: 4, label: 'Начальный', text: 'Стоит повторить разряды и классы многозначных чисел.', color: '#c0392b' },
        { max: 7, label: 'Средний', text: 'Основа есть. Больше практики в чтении и записи чисел.', color: '#c77d0a' },
        { max: 9, label: 'Хороший', text: 'Тема освоена хорошо. Остались лишь тонкие места.', color: '#1a7f43' },
        { max: 10, label: 'Отличный', text: 'Большие числа освоены полностью. Отлично!', color: '#1a7f43' },
      ]
    : [
        { max: 4, label: "Boshlang'ich", text: 'Razryad va sinf tushunchalarini qaytadan mustahkamlash tavsiya etiladi.', color: '#c0392b' },
        { max: 7, label: "O'rta", text: "Asos bor. Sonni o'qish va yozishni ko'proq mashq qiling.", color: '#c77d0a' },
        { max: 9, label: 'Yaxshi', text: "Mavzu yaxshi o'zlashtirilgan. Faqat ayrim nozik joylar qoldi.", color: '#1a7f43' },
        { max: 10, label: "A'lo", text: "Katta sonlarni to'liq egallagansiz. Zo'r!", color: '#1a7f43' },
      ];
  return B.find((b) => score <= b.max) || B[B.length - 1];
};

/* ─────────────────────────  10 topshiriq  ───────────────────────── */
// type: 'mc' (variant tanlash) | 'input' (son yozish) | 'order' (raqamlarni tartiblash)
const TASKS = [
  // 1 — Б: raqamlar soni
  {
    id: 1, level: 'B', type: 'mc', correctIndex: 1, visual: { kind: 'cells', value: 3254 },
    uz: { body: "Kema skaneri bir sonni ko'rsatdi: 3 254. Bu son nechta raqamdan iborat?",
      options: ['3', '4', '5', '6'], explain: "3 254 — to'rt xonali son: 3, 2, 5, 4." },
    ru: { body: 'Сканер корабля показал число: 3 254. Из скольких цифр оно состоит?',
      options: ['3', '4', '5', '6'], explain: 'В числе 3 254 четыре цифры: 3, 2, 5, 4.' },
  },
  // 2 — Б: berilgan razryaddagi raqam
  {
    id: 2, level: 'B', type: 'mc', correctIndex: 2, visual: { kind: 'pt', value: 3254, highlight: 2 },
    uz: { body: "3 254 sonida o'nliklar razryadida qaysi raqam turibdi?",
      options: ['3', '2', '5', '4'], explain: "O'ngdan ikkinchi razryad — o'nliklar. U yerda 5." },
    ru: { body: 'В числе 3 254 какая цифра стоит в разряде десятков?',
      options: ['3', '2', '5', '4'], explain: 'Второй разряд справа — десятки. Там стоит 5.' },
  },
  // 3 — Б/С: raqamning razryad qiymati
  {
    id: 3, level: 'C', type: 'mc', correctIndex: 2, visual: { kind: 'pt', value: 3254, highlight: 1, val: { uz: '= 200', ru: '= 200' } },
    uz: { body: "3 254 sonida 2 raqami qanday qiymatni bildiradi (nechta birlikni)?",
      options: ['2', '20', '200', '2 000'], explain: "2 raqami yuzliklar razryadida — u 200 ni bildiradi." },
    ru: { body: 'В числе 3 254 что обозначает цифра 2 (сколько единиц)?',
      options: ['2', '20', '200', '2 000'], explain: 'Цифра 2 стоит в разряде сотен — она обозначает 200.' },
  },
  // 4 — С: sonni o'qish
  {
    id: 4, level: 'C', type: 'mc', correctIndex: 0, visual: { kind: 'cg', value: 40500 },
    uz: { body: "40 500 soni qanday o'qiladi?",
      options: ['qirq ming besh yuz', "to'rt ming besh yuz", 'qirq besh ming', "to'rt yuz besh"],
      explain: "40 500 = qirq ming besh yuz (minglar sinfi — 40, birliklar sinfi — 500)." },
    ru: { body: 'Как читается число 40 500?',
      options: ['сорок тысяч пятьсот', 'четыре тысячи пятьсот', 'сорок пять тысяч', 'четыреста пять'],
      explain: '40 500 = сорок тысяч пятьсот (класс тысяч — 40, класс единиц — 500).' },
  },
  // 5 — С: so'zdan songa yozish
  {
    id: 5, level: 'C', type: 'input', answer: 23600, visual: { kind: 'words', items: { uz: ['yigirma uch ming', 'olti yuz'], ru: ['двадцать три тысячи', 'шестьсот'] } },
    uz: { body: 'Sonni raqamlar bilan yozing: yigirma uch ming olti yuz.', explain: 'yigirma uch ming = 23 000, olti yuz = 600 → 23 600.' },
    ru: { body: 'Запишите число цифрами: двадцать три тысячи шестьсот.', explain: 'двадцать три тысячи = 23 000, шестьсот = 600 → 23 600.' },
  },
  // 6 — С: xona qo'shiluvchilaridan yig'ish
  {
    id: 6, level: 'C', type: 'input', answer: 5327, visual: { kind: 'addends', addends: [5000, 300, 20, 7] },
    uz: { body: "Xona qo'shiluvchilaridan sonni yig'ing: 5 000 + 300 + 20 + 7.", explain: '5 000 + 300 + 20 + 7 = 5 327.' },
    ru: { body: 'Соберите число из разрядных слагаемых: 5 000 + 300 + 20 + 7.', explain: '5 000 + 300 + 20 + 7 = 5 327.' },
  },
  // 7 — С/П: nol roli (bo'sh razryad)
  {
    id: 7, level: 'P', type: 'input', answer: 3005, visual: { kind: 'words-empty', items: { uz: ['uch ming', 'besh'], ru: ['три тысячи', 'пять'] } },
    uz: { body: 'Sonni raqamlar bilan yozing: uch ming besh.', explain: "Yuzliklar va o'nliklar bo'sh — ularga nol qo'yiladi: 3 005." },
    ru: { body: 'Запишите число цифрами: три тысячи пять.', explain: 'Сотни и десятки пустые — в них ставятся нули: 3 005.' },
  },
  // 8 — П: sinfni ajratish
  {
    id: 8, level: 'P', type: 'mc', correctIndex: 0, visual: { kind: 'cg', value: 7208460, highlight: 1 },
    uz: { body: '7 208 460 sonida minglar sinfida qaysi son turibdi?',
      options: ['208', '460', '7', '720'], explain: '7 208 460 = 7 million · 208 ming · 460. Minglar sinfi — 208.' },
    ru: { body: 'В числе 7 208 460 какое число стоит в классе тысяч?',
      options: ['208', '460', '7', '720'], explain: '7 208 460 = 7 миллионов · 208 тысяч · 460. Класс тысяч — 208.' },
  },
  // 9 — П: eng katta sonni tuzish
  {
    id: 9, level: 'P', type: 'order', tiles: [7, 5, 2, 0], answer: [7, 5, 2, 0], visual: { kind: 'order' },
    uz: { body: 'Bekzod raqamlardan eng katta sonni tuzmoqchi. 7, 5, 2, 0 raqamlarini joylashtiring.',
      explain: 'Eng katta raqam — birinchi (eng katta razryadda): 7 520.' },
    ru: { body: 'Бекзод составляет самое большое число из цифр 7, 5, 2, 0. Разместите цифры.',
      explain: 'Самая большая цифра — первой (в старшем разряде): 7 520.' },
  },
  // 10 — П (eng qiyin): shartlardan olti xonali kodni tiklash
  {
    id: 10, level: 'P', type: 'input', answer: 148906, visual: { kind: 'reconstruct' },
    uz: { body: "Missiya kodi — olti xonali son. Minglar sinfi: 148. Birliklar sinfida: 9 yuzlik, 0 o'nlik, 6 birlik. Kodni yozing.",
      explain: "Minglar sinfi 148, birliklar sinfi 906 (9 yuz · 0 o'nlik · 6 birlik) → 148 906." },
    ru: { body: 'Код миссии — шестизначное число. Класс тысяч: 148. В классе единиц: 9 сотен, 0 десятков, 6 единиц. Запишите код.',
      explain: 'Класс тысяч 148, класс единиц 906 (9 сотен · 0 десятков · 6 единиц) → 148 906.' },
  },
];

/* ─────────────────────────  bitta topshiriq ko'rinishi  ───────────────────────── */
function TaskView({ task, lang, index, total, ui, onDone }) {
  const tx = task[lang];
  const [picked, setPicked] = useState(null);   // mc index
  const [text, setText] = useState('');          // input
  const [seq, setSeq] = useState([]);            // order
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const ready = task.type === 'mc' ? picked !== null
    : task.type === 'input' ? text.trim() !== ''
    : seq.length === (task.tiles ? task.tiles.length : 0);

  const doCheck = () => {
    if (!ready || checked) return;
    let ok = false;
    if (task.type === 'mc') ok = picked === task.correctIndex;
    else if (task.type === 'input') ok = parseInt(cleanInt(text) || '-1', 10) === task.answer;
    else if (task.type === 'order') ok = seq.map((i) => task.tiles[i]).join(',') === task.answer.join(',');
    setCorrect(ok); setChecked(true);
  };

  const rightAnswerText = task.type === 'mc' ? tx.options[task.correctIndex]
    : task.type === 'input' ? fmt(task.answer)
    : fmt(parseInt(task.answer.join(''), 10));

  // order: raqam-plitkalar
  const placed = seq;
  const pool = task.type === 'order' ? task.tiles.map((v, i) => ({ v, i })).filter(({ i }) => !placed.includes(i)) : [];

  return (
    <div className="d5-task">
      <div className="d5-badge">
        <span className={'d5-lvl d5-lvl-' + task.level}>{task.level === 'B' ? 'Б' : task.level === 'C' ? 'С' : 'П'}</span>
        <span className="d5-badge-txt">{ui.station} {index + 1} {ui.of} {total}</span>
      </div>
      <p className="d5-body">{tx.body}</p>

      {/* ── VIZUAL ── */}
      <div className="d5-visual">
        {task.visual.kind === 'cells' && (
          <div className="d5-cells">{String(task.visual.value).split('').map((d, i) => (<span key={i} className="d5-cell">{d}</span>))}</div>
        )}
        {task.visual.kind === 'pt' && (
          <PlaceTable4 value={task.visual.value} highlight={task.visual.highlight} valueLabel={task.visual.val ? task.visual.val[lang] : null} lang={lang} />
        )}
        {task.visual.kind === 'cg' && (
          <ClassGroups value={task.visual.value} highlight={task.visual.highlight != null ? task.visual.highlight : -1} lang={lang} />
        )}
        {task.visual.kind === 'words' && (<WordChips items={task.visual.items[lang]} />)}
        {task.visual.kind === 'words-empty' && (<><WordChips items={task.visual.items[lang]} /><PlaceTable4 value={0} empty lang={lang} /></>)}
        {task.visual.kind === 'addends' && (<AddendBars addends={task.visual.addends} />)}
        {task.visual.kind === 'reconstruct' && (
          <div className="d5-recon">
            <div className="d5-recon-grp th"><div className="d5-recon-num">148</div><div className="d5-recon-lab">{lang === 'ru' ? 'Класс тысяч' : 'Minglar sinfi'}</div></div>
            <div className="d5-recon-grp u">
              <div className="d5-recon-cells"><span>9</span><span>0</span><span>6</span></div>
              <div className="d5-recon-lab">{lang === 'ru' ? 'Класс единиц (9 · 0 · 6)' : 'Birliklar sinfi (9 · 0 · 6)'}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── JAVOB MAYDONI ── */}
      {task.type === 'mc' && (
        <div className="d5-opts">
          {tx.options.map((o, i) => {
            const sel = picked === i;
            const isRight = checked && i === task.correctIndex;
            const isWrongSel = checked && sel && i !== task.correctIndex;
            const cls = 'd5-opt' + (isRight ? ' right' : isWrongSel ? ' wrongsel' : sel ? ' sel' : '');
            return (<button key={i} type="button" className={cls} disabled={checked} onClick={() => setPicked(i)}>{o}</button>);
          })}
        </div>
      )}

      {task.type === 'input' && (
        <input className="d5-input" inputMode="numeric" pattern="[0-9]*" placeholder={ui.typeHere}
          value={text} disabled={checked}
          onChange={(e) => setText(cleanInt(e.target.value))}
          onKeyDown={(e) => { if (e.key === 'Enter') doCheck(); }} />
      )}

      {task.type === 'order' && (
        <div className="d5-order">
          <div className="d5-slots">
            {task.tiles.map((_, s) => {
              const tileIdx = placed[s];
              return (
                <button key={s} type="button" className={'d5-slot' + (tileIdx != null ? ' full' : '')}
                  disabled={checked || tileIdx == null}
                  onClick={() => setSeq(placed.filter((_, k) => k !== s))}>
                  {tileIdx != null ? task.tiles[tileIdx] : ''}
                </button>
              );
            })}
          </div>
          <div className="d5-hint">{ui.orderHint}</div>
          <div className="d5-pool">
            {pool.map(({ v, i }) => (
              <button key={i} type="button" className="d5-tile" disabled={checked}
                onClick={() => setSeq([...placed, i])}>{v}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── FIDBEK ── */}
      {checked && (
        <div className={'d5-fb ' + (correct ? 'ok' : 'no')}>
          {correct ? <IconOk /> : <IconNo />}
          <div className="d5-fb-txt">
            <b>{correct ? ui.correct : ui.wrong}</b>
            {!correct && <div className="d5-fb-right">{ui.right}: <b>{rightAnswerText}</b></div>}
            <div className="d5-fb-exp">{tx.explain}</div>
          </div>
        </div>
      )}

      {/* ── TUGMA ── */}
      <div className="d5-actions">
        {!checked ? (
          <button type="button" className="d5-btn primary" disabled={!ready} onClick={doCheck}>{ui.check}</button>
        ) : (
          <button type="button" className="d5-btn primary" onClick={() => onDone(correct)}>
            {index + 1 === total ? ui.finish : ui.next}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────  natija ekrani  ───────────────────────── */
function ResultView({ score, total, lang, ui, onRestart }) {
  const band = bandOf(score, lang);
  return (
    <div className="d5-result">
      <div className="d5-rocket">🚀</div>
      <h2 className="d5-res-title">{ui.result}</h2>
      <div className="d5-score-big">{score}<span>/{total}</span></div>
      <div className="d5-stars">{Array.from({ length: total }).map((_, i) => (<IconStar key={i} on={i < score} />))}</div>
      <div className="d5-band" style={{ borderColor: band.color, color: band.color }}>
        <div className="d5-band-lab">{ui.yourLevel}: <b>{band.label}</b></div>
        <div className="d5-band-txt">{band.text}</div>
      </div>
      <div className="d5-code">{ui.code}: <b>148&nbsp;906</b></div>
      <button type="button" className="d5-btn ghost" onClick={onRestart}>↻ {ui.again}</button>
    </div>
  );
}

/* ─────────────────────────  asosiy komponent  ───────────────────────── */
export default function Diag01_KattaSonlar({ lang: langProp = 'uz' }) {
  const [lang, setLang] = useState(langProp === 'ru' ? 'ru' : 'uz');
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const ui = UI[lang];
  const total = TASKS.length;
  const done = step >= total;

  const restart = () => { setStep(0); setScore(0); };
  const onDone = (correct) => { if (correct) setScore((s) => s + 1); setStep((s) => s + 1); };

  // til almashsa diagnostikani boshidan (toza o'lchov)
  const langRef = useRef(lang);
  useEffect(() => { if (langRef.current !== lang) { langRef.current = lang; restart(); } }, [lang]);

  return (
    <div className="d5t1">
      <style>{CSS}</style>

      <header className="d5-head">
        <div className="d5-head-l">
          <div className="d5-topic">{ui.topic}</div>
          <div className="d5-mission">{ui.mission}</div>
        </div>
        <div className="d5-head-r">
          <div className="d5-score"><IconStar on />{score}</div>
          <div className="d5-langs">
            <button type="button" className={'d5-lang' + (lang === 'uz' ? ' on' : '')} onClick={() => setLang('uz')}>UZ</button>
            <button type="button" className={'d5-lang' + (lang === 'ru' ? ' on' : '')} onClick={() => setLang('ru')}>RU</button>
          </div>
        </div>
      </header>

      <div className="d5-progress">
        {TASKS.map((_, i) => (<span key={i} className={'d5-dot' + (i < step ? ' done' : i === step ? ' cur' : '')} />))}
      </div>

      <main className="d5-main">
        {done
          ? <ResultView score={score} total={total} lang={lang} ui={ui} onRestart={restart} />
          : <TaskView key={step + '-' + lang} task={TASKS[step]} lang={lang} index={step} total={total} ui={ui} onDone={onDone} />}
      </main>
    </div>
  );
}

/* ─────────────────────────  uslub  ───────────────────────── */
const CSS = `
.d5t1 { max-width: 720px; margin: 0 auto; padding: 0 14px 28px; color: #1f2430;
  font-family: 'Manrope', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
.d5t1 * { box-sizing: border-box; }

.d5-head { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 14px 2px 10px; }
.d5-topic { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
.d5-mission { font-size: 12.5px; font-weight: 700; color: #7c86a0; margin-top: 1px; }
.d5-head-r { display: flex; align-items: center; gap: 12px; }
.d5-score { display: inline-flex; align-items: center; gap: 5px; font-weight: 800; font-size: 16px;
  color: #c77d0a; background: #fff6e2; padding: 5px 11px; border-radius: 999px; }
.d5-langs { display: flex; gap: 4px; }
.d5-lang { padding: 5px 10px; border-radius: 999px; font-size: 12.5px; font-weight: 800; cursor: pointer;
  border: 1.5px solid #d6dae3; background: #fff; color: #6b7280; }
.d5-lang.on { background: #2563eb; border-color: #2563eb; color: #fff; }

.d5-progress { display: flex; gap: 6px; padding: 2px 2px 14px; }
.d5-dot { flex: 1; height: 5px; border-radius: 999px; background: #e6e9f0; }
.d5-dot.done { background: #1a7f43; }
.d5-dot.cur { background: #2563eb; }

.d5-task { animation: d5in .22s ease both; }
@keyframes d5in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.d5-badge { display: flex; align-items: center; gap: 9px; margin-bottom: 8px; }
.d5-lvl { width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center;
  border-radius: 8px; font-size: 13px; font-weight: 800; color: #fff; }
.d5-lvl-B { background: #2e9e5b; } .d5-lvl-C { background: #d98b18; } .d5-lvl-P { background: #b23b6f; }
.d5-badge-txt { font-size: 12.5px; font-weight: 700; color: #7c86a0; text-transform: uppercase; letter-spacing: .03em; }

.d5-body { font-size: 18px; line-height: 1.5; font-weight: 600; margin: 4px 0 16px; }

.d5-visual { margin: 4px 0 20px; }

/* raqam katakchalari */
.d5-cells { display: flex; gap: 8px; justify-content: center; }
.d5-cell { width: 52px; height: 62px; display: flex; align-items: center; justify-content: center;
  font-size: 30px; font-weight: 800; border-radius: 12px; background: #eef2fb; border: 2px solid #d3ddf6;
  color: #22346b; font-variant-numeric: tabular-nums; }

/* razryad jadvali */
.d5-pt { display: flex; gap: 8px; justify-content: center; }
.d5-pt-col { flex: 0 0 auto; width: 78px; text-align: center; }
.d5-pt-lab { font-size: 11.5px; font-weight: 700; color: #7c86a0; margin-bottom: 5px; min-height: 28px;
  display: flex; align-items: flex-end; justify-content: center; line-height: 1.15; }
.d5-pt-cell { height: 58px; display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 800; border-radius: 12px; background: #f4f6fb; border: 2px solid #dfe4ee;
  color: #2b3350; font-variant-numeric: tabular-nums; }
.d5-pt-col.hi .d5-pt-cell { background: #e8eefc; border-color: #2563eb; color: #1b3faa; }
.d5-pt-val { min-height: 20px; margin-top: 5px; font-size: 14px; font-weight: 800; color: #2563eb; }

/* sinf guruhlari */
.d5-cg { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d5-cg-grp { padding: 12px 16px; border-radius: 14px; text-align: center; border: 2px solid transparent; min-width: 96px; }
.d5-cg-num { font-size: 30px; font-weight: 800; letter-spacing: .04em; font-variant-numeric: tabular-nums; }
.d5-cg-lab { font-size: 11.5px; font-weight: 700; margin-top: 3px; }
.d5-cg-grp.u  { background: #eaf1ff; color: #1b3faa; } .d5-cg-grp.u .d5-cg-lab { color: #4166b8; }
.d5-cg-grp.th { background: #e7f7ec; color: #146b39; } .d5-cg-grp.th .d5-cg-lab { color: #2b8f57; }
.d5-cg-grp.ml { background: #f2ecfd; color: #5b2ea6; } .d5-cg-grp.ml .d5-cg-lab { color: #7c4fc0; }
.d5-cg-grp.hi { outline: 3px solid #2563eb; outline-offset: 2px; }

/* so'z-chiplar */
.d5-wc { display: flex; align-items: center; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 12px; }
.d5-wc-chip { padding: 9px 14px; border-radius: 12px; background: #fff6e2; color: #8a5a08; font-weight: 800; font-size: 15px; }
.d5-wc-plus { font-weight: 800; color: #b6bccb; }

/* xona qo'shiluvchilari */
.d5-ab { display: flex; align-items: center; gap: 8px; justify-content: center; flex-wrap: wrap; }
.d5-ab-bar { padding: 11px 16px; border-radius: 12px; background: #e8eefc; color: #1b3faa; font-weight: 800;
  font-size: 18px; font-variant-numeric: tabular-nums; }
.d5-ab-plus { font-size: 20px; font-weight: 800; color: #9aa1ad; }

/* rekonstruksiya (10) */
.d5-recon { display: flex; gap: 10px; justify-content: center; align-items: stretch; flex-wrap: wrap; }
.d5-recon-grp { padding: 12px 16px; border-radius: 14px; text-align: center; }
.d5-recon-grp.th { background: #e7f7ec; }
.d5-recon-grp.u { background: #eaf1ff; }
.d5-recon-num { font-size: 30px; font-weight: 800; color: #146b39; letter-spacing: .04em; }
.d5-recon-cells { display: flex; gap: 5px; justify-content: center; }
.d5-recon-cells span { width: 34px; height: 42px; display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 800; color: #1b3faa; background: #fff; border-radius: 8px; border: 1.5px solid #cdd9f5; }
.d5-recon-lab { font-size: 11.5px; font-weight: 700; color: #5d6a86; margin-top: 5px; }

/* variantlar */
.d5-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.d5-opt { padding: 15px 14px; border-radius: 14px; border: 2px solid #d6dae3; background: #fff; cursor: pointer;
  font-size: 17px; font-weight: 700; color: #2b3350; text-align: center; transition: border-color .12s, background .12s; }
.d5-opt:hover:not(:disabled) { border-color: #9db6f0; background: #f6f9ff; }
.d5-opt.sel { border-color: #2563eb; background: #e8eefc; color: #1b3faa; }
.d5-opt.right { border-color: #1a7f43; background: #e8f7ee; color: #146b39; }
.d5-opt.wrongsel { border-color: #c0392b; background: #fdecec; color: #a12d20; }
.d5-opt:disabled { cursor: default; }

/* input */
.d5-input { width: 100%; padding: 15px 16px; border-radius: 14px; border: 2px solid #d6dae3; background: #f8fafc;
  font-size: 26px; font-weight: 800; text-align: center; color: #22346b; outline: none; font-variant-numeric: tabular-nums; }
.d5-input:focus { border-color: #2563eb; background: #fff; }
.d5-input:disabled { opacity: .9; }

/* tartiblash */
.d5-order { text-align: center; }
.d5-slots { display: flex; gap: 8px; justify-content: center; margin-bottom: 4px; }
.d5-slot { width: 60px; height: 68px; border-radius: 14px; border: 2px dashed #c2c8d2; background: #f8fafc;
  font-size: 30px; font-weight: 800; color: #22346b; cursor: pointer; }
.d5-slot.full { border-style: solid; border-color: #2563eb; background: #e8eefc; }
.d5-hint { font-size: 12.5px; color: #9aa1ad; margin: 6px 0 12px; }
.d5-pool { display: flex; gap: 10px; justify-content: center; }
.d5-tile { width: 58px; height: 58px; border-radius: 14px; border: none; background: #2563eb; color: #fff;
  font-size: 26px; font-weight: 800; cursor: pointer; box-shadow: 0 3px 0 #1b47b0; }
.d5-tile:active { transform: translateY(2px); box-shadow: 0 1px 0 #1b47b0; }
.d5-tile:disabled { opacity: .5; }

/* fidbek */
.d5-fb { display: flex; gap: 11px; align-items: flex-start; margin-top: 18px; padding: 14px 16px; border-radius: 14px;
  animation: d5in .2s ease both; }
.d5-fb.ok { background: #e8f7ee; color: #146b39; }
.d5-fb.no { background: #fdecec; color: #a12d20; }
.d5-fb-txt { font-size: 15px; line-height: 1.45; }
.d5-fb-txt b { font-weight: 800; }
.d5-fb-right { margin-top: 3px; }
.d5-fb-exp { margin-top: 5px; font-weight: 600; opacity: .92; }

/* tugma */
.d5-actions { margin-top: 20px; }
.d5-btn { width: 100%; padding: 16px; border-radius: 15px; font-size: 18px; font-weight: 800; cursor: pointer; border: none; }
.d5-btn.primary { color: #fff; background: #2563eb; }
.d5-btn.primary:disabled { background: #c2c8d2; cursor: not-allowed; }
.d5-btn.ghost { background: #fff; border: 2px solid #d6dae3; color: #374151; margin-top: 18px; }

/* natija */
.d5-result { text-align: center; padding: 12px 4px; animation: d5in .25s ease both; }
.d5-rocket { font-size: 46px; }
.d5-res-title { font-size: 20px; font-weight: 800; margin: 6px 0 2px; }
.d5-score-big { font-size: 54px; font-weight: 800; color: #2563eb; line-height: 1.1; }
.d5-score-big span { font-size: 26px; color: #9aa1ad; }
.d5-stars { display: flex; gap: 4px; justify-content: center; flex-wrap: wrap; margin: 8px 0 18px; }
.d5-band { border: 2px solid; border-radius: 16px; padding: 14px 16px; max-width: 460px; margin: 0 auto; }
.d5-band-lab { font-size: 16px; } .d5-band-lab b { font-weight: 800; }
.d5-band-txt { font-size: 14px; margin-top: 5px; color: #4b5566; font-weight: 600; }
.d5-code { margin: 18px 0 4px; font-size: 15px; color: #5d6a86; font-weight: 700; }
.d5-code b { color: #1f2430; font-variant-numeric: tabular-nums; }

@media (max-width: 460px) {
  .d5-cell { width: 44px; height: 54px; font-size: 25px; }
  .d5-pt-col { width: 68px; }
  .d5-body { font-size: 16.5px; }
  .d5-opts { grid-template-columns: 1fr; }
}
`;
