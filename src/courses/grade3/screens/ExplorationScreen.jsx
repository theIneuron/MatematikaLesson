// ============================================================================
// grade3/screens/ExplorationScreen.jsx — ЭКРАН ОБЪЯСНЕНИЯ
//
// Самый частый экран урока: 6 из 15. Роли recall, concrete_model, second_model,
// discovery, bridge.
//
// Все механики этого экрана взяты из ДЕЙСТВУЮЩЕГО урока 1 третьего класса
// (`src/components/grade3/Dars01.jsx`). Решение методиста 2026-08-03: настоящий
// урок 3 класса ближе к требованию, чем урок 2 класса, и расходиться с ним нельзя.
// Прежняя версия этого экрана несла сборку разряда руками (tap-to-cassette из
// 2 класса) — она убрана.
//
// ДВА РЕЖИМА:
//
// 1. РАСКРЫТИЕ ПОД ОЗВУЧКУ (`stages`) — как Screen1, Screen4, Screen5.
//    Синхронность тройная:
//      • стадия переключается по номеру дошедшего сегмента (`reachedIndex`);
//      • подсветка разряда `emph` живёт РОВНО пока звучит свой сегмент
//        (`currentSegment`) — в Screen4 столбец десятков светится именно на фразе
//        про десятки;
//      • единицы разряда могут появляться ПО ОДНОЙ (`stage.appear`) под счёт
//        голосом — как в Screen1 и ScreenMing.
//
// 2. ПАУЗА НА РАЗМЫШЛЕНИЕ (`countdown`) — как ScreenMing («10 сотен = 1000»).
//    Порядок ровно такой: вопрос → «даю пять секунд» → часы отсчитывают в тишине
//    → единицы появляются одна за другой под счёт → раскрытие равенства и слова.
//    Пауза работает как задание: без неё ответ приходит готовым.
//
// Итог экрана — карточка Бита с выводом (`doneText`), как в Screen5 и ScreenMing.
// Если вывода у экрана нет, карточки тоже нет (Screen1, Screen4).
//
// Контракт данных:
//   stages:    [{ visual, caption?, emph?, appear? }, ...]
//   countdown: { seconds, goSegment, q, units: { place, count, columns }, eq, word }
//   audio:     { intro: { uz:[...], ru:[...], en:[...] } }
// ============================================================================

import { useState, useEffect } from 'react';
import {
  Stage, NavBack, NavNext, useAudio, useLang, useT, useAdvanceGate,
  makeAutoSegments, useRevealScroll, Reaction, InfoNote, CountdownClock,
  PLACE_COLORS, T,
} from '../kit/index.js';
import { renderVisual } from './visuals.jsx';

// Цвет части разложения по её разряду (§7): сотни, десятки, единицы. Порядок
// частей в данных — от старшего разряда к младшему, как в записи числа.
const PART_COLOR = [PLACE_COLORS.hundreds, PLACE_COLORS.tens, PLACE_COLORS.ones];

// Шаг появления единиц под счёт голосом — 460 мс, как в ScreenMing.
const APPEAR_MS = 460;
// Шаг раскадровки, когда озвучка молчит (см. ниже про audio.stalled).
const STAGE_MS = 3500;

