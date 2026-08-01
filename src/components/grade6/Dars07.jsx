import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Grade6TheoryTheme.css';
import {
  T,
  configureLesson,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  Stage,
  NavBack,
  NavNext,
  BackLabel,
  QuestionScreen,
  RevealScreen,
  PickDivisors,
  DragMatch,
  Classify,
  WhyCard,
  FactCard,
  Floaters,
  useIntroStages,
  Frac,
  mt,
  STYLES,
} from './Dars01.jsx';

const L = (uz, ru) => ({ uz, ru });

const SLIDES = [
  {
    type: 'title',
    eyebrow: L('Yangi mavzu', 'Новая тема'),
    title: L("Kasrning asosiy xossasi", 'Основное свойство дроби'),
    subtitle: L(
      "Bugun kasrning qiymatini o'zgartirmasdan uning surat va maxrajini o'zgartirishni o'rganamiz.",
      'Сегодня научимся менять числитель и знаменатель, не изменяя значения дроби.',
    ),
    audio: L(
      "Bugungi mavzu kasrning asosiy xossasi. Bugun kasrning qiymatini o'zgartirmasdan uning surat va maxrajini o'zgartirishni o'rganamiz. Buning uchun kasr bo'laklarini yanada mayda teng bo'laklarga ajratamiz va natijani kuzatamiz.",
      'Тема урока — основное свойство дроби. Сегодня мы научимся менять числитель и знаменатель, не изменяя значения дроби. Для этого разделим части дроби на более мелкие равные части и проследим за результатом.',
    ),
  },
  {
    type: 'question',
    scored: false,
    eyebrow: L('Eslab olamiz', 'Вспомним'),
    title: L("Yarimni mayda bo'laklarga ajrating", 'Разделим половину на мелкие части'),
    prompt: L(
      "Lentaning yarmi bo'yalgan. Har bir yarimni yana ikkita teng bo'lakka ajratsak, bo'yalgan qism qaysi kasr bo'ladi?",
      'Половина ленты закрашена. Если каждую половину разделить ещё на две равные части, какой дробью станет закрашенная часть?',
    ),
    intro: L(
      "Lentaning ikkidan bir qismi bo'yalgan. Endi har bir yarimni yana ikkita teng bo'lakka ajrating. Bo'yalgan maydon o'zgarmaydi, faqat bo'laklar soni ortadi. Javobni tanlang.",
      'Одна вторая ленты закрашена. Теперь разделите каждую половину ещё на две равные части. Закрашенная площадь не изменится, увеличится только число частей. Выберите ответ.',
    ),
    options: ['1/4', '2/4', '3/4', '2/3'],
    correct: 1,
    why: [
      L("Butun lenta to'rtta teng bo'lakka ajraldi.", 'Вся лента разделилась на четыре равные части.'),
      L("Oldingi yarim endi shu bo'laklarning ikkitasini egallaydi: 1/2 = 2/4.", 'Прежняя половина теперь занимает две части из четырёх: 1/2 = 2/4.'),
    ],
    wrong: L("Bo'yalgan maydonni emas, jami va bo'yalgan yangi bo'laklarni sanang.", 'Считайте не площадь, а общее число новых частей и число закрашенных частей.'),
    visual: 'half',
  },
  {
    type: 'info',
    eyebrow: L('Kashfiyot', 'Открытие'),
    title: L("Bo'laklar ko'paydi, qiymat o'zgarmadi", 'Частей стало больше, значение не изменилось'),
    steps: [
      L("Avval lenta 2 ta teng bo'lakdan iborat edi va 1 tasi bo'yalgan: 1/2.", 'Сначала лента состояла из двух равных частей, одна была закрашена: 1/2.'),
      L("Har bir bo'lakni ikkiga ajratgach, jami 4 ta bo'lak va 2 ta bo'yalgan qism hosil bo'ldi: 2/4.", 'После деления каждой части пополам получилось четыре части, из них две закрашены: 2/4.'),
      L("Bo'yalgan uzunlik o'smadi ham, kamaymadi ham. Shuning uchun 1/2 va 2/4 teng kasrlar.", 'Закрашенная длина не увеличилась и не уменьшилась. Поэтому 1/2 и 2/4 — равные дроби.'),
    ],
    visual: 'split',
  },
  {
    type: 'rule',
    eyebrow: L('Asosiy qoida', 'Главное правило'),
    title: L("Surat va maxrajni bir xil songa ko'paytiramiz", 'Умножаем числитель и знаменатель на одно число'),
    steps: [
      L("Kasrning surat va maxrajini bir xil natural songa ko'paytirsak, kasrning qiymati o'zgarmaydi.", 'Если числитель и знаменатель дроби умножить на одно и то же натуральное число, значение дроби не изменится.'),
      L("Masalan: 2/3 = (2 × 4)/(3 × 4) = 8/12.", 'Например: 2/3 = (2 × 4)/(3 × 4) = 8/12.'),
      L("Biz bo'yalgan maydonni o'zgartirmadik, faqat har bir eski bo'lakni to'rttadan mayda bo'lakka ajratdik.", 'Мы не изменили закрашенную площадь, а лишь разделили каждую прежнюю часть ещё на четыре части.'),
    ],
    visual: 'multiply',
  },
  {
    type: 'info',
    eyebrow: L('Nega ishlaydi?', 'Почему это работает?'),
    title: L("Bir butunni yana teng bo'lib chiqamiz", 'Снова делим целое на равные части'),
    steps: [
      L("Surat bo'yalgan bo'laklar sonini, maxraj esa jami teng bo'laklar sonini bildiradi.", 'Числитель показывает число закрашенных частей, а знаменатель — число всех равных частей.'),
      L("Har bir bo'lakni bir xil miqdorda maydalasak, bo'yalgan va jami bo'laklar aynan bir xil marta ko'payadi.", 'Если каждую часть одинаково раздробить, число закрашенных и общее число частей увеличатся в одинаковое число раз.'),
      L("Shu sabab ularning nisbati, ya'ni kasrning qiymati o'zgarmaydi.", 'Поэтому их отношение, то есть значение дроби, не меняется.'),
    ],
    visual: 'ratio',
  },
  {
    type: 'question',
    scored: true,
    eyebrow: L('Mashq', 'Практика'),
    title: L("Bir xil songa ko'paytiring", 'Умножьте на одно число'),
    prompt: L("3/5 kasrining surat va maxrajini 2 ga ko'paytirsak, qaysi kasr hosil bo'ladi?", 'Какая дробь получится, если числитель и знаменатель дроби 3/5 умножить на 2?'),
    intro: L("Beshdan uch kasrini oling. Suratni ham, maxrajni ham ikkiga ko'paytiring. To'g'ri natijani tanlang.", 'Возьмём дробь три пятых. Умножьте и числитель, и знаменатель на два. Выберите верный результат.'),
    options: ['5/7', '6/10', '3/10', '6/5'],
    correct: 1,
    why: [
      L("Surat: 3 × 2 = 6.", 'Числитель: 3 умножить на 2 равно 6.'),
      L("Maxraj: 5 × 2 = 10. Demak, 3/5 = 6/10.", 'Знаменатель: 5 умножить на 2 равно 10. Значит, 3/5 = 6/10.'),
    ],
    wrong: L("Bir xil amal suratga ham, maxrajga ham bajarilishi kerak.", 'Одно и то же действие нужно выполнить и с числителем, и со знаменателем.'),
    fact: L("Teng kasrlar son o'qida aynan bitta nuqtada joylashadi.", 'Равные дроби находятся в одной и той же точке числовой прямой.'),
    visual: 'threeFifths',
  },
  {
    type: 'info',
    eyebrow: L('Teskari yo‘l', 'Обратный путь'),
    title: L("Endi bo'laklarni yiriklashtiramiz", 'Теперь укрупним части'),
    steps: [
      L("6/8 kasrida surat ham, maxraj ham 2 ga bo'linadi.", 'В дроби 6/8 и числитель, и знаменатель делятся на 2.'),
      L("6 ni 2 ga bo'lsak 3, 8 ni 2 ga bo'lsak 4 chiqadi.", 'Если 6 разделить на 2, получится 3, а если 8 разделить на 2, получится 4.'),
      L("Demak, 6/8 = 3/4. Bu amal kasrni qisqartirish deyiladi.", 'Значит, 6/8 = 3/4. Это действие называется сокращением дроби.'),
    ],
    visual: 'reduce',
  },
  {
    type: 'question',
    scored: true,
    eyebrow: L('Mashq', 'Практика'),
    title: L("Kasrni qisqartiring", 'Сократите дробь'),
    prompt: L("10/15 kasrining surat va maxrajini 5 ga bo'ling.", 'Разделите числитель и знаменатель дроби 10/15 на 5.'),
    intro: L("O'n beshdan o'n kasrida surat va maxraj beshga bo'linadi. Ikkalasini ham beshga bo'lib, qisqargan kasrni tanlang.", 'В дроби десять пятнадцатых числитель и знаменатель делятся на пять. Разделите оба числа на пять и выберите сокращённую дробь.'),
    options: ['5/10', '2/3', '2/10', '10/3'],
    correct: 1,
    why: [
      L("10 : 5 = 2.", '10 разделить на 5 равно 2.'),
      L("15 : 5 = 3. Shuning uchun 10/15 = 2/3.", '15 разделить на 5 равно 3. Поэтому 10/15 = 2/3.'),
    ],
    wrong: L("Surat va maxrajni aynan bitta umumiy bo'luvchiga bo'ling.", 'Разделите числитель и знаменатель на один и тот же общий делитель.'),
    visual: 'tenFifteen',
  },
  {
    type: 'question',
    scored: true,
    eyebrow: L('Muhim shart', 'Важное условие'),
    title: L("Qaysi amal kasr qiymatini saqlaydi?", 'Какое действие сохраняет значение дроби?'),
    prompt: L("4/6 kasridan 2/3 ni olish uchun nima qilish kerak?", 'Что нужно сделать с дробью 4/6, чтобы получить 2/3?'),
    intro: L("Oltidan to'rt kasrini uchdan ikkiga aylantirish kerak. Surat va maxraj bilan bir xil amal bajariladigan javobni toping.", 'Нужно превратить дробь четыре шестых в две третьих. Найдите ответ, где с числителем и знаменателем выполняется одно действие.'),
    options: [
      L("Ikkalasini 2 ga bo'lish", 'Оба разделить на 2'),
      L("Faqat suratni 2 ga bo'lish", 'Только числитель разделить на 2'),
      L("Ikkalasidan 2 ni ayirish", 'Из обоих вычесть 2'),
      L("Faqat maxrajni 2 ga bo'lish", 'Только знаменатель разделить на 2'),
    ],
    correct: 0,
    why: [
      L("4 va 6 ning umumiy bo'luvchisi 2.", 'Общий делитель чисел 4 и 6 равен 2.'),
      L("4 : 2 = 2 va 6 : 2 = 3. Bir xil songa bo'lish qiymatni saqlaydi.", '4 разделить на 2 равно 2, а 6 разделить на 2 равно 3. Деление на одно число сохраняет значение.'),
    ],
    wrong: L("Ayirish kasrning asosiy xossasi emas. Umumiy ko'paytuvchi yoki bo'luvchini izlang.", 'Вычитание не является основным свойством дроби. Ищите общий множитель или делитель.'),
    visual: 'fourSixths',
  },
  {
    type: 'info',
    eyebrow: L("Son o'qida", 'На числовой прямой'),
    title: L("Turli yozuv — bitta nuqta", 'Разные записи — одна точка'),
    steps: [
      L("1/2, 2/4 va 3/6 kasrlarining yozilishi har xil.", 'Дроби 1/2, 2/4 и 3/6 записаны по-разному.'),
      L("Lekin ularning har biri butunning aynan yarmini bildiradi.", 'Но каждая из них обозначает ровно половину целого.'),
      L("Shuning uchun son o'qida uchalasi ham bir xil nuqtaga tushadi.", 'Поэтому на числовой прямой все три дроби попадают в одну точку.'),
    ],
    visual: 'numberLine',
  },
  {
    type: 'multi',
    scored: true,
    eyebrow: L('Bir nechta javob', 'Несколько ответов'),
    title: L("3/4 ga teng kasrlarni toping", 'Найдите дроби, равные 3/4'),
    prompt: L("Barcha teng kasrlarni belgilang va tekshiring.", 'Отметьте все равные дроби и проверьте ответ.'),
    intro: L("To'rtdan uchga teng bo'lgan barcha kasrlarni belgilang. Surat va maxraj bir xil marta o'zgarganini tekshiring.", 'Отметьте все дроби, равные трём четвёртым. Проверьте, во сколько раз изменились числитель и знаменатель.'),
    options: ['6/8', '9/12', '6/10', '12/16'],
    correctSet: [0, 1, 3],
    why: [
      L("3/4 ni 2, 3 va 4 ga kengaytirsak 6/8, 9/12 va 12/16 chiqadi.", 'Если расширить 3/4 в 2, 3 и 4 раза, получим 6/8, 9/12 и 12/16.'),
      L("6/10 qisqarsa 3/5 bo'ladi, shuning uchun u 3/4 ga teng emas.", 'Дробь 6/10 сокращается до 3/5, поэтому она не равна 3/4.'),
    ],
    wrong: L("Har bir variantda surat va maxraj nechta marta o'zgarganini alohida tekshiring.", 'В каждом варианте отдельно проверьте, во сколько раз изменились числитель и знаменатель.'),
  },
  {
    type: 'match',
    scored: true,
    eyebrow: L('Moslashtirish', 'Соответствие'),
    title: L("Teng kasrlarni juftlang", 'Соедините равные дроби'),
    prompt: L("Har bir chap kasr uchun o'ng tomondagi teng kasrni tanlang.", 'Для каждой дроби слева выберите равную дробь справа.'),
    intro: L("Har bir kasrni uning teng yozuvi bilan moslang. Surat va maxraj bir xil songa ko'payganini tekshiring.", 'Соедините каждую дробь с равной ей записью. Проверьте, что числитель и знаменатель умножены на одно число.'),
    rows: [
      { left: '1/2', options: ['3/4', '2/4', '4/5'], correct: '2/4' },
      { left: '2/3', options: ['4/5', '6/9', '3/8'], correct: '6/9' },
      { left: '3/5', options: ['9/15', '6/8', '4/10'], correct: '9/15' },
    ],
    why: [
      L("1/2 ni 2 ga kengaytirsak 2/4; 2/3 ni 3 ga kengaytirsak 6/9 chiqadi.", 'Если расширить 1/2 в 2 раза, получим 2/4; если расширить 2/3 в 3 раза, получим 6/9.'),
      L("3/5 ni 3 ga kengaytirsak 9/15 bo'ladi.", 'Если расширить 3/5 в 3 раза, получим 9/15.'),
    ],
    wrong: L("Har bir juftda surat va maxraj uchun bitta umumiy ko'paytiruvchini toping.", 'В каждой паре найдите один общий множитель для числителя и знаменателя.'),
  },
  {
    type: 'classify',
    scored: true,
    eyebrow: L('Tasniflash', 'Классификация'),
    title: L("Tengmi yoki teng emasmi?", 'Равны или не равны?'),
    prompt: L("Har bir juftlikni mos guruhga ajrating.", 'Распределите каждую пару в подходящую группу.'),
    intro: L("Har bir kasr juftligini tekshiring. Ular teng bo'lsa teng kasr guruhiga, aks holda teng emas guruhiga joylashtiring.", 'Проверьте каждую пару дробей. Равные поместите в группу равных, остальные — в группу неравных.'),
    cards: [
      { label: '2/6 = 1/3', value: true },
      { label: '4/10 = 2/5', value: true },
      { label: '6/10 = 3/4', value: false },
      { label: '8/12 = 2/3', value: true },
    ],
    why: [
      L("2/6, 4/10 va 8/12 kasrlarini umumiy bo'luvchiga qisqartirsak o'ngdagi kasrlar chiqadi.", 'Если сократить 2/6, 4/10 и 8/12 на общий делитель, получатся дроби справа.'),
      L("6/10 esa 3/5 ga qisqaradi, 3/4 ga emas.", 'А дробь 6/10 сокращается до 3/5, а не до 3/4.'),
    ],
    wrong: L("Kasrlarni qisqartirib, eng sodda ko'rinishlarini taqqoslang.", 'Сократите дроби и сравните их простейшие виды.'),
  },
  {
    type: 'number',
    scored: true,
    eyebrow: L('Yakuniy masala', 'Финальная задача'),
    title: L("Noma'lum suratni toping", 'Найдите неизвестный числитель'),
    prompt: L("?/18 = 2/3 bo'lsa, savol belgisi o'rnida qaysi son turadi?", 'Если ?/18 = 2/3, какое число стоит вместо вопросительного знака?'),
    intro: L("Uch maxraj o'n sakkizga necha marta ko'payganini toping. Keyin suratni ham aynan shuncha marta ko'paytiring. Javobni tanlang.", 'Определите, во сколько раз знаменатель три увеличился до восемнадцати. Затем во столько же раз увеличьте числитель. Выберите ответ.'),
    options: ['6', '9', '12', '15'],
    correct: 2,
    why: [
      L("3 dan 18 hosil bo'lishi uchun 3 ni 6 ga ko'paytiramiz.", 'Чтобы из 3 получить 18, нужно умножить 3 на 6.'),
      L("Suratni ham 6 ga ko'paytiramiz: 2 × 6 = 12. Demak, 12/18 = 2/3.", 'Числитель тоже умножаем на 6: 2 умножить на 6 равно 12. Значит, 12/18 = 2/3.'),
    ],
    wrong: L("Avval maxrajlar orasidagi ko'paytiruvchini toping, so'ng shu sonni suratga qo'llang.", 'Сначала найдите множитель между знаменателями, затем примените его к числителю.'),
    fact: L("Kasrlarni umumiy maxrajga keltirish ham aynan shu asosiy xossaga tayanadi.", 'Приведение дробей к общему знаменателю основано на этом же свойстве.'),
    visual: 'unknown',
  },
  {
    type: 'summary',
    eyebrow: L('Dars yakuni', 'Итог урока'),
    title: L("Kasrning asosiy xossasi", 'Основное свойство дроби'),
    points: [
      L("Surat va maxrajni bir xil natural songa ko'paytirish kasr qiymatini o'zgartirmaydi.", 'Умножение числителя и знаменателя на одно натуральное число не меняет значение дроби.'),
      L("Surat va maxrajni umumiy bo'luvchiga bo'lish ham qiymatni saqlaydi va kasrni qisqartiradi.", 'Деление числителя и знаменателя на общий делитель сохраняет значение и сокращает дробь.'),
      L("Teng kasrlar turlicha yozilsa ham, son o'qida bitta nuqtani bildiradi.", 'Равные дроби записываются по-разному, но обозначают одну точку на числовой прямой.'),
    ],
    audio: L(
      "Dars o'tildi. Asosiysini yig'amiz. Kasrning surat va maxrajini bir xil natural songa ko'paytirsak, kasrning qiymati o'zgarmaydi. Ularni bir xil umumiy bo'luvchiga bo'lsak ham qiymat saqlanadi, kasr esa qisqaradi. Teng kasrlar turlicha yoziladi, lekin bir xil miqdorni bildiradi. Keyingi darsda bu xossadan kasrlarni qisqartirishda foydalanamiz.",
      'Урок пройден. Соберём главное. Если числитель и знаменатель дроби умножить на одно натуральное число, значение дроби не изменится. При делении на один общий делитель значение тоже сохраняется, а дробь сокращается. Равные дроби записываются по-разному, но обозначают одно количество. На следующем уроке применим это свойство для сокращения дробей.',
    ),
  },
];

