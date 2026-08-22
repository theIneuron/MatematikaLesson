// Ekran karkasi: sarlavha, progress, ovoz boshqaruvi, model zonasi,
// javob varianti va navigatsiya.
//
// Karkas skroll qilmaydi: `Stage` uch qatorli grid beradi va model zonasiga
// `minmax(0,1fr)` ajratadi. Ichkaridagi chizma `FitSvg` orqali qolgan
// balandlikka moslashadi — kesilmaydi, kichrayadi.
import { BitSVG } from '../theoryShell/Bit.jsx';
import { SCREEN_TYPE_LABELS } from '../theoryShell/screenTypes.js';
import { useLesson, useT } from '../theoryShell/runtime.js';

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
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>↻</button>
      )}
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const t = useT();
  const label = SCREEN_TYPE_LABELS[type];
  return <span className="screen-type">{label ? t(label) : type}</span>;
};

// Chizma uchun idish: SVG hech qachon kesilmaydi va o'zi markazlashadi.
export const FitSvg = ({ viewBox, children, className = '' }) => (
  <svg
    className={`fit-svg ${className}`}
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-hidden="true"
  >
    {children}
  </svg>
);

// `ratio` — chizmaning viewBox nisbati. Karta shu nisbat bo'yicha o'lchanadi,
// shuning uchun freym slaydni vertikal to'ldirmaydi va oq bo'sh joy qolmaydi.
// `fit` — karta chizma nisbatiga emas, KONTENT balandligiga moslashadi
// (jadval kabi past bloklar uchun: aks holda ostida bo'sh oq joy qoladi).
export const ModelCard = ({ children, plain = false, ratio = null, fit = false }) => (
  <div className="model-area">
    <div
      className={`model-card ${plain ? 'model-plain' : ''} ${fit ? 'model-card-fit' : ''}`}
      style={ratio ? { '--g4-model-ratio': ratio } : undefined}
    >
      {children}
    </div>
  </div>
);

// Blok faqat javobdan keyin chiziladi, shuning uchun ochilish holati kerak
// emas: paydo bo'lish CSS animatsiyasi bilan beriladi (holat = kamroq render).
//
// Bit HAR IKKALA holatda ham turadi — etalon Dars01 dagidek: to'g'ri javobda
// bosh irg'aydi va sakraydi, xatoda esa xijolat holatida qoladi (metodist
// qarori 2026-08-19: "yechim frame'larida bit rasmini qo'sh").
export const FeedbackBlock = ({ show, correct, showBit = true, children }) => {
  const t = useT();
  if (!show) return <div className="feedback" aria-hidden="true" />;
  return (
    <div role="status" className={`feedback ${correct ? 'correct' : 'wrong'} open`}>
      {showBit
        ? (
          <span className={`feedback-bit ${correct ? 'feedback-bit-solution' : ''}`}>
            <BitSVG state={correct ? 'nod' : 'awkward'} />
          </span>
        )
        : <span />}
      <p>
        <strong className="feedback-label">
          {correct
            ? t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' })
            : t({ uz: "USULNI TEKSHIRING", ru: 'ПРОВЕРЬТЕ СПОСОБ', en: 'CHECK THE METHOD' })}
        </strong>
        <span>{children}</span>
      </p>
    </div>
  );
};

// `order` — ko'rsatilgan o'rindan kontentdagi manba indeksiga xarita.
// DOM markerlari (`data-g4-source-index`, `data-g4-correct`) javob pozitsiyasi
// auditi uchun shart: ular bo'lmasa to'g'ri javob har doim bir joyda turgani
// mashinada tekshirilmaydi.
// Xato javob DOIMIY qizil bo'lib qolmaydi: `flashKey` bergan variant qisqa
// vaqt qizarib, so'ng neytral holatiga qaytadi va uni yana tanlash mumkin
// bo'ladi (metodist qarori 2026-08-21, `wrongAnswerFlash.js`). Variantlarni
// faqat TO'G'RI javob qulflaydi; qulflangach to'g'ri javob yashil bo'ladi,
// qolganlari xiralashadi.
//
// Qisqa variantlar butun kenglikka cho'zilmaydi. "33", "2", "332" kabi uchta
// son uch teng ustunga cho'zilganda ekranda javob tugmasi emas, uchta bo'sh oq
// lavha ko'rinardi (metodist qarori 2026-08-21, Dars13 7-slayd). Endi ular
// mazmuni bo'yicha o'lchanadi va markazga yig'iladi.
const SHORT_OPTION_CHARS = 9;
const isShortOption = (item) => String(item).trim().length <= SHORT_OPTION_CHARS;
// Sof son: faqat raqam, bo'sh joy, kasr chizig'i va arifmetik belgilar. Harf
// qatnashsa — bu so'z yoki birlik va u Manrope da qoladi: bitta chip ichida
// ikki shrift aralashmasligi kerak.
const isPlainNumber = (item) => /^[\d\s./:+\-−×÷=]+$/.test(String(item).trim());