export default function ExplorationScreen({
  screen, meta, index, totalScreens, scenes, onNext, onPrev,
}) {
  const lang = useLang();
  const t = useT();

  const audioTexts = screen.audio?.intro?.[lang] || screen.audio?.[lang] || [];
  const stages = screen.stages || [];
  const cd = screen.countdown || null;

  // В режиме часов сегмент со счётом ждёт события `go`: пока идут пять секунд,
  // голос молчит. Разбивка та же, что в ScreenMing действующего урока.
  const goIdx = cd ? Math.min(cd.goSegment ?? 2, Math.max(0, audioTexts.length - 1)) : -1;
  const segments = cd
    ? audioTexts.map((text, i) => ({
      id: `${meta.id}_${i}`,
      text,
      trigger: i === 0 ? 'on_mount' : (i === goIdx ? 'on_event:go' : 'after_previous'),
      waits_for: null,
    }))
    : makeAutoSegments(audioTexts, meta.id);

  const audio = useAudio(segments);

  // Докуда дошла озвучка — знает сам аудио-слой (audio.reachedIndex).
  const reached = Math.max(0, audio.reachedIndex);

  // Какой сегмент звучит ПРЯМО СЕЙЧАС. Нужен для подсветки разряда: она должна
  // гаснуть вместе с фразой, а не оставаться до конца экрана.
  const speakingIdx = (() => {
    const m = /_(\d+)$/.exec(audio.currentSegment || '');
    return m ? Number(m[1]) : -1;
  })();

  useEffect(() => {
    if (!cd && stages.length && audioTexts.length && stages.length !== audioTexts.length) {
      console.warn(
        `[${meta.id}] стадий визуала ${stages.length}, сегментов озвучки ${audioTexts.length} — `
        + 'должно совпадать (§3.1), иначе картинка разойдётся с голосом',
      );
    }
  }, [cd, stages.length, audioTexts.length, meta.id]);

  // Ребёнок ВЫКЛЮЧИЛ звук — показываем всё сразу: он читает, а не слушает.
  //
  // Озвучка ЗАВИСЛА (audio.stalled, §10.1) — это другое. Показать всё мгновенно
  // значит стереть раскадровку: ребёнок видит финальную картинку и не понимает,
  // откуда она взялась. Поэтому при зависшей озвучке стадии идут по таймеру.
  const stalledSilently = audio.stalled && !audio.muted;
  const [timedIdx, setTimedIdx] = useState(0);
  useEffect(() => {
    if (!stalledSilently || cd) return undefined;
    const last = Math.max(0, stages.length - 1);
    const id = setInterval(() => setTimedIdx((i) => (i >= last ? i : i + 1)), STAGE_MS);
    return () => clearInterval(id);
  }, [stalledSilently, cd, stages.length]);

  // --- ПАУЗА НА РАЗМЫШЛЕНИЕ (режим часов) ----------------------------------
  // null — ещё не начали, 5..0 — идёт отсчёт, -1 — закончился.
  const [clock, setClock] = useState(null);
  const clockDone = clock === -1;
  const clockRunning = clock !== null && clock >= 0;

  // Часы стартуют после того, как ОТЗВУЧАЛ сегмент «даю пять секунд» — иначе они
  // пойдут поверх вопроса. Звук выключен или зависел — стартуют сразу.
  //
  // Условие старта и сам отсчёт живут в ОДНОМ эффекте, а состояние меняется
  // только из таймера. Разделить на два эффекта нельзя: setState прямо в теле
  // эффекта — это каскадный рендер, и правило react-hooks справедливо его
  // запрещает.
  const cdSeconds = cd?.seconds ?? 5;
  const readyForClock = !!cd && (audio.muted || audio.stalled
    || (reached >= Math.max(0, goIdx - 1) && !audio.isPlaying));
  useEffect(() => {
    if (!cd) return undefined;
    if (clock === null) {
      if (!readyForClock) return undefined;
      const id = setTimeout(() => setClock(cdSeconds), 0);
      return () => clearTimeout(id);
    }
    if (clock < 0) return undefined;
    if (clock === 0) {
      audio.triggerInternal('go');
      const id = setTimeout(() => setClock(-1), 300);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setClock((v) => v - 1), 1000);
    return () => clearTimeout(id);
    // audio.triggerInternal стабилен (useCallback без зависимостей).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cd, clock, readyForClock, cdSeconds]);

  // Единицы появляются по одной под счёт голосом — начиная с сегмента `go`.
  const [appeared, setAppeared] = useState(0);
  const appearTotal = cd ? (cd.units?.count ?? 0) : 0;
  useEffect(() => {
    if (!cd || !clockDone || appeared >= appearTotal) return undefined;
    const id = setTimeout(() => setAppeared((v) => v + 1), APPEAR_MS);
    return () => clearTimeout(id);
  }, [cd, clockDone, appeared, appearTotal]);

  const cdRevealed = cd ? appeared >= appearTotal : false;

  // --- РАСКРЫТИЕ ПОД ОЗВУЧКУ ------------------------------------------------
  const lastStage = Math.max(0, stages.length - 1);
  const stageIdx = audio.muted
    ? lastStage
    : Math.min(lastStage, Math.max(reached, stalledSilently ? timedIdx : 0));
  const stage = stages[stageIdx] || stages[0] || {};
  const emph = speakingIdx >= 0
    ? (stages[speakingIdx]?.emph || null)
    : (stages[stageIdx]?.emph || null);

  // stage.appear — единицы появляются по одной под свою фразу, а не все разом.
  //
  // Счётчик хранит НОМЕР СТАДИИ вместе со счётом: сменилась стадия — счёт с нуля.
  // Отдельным эффектом сбрасывать нельзя (setState в теле эффекта запрещён), поэтому
  // сброс идёт из того же таймера.
  const [appearAt, setAppearAt] = useState({ idx: -1, n: 0 });
  const stageAppearTotal = stage.appear ? (stage.visual?.count ?? 0) : 0;
  const stageAppeared = appearAt.idx === stageIdx ? appearAt.n : 0;
  useEffect(() => {
    if (!stage.appear || audio.muted) return undefined;
    if (appearAt.idx !== stageIdx) {
      const id = setTimeout(() => setAppearAt({ idx: stageIdx, n: 1 }), 0);
      return () => clearTimeout(id);
    }
    if (appearAt.n >= stageAppearTotal) return undefined;
    const id = setTimeout(() => setAppearAt((v) => ({ idx: v.idx, n: v.n + 1 })), APPEAR_MS);
    return () => clearTimeout(id);
  }, [stage.appear, audio.muted, appearAt, stageIdx, stageAppearTotal]);
  const shownFor = stage.appear && !audio.muted
    ? Math.min(stageAppeared, stageAppearTotal)
    : null;

  const lastReached = reached >= Math.max(0, audioTexts.length - 1);
  const done = cd
    ? cdRevealed && (audio.muted || audio.stalled || lastReached)
    : (audio.muted || lastReached || (stalledSilently && timedIdx >= lastStage));

  console.debug('[dbg]', meta.id, JSON.stringify({
    reached, stageIdx, seg: audio.currentSegment, playing: audio.isPlaying,
    stalled: audio.stalled, appeared: stageAppeared, done,
  }));

  const revealRef = useRevealScroll(done, 500);
  const canAdvance = useAdvanceGate(done, audio);

  const labels = screen.placeLabels?.[lang] || screen.placeLabels || undefined;
  const workedExamples = screen.workedExamples || [];

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
            gap: 'clamp(10px, 2vw, 14px)', minHeight: 'clamp(180px, 38vw, 240px)',
          }}
        >
          {cd ? (
            <>
              {/* Вопрос виден, пока ответ не раскрыт. */}
              {!cdRevealed && cd.q && <div className="lm-q-accent fade-up">{t(cd.q)}</div>}

              {clockRunning && <CountdownClock n={clock} total={cd.seconds ?? 5} lang={lang}/>}

              {clockDone && renderVisual(
                { type: 'units', ...cd.units },
                { scenes, labels, extra: { shown: cdRevealed ? null : appeared } },
              )}

              {cdRevealed && cd.eq && (
                <span
                  className="mono lm-eq lm-write lm-d1"
                  style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 800, color: T.success }}
                >
                  {t(cd.eq)}
                </span>
              )}
              {cdRevealed && cd.word && (
                <span
                  className="lm-write lm-d2"
                  style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: T.accent, letterSpacing: 3 }}
                >
                  {t(cd.word)}
                </span>
              )}
            </>
          ) : (
            <>
              {renderVisual(stage.visual, { scenes, labels, emph, extra: { shown: shownFor } })}

              {stage.caption && (
                <span
                  className="mono lm-eq lm-reveal"
                  style={{ fontSize: 'clamp(15px, 2.8vw, 22px)', fontWeight: 800, textAlign: 'center' }}
                >
                  {t(stage.caption)}
                </span>
              )}
            </>
          )}
        </div>

        {/* §3.2 ПРИМЕРЫ С РЕШЕНИЯМИ. Показываются ПОСЛЕ разбора, а не вместе с ним:
            иначе готовые разложения видны раньше, чем ребёнок понял способ.
            Каждая часть окрашена по своему разряду, ноль тоже показан частью —
            именно он держит место, и это главное, что здесь надо увидеть. */}
        {done && workedExamples.length > 0 && (
          <div className="frame lm-riseup" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
            {screen.workedExamplesTitle && (
              <span className="mono" style={{ fontWeight: 800, fontSize: 'clamp(12px, 1.6vw, 14px)', color: T.ink2 }}>
                {t(screen.workedExamplesTitle)}
              </span>
            )}
            {workedExamples.map((ex, i) => (
              <div
                key={ex.n}
                className="mono g1-pop-in"
                style={{
                  display: 'flex', alignItems: 'center', flexWrap: 'wrap',
                  gap: 'clamp(4px, 1vw, 8px)', fontSize: 'clamp(15px, 2.4vw, 20px)', fontWeight: 800,
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                <span>{ex.n}</span>
                <span style={{ opacity: 0.5 }}>=</span>
                {ex.parts.map((p, k) => (
                  <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                    {k > 0 && <span style={{ opacity: 0.5 }}>+</span>}
                    <span style={{ color: PART_COLOR[k] }}>{p}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Вывод экрана — карточкой Бита, как в Screen5 и ScreenMing действующего
            урока. Экран без вывода карточки не показывает (Screen1, Screen4). */}
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
