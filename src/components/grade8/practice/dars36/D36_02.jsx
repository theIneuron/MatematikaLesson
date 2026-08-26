// Dars36 · Amaliyot 02 — Ha yoki yo'q · 🟢 · tag: count_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §8 (36-dars, 2-pozitsiya)
//
// IKKALA DA'VO HAM YOLG'ON (skelet §0a.3), va sabab bitta: javoblar
// ALMASHTIRILGAN. Takrorsiz oltita son, takrorli to'qqizta — bu З73 ning
// o'zi.
//
// Ikkala javob ham «Yo'q» bo'lgani muhim: bitta da'voni rad etib,
// ikkinchisini «demak bu to'g'ri» deb qabul qilish yo'li yopiladi, va
// har ikkalasini ALOHIDA sanash kerak bo'ladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'count_claims', level: '🟢',
  itemSize: 15,
  given: [['1, 2, 3']],
  givenLabel: L('Raqamlar', 'Цифры', 'The digits'),
  items: [
    { id: 's1', yes: false, tokens: ['9'],
      claim: L("raqamlari takrorlanmaydigan ikki xonali sonlar soni", 'столько двузначных чисел без повтора цифр', 'this many two-digit numbers without repeated digits') },
    { id: 's2', yes: false, tokens: ['6'],
      claim: L("takrorlanishga ruxsat berilgandagi sonlar soni", 'столько чисел, если повтор разрешён', 'this many numbers if repetition is allowed') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Bir, ikki va uch raqamlaridan ikki xonali sonlar tuziladi. Ikki da'voda ikki xil shart bor: birinchisida raqamlar takrorlanmaydi, ikkinchisida takrorlanishga ruxsat berilgan.",
    'Из цифр один, два и три составляются двузначные числа. В двух утверждениях два разных условия: в первом цифры не повторяются, во втором повтор разрешён.',
    'Two-digit numbers are built from the digits one, two and three. The two claims carry two different conditions: in the first the digits do not repeat, in the second repetition is allowed.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri, ikkalasi ham yolg'on — javoblar bir-birining o'rniga qo'yilgan. Takrorlanish TAQIQLANGANDA: birinchi xonaga uchta raqamdan istalganini qo'yish mumkin, ikkinchi xonaga esa faqat ikkitasi qoladi, chunki bittasi allaqachon ishlatilgan. Uch karra ikki olti. Takrorlanishga RUXSAT berilganda: birinchi xonaga uchta, ikkinchi xonaga ham uchta — hech biri chiqib ketmaydi. Uch karra uch to'qqiz. Ya'ni to'qqiz — takrorli holning javobi, olti esa takrorsizniki, va da'volarda ular almashib qolgan. Farqni sanab ham ko'rish mumkin: to'qqiztadan uchtasi — o'n bir, yigirma ikki va o'ttiz uch — takrorli, va ular chiqarib tashlanganda oltita qoladi.",
    'Верно, оба ложны — ответы поставлены один вместо другого. Когда повтор ЗАПРЕЩЁН: в первый разряд можно поставить любую из трёх цифр, а во второй остаются лишь две, ведь одна уже использована. Трижды два шесть. Когда повтор РАЗРЕШЁН: в первый разряд три, во второй тоже три — ни одна не выбывает. Трижды три девять. То есть девять — ответ для случая с повтором, а шесть без повтора, и в утверждениях они переставлены. Разницу можно и пересчитать: из девяти три числа — одиннадцать, двадцать два и тридцать три — с повтором, и после их исключения остаётся шесть.',
    'Correct, both are false — the answers were put in each other places. When repetition is FORBIDDEN: any of the three digits may go into the first place, and only two remain for the second, since one is already used. Three times two is six. When repetition is ALLOWED: three for the first place and three for the second — none drops out. Three times three is nine. So nine is the answer for the case with repetition and six for the case without, and the claims have them swapped. The difference can also be counted out: of the nine, three — eleven, twenty-two and thirty-three — carry a repeat, and removing them leaves six.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1 && s.bad.indexOf('s2') !== -1, text: L(
      "Ikkala da'vo ham yolg'on edi, va ikkalasi ham qabul qilindi. Har birini ALOHIDA sanang, bittasining javobiga suyanmang. Takrorsiz: uch karra ikki olti. Takrorli: uch karra uch to'qqiz. Da'volarda esa to'qqiz takrorsizga, olti takrorliga berilgan — ikkalasi ham teskari.",
      'Оба утверждения были ложны, и оба приняты. Считай каждое ОТДЕЛЬНО, не опираясь на ответ другого. Без повтора: трижды два шесть. С повтором: трижды три девять. А в утверждениях девять отдано случаю без повтора, а шесть — с повтором; оба перевёрнуты.',
      'Both claims were false, and both were accepted. Count each SEPARATELY, without leaning on the other answer. Without repetition: three times two is six. With repetition: three times three is nine. In the claims nine was given to the case without repetition and six to the case with — both inverted.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo yolg'on: takrorsiz sonlar TO'QQIZTA emas, oltita. Bosqichlarni sanang: birinchi xonaga uchta raqam, ikkinchi xonaga esa ikkitasi — bittasi allaqachon band. Uch karra ikki olti. To'qqizta bo'lishi uchun ikkinchi xonaga ham uchta raqam qolishi kerak edi, ya'ni takrorlanishga ruxsat berilishi kerak edi.",
      'Первое утверждение ложно: чисел без повтора не ДЕВЯТЬ, а шесть. Сосчитай по шагам: в первый разряд три цифры, во второй две — одна уже занята. Трижды два шесть. Чтобы вышло девять, во втором разряде должны были остаться все три, то есть повтор должен был быть разрешён.',
      'The first claim is false: there are not NINE numbers without repetition, but six. Count step by step: three digits for the first place, two for the second — one is already taken. Three times two is six. For nine, all three would have to remain for the second place, that is, repetition would have to be allowed.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo ham yolg'on: takrorlanishga ruxsat berilganda sonlar OLTITA emas, to'qqizta. Ruxsat berilgani hech bir raqam chiqib ketmasligini bildiradi: ikkinchi xonaga yana uchtasi ham tushishi mumkin, o'n bir ham to'g'ri son. Uch karra uch to'qqiz. Olti — bu taqiq bo'lgandagi javob.",
      'Второе утверждение тоже ложно: при разрешённом повторе чисел не ШЕСТЬ, а девять. Разрешение означает, что ни одна цифра не выбывает: во второй разряд может попасть любая из трёх, и одиннадцать — тоже правильное число. Трижды три девять. Шесть — это ответ при запрете.',
      'The second claim is false as well: with repetition allowed there are not SIX numbers but nine. Allowing it means no digit drops out: any of the three may go into the second place, and eleven is a valid number too. Three times three is nine. Six is the answer when repetition is forbidden.') },
  ],
  wrongText: L(
    "Har shartni alohida sanang. Takrorlanish taqiqlansa ikkinchi bosqichda tanlov kamayadi, ruxsat berilsa esa kamaymaydi.",
    'Считай каждое условие отдельно. При запрете повтора на втором шаге выбор уменьшается, при разрешении не уменьшается.',
    'Count each condition separately. Forbidding repetition shrinks the choice at the second step; allowing it does not.'),
};

export default function D36_02(props) { return <TrueFalse data={DATA} {...props} />; }
