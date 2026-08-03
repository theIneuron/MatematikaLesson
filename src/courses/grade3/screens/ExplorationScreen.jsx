// ============================================================================
// grade3/screens/ExplorationScreen.jsx — ЭКРАН ОБЪЯСНЕНИЯ
//
// Самый частый экран урока: 6 из 15. Роли recall, concrete_model, second_model,
// discovery, discovery_line, bridge.
//
// РЕАЛИЗУЕТ ОБЯЗАТЕЛЬНУЮ МЕХАНИКУ §3.1 — поэтапный reveal под аудио.
// Картинка меняется синхронно с голосом: экран следит, какой сегмент озвучки
// сейчас играет, и показывает соответствующую стадию.
//
// Почему это обязательно. Если показать финальную картинку сразу, ребёнок видит
// ответ раньше объяснения, и экран объяснения превращается в подписанную
// иллюстрацию. В уроке 1 это ровно тот случай, где «10 десятков = 1 сотня»
// становится наблюдением: сначала 7 лент и 2 огонька, потом 10 лент, потом
// одна панель — и каждый шаг проговаривается.
//
// Контракт данных:
//   stages: [{ visual, caption? }, ...]   — по одной стадии на сегмент озвучки
//   audio:  { uz:[...], ru:[...], en:[...] } — сегментов столько же, сколько стадий
// Число стадий и число сегментов ДОЛЖНО совпадать; расхождение — предупреждение
// в консоли, потому что молча рассинхронизированный экран выглядит рабочим.
// ============================================================================

import { useEffect } from 'react';
import {
  Stage, NavBack, NavNext, useAudio, useLang, useT, useAdvanceGate,
  makeAutoSegments, useRevealScroll, Reaction, InfoNote, PLACE_COLORS,
} from '../kit/index.js';
import { renderVisual } from './visuals.jsx';

export default function ExplorationScreen({
  screen, meta, index, totalScreens, scenes, onNext, onPrev,
}) {
  const lang = useLang();
  const t = useT();

  const audioTexts = screen.audio?.[lang] || [];
  const stages = screen.stages || [];
  const audio = useAudio(makeAutoSegments(audioTexts, meta.id));

  // Докуда дошла озвучка — знает сам аудио-слой (audio.reachedIndex).
  // Экран ничего не хранит: раньше здесь были useState + useEffect с синхронным
  // setState в теле эффекта, и это дублировалось в каждом экране.
  const reached = Math.max(0, audio.reachedIndex);

  useEffect(() => {
    if (stages.length && audioTexts.length && stages.length !== audioTexts.length) {
      console.warn(
        `[${meta.id}] стадий визуала ${stages.length}, сегментов озвучки ${audioTexts.length} — `
        + 'должно совпадать (§3.1), иначе картинка разойдётся с голосом',
      );
    }
  }, [stages.length, audioTexts.length, meta.id]);

  // При выключенном звуке ребёнок должен увидеть всё: показываем финальную стадию.
  const done = audio.muted || reached >= Math.max(0, audioTexts.length - 1);
  const stageIdx = audio.muted ? Math.max(0, stages.length - 1) : Math.min(reached, stages.length - 1);
  const stage = stages[stageIdx] || stages[0] || {};

  const revealRef = useRevealScroll(done, 500);
  const canAdvance = useAdvanceGate(done, audio);

  const labels = screen.placeLabels?.[lang] || screen.placeLabels || undefined;

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

        <div
          className="frame fade-up delay-1"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(10px, 2vw, 14px)', minHeight: 'clamp(170px, 36vw, 240px)',
          }}
        >
          {renderVisual(stage.visual, { scenes, labels })}

          {stage.caption && (
            <span
              className="mono lm-reveal"
              style={{ fontSize: 'clamp(15px, 2.8vw, 22px)', fontWeight: 800, textAlign: 'center' }}
            >
              {t(stage.caption)}
            </span>
          )}
        </div>

        {/* Итоговая мысль экрана — появляется, когда объяснение дошло до конца. */}
        {done && screen.doneText && (
          <div ref={revealRef} className="frame-success lm-riseup">
            <Reaction state="correct" praise={t(screen.doneText)}/>
          </div>
        )}

        {done && screen.info && (
          <InfoNote badge={t(screen.infoBadge)} text={t(screen.info)}/>
        )}
      </div>
    </Stage>
  );
}

/** Цвета разрядов доступны экранам урока без прямого импорта из kit. */
export { PLACE_COLORS };
