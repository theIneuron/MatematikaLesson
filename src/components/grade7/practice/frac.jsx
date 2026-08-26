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
import React from 'react';

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

// Yozuv TOKENLAR ro'yxati: satr yoki { n, d } -- kasr.
// Bosqich ranglari sinf tilidan: ikkinchi bosqich ko'k, birinchi binafsha.
const toneOf = (tok) => {
  if (tok === '·' || tok === ':') return '#2C5FA8';
  if (tok === '+' || tok === '−') return '#7A4FA3';
  return null;
};

// YUQORI INDEKS ALOHIDA RENDER QILINADI (metodist QA si, 2026-08-22).
// Sabab: yozuv JetBrains Mono da chiziladi, monoshirinada esa `¹` va `⁰`
// glifi ham TO'LIQ katak egallaydi -- `2¹⁰` ekranda `2¹ ⁰` bo'lib ko'rinadi
// va o'quvchi buni «2 va 10» deb o'qishi mumkin. Shuning uchun indeks
// raqamlari oddiy raqamga qaytariladi va kichraytirilgan `sup` da chiziladi.
const SUP_MAP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '−' };
const SUP_RE = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g;
const withSup = (t, key) => {
  if (!SUP_RE.test(t)) { SUP_RE.lastIndex = 0; return t; }
  SUP_RE.lastIndex = 0;
  const out = []; let last = 0; let m;
  while ((m = SUP_RE.exec(t))) {
    if (m.index > last) out.push(t.slice(last, m.index));
    out.push(
      <span key={key + '-' + m.index} style={{ fontSize: '0.58em', verticalAlign: 'super', lineHeight: 0, letterSpacing: '-0.04em' }}>
        {m[0].split('').map((c) => SUP_MAP[c] || c).join('')}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < t.length) out.push(t.slice(last));
  return out;
};

// Matn ichidagi yuqori indeks ham shu yo'l bilan chiziladi: savol satri,
// karta yozuvi, razbor -- hammasi bir xil ko'rinsin (metodist QA si).
export const Sup = ({ s }) => <>{withSup(String(s == null ? '' : s), 'x')}</>;

// Token SO'Z bo'lishi ham mumkin (masalan «va»): matematikaning o'zi
// tarjima qilinmaydi, lekin yozuv ichidagi so'z tarjima qilinishi SHART --
// aks holda o'zbekcha so'z rus va ingliz tilida ham chiqib qoladi
// (metodist QA si, 2026-08-22).
const trTok = (v, lang) => (v && typeof v === 'object' && !('n' in v) ? (v[lang] || v.uz || '') : v);

export const Row = ({ tokens, size = 28, color = '#1f2430', tone = true, lang = 'uz' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: size, fontWeight: 800, color }}>
    {tokens.map((tk, i) => {
      if (tk && typeof tk === 'object' && 'n' in tk) return <Frac key={i} n={tk.n} d={tk.d} size={size} />;
      const t = String(trTok(tk, lang));
      const c = tone ? toneOf(t) : null;
      return <span key={i} style={{ padding: '0 3px', ...(c ? { color: c } : null) }}>{withSup(t, 'p' + i)}</span>;
    })}
  </span>
);
