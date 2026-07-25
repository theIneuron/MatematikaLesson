import React from 'react';
import { isGrade3Explanation } from './grade3MethodUtils.js';

const bi = (uz, ru) => ({ uz, ru });

// Dars02 etalonidagi SCREEN_GUIDES tamoyili:
// tushuntirish ekranini qo'shimcha matn bilan band qilmaymiz;
// o'quvchi harakat qiladigan ekranlarda esa vazifani ikki aniq qadamga ajratamiz.
const GUIDE_TOPICS = {
  'num-3-03': {
    s0: bi('Raqam qiymati', 'Значение цифры'),
    s7: bi('Sonni yoyamiz', 'Раскладываем число'),
    s8: bi("Sonni yig'amiz", 'Собираем число'),
    s9: bi("Nol tuzog'i", 'Ловушка с нулём'),
    s10: bi('Xatoni topamiz', 'Ищем ошибку'),
    s11: bi('Zuhra paneli', 'Панель Зухры'),
    s12: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s13: bi('Panel ochildi', 'Панель открыта'),
  },
  'num-3-04': {
    s0: bi('Ikki tuman', 'Два района'),
    s7: bi("Belgini qo'yamiz", 'Ставим знак'),
    s8: bi('Katta sonni topamiz', 'Находим большее число'),
    s9: bi('Xatoni topamiz', 'Ищем ошибку'),
    s10: bi('Jasur hisoboti', 'Отчёт Джасура'),
    s11: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s12: bi('Tumanlar solishtirildi', 'Районы сравнены'),
  },
  'num-3-05': {
    s0: bi('Taxminiy son', 'Примерное число'),
    s7: bi("O'nlikkacha", 'До десятков'),
    s8: bi('Yuzlikkacha', 'До сотен'),
    s9: bi('Xatoni topamiz', 'Ищем ошибку'),
    s10: bi('Anvarning hisoboti', 'Расчёт Анвара'),
    s11: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s12: bi("Shkala sozlandi", 'Шкала настроена'),
  },
  'num-3-06': {
    s0: bi("Sonning o'rni", 'Место числа'),
    s6: bi('Oraliqni topamiz', 'Находим промежуток'),
    s7: bi("Belgini o'qiymiz", 'Читаем отметку'),
    s8: bi('Nuqtani tanlaymiz', 'Выбираем точку'),
    s9: bi('Zuhra shkalasi', 'Шкала Зухры'),
    s10: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s11: bi("Yo'l topildi", 'Путь найден'),
  },
  'num-3-07': {
    s0: bi('Hisob terminali', 'Счётный терминал'),
    s6: bi("Qo'shamiz", 'Складываем'),
    s7: bi('Ayiramiz', 'Вычитаем'),
    s8: bi('Xatoni topamiz', 'Ищем ошибку'),
    s9: bi('Jasurning hisobi', 'Расчёт Джасура'),
    s10: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s11: bi('Terminal ishga tushdi', 'Терминал запущен'),
  },
  'num-3-08': {
    s0: bi('Qadimiy belgi', 'Древний знак'),
    s6: bi("Rim raqamini o'qiymiz", 'Читаем римское число'),
    s7: bi('Rim raqamini yozamiz', 'Записываем римское число'),
    s8: bi('Xatoni topamiz', 'Ищем ошибку'),
    s9: bi('Oy belgisi', 'Знак месяца'),
    s10: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s11: bi('Belgi-devor ochildi', 'Стена знаков открыта'),
  },
  'num-3-10': {
    s0: bi("Nurli qatorlar", 'Светящиеся ряды'),
    s6: bi("Massivni o'qiymiz", 'Читаем массив'),
    s7: bi('Jadvalni eslaymiz', 'Вспоминаем таблицу'),
    s8: bi('Xatoni topamiz', 'Ищем ошибку'),
    s9: bi("Nur bog'i masalasi", 'Задача светового сада'),
    s10: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s11: bi("Bog' yoritildi", 'Сад зажёгся'),
  },
  'num-3-11': {
    s0: bi('Lampa bloklari', 'Блоки ламп'),
    s7: bi("O'n va yuzga ko'paytiramiz", 'Умножаем на десять и сто'),
    s8: bi("O'n va yuzga bo'lamiz", 'Делим на десять и сто'),
    s9: bi('Xatoni topamiz', 'Ищем ошибку'),
    s10: bi('Aralash amallar', 'Смешанные действия'),
    s11: bi("Ra'noning tokchalari", 'Полки Рано'),
    s12: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s13: bi('Katta shkala ochildi', 'Большая шкала открыта'),
  },
  'num-3-12': {
    s0: bi("Yig'indini ko'paytirish", 'Умножение суммы'),
    s7: bi("To'g'ri yoyilma", 'Верное разложение'),
    s8: bi('Hisoblaymiz', 'Вычисляем'),
    s9: bi('Xatoni topamiz', 'Ищем ошибку'),
    s10: bi('Aralash mashq', 'Смешанная тренировка'),
    s11: bi("Bog' tokchalari", 'Полки сада'),
    s12: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s13: bi("Ikki tokcha yoritildi", 'Две полки зажглись'),
  },
  'num-3-13': {
    s0: bi("Yig'indini bo'lish", 'Деление суммы'),
    s7: bi("Qulay bo'lak", 'Удобные части'),
    s8: bi('Hisoblaymiz', 'Вычисляем'),
    s9: bi('Xatoni topamiz', 'Ищем ошибку'),
    s10: bi('Aralash mashq', 'Смешанная тренировка'),
    s11: bi('Hosilni taqsimlaymiz', 'Распределяем урожай'),
    s12: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s13: bi('Hosil teng taqsimlandi', 'Урожай распределён'),
  },
  'num-3-14': {
    s0: bi("Birinchi amal", 'Первое действие'),
    s7: bi('Amalni tanlaymiz', 'Выбираем действие'),
    s8: bi('Tartib bilan hisoblaymiz', 'Считаем по порядку'),
    s9: bi('Xatoni topamiz', 'Ищем ошибку'),
    s10: bi('Aralash ifodalar', 'Смешанные выражения'),
    s11: bi('Anvarning paneli', 'Панель Анвара'),
    s12: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s13: bi("Yo'riq ishladi", 'Инструкция сработала'),
  },
  'num-3-15': {
    s0: bi("Teskari yo'l", 'Обратный путь'),
    s6: bi("Bo'lishni o'qiymiz", 'Читаем деление'),
    s7: bi("Noma'lum ko'paytuvchi", 'Неизвестный множитель'),
    s8: bi('Tengliklar oilasi', 'Семейство равенств'),
    s9: bi('Zuhra savatlari', 'Корзины Зухры'),
    s10: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s11: bi("Teskari yo'l ochildi", 'Обратный путь открыт'),
  },
  'num-3-16': {
    s0: bi('Masalani tushunamiz', 'Понимаем задачу'),
    s7: bi('Amalni tanlaymiz', 'Выбираем действие'),
    s8: bi('Masalani yechamiz', 'Решаем задачу'),
    s9: bi('Xatoni topamiz', 'Ищем ошибку'),
    s10: bi('Aralash masalalar', 'Смешанные задачи'),
    s11: bi('Jasurning qutilari', 'Коробки Джасура'),
    s12: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s13: bi("Bog' vazifasi bajarildi", 'Задача сада решена'),
  },
  'num-3-17': {
    s0: bi('Teng qatorlar', 'Равные ряды'),
    s6: bi("Bo'luvchini topamiz", 'Находим делитель'),
    s7: bi('Karralini topamiz', 'Находим кратное'),
    s8: bi('Xatoni topamiz', 'Ищем ошибку'),
    s9: bi("Ra'noning hosili", 'Урожай Рано'),
    s10: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s11: bi('Qatorlar saralandi', 'Ряды отсортированы'),
  },
  'num-3-19': {
    s0: bi('Modullarni sanaymiz', 'Считаем модули'),
    s7: bi("To'g'ri yoyilma", 'Верное разложение'),
    s8: bi('Hisoblaymiz', 'Вычисляем'),
    s9: bi('Xatoni topamiz', 'Ищем ошибку'),
    s10: bi('Aralash mashq', 'Смешанная тренировка'),
    s11: bi('Jasurning rafi', 'Стеллаж Джасура'),
    s12: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s13: bi("Modullar yig'ildi", 'Модули собраны'),
  },
  'num-3-20': {
    s0: bi('Modullarni taqsimlaymiz', 'Распределяем модули'),
    s7: bi("Qulay bo'lakni tanlaymiz", 'Выбираем удобные части'),
    s8: bi("Bo'lib hisoblaymiz", 'Вычисляем делением'),
    s9: bi('Xatoni topamiz', 'Ищем ошибку'),
    s10: bi('Aralash mashq', 'Смешанная тренировка'),
    s11: bi('Jasurning taqsimoti', 'Распределение Джасура'),
    s12: bi('Yakuniy tekshiruv', 'Финальная проверка'),
    s13: bi("Raflar to'ldirildi", 'Полки заполнены'),
  },
};

