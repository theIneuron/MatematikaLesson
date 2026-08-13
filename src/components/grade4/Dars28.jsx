import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 28 · Vaqt birliklari
// 15 ekran · 50 narration beat · barcha interaction ixtiyoriy, navigatsiya ochiq.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const LANGUAGE_SELECTOR_LABEL = { uz: 'Tilni tanlash', ru: 'Выбор языка', en: 'Choose language' };
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const LESSON_META = {
  lessonId: 'measure-4-28-v1',
  slug: 'dars28-vaqt-birliklari',
  lessonTitle: { uz: 'Vaqt birliklari', ru: 'Единицы времени', en: 'Units of time' },
  skillTags: ['time-units', 'non-decimal-conversion', 'elapsed-time', 'measurement-check'],
};
const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'hypothesis-choice', goal: 'diagnose-prior-model', mechanic: 'hypothesis-choice', active: true, assessed: false, scored: false, scope: 'hook', misconceptions: ['surface-feature-choice'] },
  { id: 's1', type: 'exploration', template: 'guided-model', goal: 'inspect-first-model', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's2', type: 'exploration', template: 'guided-compare', goal: 'compare-representations', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['representation-swap'] },
  { id: 's3', type: 'exploration', template: 'guided-construction', goal: 'build-mathematical-model', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['construction-order'] },
  { id: 's4', type: 'exploration', template: 'guided-second-model', goal: 'connect-second-representation', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's5', type: 'exploration', template: 'guided-pattern', goal: 'discover-pattern', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['visual-guess'] },
  { id: 's6', type: 'rule', template: 'guided-verification', goal: 'verify-discovery', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['unchecked-result'] },
  { id: 's7', type: 'rule', template: 'guided-rule', goal: 'formulate-rule', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's8', type: 'test', template: 'choice-retry', goal: 'apply-model', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['wrong-operation'] },
  { id: 's9', type: 'test', template: 'choice-retry', goal: 'apply-representation', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['wrong-representation'] },
  { id: 's10', type: 'test', template: 'choice-retry', goal: 'independent-application', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['calculation-slip'] },
  { id: 's11', type: 'strategy', template: 'strategy-choice', goal: 'choose-strategy', mechanic: 'strategy-choice', active: true, assessed: false, scored: false, scope: null, misconceptions: ['strategy-without-check'] },
  { id: 's12', type: 'error', template: 'error-repair', goal: 'repair-typical-error', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['repeat-typical-error'] },
  { id: 's13', type: 'case', template: 'life-transfer', goal: 'transfer-to-life-context', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'final', misconceptions: ['context-data-mismatch'] },
  { id: 's14', type: 'summary', template: 'guided-reflection', goal: 'reflect-and-bridge', mechanic: 'guided-reveal-and-reflection', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
];
const bi = (uz, ru, en) => ({ uz, ru, en });
const SOLUTION_LABEL = bi('YECHIM', 'РЕШЕНИЕ', 'SOLUTION');
const HOOK_RETRY = bi(
  "60 minutni alohida soatga aylantirib, qolgan 15 minutni saqlang.",
  'Превратите 60 минут в отдельный час и сохраните оставшиеся 15 минут.',
  'Regroup 60 minutes as another hour and keep the remaining 15 minutes.',
);
const REWARD_TITLE = bi('Vaqt birliklari ustasi', 'Мастер единиц времени', "Master of time units");
const REFLECTION = {
  question: bi("Bu mavzuda sizga qaysi usul ko'proq yordam berdi?", 'Какой способ больше всего помог вам в этой теме?', 'Which method helped you most in this topic?'),
  options: [
    bi("Modelni bosqichma-bosqich tekshirish", 'Проверять модель шаг за шагом', 'Checking the model step by step'),
    bi("Ikki tasvirni solishtirish", 'Сравнивать два представления', 'Comparing two representations'),
    bi("Javobni boshqa usul bilan tekshirish", 'Проверять ответ другим способом', 'Checking the answer another way'),
  ],
};
const CONTENT = {
  s0: {
    eyebrow: bi('Vaqt minorasi', 'Башня времени', "Time tower"), title: bi("1 soat 75 minut to'g'ri yozuvmi?", 'Верно ли записано 1 час 75 минут?', "Is 1 hour 75 minutes written correctly?"), scene: 'tower', closedSet: true, correctIndex: 0,
    frames: [bi('Jadval: 1 soat 75 minut', 'Табло: 1 час 75 минут', "Display: 1 hour 75 minutes"), bi('60 minut = 1 soat', '60 минут = 1 час', "60 minutes = 1 hour"), bi('1 soat 75 minut = ?', '1 час 75 минут = ?', "1 hour 75 minutes = ?")],
    question: bi("Yozuvni qanday me'yorlashtirish mumkin?", 'Как можно нормализовать запись?', "How can the measurement be normalised?"),
    options: [bi('2 soat 15 minut', '2 часа 15 минут', "2 hours 15 minutes"), bi('1 soat 15 minut', '1 час 15 минут', "1 hour 15 minutes"), bi("O'zgartirish shart emas", 'Менять запись не нужно', "No change is needed")],
    neutral: bi('Taxmin saqlandi. Endi vaqt birliklari qanday guruhlanishini tekshiramiz.', 'Гипотеза сохранена. Теперь проверим, как группируются единицы времени.', "Your prediction has been saved. Now we will see how units of time are grouped."),
    audio: { intro: {
      uz: ["Lumo City jadvalida bir soat yetmish besh minut yozuvi paydo bo'ldi.", "Ammo oltmish minutning o'zi yana bir soat bo'ladi.", "Yozuvni qanday me'yorlashtirish kerakligini taxmin qiling."],
      ru: ['На табло Lumo City появилась запись: один час семьдесят пять минут.', 'Но уже шестьдесят минут образуют еще один час.', 'Предположи, как нужно нормализовать эту запись.'],
      en: ['The Lumo City display showed one hour and seventy-five minutes.', 'But sixty minutes already make another hour.', 'Predict how this measurement should be written in normal form.'],
    } },
  },
  s1: {
    eyebrow: bi("Bog'lanishlar xaritasi", 'Карта связей', "Relationship map"), title: bi("Har bir o'tishning o'z soni bor", 'У каждого перехода свое число', "Each conversion has its own number"), scene: 'map',
    frames: [bi('60 soniya = 1 minut', '60 секунд = 1 минута', "60 seconds = 1 minute"), bi('60 minut = 1 soat', '60 минут = 1 час', "60 minutes = 1 hour"), bi('24 soat = 1 sutka · 7 kun = 1 hafta', '24 ч = 1 сут. · 7 дней = 1 неделя', "24 hours = 1 day · 7 days = 1 week"), bi("12 oy = 1 yil · 100 yil = 1 asr", '12 месяцев = 1 год · 100 лет = 1 век', "12 months = 1 year · 100 years = 1 century")],
    audio: { uz: ["Oltmish soniya bir minutni hosil qiladi.", "Oltmish minut bir soatni hosil qiladi.", "Bir sutkada yigirma to'rt soat, bir haftada yetti kun bor.", "Bir yilda o'n ikki oy, bir asrda yuz yil bor. Barcha o'tishlarda o'n soni ishlamaydi."], ru: ['Шестьдесят секунд образуют одну минуту.', 'Шестьдесят минут образуют один час.', 'В одних сутках двадцать четыре часа, а в одной неделе семь дней.', 'В году двенадцать месяцев, в веке сто лет. Число десять подходит не для всех переходов.'], en: ["Sixty seconds make one minute.", "Sixty minutes make one hour.", "One day has twenty-four hours, and one week has seven days.", "One year has twelve months, and one century has one hundred years. Ten is not used in every conversion."] },
  },
  s2: {
    eyebrow: bi('Soniya va minut', 'Секунда и минута', "Seconds and minutes"), title: bi("Oltmishta soniya bir guruh bo'ladi", 'Шестьдесят секунд собираются в одну минуту', "Sixty seconds make one group"), scene: 'seconds',
    frames: [bi('00:00', '00:00', "00:00"), bi('30 soniya = yarim minut', '30 секунд = половина минуты', "30 seconds = half a minute"), bi('60 soniya = 1 minut', '60 секунд = 1 минута', "60 seconds = 1 minute"), bi('180 soniya = 3 minut', '180 секунд = 3 минуты', "180 seconds = 3 minutes")],
    audio: { uz: ["Sekundomer nol holatidan boshlaydi. Doiradagi har belgi bir soniyani bildiradi.", "O'ttizta belgi yonsa, minutning yarmi o'tadi.", "Oltmishinchi soniyada to'liq halqa bitta minutga yig'iladi.", "Bir yuz sakson soniyada uchta oltmishtalik guruh bor. Bu uch minut."], ru: ['Секундомер начинает с нуля. Каждая отметка на круге означает одну секунду.', 'Когда загораются тридцать отметок, проходит половина минуты.', 'На шестидесятой секунде полный круг собирается в одну минуту.', 'В ста восьмидесяти секундах три группы по шестьдесят. Это три минуты.'], en: ["The stopwatch starts at zero. Each mark around the circle represents one second.", "When thirty marks light up, half a minute has passed.", "At the sixtieth second, the complete circle forms one minute.", "One hundred and eighty seconds contain three groups of sixty. That is three minutes."] },
  },
  s3: {
    eyebrow: bi('Minut va soat', 'Минута и час', "Minutes and hours"), title: bi("Bir aylanish bir soat", 'Один круг равен одному часу', "One full turn equals one hour"), scene: 'clock',
    frames: [bi('0 minut', '0 минут', "0 minutes"), bi('15 → 30 → 45 minut', '15 → 30 → 45 минут', "15 → 30 → 45 minutes"), bi('60 minut = 1 soat', '60 минут = 1 час', "60 minutes = 1 hour"), bi('1 soat 35 minut = 95 minut', '1 час 35 минут = 95 минут', "1 hour 35 minutes = 95 minutes")],
    audio: { uz: ["Minut strelkasi o'n ikki raqamidan yo'lga chiqadi.", "Har chorak aylanishda yana o'n besh minut qo'shiladi.", "To'liq aylanishda oltmish minut bir soatga qayta guruhlanadi.", "Bir soatni oltmish minutga almashtirib, yana o'ttiz besh minutni qo'shamiz. To'qson besh minut chiqadi."], ru: ['Минутная стрелка начинает путь от числа двенадцать.', 'Каждая четверть круга добавляет еще пятнадцать минут.', 'После полного круга шестьдесят минут перегруппируются в один час.', 'Заменяем один час шестьюдесятью минутами и прибавляем еще тридцать пять. Получается девяносто пять минут.'], en: ["The minute hand starts at twelve.", "Each quarter turn adds another fifteen minutes.", "After one full turn, sixty minutes regroup into one hour.", "Replace one hour with sixty minutes and add thirty-five more minutes. This gives ninety-five minutes."] },
  },
  s4: {
    eyebrow: bi('Sutka va hafta', 'Сутки и неделя', "Days and weeks"), title: bi("Yigirma to'rt va yetti, ikki xil guruhlash", 'Двадцать четыре и семь, две разные группировки', "Twenty-four and seven: two different groupings"), scene: 'week',
    frames: [bi('00:00 → 12:00 → 24:00', '00:00 → 12:00 → 24:00', "00:00 → 12:00 → 24:00"), bi('24 soat = 1 sutka', '24 ч = 1 сут.', "24 hours = 1 day"), bi('7 kun = 1 hafta', '7 дней = 1 неделя', "7 days = 1 week"), bi('2 hafta 3 kun = 17 kun', '2 недели 3 дня = 17 дней', "2 weeks 3 days = 17 days")],
    audio: { uz: ["Soat tungi noldan yigirma to'rtgacha borib, bir sutkani tugatadi.", "Yigirma to'rt soat bitta sutkaga yig'iladi.", "Yettita ketma ket kun bir haftani hosil qiladi.", "Ikki haftada o'n to'rt kun bor. Yana uch kun bilan jami o'n yetti kun bo'ladi."], ru: ['Часы проходят от полуночи до двадцати четырех и завершают одни сутки.', 'Двадцать четыре часа собираются в одни сутки.', 'Семь последовательных дней образуют одну неделю.', 'В двух неделях четырнадцать дней. Еще три дня дают семнадцать дней.'], en: ["The clock goes from midnight to twenty-four to complete one day.", "Twenty-four hours form one day.", "Seven consecutive days make one week.", "Two weeks contain fourteen days. Three more days make seventeen days altogether."] },
  },
  s5: {
    eyebrow: bi('Oy, yil, asr', 'Месяц, год, век', "Months, years and centuries"), title: bi('Katta vaqt birliklari', 'Крупные единицы времени', "Larger units of time"), scene: 'year',
    frames: [bi("12 oy bir taqvimni to'ldiradi", '12 месяцев заполняют календарь', "Twelve months fill a calendar"), bi('12 oy = 1 yil', '12 месяцев = 1 год', "12 months = 1 year"), bi('100 yil = 1 asr; 300 yil = 3 asr', '100 лет = 1 век; 300 лет = 3 века', "100 years = 1 century; 300 years = 3 centuries"), bi("Oy → kun: doimiy faktor yo'q", 'Месяц → дни: постоянного множителя нет', "Months → days: no fixed factor")],
    audio: { uz: ["Yil taqvimida o'n ikkita oy ketma ket joylashadi.", "O'n ikkinchi oy tugagach, bitta yil hosil bo'ladi.", "Yuz yil bir asr. Uch yuz yil esa uchta asr bo'ladi.", "Oyni kunga aylantirishda bitta doimiy son yo'q. Oylarning davomiyligi turlicha."], ru: ['В календарном году последовательно расположены двенадцать месяцев.', 'После двенадцатого месяца завершается один год.', 'Сто лет составляют век. Триста лет составляют три века.', 'Для перевода месяцев в дни нет одного постоянного числа. Месяцы имеют разную длину.'], en: ["A calendar year has twelve months in sequence.", "When the twelfth month ends, one year is complete.", "One hundred years make one century. Three hundred years make three centuries.", "There is no single fixed number for converting months to days. Months have different lengths."] },
  },
  s6: {
    eyebrow: bi("Aylantirish yo'nalishi", 'Направление перевода', "Direction of conversion"), title: bi("Kichik birlikda son ko'proq bo'ladi", 'В мелких единицах число становится больше', "A smaller unit gives a larger number"), scene: 'direction',
    frames: [bi('3 soat → minut', '3 часа → минуты', "3 hours → minutes"), bi('3 × 60 = 180 minut', '3 × 60 = 180 минут', "3 × 60 = 180 minutes"), bi('240 minut → soat', '240 минут → часы', "240 minutes → hours"), bi('240 : 60 = 4 soat', '240 : 60 = 4 часа', "240 : 60 = 4 hours")],
    audio: { uz: ["Soatdan minutga o'tganda har bir soat o'rniga oltmishta minut yoziladi.", "Uchni oltmishga ko'paytirib, bir yuz sakson minut olamiz.", "Minutdan soatga qaytganda oltmishtalik guruhlar sonini topamiz. Buning uchun bo'lamiz.", "Ikki yuz qirq minutda to'rtta oltmishtalik guruh bor, demak bu to'rt soat. Davomiylik o'zgarmadi."], ru: ['При переходе от часов к минутам вместо каждого часа записывают шестьдесят минут.', 'Умножаем три на шестьдесят и получаем сто восемьдесят минут.', 'Возвращаясь от минут к часам, считаем группы по шестьдесят. Для этого делим.', 'В двухстах сорока минутах четыре группы по шестьдесят, значит, это четыре часа. Длительность не изменилась.'], en: ["When converting from hours to minutes, replace each hour with sixty minutes.", "Multiply three by sixty to get one hundred and eighty minutes.", "When converting back from minutes to hours, count the groups of sixty. To do this, divide.", "Two hundred and forty minutes contain four groups of sixty, so this is four hours. The duration has not changed."] },
  },
  s7: {
    eyebrow: bi('Vaqt minorasini sozlaymiz', 'Настраиваем башню времени', "Adjusting the time tower"), title: bi('Yetmish besh minutni qayta guruhlaymiz', 'Перегруппируем семьдесят пять минут', "Regroup seventy-five minutes"), scene: 'normalize',
    frames: [bi('1 soat 75 minut', '1 час 75 минут', "1 hour 75 minutes"), bi('75 minut = 60 minut + 15 minut', '75 минут = 60 минут + 15 минут', "75 minutes = 60 minutes + 15 minutes"), bi('60 minut = yana 1 soat', '60 минут = еще 1 час', "60 minutes = another hour"), bi('1 soat + 1 soat + 15 minut', '1 час + 1 час + 15 минут', "1 hour + 1 hour + 15 minutes"), bi('1 soat 75 minut = 2 soat 15 minut', '1 час 75 минут = 2 часа 15 минут', "1 hour 75 minutes = 2 hours 15 minutes")],
    audio: { uz: ["Boshlang'ich yozuvda bir soat va yetmish besh minut bor.", "Yetmish besh minutdan bitta to'liq oltmishtalik guruh va o'n besh minut ajratamiz.", "To'liq oltmishtalik guruhni yana bir soatga almashtiramiz.", "Endi ikkita soat va o'n besh minut ko'rinib turibdi.", "Miqdor o'zgarmadi, lekin yozuv me'yorlashdi. Ikki soat o'n besh minut."], ru: ['В исходной записи один час и семьдесят пять минут.', 'В семидесяти пяти минутах выделяем одну полную группу из шестидесяти и еще пятнадцать минут.', 'Полную группу из шестидесяти заменяем еще одним часом.', 'Теперь видны два часа и пятнадцать минут.', 'Длительность не изменилась, но запись стала нормальной. Два часа пятнадцать минут.'], en: ["The starting measurement is one hour and seventy-five minutes.", "Separate one complete group of sixty and fifteen more minutes from the seventy-five minutes.", "Replace the complete group of sixty with another hour.", "Now we can see two hours and fifteen minutes.", "The duration has not changed, but the measurement is now in normal form. Two hours and fifteen minutes."] },
  },
  s8: {
    eyebrow: bi('Mashq 1/6', 'Задание 1/6', "Exercise 1/6"), title: bi('Soniya necha minut?', 'Сколько минут в секундах?', "How many minutes?"), scene: 'seconds', closedSet: true,
    frames: [bi('180 soniya = ? minut', '180 секунд = ? минут', "180 seconds = ? minutes"), bi('60 soniyalik guruhlarni sanang', 'Посчитай группы по 60 секунд', "Count groups of 60 seconds")], question: bi('180 soniya necha minut?', 'Сколько минут в 180 секундах?', "How many minutes are in 180 seconds?"),
    options: [bi('3 minut', '3 минуты', "3 minutes"), bi('18 minut', '18 минут', "18 minutes"), bi('300 minut', '300 минут', "300 minutes")], correctIndex: 0, proof: bi('180 : 60 = 3 minut', '180 : 60 = 3 минуты', "180 : 60 = 3 minutes"),
    audio: { intro: { uz: ["Bir yuz sakson soniyani minutga aylantiring.", "Oltmishtalik to'liq guruhlarni sanang, ammo javobni hali ochmang."], ru: ['Переведи сто восемьдесят секунд в минуты.', 'Посчитай полные группы по шестьдесят, но пока не раскрывай ответ.'], en: ["Convert one hundred and eighty seconds to minutes.", "Count the complete groups of sixty, but do not reveal the answer yet."] }, on_correct: bi("To'g'ri. Bir yuz saksonni oltmishga bo'lsak, uch minut chiqadi.", 'Верно. Сто восемьдесят разделить на шестьдесят равно трем минутам.', "Correct. One hundred and eighty divided by sixty is three minutes."), on_wrong: [bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again."), bi("O'n sakkiz universal o'nlik taxmindan kelgan. Vaqtda bir minut oltmish soniyaga teng.", 'Восемнадцать получилось из универсального предположения про десятки. Во времени одна минута равна шестидесяти секундам.', "Eighteen comes from assuming every conversion uses tens. One minute equals sixty seconds."), bi("Kichik birlikdan kattasiga o'tyapsiz. Ko'paytirish emas, bo'lish kerak.", 'Ты переходишь от мелкой единицы к крупной. Нужно делить, а не умножать.', "You are converting from a smaller unit to a larger unit. Divide, do not multiply.")] },
    feedbackAudio: [bi("To'g'ri. Bir yuz sakson soniya uch minut.", 'Верно. Сто восемьдесят секунд равны трем минутам.', "Correct. One hundred and eighty seconds equal three minutes."), bi("O'n sakkiz universal o'nlik xatosi. Bir minut oltmish soniya.", 'Восемнадцать получилось из универсальной ошибки про десятки. Одна минута равна шестидесяти секундам.', "Eighteen comes from using the same factor of ten for every conversion. One minute equals sixty seconds."), bi("Kichik birlikdan kattasiga o'tishda oltmishga bo'ling.", 'При переходе к крупной единице раздели на шестьдесят.', "When converting to the larger unit, divide by sixty.")],
  },
  s9: {
    eyebrow: bi('Mashq 2/6', 'Задание 2/6', "Exercise 2/6"), title: bi('Soat va minutni birlashtiring', 'Объедини часы и минуты', "Combine hours and minutes"), scene: 'clock', closedSet: true,
    frames: [bi('2 soat 25 minut = ? minut', '2 часа 25 минут = ? минут', "2 hours 25 minutes = ? minutes"), bi('Har soatni minutga almashtiring', 'Замени каждый час минутами', "Replace each hour with minutes")], question: bi('2 soat 25 minut jami necha minut?', 'Сколько минут в 2 часах 25 минутах?', "How many minutes are there altogether in 2 hours 25 minutes?"),
    options: ['145', '225', '125'], correctIndex: 0, proof: bi('2 × 60 + 25 = 145 minut', '2 × 60 + 25 = 145 минут', "2 × 60 + 25 = 145 minutes"),
    audio: { intro: { uz: ["Ikki soat yigirma besh minutni faqat minutlarda yozing.", "Har bir soatni oltmish minutga almashtirib, qolgan minutlarni ham qo'shing."], ru: ['Запиши два часа двадцать пять минут только в минутах.', 'Замени каждый час шестьюдесятью минутами и прибавь оставшиеся минуты.'], en: ["Write two hours and twenty-five minutes using minutes only.", "Replace each hour with sixty minutes and add the remaining minutes."] }, on_correct: bi("To'g'ri. Bir yuz yigirma minutga yigirma beshni qo'shsak, bir yuz qirq besh minut bo'ladi.", 'Верно. Сто двадцать минут плюс двадцать пять дают сто сорок пять минут.', "Correct. One hundred and twenty minutes plus twenty-five minutes is one hundred and forty-five minutes."), on_wrong: [bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again."), bi("Sonlarni yonma yon qo'yish mumkin emas. Ikki soat ikki yuz minut emas.", 'Нельзя просто соединять числа. Два часа не равны двумстам минутам.', "You cannot simply put the numbers side by side. Two hours do not equal two hundred minutes."), bi("Siz faqat bitta soatni hisobga oldingiz. Ikki soat bir yuz yigirma minut.", 'Ты учел только один час. Два часа равны ста двадцати минутам.', "You counted only one hour. Two hours equal one hundred and twenty minutes.")] },
    feedbackAudio: [bi("To'g'ri. Jami bir yuz qirq besh minut.", 'Верно. Всего сто сорок пять минут.', "Correct. The total is one hundred and forty-five minutes."), bi("Sonlarni yonma yon qo'ymang. Ikki soat bir yuz yigirma minut.", 'Не соединяй числа. Два часа равны ста двадцати минутам.', "Do not put the numbers side by side. Two hours equal one hundred and twenty minutes."), bi("Bu javobda faqat bitta soat hisoblangan.", 'В этом ответе учтен только один час.', "This answer only counts one hour.")],
  },
  s10: {
    eyebrow: bi('Mashq 3/6', 'Задание 3/6', "Exercise 3/6"), title: bi("To'liq haftalar va qolgan kunlar", 'Полные недели и оставшиеся дни', "Full weeks and remaining days"), scene: 'week', closedSet: true,
    frames: [bi('17 kun = ? hafta ? kun', '17 дней = ? недель ? дней', "17 days = ? weeks ? days"), bi('Yettitalik guruhlarni ajrating', 'Выдели группы по семь', "Separate groups of seven")], question: bi("O'n yetti kunning me'yoriy yozuvi qaysi?", 'Какая запись семнадцати дней нормализована?', "Which is the normal form for seventeen days?"),
    options: [bi('2 hafta 3 kun', '2 недели 3 дня', "2 weeks 3 days"), bi('1 hafta 10 kun', '1 неделя 10 дней', "1 week 10 days"), bi('7 hafta 3 kun', '7 недель 3 дня', "7 weeks 3 days")], correctIndex: 0, proof: bi('17 = 7 + 7 + 3', '17 = 7 + 7 + 3', "17 = 7 + 7 + 3"),
    audio: { intro: { uz: ["O'n yetti kunni hafta va kunlarda me'yoriy yozing.", "Yettitalik to'liq guruhlarni ajratib, qolgan kunlar yettidan kamligini tekshiring."], ru: ['Запиши семнадцать дней в неделях и днях в нормальном виде.', 'Выдели полные группы по семь и проверь, что остаток меньше семи дней.'], en: ["Write seventeen days in normal form using weeks and days.", "Separate the complete groups of seven and check that the remaining number of days is less than seven."] }, on_correct: bi("To'g'ri. Ikkita to'liq hafta va yana uch kun, jami o'n yetti kun.", 'Верно. Две полные недели и еще три дня составляют семнадцать дней.', "Correct. Two complete weeks plus three days make seventeen days."), on_wrong: [bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again."), bi("Qiymat teng, ammo o'n kundan yana bir hafta ajratish mumkin.", 'Значение равно, но из десяти дней можно выделить еще одну неделю.', "The value is equal, but ten days still contain another complete week."), bi("Yetti hafta o'n yetti kundan ancha ko'p. Yetti kun bir hafta ekanini eslang.", 'Семь недель намного больше семнадцати дней. Вспомни, что семь дней составляют одну неделю.', "Seven weeks is much longer than seventeen days. Remember that seven days make one week.")] },
    feedbackAudio: [bi("To'g'ri. Ikki hafta va uch kun o'n yetti kun.", 'Верно. Две недели и три дня составляют семнадцать дней.', "Correct. Two weeks and three days make seventeen days."), bi("Qiymat teng, ammo o'n kundan yana bir hafta ajrating.", 'Значение равно, но из десяти дней выдели еще одну неделю.', "The value is equal, but separate another complete week from the ten days."), bi("Yetti hafta juda ko'p. Yetti kun bir hafta.", 'Семь недель слишком много. Семь дней составляют одну неделю.', "Seven weeks is far too long. Seven days make one week.")],
  },
  s11: {
    eyebrow: bi('Mashq 4/6', 'Задание 4/6', "Exercise 4/6"), title: bi('Yillarni asrga aylantiring', 'Переведи годы в века', "Convert years to centuries"), scene: 'year', closedSet: true,
    frames: [bi('300 yil = ? asr', '300 лет = ? веков', "300 years = ? centuries"), bi('Har asrda 100 yil bor', 'В каждом веке 100 лет', "Each century has 100 years")], question: bi('300 yilda nechta asr bor?', 'Сколько веков в 300 годах?', "How many centuries are in 300 years?"),
    options: [bi('3 asr', '3 века', "3 centuries"), bi('30 asr', '30 веков', "30 centuries"), bi('300 asr', '300 веков', "300 centuries")], correctIndex: 0, proof: bi('300 : 100 = 3 asr', '300 : 100 = 3 века', "300 : 100 = 3 centuries"),
    audio: { intro: { uz: ["Uch yuz yilda nechta to'liq asr borligini toping.", "Yuz yillik to'liq guruhlarni sanang."], ru: ['Найди, сколько полных веков содержится в трехстах годах.', 'Посчитай полные группы по сто лет.'], en: ["Find how many complete centuries are in three hundred years.", "Count the complete groups of one hundred years."] }, on_correct: bi("To'g'ri. Uch yuzni yuzga bo'lsak, uch asr chiqadi.", 'Верно. Триста разделить на сто равно трем векам.', "Correct. Three hundred divided by one hundred is three centuries."), on_wrong: [bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again."), bi("O'ttiz o'nlik guruhlar soni. Asr yuz yilga teng.", 'Тридцать показывает число десятков. Век равен ста годам.', "Thirty is the number of groups of ten. A century is one hundred years."), bi("Faqat birlik nomini almashtirib bo'lmaydi. Yuz yillik guruhlarni sanang.", 'Нельзя заменить только название единицы. Посчитай группы по сто лет.', "You cannot change only the unit name. Count the groups of one hundred years.")] },
    feedbackAudio: [bi("To'g'ri. Uch yuz yil uch asr.", 'Верно. Триста лет равны трем векам.', "Correct. Three hundred years equal three centuries."), bi("O'ttiz o'nlik guruhlar soni. Asr yuz yilga teng.", 'Тридцать показывает число десятков. Век равен ста годам.', "Thirty is the number of groups of ten. A century is one hundred years."), bi("Faqat birlik nomini almashtirmang. Yuz yillik guruhlarni sanang.", 'Не меняй только название единицы. Посчитай группы по сто лет.', "Do not change only the unit name. Count the groups of one hundred years.")],
  },
  s12: {
    eyebrow: bi('Mashq 5/6', 'Задание 5/6', "Exercise 5/6"), title: bi('Bitning xatosini toping', 'Найди ошибку Бита', "Find Bit's mistake"), scene: 'error-normalize', closedSet: true,
    frames: [bi('Bit: 1 soat 80 minut = 1 soat 8 minut', 'Бит: 1 час 80 минут = 1 час 8 минут', "Bit: 1 hour 80 minutes = 1 hour 8 minutes"), bi("80 minut ichida to'liq soat bormi?", 'Есть ли полный час внутри 80 минут?', "Is there a complete hour within 80 minutes?")], question: bi('Bitning aniq xatosi nimada?', 'В чем точная ошибка Бита?', "What exactly was Bit's mistake?"),
    options: [bi('Nolni olib tashlagan', 'Убрал ноль', "Removed the zero"), bi('80 minutni 60 + 20 qilib ajratmagan', 'Не разделил 80 минут на 60 + 20', "Did not split 80 minutes into 60 + 20"), bi('Soatni sekundga aylantirmagan', 'Не перевел часы в секунды', "Did not convert hours to seconds")], correctIndex: 1, proof: bi('1 soat 80 minut = 2 soat 20 minut', '1 час 80 минут = 2 часа 20 минут', "1 hour 80 minutes = 2 hours 20 minutes"),
    audio: { intro: { uz: ["Bit bir soat sakson minutni bir soat sakkiz minut deb yozdi. Xatoning sababini toping.", "Sakson minut ichidan to'liq oltmishtalik guruh ajralishini tekshiring."], ru: ['Бит записал один час восемьдесят минут как один час восемь минут. Найди причину ошибки.', 'Проверь, можно ли выделить из восьмидесяти минут полную группу по шестьдесят.'], en: ["Bit wrote one hour eighty minutes as one hour eight minutes. Find the reason for the mistake.", "Check whether a complete group of sixty can be separated from eighty minutes."] }, on_correct: bi("To'g'ri. Sakson minutni oltmish va yigirmaga ajratish kerak edi.", 'Верно. Нужно было разделить восемьдесят минут на шестьдесят и двадцать.', "Correct. Eighty minutes should have been split into sixty minutes and twenty minutes."), on_wrong: [bi("Nolni olib tashlash ko'rinadigan amal, ammo chuqur sabab sakson minutni qayta guruhlamaslik.", 'Удаление нуля заметно, но глубокая причина в том, что восемьдесят минут не перегруппированы.', "Removing the zero is the visible step, but the deeper mistake is failing to regroup eighty minutes."), bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again."), bi("Sekundga o'tish shart emas. Soat bilan minut munosabati yetarli.", 'Переходить к секундам не нужно. Достаточно связи часов и минут.', "You do not need to convert to seconds. The relationship between hours and minutes is enough.")] },
    feedbackAudio: [bi("Nolni olib tashlash yuzaki xato. Asosiy sabab minutlarni qayta guruhlamaslik.", 'Удаление нуля является поверхностной ошибкой. Главная причина в отсутствии перегруппировки минут.', "Removing the zero is the surface mistake. The main reason is failing to regroup the minutes."), bi("To'g'ri. Sakson minutni oltmish va yigirmaga ajratish kerak.", 'Верно. Восемьдесят минут нужно разделить на шестьдесят и двадцать.', "Correct. Eighty minutes must be split into sixty minutes and twenty minutes."), bi("Sekundga o'tish shart emas. Soat bilan minut munosabati yetarli.", 'Переходить к секундам не нужно. Достаточно связи часов и минут.', "You do not need to convert to seconds. The relationship between hours and minutes is enough.")],
  },
  s13: {
    eyebrow: bi('Mashq 6/6', 'Задание 6/6', "Exercise 6/6"), title: bi("Poyezd qancha vaqt yo'lda bo'ldi?", 'Сколько времени поезд был в пути?', "How long was the train travelling?"), scene: 'timeline', closedSet: true,
    frames: [bi("Jo'nash 14:45", 'Отправление 14:45', "Departure 14:45"), bi('14:45 → 15:00 → 16:00 → 16:10', '14:45 → 15:00 → 16:00 → 16:10', "14:45 → 15:00 → 16:00 → 16:10"), bi('Davomiylik = ?', 'Длительность = ?', "Duration = ?")], question: bi("Poyezd 14:45 da jo'nab, 16:10 da keldi. Yo'l qancha davom etdi?", 'Поезд отправился в 14:45 и прибыл в 16:10. Сколько длился путь?', "The train left at 14:45 and arrived at 16:10. How long was the journey?"),
    options: [bi('1 soat 25 minut', '1 час 25 минут', "1 hour 25 minutes"), bi('2 soat 25 minut', '2 часа 25 минут', "2 hours 25 minutes"), bi('1 soat 35 minut', '1 час 35 минут', "1 hour 35 minutes")], correctIndex: 0, proof: bi('15 min + 60 min + 10 min = 85 min = 1 soat 25 min', '15 мин + 60 мин + 10 мин = 85 мин = 1 час 25 мин', "15 min + 60 min + 10 min = 85 min = 1 hour 25 min"),
    audio: { intro: { uz: ["Poyezd soat o'n to'rt qirq beshda jo'nadi.", "Keyingi to'liq soatgacha, undan keyingi soatgacha va kelish vaqtigacha bo'lgan qismlarni ajrating.", "Ajratilgan davomiyliklarni qo'shib, javobni soat va minutda tanlang."], ru: ['Поезд отправился в четырнадцать сорок пять.', 'Выдели промежутки до следующего полного часа, затем до следующего часа и до времени прибытия.', 'Сложи выделенные промежутки и выбери ответ в часах и минутах.'], en: ["The train left at fourteen forty-five.", "Separate the intervals to the next full hour, then to the following hour, and finally to the arrival time.", "Add the intervals and choose the answer in hours and minutes."] }, on_correct: bi("To'g'ri. O'n besh minut, bir soat va yana o'n minut, jami bir soat yigirma besh minut.", 'Верно. Пятнадцать минут, один час и еще десять минут дают один час двадцать пять минут.', "Correct. Fifteen minutes, one hour and another ten minutes make one hour and twenty-five minutes altogether."), on_wrong: [bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again."), bi("Soat raqamlarini shunchaki ayirish boshlang'ich qirq besh minutni hisobga olmaydi.", 'Простое вычитание часов не учитывает начальные сорок пять минут.', "Simply subtracting the hour numbers ignores the first forty-five minutes."), bi("O'n beshga oltmish va o'nni qo'shsak, sakson besh minut chiqadi, to'qson besh emas.", 'Пятнадцать плюс шестьдесят плюс десять дают восемьдесят пять минут, а не девяносто пять.', "Fifteen plus sixty plus ten is eighty-five minutes, not ninety-five.")] },
    feedbackAudio: [bi("To'g'ri. Yo'l bir soat yigirma besh minut davom etdi.", 'Верно. Путь длился один час двадцать пять минут.', "Correct. The journey took one hour and twenty-five minutes."), bi("Soat raqamlarini ayirish boshlang'ich qirq besh minutni hisobga olmaydi.", 'Вычитание показаний часов не учитывает начальные сорок пять минут.', "Subtracting the hour numbers ignores the first forty-five minutes."), bi("Qismlar yig'indisi sakson besh minut, to'qson besh emas.", 'Сумма промежутков равна восьмидесяти пяти минутам, а не девяноста пяти.', "The intervals total eighty-five minutes, not ninety-five.")],
  },
  s14: {
    eyebrow: bi('Yakun', 'Итог', "Summary"), title: bi("Vaqt o'nlik narvon emas", 'Время не десятичная лестница', "Time is not a decimal ladder"), scene: 'final',
    frames: [bi('60 soniya = 1 minut · 60 minut = 1 soat', '60 секунд = 1 минута · 60 минут = 1 час', "60 seconds = 1 minute · 60 minutes = 1 hour"), bi('24 soat = 1 sutka · 7 kun = 1 hafta', '24 ч = 1 сут. · 7 дней = 1 неделя', "24 hours = 1 day · 7 days = 1 week"), bi('12 oy = 1 yil · 100 yil = 1 asr', '12 месяцев = 1 год · 100 лет = 1 век', "12 months = 1 year · 100 years = 1 century"), bi("Har juft birlikning o'z munosabati bor", 'У каждой пары единиц своя связь', "Each pair of units has its own relationship"), bi('1 soat 75 minut → 2 soat 15 minut · Keyingi: yuza birliklari', '1 час 75 минут → 2 часа 15 минут · Далее: единицы площади', "1 hour 75 minutes → 2 hours 15 minutes · Next: units of area")],
    audio: { uz: ["Soniya, minut va soat orasidagi o'tish soni oltmish.", "Sutka yigirma to'rt soat, hafta yetti kundan tuziladi.", "Yil o'n ikki oy, asr yuz yilni birlashtiradi.", "Har safar aynan kerakli birliklar munosabatini tanlang. Universal o'nlik qoida yo'q.", "Vaqt minorasi to'g'ri sozlandi. Bir soat yetmish besh minut ikki soat o'n besh minut deb me'yoriy yozildi. Keyingi darsda yuza birliklarini o'rganamiz."], ru: ['Между секундами, минутами и часами используется число шестьдесят.', 'Сутки состоят из двадцати четырех часов, а неделя из семи дней.', 'Год объединяет двенадцать месяцев, а век сто лет.', 'Каждый раз выбирай связь нужной пары единиц. Универсального правила про десятки нет.', 'Башня времени настроена. Один час семьдесят пять минут правильно записан как два часа пятнадцать минут. На следующем уроке изучим единицы площади.'], en: ["The conversion factor between seconds and minutes, and between minutes and hours, is sixty.", "A day has twenty-four hours, and a week has seven days.", "A year has twelve months, and a century has one hundred years.", "Each time, choose the relationship for the exact pair of units. There is no universal rule based on tens.", "The time tower is set correctly. One hour seventy-five minutes has been written in normal form as two hours fifteen minutes. In the next lesson, we will learn about units of area."] },
  },
};

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const LangContext = createContext('uz');
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? value.uz ?? '';
  }, [lang]);
};
function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => { if (typeof window === 'undefined') return undefined; const update = () => setMobile(window.innerWidth < breakpoint); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, [breakpoint]);
  return mobile;
}
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { if (typeof window === 'undefined' || !window.matchMedia) return undefined; const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); media.addEventListener?.('change', update); return () => media.removeEventListener?.('change', update); }, []);
  return reduced;
}
const buildTtsUrl = (base, text, gender) => base + '/api/tts?text=' + encodeURIComponent(String(text).slice(0, 1000)) + '&g=' + (gender === 'm' ? 'm' : 'f');
class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() { if (this.timer && typeof window !== 'undefined') window.clearTimeout(this.timer); this.timer = null; if (this.audio) { this.audio.pause(); this.audio.src = ''; } if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); this.previewUtterance = null; }
  load(queue) { this.stop(); this.queue = queue; this.index = 0; this.emit({ isPlaying: false, completed: false, currentSegment: null }); }
  start() { if (!this.queue.length) { this.emit({ completed: true }); return; } this.play(); }
  timed(item) { const ms = Math.max(1500, Math.min(6500, String(item.text).split(/\s+/).length * 330)); this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: true }); this.timer = window.setTimeout(() => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); }, ms); }
  play() {
    const item = this.queue[this.index];
    if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; }
    if (this.muted || !runtimeConfig.ttsApiBase) {
      if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(String(item.text)); utterance.lang = SPEECH_LOCALES[this.lang] ?? SPEECH_LOCALES.uz; utterance.rate = 0.94; utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false }); utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); }; utterance.onerror = () => this.timed(item); this.previewUtterance = utterance; this.timer = window.setTimeout(() => { try { window.speechSynthesis.speak(utterance); } catch { this.timed(item); } }, 50); return; } catch { /* deterministic timer fallback */ }
      }
      this.timed(item); return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item));
  }
  toggleMute() { this.muted = !this.muted; this.stop(); this.emit({ isPlaying: false, completed: this.muted, currentSegment: null, muted: this.muted, visualOnly: true }); }
  pushOneOff(text) { if (!text) return; this.stop(); this.queue = [{ id: 'feedback-' + Date.now(), text }]; this.index = 0; this.play(); }
}
let audioEngineInstance = null;
const getAudioEngine = () => { if (!audioEngineInstance) audioEngineInstance = new AudioEngine(); return audioEngineInstance; };
function useAudio(segments) {
  const lang = useLang();
  const stableKey = useMemo(() => JSON.stringify(segments), [segments]);
  const stableSegments = useMemo(() => JSON.parse(stableKey), [stableKey]);
  const [state, setState] = useState({ isPlaying: false, completed: false, currentSegment: null, muted: false, visualOnly: false });
  useEffect(() => { const engine = getAudioEngine(); engine.setLang(lang); engine.listener = (next) => setState((previous) => ({ ...previous, ...next })); engine.load(stableSegments); const timer = window.setTimeout(() => engine.start(), 120); return () => { window.clearTimeout(timer); engine.stop(); }; }, [lang, stableSegments]);
  return { ...state, replay: () => { const engine = getAudioEngine(); engine.load(stableSegments); engine.start(); }, toggleMute: () => getAudioEngine().toggleMute(), pushOneOff: (text) => getAudioEngine().pushOneOff(text) };
}
function useNarration(value, screen) {
  const lang = useLang(); const reduced = usePrefersReducedMotion();
  const segments = useMemo(() => { const source = value?.intro ?? value; const texts = source?.[lang] ?? source?.uz ?? []; return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: 's' + screen + '-beat-' + index, text })); }, [lang, screen, value]);
  const audio = useAudio(segments); const active = segments.findIndex((segment) => segment.id === audio.currentSegment); const finalFrame = Math.max(0, FRAME_COUNTS[screen] - 1); const feedbackPlaying = audio.currentSegment?.startsWith('feedback-') === true; const frame = reduced || feedbackPlaying || audio.completed ? finalFrame : active >= 0 ? active : 0;
  return { ...audio, frame, caption: active >= 0 ? segments[active].text : '' };
}
function useGuidedNarration(value, screen, step) { const lang = useLang(); const texts = useMemo(() => { const source = value?.intro ?? value; const localized = source?.[lang] ?? source?.uz ?? []; return (Array.isArray(localized) ? localized : [localized]).filter(Boolean); }, [lang, value]); const intro = useMemo(() => texts.length ? [{ id: 's' + screen + '-beat-0', text: texts[0] }] : [], [screen, texts]); const audio = useAudio(intro); const speakStep = useCallback((index) => { const text = texts[index]; if (text) audio.pushOneOff(text); }, [audio, texts]); return { ...audio, frame: step, caption: texts[step] ?? '', speakStep }; }
const isAudioReady = (audio) => !audio || audio.muted || audio.visualOnly || audio.completed;
const playSfx = (kind) => { const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl; if (!url || typeof window === 'undefined') return; try { new Audio(url).play().catch(() => {}); } catch { /* optional */ } };

