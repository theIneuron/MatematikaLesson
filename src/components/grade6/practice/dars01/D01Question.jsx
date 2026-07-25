import { Fragment, useCallback, useEffect, useState } from 'react';

const C = {
  ink: '#172033', sub: '#5b6474', line: '#dce3ec', paper: '#fff',
  pink: '#ec4899', blue: '#3b82f6', orange: '#f97316', green: '#22c55e',
  yellow: '#eab308', purple: '#8b5cf6', cyan: '#06b6d4', red: '#ef4444',
};

const COPY = {
  1: {
    uz: { eye: 'Oson · Sonlarni joylashtirish', title: 'Misolni to‘g‘ri tuzing', setup: 'Quyidagi bo‘lish misolida ikkita son tushirib qoldirilgan.', ask: '15 va 5 sonlarini bo‘sh kataklarga shunday joylashtiringki, tenglik to‘g‘ri bo‘lsin.', ok: 'To‘g‘ri! 15 : 5 = 3. Chunki 5 × 3 = 15.', no: 'Sonlarning o‘rnini tekshiring: qaysi sonni 5 ga bo‘lsak, 3 hosil bo‘ladi?' },
    ru: { eye: 'Легко · Расстановка чисел', title: 'Составьте верный пример', setup: 'В примере на деление пропущены два числа.', ask: 'Поставьте числа 15 и 5 в клетки так, чтобы равенство стало верным.', ok: 'Верно! 15 : 5 = 3, потому что 5 × 3 = 15.', no: 'Проверьте порядок чисел: какое число нужно разделить на 5, чтобы получить 3?' },
  },
  2: {
    uz: { eye: 'Oson · Teng bo‘laklarga bo‘lish', title: 'Lentani teng kesing', setup: 'Uzunligi 42 sm bo‘lgan lentani 6 ta teng bo‘lakka bo‘lish kerak.', ask: 'Har bir bo‘lak necha santimetrdan bo‘lishi kerak?', opts: ['5 sm', '8 sm', '7 sm', '10 sm'], ok: 'To‘g‘ri! 42 : 6 = 7. Har bir bo‘lak 7 sm uzunlikda bo‘ladi.', no: 'Lentaning umumiy uzunligini bo‘laklar soniga bo‘ling: 42 : 6.' },
    ru: { eye: 'Легко · Деление на равные части', title: 'Разрежьте ленту поровну', setup: 'Ленту длиной 42 см нужно разрезать на 6 равных частей.', ask: 'Какой длины должна быть каждая часть?', opts: ['5 см', '8 см', '7 см', '10 см'], ok: 'Верно! 42 : 6 = 7. Длина каждой части — 7 см.', no: 'Разделите общую длину ленты на число частей: 42 : 6.' },
  },
  3: {
    uz: { eye: 'Oson · O‘rniga qo‘yish', title: 'Yetishmayotgan bo‘luvchi', setup: '32 ta kitob bir nechta tokchaga teng joylashtirildi. Har tokchaga 8 tadan kitob qo‘yildi.', ask: 'Bo‘sh katakka mos kartani qo‘ying: 32 : □ = 8', ok: 'Ajoyib! 32 : 4 = 8. Demak, 4 soni 32 ning bo‘luvchisi.', no: 'Nechta tokcha kerakligini toping: 8 × □ = 32.' },
    ru: { eye: 'Легко · Подстановка', title: 'Пропущенный делитель', setup: '32 книги поровну расставили по полкам. На каждой полке оказалось по 8 книг.', ask: 'Поставьте подходящую карточку в пустую клетку: 32 : □ = 8', ok: 'Отлично! 32 : 4 = 8. Значит, 4 — делитель 32.', no: 'Найдите число полок: 8 × □ = 32.' },
  },
  4: {
    uz: { eye: 'Oson · Teng guruhlash', title: 'Chiroqlarni qatorlarga joylang', setup: '63 ta chiroq 7 ta teng qatorga joylashtiriladi.', ask: 'Har bir qatorda nechta chiroq bo‘ladi?', ok: 'To‘g‘ri! 63 : 7 = 9. Har bir qatorda 9 tadan chiroq bo‘ladi.', no: 'Chiroqlar sonini qatorlar soniga bo‘ling: 63 : 7.' },
    ru: { eye: 'Легко · Равные группы', title: 'Разместите лампы по рядам', setup: '63 лампы размещают в 7 одинаковых рядов.', ask: 'Сколько ламп будет в каждом ряду?', ok: 'Верно! 63 : 7 = 9. В каждом ряду будет по 9 ламп.', no: 'Разделите число ламп на число рядов: 63 : 7.' },
  },
  5: {
    uz: { eye: 'O‘rta · Moslashtirish', title: 'Son va bo‘luvchini bog‘lang', setup: '28 va 45 sonlarining har biriga mos bo‘luvchini toping.', ask: 'Avval chapdagi sonni, keyin o‘ng tomondagi mos bo‘luvchini bosing.', ok: 'To‘g‘ri mosliklar: 28 ↔ 7 va 45 ↔ 9.', no: 'Tekshirib ko‘ring: katta son tanlangan songa qoldiqsiz bo‘linishi kerak.' },
    ru: { eye: 'Средне · Соответствие', title: 'Соедините число и делитель', setup: 'Найдите подходящий делитель для каждого из чисел 28 и 45.', ask: 'Сначала нажмите число слева, затем подходящий делитель справа.', ok: 'Верные пары: 28 ↔ 7 и 45 ↔ 9.', no: 'Проверьте: большее число должно делиться на выбранное без остатка.' },
  },
  6: {
    uz: { eye: 'O‘rta · Saralash', title: '12 ning bo‘luvchisi yoki karralisi?', setup: '3, 4, 24 va 60 sonlarini ikki guruhga ajrating.', ask: 'Har bir son uchun “12 ning bo‘luvchisi” yoki “12 ga karrali” guruhini tanlang.', opts: ['12 ning bo‘luvchisi', '12 ga karrali'], ok: 'To‘g‘ri: 3 va 4 — 12 ning bo‘luvchilari; 24 va 60 — 12 ga karrali.', no: 'Bo‘luvchi 12 ni qoldiqsiz bo‘ladi; karrali son esa 12 × n ko‘rinishida yoziladi.' },
    ru: { eye: 'Средне · Сортировка', title: 'Делитель или кратное числа 12?', setup: 'Разделите числа 3, 4, 24 и 60 на две группы.', ask: 'Для каждого числа выберите: «делитель 12» или «кратное 12».', opts: ['Делитель 12', 'Кратное 12'], ok: 'Верно: 3 и 4 — делители 12; 24 и 60 — числа, кратные 12.', no: 'Делитель делит 12 без остатка, а кратное записывается в виде 12 × n.' },
  },
  7: {
    uz: { eye: 'O‘rta · Juftlik konstruktori', title: '48 ning ko‘paytuvchi juftlari', setup: '48 sonini ikki ko‘paytuvchining ko‘paytmasi ko‘rinishida yozamiz.', ask: 'Ko‘paytmasi 48 ga teng bo‘lgan uchta juftni tanlang.', ok: 'To‘g‘ri: 1 × 48, 2 × 24 va 3 × 16 ning har biri 48 ga teng.', no: 'Har bir tanlangan juftdagi sonlarni ko‘paytiring. Natija 48 bo‘lishi kerak.' },
    ru: { eye: 'Средне · Конструктор пар', title: 'Пары множителей числа 48', setup: 'Представим число 48 как произведение двух множителей.', ask: 'Выберите три пары, произведение которых равно 48.', ok: 'Верно: 1 × 48, 2 × 24 и 3 × 16 равны 48.', no: 'Перемножьте числа в каждой выбранной паре. Результат должен быть равен 48.' },
  },
  8: {
    uz: { eye: 'Qiyin · Xatoni topish', title: '54 ning bo‘luvchilarini tekshiring', setup: 'Ikki o‘quvchi 54 sonining bo‘luvchilari ro‘yxatini tuzdi.', ask: 'Qaysi ro‘yxatda 54 ning bo‘luvchisi bo‘lmagan son bor?', opts: ['1, 2, 3, 6, 9, 18, 27, 54', '1, 2, 3, 6, 8, 9, 18, 27, 54'], ok: 'Topdingiz! 8 soni 54 ning bo‘luvchisi emas, chunki 54 : 8 qoldiqli.', no: 'Ro‘yxatdagi har bir son bilan 54 ni qoldiqsiz bo‘lish mumkinligini tekshiring.' },
    ru: { eye: 'Сложно · Найдите ошибку', title: 'Проверьте делители числа 54', setup: 'Два ученика составили списки делителей числа 54.', ask: 'В каком списке есть число, не являющееся делителем 54?', opts: ['1, 2, 3, 6, 9, 18, 27, 54', '1, 2, 3, 6, 8, 9, 18, 27, 54'], ok: 'Нашли! 8 не является делителем 54, потому что 54 : 8 выполняется с остатком.', no: 'Проверьте, делится ли 54 без остатка на каждое число из списка.' },
  },
  9: {
    uz: { eye: 'Qiyin · Mantiq', title: 'Shartlarga mos sonni toping', setup: 'Yashirin son 4 ga ham, 9 ga ham qoldiqsiz bo‘linadi.', ask: 'Yashirin son 60 dan katta va 100 dan kichik. U qaysi son?', opts: ['63', '72', '81', '96'], ok: 'To‘g‘ri! 72 : 4 = 18 va 72 : 9 = 8. Shuningdek, 60 < 72 < 100.', no: 'Har bir variantni 4 ga va 9 ga bo‘lib ko‘ring. Ikkala natija ham butun son bo‘lishi kerak.' },
    ru: { eye: 'Сложно · Логика', title: 'Найдите число по условиям', setup: 'Скрытое число делится без остатка и на 4, и на 9.', ask: 'Оно больше 60 и меньше 100. Какое это число?', opts: ['63', '72', '81', '96'], ok: 'Верно! 72 : 4 = 18 и 72 : 9 = 8, причём 60 < 72 < 100.', no: 'Разделите каждый вариант на 4 и на 9. Оба результата должны быть целыми.' },
  },
  10: {
    uz: { eye: 'Qiyin · Yakuniy masala', title: 'Shartlarga mos eng katta son', setup: 'Son 10 ga ham, 12 ga ham qoldiqsiz bo‘linishi va 150 dan kichik bo‘lishi kerak.', ask: 'Berilgan variantlardan shartlarga mos eng katta sonni toping.', opts: ['100', '110', '120', '140'], ok: 'To‘g‘ri! 120 : 10 = 12 va 120 : 12 = 10. 150 dan kichik variantlar ichida eng kattasi — 120.', no: 'Har bir variantni 10 ga va 12 ga bo‘lib tekshiring. Ikkala bo‘linma ham butun son bo‘lishi kerak.' },
    ru: { eye: 'Сложно · Итоговая задача', title: 'Наибольшее число по условиям', setup: 'Число должно делиться без остатка и на 10, и на 12, а также быть меньше 150.', ask: 'Найдите среди вариантов наибольшее число, подходящее под условия.', opts: ['100', '110', '120', '140'], ok: 'Верно! 120 : 10 = 12 и 120 : 12 = 10. Среди вариантов меньше 150 наибольшее — 120.', no: 'Разделите каждый вариант на 10 и на 12. Оба частных должны быть целыми.' },
  },
};

