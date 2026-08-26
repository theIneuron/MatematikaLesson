// Dars34 · Amaliyot 10 — Guruhlar · 🔴 · tag: frequency_or_relative
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §6 (34-dars, 10-pozitsiya)
//
// З69 NING ENG SOF SHAKLI. Bu yerda hech qanday tanlanma yo'q — faqat
// SONLAR, va ular o'zining KO'RINISHI bilan ajraladi:
//   chastota — sanoq, ya'ni butun son;
//   nisbiy chastota — ulush, ya'ni noldan birgacha.
// Kartalar ataylab shunday tanlangan: hech biri ikki zonaga ham tushmaydi.
// Bir soni ikkalasi bo'la olardi, shuning uchun u jadvalda YO'Q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'frequency_or_relative', level: '🔴',
  zoneSize: 12, itemSize: 17, zoneLbl: 132,
  zones: [
    { id: 'z1', label: L("CHASTOTA BO'LA OLADI", 'МОЖЕТ БЫТЬ ЧАСТОТОЙ', 'CAN BE A FREQUENCY') },
    { id: 'z2', label: L("NISBIY CHASTOTA BO'LA OLADI", 'МОЖЕТ БЫТЬ ОТНОСИТЕЛЬНОЙ ЧАСТОТОЙ', 'CAN BE A RELATIVE FREQUENCY') },
  ],
  items: [
    { id: 'i1', tokens: ['3'], zone: 'z1' },
    { id: 'i2', tokens: ['0,3'], zone: 'z2' },
    { id: 'i3', tokens: ['12'], zone: 'z1' },
    { id: 'i4', tokens: ['0,05'], zone: 'z2' },
    { id: 'i5', tokens: ['25'], zone: 'z1' },
    { id: 'i6', tokens: ['0,5'], zone: 'z2' },
    { id: 'i7', tokens: ['7'], zone: 'z1' },
    { id: 'i8', tokens: ['0,84'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz son. Tanlanma berilmagan va u kerak ham emas: har son o'zining ko'rinishi bilan qaysi kattalik bo'la olishini aytadi.",
    'Восемь чисел. Выборка не дана, и она не нужна: каждое число самим своим видом говорит, какой величиной оно может быть.',
    'Eight numbers. No sample is given, and none is needed: each number, by its very look, says which quantity it could be.'),
  ask: L('Sonni bosing, keyin guruhini bosing.', 'Нажми число, потом его группу.', 'Tap a number, then its group.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Chastota — SANOQ: variant necha marta uchragani, va sanoq har doim butun son bo'ladi. Bir varianti uch marta yoki yigirma besh marta uchrashi mumkin, lekin nol butun uch o'ndan marta uchrashi mumkin emas — bunday narsa yo'q. Nisbiy chastota esa ULUSH: u chastotani hajmga bo'lishdan chiqadi, va bo'linadigan son bo'luvchidan katta bo'lolmaydi, ya'ni natija hech qachon birdan oshmaydi. Nol butun sakson to'rt yuzdan — bu tanlanmaning sakson to'rt foizi, va bunday ulush bemalol bo'ladi; yigirma besh esa ulush bo'lolmaydi, chunki tanlanmaning yigirma besh baravari degan narsa yo'q.",
    'Верно. Частота — это ПОДСЧЁТ: сколько раз встретился вариант, а подсчёт всегда целое число. Вариант может встретиться три раза или двадцать пять раз, но не может встретиться нуль целых три десятых раза — такого не бывает. Относительная частота — это ДОЛЯ: она получается делением частоты на объём, а делимое не бывает больше делителя, значит результат никогда не превышает единицу. Нуль целых восемьдесят четыре сотых — это восемьдесят четыре процента выборки, такая доля вполне возможна; а двадцать пять долей быть не может, ведь двадцати пяти выборок в одной выборке нет.',
    'Correct. A frequency is a COUNT: how many times a variant occurred, and a count is always a whole number. A variant may occur three times or twenty-five times, but it cannot occur zero point three times — there is no such thing. A relative frequency is a SHARE: it comes from dividing the frequency by the size, and the dividend is never larger than the divisor, so the result never exceeds one. Zero point eight four is eighty-four per cent of the sample, a perfectly possible share; twenty-five cannot be a share, since there is no such thing as twenty-five times the whole sample.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu son chastota bo'lolmaydi, chunki u BUTUN emas. Chastota — sanoq: variant bir marta, ikki marta, o'n marta uchrashi mumkin, lekin nol butun uch o'ndan marta uchrashi mumkin emas. Sanoq har doim butun son bo'ladi, va bu qoidaning istisnosi yo'q. Bunday kasr sonlar ULUSH bo'ladi, ya'ni nisbiy chastota.",
      'Это число не может быть частотой, потому что оно не ЦЕЛОЕ. Частота — подсчёт: вариант может встретиться один раз, два, десять, но не нуль целых три десятых раза. Подсчёт всегда целое число, и исключений у этого правила нет. Такие дробные числа бывают ДОЛЯМИ, то есть относительными частотами.',
      'This number cannot be a frequency, because it is not a WHOLE number. A frequency is a count: a variant may occur once, twice, ten times, but not zero point three times. A count is always a whole number, and this rule has no exceptions. Fractional numbers like this are SHARES, that is, relative frequencies.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i5 === 'z2', text: L(
      "Bu son nisbiy chastota bo'lolmaydi, chunki u BIRDAN KATTA. Nisbiy chastota chastotani tanlanma hajmiga bo'lishdan chiqadi, chastota esa hajmdan ko'p bo'lolmaydi — variant tanlanmada mavjud natijalardan ko'proq marta uchrolmaydi. Demak ulush eng ko'pi bilan birga teng bo'ladi, va o'shanda ham faqat hamma natija bir xil bo'lganda.",
      'Это число не может быть относительной частотой, потому что оно БОЛЬШЕ ЕДИНИЦЫ. Относительная частота получается делением частоты на объём выборки, а частота не бывает больше объёма — вариант не может встретиться чаще, чем всего наблюдений. Значит доля самое большее равна единице, и то лишь когда все результаты одинаковы.',
      'This number cannot be a relative frequency, because it is ABOVE ONE. A relative frequency comes from dividing the frequency by the sample size, and a frequency is never larger than the size — a variant cannot occur more often than there are observations. So a share is at most one, and even that only when every result is the same.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i7 === 'z2', text: L(
      "Uch va yetti — butun sonlar, ya'ni ular SANOQ bo'la oladi. Ulush bo'lish uchun ular birdan kichik bo'lishi kerak edi. Chalkashlik shundan chiqadiki, ikki kattalik ham bitta variantdan olinadi: chastota uchga teng bo'lsa, hajm o'n bo'lganda ulush nol butun uch o'ndan bo'ladi. Bu ikki son bir-biriga o'xshaydi, lekin ular boshqa savolga javob beradi.",
      'Три и семь — целые числа, значит они могут быть ПОДСЧЁТОМ. Чтобы быть долей, им пришлось бы стать меньше единицы. Путаница оттого, что обе величины берутся из одного варианта: если частота равна трём, то при объёме десять доля будет нуль целых три десятых. Эти два числа похожи, но отвечают на разные вопросы.',
      'Three and seven are whole numbers, so they can be a COUNT. To be a share they would have to fall below one. The confusion arises because both quantities come from the same variant: if the frequency is three, then with a size of ten the share is zero point three. The two numbers resemble each other but answer different questions.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har songa bitta savol bering: u butun sonmi. Butun bo'lsa — sanoq, ya'ni chastota; kasr va birdan kichik bo'lsa — ulush, ya'ni nisbiy chastota. Boshqa hech narsa kerak emas, tanlanma ham kerak emas.",
      'К каждому числу задай один вопрос: целое ли оно. Целое — подсчёт, то есть частота; дробное и меньше единицы — доля, то есть относительная частота. Больше ничего не нужно, и выборка тоже не нужна.',
      'Ask one question of every number: is it whole. Whole means a count, that is a frequency; fractional and below one means a share, that is a relative frequency. Nothing else is needed, not even the sample.') },
  ],
  wrongText: L(
    "Chastota butun son, nisbiy chastota esa noldan birgacha bo'lgan ulush. Sonning ko'rinishi javobni beradi.",
    'Частота — целое число, относительная частота — доля от нуля до единицы. Вид числа сам даёт ответ.',
    'A frequency is a whole number, a relative frequency is a share between zero and one. The look of the number gives the answer.'),
};

export default function D34_10(props) { return <Zones data={DATA} {...props} />; }
