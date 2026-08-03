// ============================================================================
// grade3/screens/TestScreen.jsx — ЭКРАН УПРАЖНЕНИЯ
//
// 5 из 15 экранов урока: guided_practice, independent_practice, error_find,
// reverse_task, final_diagnostic. Самый нагруженный правилами экран эталона.
//
// Что здесь реализовано, и почему именно так:
//
// §1   ТРИ РАУНДА с разными числами. Один пример ничего не доказывает: ребёнок
//      может угадать. Три подряд показывают, что способ понят.
//
// §1   ВЕДИ-ДО-ВЕРНОГО. Следующий раунд не открывается, пока ответ неверен.
//      Пройти мимо непонятого нельзя.
//
// §4.3 ПОЗИЦИЯ ВЕРНОГО ОТВЕТА приходит извне (answerPositionFor) — раскладка
//      посчитана на весь урок сразу. Экран не решает сам: он не знает, где был
//      верный ответ в предыдущем вопросе.
//
// §6.1 ПОРЯДОК ОБРАТНОЙ СВЯЗИ. Верный вариант подсвечивается, ребёнок 1100 мс
//      его ВИДИТ, только потом варианты гаснут и открывается следующий раунд.
//      Гасить сразу нельзя: исчезает главная обратная связь.
//
// §6.1 BIT ВЫХОДИТ И НА ВЕРНОМ, И НА НЕВЕРНОМ (решение методиста 2026-08-03).
//
// §6.2 ЭСКАЛАЦИЯ ПОДСКАЗКИ — только там, где ребёнок вводит число сам. После
//      третьей неверной попытки даётся сильная подсказка: разобранный первый шаг,
//      завершение оставлено ребёнку. Готовый ответ не даётся никогда, но и
//      застрять нельзя — балл за такой раунд не начисляется.
//
// §9   На каждый неверный вариант — СВОЙ разбор, он озвучивается.
//
// §10  Балл только за ответ с ПЕРВОЙ попытки. При возврате экран восстанавливается
//      из storedAnswer и не переигрывается.
// ============================================================================

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Stage, NavBack, NavNext, OptionButton, NumPad, FeedbackBlock, FrameFx, Reaction,
  useAudio, useLang, useT, useCanAnswer, useAdvanceGate, useRevealScroll,
  makeAutoSegments, getAudioEngine, remapToPosition, needsHintEscalation,
  HINT_ESCALATION, FEEDBACK_FLOW, useCorrectRevealThenFade, nextPraise,
} from '../kit/index.js';
import { renderVisual } from './visuals.jsx';

const ROUND_COPY = {
  check: { uz: 'Tekshirish', ru: 'Проверить', en: 'Check' },
  hint: { uz: 'Yordam', ru: 'Подсказка', en: 'Hint' },
};

