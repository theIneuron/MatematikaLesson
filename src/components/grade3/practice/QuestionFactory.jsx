/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LessonNumPad from '../LessonNumPad';
import { Art, ART_CSS, GradientDefs } from './artKit.jsx';

const COLORS = {
  accent: '#FF4F28',
  accentSoft: '#FFE8E1',
  ok: '#1F7A4D',
  okSoft: '#E3F0E8',
  no: '#B9382F',
  noSoft: '#FDECEC',
  ink: '#111827',
  muted: '#5F6570',
  line: '#E4DECF',
  stage: 'linear-gradient(145deg, #F7FBFF 0%, #EEF6FF 55%, #FFF8E8 100%)',
};

const STYLE = {
  eyebrow: { color: COLORS.accent, fontSize: 13, fontWeight: 900, letterSpacing: '.05em', textTransform: 'uppercase' },
  setup: { color: '#374151', fontSize: 17, lineHeight: 1.55, margin: '7px 0 12px', whiteSpace: 'pre-line' },
  ask: { color: COLORS.ink, fontSize: 19, fontWeight: 850, lineHeight: 1.4, margin: 0 },
  askCard: {
    margin: '15px 0 12px',
    padding: '13px 15px',
    border: '1.5px solid #B9D7F0',
    borderRadius: 15,
    background: '#F7FBFF',
  },
  askLabel: {
    display: 'block',
    marginBottom: 5,
    color: '#145A86',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: '.06em',
    textTransform: 'uppercase',
  },
  instruction: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginTop: 8,
    color: '#526273',
    fontSize: 14,
    fontWeight: 750,
    lineHeight: 1.4,
  },
  option: {
    width: '100%',
    minHeight: 62,
    padding: '13px 15px',
    borderRadius: 16,
    border: `2px solid ${COLORS.line}`,
    background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFCFE 100%)',
    color: '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif",
    fontSize: 17,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 2px 0 rgba(38,49,62,.05), 0 8px 18px -14px rgba(38,49,62,.5)',
    transition: 'transform .18s cubic-bezier(.34,1.4,.64,1), box-shadow .18s ease, border-color .18s ease, background .18s ease',
  },
};

