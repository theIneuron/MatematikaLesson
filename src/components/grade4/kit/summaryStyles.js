// Yakuniy ekran (s15) uslublari — etalon Dars01 dan bayt-aniq olingan.
//
// Metodist talabi (2026-08-19): 41-51 darslarning oxirgi slaydi etalonga
// TOLIQ mos bolsin. Blok Dars01.jsx dan ozgartirilmasdan kochirildi va umumiy
// modulga chiqarildi — har darsda takrorlanmasin (CLAUDE.md 5-bolim).
import { T } from '../theoryShell/palette.js';

export const SUMMARY_STYLES = `
@keyframes g4bitfloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.screen-stack {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(12px, 2vw, 18px);
  animation: screen-in .5s cubic-bezier(.22,.8,.3,1) both;
}
@keyframes screen-in {
  from { opacity: 0; transform: translateY(16px) scale(.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.bit-answer-comment {
  min-width: 0;
  min-height: 72px;
  padding: 7px 12px 7px 6px;
  border: 1px solid rgba(34,122,83,.18);
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: ${T.success};
  background: linear-gradient(135deg, #FFFFFF, ${T.successSoft});
  box-shadow: 0 12px 26px -20px rgba(34,122,83,.5);
}
.bit-answer-comment-figure {
  width: 51px;
  height: 64px;
  flex: 0 0 51px;
  animation: g4reactionhop .72s ease .72s both;
}
.bit-answer-comment-figure .g1-char { width: 100%; height: 100%; }
.bit-answer-comment-copy {
  min-width: 0;
  display: grid;
  gap: 3px;
}
.bit-solution-kicker {
  color: ${T.success};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .12em;
}
.bit-solution-formula {
  color: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(13px, 2vw, 17px);
  font-weight: 900;
  line-height: 1.24;
}
.bit-answer-comment-copy > small {
  color: ${T.success};
  font-size: 9px;
  font-weight: 850;
  line-height: 1.25;
}
.bit-answer-comment-copy > strong {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 15px;
  line-height: 1.2;
}
.bit-answer-comment-copy p {
  color: ${T.ink2};
  font-size: 11px;
  line-height: 1.35;
}
@keyframes g4reactionhop {
  0%, 100% { transform: translateY(0) scale(1); }
  35% { transform: translateY(-9px) scale(1.08); }
  65% { transform: translateY(0) scale(1); }
}
.summary-stack { gap: 12px; }
.reward-stage {
  position: relative;
  width: min(840px, 100%);
  min-height: 154px;
  margin: 0 auto;
  padding: 16px 145px 15px 108px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  overflow: hidden;
  color: #FFFFFF;
  background:
    radial-gradient(circle at 82% 20%, rgba(255,194,60,.26), transparent 30%),
    linear-gradient(135deg, #173B52, #0E6978);
  box-shadow: 0 24px 50px -30px rgba(14,33,44,.8);
  transition: transform .5s ease, box-shadow .5s ease;
}
.reward-locked { filter: saturate(.72); }
.reward-unlocked {
  transform: translateY(-2px);
  box-shadow: 0 28px 58px -27px rgba(22,143,163,.8);
}
.reward-bit {
  position: absolute;
  right: 24px;
  bottom: 7px;
  width: 92px;
  height: 115px;
}
.reward-bit .g1-char { width: 100%; height: 100%; }
.reward-unlocked .reward-bit { animation: g4bitfloat 2.8s ease-in-out infinite; }
.reward-medal {
  position: absolute;
  left: 24px;
  top: 50%;
  width: 66px;
  height: 66px;
  border: 4px solid rgba(255,255,255,.58);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #5A3A00;
  background: linear-gradient(145deg, #FFE284, #FFC23C);
  box-shadow: 0 0 0 8px rgba(255,255,255,.08), 0 15px 30px -15px rgba(0,0,0,.6);
  font-size: 30px;
}
.reward-kicker {
  color: #A8EAF0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .13em;
}
.reward-stage h1 {
  max-width: 590px;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 30px);
  line-height: 1.05;
}
.reward-stage > p {
  max-width: 580px;
  color: rgba(255,255,255,.78);
  font-size: 12px;
  line-height: 1.4;
}
.reward-score {
  align-self: flex-start;
  margin-top: 5px;
  padding: 5px 9px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,.10);
}
.reward-score strong { color: #FFE284; font-family: 'JetBrains Mono', monospace; }
.reward-score span { color: rgba(255,255,255,.72); font-size: 9px; }
.reward-confetti { position: absolute; inset: 0; pointer-events: none; }
.reward-confetti i {
  position: absolute;
  top: -16px;
  width: 7px;
  height: 12px;
  border-radius: 2px;
  animation: reward-confetti 2.4s linear infinite;
}
.reward-confetti i:nth-child(4n+1) { background: #FFC23C; }
.reward-confetti i:nth-child(4n+2) { background: #FF5B35; }
.reward-confetti i:nth-child(4n+3) { background: #77E1EA; }
.reward-confetti i:nth-child(4n) { background: #95C93D; }
.reward-confetti i:nth-child(1) { left: 8%; animation-delay: -.3s; }
.reward-confetti i:nth-child(2) { left: 17%; animation-delay: -1.1s; }
.reward-confetti i:nth-child(3) { left: 29%; animation-delay: -.7s; }
.reward-confetti i:nth-child(4) { left: 41%; animation-delay: -1.7s; }
.reward-confetti i:nth-child(5) { left: 52%; animation-delay: -.2s; }
.reward-confetti i:nth-child(6) { left: 63%; animation-delay: -1.3s; }
.reward-confetti i:nth-child(7) { left: 73%; animation-delay: -.8s; }
.reward-confetti i:nth-child(8) { left: 84%; animation-delay: -1.9s; }
.reward-confetti i:nth-child(9) { left: 12%; animation-delay: -2s; }
.reward-confetti i:nth-child(10) { left: 36%; animation-delay: -1.4s; }
.reward-confetti i:nth-child(11) { left: 68%; animation-delay: -.5s; }
.reward-confetti i:nth-child(12) { left: 91%; animation-delay: -1.6s; }
@keyframes reward-confetti {
  to { transform: translateY(230px) rotate(460deg); }
}
.unlock-guide {
  width: min(840px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 9px;
}
.unlock-guide > b { color: ${T.accent}; font-size: 22px; }
.unlock-guide-step {
  min-height: 58px;
  padding: 7px 10px;
  border: 1px solid rgba(22,143,163,.15);
  border-radius: 15px;
  display: grid;
  grid-template-columns: 23px 29px 1fr;
  align-items: center;
  gap: 7px;
  color: ${T.ink2};
  background: rgba(255,255,255,.86);
}
.unlock-guide-step > span {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
}
.unlock-guide-step > i {
  font-size: 21px;
  font-style: normal;
  text-align: center;
  animation: guide-point 1.35s ease-in-out infinite;
}
@keyframes guide-point {
  50% { transform: translateY(4px); }
}
.unlock-guide-step p { font-size: 11px; line-height: 1.3; font-weight: 800; }
.unlock-guide-done .unlock-guide-step {
  border-color: rgba(34,122,83,.2);
  color: ${T.success};
  background: ${T.successSoft};
}
.unlock-guide-done .unlock-guide-step > span { background: ${T.success}; }
.unlock-guide-done .unlock-guide-step > i { animation: none; }
.summary-action-layout {
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-items: stretch;
}
.summary-rule-strip {
  min-width: 0;
  height: 100%;
  padding: 12px;
  border: 2px solid rgba(22,143,163,.28);
  border-radius: 17px;
  background:
    linear-gradient(135deg, rgba(230,247,250,.72), transparent 42%),
    rgba(255,255,255,.94);
  box-shadow:
    inset 5px 0 0 ${T.cyan},
    0 15px 32px -23px rgba(22,143,163,.7);
}
.summary-rule-heading {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.summary-rule-heading > span {
  min-width: 55px;
  padding: 5px 8px;
  border-radius: 9px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 900;
  text-align: center;
  box-shadow: 0 7px 15px -10px rgba(22,143,163,.9);
}
.summary-rule-strip h2 { margin: 0; font-size: 14px; }
.summary-rule-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 6px;
}
.summary-rule-items > span {
  min-width: 0;
  padding: 7px;
  border: 1px solid rgba(22,143,163,.11);
  border-radius: 11px;
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 6px;
  color: ${T.ink2};
  background: rgba(255,255,255,.82);
}
.summary-rule-strip i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-style: normal;
  font-weight: 900;
}
.summary-rule-strip p { font-size: 10px; line-height: 1.3; }
.summary-card {
  min-width: 0;
  height: 100%;
  padding: 13px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,.92);
  box-shadow: 0 12px 26px -21px rgba(${T.shadowBase},.5);
}
.reflection-card > .summary-question-kicker,
.reflection-card > .summary-question,
.reflection-card > .summary-question-stem,
.reflection-card > .reflection-options,
.reflection-card > .reflection-resolution,
.reflection-card > .feedback {
  flex-shrink: 0;
}
.reflection-resolution {
  display: grid;
  gap: 7px;
}
.summary-card h2 { margin-bottom: 8px; font-size: 14px; }
.summary-card ul { padding-left: 17px; display: grid; gap: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.35; }
.summary-question-kicker {
  margin-bottom: 4px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .1em;
}
.summary-card .summary-question {
  margin-bottom: 4px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 15px;
  line-height: 1.18;
}
.summary-question-stem {
  margin-bottom: 7px !important;
  color: ${T.ink2};
  font-size: 10px;
  line-height: 1.3;
}
.reflection-options {
  max-height: 180px;
  display: grid;
  gap: 6px;
  overflow: hidden;
  opacity: 1;
  transition:
    max-height .75s cubic-bezier(.22,.8,.3,1) .48s,
    opacity .28s ease .52s,
    margin .75s cubic-bezier(.22,.8,.3,1) .48s;
}
.reflection-options-solved {
  max-height: 0;
  margin-block: 0;
  opacity: 0;
  pointer-events: none;
}
.reflection-option {
  min-height: 34px;
  padding: 7px 9px;
  border: 0;
  border-radius: 10px;
  color: ${T.ink};
  background: #F4F7F5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
}
.reflection-option > span {
  width: 21px;
  height: 21px;
  flex: 0 0 21px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
}
.reflection-correct { color: ${T.success}; background: ${T.successSoft}; }
.reflection-wrong { color: ${T.warn}; background: ${T.warnSoft}; }
.reflection-solved {
  min-height: 42px;
  padding: 9px 11px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  color: ${T.success};
  background: ${T.successSoft};
  font-size: 11px;
  font-weight: 800;
}
.reflection-card .feedback-card {
  min-height: 62px;
  padding: 5px 10px 5px 6px;
}
.reflection-card .g4-bit-reaction-figure {
  width: 44px;
  height: 54px;
  flex-basis: 44px;
}
.reflection-card .g4-bit-reaction-copy { font-size: 14px; }
.final-mission-heading {
  width: min(840px, 100%);
  margin: 0 auto;
  padding: 12px 16px;
  border: 1px solid rgba(255,91,53,.17);
  border-radius: 17px;
  background:
    linear-gradient(100deg, rgba(255,91,53,.09), transparent 48%),
    rgba(255,255,255,.9);
  box-shadow: 0 13px 28px -24px rgba(255,91,53,.72);
}
.final-mission-heading > span {
  display: flex;
  align-items: center;
  gap: 7px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .12em;
}
.final-mission-heading > span i {
  font-size: 8px;
  animation: final-marker-pulse 1.5s ease-in-out infinite;
}
.final-mission-heading h1 {
  margin-top: 3px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 28px);
  line-height: 1.08;
}
.final-mission-heading p {
  margin-top: 3px;
  color: ${T.ink2};
  font-size: 11px;
  line-height: 1.32;
}
@keyframes final-marker-pulse {
  50% { opacity: .45; transform: scale(.8); }
}
.summary-final-layout {
  width: min(840px, 100%);
  margin: 0 auto;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}
.final-question-card {
  height: auto;
  border: 2px solid rgba(255,91,53,.22);
  box-shadow:
    inset 0 4px 0 rgba(255,91,53,.88),
    0 18px 38px -28px rgba(255,91,53,.7);
}
.final-question-card .summary-question-kicker {
  min-height: 25px;
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #FFFFFF;
  background: linear-gradient(90deg, ${T.accent}, #FF7658);
}
.final-question-card .summary-question-kicker > b {
  margin-left: auto;
  padding: 3px 6px;
  border-radius: 999px;
  color: #7D250F;
  background: rgba(255,255,255,.76);
  font-size: 7px;
  letter-spacing: .08em;
}
.final-question-card .summary-question {
  font-size: clamp(17px, 2.4vw, 22px);
  line-height: 1.18;
}
.summary-support-column {
  min-width: 0;
  display: grid;
  gap: 9px;
}
.summary-rules-disclosure {
  min-width: 0;
  border: 1px solid rgba(22,143,163,.2);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255,255,255,.94);
  box-shadow: 0 14px 30px -24px rgba(22,143,163,.72);
}
.summary-rules-toggle {
  width: 100%;
  min-height: 64px;
  padding: 8px 10px;
  border: 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 9px;
  color: ${T.ink};
  background:
    linear-gradient(135deg, rgba(230,247,250,.8), transparent 62%),
    #FFFFFF;
  cursor: pointer;
  text-align: left;
}
.summary-rules-toggle > span {
  min-width: 55px;
  padding: 7px 8px;
  border-radius: 10px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 900;
  text-align: center;
}
.summary-rules-toggle > div { min-width: 0; display: grid; gap: 2px; }
.summary-rules-toggle strong { font-size: 13px; line-height: 1.2; }
.summary-rules-toggle small { color: ${T.cyan}; font-size: 9px; font-weight: 800; }
.summary-rules-toggle > i {
  color: ${T.cyan};
  font-size: 24px;
  font-style: normal;
  transform: rotate(0);
  transition: transform .55s cubic-bezier(.16,1,.3,1);
}
.summary-rules-open .summary-rules-toggle > i { transform: rotate(180deg); }
.summary-rules-panel {
  max-height: 0;
  padding: 0 9px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-7px);
  transition:
    max-height .65s cubic-bezier(.22,.8,.3,1),
    padding .65s cubic-bezier(.22,.8,.3,1),
    opacity .4s ease,
    transform .55s ease;
}
.summary-rules-open .summary-rules-panel {
  max-height: 260px;
  padding: 0 9px 9px;
  opacity: 1;
  transform: translateY(0);
}
.summary-rules-panel .summary-rule-items > span {
  padding: 6px;
  grid-template-columns: 20px 1fr;
  gap: 5px;
}
.summary-rules-panel .summary-rule-items > span > i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-style: normal;
}
.summary-rules-panel .summary-rule-items p { font-size: 9px; line-height: 1.22; }
.reward-stage-compact {
  width: 100%;
  min-height: 116px;
  margin: 0;
  padding: 12px 82px 11px 67px;
  border-radius: 17px;
  gap: 4px;
}
.reward-stage-compact .reward-medal {
  left: 11px;
  width: 44px;
  height: 44px;
  border-width: 3px;
  font-size: 19px;
}
.reward-stage-compact .reward-bit {
  right: 3px;
  bottom: 2px;
  width: 72px;
  height: 90px;
}
.reward-stage-compact h2 {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(16px, 2.2vw, 21px);
  line-height: 1.05;
}
.rank-boost-overlay {
  position: fixed;
  inset: 0;
  z-index: 120;
  padding: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  overscroll-behavior: contain;
  background: rgba(8,13,24,.64);
  backdrop-filter: blur(2px) saturate(.78);
  animation: rank-overlay-life 3.8s ease both;
}
.rank-boost-card {
  position: relative;
  isolation: isolate;
  width: 100%;
  min-height: 100dvh;
  padding: 36px 24px;
  border: 0;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: hidden;
  color: #FFFFFF;
  text-align: center;
  background: radial-gradient(circle at 50% 50%, rgba(255,214,80,.17), transparent 31%);
}
.rank-boost-card::after {
  content: '';
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  width: min(440px, 82vw);
  height: min(440px, 82vw);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,222,105,.17), transparent 68%);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.rank-boost-rays {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  width: 160vmax;
  height: 160vmax;
  border-radius: 50%;
  opacity: .28;
  background: repeating-conic-gradient(
    from -4deg,
    rgba(255,218,91,.88) 0 8deg,
    transparent 8deg 20deg
  );
  transform: translate(-50%, -50%);
  animation:
    rank-rays-in .8s cubic-bezier(.16,1,.3,1) both,
    rank-rays 26s linear .8s infinite;
}
.rank-boost-medal {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: 112px;
  height: 112px;
  margin: 0;
  border: 6px solid rgba(255,255,255,.72);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #653C00;
  background: linear-gradient(145deg, #FFF2A0, #FFC13B);
  box-shadow:
    0 0 0 13px rgba(255,255,255,.09),
    0 0 54px 10px rgba(255,204,63,.38),
    0 22px 38px -18px rgba(0,0,0,.7);
  font-size: 52px;
  animation: rank-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both;
}
.rank-boost-card h2 {
  position: absolute;
  top: calc(50% + 82px);
  left: 50%;
  z-index: 2;
  width: min(680px, calc(100vw - 48px));
  margin: 0;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(34px, 5vw, 58px);
  line-height: 1.02;
  text-shadow: 0 4px 24px rgba(0,0,0,.72);
  transform: translateX(-50%);
  animation: rank-title-in .7s ease .52s both;
}
.rank-boost-confetti { position: absolute; inset: 0; pointer-events: none; }
.rank-boost-confetti i {
  position: absolute;
  top: -20px;
  left: calc(3% + var(--boost-i) * 5.35%);
  width: 8px;
  height: 14px;
  border-radius: 2px;
  background: #FFE284;
  animation: rank-confetti 2.4s linear var(--boost-delay) infinite;
}
.rank-boost-confetti i:nth-child(3n+2) { background: #FF7050; }
.rank-boost-confetti i:nth-child(3n) { background: #77E1EA; }
@keyframes rank-overlay-life {
  0% { opacity: 0; }
  12%, 84% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes rank-medal-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(.25) rotate(-25deg); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0); }
}
@keyframes rank-title-in {
  from { opacity: 0; transform: translate(-50%, 14px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes rank-rays-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(.5); }
  to { opacity: .28; transform: translate(-50%, -50%) scale(1); }
}
@keyframes rank-rays {
  from { transform: translate(-50%, -50%) rotate(0); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes rank-confetti {
  to { transform: translateY(470px) rotate(560deg); }
}
.next-mission {
  padding: 10px 13px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #FFFFFF;
  background: ${T.navy};
}
.next-mission span { color: #98E1E5; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; }
.next-mission p { font-size: 12px; }

/* Kichik ekran va past oyna: yakuniy ekran siqiladi, lekin tuzilishi
   etalondagidek qoladi (qiymatlar Dars01 ning mobil blokidan). */
@media (max-width: 639.98px), (max-height: 700px) {
  .summary-stack { gap: 7px; }
  .final-mission-heading { padding: 8px 10px; border-radius: 13px; }
  .final-mission-heading > span { font-size: 7px; }
  .final-mission-heading h1 { margin-top: 2px; font-size: 18px; }
  .final-mission-heading p { font-size: 9px; line-height: 1.25; }
  .summary-final-layout { grid-template-columns: 1fr; gap: 6px; }
  .summary-card { padding: 8px; }
  .final-question-card .summary-question-kicker { min-height: 23px; margin-bottom: 6px; font-size: 7px; }
  .final-question-card .summary-question { margin-bottom: 4px; font-size: 17px; line-height: 1.16; }
  .final-question-card .summary-question-stem { font-size: 9px; }
  .reflection-options { max-height: 132px; gap: 4px; }
  .reflection-option { min-height: 30px; padding: 4px 8px; font-size: 10px; }
  .reflection-option > span { width: 18px; height: 18px; flex-basis: 18px; font-size: 7px; }
  .reflection-resolution { gap: 5px; }
  .bit-answer-comment { min-height: 54px; }
  .bit-answer-comment-figure { width: 38px; height: 48px; flex-basis: 38px; }
  .summary-support-column { gap: 6px; }
  .summary-rules-toggle { min-height: 46px; padding: 6px 8px; gap: 7px; }
  .summary-rules-toggle > span { min-width: 48px; padding: 6px; font-size: 9px; }
  .summary-rules-toggle strong { font-size: 11px; }
  .summary-rules-toggle small { font-size: 7px; }
  .summary-rules-toggle > i { font-size: 20px; }
  .summary-rules-open .summary-rules-panel { max-height: 190px; padding: 0 7px 7px; }
  .summary-rules-panel .summary-rule-items > span { padding: 4px; grid-template-columns: 18px 1fr; }
  .summary-rules-panel .summary-rule-items > span > i { width: 18px; height: 18px; font-size: 7px; }
  .summary-rules-panel .summary-rule-items p { font-size: 8px; }
  .reward-stage-compact { min-height: 84px; padding: 9px 59px 8px 51px; border-radius: 14px; }
  .reward-stage-compact .reward-medal { left: 8px; width: 34px; height: 34px; font-size: 14px; }
  .reward-stage-compact .reward-bit { width: 57px; height: 71px; }
  .reward-stage-compact h2 { margin: 0; font-size: 14px; }
  .reward-kicker { font-size: 8px; }
  .reward-score { margin-top: 2px; padding: 3px 6px; gap: 4px; }
  .reward-score strong { font-size: 12px; }
  .reward-score span { font-size: 7px; }
  .next-mission { padding: 7px 10px; gap: 8px; }
  .next-mission p { font-size: 10px; line-height: 1.3; }
  .rank-boost-card { min-height: 100dvh; padding: 24px 18px; border-radius: 0; }
  .rank-boost-medal { width: 88px; height: 88px; border-width: 5px; font-size: 40px; }
  .rank-boost-card h2 { top: calc(50% + 62px); font-size: 29px; }
}
`;
