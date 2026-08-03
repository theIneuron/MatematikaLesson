// ============================================================================
// grade3/kit/i18n.js — ЛОКАЛИЗАЦИЯ БЕЗ ТИХОЙ ПОДМЕНЫ
//
// Зачем этот файл существует.
// В уроках 1–8 классов хелпер useT устроен так:
//     if (node[lang] !== undefined) return stripAudioTags(node[lang]);
//     return stripAudioTags(node.ru ?? '');          // <-- ТИХАЯ ПОДМЕНА
// То есть при отсутствии перевода экран показывает РУССКИЙ и никакой ошибки нет.
// Пока локалей было две, это почти не мешало. С добавлением английского
// (ETALON v2 §9.1) это становится ловушкой: урок выглядит рабочим, а ребёнок,
// выбравший English, читает русский — и никто об этом не узнает.
//
// Здесь подмены нет. Отсутствие локали — либо видимый маркер (dev/preview),
// либо явный вызов onMissing (production). Валидатор ловит это до публикации.
//
// Чистый модуль: без React и без зависимостей, поэтому проверяется тестом.
// React-хук useT будет тонкой обёрткой вокруг makeT в kit/infra.jsx.
// ============================================================================

export const LOCALES = ['uz', 'ru', 'en'];

// Порядок, в котором ищется запасной текст, если нужной локали нет.
// Только для показа пропуска — подменой это не является: пропуск всегда
// сопровождается маркером (strict) или вызовом onMissing (production).
const FALLBACK_ORDER = ['ru', 'uz', 'en'];

// Языковые теги озвучки: платформа добавляет их при отправке в TTS, на экран они
// попадать не должны. stripAudioTags убирает и их, и служебный [end].
const AUDIO_TAG_RE = /\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|language:\s*\w+|end)\]\s*/gi;

export const stripAudioTags = (value) =>
  typeof value === 'string' ? value.replace(AUDIO_TAG_RE, '').replace(/\s{2,}/g, ' ').trim() : value;

/** Похоже ли значение на локализованный узел {uz, ru, en}. */
export const isLocalizedNode = (node) =>
  !!node && typeof node === 'object' && LOCALES.some((l) => typeof node[l] === 'string');

/**
 * Один узел или ничего.
 *
 * Поле on_wrong в данных бывает двух видов: массив разборов по вариантам ответа
 * (у каждого неверного варианта свой) и одиночный узел на весь экран. Код,
 * который берёт on_wrong «как запасной вариант», обязан пропустить массив: массив,
 * попавший в localize, даёт «нет локали ru» и пустой текст вместо разбора.
 * Ошибка тихая — на экране просто ничего не появляется, поэтому здесь функция,
 * а не договорённость.
 */
export const singleNode = (value) => (Array.isArray(value) ? null : value);

/** Каких локалей не хватает в узле. Пустая строка считается отсутствующей. */
export const missingLocalesIn = (node) => {
  if (!isLocalizedNode(node)) return LOCALES.slice();
  return LOCALES.filter((l) => typeof node[l] !== 'string' || node[l].trim() === '');
};

/**
 * Достаёт текст нужной локали.
 *
 * Ключевое отличие от прежнего useT: при отсутствии локали НЕ возвращает другой
 * язык молча.
 *
 * @param node   строка, React-элемент или {uz, ru, en}
 * @param lang   'uz' | 'ru' | 'en'
 * @param strict true (по умолчанию для dev/preview) — вернуть видимый маркер,
 *               чтобы пропуск было невозможно не заметить.
 *               false (production) — вернуть запасной текст, но обязательно
 *               сообщить через onMissing: пропуск попадёт в логи, а не растворится.
 * @param onMissing колбэк ({ lang, node, used }) — вызывается при каждом пропуске.
 */
export const localize = (node, lang, { strict = true, onMissing = null } = {}) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return stripAudioTags(node);
  // React-элемент отдаём как есть: перевод внутри него уже сделан автором.
  if (typeof node === 'object' && node.$$typeof) return node;
  if (!LOCALES.includes(lang)) lang = 'ru';

  const own = node[lang];
  if (typeof own === 'string' && own.trim() !== '') return stripAudioTags(own);

  // Локали нет. Выбираем, чем показать пропуск, но НЕ делаем вид, что всё хорошо.
  // Порядок запасного текста задан явно: русский первым, потому что на нём пишет
  // методист и на нём существует почти весь контент — так отладка понятнее.
  const fallbackLang = FALLBACK_ORDER.find((l) => l !== lang && typeof node[l] === 'string' && node[l].trim() !== '');
  const fallbackText = fallbackLang ? stripAudioTags(node[fallbackLang]) : '';

  if (onMissing) onMissing({ lang, node, used: fallbackLang || null });

  if (strict) {
    // Видимый маркер: заметен и на экране, и на скриншоте QA.
    return fallbackText ? `⟨${lang}?⟩ ${fallbackText}` : `⟨${lang}?⟩`;
  }
  return fallbackText;
};

/**
 * Готовая функция перевода для одного языка — то, чем станет useT.
 * В kit/infra.jsx хук возьмёт lang из LangContext и вернёт makeT(lang, opts).
 */
export const makeT = (lang, opts = {}) => (node) => localize(node, lang, opts);

/**
 * Собрать все пропуски локалей в дереве данных урока.
 * Для scripts/validate-grade3.mjs: пропуск любой локали — ОШИБКА, не предупреждение
 * (ETALON v2 §9.1).
 *
 * @returns массив { path, missing: ['en'] }
 */
export const collectMissingLocales = (data, path = '') => {
  const out = [];
  const walk = (value, at) => {
    if (!value || typeof value !== 'object') return;
    if (value.$$typeof) return;
    if (isLocalizedNode(value)) {
      const missing = missingLocalesIn(value);
      if (missing.length > 0) out.push({ path: at || '(root)', missing });
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, `${at}[${i}]`));
      return;
    }
    for (const [k, v] of Object.entries(value)) walk(v, at ? `${at}.${k}` : k);
  };
  walk(data, path);
  return out;
};
