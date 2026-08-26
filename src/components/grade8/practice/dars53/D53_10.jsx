// Dars53 · Amaliyot 10 — Tartib · 🔴 🖼 · tag: difference_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §5 (53-dars, 10-pozitsiya)
//
// З113 NEGA TUG'ILISHINI KO'RSATADI: javob BA bo'ladi, chunki qo'shish
// BO dan boshlanadi. Bu qadamlarsiz tartibni yodlashdan boshqa yo'l
// qolmaydi, va yodlangan tartib teskari yodlanishi mumkin.
// Chizmada uch strelka: OA va OB siyoh rangida, natija BA urg'u rangida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'difference_steps', level: '🔴',
  expr: [{
    fig: 'vec', w: 108, h: 70,
    arrows: [
      { from: [12, 58], to: [96, 44], ref: true, name: 'OA' },
      { from: [12, 58], to: [52, 10], ref: true, name: 'OB' },
      { from: [52, 10], to: [96, 44], name: 'BA' },
    ],
  }],
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['OA + (−OB)'],
      label: L("ayirmani qo'shishga aylantiramiz", 'превращаем разность в сложение', 'turn the difference into an addition') },
    { id: 'l2', tokens: ['−OB = BO'],
      label: L('qarama-qarshi vektorni yozamiz', 'записываем противоположный вектор', 'write the opposite vector') },
    { id: 'l3', tokens: ['BO + OA'],
      label: L("uchburchak qoidasini qo'llaymiz", 'применяем правило треугольника', 'apply the triangle rule') },
    { id: 'l4', tokens: ['BA'],
      label: L('natijani yozamiz', 'записываем результат', 'write the result') },
  ],
  start: ['l2', 'l4', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "OA ayirmoq OB ni to'rt qadamda topamiz, lekin qadamlar aralashib ketgan. Chizmada O nuqtasidan ikki vektor chiqqan, natija esa ularning uchlarini tutashtiradi. Qadamlar javob nega aynan BA ekanini ko'rsatadi.",
    'OA минус OB находим в четыре шага, но шаги перепутаны. На рисунке из точки O выходят два вектора, а результат соединяет их концы. Шаги показывают, почему ответ именно BA.',
    'We find OA minus OB in four steps, but the steps are mixed up. In the drawing two vectors leave the point O, and the result joins their ends. The steps show why the answer is exactly BA.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Endi javob nega BA ekani ko'rinadi. Ayirish — bu qarama-qarshi vektorni qo'shish, shuning uchun avval minus OB ni yozamiz, u esa BO. Endi qo'shish BO dan BOSHLANADI, ya'ni zanjir B nuqtasidan chiqadi. Uchburchak qoidasi bo'yicha BO qo'shuv OA natijasi B dan A ga qaraydi — BA. Javobning birinchi harfi B ekani tasodif emas: qo'shish shu harfdan boshlangan.",
    'Верно. Теперь видно, почему ответ BA. Вычитание это прибавление противоположного вектора, поэтому сначала записываем минус OB, а это BO. Теперь сложение НАЧИНАЕТСЯ с BO, то есть цепочка выходит из точки B. По правилу треугольника результат BO плюс OA смотрит из B в A — BA. Первая буква ответа B не случайна: с неё началось сложение.',
    'Correct. Now it is clear why the answer is BA. Subtracting is adding the opposite vector, so we first write minus OB, which is BO. Now the addition BEGINS with BO, that is, the chain leaves the point B. By the triangle rule the result of BO plus OA points from B to A — BA. The first letter of the answer being B is no accident: the addition started there.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Birinchi qadamda javob turibdi, lekin uni qayerdan olganingiz aytilmagan. Aynan shu bo'shliq xatoni tug'diradi: javob yodlanadi, va yodlangan tartib teskari yodlanishi mumkin. Qadamlar esa javobni CHIQARADI, va chiqarilgan javob teskari bo'lolmaydi.",
      'На первом шаге стоит ответ, но откуда он взят, не сказано. Именно этот пробел и порождает ошибку: ответ заучивают, а заученный порядок можно заучить наоборот. Шаги же ВЫВОДЯТ ответ, а выведенный ответ перевёрнутым быть не может.',
      'The first step holds the answer, but nothing says where it came from. It is exactly this gap that breeds the error: the answer gets memorised, and a memorised order can be memorised backwards. The steps DERIVE the answer, and a derived answer cannot come out reversed.') },
    { when: (s) => s.seq.indexOf('l2') < s.seq.indexOf('l1'), text: L(
      "Qarama-qarshi vektor ayirmani qo'shishga aylantirishdan OLDIN yozilgan. Tartib teskari: avval ayirishni qo'shish sifatida yozamiz, va shundan keyin qo'shiladigan narsa nima ekani ma'lum bo'ladi — u minus OB, ya'ni BO.",
      'Противоположный вектор записан РАНЬШЕ, чем разность превращена в сложение. Порядок обратный: сначала записываем вычитание как сложение, и только тогда становится ясно, что именно прибавляется — минус OB, то есть BO.',
      'The opposite vector was written BEFORE the difference was turned into an addition. The order is reversed: first we write the subtraction as an addition, and only then is it clear what is being added — minus OB, that is, BO.') },
    { when: (s) => s.seq.indexOf('l3') > s.seq.indexOf('l4'), text: L(
      "Natija uchburchak qoidasi qo'llanmasdan yozilgan. Qoida aynan javobning yo'nalishini beradi: BO qo'shuv OA da o'rtadagi O tushadi va BA qoladi. Bu qadamsiz javobning B dan boshlanishi tushunarsiz bo'lib qoladi.",
      'Результат записан до применения правила треугольника. Правило и даёт направление ответа: в BO плюс OA средняя O выпадает и остаётся BA. Без этого шага непонятно, почему ответ начинается с B.',
      'The result was written before the triangle rule was applied. The rule is what gives the direction of the answer: in BO plus OA the middle O drops out and BA remains. Without this step it stays unclear why the answer begins with B.') },
  ],
  wrongText: L(
    "Ayirishni qo'shishga aylantiring, qarama-qarshi vektorni yozing, keyin uchburchak qoidasini qo'llang.",
    'Преврати вычитание в сложение, запиши противоположный вектор, потом применяй правило треугольника.',
    'Turn the subtraction into an addition, write the opposite vector, then apply the triangle rule.'),
};

export default function D53_10(props) { return <SwapOrder data={DATA} {...props} />; }
