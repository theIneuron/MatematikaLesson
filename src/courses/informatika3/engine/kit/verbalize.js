// ============================================================================
// grade3/kit/verbalize.js — ЕДИНСТВЕННЫЙ ПУТЬ ТЕКСТ → РЕЧЬ
//
// Заменяет toSpeechText из Dars19.jsx, который заменял × : = на слова, но
// ПРОПУСКАЛ в озвучку ──── ✗ +. Проверено на настоящих данных Dars22: в TTS уходило
//     "24 ko'paytirish 13 ──── 72 240 ──── 312"
//
// Ключевое решение (ETALON v2 §9): запрещённые символы — ОШИБКА НА ЭТАПЕ КОНТЕНТА,
// а не автозамена во время воспроизведения.
//
// Почему не автозамена. Автозамена выглядит удобной и потому опасна: она прячет
// проблему. Автор не узнаёт, что написал «=» вместо «teng», урок звучит приемлемо
// на знакомых символах и ломается на незнакомых — ровно так и появилось «────» в
// голосе. Ошибка же заставляет написать фразу человеческим языком один раз.
//
// Здесь нет ни одной таблицы автозамены. Есть таблица СПРАВОЧНАЯ: чем заменить
// символ, когда валидатор на него указал.
//
// Чистый модуль: без React, проверяется тестом.
// ============================================================================

import { FORBIDDEN_IN_SPEECH, WARN_IN_SPEECH, TIMING } from './schema.js';
import { stripAudioTags } from './i18n.js';

// ---------------------------------------------------------------------------
// СПРАВОЧНИК: чем заменить символ. НЕ используется для автозамены — только для
// текста ошибки валидатора и как подсказка автору.
// ---------------------------------------------------------------------------
export const SPEECH_WORDS = {
  '×': { uz: "ko'paytirish", ru: 'умножить на', en: 'times' },
  ':': { uz: "bo'lish", ru: 'разделить на', en: 'divided by' },
  '÷': { uz: "bo'lish", ru: 'разделить на', en: 'divided by' },
  '=': { uz: 'teng', ru: 'равно', en: 'equals' },
  '>': { uz: 'katta', ru: 'больше', en: 'greater than' },
  '<': { uz: 'kichik', ru: 'меньше', en: 'less than' },
  '+': { uz: "qo'shuv", ru: 'плюс', en: 'plus' },
  '−': { uz: 'minus', ru: 'минус', en: 'minus' },
  '%': { uz: 'foiz', ru: 'процент', en: 'percent' },
  '1/2': { uz: 'bir ikkidan', ru: 'одна вторая', en: 'one half' },
  '1/3': { uz: 'bir uchdan', ru: 'одна третья', en: 'one third' },
  '1/4': { uz: 'bir to\'rtdan', ru: 'одна четвёртая', en: 'one quarter' },
};

/** Подсказка «чем заменить» для сообщения об ошибке. */
export const suggestWord = (symbol, lang = 'ru') => {
  const e = SPEECH_WORDS[symbol];
  return e ? (e[lang] || e.ru) : null;
};

// ---------------------------------------------------------------------------
// ПРОВЕРКИ
//
// Две степени строгости, и это не произвол — обе откалиброваны измерением по
// 19 эталонным урокам 3 класса:
//
//   error — запрещённые символы. Их в эталонных уроках нет вообще.
//   warn  — цифра в озвучке. Найдена в 16 сегментах из 2056, то есть 1%: норма —
//           слова, но цифра иногда осмысленна («1-sinfdan», «305»), поэтому это
//           повод посмотреть, а не блокировать.
//   warn  — длинный сегмент. Медиана 11 слов, 95% <= 20, длиннее 30 — лишь 2%.
//           Порог 18 слов: дальше почти всегда две мысли в одном сегменте.
// ---------------------------------------------------------------------------

const DIGIT_RE = /\d/;

