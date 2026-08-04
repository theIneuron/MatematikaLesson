// ============================================================================
// grade3/screens/SummaryScreen.jsx — ИТОГ И МОСТИК (роль summary)
//
// Закрывает четыре вещи эталона, и все четыре обязательны:
//
// §1.3 СЦЕНА-ОБРАМЛЕНИЕ в состоянии «снято» — та же сцена, что на первом экране,
//      но с gathered=true. Финал читается как решённое начало. Если поставить сюда
//      другую сцену, связь пропадает.
//
// §1.1 ПРАВИЛО-RECAP — то самое правило, которое ребёнок открыл на rule-экране.
//
// §5   FACTCARD «Bilasizmi?» — награда, факт соответствует району Lumo.
//
// §5   МОСТИК: одна фраза о следующем уроке. Не анонс программы, а естественное
//      продолжение сюжета.
//
// finishLesson вызывается ТОЛЬКО по нажатию кнопки «Завершить урок», а не при
// показе экрана. Первая версия отправляла результат в эффекте на монтировании — и
// урок закрывался мгновенно: платформа понимает onFinished как «урок закончен» и
// уводит ребёнка к списку уроков (src/components/shared/LessonPage.jsx: для 3 класса
// onFinished вызывает navigate). Итог, правило, факт и мостик ребёнок не видел
// вообще. Найдено прокликиванием: экран 15 в браузере не показывался.
// ============================================================================

import { useRef } from 'react';
import {
  Stage, NavBack, Confetti, ReadinessMeter, InfoNote,
  useAudio, useLang, useT, useAdvanceGate, makeAutoSegments, useProgress,
} from '../kit/index.js';
import { renderVisual } from './visuals.jsx';

const DONE = { uz: 'Darsni yakunlash', ru: 'Завершить урок', en: 'Finish lesson' };

export default function SummaryScreen({
  screen, meta, index, totalScreens, scenes, onPrev, finishLesson,
}) {
  const lang = useLang();
  const t = useT();
  const progress = useProgress();

  const audio = useAudio(makeAutoSegments(screen.audio?.[lang] || [], meta.id));
  const canAdvance = useAdvanceGate(true, audio);

  // Результат уходит платформе один раз — по нажатию кнопки, и только по нему.
  const sentRef = useRef(false);
  const finish = () => {
    if (sentRef.current) return;
    sentRef.current = true;
    finishLesson();
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
          <button
            className={canAdvance ? 'btn-white-accent btn-ready' : 'btn-white-accent'}
            disabled={!canAdvance}
            onClick={finish}
            style={{ marginLeft: 'auto', padding: 'clamp(10px,1.7vw,12px) clamp(20px,2.5vw,27px)', fontSize: 'clamp(12px,1.5vw,14px)' }}
          >
            {DONE[lang] || DONE.ru}
          </button>
        </>
      )}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', position: 'relative' }}>
        <Confetti/>

        <h1 className="title h-sub fade-up">{t(screen.lead)}</h1>

        {/* Та же сцена, что на первом экране, но препятствие снято. */}
        <div className="frame fade-up delay-1" style={{ overflow: 'hidden' }}>
          {renderVisual(
            screen.scene ? { type: 'scene', name: screen.scene, props: { gathered: true } } : screen.visual,
            { scenes },
          )}
        </div>

        {/* Правило-recap: ровно то, что ребёнок открыл сам. */}
        {screen.rule && (
          <div className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(screen.ruleBadge)}</span>
            <p className="d2-rulecard-txt">{t(screen.rule)}</p>
          </div>
        )}

        {/* Оценка — обращением к ребёнку, а не сухой цифрой (§6). */}
        {screen.praise && (
          <div className="frame-success fade-up">
            <p style={{ margin: 0, fontWeight: 700 }}>{t(screen.praise)}</p>
          </div>
        )}

        {screen.fact && (
          <div className="d2-factcard fade-up">
            <span className="d2-factcard-badge mono">{t(screen.factBadge)}</span>
            <p className="d2-factcard-txt">{t(screen.fact)}</p>
          </div>
        )}

        {/* Мостик к следующему уроку — одна фраза, продолжение сюжета. */}
        {screen.bridge && <InfoNote badge={t(screen.bridgeBadge)} text={t(screen.bridge)}/>}

        <ReadinessMeter screen={index} total={totalScreens} lang={lang} zones={screen.zones}/>

        {progress.total > 0 && (
          <p className="mono" style={{ textAlign: 'center', fontWeight: 700, margin: 0 }}>
            ★ {progress.stars} / {progress.total}
          </p>
        )}
      </div>
    </Stage>
  );
}
