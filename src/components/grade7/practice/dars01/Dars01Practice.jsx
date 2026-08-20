// ============================================================================
// 7-sinf, 1-dars AMALIYOTI -- «Sonli ifodalar». YIG'UVCHI FAYL.
//
// Nazariy dars: ../../Dars01.jsx. Qobiq: ../PracticeHost.jsx.
// Joylashuv 1, 2 va 5-sinflardagi kabi: har topshiriq O'Z faylida, bu fayl
// esa ularni ro'yxatga yig'adi va qobiqqa beradi.
//
// 10 TOPSHIRIQ, 6 XIL MEXANIKA:
//   01 oson  tartibni o'quvchi qo'yadi          StepOrder
//   02 oson  amal belgilarini qo'yish           SlotFill
//   03 oson  qavsni yozuvga qo'yish             BracketGap
//   04 o'rta bitta bosqich -- chapdan o'ngga    StepOrder
//   05 o'rta qadamba-qadam qayta yozish         Transform
//   06 o'rta yozuvni O'ZI yig'adi               BuildValue
//   07 o'rta qavs qiymatni o'zgartiradi         BracketGap
//   08 qiyin birinchi xato qator + qarshi misol AuditWithProof
//   09 qiyin yig'ish, qavs matematikadan chiqadi BuildValue
//   10 qiyin so'zdan yozuvga (ko'chirish)       BuildValue
//
// SONLAR NAZARIYADAN OLINMAGAN. 1-darsda 18 − 6 : 3 + 4, 36 : 4 + 2 · 5 − 3,
// 40 : 8 + 3 · 2 − 5 va 3 · (12 − 4 : 2) ishlatilgan; amaliyotda ularning
// hech biri qaytarilmaydi (AMALIYOT_GLOBAL_STANDART.md, 4-band).
//
// TO'RT VARIANTDAN BITTASI -- BITTA HAM EMAS (etalon §1.1). O'quvchi yo
// tartibni qo'yadi, yo belgini, yo qavsni, yo yozuvni yig'adi.
//
// import React SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// ============================================================================
import React from 'react'
import { L } from '../../core.jsx'
import PracticeHost from '../PracticeHost.jsx'
import D01_01, { META as M01 } from './D01_01.jsx'
import D01_02, { META as M02 } from './D01_02.jsx'
import D01_03, { META as M03 } from './D01_03.jsx'
import D01_04, { META as M04 } from './D01_04.jsx'
import D01_05, { META as M05 } from './D01_05.jsx'
import D01_06, { META as M06 } from './D01_06.jsx'
import D01_07, { META as M07 } from './D01_07.jsx'
import D01_08, { META as M08 } from './D01_08.jsx'
import D01_09, { META as M09 } from './D01_09.jsx'
import D01_10, { META as M10 } from './D01_10.jsx'

// Bo'sh joylarning NOMLARI. Yakunda o'quvchi foiz emas, SO'Z ko'radi
// (etalon §8.5): «bir joy takrorni talab qiladi: bosqich tartibi».
const TAGS = {
  P1: L(
    "Bosqich tartibi: ko'paytirish va bo'lish qo'shishdan oldin",
    'Порядок ступеней: умножение и деление раньше сложения',
    'Order of stages: multiplication and division come before addition',
  ),
  P2: L(
    "Bitta bosqich ichida tartibni O'RIN hal qiladi, chapdan o'ngga",
    'Внутри одной ступени порядок решает МЕСТО, слева направо',
    'Within one stage the order is decided by POSITION, left to right',
  ),
  P3: L(
    "Qavs amallar navbatini o'zgartiradi",
    'Скобка меняет очередь действий',
    'A bracket changes the order of operations',
  ),
  P4: L(
    "Yozuvning ko'rinishi va qiymati",
    'Вид записи и её значение',
    'The shape of an expression and its value',
  ),
}

const META = {
  lessonId: 'alg_7_01_practice',
  title: L(
    '1-dars amaliyoti. Sonli ifodalar',
    'Практика урока 1. Числовые выражения',
    'Lesson 1 practice. Numerical expressions',
  ),
  tags: TAGS,
}

const TASKS = [
  { ...M01, Q: D01_01 },
  { ...M02, Q: D01_02 },
  { ...M03, Q: D01_03 },
  { ...M04, Q: D01_04 },
  { ...M05, Q: D01_05 },
  { ...M06, Q: D01_06 },
  { ...M07, Q: D01_07 },
  { ...M08, Q: D01_08 },
  { ...M09, Q: D01_09 },
  { ...M10, Q: D01_10 },
]

export default function Grade7Dars01Practice({ lang, onFinished }) {
  return <PracticeHost meta={META} tasks={TASKS} lang={lang} onFinished={onFinished} />
}