/**
 * Полная проверка одной реплики.
 *
 * @param strictStyle Строгость к спорным символам (сейчас это длинное тире).
 *   true  — для НОВОГО контента: тире становится ошибкой.
 *   false — для существующих уроков: предупреждение.
 *
 * Почему по-разному. Тире даёт в озвучке паузу, и ту же паузу даёт запятая. Как
 * боевой TTS обрабатывает «—», в проекте не проверено. Зато проверено другое:
 * во 2 классе тире из озвучки вычистили целиком — 0 на 3806 сегментов в 39 файлах,
 * заменив запятой в той же конструкции («Bugungi dars mavzusi — …» -> «Bugungi dars
 * mavzusi, …»). До 1, 3 и 5 классов эта правка не дошла.
 *
 * Отсюда разная строгость: писать новый текст без тире стоит НОЛЬ, поэтому там
 * ошибка. Переписать 203 существующих сегмента в 14 уроках стоит дорого, и по
 * решению методиста эти уроки не трогаем — поэтому там предупреждение.
 *
 * @returns { errors: [{code, name, why, suggest}], warnings: [{code, detail}] }
 */
export const checkSpeech = (text, lang = 'ru', { strictStyle = false } = {}) => {
  const s = String(text || '');
  const errors = [];
  const warnings = [];

  for (const { name, re, why } of FORBIDDEN_IN_SPEECH) {
    const m = re.exec(s);
    if (!m) continue;
    errors.push({
      code: 'forbidden_symbol',
      name,
      why,
      found: m[0],
      suggest: suggestWord(m[0], lang),
    });
  }

  for (const { name, re, why } of WARN_IN_SPEECH) {
    const m = re.exec(s);
    if (!m) continue;
    if (strictStyle) {
      errors.push({
        code: 'style_symbol',
        name,
        why: `${why}. В новом контенте не используется: ту же паузу даёт запятая`,
        found: m[0],
        suggest: lang === 'uz' ? 'vergul' : lang === 'en' ? 'comma' : 'запятая',
      });
    } else {
      warnings.push({ code: 'speech_style', detail: `${name}: ${why}` });
    }
  }

  if (DIGIT_RE.test(s)) {
    warnings.push({
      code: 'digits_in_speech',
      detail: 'цифра в озвучке; в эталонных уроках это 1% сегментов — норма писать словами',
    });
  }

  const words = s.split(/\s+/).filter(Boolean).length;
  if (words > TIMING.wordsPerSegment[1]) {
    warnings.push({
      code: 'segment_too_long',
      detail: `${words} слов; измеренная норма ${TIMING.wordsPerSegment[0]}–${TIMING.wordsPerSegment[1]}, `
        + 'дальше почти всегда две мысли — раздели сегмент',
    });
  }

  return { errors, warnings };
};

/** Есть ли в реплике то, что запрещено. Для нового контента — со строгим стилем. */
export const isSpeakable = (text, opts) => checkSpeech(text, 'ru', opts).errors.length === 0;

/**
 * Подготовка реплики к отправке в TTS.
 *
 * Ничего не «исправляет»: снимает языковые теги (они для сервера, не для голоса)
 * и приводит пробелы. Если контент чистый — работа тривиальна, и так и должно быть.
 *
 * @param strict true (dev/preview) — при запрещённом символе БРОСАЕТ, чтобы автор
 *               увидел проблему сразу. false (production) — отдаёт как есть и
 *               сообщает через onIssue: ронять урок ребёнку под нос нельзя, но и
 *               молчать нельзя.
 */
export const toSpeech = (text, { lang = 'ru', strict = false, strictStyle = false, onIssue = null } = {}) => {
  const clean = stripAudioTags(String(text || '')).replace(/\s{2,}/g, ' ').trim();
  const { errors, warnings } = checkSpeech(clean, lang, { strictStyle });
  if (onIssue && (errors.length || warnings.length)) onIssue({ text: clean, errors, warnings });
  if (strict && errors.length) {
    const first = errors[0];
    throw new Error(
      `[verbalize] в озвучку попал запрещённый символ: ${first.name} (${JSON.stringify(first.found)}). `
      + `${first.why}${first.suggest ? `. Напиши словами: «${first.suggest}»` : ''}. Реплика: «${clean}»`,
    );
  }
  return clean;
};

/**
 * Проверка всех реплик урока. Для scripts/validate-grade3.mjs.
 * @param segments массив { path, text, lang }
 * @param strictStyle true для нового контента (см. checkSpeech)
 */
export const checkAllSpeech = (segments, { strictStyle = false } = {}) => {
  const out = [];
  for (const seg of segments || []) {
    const r = checkSpeech(seg.text, seg.lang, { strictStyle });
    if (r.errors.length || r.warnings.length) out.push({ path: seg.path, ...r });
  }
  return out;
};