export const Options = ({
  items, picked, flashKey = null, solved, correctIndex, disabled, onPick, stack = false, order = null,
}) => {
  const compact = !stack && items.length <= 4 && items.every(isShortOption);
  const numeric = compact && items.every(isPlainNumber);
  const layout = [
    stack || items.length > 4 ? 'options-stack' : '',
    !stack && !compact && items.length === 4 ? 'options-two' : '',
    compact ? 'options-compact' : '',
    numeric ? 'options-numeric' : '',
  ].filter(Boolean).join(' ');
  return (
    <div className={`options ${layout}`}>
      {items.map((item, index) => {
        const isRight = solved && index === correctIndex;
        const sourceIndex = order ? order[index] : index;
        const displayIndex = index;
        return (
          <button
            type="button"
            key={index}
            className={`option ${isRight ? 'option-right' : ''}`}
            data-g4-branch="choice"
            data-g4-source-index={sourceIndex}
            data-g4-display-index={displayIndex}
            data-g4-correct={index === correctIndex ? 'true' : 'false'}
            data-g4-wrong-flash={flashKey === index ? 'true' : undefined}
            data-g4-answer-dim={solved && index !== correctIndex ? 'true' : undefined}
            // Flash davomida hamma variant band: bola xato izohini eshitib
            // ulgursin. Flash tugagach o'sha variant yana bosiladi.
            disabled={disabled || solved}
            // Faqat yechilgan javob "tanlangan" bo'lib qoladi: xato tanlov
            // flash tugagach neytral holatga qaytadi va aria ham shuni aytadi.
            aria-pressed={solved && picked === index}
            onClick={() => onPick(index)}
          >
            <span className="option-key">{String.fromCharCode(65 + index)}</span>
            <span>{item}</span>
          </button>
        );
      })}
    </div>
  );
};

// Asosiy karkas. `hero` — faqat birinchi ekranda ishlatiladigan to'q sahna.
export const Stage = ({
  screen, eyebrow, audio, title, lead, question,
  children, answer, onPrev, onNext, canAdvance, nextLabel, finish = false,
}) => {
  const t = useT();
  const lesson = useLesson();
  const total = lesson?.totalScreens ?? 1;
  const meta = lesson?.screenMeta?.[screen];
  return (
    <main className="stage">
      <header className="stage-head">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${((screen + 1) / total) * 100}%` }} />
        </div>
        <div className="head-row">
          <span className="head-left">
            {meta && <ScreenTypeLabel type={meta.type} />}
            <span className="head-eyebrow">{t(eyebrow)}</span>
          </span>
          <span className="head-right">
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {total}</span>
          </span>
        </div>
      </header>

      <div className="stage-body">
        <div>
          {title && <h1 className="screen-title">{t(title)}</h1>}
          {lead && <p className="screen-lead">{t(lead)}</p>}
          {question && <h2 className="screen-question" style={{ marginTop: 6 }}>{t(question)}</h2>}
        </div>
        {children}
        {/* Slayd tagida ovoz matnini takrorlaydigan qator YO'Q (metodist qarori
            2026-08-19). Ovoz o'chirilganda mazmunni ekran matnining o'zi
            ko'taradi: sarlavha, yetakchi qator, savol va chizma. */}
        <div className="answer-area">{answer}</div>
      </div>

      <nav className="stage-nav">
        {screen === 0
          ? <span />
          : (
            <button type="button" className="btn-ghost" onClick={onPrev}>
              ← {t({ uz: 'Orqaga', ru: 'Назад', en: 'Back' })}
            </button>
          )}
        <button
          type="button"
          className={`btn-next ${canAdvance ? 'btn-ready' : ''}`}
          disabled={!canAdvance}
          onClick={onNext}
        >
          {nextLabel
            ? t(nextLabel)
            : finish
              ? t({ uz: 'Darsni yakunlash', ru: 'Завершить урок', en: 'Finish the lesson' })
              : t({ uz: 'Davom etish', ru: 'Продолжить', en: 'Continue' })} →
        </button>
      </nav>
    </main>
  );
};
