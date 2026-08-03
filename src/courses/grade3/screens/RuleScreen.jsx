// ============================================================================
// grade3/screens/RuleScreen.jsx — ПРАВИЛО (роль rule)
//
// РЕАЛИЗУЕТ ОБЯЗАТЕЛЬНУЮ МЕХАНИКУ §3.3 — ВОПРОС ДО ПРАВИЛА.
//
// Как это работает:
//   1. На экране только вопрос. Подписи разрядов скрыты как «?».
//   2. Сегменты озвучки правила стоят на триггере on_event:answered и МОЛЧАТ.
//   3. Ребёнок отвечает. Верно — открываются подписи, появляется карточка правила,
//      и только теперь голос его произносит.
//
// Именно здесь работает та самая обработка on_event, из-за которой нельзя менять
// AudioEngine: guard в playNext не даёт сегменту зазвучать раньше события, а
// triggerInternal('answered') запускает его принудительно. Уберите одну из трёх
// частей — и правило либо прозвучит до ответа, либо не прозвучит никогда.
//
// Правило даётся определением только после того, как ребёнок сам назвал признак.
// Вопрос должен опираться на наблюдения предыдущих экранов, а не требовать знания
// правила — иначе механика превращается в угадывание.
// ============================================================================

import { useState } from 'react';
import {
  Stage, NavBack, NavNext, OptionButton, Reaction,
  useAudio, useLang, useT, useCanAnswer, useAdvanceGate, useRevealScroll, useSfx,
} from '../kit/index.js';
import { renderVisual } from './visuals.jsx';

export default function RuleScreen({
  screen, meta, index, totalScreens, scenes, onNext, onPrev,
}) {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();

  const ruleTexts = screen.audio?.rule?.[lang] || [];

  // Вопрос звучит сразу; правило ждёт события answered и молчит до ответа.
  const audio = useAudio([
    { id: `${meta.id}_q`, text: t(screen.checkQ), trigger: 'on_mount', waits_for: null },
    ...ruleTexts.map((text, i) => ({
      id: `${meta.id}_${i}`,
      text,
      trigger: i === 0 ? 'on_event:answered' : 'after_previous',
      waits_for: null,
    })),
  ]);
  const canAnswer = useCanAnswer(audio);

  const [tapped, setTapped] = useState(null);
  const solved = tapped === screen.correctCell;
  const revealRef = useRevealScroll(solved, 500);

  const onCell = (cell) => {
    if (!canAnswer || solved) return;
    setTapped(cell);
    if (cell !== screen.correctCell) return;
    sfx.playCorrect();
    // Событие, которое отпускает озвучку правила.
    audio.triggerInternal('answered');
  };

  const pickOption = (i) => {
    if (!canAnswer || solved) return;
    setTapped(i === screen.correct ? screen.correctCell : `opt${i}`);
    if (i !== screen.correct) return;
    sfx.playCorrect();
    audio.triggerInternal('answered');
  };

  const canAdvance = useAdvanceGate(solved, audio);
  const maskedLabels = { h: '?', t: '?', o: '?' };
  const realLabels = screen.placeLabels?.[lang] || screen.placeLabels;

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
        {/* До ответа — вопрос. После — карточка правила. Не одновременно. */}
        {!solved ? (
          <div className="lm-q-accent fade-up">{t(screen.checkQ)}</div>
        ) : (
          <div className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(screen.eyebrow)}</span>
            <p className="d2-rulecard-txt">{t(screen.rule)}</p>
          </div>
        )}

        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)' }}>
          {renderVisual(screen.visual, {
            scenes,
            labels: solved ? realLabels : maskedLabels,
            extra: { onCell, cellSel: solved ? screen.correctCell : null },
          })}

          {screen.options && (
            <div className="grade3-answer-grid" style={{ '--answer-cols': screen.optionCols || 3 }}>
              {screen.options.map((o, i) => (
                <OptionButton
                  key={i}
                  state={solved && i === screen.correct ? 'correct' : tapped === `opt${i}` ? 'wrong' : 'idle'}
                  disabled={!canAnswer || solved}
                  onClick={() => pickOption(i)}
                >
                  {t(o)}
                </OptionButton>
              ))}
            </div>
          )}

          {tapped !== null && !solved && screen.checkNo && (
            <p style={{ textAlign: 'center', fontWeight: 700, margin: 0 }}>{t(screen.checkNo)}</p>
          )}
        </div>

        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(screen.checkOk)}/>
          </div>
        )}
      </div>
    </Stage>
  );
}
