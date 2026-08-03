// ============================================================================
// grade3/screens/HookScreen.jsx — ПРОБЛЕМА И ПРЕДСКАЗАНИЕ (роль problem)
//
// Первый экран урока. Реализует две обязательные вещи эталона:
//
// §3.4 ПРЕДСКАЗАНИЕ ДО АНИМАЦИИ. Ребёнок сначала говорит, как он думает, и только
//      потом мир отвечает. Обратный порядок делает его наблюдателем.
//
// §1.3 СЦЕНА-ОБРАМЛЕНИЕ. Та же сцена стоит на последнем экране, но в состоянии
//      «снято». Здесь она в состоянии «препятствие».
//
// Главное отличие от обычного теста: ВЕРНЫЙ ОТВЕТ НЕ ПОДТВЕРЖДАЕТСЯ СЛОВОМ.
// Он подтверждается тем, что мир меняется — сцена переходит в собранное состояние.
// Ребёнок видит следствие своего решения, а не оценку за него.
//
// Экран НЕ БЛОКИРУЕТСЯ на неверном ответе и НЕ идёт в оценку: это предсказание,
// а не проверка знаний. Ошибиться здесь нормально — урок для этого и нужен.
// ============================================================================

import { useState } from 'react';
import {
  Stage, NavBack, NavNext, OptionButton, FeedbackBlock, Reaction,
  useAudio, useLang, useT, useCanAnswer, useAdvanceGate,
  makeAutoSegments, getAudioEngine, remapToPosition,
} from '../kit/index.js';
import { renderVisual } from './visuals.jsx';

export default function HookScreen({
  screen, meta, index, totalScreens, scenes, answerPositionFor, onNext, onPrev,
}) {
  const lang = useLang();
  const t = useT();

  const audio = useAudio(makeAutoSegments(screen.audio?.intro?.[lang] || [], meta.id));
  const canAnswer = useCanAnswer(audio);

  // Предсказание сбрасывается при возврате на экран: §10 требует, чтобы hook
  // можно было предсказать заново — состояние не восстанавливается из storedAnswer.
  const [picked, setPicked] = useState(null);

  const laid = remapToPosition(
    screen.options || [],
    screen.correct,
    answerPositionFor(index, 0),
    { wrong: screen.audio?.on_wrong || [] },
  );

  const solved = picked !== null && picked === laid.correctIdx;
  const answered = picked !== null;

  const pick = (i) => {
    if (!canAnswer || solved) return;
    setPicked(i);
    if (audio.muted) return;
    const e = getAudioEngine();
    if (!e) return;
    const node = i === laid.correctIdx
      ? screen.audio?.on_correct
      : (laid.parallel.wrong?.[i] || screen.audio?.on_unknown || screen.audio?.on_wrong);
    if (node) e.pushOneOff(t(node));
  };

  const canAdvance = useAdvanceGate(solved, audio);

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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        {screen.topic && (
          <div
            className="fade-up"
            style={{
              alignSelf: 'center', background: '#FFE8E1', color: '#FF4F28', fontWeight: 800,
              fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999,
            }}
          >
            {t(screen.topic)}
          </div>
        )}

        <h1 className="title h-sub fade-up">{t(screen.lead)}</h1>

        {/* Сцена-обрамление: solved переключает её в собранное состояние.
            Это и есть ответ мира на предсказание ребёнка. */}
        <div className="frame fade-up delay-1" style={{ overflow: 'hidden' }}>
          {renderVisual(
            screen.scene ? { type: 'scene', name: screen.scene, props: { gathered: solved } } : screen.visual,
            { scenes },
          )}
        </div>

        <p
          className="fade-up delay-1"
          style={{ textAlign: 'center', fontWeight: 600, fontSize: 'clamp(15px, 2vw, 18px)', margin: 0 }}
        >
          {t(screen.q)}
        </p>

        <div className="grade3-answer-grid fade-up delay-1" style={{ '--answer-cols': screen.optionCols || 3 }}>
          {laid.options.map((o, i) => (
            <OptionButton
              key={i}
              compact
              state={answered && i === laid.correctIdx ? 'correct' : picked === i ? 'wrong' : 'idle'}
              disabled={!canAnswer || solved}
              onClick={() => pick(i)}
            >
              {t(o)}
            </OptionButton>
          ))}
        </div>

        {/* На неверном — мягкая подсказка, экран остаётся открытым. */}
        <FeedbackBlock show={answered && !solved} isCorrect={false} wrongClass="frame-tip">
          <Reaction
            state="wrong"
            praise={t(laid.parallel.wrong?.[picked] || screen.audio?.on_unknown || screen.audio?.on_wrong)}
          />
        </FeedbackBlock>
      </div>
    </Stage>
  );
}
