// Dars10 · Amaliyot 01 — Test · 🟢 · teg: grafik-kesishish-nuqtasi
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
//
// MANTIQIY savol (TIPLAR_AMALIYOT_9SINF.md §2.1): hisob emas, kesishish
// nuqtasining MA'NOsi so'ralyapti. To'rtala variant darsning to'rtala
// adashishiga tegadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'grafik-kesishish-nuqtasi', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Chiziq va parabola bitta tekislikda. Ularning umumiy nuqtasi bor.",
    'Прямая и парабола на одной плоскости. У них есть общая точка.',
    'A line and a parabola on one plane. They have a common point.'),
  ask: L(
    'Umumiy nuqta haqida qaysi tasdiq to\'g\'ri?',
    'Какое утверждение об общей точке верно?',
    'Which statement about the common point is right?'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['y = x + 1'], ['y = x² − 1']],
  opts: [
    { label: L(
      "Ikkala tenglamani ham qanoatlantiradi",
      'Удовлетворяет обоим уравнениям',
      'It satisfies both equations') },
    { label: L(
      "Faqat parabolaning tenglamasini qanoatlantiradi",
      'Удовлетворяет только уравнению параболы',
      'It satisfies only the parabola') },
    { label: L(
      "Umumiy nuqta doim bitta bo'ladi",
      'Общая точка всегда одна',
      'There is always exactly one such point') },
    { label: L(
      "To'r chizig'idagi har qanday nuqta — yechim",
      'Любая точка на линии сетки — решение',
      'Any point on a grid line is a solution') },
  ],
  correctText: L(
    "To'g'ri. Kesishish nuqtasi IKKALA grafikda ham yotadi, ya'ni uning koordinatalari ikkala tenglamani ham qanoatlantiradi — sistemaning yechimi aynan shu. Shuning uchun u ikkala tenglamada tekshiriladi.",
    'Верно. Точка пересечения лежит на ОБОИХ графиках, значит её координаты удовлетворяют обоим уравнениям — это и есть решение системы. Потому точку с графика проверяют в обоих уравнениях.',
    'Correct. A crossing point lies on BOTH graphs, so its coordinates satisfy both equations — that is what a solution of a system is. This is why it is checked in both equations.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Nuqta faqat parabolada yotsa, u parabolaning nuqtasi, kesishish nuqtasi emas. Kesishish uchun u chiziqda ham yotishi kerak.",
      'Если точка лежит только на параболе, это точка параболы, а не пересечения. Чтобы быть пересечением, она должна лежать и на прямой.',
      'If a point lies only on the parabola, it is a point of the parabola, not a crossing. To be a crossing it must lie on the line too.') },
    { when: (s) => s.picked === 2, text: L(
      "Parabolani ko'z oldingizga keltiring va uni chiziq bilan kesib o'ting: chiziqni yuqoriroq surib ikkita, pastroq surib nolta kesishish olish mumkin.",
      'Представь параболу и проведи через неё прямую: сдвинув прямую выше, получишь две точки, ниже — ни одной.',
      'Picture a parabola and draw a line across it: moved higher the line gives two points, moved lower — none.') },
    { when: (s) => s.picked === 3, text: L(
      "To'r chizig'i shunchaki yordamchi belgi. Nuqta yechim bo'ladimi yoki yo'q — buni faqat tenglamalarga qo'yib tekshirish hal qiladi.",
      'Линия сетки — просто вспомогательная разметка. Решение точка или нет, решает только подстановка в уравнения.',
      'A grid line is just auxiliary marking. Whether a point is a solution is decided only by substituting into the equations.') },
  ],
  wrongText: L(
    "Savolni shunday qo'ying: nuqta yechim bo'lishi uchun nechta tenglamani qanoatlantirishi kerak?",
    'Поставь вопрос так: скольким уравнениям должна удовлетворять точка, чтобы быть решением?',
    'Put the question this way: how many equations must a point satisfy to be a solution?'),
};

export default function D10_01(props) { return <Choice data={DATA} {...props} />; }
