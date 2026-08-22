// Dars01 · Amaliyot 01 — Ifodaning qiymati · 🟢 · teg: value_substitute
// Faqat MA'LUMOT. Tip: `practice/kit.jsx` -> Input (kind number).
//
// JANR: takrorlash. 1-dars sinfning birinchi darsi, oldingi blok yo'q —
// shuning uchun bu yerda 7-sinf turadi: ifodaning qiymatini SON QO'YIB
// topish. Aynan shu ko'nikma 1-darsning butun mavzusini ushlab turadi:
// maxrajni nolga aylantiradigan qiymat ham SHU YO'L bilan tekshiriladi.
//
// −5 ni qo'yamiz:  3 · (−5) = −15,  −15 + 21 = 6,  6 : 6 = 1.
// Ikki tipik yo'l: ishorani yo'qotish (3 · 5 = 15 -> 36 : 6 = 6) va butun
// suratni manfiy qilish ((−15 − 21) : 6 = −6).
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { E, F, Input, L } from '../kit.jsx'

const DATA = {
  tag: 'value_substitute',
  level: '🟢',
  kind: 'number',
  answer: '1',
  eyebrow: L('Qiymatni toping', 'Найди значение', 'Find the value'),
  setup: L(
    "Ifodada harf bor, lekin bo'linish SONGA ketadi — oltiga. Harf o'rniga son qo'yilsa, ifoda oddiy hisobga aylanadi.",
    'В записи есть буква, но делится она на ЧИСЛО — на шесть. Подставь вместо буквы число, и запись станет обычным счётом.',
    'The record has a letter, but it is divided by a NUMBER, by six. Put a number in place of the letter and the record becomes plain arithmetic.',
  ),
  expr: <E>{F('3b + 21', '6')}</E>,
  ask: L('b = −5 bo\'lganda ifodaning qiymati qancha?', 'Чему равно значение при b = −5?', 'What is the value at b = −5?'),
  label: L('qiymat', 'значение', 'value'),
  hints: {
    '6': L(
      "Ishora yo'qoldi: 3 · (−5) minus o'n besh, ya'ni suratda 21 dan AYIRILADI, qo'shilmaydi.",
      'Потерялся знак: 3 · (−5) это минус пятнадцать, значит в числителе оно ВЫЧИТАЕТСЯ из 21, а не прибавляется.',
      'The sign got lost: 3 · (−5) is minus fifteen, so in the numerator it is SUBTRACTED from 21, not added.',
    ),
    '-6': L(
      'Minus faqat 3b ga tegishli, 21 ga emas: surat −15 + 21, ya\'ni 6.',
      'Минус относится только к 3b, а не к 21: числитель это −15 + 21, то есть 6.',
      'The minus belongs to 3b only, not to 21: the numerator is −15 + 21, that is 6.',
    ),
    '-15': L(
      "Bu 3b ning o'zi. Uni 21 ga qo'shib, keyin oltiga bo'lish kerak.",
      'Это только 3b. Его надо сложить с 21 и потом разделить на шесть.',
      'That is only 3b. Add it to 21 and then divide by six.',
    ),
  },
  correctText: L(
    "To'g'ri. 3 · (−5) = −15, −15 + 21 = 6, 6 : 6 = 1. Maxrajda son turgani uchun bunday ifoda BUTUN deb ataladi: olti hech qachon nolga aylanmaydi.",
    'Верно. 3 · (−5) = −15, −15 + 21 = 6, 6 : 6 = 1. Под чертой стоит число, поэтому такая запись называется ЦЕЛОЙ: шесть никогда не обратится в нуль.',
    'Correct. 3 · (−5) = −15, −15 + 21 = 6, 6 : 6 = 1. A number stands below the bar, so such a record is called INTEGRAL: six never becomes zero.',
  ),
  wrongText: L(
    "Avval 3b ni hisoblang, keyin 21 ga qo'shing va oxirida oltiga bo'ling. b manfiy, ya'ni 3b ham manfiy.",
    'Сначала посчитай 3b, потом сложи с 21 и только потом раздели на шесть. b отрицательное, значит и 3b отрицательное.',
    'First compute 3b, then add 21, and only then divide by six. b is negative, so 3b is negative too.',
  ),
}

export default function D01_01(props) { return <Input data={DATA} {...props} /> }
