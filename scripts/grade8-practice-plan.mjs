// 8-sinf amaliyoti: JAVOBLAR VA BOSISH KETMA-KETLIGI — HAMMA DARS UCHUN.
//
// NEGA ALOHIDA MODUL. Javob razmetkada turmasligi kerak — aks holda uni
// o'quvchi ham ko'radi (TIPLAR_AMALIYOT_8SINF.md §8). Tekshiruv ham, skroll
// o'lchovi ham shu bitta joydan oladi, ya'ni ular ajralib qolmaydi.
//
// Harakat tili:
//   { click: 'css' }          — bosish
//   { fill: ['nom', 'matn'] } — input[data-input="nom"] ga yozish
//   { range: n }              — surgichni n qiymatiga qo'yish
//   { tap: ['css1','css2'] }  — birinchisini bosib, ikkinchisiga qo'yish
// `ok` — birinchi urinishda 10/10 beradigan yo'l.
// `no` — ATAYLAB noto'g'ri yo'l: razbor chiqishi va ball berilmasligi kerak.
//        Har biri aniq bir adashishga tegadi, «shunchaki noto'g'ri» emas.

const zone = (item, z) => ({ tap: [`[data-item="${item}"]`, `[data-zone="${z}"]`] });
const slot = (card, i) => ({ tap: [`[data-card="${card}"]`, `[data-slot="${i}"]`] });
const pair = (l, r) => ({ tap: [`[data-left="${l}"]`, `[data-right="${r}"]`] });
const tap = (sel) => ({ click: sel });

