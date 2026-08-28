// ============================================================================
// 9-SINF AMALIYOTINING O'Z MEXANIKALARI.
//
// NEGA ALOHIDA FAYL. Umumiy qatlam (`grade8/practice/kit.jsx`) 8-sinfning 55
// darsiga tegishli: undagi har tuzatish 550 topshiriqni qimirlatadi. Shuning
// uchun 9-sinf uchun kerak bo'lgan XATTI-HARAKAT shu yerda yoziladi, umumiy
// qatlamga esa faqat 8-sinf ishlatmaydigan qo'shimcha qo'shildi
// (`Given` da `fig` sloti va bir nechta `export`).
//
// NEGA TO'RTTA. Skelet bosqichida ikkitasi ko'zda tutilgan edi. Kodni o'qib
// chiqqach yana ikkitasi qo'shildi, sabab ochiq yozilgan:
//   RowTable  — `ValueTable` boshqa shakl: uning jadvali «bitta qator = bitta
//               x, ikkita ustun» va u qator TANLASHNI ham talab qiladi.
//               Bizga esa gorizontal ikki qatorli jadval kerak, va bo'sh
//               katak ARGUMENT qatorida ham turadi.
//   TypeSet   — `TypeValue` faqat BITTA butun sonni o'qiydi (`parseInt`).
//               6-topshiriqning javobi esa ikkita son, va aynan shu darsning
//               metodik nuqtasi: ko'paytmada taqiq bitta emas.
//
// UMUMIY QATLAMDAN OLINADIGANI: shapka (`Head`), berilgan bloki (`Given`),
// razborni tanlash (`pickWhy`), javob paketi (`submitPayload`), qulf
// (`useAnswer`), ro'yxatga olish (`useRegister`), kiritish katagi (`Cell`),
// klaviatura (`ExprPad`), razbor bloki (`HFB`), palitra va uslublar.
// Ya'ni dizayn va ranglar 8-sinf amaliyoti bilan bir xil — bu bitta mahsulot.
//
// KONTRAKT hamma mexanikada bir xil: `onReady`, `registerCheck`, `onSubmit`.
// O'z «Tekshirish» tugmasi YO'Q. Javob BIR MARTA tekshiriladi, keyin qulflanadi.
//
// TELEFON: tizim klaviaturasi ko'tarilmaydi (`Cell` da `inputMode="none"`),
// belgilar `ExprPad` dan olinadi. Tortish yo'q, faqat bosish.
//
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState, useCallback, useEffect } from 'react';
import {
  C, Cell, ExprPad, Given, HFB, Head, Row, S,
  num, pickWhy, submitPayload, tr, useAnswer, useIsPhone, useRegister,
} from '../../grade8/practice/kit.jsx';

