// ============================================================================
// 1-DARS AMALIYOTI — 10 topshiriq. Mavzu: RATSIONAL IFODALAR VA KASRLAR.
// Kontrakt: src/books/grade8/TIPLAR_AMALIYOT_8SINF.md
//
// Bu fayl faqat RO'YXAT. Qobiq — `practice/PracticeHost.jsx`, tiplar —
// `practice/kit.jsx`, matematika — topshiriq fayllarida.
//
// QOPLASH (amaliyot 1-darsning HAMMA tasdig'i va HAMMA adashishini yopadi):
//   Tasdiq 1 (songa bo'linsa butun, harfga bo'linsa kasr)  -> 01, 02
//   Tasdiq 2 (shartni maxraj beradi, nollari mumkin emas)  -> 03, 05, 07, 09, 10
//   Tasdiq 3 (suratdagi nol / maxrajdagi nol)              -> 04, 08, 10
//   Z2  shart topilmadi yoki yo'qoldi                      -> 05, 07, 09
//   Z16 javob son bilan tekshirilmadi                      -> 05, 07, 08, 09
//   Z18 suratdagi va maxrajdagi nol aralashtirildi          -> 04, 08, 10
//   Z19 songa bo'lish harfga bo'lish deb olindi             -> 01, 02
//
// JANRLAR (ETALON_8SINF_RED2.md §13.1, metodist 2026-08-21 da tasdiqladi):
//   to'g'ridan-to'g'ri qo'llash 4 ta  -> 02, 03, 04, 10
//   shart bilan (natija VA shart) 2 ta -> 05, 07
//   birinchi noto'g'ri satr 1 ta       -> 09
//   teskari topshiriq 1 ta             -> 06
//   chegara 1 ta                       -> 08
//   takrorlash 1 ta                    -> 01 (7-sinf: qiymatni son qo'yib topish)
// 1-dars sinfning birinchi darsi, ya'ni «oldingi blokdan» o'rniga 7-sinf.
//
// TIPLAR TARTIBI: yonma-yon bir xil tip turmaydi va o'quvchi tipni raqam
// bo'yicha oldindan bilib olmaydi.
//   1 input · 2 sort · 3 slots · 4 input · 5 odz · 6 build · 7 odz ·
//   8 boundary · 9 audit · 10 input
// QIYINLIK: 3 oson (01-03) · 4 o'rta (04-07) · 3 qiyin (08-10).
// ============================================================================
import { L } from '../../core.jsx'
import { makePractice } from '../PracticeHost.jsx'
import D01_01 from './D01_01.jsx'
import D01_02 from './D01_02.jsx'
import D01_03 from './D01_03.jsx'
import D01_04 from './D01_04.jsx'
import D01_05 from './D01_05.jsx'
import D01_06 from './D01_06.jsx'
import D01_07 from './D01_07.jsx'
import D01_08 from './D01_08.jsx'
import D01_09 from './D01_09.jsx'
import D01_10 from './D01_10.jsx'

const META = {
  id: 'alg-8-01-amaliyot',
  n: 1,
  topic: L(
    '1-dars amaliyoti — ratsional ifodalar va kasrlar',
    'Практика урока 1 — рациональные выражения и дроби',
    'Lesson 1 practice — rational expressions and fractions',
  ),
}

const ITEMS = [
  { id: '01', level: '🟢', tag: 'value_substitute', C: D01_01, label: L('Qiymat', 'Значение', 'Value') },
  { id: '02', level: '🟢', tag: 'whole_or_fraction', C: D01_02, label: L('Ikki zona', 'Две зоны', 'Two zones') },
  { id: '03', level: '🟢', tag: 'odz_steps', C: D01_03, label: L('Yechim satrlari', 'Строки решения', 'Solution lines') },
  { id: '04', level: '🟡', tag: 'zero_numerator', C: D01_04, label: L('Nol qayerda', 'Где нуль', 'Where the zero is') },
  { id: '05', level: '🟡', tag: 'value_and_odz', C: D01_05, label: L('Ikki javob', 'Два ответа', 'Two answers') },
  { id: '06', level: '🟡', tag: 'build_odz', C: D01_06, label: L('Teskari ish', 'Обратная работа', 'The other way round') },
  { id: '07', level: '🟡', tag: 'two_denominators', C: D01_07, label: L('Ikki kasr', 'Две дроби', 'Two fractions') },
  { id: '08', level: '🔴', tag: 'where_split', C: D01_08, label: L('Ikki yozuv', 'Две записи', 'Two records') },
  { id: '09', level: '🔴', tag: 'first_wrong_line', C: D01_09, label: L('Tayyor yechim', 'Готовое решение', 'A ready solution') },
  { id: '10', level: '🔴', tag: 'no_forbidden', C: D01_10, label: L('Taqiq bormi', 'Есть ли запрет', 'Is there a restriction') },
]

export default makePractice({ META, ITEMS })
