// Dars01 · Amaliyot 08 — Yozuvlar qayerda ajraladi · 🔴 · teg: where_split
// Faqat MA'LUMOT. Tip: `practice/kit.jsx` -> Boundary.
//
// Bu savolni variant bilan berish mumkin emas: har qanday variant javobni
// aytib qo'yadi. Shuning uchun javob — SONLAR TO'PLAMI, yozib beriladi.
//
// (x · x) : x va x hamma joyda bir xil qiymat beradi — nolda tashqari.
// Nolda chapda 0 : 0 turadi, ya'ni qiymat YO'Q; o'ngda esa qiymat bor va u
// nolga teng. Bu 3-tasdiqning eng o'tkir ko'rinishi va Z18 ning ildizi:
// «qisqartirsa bo'ladi» degan qadam SHARTNI o'zgartirib qo'yadi.
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Boundary, Frac, L, Row } from '../kit.jsx'

const DATA = {
  tag: 'where_split',
  level: '🔴',
  answer: [0],
  eyebrow: L('Ikki yozuv', 'Две записи', 'Two records'),
  setup: L(
    "Chapdagi kasrni qisqartirsa o'ngdagi yozuv chiqadi, ya'ni ular deyarli hamma joyda bir xil. Deyarli — chunki bitta qiymat bor, unda ikki yozuv boshqacha ish qiladi.",
    'Если сократить дробь слева, получится запись справа — значит они почти всюду одинаковы. Почти: есть одно значение, где две записи ведут себя по-разному.',
    'Reducing the fraction on the left gives the record on the right, so they agree almost everywhere. Almost: there is one value where the two behave differently.',
  ),
  left: <Frac num="x · x" den="x" size="big" />,
  right: <Row size="big">x</Row>,
  ask: L('Qaysi qiymatda yozuvlar ajraladi?', 'При каком значении записи расходятся?', 'At what value do the records part ways?'),
  label: L('son', 'число', 'number'),
  hints: {
    '1': L(
      "Birda chapda 1 : 1 = 1, o'ngda ham 1. Bu yerda ular birdek ishlaydi. Bo'lish BUZILADIGAN qiymatni izlash kerak.",
      'При единице слева 1 : 1 = 1, справа тоже 1. Здесь они работают одинаково. Искать надо значение, при котором ломается ДЕЛЕНИЕ.',
      'At one the left gives 1 : 1 = 1 and the right gives 1 too. They agree here. Look for the value that breaks the DIVISION.',
    ),
  },
  wrongs: [
    {
      when: (s) => !s.mine,
      text: L(
        "Javob son bo'lishi kerak, masalan  0  yoki  x = 0.",
        'Ответ должен быть числом, например  0  или  x = 0.',
        'The answer must be a number, for example  0  or  x = 0.',
      ),
    },
    {
      when: (s) => s.mine && s.mine.length > 1,
      text: L(
        "Ajraladigan joy bitta. Boshqa hamma qiymatda kasr qisqaradi va ikki yozuv bir xil qiymat beradi.",
        'Место расхождения одно. Во всех остальных значениях дробь сокращается и обе записи дают одно и то же.',
        'There is a single point of disagreement. At every other value the fraction reduces and both records give the same.',
      ),
    },
    {
      when: (s) => s.mine && s.mine.length === 1,
      text: L(
        "Bu qiymatda ikki yozuv ham hisoblanadi, ya'ni ajralish yo'q. Chapdagi yozuvning MAXRAJINI nolga aylantiradigan sonni oling.",
        'При этом значении считаются обе записи, значит расхождения нет. Возьми число, обращающее в нуль ЗНАМЕНАТЕЛЬ левой записи.',
        'At that value both records compute, so they do not part. Take the number that makes the DENOMINATOR of the left record zero.',
      ),
    },
  ],
  wrongText: L(
    "Chapdagi yozuvda chiziq ostida x turadi. Uni nolga aylantiradigan qiymatni qo'yib ko'ring.",
    'В левой записи под чертой стоит x. Подставь значение, которое обращает его в нуль.',
    'In the left record x stands below the bar. Substitute the value that turns it into zero.',
  ),
  correctText: L(
    "To'g'ri. x = 0 da chapda 0 : 0 turadi — qiymat yo'q; o'ngda esa qiymat bor va u nolga teng. Shuning uchun qisqartirishdan keyin SHART yozib qo'yiladi: yozuvlar faqat x ≠ 0 bo'lganda teng.",
    'Верно. При x = 0 слева стоит 0 : 0 — значения нет; справа значение есть, и оно равно нулю. Поэтому после сокращения дописывают УСЛОВИЕ: записи равны только при x ≠ 0.',
    'Correct. At x = 0 the left is 0 : 0 with no value, while the right has a value and it equals zero. That is why a CONDITION is written after reducing: the records are equal only for x ≠ 0.',
  ),
}

export default function D01_08(props) { return <Boundary data={DATA} {...props} /> }
