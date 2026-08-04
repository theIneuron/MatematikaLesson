// ============================================================================
// grade3/screens/ExplorationScreen.jsx — ЭКРАН ОБЪЯСНЕНИЯ
//
// Самый частый экран урока: 6 из 15. Роли recall, concrete_model, second_model,
// discovery, bridge.
//
// Экран работает в ДВУХ режимах, и это различение — главное здесь.
//
// 1. СБОРКА (данные содержат `collect`) — ребёнок собирает десять единиц младшего
//    разряда в одну единицу старшего. Так устроены ключевые экраны открытия в
//    уроке 1 второго класса (`Dars01.jsx`, Screen2 — tap-to-cassette): пока десять
//    лент не собраны, объяснение НЕ продолжается, потому что объяснять ещё нечего.
//    Озвучка ждёт события `collected`, и только после него звучит вывод.
//    Итог такого экрана — карточка Бита: ребёнок ДЕЙСТВОВАЛ, и Бит отвечает ему.
//
// 2. ПОКАЗ (данные содержат `stages`) — §3.1, поэтапное раскрытие под голос.
//    Картинка меняется синхронно с озвучкой, и синхронность двойная:
//      • стадия переключается по НОМЕРУ дошедшего сегмента (reachedIndex);
//      • подсветка разряда `emph` живёт РОВНО пока звучит свой сегмент
//        (audio.currentSegment) — как в уроке 1 второго класса, Screen4, где
//        столбец десятков светится именно на фразе про десятки.
//    Итог такого экрана — НЕ карточка Бита, а спокойная заметка (`info`).
//    Правило из 2 класса: Бит выходит на действие ребёнка, а не на конец абзаца.
//    Экран, где ребёнок ничего не делал, не хвалят.
//
// Контракт данных:
//   collect: { from: 'tens'|'hundreds', label, resultCaption }   — режим сборки
//   stages:  [{ visual, caption?, emph? }, ...]                  — режим показа
//   audio:   { uz:[...], ru:[...], en:[...] } — сегментов столько же, сколько стадий
// ============================================================================

import { useState, useEffect } from 'react';
import {
  Stage, NavBack, NavNext, useAudio, useLang, useT, useAdvanceGate, useSfx,
  makeAutoSegments, useRevealScroll, Reaction, InfoNote, TapCollect, PLACE_COLORS, T,
} from '../kit/index.js';
import { renderVisual } from './visuals.jsx';

// Цвет части разложения по её разряду (§7): сотни, десятки, единицы. Порядок
// частей в данных — от старшего разряда к младшему, как в записи числа.
const PART_COLOR = [PLACE_COLORS.hundreds, PLACE_COLORS.tens, PLACE_COLORS.ones];

export default function ExplorationScreen({
  screen, meta, index, totalScreens, scenes, onNext, onPrev,
}) {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();

  const audioTexts = screen.audio?.intro?.[lang] || screen.audio?.[lang] || [];
  const stages = screen.stages || [];
  const collect = screen.collect || null;

  // В режиме сборки последний сегмент ждёт события: вывод звучит после того, как
  // ребёнок собрал десять. Разбивка та же, что во 2 классе (Screen2).
  const segments = collect
    ? audioTexts.map((text, i) => ({
      id: `${meta.id}_${i}`,
      text,
      trigger: i === 0 ? 'on_mount' : (i === audioTexts.length - 1 ? 'on_event:collected' : 'after_previous'),
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
    if (!collect && stages.length && audioTexts.length && stages.length !== audioTexts.length) {
      console.warn(
        `[${meta.id}] стадий визуала ${stages.length}, сегментов озвучки ${audioTexts.length} — `
        + 'должно совпадать (§3.1), иначе картинка разойдётся с голосом',
      );
    }
  }, [collect, stages.length, audioTexts.length, meta.id]);

  // --- режим сборки ---------------------------------------------------------
  const [taken, setTaken] = useState(0);
  const collected = collect ? taken >= 10 : false;

  const tap = () => {
    setTaken((n) => {
      const next = Math.min(10, n + 1);
      if (next === 10) {
        sfx.playCorrect();
        // Небольшая пауза перед выводом: ребёнок успевает увидеть, что слоты
        // заполнены, и только потом десять превращаются в одну единицу.
        setTimeout(() => audio.triggerInternal('collected'), 450);
      }
      return next;
    });
  };

  // --- режим показа --------------------------------------------------------
  //
  // Ребёнок ВЫКЛЮЧИЛ звук — показываем всё сразу: он читает, а не слушает.
  //
  // Озвучка ЗАВИСЛА (audio.stalled, §10.1) — это другое. Показать всё мгновенно
  // значит стереть раскадровку: ребёнок видит финальную картинку и не понимает,
  // откуда она взялась. Ровно это и происходит в локальном просмотре, где вместо
  // боевого TTS работает speechSynthesis и часто молчит. Поэтому при зависшей
  // озвучке стадии идут по таймеру: choreography сохраняется, экран не запирается.
  const STAGE_MS = 3500;
  const stalledSilently = audio.stalled && !audio.muted;
  const [timedIdx, setTimedIdx] = useState(0);
  useEffect(() => {
    if (!stalledSilently || collect) return undefined;
    const last = Math.max(0, stages.length - 1);
    const id = setInterval(() => setTimedIdx((i) => (i >= last ? i : i + 1)), STAGE_MS);
    return () => clearInterval(id);
  }, [stalledSilently, collect, stages.length]);

  const lastStage = Math.max(0, stages.length - 1);
  const stageIdx = audio.muted
    ? lastStage
    : Math.min(lastStage, Math.max(reached, stalledSilently ? timedIdx : 0));
  const stage = stages[stageIdx] || stages[0] || {};
  // Подсветка разряда — пока звучит СВОЯ фраза. При выключенном звуке и при
  // раскадровке по таймеру подсвечиваем разряд текущей стадии.
  const emph = speakingIdx >= 0
    ? (stages[speakingIdx]?.emph || null)
    : (stages[stageIdx]?.emph || null);

  const lastReached = reached >= Math.max(0, audioTexts.length - 1);
  const showDone = audio.muted || lastReached || (stalledSilently && timedIdx >= lastStage);
  const done = collect ? collected && (audio.muted || audio.stalled || lastReached) : showDone;

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

        {/* Задание сборки видно, пока ребёнок не закончил. */}
        {collect && !collected && screen.task && (
          <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, margin: 0 }}>
            {t(screen.task)}
          </p>
        )}

        <div
          className="frame fade-up delay-1"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(10px, 2vw, 14px)', minHeight: 'clamp(170px, 36vw, 240px)',
          }}
        >
          {collect ? (
            <TapCollect
              from={collect.from}
              taken={taken}
              done={collected}
              onTap={collected ? null : tap}
              label={collected ? t(collect.label) : null}
            />
          ) : (
            <>
              {renderVisual(stage.visual, { scenes, labels, emph })}

              {stage.caption && (
                <span
                  className="mono lm-reveal"
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

        {/* Вывод экрана. Карточка Бита — ТОЛЬКО там, где ребёнок собирал сам
            (правило из урока 1 второго класса: Бит отвечает на действие).
            На экране-показе тот же вывод идёт спокойной заметкой. */}
        {done && collect && screen.doneText && (
          <div ref={revealRef} className="frame-success lm-riseup">
            <Reaction state="correct" praise={t(screen.doneText)}/>
          </div>
        )}
        {done && !collect && screen.doneText && (
          <div ref={revealRef} className="frame-tip lm-riseup">
            <p style={{ margin: 0, fontWeight: 700 }}>{t(screen.doneText)}</p>
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