const stepText = (meta, lang) => {
  if (meta?.type === 'hook') {
    return lang === 'uz'
      ? ["Muammoni tinglang", 'Birinchi javobni tanlang']
      : ['Послушай задачу', 'Выбери первый ответ'];
  }
  if (meta?.type === 'case') {
    return lang === 'uz'
      ? ["Vaziyatni o'qing", 'Yechimni tekshiring']
      : ['Прочитай ситуацию', 'Проверь решение'];
  }
  if (meta?.type === 'summary') {
    return lang === 'uz'
      ? ['Qoidani takrorlang', 'Darsni tugating']
      : ['Повтори правило', 'Заверши урок'];
  }
  if (meta?.scope === 'final') {
    return lang === 'uz'
      ? ['5 qisqa topshiriq', 'Mustaqil bajaring']
      : ['5 коротких заданий', 'Работай самостоятельно'];
  }
  return lang === 'uz'
    ? ['Misolni tahlil qiling', 'Javobni tekshiring']
    : ['Разбери пример', 'Проверь ответ'];
};

const toneFor = (meta) => {
  if (meta?.type === 'summary') return 'finish';
  if (meta?.scope === 'final') return 'test';
  if (meta?.type === 'hook' || meta?.type === 'case') return 'do';
  return 'practice';
};

