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
// RADIKAL — SHRIFT GLIFI EMAS, CHIZMA (metodist, 2026-08-25: «ustki chiziq
// ildizga ULANGAN bo'lsin»). Ilgari bu yerda `√` harfi turardi va ustki chiziq
// alohida `border` edi: harfning uchi qayerda tugashini shrift hal qilardi,
// chiziq esa boshqa joydan boshlanardi — orada tirqish qolardi va uch balandligi
// ildiz ostining balandligiga ergashmasdi.
//
// Endi ilmoq, diagonal va chiziqning BOSHI bitta SVG yo'li: ular ta'rif bo'yicha
// tutashgan, tirqish paydo bo'ladigan joy yo'q. Yo'lning oxiri qutining o'ng
// yuqori burchagida turadi, ildiz ostining `borderTop` i esa aynan o'sha
// nuqtadan davom etadi (bir piksel ustma-ust tushadi, hatto soch tolasidek
// oq chiziq ham qolmasin).
//
// `preserveAspectRatio="none"` — radikal ildiz ostining BALANDLIGIGA cho'ziladi:
// ichida kasr yoki qavs tursa, uch ham o'sha balandlikka ko'tariladi.
// `vectorEffect="non-scaling-stroke"` — cho'zilganda chiziq qalinligi
// o'zgarmaydi, ya'ni u kasr chizig'i bilan bir xil bo'lib qolaveradi.
export function Root({ body, deg, size = 28, color }) {
  // Chiziq qalinligi kasrnikiga teng (`Frac` da 2,5px): bir yozuvda kasr ham,
  // ildiz ham uchrasa, ikki chiziq bir xil ko'rinishi kerak.
  const bar = size >= 26 ? 2.5 : size >= 18 ? 2 : 1.6;
  const w = Math.max(10, Math.round(size * 0.62));   // radikalning keni
  const gap = Math.max(2, Math.round(size * 0.12));  // chiziq bilan yozuv orasi
  // Yo'l: ilmoq (chapdagi kichik tikka) -> pastga tushuvchi -> uzun diagonal ->
  // o'ng yuqori burchak. Oxirgi nuqta qutining TEPASIDA (y = 0), SVG ning o'zi
  // esa `bar/2` ga pastga suriladi — shunda diagonalning uchi ustki chiziqning
  // markazi bilan bir sathda turadi, balandlik qanday bo'lishidan qat'i nazar.
  // Buni `viewBox` ichida hisoblab bo'lmaydi: u yerdagi y kadr balandligiga
  // bog'liq, ya'ni ildiz ostining balandligi bilan o'zgarib ketadi.
  const D = 'M0.6,14 L3.2,14 L6.3,23 L9.9,0 L12,0';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'stretch', verticalAlign: 'middle',
      margin: '0 2px', fontFamily: MONO, fontWeight: 800, lineHeight: 1,
      ...(color ? { color } : null),
    }}>
      {deg ? (
        // Daraja radikalning ilmog'i ustida turadi, shuning uchun u SVG ning
        // chap chetiga bir oz kiradi (manfiy margin) va tepaga tekislanadi.
        <span style={{
          fontSize: Math.max(9, Math.round(size * 0.5)),
          marginRight: -Math.round(w * 0.34),
          alignSelf: 'flex-start', lineHeight: 1,
        }}>{deg}</span>
      ) : null}
      <svg width={w} viewBox="0 0 12 24" preserveAspectRatio="none"
        style={{ display: 'block', alignSelf: 'stretch', overflow: 'visible', marginTop: bar / 2, flex: '0 0 ' + w + 'px' }}
        aria-hidden="true">
        <path d={D} fill="none" stroke="currentColor" strokeWidth={bar}
          strokeLinecap="butt" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
      </svg>
      <span style={{
        borderTop: bar + 'px solid currentColor',
        marginLeft: -2,
        paddingTop: gap, paddingLeft: 3, paddingRight: 2,
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
  <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100%', fontFamily: MONO, fontSize: size, fontWeight: 800, color }}>
    {tokens.map((t, i) => {
      if (typeof t !== 'string') {
        if (t.fig) return <Fig key={i} spec={t} size={size} />;
        if (t.r !== undefined) return <Root key={i} body={t.r} deg={t.deg} size={size} />;
        if (t.b !== undefined) return <Pow key={i} base={t.b} exp={t.e} size={size} />;
        return <Frac key={i} n={t.n} d={t.d} size={size} />;
      }
      const c = tone ? toneOf(t) : null;
      // `minWidth: 0` + `overflowWrap` — uzun token kartaning ramkasidan
      // chiqmasin (QA 2026-08-26). Avval bo'sh joyda ko'chadi; «2,2,2,3,3,4»
      // kabi bo'shliqsiz yozuvda esa vergulda bo'linadi. Kadr yetsa, hech
      // qanday ko'chish bo'lmaydi — ya'ni keng ekranda ko'rinish o'zgarmaydi.
      return <span key={i} style={{ padding: '0 3px', minWidth: 0, overflowWrap: 'anywhere', ...(c ? { color: c } : null) }}>{t}</span>;
    })}
  </span>
);
