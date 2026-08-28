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
//
// Mexanikalar tartibi darsdan darsga o'zgaradi va u KO'Z bilan emas,
// `scripts/grade9-practice-layout.mjs` bilan aniqlanadi.

const tap = (sel) => ({ click: sel });
const zone = (item, z) => ({ tap: [`[data-item="${item}"]`, `[data-zone="${z}"]`] });
const cloze = (card, i) => ({ tap: [`[data-card="${card}"]`, `[data-slot="${i}"]`] });
const node = (x, y) => tap(`[data-node="${x}:${y}"]`);

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
    ok: [node(0, 3), node(-2, -3)],
    no: [node(0, 0), node(-2, -3)] },                 // ozod had nol deb olindi
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

// ============================================================ 2-DARS
// Funksiyaning xossalari. Tartib (layout.mjs, n = 2):
//   jadval · test · ha-yo'q · guruhlar · nuqta ·
//   o'q · qiymat · xato qator · isbot · so'zlar
const PLAN_02 = [
  { id: '01', tag: 'oyna-vs-burilish',
    ok: [{ fill: ['c1', '−10'] }, { fill: ['c4', '2'] }],
    no: [{ fill: ['c1', '10'] }, { fill: ['c4', '2'] }] },   // ishora tushdi
  { id: '02', tag: 'bitta-nuqtada-xulosa',
    ok: [tap('[data-opt="3"]')],
    no: [tap('[data-opt="0"]')] },                    // bitta juftlikdan «juft» deb xulosa
  { id: '03', tag: 'bitta-tarmoq',
    ok: ['s1:yes', 's2:no', 's3:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes', 's3:yes'].map((x) => tap(`[data-tf="${x}"]`)) }, // butun sohada o'suvchi deb o'yladi
  { id: '04', tag: 'oyna-vs-burilish',
    ok: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))),
    no: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:b'].map((x) => zone(...x.split(':'))) }, // x³ + 1 toq deb olindi
  { id: '05', tag: 'oyna-vs-burilish',
    ok: [node(-2, -3)],
    no: [node(-2, 3)] },                              // oyna simmetriyasi qo'llanildi
  { id: '06', tag: 'bitta-tarmoq',
    ok: [tap('[data-tick="1"]'), tap('[data-ctl="closed"]'), tap('[data-ctl="right"]')],
    no: [tap('[data-tick="1"]'), tap('[data-ctl="closed"]'), tap('[data-ctl="left"]')] }, // kamayish oralig'i olindi
  { id: '07', tag: 'bitta-nuqtada-xulosa',
    ok: [{ fill: ['set', '−24'] }],
    no: [{ fill: ['set', '24'] }] },                  // juft deb olindi
  { id: '08', tag: 'bitta-nuqtada-xulosa',
    ok: [tap('[data-row="r3"]')],
    no: [tap('[data-row="r4"]')] },                   // oxirgi xato tanlandi
  { id: '09', tag: 'bitta-nuqtada-xulosa',
    ok: ['c1', 'c2', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['c2', 'c1', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)) }, // soha qadamisiz boshlandi
  { id: '10', tag: 'oyna-vs-burilish',
    ok: [cloze('w1', 0), cloze('w2', 1), cloze('w3', 2)],
    no: [cloze('w1', 0), cloze('w5', 1), cloze('w3', 2)] },  // Oy o'rniga Ox
];

