/* eslint-disable react-refresh/only-export-components */
// ============================================================================
// grade3/screens/LessonShell.jsx — КОРЕНЬ УРОКА
//
// Единственное место, где урок соединяется с платформой. Экраны о платформе не
// знают ничего: они получают данные и колбэки.
//
// Чем отличается от того, как это было в уроках 1–8 классов:
//   1. Нет глобалей. SCREEN_META, LESSON_META и CONTENT были переменными модуля
//      внутри файла урока — из-за этого ни один экран нельзя было переиспользовать.
//      Здесь всё приходит пропом lesson.
//   2. Раскладка ответов считается ОДИН РАЗ на урок (makeAnswerLayout) и раздаётся
//      экранам. Иначе правило «позиция верного не повторяется» невыполнимо:
//      отдельный экран не знает позицию предыдущего вопроса (ETALON v2 §4.3).
//   3. LumoDefs монтируется здесь и только здесь. Забыть его — значит получить
//      чёрные огоньки вместо светящихся: градиент lmGlow объявлен в нём.
//   4. NavUnlockContext: на уже пройденном экране не ждать озвучку заново (§10).
// ============================================================================

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  configureLesson, LangContext, ProgressContext, NavUnlockContext,
  LumoDefs, HeroContext, StageHero, makeAnswerLayout,
  ROLES, roleDef, rolesOf, estimateLessonSeconds, TIMING,
} from '../kit/index.js';
import '../kit/styles.css';

/** Метаданные экрана выводятся из данных урока, а не из отдельной таблицы. */
export const screenMetaOf = (screen, index) => {
  const roles = rolesOf(screen);
  const defs = roles.map(roleDef).filter(Boolean);
  const type = screen.type || defs[0]?.type || 'exploration';
  const scored = screen.scored ?? defs.some((d) => d.scored);
  const scope = screen.scope
    || (roles.includes('final_diagnostic') || roles.includes('summary') ? 'final'
      : roles.includes('problem') ? 'hook'
        : scored ? 'practice' : null);
  return { id: screen.id || `s${index}`, type, roles, scored, scope };
};

/** Предупреждения о нарушениях контракта — в консоль при загрузке урока (только preview). */
const warnContract = (lesson, metas) => {
  const n = metas.length;
  if (n < 15 || n > 16) {
    console.warn(`[LessonShell] экранов ${n}; эталон требует 15–16 (§1)`);
  }
  const est = estimateLessonSeconds(metas);
  if (est > TIMING.lessonSeconds) {
    console.warn(`[LessonShell] расчётная длительность ${est} с превышает ${TIMING.lessonSeconds} с (§1.2)`);
  }
  const covered = new Set(metas.flatMap((m) => m.roles));
  const missing = ROLES.filter((r) => r.required && !covered.has(r.key)).map((r) => r.key);
  if (missing.length) {
    console.warn(`[LessonShell] не покрыты обязательные роли: ${missing.join(', ')} (§1)`);
  }
  if (!lesson.scenes || Object.keys(lesson.scenes).length === 0) {
    console.warn('[LessonShell] у урока нет ни одной сцены; §1.3 требует сцену-обрамление');
  }
};

/**
 * Выбор компонента экрана: сначала по роли, потом по техническому типу.
 * Реестр, а не render-prop: render-prop означал бы вызов чужой функции во время
 * рендера, что React запрещает (react-hooks/refs) — и это правило по делу,
 * потому что такая функция может читать ref и давать нестабильный результат.
 */
const pickScreen = (meta, components) => {
  for (const role of meta.roles) if (components[role]) return components[role];
  return components[meta.type] || null;
};

/**
 * @param lesson     { id, title:{uz,ru,en}, screens:[...], scenes:{Имя:Компонент} }
 * @param components реестр экранов: ключ — роль или тип, значение — компонент
 */
