// 11-20-darslar uchun "boy kiritish" mexanikalari.
//
// mechanics.jsx da javob tayyor variantlardan tanlanadi. Bu yerda bola javobni
// O'ZI hosil qiladi: sonning bir bo'lagini ajratadi, raqam teradi yoki jadval
// katagini to'ldiradi. METODIK_PROFIL_MATEMATIKA.md 2-standarti aynan shuni
// talab qiladi: "Ученик производит ответ", nafaqat variant tanlaydi.
import { useRef, useState } from 'react';
import { canUseGrade4TheoryContinue } from '../theoryNavigation.js';
import {
  playSfx, useCanAnswer, useLesson, useNarration, useT,
} from '../theoryShell/runtime.js';
import { useWrongFlash } from '../wrongAnswerFlash.js';
import { FeedbackBlock, ModelCard, Stage } from './ui.jsx';
// Yordamchi bitta joyda turadi: nusxa qilinса, audit paketida ikki marta
// e'lon qilinib, parse xatosi beradi (CLAUDE.md 5-bo'lim).
import { explanationDone } from './gate.js';
import { makeAnswer } from './answer.js';



// ---------------------------------------------------------------------------
// 1. SpanSelect — sonning bo'lagini ajratish.
//
// Bola sonning raqamlarini bosadi va birinchi to'liqsiz bo'linuvchi qayerda
// tugashini ko'rsatadi. `c.digits` — son satri, `c.correctEnd` — to'g'ri
// raqamning indeksi, `c.wrong[i]` — har bir noto'g'ri indeksga izoh.
// ---------------------------------------------------------------------------
export function SpanSelect({ screen, storedAnswer, onAnswer, onPrev, onNext, figure, ratio = null }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const digits = String(c.digits).split('');
  const [picked, setPicked] = useState(storedAnswer?.solved ? c.correctEnd : null);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.solved));
  const [flashKey, flashWrong] = useWrongFlash();
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);

  const pick = (index) => {
    if (!canAnswer || solved) return;
    const right = index === c.correctEnd;
    attempts.current += 1;
    if (firstTry.current === null) firstTry.current = right;
    setPicked(index);
    playSfx(right ? 'correct' : 'wrong');
    audio.pushOneOff(t(right ? c.correctText : (c.wrong?.[index] ?? c.correctText)));
    if (right) setSolved(true);
    else flashWrong(index);
    onAnswer(makeAnswer({
      screen,
      meta,
      question: t(c.question ?? c.title),
      options: digits.map((_, i) => digits.slice(0, i + 1).join('')),
      correctIndex: c.correctEnd,
      picked: index,
      right,
      firstTry: firstTry.current,
      attempts: attempts.current,
    }));
  };

  // Xato tanlov flash davomida ko'rinib turadi, so'ng NEYTRAL holatga qaytadi
  // (metodist qarori 2026-08-21). Aks holda tanlangan bo'lak ajratilgan holda
  // qolib, bola xatosini "qabul qilingan javob" deb o'ylaydi.
  const shown = solved ? c.correctEnd : (flashKey !== null ? picked : null);
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
          <div className="span-row" role="group" aria-label={t(c.question ?? c.title)}>
            {digits.map((digit, index) => {
              const inSpan = shown !== null && index <= shown;
              // `shown` yechilmagan holatda faqat flash davomida to'ldiriladi,
              // shuning uchun `inSpan` ham o'zi neytralga qaytadi.
              const state = solved && inSpan ? 'span-done' : inSpan ? 'span-active' : '';
              return (
                <button
                  type="button"
                  key={index}
                  className={`span-cell ${state}`}
                  data-g4-branch="span"
                  data-g4-source-index={index}
                  data-g4-correct={index === c.correctEnd ? 'true' : 'false'}
                  data-g4-wrong-flash={flashKey === index ? 'true' : undefined}
                  disabled={!canAnswer || solved}
                  onClick={() => pick(index)}
                >
                  {digit}
                </button>
              );
            })}
            <span className="span-tail">: {c.divisor}</span>
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>
            {solved ? t(c.correctText) : t(c.wrong?.[picked] ?? '')}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard ratio={ratio}>{figure({ frame: audio.frame, solved, picked: shown })}</ModelCard>
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// 2. NumPadScreen — bola javobni O'ZI teradi.
//
// `c.answer` — to'g'ri javob satri, `c.unit` — ixtiyoriy birlik, `c.wrong` —
// noto'g'ri javobga umumiy izoh, `c.hintAfter` — ikkinchi xatodan keyingi opora.
// Tizim klaviaturasi ochilmaydi (ETALON §11).
// ---------------------------------------------------------------------------
export function NumPadScreen({ screen, storedAnswer, onAnswer, onPrev, onNext, figure, ratio = null }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const [entry, setEntry] = useState(storedAnswer?.solved ? String(c.answer) : '');
  const [solved, setSolved] = useState(Boolean(storedAnswer?.solved));
  const [checked, setChecked] = useState(null);
  // Ko'rsatiladigan izoh holatda saqlanadi: uni render paytida ref dan o'qish
  // React qoidasini buzadi va komponent yangilanmay qolishi mumkin.
  const [note, setNote] = useState(null);
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);

  const press = (key) => {
    if (!canAnswer || solved) return;
    setChecked(null);
    if (key === 'del') setEntry((value) => value.slice(0, -1));
    else if (entry.length < 7) setEntry((value) => value + key);
  };

  const check = () => {
    if (!canAnswer || solved || !entry) return;
    const right = entry === String(c.answer);
    attempts.current += 1;
    if (firstTry.current === null) firstTry.current = right;
    const text = right ? c.correctText : (attempts.current >= 2 && c.hintAfter ? c.hintAfter : c.wrong);
    setChecked(right ? 'right' : 'wrong');
    setNote(text);
    playSfx(right ? 'correct' : 'wrong');
    audio.pushOneOff(t(text));
    if (right) setSolved(true);
    onAnswer(makeAnswer({
      screen,
      meta,
      question: t(c.question ?? c.title),
      options: [String(c.answer)],
      correctIndex: 0,
      picked: 0,
      right,
      firstTry: firstTry.current,
      attempts: attempts.current,
    }));
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
          <div className="numpad">
            <div className={`numpad-display ${checked === 'wrong' ? 'numpad-bad' : ''} ${solved ? 'numpad-done' : ''}`}>
              <span>{entry || '—'}</span>
              {c.unit && <small>{t(c.unit)}</small>}
            </div>
            <div className="numpad-keys">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'].map((key) => (
                <button
                  type="button"
                  key={key}
                  className={`numpad-key ${key === 'ok' ? 'numpad-ok' : ''} ${key === 'del' ? 'numpad-del' : ''}`}
                  disabled={!canAnswer || solved || (key === 'ok' && !entry)}
                  onClick={() => (key === 'ok' ? check() : press(key))}
                >
                  {key === 'del' ? '⌫' : key === 'ok' ? '✓' : key}
                </button>
              ))}
            </div>
          </div>
          <FeedbackBlock show={checked !== null} correct={solved}>
            {t(note ?? c.wrong)}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard ratio={ratio}>{figure({ frame: audio.frame, solved, entry })}</ModelCard>
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// 3. TableFill — jadvalning bo'sh katagini to'ldirish.
//
// `c.columns` — uchta ustun sarlavhasi, `c.rows` — qatorlar (`null` bo'sh
// katak), `c.chips` — tanlash uchun qiymatlar, `c.correctChip` — to'g'risi.
// Javob aynan jadval katagiga tushadi, shuning uchun bola qiymatni kattalik
// bilan bog'lab ko'radi.
// ---------------------------------------------------------------------------
export function TableFill({ screen, storedAnswer, onAnswer, onPrev, onNext, figure, ratio = null }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const [picked, setPicked] = useState(storedAnswer?.solved ? c.correctChip : null);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.solved));
  const [flashKey, flashWrong] = useWrongFlash();
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);

  const pick = (index) => {
    if (!canAnswer || solved) return;
    const right = index === c.correctChip;
    attempts.current += 1;
    if (firstTry.current === null) firstTry.current = right;
    setPicked(index);
    playSfx(right ? 'correct' : 'wrong');
    audio.pushOneOff(t(right ? c.correctText : (c.wrong?.[index] ?? c.correctText)));
    if (right) setSolved(true);
    else flashWrong(index);
    onAnswer(makeAnswer({
      screen,
      meta,
      question: t(c.question ?? c.title),
      options: c.chips.map((chip) => t(chip)),
      correctIndex: c.correctChip,
      picked: index,
      right,
      firstTry: firstTry.current,
      attempts: attempts.current,
    }));
  };

  const filled = solved ? t(c.chips[c.correctChip]) : (picked !== null ? t(c.chips[picked]) : '?');
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
          <div className="chip-row" role="group">
            {c.chips.map((chip, index) => (
              <button
                type="button"
                key={index}
                className={`chip ${solved && index === c.correctChip ? 'chip-done' : ''}`}
                data-g4-branch="chip"
                data-g4-source-index={index}
                data-g4-correct={index === c.correctChip ? 'true' : 'false'}
                data-g4-wrong-flash={flashKey === index ? 'true' : undefined}
                data-g4-answer-dim={solved && index !== c.correctChip ? 'true' : undefined}
                disabled={!canAnswer || solved}
                onClick={() => pick(index)}
              >
                {t(chip)}
              </button>
            ))}
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>
            {solved ? t(c.correctText) : t(c.wrong?.[picked] ?? '')}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard ratio={ratio} fit>
        <div className="value-table">
          <div className="value-table-head">
            {c.columns.map((col, index) => <span key={index}>{t(col)}</span>)}
          </div>
          {c.rows.map((row, rowIndex) => (
            <div className="value-table-row" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <span key={cellIndex} className={cell === null ? `value-cell-gap ${solved ? 'value-cell-done' : ''}` : ''}>
                  {cell === null ? filled : t(cell)}
                </span>
              ))}
            </div>
          ))}
          {figure && <div className="value-table-figure">{figure({ frame: audio.frame, solved })}</div>}
        </div>
      </ModelCard>
    </Stage>
  );
}
