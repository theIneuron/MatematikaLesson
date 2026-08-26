// Dars46 · Amaliyot 02 — Test · 🟢 · tag: when_heron
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §8 (46-dars, 2-pozitsiya)
//
// FORMULA QACHON ISHLATILADI. Uch xato variant: 41-darsning formulasi
// (asos va balandlik), «faqat to'g'ri burchaklida», va perimetr — oxirgisi
// З97 ning yaqini: perimetr YETMAYDI, tomonlar kerak.
// `Choice` ning variantlari SO'Z, ya'ni `tr()` dan o'tadi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'when_heron', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Uchburchakning yuzini topishning bir necha yo'li bor. Geron formulasi shulardan biri, va uning o'z sharti bor: u faqat ma'lum ma'lumot berilganda ishlaydi.",
    'Площадь треугольника можно найти несколькими путями. Формула Герона один из них, и у неё своё условие: она работает только при определённых данных.',
    'The area of a triangle can be found in several ways. Heron formula is one of them, and it has its own condition: it works only with certain data.'),
  ask: L(
    'Geron formulasi qachon ishlatiladi?',
    'Когда применяется формула Герона?',
    'When is Heron formula used?'),
  opts: [
    { label: L("uchburchakning uchala tomoni ma'lum bo'lganda",
      'когда известны все три стороны треугольника', 'when all three sides of the triangle are known') },
    { label: L("asos va unga mos balandlik ma'lum bo'lganda",
      'когда известны основание и соответствующая высота', 'when the base and the matching height are known') },
    { label: L("faqat to'g'ri burchakli uchburchakda",
      'только в прямоугольном треугольнике', 'only in a right triangle') },
    { label: L("uchburchakning perimetri ma'lum bo'lganda",
      'когда известен периметр треугольника', 'when the perimeter of the triangle is known') },
  ],
  correctText: L(
    "To'g'ri. Geron formulasi yuzani faqat TOMONLAR orqali beradi — balandlikni bilish kerak emas, va bu uning butun qimmati. Formulaga uchala tomon ham alohida kiradi: yarim perimetrdan har bir tomon ayriladi, ya'ni to'rtta ko'paytuvchi chiqadi. Shuning uchun uchala tomonni bilish shart: bittasi yetmasa, formulani yozib bo'lmaydi.",
    'Верно. Формула Герона даёт площадь только через СТОРОНЫ — высоту знать не нужно, и в этом вся её ценность. В формулу все три стороны входят отдельно: из полупериметра вычитается каждая сторона, то есть выходят четыре множителя. Поэтому знать все три стороны обязательно: не хватит одной — формулу не записать.',
    'Correct. Heron formula gives the area from the SIDES alone — no height is needed, and that is its whole value. All three sides enter it separately: each side is subtracted from the semi-perimeter, giving four factors. So knowing all three sides is required: with one missing the formula cannot be written.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Asos va balandlik bilan yuza 41-darsning formulasi orqali topiladi: yarim asos karra balandlik. Geron formulasi esa aynan BALANDLIK BERILMAGANDA kerak bo'ladi — u balandlikni izlashni chetlab o'tadi.",
      'По основанию и высоте площадь находится формулой урока 41: половина основания на высоту. А формула Герона нужна как раз тогда, когда ВЫСОТА НЕ ДАНА — она позволяет обойтись без её поиска.',
      'With a base and a height the area comes from the formula of lesson 41: half the base times the height. Heron formula is needed precisely when NO HEIGHT is given — it lets you skip finding one.') },
    { when: (s) => s.picked === 2, text: L(
      "Formula har qanday uchburchakda ishlaydi, to'g'ri burchakli bo'lishi shart emas. Darslikning misollarida cho'zilgan uchburchaklar ham bor: masalan o'ttiz besh, yigirma to'qqiz, sakkiz. To'g'ri burchakli uchburchakda esa yuzani osonroq yo'l bilan topish mumkin — katetlarning yarim ko'paytmasi.",
      'Формула работает в любом треугольнике, прямоугольность не требуется. В примерах учебника есть и вытянутые треугольники: например тридцать пять, двадцать девять, восемь. А в прямоугольном треугольнике площадь можно найти проще — половина произведения катетов.',
      'The formula works in any triangle; being right-angled is not required. The textbook examples include stretched triangles, for instance thirty five, twenty nine, eight. In a right triangle the area can be found more simply — half the product of the legs.') },
    { when: (s) => s.picked === 3, text: L(
      "Perimetrning o'zi yetmaydi. Bir xil perimetrli uchburchaklarning yuzasi butunlay boshqa bo'lishi mumkin: masalan yigirma bir yarim perimetrli o'n uch, o'n to'rt, o'n besh ning yuzi sakson to'rt, o'sha yarim perimetrli yetti, o'n besh, yigirma esa ancha kichik yuza beradi — u cho'zilgan. Formulaga har bir tomon alohida kiradi.",
      'Одного периметра недостаточно. У треугольников с одним периметром площади могут быть совершенно разными: например при полупериметре двадцать один треугольник тринадцать, четырнадцать, пятнадцать даёт площадь восемьдесят четыре, а треугольник семь, пятнадцать, двадцать с тем же полупериметром — заметно меньшую, он вытянут. В формулу каждая сторона входит отдельно.',
      'The perimeter alone is not enough. Triangles with the same perimeter can have very different areas: with semi-perimeter twenty one the triangle thirteen, fourteen, fifteen has area eighty four, while seven, fifteen, twenty with the same semi-perimeter gives a much smaller area — it is stretched. Each side enters the formula separately.') },
  ],
  wrongText: L(
    "Formulaga uchala tomon alohida kiradi: har biri yarim perimetrdan ayriladi.",
    'В формулу входят все три стороны отдельно: каждая вычитается из полупериметра.',
    'All three sides enter the formula separately: each is subtracted from the semi-perimeter.'),
};

export default function D46_02(props) { return <Choice data={DATA} {...props} />; }
