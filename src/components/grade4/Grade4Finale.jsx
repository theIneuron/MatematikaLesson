/* eslint-disable react-refresh/only-export-components -- Companion hooks and layout intentionally share one public module. */
import { isValidElement, useCallback, useEffect, useState } from 'react';

const COPY = {
  uz: {
    claim: "Unvonni olish",
    pending: "Avval yakuniy xulosani tinglang",
    // UZ draft: requires validation by an Uzbek mathematics methodologist.
    lead: "Darsning asosiy g'oyalari bitta xaritada birlashdi.",
    proof: "BOSHLANG'ICH MISSIYA YECHIMI",
    bridge: 'KEYINGI MISSIYA',
    terminal: 'KURS YAKUNLANDI',
  },
  ru: {
    claim: 'Получить звание',
    pending: 'Сначала дослушайте итог',
    lead: 'Главные идеи урока соединились в одной карте.',
    proof: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ',
    bridge: 'СЛЕДУЮЩАЯ МИССИЯ',
    terminal: 'КУРС ЗАВЕРШЁН',
  },
  en: {
    claim: 'Claim title',
    pending: 'Listen to the summary first',
    lead: "The lesson's key ideas now form one connected map.",
    proof: 'STARTING MISSION SOLVED',
    bridge: 'NEXT MISSION',
    terminal: 'COURSE COMPLETE',
  },
};

