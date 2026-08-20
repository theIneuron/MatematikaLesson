// Yakuniy ekran (s15) — etalon Dars01 ning yakuniy ekrani bilan BIR XIL
// tuzilish: yakuniy bosqich sarlavhasi, bitta refleksiya savoli, qoida recapi
// (yig'iladigan panel), ixcham mukofot bloki va unvon olinganda to'liq ekran
// tabrigi. Uslublar `summaryStyles.js` da — ular ham etalondan olingan.
//
// Nega umumiy modulda: 41-51 darslarning hammasida shu ekran bir xil. Har
// darsda takrorlansa, bitta tuzatish o'n bir joyda qilinardi (CLAUDE.md 5-bo'lim).
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { canUseGrade4TheoryContinue } from '../theoryNavigation.js';
import {
  buildOptionOrder, playSfx, useLesson, useNarration, useT,
} from '../theoryShell/runtime.js';
import { BitSVG, FeedbackBlock, Stage } from './ui.jsx';

const RANK_BOOST_MS = 3900;

export function SummaryScreen({ screen, answers, onAnswer, onPrev, finishLesson }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const audio = useNarration(c.audio, screen);

  const order = useMemo(
    () => buildOptionOrder(c.reflectionOptions.length, c.reflectionCorrectIndex, lesson.lessonId, 9),
    [c.reflectionCorrectIndex, c.reflectionOptions.length, lesson.lessonId],
  );
  const options = order.map((index) => t(c.reflectionOptions[index]));
  const correctIndex = order.indexOf(c.reflectionCorrectIndex);

  const [picked, setPicked] = useState(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [showRankBoost, setShowRankBoost] = useState(false);
  const [finished, setFinished] = useState(false);
  const solved = picked !== null && picked === correctIndex;

  // Baholanadigan ekranlarning BIRINCHI urinishi — ekrandagi son payloaddagi
  // son bilan bir xil bo'lishi uchun manba bitta.
  const scored = lesson.screenMeta
    .map((meta, index) => (meta.scored ? index : null))
    .filter((index) => index !== null);
  const firstTryCorrect = scored.filter((index) => answers?.[index]?.firstTry === true).length;
  const award = c.awards.find((item) => firstTryCorrect >= item.min) ?? c.awards[c.awards.length - 1];

  useEffect(() => {
    if (!showRankBoost) return undefined;
    const timer = window.setTimeout(() => setShowRankBoost(false), RANK_BOOST_MS);
    return () => window.clearTimeout(timer);
  }, [showRankBoost]);

  const choose = (index) => {
    if (solved) return;
    const right = order[index] === c.reflectionCorrectIndex;
    setPicked(index);
    playSfx(right ? 'correct' : 'wrong');
    if (right) {
      setShowRankBoost(true);
      audio.pushOneOff(`${t(c.reflectionCorrect)} ${t(c.rewardAnnounce)} ${t(award.title)}.`);
      onAnswer({
        stage: null,
        screenIdx: screen,
        question: t(c.reflectionQuestion),
        options,
        correctIndex,
        correctAnswer: options[correctIndex],
        studentAnswerIndex: index,
        studentAnswer: options[index],
        correct: true,
        firstTry: true,
        attempts: 1,
        solved: true,
      });
    } else {
      audio.pushOneOff(t(c.reflectionWrong));
    }
  };

  const finish = () => {
    if (!solved || finished) return;
    setFinished(true);
    finishLesson();
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      onPrev={onPrev}
      onNext={finish}
      canAdvance={canUseGrade4TheoryContinue(solved && !finished && !showRankBoost, true)}
      finish
    >
      <div className="screen-stack summary-stack">
        {showRankBoost && typeof document !== 'undefined' && createPortal(
          <div
            className="rank-boost-overlay"
            role="status"
            aria-live="assertive"
            aria-label={`${t(c.rewardAnnounce)} ${t(award.title)}`}
          >
            <div className="rank-boost-card">
              <div className="rank-boost-rays" aria-hidden="true" />
              <div className="rank-boost-confetti" aria-hidden="true">
                {Array.from({ length: 18 }, (_, index) => (
                  <i key={index} style={{ '--boost-i': index, '--boost-delay': `${(index % 7) * -0.21}s` }} />
                ))}
              </div>
              <div className="rank-boost-medal" aria-hidden="true">★</div>
              <h2>{t(award.title)}</h2>
            </div>
          </div>,
          document.body,
        )}

        <div className="final-mission-heading">
          <span><i aria-hidden="true">◆</i> {t(c.stageLabel)}</span>
          <h1>{t(c.headTitle)}</h1>
          <p>{t(c.headLead)}</p>
        </div>

        <div className="summary-action-layout summary-final-layout">
          <div className="summary-card reflection-card final-question-card">
            <span className="summary-question-kicker">
              <i aria-hidden="true">🏁</i>
              {t(c.questionKicker)}
              <b>{t(c.stepLabel)}</b>
            </span>
            <h2 className="summary-question">{t(c.reflectionQuestion)}</h2>
            <p className="summary-question-stem">{t(c.reflectionStart)}</p>
            <div className={`reflection-options ${solved ? 'reflection-options-solved' : ''}`}>
              {options.map((option, index) => (
                <button
                  type="button"
                  key={option}
                  className={`reflection-option ${picked === index && !solved ? 'reflection-wrong' : ''}`}
                  data-g4-branch="reflection"
                  data-g4-source-index={order[index]}
                  data-g4-correct={index === correctIndex ? 'true' : 'false'}
                  disabled={solved}
                  onClick={() => choose(index)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              ))}
            </div>
            {solved && (
              <div className="reflection-resolution">
                <div className="bit-answer-comment">
                  <span className="bit-answer-comment-figure"><BitSVG state="nod" /></span>
                  <div className="bit-answer-comment-copy">
                    <small>{t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' })}</small>
                    <strong>{options[correctIndex]}</strong>
                    <p>{t(c.reflectionCorrect)}</p>
                  </div>
                </div>
              </div>
            )}
            <FeedbackBlock show={picked !== null && !solved} correct={false}>
              {t(c.reflectionWrong)}
            </FeedbackBlock>
          </div>

          <div className="summary-support-column">
            <div className={`summary-rules-disclosure ${rulesOpen ? 'summary-rules-open' : ''}`}>
              <button
                type="button"
                className="summary-rules-toggle"
                aria-expanded={rulesOpen}
                onClick={() => setRulesOpen((open) => !open)}
              >
                <span aria-hidden="true">{`${c.main.length} → |`}</span>
                <div>
                  <strong>{t(c.mainLabel)}</strong>
                  <small>
                    {rulesOpen
                      ? t({ uz: 'Qoidalarni yopish', ru: 'Скрыть правила', en: 'Hide the rules' })
                      : t({ uz: 'Eslab olish uchun bosing', ru: 'Нажми, чтобы вспомнить', en: 'Press to remember' })}
                  </small>
                </div>
                <i aria-hidden="true">⌄</i>
              </button>
              <div className="summary-rules-panel" aria-hidden={!rulesOpen}>
                <div className="summary-rule-items">
                  {c.main.map((item, index) => (
                    <span key={t(item)}>
                      <i>{index + 1}</i>
                      <p>{t(item)}</p>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`reward-stage reward-stage-compact ${solved ? 'reward-unlocked' : 'reward-locked'}`}>
              {solved && (
                <div className="reward-confetti" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
                </div>
              )}
              <div className="reward-bit"><BitSVG state={solved ? 'happy' : 'present'} /></div>
              <div className="reward-medal" aria-hidden="true">{solved ? '★' : '🔒'}</div>
              <span className="reward-kicker">
                {solved
                  ? t({ uz: 'UNVON OLINDI', ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: 'TITLE EARNED' })
                  : t({ uz: 'MUKOFOT KUTILMOQDA', ru: 'НАГРАДА ЖДЁТ', en: 'THE REWARD AWAITS' })}
              </span>
              <h2>
                {solved
                  ? t(award.title)
                  : t({ uz: 'Unvonni oching', ru: 'Открой звание', en: 'Unlock your title' })}
              </h2>
              <div className="reward-score">
                <strong>{firstTryCorrect}/{scored.length}</strong>
                <span>{t({ uz: 'birinchi urinishda', ru: 'с первой попытки', en: 'on the first attempt' })}</span>
              </div>
            </div>

            {solved && (
              <div className="next-mission">
                <div>
                  <span>{t(c.nextLabel)}</span>
                  <p>{t(c.nextText)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Stage>
  );
}
