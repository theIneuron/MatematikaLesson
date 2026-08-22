// 15, 16, 17-darslarning o'z mexanikalari.
//
// Uchalasida ham javob tayyor variantlar ro'yxatidan tanlanmaydi: bola uni
// asbob ustida hosil qiladi — chiziqni qo'yadi, formulani yig'adi, shkalada
// belgini bosadi. METODIK_PROFIL_MATEMATIKA.md 2-standarti shuni talab qiladi.
//
//   LevelPick    — 15-dars: ustunlarni qaysi balandlikda tenglashtirish kerak.
//   FormulaBuild — 16-dars: formulani belgilardan tartib bilan yig'ish.
//   ScaleRead    — 17-dars: shkalada kerakli belgini topish.
import { useRef, useState } from 'react';
import { canUseGrade4TheoryContinue } from '../theoryNavigation.js';
import {
  playSfx, useCanAnswer, useLesson, useNarration, useT,
} from '../theoryShell/runtime.js';
import { useWrongFlash } from '../wrongAnswerFlash.js';
import { FeedbackBlock, ModelCard, Stage } from './ui.jsx';
import { explanationDone } from './gate.js';
import { makeAnswer } from './answer.js';
import { LevelFigure, ScaleFigure } from './mathFigures.jsx';



// ---------------------------------------------------------------------------
// 1. LevelPick — o'rtacha qiymatni tenglashtirish orqali topish.
//
// Bola diagramma ostidagi shkaladan balandlikni tanlaydi, chiziq o'sha yerga
// ko'chadi va chizmada ortiqcha (to'q) hamda yetishmayotgan (punktir) qismlar
// ko'rinadi. To'g'ri balandlikda ortiqcha aynan bo'shliqni to'ldiradi.
//
// Kontent: `c.bars` — [{ label, value }], `c.ticks` — tanlash mumkin bo'lgan
// balandliklar, `c.correctLevel` — o'rtacha, `c.unit`, `c.tooHigh`, `c.tooLow`.
// ---------------------------------------------------------------------------
export function LevelPick({ screen, storedAnswer, onAnswer, onPrev, onNext }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const [picked, setPicked] = useState(storedAnswer?.solved ? c.correctLevel : null);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.solved));
  const [flashKey, flashWrong] = useWrongFlash();
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);

  const pick = (value) => {
    if (!canAnswer || solved) return;
    const right = value === c.correctLevel;
    attempts.current += 1;
    if (firstTry.current === null) firstTry.current = right;
    setPicked(value);
    playSfx(right ? 'correct' : 'wrong');
    const note = right ? c.correctText : (value > c.correctLevel ? c.tooHigh : c.tooLow);
    audio.pushOneOff(t(note));
    if (right) setSolved(true);
    else flashWrong(value);
    onAnswer(makeAnswer({
      screen,
      meta,
      question: t(c.question ?? c.title),
      options: c.ticks.map((tick) => String(tick)),
      correctIndex: c.ticks.indexOf(c.correctLevel),
      picked: c.ticks.indexOf(value),
      right,
      firstTry: firstTry.current,
      attempts: attempts.current,
    }));
  };

  const note = solved
    ? c.correctText
    : (picked === null ? null : (picked > c.correctLevel ? c.tooHigh : c.tooLow));

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
          <div className="level-scale" role="group" aria-label={t(c.question ?? c.title)}>
            {c.ticks.map((value) => (
              <button
                type="button"
                key={value}
                // Xato tanlovdan keyin belgi neytral bo'ladi; chizmada esa
                // tanlangan balandlik qoladi — izoh shuni tushuntiradi.
                className={`level-tick ${solved && value === c.correctLevel ? 'level-tick-done' : ''}`}
                data-g4-branch="level"
                data-g4-source-index={value}
                data-g4-correct={value === c.correctLevel ? 'true' : 'false'}
                data-g4-wrong-flash={flashKey === value ? 'true' : undefined}
                data-g4-answer-dim={solved && value !== c.correctLevel ? 'true' : undefined}
                disabled={!canAnswer || solved}
                onClick={() => pick(value)}
              >
                {value}
              </button>
            ))}
            <span className="level-unit">{t(c.unit)}</span>
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>
            {note ? t(note) : ''}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard>
        <LevelFigure
          bars={c.bars.map((bar) => ({ label: t(bar.label), value: bar.value }))}
          level={solved ? null : picked}
          target={c.correctLevel}
          settled={solved}
          unit={t(c.unit)}
        />
      </ModelCard>
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// 2. FormulaBuild — formulani belgilardan tartib bilan yig'ish.
//
// Formula — bir marta yozilgan va har safar ishlaydigan qoida. Uni bola o'zi
// tuzsa, harflar nimani anglatishini eslab qoladi. Belgilar tartib bilan
// qo'yiladi: navbatdagi belgi noto'g'ri bo'lsa, qator o'zgarmaydi.
//
// Kontent: `c.target` — belgilar ketma-ketligi, `c.pool` — tugmalar tartibi,
// `c.wrongText` — noto'g'ri belgiga izoh, `c.correctText` — yig'ilgach.
// ---------------------------------------------------------------------------
export function FormulaBuild({ screen, storedAnswer, onAnswer, onPrev, onNext, figure, ratio = null, plain = false }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const [step, setStep] = useState(storedAnswer?.solved ? c.target.length : 0);
  const [usedPool, setUsedPool] = useState(() => (storedAnswer?.solved ? new Set(c.pool.map((_, i) => i)) : new Set()));
  const [lastWrong, setLastWrong] = useState(false);
  const [flashKey, flashWrong] = useWrongFlash();
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const solved = step >= c.target.length;

  const need = solved ? null : c.target[step];

  const tap = (index) => {
    if (!canAnswer || solved || usedPool.has(index)) return;
    const right = c.pool[index] === need;
    attempts.current += 1;
    if (firstTry.current === null) firstTry.current = right;
    playSfx(right ? 'correct' : 'wrong');
    if (!right) {
      setLastWrong(true);
      flashWrong(index);
      audio.pushOneOff(t(c.wrongText));
      return;
    }
    setLastWrong(false);
    setUsedPool((prev) => new Set([...prev, index]));
    const next = step + 1;
    setStep(next);
    if (next >= c.target.length) {
      audio.pushOneOff(t(c.correctText));
      onAnswer(makeAnswer({
        screen,
        meta,
        question: t(c.question ?? c.title),
        options: [c.target.join(' ')],
        correctIndex: 0,
        picked: 0,
        right: true,
        firstTry: firstTry.current !== false,
        attempts: attempts.current,
      }));
    }
  };

  // Bir xil belgi ikki marta uchrasa (masalan qavslar), navbatdagisi hali
  // ishlatilmagani tanlanadi — aks holda to'g'ri tugma o'chib qolardi.
  const nextRightIndex = solved
    ? -1
    : c.pool.findIndex((token, index) => token === need && !usedPool.has(index));

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
          <div className={`formula-line ${solved ? 'formula-line-done' : ''}`} aria-live="polite">
            {c.prefix && <span className="formula-prefix">{c.prefix}</span>}
            {c.target.map((token, index) => (
              <span key={index} className={index < step ? 'formula-slot formula-slot-filled' : 'formula-slot'}>
                {index < step ? token : ''}
              </span>
            ))}
          </div>
          <div className="token-row" role="group">
            {c.pool.map((token, index) => (
              <button
                type="button"
                key={index}
                className={`token ${usedPool.has(index) ? 'token-used' : ''}`}
                data-g4-branch="token"
                data-g4-source-index={index}
                data-g4-correct={index === nextRightIndex ? 'true' : 'false'}
                data-g4-wrong-flash={flashKey === index ? 'true' : undefined}
                disabled={!canAnswer || solved || usedPool.has(index)}
                onClick={() => tap(index)}
              >
                {token}
              </button>
            ))}
          </div>
          <FeedbackBlock show={solved || lastWrong} correct={solved}>
            {solved ? t(c.correctText) : t(c.wrongText)}
          </FeedbackBlock>
        </>
      )}
    >
      <ModelCard ratio={ratio} plain={plain}>
        {figure({ frame: audio.frame, solved, step })}
      </ModelCard>
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// 3. ScaleRead — shkalada kerakli belgini topish.
//
// Bola imzolangan sonlar orasidagi bo'linmalarni sanab, so'ralgan qiymat
// turgan belgini bosadi. Javob asbobning o'zida beriladi, ro'yxatda emas.
//
// Kontent: `c.scale` — { min, max, majorEvery, minorPerMajor, vertical, unit },
// `c.target` — topiladigan qiymat, `c.wrongNear` — qo'shni belgi bosilganda,
// `c.wrongFar` — uzoqroq belgi bosilganda.
// ---------------------------------------------------------------------------
export function ScaleRead({ screen, storedAnswer, onAnswer, onPrev, onNext }) {
  const t = useT();
  const lesson = useLesson();
  const c = lesson.content[`s${screen}`];
  const meta = lesson.screenMeta[screen];
  const audio = useNarration(c.audio, screen);
  const canAnswer = useCanAnswer(audio);

  const step = c.scale.majorEvery / c.scale.minorPerMajor;
  const [picked, setPicked] = useState(storedAnswer?.solved ? c.target : null);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.solved));
  const [flashKey, flashWrong] = useWrongFlash();
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);

  const pick = (value) => {
    if (!canAnswer || solved) return;
    const right = value === c.target;
    attempts.current += 1;
    if (firstTry.current === null) firstTry.current = right;
    setPicked(value);
    playSfx(right ? 'correct' : 'wrong');
    const note = right ? c.correctText : (Math.abs(value - c.target) <= step ? c.wrongNear : c.wrongFar);
    audio.pushOneOff(t(note));
    if (right) setSolved(true);
    else flashWrong(value);
    onAnswer(makeAnswer({
      screen,
      meta,
      question: t(c.question ?? c.title),
      options: [String(c.target)],
      correctIndex: 0,
      picked: 0,
      right,
      firstTry: firstTry.current,
      attempts: attempts.current,
    }));
  };

  const note = solved
    ? c.correctText
    : (picked === null ? null : (Math.abs(picked - c.target) <= step ? c.wrongNear : c.wrongFar));

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
          <div className={`scale-target ${solved ? 'scale-target-done' : ''}`}>
            <span>{c.target}</span>
            <small>{t(c.scale.unit)}</small>
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>
            {note ? t(note) : ''}
          </FeedbackBlock>
        </>
      )}
    >
      {/* Tik shkalada karta balandroq bo'ladi: telefonda 520/232 nisbatda
          belgilar orasi bir necha piksel qolib, barmoq bilan bosib bo'lmasdi.
          Kengroq ekranda `max-height` baribir cheklab turadi. */}
      <ModelCard ratio={c.scale.vertical ? '5 / 6' : '520 / 150'}>
        <ScaleFigure
          min={c.scale.min}
          max={c.scale.max}
          majorEvery={c.scale.majorEvery}
          minorPerMajor={c.scale.minorPerMajor}
          vertical={Boolean(c.scale.vertical)}
          tube={Boolean(c.scale.tube)}
          unit={t(c.scale.unit)}
          highlight={solved ? c.target : null}
          caption={c.caption ? t(c.caption) : null}
          interactive={{
            target: c.target,
            // Yechilmagan holatda shkalada hech qanday belgi qolmaydi: xato
            // tanlov faqat `flashValue` orqali qisqa vaqt qizarib ko'rinadi.
            picked: solved ? c.target : null,
            flashValue: flashKey,
            disabled: !canAnswer || solved,
            onPick: pick,
          }}
        />
      </ModelCard>
    </Stage>
  );
}
