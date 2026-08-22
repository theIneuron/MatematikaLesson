// 18, 19, 20-darslarning o'z mexanikalari.
//
// Uchalasida ham bola javobni ro'yxatdan tanlamaydi, balki kasrning o'zi
// bilan ish qiladi: yozuvni tuzadi, kasrlarni kattaligi bo'yicha tizadi,
// tasmaga yetishmagan ulushlarni bo'yaydi.
//
//   FractionEntry — 18-dars: avval maxraj, keyin surat qo'yiladi.
//   OrderStrip    — 19-dars: kasrlar kichikdan kattaga tartib bilan bosiladi.
//   CellFill      — 20-dars: qo'shiluvchi ulushlar tasmada bo'yaladi.
import { useRef, useState } from 'react';
import { canUseGrade4TheoryContinue } from '../theoryNavigation.js';
import {
  playSfx, useCanAnswer, useLesson, useNarration, useT,
} from '../theoryShell/runtime.js';
import { T } from '../theoryShell/palette.js';
import { useWrongFlash } from '../wrongAnswerFlash.js';
import { FeedbackBlock, FitSvg, ModelCard, Stage } from './ui.jsx';
import { explanationDone } from './gate.js';
import { makeAnswer } from './answer.js';
import { FractionBar, FractionGlyph } from './fractionFigures.jsx';