const GRADE4_FINALE_STYLES = `
.g4-shared-finale,
.g4-shared-finale * {
  box-sizing: border-box;
}
.g4-shared-finale {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 10px;
  overflow: hidden;
  color: #12212C;
  font-family: 'Manrope', system-ui, sans-serif;
}
.g4-shared-finale h1,
.g4-shared-finale h2,
.g4-shared-finale p {
  margin: 0;
}
.g4-shared-finale .finale-heading {
  min-width: 0;
  padding: 12px 15px;
  border-radius: 17px;
  background: linear-gradient(135deg, #FFFFFF, #E5F5F6);
  box-shadow: 0 12px 28px -22px rgba(58, 53, 48, .38);
}
.g4-shared-finale .finale-heading > span {
  display: block;
  margin-bottom: 4px;
  color: #FF5B35;
  font: 900 9px/1 'JetBrains Mono', monospace;
  letter-spacing: .15em;
}
.g4-shared-finale .finale-heading h1 {
  color: #173B52;
  font: 650 clamp(20px, 3vw, 28px)/1.08 'Source Serif 4', Georgia, serif;
  overflow-wrap: anywhere;
}
.g4-shared-finale .finale-heading p {
  max-width: 760px;
  margin-top: 5px;
  color: #50616D;
  font-size: 12px;
  line-height: 1.42;
  overflow-wrap: anywhere;
}
.g4-shared-finale .finale-layout {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
  align-items: stretch;
  overflow: hidden;
}
.g4-shared-finale .finale-main {
  display: contents;
}
.g4-shared-finale .finale-actions {
  position: relative;
  min-width: 0;
  min-height: 70px;
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.g4-shared-finale .finale-mastery {
  min-width: 0;
  min-height: 0;
  grid-column: 1;
  grid-row: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;
}
.g4-shared-finale .finale-takeaway {
  min-width: 0;
  min-height: 52px;
  padding: 8px 9px;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  border-radius: 14px;
  background: #FFFFFF;
  box-shadow: 0 10px 24px -19px rgba(58, 53, 48, .36);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .34s ease, transform .34s ease;
}
.g4-shared-finale .finale-takeaway.is-visible {
  opacity: 1;
  transform: none;
}
.g4-shared-finale .finale-takeaway > span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: #FFFFFF;
  background: #168FA3;
  font: 900 10px/1 'JetBrains Mono', monospace;
}
.g4-shared-finale .finale-takeaway:nth-child(2) > span {
  background: #FF5B35;
}
.g4-shared-finale .finale-takeaway:nth-child(3) > span {
  background: #227A53;
}
.g4-shared-finale .finale-takeaway p {
  color: #12212C;
  font-size: 12px;
  line-height: 1.34;
  font-weight: 720;
  overflow-wrap: anywhere;
}
.g4-shared-finale .finale-proof,
.g4-shared-finale .finale-bridge {
  min-width: 0;
  opacity: 0;
  transform: translateY(7px);
  transition: opacity .34s ease, transform .34s ease;
}
.g4-shared-finale .finale-proof.is-visible,
.g4-shared-finale .finale-bridge.is-visible {
  opacity: 1;
  transform: none;
}
.g4-shared-finale .finale-proof {
  grid-column: 1;
  grid-row: 3;
  padding: 8px 10px;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 4px;
  border-radius: 13px;
  background: #E7F3EC;
  box-shadow: inset 4px 0 0 #227A53;
}
.g4-shared-finale .finale-proof > span,
.g4-shared-finale .finale-bridge strong {
  color: #227A53;
  font: 900 9px/1.2 'JetBrains Mono', monospace;
  letter-spacing: .1em;
}
.g4-shared-finale .finale-proof > strong {
  min-width: 0;
  color: #173B52;
  font: 800 12px/1.25 'JetBrains Mono', monospace;
  overflow-wrap: anywhere;
}
.g4-shared-finale .finale-proof p,
.g4-shared-finale .finale-bridge p {
  color: #50616D;
  font-size: 11px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}
.g4-shared-finale .finale-bridge {
  grid-column: 1;
  grid-row: 4;
  padding: 8px 10px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  border-radius: 13px;
  background: #FFF0EA;
}
.g4-shared-finale .finale-bridge > span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: #FFFFFF;
  background: #FF5B35;
  font-weight: 900;
}
.g4-shared-finale .finale-bridge strong {
  color: #FF5B35;
}
.g4-shared-finale .finale-bridge p {
  margin-top: 2px;
}
.g4-shared-finale .finale-bridge.is-terminal {
  background: #E7F3EC;
}
.g4-shared-finale .finale-bridge.is-terminal > span {
  background: #227A53;
}
.g4-shared-finale .finale-bridge.is-terminal strong {
  color: #227A53;
}
.g4-shared-finale .g4-title-claim {
  width: 100%;
  min-height: 70px;
  padding: 9px 12px;
  border: 0;
  border-radius: 17px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  color: #FFFFFF;
  background: linear-gradient(135deg, #0E6978, #173B52);
  box-shadow: 0 22px 42px -25px rgba(14, 105, 120, .9);
  text-align: left;
  cursor: pointer;
  transition: transform .5s ease, box-shadow .5s ease;
}
.g4-shared-finale .g4-title-claim > span {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #5A3A00;
  background: linear-gradient(145deg, #FFE284, #FFC23C);
  font-size: 19px;
}
.g4-shared-finale .g4-title-claim > strong {
  font: 750 16px/1.2 'Source Serif 4', Georgia, serif;
  overflow-wrap: anywhere;
}
.g4-shared-finale .g4-title-claim:hover:not(:disabled) {
  transform: translateY(-2px);
}
.g4-shared-finale .g4-title-claim:focus-visible {
  outline: 3px solid rgba(22, 143, 163, .48);
  outline-offset: 3px;
}
.g4-shared-finale .g4-title-claim:disabled {
  cursor: default;
  filter: saturate(.55);
  opacity: .68;
}
.g4-shared-finale .finale-actions > :is(.g4-title-claim, .g4-title-card-stage) {
  width: 100%;
}
.g4-shared-finale .finale-actions[data-g4-has-bit="true"] .g4-title-claim {
  padding-right: 82px;
}
.g4-shared-finale .finale-bit-slot {
  position: absolute;
  z-index: 2;
  right: 4px;
  bottom: 0;
  width: 72px;
  height: 90px;
  display: grid;
  place-items: end center;
  overflow: hidden;
  pointer-events: none;
}
.g4-shared-finale .finale-bit-frame {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: end center;
  overflow: hidden;
}
.g4-shared-finale .finale-bit-frame > * {
  max-width: 100%;
  max-height: 100%;
}

@media (min-width: 640px) {
  .g4-shared-finale .finale-layout {
    grid-template-columns: minmax(270px, .58fr) minmax(0, 1fr);
    gap: 9px 12px;
  }
  .g4-shared-finale .finale-actions {
    grid-column: 1;
    grid-row: 1;
    height: 100%;
  }
  .g4-shared-finale .finale-mastery {
    grid-column: 2;
    grid-row: 1;
    gap: 8px;
  }
  .g4-shared-finale .finale-takeaway {
    min-height: 66px;
    padding: 10px;
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 9px;
  }
  .g4-shared-finale .finale-takeaway p {
    font-size: 14px;
    line-height: 1.38;
  }
  .g4-shared-finale .finale-proof {
    grid-column: 1 / -1;
    grid-row: 2;
    padding: 9px 12px;
    grid-template-columns: auto minmax(0, .7fr) minmax(0, 1.3fr);
    gap: 9px;
  }
  .g4-shared-finale .finale-proof:not(.has-value) {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .g4-shared-finale .finale-proof > span,
  .g4-shared-finale .finale-bridge strong {
    font-size: 12px;
  }
  .g4-shared-finale .finale-proof > strong {
    font-size: 15px;
  }
  .g4-shared-finale .finale-proof p,
  .g4-shared-finale .finale-bridge p {
    font-size: 14px;
  }
  .g4-shared-finale .finale-bridge {
    grid-column: 1 / -1;
    grid-row: 3;
    padding: 9px 11px;
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 9px;
  }
  .g4-shared-finale .finale-bridge > span {
    width: 30px;
    height: 30px;
    border-radius: 10px;
  }
  .g4-shared-finale .finale-actions > :is(.g4-title-claim, .g4-title-card-stage) {
    flex: 0 0 calc(100% + 2px);
    height: calc(100% + 2px);
    min-height: calc(100% + 2px);
    transform: translateY(-2px);
  }
}

@media (min-width: 640px) and (max-width: 1024px) {
  .g4-title-reveal-overlay .g4-title-reveal-card h2 {
    font-size: 58px;
  }
}

@media (min-width: 761px) {
  .g4-shared-finale .finale-layout {
    grid-template-columns: minmax(340px, .58fr) minmax(0, 1fr);
  }
}

@media (max-width: 639.98px) {
  .g4-shared-finale {
    gap: 6px;
  }
  .g4-shared-finale .finale-heading {
    padding: 8px 10px;
  }
  .g4-shared-finale .finale-heading h1 {
    font-size: 19px;
  }
  .g4-shared-finale .finale-heading p {
    display: none;
  }
  .g4-shared-finale .finale-actions {
    min-height: 70px;
    gap: 4px;
  }
  .g4-shared-finale .finale-takeaway p {
    font-size: 10px;
    line-height: 1.25;
  }
  .g4-shared-finale .finale-bit-slot {
    width: 58px;
    height: 72px;
  }
  .g4-shared-finale .finale-actions[data-g4-has-bit="true"] .g4-title-claim {
    padding-right: 64px;
  }
}

@media (max-width: 639.98px) and (max-height: 700px) {
  .g4-shared-finale {
    gap: 4px;
  }
  .g4-shared-finale .finale-heading {
    padding: 5px 8px;
  }
  .g4-shared-finale .finale-heading h1 {
    font-size: 16px;
  }
  .g4-shared-finale .finale-layout,
  .g4-shared-finale .finale-actions,
  .g4-shared-finale .finale-mastery {
    gap: 3px;
  }
  .g4-shared-finale .finale-actions {
    min-height: 54px;
  }
  .g4-shared-finale .finale-takeaway {
    min-height: 0;
    padding: 4px 6px;
    grid-template-columns: 22px minmax(0, 1fr);
    gap: 4px;
  }
  .g4-shared-finale .finale-takeaway > span {
    width: 22px;
    height: 22px;
    border-radius: 7px;
    font-size: 8px;
  }
  .g4-shared-finale .finale-takeaway p {
    font-size: 8px;
    line-height: 1.2;
  }
  .g4-shared-finale .finale-proof {
    padding: 4px 6px;
    gap: 2px;
  }
  .g4-shared-finale .finale-proof p,
  .g4-shared-finale .finale-bridge p {
    font-size: 9px;
    line-height: 1.2;
  }
  .g4-shared-finale .finale-bridge {
    padding: 4px 6px;
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 4px;
  }
  .g4-shared-finale .finale-bridge > span {
    width: 20px;
    height: 20px;
    border-radius: 7px;
  }
  .g4-shared-finale .g4-title-claim {
    min-height: 54px;
    padding: 4px 7px;
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 7px;
  }
  .g4-shared-finale .g4-title-claim > span {
    width: 32px;
    height: 32px;
  }
  .g4-shared-finale .g4-title-claim > strong {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .g4-shared-finale,
  .g4-shared-finale *,
  .g4-shared-finale *::before,
  .g4-shared-finale *::after {
    animation: none !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .g4-shared-finale .finale-takeaway,
  .g4-shared-finale .finale-proof,
  .g4-shared-finale .finale-bridge {
    opacity: 1 !important;
    transform: none !important;
  }
}
`;