const FX = `
  .g3-question-shell {
    width: 100%;
    max-width: 1060px;
    height: 100%;
    min-height: 0;
    margin: 0 auto;
    padding: 2px;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: minmax(0, 1.04fr) minmax(330px, .96fr);
    grid-auto-flow: row;
    gap: 18px;
    align-items: start;
    align-content: start;
  }
  .g3-question-context-item {
    grid-column: 1;
    min-width: 0;
  }
  .g3-question-work-item {
    grid-column: 2;
    min-width: 0;
  }
  .g3-question-context-panel,
  .g3-question-work-panel {
    display: flex;
    min-width: 0;
    flex-direction: column;
  }
  .g3-question-context-panel { gap: 0; }
  .g3-question-work-panel { gap: 10px; }
  @media (min-width: 720px) {
    .g3-question-shell {
      max-width: 700px;
      grid-template-columns: minmax(0, 1fr);
      column-gap: 0;
      row-gap: 8px;
      align-content: center;
    }
    .g3-question-shell > .g3-question-context-panel {
      grid-column: 1;
      grid-row: 1;
    }
    .g3-question-shell > .g3-question-work-panel {
      grid-column: 1;
      grid-row: 2;
    }
    .g3-question-work-panel > .g3-question-ask-card,
    .g3-question-work-panel > .g3-practice-pop {
      margin-block: 0 !important;
    }
    .g3-question-shell.g3-question-input .g3-numeric-answer-zone {
      grid-column: 1;
      grid-row: 3;
    }
    .g3-question-shell.g3-question-input.g3-result-correct .g3-question-ask-card {
      display: none;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-question-instruction {
      display: none !important;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong {
      row-gap: 6px;
    }
  }
  @media (min-width: 720px) and (max-height: 800px) {
    .g3-question-shell.g3-question-input .g3-question-setup {
      margin: 4px 0 6px !important;
      font-size: 16px !important;
      line-height: 1.35 !important;
    }
    .g3-question-shell.g3-question-input .g3-practice-stage {
      min-height: 76px;
      margin-top: 4px;
      padding: 7px 10px;
      border-radius: 15px;
    }
    .g3-question-shell.g3-question-input .g3-practice-stage-inner {
      gap: 4px;
    }
    .g3-question-shell.g3-question-input .g3-context-group {
      font-size: 28px !important;
    }
    .g3-question-shell.g3-question-input .g3-practice-visual {
      font-size: 24px !important;
    }
    .g3-question-shell.g3-question-input .g3-question-work-panel {
      gap: 6px;
    }
    .g3-question-shell.g3-question-input .g3-question-ask-card {
      padding: 8px 12px;
      border-radius: 12px;
    }
    .g3-question-shell.g3-question-input .g3-question-ask-label,
    .g3-question-shell.g3-question-input .g3-question-instruction {
      display: none !important;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-lesson-numpad {
      gap: 5px !important;
      padding: 16px 9px 9px !important;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-lesson-numpad__display {
      height: 48px !important;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-lesson-numpad__grid {
      gap: 5px !important;
    }
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-lesson-numpad__key,
    .g3-question-shell.g3-question-input.g3-result-wrong .g3-lesson-numpad__spacer {
      height: 40px !important;
    }
  }
  .g3-practice-stage {
    position: relative;
    overflow: hidden;
    min-height: 104px;
    margin: 8px 0 0;
    padding: 12px;
    border-radius: 18px;
    background: ${COLORS.stage};
    border: 1px solid #C7DDF2;
    box-shadow: 0 8px 24px rgba(57, 96, 128, .08);
  }
  .g3-practice-stage-inner {
    position: relative;
    display: grid;
    place-items: center;
    gap: 9px;
    text-align: center;
  }
  .g3-answer-zone { min-height: 0; }
  .g3-mobile-step-button {
    width: min(100%, 320px);
    min-height: 48px;
    margin: 16px auto 0;
    border: 0;
    border-radius: 15px;
    color: #fff;
    background: #2563EB;
    font: 850 16px 'Manrope', system-ui, sans-serif;
    cursor: pointer;
  }
  .g3-mobile-back-button {
    display: none;
  }
  .g3-practice-pop { animation: g3-practice-pop .35s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes g3-practice-pop { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: none; } }
  .g3-practice-star { animation: g3-practice-star 3s ease-in-out infinite; }
  @keyframes g3-practice-star { 50% { opacity: .95; transform: scale(1.7); } }
  .g3-practice-visual.is-correct { animation: g3-practice-verify .7s cubic-bezier(.34,1.4,.64,1) both; }
  @keyframes g3-practice-verify {
    0% { transform: scale(.96); color: #145A86; }
    55% { transform: scale(1.07); color: #1F7A4D; }
    100% { transform: none; color: #1F7A4D; }
  }
  .g3-model-cell, .g3-model-bar, .g3-model-dot, .g3-model-hand, .g3-model-trace {
    transition: transform .65s cubic-bezier(.34,1.2,.64,1), background .55s ease, opacity .45s ease, stroke-dashoffset .9s ease;
  }
  .g3-model.is-correct .g3-model-cell { background: #32A96B !important; border-color: #8DE0B0 !important; transform: translateY(-3px); }
  .g3-model.is-correct .g3-model-bar { transform: scaleY(1) !important; background: linear-gradient(#8DE0B0,#32A96B) !important; }
  .g3-model.is-correct .g3-model-dot { transform: translateY(-5px) scale(1.08); background: #FFD166 !important; }
  .g3-model.is-correct .g3-model-hand.minute { transform: rotate(120deg) !important; }
  .g3-model.is-correct .g3-model-hand.hour { transform: rotate(35deg) !important; }
  .g3-model.is-correct .g3-model-trace { stroke-dashoffset: 0 !important; transform: rotate(0deg) !important; }
  .g3-context-group { animation: g3-context-float 2.4s ease-in-out infinite; }
  .g3-context-item { transition: transform .5s cubic-bezier(.34,1.4,.64,1), filter .4s ease; }
  .g3-model.is-correct .g3-context-group { animation: g3-context-confirm .6s cubic-bezier(.34,1.56,.64,1) both; }
  .g3-model.is-correct .g3-context-item { transform: translateY(-3px) scale(1.12); filter: saturate(1.18); }
  @keyframes g3-context-float { 50% { transform: translateY(-3px); } }
  @keyframes g3-context-confirm { 50% { transform: translateY(-7px) scale(1.05); } }
  .g3-model-check { animation: g3-model-check .55s .25s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes g3-model-check { from { opacity: 0; transform: scale(.35); } to { opacity: 1; transform: none; } }
  @media (max-width: 719.98px) {
    .g3-question-shell {
      display: block;
      height: auto;
    }
    .g3-question-shell.g3-mobile-context .g3-question-work-item { display: none !important; }
    .g3-question-shell.g3-mobile-answer .g3-question-context-item { display: none !important; }
    .g3-question-shell > .g3-question-context-item,
    .g3-question-shell > .g3-question-work-item {
      width: 100%;
      max-width: 650px;
      margin-inline: auto;
      box-sizing: border-box;
    }
    .g3-mobile-back-button {
      display: inline-flex;
      align-self: flex-start;
      margin-bottom: 5px;
      padding: 5px 9px;
      border: 1.5px solid #D6DAE3;
      border-radius: 999px;
      color: #526273;
      background: #fff;
      font: 800 12px 'Manrope', system-ui, sans-serif;
      cursor: pointer;
    }
    .g3-practice-stage {
      min-height: 94px;
      padding: 10px;
    }
  }
  @media (max-height: 760px) {
    .g3-practice-stage { min-height: 88px; padding-block: 9px; }
    .g3-practice-stage-inner { gap: 6px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .g3-practice-pop, .g3-practice-star, .g3-practice-visual, .g3-model-check, .g3-context-group { animation: none !important; }
    .g3-model-cell, .g3-model-bar, .g3-model-dot, .g3-model-hand, .g3-model-trace { transition: none !important; }
  }

  /* ------------------------ nafislik qatlami ------------------------ */
  /* Karta barmoq tegganda ko'tariladi, bosilganda cho'kadi — javob tanlash "tirik" bo'ladi. */
  .g3-answer-zone button:not(:disabled):hover {
    transform: translateY(-2px);
    border-color: #9FC4E4;
    box-shadow: 0 3px 0 rgba(38,49,62,.06), 0 16px 26px -18px rgba(38,49,62,.7);
  }
  .g3-answer-zone button:not(:disabled):active { transform: translateY(0) scale(.985); }
  .g3-answer-zone button:focus-visible { outline: 3px solid rgba(37,99,235,.32); outline-offset: 2px; }
  /* Sahna: pastda yumshoq "taglik" — buyumlar havoda osilib qolmaydi. */
  .g3-practice-stage::after {
    content: ''; position: absolute; left: 12%; right: 12%; bottom: 9px; height: 10px;
    border-radius: 50%; background: radial-gradient(ellipse at center, rgba(90,130,165,.16), transparent 72%);
    pointer-events: none;
  }
  .g3-practice-stage {
    background:
      radial-gradient(120% 90% at 50% -20%, rgba(255,255,255,.9), transparent 60%),
      ${COLORS.stage};
  }
  .g3-question-ask-card {
    background: linear-gradient(180deg, #FBFDFF 0%, #F2F8FE 100%) !important;
    box-shadow: 0 6px 18px -16px rgba(20,90,134,.9);
  }

  /* Bir qatorga sig'ishi uchun 5 ta variant ixchamlashadi. */
  .g3-answer-zone.is-tight button { padding: 10px 6px; min-height: 56px; font-size: 15px; }
  .g3-answer-zone.is-tight .g3-art-plate { padding: 5px 7px; gap: 2px; }
  .g3-answer-zone.is-tight .g3-art-plate span { font-size: 19px; min-width: 13px; }
  .g3-answer-zone.is-tight .g3-face { gap: 3px; }
  @media (max-width: 719.98px) {
    .g3-answer-zone.is-tight { gap: 5px !important; }
    .g3-answer-zone.is-tight button { padding: 8px 3px; min-height: 50px; }
    .g3-answer-zone.is-tight .g3-art-plate { padding: 4px 4px; }
    .g3-answer-zone.is-tight .g3-art-plate span { font-size: 15px; min-width: 10px; }
  }

  /* -------------------- chizma variant ichida -------------------- */
  .g3-face { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; }
  .g3-face-label { font: 800 13.5px 'Manrope', system-ui, sans-serif; color: ${COLORS.muted}; }
  .g3-dnd-token .g3-face-label,
  .g3-match-left .g3-face-label { font-size: 12.5px; }

  /* ---------------------------- match ---------------------------- */
  /* Juftlar BITTA qatorda yonma-yon turadi, javob kartalari esa alohida qatorda
     (metodist qarori 2026-08-06). Ilgari har juft o'z qatorini egallab, blok cho'zilardi. */
  .g3-match-rows { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 14px; }
  .g3-match-row { display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .g3-match-left {
    min-width: 92px; padding: 11px 13px; border: 2px solid ${COLORS.line}; border-radius: 13px;
    background: #fff; color: ${COLORS.ink}; font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 21px; font-weight: 800; cursor: pointer;
  }
  .g3-match-left.is-selected { border-color: ${COLORS.accent}; background: ${COLORS.accentSoft}; }
  .g3-match-left.is-filled { color: #145A86; }
  .g3-match-left:disabled { cursor: default; }
  .g3-match-arrow { color: #A7A6A2; font-size: 17px; font-weight: 800; line-height: 1; }
  .g3-match-slot {
    box-sizing: border-box; min-width: 96px; min-height: 48px;
    display: flex; align-items: center; justify-content: center;
    padding: 8px 12px; border-radius: 13px; border: 2px dashed ${COLORS.line};
    background: #FAF9F6; color: #A7A6A2; font-size: 16px; font-weight: 800; text-align: center;
  }
  /* Uzun imzo kartani cho'zib, juftlarni ikkinchi qatorga tushirib yuborardi. */
  .g3-match-left {
    box-sizing: border-box; min-width: 96px; max-width: 136px; text-align: center;
    white-space: normal; line-height: 1.2;
  }
  .g3-match-slot { max-width: 152px; white-space: normal; line-height: 1.25; }
  .g3-match-slot.is-filled { border-style: solid; border-color: #B9D0E3; background: #F6F1FA; color: ${COLORS.ink}; }
  .g3-match-left.is-ok, .g3-match-slot.is-ok { border-color: ${COLORS.ok}; background: ${COLORS.okSoft}; color: ${COLORS.ok}; }
  .g3-match-left.is-no, .g3-match-slot.is-no { border-color: ${COLORS.no}; background: ${COLORS.noSoft}; color: ${COLORS.no}; }
  /* Chizma bo'lgan juftlarda satr balandligi oshadi — 1366x768 da 47px skroll berardi. */
  .g3-match-left .g3-art-plate { padding: 4px 7px; gap: 2px; }
  .g3-match-left .g3-art-plate span { font-size: 20px; min-width: 14px; }
  /* Javob kartalari BITTA qatorda: uchtasi uch qator egallaganda blok cho'zilib ketardi
     va 1366x768 da skroll qolib ketgan edi. */
  .g3-match { max-width: 560px; margin-inline: auto; }
  .g3-match-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 12px; }
  @media (max-height: 820px), (max-width: 719.98px) {
    .g3-match-rows { gap: 9px; }
    .g3-match-row { gap: 4px; }
    /* Telefonda uzun imzo kartani kengaytirib, juftlar ikkinchi qatorga tushib ketardi. */
    .g3-match-left { padding: 6px 7px; min-width: 78px; max-width: 108px; font-size: 18px; white-space: normal; }
    .g3-match-left .g3-face-label { font-size: 11px; line-height: 1.15; }
    .g3-match-slot { min-width: 78px; max-width: 108px; min-height: 40px; font-size: 13.5px; white-space: normal; }
    .g3-match-slot { padding: 5px 10px; font-size: 14.5px; }
    .g3-match-right { min-height: 38px; padding: 6px 11px; font-size: 14.5px; }
    .g3-match-bank { gap: 5px; margin-top: 7px; }
    .g3-question-match .g3-practice-stage { min-height: 74px; }
  }
  .g3-match-right {
    flex: 1 1 0; min-width: 92px; min-height: 46px; padding: 10px 13px;
    border: 2px solid ${COLORS.line}; border-radius: 13px;
    background: #fff; color: #374151; font-size: 16px; font-weight: 800; text-align: center; cursor: pointer;
  }
  .g3-match-right:disabled { cursor: default; opacity: .55; }
  .g3-match-right.is-used { background: #EFE7F5; border-color: #B9D0E3; opacity: .5; }

  /* ---------------------------- dnd ---------------------------- */
  .g3-dnd { position: relative; touch-action: none; }
  .g3-dnd-bank {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; min-height: 56px;
    padding: 9px; border: 2px dashed ${COLORS.line}; border-radius: 14px; background: #FAF9F6;
  }
  .g3-dnd-bank-empty { align-self: center; color: ${COLORS.muted}; font-weight: 700; }
  .g3-dnd-token {
    padding: 10px 14px; border: 2px solid ${COLORS.line}; border-radius: 12px; background: #fff;
    color: ${COLORS.ink}; font-size: 18px; font-weight: 850; cursor: grab; touch-action: none;
  }
  .g3-dnd-token.is-selected { border-color: ${COLORS.accent}; background: ${COLORS.accentSoft}; }
  .g3-dnd-token.is-dragging { opacity: .35; }
  .g3-dnd-token.is-placed { font-size: 16px; padding: 8px 11px; }
  .g3-dnd-token.is-ok { border-color: ${COLORS.ok}; background: ${COLORS.okSoft}; color: ${COLORS.ok}; }
  .g3-dnd-token.is-no { border-color: ${COLORS.no}; background: ${COLORS.noSoft}; color: ${COLORS.no}; }
  .g3-dnd-zones { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 9px; margin-top: 11px; }
  .g3-dnd-zone {
    min-height: 92px; padding: 9px; border: 2px solid ${COLORS.line}; border-radius: 14px;
    background: #fff; cursor: default;
  }
  .g3-dnd-zone.is-target { border-color: ${COLORS.accent}; background: ${COLORS.accentSoft}; cursor: pointer; }
  .g3-dnd-zone-title { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; color: #145A86; font-size: 12.5px; font-weight: 900; letter-spacing: .04em; text-transform: uppercase; }
  .g3-dnd-zone-body { display: flex; flex-wrap: wrap; gap: 6px; pointer-events: auto; }
  .g3-dnd-ghost {
    position: fixed; z-index: 60; transform: translate(-50%, -50%); pointer-events: none;
    padding: 10px 14px; border: 2px solid ${COLORS.accent}; border-radius: 12px; background: #fff;
    font-size: 18px; font-weight: 850; box-shadow: 0 10px 22px -10px rgba(38, 49, 62, .6);
  }

  /* ---------------------------- grid ---------------------------- */
  /* Doska va klaviatura yonma-yon: ustunda ular ustma-ust turganda balandlik
     1366x768 da 150px ga chiqib ketardi (skroll taqiqi, START §2.28). */
  .g3-grid {
    display: grid; grid-template-columns: auto auto; align-items: center; justify-content: center;
    column-gap: 18px; row-gap: 8px;
  }
  .g3-grid > .g3-grid-hint { grid-column: 1 / -1; }
  .g3-question-grid .g3-practice-stage { min-height: 74px; }
  @media (max-height: 820px) {
    .g3-question-grid .g3-question-ask-label,
    .g3-question-grid .g3-question-instruction { display: none !important; }
    .g3-question-grid .g3-practice-stage { min-height: 62px; padding: 8px 10px; }
    .g3-question-grid .g3-question-setup { margin: 4px 0 6px !important; font-size: 16px !important; }
  }
  .g3-grid-board { display: flex; align-items: flex-start; justify-content: center; padding: 10px 4px; }
  .g3-grid-body { display: flex; flex-direction: column; gap: 3px; }
  .g3-grid-line { display: grid; align-items: center; justify-items: center; gap: 5px; }
  .g3-grid-line.is-carry { margin-bottom: -1px; }
  .g3-grid-sign { color: ${COLORS.muted}; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 24px; font-weight: 800; }
  .g3-grid-fixed {
    font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 26px; font-weight: 800; color: ${COLORS.ink};
  }
  .g3-grid-fixed.is-carry { font-size: 15px; color: ${COLORS.accent}; }
  .g3-grid-cell {
    width: 38px; height: 46px; padding: 0; border: 2px solid #D6DAE3; border-radius: 10px;
    background: #F8FAFC; color: ${COLORS.ink}; font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 25px; font-weight: 800; cursor: pointer;
  }
  .g3-grid-cell.is-carry { width: 26px; height: 26px; border-radius: 7px; font-size: 15px; border-style: dashed; color: ${COLORS.accent}; }
  .g3-grid-cell.is-active { border-color: ${COLORS.accent}; background: ${COLORS.accentSoft}; box-shadow: 0 0 0 3px rgba(255, 79, 40, .16); }
  .g3-grid-cell.is-ok { border-color: ${COLORS.ok}; background: ${COLORS.okSoft}; color: ${COLORS.ok}; }
  .g3-grid-cell.is-no { border-color: ${COLORS.no}; background: ${COLORS.noSoft}; color: ${COLORS.no}; }
  .g3-grid-rule { display: grid; }
  .g3-grid-rule > span { height: 3px; border-radius: 2px; background: ${COLORS.ink}; }
  .g3-grid-corner { display: flex; flex-direction: column; align-items: flex-start; padding-left: 11px; margin-left: 7px; border-left: 3px solid ${COLORS.ink}; }
  .g3-grid-divisor { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 26px; font-weight: 800; color: #C2410C; }
  .g3-grid-corner-rule { width: 100%; min-width: 64px; height: 3px; margin: 4px 0 5px; border-radius: 2px; background: ${COLORS.ink}; }
  .g3-grid-hint { margin: 0; color: ${COLORS.muted}; font-size: 13.5px; font-weight: 700; text-align: center; }
  @media (max-width: 719.98px) {
    .g3-grid-cell { width: 31px; height: 38px; font-size: 20px; }
    .g3-grid-cell.is-carry { width: 22px; height: 22px; font-size: 13px; }
    .g3-grid-fixed { font-size: 21px; }
    .g3-grid-fixed.is-carry { font-size: 13px; }
    .g3-grid { column-gap: 8px; }
    .g3-grid-board { padding: 4px 0; }
    .g3-grid .g3-lesson-numpad { width: min(186px, 100%); padding: 13px 7px 8px; gap: 5px; }
    .g3-grid .g3-lesson-numpad__display { height: 42px; font-size: 26px; }
    .g3-grid .g3-lesson-numpad__grid { gap: 4px; }
    .g3-grid .g3-lesson-numpad__key,
    .g3-grid .g3-lesson-numpad__spacer { width: 44px; height: 36px; font-size: 19px; }
    .g3-match-right { flex-basis: 100%; }
  }
`;

