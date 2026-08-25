// ODDIY KASR VA YOZUV RENDERI — shu papkaga bitta (metodist qarori
// 2026-08-20: «надо чтобы дробь стоял как настоящий дробь, а не просто слэш
// и двоеточие»).
//
// Kasr IKKI QAVATLI yoziladi: surat, chiziq, maxraj -- darslikdagi kabi.
// «3/5» yoki «3:5» ko'rinishi YARAMAYDI: birinchisi bo'lish belgisi bilan
// chalkashadi, ikkinchisi esa nisbat bo'lib o'qiladi.
//
// NEGA ALOHIDA FAYL. Amaliyotda har topshiriq fayli
// mustaqil turadi (LMS bitta jsx ni oladi). Lekin kasrni uchta faylga
// nusxalash CLAUDE.md §5 ga zid bo'lardi: bitta xato uch joyda tuzatilardi.
// Shu sababli render BIR joyda turadi, papka ichida. Yig'uvchi fayl ham
// shu papkadan import qiladi, ya'ni papka allaqachon «import-siz» emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Fig } from './fig.jsx';

const MONO = "'JetBrains Mono', ui-monospace, monospace";

// Kasrning surat va maxraji asosiy o'lchamning 0,72 qismi: kichikroq bo'lsa
// kasr yozuvdan «tushib qolgandek» ko'rinadi, kattaroq bo'lsa qator o'sadi.
export const Frac = ({ n, d, size = 28, color }) => (
  <span
    style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      verticalAlign: 'middle', margin: '0 5px',
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: Math.round(size * 0.72), lineHeight: 1.04, fontWeight: 800,
      ...(color ? { color } : null),
    }}
  >
    <span style={{ padding: '0 3px' }}>{n}</span>
    <span style={{ borderTop: '2.5px solid currentColor', padding: '0 3px', width: '100%', textAlign: 'center' }}>{d}</span>
  </span>
);

// ILDIZ — USTKI CHIZIQ BILAN (metodist qarori 2026-08-24: «ustki chizig'i
// bilan bo'lsin»). Ilgari amaliyotda ildiz oddiy satr edi: `'√(a²)'`. Chiziq
// yo'q bo'lganda ildiz osti qavs bilan ajratiladi, va o'quvchi `√a + 9` ni
// ikki xil o'qishi mumkin edi. Endi ildiz ostidagi ifodaning USTIDA chiziq
// turadi, ya'ni chegara ko'rinib turadi.
//
// `deg` — ildiz DARAJASI (3, 4, 5). Kvadrat ildizda daraja yozilmaydi.
// `body` — satr yoki TOKENLAR ro'yxati: ildiz ostida kasr ham tura oladi,
// shuning uchun ichkarida yana `Row` chaqiriladi.
export function Root({ body, deg, size = 28, color }) {
  // Radikal belgisi ildiz ostidan salgina baland: shundagina uning uchi
  // ustki chiziq bilan bir sathda turadi. Chiziq qalinligi kasr chizig'idek
  // 2px -- ikki chiziq bir yozuvda uchrasa, ular bir xil ko'rinishi kerak.
  const glyph = Math.round(size * 1.16);
  const bar = size >= 20 ? 2 : 1.6;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'flex-start', verticalAlign: 'middle',
      margin: '0 2px', fontFamily: MONO, fontWeight: 800, lineHeight: 1,
      ...(color ? { color } : null),
    }}>
      {deg ? (
        <span style={{ fontSize: Math.round(size * 0.52), marginRight: -Math.round(size * 0.22), marginTop: -1 }}>{deg}</span>
      ) : null}
      <span style={{ fontSize: glyph, lineHeight: 0.92, marginTop: -Math.round(size * 0.05) }}>√</span>
      <span style={{
        borderTop: bar + 'px solid currentColor',
        paddingTop: Math.max(1, Math.round(size * 0.09)),
        paddingLeft: 1, paddingRight: 2,
        fontSize: size, lineHeight: 1.02,
        display: 'inline-flex', alignItems: 'center',
      }}>
        {typeof body === 'string' ? body : <Row tokens={body} size={Math.round(size * 0.94)} tone={false} />}
      </span>
    </span>
  );
}

// KASR KO'RSATKICHLI DARAJA. 8-darsning mavzusi aynan shu, va ko'rsatkich
// KASR bo'ladi: 64 ning ikki uchdan biri. Uni satr bilan yozib bo'lmaydi —
// `64^(2/3)` darslikning yozuvi emas. Shuning uchun ko'rsatkich asosning
// yuqori o'ng tomonida, ikki qavatli kasr bo'lib turadi.
//
// `b` — asos (satr yoki tokenlar), `e` — ko'rsatkich (satr yoki { n, d }).
export function Pow({ base, exp, size = 28, color }) {
  const es = Math.max(9, Math.round(size * 0.6));
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'flex-start', verticalAlign: 'middle',
      fontFamily: MONO, fontWeight: 800, lineHeight: 1, ...(color ? { color } : null),
    }}>
      <span style={{ fontSize: size, lineHeight: 1.02 }}>
        {typeof base === 'string' ? base : <Row tokens={base} size={size} tone={false} />}
      </span>
      <span style={{ marginLeft: 1, marginTop: -Math.round(size * 0.22), fontSize: es, lineHeight: 1 }}>
        {typeof exp === 'string' ? exp : <Row tokens={[exp]} size={es} tone={false} />}
      </span>
    </span>
  );
}

// Yozuv TOKENLAR ro'yxati:
//   'a + 3'            -- satr
//   { n: '4', d: 'a' } -- kasr
//   { r: 'a²' }        -- ildiz, ustki chiziq bilan; { r: '32', deg: '5' }
//   { b: '64', e: { n: '2', d: '3' } } -- kasr ko'rsatkichli daraja
//   { fig: 'hyp', k: 6 } -- chizma (`fig.jsx`)
// Bosqich ranglari sinf tilidan: ikkinchi bosqich ko'k, birinchi binafsha.
const toneOf = (tok) => {
  if (tok === '·' || tok === ':') return '#2C5FA8';
  if (tok === '+' || tok === '−') return '#7A4FA3';
  return null;
};

export const Row = ({ tokens, size = 28, color = '#1f2430', tone = true }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', fontFamily: MONO, fontSize: size, fontWeight: 800, color }}>
    {tokens.map((t, i) => {
      if (typeof t !== 'string') {
        if (t.fig) return <Fig key={i} spec={t} size={size} />;
        if (t.r !== undefined) return <Root key={i} body={t.r} deg={t.deg} size={size} />;
        if (t.b !== undefined) return <Pow key={i} base={t.b} exp={t.e} size={size} />;
        return <Frac key={i} n={t.n} d={t.d} size={size} />;
      }
      const c = tone ? toneOf(t) : null;
      return <span key={i} style={{ padding: '0 3px', ...(c ? { color: c } : null) }}>{t}</span>;
    })}
  </span>
);