const TOTAL_SCREENS = 15;
const SCORED_SCREENS = [7, 8, 9, 10, 11, 12, 13];
const FACT_BADGE = {
  uz: 'Bilasizmi? · Matematika',
  ru: 'Знаете ли вы? · Математика',
};

const localized = (node, lang) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  return node[lang] ?? node.uz ?? node.ru ?? '';
};

const correctText = (slide) => ({
  uz: `To'g'ri. ${slide.why?.[0]?.uz || ''}`,
  ru: `Верно. ${slide.why?.[0]?.ru || ''}`,
});

const factAudio = (slide) => slide.fact ? {
  uz: `Bilasizmi? ${slide.fact.uz}`,
  ru: `Знаете ли вы? ${slide.fact.ru}`,
} : null;

function FractionBars({ numerator, denominator, tone = 'accent' }) {
  return (
    <div className={`d7-bars d7-bars-${tone}`} aria-label={`${numerator}/${denominator}`}>
      {Array.from({ length: denominator }, (_, index) => (
        <span key={index} className={index < numerator ? 'filled' : ''}/>
      ))}
    </div>
  );
}

function FractionPair({ left, right, leftParts, rightParts }) {
  return (
    <div className="d7-pair">
      <div>
        <Frac n={left.split('/')[0]} d={left.split('/')[1]} size="mid"/>
        <FractionBars numerator={leftParts[0]} denominator={leftParts[1]}/>
      </div>
      <b>=</b>
      <div>
        <Frac n={right.split('/')[0]} d={right.split('/')[1]} size="mid"/>
        <FractionBars numerator={rightParts[0]} denominator={rightParts[1]} tone="blue"/>
      </div>
    </div>
  );
}