function useRegisteredCheck(check, registerCheck) {
  useEffect(() => {
    registerCheck?.(check);
  }, [check, registerCheck]);
}

function useMobilePracticeMode() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 719.98px)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(max-width: 719.98px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return mobile;
}

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replaceAll('×', '*')
    .replaceAll('х', '*')
    .replaceAll('x', '*')
    .replaceAll('÷', ':')
    .replace(/\s+/g, '');
}

function inputAnswerVariants(value) {
  const raw = String(value ?? '').trim();
  const variants = [raw];
  const numberWithUnit = raw.match(/^([+-]?\d[\d\s]*(?:[.,]\d+)?)\s*(?:[a-zа-яёʻʼ’'°²³]+(?:\s*\/\s*[a-zа-яёʻʼ’'°²³]+)?)$/iu);
  if (numberWithUnit) variants.push(numberWithUnit[1]);
  return variants;
}

function sameSet(a, b) {
  return a.length === b.length && [...a].sort((x, y) => x - y).every((v, i) => v === [...b].sort((x, y) => x - y)[i]);
}

/* ===================== match · dnd · grid — umumiy yordamchilar ===================== */

// match/dnd javobi — { chapIndeks: o'ngIndeks } obyekti. To'g'ri javob — spec.correct massivi.
function pairCount(answer) {
  return Object.keys(answer || {}).length;
}

// grid — barcha to'ldiriladigan kataklar. Bitta haqiqat manbai: `cells` da to'g'ri qiymat
// turadi, `fill` qaysi katak bo'sh chiqishini aytadi — rasm bilan javob hech qachon ajralmaydi.
//
// Tartib muhim: raqam kiritilgach faol katak keyingisiga o'tadi, shuning uchun kataklar
// ketma-ketligi algoritm qadamlariga mos kelishi kerak. Ustunda bu tabiiy (qatorma-qator),
// burchakda esa bo'linma raqamlari oraliq ayirishlar bilan navbatlashadi — o'sha yerda
// muallif `grid.fillOrder` da tartibni o'zi yozadi: [[rowId, cellIndex], ...].
function gridSlots(grid) {
  if (!grid) return [];
  const byKey = new Map();
  const push = (row) => {
    if (!row || !Array.isArray(row.cells)) return;
    const fill = row.fill === 'all' ? row.cells.map((_, i) => i) : (row.fill || []);
    fill.forEach((cellIndex) => {
      byKey.set(`${row.id}:${cellIndex}`, {
        rowId: row.id,
        cellIndex,
        expected: String(row.cells[cellIndex] ?? ''),
      });
    });
  };
  push(grid.quotient);
  (grid.rows || []).forEach(push);

  if (!Array.isArray(grid.fillOrder)) return [...byKey.values()];
  const ordered = [];
  grid.fillOrder.forEach(([rowId, cellIndex]) => {
    const key = `${rowId}:${cellIndex}`;
    if (byKey.has(key)) { ordered.push(byKey.get(key)); byKey.delete(key); }
  });
  // fillOrder da unutilgan kataklar yo'qolmasin — oxiriga qo'shiladi.
  return [...ordered, ...byKey.values()];
}

function gridExpected(grid) {
  return gridSlots(grid).map((slot) => slot.expected);
}

function gridEmpty(grid) {
  return gridSlots(grid).map(() => '');
}

function isCorrectAnswer(spec, answer) {
  if (spec.type === 'choice') return answer === spec.correct;
  if (spec.type === 'input') {
    const accepted = Array.isArray(spec.correct) ? spec.correct : [spec.correct];
    return accepted
      .flatMap(inputAnswerVariants)
      .some((value) => normalize(value) === normalize(answer));
  }
  if (spec.type === 'multi') return sameSet(answer, spec.correct);
  if (spec.type === 'order') return answer.length === spec.correct.length && answer.every((v, i) => v === spec.correct[i]);
  // Qisman javob — butunlay xato (amaliyot qoidasi "all-or-nothing").
  if (spec.type === 'match' || spec.type === 'dnd') {
    return spec.correct.length === pairCount(answer) && spec.correct.every((right, left) => answer[left] === right);
  }
  if (spec.type === 'grid') {
    const expected = gridExpected(spec.grid);
    return expected.length === (answer || []).length && expected.every((value, i) => String(answer[i] ?? '') === value);
  }
  return false;
}

function hasAnswer(spec, answer) {
  if (spec.type === 'choice') return answer !== null;
  if (spec.type === 'input') return normalize(answer).length > 0;
  if (spec.type === 'multi') return answer.length > 0;
  if (spec.type === 'order') return answer.length === spec.correct.length;
  if (spec.type === 'match' || spec.type === 'dnd') return pairCount(answer) === spec.correct.length;
  // Ustunda bo'sh katak "ko'chirish yo'q" degani — to'la to'ldirish talab qilinmaydi,
  // aks holda ko'chirishsiz misolni yakunlab bo'lmaydi. Kamida bitta katak to'ldirilsin.
  if (spec.type === 'grid') return Array.isArray(answer) && answer.some((cell) => String(cell ?? '') !== '');
  return false;
}

function answerForSubmit(spec, answer, text) {
  if (spec.type === 'choice') return { idx: answer, label: text.options?.[answer] };
  if (spec.type === 'input') return { value: answer };
  if (spec.type === 'match' || spec.type === 'dnd') return { map: answer };
  if (spec.type === 'grid') return { cells: answer };
  return { indices: answer, labels: answer.map((i) => text.options?.[i]) };
}

function correctForSubmit(spec, text) {
  if (spec.type === 'choice') return { idx: spec.correct, label: text.options?.[spec.correct] };
  if (spec.type === 'input') return { value: Array.isArray(spec.correct) ? spec.correct[0] : spec.correct };
  if (spec.type === 'match' || spec.type === 'dnd') {
    return { map: Object.fromEntries(spec.correct.map((right, left) => [left, right])) };
  }
  if (spec.type === 'grid') return { cells: gridExpected(spec.grid) };
  return { indices: spec.correct, labels: spec.correct.map((i) => text.options?.[i]) };
}