export default function TestScreen({
  screen, meta, index, totalScreens, scenes,
  answerPositionFor, storedAnswer, onAnswer, onNext, onPrev,
}) {
  const lang = useLang();
  const t = useT();

  // useMemo: без него `screen.rounds || []` даёт новый массив каждый рендер,
  // и зависящие от него эффекты перезапускаются вечно.
  const rounds = useMemo(() => screen.rounds || [], [screen.rounds]);
  const isNumeric = needsHintEscalation(screen.interaction);

  // Уже пройденный экран не переигрывается (§10).
  const restored = storedAnswer !== undefined;
  const [roundIdx, setRoundIdx] = useState(restored ? rounds.length : 0);
  const [score, setScore] = useState(restored ? (storedAnswer.studentAnswer | 0) : 0);
  const firstTryAllRef = useRef(restored ? storedAnswer.firstTry : true);
  const recordedRef = useRef(restored);

  const done = roundIdx >= rounds.length;
  const round = rounds[roundIdx];

  // Раскладка вариантов: позиция верного приходит из плана на весь урок (§4.3).
  const laid = useMemo(() => {
    if (!round || !round.options) return null;
    const target = answerPositionFor(index, roundIdx);
    return remapToPosition(round.options, round.correct, target, {
      hints: round.hints || [],
      wrongAudio: round.audio?.on_wrong || [],
    });
  }, [round, answerPositionFor, index, roundIdx]);

  const audio = useAudio(
    round ? makeAutoSegments([round.audio?.intro?.[lang]].filter(Boolean), `${meta.id}_r${roundIdx}`) : [],
  );
  const canAnswer = useCanAnswer(audio);

  // --- состояние одного раунда ---------------------------------------------
  const [picked, setPicked] = useState(null);      // выбранный неверный вариант (MC)
  const [okIdx, setOkIdx] = useState(null);        // верный вариант остаётся зелёным
  const [typed, setTyped] = useState('');          // набранное число
  const [wrongCount, setWrongCount] = useState(0);
  const [hintText, setHintText] = useState(null);

  // Признак «раунд решён» — это okIdx !== null, и только он. Отдельной переменной
  // для этого не держим: в исходных уроках такие дубли и дают 10 175 неиспользуемых
  // объявлений по проекту.
  const { fading, gone } = useCorrectRevealThenFade(okIdx !== null);
  const revealRef = useRevealScroll(okIdx !== null || hintText !== null, 400);

  const speak = useCallback((node) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(t(node));
  }, [audio.muted, t]);

  // Переход к следующему раунду — после того, как ребёнок увидел верный вариант.
  useEffect(() => {
    if (!gone) return undefined;
    const id = setTimeout(() => {
      setOkIdx(null);
      setPicked(null);
      setTyped('');
      setWrongCount(0);
      setHintText(null);
      setRoundIdx((n) => n + 1);
    }, 0);
    return () => clearTimeout(id);
  }, [gone]);

  // Итог экрана уходит в оценивание один раз (§10).
  useEffect(() => {
    if (!done || recordedRef.current) return;
    recordedRef.current = true;
    speak(screen.doneText);
    onAnswer({
      stage: meta.scope,
      screenIdx: index,
      question: t(rounds[0]?.q),
      correctAnswer: String(rounds.length),
      studentAnswer: score,
      correct: firstTryAllRef.current,
      firstTry: firstTryAllRef.current,
      attempts: 1,
      solved: true,
    });
  }, [done, score, index, meta.scope, onAnswer, rounds, t, speak, screen.doneText]);

  const registerWrong = (nextWrong) => {
    firstTryAllRef.current = false;
    setWrongCount(nextWrong);
  };

  const pickOption = (i) => {
    if (!canAnswer || okIdx !== null) return;
    if (i === laid.correctIdx) {
      if (wrongCount === 0) setScore((s) => s + 1);
      setOkIdx(i);
      setHintText(null);
      speak(round.audio?.on_correct || { uz: nextPraise('uz'), ru: nextPraise('ru'), en: nextPraise('en') });
      return;
    }
    setPicked(i);
    const w = wrongCount + 1;
    registerWrong(w);
    // Разбор именно этого варианта, а не общий (§9).
    const own = laid.parallel.hints?.[i] || laid.parallel.wrongAudio?.[i] || round.audio?.on_wrong;
    setHintText(own || null);
    speak(own);
  };

  const checkTyped = () => {
    if (!canAnswer || typed === '' || okIdx !== null) return;
    if (Number(typed) === round.answer) {
      if (wrongCount === 0) setScore((s) => s + 1);
      setOkIdx(0);   // для числового ввода индекс не нужен, важен сам факт
      setHintText(null);
      speak(round.audio?.on_correct);
      return;
    }
    const w = wrongCount + 1;
    registerWrong(w);
    // Эскалация: 1 — концепт, 2 — первый шаг, 3 — разобранный первый шаг (§6.2).
    const steps = round.escalation || [];
    const step = steps[Math.min(w, steps.length) - 1] || round.audio?.on_wrong;
    setHintText(step || null);
    speak(step);
    setTyped('');
  };

  const strongHintShown = isNumeric && wrongCount >= HINT_ESCALATION.steps.length;
  const canAdvance = useAdvanceGate(done, audio);

  return (
    <Stage
      eyebrow={screen.eyebrow}
      screen={index}
      totalScreens={totalScreens}
      screenMeta={meta}
      audioState={audio}
      navContent={(
        <>
          {index > 0 && <NavBack onPrev={onPrev}/>}
          <NavNext disabled={!canAdvance} onClick={onNext}/>
        </>
      )}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {!done && round && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', fontWeight: 800 }}>
              {roundIdx + 1} / {rounds.length}
            </div>
            <h1 className="title h-sub fade-up">{t(round.q)}</h1>

            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)' }}>
              <FrameFx/>
              <div className="grade3-question-figure">
                {renderVisual(round.visual, { scenes, labels: screen.placeLabels })}
              </div>

              {laid && (
                <div className="grade3-answer-grid" style={{ '--answer-cols': screen.optionCols || 2 }}>
                  {laid.options.map((o, i) => (
                    <OptionButton
                      key={i}
                      state={okIdx === i ? 'correct' : picked === i ? 'wrong' : 'idle'}
                      disabled={!canAnswer || okIdx !== null}
                      fading={fading}
                      onClick={() => pickOption(i)}
                    >
                      {t(o)}
                    </OptionButton>
                  ))}
                </div>
              )}

              {isNumeric && (
                <>
                  <NumPad
                    value={typed}
                    setValue={setTyped}
                    disabled={!canAnswer || okIdx !== null}
                    max={String(round.answer ?? '').length || 3}
                  />
                  <button
                    className="btn-white-accent"
                    disabled={!canAnswer || typed === '' || okIdx !== null}
                    onClick={checkTyped}
                    style={{ padding: 'clamp(10px,1.7vw,12px) clamp(20px,2.5vw,27px)', fontSize: 'clamp(12px,1.5vw,14px)' }}
                  >
                    {ROUND_COPY.check[lang] || ROUND_COPY.check.ru}
                  </button>
                </>
              )}
            </div>

            {/* Разбор: свой на каждый неверный вариант. Bit выходит и здесь, и на верном. */}
            <FeedbackBlock show={hintText !== null} isCorrect={false} wrongClass="frame-tip">
              <div ref={revealRef}>
                <Reaction state="wrong" praise={t(hintText)}/>
                {strongHintShown && round.strongHint && (
                  <p className="mono" style={{ marginTop: 8, fontWeight: 700 }}>
                    {ROUND_COPY.hint[lang] || ROUND_COPY.hint.ru}: {t(round.strongHint)}
                  </p>
                )}
              </div>
            </FeedbackBlock>

            {okIdx !== null && (
              <div className="frame-success lm-riseup">
                <Reaction state="correct" praise={t(round.audio?.on_correct)}/>
              </div>
            )}
          </>
        )}

        {done && (
          <div className="frame-success lm-riseup">
            <Reaction state="correct" praise={t(screen.doneText)}/>
          </div>
        )}
      </div>
    </Stage>
  );
}

export { FEEDBACK_FLOW };