function normalizeLang(lang) {
  return ['uz', 'ru', 'en'].includes(lang) ? lang : 'uz';
}

function localized(value, lang) {
  if (value == null || typeof value === 'boolean') return '';
  if (typeof value === 'string' || typeof value === 'number' || isValidElement(value)) return value;
  if (Array.isArray(value)) return value;
  return value[lang] ?? value.uz ?? value.ru ?? value.en ?? '';
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => (
    typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  ));

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (event) => setReduced(event.matches);
    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener?.(update);
    return () => media.removeListener?.(update);
  }, []);

  return reduced;
}

export function useGrade4FinaleReveal({ audio, count = 4, interval = 500 }) {
  const reduced = usePrefersReducedMotion();
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 4;
  const safeInterval = Number.isFinite(interval) ? Math.max(0, interval) : 500;
  const muted = audio?.muted === true;
  const completed = audio?.completed === true;
  const [visible, setVisible] = useState(() => (
    reduced || muted || completed ? safeCount : 0
  ));

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const timers = [];
    const schedule = (nextVisible, delay) => {
      timers.push(window.setTimeout(() => setVisible(nextVisible), delay));
    };

    if (reduced || muted || completed || safeCount === 0) {
      schedule(safeCount, 0);
    } else {
      schedule(0, 0);
      const initialDelay = Math.min(300, safeInterval);
      for (let index = 0; index < safeCount; index += 1) {
        schedule(index + 1, initialDelay + index * safeInterval);
      }
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [completed, muted, reduced, safeCount, safeInterval]);

  return visible;
}