const ACTION_COPY = {
  uz: {
    choice: 'Bitta javobni tanlang.',
    multi: "Barcha to'g'ri javoblarni belgilang.",
    order: 'Kartalarni birinchi qadamdan boshlab tanlang.',
    input: 'Javobni yozing.',
    numericInput: 'Javobni faqat son bilan yozing. Birlikni yozish shart emas.',
    fractionInput: "Javobni kasr ko'rinishida yozing. Masalan: 1/2.",
    match: "Chapdagini bosing, keyin unga mos o'ngdagini bosing.",
    dnd: 'Kartani kerakli maydonga torting yoki kartani bosib, keyin maydonni bosing.',
    grid: "Katakni bosing va raqamni klaviaturadan tanlang. Ko'chirish bo'lmasa, yuqoridagi katak bo'sh qoladi.",
    question: 'Savol',
  },
  ru: {
    choice: 'Выбери один ответ.',
    multi: 'Отметь все верные ответы.',
    order: 'Нажимай карточки, начиная с первого шага.',
    input: 'Запиши ответ.',
    numericInput: 'Запиши в ответе только число. Единицу писать не нужно.',
    fractionInput: 'Запиши ответ в виде дроби. Например: 1/2.',
    match: 'Нажми слева, потом нажми пару справа.',
    dnd: 'Перетащи карточку в нужное поле или нажми карточку, а потом поле.',
    grid: 'Нажми клетку и выбери цифру на клавиатуре. Если переноса нет, верхняя клетка остаётся пустой.',
    question: 'Вопрос',
  },
  en: {
    choice: 'Choose one answer.',
    multi: 'Mark every correct answer.',
    order: 'Tap the cards starting from the first step.',
    input: 'Write the answer.',
    numericInput: 'Write only the number. You do not need the unit.',
    fractionInput: 'Write the answer as a fraction. For example: 1/2.',
    match: 'Tap on the left, then tap its pair on the right.',
    dnd: 'Drag the card into the right field, or tap the card and then the field.',
    grid: 'Tap a cell and pick a digit on the keypad. If there is no carry, the cell above stays empty.',
    question: 'Question',
  },
};

const INSTRUCTION_ICON = { input: '✍️', order: '1️⃣', match: '🔗', dnd: '🖐️', grid: '⌨️' };

// Uch tilga bitta joyda: uz / ru / en. Til noma'lum bo'lsa — uz.
const pick = (lang, uz, ru, en) => (lang === 'ru' ? ru : lang === 'en' ? en : uz);

function actionCopy(spec, lang) {
  const copy = ACTION_COPY[lang] || ACTION_COPY.uz;
  if (spec.type !== 'input') return copy[spec.type] || copy.choice;
  const accepted = Array.isArray(spec.correct) ? spec.correct : [spec.correct];
  const first = String(accepted[0] ?? '').trim();
  if (/^[+-]?\d+\s*\/\s*\d+$/.test(first)) return copy.fractionInput;
  if (inputAnswerVariants(first).some((value) => /^[+-]?\d[\d\s]*(?:[.,]\d+)?$/.test(value))) {
    return copy.numericInput;
  }
  return copy.input;
}

