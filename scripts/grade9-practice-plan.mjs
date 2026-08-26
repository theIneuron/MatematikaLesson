// 9-sinf amaliyoti: JAVOBLAR VA BOSISH KETMA-KETLIGI.
//
// NEGA ALOHIDA MODUL. Javob razmetkada turmasligi kerak — aks holda uni
// o'quvchi ham ko'radi (TIPLAR_AMALIYOT_9SINF.md §5). Tekshiruv ham, kadr
// o'lchovi ham shu bitta joydan oladi, ya'ni ular ajralib qolmaydi.
//
// Harakat tili (yuruvchi: `practice-check-lib.mjs`):
//   { click: 'css' }          — bosish
//   { fill: ['nom', 'matn'] } — input[data-input="nom"] ga yozish
//   { tap: ['css1','css2'] }  — birinchisini bosib, ikkinchisiga qo'yish
// `ok` — birinchi urinishda 10/10 beradigan yo'l.
// `no` — ATAYLAB noto'g'ri yo'l: razbor chiqishi va ball berilmasligi kerak.
//        Har biri aniq bir adashishga tegadi, «shunchaki noto'g'ri» emas.

const tap = (sel) => ({ click: sel });
const zone = (item, z) => ({ tap: [`[data-item="${item}"]`, `[data-zone="${z}"]`] });
const cloze = (card, i) => ({ tap: [`[data-card="${card}"]`, `[data-slot="${i}"]`] });

// ============================================================ 1-DARS
// Funksiya va aniqlanish sohasi. Mexanikalar tartibi:
//   juftliklar · jadval · ha-yo'q · nuqta · guruhlar ·
//   taqiq · o'q · tartib · xato qator · so'zlar
const PLAN_01 = [
  { id: '01', tag: 'not_a_function',
    ok: [tap('[data-opt="2"]')],
    no: [tap('[data-opt="1"]')] },                    // qiymat takrorlandi deb o'yladi
  { id: '02', tag: 'table_both_ways',
    ok: [{ fill: ['c3', '4'] }, { fill: ['c4', '5'] }, { fill: ['c5', '13'] }],
    no: [{ fill: ['c3', '4'] }, { fill: ['c4', '10'] }, { fill: ['c5', '13'] }] },   // qatorlar almashdi
  { id: '03', tag: 'graph_claims',
    ok: ['s1:yes', 's2:no', 's3:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)) }, // bir qiymat ikki x da bo'lmaydi deb o'yladi
  { id: '04', tag: 'place_point',
    ok: [tap('[data-node="0:3"]'), tap('[data-node="-2:-3"]')],
    no: [tap('[data-node="0:0"]'), tap('[data-node="-2:-3"]')] },   // ozod had nol deb olindi
  { id: '05', tag: 'three_zones',
    ok: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))),
    no: ['i1:a', 'i2:b', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))) }, // maxraj bor, demak taqiq bor
  { id: '06', tag: 'both_bans',
    ok: [{ fill: ['set', '0; 7'] }],
    no: [{ fill: ['set', '7'] }] },                   // ikkinchi taqiq qoldi
  { id: '07', tag: 'domain_on_axis',
    ok: [tap('[data-tick="-5"]'), tap('[data-ctl="closed"]'), tap('[data-ctl="right"]')],
    no: [tap('[data-tick="-5"]'), tap('[data-ctl="open"]'), tap('[data-ctl="right"]')] }, // chegara sohaga kirmaydi deb o'yladi
  { id: '08', tag: 'order_domain',
    ok: ['c1', 'c2', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['c1', 'c2', 'c3', 'c5', 'c4'].map((x) => tap(`[data-card="${x}"]`)) }, // tekshirish javobdan oldin
  { id: '09', tag: 'first_wrong_line',
    ok: [tap('[data-row="r3"]')],
    no: [tap('[data-row="r4"]')] },                   // oxirgi xatoni tanladi, birinchisini emas
  { id: '10', tag: 'rule_words',
    ok: [cloze('w1', 0), cloze('w2', 1), cloze('w3', 2)],
    no: [cloze('w4', 0), cloze('w2', 1), cloze('w3', 2)] },  // «ikkita» — ta'rif buziladi
];

export const LESSONS = [
  { id: 'dars01', route: '/9-sinf/matematika/amaliy/dars01-amaliyot', plan: PLAN_01 },
];

export const VIEWPORTS = [
  { name: 'noutbuk', width: 1366, height: 615 },
  { name: 'noutbuk-baland', width: 1366, height: 655 },
  { name: 'katta', width: 1920, height: 950 },
  { name: 'telefon', width: 390, height: 745 },
  { name: 'telefon-kichik', width: 360, height: 690 },
];

export const LANGS = ['uz', 'ru', 'en'];
