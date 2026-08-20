// 11-20-darslar uchun umumiy mexanikalar.
//
// Bu yerda faqat O'ZARO TA'SIR SHAKLI bor: savol qanday beriladi, javob qanday
// qabul qilinadi, izoh qayerda chiqadi. Mavzuga xos chizma darsning o'z faylida
// qoladi va bu komponentlarga `figure` propi orqali keladi.
//
// Uch tur:
//   RevealScreen  — tushuntirish: kadrlar ovoz bilan birga ochiladi, savol yo'q.
//   ChoiceScreen  — misol: variant tanlanadi, har bir noto'g'risiga o'z izohi.
//   SlotScreen    — misol: qiymat o'z xonasiga qo'yiladi (siljish, qator o'rni).
import { useMemo, useRef, useState } from 'react';
import { canUseGrade4TheoryContinue } from '../theoryNavigation.js';
import {
  buildOptionOrder, playSfx, useCanAnswer, useLang, useLesson, useNarration, useT,
} from '../theoryShell/runtime.js';
import { FeedbackBlock, ModelCard, Options, Stage } from './ui.jsx';
import { explanationDone } from './gate.js';

// Ovoz tugagach yoki o'chirilgan bo'lsa tushuntirish ekrani ochiladi.


// --------------------------------------------------------------------------
// 1. Tushuntirish ekrani
// --------------------------------------------------------------------------
export function RevealScreen({ screen, onPrev, onNext, figure, plain = false, ratio = null }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const audio = useNarration(c.audio, screen);
  const ready = canUseGrade4TheoryContinue(explanationDone(audio));
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      title={c.title}
      lead={c.lead}
      onPrev={onPrev}
      onNext={onNext}
      canAdvance={ready}
      answer={c.note ? <p className="hint-line">{t(c.note)}</p> : null}
    >
      <ModelCard plain={plain} ratio={ratio}>{figure({ frame: audio.frame })}</ModelCard>
    </Stage>
  );
}

// --------------------------------------------------------------------------
// 2. Variant tanlash
// --------------------------------------------------------------------------
export function ChoiceScreen({
  screen, storedAnswer, onAnswer, onPrev, onNext, figure,
  ordinal = 0, plain = false, finish = false, stack = false, ratio = null,
}) {
  const t = useT();
  const lang = useLang();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const order = useMemo(
    () => buildOptionOrder(c.options.length, c.correctIndex, lesson.lessonId, ordinal),
    [c.correctIndex, c.options.length, lesson.lessonId, ordinal],
  );
  const shown = order.map((index) => t(c.options[index]));
  const correctIndex = order.indexOf(c.correctIndex);

  const [picked, setPicked] = useState(storedAnswer?.solved ? correctIndex : null);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.solved));
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);

  const pick = (index) => {
    if (!canAnswer || solved || wrongSet.has(index)) return;
    const source = order[index];
    const right = source === c.correctIndex;
    attempts.current += 1;
    if (firstTry.current === null) firstTry.current = right;
    setPicked(index);
    playSfx(right ? 'correct' : 'wrong');
    if (right) {
      setSolved(true);
      audio.pushOneOff(t(c.correctText));
    } else {
      setWrongSet((prev) => new Set([...prev, index]));
      audio.pushOneOff(t(c.wrong?.[source] ?? c.correctText));
    }
    onAnswer({
      stage: meta.scope,
      screenIdx: screen,
      question: t(c.question ?? c.title),
      options: shown,
      correctIndex,
      correctAnswer: shown[correctIndex],
      studentAnswerIndex: index,
      studentAnswer: shown[index],
      correct: right,
      firstTry: firstTry.current,
      attempts: attempts.current,
      solved: right,
    });
  };

  const wrongText = picked !== null && !solved ? t(c.wrong?.[order[picked]] ?? '') : '';
  const gatePassed = meta.scored ? solved : (solved || explanationDone(audio));
  const ready = canUseGrade4TheoryContinue(gatePassed, finish);

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
      canAdvance={ready}
      finish={finish}
      answer={(
        <>
          <Options
            items={shown}
            picked={picked}
            wrongSet={wrongSet}
            solved={solved}
            correctIndex={correctIndex}
            disabled={!canAnswer}
            onPick={pick}
            stack={stack}
            order={order}
          />
          <FeedbackBlock show={picked !== null} correct={solved}>
            {solved ? t(c.correctText) : wrongText}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard plain={plain} ratio={ratio}>
        {figure({ frame: audio.frame, solved, picked: picked === null ? null : order[picked], lang })}
      </ModelCard>
    </Stage>
  );
}

