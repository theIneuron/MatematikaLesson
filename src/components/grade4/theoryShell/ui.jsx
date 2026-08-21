// Umumiy ekran karkasi: sarlavha, progress, ovoz boshqaruvi, javob variantlari,
// obratnaya svyaz va navigatsiya.
//
// Muhim farq: bu yerda "Modelni tekshirish" (ContractActivity) tugmasi YO'Q.
// U sun'iy edi — passiv reveal ekranini "bajarilgan" deb belgilash uchun
// qo'yilgan. Etalon Dars01 da bunday tugma yo'q: tushuntirish ekranlarining
// o'zida bolaning haqiqiy amali bo'ladi (ExploreStage, `done` propi).
import { useContext, useEffect, useState } from 'react';
import { BitSVG } from './Bit.jsx';
import { ActivityContext, useIsMobile, useLesson, useT } from './runtime.js';
import { SCREEN_TYPE_LABELS } from './screenTypes.js';
import { canUseGrade4TheoryContinue } from '../theoryNavigation.js';

export { BitSVG };

export const AudioIndicator = ({ audio }) => {
  const t = useT();
  const muteLabel = audio.muted
    ? t({ uz: "Ovozni yoqish", ru: 'Включить звук', en: 'Turn sound on' })
    : t({ uz: "Ovozni o'chirish", ru: 'Выключить звук', en: 'Turn sound off' });
  const replayLabel = t({ uz: "Qayta eshitish", ru: 'Повторить', en: 'Replay' });
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>
          ↻
        </button>
      )}
    </div>
  );
};

export const ScreenTypeLabel = ({ type }) => {
  const t = useT();
  const label = SCREEN_TYPE_LABELS[type];
  return <span className="screen-type">{label ? t(label) : type}</span>;
};

export const FeedbackBlock = ({ show, correct, children }) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!show) { const frame = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frame); }
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [show]);
  return (
    <div
      role="status"
      aria-hidden={!show}
      data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'}
      data-g4-feedback={correct ? 'solution' : 'wrong'}
      className={`feedback ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}
    >
      <span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'} /></span>
      <p>
        {show && (
          <>
            <strong className="feedback-label">
              {correct
                ? t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' })
                : t({ uz: "YANA O'YLANG", ru: 'ПРОВЕРЬТЕ СПОСОБ', en: 'CHECK THE METHOD' })}
            </strong>
            <span className="feedback-text">{children}</span>
          </>
        )}
      </p>
    </div>
  );
};

// `done` — ekran bajarilgani. Tushuntirish ekranlari uchun bu bolaning amali,
// mashqlar uchun to'g'ri javob. Davom etish tugmasi bloklanmaydi (methodist
// qarori), lekin `btn-ready` bilan tayyorlik ko'rsatiladi.
export const Stage = ({ screen, audio, onPrev, onNext, finish = false, done, children }) => {
  const t = useT();
  const mobile = useIsMobile();
  const pad = mobile ? 14 : 48;
  const lesson = useLesson();
  const meta = lesson.screenMeta[screen];
  const c = lesson.content[screen];
  const { activityState, markActivity } = useContext(ActivityContext);
  const storedActivity = Object.prototype.hasOwnProperty.call(activityState, screen);
  const activityReady = !meta.active || done === true || storedActivity;
  const audioReady = !audio || audio.muted || audio.visualOnly || audio.completed;
  const gatePassed = activityReady && audioReady;
  const canAdvance = canUseGrade4TheoryContinue(gatePassed, finish);
  useEffect(() => {
    if (done === true && !storedActivity) markActivity(screen, true);
  }, [done, markActivity, screen, storedActivity]);
  return (
    <main className={`stage stage-${meta.type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${lesson.totalScreens}`}>
          <div className="progress-fill progress-bar" style={{ width: `${((screen + 1) / lesson.totalScreens) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title"><span className="status-dot" /><span>{t(c.eyebrow)}</span></div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={meta.type} />
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {lesson.totalScreens}</span>
          </div>
        </div>
      </header>
      <section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        {/* Metodist qarori (2026-08-21): ekran ostidagi to'q rangli subtitr
            olib tashlandi. */}
        <div className="stage-body">{children}</div>
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
        {screen === 0
          ? <span />
          : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад', en: 'Back' })}</button>}
        <button
          type="button"
          className={`btn-white-accent ${gatePassed ? 'btn-ready' : ''}`}
          onClick={onNext}
          disabled={!canAdvance}
        >
          {finish
            ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок', en: 'Finish lesson' })
            : t({ uz: "Davom etish", ru: 'Продолжить', en: 'Continue' })} →
        </button>
      </footer>
    </main>
  );
};

// Eyebrow faqat header'da turadi. Tanada hook ekranida dars mavzusi chipi.
export const Heading = ({ c, screen, bit = null }) => {
  const t = useT();
  const hook = screen === 0;
  return (
    <div className="heading">
      <div>
        {hook && <span className="topic-chip" data-g4-role="hook-topic">{t(c.topic)}</span>}
        <h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1>
      </div>
      {!hook && <BitSVG state={bit ?? 'happy'} className="primary-happy-bit" />}
    </div>
  );
};

export const Options = ({
  values, order = null, picked, onPick, correctIndex, solved, neutral = false, locked = false,
}) => {
  const t = useT();
  const optionOrder = order ?? values.map((_, index) => index);
  return (
    <div className={`options ${locked ? 'is-locked' : ''}`} aria-busy={locked || undefined}>
      {optionOrder.map((sourceIndex, displayIndex) => (
        <button
          type="button"
          key={`${sourceIndex}-${t(values[sourceIndex])}`}
          data-g4-role="answer-card"
          data-g4-branch={order ? 'choice' : undefined}
          data-g4-source-index={order ? sourceIndex : undefined}
          data-g4-correct={order ? (sourceIndex === correctIndex ? 'true' : 'false') : undefined}
          className={`option ${picked === sourceIndex ? 'picked' : ''} ${!neutral && solved && sourceIndex === correctIndex ? 'right' : ''} ${!neutral && picked === sourceIndex && picked !== correctIndex ? 'bad' : ''}`}
          disabled={solved || locked}
          onClick={() => onPick(sourceIndex)}
        >
          <b>{String.fromCharCode(65 + displayIndex)}</b>
          <span>{t(values[sourceIndex])}</span>
        </button>
      ))}
    </div>
  );
};

// Tushuntirish ekrani karkasi. Ataylab hech qanday "modelni ochish" tugmasi
// qo'shmaydi: bolaning amali chizmaning o'zida bo'ladi (ustunni bosib
// tenglashtirish, qiymatni qo'shish, bo'luvchini tanlash). Ekran bajarilgani
// `done` orqali beriladi — bu etalon Dars01 dagi yondashuv.
export const ExploreStage = ({ screen, audio, onPrev, onNext, done, bit = null, children }) => {
  const lesson = useLesson();
  const c = lesson.content[screen];
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} done={done}>
      <div className="stack">
        <Heading c={c} screen={screen} bit={bit} />
        {children}
      </div>
    </Stage>
  );
};