// ---------------------------------------------------------------------------
// 1. FractionEntry — kasr yozuvini bola o'zi tuzadi.
//
// Tartib darslikdagidek: avval chiziq ostiga, ya'ni nechta teng qismga
// bo'linganiga qaraladi, keyin chiziq ustiga, ya'ni nechtasi olinganiga.
// Shu tartib maxraj va surat ma'nosini bir-biriga aralashtirmaslikka o'rgatadi.
//
// Kontent: `c.den`, `c.num` — to'g'ri javob; `c.denOptions`, `c.numOptions` —
// tugmalar; `c.wrongDen`, `c.wrongNum` — izohlar; `c.denStep`, `c.numStep` —
// qadam sarlavhalari.
// ---------------------------------------------------------------------------
export function FractionEntry({ screen, storedAnswer, onAnswer, onPrev, onNext, figure, ratio = null }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const [den, setDen] = useState(storedAnswer?.solved ? c.den : null);
  const [num, setNum] = useState(storedAnswer?.solved ? c.num : null);
  const [flashDen, flashWrongDen] = useWrongFlash();
  const [flashNum, flashWrongNum] = useWrongFlash();
  const [note, setNote] = useState(null);
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const solved = den === c.den && num === c.num;

  const finish = () => {
    onAnswer(makeAnswer({
      screen,
      meta,
      question: t(c.question ?? c.title),
      options: [`${c.num}/${c.den}`],
      correctIndex: 0,
      picked: 0,
      right: true,
      firstTry: firstTry.current !== false,
      attempts: attempts.current,
    }));
    setNote(c.correctText);
    audio.pushOneOff(t(c.correctText));
  };

  const pickDen = (value) => {
    if (!canAnswer || solved || den !== null) return;
    attempts.current += 1;
    const right = value === c.den;
    if (!right && firstTry.current === null) firstTry.current = false;
    playSfx(right ? 'correct' : 'wrong');
    if (right) { setDen(value); setNote(c.denDone); audio.pushOneOff(t(c.denDone)); }
    else { flashWrongDen(value); setNote(c.wrongDen); audio.pushOneOff(t(c.wrongDen)); }
  };

  const pickNum = (value) => {
    if (!canAnswer || solved || den === null) return;
    attempts.current += 1;
    const right = value === c.num;
    playSfx(right ? 'correct' : 'wrong');
    if (!right) {
      if (firstTry.current === null) firstTry.current = false;
      flashWrongNum(value);
      setNote(c.wrongNum);
      audio.pushOneOff(t(c.wrongNum));
      return;
    }
    if (firstTry.current === null) firstTry.current = true;
    setNum(value);
    finish();
  };

  const stage = den === null ? 'den' : 'num';
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      title={c.title}
      lead={c.lead}
      question={c.question}
      onPrev={onPrev}
      onNext={onNext}
      canAdvance={canUseGrade4TheoryContinue(meta.scored ? solved : (solved || explanationDone(audio)))}
      answer={(
        <>
          <div className="fraction-entry">
            <div className={`fraction-slot-pair ${solved ? 'is-done' : ''}`}>
              <span className={`fraction-slot ${num !== null ? 'is-filled' : ''} ${stage === 'num' && !solved ? 'is-active' : ''}`}>
                {num ?? ''}
              </span>
              <i />
              <span className={`fraction-slot ${den !== null ? 'is-filled' : ''} ${stage === 'den' ? 'is-active' : ''}`}>
                {den ?? ''}
              </span>
            </div>
            <div className="fraction-steps">
              <div className={`fraction-step ${stage === 'den' ? 'is-active' : ''}`}>
                <b>{t(c.denStep)}</b>
                <div className="tile-row">
                  {c.denOptions.map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={`tile ${den === value ? 'tile-done' : ''}`}
                      data-g4-branch="den"
                      data-g4-source-index={value}
                      data-g4-correct={stage === 'den' && value === c.den ? 'true' : 'false'}
                      data-g4-wrong-flash={flashDen === value ? 'true' : undefined}
                      data-g4-answer-dim={den !== null && value !== c.den ? 'true' : undefined}
                      disabled={!canAnswer || den !== null}
                      onClick={() => pickDen(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div className={`fraction-step ${stage === 'num' ? 'is-active' : ''}`}>
                <b>{t(c.numStep)}</b>
                <div className="tile-row">
                  {c.numOptions.map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={`tile ${num === value ? 'tile-done' : ''}`}
                      data-g4-branch="num"
                      data-g4-source-index={value}
                      data-g4-correct={stage === 'num' && value === c.num ? 'true' : 'false'}
                      data-g4-wrong-flash={flashNum === value ? 'true' : undefined}
                      data-g4-answer-dim={solved && value !== c.num ? 'true' : undefined}
                      disabled={!canAnswer || den === null || solved}
                      onClick={() => pickNum(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <FeedbackBlock show={note !== null} correct={solved}>
            {note ? t(note) : ''}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard ratio={ratio}>{figure({ frame: audio.frame, solved, den, num })}</ModelCard>
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// 2. OrderStrip — kasrlarni kattaligi bo'yicha tizish.
//
// Taqqoslash qoidasi ikkita kasrda tekshiriladi, lekin uchtasini tizganda
// bola qoidani ketma-ket ikki marta qo'llashga majbur bo'ladi va tasodifan
// to'g'ri tanlash imkoni yo'qoladi.
//
// Kontent: `c.cards` — [{ num, den }], `c.order` — o'sish tartibidagi
// indekslar, `c.wrongText`, `c.correctText`.
// ---------------------------------------------------------------------------
export function OrderStrip({ screen, storedAnswer, onAnswer, onPrev, onNext, figure, ratio = null }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const [step, setStep] = useState(storedAnswer?.solved ? c.order.length : 0);
  const [lastWrong, setLastWrong] = useState(false);
  const [flashKey, flashWrong] = useWrongFlash();
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const solved = step >= c.order.length;
  const placed = c.order.slice(0, step);

  const tap = (index) => {
    if (!canAnswer || solved || placed.includes(index)) return;
    attempts.current += 1;
    const right = index === c.order[step];
    if (firstTry.current === null) firstTry.current = right;
    playSfx(right ? 'correct' : 'wrong');
    if (!right) { setLastWrong(true); flashWrong(index); audio.pushOneOff(t(c.wrongText)); return; }
    setLastWrong(false);
    const next = step + 1;
    setStep(next);
    if (next >= c.order.length) {
      audio.pushOneOff(t(c.correctText));
      onAnswer(makeAnswer({
        screen,
        meta,
        question: t(c.question ?? c.title),
        options: [c.order.map((i) => `${c.cards[i].num}/${c.cards[i].den}`).join(' < ')],
        correctIndex: 0,
        picked: 0,
        right: true,
        firstTry: firstTry.current !== false,
        attempts: attempts.current,
      }));
    }
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      title={c.title}
      lead={c.lead}
      question={c.question}
      onPrev={onPrev}
      onNext={onNext}
      canAdvance={canUseGrade4TheoryContinue(meta.scored ? solved : (solved || explanationDone(audio)))}
      answer={(
        <>
          <div className="order-line" aria-live="polite">
            {c.order.map((_, slot) => (
              <span key={slot} className={`order-slot ${slot < step ? 'is-filled' : ''}`}>
                {slot < step ? (
                  <FitSvg viewBox="0 0 60 62" className="order-mini">
                    <FractionGlyph num={c.cards[placed[slot]].num} den={c.cards[placed[slot]].den} x={30} y={31} size={22} tone={T.success} />
                  </FitSvg>
                ) : null}
              </span>
            ))}
          </div>
          <div className="order-pool" role="group">
            {c.cards.map((card, index) => (
              <button
                type="button"
                key={index}
                className={`order-card ${placed.includes(index) ? 'is-used' : ''}`}
                data-g4-branch="order"
                data-g4-source-index={index}
                data-g4-correct={!solved && index === c.order[step] ? 'true' : 'false'}
                data-g4-wrong-flash={flashKey === index ? 'true' : undefined}
                disabled={!canAnswer || solved || placed.includes(index)}
                onClick={() => tap(index)}
              >
                <FitSvg viewBox="0 0 72 76">
                  <FractionGlyph num={card.num} den={card.den} x={36} y={38} size={26} />
                </FitSvg>
              </button>
            ))}
          </div>
          <FeedbackBlock show={solved || lastWrong} correct={solved}>
            {solved ? t(c.correctText) : t(c.wrongText)}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard ratio={ratio}>{figure({ frame: audio.frame, solved, step })}</ModelCard>
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// 3. CellFill — qo'shiluvchi ulushlarni tasmada bo'yash.
//
// Bola javobni yozmaydi, uni hosil qiladi: qancha ulush qo'shilishi kerak
// bo'lsa, shuncha katakni bo'yaydi. Maxraj o'zgarmasligi shu yerda ko'z bilan
// ko'rinadi — kataklar soni bir xil qoladi, faqat bo'yalganlari ko'payadi.
//
// Kontent: `c.parts` — kataklar soni, `c.preset` — oldindan bo'yalgani,
// `c.add` — bola qo'shishi kerak bo'lgani, `c.confirm` — tugma yozuvi,
// `c.wrongCount` — noto'g'ri sonda bo'yalganda izoh.
// ---------------------------------------------------------------------------
export function CellFill({ screen, storedAnswer, onAnswer, onPrev, onNext, ratio = null }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const [picked, setPicked] = useState(() => (
    storedAnswer?.solved
      ? new Set(Array.from({ length: c.add }, (_, index) => c.preset + index))
      : new Set()
  ));
  const [solved, setSolved] = useState(Boolean(storedAnswer?.solved));
  const [note, setNote] = useState(null);
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);

  const toggle = (index) => {
    if (!canAnswer || solved || index < c.preset) return;
    setNote(null);
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  };

  const check = () => {
    if (!canAnswer || solved || picked.size === 0) return;
    attempts.current += 1;
    const right = picked.size === c.add;
    if (firstTry.current === null) firstTry.current = right;
    playSfx(right ? 'correct' : 'wrong');
    setNote(right ? c.correctText : c.wrongCount);
    audio.pushOneOff(t(right ? c.correctText : c.wrongCount));
    if (right) setSolved(true);
    onAnswer(makeAnswer({
      screen,
      meta,
      question: t(c.question ?? c.title),
      options: [`${c.preset + c.add}/${c.parts}`],
      correctIndex: 0,
      picked: 0,
      right,
      firstTry: firstTry.current,
      attempts: attempts.current,
    }));
  };

  const total = c.preset + picked.size;
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      title={c.title}
      lead={c.lead}
      question={c.question}
      onPrev={onPrev}
      onNext={onNext}
      canAdvance={canUseGrade4TheoryContinue(meta.scored ? solved : (solved || explanationDone(audio)))}
      answer={(
        <>
          <div className="cell-count">
            <span>{t(c.countLabel)}</span>
            <b className={solved ? 'is-done' : ''}>{picked.size}</b>
            <button
              type="button"
              className="cell-confirm"
              disabled={!canAnswer || solved || picked.size === 0}
              onClick={check}
            >
              {t(c.confirm)}
            </button>
          </div>
          <FeedbackBlock show={note !== null} correct={solved}>
            {note ? t(note) : ''}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard ratio={ratio}>
        <FitSvg viewBox="0 0 520 232">
          <FractionBar
            parts={c.parts}
            shaded={c.preset}
            extra={picked}
            y={54}
            height={64}
            onCell={toggle}
            canPick={canAnswer && !solved}
          />
          <g>
            <FractionGlyph num={c.preset} den={c.parts} x={150} y={172} size={24} tone={T.cyan} />
            <text x={196} y={180} textAnchor="middle" fill={T.ink2} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">+</text>
            <FractionGlyph num={c.add} den={c.parts} x={242} y={172} size={24} tone={T.lime} />
            <text x={288} y={180} textAnchor="middle" fill={T.ink2} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">=</text>
            <FractionGlyph
              num={solved ? total : '?'}
              den={c.parts}
              x={336}
              y={172}
              size={24}
              tone={solved ? T.success : T.ink3}
            />
          </g>
        </FitSvg>
      </ModelCard>
    </Stage>
  );
}