function Equation({ a, b, op = '×', by }) {
  const [an, ad] = a.split('/');
  const [bn, bd] = b.split('/');
  return (
    <div className="d7-equation">
      <Frac n={an} d={ad} size="mid"/>
      {by && (
        <>
          <span>=</span>
          <span className="d7-op-frac">
            <b>{an} {op} {by}</b>
            <i/>
            <b>{ad} {op} {by}</b>
          </span>
        </>
      )}
      <span>=</span>
      <Frac n={bn} d={bd} size="mid"/>
    </div>
  );
}

function NumberLine() {
  return (
    <div className="d7-line">
      <span className="d7-tick d7-tick-0"/><span className="d7-tick d7-tick-half"/><span className="d7-tick d7-tick-1"/>
      <b className="d7-zero">0</b><b className="d7-one">1</b>
      <div className="d7-line-fracs"><Frac n="1" d="2"/><Frac n="2" d="4"/><Frac n="3" d="6"/></div>
    </div>
  );
}

function LessonVisual({ kind, lang }) {
  if (kind === 'half') return (
    <div className="d7-visual-stack">
      <FractionBars numerator={1} denominator={2}/>
      <span className="d7-down">↓</span>
      <FractionBars numerator={2} denominator={4} tone="blue"/>
    </div>
  );
  if (kind === 'split') return <FractionPair left="1/2" right="2/4" leftParts={[1, 2]} rightParts={[2, 4]}/>;
  if (kind === 'multiply') return <Equation a="2/3" b="8/12" by="4"/>;
  if (kind === 'ratio') return (
    <div className="d7-visual-stack">
      <FractionBars numerator={2} denominator={3}/>
      <p className="small mono d7-caption">{lang === 'uz' ? 'har bir bo‘lak × 3' : 'каждая часть × 3'}</p>
      <FractionBars numerator={6} denominator={9} tone="blue"/>
    </div>
  );
  if (kind === 'threeFifths') return <FractionPair left="3/5" right="6/10" leftParts={[3, 5]} rightParts={[6, 10]}/>;
  if (kind === 'reduce') return <Equation a="6/8" b="3/4" op=":" by="2"/>;
  if (kind === 'tenFifteen') return <Equation a="10/15" b="2/3" op=":" by="5"/>;
  if (kind === 'fourSixths') return <Equation a="4/6" b="2/3" op=":" by="2"/>;
  if (kind === 'numberLine') return <NumberLine/>;
  if (kind === 'unknown') return (
    <div className="d7-equation">
      <Frac n="?" d="18" size="mid"/><span>=</span><Frac n="2" d="3" size="mid"/>
    </div>
  );
  return null;
}

