// Ekran turlarining uch tilli yorliqlari va tekshiruvi.
// Ekran turlari lug'ati. Har bir tur uch tilda bo'lishi shart — aks holda
// bolaga inglizcha texnik so'z chiqadi.
export const SCREEN_TYPE_LABELS = {
  hook: { uz: "Missiya", ru: 'Миссия', en: 'Mission' },
  diagnostic: { uz: "Diagnostika", ru: 'Диагностика', en: 'Diagnostic' },
  exploration: { uz: "Kashfiyot", ru: 'Исследование', en: 'Explore' },
  model: { uz: "Model", ru: 'Модель', en: 'Model' },
  discovery: { uz: "Kashfiyot", ru: 'Открытие', en: 'Discovery' },
  rule: { uz: "Qoida", ru: 'Правило', en: 'Rule' },
  practice: { uz: "Mashq", ru: 'Практика', en: 'Practice' },
  'guided-practice': { uz: "Mashq", ru: 'Тренировка', en: 'Practice' },
  'independent-practice': { uz: "Mustaqil", ru: 'Самостоятельно', en: 'On your own' },
  strategy: { uz: "Strategiya", ru: 'Стратегия', en: 'Strategy' },
  'error-analysis': { uz: "Xatoni topish", ru: 'Разбор ошибки', en: 'Spot the error' },
  transfer: { uz: "Yangi holat", ru: 'Новый случай', en: 'New case' },
  'life-case': { uz: "Hayotiy vazifa", ru: 'Задача из жизни', en: 'Real-life task' },
  comparison: { uz: "Taqqoslash", ru: 'Сравнение', en: 'Comparison' },
  test: { uz: "Tekshiruv", ru: 'Проверка', en: 'Check' },
  case: { uz: "Vazifa", ru: 'Задача', en: 'Problem' },
  summary: { uz: "Yakun", ru: 'Итог', en: 'Summary' },
};

// Dars yuklanganda tekshiradi: har bir ekran turi tarjimaga egami.
export const assertScreenTypeLabels = (screenMeta, lessonId) => {
  screenMeta.forEach((meta) => {
    if (!SCREEN_TYPE_LABELS[meta.type]) {
      throw new Error(`${lessonId}: '${meta.type}' ekran turi uchun yorliq yo'q`);
    }
  });
};