// ============================================================ 3-DARS
// Kvadrat funksiya. Tartib (layout.mjs, n = 3):
//   ha-yo'q · yozuv · jadval · nollar · guruhlar ·
//   uchi · o'q · so'zlar · tartib · xato qator
const PLAN_03 = [
  { id: '01', tag: 'tenglama-vs-funksiya',
    ok: ['s1:yes', 's2:no', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)) }, // tenglama ham funksiya deb olindi
  { id: '02', tag: 'nol-koeff-a',
    ok: [tap('[data-opt="2"]')],
    no: [tap('[data-opt="3"]')] },                    // manfiy a nolga teng deb olindi
  { id: '03', tag: 'nol-vs-vershina',
    ok: [{ fill: ['c2', '0'] }, { fill: ['c3', '−5'] }],
    no: [{ fill: ['c2', '3'] }, { fill: ['c3', '−5'] }] },   // nol uchi deb olindi
  { id: '04', tag: 'nol-vs-vershina',
    ok: [{ fill: ['set', '0; 6'] }],
    no: [{ fill: ['set', '6'] }] },                   // ikkinchi nol qoldi
  { id: '05', tag: 'a-kattaligi-ishorasi',
    ok: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))),
    no: ['i1:a', 'i2:a', 'i3:a', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))) }, // kichik a toraytiradi deb o'yladi
  { id: '06', tag: 'nol-vs-vershina',
    ok: [node(1, -4)],
    no: [node(3, 0)] },                               // nol uchi deb olindi
  { id: '07', tag: 'nol-vs-vershina',
    ok: [tap('[data-tick="2"]'), tap('[data-ctl="open"]'), tap('[data-ctl="right"]')],
    no: [tap('[data-tick="2"]'), tap('[data-ctl="closed"]'), tap('[data-ctl="right"]')] }, // nol musbat deb olindi
  { id: '08', tag: 'nol-koeff-a',
    ok: [cloze('w1', 0), cloze('w2', 1), cloze('w3', 2)],
    no: [cloze('w4', 0), cloze('w2', 1), cloze('w3', 2)] },  // a birga teng deb olindi
  { id: '09', tag: 'tenglama-vs-funksiya',
    ok: ['c1', 'c2', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['c2', 'c1', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)) }, // tenglama birinchi qo'yildi
  { id: '10', tag: 'nol-koeff-a',
    ok: [tap('[data-row="r2"]')],
    no: [tap('[data-row="r4"]')] },                   // oxirgi xato tanlandi
];

// ============================================================ 4-DARS
// Parabola. Tartib (layout.mjs, n = 4):
//   ikki parabola · ha-yo'q · jadval · o'q · guruhlar ·
//   uchi · simmetriya · yasash · so'zlar · xato qator
const PLAN_04 = [
  { id: '01', tag: 'x0-formula-belgisi',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                    // ozod had ordinataga ta'sir qilmaydi deb o'yladi
  { id: '02', tag: 'simmetriya-oqi-vertikal',
    ok: ['s1:yes', 's2:no', 's3:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes', 's3:yes'].map((x) => tap(`[data-tf="${x}"]`)) }, // gorizontal chiziq o'q deb olindi
  { id: '03', tag: 'nosimmetrik-nuqtalar',
    ok: [{ fill: ['c3', '−2'] }, { fill: ['c5', '3'] }],
    no: [{ fill: ['c3', '2'] }, { fill: ['c5', '3'] }] },    // ishora tushdi
  { id: '04', tag: 'x0-formula-belgisi',
    ok: [tap('[data-tick="4"]'), tap('[data-ctl="closed"]'), tap('[data-ctl="right"]')],
    no: [tap('[data-tick="8"]'), tap('[data-ctl="closed"]'), tap('[data-ctl="right"]')] }, // maxrajda 2a emas, a olindi
  { id: '05', tag: 'x0-formula-belgisi',
    ok: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))),
    no: ['i1:c', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))) }, // musbat b o'ngga deb olindi
  { id: '06', tag: 'x0-formula-belgisi',
    ok: [{ fill: ['set', '4'] }],
    no: [{ fill: ['set', '3'] }] },                   // abssissa javob deb berildi
  { id: '07', tag: 'nosimmetrik-nuqtalar',
    ok: [node(-5, 0)],
    no: [node(1, 0)] },                               // Oy ga nisbatan aks ettirildi
  { id: '08', tag: 'nollarsiz-grafik',
    ok: ['c1', 'c2', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['c1', 'c4', 'c2', 'c3', 'c5'].map((x) => tap(`[data-card="${x}"]`)) }, // simmetrik nuqtalar uchidan oldin
  { id: '09', tag: 'simmetriya-oqi-vertikal',
    ok: [cloze('w1', 0), cloze('w2', 1), cloze('w3', 2)],
    no: [cloze('w1', 0), cloze('w5', 1), cloze('w3', 2)] },  // gorizontal o'q
  { id: '10', tag: 'x0-formula-belgisi',
    ok: [tap('[data-row="r3"]')],
    no: [tap('[data-row="r4"]')] },                   // oxirgi xato tanlandi
];

