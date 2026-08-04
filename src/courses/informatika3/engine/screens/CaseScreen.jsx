// ============================================================================
// grade3/screens/CaseScreen.jsx — ЖИЗНЕННАЯ ЗАДАЧА (роль life_problem)
//
// Математика решает настоящую проблему сюжета, а не изображает её.
//
// Проверка подлинности (ETALON v1 §5, v2 §1.1): если убрать реквизит и задание
// не изменится — интеграция сюжета недостаточна. Задача должна быть про то, что
// нужно Bit'у и экипажу, а не «текстовая задача с космическими словами».
//
// Ответ НАБИРАЕТСЯ, а не выбирается: узнать число среди вариантов легче, чем его
// получить. Веди-до-верного плюс эскалация подсказки (§6.2), потому что здесь
// ребёнок вводит число сам.
// ============================================================================

import { useState, useRef, useEffect } from 'react';
import {
  Stage, NavBack, NavNext, NumPad, FeedbackBlock, Reaction,
  useAudio, useLang, useT, useCanAnswer, useAdvanceGate, useRevealScroll,
  useSfx, makeAutoSegments, getAudioEngine, HINT_ESCALATION, singleNode,
} from '../kit/index.js';
import { renderVisual } from './visuals.jsx';

const CHECK = { uz: 'Tekshirish', ru: 'Проверить', en: 'Check' };

export default function CaseScreen({
  screen, meta, index, totalScreens, scenes, storedAnswer, onAnswer, onNext, onPrev,
}) {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();

  const audio = useAudio(makeAutoSegments(screen.audio?.intro?.[lang] || [], meta.id));
  const canAnswer = useCanAnswer(audio);

  const restored = storedAnswer !== undefined;
  const [typed, setTyped] = useState(restored ? String(storedAnswer.studentAnswer ?? '') : '');
  const [solved, setSolved] = useState(restored ? storedAnswer.correct === true : false);
  const [wrongCount, setWrongCount] = useState(0);
  const [hint, setHint] = useState(null);
  const firstTryRef = useRef(restored ? storedAnswer.firstTry : null);
  const recordedRef = useRef(restored);

  const revealRef = useRevealScroll(solved || hint !== null, 400);

  const speak = (node) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(t(node));
  };

  useEffect(() => {
    if (!solved || recordedRef.current) return;
    recordedRef.current = true;
    onAnswer({
      stage: meta.scope,
      screenIdx: index,
      question: t(screen.q),
      correctAnswer: String(screen.answer),
      studentAnswer: Number(typed),
      correct: firstTryRef.current === true,
      firstTry: firstTryRef.current === true,
      attempts: wrongCount + 1,
      solved: true,
    });
  }, [solved, index, meta.scope, onAnswer, screen.answer, screen.q, t, typed, wrongCount]);

  const check = () => {
    if (!canAnswer || typed === '' || solved) return;
    const ok = Number(typed) === screen.answer;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    if (ok) {
      setSolved(true);
      setHint(null);
      sfx.playCorrect();
      speak(screen.audio?.on_correct);
      return;
    }
    const w = wrongCount + 1;
    setWrongCount(w);
    sfx.playWrong();
    // Эскалация: концепт -> первый шаг -> разобранный первый шаг (§6.2).
    // Готовый ответ не даётся ни на одной ступени.
    const steps = screen.escalation || [];
    const step = steps[Math.min(w, steps.length) - 1] || singleNode(screen.audio?.on_wrong);
    setHint(step || null);
    speak(step);
    setTyped('');
  };

  const canAdvance = useAdvanceGate(solved, audio);
  const strongShown = wrongCount >= HINT_ESCALATION.steps.length;

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
        <h1 className="title h-sub fade-up">{t(screen.lead)}</h1>

        {/* Условие задачи — то, что нужно героям. Без него задание рассыпается. */}
        {screen.context && (
          <div className="frame-soft fade-up">
            <p style={{ margin: 0, fontWeight: 600 }}>{t(screen.context)}</p>
          </div>
        )}

        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)' }}>
          {renderVisual(screen.visual, { scenes, labels: screen.placeLabels?.[lang] || screen.placeLabels })}

          <p style={{ textAlign: 'center', fontWeight: 700, margin: 0 }}>{t(screen.q)}</p>

          <NumPad
            value={typed}
            setValue={setTyped}
            disabled={!canAnswer || solved}
            max={String(screen.answer ?? '').length || 3}
          />
          <button
            className="btn-white-accent"
            disabled={!canAnswer || typed === '' || solved}
            onClick={check}
            style={{ padding: 'clamp(10px,1.7vw,12px) clamp(20px,2.5vw,27px)', fontSize: 'clamp(12px,1.5vw,14px)' }}
          >
            {CHECK[lang] || CHECK.ru}
          </button>
        </div>

        <FeedbackBlock show={hint !== null && !solved} isCorrect={false} wrongClass="frame-tip">
          <div>
            <Reaction state="wrong" praise={t(hint)}/>
            {strongShown && screen.strongHint && (
              <p className="mono" style={{ marginTop: 8, fontWeight: 700 }}>{t(screen.strongHint)}</p>
            )}
          </div>
        </FeedbackBlock>

        {solved && (
          <div ref={revealRef} className="frame-success lm-riseup">
            <Reaction state="correct" praise={t(screen.audio?.on_correct)}/>
          </div>
        )}

        {solved && screen.fact && (
          <div className="d2-factcard fade-up">
            <span className="d2-factcard-badge mono">{t(screen.factBadge)}</span>
            <p className="d2-factcard-txt">{t(screen.fact)}</p>
          </div>
        )}
      </div>
    </Stage>
  );
}