const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};
const AudioIndicator = ({ audio }) => { const t = useT(); const muteLabel = t(audio.muted ? bi("Ovozni yoqish", 'Включить звук', 'Turn sound on') : bi("Ovozni o'chirish", 'Выключить звук', 'Turn sound off')); const replayLabel = t(bi('Qayta eshitish', 'Повторить', 'Replay')); return <div className="audio-indicator"><button type="button" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>{audio.muted ? '🔇' : '🔊'}</button><span className={audio.isPlaying ? 'audio-wave playing' : 'audio-wave'}><i/><i/><i/></span>{!audio.muted && <button type="button" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>↻</button>}</div>; };
const ScreenTypeLabel = ({ type }) => { const t = useT(); const labels = { hook: bi('Taxmin', 'Гипотеза', "Estimate"), exploration: bi('Tadqiqot', 'Исследование', "Explore"), rule: bi('Qoida', 'Правило', "Rule"), strategy: bi('Strategiya', 'Стратегия', 'Strategy'), error: bi('Xatoni tuzatish', 'Исправление ошибки', 'Error repair'), test: bi('Mashq', 'Задание', "Task"), case: bi('Vaziyat', 'Ситуация', "Situation"), summary: bi('Yakun', 'Итог', "Summary") }; return <span className="screen-type">{t(labels[type])}</span>; };
const Stage = ({ screen, audio, onPrev, onNext, canAdvance = true, canFinish = true, finish = false, children }) => { const t = useT(); const mobile = useIsMobile(); const meta = SCREEN_META[screen]; const c = CONTENT[`s${screen}`]; const pad = mobile ? 12 : 24; const ready = canAdvance && canFinish && isAudioReady(audio); const showCaption = Boolean(audio?.caption && (audio.muted || audio.visualOnly)); return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}><div className="stage-body">{children}</div><div className="caption-slot" aria-live="polite">{showCaption ? <div className="caption">{audio.caption}</div> : <span aria-hidden="true"/>}</div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t(bi('Orqaga', 'Назад', "Back"))}</button>}<button type="button" className="btn-white-accent" disabled={!ready} aria-disabled={!ready} onClick={onNext}>{finish ? t(bi('Darsni yakunlash', 'Завершить урок', "Finish lesson")) : t(bi('Davom etish', 'Продолжить', "Continue"))} →</button></footer></main>; };
const Heading = ({ c, state = 'present', showBit = false, hook = false }) => { const t = useT(); return <div className={'heading ' + (showBit && !hook ? '' : 'heading-solo')}><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{showBit && !hook && <BitSVG state={state}/>}</div>; };