// ============================================================ 5-DARS
// Grafiklarni ko'chirish. Tartib (layout.mjs, n = 5):
//   jadval · ha-yo'q · o'zgarish · uchi · o'q ·
//   guruhlar · abssissa · xato qator · so'zlar · yasash
const PLAN_05 = [
  { id: '01', tag: 'uchi-notogri-oqish',
    ok: [{ fill: ['c2', '1'] }, { fill: ['c3', '−3'] }],
    no: [{ fill: ['c2', '−1'] }, { fill: ['c3', '−3'] }] },   // qavsdagi ishora teskari o'qildi
  { id: '02', tag: 'ishora-teskari-siljish',
    ok: ['s1:yes', 's2:no', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)) }, // uchi (3; −2) deb olindi
  { id: '03', tag: 'gorizontal-vertikal-almashinish',
    ok: [tap('[data-opt="1"]')],
    no: [tap('[data-opt="0"]')] },                    // qavsdagi son yuqoriga ko'taradi deb o'yladi
  { id: '04', tag: 'uchi-notogri-oqish',
    ok: [node(-2, -3)],
    no: [node(2, -3)] },                              // abssissaning ishorasi teskari
  { id: '05', tag: 'uchi-notogri-oqish',
    ok: [tap('[data-tick="3"]'), tap('[data-ctl="closed"]'), tap('[data-ctl="right"]')],
    no: [tap('[data-tick="1"]'), tap('[data-ctl="closed"]'), tap('[data-ctl="right"]')] }, // chegara qavsdan tashqaridagi sondan olindi
  { id: '06', tag: 'gorizontal-vertikal-almashinish',
    ok: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))),
    no: ['i1:b', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))) }, // qavsdagi minus chapga deb olindi
  { id: '07', tag: 'ishora-teskari-siljish',
    ok: [{ fill: ['set', '−7'] }],
    no: [{ fill: ['set', '7'] }] },                   // ishora teskari
  { id: '08', tag: 'ishora-teskari-siljish',
    ok: [tap('[data-row="r2"]')],
    no: [tap('[data-row="r4"]')] },                   // oxirgi xato tanlandi
  { id: '09', tag: 'a-joyni-ozgartirmaydi',
    ok: [cloze('w1', 0), cloze('w2', 1), cloze('w3', 2)],
    no: [cloze('w1', 0), cloze('w5', 1), cloze('w3', 2)] },   // o'ngga o'rniga chapga
  { id: '10', tag: 'uchi-notogri-oqish',
    ok: ['c1', 'c2', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['c2', 'c1', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)) }, // natija solishtirishdan oldin
];

// ============================================================ 6-DARS
// Kvadrat tengsizliklar. Tartib (layout.mjs, n = 6):
//   ha-yo'q · jadval · javob shakli · guruhlar · o'q ·
//   nollar · kesishish · so'zlar · xato qator · tartib
const PLAN_06 = [
  { id: '01', tag: 'javob-doim-tashqi-oraliq',
    ok: ['s1:yes', 's2:no', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:yes', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)) }, // javob tashqarida deb olindi
  { id: '02', tag: 'belgi-almashtirish-notogri',
    ok: [{ fill: ['c3', '2'] }, { fill: ['c5', '7'] }],
    no: [{ fill: ['c3', '2'] }, { fill: ['c5', '−7'] }] },   // ikki musbat qavs manfiy deb olindi
  { id: '03', tag: 'javob-doim-bitta-oraliq',
    ok: [tap('[data-opt="1"]')],
    no: [tap('[data-opt="0"]')] },                    // javob doim ichki oraliq deb o'yladi
  { id: '04', tag: 'javob-doim-tashqi-oraliq',
    ok: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))),
    no: ['i1:b', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))) }, // «kichik» ni tashqariga qo'ydi
  { id: '05', tag: 'chegara-nuqta-kiritish',
    ok: [tap('[data-tick="-1"]'), tap('[data-tick="5"]'), tap('[data-ctl="closed:-1"]'), tap('[data-ctl="closed:5"]')],
    no: [tap('[data-tick="-1"]'), tap('[data-tick="5"]'), tap('[data-ctl="open:-1"]'), tap('[data-ctl="open:5"]')] }, // qat'iy emas ekani unutildi
  { id: '06', tag: 'belgi-almashtirish-notogri',
    ok: [{ fill: ['set', '2; 6'] }],
    no: [{ fill: ['set', '−2; −6'] }] },              // ishoralar teskari
  { id: '07', tag: 'chegara-nuqta-kiritish',
    ok: [node(1, 0), node(5, 0)],
    no: [node(3, -4), node(5, 0)] },                  // uchi kesishish deb olindi
  { id: '08', tag: 'chegara-nuqta-kiritish',
    ok: [cloze('w1', 0), cloze('w2', 1), cloze('w3', 2)],
    no: [cloze('w1', 0), cloze('w2', 1), cloze('w6', 2)] },   // chegaralar kiradi deb olindi
  { id: '09', tag: 'javob-doim-tashqi-oraliq',
    ok: [tap('[data-row="r3"]')],
    no: [tap('[data-row="r4"]')] },                   // oxirgi xato tanlandi
  { id: '10', tag: 'belgi-almashtirish-notogri',
    ok: ['c1', 'c2', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['c3', 'c1', 'c2', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)) }, // nollar ajratishdan oldin
];