function FractionDrift() {
  return (
    <div className="d7-drift" aria-hidden="true">
      {['1/2', '2/4', '3/6', '4/8', '5/10', '6/12'].map((value, index) => {
        const [n, d] = value.split('/');
        return <span className={`d7-drift-${index + 1}`} key={value}><Frac n={n} d={d}/></span>;
      })}
    </div>
  );
}

function FactFractionIcon() {
  return (
    <div className="d7-fact-icon" aria-hidden="true">
      <Frac n="1" d="2" size="mid"/><span>=</span><Frac n="2" d="4" size="mid"/>
    </div>
  );
}

function D7TitleScreen({ screen, totalScreens, onAnswer, onNext }) {
  const slide = SLIDES[0];
  const t = useT();
  const lang = useLang();
  const audio = useAudio([
    {
      id: 'd7_s0_topic',
      text: lang === 'uz'
        ? "Bugungi mavzu kasrning asosiy xossasi. Bugun kasrning qiymatini o'zgartirmasdan uning surat va maxrajini o'zgartirishni o'rganamiz."
        : 'Тема урока — основное свойство дроби. Сегодня научимся менять числитель и знаменатель, не изменяя значения дроби.',
      trigger: 'on_mount',
      waits_for: null,
    },
    {
      id: 'd7_s0_example',
      text: lang === 'uz'
        ? "Bir kasrning ikki xil yozuviga qarang: ikkidan bir va to'rtdan ikki. Ular nega teng ekanini dars davomida aniqlaymiz."
        : 'Посмотрите на две записи одной дроби: одна вторая и две четвёртых. На уроке выясним, почему они равны.',
      trigger: 'after_previous',
      waits_for: { type: 'option_picked' },
    },
  ]);
  const [picked, setPicked] = useState(null);
  const pickedRef = useRef(false);
  const introDone = audio.muted || (audio.hasStarted && !audio.isBusy);
  const formulaVisible = audio.muted ||
    audio.currentSegment === 'd7_s0_example' ||
    audio.lastCompletedSegment === 'd7_s0_topic' ||
    audio.lastCompletedSegment === 'd7_s0_example';
  const introStages = useIntroStages({ start: formulaVisible, optionsReady: introDone });

  const pick = (value) => {
    if (pickedRef.current) return;
    pickedRef.current = true;
    setPicked(value);
    onAnswer({ stage: 'hook', screenIdx: screen, studentAnswer: value, correct: true });
    audio.triggerEvent('option_picked');
    setTimeout(onNext, 280);
  };

  return (
    <Stage eyebrow={slide.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div className={`ttl-wrap${introStages.compact ? ' ttl-example-focus' : ''}`}>
        <Floaters/>
        <FractionDrift/>
        <p className="eyebrow ttl-kicker">{lang === 'uz' ? 'YANGI MAVZU' : 'НОВАЯ ТЕМА'}</p>
        <h1 className="display ttl-h1">
          {lang === 'uz' ? "Nega 1/2 va 2/4 bir xil miqdorni ko'rsatadi?" : 'Почему 1/2 и 2/4 обозначают одно и то же количество?'}
        </h1>
        <span className="ttl-rule" aria-hidden="true"/>
        <p className="body ttl-sub">{t(slide.subtitle)}</p>
        {introStages.showExample && (
          <>
          <div className="ttl-hero ttl-stage-reveal">
            <div className="d7-title-equation"><Frac n="1" d="2" size="mid"/><span>=</span><Frac n="2" d="4" size="mid"/></div>
            {introDone && (
              <div className="ttl-tease">
                <span className="ttl-q">{lang === 'uz' ? 'Qiymati o‘zgardimi?' : 'Значение изменилось?'}</span>
                <span className="ttl-q">{lang === 'uz' ? 'Nega teng?' : 'Почему равны?'}</span>
              </div>
            )}
          </div>
            <div className="ttl-prompt-slot">
            <p className={`small ttl-prompt${introStages.showPrompt ? ' is-visible' : ''}`}>
              {lang === 'uz' ? 'Boshlashga tayyormisiz?' : 'Готовы начать?'}
            </p>
            </div>
            <div className={`ttl-opts${introStages.showOptions ? ' is-visible' : ''}`}>
              <button className="option ttl-opt" disabled={picked !== null} onClick={() => pick('go')}>
                {lang === 'uz' ? 'Ha, boshlaymiz' : 'Да, начнём'}
              </button>
              <button className="option ttl-opt" disabled={picked !== null} onClick={() => pick('curious')}>
                {lang === 'uz' ? "Buni bilishni xohlayman" : 'Хочу разобраться'}
              </button>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
}

function D7RevealScreen({ screen, slideIndex = screen, ...props }) {
  const slide = SLIDES[slideIndex];
  const content = useMemo(() => ({
    eyebrow: slide.eyebrow,
    audio: {
      uz: slide.steps.map((step) => step.uz),
      ru: slide.steps.map((step) => step.ru),
    },
  }), [slide]);

  return (
    <RevealScreen
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={TOTAL_SCREENS}
      renderStep={({ t, lang, step, refs }) => (
        <div className="rv-col g6-explanation-flow">
          <h2 className="title h-title g6-explanation-question fade-up">{t(slide.title)}</h2>
          <div className="frame fade-up delay-1 d7-figure-frame">
            <LessonVisual kind={slide.visual} lang={lang}/>
          </div>
          {slide.steps.slice(0, step + 1).map((line, index) => (
            <div ref={refs[index]} className="frame-tip g6-explanation-step fade-up" key={index}>
              <span className="g6-explanation-lamp" aria-hidden="true">💡</span>
              <p className="body g6-explanation-text">{mt(t(line))}</p>
            </div>
          ))}
        </div>
      )}
    />
  );
}

function D7QuestionScreen({ screen, slideIndex = screen, ...props }) {
  const slide = SLIDES[slideIndex];
  const lang = useLang();
  const options = (slide.options || []).map((option) => {
    const value = localized(option, lang);
    const rendered = mt(value);
    return /^\d+$/.test(value)
      ? <span className="mono d7-standalone-number">{rendered}</span>
      : rendered;
  });
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    correct_text: correctText(slide),
    wrong_default: slide.wrong,
    audio: {
      intro: slide.intro,
      on_correct: { uz: "To'g'ri.", ru: 'Верно.' },
      on_wrong: slide.wrong,
    },
  };
  const fact = factAudio(slide);

  return (
    <QuestionScreen
      {...props}
      screen={screen}
      idx={screen}
      totalScreens={TOTAL_SCREENS}
      screenMeta={{ scope: slide.scored ? 'practice' : 'hook' }}
      screenContent={content}
      titleNode={slide.title}
      question={<p className="body" style={{ color: T.ink2 }}>{mt(localized(slide.prompt, lang))}</p>}
      options={options}
      correctIdx={slide.correct}
      figure={(solved) => solved ? null : <LessonVisual kind={slide.visual} lang={lang}/>}
      factOnCorrect={<WhyCard lines={{ uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) }}/>}
      factAudio={fact}
      factNode={slide.fact ? (
        <FactCard text={slide.fact} badge={FACT_BADGE} anim={<FactFractionIcon/>}/>
      ) : null}
    />
  );
}

function D7MultiScreen({ screen, slideIndex = 10, ...props }) {
  const slide = SLIDES[slideIndex];
  const correctValues = slide.correctSet.map((index) => slide.options[index]);
  const content = {
    eyebrow: slide.eyebrow,
    label: { uz: 'bir nechta javob', ru: 'несколько ответов' },
    context: {
      uz: "To'g'ri tanlovlar yashil bo'lib saqlanadi. Xato tanlovlarni qayta tekshiring.",
      ru: 'Верные варианты сохранятся зелёными. Ошибочные варианты проверьте ещё раз.',
    },
    question: slide.title,
    numbers: slide.options,
    divisors: correctValues,
    correct_text: correctText(slide),
    hint: slide.wrong,
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slide.intro,
      on_correct: { uz: "To'g'ri, barcha teng kasrlar topildi.", ru: 'Верно, все равные дроби найдены.' },
      on_wrong: slide.wrong,
    },
  };
  return (
    <PickDivisors
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={TOTAL_SCREENS}
      retryMode
      whyNode={<WhyCard lines={content.why}/>}
    />
  );
}

function D7MatchScreen({ screen, slideIndex = 11, ...props }) {
  const slide = SLIDES[slideIndex];
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    lead: slide.prompt,
    pairs: slide.rows.map((row) => ({
      number: row.left,
      label: { uz: 'teng kasri', ru: 'равная дробь' },
      reading: { uz: row.correct, ru: row.correct },
    })),
    correct_text: correctText(slide),
    hint: slide.wrong,
    audio_hint: slide.wrong,
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slide.intro,
      on_correct: { uz: "To'g'ri, barcha juftliklar joyida.", ru: 'Верно, все пары на своих местах.' },
      on_wrong: slide.wrong,
    },
  };
  return (
    <DragMatch
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={TOTAL_SCREENS}
      factNode={<WhyCard lines={content.why}/>}
    />
  );
}