// ============================================================ 1. ROWTABLE
// Gorizontal jadval: yuqori qator — argument, pastki qator — qiymat.
// Bo'sh katak IKKALA qatorda ham bo'lishi mumkin, va aynan shu narsa
// «argument bilan qiymat almashtirildi» xatosini tutadi: qiymat berilgan
// katakda argumentni tenglamadan topish kerak bo'ladi.
//
// «Hammasi yoki hech nima»: bitta katak xato bo'lsa, topshiriq o'tmaydi.
export function RowTable({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const holes = data.cols.filter((c) => c.ans !== undefined);
  const [cells, setCells] = useState(() => Object.fromEntries(holes.map((c) => [c.id, ''])));
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.cells) setCells(sa.cells); } });
  const filled = holes.every((c) => String(cells[c.id] || '').trim() !== '');
  useEffect(() => { onReady?.(filled && !A.checked); }, [filled, A.checked, onReady]);

  const valOf = (id) => num(cells[id]);
  const cellOk = (c) => { const v = valOf(c.id); return v !== null && Math.abs(v - c.ans) < 1e-9; };

  const check = useCallback(() => {
    const bad = holes.filter((c) => !cellOk(c)).map((c) => c.id);
    const correct = bad.length === 0;
    const vals = Object.fromEntries(holes.map((c) => [c.id, valOf(c.id)]));
    A.setFb({ correct, why: correct ? null : pickWhy(data, { vals, bad, cells }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { cells: { ...cells } },
      correctAnswer: { cells: Object.fromEntries(holes.map((c) => [c.id, c.ans])) }, correct,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const w = phone ? 52 : 62;
  const cellBox = (txt) => (
    <div style={{ width: w, textAlign: 'center', ...S.mono, fontSize: phone ? 15 : 16, color: C.ink, padding: '5px 0' }}>{txt}</div>
  );
  // QAYSI KATAK XATO EKANI KO'RSATILMAYDI. Uchta katakdan bittasi yashil
  // qolsa, bu to'g'ri javobni aytib qo'yish bilan barobar (metodist,
  // 2026-08-22; `Zones` da ham shu qoida). Ranglar UMUMIY natijaga qarab
  // qo'yiladi, razborni esa MATN beradi.
  const inputBox = (c) => (
    <Cell name={c.id} value={cells[c.id] || ''} disabled={A.locked} w={w}
      state={A.checked ? (A.fb?.correct ? 'ok' : 'no') : null}
      onChange={(v) => setCells((s) => ({ ...s, [c.id]: v }))} />
  );
  const rowLbl = (t) => (
    <div style={{ width: phone ? 34 : 42, textAlign: 'right', paddingRight: 6, ...S.mono, fontSize: phone ? 13 : 14, color: C.mute }}>{t}</div>
  );
  const line = (which) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {rowLbl(which === 'x' ? data.xLabel : data.yLabel)}
      {data.cols.map((c) => (
        <div key={c.id + which} style={{ borderTop: '1.5px solid ' + C.pale, borderBottom: '1.5px solid ' + C.pale, background: (c.ans !== undefined && c.hole === which) ? C.bg : 'transparent' }}>
          {c.ans !== undefined && c.hole === which ? inputBox(c) : cellBox(which === 'x' ? c.x : c.y)}
        </div>
      ))}
    </div>
  );

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '2px 0 6px' }}>
          <Row tokens={data.expr} size={data.exprSize || (phone ? 22 : 26)} />
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', overflowX: 'auto' }}>
        {line('x')}
        {line('y')}
      </div>
      {!A.locked ? <div style={{ ...S.note, marginTop: 6, textAlign: 'center' }}>{tr(data.ask, lang)}</div> : null}
      {!A.locked ? (
        <ExprPad keys={['−']} disabled={A.locked}
          onKey={(k) => {
            const t = holes.find((c) => String(cells[c.id] || '').trim() === '') || holes[holes.length - 1];
            setCells((s) => ({ ...s, [t.id]: (s[t.id] || '') + k }));
          }}
          onBack={() => {
            const rev = holes.slice().reverse();
            const t = rev.find((c) => String(cells[c.id] || '').trim() !== '') || holes[0];
            setCells((s) => ({ ...s, [t.id]: String(s[t.id] || '').slice(0, -1) }));
          }} />
      ) : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 2. PLACEPOINT
// To'rli tekislikda nuqta qo'yish. Javob — BIR YOKI BIR NECHTA tugun
// (`data.answer` — nuqtalar ro'yxati). Bosish qo'yadi, qayta bosish oladi.
//
// XATO ZONA BO'YICHA BAHOLANADI, shuning uchun har xatoning o'z razbori bor:
// koordinatalar almashtirildi, qiymat argument deb olindi, ozod had jadvaldan
// topilmadi. Bu «to'rttadan bittasi» emas: tanlash maydoni o'nlab tugundan
// iborat.
//
// Yuqorida FORMULA va GORIZONTAL jadval turadi (metodist, 2026-08-26):
// jadvalning yuqori qatori — argument, pastki qatori — qiymat, va bo'sh
// katak ikkala qatorda ham bo'lishi mumkin. Formulaning ozod hadi noma'lum,
// uni jadvalning to'liq ustunidan topish kerak — shu bilan topshiriq
// «jadvaldan ko'chirish» bo'lib qolmaydi.
//
// Bosish zonasi KO'RINIB TURADI (METODIK_PROFIL): har tugunda kulrang nuqta
// bor, butun katak esa bosiladigan tugma.
export function PlacePoint({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const [pts, setPts] = useState([]);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.pts) setPts(sa.pts); } });
  const need = data.answer.length;
  useEffect(() => { onReady?.(pts.length === need && !A.checked); }, [pts, need, A.checked, onReady]);

  const { x0, x1, y0, y1 } = data.plane;
  const st = phone ? 20 : 22;
  const W = (x1 - x0) * st;
  const Hh = (y1 - y0) * st;
  const px = (x) => (x - x0) * st;
  const py = (y) => Hh - (y - y0) * st;
  const key = (p) => p[0] + ':' + p[1];
  const fmt = (v) => (v < 0 ? '−' + Math.abs(v) : String(v));
  const toggle = (x, y) => {
    if (A.locked) return;
    setPts((s) => {
      const i = s.findIndex((p) => p[0] === x && p[1] === y);
      if (i !== -1) return s.filter((_, j) => j !== i);
      // TO'LGANDA ORTIQCHA BOSISH HECH NIMANI O'CHIRMAYDI (metodist bag-report
      // 2026-08-26: to'g'ri qo'yilgan nuqta uchinchi bosishda JIMGINA yo'qolardi
      // va topshiriq xato bo'lib chiqardi). Nuqtani olib tashlash uchun uning
      // O'ZINI qayta bosish kerak — bu ko'rinadigan amal.
      if (s.length >= need) return s;
      return s.concat([[x, y]]);
    });
  };

  const check = useCallback(() => {
    const mine = pts.map(key).sort();
    const want = data.answer.map(key).sort();
    const correct = mine.length === want.length && mine.every((v, i) => v === want[i]);
    const has = (x, y) => pts.some((p) => p[0] === x && p[1] === y);
    A.setFb({ correct, why: correct ? null : pickWhy(data, { pts, has }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { pts },
      correctAnswer: { pts: data.answer }, correct,
    }));
  }, [pts, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  // Bitta egri chiziq `curve`, bir nechtasi `curves`. Ikkinchisi
  // 10-darsda kerak bo'ldi: grafik usulda IKKALA grafik ham chiziladi.
  const curves = (data.curves || (data.curve ? [data.curve] : []))
    .map((c) => (typeof c === 'function' ? { f: c } : c));
  const nodes = [];
  for (let x = x0; x <= x1; x += 1) for (let y = y0; y <= y1; y += 1) nodes.push([x, y]);
  const dotCol = A.checked ? (A.fb?.correct ? C.ok : C.no) : C.hot;
  const cw = phone ? 46 : 56;

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {/* CHAPDA formula va jadval, O'NGDA chizma (metodist, 2026-08-26).
          Yonma-yon turgani balandlikni ham tejaydi: ustma-ust qo'yilganda
          topshiriq 1366x615 kadridan 18px chiqib ketardi. Telefonda ham
          sig'adi: jadval 164px, tekislik 186px, o'rami 390px. */}
      <div style={{ display: 'flex', gap: phone ? 6 : 14, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      {(data.expr || data.table) ? (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      {data.expr ? (
        <div style={{ textAlign: 'center' }}>
          <Row tokens={data.expr} size={data.exprSize || (phone ? 21 : 25)} />
        </div>
      ) : null}
      {/* JADVAL GORIZONTAL: yuqori qator — argument, pastki qator — qiymat.
          Bo'sh katak savol belgisi bilan turadi. Jadval IXTIYORIY: 2 va
          4-darsda tekislikda parabola turadi, jadval esa kerak emas. */}
      {data.table ? (
      <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', border: '1.5px solid ' + C.pale, borderRadius: 9, overflow: 'hidden' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ ...S.mono, fontSize: 12, color: C.mute, padding: '2px 8px', background: C.bg, width: phone ? 26 : 32, textAlign: 'center' }}>{data.table.xLabel}</div>
            {data.table.cols.map((c, i) => (
              <div key={'x' + i} style={{ ...S.mono, fontSize: phone ? 14 : 15, color: c.x === '?' ? C.hot : C.ink, padding: '2px 0', width: cw, textAlign: 'center', borderLeft: '1px solid ' + C.pale }}>{c.x}</div>
            ))}
          </div>
          <div style={{ display: 'flex', borderTop: '1px solid ' + C.pale }}>
            <div style={{ ...S.mono, fontSize: 12, color: C.mute, padding: '2px 8px', background: C.bg, width: phone ? 26 : 32, textAlign: 'center' }}>{data.table.yLabel}</div>
            {data.table.cols.map((c, i) => (
              <div key={'y' + i} style={{ ...S.mono, fontSize: phone ? 14 : 15, color: c.y === '?' ? C.hot : C.ink, padding: '2px 0', width: cw, textAlign: 'center', borderLeft: '1px solid ' + C.pale }}>{c.y}</div>
            ))}
          </div>
        </div>
      </div>
      ) : null}
      </div>
      ) : null}

        <div style={{ position: 'relative', width: W + 26, height: Hh + 22 }}>
          <svg width={W + 26} height={Hh + 22} style={{ position: 'absolute', left: 0, top: 0 }}>
            <defs>
              <clipPath id="g9pp-clip"><rect x="0" y="0" width={W} height={Hh} /></clipPath>
            </defs>
            <g transform="translate(20,2)">
              {/* to'r */}
              {Array.from({ length: x1 - x0 + 1 }, (_, i) => (
                <line key={'v' + i} x1={i * st} y1={0} x2={i * st} y2={Hh} stroke="#eef0f4" strokeWidth="1" />
              ))}
              {Array.from({ length: y1 - y0 + 1 }, (_, i) => (
                <line key={'h' + i} x1={0} y1={i * st} x2={W} y2={i * st} stroke="#eef0f4" strokeWidth="1" />
              ))}
              {/* o'qlar */}
              <line x1={0} y1={py(0)} x2={W} y2={py(0)} stroke={C.line} strokeWidth="1.6" />
              <line x1={px(0)} y1={0} x2={px(0)} y2={Hh} stroke={C.line} strokeWidth="1.6" />
              <text x={W - 2} y={py(0) - 5} textAnchor="end" style={{ ...S.mono, fontSize: 11, fill: C.mute }}>x</text>
              <text x={px(0) + 6} y={9} style={{ ...S.mono, fontSize: 11, fill: C.mute }}>y</text>
              {/* imzolar: har ikkinchi bo'linma, aks holda telefonda qo'shilib ketadi */}
              {/* IMZO HAR BO'LINMADA. Ilgari faqat juft sonlar imzolangan edi va
                  javob toq sonda turardi (y = 3): o'quvchi to'r chiziqlarini sanashga
                  majbur bo'lardi va bir chiziq adashsa, buni ko'rmasdi ham
                  (metodist bag-report 2026-08-26). */}
              {Array.from({ length: x1 - x0 + 1 }, (_, i) => x0 + i).filter((v) => v !== 0).map((v) => (
                <text key={'tx' + v} x={px(v)} y={py(0) + 12} textAnchor="middle" style={{ ...S.mono, fontSize: 9.5, fill: C.mute }}>{v}</text>
              ))}
              {Array.from({ length: y1 - y0 + 1 }, (_, i) => y0 + i).filter((v) => v !== 0).map((v) => (
                <text key={'ty' + v} x={px(0) - 5} y={py(v) + 3.5} textAnchor="end" style={{ ...S.mono, fontSize: 9.5, fill: C.mute }}>{v}</text>
              ))}
              {/* EGRI CHIZIQ — masalan parabola. `curve` matematikaning o'zi,
                  ya'ni ma'lumotda turadi va til blokidan tashqarida. */}
              {curves.map((c, ci) => (
                <polyline key={'cv' + ci}
                  points={Array.from({ length: 97 }, (_, i) => {
                    const x = x0 + ((x1 - x0) * i) / 96;
                    return px(x) + ',' + py(c.f(x));
                  }).join(' ')}
                  fill="none" stroke={c.color || C.hot} strokeWidth="2.4" strokeLinecap="round"
                  strokeLinejoin="round" opacity=".85"
                  strokeDasharray={c.dash || undefined} clipPath="url(#g9pp-clip)" />
              ))}
              {/* tugunlar ko'rinib turadi */}
              {nodes.map(([x, y]) => (
                <circle key={x + ':' + y} cx={px(x)} cy={py(y)} r="1.6" fill="#cfd6e0" />
              ))}
              {/* OLDINDAN BELGILANGAN nuqtalar: javobga kirmaydi, lekin
                  ularsiz «bunga simmetrik nuqtani qo'ying» degan topshiriqni
                  umuman qo'yib bo'lmaydi — nimaga nisbatan ekani ko'rinmaydi. */}
              {(data.marks || []).map((m) => (
                <g key={'m' + m[0] + ':' + m[1]}>
                  <circle cx={px(m[0])} cy={py(m[1])} r="5" fill={C.ink} />
                  <text x={px(m[0]) + 9} y={py(m[1]) - 7} style={{ ...S.mono, fontSize: 10.5, fill: C.soft }}>{'(' + fmt(m[0]) + '; ' + fmt(m[1]) + ')'}</text>
                </g>
              ))}
              {/* QO'YILGAN NUQTA O'Z KOORDINATASI BILAN TURADI: o'quvchi nimani
                  qo'yganini KO'RADI, sanab chiqishi shart emas. Yozuv nuqtadan
                  o'ngda, kadr chetiga yaqin bo'lsa — chapda. */}
              {pts.map((p) => {
                const right = px(p[0]) < W - 46;
                return (
                  <g key={'p' + key(p)}>
                    <circle cx={px(p[0])} cy={py(p[1])} r="6" fill="#fff" stroke={dotCol} strokeWidth="3" />
                    <text x={px(p[0]) + (right ? 10 : -10)} y={py(p[1]) - 8} textAnchor={right ? 'start' : 'end'}
                      style={{ ...S.mono, fontSize: 11, fill: dotCol }}>{'(' + fmt(p[0]) + '; ' + fmt(p[1]) + ')'}</text>
                  </g>
                );
              })}
            </g>
          </svg>
          {/* bosiladigan kataklar: butun katak tugma, nuqta esa markazida */}
          <div style={{ position: 'absolute', left: 20, top: 2, width: W, height: Hh }}>
            {nodes.map(([x, y]) => (
              <button key={'b' + x + ':' + y} type="button" data-node={x + ':' + y} disabled={A.locked}
                onClick={() => toggle(x, y)} aria-label={x + ';' + y}
                style={{
                  position: 'absolute', left: px(x) - st / 2, top: py(y) - st / 2, width: st, height: st,
                  border: 0, background: 'transparent', padding: 0, borderRadius: '50%',
                  cursor: A.locked ? 'default' : 'pointer',
                }} />
            ))}
          </div>
        </div>
      </div>
      {!A.locked ? <div style={{ ...S.note, marginTop: 5, textAlign: 'center' }}>{tr(data.ask, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 2b. AUDITLINES
// Tayyor yechimning BIRINCHI xato qatorini topish, QO'SHIMCHA SAVOLSIZ.
//
// Metodist qarori 2026-08-26: 9-sinfda bu topshiriqda pastdagi «qaysi sonda
// buziladi» maydoni bo'lmaydi, faqat to'rt qatorli ketma-ketlik qoladi.
// Tushuntirish javobdan keyin `correctText` da beriladi.
//
// Umumiy qatlamdagi `AuditRows` ikkita shartni talab qiladi (qator VA
// qarshi misol), ya'ni bu boshqa XATTI-HARAKAT — shuning uchun sinfning
// o'z mexanikasi (`TIPLAR_AMALIYOT_9SINF.md` §4).
export function AuditLines({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) setPicked(sa.row ?? null); } });
  useEffect(() => { onReady?.(picked != null && !A.checked); }, [picked, A.checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === data.answerId;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { picked }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { row: picked },
      correctAnswer: { row: data.answerId }, correct,
    }));
  }, [picked, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <Given data={data} lang={lang} />
      <p style={{ ...S.ask, margin: '2px 0 6px' }}>{tr(data.ask, lang)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 }}>
        {data.rows.map((r, i) => {
          const on = picked === r.id;
          let bd = '#d6dae3'; let bg = '#fff';
          if (on) { bd = C.hot; bg = C.hotBg; }
          if (A.checked && on) { const ok = A.fb?.correct; bd = ok ? C.ok : C.no; bg = ok ? C.okBg : C.noBg; }
          return (
            <button key={r.id} type="button" data-row={r.id} disabled={A.locked} onClick={() => setPicked(r.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 9px', borderRadius: 10, border: '2px solid ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer', textAlign: 'left' }}>
              <span style={{ ...S.mono, fontSize: 13, color: C.mute, flex: '0 0 16px' }}>{i + 1}</span>
              {r.text ? <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{tr(r.text, lang)}</span> : null}
              {r.tokens ? <Row tokens={r.tokens} size={data.exprSize || 18} /> : null}
            </button>
          );
        })}
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 3. TYPESET
// Javob — BIR NECHTA son. `TypeValue` faqat bitta butun son o'qiydi, shuning
// uchun bu yerda o'z o'qish funksiyasi bor: nuqta-vergul, vergul yoki bo'sh
// joy bilan ajratilgan sonlar TO'PLAM sifatida solishtiriladi. Tartib
// ahamiyatsiz, takror sonlar bir marta hisoblanadi.
const readSet = (raw) => {
  const parts = String(raw || '').split(/[;,\s]+/).map((t) => t.trim()).filter(Boolean);
  if (!parts.length) return null;
  const out = [];
  for (const p of parts) {
    const v = num(p);
    if (v === null) return null;
    if (!out.some((q) => Math.abs(q - v) < 1e-9)) out.push(v);
  }
  return out.sort((a, b) => a - b);
};

export function TypeSet({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const [val, setVal] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.raw != null) setVal(String(sa.raw)); } });
  useEffect(() => { onReady?.(val.trim() !== '' && !A.checked); }, [val, A.checked, onReady]);

  const check = useCallback(() => {
    const mine = readSet(val);
    const want = data.answer.slice().sort((a, b) => a - b);
    const correct = !!mine && mine.length === want.length && mine.every((v, i) => Math.abs(v - want[i]) < 1e-9);
    A.setFb({ correct, why: correct ? null : pickWhy(data, { set: mine, raw: val, has: (n) => !!mine && mine.some((v) => Math.abs(v - n) < 1e-9), size: mine ? mine.length : 0 }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { raw: val, set: mine },
      correctAnswer: { set: want }, correct,
    }));
  }, [val, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = A.checked ? (A.fb?.correct ? C.ok : C.no) : '#d6dae3';
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <Given data={data} lang={lang} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '4px 0 8px' }}>
          <Row tokens={data.expr} size={data.exprSize || (phone ? 24 : 30)} />
        </div>
      ) : null}
      <input data-input="set" value={val} disabled={A.locked} inputMode="none"
        autoComplete="off" spellCheck="false" onChange={(e) => setVal(e.target.value)}
        placeholder={tr(data.placeholder, lang)}
        style={{
          width: '100%', boxSizing: 'border-box', textAlign: 'center', padding: phone ? '9px 10px' : '11px 14px',
          borderRadius: 13, border: '2px solid ' + bd, background: A.locked ? '#fff' : C.bg,
          outline: 'none', ...S.mono, fontSize: phone ? 20 : 23, color: C.ink,
        }} />
      {!A.locked ? <div style={{ ...S.note, marginTop: 6, textAlign: 'center' }}>{tr(data.hint, lang)}</div> : null}
      {!A.locked ? (
        <ExprPad keys={['−', ';']} disabled={A.locked}
          onKey={(k) => setVal((s) => s + k)} onBack={() => setVal((s) => s.slice(0, -1))} />
      ) : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 4. DOMAINAXIS
// Javobni SONLAR O'QIDA ko'rsatish. Uchta rejim bor, `data.mode` bilan:
//
//   ray       chegara + nuqta turi + yo'nalish  — `x ≥ 3`, aniqlanish sohasi,
//             o'sish oralig'i, musbat qiymatlar nuri. STANDART rejim.
//   interval  IKKI chegara, har birining O'Z nuqta turi bilan — `−1 ≤ x ≤ 5`.
//   point     bitta nuqta + turi, yo'nalishsiz — tenglamaning ildizi,
//             ODZ dan chiqarib tashlangan son.
//
// NEGA UCHTA (2026-08-27). 1-4-darslarda javob har doim NUR edi va bitta
// chegara yetardi. 6-darsda javob oraliq, 7-darsda bitta nuqta, 8-darsda
// chiqarib tashlangan nuqta — ya'ni bitta chegara endi yetmaydi. Rejimsiz
// yozilgan `data` avvalgidek `ray` bo'lib qolaveradi, shuning uchun
// 1-4-darslar tegilmaydi.
//
// NUQTA TURI HAR REJIMDA SO'RALADI (`TIPLAR §2.1` p. 5): `x ≤ 5` bilan
// `x < 5` boshqa javob, va razbor NUQTA haqida gapiradi. `interval` da
// ikki chegara har xil turda bo'lishi mumkin — 17-darsda surat noli
// javobga kiradi, maxraj noli esa hech qachon.
//
// `NumberLine` (umumiy qatlam) bularning hech birini bilmaydi: u faqat
// bo'linmalarni belgilaydi.
export function DomainAxis({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const kind = data.mode || 'ray';
  const need = kind === 'interval' ? 2 : 1;
  const wantsDir = kind === 'ray';
  // `marks` — tanlangan chegaralar: { at, closed }. Tartib `at` bo'yicha.
  const [marks, setMarks] = useState([]);
  const [dir, setDir] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setMarks(sa.marks || []); setDir(sa.dir ?? null); } } });
  const full = marks.length === need && marks.every((m) => m.closed !== null);
  const ready = full && (!wantsDir || dir !== null);
  useEffect(() => { onReady?.(ready && !A.checked); }, [ready, A.checked, onReady]);

  const { from, to } = data.axis;
  const st = phone ? 25 : 30;
  const W = (to - from) * st;
  const px = (x) => (x - from) * st;
  const fmtN = (v) => (v < 0 ? '−' + Math.abs(v) : String(v));

  const tapTick = (v) => {
    if (A.locked) return;
    setMarks((s) => {
      const i = s.findIndex((m) => m.at === v);
      if (i !== -1) return s.filter((_, j) => j !== i);
      // TO'LGANDA ORTIQCHA BOSISH HECH NIMANI O'CHIRMAYDI (1-dars 04-topshirig'i
      // bilan bir xil qoida): chegarani olib tashlash uchun uning o'zini bosish.
      if (s.length >= need) return s;
      return s.concat([{ at: v, closed: null }]).sort((a, b) => a.at - b.at);
    });
  };
  const setType = (at, closed) => {
    if (A.locked) return;
    setMarks((s) => s.map((m) => (m.at === at ? { ...m, closed } : m)));
  };

  const check = useCallback(() => {
    const a = data.answer;
    const mine = marks.slice().sort((p, q) => p.at - q.at);
    let want;
    if (kind === 'interval') want = [a.a, a.b].slice().sort((p, q) => p.at - q.at);
    else want = [{ at: a.at, closed: a.closed }];
    const atOk = mine.length === want.length && mine.every((m, i) => m.at === want[i].at);
    const closedOk = atOk && mine.every((m, i) => m.closed === want[i].closed);
    const dirOk = !wantsDir || dir === a.dir;
    const correct = atOk && closedOk && dirOk;
    // RAZBOR SHARTLARI 1-darsdagi nomlar bilan qoladi (`at`, `closed`, `dir`),
    // aks holda 1-4-darslarning `wrongs` lari ishlamay qolardi.
    const st0 = {
      marks: mine, at: mine[0] ? mine[0].at : null, closed: mine[0] ? mine[0].closed : null,
      a: mine[0] || null, b: mine[1] || null, dir, atOk, closedOk, dirOk,
      has: (v) => mine.some((m) => m.at === v),
    };
    A.setFb({ correct, why: correct ? null : pickWhy(data, st0, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { marks: mine, dir },
      correctAnswer: { marks: want, dir: a.dir ?? null }, correct,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marks, dir, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const col = A.checked ? (A.fb?.correct ? C.ok : C.no) : C.hot;
  const ticks = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const shade = (() => {
    if (kind === 'interval' && marks.length === 2) return { x1: px(marks[0].at), x2: px(marks[1].at) };
    if (kind === 'ray' && marks.length === 1 && dir) {
      return dir === 'right' ? { x1: px(marks[0].at), x2: W } : { x1: 0, x2: px(marks[0].at) };
    }
    return null;
  })();

  const ctl = (on, onClick, label, key) => (
    <button key={key} type="button" data-ctl={key} disabled={A.locked} onClick={onClick}
      style={{
        padding: phone ? '4px 8px' : '5px 11px', borderRadius: 10, fontSize: phone ? 12 : 13, fontWeight: 700,
        border: '2px solid ' + (on ? C.hot : '#d6dae3'), background: on ? C.hotBg : '#fff',
        color: on ? C.ink : C.soft, cursor: A.locked ? 'default' : 'pointer', fontFamily: 'inherit',
      }}>{label}</button>
  );

  // Nuqta turining tugmalari: BITTA chegarada belgisiz (`closed` / `open`),
  // ikkitasida esa chegara soni bilan (`closed:−1`). Shu bilan 1-4-darslarning
  // tekshiruv rejasi tegilmaydi.
  const typeRow = (m) => {
    const sfx = need === 1 ? '' : ':' + m.at;
    return (
      <div key={'t' + m.at} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {need > 1 ? <span style={{ ...S.mono, fontSize: 12.5, color: C.soft }}>{fmtN(m.at)}</span> : null}
        {ctl(m.closed === true, () => setType(m.at, true), tr(data.closedLabel, lang), 'closed' + sfx)}
        {ctl(m.closed === false, () => setType(m.at, false), tr(data.openLabel, lang), 'open' + sfx)}
      </div>
    );
  };

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {/* `Given` — grafik uchun (2-darsda o'sish oralig'i grafikdan o'qiladi).
          1-dars `fig` bermaydi, demak u yerda hech nima o'zgarmaydi. */}
      <Given data={data} lang={lang} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '2px 0 6px' }}>
          <Row tokens={data.expr} size={data.exprSize || (phone ? 24 : 28)} />
        </div>
      ) : null}
      <div style={{ overflowX: 'auto' }}>
        <svg width={W + 24} height="56" style={{ display: 'block', margin: '0 auto' }}>
          <g transform="translate(12,0)">
            {shade ? (
              <line x1={shade.x1} y1="24" x2={shade.x2} y2="24"
                stroke={col} strokeWidth="5" strokeLinecap="round" opacity=".35" />
            ) : null}
            <line x1="0" y1="24" x2={W} y2="24" stroke={C.line} strokeWidth="1.8" />
            {ticks.map((v) => (
              <g key={v}>
                <line x1={px(v)} y1="19" x2={px(v)} y2="29" stroke={C.line} strokeWidth="1.4" />
                <text x={px(v)} y="44" textAnchor="middle" style={{ ...S.mono, fontSize: 10, fill: marks.some((m) => m.at === v) ? C.hot : C.mute }}>{v}</text>
              </g>
            ))}
            {marks.map((m) => (
              <circle key={'c' + m.at} cx={px(m.at)} cy="24" r="6.5" fill={m.closed ? col : '#fff'} stroke={col} strokeWidth="3" />
            ))}
          </g>
        </svg>
        <div style={{ position: 'relative', height: 0 }} />
      </div>
      {/* bosiladigan bo'linmalar — o'qning ustida, zonasi ko'rinib turadi */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: -56, height: 34, overflowX: 'auto' }}>
        <div style={{ position: 'relative', width: W + 24 }}>
          {ticks.map((v) => (
            <button key={v} type="button" data-tick={v} disabled={A.locked} onClick={() => tapTick(v)}
              style={{
                position: 'absolute', left: 12 + px(v) - st / 2, top: 0, width: st, height: 34,
                border: 0, background: 'transparent', padding: 0, cursor: A.locked ? 'default' : 'pointer',
              }} />
          ))}
        </div>
      </div>
      <div style={{ height: 24 }} />
      <div style={{ display: 'flex', gap: phone ? 8 : 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 2 }}>
        {marks.map(typeRow)}
        {wantsDir ? (
          <div style={{ display: 'flex', gap: 5 }}>
            {ctl(dir === 'left', () => !A.locked && setDir('left'), '←', 'left')}
            {ctl(dir === 'right', () => !A.locked && setDir('right'), '→', 'right')}
          </div>
        ) : null}
      </div>
      {!A.locked ? <div style={{ ...S.note, marginTop: 7, textAlign: 'center' }}>{tr(data.ask, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 5. FUNCGRAPH
// Grafik — RASM, mexanika emas. U `Given` ning `fig` slotiga tushadi va
// istalgan mexanika bilan ishlaydi: `TrueFalse`, `Choice`, `Zones`. Shu
// sababli u alohida mexanika sifatida pulga kiritilmagan
// (`TIPLAR_AMALIYOT_9SINF.md` §1 p. 2).
//
// `f` — funksiyaning O'ZI (matematika, til blokidan tashqarida). Aniqlanish
// sohasidan tashqarida chizilmaydi: 1-darsning butun gapi shu — grafik
// tugagan joyda qiymat ham yo'q.
export function FuncGraph({ f, domain, plane, xLabel = 'x', yLabel = 'y', step: stepPx }) {
  const phone = useIsPhone();
  const { x0, x1, y0, y1 } = plane;
  const st = stepPx || (phone ? 20 : 24);
  const W = (x1 - x0) * st;
  const H = (y1 - y0) * st;
  const px = (x) => (x - x0) * st;
  const py = (y) => H - (y - y0) * st;
  const [a, b] = domain;
  const pts = [];
  const N = 48;
  for (let i = 0; i <= N; i += 1) {
    const x = a + ((b - a) * i) / N;
    pts.push(px(x) + ',' + py(f(x)));
  }
  return (
    <svg width={W + 26} height={H + 22} style={{ display: 'block' }}>
      <g transform="translate(20,2)">
        {Array.from({ length: x1 - x0 + 1 }, (_, i) => (
          <line key={'v' + i} x1={i * st} y1={0} x2={i * st} y2={H} stroke="#eef0f4" strokeWidth="1" />
        ))}
        {Array.from({ length: y1 - y0 + 1 }, (_, i) => (
          <line key={'h' + i} x1={0} y1={i * st} x2={W} y2={i * st} stroke="#eef0f4" strokeWidth="1" />
        ))}
        <line x1={0} y1={py(0)} x2={W} y2={py(0)} stroke={C.line} strokeWidth="1.6" />
        <line x1={px(0)} y1={0} x2={px(0)} y2={H} stroke={C.line} strokeWidth="1.6" />
        <text x={W - 2} y={py(0) - 5} textAnchor="end" style={{ ...S.mono, fontSize: 11, fill: C.mute }}>{xLabel}</text>
        <text x={px(0) + 6} y={9} style={{ ...S.mono, fontSize: 11, fill: C.mute }}>{yLabel}</text>
        {Array.from({ length: x1 - x0 + 1 }, (_, i) => x0 + i).filter((v) => v !== 0 && v % 2 === 0).map((v) => (
          <text key={'tx' + v} x={px(v)} y={py(0) + 12} textAnchor="middle" style={{ ...S.mono, fontSize: 9.5, fill: C.mute }}>{v}</text>
        ))}
        {Array.from({ length: y1 - y0 + 1 }, (_, i) => y0 + i).filter((v) => v !== 0 && v % 2 === 0).map((v) => (
          <text key={'ty' + v} x={px(0) - 5} y={py(v) + 3.5} textAnchor="end" style={{ ...S.mono, fontSize: 9.5, fill: C.mute }}>{v}</text>
        ))}
        <polyline points={pts.join(' ')} fill="none" stroke={C.hot} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* SOHANING CHETLARI: grafik shu yerda tugaydi va bu ko'rinib turishi kerak */}
        <circle cx={px(a)} cy={py(f(a))} r="4" fill={C.hot} />
        <circle cx={px(b)} cy={py(f(b))} r="4" fill={C.hot} />
      </g>
    </svg>
  );
}