const G4TitleReveal = ({ active, title, onComplete }) => {
  const t = useT();
  useEffect(() => { if (!active) return undefined; const timer = window.setTimeout(() => onComplete?.(), window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 80 : 3900); return () => window.clearTimeout(timer); }, [active, onComplete]);
  if (!active || typeof document === 'undefined') return null;
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${t(bi('Unvon olindi', 'Звание получено', 'Title earned'))}: ${t(title)}`}><div className="rank-boost-card g4-title-reveal-card"><div className="rank-boost-rays g4-title-reveal-rays" aria-hidden="true"/><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }}/>)}</div><div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div><h2>{t(title)}</h2></div></div>, document.body);
};
const G4TitleCard = ({ title, answers = [] }) => {
  const t = useT(); const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null); const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <aside className="g4-title-card-stage" data-g4-role="title-card" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t(bi('UNVON OLINDI', 'ЗВАНИЕ ПОЛУЧЕНО', 'TITLE EARNED'))}</span><h2>{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t(bi('birinchi urinishda', 'с первой попытки', 'on the first attempt'))}</span></div></aside>;
};
function TimeVisual({ scene, frame, solved = false }) {
  const t = useT();
  if (scene === 'seconds') return <div className="time-visual stopwatch"><div className="dial" style={{ '--fill': `${Math.min(100, (frame + 1) * 25)}%` }}><b>{frame >= 2 ? '60' : frame === 1 ? '30' : '0'}</b><small>{t(bi('soniya', 'секунд', "seconds"))}</small></div><div className="group-chips">{[0, 1, 2].map((n) => <span className={frame >= 3 ? 'active' : ''} key={n}>60</span>)}</div></div>;
  if (scene === 'clock') return <div className="time-visual clock-wrap"><div className="clock-face"><i className="hand hour"/><i className="hand minute" style={{ transform: `rotate(${frame * 90}deg)` }}/><b>12</b><span>3</span><em>6</em><small>9</small></div><div className="result-pill">{frame >= 3 ? t(bi('60 + 35 = 95 min', '60 + 35 = 95 мин', "60 + 35 = 95 min")) : '15 · 30 · 45 · 60'}</div></div>;
  if (scene === 'week') return <div className="time-visual week"><div className="day-ring"><b>24</b><small>{t(bi('soat', 'часа', "hours"))}</small></div><div className="week-strip">{t(bi(['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'], ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).map((d, i) => <i className={i <= frame + 2 ? 'active' : ''} key={d}>{d}</i>)}</div></div>;
  if (scene === 'year') return <div className="time-visual year"><div className="months">{Array.from({ length: 12 }, (_, i) => <i className={i < (frame + 1) * 3 ? 'active' : ''} key={i}>{i + 1}</i>)}</div><div className="century"><b>100</b><small>{t(bi('yil = 1 asr', 'лет = 1 век', "years = 1 century"))}</small></div></div>;
  if (scene === 'direction') { const values = t(bi(['3 h', '180 min', '240 min', '4 h'], ['3 ч', '180 мин', '240 мин', '4 ч'], ['3 h', '180 min', '240 min', '4 h'])); return <div className="time-visual convert"><div><b>{values[0]}</b><span>× 60 →</span><strong>{values[1]}</strong></div><div><b>{values[2]}</b><span>÷ 60 →</span><strong>{values[3]}</strong></div></div>; }
  if (scene === 'error-normalize') return <div className="time-visual tower"><div className="tower-top">◷</div><div className="tower-board text-board">{t(bi('1 soat 80 minut', '1 час 80 минут', "1 hour 80 minutes"))}</div><div className="minute-bar split-bar"><b>{solved ? '80 = 60 + 20' : '80 = 60 + ?'}</b></div><div className={solved ? 'error-result solved' : 'error-result'}>{solved ? t(bi('2 soat 20 minut', '2 часа 20 минут', "2 hours 20 minutes")) : t(bi("To'liq soatni ajrating", 'Выдели полный час', "Separate the complete hour"))}</div></div>;
  if (scene === 'normalize' || scene === 'tower' || scene === 'final') { const fixed = scene === 'final' || (scene === 'normalize' && frame >= 3); return <div className="time-visual tower"><div className="tower-top">◷</div><div className={fixed ? 'tower-board fixed' : 'tower-board'}>{fixed ? '2:15' : '1:75'}</div><div className="minute-bar"><i style={{ width: `${Math.min(80, 20 + frame * 15)}%` }}/><b>60</b><span>+15</span></div></div>; }
  if (scene === 'timeline') return <div className="time-visual timeline">{['14:45', '15:00', '16:00', '16:10'].map((v, i) => <div className={i <= frame + 1 ? 'active' : ''} key={v}><i/><b>{v}</b></div>)}</div>;
  return <div className="time-visual relation-map">{t(bi(['60 s', '1 min', '60 min', '1 h', '24 h', '1 sut.'], ['60 с', '1 мин', '60 мин', '1 ч', '24 ч', '1 сут.'], ['60 s', '1 min', '60 min', '1 h', '24 h', '1 day'])).map((v, i) => <span className={i <= frame + 2 ? 'active' : ''} key={v}>{v}</span>)}</div>;
}
const RevealFrames = ({ frames, frame }) => { const t = useT(); return <div className="reveal-grid">{frames.map((item, index) => <div className={index <= frame ? 'reveal-card show' : 'reveal-card'} key={index}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>; };
const GuidedFramePanel = ({ frames, step, onAdvance, audioReady }) => { const t = useT(); const complete = step >= frames.length - 1; return <div className="guided-panel" aria-live="polite"><div className="guided-progress" aria-label={`${step + 1} / ${frames.length}`}>{frames.map((_, index) => <i className={index <= step ? 'active' : ''} key={index}/>)}</div><div className="guided-frame"><b>{step + 1}</b><span>{t(frames[step])}</span></div><div className="guided-action">{complete ? <span className="guided-complete">✓ {t(bi('Bosqichlar tugadi', 'Шаги завершены', 'Steps complete'))}</span> : <button type="button" className="btn-white-accent step-button" disabled={!audioReady} onClick={onAdvance}>{t(bi('Keyingi qadam', 'Следующий шаг', 'Next step'))} →</button>}</div></div>; };
function HookScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const [wrongChoices, setWrongChoices] = useState(storedAnswer?.wrongChoices ?? []); const answerReady = isAudioReady(audio); const solved = picked === c.correctIndex; const choose = (index) => { if (!answerReady || solved || wrongChoices.includes(index)) return; const ok = index === c.correctIndex; const nextAttempts = attempts + 1; const nextWrongChoices = ok ? wrongChoices : [...wrongChoices, index]; setPicked(index); setAttempts(nextAttempts); setWrongChoices(nextWrongChoices); audio.pushOneOff(t(ok ? c.neutral : HOOK_RETRY)); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts, wrongChoices: nextWrongChoices }); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={solved}><div className="stack hook-stack" data-g4-screen="hook"><Heading c={c} state={solved ? 'nod' : picked !== null ? 'awkward' : 'think'} showBit hook/><h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2><section className="model-card hook-card" data-g4-role="hook-scene"><div className="hook-scene-visual" data-g4-role="visual-frame"><TimeVisual scene={c.scene} frame={audio.frame} screen={screen}/><RevealFrames frames={c.frames} frame={audio.frame}/><div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think"/></div></div></section><section className="question hook-question" data-g4-role="answer-card" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => <button type="button" data-g4-role="answer-card" className={'option ' + (solved && index === c.correctIndex ? 'right' : wrongChoices.includes(index) ? 'bad' : picked === index ? 'picked' : '')} disabled={!answerReady || solved || wrongChoices.includes(index)} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div><div className="feedback-slot hook-feedback-slot">{picked !== null && <div className={'feedback open ' + (solved ? 'correct' : 'wrong')} data-g4-role={solved ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={solved ? 'solution' : 'wrong'}><span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={solved ? 'nod' : 'awkward'}/></span><p data-g4-role={solved ? 'bit-answer-comment' : undefined}>{t(solved ? c.neutral : HOOK_RETRY)}{solved && <span><b className="proof-label">{t(SOLUTION_LABEL)}</b>{t(c.options[c.correctIndex])}</span>}</p></div>}</div></section></div></Stage>; }
function InfoScreen({ screen, onPrev, onNext }) { const c = CONTENT[`s${screen}`]; const [step, setStep] = useState(0); const audio = useGuidedNarration(c.audio, screen, step); const complete = step >= c.frames.length - 1; const audioReady = isAudioReady(audio); const advance = () => { if (complete || !audioReady) return; const nextStep = step + 1; setStep(nextStep); audio.speakStep(nextStep); }; const bitState = screen === 7 ? 'happy' : ['focus', 'point', 'idea'][(screen - 1) % 3]; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={complete}><div className="stack info-stack"><Heading c={c} state={bitState} showBit/><section className="model-card guided-card"><TimeVisual scene={c.scene} frame={step} screen={screen}/><GuidedFramePanel frames={c.frames} step={step} onAdvance={advance} audioReady={audioReady}/></section></div></Stage>; }
function QuestionScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const [wrongChoices, setWrongChoices] = useState(storedAnswer?.wrongChoices ?? []); const openChoice = SCREEN_META[screen].type === 'strategy'; const revealed = picked !== null; const correct = openChoice ? revealed : picked === c.correctIndex; const canAnswer = isAudioReady(audio); const baseBitState = screen === 12 ? 'awkward' : screen === 13 ? 'point' : 'focus'; const bitState = revealed ? (correct ? 'nod' : 'awkward') : baseBitState; const choose = (index) => { if (!canAnswer || correct || wrongChoices.includes(index)) return; const ok = openChoice || index === c.correctIndex; const nextAttempts = attempts + 1; const nextWrongChoices = ok ? wrongChoices : [...wrongChoices, index]; setPicked(index); setAttempts(nextAttempts); setWrongChoices(nextWrongChoices); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.feedbackAudio[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts, wrongChoices: nextWrongChoices }); }; const showProof = !openChoice && (correct || (!correct && wrongChoices.length >= 2)); return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={correct}><div className="stack question-stack"><Heading c={c} state={bitState} showBit/><section className="test-layout"><div className="test-model"><TimeVisual scene={c.scene} frame={audio.frame} screen={screen} solved={revealed}/><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => { const cls = openChoice && picked === index ? 'picked' : index === c.correctIndex && correct ? 'right' : wrongChoices.includes(index) ? 'bad' : ''; return <button type="button" data-g4-branch={openChoice ? undefined : 'choice'} data-g4-correct={openChoice ? undefined : index === c.correctIndex ? 'true' : 'false'} className={'option ' + cls} disabled={!canAnswer || correct || wrongChoices.includes(index)} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div><div className="feedback-slot question-feedback-slot">{revealed && <div className="feedback-stack"><div className={'feedback open ' + (correct ? 'correct' : 'wrong')} data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={correct ? 'solution' : 'wrong'}><span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? "nod" : "awkward"}/></span><p data-g4-role={correct ? 'bit-answer-comment' : undefined}>{correct && <b className="proof-label">{t(SOLUTION_LABEL)}</b>}{t(correct ? c.audio.on_correct : c.audio.on_wrong[picked])}</p></div>{showProof && <div className="proof"><b className="proof-label">{t(SOLUTION_LABEL)}</b><span>{t(c.proof)}</span></div>}</div>}</div></div></section></div></Stage>; }
const Screen0 = (props) => <HookScreen {...props}/>;
const Screen1 = (props) => <InfoScreen {...props}/>;
const Screen2 = (props) => <InfoScreen {...props}/>;
const Screen3 = (props) => <InfoScreen {...props}/>;
const Screen4 = (props) => <InfoScreen {...props}/>;
const Screen5 = (props) => <InfoScreen {...props}/>;
const Screen6 = (props) => <InfoScreen {...props}/>;
const Screen7 = (props) => <InfoScreen {...props}/>;
const Screen8 = (props) => <QuestionScreen {...props}/>;
const Screen9 = (props) => <QuestionScreen {...props}/>;
const Screen10 = (props) => <QuestionScreen {...props}/>;
const Screen11 = (props) => <QuestionScreen {...props}/>;
const Screen12 = (props) => <QuestionScreen {...props}/>;
const Screen13 = (props) => <QuestionScreen {...props}/>;
function Screen14({ screen, answers, onPrev, finishLesson, finalState, onFinalState }) {
  const t = useT(); const c = CONTENT.s14; const storedAnswer = finalState; const [step, setStep] = useState(storedAnswer.step); const [reflection, setReflection] = useState(storedAnswer.reflection); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const [revealRequested, setRevealRequested] = useState(false); const audio = useGuidedNarration(c.audio, screen, step); const complete = step >= c.frames.length - 1; const audioReady = isAudioReady(audio); const titleState = titleClaimed ? 'claimed' : 'unclaimed'; const claimed = titleClaimed;
  const completeReveal = useCallback(() => { setRevealRequested(false); setTitleClaimed(true); onFinalState((previous) => ({ ...previous, titleClaimed: true })); }, [onFinalState]);
  const advance = () => { if (complete || !audioReady) return; const nextStep = step + 1; setStep(nextStep); onFinalState((previous) => ({ ...previous, step: nextStep })); audio.speakStep(nextStep); };
  const chooseReflection = (index) => { setReflection(index); onFinalState((previous) => ({ ...previous, reflection: index })); };
  const claimTitle = () => { if (reflection === null) return; if (!complete || !audioReady || titleClaimed || revealRequested) return; setRevealRequested(true); };
  const finish = () => { if (reflection === null || !titleClaimed) return; finishLesson(); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finish} canAdvance={complete && reflection !== null} canFinish={titleState === 'claimed'} finish><div className="stack summary-stack"><Heading c={c} state={claimed ? 'happy' : 'idea'} showBit/>{!complete ? <section className="model-card summary-card guided-card"><TimeVisual scene={c.scene} frame={step} screen={screen}/><GuidedFramePanel frames={c.frames} step={step} onAdvance={advance} audioReady={audioReady}/></section> : <div className="summary-complete"><section className="reflection-card final-reflection" data-g4-role="reflection" aria-live="polite"><h2>{t(REFLECTION.question)}</h2><div className="reflection-options">{REFLECTION.options.map((option, index) => <button type="button" className={'option ' + (reflection === index ? 'picked' : '')} disabled={!audioReady || revealRequested} onClick={() => chooseReflection(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div></section><G4TitleReveal active={revealRequested} title={REWARD_TITLE} onComplete={completeReveal}/>{titleState !== 'claimed' ? <section className="title-claim-card"><span>★</span><h2>{t(REWARD_TITLE)}</h2><button type="button" className="btn-white-accent g4-title-claim" data-g4-role="title-claim" disabled={reflection === null || revealRequested || !audioReady} onClick={claimTitle}>{t(bi('Unvonni olish', 'Получить звание', 'Claim title'))}</button></section> : null}{titleState === 'claimed' && <G4TitleCard title={REWARD_TITLE} answers={answers}/>}</div>}</div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars28({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const preview = previewMode ?? (langProp === undefined || langProp === null); const [previewLang, setPreviewLang] = useState(normalizeLang(langProp)); const lang = preview ? normalizeLang(previewLang) : normalizeLang(langProp);
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [finalState, setFinalState] = useState({ step: 0, reflection: null, titleClaimed: false }); const [startedAt] = useState(() => Date.now());
  const finished = useRef(false);
  const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []);
  const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars28 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES + G4_ETALON_OVERRIDES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={LANGUAGE_SELECTOR_LABEL[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} finalState={finalState} onFinalState={setFinalState} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>;
}

const G4_TITLE_STYLES = `
.g4-title-reveal-overlay{
  position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;
  background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-overlay-life 3.9s ease both
}
.g4-title-reveal-card{
  position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;
  background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)
}
.g4-title-reveal-card::after{
  content:"";position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;
  background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%);pointer-events:none
}
.g4-title-reveal-rays{
  position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;
  background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);
  transform:translate(-50%,-50%);
  animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-spin 26s linear .8s 1 both
}
.g4-title-reveal-medal{
  position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;margin:0;border:6px solid rgba(255,255,255,.72);border-radius:50%;
  display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);
  box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);
  font-size:52px;transform:translate(-50%,-50%);animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both
}
.g4-title-reveal-card h2{
  position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0;
  font-family:'Source Serif 4',Georgia,serif;font-size:clamp(34px,5vw,58px);line-height:1.02;text-shadow:0 4px 24px rgba(0,0,0,.72);
  transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both
}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}
.g4-title-reveal-confetti i{
  position:absolute;top:-20px;left:calc(3% + var(--g4-title-i) * 5.35%);width:8px;height:14px;border-radius:2px;background:#FFE284;
  animation:g4-title-reveal-confetti-fall 2.4s linear var(--g4-title-delay) 2 both
}
.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
.g4-title-card-stage{
  position:relative;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;
  display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;
  background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);
  box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)
}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}
.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-medal{
  position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;
  display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);
  box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px
}
.g4-title-card-kicker{color:#A8EAF0;font:900 10px 'JetBrains Mono',monospace;letter-spacing:.13em}
.g4-title-card-stage h2{max-width:590px;margin:0;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif}
.g4-title-card-score{
  align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10)
}
.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}
.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-confetti-fall 2.4s linear 2 both}
.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}
.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
@keyframes g4-title-reveal-overlay-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}
@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}
@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}
@keyframes g4-title-reveal-rays-spin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes g4-title-reveal-confetti-fall{to{transform:translateY(470px) rotate(560deg)}}
@keyframes g4-title-card-confetti-fall{to{transform:translateY(230px) rotate(460deg)}}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@media(max-width:639.98px){
  .g4-title-reveal-card{min-height:100dvh;padding:24px 18px}
  .g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}
  .g4-title-reveal-card h2{top:calc(50% + 62px);font-size:29px}
  .g4-title-card-stage{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}
  .g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}
  .g4-title-card-bit{width:57px;height:71px}
  .g4-title-card-stage h2{font-size:14px}
}
@media(prefers-reduced-motion:reduce){
  .g4-title-reveal-overlay,.g4-title-reveal-overlay *,.g4-title-card-stage,.g4-title-card-stage *{animation:none!important;transition:none!important}
  .g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}
  .g4-title-reveal-rays{opacity:.28!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-medal{opacity:1!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-card h2{opacity:1!important;transform:translateX(-50%)!important}
  .g4-title-card-stage{transform:none!important}
}
`;

const G4_ETALON_OVERRIDES = `
/* Local Dars01 visual contract. Content, narration and scoring stay lesson-owned. */
html:has(.lesson-root),body:has(.lesson-root),.lesson-root,.lesson-root button,.lesson-root input,.lesson-root textarea,.lesson-root select{font-family:'Manrope',system-ui,sans-serif}
.lesson-root h1,.lesson-root [data-g4-role="hook-title"] h1{font-family:'Source Serif 4',Georgia,serif!important;font-size:clamp(26px,4.2vw,36px)!important;font-weight:650!important;line-height:1.08!important;letter-spacing:-.012em!important;text-align:left!important}
.lesson-root .question h2,.lesson-root .hook-question-prompt{font-family:'Manrope',system-ui,sans-serif!important;font-size:clamp(17px,2.5vw,21px)!important;font-weight:800!important;line-height:1.28!important;text-align:left!important}
.lesson-root .summary-stack h2,.lesson-root .final-reflection h2,.lesson-root .reflection-card h2,.lesson-root [data-g4-role="title-card"] h2{font-family:'Source Serif 4',Georgia,serif!important}
.lesson-root .screen-count,.lesson-root .formula,.lesson-root .formula-card,.lesson-root .equation,.lesson-root .proof,.lesson-root .proof-label,.lesson-root .result-chip,.lesson-root .model-label,.lesson-root .frac{font-family:'JetBrains Mono',monospace!important}
.lesson-root [data-g4-role="hook-topic"]{font-size:clamp(14px,1.8vw,16px)!important}.lesson-root .summary-stack h2{font-size:25px}.lesson-root .option{font-size:clamp(15px,2vw,18px)}
[data-g4-role="hook-title"]{display:block;width:100%;font-size:36px!important;justify-content:flex-start!important;text-align:left}
.hook-stack{height:100%;min-height:0;display:flex!important;flex-direction:column;align-items:stretch;gap:9px!important;overflow:hidden}
.hook-stack>.heading{height:auto!important;min-height:0!important;overflow:visible!important;align-items:flex-start!important;flex:0 0 auto}
.hook-question-prompt{flex:0 0 auto;margin:0;padding:0 2px;color:#173B52;font-size:21px!important}
.hook-stack>.question{flex:0 0 auto;height:auto!important;min-height:0}
.hook-stack .feedback[aria-hidden="true"]{display:none!important}
.stage-hook .hook-question>h2,.hook-stack>.question>h2{display:none}
[data-g4-role="hook-scene"]{position:relative;isolation:isolate;width:100%!important;height:206px!important;min-width:0;min-height:206px!important;flex:0 0 206px!important;display:block!important;grid-template-columns:1fr!important;overflow:hidden}
[data-g4-role~="visual-frame"]{position:relative;isolation:isolate;min-width:0;min-height:0;max-width:100%;overflow:hidden!important;contain:paint}
[data-g4-screen="hook"] [data-g4-role~="visual-frame"],.stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{width:min(760px,100%);min-height:206px;height:100%;margin-inline:auto;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
.stage-hook .hook-card{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
.hook-scene-visual{width:100%!important;max-width:100%!important;height:100%;min-height:130px;padding:14px 112px 14px 16px;box-sizing:border-box}
.hook-scene-visual>[data-g4-role~="visual-frame"]{height:100%;padding:0;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;contain:layout paint}
.hook-frame-bit{position:absolute;right:42px;bottom:-4px;z-index:4;width:88px;height:110px;overflow:hidden;pointer-events:none}
.hook-frame-bit>.g1-char,.hook-frame-bit>.bit,.hook-frame-bit>svg{width:100%;height:100%;display:block}
[data-g4-role~="visual-frame"] img,[data-g4-role~="visual-frame"] picture,[data-g4-role~="visual-frame"] video,[data-g4-role~="visual-frame"] canvas,[data-g4-role~="visual-frame"] svg{display:block;max-width:100%!important;max-height:100%!important;object-fit:contain;overflow:hidden!important}
.visual-shell,.attempt-model,.model-card,.test-model,.topic-visual,.conversion-visual,.time-visual,.area-visual,.length-visual,.mass-visual,.hook-model{min-width:0;min-height:0;max-width:100%;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;padding:8px 15px 8px 9px!important;border-radius:18px!important;display:grid!important;grid-template-columns:62px minmax(0,1fr)!important;align-items:center!important;gap:12px!important;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:62px!important;height:76px!important;display:block;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>.g1-char,.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>.bit,.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>svg{width:100%!important;height:100%!important}
.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:72px!important;border-radius:15px!important;grid-template-columns:51px minmax(0,1fr)!important;background:linear-gradient(135deg,#FFFFFF,#E7F3EC)!important;box-shadow:inset 5px 0 #227A53,0 13px 26px -23px rgba(34,122,83,.75)!important}
.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:51px!important;height:64px!important}
.lesson-root .feedback[data-g4-feedback="wrong"]{height:auto!important;min-height:88px!important;border-radius:18px!important;background:linear-gradient(135deg,#FFFFFF,#FFF5D9)!important;box-shadow:inset 5px 0 #A96F13,0 13px 26px -23px rgba(169,111,19,.72)!important}
.lesson-root .feedback[data-g4-role~="feedback-frame"] p{min-width:0;margin:0;font-family:'Manrope',system-ui,sans-serif!important;font-size:15px!important;line-height:1.42!important;text-align:left}
.rank-boost-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}
[data-g4-role="title-card"]{position:relative;isolation:isolate;max-width:100%;overflow:hidden}
[data-g4-role="title-claim"]{font-family:'Manrope',system-ui,sans-serif}
.lesson-frame .preview-language{display:none!important}
@media(max-width:639.98px){
  .lesson-root h1,.lesson-root [data-g4-role="hook-title"] h1{font-size:clamp(22px,6.2vw,28px)!important}
  .lesson-root [data-g4-role="hook-title"]{font-size:25px!important}
  .lesson-root .question h2,.lesson-root .hook-question-prompt{font-size:17px!important}
  [data-g4-role="hook-scene"]{height:164px!important;min-height:164px!important;flex:0 0 164px!important}
  [data-g4-screen="hook"] [data-g4-role~="visual-frame"],.stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  .hook-scene-visual{min-height:112px;padding:10px 78px 10px 11px}
  .hook-stack>.question .options,.stage-hook .hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  .hook-stack>.question .option,.stage-hook .hook-question .option{min-height:44px!important;grid-template-columns:1fr!important;justify-items:center!important;text-align:center!important}
  .hook-frame-bit{right:12px;bottom:-7px;width:68px;height:85px}
  .lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;grid-template-columns:54px minmax(0,1fr)!important;gap:9px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:54px!important;height:68px!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:68px!important;border-radius:15px!important;grid-template-columns:47px minmax(0,1fr)!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:47px!important;height:59px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important}
}
@media(prefers-reduced-motion:reduce){.rank-boost-overlay,.rank-boost-overlay * ,[data-g4-role="title-card"],[data-g4-role="title-card"] *{animation:none!important;transition:none!important}.rank-boost-overlay{opacity:1}.g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}}
`;

const STYLES = `${G4_TITLE_STYLES}
.lesson-frame .preview-language{display:none!important}.stage-hook [data-g4-role="answer-card"]{font-size:14px}
.stage-hook .hook-card{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
@media(max-width:639.98px){.stage-hook .hook-card{border-radius:18px}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;min-height:100dvh;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;background:rgba(245,245,240,.92);box-shadow:0 0 50px -34px rgba(${T.shadowBase},.45)}.stage-header{flex:0 0 auto;padding-top:14px;background:rgba(245,245,240,.96);backdrop-filter:blur(10px);z-index:5}.progress-track{height:7px;border-radius:999px;overflow:hidden;background:#DDE5E3}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.lime});transition:width .45s ease}.progress-bar{box-shadow:0 0 15px rgba(22,143,163,.34)}.stage-chrome{min-height:54px;display:flex;align-items:center;justify-content:space-between;gap:12px}.chrome-title,.chrome-actions{display:flex;align-items:center;gap:9px}.chrome-title{color:${T.navy};font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 5px rgba(255,91,53,.1)}.screen-type,.screen-count{padding:5px 9px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:900}.screen-count{color:${T.ink2};background:#FFF}.audio-indicator{height:38px;padding:3px 6px;border-radius:13px;display:flex;align-items:center;gap:4px;background:#FFF;box-shadow:0 9px 20px -17px rgba(${T.shadowBase},.6)}.audio-indicator button{width:31px;height:31px;border:0;border-radius:9px;background:transparent;cursor:pointer}.audio-wave{height:20px;display:flex;align-items:center;gap:2px}.audio-wave i{width:3px;height:6px;border-radius:4px;background:${T.cyan};transition:.25s}.audio-wave.playing i:nth-child(1){height:12px}.audio-wave.playing i:nth-child(2){height:18px}.audio-wave.playing i:nth-child(3){height:9px}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover{color:#fff;background:${T.accent}}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.stack{display:grid;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}
.model-card,.question,.test-model{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{display:grid;grid-template-columns:minmax(250px,.85fr) minmax(300px,1.15fr);align-items:center;gap:18px}.hook-card{background:linear-gradient(135deg,${T.cyanSoft},#FFF)}.summary-card{background:linear-gradient(135deg,#FFF,${T.successSoft})}.reveal-grid{display:grid;gap:8px}.reveal-card{min-height:48px;padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:9px;opacity:.12;transform:translateY(7px);background:#F8F8F4;transition:.38s ease}.reveal-card.show{opacity:1;transform:none}.reveal-card>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.reveal-card:last-child.show{background:${T.cyanSoft}}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.option{min-height:58px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46);transition:.25s}.option:hover{transform:translateY(-2px)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.neutral{background:${T.cyanSoft};box-shadow:inset 4px 0 ${T.cyan}}.proof{padding:11px 14px;border-radius:13px;color:#FFF;background:${T.navy};text-align:center;font:900 15px 'JetBrains Mono',monospace}.test-layout{display:grid;grid-template-columns:.85fr 1.15fr;gap:14px}.test-model{display:grid;align-content:center;gap:12px}.caption{position:relative;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.time-visual{min-height:210px;padding:14px;border-radius:20px;display:grid;place-items:center;gap:12px;background:linear-gradient(145deg,${T.cyanSoft},#FFF)}.dial{width:142px;height:142px;border-radius:50%;display:grid;place-items:center;align-content:center;background:conic-gradient(${T.cyan} var(--fill),#DDE7E6 0);box-shadow:inset 0 0 0 18px rgba(255,255,255,.88);transition:.5s}.dial b{font:900 30px 'JetBrains Mono',monospace}.dial small{font-size:11px;font-weight:800}.group-chips{display:flex;gap:7px}.group-chips span{padding:6px 10px;border-radius:10px;background:#FFF;color:${T.ink3};font:900 12px 'JetBrains Mono',monospace}.group-chips span.active{color:#FFF;background:${T.lime}}.clock-face{width:150px;height:150px;border-radius:50%;position:relative;background:#FFF;box-shadow:inset 0 0 0 5px ${T.navy},0 14px 24px -19px rgba(${T.shadowBase},.55)}.clock-face>b,.clock-face>span,.clock-face>em,.clock-face>small{position:absolute;font:900 12px 'JetBrains Mono',monospace}.clock-face>b{top:10px;left:66px}.clock-face>span{right:13px;top:67px}.clock-face>em{bottom:10px;left:71px}.clock-face>small{left:13px;top:67px}.hand{width:4px;height:53px;position:absolute;left:73px;top:22px;transform-origin:50% 100%;border-radius:4px;background:${T.accent};transition:.55s}.hand.hour{height:38px;top:37px;transform:rotate(35deg);background:${T.navy}}.result-pill{padding:8px 12px;border-radius:12px;color:#FFF;background:${T.navy};font:900 13px 'JetBrains Mono',monospace}.week{grid-template-columns:130px 1fr}.day-ring{width:112px;height:112px;border-radius:50%;display:grid;place-items:center;align-content:center;color:#FFF;background:${T.navy}}.day-ring b{font:900 29px 'JetBrains Mono',monospace}.week-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.week-strip i{min-width:43px;height:43px;border-radius:12px;display:grid;place-items:center;background:#FFF;color:${T.ink3};font-style:normal;font-weight:900}.week-strip i.active{color:#FFF;background:${T.cyan};transform:translateY(-2px)}.months{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}.months i{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:#FFF;color:${T.ink3};font-style:normal;font:800 10px 'JetBrains Mono',monospace}.months i.active{color:#FFF;background:${T.cyan}}.century{padding:8px 14px;border-radius:13px;background:${T.navy};color:#FFF}.century b{margin-right:6px;font:900 19px 'JetBrains Mono',monospace}.convert{align-content:center}.convert>div{width:min(420px,100%);padding:13px;border-radius:15px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;background:#FFF}.convert b,.convert strong{font:900 16px 'JetBrains Mono',monospace}.convert span{color:${T.accent};font-weight:900}.tower{align-content:center}.tower-top{font-size:30px;color:${T.accent}}.tower-board{min-width:190px;padding:12px;border-radius:14px;color:#FFF;background:${T.navy};text-align:center;font:900 40px 'JetBrains Mono',monospace;transition:.45s}.tower-board.fixed{background:${T.success}}.minute-bar{width:min(300px,90%);height:34px;position:relative;overflow:hidden;border-radius:12px;background:#FFF}.minute-bar i{height:100%;display:block;background:${T.cyan};transition:.5s}.minute-bar b,.minute-bar span{position:absolute;top:8px;font:900 11px 'JetBrains Mono',monospace}.minute-bar b{left:62%;color:#FFF}.minute-bar span{right:7px;color:${T.accent}}.timeline{grid-template-columns:repeat(4,1fr);align-content:center}.timeline>div{position:relative;display:grid;justify-items:center;gap:8px;color:${T.ink3}}.timeline>div::after{content:'';height:4px;position:absolute;left:50%;right:-50%;top:10px;background:#D4DEDD}.timeline>div:last-child::after{display:none}.timeline i{width:22px;height:22px;border-radius:50%;background:#D4DEDD;z-index:1}.timeline .active i{background:${T.accent};box-shadow:0 0 0 7px rgba(255,91,53,.12)}.timeline b{font:900 11px 'JetBrains Mono',monospace}.relation-map{grid-template-columns:repeat(3,1fr);align-content:center}.relation-map span{padding:13px;border-radius:14px;opacity:.22;background:#FFF;text-align:center;font:900 13px 'JetBrains Mono',monospace;transition:.4s}.relation-map span.active{opacity:1;color:#FFF;background:${T.cyan}}
.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{min-width:44px;min-height:44px;padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:${T.accent}}button:focus-visible,input:focus-visible{outline:3px solid rgba(22,143,163,.48);outline-offset:3px}
.tower-board.text-board{font-size:18px}.minute-bar.split-bar{min-height:42px;display:grid;place-items:center;background:${T.cyanSoft};box-shadow:inset 0 0 0 2px rgba(22,143,163,.18)}.minute-bar.split-bar b{position:static;color:${T.navy};font-size:15px}.error-result{padding:8px 12px;border-radius:12px;color:${T.ink2};background:#FFF;text-align:center;font-weight:900}.error-result.solved{color:#FFF;background:${T.success}}
@keyframes page-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.test-layout{grid-template-columns:1fr}.model-card,.question,.test-model{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.time-visual{min-height:170px}.week{grid-template-columns:1fr}.day-ring{width:86px;height:86px}.reveal-card{min-height:43px}.test-model .reveal-grid{display:none}}
.feedback-bit{width:25px;height:31px}.proof-label{margin-right:7px;color:${T.lime}}.title-claim-card{grid-column:1/-1;height:100%;display:grid;place-items:center;align-content:center;gap:12px;border-radius:20px;background:#fff;text-align:center;overflow:hidden}.title-claim-card>span{font-size:48px;color:#FFCE49}
.stage-hook .hook-card{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;background:rgba(245,245,240,.92);box-shadow:0 0 50px -34px rgba(${T.shadowBase},.45)}.stage-header{min-height:0;padding-top:9px;background:rgba(245,245,240,.96);backdrop-filter:blur(10px);z-index:5}.progress-track{height:7px;border-radius:999px;overflow:hidden;background:#DDE5E3}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.lime});transition:width .45s ease}.progress-bar{box-shadow:0 0 15px rgba(22,143,163,.34)}.stage-chrome{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px}.chrome-title,.chrome-actions{display:flex;align-items:center;gap:9px}.chrome-title{color:${T.navy};font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 5px rgba(255,91,53,.1)}.screen-type,.screen-count{padding:5px 9px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:900}.screen-count{color:${T.ink2};background:#FFF}.audio-indicator{height:46px;padding:3px 6px;border-radius:13px;display:flex;align-items:center;gap:4px;background:#FFF;box-shadow:0 9px 20px -17px rgba(${T.shadowBase},.6)}.audio-indicator button{width:44px;height:44px;border:0;border-radius:9px;background:transparent;cursor:pointer}.audio-wave{height:20px;display:flex;align-items:center;gap:2px}.audio-wave i{width:3px;height:6px;border-radius:4px;background:${T.cyan};transition:.25s}.audio-wave.playing i:nth-child(1){height:12px}.audio-wave.playing i:nth-child(2){height:18px}.audio-wave.playing i:nth-child(3){height:9px}
.stage-content{min-height:0;padding-top:7px;padding-bottom:4px;display:grid;grid-template-rows:minmax(0,1fr) 40px;overflow:hidden}.stage-body{min-height:0;overflow:hidden}.caption-slot{height:40px;min-height:40px;padding-top:4px;overflow:hidden}.caption{height:36px;margin:0;padding:7px 11px;border-radius:12px;overflow:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:11px;line-height:1.2;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}.stage-nav{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled,.btn-ghost:disabled,.option:disabled{cursor:not-allowed;opacity:.48;transform:none}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff}.stack{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;overflow:hidden;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.hook-stack{grid-template-rows:auto minmax(0,.82fr) minmax(0,1.18fr)}.heading{height:68px;min-height:0;display:flex;align-items:center;justify-content:space-between;gap:16px;overflow:hidden}.heading.heading-solo{justify-content:flex-start}.heading>div{min-width:0}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(24px,4vw,36px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:62px;height:76px;flex:0 0 auto;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.model-card,.question,.test-model{min-height:0;padding:14px;border-radius:20px;overflow:hidden;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{height:100%;display:grid;grid-template-columns:minmax(250px,.9fr) minmax(300px,1.1fr);align-items:stretch;gap:14px}.hook-card{background:linear-gradient(135deg,${T.cyanSoft},#FFF)}.summary-card{background:linear-gradient(135deg,#FFF,${T.successSoft})}.reveal-grid{min-height:0;display:grid;align-content:center;gap:7px;overflow:hidden}.reveal-card{min-height:44px;padding:7px 10px;border-radius:13px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;opacity:.12;transform:translateY(7px);overflow:hidden;background:#F8F8F4;transition:.38s ease}.reveal-card.show{opacity:1;transform:none}.reveal-card>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.reveal-card:last-child.show{background:${T.cyanSoft}}.question{height:100%;display:grid;grid-template-rows:auto auto minmax(92px,1fr);align-content:start;gap:9px}.question h2{font:720 clamp(16px,2.5vw,21px)/1.22 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.option{min-height:50px;padding:8px;border:0;border-radius:14px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:7px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;transition:.25s}.option:hover:not(:disabled){transform:translateY(-2px)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback-slot{min-height:0;overflow:hidden}.feedback-stack{height:100%;display:grid;align-content:start;gap:6px;overflow:hidden}.feedback{padding:8px 10px;border-radius:13px;display:grid;grid-template-columns:25px 1fr;align-items:start;gap:7px;font-size:12px;line-height:1.22}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.neutral{background:${T.cyanSoft};box-shadow:inset 4px 0 ${T.cyan}}.proof{padding:7px 10px;border-radius:11px;color:#FFF;background:${T.navy};overflow:hidden;text-align:center;font:900 12px/1.2 'JetBrains Mono',monospace}.test-layout{height:100%;min-height:0;display:grid;grid-template-columns:.86fr 1.14fr;gap:10px;overflow:hidden}.test-model{display:grid;grid-template-rows:minmax(0,1fr) auto;align-content:stretch;gap:8px}.question-feedback-slot{min-height:92px}.hook-feedback-slot{min-height:58px}.guided-panel{min-height:0;display:grid;grid-template-rows:10px minmax(72px,1fr) 50px;gap:10px;overflow:hidden}.guided-progress{display:flex;align-items:center;gap:6px}.guided-progress i{height:6px;flex:1;border-radius:999px;background:#DDE5E3}.guided-progress i.active{background:${T.cyan}}.guided-frame{min-height:72px;padding:12px;border-radius:16px;display:grid;grid-template-columns:34px 1fr;align-items:center;gap:10px;overflow:hidden;background:#F8F8F4;font-weight:850}.guided-frame>b{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 12px 'JetBrains Mono',monospace}.guided-action{display:flex;align-items:center;justify-content:flex-end;min-height:50px}.step-button{min-width:150px}.guided-complete{padding:10px 12px;border-radius:12px;color:${T.success};background:${T.successSoft};font-size:12px;font-weight:900}.summary-complete{height:100%;min-height:0;display:grid;grid-template-columns:.9fr 1.1fr;gap:10px;overflow:hidden}.summary-complete .g4-title-card-stage{height:100%;min-height:0}.reflection-card{min-height:0;padding:14px;border-radius:20px;display:grid;grid-template-rows:auto minmax(0,1fr);gap:9px;overflow:hidden;background:#FFF;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.reflection-card h2{font:720 18px/1.22 'Source Serif 4',Georgia,serif}.reflection-options{min-height:0;display:grid;grid-template-rows:repeat(3,minmax(44px,1fr));gap:7px;overflow:hidden}
.conversion-visual,.time-visual,.area-visual{min-height:210px;padding:14px;border-radius:20px;display:grid;place-items:center;gap:12px;background:linear-gradient(145deg,${T.cyanSoft},#FFF)}.relation-cards{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.relation-cards span{padding:12px 8px;border-radius:13px;opacity:.18;background:#FFF;text-align:center;font:900 12px 'JetBrains Mono',monospace;transition:.35s}.relation-cards span.active{opacity:1;color:#FFF;background:${T.cyan}}.console-screen{padding:13px 24px;border-radius:14px;color:#FFF;background:${T.navy};font:900 25px 'JetBrains Mono',monospace}.cross{position:absolute;color:${T.accent};font-size:84px;font-weight:900;opacity:0;transform:scale(.6) rotate(-15deg);transition:.4s}.cross.show{opacity:.85;transform:scale(1) rotate(-15deg)}.console{position:relative}.tape-line{width:260px;height:28px;padding:4px;border-radius:10px;background:#FFF}.tape-line i{height:100%;display:block;border-radius:7px;background:${T.cyan};transition:.5s}.tape strong{font:900 18px 'JetBrains Mono',monospace}.area-grid>div{width:150px;height:150px;padding:3px;display:grid;grid-template-columns:repeat(10,1fr);gap:2px;border:3px solid ${T.navy};border-radius:12px;background:#FFF}.area-grid i{border-radius:2px;background:#DDE7E6;transition:.35s}.area-grid i.active{background:${T.cyan}}.area-grid strong{font:900 14px 'JetBrains Mono',monospace}.algorithm{align-content:center}.algorithm span{width:min(380px,100%);padding:10px 14px;border-radius:12px;opacity:.16;background:#FFF;text-align:center;font:900 13px 'JetBrains Mono',monospace;transition:.35s}.algorithm span.active{opacity:1}.algorithm span:last-child.active{color:#FFF;background:${T.success}}.manifest{grid-template-columns:repeat(2,1fr)}.manifest span{padding:20px 12px;border-radius:15px;opacity:.2;background:#FFF;text-align:center;font-weight:900;transition:.35s}.manifest span.active{opacity:1;color:#FFF;background:${T.navy}}.direction>div{display:flex;align-items:center;gap:14px}.direction b{padding:15px;border-radius:13px;background:#FFF}.direction span{color:${T.accent};font-size:30px}.direction small{font-weight:900}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{min-width:44px;min-height:44px;padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:${T.accent}}button:focus-visible,input:focus-visible{outline:3px solid rgba(22,143,163,.48);outline-offset:3px}@keyframes page-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media(max-width:639.98px){.lesson-root-preview .stage-header{padding-top:52px}.screen-type{display:none}.stage{width:min(390px,100%)}.stage-header{padding-top:6px}.stage-chrome{min-height:46px}.chrome-title{max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px}.chrome-actions{gap:4px}.screen-count{padding:4px 6px;font-size:9px}.audio-indicator{height:46px;padding:1px 3px}.audio-indicator button{width:44px;height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 38px;padding-top:5px;padding-bottom:2px}.caption-slot{height:38px;min-height:38px;padding-top:3px}.caption{height:35px;padding:6px 9px;font-size:10px}.stage-nav{min-height:58px}.btn-white-accent,.btn-ghost{min-width:108px;min-height:48px;padding:0 10px;font-size:12px}.stack{gap:7px}.heading{height:56px;gap:8px}.heading h1{font-size:clamp(20px,6vw,24px)}.heading .g1-char{width:48px;height:60px}.model-card,.question,.test-model,.reflection-card{padding:8px;border-radius:15px}.model-card{grid-template-columns:minmax(126px,.86fr) minmax(156px,1.14fr);gap:7px}.hook-stack{grid-template-rows:auto minmax(0,.78fr) minmax(0,1.22fr)}.hook-question{grid-template-rows:auto auto minmax(52px,1fr)}.hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))}.hook-question .option{grid-template-columns:1fr;justify-items:center;align-content:center;text-align:center}.hook-question .option>b{display:none}.question h2{font-size:14px;line-height:1.16}.options{grid-template-columns:1fr;gap:5px}.option{min-height:44px;padding:5px 6px;border-radius:11px;grid-template-columns:24px 1fr;gap:5px;font-size:11px;line-height:1.15}.option>b{width:24px;height:24px}.feedback{padding:6px 7px;grid-template-columns:20px 1fr;gap:5px;font-size:10px}.proof{padding:5px 7px;font-size:9px}.test-layout{grid-template-columns:minmax(118px,.78fr) minmax(170px,1.22fr);gap:7px}.test-model{padding:6px}.test-model .reveal-grid{display:none}.question-feedback-slot{min-height:84px}.hook-feedback-slot{min-height:52px}.conversion-visual,.time-visual,.area-visual{height:100%;min-height:0;padding:6px;border-radius:13px;gap:6px}.guided-panel{grid-template-rows:8px minmax(58px,1fr) 46px;gap:7px}.guided-frame{min-height:58px;padding:8px;border-radius:13px;grid-template-columns:29px 1fr;gap:7px;font-size:11px}.guided-frame>b{width:29px;height:29px}.guided-action{min-height:46px}.step-button{min-width:124px}.guided-complete{padding:8px;font-size:10px}.summary-complete{grid-template-columns:1fr;grid-template-rows:88px minmax(0,1fr);gap:7px}.summary-complete .g4-title-card-stage{min-height:88px}.reflection-card h2{font-size:14px}.reflection-options{gap:5px}.preview-language{top:7px;left:50%;right:auto;transform:translateX(-50%)}}
@media(max-height:700px){.stage-header{padding-top:4px}.stage-chrome{min-height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 34px}.caption-slot{height:34px;min-height:34px}.caption{height:31px;padding:5px 8px}.stage-nav{min-height:56px}.heading{height:52px}.heading .g1-char{width:44px;height:55px}.stack{gap:6px}.model-card,.question,.test-model,.reflection-card{padding:7px}.question-feedback-slot{min-height:78px}.hook-feedback-slot{min-height:48px}.guided-panel{grid-template-rows:7px minmax(52px,1fr) 44px;gap:5px}.guided-action{min-height:44px}.step-button{min-height:44px}.summary-complete{grid-template-rows:82px minmax(0,1fr)}}
.summary-complete>.title-claim-card{grid-column:auto}.summary-complete>[data-g4-role="title-card"]{height:100%;min-height:0}
@media(max-width:639.98px){.summary-complete{grid-template-rows:minmax(0,1fr) 88px}.summary-complete>.title-claim-card,.summary-complete>[data-g4-role="title-card"]{height:88px;min-height:0}.title-claim-card{padding:6px 7px;grid-template-columns:30px minmax(0,1fr) auto;place-items:center;align-content:center;gap:6px;text-align:left}.title-claim-card>span{font-size:28px}.title-claim-card h2{font-size:13px;line-height:1.1}.title-claim-card .g4-title-claim{min-width:96px;min-height:44px;padding:0 7px}}
@media(max-height:700px){.summary-complete{grid-template-rows:minmax(0,1fr) 82px}}
@media(max-width:639.98px) and (max-height:700px){.summary-complete>.title-claim-card,.summary-complete>[data-g4-role="title-card"]{height:82px}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important}}
`;
