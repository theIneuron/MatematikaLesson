// ============================================================================
// grade3/screens/HookScreen.jsx — ПРОБЛЕМА И ПРЕДСКАЗАНИЕ (роль problem)
//
// Первый экран урока. Механика взята из урока 1 второго класса (`Dars01.jsx`,
// Screen0) — там она выверена методистом, и расходиться с ней нельзя:
//
//   1. Ребёнок отвечает ОДИН раз. После выбора варианты исчезают, вместо них —
//      одна кнопка с его ответом и знаком: ✓ если угадал, ↺ если нет.
//   2. ВЕРНЫЙ ОТВЕТ НЕ ПОКАЗЫВАЕТСЯ. Ни зелёной подсветки на «правильном»
//      варианте, ни текста с ответом: иначе предсказание превращается в задачу
//      с готовым решением, а весь урок дальше — в проверку уже сказанного.
//   3. ДАЛЬШЕ ОТКРЫТО ПОСЛЕ ЛЮБОГО ОТВЕТА. Предсказание — не проверка знаний;
//      ошибиться здесь нормально, урок для этого и нужен. Требовать верного
//      ответа значит заставлять ребёнка угадывать, пока не совпадёт.
//   4. Бит выходит и на верном, и на неверном — на верном зелёной карточкой,
//      на неверном мягкой жёлтой (§6.1).
//   5. §1.3 СЦЕНА-ОБРАМЛЕНИЕ. Мир меняется ТОЛЬКО на верном предсказании: это
//      ответ мира ребёнку, а не оценка за ответ.
//
// Первая версия этого экрана расходилась с 2 классом по трём пунктам сразу:
// подсвечивала верный вариант при любом ответе, оставляла все варианты на экране
// и не пускала дальше без верного ответа.
// ============================================================================

import { useState } from 'react';
import {
  Stage, NavBack, NavNext, OptionButton, FeedbackBlock, Reaction,
  useAudio, useLang, useT, useCanAnswer, useAdvanceGate,
  makeAutoSegments, getAudioEngine, remapToPosition, singleNode, T,
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

  // Разбор именно выбранного варианта. singleNode отсекает массив on_wrong:
  // он уже разложен по позициям в laid.parallel.wrong, и как общий запасной
  // текст не годится.
  const wrongNode = (i) => laid.parallel.wrong?.[i]
    || screen.audio?.on_unknown
    || singleNode(screen.audio?.on_wrong);

  const pick = (i) => {
    if (!canAnswer || answered) return;
    setPicked(i);
    if (audio.muted) return;
    const e = getAudioEngine();
    if (!e) return;
    const node = i === laid.correctIdx ? screen.audio?.on_correct : wrongNode(i);
    if (node) e.pushOneOff(t(node));
  };

  // Дальше открыто после ЛЮБОГО ответа (пункт 3 в шапке).
  const canAdvance = useAdvanceGate(answered, audio);

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
              alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800,
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
          style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(15px, 2vw, 18px)', margin: 0 }}
        >
          {t(screen.q)}
        </p>

        {/* До ответа — все варианты. После ответа они ИСЧЕЗАЮТ: остаётся только
            выбор ребёнка. Верный вариант не показывается. */}
        {!answered && (
          <div className="grade3-answer-grid fade-up delay-1" style={{ '--answer-cols': screen.optionCols || 3 }}>
            {laid.options.map((o, i) => (
              <OptionButton key={i} compact state="idle" disabled={!canAnswer} onClick={() => pick(i)}>
                {t(o)}
              </OptionButton>
            ))}
          </div>
        )}

        {answered && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <OptionButton compact state={solved ? 'correct' : 'wrong'} disabled auto>
              <span className="mono" style={{ opacity: 0.8 }}>{solved ? '✓' : '↺'}</span>
              <span>{t(laid.options[picked])}</span>
            </OptionButton>
          </div>
        )}

        {/* Бит выходит на любой ответ: зелёная карточка на верном, мягкая на неверном. */}
        <FeedbackBlock show={answered} isCorrect={solved} wrongClass="frame-tip">
          <Reaction
            state={solved ? 'correct' : 'wrong'}
            praise={picked === null ? '' : t(solved ? screen.audio?.on_correct : wrongNode(picked))}
          />
        </FeedbackBlock>
      </div>
    </Stage>
  );
}