// ============================================================ 7-DARS
// Butun tenglamalar. Tartib (layout.mjs, n = 7):
//   qavs · jadval · ha-yo'q · ildiz · kesishish ·
//   guruhlar · ildizni yozish · tartib · xato qator · so'zlar
const PLAN_07 = [
  { id: '01', tag: 'qavs-ochish-ishorasi',
    ok: [tap('[data-opt="1"]')],
    no: [tap('[data-opt="0"]')] },                    // faqat birinchi had almashadi deb o'yladi
  { id: '02', tag: 'had-kochirish-ishorasi',
    ok: [{ fill: ['c3', '5'] }, { fill: ['c4', '15'] }],
    no: [{ fill: ['c3', '20'] }, { fill: ['c4', '15'] }] },  // to'rtga bo'lish qolib ketdi
  { id: '03', tag: 'butun-vs-kasr-tenglama',
    ok: ['s1:yes', 's2:no', 's3:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)) }, // daraja butunlikni buzadi deb o'yladi
  { id: '04', tag: 'qavs-ochish-ishorasi',
    ok: [tap('[data-tick="7"]'), tap('[data-ctl="closed"]')],
    no: [tap('[data-tick="4"]'), tap('[data-ctl="closed"]')] }, // qavs to'liq ochilmadi
  { id: '05', tag: 'tekshirish-otkazib-yuborish',
    ok: [node(3, 5)],
    no: [node(2, 4)] },                               // faqat ikkinchi chiziqda tekshirdi
  { id: '06', tag: 'butun-vs-kasr-tenglama',
    ok: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))),
    no: ['i1:a', 'i2:b', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))) }, // daraja kasr qiladi deb o'yladi
  { id: '07', tag: 'qavs-ochish-ishorasi',
    ok: [{ fill: ['set', '1'] }],
    no: [{ fill: ['set', '−1'] }] },                  // qavsdagi ikkinchi had ishorasi
  { id: '08', tag: 'tekshirish-otkazib-yuborish',
    ok: ['c1', 'c2', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['c1', 'c2', 'c3', 'c5', 'c4'].map((x) => tap(`[data-card="${x}"]`)) }, // tekshirish ildizdan oldin
  { id: '09', tag: 'qavs-ochish-ishorasi',
    ok: [tap('[data-row="r2"]')],
    no: [tap('[data-row="r4"]')] },                   // oxirgi xato tanlandi
  { id: '10', tag: 'had-kochirish-ishorasi',
    ok: [cloze('w1', 0), cloze('w2', 1), cloze('w3', 2)],
    no: [cloze('w1', 0), cloze('w5', 1), cloze('w3', 2)] },   // ko'chirishda ishora saqlanadi deb olindi
];

