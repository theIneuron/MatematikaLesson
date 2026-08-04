// ============================================================================
// grade3/screens/HookScreen.jsx — ПРОБЛЕМА И ПРЕДСКАЗАНИЕ (роль problem)
//
// Механика взята из ДЕЙСТВУЮЩЕГО урока 1 третьего класса
// (`src/components/grade3/Dars01.jsx`, Screen0). Решение методиста 2026-08-03:
// настоящий урок 3 класса ближе к требованию, чем урок 2 класса, и расхождения
// с ним недопустимы.
//
//   1. Ребёнок отвечает ОДИН раз. Варианты остаются на экране, но становятся
//      неактивными: он видит, что уже выбрал.
//   2. ВЕРНЫЙ ОТВЕТ ОТКРЫВАЕТСЯ — на нём зелёная рамка и галочка `✓`. Если
//      ребёнок ответил неверно, ниже появляется ОТДЕЛЬНАЯ зелёная рамка
//      «Верный ответ: …» с объяснением, а озвучка после разбора его ошибки
//      произносит верный ответ. Урок не оставляет ребёнка с неверной картиной
//      мира на первом же экране.
//   3. МИР МЕНЯЕТСЯ ПРИ ЛЮБОМ ОТВЕТЕ (`gathered={revealed}`): сцена — часть
//      объяснения, а не награда за угаданное.
//   4. «Дальше» открыто после любого ответа: предсказание не проверка знаний.
//   5. Бит выходит и на верном, и на неверном (§6.1).
//
// Чем это отличается от 2 класса, и почему выбран 3-й. Во 2 классе (Screen0)
// верный ответ НЕ показывается, варианты исчезают, остаётся одна кнопка с выбором
// ребёнка. Оба решения защищаемы: 2 класс сохраняет напряжение до объяснения,
// 3 класс сразу выпрямляет неверное представление. Методист выбрал второе.
// ============================================================================

import { useState } from 'react';
import {
  Stage, NavBack, NavNext, FeedbackBlock, Reaction,
  useAudio, useLang, useT, useCanAnswer, useAdvanceGate,
  makeAutoSegments, getAudioEngine, remapToPosition, singleNode, T,
} from '../kit/index.js';
import { renderVisual } from './visuals.jsx';

const RIGHT_ANSWER = { uz: "To'g'ri javob", ru: 'Верный ответ', en: 'The right answer' };

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

  const revealed = picked !== null;
  const solved = revealed && picked === laid.correctIdx;

  // Разбор именно выбранного варианта. singleNode отсекает массив on_wrong:
  // он уже разложен по позициям в laid.parallel.wrong, и как общий запасной
  // текст не годится.
  const wrongNode = (i) => laid.parallel.wrong?.[i]
    || screen.audio?.on_unknown
    || singleNode(screen.audio?.on_wrong);

  const pick = (i) => {
    if (!canAnswer || revealed) return;
    setPicked(i);
    if (audio.muted) return;
    const e = getAudioEngine();
    if (!e) return;
    if (i === laid.correctIdx) {
      if (screen.audio?.on_correct) e.pushOneOff(t(screen.audio.on_correct));
      return;
    }
    // Сначала разбор выбранного, потом верный ответ — порядок из Screen0
    // настоящего урока: «noto'g'ri -> to'g'ri javob emotsiya bilan ochiladi».
    const own = wrongNode(i);
    if (own) e.pushOneOff(t(own));
    if (screen.audio?.on_correct) e.pushOneOff(t(screen.audio.on_correct));
  };

  // Дальше открыто после ЛЮБОГО ответа.
  const canAdvance = useAdvanceGate(revealed, audio);

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

        {/* Сцена раскрывается при любом ответе: она объясняет, а не награждает. */}
        <div className="frame fade-up delay-1" style={{ overflow: 'hidden' }}>
          {renderVisual(
            screen.scene ? { type: 'scene', name: screen.scene, props: { gathered: revealed } } : screen.visual,
            { scenes },
          )}
        </div>

        <p
          className="fade-up delay-1"
          style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(15px, 2vw, 18px)', margin: 0 }}
        >
          {t(screen.q)}
        </p>

        {/* Варианты остаются на экране. Кнопки собраны здесь, а не через
            OptionButton: нужен значок ✓ в углу верного варианта — точно как в
            Screen0 действующего урока. */}
        <div className="grade3-answer-grid fade-up delay-1" style={{ '--answer-cols': screen.optionCols || 3 }}>
          {laid.options.map((o, i) => {
            const cls = revealed
              ? (i === laid.correctIdx ? 'option option-correct' : (picked === i ? 'option option-picked-wrong' : 'option'))
              : 'option';
            return (
              <button
                key={i}
                className={cls}
                disabled={!canAnswer || revealed}
                onClick={() => pick(i)}
                style={{
                  position: 'relative', padding: 'clamp(10px, 1.5vw, 12px) clamp(12px, 2vw, 16px)',
                  fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(48px, 7vw, 58px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                }}
              >
                {revealed && i === laid.correctIdx && (
                  <span className="mono" style={{ position: 'absolute', top: 4, right: 7, color: '#1F7A4D', fontWeight: 800 }}>✓</span>
                )}
                {t(o)}
              </button>
            );
          })}
        </div>

        {/* Бит выходит на любой ответ: зелёная карточка на верном, мягкая на неверном. */}
        <FeedbackBlock show={revealed} isCorrect={solved} wrongClass="frame-tip">
          <Reaction
            state={solved ? 'correct' : 'wrong'}
            praise={picked === null ? '' : t(solved ? screen.audio?.on_correct : wrongNode(picked))}
          />
        </FeedbackBlock>

        {/* Верный ответ отдельной рамкой — чтобы он не смешивался с разбором
            ошибки. Ребёнок уходит с первого экрана с верной картиной. */}
        {revealed && !solved && (
          <div className="frame-success lm-riseup">
            <p style={{ margin: 0, textAlign: 'center', color: '#1F7A4D', fontWeight: 700, fontSize: 'clamp(13px, 1.8vw, 16px)' }}>
              {RIGHT_ANSWER[lang] || RIGHT_ANSWER.ru}: <b>{t(laid.options[laid.correctIdx])}</b>. {t(screen.audio?.on_correct)}
            </p>
          </div>
        )}
      </div>
    </Stage>
  );
}