function sceneKind(spec, text) {
  const raw = `${spec.tag || ''} ${text.eyebrow || ''} ${text.setup || ''} ${text.ask || ''} ${text.visual || ''}`;
  const corpus = raw.toLowerCase();
  if (/kasr|ulush|fraction|surat|maxraj/.test(corpus)) return 'fraction';
  if (/perimetr|chegara/.test(corpus)) return 'perimeter';
  if (/yuza|maydon|area|sm²|m²/.test(corpus)) return 'area';
  if (/soat|vaqt|minut|kalendar|calendar|time/.test(corpus)) return 'time';
  if (/massa|kilogram|gramm|kg|mass/.test(corpus)) return 'mass';
  if (/diagram|jadval|piktogram|ma'lumot|data|chart/.test(corpus)) return 'data';
  if (/tenglama|noma'lum|equation/.test(corpus)) return 'equation';
  if (/qoldiq|remainder/.test(corpus)) return 'remainder';
  if (/bo'lish|bo'lin|taqsim|divide|quotient/.test(corpus)) return 'division';
  if (/guruh|tadan|har bir.{0,24}ta|savatda|qutida|rafda|ko'paytir|ko'paytma|marta|product/.test(corpus)) return 'multiplication';
  if (/qo'sh|ayir|yig'indi|farq|addition|subtraction/.test(corpus)) return 'operation';
  if (/taqqos|tengsizlik|rost|yolg'on|katta|kichik|compare/.test(corpus)) return 'compare';
  if (/so'm|pul|narx|qaytim|xarid|money/.test(corpus)) return 'money';
  if (/harorat|termometr|°c|temperature/.test(corpus)) return 'temperature';
  if (/hafta|oylar|sana|calendar/.test(corpus)) return 'calendar';
  // Rim raqamlari FAQAT bosh harflarda qidiriladi. Kichik harflarda qidirilsa,
  // o'zbekcha "xil" (x, i, l) rim soniga o'xshab qoladi va sahnaga I V X chiqadi.
  if (/\brim\b|\broman\b|римск/.test(corpus) || /\b[IVXLC]{1,7}\b/.test(raw)) return 'roman';
  if (/ketma-ket|qonuniyat|davom ettir|sequence/.test(corpus)) return 'sequence';
  if (/uzunlik|metr|santimetr|millimetr|length/.test(corpus)) return 'length';
  if (/razryad|yuzlik|o'nlik|birlik|yumaloq|son o'qi|raqam/.test(corpus)) return 'place';
  if (/konus|piramida|kub|parallelepiped|fazoviy/.test(corpus)) return 'solid';
  if (/uchburchak|to'rtburchak|kvadrat|burchak|simmetri|parallel|shakl/.test(corpus)) return 'geometry';
  return spec.type === 'order' ? 'order' : spec.type === 'multi' ? 'classify' : 'process';
}

function fractionParts(text) {
  const corpus = `${text.visual || ''} ${text.setup || ''} ${text.ask || ''}`;
  const match = corpus.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return { numerator: 1, denominator: 4 };
  const denominator = Math.max(2, Math.min(12, Number(match[2])));
  return {
    numerator: Math.max(0, Math.min(denominator, Number(match[1]))),
    denominator,
  };
}

function contextEmoji(text, spec) {
  const corpus = `${text.setup || ''} ${text.ask || ''} ${text.visual || ''}`.toLowerCase();
  if (/olma/.test(corpus)) return '🍎';
  if (/uzum/.test(corpus)) return '🍇';
  if (/kitob/.test(corpus)) return '📘';
  if (/qalam/.test(corpus)) return '✏️';
  if (/gul/.test(corpus)) return '🌼';
  if (/meva/.test(corpus)) return '🍊';
  if (/shar/.test(corpus)) return '⚽';
  if (/chiroq/.test(corpus)) return '💡';
  if (/pul|so'm|narx/.test(corpus)) return '🪙';
  return spec?.emoji && !['🧭', '🧩', '🚀', '🔎', '✅'].includes(spec.emoji) ? spec.emoji : '●';
}

function SemanticModel({ kind, correct, text, spec }) {
  const common = { minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 };
  const cls = `g3-model ${correct ? 'is-correct' : ''}`;

  if (kind === 'fraction') {
    const parts = fractionParts(text);
    return (
      <div className={cls} aria-hidden="true" style={common}>
        {Array.from({ length: parts.denominator }).map((_, i) => (
          <span key={i} className="g3-model-cell" style={{
            width: Math.max(16, Math.min(30, 230 / parts.denominator)),
            height: 40,
            border: '2px solid #9CBBD2',
            borderRadius: 6,
            background: correct && i < parts.numerator ? '#32A96B' : '#FFFFFF',
            transitionDelay: `${i * .06}s`,
          }} />
        ))}
      </div>
    );
  }

  if (kind === 'perimeter' || kind === 'geometry') {
    return (
      <div className={cls} aria-hidden="true" style={common}>
        <svg width="136" height="58" viewBox="0 0 136 58">
          <rect x="13" y="8" width="110" height="42" rx="7" fill="#FFFFFF" stroke="#7FA6C2" strokeWidth="3" />
          <rect className="g3-model-trace" x="13" y="8" width="110" height="42" rx="7" fill="none" stroke="#8DE0B0" strokeWidth="5" strokeLinecap="round" pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: correct ? 0 : 1 }} />
        </svg>
      </div>
    );
  }

  if (kind === 'area') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, display: 'grid', gridTemplateColumns: 'repeat(4, 28px)', gap: 4 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="g3-model-cell" style={{ width: 28, height: 20, border: '1.5px solid #9CBBD2', borderRadius: 4, background: '#FFFFFF', transitionDelay: `${i * .045}s` }} />
        ))}
      </div>
    );
  }

  if (kind === 'time') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, position: 'relative', width: 64, height: 64, minHeight: 64, margin: '0 auto', border: '3px solid #7FA6C2', borderRadius: '50%', background: '#FFFFFF' }}>
        <span className="g3-model-hand minute" style={{ position: 'absolute', left: 29, top: 8, width: 4, height: 25, borderRadius: 3, background: '#FFD166', transformOrigin: '2px 24px', transform: 'rotate(0deg)' }} />
        <span className="g3-model-hand hour" style={{ position: 'absolute', left: 29, top: 16, width: 4, height: 17, borderRadius: 3, background: '#8DE0B0', transformOrigin: '2px 16px', transform: 'rotate(-35deg)' }} />
        <span style={{ position: 'absolute', left: 27, top: 27, width: 8, height: 8, borderRadius: '50%', background: '#243447' }} />
      </div>
    );
  }

  if (kind === 'mass' || kind === 'equation') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, position: 'relative', width: 170, margin: '0 auto' }}>
        <span className="g3-model-trace" style={{ position: 'absolute', left: 30, right: 30, top: 21, height: 4, borderRadius: 4, background: '#7FA6C2', transform: correct ? 'rotate(0deg)' : 'rotate(-5deg)', transformOrigin: 'center' }} />
        <span className="g3-model-cell" style={{ width: 42, height: 30, borderRadius: 8, border: '2px solid #9CBBD2', background: '#FFFFFF' }} />
        <span style={{ width: 7, height: 48, borderRadius: 4, background: '#7FA6C2' }} />
        <span className="g3-model-cell" style={{ width: 42, height: 30, borderRadius: 8, border: '2px solid #9CBBD2', background: '#FFFFFF' }} />
      </div>
    );
  }

  if (kind === 'data') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, alignItems: 'flex-end', height: 56 }}>
        {[.42, .68, 1, .55].map((height, i) => (
          <span key={i} className="g3-model-bar" style={{ width: 24, height: 45 * height, borderRadius: '6px 6px 2px 2px', background: '#76A8CB', transform: 'scaleY(.35)', transformOrigin: 'bottom', transitionDelay: `${i * .1}s` }} />
        ))}
      </div>
    );
  }

  if (kind === 'length') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, position: 'relative', width: 220, height: 42, margin: '0 auto', alignItems: 'flex-end', borderBottom: '5px solid #7FA6C2' }}>
        {Array.from({ length: 11 }).map((_, i) => (
          <span key={i} className={i === 8 ? 'g3-model-cell' : ''} style={{ width: 2, height: i % 5 === 0 ? 24 : 13, background: i === 8 && correct ? '#32A96B' : '#6E96B4' }} />
        ))}
      </div>
    );
  }

  if (kind === 'multiplication') {
    return null;
  }

  if (kind === 'remainder' || kind === 'division') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 12 }}>
        {[0, 1, 2].map((group) => (
          <span key={group} style={{ display: 'flex', gap: 3, padding: 6, border: '1.5px solid #9CBBD2', borderRadius: 9, background: '#FFFFFF' }}>
            {[0, 1, 2].map((dot) => <i key={dot} className="g3-model-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#6E96B4', transitionDelay: `${(group * 3 + dot) * .045}s` }} />)}
          </span>
        ))}
        {kind === 'remainder' && <span style={{ display: 'flex', gap: 3 }}>{[0, 1].map((dot) => <i key={dot} className="g3-model-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF9D78' }} />)}</span>}
      </div>
    );
  }

  if (kind === 'money') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 9 }}>
        {[1, 2, 3, 4].map((coin, i) => (
          <span key={coin} className="g3-context-group" style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#8A5B00', background: '#FFE39A', border: '2px solid #E9B949', fontSize: 18, animationDelay: `${i * .12}s` }}>₸</span>
        ))}
      </div>
    );
  }

  if (kind === 'temperature') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 12 }}>
        <span style={{ position: 'relative', width: 22, height: 58, borderRadius: 14, background: '#FFFFFF', border: '3px solid #9CBBD2' }}>
          <i className="g3-model-bar" style={{ position: 'absolute', left: 6, right: 6, bottom: 6, height: correct ? 42 : 24, borderRadius: 8, background: '#FF7657', transformOrigin: 'bottom' }} />
        </span>
        <span className="g3-context-group" style={{ color: '#145A86', fontSize: 24, fontWeight: 900 }}>°C</span>
      </div>
    );
  }

  if (kind === 'calendar') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 4 }}>
        {['D', 'S', 'C', 'P', 'J', 'S', 'Y'].map((day, i) => (
          <span key={`${day}-${i}`} className="g3-context-group" style={{ width: 28, height: 34, display: 'grid', placeItems: 'center', borderRadius: 7, color: i > 4 ? '#B9382F' : '#145A86', background: '#FFFFFF', border: '1.5px solid #9CBBD2', fontSize: 11, fontWeight: 900, animationDelay: `${i * .08}s` }}>{day}</span>
        ))}
      </div>
    );
  }

  if (kind === 'roman') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 7 }}>
        {['I', 'V', 'X'].map((symbol, i) => (
          <span key={symbol} className="g3-context-group" style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 10, color: '#145A86', background: '#FFFFFF', border: '2px solid #9CBBD2', fontFamily: 'serif', fontSize: 23, fontWeight: 900, animationDelay: `${i * .15}s` }}>{symbol}</span>
        ))}
      </div>
    );
  }

  if (kind === 'solid') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 14 }}>
        {['🧊', '🔺', '🔶'].map((shape, i) => <span key={shape} className="g3-context-group" style={{ fontSize: 34, animationDelay: `${i * .16}s` }}>{shape}</span>)}
      </div>
    );
  }

  if (kind === 'sequence') {
    const item = contextEmoji(text, spec);
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 8 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ display: 'contents' }}>
            <i className="g3-context-group" style={{ width: 28 + i * 4, height: 28 + i * 4, display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#145A86', background: '#FFFFFF', border: '2px solid #9CBBD2', fontStyle: 'normal', fontSize: item === '●' ? 12 : 17, animationDelay: `${i * .1}s` }}>{item}</i>
            {i < 4 && <b style={{ color: '#7FA6C2' }}>→</b>}
          </span>
        ))}
      </div>
    );
  }

  if (kind === 'operation') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 10 }}>
        {[0, 1].map((group) => (
          <span key={group} className="g3-model-cell" style={{ display: 'flex', gap: 4, padding: 8, border: '2px solid #9CBBD2', borderRadius: 11, background: '#FFFFFF', transform: correct ? `translateX(${group === 0 ? 5 : -5}px)` : 'none' }}>
            {[0, 1, 2].map((dot) => <i key={dot} style={{ width: 11, height: 11, borderRadius: '50%', background: group === 0 ? '#FFD166' : '#9EC5FF' }} />)}
          </span>
        ))}
        <b style={{ color: '#557087', fontSize: 22 }}>{correct ? '=' : '↔'}</b>
      </div>
    );
  }

  if (kind === 'compare') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 12 }}>
        <span className="g3-model-bar" style={{ width: 78, height: 18, borderRadius: 9, background: '#76A8CB', transform: 'scaleY(.7)' }} />
        <b style={{ color: correct ? '#1F7A4D' : '#557087', fontSize: 24 }}>{correct ? '✓' : '?'}</b>
        <span className="g3-model-bar" style={{ width: 54, height: 18, borderRadius: 9, background: '#76A8CB', transform: 'scaleY(.7)' }} />
      </div>
    );
  }

  if (kind === 'place') {
    return (
      <div className={cls} aria-hidden="true" style={common}>
        {['Y', "O'", 'B'].map((label, i) => (
          <span key={label} className="g3-model-cell" style={{ width: 52, height: 45, display: 'grid', placeItems: 'center', borderRadius: 9, border: '2px solid #9CBBD2', color: '#243447', background: '#FFFFFF', fontSize: 14, fontWeight: 900, transitionDelay: `${i * .1}s` }}>{label}</span>
        ))}
      </div>
    );
  }

  const item = contextEmoji(text, spec);
  if (kind === 'classify') {
    return (
      <div className={cls} aria-hidden="true" style={{ ...common, gap: 18 }}>
        {[0, 1].map((group) => (
          <span key={group} className="g3-context-group" style={{ minWidth: 78, minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 7, borderRadius: 12, background: '#FFFFFF', border: '2px solid #9CBBD2', animationDelay: `${group * .18}s` }}>
            {[0, 1, 2].map((i) => <i key={i} className="g3-context-item" style={{ color: group ? '#FF7657' : '#145A86', fontStyle: 'normal', fontSize: item === '●' ? 15 : 19 }}>{item}</i>)}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={cls} aria-hidden="true" style={{ ...common, gap: 14 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="g3-context-group" style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', borderRadius: 14, color: '#145A86', background: '#FFFFFF', border: '2px solid #9CBBD2', fontSize: item === '●' ? 18 : 25, animationDelay: `${i * .16}s` }}>{item}</span>
      ))}
    </div>
  );
}

function Stage({ spec, text, status, spotlight }) {
  const items = text.tiles || [];
  const correct = status === 'correct';
  const kind = sceneKind(spec, text);
  const hero = contextEmoji(text, spec);
  return (
    <div className="g3-practice-stage g3-question-context-item">
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[8, 19, 32, 47, 61, 74, 88].map((left, i) => (
          <i key={left} className="g3-practice-star" style={{ position: 'absolute', left: `${left}%`, top: `${12 + (i % 3) * 25}%`, width: 3, height: 3, borderRadius: '50%', background: '#76A8CB', opacity: .28, animationDelay: `${i * .3}s` }} />
        ))}
      </div>
      <div className="g3-practice-stage-inner">
        {/* spec.art bo'lsa — chizilgan buyumlar sahnasi (artKit). Emoji va sxematik model
            faqat art berilmagan topshiriqlarda qoladi: bola yozuvni emas, buyumni ko'rsin. */}
        {spec.art ? (
          <Art art={{ ...spec.art, ...(text.art || {}), ...(spotlight != null ? spec.artSpotlight?.[spotlight] : null) }} reveal={correct} />
        ) : (
          <>
            <div className="g3-context-group" aria-hidden="true" style={{ fontSize: 34 }}>{hero === '●' ? '✨' : hero}</div>
            {text.visual && <div className={`g3-practice-visual ${correct ? 'is-correct' : ''}`} style={{ color: correct ? '#1F7A4D' : '#145A86', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 28, fontWeight: 900, letterSpacing: '.02em' }}>{text.visual}</div>}
            {!spec.hideModel && <SemanticModel kind={kind} correct={correct} text={text} spec={spec} />}
          </>
        )}
        {items.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {items.map((item, i) => (
              <span key={`${item}-${i}`} style={{ padding: '7px 10px', borderRadius: 10, color: '#243447', background: '#FFFFFF', border: '1px solid #9CBBD2', fontWeight: 800 }}>{item}</span>
            ))}
          </div>
        )}
        {correct && <span className="g3-model-check" aria-hidden="true" style={{ position: 'absolute', right: 5, top: 3, width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#fff', background: COLORS.ok, fontSize: 19, fontWeight: 900 }}>✓</span>}
      </div>
    </div>
  );
}

function Feedback({ correct, children }) {
  return (
    <div className="g3-practice-pop g3-question-work-item" role="status" style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginTop: 8, padding: '10px 12px', borderRadius: 14, color: correct ? COLORS.ok : COLORS.no, background: correct ? COLORS.okSoft : COLORS.noSoft, fontSize: 14, fontWeight: 750, lineHeight: 1.4 }}>
      <span aria-hidden="true">{correct ? '✓' : '↗'}</span>
      <span>{children}</span>
    </div>
  );
}

function Rule({ children }) {
  return <div className="g3-practice-pop g3-question-work-item" style={{ marginTop: 6, padding: '8px 10px', border: '1.5px solid #FFD99A', borderRadius: 13, color: '#9A5200', background: '#FFF6E8', fontSize: 13, fontWeight: 800 }}>💡 {children}</div>;
}

function optionStyle({ active, status, correct, wrong }) {
  if (status === 'correct' && correct) return { ...STYLE.option, color: COLORS.ok, background: COLORS.okSoft, borderColor: COLORS.ok, cursor: 'default' };
  if (status === 'wrong' && wrong) return { ...STYLE.option, color: COLORS.no, background: COLORS.noSoft, borderColor: COLORS.no };
  if (active) return { ...STYLE.option, color: COLORS.ink, background: COLORS.accentSoft, borderColor: COLORS.accent };
  return STYLE.option;
}

function seededOrder(length, seedText) {
  const order = Array.from({ length }, (_, i) => i);
  let state = 2166136261;
  const source = String(seedText || 'g3');
  for (let i = 0; i < source.length; i += 1) {
    state ^= source.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  if (state === 0) state = 1;
  for (let i = length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  return order;
}

// Variant/fishka/juft yuzi: chizma bor bo'lsa — chizma va tagida imzo, yo'q bo'lsa — matn.
function Face({ art, children }) {
  if (!art) return children;
  // Chizmaning o'zi qiymatni ko'rsatayotgan bo'lsa, imzo takrorlanmaydi (9 va tagida yana 9).
  const shown = String(art.digit ?? art.plate ?? '');
  const label = shown && shown === String(children ?? '') ? null : children;
  return (
    <span className="g3-face">
      <Art art={art} />
      {label ? <span className="g3-face-label">{label}</span> : null}
    </span>
  );
}

function Choice({ spec, text, answer, setAnswer, locked, status, optionOrder }) {
  const order = optionOrder || text.options.map((_, i) => i);
  return (
    // Ravshan 4 variant — 2x2 to'r (metodist qoidasi). Boshqa sonda — sig'gancha.
    <div className={`g3-answer-zone g3-question-work-item${text.options.length === 4 ? ' is-2x2' : ''}`}
      style={{ display: 'grid', gridTemplateColumns: text.options.length === 4 ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: 9 }}>
      {order.map((originalIndex, displayIndex) => {
        const option = text.options[originalIndex];
        return (
          <button key={`${option}-${displayIndex}`} type="button" disabled={locked} onClick={() => setAnswer(originalIndex)}
            style={optionStyle({ active: answer === originalIndex, status, correct: originalIndex === spec.correct, wrong: answer === originalIndex && originalIndex !== spec.correct })}>
            <Face art={spec.optionArt?.[originalIndex]}>{option}</Face>
          </button>
        );
      })}
    </div>
  );
}

function InputAnswer({ text, answer, setAnswer, locked, spec, status }) {
  const accepted = Array.isArray(spec.correct) ? spec.correct : [spec.correct];
  // NumPad da faqat raqam va vergul bor — javob shu belgilardan iborat bo'lsagina u chiqadi.
  const numericAccepted = accepted
    .flatMap(inputAnswerVariants)
    .map((value) => String(value).replace(/\s+/g, ''))
    .filter((value) => /^\d+(,\d+)?$/.test(value));
  const tapNumeric = numericAccepted.length > 0;
  const needComma = numericAccepted.some((value) => value.includes(','));
  const maxDigits = Math.max(
    1,
    String(answer ?? '').length,
    ...numericAccepted.map((value) => value.length),
  );

  return (
    <div className="g3-answer-zone g3-numeric-answer-zone g3-question-work-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {tapNumeric ? (
        <LessonNumPad
          value={answer}
          setValue={setAnswer}
          disabled={locked}
          max={maxDigits}
          comma={needComma}
          tone={status === 'correct' ? 'ok' : status === 'wrong' ? 'no' : 'idle'}
        />
      ) : (
        <label style={{ width: 'min(100%, 360px)' }}>
          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{text.ask}</span>
          <input value={answer} disabled={locked} inputMode={spec.inputMode || 'text'} placeholder={text.placeholder || '?'}
            onChange={(event) => setAnswer(event.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '15px', border: `2px solid ${status === 'correct' ? COLORS.ok : status === 'wrong' ? COLORS.no : COLORS.accent}`, borderRadius: 15, outline: 'none', textAlign: 'center', background: status === 'correct' ? COLORS.okSoft : status === 'wrong' ? COLORS.noSoft : '#fff', color: status === 'correct' ? COLORS.ok : status === 'wrong' ? COLORS.no : COLORS.ink, fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 25, fontWeight: 900 }} />
        </label>
      )}
    </div>
  );
}

function Multi({ spec, text, answer, setAnswer, locked, correct, status }) {
  const toggle = (idx) => setAnswer(answer.includes(idx) ? answer.filter((v) => v !== idx) : [...answer, idx]);
  return (
    // 4 variant — 2x2 to'r; 5 tagacha — BITTA qator (metodist qarori 2026-08-06);
    // undan ko'p bo'lsa, sig'gancha joylashadi.
    <div className={`g3-answer-zone g3-question-work-item${text.options.length >= 5 ? ' is-tight' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: text.options.length === 4 ? 'repeat(2, minmax(0, 1fr))'
          : text.options.length <= 5 ? `repeat(${text.options.length}, minmax(0, 1fr))`
            : 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 9,
      }}>
      {text.options.map((option, i) => (
        // Kvadratcha yo'q (metodist qarori 2026-08-06): tanlangani ramka va to'ldirish
        // bilan ko'rinadi, xuddi bitta javobli savoldagidek. Ekran o'quvchisi uchun
        // holat aria-pressed orqali beriladi.
        <button key={`${option}-${i}`} type="button" disabled={locked} aria-pressed={answer.includes(i)} onClick={() => toggle(i)}
          style={optionStyle({ active: answer.includes(i), status, correct: correct.includes(i), wrong: answer.includes(i) && !correct.includes(i) })}>
          <Face art={spec.optionArt?.[i]}>{option}</Face>
        </button>
      ))}
    </div>
  );
}

function Order({ spec, text, answer, setAnswer, locked, status }) {
  const available = text.options.map((_, i) => i).filter((i) => !answer.includes(i));
  return (
    <div className="g3-answer-zone g3-question-work-item">
      <div style={{ minHeight: 62, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 7, marginBottom: 12, padding: 10, border: `2px dashed ${COLORS.line}`, borderRadius: 14, background: '#FAF9F6' }}>
        {answer.length === 0 && <span style={{ color: COLORS.muted }}>{text.orderHint}</span>}
        {answer.map((idx, position) => (
          <button key={idx} type="button" disabled={locked} onClick={() => setAnswer(answer.filter((v) => v !== idx))}
            style={{ padding: '9px 12px', border: `2px solid ${status === 'correct' ? COLORS.ok : status === 'wrong' ? COLORS.no : COLORS.accent}`, borderRadius: 11, color: status === 'correct' ? COLORS.ok : status === 'wrong' ? COLORS.no : COLORS.ink, background: status === 'correct' ? COLORS.okSoft : status === 'wrong' ? COLORS.noSoft : COLORS.accentSoft, fontWeight: 900, cursor: locked ? 'default' : 'pointer' }}>
            {position + 1}. <Face art={spec.optionArt?.[idx]}>{text.options[idx]}</Face>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
        {available.map((idx) => (
          <button key={idx} type="button" disabled={locked} onClick={() => setAnswer([...answer, idx])}
            style={{ ...STYLE.option, width: 'auto', minHeight: 48, padding: '9px 14px' }}>
            <Face art={spec.optionArt?.[idx]}>{text.options[idx]}</Face>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================ match — moslashtirish ============================ */
// Donor: grade3/practice/dars02/D02_03.jsx. Chapni bosish -> o'ngni bosish.
// Qayta bosish juftni bo'shatadi. Band bo'lgan o'ng element yangi juftga o'tadi.
function MatchPairs({ spec, text, answer, setAnswer, locked, status, onSpotlight }) {
  const left = useMemo(() => text.left || [], [text.left]);
  const right = useMemo(() => text.right || [], [text.right]);
  const [selected, setSelected] = useState(null);
  const rightOrder = useMemo(
    () => seededOrder(right.length, `${spec.tag || 'q'}:match:${right.join('|')}`),
    [right, spec.tag],
  );
  const usedRight = new Set(Object.values(answer));
  const revealed = status !== 'idle';

  const pickLeft = (leftIndex) => {
    if (locked) return;
    if (answer[leftIndex] != null) {
      setAnswer((current) => { const next = { ...current }; delete next[leftIndex]; return next; });
      setSelected(null);
      onSpotlight?.(null);
      return;
    }
    const next = selected === leftIndex ? null : leftIndex;
    setSelected(next);
    onSpotlight?.(next);
  };
  const pickRight = (rightIndex) => {
    if (locked || selected == null) return;
    onSpotlight?.(null);
    setAnswer((current) => {
      const next = { ...current };
      Object.keys(next).forEach((key) => { if (next[key] === rightIndex) delete next[key]; });
      next[selected] = rightIndex;
      return next;
    });
    setSelected(null);
  };

  const pairTone = (leftIndex) => {
    if (!revealed || answer[leftIndex] == null) return null;
    return answer[leftIndex] === spec.correct[leftIndex] ? 'ok' : 'no';
  };

  return (
    <div className="g3-answer-zone g3-question-work-item g3-match">
      <div className="g3-match-rows">
        {left.map((label, leftIndex) => {
          const tone = pairTone(leftIndex);
          const filled = answer[leftIndex] != null;
          return (
            <div key={`row${leftIndex}`} className="g3-match-row">
              <button type="button" disabled={locked} onClick={() => pickLeft(leftIndex)}
                className={`g3-match-left${selected === leftIndex ? ' is-selected' : ''}${filled ? ' is-filled' : ''}${tone ? ` is-${tone}` : ''}`}>
                <Face art={spec.leftArt?.[leftIndex]}>{label}</Face>
              </button>
              <span className="g3-match-arrow" aria-hidden="true">↓</span>
              <div className={`g3-match-slot${filled ? ' is-filled' : ''}${tone ? ` is-${tone}` : ''}`}>
                {filled ? right[answer[leftIndex]] : '...'}
              </div>
            </div>
          );
        })}
      </div>
      <div className="g3-match-bank">
        {rightOrder.map((rightIndex) => (
          <button key={`rt${rightIndex}`} type="button"
            disabled={locked || selected == null || usedRight.has(rightIndex)}
            onClick={() => pickRight(rightIndex)}
            className={`g3-match-right${usedRight.has(rightIndex) ? ' is-used' : ''}`}>
            {right[rightIndex]}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================ dnd — maydonlarga tortish ============================ */
// Donor: grade1/Dars01.jsx:1922 (useDnd). Pointer-drag + zaxira "bosish -> maydonni bosish".
// Zaxira tap majburiy: telefonda barmoq maydondan chetga tushadi va topshiriq o'tib bo'lmas bo'ladi.
function useDnd(onDrop) {
  const [drag, setDrag] = useState(null);
  const [selected, setSelected] = useState(null);
  const startRef = useRef(null);
  const onDropRef = useRef(onDrop);
  useEffect(() => { onDropRef.current = onDrop; }, [onDrop]);
  useEffect(() => {
    if (!drag) return undefined;
    const move = (event) => {
      const start = startRef.current;
      if (start && (Math.abs(event.clientX - start.x) > 6 || Math.abs(event.clientY - start.y) > 6)) start.moved = true;
      setDrag((current) => (current ? { ...current, x: event.clientX, y: event.clientY } : null));
    };
    const up = (event) => {
      const start = startRef.current;
      startRef.current = null;
      setDrag(null);
      if (!start) return;
      if (!start.moved) { setSelected(start.id); return; }
      const element = typeof document !== 'undefined' ? document.elementFromPoint(event.clientX, event.clientY) : null;
      const zone = element && element.closest ? element.closest('[data-zone]') : null;
      onDropRef.current(start.id, zone ? Number(zone.getAttribute('data-zone')) : null);
      setSelected(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [drag]);
  const startDrag = (event, id) => {
    if (event.button != null && event.button !== 0) return;
    startRef.current = { id, x: event.clientX, y: event.clientY, moved: false };
    setDrag({ id, x: event.clientX, y: event.clientY });
  };
  const tapZone = (zoneIndex) => {
    if (selected == null) return;
    onDropRef.current(selected, zoneIndex);
    setSelected(null);
  };
  return { drag, selected, startDrag, tapZone, clearSelected: () => setSelected(null) };
}

function DropZones({ spec, text, answer, setAnswer, locked, status }) {
  const tokens = text.tokens || [];
  const zones = text.zones || [];
  const revealed = status !== 'idle';

  const place = useCallback((tokenIndex, zoneIndex) => {
    if (locked) return;
    setAnswer((current) => {
      const next = { ...current };
      if (zoneIndex == null) delete next[tokenIndex];
      else next[tokenIndex] = zoneIndex;
      return next;
    });
  }, [locked, setAnswer]);

  const { drag, selected, startDrag, tapZone, clearSelected } = useDnd(place);
  const free = tokens.map((_, i) => i).filter((i) => answer[i] == null);
  const tokenTone = (tokenIndex) => (revealed ? (answer[tokenIndex] === spec.correct[tokenIndex] ? 'ok' : 'no') : null);

  return (
    <div className="g3-answer-zone g3-question-work-item g3-dnd">
      <div className="g3-dnd-bank">
        {free.length === 0 && <span className="g3-dnd-bank-empty">{text.dndHint || ''}</span>}
        {free.map((tokenIndex) => (
          <button key={`tok${tokenIndex}`} type="button" disabled={locked}
            className={`g3-dnd-token${selected === tokenIndex ? ' is-selected' : ''}${drag?.id === tokenIndex ? ' is-dragging' : ''}`}
            onPointerDown={(event) => { if (!locked) startDrag(event, tokenIndex); }}>
            <Face art={spec.tokenArt?.[tokenIndex]}>{tokens[tokenIndex]}</Face>
          </button>
        ))}
      </div>
      <div className="g3-dnd-zones">
        {zones.map((zoneLabel, zoneIndex) => {
          const inside = tokens.map((_, i) => i).filter((i) => answer[i] === zoneIndex);
          return (
            <div key={`zone${zoneIndex}`} data-zone={zoneIndex} className={`g3-dnd-zone${selected != null ? ' is-target' : ''}`}
              onClick={() => tapZone(zoneIndex)}>
              <span className="g3-dnd-zone-title">
                {spec.zoneArt?.[zoneIndex] && <Art art={spec.zoneArt[zoneIndex]} />}
                {zoneLabel}
              </span>
              <div className="g3-dnd-zone-body">
                {inside.map((tokenIndex) => {
                  const tone = tokenTone(tokenIndex);
                  return (
                    <button key={`tok${tokenIndex}`} type="button" disabled={locked}
                      className={`g3-dnd-token is-placed${tone ? ` is-${tone}` : ''}`}
                      // Karta tanlangan bo'lsa, band katak tanlovni O'G'IRLAMAYDI: bosish
                      // uni shu maydonga JOYLASHTIRADI. Aks holda birinchi kartadan keyin
                      // maydonning o'rtasi "qaytarish" tugmasiga aylanadi va bosish rejimi
                      // buziladi — telefonda tortish ishonchsiz, bu yo'l yagona (2026-08-09 auditi).
                      onPointerDown={(event) => { if (!locked && selected == null) startDrag(event, tokenIndex); }}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (locked) return;
                        // Boshqa karta tanlangan — bosish uni shu maydonga joylaydi.
                        if (selected != null && selected !== tokenIndex) { tapZone(zoneIndex); return; }
                        place(tokenIndex, null);
                        clearSelected();
                      }}>
                      <Face art={spec.tokenArt?.[tokenIndex]}>{tokens[tokenIndex]}</Face>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {drag && (
        <span className="g3-dnd-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          {tokens[drag.id]}
        </span>
      )}
    </div>
  );
}

/* ==================== grid — ustun va burchak, katakma-katak ==================== */
// Donorlar: grade5/practice/dars03 (+ va −), dars04/D04_05.jsx (×), dars05/D05_07.jsx (:).
// Farqi: raqam LessonNumPad dan kiritiladi, har razryad ustida ko'chirish katagi bor,
// burchakda oraliq ayirishlar ham to'ldiriladi, tekshiruv katakma-katak.
// Burchakda oraliq qatorlar AYIRISH bo'ladi, ikki nuqta u yerda hech qachon yozilmaydi —
// shuning uchun div uchun ham "−".
const GRID_SIGN = { add: '+', sub: '−', mul: '×', div: '−' };

function GridRow({ row, cols, op, slotIndexOf, answer, cellState, onPick, active }) {
  const cells = row.cells || [];
  const offset = row.offset || 0;
  const start = 2 + (cols - offset - cells.length);
  const carry = row.kind === 'carry';
  const fill = row.fill === 'all' ? cells.map((_, i) => i) : (row.fill || []);
  // sign: true — amal belgisi op dan olinadi (muallif "−" ni "-" bilan chalkashtirmasin).
  const sign = row.sign === true ? GRID_SIGN[op] : row.sign;
  return (
    <>
      <div className={`g3-grid-line${carry ? ' is-carry' : ''}`} style={{ gridTemplateColumns: `28px repeat(${cols}, var(--g3-grid-cw))` }}>
        {sign && <span className="g3-grid-sign" style={{ gridColumn: Math.max(1, start - 1) }}>{sign}</span>}
        {cells.map((value, cellIndex) => {
          const column = start + cellIndex;
          if (!fill.includes(cellIndex)) {
            return <span key={cellIndex} className={`g3-grid-fixed${carry ? ' is-carry' : ''}`} style={{ gridColumn: column }}>{value}</span>;
          }
          const slot = slotIndexOf(row.id, cellIndex);
          const state = cellState(slot);
          return (
            <button key={cellIndex} type="button" style={{ gridColumn: column }}
              className={`g3-grid-cell${carry ? ' is-carry' : ''}${active === slot ? ' is-active' : ''}${state ? ` is-${state}` : ''}`}
              onClick={() => onPick(slot)}>
              {answer[slot] || ''}
            </button>
          );
        })}
      </div>
      {/* line: true — chiziq butun kenglikda; line: 'cells' — faqat shu qator kataklari ostida
          (burchakda ayirilayotgan qism qancha bo'lsa, chiziq ham shuncha). */}
      {row.line && (
        <div className="g3-grid-rule" style={{ gridTemplateColumns: `28px repeat(${cols}, var(--g3-grid-cw))` }}>
          <span style={{ gridColumn: row.line === 'cells' ? `${start} / span ${cells.length}` : `2 / span ${cols}` }} />
        </div>
      )}
    </>
  );
}

function NumGrid({ spec, text, answer, setAnswer, locked, status, lang }) {
  const grid = spec.grid;
  const slots = useMemo(() => gridSlots(grid), [grid]);
  const [active, setActive] = useState(0);
  const revealed = status !== 'idle';
  const cols = grid.cols;

  const slotIndexOf = useCallback(
    (rowId, cellIndex) => slots.findIndex((slot) => slot.rowId === rowId && slot.cellIndex === cellIndex),
    [slots],
  );
  const cellState = useCallback(
    (slotIndex) => {
      if (!revealed || slotIndex < 0) return null;
      return String(answer[slotIndex] ?? '') === slots[slotIndex].expected ? 'ok' : 'no';
    },
    [answer, revealed, slots],
  );

  const writeDigit = (digit) => {
    setAnswer((current) => {
      const next = [...current];
      next[active] = digit;
      return next;
    });
    setActive((current) => Math.min(current + 1, slots.length - 1));
  };
  const eraseDigit = () => {
    setAnswer((current) => {
      const next = [...current];
      if (next[active]) { next[active] = ''; return next; }
      return next;
    });
    setActive((current) => (answer[current] ? current : Math.max(current - 1, 0)));
  };

  const rows = grid.rows || [];
  const rowProps = { cols, op: grid.op, slotIndexOf, answer, cellState, onPick: setActive, active };

  const body = (
    <div className="g3-grid-body" style={{ '--g3-grid-cw': '42px' }}>
      {rows.map((row) => <GridRow key={row.id} row={row} {...rowProps} />)}
    </div>
  );

  return (
    <div className="g3-answer-zone g3-question-work-item g3-grid">
      <div className={`g3-grid-board${grid.op === 'div' ? ' is-div' : ''}`}>
        {body}
        {grid.op === 'div' && (
          <div className="g3-grid-corner">
            <span className="g3-grid-divisor">{grid.divisor}</span>
            <span className="g3-grid-corner-rule" />
            <div className="g3-grid-quotient" style={{ '--g3-grid-cw': '42px' }}>
              <GridRow row={grid.quotient} {...rowProps} cols={(grid.quotient.cells || []).length} />
            </div>
          </div>
        )}
      </div>
      <LessonNumPad
        value=""
        setValue={() => {}}
        disabled={locked}
        tone={status === 'correct' ? 'ok' : status === 'wrong' ? 'no' : 'idle'}
        onDigit={locked ? null : writeDigit}
        onBack={locked ? null : eraseDigit}
        display={answer[active] || '—'}
        ariaLabel={pick(lang, 'Katakka raqam kiritish', 'Ввод цифры в клетку', 'Type a digit into the cell')}
      />
      {!locked && (
        <p className="g3-grid-hint">{text.gridHint || pick(lang, "Katakni bosing, so'ng raqamni tanlang.", 'Нажми клетку, потом выбери цифру.', 'Tap a cell, then pick a digit.')}</p>
      )}
    </div>
  );
}

export function createPracticeQuestion(spec) {
  function PracticeQuestion(props) {
    const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
    const text = spec.text[lang] || spec.text.uz;
    const empty = spec.type === 'choice' ? null
      : spec.type === 'input' ? ''
        : spec.type === 'match' || spec.type === 'dnd' ? {}
          : spec.type === 'grid' ? gridEmpty(spec.grid)
            : [];
    const initial = initialAnswer?.studentAnswer?.value
      ?? initialAnswer?.studentAnswer?.idx
      ?? initialAnswer?.studentAnswer?.indices
      ?? initialAnswer?.studentAnswer?.map
      ?? initialAnswer?.studentAnswer?.cells
      ?? empty;
    const [answer, setAnswer] = useState(initial);
    const [result, setResult] = useState(typeof initialAnswer?.correct === 'boolean' ? initialAnswer.correct : null);
    const [lastWrongAnswer, setLastWrongAnswer] = useState(null);
    const mobile = useMobilePracticeMode();
    const [mobileStep, setMobileStep] = useState('context');
    // Sahna bolaning tanloviga javob beradi (match da tanlangan satr razryadi yoritiladi).
    // Javobni ochib qo'ymaydi: bola O'ZI bosgan narsa yoritiladi, to'g'risi emas.
    const [spotlight, setSpotlight] = useState(null);
    const status = result === true ? 'correct' : result === false ? 'wrong' : 'idle';
    const locked = result === true || mode === 'review';
    const copy = ACTION_COPY[lang] || ACTION_COPY.uz;
    const answerKey = JSON.stringify(answer);
    const choiceOrder = useMemo(() => {
      if (spec.type !== 'choice' || !text.options?.length) return null;
      return seededOrder(text.options.length, `${spec.tag || 'q'}:${text.options.join('|')}`);
      // spec — fabrikaning yopilgan qiymati, komponent umri davomida o'zgarmaydi: bog'liqlikda kerak emas.
    }, [text.options]);
    const ready = useMemo(
      () => hasAnswer(spec, answer) && !locked && answerKey !== lastWrongAnswer,
      [answer, answerKey, lastWrongAnswer, locked],
    );

    const updateAnswer = useCallback((next) => {
      setAnswer((current) => (typeof next === 'function' ? next(current) : next));
      if (result === false) setResult(null);
    }, [result]);

    useEffect(() => {
      onReady?.(ready);
    }, [onReady, ready]);

    const check = useCallback(() => {
      if (!hasAnswer(spec, answer) || locked || answerKey === lastWrongAnswer) return;
      const correct = isCorrectAnswer(spec, answer);
      setResult(correct);
      setLastWrongAnswer(correct ? null : answerKey);
      if (correct) playCorrect?.(); else playWrong?.();
      onSubmit?.({
        questionText: text.ask,
        options: (text.options || []).map((label, idx) => ({ id: String(idx), label })),
        studentAnswer: answerForSubmit(spec, answer, text),
        correctAnswer: correctForSubmit(spec, text),
        correct,
        meta: { tag: spec.tag, level: spec.level, interaction: spec.type, source: spec.source },
      });
    }, [answer, answerKey, lastWrongAnswer, locked, onSubmit, playCorrect, playWrong, text]);

    useRegisteredCheck(check, registerCheck);

    return (
      <>
        <style>{FX}{ART_CSS}</style>
        <GradientDefs />
        <div className={`g3-question-shell g3-question-${spec.type}${mobile ? ` g3-mobile-${mobileStep}` : ''}${result === true ? ' g3-result-correct' : result === false ? ' g3-result-wrong' : ''}`}>
          {/* Tartib (metodist qarori 2026-08-06, HAMMA topshiriqqa): sarlavha -> shart ->
              SAVOL -> sahna/animatsiya -> javob. Avval bola nima so'ralayotganini biladi,
              keyin sahnaga qaraydi. Ilgari sahna savoldan yuqorida turardi. */}
          <section className="g3-question-context-panel g3-question-context-item">
            <div style={STYLE.eyebrow}>{spec.level} {text.eyebrow}</div>
            <p className="g3-question-setup" style={STYLE.setup}>{text.setup}</p>
            <div className="g3-question-ask-card" style={STYLE.askCard}>
              <span className="g3-question-ask-label" style={STYLE.askLabel}>❓ {copy.question}</span>
              <p style={STYLE.ask}>{text.ask}</p>
              <div className="g3-question-instruction" style={STYLE.instruction}>
                <span aria-hidden="true">{INSTRUCTION_ICON[spec.type] || '☝️'}</span>
                <span>{actionCopy(spec, lang)}</span>
              </div>
            </div>
            {/* Ustunda sahna kerak emas: ustunning o'zi vizual. Bo'sh panel faqat joy egallardi. */}
            {(spec.type !== 'grid' || spec.art) && <Stage spec={spec} text={text} status={status} spotlight={spotlight} />}
            {mobile && mobileStep === 'context' && (
              <button
                type="button"
                className="g3-mobile-step-button"
                onClick={() => setMobileStep('answer')}
              >
                {pick(lang, 'Javob berish', 'Ответить', 'Answer')}
              </button>
            )}
          </section>
          <section className="g3-question-work-panel g3-question-work-item">
            {mobile && mobileStep === 'answer' && (
              <button
                type="button"
                className="g3-mobile-back-button"
                onClick={() => setMobileStep('context')}
              >
                {pick(lang, '← Shartga qaytish', '← Вернуться к условию', '← Back to the task')}
              </button>
            )}
            {spec.type === 'choice' && <Choice spec={spec} text={text} answer={answer} setAnswer={updateAnswer} locked={locked} status={status} optionOrder={choiceOrder} />}
            {spec.type === 'multi' && <Multi spec={spec} text={text} answer={answer} setAnswer={updateAnswer} locked={locked} correct={spec.correct} status={status} />}
            {spec.type === 'order' && <Order spec={spec} text={text} answer={answer} setAnswer={updateAnswer} locked={locked} status={status} />}
            {spec.type === 'match' && <MatchPairs spec={spec} onSpotlight={setSpotlight} text={text} answer={answer} setAnswer={updateAnswer} locked={locked} status={status} />}
            {spec.type === 'dnd' && <DropZones spec={spec} text={text} answer={answer} setAnswer={updateAnswer} locked={locked} status={status} />}
            {spec.type === 'grid' && <NumGrid spec={spec} text={text} answer={answer} setAnswer={updateAnswer} locked={locked} status={status} lang={lang} />}
            {/* wrongBy — o'z tahlili har bir noto'g'ri variantga (TIPLAR_AMALIYOT_3SINF.md §3.1).
                Tahlil BELGIga ishora qiladi, javobni bermaydi. Bo'lmasa — umumiy maslahat. */}
            {result !== null && (
              <Feedback correct={result}>
                {result ? text.correct : (text.wrongBy?.[answer] || text.wrong)}
              </Feedback>
            )}
            {result === true && text.rule && <Rule>{text.rule}</Rule>}
          </section>
          {spec.type === 'input' && <InputAnswer spec={spec} text={text} answer={answer} setAnswer={updateAnswer} locked={locked} status={status} />}
        </div>
      </>
    );
  }

  PracticeQuestion.displayName = `Grade3Practice_${spec.tag}`;
  return PracticeQuestion;
}
