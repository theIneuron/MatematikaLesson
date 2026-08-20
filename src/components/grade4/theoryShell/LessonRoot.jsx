// Dars ildizi: til, javoblar, faoliyat holati va yakuniy natija payloadi.
import { useCallback, useMemo, useRef, useState } from 'react';
import { useGrade4MobileZoom } from '../mobileZoom.js';
import {
  ActivityContext, LangContext, LessonContext, SUPPORTED_LANGS,
  configureTheoryRuntime, normalizeLang,
} from './runtime.js';

export function TheoryLessonRoot({
  lessonMeta, screenMeta, totalScreens, frameCounts, content, screens, styles,
  studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl,
  onFinished, previewMode,
}) {
  const showPreviewControls = langProp === undefined || langProp === null;
  const preview = previewMode ?? showPreviewControls;
  const [previewLang, setPreviewLang] = useState(normalizeLang(langProp));
  const lang = showPreviewControls ? previewLang : normalizeLang(langProp);

  configureTheoryRuntime({
    ttsApiBase: ttsApiBase || '',
    voiceGender: voiceGender || 'f',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    previewMode: preview,
  });

  // Maket 390 px kenglikda tuzilgan va butunlay masshtablanadi (ETALON §10).
  useGrade4MobileZoom({ fitHeight: false });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [activityState, setActivityState] = useState({});
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started = useRef(Date.now());
  const finished = useRef(false);

  const markActivity = useCallback((screen, value = true) => setActivityState((previous) => (
    Object.prototype.hasOwnProperty.call(previous, screen) && previous[screen] === value
      ? previous
      : { ...previous, [screen]: value }
  )), []);

  const recordAnswer = useCallback((answer) => {
    setAnswers((previous) => {
      const next = [...previous];
      const old = previous[answer.screenIdx];
      next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry };
      return next;
    });
    if (!screenMeta[answer.screenIdx].scored || answer.correct) {
      markActivity(answer.screenIdx, answer.studentAnswerIndex ?? true);
    }
  }, [markActivity, screenMeta]);

  const finishLesson = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const scored = screenMeta.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null);
    const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length;
    const payload = {
      lessonId: lessonMeta.lessonId,
      lessonTitle: lessonMeta.lessonTitle[lang],
      studentName: studentName || null,
      durationSec: Math.floor((Date.now() - started.current) / 1000),
      totalQuestions: scored.length,
      correctAnswers: firstTryCorrect,
      scorePercent: Math.round((firstTryCorrect / scored.length) * 100),
      finalScore: firstTryCorrect,
      finalTotal: scored.length,
      passed: firstTryCorrect / scored.length >= 0.6,
      firstTryStats: { total: scored.length, firstTryCorrect },
      attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0),
      skillTags: lessonMeta.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log(`[Grade4 ${lessonMeta.lessonId} preview]`, payload);
  }, [answers, lang, lessonMeta, onFinished, screenMeta, studentName]);

  const lessonValue = useMemo(() => ({
    lessonId: lessonMeta.lessonId, screenMeta, totalScreens, frameCounts, content,
  }), [content, frameCounts, lessonMeta.lessonId, screenMeta, totalScreens]);

  const Current = screens[current];
  return (
    <LangContext.Provider value={lang}>
      <LessonContext.Provider value={lessonValue}>
        <ActivityContext.Provider value={{ activityState, markActivity }}>
          <style>{styles}</style>
          <div className={`lesson-root ${preview ? 'lesson-root-preview' : ''}`}>
            {showPreviewControls && (
              <div className="preview-language" aria-label={{ uz: 'Dars tili', ru: 'Язык урока', en: 'Lesson language' }[lang]}>
                {SUPPORTED_LANGS.map((code) => (
                  <button
                    type="button"
                    key={code}
                    className={previewLang === code ? 'preview-active' : ''}
                    onClick={() => setPreviewLang(code)}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            <Current
              key={current}
              screen={current}
              storedAnswer={answers[current]}
              answers={answers}
              onAnswer={recordAnswer}
              onPrev={() => setCurrent((value) => Math.max(0, value - 1))}
              onNext={() => setCurrent((value) => Math.min(totalScreens - 1, value + 1))}
              finishLesson={finishLesson}
            />
          </div>
        </ActivityContext.Provider>
      </LessonContext.Provider>
    </LangContext.Provider>
  );
}
