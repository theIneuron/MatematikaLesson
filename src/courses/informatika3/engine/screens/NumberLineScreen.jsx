// ============================================================================
// grade3/screens/NumberLineScreen.jsx — ПРЕДСКАЗАНИЕ НА ЧИСЛОВОЙ ПРЯМОЙ
//
// Роль discovery_line. РЕАЛИЗУЕТ ОБЯЗАТЕЛЬНУЮ МЕХАНИКУ §3.4 в чистом виде:
// сначала ребёнок ставит метку сам, ПОТОМ механизм показывает правду.
//
// Почему это отдельный компонент, а не ветка ExplorationScreen. Там раскрытие
// идёт стадиями под озвучку: голос ведёт, картинка следует. Здесь наоборот —
// озвучка ЖДЁТ действия ребёнка: вопрос звучит и умолкает, пока метка не
// поставлена. Это другой поток управления, и смешивать их в одном компоненте
// значит получить два несвязанных режима под одним именем.
//
// Порядок «анимация, потом вопрос» запрещён эталоном: он делает ребёнка
// наблюдателем. Здесь он сначала решает, и только его решение запускает показ.
// ============================================================================

import { useState } from 'react';
import {
  Stage, NavBack, NavNext, NumberLine, Reaction, InfoNote,
  useAudio, useLang, useT, useCanAnswer, useAdvanceGate, useRevealScroll, useSfx,
} from '../kit/index.js';

export default function NumberLineScreen({
  screen, meta, index, totalScreens, onNext, onPrev,
}) {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();

  const nl = screen.numberLine || {};
  const steps = screen.audio?.intro?.[lang] || [];

  // Вопрос звучит сразу и умолкает. Объяснение прыжков стоит на on_event:go
  // и молчит, пока ребёнок не поставил метку — та же трёхчастная механика
  // on_event, что и на экране правила.
  const audio = useAudio([
    { id: `${meta.id}_q`, text: t(screen.q), trigger: 'on_mount', waits_for: null },
    ...steps.map((text, i) => ({
      id: `${meta.id}_${i}`,
      text,
      trigger: i === 0 ? 'on_event:go' : 'after_previous',
      waits_for: null,
    })),
  ]);
  const canAnswer = useCanAnswer(audio);

  const [guess, setGuess] = useState(null);

  // Фаза анимации идёт за озвучкой: первый сегмент — большие прыжки,
  // второй и дальше — малые. Так голос и движение маркера совпадают.
  const reached = Math.max(-1, audio.reachedIndex);
  // Звук выключен или зависел — прыжки показываются целиком, без ожидания голоса.
  // Без этого экран не отпускал: разбор ждал сегмента, который не приходил.
  const showAll = audio.muted || audio.stalled;
  const phase = guess === null ? 0 : (showAll || reached >= 1) ? 2 : 1;
  const done = guess !== null && (showAll || reached >= steps.length - 1);

  const revealRef = useRevealScroll(done, 500);
  const canAdvance = useAdvanceGate(done, audio);

  const onGuess = (v) => {
    if (guess !== null || !canAnswer) return;
    setGuess(v);
    sfx.playCorrect();          // отмечаем действие, а не правильность: это предсказание
    audio.triggerInternal('go');
  };

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

        {/* Вопрос виден, пока ребёнок не ответил. После — он уже неважен. */}
        {guess === null && (
          <p className="fade-up delay-1" style={{ textAlign: 'center', fontWeight: 600, margin: 0 }}>
            {t(screen.q)}
          </p>
        )}

        <div
          className="frame fade-up delay-1"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(8px, 1.8vw, 12px)', minHeight: 'clamp(140px, 30vw, 190px)',
          }}
        >
          <NumberLine
            min={nl.min}
            max={nl.max}
            step={nl.step}
            target={nl.target}
            phase={phase}
            guess={guess}
            onGuess={canAnswer ? onGuess : null}
          />
        </div>

        {done && (
          <div ref={revealRef} className="frame-success lm-riseup">
            <Reaction state="correct" praise={t(screen.doneText)}/>
          </div>
        )}

        {done && screen.info && <InfoNote badge={t(screen.infoBadge)} text={t(screen.info)}/>}
      </div>
    </Stage>
  );
}