// ============================================================ 8-DARS
// Kasr-ratsional tenglamalar. Tartib (layout.mjs, n = 8):
//   jadval · nega ODZ · ha-yo'q · nuqta · guruhlar ·
//   taqiq · ildiz · xato qator · tartib · so'zlar
const PLAN_08 = [
  { id: '01', tag: 'butun-deb-kasr-oqish',
    ok: [{ fill: ['c2', '1'] }, { fill: ['c4', '4'] }],
    no: [{ fill: ['c2', '1'] }, { fill: ['c4', '12'] }] },   // maxraj hisobga olinmadi
  { id: '02', tag: 'begona-ildizni-qabul-qilish',
    ok: [tap('[data-opt="1"]')],
    no: [tap('[data-opt="0"]')] },                    // sabab hisob xatosi deb o'yladi
  { id: '03', tag: 'maxraj-nolga-teng',
    ok: ['s1:yes', 's2:yes', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes', 's3:yes'].map((x) => tap(`[data-tf="${x}"]`)) }, // taqiqlangan son ildiz bo'lishi mumkin deb o'yladi
  { id: '04', tag: 'butun-deb-kasr-oqish',
    ok: [node(2, 2)],
    no: [node(2, 6)] },                               // maxraj hisobga olinmadi
  { id: '05', tag: 'maxraj-nolga-teng',
    ok: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))),
    no: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:b', 'i6:c'].map((x) => zone(...x.split(':'))) }, // maxraj bor — demak taqiq bor
  { id: '06', tag: 'maxraj-nolga-teng',
    ok: [tap('[data-tick="4"]'), tap('[data-ctl="open"]')],
    no: [tap('[data-tick="4"]'), tap('[data-ctl="closed"]')] }, // chiqarilgan son javobga kiradi deb olindi
  { id: '07', tag: 'butun-deb-kasr-oqish',
    ok: [{ fill: ['set', '2'] }],
    no: [{ fill: ['set', '7'] }] },                   // maxrajni o'nga teng deb oldi
  { id: '08', tag: 'begona-ildizni-qabul-qilish',
    ok: [tap('[data-row="r3"]')],
    no: [tap('[data-row="r4"]')] },                   // oxirgi xato tanlandi
  { id: '09', tag: 'yechim-yoq-holati',
    ok: ['c1', 'c2', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['c2', 'c3', 'c4', 'c1', 'c5'].map((x) => tap(`[data-card="${x}"]`)) }, // ODZ birinchi emas
  { id: '10', tag: 'yechim-yoq-holati',
    ok: [cloze('w1', 0), cloze('w2', 1), cloze('w3', 2)],
    no: [cloze('w1', 0), cloze('w2', 1), cloze('w6', 2)] },   // «cheksiz ko'p yechim» deb olindi
];

// ============================================================ 9-DARS
// Tenglamalar sistemasi. Mexanikalar tartibi:
//   ha-yo'q · test · jadval · guruhlar · javobni kiritish ·
//   nuqta · o'q · so'zlar · tartib · xato qator
const PLAN_09 = [
  { id: '01', tag: 'sistema-ikkala-tenglama',
    ok: ['s1:yes', 's2:no', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)) }, // juftlikda tartib yo'q deb o'yladi
  { id: '02', tag: 'vieta-teskari-notogri',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                    // yig'indi o'z ishorasi bilan tushdi
  { id: '03', tag: 'sistema-ikkala-tenglama',
    ok: [{ fill: ['c3', '4'] }, { fill: ['c4', '2'] }],
    no: [{ fill: ['c3', '4'] }, { fill: ['c4', '7'] }] },   // igrek o'rniga yig'indi yozildi
  { id: '04', tag: 'sistema-ikkala-tenglama',
    ok: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))),
    no: ['i1:a', 'i2:b', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))) }, // tartib almashsa yechim emas deb o'yladi
  { id: '05', tag: 'kvadratni-tuldirish-esdan-chiqarish',
    ok: [{ fill: ['set', '8'] }],
    no: [{ fill: ['set', '16'] }] },                  // ikkiga bo'lish qadami tashlab ketildi
  { id: '06', tag: 'juftlik-tartib-farqi',
    ok: [node(4, 2)],
    no: [node(2, 4)] },                               // juftlikda sonlar o'rin almashdi
  { id: '07', tag: 'vieta-teskari-notogri',
    ok: [tap('[data-tick="3"]'), tap('[data-ctl="closed"]')],
    no: [tap('[data-tick="7"]'), tap('[data-ctl="closed"]')] }, // kattasi tanlandi
  { id: '08', tag: 'vieta-teskari-notogri',
    ok: [cloze('w1', 0), cloze('w2', 1), cloze('w3', 2)],
    no: [cloze('w4', 0), cloze('w2', 1), cloze('w3', 2)] },  // «bitta tenglama» — ta'rif buziladi
  { id: '09', tag: 'vieta-teskari-notogri',
    ok: ['c1', 'c2', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['c1', 'c2', 'c3', 'c5', 'c4'].map((x) => tap(`[data-card="${x}"]`)) }, // tekshirish javobdan oldin
  { id: '10', tag: 'juftlik-tartib-farqi',
    ok: [tap('[data-row="r3"]')],
    no: [tap('[data-row="r2"]')] },                   // ildizlar noto'g'ri deb o'yladi
];