const COLOR_BY_ID = ['#06b6d4', '#14b8a6', '#f59e0b', '#14b8a6', '#06b6d4', '#f59e0b', '#06b6d4', '#14b8a6', '#14b8a6', '#f59e0b'];
const VARIANT_CORRECT = { 2: 2, 8: 1, 9: 1, 10: 2 };

function shuffledIndexes(length) {
  const indexes = Array.from({ length }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

const HOW_TO = {
  1: { uz: 'Avval pastdagi sonli kartani bosing, keyin u joylashishi kerak bo‘lgan bo‘sh katakni bosing.', ru: 'Сначала нажмите карточку с числом, затем нажмите пустую клетку, куда нужно поставить число.' },
  2: { uz: '42 santimetrni 6 ta teng bo‘lakka ajrating. Bitta bo‘lak uzunligini topib, mos kesmani tanlang.', ru: 'Разделите 42 сантиметра на 6 равных частей и выберите отрезок подходящей длины.' },
  3: { uz: '8 ni nechaga ko‘paytirsak 32 chiqishini toping va pastdagi mos kartani tanlang.', ru: 'Найдите, на что умножить 8, чтобы получить 32, и выберите подходящую карточку.' },
  4: { uz: '63 ta chiroqni 7 ta teng qatorga ajrating va bitta qatordagi chiroqlar sonini tanlang.', ru: 'Разделите 63 лампы на 7 равных рядов и выберите число ламп в одном ряду.' },
  5: { uz: 'Avval chapdagi sonni bosing, keyin o‘ng tomondan uning mos bo‘luvchisini tanlang.', ru: 'Сначала нажмите число слева, затем выберите справа подходящий делитель.' },
  6: { uz: '3, 4, 24 va 60 sonlarining har biri uchun mos guruhni belgilang.', ru: 'Для каждого из чисел 3, 4, 24 и 60 выберите подходящую группу.' },
  7: { uz: 'Faqat ko‘paytmasi 48 bo‘lgan uchta juftni tanlang.', ru: 'Выберите ровно три пары, произведение которых равно 48.' },
  8: { uz: 'Ikki ro‘yxatni solishtiring. 54 ni qoldiqsiz bo‘lmaydigan son qatnashgan ro‘yxat xato.', ru: 'Сравните списки. Ошибочен список с числом, на которое 54 не делится без остатка.' },
  9: { uz: 'Avval 4 va 9 ga bir vaqtda bo‘linadigan sonni toping, keyin oraliq shartini tekshiring.', ru: 'Сначала найдите число, делящееся и на 4, и на 9, затем проверьте границы.' },
  10: { uz: 'Har bir variantni 10 ga va 12 ga bo‘ling. Ikkala natija ham butun bo‘lgan eng katta sonni tanlang.', ru: 'Разделите каждый вариант на 10 и на 12. Выберите наибольшее число с двумя целыми частными.' },
};

function Dots({ count, x = 35, y = 55, cols = 8, color }) {
  return Array.from({ length: count }).map((_, i) => (
    <circle key={i} cx={x + (i % cols) * 23} cy={y + Math.floor(i / cols) * 23} r="7" fill={color} stroke="#fff" strokeWidth="2"/>
  ));
}

function TaskVisual({ id, accent, lang, revealCorrect = false }) {
  const label = lang === 'ru';
  return (
    <div className="g6p-scene">
      <svg viewBox="0 0 620 205" role="img" aria-label={label ? 'Схема к заданию' : 'Topshiriq sxemasi'}>
        <defs><filter id={`s${id}`}><feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity=".14"/></filter></defs>
        <rect width="620" height="205" rx="20" fill={`${accent}12`}/>
        {id === 1 && <>
          <g transform="translate(18 18)"><rect width="275" height="169" rx="17" fill="#fff" filter="url(#s1)"/><text x="18" y="28" fontSize="18" fontWeight="800" fill="#334155">24 ÷ 6</text><Dots count={24} x={28} y={55} cols={8} color="#22d3ee"/><text x="205" y="147" fontSize="18" fontWeight="800" fill="#0f766e">{label ? 'без остатка' : 'qoldiqsiz'} ✓</text></g>
          <g transform="translate(327 18)"><rect width="275" height="169" rx="17" fill="#fff" filter="url(#s1)"/><text x="18" y="28" fontSize="18" fontWeight="800" fill="#334155">26 ÷ 6</text><Dots count={26} x={28} y={55} cols={8} color="#fbbf24"/><text x="194" y="147" fontSize="18" fontWeight="800" fill="#0f766e">{label ? 'остаток 2' : 'qoldiq 2'}</text></g>
        </>}
        {id === 2 && <>
          <rect x="52" y="72" width="516" height="58" rx="10" fill="#f59e0b" stroke="#d97706" strokeWidth="3"/>
          <path d="M62 86h496" stroke="#fde68a" strokeWidth="8" strokeLinecap="round" opacity=".8"/>
          <path d="M52 48v-13M568 48v-13M52 41h516" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round"/>
          <path d="m52 41 13-7v14zM568 41l-13-7v14z" fill="#14b8a6"/>
          <rect x="246" y="19" width="128" height="43" rx="13" fill="#fff" stroke="#06b6d4" strokeWidth="3"/>
          <text x="310" y="48" textAnchor="middle" fontSize="23" fontWeight="900" fill="#334155">42 {label ? 'см' : 'sm'}</text>
          <path d="M310 134v28" stroke="#64748b" strokeWidth="3" strokeDasharray="6 5"/>
          <text x="310" y="184" textAnchor="middle" fontSize="17" fontWeight="800" fill="#475569">{label ? '6 равных частей' : '6 ta teng bo‘lak'}</text>
          {revealCorrect && <>
            {Array.from({ length: 5 }).map((_, i) => {
              const x = 52 + ((i + 1) * 516) / 6;
              return <path key={i} className="g6p-ribbon-cut" d={`M${x} 70V132`} style={{ animationDelay: `${i * 0.16}s` }}/>;
            })}
            {Array.from({ length: 6 }).map((_, i) => {
              const x = 52 + (i + 0.5) * (516 / 6);
              return <text key={i} className="g6p-ribbon-label" x={x} y="108" textAnchor="middle"
                style={{ animationDelay: `${0.82 + i * 0.08}s` }}>7 {label ? 'см' : 'sm'}</text>;
            })}
          </>}
        </>}
        {id === 4 && <>
          {Array.from({length:7}).map((_,row)=><g key={row} transform={`translate(52 ${35+row*23})`}><rect width="516" height="18" rx="9" fill="#fff" stroke="#14b8a6" strokeWidth="2"/>{Array.from({length:9}).map((__,i)=><circle key={i} cx={35+i*56} cy="9" r="6" fill={i%3===0?'#f59e0b':i%3===1?'#06b6d4':'#14b8a6'}/>)}</g>)}<text x="310" y="24" textAnchor="middle" fontSize="19" fontWeight="900" fill="#334155">63 : 7 = ?</text>
        </>}
        {id === 5 && <>
          {[28,45].map((n,i)=><g key={n}><rect x="42" y={42+i*82} width="92" height="52" rx="13" fill="#fff" stroke={i===0?'#06b6d4':'#14b8a6'} strokeWidth="3"/><text x="88" y={76+i*82} textAnchor="middle" fontSize="25" fontWeight="900" fill="#334155">{n}</text></g>)}
          {[4,5,7,9].map((n,i)=><g key={n}><rect x={245+(i%2)*120} y={42+Math.floor(i/2)*82} width="92" height="52" rx="13" fill="#fff" stroke={i%3===0?'#06b6d4':i%3===1?'#14b8a6':'#f59e0b'} strokeWidth="3"/><text x={291+(i%2)*120} y={76+Math.floor(i/2)*82} textAnchor="middle" fontSize="25" fontWeight="900" fill="#334155">{n}</text></g>)}
          <text x="190" y="108" textAnchor="middle" fontSize="32" fontWeight="900" fill="#f59e0b">?</text>
        </>}
        {id === 6 && <>
          <rect x="24" y="24" width="270" height="157" rx="17" fill="#fff" stroke="#06b6d4" strokeWidth="3"/><rect x="326" y="24" width="270" height="157" rx="17" fill="#fff" stroke="#14b8a6" strokeWidth="3"/><text x="159" y="55" textAnchor="middle" fontSize="18" fontWeight="900" fill="#0f766e">{label ? 'Делители 12' : '12 ning bo‘luvchilari'}</text><text x="461" y="55" textAnchor="middle" fontSize="18" fontWeight="900" fill="#0f766e">{label ? 'Кратные 12' : '12 ga karralilar'}</text><text x="159" y="125" textAnchor="middle" fontSize="38" fontWeight="900" fill="#cbd5e1">?</text><text x="461" y="125" textAnchor="middle" fontSize="38" fontWeight="900" fill="#cbd5e1">?</text>{[3,4,24,60].map((n,i)=><g key={n}><circle cx={235+i*50} cy="180" r="20" fill={i%3===0?'#cffafe':i%3===1?'#ccfbf1':'#fef3c7'}/><text x={235+i*50} y="187" textAnchor="middle" fontSize="18" fontWeight="900" fill="#334155">{n}</text></g>)}
        </>}
        {id === 7 && <>
          {['#06b6d4','#14b8a6','#f59e0b'].map((color,i)=><g key={color} transform={`translate(${45+i*195} 42)`}><rect width="145" height="120" rx="16" fill="#fff" stroke={color} strokeWidth="3"/><text x="72" y="48" textAnchor="middle" fontSize="27" fontWeight="900" fill="#334155">□ × □</text><text x="72" y="83" textAnchor="middle" fontSize="19" fontWeight="800" fill="#0f766e">= 48</text><rect x="25" y="94" width="95" height="8" rx="4" fill={color}/></g>)}
        </>}
        {id === 8 && <>
          <rect x="28" y="25" width="564" height="64" rx="15" fill="#fff" stroke="#06b6d4" strokeWidth="3"/><text x="310" y="65" textAnchor="middle" fontSize="19" fontWeight="800" fill="#334155">1 · 2 · 3 · 6 · 9 · 18 · 27 · 54</text><rect x="28" y="116" width="564" height="64" rx="15" fill="#fff" stroke="#14b8a6" strokeWidth="3"/><text x="310" y="156" textAnchor="middle" fontSize="19" fontWeight="800" fill="#334155">1 · 2 · 3 · 6 · <tspan fill={revealCorrect?'#f59e0b':'#334155'} fontWeight="900">8</tspan> · 9 · 18 · 27 · 54</text>
        </>}
        {id === 9 && <>
          {[63,72,81,96].map((n,i)=><g key={n} transform={`translate(${55+i*140} 58)`}><rect width="92" height="92" rx="18" fill="#fff" stroke={i%3===0?'#06b6d4':i%3===1?'#14b8a6':'#f59e0b'} strokeWidth="4"/><text x="46" y="55" textAnchor="middle" fontSize="28" fontWeight="900" fill="#334155">{n}</text>{revealCorrect&&n===72&&<text x="46" y="79" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f766e">4×18 · 9×8</text>}</g>)}<text x="310" y="35" textAnchor="middle" fontSize="18" fontWeight="800" fill="#334155">60 &lt; ? &lt; 100</text>
        </>}
        {id === 10 && <>
          <circle cx="154" cy="103" r="67" fill="#fff" stroke="#06b6d4" strokeWidth="5"/><circle cx="466" cy="103" r="67" fill="#fff" stroke="#14b8a6" strokeWidth="5"/><text x="154" y="93" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f766e">{revealCorrect?'120 ÷ 10':'? ÷ 10'}</text><text x="154" y="126" textAnchor="middle" fontSize="27" fontWeight="900" fill="#334155">= {revealCorrect?'12':'?'}</text><text x="466" y="93" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f766e">{revealCorrect?'120 ÷ 12':'? ÷ 12'}</text><text x="466" y="126" textAnchor="middle" fontSize="27" fontWeight="900" fill="#334155">= {revealCorrect?'10':'?'}</text><path d="M225 103h170" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round"/><circle cx="310" cy="103" r="18" fill="#f59e0b"/>{revealCorrect&&<path d="m301 103 7 7 13-17" fill="none" stroke="#fff" strokeWidth="4"/>}
        </>}
      </svg>
    </div>
  );
}

function useRegister(check, registerCheck) {
  useEffect(() => { registerCheck?.(check); }, [check, registerCheck]);
}

const expectedFor = (id, value) => {
  if (id === 1) return value?.[0] === 15 && value?.[1] === 5;
  if (id === 2) return value === 2;
  if (id === 3) return Number(value) === 4;
  if (id === 4) return value === 9;
  if (id === 5) return value?.join(',') === '2,3';
  if (id === 6) return value?.join(',') === '0,0,1,1';
  if (id === 7) return value?.slice().sort().join(',') === '0,1,2';
  if (id === 8) return value === 1;
  if (id === 9) return value === 1;
  return value === 2;
};

export default function D01Question(props) {
  const { id, lang = 'uz', mode = 'answer', playCorrect, playWrong, onReady, registerCheck, onSubmit } = props;
  const t = COPY[id][lang] || COPY[id].uz;
  const accent = COLOR_BY_ID[id - 1];
  const lockedMode = mode === 'review';
  const [value, setValue] = useState(id === 1 ? [null, null] : id === 5 ? [-1, -1] : id === 6 ? [-1, -1, -1, -1] : id === 7 ? [] : id === 3 ? '' : null);
  const [active, setActive] = useState(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [optionOrder] = useState(() => (
    VARIANT_CORRECT[id] != null ? shuffledIndexes(COPY[id].uz.opts.length) : []
  ));

  const ready = id === 1 ? value.every(x => x != null)
    : id === 5 ? value.every(x => x >= 0)
    : id === 6 ? value.every(x => x >= 0)
      : id === 7 ? value.length === 3 : id === 3 ? value !== '' : value !== null;
  useEffect(() => { onReady?.(ready && !checked); }, [ready, checked, onReady]);

  const check = useCallback(() => {
    const ok = expectedFor(id, value);
    setChecked(true); setCorrect(ok);
    ok ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: t.opts || [], studentAnswer: value,
      correctAnswer: id === 1 ? [15, 5] : id === 3 ? 4 : true, correct: ok,
      meta: { lesson: 'grade6_dars01', task: id, level: id <= 4 ? 'easy' : id <= 7 ? 'medium' : 'hard' },
    });
  }, [id, value, playCorrect, playWrong, onSubmit, t]);
  useRegister(check, registerCheck);

  const choose = (v) => { if (!checked && !lockedMode) setValue(v); };
  const optionStyle = (selected) => ({
    borderColor: selected ? accent : C.line, background: selected ? `${accent}18` : '#fff',
    boxShadow: selected ? `0 0 0 3px ${accent}1f` : 'none',
  });

  const body = () => {
    if (id === 1) {
      const place = (slot) => {
        if (checked || lockedMode || active == null) return;
        setValue((prev) => {
          const next = prev.map((n) => n === active ? null : n);
          next[slot] = active;
          return next;
        });
        setActive(null);
      };
      return (
        <div className="g6p-place-task">
          <div className="g6p-place-equation" aria-label={lang === 'ru' ? 'Пример с пустыми клетками' : 'Bo‘sh katakli misol'}>
            {[0, 1].map((slot) => (
              <Fragment key={slot}>
                <button type="button"
                  className={`g6p-drop-slot slot-${slot} ${value[slot] != null ? `filled value-${value[slot]}` : ''}`}
                  disabled={checked || lockedMode}
                  onClick={() => place(slot)} aria-label={`${slot + 1}-${lang === 'ru' ? 'я клетка' : 'katak'}`}>
                  {value[slot] ?? '?'}
                </button>
                {slot === 0 && <span className="g6p-math-sign">:</span>}
              </Fragment>
            ))}
            <span className="g6p-math-sign">=</span>
            <strong className="g6p-fixed-answer">3</strong>
          </div>
          <div className="g6p-card-label">{lang === 'ru' ? 'Карточки с числами' : 'Sonli kartalar'}</div>
          <div className="g6p-place-cards">
            {[5, 15].map((n) => {
              const selected = active === n;
              const placed = value.includes(n);
              return (
                <button type="button" key={n} disabled={checked || lockedMode}
                  className={`${selected ? 'selected' : ''} ${placed ? 'placed' : ''} card-${n}`}
                  onClick={() => setActive(selected ? null : n)}>{n}</button>
              );
            })}
          </div>
        </div>
      );
    }
    if (id === 2) return (
      <div className="g6p-segment-options">
        {optionOrder.map((answerIndex, position) => {
          const label = t.opts[answerIndex];
          const length = [5, 8, 7, 10][answerIndex];
          return (
            <button type="button" key={answerIndex} disabled={checked || lockedMode}
              className={`segment-palette-${position % 3} ${value === answerIndex ? 'selected' : ''}`}
              onClick={() => choose(answerIndex)}>
              <span className="g6p-mini-segment" style={{ width: `${54 + length * 7}px` }}/>
              <strong>{label}</strong>
            </button>
          );
        })}
      </div>
    );
    if ([8, 9, 10].includes(id)) return (
      <div className="g6p-options">
        {optionOrder.map((answerIndex, position) => {
          const x = t.opts[answerIndex];
          return <button type="button" key={answerIndex} disabled={checked || lockedMode}
            className={`g6p-option palette-${position % 3}`} style={optionStyle(value === answerIndex)} onClick={() => choose(answerIndex)}>
            <b>{String.fromCharCode(65 + position)}</b><span>{x}</span>
          </button>;
        })}
      </div>
    );
    if (id === 3) return (
      <div>
        <div className="g6p-equation">
          <span>32</span><span>:</span>
          <strong className={value === '' ? 'empty' : ''} style={{ borderColor: accent }}>{value || '?'}</strong>
          <span>=</span><span>8</span>
        </div>
        <div className="g6p-number-cards" aria-label={lang === 'ru' ? 'Карточки с числами' : 'Raqam kartalari'}>
          {[2, 4, 6, 8].map(n => (
            <button type="button" key={n} disabled={checked || lockedMode}
              style={optionStyle(Number(value) === n)} onClick={() => choose(String(n))}>{n}</button>
          ))}
        </div>
      </div>
    );
    if (id === 4) return (
      <div className="g6p-stepper">
        {[6, 8, 9, 12].map(n => <button type="button" key={n} disabled={checked || lockedMode}
          style={optionStyle(value === n)} onClick={() => choose(n)}>
          <span>{n}</span><small>{lang === 'ru' ? 'ламп' : 'ta chiroq'}</small>
        </button>)}
      </div>
    );
    if (id === 5) {
      const left = [28, 45], right = [4, 5, 7, 9];
      return <div className="g6p-match">
        <div>{left.map((n, i) => <button type="button" key={n} disabled={checked || lockedMode}
          className={active === i ? 'active' : ''} onClick={() => setActive(i)} style={{ '--a': accent }}>{n}</button>)}</div>
        <svg viewBox="0 0 120 110">{value.map((x, i) => x >= 0 && <path key={i} d={`M0 ${28 + i * 55} C45 ${28 + i * 55},75 ${18 + x * 25},120 ${18 + x * 25}`} stroke={accent} strokeWidth="4" fill="none"/>)}</svg>
        <div>{right.map((n, i) => <button type="button" key={n} disabled={checked || lockedMode}
          onClick={() => { if (active != null) { const v = [...value]; v[active] = i; setValue(v); setActive(null); } }}>{n}</button>)}</div>
      </div>;
    }
    if (id === 6) {
      const nums = [3, 4, 24, 60];
      return <div className="g6p-sort">
        {nums.map((n, i) => <div key={n}><strong>{n}</strong><div>
          {t.opts.map((x, k) => <button type="button" key={x} disabled={checked || lockedMode}
            style={optionStyle(value[i] === k)} onClick={() => { const v = [...value]; v[i] = k; setValue(v); }}>{x}</button>)}
        </div></div>)}
      </div>;
    }
    const pairs = [[1, 48], [2, 24], [3, 16], [4, 10], [6, 9]];
    return <div className="g6p-pairs">{pairs.map((p, i) => {
      const selected = value.includes(i);
      return <button type="button" key={p.join('-')} disabled={checked || lockedMode}
        style={optionStyle(selected)} onClick={() => setValue(v => selected ? v.filter(x => x !== i) : v.length < 3 ? [...v, i] : v)}>
        <span>{p[0]}</span><b>×</b><span>{p[1]}</span><em>= {p[0] * p[1]}</em>
      </button>;
    })}</div>;
  };

  return (
    <div className="g6p-question" style={{ '--accent': accent }}>
      <style>{`
        .g6p-question{position:relative;max-width:650px;margin:0 auto;color:${C.ink};padding:3px 3px 16px;background:#fff7ed}
        .g6p-palette-bar{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin:0 0 7px}.g6p-palette-bar span{height:5px;border-radius:999px;background:#fb923c}
        .g6p-eye{color:#f97316;font-size:12px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}
        .g6p-question h2{font-size:25px;line-height:1.15;margin:5px 0 7px}.g6p-setup{color:${C.sub};line-height:1.5;margin:0 0 10px}
        .g6p-guide{display:flex;gap:9px;align-items:flex-start;margin:9px 0 12px;padding:10px 12px;border:1px solid #fed7aa;border-radius:13px;background:#ffedd5;color:#475569;font-size:14px;font-weight:650;line-height:1.45}
        .g6p-guide b{display:grid;place-items:center;flex:none;width:23px;height:23px;border-radius:50%;background:#f59e0b;color:#fff}
        .g6p-scene{position:relative;margin:12px 0;border-radius:18px;overflow:hidden;border:1px solid ${C.line};box-shadow:0 8px 20px #64748b14;background:#fff}
        .g6p-scene svg{display:block;width:100%;height:clamp(105px,18vh,145px)}
        .g6p-ask{font-size:17px;font-weight:800;line-height:1.42;margin:14px 0 11px}
        .g6p-options{display:grid;gap:7px}.g6p-option{display:flex;align-items:center;gap:12px;text-align:left;padding:10px 13px;border:2px solid;border-radius:14px;font:700 14px inherit;color:${C.ink};cursor:pointer}
        .g6p-option b{display:grid;place-items:center;width:28px;height:28px;border-radius:9px;color:#fff}.g6p-option.palette-0 b{background:#06b6d4}.g6p-option.palette-1 b{background:#14b8a6}.g6p-option.palette-2 b{background:#f59e0b}
        .g6p-equation{display:flex;align-items:center;justify-content:center;gap:13px;padding:20px;border-radius:18px;background:#fff;box-shadow:0 8px 25px #64748b18;font-size:31px;font-weight:900}
        .g6p-equation strong{display:grid;place-items:center;width:72px;height:58px;border:3px solid;border-radius:13px;text-align:center;font:900 29px inherit;color:${C.ink};background:#fff7ed}.g6p-equation strong.empty{color:#94a3b8}
        .g6p-number-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:11px}.g6p-number-cards button{padding:12px;border:2px solid;border-radius:13px;background:#fff;font:900 21px inherit;color:${C.ink};cursor:pointer}
        .g6p-place-task{padding:14px;border:1px solid #fed7aa;border-radius:18px;background:#fff7ed}
        .g6p-place-equation{display:flex;align-items:center;justify-content:center;gap:13px;padding:17px 8px}
        .g6p-drop-slot{display:grid;place-items:center;width:68px;height:68px;padding:0;border:3px dashed;border-radius:15px;background:#fff;font-family:inherit;font-size:31px;font-weight:900;line-height:1;color:${C.ink};cursor:pointer}
        .g6p-drop-slot.slot-0,.g6p-drop-slot.slot-1{border-color:#fb923c}
        .g6p-drop-slot.filled{border:0;color:#fff}
        .g6p-drop-slot.value-15{background:#06b6d4;box-shadow:0 5px 0 #0891b2}
        .g6p-drop-slot.value-5{background:#14b8a6;box-shadow:0 5px 0 #0f766e}
        .g6p-drop-slot:disabled{cursor:default}.g6p-math-sign{font-size:31px;font-weight:900;color:#475569}
        .g6p-fixed-answer{display:grid;place-items:center;width:68px;height:68px;border-radius:15px;background:#f59e0b;color:#fff;font-family:inherit;font-size:31px;font-weight:900;line-height:1;box-shadow:0 5px 0 #d97706}
        .g6p-card-label{text-align:center;margin:2px 0 8px;color:#64748b;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}
        .g6p-place-cards{display:flex;justify-content:center;gap:12px}.g6p-place-cards button{width:68px;height:68px;padding:0;border:0;border-radius:15px;font-family:inherit;font-size:31px;font-weight:900;line-height:1;color:#fff;cursor:pointer}
        .g6p-place-cards .card-15{background:#06b6d4;box-shadow:0 5px 0 #0891b2}.g6p-place-cards .card-5{background:#14b8a6;box-shadow:0 5px 0 #0f766e}
        .g6p-place-cards button.selected{outline:4px solid #f59e0b;outline-offset:3px}
        .g6p-place-cards button.placed{opacity:.45}
        .g6p-segment-options{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .g6p-segment-options button{min-height:78px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;border:3px solid #fed7aa;border-radius:15px;background:#fff;cursor:pointer;color:${C.ink}}
        .g6p-segment-options button.selected{border-color:#f59e0b;background:#fffbeb}
        .g6p-mini-segment{display:block;max-width:88%;height:13px;border-radius:999px;box-shadow:inset 0 3px 0 rgba(255,255,255,.45)}
        .g6p-segment-options .g6p-mini-segment{background:#14b8a6}
        .g6p-segment-options strong{font-size:17px}
        .g6p-ribbon-cut{stroke:#fff;stroke-width:5;stroke-dasharray:66;stroke-dashoffset:66;animation:g6RibbonCut .34s ease-out forwards}
        .g6p-ribbon-label{fill:#fff;font-size:13px;font-weight:900;opacity:0;animation:g6RibbonLabel .25s ease-out forwards}
        @keyframes g6RibbonCut{to{stroke-dashoffset:0}}
        @keyframes g6RibbonLabel{to{opacity:1}}
        .g6p-stepper{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.g6p-stepper button{display:flex;flex-direction:column;gap:2px;padding:12px;border:2px solid;border-radius:14px;font:inherit;cursor:pointer;color:${C.ink}}
        .g6p-stepper span{font-size:25px;font-weight:900}.g6p-stepper small{color:${C.sub};font-weight:700}
        .g6p-match{display:grid;grid-template-columns:90px 1fr 90px;align-items:stretch;gap:5px}.g6p-match>div{display:flex;flex-direction:column;justify-content:space-around;gap:8px}
        .g6p-match button{height:47px;border:2px solid ${C.line};border-radius:13px;background:#fff;font:900 18px inherit;color:${C.ink};cursor:pointer}.g6p-match button.active{border-color:var(--a);background:color-mix(in srgb,var(--a) 14%,white)}
        .g6p-sort{display:grid;grid-template-columns:1fr 1fr;gap:9px}.g6p-sort>div{border:1px solid ${C.line};border-radius:15px;background:#fff;padding:10px}.g6p-sort strong{display:block;text-align:center;font-size:24px}.g6p-sort>div>div{display:flex;gap:5px;margin-top:7px}.g6p-sort button{flex:1;padding:7px 4px;border:2px solid;border-radius:10px;font:700 11px inherit;color:${C.ink};cursor:pointer}
        .g6p-pairs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.g6p-pairs button{border:2px solid;border-radius:14px;padding:10px 6px;background:#fff;font:700 16px inherit;cursor:pointer;color:${C.ink}}.g6p-pairs span{font-size:22px;font-weight:900}.g6p-pairs b{padding:0 5px;color:var(--accent)}.g6p-pairs em{display:block;color:${C.sub};font-size:12px;font-style:normal;margin-top:3px}
        .g6p-feedback{display:flex;gap:9px;align-items:flex-start;margin-top:9px;padding:9px 12px;border-radius:14px;font-size:13px;font-weight:700;line-height:1.4}.g6p-feedback.ok{background:#e8f7ee;color:#187647}.g6p-feedback.no{background:#fff0f0;color:#b42318}
        @media(max-width:520px){.g6p-question h2{font-size:19px;margin:3px 0 4px}.g6p-setup{font-size:13px;line-height:1.35;margin-bottom:5px}.g6p-guide{font-size:12px;line-height:1.3;margin:5px 0 7px;padding:7px 9px}.g6p-scene{margin:6px 0}.g6p-ask{font-size:14px;line-height:1.3;margin:7px 0}.g6p-place-task{padding:8px}.g6p-place-equation{gap:8px;padding:10px 3px}.g6p-drop-slot,.g6p-fixed-answer,.g6p-place-cards button{width:56px;height:56px;font-size:26px}.g6p-math-sign{font-size:25px}.g6p-stepper{grid-template-columns:repeat(4,1fr)}.g6p-sort{grid-template-columns:1fr 1fr;gap:5px}.g6p-sort>div{padding:6px}.g6p-sort button{font-size:9px}.g6p-pairs{grid-template-columns:repeat(3,1fr);gap:5px}.g6p-pairs button{padding:7px 3px}.g6p-pairs span{font-size:17px}.g6p-feedback{margin-top:6px;padding:7px 9px;font-size:12px}}
      `}</style>
      <div className="g6p-palette-bar" aria-hidden="true"><span/><span/><span/></div>
      <div className="g6p-eye">{t.eye}</div>
      <h2>{t.title}</h2>
      <p className="g6p-setup">{t.setup}</p>
      <div className={`g6p-guide guide-${id}`}><b>i</b><span>{HOW_TO[id][lang] || HOW_TO[id].uz}</span></div>
      {id === 2 && <TaskVisual id={id} accent={accent} lang={lang} revealCorrect={checked && correct}/>}
      <p className="g6p-ask">{t.ask}</p>
      {body()}
      {checked && <div className={`g6p-feedback ${correct ? 'ok' : 'no'}`}><span>{correct ? '✓' : '!'}</span><span>{correct ? t.ok : t.no}</span></div>}
    </div>
  );
}