export function useGrade4TitleClaim({ storedAnswer, audio, onClaim }) {
  const reduced = usePrefersReducedMotion();
  const [titleClaimed, setTitleClaimed] = useState(() => storedAnswer?.titleClaimed === true);
  const [revealRequested, setRevealRequested] = useState(false);
  const canClaimTitle = audio?.completed === true || audio?.muted === true;

  useEffect(() => {
    if (!revealRequested || typeof window === 'undefined') return undefined;
    const timer = window.setTimeout(
      () => setRevealRequested(false),
      // Some approved lesson overlays own a 120/3900 ms visibility timer.
      // Keep the trigger alive slightly longer so their cleanup cannot cancel
      // that local timer before it hides the portal.
      reduced ? 350 : 4300,
    );
    return () => window.clearTimeout(timer);
  }, [reduced, revealRequested]);

  const claimTitle = useCallback(() => {
    if (!canClaimTitle || titleClaimed) return false;
    setTitleClaimed(true);
    setRevealRequested(true);
    onClaim?.();
    return true;
  }, [canClaimTitle, onClaim, titleClaimed]);

  return {
    titleClaimed,
    canClaimTitle,
    revealRequested,
    claimTitle,
  };
}

export function Grade4Finale({
  lang,
  heading = {},
  takeaways = [],
  proof = {},
  bridge = {},
  visible = 0,
  complete = false,
  canClaimTitle = false,
  titleClaimed = false,
  onClaimTitle,
  claimLabel,
  pendingLabel,
  renderTitleReveal,
  renderTitleCard,
  bitSlot,
  medalTier,
  revealSteps = {},
}) {
  const currentLang = normalizeLang(lang);
  const copy = COPY[currentLang];
  const resolvedHeading = {
    eyebrow: localized(heading.eyebrow, currentLang),
    title: localized(heading.title, currentLang),
    lead: localized(heading.lead, currentLang) || copy.lead,
  };
  const resolvedClaimLabel = localized(claimLabel, currentLang) || copy.claim;
  const resolvedPendingLabel = localized(pendingLabel, currentLang) || copy.pending;
  const resolvedProof = {
    label: localized(proof.label, currentLang) || copy.proof,
    value: localized(proof.value, currentLang),
    text: localized(proof.text, currentLang),
  };
  const terminal = bridge.terminal === true;
  const resolvedBridge = {
    label: localized(bridge.label, currentLang) || (terminal ? copy.terminal : copy.bridge),
    text: localized(bridge.text, currentLang),
  };
  const threeTakeaways = Array.from({ length: 3 }, (_, index) => (
    localized(takeaways[index]?.text ?? takeaways[index], currentLang)
  ));
  const visibleCount = Number.isFinite(visible) ? visible : 0;
  const proofStep = Number.isFinite(revealSteps.proof) ? revealSteps.proof : 3;
  const bridgeStep = Number.isFinite(revealSteps.bridge) ? revealSteps.bridge : null;
  const activeBitSlot = titleClaimed ? null : bitSlot;

  return (
    <>
      <style data-g4-finale-styles="shared">{GRADE4_FINALE_STYLES}</style>
      <div
        className="screen-stack finale-screen g4-shared-finale"
        data-g4-final-layout="title-left-steps-right"
        data-g4-final-reflection="none"
        data-g4-finale-complete={complete ? 'true' : 'false'}
        data-medal-tier={medalTier || undefined}
      >
        {renderTitleReveal?.()}

        <header className="finale-heading" data-g4-role="final-heading">
          <span>{resolvedHeading.eyebrow}</span>
          <h1>{resolvedHeading.title}</h1>
          {resolvedHeading.lead ? <p>{resolvedHeading.lead}</p> : null}
        </header>

        <div className="finale-layout">
          <div className="finale-main">
            <div className="finale-mastery" data-g4-role="final-takeaways">
              {threeTakeaways.map((takeaway, index) => (
                <article
                  className={`finale-takeaway ${visibleCount >= index + 1 ? 'is-visible' : ''}`}
                  data-g4-role="final-takeaway"
                  key={index}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{takeaway}</p>
                </article>
              ))}
            </div>

            <section
              className={`finale-proof ${resolvedProof.value ? 'has-value' : ''} ${visibleCount >= proofStep ? 'is-visible' : ''}`}
              data-g4-role="final-proof"
            >
              <span>{resolvedProof.label}</span>
              {resolvedProof.value ? <strong>{resolvedProof.value}</strong> : null}
              <p>{resolvedProof.text}</p>
            </section>

            <section
              className={`finale-bridge ${bridgeStep === null ? (complete ? 'is-visible' : '') : (visibleCount >= bridgeStep ? 'is-visible' : '')} ${terminal ? 'is-terminal' : ''}`}
              data-g4-role="final-bridge"
              data-g4-terminal={terminal ? 'true' : 'false'}
            >
              <span aria-hidden="true">{terminal ? '✓' : '→'}</span>
              <div>
                <strong>{resolvedBridge.label}</strong>
                <p>{resolvedBridge.text}</p>
              </div>
            </section>
          </div>

          <aside
            className="finale-actions"
            data-g4-has-bit={activeBitSlot ? 'true' : 'false'}
            data-medal-tier={medalTier || undefined}
          >
            {activeBitSlot ? (
              <div className="finale-bit-slot" data-g4-role="final-bit">
                <div className="finale-bit-frame" data-g4-role="visual-frame">
                  {activeBitSlot}
                </div>
              </div>
            ) : null}
            {!titleClaimed ? (
              <button
                type="button"
                className="btn-white-accent g4-title-claim"
                data-g4-role="title-claim"
                data-medal-tier={medalTier || undefined}
                disabled={!canClaimTitle}
                onClick={onClaimTitle}
                aria-label={resolvedClaimLabel}
              >
                <span aria-hidden="true">★</span>
                <strong>{canClaimTitle ? resolvedClaimLabel : resolvedPendingLabel}</strong>
              </button>
            ) : renderTitleCard?.()}
          </aside>
        </div>
      </div>
    </>
  );
}
