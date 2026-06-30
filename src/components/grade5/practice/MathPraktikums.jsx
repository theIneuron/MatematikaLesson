import { useState } from "react";

/*
  Junior IT Academy · CoddyCamp — Академический отдел
  Математика 5 класс · интерактивный прототип практикумов

  Один практикум на каждый блок — пять разных форматов из палитры:
    Блок 1  Числовая прямая        «Экспедиция по прямой»
    Блок 2  Конструктор дробей     «Фабрика дробей»
    Блок 3  Найди ошибку           «Найди ошибку: общий знаменатель»
    Блок 4  Песочница-исследование «Двигай запятую»
    Блок 5  Авто-проверяемый констр. «Дизайнер комнаты»

  Это прототип для разработки: показывает механику, экраны и проверку.
  Зависимость только react. Данные нигде не сохраняются.
*/

const C = {
  ink: "#1C2B36",
  sub: "#5C6B78",
  hint: "#8A97A2",
  paper: "#FFFFFF",
  page: "#F4F6F9",
  line: "#E2E8ED",
  primary: "#2C5F8A",
  primarySoft: "#E7F0F8",
  ok: "#1F8A5B",
  okSoft: "#E6F4EC",
  err: "#C2493D",
  errSoft: "#FBEBE9",
  coin: "#B8860B",
  coinSoft: "#FBF1D8",
};

const LEVEL = {
  "Б": { bg: "#EAF3DE", fg: "#27500A" },
  "С": { bg: "#FAEEDA", fg: "#633806" },
  "П": { bg: "#FCEBEB", fg: "#791F1F" },
};

function round(n, p = 2) {
  const f = Math.pow(10, p);
  return Math.round(n * f) / f;
}

function Badge({ level }) {
  const c = LEVEL[level];
  return (
    <span style={{ background: c.bg, color: c.fg, fontSize: 12, fontWeight: 500, padding: "2px 9px", borderRadius: 999 }}>
      {level}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span style={{ background: C.page, color: C.sub, fontSize: 12, padding: "2px 9px", borderRadius: 999, border: `1px solid ${C.line}` }}>
      {children}
    </span>
  );
}

function Feedback({ state, children }) {
  if (!state) return null;
  const ok = state === "ok";
  return (
    <div style={{
      marginTop: 14, display: "flex", gap: 9, alignItems: "flex-start",
      padding: "11px 13px", borderRadius: 10, lineHeight: 1.5, fontSize: 14,
      background: ok ? C.okSoft : C.errSoft, color: ok ? C.ok : C.err,
    }}>
      <span style={{ fontWeight: 700, lineHeight: 1.4 }}>{ok ? "✓" : "✕"}</span>
      <span>{children}</span>
    </div>
  );
}

