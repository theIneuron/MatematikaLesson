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
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },        // З1: qo'shish
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
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },        // ishora
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
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },        // ag'darmadi
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
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
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
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // З2: nolda qiymat bor deb o'ylash
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
    ok: ['s1:no', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },      // З4: hadlarga bo'lish
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
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:no', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)) },        // tenglamaning ikki yechimi
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
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },      // З33: kvadratsiz taqqoslash
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
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },      // З32: ishora tashlandi
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
    ok: ['s1:yes', 's2:no'].map((x) => tap(`[data-tf="${x}"]`)),
    no: ['s1:yes', 's2:yes'].map((x) => tap(`[data-tf="${x}"]`)) },      // З34: ildiz ostilari qo'shildi
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