// ============================================================ 1-DARS
// Ratsional ifodalar va kasrlar: kasr qaysi qiymatda ma'noga ega emas.
// Amaliyot qayta yaratildi (metodist, 2026-08-22) — tiplarni metodist bir-bir
// ko'rsatdi, shuning uchun taqsimot layout.mjs dan emas, topshiriqdan keladi:
//   test · guruhlar · ha-yo'q · pazl · yozish ·
//   belgilash · kod · so'zlar · tartib · juftlash
const PLAN_01 = [
  { id: '01', tag: 'which_claim',
    ok: [tap('[data-opt="1"]')],
    no: [tap('[data-opt="2"]')] },                                   // З18: surat noli
  { id: '02', tag: 'same_value_groups',
    ok: ['i1:z1', 'i2:z1', 'i3:z2', 'i4:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z2', 'i2:z1', 'i3:z2', 'i4:z2'].map((x) => zone(...x.split(':'))) },
  { id: '03', tag: 'true_or_false',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // З19: songa bo'lish
  { id: '04', tag: 'pair_ban',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // ishora
  { id: '05', tag: 'largest_ban',
    ok: [{ fill: ['1', '4'] }],
    no: [{ fill: ['1', '0'] }] },                                    // birinchi nolda to'xtadi
  { id: '06', tag: 'always_defined',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i2', 'i5'].map((x) => tap(`[data-item="${x}"]`)) },   // З19: (a−2)/7 tashlab ketildi
  { id: '07', tag: 'code_bans',
    ok: [slot('−2', 0), slot('0', 1), slot('4', 2)],
    no: [slot('2', 0), slot('0', 1), slot('4', 2)] },                // 2a + 4 ning ishorasi
  { id: '08', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w2', 0), slot('w1', 1), slot('w3', 2)] },             // З18: ikki nol almashdi
  { id: '09', tag: 'order_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l4'].map((x) => tap(`[data-card="${x}"]`)) },         // xulosa birinchi qoldi
  { id: '10', tag: 'info_to_frac',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't3'), pair('m3', 't2'), pair('m4', 't4')] },  // ishora
];

// ============================================================ 2-DARS
// Kasrning asosiy xossasi. Metodist qarori 2026-08-24: mexanikalar 1-darsdan,
// ketma-ketlik esa boshqa (DARS02_06_AMALIYOT_SKELET.md §2):
//   ha-yo'q · test · guruhlar · yozish · pazl ·
//   belgilash · kod · juftlash · so'zlar · tartib
const PLAN_02 = [
  { id: '01', tag: 'property_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З1: qo'shish
  { id: '02', tag: 'full_answer_choice',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З2: eski shart
  { id: '03', tag: 'property_held',
    ok: ['i1:held', 'i2:held', 'i3:held', 'i4:held', 'i5:broken', 'i6:broken', 'i7:broken', 'i8:broken'].map((x) => zone(...x.split(':'))),
    no: ['i1:held', 'i2:held', 'i3:broken', 'i4:held', 'i5:broken', 'i6:broken', 'i7:broken', 'i8:broken'].map((x) => zone(...x.split(':'))) },
  { id: '04', tag: 'new_ban_value',
    ok: [{ fill: ['1', '4'] }],
    no: [{ fill: ['1', '-1'] }] },                                       // eski taqiqni yozdi
  { id: '05', tag: 'missing_numerator',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // o'xshashlik
  { id: '06', tag: 'made_by_property',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },        // qo'shiluvchi
  { id: '07', tag: 'banned_points',
    ok: [slot('−3', 0), slot('0', 1), slot('6', 2)],
    no: [slot('3', 0), slot('0', 1), slot('6', 2)] },                    // ishora
  { id: '08', tag: 'record_to_condition',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't3'), pair('m3', 't2'), pair('m4', 't4')] },  // kvadrat
  { id: '09', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w3', 1), slot('w5', 2)],
    no: [slot('w2', 0), slot('w3', 1), slot('w5', 2)] },                 // «qo'shsak»
  { id: '10', tag: 'order_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1', 'l3', 'l2'].map((x) => tap(`[data-card="${x}"]`)) },  // shart o'rtada
];

// ============================================================ 3-DARS
// Kasrlarni qisqartirish. Metodist qarori 2026-08-24: mexanikalar 1-darsdan,
// ketma-ketlik esa boshqa (DARS02_06_AMALIYOT_SKELET.md §5):
//   belgilash · ha-yo'q · son yozish · juftlash · guruhlar ·
//   tartib · test · pazl · kod · so'zlar
const PLAN_03 = [
  { id: '01', tag: 'factor_seen',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },        // kvadratlar
  { id: '02', tag: 'cancel_claims',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },        // З1: qo'shiluvchi
  { id: '03', tag: 'hole_after_reduce',
    ok: [{ fill: ['1', '5'] }],
    no: [{ fill: ['1', '-5'] }] },                                       // surat noli
  { id: '04', tag: 'reduce_to_what',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't3'), pair('m3', 't2'), pair('m4', 't4')] },  // З1
  { id: '05', tag: 'does_it_cancel',
    ok: ['i1:yes', 'i2:yes', 'i3:yes', 'i4:yes', 'i5:no', 'i6:no', 'i7:no', 'i8:no'].map((x) => zone(...x.split(':'))),
    no: ['i1:yes', 'i2:yes', 'i3:yes', 'i4:yes', 'i5:no', 'i6:yes', 'i7:no', 'i8:no'].map((x) => zone(...x.split(':'))) },
  { id: '06', tag: 'reduce_order',
    ok: ['l4', 'l1', 'l3', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l4', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },              // shart o'rtada
  { id: '07', tag: 'full_answer_choice',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // shart javobdan
  { id: '08', tag: 'what_cancels',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // ishora
  { id: '09', tag: 'bans_survive',
    ok: [slot('−4', 0), slot('0', 1), slot('2', 2)],
    no: [slot('−4', 0), slot('0', 1), slot('4', 2)] },                   // ishora
  { id: '10', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w3', 1), slot('w5', 2)],
    no: [slot('w1', 0), slot('w3', 1), slot('w6', 2)] },                 // shart javobdan
];

// ============================================================ 4-DARS
// Kasrlarni qo'shish va ayirish. Metodist qarori 2026-08-24: mexanikalar
// 1-darsdan, ketma-ketlik esa boshqa (DARS02_06_AMALIYOT_SKELET.md §6):
//   test · belgilash · ha-yo'q · so'zlar · kod ·
//   son yozish · guruhlar · tartib · juftlash · pazl
const PLAN_04 = [
  { id: '01', tag: 'same_denominator',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З24: maxrajlar qo'shildi
  { id: '02', tag: 'add_marked_right',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i4', 'i5'].map((x) => tap(`[data-item="${x}"]`)) },        // З25: qavs yo'q
  { id: '03', tag: 'bans_from_both',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // ishora
  { id: '04', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w3', 1), slot('w5', 2)],
    no: [slot('w2', 0), slot('w3', 1), slot('w5', 2)] },                 // «maxrajlar»
  { id: '05', tag: 'bans_three_denoms',
    ok: [slot('−5', 0), slot('0', 1), slot('3', 2)],
    no: [slot('−5', 0), slot('0', 1), slot('2', 2)] },                   // suratdagi son
  { id: '06', tag: 'zero_but_banned',
    ok: [{ fill: ['1', '4'] }],
    no: [{ fill: ['1', '0'] }] },                                        // «nolda buziladi» deb o'ylash
  { id: '07', tag: 'add_correct_or_not',
    ok: ['i1:yes', 'i2:yes', 'i3:yes', 'i4:yes', 'i5:no', 'i6:no', 'i7:no', 'i8:no'].map((x) => zone(...x.split(':'))),
    no: ['i1:yes', 'i2:yes', 'i3:yes', 'i4:yes', 'i5:yes', 'i6:no', 'i7:no', 'i8:no'].map((x) => zone(...x.split(':'))) },
  { id: '08', tag: 'common_denom_order',
    ok: ['l4', 'l1', 'l4', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l4', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },              // javob keltirishdan oldin
  { id: '09', tag: 'which_common_denom',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
  { id: '10', tag: 'extra_factor',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // ishora
];

// ============================================================ 5-DARS
// Kasrlarni ko'paytirish va bo'lish. Metodist qarori 2026-08-24: mexanikalar
// 1-darsdan, ketma-ketlik esa boshqa (DARS02_06_AMALIYOT_SKELET.md §7):
//   ha-yo'q · guruhlar · belgilash · tartib · test ·
//   juftlash · pazl · so'zlar · son yozish · kod
const PLAN_05 = [
  { id: '01', tag: 'mul_div_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // ag'darmadi
  { id: '02', tag: 'mul_div_correct',
    ok: ['i1:yes', 'i2:yes', 'i3:yes', 'i4:yes', 'i5:no', 'i6:no', 'i7:no', 'i8:no'].map((x) => zone(...x.split(':'))),
    no: ['i1:yes', 'i2:yes', 'i3:yes', 'i4:yes', 'i5:no', 'i6:yes', 'i7:no', 'i8:no'].map((x) => zone(...x.split(':'))) },
  { id: '03', tag: 'flip_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },        // songa bo'lish
  { id: '04', tag: 'divide_order',
    ok: ['l4', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l4', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },              // shart o'rtada
  { id: '05', tag: 'third_condition',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З26: uchinchi shart
  { id: '06', tag: 'mul_or_div_result',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // amal belgisi
  { id: '07', tag: 'divisor_zero',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // ishora
  { id: '08', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w3', 1), slot('w5', 2)],
    no: [slot('w1', 0), slot('w4', 1), slot('w5', 2)] },                 // maxraj/surat
  { id: '09', tag: 'lost_ban_division',
    ok: [{ fill: ['1', '-1'] }],
    no: [{ fill: ['1', '6'] }] },                                        // bo'luvchining surati
  { id: '10', tag: 'three_bans',
    ok: [slot('−6', 0), slot('2', 1), slot('8', 2)],
    no: [slot('−6', 0), slot('2', 1), slot('6', 2)] },                   // ishora
];

// ============================================================ 6-DARS
// Ifodalarni almashtirish. Metodist qarori 2026-08-24: mexanikalar 1-darsdan,
// ketma-ketlik esa boshqa (DARS02_06_AMALIYOT_SKELET.md §8):
//   belgilash · test · ha-yo'q · pazl · so'zlar ·
//   guruhlar · juftlash · kod · tartib · javob
const PLAN_06 = [
  { id: '01', tag: 'first_action_mark',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i2', 'i5'].map((x) => tap(`[data-item="${x}"]`)) },        // qavsni ko'rmadi
  { id: '02', tag: 'which_first',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // chapdan o'ngga
  { id: '03', tag: 'transform_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },        // qavssiz ham qavsdek
  { id: '04', tag: 'hidden_ban_rows',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // ishora
  { id: '05', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w3', 1), slot('w5', 2)],
    no: [slot('w1', 0), slot('w3', 1), slot('w6', 2)] },                 // shart oxirgi satrdan
  { id: '06', tag: 'transform_correct',
    ok: ['i1:yes', 'i2:yes', 'i3:yes', 'i4:yes', 'i5:no', 'i6:no', 'i7:no', 'i8:no'].map((x) => zone(...x.split(':'))),
    no: ['i1:yes', 'i2:yes', 'i3:yes', 'i4:yes', 'i5:yes', 'i6:no', 'i7:no', 'i8:no'].map((x) => zone(...x.split(':'))) },
  { id: '07', tag: 'first_action',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // qavs
  { id: '08', tag: 'hidden_conditions',
    ok: [slot('−1', 0), slot('0', 1), slot('5', 2)],
    no: [slot('0', 0), slot('5', 1), slot('2', 2)] },                    // −1 topilmadi
  { id: '09', tag: 'order_of_actions',
    ok: ['l4', 'l1', 'l3', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l4', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },              // natija bo'lishdan oldin
  { id: '10', tag: 'full_transform',
    ok: [{ fill: ['1', '1'] }],
    no: [{ fill: ['1', '0'] }] },                                        // qavs nolga teng deb o'ylash
];

// ============================================================ 7-DARS
// y = k/x va uning grafigi. 1-darsning o'nta mexanikasi, boshqa tartibda
// (DARS07_11_AMALIYOT_SKELET.md §3): belgilash · ha-yo'q · guruhlar ·
// koeffitsient · nuqta · qaysi chizma · so'zlar · kod · pazl · tartib.
// To'rt topshiriqda chizma bor (03, 05, 06, 10) — chizma bosiladigan asbob
// emas, YOZUVNING bo'lagi, shuning uchun qadamlar o'zgarmaydi.
const PLAN_07 = [
  { id: '01', tag: 'inverse_marked',
    ok: ['i1', 'i4', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i2', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },      // З27: 12x qo'shildi
  { id: '02', tag: 'zero_and_product',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З2: nolda qiymat bor deb o'ylash
  { id: '03', tag: 'which_quadrants',
    ok: ['i1:z1', 'i2:z1', 'i3:z2', 'i4:z2', 'i5:z2', 'i6:z1', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z2', 'i6:z1', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // 4/(−x) ning ishorasi
  { id: '04', tag: 'find_k',
    ok: [{ fill: ['1', '-24'] }],
    no: [{ fill: ['1', '24'] }] },                                       // З28: ishora tushdi
  { id: '05', tag: 'point_to_formula',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // ishora almashdi
  { id: '06', tag: 'which_graph',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="2"]')] },                                       // З27: to'g'ri chiziq
  { id: '07', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // «yig'indisi»
  { id: '08', tag: 'table_code',
    ok: [slot('−9', 0), slot('6', 1), slot('12', 2)],
    no: [slot('9', 0), slot('6', 1), slot('12', 2)] },                   // 36 : (−4) ning ishorasi
  { id: '09', tag: 'same_x_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // ikki minus
  { id: '10', tag: 'graph_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l2'].map((x) => tap(`[data-card="${x}"]`)) },            // nuqtalar jadvaldan oldin
];

// ============================================================ 8-DARS
// Arifmetik ildiz va kasr ko'rsatkichli daraja (DARS07_11_AMALIYOT_SKELET.md §6):
//   nechta son · belgilash · qiymat · pazl · ha-yo'q ·
//   moslashtirish · guruhlar · so'zlar · tartib · kod
// Yozuvda ikki yangilik: ildiz ustki chiziq bilan va kasr ko'rsatkich ikki
// qavatli kasr bo'lib. Bosish qadamlari bundan o'zgarmaydi.
const PLAN_08 = [
  { id: '01', tag: 'one_number',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З29: ikki son
  { id: '02', tag: 'power_root_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i2', 'i3'].map((x) => tap(`[data-item="${x}"]`)) },      // maxraj bo'luvchi deb olindi
  { id: '03', tag: 'power_value',
    ok: [{ fill: ['1', '16'] }],
    no: [{ fill: ['1', '4'] }] },                                        // daraja qoldi
  { id: '04', tag: 'power_to_root',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // surat va maxraj
  { id: '05', tag: 'root_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },        // З4: hadlarga bo'lish
  { id: '06', tag: 'power_to_value',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't4'), pair('m3', 't3'), pair('m4', 't2')] },  // bir xil asos, boshqa ko'rsatkich
  { id: '07', tag: 'modulus_or_not',
    ok: ['i1:mod', 'i2:mod', 'i3:mod', 'i4:mod', 'i5:self', 'i6:self', 'i7:self', 'i8:self'].map((x) => zone(...x.split(':'))),
    no: ['i1:mod', 'i2:mod', 'i3:mod', 'i4:self', 'i5:self', 'i6:self', 'i7:self', 'i8:self'].map((x) => zone(...x.split(':'))) },  // qavs
  { id: '08', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // «musbat» nolni tashladi
  { id: '09', tag: 'power_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l2'].map((x) => tap(`[data-card="${x}"]`)) },            // ildiz kubdan oldin
  { id: '10', tag: 'code_powers',
    ok: [slot('4', 0), slot('9', 1), slot('27', 2)],
    no: [slot('3', 0), slot('9', 1), slot('27', 2)] },                   // ildiz olindi, daraja qoldi
];

// ============================================================ 9-DARS
// Kvadrat ildiz tushunchasi (DARS07_11_AMALIYOT_SKELET.md §7):
//   ha-yo'q · guruhlar · belgilash · so'zlar · chegaralar ·
//   tartib · nechta · pazl · kod · moslashtirish
const PLAN_09 = [
  { id: '01', tag: 'root_exists_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },      // З30: butun emas, demak yo'q
  { id: '02', tag: 'whole_or_not',
    ok: ['i1:whole', 'i2:whole', 'i3:whole', 'i4:whole', 'i5:not', 'i6:not', 'i7:not', 'i8:not'].map((x) => zone(...x.split(':'))),
    no: ['i1:whole', 'i2:whole', 'i3:not', 'i4:whole', 'i5:not', 'i6:not', 'i7:not', 'i8:not'].map((x) => zone(...x.split(':'))) },  // 121
  { id: '03', tag: 'has_value',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i5', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // manfiy ildiz osti
  { id: '04', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // «musbat» nolni tashladi
  { id: '05', tag: 'between_which',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // chegara bir qadam pastda
  { id: '06', tag: 'refine_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l2'].map((x) => tap(`[data-card="${x}"]`)) },            // kasr qadam butundan oldin
  { id: '07', tag: 'count_whole',
    ok: [{ fill: ['1', '7'] }],
    no: [{ fill: ['1', '6'] }] },                                        // 49 tashlab ketildi
  { id: '08', tag: 'root_to_bounds',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // chegaralar almashdi
  { id: '09', tag: 'code_roots',
    ok: [slot('3', 0), slot('8', 1), slot('15', 2)],
    no: [slot('3', 0), slot('32', 1), slot('15', 2)] },                  // 64 : 2
  { id: '10', tag: 'fact_to_record',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't4'), pair('m4', 't3')] },  // yo'q va nol
];

// ============================================================ 10-DARS
// Arifmetik kvadrat ildiz (DARS07_11_AMALIYOT_SKELET.md §8):
//   belgilash · test · ha-yo'q · kod · guruhlar ·
//   so'zlar · tartib · moslashtirish · eng kichik · pazl
const PLAN_10 = [
  { id: '01', tag: 'defined_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // manfiy ildiz osti
  { id: '02', tag: 'square_of_negative',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З31: modul tushdi
  { id: '03', tag: 'two_answers_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // tenglamaning ikki yechimi
  { id: '04', tag: 'code_modulus',
    ok: [slot('0', 0), slot('5', 1), slot('8', 2)],
    no: [slot('−5', 0), slot('5', 1), slot('8', 2)] },                   // З31: minus javobga o'tdi
  { id: '05', tag: 'exists_always_or_never',
    ok: ['i1:always', 'i2:always', 'i3:always', 'i4:always', 'i5:never', 'i6:never', 'i7:never', 'i8:never'].map((x) => zone(...x.split(':'))),
    no: ['i1:always', 'i2:always', 'i3:always', 'i4:never', 'i5:never', 'i6:never', 'i7:never', 'i8:never'].map((x) => zone(...x.split(':'))) },  // c⁴
  { id: '06', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // «kvadratini»
  { id: '07', tag: 'modulus_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l2'].map((x) => tap(`[data-card="${x}"]`)) },            // modul birinchi qadam emas
  { id: '08', tag: 'record_to_domain',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't4'), pair('m4', 't3')] },  // bitta qiymat va hech qanday
  { id: '09', tag: 'smallest_x',
    ok: [{ fill: ['1', '5'] }],
    no: [{ fill: ['1', '10'] }] },                                       // ko'paytuvchi unutildi
  { id: '10', tag: 'record_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // modul keraksiz joyda
];

// ============================================================ 11-DARS
// Arifmetik kvadrat ildizning xossalari (DARS07_11_AMALIYOT_SKELET.md §9):
//   ha-yo'q · qiymat · qaysi katta · moslashtirish · belgilash ·
//   pazl · kod · tartib · guruhlar · so'zlar
const PLAN_11 = [
  { id: '01', tag: 'compare_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З33: kvadratsiz taqqoslash
  { id: '02', tag: 'square_undo',
    ok: [{ fill: ['1', '13'] }],
    no: [{ fill: ['1', '169'] }] },                                      // ildiz e'tiborga olinmadi
  { id: '03', tag: 'which_bigger',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // tengsizlik teskari
  { id: '04', tag: 'record_to_condition',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't4'), pair('m4', 't3')] },  // ikki shart almashdi
  { id: '05', tag: 'always_true_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },      // З31: modul tushdi
  { id: '06', tag: 'value_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v3', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v1', 2)] },  // З4: hadlarga bo'lish
  { id: '07', tag: 'code_integer_part',
    ok: [slot('2', 0), slot('5', 1), slot('7', 2)],
    no: [slot('3', 0), slot('5', 1), slot('7', 2)] },                    // yuqoriga yaxlitlash
  { id: '08', tag: 'compare_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l2'].map((x) => tap(`[data-card="${x}"]`)) },            // kvadratga oshirish tashlandi
  { id: '09', tag: 'always_or_sometimes',
    ok: ['i1:always', 'i2:always', 'i3:always', 'i4:always', 'i5:some', 'i6:some', 'i7:some', 'i8:some'].map((x) => zone(...x.split(':'))),
    no: ['i1:always', 'i2:always', 'i3:always', 'i4:always', 'i5:some', 'i6:some', 'i7:some', 'i8:always'].map((x) => zone(...x.split(':'))) },  // «minus, demak yolg'on»
  { id: '10', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // «qo'shadi»
];

// ============================================================ 12-DARS
// Ko'paytmadan kvadrat ildiz. Taqsimot: DARS12_14_AMALIYOT_SKELET.md §3.
//   ha-yo'q · qiymat · guruhlar · so'zlar · pazl ·
//   juftlash · tartib · belgilash · shart · kod
const PLAN_12 = [
  { id: '01', tag: 'product_or_sum',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },       // З4: ildiz hadlarga bo'lindi
  { id: '02', tag: 'product_value',
    ok: [{ fill: ['1', '42'] }],
    no: [{ fill: ['1', '13'] }] },                                       // ildizlar qo'shildi
  { id: '03', tag: 'splits_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // З32: ko'paytmaning qiymatiga qarab
  { id: '04', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // «yig'indisiga»
  { id: '05', tag: 'split_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // kattaliklar almashdi
  { id: '06', tag: 'value_to_record',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // ko'paytma hisoblanmadi
  { id: '07', tag: 'compute_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l4'].map((x) => tap(`[data-card="${x}"]`)) },            // javob boshida qoldi
  { id: '08', tag: 'true_equality_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i2', 'i5'].map((x) => tap(`[data-item="${x}"]`)) },      // З4: 16 + 9
  { id: '09', tag: 'which_condition',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З32: ko'paytma nomanfiy bo'lsa yetadi
  { id: '10', tag: 'code_products',
    ok: [slot('6', 0), slot('8', 1), slot('30', 2)],
    no: [slot('36', 0), slot('8', 1), slot('30', 2)] },                  // ildiz olinmadi
];

// ============================================================ 13-DARS
// Ildizli ifodalarni o'zgartirish. Taqsimot: skelet §4.
//   qisqaroq · guruhlar · belgilash · ha-yo'q · juftlash ·
//   so'zlar · kod · pazl · kiritish · tartib
const PLAN_13 = [
  { id: '01', tag: 'take_out',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // ko'paytuvchilar almashdi
  { id: '02', tag: 'same_radicand',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // З34: ildiz ostilari qo'shildi
  { id: '03', tag: 'correct_transform_marked',
    ok: ['i1', 'i2', 'i3'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i2', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },      // √20 = 2√10
  { id: '04', tag: 'add_and_sign',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З32: ishora tashlandi
  { id: '05', tag: 'sum_to_result',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't4'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't1')] },  // koeffitsient 5 ikki joyda
  { id: '06', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // «har qanday ko'paytuvchi»
  { id: '07', tag: 'code_coefficients',
    ok: [slot('5', 0), slot('6', 1), slot('12', 2)],
    no: [slot('3', 0), slot('6', 1), slot('12', 2)] },                   // chiqarish oxirigacha emas
  { id: '08', tag: 'out_in_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // koeffitsient hisoblanmadi
  { id: '09', tag: 'bring_in',
    ok: [{ fill: ['1', '150'] }],
    no: [{ fill: ['1', '30'] }] },                                       // kvadratga oshirilmadi
  { id: '10', tag: 'take_out_steps',
    ok: ['l4', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l3'].map((x) => tap(`[data-card="${x}"]`)) },            // tekshirish boshida qoldi
];

// ============================================================ 14-DARS
// Irratsional sonlar. Taqsimot: skelet §5.
//   belgilash · qaysi son · ha-yo'q · kod · so'zlar ·
//   guruhlar · aniq va yaqin · nechta · isbot · juftlash
const PLAN_14 = [
  { id: '01', tag: 'rational_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i2', 'i5'].map((x) => tap(`[data-item="${x}"]`)) },      // З36: √49 tashlandi, √2 belgilandi
  { id: '02', tag: 'which_irrational',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З36: √81
  { id: '03', tag: 'record_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З34: ildiz ostilari qo'shildi
  { id: '04', tag: 'code_rational_roots',
    ok: [slot('25', 0), slot('144', 1), slot('169', 2)],
    no: [slot('18', 0), slot('144', 1), slot('169', 2)] },               // 18 = 9 · 2, sonning o'zi kvadrat emas
  { id: '05', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // «butun»
  { id: '06', tag: 'rational_or_irrational',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z2', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // З36: √100
  { id: '07', tag: 'exact_and_near',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // З37: yaqinlashish tekshirilmadi
  { id: '08', tag: 'count_finite',
    ok: [{ fill: ['1', '3'] }],
    no: [{ fill: ['1', '6'] }] },                                        // belgi qo'llanmadi
  { id: '09', tag: 'proof_steps',
    ok: ['l4', 'l1', 'l4', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l3'].map((x) => tap(`[data-card="${x}"]`)) },            // xulosa boshida qoldi
  { id: '10', tag: 'fact_to_number',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // maxraj tekshirilmadi
];

// ============================================================ 15-DARS
// Kvadrat tenglama va uning elementlari. Taqsimot: DARS15_20_AMALIYOT_SKELET.md §3.
//   kvadratmi · ozod had · ishora · juftlash · tartib ·
//   pazl · so'zlar · c ni topish · qaysi tenglama · kod
const PLAN_15 = [
  { id: '01', tag: 'is_quadratic_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },        // З38: 0·x² kvadrat deb olindi
  { id: '02', tag: 'no_constant_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i2', 'i5'].map((x) => tap(`[data-item="${x}"]`)) },        // c = −9 ni nol deb olish
  { id: '03', tag: 'sign_of_b',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z2', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // a ning minusi b ga o'tdi
  { id: '04', tag: 'abc_to_equation',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // З39: b ning ishorasi
  { id: '05', tag: 'standard_form_steps',
    ok: ['l4', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l3'].map((x) => tap(`[data-card="${x}"]`)) },              // koeffitsiyentlar boshida
  { id: '06', tag: 'abc_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // b va c almashdi
  { id: '07', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                  // «birga teng»
  { id: '08', tag: 'find_c',
    ok: [{ fill: ['1', '6'] }],
    no: [{ fill: ['1', '-6'] }] },                                        // ishora
  { id: '09', tag: 'which_quadratic_root',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                        // З38: a = 0, lekin ildiz to'g'ri
  { id: '10', tag: 'code_abc',
    ok: [slot('1', 0), slot('6', 1), slot('−7', 2)],
    no: [slot('1', 0), slot('6', 1), slot('7', 2)] },                     // З39: standart shaklga keltirilmadi
];

// ============================================================ 16-DARS
// Chala kvadrat tenglamalar. Taqsimot: skelet §4.
//   ildizlar · musbat ildiz · chala · kod · so'zlar ·
//   tartib · nechta · guruhlar · ha-yo'q · juftlash
const PLAN_16 = [
  { id: '01', tag: 'roots_of_incomplete',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                        // З42: x ga bo'lindi
  { id: '02', tag: 'positive_root',
    ok: [{ fill: ['1', '2'] }],
    no: [{ fill: ['1', '4'] }] },                                         // t² = 4 da to'xtash
  { id: '03', tag: 'incomplete_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },        // chiziqli tenglamani chala deb olish
  { id: '04', tag: 'code_largest_roots',
    ok: [slot('0', 0), slot('4', 1), slot('5', 2)],
    no: [slot('−8', 0), slot('4', 1), slot('5', 2)] },                    // З42: nol ildiz ko'rilmadi
  { id: '05', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                  // «birga teng»
  { id: '06', tag: 'factor_steps',
    ok: ['l3', 'l1', 'l4', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l4', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },              // qoida hisobdan keyin
  { id: '07', tag: 'count_of_roots',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // З40
  { id: '08', tag: 'two_roots_or_none',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z2', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // ±√5 «yo'q» deb olindi
  { id: '09', tag: 'incomplete_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З42
  { id: '10', tag: 'equation_to_roots',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't4'), pair('m4', 't3')] },  // «bitta ildiz» va «yo'q»
];

// ============================================================ 17-DARS
// Ildizlar formulasi. Taqsimot: skelet §5.
//   minus b · ildizlar · diskriminant · to'la kvadrat · kod ·
//   ha-yo'q · tartib · juftlash · pazl · so'zlar
const PLAN_17 = [
  { id: '01', tag: 'minus_b_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },        // З44: b musbat bo'lgan karta
  { id: '02', tag: 'roots_by_formula',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                        // З44: minus b da ishora
  { id: '03', tag: 'find_D',
    ok: [{ fill: ['1', '49'] }],
    no: [{ fill: ['1', '1'] }] },                                         // c manfiy bo'lganda ishora
  { id: '04', tag: 'perfect_square_zones',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // ozod had shartga mos emas
  { id: '05', tag: 'code_D',
    ok: [slot('−24', 0), slot('0', 1), slot('25', 2)],
    no: [slot('−4', 0), slot('0', 1), slot('25', 2)] },                   // to'rtga ko'paytirish tashlandi
  { id: '06', tag: 'formula_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З44
  { id: '07', tag: 'square_steps',
    ok: ['l2', 'l1', 'l4', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l3'].map((x) => tap(`[data-card="${x}"]`)) },              // kvadrat yig'ilmasdan ildiz
  { id: '08', tag: 'equation_to_roots',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // З44
  { id: '09', tag: 'D_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // c ning ishorasi
  { id: '10', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                  // З44: suratda b
];

// ============================================================ 18-DARS
// Diskriminant va ildizlar soni. Taqsimot: skelet §6.
//   ha-yo'q · ishora · nechta · ikki ildiz · juftlash ·
//   test · kod · tartib · pazl · so'zlar
const PLAN_18 = [
  { id: '01', tag: 'D_zero_claims',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },          // З9: D = 0 «ildiz yo'q»
  { id: '02', tag: 'by_D_sign',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z2', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // З9: nol karta
  { id: '03', tag: 'count_roots',
    ok: [{ fill: ['1', '1'] }],
    no: [{ fill: ['1', '0'] }] },                                         // З9
  { id: '04', tag: 'two_roots_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },        // D = 5 li karta tashlandi
  { id: '05', tag: 'D_to_count',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't3'), pair('m3', 't2'), pair('m4', 't4')] },  // З9
  { id: '06', tag: 'how_many_roots',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                        // D hisoblanmadi
  { id: '07', tag: 'code_D_values',
    ok: [slot('−20', 0), slot('0', 1), slot('49', 2)],
    no: [slot('−4', 0), slot('0', 1), slot('49', 2)] },                   // to'rtga ko'paytirish
  { id: '08', tag: 'count_steps',
    ok: ['l4', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l1', 'l2'].map((x) => tap(`[data-card="${x}"]`)) },              // xulosa boshida
  { id: '09', tag: 'count_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // З9
  { id: '10', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w1', 0), slot('w5', 1), slot('w3', 2)] },                  // З9: «ildiz yo'q»
];

// ============================================================ 19-DARS
// Viyet teoremasi. Taqsimot: skelet §7.
//   keltirilgan · yig'indi · ha-yo'q · so'zlar · kod ·
//   tartib · pazl · ikkinchi ildiz · ishoralar · juftlash
const PLAN_19 = [
  { id: '01', tag: 'reduced_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },        // a = −1 ni birga teng deb olish
  { id: '02', tag: 'sum_of_roots',
    ok: [{ fill: ['1', '11'] }],
    no: [{ fill: ['1', '-11'] }] },                                       // З45: p to'g'ridan-to'g'ri
  { id: '03', tag: 'vieta_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З45: ko'paytmada ishora
  { id: '04', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w1', 0), slot('w5', 1), slot('w3', 2)] },                  // З45: yig'indi p ga teng
  { id: '05', tag: 'code_small_roots',
    ok: [slot('2', 0), slot('3', 1), slot('4', 2)],
    no: [slot('2', 0), slot('3', 1), slot('6', 2)] },                     // q ni ildiz deb olish
  { id: '06', tag: 'vieta_steps',
    ok: ['l4', 'l1', 'l3', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l2'].map((x) => tap(`[data-card="${x}"]`)) },              // javob boshida
  { id: '07', tag: 'pq_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // З45
  { id: '08', tag: 'find_second_root',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="3"]')] },                                        // З45: yig'indi minus uch
  { id: '09', tag: 'same_or_different_sign',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z2', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // p ga qarab hukm
  { id: '10', tag: 'roots_to_equation',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // З45
];

// ============================================================ 20-DARS
// Kasr-ratsional tenglamalar. Taqsimot: skelet §8.
//   taqiq · ha-yo'q · ruxsat · kod · pazl ·
//   yechish · tartib · so'zlar · juftlash · guruhlar
const PLAN_20 = [
  { id: '01', tag: 'which_forbidden',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                        // ishora
  { id: '02', tag: 'extraneous_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },        // З3: begona ildiz qabul qilindi
  { id: '03', tag: 'allowed_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },        // kvadratlar ayirmasi
  { id: '04', tag: 'code_forbidden',
    ok: [slot('−1', 0), slot('3', 1), slot('5', 2)],
    no: [slot('1', 0), slot('3', 1), slot('5', 2)] },                     // ishora
  { id: '05', tag: 'frac_to_ban',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // qo'shishda ishora
  { id: '06', tag: 'solve_frac',
    ok: [{ fill: ['1', '3'] }],
    no: [{ fill: ['1', '4'] }] },                                         // maxrajning qiymatida to'xtash
  { id: '07', tag: 'solve_steps',
    ok: ['l2', 'l1', 'l4', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },              // З2: shart oxirga surildi
  { id: '08', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                  // «qo'shiladi»
  { id: '09', tag: 'equation_to_answer',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // З3: maxrajning ishorasi
  { id: '10', tag: 'banned_at_two',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z2', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // ajratilmagan maxraj
];

// ============================================================ 21-DARS
// Skelet: DARS21_30_AMALIYOT_SKELET.md, taqsimot §1. Ha/yo'q kombinatsiyasi
// o'sha hujjatning §13 idan (DARS07_11_AMALIYOT_SKELET.md §10 p. 9 qoidasi).
const PLAN_21 = [
  { id: '01', tag: 'same_condition_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },   // ketma-ket JUFT sonlar
  { id: '02', tag: 'rect_side',
    ok: [{ fill: ['1', '5'] }],
    no: [{ fill: ['1', '8'] }] },   // bo'yi yozildi
  { id: '03', tag: 'accept_or_reject',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z1', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },   // nol javobga kiritildi
  { id: '04', tag: 'code_real_answers',
    ok: [slot('3', 0), slot('4', 1), slot('5', 2)],
    no: [slot('−8', 0), slot('4', 1), slot('5', 2)] },   // З47: manfiy ildiz
  { id: '05', tag: 'equation_to_side',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },   // ishora
  { id: '06', tag: 'problem_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // rad etish to'g'ri bajarilgan
  { id: '07', tag: 'word_solve_steps',
    ok: ['l2', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },   // rad etish ildizlardan oldin
  { id: '08', tag: 'problem_to_equation',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },   // ketma-ket va ketma-ket juft
  { id: '09', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },   // son bilan
  { id: '10', tag: 'time_units',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },   // З45: daqiqa soatga o'tkazilmadi
];

// ============================================================ 22-DARS
// Skelet: DARS21_30_AMALIYOT_SKELET.md, taqsimot §1. Ha/yo'q kombinatsiyasi
// o'sha hujjatning §13 idan (DARS07_11_AMALIYOT_SKELET.md §10 p. 9 qoidasi).
const PLAN_22 = [
  { id: '01', tag: 'factored_form',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },   // ikkala ishora almashdi
  { id: '02', tag: 't_possible',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },   // З48: manfiy t
  { id: '03', tag: 'count_roots',
    ok: [{ fill: ['1', '4'] }],
    no: [{ fill: ['1', '2'] }] },   // t ning ildizlari sanaldi
  { id: '04', tag: 't_to_x_count',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },   // nol bitta ildiz beradi
  { id: '05', tag: 'biquadratic_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },   // toq daraja
  { id: '06', tag: 'code_root_counts',
    ok: [slot('0', 0), slot('2', 1), slot('4', 2)],
    no: [slot('8', 0), slot('2', 1), slot('4', 2)] },   // har t dan to'rtta
  { id: '07', tag: 'factor_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },   // ishora almashgan
  { id: '08', tag: 'biquad_steps',
    ok: ['l2', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },   // x ga qaytish ildizlardan oldin
  { id: '09', tag: 'biquad_to_roots',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },   // З48: manfiy t rad etilmadi
  { id: '10', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },   // ildiz
];

// ============================================================ 23-DARS
// Skelet: DARS21_30_AMALIYOT_SKELET.md, taqsimot §1. Ha/yo'q kombinatsiyasi
// o'sha hujjatning §13 idan (DARS07_11_AMALIYOT_SKELET.md §10 p. 9 qoidasi).
const PLAN_23 = [
  { id: '01', tag: 'difference_claims',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // З49: manfiy ayirma
  { id: '02', tag: 'which_greater',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },   // З51: maxraji kichik
  { id: '03', tag: 'positive_difference',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },   // З49: teskari ayirma
  { id: '04', tag: 'compare_steps',
    ok: ['l2', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },   // xulosa ayirmadan oldin
  { id: '05', tag: 'reverse_difference',
    ok: [{ fill: ['1', '-12'] }],
    no: [{ fill: ['1', '12'] }] },   // З49: tartib e'tiborga olinmadi
  { id: '06', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },   // yig'indisi
  { id: '07', tag: 'code_differences',
    ok: [slot('−3', 0), slot('−0,5', 1), slot('0,2', 2)],
    no: [slot('3', 0), slot('−0,5', 1), slot('0,2', 2)] },   // З49: teskari ayirma
  { id: '08', tag: 'pair_compare',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },   // nol holi
  { id: '09', tag: 'first_bigger_or_smaller',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },   // З51: bir beshdan va bir to’rtdan
  { id: '10', tag: 'pair_to_difference',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },   // umumiy maxraj
];

// ============================================================ 24-DARS
// Skelet: DARS21_30_AMALIYOT_SKELET.md, taqsimot §1. Ha/yo'q kombinatsiyasi
// o'sha hujjatning §13 idan (DARS07_11_AMALIYOT_SKELET.md §10 p. 9 qoidasi).
const PLAN_24 = [
  { id: '01', tag: 'sign_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // З52: ishora burilmadi
  { id: '02', tag: 'multiply_by_negative',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },   // З52
  { id: '03', tag: 'bound_after_flip',
    ok: [{ fill: ['1', '5'] }],
    no: [{ fill: ['1', '-5'] }] },   // ishora saqlab qolindi
  { id: '04', tag: 'code_smaller_side',
    ok: [slot('−5', 0), slot('3', 1), slot('6', 2)],
    no: [slot('−3', 0), slot('3', 1), slot('6', 2)] },   // kichik tomon almashdi
  { id: '05', tag: 'multiplier_to_result',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },   // nolga ko'paytirish
  { id: '06', tag: 'divide_steps',
    ok: ['l2', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },   // tekshirish javobdan oldin
  { id: '07', tag: 'flip_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z2', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },   // bo'lish ham xossa
  { id: '08', tag: 'correct_conclusion_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },   // kvadratga oshirish xossa emas
  { id: '09', tag: 'operation_to_result',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },   // З52 va З53
  { id: '10', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },   // buriladi
];

// ============================================================ 25-DARS
// Skelet: DARS21_30_AMALIYOT_SKELET.md, taqsimot §1. Ha/yo'q kombinatsiyasi
// o'sha hujjatning §13 idan (DARS07_11_AMALIYOT_SKELET.md §10 p. 9 qoidasi).
const PLAN_25 = [
  { id: '01', tag: 'is_solution',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },   // З54: chegara nuqtasi
  { id: '02', tag: 'solutions_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i3', 'i5', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },   // З54: chegara tashlab ketildi
  { id: '03', tag: 'strict_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },   // З54: chiziqsiz belgi
  { id: '04', tag: 'smallest_integer',
    ok: [{ fill: ['1', '3'] }],
    no: [{ fill: ['1', '2'] }] },   // butun qism olindi
  { id: '05', tag: 'code_boundaries',
    ok: [slot('−3', 0), slot('0', 1), slot('5', 2)],
    no: [slot('3', 0), slot('0', 1), slot('5', 2)] },   // ishora
  { id: '06', tag: 'inequality_to_solution',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },   // З52: koeffitsiyent ishorasi
  { id: '07', tag: 'reversed_reading',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },   // noma'lum o'ngda
  { id: '08', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },   // ishorasi saqlanadi
  { id: '09', tag: 'solution_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },   // belgi qat'iy emas
  { id: '10', tag: 'solve_steps',
    ok: ['l2', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },   // tekshirish javobdan oldin
];

// ============================================================ 26-DARS
// Skelet: DARS21_30_AMALIYOT_SKELET.md, taqsimot §1. Ha/yo'q kombinatsiyasi
// o'sha hujjatning §13 idan (DARS07_11_AMALIYOT_SKELET.md §10 p. 9 qoidasi).
const PLAN_26 = [
  { id: '01', tag: 'both_true_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },   // З55: bitta tengsizlik
  { id: '02', tag: 'in_or_out',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z2', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },   // З54: chegara kiradi
  { id: '03', tag: 'system_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // bo'sh kesishma
  { id: '04', tag: 'range_to_count',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },   // З54: chegaralar sanalmaydi
  { id: '05', tag: 'system_solution',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },   // З55: faqat birinchisi
  { id: '06', tag: 'code_integers',
    ok: [slot('−1', 0), slot('0', 1), slot('1', 2)],
    no: [slot('−2', 0), slot('0', 1), slot('1', 2)] },   // З54: qat'iy chegara
  { id: '07', tag: 'count_integers',
    ok: [{ fill: ['1', '7'] }],
    no: [{ fill: ['1', '6'] }] },   // chap chegara sanalmadi
  { id: '08', tag: 'system_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },   // З55: kesishtirish erta
  { id: '09', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },   // kamida bitta
  { id: '10', tag: 'system_to_answer',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },   // nurlar yo'nalishi
];

// ============================================================ 27-DARS
// Skelet: DARS21_30_AMALIYOT_SKELET.md, taqsimot §1. Ha/yo'q kombinatsiyasi
// o'sha hujjatning §13 idan (DARS07_11_AMALIYOT_SKELET.md §10 p. 9 qoidasi).
const PLAN_27 = [
  { id: '01', tag: 'interval_claims',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // З56: dumaloq qavs
  { id: '02', tag: 'count_integers_in',
    ok: [{ fill: ['1', '5'] }],
    no: [{ fill: ['1', '3'] }] },   // chegaralar tashlab ketildi
  { id: '03', tag: 'belongs_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i5', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },   // З54: chap chegara
  { id: '04', tag: 'notation_to_inequality',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },   // yarim-interval
  { id: '05', tag: 'three_inside',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z2', 'i8:z2'].map((x) => zone(...x.split(':'))) },   // ichkaridagi son
  { id: '06', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },   // yarim-interval
  { id: '07', tag: 'inequality_to_interval',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },   // З56: qavslar almashdi
  { id: '08', tag: 'write_interval_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },   // qavs qat'iylikdan oldin
  { id: '09', tag: 'interval_to_picture',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },   // to'la va bo'sh doiracha
  { id: '10', tag: 'code_smallest_integer',
    ok: [slot('−3', 0), slot('1', 1), slot('3', 2)],
    no: [slot('−4', 0), slot('1', 1), slot('3', 2)] },   // З54: dumaloq qavs
];

// ============================================================ 28-DARS
// Skelet: DARS21_30_AMALIYOT_SKELET.md, taqsimot §1. Ha/yo'q kombinatsiyasi
// o'sha hujjatning §13 idan (DARS07_11_AMALIYOT_SKELET.md §10 p. 9 qoidasi).
const PLAN_28 = [
  { id: '01', tag: 'condition_to_inequality',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },   // belgi teskari
  { id: '02', tag: 'answer_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },   // З57: solishtirish bajarilgan
  { id: '03', tag: 'fits_condition',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z1', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },   // З57: kasr sanoq
  { id: '04', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },   // son
  { id: '05', tag: 'max_count',
    ok: [{ fill: ['1', '6'] }],
    no: [{ fill: ['1', '7'] }] },   // yuqoriga yaxlitlandi
  { id: '06', tag: 'code_min_values',
    ok: [slot('5', 0), slot('7', 1), slot('10', 2)],
    no: [slot('4', 0), slot('7', 1), slot('10', 2)] },   // З54: kasr chegara
  { id: '07', tag: 'word_steps',
    ok: ['l2', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },   // butun javob erta
  { id: '08', tag: 'solution_to_answer',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },   // yaxlitlash yo'nalishi
  { id: '09', tag: 'valid_answers_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },   // З57: manfiy yo'lovchi
  { id: '10', tag: 'words_to_inequality',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },   // kamida va dan ko'p
];

// ============================================================ 29-DARS
// Skelet: DARS21_30_AMALIYOT_SKELET.md, taqsimot §1. Ha/yo'q kombinatsiyasi
// o'sha hujjatning §13 idan (DARS07_11_AMALIYOT_SKELET.md §10 p. 9 qoidasi).
const PLAN_29 = [
  { id: '01', tag: 'equals_five_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },   // modullar ayirmasi
  { id: '02', tag: 'four_or_minus_four',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z1'].map((x) => zone(...x.split(':'))) },   // tashqi minus
  { id: '03', tag: 'abs_equation',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },   // З58: faqat musbat ildiz
  { id: '04', tag: 'abs_to_set',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },   // З59: kesma va ikki nur
  { id: '05', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },   // nolga
  { id: '06', tag: 'abs_ineq_steps',
    ok: ['l2', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },   // oraliq yechimdan oldin
  { id: '07', tag: 'count_integers_abs',
    ok: [{ fill: ['1', '5'] }],
    no: [{ fill: ['1', '7'] }] },   // chegaralar sanaldi
  { id: '08', tag: 'code_negative_roots',
    ok: [slot('−6', 0), slot('−3', 1), slot('−1', 2)],
    no: [slot('6', 0), slot('−3', 1), slot('−1', 2)] },   // З58: musbat ildiz
  { id: '09', tag: 'abs_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // З59: kesma deb yozish
  { id: '10', tag: 'abs_to_answer',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },   // nol holi
];

// ============================================================ 30-DARS
// Skelet: DARS21_30_AMALIYOT_SKELET.md, taqsimot §1. Ha/yo'q kombinatsiyasi
// o'sha hujjatning §13 idan (DARS07_11_AMALIYOT_SKELET.md §10 p. 9 qoidasi).
const PLAN_30 = [
  { id: '01', tag: 'error_claims',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // xatolik manfiy emas
  { id: '02', tag: 'in_range_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },   // chegara kiradi
  { id: '03', tag: 'round_direction',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },   // З61: kesib tashlandi
  { id: '04', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },   // yig'indisi
  { id: '05', tag: 'absolute_or_relative',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },   // З60: bo'lish bor
  { id: '06', tag: 'code_bounds',
    ok: [slot('6,8', 0), slot('7', 1), slot('7,2', 2)],
    no: [slot('6,2', 0), slot('7', 1), slot('7,2', 2)] },   // xona adashdi
  { id: '07', tag: 'record_to_lower',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },   // chegara farqi
  { id: '08', tag: 'measure_to_relative',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },   // З60: bir xil absolut xatolik
  { id: '09', tag: 'compare_precision_steps',
    ok: ['l2', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l4', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },   // З60: absolut bo'yicha xulosa
  { id: '10', tag: 'relative_percent',
    ok: [{ fill: ['1', '2'] }],
    no: [{ fill: ['1', '5'] }] },   // absolut xatolik foiz deb olindi
];


// ============================================================ 31-40-DARSLAR
// Metodist tasdig'i 2026-08-25, skelet `DARS31_40_AMALIYOT_SKELET.md`.
// O'sha o'nta mexanika, har darsda boshqa tartibda (skelet §1). Bu yerda
// faqat YO'LLAR: to'g'ri javob va ataylab noto'g'ri javob. Har `no` aniq
// bir adashishga tegadi — razbor bo'sh chiqmasligi kerak (TIPLAR §8).
const PLAN_31 = [
  { id: '01', tag: 'zero_power_value',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                   // З62: a⁰ nol deb olindi
  { id: '02', tag: 'defined_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z2', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },
  { id: '03', tag: 'power_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },    // З63: 3⁻² rad etildi
  { id: '04', tag: 'power_to_value',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
  { id: '05', tag: 'neg_power_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '06', tag: 'equal_one_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },   // 0⁰ birga teng deb olindi
  { id: '07', tag: 'base_to_value',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
  { id: '08', tag: 'denominator_of_power',
    ok: [{ fill: ['1', '81'] }],
    no: [{ fill: ['1', '12'] }] },                                   // ko'rsatkich ko'paytuvchi deb olindi
  { id: '09', tag: 'code_exponents',
    ok: [slot('−3', 0), slot('−2', 1), slot('0', 2)],
    no: [slot('3', 0), slot('−2', 1), slot('0', 2)] },               // З63: ishora yo'qoldi
  { id: '10', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },             // З62
];

const PLAN_32 = [
  { id: '01', tag: 'equal_a5_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },   // З65: (a²)³ qo'shildi
  { id: '02', tag: 'product_exponent',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                   // З64
  { id: '03', tag: 'quotient_exponent',
    ok: [{ fill: ['1', '3'] }],
    no: [{ fill: ['1', '11'] }] },                                   // З64: bo'lishda qo'shildi
  { id: '04', tag: 'simplify_steps',
    ok: ['l2', 'l1', 'l4', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '05', tag: 'op_to_result',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
  { id: '06', tag: 'expr_to_power',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
  { id: '07', tag: 'property_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // З65: qavssiz ham ko'paytirildi
  { id: '08', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w2', 0), slot('w1', 1), slot('w3', 2)] },             // З64: amallar almashdi
  { id: '09', tag: 'equals_a6_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z1', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },
  { id: '10', tag: 'code_exponents',
    ok: [slot('−6', 0), slot('−2', 1), slot('3', 2)],
    no: [slot('6', 0), slot('−2', 1), slot('3', 2)] },               // ko'paytmaning ishorasi
];

const PLAN_33 = [
  { id: '01', tag: 'standard_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },    // З66
  { id: '02', tag: 'exponent_big',
    ok: [{ fill: ['1', '6'] }],
    no: [{ fill: ['1', '7'] }] },                                    // raqamlar soni sanaldi
  { id: '03', tag: 'standard_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z1', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },
  { id: '04', tag: 'negative_exponent_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },   // ko'rsatkichi nol bo'lgan son
  { id: '05', tag: 'code_exponents',
    ok: [slot('−3', 0), slot('−1', 1), slot('2', 2)],
    no: [slot('3', 0), slot('−1', 1), slot('2', 2)] },               // З67
  { id: '06', tag: 'to_standard_steps',
    ok: ['l3', 'l1', 'l4', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '07', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },             // З66
  { id: '08', tag: 'which_standard',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                   // З67
  { id: '09', tag: 'number_to_standard',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
  { id: '10', tag: 'standard_to_number',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
];

const PLAN_34 = [
  { id: '01', tag: 'which_variation_row',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                   // takrorlar tashlandi
  { id: '02', tag: 'frequency_marked',
    ok: ['i1', 'i2', 'i4'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i2', 'i3'].map((x) => tap(`[data-item="${x}"]`)) },   // qo'shni variantning chastotasi
  { id: '03', tag: 'data_claims',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // З69
  { id: '04', tag: 'variant_to_relative',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
  { id: '05', tag: 'frequency_to_relative',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
  { id: '06', tag: 'code_frequencies',
    ok: [slot('2', 0), slot('3', 1), slot('4', 2)],
    no: [slot('5', 0), slot('3', 1), slot('4', 2)] },                // З69: variantning o'zi
  { id: '07', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },             // 35-darsning atamasi
  { id: '08', tag: 'missing_frequency',
    ok: [{ fill: ['1', '7'] }],
    no: [{ fill: ['1', '13'] }] },                                   // З70: uchtasining yig'indisi
  { id: '09', tag: 'table_steps',
    ok: ['l4', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l4', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '10', tag: 'frequency_or_relative',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },
];

const PLAN_35 = [
  { id: '01', tag: 'average_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },    // З71
  { id: '02', tag: 'mean_value',
    ok: [{ fill: ['1', '10'] }],
    no: [{ fill: ['1', '12'] }] },                                   // З71: moda aytildi
  { id: '03', tag: 'which_mode',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                   // ikkinchi darajali takror
  { id: '04', tag: 'median_five_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i5', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },   // З72: juft qator chetlab o'tildi
  { id: '05', tag: 'row_to_median',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
  { id: '06', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w2', 0), slot('w1', 1), slot('w3', 2)] },             // З71: moda va o'rtacha almashdi
  { id: '07', tag: 'median_steps',
    ok: ['l2', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '08', tag: 'mode_or_none',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z2', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },
  { id: '09', tag: 'code_three_measures',
    ok: [slot('2', 0), slot('3', 1), slot('4', 2)],
    no: [slot('2', 0), slot('3', 1), slot('5', 2)] },                // o'rtacha noto'g'ri
  { id: '10', tag: 'median_odd_even',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
];

const PLAN_36 = [
  { id: '01', tag: 'no_repeat_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },   // З73: takrorli son belgilandi
  { id: '02', tag: 'count_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },    // З73: javoblar almashdi
  { id: '03', tag: 'product_rule',
    ok: [{ fill: ['1', '12'] }],
    no: [{ fill: ['1', '7'] }] },                                    // З74: qo'shildi
  { id: '04', tag: 'code_three_counts',
    ok: [slot('4', 0), slot('6', 1), slot('12', 2)],
    no: [slot('5', 0), slot('6', 1), slot('12', 2)] },               // З74: qo'shish natijasi
  { id: '05', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },             // З74: m + n
  { id: '06', tag: 'digits_to_count',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
  { id: '07', tag: 'expr_to_value',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
  { id: '08', tag: 'which_count',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                   // З74: hammasi qo'shildi
  { id: '09', tag: 'equals_12_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z2', 'i8:z1'].map((x) => zone(...x.split(':'))) },
  { id: '10', tag: 'count_steps',
    ok: ['l4', 'l1'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l4', 'l2'].map((x) => tap(`[data-card="${x}"]`)) },
];

const PLAN_37 = [
  { id: '01', tag: 'parallelogram_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // З77: diagonallar teng deb olindi
  { id: '02', tag: 'parallelogram_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },   // З75: deltoid tanlandi
  { id: '03', tag: 'always_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },
  { id: '04', tag: 'angle_to_neighbour',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
  { id: '05', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },             // ta'rifga perpendikulyarlik
  { id: '06', tag: 'neighbour_side',
    ok: [{ fill: ['1', '10'] }],
    no: [{ fill: ['1', '28'] }] },                                   // perimetrdan bitta tomon ayirildi
  { id: '07', tag: 'code_angles',
    ok: [slot('75', 0), slot('80', 1), slot('140', 2)],
    no: [slot('80', 0), slot('105', 1), slot('140', 2)] },           // З76: qarama-qarshi burchakka ayirish
  { id: '08', tag: 'which_definition',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                   // З75: tomonlar tengligi
  { id: '09', tag: 'proof_steps',
    ok: ['l3', 'l1', 'l4', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '10', tag: 'diagonal_to_half',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
];

const PLAN_38 = [
  { id: '01', tag: 'rhombus_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i5', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },   // kvadrat romb emas deb olindi
  { id: '02', tag: 'rectangle_or_rhombus',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z2', 'i4:z1', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },
  { id: '03', tag: 'rhombus_side',
    ok: [{ fill: ['1', '7'] }],
    no: [{ fill: ['1', '14'] }] },                                   // parallelogrammning qoidasi
  { id: '04', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },             // З79: kvadrat ikki ta'rifga
  { id: '05', tag: 'rhombus_angles',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
  { id: '06', tag: 'code_diagonals',
    ok: [slot('6', 0), slot('10', 1), slot('90', 2)],
    no: [slot('6', 0), slot('45', 1), slot('90', 2)] },              // З79: diagonal va tomon orasidagi burchak
  { id: '07', tag: 'square_proof_steps',
    ok: ['l2', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '08', tag: 'figure_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },    // teskari teorema rad etildi
  { id: '09', tag: 'which_conclusion',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                   // З80: romb deb olindi
  { id: '10', tag: 'condition_to_figure',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
];

const PLAN_39 = [
  { id: '01', tag: 'which_definition',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                   // З81: ta'rifning yarmi
  { id: '02', tag: 'fourth_angle',
    ok: [{ fill: ['1', '115'] }],
    no: [{ fill: ['1', '70'] }] },                                   // qarama-qarshi burchak teng deb olindi
  { id: '03', tag: 'trapezoid_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },    // teng yonli turi hamma trapetsiyaga yoyildi
  { id: '04', tag: 'trapezoid_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },   // З81: parallelogramm tanlandi
  { id: '05', tag: 'isosceles_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '06', tag: 'trapezoid_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },
  { id: '07', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },             // ta'rifga tenglik
  { id: '08', tag: 'angle_to_neighbour',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
  { id: '09', tag: 'three_angles_to_fourth',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
  { id: '10', tag: 'code_trapezoid_angles',
    ok: [slot('90', 0), slot('108', 1), slot('115', 2)],
    no: [slot('72', 0), slot('90', 1), slot('115', 2)] },            // teng yonlida ∠B = ∠A deb olindi
];

const PLAN_40 = [
  { id: '01', tag: 'which_is_height',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                   // З83: yon tomon balandlik deb olindi
  { id: '02', tag: 'area_claims',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },   // З83: S = a · b qabul qilindi
  { id: '03', tag: 'area_value',
    ok: [{ fill: ['1', '60'] }],
    no: [{ fill: ['1', '17'] }] },                                   // qo'shildi
  { id: '04', tag: 'enough_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },
  { id: '05', tag: 'area_steps',
    ok: ['l2', 'l1', 'l4', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '06', tag: 'base_to_height',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
  { id: '07', tag: 'given_to_unknown',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
  { id: '08', tag: 'code_heights',
    ok: [slot('4', 0), slot('5', 1), slot('6', 2)],
    no: [slot('4', 0), slot('5', 1), slot('15', 2)] },               // З84: asosning o'zi yozildi
  { id: '09', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },             // З83: «yon tomon»
  { id: '10', tag: 'same_area_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },   // З83: tomoni o'sha, qiyaligi boshqa
];

// ============================================================ 41-DARS
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3. Ha/yo'q kombinatsiyasi §0a.1 dan:
// YO'Q, HA.
const PLAN_41 = [
  { id: '01', tag: 'area_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },      // З85: S = a·h
  { id: '02', tag: 'same_area_groups',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // ikkiga bo'lish unutildi
  { id: '03', tag: 'equal_area_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // uchi balandda
  { id: '04', tag: 'code_areas',
    ok: [slot('24', 0), slot('30', 1), slot('35', 2)],
    no: [slot('40', 0), slot('30', 1), slot('35', 2)] },                 // З86: gipotenuza balandlik deb olindi
  { id: '05', tag: 'which_formula',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З86
  { id: '06', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w2', 0), slot('w1', 1), slot('w3', 2)] },                 // asos va balandlik almashdi
  { id: '07', tag: 'base_height_to_area',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't3'), pair('m2', 't2'), pair('m3', 't1'), pair('m4', 't4')] },  // 12 va 18 almashdi
  { id: '08', tag: 'double_steps',
    ok: ['l4', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },            // xulosa birinchi qoldi
  { id: '09', tag: 'area_back',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // h va a almashdi
  { id: '10', tag: 'rect_from_triangle',
    ok: [{ fill: ['1', '240'] }],
    no: [{ fill: ['1', '120'] }] },                                      // faqat bitta uchburchak
];

// ============================================================ 42-DARS
// Skelet §4. Ha/yo'q: HA, HA (ikkalasi ham rost).
const PLAN_42 = [
  { id: '01', tag: 'which_formula',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З87: asoslar ko'paytirildi
  { id: '02', tag: 'area_from_bases',
    ok: [{ fill: ['1', '24'] }],
    no: [{ fill: ['1', '140'] }] },                                      // З87
  { id: '03', tag: 'same_area_groups',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z2', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // bir xil asoslar, boshqa h
  { id: '04', tag: 'find_missing',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't4'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't1')] },  // ayiriladigan asos almashdi
  { id: '05', tag: 'code_areas',
    ok: [slot('24', 0), slot('28', 1), slot('35', 2)],
    no: [slot('24', 0), slot('56', 1), slot('35', 2)] },                 // o'rta chiziq ikkilantirildi
  { id: '06', tag: 'midline_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },        // «yarim yo'q, demak xato»
  { id: '07', tag: 'height_marked',
    ok: ['i1', 'i3', 'i6', 'i7'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i6', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },      // o'rta chiziq balandlik deb olindi
  { id: '08', tag: 'trap_back',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // yig'indi bitta asos deb olindi
  { id: '09', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // З87 ning so'z shakli
  { id: '10', tag: 'diagonal_steps',
    ok: ['l2', 'l1', 'l4', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l4'].map((x) => tap(`[data-card="${x}"]`)) },            // diagonal oxirga surildi
];

// ============================================================ 43-DARS
// Skelet §5. Ha/yo'q: YO'Q, YO'Q (З90 ning ikki tomoni).
const PLAN_43 = [
  { id: '01', tag: 'midline_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // mediana o'rta chiziq deb olindi
  { id: '02', tag: 'thales_condition',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="2"]')] },                                       // З89: kesuvchilar parallel deb olindi
  { id: '03', tag: 'midline_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З90: yarim yo'q
  { id: '04', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // uchlarini tutashtiradi deb olindi
  { id: '05', tag: 'split_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },            // parallel chiziqlar teng kesmalardan oldin
  { id: '06', tag: 'midline_back',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // yo'nalish almashdi
  { id: '07', tag: 'second_base',
    ok: [{ fill: ['1', '13'] }],
    no: [{ fill: ['1', '4'] }] },                                        // o'rta chiziqdan asos ayirildi
  { id: '08', tag: 'midline_groups',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z2', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // uchburchak va trapetsiya chalkashdi
  { id: '09', tag: 'code_midlines',
    ok: [slot('7', 0), slot('8', 1), slot('10', 2)],
    no: [slot('7', 0), slot('8', 1), slot('20', 2)] },                   // З90: yig'indining yarmi olinmadi
  { id: '10', tag: 'mixed_midlines',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // figura chalkashdi
];

// ============================================================ 44-DARS
// Skelet §6. Ha/yo'q: HA, YO'Q.
const PLAN_44 = [
  { id: '01', tag: 'pythagoras_claims',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },       // З91: c = a + b
  { id: '02', tag: 'equality_holds',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z2', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // uzunliklar qo'shildi
  { id: '03', tag: 'which_is_hypotenuse',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="3"]')] },                                       // З93: harfga tayanish
  { id: '04', tag: 'code_hypotenuse',
    ok: [slot('5', 0), slot('10', 1), slot('13', 2)],
    no: [slot('7', 0), slot('10', 1), slot('13', 2)] },                  // З91: 3 + 4
  { id: '05', tag: 'sides_back',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // ayirish yo'nalishi
  { id: '06', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w1', 0), slot('w2', 1), slot('w6', 2)] },                 // З91: uzunliklar yig'indisi
  { id: '07', tag: 'rhombus_side',
    ok: [{ fill: ['1', '13'] }],
    no: [{ fill: ['1', '26'] }] },                                       // yarim diagonal olinmadi
  { id: '08', tag: 'mixed_sides',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't4'), pair('m4', 't3')] },  // qo'shish va ayirish almashdi
  { id: '09', tag: 'proof_steps',
    ok: ['l4', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },            // xulosa birinchi qoldi
  { id: '10', tag: 'true_equalities',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // З91: c = a + b
];

// ============================================================ 45-DARS
// Skelet §7. Ha/yo'q: HA, HA (ikkinchisi teoremaning davomi).
const PLAN_45 = [
  { id: '01', tag: 'how_to_check',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З94: oxirgi tomon olindi
  { id: '02', tag: 'impossible_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i5', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },      // chegara holati chalkashdi
  { id: '03', tag: 'right_angle_side',
    ok: [{ fill: ['1', '26'] }],
    no: [{ fill: ['1', '24'] }] },                                       // З95: o'rtadagi tomon
  { id: '04', tag: 'triple_to_side',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't4'), pair('m4', 't3')] },  // З94: ildizli tomon ko'rinmadi
  { id: '05', tag: 'check_steps',
    ok: ['l3', 'l1', 'l4', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l4'].map((x) => tap(`[data-card="${x}"]`)) },            // eng katta tomon aniqlanmadi
  { id: '06', tag: 'converse_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З95: burchakning joyi rad etildi
  { id: '07', tag: 'code_checks',
    ok: [slot('5', 0), slot('10', 1), slot('15', 2)],
    no: [slot('1', 0), slot('10', 1), slot('15', 2)] },                  // З92: 13 − 12
  { id: '08', tag: 'verdict_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // hisob almashdi
  { id: '09', tag: 'right_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // chegara holati (65 va 64)
  { id: '10', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // З94: eng kichik tomon
];

// ============================================================ 46-DARS
// Skelet §8. Ha/yo'q: YO'Q, YO'Q (З97 va З98 — ikki xil adashish).
const PLAN_46 = [
  { id: '01', tag: 'semi_perimeter_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // З97: perimetrning o'zi
  { id: '02', tag: 'when_heron',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // 41-darsning formulasi
  { id: '03', tag: 'same_p_groups',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z2', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // ikkiga bo'lish unutildi
  { id: '04', tag: 'p_minus_side',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },  // p va ayirma almashdi
  { id: '05', tag: 'sides_to_area',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't3'), pair('m2', 't2'), pair('m3', 't1'), pair('m4', 't4')] },  // perimetr bo'yicha tartiblandi
  { id: '06', tag: 'height_from_area',
    ok: [{ fill: ['1', '8'] }],
    no: [{ fill: ['1', '4'] }] },                                        // ikkilantirish unutildi
  { id: '07', tag: 'heron_steps',
    ok: ['l2', 'l1', 'l3', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l3'].map((x) => tap(`[data-card="${x}"]`)) },            // ayirmalar p dan oldin
  { id: '08', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // З97 ning so'z shakli
  { id: '09', tag: 'code_heron',
    ok: [slot('12', 0), slot('36', 1), slot('192', 2)],
    no: [slot('12', 0), slot('72', 1), slot('192', 2)] },                // З97: perimetr
  { id: '10', tag: 'heron_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З97
];

// ============================================================ 47-DARS
// Skelet §9. Ha/yo'q: YO'Q, HA. 47 — YOLG'IZ QATOR (§0a.3).
const PLAN_47 = [
  { id: '01', tag: 'egypt_multiples',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // 5-12-13 ham misr uchburchagi deb olindi
  { id: '02', tag: 'equilateral_h2',
    ok: [{ fill: ['1', '75'] }],
    no: [{ fill: ['1', '0'] }] },                                        // З100: to'liq asos
  { id: '03', tag: 'half_base',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З100
  { id: '04', tag: 'rope_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },       // З101: teng bo'laklar
  { id: '05', tag: 'letter_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },            // tenglama shartdan oldin
  { id: '06', tag: 'code_tests',
    ok: [slot('13', 0), slot('15', 1), slot('25', 2)],
    no: [slot('13', 0), slot('18', 1), slot('25', 2)] },                 // З99: 12 + 6
  { id: '07', tag: 'figures_to_answer',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't4'), pair('m4', 't3')] },  // qo'shish va ayirish almashdi
  { id: '08', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // З100 ning so'z shakli
  { id: '09', tag: 'rhombus_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // ikkilantirish tashlab ketildi
  { id: '10', tag: 'equation_groups',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z2', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // chiziqli tenglama chalkashdi
];

// ============================================================ 48-DARS
// Skelet §10. Ha/yo'q: HA, HA (bir yozuv, ikki yoy).
const PLAN_48 = [
  { id: '01', tag: 'arc_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // «bir yoy ikki o'lchovda bo'lolmaydi»
  { id: '02', tag: 'major_arc',
    ok: [{ fill: ['1', '245'] }],
    no: [{ fill: ['1', '115'] }] },                                      // З103
  { id: '03', tag: 'equal_or_subtract',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z2', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // 180° chegara holati
  { id: '04', tag: 'code_arcs',
    ok: [slot('40', 0), slot('100', 1), slot('110', 2)],
    no: [slot('40', 0), slot('100', 1), slot('250', 2)] },               // shartdagi son ko'chirildi
  { id: '05', tag: 'angle_to_major',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't4'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't1')] },  // 180° chegara holati
  { id: '06', tag: 'diameter_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // З102: markazga yaqin vatar
  { id: '07', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // З102: radius va vatar
  { id: '08', tag: 'arc_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },            // yoylar qo'shilishi oldinga surildi
  { id: '09', tag: 'arc_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // kichik yoyda ayirish
  { id: '10', tag: 'why_subtract',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З103: birlik farqi
];

// ============================================================ 49-DARS
// Skelet §11. Ha/yo'q: HA, YO'Q.
const PLAN_49 = [
  { id: '01', tag: 'perp_diameter_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // З105: qiya diametr
  { id: '02', tag: 'chord_claims',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // hisob rad etildi
  { id: '03', tag: 'when_bisects',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З105: har qanday holda
  { id: '04', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w1', 0), slot('w2', 1), slot('w6', 2)] },                 // З104: to'liq uzunlik
  { id: '05', tag: 'code_chords',
    ok: [slot('8', 0), slot('12', 1), slot('40', 2)],
    no: [slot('8', 0), slot('12', 1), slot('20', 2)] },                  // ikkilantirish unutildi
  { id: '06', tag: 'possible_chord',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z2', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2'].map((x) => zone(...x.split(':'))) },  // diametr vatar emas deb olindi
  { id: '07', tag: 'distance_to_chord',
    ok: [{ fill: ['1', '7'] }],
    no: [{ fill: ['1', '1'] }] },                                        // chiziqli ayirish
  { id: '08', tag: 'chord_pairs',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // yarim vatar javob deb olindi
  { id: '09', tag: 'same_radius',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't4'), pair('m4', 't3')] },  // masofa va vatar munosabati
  { id: '10', tag: 'bisect_proof',
    ok: ['l4', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },            // xulosa birinchi qoldi
];

// ============================================================ 50-DARS
// Skelet §12. Ha/yo'q: YO'Q, YO'Q (З107 ning ikki tomoni).
const PLAN_50 = [
  { id: '01', tag: 'what_is_tangent',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // «kesib o'tmaydigan» — kengroq ta'rif
  { id: '02', tag: 'tangent_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i5', 'i6'].map((x) => tap(`[data-item="${x}"]`)) },      // d = 0 urinma deb olindi
  { id: '03', tag: 'tangent_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З107: ikki nuqta
  { id: '04', tag: 'tangent_proof',
    ok: ['l4', 'l1', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },            // xulosa solishtirishdan oldin
  { id: '05', tag: 'secant_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // З107: d = R kesuvchiga qo'yildi
  { id: '06', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w1', 0), slot('w2', 1), slot('w6', 2)] },                 // З107: ikkita nuqta
  { id: '07', tag: 'cases_to_result',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't3'), pair('m3', 't2'), pair('m4', 't4')] },  // urinma va nuqtasiz holat almashdi
  { id: '08', tag: 'units_case',
    ok: [{ fill: ['1', '2'] }],
    no: [{ fill: ['1', '0'] }] },                                        // З106: birliklar keltirilmadi
  { id: '09', tag: 'code_chords',
    ok: [slot('12', 0), slot('16', 1), slot('48', 2)],
    no: [slot('6', 0), slot('12', 1), slot('16', 2)] },                  // yarim vatar kodga yozildi
  { id: '10', tag: 'three_cases',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },  // urinma va nuqtasiz holat almashdi
];


// ============================================================ 51-DARS
// Aylanaga ichki chizilgan burchak. Skelet: DARS51_55_AMALIYOT_SKELET.md §3.
const PLAN_51 = [
  { id: '01', tag: 'half_of_arc',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З109: burchak yoyga teng
  { id: '02', tag: 'arc_from_angle',
    ok: [{ fill: ['1', '70'] }],
    no: [{ fill: ['1', '35'] }] },                                       // З109 teskari tomondan
  { id: '03', tag: 'inscribed_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // markaziy burchak belgilandi
  { id: '04', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w1', 0), slot('w2', 1), slot('w6', 2)] },                 // З109: «o'ziga»
  { id: '05', tag: 'pair_right_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // 60 -> 60 to'g'ri deb olindi
  { id: '06', tag: 'inscribed_claims',
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },      // З109
  { id: '07', tag: 'inscribed_steps',
    ok: ['l4', 'l1', 'l4', 'l2'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l4', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },            // yarimlash yoydan oldin
  { id: '08', tag: 'code_angles',
    ok: [slot('40', 0), slot('70', 1), slot('90', 2)],
    no: [slot('80', 0), slot('70', 1), slot('90', 2)] },                 // З109: yoyning o'zi
  { id: '09', tag: 'arc_to_angle',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },  // yoy va markaziy almashdi
  { id: '10', tag: 'vertex_arc_to_angle',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v3', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v1', 2)] },  // 260 va 200 almashdi
];

// ============================================================ 52-DARS
// Ichki va tashqi chizilgan aylanalar. Skelet: §4.
const PLAN_52 = [
  { id: '01', tag: 'inscribed_angles_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },      // 80+80 = 160
  { id: '02', tag: 'circumscribed_sides',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z2', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // З111: tomonlar teng emas deb rad etildi
  { id: '03', tag: 'circle_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },       // «har qanday» shubha uyg'otdi
  { id: '04', tag: 'radius_from_hypotenuse',
    ok: [{ fill: ['1', '13'] }],
    no: [{ fill: ['1', '26'] }] },                                       // diametr radius deb olindi
  { id: '05', tag: 'which_centre',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З110
  { id: '06', tag: 'quad_to_opposite_angle',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't3'), pair('m2', 't2'), pair('m3', 't1'), pair('m4', 't4')] },  // 70 va 120 almashdi
  { id: '07', tag: 'code_three',
    ok: [slot('10', 0), slot('11', 1), slot('65', 2)],
    no: [slot('16', 0), slot('11', 1), slot('65', 2)] },                 // З111: yig'indi javob deb olindi
  { id: '08', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w2', 0), slot('w1', 1), slot('w3', 2)] },                 // З110: ikki markaz almashdi
  { id: '09', tag: 'fourth_side',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v3', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v1', 2)] },
  { id: '10', tag: 'inscribed_circle_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },            // perpendikulyar markazdan oldin
];

// ============================================================ 53-DARS
// Vektor tushunchasi, qo'shish va ayirish. Skelet: §5.
const PLAN_53 = [
  { id: '01', tag: 'which_equal',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // teskari yo'nalish
  { id: '02', tag: 'equal_or_not',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z1', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // teskari strelka teng deb olindi
  { id: '03', tag: 'triangle_rule_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i3', 'i2'].map((x) => tap(`[data-item="${x}"]`)) },      // natija teskari yozilgan
  { id: '04', tag: 'expr_to_vector',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't3'), pair('m3', 't2'), pair('m4', 't4')] },  // З113: ikki ayirma almashdi
  { id: '05', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w1', 0), slot('w2', 1), slot('w6', 2)] },                 // З112: «boshlanishi»
  { id: '06', tag: 'chain_to_vector',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
  { id: '07', tag: 'sum_length',
    ok: [{ fill: ['1', '10'] }],
    no: [{ fill: ['1', '14'] }] },                                       // uzunliklar qo'shildi
  { id: '08', tag: 'vector_claims',
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },      // З112
  { id: '09', tag: 'code_results',
    ok: [slot('AC', 0), slot('BA', 1), slot('0', 2)],
    no: [slot('CA', 0), slot('BA', 1), slot('0', 2)] },                  // З113: harflar teskari
  { id: '10', tag: 'difference_steps',
    ok: ['l2', 'l1', 'l4', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l2', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
];

// ============================================================ 54-DARS
// Vektorni songa ko'paytirish. Skelet: §6.
const PLAN_54 = [
  { id: '01', tag: 'collinear_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i1', 'i5', 'i4'].map((x) => tap(`[data-item="${x}"]`)) },      // manfiy kollinear emas deb olindi
  { id: '02', tag: 'scalar_claims',
    ok: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },       // З114: yo'nalish tomoni
  { id: '03', tag: 'same_or_opposite',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z2', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // kasr teskari deb olindi
  { id: '04', tag: 'which_length',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З114: manfiy modul
  { id: '05', tag: 'midpoint_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '06', tag: 'midline',
    ok: [{ fill: ['1', '7'] }],
    no: [{ fill: ['1', '28'] }] },                                       // З115 teskari tomondan
  { id: '07', tag: 'code_moduli',
    ok: [slot('2', 0), slot('8', 1), slot('12', 2)],
    no: [slot('2', 0), slot('−8', 1), slot('12', 2)] },              // З114: manfiy modul
  { id: '08', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w4', 0), slot('w2', 1), slot('w3', 2)] },                 // modulsiz koeffitsiyent
  { id: '09', tag: 'identity_to_result',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v2', 0), slot('f2', 1), slot('v1', 1), slot('f3', 2), slot('v3', 2)] },
  { id: '10', tag: 'k_to_arrow',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't1'), pair('m2', 't4'), pair('m3', 't3'), pair('m4', 't2')] },  // −a va 0,5a almashdi
];

// ============================================================ 55-DARS
// Vektor koordinatalari, skalyar ko'paytma. Skelet: §7. KURSNING OXIRGISI.
const PLAN_55 = [
  { id: '01', tag: 'coord_claims',
    ok: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },       // З117: javob son bo'lgani shubha uyg'otdi
  { id: '02', tag: 'coords_marked',
    ok: ['i1', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)),
    no: ['i2', 'i3', 'i5'].map((x) => tap(`[data-item="${x}"]`)) },      // З116: tartib teskari
  { id: '03', tag: 'which_coords',
    ok: [tap('[data-opt="0"]')],
    no: [tap('[data-opt="1"]')] },                                       // З116
  { id: '04', tag: 'code_dot',
    ok: [slot('1', 0), slot('11', 1), slot('12', 2)],
    no: [slot('−1', 0), slot('11', 1), slot('12', 2)] },             // shartdagi koordinata kodga tushdi
  { id: '05', tag: 'op_to_coords',
    ok: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v2', 1), slot('f3', 2), slot('v3', 2)],
    no: [slot('f1', 0), slot('v1', 0), slot('f2', 1), slot('v3', 1), slot('f3', 2), slot('v2', 2)] },
  { id: '06', tag: 'vector_to_length',
    ok: [pair('m1', 't1'), pair('m2', 't2'), pair('m3', 't3'), pair('m4', 't4')],
    no: [pair('m1', 't2'), pair('m2', 't1'), pair('m3', 't3'), pair('m4', 't4')] },
  { id: '07', tag: 'rule_words',
    ok: [slot('w1', 0), slot('w2', 1), slot('w3', 2)],
    no: [slot('w2', 0), slot('w1', 1), slot('w3', 2)] },                 // З116: ikki so'z almashdi
  { id: '08', tag: 'dot_steps',
    ok: ['l3', 'l1', 'l3', 'l2', 'l4', 'l3'].map((x) => tap(`[data-card="${x}"]`)),
    no: ['l3', 'l1'].map((x) => tap(`[data-card="${x}"]`)) },
  { id: '09', tag: 'dot_value',
    ok: [{ fill: ['1', '7'] }],
    no: [{ fill: ['1', '23'] }] },                                       // ikkinchi ko'paytmada ishora yo'qoldi
  { id: '10', tag: 'number_or_vector',
    ok: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z1', 'i8:z2'].map((x) => zone(...x.split(':'))),
    no: ['i1:z1', 'i2:z2', 'i3:z1', 'i4:z2', 'i5:z1', 'i6:z2', 'i7:z2', 'i8:z2'].map((x) => zone(...x.split(':'))) },  // |a+b| vektor deb olindi
];

// Reyestrdagi amaliyotlar. `plan` bo'lmasa, skroll o'lchovi «turtki»
// rejimida yuradi. 2026-08-22 dan boshlab hamma darsning rejasi bor:
// 1-dars amaliyoti qayta yaratildi va o'z yo'llarini oldi.
export const LESSONS = [
  { id: 'dars01', route: '/8-sinf/matematika/amaliy/dars01-amaliyot', plan: PLAN_01 },
  { id: 'dars02', route: '/8-sinf/matematika/amaliy/dars02-amaliyot', plan: PLAN_02 },
  { id: 'dars03', route: '/8-sinf/matematika/amaliy/dars03-amaliyot', plan: PLAN_03 },
  { id: 'dars04', route: '/8-sinf/matematika/amaliy/dars04-amaliyot', plan: PLAN_04 },
  { id: 'dars05', route: '/8-sinf/matematika/amaliy/dars05-amaliyot', plan: PLAN_05 },
  { id: 'dars06', route: '/8-sinf/matematika/amaliy/dars06-amaliyot', plan: PLAN_06 },
  { id: 'dars07', route: '/8-sinf/matematika/amaliy/dars07-amaliyot', plan: PLAN_07 },
  { id: 'dars08', route: '/8-sinf/matematika/amaliy/dars08-amaliyot', plan: PLAN_08 },
  { id: 'dars09', route: '/8-sinf/matematika/amaliy/dars09-amaliyot', plan: PLAN_09 },
  { id: 'dars10', route: '/8-sinf/matematika/amaliy/dars10-amaliyot', plan: PLAN_10 },
  { id: 'dars11', route: '/8-sinf/matematika/amaliy/dars11-amaliyot', plan: PLAN_11 },
  { id: 'dars12', route: '/8-sinf/matematika/amaliy/dars12-amaliyot', plan: PLAN_12 },
  { id: 'dars13', route: '/8-sinf/matematika/amaliy/dars13-amaliyot', plan: PLAN_13 },
  { id: 'dars14', route: '/8-sinf/matematika/amaliy/dars14-amaliyot', plan: PLAN_14 },
  { id: 'dars15', route: '/8-sinf/matematika/amaliy/dars15-amaliyot', plan: PLAN_15 },
  { id: 'dars16', route: '/8-sinf/matematika/amaliy/dars16-amaliyot', plan: PLAN_16 },
  { id: 'dars17', route: '/8-sinf/matematika/amaliy/dars17-amaliyot', plan: PLAN_17 },
  { id: 'dars18', route: '/8-sinf/matematika/amaliy/dars18-amaliyot', plan: PLAN_18 },
  { id: 'dars19', route: '/8-sinf/matematika/amaliy/dars19-amaliyot', plan: PLAN_19 },
  { id: 'dars20', route: '/8-sinf/matematika/amaliy/dars20-amaliyot', plan: PLAN_20 },
  { id: 'dars21', route: '/8-sinf/matematika/amaliy/dars21-amaliyot', plan: PLAN_21 },
  { id: 'dars22', route: '/8-sinf/matematika/amaliy/dars22-amaliyot', plan: PLAN_22 },
  { id: 'dars23', route: '/8-sinf/matematika/amaliy/dars23-amaliyot', plan: PLAN_23 },
  { id: 'dars24', route: '/8-sinf/matematika/amaliy/dars24-amaliyot', plan: PLAN_24 },
  { id: 'dars25', route: '/8-sinf/matematika/amaliy/dars25-amaliyot', plan: PLAN_25 },
  { id: 'dars26', route: '/8-sinf/matematika/amaliy/dars26-amaliyot', plan: PLAN_26 },
  { id: 'dars27', route: '/8-sinf/matematika/amaliy/dars27-amaliyot', plan: PLAN_27 },
  { id: 'dars28', route: '/8-sinf/matematika/amaliy/dars28-amaliyot', plan: PLAN_28 },
  { id: 'dars29', route: '/8-sinf/matematika/amaliy/dars29-amaliyot', plan: PLAN_29 },
  { id: 'dars30', route: '/8-sinf/matematika/amaliy/dars30-amaliyot', plan: PLAN_30 },
  { id: 'dars31', route: '/8-sinf/matematika/amaliy/dars31-amaliyot', plan: PLAN_31 },
  { id: 'dars32', route: '/8-sinf/matematika/amaliy/dars32-amaliyot', plan: PLAN_32 },
  { id: 'dars33', route: '/8-sinf/matematika/amaliy/dars33-amaliyot', plan: PLAN_33 },
  { id: 'dars34', route: '/8-sinf/matematika/amaliy/dars34-amaliyot', plan: PLAN_34 },
  { id: 'dars35', route: '/8-sinf/matematika/amaliy/dars35-amaliyot', plan: PLAN_35 },
  { id: 'dars36', route: '/8-sinf/matematika/amaliy/dars36-amaliyot', plan: PLAN_36 },
  { id: 'dars37', route: '/8-sinf/matematika/amaliy/dars37-amaliyot', plan: PLAN_37 },
  { id: 'dars38', route: '/8-sinf/matematika/amaliy/dars38-amaliyot', plan: PLAN_38 },
  { id: 'dars39', route: '/8-sinf/matematika/amaliy/dars39-amaliyot', plan: PLAN_39 },
  { id: 'dars40', route: '/8-sinf/matematika/amaliy/dars40-amaliyot', plan: PLAN_40 },
  { id: 'dars41', route: '/8-sinf/matematika/amaliy/dars41-amaliyot', plan: PLAN_41 },
  { id: 'dars42', route: '/8-sinf/matematika/amaliy/dars42-amaliyot', plan: PLAN_42 },
  { id: 'dars43', route: '/8-sinf/matematika/amaliy/dars43-amaliyot', plan: PLAN_43 },
  { id: 'dars44', route: '/8-sinf/matematika/amaliy/dars44-amaliyot', plan: PLAN_44 },
  { id: 'dars45', route: '/8-sinf/matematika/amaliy/dars45-amaliyot', plan: PLAN_45 },
  { id: 'dars46', route: '/8-sinf/matematika/amaliy/dars46-amaliyot', plan: PLAN_46 },
  { id: 'dars47', route: '/8-sinf/matematika/amaliy/dars47-amaliyot', plan: PLAN_47 },
  { id: 'dars48', route: '/8-sinf/matematika/amaliy/dars48-amaliyot', plan: PLAN_48 },
  { id: 'dars49', route: '/8-sinf/matematika/amaliy/dars49-amaliyot', plan: PLAN_49 },
  { id: 'dars50', route: '/8-sinf/matematika/amaliy/dars50-amaliyot', plan: PLAN_50 },
  { id: 'dars51', route: '/8-sinf/matematika/amaliy/dars51-amaliyot', plan: PLAN_51 },
  { id: 'dars52', route: '/8-sinf/matematika/amaliy/dars52-amaliyot', plan: PLAN_52 },
  { id: 'dars53', route: '/8-sinf/matematika/amaliy/dars53-amaliyot', plan: PLAN_53 },
  { id: 'dars54', route: '/8-sinf/matematika/amaliy/dars54-amaliyot', plan: PLAN_54 },
  { id: 'dars55', route: '/8-sinf/matematika/amaliy/dars55-amaliyot', plan: PLAN_55 },
];

// Orqaga moslik: eski chaqiruvlar uchun 2-dars.
export const PLAN = PLAN_02;
export const ROUTE = '/8-sinf/matematika/amaliy/dars02-amaliyot';

// TIPLAR §8: beshta o'lcham. Eng tori — 1366x615 (ishchi maydon 487px).
export const VIEWPORTS = [
  { name: 'noutbuk', width: 1366, height: 615 },
  { name: 'noutbuk-baland', width: 1366, height: 655 },
  { name: 'katta', width: 1920, height: 950 },
  { name: 'telefon', width: 390, height: 745 },
  { name: 'telefon-kichik', width: 360, height: 690 },
];

export const LANGS = ['uz', 'ru', 'en'];