function Btn({ children, onClick, primary, disabled }) {
  return (
    <button
      className="pk-btn"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 18px", borderRadius: 10, fontSize: 14, cursor: disabled ? "default" : "pointer",
        border: `1px solid ${primary ? C.primary : C.line}`,
        background: primary ? C.primary : C.paper,
        color: primary ? "#fff" : C.ink, opacity: disabled ? 0.5 : 1, fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function Stepper({ label, value, set, min, max, unit }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <span style={{ fontSize: 14, color: C.sub }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button className="pk-step" onClick={() => set(Math.max(min, value - 1))} aria-label="меньше">−</button>
        <span style={{ minWidth: 56, textAlign: "center", fontSize: 16, fontWeight: 500 }}>{value} {unit}</span>
        <button className="pk-step" onClick={() => set(Math.min(max, value + 1))} aria-label="больше">+</button>
      </div>
    </div>
  );
}

/* ───────────────── Блок 1 · Числовая прямая ───────────────── */
function NumberLine({ addCoins }) {
  const min = -5, max = 5, target = -3;
  const [val, setVal] = useState(null);
  const [fb, setFb] = useState(null);
  const ticks = [];
  for (let i = min; i <= max; i++) ticks.push(i);

  function check() {
    if (val === null) { setFb({ s: "err", t: "Сначала выбери точку на прямой — где находится батискаф." }); return; }
    if (val === target) { setFb({ s: "ok", t: "Точно! Глубина −3 м: три деления ниже нуля. +15 коинов" }); addCoins(15); }
    else if (val > 0) setFb({ s: "err", t: "Глубина — это ниже нуля. Ищи слева от 0." });
    else setFb({ s: "err", t: `Почти. Сейчас ${val} м, а нужно −3 м — на ${Math.abs(val - target)} деления.` });
  }

  return (
    <div>
      <p style={{ margin: "0 0 16px", color: C.sub, fontSize: 14, lineHeight: 1.6 }}>
        Батискаф спускается под воду. Поставь его на глубину <b style={{ color: C.ink }}>−3 метра</b>.
      </p>
      <div style={{ display: "flex", marginBottom: 4 }}>
        {ticks.map((n) => (
          <div key={n} style={{ flex: 1, textAlign: "center", height: 22 }}>
            {val === n && <span style={{ color: C.primary, fontSize: 16 }}>▼</span>}
          </div>
        ))}
      </div>
      <div style={{ position: "relative", height: 2, background: C.line, margin: "0 16px" }}>
        <div style={{ position: "absolute", left: "50%", top: -5, width: 2, height: 12, background: C.hint, transform: "translateX(-50%)" }} />
      </div>
      <div style={{ display: "flex", marginTop: 6 }}>
        {ticks.map((n) => (
          <button key={n} className="pk-tick" onClick={() => { setVal(n); setFb(null); }}
            style={{
              flex: 1, padding: "8px 0", fontSize: 14, borderRadius: 8, margin: "0 2px",
              border: `1px solid ${val === n ? C.primary : "transparent"}`,
              background: val === n ? C.primarySoft : "transparent",
              color: n === 0 ? C.ink : C.sub, fontWeight: n === 0 ? 600 : 400, cursor: "pointer",
            }}>
            {n}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 13, color: C.hint }}>
        Глубина: {val === null ? "—" : `${val} м`}
      </div>
      <Feedback state={fb && fb.s}>{fb && fb.t}</Feedback>
      <div style={{ marginTop: 14 }}><Btn primary onClick={check}>Погрузить</Btn></div>
    </div>
  );
}

/* ───────────────── Блок 2 · Конструктор дробей ───────────────── */
function FractionFactory({ addCoins }) {
  const dens = [2, 3, 4, 6, 8];
  const [den, setDen] = useState(4);
  const [shaded, setShaded] = useState({});
  const [fb, setFb] = useState(null);
  const count = Object.values(shaded).filter(Boolean).length;

  function pickDen(d) { setDen(d); setShaded({}); setFb(null); }
  function toggle(i) { setShaded((s) => ({ ...s, [i]: !s[i] })); setFb(null); }

  function check() {
    const value = count / den;
    if (Math.abs(value - 0.75) < 1e-9) {
      const exact = den === 4 && count === 3;
      setFb({ s: "ok", t: exact ? "Верно — это 3/4. +15 коинов" : `Верно! ${count}/${den} = 3/4 — эквивалентная дробь. +15 коинов` });
      addCoins(15);
    } else {
      setFb({ s: "err", t: `Сейчас закрашено ${count}/${den}. Нужно три четверти — попробуй закрасить больше или поменяй число долей.` });
    }
  }

  return (
    <div>
      <p style={{ margin: "0 0 14px", color: C.sub, fontSize: 14, lineHeight: 1.6 }}>
        Собери дробь <b style={{ color: C.ink }}>3/4</b>: выбери число долей и закрась нужные.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {dens.map((d) => (
          <button key={d} className="pk-btn" onClick={() => pickDen(d)}
            style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 14, cursor: "pointer",
              border: `1px solid ${den === d ? C.primary : C.line}`,
              background: den === d ? C.primarySoft : C.paper, color: C.ink,
            }}>
            {d} долей
          </button>
        ))}
      </div>
      <div style={{ display: "flex", border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden", height: 64 }}>
        {Array.from({ length: den }).map((_, i) => (
          <button key={i} onClick={() => toggle(i)}
            style={{
              flex: 1, border: "none", borderRight: i < den - 1 ? `1px solid ${C.line}` : "none",
              background: shaded[i] ? C.primary : C.paper, cursor: "pointer", transition: "background .12s",
            }} aria-label={`доля ${i + 1}`} />
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 15 }}>
        Закрашено: <b>{count}/{den}</b>
      </div>
      <Feedback state={fb && fb.s}>{fb && fb.t}</Feedback>
      <div style={{ marginTop: 14 }}><Btn primary onClick={check}>Проверить</Btn></div>
    </div>
  );
}

/* ───────────────── Блок 3 · Найди ошибку ───────────────── */
function FindError({ addCoins }) {
  const steps = ["1/2 + 1/3", "= (1 + 1) / (2 + 3)", "= 2/5"];
  const wrong = 1;
  const [pick, setPick] = useState(null);
  const [done, setDone] = useState(false);
  const [fb, setFb] = useState(null);

  function check() {
    if (pick === null) { setFb({ s: "err", t: "Отметь шаг, в котором закралась ошибка." }); return; }
    if (pick === wrong) { setFb({ s: "ok", t: "Верно! Знаменатели нельзя складывать. +20 коинов" }); setDone(true); addCoins(20); }
    else setFb({ s: "err", t: "Здесь пока всё честно. Посмотри, что сделали со знаменателями." });
  }

  return (
    <div>
      <p style={{ margin: "0 0 14px", color: C.sub, fontSize: 14, lineHeight: 1.6 }}>
        Ученик складывал дроби. Найди шаг с ошибкой — кликни по нему.
      </p>
      <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => { setPick(i); setFb(null); }} disabled={done}
            style={{
              display: "block", width: "100%", textAlign: "left", padding: "13px 15px", fontSize: 16,
              fontFamily: "ui-monospace, Menlo, Consolas, monospace", cursor: done ? "default" : "pointer",
              border: "none", borderTop: i ? `1px solid ${C.line}` : "none",
              background: pick === i ? (done ? C.okSoft : C.primarySoft) : C.paper, color: C.ink,
            }}>
            <span style={{ color: C.hint, marginRight: 10 }}>{i + 1}</span>{s}
          </button>
        ))}
      </div>
      <Feedback state={fb && fb.s}>{fb && fb.t}</Feedback>
      {done && (
        <div style={{ marginTop: 14, padding: "12px 14px", background: C.page, borderRadius: 10, fontSize: 14, lineHeight: 1.7 }}>
          <div style={{ color: C.sub, marginBottom: 4 }}>Как правильно:</div>
          <div style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace" }}>
            1/2 + 1/3 = 3/6 + 2/6 = <b style={{ color: C.ok }}>5/6</b>
          </div>
          <div style={{ color: C.sub, marginTop: 6 }}>Сначала общий знаменатель (6), потом складываем числители.</div>
        </div>
      )}
      {!done && <div style={{ marginTop: 14 }}><Btn primary onClick={check}>Проверить</Btn></div>}
    </div>
  );
}