// ============================================================ 10-DARS
// Grafik usul. Mexanikalar tartibi:
//   test · ha-yo'q · jadval · javobni kiritish · guruhlar ·
//   o'q · belgilash · tartib · so'zlar · xato qator
const PLAN_10 = [
  { id: '01', tag: 'grafik-kesishish-nuqtasi',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                    // bitta grafikda tekshirish yetarli deb o'yladi
  { id: '02', tag: 'nechta-kesishish-notogri',
    ok: ['s1:yes', 's2:yes', 's3:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes', 's3:yes'].map((x) => tap(`[data-tf="${x}"]`)) }, // kesishish doim bitta deb o'yladi
  { id: '03', tag: 'faqat-bir-chiziqda-tekshirish',
    ok: [{ fill: ['c3', '2'] }, { fill: ['c4', '2'] }],
    no: [{ fill: ['c3', '2'] }, { fill: ['c4', '4'] }] },   // igrek va iks o'rni almashdi
  { id: '04', tag: 'nechta-kesishish-notogri',
    ok: [{ fill: ['set', '-1; 2'] }],
    no: [{ fill: ['set', '2'] }] },                   // ikkinchi ildiz tushib qoldi
  { id: '05', tag: 'faqat-bir-chiziqda-tekshirish',
    ok: ['i1:a', 'i2:a', 'i3:b', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))),
    no: ['i1:a', 'i2:a', 'i3:a', 'i4:b', 'i5:c', 'i6:c'].map((x) => zone(...x.split(':'))) }, // chiziqda yotgani yechim deb olindi
  { id: '06', tag: 'nuqta-taxmin-emas-tekshiruv',
    ok: [tap('[data-tick="3"]'), tap('[data-ctl="closed"]')],
    no: [tap('[data-tick="-2"]'), tap('[data-ctl="closed"]')] }, // kichigi tanlandi
  { id: '07', tag: 'grafik-kesishish-nuqtasi',
    ok: [node(2, 3), node(-1, 0)],
    no: [node(2, 3), node(0, -1)] },                  // koordinatalar o'rin almashdi
  { id: '08', tag: 'nuqta-taxmin-emas-tekshiruv',
    ok: ['c1', 'c2', 'c3', 'c4', 'c5'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['c1', 'c2', 'c3', 'c5', 'c4'].map((x) => tap(`[data-card="${x}"]`)) }, // javob tekshiruvdan oldin
  { id: '09', tag: 'grafik-kesishish-nuqtasi',
    ok: [cloze('w1', 0), cloze('w2', 1), cloze('w3', 2)],
    no: [cloze('w1', 0), cloze('w5', 1), cloze('w3', 2)] },  // «bittadan ortiq emas» deb olindi
  { id: '10', tag: 'faqat-bir-chiziqda-tekshirish',
    ok: [tap('[data-row="r3"]')],
    no: [tap('[data-row="r4"]')] },                   // oxirgi qator xato deb o'yladi
];

export const LESSONS = [
  { id: 'dars01', route: '/9-sinf/matematika/amaliy/dars01-amaliyot', plan: PLAN_01 },
  { id: 'dars02', route: '/9-sinf/matematika/amaliy/dars02-amaliyot', plan: PLAN_02 },
  { id: 'dars03', route: '/9-sinf/matematika/amaliy/dars03-amaliyot', plan: PLAN_03 },
  { id: 'dars04', route: '/9-sinf/matematika/amaliy/dars04-amaliyot', plan: PLAN_04 },
  { id: 'dars05', route: '/9-sinf/matematika/amaliy/dars05-amaliyot', plan: PLAN_05 },
  { id: 'dars06', route: '/9-sinf/matematika/amaliy/dars06-amaliyot', plan: PLAN_06 },
  { id: 'dars07', route: '/9-sinf/matematika/amaliy/dars07-amaliyot', plan: PLAN_07 },
  { id: 'dars08', route: '/9-sinf/matematika/amaliy/dars08-amaliyot', plan: PLAN_08 },
  { id: 'dars09', route: '/9-sinf/matematika/amaliy/dars09-amaliyot', plan: PLAN_09 },
  { id: 'dars10', route: '/9-sinf/matematika/amaliy/dars10-amaliyot', plan: PLAN_10 },
];

export const VIEWPORTS = [
  { name: 'noutbuk', width: 1366, height: 615 },
  { name: 'noutbuk-baland', width: 1366, height: 655 },
  { name: 'katta', width: 1920, height: 950 },
  { name: 'telefon', width: 390, height: 745 },
  { name: 'telefon-kichik', width: 360, height: 690 },
];

export const LANGS = ['uz', 'ru', 'en'];