export default function LessonShell({
  lesson,
  components = {},
  // props платформы
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  // Платформа не передала lang — значит это локальный просмотр, показываем переключатель.
  const isPreviewMode = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;

  // useMemo вокруг `lesson.screens || []`: без него выражение даёт новый массив
  // на каждый рендер, и все зависящие от него useMemo пересчитываются вечно —
  // в том числе раскладка ответов, которая должна считаться РОВНО ОДИН РАЗ.
  const screens = useMemo(() => lesson.screens || [], [lesson.screens]);
  const metas = useMemo(() => screens.map(screenMetaOf), [screens]);

  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '',
    studentName: studentName || (lang === 'uz' ? "O'quvchi" : lang === 'en' ? 'Student' : 'Ученик'),
    voiceGender: voiceGender || 'f',
  });

  useEffect(() => { if (isPreviewMode) warnContract(lesson, metas); }, [isPreviewMode, lesson, metas]);

  // --- раскладка вариантов: ОДИН раз на урок (§4.3) --------------------------
  const answerLayout = useMemo(() => makeAnswerLayout(screens), [screens]);

  // --- навигация ------------------------------------------------------------
  const [current, setCurrent] = useState(0);
  // maxReached двигается только в обработчике «дальше», а не в эффекте: вперёд
  // экран продвигает ребёнок, и это событие, а не побочный эффект рендера.
  const [maxReached, setMaxReached] = useState(0);
  const navUnlocked = current < maxReached;

  // --- ответы и оценивание --------------------------------------------------
  const [answers, setAnswers] = useState([]);
  // Время старта ставим в эффекте, а не при рендере: Date.now() во время рендера —
  // нечистый вызов, и React справедливо это запрещает (react-hooks/purity).
  const startedAtRef = useRef(0);
  const finishedRef = useRef(false);
  useEffect(() => { startedAtRef.current = Date.now(); }, []);

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers((prev) => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const stars = answers.filter((a, i) => a && metas[i]?.scored && a.correct).length;
  const starTotal = metas.filter((m) => m.scored).length;

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const scored = metas.filter((m) => m.scored);
    const finals = metas.filter((m) => m.scored && m.scope === 'final');
    const correctCount = answers.filter((a, i) => a && metas[i]?.scored && a.correct).length;
    const finalCorrect = answers.filter((a, i) => a && metas[i]?.scored && metas[i]?.scope === 'final' && a.correct).length;
    const checked = answers.filter((a) => a && typeof a.firstTry === 'boolean');
    const payload = {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      durationSec: Math.floor((Date.now() - startedAtRef.current) / 1000),
      totalQuestions: scored.length,
      correctAnswers: correctCount,
      scorePercent: scored.length > 0 ? Math.round((correctCount / scored.length) * 100) : 0,
      finalScore: finalCorrect,
      finalTotal: finals.length,
      // Порог 60% считается по экранам scope:'final' — итоговая диагностика важнее
      // тренировочных попыток (§10).
      passed: finals.length > 0
        ? finalCorrect / finals.length >= 0.6
        : (scored.length > 0 ? correctCount / scored.length >= 0.6 : false),
      firstTryStats: {
        total: checked.length,
        firstTryCorrect: checked.filter((a) => a.firstTry === true).length,
      },
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.info('[preview] onFinished:', payload);
  }, [answers, metas, lesson, onFinished]);

  const reset = useCallback(() => {
    setAnswers([]);
    setCurrent(0);
    setMaxReached(0);
    startedAtRef.current = Date.now();
    finishedRef.current = false;
  }, []);

  // --- персонаж-overlay ----------------------------------------------------
  const [heroMood, setHeroMood] = useState('present');
  const heroCtx = useMemo(() => ({ setMood: setHeroMood }), []);

  const next = useCallback(() => {
    setCurrent((c) => {
      const n = Math.min(c + 1, screens.length - 1);
      setMaxReached((v) => Math.max(v, n));
      return n;
    });
  }, [screens.length]);
  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);

  const handleAnswer = useCallback((data) => recordAnswer(current, data), [recordAnswer, current]);

  const screen = screens[current];
  const meta = metas[current];
  // Компонент экрана выбирается по роли из реестра, переданного уроком. Ссылка
  // стабильна: реестр и meta не меняются между рендерами одного экрана.
  const ScreenComponent = useMemo(
    () => (meta ? pickScreen(meta, components) : null),
    [meta, components],
  );
  if (!screen) return null;

  return (
    <LangContext.Provider value={lang}>
      <ProgressContext.Provider value={{ stars, total: starTotal }}>
        <HeroContext.Provider value={heroCtx}>
          {/* Градиенты Lumo — один раз на урок. Без этого блока все огоньки чёрные. */}
          <LumoDefs/>
          <NavUnlockContext.Provider value={navUnlocked}>
            <div className="lesson-root">
              {isPreviewMode && (
                <div style={{ position: 'fixed', top: 8, right: 8, zIndex: 50, display: 'flex', gap: 6 }}>
                  {['uz', 'ru', 'en'].map((l) => (
                    <button
                      key={l}
                      className={l === lang ? 'btn-white-accent' : 'btn-ghost'}
                      style={{ padding: '4px 10px', fontSize: 12, minHeight: 0 }}
                      onClick={() => setPreviewLang(l)}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
              {ScreenComponent ? (
                /* react-hooks/static-components здесь ошибается: правило — эвристика,
                   оно не различает «динамическую диспетчеризацию по роли» и «создание
                   нового компонента на каждом рендере». Пробовал три обхода (прямой
                   доступ к полю реестра, useMemo, предвычисление в metas) — правило
                   срабатывает на любую непрямую ссылку. Состояние экрана не сбрасывается:
                   все компоненты объявлены на уровне модуля, pickScreen лишь выбирает
                   один из них по роли. */
                // eslint-disable-next-line react-hooks/static-components
                <ScreenComponent
                  screen={screen}
                  meta={meta}
                  index={current}
                  totalScreens={screens.length}
                  scenes={lesson.scenes || {}}
                  answerPositionFor={answerLayout.positionFor}
                  storedAnswer={answers[current]}
                  onAnswer={handleAnswer}
                  onNext={next}
                  onPrev={prev}
                  onReset={reset}
                  finishLesson={finishLesson}
                  isLast={current === screens.length - 1}
                />
              ) : (
                <div className="frame-tip" style={{ margin: 24 }}>
                  <span className="mono">
                    ⟨нет компонента для роли {meta.roles.join(', ') || meta.type}⟩
                  </span>
                </div>
              )}
              <StageHero mood={heroMood}/>
            </div>
          </NavUnlockContext.Provider>
        </HeroContext.Provider>
      </ProgressContext.Provider>
    </LangContext.Provider>
  );
}
