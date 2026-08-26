// Dars45 · Amaliyot 05 — Tartib · 🟡 · tag: check_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §7 (45-dars, 5-pozitsiya)
//
// TEKSHIRISHNING TO'RT QADAMI, darslikning misolida (99-bet): 5, 11, 12.
// Eng katta tomon o'n ikki, uning kvadrati bir yuz qirq to'rt; qolgan
// ikkitasining kvadratlari yig'indisi bir yuz qirq olti; ular teng emas,
// demak uchburchak to'g'ri burchakli emas.
//
// З94 tartibda ko'rinadi: kvadratlarni eng katta tomonni aniqlashdan OLDIN
// hisoblash — o'shanda nimani nima bilan solishtirish kerakligi ma'lum
// bo'lmaydi. Xulosani oldinga surish ham xato: solishtiradigan ikki son
// hali yo'q. Boshlang'ich tartib QAT'IY (`start`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'check_steps', level: '🟡',
  expr: ['5,  11,  12'], exprSize: 24,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['12'], label: L('eng katta tomonni aniqlaymiz', 'определяем наибольшую сторону', 'identify the largest side') },
    { id: 'l2', tokens: ['144'], label: L('uning kvadratini hisoblaymiz', 'считаем её квадрат', 'compute its square') },
    { id: 'l3', tokens: ['146'], label: L("qolgan ikkitasining kvadratlari yig'indisi", 'сумма квадратов двух других', 'the sum of the squares of the other two') },
    { id: 'l4', tokens: ['144 ≠ 146'], label: L('solishtiramiz va xulosa qilamiz', 'сравниваем и делаем вывод', 'compare and conclude') },
  ],
  start: ['l3', 'l4', 'l1', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Uchburchakning tomonlari besh, o'n bir va o'n ikki. Uning to'g'ri burchakli ekanini tekshirish to'rt qadamda boradi, lekin qadamlar aralashib ketgan.",
    'Стороны треугольника пять, одиннадцать и двенадцать. Проверка на прямоугольность идёт в четыре шага, но шаги перепутаны.',
    'The sides of a triangle are five, eleven and twelve. Checking whether it is right-angled takes four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Birinchi qadam eng ko'p tashlab ketiladigan qadam: uchala sondan eng KATTASINI aniqlash. U o'n ikki, va faqat shu son gipotenuza bo'lishi mumkin. Ikkinchi qadam — uning kvadrati: bir yuz qirq to'rt. Uchinchi qadam — qolgan ikkitasining kvadratlari yig'indisi: yigirma besh qo'shuv bir yuz yigirma bir bir yuz qirq olti. To'rtinchi qadam — solishtirish: bir yuz qirq to'rt bir yuz qirq oltiga teng emas, demak uchburchak to'g'ri burchakli EMAS. Farq faqat ikkita, lekin bu hech narsani o'zgartirmaydi: tenglik yo bor, yo yo'q.",
    'Верно. Первый шаг — тот, который чаще всего пропускают: определить НАИБОЛЬШЕЕ из трёх чисел. Это двенадцать, и только оно может быть гипотенузой. Второй шаг — его квадрат: сто сорок четыре. Третий шаг — сумма квадратов двух других: двадцать пять плюс сто двадцать один — сто сорок шесть. Четвёртый шаг — сравнение: сто сорок четыре не равно ста сорока шести, значит треугольник НЕ прямоугольный. Разница всего два, но это ничего не меняет: равенство либо есть, либо нет.',
    'Correct. The first step is the one most often skipped: identify the LARGEST of the three numbers. It is twelve, and only it can be the hypotenuse. The second step is its square: one hundred forty four. The third is the sum of the squares of the other two: twenty five plus one hundred twenty one is one hundred forty six. The fourth is the comparison: one hundred forty four does not equal one hundred forty six, so the triangle is NOT right-angled. The gap is only two, but that changes nothing: the equality either holds or it does not.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Xulosadan boshlab bo'lmaydi: solishtiriladigan ikki son hali hisoblanmagan. Oxirgi qadam ikkinchi va uchinchi qadamning natijalarini yonma-yon qo'yadi.",
      'Начинать с вывода нельзя: два числа для сравнения ещё не посчитаны. Последний шаг ставит рядом результаты второго и третьего шагов.',
      'You cannot start from the conclusion: the two numbers to compare have not been computed yet. The last step sets the results of the second and third steps side by side.') },
    { when: (s) => s.pos.l1 > s.pos.l2 || s.pos.l1 > s.pos.l3, text: L(
      "Kvadratlarni hisoblashdan oldin QAYSI tomon alohida turishini aniqlash kerak. Eng katta tomon topilmasa, kvadratlarni qanday guruhlash kerakligi ma'lum bo'lmaydi: bitta kvadrat bir tomonda, ikkitasi ikkinchi tomonda turadi.",
      'Прежде чем считать квадраты, надо определить, КАКАЯ сторона стоит особняком. Не найдя наибольшую сторону, непонятно, как группировать квадраты: один квадрат с одной стороны, два с другой. ',
      'Before computing squares you must decide WHICH side stands apart. Without finding the largest side it is unclear how to group the squares: one square on one side, two on the other.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Ikki hisobning tartibi almashdi. Avval alohida turgan tomonning kvadrati yoziladi (bir yuz qirq to'rt), keyin qolgan ikkitasining yig'indisi (bir yuz qirq olti) — solishtirish shu tartibda o'qiladi.",
      'Порядок двух вычислений поменялся. Сначала записывается квадрат отдельно стоящей стороны (сто сорок четыре), потом сумма двух других (сто сорок шесть) — сравнение читается в этом порядке.',
      'The order of the two computations was swapped. First comes the square of the side standing apart (one hundred forty four), then the sum of the other two (one hundred forty six) — the comparison reads in that order.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Solishtirishni ikkinchi son hisoblanmasdan yozib bo'lmaydi. Bir yuz qirq to'rt bilan nima solishtirilishi kerak? Qolgan ikki tomonning kvadratlari yig'indisi bilan, va u uchinchi qadamda chiqadi.",
      'Сравнение не записать, пока не посчитано второе число. С чем сравнивать сто сорок четыре? С суммой квадратов двух других сторон, а она выходит на третьем шаге.',
      'The comparison cannot be written before the second number is computed. What is one hundred forty four to be compared with? With the sum of the squares of the other two sides, and that comes out at the third step.') },
  ],
  wrongText: L(
    "Birinchi qadam — eng katta tomonni topish. Undan keyin bir kvadrat bir tomonda, ikkitasi ikkinchi tomonda turadi.",
    'Первый шаг — найти наибольшую сторону. После этого один квадрат стоит с одной стороны, два с другой.',
    'The first step is to find the largest side. After that one square stands on one side and two on the other.'),
};

export default function D45_05(props) { return <SwapOrder data={DATA} {...props} />; }