// --------------------------------------------------------------------------
// 3. Qiymatni o'z xonasiga qo'yish
//
// `c.slots` — xonalar ro'yxati (`{ label, caption }`), `c.correctSlot` — to'g'ri
// xona indeksi, `c.token` — qo'yiladigan qiymat, `c.wrong[i]` — har bir noto'g'ri
// xonaga izoh. Chizma tanlangan xonani `picked` orqali oladi.
// --------------------------------------------------------------------------
export function SlotScreen({
  screen, storedAnswer, onAnswer, onPrev, onNext, figure, plain = false, ratio = null,
}) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const [picked, setPicked] = useState(storedAnswer?.solved ? c.correctSlot : null);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.solved));
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);

  const pick = (index) => {
    if (!canAnswer || solved || wrongSet.has(index)) return;
    const right = index === c.correctSlot;
    attempts.current += 1;
    if (firstTry.current === null) firstTry.current = right;
    setPicked(index);
    playSfx(right ? 'correct' : 'wrong');
    if (right) { setSolved(true); audio.pushOneOff(t(c.correctText)); }
    else {
      setWrongSet((prev) => new Set([...prev, index]));
      audio.pushOneOff(t(c.wrong?.[index] ?? c.correctText));
    }
    onAnswer({
      stage: meta.scope,
      screenIdx: screen,
      question: t(c.question ?? c.title),
      options: c.slots.map((slot) => t(slot.label)),
      correctIndex: c.correctSlot,
      correctAnswer: t(c.slots[c.correctSlot].label),
      studentAnswerIndex: index,
      studentAnswer: t(c.slots[index].label),
      correct: right,
      firstTry: firstTry.current,
      attempts: attempts.current,
      solved: right,
    });
  };

  const wrongText = picked !== null && !solved ? t(c.wrong?.[picked] ?? '') : '';
  const ready = canUseGrade4TheoryContinue(meta.scored ? solved : (solved || explanationDone(audio)));

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
      canAdvance={ready}
      answer={(
        <>
          <div className="slot-row" role="group">
            {c.slots.map((slot, index) => {
              const state = solved && index === c.correctSlot
                ? 'slot-done'
                : wrongSet.has(index) ? 'slot-bad' : picked === index ? 'slot-active' : 'slot-empty';
              return (
                <button
                  type="button"
                  key={index}
                  className={`slot ${state}`}
                  disabled={!canAnswer || solved || wrongSet.has(index)}
                  onClick={() => pick(index)}
                >
                  <span>{t(slot.label)}</span>
                  {slot.caption && <small>{t(slot.caption)}</small>}
                </button>
              );
            })}
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>
            {solved ? t(c.correctText) : wrongText}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard plain={plain} ratio={ratio}>{figure({ frame: audio.frame, solved, picked })}</ModelCard>
    </Stage>
  );
}


// --------------------------------------------------------------------------
// 4. BuildScreen — bola shaklni O'ZI quradi.
//
// Tushuntirish kadrlari ovoz bilan ochiladi, ovoz tugagach chizma tegiladigan
// bo'ladi va bola qolgan qismini o'zi qo'yadi. Variant tanlash emas: javob
// harakat bilan hosil qilinadi (METODIK_PROFIL_MATEMATIKA.md 2-standart).
//
// Kontent: `c.buildSteps` — bola qo'yishi kerak bo'lgan nuqtalar soni,
// `c.correctText` — hammasi qo'yilgach, `c.wrongText` — xato tegishda.
// Chizma `figure({ frame, placed, misses, done, canPlace, onPick })` oladi va
// `onPick(true|false, key)` bilan har bir tegishni bildiradi.
// --------------------------------------------------------------------------
export function BuildScreen({
  screen, storedAnswer, onAnswer, onPrev, onNext, figure, ratio = null, plain = false,
}) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canPlace = useCanAnswer(audio);

  const total = c.buildSteps ?? 1;
  const [placed, setPlaced] = useState(() => (storedAnswer?.solved ? new Set(storedAnswer.placedKeys ?? []) : new Set()));
  const [misses, setMisses] = useState(0);
  const [lastWrong, setLastWrong] = useState(false);
  // Ref emas, state: `onPick` chizmaga render paytida uzatiladi, ref esa
  // render paytida o'qilmasligi kerak (react-hooks/refs).
  const [firstTry, setFirstTry] = useState(storedAnswer?.firstTry ?? null);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const done = storedAnswer?.solved === true || placed.size >= total;

  const onPick = (right, key) => {
    if (!canPlace || done) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (right && placed.has(key)) return;
    playSfx(right ? 'correct' : 'wrong');
    if (!right) {
      if (firstTry === null) setFirstTry(false);
      setMisses((value) => value + 1);
      setLastWrong(true);
      audio.pushOneOff(t(c.wrongText));
      return;
    }
    setLastWrong(false);
    const next = new Set([...placed, key]);
    setPlaced(next);
    if (next.size >= total) {
      if (firstTry === null) setFirstTry(true);
      audio.pushOneOff(t(c.correctText));
      onAnswer({
        stage: meta.scope,
        screenIdx: screen,
        question: t(c.question ?? c.title),
        options: [],
        correctIndex: 0,
        correctAnswer: t(c.correctText),
        studentAnswerIndex: 0,
        studentAnswer: `${next.size}/${total}`,
        correct: true,
        firstTry: firstTry !== false,
        attempts: nextAttempts,
        solved: true,
        placedKeys: [...next],
      });
    }
  };

  const ready = canUseGrade4TheoryContinue(done);
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      title={c.title}
      lead={c.lead}
      question={canPlace && !done ? c.question : undefined}
      onPrev={onPrev}
      onNext={onNext}
      canAdvance={ready}
      answer={(
        <>
          <div className="build-progress" aria-live="polite">
            {Array.from({ length: total }, (_, index) => (
              <i key={index} className={index < placed.size ? 'build-dot build-dot-done' : 'build-dot'} />
            ))}
            <span>{placed.size} / {total}</span>
          </div>
          <FeedbackBlock show={done || lastWrong} correct={done}>
            {done ? t(c.correctText) : t(c.wrongText)}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard plain={plain} ratio={ratio}>
        {figure({ frame: audio.frame, placed, misses, done, canPlace, onPick })}
      </ModelCard>
    </Stage>
  );
}