function D7ClassifyScreen({ screen, slideIndex = 12, ...props }) {
  const slide = SLIDES[slideIndex];
  const content = {
    eyebrow: slide.eyebrow,
    title: slide.title,
    lead: slide.prompt,
    bin_a: { uz: 'Teng kasr', ru: 'Равные дроби' },
    bin_b: { uz: 'Teng emas', ru: 'Не равны' },
    cards: slide.cards.map((card) => ({ label: card.label, bin: card.value ? 'a' : 'b' })),
    hint: slide.wrong,
    audio_hint: slide.wrong,
    correct_text: correctText(slide),
    why: { uz: slide.why.map((line) => line.uz), ru: slide.why.map((line) => line.ru) },
    audio: {
      intro: slide.intro,
      on_correct: { uz: "To'g'ri, barcha juftliklar ajratildi.", ru: 'Верно, все пары распределены.' },
      on_wrong: { uz: 'Bu guruhga emas.', ru: 'Не в эту группу.' },
    },
  };
  return (
    <Classify
      {...props}
      screen={screen}
      screenContent={content}
      totalScreens={TOTAL_SCREENS}
      whyNode={<WhyCard lines={content.why}/>}
    />
  );
}

function D7SummaryScreen({ screen, totalScreens, answers, onPrev, finishLesson }) {
  const slide = SLIDES[14];
  const lang = useLang();
  const t = useT();
  const score = SCORED_SCREENS.filter((index) => answers[index]?.firstTry === true).length;
  const audio = useAudio([{
    id: 'd7_summary',
    text: slide.audio[lang],
    trigger: 'on_mount',
    waits_for: null,
  }]);
  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext
        disabled={audio.isBusy}
        label={lang === 'uz' ? 'Darsni yakunlash' : 'Завершить урок'}
        onClick={finishLesson}
      />
    </>
  );
  return (
    <Stage eyebrow={slide.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="g6-final-slide" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(12px, 2.2vw, 18px)' }}>
        <div className="sm-head fade-up">
          <h2 className="title h-sub">{t(slide.title)}</h2>
        </div>
        <p className="small fade-up sm-result" style={{ margin: 0, color: T.ink3 }}>
          <span>{lang === 'uz' ? "Topshiriqlar bo'yicha natijangiz:" : 'Ваш результат по заданиям:'}</span>
          <strong className="sm-score mono">{score}/{SCORED_SCREENS.length}</strong>
        </p>
        <div className="frame sm-main fade-up delay-1">
          <p className="small mono" style={{ color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            {lang === 'uz' ? 'Asosiysi' : 'Главное'}
          </p>
          <div className="d7-summary-list">
            {slide.points.map((point, index) => (
              <div key={index}><span>{index + 1}</span><p className="body">{mt(t(point))}</p></div>
            ))}
          </div>
        </div>
        <div className="frame-success sm-close fade-up delay-2">
          <p className="body">
            {lang === 'uz'
              ? "Endi teng kasrlarni topish, kasrni kengaytirish va qisqartirish qoidasini bilasiz."
              : 'Теперь вы умеете находить равные дроби, расширять и сокращать дроби.'}
          </p>
        </div>
      </div>
    </Stage>
  );
}

const SCREEN_SEQUENCE = [
  { Component: D7TitleScreen, slideIndex: 0 },
  { Component: D7RevealScreen, slideIndex: 2 },
  { Component: D7RevealScreen, slideIndex: 3 },
  { Component: D7RevealScreen, slideIndex: 4 },
  { Component: D7RevealScreen, slideIndex: 6 },
  { Component: D7RevealScreen, slideIndex: 9 },
  { Component: D7QuestionScreen, slideIndex: 1 },
  { Component: D7QuestionScreen, slideIndex: 5 },
  { Component: D7QuestionScreen, slideIndex: 7 },
  { Component: D7QuestionScreen, slideIndex: 8 },
  { Component: D7MultiScreen, slideIndex: 10 },
  { Component: D7MatchScreen, slideIndex: 11 },
  { Component: D7ClassifyScreen, slideIndex: 12 },
  { Component: D7QuestionScreen, slideIndex: 13 },
  { Component: D7SummaryScreen, slideIndex: 14 },
];

const D7_STYLES = `
.d7-lesson .frac,
.d7-lesson .frac .n,
.d7-lesson .frac .d {
  font-family: inherit;
  font-variation-settings: inherit;
  font-weight: inherit;
}
.d7-lesson .d7-standalone-number {
  font-family: 'JetBrains Mono', monospace;
  font-variation-settings: normal;
  font-weight: 700;
}
.d7-bars { width: min(100%, 560px); min-height: clamp(46px, 8vw, 62px); display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; overflow: hidden; border: 2px solid #494550; border-radius: 12px; background: #FFFFFF; }
.d7-bars span { border-right: 1.5px solid #8A8883; transition: background 0.55s ease; }
.d7-bars span:last-child { border-right: none; }
.d7-bars-accent span.filled { background: #FFE8E1; }
.d7-bars-blue span.filled { background: #EAF6FB; }
.d7-pair { width: 100%; display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: clamp(8px, 2vw, 18px); }
.d7-pair > div { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.d7-pair > b { font-family: 'JetBrains Mono', monospace; font-size: clamp(24px, 5vw, 36px); color: #8A8883; }
.d7-visual-stack { width: 100%; max-width: 590px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.d7-down { color: #FF4F28; font-size: 24px; line-height: 1; }
.d7-caption { color: #FF4F28; }
.d7-equation, .d7-title-equation { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 18px); font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 4.4vw, 32px); font-weight: 700; }
.d7-op-frac {
  display: inline-grid;
  grid-template-rows: 1fr 0.08em 1fr;
  text-align: center;
  font-family: 'Fraunces', 'Source Serif 4', serif;
  font-size: clamp(26px, 5vw, 38px);
  font-variation-settings: "opsz" 144;
  font-weight: 600;
  line-height: 1;
}
.d7-op-frac b {
  padding: 0 0.12em;
  font: inherit;
}
.d7-op-frac i {
  display: block;
  width: 100%;
  min-height: 2px;
  border-radius: 2px;
  background: currentColor;
}
.d7-figure-frame { display: flex; align-items: center; justify-content: center; min-height: clamp(92px, 18vw, 142px); padding: clamp(12px, 2.4vw, 18px); }
.d7-step-number { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; margin-right: 9px; border-radius: 50%; background: currentColor; color: #FFFFFF; font: 700 12px 'JetBrains Mono', monospace; vertical-align: 2px; }
.rv-lbl-a .d7-step-number { background: #FF4F28; }
.rv-lbl-b .d7-step-number { background: #1F7A4D; }
.d7-line { position: relative; width: 100%; max-width: 590px; height: 112px; margin: 0 auto; border-top: 4px solid #494550; margin-top: 48px; }
.d7-tick { position: absolute; top: -12px; width: 3px; height: 22px; background: #494550; }
.d7-tick-0 { left: 0; }.d7-tick-half { left: 50%; background: #FF4F28; height: 29px; top: -15px; }.d7-tick-1 { right: 0; }
.d7-zero, .d7-one { position: absolute; top: 17px; font-family: 'JetBrains Mono', monospace; }.d7-zero { left: 0; }.d7-one { right: 0; }
.d7-line-fracs { position: absolute; left: 50%; top: -48px; transform: translateX(-50%); display: flex; gap: 10px; color: #FF4F28; }
.d7-drift { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.d7-drift > span { position: absolute; color: #FF4F28; opacity: 0.07; animation: ambFloat 17s ease-in-out infinite; }
.d7-drift-1 { left: 5%; top: 10%; font-size: 31px; }.d7-drift-2 { right: 8%; top: 8%; font-size: 24px; animation-delay: -3s!important; color: #019ACB!important; }
.d7-drift-3 { left: 10%; bottom: 14%; font-size: 27px; animation-delay: -6s!important; }.d7-drift-4 { right: 5%; bottom: 12%; font-size: 34px; animation-delay: -9s!important; color: #019ACB!important; }
.d7-drift-5 { left: 42%; top: 2%; font-size: 21px; animation-delay: -12s!important; }.d7-drift-6 { right: 20%; bottom: 31%; font-size: 24px; animation-delay: -14s!important; }
.d7-fact-icon { display: flex; align-items: center; justify-content: center; gap: 7px; color: #019ACB; font-size: 17px; }
.d7-summary-list { display: flex; flex-direction: column; gap: 10px; }
.d7-summary-list > div { display: grid; grid-template-columns: 26px 1fr; gap: 10px; align-items: start; }
.d7-summary-list > div > span { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: #FFE8E1; color: #FF4F28; font: 700 12px 'JetBrains Mono', monospace; }
.d7-summary-list p { margin: 0; }
@media (max-width: 639.98px) {
  .d7-bars { min-height: 44px; }
  .d7-pair { gap: 6px; }
  .d7-figure-frame { min-height: 88px; }
  .d7-line { height: 96px; margin-top: 45px; }
}
`;

export default function Dars07({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  aiGradingEndpoint,
  onFinished,
}) {
  useMobileZoom();
  const isPreview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '',
    studentName: safeName,
    voiceGender: voiceGender || 'm',
  });
  const safeOnFinished = useMemo(
    () => onFinished || ((payload) => console.log('[Preview] onFinished payload:', payload)),
    [onFinished],
  );
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startRef = useRef(0);
  const navLockRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[current] = data;
      return next;
    });
  }, [current]);

  const navGuard = () => {
    const now = Date.now();
    if (now - navLockRef.current < 350) return false;
    navLockRef.current = now;
    return true;
  };
  const next = () => { if (navGuard()) setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1)); };
  const prev = () => { if (navGuard()) setCurrent((value) => Math.max(value - 1, 0)); };

  const finishLesson = useCallback(() => {
    const score = SCORED_SCREENS.filter((index) => answers[index]?.firstTry === true).length;
    safeOnFinished({
      lessonId: 'frac_6_07',
      lessonTitle: { uz: 'Kasrning asosiy xossasi', ru: 'Основное свойство дроби' },
      studentName: safeName,
      durationSec: Math.floor((Date.now() - startRef.current) / 1000),
      totalQuestions: SCORED_SCREENS.length,
      correctAnswers: score,
      scorePercent: Math.round((score / SCORED_SCREENS.length) * 100),
      finalScore: score,
      finalTotal: SCORED_SCREENS.length,
      passed: score >= Math.ceil(SCORED_SCREENS.length * 0.7),
      firstTryStats: { total: SCORED_SCREENS.length, firstTryCorrect: score },
      answers: answers.filter(Boolean),
    });
  }, [answers, safeName, safeOnFinished]);

  const { Component: CurrentScreen, slideIndex } = SCREEN_SEQUENCE[current];

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <style>{D7_STYLES}</style>
      <div className="lesson-root grade6-theory-etalon d7-lesson">
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(58, 53, 48, 0.25)' }}>
            {['ru', 'uz'].map((value) => (
              <button
                key={value}
                onClick={() => setPreviewLang(value)}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 99,
                  padding: '4px 12px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  background: previewLang === value ? '#FF4F28' : 'transparent',
                  color: previewLang === value ? '#FFFFFF' : '#5A5A60',
                }}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={`${current}-${lang}`}
          screen={current}
          slideIndex={slideIndex}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={recordAnswer}
          onNext={next}
          onPrev={prev}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
