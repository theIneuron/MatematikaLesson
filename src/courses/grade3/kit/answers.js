// ============================================================================
// grade3/kit/answers.js — РАСКЛАДКА ВАРИАНТОВ ОТВЕТА
//
// Требование методиста 2026-08-03: позиция верного ответа обязана меняться от
// вопроса к вопросу (ETALON_3SINF_v2 §4.3).
//
// Что было в проекте до этого:
//   • grade3/Dars01.jsx (HEAD): seededMcOrder(len, (idx+1)*7919 + len) — порядок
//     детерминирован номером экрана. Стабильно, но: (а) при повторном прохождении
//     раскладка ТА ЖЕ, ребёнок запоминает позиции; (б) соседние вопросы могут
//     случайно совпасть по позиции верного.
//   • MCRoundScreen: shuffleArr на каждый вопрос независимо и случайно —
//     измерено 3920 повторов позиции подряд на 2000 серий по 6 вопросов.
//
// Здесь раскладка планируется НА ВЕСЬ УРОК СРАЗУ, один раз при монтировании.
// Отдельный экран не может знать позицию предыдущего вопроса, поэтому решение
// принимается на уровне урока и раздаётся экранам.
//
// Случайно, но с запретом повторить предыдущую позицию: против запоминания
// (меняется каждый заход) и против ритма (соседние не совпадают).
//
// Чистый модуль: без React и без зависимостей, проверяется тестом.
// ============================================================================

/**
 * Планирует позиции верного ответа для последовательности вопросов урока.
 *
 * @param slots массив количеств вариантов по порядку появления вопроса в уроке
 *              (экраны и раунды внутри экранов — одной сплошной последовательностью)
 * @param rnd   источник случайности; в тестах подменяется на детерминированный
 * @returns массив позиций той же длины; positions[i] !== positions[i-1]
 */
export const planAnswerPositions = (slots, rnd = Math.random) => {
  const out = [];
  let prev = -1;
  for (const raw of slots || []) {
    const n = Math.max(0, Number(raw) || 0);
    if (n === 0) { out.push(null); continue; }
    // При одном варианте выбора нет — повтор неизбежен, не притворяемся.
    const pool = n > 1
      ? Array.from({ length: n }, (_, k) => k).filter((p) => p !== prev)
      : [0];
    const p = pool[Math.floor(rnd() * pool.length)];
    out.push(p);
    prev = p;
  }
  return out;
};

/**
 * Переставляет варианты так, чтобы верный оказался на позиции targetPos.
 *
 * Остальные варианты сохраняют относительный порядок — так распределение
 * отвлекающих не искажается, меняется только место верного.
 *
 * ВАЖНО: parallel — это массивы, идущие «в ногу» с options (разборы на каждый
 * неверный вариант, подсказки). Они переставляются ВМЕСТЕ с вариантами, иначе
 * разбор уедет к чужому ответу. Это уже ломалось в проекте: см. remapMcOrder
 * в grade3MethodUtils.js, где ту же задачу решают для ключей wrong_N/hint_N.
 *
 * @param options   массив вариантов
 * @param correctIdx индекс верного в исходном массиве
 * @param targetPos  куда поставить верный (null — не менять)
 * @param parallel   объект { имя: массив }, переставляемый синхронно
 * @returns { options, correctIdx, parallel, order }
 */
export const remapToPosition = (options, correctIdx, targetPos, parallel = {}) => {
  const n = (options || []).length;
  const safe = { options: options || [], correctIdx, parallel, order: Array.from({ length: n }, (_, i) => i) };
  if (n === 0 || targetPos === null || targetPos === undefined) return safe;
  if (!Number.isInteger(correctIdx) || correctIdx < 0 || correctIdx >= n) return safe;
  const pos = Math.max(0, Math.min(n - 1, targetPos));

  const others = [];
  for (let i = 0; i < n; i += 1) if (i !== correctIdx) others.push(i);
  const order = [];
  let k = 0;
  for (let slot = 0; slot < n; slot += 1) {
    if (slot === pos) order.push(correctIdx);
    else { order.push(others[k]); k += 1; }
  }

  const nextParallel = {};
  for (const [key, arr] of Object.entries(parallel || {})) {
    nextParallel[key] = Array.isArray(arr) ? order.map((i) => arr[i]) : arr;
  }
  return {
    options: order.map((i) => options[i]),
    correctIdx: pos,
    parallel: nextParallel,
    order,
  };
};

/**
 * Собирает количества вариантов по уроку в один плоский список — вход для
 * planAnswerPositions. Порядок обхода = порядок, в котором ребёнок увидит вопросы.
 *
 * @returns { slots, index } где index[screenIdx][roundIdx] = позиция в slots
 */
export const collectAnswerSlots = (screens) => {
  const slots = [];
  const index = [];
  (screens || []).forEach((screen, si) => {
    const rounds = Array.isArray(screen?.rounds) && screen.rounds.length > 0
      ? screen.rounds
      : (screen?.options ? [screen] : []);
    const perScreen = [];
    rounds.forEach((round) => {
      const n = (round?.options || []).length;
      perScreen.push(slots.length);
      slots.push(n);
    });
    index[si] = perScreen;
  });
  return { slots, index };
};

/**
 * Готовая раскладка на урок: план позиций плюс доступ по (экран, раунд).
 * Вызывается один раз при монтировании урока и раздаётся экранам.
 */
export const makeAnswerLayout = (screens, rnd = Math.random) => {
  const { slots, index } = collectAnswerSlots(screens);
  const positions = planAnswerPositions(slots, rnd);
  return {
    positions,
    /** Позиция верного ответа для конкретного вопроса. */
    positionFor: (screenIdx, roundIdx = 0) => {
      const at = index[screenIdx] && index[screenIdx][roundIdx];
      return at === undefined ? null : positions[at];
    },
  };
};

/** Где позиция верного ответа повторилась подряд — для валидатора и тестов. */
export const findRepeatedPositions = (positions) => {
  const bad = [];
  const list = (positions || []).filter((p) => p !== null && p !== undefined);
  for (let i = 1; i < list.length; i += 1) {
    if (list[i] === list[i - 1]) bad.push({ at: i, position: list[i] });
  }
  return bad;
};