/* ───────────────── Блок 4 · Песочница «Двигай запятую» ───────────────── */
function DecimalSandbox({ addCoins }) {
  const start = 3.45;
  const ops = [["× 10", 10], ["× 100", 100], ["÷ 10", 0.1], ["÷ 100", 0.01]];
  const [cur, setCur] = useState(start);
  const [op, setOp] = useState(0);
  const [guess, setGuess] = useState("");
  const [log, setLog] = useState([]);
  const [fb, setFb] = useState(null);
  const [reward, setReward] = useState(false);

  function check() {
    const expected = round(cur * ops[op][1], 4);
    const g = parseFloat((guess || "").replace(",", "."));
    if (isNaN(g)) { setFb({ s: "err", t: "Сначала впиши свой прогноз результата." }); return; }
    if (Math.abs(g - expected) < 1e-9) {
      const dir = ops[op][1] >= 1 ? "вправо" : "влево";
      const places = Math.abs(Math.round(Math.log10(ops[op][1])));
      setFb({ s: "ok", t: `Точно! Запятая сдвинулась ${dir} на ${places} ${places === 1 ? "знак" : "знака"}.${reward ? "" : " +10 коинов"}` });
      if (!reward) { addCoins(10); setReward(true); }
      setLog((l) => [`${cur} ${ops[op][0]} = ${expected}`, ...l].slice(0, 4));
      setCur(expected); setGuess("");
    } else {
      setFb({ s: "err", t: "Не сходится. Считай нули: сколько нулей — на столько знаков двигается запятая." });
    }
  }
  function reset() { setCur(start); setGuess(""); setLog([]); setFb(null); }

  return (
    <div>
      <p style={{ margin: "0 0 14px", color: C.sub, fontSize: 14, lineHeight: 1.6 }}>
        Сначала <b style={{ color: C.ink }}>предскажи</b> ответ, потом проверь. Запятая двигается — наблюдай за правилом.
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 13, color: C.hint }}>Сейчас:</span>
        <span style={{ fontSize: 30, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{cur}</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {ops.map((o, i) => (
          <button key={i} onClick={() => { setOp(i); setFb(null); }}
            style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 15, cursor: "pointer",
              border: `1px solid ${op === i ? C.primary : C.line}`,
              background: op === i ? C.primarySoft : C.paper, color: C.ink, fontWeight: 500,
            }}>
            {o[0]}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14, color: C.sub }}>Мой прогноз:</span>
        <input className="pk-in" value={guess} inputMode="decimal" onChange={(e) => setGuess(e.target.value)}
          style={{ width: 110, padding: "8px 10px", fontSize: 16, borderRadius: 8, border: `1px solid ${C.line}` }} />
      </div>
      <Feedback state={fb && fb.s}>{fb && fb.t}</Feedback>
      {log.length > 0 && (
        <div style={{ marginTop: 14, fontSize: 14, color: C.sub, fontFamily: "ui-monospace, Menlo, Consolas, monospace", lineHeight: 1.7 }}>
          {log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}
      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
        <Btn primary onClick={check}>Проверить прогноз</Btn>
        <Btn onClick={reset}>Сбросить</Btn>
      </div>
    </div>
  );
}

/* ───────────────── Блок 5 · Дизайнер комнаты ───────────────── */
function RoomDesigner({ addCoins }) {
  const [w, setW] = useState(4);
  const [h, setH] = useState(3);
  const [fb, setFb] = useState(null);
  const area = w * h;
  const perim = 2 * (w + h);
  const cell = 26;

  function check() {
    if (area === 24 && perim === 20) { setFb({ s: "ok", t: "Готово! Площадь 24 м², периметр 20 м — комната 6 × 4. +20 коинов" }); addCoins(20); }
    else {
      const parts = [];
      if (area !== 24) parts.push(`площадь ${area} (нужно 24)`);
      if (perim !== 20) parts.push(`периметр ${perim} (нужно 20)`);
      setFb({ s: "err", t: `Пока не то: ${parts.join(", ")}. Меняй стороны — система пересчитывает сама.` });
    }
  }

  return (
    <div>
      <p style={{ margin: "0 0 14px", color: C.sub, fontSize: 14, lineHeight: 1.6 }}>
        Спроектируй комнату: <b style={{ color: C.ink }}>площадь 24 м²</b> и <b style={{ color: C.ink }}>периметр 20 м</b>. Расчёт проверяется автоматически.
      </p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${w}, ${cell}px)`, gridAutoRows: `${cell}px`, gap: 2, background: C.line, padding: 2, borderRadius: 6 }}>
          {Array.from({ length: w * h }).map((_, i) => (
            <div key={i} style={{ background: C.primarySoft, borderRadius: 2 }} />
          ))}
        </div>
        <div style={{ minWidth: 200, flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            <Stepper label="Ширина" value={w} set={(v) => { setW(v); setFb(null); }} min={1} max={8} unit="м" />
            <Stepper label="Высота" value={h} set={(v) => { setH(v); setFb(null); }} min={1} max={8} unit="м" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, background: C.page, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 12, color: C.hint }}>Площадь</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: area === 24 ? C.ok : C.ink }}>{area} м²</div>
            </div>
            <div style={{ flex: 1, background: C.page, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 12, color: C.hint }}>Периметр</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: perim === 20 ? C.ok : C.ink }}>{perim} м</div>
            </div>
          </div>
        </div>
      </div>
      <Feedback state={fb && fb.s}>{fb && fb.t}</Feedback>
      <div style={{ marginTop: 14 }}><Btn primary onClick={check}>Сдать проект</Btn></div>
    </div>
  );
}

/* ───────────────── Каркас ───────────────── */
const BLOCKS = [
  { id: 1, block: "Блок 1 · Натуральные и отрицательные", name: "Экспедиция по прямой", format: "Числовая прямая", level: "Б", Comp: NumberLine },
  { id: 2, block: "Блок 2 · Дроби", name: "Фабрика дробей", format: "Конструктор", level: "Б", Comp: FractionFactory },
  { id: 3, block: "Блок 3 · Действия с дробями", name: "Найди ошибку: общий знаменатель", format: "Найди ошибку", level: "П", Comp: FindError },
  { id: 4, block: "Блок 4 · Десятичные и проценты", name: "Двигай запятую", format: "Песочница-исследование", level: "С", Comp: DecimalSandbox },
  { id: 5, block: "Блок 5 · Геометрия и объём", name: "Дизайнер комнаты", format: "Авто-проверяемый конструктор", level: "С", Comp: RoomDesigner },
];

export default function MathPraktikums() {
  const [active, setActive] = useState(1);
  const [coins, setCoins] = useState(0);
  const cur = BLOCKS.find((b) => b.id === active);
  const Comp = cur.Comp;

  return (
    <div className="pk-root" style={{ background: C.page, minHeight: "100%", padding: "24px 16px", color: C.ink, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <style>{`
        .pk-root *{box-sizing:border-box}
        .pk-btn:hover:not(:disabled){filter:brightness(0.97)}
        .pk-btn:active:not(:disabled){transform:scale(0.98)}
        .pk-tick:hover{background:${C.primarySoft}}
        .pk-step{width:30px;height:30px;border-radius:8px;border:1px solid ${C.line};background:${C.paper};cursor:pointer;font-size:16px;color:${C.ink}}
        .pk-step:hover{background:${C.primarySoft}}
        .pk-in:focus{outline:none;border-color:${C.primary};box-shadow:0 0 0 3px ${C.primarySoft}}
        .pk-tab:hover{border-color:${C.primary}}
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Практикумы · Математика 5 класс</h1>
          <span style={{ marginLeft: "auto", background: C.coinSoft, color: C.coin, fontWeight: 600, fontSize: 14, padding: "5px 12px", borderRadius: 999 }}>
            ◉ {coins} коинов
          </span>
        </div>
        <p style={{ margin: "0 0 18px", color: C.sub, fontSize: 14 }}>
          Интерактивный прототип — по одному формату из палитры на каждый блок.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {BLOCKS.map((b) => (
            <button key={b.id} className="pk-tab" onClick={() => setActive(b.id)}
              style={{
                textAlign: "left", padding: "9px 13px", borderRadius: 10, cursor: "pointer",
                border: `1px solid ${active === b.id ? C.primary : C.line}`,
                background: active === b.id ? C.paper : "transparent",
                boxShadow: active === b.id ? `inset 0 -2px 0 ${C.primary}` : "none",
              }}>
              <div style={{ fontSize: 12, color: C.hint }}>Блок {b.id}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.ink, maxWidth: 130, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name}</div>
            </button>
          ))}
        </div>

        <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 16, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{cur.name}</h2>
            <Badge level={cur.level} />
            <Tag>{cur.format}</Tag>
          </div>
          <div style={{ fontSize: 13, color: C.hint, marginBottom: 18 }}>{cur.block}</div>
          <Comp addCoins={(n) => setCoins((c) => c + n)} />
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: C.hint, textAlign: "center" }}>
          Прототип для оценки разработки · автопроверка на коины · данные не сохраняются
        </p>
      </div>
    </div>
  );
}