const iconFor = (meta) => {
  if (meta?.type === 'hook') return '🎯';
  if (meta?.type === 'case') return '🏙️';
  if (meta?.type === 'summary') return '🏆';
  if (meta?.scope === 'final') return '⭐';
  return '✋';
};

export function Grade3MethodGuide({ lessonId, screenMeta, lang = 'uz' }) {
  if (!screenMeta || isGrade3Explanation(screenMeta)) return null;
  const topic = GUIDE_TOPICS[lessonId]?.[screenMeta.id] || {
    uz: screenMeta.scope === 'final'
      ? 'Bilimingizni yangi vaziyatda tekshiring'
      : 'Topshiriqni bosqichma-bosqich bajaring',
    ru: screenMeta.scope === 'final'
      ? 'Проверьте знания в новой ситуации'
      : 'Выполните задание по шагам',
  };
  const steps = stepText(screenMeta, lang);
  const tone = toneFor(screenMeta);

  return (
    <>
      <style>{`
        .g3-method-guide{display:flex;align-items:center;gap:9px;width:100%;margin:0 0 clamp(9px,1.6vw,13px);padding:7px 10px;border:1px solid rgba(1,154,203,.17);border-radius:14px;background:rgba(234,246,251,.72);animation:g3GuideIn .48s cubic-bezier(.22,.8,.3,1) both}
        .g3-method-guide-do{background:rgba(255,243,233,.82);border-color:rgba(255,79,40,.2)}
        .g3-method-guide-test{background:rgba(251,243,214,.86);border-color:rgba(216,169,58,.28)}
        .g3-method-guide-finish{background:rgba(227,240,232,.88);border-color:rgba(31,122,77,.22)}
        .g3-method-guide-icon{display:inline-flex;align-items:center;justify-content:center;width:29px;height:29px;flex:0 0 auto;border-radius:9px;background:#fff;box-shadow:0 5px 12px -8px rgba(58,53,48,.45);font-size:16px}
        .g3-method-guide-label{color:#017ba3;font-size:11px;font-weight:850;letter-spacing:.045em;text-transform:uppercase;white-space:nowrap}
        .g3-method-guide-do .g3-method-guide-label{color:#c0392b}.g3-method-guide-test .g3-method-guide-label{color:#8a681b}.g3-method-guide-finish .g3-method-guide-label{color:#1f7a4d}
        .g3-method-guide-flow{display:flex;align-items:center;justify-content:flex-end;gap:6px;min-width:0;margin-left:auto}
        .g3-method-guide-step{display:inline-flex;align-items:center;gap:5px;color:#5a5a60;font-size:clamp(10px,1.4vw,12px);font-weight:700;white-space:nowrap}
        .g3-method-guide-step b{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:0 0 auto;border-radius:50%;background:#019acb;color:#fff;font:800 10px 'JetBrains Mono',monospace}
        .g3-method-guide-do .g3-method-guide-step b{background:#ff4f28}.g3-method-guide-test .g3-method-guide-step b{background:#d8a93a}.g3-method-guide-finish .g3-method-guide-step b{background:#1f7a4d}
        .g3-method-guide-arrow{color:#a7a6a2;font-weight:900}
        @keyframes g3GuideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
        @media(max-width:520px){.g3-method-guide{gap:7px;padding:6px 8px}.g3-method-guide-label{display:none}.g3-method-guide-flow{gap:4px;justify-content:flex-start;margin-left:0}.g3-method-guide-step{font-size:10px}.g3-method-guide-step b{width:17px;height:17px}}
        @media(prefers-reduced-motion:reduce){.g3-method-guide{animation:none}}
      `}</style>
      <div className={`g3-method-guide g3-method-guide-${tone}`} role="note">
        <span className="g3-method-guide-icon" aria-hidden="true">{iconFor(screenMeta)}</span>
        <span className="g3-method-guide-label">{topic[lang] || topic.uz}</span>
        <span className="g3-method-guide-flow">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              {index > 0 && <span className="g3-method-guide-arrow" aria-hidden="true">→</span>}
              <span className="g3-method-guide-step">
                <b>{index + 1}</b>
                <span>{step}</span>
              </span>
            </React.Fragment>
          ))}
        </span>
      </div>
    </>
  );
}
