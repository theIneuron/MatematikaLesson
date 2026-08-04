// ============================================================================
// informatika3/screens/SignalFlowScreen.jsx — ОТКРЫТИЕ ПРИЗНАКА (роль discovery)
//
// Единственный экран урока, которого нет в каркасе математики, и он здесь по
// делу: остальные экраны различаются данными, а этот — поведением.
//
// ЧТО РЕБЁНОК ДОЛЖЕН ОТКРЫТЬ САМ: устройства ввода и вывода различаются НЕ
// внешним видом и не списком названий, а направлением, куда идут данные.
//
// Почему нельзя было взять ExplorationScreen. Там раскрытие ведёт озвучка:
// ребёнок слушает и смотрит. Здесь ведёт ребёнок — он выбирает устройство, и
// только после его касания видно, куда пойдёт стрелка. Разница не косметическая:
// признак, который назвали тебе, и признак, который ты нашёл, держатся в голове
// по-разному. Эталон v2 §3 требует ровно этого — открытие, а не показ.
//
// Вывод (`verdict`) появляется ТОЛЬКО когда пройдены все устройства: пока
// ребёнок видел одну стрелку, обобщать нечего.
//
// Контракт данных:
//   computerLabel, flowLabels: { in, out }, pickHint
//   devices: [{ key, kind, role, direction: 'in' | 'out', label, say }]
//   audio: { intro: { uz:[...], ru:[...], en:[...] } }
//   verdict — вывод, который открывается после последнего устройства
// ============================================================================

import { useState } from 'react';
import {
  Stage, NavBack, NavNext, Reaction, SignalFlow, DeviceRow, T,
  useAudio, useLang, useT, useCanAnswer, useAdvanceGate, useRevealScroll,
  makeAutoSegments, getAudioEngine,
} from '../kit/index.js';

export default function SignalFlowScreen({
  screen, meta, index, totalScreens, onNext, onPrev,
}) {
  const lang = useLang();
  const t = useT();

  const devices = screen.devices || [];
  const audio = useAudio(makeAutoSegments(screen.audio?.intro?.[lang] || [], meta.id));
  const canAnswer = useCanAnswer(audio);

  const [picked, setPicked] = useState(null);
  // Set в useState нельзя менять на месте: React сравнивает по ссылке.
  const [seen, setSeen] = useState([]);

  const current = devices.find((d) => d.key === picked) || null;
  const done = seen.length >= devices.length && devices.length > 0;
  const revealRef = useRevealScroll(done, 450);
  const canAdvance = useAdvanceGate(done, audio);

  const pick = (key) => {
    if (!canAnswer) return;
    setPicked(key);
    setSeen((prev) => (prev.includes(key) ? prev : [...prev, key]));
    const dev = devices.find((d) => d.key === key);
    if (!dev || audio.muted) return;
    const e = getAudioEngine();
    // Реплика про КОНКРЕТНОЕ устройство, а не общая: ребёнок только что нажал
    // на микрофон и должен услышать про микрофон.
    if (e && dev.say) e.pushOneOff(t(dev.say));
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

        <div
          className="frame fade-up delay-1"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 'clamp(10px, 2vw, 14px)', minHeight: 'clamp(180px, 38vw, 240px)', justifyContent: 'center',
          }}
        >
          {current ? (
            <SignalFlow
              kind={current.kind}
              role={current.role}
              deviceLabel={current.label}
              computerLabel={screen.computerLabel}
              direction={current.direction}
              flowLabel={current.direction === 'in' ? screen.flowLabels?.in : screen.flowLabels?.out}
            />
          ) : (
            // До первого касания на месте схемы стоит приглашение, а не пустота:
            // пустая рамка читается как «тут ничего не будет».
            <p style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>
              {t(screen.pickHint)}
            </p>
          )}

          <div style={{ width: '100%', height: 1, background: 'rgba(167,166,162,.2)' }}/>

          {/* Пройденные устройства помечены галочкой — видно, сколько осталось. */}
          <DeviceRow
            items={devices.map((d) => ({
              key: d.key,
              kind: d.kind,
              label: d.label,
              role: seen.includes(d.key) ? d.role : 'none',
              badge: seen.includes(d.key) ? { uz: '✓', ru: '✓', en: '✓' } : null,
            }))}
            selectedKey={picked}
            onPick={canAnswer ? pick : null}
          />
        </div>

        {done && (
          <div ref={revealRef} className="frame-success lm-riseup">
            <Reaction state="correct" praise={t(screen.verdict)}/>
          </div>
        )}
      </div>
    </Stage>
  );
}
